import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extname, join } from 'node:path';

// The one swap point. Today it reads/writes the committed JSON and drops
// uploaded files into public/media. A future live /admin replaces the body of
// these three functions with Postgres + Vercel Blob; nothing else in the app or
// the editor changes.

const SLOT_KEY_ORDER = ['type', 'src', 'poster', 'fit', 'position', 'scale', 'box', 'placement', 'updatedAt'];

function validateBox(id, boxValue) {
  if (boxValue == null) return;
  if (typeof boxValue !== 'object') throw new Error(`${id}: box must be an object`);
  const { width, height, radius, aspect } = boxValue;
  if (width != null && (typeof width !== 'number' || width < 10 || width > 100)) {
    throw new Error(`${id}: box.width must be 10..100`);
  }
  if (height != null && (typeof height !== 'number' || height < 1)) {
    throw new Error(`${id}: box.height must be a positive number or null`);
  }
  if (radius != null && (typeof radius !== 'number' || radius < 0)) {
    throw new Error(`${id}: box.radius must be >= 0`);
  }
  if (aspect != null && (typeof aspect !== 'string' || !aspect.trim())) {
    throw new Error(`${id}: box.aspect must be a non-empty string or null`);
  }
}

function validatePlacement(id, p) {
  if (p == null) return;
  if (typeof p !== 'object') throw new Error(`${id}: placement must be an object`);
  if (typeof p.region !== 'string' || !p.region) throw new Error(`${id}: placement.region must be a non-empty string`);
  for (const axis of ['x', 'y']) {
    if (p[axis] != null && (typeof p[axis] !== 'number' || p[axis] < 0 || p[axis] > 100)) {
      throw new Error(`${id}: placement.${axis} must be 0..100`);
    }
  }
  if (p.z != null && typeof p.z !== 'number') throw new Error(`${id}: placement.z must be a number`);
  if (p.flow != null && typeof p.flow !== 'boolean') throw new Error(`${id}: placement.flow must be a boolean`);
  if (p.flowAt != null && !['top', 'bottom'].includes(p.flowAt)) {
    throw new Error(`${id}: placement.flowAt must be top|bottom`);
  }
}

export function validateConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('config must be an object');
  if (typeof config.version !== 'number') throw new Error('config.version must be a number');
  if (!config.slots || typeof config.slots !== 'object') throw new Error('config.slots must be an object');
  for (const [id, slot] of Object.entries(config.slots)) {
    if (!['image', 'video'].includes(slot.type)) throw new Error(`${id}: type must be image|video`);
    if (!['cover', 'contain'].includes(slot.fit)) throw new Error(`${id}: fit must be cover|contain`);
    if (typeof slot.src !== 'string' || !slot.src) throw new Error(`${id}: src must be a non-empty string`);
    if (slot.poster != null && typeof slot.poster !== 'string') {
      throw new Error(`${id}: poster must be a string or null`);
    }
    const p = slot.position || {};
    for (const axis of ['x', 'y']) {
      if (typeof p[axis] !== 'number' || p[axis] < 0 || p[axis] > 100) {
        throw new Error(`${id}: position.${axis} must be 0..100`);
      }
    }
    if (typeof slot.scale !== 'number' || slot.scale < 1 || slot.scale > 3) {
      throw new Error(`${id}: scale must be 1..3`);
    }
    validateBox(id, slot.box);
    validatePlacement(id, slot.placement);
  }
  return true;
}

// A slot with no src yet is an unfinished draft in the editor (just added, no
// file attached). Drop those on write rather than failing the whole save — one
// unfinished slot must not block persisting every other edit.
export function pruneDraftSlots(config) {
  const slots = {};
  for (const [id, slot] of Object.entries(config.slots || {})) {
    if (slot && typeof slot.src === 'string' && slot.src.trim()) slots[id] = slot;
  }
  return { ...config, slots };
}

const round = (n, dp) => Math.round(n * 10 ** dp) / 10 ** dp;

// Deterministic key order + tidy numbers so diffs stay small and reviewable.
export function orderConfig(config) {
  const out = { version: config.version, slots: {} };
  for (const id of Object.keys(config.slots).sort()) {
    const slot = config.slots[id];
    const ordered = {};
    for (const key of SLOT_KEY_ORDER) if (key in slot) ordered[key] = slot[key];
    for (const key of Object.keys(slot)) if (!(key in ordered)) ordered[key] = slot[key];
    if (ordered.position) {
      ordered.position = { x: round(ordered.position.x, 1), y: round(ordered.position.y, 1) };
    }
    if (typeof ordered.scale === 'number') ordered.scale = round(ordered.scale, 2);
    if (ordered.box && typeof ordered.box === 'object') {
      const b = ordered.box;
      if (typeof b.width === 'number') b.width = round(b.width, 1);
      if (typeof b.height === 'number') b.height = round(b.height, 0);
      if (typeof b.radius === 'number') b.radius = round(b.radius, 0);
    }
    if (ordered.placement && typeof ordered.placement === 'object') {
      const p = ordered.placement;
      if (typeof p.x === 'number') p.x = round(p.x, 1);
      if (typeof p.y === 'number') p.y = round(p.y, 1);
    }
    out.slots[id] = ordered;
  }
  return out;
}

export function validateTextConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('text config must be an object');
  if (!config.entries || typeof config.entries !== 'object') throw new Error('text config.entries must be an object');
  for (const [id, entry] of Object.entries(config.entries)) {
    if (!entry || typeof entry.text !== 'string') throw new Error(`${id}: entry.text must be a string`);
  }
  return true;
}

export function createStorage({ root }) {
  const configPath = join(root, 'src', 'data', 'mediaConfig.json');
  const textPath = join(root, 'src', 'data', 'textConfig.json');
  const mediaDir = join(root, 'public', 'media');

  return {
    async readConfig() {
      return JSON.parse(await readFile(configPath, 'utf8'));
    },

    async readTextConfig() {
      return JSON.parse(await readFile(textPath, 'utf8'));
    },

    async writeTextConfig(config) {
      validateTextConfig(config);
      const ordered = { version: config.version || 1, entries: {} };
      for (const id of Object.keys(config.entries).sort()) ordered.entries[id] = { text: config.entries[id].text };
      await writeFile(textPath, JSON.stringify(ordered, null, 2) + '\n', 'utf8');
      return ordered;
    },

    async writeConfig(config) {
      const pruned = pruneDraftSlots(config);
      validateConfig(pruned);
      const ordered = orderConfig(pruned);
      await writeFile(configPath, JSON.stringify(ordered, null, 2) + '\n', 'utf8');
      return ordered;
    },

    async saveFile(slotId, buffer, originalName) {
      if (!buffer || !buffer.length) throw new Error('empty file');
      const ext = (extname(originalName || '') || '.bin').toLowerCase();
      const hash = createHash('sha1').update(buffer).digest('hex').slice(0, 8);
      const safeSlot = String(slotId || 'slot').replace(/[^a-z0-9._-]/gi, '-');
      const filename = `${safeSlot}-${hash}${ext}`;
      await mkdir(mediaDir, { recursive: true });
      await writeFile(join(mediaDir, filename), buffer);
      const type = /\.(mp4|webm|mov|m4v|ogv)$/i.test(ext) ? 'video' : 'image';
      return { src: `/media/${filename}`, type };
    },
  };
}

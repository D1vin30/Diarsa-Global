import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStorage, validateConfig, orderConfig } from './storage.mjs';

const seed = {
  version: 1,
  slots: {
    'about.photo': { type: 'image', src: '/a.jpg', fit: 'cover', position: { x: 50, y: 35 }, scale: 1 },
  },
};

let root;
let storage;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'media-studio-'));
  await mkdir(join(root, 'src', 'data'), { recursive: true });
  await writeFile(join(root, 'src', 'data', 'mediaConfig.json'), JSON.stringify(seed, null, 2));
  await writeFile(join(root, 'src', 'data', 'textConfig.json'), JSON.stringify({ version: 1, entries: {} }, null, 2));
  storage = createStorage({ root });
});

describe('readConfig', () => {
  it('parses the committed json', async () => {
    expect(await storage.readConfig()).toEqual(seed);
  });
});

describe('writeConfig', () => {
  it('writes pretty json with a trailing newline and sorted slot keys', async () => {
    const next = {
      version: 1,
      slots: {
        'z.slot': { scale: 1, position: { x: 10, y: 20 }, fit: 'cover', src: '/z.jpg', type: 'image' },
        'a.slot': { type: 'image', src: '/a.jpg', fit: 'contain', position: { x: 0, y: 0 }, scale: 2 },
      },
    };
    const returned = await storage.writeConfig(next);
    const onDisk = await readFile(join(root, 'src', 'data', 'mediaConfig.json'), 'utf8');

    expect(onDisk.endsWith('}\n')).toBe(true);
    expect(Object.keys(returned.slots)).toEqual(['a.slot', 'z.slot']);
    expect(Object.keys(returned.slots['z.slot'])).toEqual(['type', 'src', 'fit', 'position', 'scale']);
    expect(JSON.parse(onDisk)).toEqual(returned);
  });

  it('rounds noisy float positions to 1dp and scale to 2dp', async () => {
    const noisy = {
      version: 1,
      slots: {
        s: { type: 'image', src: '/s.jpg', fit: 'cover', position: { x: 68.26209686970115, y: 78.19496 }, scale: 1.33333 },
      },
    };
    const out = await storage.writeConfig(noisy);
    expect(out.slots.s.position).toEqual({ x: 68.3, y: 78.2 });
    expect(out.slots.s.scale).toBe(1.33);
  });

  it('rejects an out-of-range position', async () => {
    const bad = { version: 1, slots: { x: { type: 'image', src: '/x.jpg', fit: 'cover', position: { x: 150, y: 0 }, scale: 1 } } };
    await expect(storage.writeConfig(bad)).rejects.toThrow(/position\.x/);
  });

  it('rejects an unknown fit', async () => {
    const bad = { version: 1, slots: { x: { type: 'image', src: '/x.jpg', fit: 'fill', position: { x: 0, y: 0 }, scale: 1 } } };
    await expect(storage.writeConfig(bad)).rejects.toThrow(/fit/);
  });

  it('keeps poster + box in canonical key order and rounds box numbers', async () => {
    const next = {
      version: 1,
      slots: {
        v: {
          box: { radius: 4.7, width: 66.66666, height: 281.4, aspect: null },
          scale: 1,
          position: { x: 50, y: 50 },
          fit: 'cover',
          poster: '/p.jpg',
          src: '/v.mp4',
          type: 'video',
        },
      },
    };
    const out = await storage.writeConfig(next);
    expect(Object.keys(out.slots.v)).toEqual(['type', 'src', 'poster', 'fit', 'position', 'scale', 'box']);
    expect(out.slots.v.box).toEqual({ radius: 5, width: 66.7, height: 281, aspect: null });
  });

  it('rejects an out-of-range box.width', async () => {
    const bad = {
      version: 1,
      slots: { x: { type: 'image', src: '/x.jpg', fit: 'cover', position: { x: 0, y: 0 }, scale: 1, box: { width: 400 } } },
    };
    await expect(storage.writeConfig(bad)).rejects.toThrow(/box\.width/);
  });

  it('keeps + rounds a placement, and orders it after box', async () => {
    const next = {
      version: 1,
      slots: {
        'custom.page:/.abc': {
          type: 'image',
          src: '/m.jpg',
          fit: 'cover',
          position: { x: 50, y: 50 },
          scale: 1,
          box: { width: 40, aspect: '4 / 3', height: null, radius: 4 },
          placement: { region: 'page:/', x: 33.33333, y: 66.66666, z: 2 },
        },
      },
    };
    const out = await storage.writeConfig(next);
    const slot = out.slots['custom.page:/.abc'];
    expect(Object.keys(slot)).toEqual(['type', 'src', 'fit', 'position', 'scale', 'box', 'placement']);
    expect(slot.placement).toEqual({ region: 'page:/', x: 33.3, y: 66.7, z: 2 });
  });

  it('rejects a placement without a region', async () => {
    const bad = {
      version: 1,
      slots: { x: { type: 'image', src: '/x.jpg', fit: 'cover', position: { x: 0, y: 0 }, scale: 1, placement: { x: 10, y: 10 } } },
    };
    await expect(storage.writeConfig(bad)).rejects.toThrow(/placement\.region/);
  });

  it('drops an unfinished slot (empty src) instead of rejecting the whole save', async () => {
    const withDraft = {
      version: 1,
      slots: {
        'about.photo': { type: 'image', src: '/a.jpg', fit: 'cover', position: { x: 50, y: 50 }, scale: 1 },
        'custom.hero.new': {
          type: 'image', src: '', fit: 'cover', position: { x: 50, y: 50 }, scale: 1,
          placement: { region: 'hero', x: 50, y: 50, z: 1, flow: true, flowAt: 'bottom' },
        },
      },
    };
    const out = await storage.writeConfig(withDraft);
    expect(Object.keys(out.slots)).toEqual(['about.photo']);
    const onDisk = JSON.parse(await readFile(join(root, 'src', 'data', 'mediaConfig.json'), 'utf8'));
    expect(onDisk).toEqual(out);
  });

  it('writes an empty slots map when every slot is an unfinished draft', async () => {
    const out = await storage.writeConfig({
      version: 1,
      slots: { 'custom.a': { type: 'image', src: '   ', fit: 'cover', position: { x: 50, y: 50 }, scale: 1 } },
    });
    expect(out.slots).toEqual({});
  });
});

describe('saveFile', () => {
  it('writes into public/media with a slot-and-hash name and returns its url + type', async () => {
    const buf = Buffer.from('fake-jpeg-bytes');
    const { src, type } = await storage.saveFile('about.photo', buf, 'my upload.JPG');
    expect(src).toMatch(/^\/media\/about\.photo-[0-9a-f]{8}\.jpg$/);
    expect(type).toBe('image');
    const written = await readFile(join(root, 'public', src.replace('/media/', 'media/')));
    expect(written.equals(buf)).toBe(true);
  });

  it('infers video type from the extension', async () => {
    const { src, type } = await storage.saveFile('clip', Buffer.from('mp4-bytes'), 'reel.MP4');
    expect(type).toBe('video');
    expect(src).toMatch(/\.mp4$/);
  });

  it('is deterministic for identical bytes', async () => {
    const buf = Buffer.from('same');
    const a = await storage.saveFile('s', buf, 'a.png');
    const b = await storage.saveFile('s', buf, 'b.png');
    expect(a.src).toBe(b.src);
  });

  it('rejects an empty file', async () => {
    await expect(storage.saveFile('s', Buffer.alloc(0), 'e.jpg')).rejects.toThrow(/empty/);
  });
});

describe('text config', () => {
  it('reads the seeded text config', async () => {
    expect(await storage.readTextConfig()).toEqual({ version: 1, entries: {} });
  });

  it('writes text entries sorted, one text key each, trailing newline', async () => {
    const out = await storage.writeTextConfig({
      version: 1,
      entries: {
        'hero.2.headline': { text: 'Two' },
        'hero.1.headline': { text: 'One', junk: 'x' },
      },
    });
    expect(Object.keys(out.entries)).toEqual(['hero.1.headline', 'hero.2.headline']);
    expect(out.entries['hero.1.headline']).toEqual({ text: 'One' });
    const onDisk = await readFile(join(root, 'src', 'data', 'textConfig.json'), 'utf8');
    expect(onDisk.endsWith('}\n')).toBe(true);
  });

  it('rejects a non-string text value', async () => {
    await expect(storage.writeTextConfig({ version: 1, entries: { a: { text: 5 } } })).rejects.toThrow(/text must be a string/);
  });
});

describe('validateConfig / orderConfig units', () => {
  it('validateConfig passes the seed', () => {
    expect(validateConfig(seed)).toBe(true);
  });
  it('orderConfig sorts slots and canonicalises key order', () => {
    const out = orderConfig({
      version: 1,
      slots: { b: { scale: 1, type: 'image', src: '/b', fit: 'cover', position: { x: 1, y: 2 } } },
    });
    expect(Object.keys(out.slots.b)).toEqual(['type', 'src', 'fit', 'position', 'scale']);
  });
  it('validateConfig accepts a slot with a full box + poster', () => {
    expect(
      validateConfig({
        version: 1,
        slots: {
          v: {
            type: 'video',
            src: '/v.mp4',
            poster: '/p.jpg',
            fit: 'cover',
            position: { x: 50, y: 50 },
            scale: 1,
            box: { width: 80, aspect: '16 / 9', height: null, radius: 6 },
          },
        },
      }),
    ).toBe(true);
  });
});

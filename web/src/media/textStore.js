// External store for editable copy. Seeded from the committed textConfig.json;
// EditableText subscribes via useSyncExternalStore. Saving PUTs the whole thing
// back to the studio server, which writes the JSON. In production there is no
// server — the store just serves the committed text (edits still show live
// because they were baked into the JSON at save time).

import seed from '../data/textConfig.json';

const isDev = import.meta.env.DEV;

let entries = { ...(seed.entries || {}) };
let savedJSON = JSON.stringify(entries);
let saving = false;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// A stable snapshot for useSyncExternalStore: the JSON string changes iff the
// data changes, so components re-render only on real edits.
export function getSnapshot() {
  return savedStateKey;
}
let savedStateKey = JSON.stringify(entries) + '|clean';

function refreshKey() {
  savedStateKey = JSON.stringify(entries) + (JSON.stringify(entries) === savedJSON ? '|clean' : '|dirty');
}

export function getText(id, fallback) {
  const v = entries[id]?.text;
  return typeof v === 'string' ? v : fallback;
}

export function setText(id, text) {
  const clean = (text ?? '').replace(/\s+$/g, '');
  if (entries[id]?.text === clean) return;
  entries = { ...entries, [id]: { text: clean } };
  refreshKey();
  emit();
}

export function isDirty() {
  return JSON.stringify(entries) !== savedJSON;
}

export function isSaving() {
  return saving;
}

export async function save() {
  if (!isDev || !isDirty()) return;
  saving = true;
  emit();
  try {
    const res = await fetch('/api/text', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 1, entries }),
    });
    if (!res.ok) throw new Error(`text save failed: ${res.status}`);
    const persisted = await res.json();
    entries = { ...(persisted.entries || {}) };
    savedJSON = JSON.stringify(entries);
  } finally {
    saving = false;
    refreshKey();
    emit();
  }
}

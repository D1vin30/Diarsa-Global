import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import seedConfig from '../data/mediaConfig.json';
import { DEFAULT_BOX } from './position';

const MediaConfigContext = createContext(null);

const isDev = import.meta.env.DEV;

const BLANK_SLOT = {
  type: 'image',
  fit: 'cover',
  position: { x: 50, y: 50 },
  scale: 1,
  poster: null,
  box: DEFAULT_BOX,
};

function cloneConfig(cfg) {
  return JSON.parse(JSON.stringify(cfg));
}

export function MediaConfigProvider({ children }) {
  // Working copy the app renders from. Seeded from the committed JSON; after a
  // successful save the JSON file changes on disk and Vite HMR re-seeds this.
  const [config, setConfig] = useState(() => cloneConfig(seedConfig));
  const [savedJSON, setSavedJSON] = useState(() => JSON.stringify(seedConfig));
  const [saving, setSaving] = useState(false);

  const getSlot = useCallback((id) => config.slots[id], [config]);

  const updateSlot = useCallback((id, patch) => {
    setConfig((prev) => {
      const existing = prev.slots[id] || cloneConfig(BLANK_SLOT);
      const next = cloneConfig(prev);
      const mergedPlacement =
        'placement' in patch
          ? patch.placement === null
            ? null
            : { ...(existing.placement || {}), ...patch.placement }
          : existing.placement;
      next.slots[id] = {
        ...existing,
        ...patch,
        position: { ...existing.position, ...(patch.position || {}) },
        box: { ...(existing.box || DEFAULT_BOX), ...(patch.box || {}) },
        ...(mergedPlacement === undefined ? {} : { placement: mergedPlacement }),
      };
      if (next.slots[id].placement == null) delete next.slots[id].placement;
      return next;
    });
  }, []);

  const replaceSrc = useCallback((id, src) => updateSlot(id, { src }), [updateSlot]);

  // Create a new slot in a region. Defaults to an in-flow block (takes its own
  // space, pushes content) — switch it to an overlay in the editor if wanted.
  const addSlot = useCallback((region, type = 'image') => {
    const id = `custom.${region}.${Date.now().toString(36)}`;
    setConfig((prev) => {
      const next = cloneConfig(prev);
      next.slots[id] = {
        ...cloneConfig(BLANK_SLOT),
        type,
        src: '',
        box: { ...DEFAULT_BOX, width: 60 },
        placement: { region, x: 50, y: 50, z: 1, flow: true, flowAt: 'bottom' },
      };
      return next;
    });
    return id;
  }, []);

  const removeSlot = useCallback((id) => {
    setConfig((prev) => {
      if (!prev.slots[id]) return prev;
      const next = cloneConfig(prev);
      delete next.slots[id];
      return next;
    });
  }, []);

  const resetSlot = useCallback((id) => {
    const saved = JSON.parse(savedJSON);
    setConfig((prev) => {
      const next = cloneConfig(prev);
      if (saved.slots[id]) next.slots[id] = cloneConfig(saved.slots[id]);
      else delete next.slots[id];
      return next;
    });
  }, [savedJSON]);

  const dirty = useMemo(() => JSON.stringify(config) !== savedJSON, [config, savedJSON]);

  const save = useCallback(async () => {
    if (!isDev) return;
    setSaving(true);
    try {
      const stamped = cloneConfig(config);
      const now = new Date().toISOString();
      for (const id of Object.keys(stamped.slots)) stamped.slots[id].updatedAt = now;
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stamped),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error || `save failed: ${res.status}`);
      }
      const persisted = await res.json();
      setConfig(cloneConfig(persisted));
      setSavedJSON(JSON.stringify(persisted));
    } finally {
      setSaving(false);
    }
  }, [config]);

  const uploadFile = useCallback(async (id, file) => {
    const form = new FormData();
    form.append('slotId', id);
    form.append('file', file);
    const res = await fetch('/api/media/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error(`upload failed: ${res.status}`);
    const { src, type } = await res.json();
    updateSlot(id, type === 'video' ? { src, type, poster: null } : { src, type });
    return src;
  }, [updateSlot]);

  const slotsInRegion = useCallback(
    (region) => Object.entries(config.slots).filter(([, s]) => s.placement?.region === region).map(([id]) => id),
    [config],
  );

  const value = useMemo(
    () => ({
      config, getSlot, updateSlot, replaceSrc, resetSlot, uploadFile,
      addSlot, removeSlot, slotsInRegion, dirty, saving, save,
    }),
    [config, getSlot, updateSlot, replaceSrc, resetSlot, uploadFile, addSlot, removeSlot, slotsInRegion, dirty, saving, save],
  );

  return <MediaConfigContext.Provider value={value}>{children}</MediaConfigContext.Provider>;
}

export function useMediaConfig() {
  const ctx = useContext(MediaConfigContext);
  if (!ctx) throw new Error('useMediaConfig must be used inside <MediaConfigProvider>');
  return ctx;
}

// Pure, read-only style math for slots. No editing logic — this file (and
// Slot.jsx / MediaRegion.jsx / EditableText.jsx next to it) is the only piece
// of the DIARSA image-arranging tool that ships to production. The
// interactive drag/zoom/add editor lives entirely outside this repo, in a
// separate local-only tool.

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

const DEFAULT_POSITION = { x: 50, y: 50 };
export const DEFAULT_BOX = { width: 100, aspect: '4 / 3', height: null, radius: 4 };

// Merge a raw mediaConfig.json entry (possibly missing) onto sane defaults.
export function normalizeSlot(slot) {
  const s = slot || {};
  const pos = s.position || {};
  return {
    type: s.type === 'video' ? 'video' : 'image',
    src: s.src || '',
    caption: typeof s.caption === 'string' ? s.caption : '',
    position: {
      x: typeof pos.x === 'number' ? clamp(pos.x, 0, 100) : DEFAULT_POSITION.x,
      y: typeof pos.y === 'number' ? clamp(pos.y, 0, 100) : DEFAULT_POSITION.y,
    },
    scale: typeof s.scale === 'number' ? clamp(s.scale, 1, 3) : 1,
  };
}

// Slot -> the inline style that positions/zooms the media inside its frame.
export function slotToStyle(slot) {
  const s = normalizeSlot(slot);
  const style = { objectPosition: `${s.position.x}% ${s.position.y}%` };
  if (s.scale !== 1) {
    style.transform = `scale(${s.scale})`;
    style.transformOrigin = style.objectPosition;
  }
  return style;
}

// A slot added freeform (via the "+ add here" tool) carries a box (its own
// size/shape) and a placement (where in its region). Fixed call sites — an
// <img> a page author wrote by hand — use neither; the page's own className
// defines the frame.
export function normalizeBox(box) {
  const b = box || {};
  return {
    width: typeof b.width === 'number' ? clamp(b.width, 10, 100) : DEFAULT_BOX.width,
    aspect: b.aspect === null ? null : typeof b.aspect === 'string' && b.aspect.trim() ? b.aspect.trim() : DEFAULT_BOX.aspect,
    height: typeof b.height === 'number' ? Math.max(40, b.height) : null,
    radius: typeof b.radius === 'number' ? Math.max(0, b.radius) : DEFAULT_BOX.radius,
  };
}

export function normalizePlacement(p) {
  if (!p || typeof p.region !== 'string' || !p.region) return null;
  return {
    region: p.region,
    x: typeof p.x === 'number' ? clamp(p.x, 0, 100) : 50,
    y: typeof p.y === 'number' ? clamp(p.y, 0, 100) : 50,
    z: typeof p.z === 'number' ? Math.round(p.z) : 1,
    flow: p.flow === true,
    flowAt: p.flowAt === 'top' ? 'top' : 'bottom',
  };
}

// Box -> the frame <div>/<figure> style (size + shape).
export function boxToStyle(box) {
  const b = normalizeBox(box);
  const style = { position: 'relative', width: `${b.width}%`, marginInline: 'auto', borderRadius: `${b.radius}px`, overflow: 'hidden' };
  if (b.aspect) style.aspectRatio = b.aspect;
  else style.height = b.height != null ? `${b.height}px` : '100%';
  return style;
}

// Overlay placement -> style for the wrapper that positions it over the region.
export function placementToStyle(placement) {
  const p = normalizePlacement(placement);
  if (!p || p.flow) return null;
  return { position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', zIndex: p.z };
}

// In-flow placement -> a centred block that takes real space in the region.
export function flowBlockStyle(box) {
  return { ...boxToStyle(box), margin: '2rem auto' };
}

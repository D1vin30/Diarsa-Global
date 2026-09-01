// Pure helpers for the media framing editor. No React, no DOM — unit tested.

export const SCALE_MIN = 1;
export const SCALE_MAX = 3;
export const WIDTH_MIN = 10; // percent of the placement cell
export const WIDTH_MAX = 100;
export const HEIGHT_MIN = 40; // px, when the box runs on a free height

export const DEFAULT_BOX = { width: 100, aspect: '4 / 3', height: null, radius: 4 };

export const VIDEO_RE = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i;

// Guess media type from a URL when config carries no explicit `type`.
export function inferType(src) {
  return VIDEO_RE.test(src || '') ? 'video' : 'image';
}

export const DEFAULT_SLOT = {
  type: 'image',
  fit: 'cover',
  position: { x: 50, y: 50 },
  scale: 1,
  poster: null,
  box: DEFAULT_BOX,
};

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function normalizeBox(box) {
  const b = box || {};
  return {
    width: typeof b.width === 'number' ? clamp(b.width, WIDTH_MIN, WIDTH_MAX) : DEFAULT_BOX.width,
    // `null` is a deliberate choice (free height); `undefined` falls back to the default ratio.
    aspect:
      b.aspect === null
        ? null
        : typeof b.aspect === 'string' && b.aspect.trim()
          ? b.aspect.trim()
          : DEFAULT_BOX.aspect,
    height: typeof b.height === 'number' ? Math.max(HEIGHT_MIN, b.height) : null,
    radius: typeof b.radius === 'number' ? Math.max(0, b.radius) : DEFAULT_BOX.radius,
  };
}

// A slot may be pinned into a MediaRegion instead of sitting where its
// <MediaSlot> is written in the JSX. `null` = in-place. Two layouts:
//   flow:false (default) -> `overlay`: absolutely positioned at x/y over content
//   flow:true            -> `in-flow`: a real block at the region's top or bottom
//                           that takes its own space and pushes content
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

// Merge a raw config entry (possibly undefined / partial) onto the defaults.
export function normalizeSlot(slot, fallbackSrc) {
  const s = slot || {};
  const pos = s.position || {};
  const src = s.src || fallbackSrc || '';
  return {
    type: s.type === 'video' || s.type === 'image' ? s.type : inferType(src),
    src,
    poster: s.poster || null,
    fit: s.fit === 'contain' ? 'contain' : 'cover',
    position: {
      x: typeof pos.x === 'number' ? clamp(pos.x, 0, 100) : DEFAULT_SLOT.position.x,
      y: typeof pos.y === 'number' ? clamp(pos.y, 0, 100) : DEFAULT_SLOT.position.y,
    },
    scale: typeof s.scale === 'number' ? clamp(s.scale, SCALE_MIN, SCALE_MAX) : DEFAULT_SLOT.scale,
    box: normalizeBox(s.box),
    placement: normalizePlacement(s.placement),
  };
}

// Config entry -> inline style for the <img>/<video> element.
export function slotToStyle(slot) {
  const s = normalizeSlot(slot);
  const style = {
    objectFit: s.fit,
    objectPosition: `${s.position.x}% ${s.position.y}%`,
  };
  if (s.scale !== 1) {
    style.transform = `scale(${s.scale})`;
    style.transformOrigin = `${s.position.x}% ${s.position.y}%`;
  }
  return style;
}

// Box config -> inline style for the frame <div> that MediaSlot owns.
export function boxToStyle(box) {
  const b = normalizeBox(box);
  const style = {
    position: 'relative',
    width: `${b.width}%`,
    marginInline: 'auto',
    borderRadius: `${b.radius}px`,
    overflow: 'hidden',
  };
  if (b.aspect) {
    style.aspectRatio = b.aspect;
  } else {
    style.height = b.height != null ? `${b.height}px` : '100%';
  }
  return style;
}

// Overlay placement -> inline style for the wrapper MediaRegion puts around it.
export function placementToStyle(placement) {
  const p = normalizePlacement(placement);
  if (!p || p.flow) return null;
  return {
    position: 'absolute',
    left: `${p.x}%`,
    top: `${p.y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: p.z,
  };
}

// In-flow placement -> wrapper style: a centred block that occupies real space.
export function flowBlockStyle(box) {
  return { ...boxToStyle(box), margin: '2rem auto' };
}

// Move-handle drag -> new placement x/y (region-relative percent). Dragging the
// block right moves it right, so x increases.
export function dragPlacement(start, dxPx, dyPx, regionW, regionH) {
  const sx = typeof start?.x === 'number' ? start.x : 50;
  const sy = typeof start?.y === 'number' ? start.y : 50;
  const nx = regionW > 0 ? sx + (dxPx / regionW) * 100 : sx;
  const ny = regionH > 0 ? sy + (dyPx / regionH) * 100 : sy;
  return { x: clamp(nx, 0, 100), y: clamp(ny, 0, 100) };
}

// Pointer drag -> new position percent. Grabbing the image and pulling it right
// reveals more of its left side, so object-position x decreases.
export function dragToPosition(start, dxPx, dyPx, rectW, rectH) {
  const s = normalizeSlot({ position: start });
  const nx = rectW > 0 ? s.position.x - (dxPx / rectW) * 100 : s.position.x;
  const ny = rectH > 0 ? s.position.y - (dyPx / rectH) * 100 : s.position.y;
  return { x: clamp(nx, 0, 100), y: clamp(ny, 0, 100) };
}

// Wheel delta -> new scale. Wheel up (deltaY < 0) zooms in.
export function wheelToScale(currentScale, deltaY) {
  const base = typeof currentScale === 'number' ? currentScale : 1;
  return clamp(base - deltaY * 0.0015, SCALE_MIN, SCALE_MAX);
}

// Right / corner handle drag -> new box width as a percent of the placement cell.
export function resizeWidth(startPct, dxPx, cellW) {
  if (!(cellW > 0)) return clamp(startPct, WIDTH_MIN, WIDTH_MAX);
  return clamp(startPct + (dxPx / cellW) * 100, WIDTH_MIN, WIDTH_MAX);
}

// Bottom / corner handle drag -> new box height in px (implies a free aspect).
export function resizeHeight(startPx, dyPx) {
  return Math.max(HEIGHT_MIN, startPx + dyPx);
}

function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}

// Natural media dimensions -> a reduced "w / h" string for CSS aspect-ratio.
export function nativeAspect(w, h) {
  const rw = Math.round(w);
  const rh = Math.round(h);
  if (!rw || !rh) return null;
  const g = gcd(rw, rh) || 1;
  return `${rw / g} / ${rh / g}`;
}

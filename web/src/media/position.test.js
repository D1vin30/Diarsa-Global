import { describe, it, expect } from 'vitest';
import {
  clamp,
  normalizeSlot,
  normalizeBox,
  slotToStyle,
  boxToStyle,
  dragToPosition,
  dragPlacement,
  placementToStyle,
  flowBlockStyle,
  inferType,
  wheelToScale,
  resizeWidth,
  resizeHeight,
  nativeAspect,
  DEFAULT_BOX,
} from './position.js';

describe('clamp', () => {
  it('bounds a value to the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});

describe('normalizeSlot', () => {
  it('fills defaults when slot is undefined', () => {
    expect(normalizeSlot(undefined, '/fallback.jpg')).toEqual({
      type: 'image',
      src: '/fallback.jpg',
      poster: null,
      fit: 'cover',
      position: { x: 50, y: 50 },
      scale: 1,
      box: { width: 100, aspect: '4 / 3', height: null, radius: 4 },
      placement: null,
    });
  });

  it('infers video type from a fallback src extension', () => {
    expect(normalizeSlot(undefined, '/clip.mp4').type).toBe('video');
    expect(normalizeSlot(undefined, '/pic.jpg').type).toBe('image');
  });

  it('normalizes a placement and drops a region-less one', () => {
    expect(normalizeSlot({ src: '/a', placement: { region: 'page:/', x: 300 } }).placement).toEqual({
      region: 'page:/',
      x: 100,
      y: 50,
      z: 1,
      flow: false,
      flowAt: 'bottom',
    });
    expect(normalizeSlot({ src: '/a', placement: { x: 10 } }).placement).toBeNull();
  });

  it('carries flow + flowAt on a placement', () => {
    const p = normalizeSlot({ src: '/a', placement: { region: 'r', flow: true, flowAt: 'top' } }).placement;
    expect(p.flow).toBe(true);
    expect(p.flowAt).toBe('top');
  });

  it('keeps provided values and clamps out-of-range ones', () => {
    const out = normalizeSlot({
      type: 'video',
      src: '/a.mp4',
      poster: '/a.jpg',
      fit: 'contain',
      position: { x: 200, y: -30 },
      scale: 9,
      box: { width: 250, aspect: null, height: 10, radius: -4 },
    });
    expect(out.type).toBe('video');
    expect(out.poster).toBe('/a.jpg');
    expect(out.fit).toBe('contain');
    expect(out.position).toEqual({ x: 100, y: 0 });
    expect(out.scale).toBe(3);
    expect(out.box).toEqual({ width: 100, aspect: null, height: 40, radius: 0 });
  });

  it('coerces an unknown type to image', () => {
    expect(normalizeSlot({ type: 'gif', src: '/x' }).type).toBe('image');
  });
});

describe('normalizeBox', () => {
  it('undefined -> defaults', () => {
    expect(normalizeBox(undefined)).toEqual(DEFAULT_BOX);
  });
  it('explicit null aspect is preserved (free height)', () => {
    expect(normalizeBox({ aspect: null }).aspect).toBeNull();
  });
  it('blank aspect string falls back to the default ratio', () => {
    expect(normalizeBox({ aspect: '   ' }).aspect).toBe('4 / 3');
  });
});

describe('slotToStyle', () => {
  it('emits object-fit and object-position, no transform at scale 1', () => {
    const style = slotToStyle({ fit: 'cover', position: { x: 40, y: 60 }, scale: 1 });
    expect(style).toEqual({ objectFit: 'cover', objectPosition: '40% 60%' });
  });

  it('adds a scale transform anchored at the focal point when zoomed', () => {
    const style = slotToStyle({ position: { x: 25, y: 75 }, scale: 2 });
    expect(style.transform).toBe('scale(2)');
    expect(style.transformOrigin).toBe('25% 75%');
  });
});

describe('boxToStyle', () => {
  it('uses aspect-ratio and no height when an aspect is set', () => {
    const style = boxToStyle({ width: 80, aspect: '16 / 9', radius: 8 });
    expect(style.width).toBe('80%');
    expect(style.aspectRatio).toBe('16 / 9');
    expect(style.height).toBeUndefined();
    expect(style.borderRadius).toBe('8px');
    expect(style.overflow).toBe('hidden');
  });

  it('uses an explicit height when aspect is null', () => {
    const style = boxToStyle({ width: 100, aspect: null, height: 280 });
    expect(style.height).toBe('280px');
    expect(style.aspectRatio).toBeUndefined();
  });

  it('falls back to 100% height when aspect and height are both absent', () => {
    expect(boxToStyle({ aspect: null }).height).toBe('100%');
  });
});

describe('dragToPosition', () => {
  it('pulling the image right lowers object-position x', () => {
    const out = dragToPosition({ x: 50, y: 50 }, 100, 0, 1000, 500);
    expect(out.x).toBe(40);
    expect(out.y).toBe(50);
  });

  it('clamps at the edges', () => {
    const out = dragToPosition({ x: 10, y: 90 }, 1000, -1000, 1000, 500);
    expect(out.x).toBe(0);
    expect(out.y).toBe(100);
  });

  it('is a no-op when the rect has no size', () => {
    expect(dragToPosition({ x: 30, y: 30 }, 50, 50, 0, 0)).toEqual({ x: 30, y: 30 });
  });
});

describe('wheelToScale', () => {
  it('zooms in on wheel up (negative deltaY)', () => {
    expect(wheelToScale(1, -100)).toBeCloseTo(1.15);
  });
  it('never leaves the 1..3 band', () => {
    expect(wheelToScale(1, 500)).toBe(1);
    expect(wheelToScale(3, -5000)).toBe(3);
  });
});

describe('resizeWidth', () => {
  it('adds the drag delta as a percent of the cell width', () => {
    expect(resizeWidth(100, -200, 1000)).toBe(80);
  });
  it('clamps to 10..100', () => {
    expect(resizeWidth(100, 500, 1000)).toBe(100);
    expect(resizeWidth(20, -500, 1000)).toBe(10);
  });
  it('returns the clamped start when the cell has no width', () => {
    expect(resizeWidth(50, 100, 0)).toBe(50);
  });
});

describe('resizeHeight', () => {
  it('adds the drag delta in px with a floor', () => {
    expect(resizeHeight(280, 40)).toBe(320);
    expect(resizeHeight(50, -1000)).toBe(40);
  });
});

describe('nativeAspect', () => {
  it('reduces to lowest terms', () => {
    expect(nativeAspect(1280, 960)).toBe('4 / 3');
    expect(nativeAspect(1920, 1080)).toBe('16 / 9');
  });
  it('returns null for a zero dimension', () => {
    expect(nativeAspect(0, 500)).toBeNull();
  });
});

describe('inferType', () => {
  it('sees common video extensions, with query strings', () => {
    expect(inferType('/a/b/reel.mp4')).toBe('video');
    expect(inferType('https://x/y.webm?v=2')).toBe('video');
    expect(inferType('/p.jpg')).toBe('image');
    expect(inferType('')).toBe('image');
  });
});

describe('placementToStyle', () => {
  it('null placement -> null', () => {
    expect(placementToStyle(null)).toBeNull();
  });
  it('positions absolutely at the centre point for an overlay', () => {
    const s = placementToStyle({ region: 'r', x: 30, y: 70, z: 4 });
    expect(s).toMatchObject({ position: 'absolute', left: '30%', top: '70%', zIndex: 4 });
    expect(s.transform).toContain('translate(-50%, -50%)');
  });
  it('returns null for an in-flow placement (no absolute positioning)', () => {
    expect(placementToStyle({ region: 'r', flow: true })).toBeNull();
  });
});

describe('flowBlockStyle', () => {
  it('is a centred relative block with vertical margin', () => {
    const s = flowBlockStyle({ width: 60, aspect: '16 / 9' });
    expect(s.position).toBe('relative');
    expect(s.width).toBe('60%');
    expect(s.aspectRatio).toBe('16 / 9');
    expect(s.margin).toContain('auto');
  });
});

describe('dragPlacement', () => {
  it('dragging the block right raises its x', () => {
    expect(dragPlacement({ x: 50, y: 50 }, 100, 0, 1000, 500)).toEqual({ x: 60, y: 50 });
  });
  it('clamps to 0..100', () => {
    expect(dragPlacement({ x: 90, y: 10 }, 1000, -1000, 1000, 500)).toEqual({ x: 100, y: 0 });
  });
});

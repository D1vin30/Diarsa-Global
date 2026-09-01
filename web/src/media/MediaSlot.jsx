import { useEffect, useRef } from 'react';
import { useMediaConfig } from './MediaConfigProvider';
import { useMediaEditor } from './MediaEditorContext';
import {
  normalizeSlot,
  slotToStyle,
  boxToStyle,
  dragToPosition,
  dragPlacement,
  wheelToScale,
  resizeWidth,
  resizeHeight,
} from './position';

const ACCENT = '#dd9868';

// Drop-in replacement for a hand-styled <img>/<video>. MediaSlot owns its frame
// <div> (size / aspect / radius from mediaConfig `box`) and the media inside it
// (object-fit / object-position / zoom from the other fields). When the dev
// editor is active and this slot is selected it also renders a drag layer
// (reposition + wheel-zoom), edge/corner resize handles, and — if the slot is
// pinned into a MediaRegion — a move handle that drags its placement.
export default function MediaSlot({ id, fallbackSrc, alt = '', className = '', mediaClassName, style: frameStyleProp, ...rest }) {
  const { getSlot, updateSlot } = useMediaConfig();
  const editor = useMediaEditor(); // null outside dev
  const raw = getSlot(id);
  const slot = normalizeSlot(raw, fallbackSrc);

  const frameRef = useRef(null);
  const gesture = useRef(null);

  const editing = !!editor?.editing;
  const selected = editor?.selectedId === id;
  const placed = !!slot.placement;
  const floating = placed && !slot.placement.flow; // overlay placement -> movable

  // Depend on the stable registerNode callback, not the whole editor object:
  // registerNode calls setMountedIds, which returns a new editor value, so
  // depending on `editor` here makes this effect re-fire itself forever.
  const registerNode = editor?.registerNode;
  useEffect(() => {
    if (!registerNode) return undefined;
    const node = frameRef.current;
    registerNode(id, node);
    return () => registerNode(id, null);
  }, [registerNode, id]);

  const mediaStyle = { ...slotToStyle(raw ?? { fit: slot.fit, position: slot.position, scale: slot.scale }), width: '100%', height: '100%', display: 'block' };

  let media;
  if (!slot.src) {
    media = (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'repeating-linear-gradient(45deg,#e9e6df,#e9e6df 10px,#ded9cd 10px,#ded9cd 20px)',
          color: '#8a8172',
          font: '600 12px ui-sans-serif,system-ui,sans-serif',
        }}
      >
        {editing ? 'pick a file →' : ''}
      </div>
    );
  } else if (slot.type === 'video') {
    media = <video src={slot.src} poster={slot.poster || undefined} className={mediaClassName} style={mediaStyle} muted loop playsInline autoPlay {...rest} />;
  } else {
    media = <img src={slot.src} alt={alt} className={mediaClassName} style={mediaStyle} {...rest} />;
  }

  // When the slot is pinned into a region, MediaRegion's wrapper already carries
  // the box sizing + placement; the frame is just a passthrough container.
  const frameStyle = {
    ...(placed
      ? { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }
      : boxToStyle(slot.box)),
    ...frameStyleProp,
    ...(editing
      ? {
          outline: selected ? `2px solid ${ACCENT}` : `1px dashed rgba(221,152,104,0.55)`,
          outlineOffset: '-1px',
        }
      : null),
  };

  const startReposition = (e) => {
    e.preventDefault();
    if (!selected) editor.select(id);
    const rect = frameRef.current.getBoundingClientRect();
    gesture.current = { kind: 'move', x: e.clientX, y: e.clientY, start: slot.position, rect };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startPlacementDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected) editor.select(id);
    const region = frameRef.current.closest('[data-media-region]');
    const r = region?.getBoundingClientRect();
    gesture.current = {
      kind: 'place',
      x: e.clientX,
      y: e.clientY,
      start: slot.placement,
      regionW: r?.width || 1,
      regionH: r?.height || 1,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const startResize = (kind) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = frameRef.current.getBoundingClientRect();
    // in-place: width is a % of the layout cell (frame's parent).
    // placed: width is a % of the region.
    const ref = placed
      ? frameRef.current.closest('[data-media-region]')
      : frameRef.current.parentElement;
    const cellW = ref?.getBoundingClientRect().width || rect.width;
    gesture.current = { kind, x: e.clientX, y: e.clientY, startW: slot.box.width, startH: rect.height, cellW };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const g = gesture.current;
    if (!g) return;
    if (g.kind === 'move') {
      updateSlot(id, {
        position: dragToPosition(g.start, e.clientX - g.x, e.clientY - g.y, g.rect.width, g.rect.height),
      });
      return;
    }
    if (g.kind === 'place') {
      updateSlot(id, {
        placement: dragPlacement(g.start, e.clientX - g.x, e.clientY - g.y, g.regionW, g.regionH),
      });
      return;
    }
    const patch = {};
    if (g.kind === 'e' || g.kind === 'se') patch.width = resizeWidth(g.startW, e.clientX - g.x, g.cellW);
    if (g.kind === 's' || g.kind === 'se') {
      patch.aspect = null;
      patch.height = resizeHeight(g.startH, e.clientY - g.y);
    }
    updateSlot(id, { box: patch });
  };

  const endGesture = (e) => {
    gesture.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onWheel = (e) => {
    e.preventDefault();
    updateSlot(id, { scale: wheelToScale(slot.scale, e.deltaY) });
  };

  const handle = (kind, css) => (
    <div
      onPointerDown={startResize(kind)}
      onPointerMove={onPointerMove}
      onPointerUp={endGesture}
      style={{ position: 'absolute', background: ACCENT, borderRadius: 2, zIndex: 1001, touchAction: 'none', ...css }}
    />
  );

  return (
    <div ref={frameRef} style={frameStyle} className={className}>
      {media}

      {editing && !selected && (
        <button
          type="button"
          aria-label={`Select media: ${id}`}
          onClick={() => editor.select(id)}
          style={{ position: 'absolute', inset: 0, zIndex: 1000, background: 'transparent', border: 0, cursor: 'pointer' }}
        />
      )}

      {editing && selected && (
        <>
          <div
            data-media-scrollable
            aria-label={`Reposition media: ${id}`}
            onPointerDown={startReposition}
            onPointerMove={onPointerMove}
            onPointerUp={endGesture}
            onWheel={onWheel}
            style={{ position: 'absolute', inset: 0, zIndex: 1000, cursor: 'move', touchAction: 'none' }}
          />
          {handle('e', { top: '50%', right: -5, width: 10, height: 34, marginTop: -17, cursor: 'ew-resize' })}
          {handle('s', { left: '50%', bottom: -5, width: 34, height: 10, marginLeft: -17, cursor: 'ns-resize' })}
          {handle('se', { right: -5, bottom: -5, width: 12, height: 12, cursor: 'nwse-resize' })}
          {floating && (
            <div
              aria-label={`Move media: ${id}`}
              onPointerDown={startPlacementDrag}
              onPointerMove={onPointerMove}
              onPointerUp={endGesture}
              style={{
                position: 'absolute',
                top: -9,
                left: -9,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: '#14181f',
                border: `2px solid ${ACCENT}`,
                zIndex: 1002,
                cursor: 'grab',
                touchAction: 'none',
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

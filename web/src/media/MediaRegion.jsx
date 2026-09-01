import { useMediaConfig } from './MediaConfigProvider';
import { useMediaEditor } from './MediaEditorContext';
import { normalizeSlot, boxToStyle, placementToStyle, flowBlockStyle } from './position';
import MediaSlot from './MediaSlot';

const ACCENT = '#dd9868';

// A named area of a page that can hold added media. Renders its normal children,
// plus any slots whose `placement.region` matches:
//   - flow slots  -> real in-flow blocks at the region's top or bottom (push content)
//   - overlay slots -> absolutely positioned over the content at x/y
// Both render in dev and in production, so saved additions show live. In the dev
// editor it also shows "＋ image / ＋ video" buttons that drop a new slot here.
export default function MediaRegion({ id, children, className = '', style }) {
  const { slotsInRegion, getSlot, addSlot } = useMediaConfig();
  const editor = useMediaEditor();

  const items = slotsInRegion(id).map((sid) => ({ sid, s: normalizeSlot(getSlot(sid)) }));
  const flowTop = items.filter((x) => x.s.placement?.flow && x.s.placement.flowAt === 'top');
  const flowBottom = items.filter((x) => x.s.placement?.flow && x.s.placement.flowAt === 'bottom');
  const overlays = items.filter((x) => x.s.placement && !x.s.placement.flow);

  const renderFlow = ({ sid, s }) => (
    <div key={sid} style={flowBlockStyle(s.box)}>
      <MediaSlot id={sid} />
    </div>
  );
  const renderOverlay = ({ sid, s }) => (
    <div key={sid} style={{ ...boxToStyle(s.box), ...placementToStyle(s.placement) }}>
      <MediaSlot id={sid} />
    </div>
  );

  return (
    <div data-media-region={id} className={className} style={{ position: 'relative', ...style }}>
      {flowTop.map(renderFlow)}
      {children}
      {flowBottom.map(renderFlow)}
      {overlays.map(renderOverlay)}

      {editor?.editing && (
        <div style={{ position: 'fixed', top: 70, right: 14, zIndex: 2147483000, display: 'flex', gap: 4 }}>
          {['image', 'video'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => editor.select(addSlot(id, t))}
              style={{
                font: '600 11px ui-sans-serif,system-ui,sans-serif',
                background: '#14181f',
                color: ACCENT,
                border: `1px solid ${ACCENT}`,
                borderRadius: 5,
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              ＋ {t} here
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

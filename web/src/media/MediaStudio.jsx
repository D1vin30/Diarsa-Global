import { useRef, useState, useSyncExternalStore } from 'react';
import { useMediaConfig } from './MediaConfigProvider';
import { useMediaEditor, useMediaEditorNodes } from './MediaEditorContext';
import { normalizeSlot, clamp, nativeAspect } from './position';
import * as textStore from './textStore';

// Dev-only chrome for the framing editor: the toggle pill and, when a slot is
// selected, a properties panel with typed inputs for every value. All styling is
// inline so the tool is visually isolated from the site's CSS. The drag / zoom /
// resize gestures live in MediaSlot; this panel writes the same fields.

const ACCENT = '#dd9868';
const PANEL_BG = '#14181f';
const BORDER = '#2b3440';
const MUTED = '#9aa4b2';

const box = {
  position: 'fixed',
  left: 16,
  zIndex: 2147483000,
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  fontSize: 12,
  color: '#f2f2f2',
};

const btn = {
  border: `1px solid ${BORDER}`,
  background: '#1c2530',
  color: '#f2f2f2',
  borderRadius: 6,
  padding: '5px 10px',
  cursor: 'pointer',
  fontSize: 12,
};

const inputStyle = {
  width: 84,
  background: '#0e1218',
  border: `1px solid ${BORDER}`,
  borderRadius: 5,
  color: '#f2f2f2',
  padding: '3px 6px',
  fontSize: 12,
  fontVariantNumeric: 'tabular-nums',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '3px 0' }}>
      <span style={{ color: MUTED }}>{label}</span>
      {children}
    </label>
  );
}

function Num({ label, value, min, max, step = 1, onCommit, disabled }) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => {
          const n = parseFloat(e.target.value);
          if (Number.isFinite(n)) onCommit(clamp(n, min, max));
        }}
        style={{ ...inputStyle, opacity: disabled ? 0.5 : 1 }}
      />
    </Field>
  );
}

export default function MediaStudio() {
  const { getSlot, updateSlot, resetSlot, removeSlot, uploadFile, dirty, saving, save } = useMediaConfig();
  const { editing, toggle, selectedId, select, deselect, getNode } = useMediaEditor();
  const mountedIds = useMediaEditorNodes();
  const fileRef = useRef(null);
  const [grid, setGrid] = useState(false);
  useSyncExternalStore(textStore.subscribe, textStore.getSnapshot, textStore.getSnapshot);
  const textDirty = textStore.isDirty();
  const textSaving = textStore.isSaving();

  const slot = selectedId ? normalizeSlot(getSlot(selectedId)) : null;
  const placed = !!slot?.placement;
  const inFlow = !!slot?.placement?.flow;

  const mediaEl = () => getNode(selectedId)?.querySelector('img,video') || null;

  const useMediaSize = () => {
    const el = mediaEl();
    if (!el) return;
    const w = el.naturalWidth || el.videoWidth;
    const h = el.naturalHeight || el.videoHeight;
    const a = nativeAspect(w, h);
    if (a) updateSlot(selectedId, { box: { aspect: a, height: null } });
  };

  const togglePlay = () => {
    const el = mediaEl();
    if (!el || typeof el.play !== 'function') return;
    if (el.paused) el.play();
    else el.pause();
  };

  return (
    <>
      {editing && grid && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2147482000,
            pointerEvents: 'none',
            backgroundImage:
              'repeating-linear-gradient(to right, rgba(221,152,104,0.22) 0 1px, transparent 1px calc(100% / 12)),' +
              'repeating-linear-gradient(to bottom, rgba(221,152,104,0.14) 0 1px, transparent 1px 80px)',
          }}
        />
      )}

      {editing && slot && (
        <div
          data-media-scrollable
          style={{
            ...box,
            bottom: 62,
            width: 264,
            maxHeight: 'calc(100vh - 96px)',
            overflowY: 'auto',
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: ACCENT }}>{selectedId}</span>
            <button type="button" style={{ ...btn, padding: '2px 8px' }} onClick={deselect}>
              done
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            {['image', 'video'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => updateSlot(selectedId, { type: t })}
                style={{
                  ...btn,
                  flex: 1,
                  background: slot.type === t ? ACCENT : '#1c2530',
                  color: slot.type === t ? '#14181f' : '#f2f2f2',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <Num label="x  %" value={slot.position.x} min={0} max={100} step={0.5}
            onCommit={(v) => updateSlot(selectedId, { position: { x: v } })} />
          <Num label="y  %" value={slot.position.y} min={0} max={100} step={0.5}
            onCommit={(v) => updateSlot(selectedId, { position: { y: v } })} />
          <Num label="zoom  ×" value={slot.scale} min={1} max={3} step={0.05}
            onCommit={(v) => updateSlot(selectedId, { scale: v })} />

          <Field label="fit">
            <select
              value={slot.fit}
              onChange={(e) => updateSlot(selectedId, { fit: e.target.value })}
              style={{ ...inputStyle, width: 96, cursor: 'pointer' }}
            >
              <option value="cover">cover</option>
              <option value="contain">contain</option>
            </select>
          </Field>

          <div style={{ borderTop: `1px solid ${BORDER}`, margin: '8px 0 4px', paddingTop: 6, color: MUTED }}>frame</div>

          <Num label="width  %" value={slot.box.width} min={10} max={100} step={1}
            onCommit={(v) => updateSlot(selectedId, { box: { width: v } })} />
          <Field label="aspect">
            <input
              type="text"
              value={slot.box.aspect ?? ''}
              placeholder="4 / 3 · blank = free"
              onChange={(e) => {
                const v = e.target.value.trim();
                updateSlot(selectedId, { box: { aspect: v === '' ? null : v } });
              }}
              style={{ ...inputStyle, width: 120 }}
            />
          </Field>
          <Num label="height  px" value={slot.box.height ?? undefined} min={40} max={4000} step={2}
            disabled={!!slot.box.aspect}
            onCommit={(v) => updateSlot(selectedId, { box: { aspect: null, height: v } })} />
          <Num label="radius  px" value={slot.box.radius} min={0} max={200} step={1}
            onCommit={(v) => updateSlot(selectedId, { box: { radius: v } })} />

          {placed && (
            <>
              <div style={{ borderTop: `1px solid ${BORDER}`, margin: '8px 0 4px', paddingTop: 6, color: MUTED }}>
                layout
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                {[
                  ['in-flow', true],
                  ['overlay', false],
                ].map(([label, flow]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => updateSlot(selectedId, { placement: { flow } })}
                    style={{
                      ...btn,
                      flex: 1,
                      background: inFlow === flow ? ACCENT : '#1c2530',
                      color: inFlow === flow ? '#14181f' : '#f2f2f2',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {inFlow ? (
                <Field label="place at">
                  <select
                    value={slot.placement.flowAt}
                    onChange={(e) => updateSlot(selectedId, { placement: { flowAt: e.target.value } })}
                    style={{ ...inputStyle, width: 110, cursor: 'pointer' }}
                  >
                    <option value="top">top of section</option>
                    <option value="bottom">bottom of section</option>
                  </select>
                </Field>
              ) : (
                <>
                  <Num label="left  %" value={slot.placement.x} min={0} max={100} step={0.5}
                    onCommit={(v) => updateSlot(selectedId, { placement: { x: v } })} />
                  <Num label="top  %" value={slot.placement.y} min={0} max={100} step={0.5}
                    onCommit={(v) => updateSlot(selectedId, { placement: { y: v } })} />
                  <Num label="layer  z" value={slot.placement.z} min={0} max={50} step={1}
                    onCommit={(v) => updateSlot(selectedId, { placement: { z: v } })} />
                </>
              )}
            </>
          )}

          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button type="button" style={{ ...btn, flex: 1 }} onClick={useMediaSize}>Use media size</button>
            {slot.type === 'video' && (
              <button type="button" style={btn} onClick={togglePlay}>Play / Pause</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <button type="button" style={{ ...btn, flex: 1 }} onClick={() => fileRef.current?.click()}>
              Replace file…
            </button>
            {placed ? (
              <button
                type="button"
                style={{ ...btn, borderColor: '#c0504d', color: '#e08a87' }}
                onClick={() => { removeSlot(selectedId); deselect(); }}
              >
                Delete
              </button>
            ) : (
              <button type="button" style={btn} onClick={() => resetSlot(selectedId)}>Reset</button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              try {
                await uploadFile(selectedId, file);
              } catch (err) {
                window.alert(`Upload failed: ${err.message}`);
              }
            }}
          />
          <div style={{ marginTop: 8, color: MUTED, lineHeight: 1.4 }}>
            page frozen · drag image to reposition · scroll to zoom · drag edges to resize · Esc to release
          </div>
        </div>
      )}

      {editing && mountedIds.length > 0 && (
        <div style={{ ...box, bottom: 46, display: 'flex', alignItems: 'center', gap: 6 }}>
          <select
            value={selectedId || ''}
            onChange={(e) => select(e.target.value || null)}
            title="jump to any media slot on the page"
            style={{ ...inputStyle, width: 240, cursor: 'pointer' }}
          >
            <option value="">— pick a slot ({mountedIds.length}) —</option>
            {mountedIds.map((sid) => (
              <option key={sid} value={sid}>{sid}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ ...box, bottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          type="button"
          onClick={toggle}
          style={{ ...btn, background: editing ? ACCENT : '#1c2530', color: editing ? '#14181f' : '#f2f2f2', fontWeight: 600 }}
        >
          {editing ? '● Editing media' : '✎ Edit media'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => setGrid((g) => !g)}
            title="alignment grid"
            style={{ ...btn, background: grid ? ACCENT : '#1c2530', color: grid ? '#14181f' : '#f2f2f2' }}
          >
            grid
          </button>
        )}
        {dirty && (
          <button
            type="button"
            onClick={async () => {
              try {
                await save();
              } catch (err) {
                window.alert(`Save failed: ${err.message}`);
              }
            }}
            disabled={saving}
            style={{ ...btn, borderColor: ACCENT, color: ACCENT }}
          >
            {saving ? 'Saving…' : 'Save media'}
          </button>
        )}
        {textDirty && (
          <button
            type="button"
            onClick={() => textStore.save()}
            disabled={textSaving}
            style={{ ...btn, borderColor: ACCENT, color: ACCENT }}
          >
            {textSaving ? 'Saving…' : 'Save text'}
          </button>
        )}
        {(dirty || textDirty) && !saving && !textSaving && (
          <span title="unsaved changes" style={{ width: 8, height: 8, borderRadius: 8, background: ACCENT }} />
        )}
      </div>
    </>
  );
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setLocked } from './pageLock';

// Dev-only. Tracks whether the framing editor is active and which slot is
// selected, and keeps a handle on each slot's frame node so selecting one can
// scroll it to centre. Selecting a slot freezes the page (see pageLock).
// Never mounted in a production build.

const MediaEditorContext = createContext(null);
// mountedIds changes every time a MediaSlot mounts/unmounts (route changes churn
// dozens at once). Keeping it out of the main context value means `editor`
// identity stays stable through that churn, so every editor consumer doesn't
// re-render on each register — which during an AnimatePresence page transition
// was enough to stall the exit animation and wedge navigation.
const MediaEditorNodesContext = createContext([]);

export function MediaEditorProvider({ children }) {
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [mountedIds, setMountedIds] = useState([]);
  const nodes = useRef(new Map());

  const registerNode = useCallback((id, node) => {
    if (node) {
      nodes.current.set(id, node);
      setMountedIds((cur) => (cur.includes(id) ? cur : [...cur, id].sort()));
    } else {
      nodes.current.delete(id);
      setMountedIds((cur) => cur.filter((x) => x !== id));
    }
  }, []);

  const getNode = useCallback((id) => nodes.current.get(id) || null, []);

  const deselect = useCallback(() => {
    setSelectedId(null);
    setLocked(false);
  }, []);

  const select = useCallback((id) => {
    if (!id) return deselect();
    setSelectedId(id);
    // Centre the slot (synchronous — page still scrollable), then freeze at that
    // position. No rAF: it is throttled when the tab isn't foregrounded.
    nodes.current.get(id)?.scrollIntoView({ block: 'center', inline: 'nearest' });
    setLocked(true);
  }, [deselect]);

  const toggle = useCallback(() => {
    setEditing((wasEditing) => {
      if (wasEditing) deselect();
      return !wasEditing;
    });
  }, [deselect]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') deselect();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, deselect]);

  useEffect(() => () => setLocked(false), []);

  const value = useMemo(
    () => ({ editing, toggle, selectedId, select, deselect, registerNode, getNode }),
    [editing, toggle, selectedId, select, deselect, registerNode, getNode],
  );

  return (
    <MediaEditorContext.Provider value={value}>
      <MediaEditorNodesContext.Provider value={mountedIds}>{children}</MediaEditorNodesContext.Provider>
    </MediaEditorContext.Provider>
  );
}

// Returns null when no provider is mounted (i.e. production builds).
export function useMediaEditor() {
  return useContext(MediaEditorContext);
}

// The ids of every currently-mounted MediaSlot. Separate from useMediaEditor so
// slot mount/unmount churn doesn't re-render every editor consumer.
export function useMediaEditorNodes() {
  return useContext(MediaEditorNodesContext);
}

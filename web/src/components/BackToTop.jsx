import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const SHOW_AFTER = 480;
const HIDE_BEFORE = 380;

export default function BackToTop({ onClick }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const wrapRef = useRef(null);
  const location = useLocation();
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setVisible((prev) => {
        if (y > SHOW_AFTER) return true;
        if (y < HIDE_BEFORE) return false;
        return prev;
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  const scanSections = () => {
    const els = Array.from(document.querySelectorAll('[data-nav-label]'));
    const found = els.map((el) => ({ id: el.id, label: el.dataset.navLabel })).filter((s) => s.id);
    setSections(found);
    return found;
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    scanSections();
    // Route content remounts on navigation (key={location.pathname} in
    // App.jsx) — watching the DOM directly instead of guessing a delay
    // keeps this correct regardless of render timing.
    let pending = null;
    const observer = new MutationObserver(() => {
      clearTimeout(pending);
      pending = setTimeout(scanSections, 50);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearTimeout(pending);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  const handleMouseEnter = () => {
    const found = scanSections();
    if (found.length > 0) setOpen(true);
  };

  const handleMainClick = () => {
    const found = open ? sections : scanSections();
    if (open || found.length === 0) {
      setOpen(false);
      onClick();
    } else {
      setOpen(true);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={wrapRef}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setOpen(false)}
        >
          <AnimatePresence>
            {open && sections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-0.5 p-1.5 rounded-[14px] bg-slate-2/80 backdrop-blur-md border border-white/15 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.55)]"
              >
                {sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => jumpTo(s.id)}
                    className="text-left px-3 py-1.5 rounded-[8px] text-white/85 text-[0.8rem] font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 hover:bg-white/10 hover:text-white"
                  >
                    {s.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative h-11 w-11 shrink-0">
            {!reduceMotion && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[rgba(221,152,104,0.6)] pointer-events-none"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.1, repeat: 2, repeatDelay: 0.4, ease: 'easeOut' }}
              />
            )}
            <motion.button
              type="button"
              aria-label={sections.length > 0 ? 'Page navigation' : 'Back to top'}
              onClick={handleMainClick}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-2/85 backdrop-blur-md border border-white/20 text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.65)] cursor-pointer transition-colors duration-200 hover:bg-slate-3"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

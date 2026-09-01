// Pub-sub the media editor uses to freeze the page while a slot is worked on.
//
// The freeze itself is the well-worn "fixed body" scroll lock: pin <body> at
// `position: fixed; top: -scrollY` so nothing can move it — native wheel, Lenis,
// keyboard, or programmatic jumps all have nothing to scroll. App.jsx also
// subscribes to call `lenis.stop()` + disable ScrollTrigger so scroll-driven
// animations hold their frame. Restored exactly on unlock.

let locked = false;
let pinnedY = 0;
let prevHtmlOverflow = '';
const listeners = new Set();

export function isLocked() {
  return locked;
}

export function subscribe(fn) {
  listeners.add(fn);
  fn(locked);
  return () => listeners.delete(fn);
}

export function setLocked(next) {
  const value = !!next;
  if (value === locked) return;
  locked = value;

  const html = document?.documentElement;
  const body = document?.body;

  if (value && body && html) {
    pinnedY = window.scrollY;
    prevHtmlOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${pinnedY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  } else if (body && html) {
    html.style.overflow = prevHtmlOverflow;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo(0, pinnedY);
  }

  listeners.forEach((fn) => fn(locked));
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const cardReveal = {
  hidden: { opacity: 0, y: 32, scale: 0.96, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] } },
};

export const viewportRepeat = { once: false, margin: '-80px 0px' };
export const viewportOnce = { once: true, margin: '-80px 0px' };

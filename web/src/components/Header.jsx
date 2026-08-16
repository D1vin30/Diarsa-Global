import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

const navLinks = [
  { href: '/about', label: 'About', route: true },
  { href: '/projects', label: 'Projects', route: true },
  { href: '/services', label: 'Services', route: true },
  { href: '/contact', label: 'Contact', route: true },
];

const barTransition = { duration: 0.32, ease: [0.65, 0, 0.35, 1] };

const menuVariants = {
  closed: { opacity: 0, transition: { staggerChildren: 0.035, staggerDirection: -1, when: 'afterChildren' } },
  open: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08, when: 'beforeChildren' } },
};
const itemVariants = {
  closed: { opacity: 0, y: -12, filter: 'blur(6px)' },
  open: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
const lineVariants = {
  closed: { scaleX: 0 },
  open: { scaleX: 1, transition: { duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] } },
};

const HEADER_HEIGHT = 76;
const IDLE_HIDE_DELAY = 2500;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [hidden, setHidden] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const sections = document.querySelectorAll('[data-nav-theme]');
    if (!sections.length) return;

    setTheme(sections[0].dataset.navTheme);

    let observer;
    const build = () => {
      observer?.disconnect();
      const bandBottom = Math.max(window.innerHeight - HEADER_HEIGHT - 20, 0);
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setTheme(entry.target.dataset.navTheme);
          }
        },
        { rootMargin: `-${HEADER_HEIGHT}px 0px -${bandBottom}px 0px`, threshold: 0 }
      );
      sections.forEach((s) => observer.observe(s));
    };

    build();
    window.addEventListener('resize', build);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', build);
    };
  }, [location.pathname]);

  const idleTimerRef = useRef(null);
  const isHoveredRef = useRef(false);
  const topThresholdRef = useRef(HEADER_HEIGHT);

  useEffect(() => {
    topThresholdRef.current = location.pathname === '/' ? window.innerHeight * 0.92 : HEADER_HEIGHT;
  }, [location.pathname]);

  const clearIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const armIdleTimer = () => {
    clearIdleTimer();
    if (isHoveredRef.current) return;
    idleTimerRef.current = setTimeout(() => {
      if (window.scrollY < topThresholdRef.current) return;
      setHidden(true);
    }, IDLE_HIDE_DELAY);
  };

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y < topThresholdRef.current) {
        setHidden(false);
        clearIdleTimer();
      } else if (y > lastY + 12) {
        if (!isHoveredRef.current) setHidden(true);
        clearIdleTimer();
      } else if (y < lastY - 12) {
        setHidden(false);
        armIdleTimer();
      }
      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearIdleTimer();
    };
  }, []);

  const handleHeaderMouseEnter = () => {
    isHoveredRef.current = true;
    clearIdleTimer();
    setHidden(false);
  };

  const handleHeaderMouseLeave = () => {
    isHoveredRef.current = false;
    armIdleTimer();
  };

  const isDark = theme === 'dark';

  return (
    <>
    <div
      className="fixed top-0 inset-x-0 h-3 z-50"
      onMouseEnter={handleHeaderMouseEnter}
    />
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ease-out ${
        isDark ? 'bg-slate/60' : 'bg-paper/70'
      }`}
      style={{
        boxShadow: isDark
          ? '0 24px 40px -28px rgba(0,0,0,0.55)'
          : '0 24px 40px -28px rgba(22,21,26,0.18)',
      }}
      animate={{ y: menuOpen || !hidden ? '0%' : '-100%' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleHeaderMouseEnter}
      onMouseLeave={handleHeaderMouseLeave}
    >
      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-[auto_1fr_auto] items-center gap-4 h-[76px]">
        <Link className="flex items-center no-underline logo-frame" to="/">
          <img
            src="/dgis-logo-mark.png"
            alt="Diarsa Global Integrated Services Ltd."
            className="h-[46px] w-auto"
          />
        </Link>
        <nav className="hidden min-[901px]:flex items-center justify-center gap-[2.1rem]">
          {navLinks.map((l) => {
            const active = l.route && (location.pathname === l.href || location.pathname.startsWith(`${l.href}/`));
            const linkCls = `relative no-underline text-[0.92rem] font-medium transition-colors duration-150 ease-out ${
              active
                ? 'text-accent-tint'
                : isDark
                ? 'text-white-soft hover:text-white focus-visible:text-white'
                : 'text-ink-soft hover:text-ink focus-visible:text-ink'
            }`;
            const indicator = active && (
              <motion.span
                layoutId="nav-active-indicator"
                className="absolute left-0 right-0 -bottom-[7px] h-[2px] rounded-full bg-accent-tint"
                style={{ boxShadow: '0 0 8px rgba(221,152,104,0.7)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            );
            return l.route ? (
              <Link key={l.href} to={l.href} aria-current={active ? 'page' : undefined} className={linkCls}>
                {l.label}
                {indicator}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className={linkCls}>
                {l.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-[1.4rem]">
          <a
            className={`hidden min-[760px]:inline text-[0.86rem] font-medium no-underline transition-colors duration-300 ${isDark ? 'text-white-soft' : 'text-ink-soft'}`}
            href="tel:+2348036789325"
          >
            +234 803 678 9325
          </a>
          <MotionLink
            className="btn btn-accent max-[560px]:hidden"
            to="/contact"
            whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
            whileTap={{ scale: 0.97 }}
          >
            Request Consultation
          </MotionLink>
          <button
            className={`flex min-[901px]:hidden w-[38px] h-[38px] shrink-0 items-center justify-center bg-transparent border-[1.5px] rounded-[3px] cursor-pointer transition-[border-radius,border-color] duration-300 ease-in-out aria-expanded:rounded-full aria-expanded:border-accent ${
              isDark ? 'border-line-dark' : 'border-line-light'
            }`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="w-[18px] h-[14px] flex flex-col justify-between">
              <motion.span
                className={`block w-full h-[2px] rounded-[1px] transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-ink'}`}
                animate={{ y: menuOpen ? 6 : 0, rotate: menuOpen ? 45 : 0 }}
                transition={barTransition}
              />
              <motion.span
                className={`block w-full h-[2px] rounded-[1px] transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-ink'}`}
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.18 }}
              />
              <motion.span
                className={`block w-full h-[2px] rounded-[1px] transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-ink'}`}
                animate={{ y: menuOpen ? -6 : 0, rotate: menuOpen ? -45 : 0 }}
                transition={barTransition}
              />
            </span>
          </button>
        </div>
      </div>
    </motion.header>
      <motion.div
        className="hidden max-[900px]:flex fixed top-[76px] left-0 right-0 bottom-0 bg-slate border-t border-line-dark px-6 pt-6 pb-8 flex-col gap-[0.2rem] z-[49] overflow-y-auto"
        initial="closed"
        animate={menuOpen ? 'open' : 'closed'}
        variants={menuVariants}
        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
      >
        {navLinks.map((l) => {
          const ItemTag = l.route ? MotionLink : motion.a;
          const itemProps = l.route ? { to: l.href } : { href: l.href };
          return (
            <ItemTag
              key={l.href}
              {...itemProps}
              className="group relative flex items-center justify-between text-white-soft no-underline text-[1.05rem] font-medium py-[0.85rem] transition-colors duration-200 ease-out hover:text-white focus-visible:text-white"
              variants={itemVariants}
              whileHover={{ x: 6, transition: { duration: 0.2, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
              <span className="text-accent-tint opacity-0 -translate-x-1.5 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0">→</span>
              <motion.span className="absolute left-0 bottom-0 h-px w-full bg-line-dark origin-left" variants={lineVariants} />
            </ItemTag>
          );
        })}
        <motion.a
          className="relative text-white font-semibold no-underline text-[1.05rem] py-[0.85rem]"
          href="tel:+2348036789325"
          variants={itemVariants}
          whileTap={{ scale: 0.97 }}
        >
          +234 803 678 9325
          <motion.span className="absolute left-0 bottom-0 h-px w-full bg-line-dark origin-left" variants={lineVariants} />
        </motion.a>
        <MotionLink
          className="btn btn-accent self-start mt-[1.2rem]"
          to="/contact"
          variants={itemVariants}
          onClick={() => setMenuOpen(false)}
          whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
          whileTap={{ scale: 0.97 }}
        >
          Request Consultation
        </MotionLink>
      </motion.div>
    </>
  );
}

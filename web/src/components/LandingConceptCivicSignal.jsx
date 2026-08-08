import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const disciplines = [
  { num: '01', label: 'Civil & Structural', color: 'red' },
  { num: '02', label: 'Geomatics', color: 'blue' },
  { num: '03', label: 'Environmental', color: 'blue' },
  { num: '04', label: 'PM & Advisory', color: 'red' },
];

const headlineReveal = {
  hidden: { opacity: 0, y: 36, filter: 'blur(9px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] } },
};

const subcopyReveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.65, ease: [0.19, 1, 0.22, 1] } },
};

const buttonGroup = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 1 } } };
const buttonItem = {
  hidden: { opacity: 0, y: 18, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] } },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const badgeItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] } },
};

function Badge({ num, label, color }) {
  return (
    <motion.div
      className="group flex items-center gap-3 cursor-default"
      variants={badgeItem}
      whileHover={{ y: -3, transition: { duration: 0.15, ease: 'easeOut' } }}
    >
      <span
        className={`flex items-center justify-center w-[38px] h-[38px] rounded-full font-display font-bold text-[0.95rem] text-white shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 ${
          color === 'red' ? 'bg-[var(--cs-red)]' : 'bg-[var(--cs-blue)]'
        }`}
      >
        {num}
      </span>
      <span className="font-sans font-semibold text-[0.92rem]" style={{ color: 'var(--cs-ink)' }}>
        {label}
      </span>
    </motion.div>
  );
}

export default function LandingConceptCivicSignal() {
  return (
    <div
      style={{
        '--cs-ink': '#170b3f',
        '--cs-ink-soft': '#5a5470',
        '--cs-paper': '#ffffff',
        '--cs-line': 'rgba(23,11,63,0.12)',
        '--cs-red': '#e8342a',
        '--cs-red-deep': '#c0201a',
        '--cs-blue': '#1090d0',
        '--cs-blue-deep': '#0b6f9e',
        fontFamily: 'var(--font-sans, sans-serif)',
        background: 'var(--cs-paper)',
      }}
    >
      <div className="fixed top-[92px] left-4 z-40">
        <Link
          to="/"
          className="inline-flex items-center gap-2 pl-[1rem] pr-[1.2rem] py-[0.55rem] rounded-full bg-white/90 backdrop-blur-sm border shadow-sm text-[0.85rem] font-semibold no-underline hover:bg-white transition-colors duration-200"
          style={{ borderColor: 'var(--cs-line)', color: 'var(--cs-ink)' }}
        >
          <span aria-hidden="true">&larr;</span> Back to current site
        </Link>
      </div>

      {/* Hero — same full-bleed-photo layout as the live site's Hero */}
      <section
        className="relative overflow-hidden min-h-[92svh] flex flex-col px-6 pt-[10.5rem] pb-10"
        data-nav-theme="light"
      >
        <img
          src="/hero-drone.png"
          alt=""
          className="absolute inset-0 z-0 w-full h-full object-cover"
          style={{ objectPosition: '54% 45%' }}
        />
        <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(23,11,63,0.42)' }} />
        <div
          className="absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(to top, rgba(23,11,63,0.88) 0%, rgba(23,11,63,0.55) 45%, rgba(23,11,63,0.68) 100%)' }}
        />
        <div className="absolute inset-y-0 left-0 z-[2] w-[6px]" style={{ background: 'var(--cs-red)' }} aria-hidden="true" />

        <motion.div className="max-w-[780px] mx-auto relative z-[3] flex flex-col items-center text-center" initial="hidden" animate="show">
          <motion.div className="flex items-center gap-2 mb-[1.2rem]" variants={subcopyReveal}>
            <span className="w-[9px] h-[9px] rounded-full" style={{ background: 'var(--cs-red)' }} aria-hidden="true" />
            <span className="font-sans font-bold text-[0.8rem] tracking-[0.14em] uppercase text-white/85">
              Civil &middot; Geomatics &middot; Environmental
            </span>
          </motion.div>
          <motion.h1
            className="font-display font-bold uppercase text-white text-[clamp(2.1rem,5.6vw,3.8rem)] leading-[1.05] tracking-[-0.015em]"
            variants={headlineReveal}
          >
            We Engineer Nigeria&rsquo;s Ground, Water &amp; Roads.
          </motion.h1>
        </motion.div>

        <div className="relative z-[3] mt-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-16 max-w-[1180px] w-full mx-auto">
          <motion.div className="max-w-[460px]" initial="hidden" animate="show" variants={subcopyReveal}>
            <p className="text-white text-[0.98rem] leading-[1.65] [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
              Civil engineering, geomatics, and environmental consultancy for the agencies, developers, and
              industries building Nigeria&rsquo;s infrastructure — grounded in survey data, not guesswork.
            </p>
          </motion.div>

          <motion.div className="flex gap-[0.9rem] flex-wrap" initial="hidden" animate="show" variants={buttonGroup}>
            <motion.a
              href="#services"
              className="inline-flex items-center gap-2 font-sans font-bold text-[0.9rem] text-white px-[1.6rem] py-[0.8rem] rounded-full border-2"
              style={{ borderColor: 'var(--cs-blue)' }}
              variants={buttonItem}
              whileHover={{ scale: 1.04, backgroundColor: 'var(--cs-blue)', transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97 }}
            >
              Our Services
            </motion.a>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 font-sans font-bold text-[0.9rem] text-white px-[1.6rem] py-[0.8rem] rounded-full"
              style={{ background: 'var(--cs-red)' }}
              variants={buttonItem}
              whileHover={{ scale: 1.04, backgroundColor: 'var(--cs-red-deep)', transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97 }}
            >
              Request Consultation
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Discipline badge strip — white band, small colour accents */}
      <motion.div
        className="flex flex-wrap items-center gap-x-10 gap-y-5 px-6 min-[700px]:px-12 py-[2.2rem] border-b"
        style={{ borderColor: 'var(--cs-line)' }}
        data-nav-theme="light"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px 0px' }}
        variants={stagger}
      >
        {disciplines.map((d) => (
          <Badge key={d.num} {...d} />
        ))}
      </motion.div>
    </div>
  );
}

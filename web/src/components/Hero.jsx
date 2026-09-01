import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MediaSlot from '../media/MediaSlot';
import { useMediaEditor } from '../media/MediaEditorContext';
import EditableText from '../media/EditableText';

const bleed = { position: 'absolute', inset: 0, zIndex: 0 };

const MotionLink = motion(Link);

const SLIDE_DURATION = 7000;

const headlineReveal = {
  hidden: { opacity: 0, y: 36, filter: 'blur(9px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] } },
};

const subcopyReveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, delay: 0.75, ease: [0.19, 1, 0.22, 1] } },
};

const buttonGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 1.15 } },
};

const buttonItem = {
  hidden: { opacity: 0, y: 20, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } },
};

const slideCount = 3;

function Dots({ active, setActive }) {
  return (
    <div className="flex justify-center gap-[0.2rem]">
      {Array.from({ length: slideCount }).map((_, i) => (
        <button
          key={i}
          aria-label={`Show slide ${i + 1}`}
          aria-current={i === active}
          onClick={() => setActive(i)}
          className="group p-[0.65rem] -m-[0.65rem] cursor-pointer"
        >
          <span
            className={`block h-[4px] rounded-full transition-all duration-300 ${
              i === active ? 'w-10 bg-accent-tint' : 'w-5 bg-line-dark group-hover:bg-white-soft'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const editor = useMediaEditor(); // null outside dev

  // In the media editor: freeze the carousel so slides can't rotate away
  // mid-edit. If a specific hero slot is selected, jump to and hold that slide.
  const editingSlide = /^home\.hero\.([123])$/.exec(editor?.selectedId || '');
  const forcedActive = editingSlide ? Number(editingSlide[1]) - 1 : null;
  const frozen = !!editor?.editing;
  const shown = forcedActive ?? active;

  useEffect(() => {
    if (frozen || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % slideCount), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [active, paused, frozen]);

  return (
    <section
      className="hero relative overflow-hidden bg-slate min-h-[92svh]"
      data-nav-theme="dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* slide 1 — static image */}
      <div
        className={`absolute inset-0 flex flex-col px-6 pt-[10.5rem] pb-10 transition-opacity duration-700 ease-in-out ${
          shown ===0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <MediaSlot id="home.hero.1" fallbackSrc="/hero-static.jpg" alt="" style={bleed} />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-slate/72 via-slate/28 to-slate/8" />

        <motion.div
          className="max-w-[760px] mx-auto relative z-[3] flex flex-col items-center text-center"
          initial="hidden"
          animate={shown ===0 ? 'show' : 'hidden'}
        >
          <motion.h1
            className="text-white text-[clamp(2.1rem,5.6vw,3.8rem)] leading-[1.05] tracking-[-0.015em] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]"
            variants={headlineReveal}
          >
            <EditableText id="hero.1.headline" as="span">We Engineer Nigeria&apos;s Ground, Water &amp; Roads.</EditableText>
          </motion.h1>
        </motion.div>

        <div className="relative z-[3] mt-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8 pt-16 max-w-[1180px] w-full mx-auto">
          <motion.div className="max-w-[420px]" initial="hidden" animate={shown ===0 ? 'show' : 'hidden'} variants={subcopyReveal}>
            <EditableText id="hero.1.eyebrow" as="span" className="font-sans font-semibold text-[0.9rem] text-accent-tint mb-[0.8rem] block">Grounded in Survey Data, Not Guesswork</EditableText>
            <EditableText id="hero.1.subcopy" as="p" className="text-white text-[0.98rem] leading-[1.65] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
              Civil engineering, geomatics, and environmental consultancy for the agencies, developers, and industries building Nigeria&apos;s infrastructure.
            </EditableText>
          </motion.div>

          <motion.div className="flex gap-[0.9rem] flex-wrap" initial="hidden" animate={shown ===0 ? 'show' : 'hidden'} variants={buttonGroup}>
            <motion.a
              className="btn btn-ghost-dark"
              href="#services"
              variants={buttonItem}
              whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
            >
              <EditableText id="hero.1.btn1" as="span">Our Services</EditableText>
            </motion.a>
            <MotionLink
              className="btn btn-accent"
              to="/contact"
              variants={buttonItem}
              whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
            >
              <EditableText id="hero.1.btn2" as="span">Request Consultation</EditableText>
            </MotionLink>
          </motion.div>
        </div>

        <div className="relative z-[3] mt-8">
          <Dots active={shown} setActive={setActive} />
        </div>
      </div>

      {/* slide 2 — aerial / drone photo */}
      <div
        className={`absolute inset-0 flex flex-col px-6 pt-[10.5rem] pb-10 transition-opacity duration-700 ease-in-out ${
          shown ===1 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <MediaSlot id="home.hero.2" fallbackSrc="/hero-drone.png" alt="" style={bleed} />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-slate/72 via-slate/28 to-slate/8" />

        <div className="relative z-[3] mt-auto max-w-[1180px] w-full mx-auto">
          <motion.div initial="hidden" animate={shown ===1 ? 'show' : 'hidden'} variants={headlineReveal}>
            <div className="w-16 h-[2px] bg-white mb-[1.1rem]" />
            <h2 className="text-white text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.1] tracking-[-0.01em] max-w-[20ch] mb-[1.7rem] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
              <EditableText id="hero.2.headline" as="span">Roads Engineered by Design, Not Guesswork.</EditableText>
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            initial="hidden"
            animate={shown ===1 ? 'show' : 'hidden'}
            variants={subcopyReveal}
          >
            <EditableText id="hero.2.subcopy" as="p" className="text-white-soft text-[0.98rem] leading-[1.65] max-w-[52ch] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
              Our teams plan and design road networks using the same advanced, industry-compatible CAD and GIS software used by leading engineering firms — precision-modeled for Nigeria&apos;s terrain, traffic, and climate.
            </EditableText>
            <MotionLink
              to="/contact"
              className="inline-flex items-center gap-2 text-white font-semibold text-[0.95rem] no-underline whitespace-nowrap hover:text-accent-tint transition-colors duration-150 shrink-0"
              whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
            >
              <EditableText id="hero.2.cta" as="span">Request a Consultation</EditableText> <span aria-hidden="true">&rarr;</span>
            </MotionLink>
          </motion.div>
        </div>

        <div className="relative z-[3] mt-8">
          <Dots active={shown} setActive={setActive} />
        </div>
      </div>

      {/* slide 3 — hydrology / drainage */}
      <div
        className={`absolute inset-0 flex flex-col px-6 pt-[10.5rem] pb-10 transition-opacity duration-700 ease-in-out ${
          shown ===2 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <MediaSlot id="home.hero.3" fallbackSrc="/hero-drainage.png" alt="" style={bleed} />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-slate/72 via-slate/28 to-slate/8" />

        <div className="relative z-[3] mt-auto max-w-[1180px] w-full mx-auto">
          <motion.div initial="hidden" animate={shown ===2 ? 'show' : 'hidden'} variants={headlineReveal}>
            <div className="w-16 h-[2px] bg-white mb-[1.1rem]" />
            <h2 className="text-white uppercase text-[clamp(1.6rem,4.2vw,2.9rem)] leading-[1.1] tracking-[-0.01em] max-w-[18ch] mb-[1.7rem] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
              <EditableText id="hero.3.headline" as="span">Leaders in Drainage Design.</EditableText>
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            initial="hidden"
            animate={shown ===2 ? 'show' : 'hidden'}
            variants={subcopyReveal}
          >
            <EditableText id="hero.3.subcopy" as="p" className="text-white-soft text-[0.98rem] leading-[1.65] max-w-[52ch] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
              Environmental impact assessment, flood risk modelling, and gully reclamation — hydrology-led drainage design built for Nigeria&apos;s terrain and rainfall, not generic templates.
            </EditableText>
            <MotionLink
              to="/contact"
              className="inline-flex items-center gap-2 text-white font-semibold text-[0.95rem] no-underline whitespace-nowrap hover:text-accent-tint transition-colors duration-150 shrink-0"
              whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
            >
              <EditableText id="hero.3.cta" as="span">Request a Consultation</EditableText> <span aria-hidden="true">&rarr;</span>
            </MotionLink>
          </motion.div>
        </div>

        <div className="relative z-[3] mt-8">
          <Dots active={shown} setActive={setActive} />
        </div>
      </div>
    </section>
  );
}

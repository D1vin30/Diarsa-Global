import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { stagger, cardReveal, viewportRepeat } from '../motion';
import { services } from '../data/services';
import ServiceCard from './ServiceCard';
import CtaAccentBand from './CtaAccentBand';

const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const introItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.19, 1, 0.22, 1] } },
};

export default function ServicesPage() {
  const sectionRef = useRef(null);
  const watermarkTextRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const textTween = gsap.to(watermarkTextRef.current, {
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      keyframes: {
        '0%': { x: -420, opacity: 0 },
        '50%': { x: 0, opacity: 1 },
        '100%': { x: -420, opacity: 0 },
      },
    });

    return () => {
      textTween.scrollTrigger?.kill();
      textTween.kill();
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="section-shell relative overflow-hidden bg-slate text-white pt-[9rem]" data-nav-theme="dark">
        <div
          className="hidden min-[1024px]:flex absolute top-[7rem] right-6 h-[110px] items-center justify-end pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <div ref={watermarkTextRef}>
            <span
              className="block text-white/[0.09] text-[clamp(2.5rem,5.8vw,6rem)] tracking-[0.01em] leading-none whitespace-nowrap"
              style={{ fontFamily: "'Swis721 BlkEx BT', 'Big Shoulders Display', sans-serif" }}
            >
              SERVICES
            </span>
          </div>
        </div>

        <div className="section-inner relative z-[1]">
          <motion.div className="section-head max-w-[62ch] mt-12" initial="hidden" animate="show" variants={introStagger}>
            <motion.span className="font-sans font-semibold text-[0.9rem] text-accent-tint mb-[0.8rem] block" variants={introItem}>
              What We Do
            </motion.span>
            <motion.h1 className="text-white text-[clamp(2rem,4.2vw,3rem)] mb-[1rem]" variants={introItem}>
              Services
            </motion.h1>
            <motion.p className="lede text-white-soft" variants={introItem}>
              Seven integrated disciplines, delivered by one in-house team — from first survey peg to
              construction supervision.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 max-[860px]:grid-cols-1 gap-[1.4rem]"
            initial="hidden"
            whileInView="show"
            viewport={viewportRepeat}
            variants={stagger}
          >
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} variants={cardReveal} />
            ))}
          </motion.div>
        </div>
      </section>
      <CtaAccentBand heading="Need one of these services on your project?" />
    </>
  );
}

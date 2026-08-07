import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { fadeUp, stagger, viewportRepeat } from '../motion';

const MotionLink = motion(Link);

export default function About() {
  const sectionRef = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.to(watermarkRef.current, {
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      keyframes: {
        '0%': { y: -260, opacity: 0 },
        '20%': { y: -110, opacity: 1 },
        '80%': { y: 140, opacity: 1 },
        '100%': { y: 260, opacity: 0 },
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-shell relative overflow-hidden bg-paper" id="about" data-nav-theme="light">
      <div
        className="absolute inset-y-0 left-[-2.5rem] max-[900px]:left-[-3.5rem] w-[300px] flex items-start justify-start overflow-visible pointer-events-none select-none z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 88%)',
          maskImage: 'linear-gradient(to right, black 50%, transparent 88%)',
        }}
        aria-hidden="true"
      >
        <div ref={watermarkRef}>
          <span
            className="block font-display font-extrabold text-ink/[0.12] text-[clamp(9rem,19vw,15rem)] leading-none whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            ABOUT
          </span>
        </div>
      </div>

      <div className="section-inner relative z-[1]">
        <div className="grid grid-cols-[1.1fr_0.9fr] max-[900px]:grid-cols-1 gap-x-[3rem] gap-y-8 items-center">
          <div className="relative">
            <motion.div className="relative z-[1]" initial="hidden" whileInView="show" viewport={viewportRepeat} variants={stagger}>
              <motion.span className="font-sans font-semibold text-[0.9rem] text-accent-deep mb-[0.8rem] block" variants={fadeUp}>
                Est. 2015 · Benin City, Edo State
              </motion.span>
              <motion.h2 className="text-[clamp(1.8rem,3.6vw,2.5rem)] mb-[1rem]" variants={fadeUp}>
                Built in Benin City. Trusted Across Edo State.
              </motion.h2>
              <motion.div className="relative max-h-[150px] overflow-hidden mb-[1.2rem]" variants={fadeUp}>
                <p className="lede mb-[1rem]">
                  Diarsa Global Integrated Services Limited (RC 1249854) was incorporated on 18 March 2015, anchored
                  on civil/structural engineering, geomatics, town planning, and project management. Headquartered in
                  Benin City, we've delivered engineering services to the Edo State Ministry of Roads and Bridges, the
                  Ministry of Environment and Sustainability, EDSOGPADEC, and private developers across the country.
                </p>
                <p className="lede">
                  Since 2018, our team has been engaged as design or supervising consultant on more than twenty road,
                  drainage, and gully-reclamation projects across Edo State — including supervising SETRACO Nigeria
                  Limited, one of the country's largest construction firms, on the reconstruction of the
                  Ekpoma–Iruekpen Road.
                </p>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent pointer-events-none" />
              </motion.div>
              <MotionLink
                to="/about"
                className="btn btn-ghost-accent"
                variants={fadeUp}
                whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
                whileTap={{ scale: 0.97 }}
              >
                Read More
              </MotionLink>
            </motion.div>
          </div>

          <motion.div
            className="relative aspect-[4/3] rounded-[4px] overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportRepeat}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* placeholder — swap for a real equipment/team photo */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(160deg, #e9e6df 0%, #d8d3c8 50%, #c7c0b0 100%)' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

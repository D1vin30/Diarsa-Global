import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { fadeUp, stagger, cardReveal, viewportRepeat } from '../motion';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';

const MotionLink = motion(Link);

export default function FeaturedWork() {
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
    <section ref={sectionRef} className="section-shell relative overflow-hidden bg-slate text-white" id="work" data-nav-theme="dark" data-nav-label="Projects">
      <div
        className="hidden min-[1024px]:flex absolute top-0 right-6 h-[230px] items-center justify-end pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div ref={watermarkTextRef}>
          <span
            className="block text-white/[0.09] text-[clamp(2.5rem,5.8vw,6rem)] tracking-[0.01em] leading-none whitespace-nowrap"
            style={{ fontFamily: "'Swis721 BlkEx BT', 'Big Shoulders Display', sans-serif" }}
          >
            PROJECTS
          </span>
        </div>
      </div>

      <div className="section-inner relative z-[1]">
        <motion.div
          className="section-head flex items-end justify-between flex-wrap gap-4"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <div>
            <h2 className="text-white text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">Real projects, on the ground in Edo State</h2>
            <p className="lede text-white-soft">A sample of recent and ongoing engagements. Project photography in progress.</p>
          </div>
          <MotionLink
            to="/projects"
            className="btn btn-ghost-dark shrink-0"
            whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
            whileTap={{ scale: 0.97 }}
          >
            View All Projects
          </MotionLink>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 max-[860px]:grid-cols-1 gap-[1.4rem]"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={stagger}
        >
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} variants={cardReveal} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

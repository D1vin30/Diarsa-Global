import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { fadeUp, stagger, viewportRepeat } from '../motion';
import { services } from '../data/services';

const MotionLink = motion(Link);

export default function Services() {
  const gridRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tween = gsap.fromTo(
      gridRef.current,
      { scale: 0.94, opacity: 0.6 },
      {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: gridRef.current, start: 'top 85%', end: 'top 40%', scrub: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="section-shell" id="services" data-nav-theme="light">
      <div className="section-inner">
        <motion.div
          className="section-head flex items-end justify-between flex-wrap gap-4"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <div>
            <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">Four disciplines. One integrated team.</h2>
            <p className="lede">Every engagement draws on the same in-house survey, design, and environmental expertise — no subcontracted guesswork.</p>
          </div>
          <MotionLink
            to="/services"
            className="btn btn-ghost-accent shrink-0"
            whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
            whileTap={{ scale: 0.97 }}
          >
            View All Services
          </MotionLink>
        </motion.div>
        <motion.div
          ref={gridRef}
          className="flex flex-col"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={stagger}
        >
          {services.map((s) => (
            <motion.div
              className="grid grid-cols-[3rem_1fr] max-[600px]:grid-cols-1 gap-x-6 gap-y-2 py-[1.8rem] border-b border-line-light group"
              key={s.slug}
              variants={fadeUp}
            >
              <div className="font-display font-bold text-accent text-[1rem]">{s.num}</div>
              <Link to={`/services/${s.slug}`} className="no-underline block">
                <h3 className="text-[1.2rem] mb-[0.5rem] transition-colors duration-150 group-hover:text-accent-deep">{s.title}</h3>
                <p className="text-ink-soft text-[0.93rem] leading-[1.55] mt-0 mb-[0.9rem] max-w-[62ch]">{s.tagline}</p>
                <div className="flex flex-wrap gap-2">
                  {s.capabilities.map((item) => (
                    <span key={item} className="tag-pill-light">{item}</span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

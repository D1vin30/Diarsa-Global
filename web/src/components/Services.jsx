import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { fadeUp, viewportRepeat } from '../motion';
import { services } from '../data/services';
import ServiceCard from './ServiceCard';

const MotionLink = motion(Link);
const VISIBLE = services.slice(0, 5);
const HIDDEN = services.slice(5);
const cornerBase = 'absolute w-[14px] h-[14px] border-white/70 opacity-0 z-[2] transition-[opacity,transform] duration-200 ease-out';

function Arrow({ direction, onClick, disabled }) {
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous services' : 'Next services'}
      onClick={onClick}
      disabled={disabled}
      className="w-[38px] h-[38px] shrink-0 rounded-full border border-line-light flex items-center justify-center text-ink transition-colors duration-150 hover:border-ink-soft disabled:opacity-30 disabled:pointer-events-none"
    >
      <span aria-hidden="true">{direction === 'prev' ? '←' : '→'}</span>
    </button>
  );
}

export default function Services() {
  const sectionRef = useRef(null);
  const watermarkTextRef = useRef(null);
  const trackRef = useRef(null);
  const showMoreRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const textTween = gsap.to(watermarkTextRef.current, {
      ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      keyframes: {
        '0%': { y: 420, opacity: 0 },
        '50%': { y: 0, opacity: 1 },
        '100%': { y: -420, opacity: 0 },
      },
    });

    return () => {
      textTween.scrollTrigger?.kill();
      textTween.kill();
    };
  }, []);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const target = showMoreRef.current;
    if (!track || !target) return;
    const observer = new IntersectionObserver(([entry]) => setMoreVisible(entry.isIntersecting), {
      root: track,
      threshold: 0.6,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const slide = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = (card?.getBoundingClientRect().width || el.clientWidth / 3) + 22;
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="section-shell relative overflow-hidden" id="services" data-nav-theme="light" data-nav-label="Services">
      <div
        className="hidden min-[900px]:flex absolute top-1/2 left-4 -translate-y-1/2 items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div style={{ transform: 'rotate(180deg)' }}>
          <span
            ref={watermarkTextRef}
            className="block text-ink/[0.11] text-[clamp(2.5rem,5.8vw,6rem)] tracking-[0.01em] leading-none whitespace-nowrap"
            style={{ fontFamily: "'Swis721 BlkEx BT', 'Big Shoulders Display', sans-serif", writingMode: 'vertical-rl' }}
          >
            SERVICES
          </span>
        </div>
      </div>

      <div className="section-inner relative z-[1]">
        <motion.div
          className="max-w-[68ch] mb-[2.8rem]"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <span className="font-sans font-semibold text-[0.85rem] text-accent-deep mb-[0.7rem] block">Who We Are</span>
          <p className="lede">
            Diarsa Global has been Edo State's in-house engineering partner since 2015 — civil and structural
            engineering, geomatics, town planning, and project management, delivered by one team rather than a chain
            of subcontractors. Twenty-plus projects since 2018, for clients including the Edo State Ministry of Roads
            &amp; Bridges and EDSOGPADEC, sit behind the seven disciplines below.
          </p>
        </motion.div>

        <motion.div
          className="section-head flex items-end justify-between flex-wrap gap-4"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)]">Seven disciplines. One integrated team.</h2>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex gap-2">
              <Arrow direction="prev" onClick={() => slide('prev')} disabled={atStart} />
              <Arrow direction="next" onClick={() => slide('next')} disabled={atEnd} />
            </div>
            <MotionLink
              to="/services"
              className="btn btn-ghost-accent"
              whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
              whileTap={{ scale: 0.97 }}
            >
              View All Services
            </MotionLink>
          </div>
        </motion.div>

        <motion.div className="relative" initial="hidden" whileInView="show" viewport={viewportRepeat} variants={fadeUp}>
          <div
            ref={trackRef}
            className="flex gap-[1.4rem] overflow-x-auto scroll-smooth snap-x snap-mandatory pb-[0.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {VISIBLE.map((s) => (
              <div
                key={s.slug}
                data-card
                className="snap-start shrink-0 w-[78%] min-[560px]:w-[47%] min-[900px]:w-[calc((100%-2.8rem)/3)]"
              >
                <ServiceCard service={s} />
              </div>
            ))}

            <div
              ref={showMoreRef}
              className={`snap-start shrink-0 w-[78%] min-[560px]:w-[47%] min-[900px]:w-[calc((100%-2.8rem)/3)] transition-opacity duration-700 ease-out ${
                moreVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Link to="/services" className="no-underline block group relative">
                <div
                  className="absolute inset-0 bg-slate-3 rounded-[10px] border border-line-dark z-0 translate-x-[10px] translate-y-[12px] transition-transform duration-300 ease-out group-hover:translate-x-[13px] group-hover:translate-y-[16px]"
                  aria-hidden="true"
                />
                <div className="relative z-[1] aspect-[4/5] rounded-[10px] border border-line-dark overflow-hidden transition-[border-color,transform,box-shadow] duration-300 ease-out group-hover:border-accent/60 group-hover:-translate-y-[3px] group-hover:shadow-[0_16px_30px_-14px_rgba(0,0,0,0.5)]">
                  <img
                    src={HIDDEN[0]?.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover animate-[ken-burns_9s_ease-in-out_infinite_alternate] [animation-play-state:paused] group-hover:[animation-play-state:running]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate from-10% via-accent-deep/55 via-55% to-slate/50" aria-hidden="true" />

                  <span className={`${cornerBase} top-[14px] left-[14px] border-t-2 border-l-2 rounded-tl-[3px] -translate-x-1.5 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
                  <span className={`${cornerBase} top-[14px] right-[14px] border-t-2 border-r-2 rounded-tr-[3px] translate-x-1.5 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
                  <span className={`${cornerBase} bottom-[14px] left-[14px] border-b-2 border-l-2 rounded-bl-[3px] -translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
                  <span className={`${cornerBase} bottom-[14px] right-[14px] border-b-2 border-r-2 rounded-br-[3px] translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />

                  {HIDDEN[1] && (
                    <div className="absolute top-[10px] right-[10px] z-[2] w-[46px] h-[46px] rounded-[8px] overflow-hidden border-2 border-slate shadow-[0_4px_10px_-2px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-out group-hover:scale-105">
                      <img src={HIDDEN[1].image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate/30" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 z-[1] p-[1.5rem] flex flex-col items-start">
                    <span className="w-[38px] h-[38px] mb-[0.9rem] rounded-full bg-white text-accent-deep flex items-center justify-center text-[1rem] font-semibold transition-transform duration-300 ease-out group-hover:translate-x-1">
                      &rarr;
                    </span>
                    <h3 className="font-display font-bold text-white text-[1.1rem] mb-[0.5rem] leading-[1.25]">Show More Services</h3>
                    <p className="text-white-soft text-[0.85rem] leading-[1.5]">
                      {HIDDEN.length} more disciplines, including {HIDDEN[HIDDEN.length - 1]?.title}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

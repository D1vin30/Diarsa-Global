import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { projects } from '../data/projects';
import { partners } from '../data/partners';
import CtaAccentBand from './CtaAccentBand';

const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const introItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.19, 1, 0.22, 1] } },
};

function TimelineEntry({ project, side }) {
  const isRight = side === 'right';
  const rowRef = useRef(null);
  const nodeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 90 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: rowRef.current, start: 'top 95%', end: 'top 45%', scrub: true },
        }
      );
      gsap.fromTo(
        nodeRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: rowRef.current, start: 'top 90%', end: 'top 65%', scrub: true },
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rowRef} className="relative grid grid-cols-2 max-[700px]:grid-cols-1 items-center">
      <div
        ref={nodeRef}
        className="hidden md:block absolute left-1/2 top-1/2 w-[10px] h-[10px] rounded-full bg-accent-tint -translate-x-1/2 -translate-y-1/2 z-[1]"
        style={{ boxShadow: '0 0 0 5px var(--color-slate), 0 0 10px rgba(221,152,104,0.6)' }}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        className={`${
          isRight ? 'col-start-2 pl-[3rem]' : 'col-start-1 pr-[3rem]'
        } max-[700px]:col-start-1 max-[700px]:px-0 max-[700px]:pl-[2rem]`}
      >
        <Link to={`/projects/${project.slug}`} className="group no-underline block">
          <div className="relative">
            <div
              className="absolute inset-0 bg-slate-3 rounded-[10px] border border-line-dark translate-x-[12px] translate-y-[12px]"
              aria-hidden="true"
            />
            <div className="relative aspect-[16/9] rounded-[10px] overflow-hidden border border-line-dark transition-colors duration-200 group-hover:border-accent/60">
              {project.image ? (
                <img
                  src={project.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover animate-[ken-burns_9s_ease-in-out_infinite_alternate] [animation-play-state:paused] group-hover:[animation-play-state:running]"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(160deg, #202d40 0%, #16202f 60%, #0e1420 100%)' }}
                />
              )}
              <div className="absolute inset-0 bg-slate/0 transition-colors duration-300 group-hover:bg-slate/20" />
            </div>
          </div>
          <div className="mt-[1.1rem] flex items-center gap-3 mb-[0.4rem]">
            <span className="font-sans font-semibold text-[0.7rem] tracking-[0.1em] uppercase text-accent-tint">{project.cat}</span>
            <span className="text-white/30" aria-hidden="true">
              &middot;
            </span>
            <span className="font-display font-bold text-[0.8rem] text-white-soft">{project.year}</span>
          </div>
          <h3 className="text-white text-[1.15rem] leading-[1.3] mb-[0.4rem] transition-colors duration-150 group-hover:text-accent-tint">
            {project.title}
          </h3>
          <p className="text-white-soft text-[0.88rem] leading-[1.5] max-w-[42ch]">{project.scope}</p>
        </Link>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const lineRef = useRef(null);

  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');
  const activePartner = clientId ? partners.find((p) => p.id === clientId) : null;
  const visibleProjects = activePartner
    ? projects.filter((p) => activePartner.matchClients.includes(p.client))
    : projects;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lineTween = gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 75%', end: 'bottom 75%', scrub: true },
      }
    );

    return () => {
      lineTween.scrollTrigger?.kill();
      lineTween.kill();
    };
  }, [visibleProjects.length]);

  return (
    <>
      <section ref={sectionRef} className="section-shell relative overflow-hidden bg-slate text-white pt-[9rem]" data-nav-theme="dark">
        <div
          className="hidden min-[1024px]:flex absolute top-[7rem] right-6 h-[110px] items-center justify-end pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          <div>
            <span
              className="block text-white/[0.15] text-[clamp(2.5rem,5.8vw,6rem)] tracking-[0.01em] leading-none whitespace-nowrap"
              style={{ fontFamily: "'Swis721 BlkEx BT', 'Big Shoulders Display', sans-serif" }}
            >
              PROJECTS
            </span>
          </div>
        </div>

        <div className="section-inner relative z-[1]">
          <motion.div className="section-head max-w-[62ch] mt-12" initial="hidden" animate="show" variants={introStagger}>
            <motion.span className="font-sans font-semibold text-[0.9rem] text-accent-tint mb-[0.8rem] block" variants={introItem}>
              Our Work
            </motion.span>
            <motion.h1 className="text-white text-[clamp(2rem,4.2vw,3rem)] mb-[1rem]" variants={introItem}>
              Projects
            </motion.h1>
            <motion.p className="lede text-white-soft" variants={introItem}>
              Engineering, geomatics, and environmental work delivered across Edo State. Project photography and
              further write-ups are in progress.
            </motion.p>
          </motion.div>

          {activePartner && (
            <div className="flex items-center gap-3 mt-6 text-white-soft text-[0.85rem]">
              <span>
                Filtered by <strong className="text-white">{activePartner.name}</strong>
              </span>
              <Link to="/projects" className="text-accent-tint no-underline hover:text-accent">
                Clear
              </Link>
            </div>
          )}

          {activePartner && visibleProjects.length === 0 && (
            <p className="lede text-white-soft mt-10 max-w-[52ch]">
              We don&rsquo;t have any published projects for {activePartner.name} yet. Check back soon, or{' '}
              <Link to="/projects" className="text-accent-tint no-underline hover:text-accent">
                view all projects
              </Link>
              .
            </p>
          )}

          <div className="relative">
            <div ref={timelineRef} className="relative mt-16 max-[700px]:mt-10">
              <div
                ref={lineRef}
                className="hidden md:block absolute left-1/2 top-[10px] bottom-[10px] w-px -translate-x-1/2 border-l border-dashed border-line-dark"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-[5rem] max-[700px]:gap-[3rem]">
                {visibleProjects.map((p, i) => (
                  <TimelineEntry key={p.slug} project={p} side={i % 2 === 0 ? 'left' : 'right'} />
                ))}
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-gradient-to-b from-transparent to-slate"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-[1] flex justify-center mt-[-2.5rem] pb-[0.5rem]">
            <button type="button" className="group btn btn-ghost-dark inline-flex items-center gap-2">
              Show More
              <span className="transition-transform duration-200 ease-out group-hover:translate-y-[3px]" aria-hidden="true">
                &darr;
              </span>
            </button>
          </div>
        </div>
      </section>
      <CtaAccentBand heading="Have a project like these in mind?" />
    </>
  );
}

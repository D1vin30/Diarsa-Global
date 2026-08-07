import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { fadeUp, stagger, viewportRepeat } from '../motion';

const services = [
  {
    num: '01',
    title: 'Civil & Structural Engineering',
    body: 'Highway design, bridge engineering, drainage and flood control — planning, design, and construction supervision for Edo State’s road and civil infrastructure.',
    sub: ['Highway & Road Design', 'Bridge & Structural Engineering', 'Drainage & Flood Control', 'Geotechnical & Foundation Investigation'],
  },
  {
    num: '02',
    title: 'Geomatics & Spatial Intelligence',
    body: 'Topographic, cadastral, and hydrographic survey; GIS mapping and drone photogrammetry — the precise spatial data every design starts from.',
    sub: ['Topographic & Cadastral Survey', 'Construction Setting Out', 'GIS & Digital Mapping', 'Drone (UAV) Photogrammetry'],
  },
  {
    num: '03',
    title: 'Environmental & Water Resources',
    body: 'Environmental impact assessment, flood risk modelling, and gully reclamation — engineering that accounts for Nigeria’s terrain and climate, not around it.',
    sub: ['Environmental Impact Assessment', 'Flood Risk & Hydraulic Design', 'Erosion & Gully Reclamation', 'Climate Change Adaptation'],
  },
  {
    num: '04',
    title: 'Project Management & Advisory',
    body: 'Construction supervision, contract administration, and engineering research — carrying projects from design through delivery.',
    sub: ['Construction Supervision', 'Contract Administration & BEME', 'Engineering Research & Data Analytics', 'Digital Mapping Decision Support'],
  },
];

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
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">Four disciplines. One integrated team.</h2>
          <p className="lede">Every engagement draws on the same in-house survey, design, and environmental expertise — no subcontracted guesswork.</p>
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
              key={s.num}
              variants={fadeUp}
            >
              <div className="font-display font-bold text-accent text-[1rem]">{s.num}</div>
              <div>
                <h3 className="text-[1.2rem] mb-[0.5rem]">{s.title}</h3>
                <p className="text-ink-soft text-[0.93rem] leading-[1.55] mt-0 mb-[0.9rem] max-w-[62ch]">{s.body}</p>
                <div className="flex flex-wrap gap-2">
                  {s.sub.map((item) => (
                    <span key={item} className="tag-pill-light">{item}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

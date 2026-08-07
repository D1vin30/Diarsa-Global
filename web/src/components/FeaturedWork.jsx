import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportRepeat } from '../motion';

const projects = [
  {
    cat: 'Civil Engineering',
    title: 'Reconstruction of Ekpoma–Iruekpen Road',
    client: 'Edo State Ministry of Roads & Bridges',
    year: '2022',
    scope: 'Supervising Consultant — review engineering design and working drawings alongside main contractor Setraco Nigeria Limited.',
  },
  {
    cat: 'Geomatics & Design',
    title: 'Design of Short Roads, EDSOGPADEC',
    client: 'Edo State Oil & Gas Producing Areas Development Commission',
    year: '2020',
    scope: 'Design data capturing — survey works, soil tests, geotechnical and geophysical survey, and full design reports.',
  },
  {
    cat: 'Environmental',
    title: 'Gully Reclamation & Erosion Control, Okhoro Central',
    client: 'Benin City, Edo State',
    year: '2019',
    scope: 'Study and engineering design for flood and erosion control across Okhoro Road, Friendship Street, and surrounding streets.',
  },
];

export default function FeaturedWork() {
  return (
    <section className="section-shell bg-slate text-white" id="work" data-nav-theme="dark">
      <div className="section-inner">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <h2 className="text-white text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">Real projects, on the ground in Edo State</h2>
          <p className="lede text-white-soft">A sample of recent and ongoing engagements. Project photography in progress.</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-3 max-[860px]:grid-cols-1 gap-[1.4rem]"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={stagger}
        >
          {projects.map((p) => (
            <motion.div
              className="bg-slate-2 rounded-[4px] border border-line-light relative p-[1.6rem] flex flex-col"
              key={p.title}
              variants={fadeUp}
              whileHover={{
                y: -6,
                zIndex: 2,
                boxShadow: '0 14px 28px -10px rgba(0,0,0,0.45)',
                transition: { duration: 0.2, ease: 'easeOut' },
              }}
            >
              <div className="flex items-center justify-between mb-[1.1rem]">
                <span className="font-sans font-semibold text-[0.7rem] tracking-[0.1em] uppercase text-accent-tint">{p.cat}</span>
                <span className="font-display font-bold text-[0.85rem] text-white-soft">{p.year}</span>
              </div>
              <h3 className="text-white text-[1.1rem] mb-[0.5rem] leading-[1.25]">{p.title}</h3>
              <p className="text-white-soft text-[0.8rem] font-medium mb-[0.8rem]">{p.client}</p>
              <p className="text-white-soft text-[0.87rem] leading-[1.55] mt-auto">{p.scope}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

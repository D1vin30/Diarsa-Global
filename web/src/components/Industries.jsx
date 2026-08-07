import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportRepeat } from '../motion';

const industries = [
  'Edo State Government',
  'Local Government Authorities',
  'Ministries',
  'Oil & Gas',
  'Construction Industry',
  'Real Estate Developers',
  'Water Resources Agencies',
  'Private Clients',
  'Corporate Clients',
];

export default function Industries() {
  return (
    <section className="section-shell" id="industries" data-nav-theme="light">
      <div className="section-inner">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <span className="eyebrow text-accent-deep mb-[0.8rem] block">Industries Served</span>
          <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">Built for the sectors moving Nigeria forward</h2>
        </motion.div>
        <motion.div
          className="flex gap-2 flex-wrap"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={stagger}
        >
          {industries.map((tag) => (
            <motion.span key={tag} className="tag-pill tag-pill-light" variants={fadeUp}>{tag}</motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

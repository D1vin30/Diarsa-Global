import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportRepeat } from '../motion';
import MediaRegion from '@media/MediaRegion';
import EditableText from '@media/EditableText';

const industries = [
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
    <section className="section-shell" id="industries" data-nav-theme="light" data-nav-label="Industries">
      <div className="section-inner">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">
            <EditableText id="home.industries.headline" as="span">Built for the sectors moving Nigeria forward</EditableText>
          </h2>
        </motion.div>
        <motion.div
          className="flex gap-2 flex-wrap"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={stagger}
        >
          {industries.map((tag, i) => (
            <motion.span key={tag} className="tag-pill tag-pill-light" variants={fadeUp}>
              <EditableText id={`home.industries.tag${i + 1}`} as="span">{tag}</EditableText>
            </motion.span>
          ))}
        </motion.div>

        <MediaRegion name="industries.extra" className="mt-8" />
      </div>
    </section>
  );
}

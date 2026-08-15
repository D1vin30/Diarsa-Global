import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../motion';

export default function CtaAccentBand({ heading, linkTo = '/contact', linkLabel = 'Talk to Our Team' }) {
  return (
    <motion.section
      className="section-shell bg-accent text-white"
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger}
    >
      <div className="section-inner flex items-center justify-between flex-wrap gap-6">
        <motion.h2 className="text-white text-[1.5rem] max-w-[32ch]" variants={fadeUp}>
          {heading}
        </motion.h2>
        <motion.div variants={fadeUp}>
          <Link to={linkTo} className="btn bg-white text-accent-deep hover:bg-white/90">
            {linkLabel}
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

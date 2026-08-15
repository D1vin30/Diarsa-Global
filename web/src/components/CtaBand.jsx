import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp, viewportOnce } from '../motion';

const MotionLink = motion(Link);

export default function CtaBand() {
  return (
    <motion.div
      className="bg-slate text-white px-6 py-[5rem] text-center border-t border-line-dark"
      id="contact"
      data-nav-theme="dark"
      data-nav-label="Contact"
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      <h2 className="text-white text-[clamp(1.7rem,4vw,2.4rem)] mb-[1.8rem]">Have a project in mind?</h2>
      <MotionLink
        className="btn btn-accent"
        to="/contact"
        whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
        whileTap={{ scale: 0.97 }}
      >
        Request a Consultation
      </MotionLink>
    </motion.div>
  );
}

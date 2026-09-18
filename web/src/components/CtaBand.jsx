import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeUp, viewportOnce } from '../motion';
import EditableText from '@media/EditableText';

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
      <h2 className="text-white text-[clamp(1.7rem,4vw,2.4rem)] mb-[1.8rem]">
        <EditableText id="home.ctaband.headline" as="span">Have a project in mind?</EditableText>
      </h2>
      <MotionLink
        className="btn btn-accent"
        to="/contact"
        whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
        whileTap={{ scale: 0.97 }}
      >
        <EditableText id="home.ctaband.cta" as="span">Request a Consultation</EditableText>
      </MotionLink>
    </motion.div>
  );
}

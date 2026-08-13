import { motion } from 'framer-motion';
import { partners } from '../data/partners';
import PartnerCard from './PartnerCard';
import { fadeUp, stagger, viewportOnce } from '../motion';

export default function PartnersPreview() {
  return (
    <section className="section-shell bg-slate pt-[9rem] min-h-screen" data-nav-theme="dark">
      <div className="section-inner">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <span className="eyebrow text-accent-tint mb-3 block">Preview — not linked from nav</span>
          <h1 className="text-white text-[clamp(1.8rem,3.6vw,2.6rem)] mb-3">Trusted Partners</h1>
          <p className="lede text-white-soft">
            Hover a card to see the partner brief and jump to their related projects.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
        >
          {partners.map((partner) => (
            <motion.div key={partner.id} variants={fadeUp}>
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

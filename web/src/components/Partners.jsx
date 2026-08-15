import { motion } from 'framer-motion';
import { partners } from '../data/partners';
import PartnerCard from './PartnerCard';
import { fadeUp, stagger, viewportRepeat } from '../motion';

export default function Partners() {
  return (
    <section className="section-shell bg-slate" id="partners" data-nav-theme="dark" data-nav-label="Partners">
      <div className="section-inner">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <span className="eyebrow text-accent-tint mb-3 block">Trusted Partners</span>
          <h2 className="text-white text-[clamp(1.7rem,3.4vw,2.3rem)] mb-3">
            Working alongside Edo State&rsquo;s public and private sector
          </h2>
          <p className="lede text-white-soft">
            Hover a card to see the partner brief and jump to their related projects.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
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

import { motion } from 'framer-motion';
import { partners } from '../data/partners';
import PartnerCard from './PartnerCard';
import { fadeUp, stagger, viewportOnce } from '../motion';
import EditableText from '@media/EditableText';

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
          <span className="eyebrow text-accent-tint mb-3 block">
            <EditableText id="conceptPartners.eyebrow" as="span">Preview — not linked from nav</EditableText>
          </span>
          <h1 className="text-white text-[clamp(1.8rem,3.6vw,2.6rem)] mb-3">
            <EditableText id="home.partners.headline" as="span">Trusted Partners</EditableText>
          </h1>
          <p className="lede text-white-soft">
            <EditableText id="home.partners.body" as="span">Hover a card to see the partner brief and jump to their related projects.</EditableText>
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
        >
          {partners.filter((partner) => !partner.placeholder).map((partner) => (
            <motion.div key={partner.id} variants={fadeUp}>
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

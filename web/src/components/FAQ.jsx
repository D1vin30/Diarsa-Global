import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { faqs } from '../data/faqs';
import { fadeUp, stagger, viewportRepeat } from '../motion';

export default function FAQ() {
  const [openId, setOpenId] = useState(null);

  return (
    <section className="section-shell" id="faq" data-nav-theme="light" data-nav-label="FAQ">
      <div className="section-inner max-w-[820px]">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={fadeUp}
        >
          <h2 className="text-[clamp(1.7rem,3.4vw,2.3rem)] mb-[0.7rem]">Questions we hear most</h2>
          <p className="lede">Straight answers on how we work, who we work with, and how to get started.</p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-2"
          initial="hidden"
          whileInView="show"
          viewport={viewportRepeat}
          variants={stagger}
        >
          {faqs.map((item, i) => {
            const open = openId === i;
            return (
              <motion.div key={item.q} variants={fadeUp} className="border border-line-light rounded-[10px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer bg-transparent border-0 font-sans font-semibold text-[0.98rem] text-ink"
                >
                  {item.q}
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-accent-deep text-xl leading-none transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 lede">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

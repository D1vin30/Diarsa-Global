import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useInView } from 'framer-motion';
import { viewportRepeat } from '../motion';
import CtaAccentBand from './CtaAccentBand';
import Slot from '@media/Slot';
import EditableText from '@media/EditableText';

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (value) => setDisplay(Math.round(value)),
    });
    return () => {
      controls.stop();
      setDisplay(to);
    };
  }, [inView, to]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const introStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const introItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.19, 1, 0.22, 1] } },
};

const IconOverview = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 21V7l8-4 8 4v14" strokeLinejoin="round" />
    <path d="M9 21v-6h6v6" strokeLinejoin="round" />
  </svg>
);
const IconLeadership = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
  </svg>
);
const IconValues = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCapabilities = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.6-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" strokeLinejoin="round" />
  </svg>
);
const IconSafety = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" strokeLinejoin="round" />
    <path d="M12 8v5" strokeLinecap="round" />
    <circle cx="12" cy="16" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

const tabs = [
  { id: 'overview', label: 'Overview', Icon: IconOverview, image: '/about/overview.jpg' },
  { id: 'leadership', label: 'Leadership', Icon: IconLeadership, image: '/about/leadership.jpg' },
  { id: 'values', label: 'Our Values', Icon: IconValues, image: '/about/values.jpg' },
  { id: 'capabilities', label: 'Capabilities', Icon: IconCapabilities, image: '/about/capabilities.jpg' },
  { id: 'safety', label: 'Safety & Quality', Icon: IconSafety, image: '/about/safety.jpg' },
];

const stats = [
  { value: 2015, suffix: '', label: 'Founded (RC 1249854)' },
  { value: 20, suffix: '+', label: 'Projects delivered since 2018' },
  { value: 8, suffix: '+', label: 'Engineering disciplines in-house' },
  { value: 6, suffix: '+', label: 'Political zones covered, via partner firms' },
];

const overviewFacts = [
  'Incorporated 18 March 2015 · RC 1249854',
  'Headquartered in Benin City, Edo State',
  'Civil/structural engineering, geomatics, town planning, project management',
  '20+ projects delivered since 2018 across Edo State',
];

const pillars = [
  { label: 'Mission', body: 'Sustainable, practical, cost-effective engineering — delivered to exceed expectations.' },
  { label: 'Vision', body: "Nigeria's most trusted multidisciplinary engineering consultancy." },
  { label: 'Philosophy', body: 'Every engineering challenge is an opportunity for innovation.' },
];

const values = [
  'Integrity', 'Professionalism', 'Technical Excellence', 'Innovation', 'Sustainability',
  'Client Satisfaction', 'Accountability', 'Teamwork', 'Continuous Improvement',
];

const leadership = [
  { initials: 'CO', name: 'Engr. Surv. Charles Cewuo Ogiamien', role: 'Managing Director / CEO', creds: 'COREN & SURCON Registered · M.Eng Geomatics Engineering' },
  { initials: 'OY', name: 'Engr. Surv. Oyeleye Yakub Oyegbade', role: 'Director, Technical Operations', creds: 'COREN & SURCON Registered · B.Eng Civil Engineering' },
  { initials: 'JO', name: 'Mrs. Joy Oghogho Ogiamien', role: 'Director, Administration / Finance', creds: 'OND Secretarial Administration' },
  { initials: 'IU', name: 'TPL. Inimfon Clifford Ukpong', role: 'Director, Town Planning / Real Estate Management', creds: 'MNITP, RTP' },
];

const advisorsLine = 'Academic advisors: Prof. Jacob Odeh Ehiorobo (Geomatics), Prof. Raphael Ehigiator-Irughe (Geodesy), Prof. Sylvester Osuji (Structural), Prof. M.O. Ehigiator-Irughe (Geophysics).';

const capabilities = [
  'Hi-Target reflectorless Total Stations', 'Trimble R7 & R8 GNSS receivers', 'Hi-Target GNSS dual-frequency receivers',
  'Hand-held GPS receivers', 'Drilling rigs with casings', 'Dutch Cone Penetrometers', 'Hand augers & levels',
  'ArcGIS 10.4', 'Microstation S.E', 'Trimble Business Center', 'Hi-Target Geomatics & GEOMATRIX', 'Carlson & Cyclone',
];

const safetyPhases = [
  { step: '01', title: 'Before Mobilization', body: 'Hazard ID and safety planning' },
  { step: '02', title: 'During Execution', body: 'Monthly site inspections' },
  { step: '03', title: 'Before Demobilization', body: 'Final safety & quality sign-off' },
];

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
    <section className="section-shell bg-paper pt-[9rem]" data-nav-theme="light">
      <div className="section-inner">
        <div className="grid grid-cols-[1.1fr_0.9fr] max-[900px]:grid-cols-1 gap-x-[3rem] gap-y-10 items-start mb-16">
          <div className="relative overflow-hidden">
            <img
              src="/dgis-logo-mark.png"
              alt=""
              aria-hidden="true"
              className="absolute top-28 left-1/2 -translate-x-1/2 w-[380px] max-w-none opacity-[0.07] pointer-events-none select-none z-0"
            />
            <motion.div
              className="max-w-[72ch] relative z-[1]"
              initial="hidden"
              animate="show"
              variants={introStagger}
            >
              <motion.span className="eyebrow text-accent-deep mb-[0.8rem] block" variants={introItem}>
                <EditableText id="about.intro.eyebrow" as="span">Est. 2015 · Benin City, Edo State</EditableText>
              </motion.span>
              <motion.h1 className="text-[clamp(2rem,4.2vw,3rem)] mb-[1.2rem]" variants={introItem}>
                <EditableText id="about.intro.headline" as="span">About Us</EditableText>
              </motion.h1>
              <motion.p className="lede mb-[1rem]" variants={introItem}>
                <EditableText id="about.intro.body1" as="span">
                  Diarsa Global Integrated Services Limited (RC 1249854) was incorporated on 18 March 2015, anchored on
                  civil/structural engineering, geomatics, town planning, and project management. Headquartered in Benin
                  City, we've delivered engineering services to the Edo State Ministry of Roads and Bridges, the Ministry
                  of Environment and Sustainability, EDSOGPADEC, and private developers across the country.
                </EditableText>
              </motion.p>
              <motion.p className="lede" variants={introItem}>
                <EditableText id="about.intro.body2" as="span">
                  Since 2018, our team has been engaged as design or supervising consultant on more than twenty road,
                  drainage, and gully-reclamation projects across Edo State — including supervising SETRACO Nigeria
                  Limited, one of the country's largest construction firms, on the reconstruction of the Ekpoma–Iruekpen
                  Road.
                </EditableText>
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            className="relative aspect-[4/5] max-[900px]:aspect-[4/3]"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportRepeat}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 15% 100%, 0 78%)' }}
          >
            <Slot
              id="about.photo.page"
              src="/about-team.jpg"
              alt="Diarsa Global field team with GNSS survey equipment"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="flex min-[641px]:hidden overflow-x-auto gap-2 mb-6 pb-1 -mx-1 px-1">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                aria-pressed={active}
                className={`shrink-0 flex items-center gap-2 rounded-full border px-4 py-2 transition-colors duration-200 cursor-pointer ${
                  active ? 'border-accent bg-accent/[0.1] text-accent-deep' : 'border-line-light text-ink-soft hover:border-ink-soft hover:text-ink'
                }`}
              >
                <t.Icon />
                <span className="text-[0.85rem] font-semibold whitespace-nowrap">
                  <EditableText id={`about.tab.${t.id}`} as="span">{t.label}</EditableText>
                </span>
              </button>
            );
          })}
        </div>

        <div className="hidden min-[641px]:grid grid-cols-5 max-[900px]:grid-cols-3 gap-3 mb-6">
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-[6px] aspect-[4/3] flex flex-col items-center justify-center gap-2 border transition-colors duration-200 cursor-pointer ${
                  active ? 'border-accent' : 'border-line-light hover:border-ink-soft'
                }`}
              >
                <div
                  className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${t.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: active
                      ? 'linear-gradient(180deg, rgba(193,100,46,0.15) 0%, rgba(20,18,15,0.72) 100%)'
                      : 'linear-gradient(180deg, rgba(20,18,15,0.25) 0%, rgba(20,18,15,0.75) 100%)',
                  }}
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
                <span className={`relative z-[1] transition-transform duration-300 group-hover:scale-110 ${active ? 'text-accent-tint' : 'text-white/80 group-hover:text-white'}`}>
                  <t.Icon />
                </span>
                <span className={`relative z-[1] text-[0.8rem] font-semibold text-center px-2 transition-colors duration-300 ${active ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>
                  <EditableText id={`about.tab.${t.id}`} as="span">{t.label}</EditableText>
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[280px] pt-10 pb-16">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial="hidden" animate="show" exit="exit" variants={panelVariants}>
                <div className="grid grid-cols-4 max-[600px]:grid-cols-2 gap-x-[1.6rem] gap-y-6 mb-10 pb-10 border-b border-line-light">
                  {stats.map((s, i) => (
                    <div key={s.label}>
                      <div className="font-display font-extrabold text-accent text-[clamp(1.8rem,3.4vw,2.4rem)] leading-none mb-[0.5rem]">
                        <Counter to={s.value} suffix={s.suffix} />
                      </div>
                      <p className="text-ink-soft text-[0.85rem] leading-[1.4] m-0">
                        <EditableText id={`about.stat${i + 1}.label`} as="span">{s.label}</EditableText>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-x-[2.4rem] gap-y-3 mb-10">
                  {overviewFacts.map((f, i) => (
                    <p key={f} className="text-ink text-[0.95rem] leading-[1.5] m-0 flex items-start gap-2">
                      <span className="text-accent">—</span>
                      <EditableText id={`about.fact${i + 1}`} as="span">{f}</EditableText>
                    </p>
                  ))}
                </div>
                <div className="grid grid-cols-3 max-[700px]:grid-cols-1 gap-x-[2rem] gap-y-6">
                  {pillars.map((p) => (
                    <div key={p.label}>
                      <h3 className="text-[0.8rem] uppercase tracking-[0.1em] text-accent-deep mb-[0.5rem]">
                        <EditableText id={`about.pillar.${p.label.toLowerCase()}.label`} as="span">{p.label}</EditableText>
                      </h3>
                      <p className="text-ink-soft text-[0.9rem] leading-[1.5] m-0">
                        <EditableText id={`about.pillar.${p.label.toLowerCase()}.body`} as="span">{p.body}</EditableText>
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'leadership' && (
              <motion.div key="leadership" initial="hidden" animate="show" exit="exit" variants={panelVariants}>
                <div className="grid grid-cols-2 max-[700px]:grid-cols-1 gap-x-[2rem] gap-y-7 mb-8">
                  {leadership.map((l, i) => (
                    <div key={l.name} className="flex gap-[1rem] items-start">
                      <div className="shrink-0 w-[46px] h-[46px] rounded-full bg-accent/[0.12] text-accent-deep font-display font-bold text-[0.9rem] flex items-center justify-center">
                        {l.initials}
                      </div>
                      <div>
                        <h3 className="text-[0.98rem] mb-[0.1rem]">
                          <EditableText id={`about.leader${i + 1}.name`} as="span">{l.name}</EditableText>
                        </h3>
                        <p className="text-accent-deep text-[0.76rem] font-semibold uppercase tracking-[0.04em] mb-[0.3rem]">
                          <EditableText id={`about.leader${i + 1}.role`} as="span">{l.role}</EditableText>
                        </p>
                        <p className="text-ink-soft text-[0.82rem] leading-[1.4] m-0">
                          <EditableText id={`about.leader${i + 1}.creds`} as="span">{l.creds}</EditableText>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-ink-soft text-[0.82rem] leading-[1.5] m-0 max-w-[72ch]">
                  <EditableText id="about.advisors" as="span">{advisorsLine}</EditableText>
                </p>
              </motion.div>
            )}

            {activeTab === 'values' && (
              <motion.div key="values" initial="hidden" animate="show" exit="exit" variants={panelVariants}>
                <div className="flex flex-wrap gap-2">
                  {values.map((v, i) => (
                    <span key={v} className="tag-pill-light"><EditableText id={`about.value${i + 1}`} as="span">{v}</EditableText></span>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'capabilities' && (
              <motion.div key="capabilities" initial="hidden" animate="show" exit="exit" variants={panelVariants}>
                <div className="flex flex-wrap gap-2">
                  {capabilities.map((c, i) => (
                    <span key={c} className="tag-pill-light"><EditableText id={`about.capability${i + 1}`} as="span">{c}</EditableText></span>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'safety' && (
              <motion.div key="safety" initial="hidden" animate="show" exit="exit" variants={panelVariants}>
                <div className="grid grid-cols-3 max-[700px]:grid-cols-1 gap-x-[2rem] gap-y-6">
                  {safetyPhases.map((p, i) => (
                    <div key={p.step}>
                      <div className="font-display font-bold text-accent text-[1rem] mb-[0.4rem]">{p.step}</div>
                      <h3 className="text-[0.98rem] mb-[0.2rem]">
                        <EditableText id={`about.safety${i + 1}.title`} as="span">{p.title}</EditableText>
                      </h3>
                      <p className="text-ink-soft text-[0.85rem] m-0">
                        <EditableText id={`about.safety${i + 1}.body`} as="span">{p.body}</EditableText>
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
    <CtaAccentBand id="about.ctaband" heading="Want our team on your next project?" />
    </>
  );
}

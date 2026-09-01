import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, stagger, cardReveal, viewportOnce } from '../motion';
import { services, getServiceBySlug } from '../data/services';
import { projects } from '../data/projects';
import ProjectCard from './ProjectCard';
import ServiceCard from './ServiceCard';
import CtaAccentBand from './CtaAccentBand';
import MediaSlot from '../media/MediaSlot';

function SectionEyebrow({ label }) {
  return (
    <div className="flex items-center gap-2 mb-[0.8rem]" aria-hidden="true">
      <span className="w-[7px] h-[7px] rounded-full bg-accent-tint shrink-0" />
      <span className="font-sans font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-accent-tint">{label}</span>
    </div>
  );
}

function NarrativeBand({ id, rail, theme, heading, body, quote, lifecycle }) {
  const dark = theme === 'dark';
  return (
    <section id={id} className={`section-shell ${dark ? 'bg-slate text-white' : 'bg-paper'}`} data-nav-theme={dark ? 'dark' : 'light'} data-nav-label={rail}>
      <div className="section-inner">
        <motion.div className="max-w-[68ch]" initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionEyebrow label={rail} />
          </motion.div>
          <motion.h2 className={`text-[1.6rem] mb-[1.2rem] ${dark ? 'text-white' : ''}`} variants={fadeUp}>
            {heading}
          </motion.h2>
          {body.map((paragraph, i) => (
            <motion.p key={i} className={`lede mb-[1rem] last:mb-0 ${dark ? 'text-white-soft' : ''}`} variants={fadeUp}>
              {paragraph}
            </motion.p>
          ))}
          {lifecycle?.length > 0 && (
            <motion.div className="grid grid-cols-3 max-[700px]:grid-cols-1 gap-x-[1.6rem] gap-y-[1.4rem] mt-[2rem]" variants={fadeUp}>
              {lifecycle.map((step, i) => (
                <div key={step.stage} className={`pt-[1rem] border-t-2 ${dark ? 'border-white/15' : 'border-line-light'}`}>
                  <span className="font-display font-bold text-accent-tint text-[0.9rem]">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className={`text-[0.95rem] font-semibold mt-[0.3rem] mb-[0.4rem] ${dark ? 'text-white' : 'text-ink'}`}>{step.stage}</h4>
                  <p className={`text-[0.85rem] leading-[1.5] ${dark ? 'text-white-soft' : 'text-ink-soft'}`}>{step.text}</p>
                </div>
              ))}
            </motion.div>
          )}
          {quote && (
            <motion.div className="mt-[2.4rem] pl-[1.4rem] border-l-[3px] border-accent max-w-[52ch]" variants={fadeUp}>
              <p className={`font-display text-[1.15rem] leading-[1.45] mb-[0.7rem] ${dark ? 'text-white' : 'text-ink'}`}>
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className={`text-[0.85rem] font-semibold ${dark ? 'text-white-soft' : 'text-ink-soft'}`}>{quote.role}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/services" replace />;

  const relatedProjects = (service.relatedProjectSlugs || [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter(Boolean);
  const otherServices = services.filter((s) => s.slug !== service.slug);
  const index = services.findIndex((s) => s.slug === service.slug);
  const fineprint = ['/projects/nigeria-scenic-1.jpg', '/projects/nigeria-scenic-2.jpg', '/projects/nigeria-scenic-3.jpg'][index % 3];

  return (
    <>
      <section className="relative h-[70vh] min-h-[440px] max-h-[640px] flex items-end overflow-hidden bg-slate" data-nav-theme="dark">
        <MediaSlot
          id={`service.${service.slug}.detailHero`}
          fallbackSrc={service.image}
          alt=""
          style={{ position: 'absolute', inset: 0 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/35 to-slate/10" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
        >
          <Link
            to="/services"
            className="absolute top-[6.5rem] right-6 z-[2] inline-flex items-center gap-2 pl-[1rem] pr-[1.2rem] py-[0.55rem] rounded-full bg-slate/70 backdrop-blur-sm border border-line-dark text-white text-[0.85rem] font-semibold no-underline transition-colors duration-200 hover:border-accent/60 hover:bg-slate/85"
          >
            <span aria-hidden="true">&larr;</span> All Services
          </Link>
        </motion.div>

        <motion.div
          className="relative z-[1] section-inner max-w-[900px] pb-[3rem] pt-[8rem] w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex items-center gap-3 mb-[0.8rem]">
            <span className="font-display font-bold text-[0.9rem] text-accent-tint">{service.num}</span>
            <span className="text-white/40" aria-hidden="true">
              &middot;
            </span>
            <span className="font-sans font-semibold text-[0.78rem] tracking-[0.1em] uppercase text-white/70">
              {service.capabilities.length} Core Capabilities
            </span>
          </div>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] max-w-[20ch]">{service.title}</h1>
        </motion.div>
      </section>

      <section id="overview" className="section-shell bg-slate text-white" data-nav-theme="dark" data-nav-label="Overview">
        <div className="section-inner">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <SectionEyebrow label="Overview" />
          </motion.div>
          <div className="grid grid-cols-[minmax(0,180px)_1fr] max-[640px]:grid-cols-1 gap-x-[3rem] gap-y-[2rem]">
            <motion.div
              className="flex flex-row max-[640px]:flex-row gap-6 max-[640px]:gap-8 flex-wrap md:flex-col md:gap-5"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={stagger}
            >
              {service.stats.map((s, i) => (
                <motion.div key={i} className={i > 0 ? 'md:pt-5 md:border-t md:border-line-dark' : ''} variants={fadeUp}>
                  <p className="font-display font-bold text-accent-tint text-[1.3rem] leading-[1.2] mb-[0.2rem]">{s.value}</p>
                  <p className="text-white-soft text-[0.8rem]">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger}>
              {service.overview.map((paragraph, i) => (
                <motion.p key={i} className="lede text-white-soft mb-[1rem] last:mb-0" variants={fadeUp}>
                  {paragraph}
                </motion.p>
              ))}
              {service.capabilities?.length > 0 && (
                <motion.div className="flex flex-wrap gap-2 mt-[1.6rem]" variants={fadeUp}>
                  {service.capabilities.map((c) => (
                    <span key={c} className="tag-pill">
                      {c}
                    </span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {service.whyItMatters && (
        <NarrativeBand id="why-it-matters" rail="Why It Matters" theme="light" heading={service.whyItMatters.heading} body={service.whyItMatters.body} />
      )}

      {service.approach && (
        <NarrativeBand
          id="approach"
          rail="Our Approach"
          theme="dark"
          heading={service.approach.heading}
          body={service.approach.body}
          lifecycle={service.approach.lifecycle}
          quote={service.quote}
        />
      )}

      {service.outcome && <NarrativeBand id="outcome" rail="Outcome" theme="light" heading="Outcome" body={[service.outcome]} />}

      {fineprint && (
        <motion.section
          className="relative h-[38vh] min-h-[240px] max-h-[360px] overflow-hidden"
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          aria-hidden="true"
        >
          <MediaSlot
            id={`service.${service.slug}.fineprint`}
            fallbackSrc={fineprint}
            alt=""
            style={{ position: 'absolute', inset: 0 }}
          />
          <div className="absolute inset-0 bg-slate/10" />
        </motion.section>
      )}

      <CtaAccentBand heading={`Have a ${service.title} project in mind?`} />

      {relatedProjects.length > 0 && (
        <section className="section-shell bg-paper" data-nav-theme="light">
          <div className="section-inner">
            <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
              <SectionEyebrow label="Seen In Practice" />
            </motion.div>
            <motion.h2 className="text-[1.5rem] mb-[1.6rem]" initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
              Related Projects
            </motion.h2>
            <motion.div
              className={`grid gap-[1.4rem] ${relatedProjects.length > 1 ? 'grid-cols-3 max-[860px]:grid-cols-1' : 'grid-cols-1 max-w-[420px]'}`}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={stagger}
            >
              {relatedProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} variants={cardReveal} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="section-shell bg-slate text-white" data-nav-theme="dark">
        <div className="section-inner">
          <motion.div
            className="section-head max-w-[62ch] mx-auto text-center"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.span className="font-sans font-semibold text-[0.85rem] text-accent-tint mb-[0.6rem] block" variants={fadeUp}>
              Continue Exploring
            </motion.span>
            <motion.h2 className="text-white text-[1.5rem]" variants={fadeUp}>
              Other Services
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 max-[860px]:grid-cols-1 gap-[1.4rem]"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            {otherServices.map((s) => (
              <ServiceCard key={s.slug} service={s} variants={cardReveal} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

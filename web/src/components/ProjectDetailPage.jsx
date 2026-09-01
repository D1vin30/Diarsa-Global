import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, stagger, cardReveal, viewportOnce } from '../motion';
import { projects, getProjectBySlug } from '../data/projects';
import { CategoryIcon } from './ProjectIcons';
import ProjectCard from './ProjectCard';
import CtaAccentBand from './CtaAccentBand';

const specLabels = { location: 'Location', duration: 'Duration', discipline: 'Discipline' };

const isVideoSrc = (src) => /\.(mp4|webm|mov)$/i.test(src);

function GalleryItem({ item, alt }) {
  const [playing, setPlaying] = useState(false);

  if (!isVideoSrc(item.src)) {
    return <img src={item.src} alt={alt} className="rounded-[4px] w-full h-full object-cover aspect-[4/3]" />;
  }

  if (playing) {
    return (
      <video
        src={item.src}
        controls
        autoPlay
        className="rounded-[4px] w-full h-full object-cover aspect-[4/3] bg-slate"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full h-full rounded-[4px] overflow-hidden aspect-[4/3]"
      aria-label={`Play video — ${alt}`}
    >
      <img src={item.poster} alt={alt} className="w-full h-full object-cover" />
      <span className="absolute inset-0 bg-slate/25 group-hover:bg-slate/35 transition-colors duration-200 flex items-center justify-center">
        <span className="w-[52px] h-[52px] rounded-full bg-white/90 flex items-center justify-center shadow-lg">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M4 2.5v13l11-6.5-11-6.5z" fill="#16202f" />
          </svg>
        </span>
      </span>
    </button>
  );
}

function SectionEyebrow({ label }) {
  return (
    <div className="flex items-center gap-2 mb-[0.8rem]" aria-hidden="true">
      <span className="w-[7px] h-[7px] rounded-full bg-accent-tint shrink-0" />
      <span className="font-sans font-semibold text-[0.8rem] tracking-[0.08em] uppercase text-accent-tint">{label}</span>
    </div>
  );
}

function NarrativeBand({ id, rail, theme, heading, body, quote, children }) {
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
          {quote && (
            <motion.div
              className={`mt-[2.4rem] pl-[1.4rem] border-l-[3px] border-accent max-w-[52ch] ${dark ? '' : ''}`}
              variants={fadeUp}
            >
              <p className={`font-display text-[1.15rem] leading-[1.45] mb-[0.7rem] ${dark ? 'text-white' : 'text-ink'}`}>
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className={`text-[0.85rem] font-semibold ${dark ? 'text-white-soft' : 'text-ink-soft'}`}>{quote.role}</p>
            </motion.div>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);
  const [factsOpen, setFactsOpen] = useState(true);

  if (!project) return <Navigate to="/projects" replace />;

  const specEntries = Object.entries(project.specs || {}).filter(([, value]) => value);

  return (
    <>
      <section className="relative h-[70vh] min-h-[440px] max-h-[640px] flex items-end overflow-hidden bg-slate" data-nav-theme="dark">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={
            project.image
              ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(160deg, #202d40 0%, #16202f 60%, #0e1420 100%)' }
          }
        >
          {!project.image && (
            <div className="text-accent-tint/70 scale-[3]">
              <CategoryIcon category={project.cat} />
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/35 to-slate/10" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
        >
          <Link
            to="/projects"
            className="absolute top-[6.5rem] right-6 z-[2] inline-flex items-center gap-2 pl-[1rem] pr-[1.2rem] py-[0.55rem] rounded-full bg-slate/70 backdrop-blur-sm border border-line-dark text-white text-[0.85rem] font-semibold no-underline transition-colors duration-200 hover:border-accent/60 hover:bg-slate/85"
          >
            <span aria-hidden="true">&larr;</span> All Projects
          </Link>
        </motion.div>

        <motion.div
          className="relative z-[1] section-inner max-w-[900px] pb-[3rem] pt-[8rem] w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex items-center gap-3 mb-[0.8rem]">
            <span className="font-sans font-semibold text-[0.78rem] tracking-[0.1em] uppercase text-accent-tint">{project.cat}</span>
            <span className="text-white/40" aria-hidden="true">
              &middot;
            </span>
            <span className="font-display font-bold text-[0.9rem] text-white/70">{project.year}</span>
          </div>
          <h1 className="text-white text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] max-w-[16ch]">{project.title}</h1>
        </motion.div>
      </section>

      <section id="overview" className="section-shell bg-slate text-white" data-nav-theme="dark" data-nav-label="Overview">
        <div className="section-inner">
          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp}>
            <SectionEyebrow label="Overview" />
          </motion.div>
          <div className="grid grid-cols-[minmax(0,180px)_1fr] max-[640px]:grid-cols-1 gap-x-[3rem] gap-y-[2rem]">
            {project.stats?.length > 0 && (
              <motion.div
                className="flex flex-row max-[640px]:flex-row gap-6 max-[640px]:gap-8 flex-wrap md:flex-col md:gap-5"
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={stagger}
              >
                {project.stats.map((s, i) => (
                  <motion.div key={i} className={i > 0 ? 'md:pt-5 md:border-t md:border-line-dark' : ''} variants={fadeUp}>
                    <p className="font-display font-bold text-accent-tint text-[1.3rem] leading-[1.2] mb-[0.2rem]">{s.value}</p>
                    <p className="text-white-soft text-[0.8rem]">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger}>
              <motion.p className="text-white-soft text-[0.85rem] font-medium mb-[0.4rem]" variants={fadeUp}>
                {project.client}
              </motion.p>
              {project.overview?.map((paragraph, i) => (
                <motion.p key={i} className="lede text-white-soft mb-[1rem] last:mb-0" variants={fadeUp}>
                  {paragraph}
                </motion.p>
              ))}

              {specEntries.length > 0 && (
                <motion.div className="mt-[2rem]" variants={fadeUp}>
                  <button
                    type="button"
                    onClick={() => setFactsOpen((v) => !v)}
                    aria-expanded={factsOpen}
                    className="group w-full flex items-center justify-between py-[0.9rem] border-y border-line-dark text-white text-[0.85rem] font-semibold tracking-[0.04em] uppercase"
                  >
                    Project Details
                    <span
                      aria-hidden="true"
                      className="relative w-[28px] h-[28px] shrink-0 rounded-full border border-line-dark flex items-center justify-center transition-colors duration-200 group-hover:border-accent/60"
                    >
                      <span className="absolute w-[10px] h-[1.5px] bg-accent-tint" />
                      <span
                        className="absolute w-[1.5px] h-[10px] bg-accent-tint transition-transform duration-300 ease-out"
                        style={{ transform: factsOpen ? 'scaleY(0)' : 'scaleY(1)' }}
                      />
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: factsOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      {specEntries.map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[8rem_1fr] max-[480px]:grid-cols-1 gap-x-4 gap-y-1 py-[0.9rem] border-b border-line-dark">
                          <span className="text-[0.75rem] uppercase tracking-[0.08em] text-white-soft">{specLabels[key] || key}</span>
                          <span className="text-white text-[0.92rem] font-medium">{value}</span>
                        </div>
                      ))}
                      {project.markets?.length > 0 && (
                        <div className="grid grid-cols-[8rem_1fr] max-[480px]:grid-cols-1 gap-x-4 gap-y-1 py-[0.9rem] border-b border-line-dark">
                          <span className="text-[0.75rem] uppercase tracking-[0.08em] text-white-soft">Markets</span>
                          <span className="flex flex-wrap gap-x-3 gap-y-1">
                            {project.markets.map((m) => (
                              <span key={m} className="text-white text-[0.92rem] font-medium">
                                {m}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                      {project.services?.length > 0 && (
                        <div className="grid grid-cols-[8rem_1fr] max-[480px]:grid-cols-1 gap-x-4 gap-y-1 py-[0.9rem] border-b border-line-dark">
                          <span className="text-[0.75rem] uppercase tracking-[0.08em] text-white-soft">Services</span>
                          <span className="flex flex-wrap gap-x-3 gap-y-1">
                            {project.services.map((s) => (
                              <span key={s} className="text-white text-[0.92rem] font-medium">
                                {s}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {project.challenge && (
        <NarrativeBand id="challenge" rail="Challenge" theme="light" heading={project.challenge.heading} body={project.challenge.body} />
      )}

      {project.approach && (
        <NarrativeBand id="approach" rail="Approach" theme="dark" heading={project.approach.heading} body={project.approach.body} quote={project.quote} />
      )}

      {project.outcome && (
        <NarrativeBand id="outcome" rail="Outcome" theme="light" heading="Outcome" body={[project.outcome]} />
      )}

      {project.fineprint && (
        <motion.section
          className="relative h-[46vh] min-h-[280px] max-h-[420px] overflow-hidden"
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${project.fineprint})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-slate/10" />
        </motion.section>
      )}

      {project.gallery?.length > 0 && (
        <section id="gallery" className="section-shell bg-paper pt-[3rem]" data-nav-theme="light" data-nav-label="Gallery">
          <div className="section-inner">
            <motion.div
              className="grid grid-cols-3 max-[700px]:grid-cols-1 gap-[1.4rem]"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={stagger}
            >
              {project.gallery.map((item, i) => (
                <motion.figure key={item.src} className="m-0" variants={fadeUp}>
                  <GalleryItem item={item} alt={item.caption || `${project.title} — photo ${i + 1}`} />
                  {item.caption && <figcaption className="mt-[0.6rem] text-ink-soft text-[0.82rem]">{item.caption}</figcaption>}
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <CtaAccentBand heading="Have a project like this in mind?" />

      <section className="section-shell bg-slate text-white" data-nav-theme="dark">
        <div className="section-inner">
          <motion.div
            className="section-head max-w-[62ch] mx-auto text-center"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.span
              className="font-sans font-semibold text-[0.85rem] text-accent-tint mb-[0.6rem] block"
              variants={fadeUp}
            >
              Continue Exploring
            </motion.span>
            <motion.h2 className="text-white text-[1.5rem]" variants={fadeUp}>
              More Projects
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 max-[860px]:grid-cols-1 gap-[1.4rem]"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger}
          >
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} variants={cardReveal} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

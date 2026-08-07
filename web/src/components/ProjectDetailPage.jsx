import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '../motion';
import { projects, getProjectBySlug } from '../data/projects';
import { CategoryIcon } from './ProjectIcons';

const specLabels = { location: 'Location', duration: 'Duration', discipline: 'Discipline' };

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <Navigate to="/projects" replace />;

  const specEntries = Object.entries(project.specs || {}).filter(([, value]) => value);
  const index = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="relative h-[70vh] min-h-[440px] max-h-[640px] flex items-end overflow-hidden bg-slate" data-nav-theme="dark">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={
            project.image
              ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: 'linear-gradient(160deg, #221f22 0%, #1a1719 60%, #121013 100%)' }
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
          className="relative z-[1] section-inner max-w-[900px] pb-[3rem] pt-[8rem] w-full"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[0.9rem] font-semibold no-underline mb-[1.6rem] transition-colors duration-150"
          >
            <span aria-hidden="true">&larr;</span> All Projects
          </Link>
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

      <section className="section-shell bg-paper" data-nav-theme="light">
        <div className="section-inner max-w-[900px]">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p className="text-ink-soft text-[1rem] font-medium mb-[2rem]" variants={fadeUp}>
              {project.client}
            </motion.p>

            {specEntries.length > 0 && (
              <motion.div
                className="grid grid-cols-3 max-[600px]:grid-cols-1 gap-x-[2rem] gap-y-4 py-[1.6rem] border-y border-line-light mb-[2.4rem]"
                variants={fadeUp}
              >
                {specEntries.map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[0.75rem] uppercase tracking-[0.08em] text-ink-soft mb-[0.3rem]">{specLabels[key] || key}</p>
                    <p className="text-ink text-[0.95rem] font-medium">{value}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {project.overview?.length > 0 && (
              <motion.div className="mb-[2.4rem] max-w-[68ch]" variants={fadeUp}>
                {project.overview.map((paragraph, i) => (
                  <p key={i} className="lede mb-[1rem] last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            )}

            {project.outcome && (
              <motion.div className="mb-[1rem] max-w-[68ch]" variants={fadeUp}>
                <h2 className="text-[1.1rem] mb-[0.6rem]">Outcome</h2>
                <p className="lede">{project.outcome}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

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
        <section className="section-shell bg-paper pt-[3rem]" data-nav-theme="light">
          <div className="section-inner max-w-[900px]">
            <motion.div
              className="grid grid-cols-2 max-[600px]:grid-cols-1 gap-[1rem]"
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={stagger}
            >
              {project.gallery.map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt={`${project.title} — photo ${i + 1}`}
                  className="rounded-[4px] w-full h-full object-cover aspect-[4/3]"
                  variants={fadeUp}
                />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <section className="section-shell bg-slate text-white" data-nav-theme="dark">
        <div className="section-inner max-w-[900px]">
          <motion.div
            className="flex justify-center mb-[3.5rem]"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
          >
            <Link to="/projects" className="btn btn-accent">
              <span aria-hidden="true">&larr;</span>&nbsp; All Projects
            </Link>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger}>
            <motion.span
              className="font-sans font-semibold text-[0.85rem] text-accent-tint mb-[0.6rem] block"
              variants={fadeUp}
            >
              Continue Exploring
            </motion.span>
            <motion.h2 className="text-white text-[1.5rem] mb-[1.6rem]" variants={fadeUp}>
              You Might Also Be Interested In
            </motion.h2>

            <motion.div variants={fadeUp}>
              <Link
                to={`/projects/${nextProject.slug}`}
                className="group no-underline flex max-[560px]:flex-col gap-[1.6rem] items-stretch bg-slate-2 border border-line-dark rounded-[4px] overflow-hidden transition-colors duration-200 hover:border-accent/60"
              >
                <div className="relative w-[42%] max-[560px]:w-full shrink-0 aspect-[4/3] max-[560px]:aspect-[16/9] overflow-hidden">
                  {nextProject.image ? (
                    <img
                      src={nextProject.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-accent-tint/70"
                      style={{ background: 'linear-gradient(160deg, #221f22 0%, #1a1719 60%, #121013 100%)' }}
                    >
                      <CategoryIcon category={nextProject.cat} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center py-[1.4rem] pr-[1.8rem] max-[560px]:px-[1.4rem] max-[560px]:pb-[1.6rem] max-[560px]:pt-0">
                  <div className="flex items-center gap-3 mb-[0.5rem]">
                    <span className="font-sans font-semibold text-[0.7rem] tracking-[0.1em] uppercase text-accent-tint">
                      {nextProject.cat}
                    </span>
                    <span className="text-white/30" aria-hidden="true">
                      &middot;
                    </span>
                    <span className="font-display font-bold text-[0.8rem] text-white-soft">{nextProject.year}</span>
                  </div>
                  <h3 className="text-white text-[1.25rem] leading-[1.25] mb-[0.6rem] transition-colors duration-150 group-hover:text-accent-tint">
                    {nextProject.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-accent-tint text-[0.85rem] font-semibold">
                    View Project
                    <span className="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

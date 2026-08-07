import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CategoryIcon } from './ProjectIcons';

export default function ProjectCard({ project, variants }) {
  return (
    <motion.div variants={variants}>
      <Link to={`/projects/${project.slug}`} className="no-underline block group relative">
        <div
          className="absolute inset-0 bg-slate-3 rounded-[4px] border border-line-dark z-0 transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:translate-x-[10px] group-hover:translate-y-[14px]"
          aria-hidden="true"
        />

        <motion.div
          className="bg-slate-2 rounded-[4px] border border-line-dark relative z-[1] flex flex-col overflow-hidden h-full transition-colors duration-200 group-hover:border-accent/60"
          whileHover={{
            y: -6,
            zIndex: 2,
            boxShadow: '0 14px 28px -10px rgba(0,0,0,0.45)',
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
        >
          <div
            className="absolute top-0 -left-[60%] w-[40%] h-full bg-gradient-to-r from-transparent via-accent-tint/[0.15] to-transparent -skew-x-[20deg] transition-[left] duration-700 ease-out group-hover:left-[120%] pointer-events-none z-[2]"
            aria-hidden="true"
          />

          <div
            className="relative aspect-[16/10] flex items-center justify-center overflow-hidden"
            style={
              project.image
                ? undefined
                : { background: 'linear-gradient(160deg, #221f22 0%, #1a1719 60%, #121013 100%)' }
            }
          >
            {project.image ? (
              <img
                src={project.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
              />
            ) : (
              <div className="text-accent-tint/70 transition-transform duration-300 ease-out group-hover:scale-110">
                <CategoryIcon category={project.cat} />
              </div>
            )}
          </div>

          <div className="p-[1.6rem] flex flex-col flex-1">
            <div className="flex items-center justify-between mb-[1.1rem]">
              <span className="font-sans font-semibold text-[0.7rem] tracking-[0.1em] uppercase text-accent-tint">{project.cat}</span>
              <span className="font-display font-bold text-[0.85rem] text-white-soft">{project.year}</span>
            </div>
            <h3 className="text-white text-[1.1rem] mb-[0.5rem] leading-[1.25]">{project.title}</h3>
            <p className="text-white-soft text-[0.8rem] font-medium mb-[0.8rem]">{project.client}</p>
            <p className="text-white-soft text-[0.87rem] leading-[1.55] mt-auto mb-[1rem]">{project.scope}</p>
            <span className="inline-flex items-center gap-2 text-accent-tint text-[0.85rem] font-semibold">
              View Project
              <span
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              >
                &rarr;
              </span>
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

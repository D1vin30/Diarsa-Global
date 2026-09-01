import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CategoryIcon } from './ProjectIcons';
import { getClientLogo } from '../data/clientLogos';

const cornerBase = 'absolute w-[16px] h-[16px] border-accent-tint opacity-0 z-[2] transition-[opacity,transform] duration-200 ease-out';

export default function ProjectCard({ project, variants }) {
  const clientLogo = getClientLogo(project.client);

  return (
    <motion.div variants={variants}>
      <Link to={`/projects/${project.slug}`} className="no-underline block group relative">
        <div
          className="absolute inset-0 bg-slate-3 rounded-[10px] border border-line-dark z-0 translate-x-[10px] translate-y-[12px] transition-transform duration-300 ease-out group-hover:translate-x-[13px] group-hover:translate-y-[16px]"
          aria-hidden="true"
        />
        <div className="relative z-[1] aspect-[4/5] rounded-[10px] border border-line-dark overflow-hidden transition-[border-color,transform,box-shadow] duration-300 ease-out group-hover:border-accent/60 group-hover:-translate-y-[3px] group-hover:shadow-[0_16px_30px_-14px_rgba(0,0,0,0.5)]">
          {project.image ? (
            <img
              src={project.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover animate-[ken-burns_9s_ease-in-out_infinite_alternate] [animation-play-state:paused] group-hover:[animation-play-state:running]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #202d40 0%, #16202f 60%, #0e1420 100%)' }}>
              <div className="text-accent-tint/70">
                <CategoryIcon category={project.cat} />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate from-15% via-slate/55 via-55% to-transparent" aria-hidden="true" />

          <span className={`${cornerBase} top-[14px] left-[14px] border-t-2 border-l-2 rounded-tl-[3px] -translate-x-1.5 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
          <span className={`${cornerBase} top-[14px] right-[14px] border-t-2 border-r-2 rounded-tr-[3px] translate-x-1.5 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
          <span className={`${cornerBase} bottom-[14px] left-[14px] border-b-2 border-l-2 rounded-bl-[3px] -translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
          <span className={`${cornerBase} bottom-[14px] right-[14px] border-b-2 border-r-2 rounded-br-[3px] translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />

          <div className="absolute inset-x-0 bottom-0 z-[1] p-[1.5rem] flex flex-col">
            <div className="flex items-center justify-between mb-[0.6rem]">
              <span className="font-sans font-semibold text-[0.7rem] tracking-[0.1em] uppercase text-accent-tint">{project.cat}</span>
              <span className="font-display font-bold text-[0.85rem] text-white-soft">{project.year}</span>
            </div>
            <h3 className="text-white text-[1.1rem] mb-[0.5rem] leading-[1.25] transition-colors duration-150 group-hover:text-accent-tint">
              {project.title}
            </h3>
            <div className="flex items-center gap-[0.4rem] mb-[0.8rem]">
              {clientLogo && (
                <img src={clientLogo} alt="" className="shrink-0 w-[16px] h-[16px] rounded-full object-cover bg-paper" />
              )}
              <p className="text-white-soft text-[0.8rem] font-medium m-0">{project.client}</p>
            </div>
            <p className="text-white-soft text-[0.87rem] leading-[1.55] mb-[1rem]">{project.scope}</p>
            <span className="inline-flex items-center gap-2 text-accent-tint text-[0.85rem] font-semibold">
              View Project
              <span className="transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

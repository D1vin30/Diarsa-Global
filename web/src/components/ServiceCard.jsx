import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { getClientLogo } from '../data/clientLogos';

const cornerBase = 'absolute w-[16px] h-[16px] border-accent-tint opacity-0 z-[2] transition-[opacity,transform] duration-200 ease-out';

export default function ServiceCard({ service, variants }) {
  const client = service.relatedProjectSlugs?.length
    ? projects.find((p) => p.slug === service.relatedProjectSlugs[0])?.client
    : null;
  const clientLogo = getClientLogo(client);

  return (
    <motion.div variants={variants}>
      <Link to={`/services/${service.slug}`} className="no-underline block group relative">
        <div
          className="absolute inset-0 bg-slate-3 rounded-[10px] border border-line-dark z-0 translate-x-[10px] translate-y-[12px] transition-transform duration-300 ease-out group-hover:translate-x-[13px] group-hover:translate-y-[16px]"
          aria-hidden="true"
        />
        <div className="relative z-[1] aspect-[4/5] rounded-[10px] border border-line-dark overflow-hidden transition-[border-color,transform,box-shadow] duration-300 ease-out group-hover:border-accent/60 group-hover:-translate-y-[3px] group-hover:shadow-[0_16px_30px_-14px_rgba(0,0,0,0.5)]">
          <img
            src={service.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-[ken-burns_9s_ease-in-out_infinite_alternate] [animation-play-state:paused] group-hover:[animation-play-state:running]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate from-15% via-slate/55 via-55% to-transparent" aria-hidden="true" />

          <span className={`${cornerBase} top-[14px] left-[14px] border-t-2 border-l-2 rounded-tl-[3px] -translate-x-1.5 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
          <span className={`${cornerBase} top-[14px] right-[14px] border-t-2 border-r-2 rounded-tr-[3px] translate-x-1.5 -translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
          <span className={`${cornerBase} bottom-[14px] left-[14px] border-b-2 border-l-2 rounded-bl-[3px] -translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />
          <span className={`${cornerBase} bottom-[14px] right-[14px] border-b-2 border-r-2 rounded-br-[3px] translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`} aria-hidden="true" />

          {client && (
            <div className="absolute top-[10px] left-[10px] z-[2] flex items-center gap-[0.4rem] max-w-[calc(100%-20px)] rounded-full border border-line-dark bg-slate/85 backdrop-blur-sm py-[0.3rem] pl-[0.3rem] pr-[0.7rem] opacity-0 -translate-y-1.5 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              <span className="shrink-0 w-[20px] h-[20px] rounded-full bg-paper text-slate font-display font-extrabold text-[0.58rem] flex items-center justify-center">
                DG
              </span>
              <span className="text-white-soft text-[0.65rem]" aria-hidden="true">&times;</span>
              {clientLogo && (
                <img
                  src={clientLogo}
                  alt=""
                  className="shrink-0 w-[20px] h-[20px] rounded-full object-cover bg-paper"
                />
              )}
              <span className="text-white text-[0.68rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{client}</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 z-[1] p-[1.5rem] flex flex-col">
            <span className="inline-block font-display font-bold text-[0.85rem] text-accent-tint mb-[0.5rem] transition-transform duration-300 ease-out group-hover:scale-110 origin-left">
              {service.num}
            </span>
            <h3 className="text-white text-[1.1rem] mb-[0.6rem] leading-[1.25] transition-colors duration-150 group-hover:text-accent-tint">
              {service.title}
            </h3>
            <p className="text-white-soft text-[0.87rem] leading-[1.55] mb-[1rem]">{service.tagline}</p>
            <span className="inline-flex items-center gap-2 text-accent-tint text-[0.85rem] font-semibold">
              View Service
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

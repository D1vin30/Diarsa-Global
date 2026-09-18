import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import EditableText from '@media/EditableText';

export default function PartnerCard({ partner }) {
  const cardRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const updateOrigin = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const hasProjects = partner.matchClients.length > 0;

  return (
    <div
      ref={cardRef}
      className="relative h-[230px] rounded-[10px] overflow-hidden"
      onMouseEnter={(e) => { updateOrigin(e); setRevealed(true); }}
      onMouseLeave={(e) => { updateOrigin(e); setRevealed(false); }}
      onFocus={() => setRevealed(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setRevealed(false); }}
    >
      <div
        className="absolute inset-0 rounded-[10px] border border-line-dark bg-slate-2 flex flex-col items-center justify-center text-center gap-3 p-5 transition-opacity duration-500 ease-[ease]"
        style={{ opacity: revealed ? 0 : 1 }}
      >
        <div className="w-14 h-14 rounded-full bg-slate-3 border border-line-dark flex items-center justify-center overflow-hidden">
          {partner.logo ? (
            <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#9c968f" strokeWidth="1.5" className="w-6 h-6">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
          )}
        </div>
        <div className="text-white font-semibold text-[0.92rem] leading-tight">
          <EditableText id={`partners.${partner.id}.name`} as="span">{partner.name}</EditableText>
        </div>
        <div className="text-white-soft text-[0.7rem] uppercase tracking-wide">
          <EditableText id={`partners.${partner.id}.tagline`} as="span">{partner.tagline}</EditableText>
        </div>
      </div>

      <div
        className="partner-card-back absolute inset-0 rounded-[10px] bg-accent p-5 flex flex-col justify-between"
        style={{
          '--mx': `${origin.x}%`,
          '--my': `${origin.y}%`,
          '--r': revealed ? '145%' : '0%',
          pointerEvents: revealed ? 'auto' : 'none',
        }}
      >
        <div
          className="transition-[filter,opacity] duration-600 ease-[ease]"
          style={{ transitionDelay: '0.08s', filter: revealed ? 'blur(0px)' : 'blur(10px)', opacity: revealed ? 1 : 0 }}
        >
          <div className="text-white font-semibold text-[0.85rem] mb-1.5">
            <EditableText id={`partners.${partner.id}.name`} as="span">{partner.name}</EditableText>
          </div>
          <div className="text-white/90 text-[0.78rem] leading-relaxed">
            <EditableText id={`partners.${partner.id}.summary`} as="span">{partner.summary}</EditableText>
          </div>
        </div>
        {hasProjects ? (
          <Link
            to={`/projects?client=${partner.id}`}
            className="block text-white text-[0.76rem] font-semibold no-underline border-t border-white/25 pt-2.5 mt-2.5"
          >
            <EditableText id="home.partnercard.cta" as="span">View Related Projects</EditableText> →
          </Link>
        ) : (
          <span className="block text-white/55 text-[0.76rem] font-semibold border-t border-white/25 pt-2.5 mt-2.5">
            <EditableText id="home.partnercard.empty" as="span">No linked projects yet</EditableText>
          </span>
        )}
      </div>
    </div>
  );
}

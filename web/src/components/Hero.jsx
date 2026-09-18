import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Slot from '@media/Slot';
import EditableText from '@media/EditableText';
import useEditing from '@media/useEditing';

const MotionLink = motion(Link);

const SLIDE_DURATION = 7000;

const headlineReveal = {
  hidden: { opacity: 0, y: 36, filter: 'blur(9px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, delay: 0.2, ease: [0.19, 1, 0.22, 1] } },
};

const subcopyReveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, delay: 0.75, ease: [0.19, 1, 0.22, 1] } },
};

const buttonGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.85 } },
};

const buttonItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } },
};

// One slide per service (first 5 of 7) — each ties the hero to a real
// DIARSA field photo rather than stock imagery.
const slides = [
  {
    mediaId: 'home.hero.1',
    media: { type: 'image', src: '/hero-geomatics.jpg' },
    textPrefix: 'slide1',
    serviceSlug: 'geomatics-engineering',
    headline: 'The Ground Truth Before Every Design.',
    body: 'Topographic, cadastral, hydrographic, and marine geophysical survey — the precise spatial data every design starts from.',
  },
  {
    mediaId: 'home.hero.2',
    media: { type: 'video', src: '/hero-loop.mp4', poster: '/hero-poster.jpg' },
    textPrefix: 'slide2',
    serviceSlug: 'civil-engineering-consultancy',
    headline: 'Roads Engineered by Design, Not Guesswork.',
    body: 'Our teams plan and design road networks using the same advanced, industry-compatible CAD and GIS software used by leading engineering firms — precision-modeled for Nigeria’s terrain, traffic, and climate.',
  },
  {
    mediaId: 'home.hero.3',
    media: { type: 'image', src: '/preview-p01-img-04.jpg' },
    textPrefix: 'slide3',
    serviceSlug: 'hydrological-water-resources',
    headlineUppercase: true,
    headline: 'Leaders in Drainage Design.',
    body: 'Environmental impact assessment, flood risk modelling, and gully reclamation — hydrology-led drainage design built for Nigeria’s terrain and rainfall, not generic templates.',
  },
  {
    mediaId: 'home.hero.4',
    media: { type: 'image', src: '/hero-gis.jpg' },
    textPrefix: 'slide4',
    serviceSlug: 'gis-digital-mapping',
    headline: 'Digital Maps Built for Real Decisions.',
    body: 'Digital mapping, spatial analysis, and satellite imagery — turning raw geospatial data into decisions clients can act on, backed by drone orthophotography where the terrain calls for it.',
  },
  {
    mediaId: 'home.hero.5',
    media: { type: 'image', src: '/hero-environmental.jpg' },
    textPrefix: 'slide5',
    serviceSlug: 'environmental-consultancy',
    headline: 'Environmental Engineering, Not an Afterthought.',
    body: 'Environmental impact assessment and ecological studies, erosion and gully reclamation — engineering that accounts for Nigeria’s terrain and climate, not around it.',
  },
];

const slideCount = slides.length;

function Dots({ active, setActive }) {
  return (
    <div className="flex justify-center gap-[0.2rem]">
      {Array.from({ length: slideCount }).map((_, i) => (
        <button
          key={i}
          aria-label={`Show slide ${i + 1}`}
          aria-current={i === active}
          onClick={() => setActive(i)}
          className="group p-[0.65rem] -m-[0.65rem] cursor-pointer"
        >
          <span
            className={`block h-[4px] rounded-full transition-all duration-300 ${
              i === active ? 'w-10 bg-accent-tint' : 'w-5 bg-line-dark group-hover:bg-white-soft'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const editing = useEditing();

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    // `paused` only covers the mouse hovering this section — the editor's
    // pill lives below the fold here, so working its fields moves the mouse
    // off-section and un-pauses the slide out from under whatever's selected.
    // `editing` freezes it for the whole time the editor is on, regardless.
    if (paused || editing || reducedMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % slideCount), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [active, paused, editing, reducedMotion]);

  return (
    <section
      className="hero relative overflow-hidden bg-slate min-h-[92svh]"
      data-nav-theme="dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.mediaId}
          className={`absolute inset-0 flex flex-col px-6 pt-[10.5rem] pb-10 transition-opacity duration-700 ease-in-out ${
            active === i ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {slide.media.type === 'video' ? (
            reducedMotion ? (
              <Slot
                id={`${slide.mediaId}.poster`}
                src={slide.media.poster}
                alt=""
                className="absolute inset-0 z-0 w-full h-full object-cover"
                hasOverlayText
              />
            ) : (
              <Slot
                id={slide.mediaId}
                src={slide.media.src}
                poster={slide.media.poster}
                type="video"
                className="absolute inset-0 z-0 w-full h-full object-cover"
                hasOverlayText
              />
            )
          ) : (
            <Slot
              id={slide.mediaId}
              src={slide.media.src}
              alt=""
              className="absolute inset-0 z-0 w-full h-full object-cover"
              hasOverlayText
            />
          )}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-slate/72 via-slate/28 to-slate/8" />

          <div className="relative z-[3] mt-auto max-w-[1180px] w-full mx-auto">
            <motion.div initial="hidden" animate={active === i ? 'show' : 'hidden'} variants={headlineReveal}>
              <div className="w-16 h-[2px] bg-white mb-[1.1rem]" />
              <h2
                className={`text-white text-[clamp(1.9rem,4.6vw,3.2rem)] leading-[1.1] tracking-[-0.01em] max-w-[20ch] mb-[1.7rem] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)] ${
                  slide.headlineUppercase ? 'uppercase' : ''
                }`}
              >
                <EditableText id={`home.hero.${slide.textPrefix}.headline`} as="span">{slide.headline}</EditableText>
              </h2>
            </motion.div>

            <motion.div
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
              initial="hidden"
              animate={active === i ? 'show' : 'hidden'}
              variants={subcopyReveal}
            >
              <p className="text-white-soft text-[0.98rem] leading-[1.65] max-w-[52ch] [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
                <EditableText id={`home.hero.${slide.textPrefix}.body`} as="span">{slide.body}</EditableText>
              </p>
              <motion.div
                className="flex flex-col items-start gap-3 shrink-0"
                initial="hidden"
                animate={active === i ? 'show' : 'hidden'}
                variants={buttonGroup}
              >
                <MotionLink
                  to={`/services/${slide.serviceSlug}`}
                  className="inline-flex items-center gap-2 text-white font-semibold text-[0.95rem] no-underline whitespace-nowrap hover:text-accent-tint transition-colors duration-150"
                  variants={buttonItem}
                  whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <EditableText id={`home.hero.${slide.textPrefix}.cta2`} as="span">View Service</EditableText> <span aria-hidden="true">&rarr;</span>
                </MotionLink>
                <MotionLink
                  to="/contact"
                  className="inline-flex items-center gap-2 text-white font-semibold text-[0.95rem] no-underline whitespace-nowrap hover:text-accent-tint transition-colors duration-150"
                  variants={buttonItem}
                  whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: 'easeOut' } }}
                  whileTap={{ scale: 0.97 }}
                >
                  <EditableText id={`home.hero.${slide.textPrefix}.cta`} as="span">Request a Consultation</EditableText> <span aria-hidden="true">&rarr;</span>
                </MotionLink>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative z-[3] mt-8">
            <Dots active={active} setActive={setActive} />
          </div>
        </div>
      ))}
    </section>
  );
}

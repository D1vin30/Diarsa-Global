import config from '../data/mediaConfig.json';
import { slotToStyle, boxToStyle, normalizeSlot } from './position';

// Dumb. Read-only. Ships to production exactly as written here.
//
// Two ways a slot can be used:
//  - fixed  — a page author wrote <Slot id="..." className="..."/> at a real
//    spot in the JSX. The page's own className/wrapper is the frame; this
//    just supplies the picture and its crop.
//  - freeform — added later through the local editor tool via <MediaRegion>.
//    Carries its own box (size/shape) and owns its frame; MediaRegion places
//    it. Both render identically in dev and production — only *adding* one
//    needs the editor tool; showing one already saved needs nothing extra.
export default function Slot({ id, src: fallbackSrc, poster, type, className, alt = '' }) {
  const raw = config.slots[id];
  const src = raw?.src || fallbackSrc;
  if (!src) return null;

  const s = normalizeSlot(raw);
  const style = slotToStyle(raw);
  const isVideo = (raw?.type || type) === 'video';
  const media = isVideo
    ? <video src={src} poster={poster} className={raw?.placement ? undefined : className} style={style} autoPlay muted loop playsInline />
    : <img src={src} alt={alt} className={raw?.placement ? undefined : className} style={style} />;

  if (!raw?.placement) return media; // fixed call site — no frame of its own

  return (
    <figure style={{ ...boxToStyle(raw.box), margin: 0 }}>
      {media}
      {s.caption && (
        <figcaption style={{ font: '500 0.8rem/1.4 ui-sans-serif,system-ui,sans-serif', color: '#6b7280', marginTop: '0.4rem' }}>
          {s.caption}
        </figcaption>
      )}
    </figure>
  );
}

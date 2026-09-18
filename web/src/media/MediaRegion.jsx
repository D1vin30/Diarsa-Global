import config from '../data/mediaConfig.json';
import Slot from './Slot';
import { normalizePlacement, placementToStyle } from './position';

// Dumb. Read-only. Ships to production exactly as written here.
//
// A named drop zone. Wrap any page section in <MediaRegion name="..."> and
// every image someone has added here via the local editor tool's "+ add
// image here" renders — in-flow (pushes content, top or bottom) or as an
// overlay pinned at x/y. No region-editor UI lives in this file; that's the
// dev-only, aliased-in @media/MediaRegion swap (see web/vite.config.js).
export default function MediaRegion({ name, children, className, style }) {
  const items = Object.entries(config.slots)
    .filter(([, s]) => s.placement?.region === name)
    .map(([id, s]) => ({ id, placement: normalizePlacement(s.placement) }));

  const flowTop = items.filter((x) => x.placement.flow && x.placement.flowAt === 'top');
  const flowBottom = items.filter((x) => x.placement.flow && x.placement.flowAt === 'bottom');
  const overlays = items.filter((x) => !x.placement.flow);

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {flowTop.map(({ id }) => <Slot key={id} id={id} />)}
      {children}
      {flowBottom.map(({ id }) => <Slot key={id} id={id} />)}
      {overlays.map(({ id, placement }) => (
        <div key={id} style={placementToStyle(placement)}>
          <Slot id={id} />
        </div>
      ))}
    </div>
  );
}

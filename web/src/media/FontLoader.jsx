import { useEffect } from 'react';
import config from '../data/fontConfig.json';
import { applyFonts } from './fonts';

// Dumb. Read-only. Ships to production exactly as written here.
//
// Applies whatever font choice was saved in the local editor tool (fontConfig
// .json) once, on mount — a no-op visual change (built-in local fonts stay)
// until someone actually picks a Google Font in the editor. No live updates,
// no server call: the interactive version only exists outside this repo (see
// @media/FontLoader in web/vite.config.js).
export default function FontLoader() {
  useEffect(() => {
    if (config.display || config.sans) applyFonts(config);
  }, []);
  return null;
}

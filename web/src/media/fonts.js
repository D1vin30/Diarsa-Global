// Shared between the dumb FontLoader (ships to production) and the
// interactive one (dev:editor only) — the actual "load this Google Font and
// point the site's type-scale at it" logic lives in exactly one place.

// A short, curated pick of well-known Google Fonts across the site's two
// roles (display = headings, sans = body/UI). Not the full ~1800-font
// catalog — Google's listing API needs a key we don't have — but the picker
// also takes free text, so any Google Fonts family name works, typed exactly
// as Google Fonts spells it.
export const GOOGLE_FONT_CHOICES = {
  display: [
    'Big Shoulders Display', 'Anton', 'Archivo Black', 'Bebas Neue', 'Big Shoulders Inline Display',
    'Fjalla One', 'League Gothic', 'Libre Franklin', 'Oswald', 'Playfair Display', 'Poppins',
    'Prata', 'Rajdhani', 'Righteous', 'Saira Condensed', 'Space Grotesk', 'Staatliches', 'Teko',
  ],
  sans: [
    'Work Sans', 'Inter', 'Karla', 'Lato', 'Manrope', 'Mulish', 'Nunito Sans', 'Open Sans',
    'Plus Jakarta Sans', 'Public Sans', 'Rubik', 'Source Sans 3', 'Sora', 'Urbanist',
  ],
};

const WEIGHTS = '400;500;600;700;800';
let linkEl = null;

function googleFontsHref(display, sans) {
  const families = [display, sans]
    .filter(Boolean)
    .map((name) => `family=${encodeURIComponent(name)}:wght@${WEIGHTS}`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

// Injects/updates the single Google Fonts <link>, and points the site's
// --font-display / --font-sans variables (set in index.css's @theme, used by
// every heading and by body text) at the chosen families. Passing null for a
// role leaves the site's built-in local font (Big Shoulders Display / Work
// Sans) alone.
export function applyFonts({ display, sans }) {
  const root = document.documentElement;

  if (display) root.style.setProperty('--font-display', `'${display}', sans-serif`);
  else root.style.removeProperty('--font-display');

  if (sans) root.style.setProperty('--font-sans', `'${sans}', ui-sans-serif, sans-serif`);
  else root.style.removeProperty('--font-sans');

  if (!display && !sans) {
    linkEl?.remove();
    linkEl = null;
    return;
  }

  const href = googleFontsHref(display, sans);
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }
  if (linkEl.href !== href) linkEl.href = href;
}

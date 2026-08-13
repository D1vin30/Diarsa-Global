# Trusted Partners Section — Design

## Context

The homepage currently has an `Industries.jsx` section (plain text tag-pills
— "Edo State Government", "Oil & Gas", "Construction Industry", etc.) linked
from the top nav as "Industries" (`/#industries`). A separate `TrustStrip.jsx`
bar right under the hero duplicates a shorter version of the same list.

Goal, per direction from the MD's side: replace the plain tag-pill treatment
with a "Trusted Partners" card grid in the style of Hitech
(hitech-company.com) — a logo tile that reveals a brief write-up on hover,
each with a link through to that partner's related projects. Nav loses the
"Industries" entry; partners become their own section instead of a category
list.

Real partner content is thin right now — verified from the company profile
PDF, Diarsa's actual named clients are three Edo State Government bodies,
sharing one seal logo:

- Ministry of Roads and Bridges
- Ministry of Environment and Sustainability
- Edo State Oil & Gas Producing Areas Development Commission (EDSOGPADEC)

No private/corporate partners are named anywhere in the source material. A
vague reference to "sister companies in the six political zones" exists with
no names attached.

This spec covers a **hidden preview page** only — matching the existing
`/concept/civic-signal` pattern (unlinked route, real code, reviewable in the
actual site before it's wired into the homepage). Swapping it into the
homepage (replacing `Industries.jsx`, removing "Industries" from
`Header.jsx`'s nav, and deciding `TrustStrip.jsx`'s fate) is a **follow-up
step after this preview is approved** — out of scope here so the live
homepage nav/section isn't left half-migrated.

## Data model

New file: `web/src/data/partners.js`:

```js
{
  id: 'edo-state-government',
  name: 'Edo State Government',
  tagline: 'Partner since 2015',       // front-face small label
  logo: '/logos/edo-state-seal.png',   // null → falls back to a generic icon
  placeholder: false,                   // true = "pending MD confirmation" styling
  summary: "Delivering civil, geomatics and environmental consultancy across Roads & Bridges, Environment & Sustainability, and EDSOGPADEC.", // ~2 sentences, back face
  matchClients: [
    'Edo State Ministry of Roads & Bridges',
    'Edo State Oil & Gas Producing Areas Development Commission',
  ], // exact-match against project.client — drives "View Related Projects"
}
```

Initial 4 entries:

1. **Edo State Government** — real, as above, `placeholder: false`.
2. **Sister Company A/B/C** — `placeholder: true`, `logo: null` (generic
   building icon), `matchClients: []` (no related projects yet), summary
   copy explicitly says the name/logo are pending MD confirmation. These are
   filler tiles for grid balance, not invented company names — the copy says
   so plainly rather than pretending they're real.

`matchClients` is how the "View Related Projects" link works — it filters
`projects.js` by exact `client` string match. No new field goes on the
project records themselves, so `projects.js`, `ProjectCard.jsx`, and the
existing Projects/Services pages are untouched by this spec.

## Component: `PartnerCard.jsx`

Front face: logo (or generic icon fallback) + org name + tagline, centered.

Back face: name + summary copy + "View Related Projects →" (or, when
`matchClients` resolves to zero projects, plain non-interactive text "No
linked projects yet" in a muted style — no dead link).

**Animation** (validated live in the brainstorm companion, this is the
locked version):

- On mouse-enter, capture the cursor's position within the card as a
  percentage (`--mx`, `--my` CSS custom properties).
- Front face fades out (`opacity 0.5s ease`).
- Back face reveals via a feathered radial mask anchored at that point:
  `mask-image: radial-gradient(circle at var(--mx) var(--my), black calc(var(--r) - 28%), transparent var(--r))`,
  with `--r` registered via `@property` (`<percentage>`, animatable) and
  transitioned `0% → 145%` over `0.7s cubic-bezier(0.16,1,0.3,1)` on hover.
  This gives a soft-edged spotlight growth from the entry point, not a hard
  clip-path circle (an earlier hard-edge version was tried and rejected as
  "weak/not appealing").
- Back-face text content additionally does a blur-focus pull: starts
  `blur(10px)` + `opacity:0`, transitions to `blur(0)` + `opacity:1` over
  `0.6s ease` with a small `0.08s` delay so it settles in just behind the
  mask.
- On mouse-leave, `--r` animates back to `0%` from the exit point (same
  mechanic, reversed), front face fades back in.
- `@property` is Chromium/modern-Safari; in browsers without it the mask
  just won't interpolate smoothly — the reveal still functions (front fade +
  instant back visibility), so this is a progressive enhancement, not a
  hard dependency. No JS fallback needed.
- Implemented as React state (`hovered` bool) + inline style for the two
  custom properties set in the `onMouseEnter`/`onMouseLeave` handlers using
  `getBoundingClientRect()` — same math as the working mockup, translated
  from vanilla JS to JSX handlers.

## Preview page: `/concept/partners`

New route in `App.jsx`, alongside the existing `/concept/civic-signal`
pattern (rendered under the `isConcept` branch — header only, no footer/
back-to-top, unlinked from nav). New component
`web/src/components/PartnersPreview.jsx`: section heading + the 4-card grid,
enough padding/context to judge it as it would sit on the homepage, nothing
else.

## Related-projects link behavior

Clicking "View Related Projects →" navigates to
`/projects?client=<partner-id>`. `ProjectsPage.jsx` gets a small addition:

- Reads the `client` search param on mount.
- If present, filters the rendered project list to those whose `project.client`
  is in the matching partner's `matchClients` (looked up from
  `partners.js` by id) instead of showing all projects.
- Shows a one-line "Filtered by {Partner Name} — Clear" affordance above the
  timeline when a filter is active; clicking "Clear" removes the param.
- If the param is absent (the normal `/projects` visit, and the current
  homepage/nav link into it), behavior and layout are byte-for-byte what
  they are today.

This is additive to `ProjectsPage.jsx` only — no visual or structural change
to its default state.

## Needs-list additions

`NEEDS_FROM_MD.md` gets a new item under partners: real names + logos for
the "Sister Company" placeholder slots (or confirmation there are none worth
featuring yet), and whether the 3 government bodies should ever get their
own individual logos instead of sharing the one seal.

## Out of scope (follow-up, after preview approval)

- Removing "Industries" from `Header.jsx` nav
- Replacing `Industries.jsx` on the homepage with this grid
- `TrustStrip.jsx`'s fate (keep, merge, or remove — decide once the partners
  section has a home)

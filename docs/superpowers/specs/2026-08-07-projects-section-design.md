# Projects Section — Design

## Context

The homepage has a "Real projects, on the ground in Edo State" section
(`FeaturedWork.jsx`) showing 3 hardcoded project cards — category tag, title,
client, year, one-line scope. No images. No links. Nothing else on the site
references these projects.

Goal: turn this into a real, click-through projects feature —

- Homepage keeps a teaser (existing 3 cards + a link to see everything)
- A `/projects` index page lists every project
- Each project gets its own `/projects/:slug` write-up page
- The whole thing is a **template with slots**: real photography, longer
  write-ups, and additional projects don't exist yet (tracked in
  `NEEDS_FROM_MD.md`). The structure must make it easy to paste content in
  when it arrives, and easy to add a new slot/field if something doesn't fit
  yet.

This spec covers the first slice: the data model, routing, the homepage
card section (animation + watermark), the `/projects` index, and the
`/projects/:slug` template. Content stays placeholder/sample where real
material isn't available.

## Data model

New file: `web/src/data/projects.js`. One exported array, one object per
project:

```js
{
  slug: 'ekpoma-iruekpen-road',       // used in the URL
  cat: 'Civil Engineering',
  title: 'Reconstruction of Ekpoma–Iruekpen Road',
  client: 'Edo State Ministry of Roads & Bridges',
  year: '2022',
  scope: 'Supervising Consultant — review engineering design and working drawings alongside main contractor Setraco Nigeria Limited.',

  // new fields, used on the detail page — placeholder-friendly, all optional
  overview: [ /* array of paragraph strings — longer write-up body */ ],
  specs: { location: '', duration: '', discipline: '' }, // any subset, omit what's unknown
  outcome: '',           // results paragraph — omit if not written yet
  image: null,           // hero image path — null renders the placeholder treatment
  gallery: [],           // array of image paths — empty renders nothing
}
```

The 3 existing projects move here as-is, with `overview` written as a
1-2 paragraph expansion of their existing `scope` line (still placeholder
quality — real write-ups come later per `NEEDS_FROM_MD.md`). `image` stays
`null` for all of them (no real photography yet — same placeholder
gradient treatment `About.jsx` already uses for its photo slot).

Both `FeaturedWork.jsx` (homepage teaser) and the new `ProjectsPage.jsx`
(index) import from this file and render the same `ProjectCard` component,
so there's one source of truth and one card design.

Adding a project = adding an object to the array. Adding a new field the
template doesn't have yet = adding a key to the object and a slot in
`ProjectDetailPage.jsx` that renders it if present.

## Routing

`web/src/App.jsx` gets two new routes:

- `/projects` → `ProjectsPage.jsx` — grid of all projects (same `ProjectCard`
  as the homepage, no 3-item cap)
- `/projects/:slug` → `ProjectDetailPage.jsx` — looks up the project by
  slug, 404s (redirects to `/projects`) if not found

`FeaturedWork.jsx`'s section head gets a "View All Projects" link to
`/projects`, next to (or below) the existing intro copy.

## Homepage card section — animation

Each `ProjectCard`:

- Gets a visual placeholder area above the text (gradient background +
  a small discipline-appropriate line icon, same visual weight as
  `About.jsx`'s photo placeholder) since there's no real photography yet.
  Swapping in a real photo later is just setting `image` on the data object.
- Whole card wrapped in a `Link` to `/projects/:slug`.
- Hover state (building on the lift-and-shadow hover that already exists):
  - Card lifts (`y: -6`, already there)
  - Placeholder visual scales up slightly (~1.05), same technique as the
    `group-hover:scale-110` treatment already used on `AboutPage.jsx`'s tab
    cards
  - Accent-colored border/glow intensifies
  - A small "→" affordance slides in next to the category tag, hinting
    it's clickable

This stays consistent with animation patterns already in the codebase
(Framer Motion `whileHover`, `viewportRepeat` scroll-reveal) rather than
introducing a new animation library or a literal copy of another site.

## Homepage card section — watermark

Reuses the exact technique already built in `About.jsx` (huge, ~7%-opacity
tracked text, GSAP `ScrollTrigger`-driven vertical drift as the section
scrolls through view):

- Mirror the positioning to the **top-right** of the section (About's is
  left-edge), text reads **"PROJECT"**
- Add a new **hand-drawn line-art hard-hat icon** (inline SVG, stroke-based,
  matching the existing icon style used in `AboutPage.jsx`), placed
  **middle-left**, same low opacity, same scroll-parallax treatment for
  visual cohesion with the text
- Hand-authoring the icon (rather than sourcing/downloading one) avoids any
  licensing question and guarantees it matches the site's existing
  minimal-line-icon style exactly

## `/projects` index page

- Reuses `ProjectCard` — same look as the homepage teaser
- Full grid, no cap, one `<h1>` page heading + short intro line
- Same watermark treatment as the homepage section, for visual continuity
  between the teaser and the full index (details TBD to match whatever
  ships in the homepage section first)

## `/projects/:slug` detail page

Template, built to degrade gracefully around missing content:

- Hero: `image` if present, otherwise the placeholder gradient treatment
- Title, client, year, category (always present — required fields)
- `overview` paragraphs
- `specs` sidebar/row — renders only the keys that are set
- `outcome` paragraph — renders only if set
- `gallery` — renders only if non-empty
- Back link to `/projects`

## Out of scope for this spec

- Real project photography / gallery images (blocked on MD per
  `NEEDS_FROM_MD.md`)
- Additional real projects beyond the current 3 (blocked on MD)
- Careers-style content, filtering/search on the index page, pagination —
  not needed at 3-4 projects

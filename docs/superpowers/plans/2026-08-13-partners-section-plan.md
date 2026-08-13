# Trusted Partners Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hidden `/concept/partners` preview page showing the hover-reveal "Trusted Partners" card grid, without touching the live homepage or nav.

**Architecture:** A new `partners.js` data file feeds a new `PartnerCard.jsx` component (cursor-anchored feathered-mask reveal, built with a CSS `@property`-registered custom property so the mask radius transitions smoothly). A new `PartnersPreview.jsx` page renders the grid under the existing `/concept/*` route branch in `App.jsx` — same pattern as `/concept/civic-signal`. `ProjectsPage.jsx` gets an additive `?client=` filter so each card's "View Related Projects" link works, with zero change to its default (no-param) output.

**Tech Stack:** React 19, Tailwind v4 (CSS custom properties via `@theme`), Framer Motion, react-router-dom v7. No test runner is configured in this repo (`web/package.json` has no `test` script, no `.test.`/`.spec.` files exist) — verification below is `npm run lint` plus concrete manual checks against the running Vite dev server, matching how every other component in this codebase is verified.

## Global Constraints

- `matchClients` arrays match **exactly** against `project.client` strings in `web/src/data/projects.js` — no fuzzy matching.
- Reveal mask: `--r` custom property, `0% → 145%`, `0.7s cubic-bezier(0.16, 1, 0.3, 1)`, registered via `@property --r { syntax: '<percentage>'; inherits: true; initial-value: 0%; }`.
- Mask gradient: `radial-gradient(circle at var(--mx) var(--my), black calc(var(--r) - 28%), transparent var(--r))` (feathered edge, no hard clip-path circle).
- Front face fade: `opacity`, `0.5s ease`.
- Back-face text blur-focus pull: `blur(10px) → blur(0)`, `opacity 0 → 1`, `0.6s ease`, `0.08s` delay.
- Route: `/concept/partners`, added to the existing `isConcept` branch in `App.jsx` (unlinked from nav, `Header` only, no `Footer`/`BackToTop`).
- This plan does **not** touch `Header.jsx` nav, `Industries.jsx`, or `TrustStrip.jsx` — that's an explicit follow-up after the preview is approved.

---

### Task 1: Partners data file

**Files:**
- Create: `web/src/data/partners.js`
- Modify: `NEEDS_FROM_MD.md`

**Interfaces:**
- Produces: `export const partners` — array of `{ id, name, tagline, logo, placeholder, summary, matchClients }`. `id` is a kebab-case string, `logo` is a public path string or `null`, `matchClients` is a string array (may be empty).

- [ ] **Step 1: Write the data file**

```js
// web/src/data/partners.js
export const partners = [
  {
    id: 'edo-state-government',
    name: 'Edo State Government',
    tagline: 'Partner since 2015',
    logo: '/logos/edo-state-seal.png',
    placeholder: false,
    summary:
      'Delivering civil, geomatics and environmental consultancy across Roads & Bridges, Environment & Sustainability, and EDSOGPADEC.',
    matchClients: [
      'Edo State Ministry of Roads & Bridges',
      'Edo State Oil & Gas Producing Areas Development Commission',
    ],
  },
  {
    id: 'sister-company-a',
    name: 'Sister Company A',
    tagline: 'Placeholder',
    logo: null,
    placeholder: true,
    summary:
      'Regional partner organisation collaborating on joint infrastructure delivery. Name and logo pending confirmation from the MD.',
    matchClients: [],
  },
  {
    id: 'sister-company-b',
    name: 'Sister Company B',
    tagline: 'Placeholder',
    logo: null,
    placeholder: true,
    summary:
      'One of Diarsa\'s sister companies operating across the six geopolitical zones. Name and logo pending confirmation from the MD.',
    matchClients: [],
  },
  {
    id: 'sister-company-c',
    name: 'Sister Company C',
    tagline: 'Placeholder',
    logo: null,
    placeholder: true,
    summary:
      'Regional partner organisation. Name, logo and relationship detail pending confirmation from the MD.',
    matchClients: [],
  },
];
```

- [ ] **Step 2: Verify the data shape with a throwaway Node check**

Run from `web/`:

```bash
node --input-type=module -e "
import { partners } from './src/data/partners.js';
import assert from 'node:assert';
assert.strictEqual(partners.length, 4, 'expected 4 partner entries');
assert.strictEqual(partners.filter(p => !p.placeholder).length, 1, 'expected exactly 1 real partner');
const real = partners.find(p => p.id === 'edo-state-government');
assert.strictEqual(real.matchClients.length, 2, 'edo-state-government should match 2 projects');
partners.forEach(p => {
  ['id','name','tagline','summary'].forEach(k => assert.ok(p[k], \`\${p.id} missing \${k}\`));
  assert.ok(Array.isArray(p.matchClients), \`\${p.id}.matchClients must be an array\`);
});
console.log('OK: partners.js shape verified');
"
```

Expected: `OK: partners.js shape verified`. If it throws, fix `partners.js` and re-run.

- [ ] **Step 3: Cross-check matchClients against real project data**

Run from `web/`:

```bash
node --input-type=module -e "
import { partners } from './src/data/partners.js';
import { projects } from './src/data/projects.js';
import assert from 'node:assert';
const real = partners.find(p => p.id === 'edo-state-government');
const matched = projects.filter(p => real.matchClients.includes(p.client));
assert.strictEqual(matched.length, 2, 'expected 2 real projects to match Edo State Government');
console.log('OK:', matched.map(p => p.title));
"
```

Expected: prints `OK: [ 'Reconstruction of Ekpoma–Iruekpen Road', 'Design of Short Roads, EDSOGPADEC' ]` (exact titles from `projects.js` — confirm they match, adjust the assertion if the titles differ).

- [ ] **Step 4: Add the needs-list item**

In `NEEDS_FROM_MD.md`, under the existing `## Content — from MD` section, add:

```markdown
- [ ] Real names + logos for the 3 "Sister Company" placeholder partner tiles (or confirmation there are none worth featuring) — see `/concept/partners` preview
```

- [ ] **Step 5: Commit**

```bash
git add web/src/data/partners.js NEEDS_FROM_MD.md
git commit -m "Add partners data file for the Trusted Partners preview"
```

---

### Task 2: `PartnerCard` component + reveal CSS

**Files:**
- Create: `web/src/components/PartnerCard.jsx`
- Modify: `web/src/index.css` (add the `@property --r` block and `.partner-card-back` rule)

**Interfaces:**
- Consumes: `partners` array shape from Task 1 (`{ id, name, tagline, logo, summary, matchClients }`).
- Produces: `export default function PartnerCard({ partner })` — a self-contained card, no other props. Later tasks (`PartnersPreview.jsx`) render one per partner in a grid.

- [ ] **Step 1: Add the reveal CSS**

`web/src/index.css` is 121 lines. It already has one top-level (outside `@layer`) `@property` block for the same reason (`--logo-angle`, lines 99-103), immediately followed by two `@keyframes` blocks and a final `@media (prefers-reduced-motion: reduce)` block that ends the file at line 121:

```css
@media (prefers-reduced-motion: reduce) {
  .logo-frame::before { animation: none; }
}
```

Append this new block after that closing `}` (i.e. at the very end of the file, after line 121):

```css

@property --r {
  syntax: '<percentage>';
  inherits: true;
  initial-value: 0%;
}

.partner-card-back {
  --r: 0%;
  -webkit-mask-image: radial-gradient(circle at var(--mx) var(--my), black calc(var(--r) - 28%), transparent var(--r));
  mask-image: radial-gradient(circle at var(--mx) var(--my), black calc(var(--r) - 28%), transparent var(--r));
  transition: --r 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 2: Write the component**

```jsx
// web/src/components/PartnerCard.jsx
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PartnerCard({ partner }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
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
      onMouseEnter={(e) => { updateOrigin(e); setHovered(true); }}
      onMouseLeave={(e) => { updateOrigin(e); setHovered(false); }}
    >
      <div
        className="absolute inset-0 rounded-[10px] border border-line-dark bg-slate-2 flex flex-col items-center justify-center text-center gap-3 p-5 transition-opacity duration-500 ease-out"
        style={{ opacity: hovered ? 0 : 1 }}
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
        <div className="text-white font-semibold text-[0.92rem] leading-tight">{partner.name}</div>
        <div className="text-white-soft text-[0.7rem] uppercase tracking-wide">{partner.tagline}</div>
      </div>

      <div
        className="partner-card-back absolute inset-0 rounded-[10px] bg-accent p-5 flex flex-col justify-between"
        style={{ '--mx': `${origin.x}%`, '--my': `${origin.y}%`, '--r': hovered ? '145%' : '0%' }}
      >
        <div
          className="transition-[filter,opacity] duration-500 ease-out"
          style={{ transitionDelay: '0.08s', filter: hovered ? 'blur(0px)' : 'blur(10px)', opacity: hovered ? 1 : 0 }}
        >
          <div className="text-white font-semibold text-[0.85rem] mb-1.5">{partner.name}</div>
          <div className="text-white/90 text-[0.78rem] leading-relaxed">{partner.summary}</div>
        </div>
        {hasProjects ? (
          <Link
            to={`/projects?client=${partner.id}`}
            className="block text-white text-[0.76rem] font-semibold no-underline border-t border-white/25 pt-2.5 mt-2.5"
          >
            View Related Projects →
          </Link>
        ) : (
          <span className="block text-white/55 text-[0.76rem] font-semibold border-t border-white/25 pt-2.5 mt-2.5">
            No linked projects yet
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Lint**

Run from `web/`: `npm run lint`
Expected: no errors on the two new/changed files.

- [ ] **Step 4: Commit**

```bash
git add web/src/components/PartnerCard.jsx web/src/index.css
git commit -m "Add PartnerCard component with cursor-anchored feathered reveal"
```

---

### Task 3: `ProjectsPage` client filter

**Files:**
- Modify: `web/src/components/ProjectsPage.jsx`

**Interfaces:**
- Consumes: `partners` from `web/src/data/partners.js` (Task 1) — looks up by `id`, reads `.matchClients` and `.name`.
- Produces: no new exports; `ProjectsPage` behavior gains a `?client=<partner-id>` filter, default (no param) output unchanged.

- [ ] **Step 1: Add the imports and filter logic**

In `web/src/components/ProjectsPage.jsx`, change the top import block from:

```jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { projects } from '../data/projects';
import CtaAccentBand from './CtaAccentBand';
```

to:

```jsx
import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { projects } from '../data/projects';
import { partners } from '../data/partners';
import CtaAccentBand from './CtaAccentBand';
```

- [ ] **Step 2: Compute the filtered list inside `ProjectsPage`**

At the top of `export default function ProjectsPage() {`, right after the existing `useRef` declarations (`sectionRef`, `watermarkTextRef`, `timelineRef`, `lineRef`), add:

```jsx
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('client');
  const activePartner = clientId ? partners.find((p) => p.id === clientId) : null;
  const visibleProjects = activePartner
    ? projects.filter((p) => activePartner.matchClients.includes(p.client))
    : projects;
```

- [ ] **Step 3: Render the filter banner and use the filtered list**

Immediately after the closing `</motion.div>` of the intro block (the one containing `Our Work` / `Projects` / the lede paragraph, right before `<div className="relative">`), add:

```jsx
          {activePartner && (
            <div className="flex items-center gap-3 mt-6 text-white-soft text-[0.85rem]">
              <span>
                Filtered by <strong className="text-white">{activePartner.name}</strong>
              </span>
              <Link to="/projects" className="text-accent-tint no-underline hover:text-accent">
                Clear
              </Link>
            </div>
          )}
```

Then change `{projects.map((p, i) => (` (inside the timeline `.flex.flex-col` div) to `{visibleProjects.map((p, i) => (`.

- [ ] **Step 4: Lint**

Run from `web/`: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Manual verification against the dev server**

Start the dev server (`npm run dev` from `web/`) if not already running. In a browser:

1. Visit `/projects` — confirm it looks identical to before (no filter banner, all 3 projects shown).
2. Visit `/projects?client=edo-state-government` — confirm the "Filtered by Edo State Government — Clear" banner appears and only 2 projects render (Ekpoma–Iruekpen Road, EDSOGPADEC Short Roads — not the Gully Reclamation one).
3. Click "Clear" — confirm it navigates to `/projects` with all 3 projects and no banner.

- [ ] **Step 6: Commit**

```bash
git add web/src/components/ProjectsPage.jsx
git commit -m "Add optional client filter to ProjectsPage for partner deep-links"
```

---

### Task 4: `PartnersPreview` page + route

**Files:**
- Create: `web/src/components/PartnersPreview.jsx`
- Modify: `web/src/App.jsx`

**Interfaces:**
- Consumes: `partners` from Task 1, `PartnerCard` from Task 2.
- Produces: route `/concept/partners`.

- [ ] **Step 1: Write the preview page component**

```jsx
// web/src/components/PartnersPreview.jsx
import { motion } from 'framer-motion';
import { partners } from '../data/partners';
import PartnerCard from './PartnerCard';
import { fadeUp, stagger, viewportOnce } from '../motion';

export default function PartnersPreview() {
  return (
    <section className="section-shell bg-slate pt-[9rem] min-h-screen" data-nav-theme="dark">
      <div className="section-inner">
        <motion.div
          className="section-head"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
        >
          <span className="eyebrow text-accent-tint mb-3 block">Preview — not linked from nav</span>
          <h1 className="text-white text-[clamp(1.8rem,3.6vw,2.6rem)] mb-3">Trusted Partners</h1>
          <p className="lede text-white-soft">
            Hover a card to see the partner brief and jump to their related projects.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-4 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1 gap-5"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger}
        >
          {partners.map((partner) => (
            <motion.div key={partner.id} variants={fadeUp}>
              <PartnerCard partner={partner} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire the route**

In `web/src/App.jsx`, add the import alongside the other component imports:

```jsx
import PartnersPreview from './components/PartnersPreview';
```

Then change the `isConcept` block from:

```jsx
  if (isConcept) {
    return (
      <>
        <Header />
        <Routes location={location}>
          <Route path="/concept/civic-signal" element={<LandingConceptCivicSignal />} />
        </Routes>
      </>
    );
  }
```

to:

```jsx
  if (isConcept) {
    return (
      <>
        <Header />
        <Routes location={location}>
          <Route path="/concept/civic-signal" element={<LandingConceptCivicSignal />} />
          <Route path="/concept/partners" element={<PartnersPreview />} />
        </Routes>
      </>
    );
  }
```

- [ ] **Step 3: Lint**

Run from `web/`: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual verification against the dev server**

Start the dev server (`npm run dev` from `web/`) if not already running. In a browser:

1. Visit `/concept/partners` — confirm 4 cards render: "Edo State Government" (real seal logo) plus 3 "Sister Company" placeholders (generic building icon).
2. Hover the Edo State Government card from a few different entry points (top-left corner, bottom edge) — confirm the reveal originates from wherever the cursor entered, with a soft feathered edge (not a hard circle line), and the back text blurs into focus.
3. Confirm its back face shows the 2-sentence summary and a working "View Related Projects →" link; click it and confirm it lands on `/projects?client=edo-state-government` filtered to 2 projects (this depends on Task 3 being done).
4. Hover a "Sister Company" placeholder card — confirm it shows "No linked projects yet" instead of a link.
5. Confirm `Header.jsx` was not modified by this task and has no new "Partners" nav entry (`grep -n "Partners" web/src/components/Header.jsx` should return nothing — the existing "Industries" nav link stays exactly as-is; removing it is out of scope here) — this preview page is intentionally unlinked.

- [ ] **Step 5: Commit**

```bash
git add web/src/components/PartnersPreview.jsx web/src/App.jsx
git commit -m "Add hidden /concept/partners preview page"
```

# DIARSA website — PROGRESS

Repo: `web/` — Vite + React. Remote: github.com/D1vin30/Diarsa-Global.
Branch `theme/blueprint-navy` = the redesign. `master` = old pre-redesign site.
Dev: `npm run dev` (:5173, plain) or `npm run dev:editor` (in-page editor overlay — also needs `~/Documents/diarsa-editor`'s `npm run server` running, port 5174). Last commit `0b587b3` (2026-09-01) "Remove media/text editor tool from tracked tree" — nothing committed since.

---

## State — 2026-09-15 (editor tool, the last 2 open items)

- **Text wired into the 3 remaining pages** (ReviewPage, PartnersPreview, LandingConceptCivicSignal) — every page in the site now has real text editing, no exceptions left.
- **Drag-to-resize by the corner/edge, not just number fields** — 3 handles (right edge = width, bottom edge = height, corner = both) on the selected slot, matching the old pre-split tool's gesture. Portaled to a new body-level host (`mount.jsx`'s `getHandleHost()`) rather than rendered inline — framer-motion puts a CSS transform on nearly everything it animates, which would silently break `position: fixed` handle positioning if they lived inside the page's own DOM tree (a transformed ancestor becomes the containing block for its fixed descendants). Same reasoning that already justified the pill's own separate root.
  - Caught and fixed a real bug before it shipped: `setPointerCapture` was being called on the image/figure being resized instead of on the handle that received the pointerdown — would have silently misrouted every subsequent pointermove to the wrong element (the position-drag handler, not the resize one), so dragging past the first pixel would have done nothing.
  - Verified live via real pointerdown/pointermove/pointerup events (not just visual): corner handle correctly resized both axes exactly matching the drag delta (683px→583px, 100%→86.8% off a −200/−100px drag), edge handle correctly touched only its one axis, handles track the resized box's new position each frame, reset cleanly.
- Both items were the last of the explicit "run the last two" ask. `npm run build` clean throughout.

## State — 2026-09-14 (editor tool pass, round 2 — same day, after live use)

Divine actually used the tool after round 1 and hit more issues, all fixed in `~/Documents/diarsa-editor`:
- **Hero carousel wouldn't stop / "can't find cancel button"**: the 7s auto-rotate only paused on mouse hover, and the pill sits below the fold — moving the mouse to the panel un-paused it mid-edit. Added `@media/useEditing` (dumb `false` in prod, live store read under `dev:editor`, same alias pattern as FontLoader) so Hero's carousel freezes for the whole time editing is on, not just on hover. `web/src/media/useEditing.js` + `diarsa-editor/src/site/useInteractiveEditing.jsx`.
- **Servers kept dying**: turned out to be Claude Code's own background-task memory watchdog, not Windows (pagefile's healthy, 24GB, not recapped). Fix was process independence, not code: `diarsa-editor/start-editor.bat` + `stop-editor.bat` — user-launched detached windows, outside any coding session's process tracking.
- **Pill didn't disappear when the server was closed**: `store.js` now polls `/api/fonts` every 4s; `EditorPill` returns `null` outright when unreachable (replaces the old static "server unreachable" message, which only ever fired on the very first load). Reappears on its own within a few seconds of the server coming back — no page refresh needed either way.
- **"Save font: 400"**: `FontRow`'s custom-font toggle pre-filled a placeholder space character into the actual value to force the text box open; leaving it blank saved `" "` as the font name, which `validateFontConfig` correctly rejects. Fixed to track "custom mode open" as separate local state, not piggybacked on the value. Also added a server-side-matching trim/null guard in `saveFonts()` as a second line of defense.
- **No way to back out without saving**: added `revertMedia()` / `revertText()` / `revertFonts()` (discard unsaved changes, back to last-saved-to-disk state) with a "revert" button next to every "Save X" button and inside the Fonts panel. Renamed "done" → "exit" throughout for the terminology Divine was using.
- **The actual missing feature from round 1** ("unable to add images, edit shape and size, like before") — Divine confirmed this applies to every slot, not just Hero. Implemented for BOTH freeform and **fixed** slots (Hero, banners, card thumbnails — the ones the earlier session left position+zoom-only):
  - "Replace image/video…" button (explicit file picker, not just drag-drop) — the actual "where do I add an image" answer.
  - `fit` (cover/contain) — was stored in data but never actually applied to `objectFit`; real latent bug, now fixed for every slot.
  - width/aspect/height/radius shape controls, applied as a plain inline-style override on the `<img>`/`<video>` itself — **no wrapper element**. Verified this doesn't fight the page's own `absolute inset-0` sizing: CSS's over-constrained-box resolution (§10.3.7) drops `right`/`bottom` in favor of an explicit `width`/`height`, so setting one anchors the box top-left instead of stretching — confirmed live on Hero (502px / 33% width, non-Hero layout completely unaffected) and reset cleanly back to 100%/fill. Fixed slots default to `{width:100, aspect:null, radius:0}` (not freeform's `4/3` default) specifically so opening the panel and not touching anything is a no-op — only an explicit change ever alters an existing page's look.
  - "Reset shape to default" button per slot.
- **Wheel-zoom was hijacking page scroll everywhere**: `onWheel` fired for any slot with an image under the cursor, not just the selected one — since Hero's image covers nearly the full viewport, this made normal mouse-wheel scrolling nearly impossible anywhere near the top of the site while editing. Now gated on `selected` (matches the pill's own hint text, "scroll to zoom **the highlighted image**", which this never actually enforced).
- Verified: `npm run build` clean, live-tested add-image/reshape/revert/exit/carousel-freeze in browser with real DOM/state checks (not just visual).

## State — 2026-09-14 (editor tool pass, round 1)

Divine reported the local editor tool (`~/Documents/diarsa-editor`) was unusable: couldn't select text without an image stealing focus, couldn't add/resize images "like before", and clicking a project/service card while editing navigated away instead of letting him edit it. Also asked for Google Fonts access instead of manual downloads. All still **uncommitted** local changes on top of the state below — nothing pushed.

**Root causes found (all in `~/Documents/diarsa-editor/src/site/`, not in `web/`):**
1. `EditableSlot.jsx` put `zIndex: 2147481000` on *every* slot with an image the moment edit mode turned on, not just the selected one. An inline style always beats a page's own z-index class, so this permanently buried anything a page deliberately layers above its media — e.g. Hero's `z-[3]` headline over its `z-0` background. **Fixed:** only the selected slot lifts now; added Esc (global keydown) to release a stuck-selected slot.
2. Cards (ProjectCard, ServiceCard) wrap their whole slot in a react-router `<Link>`. Clicking the image/text to select/focus it also fired the Link and navigated away before the click reached the editor. Two parts: the click handler never called `preventDefault`/`stopPropagation` (fixed in `EditableSlot.jsx` and `InteractiveText.jsx`), and even after that, a decorative gradient overlay with no z-index of its own sat on top of the image in DOM order and ate the first click regardless — fixed by giving every editing slot a small always-on `zIndex: 1` (beats unstyled decorative siblings, still loses to real content like Hero's `z-[3]` text, so bug #1's fix isn't undone).
3. **Bigger find:** text editing (`EditableText`/`InteractiveText`) existed and worked in isolation but no page component actually used it — every page's headings/paragraphs were plain JSX, so clicking text never did anything regardless of bugs #1/#2. Wired `<EditableText>` into every real page: Hero (all 3 slides), TrustStrip, About, Services, Industries, FeaturedWork, ProjectCard, ServiceCard, Partners, PartnerCard, FAQ, CtaBand, CtaAccentBand (shared, `id` prop added, 5 call sites updated: AboutPage/ProjectDetailPage/ProjectsPage/ServicesPage/ServiceDetailPage), Header (nav + mobile menu, same ids so both stay in sync), Footer, AboutPage, ProjectsPage, ProjectDetailPage, ServicesPage, ServiceDetailPage, ContactPage. IDs follow the existing slug-based scheme and are **reused** across components that show the same field (e.g. `projects.<slug>.title` used by ProjectCard, ProjectsPage's TimelineEntry, and ProjectDetailPage's hero) so one edit updates it everywhere. Skipped: dynamic/interpolated strings (would lose their interpolation once overridden) and one line containing a `<br/>` (EditableText's fallback only keeps plain-string children — wrapping it would have silently dropped the line break for every visitor, caught before shipping).
   **NOT done:** ReviewPage, PartnersPreview, LandingConceptCivicSignal — internal MD-review tool and hidden `/concept/*` pages, lower priority, skipped for time.
4. Confirmed regression vs. the pre-split tool (patch `1980b2e-full-diff.patch` in `~/Documents/Diarsa-editor-tool-local/`): the old `MediaSlot.jsx` wrapped every slot in its own sized frame with resize handles, "Replace file…", "Use media size" (auto-aspect from the real image), fit/type toggles, and a page-scroll-lock while a slot was selected. None of that survived the standalone rebuild — current tool only gives fixed slots x/y position + zoom; freeform slots (added via "+ image here") get width/aspect/height/radius but not the rest. Divine asked for freeform full parity plus careful, page-by-page restoration of fixed-slot resize (accepting the risk that wrapping fixed slots — which currently size via the page's own `absolute inset-0` etc. — could fight the page's CSS). **Not reached this session** — flag for next time.
5. Also fixed in passing: `ensureMounted()` was called directly in the render body (not a `useEffect`) in `EditableMediaRegion.jsx` and `InteractiveText.jsx` — a real, reproducible React "Render methods should be a pure function" console error, not just a style nit. Now in `useEffect` in both, matching `EditableSlot.jsx`'s existing correct pattern.

**Added: Google Fonts, no downloads needed.**
- `web/src/media/fonts.js` — `GOOGLE_FONT_CHOICES` (curated ~15-per-role list) + `applyFonts({display, sans})`, which injects one `<link>` to `fonts.googleapis.com/css2` and points `--font-display`/`--font-sans` (the two CSS vars the whole site's type scale already runs through, in `index.css`'s `@theme`) at the chosen family. `null` = keep the site's built-in local fonts (Big Shoulders Display / Work Sans), no network request at all.
- `web/src/media/FontLoader.jsx` (dumb, ships to prod, reads `web/src/data/fontConfig.json`) + `@media/FontLoader` alias in `vite.config.js` swapping to `diarsa-editor/src/site/InteractiveFontLoader.jsx` under `dev:editor`, mounted once in `App.jsx`.
- `diarsa-editor`: `storage.mjs`/`server.mjs` got `/api/fonts` GET/PUT (same pattern as `/api/text`), `store.js` got `fontConfig`/`setFont`/`saveFonts`, `EditorPill.jsx` got a "Fonts" panel (two dropdowns, curated + free-text, live preview before Save).
- Picking a font in the panel applies live across the whole site immediately (tested: Playfair Display on Hero headline, reverted after confirming).

**Verification:** `npm run build` clean (prod/dumb path — confirms every `EditableText`/`FontLoader` usage resolves correctly with the editor NOT aliased in), `npx oxlint` clean, visual check with editing off on Home/About/Contact — no regressions. `diarsa-editor` has no test files at all currently (pre-existing gap from the split, not touched). Site's own `vitest` has no test files matching its glob either (pre-existing, unrelated to this session).

**Known false alarm, ruled out:** "shows imagery of a page I'm not on" — tested live navigating Home→About with editing on; the slot dropdown scoped correctly both times (12 vs 1). Likely explanation: pages briefly look "stuck" mid-transition when viewed through the Claude-in-Chrome backgrounded tab (see the 2026-08-29 note below — `requestAnimationFrame` throttling makes `AnimatePresence` fades look frozen there even when React is fine); a real foreground browser wouldn't show this.

---

## State — 2026-09-14 (content review, earlier same day)

Uncommitted local changes (not yet reviewed/committed by Divine):
- Honeypot spam-trap (`_honey`) added to Contact form and Review-upload form — both had zero spam protection (FormSubmit `_captcha` explicitly disabled, no honeypot). Left `_captcha:false` alone on the Review form: it only works on real page-redirect submissions, and Contact's form is AJAX/JSON so the interactive captcha doesn't apply there at all — honeypot is the one fix that covers both uniformly with no user friction.
- 3 of the 6 "Jobs in our control" below are now done (hero video, About placeholders, fake partner tiles) — see updated list.
- `npm run lint` + `npm run build` clean after all of the above.
- **Hero video not visually confirmed** — verified the file is a valid, standard H.264 mp4 (ffprobe) and the server/React wiring is correct (file loads via fetch, `<video>` element mounts with right attributes), but the automated browser tool used to check couldn't get ANY video to play in this session — even an unrelated public test video hung at `readyState:0`. That's an automation-environment limitation, not a site bug, but it means actual playback hasn't been eyeballed by a human yet. Check it in a real browser at `localhost:5173` before calling this one done.
- Diarsa media pipeline (`Downloads/Telegram Desktop/_SITE_MEDIA/`) sorting itself finished back on 2026-08-28 — that's a separate, already-done step from wiring media into the live site (this file tracks the latter).

## State — 2026-09-09

Two sessions were lost to system reboots and reconstructed here:
- `cb291504` (Sep 8 20:43–22:58) — ran site, traced "Container Tools" VS Code extension, site catch-up. Vite killed by OOM.
- `d3f0fd89` (Sep 9 06:23–07:46) — decisions below; started editor build, cut off at a design fork.

### Decisions locked

1. **Leads database → ON ICE.** Build separately later, integrate after the site is done. Divine wants to observe office workflow first to see how it applies. (Reference: a "lead log" = saved table of contact-form enquiries + private admin page with status new→contacted→quoted→won→dead. Recommendation on record: launch WITHOUT a DB — contact form emails the office via Resend; MD review page emails the file as attachment; add a DB only if the MD wants a saved lead log or a careers page with uploads.)
2. **Editor tool → build as a standalone local editor.** Divine said "build it now."
3. **Deploy Path 1 (clear all secondary problems before content upload) → DONE per Divine.** Old memory-crash cause was the Ubuntu/Fedora disk partition — cleared. Divine likes the current Vercel "formwork" (site shape). No new Vercel project at this stage.
4. **Next = content upload** (real images + writeups into this local site copy). Divine does NOT want to start the upload yet — wanted all secondary tasks confirmed clear first.

### OPEN QUESTION — where we stopped (unanswered)

Editor build hit a design fork. The tool is not a separate program — it's editing controls that sit on top of the site pages, so the pages need "image slots" built in (removed Sep 1). Choose:

- **Option 1** — fully separate site copy with the editor. Arrange images there, copy each decision into the real site by hand. Real site 100% editor-free, but every image arranged twice.
- **Option 2 (recommended)** — light invisible "show image here" plumbing stays in the real site (no editor, just slots). Local-only editor fills it; arrangements show on the real site directly, no copying. Downside: a small non-editor piece lives in the site code.

After the pick: build the editor, then continue scanning project files into best-fit slots for Divine to review.

### Jobs in our control (no MD needed)

- [x] Wire the hero drone video into the homepage — `Hero.jsx` slide 2 now plays `/hero-loop.mp4` (`.webm` + poster fallback), copied in from `_SITE_MEDIA/_hero/`. Reduced-motion users get the static poster instead. **Not yet visually confirmed by a human** — see note above.
- [x] Fill 2 About photo placeholders — `About.jsx:97` and `AboutPage.jsx:180` now both render `/about-team.jpg` (the GROUP folder team photo — only generic team/equipment shot currently cleared for use; SERVICES imagery is still `01-pending-MD`). Same photo in both spots for now, confirmed rendering correctly.
- [x] Hide 3 fake "Sister Company" partner tiles — `Partners.jsx` and `PartnersPreview.jsx` now filter on the `placeholder` flag already in `data/partners.js`; confirmed only 1 real card (Edo State Government) renders. Data itself untouched, so real ones show automatically once the MD confirms and `placeholder: false` gets set.
- Page-by-page QA on the navy version — layout, mobile, animations, dead links.
- Branch hygiene: 4 duplicate commits master vs branch (messy future merge); `.vercel/project.json` points at a deleted project — stale.

### Blocked on the MD (brief sent 2026-08-28, no reply)

Real writeups + photos ×14 projects, milestones/history, MD photo + quote, staff headcount, COREN/SURCON cert numbers, real partner names, project-8's real name, project-13 keep/drop, "before" photos, video-cut approvals.

### Not needed until go-live

Vercel project + DNS swap (`diarsaglobal.com` `@`+`www` A records currently → Hostinger `147.79.72.9`, the OLD static mirror); Resend sending domain + which inbox gets leads; Sentry alert recipient; PostHog tracking scope + privacy notice; leads DB (on ice).

### Also open

Get a zip of the old Hostinger `public_html` from the previous dev (his login, not Divine's).

### Editor tool copy

`~/Documents/Diarsa-editor-tool-local/` — loose files + `1980b2e-full-diff.patch`. Not runnable as-is. Also recoverable from commit `1980b2e`.

### Untracked / ignore

`web/public/media/` — 39 MB orphan studio uploads, gitignored.

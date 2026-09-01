# Visual media framing editor — design

Date: 2026-08-28
Status: approved, implementing

## Problem

Every image/video on the site is positioned by hand-typed `objectPosition`
percentages inside JSX (`Hero.jsx` has `'50% 15%'`, `'54% 45%'`, ...). Adjusting
how a photo sits in its frame means editing code and guessing numbers. Videos are
uploaded via `npm run upload:video` and pasted into `src/data/projects.js`.

Goal: a mouse-driven editor, running locally during `npm run dev`, that lets the
site owner reposition / zoom / crop / swap any registered media slot and save the
result. Structured so a future live `/admin` can reuse everything except the save
transport.

Out of scope (later, separate builds): pixel edits (filters, colour, rotate),
video trim / poster-frame pick, layering clips over each other.

## Data model

Single committed file `src/data/mediaConfig.json`:

```json
{
  "version": 1,
  "slots": {
    "about.photo": {
      "type": "image",
      "src": "/about/team-survey.jpg",
      "fit": "cover",
      "position": { "x": 50, "y": 35 },
      "scale": 1.0,
      "updatedAt": "2026-08-28T12:00:00Z"
    }
  }
}
```

- `position.x/y` — percent 0–100, renders as `object-position: {x}% {y}%`.
- `scale` — 1.0–3.0, renders as `transform: scale({scale})` with
  `transform-origin` at the position point.
- `fit` — `cover` | `contain`.
- Video slots use the same shape with `"type": "video"`. Future keys
  (`poster`, `trim`, `layers`) slot in without breaking v1.
- Maps 1:1 to a DB row later: `(id, type, src, fit, position_x, position_y,
  scale, updated_at)`.
- Committed to git — that is how edits reach the deployed site.

## Components

### `src/media/MediaConfigProvider.jsx`
Context provider. Holds the working config in state, seeded from
`mediaConfig.json`. Exposes: `getSlot(id)`, `updateSlot(id, patch)`,
`replaceSrc(id, src)`, `resetSlot(id)`, `dirty`, `save()`. In dev, `save()` PUTs
to the studio server. Outside dev the provider still renders (read-only) so
`MediaSlot` works in production from the static JSON.

### `src/media/MediaSlot.jsx`
```jsx
<MediaSlot id="about.photo" fallbackSrc="/about/team-survey.jpg"
           alt="..." className="absolute inset-0 w-full h-full" />
```
- Looks up the slot; renders `<img>` or `<video>` per `type`.
- Applies `object-fit`, `object-position`, `transform: scale()` from config.
- No config entry -> uses `fallbackSrc` + defaults (center, 1.0, cover) and is
  still editable; saving creates the entry. Conversion is therefore safe and
  incremental.
- In `import.meta.env.DEV`, registers its DOM node + id with the overlay via
  context. That registration is stripped from production builds.

### `src/media/position.js`
Pure helpers: clamp, pointer-delta -> position percent, wheel-delta -> scale,
slot -> style object. Unit tested.

### `src/media/MediaStudio.jsx` (dev only)
Mounted at app root behind `import.meta.env.DEV`. Floating pill bottom-left
("✎ Edit media"), toggled by click or `Ctrl+Shift+E`. When active: hover
outlines slots, click selects. Drag on the image moves the focal point;
mouse-wheel zooms. A small panel shows id + live x/y/scale, a `cover`/`contain`
dropdown, "Replace file…", "Reset", "Save". Replace opens a file picker, uploads
to the studio server, swaps `src` live. Edits preview instantly through the
provider; the pill shows an unsaved badge; "Save" persists.

## Local studio server

`studio/server.mjs` — minimal Express server on `:5174`:

- `GET /api/media` — return `mediaConfig.json`
- `PUT /api/media` — validate shape, write `mediaConfig.json` (pretty, stable
  key order, refreshed `updatedAt`)
- `POST /api/media/upload` — multipart; write to
  `public/media/<slotId>-<8hex>.<ext>`, return `{ src: "/media/..." }`

All disk access sits behind `studio/storage.mjs`
(`readConfig` / `writeConfig` / `saveFile`). That module is the only swap point:
a future prod implementation backs it with Postgres + Vercel Blob and nothing
else changes. Unit tested against a temp dir.

## Wiring

- `vite.config.js`: `server.proxy` forwards `/api/media` -> `http://localhost:5174`.
- `package.json`: `"dev": "concurrently -k -n vite,studio \"vite\" \"node studio/server.mjs\""`.
  Still one command. Studio port is never visible to the user.
- New devDependencies: `express`, `concurrently`, `busboy` (multipart).
- Production build: `studio/` is not imported by the app; overlay code is behind
  `import.meta.env.DEV` and tree-shaken; the three deps are devDependencies.
- Committed by edits: `mediaConfig.json`, `public/media/*`.

## Build order

1. Seed `mediaConfig.json` with `about.photo` + `contact.banner`.
2. `position.js` (+ tests), `MediaConfigProvider`, `MediaSlot`.
3. Convert `About.jsx` and `ContactPage.jsx` banner to `MediaSlot`; confirm the
   site renders identically.
4. `studio/storage.mjs` (+ tests), `studio/server.mjs`, vite proxy, `dev` script.
5. `MediaStudio.jsx` overlay.
6. Browser round-trip test: drag -> zoom -> replace -> save -> hard reload ->
   values persisted.
7. Later, on demand: convert Hero (3), ProjectCard, ServiceCard, galleries.

## Testing

- Unit (`vitest`, new devDependency): `position.js` math; `studio/storage.mjs`
  read/write/saveFile round-trip against a temp dir.
- Manual: browser check of the overlay per step 6.

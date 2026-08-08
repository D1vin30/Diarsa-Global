# Needs From MD

Running list of content/decisions the site is blocked on. Ask the MD, then update this file.

## Content — from MD

- [ ] Company milestones / history — decade-by-decade key dates for a timeline (Hitech-style)
- [ ] MD photo + short personal quote for the Leadership section
- [ ] Team/employee headcount (real number, for the stats strip)
- [ ] Careers page — open to publishing one? What roles/content?
- [ ] COREN & SURCON certificate/registration numbers (for verified badges, not just text mention)
- [ ] Real project photography — construction sites, survey work, completed projects (currently using stock photos as placeholders on the About page tab cards; FeaturedWork project cards have no images at all yet)
- [ ] Flagship projects to feature on a Projects page — which ones, plus client/scope/timeline detail per project

## Per-Project Content — what each project page now needs (2026-08-08)

Every project now gets its own page (`/projects/<slug>`) built from these fields. All 3 live projects
(Ekpoma–Iruekpen Road, EDSOGPADEC Short Roads, Okhoro Gully Reclamation) currently use placeholder
write-ups and stock photography written by Claude — plausible in tone, not verified facts. Replace
per project, in this order:

1. **Client & role** — official client name, our exact role/title on the project (e.g. "Supervising
   Consultant"), year completed (or ongoing).
2. **Location & duration** — precise site location, start/end dates (not just a single year).
3. **Markets & Services tags** — short category tags shown as chips (e.g. "Transport",
   "Government & Public Sector" / "Engineering Design Review", "Site Supervision"). Confirm or correct
   the placeholder tags per project.
4. **Stats strip** — 2 short "big number" callouts per project (currently just year + role, since we
   have no real metrics yet). Real ones to ask for: road length (km), budget/contract value, number of
   beneficiaries/households, duration in months, or similar — whatever the MD is comfortable publishing.
5. **Challenge / Approach / Outcome write-up** — 2 short paragraphs each, currently placeholder prose.
   Needs the MD's actual account of: what the problem was, what Diarsa specifically did, what the
   measurable result was.
6. **Pull-quote** — currently attributed to a generic team name (e.g. "Site Supervision Team, Diarsa
   Global"), not a real person. Replace with a real named quote + title if the MD wants one, or drop the
   quote block entirely.
7. **Photography** — hero image, 3 gallery images with one-line captions, and one atmospheric
   "fine print" band image. All currently stock/Unsplash placeholders. Needs real site photography per
   project (during construction and/or completed).
8. **Legitimacy documents** — not yet built into the page, but worth deciding now: does the MD want
   completion certificates, government award letters, or similar proof-of-work documents scanned and
   linked/displayed per project for public credibility? If yes, need the documents themselves plus a
   decision on where they'd sit on the page.

## Per-Service Content — what each service page now needs (2026-08-08)

The 7 service categories (`/services/<slug>`) were restructured to match the real taxonomy visible on
the current live site (diarsaglobal.com) and the broader category grouping found there, rather than the
4 invented buckets used earlier. Categories: Civil Engineering Consultancy, Geomatics Engineering, GIS &
Digital Mapping, Hydrological & Water Resources Studies, Environmental Consultancy, Project Planning &
Advisory, Research & Development. The old site's individual service pages (Marine Geophysical Surveys,
Geotechnical Investigation, Mapping & GIS, Drone Surveys, Cadastral & Legal Surveys, and ~16 more) were
folded into these 7 as capability tags rather than getting their own pages yet — all real names, sourced
directly from the live site, not invented.

All copy (overview, capabilities framing, "Why It Matters", "Our Approach" + 3-step lifecycle, quotes,
outcomes) is Claude-written placeholder, plausible in tone but not verified. Replace per service, same
priority order as the per-project list above, plus:

1. **Confirm the 7-category split itself** — does this match how the MD actually thinks about the
   business, or should some categories merge/split differently once the company PDF is available?
2. **Which of the ~21 individually-named live-site services deserve their own dedicated page** later,
   versus staying folded into a parent category as a capability tag.
3. **Quotes** are attributed to generic team names (e.g. "Civil Engineering Team, Diarsa Global"), same
   caveat as the project quotes — replace with real named quotes or drop.
4. **Photography** — all 7 hero images are Unsplash stock, need real site/office photography per
   discipline once available.
5. Two categories (GIS & Digital Mapping, Research & Development) have no related project yet since none
   of the 3 live projects are tagged to them — flag if any past work actually fits either, so the
   "Related Projects" section isn't empty.

## ~~Infra — MCP service connections~~ (done 2026-08-04)

- [x] ~~Cloudflare connected~~
- [x] ~~PostHog connected~~
- [x] ~~Resend connected~~
- [x] ~~Sentry connected~~
- [x] ~~Supabase connected~~
- [x] ~~Vercel connected~~

## Infra — decisions needed now that services are wired

- [ ] Vercel — confirm this repo is the one to link + deploy; production domain (diarsaglobal.com?) pointed at it
- [ ] Cloudflare — is the domain's DNS on Cloudflare already, or does it need migrating? Who holds registrar access?
- [ ] Resend — sending domain to verify (e.g. mail.diarsaglobal.com) + which inbox receives contact-form leads
- [ ] Supabase — do we need a DB at all? (contact form leads, careers applications if that page ships) or is email-only enough
- [ ] Sentry — project created, DSN wired into web/, who gets alerted on errors
- [ ] PostHog — confirm what to track (page views, form submits) and add a cookie/privacy notice if needed

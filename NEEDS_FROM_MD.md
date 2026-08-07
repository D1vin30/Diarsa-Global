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

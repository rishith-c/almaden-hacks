# Almaden Hacks

A scrolling event site for Almaden Hacks, presented by Leland High School.
Next.js 16 and React 19. Original equestrian artwork is rendered as ASCII in a
three-second entrance, with replay and reduced-motion support.

## Develop

```sh
npm ci
npm run dev
npm run build
```

## Event details

The public planning window is May–June; no exact date, year, venue, sponsors,
or attendance numbers have been invented. Add confirmed registration and
Discord URLs to `src/lib/event.ts`. Until then, the calls to action explain
that links are coming soon. Update the visible status copy when links open.

The sponsor and fiscal-sponsorship footer point to
https://hcb.hackclub.com/almaden-hacks.

## Deployment

The `almadenhacks` Vercel project serves https://almadenhacks.vercel.app.
The redesign source lives on `codex/almaden-hacks-site`; the prior club site
remains on the repository's main branch. To publish this checkout:

```sh
vercel link --project almadenhacks --scope rishicodezs-projects
vercel deploy --prod
```

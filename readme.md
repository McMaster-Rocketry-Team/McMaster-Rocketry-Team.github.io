# McMaster Rocketry Team site

Public site for [McMaster Rocketry](https://macrocketry.ca), rebuilt in Astro.
Work happens on the `dev` branch. GitHub Pages deploys from `main`.

## Run locally

Needs Node 22.12+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm astro dev
```

Open http://127.0.0.1:4321/. `pnpm astro build` writes `dist/`. `pnpm astro preview` serves that build.

## Where things live

| | |
|---|---|
| Pages | `src/pages/` |
| Data the team edits | `src/data/*.json` |
| Tokens and layout | `src/styles/site.css` |
| Vehicle photos (source) | `rockets/<slug>/` |
| Fleet cutouts (shipped) | `public/media/rockets/` |
| Progress and open questions | `PLAN.md` |
| Content only Robin can supply | `mockups/TODO-MANIFEST.md` |

A ReviewMode overlay is mounted on every page in dev. Remove `src/components/ReviewMode.astro` and its import in `src/layouts/BaseLayout.astro` before launch.

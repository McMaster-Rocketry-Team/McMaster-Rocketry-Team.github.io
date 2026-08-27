# McMaster Rocketry Team site

Public site for [McMaster Rocketry](https://macrocketry.ca), rebuilt in Astro.
Work happens on the `dev` branch. GitHub Pages deploys from `main`.

## Run locally

Needs Node 22.12+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm astro dev --host 127.0.0.1 --port 4321
```

Open http://127.0.0.1:4321/. `pnpm astro build` writes `dist/`. `pnpm astro preview` serves that build.

## Where things live

| | |
|---|---|
| Pages | `src/pages/` |
| Data the team edits | `src/data/*.json` |
| Tokens, layout, hero pattern | `src/styles/site.css` (header comment) + `.cursor/rules/design.mdc` |
| Design system spec (v1.3) | `McMaster_Rocketry_Design_System_Spec.md` (gitignored) · `docs/design-system.md` (pointer + sync steps) |
| Vehicle photos (source) | `rockets/<slug>/` + `SHORTLIST.md` |
| Fleet cutouts (shipped) | `public/media/rockets/` |
| Lead portraits (shipped) | `public/media/leads/` |
| Outreach photos (shipped) | `public/media/outreach/` |
| Subteam heroes / work shots | `public/media/subteams/` |
| Sponsor logos + sponsors hero | `public/media/sponsors/` |
| Fleet cutout script | `scripts/cut-fleet-cutout.py` |
| Launch checklist | `LAUNCH_REVIEW.md` |
| Progress and open questions | `PLAN.md` |
| Content only Robin can supply | `mockups/TODO-MANIFEST.md` |

**Mockups (`mockups/final/`):** deprecated visual reference. The Astro site in `src/` is canonical — mockups still carry the old hero veil/duotone, apogee-scaled fleet, and flat nav. Do not treat mockup HTML/CSS as source of truth when they disagree with `src/`.

## Pre-merge audit

ReviewMode was removed 2026-08-27 (`8a82573`). Before merging `dev` → `main`:

```bash
pnpm check:todo && pnpm astro check && pnpm build && pnpm check:todo
rg -i 'data-rv|data-review|rv-panel' dist/ || echo "OK: no ReviewMode leaks"
```

See `LAUNCH_REVIEW.md` § "Verification audit" for the full double-check list. Known gap: `pnpm astro check` reports 6 type errors in `join.astro` (`todo` fields); production build still passes.

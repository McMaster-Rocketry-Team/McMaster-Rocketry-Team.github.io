# Design system — repo pointer

**Canonical spec:** [`github.com/McMaster-Rocketry-Team/design`](https://github.com/McMaster-Rocketry-Team/design) → `spec/design-system.md`. That repo is the single source of truth (declared 2026-08-29) — this repo does not keep its own copy of the spec prose. Propose spec changes there as a pull request, not here.

**Shipped CSS:** [`src/styles/site.css`](../src/styles/site.css) header comment + tokens — implements the spec, doesn't restate it.

**Agent rules:** [`.cursor/rules/design.mdc`](../.cursor/rules/design.mdc) — a condensed, code-facing subset of the spec for the coding agent, with a pointer to the full spec.

**`claude.ai/design`** → project "McMaster Rocketry Design System" is **archived**: it holds the last synced copy of the spec (through v1.6) for search/reference only. It is no longer edited and nothing pushes to it.

## Why one source of truth

Through 2026-08-29 the spec was hand-mirrored across three places: a gitignored file in this repo, `spec/design-system.md` in the design repo, and `spec.md` on `claude.ai/design`. That drifted stale more than once (see `git log` on this file for the old sync-status entries) and directly caused a real bug: the design repo's `README.md` cited "the measured clear-space rule in `spec/design-system.md`" for a section that didn't exist in any copy — the one real, measured number lived only in a brand-kit mockup file, flagged as a proposal. Fixed 2026-08-29 (design repo PRs #1 and #2): the spec now lives in exactly one place.

If a change here needs a matching spec update, open the PR in the design repo first, then update `site.css` / `design.mdc` here to match — never write spec prose directly into this repo again.

## Subteam heroes

Optional `heroImage` on each subteam in `subteams.json` drives `.phead.has-hero` + `.herobox`. Shipped heroes: all seven subteams (`public/media/subteams/*-hero.webp`). Low-res sources (e.g. Payload at 1137×618) may be upscaled with Real-ESRGAN before export; store masters in `media-source/`.

## Mockups

`mockups/final/` is a **deprecated** snapshot. When mockup HTML/CSS disagrees with `src/` (hero veil, apogee fleet, flat nav), trust the Astro site.

## Data layer

Copy and numbers live in `src/data/*.json` and content collections; Astro templates render structure only. See [`docs/data-layer.md`](data-layer.md).

## Nav flyout alignment

Rockets and Subteams use `.navitem` wrappers; other nav entries are plain `.navlinks > a`. On desktop, the link row must use **`align-items: baseline`** (not `center`) so all top-level labels share one text baseline. See spec **Navigation** and `src/styles/site.css` (`.navlinks`, `.navitem`).

## Grid cell backgrounds must scope to direct children

A hairline grid's own cell-background rule (e.g. `.dl>div`) has to use the `>` child combinator. A descendant selector (`.dl div`) reaches into a nested `.card-cta`'s inner `<div>` and paints an opaque background over it, hiding the card's red hover fill and its own text. This broke the sponsors "Get package" card (`.card-cta` inside `.dl-cta` inside `.dl`) on 2026-08-27; `.cards`-grid CTA cards (subteams, join) were never affected since `.cards` has no such rule. See spec **Hairline grids** and `src/styles/site.css` (`.dl>div`, `section.paper .dl>div`).

## `/rockets` page

Fleet **lineup only** — no `FleetTable` section. Rhythm: `.phead` → `.paper.fleet` → `CtaBand`. Per-vehicle flight records live on `/rockets/[slug]`.

## `/payloads` page

Mirrors `/rockets`: `.phead` → `.paper.fleet` → `CtaBand`, with `PayloadLineup`/`PayloadStat` standing in for `FleetLineup`/`FleetStat`. Also embeds on the homepage and, as a `.cards` grid, on the Payload subteam page.

`PayloadLineup` shares `.craft`/`.lineup` markup with `FleetLineup` but adds `.payload-craft`/`.payload-lineup` modifiers: the base sizing (150px cap, tight gap) was tuned for `FleetLineup`'s six-vehicle row and strands two or three payloads close together mid-row instead of spreading them out. The modifiers widen the gap and the max width, scoped to `min-width:701px` in `src/styles/site.css` so they never fight the shared `.craft{max-width:none}` mobile stacked-row reset below 701px. A payload whose `result` starts with `"1st"` also gets `.val.win` (ignition red, bold) so a Payload Challenge win reads as a result, not a label.

## Link patterns

Two link utilities in `src/styles/site.css` — do not mix them for the same intent.

| Class | When |
|---|---|
| `.link-fleet` | Vehicle/payload cross-links and lineup card names. Ignition hairline underline starts at **42%** of the text width and **grows to 100%** on hover/focus (`transition: width var(--dur) var(--ease)`). Lineup: `<b class="link-fleet">` inside `.craft`; inline: `<a class="link-fleet" href="/rockets/...">` in `.dl dd` (e.g. Magpie → Osiris). Parent `.craft:hover` also triggers the grow on child `.link-fleet`. |
| `.link-underline` | Mailto, sponsor email, prose — static underline, no animation. |

## Product shot backlight

CAD/product cutouts (rembg, transparent alpha) use **white** backlight glow behind the asset, not ignition. Pattern: `.module-card__ph::before`, `.payload-render::before`, and `.product-aside::before` radial gradient + blur. Pair with `.ph-is-product` (`object-fit: contain`) so tall renders are not cropped. Dark sections: `rgba(255,255,255,.34)` core; paper sections: slightly stronger white.

## CAD asset resolution

Canva PNG exports for isolated renders (e.g. FTM at **743×558**) are the sharpness ceiling — Lanczos/upscale/rembg re-export cannot add real detail, only soften edges. **Ship native resolution** (lossless PNG after rembg, light unsharp, no feather). Cap CSS display with `width: min(100%, <native-width>px)` so the browser never upscales a small raster.

For a larger sharp FTM (or any CAD aside), re-export from Canva at **2×–3×** before download, or export the full poster PDF and rasterize at 300 DPI. Replace `public/media/payloads/<slug>/` and bump the `min(100%, Npx)` cap to match the new native width.

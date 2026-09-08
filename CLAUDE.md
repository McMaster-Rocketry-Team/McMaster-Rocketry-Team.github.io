# McMaster Rocketry site — agent notes

Condensed, code-facing rules for working in this repo. Full design system (single
source of truth): `spec/design-system.md` in
[github.com/McMaster-Rocketry-Team/design](https://github.com/McMaster-Rocketry-Team/design) —
see `docs/design-system.md` for why it lives there and not here. Don't cite a spec
version number here; it goes stale. Check the spec file itself for the current one.

## Visual identity

Red, white and black only. Ignition (`#BF2026`) is a fill and a hairline accent, never
a wash on a photograph or a video, and never a running text colour (not even for
numbers/amounts). On dark grounds, eyebrow/tagline text is white at 78% opacity, not
ignition — ignition on `--graphite-700`/`--graphite-900` fails contrast.

## Heroes

Photographic and video heroes are **full colour**. Do not grayscale the media, do not
map it through a duotone filter, and do not cover it with a red or black gradient veil.

Copy on a photographic/video hero sits in `.herobox` (translucent graphite panel,
hairline, slight blur), sized to the text. Interior pages **without** a photo hero use
a solid graphite `.phead` and do **not** grow a box.

| Context | Pattern |
|---|---|
| Home | `.hero` + `.bgvid` + `.herobox` |
| Vehicle / subteam with photo | `.phead.has-hero` + `.herobox` (all six vehicles, all seven subteams) |
| Sponsors landscape hero | `.phead.has-hero.has-hero--wide` + `.herobox` |
| Everything else (Join, Members, pages without a hero photo) | `.phead` only — tag, h1, lede in `.wrap` |

```html
<!-- correct: photo hero -->
<header class="phead has-hero" style="--hero-img:url(...)">
  <div class="wrap"><div class="herobox">...</div></div>
</header>

<!-- correct: interior page -->
<header class="phead">
  <div class="wrap"><div class="tag">...</div><h1>...</h1><p class="lede">...</p></div>
</header>

<!-- wrong: herobox without heroImage; grayscale/duotone/veil on footage -->
```

## Tagline

`site.json` `tagline` is **"Get blasted"**. It travels with the team name as a
`.lockup` (display name + mono tagline) in three places only:

1. Nav brand (logo + short name + tagline)
2. Footer brand column (full name + tagline)
3. Home hero `.herobox` (full name + tagline, above the altitude)

Home document title stays `Get blasted · McMaster Rocketry`. Do not stamp the tagline
on section eyebrows, interior pageheads, Join, or Sponsors.

## Logo & lockups

Standalone lockup PNGs live in the design repo's `assets/lockups/`, not this repo. Team
name + tagline stack directly, tagline beneath the name, never side by side. Clear
space around the whole mark or lockup is 1x mark peak-height on every side. Full
detail, minimum sizes, and the file matrix: spec **Logo & lockups**.

## Page rhythm

Alternate `section.paper` (light) and plain `<section>` (dark) for visual breathing
room — this is a deliberate signature device, not something to flatten to one theme.
`.shead` (the shared section-header component: tag, then headline, then lede, then an
optional right-aligned `.statline`) always stacks in a single vertical column. Never a
left-headline/right-paragraph split. Every page ends with `CtaBand`. Prefer CSS
utilities (`.prose`, `.prose--follow`, `.note`, `.link-fleet`, `.link-underline`) over
inline colour/spacing.

| Route | Pattern |
|---|---|
| `/rockets` | `.phead` → `.paper.fleet` → `CtaBand` (lineup only) |
| `/payloads` | `.phead` → `.paper.fleet` → `CtaBand` |
| Home | `.hero` → dark `#hadfield` → `.paper.fleet` (`#fleet`) → `.paper.fleet` (`#payloads`) → dark `#subs` → `CtaBand` |

## CTA copy

One label per intent, site-wide. The join flow is always **"Join us"** (nav, hero,
closing `CtaBand`) — do not reintroduce variants like "Join the team" or "How to join".

## Links

| Class | Use |
|---|---|
| `.link-fleet` | Cross-links to vehicles, payloads, or lineup names — ignition hairline at 42% width, grows to 100% on hover/focus (same motion as fleet `.craft` cards). |
| `.link-underline` | Mailto, sponsors email, static underline — no grow animation. |

```html
<!-- vehicle cross-link in a spec grid -->
<a class="link-fleet" href="/rockets/osiris">Osiris</a>

<!-- mailto / plain underline -->
<a class="link-underline" href="mailto:...">Email</a>
```

Fleet lineup names use `<b class="link-fleet">` inside `.craft`; the parent card's
hover also triggers the underline grow.

## Product shot backlight

Transparent CAD/product images (rembg cutouts) on dark sections get a **white** radial
backlight behind the asset, not ignition. Implemented on `.module-card__ph::before`
(SRAD board grid), `.payload-render::before` (full payload CAD beside prose), and
`.product-aside::before` (inline CAD beside payload block copy). Use `object-fit:
contain` (`.ph-is-product`) so cutouts are never cropped.

## Crosshairs

One pair on `.phead` / `.hero`. Home and `/rockets` add a second pair on `.paper.fleet`.

## Nav

Fixed gradient scrim (never a solid bar). **Rockets** and **Subteams** are `.navitem`
flyouts; other links are direct `.navlinks > a`.

Desktop row: `.navlinks { align-items: baseline }` and `.navitem { display: flex;
align-items: baseline }`. Do not use `align-items: center` on the desktop link row —
flyout wrappers sit lower than plain links.

Flyout on desktop: hover / focus-within. Mobile (≤980px): nested list, `align-items:
stretch`.

## CI and GitHub Actions

Do **not** push to `origin` or open/merge PRs that would trigger GitHub Actions until
the built site is TODO-free.

Before any push that would hit CI:

1. Run `pnpm astro build && pnpm check:todo` locally.
2. If `check:todo` fails, stop. Do not push. Fix content or wait for Robin to supply facts.

**Workflow policy:**
- **Deploy** (`.github/workflows/deploy.yml`): runs on push to `main` only, and always
  runs `pnpm check:todo` after build. Production must be clean.
- **Build check** (`.github/workflows/build-check.yml`): runs on push/PR to `dev`, plus
  manual dispatch.

When Robin says the site is ready to go live, run `check:todo` once more, then
push/merge to `main` or manually dispatch build check if a sanity run is wanted.

## Canonical source

Shipped CSS: `src/styles/site.css`. Mockups in `mockups/final/` are deprecated when
they disagree with Astro.

# TODO manifest — content only Robin can supply

Generated from the mockup source. The live site is now Astro (`src/data/*.json`,
`src/pages/`). Per-file occurrence counts at the bottom are stale; the *list*
of missing facts is what matters. Paths below name the mockup file and the
Astro equivalent.

**Resolved since this file was written:** team email `rocketry@mcmaster.ca`;
2026–27 lead **names** (and 15/19 portraits) in `members.json`; `/outreach`
exists; join FAQ "do I need to pay anything?" removed rather than answered;
Nimbus apogee `17862` from the flight computer; **Nimbus `mach` 1.14, `specs.accel`
9.5 G, `specs.recovery` from LC25 Blue Raven log**; apply URL + Clubsfest /
Facultyfest / application dates in `join.json`; Instagram / Discord /
LinkedIn in `site.json`; weekly time commitment answered in the join FAQ;
sponsorship **tier amounts** Bronze `$500+` / Silver `$2,000+` / Gold
`$3,000+`; **season budget figures** ($50,034 total, nine line items from
Budget.xlsx); **two named sponsorship contacts** (Robin Anderson, Christina
Zhou); **sponsorship package PDF** at `/docs/sponsorship-package-2026-2027.pdf`;
Nimbus `lengthIn` + `build`; Marauder I/II, Luminis, and Osiris
`lengthIn` also set; all six fleet cutouts shipped (including Luminis V2);
**vehicle gallery photos** wired in Astro for five of six vehicles (Osiris +
Marauder I/II, Luminis, Luminis V2, Nimbus); outreach thinned to six visible
events (three hidden pending detail).

## Blocks a real launch

| What | Where (mockup → Astro) | Why it matters |
|---|---|---|
| ~~**Team email address**~~ | done, `rocketry@mcmaster.ca` | |
| ~~**Three sponsorship amounts**~~ | done in `src/data/sponsorship.json` tiers | |
| ~~**Two named contacts**~~ | done in `src/data/sponsorship.json` | Robin Anderson, Christina Zhou. |
| ~~**Season budget figures**~~ | done in `src/data/sponsorship.json` | Nine line items, $50,034 total. |
| ~~**Application form URL**~~ | done, real Microsoft Forms URL in `join.json` `applyHref` | |
| ~~**Clubsfest / Facultyfest dates + application window**~~ | done, real dates in `join.json` `dates` | |
| ~~**Nimbus apogee**~~ | done, `17862`, sourced from the flight computer | |
| ~~**Nimbus flight record**~~ | done, `mach` 1.14, `accel` 9.5 G, recovery deploy altitudes | LC25 Blue Raven primary |
| **T+ flight timeline** | `c/` family only; not in the Astro site | Physically impossible as written. Dropped with the rejected C variants. |

## Needed before launch, not blocking design review

| What | Where |
|---|---|
| ~~Member **names**~~ — 2026–27 leads are in | `src/data/members.json`. Programmes and years still empty. Portraits: 15/19 (missing: Abigail Rosehart, Erik Filippetti, Krish Patel, Jia Agarwal). |
| Subteam lead programmes / years / one-line bios | `src/pages/subteams/[slug].astro` (names already render from `members.json`) |
| Roster statistics (faculties, first years, founded) | `src/data/members.json` `stats` (`Active members` is `100+`; the other three are null) |
| Real subteam description and first-term detail | `src/data/subteams.json` (`detail` / `first` / `skills` still null except Avionics) |
| Vehicle specs — mass, motor, recovery, result | `src/data/vehicles.json` (all six have `lengthIn`; mass/recovery/result mostly null except Nimbus). |
| Build narrative per vehicle | `src/data/vehicles.json` `build` (all six have one) |
| ~~Photographs + captions~~ | done — all six vehicles in `vehicles.json` `photos[]` with `caption` on every slot. Gallery exports at **1400×933 (3:2 landscape)** to match `.gallery .ph`. Luminis + Luminis V2 reframed 2026-08-27. |
| Partner logos, linked, with company-name alt text | `src/pages/sponsors.astro` |
| ~~Sponsorship package PDF~~ | done, `/docs/sponsorship-package-2026-2027.pdf` |
| ~~Social handles (Instagram, Discord, LinkedIn)~~ | done, all three set in `src/data/site.json` `social` |
| Answer to "do I need to pay anything?" | **removed** from `join.json`. $600 / $65 figures from minutes were not published. Say if the FAQ should come back. |
| Outreach TODOs | **done** — CAGIS fall 2025, info nights (fall, talk with leads), LC bingo one-off at Launch Canada 2026; Space Industry night / Isaac dinner still `hidden` pending detail |

## Raw occurrences

These counts are from the mockup HTML before `data.js`/`render.js` ate most of
the literal `TODO` strings, and before the `a/`–`c.3/` directions were deleted.
Do not treat them as current. Grep `src/` instead.

**final/index.html** — 24
**final/join.html** — 23
**final/members.html** — 39
**final/rocket.html** — 27
**final/rockets.html** — 12
**final/sponsors.html** — 32
**final/subteam.html** — 17
**index.html** — 1
**a/index.html** — 1
**b/index.html** — 3
**c.1/index.html** — 3
**c.2/index.html** — 4
**c.3/index.html** — 4
**c/index.html** — 3

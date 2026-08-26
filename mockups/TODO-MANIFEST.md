# TODO manifest — content only Robin can supply

Generated from the mockup source. The live site is now Astro (`src/data/*.json`,
`src/pages/`). Per-file occurrence counts at the bottom are stale; the *list*
of missing facts is still the right list. Paths below name the mockup file and
the Astro equivalent.

**Resolved since this file was written:** team email is `rocketry@mcmaster.ca`.
2026–27 lead **names** are in `src/data/members.json` (programmes, years, and
portraits are not). `/outreach` exists. The join FAQ "do I need to pay
anything?" was removed rather than answered. Nimbus apogee is sourced:
`17862`, from the flight computer. Application form URL and the Clubsfest/
Facultyfest/application dates are in `join.json`. Social handles are in
`site.json`. Weekly time commitment is answered in the join FAQ, no `todo`
flag left. Nimbus has a `lengthIn` and a `build` narrative. The other five
vehicles still do not.

## Blocks a real launch

| What | Where (mockup → Astro) | Why it matters |
|---|---|---|
| ~~**Team email address**~~ | done, `rocketry@mcmaster.ca` | |
| **Three sponsorship amounts** | `final/sponsors.html` → `src/data/sponsorship.json` | A sponsor cannot decide without a number; they will price you low. |
| **Two named contacts** | `final/sponsors.html` → `src/data/sponsorship.json` | "A named human" was a sponsor blocker. The slot exists, the name does not. |
| **Season budget figures** | `final/sponsors.html` → `src/data/sponsorship.json` | The most persuasive content on the page per the sponsor review. |
| ~~**Application form URL**~~ | done, real Microsoft Forms URL in `join.json` `applyHref` | |
| ~~**Clubsfest / Facultyfest dates + application window**~~ | done, real dates in `join.json` `dates` | |
| ~~**Nimbus apogee**~~ | done, `17862`, sourced from the flight computer | |
| **T+ flight timeline** | `c/` family only; not in the Astro site | Physically impossible as written. Dropped with the rejected C variants. |

## Needed before launch, not blocking design review

| What | Where |
|---|---|
| ~~Member **names**~~ — 2026–27 leads are in | `src/data/members.json`. Programmes, years, portraits + alt text still empty. |
| Subteam lead programmes / years / one-line bios | `src/pages/subteams/[slug].astro` (names already render from `members.json`) |
| Roster statistics (faculties, first years, founded) | `src/data/members.json` `stats` |
| Real subteam description and first-term detail | `src/data/subteams.json` (`detail` / `first` / `skills` still null except Avionics) |
| Vehicle specs — length, mass, motor, recovery, result | `src/data/vehicles.json` (`lengthIn` set on Nimbus only, still null on the other five, so they draw at the same fallback height) |
| Build narrative per vehicle | `src/data/vehicles.json` `build` (Nimbus and Osiris have one, the other four do not) |
| Photographs + captions | `src/pages/rockets/[slug].astro` gallery, still four hardcoded TODO slots. Shortlists exist under `rockets/<slug>/SHORTLIST.md` for all six vehicles, none wired in. |
| Partner logos, linked, with company-name alt text | `src/pages/sponsors.astro` |
| Sponsorship package PDF | `src/pages/sponsors.astro` |
| ~~Social handles (Instagram, Discord, LinkedIn)~~ | done, all three set in `src/data/site.json` `social` |
| Answer to "do I need to pay anything?" | **removed** from `join.json`. $600 / $65 figures from minutes were not published. Say if the FAQ should come back. |
| Outreach TODOs | `src/data/outreach.json` — STEM name, Space Industry night, Isaac dinner, info nights, Clubsfest every-term, LC bingo year |

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

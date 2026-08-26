# TODO manifest — content only Robin can supply

Generated from the mockup source. The live site is now Astro (`src/data/*.json`,
`src/pages/`). Per-file occurrence counts at the bottom are stale; the *list*
of missing facts is what matters. Paths below name the mockup file and the
Astro equivalent.

**Resolved since this file was written:** team email `rocketry@mcmaster.ca`;
2026–27 lead **names** (and 15/19 portraits) in `members.json`; `/outreach`
exists; join FAQ "do I need to pay anything?" removed rather than answered;
Nimbus apogee `17862` from the flight computer; apply URL + Clubsfest /
Facultyfest / application dates in `join.json`; Instagram / Discord /
LinkedIn in `site.json`; weekly time commitment answered in the join FAQ;
sponsorship **tier amounts** Bronze `$500+` / Silver `$2,000+` / Gold
`$3,000+`; Nimbus `lengthIn` + `build`; Marauder I/II, Luminis, and Osiris
`lengthIn` also set; all six fleet cutouts shipped (including Luminis V2).

## Blocks a real launch

| What | Where (mockup → Astro) | Why it matters |
|---|---|---|
| ~~**Team email address**~~ | done, `rocketry@mcmaster.ca` | |
| ~~**Three sponsorship amounts**~~ | done in `src/data/sponsorship.json` tiers | |
| **Two named contacts** | `final/sponsors.html` → `src/data/sponsorship.json` | "A named human" was a sponsor blocker. The slot exists, the name does not. |
| **Season budget figures** | `final/sponsors.html` → `src/data/sponsorship.json` | The most persuasive content on the page per the sponsor review. |
| ~~**Application form URL**~~ | done, real Microsoft Forms URL in `join.json` `applyHref` | |
| ~~**Clubsfest / Facultyfest dates + application window**~~ | done, real dates in `join.json` `dates` | |
| ~~**Nimbus apogee**~~ | done, `17862`, sourced from the flight computer | |
| **T+ flight timeline** | `c/` family only; not in the Astro site | Physically impossible as written. Dropped with the rejected C variants. |

## Needed before launch, not blocking design review

| What | Where |
|---|---|
| ~~Member **names**~~ — 2026–27 leads are in | `src/data/members.json`. Programmes and years still empty. Portraits: 15/19 (missing: Abigail Rosehart, Erik Filippetti, Krish Patel, Jia Agarwal). |
| Subteam lead programmes / years / one-line bios | `src/pages/subteams/[slug].astro` (names already render from `members.json`) |
| Roster statistics (faculties, first years, founded) | `src/data/members.json` `stats` (`Active members` is `100+`; the other three are null) |
| Real subteam description and first-term detail | `src/data/subteams.json` (`detail` / `first` / `skills` still null except Avionics) |
| Vehicle specs — mass, motor, recovery, result; Luminis V2 length | `src/data/vehicles.json` (`lengthIn` set on five of six; Luminis V2 still null) |
| Build narrative per vehicle | `src/data/vehicles.json` `build` (Nimbus and Osiris have one, the other four do not) |
| Photographs + captions | `src/pages/rockets/[slug].astro` gallery, still four hardcoded TODO slots. Shortlists exist under `rockets/<slug>/SHORTLIST.md` for all six vehicles, none wired in. Osiris has gallery webps on disk already. |
| Partner logos, linked, with company-name alt text | `src/pages/sponsors.astro` |
| Sponsorship package PDF | `src/pages/sponsors.astro` |
| ~~Social handles (Instagram, Discord, LinkedIn)~~ | done, all three set in `src/data/site.json` `social` |
| Answer to "do I need to pay anything?" | **removed** from `join.json`. $600 / $65 figures from minutes were not published. Say if the FAQ should come back. |
| Outreach TODOs | `src/data/outreach.json` — STEM name/when, Space Industry night, Isaac dinner, info nights, whether LC bingo runs every Launch Canada |

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

# MRT site rebuild, progress and handoff

**Last updated:** 2026-08-26 (sponsors, galleries, nav) · branch `dev` (ahead of `origin/dev`; see latest check-in)

## 2026-08-26 sponsors, galleries, nav flyout

Working tree since `b1267c2` (docs + ReviewMode lock-in). Sections below that
still say "budget figures and contact names still TODO", "Vehicle galleries
not wired", or "four fixed slots" are historical; this section is current.

### What landed this session

- **Sponsorship budget:** all nine line items from the 2026–27 Budget sheet
  transcribed into `src/data/sponsorship.json` and `mockups/final/data.js`
  ($50,034 total). Budget grid uses `.dl.c4` with a "Get package" CTA cell.
- **Sponsorship contacts:** Robin Anderson (President) and Christina Zhou
  (Project manager) in `sponsorship.json`. Footer CTA and budget CTA link to
  `/docs/sponsorship-package-2026-2027.pdf` (also copied to `mockups/final/docs/`).
- **Vehicle galleries:** `photos[]` arrays wired in `vehicles.json` for
  Marauder I/II, Luminis, Luminis V2, and Nimbus (25 webps under
  `public/media/rockets/`). `[slug].astro` renders a variable list when
  `photos` is non-empty; Osiris was already wired. Empty fallback still shows
  four TODO slots for vehicles with no photos.
- **Outreach:** three thin events (Space Industry night, Fall preview, Isaac
  dinner) marked `hidden: true` in `outreach.json` so the page shows six real
  events, not nine placeholders.
- **Nav:** Subteams flyout on desktop (hover/focus-within); nested list on
  mobile. Section highlight when on any `/subteams/*` route.
- **Copy:** subteams index headline → "Seven teams, one rocket." (Astro +
  mockup). Subteams index ReviewMode locked 0–25.

### Still open after this session

- Mockup vehicle galleries still use four hardcoded TODO slots (`rocket.html` /
  `render.js`); Astro is ahead here.
- Partner logos on `/sponsors` still TODO.
- Three liftoff frames (Marauder I, Luminis, Nimbus) need Robin to confirm
  the airframe is readable before captions ship.
- Luminis V2 `lengthIn`; member programmes/years; four missing lead portraits.
- Finish ReviewMode on outreach / sponsors / members / other vehicles.
- `check:todo` gate before prod deploy.

## 2026-08-26 docs + ReviewMode lock-in

Working tree since `5f7f555` (outreach + four fleet cutouts). Docs below this
heading that still say "lengthIn null on all six", "Luminis V2 borrows
Osiris", "Nimbus 18,000", or "readme is still init" are historical; this
section is current.

### ReviewMode (live Chromium session)

| Page | Status |
|---|---|
| `/` | Fully locked (0–42) |
| `/join` | Fully locked (0–37) |
| `/rockets` | Fully locked (0–21) |
| `/rockets/osiris` | Fully locked via `vehicles.json` `reviewLocked` |
| `/outreach` | 4 unlocked left (Space Industry night blurb, Isaac photo slot, "For sponsors", CtaBand tag) |
| `/sponsors` | Partial; tier amounts in, budget figures and contact names still TODO |
| `/members` | 46/82 locked this session; 36 open (mostly programme/year TODOs; unchecked: Joud, Owen, Jase, Ella, Sebastian) |
| `/subteams`, `/subteams/[slug]`, other vehicles | Not started |

### What is true on disk now

- **Fleet cutouts:** all six vehicles have their own PNG under
  `public/media/rockets/` (Luminis V2 no longer stands in Osiris).
- **`lengthIn`:** set on Marauder I (100.6), Marauder II (105), Luminis (110),
  Nimbus (106.3), Osiris (124.8). **Luminis V2 still `null`** (only remaining
  unsized airframe in the lineup).
- **Nimbus apogee** `17862` (flight computer). Osiris `mach` unpublished
  (`null`). Luminis V2 apogee `10564`.
- **Sponsorship tiers:** Bronze `$500+` / Silver `$2,000+` / Gold `$3,000+`
  in `sponsorship.json`. Season **budget amounts** and **two named contacts**
  still null.
- **Leads:** 19 names in `members.json`; **15/19** have portraits in
  `public/media/leads/` (still empty: Abigail Rosehart, Erik Filippetti,
  Krish Patel, Jia Agarwal). Programmes and years still null for everyone.
  `LeadCard.astro` renders them.
- **Outreach:** route live; six event photos in `public/media/outreach/`.
  Five events still carry `todo` flags (STEM name/when, Space Industry night,
  Isaac dinner, info nights, LC bingo recurrence).
- **Join:** real apply URL, Discord, LinkedIn, Facultyfest Aug 31 12:30–17:00,
  Clubsfest Sept 14 16:30–19:30 JHE field, applications open Aug 31 09:00 /
  close Sept 18 23:59.
- **Design rule:** `.cursor/rules/design.mdc` (red/white/black, full-colour
  heroes + `.herobox`, tagline only in nav/footer/home hero). `readme.md`
  points at it.

### Still open (launch blockers and near-term)

- Season budget figures + sponsorship contact names.
- Programme/year on `/members`; four missing lead portraits (Abigail, Erik,
  Krish, Jia).
- Vehicle galleries (template still four fixed slots; shortlists not wired).
- Luminis V2 `lengthIn`; remaining outreach TODOs; `check:todo` gate.
- Finish ReviewMode on outreach / sponsors / members / subteams / other vehicles.
- Remove ReviewMode before launch.

Raw source staging (`leads_photos/`, root `outreach/` JPGs) and
`.tmp-fleet-*.png` stay gitignored; shipped assets are under `public/media/`.

## 2026-08-26 Marauder I ogive restore (Cursor)

The nose was still a vertical chord on the left after the BiRefNet recut.
Cause was not the model: `--erase 400,170,193,1380` ran through the ogive at
the tube's left edge (x=593), and the shaded black cone against dark grass
leaves leftover matte on that side. Recut from `m1b-bire-rot.png` with
nose-safe boxes (keep from the real tip at y=168; erase only y>=450), then
`restore --until 400`, which mirrors each ogive row's solid lit half across
the body centreline. Per-row `|L-R|` on the cone is 0 and the tip sits on
axis. Generative fill still not used.

## 2026-08-26 PARALLEL.md deleted (Claude Code)

Robin's call: Cursor's role narrowed to image manipulation only (fleet
cutouts, cropping), so the Claude Code/Cursor page-work split `PARALLEL.md`
documented no longer applies. Deleted the file and updated its references in
`readme.md` and the "Working notes for the next session" section below.
Earlier dated entries in this file (including the one directly below) still
mention `PARALLEL.md` where it was accurate at the time; left as historical
record rather than rewritten.

## 2026-08-26 live ReviewMode check-in (Claude Code)

Reused the dev server already running on 4321 and a fresh Chrome tab, per
`PARALLEL.md`. No prior review progress existed in this browser profile:
home has 1 unlocked block left (index 36, the Nimbus apogee figure below),
every other target page (`/join` 39, `/sponsors` 60, `/outreach` 42,
`/members` 56, `/subteams` 26, `/subteams/avionics` 44, `/rockets` 27,
`/rockets/osiris` 42) is fully unreviewed. Session with Robin starting now.

**Nimbus apogee, resolved by Robin from the flight computer:** `18,000` was a
placeholder. Real figures: max altitude 17,862.26 ft, max velocity
1,254.98 ft/sec. This is the number four of eight review-panel readers
called the single most damaging item on the site (§4 above).

**`src/data/vehicles.json` hard lock lifted for Claude Code, this session
only** (Robin's call 2026-08-26: Cursor is only doing image-gen/cropping
work right now, not data). Written directly rather than staged in this file:
- `nimbus.apogee` → `17862` (rounded to match every other vehicle's
  unrounded whole-number apogee, e.g. Osiris `33584`, Luminis V2 `10456`).
- `nimbus.lengthIn` → `106.3` (2.7 m airframe length, converted to inches —
  this was `null` on all six vehicles, the reason every rocket drew at the
  same fallback height in the fleet lineup; Nimbus is now the first with a
  real value).
- `nimbus.specs.length` → `"2.7 m (106.3 in)"`, `specs.mass` →
  `"14.2 kg dry / 23.4 kg wet"` (no established dry/wet convention existed,
  so both numbers went in one string), `specs.motor` → `"CTI N1800"`.
- The page's "Max velocity" stat card is not a dead slot: read it
  (`src/pages/rockets/[slug].astro:17`, hard-locked, did not edit) and it
  renders `v.mach` as `Mach {n}`, not a raw ft/sec field — mislabeled or
  repurposed, one or the other. Converting 1,254.98 ft/sec to a Mach number
  would need the local speed of sound at Nimbus's actual altitude/
  temperature, which nobody gave me, so `mach` stays `null` for Nimbus (the
  card correctly shows "Not published") rather than publish a computed
  guess. No schema field exists for total impulse or average thrust either.
  Folded all three into `nimbus.build` as prose instead of adding dead
  schema fields nothing renders: single-stage, COTS propulsion, 101.6 mm
  (4 in) diameter, 3.11 calibers stability, CTI N1800 at 10,366.9 Ns total
  impulse / 1,759.8 N average thrust, 1,254.98 ft/sec peak velocity. `build`
  was `null` before this, same field Osiris already uses for its narrative.
- Not written: fin span (101.6 mm, same as diameter — redundant to restate),
  configuration/propulsion type beyond what's in the `build` prose now.

**Osiris `mach` unpublished again, Robin's call.** Robin downloaded
`~/Downloads/Team 25 - McMaster Rocketry Osiris - FDR.pdf`, McMaster
Rocketry's Osiris Final Design Report (Revision R0, effective 2026-07-08,
entirely pre-flight — this is a design report, not a flight-data-recorder
file). Its Table 6 predicted trajectory (OpenRocket simulation) lists max
velocity as 642.5 m/s, **Mach 1.92** — identical to the Mach 1.92 already
published on the site as Osiris's flown number. Since this document predates
the flight, it cannot be where a real flown Mach reading came from, and
nobody could confirm the published 1.92 was ever a real flight-computer
readout rather than this predicted figure republished as measured. Robin's
call: unpublish it. Set `osiris.mach` to `null` in `vehicles.json` (was
`1.92`) and removed the hardcoded "Our highest and fastest flight ever, Mach
1.92" claim from the home hero (`src/pages/index.astro:56`, now "Our highest
flight ever."). The "Max velocity" stat card on `/rockets/osiris` now
correctly shows "Not published." `apogee: 33584` is untouched: the FDR's
predicted apogee (31,300 ft with airbrakes, 31,386 ft without) is well below
the published flown 33,584 ft, so that number did not come from this
document and nothing here contradicts it.

**Unused, worth coming back to:** the same FDR gives a real predicted-vs-
flown apogee delta (31,300 ft predicted with airbrakes → 33,584 ft flown,
+2,284 ft) that matches what the review panel asked for in §8 below
("31,200 predicted. 33,584 flown. We publish the gap."). Not written into
any page yet — Robin hasn't said whether she wants it on `/rockets/osiris`.

**`/join` fully reviewed and locked** (38/38 blocks, `reviewLocked` set in
`join.astro`). Fixes made at Robin's direction: lede rewritten (passion/
desire-to-learn instead of "how high this one goes"), Discord invite wired
to `https://discord.gg/tsQq8byCy8` in both `site.json` and the page's own
button, LinkedIn added to `site.json` (`https://ca.linkedin.com/company/
mcmaster-rocketry-team`), apply form wired to the real Microsoft Forms URL
with matching step copy, "Start building" step rewritten, Key Dates section
rebuilt around real dates (Facultyfest Aug 31 09:00, Clubsfest Sept 14,
applications close Sept 18 23:59, Interviews row dropped), "How much time"
FAQ rewritten to six hours/week without mentioning summer work per Robin
(team works into the summer but she doesn't want that stated, as it reads
as offputting to applicants), and the matching FAQ answer on "join partway
through the year" brought in line with the same Key Dates wording. Also
fixed two pre-existing template bugs while in here: `join.astro`'s date
rendering always showed the literal string "TODO" regardless of real data,
and a second hardcoded `discord.gg/TODO` placeholder button existed
alongside the one driven by `site.json`.

**`/rockets` fully reviewed and locked** (22/22). Removed the "Launch Canada
scores against a declared target" line and the entire second section below
the fleet lineup graphic (the `<FleetTable>` + its "apogee is the highest
altitude..." caption), both per Robin: the table duplicated data already on
the page. `FleetTable` import removed from `rockets/index.astro` since it's
now unused; the component file itself (hard-locked) is untouched.

**`/rockets/osiris` build narrative rewritten, Robin's call — corrects the
carbon-tube claim.** The previous `build` text ("laid up our own carbon
tubes... lighter and straighter than Nimbus... recovery sequence rewritten
... voted decision across three sensors") is superseded: Robin's real
answer is fiberglass tubes rolled in-house plus carbon fiber tip-to-tip fin
layups, and the two headline firsts are functional airbrakes and a
student-designed flight computer that had already been flight-tested before
competition (flown as a backup with confidence, not the primary). New
`vehicles.json` osiris `summary` trimmed to "Our highest and fastest vehicle
to date." (dropped the recovery-sequence claim along with the rest).

**Exception to my own hard lock: edited `src/pages/rockets/[slug].astro`
this session, at Robin's explicit live instruction.** Removed two
placeholder/template-author notes that were shipping as real page content
on every vehicle page: "Written by the subteam leads each year. Keep it
concrete..." under The Build heading, and the "Every vehicle gets a page
like this one..." callout box. This is the shared per-vehicle template
(normally locked to me, and normally Cursor's file under the lock table) —
flagging here so Cursor doesn't read the diff as a merge conflict. Verified
live on `/rockets/osiris`; the same two blocks are gone from every other
vehicle page too since they share this template.

## 2026-08-26 uncommitted site pass (Cursor)

> **Mostly committed in later 2026-08-26 commits** (outreach/cutouts at
> `5f7f555`, then the docs + review lock-in). Historical "still dirty" framing
> below is no longer accurate; see the top check-in for current open items.

Everything below this heading was in the working tree when this section was
written. `origin/dev` was at `bb3f987` at the time. Notes further down that
say "`dev` is 9 commits ahead" or "nothing has been pushed since `init`" are
stale; that push happened.

### What landed

**New route: `/outreach`.** Nine events in `src/data/outreach.json`, sourced
from FACT-CANDIDATES and Robin. Wired into `site.json` nav and the footer.
Mech industry night (23 Oct 2025), Fall preview (25 Oct 2025), and FIRST
Robotics (21–22 Mar 2026) have dates. The other six still carry `todo` flags
(STEM program name, Space Industry night, Isaac dinner, info nights, whether
Clubsfest runs every term, which year the Launch Canada bingo was). Gold-tier
one-off event funding is also a TODO. `OutreachEvent.astro` is the card.

**ReviewMode overlay** on every page (`src/components/ReviewMode.astro`,
mounted from `BaseLayout.astro`). Dashed amber markers on prose; click to
check off; state in `localStorage` per path. Home has `reviewLocked` for
indices 0–35 and 37–42 (36 is left unlocked). Delete the component and its
layout line before launch.

**2026–27 leads typed in.** `members.json` now uses `names: []` (co-leads).
Roles on `/members`: President, Project manager, seven subteam leads, VP
finance, Chief safety officer. Programmes, years, and portraits still empty.
`/subteams/[slug]` matches by `subteam` slug and renders one card per name.
**Avionics includes Krish Patel**, who was not on the OneDrive 2026-05-26
minutes list; the rest match FACT-CANDIDATES. Page tag is "2026–27
leadership", not 2025–26.

**Join.** The "Do I need to pay anything?" FAQ was **removed**, not answered.
The $600 travel / $65 entry figures from FACT-CANDIDATES were not published.
CtaBand now says "apply ASAP" instead of "apply any time".

**Fleet.** Lineup height is `lengthIn` (tip to tail), not apogee. All six
`lengthIn` values are still `null`, so every rocket currently draws at the
mid fallback height (`unsizedH` in `src/lib/fleet.ts`). `sortVehicles` forces
chronological order because Astro's `file()` loader returns ids
alphabetically. `paleArt: true` on the five vehicles still using
`osiris.png` (including Osiris) so a white airframe gets a wider rim next to
Nimbus. **Nimbus has its own cutout:** `public/media/rockets/nimbus.png`
(187×1895). Working-tree `osiris.png` is now 305×3530 / 436 KB (the hygiene
check-in below recorded 631 KB; that version did not last).

**`apogeeUnverified` is gone** from the Zod schema, the fleet table, the
vehicle page, and Nimbus in `vehicles.json`. Nimbus still publishes
**18,000 ft with no "rounded, source it" badge.** That is a credibility
regression until Robin sources the flight-computer figure or sets `apogee`
to `null`.

**Copy tweaks Robin allowed:** home headline "One rocket, seven subteams";
Operations blurb is merch / marketing / sponsorship / budget (launch-day and
range-safety dropped from the card); Airframe / Avionics / Payload blurbs
gained discipline tags. Subteam 8th-tile copy is now "Want to learn more?
Come to Clubsfest or Facultyfest and talk with the team." (supersedes the
"Not sure which one? Come to a meeting…" wording in the ragged-grid
check-in). `.gitignore` now excludes `.onedrive-extract/`.

### Fleet cutouts, and how to make one

`nimbus.png` and `osiris.png` were cut by hand with **no record of how**, in
two sessions that left only intermediates (`rockets/osiris/cropped.png`,
`osiris_rocket.png`). Reading the artifacts back: both were cut from the
repo's own 2000px webp, straightened, and trimmed tight to their alpha, and
Nimbus came from `nimbus-02.webp`, a **cluttered indoor lab shot**, not a
plain background. So a busy background was never the blocker it looked like.

That method is now a script: `scripts/cut-fleet-cutout.py`, run under a rembg
venv at `/home/robin/.cache/mrt-rembg`. `mask` runs the matting model,
`measure` prints the alpha's per-row extent so you can read the airframe's
own bounding box off it, `finish` isolates, straightens, trims and feathers,
`restore` rebuilds an ogive from its well-lit half, and `patch` reclones
uniform paint along the axis. Background removal only: every surviving pixel
is from the photograph. Rotation, and the ogive mirror (same row, same
vehicle, across a measured centreline), are the only geometry changes.
Nothing is scaled on one axis, because lineup height is a claim about real
length.

**Three shipped: Luminis, Marauder I, Marauder II.** Only Luminis V2 still
borrows `osiris.png`. Per-vehicle sources, commands and caveats are in each
`rockets/<slug>/SHORTLIST.md`, including two rejected first attempts that
should not be retried.

**The single biggest lever was the model, not the boxes.** The first Marauder
cuts used rembg's `isnet-general-use` and Robin correctly called both messy.
Switching to **`birefnet-general`** on the identical frame took the matte from
17.7% partially-transparent to 1.1%, recovered both of Marauder I's
carbon-weave fins (one against a tent, one against grass, which isnet had
dissolved into a ragged grey smear), held the aft ring and rail buttons, and
dropped a guy wire that isnet had fused to the nose. It is a ~900MB one-time
download and ~15s per frame on CPU. It is now the script default. If a cutout
looks ragged, check the model before touching the geometry.

**Second lever: how big the airframe is in the source frame.** Marauder II
was rejected twice from `marauder-ii-04.webp`, the vertical pad shot, and the
mask was never the problem: in that frame the airframe is only **~40px wide**,
so the cutout came out 65px where the other vehicles are 148 to 305px. At
that scale every scrap of residue is proportionally huge and there is no
detail to recover. The fix was a frame the shortlist never imported,
`IMG_2861.HEIC` (sheet 17-15), the full airframe horizontal on its cradle at
4032x3024 with the airframe ~2850px long, now `marauder-ii-13.webp`. Cutting
that took no `--keep` and no `--erase` at all. **Before fixing a bad cutout,
check how many pixels of real airframe the source actually contains, and go
back to `_sheets/` for a closer frame.** Robin asked for generative cleanup on
the 40px version; the reason not to is that at that size it would be
inventing what the vehicle looks like, which is the Nimbus 18,000 ft problem
in pixel form. `PARALLEL.md` already bans it.

**Third lever: a stand is not a rail.** Nimbus, Osiris and Luminis were each
an airframe with a *stand underneath*, so a box ending above the hardware
separates them. Both Marauder frames have a *launch rail alongside*, touching
the airframe for its full length. For both Marauders the answer was a
different frame: `marauder-i-02` (horizontal on tripods, confirmed the same
vehicle) and `marauder-ii-13`. Note the pattern — **both rescues were the
airframe lying horizontal on a cradle, rotated 90deg.** That is the setup to
look for first.

Five things worth not re-deriving:

- The **stand comes with the rocket.** Whatever an airframe rests on touches
  it, so it lands in the same connected region and survives largest-region
  filtering. The first attempt rendered 96px wide instead of 42 because the
  red stand and its cast shadow were still attached. Fix is `--keep` with the
  airframe's own bbox, ending a few px above the stand's top rail.
- The matte carries a **~12px low-alpha halo** (6% of the canvas partially
  transparent, against 2-3% on the hand-cut pair). It matters more here than
  it would elsewhere: `.craft .rise img` builds its graphite rim from four
  1px drop-shadows *of the alpha silhouette*, so a halo gets traced as the
  outline. `tighten()` clips it back to a 2px band off the solid core.
- **A launch rail is harder than a stand**, because it runs against the
  airframe for its full height instead of sitting under it. No bounding box
  separates them while the vehicle is tilted, so straighten first and cut
  second. Colour-keying the rail out (it is far less saturated than a painted
  airframe) is tempting and wrong: it also eats an unpainted nose cone and
  punches holes through white decals on the body edge.

- **Hardware beside the airframe is a masking job; hardware in front of it is
  not.** Marauder I's tripod saddles are both: where a saddle breaks past the
  tube's edge, cutting the alpha at the tube's own edge removes it, and the
  tube's edges are stable to ~1px so that boundary is measurable rather than
  guessed. But the padded rollers overlap the tube's *face* from that angle,
  so cutting them would punch a hole in the airframe. For those, and nothing
  else, `scripts/cut-fleet-cutout.py patch` refills a box with the airframe's
  own pixels from further along its own axis: a painted tube is a cylinder of
  revolution, so colour barely changes along its length, which reconstructs
  the surface from this photograph of this vehicle with no model involved.
  **Rules:** uniform paint only, never a shape or an edge or a marking; verify
  the source window is clear of lettering, seams and rivets first (a first
  attempt cloned the MES logo into the tube); and re-check for dark
  desaturated blobs afterwards. Robin asked for a Google-Photos-style magic
  eraser and this is the honest equivalent — generative fill remains banned.
- **Check the silhouette's edges against physics, not against a screenshot.**
  Both failures were provable from the alpha alone before anyone looked at
  the page: a nose cone tapers symmetrically about its axis, so a frozen
  left edge beside a diverging right edge means hardware is fused on, and a
  constant maximum width that runs for 50 rows and stops means a flat slice
  through pad structure. `measure` prints exactly this.

- **Do not force every vehicle to the same width.**   Rendered widths at the
  lineup's 440px height are Marauder I 68, Marauder II 53, Nimbus 43,
  Luminis 42, Osiris 38. The spread is real: Marauder I is a stubby 2022 airframe
  with fins spanning ~2.7 body diameters, and the Spaceport vehicles are
  slender. A cutout much *wider* than its neighbours is worth a look, but
  measure the fin span in the photo before deciding it is wrong.

**Open, for Robin:** `marauder-i-08` and `-09` show a **bare chrome nose**
where `-02` and `-05` show navy with a silver tip. Either a nose was swapped
between sessions or that is a different airframe. Settle it before frames
from the two sets share a gallery.

### Still not done

> **Superseded by the 2026-08-26 docs + ReviewMode lock-in at the top of this
> file.** Kept as the snapshot of what this pass thought was open; do not
> treat the bullets below as current (Luminis V2 now has its own cutout;
> `lengthIn` is set on five of six; Nimbus apogee / join URL / tier amounts /
> readme are done).

- Vehicle galleries: still four hardcoded TODO slots in `[slug].astro`. All
  six `SHORTLIST.md` files exist; nothing is wired. The four-slot template
  still does not match the albums (see photo-ingest check-in).
- ~~**Luminis V2 is the last vehicle still showing another rocket's photo.**~~
  Done later the same day: `public/media/rockets/luminis-v2.png`.
- ~~**`lengthIn` is null on all six**~~ — five of six filled; Luminis V2 still
  null (see top check-in).
- Missing files referenced by shortlists: `luminis-v2-02`, `luminis-v2-03`,
  `marauder-i-11`. Listed as rejected/backup picks but not in the folders.
- ~~Robin-only facts (Nimbus apogee, apply URL, term dates, sponsor amounts)~~
  — those four are in; budget figures, contact names, and the `check:todo`
  gate remain.
- ~~`readme.md` was still the word "init"~~ — rewritten.

Dev server: `pnpm astro dev --host 127.0.0.1 --port 4321`.

## 2026-08-26 photo ingest (Cursor)

Remaining vehicle zips, after Claude's `PHOTO-HANDOFF.md`. Did not re-extract
albums already in `MRT-photo-review/`. Script is `scripts/ingest-rocket-photos.py`
(ImageMagick 2000px webp, contact sheets, stills-only unzip).

- **Marauder I** from `LC2022-photos.zip`: 12 numbered webps + `SHORTLIST.md`. No recovery shot. Liftoff is medium-confidence.
- **Marauder II** from `SA Cup 2023-photos.zip` stills: 12 numbered webps + `SHORTLIST.md`. Bib 55 / MARAUDER. No liftoff shot. An AltosUI screenshot in that album (13,025 ft) is **not** in `vehicles.json`.
- **Nimbus** leftovers folded to `nimbus-10`/`-11`; new `SHORTLIST.md`. Did not re-unzip LC 2025.
- **Osiris** new `SHORTLIST.md` from existing numbered files only. Leftover raws/cutouts still in the folder.
- Luminis / Luminis V2 / Rocketry 2025-2026 (unmapped outreach) not touched.
- Still not wiring galleries or fleet PNGs. Robin confirms shortlists first.

**Real finding, and it changes the template:** the four fixed photo slots in
`src/pages/rockets/[slug].astro` (integration / on the pad / liftoff / recovery)
do not survive contact with the actual albums. Marauder I and Nimbus have **no
recovery shot**; Marauder II and Osiris have **no liftoff shot**; Luminis V2 has
two onboard-camera frames with no slot at all. Four of six vehicles cannot fill
the grid. Wiring this as-is would ship two amber TODO placeholders per page
forever. The gallery needs to render 2 to 5 real photos and simply be shorter
when a beat does not exist, which is also the honest version: an empty slot beats
a guess, but a *silent* omission beats an empty slot when the photo was never
taken. Decide the fifth-slot question (Luminis V2 onboard) at the same time.

**Two liftoff picks have unconfirmed vehicle identity** (`marauder-i-07.webp`,
`nimbus-09.webp`): real launch frames from the right album and window, but the
airframe is too small to read lettering, and these are shared ranges. Same class
of problem as the Nimbus apogee. Do not caption either as "X clears the pad"
until Robin confirms.

**Scratch space:** `/home/robin/Downloads/MRT-photo-review/` is now 17 GB
(extracted stills plus contact sheets for seven albums). It is outside the repo
and safe to delete **after** the fleet cutouts are cut, since every
`SHORTLIST.md` points into it for full-res sources. The zips in
`photos_rocketry/` are the real backup. Do not rebuild the contact sheets; they
are in `_sheets/` and took about 3½ minutes of ImageMagick.

## 2026-08-26 ragged-grid fix

Both places that render the 7 subteams in a 4-column grid (`/subteams` and the
home page's `SubteamCards` component) left the last row at 4+3, one empty
slot. Built a scratchpad artifact rendering the real 7 subteam cards under
four options: a CTA tile in the 8th slot, an invisible filler cell, centering
the ragged row with flex instead of grid, and changing the column count to
divide evenly. Robin picked the CTA tile.

Added an 8th tile, "Not sure which one? Come to a meeting and try a few
before you pick.", linking to `/join`, to both `src/pages/subteams/index.astro`
and `src/components/SubteamCards.astro`.

**First attempt had a real bug, caught by Robin looking at the live page, not
by review**: the tile's modifier class was named `cta`, which collided with
the pre-existing bare `.cta` selector at `site.css:227` (the `<CtaBand>`
section's own styling, `padding:clamp(56px,11vh,132px) 0`). Same specificity,
later in the file, so it silently overrode the card's own
`padding:clamp(22px,3vw,34px)`, making the tile's row up to 25% taller than
every row above it. Renamed the modifier to `card-cta` in `site.css` and both
`.astro` files. Confirmed via `getComputedStyle` in a live Chrome tab at
several widths (900px, 1568px) that all 8 cards now report identical padding
and height, not just eyeballed from a screenshot.

**Lesson for next time a card variant gets added:** grep the class name
against all of `site.css` first. `.card`, `.cta`, `.tag`, and a few others are
reused as both card-grid classes and unrelated section/component classes
elsewhere in the file, and two single-class selectors at equal specificity
resolve by file order, not by which one "looks like" it should apply.

**Found while checking this, unrelated:** a dev server from before this
session was already running on port 4321, serving a stale build with none of
today's edits. If a local check of this fix looks unchanged, that stale
server is why. Kill it and restart `pnpm astro dev`.

## 2026-08-26 repo hygiene check-in

Two commits landed after the overnight check-in below, both already on `dev`:
`3c55dbd` fixed a real rendering bug (Astro collapses whitespace at a line
break next to a `{expression}`, caught by an actual Chrome check, not a source
read) and `52ec9f3` corrected three copy claims Robin flagged as wrong
(resume requirement, rolling admission, "everything is student-built") and
added real hardware detail (Blue Raven/Featherweight GPS as the
competition-required primary, the in-house Icarus hybrid engine in
development). Rebuilt from clean after both: still 19 pages, zero errors.

Ran a full git/repo audit, nothing destructive:

- **Secrets and history**: no API keys, tokens, or credentials in tracked
  files or in `.env*` anywhere. The sponsorship PDF and the old design-system
  spec (both gitignored) were never committed before the ignore rule landed,
  confirmed via `git log --all` on each path, so there is no leaked copy
  sitting in history to scrub.
- **Lockfile**: `pnpm install --frozen-lockfile` reports already up to date,
  no drift against `package.json`.
- **Working tree vs. gitignore**: nothing ignored is tracked, nothing tracked
  should be ignored. `dist/`, `.astro/`, `node_modules/` all correctly excluded.
- **Stale note fixed**: §1 below said `public/brand/logo-mark.svg` was
  "unreferenced by any page." Not true anymore, it is wired into
  `src/layouts/BaseLayout.astro`. The other two brand exports,
  `logo-mark-white-512.png` and `mcmaster_rocketry_logo_white.png`, are still
  unreferenced by anything in `src/`.
- **One real open item**: `public/media/rockets/osiris.png` has an uncommitted
  working-tree change, same 305×3530 dimensions as the committed version but
  5.5% of pixels differ and the file grew 504 KB → 631 KB. Visually near
  identical at normal size, most likely an edge/alpha-matte touch-up on the
  cutout, but nothing records what produced it or whether it is finished.
  Needs Robin's call: commit with a real message, or discard.
- `readme.md` is still just the word "init". Unchanged from the 2026-08-25
  check-in, still low priority pre-launch, noting again so it does not get
  lost.
- `dev` is 9 commits ahead of `origin/dev`. Nothing has been pushed since
  `225df11` (`init`), so neither GitHub Actions workflow has run for real yet.

## 2026-08-26 overnight check-in

Worked overnight while Robin was away, per her go-ahead. Two things landed,
each its own commit on `dev`:

**`065cdec`: content-mechanics pass.** Every `&mdash;`/em dash across all 8
mockup pages plus `data.js`/`render.js`/`site.js` (35+ occurrences, prose and
code comments both) is gone, replaced with a period, comma, colon or
parentheses per CLAUDE.md rule 2. Several repeated "X, not Y" clipped-negation
sentences varied. Five of the fifteen two-beat `<br>` headlines flattened to
plain phrases to break the site-wide formula; the rest kept as the display-type
device. **Fixed a real fabrication, not just style**: `join.html`/`data.js`
asserted "we run two info sessions in the first two weeks of term" and "fifteen
minutes with the lead of whichever subteam you picked" as settled fact. Neither
was true. Robin corrected this directly: recruitment is via Clubsfest and
Facultyfest, applications stay open until a TBD date, then each subteam runs
its own 30-minute-to-an-hour interview. `data.js`'s `join.steps`/`join.dates`
now say that, with real `todo` flags on the two things still unconfirmed
(whether Clubsfest/Facultyfest happens every term, the close date). Also cut
`safety.html` from the deadline scope per Robin's call: delinked from nav
(`data.js`'s `nav` array) and the footer (`render.js`) on all 7 shipped pages,
verified no other page still links to it. The file and its `data.js` `safety:`
object are untouched in the repo for a post-launch add.

**`076487f` + `5227156`: started and finished the Astro port**, all six items
from this file's old "Astro port notes" section below. Scaffolded Astro at the
repo root (pnpm; no Tailwind/GSAP, see the note in that section below for why).
`vehicles` and `subteams` are content collections (`src/content.config.ts`,
backed by `src/data/vehicles.json`/`subteams.json`) with every field that was
`null` in `data.js` kept optional/nullable in the Zod schema, so the build
does not fail on placeholders that are meant to stay empty pre-launch. Added
the `status: flew | failed | scrubbed | in-build` field this file asked for
(all six currently `flew`; no vehicle needed a different value yet). All 7
shipped pages ported to `.astro`, rendering at build time instead of
`render.js`'s runtime DOM writes: `/`, `/rockets`, `/rockets/[slug]`,
`/subteams`, `/subteams/[slug]`, `/members`, `/join`, `/sponsors`. Subteam lead
cards now read from `members.json` by role match instead of carrying a second
hardcoded "TODO: name", one less place to fill in later. `pnpm astro build`
succeeds, 19 pages, zero errors. Added `.github/workflows/build-check.yml`
(build-only sanity check on every branch but `main`, no TODO gate) and
`deploy.yml` (push to `main` → build → `scripts/check-todo.mjs` as a hard
go-live gate → deploy to Pages). **Neither workflow has run on GitHub yet**:
nothing has been pushed. The TODO gate currently fails, correctly: 267
placeholder occurrences across the built site right now, all real and all
already tracked below.

**Not done, on purpose** (see "Explicitly out of scope" in the plan this
session worked from): the ~7 per-subteam `/members/<slug>` roster pages that
`macrocketry-urls.txt` implies, and a separate `/contact` route. Neither
exists anywhere in `mockups/final/` either, so building them would be new scope
during a week already tight on time, not a port of existing work.

**Verification still needed, could not do it here**: no browser was
available this session (headless, no Chrome extension connected) to visually
click through the built site. Structural/content checks all pass (every
route responds 200 via `pnpm astro preview`, every vehicle/subteam link
resolves, TODO badges render where expected, no leaked HTML entities,
Nimbus's "rounded, source it" flag survived the port) but nobody has looked
at a rendered page yet. **First thing to do on review**: `pnpm install &&
pnpm astro preview`, click through all 8 routes (7 ported + `/safety` if
curious), compare against `mockups/final/*.html` in a second tab.

**Questions queued for Robin**, ranked, not yet asked in chat because she
had already stepped out when this check-in was written. See the bottom of
this section.

### Quick, no files needed

1. **Nimbus apogee** (`src/data/vehicles.json`, `nimbus.apogee`): publish the
   real flight-computer figure, or set to `null` so it renders "No verified
   record" like the other unpublished three? Four of eight review-panel
   readers called the current rounded `18,000` the single most damaging
   number on the site.
2. **Member count**: `src/data/members.json` says `"100+"`. Still accurate?
3. **Application form URL and Discord invite**: do these exist yet
   (`join.applyHref` and the `discord.gg/TODO` link), or genuinely not set up?
4. **Clubsfest/Facultyfest dates, application open/close dates**: known yet
   for this term, or still TBD?
5. **Do members pay anything** (join FAQ: membership fee, travel cost to
   competition, what the team covers)?

### Needs digging up files or names, whenever there's time

- Sponsorship budget figures (4 line items) and two named contacts
  (sponsorship lead, chief engineer).
- ~~Nine leads' names~~ — 2026–27 names are in `src/data/members.json`.
  Programme and year still empty. Confirm Krish Patel (avionics).
- Founded year, faculties represented, first-years count (member stats).
- Social handles (Instagram, Discord, LinkedIn).
- One team photo, plus member roster portraits.
- Confirm the drafted "about six hours a week" time commitment is real.
- Whether the per-subteam `/members/<slug>` pages and `/contact` route
  (flagged above as skipped tonight) should get built before launch or after.

## 2026-08-25 check-in

Since the commit above, `mockups/final/` was refactored: the static HTML pages
now render mostly from `data.js` through `render.js` (+284 lines), instead of
carrying literal `TODO` strings in markup. `TODO-MANIFEST.md`'s per-file raw
occurrence counts are now stale (they were 3 to 10x higher) because most of
that logic moved into `render.js`'s `todo()` / `mailBadge()` helpers, not
because content got filled in. The manifest's *list* of what is still needed
is still accurate.

Real vehicle content landed for Osiris: `image`, `apogee: 33584`, `mach: 1.92`,
and a real `build` narrative (own carbon tubes, three-sensor voted recovery
decision). This is currently the only vehicle with a photo — a raw source
folder `rockets/osiris/` (11 photos, camera originals + crop intermediates)
is now committed as raw source, same precedent as `media-source/`.

A draft sponsorship one-pager (Canva PDF, dated today) surfaced during this
check-in. It is not committed (old maroon branding, gitignored, see
`.gitignore`) but it is a real, Robin-authored source, so one fact was pulled
from it directly: **`site.email` is now `rocketry@mcmaster.ca`**, resolving
the TODO-MANIFEST's top blocking item across every page.

Three things in that PDF need your call before they go in the site, because
they conflict with or add numbers beyond what is already drafted:

- **Member count.** The site has `~60` (members.stats). The PDF says `100+`.
  Big enough gap that it needs a real count, not a pick between the two.
- **Sponsorship tiers.** The PDF has three real, named tiers: Bronze $500+,
  Silver $2000+, Gold $3000+, with their own benefit lists. `data.js` has three
  *drafted* tiers (Supporter / Partner / Title) with placeholder amounts and
  benefit copy already revised per the advisor's review (the resume-book item
  was deliberately removed there, see §4 below). Decide: keep the drafted
  names and copy and just plug in $500/$2000/$3000, or switch to the PDF's
  three tiers and re-run the advisor's benefit review against them.
- **Nimbus result.** `data.js` has `"1st, Payload Challenge"`. The PDF adds a
  **3rd place, Basic Launch Category** in the same competition — but the PDF
  also contradicts itself on which flight this was (page 2 says "4th
  high-power rocket", page 4 says "fifth high-power rocket" for the same
  Launch Canada 2025 result). Confirm which is right before it goes on the
  site; this is exactly the kind of number decision 8 reserves for you.

**Repo cleanup done this check-in:**

- Deleted `McMaster_Rocketry_Design_System_Spec.md` (stale local copy of the
  live claude.ai/design spec) and `mockups/ds-fleet.html` (fleet-lineup
  prototype, already ported into `render.js`/`site.css`). Both gitignored
  going forward so they don't quietly reappear.
- Committed `rockets/osiris/` raw photos and the sponsorship-PDF/spec-md
  gitignore entries alongside the `mockups/final/` refactor.

**Second pass, same day:** removed the six rejected mockup directions and the
chooser page (`mockups/a b c c.1 c.2 c.3`, `mockups/index.html`) from the
working tree — still in git history at `42970d2` if needed again. Deleted the
local `.backup-pre-fix/` (never in git; superseded by the verified `final/`
fixes). `public/brand/logo-mark.svg` and its two PNG exports are currently
unreferenced by any page (the header logo is an inline SVG instead) — not
dead weight, just unwired until a favicon or social-card image needs them.
`readme.md` is still just "init"; low priority until the site is live.

This is the *progress* doc. The original spec — content audit of the 15 live URLs,
page-by-page migration plan, day-by-day sequencing — is at
`~/.claude/plans/iterative-riding-oasis.md` and is still valid. Read that for the
"what and why"; read this for "what actually exists now and what's next".

---

## 0a. Google Analytics: not set up yet

No analytics exist anywhere in the repo today (checked `src/`, `public/`,
`astro.config.mjs`, both workflows). Steps to add GA4, in order:

1. **Robin creates the GA4 property** in Google Analytics and gets the
   measurement ID (`G-XXXXXXXXXX`). This is the one step nobody else can do.
2. **Add `PUBLIC_GA_ID` as a repo variable**, not a secret, in GitHub repo
   settings under Actions. A measurement ID is meant to be public (it ships
   in every visitor's page source), and secrets render as `***` in some
   Actions contexts, which would break debugging. Astro only inlines
   `import.meta.env` values prefixed `PUBLIC_` into client-shipped code, so
   the variable name has to keep that prefix.
3. **Read the ID in `src/layouts/BaseLayout.astro`**, the single layout all
   19 pages already share (line 33 currently ends the `<body>` with
   `site.js`). Add the GA4 snippet as a conditional block that renders
   nothing when the variable is unset, so a `pnpm astro build` run without
   the variable (every `dev`-branch build, per the deploy workflow's
   branch filter) ships with no tracking code and no broken script tag.
4. **Pass the variable into the build step** in
   `.github/workflows/deploy.yml` (the `pnpm astro build` step, line 37) as
   `env: PUBLIC_GA_ID: ${{ vars.PUBLIC_GA_ID }}`. Astro's `PUBLIC_` vars are
   read at build time, so the value has to be present exactly there, not at
   the deploy job further down.
5. **Set `site:` in `astro.config.mjs`** (currently `defineConfig({})`, no
   site URL at all) to the real production URL. Without it there is no
   canonical URL for GA's referrer/campaign attribution to anchor to, and
   the sitemap idea in the features list below needs the same field.
6. **Verify after the first real push to `main`.** `dev` and `origin/dev`
   are both `bb3f987` as of the uncommitted-site-pass check-in at the top;
   the dirty tree is local only. GA's Realtime report will show nothing
   until `main` gets a push through the deploy workflow. Check Realtime
   after that, not before.

One open question for the §4 list below: McMaster may already have a
required analytics or privacy policy for club-affiliated sites (cookie
notice, data retention), given the "reads as an official university
publication" concern already flagged there. Worth confirming before GA
goes live, not after.

---

## 0. Where we are

> **Superseded 2026-08-26.** This section and its table describe the state before
> the Astro port. The port is done (19 pages, zero errors) and photo ingest is
> done. Read the dated check-ins at the top of this file for current state; keep
> this section only for the deadline and branch facts.

Design exploration and review are **done**. The Astro build has **not started**.
Everything on disk is self-contained static HTML.

| | |
|---|---|
| Deadline | Squarespace yearly billing, ~2026-08-31 |
| Branch | `dev`, pushed to `origin` (public org repo) |
| Built | 6 explored directions + 1 hybrid, 7 pages, reviewed twice by 8 agents |
| Not built | The Astro site. No root `index.html`, so **nothing publishes yet** |
| Blocking | Real content (contact routes, dates, names, figures) — see §4 |

---

## 1. What exists on disk

```
mockups/
  index.html            chooser page, links all 7 directions
  a/  b/  c/            three primary directions (dark / paper / maroon)
  c.1/ c.2/ c.3/        three pushes on C (ascent / staging / inverted)
  final/                ← THE ONE TO CARRY FORWARD
    site.css            427 lines, tokenised, comments carry the reasoning
    site.js             mobile nav + video pause + responsive source selection
    data.js             vehicles[] and subteams[] — the file the team edits
    render.js           renders rocket.html / subteam.html from data.js
    index.html          home
    rockets.html        fleet index
    rocket.html         per-vehicle template  → rocket.html?v=osiris
    subteam.html        per-subteam template  → subteam.html?t=avionics
    members.html        roster
    join.html           recruitment  ← strongest page in the set
    sponsors.html       tiers, budget, logo band, contacts
  TODO-MANIFEST.md      what content is still needed, split by blocking/not

public/                 brand marks + hero video derivatives (shipped)
media-source/           hero-source.mp4 — ONLY COPY, now committed
inspiration/            gitignored: 35MB of other orgs' screenshots
.backup-pre-fix/        gitignored: mockups before the a11y pass
```

**The hybrid (`final/`) is:** direction C's editorial voice and honest data treatment,
on B's structural discipline, with C.2's closing panel as the standing CTA.

**Deliberately dropped and should stay dropped:** C's fixed altitude rail, C.2's sticky
stage machine, C.3's inverted scroll. All three were `display:none` below 900px — the
design admitting they were desktop-only. C.3 was additionally judged disqualifying by
the screen-reader reviewer.

---

## 2. Decisions locked

Robin's calls, made explicitly:

1. **Fix all six originals first, then build the hybrid.** Done.
2. **Placeholders only** — no inventing contact details, tiers, dates, or names.
   Everything unknown renders as a visible amber `TODO` badge.
3. **Stay static** for now; port to Astro after sign-off on the direction.
4. **Keep the unverifiable numbers, flag them** rather than deleting. Done — flags are
   now visible on-page, not just in code comments. *(See §4: the panel wants this
   overturned.)*
5. **Push to `dev`**, exclude the moodboard from the public repo.

Carried from the day-1 plan and still binding:

6. ~~Palette is McMaster Heritage Maroon `#7A003C`~~ — **superseded.** The design moved to
   a new system, tracked live at claude.ai/design ("McMaster Rocketry Design System",
   project id `3fe61467-ca14-4c72-80a1-d4bd7fe18e79`). Local
   `McMaster_Rocketry_Design_System_Spec.md` (gitignored) is the sync source for that
   project's `spec.md` — currently at **v1.1**. Current tokens: `--ignition #BF2026`
   plus a **true grayscale** scale (`--graphite-900 #1A1A1A` down to `--paper #F7F7F6`,
   every step R=G=B). Photographic/video heroes stay full colour with copy in `.herobox`
   (same panel as Osiris). Tagline is **"Get blasted"** (`site.json` `tagline`): home
   hero `.tag`, home document title, footer once — not on Join/Sponsors.
   `--altimeter` (green) and `--amber` are narrow utility colors (chart series/status
   dot, caution accent) restricted to non-text, non-decorative use.
   **Sync owed:** push local v1.1 `spec.md` into the claude.ai/design project (Claude
   Code `DesignSync` / `/design-sync`). Cursor cannot reach `api.anthropic.com` from
   this sandbox.
7. Accurate flight data, never marketing rounding.
8. Claude drafts non-technical prose only. Robin writes every spec, number and safety
   claim.

---

## 3. What the review found

Two rounds, 8 independent Opus reviewers. Full reports:

- Round 1 — https://claude.ai/code/artifact/3cfe7950-e623-48a1-8813-5db7708a88a9
- Combined — https://claude.ai/code/artifact/61ebe8e8-3d75-4571-9f52-b05b140898f5

Panel: UI/UX designer · corporate sponsor · prospective student · incoming webmaster ·
screen-reader user · faculty advisor · Launch Canada judge · parent at an open house.

**Round-one blockers — all closed:** no mobile nav anywhere; every CTA `href="#"`;
2.9 MB unpausable autoplay video; apogee chart unreadable below 600px; hover-only flight
data in A and B; keyboard focus rendering text at 1.00:1.

**Strongest cross-panel signal:** the faculty advisor, the competition judge and the
parent — three unrelated motives — independently demanded safety / supervision /
certification content, which appears **nowhere** across 14 pages. All three framed it the
same way: not a compliance chore, the site's biggest untapped credibility asset.

**Five regressions the fix round introduced**, all found by the designer's audit and all
now fixed. Worth knowing because they are the failure modes to watch for again:

- the focus fix was applied to `final/` and never back-ported to the C family
- the mobile chart's labels rendered *inside* the 10px bars
- the grid fix produced 5 columns for an 8-card grid — the same ghost cells one row down
- the 12px type floor landed after the mobile nav block and shrank it back
- `subteam.html` had no route to any subteam, and silently presented Avionics

---

## 4. Open decisions — need Robin

**Resolved 2026-08-25:** the team has no separate "Business & Outreach" subteam — Robin
confirmed that function sits under **Operations**, which now covers launch-day/range-safety
*and* sponsorship/budget/outreach. `data.js` dropped from 8 subteams to 7 and from 12 leads
to 9 (Business/Outreach/Finance leads collapsed into one Operations lead). Don't
reintroduce a standalone business/outreach/finance subteam.

**Two the panel wants overturned:**

- **Nimbus `18,000 ft`.** Four of eight reviewers called it the single most damaging item
  on the site: a round number in a column headed "Measured apogee", on a page that
  promises "we publish nothing rather than an estimate". Fix is 30 seconds — publish the
  flight-computer figure, or set `apogee:null` in `data.js` so it renders "No verified
  record" with the other three.
- **The T+ timeline** in the C variants. The judge showed the working: Max-Q is at
  burnout not T+6; coast to apogee is ~31 s not 8; descent is ~466 s not 138. Possible
  real implication — **if the airframe load case was applied at T+6 dynamic pressure, the
  structure was sized at the wrong q**, on a vehicle that then went through Mach 1.9.
  Worth checking in the sim regardless of what ships.

**Still undecided:**

- Deployment. Repo is `*.github.io` with no root `index.html` — publishes nothing today.
  Decide: Pages from `main` root, or a build workflow.
- ~~Whether `mockups/` stays in the repo long-term~~ — resolved 2026-08-25: the six
  rejected directions (`a/ b/ c/ c.1/ c.2/ c.3/`) and the chooser page are removed from
  the working tree, still recoverable from git history at commit `42970d2`. `final/`
  stays as the active build.
- Whether the moodboard (`inspiration/`) goes in — currently gitignored.
- Sponsorship: the advisor wants the "resume book" tier benefit removed or made opt-in,
  a named legal recipient for money, and tax wording from Financial Affairs.
- Affiliation line + whether to differentiate the palette so the site stops reading as an
  official university publication.
- Whether McMaster has a required analytics/privacy policy for club sites (cookie notice,
  data retention) that Google Analytics needs to comply with. See §0a.

---

## 5. Content still needed

Full list in `mockups/TODO-MANIFEST.md` (per-file counts there are now stale, see
2026-08-25 check-in above). The blocking ones:

| What | Where |
|---|---|
| ~~Real team email~~ — done, `rocketry@mcmaster.ca` | every page |
| Three sponsorship amounts — PDF has real ones, needs your call, see check-in | `sponsors.html` |
| Two named contacts | `sponsors.html` |
| Season budget figures | `sponsors.html` |
| Application form URL, info-session dates, application window | `join.html` |
| Answer to "do I need to pay anything?" | `join.html` FAQ |
| Nimbus apogee — real figure or mark unverified | `data.js` |
| ~~Member names~~ — in. Programmes, portraits + alt text | `src/data/members.json` |

⚠️ **Most dangerous placeholder class:** the 12 roster cards pair `TODO: name` with
**fully invented** programmes and years. `grep TODO` will never find those. Strip the
invented programme/year pairs before real names go in, or the site will confidently state
that someone is a 2nd-year in Communications when they aren't.

---

## 6. Technical gotchas — verified the hard way

Do not re-derive these:

- **`media` on `<source>` is ignored inside `<video>`.** It only works in `<picture>`.
  Responsive video must be selected in JS. `site.js` does this and respects
  `navigator.connection.saveData`.
- **Inline `style="height:N%"` beats a media query.** Drive sizing from a custom property
  instead — the chart uses `--pct`.
- **An appended fix-block silently overrides earlier media queries** at equal specificity.
  `site.css` lines ~372+ are exactly this trap; anything added there needs checking
  against the original declaration.
- **`auto-fit minmax(240px,1fr)` gives 5 columns at 1400px** — wrong for an 8-card grid.
  Explicit counts + hairlines on the cards, not on the container.
- **Safari + VoiceOver strips list semantics** from any `ul`/`ol` with `list-style:none`.
  Needs `role="list"`.
- **Focus ring:** white inner + near-black outer. No single colour clears 3:1 on paper,
  maroon *and* near-black. Note the outer ring is a `box-shadow` and gets clipped by
  `overflow:hidden` ancestors.
- **SVG duotone filters need an identity `feComponentTransfer`, not a color-remap one.**
  The hero video's grayscale filter (`index.html`, `filter#duo`) originally used a
  two-stop `type="table"` remap per channel to force a red/black duotone — this collapsed
  the whole video into one flat color wash, not legible footage. Fixed by making the
  transfer an identity function (`tableValues="0 1"`) so only the preceding luminance
  matrix runs, and doing red/black tinting in the `.heroveil` CSS overlay instead.
- **`section.paper` inversion needs 19 paired overrides.** Every new component needs a
  paper variant or it renders invisibly. The designer argued light-first would be mostly
  a deletion — worth considering before the Astro port hardens this.
- **Generic single-word classes collide across unrelated components.** `.card`, `.cta`,
  and `.tag` each get reused: `.cta` is both `CtaBand`'s section wrapper
  (`padding:clamp(56px,11vh,132px) 0`) and, briefly, a card-grid modifier that shipped
  with the wrong name. Two single-class selectors at equal specificity resolve by file
  order, not by which one looks like it should apply, so the later one silently won and
  blew up a card's padding. Grep the exact class name against all of `site.css` before
  reusing one, and prefer a compound name (`card-cta`, not `cta`) for any new card
  variant.

---

## 7. Next steps, in order

> **Partly superseded 2026-08-26.** Item 6 (the Astro port) is done, and the
> "Astro port notes" subsection below is now a record of what was built, not a
> plan. Items 1, 2, 4, 5 and 7 are still open. Current ordering lives in the
> dated check-ins at the top of this file.

1. **Answer the two overturn questions** (§4) — 30 seconds each, unblocks credibility.
2. **Write the safety / operations page.** Three reviewers, independently. Sanctioned
   launches and RSO authority, named faculty supervision, certification levels held,
   ground-test practice.
3. **Get a real email into the site**, plus the join form URL and dates. Ship `join.html`
   even if everything else stays placeholder — it is the product.
4. **One photograph of humans.** Highest-leverage single asset per the parent and student
   reviewers. Members page is the emptiest thing you have.
5. **Strip the invented member programmes/years** (§5 warning).
6. **Start the Astro port.** Notes below.
7. Fix the sponsorship commitments (§4), add the affiliation line.

### Astro port notes

- The seven files look like seven routes; `macrocketry-urls.txt` implies **~25**.
  `rocket.html` and `subteam.html` are *templates* — they become
  `src/pages/rockets/[slug].astro` and `src/pages/subteams/[slug].astro` over content
  collections.
- `data.js` is already the right shape. Move it to `src/content/` with a Zod schema —
  that turns a missing field into a **build error** instead of a badge that ships.
- Asset paths change: `../../public/media/hero.mp4` → `/media/hero.mp4`.
- **Keep:** the design tokens (contrast ratios are recorded in the comments and are real
  work), `site.js` as-is, the `.nodata` / "empty slot beats a guess" model, and all the
  a11y work — a Tailwind rewrite starting from the visuals will drop most of it.
- Add a CI step that fails the build on the string `TODO`.
- **Data model gap:** there is no way to say a vehicle *failed* or *did not fly*. Add
  `status: flew | failed | scrubbed | in-build`. The blanket "No verified record" reads
  as sloppy record-keeping rather than a hard year, and the judge wants three *different*
  honest reasons rather than three identical hedges.

---

## 8. Ideas worth stealing from the review

- **Publish the raw flight CSVs**, and consider **sonifying** a flight profile. A
  competition judge and a blind developer arrived at this independently — it serves a
  technical audience, an accessibility audience and sponsors at once, and almost no
  student team does it.
- **Lead with the delta, not the altitude.** "31,200 predicted. 33,584 flown. We publish
  the gap." A single number gets beaten by a rival with one flight; a prediction-vs-actual
  record only improves. Companion stat: `33,584 ft — highest flown` beside
  `456 ft — closest to a declared target`.
- **Both competitions score against a declared target**, not maximum altitude. The site
  never says so, which makes 33,584 read as an unexplained 12% overshoot to anyone who
  knows, and as an unjudgeable number to everyone else.
- **A "Parents & families" link** — cost, time, safety. Parents find it, students ignore
  it, nobody has to compromise the hero.
- **Write up the two failures you already have**: Luminis → V2, and the Nimbus recovery
  rewrite (single baro trigger → voted decision across three sensors). The judge called
  that second one the most technically substantive sentence on the site; it currently gets
  21 words under a paragraph flagged for deletion.

---

## 9. Working notes for the next session

**No longer two agents in parallel.** `PARALLEL.md` (the split, file locks,
and "go" instructions for Claude Code and Cursor) is deleted as of
2026-08-26: Cursor's role narrowed to image manipulation only (fleet
cutouts, cropping), so the page/content work that file split between two
agents is Claude Code's alone now.

Robin is moving to a Sonnet + Opus-advisor pattern for token efficiency.

- **Sonnet can safely do:** the Astro scaffold, porting markup, filling content into the
  existing structure, mechanical refactors, wiring `data.js` into collections.
- **Escalate to Opus for:** anything touching contrast or accessibility semantics (the
  panel found five regressions in a fix round that looked fine), the flight-physics
  content, and the sponsorship/policy wording.
- **Do not re-derive §6.** Those cost real time to find.
- **Always have a reviewer verify fixes rather than assuming them.** The single most
  useful thing in this whole exercise was an agent auditing the fix round and finding five
  regressions that had been reported as done.

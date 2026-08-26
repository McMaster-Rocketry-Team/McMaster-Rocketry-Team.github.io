# MRT site rebuild — progress and handoff

**Last updated:** 2026-08-25 (check-in) · branch `dev` @ `42970d2`

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

## 0. Where we are

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
   project id `3fe61467-ca14-4c72-80a1-d4bd7fe18e79`) — check that project's `spec.md`
   before assuming the palette below is still current, the local
   `McMaster_Rocketry_Design_System_Spec.md` copy in the repo root goes stale.
   Current tokens: `--ignition #BF2026` (brand red, deliberate accents only) plus a
   **true grayscale** scale (`--graphite-900 #1A1A1A` down to `--paper #F7F7F6`, every
   step R=G=B). The live spec's own neutrals are red-leaning ("warm graphite"); Robin
   overrode that on 2026-08-25 because it read as brown/muddy in practice — palette
   stays strictly red/white/black, keep the override even if the spec still says warm
   graphite. `--altimeter` (green) and `--amber` are narrow utility colors (chart
   series/status dot, caution accent) the spec restricts to non-text, non-decorative use.
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
| Member names, programmes, portraits + alt text | `members.html` |

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

---

## 7. Next steps, in order

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

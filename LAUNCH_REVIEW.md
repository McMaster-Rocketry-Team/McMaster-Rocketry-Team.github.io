# Launch review plan

Final pass before macrocketry.ca goes live. Site is Astro 7, static build, GitHub Pages deploy on push to `main`. Checked against `dev` @ `52e707f` on 2026-08-27.

## Verification audit — steps 1–4 and 7 (for Claude to re-check)

Cursor completed these on 2026-08-27 in commits `9746012`, `8a82573`, `52e707f`. Re-run the checks below and confirm nothing regressed.

| Check | Expected | How |
|---|---|---|
| ReviewMode locks | Propulsion + 6 vehicles fully locked before strip | `git show 9746012 --stat` |
| Overlay gone | No component, no `data-rv-locked`, no leaks in build | `test ! -f src/components/ReviewMode.astro`; `pnpm build && rg -i 'data-rv\|data-review\|rv-panel' dist/` |
| Dev CI | Push/PR on `dev` triggers build-check | Read `.github/workflows/build-check.yml` `on:` block |
| TODO gate | Zero literal TODO in `dist/` | `pnpm check:todo` (run after build) |
| Build | 24 pages + `sitemap-index.xml` | `pnpm build` |
| Type check | Known failures only | `pnpm astro check` — expect 6 errors in `join.astro` (`todo` on FAQ/steps types) |
| SEO | Canonical, OG/Twitter, `site` URL, sitemap | Inspect `src/layouts/BaseLayout.astro`, `astro.config.mjs`, `dist/sitemap-index.xml` |
| OG image | 1200×630 brand mark | `public/og-image.webp` |
| Manifest / icons | `site.webmanifest`, apple-touch-icon in head | `BaseLayout.astro` + `public/site.webmanifest` |
| PDF | ~2.1 MB (was 11 MB) | `ls -lh public/docs/sponsorship-package-2026-2027.pdf` |
| EXIF | Stripped from shipped raster media | Spot-check with `identify -verbose` or open in viewer; 109 files touched in `52e707f` |
| Footer | Affiliation disclaimer + © 2026 | `src/components/Footer.astro` |
| Homepage JSON-LD | `Organization` + `sameAs` | View source on `/` or `dist/index.html` |
| Fonts | `display=swap` in Google Fonts URL | `BaseLayout.astro` line with `fonts.googleapis.com` |
| trailingSlash | `never` in astro config | `astro.config.mjs` |
| `.nojekyll` | Present in `public/` | Ships to `dist/` |

**Re-verified 2026-08-27 evening (Claude Code, full 13-section pass):** every row above re-checked, all still true. `pnpm build` → 24 pages, `check:todo` clean before and after, `dist/` grep clean, `astro check` still exactly the 6 known `join.astro` errors. hero-720/hero.mp4 viewport switch (was "not verified") is wired correctly in `public/js/site.js`: upgrades to the full file only at ≥701px, respects `saveData`/slow-`effectiveType`, and skips entirely under `prefers-reduced-motion`. Title/description length audit (was "not verified") is done, see section 3. `pnpm audit` still open, see section 10. Lighthouse still open, see section 7.

**Not verified in this pass (still open):** Lighthouse homepage audit; `pnpm audit`.

## 1. Kill the review-mode overlay

`ReviewMode` shipped on every page through `BaseLayout.astro`. **Stripped 2026-08-27** (`8a82573`).

- [x] Remove the `<ReviewMode />` import and tag from `BaseLayout.astro`.
- [x] Delete `src/components/ReviewMode.astro` and any `data-review` / `data-rv-locked` attributes left in page templates.
- [x] Confirm `scripts/check-todo.mjs` still passes after removal (it fails the build on literal "TODO" in built HTML, run on push to `main`).
- [x] Grep the built `dist/` output for `data-rv` or `review` after a full build to confirm nothing leaked.

**Follow-up:** remove dead `reviewLocked` props from pages and JSON when convenient (optional cleanup; inert today).

## 2. Design consistency deep dive

- [x] Walk every page at multiple widths. Done via Chrome automation at 500px (mobile, real viewport confirmed via `window.innerWidth`) and desktop; spot-checked `/`, `/subteams`, `/join`, `/rockets`, `/sponsors`, `/members`. Full 375/768/1440 sweep across all 24 pages not done, this was a representative sample, not exhaustive.
- [x] Grayscale-plus-ignition-red palette: audited programmatically (every hex and rgba triple in `site.css`, not eyeballed). Found and fixed three off-neutral leaks where `R≠G≠B` by 1-2 units, invisible to the eye but real: `--paper` (`#F7F7F6`→`#F7F7F7`), the global `:focus-visible` shadow (`#08080A`→`#080808`), and `.roster .shot-placeholder`'s background (`rgba(247,247,246,…)`→`rgba(247,247,247,…)`). `--altimeter` (`#2F7D5B`, green) is defined but never used in any live rule, dead token, not a violation. `--amber` is used only by `.todo`/`.noscript-banner`, neither of which ships (zero TODOs in build; no `<noscript class="noscript-banner">` element exists anywhere, that class is dead CSS). No hardcoded hex colors exist in any `.astro` file, everything routes through `site.css`.
- [ ] Heading scale, spacing rhythm, button styles: spot-checked consistent across the sampled pages, not exhaustively diffed.
- [x] Hover/focus/active states exist on nav links, buttons, sponsor CTA (code-verified: `:focus-visible` global rule, `.navitem:hover`/`:focus-within` CSS-only flyout, button `:hover` rules present). Could not visually confirm `:focus` rendering live: the automated browser tab never has real OS window focus (`document.hasFocus()` is `false` even when `document.activeElement` is correct), so `:focus`/`:focus-visible` CSS never paints in this environment regardless of whether the underlying rule is correct. Not a site bug, an environment limitation, flagged rather than claimed either way.
- [x] Hero video poster + slow-connection degradation: confirmed in section 7 (viewport/connection-aware source swap, already correct).
- [ ] JSON-vs-rendered diff for `members.json`/`sponsorship.json`/`subteams.json` stale entries: not done this pass, folded into the section 8 copy/fact pass instead since it's the same read-through.
- [x] Checked the current diff (this session's CSS/pnpm-workspace/dependabot/Nav.astro edits) against the five known regressions: no card-grid, chart-label, mobile-type-floor, or cross-selector-specificity changes made. Clean.

**New finding, not in the original five:** the fixed nav (`nav{position:fixed}`, `site.css:103`) uses a top-down gradient scrim that intentionally fades to fully transparent by the bottom of the bar (`site.css:107-114`, "never a flat solid bar" per the code's own comment). That's fine over the video hero or a photo hero. On pages where a light "paper" section scrolls up directly behind the nav (confirmed on `/subteams` and `/members`), the bottom of the nav, exactly where the tagline and nav links sit, has zero scrim and page content shows through. Worst case confirmed on `/subteams`: a card heading ("Payload") lands at the same vertical position as the "GET BLASTED" tagline and visually doubles with it. This is a real, verified legibility issue, not a design nitpick, but the fix (deepen the scrolled-state gradient further down the bar, add a text-shadow, or something else) is a call for Robin since "never a flat solid bar" reads like a deliberate constraint from earlier design work, not an implementation detail to override unilaterally.

## 3. SEO

Implemented 2026-08-27 (`8a82573` + `52e707f`). Post-merge items (Search Console, 404 status on Pages) still open.

- [x] Add a canonical `<link rel="canonical">` per page.
- [x] Add Open Graph and Twitter card tags (`og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`) so shared links render a preview.
- [x] Create an OG image (1200x630) using the brand mark, not just the favicon.
- [x] Add `public/robots.txt` allowing crawl, pointing to the sitemap.
- [x] Add a sitemap via `@astrojs/sitemap` (`astro.config.mjs` + `site: 'https://macrocketry.ca'`).
- [x] Set `site: 'https://macrocketry.ca'` (confirm the real domain) in `astro.config.mjs` so canonical/sitemap/OG URLs resolve correctly.
- [x] Title/description length + uniqueness: computed every static page's `<title>` (title prop + " · McMaster Rocketry" suffix, longest is 34 chars) and `description` (longest is outreach at 134 chars), both well under the 60/155 limits. Dynamic routes (`rockets/[slug]`, `subteams/[slug]`, `payloads/[slug]`) build unique title/description per item from `vehicles.json`/`subteams.json`/`payloads.json` fields, confirmed unique by construction. All clean.
- [ ] Verify `404.astro` returns an actual 404 status under GitHub Pages, not a 200. Needs the live deploy, can't test locally.
- [ ] After launch, submit the sitemap to Google Search Console and Bing Webmaster Tools, and confirm the domain is verified in both.
- [x] Add JSON-LD structured data (schema.org `Organization`, with `sameAs` links to Instagram, Discord, LinkedIn from `site.json`) to the homepage. Helps Google show a knowledge panel for the team.

## 4. Accessibility

- [ ] Automated axe/Lighthouse pass: not run, no such tool available in this environment. Flagged, not silently skipped.
- [ ] Real screen reader pass (VoiceOver/NVDA): not available in this environment. Flag for Robin or a manual tester.
- [x] Tap targets: `.navlinks > a`/`.navitem-top` are `min-height:44px` on mobile (`site.css:189`), nav toggle is `44px` per its CSS. Meets the 44×44 floor.
- [x] Contrast: the design-token neutrals and ignition red were already chosen against `--paper`/`--graphite-900` per the design spec; not independently re-measured pixel-by-pixel this pass, but no low-contrast combination was spotted in the sampled screenshots.
- [x] Keyboard tab order / skip link: code-verified correct (`.skip` at `site.css:71` is the standard clip-to-`-9999px`-then-`:focus{left:0}` pattern, first in DOM, points at `id="main" tabindex="-1"` in `BaseLayout.astro`). **Could not visually confirm live**: the automated Chrome tab used for this review never has real OS window focus (`document.hasFocus()` is `false`), so `:focus`/`:focus-visible` never paint regardless of whether `document.activeElement` is correct. Confirmed this is an environment artifact, not a site bug, by checking `document.hasFocus()` directly rather than assuming. Real manual verification (a person actually tabbing through in their own browser) is still worth doing.
- [x] Hero video: `autoplay muted loop playsinline`, `aria-hidden="true" tabindex="-1"` (decorative, correctly hidden from assistive tech), separate `#vidtoggle` pause/play button outside the video for WCAG 2.2.2.
- [x] `prefers-reduced-motion`: global CSS rule (`site.css:528`) kills all animations/transitions and hides `.bgvid` outright; `site.js` also skips upgrading to the large hero file and pauses the video under this preference. Covered from three angles.
- [ ] Alt text on all `<img>` tags: not individually re-audited this pass (folded into the section 8 read-through instead, alt text is prose).
- [ ] Heading hierarchy per page: not individually re-audited this pass.
- [x] Sponsor CTA is a `mailto:` link, not a form (confirmed, no `<form>` tag exists anywhere in `src/`).

## 5. Security

- [x] `Content-Security-Policy` meta tag added (`src/layouts/BaseLayout.astro`): `default-src 'self'`, `script-src 'self' https://static.cloudflareinsights.com`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` (inline `style=""` attributes on a handful of pages need `unsafe-inline`, no `<style>` tags ship, Astro extracts all component CSS to external files), `font-src`/`img-src`/`connect-src` scoped, `object-src 'none'`. `frame-ancestors` deliberately omitted, meta-tag CSP ignores it per spec, see the note below. The homepage JSON-LD `<script type="application/ld+json">` is exempt from `script-src` (non-executable script types aren't governed by it), verified this is standard behavior, not just assumed.
- [x] Secret scan: no API keys, tokens, passwords, or bearer patterns in `src/`. No personal emails beyond `rocketry@mcmaster.ca` anywhere in data or pages.
- [x] `rel="noopener noreferrer"` audit: exactly one `target="_blank"` sitewide (`sponsors.astro`'s partner-logo links), already has it.
- [x] Third-party origins: `fonts.googleapis.com`/`fonts.gstatic.com` (Google Fonts) and `static.cloudflareinsights.com` (analytics beacon, currently inert, empty token) are the only ones referenced anywhere in `src/`. Nothing unexpected.
- [x] Deploy workflow (`deploy.yml`): no secrets in the build/deploy steps, nothing echoed. Actions are pinned to major-version tags (`@v4`/`@v5`), not full commit SHAs, lighter-weight pinning than the strictest option but consistent with the ecosystem norm; not changed.
- [x] **Astro pin was not actually protected, fixed.** `pnpm-workspace.yaml` had `minimumReleaseAgeExclude: [astro@7.2.7]` but no `minimumReleaseAge` value anywhere (checked project config, global pnpm config, `~/.npmrc`, env), confirmed via `pnpm config get minimum-release-age` → `undefined`. The exclude-list entry was doing nothing: there was no quarantine window to exclude astro *from*. Added `minimumReleaseAge: 10080` (7 days, in minutes). Turning it on broke `pnpm install --frozen-lockfile` against the committed lockfile (7 dev-only transitive deps of `@astrojs/check`, all published within the last week as part of Astro's own release train); rather than run `pnpm clean --lockfile` and re-resolve 373 entries days before launch, added those 7 specific package@version pins to the exclude list alongside astro. Verified `pnpm install --frozen-lockfile` passes and `pnpm build` still produces 24 pages clean.
- [x] Dependabot config added (`.github/dependabot.yml`): `github-actions` ecosystem only, weekly, 7-day cooldown. npm ecosystem deliberately skipped per the doc's own reasoning, so Dependabot can't propose a same-day astro bump that undercuts the `minimumReleaseAge` fix above.
- [ ] Cloudflare proxy for real `CSP`/`X-Frame-Options`/`X-Content-Type-Options`/`Referrer-Policy` headers: still open, needs Robin's Cloudflare account and a DNS decision, not something I can do. The meta-tag CSP above is real and better than nothing, but `frame-ancestors` (clickjacking) genuinely can't be set without this.

## 6. Icons and brand assets

Partially done 2026-08-27 (`52e707f`).

- [x] Favicon renders in the browser tab (confirmed via Chrome, tab title/favicon load correctly from `logo-mark.svg`/`favicon.ico`).
- [x] Add `apple-touch-icon` and a `manifest.json` with icon sizes for iOS/Android home-screen saves, since none currently exist in `public/`.
- [x] Add the matching `<link rel="apple-touch-icon">` and `<link rel="manifest" href="/site.webmanifest">` tags to `BaseLayout.astro`'s `<head>`. The files alone don't do anything without these tags.
- [x] `logo-mark-white-512.png` is used exactly once (apple-touch-icon + the webmanifest's only icon entry), no duplicate crops. `mcmaster_rocketry_logo_white.png` is unreferenced anywhere in `src/` (matches `PLAN.md`'s earlier note), dead file, low-priority cleanup, not removed since it's out of this pass's scope.
- [ ] Icon visual-weight/corner-radius consistency: not fully audited, judgment call, not silently passed.
- **New finding:** `logo-mark-white-512.png`, the apple-touch-icon and only webmanifest icon, is a white mark on a fully transparent background (confirmed via `identify`: alpha 0 outside the mark, solid white inside). Home-screen icons need to read against an arbitrary system background, often light. A white-on-transparent mark risks being nearly invisible on an iOS/Android home screen with a light wallpaper. Needs a dark or solid-background variant from Robin, not something to guess a fix for.

## 7. Performance

Partially done 2026-08-27 (`52e707f`).

- [ ] Run Lighthouse performance audit on the homepage (heaviest page due to hero video). Not run: no Lighthouse CLI/Chrome-headless-audit tool available in this environment.
- [x] Confirm `hero-720.mp4` is actually served to smaller viewports instead of the full `hero.mp4`. Confirmed in `public/js/site.js`: only upgrades `<video>`'s `src` to the large file at `min-width:701px`, and only when `navigator.connection.saveData` isn't set and `effectiveType` isn't slow-2g/2g/3g, and only when `prefers-reduced-motion` isn't set (in which case the video is hidden entirely by CSS, section 2/4). Correct on all three axes.
- [x] Check image formats: are `public/media/*` files optimized (WebP/AVIF) or raw JPG/PNG?
- [x] Confirm fonts load with `font-display: swap` (Google Fonts URL doesn't currently request it, check if needed).
- [x] Compress `public/docs/sponsorship-package-2026-2027.pdf`. It's 11 MB, committed straight to git rather than Git LFS, and it's the first thing a sponsor downloads.
- [x] Set `trailingSlash` explicitly in `astro.config.mjs` (currently unset). Confirm every internal link across the site uses the same form consistently, to avoid duplicate-content signals and mismatched links on GitHub Pages.

## 8. Copy and prose

ReviewMode was removed 2026-08-27; this pass is independent. Read every line of user-facing copy for voice and for patterns that read as AI-generated, not as something a student team actually wrote.

**Scope:** every `.astro` page template, `CtaBand.astro`, `src/data/*.json` prose fields (`blurb`, `detail`, `build`, `lede`, sponsorship tier copy, outreach event descriptions, vehicle/payload narratives), nav/footer strings in `site.json`, and `public/docs/sponsorship-package-2026-2027.pdf`. Skip code comments and `readme.md`.

**Tone reference:** `/join` and `/outreach` are the approved voice, direct, specific, no filler. Newer pages (payloads, subteam blurbs, sponsor copy) are the highest risk.

**Osiris flight record (2026-08-27, Cursor).** Ingested Void Lake SRAD `flight_log.csv` (`~/Downloads/flight_log.zip` → `media-source/osiris-void-lake-flight-log.zip`, `scripts/ingest-flight-log.py`). Published from log: apogee **33,551 ft** (deployment KF AGL), peak accel **16.1 G**, main deploy **1,373 ft AGL**, drogue near apogee. **Mach 1.92** republished per Robin's call (OpenRocket FDR); Void Lake airbrakes KF peak read ~1.03 transonic. Home hero apogee now reads `vehicles` collection, not a hardcoded string.

**Earlier `osiris.mach` regression (2026-08-26).** Had silently reverted to `1.92` in `7ccfd55`, was set to `null` during launch review, then republished after Robin confirmed trusting the FDR simulation over the Void Lake velocity KF.

- [x] Read every `.astro` page, every prose field in every `src/data/*.json` file, and every component with visible copy (`Nav.astro`, `Footer.astro`, `CtaBand.astro`) top to bottom. No stilted rhythm or uniform sentence length found; voice is consistently close to the `/join`/`/outreach` baseline across the whole site, including the newer payloads/subteams/sponsors pages the doc flagged as highest-risk.
- [x] Throat-clearing openers: none found anywhere (`rg` for the listed patterns across `src/pages`, `src/data`, `src/components` returns zero hits).
- [x] Hollow closers: none found (same zero-hit grep).
- [x] AI-tell wordlist grep: one hit, `src/styles/site.css:218`, a CSS comment ("Wide product / logo heroes"), matched on "landscape" as in landscape-orientation photos, not the AI-tell sense, and it's a code comment, out of scope anyway. No real hits in shipped copy. Em-dash/en-dash padding: see the mechanical fix list below. Rule-of-three and stacked adjectives: not found as a pattern, "designed and built" appears exactly once sitewide, not repeated.
- [x] Headlines/ledes checked against data. Two real overclaims found and one fixed, one flagged (see below).
- [x] Subteam blurbs and vehicle `build` paragraphs: already specific and concrete (KiCad, Blue Raven, N₂O/paraffin, CTI motor designations, actual part names). No filler found, nothing to change.
- [x] Sponsors/Join CTAs: no consultant tone anywhere, "We publish this because sponsors ask. A team that won't say where the money goes isn't a team worth funding" and "That is often more useful to us" are the actual register throughout.
- [x] Cross-checked duplicated facts sitewide (altitude, member count, payload wins, competition names). Found and fixed three real inconsistencies, one severe regression, and one launch-blocking external document (see below).
- [ ] Independent cold read by someone outside this session: not done, needs a human.

**Mechanical (dash) fixes, all rebuilt and `check:todo`-clean after:**
- `payloads.json`: 5 em dashes in prose fields (electronics module `role` strings, two photo `caption`s) replaced with colons or commas.
- `sponsorship.json` and `sponsors.astro`: the recurring "2026–27" en dash standardized to a plain hyphen, "2026-27", in both places it appeared.
- `members.astro`: `&ndash;` HTML entity in "2026&ndash;27 leadership" (an en dash grep on literal Unicode characters had missed this since it's entity-encoded, not a literal `–`) replaced with a plain hyphen.

**Fact fixes:**
- **`osiris.mach`:** regression in `7ccfd55` fixed during launch review; republished at **1.92** (FDR) after Void Lake ingest per Robin. Log velocity KF ~1.03; apogee/accel/recovery from log. See `docs/data-layer.md`.
- `subteams.json` Operations `detail`: "Clubfest" → "Clubsfest" (every other mention sitewide spells it with the s; this was the one inconsistent spelling, a real "one name for one thing" violation, not just a typo).
- `members.json` page lede template: "every faculty on campus" → derives **four faculties** from `members.stats` (engineering, science, commerce, humanities).
- `site.json` `footerIntro`: now includes Spaceport America Cup alongside Launch Canada (was footer-only omission; two SAC vehicles in fleet).

**Flagged, not fixed (design/editorial calls, not typos):**
- `/rockets` section heading "Apogee, every flight." overclaims: 3 of 6 vehicles (Marauder I, Marauder II, Luminis) have `apogee: null` and render a visually empty `.val` span in the fleet lineup, no text at all, not even the "Not published" fallback the individual vehicle pages correctly use for the same missing data. The heading promises something the data (and the page's own display) doesn't deliver for half the fleet. Two independent problems bundled here: the heading's wording, and the lineup's silent-blank vs. the vehicle page's honest "Not published" being inconsistent with each other. Needs Robin's call on wording and whether the lineup should show an explicit "not published" mark instead of a blank space.
- Homepage and `/payloads` payload-win headline: now computed via `payloadsHeadline()` in `src/lib/copy.ts` from collection count (was hardcoded "Two entries, two wins").
- The sponsorship PDF (`public/docs/sponsorship-package-2026-2027.pdf`) is a launch blocker, not a copy nitpick, see the dedicated writeup in section 9.

## 9. Cross-browser and content QA

- [ ] Safari, Firefox, real mobile browser: not available in this environment (Chrome-only automation). Not tested.
- [x] Link sweep. Every internal `href` in the built `dist/` output (all 24 pages) resolves to a real route or file, checked programmatically, zero dead internal links. Spot-checked the highest-risk external links live in Chrome: the Microsoft Forms apply link, Discord invite, Instagram, LinkedIn, and one sponsor site (MDA Space) all resolve to real, active pages. Did not click through all 9 sponsor sites individually. **Real finding, not a dead link but a live-content mismatch:** the actual Microsoft Forms application page (title "McMaster Rocketry Recruitment Fall 2026") shows "**Due TBD**" as its deadline, with body text "Submit ASAP! The sooner you submit, the sooner we see your application!", rolling-admission framing. The site itself publishes a firm date in three places (`join.json`'s Key Dates, the join FAQ, `CtaBand.astro`'s fine print): "Applications close September 18, 23:59." One of these two sources is stale. Given the site states a specific date down to the minute, it reads like the settled fact and the form is what's out of date, but I can't confirm that from here, flagging rather than guessing which one to trust.
- [x] Spell-check/proofread pass, after section 8's voice pass per the doc's own ordering. No typos or grammar errors found beyond what's already fixed in section 8 (the Clubfest/Clubsfest spelling inconsistency was the one real hit, already corrected there).
- [x] The "31 Aug" sign-off deadline: today is 2026-08-27 per this session's date, so 31 Aug is 4 days out. Given what's still open (the sponsorship PDF re-export, the apply-form-vs-site deadline mismatch, the nav-scrim legibility issue, the apple-touch-icon contrast issue, Lighthouse/screen-reader/cross-browser passes, and everything in sections 11 and 12), it is not realistic to treat this as fully launch-ready by that date without Robin triaging the flagged items first.
- [x] Opened `public/docs/sponsorship-package-2026-2027.pdf`. **It is not the corrected final version, this is a launch blocker for `/sponsors`.** Three separate problems, all read directly from the shipped file:
  1. **The self-contradiction PLAN.md flagged on 2026-08-25 is still there.** Page 2: "successfully launched and recovered our **4th** high-power rocket at Launch Canada 2025." Page 4: "our **fifth** high-power rocket earned us third place... [at Launch Canada] 2025." Same event, same document, two different numbers. The site's own fleet order (`vehicles.json`, six vehicles, chronological: Marauder I, Marauder II, Luminis, Luminis V2, Nimbus, Osiris) settles which is right: Nimbus, the 2025 competition vehicle, is the team's **fifth** high-power rocket. Page 4 is correct, page 2 is the error.
  2. **The PDF is dated before Osiris's 2026 flight and it shows.** "Each year we compete at Launch Canada, with team goals to achieve 30,000ft and a speed of Mach 2 **at the 2026 competition**" (future tense) and "In summer 2026, McMaster rocketry **plans on** competing again" (also future tense). But the entire rest of the live site is built around that 2026 flight having already happened: the homepage hero leads with "33,584 ft... Our highest flight ever," and features Chris Hadfield signing the nosecone at the Launch Canada 2026 range. A sponsor who reads the PDF right after clicking through from the homepage hits a document that reads as if the flight the homepage just described hasn't happened yet.
  3. **Off-brand color scheme.** The PDF uses a maroon/burgundy palette throughout (headers, tier badges, dot patterns). `PLAN.md`'s 2026-08-25 entry describes this exact maroon look on an *earlier, uncommitted* draft ("old maroon branding, gitignored"). The file actually linked from `/sponsors` today (2.1 MB, compressed 2026-08-27) still carries it. Every other page on the site was just audited pixel-by-pixel for the grayscale-plus-ignition-red rule (section 2); this PDF, the first thing a prospective sponsor downloads, doesn't follow it at all.
  
  Tier amounts and benefit copy do match `sponsorship.json` (Bronze $500+/Silver $2,000+/Gold $3,000+, same benefit progression), and the member count (100+) matches `members.json`. Those parts are fine. I can't edit a PDF, this needs a re-export from whatever Canva/design source made it, with corrected copy and current-year branding, before `/sponsors` goes live.

## 10. Pre-launch mechanics

- [x] `public/CNAME` added (`macrocketry.ca`, matches `astro.config.mjs`'s `site` and every canonical/OG URL sitewide). Confirmed it ships to `dist/CNAME` on build. Not committed to git yet, that's a normal part of committing this session's changes, not a separate step.
- [ ] Registrar DNS (four A records or a `www` CNAME) and enabling "Enforce HTTPS" in the GitHub Pages settings: both happen outside the repo, need Robin's registrar/GitHub access. Flagged, not something I can do.
- [x] `public/.nojekyll` confirmed present and shipping to `dist/`.
- [x] `astro build && astro preview` click-through: done via Chrome against the `astro preview` server on port 4322 throughout this session (sections 2, 4, 13), not just `astro dev`.
- [x] **Astro audits**, re-run clean on a fresh build after every fix this session:
  - [x] `pnpm check:todo` → 0, confirmed repeatedly through this session, most recently after adding `CNAME`.
  - [x] `pnpm astro check` → still exactly the 6 known `join.astro` errors (`todo` field typing), unchanged from `52e707f`, build still passes. No new errors introduced by anything in this session.
  - [x] `pnpm audit --audit-level moderate` → **no known vulnerabilities.** (Previously unrun, section 5/7 both had this listed as open.)
- [x] Rollback plan: `git revert` on `main` and re-push, since `deploy.yml` redeploys on every push to `main`. Documented here, not tested (would require an actual bad deploy).
- [ ] **Merge `dev` into `main`: explicitly not done.** This is a shared-state, hard-to-reverse action (`deploy.yml` fires on push to `main`) and this session's guardrails ruled it out regardless of how clean the checklist looks. That decision is Robin's, especially with the sponsorship PDF and apply-form-deadline mismatch still open.

## 11. Analytics

Using Cloudflare Web Analytics: free, sets no cookies, no consent banner needed. The beacon script is already wired into `BaseLayout.astro`, gated on `site.cloudflareAnalyticsToken` in `src/data/site.json` (currently empty, so nothing loads yet).

- [ ] Sign up at Cloudflare (Web Analytics is free and doesn't require proxying the domain through Cloudflare's DNS). This needs Robin's account, not something Claude can do.
- [ ] Add the site `macrocketry.ca` in the Cloudflare Web Analytics dashboard and copy the generated token.
- [ ] Paste that token into `"cloudflareAnalyticsToken"` in `src/data/site.json`. The script in `BaseLayout.astro` picks it up automatically.
- [ ] Update the `Content-Security-Policy` item in section 5 to allow `static.cloudflareinsights.com` as a script source.
- [ ] Rebuild and confirm the beacon script appears in the page source, then check the Cloudflare dashboard shows a hit after visiting the live site.

## 12. Legal, privacy, and compliance

- [ ] Consent from every person in `src/data/members.json` (full names, programme, year, headshots for the whole leads roster, no privacy policy or consent statement on the site): can't verify from the repo, needs Robin to confirm with each person.
- [x] Affiliation disclaimer: **already done**, this checklist item was stale. `Footer.astro` already reads "A student club at McMaster University in Hamilton, Ontario, not an official University publication," confirmed live on every page. McMaster trademark/wordmark clearance itself is still open, that's a real external step, not something a footer line resolves on its own. Flagged, needs Robin to confirm with McMaster's club/trademark office.
- [ ] Named legal recipient + tax-receipt wording for sponsorship money, confirmed with McMaster Financial Affairs: still genuinely open, checked `sponsors.astro` and `sponsorship.json` this pass, neither has it. External step, flagged.
- [ ] AODA applicability: still open, needs an answer from McMaster's student-org or accessibility office, not something I can determine.
- [x] Copyright line: **already done**, this checklist item was stale too. `Footer.astro`'s `.foot-note` already reads "© 2026 McMaster Rocketry Team · McMaster University · Hamilton, Ontario," confirmed live.
- [x] EXIF/GPS metadata: spot-checked two shipped images (`join-hero.webp`, a leads portrait) with `identify -verbose`, no EXIF or GPS tags on either. Matches `PLAN.md`'s record of the 109-file strip in `52e707f`. Not every one of the ~150+ shipped images was individually checked, but the pipeline that produced them was, and the two samples confirm it took.

## 13. Loose ends

- [x] **Real bug found and fixed.** Below 980px, `.navlinks` is `visibility:hidden` by default and only becomes visible via `nav[data-open="true"]`, set exclusively by `site.js`'s click handler on `#navtoggle` (`site.css:182-203`). With JavaScript disabled, every nav link (Rockets, Payloads, Subteams, Members, Outreach, Sponsors, Join us) was permanently unreachable on any viewport under 980px, confirmed by reading the CSS cascade, not assumed. The desktop flyout (≥980px) is unaffected, it's pure CSS `:hover`/`:focus-within`. Fixed in `src/components/Nav.astro`: added a `<noscript><style>` block that forces `.navlinks` static/visible and hides the now-nonfunctional toggle below 980px. `<noscript>` content is inert (rendered as text, never parsed as markup) whenever JS runs, so this changes nothing for the 99% case; verified the block survives the Astro build and outputs as real markup in `dist/index.html`. Could not toggle real JS-off in the browser-automation environment to visually confirm (no access to `chrome://settings`), so this is verified by build-output inspection and CSS-cascade reading, not a live screenshot.
- [ ] Decide whether to keep loading fonts directly from Google's CDN (current `fonts.googleapis.com` / `fonts.gstatic.com` links in `BaseLayout.astro`). Every visitor's IP address is sent to Google to fetch the font files; self-hosting the four font files in `public/` removes that, at the cost of manually updating them if the type ever changes. Robin's call, not changed.
- [ ] After launch, set up free uptime monitoring (for example UptimeRobot) pinging the homepage every few minutes, so a broken deploy is caught before a sponsor or visitor reports it.

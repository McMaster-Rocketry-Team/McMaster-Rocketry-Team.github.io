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

**Not verified in this pass (still open):** Lighthouse homepage audit; manual hero-720 vs hero.mp4 viewport switch; title/description length audit per page; `pnpm audit`.

## 1. Kill the review-mode overlay

`ReviewMode` shipped on every page through `BaseLayout.astro`. **Stripped 2026-08-27** (`8a82573`).

- [x] Remove the `<ReviewMode />` import and tag from `BaseLayout.astro`.
- [x] Delete `src/components/ReviewMode.astro` and any `data-review` / `data-rv-locked` attributes left in page templates.
- [x] Confirm `scripts/check-todo.mjs` still passes after removal (it fails the build on literal "TODO" in built HTML, run on push to `main`).
- [x] Grep the built `dist/` output for `data-rv` or `review` after a full build to confirm nothing leaked.

**Follow-up:** remove dead `reviewLocked` props from pages and JSON when convenient (optional cleanup; inert today).

## 2. Design consistency deep dive

- [ ] Walk every page (`index`, `join`, `members`, `sponsors`, `outreach`, `404`, and the subteam pages) at three widths: 375px, 768px, 1440px.
- [ ] Confirm the grayscale-plus-ignition-red palette holds everywhere. Watch for any warm graphite or off-neutral values that slipped in from the live design spec, since the palette rule is true `R=G=B` for every neutral.
- [ ] Check heading scale, spacing rhythm, and button styles match across pages, not just within one.
- [ ] Check hover, focus, and active states exist on every interactive element (nav links, buttons, sponsor email CTA).
- [ ] Check the hero video (`public/media/hero.mp4` / `hero-720.mp4`) has a working poster frame and degrades on slow connections.
- [ ] Diff `src/data/members.json`, `sponsorship.json`, `subteams.json` against the rendered pages to confirm no stale or placeholder entries remain.
- [ ] Before merging any change, check it against the five specific regressions `PLAN.md` section 3 already found once: a focus-ring fix not applied everywhere, chart labels rendering inside their bars on mobile, a card grid collapsing to the wrong column count, the mobile-type-size floor crushing the nav, and a generic single-word class (`.card`, `.cta`, `.tag`) picking up an unrelated rule because two selectors tie on specificity. The current uncommitted diff on `index.astro` and `sponsors.astro` is small (4 lines) and clean against this list, but re-check on every future edit to those shared classes.

## 3. SEO

Implemented 2026-08-27 (`8a82573` + `52e707f`). Post-merge items (Search Console, 404 status on Pages) still open.

- [x] Add a canonical `<link rel="canonical">` per page.
- [x] Add Open Graph and Twitter card tags (`og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`) so shared links render a preview.
- [x] Create an OG image (1200x630) using the brand mark, not just the favicon.
- [x] Add `public/robots.txt` allowing crawl, pointing to the sitemap.
- [x] Add a sitemap via `@astrojs/sitemap` (`astro.config.mjs` + `site: 'https://macrocketry.ca'`).
- [x] Set `site: 'https://macrocketry.ca'` (confirm the real domain) in `astro.config.mjs` so canonical/sitemap/OG URLs resolve correctly.
- [ ] Check each page's `<title>` and `description` prop in `BaseLayout.astro` for length (under ~60 chars title, ~155 chars description) and uniqueness.
- [ ] Verify `404.astro` returns an actual 404 status under GitHub Pages, not a 200.
- [ ] After launch, submit the sitemap to Google Search Console and Bing Webmaster Tools, and confirm the domain is verified in both.
- [x] Add JSON-LD structured data (schema.org `Organization`, with `sameAs` links to Instagram, Discord, LinkedIn from `site.json`) to the homepage. Helps Google show a knowledge panel for the team.

## 4. Accessibility

- [ ] Run an automated pass (axe DevTools or Lighthouse) on every page.
- [ ] Do one manual pass with a real screen reader (VoiceOver on Mac, or NVDA on Windows). Automated tools catch missing alt text and contrast; they miss reading order and confusing announcements.
- [ ] Check tap targets on mobile are at least 44x44px, especially the nav toggle and the hero video's pause button in `site.js`.
- [ ] Confirm color contrast, especially ignition-red text or buttons on grayscale backgrounds, meets WCAG AA (4.5:1 body text, 3:1 large text).
- [ ] Tab through every page with keyboard only. Nav skip-link, focus order, and visible focus rings all need to work. `BaseLayout.astro` has `id="main" tabindex="-1"`, confirm there's an actual skip-to-content link pointing at it.
- [ ] Confirm the hero video doesn't autoplay with sound and has a pause control, or is muted and decorative with `aria-hidden`.
- [ ] Respect `prefers-reduced-motion` for the hero video and any CSS animation (crosshair marks, hover transitions); pause or skip motion for users who set that preference.
- [ ] Re-check the 8 `<img>` tags for alt text that's descriptive, not just present. Empty `alt=""` is correct only for decorative images.
- [ ] Check heading hierarchy per page (one `<h1>`, no skipped levels).
- [ ] Check form labels if the sponsor email CTA is an actual form and not a `mailto:` link (repo search found no `<form>` tags currently, confirm it's `mailto:`).

## 5. Security

- [ ] Add a `Content-Security-Policy` meta tag or header if GitHub Pages config allows it; at minimum restrict script sources given `is:inline` script usage in `BaseLayout.astro`.
- [ ] Confirm no API keys, tokens, or personal emails beyond the intended sponsor contact are committed in `src/data/*.json` or page source.
- [ ] Confirm external links (sponsor sites, social links) use `rel="noopener noreferrer"` when `target="_blank"`.
- [ ] Confirm Google Fonts is the only third-party origin loaded (matches current `preconnect` tags); no unexpected trackers.
- [ ] Check GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) doesn't expose secrets in logs and uses pinned action versions.
- [ ] Astro is pinned to 7.2.7 on purpose: `pnpm-workspace.yaml` sets `minimumReleaseAgeExclude: [astro@7.2.7]`, which works with pnpm's release-age quarantine to block installing any package version published too recently, a real defense against a compromised just-published release. 7.2.8 and 7.2.9 exist upstream but haven't cleared that quarantine window yet; leave this alone, it's already doing its job.
- [ ] Add a Dependabot config (`.github/dependabot.yml`) for the GitHub Actions ecosystem (`actions/checkout`, `pnpm/action-setup`, etc.), none exists today. Skip the npm ecosystem, or give it a matching cooldown, so it doesn't undercut the `minimumReleaseAge` protection above by proposing a same-day astro bump.
- [ ] GitHub Pages does not let you set real HTTP response headers, so the `Content-Security-Policy` meta tag above is weaker than a header version, and there is no way to set `X-Frame-Options`/`frame-ancestors` (clickjacking protection) at all through a meta tag. Since Cloudflare is already in the plan for analytics, consider fully proxying the domain through Cloudflare's free tier (orange-cloud DNS) and adding a Transform Rule to inject `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` as real headers.

## 6. Icons and brand assets

Partially done 2026-08-27 (`52e707f`).

- [ ] Confirm favicon renders correctly in browser tabs (both `logo-mark.svg` and `favicon.ico` are wired in `BaseLayout.astro`).
- [x] Add `apple-touch-icon` and a `manifest.json` with icon sizes for iOS/Android home-screen saves, since none currently exist in `public/`.
- [x] Add the matching `<link rel="apple-touch-icon">` and `<link rel="manifest" href="/site.webmanifest">` tags to `BaseLayout.astro`'s `<head>`. The files alone don't do anything without these tags.
- [ ] Check `public/brand/mcmaster_rocketry_logo_white.png` and `logo-mark-white-512.png` are used consistently and not duplicated with different crops.
- [ ] Confirm all icons used across the site (nav, socials, subteam markers) share one visual weight and corner radius.

## 7. Performance

Partially done 2026-08-27 (`52e707f`).

- [ ] Run Lighthouse performance audit on the homepage (heaviest page due to hero video).
- [ ] Confirm `hero-720.mp4` is actually served to smaller viewports instead of the full `hero.mp4`.
- [x] Check image formats: are `public/media/*` files optimized (WebP/AVIF) or raw JPG/PNG?
- [x] Confirm fonts load with `font-display: swap` (Google Fonts URL doesn't currently request it, check if needed).
- [x] Compress `public/docs/sponsorship-package-2026-2027.pdf`. It's 11 MB, committed straight to git rather than Git LFS, and it's the first thing a sponsor downloads.
- [x] Set `trailingSlash` explicitly in `astro.config.mjs` (currently unset). Confirm every internal link across the site uses the same form consistently, to avoid duplicate-content signals and mismatched links on GitHub Pages.

## 8. Copy and prose

ReviewMode was removed 2026-08-27; this pass is independent. Read every line of user-facing copy for voice and for patterns that read as AI-generated, not as something a student team actually wrote.

**Scope:** every `.astro` page template, `CtaBand.astro`, `src/data/*.json` prose fields (`blurb`, `detail`, `build`, `lede`, sponsorship tier copy, outreach event descriptions, vehicle/payload narratives), nav/footer strings in `site.json`, and `public/docs/sponsorship-package-2026-2027.pdf`. Skip code comments and `readme.md`.

**Tone reference:** `/join` and `/outreach` are the approved voice — direct, specific, no filler. Newer pages (payloads, subteam blurbs, sponsor copy) are the highest risk.

- [ ] Read every page top to bottom out loud. Stilted rhythm, every sentence the same length, or copy that sounds fine in your head but wrong spoken aloud usually means rewrite.
- [ ] Cut throat-clearing openers: "Whether you're…", "At McMaster Rocketry, we…", "In today's…", "When it comes to…", "It's no secret that…".
- [ ] Cut hollow closers and sign-offs: "…and that's what makes us who we are.", "…the sky is no longer the limit.", any sentence that could end any team page on any subject.
- [ ] Grep the repo for common AI tells and fix every hit in shipped copy:
  - `rg -i 'delve|leverage|robust|cutting.edge|foster|landscape|pivotal|testament|tapestry|nestled|showcase|spearhead|underscores|serves as|stands as|it's worth noting|in conclusion|in summary|not only .+ but also' src/ public/docs/`
  - Also watch for: em-dash padding (` — ` used twice in one paragraph), rule-of-three lists with no factual reason to be three, stacked adjectives ("innovative, cutting-edge, world-class"), and "designed and built" repeated on every page when once is enough.
- [ ] Check every headline and lede against a concrete fact. Replace vague claims ("industry-leading", "state-of-the-art", "pioneering") with numbers, names, or competition results already in the data.
- [ ] Subteam blurbs (`subteams.json`) and vehicle `build` paragraphs: each should name something specific to that team or rocket (a tool, a competition, a part), not interchangeable mission-statement filler.
- [ ] Sponsors and Join CTAs: no consultant pitch tone. Say what the money buys or what the applicant does in the shop, not "partner with us on our journey".
- [ ] Cross-check the same fact stated in two places (homepage hero, fleet stats, vehicle pages, PDF). One voice, one number — not two slightly different phrasings of the same altitude or win count.
- [ ] After edits, one cold read by someone who wasn't in the drafting chat. If they flag a line as "ChatGPT", fix it before merge regardless of whether it fact-checks.

## 9. Cross-browser and content QA

- [ ] Test Safari, Firefox, Chrome, and one mobile browser (iOS Safari or Chrome Android).
- [ ] Click every internal link and external link (sponsor sites, socials) for dead ends.
- [ ] Spell-check and proofread all page copy one final time, independent of whatever the review-mode overlay flagged. Section 8 (AI tells / voice) must be done first; this pass is typos and grammar only.
- [ ] Confirm the "31 Aug" sign-off deadline referenced in the git history is still realistic given remaining items here.
- [ ] Open `public/docs/sponsorship-package-2026-2027.pdf` and confirm it's the corrected final version. The `.gitignore` notes an old draft PDF had a high-power rocket count that disagreed with itself across pages; verify that error isn't in the shipped file.

## 10. Pre-launch mechanics

- [ ] Confirm the GitHub Pages custom domain (`CNAME` file) is present and matches the intended domain. No `CNAME` file exists in the repo yet.
- [ ] At the domain registrar, point the apex domain (`macrocketry.ca`) at GitHub's four A records, or `www` at `<username>.github.io` via a CNAME record, per GitHub's custom-domain instructions. This is separate from the repo's `CNAME` file and happens outside the repo.
- [x] Add a `public/.nojekyll` file (ships to `dist/`).
- [ ] Confirm HTTPS is enforced (GitHub Pages setting, "Enforce HTTPS").
- [ ] Do a full `astro build && astro preview` and click through the production build locally, not just `astro dev`.
- [ ] **Astro audits** — run on a clean production build before merge; all must pass:
  - [x] `pnpm check:todo` — exits 0 when `dist/` has no literal `TODO` (re-run after the final `build`; also section 1).
  - [ ] `pnpm astro check` — Astro diagnostics and `.astro` type-checking. First run may prompt to install `@astrojs/check` and `typescript`; accept or add them to `devDependencies` and commit. Fix all reported errors before merge. **Known:** 6 errors in `join.astro` (`todo` field typing) as of `52e707f`; build passes.
  - [ ] `pnpm audit --audit-level moderate` — triage dependency advisories. Do not bump `astro` past the pinned 7.2.7 without clearing the pnpm release-age quarantine (section 5).
- [ ] Suggested one-liner after ReviewMode is stripped: `pnpm check:todo && pnpm astro check && pnpm build && pnpm check:todo && pnpm audit --audit-level moderate`.
- [ ] Know the rollback plan before merging: if `main` deploys something broken, the fix is `git revert` on `main` and a re-push, since `deploy.yml` redeploys on every push to `main`.
- [ ] Merge `dev` into `main` only after every item above is checked, since `deploy.yml` runs on push to `main`.

## 11. Analytics

Using Cloudflare Web Analytics: free, sets no cookies, no consent banner needed. The beacon script is already wired into `BaseLayout.astro`, gated on `site.cloudflareAnalyticsToken` in `src/data/site.json` (currently empty, so nothing loads yet).

- [ ] Sign up at Cloudflare (Web Analytics is free and doesn't require proxying the domain through Cloudflare's DNS). This needs Robin's account, not something Claude can do.
- [ ] Add the site `macrocketry.ca` in the Cloudflare Web Analytics dashboard and copy the generated token.
- [ ] Paste that token into `"cloudflareAnalyticsToken"` in `src/data/site.json`. The script in `BaseLayout.astro` picks it up automatically.
- [ ] Update the `Content-Security-Policy` item in section 5 to allow `static.cloudflareinsights.com` as a script source.
- [ ] Rebuild and confirm the beacon script appears in the page source, then check the Cloudflare dashboard shows a hit after visiting the live site.

## 12. Legal, privacy, and compliance

- [ ] Confirm consent from every person listed in `src/data/members.json`. Full names, program, year, and headshot photos for the whole leads roster are published with no privacy policy or consent statement on the site. Check that each person agreed to have this posted publicly before launch.
- [ ] Confirm the site's use of the McMaster name and any McMaster wordmark or brand assets has been cleared with McMaster's club/trademark policies, since this ships on an external domain (`macrocketry.ca`), not `mcmaster.ca`. An earlier 8-reviewer review round (`PLAN.md` section 3) flagged the site as reading like an official University publication, not a student club's; decide on an explicit affiliation line ("a student club at McMaster University, not an official University publication") and add it, likely in the footer.
- [ ] Add a named legal recipient for sponsorship money and tax-receipt wording to the sponsors page, confirmed with McMaster Financial Affairs. `PLAN.md` section 4 flagged this as open and it's still not on `sponsors.astro` or in `sponsorship.json` as of this pass. The page asks for money with no stated entity or receipt process behind it.
- [ ] Check whether the Accessibility for Ontarians with Disabilities Act (AODA) applies to this site given the McMaster affiliation. This determines whether WCAG 2.0 Level AA (the accessibility items in section 4) is a legal requirement or a best practice; worth a short email to McMaster's student-org or accessibility office to confirm, since Claude can't determine applicability.
- [ ] Add a copyright line to `Footer.astro` (for example "© 2026 McMaster Rocketry Team"). Not legally required in Canada, since copyright is automatic, but signals an official, current site.
- [ ] Strip GPS and other location metadata from every published photo (`public/media/leads/*`, sponsor and outreach photos), especially any taken on a phone. A photo's EXIF data can expose where it was taken.

## 13. Loose ends

- [ ] Load the site with JavaScript disabled and confirm the mobile nav links are still reachable. `public/js/site.js` builds the mobile menu toggle in script; check the links degrade to visible or reachable, not hidden, without it.
- [ ] Decide whether to keep loading fonts directly from Google's CDN (current `fonts.googleapis.com` / `fonts.gstatic.com` links in `BaseLayout.astro`). Every visitor's IP address is sent to Google to fetch the font files; self-hosting the four font files in `public/` removes that, at the cost of manually updating them if the type ever changes.
- [ ] After launch, set up free uptime monitoring (for example UptimeRobot) pinging the homepage every few minutes, so a broken deploy is caught before a sponsor or visitor reports it.

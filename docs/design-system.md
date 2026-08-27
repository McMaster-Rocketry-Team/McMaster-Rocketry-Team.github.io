# Design system — repo pointer

**Canonical spec (v1.3):** [`McMaster_Rocketry_Design_System_Spec.md`](../McMaster_Rocketry_Design_System_Spec.md) in the repo root (gitignored — sync source for claude.ai/design).

**Shipped CSS:** [`src/styles/site.css`](../src/styles/site.css) header comment + tokens.

**Agent rules:** [`.cursor/rules/design.mdc`](../.cursor/rules/design.mdc)

**Live remote:** [claude.ai/design](https://claude.ai/design) → project **McMaster Rocketry Design System** (`3fe61467-ca14-4c72-80a1-d4bd7fe18e79`), file `spec.md`.

## Sync claude.ai/design after local edits

From this repo in **Claude Code** (not Cursor):

1. Ensure design MCP is connected: `claude mcp add --scope user --transport http claude-design https://api.anthropic.com/v1/design/mcp`
2. Run `/design-login` if needed.
3. Run **`/design-sync`** — pushes `McMaster_Rocketry_Design_System_Spec.md` → remote `spec.md`.

Cursor cannot call the design API from its sandbox. After syncing remotely, verify on claude.ai/design that `spec.md` shows **v1.3 · 2026-08-27**.

## Mockups

`mockups/final/` is a **deprecated** snapshot. When mockup HTML/CSS disagrees with `src/` (hero veil, apogee fleet, flat nav), trust the Astro site.

## Nav flyout alignment

Rockets and Subteams use `.navitem` wrappers; other nav entries are plain `.navlinks > a`. On desktop, the link row must use **`align-items: baseline`** (not `center`) so all top-level labels share one text baseline. See spec **Navigation** and `src/styles/site.css` (`.navlinks`, `.navitem`).

## Grid cell backgrounds must scope to direct children

A hairline grid's own cell-background rule (e.g. `.dl>div`) has to use the `>` child combinator. A descendant selector (`.dl div`) reaches into a nested `.card-cta`'s inner `<div>` and paints an opaque background over it, hiding the card's red hover fill and its own text. This broke the sponsors "Get package" card (`.card-cta` inside `.dl-cta` inside `.dl`) on 2026-08-27; `.cards`-grid CTA cards (subteams, join) were never affected since `.cards` has no such rule. See spec **Hairline grids** and `src/styles/site.css` (`.dl>div`, `section.paper .dl>div`).

## `/rockets` page

Fleet **lineup only** — no `FleetTable` section. Rhythm: `.phead` → `.paper.fleet` → `CtaBand`. Per-vehicle flight records live on `/rockets/[slug]`.

## `/payloads` page

Mirrors `/rockets`: `.phead` → `.paper.fleet` → `CtaBand`, with `PayloadLineup`/`PayloadStat` standing in for `FleetLineup`/`FleetStat`. Also embeds on the homepage and, as a `.cards` grid, on the Payload subteam page.

`PayloadLineup` shares `.craft`/`.lineup` markup with `FleetLineup` but adds `.payload-craft`/`.payload-lineup` modifiers: the base sizing (150px cap, tight gap) was tuned for `FleetLineup`'s six-vehicle row and strands two or three payloads close together mid-row instead of spreading them out. The modifiers widen the gap and the max width, scoped to `min-width:701px` in `src/styles/site.css` so they never fight the shared `.craft{max-width:none}` mobile stacked-row reset below 701px. A payload whose `result` starts with `"1st"` also gets `.val.win` (ignition red, bold) so a Payload Challenge win reads as a result, not a label.

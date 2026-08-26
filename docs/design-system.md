# Design system — repo pointer

**Canonical spec (v1.2):** [`McMaster_Rocketry_Design_System_Spec.md`](../McMaster_Rocketry_Design_System_Spec.md) in the repo root (gitignored — sync source for claude.ai/design).

**Shipped CSS:** [`src/styles/site.css`](../src/styles/site.css) header comment + tokens.

**Agent rules:** [`.cursor/rules/design.mdc`](../.cursor/rules/design.mdc)

**Live remote:** [claude.ai/design](https://claude.ai/design) → project **McMaster Rocketry Design System** (`3fe61467-ca14-4c72-80a1-d4bd7fe18e79`), file `spec.md`.

## Sync claude.ai/design after local edits

From this repo in **Claude Code** (not Cursor):

1. Ensure design MCP is connected: `claude mcp add --scope user --transport http claude-design https://api.anthropic.com/v1/design/mcp`
2. Run `/design-login` if needed.
3. Run **`/design-sync`** — pushes `McMaster_Rocketry_Design_System_Spec.md` → remote `spec.md`.

Cursor cannot call the design API from its sandbox. After syncing remotely, verify on claude.ai/design that `spec.md` shows **v1.2 · 2026-08-26**.

## Mockups

`mockups/final/` is a **deprecated** snapshot. When mockup HTML/CSS disagrees with `src/` (hero veil, apogee fleet, flat nav), trust the Astro site.

## Nav flyout alignment

Rockets and Subteams use `.navitem` wrappers; other nav entries are plain `.navlinks > a`. On desktop, the link row must use **`align-items: baseline`** (not `center`) so all top-level labels share one text baseline. See spec **Navigation** and `src/styles/site.css` (`.navlinks`, `.navitem`).

## `/rockets` page

Fleet **lineup only** — no `FleetTable` section. Rhythm: `.phead` → `.paper.fleet` → `CtaBand`. Per-vehicle flight records live on `/rockets/[slug]`.

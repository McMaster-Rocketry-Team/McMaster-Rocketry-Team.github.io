# Data layer — copy vs templates

**Rule:** Astro pages and components own layout and structure only. User-facing strings and numbers live in `src/data/*.json` or content collections (`vehicles`, `payloads`, `subteams`).

## Files

| File | Contents |
|---|---|
| `site.json` | Team identity, nav, footer, abbreviations, stat labels, a11y chrome, `copy.notPublished` |
| `pages.json` | Page headlines, section tags, shared template labels (vehicle/payload/subteam page chrome) |
| `join.json` | Apply URL, hero, CTA band, recruit card, steps, dates, FAQ, section intros |
| `members.json` | Roster, stats, page copy, `executiveRoles`, `leadSortLast` |
| `outreach.json` | Events + page copy + sponsor pitch |
| `sponsorship.json` | Tiers, partners, budget, page copy; contacts reference `members.leads` by `leadRole` |
| `chris-hadfield.json` | Home Hadfield section |
| `vehicles.json` | Fleet records (content collection) |
| `payloads.json` | Payload records (content collection) |
| `subteams.json` | Subteam records (content collection) |

## Derived values (`src/lib/copy.ts`)

Use when copy depends on collection counts or stats:

- `payloadsHeadline(count, wins)` — e.g. "Two entries, two wins"
- `subteamsHeadline(count, template)` — e.g. "Seven teams, one rocket"
- `membersLede(template, stats)` — fills `{members}`, `{subteams}`, `{faculties}` from `members.stats`
- `vehicleSpecValue(v, field)` — maps `pages.json` spec rows to `vehicles.json` fields
- `fill(template, vars)` — `{placeholder}` substitution

Home hero apogee reads the highest `apogee` from the `vehicles` collection (same source as `/rockets/osiris`).

## Flight data ingest

`scripts/ingest-flight-log.py` parses Void Lake SRAD `flight_log.csv` (zip in `media-source/`). `--write` patches `vehicles.json` for Osiris: apogee, accel, recovery, build narrative. **Mach** stays at the OpenRocket FDR value (`1.92`) unless Robin changes it in JSON.

```bash
python scripts/ingest-flight-log.py media-source/osiris-void-lake-flight-log.zip
python scripts/ingest-flight-log.py media-source/osiris-void-lake-flight-log.zip --write
```

Extracted CSV cache: `media-source/.osiris-void-lake-flight-log-extract/` (gitignored).

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

`scripts/ingest-blue-raven-summary.py` parses the Blue Raven flight-summary CSV
(`BlRv_SN*_summary_*.csv`, a flat label/value export, no time-series telemetry).
`--check` prints a `blueRaven` cross-check block to paste into `vehicles.json`
by hand (the file is hand-formatted compact-per-vehicle; a `json.dumps`
rewrite would reformat the whole file's whitespace). It never computes
`apogee`, `mach`, or `specs.accel`.

Blue Raven SN1717 ingested 2026-09-01 for the 2026-04-06 Osiris flight:
apogee (33,528 ft) landed within 23 ft of the published Void Lake figure,
already reflected in `vehicles.json`'s `osiris.build` text. Two figures were
deliberately **not** adopted from this file, both Robin's call:

- **Velocity/Mach:** Blue Raven's max velocity (669.24 m/s, 2195.67 ft/s) has
  no altitude or temperature attached in the summary export. A burnout
  altitude reconstructed from Void Lake's raw pressure trace (barometric
  formula, pad temperature from Blue Raven's own reading) gives Mach 1.97,
  uncertainty band roughly 1.92-2.02, not confidently above 2.0. Robin wants a
  tighter number before publishing a new Mach figure; `mach` stays `1.92`
  until then.
- **Acceleration:** Blue Raven reports max motor-burn accel 74.9 G and peak
  drag deceleration 75.3 G, roughly 4.6x the published `specs.accel` (16.1 G,
  from Void Lake's accelerometer trace). Robin does not trust the Blue Raven
  IMU for this figure; `specs.accel` is unchanged.

```bash
python scripts/ingest-blue-raven-summary.py path/to/BlRv_SN1717_summary.csv
python scripts/ingest-blue-raven-summary.py path/to/summary.csv --check
```

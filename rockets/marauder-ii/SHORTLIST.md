# Marauder II — photo shortlist

Source album: `SA Cup 2023-photos.zip` (Spaceport America Cup 2023), extracted
stills-only at `/home/robin/Downloads/MRT-photo-review/SA Cup 2023/`. Contact
sheets: `_sheets/sac2023_001.jpg` … `sac2023_028.jpg`. Competition identifier
in this set is team **55**, yellow pad sign "A4 55 / McMaster University",
lettering **MARAUDER** on a maroon/red airframe. Most of the 677 stills are
travel (White Sands, Grand Canyon, Las Vegas, highways). Vehicle shots cluster
on sheets 1, 11–14, 17–18, 21.

## Gallery picks (4 slots for `[slug].astro`)
| Slot | File | Confidence | Why |
|------|------|------------|-----|
| integration | `marauder-ii-01.webp` | high | Team holding the airframe; "MCM…ASTER" and bib 55 readable. |
| on the pad | `marauder-ii-04.webp` | high | Full vehicle vertical on the desert rail. Sheet 18-1. |
| liftoff | none | — | The album has smoke-trail shots (sheets 13-15, 24-14) with no readable airframe. Do not force a pick. |
| recovery | `marauder-ii-08.webp` | high | Recovered airframe on the desert floor, same sequence as the MARAUDER lettering and damage close-ups. |

## Fleet cutout — done 2026-08-26 from `-13`, after two rejected attempts

- Source file: **`marauder-ii-13.webp`**, newly imported this pass from
  `SA Cup 2023/IMG_2861.HEIC` (contact sheet `sac2023_017.jpg`, cell 17-15). The
  original shortlist never imported this frame.
- Shipped as `public/media/rockets/marauder-ii.png`, 228x1901 RGBA, renders **53x440**.
  Soft edge 3.17%, which matches hand-cut Nimbus at 3.13%. `paleArt` dropped (maroon).
- Reproduce. Crop the airframe band out of the **full-res HEIC** first, because subject
  size is what decides the result here (see below):

      V=/home/robin/.cache/mrt-rembg/bin/python
      magick '/home/robin/Downloads/MRT-photo-review/SA Cup 2023/IMG_2861.HEIC[0]' \
          -auto-orient -crop 3082x620+950+1150 +repage -resize 2400x m2-crop.png
      $V scripts/cut-fleet-cutout.py mask m2-crop.png m2-mask.png
      magick m2-mask.png -rotate 90 m2-rot.png
      $V scripts/cut-fleet-cutout.py finish m2-rot.png public/media/rockets/marauder-ii.png

  No `--keep` and no `--erase`: the airframe lies on top of its cradle rather than
  against a rail, so largest-region filtering alone gets it. Straightening rotated
  +1.38deg. `-rotate 90` is clockwise, putting the nose at the top.
- Gold nose with silver tip, both fins, aft ring, McMaster / SolidWorks decals and the
  team's handwritten signatures near the tail all survive.
- **One caveat:** the vehicle is lying down and shot slightly off-square, so the body
  measures 87px at the shoulder and 103px at the tail, an 18% perspective taper. At
  53px render width that is ~2px and reads straight, but this frame is not as
  orthogonal as Marauder I's `-02`.

### Why the first two attempts failed: subject size, not masking
Both earlier attempts cut `marauder-ii-04.webp`, the vertical pad shot, and both were
rejected. The reason was not the mask. **In that frame the airframe is only ~40px
wide**, giving a 65px cutout where the other vehicles are 148 to 305px. At that scale
any residue is proportionally enormous, and there is no detail to recover: grey rail
remnants down both edges, a metallic lump mid-body and a blobby fin all survived.

Do not retry `-04`, and do not try to rescue it with upscaling or generative fill: at
40px of real airframe that would be inventing what the vehicle looks like. The fix was
always a bigger subject.

For the record, on `-04` the rail runs against the airframe for its full height, so the
cut line has to be the rail's edge rather than the body's own, losing ~3px of a ~35px
diameter. A saturation mask (rail 3-21% saturated, body 47-65%) looks promising and is
the **wrong answer**: it eats the gold nose cone and bites holes through the white
McMaster decals, which are unsaturated too. Rejected files are in
`/tmp/mrt-cutout/rejected/`.

### Better frames exist in this album than were imported
Sheets 11, 17 and 18 hold several. Worth a look if a gallery slot needs filling:
`11-15` / `11-16` (aft section on a cradle, close, fins and "55" crisp), `18-5` /
`18-6` (body close-ups against clear sky), `17-24` / `17-25` (aft end and fin geometry).

## Draft captions (Robin must verify in ReviewMode)
- integration: "The Marauder II team with the airframe, Spaceport America Cup 2023. Bib 55."
- on the pad: "Marauder II on the rail, bib 55."
- liftoff: (no shot)
- recovery: "The recovered airframe after landing, Spaceport America Cup 2023."

## Rejected / kept but not shortlisted
- `marauder-ii-02.webp`: tent integration / internals.
- `marauder-ii-03.webp`: team posing with the rocket on the rail (sheet 17-18). Strong alternate to the pad slot.
- `marauder-ii-05.webp`: "MARAUDER" lettering close-up.
- `marauder-ii-06.webp`: bib 55 on the airframe.
- `marauder-ii-07.webp`: yellow A4 55 McMaster pad sign.
- `marauder-ii-09.webp`: second recovery angle.
- `marauder-ii-10.webp`: cracked "MARAUDER" lettering after landing. Strong failure-narrative alternate; needs a precise caption if used.
- `marauder-ii-11.webp`: avionics/payload bay internals.
- `marauder-ii-12.webp`: team group with the upright rocket (sheet 1-16).
- Sheet 24-6…24-10: brown/composite airframe on a table — **not confirmed as Marauder II**. Left in the extract, not imported.
- Sheet 24-11: launch hardware marked **91**. Other team. Not imported.
- Sheet 24-12: debris marked **QRET**. Other team. Not imported.
- `IMG_2874.webp` (was already in this folder): adjacent frame to `IMG_2873.HEIC` (`marauder-ii-04.webp`). Removed after the numbered convert.

## Unverified fact candidate — do not publish
Sheet `14-5` (`SA Cup 2023/IMG_2079.HEIC`) is a screenshot of Altus Metrum AltosUI for **EasyMini-v1.0, Flight 3**, reading max height 3970.0 m (13,025 ft), max speed 293.4 m/s (Mach 0.86). Nothing in the screenshot names Marauder II. Same rule as Nimbus 18,000 ft: Robin confirms before it touches `vehicles.json`.

## Source mapping (if renamed)
| Original name | Renamed to | Notes |
|---|---|---|
| `IMG_20230622_155518.jpg` | `marauder-ii-01.webp` | sheet 11-1 |
| `41f4123c-72f7-43b3-a4e2-f612aaf43aeb.JPG` | `marauder-ii-02.webp` | sheet 1-3 |
| `IMG_2865.HEIC` | `marauder-ii-03.webp` | sheet 17-18 |
| `IMG_2873.HEIC` | `marauder-ii-04.webp` | sheet 18-1 |
| `IMG_2877.HEIC` | `marauder-ii-05.webp` | sheet 18-5 |
| `IMG_2878.HEIC` | `marauder-ii-06.webp` | sheet 18-6 |
| `IMG_2860.HEIC` | `marauder-ii-07.webp` | sheet 17-14 |
| `IMG_2890.HEIC` | `marauder-ii-08.webp` | sheet 18-15 |
| `IMG_2891.HEIC` | `marauder-ii-09.webp` | sheet 18-16 |
| `IMG_2897.HEIC` | `marauder-ii-10.webp` | sheet 18-22 |
| `IMG_2054.HEIC` | `marauder-ii-11.webp` | sheet 13-16 |
| `a49ba0dc-dfde-4c25-baf9-a485623bab1f.jpg` | `marauder-ii-12.webp` | sheet 1-16 |
| `IMG_2861.HEIC` | `marauder-ii-13.webp` | sheet 17-15; added 2026-08-26 as the fleet cutout source. Full airframe horizontal on its cradle, 4032x3024, airframe ~2850px long. |

Full source album remains at `/home/robin/Downloads/MRT-photo-review/SA Cup 2023/` — not copied into the repo. Videos and DNG were not extracted.

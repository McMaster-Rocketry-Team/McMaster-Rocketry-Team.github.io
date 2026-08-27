# Luminis — photo shortlist

Source album: `sac 2024-photos.zip` (Spaceport America Cup 2024), extracted at
`/home/robin/Downloads/MRT-photo-review/SAC 2024/`. Competition bib number
visible on the airframe is 58.

## Gallery picks (4 slots for `[slug].astro`) — updated 2026-08-27 (reframed)
| Slot | File | Confidence | Why |
|------|------|------------|-----|
| integration | `luminis-03.webp` | high | Full team under the range tent, LUMINIS lettering and bib 58 legible. |
| on the pad | `luminis-04.webp` | high | Horizontal on the launch rail at SAC, team making final checks. |
| payload | `luminis-05.webp` | high | Avionics sled wired for dual-deploy, VL pyro and main/drogue labels. |
| recovery | `luminis-11.webp` | high | Team member beside recovered airframe, bib 58 and signed fins. |

Gallery exports ship at **1400×933 (3:2 landscape)** to match `.gallery .ph` — not portrait 1050×1400.

## Previous gallery (replaced 2026-08-27)
| Slot | File | Notes |
|------|------|-------|
| integration | `luminis-02.webp` | Vertical in assembly hall — portrait export cropped badly |
| on the pad | `luminis-12.webp` | Work-table prep — tight crop, heads cut off |
| payload | `luminis-13.webp` | Camera-port closeup — too tight for gallery frame |
| recovery | `luminis-14.webp` | Dig-out scene — portrait export lost context |

## Earlier gallery (replaced 2026-08-27)
| Slot | File | Notes |
|------|------|-------|
| integration | `luminis-03.webp` | Team under tent |
| on the pad | `luminis-04.webp` | Horizontal on rail cradle |
| liftoff | `luminis-08.webp` | Unconfirmed vehicle identity in frame |
| recovery | `luminis-11.webp` | Kneeling beside recovered airframe |

## Fleet cutout — done 2026-08-26
- Source file: `luminis-01.webp` (originally `Image-21.webp`, already in the repo before this session)
- Shipped as: `public/media/rockets/luminis.png`, 148x1566 RGBA, renders 42x440 in the
  fleet lineup (Nimbus is 43x440, Osiris 38x440, so it sits consistently with both).
  Re-cut later the same day with the BiRefNet model for a crisper matte; the boxes
  below did not change.
- Wired: `src/data/vehicles.json` `luminis.image`. Dropped `paleArt` (the upper half is
  navy, so it does not need the extra rim weight the class exists for) — flip it back if
  the white lower half reads as thin on the live page.
- Reproduce:

      /home/robin/.cache/mrt-rembg/bin/python scripts/cut-fleet-cutout.py cut \
          rockets/luminis/luminis-01.webp public/media/rockets/luminis.png \
          --keep 985,140,175,1580

  The `--keep` box is the airframe's own bounding box in the mask, stopping 5px above
  the red stand's top rail. Without it the stand and its cast shadow stay attached to
  the fins and survive largest-region filtering, which is what made the first attempt
  96px wide at render size instead of 42.
- Notes: clean plain-wall background, even light, full body nose to fins, bib 58 legible.
  Rotation was unnecessary: the airframe measured 0.04deg off vertical already.

## Draft captions (Robin must verify in ReviewMode)
- integration: "The Luminis team with the completed airframe before flight, Spaceport America Cup 2024."
- on the pad: "Luminis on the rail, bib 58, final checks before launch."
- liftoff: "Luminis clears the pad." — **only if Robin confirms this is actually Luminis's flight and not another team's.**
- recovery: "The recovered airframe after landing, Spaceport America Cup 2024."

## Rejected / kept but not shortlisted
- `luminis-02.webp` (dramatic upward shot of the nose, indoor venue, "LUM..." lettering visible): strong alternate hero/integration shot, cut only to keep the gallery to four narrative slots.
- `luminis-05.webp` (avionics wiring closeup): good technical detail shot, redundant with the integration slot's information.
- `luminis-06.webp` (full "LUMINIS" booth banner with specs, expo hall): useful for a future specs/technical section, not a narrative gallery slot.
- `luminis-07.webp` (person hugging the airframe, all smiles): good culture/candid shot, not a build/flight narrative beat.
- `luminis-09.webp` (severely damaged nose cone in the dirt): a real failure/damage shot from this competition. I did not use it because I cannot confirm without Robin whether this specific piece is Luminis wreckage or another team's, and a damage photo needs to be captioned very precisely.
- `luminis-10.webp` (charred motor casing held in hand): same caution as above — dramatic, but unconfirmed which team's hardware.

## Source mapping (if renamed)
| Original name | Renamed to | Notes |
|---|---|---|
| `Image-21.webp` (already in repo) | `luminis-01.webp` | Re-encoded to the 2000px/webp-82 convention; original deleted after conversion. |
| `SAC 2024/sac 2024/IMG_6596.HEIC` | `luminis-02.webp` | |
| `SAC 2024/sac 2024/20240619_131046.jpg` | `luminis-03.webp` | |
| `SAC 2024/sac 2024/20240621_073554.mp4` (poster frame) | `luminis-04.webp` | Extracted with ffmpeg, frame at ~1s. |
| `SAC 2024/sac 2024/1E2A7C74-4AE8-470E-A303-B1E74E97F61E.heic` | `luminis-05.webp` | |
| `SAC 2024/sac 2024/IMG_6609.HEIC` | `luminis-06.webp` | |
| `SAC 2024/sac 2024/IMG_6649.HEIC` | `luminis-07.webp` | |
| `SAC 2024/sac 2024/20240621_083305.mp4` (poster frame) | `luminis-08.webp` | Extracted with ffmpeg, frame at ~1s. Vehicle identity in this specific flight is unconfirmed, see gallery table. |
| `SAC 2024/sac 2024/CE0662DA-8BB5-4816-86C9-1BA7827DFE8E.jpeg` | `luminis-09.webp` | |
| `SAC 2024/sac 2024/IMG_20240621_144340.jpg` | `luminis-10.webp` | |
| `SAC 2024/sac 2024/IMG_6905.HEIC` | `luminis-11.webp` | |

Full source album (802+ other files not shortlisted here) remains at
`/home/robin/Downloads/MRT-photo-review/SAC 2024/`, not copied into the repo to
avoid bloating the git history with hundreds of megabytes of raw originals.

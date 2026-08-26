# Luminis V2 — photo shortlist

Source album: `LC24-1-photos.zip` (Launch Canada, per vehicles.json this is the
2024 Launch Canada flight), extracted at
`/home/robin/Downloads/MRT-photo-review/LC24/`.

## Gallery picks (4 slots for `[slug].astro`)
| Slot | File | Confidence | Why |
|------|------|------------|-----|
| integration | `luminis-v2-01.webp` | high | Full team holding the completed airframe, "LUMINIS" lettering and McMaster sponsor logos legible, burned-forest launch site in the background. |
| on the pad | `luminis-v2-05.webp` | high | Rocket vertical on the pad against clear blue sky, people beside it for scale. |
| liftoff | `luminis-v2-06.webp` | high | Clean solo liftoff shot: rocket mid-ascent with a visible exhaust trail against the treeline. Already a cropped/composed shot (`McMasterCrop.JPG` in the source album), suggesting someone already picked it as a hero image once before. |
| recovery | `luminis-v2-10.webp` | high | Team gathered around the recovered airframe on the ground, examining it together. |

## Fleet cutout — done 2026-08-26 from `-13`

- Source file: **`luminis-v2-13.webp`**, newly imported this pass from
  `LC24/LC24/IMG_20240821_103600.jpg` (contact sheet `sheet25_041.jpg`, cell 41-22).
  The original shortlist said no cutout candidate existed; that was true of the
  imported set. This frame was in the album and never pulled: full airframe
  horizontal on two red tripod stands, LUMINIS lettering and bib 13 readable,
  ~3800px of real tube in a 4618×3464 original.
- Shipped as `public/media/rockets/luminis-v2.png`, 169x2212 RGBA, renders **34x440**.
  Soft edge 4.25% (Luminis V1 is 5.87%). `paleArt` dropped (navy upper half, same
  call as V1). Slimmer than V1's 42px at the same height: this photo is slightly
  off-square so the body tapers ~32% nose-to-tail, and V2's white fins are
  physically smaller than V1's black ones. Do not force the widths to match.
- Reproduce. Crop the airframe band out of the full-res original first:

      V=/home/robin/.cache/mrt-rembg/bin/python
      magick '/home/robin/Downloads/MRT-photo-review/LC24/LC24/IMG_20240821_103600.jpg[0]' \
          -auto-orient -crop 4618x1500+0+1100 +repage -resize 2400x lv2-crop.png
      $V scripts/cut-fleet-cutout.py mask lv2-crop.png lv2-mask.png
      magick lv2-mask.png -rotate 90 lv2-rot.png
      $V scripts/cut-fleet-cutout.py finish lv2-rot.png lv2-s.png --feather 0
      $V scripts/cut-fleet-cutout.py finish lv2-s.png public/media/rockets/luminis-v2.png \
          --erase 0,1065,124,220 --erase 0,1855,143,185 --no-straighten

  `-rotate 90` is clockwise, putting the nose (left in the source) at the top.
  The two `--erase` boxes clip the tripod clamps at the tube's own left edge
  after straightening. The clamps sit on the LUMINIS letters and the sponsor
  stack, so `patch` is off-limits here.
- Other frames considered and rejected for the cutout: `luminis-v2-05` / 48-4 /
  49-7 (vertical on the rail — subject too thin, rail fused the full height);
  46-9 `IMG_4746.HEIC` (indoor, huge, logo-side only, white fins against a white
  wall); 41-5 (indoor hangar, LUMINIS visible, crowd overlapping).

## Draft captions (Robin must verify in ReviewMode)
- integration: "The Luminis V2 team with the completed airframe, Launch Canada 2024."
- on the pad: "Luminis V2 on the pad, final checks before launch."
- liftoff: "Luminis V2 clears the pad."
- recovery: "The team recovers the airframe after landing."

## Rejected / kept but not shortlisted
- `luminis-v2-02.webp` (avionics bay open on a table, parachute and payload sled laid out, sponsor decals): the strongest single integration/technical shot in the album, cut only to keep the gallery to four slots. Worth reconsidering if the build section wants a technical photo.
- `luminis-v2-03.webp` (nosecone alone on a table): clean product shot, redundant with the integration slot's information.
- `luminis-v2-04.webp` (avionics bay open on a stand, different angle): same reasoning as `-02`.
- `luminis-v2-07.webp` ("LUMINIS" lettering on the airframe, close crop): good for a specs/technical section, not a narrative beat.
- `luminis-v2-08.webp` (rocket vertical on stands, clear sky, alternate to the "on the pad" pick): kept as backup in case Robin prefers this angle.
- `luminis-v2-09.webp` (burnt/scorched motor casing after flight): dramatic post-flight detail, cut because the "recovery" slot already has a stronger team-focused shot.
- `luminis-v2-11.webp`, `luminis-v2-12.webp` (onboard-camera frames showing parachute deployment and a high-altitude view over the descent): genuinely unusual content — a camera rode on this airframe — but there is no dedicated onboard-camera slot in the current `[slug].astro` template. Flagging for Robin: this may be worth a fifth gallery slot or its own callout, since Osiris and Nimbus don't have anything like it.

## Source mapping (if renamed)
| Original name | Renamed to | Notes |
|---|---|---|
| `IMG_4785.webp` (already in repo) | `luminis-v2-01.webp` | Re-encoded to the 2000px/webp-82 convention; original deleted after conversion. |
| `LC24/LC24/IMG_20240818_101424.jpg` | `luminis-v2-02.webp` | |
| `LC24/LC24/IMG_20240818_134842.jpg` | `luminis-v2-03.webp` | |
| `LC24/LC24/IMG_20240821_083727.jpg` | `luminis-v2-04.webp` | |
| `LC24/LC24/IMG_20240821_111254.jpg` | `luminis-v2-05.webp` | |
| `LC24/LC24/McMasterCrop.JPG` | `luminis-v2-06.webp` | Filename suggests this was already hand-picked/cropped once before by someone on the team. |
| `LC24/LC24/P1110382.JPG` | `luminis-v2-07.webp` | |
| `LC24/LC24/PXL_20240821_134321188.jpg` | `luminis-v2-08.webp` | |
| `LC24/LC24/PXL_20240822_132655564.jpg` | `luminis-v2-09.webp` | |
| `LC24/LC24/PXL_20240822_141320447.MP.jpg` | `luminis-v2-10.webp` | ".MP" is an Android motion-photo variant; only the still frame was used. |
| `LC24/LC24/mpv-shot0003.jpg` | `luminis-v2-11.webp` | Manual video-player screenshot already in the source album, not something I extracted. |
| `LC24/LC24/mpv-shot0006.jpg` | `luminis-v2-12.webp` | Same as above. |
| `LC24/LC24/IMG_20240821_103600.jpg` | `luminis-v2-13.webp` | Sheet 41-22. Added 2026-08-26 as the fleet cutout source. Full airframe horizontal on two red tripod stands, 4618x3464. |

Full source album (300+ other files not shortlisted here) remains at
`/home/robin/Downloads/MRT-photo-review/LC24/`, not copied into the repo to
avoid bloating the git history with hundreds of megabytes of raw originals.

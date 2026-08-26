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

## Fleet cutout candidate
- Source file: none of the shortlisted files
- Usable as-is? No
- Notes: Unlike Luminis (V1), I did not find a clean isolated product shot of this airframe against a plain background anywhere in the LC24 album. Every full-body shot has people, trees, or the launch rail in frame. Recommend keeping the `paleArt` osiris.png stand-in in `vehicles.json` for this vehicle until a better source photo turns up, rather than forcing a cutout from a busy background.

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

Full source album (300+ other files not shortlisted here) remains at
`/home/robin/Downloads/MRT-photo-review/LC24/`, not copied into the repo to
avoid bloating the git history with hundreds of megabytes of raw originals.

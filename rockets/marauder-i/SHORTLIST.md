# Marauder I — photo shortlist

Source album: `LC2022-photos.zip` (Launch Canada 2022), extracted at
`/home/robin/Downloads/MRT-photo-review/LC2022/`. Contact sheets:
`_sheets/lc2022_001.jpg` … `lc2022_007.jpg`. Lettering on the airframe in
this set includes "MARAUDER" / "MCMASTER 23".

## Gallery picks (4 slots for `[slug].astro`)
| Slot | File | Confidence | Why |
|------|------|------------|-----|
| integration | `marauder-i-01.webp` | high | Full team with the completed red airframe under the Launch Canada tent. |
| on the pad | `marauder-i-05.webp` | high | Rocket vertical on the rail in the sandy clearing. Same frame as the old `IMG_20220805_142650992.webp`. |
| liftoff | `marauder-i-07.webp` | medium | A rocket leaving the pad with a visible plume, same album and launch window. Airframe too small in frame to read lettering. Robin should confirm this is Marauder I and not another team's flight at the same range. |
| recovery | none | — | No recovered-airframe or parachute shot in this album. Do not force a substitute. |

## Fleet cutout — done 2026-08-26 from `-02`, after `-05` failed

**First attempt, from `marauder-i-05.webp` (vertical on the rail), was wired and backed
out.** Robin called it messy on the live page and she was right. The defect was
measurable from the alpha alone: from row 0 to 300 the left edge sat frozen at x=55
while the right edge grew 82 -> 137. A nose cone tapers symmetrically about its axis, so
a flat left edge beside a diverging right edge means **the launch rail was fused to the
cone**. Lower down the rail passes behind the wider body, so the stripe appeared only at
the top, reading as damage rather than hardware. The base was sliced flat too: rows
1428-1476 ran a constant full 167px then stopped, which is launcher structure merged
into the fin flare.

**`-05` cannot be fixed with a bounding box**, because the rail is behind the body low
down and beside the cone up top, so no single vertical cut separates them. Do not retry
it. Rejected file kept at `/tmp/mrt-cutout/rejected/marauder-i.png`.

### Shipped from `marauder-i-02.webp` instead
- A **true side elevation with no rail at all**: the whole airframe horizontal on two
  tripods under the tent, ~1450px long in a 2000x1500 frame.
- **Confirmed the same airframe as the pad shot `-05`**: navy nose cone, red band,
  silver tip, red body with the McMaster and FSI decals.
- Shipped as `public/media/rockets/marauder-i.png`, **277x1641 RGBA, renders ~74x440**
  (was 252x1641 / 68x440 until the 2026-08-26 re-cut below widened the canvas).
  `paleArt` dropped (red airframe).
- Reproduce (BiRefNet mask already at `/tmp/mrt-cutout/m1b-bire-rot.png` if you
  don't want to re-run `mask`):

      V=/home/robin/.cache/mrt-rembg/bin/python
      $V scripts/cut-fleet-cutout.py mask rockets/marauder-i/marauder-i-02.webp m1-mask.png
      magick m1-mask.png -rotate 90 m1-rot.png

  `finish` only takes one `--keep` box, and the fin tips need a second, smaller one
  (see "Fin tips were clipped" below), so this step is a short Python script, not a
  single CLI call — import `scripts/cut-fleet-cutout.py` and call `keep_only` twice
  (OR the two masks together), then `erase` / `largest_blob` / `tighten` / `straighten`
  / `trim` exactly as `cmd_finish` does:

      keep boxes: (520,168,250,1660) union (495,1700,25,74) union (770,1700,10,38)
      erase: (520,700,73,90), (520,1388,70,50), (692,450,80,940)

  gives `m1-cut.png` (**277x1641**, was 252x1641 with only the first box). Then:

      $V scripts/cut-fleet-cutout.py restore m1-cut.png m1-ogive.png --until 400
      $V scripts/cut-fleet-cutout.py finish m1-ogive.png m1-clipped.png \
          --erase 89,1100,6,169 --keep-all-blobs --keep-halo --no-straighten --feather 0
      $V scripts/cut-fleet-cutout.py patch m1-clipped.png m1-v12.png \
          --box 99,1136,26,70,170 --box 94,1200,38,66,110 --blend 1
      $V scripts/cut-fleet-cutout.py patch m1-v12.png m1-v12.png \
          --box 95,1266,36,3,110 --blend 0
      $V scripts/cut-fleet-cutout.py patch m1-v12.png public/media/rockets/marauder-i.png \
          --box 175,1372,14,25,-80 --blend 1
      $V scripts/cut-fleet-cutout.py patch public/media/rockets/marauder-i.png public/media/rockets/marauder-i.png \
          --box 175,1372,14,3,-80 --blend 0

  Every x coordinate from `restore` onward is **+19 px** versus the original 252-wide
  cut, because the wider `--keep` moved the trim bbox's left edge. Verified empirically
  (compare `xmin` at a few mid-body rows between the 252-wide and 277-wide `m1-cut.png`,
  it's +19 to +20 everywhere from the nose to the saddle marks); `restore`'s own
  `body_centre` fit needs no adjustment since it recomputes the centreline from the
  mask each time.

  `-rotate 90` (clockwise, so the nose ends up at the top) happens between the mask and
  finish steps because the model wants the photo as shot. `--keep` starts at the real
  silver tip (rotated y=168); rows 80-155 above that are a guy wire, not cone. The
  `--erase` boxes stay **beside the body**, y>=450, so they cannot cut a vertical
  chord through the ogive. An earlier finish used `--erase 400,170,193,1380`
  (x<=593 through the nose) and `--erase 671,170,140,170` (x>=671 at the shoulder);
  those two boxes are what flattened the left taper into a knife.

### The ogive was rebuilt from the lit half, not from a new model
Robin asked to infill the still-cut left side of the nose. Re-matting with a
different rembg model does not help: BiRefNet already holds the right (sky-lit)
limb, and the left limb is a black cone in its own shadow against dark grass, so
the matte fills the taper with a vertical chord of leftover shade. A cone of
revolution is symmetric about the body axis, so `restore` copies each ogive row's
solid right-edge pixels across that axis (and clips leftover shade on the first
80 body rows so the paint join doesn't step). Every pixel is still from this
photograph, of this vehicle, of this row. Verify: per-row `|L-R|` on the ogive
is 0, the tip sits on the centreline, and xmin does not freeze while xmax grows.

The left `patch` boxes are the tripod saddle's shadow on the tube face, cloned from
plain red 170px / 110px further aft. The last three rows of that hole sit against
the fin root, so they are a hard clone (`--blend 0`) — a cosine ramp there mixed
the hole back in. The right-side box at `156,1372` is a second saddle mark just
above the right fin, cloned from 80px further forward. Do not patch above the MES
logo: a first try at `78,544,28,50,-110` copied darker paint from the cone join
and read as a rectangular shadow. The small dark mark left of the flame is a rivet
at the coupler, and the D-shaped piece on the left edge is a rail button — both
stay. The `--erase 70,1100,6,169` clips the saddle and a 4px black spike at
rows 1224-1227 (the nick Robin arrowed, just above the fins) plus a 1px black
fringe along that limb. It must stop before row 1269 or it bites a fin. The dark triangle in
the centre of the tube above the fins is the **middle red fin in its own shadow**,
not a hole — leave it.

### Two more defects found after shipping, fixed 2026-08-26 (Claude Code)
Robin flagged the shipped cutout twice more, on the live index page fleet lineup.

**Fin tips were clipped.** The `--keep 520,168,250,1660` box is only 250px wide;
`measure` on the raw rotated mask shows the fins actually reach x501-776 (the box
covers 520-770), so both tips were cut flat instead of tapering to a point — most
visible on the left fin, which lost 67 rows pinned at the canvas edge instead of
sweeping to a tip. This was never a matting failure, just a keep box too narrow for
the real fin span. Fix: add two small keep boxes for just the tip rows (`measure`
gave rows 1700-1764 on the left, 1704-1728 on the right, well clear of the tripod
stand contamination which is confined to rows 664-1624) rather than widening the
main box, since the main box's left edge is also what removes the stand and
widening it uniformly would let the stand back in for most of the body. Canvas
grew from 252 to 277px wide to fit the recovered tips; see the reproduce block above.
A hand-patched version of this (extrapolating the clipped rows outward, no re-cut)
shipped briefly first and was replaced by this proper re-cut per Robin's request to
redo it "from scratch like Osiris/Nimbus" rather than paper over the crop.

**A black hook-shaped mark on the tube, just above the right fin.** Root cause: the
`--box 156,1372,12,22,-80` patch (now `175,1372,14,25,-80` after the +19 shift above)
was sized to the saddle mark's core but one column and a few rows short on the far
edge, so a sliver of the original dark saddle contact survived at the patch's own
boundary (verified by diffing `m1-v12.png` before/after that patch: column x=168
stayed at R~100-130 against R~230 neighbours, and row 1394 — one past the box's
`y+h` — was never touched). Fix: box width 12→14, height 22→25. Verified clean by
sampling the red channel across the patched rows afterward (should stay >170, was
dropping to 68-130 before).

### Two defects Robin caught on the live page, and what they actually were
- **"The nosecone is chipped."** It was not the cone. A **guy wire** runs diagonally
  behind the rocket and the mask fused a fragment of it at rows 150-168, immediately
  above and left of the silver tip, which reads as a bite out of the cone. The tip is
  intact in the source. Starting `--keep` at row 170 removes it. The old box at
  `678,150,110,200` was aimed at this wire and missed, because the wire is at x 605-661,
  left of the box, not right of it.
- **"The stands are still in frame."** Two separate problems. The legs and arms were
  already gone; what was left was the two points where a saddle *touches* the tube.
  Where the saddle breaks past the tube's edge, masking removes it (rows 725-790 and
  1398-1447). But the padded rollers sit **in front of** the tube's lower edge from this
  angle, so cutting those out would punch a hole in the airframe. Those two, and only
  those two, are `patch`ed: 9x17px at the upper saddle and 31x19px at the lower.

### About the patched areas — read before touching them
`patch` refills a box with the airframe's own pixels from further along its own axis. A
painted tube is a cylinder of revolution, so at a fixed distance from the axis the
colour barely changes along its length, which makes this a reconstruction *from the
photograph of this vehicle* rather than anything invented. Constraints that make it
legitimate, and that must hold for any future use:

- Only uniform paint that a fitting was resting against. **Never a shape, an edge, a
  marking or a fin.**
- The source window must be verified clear of lettering, seams and rivets first. A
  first attempt cloned part of the MES flame logo into the tube and left a white sliver
  across it. Clean windows on this canvas are rows 430-531 and 1280-1384 for x 78-115.
- Check afterwards that no dark desaturated blob >=40px remains on the tube. Two ~55px
  regions do remain and are correct: they are the 1px shadow line along the tube's
  shaded limb, not hardware.
- **The fins are the whole difficulty, and they nearly cost the frame.** An early cut
  with a box tight to the body clipped both fin tips, and the grey ragged shape left
  over reads as a masking artifact rather than as a fin. The fins are large: they reach
  rotated x 558-767 against a body at 593-691.

### Identity flag for Robin, worth an eye
`-08` and `-09` (the frames this shortlist originally nominated for the cutout) show a
**bare chrome nose cone**, not the navy-with-silver-tip cone in `-02` and `-05`. Either
a nose was swapped between sessions or that is a different airframe. Do not mix frames
from the two sets in one gallery until this is settled.

## Draft captions (Robin must verify in ReviewMode)
- integration: "The Marauder I team with the airframe, Launch Canada 2022."
- on the pad: "Marauder I on the rail."
- liftoff: "Marauder I clears the pad." — **only if Robin confirms this flight is Marauder I.**
- recovery: (no shot)

## Rejected / kept but not shortlisted
- `marauder-i-02.webp`: rocket under the team tent, strong alternate integration.
- `marauder-i-03.webp`: team carrying the airframe to the pad.
- `marauder-i-04.webp`: horizontal on the rail, backup for the pad slot.
- `marauder-i-06.webp`: wider pad shot, same moment as `-05`.
- `marauder-i-10.webp`: "MCMASTER 23" on the tube during workshop assembly.
- `marauder-i-11.webp`: loading the rocket onto the rail.
- `marauder-i-12.webp`: product shot on stands, fins in frame; cutout backup.
- Album also contains other teams' indoor display rockets (sheet `2-7`, `2-8` ANTARES), travel, and Cochrane sightseeing. Not imported.

## Source mapping (if renamed)
| Original name | Renamed to | Notes |
|---|---|---|
| `MicrosoftTeams-image (17).png` | `marauder-i-01.webp` | sheet 7-1 |
| `IMG_1291.HEIC` | `marauder-i-02.webp` | sheet 1-15 |
| `IMG_20220805_112921802.jpg` | `marauder-i-03.webp` | sheet 5-10 |
| `IMG_20220805_142319440.jpg` | `marauder-i-04.webp` | sheet 5-22 |
| `IMG_20220805_142650992.jpg` | `marauder-i-05.webp` | sheet 5-23; replaced the camera-named webp already in this folder |
| `IMG_20220805_142656298.jpg` | `marauder-i-06.webp` | sheet 5-24 |
| `eo57bdhnob3k5y5p94lk.jpg` | `marauder-i-07.webp` | sheet 1-8; vehicle identity unconfirmed |
| `MicrosoftTeams-image (8).png` | `marauder-i-08.webp` | sheet 7-17; cutout candidate |
| `MicrosoftTeams-image (5).png` | `marauder-i-09.webp` | sheet 7-14 |
| `20220730_143122.jpg` | `marauder-i-10.webp` | sheet 1-2 |
| `IMG_20220805_142028158.jpg` | `marauder-i-11.webp` | sheet 5-21 |
| `IMG_1289.HEIC` | `marauder-i-12.webp` | sheet 1-14 |

Camera-original files that were in `rockets/marauder-i/` (`Image.jpeg` … `Image10.jpeg`, `IMG_20220805_142650992.webp`) were re-encoded into this sequence or superseded by the zip masters and removed, same as Luminis.

Full source album remains at `/home/robin/Downloads/MRT-photo-review/LC2022/` — not copied into the repo.

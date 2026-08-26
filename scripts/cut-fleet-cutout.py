#!/usr/bin/env python3
"""Cut a fleet-lineup cutout from a vehicle photo.

Produces the shape `public/media/rockets/<slug>.png` already ships: an RGBA PNG
of one airframe, nose up, axis vertical, trimmed tight to its own alpha. The
existing nimbus.png and osiris.png were cut by hand with no record of how, so
this exists to make the next one reproducible.

Needs the rembg venv (rembg, scipy, numpy, pillow):

    /home/robin/.cache/mrt-rembg/bin/python scripts/cut-fleet-cutout.py cut \\
        rockets/luminis/luminis-01.webp public/media/rockets/luminis.png

Background removal is a matting model, not image generation: every pixel that
survives comes from the photograph. Rotation is the only geometry change, and
nothing is ever scaled on one axis, because the lineup renders height as a
claim about the vehicle's real length.
"""

from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image

# BiRefNet, not the isnet default. On the same Marauder I frame isnet returned
# a matte 17.7% partially transparent and lost both carbon-weave fins (one
# against a tent, one against grass) while keeping a guy wire fused to the
# nose; BiRefNet returned 1.1% and held the fins, the aft ring and the rail
# buttons. It is a ~900MB one-time download and about 15s per frame on CPU,
# which is worth it: the fin edge is the whole silhouette at lineup size.
MODEL = "birefnet-general"

# Match the soft edge the two hand-cut PNGs already have (~1.1-1.5% of pixels
# partially transparent). A hard-thresholded alpha shimmers at the 40px width
# the lineup actually renders.
FEATHER = 0.6
# Rows near the nose taper and the fin flare pull the centreline fit off the
# body axis, so the fit ignores them.
FIT_MARGIN = 0.12


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def run_rembg(img: Image.Image, model: str) -> Image.Image:
    try:
        from rembg import new_session, remove
    except ImportError:
        raise SystemExit(
            "rembg not importable. Run this with the venv python:\n"
            "  /home/robin/.cache/mrt-rembg/bin/python " + " ".join(sys.argv)
        )
    return remove(img, session=new_session(model))


def alpha_of(img: Image.Image) -> np.ndarray:
    return np.array(img.getchannel("A"), dtype=np.uint8)


def erase(img: Image.Image, boxes: list[tuple[int, int, int, int]]) -> Image.Image:
    """Zero the alpha inside x,y,w,h boxes: launch rails, stands, bystanders."""
    a = alpha_of(img)
    for x, y, w, h in boxes:
        a[y : y + h, x : x + w] = 0
    out = img.copy()
    out.putalpha(Image.fromarray(a))
    return out


def keep_only(img: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    """Zero the alpha outside one x,y,w,h box.

    Whatever the airframe is standing on touches it, so it lands in the same
    connected region and survives largest_blob. Isolating the airframe by its
    own bounding box is the cheapest honest fix: read the numbers off the mask
    (see --measure) and keep the rows above the stand.
    """
    x, y, w, h = box
    a = alpha_of(img)
    mask = np.zeros_like(a)
    mask[y : y + h, x : x + w] = a[y : y + h, x : x + w]
    out = img.copy()
    out.putalpha(Image.fromarray(mask))
    return out


def body_centre(img: Image.Image, thresh: int = 24) -> float:
    """Median midpoint of mid-body rows. Nose and fins are excluded."""
    a = alpha_of(img) > thresh
    h = a.shape[0]
    cxs = []
    for y in range(int(h * 0.35), int(h * 0.70)):
        xs = np.flatnonzero(a[y])
        if xs.size > 40:
            cxs.append((xs[0] + xs[-1]) / 2)
    if not cxs:
        raise SystemExit("cannot find a body centreline")
    return float(np.median(cxs))


def _solid_hi(row: np.ndarray, core: int = 180) -> int:
    """Rightmost solid, non-sky pixel. Sky-tinted fringe is not the airframe."""
    a = row[:, 3]
    r, g, b = row[:, 0], row[:, 1], row[:, 2]
    sky = (b > r + 15) & (b > 100)
    xs = np.flatnonzero((a > core) & ~sky)
    return int(xs[-1]) if xs.size else -1


def restore_ogive(img: Image.Image, until: int, thresh: int = 24) -> Image.Image:
    """Rebuild a nose cone as a surface of revolution from its well-lit half.

    A cone of revolution is symmetric about the body axis. On a side elevation
    the sky-lit limb is the one the matte keeps; the shaded limb picks up
    tent/grass/guy-wire and reads as a vertical knife. For each row of the
    ogive, the radius is the distance from the body centreline to the *solid*
    right edge, and the left half is copied from those same pixels mirrored
    across the axis. Each row is rebuilt from zeros so leftover shade on the
    left cannot survive. A 1-row bite on the lit limb is filled with that
    row's own rim pixel, then mirrored.

    Same honesty rule as patch: every surviving pixel is from this photograph,
    of this vehicle, of this row. Nothing is generated or sampled from another
    y. Do not run this past the ogive onto lettering or fins.
    """
    arr = np.array(img)
    h, w = arr.shape[:2]
    if until < 1 or until > h:
        raise SystemExit(f"--until {until} is outside 1..{h}")
    cx = body_centre(img, thresh)
    hi_of = np.array([_solid_hi(arr[y]) for y in range(until)], dtype=np.int32)
    r_raw = np.array([max(0.0, hi - cx) if hi >= 0 else 0.0 for hi in hi_of])

    r = r_raw.copy()
    k = 4
    for y in range(until):
        lo, hi = max(0, y - k), min(until, y + k + 1)
        window = r_raw[lo:hi]
        window = window[window > 0]
        if window.size:
            r[y] = float(np.median(window))
    for y in range(1, until):
        r[y] = max(r[y], r[y - 1])

    mirrored = 0
    filled = 0
    for y in range(until):
        hi = int(hi_of[y])
        if hi < 0:
            xs = np.flatnonzero(arr[y, :, 3] > 24)
            if xs.size == 0:
                continue
            lo_s, hi_s = int(xs[0]), int(xs[-1])
            n = min(3, hi_s - lo_s + 1)
            row = np.zeros_like(arr[y])
            dst0 = int(round(cx)) - n // 2
            dst1 = dst0 + n
            if dst0 >= 0 and dst1 <= w:
                row[dst0:dst1] = arr[y, hi_s - n + 1:hi_s + 1]
                arr[y] = row
            continue
        radius = float(r[y])
        if radius < 1:
            radius = max(1.0, hi - cx)
        x_left = int(np.floor(cx - radius))
        x_right = int(np.ceil(cx + radius))
        if x_left < 0 or x_right >= w:
            continue
        row = np.zeros_like(arr[y])
        rim = arr[y, hi] if hi >= 0 else None
        for x in range(int(np.floor(cx)), x_right + 1):
            if hi >= 0 and x <= hi:
                row[x] = arr[y, x]
            elif rim is not None and rim[3] > 0:
                row[x] = rim
                filled += 1
        x_mid = int(np.floor(cx))
        for x in range(x_left, x_mid + 1):
            src = int(round(2 * cx - x))
            if 0 <= src < w and row[src, 3]:
                row[x] = row[src]
        arr[y] = row
        mirrored += 1
    # Body rows just below the ogive still carry leftover shade on the left,
    # which reads as a step at the paint join. Clip that extra; do not mirror
    # (lettering and rail buttons live here).
    blend = min(h, until + 80)
    clipped = 0
    for y in range(until, blend):
        xs = np.flatnonzero(arr[y, :, 3] > 24)
        if xs.size < 20:
            continue
        hi = int(xs[-1])
        x_left = int(np.floor(cx - (hi - cx)))
        if x_left > 0 and xs[0] < x_left:
            arr[y, :x_left] = 0
            clipped += 1
    print(f"  restore_ogive: cx={cx:.1f}  mirrored {mirrored} rows, "
          f"rim-filled {filled} px, left-clipped {clipped} body rows, until={until}")
    return Image.fromarray(arr, "RGBA")


def patch_axial(img: Image.Image, boxes: list[tuple[int, int, int, int, int]],
                blend: int = 4) -> Image.Image:
    """Refill a box with the airframe's own pixels from further along its axis.

    For the one thing masking cannot fix: hardware that sits *in front of* the
    airframe rather than beside it, so cutting it out would leave a hole. Both
    of Marauder I's tripod saddles do this, overlapping the tube's shaded limb.

    A painted tube is a cylinder of revolution, so at a fixed distance from the
    axis the colour barely changes along its length. Copying straight up or
    down the same columns therefore reconstructs the hidden surface from the
    real vehicle, with no model inventing anything. It is only valid over plain
    paint: pick an offset that clears lettering, seams and joints, or the clone
    duplicates them. Nothing here may be used to reconstruct a shape, only
    uniform surface a fitting was resting against.
    """
    arr = np.array(img).astype(np.float32)
    h_img, w_img = arr.shape[:2]
    for x, y, w, h, dy in boxes:
        sy = y + dy
        if sy < 0 or sy + h > h_img or x < 0 or x + w > w_img:
            raise SystemExit(f"patch source out of bounds: {x},{y},{w},{h},{dy}")
        src = arr[sy : sy + h, x : x + w].copy()
        dst = arr[y : y + h, x : x + w]
        b = min(max(0, blend), h // 2, w // 2)
        if b == 0:
            arr[y : y + h, x : x + w] = src
            print(f"  patch: {w}x{h} at {x},{y} cloned from dy={dy:+d} (hard)")
            continue
        # Cosine ramp on all four sides so the seam does not read as an edge.
        wy = np.ones(h, np.float32)
        wx = np.ones(w, np.float32)
        ramp = (1 - np.cos(np.linspace(0, np.pi, 2 * b))) / 2
        wy[:b], wy[-b:] = ramp[:b], ramp[b:][::-1]
        wx[:b], wx[-b:] = ramp[:b], ramp[b:][::-1]
        m = (wy[:, None] * wx[None, :])[..., None]
        arr[y : y + h, x : x + w] = dst * (1 - m) + src * m
        print(f"  patch: {w}x{h} at {x},{y} cloned from dy={dy:+d}")
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8), "RGBA")


def measure(img: Image.Image, step: int, thresh: int = 24) -> None:
    """Print the alpha's per-row extent, to pick --keep / --erase boxes."""
    m = alpha_of(img) > thresh
    rows = np.flatnonzero(m.any(axis=1))
    cols = np.flatnonzero(m.any(axis=0))
    if rows.size == 0:
        raise SystemExit("no alpha to measure")
    print(f"canvas {img.width}x{img.height}  rows {rows[0]}-{rows[-1]}  cols {cols[0]}-{cols[-1]}")
    print("   row:  xmin  xmax  width")
    for y in range(rows[0], rows[-1] + 1, step):
        xs = np.flatnonzero(m[y])
        if xs.size:
            print(f"{y:6d}: {xs[0]:5d} {xs[-1]:5d} {xs[-1] - xs[0] + 1:6d}")


def largest_blob(img: Image.Image, thresh: int = 24) -> Image.Image:
    """Keep only the biggest connected region of alpha.

    The matting model reliably also keeps whatever else stands against the sky
    (a person's head, a distant tree, pad hardware). Those come back as
    separate blobs, and the airframe is always the largest.
    """
    from scipy import ndimage

    a = alpha_of(img)
    labels, n = ndimage.label(a > thresh)
    if n <= 1:
        return img
    sizes = ndimage.sum(np.ones_like(labels), labels, range(1, n + 1))
    keep = int(np.argmax(sizes)) + 1
    a[labels != keep] = 0
    out = img.copy()
    out.putalpha(Image.fromarray(a))
    print(f"  largest_blob: dropped {n - 1} stray region(s)")
    return out


def tighten(img: Image.Image, core: int = 128, grow: int = 2) -> Image.Image:
    """Clip the matte's wide low-alpha halo back to a hairline edge.

    The matting model returns a gradual falloff around the subject: on Luminis
    that was ~12px of alpha 1-24, which is 6% of the canvas partially
    transparent against 1.1-1.5% on the two hand-cut PNGs. It matters because
    `.craft .rise img` in site.css draws its graphite rim from four 1px
    drop-shadows of the alpha silhouette, so a halo gets traced as the outline
    and the airframe reads as fuzzy at the ~45px width it renders at.
    """
    from scipy import ndimage

    a = alpha_of(img)
    solid = a > core
    if not solid.any():
        return img
    band = ndimage.binary_dilation(solid, iterations=max(0, grow))
    a[~band] = 0
    out = img.copy()
    out.putalpha(Image.fromarray(a))
    return out


def axis_slope(img: Image.Image, thresh: int = 24) -> float:
    """dx/dy of the airframe's centreline, by least squares over its rows."""
    a = alpha_of(img) > thresh
    rows = np.flatnonzero(a.any(axis=1))
    if rows.size < 10:
        raise SystemExit("almost no alpha: check the mask before straightening")
    lo, hi = rows[0], rows[-1]
    margin = int((hi - lo) * FIT_MARGIN)
    ys = np.arange(lo + margin, hi - margin + 1)
    xs = np.array([a[y].nonzero()[0].mean() for y in ys])
    slope, _ = np.polyfit(ys, xs, 1)
    return float(slope)


def straighten(img: Image.Image) -> Image.Image:
    """Rotate the airframe axis to vertical.

    The sign is decided by measurement, not by reasoning about PIL's rotation
    convention: both candidates are tried on a small copy and the one that
    flattens the slope wins.
    """
    slope = axis_slope(img)
    deg = math.degrees(math.atan(slope))
    if abs(deg) < 0.05:
        print(f"  straighten: already vertical ({deg:+.2f}deg)")
        return img
    probe = img.resize((max(1, img.width // 4), max(1, img.height // 4)), Image.BILINEAR)
    scored = []
    for cand in (deg, -deg):
        try:
            scored.append((abs(axis_slope(probe.rotate(cand, resample=Image.BILINEAR, expand=True))), cand))
        except SystemExit:
            continue
    if not scored:
        return img
    _, best = min(scored)
    print(f"  straighten: {slope:+.4f} dx/dy -> rotating {best:+.2f}deg")
    return img.rotate(best, resample=Image.BICUBIC, expand=True)


def feather(img: Image.Image, radius: float) -> Image.Image:
    if radius <= 0:
        return img
    from PIL import ImageFilter

    out = img.copy()
    out.putalpha(img.getchannel("A").filter(ImageFilter.GaussianBlur(radius)))
    return out


def trim(img: Image.Image) -> Image.Image:
    box = img.getchannel("A").point(lambda v: 255 if v > 0 else 0).getbbox()
    if box is None:
        raise SystemExit("nothing left after masking")
    return img.crop(box)


def report(img: Image.Image, label: str) -> None:
    a = alpha_of(img).astype(np.float32) / 255.0
    soft = float(((a > 0.02) & (a < 0.98)).mean() * 100)
    print(f"  {label}: {img.width}x{img.height}  soft-edge {soft:.2f}%  opaque {a.mean() * 100:.1f}%")


def cmd_mask(src: Path, dst: Path, model: str) -> None:
    out = run_rembg(load_rgba(src), model)
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst)
    report(out, "mask")
    print(f"mask: {src} -> {dst}")


def cmd_finish(
    src: Path,
    dst: Path,
    boxes: list[tuple[int, int, int, int]],
    keep: tuple[int, int, int, int] | None,
    keep_largest: bool,
    halo_grow: int | None,
    do_straighten: bool,
    feather_radius: float,
    height: int | None,
) -> None:
    img = load_rgba(src)
    if keep:
        img = keep_only(img, keep)
    if boxes:
        img = erase(img, boxes)
    if keep_largest:
        img = largest_blob(img)
    if halo_grow is not None:
        img = tighten(img, grow=halo_grow)
    if do_straighten:
        img = straighten(img)
    img = trim(img)
    if height:
        w = max(1, round(img.width * height / img.height))
        img = img.resize((w, height), Image.LANCZOS)
    img = feather(img, feather_radius)
    img = trim(img)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst)
    report(img, "finish")
    print(f"finish: {src} -> {dst}")


def parse_box(s: str) -> tuple[int, int, int, int]:
    parts = [int(v) for v in s.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("--erase wants X,Y,W,H")
    return tuple(parts)  # type: ignore[return-value]


def parse_patch(s: str) -> tuple[int, int, int, int, int]:
    parts = [int(v) for v in s.split(",")]
    if len(parts) != 5:
        raise argparse.ArgumentTypeError("--box wants X,Y,W,H,DY")
    return tuple(parts)  # type: ignore[return-value]


def add_finish_args(p: argparse.ArgumentParser) -> None:
    p.add_argument("--keep", type=parse_box, metavar="X,Y,W,H",
                   help="zero the alpha outside this box, e.g. the airframe above its stand")
    p.add_argument("--erase", type=parse_box, action="append", default=[],
                   metavar="X,Y,W,H", help="zero the alpha in this box, repeatable")
    p.add_argument("--keep-all-blobs", action="store_true",
                   help="skip largest-region filtering")
    p.add_argument("--halo-grow", type=int, default=2,
                   help="px of soft edge kept outside the solid core (default 2)")
    p.add_argument("--keep-halo", action="store_true",
                   help="keep the matte's full falloff, no trimap clip")
    p.add_argument("--no-straighten", action="store_true")
    p.add_argument("--feather", type=float, default=FEATHER)
    p.add_argument("--height", type=int, help="resize to this height, aspect kept")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    m = sub.add_parser("mask", help="photo -> RGBA, background removed")
    m.add_argument("src")
    m.add_argument("dst")
    m.add_argument("--model", default=MODEL)

    f = sub.add_parser("finish", help="RGBA -> straightened, trimmed cutout")
    f.add_argument("src")
    f.add_argument("dst")
    add_finish_args(f)

    ms = sub.add_parser("measure", help="print per-row alpha extent of a mask")
    ms.add_argument("src")
    ms.add_argument("--step", type=int, default=60)

    pt = sub.add_parser("patch", help="reclone a box from further along the airframe axis")
    pt.add_argument("src")
    pt.add_argument("dst")
    pt.add_argument("--box", type=parse_patch, action="append", required=True,
                    metavar="X,Y,W,H,DY", help="refill this box from DY rows away, repeatable")
    pt.add_argument("--blend", type=int, default=4)

    rs = sub.add_parser("restore", help="rebuild an ogive from its well-lit half")
    rs.add_argument("src")
    rs.add_argument("dst")
    rs.add_argument("--until", type=int, required=True,
                    help="last row of the ogive (exclusive of the body tube)")

    c = sub.add_parser("cut", help="mask then finish, keeping the raw mask beside dst")
    c.add_argument("src")
    c.add_argument("dst")
    c.add_argument("--model", default=MODEL)
    add_finish_args(c)

    a = p.parse_args()
    if a.cmd == "mask":
        cmd_mask(Path(a.src), Path(a.dst), a.model)
        return
    if a.cmd == "measure":
        measure(load_rgba(Path(a.src)), a.step)
        return
    if a.cmd == "patch":
        out = patch_axial(load_rgba(Path(a.src)), a.box, a.blend)
        Path(a.dst).parent.mkdir(parents=True, exist_ok=True)
        out.save(a.dst)
        report(out, "patch")
        print(f"patch: {a.src} -> {a.dst}")
        return
    if a.cmd == "restore":
        out = trim(feather(restore_ogive(load_rgba(Path(a.src)), a.until), FEATHER))
        out = trim(out)
        Path(a.dst).parent.mkdir(parents=True, exist_ok=True)
        out.save(a.dst)
        report(out, "restore")
        print(f"restore: {a.src} -> {a.dst}")
        return
    halo = None if a.keep_halo else a.halo_grow
    if a.cmd == "finish":
        cmd_finish(Path(a.src), Path(a.dst), a.erase, a.keep, not a.keep_all_blobs,
                   halo, not a.no_straighten, a.feather, a.height)
        return
    dst = Path(a.dst)
    raw = dst.with_name(dst.stem + "-mask.png")
    cmd_mask(Path(a.src), raw, a.model)
    cmd_finish(raw, dst, a.erase, a.keep, not a.keep_all_blobs, halo,
               not a.no_straighten, a.feather, a.height)


if __name__ == "__main__":
    main()

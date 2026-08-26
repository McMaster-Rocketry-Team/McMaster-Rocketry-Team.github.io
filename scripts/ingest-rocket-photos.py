#!/usr/bin/env python3
"""Rocket photo ingest. Convention from rockets/PHOTO-HANDOFF.md:

    magick <src>[0] -auto-orient -resize '2000x2000>' -quality 82 <dst>.webp

Stills only. No videos, no DNG. Source albums stay outside the repo.
"""

from __future__ import annotations

import argparse
import csv
import os
import subprocess
import sys
import zipfile
from pathlib import Path

STILL_EXT = {".jpg", ".jpeg", ".png", ".heic", ".webp"}
SKIP_EXT = {".mp4", ".mov", ".m4v", ".dng"}
TILE = 5
PER_SHEET = TILE * TILE
THUMB = 240


def magick(*args: str) -> None:
    cmd = ["magick", *args]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd)}\n{r.stderr.strip()}")


def convert_webp(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    # [0] takes the first frame of HEIC/video-poster containers.
    magick(
        f"{src}[0]",
        "-auto-orient",
        "-resize",
        "2000x2000>",
        "-quality",
        "82",
        str(dst),
    )


def is_junk(name: str) -> bool:
    base = os.path.basename(name)
    return (
        name.endswith("/")
        or "__MACOSX" in name
        or base.startswith(".")
        or base in {"Thumbs.db", "desktop.ini"}
    )


def cmd_extract(zip_path: Path, dest: Path) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    kept = skipped = 0
    with zipfile.ZipFile(zip_path) as zf:
        for info in zf.infolist():
            if is_junk(info.filename) or info.is_dir():
                continue
            ext = Path(info.filename).suffix.lower()
            if ext in SKIP_EXT or ext not in STILL_EXT:
                skipped += 1
                continue
            target = dest / info.filename
            target.parent.mkdir(parents=True, exist_ok=True)
            if target.exists() and target.stat().st_size == info.file_size:
                kept += 1
                continue
            with zf.open(info) as src, open(target, "wb") as out:
                out.write(src.read())
            kept += 1
    print(f"extract: {kept} stills → {dest}  (skipped {skipped})")


def iter_stills(src: Path) -> list[Path]:
    files = [
        p
        for p in src.rglob("*")
        if p.is_file() and p.suffix.lower() in STILL_EXT and not is_junk(str(p))
    ]
    files.sort(key=lambda p: str(p).lower())
    return files


def cmd_sheets(src: Path, dest: Path, prefix: str) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    files = iter_stills(src)
    if not files:
        raise SystemExit(f"no stills under {src}")
    thumbs_dir = dest / f".thumbs-{prefix}"
    thumbs_dir.mkdir(exist_ok=True)
    manifest = dest / f"{prefix}-manifest.csv"
    rows = []
    n_sheets = (len(files) + PER_SHEET - 1) // PER_SHEET
    print(f"sheets: {len(files)} stills → {n_sheets} sheets ({prefix})")
    for i, src_file in enumerate(files):
        sheet_num = i // PER_SHEET + 1
        cell = i % PER_SHEET + 1
        label = f"{sheet_num}-{cell}"
        thumb = thumbs_dir / f"{sheet_num:03d}-{cell:02d}.jpg"
        if not thumb.exists():
            magick(
                f"{src_file}[0]",
                "-auto-orient",
                "-resize",
                f"{THUMB}x{THUMB}>",
                "-background",
                "white",
                "-gravity",
                "center",
                "-extent",
                f"{THUMB}x{THUMB}",
                "-quality",
                "70",
                str(thumb),
            )
        rows.append(
            {
                "sheet_file": f"{prefix}_{sheet_num:03d}.jpg",
                "sheet_num": sheet_num,
                "cell_num": cell,
                "label": label,
                "original_path": str(src_file),
            }
        )
    with open(manifest, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    for sheet_num in range(1, n_sheets + 1):
        out = dest / f"{prefix}_{sheet_num:03d}.jpg"
        batch = [
            str(thumbs_dir / f"{sheet_num:03d}-{c:02d}.jpg")
            for c in range(1, PER_SHEET + 1)
            if (thumbs_dir / f"{sheet_num:03d}-{c:02d}.jpg").exists()
        ]
        labeled = []
        for idx, path in enumerate(batch, start=1):
            labeled.extend(["-label", f"{sheet_num}-{idx}", path])
        magick(
            "montage",
            *labeled,
            "-tile",
            f"{TILE}x{TILE}",
            "-geometry",
            f"{THUMB}x{THUMB}+4+16",
            "-title",
            f"{prefix} sheet {sheet_num}/{n_sheets}",
            "-quality",
            "75",
            str(out),
        )
        print(f"  wrote {out.name} ({len(batch)} cells)")
    print(f"manifest: {manifest}")


def cmd_convert(src: Path, dst: Path) -> None:
    convert_webp(src, dst)
    print(f"convert: {src} → {dst}")


def cmd_import(slug: str, dest: Path, start: int, sources: list[Path]) -> None:
    dest.mkdir(parents=True, exist_ok=True)
    n = start
    mapping = []
    for src in sources:
        if not src.is_file():
            raise SystemExit(f"missing: {src}")
        dst = dest / f"{slug}-{n:02d}.webp"
        convert_webp(src, dst)
        mapping.append((str(src), dst.name))
        print(f"  {src.name} → {dst.name}")
        n += 1
    print(f"import: {len(sources)} files → {dest} ({slug}-{start:02d} … {slug}-{n-1:02d})")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest="cmd", required=True)

    e = sub.add_parser("extract", help="unzip stills only")
    e.add_argument("zip")
    e.add_argument("dest")

    s = sub.add_parser("sheets", help="5×5 labeled contact sheets")
    s.add_argument("src")
    s.add_argument("dest")
    s.add_argument("--prefix", required=True)

    c = sub.add_parser("convert", help="one file → 2000px webp")
    c.add_argument("src")
    c.add_argument("dst")

    i = sub.add_parser("import", help="named sources → slug-NN.webp")
    i.add_argument("--slug", required=True)
    i.add_argument("--dest", required=True)
    i.add_argument("--start", type=int, default=1)
    i.add_argument("sources", nargs="+")

    args = p.parse_args()
    try:
        if args.cmd == "extract":
            cmd_extract(Path(args.zip), Path(args.dest))
        elif args.cmd == "sheets":
            cmd_sheets(Path(args.src), Path(args.dest), args.prefix)
        elif args.cmd == "convert":
            cmd_convert(Path(args.src), Path(args.dst))
        elif args.cmd == "import":
            cmd_import(args.slug, Path(args.dest), args.start, [Path(x) for x in args.sources])
    except RuntimeError as err:
        print(err, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

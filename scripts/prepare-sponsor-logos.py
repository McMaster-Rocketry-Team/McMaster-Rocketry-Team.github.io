#!/usr/bin/env python3
"""Process sponsor logos into public/media/sponsors/."""
from __future__ import annotations

import re
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "sponsors"
TMP = Path("/tmp/sponsor-fetch")
SP2022 = (
    Path.home()
    / "Downloads/OneDrive_2026-08-26/Archive (Pre 2024-2025)/Sponsorship/Archive/McMaster Rocketry Sponsorship Package 2022 V1.pdf"
)
UA = {"User-Agent": "Mozilla/5.0 (McMaster Rocketry site build)"}


def fetch(url: str, dest: Path) -> None:
    req = urllib.request.Request(url, headers=UA)
    dest.write_bytes(urllib.request.urlopen(req, timeout=30).read())


def png_to_webp(src: Path, dest: Path, trim_black: bool = False) -> None:
    cmd = ["magick", str(src)]
    if trim_black:
        cmd += ["-fuzz", "12%", "-transparent", "black"]
    cmd += ["-resize", "480x240>", "-background", "none", str(dest)]
    subprocess.run(cmd, check=True)


def svg_copy(src: Path, dest: Path, *, replace_white: str | None = None) -> None:
    text = src.read_text(encoding="utf-8")
    if replace_white:
        text = text.replace('fill="white"', f'fill="{replace_white}"')
    dest.write_text(text, encoding="utf-8")


def extract_isaac_logo() -> None:
    html = urllib.request.urlopen(
        urllib.request.Request("https://isaacteam.com/", headers=UA)
    ).read().decode("utf-8", "replace")
    for m in re.finditer(r"<svg[^>]*>.*?</svg>", html, re.S):
        s = m.group(0)
        if "Isaac Operations" in s:
            (TMP / "isaac-operations.svg").write_text(s, encoding="utf-8")
            return
    raise RuntimeError("Isaac Operations logo not found on isaacteam.com")


def ensure_sp2022_logos() -> Path:
    d = TMP / "sp2022"
    d.mkdir(parents=True, exist_ok=True)
    if not (d / "p9--000.png").exists() and SP2022.exists():
        subprocess.run(
            ["pdfimages", "-png", "-f", "9", "-l", "9", str(SP2022), str(d / "p9-")],
            check=True,
        )
    return d


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    sp2022 = ensure_sp2022_logos()

    jobs: list[tuple[str, str, str, bool]] = [
        ("mda-space", "svg", "https://upload.wikimedia.org/wikipedia/commons/3/30/MDA_Ltd._Logo.svg", False),
        ("mcmaster-engineering", "svg", "https://www.eng.mcmaster.ca/app/themes/mcmaster-eng/assets/images/svgs/mce-main-logo.svg", False),
        ("mes", "png", str(sp2022 / "p9--000.png"), True),
        ("origin-innovations", "svg", "https://origininnovations.ca/wp-content/uploads/2025/08/OI_Logo.svg", False),
        ("solidworks", "png", str(sp2022 / "p9--006.png"), True),
        ("onshape", "svg", "https://www.onshape.com/cdn-images/10e570b55cedf57260097bb7e67d1ec7a64815da-189x43.svg", False),
        ("altium", "png", str(sp2022 / "p9--004.png"), True),
        ("aversan", "png", "https://www.aversan.com/wp-content/uploads/2025/04/Aversan-logo-1.png", False),
    ]

    for slug, kind, source, trim in jobs:
        dest = OUT / f"{slug}.{'svg' if kind == 'svg' else 'webp'}"
        raw = TMP / f"{slug}-raw{Path(source).suffix if source.startswith('http') else Path(source).suffix}"
        if source.startswith("http"):
            fetch(source, raw)
            source_path = raw
        else:
            source_path = Path(source)
        if kind == "svg":
            replace = "#1a1a1a" if slug == "onshape" else None
            svg_copy(source_path, dest, replace_white=replace)
        else:
            png_to_webp(source_path, dest, trim_black=trim)

    extract_isaac_logo()
    svg_copy(TMP / "isaac-operations.svg", OUT / "isaac-operations.svg")

    print("Wrote sponsor logos to", OUT)
    for p in sorted(OUT.iterdir()):
        print(f"  {p.name} ({p.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Ingest a Void Lake SRAD flight_log export into vehicles.json.

Source is a zip containing `flight_log.csv` (CAN telemetry at ~200 Hz).
Run against the master in media-source/ or a local export:

    python scripts/ingest-flight-log.py media-source/osiris-void-lake-flight-log.zip
    python scripts/ingest-flight-log.py --vehicle osiris --write media-source/osiris-void-lake-flight-log.zip
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VEHICLES = ROOT / "src" / "data" / "vehicles.json"
G_STD = 9.80665
M_TO_FT = 3.28084
# OpenRocket FDR (Rev R0, 2026-07-08) — published over Void Lake KF velocity.
OSIRIS_MACH = 1.92
OSIRIS_PEAK_VELOCITY_M_S = 642.5


def speed_of_sound_isa(temp_c: float) -> float:
    return 331.3 * math.sqrt(1 + temp_c / 273.15)


def isa_temp_c(alt_agl_m: float) -> float:
    return 15.0 - 0.0065 * alt_agl_m


def parse_log(csv_path: Path) -> dict:
    pad_alt: float | None = None
    max_alt_asl = 0.0
    ascent_peak_vel = 0.0
    ascent_peak_vel_alt_asl = 0.0
    ascent_peak_accel_g = 0.0
    first_drogue_asl: float | None = None
    first_main_asl: float | None = None

    with csv_path.open(newline="") as handle:
        for row in csv.DictReader(handle):
            if pad_alt is None and row.get("launch_pad_altitude_asl"):
                pad_alt = float(row["launch_pad_altitude_asl"])

            stage = row.get("flight_stage", "")

            if row.get("deployment_kf_altitude_asl"):
                alt = float(row["deployment_kf_altitude_asl"])
                if alt > max_alt_asl:
                    max_alt_asl = alt

            if stage == "Ascent":
                if row.get("airbrakes_kf_vertical_velocity") and row.get(
                    "airbrakes_kf_altitude_asl"
                ):
                    vel = float(row["airbrakes_kf_vertical_velocity"])
                    alt = float(row["airbrakes_kf_altitude_asl"])
                    if vel > ascent_peak_vel:
                        ascent_peak_vel = vel
                        ascent_peak_vel_alt_asl = alt

                if row.get("acc_x") and row.get("acc_y") and row.get("acc_z"):
                    ax = float(row["acc_x"])
                    ay = float(row["acc_y"])
                    az = float(row["acc_z"])
                    g = math.sqrt(ax * ax + ay * ay + az * az) / G_STD
                    if g > ascent_peak_accel_g:
                        ascent_peak_accel_g = g

            if first_drogue_asl is None and row.get("pyro_drogue_fire", "").lower() == "true":
                if row.get("deployment_kf_altitude_asl"):
                    first_drogue_asl = float(row["deployment_kf_altitude_asl"])

            if first_main_asl is None and row.get("pyro_main_fire", "").lower() == "true":
                if row.get("deployment_kf_altitude_asl"):
                    first_main_asl = float(row["deployment_kf_altitude_asl"])

    if pad_alt is None:
        raise SystemExit("launch_pad_altitude_asl never set in log")

    apogee_ft = round((max_alt_asl - pad_alt) * M_TO_FT)
    peak_vel_ft_s = ascent_peak_vel * M_TO_FT
    peak_alt_agl_m = ascent_peak_vel_alt_asl - pad_alt
    mach = ascent_peak_vel / speed_of_sound_isa(isa_temp_c(peak_alt_agl_m))
    drogue_ft = (
        round((first_drogue_asl - pad_alt) * M_TO_FT) if first_drogue_asl else None
    )
    main_ft = round((first_main_asl - pad_alt) * M_TO_FT) if first_main_asl else None

    return {
        "source": "Void Lake SRAD flight_log.csv",
        "pad_altitude_asl_m": round(pad_alt, 4),
        "apogee_ft": apogee_ft,
        "peak_velocity_m_s": round(ascent_peak_vel, 2),
        "peak_velocity_ft_s": round(peak_vel_ft_s, 1),
        "peak_velocity_altitude_agl_ft": round(peak_alt_agl_m * M_TO_FT),
        "mach": round(mach, 2),
        "peak_accel_g": round(ascent_peak_accel_g, 1),
        "drogue_deploy_agl_ft": drogue_ft,
        "main_deploy_agl_ft": main_ft,
    }


def load_csv(archive: Path) -> Path:
    if archive.suffix.lower() == ".csv":
        return archive
    extract_dir = archive.parent / f".{archive.stem}-extract"
    extract_dir.mkdir(exist_ok=True)
    with zipfile.ZipFile(archive) as zf:
        names = [n for n in zf.namelist() if n.endswith("flight_log.csv")]
        if not names:
            raise SystemExit(f"No flight_log.csv in {archive}")
        target = extract_dir / "flight_log.csv"
        zf.extract(names[0], extract_dir)
        extracted = extract_dir / names[0]
        if extracted != target:
            extracted.rename(target)
        return target


def apply_vehicle(vehicle: dict, stats: dict) -> dict:
    main_ft = stats["main_deploy_agl_ft"]
    vehicle["apogee"] = stats["apogee_ft"]
    vehicle["mach"] = OSIRIS_MACH
    vehicle["specs"]["accel"] = f"{stats['peak_accel_g']:.1f} G"
    vehicle["specs"]["recovery"] = (
        f"3 ft drogue @ apogee · 10 ft main @ {main_ft} ft"
    )
    vehicle["summary"] = "Our highest and fastest vehicle to date."
    vehicle["build"] = (
        "Osiris introduced two firsts for the team: functional airbrakes, and a "
        "student-designed flight computer that had already been flight-tested before "
        "competition, so we could fly it as a backup with confidence. The 101.6 mm "
        "(4 in) minimum-diameter airframe used fiberglass tubes rolled in-house, "
        "with carbon fibre tip-to-tip fin layups. It flew on a CTI O3400 (21,062 N·s), "
        "the most powerful motor in team history. Blue Raven flew as primary with Void "
        "Lake as SRAD backup. Dual-deploy recovery fired drogue near apogee and main "
        f"at {main_ft:,} ft AGL. Peak velocity was {OSIRIS_PEAK_VELOCITY_M_S} m/s "
        f"(Mach {OSIRIS_MACH:.2f} at burnout)."
    )
    return vehicle


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path, help="flight_log.zip or flight_log.csv")
    parser.add_argument("--vehicle", default="osiris", help="vehicles.json slug")
    parser.add_argument(
        "--write",
        action="store_true",
        help="Patch src/data/vehicles.json for the target vehicle",
    )
    args = parser.parse_args()

    csv_path = load_csv(args.archive)
    stats = parse_log(csv_path)
    print(json.dumps(stats, indent=2))

    if not args.write:
        return

    vehicles = json.loads(VEHICLES.read_text())
    found = False
    for vehicle in vehicles:
        if vehicle.get("slug") == args.vehicle:
            apply_vehicle(vehicle, stats)
            found = True
            break
    if not found:
        raise SystemExit(f"Vehicle slug not found: {args.vehicle}")

    VEHICLES.write_text(json.dumps(vehicles, indent=2, ensure_ascii=False) + "\n")
    print(f"Updated {VEHICLES} ({args.vehicle})", file=sys.stderr)


if __name__ == "__main__":
    main()

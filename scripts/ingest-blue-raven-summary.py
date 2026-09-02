#!/usr/bin/env python3
"""Parse a Blue Raven Altimeters flight-summary CSV export.

Source is the "BlRv_SN*_summary_*.csv" file the Blue Raven app/dashboard
exports per flight, a flat label/value list (no time-series telemetry).

    python scripts/ingest-blue-raven-summary.py path/to/BlRv_SN1717_summary.csv
    python scripts/ingest-blue-raven-summary.py --vehicle osiris --check path/to/summary.csv

--check also prints a `blueRaven` cross-check block (compact, single-line,
matching vehicles.json's hand-formatted style) to paste into that vehicle's
entry by hand. It never writes the file directly: a json.dumps rewrite would
reformat the whole file's whitespace. It never computes `apogee`, `mach`, or
`specs.accel` either — those stay under Robin's editorial control per
docs/data-layer.md.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VEHICLES = ROOT / "src" / "data" / "vehicles.json"
FT_TO_M = 0.3048


def parse_summary(csv_path: Path) -> dict:
    raw: dict[str, str] = {}
    with csv_path.open(newline="") as handle:
        for row in csv.reader(handle):
            if len(row) >= 2:
                raw[row[0].strip()] = row[1].strip()

    max_alt_ft = float(raw["Max Altitude"].split()[0])
    max_vel_ft_s = float(raw["Max velocity"].split()[0])
    main_deploy_ft = float(raw["Main chute deploy altitude"].split()[0])

    return {
        "serial_number": raw.get("Serial number", ""),
        "firmware": raw.get("Firmware", ""),
        "launch_date": raw.get("Launch date", ""),
        "max_altitude_ft": max_alt_ft,
        "max_altitude_m": round(max_alt_ft * FT_TO_M, 2),
        "max_velocity_ft_s": max_vel_ft_s,
        "max_velocity_m_s": round(max_vel_ft_s * FT_TO_M, 2),
        "time_to_burnout_s": float(raw.get("Time to first burnout", "0").split()[0]),
        "main_deploy_altitude_agl_ft": main_deploy_ft,
        "max_motor_burn_accel_g": float(raw.get("Max motor burn acceleration", "0").split()[0]),
        "peak_drag_decel_g": float(raw.get("Peak drag deceleration", "0").split()[0]),
        "inertial_nav_max_alt_ft": float(raw.get("Inertial navigation max alt", "0").split()[0]),
    }


def cross_check(stats: dict, vehicle: dict) -> dict:
    published_apogee_ft = vehicle.get("apogee")
    delta_ft = None
    if published_apogee_ft is not None:
        delta_ft = round(stats["max_altitude_ft"] - published_apogee_ft, 1)
    return {
        "source": "Blue Raven summary CSV",
        "serial_number": stats["serial_number"],
        "launch_date": stats["launch_date"],
        "max_altitude_ft": round(stats["max_altitude_ft"]),
        "max_velocity_ft_s": stats["max_velocity_ft_s"],
        "max_velocity_m_s": stats["max_velocity_m_s"],
        "apogee_delta_vs_published_ft": delta_ft,
        "note": (
            "Apogee cross-checked against the published Void Lake figure; "
            "velocity/Mach and accel intentionally not adopted from this file "
            "pending a tighter burnout-altitude figure and IMU accel trust, "
            "see docs/data-layer.md."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--vehicle", default="osiris", help="vehicles.json slug")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Also print a blueRaven cross-check block to paste into vehicles.json by hand",
    )
    args = parser.parse_args()

    stats = parse_summary(args.csv_path)
    print(json.dumps(stats, indent=2))

    if not args.check:
        return

    vehicles = json.loads(VEHICLES.read_text())
    target = next((v for v in vehicles if v.get("slug") == args.vehicle), None)
    if target is None:
        raise SystemExit(f"Vehicle slug not found: {args.vehicle}")

    check = cross_check(stats, target)
    compact = json.dumps(check, separators=(", ", ": "))
    print(f'\n"blueRaven": {compact}', file=sys.stderr)


if __name__ == "__main__":
    main()

# Media masters — NOT published

Full-quality sources. Anything in `public/` is copied verbatim into the Astro
build and shipped to GitHub Pages, so masters live here instead.

- `hero-source.mp4` — 1920x1080, 31s, with audio. Pulled 2026-08-24 from the
  Squarespace CDN HLS stream in `hero_video.m3u8`, whose signed URLs expired
  2026-08-25 09:06 EDT. This is now the only copy; the manifest is dead.

Derivatives in `public/media/` are cut from source t=5.2s for 12s, cropped
`crop=1632:918:144:162` to remove the "LAUNCH CANADA 2025" watermark from the
top-right, and stripped of audio.

- `magpie-electronics-source.mp4` — 720×1280, 6s bench footage of the Magpie
  SRAD stack. Downloaded 2026-08-27.

Derivative `public/media/subteams/payload-work.mp4` is center-cropped to the
subteam body frame (4:3, banner stripped `crop=720:540:0:179`), H.264, no
audio, for the Payload subteam page loop beside the prose. Poster:
`payload-work.webp`.

- `osiris-void-lake-flight-log.zip` — Void Lake SRAD `flight_log.csv` from
  Osiris at Launch Canada 2026 (~715k rows, 200 Hz CAN telemetry). Ingested
  via `scripts/ingest-flight-log.py` into `vehicles.json` on 2026-08-27.

- `payload-hero-source.jpg` — 1137×618 shop photo of the payload bay internals.
  Downloaded 2026-08-27. Upscaled 4× with Real-ESRGAN (`realesrgan-x4plus`),
  then resized to `public/media/subteams/payload-hero.webp` (1568×852, q82).

- `join-hero-source.jpg` — team group photo for `/join` hero. Downloaded
  2026-08-27. Cropped `crop=1136:1170:310:0` → `public/media/join-hero.webp`.

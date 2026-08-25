# Media masters — NOT published

Full-quality sources. Anything in `public/` is copied verbatim into the Astro
build and shipped to GitHub Pages, so masters live here instead.

- `hero-source.mp4` — 1920x1080, 31s, with audio. Pulled 2026-08-24 from the
  Squarespace CDN HLS stream in `hero_video.m3u8`, whose signed URLs expired
  2026-08-25 09:06 EDT. This is now the only copy; the manifest is dead.

Derivatives in `public/media/` are cut from source t=5.2s for 12s, cropped
`crop=1632:918:144:162` to remove the "LAUNCH CANADA 2025" watermark from the
top-right, and stripped of audio.

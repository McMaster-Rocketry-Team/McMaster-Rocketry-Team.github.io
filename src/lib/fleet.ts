// Ported from render.js's fleet lineup logic, unchanged in substance: same
// height math, same procedural placeholder glyph for vehicles with no photo
// yet, same ignition/graphite recolouring.

export const maxRiseH = 460;
export const minRiseH = 200;
export const noDataH = 110;

export function rocketGlyph(h: number): string {
  const w = Math.round(h * 0.17), cx = w / 2, nose = h * 0.16, finW = w * 0.85;
  const bodyBot = h - h * 0.13, ov = finW * 0.55, sw = w + ov * 2, id = 'rg' + h;
  return '<svg width="' + sw + '" height="' + h + '" viewBox="' + (-ov) + ' 0 ' + sw + ' ' + h +
    '" fill="none" aria-hidden="true"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#241B1C"/><stop offset=".45" stop-color="#EAE6E4"/>' +
    '<stop offset=".65" stop-color="#A39C9A"/><stop offset="1" stop-color="#3D2E2F"/>' +
    '</linearGradient></defs>' +
    '<path d="M' + cx + ' 0 L' + w + ' ' + nose + ' L' + w + ' ' + bodyBot + ' L0 ' + bodyBot +
    ' L0 ' + nose + ' Z" fill="url(#' + id + ')"/>' +
    '<path d="M0 ' + bodyBot + ' L' + (-finW * 0.55) + ' ' + h + ' L0 ' + h + ' Z" fill="#3D2E2F"/>' +
    '<path d="M' + w + ' ' + bodyBot + ' L' + (w + finW * 0.55) + ' ' + h + ' L' + w + ' ' + h +
    ' Z" fill="#3D2E2F"/>' +
    '<rect x="0" y="' + (nose + h * 0.09) + '" width="' + w + '" height="' + Math.max(2, h * 0.012) +
    '" fill="#BF2026"/></svg>';
}

export function personGlyphSvg(): string {
  return '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" ' +
    'style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">' +
    '<rect width="100" height="100" fill="var(--fog-100)"/>' +
    '<circle cx="50" cy="38" r="17" fill="var(--fog-300)"/>' +
    '<path d="M15 100 C15 71 30 60 50 60 C70 60 85 71 85 100 Z" fill="var(--fog-300)"/>' +
    '</svg>';
}

export function riseHeight(apogee: number | null, maxApogee: number): number {
  return apogee ? Math.round(minRiseH + (apogee / maxApogee) * (maxRiseH - minRiseH)) : noDataH;
}

export function shortComp(comp: string): string {
  return comp.replace('Launch Canada', 'LC').replace('Spaceport America Cup', 'SAC');
}

// Fleet lineup sizing: pixel height is strictly proportional to tip-to-tail
// lengthIn (shared linear scale with the ruler in FleetLineup.astro). Unsized
// vehicles use a mid-height placeholder so unknown length never reads as
// shortest or tallest.

export const maxRiseH = 620;
export const minRiseH = 260;
// Fallback height while a vehicle has no lengthIn yet: neither the tallest
// nor the shortest, so an unfilled slot doesn't read as "smallest rocket."
export const unsizedH = Math.round((minRiseH + maxRiseH) / 2);

// The file() content loader keys vehicles by id and returns them
// alphabetically, not in JSON array order, so every fleet-order view needs
// an explicit chronological sort.
export function sortVehicles<T extends { data: { year: number } }>(vehicles: T[]): T[] {
  return [...vehicles].sort((a, b) => a.data.year - b.data.year);
}

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

export function riseHeight(lengthIn: number | null, maxLengthIn: number): number {
  // Strict tip-to-tail proportion: 0 length → 0 px, tallest → maxRiseH.
  // Unsized vehicles stay at mid height so an unknown length never reads as
  // "shortest" or "tallest" on the scale.
  return lengthIn ? Math.round((lengthIn / maxLengthIn) * maxRiseH) : unsizedH;
}

/** Pixel offset of a length tick from the top of a maxRiseH scale. */
export function scaleTickTop(lengthIn: number, maxLengthIn: number): number {
  return Math.round((1 - lengthIn / maxLengthIn) * maxRiseH);
}

/** Major scale ticks in inches from 0 (baseline) up to maxLengthIn (tallest tip). */
export function scaleTicks(maxLengthIn: number): number[] {
  const step = 30; // 30 in ≈ 0.76 m — readable without crowding
  const ticks: number[] = [0];
  for (let v = step; v <= maxLengthIn - step * 0.5; v += step) ticks.push(v);
  ticks.push(Math.round(maxLengthIn * 10) / 10);
  return ticks;
}

export function shortComp(comp: string): string {
  return comp.replace('Launch Canada', 'LC').replace('Spaceport America Cup', 'SAC');
}

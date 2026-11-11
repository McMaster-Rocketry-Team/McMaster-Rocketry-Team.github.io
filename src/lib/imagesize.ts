import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Reads pixel dimensions from a PNG, JPEG, WebP or SVG file in public/, so <img>
// tags can carry width and height and reserve their space before load.
export function imageSize(publicPath: string): { width: number; height: number } | null {
  let b: Buffer;
  try {
    b = readFileSync(join(process.cwd(), 'public', publicPath));
  } catch {
    return null;
  }
  const head = b.toString('utf8', 0, Math.min(b.length, 2048));
  if (/<svg[\s>]/.test(head)) {
    const w = head.match(/<svg[^>]*\swidth="([\d.]+)(px)?"/);
    const h = head.match(/<svg[^>]*\sheight="([\d.]+)(px)?"/);
    if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) };
    const vb = head.match(/viewBox="[\d.-]+[ ,]+[\d.-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/);
    if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
    return null;
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}

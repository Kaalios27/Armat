// Renders the app icon (src/app/icon.svg: a white "A" on charcoal) as PNG files for the Home Screen
// and the web app manifest. Pure Node (zlib), no image library. Run once after changing the icon.
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const BG = [0x1c, 0x1c, 0x1e];
const FG = [0xfa, 0xf9, 0xf7];
// Strokes of the "A" in the 64x64 icon space, and their half width.
const SEGMENTS = [
  [20, 46, 32, 16],
  [32, 16, 44, 46],
  [24.5, 36, 39.5, 36],
];
const HALF_WIDTH = 2.25;

function distanceToSegment(px, py, [x1, y1, x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function crc32(buf) {
  let c = ~0;
  for (const b of buf) {
    c ^= b;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function render(size) {
  const scale = size / 64;
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      const px = (x + 0.5) / scale;
      const py = (y + 0.5) / scale;
      const d = Math.min(...SEGMENTS.map((s) => distanceToSegment(px, py, s)));
      // Antialiased edge, about one pixel wide at this size.
      const a = Math.max(0, Math.min(1, (HALF_WIDTH - d) * scale + 0.5));
      for (let c = 0; c < 3; c++) row[1 + x * 3 + c] = Math.round(BG[c] + (FG[c] - BG[c]) * a);
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // truecolour RGB
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", header), chunk("IDAT", deflateSync(Buffer.concat(rows))), chunk("IEND", Buffer.alloc(0))]);
}

for (const [file, size] of [
  ["public/apple-touch-icon.png", 180],
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
]) {
  writeFileSync(file, render(size));
  console.log(`${file} (${size}x${size})`);
}

// Generates uniformly composed 4:5 grid thumbnails from each artwork's cover
// photo. Finds the bright paper/frame against the dark background, then crops
// so it sits centered and fills the same share of every thumbnail.
//
// Usage: node scripts/make-thumbnails.mjs

import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'public/images/artwork';
const OUT_W = 1200;
const OUT_H = 1500;

// fill: fraction of the thumbnail's height the artwork should occupy. Set as
// high as the tightest-cropped source photo allows, so none get clamped.
// paper: optional target paper color as [R, G, B] ratios to R; each thumbnail
// is white-balanced so its paper matches, evening out yellow casts.
const sources = [
  { dir: 'drawings', fill: 0.93, paper: [1, 0.97, 0.81], match: /^Drawing - (\d\d)\.jpg$/, name: (n) => `Drawing - ${n} - Thumb.jpg` },
  { dir: 'botanical', fill: 0.86, match: /^Botanical Painting - (\d\d) - Deck\.jpg$/, name: (n) => `Botanical Painting - ${n} - Thumb.jpg` },
];

// Bounding box of the largest bright region, via row/column profiles on a
// downscaled grayscale copy.
async function findArtwork(file) {
  const SCALE_W = 400;
  const { data, info } = await sharp(file)
    .rotate()
    .resize(SCALE_W)
    .grayscale()
    .blur(1.5)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  // Threshold halfway between the dark background and bright paper.
  const sorted = Uint8Array.from(data).sort();
  const lo = sorted[Math.floor(sorted.length * 0.1)];
  const hi = sorted[Math.floor(sorted.length * 0.9)];
  const t = (lo + hi) / 2;

  const cols = new Array(w).fill(0);
  const rows = new Array(h).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[y * w + x] > t) {
        cols[x]++;
        rows[y]++;
      }
    }
  }
  const span = (profile, len) => {
    const min = len * 0.4;
    let a = profile.findIndex((v) => v > min);
    let b = profile.length - 1 - [...profile].reverse().findIndex((v) => v > min);
    return [a, b];
  };
  const [x0, x1] = span(cols, h);
  const [y0, y1] = span(rows, w);
  return { x0, x1, y0, y1, w, h };
}

// Median color of the thumbnail's inner region, which is mostly bare paper.
async function paperColor(buf) {
  const { data } = await sharp(buf)
    .resize(300, 375)
    .extract({ left: 60, top: 75, width: 180, height: 225 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = [[], [], []];
  for (let i = 0; i < data.length; i += 3) {
    for (let c = 0; c < 3; c++) ch[c].push(data[i + c]);
  }
  return ch.map((a) => a.sort((x, y) => x - y)[a.length >> 1]);
}

async function makeThumb(src, out, fill, paper) {
  const meta = await sharp(src).rotate().toBuffer({ resolveWithObject: true });
  const W = meta.info.width;
  const H = meta.info.height;
  const box = await findArtwork(src);
  const k = W / box.w;
  const ax0 = box.x0 * k, ax1 = box.x1 * k, ay0 = box.y0 * k, ay1 = box.y1 * k;
  const cx = (ax0 + ax1) / 2;
  const cy = (ay0 + ay1) / 2;

  let cropH = (ay1 - ay0) / fill;
  let cropW = cropH * (OUT_W / OUT_H);
  // Wide artwork: size by width instead so it never touches the edges.
  if ((ax1 - ax0) / cropW > 0.96) {
    cropW = (ax1 - ax0) / 0.96;
    cropH = cropW * (OUT_H / OUT_W);
  }
  // Shrink to fit the photo if needed, keeping the aspect ratio.
  const fit = Math.min(1, W / cropW, H / cropH);
  cropW *= fit;
  cropH *= fit;
  const left = Math.round(Math.min(Math.max(cx - cropW / 2, 0), W - cropW));
  const top = Math.round(Math.min(Math.max(cy - cropH / 2, 0), H - cropH));

  const cropped = await sharp(src)
    .rotate()
    .extract({ left, top, width: Math.floor(cropW), height: Math.floor(cropH) })
    .resize(OUT_W, OUT_H, { fit: 'cover' })
    .toBuffer();
  let img = sharp(cropped);
  if (paper) {
    const [r, g, b] = await paperColor(cropped);
    img = img.linear([1, (paper[1] * r) / g, (paper[2] * r) / b], [0, 0, 0]);
  }
  await img.jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  return fit < 1 ? ` (clamped to photo, ${Math.round(fit * 100)}%)` : '';
}

for (const { dir, fill, paper, match, name } of sources) {
  const full = path.join(ROOT, dir);
  for (const f of (await readdir(full)).sort()) {
    const m = f.match(match);
    if (!m) continue;
    const out = path.join(full, name(m[1]));
    const note = await makeThumb(path.join(full, f), out, fill, paper);
    console.log(`${out}${note}`);
  }
}

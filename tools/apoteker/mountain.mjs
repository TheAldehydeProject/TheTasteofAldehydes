// ============================================================
// THE MOUNTAIN — tools/apoteker/mountain.mjs, run by hand, never by the site.
//
// Writes `tepe-data.js`, what Apoteker Tepe's page (tepe.js) and its motif
// on the Houses view (motifs.js) draw: MOUNT ATHOS, the Holy Mountain of
// northern Greece (2,033 m), out of the real ground's heights. The owner,
// 2026-10-20: "I want there to be a whole mountain constructed in 3d in
// the background, I want you to do that using
// https://github.com/image-js/image-js. I want you to make this mountain
// green, and granular, and make it feel like a really vintage photograph,
// made digital and then made into a 3d render ... Feel free to use an
// actual mountain that exists in the world for this, but if you do then
// make sure to actually put its name down in the credits below."
//
//   1. THE GROUND: twelve elevation tiles round the summit (Mapzen's
//      terrain tiles, on AWS Open Data — "terrarium" PNGs, each pixel's
//      red, green and blue a height), read with image-js, stitched and
//      cut to a square SPAN km across with the summit in its middle.
//   2. THE HEIGHTS: that square as a 16-bit image, made small with
//      image-js (resize) to N by N and softened (gaussianBlur) — what the
//      page raises into three dimensions.
//   3. THE PHOTOGRAPH: the mountain as a camera on a bright afternoon
//      would have it — each place lit by how it faces the sun (a
//      hillshade), the forest darker, the bare marble of the summit paler
//      — and then AGED as an old print ages, with image-js: softened
//      (blur), its blacks lifted and its whites dulled (level), grained,
//      and darkened towards its corners. Each speck the page draws takes
//      its strength from this picture: a vintage photograph, made digital,
//      made into a 3D render.
//   4. THE TRAILS: paths up the mountain from its shore — "lines ... as if
//      tracks or trails that are just random indications" — each a walk
//      that climbs the mountain's own slopes, turning back on itself in
//      switchbacks where it is steep, and one that keeps its height round
//      the mountain's shoulder. The page draws them on the ground, marked
//      with the house's own sign.
//
// Run it again only to change the mountain:
//
//   NODE_USE_ENV_PROXY=1 node tools/apoteker/mountain.mjs
//
// (NODE_USE_ENV_PROXY=1 only where the machine reaches the internet
// through a proxy. The tiles are kept in the system's temporary folder
// once fetched. `--preview` also writes the photograph and the heights as
// pictures into that same temporary folder, to look at; they are not the
// site's.)
//
// THE CREDIT the tiles ask for, on the house's page: Europe terrain data
// produced using Copernicus data and information funded by the European
// Union – EU-DEM layers; SRTM and GMTED2010 terrain data courtesy of the
// U.S. Geological Survey; ETOPO1, U.S. National Oceanic and Atmospheric
// Administration; Mapzen.
// ============================================================
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Image, read, write } from "image-js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "tepe-data.js");
const CACHE = path.join(os.tmpdir(), "tepe-terrain-tiles");
const PREVIEW = process.argv.includes("--preview");

const NAME = "Mount Athos";
const SUMMIT = { lat: 40.1572, lon: 24.3264, m: 2033 };   // the peak, and its height as surveyed
const ZOOM = 12;                 // ~29 m to a pixel at this latitude
const SPAN = 15.5;               // km across the square, the summit at its middle
const N = 160;                   // the heights and the photograph, N by N
const SEED = 1925;               // the walks' and the grain's own randomness

const TILE = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;

let seed = SEED;
const random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/** Where (lat, lon) falls on the tiles at `z`, in tiles. */
function tileOf(lat, lon, z) {
  const n = 2 ** z, r = (lat * Math.PI) / 180;
  return { x: ((lon + 180) / 360) * n, y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n };
}

async function tile(z, x, y) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, `${z}-${x}-${y}.png`);
  if (!fs.existsSync(file)) {
    const res = await fetch(TILE(z, x, y));
    if (!res.ok) throw new Error(`tile ${z}/${x}/${y}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return read(file);
}

// 1. THE GROUND -------------------------------------------------------
const at = tileOf(SUMMIT.lat, SUMMIT.lon, ZOOM);
const mPerPx = (40075016.686 * Math.cos((SUMMIT.lat * Math.PI) / 180)) / 2 ** ZOOM / 256;
const side = Math.round((SPAN * 1000) / mPerPx);                 // px across the square
const half = side / 2;
const x0 = Math.floor(at.x - half / 256) , x1 = Math.floor(at.x + half / 256);
const y0 = Math.floor(at.y - half / 256) , y1 = Math.floor(at.y + half / 256);
const W = (x1 - x0 + 1) * 256, H = (y1 - y0 + 1) * 256;
const ground = new Float32Array(W * H);
for (let ty = y0; ty <= y1; ty++) {
  for (let tx = x0; tx <= x1; tx++) {
    const img = await tile(ZOOM, tx, ty);
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const h = img.getValue(x, y, 0) * 256 + img.getValue(x, y, 1) + img.getValue(x, y, 2) / 256 - 32768;
        ground[((ty - y0) * 256 + y) * W + (tx - x0) * 256 + x] = Math.max(0, h);   // the sea at sea level
      }
    }
  }
}
const cx = Math.round((at.x - x0) * 256), cy = Math.round((at.y - y0) * 256);
const left = cx - Math.round(half), top = cy - Math.round(half);

// 2. THE HEIGHTS: a 16-bit image of the square, made small and softened.
const SCALE = 30;                                                // m to a 16-bit step's 1/30
const square = new Image(side, side, { colorModel: "GREY", bitDepth: 16 });
let tallest = 0;
for (let y = 0; y < side; y++) {
  for (let x = 0; x < side; x++) {
    const h = ground[(top + y) * W + left + x] || 0;
    if (h > tallest) tallest = h;
    square.setValue(x, y, 0, Math.round(h * SCALE));
  }
}
const heights = square.resize({ width: N, height: N }).gaussianBlur({ sigma: 0.6 });
const hAt = (i, j) => heights.getValue(clamp(i, 0, N - 1), clamp(j, 0, N - 1), 0) / SCALE;
let top8 = 0;
for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) top8 = Math.max(top8, hAt(i, j));

// 3. THE PHOTOGRAPH ---------------------------------------------------
const cell = (SPAN * 1000) / N;                                  // m to a cell
const SUN = { az: (315 * Math.PI) / 180, alt: (38 * Math.PI) / 180 };   // the sun from the north-west, as a map is lit: along the crest, so both its slopes are lit alike and their gullies shaded
const photo = new Image(N, N, { colorModel: "GREY" });
// The forest's own texture: a few octaves of value noise.
const lattice = Array.from({ length: 4 }, () => Float32Array.from({ length: 64 * 64 }, () => random()));
function noise(x, y) {
  let v = 0, a = 0.5, f = 1 / 6;
  for (let o = 0; o < 4; o++) {
    const X = x * f, Y = y * f, ix = Math.floor(X), iy = Math.floor(Y), fx = X - ix, fy = Y - iy;
    const g = lattice[o], q = (i, j) => g[((j & 63) << 6) | (i & 63)];
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    v += a * ((q(ix, iy) * (1 - sx) + q(ix + 1, iy) * sx) * (1 - sy) + (q(ix, iy + 1) * (1 - sx) + q(ix + 1, iy + 1) * sx) * sy);
    a *= 0.5; f *= 2;
  }
  return v;
}
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const dx = (hAt(i + 1, j) - hAt(i - 1, j)) / (2 * cell), dy = (hAt(i, j + 1) - hAt(i, j - 1)) / (2 * cell);
    const slope = Math.atan(Math.hypot(dx, dy)), aspect = Math.atan2(dy, -dx);
    const lit = Math.cos(Math.PI / 2 - SUN.alt) * Math.cos(slope) + Math.sin(Math.PI / 2 - SUN.alt) * Math.sin(slope) * Math.cos(SUN.az - aspect);
    const h = hAt(i, j) / top8;
    // The forest darker low down, the marble above the trees paler; the
    // trees' own texture in it; the sea a flat, pale grey.
    const bare = clamp((h - 0.72) / 0.18, 0, 1);
    let v = 0.26 + 0.5 * clamp(lit, 0, 1);
    v = v * (0.78 + 0.22 * bare) + 0.16 * bare;
    v *= 0.82 + 0.36 * (noise(i, j) - 0.5) * (1 - bare);
    if (hAt(i, j) <= 0.5) v = 0.72;
    photo.setValue(i, j, 0, Math.round(clamp(v, 0, 1) * 255));
  }
}
// AGED: softened, faded, grained, darkened to its corners.
let aged = photo.blur({ width: 3, height: 3 });
aged = aged.level({ inputMin: 0, inputMax: 255, outputMin: 34, outputMax: 222 });
const grained = new Image(N, N, { colorModel: "GREY" });
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const r = Math.hypot(i / N - 0.5, j / N - 0.5) / 0.7071;
    const grain = (random() + random() + random() - 1.5) * 26;
    const corner = 1 - 0.32 * Math.pow(r, 2.2);
    grained.setValue(i, j, 0, Math.round(clamp((aged.getValue(i, j, 0) + grain) * corner, 0, 255)));
  }
}

// 4. THE TRAILS -------------------------------------------------------
// Each a walk up the mountain from somewhere on its shore: heading for the
// summit, turned across the slope where it is steep (switchbacks), wandering
// a little, laid one cell at a time and smoothed.
const peak = (() => {
  let b = { i: N / 2, j: N / 2, h: -1 };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const h = hAt(i, j); if (h > b.h) b = { i, j, h }; }
  return b;
})();
function grad(i, j) {
  return [(hAt(Math.round(i) + 1, Math.round(j)) - hAt(Math.round(i) - 1, Math.round(j))) / (2 * cell), (hAt(Math.round(i), Math.round(j) + 1) - hAt(Math.round(i), Math.round(j) - 1)) / (2 * cell)];
}
function smooth(pts, rounds) {
  for (let r = 0; r < rounds; r++) {
    const out = [pts[0]];
    for (let k = 0; k < pts.length - 1; k++) {
      const [a, b] = [pts[k], pts[k + 1]];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}
function thin(pts, every) {
  const out = [pts[0]];
  let run = 0;
  for (let k = 1; k < pts.length; k++) {
    run += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
    if (run >= every || k === pts.length - 1) { out.push(pts[k]); run = 0; }
  }
  return out;
}
function climb(start, toward) {
  let [i, j] = start, way = Math.atan2(toward[1] - j, toward[0] - i), side = random() < 0.5 ? 1 : -1, leg = 0;
  const pts = [[i, j]];
  for (let s = 0; s < 420; s++) {
    const want = Math.atan2(toward[1] - j, toward[0] - i);
    const g = grad(i, j), steep = Math.hypot(g[0], g[1]);
    // Steep: across the slope, turning back now and then (a switchback).
    let aim = want;
    if (steep > 0.32) {
      aim = Math.atan2(g[1], g[0]) + side * (Math.PI / 2 - 0.35);
      if (++leg > 9 + random() * 10) { side = -side; leg = 0; }
    }
    let d = aim - way;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    way += clamp(d, -0.45, 0.45) + (random() - 0.5) * 0.35;
    i += Math.cos(way) * 0.9; j += Math.sin(way) * 0.9;
    i = clamp(i, 2, N - 3); j = clamp(j, 2, N - 3);
    pts.push([i, j]);
    if (Math.hypot(toward[0] - i, toward[1] - j) < 1.6) break;
  }
  return pts;
}
function shoreAt(angle) {
  // Out from the summit along `angle` until the ground is near the sea.
  for (let r = 4; r < N / 2 - 2; r += 0.5) {
    const i = peak.i + Math.cos(angle) * r, j = peak.j + Math.sin(angle) * r;
    if (i < 3 || j < 3 || i > N - 4 || j > N - 4) return null;
    if (hAt(Math.round(i), Math.round(j)) < 60) return [i, j];
  }
  return null;
}
const trails = [];
const heads = [0.35, 1.45, 2.4, 3.3, 4.35, 5.4];
for (const a of heads) {
  const start = shoreAt(a + (random() - 0.5) * 0.3);
  if (!start) continue;
  const toSummit = trails.length % 2 === 0;
  // Every other one to the summit; the rest to a shoulder part way up.
  const r = toSummit ? 0 : 0.35 + random() * 0.25;
  const goal = [peak.i + (start[0] - peak.i) * r, peak.j + (start[1] - peak.j) * r];
  trails.push(thin(smooth(climb(start, goal), 2), 0.9));
}
// And one round the mountain's shoulder, keeping its height.
{
  const keep = top8 * 0.42, pts = [];
  for (let a = 0; a <= Math.PI * 1.25; a += 0.04) {
    let best = null;
    for (let r = 3; r < N / 2 - 3; r += 0.5) {
      const i = peak.i + Math.cos(a + 2.2) * r, j = peak.j + Math.sin(a + 2.2) * r;
      if (hAt(Math.round(i), Math.round(j)) <= keep) { best = [i, j]; break; }
    }
    if (best) pts.push(best);
  }
  if (pts.length > 10) trails.push(thin(smooth(pts, 2), 0.9));
}

// WRITE ---------------------------------------------------------------
const bytes = (img, f) => {
  const out = Buffer.alloc(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) out[j * N + i] = f(img, i, j);
  return out.toString("base64");
};
const heightBytes = bytes(heights, (img, i, j) => Math.round((hAt(i, j) / top8) * 255));
const photoBytes = bytes(grained, (img, i, j) => img.getValue(i, j, 0));
const round = (v) => Math.round(v * 10) / 10;
const data = {
  name: NAME,
  where: "Mount Athos, Chalkidiki, Greece",
  n: N,
  km: SPAN,
  top: Math.round(top8),
  summit: [peak.i, peak.j],
  heights: heightBytes,
  photo: photoBytes,
  trails: trails.map((t) => t.map(([i, j]) => [round(i), round(j)])),
};
fs.writeFileSync(OUT, `// THE MOUNTAIN Apoteker Tepe's page and its motif on the Houses view draw:\n` +
  `// ${NAME} (2,033 m), out of the real ground's heights — written by\n` +
  `// tools/apoteker/mountain.mjs with image-js, never by hand. \`heights\` and\n` +
  `// \`photo\` are N by N bytes in base64, row by row (the heights as a share of\n` +
  `// \`top\` metres; the aged photograph's grey); \`trails\` are walks on that grid.\n` +
  `window.TEPE = ${JSON.stringify(data)};\n`);
console.log(`${NAME}: ${side}px of ground at ${mPerPx.toFixed(1)} m, highest ${Math.round(tallest)} m (${Math.round(top8)} m at ${N}x${N}); ${trails.length} trails; wrote ${path.relative(ROOT, OUT)} (${fs.statSync(OUT).size} bytes)`);

if (PREVIEW) {
  const h8 = new Image(N, N, { colorModel: "GREY" });
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) h8.setValue(i, j, 0, Math.round((hAt(i, j) / top8) * 255));
  await write(path.join(CACHE, "preview-heights.png"), h8.resize({ width: N * 3, height: N * 3 }));
  await write(path.join(CACHE, "preview-photograph.png"), grained.resize({ width: N * 3, height: N * 3 }));
  console.log(`previews written to ${CACHE}`);
}

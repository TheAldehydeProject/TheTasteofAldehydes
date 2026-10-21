// ============================================================
// THE MOUNTAIN'S RESOLUTION, TRIED — tools/apoteker/trials.mjs, run by
// hand, never by the site.
//
// The owner, 2026-10-21: "its ugly, and the main reason is the resolution.
// I want you to now look for as many possible ways for you to up the
// resolution ... including demonstrations of each way separately (a trial
// render) ... new ways to render it, as well as alterations to the existing
// model to improve quality." This writes the finer pictures some of those
// trials draw from, into images/Apoteker Tepe/mountain/trials/ — the same
// square as tools/apoteker/mountain.mjs (its corners worked out the same
// way, off the same terrain tiles), so they lie exactly on the mountain the
// page already draws:
//
//   heights-dem.png      THE GROUND AT 10 M: the Copernicus DEM (GLO-30,
//                        1 arc-second, about 31 by 24 m here), read out of
//                        its open archive on AWS with geotiff and laid on
//                        the square at FINE by FINE, bicubic — where the
//                        page's own heights are Mapzen's at 40 m, softened.
//   heights-eroded.png   the same, AMPLIFIED: rain run over it (a droplet
//                        erosion, after Hans Beyer's thesis and Sebastian
//                        Lague's), so the gullies and spurs finer than the
//                        DEM can show are carved as water carves them —
//                        a few metres, never more than ERODE_MOST.
//   athos-10m.jpg        THE COLOUR AT ITS OWN 10 M: the same Sentinel-2
//                        scene, printed as the page's is but at PHOTO px
//                        and never softened (the page's is 1024 px, 15 m,
//                        and blurred), with a little sharpening.
//   athos-median.jpg     the same, out of MEDIAN cloudless summer scenes,
//                        each pixel the middle of them: less of one
//                        morning's haze and noise.
//   light-*.png          THE LIGHT, BAKED: red how much of the sun each
//                        place sees (soft shadows cast by the mountain on
//                        itself, from the page's own sun), green how much of
//                        the sky (its hollows and gullies darker) — for the
//                        page's heights (-base), the DEM's and the eroded.
//
//   node tools/apoteker/trials.mjs             (NODE_USE_ENV_PROXY=1 behind a proxy)
//
// Credits they ask for: Copernicus DEM GLO-30 © DLR e.V. 2010–2014 and ©
// Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the
// European Union and ESA; contains modified Copernicus Sentinel data
// 2023–2025.
// ============================================================
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Image, read, write } from "image-js";
import { fromUrl } from "geotiff";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "images/Apoteker Tepe/mountain/trials");
const CACHE = path.join(os.tmpdir(), "tepe-terrain-tiles");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7).split(",").filter(Boolean);
const want = (k) => !ONLY.length || ONLY.includes(k);
global.window = {};
await import(path.join(ROOT, "tepe-data.js"));
const DATA = window.TEPE;

// THE SQUARE, exactly as mountain.mjs lays it.
const SUMMIT = { lat: 40.1572, lon: 24.3264 };
const ZOOM = 12, SPAN = DATA.km, N = DATA.n, TOP = DATA.top;
const FINE = 1536;               // the fine heights, FINE by FINE (10.1 m apart)
const PHOTO = 2048;              // the fine colour, PHOTO px (7.6 m to a pixel, the satellite's own 10 m resampled)
const LIGHT = 2048;              // the baked light, LIGHT px
const HEIGHT_SCALE = 1.25;       // the fine heights are written as a share of TOP / HEIGHT_SCALE (so a summit above TOP is kept)
const ERODE_MOST = 14;           // m: the most the rain carves or lays down anywhere
const MEDIAN = 7;                // cloudless scenes for the median
const SUN = { az: (165 * Math.PI) / 180, alt: (32 * Math.PI) / 180 };   // tepe-gl.js SUN
const LIFT = DATA.view.lift;     // the page's height of the summit, half-widths of the square
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function tileOf(lat, lon, z) {
  const n = 2 ** z, r = (lat * Math.PI) / 180;
  return { x: ((lon + 180) / 360) * n, y: ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n };
}
function latLonOf(tx, ty, z) {
  const n = 2 ** z;
  return { lat: (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI, lon: (tx / n) * 360 - 180 };
}
function utm(lat, lon, zone) {
  const a = 6378137, f = 1 / 298.257223563, k0 = 0.9996, e2 = f * (2 - f), ep2 = e2 / (1 - e2);
  const phi = (lat * Math.PI) / 180, lam = (lon * Math.PI) / 180, lam0 = (((zone - 1) * 6 - 180 + 3) * Math.PI) / 180;
  const Nn = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2), T = Math.tan(phi) ** 2, Cc = ep2 * Math.cos(phi) ** 2, A = Math.cos(phi) * (lam - lam0);
  const M = a * ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi - ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi) + ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi) - ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi));
  const x = k0 * Nn * (A + ((1 - T + Cc) * A ** 3) / 6 + ((5 - 18 * T + T * T + 72 * Cc - 58 * ep2) * A ** 5) / 120) + 500000;
  const y = k0 * (M + Nn * Math.tan(phi) * (A * A / 2 + ((5 - T + 9 * Cc + 4 * Cc * Cc) * A ** 4) / 24 + ((61 - 58 * T + T * T + 600 * Cc - 330 * ep2) * A ** 6) / 720));
  return { x, y };
}
const at = tileOf(SUMMIT.lat, SUMMIT.lon, ZOOM);
const mPerPx = (40075016.686 * Math.cos((SUMMIT.lat * Math.PI) / 180)) / 2 ** ZOOM / 256;
const side = Math.round((SPAN * 1000) / mPerPx), half = side / 2;
const x0 = Math.floor(at.x - half / 256), y0 = Math.floor(at.y - half / 256);
const cx = Math.round((at.x - x0) * 256), cy = Math.round((at.y - y0) * 256);
const left = cx - Math.round(half), top = cy - Math.round(half);
/** A place in the square (0 to 1 across, 0 to 1 down) as (lat, lon). */
const placeOf = (s, t) => latLonOf(x0 + (left + s * side) / 256, y0 + (top + t * side) / 256, ZOOM);

// Catmull-Rom on a grid (A, w by h), x and y in its pixels.
function cubic(A, w, h, x, y) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const k = (t) => [((-t + 2) * t - 1) * t / 2, ((3 * t - 5) * t * t + 2) / 2, ((-3 * t + 4) * t + 1) * t / 2, ((t - 1) * t * t) / 2];
  const wx = k(fx), wy = k(fy);
  let s = 0;
  for (let j = 0; j < 4; j++) {
    const yy = clamp(iy - 1 + j, 0, h - 1) * w;
    let r = 0;
    for (let i = 0; i < 4; i++) r += wx[i] * A[yy + clamp(ix - 1 + i, 0, w - 1)];
    s += wy[j] * r;
  }
  return s;
}
const writeHeights = async (file, Hm, n) => {
  const pic = new Image(n, n, { colorModel: "RGB" });
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const v = Math.round(clamp(Hm[j * n + i] / TOP / HEIGHT_SCALE, 0, 1) * 65535);
    pic.setValue(i, j, 0, v >> 8); pic.setValue(i, j, 1, v & 255); pic.setValue(i, j, 2, 0);
  }
  await write(path.join(OUT, file), pic, { format: "png" });
};
fs.mkdirSync(OUT, { recursive: true });

// THE PAGE'S OWN HEIGHTS (m), for the base light and the checks.
const base = new Float32Array(N * N);
{
  const pic = await read(path.join(ROOT, DATA.heights));
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) base[j * N + i] = ((pic.getValue(i, j, 0) * 256 + pic.getValue(i, j, 1)) / 65535) * TOP;
}

// 1. THE GROUND AT 10 M -----------------------------------------------
const DEM = "https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N40_00_E024_00_DEM/Copernicus_DSM_COG_10_N40_00_E024_00_DEM.tif";
let dem = null;
async function demHeights() {
  if (dem) return dem;
  const kept = path.join(CACHE, "copernicus-glo30-athos.f32");
  const tiff = await fromUrl(DEM);
  const img = await tiff.getImage();
  const [bx0, , , by1] = img.getBoundingBox(), [rx, ry] = img.getResolution();
  const W = img.getWidth(), H = img.getHeight();
  const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([s, t]) => placeOf(s, t));
  const c0 = Math.floor((Math.min(...corners.map((c) => c.lon)) - bx0) / rx) - 4, c1 = Math.ceil((Math.max(...corners.map((c) => c.lon)) - bx0) / rx) + 4;
  const r0 = Math.floor((by1 - Math.max(...corners.map((c) => c.lat))) / -ry) - 4, r1 = Math.ceil((by1 - Math.min(...corners.map((c) => c.lat))) / -ry) + 4;
  const ww = c1 - c0, wh = r1 - r0;
  let ras;
  if (fs.existsSync(kept)) ras = new Float32Array(fs.readFileSync(kept).buffer.slice(0));
  else {
    ras = Float32Array.from((await img.readRasters({ window: [c0, r0, c1, r1] }))[0]);
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(kept, Buffer.from(ras.buffer));
  }
  // (a pixel's value stands for its centre)
  const out = new Float32Array(FINE * FINE);
  let peak = 0;
  for (let j = 0; j < FINE; j++) for (let i = 0; i < FINE; i++) {
    const p = placeOf((i + 0.5) / FINE, (j + 0.5) / FINE);
    const x = (p.lon - bx0) / rx - 0.5 - c0, y = (by1 - p.lat) / -ry - 0.5 - r0;
    const h = Math.max(0, cubic(ras, ww, wh, x, y));
    out[j * FINE + i] = h;
    if (h > peak) peak = h;
  }
  // The sea: Copernicus's own is a little above or below nothing in
  // places; under 0.5 m it is the sea.
  for (let k = 0; k < out.length; k++) if (out[k] < 0.5) out[k] = 0;
  console.log(`DEM: ${ww}x${wh} px of GLO-30 at ${(rx * 3600).toFixed(2)}" (${(rx * 111320 * Math.cos((40.157 * Math.PI) / 180)).toFixed(1)} x ${(-ry * 110950).toFixed(1)} m), the summit ${peak.toFixed(0)} m`);
  dem = out;
  return out;
}
if (want("dem") || want("erosion") || want("light")) {
  const d = await demHeights();
  if (want("dem")) await writeHeights("heights-dem.png", d, FINE);
  // Where its summit is, against the page's.
  let b = { k: 0, h: -1 };
  for (let k = 0; k < d.length; k++) if (d[k] > b.h) b = { k, h: d[k] };
  console.log(`  its summit at (${((b.k % FINE) + 0.5) * N / FINE - 0.5}, ${(Math.floor(b.k / FINE) + 0.5) * N / FINE - 0.5}) cells; the page's at ${DATA.summit}`);
}

// 2. THE GROUND, AMPLIFIED BY RAIN ------------------------------------
let eroded = null;
function erode(Hm, n, drops, seed = 7) {
  // Heights in cells (so a slope is its own tangent), a droplet at a time.
  const cellM = (SPAN * 1000) / n;
  const h = Float32Array.from(Hm, (v) => v / cellM);
  let s = seed >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const R = 3, brush = [];
  let wsum = 0;
  for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) { const d = Math.hypot(x, y); if (d <= R) { const w = 1 - d / R; brush.push([x, y, w]); wsum += w; } }
  brush.forEach((b) => (b[2] /= wsum));
  const INERTIA = 0.06, CAPACITY = 3.2, MIN_SLOPE = 0.012, ERODE = 0.28, DEPOSIT = 0.25, EVAPORATE = 0.02, GRAVITY = 4, STEPS = 70;
  const gradAt = (x, y) => {
    const i = x | 0, j = y | 0, u = x - i, v = y - j, k = j * n + i;
    const a = h[k], b = h[k + 1], c = h[k + n], d = h[k + n + 1];
    return { gx: (b - a) * (1 - v) + (d - c) * v, gy: (c - a) * (1 - u) + (d - b) * u, z: a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v };
  };
  for (let q = 0; q < drops; q++) {
    let x = 1 + rnd() * (n - 3), y = 1 + rnd() * (n - 3);
    if (h[(y | 0) * n + (x | 0)] < 0.3) continue;            // (no rain on the sea)
    let dx = 0, dy = 0, speed = 1, water = 1, sed = 0;
    for (let st = 0; st < STEPS; st++) {
      const i = x | 0, j = y | 0, u = x - i, v = y - j;
      const g = gradAt(x, y);
      dx = dx * INERTIA - g.gx * (1 - INERTIA); dy = dy * INERTIA - g.gy * (1 - INERTIA);
      const len = Math.hypot(dx, dy);
      if (len < 1e-9) break;
      dx /= len; dy /= len;
      const nx = x + dx, ny = y + dy;
      if (nx < 1 || ny < 1 || nx >= n - 2 || ny >= n - 2) break;
      const dh = gradAt(nx, ny).z - g.z;
      const cap = Math.max(-dh, MIN_SLOPE) * speed * water * CAPACITY;
      if (sed > cap || dh > 0) {
        const put = dh > 0 ? Math.min(dh, sed) : (sed - cap) * DEPOSIT;
        sed -= put;
        const k = j * n + i;
        h[k] += put * (1 - u) * (1 - v); h[k + 1] += put * u * (1 - v); h[k + n] += put * (1 - u) * v; h[k + n + 1] += put * u * v;
      } else {
        const take = Math.min((cap - sed) * ERODE, -dh);
        for (const [bx, by, w] of brush) {
          const ii = i + bx, jj = j + by;
          if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue;
          const kk = jj * n + ii, t = Math.min(h[kk], take * w);
          h[kk] -= t; sed += t;
        }
      }
      speed = Math.sqrt(Math.max(0, speed * speed + dh * GRAVITY));
      water *= 1 - EVAPORATE;
      x = nx; y = ny;
    }
  }
  // Never more than ERODE_MOST from the real ground; the sea left the sea.
  const out = new Float32Array(n * n);
  for (let k = 0; k < out.length; k++) out[k] = Hm[k] < 0.5 ? 0 : Math.max(0, Hm[k] + clamp(h[k] * cellM - Hm[k], -ERODE_MOST, ERODE_MOST));
  return out;
}
if (want("erosion") || want("light")) {
  const t0 = Date.now();
  eroded = erode(await demHeights(), FINE, Math.round(FINE * FINE * 0.55));
  let moved = 0;
  for (let k = 0; k < eroded.length; k++) moved += Math.abs(eroded[k] - dem[k]);
  console.log(`erosion: ${((Date.now() - t0) / 1000).toFixed(1)} s, on average ${(moved / eroded.length).toFixed(2)} m moved`);
  if (want("erosion")) await writeHeights("heights-eroded.png", eroded, FINE);
}

// 3. THE COLOUR AT ITS OWN 10 M ----------------------------------------
const FIRST = "S2A_35TKE_20230714_0_L2A";
const tciOf = (id) => {
  const [, tile, date] = id.match(/_(\d\d[A-Z]{3})_(\d{8})_/);
  return `https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/${tile.slice(0, 2)}/${tile[2]}/${tile.slice(3)}/${date.slice(0, 4)}/${+date.slice(4, 6)}/${id}/TCI.tif`;
};
const UTM_ZONE = 35;
async function sceneSquare(id, C) {
  const tiff = await fromUrl(tciOf(id));
  const scene = await tiff.getImage();
  const [ox, oy] = [scene.getOrigin()[0], scene.getOrigin()[1]];
  const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([s, t]) => { const p = placeOf(s, t); return utm(p.lat, p.lon, UTM_ZONE); });
  const wx0 = Math.floor((Math.min(...corners.map((c) => c.x)) - ox) / 10) - 8, wx1 = Math.ceil((Math.max(...corners.map((c) => c.x)) - ox) / 10) + 8;
  const wy0 = Math.floor((oy - Math.max(...corners.map((c) => c.y))) / 10) - 8, wy1 = Math.ceil((oy - Math.min(...corners.map((c) => c.y))) / 10) + 8;
  const ww = wx1 - wx0, wh = wy1 - wy0;
  const kept = path.join(CACHE, `${id}-${wx0}-${wy0}-${ww}x${wh}.rgb`);
  let sat;
  if (fs.existsSync(kept)) sat = new Uint8Array(fs.readFileSync(kept));
  else {
    sat = await scene.readRasters({ window: [wx0, wy0, wx1, wy1], interleave: true });
    fs.writeFileSync(kept, Buffer.from(sat.buffer, sat.byteOffset, sat.byteLength));
  }
  const ch = [0, 1, 2].map((c) => Float32Array.from({ length: ww * wh }, (_, k) => sat[k * 3 + c]));
  const out = new Float32Array(C * C * 3);
  for (let b = 0; b < C; b++) for (let a = 0; a < C; a++) {
    const p = placeOf((a + 0.5) / C, (b + 0.5) / C), u = utm(p.lat, p.lon, UTM_ZONE);
    const px = (u.x - ox) / 10 - wx0 - 0.5, py = (oy - u.y) / 10 - wy0 - 0.5;
    for (let c = 0; c < 3; c++) out[(b * C + a) * 3 + c] = clamp(cubic(ch[c], ww, wh, px, py), 0, 255);
  }
  return out;
}
// PRINTED as mountain.mjs prints it (its stretch, mid-tones, greens), then
// sharpened a little (an unsharp mask) rather than softened.
async function printColour(raw, C, file, sharpen) {
  const N8 = N;
  const landAt = (a, b) => base[clamp(Math.round(((b + 0.5) / C) * N8 - 0.5), 0, N8 - 1) * N8 + clamp(Math.round(((a + 0.5) / C) * N8 - 0.5), 0, N8 - 1)] > 2;
  const lum = [];
  for (let b = 0; b < C; b += 3) for (let a = 0; a < C; a += 3) if (landAt(a, b)) { const k = (b * C + a) * 3; lum.push((raw[k] + raw[k + 1] + raw[k + 2]) / 3); }
  lum.sort((p, q) => p - q);
  const lo = lum[Math.floor(lum.length * 0.01)], hi = lum[Math.floor(lum.length * 0.995)];
  const GAMMA = 0.56, GREEN_QUIET = 0.8, WARM = [1.06, 1.0, 0.92];
  const rgbAll = new Float32Array(C * C * 3);
  for (let k = 0; k < C * C; k++) {
    let rgb = [0, 1, 2].map((ch) => Math.pow(clamp((raw[k * 3 + ch] - lo) / (hi - lo), 0, 1), GAMMA));
    const grey = (rgb[0] + rgb[1] + rgb[2]) / 3, greenness = clamp((rgb[1] - Math.max(rgb[0], rgb[2])) * 6, 0, 1);
    rgb = rgb.map((v) => v + (grey - v) * GREEN_QUIET * greenness);
    rgb[0] += (rgb[1] - rgb[0]) * 0.32 * greenness;
    for (let ch = 0; ch < 3; ch++) rgbAll[k * 3 + ch] = clamp(rgb[ch] * WARM[ch], 0, 1);
  }
  // unsharp: the picture against a blur of itself (radius ~1.3 px)
  const out = new Image(C, C, { colorModel: "RGB" });
  const blurred = new Float32Array(C * C * 3);
  if (sharpen > 0) {
    const tmp = new Float32Array(C * C * 3), K = [0.06, 0.24, 0.4, 0.24, 0.06];
    for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) for (let ch = 0; ch < 3; ch++) { let s = 0; for (let d = -2; d <= 2; d++) s += K[d + 2] * rgbAll[(y * C + clamp(x + d, 0, C - 1)) * 3 + ch]; tmp[(y * C + x) * 3 + ch] = s; }
    for (let y = 0; y < C; y++) for (let x = 0; x < C; x++) for (let ch = 0; ch < 3; ch++) { let s = 0; for (let d = -2; d <= 2; d++) s += K[d + 2] * tmp[(clamp(y + d, 0, C - 1) * C + x) * 3 + ch]; blurred[(y * C + x) * 3 + ch] = s; }
  }
  for (let k = 0; k < C * C; k++) for (let ch = 0; ch < 3; ch++) {
    const v = rgbAll[k * 3 + ch], s = sharpen > 0 ? v + (v - blurred[k * 3 + ch]) * sharpen : v;
    out.setValue(k % C, Math.floor(k / C), ch, Math.round(clamp(s, 0, 1) * 255));
  }
  await write(path.join(OUT, file), out, file.endsWith(".png") ? { format: "png" } : { format: "jpeg", encoderOptions: { quality: 88 } });
  console.log(`colour: ${file} (${C} px), stretched ${lo.toFixed(0)}–${hi.toFixed(0)}`);
}
if (want("photo")) await printColour(await sceneSquare(FIRST, PHOTO), PHOTO, "athos-10m.jpg", 0.55);
// (and at the satellite's own 10 m, unsharpened, as a PNG: what the
// upscaler, tools/apoteker/upscale.py, is given to enlarge — `superres`)
if (want("native")) await printColour(await sceneSquare(FIRST, 1536), 1536, "athos-10m-native.png", 0);
if (want("median")) {
  // Cloudless midsummer mornings over the same grid square (each read for
  // cloud over this very square in its own scene classification): each
  // pixel the middle of them — less of one morning's haze and noise.
  const ids = [FIRST, "S2B_35TKE_20240713_0_L2A", "S2B_35TKE_20250618_0_L2A", "S2A_35TKE_20250625_0_L2A", "S2C_35TKE_20250703_0_L2A", "S2A_35TKE_20250705_0_L2A", "S2B_35TKE_20250708_0_L2A"].slice(0, MEDIAN);
  console.log(`median of ${ids.length}: ${ids.join(", ")}`);
  const all = [];
  for (const id of ids) { try { all.push(await sceneSquare(id, PHOTO)); } catch (e) { console.log(`  (${id}: ${e.message})`); } }
  const med = new Float32Array(PHOTO * PHOTO * 3), v = new Float32Array(all.length);
  for (let k = 0; k < med.length; k++) { for (let q = 0; q < all.length; q++) v[q] = all[q][k]; v.sort(); med[k] = all.length % 2 ? v[(all.length - 1) / 2] : (v[all.length / 2 - 1] + v[all.length / 2]) / 2; }
  await printColour(med, PHOTO, "athos-median.jpg", 0.55);
}

// 4. THE LIGHT, BAKED --------------------------------------------------
// The ground as the page raises it: x and z in half-widths of the square
// (LIGHT px across 2 of them), y the height as a share of TOP times LIFT.
async function bake(file, heightAt) {
  const n = LIGHT, step = 2 / n, Y = new Float32Array(n * n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) Y[j * n + i] = (heightAt((i + 0.5) / n, (j + 0.5) / n) / TOP) * LIFT;
  const yAt = (x, z) => { const fx = clamp(x, 0, n - 1.001), fz = clamp(z, 0, n - 1.001), i = fx | 0, j = fz | 0, u = fx - i, v = fz - j, k = j * n + i; return (Y[k] * (1 - u) + Y[k + 1] * u) * (1 - v) + (Y[k + n] * (1 - u) + Y[k + n + 1] * u) * v; };
  const L = [Math.sin(SUN.az), -Math.cos(SUN.az)], rise = Math.tan(SUN.alt);
  const sun = new Float32Array(n * n), sky = new Float32Array(n * n);
  const t0 = Date.now();
  // The sun: a soft shadow, the smallest clearance over distance along the way to it.
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const y0 = Y[j * n + i] + 0.0004;
    let res = 1, t = step;
    while (t < 2.2) {
      const x = i + (L[0] * t) / step, z = j + (L[1] * t) / step;
      if (x < 0 || z < 0 || x > n - 1 || z > n - 1) break;
      const d = y0 + t * rise - yAt(x, z);
      res = Math.min(res, (14 * d) / t);
      if (res < 0) break;
      t += Math.max(step, t * 0.03);
    }
    sun[j * n + i] = clamp(res, 0, 1);
  }
  // The sky: how much of it each place sees, round sixteen ways, within
  // REACH half-widths.
  const DIRS = 16, REACH = 0.18, SKY_STEP = 2;
  for (let j = 0; j < n; j += SKY_STEP) for (let i = 0; i < n; i += SKY_STEP) {
    const y0 = Y[j * n + i];
    let vis = 0;
    for (let a = 0; a < DIRS; a++) {
      const dx = Math.cos((a / DIRS) * Math.PI * 2), dz = Math.sin((a / DIRS) * Math.PI * 2);
      let best = 0, t = step;
      while (t < REACH) {
        const x = i + (dx * t) / step, z = j + (dz * t) / step;
        if (x < 0 || z < 0 || x > n - 1 || z > n - 1) break;
        const e = (yAt(x, z) - y0) / t;
        if (e > best) best = e;
        t += Math.max(step, t * 0.06);
      }
      vis += 1 - Math.sin(Math.atan(best));
    }
    sky[j * n + i] = vis / DIRS;
  }
  const pic = new Image(n, n, { colorModel: "RGB" });
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    // (the sky worked out every SKY_STEP pixels, filled between)
    const last = n - SKY_STEP, i1 = Math.min(i - (i % SKY_STEP), last), j1 = Math.min(j - (j % SKY_STEP), last);
    const i2 = Math.min(i1 + SKY_STEP, last), j2 = Math.min(j1 + SKY_STEP, last), u = clamp((i - i1) / SKY_STEP, 0, 1), v = clamp((j - j1) / SKY_STEP, 0, 1);
    const s = (sky[j1 * n + i1] * (1 - u) + sky[j1 * n + i2] * u) * (1 - v) + (sky[j2 * n + i1] * (1 - u) + sky[j2 * n + i2] * u) * v;
    pic.setValue(i, j, 0, Math.round(sun[j * n + i] * 255));
    pic.setValue(i, j, 1, Math.round(clamp(s, 0, 1) * 255));
    pic.setValue(i, j, 2, 0);
  }
  await write(path.join(OUT, file), pic, { format: "png" });
  console.log(`light: ${file} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}
if (want("light")) {
  // (s, t across the square, 0 to 1, to each source's own pixels)
  await bake("light-base.png", (s, t) => cubic(base, N, N, s * N - 0.5, t * N - 0.5));
  await bake("light-dem.png", (s, t) => cubic(dem, FINE, FINE, s * FINE - 0.5, t * FINE - 0.5));
  await bake("light-eroded.png", (s, t) => cubic(eroded, FINE, FINE, s * FINE - 0.5, t * FINE - 0.5));
}
console.log("written to " + path.relative(ROOT, OUT));

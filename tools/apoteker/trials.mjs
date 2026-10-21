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
//   ndvi.png             WHAT GROWS, for the realism trials (the same day,
//                        later): NDVI off the satellite's red and infrared.
//   athos-delit.jpg      THE COLOUR WITHOUT ITS MORNING: the 10 m picture,
//                        the light the satellite's sun left on each slope
//                        evened out, so the page's sun alone lights it.
//   canopy.jpg           THE TREES THEMSELVES: Meta and WRI's Canopy Height
//                        Map v2, each crown lit by the page's sun — each
//                        place's share of the light within the satellite's
//                        pixel.
//   light-*.png          THE LIGHT, BAKED: red how much of the sun each
//                        place sees (soft shadows cast by the mountain on
//                        itself, from the page's own sun), green how much of
//                        the sky (its hollows and gullies darker) — for the
//                        page's heights (-base), the DEM's and the eroded.
//
//   node tools/apoteker/trials.mjs             (NODE_USE_ENV_PROXY=1 behind a proxy)
//
// (The real paths and buildings, athos-osm.json, are tools/apoteker/osm.py's.)
//
// Credits they ask for: the canopy heights, Meta and World Resources
// Institute (2026), Canopy Height Map v2, CC BY 4.0; Copernicus DEM GLO-30
// © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018,
// provided under COPERNICUS by the European Union and ESA; contains
// modified Copernicus Sentinel data 2023–2025.
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
const tciOf = (id, file = "TCI.tif") => {
  const [, tile, date] = id.match(/_(\d\d[A-Z]{3})_(\d{8})_/);
  return `https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/${tile.slice(0, 2)}/${tile[2]}/${tile.slice(3)}/${date.slice(0, 4)}/${+date.slice(4, 6)}/${id}/${file}`;
};
const UTM_ZONE = 35;
async function sceneSquare(id, C, file = "TCI.tif", chans = 3) {
  const tiff = await fromUrl(tciOf(id, file));
  const scene = await tiff.getImage();
  const [ox, oy] = [scene.getOrigin()[0], scene.getOrigin()[1]];
  const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([s, t]) => { const p = placeOf(s, t); return utm(p.lat, p.lon, UTM_ZONE); });
  const wx0 = Math.floor((Math.min(...corners.map((c) => c.x)) - ox) / 10) - 8, wx1 = Math.ceil((Math.max(...corners.map((c) => c.x)) - ox) / 10) + 8;
  const wy0 = Math.floor((oy - Math.max(...corners.map((c) => c.y))) / 10) - 8, wy1 = Math.ceil((oy - Math.min(...corners.map((c) => c.y))) / 10) + 8;
  const ww = wx1 - wx0, wh = wy1 - wy0;
  const kept = path.join(CACHE, `${id}-${file === "TCI.tif" ? "" : file + "-"}${wx0}-${wy0}-${ww}x${wh}.${chans === 3 ? "rgb" : "u16"}`);
  let sat;
  if (fs.existsSync(kept)) { const b = fs.readFileSync(kept); sat = chans === 3 ? new Uint8Array(b) : new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2); }
  else {
    sat = await scene.readRasters({ window: [wx0, wy0, wx1, wy1], interleave: true });
    fs.writeFileSync(kept, Buffer.from(sat.buffer, sat.byteOffset, sat.byteLength));
  }
  // (a band's own numbers — reflectance, to 65535 — or the true colour's, to 255)
  const most = chans === 3 ? 255 : 65535;
  const ch = Array.from({ length: chans }, (_, c) => Float32Array.from({ length: ww * wh }, (_, k) => sat[k * chans + c]));
  const out = new Float32Array(C * C * chans);
  for (let b = 0; b < C; b++) for (let a = 0; a < C; a++) {
    const p = placeOf((a + 0.5) / C, (b + 0.5) / C), u = utm(p.lat, p.lon, UTM_ZONE);
    const px = (u.x - ox) / 10 - wx0 - 0.5, py = (oy - u.y) / 10 - wy0 - 0.5;
    for (let c = 0; c < chans; c++) out[(b * C + a) * chans + c] = clamp(cubic(ch[c], ww, wh, px, py), 0, most);
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

// 3b. WHAT GROWS, AND THE COLOUR WITHOUT ITS MORNING (the realism trials) --
// NDVI off the satellite's own red and near-infrared at 10 m (B04, B08; L2A
// reflectance = DN / 10000 - 0.1): green leaves reflect the infrared and take
// in the red, so the more of the one over the other, the more is growing —
// where the trials put trees and the forest's grain (`trees`, `canopy`).
let ndvi = null;
async function ndviOf() {
  if (ndvi) return ndvi;
  const red = await sceneSquare(FIRST, PHOTO, "B04.tif", 1), nir = await sceneSquare(FIRST, PHOTO, "B08.tif", 1);
  ndvi = new Float32Array(PHOTO * PHOTO);
  for (let k = 0; k < PHOTO * PHOTO; k++) {
    const r = Math.max(0, red[k] * 1e-4 - 0.1), n = Math.max(0, nir[k] * 1e-4 - 0.1);
    ndvi[k] = n + r < 0.02 ? -0.2 : (n - r) / (n + r);   // (the sea, nearly black in both: nothing growing)
  }
  return ndvi;
}
if (want("ndvi")) {
  const v = await ndviOf(), pic = new Image(PHOTO, PHOTO, { colorModel: "GREY" });
  let sum = 0;
  for (let k = 0; k < PHOTO * PHOTO; k++) { sum += v[k]; pic.setValue(k % PHOTO, Math.floor(k / PHOTO), 0, Math.round(clamp((v[k] + 0.2) / 1.1, 0, 1) * 255)); }
  await write(path.join(OUT, "ndvi.png"), pic, { format: "png" });
  console.log(`ndvi.png (${PHOTO} px, NDVI -0.2 to 0.9 as 0 to 255), the square's mean ${(sum / PHOTO / PHOTO).toFixed(3)}`);
}
// DE-LIT: the satellite saw Athos at 09:19 UTC on 14 July 2023, the sun 66°
// up from 136° (its scene's own metadata), and every slope's light from that
// sun is in its colour. The page lights it again from its own sun, so each
// slope was lit twice. Here the morning's light is taken back out: the
// heights' slopes (GLO-30) give how much of that sun each place faced, the
// colour's brightness is fitted against it over the land (a little light from
// the sky and the rest from the sun), and each place divided by its share.
const SUN_SEEN = { az: (135.95 * Math.PI) / 180, alt: (66.33 * Math.PI) / 180 };
if (want("delit")) {
  const d = await demHeights(), raw = await sceneSquare(FIRST, PHOTO), C = PHOTO, cell = (SPAN * 1000) / FINE;
  const L = [Math.sin(SUN_SEEN.az) * Math.cos(SUN_SEEN.alt), Math.cos(SUN_SEEN.az) * Math.cos(SUN_SEEN.alt), Math.sin(SUN_SEEN.alt)];   // east, north, up
  const hAt = (x, y) => cubic(d, FINE, FINE, x, y);
  const facing = new Float32Array(C * C), lum = new Float32Array(C * C), land = new Uint8Array(C * C);
  for (let b = 0; b < C; b++) for (let a = 0; a < C; a++) {
    const x = ((a + 0.5) / C) * FINE - 0.5, y = ((b + 0.5) / C) * FINE - 0.5, k = b * C + a;
    const gx = (hAt(x + 1, y) - hAt(x - 1, y)) / (2 * cell), gy = -(hAt(x, y + 1) - hAt(x, y - 1)) / (2 * cell);   // (rows run south)
    const l = Math.hypot(gx, gy, 1);
    facing[k] = Math.max(0, (-gx * L[0] - gy * L[1] + L[2]) / l);
    lum[k] = (raw[k * 3] + raw[k * 3 + 1] + raw[k * 3 + 2]) / 3;
    land[k] = hAt(x, y) > 3 ? 1 : 0;
  }
  // brightness = ambient + sun × facing, fitted (least squares) over the
  // dense forest only, whose own colour is even — over all the land, the
  // bare rock and the scrub, brighter in themselves, stood on the slopes
  // turned from the sun and turned the fit round
  const v = await ndviOf();
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let k = 0; k < C * C; k += 3) if (land[k] && v[k] > 0.62) { n++; sx += facing[k]; sy += lum[k]; sxx += facing[k] * facing[k]; sxy += facing[k] * lum[k]; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx), icept = (sy - slope * sx) / n;
  const flat = icept + slope * L[2];   // as bright as level ground was
  console.log(`delit: brightness ${icept.toFixed(1)} + ${slope.toFixed(1)} × facing over ${n} samples (level ground ${flat.toFixed(1)})`);
  const out = new Float32Array(C * C * 3);
  for (let k = 0; k < C * C; k++) {
    const shade = land[k] ? clamp((icept + slope * facing[k]) / flat, 0.35, 1.6) : 1;
    for (let c = 0; c < 3; c++) out[k * 3 + c] = clamp(raw[k * 3 + c] / shade, 0, 255);
  }
  await printColour(out, C, "athos-delit.jpg", 0.55);
}

// 3c. THE TREES THEMSELVES (`canopy`) ----------------------------------
// Meta and the World Resources Institute's Canopy Height Map (CHMv2, 2026,
// CC BY 4.0): the height of the trees everywhere, about a metre to a pixel,
// read off very fine satellite pictures by a model (DINOv3). Real, and
// finer than anything else open over Athos: from here, forest is mostly its
// crowns — each lit on its sunny side, shaded on the other, and throwing its
// shadow on the next. So the crowns are lit here by the page's own sun at a
// little over two metres (the map's second level), and what that does to
// each place is written as a share of the light round it within the
// satellite's own pixel — so the 10 m colour is kept exactly as it is on
// average, and only what lies inside its pixels is added.
const CANOPY = 4096;             // canopy.jpg, CANOPY px over the square (3.8 m to a pixel)
const CHM = ["1221000120", "1221000121", "1221000122", "1221000123"];   // the four tiles (zoom 10, Web Mercator) Athos is on
const CHM_URL = (q) => `https://dataforgood-fb-data.s3.amazonaws.com/forests/v2/global/dinov3_global_chm_v2_ml3/chm/${q}.tif`;
const CANOPY_SKY = 0.22;         // the sky's share of the light on level ground (trials' `light`, SUN_LIGHT)
const CANOPY_MOST = 2;           // canopy.jpg: the share, 0 to CANOPY_MOST over 0 to 255 (128 is as the satellite saw it) — as itself, not its logarithm, so that the picture made smaller for the distance averages to the satellite's own colour
if (want("canopy")) {
  const { fromFile } = await import("geotiff");
  const C = 40075016.686, Z = 2 ** ZOOM * 256;
  // the square in Web Mercator metres
  const mx = (px) => (px / Z) * C - C / 2, my = (py) => C / 2 - (py / Z) * C;
  const X0 = mx(x0 * 256 + left), X1 = mx(x0 * 256 + left + side), Y0 = my(y0 * 256 + top), Y1 = my(y0 * 256 + top + side);
  // the mosaic, on the map's own global grid at its second level
  let res2 = 0, imgs = [];
  for (const q of CHM) {
    const file = path.join(CACHE, "chm", q + ".tif");
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const r = await fetch(CHM_URL(q));
      fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    }
    const tiff = await fromFile(file), full = await tiff.getImage(0), count = await tiff.getImageCount();
    let lvl = null;
    for (let i = 1; i < count; i++) { const im = await tiff.getImage(i); if (im.getWidth() === full.getWidth() / 2) { lvl = im; break; } }
    const [bx0, , , by1] = full.getBoundingBox();
    res2 = (full.getResolution()[0] * full.getWidth()) / lvl.getWidth();
    imgs.push({ q, lvl, bx0, by1 });
  }
  const g0 = Math.floor((X0 + C / 2) / res2), g1 = Math.ceil((X1 + C / 2) / res2), h0 = Math.floor((C / 2 - Y0) / res2), h1 = Math.ceil((C / 2 - Y1) / res2);
  const W = g1 - g0, H = h1 - h0, chm = new Float32Array(W * H);
  for (const { q, lvl, bx0, by1 } of imgs) {
    const ox = Math.round((bx0 + C / 2) / res2), oy = Math.round((C / 2 - by1) / res2), w = lvl.getWidth(), h = lvl.getHeight();
    const a0 = Math.max(g0, ox), a1 = Math.min(g1, ox + w), b0 = Math.max(h0, oy), b1 = Math.min(h1, oy + h);
    if (a0 >= a1 || b0 >= b1) continue;
    const ras = (await lvl.readRasters({ window: [a0 - ox, b0 - oy, a1 - ox, b1 - oy] }))[0], rw = a1 - a0;
    for (let j = b0; j < b1; j++) for (let i = a0; i < a1; i++) { const v = ras[(j - b0) * rw + (i - a0)]; chm[(j - h0) * W + (i - g0)] = v === 255 ? 0 : v; }
    console.log(`canopy: tile ${q}, ${rw} x ${b1 - b0} px`);
  }
  const ground = (res2 * Math.cos((SUMMIT.lat * Math.PI) / 180));   // m on the ground to a pixel
  // (blurred: a box, twice, r pixels either side)
  const blur = (A, r) => {
    const B = new Float32Array(A.length), O = new Float32Array(A.length), n = 2 * r + 1;
    for (let j = 0; j < H; j++) { let s = 0; for (let i = -r; i <= r; i++) s += A[j * W + clamp(i, 0, W - 1)]; for (let i = 0; i < W; i++) { B[j * W + i] = s / n; s += A[j * W + Math.min(W - 1, i + r + 1)] - A[j * W + Math.max(0, i - r)]; } }
    for (let i = 0; i < W; i++) { let s = 0; for (let j = -r; j <= r; j++) s += B[clamp(j, 0, H - 1) * W + i]; for (let j = 0; j < H; j++) { O[j * W + i] = s / n; s += B[Math.min(H - 1, j + r + 1) * W + i] - B[Math.max(0, j - r) * W + i]; } }
    return O;
  };
  const crown = blur(chm, 1);   // (a crown's own shape, its pixel noise gone)
  // the terrain under it (GLO-30), for its slope: a crown's shadow falls longer down a slope turned from the sun
  const d = await demHeights();
  const hAt = (i, j) => cubic(d, FINE, FINE, (((g0 + i + 0.5) * res2 - C / 2 - X0) / (X1 - X0)) * FINE - 0.5, ((C / 2 - (h0 + j + 0.5) * res2 - Y0) / (Y1 - Y0)) * FINE - 0.5);
  const L = [Math.sin(SUN.az) * Math.cos(SUN.alt), Math.cos(SUN.az) * Math.cos(SUN.alt), Math.sin(SUN.alt)];   // east, north, up
  const dir = [L[0], -L[1]], rise = Math.tan(SUN.alt);   // (towards the sun across the picture: rows run south)
  const light = new Float32Array(W * H), tree = new Float32Array(W * H);
  const under = blur(crown, 3);   // (the canopy round about, for how deep a gap lies in it)
  const t0 = Date.now();
  for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
    const k = j * W + i, c = crown[k];
    // the terrain's slope here (every 8 px, it barely changes)
    const tx = ((hAt(i + 4, j) - hAt(i - 4, j)) / (8 * ground)), ty = -((hAt(i, j + 4) - hAt(i, j - 4)) / (8 * ground));
    const nt = Math.hypot(tx, ty, 1), lt = Math.max(0.05, (-tx * L[0] - ty * L[1] + L[2]) / nt);
    // the crown's own slope on top of it
    const cx = tx + (crown[k + 1] - crown[k - 1]) / (2 * ground), cy = ty - (crown[k + W] - crown[k - W]) / (2 * ground);
    const nc = Math.hypot(cx, cy, 1), lc = Math.max(0, (-cx * L[0] - cy * L[1] + L[2]) / nc);
    // a shadow: anything taller along the way to the sun (the ground's own slope counted)
    const climb = rise - (tx * L[0] + ty * L[1]) / Math.hypot(L[0], L[1]);
    let vis = 1;
    if (climb <= 0.02) vis = 0;   // (the ground itself turned from the sun: only the sky lights its crowns, through their gaps)
    else for (let s = 1; s <= 24; s++) {
      const x = i + dir[0] / Math.hypot(dir[0], dir[1]) * s, y = j + dir[1] / Math.hypot(dir[0], dir[1]) * s;
      const xi = x | 0, yi = y | 0;
      if (xi < 0 || yi < 0 || xi >= W - 1 || yi >= H - 1) break;
      const over = crown[yi * W + xi] - (c + s * ground * climb);
      if (over > 0) { vis = Math.min(vis, Math.max(0, 1 - over / 2.5)); if (vis <= 0) break; }
    }
    const gap = Math.max(0, under[k] - c), sky = Math.exp(-gap / 7);
    light[k] = (1 - CANOPY_SKY) * (lc / lt) * vis * (climb > 0.02 ? 1 : 0) + CANOPY_SKY * sky;
    tree[k] = c;
  }
  console.log(`canopy: ${W} x ${H} px at ${ground.toFixed(2)} m, lit in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  // as a share of the light round it within the satellite's own pixel (10 m);
  // none where there are no trees, nor where the ground is turned from the sun
  const mean = blur(blur(light, 2), 2), cover = blur(tree, 4);
  const share = new Float32Array(W * H);
  for (let k = 0; k < share.length; k++) {
    const m = light[k] / Math.max(0.05, mean[k]), t = clamp((cover[k] - 1.5) / 3, 0, 1);
    share[k] = 1 + (m - 1) * t;
  }
  // down to CANOPY px (each the mean of the share over its area)
  const pic = new Image(CANOPY, CANOPY, { colorModel: "RGB" }), f = W / CANOPY;
  let lo = 1, hi = 1, sum = 0;
  for (let b = 0; b < CANOPY; b++) for (let a = 0; a < CANOPY; a++) {
    const i0 = Math.floor(a * f), i1 = Math.max(i0 + 1, Math.floor((a + 1) * f)), j0 = Math.floor(b * (H / CANOPY)), j1 = Math.max(j0 + 1, Math.floor((b + 1) * (H / CANOPY)));
    let s = 0, n = 0;
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) { s += share[j * W + i]; n++; }
    const v = s / n;
    lo = Math.min(lo, v); hi = Math.max(hi, v); sum += v;
    const g = Math.round(clamp((v / CANOPY_MOST) * 255, 0, 255));
    pic.setValue(a, b, 0, g); pic.setValue(a, b, 1, g); pic.setValue(a, b, 2, g);
  }
  await write(path.join(OUT, "canopy.jpg"), pic, { format: "jpeg", quality: 88 });
  console.log(`canopy.jpg (${CANOPY} px), the light's share ${lo.toFixed(2)} to ${hi.toFixed(2)}, ${(sum / CANOPY / CANOPY).toFixed(3)} on average`);
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

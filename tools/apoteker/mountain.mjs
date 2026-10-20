// ============================================================
// THE MOUNTAIN — tools/apoteker/mountain.mjs, run by hand, never by the site.
//
// Writes what Apoteker Tepe's page (tepe.js) and its motif on the Houses
// view (motifs.js) draw — both through tepe-gl.js: MOUNT ATHOS, the Holy
// Mountain of northern Greece (2,033 m), out of the real ground's heights
// and coloured by a real photograph of it from above. The owner,
// 2026-10-20: "I want there to be a whole mountain constructed in 3d in
// the background, I want you to do that using
// https://github.com/image-js/image-js ... Feel free to use an actual
// mountain that exists in the world for this, but if you do then make sure
// to actually put its name down in the credits below." And, later the same
// day: "I do not want the mountain to be translucent, i want it to be
// visible exactly the same as any other mountain; and i want there to be
// colours, not just green. it should be well coloured - like an actual
// mountain ... decrease the emphasis on the colour green ... I want the
// actual logo of the house to appear somewhere on this mountain."
//
//   1. THE GROUND: twelve elevation tiles round the summit (Mapzen's
//      terrain tiles, on AWS Open Data — "terrarium" PNGs, each pixel's
//      red, green and blue a height), read with image-js, stitched and
//      cut to a square SPAN km across with the summit in its middle.
//   2. THE HEIGHTS: that square as a 16-bit image, made small with
//      image-js (resize) to N by N and softened (gaussianBlur) — what the
//      page raises into three dimensions, kept to the metre (16 bits).
//   3. THE COLOUR: the same square as the Copernicus Sentinel-2 satellite
//      saw it on a cloudless summer morning (14 July 2023, its true-colour
//      picture, read a window at a time out of the open archive on AWS
//      with geotiff), turned from the satellite's own grid into the
//      square's, brightened as a photograph is printed, its greens quieted
//      ("decrease the emphasis on the colour green") and softened with
//      image-js — the forest, the bare marble of the summit, the scree and
//      the shallows each their own real colour. Written as a picture,
//      `images/Apoteker Tepe/mountain/athos.jpg`, which the page lays over
//      the heights.
//   4. THE TRAILS: paths up the mountain from its shore — "lines ... as if
//      tracks or trails that are just random indications" — each a walk
//      that climbs the mountain's own slopes, turning back on itself in
//      switchbacks where it is steep, and one that keeps its height round
//      the mountain's shoulder. The page draws them on the ground, marked
//      with the house's own sign.
//   5. THE PLACES: where each of the house's eight fragrances stands in
//      the page's free view, chosen off the ground by what its name is,
//      on the faces the page's view sees — see THE PLACES below.
//   6. THE SIGN: where the house's own sign is cut into the mountain, bared
//      to its red earth — a broad, even slope turned to the page's view,
//      its head uphill.
//
// Run it again only to change the mountain:
//
//   NODE_USE_ENV_PROXY=1 node tools/apoteker/mountain.mjs
//
// (NODE_USE_ENV_PROXY=1 only where the machine reaches the internet
// through a proxy. The tiles and the satellite's window are kept in the
// system's temporary folder once fetched. `--preview` also writes the
// colour and the heights as pictures into that same temporary folder, to
// look at; they are not the site's.)
//
// THE CREDITS they ask for, on the house's page: Europe terrain data
// produced using Copernicus data and information funded by the European
// Union – EU-DEM layers; SRTM and GMTED2010 terrain data courtesy of the
// U.S. Geological Survey; ETOPO1, U.S. National Oceanic and Atmospheric
// Administration; Mapzen. And: contains modified Copernicus Sentinel data
// 2023.
// ============================================================
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Image, read, write } from "image-js";
import { fromUrl } from "geotiff";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const OUT = path.join(ROOT, "tepe-data.js");
const COLOUR_AT = "images/Apoteker Tepe/mountain/athos.jpg";
const HEIGHTS_AT = "images/Apoteker Tepe/mountain/heights.png";
const CACHE = path.join(os.tmpdir(), "tepe-terrain-tiles");
const PREVIEW = process.argv.includes("--preview");

const NAME = "Mount Athos";
const SUMMIT = { lat: 40.1572, lon: 24.3264, m: 2033 };   // the peak, and its height as surveyed
const ZOOM = 12;                 // ~29 m to a pixel at this latitude
const SPAN = 15.5;               // km across the square, the summit at its middle
const N = 384;                   // the heights, N by N, 40 m apart (200 until 2026-10-20, last — "make the graphics way denser"; 160 and 8 bits before that)
const C = 1024;                  // the colour, C by C (15 m to a pixel)
const SEED = 1925;               // the walks' own randomness
// THE VIEW the page and its free view look from (2026-10-20, last — "you
// cannot turn the mountain all the way, but rather to a certain point ... set
// degree thresholds on either side of it (left right up down), so that you
// can only turn it a little. I want you to accordingly redistribute the
// waypoints"): from the west-south-west, the sun's side, so the faces it
// sees are lit; the page turns PAGE either way of it as it is scrolled, the
// free view FREE, and looks down between PITCH_FREE. tepe.js reads it from
// the data, and the places and the sign are chosen where it sees them.
const VIEW = { yaw: 2.0, pitch: 0.24, eye: 3.0, lift: 0.42, page: 0.3, free: 0.45, pitchFree: [0.17, 0.42] };

const TILE = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;
// The satellite: Sentinel-2's true-colour picture of grid square 35TKE on
// a cloudless morning (0.002% cloud), from the open archive on AWS.
const SCENE = "S2A_35TKE_20230714_0_L2A";
const TCI = `https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/35/T/KE/2023/7/${SCENE}/TCI.tif`;
const UTM_ZONE = 35;

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
/** And back: a place on the tiles at `z` (in tiles) as (lat, lon). */
function latLonOf(tx, ty, z) {
  const n = 2 ** z;
  return { lat: (Math.atan(Math.sinh(Math.PI * (1 - (2 * ty) / n))) * 180) / Math.PI, lon: (tx / n) * 360 - 180 };
}
/** (lat, lon) on the WGS 84 ellipsoid as UTM easting and northing, in m. */
function utm(lat, lon, zone) {
  const a = 6378137, f = 1 / 298.257223563, k0 = 0.9996, e2 = f * (2 - f), ep2 = e2 / (1 - e2);
  const phi = (lat * Math.PI) / 180, lam = (lon * Math.PI) / 180, lam0 = (((zone - 1) * 6 - 180 + 3) * Math.PI) / 180;
  const Nn = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2), T = Math.tan(phi) ** 2, Cc = ep2 * Math.cos(phi) ** 2, A = Math.cos(phi) * (lam - lam0);
  const M = a * ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * phi - ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * phi) + ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * phi) - ((35 * e2 ** 3) / 3072) * Math.sin(6 * phi));
  const x = k0 * Nn * (A + ((1 - T + Cc) * A ** 3) / 6 + ((5 - 18 * T + T * T + 72 * Cc - 58 * ep2) * A ** 5) / 120) + 500000;
  const y = k0 * (M + Nn * Math.tan(phi) * (A * A / 2 + ((5 - T + 9 * Cc + 4 * Cc * Cc) * A ** 4) / 24 + ((61 - 58 * T + T * T + 600 * Cc - 330 * ep2) * A ** 6) / 720));
  return { x, y };
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
/** A place in the square (0 to 1 across, 0 to 1 down) as (lat, lon). */
const placeOf = (s, t) => latLonOf(x0 + (left + s * side) / 256, y0 + (top + t * side) / 256, ZOOM);

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
const cell = (SPAN * 1000) / N;                                  // m to a cell

// 3. THE COLOUR -------------------------------------------------------
// The satellite's window round the square (its own grid is UTM zone 35,
// 10 m to a pixel), fetched once and kept.
const tiff = await fromUrl(TCI);
const scene = await tiff.getImage();
const [ox, , , oy] = [scene.getOrigin()[0], 0, 0, scene.getOrigin()[1]];
const corners = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([s, t]) => { const p = placeOf(s, t); return utm(p.lat, p.lon, UTM_ZONE); });
const wx0 = Math.floor((Math.min(...corners.map((c) => c.x)) - ox) / 10) - 8, wx1 = Math.ceil((Math.max(...corners.map((c) => c.x)) - ox) / 10) + 8;
const wy0 = Math.floor((oy - Math.max(...corners.map((c) => c.y))) / 10) - 8, wy1 = Math.ceil((oy - Math.min(...corners.map((c) => c.y))) / 10) + 8;
const ww = wx1 - wx0, wh = wy1 - wy0;
const kept = path.join(CACHE, `${SCENE}-${wx0}-${wy0}-${ww}x${wh}.rgb`);
let sat;
if (fs.existsSync(kept)) sat = new Uint8Array(fs.readFileSync(kept));
else {
  sat = await scene.readRasters({ window: [wx0, wy0, wx1, wy1], interleave: true });
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(kept, Buffer.from(sat.buffer, sat.byteOffset, sat.byteLength));
}
const satAt = (px, py, ch) => {
  const x = clamp(px, 0, ww - 1.001), y = clamp(py, 0, wh - 1.001), i = x | 0, j = y | 0, fx = x - i, fy = y - j;
  const k = (q, r) => sat[((j + r) * ww + i + q) * 3 + ch];
  return (k(0, 0) * (1 - fx) + k(1, 0) * fx) * (1 - fy) + (k(0, 1) * (1 - fx) + k(1, 1) * fx) * fy;
};
// The square, pixel by pixel, out of the satellite's grid — its raw light.
const raw = new Float32Array(C * C * 3);
for (let b = 0; b < C; b++) {
  for (let a = 0; a < C; a++) {
    const p = placeOf((a + 0.5) / C, (b + 0.5) / C), u = utm(p.lat, p.lon, UTM_ZONE);
    const px = (u.x - ox) / 10 - wx0 - 0.5, py = (oy - u.y) / 10 - wy0 - 0.5;
    for (let ch = 0; ch < 3; ch++) raw[(b * C + a) * 3 + ch] = satAt(px, py, ch);
  }
}
// PRINTED: the land's light stretched from its darkest to its brightest
// (the 1st and 99.5th of a hundred), lifted as a photograph's mid-tones
// are, the greens quieted towards olive and grey, a little warmth in it.
const landAt = (a, b) => hAt(Math.round(((a + 0.5) / C) * N - 0.5), Math.round(((b + 0.5) / C) * N - 0.5)) > 2;
const lum = [];
for (let b = 0; b < C; b += 3) for (let a = 0; a < C; a += 3) if (landAt(a, b)) { const k = (b * C + a) * 3; lum.push((raw[k] + raw[k + 1] + raw[k + 2]) / 3); }
lum.sort((p, q) => p - q);
const lo = lum[Math.floor(lum.length * 0.01)], hi = lum[Math.floor(lum.length * 0.995)];
const GAMMA = 0.56, GREEN_QUIET = 0.8, WARM = [1.06, 1.0, 0.92];
const colour = new Image(C, C, { colorModel: "RGB" });
for (let b = 0; b < C; b++) {
  for (let a = 0; a < C; a++) {
    const k = (b * C + a) * 3;
    let rgb = [0, 1, 2].map((ch) => Math.pow(clamp((raw[k + ch] - lo) / (hi - lo), 0, 1), GAMMA));
    // The green quieted: what is greener than its own grey, a share of the way back to it.
    const grey = (rgb[0] + rgb[1] + rgb[2]) / 3, greenness = clamp((rgb[1] - Math.max(rgb[0], rgb[2])) * 6, 0, 1);
    rgb = rgb.map((v, ch) => v + (grey - v) * GREEN_QUIET * greenness);
    rgb[0] += (rgb[1] - rgb[0]) * 0.32 * greenness;                  // and towards olive
    rgb = rgb.map((v, ch) => clamp(v * WARM[ch], 0, 1));
    for (let ch = 0; ch < 3; ch++) colour.setValue(a, b, ch, Math.round(rgb[ch] * 255));
  }
}
// SOFTENED, so the forest's own grain does not stand as a texture.
const printed = colour.gaussianBlur({ sigma: 0.7 });
fs.mkdirSync(path.join(ROOT, path.dirname(COLOUR_AT)), { recursive: true });
await write(path.join(ROOT, COLOUR_AT), printed, { format: "jpeg", encoderOptions: { quality: 82 } });

// 4. THE TRAILS -------------------------------------------------------
// Each a walk up the mountain from somewhere on its shore: heading for the
// summit, turned across the slope where it is steep (switchbacks), wandering
// a little, laid one cell at a time and smoothed.
const STEP = N / 160;            // the walks were first laid on a grid of 160
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
  for (let s = 0; s < 420 * STEP; s++) {
    const want = Math.atan2(toward[1] - j, toward[0] - i);
    const g = grad(i, j), steep = Math.hypot(g[0], g[1]);
    // Steep: across the slope, turning back now and then (a switchback) —
    // and, near the goal, straight for it, so a trail never knots itself
    // round the summit.
    let aim = want;
    const near = Math.hypot(toward[0] - i, toward[1] - j) < 9 * STEP;
    if (steep > 0.32 && !near) {
      aim = Math.atan2(g[1], g[0]) + side * (Math.PI / 2 - 0.35);
      if (++leg > (9 + random() * 10) * STEP) { side = -side; leg = 0; }
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
  trails.push(thin(smooth(climb(start, goal), 2), 0.9 * STEP));
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
  if (pts.length > 10) trails.push(thin(smooth(pts, 2), 0.9 * STEP));
}

// 5. THE PLACES -------------------------------------------------------
// The summit is the house's own (the page puts its sign there, "AT THE TOP
// OF THE MOUNTAIN, I WANT THE POPUP TO BE THE LOGO"); then one place for each
// of the eight, by its name (the part it is on the page), and every one on a
// face the page SEES — from the view and from either end of the page's turn
// (VIEW), nothing of the mountain in front of it, the slope turned to the eye:
//   02 THE HOLY MOUNTAIN  just under the summit, on the face seen.
//   05 THE PERADAM        high on the summit's own slopes, where Daumal's
//                         climbers find the stone in Mount Analogue.
//   07 ANABASIS           half way up a trail to the summit: the going up.
//   08 AFTER THE FLOOD    at the water's edge, at the foot of a trail.
//   01 KOGEN              (高原, "highland") the flattest high ground.
//   04 KARASU             (烏, "crow") the steepest crag, where crows sit.
//   03 BROTHER NIGHT      the darkest slope, turned from the light.
//   06 PALE FIRE          the slope most lit by the low western sun.
// The light is the page's own (from the south-south-east, as `SUN` is there).
const SUN = { az: (165 * Math.PI) / 180, alt: (32 * Math.PI) / 180 };   // the page's own light (tepe-gl.js SUN)
const litAt = (i, j) => {
  const [dx, dy] = grad(i, j), slope = Math.atan(Math.hypot(dx, dy)), aspect = Math.atan2(dy, -dx);
  return Math.cos(Math.PI / 2 - SUN.alt) * Math.cos(slope) + Math.sin(Math.PI / 2 - SUN.alt) * Math.sin(slope) * Math.cos(SUN.az - aspect);
};
const slopeAt = (i, j) => Math.hypot(...grad(i, j));
// The ground as the page raises it: half-widths of the square about the
// summit, east +x, south +z, up +y.
const hBi = (i, j) => {
  const a = clamp(i, 0, N - 1.001), b = clamp(j, 0, N - 1.001), i0 = a | 0, j0 = b | 0, fx = a - i0, fy = b - j0;
  return (hAt(i0, j0) * (1 - fx) + hAt(i0 + 1, j0) * fx) * (1 - fy) + (hAt(i0, j0 + 1) * (1 - fx) + hAt(i0 + 1, j0 + 1) * fx) * fy;
};
const worldOf = (i, j) => ({ x: (i - peak.i) / (N / 2), y: (hBi(i, j) / top8) * VIEW.lift, z: (j - peak.j) / (N / 2) });
const groundY = (x, z) => (hBi(peak.i + x * (N / 2), peak.j + z * (N / 2)) / top8) * VIEW.lift;
const eyeAt = (yaw, pitch) => ({ x: -VIEW.eye * Math.cos(pitch) * Math.sin(yaw), y: VIEW.eye * Math.sin(pitch), z: -VIEW.eye * Math.cos(pitch) * Math.cos(yaw) });
/** Whether nothing of the mountain stands between (i, j) and the eye. */
function seenFrom(i, j, yaw, pitch) {
  const p = worldOf(i, j), e = eyeAt(yaw, pitch);
  for (let k = 1; k <= 48; k++) {
    const t = (k / 48) * (k / 48) * 0.9 + 0.006;
    const x = p.x + (e.x - p.x) * t, y = p.y + 0.004 + (e.y - p.y) * t, z = p.z + (e.z - p.z) * t;
    if (y > VIEW.lift * 1.02) return true;
    if (y < groundY(x, z) - 0.002) return false;
  }
  return true;
}
/** How squarely the slope at (i, j) is turned to the eye of the view (1 facing it). */
function facing(i, j) {
  const [gx, gz] = grad(i, j), k = (VIEW.lift * (N / 2) * cell) / top8;    // the slope as the page raises it
  const nx = -gx * k, ny = 1, nz = -gz * k, nl = Math.hypot(nx, ny, nz);
  const p = worldOf(i, j), e = eyeAt(VIEW.yaw, VIEW.pitch), dx = e.x - p.x, dy = e.y - p.y, dz = e.z - p.z, dl = Math.hypot(dx, dy, dz);
  return (nx * dx + ny * dy + nz * dz) / (nl * dl);
}
const seen = (i, j) => facing(i, j) > 0.12 && [-VIEW.page, 0, VIEW.page].every((d) => seenFrom(i, j, VIEW.yaw + d, VIEW.pitch));
// Within REACH of the summit (of the square's side), where the page draws
// the mountain whole.
const REACH = 0.3;
const places = {};
const taken = [[peak.i, peak.j]];
const apart = (i, j, far) => taken.every(([p, q]) => Math.hypot(p - i, q - j) >= far);
function best(score, far = 14 * STEP) {
  let b = null, bs = -Infinity;
  for (let j = 6; j < N - 6; j++) for (let i = 6; i < N - 6; i++) {
    if (Math.hypot(i - peak.i, j - peak.j) > N * REACH || !apart(i, j, far) || !signApart(i, j)) continue;
    const s = score(i, j);
    if (s > bs && seen(i, j)) { bs = s; b = [i, j]; }
  }
  taken.push(b);
  return b;
}
// The trail to the summit the page sees most of, and the seen trail whose
// foot is at the water.
const seenShare = (t) => t.filter(([i, j], k) => k % 4 === 0 && seen(i, j)).length / Math.ceil(t.length / 4);
const toSummit = trails.filter((t) => { const [i, j] = t[t.length - 1]; return Math.hypot(i - peak.i, j - peak.j) < 4 * STEP; });
const upTrail = toSummit.slice().sort((a, b) => seenShare(b) - seenShare(a))[0] || trails[0];
const footTrail = trails.filter((t) => t !== upTrail && seen(...t[0].map(Math.round))).sort((a, b) => seenShare(b) - seenShare(a))[0] || trails[2];
const along = (t, f) => {
  // The seen place nearest that share of the way along it.
  const k0 = Math.round((t.length - 1) * f);
  for (let d = 0; d < t.length; d++) for (const k of [k0 + d, k0 - d]) if (t[k] && seen(Math.round(t[k][0]), Math.round(t[k][1]))) return t[k];
  return t[k0];
};
// 6. THE SIGN (chosen before the places, which keep off it) ------------
// A broad, even slope between a third and two thirds of the way up, on the
// face the page sees and turned squarely to it, lit, clear of the places: the house's sign CUT into it FIGURE_M metres tall,
// its head towards the summit — a part of the ground, shown by its light
// and shade ("remove the logo being plastered on the mountain; rather it
// should be a part of it").
const FIGURE_M = 2200;
const tall = FIGURE_M / cell;
const nearTrail = (i, j, far) => trails.some((t) => t.some(([p, q]) => Math.hypot(p - i, q - j) < far));
const figureAt = (() => {
  let b = null, bs = -Infinity;
  for (let j = 8; j < N - 8; j += 1) for (let i = 8; i < N - 8; i += 1) {
    const h = hAt(i, j) / top8;
    if (h < 0.3 || h > 0.66 || Math.hypot(i - peak.i, j - peak.j) > N * REACH || !apart(i, j, tall * 0.7)) continue;
    // Even: the slope much the same over the whole figure.
    let s0 = 0, s1 = 0, n = 0;
    for (let q = -3; q <= 3; q++) for (let p = -3; p <= 3; p++) { const s = slopeAt(i + p * tall / 7, j + q * tall / 7); s0 += s; s1 += s * s; n++; }
    const mean = s0 / n, spread = Math.sqrt(Math.max(0, s1 / n - mean * mean));
    // (a steep face turned to the eye is seen most squarely by a view from low down)
    if (mean < 0.3 || mean > 1.2) continue;
    const s = litAt(i, j) * 0.5 + facing(i, j) * 4 - (spread / mean) * 3 - (nearTrail(i, j, tall * 0.4) ? 1 : 0);
    if (s <= bs) continue;
    // Seen whole: its middle, and its four ends but one at most.
    const r = tall * 0.4;
    if (!seen(i, j) || [[r, 0], [-r, 0], [0, r], [0, -r]].filter(([p, q]) => seen(Math.round(i + p), Math.round(j + q))).length < 3) continue;
    bs = s; b = [i, j];
  }
  return b;
})();
const figure = { at: [Math.round(figureAt[0] * 10) / 10, Math.round(figureAt[1] * 10) / 10], tall: Math.round(tall * 10) / 10, up: Math.round(Math.atan2(peak.j - figureAt[1], peak.i - figureAt[0]) * 1000) / 1000 };

// THE PLACES, now the sign has its slope: kept off it, and off each other.
const signApart = (i, j) => Math.hypot(i - figureAt[0], j - figureAt[1]) >= tall * 0.5;
places["02"] = best((i, j) => { const h = hAt(i, j) / top8, d = Math.hypot(i - peak.i, j - peak.j); return h > 0.86 && d > 5 * STEP ? h - slopeAt(i, j) * 0.2 : -Infinity; }, 5 * STEP);
places["05"] = best((i, j) => { const h = hAt(i, j) / top8; return h > 0.72 && h < 0.86 ? -Math.abs(Math.hypot(i - peak.i, j - peak.j) - 12 * STEP) - slopeAt(i, j) : -Infinity; }, 9 * STEP);
places["07"] = along(upTrail, 0.5); taken.push(places["07"]);
places["08"] = footTrail[0]; taken.push(places["08"]);
places["01"] = best((i, j) => { const h = hAt(i, j) / top8; return h > 0.45 && h < 0.75 ? -slopeAt(i, j) * 4 - Math.abs(h - 0.6) : -Infinity; });
places["04"] = best((i, j) => { const h = hAt(i, j) / top8; return h > 0.35 && h < 0.8 ? slopeAt(i, j) : -Infinity; });
places["03"] = best((i, j) => { const h = hAt(i, j) / top8; return h > 0.3 && h < 0.7 ? -litAt(i, j) : -Infinity; });
places["06"] = best((i, j) => { const h = hAt(i, j) / top8; return h > 0.3 && h < 0.7 ? litAt(i, j) : -Infinity; });


// WRITE ---------------------------------------------------------------
// The heights as a picture, each place's height a share of `top` in sixteen
// bits — its red the high byte, its green the low (as the terrain tiles
// themselves are written) — read back by the page off a canvas.
const hPic = new Image(N, N, { colorModel: "RGB" });
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    const v = Math.round(clamp(hAt(i, j) / top8, 0, 1) * 65535);
    hPic.setValue(i, j, 0, v >> 8); hPic.setValue(i, j, 1, v & 255); hPic.setValue(i, j, 2, 0);
  }
}
await write(path.join(ROOT, HEIGHTS_AT), hPic, { format: "png" });
const round = (v) => Math.round(v * 10) / 10;
const data = {
  name: NAME,
  where: "Mount Athos, Chalkidiki, Greece",
  n: N,
  km: SPAN,
  top: Math.round(top8),
  summit: [peak.i, peak.j],
  heights: HEIGHTS_AT,
  colour: COLOUR_AT,
  view: VIEW,
  scene: "Copernicus Sentinel-2, " + SCENE,
  trails: trails.map((t) => t.map(([i, j]) => [round(i), round(j)])),
  places: Object.fromEntries(Object.entries(places).sort().map(([k, [i, j]]) => [k, [round(i), round(j)]])),
  figure,
};
fs.writeFileSync(OUT, `// THE MOUNTAIN Apoteker Tepe's page and its motif on the Houses view draw:\n` +
  `// ${NAME} (2,033 m), out of the real ground's heights — written by\n` +
  `// tools/apoteker/mountain.mjs with image-js, never by hand. \`heights\` is a\n` +
  `// picture of N by N heights, each a share of \`top\` metres in sixteen bits\n` +
  `// (red the high byte, green the low); \`colour\` the picture of it from above\n` +
  `// that is laid over them (the satellite's, printed); \`view\` where the page\n` +
  `// looks from and how far it may turn; \`trails\` are walks on that grid,\n` +
  `// \`places\` where each fragrance stands in the free view, \`figure\` where the\n` +
  `// house's sign is cut.\n` +
  `window.TEPE = ${JSON.stringify(data)};\n`);
console.log(`${NAME}: ${side}px of ground at ${mPerPx.toFixed(1)} m, highest ${Math.round(tallest)} m (${Math.round(top8)} m at ${N}x${N}); ${trails.length} trails (${trails.map((t) => t.length).join(", ")} points); the colour stretched ${lo.toFixed(0)}–${hi.toFixed(0)}; the sign at ${figure.at} (${figure.tall} cells); wrote ${path.relative(ROOT, OUT)} (${fs.statSync(OUT).size} bytes), ${HEIGHTS_AT} (${fs.statSync(path.join(ROOT, HEIGHTS_AT)).size} bytes) and ${COLOUR_AT} (${fs.statSync(path.join(ROOT, COLOUR_AT)).size} bytes)`);

if (PREVIEW) {
  const h8 = new Image(N, N, { colorModel: "GREY" });
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) h8.setValue(i, j, 0, Math.round((hAt(i, j) / top8) * 255));
  await write(path.join(CACHE, "preview-heights.png"), h8.resize({ width: N * 3, height: N * 3 }));
  await write(path.join(CACHE, "preview-colour.png"), printed);
  console.log(`previews written to ${CACHE}`);
}

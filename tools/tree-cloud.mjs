// ============================================================
// THE TREE'S CLOUD — made once, from the owner's photograph, for the test
// page (works/test-page.html, drawn by tree.js).
//
// The owner, 2026-09-26: "The tree, i want you to take the image as is
// and make it into a 3d one, not recreate it. i want the tree as is to be
// made into a 3d tree." — as "a cloud of coloured specks", turning "all
// the way round", with its labels. And before that: "render the ground
// with it, but not all of the background".
//
// So every speck IS a pixel of the photograph, in its own colour, and all
// this script does is say how far away each one is. A photograph does not
// say that, so it is worked out from a model of what is in it, traced off
// the picture itself:
//
//   - THE CAMERA that took it: where the picture's middle is, how wide it
//     sees (`F`), how far it looks down (`PITCH`) and how high it stood
//     (`EYE`). Every pixel is a ray out of it.
//   - THE GROUND: a floor. A pixel of the ground is where its ray meets
//     the floor — which is what makes the lower part of the picture near
//     and the upper far. Anything green on it (the ferns, the seedlings)
//     stands a little off it, as leaves do.
//   - THE TRUNK: an upright column of the width the picture shows at each
//     height, standing on the ground behind its flare. A pixel of the trunk
//     is where its ray meets the column's near side; and the column's far
//     side, which the photograph cannot show, is given the same pixels —
//     so it can be turned all the way round and still be a trunk.
//   - THE ROOTS: tubes along lines traced down each root (`ROOTS`), each
//     point of the line with how high off the ground the root runs there —
//     the great one arching over its hollow — and how thick it is. A pixel
//     of a root is where its ray meets the tube's upper side; the underside
//     is given the same pixels where it stands off the ground.
//   - THE STONES: low domes where the picture shows them.
//   - AND WHAT IS NOT KEPT: the foliage and the second tree behind, and
//     any ground further from the trunk than `KEEP` — so the ground is a
//     patch round the tree, thinning out at its edge, and the rest of the
//     background is gone.
//
// Out (into images/Test-Page/): tree-cloud.bin — for every speck three
// whole numbers for where it is (in thousandths of `UNIT`) and three bytes
// for its colour — and tree-cloud.json, saying how many, and where each of
// the labels comes out of.
//
// Run it with `node tools/tree-cloud.mjs` after `npm install` (it needs
// image-js, which is in package.json for it). The site never runs it;
// it only reads what it made.
// ============================================================
import { readSync } from "image-js";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "images", "Test-Page");
const photo = readSync(join(OUT, "tree.jpg"));
const W = photo.width, H = photo.height;

// ---------- THE CAMERA ----------
const F = 760;                         // px, how wide it sees
const CX = W / 2, CY = H / 2;
const PITCH = (30 * Math.PI) / 180;    // how far it looks down
const EYE = 1.6;                       // how high it stood, in metres (roughly)
const cosP = Math.cos(PITCH), sinP = Math.sin(PITCH);
/** The way pixel (u, v) looks, in the world: x to the right, y up, z away. */
const ray = (u, v) => {
  const dx = (u - CX) / F, dy = (v - CY) / F;
  return [dx, -dy * cosP - sinP, -dy * sinP + cosP];
};
// THE GROUND is level in front of the trunk and rises behind it, as the
// photograph's slope does (`SLOPE`, from the trunk's foot back).
const SLOPE = 0.26;
let SLOPE_FROM = Infinity;             // set once the trunk's foot is known
const groundAt = (z) => (z > SLOPE_FROM ? (z - SLOPE_FROM) * SLOPE : 0);
/** Where pixel (u, v)'s ray comes down to height `h` off the ground. */
const atHeight = (u, v, h) => {
  const r = ray(u, v);
  let t = (EYE - h) / Math.max(1e-4, -r[1]);
  if (r[2] * t > SLOPE_FROM) {
    // On the slope: EYE + r1 t = h + SLOPE (r2 t - SLOPE_FROM).
    t = (EYE - h + SLOPE * SLOPE_FROM) / Math.max(1e-4, SLOPE * r[2] - r[1]);
  }
  return [r[0] * t, EYE + r[1] * t, r[2] * t];
};

// ---------- WHAT IS IN THE PICTURE, traced off it (in its own pixels) ----------
// The trunk's outline.
const TRUNK = [[428, 0], [544, 0], [550, 62], [559, 106], [572, 144], [594, 187], [619, 219], [644, 244], [681, 262],
  [640, 280], [590, 292], [560, 300], [520, 266], [470, 250], [430, 248], [400, 252], [372, 230], [358, 218],
  [380, 205], [398, 185], [412, 150], [420, 110], [425, 60]];
// Where the trunk stands: the ground under the middle of its flare.
const TRUNK_FOOT = [498, 318];
// The roots: lines down each, and at every point how wide it is (px), and
// how high its middle runs off the ground (m).
const ROOTS = {
  arch: [[505, 300, 36, 0.2], [475, 276, 31, 0.3], [406, 276, 28, 0.36], [350, 294, 27, 0.35], [294, 319, 28, 0.31],
    [237, 350, 30, 0.25], [181, 381, 33, 0.19], [137, 425, 35, 0.13], [106, 469, 32, 0.1]],
  leg: [[318, 352, 26, 0.13], [335, 395, 30, 0.13], [352, 430, 28, 0.12], [362, 447, 20, 0.1]],
  cut: [[615, 285, 22, 0.12], [640, 318, 22, 0.13], [665, 355, 26, 0.15], [700, 380, 24, 0.14], [714, 392, 20, 0.13]],
  cutFoot: [[665, 355, 22, 0.12], [650, 400, 22, 0.11], [640, 430, 18, 0.09]],
  right: [[650, 262, 18, 0.1], [700, 275, 17, 0.09], [740, 290, 15, 0.08]],
  left: [[380, 222, 19, 0.13], [330, 240, 19, 0.12], [280, 262, 18, 0.12], [240, 268, 17, 0.11], [180, 265, 16, 0.1],
    [100, 262, 16, 0.1], [40, 262, 15, 0.09], [8, 276, 14, 0.08]],
  upper1: [[112, 125, 14, 0.09], [250, 128, 14, 0.1], [340, 138, 14, 0.1], [400, 150, 14, 0.1]],
  upper2: [[156, 170, 13, 0.09], [250, 172, 13, 0.1], [330, 180, 13, 0.1], [392, 188, 13, 0.1]],
  upper3: [[37, 207, 12, 0.08], [150, 210, 12, 0.09], [250, 213, 12, 0.09], [325, 218, 12, 0.1]],
};
// The stones: middle, half-width, half-height (px) and how high (m).
// (The stone in the hollow of the trunk's foot is left as part of the trunk.)
const STONES = [[628, 502, 50, 30, 0.2], [150, 327, 38, 22, 0.13], [245, 288, 30, 13, 0.06], [317, 482, 18, 12, 0.05]];
// Above this line (px, from the left edge across) is the background:
// foliage, and the second tree — never kept unless it is the trunk.
const SKY = (u) => (u < 420 ? 110 : u > 560 ? 150 : 110 + ((u - 420) / 140) * 40);
const KEEP = [1.9, 2.6];               // m round the trunk: all the ground kept, and none
const EDGE = 70;                       // px in from the photograph's sides and foot over which the ground thins out

// ---------- THE WORK ----------
const inside = (poly, x, y) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
/** The nearest point of a root's line: how far across it (0 in the middle,
    1 at its edge) and how high and wide it runs there. */
function onRoot(line, u, v) {
  let best = null;
  for (let k = 0; k < line.length - 1; k++) {
    const [x0, y0, w0, h0] = line[k], [x1, y1, w1, h1] = line[k + 1];
    const ex = x1 - x0, ey = y1 - y0, L = ex * ex + ey * ey || 1;
    const s = Math.max(0, Math.min(1, ((u - x0) * ex + (v - y0) * ey) / L));
    const px = x0 + ex * s, py = y0 + ey * s, d = Math.hypot(u - px, v - py);
    const w = w0 + (w1 - w0) * s;
    if (!best || d / w < best.across) best = { across: d / w, w, h: h0 + (h1 - h0) * s, px, py, seg: [line[k], line[k + 1]] };
  }
  return best && best.across <= 1 ? best : null;
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
/** Where pixel (u, v)'s ray meets a root: a tube round the line between
    two of its traced points, each stood in the world at its own height,
    as thick as the picture shows it there. Out: the near side and the far.
    A tube rather than a raised strip, so a root seen from the side is
    round — the ones up the slope were flat planks when it was a strip. */
function onTube(root, u, v) {
  const [[x0, y0, w0, h0], [x1, y1, w1, h1]] = root.seg;
  const A = atHeight(x0, y0, h0), B = atHeight(x1, y1, h1), eyeAt = [0, EYE, 0];
  const L = Math.hypot(...sub(B, A)) || 1, D = scale(sub(B, A), 1 / L);
  // Its radius where the pixel falls along it.
  const t0 = Math.max(0, Math.min(1, dot(sub(atHeight(u, v, root.h), A), D) / L));
  const Cm = [A[0] + (B[0] - A[0]) * t0, A[1] + (B[1] - A[1]) * t0, A[2] + (B[2] - A[2]) * t0];
  const r = ((w0 + (w1 - w0) * t0) / F) * Math.hypot(...sub(Cm, eyeAt));
  const R = ray(u, v), w = sub(eyeAt, A);
  const Rp = sub(R, scale(D, dot(R, D))), wp = sub(w, scale(D, dot(w, D)));
  const a = dot(Rp, Rp), b = 2 * dot(wp, Rp), c = dot(wp, wp) - r * r, disc = b * b - 4 * a * c;
  const tn = disc > 0 ? (-b - Math.sqrt(disc)) / (2 * a) : -b / (2 * a), tf = disc > 0 ? (-b + Math.sqrt(disc)) / (2 * a) : tn;
  const at = (t) => [R[0] * t, EYE + R[1] * t, R[2] * t];
  return [at(tn), at(tf)];
}
// The trunk's width, row by row, off its outline.
const trunkRow = [];
for (let v = 0; v < H; v++) {
  let lo = Infinity, hi = -Infinity;
  for (let u = 0; u < W; u++) if (inside(TRUNK, u + 0.5, v + 0.5)) { lo = Math.min(lo, u); hi = Math.max(hi, u); }
  trunkRow.push(lo <= hi ? [lo, hi] : null);
}
// The trunk stands on the ground behind the front of its flare.
const foot = atHeight(TRUNK_FOOT[0], TRUNK_FOOT[1], 0);
const TRUNK_Z = foot[2] + 0.34, TRUNK_X = foot[0];
SLOPE_FROM = TRUNK_Z;
/** Where pixel (u, v)'s ray meets the trunk: a column round an upright
    axis, as wide as the picture shows the trunk at that height. Out: the
    near side, and the far. */
// The column itself: straight up the middle of the trunk as the upper part
// of the picture shows it, as wide as the picture shows — but no wider at
// its foot than a flare (`FLARE`); what the outline holds beyond that is
// the flare running out into the roots.
const AXIS_U = (v) => 486 + v * 0.04;
const COLUMN_PX = 60, FLARE = 0.75;
const columnPx = (v) => {
  const row = trunkRow[Math.min(H - 1, Math.max(0, Math.round(v)))];
  if (!row) return 0;
  // Above the flare, the whole of the outline is the column.
  const whole = Math.max(AXIS_U(v) - row[0], row[1] - AXIS_U(v));
  if (v < 200) return whole;
  const f = Math.max(0, Math.min(1, (v - 150) / (TRUNK_FOOT[1] - 150)));
  return Math.min(whole, COLUMN_PX * (1 + FLARE * f * f));
};
function onTrunk(u, v) {
  const halfPx = columnPx(v);
  if (!halfPx || Math.abs(u - AXIS_U(v)) > halfPx) return null;
  const mid = AXIS_U(v);
  const rm = ray(mid, v), tAxis = TRUNK_Z / rm[2];
  const ax = rm[0] * tAxis, R = (halfPx / F) * tAxis * 1.02;
  const d = ray(u, v);
  const a = d[0] * d[0] + d[2] * d[2], b = -2 * (d[0] * ax + d[2] * TRUNK_Z), c = ax * ax + TRUNK_Z * TRUNK_Z - R * R;
  const disc = b * b - 4 * a * c;
  const tn = disc > 0 ? (-b - Math.sqrt(disc)) / (2 * a) : -b / (2 * a), tf = disc > 0 ? (-b + Math.sqrt(disc)) / (2 * a) : tn;
  const at = (t) => [d[0] * t, EYE + d[1] * t, d[2] * t];
  return [at(tn), at(tf)];
}

let seed = 20260926;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const data = photo.getRawImage().data, CH = photo.channels;
const colour = (u, v) => {
  const k = (Math.min(H - 1, Math.floor(v)) * W + Math.min(W - 1, Math.floor(u))) * CH;
  return [data[k], data[k + 1], data[k + 2]];
};
const specks = [];                     // [x, y, z, r, g, b]
// THE SOIL the photograph never shows — under the roots and the stones,
// and behind the trunk — is given the colours of the soil it does show,
// taken from the open ground in front (none of it green).
const SOIL = [];
for (let n = 0; SOIL.length < 400 && n < 20000; n++) {
  const c = colour(300 + rnd() * 300, 470 + rnd() * 90);
  if (!(c[1] > c[0] + 4)) SOIL.push(c);
}
const soil = () => SOIL[Math.floor(rnd() * SOIL.length)];
/** Ground where a pixel's ray comes down behind whatever it met first —
    only as far round the trunk as the rest of the ground is kept. */
function hidden(u, v, dark, reach) {
  const p = atHeight(u, v, 0);
  const far = Math.hypot(p[0] - TRUNK_X, p[2] - TRUNK_Z);
  if (reach && far > reach) return;
  if (far > KEEP[0] && rnd() < (far - KEEP[0]) / (KEEP[1] - KEEP[0])) return;
  const was = part;
  part = "fill";
  add(p, soil(), dark);
  part = was;
}
// Out, the trunk's axis is the middle, and z is turned round — the page
// looks along -z, and a picture looked at along +z comes out mirrored.
const DEBUG = process.env.TREE_DEBUG ? {} : null;   // colour by part, to see what went where
let part = "ground";
const PARTS = { ground: [150, 150, 150], root: [220, 40, 40], trunk: [40, 60, 220], fill: [240, 200, 0], stone: [0, 170, 0], flare: [200, 0, 200] };
const add = (p, c, dark) => specks.push([p[0] - TRUNK_X, p[1], TRUNK_Z - p[2], ...(DEBUG ? PARTS[part] : c).map((x) => Math.round(x * (dark || 1)))]);
const STEP = 1.6;                      // one speck for every 1.6 pixels each way
for (let gy = 0; gy < H; gy += STEP) for (let gx = 0; gx < W; gx += STEP) {
  const u = gx + rnd() * STEP, v = gy + rnd() * STEP;
  const c = colour(u, v);
  // A stone?
  const stone = STONES.find(([sx, sy, rx, ry]) => ((u - sx) / rx) ** 2 + ((v - sy) / ry) ** 2 < 1);
  if (stone) {
    const [sx, sy, rx, ry, sh] = stone, s = Math.sqrt(((u - sx) / rx) ** 2 + ((v - sy) / ry) ** 2);
    part = "stone";
    add(atHeight(u, v, sh * Math.sqrt(Math.max(0, 1 - s * s))), c);
    hidden(u, v, 0.8);
    continue;
  }
  // A root? (Over the trunk, where the great one crosses its foot.)
  let root = null;
  for (const line of Object.values(ROOTS)) {
    const r = onRoot(line, u, v);
    if (r && (!root || r.across < root.across)) root = r;
  }
  if (root) {
    const [near, back] = onTube(root, u, v);
    part = "root";
    add(near, c);
    // Its far side, where it stands clear of the ground, a little darker.
    if (back[1] > groundAt(back[2]) + 0.02) add(back, c, 0.7);
    hidden(u, v, 0.75);
    continue;
  }
  // The trunk? Its near side, and its far side, a little darker, as the
  // side away from the light is.
  if (inside(TRUNK, u, v)) {
    // It thins out towards the top of the picture, where the photograph
    // stops, rather than being cut off.
    if (v < 70 && rnd() > v / 70) continue;
    const t = onTrunk(u, v);
    if (t) {
      part = "trunk";
      add(t[0], c);
      add(t[1], c, 0.62);
      if (v > 220) hidden(u, v, 0.7, 0.9);
    } else {
      // The flare running out beyond the column: a surface sloping from
      // the trunk down to the ground.
      part = "flare";
      add(atHeight(u, v, Math.max(0.02, (TRUNK_FOOT[1] - v) * (TRUNK_Z / F) * 0.5)), c);
    }
    continue;
  }
  // The background: never.
  if (v < SKY(u)) continue;
  // The ground, and whatever grows on it. Leaves stand a little off it.
  const green = c[1] > c[0] + 10 && c[1] > c[2] + 4;
  const p = atHeight(u, v, green ? 0.03 + rnd() * 0.1 : 0);
  // Only a patch round the tree, thinning out at its edge — and at the
  // photograph's own edges, so it never ends in a straight cut.
  const far = Math.hypot(p[0] - TRUNK_X, p[2] - TRUNK_Z);
  if (far > KEEP[0] && rnd() < (far - KEEP[0]) / (KEEP[1] - KEEP[0])) continue;
  const edge = Math.min(u, W - u, H - v) / EDGE;
  if (edge < 1 && rnd() > edge * edge) continue;
  part = "ground";
  add(p, c);
}

// ---------- WHERE THE LABELS COME OUT OF ----------
// A pixel of each part, and which way it faces out of the tree.
const LABELS = {
  trunk: { at: [488, 90], kind: "trunk" },
  flare: { at: [555, 245], kind: "trunk" },
  arch: { at: [406, 262], kind: "root", line: "arch" },
  hollow: { at: [440, 330], kind: "ground" },
  leg: { at: [335, 395], kind: "root", line: "leg" },
  upper: { at: [250, 170], kind: "root", line: "upper2" },
  cut: { at: [700, 380], kind: "root", line: "cut" },
  stone: { at: [628, 482], kind: "stone" },
  fern: { at: [110, 480], kind: "ground", lift: 0.1 },
  floor: { at: [470, 520], kind: "ground" },
};
const anchors = {};
for (const [name, l] of Object.entries(LABELS)) {
  const [u, v] = l.at;
  let p;
  if (l.kind === "trunk") p = (onTrunk(u, v) || [atHeight(u, v, Math.max(0.02, (TRUNK_FOOT[1] - v) * (TRUNK_Z / F) * 0.5))])[0];
  else if (l.kind === "root") p = onTube(onRoot(ROOTS[l.line], u, v), u, v)[0];
  else if (l.kind === "stone") p = atHeight(u, v, STONES[0][4]);
  else p = atHeight(u, v, l.lift || 0);
  const at = [p[0] - TRUNK_X, p[1], TRUNK_Z - p[2]];
  // Facing: out from the trunk's axis for the trunk; up for everything
  // lying on the ground.
  const out = l.kind === "trunk" ? [at[0], 0.2, at[2]] : [0, 1, 0];
  anchors[name] = { at: at.map((x) => +x.toFixed(4)), out: out.map((x) => +x.toFixed(3)) };
}

// ---------- OUT ----------
const UNIT = 1000;                     // thousandths of a metre
const buf = Buffer.alloc(specks.length * 9);
specks.forEach(([x, y, z, r, g, b], i) => {
  buf.writeInt16LE(Math.round(x * UNIT), i * 9);
  buf.writeInt16LE(Math.round(y * UNIT), i * 9 + 2);
  buf.writeInt16LE(Math.round(z * UNIT), i * 9 + 4);
  buf.writeUInt8(r, i * 9 + 6); buf.writeUInt8(g, i * 9 + 7); buf.writeUInt8(b, i * 9 + 8);
});
writeFileSync(join(OUT, "tree-cloud.bin"), buf);
// The camera that took the photograph, as seen from the trunk: so the page
// can open exactly where the picture was taken from.
const camera = { at: [-TRUNK_X, EYE, TRUNK_Z].map((x) => +x.toFixed(4)), pitch: +PITCH.toFixed(4), fov: +((2 * Math.atan(CY / F) * 180) / Math.PI).toFixed(3) };
writeFileSync(join(OUT, "tree-cloud.json"), JSON.stringify({ count: specks.length, unit: UNIT, camera, anchors }, null, 1) + "\n");
console.log(specks.length + " specks, " + (buf.length / 1024).toFixed(0) + " KB");

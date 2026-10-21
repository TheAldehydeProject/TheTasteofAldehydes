// ============================================================
// THE MOUNTAIN, DRAWN — tepe-gl.js
//
// Apoteker Tepe's mountain as both of its pages draw it: the house's own
// page (tepe.js), whole behind the writing with the land round it, and the
// Houses view (motifs.js), in fragments. The owner, 2026-10-20, last: "make
// the graphics way denser and make it a little nicer. After you do that, i
// want you to actually make it a little digitalized ... give it noise. most
// importantly, make it look good and graphically dense. i also want you to
// remove the logo being plastered on the mountain; rather it should be a
// part of it ... make it seem less like an island; i want there to be an
// abstract biome/environment/background all around this one mountain ...
// fix the text, so that it feels ... that the mountain loses opacity instead
// of putting a whole object in front of it ... simulate mist that moves in
// and around this mountain; but I would ask that this be really high
// quality."
//
//   THE GROUND    Mount Athos out of its real heights (`TEPE.heights`, a
//                 picture of them 40 m apart) and coloured by a real
//                 photograph of it from above — the Copernicus Sentinel-2
//                 satellite's, printed and its greens quieted
//                 (`TEPE.colour`; both written by tools/apoteker/mountain.mjs)
//                 — lit by a low sun from the south-west, its hollows darker.
//   THE LAND      round it, all the way to the horizon, a land of no map:
//                 the peninsula's ridge running on out of the square, water
//                 lying in the gulfs either side as the sea does there, and
//                 beyond the water rolling hills — meadow, scrub, a
//                 patchwork of fields, woods, rock where it is steep — and
//                 far ranges going blue into the haze (`proc`), with a faint
//                 contour now and then, as on a map.
//   THE SIGN      the house's own sign CUT INTO a broad slope turned to the
//                 view (`TEPE.figure`): its ground lowered a little and bared
//                 to the red earth under the scrub, its edges catching the
//                 light and the shade, few specks left in it — a part of the
//                 mountain, lit and shaded with it, not painted on.
//   SOLID         a SURFACE — the heights as a mesh of triangles, every one
//                 opaque, hiding what stands behind it — and over it the
//                 SPECKS, very small and very many, each the ground's own
//                 colour lit as it is: a mountain made of particles that is
//                 a mountain all the same.
//   THE AIR       between the eye and everything, the haze that turns far
//                 land into the sky's colour; and MIST lying low in it — an
//                 exponential mist, thickest in the valleys and over the
//                 water, worked out along the whole way from the eye
//                 (`throughAir`), drifting in wisps — and banks of it,
//                 drifting round the mountain and streaming off its summit,
//                 each a soft volume lit by the sun, sinking into the ground
//                 where it meets it (`mist`). The shadows of clouds pass
//                 over the land.
//   DIGITAL       every colour drawn is DITHERED — an ordered pattern a css
//                 pixel to a step, and a fine grain — so the light comes in
//                 steps, as a screen of not many colours shows it ("make it
//                 a little digitalized ... give it noise").
//   THE QUIET     behind the writing, the mountain and its land lose their
//                 OPACITY (the page hands in where the words are, `quiet`),
//                 showing the sky and the haze behind them — nothing laid in
//                 front of them.
//
// WebGL: four small programs — the sky, the ground, the specks, the mist —
// each checked once compiled; if one fails, `make` gives nothing and the
// page goes on without its mountain rather than with a blank. On a machine
// drawing without a graphics card (a test's browser, an old laptop) it
// lays a tenth of the specks and a coarser ground.
//
//   TepeGL.ground()          a promise of the ground: its heights, its
//                            colour, the land round it, its sign, made once.
//   TepeGL.make(canvas)      a drawing on that canvas, or null.
//     .piece(ground, opts)   the ground made ready to draw — the whole world
//                            round the mountain (`world`), or a fragment.
//     .mist(ground, opts)    banks of mist made ready to draw.
//     .size(w, h, ratio), .clear(), .sky(cam, look), .draw(piece, cam,
//     look), .drawMist(mist, cam, look), .quiet(values, w, h)
//   TepeGL.project(p, cam)   where a point stands on the window, as the
//                            drawing puts it (for what is drawn over it).
//
// THE CAMERA is the page's, as it always was: turned about the upright
// (`yaw`), looked down on (`pitch`), its eye `eye` half-widths off, drawn
// `S` px to a half-width about (`cx`, `cy`).
// ============================================================
(function () {
  const DATA = window.TEPE;
  if (!DATA || window.TepeGL) return;

  // ---------- TUNING ----------
  // The light: from the south-south-east, low — across the view from the
  // west-south-west, so the land is modelled by it (from the south-west, as
  // it was, it stood behind the eye and the land lay flat).
  const SUN = { az: (165 * Math.PI) / 180, alt: (32 * Math.PI) / 180 };
  const SHADE_FLOOR = 0.5;         // how much light a slope turned from the sun still has
  const SHADE_GAIN = 0.66;         // and how much more one facing it gets
  const HOLLOW = 7;                // how much darker the hollows are (the heights against their own blur)
  const CARRY = 0.55;              // half-widths over which the peninsula's ground runs on past the square
  const WORLD = 9.5;               // half-widths the land reaches round the summit, into the haze
  const SOFT_SHARE = 0.1;          // a tenth of the specks without a graphics card
  // The land's colours (0 to 1), muted, so the satellite's mountain sits in it.
  const LAND = {
    meadow: [0.74, 0.66, 0.46], scrub: [0.53, 0.52, 0.38], fieldA: [0.71, 0.63, 0.41], fieldB: [0.55, 0.57, 0.4],
    forest: [0.35, 0.38, 0.3], rock: [0.62, 0.58, 0.52], high: [0.7, 0.7, 0.68],
  };
  const SHALLOW = [0.62, 0.71, 0.68], DEEP = [0.36, 0.47, 0.48];
  // The sign cut in: how deep (in the ground's own heights, a share of `top`), and how pale the earth it lays bare.
  // The sign CUT IN: its ground lowered a little and bared to the red earth
  // a limestone mountain has under its scrub (terra rossa) — its edges
  // catching the light on one side and in shade on the other, few specks
  // left in it. (A pale cut, as a chalk figure is, was lost on Athos's own
  // pale limestone; a dark wood in its shape, on its own dark woods.)
  const SIGN_DEPTH = 0.009;        // how deep the cut (a share of `top`)
  const SIGN_EARTH = 0.72;         // how much of the ground in it is the bare earth, EARTH
  const EARTH = [0.67, 0.5, 0.37];
  const SIGN_KEPT = 0.3;           // of the specks in it, so many left
  const SIGN_PX = 256;             // the sign's own picture, SIGN_PX square

  const n = DATA.n;
  const root = window.SITE_ROOT || "../";
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  // ---------- THE TRIALS OF ITS RESOLUTION ----------
  // The owner, 2026-10-21: "its ugly, and the main reason is the resolution
  // ... give me a list of ways to make the resolution better, including
  // demonstrations of each way separately (a trial render) ... new ways to
  // render it, as well as alterations to the existing model." Each way is
  // one word in `?res=` on the address (several with commas, `?res=best`
  // the best of them together); without it the page draws as it did. The
  // finer pictures some of them read are written by tools/apoteker/trials.mjs
  // into TRIAL. Whichever the owner does not keep comes out of the code.
  const RES = new Set(((location.search.match(/[?&]res=([^&#]*)/) || [])[1] || "").split(/[,+]/).map((s) => decodeURIComponent(s).trim()).filter(Boolean));
  // (`best`: those that gained most, together; `ceiling`: the same with the
  // two that cost most on top — what a picture made once, slowly, would be)
  const BEST = ["native", "accum", "ditherfine", "dem", "normals", "shore", "aniso", "photo", "shadows", "ao", "trailsgl", "finespecks"];
  const CEILING = [...BEST, "raymarch", "ss2"];
  if (RES.has("best")) BEST.forEach((k) => RES.add(k));
  if (RES.has("ceiling")) CEILING.forEach((k) => RES.add(k));
  const res = (k) => RES.has(k);
  // (No trial asked for, and none of the trials' code is in the programs
  // at all — `#ifdef TRIALS` — nor their arithmetic on the processor: the
  // page draws exactly as it did, at its own speed.)
  const TRIALS = RES.size > 0;
  const TRIAL = "images/Apoteker Tepe/mountain/trials/";
  const TRIAL_HEIGHT_SCALE = 1.25;  // (trials.mjs HEIGHT_SCALE: its heights are a share of top / this)
  const MAP_PX = 2048;             // the baked normals and the trails' picture, MAP_PX square over the mountain's square
  const SHORE_TOP = 0.02;          // `shore`: the heights to so much of top kept, finely, in the normals' fourth channel

  // ---------- NOISE ----------
  // Gradient noise on a seeded lattice, for the land's heights.
  function lattice(seed) {
    let s = seed >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const perm = new Uint8Array(512), gx = new Float32Array(256), gy = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const a = rnd() * Math.PI * 2; gx[i] = Math.cos(a); gy[i] = Math.sin(a); perm[i] = i; }
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, X = xi & 255, Y = yi & 255;
      const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10), v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
      const a = perm[X + perm[Y]], b = perm[X + 1 + perm[Y]], c = perm[X + perm[Y + 1]], d = perm[X + 1 + perm[Y + 1]];
      const n00 = gx[a] * xf + gy[a] * yf, n10 = gx[b] * (xf - 1) + gy[b] * yf, n01 = gx[c] * xf + gy[c] * (yf - 1), n11 = gx[d] * (xf - 1) + gy[d] * (yf - 1);
      return (n00 + (n10 - n00) * u + (n01 - n00 + (n11 - n10 - n01 + n00) * u) * v) * 1.41;
    };
  }
  const HILLS = lattice(1871), RANGES = lattice(2033), WOBBLE = lattice(1925);
  const fbm = (f, x, y, oct) => { let s = 0, a = 0.5, k = 1; for (let o = 0; o < oct; o++) { s += a * f(x * k, y * k); a *= 0.5; k *= 2.03; } return s; };
  const ridged = (f, x, y, oct) => { let s = 0, a = 0.5, k = 1; for (let o = 0; o < oct; o++) { const r = 1 - Math.abs(f(x * k, y * k)); s += a * r * r; a *= 0.5; k *= 2.07; } return s; };

  // A picture of noise the programs read (and the specks' colours, here):
  // four kinds of it, one to a channel, each tiling.
  const NOISE = 256;
  function noisePicture() {
    const out = new Uint8Array(NOISE * NOISE * 4);
    const value = (seed, period) => {
      let s = seed;
      const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      const g = new Float32Array(period * period);
      for (let i = 0; i < g.length; i++) g[i] = rnd();
      return (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
        const a = ((xi % period) + period) % period, b = ((yi % period) + period) % period, a1 = (a + 1) % period, b1 = (b + 1) % period;
        const p = g[b * period + a], q = g[b * period + a1], r = g[b1 * period + a], t = g[b1 * period + a1];
        return p + (q - p) * u + (r - p + (t - q - r + p) * u) * v;
      };
    };
    const kinds = [[11, 8, 4], [23, 16, 4], [37, 4, 5], [41, 32, 3]];
    kinds.forEach(([seed, base, oct], ch) => {
      const layers = Array.from({ length: oct }, (_, o) => value(seed + o * 101, base << o));
      for (let y = 0; y < NOISE; y++) for (let x = 0; x < NOISE; x++) {
        let s = 0, a = 0.5, w = 0;
        for (let o = 0; o < oct; o++) { const k = (base << o) / NOISE; s += a * layers[o](x * k, y * k); w += a; a *= 0.5; }
        out[(y * NOISE + x) * 4 + ch] = Math.round(clamp(((s / w) - 0.5) * 1.6 + 0.5, 0, 1) * 255);
      }
    });
    return out;
  }
  // BLUE NOISE, size by size, tiling (`bluenoise`): Ulichney's void and
  // cluster — every threshold from 0 to 255 once, each as far from its
  // nearest as it can be, so a dither by it has no pattern to see.
  function blueNoise(size) {
    const N2 = size * size, SIG = 1.6, R = 7, kern = [];
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) kern.push([x, y, Math.exp(-(x * x + y * y) / (2 * SIG * SIG))]);
    const on = new Uint8Array(N2), energy = new Float32Array(N2), rank = new Int32Array(N2);
    const splat = (k, s) => { const x0 = k % size, y0 = (k / size) | 0; for (const [x, y, w] of kern) energy[(((y0 + y) % size + size) % size) * size + (((x0 + x) % size + size) % size)] += s * w; };
    let seed = 77;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const tightest = () => { let b = -1, e = -1; for (let k = 0; k < N2; k++) if (on[k] && energy[k] > e) { e = energy[k]; b = k; } return b; };
    const emptiest = () => { let b = -1, e = Infinity; for (let k = 0; k < N2; k++) if (!on[k] && energy[k] < e) { e = energy[k]; b = k; } return b; };
    const ones = Math.round(N2 * 0.1);
    for (let c = 0; c < ones; ) { const k = (rnd() * N2) | 0; if (!on[k]) { on[k] = 1; splat(k, 1); c++; } }
    // the first pattern, settled: the tightest one moved to the emptiest place until it is the same place
    for (let it = 0; it < N2; it++) { const a = tightest(); on[a] = 0; splat(a, -1); const b = emptiest(); if (a === b) { on[a] = 1; splat(a, 1); break; } on[b] = 1; splat(b, 1); }
    const first = on.slice(), firstE = energy.slice();
    for (let r = ones - 1; r >= 0; r--) { const a = tightest(); on[a] = 0; splat(a, -1); rank[a] = r; }
    on.set(first); energy.set(firstE);
    for (let r = ones; r < N2; r++) { const b = emptiest(); on[b] = 1; splat(b, 1); rank[b] = r; }
    const out = new Uint8Array(N2);
    for (let k = 0; k < N2; k++) out[k] = Math.floor((rank[k] / N2) * 256);
    return out;
  }
  // (Read here as the programs read it: bilinear, tiling.)
  const noiseAt = (pic, x, y, ch) => {
    const fx = x * NOISE - 0.5, fy = y * NOISE - 0.5, i = Math.floor(fx), j = Math.floor(fy), u = fx - i, v = fy - j;
    const at = (a, b) => pic[((((b % NOISE) + NOISE) % NOISE) * NOISE + (((a % NOISE) + NOISE) % NOISE)) * 4 + ch];
    return ((at(i, j) * (1 - u) + at(i + 1, j) * u) * (1 - v) + (at(i, j + 1) * (1 - u) + at(i + 1, j + 1) * u) * v) / 255;
  };

  // ---------- THE GROUND, ONCE A PAGE ----------
  let groundPromise = null;
  const load = (src) => new Promise((done) => { const i = new Image(); i.onload = () => done(i); i.onerror = () => done(null); i.src = src; });

  function ground() {
    if (groundPromise) return groundPromise;
    // (the trials' own pictures, where they ask for them)
    const fineSrc = res("erosion") ? "heights-eroded.png" : res("dem") ? "heights-dem.png" : null;
    const photoSrc = res("superres") ? TRIAL + "athos-sr.jpg" : res("median") ? TRIAL + "athos-median.jpg" : res("photo") ? TRIAL + "athos-10m.jpg" : DATA.colour;
    const lightSrc = res("shadows") || res("ao") ? TRIAL + (res("erosion") ? "light-eroded.png" : res("dem") ? "light-dem.png" : "light-base.png") : null;
    groundPromise = Promise.all([load(root + encodeURI(DATA.heights)), load(root + encodeURI(photoSrc)), load(root + encodeURI("images/Apoteker Tepe/Apoteker Tepe Logo.webp")), fineSrc ? load(root + encodeURI(TRIAL + fineSrc)) : null, lightSrc ? load(root + encodeURI(lightSrc)) : null]).then(([heights, photo, logo, finePic, lightPic]) => {
      // THE HEIGHTS, out of their picture: red the high byte, green the low.
      const readHeights = (pic, size, scale) => {
        const out = new Float32Array(size * size);
        const c = document.createElement("canvas");
        c.width = c.height = size;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(pic, 0, 0);
        const d = g.getImageData(0, 0, size, size).data;
        for (let k = 0; k < size * size; k++) out[k] = ((d[k * 4] * 256 + d[k * 4 + 1]) / 65535) * scale;
        return out;
      };
      const H = heights ? readHeights(heights, n, 1) : new Float32Array(n * n);
      // (a trial's finer heights, FN by FN over the same square)
      const FN = finePic ? finePic.naturalWidth : 0, F = finePic ? readHeights(finePic, FN, TRIAL_HEIGHT_SCALE) : null;
      const [cu, cv] = DATA.summit, SQ = n / 2;
      // Catmull-Rom over a grid A (size by size), x and y in its own cells.
      const cubicAt = (A, size, x, y) => {
        const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
        const wx0 = ((-fx + 2) * fx - 1) * fx / 2, wx1 = ((3 * fx - 5) * fx * fx + 2) / 2, wx2 = ((-3 * fx + 4) * fx + 1) * fx / 2, wx3 = ((fx - 1) * fx * fx) / 2;
        const wy = [((-fy + 2) * fy - 1) * fy / 2, ((3 * fy - 5) * fy * fy + 2) / 2, ((-3 * fy + 4) * fy + 1) * fy / 2, ((fy - 1) * fy * fy) / 2];
        const c0 = clamp(ix - 1, 0, size - 1), c1 = clamp(ix, 0, size - 1), c2 = clamp(ix + 1, 0, size - 1), c3 = clamp(ix + 2, 0, size - 1);
        let s = 0;
        for (let j = 0; j < 4; j++) { const r = clamp(iy - 1 + j, 0, size - 1) * size; s += wy[j] * (wx0 * A[r + c0] + wx1 * A[r + c1] + wx2 * A[r + c2] + wx3 * A[r + c3]); }
        return s;
      };
      // The mountain's own heights, u and v in cells: bilinear, as it was;
      // or, for the trials, smooth between the heights (Catmull-Rom), or
      // the trial's finer heights.
      const smoothHeights = res("mesh") || res("normals") || res("raymarch");
      const at = F ? (u, v) => Math.max(0, cubicAt(F, FN, ((clamp(u, 0, n - 1.001) + 0.5) * FN) / n - 0.5, ((clamp(v, 0, n - 1.001) + 0.5) * FN) / n - 0.5))
        : smoothHeights ? (u, v) => Math.max(0, cubicAt(H, n, clamp(u, 0, n - 1.001), clamp(v, 0, n - 1.001)))
        : (u, v) => {
          const i = clamp(u, 0, n - 1.001), j = clamp(v, 0, n - 1.001);
          const i0 = i | 0, j0 = j | 0, fx = i - i0, fy = j - j0, k = j0 * n + i0;
          return (H[k] * (1 - fx) + H[k + 1] * fx) * (1 - fy) + (H[k + n] * (1 - fx) + H[k + n + 1] * fx) * fy;
        };
      // ...and carried on past the square's edge, falling away: the
      // peninsula's ridge runs on into the land.
      const athos = (u, v) => {
        const i = clamp(u, 0, n - 1.001), j = clamp(v, 0, n - 1.001), out = Math.hypot(u - i, v - j) / SQ;
        const h = at(i, j);
        return out > 0 ? h * Math.exp(-out / CARRY) : h;
      };
      // THE LAND round it, x and z in half-widths about the summit: under
      // the water near the mountain (the gulfs), rising beyond to hills,
      // and far off to ranges.
      const proc = (x, z) => {
        const r = Math.hypot(x, z);
        const wob = fbm(WOBBLE, x * 0.7 + 4.1, z * 0.7 - 1.3, 2) * 0.35;
        const rise = smooth(0.85, 1.6, r + wob);
        const hills = 0.5 + 0.5 * fbm(HILLS, x * 1.2 + 3.1, z * 1.2 - 7.7, r < 3.5 ? 5 : 3);
        // valleys carved through them, where the water gathers
        const vale = Math.abs(fbm(WOBBLE, x * 0.55 - 2.7, z * 0.55 + 5.3, 3));
        const far = smooth(2.2, 6.0, r);
        const ridge = far > 0 ? ridged(RANGES, x * 0.42 + 1.3, z * 0.42 - 2.2, 4) : 0;
        return -0.05 + rise * (0.04 + 0.34 * hills * hills * smooth(0.0, 0.22, vale)) + far * 0.85 * ridge * (0.55 + 0.45 * hills);
      };
      // The two together, the one taken smoothly over the other.
      const smax = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.max(a, b) + h * h * k * 0.25; };
      const h = (u, v) => {
        const a = athos(u, v);
        if (a > 0.3) return a;                   // (nothing of the land stands that high so near)
        // (where the mountain's own ground is the sea's, it goes under the water)
        return smax(a - 0.06 * (1 - smooth(0, 0.004, a)), proc((u - cu) / SQ, (v - cv) / SQ), 0.03);
      };
      // The hollows: the mountain's heights against their own blur.
      const blur = new Float32Array(n * n), tmp = new Float32Array(n * n), R = 4;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let d = -R; d <= R; d++) { const ii = i + d; if (ii >= 0 && ii < n) { s += H[j * n + ii]; c++; } } tmp[j * n + i] = s / c; }
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let d = -R; d <= R; d++) { const jj = j + d; if (jj >= 0 && jj < n) { s += tmp[jj * n + i]; c++; } } blur[j * n + i] = s / c; }
      const hollowAt = (u, v) => {
        const i = clamp(Math.round(u), 0, n - 1), j = clamp(Math.round(v), 0, n - 1), k = j * n + i;
        return clamp((H[k] - blur[k]) * HOLLOW, -0.22, 0.12);
      };
      // THE COLOUR: the photograph, and where it is land.
      const C = photo ? photo.naturalWidth : 4;
      const tex = document.createElement("canvas");
      tex.width = tex.height = C;
      const tg = tex.getContext("2d", { willReadFrequently: true });
      if (photo) tg.drawImage(photo, 0, 0, C, C);
      else { tg.fillStyle = "#7d7a66"; tg.fillRect(0, 0, C, C); }
      const px = tg.getImageData(0, 0, C, C).data;
      const colourAt = (u, v) => {               // the colour at a place on the grid, nearest pixel
        const a = clamp(Math.floor(((u + 0.5) / n) * C), 0, C - 1), b = clamp(Math.floor(((v + 0.5) / n) * C), 0, C - 1);
        const k = (b * C + a) * 4;
        return [px[k], px[k + 1], px[k + 2]];
      };
      // How much of a place is the photograph's land (its sea is not drawn:
      // the land's water is), faded out at the square's edge into the land.
      const landAt = (u, v) => {
        const edge = Math.min(u, v, n - 1 - u, n - 1 - v);
        if (edge <= 0) return 0;
        return smooth(0.0008, 0.006, at(u, v)) * smooth(0, 8, edge);
      };
      // THE SIGN, as a picture of its own in its own frame: the house's
      // mark, softened at its edge so its cut has a bevel.
      let sign = null;
      if (logo && DATA.figure) {
        const f = DATA.figure, c = document.createElement("canvas");
        c.width = c.height = SIGN_PX;
        const g = c.getContext("2d", { willReadFrequently: true });
        const aspect = logo.naturalWidth / logo.naturalHeight, tall = SIGN_PX * 0.86, wide = tall * aspect;
        g.filter = "blur(2.4px)";
        g.drawImage(logo, (SIGN_PX - wide) / 2, (SIGN_PX - tall) / 2, wide, tall);
        g.filter = "none";
        const d = g.getImageData(0, 0, SIGN_PX, SIGN_PX).data, mask = new Float32Array(SIGN_PX * SIGN_PX);
        for (let k = 0; k < mask.length; k++) mask[k] = d[k * 4 + 3] / 255;
        // Its frame on the grid: centred where the tool cut it, `half` cells
        // to its edge, turned so its head is uphill.
        const half = f.tall / 0.86 / 2, turn = Math.atan2(Math.cos(f.up), -Math.sin(f.up));
        sign = { canvas: c, mask, at: f.at, half, cos: Math.cos(turn), sin: Math.sin(turn) };
        /** How deep the cut is at (u, v) on the grid (0 to 1), and its slope there, a cell at a time. */
        sign.cut = (u, v) => {
          const du = u - f.at[0], dv = v - f.at[1];
          const s = (du * sign.cos + dv * sign.sin) / half, t = (-du * sign.sin + dv * sign.cos) / half;
          if (Math.abs(s) >= 1 || Math.abs(t) >= 1) return 0;
          const x = (s * 0.5 + 0.5) * (SIGN_PX - 1), y = (t * 0.5 + 0.5) * (SIGN_PX - 1), i = x | 0, j = y | 0, fx = x - i, fy = y - j;
          const m = (a, b) => mask[Math.min(SIGN_PX - 1, b) * SIGN_PX + Math.min(SIGN_PX - 1, a)];
          return (m(i, j) * (1 - fx) + m(i + 1, j) * fx) * (1 - fy) + (m(i, j + 1) * (1 - fx) + m(i + 1, j + 1) * fx) * fy;
        };
      }
      const noise = noisePicture();
      // (for `bluenoise`, the grain's channel a blue noise instead, tiled:
      // the dither's steps read it, and there is no grain over it)
      if (res("bluenoise")) { const b = blueNoise(64); for (let y = 0; y < NOISE; y++) for (let x = 0; x < NOISE; x++) noise[(y * NOISE + x) * 4 + 3] = b[(y & 63) * 64 + (x & 63)]; }
      // THE LAND'S COLOUR at a place (x, z in half-widths, `hh` its height, `ny`
      // how upright its ground is) — as the ground's own program works it out,
      // for the specks laid on it.
      const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      const landColour = (x, z, hh, ny) => {
        const big = noiseAt(noise, x * 0.33 + 0.13, z * 0.33 + 0.13, 2), mid = noiseAt(noise, x * 0.9 + 0.71, z * 0.9 + 0.71, 0), fine = noiseAt(noise, x * 3.7 + 0.29, z * 3.7 + 0.29, 1);
        const slope = 1 - ny;
        let c = mixc(LAND.meadow, LAND.scrub, smooth(0.38, 0.62, mid));
        c = mixc(c, LAND.forest, smooth(0.5, 0.72, big * 0.55 + mid * 0.5) * smooth(0.015, 0.06, hh) * (1 - smooth(0.4, 0.6, hh)));
        c = mixc(c, LAND.rock, smooth(0.22, 0.48, slope + (fine - 0.5) * 0.12));
        c = mixc(c, LAND.high, smooth(0.38, 0.62, hh + (fine - 0.5) * 0.05));
        const g = 0.92 + 0.16 * fine;
        return [c[0] * g, c[1] * g, c[2] * g];
      };
      // THE TRIALS' MAPS over the mountain's square, MAP_PX square (each made
      // only where a trial asks for it):
      //   normals  the slope of the heights at every place, as the page
      //            raises them (lift L0): lit a pixel at a time, not a
      //            triangle (`normals`)
      //   heights  the heights themselves, for the ray that marches over them
      //            (`raymarch`), a share of top
      //   trails   how far each place is from a trail (red, in texels to
      //            TRAIL_REACH), and where along it (green and blue, a dash's
      //            turn as its cosine and sine), for trails drawn into the
      //            ground itself (`trailsgl`)
      const L0 = DATA.view ? DATA.view.lift : 0.42;
      let normalMap = null, heightMap = null, trailMap = null;
      const grid = (size) => {               // the heights at every texel of a size-square map
        const out = new Float32Array(size * size);
        for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) out[j * size + i] = at(((i + 0.5) / size) * n - 0.5, ((j + 0.5) / size) * n - 0.5);
        return out;
      };
      let fineGrid = null;
      if (res("normals") || res("raymarch") || res("shore")) fineGrid = grid(MAP_PX);
      if (res("normals") || res("raymarch") || res("shore")) {
        const P = MAP_PX, out = new Uint8Array(P * P * 4), k = (P / n) * SQ * L0 / 2;   // (central differences over two texels, to half-widths raised by L0)
        for (let j = 0; j < P; j++) for (let i = 0; i < P; i++) {
          const gx = (fineGrid[j * P + Math.min(P - 1, i + 1)] - fineGrid[j * P + Math.max(0, i - 1)]) * k, gz = (fineGrid[Math.min(P - 1, j + 1) * P + i] - fineGrid[Math.max(0, j - 1) * P + i]) * k;
          const l = Math.hypot(gx, 1, gz), o = (j * P + i) * 4;
          out[o] = Math.round((-gx / l * 0.5 + 0.5) * 255); out[o + 1] = Math.round((1 / l * 0.5 + 0.5) * 255); out[o + 2] = Math.round((-gz / l * 0.5 + 0.5) * 255);
          // (its fourth: the height near the sea, to the first SHORE_TOP of it, for `shore`)
          out[o + 3] = Math.round(clamp(fineGrid[j * P + i] / SHORE_TOP, 0, 1) * 255);
        }
        normalMap = { size: P, data: out };
      }
      if (res("raymarch")) heightMap = { size: MAP_PX, data: fineGrid };
      if (res("trailsgl") && DATA.trails) {
        const P = MAP_PX, REACH = 8, best = new Float32Array(P * P).fill(REACH), cs = new Float32Array(P * P), sn = new Float32Array(P * P);
        const toPx = (u) => ((u + 0.5) / n) * P, cellM = (DATA.km * 1000) / n, DASH_M = 92;
        // (each trail smoothed: a Catmull-Rom through its points, four to a stretch)
        const smoothed = DATA.trails.map((t) => {
          const out = [];
          for (let k = 0; k < t.length - 1; k++) {
            const p0 = t[Math.max(0, k - 1)], p1 = t[k], p2 = t[k + 1], p3 = t[Math.min(t.length - 1, k + 2)];
            for (let s = 0; s < 4; s++) { const q = s / 4, q2 = q * q, q3 = q2 * q; out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * q + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * q2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * q3))); }
          }
          out.push(t[t.length - 1]);
          return out;
        });
        smoothed.forEach((t) => {
          let arc = 0;
          for (let k = 1; k < t.length; k++) {
            const [au, av] = t[k - 1], [bu, bv] = t[k], len = Math.hypot(bu - au, bv - av);
            // (none within reach of the summit, where the trails come together under the house's own mark)
            if (Math.hypot(bu - cu, bv - cv) > 6.5 && Math.hypot(au - cu, av - cv) > 6.5) {
              const ax = toPx(au), ay = toPx(av), bx = toPx(bu), by = toPx(bv), dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
              const i0 = Math.max(0, Math.floor(Math.min(ax, bx) - REACH)), i1 = Math.min(P - 1, Math.ceil(Math.max(ax, bx) + REACH));
              const j0 = Math.max(0, Math.floor(Math.min(ay, by) - REACH)), j1 = Math.min(P - 1, Math.ceil(Math.max(ay, by) + REACH));
              for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
                const px = i + 0.5, py = j + 0.5, q = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
                const d = Math.hypot(px - ax - dx * q, py - ay - dy * q), kk = j * P + i;
                if (d < best[kk]) { best[kk] = d; const turn = ((arc + q * len) * cellM / DASH_M) * Math.PI * 2; cs[kk] = Math.cos(turn); sn[kk] = Math.sin(turn); }
              }
            }
            arc += len;
          }
        });
        const out = new Uint8Array(P * P * 4);
        for (let kk = 0; kk < P * P; kk++) { out[kk * 4] = Math.round((best[kk] / REACH) * 255); out[kk * 4 + 1] = Math.round((cs[kk] * 0.5 + 0.5) * 255); out[kk * 4 + 2] = Math.round((sn[kk] * 0.5 + 0.5) * 255); out[kk * 4 + 3] = 255; }
        trailMap = { size: P, data: out, reach: REACH };
      }
      return {
        normalMap, heightMap, trailMap, lightPic, L0, F, FN,
        n, H, at, h, athos, proc, hollowAt, tex, colourAt, landAt, landColour, sign, noise, cu, cv, SQ,
        LIFT: DATA.view ? DATA.view.lift : 0.42, WORLD, summit: DATA.summit, trails: DATA.trails, places: DATA.places || {}, figure: DATA.figure, top: DATA.top, view: DATA.view,
      };
    });
    return groundPromise;
  }

  // ---------- THE PROGRAMS ----------
  const L3 = (c) => "vec3(" + c.map((v) => v.toFixed(3)).join(", ") + ")";
  const HEAD = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform sampler2D uNoise, uQuiet;
    uniform vec3 uEyeP, uSun;
    uniform float uTime;
    uniform vec4 uFrame;    // 1 / the canvas's width and height (device px), the dither's step (device px), the grain
    uniform vec4 uAir;      // the haze per half-width, the mist's density, how fast it thins upward, how much of it lies in wisps
    uniform float uHazeFrom; // and how far off the haze begins
    uniform vec4 uLook;     // quiet (0 or 1), the dither's levels, a dissolve (0 or 1), the wisps' drift
    uniform vec3 uSkyZen, uSkyHor, uHaze, uMistLit, uMistShade, uGlow;
    float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
    float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
    float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
    vec3 skyOf(vec3 d) {
      #ifdef LITE
      return mix(mix(uSkyHor, uSkyZen, clamp(d.y * 1.8, 0.0, 1.0)), uHaze, clamp(-d.y * 4.5, 0.0, 1.0));
      #else
      vec3 c = mix(uSkyHor, uSkyZen, smoothstep(0.0, 0.55, d.y));
      c = mix(c, uHaze, smoothstep(0.0, -0.22, d.y));
      float s = max(dot(d, uSun), 0.0);
      return c + uGlow * (pow(s, 6.0) * 0.16 + pow(s, 40.0) * 0.2);
      #endif
    }
    float quietHere() {
      if (uLook.x < 0.5) return 1.0;
      vec2 at = gl_FragCoord.xy * uFrame.xy;
      return texture2D(uQuiet, vec2(at.x, 1.0 - at.y)).r;
    }
    #ifdef TRIALS
    uniform float uBlueOn;  // the dither's steps off a blue noise (the noise's own fourth channel), not Bayer's pattern
    #endif
    float stepAt() {
      #ifdef TRIALS
      if (uBlueOn > 0.5) return texture2D(uNoise, (floor(gl_FragCoord.xy / uFrame.z) + 0.5) / 256.0).a;
      #endif
      return bayer8(gl_FragCoord.xy / uFrame.z);
    }
    vec3 digital(vec3 c) {
      #ifdef TRIALS
      if (uLook.y < 1.0) return c;   // (no steps: drawn smooth, for a picture laid down again after)
      if (uBlueOn > 0.5) return floor(clamp(c, 0.0, 1.0) * uLook.y + stepAt()) / uLook.y;
      #endif
      #ifdef LITE
      return floor(clamp(c, 0.0, 1.0) * uLook.y + stepAt()) / uLook.y;
      #else
      vec2 cell = floor(gl_FragCoord.xy / uFrame.z);
      float g = texture2D(uNoise, (cell + 0.5) / 256.0).a - 0.5;
      return floor(clamp(c, 0.0, 1.0) * uLook.y + stepAt() + g * uFrame.w) / uLook.y;
      #endif
    }
    // The air between the eye and p: its haze, and the mist lying low in it,
    // worked out along the whole of the way (an exponential mist, in closed
    // form), lying in wisps where the way ends.
    vec3 throughAir(vec3 col, vec3 p, vec2 w, vec3 d, float dist, vec3 sky) {
      col = mix(col, sky, 1.0 - exp(-max(0.0, dist - uHazeFrom) * uAir.x));
      #ifdef LITE
      // (only the haze, and the mist lying over the lowest ground)
      return mix(col, uMistShade, clamp((0.035 - p.y) * 9.0, 0.0, 0.45) * sign(uAir.y));
      #endif
      float k = uAir.z, dy = d.y;
      float way = abs(dy) > 0.002 ? (exp(-k * uEyeP.y) - exp(-k * max(p.y, 0.0))) / (k * dy) : exp(-k * uEyeP.y) * dist;
      vec2 drift = vec2(uTime * 0.011, uTime * 0.006) * uLook.w;
      #ifdef LITE
      float wisp = 0.85;
      #else
      float wisp = texture2D(uNoise, w * 0.5 + drift).b * 0.7 + texture2D(uNoise, w * 1.55 - drift * 1.7).r * 0.6;
      #endif
      float mist = 1.0 - exp(-uAir.y * max(way, 0.0) * mix(1.0, 0.4 + wisp * 1.15, uAir.w));
      float lit = max(dot(d, uSun), 0.0);
      return mix(col, mix(uMistShade, uMistLit, 0.55 + 0.45 * lit), clamp(mist, 0.0, 0.92));
    }
    float cloudShade(vec2 w) {
      #ifdef LITE
      return 1.0;
      #else
      float c = texture2D(uNoise, w * 0.17 + vec2(uTime * 0.0032, uTime * 0.0019) * uLook.w).b;
      return 1.0 - 0.12 * smoothstep(0.55, 0.82, c);
      #endif
    }
  `;
  const SKY_VS = `
    attribute vec2 aXY;
    uniform mat3 uBack;     // the camera's turn, undone
    uniform vec3 uLens;     // cx, cy, S * eye (css px)
    uniform vec2 uSize;     // the window (css px)
    varying vec3 vDir;
    void main() {
      vec2 px = vec2((aXY.x * 0.5 + 0.5) * uSize.x, (0.5 - aXY.y * 0.5) * uSize.y);
      vDir = uBack * vec3((uLens.x - px.x) / uLens.z, (uLens.y - px.y) / uLens.z, 1.0);
      gl_Position = vec4(aXY, 0.9999, 1.0);
    }`;
  const SKY_FS = HEAD + `
    uniform vec3 uCloud;
    varying vec3 vDir;
    void main() {
      vec3 d = normalize(vDir);
      vec3 c = skyOf(d);
      // High cloud, drifting very slowly.
      #ifndef LITE
      if (d.y > 0.0) {
        vec2 q = d.xz / (d.y + 0.14) * 0.42 + vec2(uTime * 0.0028, uTime * 0.0011) * uLook.w;
        float cl = smoothstep(0.5, 0.86, texture2D(uNoise, q * 0.45).b * 0.7 + texture2D(uNoise, q * 1.6).r * 0.42);
        c = mix(c, uCloud, cl * 0.34 * smoothstep(0.015, 0.22, d.y));
      }
      #endif
      gl_FragColor = vec4(digital(c), 1.0);
    }`;
  const GROUND_VS = `
    attribute vec3 aPos; attribute vec3 aNrm; attribute vec2 aUV; attribute vec4 aMore;
    uniform mat4 uM;
    varying vec3 vPos; varying vec3 vNrm; varying vec2 vUV; varying vec4 vMore;
    void main() {
      vPos = aPos; vNrm = aNrm; vUV = aUV; vMore = aMore;
      gl_Position = uM * vec4(aPos, 1.0);
    }`;
  // THE GROUND'S COLOUR AND LIGHT at a place — shared by the ground drawn in
  // triangles and the ground a ray finds (`raymarch`), so the two are the
  // same ground.
  const GROUND_LIB = `
    #extension GL_OES_standard_derivatives : enable
  ` + HEAD + `
    uniform sampler2D uPhoto, uSign;
    uniform vec4 uWorld;    // the piece's own units to half-widths about the summit: scale, x, z; and its lift
    uniform vec4 uSurf;     // brightness, the contours' strength, the cut's depth, the sign on (0 or 1)
    uniform vec4 uSignAt;   // the sign's middle (photo uv), 1 / its half-size (uv), the piece's base height
    uniform vec2 uSignTurn; // cos, sin
    uniform vec2 uSignScale; // the photo's uv to the piece's own units, along x and z
    #ifdef TRIALS
    uniform sampler2D uNormalMap, uLightMap, uTrailMap;
    // THE TRIALS (each 0 or 1): the light a pixel at a time off the baked
    // normals, the sky baked, the sun baked (its shadows), fine relief; the
    // mountain's own contours, relief shading, the trails drawn into the
    // ground, the ground drawn as a map's lines.
    uniform vec4 uRes, uRes2;
    uniform vec4 uRes3;     // the normals' scale (this piece raised against the map's), the top (m), the trails' width (device px), their reach (texels)
    uniform vec3 uLight2;   // relief shading's second light, from the window's upper left
    uniform float uMapPx;
    uniform float uShore;   // the coast a pixel at a time (0 or 1), off the heights near the sea in the normals' fourth channel
    #endif
    vec3 landOf(vec2 w, float h, vec3 n) {
      #ifdef LITE
      float big = 0.5, mid = 0.5, fine = 0.5;
      #else
      float big = texture2D(uNoise, w * 0.33 + 0.13).b, mid = texture2D(uNoise, w * 0.9 + 0.71).r, fine = texture2D(uNoise, w * 3.7 + 0.29).g;
      #endif
      float slope = 1.0 - n.y;
      vec3 c = mix(${L3(LAND.meadow)}, ${L3(LAND.scrub)}, smoothstep(0.38, 0.62, mid));
      #ifndef LITE
      // In the lowland, a patchwork of fields, each a tone of its own.
      vec2 f = mat2(0.866, -0.5, 0.5, 0.866) * w * 5.0;
      float field = floor(texture2D(uNoise, (floor(f) + 0.5) / 64.0).g * 4.0) / 3.0;
      c = mix(c, mix(${L3(LAND.fieldA)}, ${L3(LAND.fieldB)}, field), (1.0 - smoothstep(0.03, 0.1, h)) * smoothstep(0.42, 0.58, big) * 0.7);
      #endif
      // Woods on the hills, more on the slopes turned from the sun.
      float shade = 0.5 - 0.5 * dot(normalize(vec3(n.x, 0.0, n.z) + 0.0001), normalize(vec3(uSun.x, 0.0, uSun.z))) * smoothstep(0.02, 0.15, slope);
      c = mix(c, ${L3(LAND.forest)}, smoothstep(0.44, 0.66, big * 0.5 + mid * 0.45 + shade * 0.18) * smoothstep(0.015, 0.06, h) * (1.0 - smoothstep(0.42, 0.62, h)));
      c = mix(c, ${L3(LAND.rock)}, smoothstep(0.22, 0.48, slope + (fine - 0.5) * 0.12));
      c = mix(c, ${L3(LAND.high)}, smoothstep(0.38, 0.62, h + (fine - 0.5) * 0.05));
      return c * (0.92 + 0.16 * fine);
    }
    #ifdef TRIALS
    // A slope of the noise (channel ch of the tiling noise) at q, as d/dq.
    vec2 noiseSlope(vec2 q, float ch) {
      float e = 1.0 / 256.0;
      vec4 a = texture2D(uNoise, q + vec2(e, 0.0)), b = texture2D(uNoise, q - vec2(e, 0.0)), c = texture2D(uNoise, q + vec2(0.0, e)), d = texture2D(uNoise, q - vec2(0.0, e));
      vec2 r = ch < 0.5 ? vec2(a.r - b.r, c.r - d.r) : vec2(a.g - b.g, c.g - d.g);
      return r / (2.0 * e);
    }
    // A line of width (px) at a level set: how much of it covers this pixel.
    float isoLine(float v, float widthPx) {
      #ifdef GL_OES_standard_derivatives
      float fw = max(fwidth(v), 1e-6), d = abs(fract(v + 0.5) - 0.5) / fw;
      return 1.0 - smoothstep(widthPx * 0.5 - 0.5, widthPx * 0.5 + 0.5, d);
      #else
      return 0.0;
      #endif
    }
    #endif
    vec3 shade(vec3 P, vec3 n, vec2 uv, float land, float depth, float ao, out vec3 sky) {
      vec2 w = P.xz * uWorld.x + uWorld.yz;
      vec3 v = P - uEyeP;
      float dist = length(v);
      vec3 vd = v / dist;
      sky = skyOf(vd);
      float h = P.y / uWorld.w + uSignAt.w;
      #ifdef TRIALS
      // (inside the mountain's own square, where the trials' maps lie)
      vec2 e2 = min(uv, 1.0 - uv);
      float sq = smoothstep(0.0, 0.006, min(e2.x, e2.y));
      if (uShore > 0.5 && sq > 0.5) {
        // THE COAST, A PIXEL AT A TIME: land or sea read off the heights
        // themselves, not the triangles' corners — the water's edge as fine
        // as the window (its depth out to sea still the triangles').
        float hp = texture2D(uNormalMap, uv).a * ${SHORE_TOP.toFixed(3)};
        land = smoothstep(0.0004, 0.0016, hp);
        depth = hp > 0.0006 ? -hp : max(depth, 0.0002 + (0.0006 - hp));
      }
      if (uRes.x > 0.5) {
        vec3 m = texture2D(uNormalMap, uv).xyz * 2.0 - 1.0;
        vec2 g = m.xz / max(m.y, 0.05) * uRes3.x;
        n = normalize(mix(n, normalize(vec3(g.x, 1.0, g.y)), sq));
      }
      #if defined(GL_OES_standard_derivatives) && !defined(LITE)
      if (uRes.w > 0.5) {
        // FINE RELIEF: the ground's own small slopes, finer than its heights
        // (two scales of the noise, the rock rougher), gone where they would
        // be finer than a pixel.
        vec2 qa = uv * 22.0, qb = uv * 61.0;
        float fa = 1.0 - smoothstep(0.3, 0.75, length(fwidth(qa)) * 64.0), fb = 1.0 - smoothstep(0.3, 0.75, length(fwidth(qb)) * 128.0);
        float rough = (0.45 + 0.9 * smoothstep(0.12, 0.45, 1.0 - n.y)) * land * sq;
        float k = uWorld.w / uRes3.y * uWorld.x * 0.5;   // metres of the noise to the piece's slope, per unit of q
        vec2 s = noiseSlope(qa, 0.0) * 22.0 * 14.0 * fa + noiseSlope(qb, 1.0) * 61.0 * 5.0 * fb;
        n = normalize(n + vec3(-s.x, 0.0, -s.y) * k * rough * n.y);
      }
      #endif
      #endif
      vec3 albedo = mix(landOf(w, h, n), texture2D(uPhoto, uv).rgb, land);
      // THE SIGN, cut in: its shape lowered into the ground, the earth it
      // lays bare a little paler.
      if (uSurf.w > 0.5) {
        vec2 d = uv - uSignAt.xy;
        vec2 st = vec2(d.x * uSignTurn.x + d.y * uSignTurn.y, -d.x * uSignTurn.y + d.y * uSignTurn.x) * uSignAt.z;
        if (abs(st.x) < 1.0 && abs(st.y) < 1.0) {
          vec2 t = st * 0.5 + 0.5;
          float e = 1.5 / 256.0;
          float m = texture2D(uSign, t).a;
          float mx = (texture2D(uSign, t + vec2(e, 0.0)).a - texture2D(uSign, t - vec2(e, 0.0)).a) / (2.0 * e);
          float my = (texture2D(uSign, t + vec2(0.0, e)).a - texture2D(uSign, t - vec2(0.0, e)).a) / (2.0 * e);
          // Its slope in the sign's frame, turned back onto the ground.
          vec2 g = vec2(mx * uSignTurn.x - my * uSignTurn.y, mx * uSignTurn.y + my * uSignTurn.x) * 0.5 * uSignAt.z;
          vec2 gw = g * uSignScale;
          // lowered into the slope (its edge catching the light on one side
          // and in shade on the other), the earth in it bare, keeping the
          // ground's own grain
          n = normalize(n + vec3(gw.x, 0.0, gw.y) * uSurf.z * uWorld.w * n.y);
          float grain = dot(albedo, vec3(0.33)) / 0.45;
          albedo = mix(albedo, ${L3(EARTH)} * (0.8 + 0.28 * grain), m * ${SIGN_EARTH.toFixed(2)});
        }
      }
      float lam = max(dot(n, uSun), 0.0);
      // RELIEF SHADING, as a map's: a second light from the window's upper
      // left, and the steep a little darker.
      #ifdef TRIALS
      if (uRes2.y > 0.5) lam = mix(lam, 0.55 * lam + 0.55 * max(dot(n, uLight2), 0.0) * (1.0 - 0.25 * (1.0 - n.y)), sq);
      #endif
      float cloud = cloudShade(w);
      float lightness = (${SHADE_FLOOR.toFixed(2)} + ${SHADE_GAIN.toFixed(2)} * lam * cloud) * ao * uSurf.x;
      #ifdef TRIALS
      if (uRes.y > 0.5 || uRes.z > 0.5) {
        // THE LIGHT, BAKED: how much of the sun each place sees (its
        // shadows), and how much of the sky (its hollows).
        vec2 lm = texture2D(uLightMap, uv).rg;
        float sun = uRes.z > 0.5 ? lm.r : 1.0, skyV = uRes.y > 0.5 ? lm.g : 1.0;
        float amb = uRes.y > 0.5 ? 0.22 + 0.86 * skyV : ao;
        float baked = (${SHADE_FLOOR.toFixed(2)} * amb + ${SHADE_GAIN.toFixed(2)} * lam * cloud * sun * (uRes.y > 0.5 ? 0.86 + 0.14 * skyV : ao)) * uSurf.x;
        lightness = mix(lightness, baked, sq);
      }
      #endif
      vec3 col = albedo * lightness;
      #if defined(GL_OES_standard_derivatives) && !defined(LITE)
      #ifdef TRIALS
      if (uRes2.w > 0.5) {
        // THE GROUND AS A MAP'S LINES: the paper, the photograph's colour
        // washed into it, lit gently, and the heights drawn in contours —
        // every 20 m fine, every 100 m firmer — never wider than a pixel or so.
        float metres = max(h, 0.0) * uRes3.y;
        vec3 paper = vec3(0.925, 0.898, 0.824);
        col = mix(paper, albedo, 0.42) * (0.74 + 0.36 * lam) * mix(1.0, ao, 0.5);
        float fine = isoLine(metres / 20.0, 1.0) * (1.0 - smoothstep(0.18, 0.4, fwidth(metres / 20.0)));
        float index = isoLine(metres / 100.0, 1.6);
        vec3 ink = vec3(0.36, 0.22, 0.15);
        col = mix(col, ink, (fine * 0.38 + index * 0.7) * smoothstep(0.0008, 0.003, h));
      }
      #endif
      // Faint contours on the land, as a map has them — and, for the trial,
      // on the mountain too, every 50 m and every 250 m firmer.
      float lines = h * 28.0, ct = abs(fract(lines) - 0.5), fw = fwidth(lines);
      col *= 1.0 - uSurf.y * (1.0 - land) * (1.0 - smoothstep(fw * 0.6, fw * 1.6, ct)) * smoothstep(0.012, 0.03, h);
      #ifdef TRIALS
      if (uRes2.x > 0.5 && uRes2.w < 0.5) {
        float metres = max(h, 0.0) * uRes3.y;
        float minor = isoLine(metres / 50.0, 1.0) * (1.0 - smoothstep(0.14, 0.32, fwidth(metres / 50.0))), major = isoLine(metres / 250.0, 1.5);
        col = mix(col, col * 0.52, (minor * 0.42 + major * 0.75) * land * smoothstep(0.0015, 0.004, h));
      }
      #endif
      #endif
      // THE WATER, where the land lies under it: the sky in it, a glint of
      // the sun, the shallows paler and a line where it meets the land.
      #ifdef LITE
      if (depth > -0.0004) col = mix(col, mix(${L3(SHALLOW)}, sky, 0.45), smoothstep(-0.0004, 0.0008, depth));
      #else
      if (depth > -0.0004) {
        vec2 r = (vec2(texture2D(uNoise, w * 2.2 + vec2(uTime * 0.01, 0.0) * uLook.w).r, texture2D(uNoise, w * 2.2 + vec2(0.0, uTime * 0.008) * uLook.w).g) - 0.5) * 0.18;
        vec3 wn = normalize(vec3(r.x, 1.0, r.y));
        vec3 rv = reflect(vd, wn);
        float fres = 0.18 + 0.7 * pow(1.0 - max(-vd.y, 0.0), 5.0);
        vec3 water = mix(mix(${L3(SHALLOW)}, ${L3(DEEP)}, smoothstep(0.0, 0.03, depth)), skyOf(rv), fres);
        water += vec3(1.0, 0.97, 0.9) * pow(max(dot(rv, uSun), 0.0), 90.0) * 0.5;
        float shore = 1.0 - smoothstep(0.0, 0.003, depth);
        water = mix(water, vec3(0.88, 0.87, 0.82), shore * 0.55);
        col = mix(col, water, smoothstep(-0.0004, 0.0008, depth));
      }
      #endif
      col = throughAir(col, P, w, vd, dist, sky);
      #if defined(GL_OES_standard_derivatives) && !defined(LITE) && defined(TRIALS)
      // THE TRAILS, drawn into the ground: a line of so many pixels however
      // far off it is, dashed, the dashes going along it, on a faint line of
      // the paper — hidden by the ground in front, lit as it is, and over the haze, as a
      // line drawn on a map is.
      if (uRes2.z > 0.5) {
        vec4 tr = texture2D(uTrailMap, uv);
        float tpp = max(length(fwidth(uv * uMapPx)) * 0.7071, 1e-4);
        float dpx = tr.r * uRes3.w / tpp;
        float phase = fract(atan(tr.b * 2.0 - 1.0, tr.g * 2.0 - 1.0) / 6.28318 - uTime * 0.35 * uLook.w);
        float dash = smoothstep(0.0, 0.05, phase) * (1.0 - smoothstep(0.52, 0.57, phase));
        float wpx = uRes3.z * 0.5, near = step(tr.r, 0.995) * sq;
        float core = 1.0 - smoothstep(wpx - 0.5, wpx + 0.5, dpx), halo = 1.0 - smoothstep(wpx + 0.4, wpx + 1.4, dpx);
        col = mix(col, vec3(0.925, 0.898, 0.824) * (0.6 + 0.4 * lightness), halo * 0.36 * near);
        col = mix(col, vec3(0.541, 0.227, 0.149) * (0.75 + 0.3 * lightness), core * dash * 0.92 * near);
      }
      #endif
      return col;
    }
  `;
  const GROUND_FS = GROUND_LIB + `
    varying vec3 vPos; varying vec3 vNrm; varying vec2 vUV; varying vec4 vMore;
    void main() {
      float keep = vMore.y;
      if (uLook.z > 0.5 && keep < stepAt() * 0.998 + 0.002) discard;
      vec3 sky;
      vec3 col = shade(vPos, normalize(vNrm), vUV, vMore.x, vMore.z, vMore.w, sky);
      // LOSING ITS OPACITY behind the writing: what stands behind it is the
      // sky (or the haze under the far land), so it is drawn that much of
      // the way to that — solid all the same, no slope showing through the
      // one in front of it.
      col = mix(sky, col, quietHere());
      gl_FragColor = vec4(digital(col), 1.0);
    }`;
  // THE GROUND FOUND BY A RAY (`raymarch`): over the mountain's square, the
  // faces of a box round it drawn, and from each a ray marched on through
  // the heights (a picture of them, MAP_PX square) until it meets them — the
  // ground exact at every pixel, its edge against the sky as fine as the
  // window, whatever triangles stand under it.
  const RAY_VS = `
    attribute vec3 aPos; attribute vec3 aOut;
    uniform mat4 uM;
    varying vec3 vPos; varying vec3 vOut;
    void main() { vPos = aPos; vOut = aOut; gl_Position = uM * vec4(aPos, 1.0); }`;
  const RAY_FS = `
    #extension GL_EXT_frag_depth : enable
  ` + GROUND_LIB + `
    uniform sampler2D uHeightMap;
    uniform mat4 uM;
    uniform vec4 uRay;      // the square's uv to the piece's units (u = x * uRay.x + uRay.y, v = z * uRay.x + uRay.z), and the least step
    uniform vec4 uBox;      // x0, z0, x1, z1
    uniform vec2 uBoxY;     // its floor and its top
    varying vec3 vPos; varying vec3 vOut;
    float shareAt(vec2 uv) {
      #ifdef HEIGHT_BYTES
      // (sixteen bits in two bytes, filtered here, four of them)
      vec2 px = uv * uMapPx - 0.5, f = fract(px), b = (floor(px) + 0.5) / uMapPx;
      float e = 1.0 / uMapPx;
      vec4 a = texture2D(uHeightMap, b), c = texture2D(uHeightMap, b + vec2(e, 0.0)), d = texture2D(uHeightMap, b + vec2(0.0, e)), g = texture2D(uHeightMap, b + vec2(e, e));
      float ha = (a.r * 255.0 * 256.0 + a.g * 255.0) / 65535.0 * 1.2, hc = (c.r * 255.0 * 256.0 + c.g * 255.0) / 65535.0 * 1.2, hd = (d.r * 255.0 * 256.0 + d.g * 255.0) / 65535.0 * 1.2, hg = (g.r * 255.0 * 256.0 + g.g * 255.0) / 65535.0 * 1.2;
      return mix(mix(ha, hc, f.x), mix(hd, hg, f.x), f.y);
      #else
      return texture2D(uHeightMap, uv).r + 0.5;
      #endif
    }
    float yAt(vec2 xz) { return (max(shareAt(xz * uRay.x + uRay.yz), 0.0) - uSignAt.w) * uWorld.w; }
    void main() {
      vec3 rd = normalize(vPos - uEyeP);
      if (dot(rd, vOut) > 0.0) discard;   // (a face turned away: the ray starts on the near one)
      vec3 ro = vPos;
      vec3 inv = 1.0 / (rd + vec3(1e-7));
      vec3 tA = (vec3(uBox.x, uBoxY.x, uBox.y) - ro) * inv, tB = (vec3(uBox.z, uBoxY.y, uBox.w) - ro) * inv;
      vec3 tF = max(tA, tB);
      float tExit = min(min(tF.x, tF.y), tF.z);
      float t = 0.0, lastT = 0.0;
      bool hit = false;
      for (int i = 0; i < 420; i++) {
        vec3 p = ro + rd * t;
        float d = p.y - yAt(p.xz);
        if (d < 0.0) { hit = true; break; }
        lastT = t;
        t += max(d * 0.42, uRay.w);
        if (t > tExit) break;
      }
      if (!hit) discard;
      float a = lastT, b = t;
      for (int i = 0; i < 8; i++) { float m = 0.5 * (a + b); vec3 p = ro + rd * m; if (p.y - yAt(p.xz) < 0.0) b = m; else a = m; }
      vec3 P = ro + rd * b;
      vec2 uv = P.xz * uRay.x + uRay.yz;
      float s = shareAt(uv);
      if (s < 0.0006) discard;            // (the sea: the triangles' own water stands under it)
      vec3 m = texture2D(uNormalMap, uv).xyz * 2.0 - 1.0;
      vec2 g = m.xz / max(m.y, 0.05) * uRes3.x;
      vec3 n = normalize(vec3(g.x, 1.0, g.y));
      vec2 e2 = min(uv, 1.0 - uv);
      float land = smoothstep(0.0008, 0.006, s) * smoothstep(0.0, 0.02, min(e2.x, e2.y));
      vec3 sky;
      vec3 col = shade(P, n, uv, land, -s, 1.0, sky);
      col = mix(sky, col, quietHere());
      gl_FragColor = vec4(digital(col), 1.0);
      vec4 clip = uM * vec4(P, 1.0);
      gl_FragDepthEXT = clip.z / clip.w * 0.5 + 0.5;
    }`;
  const SPECK_VS = `
    attribute vec3 aPos; attribute vec4 aCol; attribute vec2 aSA;
    uniform mat4 uM; uniform float uEye; uniform float uPx;
    varying vec3 vCol; varying vec3 vPos; varying float vA;
    #ifdef TRIALS
    attribute vec3 aNrm;
    uniform float uRound;
    varying vec3 vNrm; varying float vAo;
    #endif
    void main() {
      gl_Position = uM * vec4(aPos, 1.0);
      gl_Position.z -= 0.0025 * gl_Position.w;
      #ifdef TRIALS
      // (finespecks: each a round speck a little larger, softened at its
      // edge, so it covers its share of a pixel rather than a whole one)
      gl_PointSize = max(uRound > 0.5 ? 1.7 : 1.0, uPx * aSA.x * (uEye / gl_Position.w) * (uRound > 0.5 ? 1.6 : 1.0));
      vNrm = aNrm; vAo = aCol.a * 1.25;
      #else
      gl_PointSize = max(1.0, uPx * aSA.x * (uEye / gl_Position.w));
      #endif
      vCol = aCol.rgb; vPos = aPos; vA = aSA.y;
    }`;
  const SPECK_FS = HEAD + `
    uniform vec4 uWorld;
    varying vec3 vCol; varying vec3 vPos; varying float vA;
    #ifdef TRIALS
    uniform float uRound;
    // (for the trials, lit here as the ground is, the trials' light too: each
    // speck's colour is its ground's, its slope its ground's — without them,
    // lit on the processor once, as it always was)
    uniform vec4 uRes, uRes2, uSq;   // uSq: the square's uv off the piece's units (u = x * uSq.x + uSq.y, v = z * uSq.x + uSq.z)
    uniform vec3 uLight2;
    uniform sampler2D uLightMap;
    varying vec3 vNrm; varying float vAo;
    vec3 speckLight(vec3 albedo, vec2 w) {
      vec3 n = normalize(vNrm);
      vec2 uv = vec2(vPos.x * uSq.x + uSq.y, vPos.z * uSq.x + uSq.z), e2 = min(uv, 1.0 - uv);
      float sq = smoothstep(0.0, 0.006, min(e2.x, e2.y));
      float lam = max(dot(n, uSun), 0.0);
      if (uRes2.y > 0.5) lam = mix(lam, 0.55 * lam + 0.55 * max(dot(n, uLight2), 0.0) * (1.0 - 0.25 * (1.0 - n.y)), sq);
      float cloud = cloudShade(w), ao = vAo;
      float lightness = (${SHADE_FLOOR.toFixed(2)} + ${SHADE_GAIN.toFixed(2)} * lam) * ao * cloud;
      if (uRes.y > 0.5 || uRes.z > 0.5) {
        vec2 lm = texture2D(uLightMap, uv).rg;
        float sun = uRes.z > 0.5 ? lm.r : 1.0, skyV = uRes.y > 0.5 ? lm.g : 1.0;
        float amb = uRes.y > 0.5 ? 0.22 + 0.86 * skyV : ao;
        lightness = mix(lightness, (${SHADE_FLOOR.toFixed(2)} * amb + ${SHADE_GAIN.toFixed(2)} * lam * sun * (uRes.y > 0.5 ? 0.86 + 0.14 * skyV : ao)) * cloud, sq);
      }
      if (uRes2.w > 0.5) return mix(vec3(0.925, 0.898, 0.824), albedo, 0.42) * (0.74 + 0.36 * lam) * mix(1.0, ao, 0.5);
      return albedo * lightness;
    }
    #endif
    void main() {
      if (uLook.z > 0.5 && vA < stepAt() * 0.998 + 0.002) discard;
      float cover = 1.0;
      #ifdef TRIALS
      if (uRound > 0.5) { float r = length(gl_PointCoord - 0.5); cover = 1.0 - smoothstep(0.26, 0.5, r); if (cover <= 0.0) discard; cover *= 0.85; }
      #endif
      vec2 w = vPos.xz * uWorld.x + uWorld.yz;
      vec3 v = vPos - uEyeP;
      float dist = length(v);
      vec3 d = v / dist;
      vec3 sky = skyOf(d);
      #ifdef TRIALS
      vec3 col = throughAir(speckLight(vCol, w), vPos, w, d, dist, sky);
      #else
      vec3 col = throughAir(vCol * cloudShade(w), vPos, w, d, dist, sky);
      #endif
      col = mix(sky, col, quietHere());
      float a = (uLook.z > 0.5 ? 1.0 : vA) * cover;
      gl_FragColor = vec4(digital(col) * a, a);
    }`;
  const MIST_VS = `
    attribute vec3 aBase; attribute vec2 aCorner; attribute vec4 aKind;   // kind, size, seed, speed
    uniform mat4 uM; uniform vec3 uRight, uUp; uniform float uTime; uniform vec2 uWind; uniform vec3 uCap; uniform float uBox;
    varying vec3 vWorld; varying vec2 vUV; varying float vSeed; varying float vA;
    void main() {
      float kind = aKind.x, size = aKind.y, seed = aKind.z, speed = aKind.w;
      vec3 b = aBase;
      float a = 1.0;
      if (kind < 0.5) {
        // a bank lying low, drifting on the wind, wrapped round in its box
        b.xz += uWind * uTime * speed;
        b.xz = mod(b.xz + uBox, 2.0 * uBox) - uBox;
        a = 1.0 - smoothstep(uBox * 0.72, uBox, max(abs(b.x), abs(b.z)));
      } else if (kind < 1.5) {
        // a wisp going round the mountain, rising and sinking a little
        float t = atan(b.z, b.x) + uTime * speed * 0.012, r = length(b.xz);
        b = vec3(cos(t) * r, b.y + sin(uTime * 0.05 * speed + seed * 6.0) * 0.012, sin(t) * r);
      } else {
        // streaming off the summit and going
        float age = fract(uTime * speed * 0.018 + seed);
        b = uCap + b * 0.35 + vec3(uWind.x, 0.0, uWind.y) * age * 9.0 + vec3(0.0, -0.02 * age, 0.0);
        size *= 0.55 + age * 1.3;
        a = sin(3.14159 * min(1.0, age * 1.25));
      }
      float swell = 1.0 + 0.12 * sin(uTime * 0.07 * speed + seed * 9.0);
      vec3 p = b + (uRight * aCorner.x + uUp * aCorner.y * 0.4) * size * swell;
      vWorld = p; vUV = aCorner; vSeed = seed; vA = a;
      gl_Position = uM * vec4(p, 1.0);
    }`;
  const MIST_FS = HEAD + `
    uniform sampler2D uHeights;
    uniform vec4 uHeightsAt; // the heights' picture: x0, z0, 1 / its width, the top it goes to
    uniform vec4 uWorld;
    uniform vec3 uRight, uUp, uToEye;
    uniform float uMistA;
    varying vec3 vWorld; varying vec2 vUV; varying float vSeed; varying float vA;
    void main() {
      float r = length(vUV);
      if (r > 1.0) discard;
      vec2 q = vUV * 0.8 + vec2(vSeed * 7.31, vSeed * 3.17);
      vec2 drift = vec2(uTime * 0.007, -uTime * 0.004) * uLook.w;
      #ifdef LITE
      float n1 = texture2D(uNoise, q * 0.42 + drift).b, n2 = n1, n3 = 0.5;
      #else
      float n1 = texture2D(uNoise, q * 0.42 + drift).b, n2 = texture2D(uNoise, q * 1.1 - drift * 1.6).r, n3 = texture2D(uNoise, q * 2.7 + drift * 2.3).g;
      #endif
      float body = 1.0 - smoothstep(0.0, 1.0, r);
      body *= body;
      float dens = body * smoothstep(0.12, 0.78, n1 * 0.62 + n2 * 0.42 + n3 * 0.22 - r * 0.1);
      // Sinking into the ground where it meets it.
      vec2 hu = (vWorld.xz - uHeightsAt.xy) * uHeightsAt.z;
      float ground = texture2D(uHeights, hu).r * uHeightsAt.w;
      float soft = smoothstep(0.0, 0.014, vWorld.y - ground);
      // Lit as a soft volume: brighter on the sun's side.
      vec3 nrm = normalize(uRight * vUV.x + uUp * vUV.y + uToEye * sqrt(max(0.0, 1.0 - r * r)));
      float lit = 0.45 + 0.55 * max(dot(nrm, uSun), 0.0) - (1.0 - n2) * 0.18;
      vec3 col = mix(uMistShade, uMistLit, clamp(lit, 0.0, 1.0));
      vec3 v = vWorld - uEyeP;
      col = mix(col, skyOf(normalize(v)), 1.0 - exp(-max(0.0, length(v) - uHazeFrom) * uAir.x));
      float a = dens * soft * vA * uMistA * quietHere();
      #ifdef TRIALS
      if (uLook.y >= 1.0) a = floor(a * uLook.y * 0.5 + stepAt()) / (uLook.y * 0.5);
      #else
      a = floor(a * uLook.y * 0.5 + stepAt()) / (uLook.y * 0.5);
      #endif   // (in steps too, unless drawn smooth to be laid down again)
      gl_FragColor = vec4(digital(col) * a, a);
    }`;

  // THE PICTURE LAID DOWN AGAIN (`ss2`, `accum`, `fxaa`, `cas`): the
  // mountain drawn first into a picture of its own — twice the window's
  // pixels each way for `ss2`, moved a part of a pixel every frame and laid
  // over the frames before it for `accum` — and then onto the window,
  // smoothed (`fxaa`) or sharpened (`cas`, after AMD's contrast adaptive
  // sharpening), and only then put in the dither's steps.
  const POST_VS = `
    attribute vec2 aXY;
    varying vec2 vUV;
    void main() { vUV = aXY * 0.5 + 0.5; gl_Position = vec4(aXY, 0.0, 1.0); }`;
  const POST_FS = HEAD + `
    uniform sampler2D uScene;
    uniform vec2 uTexel;    // 1 / the scene's size
    uniform vec4 uMode;     // its pixels to one of the window's (1 or 2), fxaa (0 or 1), sharpening (0 none to 1), the dither (0 or 1)
    varying vec2 vUV;
    vec3 tap(vec2 uv) {
      if (uMode.x > 1.5) {
        // (two of the scene's pixels to one: four filtered taps, a tent over the four by four round it)
        vec2 o = uTexel * 0.75;
        return 0.25 * (texture2D(uScene, uv + vec2(-o.x, -o.y)).rgb + texture2D(uScene, uv + vec2(o.x, -o.y)).rgb + texture2D(uScene, uv + vec2(-o.x, o.y)).rgb + texture2D(uScene, uv + vec2(o.x, o.y)).rgb);
      }
      return texture2D(uScene, uv).rgb;
    }
    vec3 fxaa(vec2 uv) {
      vec2 px = uTexel * uMode.x;
      vec3 nw = tap(uv + vec2(-px.x, -px.y)), ne = tap(uv + vec2(px.x, -px.y)), sw = tap(uv + vec2(-px.x, px.y)), se = tap(uv + vec2(px.x, px.y)), m = tap(uv);
      vec3 L = vec3(0.299, 0.587, 0.114);
      float lNW = dot(nw, L), lNE = dot(ne, L), lSW = dot(sw, L), lSE = dot(se, L), lM = dot(m, L);
      float lMin = min(lM, min(min(lNW, lNE), min(lSW, lSE))), lMax = max(lM, max(max(lNW, lNE), max(lSW, lSE)));
      vec2 dir = vec2(-((lNW + lNE) - (lSW + lSE)), (lNW + lSW) - (lNE + lSE));
      float reduce = max((lNW + lNE + lSW + lSE) * 0.03125, 1.0 / 128.0);
      dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + reduce), vec2(-8.0), vec2(8.0)) * px;
      vec3 a = 0.5 * (tap(uv + dir * (1.0 / 3.0 - 0.5)) + tap(uv + dir * (2.0 / 3.0 - 0.5)));
      vec3 b = a * 0.5 + 0.25 * (tap(uv - dir * 0.5) + tap(uv + dir * 0.5));
      float lB = dot(b, L);
      return (lB < lMin || lB > lMax) ? a : b;
    }
    vec3 cas(vec2 uv, float sharp) {
      vec2 px = uTexel * uMode.x;
      vec3 a = tap(uv + vec2(-px.x, -px.y)), b = tap(uv + vec2(0.0, -px.y)), c = tap(uv + vec2(px.x, -px.y));
      vec3 d = tap(uv + vec2(-px.x, 0.0)), e = tap(uv), f = tap(uv + vec2(px.x, 0.0));
      vec3 g = tap(uv + vec2(-px.x, px.y)), h = tap(uv + vec2(0.0, px.y)), i = tap(uv + vec2(px.x, px.y));
      vec3 mn = min(min(min(d, e), min(f, b)), h); mn += min(mn, min(min(a, c), min(g, i)));
      vec3 mx = max(max(max(d, e), max(f, b)), h); mx += max(mx, max(max(a, c), max(g, i)));
      vec3 amp = sqrt(clamp(min(mn, 2.0 - mx) / max(mx, vec3(1e-4)), 0.0, 1.0));
      vec3 wt = amp * (-1.0 / mix(8.0, 5.0, sharp));
      return clamp((b * wt + d * wt + f * wt + h * wt + e) / (1.0 + 4.0 * wt), 0.0, 1.0);
    }
    void main() {
      vec3 c = uMode.y > 0.5 ? fxaa(vUV) : uMode.z > 0.0 ? cas(vUV, uMode.z) : tap(vUV);
      gl_FragColor = vec4(uMode.w > 0.5 ? digital(c) : c, 1.0);
    }`;
  const ACC_FS = `
    precision highp float;
    uniform sampler2D uScene, uHist;
    uniform float uAlpha;
    varying vec2 vUV;
    void main() { gl_FragColor = vec4(mix(texture2D(uHist, vUV).rgb, texture2D(uScene, vUV).rgb, uAlpha), 1.0); }`;

  function program(gl, vs, fs) {
    const make = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : (window.__tepeShaderError = gl.getShaderInfoLog(s), null); };
    const v = make(gl.VERTEX_SHADER, vs), f = make(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    const out = { p, a: {}, u: {} };
    for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES); i++) { const x = gl.getActiveAttrib(p, i); out.a[x.name] = gl.getAttribLocation(p, x.name); }
    for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) { const x = gl.getActiveUniform(p, i); out.u[x.name.replace(/\[0\]$/, "")] = gl.getUniformLocation(p, x.name); }
    return out;
  }

  // ---------- THE CAMERA ----------
  /** Where a point (x, y, z) of the ground's own space stands for `cam`:
      on the window (x, y, css px) and how far back (z, half-widths). East
      is +x and south +z, so facing south the east is on the LEFT: the
      window's x is the turned x the other way round. */
  function project(p, cam) {
    const c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const xr = p.x * c - p.z * s, zr = p.x * s + p.z * c;
    const y2 = p.y * cp + zr * sp, z2 = -p.y * sp + zr * cp;
    const f = cam.eye / (cam.eye + z2);
    return { x: cam.cx - xr * cam.S * f, y: cam.cy - y2 * cam.S * f, z: z2 };
  }
  const turnOf = (cam) => {
    const c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    return [[c, 0, -s], [sp * s, cp, sp * c], [cp * s, -sp, cp * c]];
  };
  /** Where the eye stands, in the ground's own space. */
  function eyeOf(cam) {
    const R = turnOf(cam);
    return [-cam.eye * R[2][0], -cam.eye * R[2][1], -cam.eye * R[2][2]];
  }
  /** The same as a matrix, for a canvas `W` by `H` css px (column-major). */
  function matrix(cam, W, H, jit) {
    const R = turnOf(cam);
    const kx = (2 * cam.S * cam.eye) / W, ky = (2 * cam.S * cam.eye) / H;
    // (`jit`: the whole picture moved a part of a pixel, css px — for a
    // picture laid over the ones before it, `accum`)
    const ox = (2 * (cam.cx + (jit ? jit[0] : 0))) / W - 1, oy = 1 - (2 * (cam.cy + (jit ? jit[1] : 0))) / H;
    const far = cam.far || 2.6;
    const wn = Math.max(0.35, cam.eye - far), wf = cam.eye + far;
    const A = (wf + wn) / (wf - wn), B = (-2 * wf * wn) / (wf - wn);
    // clip.x = -kx xr + ox w;  clip.y = ky y2 + oy w;  clip.z = A w + B;  clip.w = w = z2 + eye
    const rowX = [-kx * R[0][0] + ox * R[2][0], -kx * R[0][1] + ox * R[2][1], -kx * R[0][2] + ox * R[2][2], ox * cam.eye];
    const rowY = [ky * R[1][0] + oy * R[2][0], ky * R[1][1] + oy * R[2][1], ky * R[1][2] + oy * R[2][2], oy * cam.eye];
    const rowZ = [A * R[2][0], A * R[2][1], A * R[2][2], A * cam.eye + B];
    const rowW = [R[2][0], R[2][1], R[2][2], cam.eye];
    const m = new Float32Array(16);
    for (let col = 0; col < 4; col++) { m[col * 4] = rowX[col]; m[col * 4 + 1] = rowY[col]; m[col * 4 + 2] = rowZ[col]; m[col * 4 + 3] = rowW[col]; }
    return m;
  }

  // ---------- A DRAWING ----------
  // Whether this machine draws without a graphics card, asked once of a
  // canvas of its own (so the drawing's own can be made to suit).
  let softKnown = null;
  function software() {
    if (softKnown != null) return softKnown;
    softKnown = false;
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const info = gl && gl.getExtension("WEBGL_debug_renderer_info");
      softKnown = /swiftshader|llvmpipe|software/i.test(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "");
      const lose = gl && gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    } catch (e) { /* not knowing is fine */ }
    return softKnown;
  }

  function make(canvas, opts = {}) {
    // `slow` without a graphics card; `soft` its drawing made lighter for it
    // — but for `?tepe=full` on the address, which draws it whole there, for
    // a picture of it (as slowly as it must).
    const slow = software(), soft = slow && !/[?&]tepe=full\b/.test(location.search);
    let gl = null;
    try {
      // Without a graphics card, no smoothing of its edges either: on the
      // processor that is four times the drawing. OPAQUE when it carries its
      // own sky: nothing under it is drawn, nothing over the page is blended.
      const o = { alpha: !opts.opaque, premultipliedAlpha: true, antialias: !soft, depth: true, preserveDrawingBuffer: !!opts.preserve };
      gl = canvas.getContext("webgl", o) || canvas.getContext("experimental-webgl", o);
    } catch (e) { gl = null; }
    if (!gl) return null;
    gl.getExtension("OES_standard_derivatives");
    const uint = gl.getExtension("OES_element_index_uint");
    // (what the trials ask of the machine)
    const ext = (...names) => { for (const nm of names) { const e = gl.getExtension(nm); if (e) return e; } return null; };
    const aniso = res("aniso") ? ext("EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic", "MOZ_EXT_texture_filter_anisotropic") : null;
    const fragDepth = res("raymarch") ? ext("EXT_frag_depth") : null;
    const fl = res("raymarch") && ext("OES_texture_float") && ext("OES_texture_float_linear");
    const half = ext("OES_texture_half_float"), halfLinear = half && ext("OES_texture_half_float_linear");
    if (half) ext("EXT_color_buffer_half_float");
    const post = !soft && (res("ss2") || res("accum") || res("fxaa") || res("cas"));
    const SS = res("ss2") ? 2 : 1;
    // (Without a graphics card, the programs' LITE version: the same picture
    // with fewer of its finest touches — no grain, no fields, no contours, no
    // ripples, the clouds' shadows and the mist's wisps simpler.)
    // (And with a trial asked for, its code: `#define TRIALS`.)
    const lite = (fs) => (soft || TRIALS ? fs.replace("#ifdef GL_FRAGMENT_PRECISION_HIGH", (soft ? "#define LITE 1\n" : "") + (TRIALS ? "#define TRIALS 1\n" : "") + "    #ifdef GL_FRAGMENT_PRECISION_HIGH") : fs);
    const vert = (vs) => (TRIALS ? "#define TRIALS 1\n" + vs : vs);
    const skyP = program(gl, SKY_VS, lite(SKY_FS)), groundP = program(gl, GROUND_VS, lite(GROUND_FS)), speckP = program(gl, vert(SPECK_VS), lite(SPECK_FS)), mistP = program(gl, MIST_VS, lite(MIST_FS));
    if (!skyP || !groundP || !speckP || !mistP) return null;
    // (the trials' own programs, where they are asked for and the machine can)
    const heightBytes = !fl && !halfLinear;
    const rayP = fragDepth ? program(gl, RAY_VS, lite(RAY_FS).replace("#ifdef GL_FRAGMENT_PRECISION_HIGH", (heightBytes ? "#define HEIGHT_BYTES 1\n" : "") + "    #ifdef GL_FRAGMENT_PRECISION_HIGH")) : null;
    const postP = post ? program(gl, POST_VS, POST_FS) : null, accP = post && res("accum") ? program(gl, POST_VS, ACC_FS) : null;
    window.__tepeTrials = { res: [...RES], code: "uRes" in groundP.u || "uRound" in speckP.u, aniso: !!aniso, fragDepth: !!fragDepth, ray: !!rayP, heights: fl ? "float" : halfLinear ? "half" : "bytes", post: !!postP, acc: !!accP, half: !!half, error: window.__tepeShaderError || "" };
    let W = 1, H = 1, ratio = 1, G = null;
    const textures = {};
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    function texture(name, make) {
      if (textures[name]) return textures[name];
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      const mip = make(t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? (soft ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR_MIPMAP_LINEAR) : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (mip) gl.generateMipmap(gl.TEXTURE_2D);
      // (`aniso`: a slope seen at a slant sampled along its slant, not blurred to its narrowest)
      if (mip && aniso && name !== "noise") gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      // (two bytes to a height are filtered by the program itself, so read as they are)
      if (name === "heightmap" && heightBytes) { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); }
      textures[name] = t;
      return t;
    }
    const wrap = (mode) => { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mode); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, mode); };
    const photoTex = () => texture("photo", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, G.tex); wrap(gl.CLAMP_TO_EDGE); return (G.tex.width & (G.tex.width - 1)) === 0; });
    const noiseTex = () => texture("noise", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NOISE, NOISE, 0, gl.RGBA, gl.UNSIGNED_BYTE, G.noise); wrap(gl.REPEAT); return true; });
    const signTex = () => texture("sign", () => { if (G.sign) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, G.sign.canvas); else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); wrap(gl.CLAMP_TO_EDGE); return false; });
    // The trials' maps (each made once, the first time it is drawn).
    const byteTex = (name, map, mip) => texture(name, () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, map.size, map.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, map.data); wrap(gl.CLAMP_TO_EDGE); return mip; });
    const normalTex = () => (G.normalMap ? byteTex("normals", G.normalMap, true) : noiseTex());
    const trailTex = () => (G.trailMap ? byteTex("trailmap", G.trailMap, false) : noiseTex());
    const lightTex = () => (G.lightPic ? texture("light", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, G.lightPic); wrap(gl.CLAMP_TO_EDGE); return true; }) : noiseTex());
    const f16 = (() => { const f = new Float32Array(1), i = new Uint32Array(f.buffer); return (v) => { f[0] = v; const x = i[0], sg = (x >>> 16) & 0x8000, e = ((x >>> 23) & 0xff) - 112, m = x & 0x7fffff; if (e <= 0) return sg; if (e >= 31) return sg | 0x7c00; return sg | ((e << 10) + ((m + 0x1000) >>> 13)); }; })();
    const heightTex = () => texture("heightmap", () => {
      // the heights for the ray: as floats, halves (each less a half, for
      // their precision), or two bytes each, as the machine can filter them
      const m = G.heightMap, P = m.size;
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      if (fl) gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, P, P, 0, gl.LUMINANCE, gl.FLOAT, Float32Array.from(m.data, (v) => v - 0.5));
      else if (halfLinear) gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, P, P, 0, gl.LUMINANCE, half.HALF_FLOAT_OES, Uint16Array.from(m.data, (v) => f16(v - 0.5)));
      else { const b = new Uint8Array(P * P * 4); for (let k = 0; k < P * P; k++) { const v = Math.round(clamp(m.data[k] / 1.2, 0, 1) * 65535); b[k * 4] = v >> 8; b[k * 4 + 1] = v & 255; b[k * 4 + 3] = 255; } gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, P, P, 0, gl.RGBA, gl.UNSIGNED_BYTE, b); }
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
      wrap(gl.CLAMP_TO_EDGE);
      return false;
    });
    // THE QUIET the page hands in: how much of the drawing is left at every
    // place on the window, a picture of it a few css px to a step.
    let quietTex = null;
    function quiet(values, w, h) {
      if (!quietTex) quietTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, quietTex);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, values);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      wrap(gl.CLAMP_TO_EDGE);
    }
    const buf = (data, target = gl.ARRAY_BUFFER) => { const b = gl.createBuffer(); gl.bindBuffer(target, b); gl.bufferData(target, data, gl.STATIC_DRAW); return b; };

    /** The ground made ready to draw. Either THE WORLD (`world: true`) —
        the whole land round the summit to WORLD half-widths, its grid
        finest over the mountain and coarser out to the haze — or a
        FRAGMENT of it:
          centre  [u, v] on the grid, the piece's (0, 0, 0)
          scale   cells to a half-width (n / 2 for the whole mountain)
          reach   cells from the centre it is drawn to, at most
          edge    (angle) => share of `reach` it is drawn to that way
          fade    share of the reach where it begins to dissolve
          lift    half-widths of height for the whole of `top`
          base    the height (a share of `top`) at the piece's 0
          specks  how many specks it is drawn in (a tenth without a graphics card)
          seed    the specks' own randomness */
    function piece(ground, o) {
      G = ground;
      const N = ground.n, scale = o.world ? ground.SQ : o.scale, lift = o.lift, base = o.base || 0;
      const [cu, cv] = o.world ? [ground.cu, ground.cv] : o.centre;
      let seed = o.seed || 1925;
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const reach = o.world ? WORLD * scale : o.reach, edge = o.edge || (() => 1), fade = o.fade == null ? 0.72 : o.fade;
      const keepAt = (u, v) => {
        if (o.world) return 1;
        const du = u - cu, dv = v - cv, d = Math.hypot(du, dv) / (reach * edge(Math.atan2(dv, du)));
        return 1 - smooth(fade, 1, d);
      };
      // THE GRID: for the world, warped — cells as fine as the heights over
      // the square, growing out into the haze; for a fragment, the heights'
      // own cells (every other one without a graphics card, unless `fine`).
      let us, vs;
      if (o.world) {
        // (Without whole numbers for the triangles' corners, few enough to count in sixteen bits.)
        // (`mesh`, and the finer heights: the mountain's square in a corner
        // every 20 m, against every 60 m — its cells a half of the heights'.)
        const fineMesh = uint && !soft && (res("mesh") || ground.F);
        const Gn = fineMesh ? 1100 : uint ? o.grid || (soft ? 220 : 520) : Math.min(250, o.grid || 250), inner = fineMesh ? 0.7 : 0.5, R = WORLD;
        // half-widths at a share g (0 to 1) of the way out: linear to the
        // square's edge, then growing (its slope kept where they meet)
        const c3 = (R - 1 - (1 - inner) / inner) / Math.pow(1 - inner, 3);
        const at = (g) => { const a = Math.abs(g); const w = a <= inner ? a / inner : 1 + (a - inner) / inner + c3 * Math.pow(a - inner, 3); return Math.sign(g) * w; };
        const axis = Array.from({ length: Gn + 1 }, (_, k) => at((k / Gn) * 2 - 1));
        us = axis.map((x) => cu + x * scale); vs = axis.map((z) => cv + z * scale);
      } else {
        const st = soft && !o.fine ? 2 : 1;
        const i0 = Math.max(-40, Math.floor(cu - reach - 1)), i1 = Math.min(N + 40, Math.ceil(cu + reach + 1));
        const j0 = Math.max(-40, Math.floor(cv - reach - 1)), j1 = Math.min(N + 40, Math.ceil(cv + reach + 1));
        us = []; vs = [];
        for (let i = i0; i <= i1; i += st) us.push(i);
        for (let j = j0; j <= j1; j += st) vs.push(j);
      }
      const cols = us.length, rows = vs.length;
      // Heights first, every place of the grid once.
      const hs = new Float32Array(cols * rows), keep = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const k = j * cols + i, kk = keepAt(us[i], vs[j]);
        keep[k] = kk;
        hs[k] = kk > 0 ? ground.h(us[i], vs[j]) : 0;
      }
      const yOf = (hh) => (Math.max(0, hh) - base) * lift;
      // (`raymarch`: the triangles over the mountain's own land let down a
      // little, so the ground the ray finds stands over them wherever it is)
      const SINK = rayP && o.world ? 0.012 : 0;
      const index = new Int32Array(cols * rows).fill(-1);
      let count = 0;
      for (let k = 0; k < cols * rows; k++) if (keep[k] > 0) index[k] = count++;
      const V = new Float32Array(count * 12);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const k = j * cols + i, m = index[k];
        if (m < 0) continue;
        const u = us[i], v = vs[j], hh = hs[k];
        // The slope off the neighbours (the grid's own spacing, whatever it is).
        const iL = Math.max(0, i - 1), iR = Math.min(cols - 1, i + 1), jU = Math.max(0, j - 1), jD = Math.min(rows - 1, j + 1);
        const dx = (us[iR] - us[iL]) / scale, dz = (vs[jD] - vs[jU]) / scale;
        const gx = ((Math.max(0, hs[j * cols + iR]) - Math.max(0, hs[j * cols + iL])) * lift) / (dx || 1), gz = ((Math.max(0, hs[jD * cols + i]) - Math.max(0, hs[jU * cols + i])) * lift) / (dz || 1);
        const nl = Math.hypot(gx, 1, gz);
        const o12 = m * 12;
        V[o12] = (u - cu) / scale; V[o12 + 1] = yOf(hh) - (SINK && u > 1 && v > 1 && u < N - 2 && v < N - 2 && hh > 0.001 ? SINK : 0); V[o12 + 2] = (v - cv) / scale;
        V[o12 + 3] = -gx / nl; V[o12 + 4] = 1 / nl; V[o12 + 5] = -gz / nl;
        V[o12 + 6] = (u + 0.5) / N; V[o12 + 7] = (v + 0.5) / N;
        V[o12 + 8] = ground.landAt(u, v);
        V[o12 + 9] = keep[k];
        V[o12 + 10] = -hh;                     // how far under the water (less than nothing on land)
        V[o12 + 11] = 1 + (u >= 0 && v >= 0 && u < N && v < N ? ground.hollowAt(u, v) : 0);
      }
      const tri = [];
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = index[j * cols + i], b = index[j * cols + i + 1], c = index[(j + 1) * cols + i], d = index[(j + 1) * cols + i + 1];
        if (a >= 0 && b >= 0 && c >= 0) tri.push(a, b, c);
        if (b >= 0 && d >= 0 && c >= 0) tri.push(b, d, c);
      }
      const big = count > 65535 && uint;
      const mesh = { v: buf(V), idx: buf(big ? new Uint32Array(tri) : new Uint16Array(tri), gl.ELEMENT_ARRAY_BUFFER), count: tri.length, type: big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT };
      // THE SPECKS: on the mountain, many to a cell, each the photograph's
      // colour where it stands, lit as it is; and, for the world, on the land
      // round it, fewer the further out, the land's own colour.
      const sunL = [Math.sin(SUN.az) * Math.cos(SUN.alt), Math.sin(SUN.alt), -Math.cos(SUN.az) * Math.cos(SUN.alt)];
      const share = soft ? SOFT_SHARE : 1;
      const wantA = Math.round((o.specks || 0) * share), wantB = Math.round((o.landSpecks || 0) * share);
      const want = wantA + wantB;
      const sp = new Float32Array(want * 3), sc = new Uint8Array(want * 4), ss = new Float32Array(want * 2), sn = TRIALS ? new Int8Array(want * 4) : null;
      let m = 0;
      const lay = (u, v, kk, rgb, grain, hh, hx, hz) => {
        if (hh <= 0.0005) return false;
        // its slope, and so its light
        let nx = -hx, ny = 1, nz = -hz;
        // and the sign, where it is: cut in, its earth bared, few specks
        // left in it.
        if (ground.sign && o.signOn !== false) {
          const c0 = ground.sign.cut(u, v);
          if (c0 > 0.002) {
            if (random() < c0 * (1 - SIGN_KEPT)) return false;
            const gu = (ground.sign.cut(u + 0.5, v) - ground.sign.cut(u - 0.5, v)), gv = (ground.sign.cut(u, v + 0.5) - ground.sign.cut(u, v - 0.5));
            nx += gu * SIGN_DEPTH * lift * scale; nz += gv * SIGN_DEPTH * lift * scale;
            const k = c0 * SIGN_EARTH, g = 0.85 + random() * 0.3;
            rgb = rgb.map((ch, i) => ch + (EARTH[i] * 255 * g - ch) * k);
          }
        }
        const nl = Math.hypot(nx, ny, nz);
        const ao = 1 + (u >= 0 && v >= 0 && u < N && v < N ? ground.hollowAt(u, v) : 0);
        const g = 1 + (random() - 0.5) * grain;
        sp[m * 3] = (u - cu) / scale; sp[m * 3 + 1] = yOf(hh); sp[m * 3 + 2] = (v - cv) / scale;
        if (TRIALS) {
          // (its colour, its grain, its hollow and its slope: the program lights it)
          for (let ch = 0; ch < 3; ch++) sc[m * 4 + ch] = clamp(Math.round(rgb[ch] * g), 0, 255);
          sc[m * 4 + 3] = clamp(Math.round((ao / 1.25) * 255), 0, 255);
          sn[m * 4] = Math.round((nx / nl) * 127); sn[m * 4 + 1] = Math.round((ny / nl) * 127); sn[m * 4 + 2] = Math.round((nz / nl) * 127);
        } else {
          // (lit here, once)
          const lam = Math.max(0, (nx * sunL[0] + ny * sunL[1] + nz * sunL[2]) / nl), lit = (SHADE_FLOOR + SHADE_GAIN * lam) * ao * g;
          for (let ch = 0; ch < 3; ch++) sc[m * 4 + ch] = clamp(Math.round(rgb[ch] * lit), 0, 255);
          sc[m * 4 + 3] = 255;
        }
        ss[m * 2] = 0.75 + random() * 0.5;
        ss[m * 2 + 1] = kk * kk;
        m++;
        return true;
      };
      const R0 = o.world ? N * 0.62 : reach;
      for (let tries = 0; m < wantA && tries < wantA * 6; tries++) {
        const a = random() * Math.PI * 2, d = Math.sqrt(random()) * R0;
        const u = cu + Math.cos(a) * d, v = cv + Math.sin(a) * d;
        if (u < 0 || v < 0 || u > N - 1.001 || v > N - 1.001) continue;
        const kk = keepAt(u, v);
        if (kk <= 0.02 || ground.landAt(u, v) < 0.5) continue;
        // (On the mountain's own land its heights are the ground's: quicker to read.)
        const e = 0.75, hx = (ground.at(u + e, v) - ground.at(u - e, v)) * lift * scale / (2 * e), hz = (ground.at(u, v + e) - ground.at(u, v - e)) * lift * scale / (2 * e);
        lay(u, v, kk, ground.colourAt(u, v), 0.16, ground.h(u, v), hx, hz);
      }
      for (let tries = 0; m < want && tries < wantB * 6; tries++) {
        // out on the land, thinning with the distance: most within two half-widths
        const a = random() * Math.PI * 2, d = (0.35 + Math.pow(random(), 1.8) * 2.6) * scale;
        const u = cu + Math.cos(a) * d, v = cv + Math.sin(a) * d;
        if (ground.landAt(u, v) > 0.3) continue;
        const x = (u - cu) / scale, z = (v - cv) / scale, hh = ground.h(u, v);
        if (hh <= 0.002) continue;
        const e = 1, hx = (ground.h(u + e, v) - hh) * lift * scale / e, hz = (ground.h(u, v + e) - hh) * lift * scale / e;
        const c = ground.landColour(x, z, hh, 1 / Math.hypot(hx, 1, hz));
        lay(u, v, 1, [c[0] * 255, c[1] * 255, c[2] * 255], 0.2, hh, hx, hz);
      }
      const dots = { pos: buf(sp.subarray(0, m * 3)), col: buf(sc.subarray(0, m * 4)), sa: buf(ss.subarray(0, m * 2)), nrm: sn ? buf(sn.subarray(0, m * 4)) : null, count: m };
      // (`raymarch`: the box over the mountain's square the ray starts on —
      // its top and four sides, each face with the way out of it)
      let box = null;
      if (rayP && o.world && ground.heightMap) {
        const x0 = (0 - cu) / scale, x1 = (N - 1 - cu) / scale, z0 = (0 - cv) / scale, z1 = (N - 1 - cv) / scale, y0 = -0.002 - base * lift, y1 = (1.06 - base) * lift;
        const P = [], Q = [];
        const quadOf = (a, b, c, d, out) => { [a, b, c, a, c, d].forEach((q) => { P.push(...q); Q.push(...out); }); };
        quadOf([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0]);
        quadOf([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1]);
        quadOf([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1]);
        quadOf([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0]);
        quadOf([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], [1, 0, 0]);
        box = { pos: buf(new Float32Array(P)), out: buf(new Float32Array(Q)), count: P.length / 3, xz: [x0, z0, x1, z1], y: [y0, y1], ray: [scale / N, (cu + 0.5) / N, (cv + 0.5) / N, 0.5 / (MAP_PX * (scale / N))] };
      }
      return {
        mesh, dots, box, vertices: count, specks: m, scale, lift, base, centre: [cu, cv], world: !!o.world,
        /** A place on the grid as the piece's own point (for what is drawn over it). */
        point(u, v, up = 0) { return { x: (u - cu) / scale, y: yOf(ground.h(u, v)) + up, z: (v - cv) / scale }; },
        /** The ground's height (the piece's own units) under a point of it. */
        groundAt(x, z) { return yOf(ground.h(cu + x * scale, cv + z * scale)); },
        dispose() { [mesh.v, mesh.idx, dots.pos, dots.col, dots.sa, dots.nrm].concat(box ? [box.pos, box.out] : []).forEach((b) => b && gl.deleteBuffer(b)); },
      };
    }

    /** BANKS OF MIST round the mountain (the world's own units): lying low
        over the water and the valleys and drifting on the wind, wisps going
        round the mountain's slopes, and a cap streaming off its summit — so
        many of each (`banks`, `wisps`, `cap`, `far`). Their ground (for
        sinking into it) is a picture of the world's heights. */
    function mist(ground, o) {
      G = ground;
      let seed = o.seed || 31;
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const lift = o.lift, scale = ground.SQ, cu = ground.cu, cv = ground.cv;
      const yAt = (x, z) => Math.max(0, ground.h(cu + x * scale, cv + z * scale)) * lift;
      const list = [];
      const add = (kind, x, y, z, size, speed) => list.push({ kind, x, y, z, size, seed: random(), speed });
      const BOX = o.box || 3.2;
      // Out from the summit along `a` until the mountain's own ground is down
      // to `share` of its height: where its foot (or a band of its slopes) is.
      const outTo = (a, share) => {
        for (let d = 0.04; d < 1.6; d += 0.01) { const x = Math.cos(a) * d, z = Math.sin(a) * d; if (ground.athos(cu + x * scale, cv + z * scale) <= share) return d; }
        return 1.6;
      };
      for (let k = 0; k < (o.banks || 0); k++) {
        // lying along the mountain's foot, over the water and the shore
        const a = random() * Math.PI * 2, d = outTo(a, 0.02) + (random() - 0.25) * 0.3, x = Math.cos(a) * d, z = Math.sin(a) * d;
        add(0, x, yAt(x, z) + 0.006 + random() * 0.02, z, 0.18 + random() * 0.3, 0.5 + random() * 0.7);
      }
      for (let k = 0; k < (o.wisps || 0); k++) {
        // hanging just off its slopes, going round it
        const a = random() * Math.PI * 2, share = 0.15 + random() * 0.5, d = outTo(a, share) + 0.02 + random() * 0.06, x = Math.cos(a) * d, z = Math.sin(a) * d;
        add(1, x, share * lift + 0.015 + random() * 0.04, z, 0.08 + random() * 0.13, (random() < 0.5 ? -1 : 1) * (0.6 + random()));
      }
      for (let k = 0; k < (o.cap || 0); k++) add(2, (random() - 0.5) * 0.12, (random() - 0.2) * 0.04, (random() - 0.5) * 0.12, 0.07 + random() * 0.09, 0.7 + random() * 0.6);
      for (let k = 0; k < (o.far || 0); k++) {
        const a = random() * Math.PI * 2, d = 2.2 + random() * 1.0, x = Math.cos(a) * d, z = Math.sin(a) * d;
        add(0, x, yAt(x, z) + 0.01 + random() * 0.04, z, 0.5 + random() * 0.6, 0.4 + random() * 0.5);
      }
      const base = new Float32Array(list.length * 12), corner = new Float32Array(list.length * 8), kind = new Float32Array(list.length * 16), idx = [];
      list.forEach((s, q) => {
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([cx, cy], k) => {
          const v = q * 4 + k;
          base.set([s.x, s.y, s.z], v * 3); corner.set([cx, cy], v * 2); kind.set([s.kind, s.size, s.seed, s.speed], v * 4);
        });
        idx.push(q * 4, q * 4 + 1, q * 4 + 2, q * 4 + 1, q * 4 + 3, q * 4 + 2);
      });
      // The world's heights round the mountain, as a picture, for the mist to sink into.
      if (!textures.heights) {
        const P = 192, out = new Uint8Array(P * P), top = lift * 1.1;
        for (let j = 0; j < P; j++) for (let i = 0; i < P; i++) {
          const x = -BOX + ((i + 0.5) / P) * 2 * BOX, z = -BOX + ((j + 0.5) / P) * 2 * BOX;
          out[j * P + i] = Math.round(clamp(yAt(x, z) / top, 0, 1) * 255);
        }
        texture("heights", () => { gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, P, P, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, out); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4); wrap(gl.CLAMP_TO_EDGE); return false; });
        textures.heightsAt = [-BOX, -BOX, 1 / (2 * BOX), top];
      }
      return {
        count: list.length, box: BOX,
        base: buf(base), corner: buf(corner), kind: buf(kind), idx: buf(new Uint16Array(idx), gl.ELEMENT_ARRAY_BUFFER), n: idx.length,
        dispose() { [this.base, this.corner, this.kind, this.idx].forEach((b) => gl.deleteBuffer(b)); },
      };
    }

    function attrib(prog, name, buffer, size, type = gl.FLOAT, norm = false, stride = 0, offset = 0) {
      const loc = prog.a[name];
      if (loc == null || loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, type, norm, stride, offset);
    }
    function off(prog) { Object.values(prog.a).forEach((loc) => loc >= 0 && gl.disableVertexAttribArray(loc)); }
    const rgb = (c) => c.map((v) => v / 255);
    // What every program is told: the light, the air, the look, the noise
    // and the quiet.
    function common(prog, cam, look) {
      const u = prog.u;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, noiseTex());
      gl.uniform1i(u.uNoise, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, quietTex || noiseTex());
      gl.uniform1i(u.uQuiet, 1);
      const e = cam.eyeP || eyeOf(cam);
      gl.uniform3fv(u.uEyeP, e);
      const L = [Math.sin(SUN.az) * Math.cos(SUN.alt), Math.sin(SUN.alt), -Math.cos(SUN.az) * Math.cos(SUN.alt)];
      gl.uniform3fv(u.uSun, L);
      gl.uniform1f(u.uTime, look.time || 0);
      // (the picture drawn into: the window's, or the trials' own, `tw` by `th`)
      gl.uniform4fv(u.uFrame, [1 / tw, 1 / th, Math.max(1, Math.round(ratio * (look.ditherPx || 1))), res("bluenoise") ? 0 : look.grain == null ? 0.7 : look.grain]);
      gl.uniform1f(u.uBlueOn, res("bluenoise") ? 1 : 0);
      gl.uniform4fv(u.uAir, look.air || [0.06, 0, 30, 0.8]);
      gl.uniform1f(u.uHazeFrom, look.hazeFrom == null ? 0 : look.hazeFrom);
      // (drawn into a picture to be laid down again, the steps are put in after: none here)
      gl.uniform4fv(u.uLook, [look.quiet && quietTex ? 1 : 0, drawingInto ? 0 : look.levels == null ? 40 : look.levels, look.dissolve ? 1 : 0, look.still ? 0 : 1]);
      const s = look.sky || {};
      gl.uniform3fv(u.uSkyZen, rgb(s.zen || [200, 211, 210]));
      gl.uniform3fv(u.uSkyHor, rgb(s.hor || [233, 228, 211]));
      gl.uniform3fv(u.uHaze, rgb(s.haze || [222, 222, 210]));
      gl.uniform3fv(u.uMistLit, rgb(s.mistLit || [248, 246, 238]));
      gl.uniform3fv(u.uMistShade, rgb(s.mistShade || [214, 216, 210]));
      gl.uniform3fv(u.uGlow, rgb(s.glow || [255, 244, 220]));
    }
    // The trials' uniforms and maps, for the ground and the ray (a piece `p`).
    function trials(prog, p, cam) {
      const u = prog.u;
      gl.uniform4fv(u.uRes, [G.normalMap && (res("normals") || res("raymarch")) ? 1 : 0, res("ao") && G.lightPic ? 1 : 0, res("shadows") && G.lightPic ? 1 : 0, res("detail") ? 1 : 0]);
      gl.uniform4fv(u.uRes2, [res("contours") ? 1 : 0, res("relief") ? 1 : 0, G.trailMap ? 1 : 0, res("lines") ? 1 : 0]);
      // (the normals were made for the world raised L0, a half-width to SQ cells; this piece may be raised and scaled otherwise)
      gl.uniform4fv(u.uRes3, [(p.lift * p.scale) / (G.L0 * G.SQ), G.top || 1973, 1.5 * ratio * SS, G.trailMap ? G.trailMap.reach : 8]);
      gl.uniform1f(u.uMapPx, MAP_PX);
      gl.uniform1f(u.uShore, res("shore") && G.normalMap ? 1 : 0);
      // a second light for relief shading: from the window's upper left, high
      const R = turnOf(cam), l = [-R[0][0] * -0.55 + R[1][0] * 0.62 - R[2][0] * 0.56, -R[0][1] * -0.55 + R[1][1] * 0.62 - R[2][1] * 0.56, -R[0][2] * -0.55 + R[1][2] * 0.62 - R[2][2] * 0.56], ll = Math.hypot(...l);
      gl.uniform3fv(u.uLight2, l.map((v) => v / ll));
      gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, normalTex()); gl.uniform1i(u.uNormalMap, 4);
      gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, lightTex()); gl.uniform1i(u.uLightMap, 5);
      gl.activeTexture(gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, trailTex()); gl.uniform1i(u.uTrailMap, 6);
    }

    // ---------- THE PICTURE LAID DOWN AGAIN (the trials' `post`) ----------
    let tw = 1, th = 1, drawingInto = false, jit = null;
    let sceneT = null, histA = null, histB = null, midT = null, accK = 0, lastCam = null;
    const ACC_MOST = 16;             // `accum`: so many frames laid over each other, at most, while the camera barely moves
    const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
    function targetOf(w, h, depth, halfFloat) {
      const t = { w, h, tex: gl.createTexture(), fb: gl.createFramebuffer(), rb: null };
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, halfFloat ? half.HALF_FLOAT_OES : gl.UNSIGNED_BYTE, null);
      const lin = !halfFloat || halfLinear;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, lin ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, lin ? gl.LINEAR : gl.NEAREST);
      wrap(gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
      if (depth) {
        t.rb = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, t.rb);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w, h);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, t.rb);
      }
      t.ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return t;
    }
    const drop = (t) => { if (!t) return; gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); if (t.rb) gl.deleteRenderbuffer(t.rb); };
    function targets() {
      const w = canvas.width * SS, h = canvas.height * SS;
      if (sceneT && sceneT.w === w && sceneT.h === h) return;
      [sceneT, histA, histB, midT].forEach(drop);
      sceneT = targetOf(w, h, true, false);
      if (accP) {
        histA = targetOf(w, h, false, !!half); histB = targetOf(w, h, false, !!half);
        if (!histA.ok || !histB.ok) { drop(histA); drop(histB); histA = targetOf(w, h, false, false); histB = targetOf(w, h, false, false); }
      }
      midT = res("fxaa") && res("cas") ? targetOf(canvas.width, canvas.height, false, false) : null;
      accK = 0;
    }
    function pass(prog, into, set) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, into ? into.fb : null);
      gl.viewport(0, 0, into ? into.w : canvas.width, into ? into.h : canvas.height);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
      gl.useProgram(prog.p);
      set(prog.u);
      attrib(prog, "aXY", quad, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      off(prog);
    }

    return {
      gl, soft, slow, uint: !!uint, post: !!postP,
      piece: (ground, o) => piece(ground, o),
      mist: (ground, o) => mist(ground, o),
      quiet,
      size(w, h, r) {
        W = w; H = h; ratio = r;
        canvas.width = Math.max(1, Math.round(w * r)); canvas.height = Math.max(1, Math.round(h * r));
        tw = canvas.width; th = canvas.height;
      },
      /** Before a picture: for the trials' `post`, into a picture of its own
          (moved a part of a pixel for `accum`, unless the camera has moved
          more than a pixel since the last). */
      begin(cam) {
        if (!postP) { tw = canvas.width; th = canvas.height; return; }
        targets();
        if (!sceneT.ok) return;
        drawingInto = true;
        tw = sceneT.w; th = sceneT.h;
        gl.bindFramebuffer(gl.FRAMEBUFFER, sceneT.fb);
        jit = null;
        if (accP) {
          const px = lastCam ? Math.abs(cam.yaw - lastCam.yaw) * cam.S + Math.abs(cam.pitch - lastCam.pitch) * cam.S + Math.abs(cam.cx - lastCam.cx) + Math.abs(cam.cy - lastCam.cy) + Math.abs(cam.S - lastCam.S) : 1e9;
          lastCam = { yaw: cam.yaw, pitch: cam.pitch, cx: cam.cx, cy: cam.cy, S: cam.S };
          if (px * ratio > 1.2) accK = 0;
          const k = accK % 64 + 1;
          if (accK) jit = [(halton(k, 2) - 0.5) / (ratio * SS), (halton(k, 3) - 0.5) / (ratio * SS)];
        }
      },
      /** After it: laid over the ones before (`accum`), and down onto the
          window, smoothed or sharpened, in the dither's steps. */
      end(look = {}) {
        if (!postP || !drawingInto) return;
        drawingInto = false;
        let src = sceneT;
        if (accP) {
          const a = Math.max(1 / (accK + 1), 1 / ACC_MOST);
          pass(accP, histB, (u) => {
            gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, sceneT.tex); gl.uniform1i(u.uScene, 2);
            gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, histA.tex); gl.uniform1i(u.uHist, 3);
            gl.uniform1f(u.uAlpha, a);
          });
          [histA, histB] = [histB, histA];
          src = histA;
          accK++;
        }
        tw = canvas.width; th = canvas.height;
        const out = (from, into, mode) => pass(postP, into, (u) => {
          common(postP, { yaw: 0, pitch: 0, eye: 1, eyeP: [0, 0, 0] }, look);
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, from.tex); gl.uniform1i(u.uScene, 2);
          gl.uniform2fv(u.uTexel, [1 / from.w, 1 / from.h]);
          gl.uniform4fv(u.uMode, mode);
        });
        const down = src.w > canvas.width + 1 ? 2 : 1, sharp = res("cas") ? 0.6 : 0;
        if (midT) { out(src, midT, [down, 1, 0, 0]); out(midT, null, [1, 0, sharp, 1]); }
        else out(src, null, [down, res("fxaa") ? 1 : 0, sharp, 1]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      },
      /** How many pictures `accum` has laid over each other since the camera last moved. */
      settled: () => accK,
      clear(c) {
        gl.viewport(0, 0, tw, th);
        if (c) gl.clearColor(c[0], c[1], c[2], 1);
        else gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1);
        gl.depthMask(true);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      },
      /** The sky, the haze below the far land, and high cloud: behind everything. */
      sky(cam, look = {}) {
        if (!G) return;
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.useProgram(skyP.p);
        common(skyP, cam, look);
        const R = turnOf(cam);
        // R's transpose, column-major: its rows.
        gl.uniformMatrix3fv(skyP.u.uBack, false, new Float32Array([R[0][0], R[0][1], R[0][2], R[1][0], R[1][1], R[1][2], R[2][0], R[2][1], R[2][2]]));
        gl.uniform3fv(skyP.u.uLens, [cam.cx + (jit ? jit[0] : 0), cam.cy + (jit ? jit[1] : 0), cam.S * cam.eye]);
        gl.uniform2fv(skyP.u.uSize, [W, H]);
        gl.uniform3fv(skyP.u.uCloud, rgb((look.sky && look.sky.cloud) || [250, 248, 242]));
        attrib(skyP, "aXY", quad, 2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        off(skyP);
      },
      /** Draw `p` for `cam`. `look`: the light's brightness (`surface`), the
          contours, the specks' size, the air, the quiet, a dissolving edge. */
      draw(p, cam, look = {}) {
        if (!G) return;
        const M = matrix(cam, W, H, jit);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        const surface = (prog) => {
          const u = prog.u;
          common(prog, cam, look);
          if (TRIALS) trials(prog, p, cam);
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, photoTex()); gl.uniform1i(u.uPhoto, 2);
          gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, signTex()); gl.uniform1i(u.uSign, 3);
          gl.uniformMatrix4fv(u.uM, false, M);
          const toWorld = p.scale / G.SQ;
          gl.uniform4fv(u.uWorld, [toWorld, (p.centre[0] - G.cu) / G.SQ, (p.centre[1] - G.cv) / G.SQ, p.lift]);
          gl.uniform4fv(u.uSurf, [look.surface == null ? 0.92 : look.surface, look.contours == null ? 0.07 : look.contours, SIGN_DEPTH, G.sign && look.sign !== false ? 1 : 0]);
          if (G.sign) {
            const sg = G.sign;
            gl.uniform4fv(u.uSignAt, [(sg.at[0] + 0.5) / G.n, (sg.at[1] + 0.5) / G.n, G.n / sg.half, p.base]);
            gl.uniform2fv(u.uSignTurn, [sg.cos, sg.sin]);
            // the photo's uv to the piece's own units: n / scale of them to one of uv
            gl.uniform2fv(u.uSignScale, [p.scale / G.n, p.scale / G.n]);
          } else gl.uniform4fv(u.uSignAt, [0, 0, 1, p.base]);
        };
        const ground = () => {
          gl.useProgram(groundP.p);
          surface(groundP);
          const S12 = 48;
          attrib(groundP, "aPos", p.mesh.v, 3, gl.FLOAT, false, S12, 0);
          attrib(groundP, "aNrm", p.mesh.v, 3, gl.FLOAT, false, S12, 12);
          attrib(groundP, "aUV", p.mesh.v, 2, gl.FLOAT, false, S12, 24);
          attrib(groundP, "aMore", p.mesh.v, 4, gl.FLOAT, false, S12, 32);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.mesh.idx);
          gl.drawElements(gl.TRIANGLES, p.mesh.count, p.mesh.type, 0);
          off(groundP);
        };
        gl.depthMask(true);
        gl.disable(gl.BLEND);
        ground();
        // (`raymarch`: over the mountain's square, the ground a ray finds)
        if (rayP && p.box && G.heightMap) {
          gl.useProgram(rayP.p);
          surface(rayP);
          const u = rayP.u;
          gl.activeTexture(gl.TEXTURE7); gl.bindTexture(gl.TEXTURE_2D, heightTex()); gl.uniform1i(u.uHeightMap, 7);
          gl.uniform4fv(u.uRay, p.box.ray);
          gl.uniform4fv(u.uBox, p.box.xz);
          gl.uniform2fv(u.uBoxY, p.box.y);
          attrib(rayP, "aPos", p.box.pos, 3);
          attrib(rayP, "aOut", p.box.out, 3);
          gl.drawArrays(gl.TRIANGLES, 0, p.box.count);
          off(rayP);
        }
        gl.enable(gl.BLEND);
        // The specks, over it, hidden where the surface stands in front.
        if (p.dots.count) {
          gl.useProgram(speckP.p);
          common(speckP, cam, look);
          gl.depthMask(false);
          gl.uniformMatrix4fv(speckP.u.uM, false, M);
          gl.uniform1f(speckP.u.uEye, cam.eye);
          gl.uniform1f(speckP.u.uPx, (look.speck == null ? 0.6 : look.speck) * ratio * (drawingInto ? SS : 1));
          gl.uniform4fv(speckP.u.uWorld, [p.scale / G.SQ, (p.centre[0] - G.cu) / G.SQ, (p.centre[1] - G.cv) / G.SQ, p.lift]);
          if (TRIALS) {
            gl.uniform1f(speckP.u.uRound, res("finespecks") ? 1 : 0);
            gl.uniform4fv(speckP.u.uSq, [p.scale / G.n, (p.centre[0] + 0.5) / G.n, (p.centre[1] + 0.5) / G.n, 0]);
            trials(speckP, p, cam);
          }
          attrib(speckP, "aPos", p.dots.pos, 3);
          attrib(speckP, "aCol", p.dots.col, 4, gl.UNSIGNED_BYTE, true);
          attrib(speckP, "aSA", p.dots.sa, 2);
          if (p.dots.nrm) attrib(speckP, "aNrm", p.dots.nrm, 3, gl.BYTE, true, 4, 0);
          gl.drawArrays(gl.POINTS, 0, p.dots.count);
          off(speckP);
          gl.depthMask(true);
        }
      },
      /** The mist, over everything drawn, hidden where the ground stands in front of it. */
      drawMist(m, cam, look = {}) {
        if (!G || !m || !m.count || !textures.heights) return;
        const M = matrix(cam, W, H, jit), R = turnOf(cam);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(false);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.useProgram(mistP.p);
        common(mistP, cam, look);
        const u = mistP.u;
        gl.uniformMatrix4fv(u.uM, false, M);
        // The camera's right, up and towards-the-eye, in the world: R's rows
        // (the window's x runs the other way round, so right is -row 0).
        gl.uniform3fv(u.uRight, [-R[0][0], -R[0][1], -R[0][2]]);
        gl.uniform3fv(u.uUp, R[1]);
        gl.uniform3fv(u.uToEye, [-R[2][0], -R[2][1], -R[2][2]]);
        gl.uniform2fv(u.uWind, look.wind || [-0.012, 0.016]);
        gl.uniform3fv(u.uCap, look.cap || [0, 0.42, 0]);
        gl.uniform1f(u.uBox, m.box);
        gl.uniform1f(u.uMistA, look.mist == null ? 0.7 : look.mist);
        gl.uniform4fv(u.uWorld, [1, 0, 0, 1]);
        gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, textures.heights); gl.uniform1i(u.uHeights, 2);
        gl.uniform4fv(u.uHeightsAt, textures.heightsAt);
        attrib(mistP, "aBase", m.base, 3);
        attrib(mistP, "aCorner", m.corner, 2);
        attrib(mistP, "aKind", m.kind, 4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.idx);
        gl.drawElements(gl.TRIANGLES, m.n, gl.UNSIGNED_SHORT, 0);
        off(mistP);
        gl.depthMask(true);
      },
      dispose() { Object.values(textures).forEach((t) => t && t.constructor && t instanceof WebGLTexture && gl.deleteTexture(t)); [sceneT, histA, histB, midT].forEach(drop); },
    };
  }

  window.TepeGL = { ground, make, project, matrix, eyeOf, software, res, RES };
})();

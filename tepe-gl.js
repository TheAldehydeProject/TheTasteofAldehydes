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
//                 — lit by a low sun from the south-south-east, its hollows darker.
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
// lays a tenth of the specks and a coarser ground. On the house's own page,
// THE PAGE'S OWN LOOK (below) — and with a graphics card four more: the
// buildings, and the camera's (the picture laid down again, its glow, and
// the pictures laid over each other); if one of the camera's fails, it is
// drawn straight onto the window, in the dither's steps.
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

  // ---------- THE PAGE'S OWN LOOK ----------
  // Chosen by the owner, 2026-10-21, last, out of the day's trials (the
  // resolution's, the realism's and the looks', each shown on its own behind
  // `?res=` on the address, and a panel at the foot of the page to go round
  // them): "remove the menu, make it realistic, give it grain, two ink print,
  // colour haze, drift, but make the colours slightly lighter and less
  // contrasted. I also want you to make it easier to look at; and the text
  // easier to read ... make sure that the reaslitic version doesnt kill the
  // CPU or RAM." So, on the house's own page (`PAGE` — never on the Houses
  // view, whose fragments are drawn as they were):
  //   THE PRINT       every colour as a print in two inks on paper, a soft
  //                   blue and an apricot, light and gentle (`PRINT`): the
  //                   land by its light and its height, the sea by how deep
  //                   it is, the sky from the horizon up;
  //   COLOUR HAZE     the air, the haze and the mist in the print's colours;
  //   THE DRIFT       the inks' hue turned a little and back (`DRIFT_*`);
  // and, with a graphics card (`REAL`; without one the page's own lighter
  // drawing, in the same colours, dithered as it was):
  //   THE GROUND AT 10 M   Copernicus GLO-30's heights, its slope read a pixel
  //                   at a time off a picture of them (MAP_PX) and the coast
  //                   as fine as the window, its triangles every 24 m;
  //   THE LIGHT       the sun and the sky in light's own units, their shadows
  //                   and hollows baked; and THE AIR as air is, per colour,
  //                   thickest low down;
  //   THE COLOUR      the satellite's at its own 10 m, its morning's light
  //                   taken out; the trees' own crowns over it (Meta and
  //                   WRI's Canopy Height Map v2), the marble's gullies on the
  //                   steep bare faces, and the sea as sea is;
  //   THE REAL PATHS AND BUILDINGS   OpenStreetMap's, the paths drawn into
  //                   the ground;
  //   THE CAMERA      the frames laid over each other while it stands still,
  //                   a film's curve, the lens's glow and darker corners, and
  //                   a film's GRAIN in place of the dither's steps.
  // Its pictures are tools/apoteker/fine.mjs's and osm.py's, in FINE. (The
  // trials not chosen are gone, with their pictures; they are in the
  // repository's history, and in the report.)
  const PAGE = !!document.querySelector("body.tepe-page");
  const FULL = /[?&]tepe=full\b/.test(location.search);
  const FINE = "images/Apoteker Tepe/mountain/fine/";
  const FINE_HEIGHT_SCALE = 1.25;  // (fine.mjs HEIGHT_SCALE: its heights are a share of top / this)
  const SHORE_TOP = 0.02;          // the heights to so much of top kept finely in the normals' fourth channel: the coast a pixel at a time
  const MESH_WIDE = 900, MESH_NARROW = 640;   // the 10 m ground's grid across the whole land (its square's triangles every 24 m, a phone's 34 m)
  // The sun and the sky, as they light a real slope: in light's own units
  // (the photograph's colours undone from the screen's curve), a warm sun, a
  // blue sky in the shade and a little light thrown up off the ground, adding
  // up to the page's own white on level ground; a cloud's shadow takes most
  // of the sun.
  const SUN_LIGHT = { sun: [1.12, 1.03, 0.9], sky: [0.118, 0.152, 0.196], bounce: 0.06, cloud: 0.4 };
  // The air: in kilometres, per colour, from the eye, thinning upward (the
  // sea's haze under 750 m, the rest to 2.4 km); the aerosols' extinction at
  // sea level per km, a clear autumn day's (at Ouranoupolis, the peninsula's
  // neck, the summer haze is an optical depth of 0.3 to 0.5).
  const AIR_KM = 0.035;
  const CANOPY_MOST = 2;           // canopy.jpg's 0 to 255 is a share of the light from 0 to this (fine.mjs CANOPY_MOST)
  const DATA_KM_HALF = (DATA.km * 1000) / 2, DATA_TOP = DATA.top || 1973;   // (the marble: metres to a half-width, and to the whole of top)
  // OpenStreetMap's monasteries, sketes and chapels, raised from their
  // footprints: their walls the pale stone they are built of, their roofs the
  // colour the satellite saw them, half to the lead and slate they are.
  const BUILD_STONE = [0.83, 0.8, 0.73], BUILD_SLATE = [0.42, 0.41, 0.4];
  // THE CAMERA: the exposure, the corners darkened (15% at most), the film's
  // grain — its strength, its cell (css px) and how much of it is left
  // behind the writing, so the words read on a quiet ground.
  const CAMERA = { exposure: 1.0, vignette: 0.07, grain: 0.026, cell: 0.8, grainQuiet: 0.3 };
  const BLOOM_STEPS = 6;           // the glow taken down to a sixty-fourth of the window
  const BLOOM = { mix: 0.035, glare: 0.012 };   // (Jimenez: a few per cent of the light spread, no threshold; and the widest of it laid over all, the lens's veil)
  const ACC_MOST = 16;             // so many frames laid over each other at most, while the camera barely moves
  // THE PRINT: two inks on warm paper, each laid at a share (`inks`), and
  // every ramp of five kept light and close in tone — the darkest of it a
  // little under half the paper's light — "slightly lighter and less
  // contrasted ... easier to look at". The sky from the horizon up, the sea
  // from the coast to the deep, the land from shade and low to sunlit and
  // high; its tones in soft terraces, as a print's are (TERRACES).
  const PAPER_INK = [0.965, 0.945, 0.9], INK_A = [0.3, 0.44, 0.66], INK_B = [0.98, 0.63, 0.43];
  const inks = (a, b) => PAPER_INK.map((p, i) => p * (1 - a * (1 - INK_A[i])) * (1 - b * (1 - INK_B[i])));
  const PRINT = {
    sky: [inks(0, 0.34), inks(0.045, 0.17), inks(0.16, 0.045), inks(0.3, 0), inks(0.48, 0)],
    sea: [inks(0.24, 0.01), inks(0.4, 0), inks(0.56, 0), inks(0.7, 0.045), inks(0.81, 0.1)],
    land: [inks(0.88, 0.35), inks(0.68, 0.08), inks(0.34, 0.25), inks(0.07, 0.64), inks(0, 0.24)],
    glow: inks(0, 0.1), cloud: PAPER_INK, mistLit: PAPER_INK, mistShade: inks(0.16, 0.06),
    trail: inks(0.5, 1),           // the trails drawn into the ground: the apricot laid over the blue, a terracotta
  };
  const TERRACES = 0.24;
  // printLand, as the programs work it out, for what is put in the inks once
  // (the specks without a graphics card): `r g b` lit, 0 to 1, and its height.
  const smoothJS = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // (a ramp of five `P` at `t`, in its terraces: ramp5(terraced(t)))
  const inkAt = (P, t0) => {
    const k = Math.min(1, Math.max(0, t0)) * 4, t = ((Math.floor(k) + smoothJS(TERRACES, 1 - TERRACES, k - Math.floor(k))) / 4) * 4;
    let c = P[0];
    for (let i = 1; i < 5; i++) { const f = Math.min(1, Math.max(0, t - (i - 1))); c = c.map((v, ch) => v + (P[i][ch] - v) * f); }
    return c;
  };
  const printLandAt = (r, g, b, h) => {
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return inkAt(PRINT.land, Math.min(1, Math.max(0, (L - 0.1) / 0.55)) * 0.72 + Math.min(1, Math.max(0, h)) * 0.4 - 0.04);
  };           // how sharply the print's tones step (0 none, 0.5 hard)
  const DRIFT_EVERY = 80;          // s: the drift, there and back
  const DRIFT_TURN = 0.26, DRIFT_SHIFT = 0.06;   // how far the inks' hue turns (radians), and their ramps shift

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
    // THE PAGE'S OWN, with a graphics card: the ground at 10 m, its colour at
    // 10 m without its morning, its light baked, the trees' crowns; and, on
    // the page whatever draws it, OpenStreetMap's paths and buildings.
    const fine = PAGE && (!software() || FULL);
    const src = (f) => root + encodeURI(FINE + f);
    const json = (u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    groundPromise = Promise.all([load(root + encodeURI(DATA.heights)), load(fine ? src("colour-10m.jpg") : root + encodeURI(DATA.colour)), load(root + encodeURI("images/Apoteker Tepe/Apoteker Tepe Logo.webp")), fine ? load(src("heights-10m.png")) : null, fine ? load(src("light.png")) : null, fine ? load(src("canopy.jpg")) : null, PAGE ? json(src("athos-osm.json")) : null]).then(([heights, photo, logo, finePic, lightPic, canopyPic, osm]) => {
      // (the real footpaths, in place of the page's invented ones, before anything reads them)
      if (osm && DATA.trails) { DATA.trails.length = 0; osm.trails.forEach((t) => DATA.trails.push(t.pts)); }
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
      // (the finer heights, 10 m apart, FN by FN over the same square)
      const FN = finePic ? finePic.naturalWidth : 0, F = finePic ? readHeights(finePic, FN, FINE_HEIGHT_SCALE) : null;
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
      // The mountain's own heights, u and v in cells: the finer ones smooth
      // between them (Catmull-Rom), or the page's own bilinear, as it was.
      const at = F ? (u, v) => Math.max(0, cubicAt(F, FN, ((clamp(u, 0, n - 1.001) + 0.5) * FN) / n - 0.5, ((clamp(v, 0, n - 1.001) + 0.5) * FN) / n - 0.5))
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
      // (a phone's at most 1024 square: a quarter of the memory, and as much as its window shows)
      const C = photo ? Math.min(photo.naturalWidth, window.innerWidth < 700 ? 1024 : 4096) : 4;
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
      // THE MAPS over the mountain's square, MAP_PX square, made out of the
      // finer heights (a phone's half the size, a quarter of the memory):
      //   normals  the slope of the heights at every place, as the page raises
      //            them (lift L0), to be lit a pixel at a time, not a triangle;
      //            and in its fourth the height near the sea, for the coast
      //   trails   how far each place is from a trail (red, in texels to
      //            REACH), and where along it (green and blue, a dash's turn
      //            as its cosine and sine), for the paths drawn into the ground
      const L0 = DATA.view ? DATA.view.lift : 0.42, MAP_PX = window.innerWidth < 700 ? 1024 : 2048;
      let normalMap = null, trailMap = null;
      if (F) {
        const P = MAP_PX, fineGrid = new Float32Array(P * P);
        for (let j = 0; j < P; j++) for (let i = 0; i < P; i++) fineGrid[j * P + i] = at(((i + 0.5) / P) * n - 0.5, ((j + 0.5) / P) * n - 0.5);
        const out = new Uint8Array(P * P * 4), k = (P / n) * SQ * L0 / 2;   // (central differences over two texels, to half-widths raised by L0)
        for (let j = 0; j < P; j++) for (let i = 0; i < P; i++) {
          const gx = (fineGrid[j * P + Math.min(P - 1, i + 1)] - fineGrid[j * P + Math.max(0, i - 1)]) * k, gz = (fineGrid[Math.min(P - 1, j + 1) * P + i] - fineGrid[Math.max(0, j - 1) * P + i]) * k;
          const l = Math.hypot(gx, 1, gz), o = (j * P + i) * 4;
          out[o] = Math.round((-gx / l * 0.5 + 0.5) * 255); out[o + 1] = Math.round((1 / l * 0.5 + 0.5) * 255); out[o + 2] = Math.round((-gz / l * 0.5 + 0.5) * 255);
          out[o + 3] = Math.round(clamp(fineGrid[j * P + i] / SHORE_TOP, 0, 1) * 255);
        }
        normalMap = { size: P, data: out };
      }
      if (fine && DATA.trails) {
        // (the nearest so far as floats, the rest written straight into the
        // picture: a third of the memory it took)
        const P = MAP_PX, REACH = 8, best = new Float32Array(P * P).fill(REACH), out = new Uint8Array(P * P * 4).fill(128);
        const toPx = (u) => ((u + 0.5) / n) * P, cellM = (DATA.km * 1000) / n, DASH_M = 92;
        // (each trail smoothed: a Catmull-Rom through its points, four to a stretch)
        const smoothed = DATA.trails.map((t) => {
          const o = [];
          for (let q = 0; q < t.length - 1; q++) {
            const p0 = t[Math.max(0, q - 1)], p1 = t[q], p2 = t[q + 1], p3 = t[Math.min(t.length - 1, q + 2)];
            for (let st = 0; st < 4; st++) { const w = st / 4, w2 = w * w, w3 = w2 * w; o.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * w + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * w2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * w3))); }
          }
          o.push(t[t.length - 1]);
          return o;
        });
        smoothed.forEach((t) => {
          let arc = 0;
          for (let q = 1; q < t.length; q++) {
            const [au, av] = t[q - 1], [bu, bv] = t[q], len = Math.hypot(bu - au, bv - av);
            // (none within reach of the summit, where the trails come together under the house's own mark)
            if (Math.hypot(bu - cu, bv - cv) > 6.5 && Math.hypot(au - cu, av - cv) > 6.5) {
              const ax = toPx(au), ay = toPx(av), bx = toPx(bu), by = toPx(bv), dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
              const i0 = Math.max(0, Math.floor(Math.min(ax, bx) - REACH)), i1 = Math.min(P - 1, Math.ceil(Math.max(ax, bx) + REACH));
              const j0 = Math.max(0, Math.floor(Math.min(ay, by) - REACH)), j1 = Math.min(P - 1, Math.ceil(Math.max(ay, by) + REACH));
              for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
                const px = i + 0.5, py = j + 0.5, f = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
                const d = Math.hypot(px - ax - dx * f, py - ay - dy * f), kk = j * P + i;
                if (d < best[kk]) {
                  best[kk] = d;
                  const turn = ((arc + f * len) * cellM / DASH_M) * Math.PI * 2;
                  out[kk * 4 + 1] = Math.round((Math.cos(turn) * 0.5 + 0.5) * 255); out[kk * 4 + 2] = Math.round((Math.sin(turn) * 0.5 + 0.5) * 255);
                }
              }
            }
            arc += len;
          }
        });
        for (let kk = 0; kk < P * P; kk++) { out[kk * 4] = Math.round((best[kk] / REACH) * 255); out[kk * 4 + 3] = 255; }
        trailMap = { size: P, data: out, reach: REACH };
      }
      return {
        normalMap, trailMap, lightPic, canopyPic, osm, L0, F, FN, MAP_PX,
        lightOn: !!lightPic, canopyOn: !!canopyPic,
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
    #ifdef REAL
    uniform vec4 uAirM;     // the air: km to a unit across, km to a unit up, the aerosols' extinction at sea level (/km)
    uniform vec4 uSunM;     // the light: -, the sun's strength, the sky's, the ground's bounce
    // How much air lies along a way from height h0 to h1 (km), d long, in
    // air thinning upward as exp(-h / H): in closed form.
    float airAlong(float h0, float h1, float d, float H) {
      float dh = h1 - h0;
      return abs(dh) < 0.002 ? d * exp(-h0 / H) : d * H * (exp(-h0 / H) - exp(-h1 / H)) / dh;
    }
    // THE AIR AS AIR IS: from the eye itself, per colour, thinning upward.
    vec3 airOf(vec3 col, vec3 p, vec3 d, float dist) {
      float h0 = uEyeP.y * uAirM.y, h1 = max(p.y, 0.0) * uAirM.y, D = dist * uAirM.x;
      float lR = airAlong(h0, h1, D, 8.0);
      float lM = 0.65 * airAlong(h0, h1, D, 0.75) + 0.35 * airAlong(h0, h1, D, 2.4);
      // Rayleigh's air (per km, red green blue) and the aerosols' (the blue
      // lost 1.3 times as fast as the green, the red 0.76 times)
      vec3 tR = vec3(0.0058, 0.0135, 0.0331) * lR, tM = uAirM.z * vec3(0.76, 1.0, 1.34) * lM;
      vec3 T = exp(-(tR + tM));
      float mu = dot(d, uSun), g = 0.76;
      float pM = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * mu, 1.5);   // (Henyey-Greenstein's, 1 where it has no way it prefers)
      // (seen along the ground, the air's own light is the horizon's: Rayleigh's
      // a little of the blue overhead in it, the aerosols' the horizon's white)
      vec3 cR = mix(uSkyHor, uSkyZen, 0.5) * (0.75 + 0.75 * mu * mu), cM = uSkyHor * (0.88 + 0.08 * min(pM, 4.0));
      vec3 air = (tR * cR + tM * cM) / max(tR + tM, vec3(1e-5));
      return col * T + (1.0 - T) * air;
    }
    // THE SUN AND THE SKY on albedo, in light's own units: the sun as far as
    // this place sees it (sunV), the sky as far as it sees that (skyV), a
    // cloud's shadow most of the sun's — and back to the screen's curve.
    vec3 sunLit(vec3 albedo, vec3 n, float lam, float sunV, float skyV, float cloud, float bright) {
      vec3 a = pow(max(albedo, vec3(0.0)), vec3(2.2)) * pow(bright, 2.2);
      float c = 1.0 - ${SUN_LIGHT.cloud.toFixed(2)} * (1.0 - cloud) / 0.12;
      vec3 sunC = vec3(${SUN_LIGHT.sun.map((v) => v.toFixed(3)).join(", ")}) * uSunM.y, skyC = vec3(${SUN_LIGHT.sky.map((v) => v.toFixed(3)).join(", ")}) * uSunM.z;
      vec3 E = sunC * lam * sunV * c + skyC * skyV * (0.62 + 0.38 * n.y) + sunC * uSunM.w * (1.0 - n.y) * vec3(1.0, 0.92, 0.78);
      return pow(clamp(a * E, 0.0, 1.0), vec3(1.0 / 2.2));
    }
    #endif
    #ifdef PAGE
    // THE PRINT, the page's own: three ramps of five — the sky (0 to 4), the
    // sea (5 to 9), the land (10 to 14) — and THE DRIFT (uHue: the inks'
    // hue turned, worked out once a picture; uDrift.y: their ramps shifted).
    uniform vec3 uPal[15];
    uniform vec2 uDrift;
    uniform mat3 uHue;
    float lumaOf(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
    vec3 ramp5(float t, vec3 a, vec3 b, vec3 c, vec3 d, vec3 e) {
      t = clamp(t, 0.0, 1.0) * 4.0;
      vec3 r = mix(a, b, clamp(t, 0.0, 1.0));
      r = mix(r, c, clamp(t - 1.0, 0.0, 1.0));
      r = mix(r, d, clamp(t - 2.0, 0.0, 1.0));
      return mix(r, e, clamp(t - 3.0, 0.0, 1.0));
    }
    // (its tones in soft terraces, as a print's are)
    float terraced(float t) {
      float k = clamp(t, 0.0, 1.0) * 4.0;
      return (floor(k) + smoothstep(${TERRACES.toFixed(2)}, ${(1 - TERRACES).toFixed(2)}, fract(k))) / 4.0;
    }
    #ifdef LITE
    vec3 drifted(vec3 c) { return c; }   // (the hue's turn is in the little picture of the ramps, made again as it turns)
    #else
    vec3 drifted(vec3 c) { return max(uHue * c, vec3(0.0)); }
    #endif
    // The three ramps, each in its terraces: worked out here with a graphics
    // card; read off a little picture of them, made once, without one (on
    // the processor a picture read is a third of the arithmetic).
    #ifdef LITE
    uniform sampler2D uPalette;   // a row each, 256 across: the sky, the sea, the land
    vec3 skyInk(float t) { return texture2D(uPalette, vec2(clamp(t, 0.0, 1.0) * 0.99609 + 0.00195, 0.125)).rgb; }
    vec3 seaInk(float t) { return texture2D(uPalette, vec2(clamp(t, 0.0, 1.0) * 0.99609 + 0.00195, 0.375)).rgb; }
    vec3 landInk(float t) { return texture2D(uPalette, vec2(clamp(t, 0.0, 1.0) * 0.99609 + 0.00195, 0.625)).rgb; }
    #else
    vec3 skyInk(float t) { return ramp5(terraced(t), uPal[0], uPal[1], uPal[2], uPal[3], uPal[4]); }
    vec3 seaInk(float t) { return ramp5(terraced(t), uPal[5], uPal[6], uPal[7], uPal[8], uPal[9]); }
    vec3 landInk(float t) { return ramp5(terraced(t), uPal[10], uPal[11], uPal[12], uPal[13], uPal[14]); }
    #endif
    // (the ramp whole over the sky a phone's tall window shows; a laptop's sees its lighter half)
    float skyAt(float y) {
      #ifdef LITE
      return clamp(y / 0.11, 0.0, 1.0);
      #else
      return pow(clamp(y / 0.11, 0.0, 1.0), 0.85);
      #endif
    }
    vec3 printSky(vec3 d) {
      vec3 c = skyInk(skyAt(d.y) + uDrift.y * 0.5);
      #ifndef LITE
      float s = max(dot(d, uSun), 0.0);
      c += uGlow * (pow(s, 6.0) * 0.16 + pow(s, 40.0) * 0.2);
      #endif
      return drifted(c);
    }
    // What stands behind the drawing, for its quiet behind the writing.
    vec3 behind(vec3 d) { return printSky(d); }
    // THE LAND in the print: \`lit\` as the page lights it, and its height
    // (a share of the top) — in shade and low the blue, sunlit and high the
    // apricot.
    vec3 printLand(vec3 lit, float h) {
      float t = clamp((lumaOf(lit) - 0.1) / 0.55, 0.0, 1.0) * 0.72 + clamp(h, 0.0, 1.0) * 0.4 - 0.04 + uDrift.y;
      return drifted(landInk(t));
    }
    // THE SEA in the print: by how deep it is, the print's sky in it towards
    // the horizon, and its own ripples and glints kept.
    vec3 printSea(vec3 real, float depth, vec3 vd) {
      vec3 c = seaInk(smoothstep(0.0, 0.035, depth) * 0.9 + uDrift.y);
      #ifndef LITE
      float F = 0.02 + 0.98 * pow(1.0 - clamp(-vd.y, 0.0, 1.0), 5.0);
      c = mix(c, skyInk(skyAt(abs(vd.y))), F * 0.55);
      #endif
      float L = lumaOf(real);
      c *= 0.86 + 0.28 * clamp(L / 0.62, 0.0, 1.4);
      return drifted(c + max(L - 0.85, 0.0) * vec3(1.0, 0.9, 0.8));
    }
    #endif
    // LOSING ITS OPACITY behind the writing, to what stands behind it — on the
    // page's own look the print's sky, worked out only where the drawing is
    // quiet at all (most of the window it is not).
    vec3 quieted(vec3 col, vec3 sky, vec3 d) {
      float q = quietHere();
      #ifdef PAGE
      #ifndef LITE
      if (q > 0.999) return col;
      #endif
      sky = behind(d);   // (on the processor a branch costs more than it saves: always)
      #endif
      return mix(sky, col, q);
    }
    float stepAt() {
      return bayer8(gl_FragCoord.xy / uFrame.z);
    }
    vec3 digital(vec3 c) {
      #ifdef REAL
      if (uLook.y < 1.0) return c;   // (no steps: drawn smooth, for the picture laid down again through the camera)
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
      #ifdef REAL
      col = airOf(col, p, d, dist);
      #else
      col = mix(col, sky, 1.0 - exp(-max(0.0, dist - uHazeFrom) * uAir.x));
      #endif
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
      #ifdef PAGE
      vec3 c = printSky(d);
      #else
      vec3 c = skyOf(d);
      #endif
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
  // THE GROUND'S COLOUR AND LIGHT at a place.
  const GROUND_LIB = `
    #extension GL_OES_standard_derivatives : enable
  ` + HEAD + `
    uniform sampler2D uPhoto, uSign;
    uniform vec4 uWorld;    // the piece's own units to half-widths about the summit: scale, x, z; and its lift
    uniform vec4 uSurf;     // brightness, the contours' strength, the cut's depth, the sign on (0 or 1)
    uniform vec4 uSignAt;   // the sign's middle (photo uv), 1 / its half-size (uv), the piece's base height
    uniform vec2 uSignTurn; // cos, sin
    uniform vec2 uSignScale; // the photo's uv to the piece's own units, along x and z
    #ifdef REAL
    // THE PAGE'S OWN MAPS over the mountain's square (each there or not, 0
    // or 1): its slopes a pixel at a time and the heights near the sea, its
    // light baked (the sun's shadows, the sky's hollows), the trails drawn
    // into the ground, the trees' crowns.
    uniform sampler2D uNormalMap, uLightMap, uTrailMap, uCanopy;
    uniform vec4 uMaps;
    uniform vec4 uMap;      // the normals' scale (this piece raised against the map's), -, the trails' width (device px), their reach (texels)
    uniform float uMapPx;
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
    vec3 shade(vec3 P, vec3 n, vec2 uv, float land, float depth, float ao, out vec3 sky) {
      vec2 w = P.xz * uWorld.x + uWorld.yz;
      vec3 v = P - uEyeP;
      float dist = length(v);
      vec3 vd = v / dist;
      sky = skyOf(vd);
      float h = P.y / uWorld.w + uSignAt.w;
      #ifdef REAL
      // (inside the mountain's own square, where its maps lie)
      vec2 e2 = min(uv, 1.0 - uv);
      float sq = smoothstep(0.0, 0.006, min(e2.x, e2.y));
      if (uMaps.x > 0.5) {
        if (sq > 0.5) {
          // THE COAST, A PIXEL AT A TIME: land or sea read off the heights
          // themselves, not the triangles' corners — the water's edge as fine
          // as the window (its depth out to sea still the triangles').
          float hp = texture2D(uNormalMap, uv).a * ${SHORE_TOP.toFixed(3)};
          land = smoothstep(0.0004, 0.0016, hp);
          // (out at sea, the land's heights near it, blurred, say how near the
          // coast is — so only the water by the land counts as its edge)
          float nearL = texture2D(uNormalMap, uv, 3.0).a;
          depth = hp > 0.0006 ? -hp : max(depth, 0.0002 + (0.0006 - hp) + 0.006 * (1.0 - smoothstep(0.0, 0.08, nearL)));
        }
        // ITS SLOPES A PIXEL AT A TIME, off the heights 10 m apart.
        vec3 m = texture2D(uNormalMap, uv).xyz * 2.0 - 1.0;
        vec2 g = m.xz / max(m.y, 0.05) * uMap.x;
        n = normalize(mix(n, normalize(vec3(g.x, 1.0, g.y)), sq));
      }
      #endif
      vec3 albedo = mix(landOf(w, h, n), texture2D(uPhoto, uv).rgb, land);
      #ifdef REAL
      // THE TREES' OWN CROWNS: each place's share of the light within the
      // satellite's pixel round it — its crowns' sunny sides, their shaded
      // sides and their shadows on each other — in the screen's curve
      // (before the sign, which bares the earth under them).
      if (uMaps.w > 0.5) albedo *= mix(1.0, pow(texture2D(uCanopy, uv).r * ${CANOPY_MOST.toFixed(1)}, 1.0 / 2.2), sq * land);
      #ifdef GL_OES_standard_derivatives
      {
        // THE MARBLE: a picture taken from straight above has few pixels for
        // a cliff, and smears it down the slope; on the steep, bare faces
        // (pale, not green), fine gullies are cut down the fall line instead
        // — the way the summit's white marble breaks, in joints and flutes,
        // never in layers — a few metres apart, lighter on their ribs and
        // darker in their grooves, their slopes lit, gone where they would be
        // finer than a pixel. (Worked out everywhere, not only where it
        // shows: a pixel's size, and the noise's, are only sure outside a
        // branch.)
        float steep = smoothstep(0.28, 0.62, 1.0 - n.y);
        float bare = smoothstep(0.02, 0.1, dot(albedo, vec3(0.45, -0.55, 0.1)) + 0.06 * (albedo.r - albedo.g) + 0.04) * smoothstep(0.32, 0.5, dot(albedo, vec3(0.333)));
        float k = steep * bare * land * sq;
        vec2 fall = normalize(n.xz + 1e-4), across = vec2(-fall.y, fall.x);
        vec2 pm = P.xz * uWorld.x * ${DATA_KM_HALF.toFixed(1)};   // (metres about the summit)
        vec2 q = vec2(dot(pm, across) / 7.0, P.y / uWorld.w * ${DATA_TOP.toFixed(1)} / 46.0);
        float fw = length(fwidth(q));
        float fade = 1.0 - smoothstep(0.35, 0.9, fw);
        vec2 wv = q + vec2(texture2D(uNoise, q * vec2(0.02, 0.05)).r - 0.5, 0.0) * 6.0;
        float g1 = texture2D(uNoise, wv * vec2(1.0 / 256.0, 1.0 / 2048.0)).g, g2 = texture2D(uNoise, wv * vec2(2.6 / 256.0, 2.6 / 2048.0) + 0.37).b;
        float flute = (g1 - 0.5) * 0.75 + (g2 - 0.5) * 0.45 * (1.0 - smoothstep(0.2, 0.55, fw * 2.6));
        albedo *= 1.0 + flute * 0.42 * k * fade;
        n = normalize(n + vec3(across.x, 0.0, across.y) * (g1 - texture2D(uNoise, (wv + vec2(0.35, 0.0)) * vec2(1.0 / 256.0, 1.0 / 2048.0)).g) * 1.6 * k * fade);
      }
      #endif
      #endif
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
      float cloud = cloudShade(w);
      float lightness = (${SHADE_FLOOR.toFixed(2)} + ${SHADE_GAIN.toFixed(2)} * lam * cloud) * ao * uSurf.x;
      #ifdef REAL
      // THE LIGHT, BAKED: how much of the sun each place sees (its shadows),
      // and how much of the sky (its hollows) — and THE SUN AND THE SKY on
      // it in light's own units.
      vec2 lm = uMaps.y > 0.5 ? texture2D(uLightMap, uv).rg : vec2(1.0);
      if (uMaps.y > 0.5) lightness = mix(lightness, (${SHADE_FLOOR.toFixed(2)} * (0.22 + 0.86 * lm.g) + ${SHADE_GAIN.toFixed(2)} * lam * cloud * lm.r * (0.86 + 0.14 * lm.g)) * uSurf.x, sq);
      float sunV = mix(1.0, lm.r, sq), skyV = mix(ao, uMaps.y > 0.5 ? 0.2 + 0.85 * lm.g : ao, sq);
      vec3 col = sunLit(albedo, n, lam, sunV, skyV, cloud, uSurf.x);
      #else
      vec3 col = albedo * lightness;
      #endif
      #if defined(GL_OES_standard_derivatives) && !defined(LITE)
      // Faint contours on the land, as a map has them.
      float lines = h * 28.0, ct = abs(fract(lines) - 0.5), fw = fwidth(lines);
      col *= 1.0 - uSurf.y * (1.0 - land) * (1.0 - smoothstep(fw * 0.6, fw * 1.6, ct)) * smoothstep(0.012, 0.03, h);
      #endif
      #ifdef PAGE
      vec3 landLit = col;
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
        #ifdef REAL
        // THE SEA AS SEA IS: seen this low it is mostly the sky in it — water
        // gives back 2% of the light straight down and more and more towards
        // the horizon (Fresnel's, Schlick's form) — over the dark of deep
        // water (its shallows only a few metres wide here: the sea floor
        // drops to 500 m within 4 km, GEBCO's); rougher in lanes of wind and
        // glassy in slicks between them, the glassy giving back the sky the
        // more sharply.
        float lane = texture2D(uNoise, w * 0.31 + vec2(uTime * 0.0016, uTime * 0.0007) * uLook.w).g;
        float rough = mix(0.62, 1.2, smoothstep(0.3, 0.75, lane));
        vec2 r2 = (vec2(texture2D(uNoise, w * 6.1 - vec2(uTime * 0.016, 0.0) * uLook.w).b, texture2D(uNoise, w * 6.1 + vec2(0.0, uTime * 0.013) * uLook.w).r) - 0.5) * 0.08;
        vec3 wn2 = normalize(vec3((r.x + r2.x) * rough, 1.0, (r.y + r2.y) * rough));
        vec3 rv2 = reflect(vd, wn2);
        rv2.y = abs(rv2.y);
        float c = clamp(dot(-vd, wn2), 0.0, 1.0);
        float F = 0.02 + 0.98 * pow(1.0 - c, 5.0);
        vec3 body = mix(vec3(0.05, 0.115, 0.15), ${L3(SHALLOW)} * 0.62, (1.0 - smoothstep(0.0, 0.0012, depth)) * 0.6);
        water = mix(body, skyOf(rv2), F);
        water += vec3(1.0, 0.97, 0.9) * pow(max(dot(rv2, uSun), 0.0), mix(420.0, 60.0, rough / 1.2)) * 0.45;
        #endif
        float shore = 1.0 - smoothstep(0.0, 0.003, depth);
        water = mix(water, vec3(0.88, 0.87, 0.82), shore * 0.55);
        col = mix(col, water, smoothstep(-0.0004, 0.0008, depth));
      }
      #endif
      #ifdef PAGE
      // THE PRINT: the land and the sea each in its own inks.
      float wf = depth > -0.0004 ? smoothstep(-0.0004, 0.0008, depth) : 0.0;
      #ifdef LITE
      // (on the processor, one look into the little picture of the ramps, the
      // land's or the sea's — the coast a clean switch — rather than both)
      float sea = step(0.5, wf), L = lumaOf(mix(landLit, col, sea));
      float t = mix(clamp((L - 0.1) / 0.55, 0.0, 1.0) * 0.72 + clamp(h, 0.0, 1.0) * 0.4 - 0.04, smoothstep(0.0, 0.035, max(depth, 0.0)) * 0.9, sea) + uDrift.y;
      col = texture2D(uPalette, vec2(clamp(t, 0.0, 1.0) * 0.99609 + 0.00195, mix(0.625, 0.375, sea))).rgb;
      col = col * mix(1.0, 0.86 + 0.28 * clamp(L / 0.62, 0.0, 1.4), sea) + sea * max(L - 0.85, 0.0) * vec3(1.0, 0.9, 0.8);
      #else
      col = mix(printLand(landLit, h), printSea(col, max(depth, 0.0), vd), wf);
      #endif
      #endif
      col = throughAir(col, P, w, vd, dist, sky);
      #if defined(GL_OES_standard_derivatives) && defined(REAL)
      // THE TRAILS, drawn into the ground: a line of so many pixels however
      // far off it is, dashed, the dashes going along it, on a faint line of
      // the paper — hidden by the ground in front, lit as it is, and over the
      // haze, as a line drawn on a map is.
      if (uMaps.z > 0.5) {
        vec4 tr = texture2D(uTrailMap, uv);
        float tpp = max(length(fwidth(uv * uMapPx)) * 0.7071, 1e-4);
        float dpx = tr.r * uMap.w / tpp;
        float phase = fract(atan(tr.b * 2.0 - 1.0, tr.g * 2.0 - 1.0) / 6.28318 - uTime * 0.35 * uLook.w);
        float dash = smoothstep(0.0, 0.05, phase) * (1.0 - smoothstep(0.52, 0.57, phase));
        float wpx = uMap.z * 0.5, near = step(tr.r, 0.995) * sq;
        float core = 1.0 - smoothstep(wpx - 0.5, wpx + 0.5, dpx), halo = 1.0 - smoothstep(wpx + 0.4, wpx + 1.4, dpx);
        col = mix(col, ${L3(PAPER_INK)} * (0.6 + 0.4 * lightness), halo * 0.36 * near);
        col = mix(col, ${L3(PRINT.trail)} * (0.75 + 0.3 * lightness), core * dash * 0.92 * near);
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
      col = quieted(col, sky, normalize(vPos - uEyeP));
      gl_FragColor = vec4(digital(col), 1.0);
    }`;
  const SPECK_VS = `
    attribute vec3 aPos; attribute vec4 aCol; attribute vec2 aSA;
    uniform mat4 uM; uniform float uEye; uniform float uPx;
    varying vec3 vCol; varying vec3 vPos; varying float vA;
    #ifdef REAL
    attribute vec3 aNrm;
    varying vec3 vNrm; varying float vAo;
    #endif
    void main() {
      gl_Position = uM * vec4(aPos, 1.0);
      gl_Position.z -= 0.0025 * gl_Position.w;
      #ifdef REAL
      // (each a round speck a little larger, softened at its edge, so it
      // covers its share of a pixel rather than a whole one)
      gl_PointSize = max(1.7, uPx * aSA.x * (uEye / gl_Position.w) * 1.6);
      vNrm = aNrm; vAo = aCol.a * 1.25;
      #else
      gl_PointSize = max(1.0, uPx * aSA.x * (uEye / gl_Position.w));
      #endif
      vCol = aCol.rgb; vPos = aPos; vA = aSA.y;
    }`;
  const SPECK_FS = HEAD + `
    uniform vec4 uWorld;
    varying vec3 vCol; varying vec3 vPos; varying float vA;
    #ifdef REAL
    // (lit here as the ground is: each speck's colour is its ground's, its
    // slope its ground's — elsewhere lit on the processor once)
    uniform vec4 uMaps, uSq;   // uSq: the square's uv off the piece's units (u = x * uSq.x + uSq.y, v = z * uSq.x + uSq.z)
    uniform sampler2D uLightMap, uCanopy;
    varying vec3 vNrm; varying float vAo;
    vec3 speckLight(vec3 albedo, vec2 w) {
      vec3 n = normalize(vNrm);
      vec2 uv = vec2(vPos.x * uSq.x + uSq.y, vPos.z * uSq.x + uSq.z), e2 = min(uv, 1.0 - uv);
      float sq = smoothstep(0.0, 0.006, min(e2.x, e2.y));
      // (a speck takes its crowns' light too, a little blurred — it is a point)
      if (uMaps.w > 0.5) albedo *= mix(1.0, pow(texture2D(uCanopy, uv, 1.5).r * ${CANOPY_MOST.toFixed(1)}, 1.0 / 2.2), sq);
      float lam = max(dot(n, uSun), 0.0), cloud = cloudShade(w);
      vec2 lm = uMaps.y > 0.5 ? texture2D(uLightMap, uv).rg : vec2(1.0);
      float sunV = mix(1.0, lm.r, sq), skyV = mix(vAo, uMaps.y > 0.5 ? 0.2 + 0.85 * lm.g : vAo, sq);
      return sunLit(albedo, n, lam, sunV, skyV, cloud, 1.0);
    }
    #endif
    void main() {
      if (uLook.z > 0.5 && vA < stepAt() * 0.998 + 0.002) discard;
      float cover = 1.0;
      #ifdef REAL
      float r = length(gl_PointCoord - 0.5);
      cover = 1.0 - smoothstep(0.26, 0.5, r);
      if (cover <= 0.0) discard;
      cover *= 0.85;
      #endif
      vec2 w = vPos.xz * uWorld.x + uWorld.yz;
      vec3 v = vPos - uEyeP;
      float dist = length(v);
      vec3 d = v / dist;
      vec3 sky = skyOf(d);
      #ifdef REAL
      vec3 lit = speckLight(vCol, w);
      #else
      vec3 lit = vCol * cloudShade(w);
      #endif
      #if defined(PAGE) && !defined(LITE)
      vec3 col = throughAir(printLand(lit, vPos.y / uWorld.w), vPos, w, d, dist, sky);
      #elif defined(PAGE)
      vec3 col = throughAir(max(uHue * lit, vec3(0.0)), vPos, w, d, dist, sky);   // (put in the inks once, as the specks were laid; the drift's turn here)
      #else
      vec3 col = throughAir(lit, vPos, w, d, dist, sky);
      #endif
      col = quieted(col, sky, d);
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
      #ifdef REAL
      col = airOf(col, vWorld, normalize(v), length(v));
      #else
      col = mix(col, skyOf(normalize(v)), 1.0 - exp(-max(0.0, length(v) - uHazeFrom) * uAir.x));
      #endif
      float a = dens * soft * vA * uMistA * quietHere();
      // (in steps too, unless drawn smooth to be laid down again)
      if (uLook.y >= 1.0) a = floor(a * uLook.y * 0.5 + stepAt()) / (uLook.y * 0.5);
      gl_FragColor = vec4(digital(col) * a, a);
    }`;

  // THE BUILDINGS (OpenStreetMap's, the page's own look): walls and a roof,
  // lit as the ground is, in its inks and its air.
  const BUILD_VS = `
    attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aCol;
    uniform mat4 uM;
    varying vec3 vPos; varying vec3 vNrm; varying vec3 vCol;
    void main() { vPos = aPos; vNrm = aNrm; vCol = aCol; gl_Position = uM * vec4(aPos, 1.0); }`;
  const BUILD_FS = HEAD + `
    uniform vec4 uWorld;
    varying vec3 vPos; varying vec3 vNrm; varying vec3 vCol;
    void main() {
      vec2 w = vPos.xz * uWorld.x + uWorld.yz;
      vec3 v = vPos - uEyeP;
      float dist = length(v);
      vec3 d = v / dist, n = normalize(vNrm), sky = skyOf(d);
      float lam = max(dot(n, uSun), 0.0), cloud = cloudShade(w);
      #ifdef REAL
      vec3 col = sunLit(vCol, n, lam, 1.0, 0.75 + 0.25 * n.y, cloud, 0.95);
      #else
      vec3 col = vCol * (${SHADE_FLOOR.toFixed(2)} + ${SHADE_GAIN.toFixed(2)} * lam * cloud) * 0.95;
      #endif
      #ifdef PAGE
      col = throughAir(printLand(col, vPos.y / uWorld.w), vPos, w, d, dist, sky);
      #else
      col = throughAir(col, vPos, w, d, dist, sky);
      #endif
      col = quieted(col, sky, d);
      gl_FragColor = vec4(digital(col), 1.0);
    }`;

  // THROUGH THE CAMERA (the page's own look, with a graphics card): the
  // mountain drawn first into a picture of its own, moved a part of a pixel
  // every frame and laid over the frames before it while the camera barely
  // moves (so its edges are as fine as many pictures' worth of pixels), and
  // then onto the window — its glow added, the corners darkened as a lens
  // darkens them, put through a film's curve (Khronos PBR Neutral) and back
  // to the screen's, and a film's GRAIN laid on, quieter behind the writing.
  const POST_VS = `
    attribute vec2 aXY;
    varying vec2 vUV;
    void main() { vUV = aXY * 0.5 + 0.5; gl_Position = vec4(aXY, 0.0, 1.0); }`;
  const POST_FS = HEAD + `
    uniform sampler2D uScene, uBloom, uGlare;
    uniform vec4 uCam;      // exposure, the glow's mix (of the light, a little), the vignette's, the grain's
    uniform vec4 uCam2;     // the grain's cell (device px), the glare's (the lens's veil of all its light), the glow's steps, this picture's seed
    uniform vec2 uCam3;     // the window's width to its height, how much of the grain is left behind the writing
    varying vec2 vUV;
    vec3 toLinear(vec3 c) { return pow(max(c, vec3(0.0)), vec3(2.2)); }
    vec3 toDisplay(vec3 c) { return pow(max(c, vec3(0.0)), vec3(1.0 / 2.2)); }
    // Khronos PBR Neutral (2024): the base colours as they are, only the
    // brightest rolled off and let go towards white.
    vec3 neutral(vec3 c) {
      float x = min(c.r, min(c.g, c.b));
      float off = x < 0.08 ? x - 6.25 * x * x : 0.04;
      c -= off;
      float peak = max(c.r, max(c.g, c.b));
      if (peak < 0.76) return c;
      float d = 0.24, np = 1.0 - d * d / (peak + d - 0.76);
      c *= np / peak;
      return mix(c, vec3(np), 1.0 - 1.0 / (0.15 * (peak - np) + 1.0));
    }
    float hash12(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
    // soft-edged noise: hashes at the cells' corners, smoothly between
    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    void main() {
      vec2 uv = vUV, q = (uv - 0.5) * vec2(uCam3.x, 1.0);
      vec3 lin = toLinear(texture2D(uScene, uv).rgb) * uCam.x;
      vec3 blur = texture2D(uBloom, uv).rgb / uCam2.z;
      lin = mix(lin, blur, uCam.y) + texture2D(uGlare, uv).rgb * uCam2.y;
      // the lens darkening its corners: the cosine to the fourth, as light falls off across a lens
      float k = 1.0 + dot(q, q) * uCam.z;
      lin /= k * k;
      vec3 o = toDisplay(neutral(lin));
      // the film's grain: soft-edged, a cell a little under a css px, two
      // sizes of it clumping, strongest in the middle tones as a film's is —
      // and quieter behind the writing, so the words stand on a calm ground
      vec2 p = gl_FragCoord.xy / uCam2.x + uCam2.w * vec2(37.1, 17.7);
      float n = vnoise(p) + vnoise(p * 1.93 + 5.1) - 1.0;
      float L = dot(clamp(o, 0.0, 1.0), vec3(0.2126, 0.7152, 0.0722));
      o += n * uCam.w * mix(0.35, 1.0, 4.0 * L * (1.0 - L)) * mix(uCam3.y, 1.0, quietHere());
      // and last, in place of the dither's steps, one step of the screen's
      // own either way at random — no banding, nothing to see
      vec2 px = gl_FragCoord.xy;
      o += (hash12(px + uCam2.w * 3.1) + hash12(px + 0.5 + uCam2.w * 5.7) - 1.0) / 255.0;
      gl_FragColor = vec4(o, 1.0);
    }`;
  // THE GLOW: the picture taken down a step at a time to a sixty-fourth of
  // its size and back up again, each step spread a little further
  // (Jimenez's way, 2014) — light spreading in the air and in the lens as a
  // camera sees it. No threshold (a lens spreads a little of all its light,
  // not only the brightest), and at the first step each tap weighted by
  // 1 / (1 + its light) (Karis), so no one speck's glint sparkles through it.
  const BLOOM_FS = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    uniform sampler2D uScene;
    uniform vec2 uTexel;    // 1 / the size read from
    uniform vec4 uMode;     // 0 the first step down, 1 down, 2 up; -; -; the step's weight up
    varying vec2 vUV;
    vec3 lin(vec2 uv) { return pow(max(texture2D(uScene, uv).rgb, vec3(0.0)), vec3(2.2)); }
    void main() {
      vec2 o = uTexel;
      if (uMode.x < 0.5) {
        vec3 s = vec3(0.0); float ws = 0.0;
        for (int i = 0; i < 4; i++) {
          vec2 q = vec2(i == 1 || i == 3 ? 1.0 : -1.0, i >= 2 ? 1.0 : -1.0);
          vec3 c = lin(vUV + o * q); float w = 1.0 / (1.0 + dot(c, vec3(0.2126, 0.7152, 0.0722)));
          s += c * w; ws += w;
        }
        gl_FragColor = vec4(s / ws, 1.0);
      } else if (uMode.x < 1.5) {
        vec3 c = 0.5 * (texture2D(uScene, vUV + o * vec2(-1.0, -1.0)).rgb + texture2D(uScene, vUV + o * vec2(1.0, -1.0)).rgb + texture2D(uScene, vUV + o * vec2(-1.0, 1.0)).rgb + texture2D(uScene, vUV + o * vec2(1.0, 1.0)).rgb) * 0.25
          + 0.125 * (texture2D(uScene, vUV + o * vec2(-2.0, 0.0)).rgb + texture2D(uScene, vUV + o * vec2(2.0, 0.0)).rgb + texture2D(uScene, vUV + o * vec2(0.0, -2.0)).rgb + texture2D(uScene, vUV + o * vec2(0.0, 2.0)).rgb);
        gl_FragColor = vec4(c, 1.0);
      } else {
        vec3 c = 4.0 * texture2D(uScene, vUV).rgb
          + 2.0 * (texture2D(uScene, vUV + vec2(o.x, 0.0)).rgb + texture2D(uScene, vUV - vec2(o.x, 0.0)).rgb + texture2D(uScene, vUV + vec2(0.0, o.y)).rgb + texture2D(uScene, vUV - vec2(0.0, o.y)).rgb)
          + texture2D(uScene, vUV + o).rgb + texture2D(uScene, vUV - o).rgb + texture2D(uScene, vUV + vec2(o.x, -o.y)).rgb + texture2D(uScene, vUV + vec2(-o.x, o.y)).rgb;
        gl_FragColor = vec4(c / 16.0 * uMode.w, 1.0);
      }
    }`;
  // (a picture laid over another: the blending does the mixing)
  const COPY_FS = `
    precision mediump float;
    uniform sampler2D uScene;
    varying vec2 vUV;
    void main() { gl_FragColor = vec4(texture2D(uScene, vUV).rgb, 1.0); }`;

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
    // a picture of it (as slowly as it must). `real`: the page's own look
    // whole, on the house's own page with a graphics card.
    const slow = software(), soft = slow && !FULL, real = PAGE && !soft;
    let gl = null;
    try {
      // No smoothing of its edges without a graphics card (on the processor
      // that is four times the drawing), nor with the page's own look, which
      // lays its pictures over each other instead (a smoothed window of its
      // own would be four times the window's memory, for nothing). OPAQUE
      // when it carries its own sky: nothing under it is drawn, nothing over
      // the page is blended.
      const o = { alpha: !opts.opaque, premultipliedAlpha: true, antialias: !soft && !real, depth: true, preserveDrawingBuffer: !!opts.preserve };
      gl = canvas.getContext("webgl", o) || canvas.getContext("experimental-webgl", o);
    } catch (e) { gl = null; }
    if (!gl) return null;
    gl.getExtension("OES_standard_derivatives");
    const uint = gl.getExtension("OES_element_index_uint");
    const ext = (...names) => { for (const nm of names) { const e = gl.getExtension(nm); if (e) return e; } return null; };
    // (a slope seen at a slant sampled along its slant, not blurred to its narrowest)
    const aniso = real ? ext("EXT_texture_filter_anisotropic", "WEBKIT_EXT_texture_filter_anisotropic", "MOZ_EXT_texture_filter_anisotropic") : null;
    const half = real ? ext("OES_texture_half_float") : null, halfLinear = half && ext("OES_texture_half_float_linear");
    if (half) ext("EXT_color_buffer_half_float");
    // (Without a graphics card, the programs' LITE version: the same picture
    // with fewer of its finest touches — no grain, no fields, no contours, no
    // ripples, the clouds' shadows and the mist's wisps simpler. On the
    // house's own page, its PAGE colours; and with a graphics card there,
    // the REAL rest of its look.)
    const defs = (soft ? "#define LITE 1\n" : "") + (real ? "#define REAL 1\n" : "") + (PAGE ? "#define PAGE 1\n" : "");
    const lite = (fs) => (defs ? fs.replace("#ifdef GL_FRAGMENT_PRECISION_HIGH", defs + "    #ifdef GL_FRAGMENT_PRECISION_HIGH") : fs);
    const vert = (vs) => (real ? "#define REAL 1\n" + vs : vs);
    const skyP = program(gl, SKY_VS, lite(SKY_FS)), groundP = program(gl, GROUND_VS, lite(GROUND_FS)), speckP = program(gl, vert(SPECK_VS), lite(SPECK_FS)), mistP = program(gl, MIST_VS, lite(MIST_FS));
    if (!skyP || !groundP || !speckP || !mistP) return null;
    // (the page's own look's: the buildings, and the camera — if one of the
    // camera's fails, the page draws straight onto the window, in the
    // dither's steps)
    const buildP = real ? program(gl, BUILD_VS, lite(BUILD_FS)) : null;
    const postP = real ? program(gl, POST_VS, lite(POST_FS)) : null, copyP = postP ? program(gl, POST_VS, COPY_FS) : null, bloomP = postP ? program(gl, POST_VS, BLOOM_FS) : null;
    const post = !!(postP && copyP && bloomP);
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
      if (mip && aniso && name !== "noise") gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(16, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
      textures[name] = t;
      return t;
    }
    const wrap = (mode) => { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mode); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, mode); };
    const photoTex = () => texture("photo", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, G.tex); wrap(gl.CLAMP_TO_EDGE); return (G.tex.width & (G.tex.width - 1)) === 0; });
    const noiseTex = () => texture("noise", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NOISE, NOISE, 0, gl.RGBA, gl.UNSIGNED_BYTE, G.noise); wrap(gl.REPEAT); return true; });
    const signTex = () => texture("sign", () => { if (G.sign) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, G.sign.canvas); else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); wrap(gl.CLAMP_TO_EDGE); return false; });
    // The page's own maps, each made once, the first time it is drawn — and
    // the processor's copy let go once the graphics card has it.
    const byteTex = (name, map, mip) => texture(name, () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, map.size, map.size, 0, gl.RGBA, gl.UNSIGNED_BYTE, map.data); map.data = null; wrap(gl.CLAMP_TO_EDGE); return mip; });
    const picTex = (name, pic, format) => texture(name, () => { gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, pic); wrap(gl.CLAMP_TO_EDGE); return true; });
    const normalTex = () => (G.normalMap ? byteTex("normals", G.normalMap, true) : noiseTex());
    const trailTex = () => (G.trailMap ? byteTex("trailmap", G.trailMap, false) : noiseTex());
    const canopyTex = () => (G.canopyPic ? picTex("canopy", G.canopyPic, gl.LUMINANCE) : noiseTex());
    const lightTex = () => (G.lightPic ? picTex("light", G.lightPic, gl.RGB) : noiseTex());
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
        // (The page's own look, on the heights 10 m apart: the mountain's
        // square in a triangle's corner every 24 m — a phone's every 34 m —
        // against every 60 m.)
        const fineMesh = uint && real && ground.F;
        const Gn = fineMesh ? (window.innerWidth < 700 ? MESH_NARROW : MESH_WIDE) : uint ? o.grid || (soft ? 220 : 520) : Math.min(250, o.grid || 250), inner = fineMesh ? 0.7 : 0.5, R = WORLD;
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
        V[o12] = (u - cu) / scale; V[o12 + 1] = yOf(hh); V[o12 + 2] = (v - cv) / scale;
        V[o12 + 3] = -gx / nl; V[o12 + 4] = 1 / nl; V[o12 + 5] = -gz / nl;
        V[o12 + 6] = (u + 0.5) / N; V[o12 + 7] = (v + 0.5) / N;
        V[o12 + 8] = ground.landAt(u, v);
        V[o12 + 9] = keep[k];
        V[o12 + 10] = -hh;                     // how far under the water (less than nothing on land)
        V[o12 + 11] = 1 + (u >= 0 && v >= 0 && u < N && v < N ? ground.hollowAt(u, v) : 0);
      }
      // (the triangles' corners straight into the numbers the graphics card
      // takes, not a list of them first: a fifth of the memory)
      const big = count > 65535 && uint, tri = big ? new Uint32Array((cols - 1) * (rows - 1) * 6) : new Uint16Array((cols - 1) * (rows - 1) * 6);
      let nt = 0;
      for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
        const a = index[j * cols + i], b = index[j * cols + i + 1], c = index[(j + 1) * cols + i], d = index[(j + 1) * cols + i + 1];
        if (a >= 0 && b >= 0 && c >= 0) { tri[nt++] = a; tri[nt++] = b; tri[nt++] = c; }
        if (b >= 0 && d >= 0 && c >= 0) { tri[nt++] = b; tri[nt++] = d; tri[nt++] = c; }
      }
      const mesh = { v: buf(V), idx: buf(tri.subarray(0, nt), gl.ELEMENT_ARRAY_BUFFER), count: nt, type: big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT };
      // THE SPECKS: on the mountain, many to a cell, each the photograph's
      // colour where it stands, lit as it is; and, for the world, on the land
      // round it, fewer the further out, the land's own colour.
      const sunL = [Math.sin(SUN.az) * Math.cos(SUN.alt), Math.sin(SUN.alt), -Math.cos(SUN.az) * Math.cos(SUN.alt)];
      const share = soft ? SOFT_SHARE : 1, printOnce = PAGE && soft;
      const wantA = Math.round((o.specks || 0) * share), wantB = Math.round((o.landSpecks || 0) * share);
      const want = wantA + wantB;
      const sp = new Float32Array(want * 3), sc = new Uint8Array(want * 4), ss = new Float32Array(want * 2), sn = real ? new Int8Array(want * 4) : null;
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
        if (real) {
          // (its colour, its grain, its hollow and its slope: the program lights it)
          for (let ch = 0; ch < 3; ch++) sc[m * 4 + ch] = clamp(Math.round(rgb[ch] * g), 0, 255);
          sc[m * 4 + 3] = clamp(Math.round((ao / 1.25) * 255), 0, 255);
          sn[m * 4] = Math.round((nx / nl) * 127); sn[m * 4 + 1] = Math.round((ny / nl) * 127); sn[m * 4 + 2] = Math.round((nz / nl) * 127);
        } else {
          // (lit here, once — and, for the page's own look without a graphics
          // card, put in the print's inks here too, once, as printLand does)
          const lam = Math.max(0, (nx * sunL[0] + ny * sunL[1] + nz * sunL[2]) / nl), lit = (SHADE_FLOOR + SHADE_GAIN * lam) * ao * g;
          for (let ch = 0; ch < 3; ch++) sc[m * 4 + ch] = clamp(Math.round(rgb[ch] * lit), 0, 255);
          if (printOnce) {
            const c = printLandAt(sc[m * 4] / 255, sc[m * 4 + 1] / 255, sc[m * 4 + 2] / 255, Math.max(0, hh) - base);
            for (let ch = 0; ch < 3; ch++) sc[m * 4 + ch] = clamp(Math.round(c[ch] * 255), 0, 255);
          }
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
      return {
        mesh, dots, vertices: count, specks: m, scale, lift, base, centre: [cu, cv], world: !!o.world,
        /** A place on the grid as the piece's own point (for what is drawn over it). */
        point(u, v, up = 0) { return { x: (u - cu) / scale, y: yOf(ground.h(u, v)) + up, z: (v - cv) / scale }; },
        /** The ground's height (the piece's own units) under a point of it. */
        groundAt(x, z) { return yOf(ground.h(cu + x * scale, cv + z * scale)); },
        dispose() { [mesh.v, mesh.idx, dots.pos, dots.col, dots.sa, dots.nrm].forEach((b) => b && gl.deleteBuffer(b)); if (this.built) gl.deleteBuffer(this.built.buf); },
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
    // THE PRINT'S AIR (COLOUR HAZE): the haze, the mist and the sky's glow
    // in the print's colours, and its three ramps for the programs.
    const PRINT_AIR = { zen: PRINT.sky[2], hor: PRINT.sky[0], haze: PRINT.sky[0].map((v) => v * 0.96), mistLit: PRINT.mistLit, mistShade: PRINT.mistShade, glow: PRINT.glow };
    const PRINT_FLAT = new Float32Array([...PRINT.sky, ...PRINT.sea, ...PRINT.land].flat());
    // (without a graphics card, the three ramps in their terraces as a little
    // picture, worked out once, and laid down again turned by the drift's hue
    // `R` whenever it has turned — 768 colours, not every pixel)
    const PAL_W = 256, palBase = [PRINT.sky, PRINT.sea, PRINT.land].map((P) => Array.from({ length: PAL_W }, (_, x) => inkAt(P, x / (PAL_W - 1))));
    const palBytes = new Uint8Array(PAL_W * 4 * 4).fill(255);
    let palT = null, palA = null;
    const paletteTex = (R, a) => {
      if (!palT) { palT = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, palT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); wrap(gl.CLAMP_TO_EDGE); }
      gl.bindTexture(gl.TEXTURE_2D, palT);
      if (a !== palA) {
        palA = a;
        palBase.forEach((row, r) => row.forEach((c, x) => {
          const o = (r * PAL_W + x) * 4;
          for (let ch = 0; ch < 3; ch++) palBytes[o + ch] = clamp(Math.round((R[ch] * c[0] + R[ch + 3] * c[1] + R[ch + 6] * c[2]) * 255), 0, 255);
        }));
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PAL_W, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE, palBytes);
      }
      return palT;
    };
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
      // (the picture drawn into: the window's, or the camera's own, `tw` by `th`)
      gl.uniform4fv(u.uFrame, [1 / tw, 1 / th, Math.max(1, Math.round(ratio * (look.ditherPx || 1))), look.grain == null ? 0.7 : look.grain]);
      gl.uniform4fv(u.uAir, look.air || [0.06, 0, 30, 0.8]);
      gl.uniform1f(u.uHazeFrom, look.hazeFrom == null ? 0 : look.hazeFrom);
      // (drawn into a picture to be laid down again, the steps are put in after: none here)
      gl.uniform4fv(u.uLook, [look.quiet && quietTex ? 1 : 0, drawingInto ? 0 : look.levels == null ? 40 : look.levels, look.dissolve ? 1 : 0, look.still ? 0 : 1]);
      if (PAGE) {
        const s = PRINT_AIR;
        gl.uniform3fv(u.uSkyZen, s.zen); gl.uniform3fv(u.uSkyHor, s.hor); gl.uniform3fv(u.uHaze, s.haze);
        gl.uniform3fv(u.uMistLit, s.mistLit); gl.uniform3fv(u.uMistShade, s.mistShade); gl.uniform3fv(u.uGlow, s.glow);
        gl.uniform3fv(u.uPal, PRINT_FLAT);
        // THE DRIFT: the inks' hue turned a little and back — a turn about
        // the grey axis, worked out here once a picture (Rodrigues') — and
        // their ramps shifted
        const ph = look.still ? 0 : ((look.time || 0) / DRIFT_EVERY) * Math.PI * 2;
        const a = DRIFT_TURN * Math.sin(ph), c = Math.cos(a), t = (1 - c) / 3, k = 0.57735 * Math.sin(a);
        const R = [c + t, t + k, t - k, t - k, c + t, t + k, t + k, t - k, c + t];   // (column by column)
        gl.uniformMatrix3fv(u.uHue, false, R);
        gl.uniform2fv(u.uDrift, [a, DRIFT_SHIFT * Math.sin(ph + 1.1)]);
        if (soft) { gl.activeTexture(gl.TEXTURE4); paletteTex(R, a); gl.uniform1i(u.uPalette, 4); }
      } else {
        const s = look.sky || {};
        gl.uniform3fv(u.uSkyZen, rgb(s.zen || [200, 211, 210]));
        gl.uniform3fv(u.uSkyHor, rgb(s.hor || [233, 228, 211]));
        gl.uniform3fv(u.uHaze, rgb(s.haze || [222, 222, 210]));
        gl.uniform3fv(u.uMistLit, rgb(s.mistLit || [248, 246, 238]));
        gl.uniform3fv(u.uMistShade, rgb(s.mistShade || [214, 216, 210]));
        gl.uniform3fv(u.uGlow, rgb(s.glow || [255, 244, 220]));
      }
      if (real) {
        // (the air: the world's units are half-widths across, and top / LIFT up)
        gl.uniform4fv(u.uAirM, [DATA.km / 2, (DATA.top / 1000) / (DATA.view ? DATA.view.lift : 0.42), AIR_KM, 0]);
        gl.uniform4fv(u.uSunM, [0, 1, 1, SUN_LIGHT.bounce]);
      }
    }
    // The page's own maps, for the ground and the specks of a piece `p`.
    function maps(prog, p) {
      const u = prog.u;
      gl.uniform4fv(u.uMaps, [G.normalMap ? 1 : 0, G.lightPic ? 1 : 0, G.trailMap ? 1 : 0, G.canopyPic ? 1 : 0]);
      // (the normals were made for the world raised L0, a half-width to SQ cells; this piece may be raised and scaled otherwise)
      gl.uniform4fv(u.uMap, [(p.lift * p.scale) / (G.L0 * G.SQ), 0, 1.5 * ratio, G.trailMap ? G.trailMap.reach : 8]);
      gl.uniform1f(u.uMapPx, G.MAP_PX);
      gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, normalTex()); gl.uniform1i(u.uNormalMap, 4);
      gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, lightTex()); gl.uniform1i(u.uLightMap, 5);
      gl.activeTexture(gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, trailTex()); gl.uniform1i(u.uTrailMap, 6);
      gl.activeTexture(gl.TEXTURE7); gl.bindTexture(gl.TEXTURE_2D, canopyTex()); gl.uniform1i(u.uCanopy, 7);
    }
    // OpenStreetMap's buildings: each footprint raised, its walls from a
    // little under the lowest ground it stands on to its height over the
    // highest, and a flat roof over them, cut into triangles by its ears.
    function buildingsOf(p) {
      const top = G.top || 1973, out = [];
      const X = (u) => (u - p.centre[0]) / p.scale, Z = (v) => (v - p.centre[1]) / p.scale, Y = (hs) => (Math.max(0, hs) - p.base) * p.lift;
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      const put = (x, y, z, n, c) => out.push(x, y, z, n[0], n[1], n[2], c[0], c[1], c[2]);
      G.osm.buildings.forEach((b) => {
        let R = b.ring;
        if (R.length < 3) return;
        // (anticlockwise on the window's ground: u east, v south)
        let area = 0;
        for (let i = 0; i < R.length; i++) { const [a, c] = R[i], [d, e] = R[(i + 1) % R.length]; area += a * e - d * c; }
        if (area < 0) R = R.slice().reverse();
        const hs = R.map(([u, v]) => G.h(u, v));
        const lo = Y(Math.min(...hs) - 3 / top), hi = Y(Math.max(...hs) + b.tall / top);
        const mu = R.reduce((s, q) => s + q[0], 0) / R.length, mv = R.reduce((s, q) => s + q[1], 0) / R.length, seen = G.colourAt(mu, mv);
        const k = 0.9 + 0.12 * rnd(), wall = BUILD_STONE.map((c) => c * k);
        const roof = BUILD_SLATE.map((c, i) => c * 0.5 + (seen[i] / 255) * 0.5);
        for (let i = 0; i < R.length; i++) {
          const [u0, v0] = R[i], [u1, v1] = R[(i + 1) % R.length];
          const x0 = X(u0), z0 = Z(v0), x1 = X(u1), z1 = Z(v1), l = Math.hypot(x1 - x0, z1 - z0) || 1;
          const n = [(z1 - z0) / l, 0, -(x1 - x0) / l];
          put(x0, lo, z0, n, wall); put(x1, lo, z1, n, wall); put(x1, hi, z1, n, wall);
          put(x0, lo, z0, n, wall); put(x1, hi, z1, n, wall); put(x0, hi, z0, n, wall);
        }
        // the roof, ear by ear
        const idx = R.map((_, i) => i), cross = (a, b, c) => (R[b][0] - R[a][0]) * (R[c][1] - R[a][1]) - (R[b][1] - R[a][1]) * (R[c][0] - R[a][0]);
        const inTri = (p, a, b, c) => { const s1 = cross(a, b, p) >= 0, s2 = cross(b, c, p) >= 0, s3 = cross(c, a, p) >= 0; return s1 === s2 && s2 === s3; };
        let guard = 0;
        while (idx.length > 3 && guard++ < 400) {
          let cut = false;
          for (let i = 0; i < idx.length; i++) {
            const a = idx[(i + idx.length - 1) % idx.length], b = idx[i], c = idx[(i + 1) % idx.length];
            if (cross(a, b, c) <= 0) continue;
            if (idx.some((q) => q !== a && q !== b && q !== c && inTri(q, a, b, c))) continue;
            [a, b, c].forEach((q) => put(X(R[q][0]), hi, Z(R[q][1]), [0, 1, 0], roof));
            idx.splice(i, 1);
            cut = true;
            break;
          }
          if (!cut) break;
        }
        if (idx.length === 3) idx.forEach((q) => put(X(R[q][0]), hi, Z(R[q][1]), [0, 1, 0], roof));
      });
      const data = new Float32Array(out), b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return { buf: b, count: data.length / 9 };
    }

    // ---------- THROUGH THE CAMERA (the page's own look) ----------
    // The picture drawn into one of its own (`scene`: its colours are the
    // print's, within the screen's, so a byte each), laid over the ones
    // before it in another (`hist`, in half floats where the machine has
    // them, so the many pictures add up smoothly) — the blending doing the
    // mixing, so one picture of the history is enough — and from that its
    // glow and the window.
    let tw = 1, th = 1, drawingInto = false, jit = null;
    let sceneT = null, hist = null, accK = 0, lastCam = null, bloomTs = [];
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
    const either = (w, h, depth) => { const t = targetOf(w, h, depth, !!half); if (t.ok || !half) return t; drop(t); return targetOf(w, h, depth, false); };
    function targets() {
      const w = canvas.width, h = canvas.height;
      if (sceneT && sceneT.w === w && sceneT.h === h) return;
      [sceneT, hist, ...bloomTs].forEach(drop);
      sceneT = targetOf(w, h, true, false);
      hist = either(w, h, false);
      bloomTs = [];
      for (let i = 1, bw = w, bh = h; i <= BLOOM_STEPS; i++) {
        bw = Math.max(1, Math.ceil(bw / 2)); bh = Math.max(1, Math.ceil(bh / 2));
        bloomTs.push(either(bw, bh, false));
      }
      accK = 0;
    }
    // A picture drawn over the whole of another: plainly, adding (`"add"`),
    // or laid over it at a share (a number).
    function pass(prog, into, set, blend) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, into ? into.fb : null);
      gl.viewport(0, 0, into ? into.w : canvas.width, into ? into.h : canvas.height);
      gl.disable(gl.DEPTH_TEST);
      if (blend === "add") { gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); }
      else if (typeof blend === "number") { gl.enable(gl.BLEND); gl.blendColor(0, 0, 0, blend); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); }
      else gl.disable(gl.BLEND);
      gl.useProgram(prog.p);
      set(prog.u);
      attrib(prog, "aXY", quad, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      off(prog);
      gl.disable(gl.BLEND);
    }
    const sceneOf = (u, t) => { gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, t.tex); gl.uniform1i(u.uScene, 2); };

    return {
      gl, soft, slow, real, post, page: PAGE, uint: !!uint,
      piece: (ground, o) => piece(ground, o),
      mist: (ground, o) => mist(ground, o),
      quiet,
      size(w, h, r) {
        W = w; H = h; ratio = r;
        canvas.width = Math.max(1, Math.round(w * r)); canvas.height = Math.max(1, Math.round(h * r));
        tw = canvas.width; th = canvas.height;
      },
      /** Before a picture: through the camera, into a picture of its own,
          moved a part of a pixel — unless the camera has moved more than a
          pixel since the last, when the pictures laid over each other begin
          again. */
      begin(cam) {
        if (!post) { tw = canvas.width; th = canvas.height; return; }
        targets();
        if (!sceneT.ok || !hist.ok) return;
        drawingInto = true;
        tw = sceneT.w; th = sceneT.h;
        gl.bindFramebuffer(gl.FRAMEBUFFER, sceneT.fb);
        const px = lastCam ? Math.abs(cam.yaw - lastCam.yaw) * cam.S + Math.abs(cam.pitch - lastCam.pitch) * cam.S + Math.abs(cam.cx - lastCam.cx) + Math.abs(cam.cy - lastCam.cy) + Math.abs(cam.S - lastCam.S) : 1e9;
        lastCam = { yaw: cam.yaw, pitch: cam.pitch, cx: cam.cx, cy: cam.cy, S: cam.S };
        if (px * ratio > 1.2) accK = 0;
        const k = (accK % 64) + 1;
        jit = accK ? [(halton(k, 2) - 0.5) / ratio, (halton(k, 3) - 0.5) / ratio] : null;
      },
      /** After it: laid over the ones before, its glow worked out, and down
          onto the window through the camera. */
      end(look = {}) {
        if (!post || !drawingInto) return;
        drawingInto = false;
        pass(copyP, hist, (u) => sceneOf(u, sceneT), Math.max(1 / (accK + 1), 1 / ACC_MOST));
        accK++;
        tw = canvas.width; th = canvas.height;
        // (the glow: down a step at a time, the bright part kept at the first, and back up, each step added to the one above)
        let from = hist;
        bloomTs.forEach((t, i) => {
          pass(bloomP, t, (u) => { sceneOf(u, from); gl.uniform2fv(u.uTexel, [1 / from.w, 1 / from.h]); gl.uniform4fv(u.uMode, [i ? 1 : 0, 0, 0, 0]); });
          from = t;
        });
        const glare = bloomTs[bloomTs.length - 1];   // (the widest, before anything is added to it)
        for (let i = bloomTs.length - 1; i > 0; i--) {
          const t = bloomTs[i];
          pass(bloomP, bloomTs[i - 1], (u) => { sceneOf(u, t); gl.uniform2fv(u.uTexel, [1 / t.w, 1 / t.h]); gl.uniform4fv(u.uMode, [2, 0, 0, 1]); }, "add");
        }
        pass(postP, null, (u) => {
          common(postP, { yaw: 0, pitch: 0, eye: 1, eyeP: [0, 0, 0] }, look);
          sceneOf(u, hist);
          gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, bloomTs[0].tex); gl.uniform1i(u.uBloom, 4);
          gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, glare.tex); gl.uniform1i(u.uGlare, 5);
          gl.uniform4fv(u.uCam, [CAMERA.exposure, BLOOM.mix, CAMERA.vignette, CAMERA.grain]);
          gl.uniform4fv(u.uCam2, [Math.max(1, CAMERA.cell * ratio), BLOOM.glare, bloomTs.length, look.still ? 1 : Math.floor((look.time || 0) * 24) % 997]);
          gl.uniform2fv(u.uCam3, [canvas.width / canvas.height, CAMERA.grainQuiet]);
        });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      },
      /** How many pictures have been laid over each other since the camera last moved. */
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
        gl.uniform3fv(skyP.u.uCloud, PAGE ? PRINT.cloud : rgb((look.sky && look.sky.cloud) || [250, 248, 242]));
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
        const world = [p.scale / G.SQ, (p.centre[0] - G.cu) / G.SQ, (p.centre[1] - G.cv) / G.SQ, p.lift];
        const surface = (prog) => {
          const u = prog.u;
          common(prog, cam, look);
          if (real) maps(prog, p);
          gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, photoTex()); gl.uniform1i(u.uPhoto, 2);
          gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, signTex()); gl.uniform1i(u.uSign, 3);
          gl.uniformMatrix4fv(u.uM, false, M);
          gl.uniform4fv(u.uWorld, world);
          gl.uniform4fv(u.uSurf, [look.surface == null ? 0.92 : look.surface, look.contours == null ? 0.07 : look.contours, SIGN_DEPTH, G.sign && look.sign !== false ? 1 : 0]);
          if (G.sign) {
            const sg = G.sign;
            gl.uniform4fv(u.uSignAt, [(sg.at[0] + 0.5) / G.n, (sg.at[1] + 0.5) / G.n, G.n / sg.half, p.base]);
            gl.uniform2fv(u.uSignTurn, [sg.cos, sg.sin]);
            // the photo's uv to the piece's own units: n / scale of them to one of uv
            gl.uniform2fv(u.uSignScale, [p.scale / G.n, p.scale / G.n]);
          } else gl.uniform4fv(u.uSignAt, [0, 0, 1, p.base]);
        };
        gl.depthMask(true);
        gl.disable(gl.BLEND);
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
        // (the monasteries and the rest, on the ground)
        if (buildP && G.osm && p.world) {
          if (!p.built) p.built = buildingsOf(p);
          const b = p.built;
          gl.useProgram(buildP.p);
          common(buildP, cam, look);
          gl.uniformMatrix4fv(buildP.u.uM, false, M);
          gl.uniform4fv(buildP.u.uWorld, world);
          attrib(buildP, "aPos", b.buf, 3, gl.FLOAT, false, 36, 0);
          attrib(buildP, "aNrm", b.buf, 3, gl.FLOAT, false, 36, 12);
          attrib(buildP, "aCol", b.buf, 3, gl.FLOAT, false, 36, 24);
          gl.drawArrays(gl.TRIANGLES, 0, b.count);
          off(buildP);
        }
        gl.enable(gl.BLEND);
        // The specks, over it, hidden where the surface stands in front.
        if (p.dots.count) {
          gl.useProgram(speckP.p);
          common(speckP, cam, look);
          gl.depthMask(false);
          gl.uniformMatrix4fv(speckP.u.uM, false, M);
          gl.uniform1f(speckP.u.uEye, cam.eye);
          gl.uniform1f(speckP.u.uPx, (look.speck == null ? 0.6 : look.speck) * ratio);
          gl.uniform4fv(speckP.u.uWorld, world);
          if (real) {
            gl.uniform4fv(speckP.u.uSq, [p.scale / G.n, (p.centre[0] + 0.5) / G.n, (p.centre[1] + 0.5) / G.n, 0]);
            maps(speckP, p);
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
      dispose() { Object.values(textures).forEach((t) => t && t instanceof WebGLTexture && gl.deleteTexture(t)); [sceneT, hist, ...bloomTs].forEach(drop); },
    };
  }

  window.TepeGL = { ground, make, project, matrix, eyeOf, software };
})();

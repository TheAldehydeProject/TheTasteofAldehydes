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
    groundPromise = Promise.all([load(root + encodeURI(DATA.heights)), load(root + encodeURI(DATA.colour)), load(root + encodeURI("images/Apoteker Tepe/Apoteker Tepe Logo.webp"))]).then(([heights, photo, logo]) => {
      // THE HEIGHTS, out of their picture: red the high byte, green the low.
      const H = new Float32Array(n * n);
      if (heights) {
        const c = document.createElement("canvas");
        c.width = c.height = n;
        const g = c.getContext("2d", { willReadFrequently: true });
        g.drawImage(heights, 0, 0);
        const d = g.getImageData(0, 0, n, n).data;
        for (let k = 0; k < n * n; k++) H[k] = (d[k * 4] * 256 + d[k * 4 + 1]) / 65535;
      }
      const [cu, cv] = DATA.summit, SQ = n / 2;
      const at = (u, v) => {                     // the mountain's own heights, bilinear, u and v in cells
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
      return {
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
    float stepAt() { return bayer8(gl_FragCoord.xy / uFrame.z); }
    vec3 digital(vec3 c) {
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
  const GROUND_FS = `
    #extension GL_OES_standard_derivatives : enable
  ` + HEAD + `
    uniform sampler2D uPhoto, uSign;
    uniform vec4 uWorld;    // the piece's own units to half-widths about the summit: scale, x, z; and its lift
    uniform vec4 uSurf;     // brightness, the contours' strength, the cut's depth, the sign on (0 or 1)
    uniform vec4 uSignAt;   // the sign's middle (photo uv), 1 / its half-size (uv), the piece's base height
    uniform vec2 uSignTurn; // cos, sin
    uniform vec2 uSignScale; // the photo's uv to the piece's own units, along x and z
    varying vec3 vPos; varying vec3 vNrm; varying vec2 vUV; varying vec4 vMore;
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
    void main() {
      float keep = vMore.y;
      if (uLook.z > 0.5 && keep < stepAt() * 0.998 + 0.002) discard;
      vec2 w = vPos.xz * uWorld.x + uWorld.yz;
      vec3 v = vPos - uEyeP;
      float dist = length(v);
      vec3 vd = v / dist, sky = skyOf(vd);
      float h = vPos.y / uWorld.w + uSignAt.w;
      vec3 n = normalize(vNrm);
      float land = vMore.x, depth = vMore.z, ao = vMore.w;
      vec3 albedo = mix(landOf(w, h, n), texture2D(uPhoto, vUV).rgb, land);
      // THE SIGN, cut in: its shape lowered into the ground, the earth it
      // lays bare a little paler.
      if (uSurf.w > 0.5) {
        vec2 d = vUV - uSignAt.xy;
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
      float lightness = (${SHADE_FLOOR.toFixed(2)} + ${SHADE_GAIN.toFixed(2)} * lam * cloudShade(w)) * ao * uSurf.x;
      vec3 col = albedo * lightness;
      // Faint contours on the land, as a map has them.
      #if defined(GL_OES_standard_derivatives) && !defined(LITE)
      float lines = h * 28.0, ct = abs(fract(lines) - 0.5), fw = fwidth(lines);
      col *= 1.0 - uSurf.y * (1.0 - land) * (1.0 - smoothstep(fw * 0.6, fw * 1.6, ct)) * smoothstep(0.012, 0.03, h);
      #endif
      // THE WATER, where the land lies under it: the sky in it, a glint of
      // the sun, the shallows paler and a line where it meets the land.
      #ifdef LITE
      if (depth > -0.0004) col = mix(col, mix(${L3(SHALLOW)}, sky, 0.45), smoothstep(-0.0004, 0.0008, depth));
      #else
      if (depth > -0.0004) {
        #ifdef LITE
        vec3 wn = vec3(0.0, 1.0, 0.0);
        #else
        vec2 r = (vec2(texture2D(uNoise, w * 2.2 + vec2(uTime * 0.01, 0.0) * uLook.w).r, texture2D(uNoise, w * 2.2 + vec2(0.0, uTime * 0.008) * uLook.w).g) - 0.5) * 0.18;
        vec3 wn = normalize(vec3(r.x, 1.0, r.y));
        #endif
        vec3 rv = reflect(vd, wn);
        float fres = 0.18 + 0.7 * pow(1.0 - max(-vd.y, 0.0), 5.0);
        vec3 water = mix(mix(${L3(SHALLOW)}, ${L3(DEEP)}, smoothstep(0.0, 0.03, depth)), skyOf(rv), fres);
        water += vec3(1.0, 0.97, 0.9) * pow(max(dot(rv, uSun), 0.0), 90.0) * 0.5;
        float shore = 1.0 - smoothstep(0.0, 0.003, depth);
        water = mix(water, vec3(0.88, 0.87, 0.82), shore * 0.55);
        col = mix(col, water, smoothstep(-0.0004, 0.0008, depth));
      }
      #endif
      col = throughAir(col, vPos, w, vd, dist, sky);
      // LOSING ITS OPACITY behind the writing: what stands behind it is the
      // sky (or the haze under the far land), so it is drawn that much of
      // the way to that — solid all the same, no slope showing through the
      // one in front of it.
      col = mix(sky, col, quietHere());
      gl_FragColor = vec4(digital(col), 1.0);
    }`;
  const SPECK_VS = `
    attribute vec3 aPos; attribute vec4 aCol; attribute vec2 aSA;
    uniform mat4 uM; uniform float uEye; uniform float uPx;
    varying vec3 vCol; varying vec3 vPos; varying float vA;
    void main() {
      gl_Position = uM * vec4(aPos, 1.0);
      gl_Position.z -= 0.0025 * gl_Position.w;
      gl_PointSize = max(1.0, uPx * aSA.x * (uEye / gl_Position.w));
      vCol = aCol.rgb; vPos = aPos; vA = aSA.y;
    }`;
  const SPECK_FS = HEAD + `
    uniform vec4 uWorld;
    varying vec3 vCol; varying vec3 vPos; varying float vA;
    void main() {
      if (uLook.z > 0.5 && vA < stepAt() * 0.998 + 0.002) discard;
      vec2 w = vPos.xz * uWorld.x + uWorld.yz;
      vec3 v = vPos - uEyeP;
      float dist = length(v);
      vec3 d = v / dist;
      vec3 sky = skyOf(d);
      vec3 col = throughAir(vCol * cloudShade(w), vPos, w, d, dist, sky);
      col = mix(sky, col, quietHere());
      float a = uLook.z > 0.5 ? 1.0 : vA;
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
      a = floor(a * uLook.y * 0.5 + stepAt()) / (uLook.y * 0.5);
      gl_FragColor = vec4(digital(col) * a, a);
    }`;

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
  function matrix(cam, W, H) {
    const R = turnOf(cam);
    const kx = (2 * cam.S * cam.eye) / W, ky = (2 * cam.S * cam.eye) / H;
    const ox = (2 * cam.cx) / W - 1, oy = 1 - (2 * cam.cy) / H;
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
    // (Without a graphics card, the programs' LITE version: the same picture
    // with fewer of its finest touches — no grain, no fields, no contours, no
    // ripples, the clouds' shadows and the mist's wisps simpler.)
    const lite = (fs) => (soft ? fs.replace("#ifdef GL_FRAGMENT_PRECISION_HIGH", "#define LITE 1\n    #ifdef GL_FRAGMENT_PRECISION_HIGH") : fs);
    const skyP = program(gl, SKY_VS, lite(SKY_FS)), groundP = program(gl, GROUND_VS, lite(GROUND_FS)), speckP = program(gl, SPECK_VS, lite(SPECK_FS)), mistP = program(gl, MIST_VS, lite(MIST_FS));
    if (!skyP || !groundP || !speckP || !mistP) return null;
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
      textures[name] = t;
      return t;
    }
    const wrap = (mode) => { gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mode); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, mode); };
    const photoTex = () => texture("photo", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, G.tex); wrap(gl.CLAMP_TO_EDGE); return (G.tex.width & (G.tex.width - 1)) === 0; });
    const noiseTex = () => texture("noise", () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, NOISE, NOISE, 0, gl.RGBA, gl.UNSIGNED_BYTE, G.noise); wrap(gl.REPEAT); return true; });
    const signTex = () => texture("sign", () => { if (G.sign) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, G.sign.canvas); else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4)); wrap(gl.CLAMP_TO_EDGE); return false; });
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
        const Gn = uint ? o.grid || (soft ? 220 : 520) : Math.min(250, o.grid || 250), inner = 0.5, R = WORLD;
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
      const sp = new Float32Array(want * 3), sc = new Uint8Array(want * 4), ss = new Float32Array(want * 2);
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
        const nl = Math.hypot(nx, ny, nz), lam = Math.max(0, (nx * sunL[0] + ny * sunL[1] + nz * sunL[2]) / nl);
        const ao = 1 + (u >= 0 && v >= 0 && u < N && v < N ? ground.hollowAt(u, v) : 0);
        const lit = (SHADE_FLOOR + SHADE_GAIN * lam) * ao * (1 + (random() - 0.5) * grain);
        sp[m * 3] = (u - cu) / scale; sp[m * 3 + 1] = yOf(hh); sp[m * 3 + 2] = (v - cv) / scale;
        for (let ch = 0; ch < 3; ch++) sc[m * 4 + ch] = clamp(Math.round(rgb[ch] * lit), 0, 255);
        sc[m * 4 + 3] = 255;
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
      const dots = { pos: buf(sp.subarray(0, m * 3)), col: buf(sc.subarray(0, m * 4)), sa: buf(ss.subarray(0, m * 2)), count: m };
      return {
        mesh, dots, vertices: count, specks: m, scale, lift, base, centre: [cu, cv], world: !!o.world,
        /** A place on the grid as the piece's own point (for what is drawn over it). */
        point(u, v, up = 0) { return { x: (u - cu) / scale, y: yOf(ground.h(u, v)) + up, z: (v - cv) / scale }; },
        /** The ground's height (the piece's own units) under a point of it. */
        groundAt(x, z) { return yOf(ground.h(cu + x * scale, cv + z * scale)); },
        dispose() { [mesh.v, mesh.idx, dots.pos, dots.col, dots.sa].forEach((b) => gl.deleteBuffer(b)); },
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
      gl.uniform4fv(u.uFrame, [1 / canvas.width, 1 / canvas.height, Math.max(1, Math.round(ratio * (look.ditherPx || 1))), look.grain == null ? 0.7 : look.grain]);
      gl.uniform4fv(u.uAir, look.air || [0.06, 0, 30, 0.8]);
      gl.uniform1f(u.uHazeFrom, look.hazeFrom == null ? 0 : look.hazeFrom);
      gl.uniform4fv(u.uLook, [look.quiet && quietTex ? 1 : 0, look.levels || 40, look.dissolve ? 1 : 0, look.still ? 0 : 1]);
      const s = look.sky || {};
      gl.uniform3fv(u.uSkyZen, rgb(s.zen || [200, 211, 210]));
      gl.uniform3fv(u.uSkyHor, rgb(s.hor || [233, 228, 211]));
      gl.uniform3fv(u.uHaze, rgb(s.haze || [222, 222, 210]));
      gl.uniform3fv(u.uMistLit, rgb(s.mistLit || [248, 246, 238]));
      gl.uniform3fv(u.uMistShade, rgb(s.mistShade || [214, 216, 210]));
      gl.uniform3fv(u.uGlow, rgb(s.glow || [255, 244, 220]));
    }

    return {
      gl, soft, slow, uint: !!uint,
      piece: (ground, o) => piece(ground, o),
      mist: (ground, o) => mist(ground, o),
      quiet,
      size(w, h, r) {
        W = w; H = h; ratio = r;
        canvas.width = Math.max(1, Math.round(w * r)); canvas.height = Math.max(1, Math.round(h * r));
      },
      clear(c) {
        gl.viewport(0, 0, canvas.width, canvas.height);
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
        gl.uniform3fv(skyP.u.uLens, [cam.cx, cam.cy, cam.S * cam.eye]);
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
        const M = matrix(cam, W, H);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        const ground = () => {
          gl.useProgram(groundP.p);
          common(groundP, cam, look);
          const u = groundP.u;
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
        gl.enable(gl.BLEND);
        // The specks, over it, hidden where the surface stands in front.
        if (p.dots.count) {
          gl.useProgram(speckP.p);
          common(speckP, cam, look);
          gl.depthMask(false);
          gl.uniformMatrix4fv(speckP.u.uM, false, M);
          gl.uniform1f(speckP.u.uEye, cam.eye);
          gl.uniform1f(speckP.u.uPx, (look.speck == null ? 0.6 : look.speck) * ratio);
          gl.uniform4fv(speckP.u.uWorld, [p.scale / G.SQ, (p.centre[0] - G.cu) / G.SQ, (p.centre[1] - G.cv) / G.SQ, p.lift]);
          attrib(speckP, "aPos", p.dots.pos, 3);
          attrib(speckP, "aCol", p.dots.col, 4, gl.UNSIGNED_BYTE, true);
          attrib(speckP, "aSA", p.dots.sa, 2);
          gl.drawArrays(gl.POINTS, 0, p.dots.count);
          off(speckP);
          gl.depthMask(true);
        }
      },
      /** The mist, over everything drawn, hidden where the ground stands in front of it. */
      drawMist(m, cam, look = {}) {
        if (!G || !m || !m.count || !textures.heights) return;
        const M = matrix(cam, W, H), R = turnOf(cam);
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
      dispose() { Object.values(textures).forEach((t) => t && t.constructor && t instanceof WebGLTexture && gl.deleteTexture(t)); },
    };
  }

  window.TepeGL = { ground, make, project, matrix, eyeOf, software };
})();

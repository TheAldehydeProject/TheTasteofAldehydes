// ============================================================
// OM PARFUMS — houses/om-parfums.html
//
// The tenth house. The owner, 2026-10-10: "something that feels expansive
// while being minimalist ... minimalist but INCREDIBLY complex. I want the
// interaction to make it simple ... making the page fragmented, and then
// when you interact with it, it kinda shifts together again and starts
// being coherent ... with smooth animations, particles, and something
// geometric ... like the fragments in Dr strange movies ... On the phone
// version ... something that happens automatically given a slight delay".
// And a day later, 2026-10-11: "i want the fracturing to not be scroll
// dependent, and i want it to be soemthing that is less severe. when
// hovered, the fracturing returns to normal permanently. also please
// smooth the om parfums page out, it slows down the laptop A LOT!"
//
//   THE FRACTURE  the page opens CRACKED, as a pane is: the window broken
//                 into a few large shards radiating from a point a little
//                 above its middle, each shard — the page's own writing
//                 in it — standing a few pixels off its place, a degree or
//                 two out of true and a little back in depth, drifting
//                 slightly, its edges gold; through the cracks, the void —
//                 โอม in specks, a ring throwing off sparks. It was the
//                 page thrown far apart for a day, a tunnel of shards some
//                 turned over, and brought together by a click, a key or
//                 the wheel; less severe now, and scrolling does nothing
//                 to it (the page is held while it is in pieces).
//   THE MENDING   the hand moving over the page mends it, FOR GOOD: the
//                 shards come home in a wave from where the hand first
//                 moved, the nearest first, their seams flashing gold as
//                 they meet. A click, a tap or a key does the same. ON A
//                 PHONE, where nothing hovers, they come together by
//                 themselves a moment after the page opens.
//   THE SHARDS    are the page itself: each holds a copy of the page —
//                 only as much of it as the window shows — cut to its
//                 shard with a clip-path, laid over the page (which is
//                 there all along, held back underneath, so the search, a
//                 screen reader and the tests read the page and never the
//                 copies). The copies live in a CLOSED shadow root, inert,
//                 with no ids, so nothing else on the page can find them —
//                 and they go once it is whole.
//   โอม           the Thai spelling of Om, which the owner asked for "in
//                 the house shattering thing for the design": its letters
//                 from a real Thai typeface (om-glyph.js, written by
//                 tools/om/glyph.py), drawn as an outline of specks with
//                 each letter's HEAD — the small loop a Thai letter begins
//                 with — made a perfect circle with its centre marked, on
//                 the hairlines a type designer draws (the baseline, the
//                 x-height, the top of the tall letter).
//   THE GROUND    behind the page once it is whole, and the same drawing
//                 the void is made of: an armillary — rings tilted in
//                 three dimensions, each turning on its own axis, ticked,
//                 specks travelling them — round interlocking triangles
//                 (after the yantras drawn with Om at their centre), two
//                 rings of lotus petals, a twelve-pointed star, and dust
//                 far off in depth. Expansive: the outer rings reach past
//                 the window. Gold hairlines on near-black. It turns a
//                 little as the page is scrolled — "the passing of time".
//   THE LENS      what answers the hand: a hexagonal shard of glass
//                 follows the pointer a beat behind it, and inside it the
//                 drawing is seen turned and brought closer, brighter, as
//                 through a piece of the mirror. A tap puts it there.
//
// READABILITY. Every line is a hairline at a low alpha, and over the column
// of writing the whole drawing is kept at a third of itself, soft at the
// column's edges — and it is DRAWN quiet there: THE PEN cuts every hairline
// into short pieces and sorts them by where they stand across the window
// into a few levels of quiet, each stroked once in a plain colour (`line`,
// `poly`, `stroke`), and every speck is drawn at the quiet of where it
// stands (`quietAt`). (A gradient stroke was tried, and was slower.) It was a mask
// painted over every finished frame, the whole window read and written
// again sixty times a second, and that was what slowed a laptop down (16
// frames a second on the test machine, against 58 without it); a mask in
// the stylesheet was tried, and cost a third of that again. While the page
// is cracked nothing is quiet, and it comes to its third as the page mends.
//
// WITHOUT THIS SCRIPT, or with reduced motion, the page is whole from the
// first frame, on its dark ground, and the drawing (with reduced motion)
// stands still. The fracture is never put on a page opened at one
// fragrance (an address with a #), and `?om=whole` turns it off.
//
// (Outsider Parfums, the sister house, was drawn by this script for its
// first day, in its own colours and with a reflected twin in place of the
// fracture. Since 2026-10-11 it has a door of its own — outsider.js.)
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
  if (!ink) return;

  const root = document.documentElement;
  const page = document.body;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TOUCH = window.matchMedia("(hover: none)").matches;
  const GLYPH = window.OM_GLYPH || null;

  // ============================================================
  // TUNING
  // ============================================================
  const SEED = 40210;
  const COLUMN = 940;              // the writing's measure
  const QUIET = 0.3;               // what is left of the drawing over the column
  const SOFT = 120;                // px outside the column it eases in over

  // THE COLOURS — light added to a dark ground.
  const LINE = [216, 176, 106];    // the hairlines
  const SPECK = [246, 228, 190];   // the specks
  const SECOND = [255, 214, 150];  // pale fire
  const LINE_A = 0.15;             // how strongly a hairline is drawn

  // THE ARMILLARY: rings of R (half the window's shorter side), each
  // tilted out of the window's plane by `tilt` (radians) about an axis
  // that itself turns (`spin`, radians a second), breathing by `sway`.
  const RINGS = [
    { r: 0.21, tilt: 1.10, axis: 0.3, spin: 0.050, sway: 0.12, ticks: 24, dash: 0 },
    { r: 0.29, tilt: 0.70, axis: 1.9, spin: -0.034, sway: 0.10, ticks: 0, dash: 4 },
    { r: 0.40, tilt: 1.28, axis: 2.6, spin: 0.026, sway: 0.09, ticks: 60, dash: 0 },
    { r: 0.55, tilt: 0.40, axis: 0.9, spin: -0.020, sway: 0.08, ticks: 0, dash: 0 },
    { r: 0.70, tilt: 1.00, axis: 2.1, spin: 0.015, sway: 0.07, ticks: 96, dash: 0 },
    { r: 0.88, tilt: 0.22, axis: 0.5, spin: -0.011, sway: 0.06, ticks: 0, dash: 8 },
    { r: 1.10, tilt: 1.18, axis: 1.4, spin: 0.008, sway: 0.05, ticks: 144, dash: 0 },
    { r: 1.38, tilt: 0.62, axis: 2.9, spin: -0.006, sway: 0.04, ticks: 0, dash: 2 },
    { r: 1.72, tilt: 0.95, axis: 0.1, spin: 0.004, sway: 0.03, ticks: 180, dash: 0 },
  ];
  const ORBIT_EACH = 46;           // specks on a ring, per R of its radius
  const DUST = 300;                // the far dust
  const SCROLL_TURN = 0.00035;     // radians the drawing turns per px scrolled

  // THE LENS — the shard of glass at the hand.
  const LENS = 92;                 // its radius, px
  const LENS_LAG = 0.14;           // how far it closes on the hand each frame
  const LENS_TURN = 0.16;          // how far the drawing is turned inside it
  const LENS_NEAR = 1.14;          // and how much nearer

  // THE FRACTURE — a few large shards, a little out of place. (Fifty-one,
  // thrown far apart, for its first day.)
  const SHARD_RINGS_WIDE = [[0.22, 4], [0.55, 6], [0.98, 7]];
  const SHARD_RINGS_NARROW = [[0.26, 3], [0.72, 5]];
  const MOVE_PX = 4;               // the hand must move this far to count as hovering
  const MEND_MS = 1100;            // how long one shard takes to come home
  const MEND_SPREAD = 760;         // and the most it waits, the farthest from the hand last
  const SEAM_MS = 700;             // the seams' flash fading, once home
  const AUTO_MS = 1500;            // on a phone, how long it stays cracked
  const HINT_MS = 2600;            // on a desktop, when the word comes up
  const SPARKS = 26;               // sparks thrown off the portal a second

  let seed = SEED;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const between = (a, b) => a + (b - a) * random();
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const rgba = (c, a) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a.toFixed(3) + ")";

  // ============================================================
  // THE QUIET — over the column the drawing is kept at QUIET of itself
  // (by `hush`, 0 while the page is cracked to 1 once it is whole): whole
  // SOFT px outside the column, quiet 0.6 × SOFT inside it. `stops` is
  // that, across the window, and `quietAt` is it at one x.
  // ============================================================
  let hush = 1, stops = null, keepNow = 1;
  function quietStops() {
    const keep = 1 - (1 - QUIET) * hush;
    const edge = W > COLUMN ? (W - COLUMN) / 2 : 0;
    const soft = Math.min(SOFT, W * 0.14);
    if (keep > 0.999) return [[0, 1], [1, 1]];
    if (edge <= soft) return [[0, keep], [1, keep]];
    const at = (x) => clamp(x / W, 0, 1);
    return [[0, 1], [at(edge - soft), 1], [at(edge + soft * 0.6), keep], [at(W - edge - soft * 0.6), keep], [at(W - edge + soft), 1], [1, 1]];
  }
  function quietAt(x) {
    const f = x / W;
    for (let i = 1; i < stops.length; i++) {
      if (f <= stops[i][0]) {
        const [f0, k0] = stops[i - 1], [f1, k1] = stops[i];
        return f1 > f0 ? k0 + (k1 - k0) * clamp((f - f0) / (f1 - f0), 0, 1) : k1;
      }
    }
    return stops[stops.length - 1][1];
  }

  // ============================================================
  // THE PEN — so the quiet costs nothing to draw: every hairline is laid
  // down in short pieces (`line`, `poly`, a dash pattern walked by hand),
  // each piece kept in one of LEVELS stacks by the quiet of where it
  // stands, and each stack stroked at once, in a plain colour (`stroke`).
  // The quiet changes only across the window, so a piece is cut only by
  // how far across it runs.
  // ============================================================
  const LEVELS = 6;
  const PIECE = 36;                // px across, the longest piece
  const stacks = Array.from({ length: LEVELS }, () => []);
  function piece(x0, y0, x1, y1) {
    let k = LEVELS - 1;
    if (keepNow < 0.999) k = Math.round(((quietAt((x0 + x1) / 2) - keepNow) / (1 - keepNow)) * (LEVELS - 1));
    stacks[clamp(k, 0, LEVELS - 1)].push(x0, y0, x1, y1);
  }
  function line(x0, y0, x1, y1) {
    const n = keepNow < 0.999 ? Math.max(1, Math.ceil(Math.abs(x1 - x0) / PIECE)) : 1;
    for (let i = 0; i < n; i++) {
      const a = i / n, b = (i + 1) / n;
      piece(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a, x0 + (x1 - x0) * b, y0 + (y1 - y0) * b);
    }
  }
  /** A polyline (flat x, y, x, y …), whole, or dashed `[on, off]` from
      `offset` along it. */
  function poly(p, dash, offset) {
    if (!dash) { for (let i = 2; i < p.length; i += 2) line(p[i - 2], p[i - 1], p[i], p[i + 1]); return; }
    const on = dash[0], period = dash[0] + dash[1];
    let at = (((offset || 0) % period) + period) % period;
    for (let i = 2; i < p.length; i += 2) {
      const x0 = p[i - 2], y0 = p[i - 1], x1 = p[i], y1 = p[i + 1];
      const L = Math.hypot(x1 - x0, y1 - y0);
      let s = 0;
      while (L - s > 1e-6) {
        const lit = at < on;
        const left = lit ? on - at : period - at;
        // At a boundary already (the arithmetic can leave a hair short of
        // one): step over it rather than take a step of nothing.
        if (left < 1e-6) { at = lit ? on : 0; continue; }
        const e = Math.min(L, s + left);
        if (lit) line(x0 + ((x1 - x0) * s) / L, y0 + ((y1 - y0) * s) / L, x0 + ((x1 - x0) * e) / L, y0 + ((y1 - y0) * e) / L);
        at = e - s >= left ? (lit ? on : 0) : at + (e - s);
        s = e;
      }
    }
  }
  /** An ellipse's arc as a polyline: centre, radii, its turn, from a0 to a1. */
  function arcPts(cx, cy, rx, ry, phi, a0, a1) {
    const n = clamp(Math.ceil((Math.abs(a1 - a0) * Math.max(rx, ry)) / 10), 12, 420);
    const ca = Math.cos(phi), sa = Math.sin(phi), out = new Array((n + 1) * 2);
    for (let i = 0; i <= n; i++) {
      const th = a0 + ((a1 - a0) * i) / n, u = rx * Math.cos(th), v = ry * Math.sin(th);
      out[2 * i] = cx + u * ca - v * sa;
      out[2 * i + 1] = cy + u * sa + v * ca;
    }
    return out;
  }
  /** Everything laid down since the last stroke, in a colour at an alpha. */
  function stroke(c, a) {
    for (let k = 0; k < LEVELS; k++) {
      const st = stacks[k];
      if (!st.length) continue;
      const level = keepNow + ((1 - keepNow) * k) / (LEVELS - 1);
      ink.strokeStyle = rgba(c, clamp(a * level, 0, 1));
      ink.beginPath();
      let lx = NaN, ly = NaN;
      for (let i = 0; i < st.length; i += 4) {
        if (st[i] !== lx || st[i + 1] !== ly) ink.moveTo(st[i], st[i + 1]);
        ink.lineTo(st[i + 2], st[i + 3]);
        lx = st[i + 2]; ly = st[i + 3];
      }
      ink.stroke();
      st.length = 0;
    }
  }

  // ============================================================
  // THE SPECKS, BUILT ONCE — in the drawing's own units (R), so a resize
  // only rescales them.
  // ============================================================
  const NARROW = window.innerWidth < 700;
  const orbit = [];                // { ring, at, speed, size, base }
  RINGS.forEach((ring, k) => {
    const n = Math.round(ring.r * ORBIT_EACH * (NARROW ? 0.6 : 1));
    for (let i = 0; i < n; i++) {
      orbit.push({ ring: k, at: random() * Math.PI * 2, speed: between(0.02, 0.07) * (random() < 0.5 ? -1 : 1) / Math.sqrt(ring.r),
        size: between(0.8, 1.9), base: between(0.25, 0.85), phase: random() });
    }
  });
  const dust = [];
  for (let i = 0; i < Math.round(DUST * (NARROW ? 0.55 : 1)); i++) {
    // In a shell from just outside the yantra to well past the window.
    const u = random() * 2 - 1, a = random() * Math.PI * 2, r = between(0.5, 2.1);
    const s = Math.sqrt(1 - u * u);
    dust.push({ x: r * s * Math.cos(a), y: r * u, z: r * s * Math.sin(a), size: between(0.6, 1.6), base: between(0.15, 0.6), phase: random() });
  }
  const sparks = [];               // { a, r, v, life, born } — the portal's

  // ============================================================
  // SIZING
  // ============================================================
  let W = 0, H = 0, R = 0, ratio = 1;
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    R = Math.min(W, H) * 0.5;
    ratio = Math.min(W < 700 ? 1.5 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * ratio);
    canvas.height = Math.round(H * ratio);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
  }

  // ============================================================
  // DRAWING THE GEOMETRY — every piece of it a function of the frame's
  // turn `spin` and its clock `t`, so the lens can draw it again turned.
  // ============================================================
  /** A ring's ellipse on the window: its axis angle and tilt now. */
  function ringNow(ring, t) {
    const phi = ring.axis + ring.spin * t;
    const tau = ring.tilt + ring.sway * Math.sin(t * 0.07 + ring.axis * 3);
    return { phi, tau, cos: Math.cos(tau), sin: Math.sin(tau) };
  }
  /** A point at angle `th` round a ring, and how near the eye (−1..1). */
  function onRing(cx, cy, r, now, th) {
    const ca = Math.cos(now.phi), sa = Math.sin(now.phi);
    const u = r * Math.cos(th), v = r * Math.sin(th) * now.cos;
    return { x: cx + u * ca - v * sa, y: cy + u * sa + v * ca, z: Math.sin(th) * now.sin };
  }

  function drawRings(cx, cy, turn, t, alpha) {
    ink.lineWidth = 1;
    RINGS.forEach((ring) => {
      const r = ring.r * R;
      const now = ringNow(ring, t);
      const phi = now.phi + turn;
      const ry = Math.max(0.5, r * Math.abs(now.cos));
      const back = now.sin >= 0 ? [Math.PI, Math.PI * 2] : [0, Math.PI];
      const front = now.sin >= 0 ? [0, Math.PI] : [Math.PI, Math.PI * 2];
      const dash = ring.dash ? [ring.dash, ring.dash * 2.4] : null;
      poly(arcPts(cx, cy, r, ry, phi, back[0], back[1]), dash);
      stroke(LINE, LINE_A * alpha * 0.45);
      poly(arcPts(cx, cy, r, ry, phi, front[0], front[1]), dash);
      stroke(LINE, LINE_A * alpha);
      if (!ring.ticks) return;
      // THE TICKS, every one radial in the ring's own plane, the long
      // ones every fifth.
      const turned = { phi: phi, cos: now.cos, sin: now.sin };
      for (let k = 0; k < ring.ticks; k++) {
        const th = (k / ring.ticks) * Math.PI * 2;
        const len = k % 5 === 0 ? 9 : 4;
        const a = onRing(cx, cy, r, turned, th), b = onRing(cx, cy, r + len, turned, th);
        if (a.z < 0) continue;
        line(a.x, a.y, b.x, b.y);
      }
      stroke(LINE, LINE_A * alpha * 0.9);
    });
  }

  /** The yantra: four triangles up and five down, interlocking, after the
      Sri Yantra — the diagram drawn with Om at its middle. */
  function drawTriangles(cx, cy, turn, t, alpha) {
    ink.lineWidth = 1;
    const tri = (s, dy, down, rot) => {
      const p = [];
      for (let k = 0; k <= 3; k++) {
        const a = rot + (down ? Math.PI / 2 : -Math.PI / 2) + (k * Math.PI * 2) / 3;
        p.push(cx + Math.cos(a) * s * R, cy + dy * R + Math.sin(a) * s * R);
      }
      poly(p);
    };
    const rot = turn + t * 0.006;
    [[0.60, -0.05], [0.47, 0.03], [0.35, 0.08], [0.24, -0.02]].forEach(([s, dy]) => tri(s, dy, false, rot));
    [[0.64, 0.05], [0.51, -0.03], [0.39, -0.07], [0.28, 0.02], [0.17, 0.0]].forEach(([s, dy]) => tri(s, dy, true, rot));
    stroke(LINE, LINE_A * alpha * 1.1);
  }

  /** The lotus: two rings of petals, each a pointed arch. */
  function drawLotus(cx, cy, turn, t, alpha) {
    ink.lineWidth = 1;
    const quad = (x0, y0, qx, qy, x1, y1, out) => {
      for (let i = 1; i <= 8; i++) {
        const f = i / 8, g = 1 - f;
        out.push(g * g * x0 + 2 * g * f * qx + f * f * x1, g * g * y0 + 2 * g * f * qy + f * f * y1);
      }
    };
    [[8, 0.66, 0.80, 0.0], [16, 0.80, 0.95, Math.PI / 16]].forEach(([n, r0, r1, off]) => {
      for (let k = 0; k < n; k++) {
        const a = turn * 0.5 - t * 0.003 + off + (k / n) * Math.PI * 2;
        const half = Math.PI / n;
        const x0 = cx + Math.cos(a - half) * r0 * R, y0 = cy + Math.sin(a - half) * r0 * R;
        const x1 = cx + Math.cos(a + half) * r0 * R, y1 = cy + Math.sin(a + half) * r0 * R;
        const tx = cx + Math.cos(a) * r1 * R, ty = cy + Math.sin(a) * r1 * R;
        const mx = cx + Math.cos(a) * (r0 + (r1 - r0) * 0.7) * R, my = cy + Math.sin(a) * (r0 + (r1 - r0) * 0.7) * R;
        const p = [x0, y0];
        quad(x0, y0, (x0 + mx) / 2 + (mx - cx) * 0.06, (y0 + my) / 2 + (my - cy) * 0.06, tx, ty, p);
        quad(tx, ty, (x1 + mx) / 2 + (mx - cx) * 0.06, (y1 + my) / 2 + (my - cy) * 0.06, x1, y1, p);
        poly(p);
      }
    });
    stroke(LINE, LINE_A * alpha * 0.85);
  }

  /** The twelve-pointed star, {12/5}, far out. */
  function drawStar(cx, cy, turn, t, alpha) {
    ink.lineWidth = 1;
    const n = 12, step = 5, r = R;
    const rot = -turn * 0.4 + t * 0.002;
    const p = [];
    for (let k = 0; k <= n; k++) {
      const a = rot + ((k * step) % n) / n * Math.PI * 2;
      p.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    poly(p);
    stroke(LINE, LINE_A * alpha * 0.6);
  }

  function drawSpecks(cx, cy, turn, t, alpha, hx, hy) {
    ink.fillStyle = rgba(SPECK, 1);
    orbit.forEach((s) => {
      const ring = RINGS[s.ring];
      const now = ringNow(ring, t);
      const turned = { phi: now.phi + turn, cos: now.cos, sin: now.sin };
      const p = onRing(cx, cy, ring.r * R, turned, s.at + s.speed * t);
      if (p.x < -4 || p.x > W + 4 || p.y < -4 || p.y > H + 4) return;
      const depth = 0.55 + 0.45 * p.z;
      let lit = 1;
      if (hx > -9000) {
        const d = Math.hypot(p.x - hx, p.y - hy);
        if (d < 160) lit += 1.6 * (1 - d / 160);
      }
      const tw = REDUCE ? 1 : 0.8 + 0.2 * Math.sin((t * 0.5 + s.phase) * Math.PI * 2);
      ink.globalAlpha = clamp(s.base * depth * tw * lit * alpha * quietAt(p.x), 0, 1);
      const z = s.size * (0.7 + 0.5 * depth);
      ink.fillRect(p.x - z / 2, p.y - z / 2, z, z);
    });
    // THE DUST, far off, turning slowly in depth.
    const a = t * 0.012 + turn * 0.5, ca = Math.cos(a), sa = Math.sin(a);
    const F = 2.6;
    dust.forEach((d) => {
      const x = d.x * ca - d.z * sa, z = d.x * sa + d.z * ca;
      const k = F / (F + z);
      const px = cx + x * R * k, py = cy + d.y * R * k;
      if (px < 0 || px > W || py < 0 || py > H) return;
      const tw = REDUCE ? 1 : 0.7 + 0.3 * Math.sin((t * 0.3 + d.phase) * Math.PI * 2);
      ink.globalAlpha = clamp(d.base * k * 0.7 * tw * alpha * quietAt(px), 0, 1);
      const sz = d.size * k;
      ink.fillRect(px, py, sz, sz);
    });
    ink.globalAlpha = 1;
  }

  /** Everything but the word, at a centre, turned by `turn`. */
  function drawWorld(cx, cy, turn, t, alpha, hx, hy) {
    drawRings(cx, cy, turn, t, alpha);
    drawStar(cx, cy, turn, t, alpha);
    drawLotus(cx, cy, turn, t, alpha);
    drawTriangles(cx, cy, turn, t, alpha);
    ink.globalCompositeOperation = "lighter";
    drawSpecks(cx, cy, turn, t, alpha, hx, hy);
    ink.globalCompositeOperation = "source-over";
  }

  // ============================================================
  // THE WORD — โอม
  // ============================================================
  /** The word's specks, at a centre and a size (px per x-height). */
  function drawWord(cx, cy, scale, t, alpha, hx, hy) {
    if (alpha < 0.004 || !GLYPH) return;
    const box = GLYPH.box;
    const oy = cy - ((box[1] + box[3]) / 2) * scale;
    const X = (x) => cx + x * scale, Y = (y) => oy + y * scale;
    // THE CONSTRUCTION: the baseline, the x-height, the top of the tall
    // letter, run out past the word.
    ink.lineWidth = 1;
    const left = X(box[0]) - scale * 0.5, right = X(box[2]) + scale * 0.5;
    [0, 1, box[1]].forEach((y) => poly([left, Y(y), right, Y(y)], [2, 5]));
    stroke(LINE, 0.22 * alpha);
    // THE HEADS: perfect circles, their centres crossed.
    GLYPH.letters.forEach((L) => L.heads.forEach(([x, y, r]) => {
      poly(arcPts(X(x), Y(y), r * scale, r * scale, 0, 0, Math.PI * 2));
      const c = r * scale * 0.45;
      line(X(x) - c, Y(y), X(x) + c, Y(y));
      line(X(x), Y(y) - c, X(x), Y(y) + c);
    }));
    stroke(LINE, 0.75 * alpha);
    GLYPH.letters.forEach((L) => L.heads.forEach(([x, y, r]) => poly(arcPts(X(x), Y(y), r * scale * 1.9, r * scale * 1.9, 0, 0, Math.PI * 2))));
    stroke(LINE, 0.16 * alpha);
    // THE OUTLINE, in specks — a brightness travelling along each stroke.
    ink.globalCompositeOperation = "lighter";
    ink.fillStyle = rgba(SPECK, 1);
    const size = Math.max(1, scale * 0.016);
    GLYPH.letters.forEach((L, li) => L.contours.forEach((c, ci) => {
      const n = c.length / 2;
      for (let i = 0; i < n; i++) {
        let x = X(c[2 * i]), y = Y(c[2 * i + 1]);
        if (!REDUCE) {
          x += Math.sin(t * 1.3 + i * 0.7 + ci) * 0.6;
          y += Math.cos(t * 1.1 + i * 0.5 + li) * 0.6;
        }
        if (hx > -9000) {
          const dx = x - hx, dy = y - hy, d = Math.hypot(dx, dy);
          if (d < 90 && d > 0.1) { const push = (1 - d / 90) * 10; x += (dx / d) * push; y += (dy / d) * push; }
        }
        const run = REDUCE ? 0.6 : 0.5 + 0.5 * Math.sin((i / n) * Math.PI * 4 - t * 1.6 + li * 1.3);
        ink.globalAlpha = clamp((0.35 + 0.65 * run) * alpha * quietAt(x), 0, 1);
        ink.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }));
    ink.globalAlpha = 1;
    ink.globalCompositeOperation = "source-over";
  }

  // ============================================================
  // THE PORTAL'S SPARKS — while the page is cracked. Thrown off the rim
  // of a ring round the word, tangentially, as a sling ring's are.
  // ============================================================
  function drawSparks(cx, cy, rr, t, dt, alpha, throwing) {
    if (!REDUCE && throwing > 0) {
      const want = SPARKS * throwing * dt;
      for (let k = 0; k < want + (random() < want % 1 ? 1 : 0) - (want % 1); k++) {
        const a = random() * Math.PI * 2;
        sparks.push({ a, r: rr, v: between(60, 190), out: between(-20, 50), life: between(0.5, 1.3), age: 0 });
      }
    }
    ink.globalCompositeOperation = "lighter";
    ink.lineWidth = 1.2;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.age += dt;
      if (s.age > s.life) { sparks.splice(i, 1); continue; }
      const f = s.age / s.life;
      const dir = s.a + Math.PI / 2;     // tangent, turning with the ring
      const x0 = cx + Math.cos(s.a) * s.r, y0 = cy + Math.sin(s.a) * s.r;
      const go = s.v * s.age, out = s.out * s.age;
      const x = x0 + Math.cos(dir) * go + Math.cos(s.a) * out, y = y0 + Math.sin(dir) * go + Math.sin(s.a) * out;
      const tail = 0.05 * s.v;
      ink.strokeStyle = rgba(f < 0.4 ? SECOND : LINE, (1 - f) * 0.9 * alpha * quietAt(x));
      ink.beginPath();
      ink.moveTo(x - Math.cos(dir) * tail, y - Math.sin(dir) * tail);
      ink.lineTo(x, y);
      ink.stroke();
    }
    ink.globalCompositeOperation = "source-over";
    // The ring itself, two dashed circles turning against each other.
    ink.lineWidth = 1.4;
    poly(arcPts(cx, cy, rr, rr, 0, 0, Math.PI * 2), [14, 9], t * 40);
    stroke(SECOND, 0.55 * alpha);
    poly(arcPts(cx, cy, rr * 1.06, rr * 1.06, 0, 0, Math.PI * 2), [3, 11], -t * 26);
    stroke(LINE, 0.45 * alpha);
  }

  // ============================================================
  // THE LENS — a hexagon of glass at the hand.
  // ============================================================
  let handX = -99999, handY = -99999, handOn = 0, lensX = -99999, lensY = -99999;
  function drawLens(cx, cy, turn, t, alpha) {
    if (handOn < 0.01 || lensX < -9000) return;
    const rot = t * 0.15;
    const hex = (r) => {
      ink.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = rot + (k / 6) * Math.PI * 2;
        const x = lensX + Math.cos(a) * r, y = lensY + Math.sin(a) * r * 0.92;
        if (k === 0) ink.moveTo(x, y); else ink.lineTo(x, y);
      }
      ink.closePath();
    };
    ink.save();
    hex(LENS);
    ink.clip();
    // Seen through the glass: the drawing turned and brought nearer,
    // about the lens's own middle.
    ink.translate(lensX, lensY);
    ink.scale(LENS_NEAR, LENS_NEAR);
    ink.translate(-lensX, -lensY);
    drawWorld(cx, cy, turn + LENS_TURN, t, alpha * handOn * 1.7, -99999, -99999);
    ink.restore();
    ink.lineWidth = 1;
    const rim = (r) => {
      const p = [];
      for (let k = 0; k <= 6; k++) {
        const a = rot + (k / 6) * Math.PI * 2;
        p.push(lensX + Math.cos(a) * r, lensY + Math.sin(a) * r * 0.92);
      }
      poly(p);
    };
    rim(LENS); stroke(LINE, 0.5 * handOn * alpha);
    rim(LENS * 0.82); stroke(SECOND, 0.18 * handOn * alpha);
  }

  // ============================================================
  // THE FRACTURE — the page cracked, laid over it in a closed shadow
  // root, and mended by the hand.
  // ============================================================
  const shattered = root.classList.contains("om-shattered");
  let gather = shattered ? 0 : 1;          // 0 cracked, 1 whole (eased, per frame)
  let gatherAt = 0;                        // when the mending began (ms), or 0
  let shards = [];
  let host = null, stage = null, hint = null;
  let pieces = shattered ? "pieces" : "whole";
  root.dataset.om = pieces;

  function polygonArea(p) {
    let a = 0;
    for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; a += p[i][0] * q[1] - q[0] * p[i][1]; }
    return a / 2;
  }
  /** The window's cell nearest seed i: the rectangle cut by the bisector
      to every other seed (a Voronoi cell, by halving). */
  function cellOf(i, seeds, w, h) {
    let poly = [[0, 0], [w, 0], [w, h], [0, h]];
    const [sx, sy] = seeds[i];
    for (let j = 0; j < seeds.length && poly.length; j++) {
      if (j === i) continue;
      const [tx, ty] = seeds[j];
      const nx = tx - sx, ny = ty - sy, mx = (sx + tx) / 2, my = (sy + ty) / 2;
      const side = (p) => (p[0] - mx) * nx + (p[1] - my) * ny;   // <= 0 keeps
      const out = [];
      for (let k = 0; k < poly.length; k++) {
        const p = poly[k], q = poly[(k + 1) % poly.length];
        const a = side(p), b = side(q);
        if (a <= 0) out.push(p);
        if ((a <= 0) !== (b <= 0)) {
          const f = a / (a - b);
          out.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]);
        }
      }
      poly = out;
    }
    return poly;
  }

  /** The copy, cut down to what the window shows: whatever stands wholly
      below the window is taken out of it, as deep as it has to go — which
      moves nothing above it — so no shard carries the whole page. */
  function trim(original, copy, depth) {
    const kids = Array.from(original.children), copies = Array.from(copy.children);
    if (kids.length !== copies.length) return;
    const foot = window.innerHeight + 40;
    for (let i = kids.length - 1; i >= 0; i--) {
      const r = kids[i].getBoundingClientRect();
      if (r.top > foot) copies[i].remove();
      else if (depth < 5 && r.bottom > foot && kids[i].children.length) trim(kids[i], copies[i], depth + 1);
    }
  }

  function buildShards() {
    const w = root.clientWidth, h = window.innerHeight;
    const P = [w * 0.5, h * 0.44];
    const D = Math.hypot(w, h) * 0.5;
    const seeds = [P];
    const rings = w < 700 ? SHARD_RINGS_NARROW : SHARD_RINGS_WIDE;
    rings.forEach(([f, n], k) => {
      for (let j = 0; j < n; j++) {
        const a = ((j + 0.5 + (random() - 0.5) * 0.6) / n) * Math.PI * 2 + k * 0.53;
        const r = f * D * between(0.88, 1.12);
        seeds.push([P[0] + Math.cos(a) * r, P[1] + Math.sin(a) * r * 0.86]);
      }
    });

    // THE PAGE'S FLOW, copied once — only what the window shows of it —
    // without an id, a tab stop or anything else that could be found or
    // reached.
    const flow = document.createElement("div");
    flow.className = "human-page om-page om-flow";
    document.querySelectorAll("body > main, body > .house-credit, body > .human-foot").forEach((el) => {
      if (el.getBoundingClientRect().top > h + 40) return;
      const copy = el.cloneNode(true);
      trim(el, copy, 0);
      flow.appendChild(copy);
    });
    flow.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    flow.querySelectorAll("[aria-labelledby]").forEach((el) => el.removeAttribute("aria-labelledby"));
    flow.querySelectorAll("a, button, summary, input, [tabindex]").forEach((el) => el.setAttribute("tabindex", "-1"));

    host = document.createElement("div");
    host.className = "om-shards dark-surface";
    host.setAttribute("aria-hidden", "true");
    const shadow = host.attachShadow({ mode: "closed" });
    const gold = LINE.join(" ");
    shadow.innerHTML =
      '<link rel="stylesheet" href="' + (window.SITE_ROOT || "") + 'style.css">' +
      "<style>" +
      ".stage{position:absolute;inset:0;overflow:hidden;pointer-events:none;transition:opacity 700ms cubic-bezier(0.3,0,0.2,1)}" +
      ".stage.gone{opacity:0}" +
      ".field{position:absolute;inset:0}" +
      ".shard{position:absolute;will-change:transform;transform-origin:var(--ox) var(--oy)}" +
      // A shard is glass with the page in it: the void behind it seen
      // through dimly, and clearly only through the cracks.
      ".shard>.om-flow{position:absolute;margin:0;background:rgba(12,11,15,0.66)}" +
      ".sheen{position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,240,214,0.01) 0%,rgba(255,240,214,0.04) 40%,rgba(255,240,214,0.1) 50%,rgba(255,240,214,0.02) 62%,rgba(255,240,214,0.01) 100%)}" +
      ".edge{position:absolute;left:0;top:0;overflow:visible}" +
      ".edge polygon{fill:none;stroke:rgb(" + gold + ");stroke-width:1;vector-effect:non-scaling-stroke}" +
      ".edge .glint{stroke:rgb(255 236 200);stroke-width:1.4;stroke-dasharray:26 1400;animation:glint 6.5s linear infinite;animation-delay:var(--delay,0s)}" +
      "@keyframes glint{to{stroke-dashoffset:-1426}}" +
      ".hint{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgb(" + gold + " / 0.85);opacity:0;transition:opacity 1.2s ease}" +
      ".hint.shown{opacity:1}" +
      ".hint i{display:block;width:9px;height:9px;border:1px solid currentColor;transform:rotate(45deg)}" +
      "</style>" +
      '<div class="stage" inert><div class="field"></div><p class="hint"><i></i>Hover to bring it together<i></i></p></div>';
    stage = shadow.querySelector(".stage");
    const field = shadow.querySelector(".field");
    hint = shadow.querySelector(".hint");
    if (TOUCH) hint.remove();

    shards = [];
    seeds.forEach((s, i) => {
      const poly = cellOf(i, seeds, w, h);
      if (poly.length < 3 || Math.abs(polygonArea(poly)) < 40) return;
      const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
      const bx = Math.floor(Math.min(...xs)), by = Math.floor(Math.min(...ys));
      const bw = Math.ceil(Math.max(...xs)) - bx, bh = Math.ceil(Math.max(...ys)) - by;
      let gx = 0, gy = 0;
      poly.forEach((p) => { gx += p[0]; gy += p[1]; });
      gx /= poly.length; gy /= poly.length;
      const local = poly.map((p) => [p[0] - bx, p[1] - by]);

      const el = document.createElement("div");
      el.className = "shard";
      el.style.left = bx + "px"; el.style.top = by + "px";
      el.style.width = bw + "px"; el.style.height = bh + "px";
      el.style.clipPath = "polygon(" + local.map((p) => p[0].toFixed(1) + "px " + p[1].toFixed(1) + "px").join(",") + ")";
      el.style.setProperty("--ox", (gx - bx).toFixed(1) + "px");
      el.style.setProperty("--oy", (gy - by).toFixed(1) + "px");
      const copy = flow.cloneNode(true);
      copy.style.left = -bx + "px";
      copy.style.top = -by + "px";
      copy.style.width = w + "px";
      copy.style.minHeight = h + "px";
      el.appendChild(copy);
      const sheen = document.createElement("div");
      sheen.className = "sheen";
      el.appendChild(sheen);
      const pts = local.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
      el.insertAdjacentHTML("beforeend",
        '<svg class="edge" width="' + bw + '" height="' + bh + '" viewBox="0 0 ' + bw + " " + bh + '"><polygon points="' + pts + '"/>' +
        (random() < 0.3 ? '<polygon class="glint" points="' + pts + '" style="--delay:-' + (random() * 6).toFixed(2) + 's"/>' : "") + "</svg>");
      field.appendChild(el);

      // WHERE IT STANDS: a few pixels out from the point it broke from, a
      // degree or so out of true, and a hair smaller, as if a little
      // further off — the middle ones a little more. Flat on the window:
      // in depth it was no gentler to look at and half as quick to draw.
      const dx = gx - P[0], dy = gy - P[1], dist = Math.hypot(dx, dy) || 1;
      // On a phone's narrow window, half as far again: there the same few
      // pixels are a larger part of a line of writing.
      const ux = dx / dist, uy = dy / dist, near = 1 - clamp(dist / D, 0, 1), g = w < 700 ? 0.5 : 1;
      shards.push({
        el, sheen, edge: el.querySelector(".edge polygon"), gx, gy,
        tx: ux * (3 + dist * 0.018 + random() * 7) * g,
        ty: uy * (3 + dist * 0.018 + random() * 7) * g,
        k: 1 - (0.008 + near * 0.022 + random() * 0.006) * g,
        rz: between(-1.3, 1.3) * g,
        phase: random() * Math.PI * 2,
        wait: 0, p: -1, sheenShown: -1, edgeShown: -1,
      });
    });
    page.insertBefore(host, canvas.nextSibling);
    root.classList.add("om-held");
  }

  /** Write a style only when it has changed enough to see. */
  function opacityTo(s, key, el, v) {
    if (!el || Math.abs(v - s[key]) < 0.004) return;
    s[key] = v;
    el.style.opacity = v.toFixed(3);
  }

  /** One frame of the shards: each where it stands, or on its way home. */
  function placeShards(now, t) {
    shards.forEach((s) => {
      let p = 0;
      if (gatherAt) p = ease(clamp((now - gatherAt - s.wait) / MEND_MS, 0, 1));
      if (p >= 1 && s.p >= 1 && now - gatherAt - s.wait - MEND_MS > SEAM_MS) return;   // home, and still
      s.p = p;
      const q = 1 - p;
      const bob = Math.sin(t * 0.6 + s.phase), sway = Math.cos(t * 0.45 + s.phase * 1.3);
      const tx = s.tx * q + bob * 1.6 * q, ty = s.ty * q + sway * 1.2 * q;
      const rz = (s.rz + sway * 0.25) * q, k = 1 - (1 - s.k + bob * 0.002) * q;
      s.el.style.transform = "translate(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px) rotate(" + rz.toFixed(3) + "deg) scale(" + k.toFixed(4) + ")";
      // The sheen catches as it turns; the seam flashes as it lands, and
      // fades once it is home.
      opacityTo(s, "sheenShown", s.sheen, clamp((0.45 + 0.35 * Math.sin(t * 0.5 + s.phase)) * q, 0, 1));
      let edge = 0.5 * q;
      if (gatherAt) {
        const landed = now - gatherAt - s.wait - MEND_MS;
        edge += p > 0.7 ? (landed < 0 ? (p - 0.7) / 0.3 : Math.max(0, 1 - landed / SEAM_MS)) : 0;
      }
      opacityTo(s, "edgeShown", s.edge, clamp(edge, 0, 1));
    });
  }

  /** The mending, from a point (where the hand moved, or pressed): the
      shards nearest it first, in a wave. */
  function mend(x, y) {
    if (gatherAt || !host) return;
    gatherAt = performance.now();
    const far = Math.hypot(window.innerWidth, window.innerHeight);
    shards.forEach((s) => { s.wait = clamp(Math.hypot(s.gx - x, s.gy - y) / far, 0, 1) * MEND_SPREAD; });
    pieces = "gathering";
    root.dataset.om = pieces;
    if (hint) hint.classList.remove("shown");
    // A last few sparks off the portal as it lets go.
    for (let k = 0; k < 40 && !REDUCE; k++) {
      sparks.push({ a: random() * Math.PI * 2, r: portalR(), v: between(80, 220), out: between(30, 120), life: between(0.5, 1.1), age: 0 });
    }
  }
  function wholeNow() {
    pieces = "whole";
    root.dataset.om = pieces;
    // The page under the pieces is the same page, laid out the same way,
    // so it is shown at once — with nothing of its own fading in — and
    // the pieces, now exactly over it, are faded off it.
    root.classList.add("om-landing");
    root.classList.remove("om-shattered");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.remove("om-landing");
      if (stage) stage.classList.add("gone");
      window.setTimeout(() => { if (host) host.remove(); host = stage = hint = null; shards = []; }, 760);
    }));
  }
  const portalR = () => Math.min(W * (W < 700 ? 0.46 : 0.36), 560) * 0.62;

  if (shattered) {
    buildShards();
    // HOVERING MENDS IT — the hand moving over the page, a few pixels at
    // least (a browser can send a move as the page appears under a hand
    // that is still). Not a finger: a phone mends by itself.
    let firstX = null, firstY = null;
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || gatherAt) return;
      if (firstX === null) { firstX = e.clientX; firstY = e.clientY; return; }
      if (Math.hypot(e.clientX - firstX, e.clientY - firstY) >= MOVE_PX) mend(e.clientX, e.clientY);
    }, { passive: true });
    window.addEventListener("pointerdown", (e) => mend(e.clientX, e.clientY), { passive: true });
    host.addEventListener("click", (e) => e.preventDefault());
    window.addEventListener("keydown", (e) => {
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      mend(window.innerWidth / 2, window.innerHeight * 0.44);
    });
    document.addEventListener("focusin", () => mend(window.innerWidth / 2, window.innerHeight * 0.44));
    // A window changing size breaks the pieces' geometry: it is simply
    // whole at once.
    window.addEventListener("resize", () => {
      if (pieces !== "pieces") return;
      mend(window.innerWidth / 2, window.innerHeight * 0.44);
      gatherAt -= MEND_MS + MEND_SPREAD;
    });
    if (TOUCH) window.setTimeout(() => mend(window.innerWidth / 2, window.innerHeight * 0.44), AUTO_MS);
    else window.setTimeout(() => { if (hint && !gatherAt) hint.classList.add("shown"); }, HINT_MS);
  }

  // ============================================================
  // KEEPING UP
  // ============================================================
  const hand = (event) => {
    handX = event.clientX; handY = event.clientY;
    if (lensX < -9000) { lensX = handX; lensY = handY; }
    if (REDUCE) frame(performance.now());
  };
  window.addEventListener("pointermove", hand, { passive: true });
  window.addEventListener("pointerdown", hand, { passive: true });
  document.addEventListener("pointerleave", () => { handX = -99999; handY = -99999; });
  window.addEventListener("resize", () => { size(); if (REDUCE) frame(performance.now()); });

  const began = performance.now();
  let last = began;
  function frame(now) {
    const t = REDUCE ? 0 : (now - began) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!W) size();

    // How whole the page is.
    if (shattered) {
      if (gatherAt) {
        const all = clamp((now - gatherAt) / (MEND_MS + MEND_SPREAD), 0, 1);
        gather = ease(all);
        if (all >= 1 && pieces === "gathering") wholeNow();
      }
      if (shards.length) placeShards(now, t);
    }
    // The quiet over the column, coming in as the page mends: worked out
    // again only when it has changed (or the window has).
    if (!stops || hush !== gather || stops.w !== W) {
      hush = gather;
      stops = quietStops();
      stops.w = W;
      keepNow = 1 - (1 - QUIET) * hush;
    }

    const want = handX < -9000 ? 0 : 1;
    handOn += (want - handOn) * (REDUCE ? 1 : 0.06);
    if (handX > -9000) {
      lensX += (handX - lensX) * (REDUCE ? 1 : LENS_LAG);
      lensY += (handY - lensY) * (REDUCE ? 1 : LENS_LAG);
    }

    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
    ink.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const turn = window.scrollY * SCROLL_TURN;
    const voidness = 1 - gather;                 // while cracked
    const pageAlpha = 0.75 + 0.25 * voidness;

    drawWorld(cx, cy, turn, t, pageAlpha + voidness * 0.4, handX, handY);
    const big = Math.min(W * (W < 700 ? 0.46 : 0.36), 560) / 3.26 * 2;
    const small = Math.min(W * 0.24, 330) / 3.26 * 2;
    const scale = small + (big - small) * voidness;
    drawWord(cx, cy - scale * 0.1, scale, t, 0.24 + 0.46 * voidness, handX, handY);
    if (voidness > 0.003 || sparks.length) drawSparks(cx, cy, portalR() * (0.6 + 0.4 * voidness), t, dt, voidness, gatherAt ? 0 : 1);
    drawLens(cx, cy, turn, t, pageAlpha);
  }

  size();
  if (REDUCE) {
    frame(performance.now());
    window.addEventListener("scroll", () => frame(performance.now()), { passive: true });
  } else {
    (function tick(now) {
      frame(now);
      requestAnimationFrame(tick);
    })(performance.now());
  }
})();

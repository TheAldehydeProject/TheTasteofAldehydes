// ============================================================
// OM PARFUMS and OUTSIDER PARFUMS — houses/om-parfums.html and
// houses/outsider-parfums.html
//
// The tenth house and the eleventh, its sister, drawn by one script —
// the owner asked for the second to have "elements from Om parfums, but
// different and not as extreme ... not fragmented, but rather
// emphasizing the similarity. Whatever you added to embellish on the Om
// page, I want you to do the same on this page minus the fragmentation
// (and a little change)". Which page it is drawing is read off the body:
// `.outsider-page`, or Om.
//
// OM, in the owner's words: "something that feels expansive while being
// minimalist ... minimalist but INCREDIBLY complex. I want the
// interaction to make it simple ... making the page fragmented, and then
// when you interact with it, it kinda shifts together again and starts
// being coherent ... with smooth animations, particles, and something
// geometric ... like the fragments in Dr strange movies ... On the phone
// version ... something that happens automatically given a slight delay".
//
//   THE SHATTER   the page opens in pieces: the window is broken, as a
//                 pane is, into shards radiating from a point a little
//                 above its middle, and every shard — the page's own
//                 writing in it — hangs in the air at a depth and an
//                 angle of its own, the middle ones fallen far back into
//                 a tunnel, one in five turned over so its writing reads
//                 backwards, all of them drifting. Through the gaps, the
//                 void: โอม in specks, and rings throwing off sparks.
//                 ONE CLICK ANYWHERE (a key, the wheel) brings the shards
//                 home — each turning back on its own clock, the deepest
//                 last, their seams flashing gold as they meet — and the
//                 page is whole and stays so. ON A PHONE they come
//                 together by themselves, a moment after the page opens.
//   THE SHARDS    are the page itself: each is a copy of the page's
//                 flow, cut to its shard with a clip-path, laid over the
//                 page (which is there all along, held back underneath,
//                 so the search, a screen reader and the tests read the
//                 page and never the copies). The copies live in a CLOSED
//                 shadow root, inert, with no ids, so nothing else on the
//                 page can find them — and they go once it is whole.
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
// OUTSIDER, "the same minus the fragmentation (and a little change)":
// the same armillary, in ivory with a deep green in it (the light in the
// house's own photographs), the yantra and the lotus traded for the
// house's own mark — the inverted triangle, a smaller one under it —
// nested and repeated; and in place of the shatter, A TWIN. Every line is
// drawn twice, the second a reflection of the first, and the two drift
// apart and come back into register on a slow clock — similarity, which
// is what the owner asked it to say — and under the hand they are always
// in register. The page arrives doubled, its echo sliding into place.
//
// READABILITY. Every line is a hairline at a low alpha, and the whole
// drawing is drawn at QUIET over the column of writing — a mask laid over
// the finished frame, soft at its edges, so there is no line down the
// page where the quiet starts. The void is the one time nothing is
// quiet: the writing is in the shards then.
//
// WITHOUT THIS SCRIPT, or with reduced motion, the page is whole from the
// first frame, on its dark ground, and the drawing (with reduced motion)
// stands still. The shatter is never put on a page opened at one
// fragrance (an address with a #), and `?om=whole` turns it off.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
  if (!ink) return;

  const root = document.documentElement;
  const page = document.body;
  const OUTSIDER = page.classList.contains("outsider-page");
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TOUCH = window.matchMedia("(hover: none)").matches;
  const GLYPH = window.OM_GLYPH || null;

  // ============================================================
  // TUNING
  // ============================================================
  const SEED = OUTSIDER ? 51101 : 40210;
  const COLUMN = 940;              // the writing's measure
  const QUIET = 0.3;               // what is left of the drawing over the column
  const SOFT = 120;                // px either side it eases in over

  // THE COLOURS — light added to a dark ground.
  const LINE = OUTSIDER ? [228, 222, 206] : [216, 176, 106];   // the hairlines
  const SPECK = OUTSIDER ? [238, 234, 222] : [246, 228, 190];  // the specks
  const SECOND = OUTSIDER ? [92, 170, 128] : [255, 214, 150];  // the second colour (green / pale fire)
  const LINE_A = OUTSIDER ? 0.13 : 0.15;                       // how strongly a hairline is drawn

  // THE ARMILLARY: rings of R (half the window's shorter side), each
  // tilted out of the window's plane by `tilt` (radians) about an axis
  // that itself turns (`spin`, radians a second), breathing by `sway`.
  const RINGS = OUTSIDER ? [
    { r: 0.30, tilt: 1.05, axis: 0.4, spin: 0.030, sway: 0.10, ticks: 36, dash: 0 },
    { r: 0.52, tilt: 0.55, axis: 2.2, spin: -0.018, sway: 0.08, ticks: 72, dash: 0 },
    { r: 0.78, tilt: 1.20, axis: 1.1, spin: 0.012, sway: 0.06, ticks: 0, dash: 6 },
    { r: 1.06, tilt: 0.30, axis: 3.0, spin: -0.008, sway: 0.05, ticks: 120, dash: 0 },
    { r: 1.42, tilt: 0.85, axis: 0.2, spin: 0.006, sway: 0.04, ticks: 0, dash: 3 },
  ] : [
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

  // THE SHATTER (Om only)
  const SHARD_RINGS_WIDE = [[0.10, 5], [0.27, 8], [0.50, 11], [0.82, 13], [1.12, 14]];
  const SHARD_RINGS_NARROW = [[0.12, 4], [0.32, 7], [0.60, 9], [0.98, 10]];
  const GATHER_MS = 1300;          // how long one shard takes to come home
  const GATHER_SPREAD = 620;       // and the most it waits, the deepest last
  const SEAM_MS = 700;             // the seams' flash fading, once home
  const AUTO_MS = 1500;            // on a phone, how long it hangs in pieces
  const HINT_MS = 2400;            // on a desktop, when the word comes up
  const SPARKS = 70;               // sparks thrown off the portal a second

  // THE TWIN (Outsider only)
  const TWIN_EVERY = 16;           // seconds: apart and back into register
  const TWIN_APART = 0.075;        // how far apart, of R, at the most
  const TWIN_TURN = 0.05;          // radians it is turned, at the most
  const ARRIVE_MS = 2600;          // the echo sliding into place as the page opens

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
  const sparks = [];               // { a, r, v, life, born } — Om's portal

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
      const ry = r * Math.abs(now.cos);
      const back = now.sin >= 0 ? [Math.PI, Math.PI * 2] : [0, Math.PI];
      const front = now.sin >= 0 ? [0, Math.PI] : [Math.PI, Math.PI * 2];
      ink.setLineDash(ring.dash ? [ring.dash, ring.dash * 2.4] : []);
      ink.strokeStyle = rgba(LINE, LINE_A * alpha * 0.45);
      ink.beginPath(); ink.ellipse(cx, cy, r, Math.max(0.5, ry), phi, back[0], back[1]); ink.stroke();
      ink.strokeStyle = rgba(LINE, LINE_A * alpha);
      ink.beginPath(); ink.ellipse(cx, cy, r, Math.max(0.5, ry), phi, front[0], front[1]); ink.stroke();
      ink.setLineDash([]);
      if (!ring.ticks) return;
      // THE TICKS, every one radial in the ring's own plane, the long
      // ones every fifth.
      const turned = { phi: phi, cos: now.cos, sin: now.sin };
      ink.strokeStyle = rgba(LINE, LINE_A * alpha * 0.9);
      ink.beginPath();
      for (let k = 0; k < ring.ticks; k++) {
        const th = (k / ring.ticks) * Math.PI * 2;
        const len = k % 5 === 0 ? 9 : 4;
        const a = onRing(cx, cy, r, turned, th), b = onRing(cx, cy, r + len, turned, th);
        if (a.z < 0) continue;
        ink.moveTo(a.x, a.y); ink.lineTo(b.x, b.y);
      }
      ink.stroke();
    });
  }

  /** Om's yantra: four triangles up and five down, interlocking, after
      the Sri Yantra — the diagram drawn with Om at its middle. Outsider's
      is its own mark instead: the inverted triangle and the smaller one
      under it, nested and repeated, turning the other way. */
  function drawTriangles(cx, cy, turn, t, alpha) {
    ink.strokeStyle = rgba(LINE, LINE_A * alpha * 1.1);
    ink.lineWidth = 1;
    ink.beginPath();
    const tri = (s, dy, down, rot) => {
      for (let k = 0; k < 3; k++) {
        const a = rot + (down ? Math.PI / 2 : -Math.PI / 2) + (k * Math.PI * 2) / 3;
        const x = cx + Math.cos(a) * s * R, y = cy + dy * R + Math.sin(a) * s * R;
        if (k === 0) ink.moveTo(x, y); else ink.lineTo(x, y);
      }
      ink.closePath();
    };
    if (OUTSIDER) {
      const rot = -turn * 0.6 - t * 0.004;
      [0.62, 0.46, 0.33, 0.22].forEach((s, i) => {
        tri(s, -0.04 * i, true, rot);
        // The small one under it, as the mark has.
        tri(s * 0.36, s * 0.78, true, rot);
      });
    } else {
      const rot = turn + t * 0.006;
      [[0.60, -0.05], [0.47, 0.03], [0.35, 0.08], [0.24, -0.02]].forEach(([s, dy]) => tri(s, dy, false, rot));
      [[0.64, 0.05], [0.51, -0.03], [0.39, -0.07], [0.28, 0.02], [0.17, 0.0]].forEach(([s, dy]) => tri(s, dy, true, rot));
    }
    ink.stroke();
  }

  /** Om's lotus: two rings of petals, each a pointed arch. */
  function drawLotus(cx, cy, turn, t, alpha) {
    if (OUTSIDER) return;
    ink.strokeStyle = rgba(LINE, LINE_A * alpha * 0.85);
    ink.lineWidth = 1;
    ink.beginPath();
    [[8, 0.66, 0.80, 0.0], [16, 0.80, 0.95, Math.PI / 16]].forEach(([n, r0, r1, off]) => {
      for (let k = 0; k < n; k++) {
        const a = turn * 0.5 - t * 0.003 + off + (k / n) * Math.PI * 2;
        const half = Math.PI / n;
        const x0 = cx + Math.cos(a - half) * r0 * R, y0 = cy + Math.sin(a - half) * r0 * R;
        const x1 = cx + Math.cos(a + half) * r0 * R, y1 = cy + Math.sin(a + half) * r0 * R;
        const tx = cx + Math.cos(a) * r1 * R, ty = cy + Math.sin(a) * r1 * R;
        const mx = cx + Math.cos(a) * (r0 + (r1 - r0) * 0.7) * R, my = cy + Math.sin(a) * (r0 + (r1 - r0) * 0.7) * R;
        ink.moveTo(x0, y0);
        ink.quadraticCurveTo((x0 + mx) / 2 + (mx - cx) * 0.06, (y0 + my) / 2 + (my - cy) * 0.06, tx, ty);
        ink.quadraticCurveTo((x1 + mx) / 2 + (mx - cx) * 0.06, (y1 + my) / 2 + (my - cy) * 0.06, x1, y1);
      }
    });
    ink.stroke();
  }

  /** The twelve-pointed star, {12/5}, far out. */
  function drawStar(cx, cy, turn, t, alpha) {
    ink.strokeStyle = rgba(LINE, LINE_A * alpha * 0.6);
    ink.lineWidth = 1;
    ink.beginPath();
    const n = OUTSIDER ? 9 : 12, step = OUTSIDER ? 4 : 5, r = (OUTSIDER ? 1.22 : 1.0) * R;
    const rot = -turn * 0.4 + t * 0.002;
    for (let k = 0; k <= n; k++) {
      const a = rot + ((k * step) % n) / n * Math.PI * 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (k === 0) ink.moveTo(x, y); else ink.lineTo(x, y);
    }
    ink.stroke();
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
      ink.globalAlpha = clamp(s.base * depth * tw * lit * alpha, 0, 1);
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
      ink.globalAlpha = clamp(d.base * k * 0.7 * tw * alpha, 0, 1);
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
  // THE WORD — โอม for Om; for Outsider, its own mark.
  // ============================================================
  /** The word's specks, at a centre and a size (px per x-height). */
  function drawWord(cx, cy, scale, t, alpha, hx, hy) {
    if (alpha < 0.004) return;
    if (OUTSIDER) return drawMark(cx, cy, scale, t, alpha);
    if (!GLYPH) return;
    const box = GLYPH.box;
    const oy = cy - ((box[1] + box[3]) / 2) * scale;
    const X = (x) => cx + x * scale, Y = (y) => oy + y * scale;
    // THE CONSTRUCTION: the baseline, the x-height, the top of the tall
    // letter, run out past the word with a tick where each letter starts.
    ink.lineWidth = 1;
    ink.strokeStyle = rgba(LINE, 0.22 * alpha);
    ink.setLineDash([2, 5]);
    ink.beginPath();
    const left = X(box[0]) - scale * 0.5, right = X(box[2]) + scale * 0.5;
    [0, 1, box[1]].forEach((y) => { ink.moveTo(left, Y(y)); ink.lineTo(right, Y(y)); });
    ink.stroke();
    ink.setLineDash([]);
    // THE HEADS: perfect circles, their centres crossed.
    ink.strokeStyle = rgba(LINE, 0.75 * alpha);
    GLYPH.letters.forEach((L) => L.heads.forEach(([x, y, r]) => {
      ink.beginPath(); ink.arc(X(x), Y(y), r * scale, 0, Math.PI * 2); ink.stroke();
      const c = r * scale * 0.45;
      ink.beginPath();
      ink.moveTo(X(x) - c, Y(y)); ink.lineTo(X(x) + c, Y(y));
      ink.moveTo(X(x), Y(y) - c); ink.lineTo(X(x), Y(y) + c);
      ink.stroke();
      ink.beginPath(); ink.arc(X(x), Y(y), r * scale * 1.9, 0, Math.PI * 2);
      ink.strokeStyle = rgba(LINE, 0.16 * alpha); ink.stroke();
      ink.strokeStyle = rgba(LINE, 0.75 * alpha);
    }));
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
        ink.globalAlpha = clamp((0.35 + 0.65 * run) * alpha, 0, 1);
        ink.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }));
    ink.globalAlpha = 1;
    ink.globalCompositeOperation = "source-over";
  }

  /** Outsider's mark: the inverted triangle and the smaller one under it,
      as specks along their edges, with their incircles drawn in. */
  function drawMark(cx, cy, scale, t, alpha) {
    const tri = (s, y0) => {
      const a = [cx - s, cy + y0 * scale], b = [cx + s, cy + y0 * scale], c = [cx, cy + y0 * scale + s * Math.sqrt(3)];
      return [a, b, c];
    };
    const big = tri(scale * 1.2, -1.4), small = tri(scale * 0.5, 0.86);
    ink.lineWidth = 1;
    [big, small].forEach((T) => {
      // Its incircle, as a type designer would rule it.
      const s = Math.hypot(T[1][0] - T[0][0], T[1][1] - T[0][1]);
      const r = s / (2 * Math.sqrt(3));
      const ic = [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3];
      ink.strokeStyle = rgba(LINE, 0.3 * alpha);
      ink.beginPath(); ink.arc(ic[0], ic[1], r, 0, Math.PI * 2); ink.stroke();
      ink.strokeStyle = rgba(SECOND, 0.35 * alpha);
      ink.beginPath(); ink.arc(ic[0], ic[1], 2, 0, Math.PI * 2); ink.stroke();
    });
    ink.globalCompositeOperation = "lighter";
    ink.fillStyle = rgba(SPECK, 1);
    [big, small].forEach((T, ti) => {
      for (let k = 0; k < 3; k++) {
        const p = T[k], q = T[(k + 1) % 3];
        const n = Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 5);
        for (let i = 0; i < n; i++) {
          const f = i / n;
          const run = REDUCE ? 0.6 : 0.5 + 0.5 * Math.sin((k + f) * Math.PI * 1.3 - t * 1.4 + ti);
          ink.globalAlpha = clamp((0.3 + 0.7 * run) * alpha, 0, 1);
          ink.fillRect(p[0] + (q[0] - p[0]) * f - 0.8, p[1] + (q[1] - p[1]) * f - 0.8, 1.6, 1.6);
        }
      }
    });
    ink.globalAlpha = 1;
    ink.globalCompositeOperation = "source-over";
  }

  // ============================================================
  // THE PORTAL'S SPARKS — Om, while it is in pieces. Thrown off the rim
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
      ink.strokeStyle = rgba(f < 0.4 ? SECOND : LINE, (1 - f) * 0.9 * alpha);
      ink.beginPath();
      ink.moveTo(x - Math.cos(dir) * tail, y - Math.sin(dir) * tail);
      ink.lineTo(x, y);
      ink.stroke();
    }
    ink.globalCompositeOperation = "source-over";
    // The ring itself, two dashed circles turning against each other.
    ink.lineWidth = 1.4;
    ink.setLineDash([14, 9]);
    ink.lineDashOffset = -t * 40;
    ink.strokeStyle = rgba(SECOND, 0.55 * alpha);
    ink.beginPath(); ink.arc(cx, cy, rr, 0, Math.PI * 2); ink.stroke();
    ink.setLineDash([3, 11]);
    ink.lineDashOffset = t * 26;
    ink.strokeStyle = rgba(LINE, 0.45 * alpha);
    ink.beginPath(); ink.arc(cx, cy, rr * 1.06, 0, Math.PI * 2); ink.stroke();
    ink.setLineDash([]);
    ink.lineDashOffset = 0;
  }

  // ============================================================
  // THE QUIET — laid over the finished frame: every pixel of the drawing
  // over the column kept at QUIET of itself, eased in at the edges.
  // ============================================================
  function hushColumn(strength) {
    if (strength <= 0.001) return;
    const edge = W > COLUMN ? (W - COLUMN) / 2 : 0;
    const soft = Math.min(SOFT, W * 0.14);
    const keep = 1 - (1 - QUIET) * strength;
    const g = ink.createLinearGradient(0, 0, W, 0);
    const at = (x) => clamp(x / W, 0, 1);
    g.addColorStop(0, "rgba(0,0,0,1)");
    if (edge > soft) {
      g.addColorStop(at(edge - soft), "rgba(0,0,0,1)");
      g.addColorStop(at(edge + soft * 0.6), "rgba(0,0,0," + keep + ")");
      g.addColorStop(at(W - edge - soft * 0.6), "rgba(0,0,0," + keep + ")");
      g.addColorStop(at(W - edge + soft), "rgba(0,0,0,1)");
    } else {
      g.addColorStop(0.0, "rgba(0,0,0," + keep + ")");
    }
    g.addColorStop(1, edge > soft ? "rgba(0,0,0,1)" : "rgba(0,0,0," + keep + ")");
    ink.globalCompositeOperation = "destination-in";
    ink.fillStyle = g;
    ink.fillRect(0, 0, W, H);
    ink.globalCompositeOperation = "source-over";
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
    ink.strokeStyle = rgba(LINE, 0.5 * handOn * alpha);
    hex(LENS); ink.stroke();
    ink.strokeStyle = rgba(SECOND, 0.18 * handOn * alpha);
    hex(LENS * 0.82); ink.stroke();
  }

  // ============================================================
  // OM: THE SHATTER — the page in pieces, laid over it in a closed
  // shadow root, and brought together by one click.
  // ============================================================
  const shattered = !OUTSIDER && root.classList.contains("om-shattered");
  let gather = shattered ? 0 : 1;          // 0 in pieces, 1 whole (eased, per frame)
  let gatherAt = 0;                        // when the click came (ms), or 0
  let shards = [];
  let host = null, stage = null, field = null, hint = null;
  let pieces = shattered ? "pieces" : "whole";
  root.dataset.om = OUTSIDER ? "" : pieces;

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

  function buildShards() {
    const w = root.clientWidth, h = window.innerHeight;
    const P = [w * 0.5, h * 0.44];
    const D = Math.hypot(w, h) * 0.5;
    const seeds = [P];
    const rings = w < 700 ? SHARD_RINGS_NARROW : SHARD_RINGS_WIDE;
    rings.forEach(([f, n], k) => {
      for (let j = 0; j < n; j++) {
        const a = ((j + 0.5 + (random() - 0.5) * 0.7) / n) * Math.PI * 2 + k * 0.41;
        const r = f * D * between(0.86, 1.14);
        seeds.push([P[0] + Math.cos(a) * r, P[1] + Math.sin(a) * r * 0.86]);
      }
    });

    // THE PAGE'S FLOW, copied once: what is under the shards, without an
    // id, a tab stop or anything else that could be found or reached.
    const flow = document.createElement("div");
    flow.className = "human-page om-page om-flow";
    document.querySelectorAll("body > main, body > .house-credit, body > .human-foot").forEach((el) => flow.appendChild(el.cloneNode(true)));
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
      ".stage{position:absolute;inset:0;perspective:1500px;perspective-origin:50% 44%;overflow:hidden;pointer-events:none;transition:opacity 700ms cubic-bezier(0.3,0,0.2,1)}" +
      ".stage.gone{opacity:0}" +
      ".field{position:absolute;inset:0;transform-style:preserve-3d}" +
      ".shard{position:absolute;backface-visibility:visible;will-change:transform;transform-origin:var(--ox) var(--oy)}" +
      ".shard>.om-flow{position:absolute;margin:0;background:transparent}" +
      ".sheen{position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,240,214,0.012) 0%,rgba(255,240,214,0.05) 40%,rgba(255,240,214,0.13) 50%,rgba(255,240,214,0.03) 62%,rgba(255,240,214,0.012) 100%);opacity:var(--sheen,0)}" +
      ".edge{position:absolute;left:0;top:0;overflow:visible}" +
      ".edge polygon{fill:none;stroke:rgb(" + gold + ");stroke-width:1;vector-effect:non-scaling-stroke;opacity:var(--edge,0.4)}" +
      ".edge .glint{stroke:rgb(255 236 200);stroke-width:1.6;stroke-dasharray:26 1400;animation:glint 5.5s linear infinite;animation-delay:var(--delay,0s)}" +
      "@keyframes glint{to{stroke-dashoffset:-1426}}" +
      ".hint{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgb(" + gold + " / 0.85);opacity:0;transition:opacity 1.2s ease}" +
      ".hint.shown{opacity:1}" +
      ".hint i{display:block;width:9px;height:9px;border:1px solid currentColor;transform:rotate(45deg)}" +
      "</style>" +
      '<div class="stage" inert><div class="field"></div><p class="hint"><i></i>Click anywhere to bring it together<i></i></p></div>';
    stage = shadow.querySelector(".stage");
    field = shadow.querySelector(".field");
    hint = shadow.querySelector(".hint");
    if (TOUCH) hint.remove();

    const scrollY = window.scrollY;
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
      copy.style.top = -(by + scrollY) + "px";
      copy.style.width = w + "px";
      el.appendChild(copy);
      const sheen = document.createElement("div");
      sheen.className = "sheen";
      el.appendChild(sheen);
      const pts = local.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
      el.insertAdjacentHTML("beforeend",
        '<svg class="edge" width="' + bw + '" height="' + bh + '" viewBox="0 0 ' + bw + " " + bh + '"><polygon points="' + pts + '"/>' +
        (random() < 0.35 ? '<polygon class="glint" points="' + pts + '" style="--delay:-' + (random() * 5).toFixed(2) + 's"/>' : "") + "</svg>");
      field.appendChild(el);

      // WHERE IT HANGS: pushed out from the point it broke from, the
      // middle ones fallen far back, one in five turned over.
      const dx = gx - P[0], dy = gy - P[1], dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist, uy = dy / dist, near = 1 - clamp(dist / D, 0, 1);
      shards.push({
        el, sheen, dist,
        tx: ux * (14 + dist * 0.12 + random() * 26),
        ty: uy * (14 + dist * 0.12 + random() * 26),
        tz: -60 - near * near * 520 + between(-40, 60),
        rx: between(-16, 16) - uy * 12,
        ry: between(-16, 16) + ux * 12 + (random() < 0.2 ? 180 : 0),
        rz: between(-9, 9),
        phase: random() * Math.PI * 2,
        wait: (near * 0.75 + random() * 0.25) * GATHER_SPREAD,
        p: 0,
      });
    });
    page.insertBefore(host, canvas.nextSibling);
    root.classList.add("om-held");
  }

  /** One frame of the shards: each where it hangs, or on its way home. */
  function placeShards(now, t) {
    if (!field) return;
    // THE TILT OF THE WHOLE, a little towards the hand — a world you are
    // standing in rather than a picture.
    const tiltX = handOn * (handY > -9000 ? ((handY / H) - 0.5) * -5 : 0) * (1 - gather);
    const tiltY = handOn * (handX > -9000 ? ((handX / W) - 0.5) * 6 : 0) * (1 - gather);
    field.style.transform = "rotateX(" + tiltX.toFixed(2) + "deg) rotateY(" + tiltY.toFixed(2) + "deg)";
    shards.forEach((s) => {
      let p = 0;
      if (gatherAt) p = ease(clamp((now - gatherAt - s.wait) / GATHER_MS, 0, 1));
      s.p = p;
      const q = 1 - p;
      const f = REDUCE ? 0 : q;
      const bob = Math.sin(t * 0.6 + s.phase), sway = Math.cos(t * 0.45 + s.phase * 1.3);
      const tx = s.tx * q + bob * 5 * f, ty = s.ty * q + sway * 4 * f, tz = s.tz * q + bob * 18 * f;
      const rx = s.rx * q + sway * 2.4 * f, ry = s.ry * q + bob * 2.4 * f, rz = s.rz * q;
      s.el.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px," + tz.toFixed(1) + "px) rotateX(" +
        rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) rotateZ(" + rz.toFixed(2) + "deg)";
      // The sheen catches as it turns; the seam flashes as it lands, and
      // fades once it is home.
      s.el.style.setProperty("--sheen", (Math.abs(Math.sin((ry + rx) * Math.PI / 180)) * q + 0.15 * q).toFixed(3));
      let edge = 0.42 * q;
      if (gatherAt) {
        const landed = now - gatherAt - s.wait - GATHER_MS;
        edge += p > 0.7 ? (landed < 0 ? (p - 0.7) / 0.3 : Math.max(0, 1 - landed / SEAM_MS)) : 0;
      }
      s.el.style.setProperty("--edge", clamp(edge, 0, 1).toFixed(3));
    });
  }

  function gatherNow(event) {
    if (gatherAt || !host) return;
    if (event && event.type === "keydown" && ["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
    gatherAt = performance.now();
    pieces = "gathering";
    root.dataset.om = pieces;
    if (hint) hint.classList.remove("shown");
    // A last burst from the portal, outward, as it lets go.
    for (let k = 0; k < 90 && !REDUCE; k++) {
      sparks.push({ a: random() * Math.PI * 2, r: portalR(), v: between(80, 260), out: between(40, 160), life: between(0.5, 1.2), age: 0 });
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
      window.setTimeout(() => { if (host) host.remove(); host = stage = field = hint = null; shards = []; }, 760);
    }));
  }
  const portalR = () => Math.min(W * (W < 700 ? 0.46 : 0.36), 560) * 0.62;

  if (shattered) {
    buildShards();
    host.addEventListener("pointerdown", gatherNow);
    host.addEventListener("click", (e) => e.preventDefault());
    window.addEventListener("keydown", gatherNow);
    window.addEventListener("wheel", gatherNow, { passive: true });
    window.addEventListener("touchmove", gatherNow, { passive: true });
    document.addEventListener("focusin", gatherNow);
    // A window changing size breaks the pieces' geometry: it is simply
    // whole at once.
    window.addEventListener("resize", () => { if (pieces === "pieces") { gatherAt = performance.now() - GATHER_MS - GATHER_SPREAD; pieces = "gathering"; } });
    if (TOUCH) window.setTimeout(gatherNow, AUTO_MS);
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
  const arrive = OUTSIDER && !REDUCE ? began : 0;
  function frame(now) {
    const t = REDUCE ? 0 : (now - began) / 1000;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!W) size();

    // How whole the page is.
    if (shattered) {
      if (gatherAt) {
        const all = clamp((now - gatherAt) / (GATHER_MS + GATHER_SPREAD), 0, 1);
        gather = ease(all);
        if (all >= 1 && pieces === "gathering") wholeNow();
      }
      placeShards(now, t);
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
    const voidness = 1 - gather;                 // Om, while in pieces
    const pageAlpha = 0.75 + 0.25 * voidness;

    // THE TWIN (Outsider): the drawing again, reflected, drifting out of
    // register and back; in register under the hand, and arriving from
    // far out of it as the page opens.
    if (OUTSIDER) {
      const into = arrive ? ease(clamp((now - arrive) / ARRIVE_MS, 0, 1)) : 1;
      const apart = (REDUCE ? 0.4 : 0.5 - 0.5 * Math.cos((t / TWIN_EVERY) * Math.PI * 2)) * (1 - 0.85 * handOn);
      const off = (apart * TWIN_APART + (1 - into) * 0.5) * R;
      drawWorld(cx, cy, turn, t, pageAlpha, handX, handY);
      ink.save();
      ink.translate(cx + off, cy - off * 0.3);
      ink.scale(-1, 1);
      ink.rotate((apart * TWIN_TURN) + (1 - into) * 0.4);
      ink.translate(-cx, -cy);
      ink.globalAlpha = 1;
      drawWorld(cx, cy, -turn, t + 3.7, pageAlpha * 0.55, -99999, -99999);
      ink.restore();
      drawWord(cx + off * 0.2, cy - R * 0.02, Math.min(R * 0.16, 70), t, 0.5, handX, handY);
    } else {
      drawWorld(cx, cy, turn, t, pageAlpha + voidness * 0.6, handX, handY);
      const big = Math.min(W * (W < 700 ? 0.46 : 0.36), 560) / 3.26 * 2;
      const small = Math.min(W * 0.24, 330) / 3.26 * 2;
      const scale = small + (big - small) * voidness;
      drawWord(cx, cy - scale * 0.1, scale, t, 0.24 + 0.76 * voidness, handX, handY);
      if (voidness > 0.003 || sparks.length) drawSparks(cx, cy, portalR() * (0.6 + 0.4 * voidness), t, dt, voidness, gatherAt ? 0 : 1);
    }
    drawLens(cx, cy, turn, t, pageAlpha);
    hushColumn(gather);
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

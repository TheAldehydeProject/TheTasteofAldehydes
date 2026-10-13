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
// smooth the om parfums page out, it slows down the laptop A LOT!" And
// later the same day: "i like the hexagon cursor, but i want the breaking
// apart of the page to be reversible when you hover away. I also want the
// hexagon to be the thing that affects everything behind it; i want it to
// be larger, and everything unbreaks in the hexagon. make the breaks
// different and less huge. i want them to be like fractured glass
// unfracturing when hovered within the hexagon" — and, asked how the page
// is read while it is cracked, the owner chose "cracked while reading".
//
//   THE FRACTURE  the page opens behind CRACKED GLASS: a pane fixed to the
//                 window, broken by two blows into fine pieces — small
//                 round where each struck, larger farther out — each
//                 holding the page's own writing a pixel or few off its
//                 place and a fraction of a degree out of true, its crack
//                 a gold hairline, a glint of light running round one in
//                 four. The page SCROLLS under it as ever, and is read
//                 through it: the writing slightly broken, the glass
//                 staying where it is. (A few large shards stood here for
//                 an afternoon, the page held still and mended for good by
//                 the hand; fifty-one thrown far apart in 3D for a day
//                 before that.) Since the very last round of 2026-10-11 —
//                 "just as a test (so keep the code from the curernt
//                 version in case i wanna revert it) but make the fractures
//                 differnet/ like broken glass more" — it is BROKEN AS
//                 GLASS BREAKS, a trial: a web of radial and concentric
//                 cracks from each blow, its pieces long wedges pointing at
//                 it, crushed at the blow itself (THE BROKEN PANE, below).
//                 The fine glass is kept, and `?glass=fine` shows it.
//                 SINCE 2026-10-13 IT IS NOT GLASS AT ALL — "make it less
//                 like glass and more so like just a very abstract break.
//                 Find a way to be on theme": THE RINGS, the page broken as
//                 a mandala is drawn round โอม, as the sound the house is
//                 named for rings out — a disc round the word and bands out
//                 to past the corners, each band cut into petals, each band
//                 turned a little out of true about the middle and the next
//                 the other way; gold seams, and nothing of glass (no sheen,
//                 no glints). The broken pane is `?glass=broken`.
//   THE LENS      the hexagon of glass at the hand, larger than it was:
//                 inside it, the page WHOLE — the writing unbroken, the
//                 drawing behind it turned and brought nearer — and the
//                 glass about it easing home as it comes, cracking again
//                 as it goes. A gold rim round it.
//   THE MENDING   for good, only by MEND THE BREAK, the button at the top
//                 right ("put a button on the top right to fix the page";
//                 it said Mend the glass), the pieces coming home in a wave
//                 from it, their seams flashing gold as they meet. NOTHING
//                 PRESSED ON THE PAGE MENDS IT since 2026-10-13 ("whenever
//                 you click on anything, the glass gets fixed and it is
//                 buggy ... When you click on the perfumes, the break
//                 should not be fixed"): a fragrance opens at once, under
//                 the break, and opens in the pieces too, since the copies
//                 FOLLOW THE PAGE (followPage). (Until then opening a
//                 fragrance mended it, the press held while it did, and a
//                 key reaching into the page mended it too.) ON A PHONE,
//                 where nothing hovers, the pieces come together by
//                 themselves a moment after the page opens.
//   THE PIECES    are the page itself: each holds a copy of the whole page,
//                 moved as the page scrolls, cut to its piece with a
//                 clip-path, laid over the page (which is there all along,
//                 held back underneath, so the search, a screen reader and
//                 the tests read the page and never the copies, and a
//                 press goes through the glass to it). The copies live in a
//                 CLOSED shadow root, inert, with no ids, so nothing else on
//                 the page can find them — and they go once it is whole.
//                 NOTHING IN THE GLASS IS A LAYER OF ITS OWN but the glints:
//                 a piece cut to its shape on a layer of its own is a mask
//                 the browser lays again every frame, and fifty held the
//                 cracked page at a quarter of the whole page's frames.
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
//   THE LENS      once the page is whole, still what answers the hand:
//                 the hexagon follows the pointer a beat behind it, and
//                 inside it the drawing is seen turned and brought closer,
//                 brighter, as through a piece of the mirror. A tap puts it
//                 there.
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
  const mainInk = canvas.getContext("2d");
  if (!mainInk) return;
  // What is drawn on: the page's canvas, or — while the page is cracked —
  // the lens's own, for the drawing seen through it.
  let ink = mainInk;

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

  // THE LENS — the hexagon of glass at the hand. Since 2026-10-11, later
  // ("i like the hexagon cursor ... i want it to be larger, and everything
  // unbreaks in the hexagon"), larger, and while the page is cracked, the
  // page whole inside it.
  // A little bigger again since 2026-10-13 ("also make the hexagon a little
  // bigger"): 196, where it was 168 (and 92 before that).
  const LENS = 196;                // its radius, px
  const LENS_LAG = 0.14;           // how far it closes on the hand each frame
  const LENS_TURN = 0.16;          // how far the drawing is turned inside it
  const LENS_NEAR = 1.14;          // and how much nearer
  const LENS_FLAT = 0.92;          // how much less tall it is than wide

  // THE FRACTURE — fine cracks, as a pane of glass cracks, from two blows:
  // each a ring of pieces round where it struck, finer near it, and every
  // piece only a few pixels off its place. (A few large shards stood here
  // for an afternoon, and fifty-one thrown far apart for a day before that.)
  const GLASS_BLOWS_WIDE = [
    { x: 0.38, y: 0.32, rings: [[0.07, 5], [0.17, 7], [0.31, 8], [0.52, 9], [0.86, 10]] },
    { x: 0.76, y: 0.8, rings: [[0.08, 4], [0.19, 5]] },
  ];
  const GLASS_BLOWS_NARROW = [{ x: 0.5, y: 0.38, rings: [[0.12, 4], [0.32, 6], [0.66, 7]] }];
  const GLASS_SHIFT = 1.8;         // px a piece stands off its place — up to about three times that
  const GLASS_TURN = 0.32;         // degrees out of true, at most
  const GLASS_NEAR = 2.2;          // lens radii within which the glass eases home as the lens comes

  // THE BROKEN PANE — a trial (2026-10-11, last — "just as a test (so keep
  // the code from the curernt version in case i wanna revert it) but make
  // the fractures differnet/ like broken glass more"): the pane struck and
  // broken as glass breaks, a web — RADIAL CRACKS out from where it was
  // struck, each wandering a little as it goes, and CONCENTRIC ones across
  // them, straight from one radial crack to the next, closer together near
  // the blow — so the pieces are long wedges pointing at it, fine and
  // crushed at the blow itself, where a few have fallen out (`BREAK_HOLE`).
  // A stretch of a ring is not always cracked (`BREAK_RING_GAP`), which
  // leaves the longest shards. Each piece stands out of true as a broken
  // piece in a frame is, catching the light its own way. `GLASS_STYLE`
  // says which glass the page is cracked with — "broken", or "fine" for
  // the glass before it — and `?glass=fine` (or `?glass=broken`) on the
  // address shows the other without changing anything.
  // Since 2026-10-13 — "make it less like glass and more so like just a
  // very abstract break. Find a way to be on theme" — the page is not
  // broken as glass at all but in RINGS (below), and the two glasses are
  // kept behind `?glass=broken` and `?glass=fine`.
  // And later the same day — "change the breaking thing entirely (at least
  // as a test)" — THE SPLIT (below), with the rings and both glasses kept
  // behind `?glass=rings`, `?glass=broken` and `?glass=fine`.
  const GLASS_STYLE = "split";
  // Each blow: where (a share of the window), how many radial cracks, the
  // rings (shares of half the window's diagonal; the last past every
  // corner), and `toward`, the share of the way to the next blow that
  // its pieces reach.
  const BREAK_BLOWS_WIDE = [
    { x: 0.63, y: 0.25, spokes: 15, rings: [0.03, 0.1, 0.24, 0.5, 1.5], toward: 0.66 },
    { x: 0.83, y: 0.84, spokes: 8, rings: [0.025, 0.09, 0.26, 1.5] },
  ];
  const BREAK_BLOWS_NARROW = [{ x: 0.72, y: 0.39, spokes: 11, rings: [0.04, 0.13, 0.32, 0.7, 1.6] }];
  const BREAK_RING_GAP = 0.34;     // the chance a stretch of a ring past the first is not cracked
  const BREAK_WANDER = 0.07;       // radians a radial crack turns, at most, from one ring to the next
  const BREAK_HOLE = 2;            // pieces at each blow fallen out
  const BREAK_SHIFT = 3.4;         // px a piece stands off its place — up to about twice that
  const BREAK_TURN = 0.62;         // degrees out of true, at most
  const BREAK_NEAR = 1.1;          // lens radii from a piece's nearest edge within which it eases home as the lens comes
  // THE RINGS — the break since 2026-10-13: not glass but the sound the
  // house is named for. Om is the first vibration, and the page is broken
  // as a mandala is drawn, in rings round โอม at the middle of the window:
  // a disc round the word, and bands out from it to past the corners, each
  // band cut into its petals (6, 8, 12, 12, 16 — the lotus's and the
  // star's numbers), every other band's cuts a half step round from the
  // band inside it. EACH BAND IS TURNED a little out of true about the
  // middle, the next the other way, as the armillary's rings turn — the
  // page out of tune with itself, a few pixels at the band's middle — and
  // each petal stands a pixel in or out of its band. The seams are the
  // house's gold hairlines and nothing else: no sheen, no glints, nothing
  // of glass; every other band a faint warmth of gold, so they read as
  // rings.
  const RING_RADII = [0.15, 0.28, 0.43, 0.6, 0.8, 1.06];   // shares of half the window's diagonal
  const RING_PARTS = [1, 6, 8, 12, 12, 16];                 // pieces in each band (the first the disc)
  const RING_PARTS_NARROW = [1, 4, 6, 8, 8, 10];
  const RING_SHIFT = 1.5;          // px a band is turned out of true at its middle — up to a third more
  const RING_LIFT = 0.6;           // px a petal stands in or out of its band, at most
  const RING_ARC = 3;              // degrees between the points of an arc
  // THE SPLIT — a trial (2026-10-13, later — "when you load the page, the
  // page itself is split into two ... if you take the page as it is now
  // ... and run a line down the center, then take everything on the left
  // and push it further left, and everything on the right of the line and
  // push it further right, creating an empty space in the middle ... in
  // this middle awkward line, there is a button ... saying "OM", which if
  // clicked, will with a shaky animation converge the two sides of the
  // page into one. the middle should be themed of breaks. They should be
  // random polygons of broken stuff. and then when you converge the two
  // sides with the buttons, the breaks will kind of disappear behind it.
  // as faded behind text"). The page cut down its middle into two pieces,
  // each holding the page as the rings' and the glass's pieces do, pushed
  // out SPLIT_PUSH of the page's width; in the gap, BROKEN PIECES — random
  // polygons, most small, a few larger, turning very slowly — and two
  // cracks wandering down it, drawn on the house's own ground; and in its
  // middle the OM button. Pressed, the halves come together over SPLIT_MS,
  // SHAKING as they come (SHAKE, hardest half way), their edges flashing
  // gold as they meet; the broken pieces are drawn in towards the seam as
  // the halves close over them, and stay there, faint behind the writing
  // (GAP_FAINT). No hexagon showing the page whole while it is split — the
  // hexagon is the cursor's drawing still.
  const SPLIT_PUSH = 0.07;         // each half pushed out this share of the page's width
  const SPLIT_PUSH_LEAST = 24;     // px, at least (a phone)
  const SPLIT_PUSH_MOST = 120;     // px, at most
  const SPLIT_MS = 1700;           // the halves coming together
  const SHAKE = 9;                 // px, the shake at its hardest
  const SHAKE_HZ = 21;             // and how quickly
  const GAP_SHARDS = 1 / 1300;     // broken pieces to a square px of the gap
  const GAP_FAINT = 0.16;          // what is left of them behind the writing once it is whole
  const MEND_MS = 1100;            // how long one piece takes to come home, mending for good
  const MEND_SPREAD = 760;         // and the most it waits, the farthest last
  const MEND_QUICK_MS = 380;       // and when a fragrance is opened
  const MEND_QUICK_SPREAD = 160;
  const SEAM_MS = 700;             // the seams' flash fading, once home
  const GLINT_EVERY = 1422;        // px: a glint goes round its crack once in so far
  const GLINT_SPEED = 203;         // px a second
  const GLINT_LONG = 22;           // px, its length
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
  /** The hexagon's outline at (x, y), `r` across, as points for the pen. */
  function hexPoints(x, y, r) {
    const p = [];
    for (let k = 0; k <= 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      p.push(x + Math.cos(a) * r, y + Math.sin(a) * r * LENS_FLAT);
    }
    return p;
  }
  /** What is seen through the lens: the drawing turned and brought nearer,
      about the lens's own middle — on the page's canvas inside a clip of the
      hexagon once the page is whole, and on the lens's own canvas, which the
      lens cuts to its shape, while it is cracked. */
  function drawThrough(cx, cy, turn, t, alpha) {
    ink.save();
    ink.translate(lensX, lensY);
    ink.scale(LENS_NEAR, LENS_NEAR);
    ink.translate(-lensX, -lensY);
    drawWorld(cx, cy, turn + LENS_TURN, t, alpha * 1.7, -99999, -99999);
    ink.restore();
    ink.lineWidth = 1;
    poly(hexPoints(lensX, lensY, LENS - 1)); stroke(LINE, 0.5 * alpha);
    poly(hexPoints(lensX, lensY, LENS * 0.84)); stroke(SECOND, 0.16 * alpha);
  }
  function drawLens(cx, cy, turn, t, alpha) {
    if (handOn < 0.01 || lensX < -9000) return;
    ink.save();
    ink.beginPath();
    const p = hexPoints(lensX, lensY, LENS);
    for (let k = 0; k < p.length; k += 2) (k ? ink.lineTo(p[k], p[k + 1]) : ink.moveTo(p[k], p[k + 1]));
    ink.closePath();
    ink.clip();
    drawThrough(cx, cy, turn, t, alpha * handOn);
    ink.restore();
  }

  // ============================================================
  // THE FRACTURE — a pane of cracked glass laid over the page in a closed
  // shadow root: every piece a copy of the page cut to its shape, a few
  // pixels off its place; the page itself there underneath all along, held
  // back, and scrolling as ever under the glass. THE LENS shows the page
  // whole inside it; the glass about it eases home as it comes and cracks
  // again as it goes. Opening a fragrance mends it for good.
  // ============================================================
  const shattered = root.classList.contains("om-shattered");
  const asked = (location.search.match(/[?&]glass=(fine|broken|rings|split)\b/) || [])[1];
  const glassStyle = asked || GLASS_STYLE;
  if (shattered) root.dataset.glass = glassStyle;
  let gather = shattered ? 0 : 1;          // 0 cracked, 1 whole (eased, per frame)
  let gatherAt = 0;                        // when the mending began (ms), or 0
  let mendMs = MEND_MS, mendSpread = MEND_SPREAD;
  let shards = [];
  let host = null, stage = null, hint = null, lens = null, mendButton = null;
  let pieces = shattered ? "pieces" : "whole";
  let copyWidth = 0;
  let gap = null;                          // the split's broken pieces, and its cracks
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

  /** A polygon cut by a straight line: what is on the side of it where
      side(p) <= 0 (Sutherland and Hodgman's clipping, by one edge). */
  function clipBy(poly, side) {
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
    return out;
  }
  /** THE BROKEN PANE's pieces: for each blow, its radial cracks — points
      out along each at every ring, wandering a little — and its pieces
      between two of them and two rings (or, where a ring is not cracked
      there, more than two); at the blow itself, the crushed pieces
      between two radial cracks and the first ring, some fallen out. Each
      blow's pieces are kept to its own side of the line between it and the
      next, and to the window. */
  function brokenPanes(w, h, blows) {
    const D = Math.hypot(w, h) * 0.5;
    const out = [];
    blows.forEach((b, bi) => {
      const P = [w * b.x, h * b.y];
      const S = b.spokes, R = b.rings.length;
      const turn = random() * Math.PI * 2;
      // The radial cracks: angle j, and its point at ring k.
      const at = [];
      for (let j = 0; j < S; j++) {
        let a = ((j + 0.5 + (random() - 0.5) * 0.62) / S) * Math.PI * 2 + turn;
        const pts = [];
        for (let k = 0; k < R; k++) {
          a += (random() - 0.5) * 2 * BREAK_WANDER * (k ? 1 : 0.4);
          const r = b.rings[k] * D * (k === R - 1 ? 1 : between(0.86, 1.14));
          pts.push([P[0] + Math.cos(a) * r, P[1] + Math.sin(a) * r]);
        }
        at.push(pts);
      }
      // Which stretches of which rings are cracked: the first always (it is
      // the edge of the crushed glass), the last always (it is past the
      // window), the rest not always.
      const keep = (j, k) => k === 0 || k === R - 1 || random() > BREAK_RING_GAP;
      // Kept to this blow's side of the line between it and each other
      // blow, `toward` of the way to it (or the other's share back).
      const sides = blows.filter((o) => o !== b).map((o) => {
        const Q = [w * o.x, h * o.y];
        const t = b.toward != null ? b.toward : 1 - (o.toward != null ? o.toward : 0.5);
        const M = [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
        const nx = Q[0] - P[0], ny = Q[1] - P[1];
        return (p) => (p[0] - M[0]) * nx + (p[1] - M[1]) * ny;
      });
      const cut = (poly) => {
        sides.forEach((side) => { if (poly.length) poly = clipBy(poly, side); });
        [(p) => -p[0], (p) => -p[1], (p) => p[0] - w, (p) => p[1] - h].forEach((side) => { if (poly.length) poly = clipBy(poly, side); });
        return poly;
      };
      // The crushed glass at the blow: two radial cracks' worth to a piece,
      // and BREAK_HOLE of them gone.
      const gone = new Set();
      while (gone.size < Math.min(BREAK_HOLE, Math.floor(S / 2))) gone.add(Math.floor(random() * Math.floor(S / 2)));
      for (let j = 0; j + 1 < S + 1; j += 2) {
        const j1 = j, j2 = Math.min(j + 1, S - 1), j3 = (j + 2) % S;
        const poly = j2 === j1 ? [P, at[j1][0], at[j3][0]] : [P, at[j1][0], at[j2][0], at[j3][0]];
        if (gone.has(j / 2)) continue;
        const c = cut(poly);
        if (c.length >= 3) out.push({ poly: c, blow: bi, ring: 0 });
      }
      // The pieces out from it.
      for (let j = 0; j < S; j++) {
        const A = at[j], B = at[(j + 1) % S];
        let from = 0;
        for (let k = 1; k < R; k++) {
          if (!keep(j, k)) continue;
          const poly = [];
          for (let q = from; q <= k; q++) poly.push(A[q]);
          for (let q = k; q >= from; q--) poly.push(B[q]);
          const c = cut(poly);
          if (c.length >= 3) out.push({ poly: c, blow: bi, ring: from + 1 });
          from = k;
        }
      }
    });
    return out;
  }

  /** THE RINGS' pieces: the disc round the middle, and each band out from
      it cut into its petals — an arc out and an arc back, a point every
      RING_ARC degrees — each kept to the window. */
  function ringPanes(w, h) {
    const D = Math.hypot(w, h) * 0.5, cx = w / 2, cy = h / 2;
    const parts = w < 700 ? RING_PARTS_NARROW : RING_PARTS;
    const arc = (r, a0, a1) => {
      const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / (RING_ARC * Math.PI / 180)));
      const out = [];
      for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
      return out;
    };
    const toWindow = (poly) => {
      [(p) => -p[0], (p) => -p[1], (p) => p[0] - w, (p) => p[1] - h].forEach((side) => { if (poly.length) poly = clipBy(poly, side); });
      return poly;
    };
    const out = [];
    let offset = random() * Math.PI * 2;
    RING_RADII.forEach((share, k) => {
      const r1 = share * D, r0 = k ? RING_RADII[k - 1] * D : 0;
      const n = parts[k];
      if (n <= 1) {
        const poly = toWindow(arc(r1, 0, Math.PI * 2).slice(0, -1));
        if (poly.length >= 3) out.push({ poly, band: k, mid: r1 * 0.6 });
        return;
      }
      const step = (Math.PI * 2) / n;
      offset += step / 2;                                   // a half step round from the band inside
      const cuts = [];
      for (let j = 0; j < n; j++) cuts.push(offset + j * step + (random() - 0.5) * step * 0.24);
      for (let j = 0; j < n; j++) {
        const a0 = cuts[j], a1 = j + 1 < n ? cuts[j + 1] : cuts[0] + Math.PI * 2;
        const poly = toWindow(arc(r1, a0, a1).concat(arc(r0, a1, a0)));
        if (poly.length >= 3) out.push({ poly, band: k, mid: (r0 + r1) / 2 });
      }
    });
    return out;
  }

  /** THE SPLIT'S GAP: its broken pieces — random polygons, most of them
      small, a few larger, each a few corners at uneven angles and uneven
      reaches, turning very slowly — and two cracks wandering down it. */
  function gapOf(w, h, push) {
    const cx = w / 2, n = Math.round(push * 2 * h * GAP_SHARDS);
    const shards = [];
    for (let i = 0; i < n; i++) {
      const r = 2.5 + Math.pow(random(), 2.4) * 30;
      const corners = 3 + Math.floor(random() * 4);
      const angles = [];
      for (let k = 0; k < corners; k++) angles.push(random() * Math.PI * 2);
      angles.sort((a, b) => a - b);
      shards.push({
        x: cx + (random() * 2 - 1) * push * 0.9, y: random() * h,
        pts: angles.map((a) => [Math.cos(a) * r * between(0.4, 1), Math.sin(a) * r * between(0.4, 1)]),
        turn: random() * Math.PI * 2, spin: between(-0.08, 0.08),
        ink: between(0.3, 0.75), fill: random() < 0.45 ? between(0.04, 0.14) : 0, bright: random() < 0.1,
      });
    }
    const cracks = [0, 1].map(() => {
      const out = [];
      let x = cx + (random() - 0.5) * push * 0.6;
      for (let y = -10; y <= h + 30; y += between(16, 34)) {
        x = clamp(x + (random() - 0.5) * push * 0.42, cx - push * 0.8, cx + push * 0.8);
        out.push(x, y);
      }
      return out;
    });
    return { cx, push, shards, cracks, alpha: 1 };
  }
  /** The gap drawn on the house's own ground: the broken pieces where they
      lie, and as the halves close, drawn in towards the seam and fading,
      until they are faint behind the writing. */
  function drawGap(t, whole) {
    const g = gap;
    const a = 1 - (1 - GAP_FAINT) * whole;
    const pull = 1 - 0.55 * whole, small = 1 - 0.35 * whole;
    g.alpha = a;
    ink.lineWidth = 1;
    ink.strokeStyle = rgba(LINE, 1);
    ink.fillStyle = rgba(LINE, 1);
    g.shards.forEach((s) => {
      const th = s.turn + (REDUCE ? 0 : t * s.spin), c = Math.cos(th), sn = Math.sin(th);
      const x = g.cx + (s.x - g.cx) * pull, y = s.y;
      ink.beginPath();
      s.pts.forEach(([px, py], k) => {
        const X = x + (px * c - py * sn) * small, Y = y + (px * sn + py * c) * small;
        if (k) ink.lineTo(X, Y); else ink.moveTo(X, Y);
      });
      ink.closePath();
      if (s.fill) { ink.globalAlpha = s.fill * a; ink.fill(); }
      ink.globalAlpha = Math.min(1, s.ink * (s.bright ? 1.4 : 1) * a);
      ink.stroke();
    });
    ink.globalAlpha = 0.45 * a;
    g.cracks.forEach((p) => {
      ink.beginPath();
      for (let i = 0; i < p.length; i += 2) {
        const X = g.cx + (p[i] - g.cx) * pull;
        if (i) ink.lineTo(X, p[i + 1]); else ink.moveTo(X, p[i + 1]);
      }
      ink.stroke();
    });
    ink.globalAlpha = 1;
  }

  /** The page's flow, copied whole, without an id, a tab stop or anything
      else that could be found or reached. */
  function copyFlow() {
    const flow = document.createElement("div");
    flow.className = "human-page om-page om-flow";
    flowParts().forEach((el) => flow.appendChild(el.cloneNode(true)));
    return scrub(flow);
  }
  const flowParts = () => [...document.querySelectorAll("body > main, body > .house-credit, body > .human-foot")];
  /** A copy made unfindable and unreachable: no ids, no labels by id, no tab stops. */
  function scrub(el) {
    const all = [el].concat([...el.querySelectorAll("*")]);
    all.forEach((e) => {
      if (e.hasAttribute("id")) e.removeAttribute("id");
      if (e.hasAttribute("aria-labelledby")) e.removeAttribute("aria-labelledby");
      if (e.matches("a, button, summary, input, [tabindex]")) e.setAttribute("tabindex", "-1");
    });
    return el;
  }

  /** THE PIECES FOLLOW THE PAGE (2026-10-13 — "whenever you click on
      anything, the glass gets fixed and it is buggy ... When you click on
      the perfumes, the break should not be fixed"). Each piece holds a copy
      of the page, so a fragrance opened under the break used to have to
      mend it first — the copies would have gone on showing it shut — and
      the press was held while it mended and given back after, which was
      the bug. Now every change to the page is made to every copy too, as
      it happens: an attribute (a fragrance's `open`, the measured height
      and fade house.js opens it with, a class) set on the same element of
      each copy, so its opening runs in the pieces in step with the page;
      anything added or taken away (the notes' buttons, a window's text)
      copied over whole. An element is found in a copy by where it stands —
      the same child of the same child — since the copies are the page's
      own shape. */
  const MIRRORED_NOT = new Set(["id", "tabindex", "aria-labelledby"]);
  let mirror = null;
  function pathOf(node, tops) {
    const path = [];
    for (let n = node; n; n = n.parentElement) {
      const top = tops.indexOf(n);
      if (top >= 0) { path.unshift(top); return path; }
      if (!n.parentElement) return null;
      path.unshift(Array.prototype.indexOf.call(n.parentElement.children, n));
    }
    return null;
  }
  function inCopy(copy, path) {
    let n = copy.children[path[0]];
    for (let i = 1; n && i < path.length; i++) n = n.children[path[i]];
    return n || null;
  }
  function followPage(copies) {
    const tops = flowParts();
    mirror = new MutationObserver((records) => {
      const whole = [];
      records.forEach((r) => {
        const el = r.type === "characterData" ? r.target.parentElement : r.target;
        if (!el || !el.isConnected) return;
        if (r.type === "attributes") {
          if (MIRRORED_NOT.has(r.attributeName)) return;
          const path = pathOf(el, tops);
          if (!path) return;
          const v = el.getAttribute(r.attributeName);
          copies().forEach((copy) => {
            const twin = inCopy(copy, path);
            if (!twin) return;
            if (v === null) twin.removeAttribute(r.attributeName);
            else if (twin.getAttribute(r.attributeName) !== v) twin.setAttribute(r.attributeName, v);
          });
        } else if (!whole.some((w) => w.contains(el))) {
          for (let i = whole.length - 1; i >= 0; i--) if (el.contains(whole[i])) whole.splice(i, 1);
          whole.push(el);
        }
      });
      whole.forEach((el) => {
        const path = pathOf(el, tops);
        if (!path) return;
        copies().forEach((copy) => {
          const twin = inCopy(copy, path);
          if (twin) twin.replaceWith(scrub(el.cloneNode(true)));
        });
      });
    });
    tops.forEach((el) => mirror.observe(el, { attributes: true, childList: true, characterData: true, subtree: true }));
  }

  function buildShards() {
    // The page's own width — the window's less its scrollbar, which the
    // root does not say (its gutter is held open) — so the copies are laid
    // out exactly as the page is.
    const w = page.clientWidth || root.clientWidth, h = window.innerHeight;
    copyWidth = w;
    const broken = glassStyle === "broken", rings = glassStyle === "rings", split = glassStyle === "split";
    const push = clamp(w * SPLIT_PUSH, SPLIT_PUSH_LEAST, SPLIT_PUSH_MOST);
    const blows = broken ? (w < 700 ? BREAK_BLOWS_NARROW : BREAK_BLOWS_WIDE) : (w < 700 ? GLASS_BLOWS_NARROW : GLASS_BLOWS_WIDE);
    // THE PIECES: the rings', bands round the middle cut into petals; the
    // fine glass's, a Voronoi cell round each of the seeds set in rings
    // round its blows; or the broken pane's web.
    let panes;
    if (split) {
      const m = w / 2;
      panes = [{ poly: [[0, 0], [m, 0], [m, h], [0, h]], side: -1 }, { poly: [[m, 0], [w, 0], [w, h], [m, h]], side: 1 }];
      gap = gapOf(w, h, push);
    } else if (rings) panes = ringPanes(w, h);
    else if (broken) panes = brokenPanes(w, h, blows);
    else {
      const D = Math.hypot(w, h) * 0.5;
      const seeds = [];
      const from = [];                   // which blow each seed is from
      blows.forEach((b, bi) => {
        const P = [w * b.x, h * b.y];
        seeds.push(P); from.push(bi);
        b.rings.forEach(([f, n], k) => {
          for (let j = 0; j < n; j++) {
            const a = ((j + 0.5 + (random() - 0.5) * 0.7) / n) * Math.PI * 2 + k * 0.61 + bi;
            const r = f * D * between(0.85, 1.15);
            seeds.push([P[0] + Math.cos(a) * r, P[1] + Math.sin(a) * r * 0.86]);
            from.push(bi);
          }
        });
      });
      panes = seeds.map((sd, i) => ({ poly: cellOf(i, seeds, w, h), blow: from[i], ring: 1 }));
    }
    const flow = copyFlow();

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
      // Nothing here asks to be a layer of its own (no will-change, no 3D
      // transform): a piece cut to its shape on a layer of its own is a
      // mask the browser lays again every frame, and fifty of them held
      // the cracked page at a quarter of the whole page's frames.
      ".shard{position:absolute;transform-origin:var(--ox) var(--oy)}" +
      // A piece is glass with the page in it: the void behind it seen
      // through dimly, and clearly only through the cracks.
      ".om-flow{position:absolute;margin:0}" +
      ".shard>.om-flow{background:rgba(12,11,15,0.7)}" +
      ".sheen{position:absolute;inset:0;background:linear-gradient(var(--sa,115deg),rgba(255,240,214,0) 0%,rgba(255,240,214,0.025) 44%,rgba(255,240,214,0.07) 50%,rgba(255,240,214,0.015) 60%,rgba(255,240,214,0) 100%)}" +
      ".edge{position:absolute;left:0;top:0;overflow:visible}" +
      ".edge polygon{fill:none;stroke:rgb(" + gold + " / 0.55);stroke-width:1;vector-effect:non-scaling-stroke}" +
      // The broken pane's cracks: a bright edge, as a broken edge of glass
      // catches the light, and a soft one beside it — the glass's thickness.
      ".broken .edge polygon{stroke:rgb(255 240 214 / 0.62)}" +
      ".broken .edge polygon.thick{stroke:rgb(" + gold + " / 0.16);stroke-width:3.2}" +
      ".broken .shard>.om-flow{background:rgba(12,11,15,0.62)}" +
      // The rings: nothing of glass — the seams the house's gold, and every
      // other band a faint warmth of it.
      ".rings .sheen{background:rgba(" + LINE.join(",") + ",0.035)}" +
      ".rings .edge polygon{stroke:rgb(" + gold + " / 0.5)}" +
      // A glint: a little run of light along a crack, a layer of its own
      // so that its going round costs nothing but itself.
      ".glint{position:absolute;left:0;top:0;width:" + GLINT_LONG + "px;height:1px;margin:-0.5px 0 0 -" + GLINT_LONG / 2 + "px;opacity:0;will-change:transform,opacity;" +
        "background:linear-gradient(90deg,rgba(255,236,200,0),rgb(255 236 200) 45%,rgb(255 236 200) 55%,rgba(255,236,200,0))}" +
      // The lens: the page whole, cut to the hexagon, over the glass.
      ".lens{position:absolute;left:0;top:0;width:" + (LENS * 2) + "px;height:" + (LENS * 2 * LENS_FLAT) + "px;opacity:0;" +
        "clip-path:polygon(" + hexPoints(LENS, LENS * LENS_FLAT, LENS).reduce((o, v, k, a) => (k % 2 ? o : o.concat([[v, a[k + 1]]])), []).slice(0, 6).map((q) => q[0].toFixed(1) + "px " + q[1].toFixed(1) + "px").join(",") + ")}" +
      ".lens>.ground{position:absolute;inset:0;background:#0c0b0f}" +
      // Its rim, outside the cut: a gold hairline round the hexagon and a
      // fainter one a little outside it, the edge of a thick piece of glass.
      ".rim{position:absolute;left:-6px;top:-6px;overflow:visible;opacity:0}" +
      ".rim polygon{fill:none;vector-effect:non-scaling-stroke}" +
      ".lens>canvas{position:absolute;left:0;top:0;width:100%;height:100%}" +
      ".hint{position:absolute;left:50%;bottom:7vh;transform:translateX(-50%);display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgb(" + gold + " / 0.85);opacity:0;transition:opacity 1.2s ease}" +
      ".hint.shown{opacity:1}" +
      ".hint i{display:block;width:9px;height:9px;border:1px solid currentColor;transform:rotate(45deg)}" +
      // The split: its halves' inner edges a gold hairline.
      ".split .edge polyline{fill:none;stroke:rgb(" + gold + " / 0.7);stroke-width:1;vector-effect:non-scaling-stroke}" +
      "</style>" +
      '<div class="stage' + (broken ? " broken" : rings ? " rings" : split ? " split" : "") + '" inert><div class="field"></div><p class="hint"><i></i>Hover: the hexagon makes it whole<i></i></p></div>';
    stage = shadow.querySelector(".stage");
    const field = shadow.querySelector(".field");
    hint = shadow.querySelector(".hint");
    if (TOUCH || split) hint.remove();

    shards = [];
    const bandTurn = [];
    panes.forEach((pane) => {
      const poly = pane.poly;
      if (poly.length < 3 || Math.abs(polygonArea(poly)) < 30) return;
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
      el.style.setProperty("--sa", Math.round(between(60, 170)) + "deg");
      const copy = flow.cloneNode(true);
      copy.style.left = -bx + "px";
      copy.style.top = -by + "px";
      copy.style.width = w + "px";
      copy.style.minHeight = h + "px";
      el.appendChild(copy);
      const sheen = document.createElement("div");
      sheen.className = "sheen";
      // A broken piece out of true catches the light its own way: most
      // dimly, a few brightly.
      sheen.style.opacity = (rings ? (pane.band % 2 ? 1 : 0) : broken ? (random() < 0.18 ? between(1.6, 2.6) : between(0.2, 1.1)) : between(0.3, 1)).toFixed(2);
      if (!split && (!rings || pane.band % 2)) el.appendChild(sheen);
      const pts = local.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
      // (A half of the split is edged only where it was cut.)
      const inner = pane.side < 0 ? bw - 0.5 : 0.5;
      el.insertAdjacentHTML("beforeend", '<svg class="edge" width="' + bw + '" height="' + bh + '" viewBox="0 0 ' + bw + " " + bh + '">' +
        (split ? '<polyline points="' + inner + ",0 " + inner + "," + bh + '"/>' :
          (broken ? '<polygon class="thick" points="' + pts + '"/>' : "") + '<polygon points="' + pts + '"/>') + "</svg>");
      field.appendChild(el);
      let around = 0;
      for (let k = 0; k < poly.length; k++) { const q = poly[(k + 1) % poly.length]; around += Math.hypot(q[0] - poly[k][0], q[1] - poly[k][1]); }

      // WHERE IT STANDS: a few pixels out from the blow it broke from, a
      // little out of true, and a hair smaller — the farther, the more.
      // On a phone's narrow window, half as far again.
      // The broken pane's pieces a little further, and more out of true:
      // the ones at the blow pushed in the most, as glass is.
      const g = w < 700 ? 0.5 : 1;
      let tx, ty, rz, k;
      if (split) {
        tx = pane.side * push; ty = 0; rz = 0; k = 1;
      } else if (rings) {
        // Its band turned about the middle — every piece of a band by the
        // same angle, the next band the other way — and the petal a pixel
        // in or out: a turn about its own middle and the move of that
        // middle round the window's.
        const cx = w / 2, cy = h / 2;
        if (!bandTurn[pane.band]) bandTurn[pane.band] = pane.band === 0 ? 0 : (pane.band % 2 ? 1 : -1) * between(1, 1.33) * RING_SHIFT * g / pane.mid;
        const th = bandTurn[pane.band];
        const ox = gx - cx, oy = gy - cy, od = Math.hypot(ox, oy) || 1;
        const lift = pane.band === 0 ? 0 : between(-1, 1) * RING_LIFT * g;
        tx = cx + ox * Math.cos(th) - oy * Math.sin(th) - gx + (ox / od) * lift;
        ty = cy + ox * Math.sin(th) + oy * Math.cos(th) - gy + (oy / od) * lift;
        rz = (th * 180) / Math.PI;
        k = 1;
      } else {
        const b = blows[pane.blow], P = [w * b.x, h * b.y];
        const dx = gx - P[0], dy = gy - P[1], dist = Math.hypot(dx, dy) || 1;
        const ux = dx / dist, uy = dy / dist;
        const out = broken
          ? (BREAK_SHIFT * (0.6 + random()) + (pane.ring === 0 ? 2.5 : 0)) * g
          : (GLASS_SHIFT * (0.5 + random()) + dist * 0.0032) * g;
        const turnMost = broken ? BREAK_TURN : GLASS_TURN;
        tx = ux * out + between(-0.6, 0.6) * g; ty = uy * out + between(-0.6, 0.6) * g;
        k = 1 - (0.0015 + random() * (broken ? 0.005 : 0.0035)) * g;
        rz = between(-turnMost, turnMost) * g;
      }
      shards.push({
        // (The broken pane's two lines fade together, as one drawing.)
        el, copy, sheen, gx, gy, poly, around, line: el.querySelector(broken || split ? ".edge" : ".edge polygon"),
        glint: !rings && !split && random() < (broken ? 0.35 : 0.25) ? { at: random() * GLINT_EVERY, el: null, shown: -1 } : null,
        tx, ty, k, rz, band: pane.band, mid: pane.mid, split: split ? pane.side : 0,
        shake: [random() * 6.283, random() * 6.283, random() * 6.283],
        wait: 0, p: -1, near: -1, edge: 0.85, edgeShown: -1, now: [0, 0, 0, 1], long: broken || rings,
      });
    });
    // The glints, over every piece.
    shards.forEach((s) => {
      if (!s.glint) return;
      s.glint.el = document.createElement("i");
      s.glint.el.className = "glint";
      field.appendChild(s.glint.el);
    });

    // THE LENS, over the glass: the page whole, the drawing seen through it
    // on a canvas of its own, cut to the hexagon. Not on a phone.
    if (!TOUCH && !split) {
      lens = { el: document.createElement("div"), sky: document.createElement("canvas"), copy: flow.cloneNode(true), shown: -1 };
      lens.el.className = "lens";
      const ground = document.createElement("div");
      ground.className = "ground";
      lens.el.appendChild(ground);
      lens.el.appendChild(lens.sky);
      lens.copy.style.width = w + "px";
      lens.copy.style.minHeight = h + "px";
      lens.el.appendChild(lens.copy);
      lens.sky.width = Math.round(LENS * 2 * ratio);
      lens.sky.height = Math.round(LENS * 2 * LENS_FLAT * ratio);
      lens.ink = lens.sky.getContext("2d");
      shadow.querySelector(".stage").appendChild(lens.el);
      const hex = (r, pad) => hexPoints(LENS + pad, LENS * LENS_FLAT + pad, r).slice(0, 12).reduce((o, v, k) => o + (k % 2 ? "," : " ") + v.toFixed(1), "").trim();
      const rw = LENS * 2 + 12, rh = Math.round(LENS * 2 * LENS_FLAT) + 12;
      shadow.querySelector(".stage").insertAdjacentHTML("beforeend",
        '<svg class="rim" width="' + rw + '" height="' + rh + '" viewBox="0 0 ' + rw + " " + rh + '">' +
        '<polygon points="' + hex(LENS + 4, 6) + '" style="stroke:rgb(' + gold + ' / 0.2)"/>' +
        '<polygon points="' + hex(LENS - 0.5, 6) + '" style="stroke:rgb(' + gold + ' / 0.75)"/></svg>');
      lens.rim = shadow.querySelector(".rim");
    }
    page.insertBefore(host, canvas.nextSibling);
    root.classList.add("om-held");
    followPage(() => shards.map((s) => s.copy).concat(lens ? [lens.copy] : []));

    // THE BUTTON IN THE TOP RIGHT (2026-10-11, last — "put a button on the
    // top right to fix the page"): Mend the break (it said "Mend the glass"
    // until 2026-10-13), for good, from where it
    // is — a wave across the window from the top right corner. On the page
    // itself, over the glass, since the glass takes no press; gone once the
    // page is whole.
    mendButton = document.createElement("button");
    mendButton.type = "button";
    mendButton.className = "om-mend";
    mendButton.innerHTML = '<svg class="om-mend-mark" viewBox="0 0 16 14" width="16" height="14" aria-hidden="true"><polygon points="4.5,1 11.5,1 15,7 11.5,13 4.5,13 1,7"/></svg><span>Mend the break</span>';
    // THE SPLIT'S BUTTON is OM, in the middle of the gap, in its place.
    if (split) {
      mendButton.className = "om-mend om-join";
      mendButton.setAttribute("aria-label", "Om: bring the page together");
      mendButton.innerHTML = '<svg class="om-join-mark" viewBox="0 0 64 56" aria-hidden="true"><polygon points="17,1 47,1 63,28 47,55 17,55 1,28"/></svg><span>OM</span>';
      mendButton.style.left = (w / 2) + "px";
    }
    mendButton.addEventListener("click", () => {
      const r = mendButton.getBoundingClientRect();
      mend(r.left + r.width / 2, r.top + r.height / 2);
    });
    // First in the page's order, so the keyboard comes to it first: since
    // 2026-10-13 nothing else mends the page (a key reaching into it did).
    page.insertBefore(mendButton, page.firstChild);
    requestAnimationFrame(() => { if (mendButton) mendButton.classList.add("shown"); });
  }

  /** Whether a point is inside a piece's outline, and how far it is from it
      (0 inside). */
  function inside(poly, x, y) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function distTo(poly, x, y) {
    if (inside(poly, x, y)) return 0;
    let d = Infinity;
    for (let i = 0; i < poly.length; i++) {
      const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
      const vx = bx - ax, vy = by - ay, L = vx * vx + vy * vy || 1;
      const t = clamp(((x - ax) * vx + (y - ay) * vy) / L, 0, 1);
      d = Math.min(d, Math.hypot(ax + vx * t - x, ay + vy * t - y));
    }
    return d;
  }

  /** Write a style only when it has changed enough to see. */
  function opacityTo(s, key, el, v) {
    if (!el || Math.abs(v - s[key]) < 0.004) return;
    s[key] = v;
    el.style.opacity = v.toFixed(3);
  }

  /** One frame of the glass: under the page's scroll, each piece where it
      stands — eased home near the lens — or on its way home for good. A
      style is written only when it has changed. */
  let scrolled = null;
  function placeShards(now) {
    const sy = window.scrollY || 0;
    const moved = sy !== scrolled;
    scrolled = sy;
    const reach = LENS * GLASS_NEAR, on = TOUCH ? 0 : handOn;
    shards.forEach((s) => {
      if (moved) s.copy.style.transform = "translate(0," + (-sy) + "px)";
      let p = 0;
      if (gatherAt) p = ease(clamp((now - gatherAt - s.wait) / mendMs, 0, 1));
      // Near the lens, home: the nearer, the more — by its middle for the
      // fine glass's small pieces, and by its nearest edge for the broken
      // pane's long ones, whose middles can stand far from the hand.
      let near = 0;
      if (!s.split && lensX > -9000 && on > 0) {
        if (s.long) near = on * (1 - ease(clamp(distTo(s.poly, lensX, lensY) / (LENS * BREAK_NEAR), 0, 1)));
        else {
          const d = Math.hypot(s.gx - lensX, (s.gy - lensY) / LENS_FLAT);
          near = on * (1 - ease(clamp((d - LENS * 0.6) / (reach - LENS * 0.6), 0, 1)));
        }
      }
      const home = Math.max(p, near);
      // The crack shows as long as the piece is out of place; the seam
      // flashes as it lands for good, and fades once it is home.
      let edge = 0.85 * (1 - home);
      if (gatherAt) {
        const landed = now - gatherAt - s.wait - mendMs;
        edge += p > 0.7 ? (landed < 0 ? (p - 0.7) / 0.3 : Math.max(0, 1 - landed / SEAM_MS)) : 0;
      }
      s.edge = clamp(edge, 0, 1);
      opacityTo(s, "edgeShown", s.line, s.edge);
      // THE SPLIT'S HALVES SHAKE as they come together: hardest a little
      // after they set off, and still by the time they meet.
      if (s.split && gatherAt && home < 1) {
        const life = clamp((now - gatherAt) / mendMs, 0, 1);
        const amp = REDUCE ? 0 : SHAKE * Math.min(1, life * 5) * Math.pow(1 - life, 1.4);
        const w2 = (now / 1000) * SHAKE_HZ * Math.PI * 2, [f0, f1, f2] = s.shake;
        const n = s.now;
        n[0] = s.tx * (1 - home) + amp * (0.7 * Math.sin(w2 + f0) + 0.3 * Math.sin(w2 * 1.73 + f1));
        n[1] = amp * 0.35 * Math.sin(w2 * 1.31 + f2);
        n[2] = (amp / SHAKE) * 0.18 * Math.sin(w2 * 0.87 + f1) * s.split;
        n[3] = 1;
        s.p = home;
        s.el.style.transform = "translate(" + n[0].toFixed(2) + "px," + n[1].toFixed(2) + "px) rotate(" + n[2].toFixed(3) + "deg)";
        return;
      }
      if (Math.abs(home - s.p) < 0.002) return;
      s.p = home;
      const q = 1 - home;
      const n = s.now;
      n[0] = s.tx * q; n[1] = s.ty * q; n[2] = s.rz * q; n[3] = 1 - (1 - s.k) * q;
      s.el.style.transform = "translate(" + n[0].toFixed(2) + "px," + n[1].toFixed(2) + "px) rotate(" + n[2].toFixed(3) + "deg) scale(" + n[3].toFixed(4) + ")";
    });
    if (lens) {
      const o = gatherAt ? 0 : handOn;
      opacityTo(lens, "shown", lens.el, o);
      if (lens.rim) lens.rim.style.opacity = lens.shown.toFixed(3);
      if (o > 0.004 && lensX > -9000) {
        const lx = lensX - LENS, ly = lensY - LENS * LENS_FLAT;
        lens.el.style.transform = "translate(" + lx.toFixed(1) + "px," + ly.toFixed(1) + "px)";
        if (lens.rim) lens.rim.style.transform = lens.el.style.transform;
        lens.copy.style.transform = "translate(" + (-lx).toFixed(1) + "px," + (-ly - sy).toFixed(1) + "px)";
      }
    }
    placeGlints(now);
  }

  /** The glints, each so far round its crack — where its piece stands
      now (its offset, turn and scale about its middle, as its style has
      them) — and only as bright as the crack is. */
  function placeGlints(now) {
    const t = REDUCE ? 0 : now / 1000;
    shards.forEach((s) => {
      const gl = s.glint;
      if (!gl) return;
      let from = (t * GLINT_SPEED + gl.at) % GLINT_EVERY;
      const lit = from <= s.around && s.edge > 0.01 ? 0.9 * s.edge : 0;
      opacityTo(gl, "shown", gl.el, lit);
      if (!lit) return;
      const [tx, ty, rz, k] = s.now;
      const a = (rz * Math.PI) / 180, ca = Math.cos(a) * k, sa = Math.sin(a) * k;
      for (let i = 0; i < s.poly.length; i++) {
        const p0 = s.poly[i], p1 = s.poly[(i + 1) % s.poly.length];
        const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
        if (from > L) { from -= L; continue; }
        const x = p0[0] + ((p1[0] - p0[0]) * from) / L - s.gx, y = p0[1] + ((p1[1] - p0[1]) * from) / L - s.gy;
        const X = s.gx + tx + ca * x - sa * y, Y = s.gy + ty + sa * x + ca * y;
        const turn = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) + a;
        gl.el.style.transform = "translate(" + X.toFixed(1) + "px," + Y.toFixed(1) + "px) rotate(" + turn.toFixed(3) + "rad)";
        break;
      }
    });
  }

  /** The mending for good, from a point: the pieces nearest it first, in
      a wave — quickly when a fragrance has been opened. */
  function mend(x, y, quick) {
    if (gatherAt || !host) return;
    mendMs = glassStyle === "split" ? SPLIT_MS : quick ? MEND_QUICK_MS : MEND_MS;
    mendSpread = glassStyle === "split" ? 0 : quick ? MEND_QUICK_SPREAD : MEND_SPREAD;
    gatherAt = performance.now();
    const far = Math.hypot(window.innerWidth, window.innerHeight);
    shards.forEach((s) => { s.wait = clamp(Math.hypot(s.gx - x, s.gy - y) / far, 0, 1) * mendSpread; });
    pieces = "gathering";
    root.dataset.om = pieces;
    if (hint) hint.classList.remove("shown");
    if (mendButton) {
      const button = mendButton;
      mendButton = null;
      // The focus, if it was on the button, goes to the page's own heading
      // rather than nowhere.
      if (document.activeElement === button) { const h1 = document.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); } }
      button.classList.remove("shown");
      button.disabled = true;
      window.setTimeout(() => button.remove(), 600);
    }
    for (let k = 0; k < 40 && !REDUCE; k++) {
      sparks.push({ a: random() * Math.PI * 2, r: portalR(), v: between(80, 220), out: between(30, 120), life: between(0.5, 1.1), age: 0 });
    }
  }
  function wholeNow() {
    pieces = "whole";
    root.dataset.om = pieces;
    // The page under the pieces is the same page, laid out the same way and
    // scrolled the same way, so it is shown at once — with nothing of its
    // own fading in — and the pieces, now exactly over it, are faded off it.
    root.classList.add("om-landing");
    root.classList.remove("om-shattered");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.remove("om-landing");
      if (stage) stage.classList.add("gone");
      window.setTimeout(() => {
        if (mirror) { mirror.disconnect(); mirror = null; }
        if (host) host.remove();
        host = stage = hint = lens = null; shards = [];
      }, 760);
    }));
  }
  const portalR = () => Math.min(W * (W < 700 ? 0.46 : 0.36), 560) * 0.62;

  if (shattered) {
    size();
    buildShards();
    // NOTHING PRESSED MENDS IT (2026-10-13 — "whenever you click on
    // anything, the glass gets fixed and it is buggy. fix that ... When you
    // click on the perfumes, the break should not be fixed"): a fragrance
    // opened, a dropdown, a link, a key — each does what it does on the page
    // at once, the pieces following it (followPage), and the page stays
    // broken. Opening a fragrance mended it for good until then, the press
    // held while it did, and a key reaching into the page mended it too.
    // What mends it is the button in the top right — and the hexagon, while
    // it is there.
    // A window changing size breaks the pieces' geometry: it is simply
    // whole at once.
    window.addEventListener("resize", () => {
      if (pieces !== "pieces") return;
      mend(window.innerWidth / 2, window.innerHeight * 0.44);
      gatherAt -= mendMs + mendSpread;
    });
    // THE SPLIT'S PRESSES: what is seen of each half stands up to `push` off
    // where the page under it is, so a press on a fragrance would reach
    // whatever is under that point on the page instead — another line, or
    // nothing. While it is split, a press on the page is taken to what is
    // seen there: on a half, the page that half shows at that point; in the
    // gap, nothing. The chrome over it (OM, the Menu, the scale, a notes
    // window) is pressed as it is, and a press from the keyboard, which has
    // no point, is left be.
    if (glassStyle === "split") {
      let passing = false;
      window.addEventListener("click", (e) => {
        if (passing || pieces === "whole" || !gap || !e.detail) return;
        const flow = flowParts(), t = e.target;
        if (!(t === document.body || t === root || flow.some((el) => el.contains(t)))) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const x = e.clientX, y = e.clientY;
        const left = shards.find((s) => s.split < 0), right = shards.find((s) => s.split > 0);
        const off = left && x < gap.cx + left.now[0] ? left.now[0]
          : right && x > gap.cx + right.now[0] ? right.now[0] : null;
        if (off == null) return;
        const under = document.elementFromPoint(x - off, y);
        if (!under || !flow.some((el) => el.contains(under))) return;
        passing = true;
        try { under.click(); } finally { passing = false; }
      }, true);
    }
    // On a phone the break mends by itself after a moment — but not the
    // split, whose whole point is the OM that brings it together.
    if (TOUCH && glassStyle !== "split") window.setTimeout(() => mend(window.innerWidth / 2, window.innerHeight * 0.44), AUTO_MS);
    else window.setTimeout(() => { if (hint && !gatherAt && handX < -9000) hint.classList.add("shown"); }, HINT_MS);
    // FOR THE TESTS, which cannot reach into the closed glass: how many
    // pieces, how wide the page in them is laid out, how far home the
    // pieces about a point are (0 cracked, 1 home), and how much the lens
    // is shown.
    window.OmGlass = {
      pieces: () => shards.length,
      width: () => copyWidth,
      homeAt: (x, y) => {
        const by = shards.filter((s) => inside(s.poly, x, y));
        return by.length ? by.reduce((n, s) => n + Math.max(0, s.p), 0) / by.length : -1;
      },
      lens: () => (lens ? Math.max(0, lens.shown) : 0),
      style: () => glassStyle,
      // Each piece's outline on the window, for the tests to read the shape
      // of the glass by.
      outlines: () => shards.map((s) => s.poly.map((q) => [Math.round(q[0]), Math.round(q[1])])),
      // How many of the copies (the pieces' and the hexagon's) have the
      // page's n-th fragrance open, and how many copies there are — for the
      // pieces following the page.
      // Each band of the rings: how far it is turned (degrees), how much its
      // pieces differ in that, and how far that moves its middle (px).
      turns: () => {
        const by = new Map();
        shards.forEach((s) => { if (s.band == null) return; if (!by.has(s.band)) by.set(s.band, []); by.get(s.band).push(s); });
        return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([band, list]) => {
          const degs = list.map((s) => s.rz);
          const deg = degs[0];
          return { band, deg, spread: Math.max(...degs) - Math.min(...degs), px: (deg * Math.PI / 180) * list[0].mid };
        });
      },
      // The split: how far each half is pushed, where each half stands now
      // (its offset across), its broken pieces and how strongly they are drawn.
      split: () => (gap ? { push: gap.push, offsets: shards.map((s) => s.now[0]), pieces: gap.shards.length, alpha: gap.alpha } : null),
      openIn: (n) => {
        const copies = shards.map((s) => s.copy).concat(lens ? [lens.copy] : []);
        return { open: copies.filter((c) => { const part = c.querySelectorAll(".human-part")[n]; return part && part.open; }).length, of: copies.length };
      },
    };
  }

  // ============================================================
  // KEEPING UP
  // ============================================================
  const hand = (event) => {
    if (event.pointerType === "touch") return;
    handX = event.clientX; handY = event.clientY;
    if (lensX < -9000) { lensX = handX; lensY = handY; }
    if (hint && pieces === "pieces") hint.classList.remove("shown");
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

    const want = handX < -9000 ? 0 : 1;
    handOn += (want - handOn) * (REDUCE ? 1 : 0.12);
    if (handX > -9000) {
      lensX += (handX - lensX) * (REDUCE ? 1 : LENS_LAG);
      lensY += (handY - lensY) * (REDUCE ? 1 : LENS_LAG);
    }

    // How whole the page is.
    if (shattered) {
      if (gatherAt) {
        const all = clamp((now - gatherAt) / (mendMs + mendSpread), 0, 1);
        gather = ease(all);
        if (all >= 1 && pieces === "gathering") wholeNow();
      }
      if (shards.length) placeShards(now);
    }
    // The quiet over the column, coming in as the page mends: worked out
    // again only when it has changed (or the window has).
    if (!stops || hush !== gather || stops.w !== W) {
      hush = gather;
      stops = quietStops();
      stops.w = W;
      keepNow = 1 - (1 - QUIET) * hush;
    }

    ink = mainInk;
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
    if (gap) drawGap(t, gather);
    if (!lens || gatherAt) drawLens(cx, cy, turn, t, pageAlpha);
    else if (lens.shown > 0.004 && lensX > -9000) {
      // Seen through the lens while the page is cracked: the page whole —
      // its quiet over the column, its word small — on the lens's canvas.
      const keep = stops, keepHush = hush, keepK = keepNow;
      hush = 1; stops = quietStops(); keepNow = QUIET;
      ink = lens.ink;
      ink.setTransform(ratio, 0, 0, ratio, -(lensX - LENS) * ratio, -(lensY - LENS * LENS_FLAT) * ratio);
      ink.clearRect(lensX - LENS, lensY - LENS * LENS_FLAT, LENS * 2, LENS * 2 * LENS_FLAT);
      drawWorld(cx, cy, turn, t, 0.75, -99999, -99999);
      drawWord(cx, cy - small * 0.1, small, t, 0.24, -99999, -99999);
      drawThrough(cx, cy, turn, t, 0.75);
      ink = mainInk;
      stops = keep; hush = keepHush; keepNow = keepK;
    }
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

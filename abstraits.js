// ============================================================
// LES ABSTRAITS — houses/les-abstraits.html
//
// The sixth house, and until 2026-09-25 it had no ground of its own.
// The owner: "i want there to be an old armoire on one of the sides,
// which feels old, and has some iris notes in it. I want it to feel
// like the perfume belle ame ... On the other side, i want there to be
// a dripping effect from the top of the page to the bottom, where there
// will be a puddle. This puddle should start off as nonexistent and as
// the thing drips from the top of the page, then the puddle becomes
// larger and larger (capping at a specific size)".
//
// Belle Âme, in the owner's own writing on this page, is iris and iris
// butter, smooth and calming, a museum piece, "good night and sweet
// dreams", drying down to a powdery cacao. So:
//
// THE ARMOIRE stands in the left margin on the floor of the window. It
// was drawn in specks along its lines in an old walnut, a few worn away
// and the whole of it leaning a hair, under a broken pediment of scrolls;
// since 2026-10-01 — "make the wardrobe more solid and mechanical" — it
// is SOLID WALNUT JOINERY: its side seen in depth, feet shod in brass, a
// drawer with two bail pulls, two doors with raised panels on brass
// barrel hinges, a lock with its key, a cornice of three courses with
// dentils and a plate screwed on top (THE ARMOIRE, SOLID AND MADE, below).
// It BUILDS itself up from the floor as the page opens, behind a brass
// line, and then its right door SWINGS OPEN on its hinges — a
// looking-glass on its inside — and in the dark behind it stand THREE
// IRISES — three falls hanging and three standards up, each with its
// touch of gold — and ORRIS POWDER, the iris's own butter, drifts out of
// the opening: a speck at a time, violet-grey, slowing and rising and
// gone. It drifts out a little faster while the pointer is near. It
// stands CLEAR OF THE SCALE down the side of the page (house.js's rank),
// which it used to stand over.
// And since the night of 2026-09-25, CLOTHES — "put folded clothes and
// hangers with something on it in the armoire", which the owner wanted
// in this armoire as well as the hover's — and since 2026-10-01 a blazer,
// a dress and a pair of trousers at their real sizes, on a rail under a
// shelf of folded clothes near the top, each hanger hidden inside its
// garment as it is in life (THE CLOTHES, below), solid cloth as the rest
// of it is solid. The irises stand in front of them, on the floor of it.
//
// THE DRIP is in the right margin — and since the night of 2026-09-25 it
// runs THE WHOLE LENGTH OF THE PAGE, at the owner's "the dropping thing
// ... should go all the way down, and should note the scrolling". A bead
// gathers at the very top of the page, swells, lets go and falls,
// quickening to the speed a drop falls at (`DRIP_MOST`) — down past the
// writing as the page is read, carried with the page, so scrolling moves
// the drops as it moves the words, and a drop streaks longer while the
// page is being scrolled against it. It used to fall the height of the
// window into a puddle at the window's foot, which stood still over the
// page as it scrolled.
//
// THE BEAKER is what it falls into, at the very foot of the page: "I want
// the puddle to be more realistic, not just a circle of water. I want it
// to fall into a beaker, once the beaker starts overflowing, let it drip
// from that too." A laboratory beaker drawn in glass hairlines — the rim
// and its lip, a pouring spout, graduations — filling with every drop
// (`FILL_DROPS` to its brim), each drop ringing on the surface. Once it is
// full it OVERFLOWS: a wet run from the spout down its outside, and a
// bead gathering at the spout and dropping to the floor beside it, where
// THE SPILL spreads — not a circle, a wet shape with an uneven edge, which
// grows with every drop to `SPILL_MOST`. It all stands on a short BENCH
// ruled across the margin a little above the page's foot, which keeps it
// clear of the reading in the window's corner when the page is at its end.
//
// THE ARMOIRE LIVES ON THE WINDOW: it stands in the room, and the page
// scrolls over it. The drip and the beaker live ON THE PAGE. Over the
// writing everything is drawn at QUIET (the armoire, being solid, at
// WOOD_QUIET).
//
// WITHOUT THIS SCRIPT the page is exactly what it was before it.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  let ink = canvas.getContext("2d");
  const page = ink;   // (`ink` is lent to the armoire's own picture while it is made, below)
  if (!ink) return;

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const IRIS = "112, 94, 156";
  const ORRIS = "150, 136, 176";
  const STEM = "96, 112, 88";
  const GOLD = "184, 128, 46";
  const DRIP = "104, 92, 132";

  const COLUMN = 940;
  const QUIET = 0.28;
  const SOFT = 70;

  const BUILD = 2.2;               // seconds, the armoire drawn up from the floor
  const BLOOM = 1.6;               // and its irises opening after
  const PUFF_EVERY = 0.075;        // seconds between one speck of powder and the next
  const PUFF_NEAR = 0.03;          // and while the pointer is near
  // SLOWER AND LESS, at the owner's "make the dripping slower, less
  // filling": a drop every two to three and a half seconds (it was one a
  // second and a half), hanging longer before it lets go, falling at a
  // little over half the speed, and sixteen of them to fill the beaker
  // (it was ten).
  const DRIP_EVERY = [2.2, 3.4];   // seconds from one drop to the next
  const DRIP_HANG = [0.8, 1.2];    // seconds a drop gathers before it lets go
  const DRIP_PULL = 1400;          // px a second a second, as it lets go
  const DRIP_MOST = 520;           // px a second, as fast as a drop falls
  const FILL_DROPS = 32;           // drops to fill the beaker to its brim — half as fast as 16 (2026-09-25)
  const SPILL_MOST = 48;           // px, half the spill's length at its largest
  const FOOT = 104;                // px, the bench the beaker stands on, above the
                                   // page's foot — clear of the reading in the corner

  let seed = 52231;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const between = (a, b) => a + (b - a) * random();
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  let width = 0, height = 0;
  let powder = [], drops = [];
  let nextDrop = 0.6, lastPuff = 0;
  let dripX = 0, pageH = 0, scrollV = 0, lastScroll = 0;
  let beaker = null;

  const margin = () => Math.max(0, (width - COLUMN) / 2);

  function quiet(x) {
    const edge = width > COLUMN ? (width - COLUMN) / 2 : width * 0.16;
    const soft = Math.min(SOFT, width * 0.1);
    const from = edge - soft, to = width - edge + soft;
    if (x <= from || x >= to) return 1;
    const inside = Math.min(x - from, to - x) / soft;
    return QUIET + (1 - QUIET) * Math.max(0, 1 - Math.min(1, inside));
  }

  // ============================================================
  // THE ARMOIRE, SOLID AND MADE — since 2026-10-01: "make the wardrobe
  // more solid and mechanical". It was drawn in specks along its lines,
  // a few worn away, leaning a hair, its crown a broken pediment of
  // scrolls; it is a piece of joinery now, in solid walnut: a carcass
  // with its SIDE seen (it stands in the left margin and is looked at
  // from the page, so its right side shows, receding), feet shod in
  // brass, a plinth, a drawer with two bail pulls, two doors with RAISED
  // PANELS (a field, and four bevels down to the frame, lit from the top
  // left), three brass BARREL HINGES to a door, a lock with its key, and
  // a cornice of three courses stepping out with a row of dentils under
  // them and a plate screwed on top — every edge ruled, nothing worn and
  // nothing leaning. It is BUILT UP from the floor behind a brass line as
  // the page opens, and then its right door SWINGS OPEN on its hinges,
  // its inside face a looking-glass, onto the inside: dark, its back
  // boarded, its floor and its left wall seen in depth, a shelf of folded
  // clothes, a rail, the clothes on it and the irises on its floor.
  //
  // THE SCALE DOWN THE SIDE (house.js's rank) stands in this same margin,
  // a third to two thirds of the way down the window, and the armoire
  // stood over it — the line ran down its left side and its ticks sat on
  // its crown (the owner: "a small intersection between the scroll
  // parameter on the left ... and the wardrobe"). It stands clear of it
  // now: beside it, or under it — whichever leaves it the larger (`fit`).
  //
  // Everything is measured in the armoire's own frame: x from 0 to `W`
  // across its front, y from 0 at the floor up.
  // ============================================================
  const FACE = "136, 100, 72";       // the front, walnut
  const FACE_IN = "150, 114, 84";    // the inside of a door
  const SIDE = "98, 70, 50";         // the side, in its own shade
  const TOP = "166, 130, 98";        // what faces up, lit
  const FIELD = "148, 110, 80";      // a raised panel's field
  const BEVEL = { top: "178, 140, 106", left: "162, 124, 92", right: "116, 84, 60", bottom: "100, 72, 52" };
  const EDGE = "58, 40, 30";         // every edge, ruled
  const HOLLOW = "34, 26, 24";       // the inside: its back
  const WALL = "56, 42, 34";         //   its left wall
  const FLOOR = "70, 52, 40";        //   its floor
  const BOARD = "68, 52, 42";        //   the joins in its back
  const BRASS = "186, 146, 76", BRASS_EDGE = "112, 80, 36", BRASS_LIT = "238, 212, 150";
  const STEEL = "178, 180, 188";
  const GLASS = "206, 212, 224";
  const HANGER = "176, 138, 100";
  const WOOD_QUIET = 0.2;            // over the writing, a solid thing is quieter than a speck
  const SWING = 1.3;                 // seconds, the door opening

  const rgba = (c, a) => "rgba(" + c + ", " + Math.max(0, Math.min(1, a)).toFixed(3) + ")";
  const shade = (c, k) => c.split(",").map((v) => Math.round(Math.min(255, +v * k))).join(", ");
  const arc = (cx, cy, r, from, to, n) => Array.from({ length: n + 1 }, (_, i) => {
    const t = from + (to - from) * (i / n);
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });
  const rect4 = (x1, y1, x2, y2) => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];

  let shape = null, frame = null;

  /** The armoire's measurements, for a front `W` wide. */
  function measure(W) {
    const T = W * 2.05;
    const s = W * 0.065;                       // the frame round the doors
    const footH = T * 0.045, plinthH = T * 0.034;
    const base = -footH, top = base - T * 0.8;
    const drawerH = T * 0.085;
    const drawerBot = base - plinthH, drawerTop = drawerBot - drawerH;
    const doorTop = top + s, doorBot = drawerTop - s * 0.55;
    const mid = W / 2, hinge = W - s;
    return {
      W, T, s, footH, plinthH, base, top, drawerTop, drawerBot, doorTop, doorBot, mid, hinge,
      ov: W * 0.05,                            // how far the cornice stands out
      ox: W * 0.11, oy: -W * 0.055,            // how the side recedes
      c1: T * 0.016, c2: T * 0.014, c3: T * 0.02, plaqueH: T * 0.03,
      dw: hinge - mid - 0.5,                   // a door's width
      skew: T * 0.03,                          // its far edge, swung towards you, the taller
      thick: Math.max(2, s * 0.45),
      open: Math.acos(-0.42),                  // how far it swings: a little past square
    };
  }

  function poly(g, pts, fillC, fillA, edgeA, edgeC) {
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
    if (fillC) { g.fillStyle = rgba(fillC, fillA); g.fill(); }
    if (edgeA) { g.strokeStyle = rgba(edgeC || EDGE, edgeA); g.stroke(); }
  }
  const sideOf = (m, x, y1, y2) => [[x, y1], [x + m.ox, y1 + m.oy], [x + m.ox, y2 + m.oy], [x, y2]];
  const topOf = (m, x1, x2, y) => [[x1, y], [x2, y], [x2 + m.ox, y + m.oy], [x1 + m.ox, y + m.oy]];
  /** A block: its side, its top if it is seen, its front — `deep` as a
   *  share of the carcass's own depth. */
  function block(g, m, x1, y1, x2, y2, lit, deep) {
    const d = deep ? { ox: m.ox * deep, oy: m.oy * deep } : m;
    g.lineWidth = 0.8;
    poly(g, sideOf(d, x2, y1, y2), SIDE, 0.98, 0.8);
    if (lit) poly(g, topOf(d, x1, x2, y1), TOP, 0.98, 0.8);
    poly(g, rect4(x1, y1, x2, y2), FACE, 0.98, 0.9);
  }
  function screw(g, x, y, r) {
    g.lineWidth = 0.5;
    poly(g, arc(x, y, r, 0, Math.PI * 2, 8), BRASS, 0.95, 0.8, BRASS_EDGE);
    g.beginPath(); g.moveTo(x - r * 0.7, y + r * 0.35); g.lineTo(x + r * 0.7, y - r * 0.35);
    g.strokeStyle = rgba(BRASS_EDGE, 0.9); g.stroke();
  }
  function line(g, x1, y1, x2, y2, c, a, w) {
    g.lineWidth = w;
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2);
    g.strokeStyle = rgba(c, a); g.stroke();
  }

  /** A RAISED PANEL in a face mapped by `at(u, v)`: a field, and four
   *  bevels down to the frame, each shaded by which way it faces. */
  function raised(g, at, u1, v1, u2, v2, bu, bv, grain) {
    const O = [at(u1, v1), at(u2, v1), at(u2, v2), at(u1, v2)];
    const I = [at(u1 + bu, v1 + bv), at(u2 - bu, v1 + bv), at(u2 - bu, v2 - bv), at(u1 + bu, v2 - bv)];
    const cx = (I[0][0] + I[2][0]) / 2, cy = (I[0][1] + I[2][1]) / 2;
    g.lineWidth = 0.6;
    [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b]) => {
      const dx = (O[a][0] + O[b][0]) / 2 - cx, dy = (O[a][1] + O[b][1]) / 2 - cy;
      const h = Math.hypot(dx, dy) || 1;
      const face = dy / h < -0.6 ? "top" : dy / h > 0.6 ? "bottom" : dx < 0 ? "left" : "right";
      poly(g, [O[a], O[b], I[b], I[a]], BEVEL[face], 0.98, 0.5);
    });
    poly(g, I, FIELD, 0.98, 0.55);
    if (grain && !g.dry) for (let k = 1; k <= 3; k++) {
      const u = u1 + bu + (u2 - u1 - 2 * bu) * (k / 4 + Math.sin(k * 7.1) * 0.05);
      const [x1, y1] = at(u, v1 + bv * 1.6), [x2, y2] = at(u + Math.sin(k * 3.3) * 0.03, v2 - bv * 1.6);
      g.lineWidth = 0.5;
      g.beginPath(); g.moveTo(x1, y1);
      g.quadraticCurveTo((x1 + x2) / 2 + Math.sin(k * 5.7) * 2.5, (y1 + y2) / 2, x2, y2);
      g.strokeStyle = rgba(EDGE, 0.1); g.stroke();
    }
  }

  /** A BARREL HINGE on the line x, its middle at y, h tall. */
  function hingeAt(g, m, x, y, h) {
    const w = Math.max(2.4, m.W * 0.017);
    g.lineWidth = 0.6;
    poly(g, rect4(x - w * 0.32, y - h / 2 - 1.4, x + w * 0.32, y + h / 2 + 1.4), BRASS_EDGE, 0.95);
    poly(g, rect4(x - w / 2, y - h / 2, x + w / 2, y + h / 2), BRASS, 0.98, 0.9, BRASS_EDGE);
    line(g, x - w / 2, y, x + w / 2, y, BRASS_EDGE, 0.9, 0.6);
    line(g, x - w * 0.18, y - h / 2 + 1, x - w * 0.18, y + h / 2 - 1, BRASS_LIT, 0.8, 0.5);
  }

  /** A door, in the face `at(u, v)` — u from its hinge to its meeting
   *  edge, v from its top to its foot. Its outside has two raised panels;
   *  its inside, a looking-glass. */
  function door(g, m, at, outside) {
    g.lineWidth = 0.9;
    poly(g, [at(0, 0), at(1, 0), at(1, 1), at(0, 1)], outside ? FACE : FACE_IN, 0.98, 0.9);
    if (outside) {
      raised(g, at, 0.17, 0.055, 0.83, 0.6, 0.075, 0.022, true);
      raised(g, at, 0.17, 0.655, 0.83, 0.94, 0.075, 0.04, true);
      return;
    }
    if (g.dry) return;
    g.lineWidth = 0.6;
    poly(g, [at(0.14, 0.05), at(0.86, 0.05), at(0.86, 0.95), at(0.14, 0.95)], GLASS, 0.96, 0.7);
    poly(g, [at(0.5, 0.05), at(0.68, 0.05), at(0.14, 0.64), at(0.14, 0.44)], "255, 255, 255", 0.42);
    poly(g, [at(0.76, 0.05), at(0.82, 0.05), at(0.14, 0.8), at(0.14, 0.73)], "255, 255, 255", 0.3);
  }

  /** A foot: tapering to the floor, shod in brass. */
  function foot(g, m, x1, x2, dy, tone) {
    const inset = (x2 - x1) * 0.16, y0 = m.base + dy, y1 = dy, shoe = m.footH * 0.3;
    g.lineWidth = 0.8;
    poly(g, [[x1, y0], [x2, y0], [x2 - inset, y1], [x1 + inset, y1]], tone, 0.98, 0.85);
    const k = shoe / m.footH;
    poly(g, [[x1 + inset * (1 - k), y1 - shoe], [x2 - inset * (1 - k), y1 - shoe], [x2 - inset, y1], [x1 + inset, y1]],
      BRASS, 0.96, 0.8, BRASS_EDGE);
  }

  /** A bail pull: a brass plate, two posts, and the handle hanging from them. */
  function pull(g, x, y, a) {
    g.lineWidth = 0.6;
    poly(g, rect4(x - a * 1.7, y - a * 0.5, x + a * 1.7, y + a * 0.5), BRASS, 0.96, 0.8, BRASS_EDGE);
    [-1, 1].forEach((sd) => screw(g, x + sd * a * 1.15, y, a * 0.3));
    g.lineWidth = 1.5;
    g.beginPath();
    arc(x, y, a * 1.15, 0.05, Math.PI - 0.05, 12).forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
    g.strokeStyle = rgba(BRASS_EDGE, 0.95); g.stroke();
    g.lineWidth = 0.5;
    g.strokeStyle = rgba(BRASS_LIT, 0.85); g.stroke();
  }

  /** The lock in the shut door, and its key hanging in it. */
  function lock(g, m, x, y) {
    const w = Math.max(4, m.W * 0.034), h = w * 2;
    g.lineWidth = 0.6;
    poly(g, [[x - w / 2, y - h / 2 + w * 0.3], [x - w * 0.2, y - h / 2], [x + w * 0.2, y - h / 2], [x + w / 2, y - h / 2 + w * 0.3],
      [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], BRASS, 0.97, 0.85, BRASS_EDGE);
    poly(g, arc(x, y - h * 0.12, w * 0.17, 0, Math.PI * 2, 8), HOLLOW, 0.95);
    poly(g, rect4(x - w * 0.08, y - h * 0.12, x + w * 0.08, y + h * 0.16), HOLLOW, 0.95);
    // The key: its shank out of the keyhole, its bow hanging.
    line(g, x, y - h * 0.08, x, y + h * 0.42, BRASS_EDGE, 0.95, 1.4);
    g.lineWidth = 1.3;
    g.beginPath();
    arc(x, y + h * 0.42 + w * 0.55, w * 0.55, 0, Math.PI * 2, 14).forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py)));
    g.strokeStyle = rgba(BRASS_EDGE, 0.95); g.stroke();
    g.lineWidth = 0.5;
    g.strokeStyle = rgba(BRASS_LIT, 0.8); g.stroke();
  }

  // ============================================================
  // THE CLOTHES in the open half — since 2026-10-01 a BLAZER, a DRESS and
  // a pair of TROUSERS ("i want there to be pants, a dress and some
  // blazer"), at their REAL SIZES against a two-metre armoire (`cm`), on
  // a rail under a shelf of folded clothes near the top, hanging a little
  // turned as clothes on a rail do (`TURNED`), back to front: what is
  // behind a garment in front of it is hidden, and so is what is past the
  // edges of the opening — and EACH HANGER IS INSIDE ITS GARMENT, as in
  // life, so only its hook shows over the rail (and the triangle over the
  // trousers, which hang over its bar): "make the clothes hanger disappear
  // behind the clothes (the same way they would in real life)". Since the
  // armoire became solid (later that day) they are solid cloth too, drawn
  // back to front, each shaded darker on the side away from the open door.
  // Until then they were specks; before that a coat, a dress and a shirt,
  // small, on a rail over a shelf half way down, their hangers over them.
  // ============================================================
  const BLAZER = "92, 98, 114", DRESS = "154, 132, 168", TROUSERS = "176, 156, 128";
  const FOLDS = ["206, 196, 178", "150, 136, 176", "118, 128, 142", "176, 150, 120", "104, 112, 96", "168, 120, 112"];
  const TURNED = 0.74;
  function dressUp(m) {
    const inL = m.mid + 6, inR = m.hinge - 4, room = inR - inL, gs = Math.max(0.5, room / 84);
    const cm = m.T / 210;
    const qb = (a0, a1, a2, n) => Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n, u = 1 - t;
      return [u * u * a0[0] + 2 * u * t * a1[0] + t * t * a2[0], u * u * a0[1] + 2 * u * t * a1[1] + t * t * a2[1]];
    });
    const shelfY = m.doorTop + 16 * cm;
    const railY = shelfY + 10 * cm;

    /** One garment's shapes, laid out in cm from its hook. */
    const shapes = (kind, hx) => {
      const P = (x, y) => [hx + x * cm * TURNED, railY + y * cm];
      const mirror = (pts) => pts.map(([x, y]) => [2 * hx - x, y]);
      const out = { body: [], behind: null, inner: null, seams: [], dots: [], hw: 20 };
      if (kind === "blazer") {
        out.hw = 20.5;
        const half = [
          P(-3.5, 3.6), P(-7.5, 5), P(-15, 7.6), P(-22, 10.4),
          ...qb(P(-22, 10.4), P(-25, 32), P(-24.2, 69), 5).slice(1),
          P(-12.5, 70.5), P(-13, 66), P(-21.6, 66.5),
          ...qb(P(-21.6, 66.5), P(-22.4, 74), P(-21.8, 79.5), 3).slice(1),
          ...qb(P(-21.8, 79.5), P(-10, 80.5), P(-4.5, 79.5), 3).slice(1),
          ...qb(P(-4.5, 79.5), P(-1, 78.5), P(0, 76), 3).slice(1),
        ];
        out.body = half.concat(mirror(half).reverse().slice(1));
        out.seams = [
          ...[-1, 1].map((sd) => qb(P(sd * 17, 29), P(sd * 14, 50), P(sd * 12.6, 70.2), 4)),
          ...[-1, 1].map((sd) => [P(sd * 3.5, 3.6), P(sd * 5.4, 17), P(sd * 8.6, 18.6), P(sd * 10.8, 20.4), P(sd * 1.2, 44)]),
          qb(P(0.8, 44), P(0.4, 70), P(-4.5, 79.5), 4),
          [P(-18.6, 57.6), P(-9.4, 57.6), P(-9.4, 61), P(-18.6, 61), P(-18.6, 57.6)],
          [P(9.4, 57.6), P(18.6, 57.6), P(18.6, 61), P(9.4, 61), P(9.4, 57.6)],
          [P(9, 31), P(16, 30.4)],
        ];
        out.dots = [P(1.2, 44), P(1.2, 54.5)];
      } else if (kind === "dress") {
        out.hw = 16.5;
        const half = [
          P(-6.5, 4.8), P(-11.5, 7), P(-18, 9.4), P(-21, 19.5), P(-15.4, 21.6),
          ...qb(P(-15.4, 21.6), P(-14, 30), P(-13, 39), 3).slice(1),
          ...qb(P(-13, 39), P(-21, 60), P(-27, 80), 4).slice(1),
          ...qb(P(-27, 80), P(-13, 82.2), P(0, 82.4), 3).slice(1),
        ];
        out.body = half.concat(mirror(half).reverse().slice(1), qb(P(6.5, 4.8), P(0, 17), P(-6.5, 4.8), 4).slice(1));
        out.inner = [...qb(P(-6.5, 4.8), P(0, 7.2), P(6.5, 4.8), 4), ...qb(P(6.5, 4.8), P(0, 17), P(-6.5, 4.8), 4).slice(1)];
        out.seams = [
          qb(P(-13, 39), P(0, 41), P(13, 39), 4),
          ...[-0.5, 0, 0.5].map((f) => qb(P(f * 22, 41), P(f * 30, 62), P(f * 46, 81.6), 4)),
        ];
      } else {
        out.behind = [P(-13, 15), P(15.6, 15), P(15.2, 57), P(-12.6, 57)];
        out.body = [
          ...qb(P(-14, 17), P(-14, 12.8), P(-10, 12.8), 3),
          P(10, 12.8), ...qb(P(10, 12.8), P(14, 12.8), P(14, 17), 3).slice(1),
          P(12.6, 65), P(1.5, 65), P(0, 30), P(-1.5, 65), P(-12.6, 65),
        ];
        out.seams = [[P(-7.2, 15.5), P(-7, 64.8)], [P(7.2, 15.5), P(7, 64.8)],
          [P(-12.6, 62.4), P(-1.4, 62.4)], [P(1.4, 62.4), P(12.6, 62.4)]];
      }
      out.hanger = [P(-out.hw, 14), P(0, 4.6), P(out.hw, 14), P(-out.hw, 14)];
      out.hook = [P(0, 4.6), [hx, railY - 2]].concat(arc(hx + 2.4, railY - 2, 2.4, Math.PI, Math.PI * 2.1, 6));
      out.from = hx - out.hw * cm * TURNED * 1.3;
      out.to = hx + out.hw * cm * TURNED * 1.3;
      return out;
    };
    // Back to front: each drawn over the one behind it.
    const hung = [
      { kind: "blazer", x: inL + 9 * cm, c: BLAZER },
      { kind: "dress", x: inL + 27.5 * cm, c: DRESS },
      { kind: "trousers", x: inL + 40 * cm, c: TROUSERS },
    ].map((g) => ({ ...g, ...shapes(g.kind, g.x) }));
    // Folded clothes on the shelf, in two stacks, each fold its own.
    const stacks = [];
    const stackW = Math.min(40, room * 0.42);
    [[inL + 1, 2 + Math.floor(random() * 2)], [inR - stackW * 0.92 - 1, 2 + Math.floor(random() * 2)]].forEach(([x0, n], si) => {
      let y = shelfY - Math.max(2, 2.2 * cm);
      for (let i = 0; i < n; i++) {
        const h = between(5, 7.5) * Math.max(0.7, gs), w = stackW * (si ? 0.92 : 1) * between(0.86, 1), off = between(-2, 2);
        const L = x0 + off, R = L + w, T = y - h, B = y, open = random() < 0.5;
        const c = FOLDS[Math.floor(random() * FOLDS.length)];
        const rim = open ? [[R, T], [L + 3, T], ...arc(L + 3, (T + B) / 2, h / 2, -Math.PI / 2, -Math.PI * 1.5, 6), [L + 3, B], [R, B]]
          : [[L, T], [R - 3, T], ...arc(R - 3, (T + B) / 2, h / 2, -Math.PI / 2, Math.PI / 2, 6), [R - 3, B], [L, B]];
        stacks.push({ rim, c, fold: open ? [[L + 3, T + h * 0.5], [R - 2, T + h * 0.5]] : [[L + 2, T + h * 0.5], [R - 3, T + h * 0.5]] });
        y = T;
      }
    });
    Object.assign(m, { inL, inR, cm, shelfY, railY, hung, stacks });
  }

  /** A garment, solid: its hanger first, so the cloth hides it. */
  function garment(g, m, o) {
    const path = (pts) => {
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    };
    const edge = shade(o.c, 0.62);
    g.lineWidth = 1.5;
    path(o.hanger); g.closePath(); g.strokeStyle = rgba(HANGER, 0.95); g.stroke();
    g.lineWidth = 1;
    path(o.hook); g.strokeStyle = rgba(STEEL, 0.95); g.stroke();
    // Darker on the side away from the open door, where less light falls.
    const lightOf = () => {
      const grad = g.createLinearGradient(o.from, 0, o.to, 0);
      grad.addColorStop(0, "rgba(20, 14, 12, 0.3)");
      grad.addColorStop(0.55, "rgba(20, 14, 12, 0.04)");
      grad.addColorStop(1, "rgba(255, 246, 236, 0.1)");
      return grad;
    };
    [o.behind, o.body].forEach((pts, k) => {
      if (!pts) return;
      path(pts); g.closePath();
      g.fillStyle = rgba(k ? o.c : shade(o.c, 0.82), 0.98); g.fill();
      g.fillStyle = lightOf(); g.fill();
      g.lineWidth = 0.8; g.strokeStyle = rgba(edge, 0.95); g.stroke();
    });
    if (o.inner) {
      path(o.inner); g.closePath();
      g.fillStyle = rgba(shade(o.c, 0.7), 0.98); g.fill();
      g.lineWidth = 0.7; g.strokeStyle = rgba(edge, 0.9); g.stroke();
    }
    g.lineWidth = 0.7;
    o.seams.forEach((sm) => { path(sm); g.strokeStyle = rgba(edge, 0.75); g.stroke(); });
    o.dots.forEach(([x, y]) => poly(g, arc(x, y, Math.max(1, m.cm * 1.1), 0, Math.PI * 2, 8), "52, 46, 44", 0.95));
  }

  function iris(g, m, f, bloom) {
    const bx = f.x, by = m.doorBot + m.oy * 0.4;      // standing on the floor of it
    const tx = f.x + f.turn * 20, ty = f.top;
    g.lineWidth = 1.1;
    g.strokeStyle = rgba(STEM, 0.92 * bloom);
    g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + f.turn * 10, (by + ty) / 2, tx, ty); g.stroke();
    g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx - 6, by - 26, bx - 3 + f.turn * 8, by - 48 * bloom); g.stroke();
    const r = Math.min(12, m.W * 0.07) * bloom;
    g.lineWidth = 0.9;
    g.strokeStyle = rgba(IRIS, 0.95 * bloom);
    g.fillStyle = rgba("138, 120, 188", 0.92 * bloom);
    const petal = (ang, long, fat) => {
      g.beginPath();
      g.moveTo(tx, ty);
      g.quadraticCurveTo(tx + Math.cos(ang - fat) * r * long * 0.8, ty + Math.sin(ang - fat) * r * long * 0.8, tx + Math.cos(ang) * r * long, ty + Math.sin(ang) * r * long);
      g.quadraticCurveTo(tx + Math.cos(ang + fat) * r * long * 0.8, ty + Math.sin(ang + fat) * r * long * 0.8, tx, ty);
      g.fill(); g.stroke();
    };
    [-1.05, 0, 1.05].forEach((k) => petal(Math.PI / 2 + k + f.turn, k ? 1.55 : 1.2, 0.42));
    [-0.38, 0, 0.38].forEach((k) => petal(-Math.PI / 2 + k + f.turn, k ? 1.2 : 1.35, 0.3));
    g.fillStyle = rgba(GOLD, 0.9 * bloom);
    [-1.05, 0, 1.05].forEach((k) => {
      const ang = Math.PI / 2 + k + f.turn;
      g.fillRect(tx + Math.cos(ang) * r * 0.45 - 0.8, ty + Math.sin(ang) * r * 0.45 - 0.8, 1.6, 1.6);
    });
  }

  /** The inside, seen through the open door: its back, boarded; its left
   *  wall and its floor in depth; the shelf, the rail, what hangs and the
   *  irises — all of it inside the opening. */
  function inside(g, m, bloom) {
    const L = m.mid + 0.5, R = m.hinge, T0 = m.doorTop, B0 = m.doorBot;
    g.save();
    g.beginPath(); g.rect(L, T0, R - L, B0 - T0); g.clip();
    poly(g, rect4(L, T0, R, B0), HOLLOW, 0.98);
    const step = Math.max(5, m.W * 0.05);
    for (let x = L + m.ox + step; x < R; x += step) line(g, x, T0, x, B0 + m.oy, BOARD, 0.9, 0.7);
    poly(g, [[L, T0], [L + m.ox, T0 + m.oy], [L + m.ox, B0 + m.oy], [L, B0]], WALL, 0.98);
    poly(g, [[L, B0], [R, B0], [R + m.ox, B0 + m.oy], [L + m.ox, B0 + m.oy]], FLOOR, 0.98);
    // The shelf: a board with its edge to you and its top seen.
    const st = Math.max(2, 2.2 * m.cm), sy = m.shelfY;
    poly(g, topOf(m, L, R, sy - st), "116, 86, 62", 0.98);
    poly(g, rect4(L, sy - st, R, sy), TOP, 0.98, 0.6);
    const under = g.createLinearGradient(0, sy, 0, sy + 7 * m.cm);
    under.addColorStop(0, "rgba(0, 0, 0, 0.35)");
    under.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = under; g.fillRect(L, sy, R - L, 7 * m.cm);
    m.stacks.forEach((k) => {
      g.lineWidth = 0.7;
      poly(g, k.rim, k.c, 0.97, 0.9, shade(k.c, 0.6));
      line(g, k.fold[0][0], k.fold[0][1], k.fold[1][0], k.fold[1][1], shade(k.c, 0.72), 0.7, 0.5);
    });
    // The rail, a steel rod in a bracket at either end.
    [m.inL - 3, m.inR + 3].forEach((x) => {
      g.lineWidth = 0.5;
      poly(g, rect4(x - 2, m.railY - 4, x + 2, m.railY + 3), BRASS, 0.95, 0.8, BRASS_EDGE);
    });
    line(g, m.inL - 3, m.railY, m.inR + 3, m.railY, STEEL, 0.95, 1.6);
    line(g, m.inL - 3, m.railY - 0.5, m.inR + 3, m.railY - 0.5, "255, 255, 255", 0.5, 0.5);
    m.hung.forEach((o) => garment(g, m, o));
    if (bloom > 0) m.irises.forEach((f) => iris(g, m, f, bloom));
    // The light that falls in through the open door.
    const light = g.createLinearGradient(R, 0, L, 0);
    light.addColorStop(0, "rgba(255, 238, 214, 0.12)");
    light.addColorStop(0.6, "rgba(255, 238, 214, 0)");
    g.fillStyle = light; g.fillRect(L, T0, R - L, B0 - T0);
    g.restore();
  }

  /** THE WHOLE ARMOIRE, as far as it is built, its door as far as it has
   *  swung and its irises as far as they have opened. `g` is in the
   *  armoire's own frame; `g.dry` only measures. */
  function paint(g, m, built, swing, bloom) {
    const { W, ov, ox, oy, base, top, mid, hinge, doorTop, doorBot, drawerTop, drawerBot, s } = m;
    const reveal = -(m.rise || W * 2.2) * built - 2;
    if (!g.dry) {
      g.save();
      g.beginPath(); g.rect(-ov - 8, reveal, W + 2 * ov + ox + 80, -reveal + 10); g.clip();
      // Its shadow on the floor.
      g.save();
      g.translate(W / 2 + ox * 0.4, -1);
      g.scale(1, 0.08);
      const sh = g.createRadialGradient(0, 0, 0, 0, 0, W * 0.78);
      sh.addColorStop(0, "rgba(46, 34, 52, 0.26)");
      sh.addColorStop(1, "rgba(46, 34, 52, 0)");
      g.fillStyle = sh;
      g.fillRect(-W, -W, W * 2, W * 2);
      g.restore();
    }
    g.lineJoin = "round";
    // The far foot, behind; the carcass, its side and its front.
    foot(g, m, W * 0.83 + ox, W * 0.98 + ox, oy, SIDE);
    g.lineWidth = 0.9;
    poly(g, sideOf(m, W, top, base), SIDE, 0.98, 0.85);
    poly(g, rect4(0, top, W, base), FACE, 0.98, 0.9);
    // The plinth, its bead, and the feet under it.
    block(g, m, -ov * 0.4, base - m.plinthH, W + ov * 0.4, base);
    line(g, -ov * 0.4, base - m.plinthH + 2.2, W + ov * 0.4, base - m.plinthH + 2.2, BEVEL.top, 0.9, 0.8);
    foot(g, m, W * 0.02, W * 0.17, 0, FACE);
    foot(g, m, W * 0.83, W * 0.98, 0, FACE);
    // The cornice: three courses stepping out, dentils under the first,
    // and a plate screwed on top.
    const y2 = top - m.c1, y3 = y2 - m.c2, y4 = y3 - m.c3;
    block(g, m, -ov * 0.35, y2, W + ov * 0.35, top);
    const dg = Math.max(4, W * 0.045);
    for (let x = -ov * 0.35 + dg * 0.5; x + dg * 0.5 < W + ov * 0.35; x += dg) {
      poly(g, rect4(x, top - m.c1 * 0.78, x + dg * 0.5, top - m.c1 * 0.22), BEVEL.bottom, 0.9);
    }
    block(g, m, -ov * 0.7, y3, W + ov * 0.7, y2);
    block(g, m, -ov, y4, W + ov, y3, true);
    const px = W * 0.17;
    block(g, m, mid - px, y4 - m.plaqueH, mid + px, y4, true, 0.3);
    g.lineWidth = 0.5;
    poly(g, rect4(mid - px + 3, y4 - m.plaqueH + 2.5, mid + px - 3, y4 - 2.5), null, 0, 0.5);
    const sr = Math.max(1, W * 0.008);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) =>
      screw(g, mid + a * (px - 4.5), y4 - m.plaqueH / 2 + b * (m.plaqueH / 2 - 4), sr));

    // The drawer, with its pulls and its keyhole.
    const atD = (u, v) => [s + (W - 2 * s) * u, drawerTop + (drawerBot - drawerTop) * v];
    g.lineWidth = 0.9;
    poly(g, rect4(s, drawerTop, W - s, drawerBot), FACE, 0.98, 0.9);
    raised(g, atD, 0.025, 0.12, 0.975, 0.88, 0.018, 0.16, false);
    const pa = Math.max(2.4, (drawerBot - drawerTop) * 0.17);
    pull(g, W * 0.27, (drawerTop + drawerBot) / 2 - pa * 0.6, pa);
    pull(g, W * 0.73, (drawerTop + drawerBot) / 2 - pa * 0.6, pa);
    poly(g, arc(mid, (drawerTop + drawerBot) / 2, Math.max(1.4, pa * 0.4), 0, Math.PI * 2, 8), BRASS, 0.95, 0.8, BRASS_EDGE);

    // The left door, shut, with the lock and its key.
    const atL = (u, v) => [s + (mid - 0.5 - s) * u, doorTop + (doorBot - doorTop) * v];
    door(g, m, atL, true);
    const [lx, ly] = atL(0.88, 0.47);
    lock(g, m, lx, ly);

    // The inside, then the right door over it, as far as it has swung.
    const th = m.open * swing;
    if (!g.dry && th > 0.02) inside(g, m, bloom);
    const fx = hinge - m.dw * Math.cos(th), lift = m.skew * Math.sin(th);
    const atR = (u, v) => {
      const yt = doorTop - lift * u, yb = doorBot + lift * u;
      return [hinge + (fx - hinge) * u, yt + (yb - yt) * v];
    };
    if (Math.abs(fx - hinge) > 0.6) door(g, m, atR, th < Math.PI / 2);
    // Its edge, once it has swung far enough to show it.
    const e = m.thick * Math.max(0, Math.min(1, (th - 1.25) / 0.3));
    if (e > 0.2) {
      const [ax, ay] = atR(1, 0), [bx, by] = atR(1, 1);
      g.lineWidth = 0.7;
      poly(g, [[ax, ay], [ax + e, ay + 0.5], [bx + e, by - 0.5], [bx, by]], SIDE, 0.98, 0.85);
    }
    // The meeting of the two doors, and the hinges, three to a door.
    line(g, mid, doorTop, mid, doorBot, EDGE, 0.9, th > 0.02 ? 0.8 : 1.1);
    const dh = doorBot - doorTop, hh = Math.max(7, dh * 0.07);
    [0.1, 0.5, 0.9].forEach((v) => {
      hingeAt(g, m, s, doorTop + dh * v, hh);
      hingeAt(g, m, hinge, doorTop + dh * v, hh);
    });

    if (!g.dry) {
      g.restore();
      // While it is being built, the line it is built up behind.
      if (built < 1) line(g, -ov - 4, reveal, W + ov + ox + 4, reveal, BRASS, 0.85, 1);
    }
  }

  /** How far the armoire reaches either side of its front and above the
   *  floor, for a front 100px wide — the drawing measured, not guessed. */
  function reachOf() {
    let x1 = Infinity, x2 = -Infinity, y1 = Infinity;
    const see = (x, y) => { x1 = Math.min(x1, x); x2 = Math.max(x2, x); y1 = Math.min(y1, y); };
    const g = new Proxy({ dry: true }, {
      get(t, k) {
        if (k in t) return t[k];
        if (k === "moveTo" || k === "lineTo") return see;
        return () => ({ addColorStop() {} });
      },
      set() { return true; },
    });
    paint(g, measure(100), 1, 1, 1);
    return { left: -x1 / 100, right: x2 / 100, rise: -y1 / 100 };
  }
  const REACH = reachOf();

  // THE SCALE DOWN THE SIDE, where it stands now — or nothing, if it is
  // not shown (below 1080px it is not).
  function scaleBox() {
    const el = document.querySelector(".human-rank");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    // Its ticks grow from 8px to 16 as the fragrances are passed.
    return { right: r.left + r.width + 8, bottom: r.bottom };
  }

  function build() {
    seed = 52231;
    const room = margin();
    const baseY = height - Math.max(12, height * 0.03);
    const across = REACH.left + REACH.right;
    const most = Math.min(210, (height * 0.86) / REACH.rise);
    const scale = scaleBox();
    const under = scale ? (baseY - scale.bottom - 18) / REACH.rise : Infinity;
    let W, from;
    if (room > 120) {
      // In the margin, up to the column's edge; clear of the scale —
      // beside it, or under it, whichever leaves it the larger.
      const to = room - 4;
      const beside = (x) => Math.min(most, (to - x) / across);
      from = 16;
      W = beside(16);
      if (scale) {
        const a = beside(scale.right + 18), b = Math.min(W, under);
        if (a >= b) { W = a; from = scale.right + 18; } else W = b;
      }
    } else {
      // On a window without margins, a small one in the corner, quiet
      // behind the writing — under the scale, if it is shown.
      from = 8;
      W = Math.min(width * 0.26, 110, most, under);
    }
    W = Math.max(40, W);
    const left = from + REACH.left * W;
    shape = measure(W);
    shape.rise = REACH.rise * W;
    dressUp(shape);
    shape.irises = [0.3, 0.55, 0.78].map((k, i) => ({
      x: shape.mid + 2 + (shape.hinge - shape.mid - 2) * k,
      top: shape.doorBot - (shape.doorBot - shape.doorTop) * [0.28, 0.34, 0.31][i],
      turn: between(-0.2, 0.2),
    }));
    frame = { left, baseY, wide: W, tall: shape.T, hinge: shape.hinge, doorTop: shape.doorTop, doorBot: shape.doorBot,
      reach: shape.dw * 0.42 };      // how far the open door stands out past its hinge
    stillFor = "";
    // THE DRIP, in the other margin, and the beaker under it at the foot
    // of the page — on a window without margins, a small one at the edge.
    dripX = room > 120 ? width - room * 0.62 : width - 24;
    // The beaker, made again at the margin's size, keeping what it held.
    const bw = room > 120 ? Math.max(46, Math.min(72, room * 0.28)) : 30;
    if (!beaker || beaker.width !== bw) {
      const held = beaker ? beaker.drops : 0;
      beaker = window.Beaker ? window.Beaker.make({ width: bw, fill: FILL_DROPS, spillMost: SPILL_MOST, wet: DRIP }) : null;
      for (let i = 0; beaker && i < held; i++) beaker.land(0);
    }
  }

  const place = (x, y) => [frame.left + x, frame.baseY + y];

  function size() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = Math.min(window.innerWidth < 700 ? 1.5 : 2, window.devicePixelRatio || 1);
    const same = w === width && h === height;
    width = w; height = h;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!same) build();
  }

  let handX = -99999, handY = -99999;

  /** The page's own length: the drip runs all of it. */
  const measurePage = () => {
    pageH = Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0, height);
  };

  const fill = (tone, a, x) => { ink.fillStyle = "rgba(" + tone + "," + Math.max(0, Math.min(1, a * quiet(x))).toFixed(3) + ")"; };

  /** Over the writing the armoire is quiet: it is drawn whole, and then
   *  taken back by how far over the writing it stands. */
  function hush(g) {
    // Strong to the column's edge, and quiet by the time its writing
    // begins, 64px in; without margins, quiet all the way across.
    let a = 0, b = 1;
    if (width > COLUMN) { a = margin(); b = a + 60; }
    b = Math.max(a + 1, Math.min(b, width / 2));
    const k = (x) => Math.max(0, Math.min(1, x / width));
    const grad = g.createLinearGradient(0, 0, width, 0);
    const gone = "rgba(0, 0, 0, " + (1 - WOOD_QUIET) + ")";
    grad.addColorStop(0, "rgba(0, 0, 0, 0)");
    grad.addColorStop(k(a), "rgba(0, 0, 0, 0)");
    grad.addColorStop(k(b), gone);
    grad.addColorStop(k(width - b), gone);
    grad.addColorStop(k(width - a), "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.save();
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = grad;
    g.fillRect(0, 0, width, height);
    g.restore();
  }

  // THE ARMOIRE, ONCE IT STANDS, IS A PICTURE. Built, swung open and in
  // bloom, nothing of it moves again (only the powder and the drip move),
  // so once it is whole it is drawn once, into a picture of its own the
  // size of the window, and that is laid down each frame; a resize makes
  // it again. (It was drawn speck by speck, every frame, until 2026-10-01,
  // which was most of what this page asked of a phone.)
  let still = null, stillFor = "";
  function drawArmoire(built, swing, bloom) {
    ink.save();
    ink.translate(frame.left, frame.baseY);
    paint(ink, shape, built, swing, bloom);
    ink.restore();
    hush(ink);
  }

  function draw(clock, dt) {
    if (!width) return;
    ink.clearRect(0, 0, width, height);

    // THE ARMOIRE, built up from the floor, its door swinging open as it
    // is finished, and its irises opening behind it.
    const built = REDUCE_MOTION ? 1 : ease(clock / BUILD);
    const swing = REDUCE_MOTION ? 1 : ease((clock - BUILD * 0.6) / SWING);
    const bloom = REDUCE_MOTION ? 1 : ease((clock - BUILD * 0.85) / BLOOM);
    if (built >= 1 && swing >= 1 && bloom >= 1) {
      const key = canvas.width + "x" + canvas.height;
      if (stillFor !== key) {
        still = still || document.createElement("canvas");
        still.width = canvas.width; still.height = canvas.height;
        const made = still.getContext("2d");
        made.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        ink = made;
        drawArmoire(1, 1, 1);
        ink = page;
        stillFor = key;
      }
      ink.save();
      ink.setTransform(1, 0, 0, 1, 0, 0);
      ink.drawImage(still, 0, 0);
      ink.restore();
    } else drawArmoire(built, swing, bloom);

    // THE ORRIS POWDER, out of the open door, faster while the hand is near.
    const [gx] = place(frame.hinge, 0);
    const near = Math.hypot(handX - gx, handY - (frame.baseY - frame.tall * 0.5)) < frame.tall * 0.7;
    if (!REDUCE_MOTION && bloom > 0.5 && clock - lastPuff > (near ? PUFF_NEAR : PUFF_EVERY)) {
      lastPuff = clock;
      powder.push({ x: frame.hinge + between(2, frame.reach), y: between(frame.doorTop + 20, frame.doorBot - 20), born: clock,
        vx: between(8, 30), vy: -between(4, 16), s: between(0.9, 1.8), life: between(3, 5.4) });
    }
    for (let i = powder.length - 1; i >= 0; i--) {
      const p = powder[i], t = clock - p.born;
      if (t > p.life) { powder.splice(i, 1); continue; }
      const k = 1 - Math.exp(-t / 1.6);
      const [x, y] = place(p.x + p.vx * 1.6 * k * 3 + Math.sin(t * 1.6 + p.y) * 3, p.y + p.vy * 1.6 * k * 3);
      fill(ORRIS, 0.72 * Math.min(1, t / 0.4) * (1 - t / p.life), x);
      ink.fillRect(x, y, p.s, p.s);
    }
    if (REDUCE_MOTION) {
      // Still: a little powder standing in the air by the gap.
      for (let i = 0; i < 24; i++) {
        const [x, y] = place(frame.hinge + frame.reach + 4 + (i * 37) % 40, frame.doorTop + 30 + ((i * 53) % Math.max(1, frame.doorBot - frame.doorTop - 60)));
        fill(ORRIS, 0.4, x);
        ink.fillRect(x, y, 1.2, 1.2);
      }
    }

    // THE DRIP AND THE BEAKER, on the page: everything below is placed in
    // the page's own length and drawn where the page has been scrolled to.
    const sy = window.scrollY || window.pageYOffset || 0;
    if (dt > 0) scrollV = scrollV * 0.7 + ((sy - lastScroll) / Math.max(dt, 0.001)) * 0.3;
    lastScroll = sy;
    const q = quiet(dripX);
    const wet = (a) => "rgba(" + DRIP + "," + Math.min(1, a * q).toFixed(3) + ")";
    const floorY = pageH - FOOT;                     // the bench, on the page
    const ms = clock * 1000;
    if (beaker && REDUCE_MOTION) while (beaker.drops < FILL_DROPS * 0.55) beaker.land(0);
    const surfaceY = beaker ? beaker.surface(floorY) : floorY;
    const onScreen = (y1, y2) => y2 >= sy - 40 && y1 <= sy + height + 40;

    // The bead at the very top of the page, always gathering.
    if (onScreen(0, 20)) {
      ink.fillStyle = wet(0.42);
      ink.beginPath(); ink.ellipse(dripX, -sy, 6, 3, 0, 0, Math.PI * 2); ink.fill();
      ink.fillRect(dripX - 0.6, -sy, 1.2, 9);
      if (REDUCE_MOTION) {
        ink.fillStyle = wet(0.5);
        ink.beginPath(); ink.ellipse(dripX, 12 - sy, 2.2, 2.8, 0, 0, Math.PI * 2); ink.fill();
      }
    }
    if (!REDUCE_MOTION && clock >= nextDrop) {
      drops.push({ born: clock, hang: between(DRIP_HANG[0], DRIP_HANG[1]) });
      nextDrop = clock + between(DRIP_EVERY[0], DRIP_EVERY[1]);
    }
    const reach = DRIP_MOST / DRIP_PULL;             // seconds to reach its speed
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i], t = clock - d.born;
      if (t < d.hang) {
        if (!onScreen(0, 20)) continue;
        const r = 1 + 2.4 * ease(t / d.hang);
        ink.fillStyle = wet(0.5);
        ink.beginPath(); ink.ellipse(dripX, 9 + r - sy, r * 0.85, r * 1.1, 0, 0, Math.PI * 2); ink.fill();
        continue;
      }
      const f = t - d.hang;
      const y = 12 + (f < reach ? 0.5 * DRIP_PULL * f * f : 0.5 * DRIP_PULL * reach * reach + DRIP_MOST * (f - reach));
      const v = f < reach ? DRIP_PULL * f : DRIP_MOST;
      if (y >= surfaceY) {
        drops.splice(i, 1);
        if (beaker) {
          beaker.land(ms);
          canvas.dataset.drops = String(beaker.drops);
        }
        continue;
      }
      if (!onScreen(y - 30, y + 30)) continue;
      // Drawn out by how fast it crosses the window — its own fall less
      // the page's scroll — so scrolling against it streaks it.
      const rel = v - scrollV;
      window.Beaker.drop(ink, dripX, y - sy, q, Math.abs(rel) * 0.01, rel >= 0 ? 1 : -1, DRIP);
    }

    if (beaker) {
      if (onScreen(floorY - beaker.height - 40, floorY + 20)) beaker.draw(ink, dripX, floorY - sy, ms, 1, q);
      else beaker.settle(ms);
      if (canvas.dataset.spilled !== String(beaker.spilled)) canvas.dataset.spilled = String(beaker.spilled);
    }
  }

  // ============================================================
  // KEEPING UP
  // ============================================================
  const hand = (event) => { handX = event.clientX; handY = event.clientY; };
  window.addEventListener("pointermove", hand, { passive: true });
  window.addEventListener("pointerdown", hand, { passive: true });
  document.addEventListener("pointerleave", () => { handX = -99999; handY = -99999; });
  window.addEventListener("resize", () => { size(); measurePage(); if (REDUCE_MOTION) draw(0, 0); });
  // The page's length changes as its pictures arrive and its parts open.
  window.addEventListener("load", measurePage);
  if (window.ResizeObserver && document.body) new ResizeObserver(measurePage).observe(document.body);
  // Still, it is drawn again whenever the page moves under it.
  if (REDUCE_MOTION) window.addEventListener("scroll", () => draw(0, 0), { passive: true });

  size();
  measurePage();

  if (REDUCE_MOTION) {
    draw(0, 0);
  } else {
    const began = performance.now();
    let last = began;
    (function tick(now) {
      draw((now - began) / 1000, Math.min(0.1, (now - last) / 1000));
      last = now;
      requestAnimationFrame(tick);
    })(performance.now());
  }
})();

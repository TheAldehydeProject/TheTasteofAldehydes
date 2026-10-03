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
// THE ARMOIRE stands in the left margin on the floor of the window. Since
// 2026-10-03 — "The wardrobe in the main les abstraits page should be not
// realistic. I want it to match the closet when hovering, in being
// minimalist, and geometric. It should also slightly bigger and maybe a 3
// door closet too" — it is the Houses view's armoire (motifs.js) on the
// house's own page, made wider for a THIRD DOOR: plain geometry in walnut
// hairlines, a speck at each joint, DRAWN UP FROM THE FLOOR as the page
// opens (THE ARMOIRE, MINIMAL AND GEOMETRIC, below). Its left and middle
// doors are shut; its right one stands ajar, and through it the inside in
// perspective, a shelf of folded clothes, a rail with a blazer, a dress and
// a pair of trousers on it at their real sizes (each hanger hidden inside
// its garment, as in life), and a stack on the floor of it. THE IRISES grow
// at its feet, a tuft at each front leg — Belle Âme's orris — and ORRIS
// POWDER, the iris's own butter, drifts out of the open door: a speck at a
// time, violet-grey, slowing and rising and gone, a little faster while the
// pointer is near. It stands CLEAR OF THE SCALE down the side of the page
// (house.js's rank), which it used to stand over. (It was drawn in specks,
// a few worn away, leaning a hair, until 2026-10-01, and for that one day
// solid walnut joinery, its door swinging open onto a looking-glass.)
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
// writing everything is drawn at QUIET.
//
// WITHOUT THIS SCRIPT the page is exactly what it was before it.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
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
  // THE ARMOIRE, MINIMAL AND GEOMETRIC — since 2026-10-03: "The wardrobe
  // in the main les abstraits page should be not realistic. I want it to
  // match the closet when hovering, in being minimalist, and geometric. It
  // should also slightly bigger and maybe a 3 door closet too." So it is
  // the Houses view's armoire (motifs.js, `armoire()`) on the house's own
  // page, made wider for a third door: plain geometry in walnut hairlines,
  // a speck only at each joint — a carcass on four tapered legs (two in
  // front, two seen behind them) with a shallow V of an apron, THREE
  // DRAWERS with a knob each, THREE DOORS — the left and the middle shut,
  // each with its panels and a diamond set in the upper one, a keyhole in
  // the middle one; the right one ajar on its hinge, and through it the
  // inside in perspective, its back set in, the corners run to it — a
  // stepped cornice and a broken pediment in two straight rakes with a
  // diamond finial. It DRAWS ITSELF UP FROM THE FLOOR, every line growing
  // from its lower end. Inside, a shelf of folded clothes near the top, the
  // rail under it, the blazer, the dress and the trousers on their hangers
  // (each hanger inside its garment, as in life), drawn as the hover draws
  // them — paper, a flat tone, a hairline — and a stack on the floor of it.
  // THE IRISES grow at its feet, a tuft at each front leg, as the hover's
  // do: sword leaves out of one crown, stems rising past them, three falls
  // and three standards, one bud shut in each, swaying a little; and the
  // orris powder drifts out of the open door.
  //
  // For one round (2026-10-01) it was solid walnut joinery, its side seen
  // in depth, brass-shod, its door swinging open onto a looking-glass, and
  // before that specks along its lines, a few worn away, leaning a hair,
  // under a broken pediment of scrolls; none of either is in this file now.
  //
  // THE SCALE DOWN THE SIDE (house.js's rank) stands in this same margin,
  // a third to two thirds of the way down the window, and the armoire
  // stood over it until 2026-10-01 (the owner: "a small intersection between
  // the scroll parameter on the left ... and the wardrobe"). It stands clear
  // of it: beside it, or under it — whichever leaves it the larger (`build`).
  //
  // Everything is measured in the armoire's own frame: x from 0 to `W`
  // across its front, y from 0 at the floor up.
  // ============================================================
  const WALNUT = "88, 62, 44";
  const BEARD = GOLD;
  const LEAF_TONES = ["96, 112, 88", "84, 104, 76", "110, 124, 96", "92, 108, 70", "104, 116, 84"];
  const DRY = "152, 132, 98";            // a leaf's browned tip, and old leaf on the ground
  const SOIL = "98, 86, 72";
  const IRIS_FROM = 0.4;                 // seconds, the leaves start once the legs stand
  const IRIS_STEMS_AFTER = 0.5;          // seconds after the leaves, the stems
  const IRIS_OPEN_AFTER = 1.6;           // seconds after the leaves, the flowers open
  const IRIS_SWAY = 2.4;                 // px at the top of a stem, either way
  const TALL_OF = 1.42;                  // its height, of its front's width (three doors make it wide)
  const PAPER = "250, 248, 244";
  // The clothes' own colours, and the folded ones'; how much of a garment's
  // width is seen, hanging a little turned on the rail.
  const BLAZER = "92, 98, 114", DRESS = "154, 132, 168", TROUSERS = "176, 156, 128";
  const FOLDS = ["206, 196, 178", "150, 136, 176", "118, 128, 142", "176, 150, 120", "104, 112, 96", "168, 120, 112"];
  const TURNED = 0.74;

  const rgba = (c, a) => "rgba(" + c + "," + Math.max(0, Math.min(1, a)).toFixed(3) + ")";
  const arc = (cx, cy, r, from, to, n) => Array.from({ length: n + 1 }, (_, i) => {
    const t = from + (to - from) * (i / n);
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });
  const qb = (a0, a1, a2, n) => Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, u = 1 - t;
    return [u * u * a0[0] + 2 * u * t * a1[0] + t * t * a2[0], u * u * a0[1] + 2 * u * t * a1[1] + t * t * a2[1]];
  });

  let shape = null, frame = null;

  /** The armoire for a front `W` wide: every line of it (to be drawn from
   *  the floor up), its joints, the inside, the clothes and the irises. */
  function design(W) {
    seed = 52231;
    const T = W * TALL_OF;
    const legH = T * 0.11, body = T * 0.75, crown = T * 0.05;
    const bottom = -legH, top = -(legH + body), mid = W / 2;
    const drawerH = body * 0.11;
    const doorTop = top + T * 0.022, doorBot = bottom - drawerH - T * 0.014;
    const m = W * 0.035;                       // the frame round the doors
    const d1 = W / 3, d2 = (W * 2) / 3, hinge = W - m;

    // EVERY LINE, with how far up the armoire it starts and ends.
    const lines = [];
    const put = (pts, weight, bare) => {
      let len = 0;
      const at = [0];
      for (let i = 1; i < pts.length; i++) {
        len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        at.push(len);
      }
      const ys = pts.map((p) => -p[1] / T);
      lines.push({ pts, at, len: Math.max(0.01, len), from: Math.min(...ys), to: Math.max(...ys), weight: weight || 1, bare: !!bare });
    };
    const box = (x1, y1, x2, y2, weight) => {
      put([[x1, y2], [x1, y1]], weight); put([[x2, y2], [x2, y1]], weight);
      put([[x1, y2], [x2, y2]], weight); put([[x1, y1], [x2, y1]], weight);
    };
    const diamond = (cx, cy, rx, ry, weight) => put([[cx, cy + ry], [cx + rx, cy], [cx, cy - ry], [cx - rx, cy], [cx, cy + ry]], weight);

    // THE LEGS: two in front, tapering to the floor, and two behind them.
    const legAt = [W * 0.05, W * 0.95];
    const lw = Math.max(2.5, W * 0.012);
    legAt.forEach((lx) => {
      put([[lx - lw, 0], [lx - lw * 2.4, bottom]]);
      put([[lx + lw, 0], [lx + lw * 2.4, bottom]]);
      put([[lx - lw, 0], [lx + lw, 0]]);
    });
    [W * 0.2, W * 0.8].forEach((lx) => put([[lx, -5], [lx, bottom + 8]], 0.5));
    // The apron: a shallow V under the carcass between the front legs.
    put([[legAt[0] + lw * 2.4, bottom], [mid - W * 0.18, bottom + T * 0.016], [mid, bottom + T * 0.026],
      [mid + W * 0.18, bottom + T * 0.016], [legAt[1] - lw * 2.4, bottom]]);
    // The carcass, and a plinth line along its foot.
    box(0, top, W, bottom);
    put([[-3, bottom - 4], [W + 3, bottom - 4]], 0.7);
    // THREE DRAWERS, one under each door, a knob in each.
    const dTop = bottom - drawerH, dBot = bottom - 8;
    [[m, d1 - 1.5], [d1 + 1.5, d2 - 1.5], [d2 + 1.5, W - m]].forEach(([x1, x2]) => {
      box(x1, dTop, x2, dBot, 0.8);
      put(arc((x1 + x2) / 2, (dTop + dBot) / 2, 2.4, 0, Math.PI * 2, 10), 0.8, true);
    });
    // THE TWO SHUT DOORS, the left and the middle: an upper panel with a
    // diamond set in it, a lower one; a keyhole in the middle one.
    const pMid = doorTop + (doorBot - doorTop) * 0.58;
    [[m, d1 - 1.5], [d1 + 1.5, d2 - 1.5]].forEach(([x1, x2], k) => {
      const inset = (x2 - x1) * 0.15;
      box(x1, doorTop, x2, doorBot);
      box(x1 + inset, doorTop + T * 0.03, x2 - inset, pMid, 0.7);
      diamond((x1 + x2) / 2, (doorTop + T * 0.03 + pMid) / 2, (x2 - x1 - inset * 2) * 0.32, (pMid - doorTop - T * 0.03) * 0.3, 0.7);
      box(x1 + inset, pMid + T * 0.025, x2 - inset, doorBot - T * 0.025, 0.7);
      if (k === 1) {
        put(arc(x1 + 7, pMid + 5, 1.8, 0, Math.PI * 2, 8), 0.8, true);
        put([[x1 + 7, pMid + 7], [x1 + 7, pMid + 12]], 0.8);
      }
    });
    // THE RIGHT DOOR, ajar: swung out on its hinge at the right edge, so
    // it is seen narrow and in perspective beyond the carcass.
    const openW = (hinge - d2) * 0.5, skew = T * 0.035;
    put([[hinge, doorBot], [hinge + openW, doorBot + skew]]);
    put([[hinge + openW, doorBot + skew], [hinge + openW, doorTop - skew]]);
    put([[hinge, doorTop], [hinge + openW, doorTop - skew]]);
    put([[hinge + openW * 0.3, doorBot + skew * 0.3 - 10], [hinge + openW * 0.3, doorTop - skew * 0.3 + 10]], 0.6);
    // Through it, the inside in perspective: its back set in, the corners
    // run back to it, a shelf near the top and a rail under it.
    const inL = d2 + 1.5, inR = hinge;
    const bL = inL + W * 0.035, bR = inR - W * 0.018, bT = doorTop + T * 0.03, bB = doorBot - T * 0.02;
    const cm = T / 210;
    box(bL, bT, bR, bB, 0.45);
    put([[inL, doorBot], [bL, bB]], 0.45); put([[inR, doorBot], [bR, bB]], 0.45);
    put([[inL, doorTop], [bL, bT]], 0.45); put([[inR, doorTop], [bR, bT]], 0.45);
    const shelfY = bT + 16 * cm;
    put([[inL, shelfY + 6], [bL, shelfY]], 0.45);
    put([[bL, shelfY], [bR, shelfY]], 0.45);
    put([[bR, shelfY], [inR, shelfY + 6]], 0.45);
    const railY = shelfY + 10 * cm, railL = (inL + bL) / 2, railR = (inR + bR) / 2;
    put([[railL, railY], [railR, railY]], 0.9);
    put([[railL, railY - 5], [railL, railY + 3]], 0.7); put([[railR, railY - 5], [railR, railY + 3]], 0.7);
    // The crown: a cornice in two steps, and a broken pediment — two
    // straight rakes stopping short of the middle — with a diamond finial.
    const c1 = top - crown * 0.45, c2 = top - crown;
    put([[-5, top], [-5, c1]], 0.9); put([[W + 5, top], [W + 5, c1]], 0.9);
    put([[-5, top], [W + 5, top]], 0.9);
    put([[-10, c1], [-10, c2]]); put([[W + 10, c1], [W + 10, c2]]);
    put([[-10, c1], [W + 10, c1]]); put([[-10, c2], [W + 10, c2]]);
    const rise = T * 0.08, gapHalf = W * 0.05;
    const rake = (x) => c2 - rise * (1 - Math.abs(x - mid) / (mid + 10));
    put([[-10, c2], [mid - gapHalf, rake(mid - gapHalf)]]);
    put([[W + 10, c2], [mid + gapHalf, rake(mid + gapHalf)]]);
    put([[4, c2], [mid - gapHalf, rake(mid - gapHalf) + 7]], 0.55);
    put([[W - 4, c2], [mid + gapHalf, rake(mid + gapHalf) + 7]], 0.55);
    put([[mid, c2], [mid, c2 - rise * 0.5]], 0.8);
    diamond(mid, c2 - rise * 0.5 - 7, 6, 7, 0.9);

    // THE JOINTS, one speck each — the only specks the armoire has.
    const joints = [];
    const seenAt = new Set();
    lines.forEach((l) => l.pts.forEach((p, i) => {
      const key = Math.round(p[0]) + "," + Math.round(p[1]);
      if (seenAt.has(key) || l.weight < 0.6 || l.bare) return;
      seenAt.add(key);
      joints.push({ x: p[0], y: p[1], l, at: l.at[i] });
    }));

    // THE CLOTHES, at their real sizes against a two-metre armoire (`cm`),
    // hanging a little turned, back to front; folded ones on the shelf and
    // on the floor of it.
    const room = railR - railL, gs = room / 84;
    const garments = [
      { kind: "blazer", x: inL + 9 * cm, tone: BLAZER, at: 0.9 },
      { kind: "dress", x: inL + 27.5 * cm, tone: DRESS, at: 1.0 },
      { kind: "trousers", x: inL + 40 * cm, tone: TROUSERS, at: 1.1 },
    ];
    const fold = (x, base, width, n, at) => {
      const out = [];
      let y = base;
      for (let i = 0; i < n; i++) {
        const h = between(5, 7.5) * Math.max(0.7, gs), w = width * between(0.86, 1), off = between(-2.2, 2.2);
        out.push({ x: x + off + (width - w) / 2, y, w, h, tone: FOLDS[Math.floor(random() * FOLDS.length)], at: at + i * 0.09, open: random() < 0.5 ? -1 : 1 });
        y -= h;
      }
      return out;
    };
    const stackW = Math.min(40, room * 0.42);
    const folded = [
      ...fold(bL + 3, shelfY + 3, stackW, 2 + Math.floor(random() * 2), 0.75),
      ...fold(bR - 3 - stackW * 0.92, shelfY + 3, stackW * 0.92, 2 + Math.floor(random() * 2), 0.82),
    ];
    const floorStack = fold(inL + 3, doorBot - 3, stackW * 1.05, 2 + Math.floor(random() * 2), 0.6);

    // THE IRISES: a tuft at each front leg — every leaf out of one small
    // crown, nothing about one quite what the next is; soil, grass and a dry
    // bit of old leaf round it; stems rising past the leaves, the last in
    // each tuft a bud.
    const pick = (list) => list[Math.floor(random() * list.length)];
    const clumps = [
      { x: legAt[0] + 3, out: -0.5, big: 1, stems: 3 },
      { x: legAt[1] - 2, out: 1, big: 0.88, stems: 2 },
    ].map((cl) => {
      const n = 9 + Math.floor(random() * 4);
      const fan = Array.from({ length: n }, () => between(-1, 1)).sort((p, q) => p - q);
      const leaves = fan.map((f) => {
        const young = random() < 0.22;
        return {
          x: cl.x + f * 3 + between(-1.2, 1.2),
          y: -between(0, 4),
          tilt: f * between(0.35, 0.6) + cl.out * 0.08 + between(-0.1, 0.1),
          long: T * (0.3 - Math.abs(f) * 0.12) * between(0.65, 1.15) * cl.big * (young ? 0.4 : 1) * 0.85,
          broad: between(3.4, 6.8),
          c1: f * between(0.1, 0.35) + between(-0.15, 0.15),
          c2: f * between(0.2, 0.6) + between(-0.25, 0.25),
          flop: !young && random() < 0.2 ? { at: between(0.5, 0.78), by: Math.sign(f || cl.out) * between(0.9, 1.7) } : null,
          tone: pick(LEAF_TONES),
          dry: !young && random() < 0.3 ? between(0.08, 0.22) : 0,
          rib: random() < 0.45,
          shade: between(0.22, 0.36),
          delay: Math.abs(f) * 0.38 + between(0, 0.16),
          phase: between(0, 6.3),
        };
      });
      const grass = Array.from({ length: 5 }, () => ({ x: cl.x + between(-13, 13), long: between(6, 16), tilt: between(-0.6, 0.6), bend: between(-0.5, 0.5) }));
      const soil = Array.from({ length: 16 }, () => {
        const u = between(-1, 1);
        return { x: cl.x + u * 13, y: -Math.max(0, (1 - u * u) * between(0, 3.2)), s: between(0.8, 1.8), k: between(0.25, 0.6) };
      });
      const litter = Array.from({ length: 2 }, () => ({ x: cl.x + between(-15, 15), long: between(6, 11), ang: between(-0.3, 0.3), curl: between(-3, 3) }));
      const stems = Array.from({ length: cl.stems }, (_, i) => ({
        x: cl.x + between(-3, 3) + cl.out * 3,
        tilt: cl.out * between(0.08, 0.28) + between(-0.08, 0.08),
        long: T * (i === 0 ? between(0.33, 0.4) : between(0.22, 0.32)) * cl.big * 0.85,
        bend: between(-0.14, 0.14),
        bract: between(0.38, 0.58),
        bud: i === cl.stems - 1,
        size: between(14, 18) * cl.big,
        turn: between(-0.22, 0.22),
        falls: [-1, 0, 1].map((k) => ({ k, ang: between(-0.14, 0.14), long: between(0.85, 1.15), fat: between(0.42, 0.56), wave: between(-1.5, 2) })),
        stds: [-1, 0, 1].map((k) => ({ k, ang: between(-0.1, 0.1), long: between(0.85, 1.12), fat: between(0.26, 0.34) })),
        delay: i * between(0.22, 0.52),
        phase: between(0, 6.3),
      }));
      return { x: cl.x, leaves, grass, soil, litter, stems };
    });

    return { W, T, lines, joints, doorTop, doorBot, hinge, openW, inL, inR, bL, bR, cm, shelfY, railY,
      garments, folded, floorStack, clumps, legAt };
  }

  // ---- drawing, in the armoire's own frame ----------------------------------

  /** Every line, grown from its lower end as far as the build has reached;
   *  the inside's faint tone and the clothes once the door is drawn; a
   *  speck at every joint reached. */
  function drawFrame(g, m, built, clock, a) {
    const reach = built * 1.15;
    g.lineCap = "round";
    g.lineJoin = "round";
    g.lineWidth = 1.1;
    m.lines.forEach((l) => {
      const k = Math.max(0, Math.min(1, (reach - l.from) / Math.max(0.06, l.to - l.from)));
      l.k = k;
      if (k <= 0) return;
      const upTo = l.len * k;
      g.strokeStyle = rgba(WALNUT, 0.66 * l.weight * a);
      g.beginPath();
      g.moveTo(l.pts[0][0], l.pts[0][1]);
      for (let i = 1; i < l.pts.length; i++) {
        const seg = l.at[i] - l.at[i - 1];
        if (l.at[i] <= upTo || seg <= 0) { g.lineTo(l.pts[i][0], l.pts[i][1]); continue; }
        const t = (upTo - l.at[i - 1]) / seg;
        g.lineTo(l.pts[i - 1][0] + (l.pts[i][0] - l.pts[i - 1][0]) * t, l.pts[i - 1][1] + (l.pts[i][1] - l.pts[i - 1][1]) * t);
        break;
      }
      g.stroke();
    });
    if (g.dry) return;
    // The inside, a faint tone once the door has been drawn; the clothes.
    const door = ease((reach - (-m.doorBot / m.T)) / 0.3);
    if (door > 0) {
      g.fillStyle = rgba("20, 16, 14", 0.05 * door * a);
      g.fillRect(m.inL, m.doorTop, m.inR - m.inL, m.doorBot - m.doorTop);
      const since = REDUCE_MOTION ? 99 : clock - BUILD * 0.55;
      m.folded.forEach((f) => { const k = ease((since - f.at) / 0.45); if (k > 0) folded1(g, f, k, a * door); });
      g.save();
      g.beginPath(); g.rect(m.inL, m.doorTop, m.inR - m.inL, m.doorBot - m.doorTop); g.clip();
      m.garments.forEach((o) => { const k = ease((since - o.at) / 0.55); if (k > 0) garment(g, m, o, k, a * door); });
      g.restore();
      m.floorStack.forEach((f) => { const k = ease((since - f.at) / 0.45); if (k > 0) folded1(g, f, k, a * door); });
    }
    g.fillStyle = rgba(WALNUT, 0.85 * a);
    m.joints.forEach((j) => {
      if (j.l.k <= 0 || j.at > j.l.len * j.l.k + 0.01) return;
      g.fillRect(j.x - 1, j.y - 1, 2, 2);
    });
  }

  /** One garment: its hanger first — so the garment hides it, as it does
   *  in life, all but its hook — then its outline, filled (the paper first,
   *  so what is behind it is behind it), and its seams. In cm from its hook. */
  function garment(g, m, o, k, a) {
    const drop = (1 - k) * -6;
    const hx = o.x, hy = m.railY, cm = m.cm;
    const P = (x, y) => [hx + x * cm * TURNED, hy + drop + y * cm];
    const path = (pts, close) => {
      g.beginPath();
      pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
      if (close) g.closePath();
    };
    const mirror = (pts) => pts.map(([x, y]) => [2 * hx - x, y]);
    let body = [], behind = null, inner = null, seams = [], dots = [], hw = 20, bar = false;
    if (o.kind === "blazer") {
      hw = 20.5;
      const half = [
        P(-3.5, 3.6), P(-7.5, 5), P(-15, 7.6), P(-22, 10.4),
        ...qb(P(-22, 10.4), P(-25, 32), P(-24.2, 69), 6).slice(1),
        P(-12.5, 70.5), P(-13, 66), P(-21.6, 66.5),
        ...qb(P(-21.6, 66.5), P(-22.4, 74), P(-21.8, 79.5), 3).slice(1),
        ...qb(P(-21.8, 79.5), P(-10, 80.5), P(-4.5, 79.5), 4).slice(1),
        ...qb(P(-4.5, 79.5), P(-1, 78.5), P(0, 76), 3).slice(1),
      ];
      body = half.concat(mirror(half).reverse().slice(1));
      seams = [
        ...[-1, 1].map((sd) => qb(P(sd * 17, 29), P(sd * 14, 50), P(sd * 12.6, 70.2), 5)),
        ...[-1, 1].map((sd) => [P(sd * 12.8, 66.6), P(sd * 24.4, 65.6)]),
        ...[-1, 1].map((sd) => [P(sd * 3.5, 3.6), P(sd * 5.4, 17), P(sd * 8.6, 18.6), P(sd * 10.8, 20.4), P(sd * 1.2, 44)]),
        [P(-5.4, 17), P(-7.4, 16.4)], [P(5.4, 17), P(7.4, 16.4)],
        qb(P(0.8, 44), P(0.4, 70), P(-4.5, 79.5), 5),
        [P(-18.6, 57.6), P(-9.4, 57.6), P(-9.4, 61), P(-18.6, 61), P(-18.6, 57.6)],
        [P(9.4, 57.6), P(18.6, 57.6), P(18.6, 61), P(9.4, 61), P(9.4, 57.6)],
        [P(9, 31), P(16, 30.4)],
      ];
      dots = [P(1.2, 44), P(1.2, 54.5)];
    } else if (o.kind === "dress") {
      hw = 16.5;
      const half = [
        P(-6.5, 4.8), P(-11.5, 7), P(-18, 9.4), P(-21, 19.5), P(-15.4, 21.6),
        ...qb(P(-15.4, 21.6), P(-14, 30), P(-13, 39), 3).slice(1),
        ...qb(P(-13, 39), P(-21, 60), P(-27, 80), 5).slice(1),
        ...qb(P(-27, 80), P(-13, 82.2), P(0, 82.4), 4).slice(1),
      ];
      body = half.concat(mirror(half).reverse().slice(1), qb(P(6.5, 4.8), P(0, 17), P(-6.5, 4.8), 5).slice(1));
      inner = [...qb(P(-6.5, 4.8), P(0, 7.2), P(6.5, 4.8), 5), ...qb(P(6.5, 4.8), P(0, 17), P(-6.5, 4.8), 5).slice(1)];
      seams = [
        qb(P(-13, 39), P(0, 41), P(13, 39), 5),
        [P(-18, 9.4), P(-15.6, 21)], [P(18, 9.4), P(15.6, 21)],
        ...[-0.5, -0.17, 0.17, 0.5].map((f) => qb(P(f * 22, 41), P(f * 30, 62), P(f * 46, 81.6), 5)),
      ];
    } else {
      hw = 20; bar = true;
      behind = [P(-13, 15), P(15.6, 15), P(15.2, 57), P(-12.6, 57)];
      body = [
        ...qb(P(-14, 17), P(-14, 12.8), P(-10, 12.8), 3),
        P(10, 12.8), ...qb(P(10, 12.8), P(14, 12.8), P(14, 17), 3).slice(1),
        P(12.6, 65), P(1.5, 65), P(0, 30), P(-1.5, 65), P(-12.6, 65),
      ];
      seams = [[P(-7.2, 15.5), P(-7, 64.8)], [P(7.2, 15.5), P(7, 64.8)],
        [P(-12.6, 62.4), P(-1.4, 62.4)], [P(1.4, 62.4), P(12.6, 62.4)]];
    }
    // THE HANGER, under all of it: its hook over the rail, its shoulders.
    g.strokeStyle = rgba(WALNUT, 0.78 * k * a);
    g.lineWidth = 0.9;
    path([P(-hw, 14), P(0, 4.6), P(hw, 14), P(-hw, 14)]);
    g.stroke();
    const [kx, ky] = P(0, 4.6);
    g.beginPath(); g.moveTo(kx, ky); g.lineTo(hx, hy + drop - 1.5); g.arc(hx + 2.4, hy + drop - 1.5, 2.4, Math.PI, Math.PI * 2.1); g.stroke();
    const solid = (pts, tone, lift) => {
      path(pts, true);
      g.fillStyle = rgba(PAPER, 0.96 * k * a);
      g.fill();
      g.fillStyle = rgba(tone, lift * k * a);
      g.fill();
      g.strokeStyle = rgba(WALNUT, 0.6 * k * a);
      g.lineWidth = 0.8;
      g.stroke();
    };
    if (behind) {
      solid(behind, o.tone, 0.5);
      g.strokeStyle = rgba(WALNUT, 0.34 * k * a);
      g.lineWidth = 0.6;
      path([P(-12.8, 53.4), P(15.4, 53.4)]); g.stroke();
      [-8, 1.5, 11].forEach((x) => { path([P(x, 53.4), P(x, 57)]); g.stroke(); });
    }
    solid(body, o.tone, 0.42);
    if (inner) solid(inner, o.tone, 0.62);
    g.strokeStyle = rgba(WALNUT, 0.34 * k * a);
    g.lineWidth = 0.6;
    seams.forEach((sm) => { path(sm); g.stroke(); });
    g.fillStyle = rgba(WALNUT, 0.6 * k * a);
    dots.forEach(([x, y]) => g.fillRect(x - 0.9, y - 0.9, 1.8, 1.8));
    if (bar) {
      g.strokeStyle = rgba(WALNUT, 0.3 * k * a);
      g.lineWidth = 0.6;
      path(qb(P(-13.6, 15.6), P(0, 17.4), P(13.6, 15.6), 4)); g.stroke();
    }
  }

  /** One folded thing: a flat block with its folded edge rounded at one
   *  end, and the fold across it. */
  function folded1(g, f, k, a) {
    const drop = (1 - k) * -5;
    const y1 = f.y - f.h + drop, y2 = f.y + drop, L = f.x, R = f.x + f.w, r = Math.min(3, f.h / 2);
    g.beginPath();
    if (f.open < 0) { g.moveTo(L + r, y1); g.lineTo(R, y1); g.lineTo(R, y2); g.lineTo(L + r, y2); g.arc(L + r, (y1 + y2) / 2, (y2 - y1) / 2, Math.PI / 2, Math.PI * 1.5); }
    else { g.moveTo(R - r, y1); g.lineTo(L, y1); g.lineTo(L, y2); g.lineTo(R - r, y2); g.arc(R - r, (y1 + y2) / 2, (y2 - y1) / 2, Math.PI / 2, -Math.PI / 2, true); }
    g.closePath();
    g.fillStyle = rgba(PAPER, 0.94 * k * a);
    g.fill();
    g.fillStyle = rgba(f.tone, 0.5 * k * a);
    g.fill();
    g.strokeStyle = rgba(WALNUT, 0.56 * k * a);
    g.lineWidth = 0.7;
    g.stroke();
    g.strokeStyle = rgba(WALNUT, 0.26 * k * a);
    g.beginPath();
    const my = (y1 + y2) / 2 + 0.5;
    if (f.open < 0) { g.moveTo(L + r + 2, my); g.lineTo(L + (R - L) * 0.62, my); }
    else { g.moveTo(R - r - 2, my); g.lineTo(R - (R - L) * 0.62, my); }
    g.stroke();
  }

  // ---- the irises, at its feet (the hover's, motifs.js) ----------------------
  const swayOf = (clock, phase, up) => (REDUCE_MOTION ? 0 : Math.sin(clock / 2.1 + phase) * IRIS_SWAY * up);

  /** The ground a tuft stands in: a little shadow, soil, grass, and a dry
   *  bit of old leaf. */
  function ground(g, cl, grown, a) {
    if (grown <= 0) return;
    g.fillStyle = rgba("58, 56, 44", 0.16 * grown * a);
    g.beginPath(); g.ellipse(cl.x, 0, 12, 2.4, 0, 0, Math.PI * 2); g.fill();
    cl.soil.forEach((p) => {
      g.fillStyle = rgba(SOIL, p.k * grown * a);
      g.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
    });
    g.lineWidth = 0.7;
    g.strokeStyle = rgba(DRY, 0.5 * grown * a);
    cl.litter.forEach((l) => {
      const x2 = l.x + Math.cos(l.ang) * l.long, y2 = -0.5 + Math.sin(l.ang) * l.long * 0.3;
      g.beginPath(); g.moveTo(l.x, -0.5); g.quadraticCurveTo((l.x + x2) / 2, (y2 - 0.5) / 2 + l.curl, x2, y2); g.stroke();
    });
    g.strokeStyle = rgba(STEM, 0.42 * grown * a);
    g.lineWidth = 0.6;
    cl.grass.forEach((gr) => {
      const len = gr.long * grown;
      g.beginPath(); g.moveTo(gr.x, 0);
      g.quadraticCurveTo(gr.x + Math.sin(gr.tilt) * len * 0.5 + gr.bend * len * 0.3, -Math.cos(gr.tilt) * len * 0.5,
        gr.x + Math.sin(gr.tilt) * len + gr.bend * len * 0.4, -Math.cos(gr.tilt) * len);
      g.stroke();
    });
  }

  /** A sword leaf out of the crown: a centre line bending twice (and
   *  flopping over, for some), narrow at the base, broad a little way up,
   *  tapering to the tip; browned at the tip for some, a paler midrib for
   *  others. */
  function leaf(g, lf, grown, clock, a) {
    const len = lf.long * grown;
    if (len < 2) return;
    const N = 12, sw = REDUCE_MOTION ? 0 : Math.sin(clock / 2.1 + lf.phase) * 0.035;
    const pts = [[lf.x, lf.y, lf.tilt]];
    let x = lf.x, y = lf.y;
    for (let i = 1; i <= N; i++) {
      const t = i / N;
      let ang = lf.tilt + lf.c1 * t + lf.c2 * t * t + sw * t;
      if (lf.flop && t > lf.flop.at) ang += lf.flop.by * ease(((t - lf.flop.at) / (1 - lf.flop.at)) * 1.6);
      x += (Math.sin(ang) * len) / N;
      y -= (Math.cos(ang) * len) / N;
      pts.push([x, y, ang]);
    }
    const half = (t) => (lf.broad * (0.3 + 0.7 * Math.min(1, t / 0.18)) * Math.pow(1 - t, 0.75)) / 2;
    const L = [], R = [];
    pts.forEach(([px, py, ang], i) => {
      const w = half(i / N), nx = Math.cos(ang), ny = Math.sin(ang);
      L.push([px - nx * w, py - ny * w]);
      R.push([px + nx * w, py + ny * w]);
    });
    const outline = (from) => {
      g.beginPath();
      g.moveTo(L[from][0], L[from][1]);
      for (let i = from + 1; i <= N; i++) g.lineTo(L[i][0], L[i][1]);
      for (let i = N; i >= from; i--) g.lineTo(R[i][0], R[i][1]);
      g.closePath();
    };
    outline(0);
    g.fillStyle = rgba(lf.tone, lf.shade * a);
    g.fill();
    g.strokeStyle = rgba(lf.tone, (lf.shade + 0.3) * a);
    g.lineWidth = 0.7;
    g.stroke();
    if (lf.dry && grown > 0.9) {
      outline(Math.round(N * (1 - lf.dry)));
      g.fillStyle = rgba(DRY, 0.5 * a);
      g.fill();
    }
    if (lf.rib) {
      g.strokeStyle = rgba("196, 204, 176", 0.3 * a);
      g.lineWidth = 0.6;
      g.beginPath();
      for (let i = 1; i < N - 1; i++) (i === 1 ? g.moveTo(pts[i][0], pts[i][1]) : g.lineTo(pts[i][0], pts[i][1]));
      g.stroke();
    }
  }

  /** One petal from the heart of the flower. */
  function petal(g, x, y, ang, long, fat, wave) {
    const ca = Math.cos(ang), sa = Math.sin(ang), px = -sa, py = ca, w = long * fat;
    const tip = [x + ca * long, y + sa * long];
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + ca * long * 0.45 + px * w, y + sa * long * 0.45 + py * w, tip[0] + px * w * 0.45, tip[1] + py * w * 0.45);
    g.quadraticCurveTo(tip[0] + ca * (w * 0.35 + wave), tip[1] + sa * (w * 0.35 + wave), tip[0] - px * w * 0.45, tip[1] - py * w * 0.45);
    g.quadraticCurveTo(x + ca * long * 0.45 - px * w, y + sa * long * 0.45 - py * w, x, y);
    g.fill();
    g.stroke();
  }

  /** A stem rising past the leaves, a bract part way up it, and what is at
   *  the top of it: a bud, or three falls and three standards. */
  function stem(g, m, st, grown, open, clock, a) {
    const len = st.long * grown;
    if (len < 2) return;
    const s = swayOf(clock, st.phase, len / (m.T * 0.3));
    const dx = Math.sin(st.tilt), dy = -Math.cos(st.tilt);
    const at = (t) => [st.x + dx * len * t + st.bend * len * 0.3 * Math.sin(t * Math.PI * 0.9) + s * t * t, dy * len * t];
    const [bx, by] = at(0), [cx2, cy2] = at(0.5), [tx, ty] = at(1);
    g.strokeStyle = rgba(STEM, 0.62 * a);
    g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(cx2 * 2 - (bx + tx) / 2, cy2 * 2 - (by + ty) / 2, tx, ty); g.stroke();
    if (grown > st.bract) {
      const [kx, ky] = at(st.bract);
      const side = st.tilt >= 0 ? 1 : -1;
      g.fillStyle = rgba(STEM, 0.3 * a);
      g.beginPath(); g.moveTo(kx, ky + 6); g.quadraticCurveTo(kx + side * 5, ky - 4, kx + side * 3, ky - 14); g.quadraticCurveTo(kx + side * 1, ky - 3, kx, ky + 6); g.fill(); g.stroke();
    }
    if (grown < 0.98) return;
    g.fillStyle = rgba(STEM, 0.4 * a);
    g.beginPath(); g.moveTo(tx - 2, ty + 9); g.lineTo(tx + 1.5, ty - 2); g.lineTo(tx + 3.5, ty + 7); g.closePath(); g.fill(); g.stroke();
    const r = st.size;
    if (st.bud || open < 0.35) {
      const h = r * (0.9 + (st.bud ? 0 : open * 0.6));
      g.fillStyle = rgba(IRIS, 0.34 * a);
      g.strokeStyle = rgba(IRIS, 0.7 * a);
      g.lineWidth = 0.9;
      g.beginPath();
      g.moveTo(tx, ty);
      g.quadraticCurveTo(tx - r * 0.34, ty - h * 0.5, tx + st.turn * 6, ty - h);
      g.quadraticCurveTo(tx + r * 0.3, ty - h * 0.45, tx, ty);
      g.fill(); g.stroke();
      return;
    }
    const o = (open - 0.35) / 0.65;
    const fx = tx, fy = ty - r * 0.35;
    g.lineWidth = 0.9;
    st.falls.forEach((f) => {
      const ang = Math.PI / 2 + f.k * (0.55 + 0.45 * o) + st.turn + f.ang;
      const long = r * (f.k ? 1.35 : 1.05) * f.long * (0.5 + 0.5 * o);
      g.fillStyle = rgba(IRIS, 0.3 * a);
      g.strokeStyle = rgba(IRIS, 0.72 * a);
      petal(g, fx, fy, ang, long, f.fat, f.wave);
      g.strokeStyle = rgba(IRIS, 0.42 * a * o);
      g.lineWidth = 0.5;
      [-0.16, 0, 0.16].forEach((v) => {
        g.beginPath(); g.moveTo(fx + Math.cos(ang) * long * 0.2, fy + Math.sin(ang) * long * 0.2);
        g.lineTo(fx + Math.cos(ang + v) * long * 0.62, fy + Math.sin(ang + v) * long * 0.62); g.stroke();
      });
      g.lineWidth = 0.9;
      g.fillStyle = rgba(BEARD, 0.6 * a * o);
      for (let d = 0.16; d < 0.5; d += 0.07) {
        const j = Math.sin(d * 97 + f.ang * 40) * 0.8;
        g.fillRect(fx + Math.cos(ang) * long * d - 0.6 + j, fy + Math.sin(ang) * long * d - 0.6 - j, 1.2, 1.2);
      }
      g.fillStyle = rgba("214, 206, 230", 0.4 * a * o);
      g.strokeStyle = rgba(IRIS, 0.4 * a * o);
      petal(g, fx, fy, ang, long * 0.5, 0.22, 0);
    });
    st.stds.forEach((f) => {
      const ang = -Math.PI / 2 + f.k * 0.32 * o + st.turn + f.ang;
      g.fillStyle = rgba(IRIS, 0.2 * a);
      g.strokeStyle = rgba(IRIS, 0.66 * a);
      petal(g, fx, fy, ang, r * (f.k ? 1.05 : 1.25) * f.long * (0.6 + 0.4 * o), f.fat, -0.5);
    });
  }

  /** The irises: the ground, the leaves, then the stems, then the flowers. */
  function drawIrises(g, m, clock, a) {
    const since = REDUCE_MOTION ? 99 : clock - IRIS_FROM;
    if (since <= 0) return;
    m.clumps.forEach((cl) => {
      ground(g, cl, ease(since / 0.7), a);
      cl.leaves.forEach((lf) => leaf(g, lf, ease((since - lf.delay) / 1.5), clock, a));
      cl.stems.forEach((st) => stem(g, m, st,
        ease((since - IRIS_STEMS_AFTER - st.delay) / 1.2),
        ease((since - IRIS_OPEN_AFTER - st.delay) / 1.4), clock, a));
    });
  }
  // When the irises are whole (and so may be drawn over a picture of the rest).
  const IRIS_WHOLE = IRIS_FROM + IRIS_OPEN_AFTER + 0.52 * 2 + 1.5;

  /** How far the armoire reaches either side of its front and above the
   *  floor, and below it, for a front 100px wide — the drawing measured,
   *  not guessed. */
  function reachOf() {
    let x1 = Infinity, x2 = -Infinity, y1 = Infinity;
    const see = (x, y) => { x1 = Math.min(x1, x); x2 = Math.max(x2, x); y1 = Math.min(y1, y); };
    const g = new Proxy({ dry: true }, {
      get(t, k) {
        if (k in t) return t[k];
        if (k === "moveTo" || k === "lineTo") return see;
        if (k === "quadraticCurveTo") return (cx, cy, x, y) => see(x, y);
        return () => ({ addColorStop() {} });
      },
      set() { return true; },
    });
    const m = design(100);
    drawFrame(g, m, 1, 99, 1);
    drawIrises(g, m, 99, 1);
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
    const room = margin();
    const baseY = height - Math.max(12, height * 0.03);
    const across = REACH.left + REACH.right;
    // A LITTLE BIGGER (2026-10-03): up to 280px across its front (the solid
    // one stopped at 210), up to nine tenths of the window tall, and reaching
    // a little into the writing column's own margin, where there is no
    // writing yet — strong only to its edge (`hush`).
    const most = Math.min(280, (height * 0.9) / REACH.rise);
    const scale = scaleBox();
    const under = scale ? (baseY - scale.bottom - 10) / REACH.rise : Infinity;
    let W, from;
    if (room > 120) {
      // In the margin, a little into the column's own; clear of the scale —
      // beside it, or under it, whichever leaves it the larger.
      const to = room + 48;
      const beside = (x) => Math.min(most, (to - x) / across);
      from = 14;
      W = beside(14);
      if (scale) {
        const a = beside(scale.right + 12), b = Math.min(W, under);
        if (a >= b) { W = a; from = scale.right + 12; } else W = b;
      }
    } else {
      // On a window without margins, a small one in the corner, quiet
      // behind the writing — under the scale, if it is shown.
      from = 8;
      W = Math.min(width * 0.34, 150, most, under);
    }
    W = Math.max(50, W);
    const left = from + REACH.left * W;
    shape = design(W);
    frame = { left, baseY, wide: W, tall: shape.T, hinge: shape.hinge, doorTop: shape.doorTop, doorBot: shape.doorBot,
      reach: shape.openW };
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
   *  taken back by how far over the writing it stands — strong to the
   *  column's edge, quiet by the time the writing begins, 64px in; without
   *  margins, quiet all the way across. */
  function hush(g) {
    let a = 0, b = 1;
    if (width > COLUMN) { a = margin(); b = a + 60; }
    b = Math.max(a + 1, Math.min(b, width / 2));
    const k = (x) => Math.max(0, Math.min(1, x / width));
    const grad = g.createLinearGradient(0, 0, width, 0);
    const gone = "rgba(0, 0, 0, " + (1 - QUIET) + ")";
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

  // THE ARMOIRE, ONCE IT STANDS, IS A PICTURE: built and its clothes in, the
  // lines, the inside and the clothes never move again, so they are drawn
  // once into a picture of their own the size of the window and laid down
  // each frame; only the irises, which sway, are drawn over it every frame.
  // A resize makes it again.
  let still = null, stillFor = "";
  const CLOTHES_IN = BUILD * 0.55 + 1.75;
  function drawArmoire(clock) {
    const built = REDUCE_MOTION ? 1 : ease(clock / BUILD);
    const whole = REDUCE_MOTION || (built >= 1 && clock > CLOTHES_IN);
    if (whole) {
      const key = canvas.width + "x" + canvas.height;
      if (stillFor !== key) {
        still = still || document.createElement("canvas");
        still.width = canvas.width; still.height = canvas.height;
        const made = still.getContext("2d");
        made.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        made.clearRect(0, 0, width, height);
        made.translate(frame.left, frame.baseY);
        drawFrame(made, shape, 1, 99, 1);
        stillFor = key;
      }
      ink.save();
      ink.setTransform(1, 0, 0, 1, 0, 0);
      ink.drawImage(still, 0, 0);
      ink.restore();
    } else {
      ink.save();
      ink.translate(frame.left, frame.baseY);
      drawFrame(ink, shape, built, clock, 1);
      ink.restore();
    }
    ink.save();
    ink.translate(frame.left, frame.baseY);
    drawIrises(ink, shape, clock, 1);
    ink.restore();
    hush(ink);
    return built;
  }

  function draw(clock, dt) {
    if (!width) return;
    ink.clearRect(0, 0, width, height);

    // THE ARMOIRE, drawn up from the floor, its clothes coming in once its
    // door is drawn and its irises growing at its feet.
    const built = drawArmoire(clock);

    // THE ORRIS POWDER, out of the open door, faster while the hand is near.
    const [gx] = place(frame.hinge, 0);
    const near = Math.hypot(handX - gx, handY - (frame.baseY - frame.tall * 0.5)) < frame.tall * 0.7;
    if (!REDUCE_MOTION && built >= 1 && clock - lastPuff > (near ? PUFF_NEAR : PUFF_EVERY)) {
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

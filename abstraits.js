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
// THE ARMOIRE stands in the left margin on the floor of the window,
// drawn in specks along its lines in an old walnut — a crown with a
// broken pediment and a finial, carved scrolls, two panelled doors (one
// arched), a drawer with its knobs, bun feet, and a key in the lock —
// a few of its specks worn away and the whole of it leaning a hair. It
// BUILDS itself up from the floor as the page opens. Its right door
// stands ajar, and in the dark behind it stand THREE IRISES — three
// falls hanging and three standards up, each with its touch of gold —
// and ORRIS POWDER, the iris's own butter, drifts out of the gap: a
// speck at a time, violet-grey, slowing and rising and gone. It drifts
// out a little faster while the pointer is near.
// And since the night of 2026-09-25, CLOTHES — "put folded clothes and
// hangers with something on it in the armoire", which the owner wanted
// in this armoire as well as the hover's — and since 2026-10-01 a blazer,
// a dress and a pair of trousers at their real sizes, on a rail under a
// shelf of folded clothes near the top, each hanger hidden inside its
// garment as it is in life (THE CLOTHES, below), all in specks as the
// rest of it is. The irises stand in front of them, on the floor of it.
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
  let ink = canvas.getContext("2d");
  const page = ink;   // (`ink` is lent to the armoire's own picture while it is made, below)
  if (!ink) return;

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const WALNUT = "88, 62, 44";
  const DARK = "30, 24, 22";
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
  let wood = [], inside = [], clothes = [], irises = [], frame = null;
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
  // THE ARMOIRE, in its own frame: x from 0 to `wide`, y from 0 at the
  // floor up to -tall. Built once per size of window.
  // ============================================================
  function along(points, gap, out, tall) {
    for (let i = 0; i + 1 < points.length; i++) {
      const [x1, y1] = points[i], [x2, y2] = points[i + 1];
      const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / gap));
      for (let k = 0; k < n; k++) {
        if (random() < 0.07) continue;
        const t = k / n;
        out.push({ x: x1 + (x2 - x1) * t + between(-0.4, 0.4), y: y1 + (y2 - y1) * t + between(-0.4, 0.4),
          up: -(y1 + (y2 - y1) * t) / tall, s: between(0.9, 1.7), tone: between(0.35, 0.68) });
      }
    }
  }
  const arc = (cx, cy, r, from, to, n) => Array.from({ length: n + 1 }, (_, i) => {
    const t = from + (to - from) * (i / n);
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });
  const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

  function build() {
    seed = 52231;
    const room = margin();
    // Sized to the margin it stands in; on a window without margins, a
    // small one in the corner, quiet behind the writing.
    const wide = room > 120 ? Math.min(room - 34, 210) : Math.min(width * 0.26, 110);
    const tall = wide * 2.05;
    const left = room > 120 ? (room - wide) / 2 : 8;
    const baseY = height - Math.max(12, height * 0.03);
    const lean = between(-0.006, 0.006);
    wood = [];
    const put = (pts, gap) => along(pts, gap || Math.max(1.8, wide / 90), wood, tall);
    const foot = tall * 0.05, body = tall * 0.8, crown = tall * 0.06;
    const top = -(foot + body), mid = wide / 2;
    const drawerH = body * 0.13, doorTop = top + body * 0.02, doorBot = -foot - drawerH - 6;
    [wide * 0.1, wide * 0.9].forEach((fx) => put(arc(fx, -foot / 2, foot / 2, 0, Math.PI * 2, 14), 1.6));
    put(box(0, top, wide, body));
    put([[-4, -foot], [wide + 4, -foot]]);
    put([[-4, -foot - 5], [wide + 4, -foot - 5]]);
    put(box(8, -foot - drawerH - 1, wide - 16, drawerH - 4));
    [wide * 0.3, wide * 0.7].forEach((kx) => put(arc(kx, -foot - drawerH / 2 - 3, 2.4, 0, Math.PI * 2, 8), 1.3));
    put([[-6, top], [-10, top - crown * 0.4], [wide + 10, top - crown * 0.4], [wide + 6, top]]);
    put([[-12, top - crown * 0.4], [-12, top - crown], [wide + 12, top - crown], [wide + 12, top - crown * 0.4]]);
    const ped = top - crown;
    put(Array.from({ length: 13 }, (_, i) => { const t = i / 12; return [-8 + t * (mid - 18), ped - Math.sin(t * Math.PI * 0.62) * tall * 0.09]; }));
    put(Array.from({ length: 13 }, (_, i) => { const t = i / 12; return [wide + 8 - t * (mid - 18), ped - Math.sin(t * Math.PI * 0.62) * tall * 0.09]; }));
    put(arc(mid, ped - tall * 0.07, 5, 0, Math.PI * 2, 12), 1.5);
    put([[mid, ped - tall * 0.07 + 5], [mid, ped]]);
    [-1, 1].forEach((sd) => put(Array.from({ length: 16 }, (_, i) => {
      const t = (i / 15) * Math.PI * 2.4, r = 7 * (1 - i / 18);
      return [mid + sd * 22 + sd * Math.cos(t) * r, ped - tall * 0.035 + Math.sin(t) * r];
    }), 1.5));
    const dl = 8, dr = mid - 2;
    put(box(dl, doorTop, dr - dl, doorBot - doorTop));
    const pw = dr - dl - 16, pTop = doorTop + 14, pBot = doorTop + (doorBot - doorTop) * 0.62;
    put([[dl + 8, pBot], [dl + 8, pTop + pw / 2]].concat(arc(dl + 8 + pw / 2, pTop + pw / 2, pw / 2, Math.PI, Math.PI * 2, 12), [[dl + 8 + pw, pBot], [dl + 8, pBot]]));
    put(box(dl + 8, pBot + 12, pw, doorBot - pBot - 24));
    const keyY = (doorTop + doorBot) / 2;
    put(arc(dr - 7, keyY, 2.1, 0, Math.PI * 2, 8), 1.1);
    put([[dr - 7, keyY + 2], [dr - 7, keyY + 12]], 1.3);
    put(arc(dr - 7, keyY + 16, 3.4, 0, Math.PI * 2, 10), 1.3);
    // The right door, ajar, swung out on its hinge.
    const hinge = wide - 8, openW = (hinge - mid - 2) * 0.46, skew = tall * 0.035;
    put([[hinge, doorTop], [hinge + openW, doorTop - skew], [hinge + openW, doorBot + skew], [hinge, doorBot]]);
    put([[hinge + openW * 0.22, doorTop + 10 - skew * 0.22], [hinge + openW * 0.22, doorBot - 10 + skew * 0.22]], 2.4);
    inside = [];
    const many = Math.round((hinge - mid) * (doorBot - doorTop) / 26);
    for (let i = 0; i < many; i++) {
      const y = between(doorTop + 2, doorBot - 2);
      inside.push({ x: between(mid + 2, hinge), y, up: -y / tall, s: between(0.9, 1.4), tone: between(0.05, 0.14) });
    }
    // Under the shelf now, the clothes being over it.
    irises = [0.3, 0.55, 0.78].map((k, i) => ({
      x: mid + 2 + (hinge - mid - 2) * k,
      top: doorBot - (doorBot - doorTop) * [0.28, 0.34, 0.31][i],
      turn: between(-0.2, 0.2),
    }));
    dressUp(mid, hinge, doorTop, doorBot, tall, wide);
    frame = { left, baseY, lean, wide, tall, hinge, doorTop, doorBot, near: false };
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
  // behind the clothes (the same way they would in real life)". Every
  // speck carries its own colour (`c`). Until then it was a coat, a dress
  // and a shirt, small, on a rail over a shelf half way down, their
  // hangers drawn over them.
  // ============================================================
  const BLAZER = "92, 98, 114", DRESS = "154, 132, 168", TROUSERS = "176, 156, 128";
  const FOLDS = ["206, 196, 178", "150, 136, 176", "118, 128, 142", "176, 150, 120", "104, 112, 96", "168, 120, 112"];
  const TURNED = 0.74;
  let hidden = [];                 // the garments' outlines, which the inside does not show through
  function dressUp(mid, hinge, doorTop, doorBot, tall, wide) {
    clothes = [];
    hidden = [];
    const inL = mid + 6, inR = hinge - 4, room = inR - inL, gs = Math.max(0.5, room / 84);
    const cm = tall / 210;
    const inPoly = (pts, x, y) => {
      let odd = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) odd = !odd;
      }
      return odd;
    };
    // What a speck of a garment may not be drawn over: the opening's
    // edges, and every garment in front of it.
    let front = [];
    const shown = (x, y) => x >= inL - 1 && x <= inR + 1 && !front.some((poly) => inPoly(poly, x, y));
    const keep = (p) => { if (shown(p.x, p.y)) clothes.push(p); };
    const line = (pts, c, a, gap, also) => {
      const out = [];
      along(pts, gap || 1.7, out, tall);
      out.forEach((p) => { p.c = c; p.tone = a * (0.8 + random() * 0.4); if (!also || !also.some((poly) => inPoly(poly, p.x, p.y))) keep(p); });
    };
    /** Specks scattered through a closed outline, thinner than its edge. */
    const fillIn = (pts, c, a, step) => {
      let l = Infinity, r = -Infinity, t = Infinity, b = -Infinity;
      pts.forEach(([x, y]) => { l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y); });
      for (let y = t; y < b; y += step) for (let x = l; x < r; x += step) {
        const px = x + between(-0.8, 0.8), py = y + between(-0.8, 0.8);
        if (random() < 0.25 || !inPoly(pts, px, py)) continue;
        keep({ x: px, y: py, up: -py / tall, s: between(0.8, 1.4), tone: a * (0.6 + random() * 0.6), c });
      }
    };
    const qb = (a0, a1, a2, n) => Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n, u = 1 - t;
      return [u * u * a0[0] + 2 * u * t * a1[0] + t * t * a2[0], u * u * a0[1] + 2 * u * t * a1[1] + t * t * a2[1]];
    });
    // The shelf near the top, and the rail under it on a bracket at
    // either end.
    const shelfY = doorTop + 16 * cm;
    const railY = shelfY + 10 * cm;
    line([[mid + 2, shelfY], [hinge, shelfY]], WALNUT, 0.7, 1.4);
    line([[mid + 2, shelfY + 4], [hinge, shelfY + 4]], WALNUT, 0.45, 1.8);
    line([[inL - 3, railY], [inR + 3, railY]], WALNUT, 0.7, 1.4);
    line([[inL - 3, railY - 5], [inL - 3, railY + 3]], WALNUT, 0.6, 1.4);
    line([[inR + 3, railY - 5], [inR + 3, railY + 3]], WALNUT, 0.6, 1.4);

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
      return out;
    };
    const hung = [
      { kind: "blazer", x: inL + 9 * cm, c: BLAZER },
      { kind: "dress", x: inL + 27.5 * cm, c: DRESS },
      { kind: "trousers", x: inL + 40 * cm, c: TROUSERS },
    ].map((g) => ({ ...g, ...shapes(g.kind, g.x) }));
    // Front to back, so each knows what stands in front of it.
    for (let i = hung.length - 1; i >= 0; i--) {
      const g = hung[i];
      front = hung.slice(i + 1).flatMap((o) => [o.body, o.behind].filter(Boolean));
      const own = [g.body, g.behind, g.inner].filter(Boolean);
      // The hanger, where its own garment does not cover it.
      line(g.hanger, WALNUT, 0.85, 1.3, own);
      line(g.hook, WALNUT, 0.85, 1.1, own);
      if (g.behind) { fillIn(g.behind, g.c, 0.36, 2.4); line(g.behind.concat([g.behind[0]]), g.c, 0.85, 1.4, [g.body]); }
      fillIn(g.body, g.c, 0.42, 2.3);
      line(g.body.concat([g.body[0]]), g.c, 1, 1.3);
      if (g.inner) { fillIn(g.inner, g.c, 0.6, 2); line(g.inner, g.c, 0.7, 1.4); }
      g.seams.forEach((sm) => line(sm, g.c, 0.62, 1.8));
      g.dots.forEach(([x, y]) => keep({ x, y, up: -y / tall, s: 1.6, tone: 0.7, c: WALNUT }));
      hidden.push(...[g.body, g.behind].filter(Boolean));
    }
    front = [];
    // Folded clothes on the shelf, in two stacks, each fold its own.
    const stackW = Math.min(40, room * 0.42);
    [[inL + 1, 2 + Math.floor(random() * 2)], [inR - stackW * 0.92 - 1, 2 + Math.floor(random() * 2)]].forEach(([x0, n], si) => {
      let y = shelfY + 2;
      for (let i = 0; i < n; i++) {
        const h = between(5, 7.5) * Math.max(0.7, gs), w = stackW * (si ? 0.92 : 1) * between(0.86, 1), off = between(-2, 2);
        const L = x0 + off, R = L + w, T = y - h, B = y, open = random() < 0.5;
        const c = FOLDS[Math.floor(random() * FOLDS.length)];
        const rim = open ? [[R, T], [L + 3, T], ...arc(L + 3, (T + B) / 2, h / 2, -Math.PI / 2, -Math.PI * 1.5, 6), [L + 3, B], [R, B], [R, T]]
          : [[L, T], [R - 3, T], ...arc(R - 3, (T + B) / 2, h / 2, -Math.PI / 2, Math.PI / 2, 6), [R - 3, B], [L, B], [L, T]];
        fillIn(rim, c, 0.4, 1.9);
        line(rim, c, 0.8, 1.4);
        y = T;
      }
    });
    // The inside does not show through what hangs in front of it.
    inside = inside.filter((p) => !hidden.some((poly) => inPoly(poly, p.x, p.y)));
  }

  const place = (x, y) => [frame.left + x + y * frame.lean, frame.baseY + y];

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

  function drawIris(f, bloom) {
    const [bx, by] = place(f.x, frame.doorBot - 4);
    const [tx, ty] = place(f.x + f.turn * 20, f.top);
    const q = quiet(tx);
    ink.lineWidth = 1;
    ink.strokeStyle = "rgba(" + STEM + "," + (0.5 * bloom * q).toFixed(3) + ")";
    ink.beginPath(); ink.moveTo(bx, by); ink.quadraticCurveTo(bx + f.turn * 10, (by + ty) / 2, tx, ty); ink.stroke();
    ink.beginPath(); ink.moveTo(bx, by); ink.quadraticCurveTo(bx - 6, by - 26, bx - 3 + f.turn * 8, by - 48 * bloom); ink.stroke();
    const r = Math.min(12, frame.wide * 0.07) * bloom;
    ink.strokeStyle = "rgba(" + IRIS + "," + (0.62 * bloom * q).toFixed(3) + ")";
    ink.fillStyle = "rgba(" + IRIS + "," + (0.16 * bloom * q).toFixed(3) + ")";
    const petal = (ang, long, fat) => {
      ink.beginPath();
      ink.moveTo(tx, ty);
      ink.quadraticCurveTo(tx + Math.cos(ang - fat) * r * long * 0.8, ty + Math.sin(ang - fat) * r * long * 0.8, tx + Math.cos(ang) * r * long, ty + Math.sin(ang) * r * long);
      ink.quadraticCurveTo(tx + Math.cos(ang + fat) * r * long * 0.8, ty + Math.sin(ang + fat) * r * long * 0.8, tx, ty);
      ink.fill(); ink.stroke();
    };
    [-1.05, 0, 1.05].forEach((k) => petal(Math.PI / 2 + k + f.turn, k ? 1.55 : 1.2, 0.42));
    [-0.38, 0, 0.38].forEach((k) => petal(-Math.PI / 2 + k + f.turn, k ? 1.2 : 1.35, 0.3));
    ink.fillStyle = "rgba(" + GOLD + "," + (0.5 * bloom * q).toFixed(3) + ")";
    [-1.05, 0, 1.05].forEach((k) => {
      const ang = Math.PI / 2 + k + f.turn;
      ink.fillRect(tx + Math.cos(ang) * r * 0.45 - 0.7, ty + Math.sin(ang) * r * 0.45 - 0.7, 1.4, 1.4);
    });
  }

  // THE ARMOIRE, ONCE IT STANDS, IS A PICTURE. Built and in bloom, nothing
  // of it moves again (its specks stand where they were laid, and only the
  // powder and the drip move), but it was drawn speck by speck — thousands,
  // each its own colour — every frame, which was most of what this page
  // asked of a phone (2026-10-01). So once it is whole it is drawn once,
  // into a picture of its own the size of the window, and that is laid
  // down each frame; a resize makes it again.
  let still = null, stillFor = "";
  function drawArmoire(built, bloom) {
    [wood, inside, clothes].forEach((list, which) => list.forEach((p) => {
      if (p.up > built * 1.05) return;
      const [x, y] = place(p.x, p.y);
      fill(which === 2 ? p.c : which ? DARK : WALNUT, p.tone, x);
      ink.fillRect(x, y, p.s, p.s);
    }));
    if (bloom > 0) irises.forEach((f) => drawIris(f, bloom));
  }

  function draw(clock, dt) {
    if (!width) return;
    ink.clearRect(0, 0, width, height);

    // THE ARMOIRE, built up from the floor.
    const built = REDUCE_MOTION ? 1 : ease(clock / BUILD);
    const bloom = REDUCE_MOTION ? 1 : ease((clock - BUILD * 0.85) / BLOOM);
    if (built >= 1 && bloom >= 1) {
      const key = canvas.width + "x" + canvas.height;
      if (stillFor !== key) {
        still = still || document.createElement("canvas");
        still.width = canvas.width; still.height = canvas.height;
        const made = still.getContext("2d");
        made.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        ink = made;
        drawArmoire(1, 1);
        ink = page;
        stillFor = key;
      }
      ink.save();
      ink.setTransform(1, 0, 0, 1, 0, 0);
      ink.drawImage(still, 0, 0);
      ink.restore();
    } else drawArmoire(built, bloom);

    // THE ORRIS POWDER, out of the gap, faster while the hand is near.
    const [gx] = place(frame.hinge, 0);
    const near = Math.hypot(handX - gx, handY - (frame.baseY - frame.tall * 0.5)) < frame.tall * 0.7;
    if (!REDUCE_MOTION && bloom > 0.5 && clock - lastPuff > (near ? PUFF_NEAR : PUFF_EVERY)) {
      lastPuff = clock;
      powder.push({ x: frame.hinge + between(0, 4), y: between(frame.doorTop + 20, frame.doorBot - 20), born: clock,
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
        const [x, y] = place(frame.hinge + 6 + (i * 37) % 40, frame.doorTop + 30 + ((i * 53) % Math.max(1, frame.doorBot - frame.doorTop - 60)));
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

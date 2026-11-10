/* ============================================================
   PERFUMERS — PERFUMER WORLDS (perfumers/index.html, since 2026-11-10; it
   was test page 1 from 2026-11-06 — the owner: "also replace perfumers apge
   with test page 1, and vice versa", and the radial poster that stood here
   is test page 1 now).

   How it began, on the test page: "change test page 1 to make it more into
   a perfumer oriented page ... you initially start with a diagram like this
   (image 2), and each dot or node on that when clicked will take you to a
   sphere ... The central sphere node should be of the perfumer, and sphere
   nodes around it should be of the houses ... Make sure to have a return
   button." And then: "remove the earth actually, make it way more abstract
   and blobby like in the image i referenced (image 4) ... Add feathered
   borders, chromatic abberation and some other effects ... I want you to
   make the page look good."

   TWO VIEWS, each with its own name (2026-11-08):
   THE STRINGS (first)  on black, A DOT FOR EVERY HOUSE A PERFUMER MADE FOR,
                      each perfumer's dots a block of their own with their
                      name over it, down the two sides, A to Z; and from every
                      dot A STRING to one point low in the middle — worked out
                      as a real string is since 2026-11-10: hanging under its
                      own weight, snapping taut the moment its perfumer is
                      pointed at and only then, and ringing where the hand
                      plucks it. The perfumes no source credits are ONE
                      HEXAGON high in the middle (2026-11-10), its one string
                      straight down. Pointed at, a block lights whole, and a
                      note by the hand says who it is and how many houses.
                      Pressed, THE OPENING: the block's strings reel its dots
                      in to the point while the rest fall slack and come apart
                      into red, green and blue; then the world opens out of the
                      point through three discs, one for each colour, a beat
                      apart in time and a little apart in place — blue first,
                      red last.
   THE WORLD          a pale poster under a title and a heavy rule, grain over
                      all of it. In the middle a dark abstract blob — A
                      PERFUMER, a lobe for every one of their houses; or A
                      HOUSE, a lobe for every perfumer who made for it — seen
                      through THE LENS; round it, out of focus, its houses or
                      its perfumers as spheres, and pressing one makes it the
                      middle. PERFUMERS ARE ROUND AND PLUM, HOUSES ARE CUT AND
                      INK; the perfumes no source credits a hexagon, and their
                      world a list in a hexagon, no blob at all (2026-11-10).
                      THE SWARM, fine specks, turns round the last sphere the
                      hand was on (2026-11-10; a double circle until then),
                      and nothing round the middle. ‹ › and the list of every
                      perfumer slide one world out and the next in. Learn More
                      at the foot: a sheet under the poster, glided to. RETURN
                      goes back to the strings from anywhere; so does Esc.

   ITS COLOURS: THE LENS — nothing painted, the blob one dark shape that each
   of the three colours sees a little apart, so its edge is blue-violet above
   and gold going orange below and its middle plum. The split before it is
   ?look=split, and TP1 BACKUP ?look=backup ("save this version. I like it").
   HOW IT IS DRAWN: a blob is a field of soft lobes, f = Σ e^(1 − q), worked
   out a pixel at a time in a small picture and laid down large, which
   feathers every edge. The middle one is worked out again 30 times a
   second as its lobes drift; the spheres round it once each, one a frame.

   All of it from the site's Perfumers ledger, perfumers-data.js.
   ============================================================ */
(function () {
  "use strict";
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  // smootherstep: at rest at both ends, and gentler there than smooth
  const soft = (t) => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const hash = (t) => { let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const el = (s) => document.querySelector(s);
  const cmp = (a, b) => String(a).localeCompare(String(b), "en", { sensitivity: "base" });

  // ---- THE DATA: the site's Perfumers ledger (perfumers-data.js, written by
  // tools/perfumers/build.py from tools/perfumers/LEDGER.md, with the
  // biographies of tools/perfumers/BIOS.md), read into the shape the drawing
  // works in — a perfume a short row of numbers ----------------------------
  const D = (function (L) {
    if (!L) return null;
    const pid = new Map(L.perfumers.map((p, i) => [p.id, i])), hid = new Map(L.houses.map((h, i) => [h.id, i]));
    const CRED = { named: 0, house: 1, none: 2 };
    return {
      perfumers: L.perfumers.map((p) => ({ id: p.id, name: p.name, sort: p.sort || p.name, from: p.from || "", born: p.born || "",
        about: (p.about || []).map((a) => a.t), bio: p.bio || null })),
      houses: L.houses.map((h) => ({ id: h.id, name: h.name, from: h.from || "", founded: h.founded || "", about: h.about || "", page: h.page || "", s: h.s || [] })),
      perfumes: L.perfumes.map((x) => [x.n, x.p.map((q) => pid.get(q)), CRED[x.c], x.y || 0, hid.get(x.h), x.k === "individual" ? 0 : x.k === "house" ? 1 : 2, x.s || [], x.at || ""]),
      src: new Map(L.sources.map((x) => [x.id, x])),
    };
  })(window.PERFUMERS_DATA);
  if (!D) return;
  const ROOT = window.SITE_ROOT || "../";
  const CREDIT = ["named by a source", "the house's perfumer", "who made it is not publicly available"];
  const KIND = ["an individual fragrance written about here", "a house perfume written about here", "one of Prin Lomros' houses, not written about here"];
  const HOU = D.houses;
  const PER = D.perfumers.map((p, i) => Object.assign({}, p, { i, list: [], houses: new Map() }));
  // A HOUSE as a world of its own (2026-11-08 — "when you click on one of the
  // houses, it takes you to a blob of the house, and then the surrounding
  // blobs should be blobs of PERFUMERS that worked for that house"): its
  // perfumes, once each, and who made what for it
  const HOS = HOU.map((h, i) => Object.assign({}, h, { i, list: [], pers: new Map(), seed: hash("house:" + h.id) }));
  D.perfumes.forEach((r) => {
    const e = { n: r[0], c: r[2], y: r[3], h: r[4], k: r[5], s: r[6], who: r[1], at: r[7] };
    HOS[r[4]].list.push(e);
    r[1].forEach((q) => PER[q].list.push(Object.assign({ q }, e)));
  });
  PER.forEach((p) => {
    p.list.sort((a, b) => cmp(HOU[a.h].name, HOU[b.h].name) || cmp(a.n, b.n));
    p.list.forEach((e) => { if (!p.houses.has(e.h)) p.houses.set(e.h, []); p.houses.get(e.h).push(e); });
    p.none = p.id === "not-found";
    p.seed = hash(p.id);
    p.houses.forEach((l, h) => HOS[h].pers.set(p.i, l));
  });
  HOS.forEach((ho) => ho.list.sort((a, b) => (a.y || 9999) - (b.y || 9999) || cmp(a.n, b.n)));
  const ORDER = PER.slice().sort((a, b) => (a.none - b.none) || cmp(a.sort, b.sort));
  ORDER.forEach((p, k) => (p.k = k));
  const NP = ORDER.length;
  const perName = (p) => (p.none ? "Perfumers not found" : p.name);
  // a world's own name, and what it holds: a perfumer's perfumes or a house's
  const nameOf = (w) => (w.kind === "per" ? perName(w.p) : w.ho.name);
  const listOf = (w) => (w.kind === "per" ? w.p.list : w.ho.list);
  const keyOf = (w) => (w ? w.kind + ":" + (w.kind === "per" ? w.p.id : w.ho.id) : "");
  const same = (a, b) => !!a && !!b && keyOf(a) === keyOf(b);

  // ---- THE PAGE ------------------------------------------------------------
  const cv = document.querySelector(".pw-scene");
  const ctx0 = cv.getContext("2d");
  const tip = el(".pw-tip");
  let W = 0, H = 0, DPR = 1, phone = false;
  const P = { x: 0, y: 0, r: 100 };

  // ---- THE STRINGS (2026-11-08; "the rays" until then): a dot for every
  // house a perfumer made for, a block a perfumer, a string from each dot to
  // the one point low in the middle (image 2) ---------------------------------
  const map = { dots: [], blocks: [], strings: [], hub: { x: 0, y: 0 }, cell: 14, r: 2.8 };
  const SEG = 24;                 // the pieces a string is worked out and drawn in
  const SAG = 0.07;               // how far a slack string hangs at rest, of its length
  function layMap() {
    // (on a phone the point stands clear of the search at the foot)
    const top = phone ? H * 0.12 : H * 0.17, bottom = phone ? H * 0.71 : H * 0.76;
    map.hub = { x: W / 2, y: phone ? H * 0.79 : H * 0.84 };
    const perSide = phone ? 1 : W < 1100 ? 2 : 3, lanes = perSide * 2;
    const inner = phone ? 0.06 : 0.085, outer = phone ? 0.05 : 0.05;
    const laneW = (W * (0.5 - inner - outer)) / perSide;
    const cell = (map.cell = phone ? 11 : 14);
    map.r = phone ? 2.2 : 2.8;
    const ctxM = ctx0;
    ctxM.font = "400 " + (phone ? 8.5 : 9.5) + 'px "IBM Plex Mono", ui-monospace, monospace';
    map.labelW = (t) => ctxM.measureText(t).width;
    map.dots = []; map.blocks = []; map.strings = [];
    // the perfumers shared out among the lanes in order, A to Z from the left
    // — all but the perfumes no source credits, which are the hexagon
    const named = ORDER.filter((p) => !p.none), notFound = ORDER.find((p) => p.none) || null;
    const per = Math.floor(named.length / lanes), extra = named.length % lanes;
    let at = 0;
    for (let li = 0; li < lanes; li++) {
      const m = per + (li < extra ? 1 : 0);
      const side = li < perSide ? 0 : 1;
      const lx0 = side === 0 ? W * outer + li * laneW : W * (0.5 + inner) + (li - perSide) * laneW;
      const lx1 = lx0 + laneW - (phone ? 6 : 14);
      const step = (bottom - top) / Math.max(1, m);
      // each lane a little off the next, so the blocks are not a grid
      const off = (((li * 0.618) % 1) - 0.5) * step * 0.45;
      for (let j = 0; j < m; j++) {
        const p = named[at++];
        const hs = Array.from(p.houses.keys()).sort((a, b) => cmp(HOU[a].name, HOU[b].name));
        const wrap = 4, rows = Math.ceil(hs.length / wrap);
        const y = clamp(top + step * (j + 0.5) + off, top, bottom - (rows - 1) * cell);
        const b = { p, side, dots: [], lx0, lx1, ly: y - cell * 0.95, g: 0 };
        hs.forEach((h, k) => {
          const col = k % wrap, row = Math.floor(k / wrap);
          const x = side === 0 ? lx0 + cell * 0.5 + col * cell : lx1 - cell * 0.5 - col * cell;
          const d = { x, y: y + row * cell, p, h, b, ph: (hash(p.id + HOU[h].id) % 1000) / 1000 };
          b.dots.push(d); map.dots.push(d);
        });
        // its name over it, cut to its lane
        const name = perName(p).toUpperCase();
        let t = name;
        while (t.length > 3 && ctxM.measureText(t).width > lx1 - lx0) t = t.slice(0, -2);
        b.label = t === name ? name : t.replace(/\s+$/, "") + "…";
        const lw = ctxM.measureText(b.label).width;
        const xs = b.dots.map((d) => d.x), ys = b.dots.map((d) => d.y);
        b.x0 = Math.min(side === 0 ? lx0 : lx1 - lw, Math.min(...xs) - cell / 2);
        b.x1 = Math.max(side === 0 ? lx0 + lw : lx1, Math.max(...xs) + cell / 2);
        b.y0 = b.ly - 10; b.y1 = Math.max(...ys) + cell / 2;
        map.blocks.push(b);
      }
    }
    // a string for every dot
    if (notFound) layNotFound();
    map.dots.forEach((d, i) => { d.i = i; d.s = makeString(d); map.strings.push(d.s); });
  }
  // PERFUMERS NOT FOUND (2026-11-10 — "replace the node which says perfumer
  // not found with a hexagon, which says perfumers not found"; at the bottom
  // right since later that day — "make the perfumers not found note on the
  // botton right"): one hexagon low on the right, level with the point, its
  // name over it, and one string from it in to the point — a block of its own
  // with a dot of its own, so it is pointed at, lit and pressed as a block is
  function layNotFound() {
    const p = ORDER.find((q) => q.none);
    const r = phone ? 10 : 14;
    const lw = map.labelW ? map.labelW("PERFUMERS NOT FOUND") : 120;
    // as far right as its name, over it, lets it stand on the window
    const x = W - Math.max(phone ? 30 : 82, lw / 2 + (phone ? 10 : 16)), y = map.hub.y - (phone ? 6 : 4);
    const b = { p, side: 1, hex: true, hx: x, hy: y, hr: r, dots: [], lx0: x - 90, lx1: x + 90, ly: y - r - 12, g: 0, label: "PERFUMERS NOT FOUND" };
    // its string tied on at its left side
    const d = { x: x - r * 0.87, y, p, h: -1, b, ph: 0.5 };
    b.dots.push(d); map.dots.push(d);
    b.x0 = x - Math.max(r + 6, lw / 2); b.x1 = x + Math.max(r + 6, lw / 2);
    b.y0 = b.ly - 10; b.y1 = y + r + 6;
    map.blocks.push(b);
  }
  // A STRING, AS A STRING IS (2026-11-10 — "change the tension physics to be
  // more realistic, and only make it when hovered, not with a delay"): each
  // is worked out as a real string is, a line of SEG pieces under a tension,
  // pulled down by its own weight and slowed by the air — the wave equation,
  // stepped as finely as its tension needs. Slack, it hangs in the curve its
  // weight and its tension give it and sways a breath in the air; pointed at,
  // its tension rises at once to many times as much, and it snaps straight
  // and twangs once — the faster, the shorter and the tauter it is — and let
  // go, it drops back and bounces a little. Plucked, the hand pulls it out
  // where it crossed it, a kink either side that runs to its ends and back
  // and dies away, the high notes first. Nothing holds it taut but the hand.
  const GRAV = 2600;              // the weight, in pixels a second a second
  const TAUT = 14;                // how many times its slack tension a string pulled taut has
  const RAMP = 0.12;              // seconds its tension takes to come round to what it is pulled to
  const RAMP_LET = 0.035;         // and to fall away when it is let go
  const AIR = 2.6, AIR_TAUT = 9;  // how the air slows it, slack and taut
  function makeString(d) {
    const { hub } = map, R = rng(hash(d.p.id + ":" + d.h));
    const dx = hub.x - d.x, dy = hub.y - d.y, L = Math.hypot(dx, dy) || 1;
    // it hangs across its own line, the downward way
    const nx = dx >= 0 ? -dy / L : dy / L, ny = dx >= 0 ? dx / L : -dx / L;
    // its weight across its line; and the tension that, slack, lets it hang SAG of its length
    const load = GRAV * Math.max(0.35, ny);
    const c0 = (load * L) / (8 * SAG);
    const s = { d, L, nx, ny, load, c0, T: c0, k: 1, ring: 0, sp: 0.35 + R() * 0.45, ph: R() * TAU, plucked: 0,
      u: new Float32Array(SEG + 1), w: new Float32Array(SEG + 1), pts: new Float32Array(2 * (SEG + 1)) };
    restString(s, 1);
    return s;
  }
  // a string at rest at a tension (times its slack one)
  function restString(s, times) {
    s.T = s.c0 * times;
    const top = (s.load * s.L * s.L) / (2 * s.T);
    for (let i = 0; i <= SEG; i++) { const q = i / SEG; s.u[i] = top * q * (1 - q); s.w[i] = 0; }
    s.k = slackOf(s);
  }
  // 1 hanging, 0 taut, more than 1 slacker than it hangs at rest
  const slackOf = (s) => (s.c0 / s.T - 1 / TAUT) / (1 - 1 / TAUT);
  function stepStrings(dt, now, t, pullOf) {
    for (const s of map.strings) {
      const want = s.c0 * pullOf(s);
      if (STILL) { if (Math.abs(s.T - want) > 1e-3 * want) restString(s, want / s.c0); }
      else {
        s.T += (want - s.T) * (1 - Math.exp(-dt / (want < s.T ? RAMP_LET : RAMP)));
        const dx = s.L / SEG, c = Math.sqrt(Math.max(s.T, want));
        const n = Math.min(40, Math.max(1, Math.ceil((dt * c) / (0.7 * dx))));
        const h = dt / n, u = s.u, w = s.w;
        const taut = clamp((s.T / s.c0 - 1) / (TAUT - 1), 0, 1);
        const air = AIR + (AIR_TAUT - AIR) * taut;
        const kT = s.T / (dx * dx), kB = (0.3 * (s.L / Math.PI) ** 2) / (dx * dx);
        // a breath of air across it, as much as it is slack
        const wind = s.load * 0.12 * clamp(1 - taut * 1.6, 0, 1) * Math.sin(t * s.sp + s.ph);
        const f = s.load + wind;
        for (let m = 0; m < n; m++) {
          for (let i = 1; i < SEG; i++) w[i] += (kT * (u[i - 1] - 2 * u[i] + u[i + 1]) + kB * (w[i - 1] - 2 * w[i] + w[i + 1]) - air * w[i] + f) * h;
          for (let i = 1; i < SEG; i++) u[i] += w[i] * h;
        }
        s.k = slackOf(s);
      }
      // how far it is off the curve it would rest in: its ringing
      const top = (s.load * s.L * s.L) / (2 * s.T);
      let ring = 0;
      for (let i = 1; i < SEG; i++) { const q = i / SEG, o = Math.abs(s.u[i] - top * q * (1 - q)); if (o > ring) ring = o; }
      s.ring = ring;
      const d = s.d, dx = map.hub.x - d.x, dy = map.hub.y - d.y, pts = s.pts;
      for (let i = 0; i <= SEG; i++) {
        const q = i / SEG;
        pts[2 * i] = d.x + dx * q + s.nx * s.u[i];
        pts[2 * i + 1] = d.y + dy * q + s.ny * s.u[i];
      }
    }
  }
  // the hand across a string at q0 (0 its dot, 1 the point), moving across
  // it at `v` pixels a second (signed along its downward side): it is drawn
  // out there and let go, a kink either side
  function pluckString(s, q0, v) {
    const a = clamp(Math.abs(v) * 0.012, 2.2, 14) * Math.sign(v || 1);
    const q = clamp(q0, 0.06, 0.94);
    for (let i = 1; i < SEG; i++) {
      const x = i / SEG, tri = x < q ? x / q : (1 - x) / (1 - q);
      s.u[i] += a * tri;
      s.w[i] += v * 0.08 * tri;
    }
  }
  // a point along a string, q from its dot (0) to the point (1)
  function along(s, q) {
    const f = clamp(q, 0, 1) * SEG, i = Math.min(SEG - 1, Math.floor(f)), u = f - i, p = s.pts;
    return [lerp(p[2 * i], p[2 * i + 2], u), lerp(p[2 * i + 1], p[2 * i + 3], u)];
  }
  // a string drawn from q0 to q1 into the path being made
  function tracePart(x, s, q0, q1) {
    if (q1 <= q0) return;
    const p = s.pts;
    let [ax, ay] = along(s, q0);
    x.moveTo(ax, ay);
    for (let i = Math.ceil(q0 * SEG + 1e-6); i < q1 * SEG; i++) x.lineTo(p[2 * i], p[2 * i + 1]);
    [ax, ay] = along(s, q1);
    x.lineTo(ax, ay);
  }
  // THE LENS ON THE STRINGS (2026-11-07): every string, dot and light drawn
  // three times, in pure red, green and blue, added together — the blue a
  // little up and to the left, the red down and to the right — so where the
  // three meet they are white, and every edge is fringed blue above, gold
  // below. `only` draws one colour of the three, for the opening's discs.
  const LENS_RAYS = [["#ff0000", 1, 0.7, 0], ["#00ff00", 0.32, 0.22, 1], ["#0000ff", -1, -0.7, 2]];
  function lensed(x, fn, d, only) {
    if (d === undefined) d = phone ? 1.1 : 1.6;
    const op = x.globalCompositeOperation;
    x.globalCompositeOperation = "lighter";
    for (const [col, kx, ky, c] of LENS_RAYS) {
      if (only != null && only !== c) continue;
      x.save(); x.translate(kx * d, ky * d); fn(col, c); x.restore();
    }
    x.globalCompositeOperation = op;
  }
  // ---- THE BLOBS, as image 4's --------------------------------------------
  // lobes: [{ x, y, r, sides, rot }] in the blob's own units (the whole about
  // 1 across its middle); drawn into `cv2` (a canvas `n` pixels square
  // covering ±EXT), `ca` how far the fringes are thrown, in the same units,
  // `soft` how wide every edge is feathered
  const EXT = 1.75;
  const COL = {
    haze: [204, 194, 238], blue: [52, 84, 255], cyan: [120, 210, 255], gold: [255, 210, 36], rose: [255, 130, 120],
    edge: [74, 34, 112], deep: [26, 3, 14],
  };
  // a lobe's field: high in its middle, 1 at its edge, gone a little past
  // twice its radius — so lobes join with soft necks and stay lumps. A
  // house's lobes are hexagons (2026-11-08 — "please distinguish the houses
  // blobs and the perfumer blobs somehow"): q is its distance from the
  // nearest of its three pairs of sides, with a little of the circle's left
  // in it so its corners are cut, not sharp — a cut stone where a perfumer's
  // is a drop
  const K = 1.0;
  function fieldOf(lobes, n) {
    const step = (2 * EXT) / n;
    const L = lobes.length;
    const lx = new Float32Array(L), ly = new Float32Array(L), ir = new Float32Array(L), ia = new Float32Array(L);
    const hex = new Uint8Array(L), cs = new Float32Array(L * 6);
    lobes.forEach((o, i) => {
      lx[i] = o.x; ly[i] = o.y; ir[i] = 1 / (o.r * o.r);
      if (o.sides) {
        hex[i] = 1; const a = o.r * 0.92; ia[i] = 1 / (a * a);
        for (let j = 0; j < 3; j++) { cs[i * 6 + j * 2] = Math.cos((o.rot || 0) + j * 60 * DEG); cs[i * 6 + j * 2 + 1] = Math.sin((o.rot || 0) + j * 60 * DEG); }
      }
    });
    const fld = new Float32Array(n * n);
    for (let j = 0; j < n; j++) {
      const y = -EXT + (j + 0.5) * step;
      for (let i = 0; i < n; i++) {
        const x = -EXT + (i + 0.5) * step;
        let f = 0;
        for (let k = 0; k < L; k++) {
          const dx = x - lx[k], dy = y - ly[k], qc = (dx * dx + dy * dy) * ir[k];
          if (qc > 7) continue;
          let q = qc;
          if (hex[k]) {
            const o = k * 6;
            const m = Math.max(Math.abs(dx * cs[o] + dy * cs[o + 1]), Math.abs(dx * cs[o + 2] + dy * cs[o + 3]), Math.abs(dx * cs[o + 4] + dy * cs[o + 5]));
            q = 0.84 * m * m * ia[k] + 0.16 * qc;
          }
          if (q < 6) f += Math.exp(K * (1 - q));
        }
        fld[j * n + i] = f;
      }
    }
    return fld;
  }
  // `shade` lights the core a little towards its upper left, as a sphere is
  function paintBlob(cv2, n, lobes, ca, soft, shade) {
    if (cv2.width !== n) { cv2.width = cv2.height = n; }
    const x2 = cv2.getContext("2d");
    const img = x2.createImageData(n, n), d = img.data;
    const step = (2 * EXT) / n;
    const fld = fieldOf(lobes, n);
    const at = (i, j) => (i < 0 || j < 0 || i >= n || j >= n ? 0 : fld[j * n + i]);
    const sm = (a, b, v) => { const t = (v - a) / (b - a); return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); };
    const w = soft || 1, sh = shade || 0;
    const ox = Math.max(1, Math.round(ca / step)), oy = Math.max(1, Math.round((ca * 1.25) / step));
    const ox2 = Math.round(ox * 1.9), oy2 = Math.round(oy * 1.9);
    let r = 0, g = 0, b = 0, a = 0;
    const over = (c0, c1, c2, al) => { r = c0 * al + r * (1 - al); g = c1 * al + g * (1 - al); b = c2 * al + b * (1 - al); a = al + a * (1 - al); };
    const H0 = COL.haze, B0 = COL.blue, C0 = COL.cyan, G0 = COL.gold, R0 = COL.rose, E0 = COL.edge, D0 = COL.deep;
    for (let j = 0; j < n; j++) {
      const y = -EXT + (j + 0.5) * step;
      for (let i = 0; i < n; i++) {
        const fc = fld[j * n + i];
        const fb = at(i + ox, j + oy), fy = at(i - ox, j - oy);
        const most = Math.max(fc, fb, fy);
        if (most < 0.04) continue;
        const x = -EXT + (i + 0.5) * step;
        const win = 1 - sm(EXT * 0.6, EXT * 0.97, Math.sqrt(x * x + y * y));
        if (win <= 0) continue;
        const core = sm(1 - 0.22 * w, 1 + 0.34 * w, fc);
        const solid = sm(1.0, 1.4, fc);
        const blue = sm(0.9 - 0.14 * w, 1.04 + 0.08 * w, fb) * (1 - solid * 0.5);
        const gold = sm(0.9 - 0.14 * w, 1.04 + 0.08 * w, fy) * (1 - solid * 0.5);
        const cyan = sm(0.74 - 0.16 * w, 1.0 + 0.06 * w, at(i + ox2, j + oy2)) * 0.32;
        const rose = sm(0.74 - 0.16 * w, 1.0 + 0.06 * w, at(i - ox2, j - oy2)) * 0.26;
        const haze = sm(0.04, 1.0, most) * 0.74;
        r = g = b = a = 0;
        if (haze > 0) over(H0[0], H0[1], H0[2], haze);
        if (cyan > 0) over(C0[0], C0[1], C0[2], cyan);
        if (rose > 0) over(R0[0], R0[1], R0[2], rose);
        if (blue > 0) over(B0[0], B0[1], B0[2], blue * 0.88);
        if (gold > 0) over(G0[0], G0[1], G0[2], gold * 0.84);
        if (core > 0) {
          const k = sm(1.0, 2.1, fc);
          const lt = sh ? sh * clamp(0.6 - (x * 0.55 + y * 0.75), 0, 1) * (1 - sm(1.6, 3.2, fc) * 0.4) : 0;
          const dr = lerp(D0[0], 78, lt), dg = lerp(D0[1], 34, lt), db = lerp(D0[2], 96, lt);
          over(lerp(E0[0], dr, k), lerp(E0[1], dg, k), lerp(E0[2], db, k), core);
        }
        if (a > 0) { const o = (j * n + i) * 4; d[o] = r / a; d[o + 1] = g / a; d[o + 2] = b / a; d[o + 3] = a * win * 255; }
      }
    }
    x2.putImageData(img, 0, 0);
  }
  // ---- THE LENS (the very last round of 2026-11-06 — "Maybe experiment with
  // chromattic abberation to achieve that colour. I think in my reference there
  // is blue/orange colour average that gives it that vibe"): no colour is
  // painted at all. The blob is one dark shape, and each of the poster's three
  // colours sees it a little apart — the red thrown up and to the left, the
  // blue down and to the right, the green between them and a little softer.
  // Where only the blue is still light the poster shows blue, above; where
  // only the red and green are, orange and gold, below; and in the edge's own
  // falloff, where the green goes a little before the others, the faintest
  // lavender. Nothing lies round the edge but its fringes (2026-11-07, last —
  // "not an extra layer"). Its core is not quite black either: a perfumer's
  // a plum, the red let a little lighter than the rest; a house's (since
  // 2026-11-08) a cold ink, the blue and green let lighter than the red.
  // The lens's split, before it, is ?look=split; TP1 BACKUP is ?look=backup.
  const LOOK = (() => { const v = new URLSearchParams(location.search).get("look"); return v === "backup" || v === "split" ? v : "lens"; })();
  const GROUND = [226, 234, 230];                   // the poster, about the blob
  // how dark each colour goes in the blob's middle (red, green, blue)
  const LENS_DEEP = [0.84, 0.965, 0.92];            // a perfumer's: the plum
  const LENS_INK = [0.985, 0.935, 0.885];           // a house's: a cold ink
  const LENS_AT = [1, 0.3, -1];
  const LENS_SOFT = [1, 1.12, 1];
  function paintLens(cv2, n, lobes, shift, soft, shade, deep) {
    if (cv2.width !== n) { cv2.width = cv2.height = n; }
    const x2 = cv2.getContext("2d");
    const img = x2.createImageData(n, n), d = img.data;
    const step = (2 * EXT) / n;
    const fld = fieldOf(lobes, n);
    const DEEP = deep || LENS_DEEP;
    const at = (fx, fy) => {
      if (fx < 0 || fy < 0 || fx > n - 1 || fy > n - 1) return 0;
      const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, i1 = Math.min(n - 1, i + 1), j1 = Math.min(n - 1, j + 1);
      return (fld[j * n + i] * (1 - u) + fld[j * n + i1] * u) * (1 - v) + (fld[j1 * n + i] * (1 - u) + fld[j1 * n + i1] * u) * v;
    };
    const sm = (a, b, v) => { const t = (v - a) / (b - a); return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); };
    const w = soft || 1, sh = shade || 0;
    const px = shift / step, ax = px * 0.8, ay = px;
    const dk = [0, 0, 0], f = [0, 0, 0];
    for (let j = 0; j < n; j++) {
      const y = -EXT + (j + 0.5) * step;
      for (let i = 0; i < n; i++) {
        for (let c = 0; c < 3; c++) f[c] = at(i + ax * LENS_AT[c], j + ay * LENS_AT[c]);
        const most = Math.max(f[0], f[1], f[2]);
        if (most < 0.03) continue;
        const x = -EXT + (i + 0.5) * step;
        const win = 1 - sm(EXT * 0.6, EXT * 0.97, Math.sqrt(x * x + y * y));
        if (win <= 0) continue;
        const lt = sh ? sh * clamp(0.6 - (x * 0.55 + y * 0.75), 0, 1) * (1 - sm(1.6, 3.2, (f[0] + f[2]) / 2) * 0.4) : 0;
        let a = 0;
        for (let c = 0; c < 3; c++) {
          const body = sm(1 - 0.24 * w * LENS_SOFT[c], 1 + 0.36 * w, f[c]) * DEEP[c] * (1 - lt * (c === 1 ? 0.06 : c === 0 ? 0.22 : 0.3));
          dk[c] = body;
          if (dk[c] > a) a = dk[c];
        }
        if (a <= 0.002) continue;
        const o = (j * n + i) * 4;
        d[o] = GROUND[0] * (a - dk[0]) / a;
        d[o + 1] = GROUND[1] * (a - dk[1]) / a;
        d[o + 2] = GROUND[2] * (a - dk[2]) / a;
        d[o + 3] = a * win * 255;
      }
    }
    x2.putImageData(img, 0, 0);
  }
  function paintSplit(cv2, n, lobes, shift, soft, shade) {
    if (cv2.width !== n) { cv2.width = cv2.height = n; }
    const x2 = cv2.getContext("2d");
    const img = x2.createImageData(n, n), d = img.data;
    const step = (2 * EXT) / n;
    const fld = fieldOf(lobes, n);
    const at = (fx, fy) => {
      if (fx < 0 || fy < 0 || fx > n - 1 || fy > n - 1) return 0;
      const i = fx | 0, j = fy | 0, u = fx - i, v = fy - j, i1 = Math.min(n - 1, i + 1), j1 = Math.min(n - 1, j + 1);
      return (fld[j * n + i] * (1 - u) + fld[j * n + i1] * u) * (1 - v) + (fld[j1 * n + i] * (1 - u) + fld[j1 * n + i1] * u) * v;
    };
    const sm = (a, b, v) => { const t = (v - a) / (b - a); return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); };
    const w = soft || 1, sh = shade || 0;
    const lo = 1 - 0.24 * w, hi = 1 + 0.36 * w;
    const px = shift / step, ax = px * 0.8, ay = px;
    const H0 = COL.haze, E0 = COL.edge, D0 = COL.deep;
    for (let j = 0; j < n; j++) {
      const y = -EXT + (j + 0.5) * step;
      for (let i = 0; i < n; i++) {
        const fR = at(i + ax, j + ay), fG = at(i + ax * 0.8, j + ay * 0.8), fB = at(i - ax, j - ay);
        const most = Math.max(fR, fG, fB);
        if (most < 0.035) continue;
        const x = -EXT + (i + 0.5) * step;
        const win = 1 - sm(EXT * 0.6, EXT * 0.97, Math.sqrt(x * x + y * y));
        if (win <= 0) continue;
        const mR = sm(lo, hi, fR), mG = sm(lo, hi, fG), mB = sm(lo, hi, fB);
        const hz = sm(0.035, 1.0, most) * 0.55;
        const fc = (fR + fB) / 2;
        const k = sm(1.0, 2.1, fc);
        const lt = sh ? sh * clamp(0.6 - (x * 0.55 + y * 0.75), 0, 1) * (1 - sm(1.6, 3.2, fc) * 0.4) : 0;
        const dR = lerp(E0[0], lerp(D0[0], 78, lt), k), dG = lerp(E0[1], lerp(D0[1], 34, lt), k), dB = lerp(E0[2], lerp(D0[2], 96, lt), k);
        const hR = lerp(GROUND[0], H0[0], hz), hG = lerp(GROUND[1], H0[1], hz), hB = lerp(GROUND[2], H0[2], hz);
        const oR = hR * (1 - mR) + dR * mR, oB = hB * (1 - mB) + dB * mB;
        const oG = hG * (1 - mG) + dG * mG - Math.max(0, mB - mG) * 52;
        const a = Math.max(hz, mR, mG, mB);
        if (a <= 0.002) continue;
        const o = (j * n + i) * 4;
        d[o] = clamp((oR - GROUND[0] * (1 - a)) / a, 0, 255);
        d[o + 1] = clamp((oG - GROUND[1] * (1 - a)) / a, 0, 255);
        d[o + 2] = clamp((oB - GROUND[2] * (1 - a)) / a, 0, 255);
        d[o + 3] = a * win * 255;
      }
    }
    x2.putImageData(img, 0, 0);
  }
  // one painter for every look; `kind` the world's ("per" or "house")
  function paintAny(cv2, n, lobes, shift, soft, shade, kind) {
    if (LOOK === "backup") paintBlob(cv2, n, lobes, shift, soft * 1.7, shade);
    else if (LOOK === "split") paintSplit(cv2, n, lobes, shift * 1.25, soft * 1.25, shade);
    else paintLens(cv2, n, lobes, shift, soft, shade, kind === "house" ? LENS_INK : LENS_DEEP);
  }
  // the lobes of a world: a perfumer's, one for every house, as big as what
  // they made for it; a house's, one for every perfumer who made for it.
  // Each real lobe keeps which part of the list it is (o.part)
  function partsOf(w) {
    if (w.kind === "per") return Array.from(w.p.houses.entries()).map(([h, l]) => ({ n: l.length, say: HOU[h].name, h })).sort((a, b) => cmp(a.say, b.say));
    return Array.from(w.ho.pers.entries()).map(([q, l]) => ({ n: l.length, say: perName(PER[q]), q })).sort((a, b) => PER[a.q].k - PER[b.q].k);
  }
  function lobesOf(w) {
    const cut = w.kind === "house";
    const R = rng((cut ? w.ho.seed : w.p.seed) ^ 0x5bd1);
    const parts = partsOf(w).map((x, i) => Object.assign({ i }, x));
    const total = parts.reduce((s, x) => s + x.n, 0);
    // a blob is never quite a circle: small lobes more for a world of one or two
    while (parts.length < 3) parts.push({ n: Math.max(1, total * (0.16 + R() * 0.22)), i: -1 });
    const big = parts.slice().sort((a, b) => b.n - a.n);
    const most = big[0].n;
    const lobes = [];
    const lobe = (part, a, d, r, amp) => lobes.push({ part, a, hx: Math.cos(a) * d, hy: Math.sin(a) * d * 1.15, r, x: 0, y: 0, ph: R() * TAU, sp: 0.08 + R() * 0.14, amp, sides: cut ? 6 : 0, rot: R() * TAU });
    big.forEach((x, k) => {
      const r = 0.26 + 0.36 * Math.sqrt(x.n / most) * (k ? 0.9 : 1);
      const a = k ? -2.3 + k * 2.39996 + (R() - 0.5) * 0.7 : -1.9 + (R() - 0.5) * 0.4;
      const d = k ? 0.36 + 0.26 * R() + (1 - x.n / most) * 0.2 : 0.22;
      lobe(x.i >= 0 ? x : null, a, d, r, 0.03 + R() * 0.04);
      const buds = 1 + Math.floor(R() * 2.4);
      for (let j = 0; j < buds; j++) {
        const ba = a + (R() - 0.5) * 2.6, bd = d + r * (0.55 + R() * 0.4);
        lobe(null, ba, Math.min(bd, 0.95), r * (0.32 + R() * 0.26), 0.04 + R() * 0.05);
      }
    });
    lobe(null, 1.4 + (R() - 0.5) * 0.6, 0.32 + R() * 0.12, 0.34 + R() * 0.1, 0.03);
    let ext = 0;
    lobes.forEach((o) => (ext = Math.max(ext, Math.hypot(o.hx, o.hy) + o.r)));
    const k = Math.min(1, 1.05 / ext);
    lobes.forEach((o) => { o.hx *= k; o.hy *= k; o.r *= k; });
    driftLobes(lobes, 0);
    return lobes;
  }
  function driftLobes(lobes, t) {
    lobes.forEach((o) => {
      o.x = o.hx + (STILL ? 0 : Math.sin(t * o.sp + o.ph) * o.amp);
      o.y = o.hy + (STILL ? 0 : Math.cos(t * o.sp * 0.83 + o.ph * 1.3) * o.amp);
      if (o.sides && !STILL) o.rot = (o.rot0 == null ? (o.rot0 = o.rot) : o.rot0) + Math.sin(t * o.sp * 0.6 + o.ph) * 0.12;
    });
  }
  // A SPHERE round it: a perfumer two round lobes, a house two hexagons, a
  // little off round — the further it is (the less `focus`), the smaller,
  // the softer, the wider its fringes. Painted at the screen's own sharpness
  // (2026-11-08 — "the tiny spheres feel pixelated"; they were 24 to 70
  // pixels across, laid down three to six times as large)
  const SPH = (focus) => ({ shift: 0.05 + (1 - focus) * 0.045, soft: 1.4 - focus * 0.4 });
  function sphereLobes(kind, seed) {
    const R = rng(seed);
    if (kind === "house") return [{ x: 0, y: 0, r: 0.84, sides: 6, rot: R() * TAU }, { x: (R() - 0.5) * 0.24, y: (R() - 0.5) * 0.24, r: 0.48 + R() * 0.12, sides: 6, rot: R() * TAU }];
    return [{ x: 0, y: 0, r: 0.86 }, { x: (R() - 0.5) * 0.22, y: (R() - 0.5) * 0.22, r: 0.5 + R() * 0.12 }];
  }
  const sizeOf = (r) => (r * 2 * EXT) / 1.1;
  function paintSphere(b) {
    // the perfumes no source credits are no blob: a hexagon drawn as a line,
    // through the lens, every frame (drawHexLens)
    if (b.nf) { b.img = { c: null, s: sizeOf(b.r), hex: true }; return; }
    const c = document.createElement("canvas");
    const n = clamp(Math.round(sizeOf(b.r) * DPR * 0.62), 40, 240);
    const { shift, soft } = SPH(b.focus);
    paintAny(c, n, b.lobes, shift, soft, 0.9, b.kind);
    b.img = { c, s: sizeOf(b.r) };
  }

  // ---- A WORLD: a perfumer, or a house ----------------------------------------
  // what is in focus: { kind: "per", p } or { kind: "house", ho }
  let cur = null;
  let blobs = [];
  // the room the world has: between the readings and the list
  const F = { x0: 0, x1: 0, y0: 0, y1: 0 };
  // where the spheres stand round it, as image 4's — an angle, how far out
  // (of the room there is), and how near it is (its focus)
  const SPOTS = [[-2.55, 0.92, 0.9], [2.5, 0.86, 0.72], [-1.6, 0.9, 0.38], [0.72, 0.95, 0.95], [-0.62, 0.88, 0.52], [1.62, 0.92, 0.5], [3.12, 0.96, 0.62], [0.05, 0.94, 0.42], [-1.1, 0.7, 0.3], [2.05, 0.7, 0.32]];
  // round a perfumer, its houses; round a house, its perfumers
  function aroundOf(w) {
    if (w.kind === "per") return partsOf(w).map((x) => ({ kind: "house", ho: HOS[x.h], n: x.n }));
    return partsOf(w).map((x) => ({ kind: "per", p: PER[x.q], n: x.n }));
  }
  // the world of the perfumes no source credits (2026-11-10 — "it should be a
  // list, not the same as the blobs. same format, but no blobs"; and later
  // that day, "i dont want it to be a hexagon, rather make it just a list. a
  // normal list"): no blob, no spheres and nothing drawn, a plain list in the
  // middle, the readings and its houses either side as in every world
  const isNf = (w) => !!w && w.kind === "per" && w.p.none;
  function layWorld() {
    if (!cur) return;
    document.body.classList.toggle("is-nf", isNf(cur));
    if (isNf(cur)) { blobs = []; cur.lobes = null; cur.paint = null; writeNf(); return; }
    const R = rng((cur.kind === "per" ? cur.p.seed : cur.ho.seed) ^ 0x2f17);
    const around = aroundOf(cur);
    const Dx = Math.max(P.r * 1.25, (F.x1 - F.x0) / 2), Dy = Math.max(P.r * 1.05, (F.y1 - F.y0) / 2);
    const turn = (R() - 0.5) * 0.5;
    blobs = around.slice(0, SPOTS.length).map((a, i) => {
      const [an, far, focus] = SPOTS[i];
      const r = ((phone ? 15 : 30) + Math.min(1, Math.sqrt(a.n / 40)) * (phone ? 14 : 34)) * (0.68 + focus * 0.42);
      const x = P.x + Math.cos(an + turn) * Dx * far, y = P.y + Math.sin(an + turn) * Dy * far;
      const seed = hash(keyOf(a));
      return Object.assign(a, {
        r, focus, x: clamp(x, F.x0 + r * 0.6, F.x1 - r * 0.6), y: clamp(y, F.y0 + r * 0.6, F.y1 - r * 1.2), dx: 0, dy: 0,
        ph: R() * TAU, sp: 0.1 + R() * 0.16, lobes: sphereLobes(a.kind, seed), img: null, in: 0, lift: 0, wait: i * 0.05,
        nf: isNf(a),
      });
    }).sort((a, b) => a.focus - b.focus);
    cur.lobes = lobesOf(cur);
    cur.paint = null;
  }
  // the middle blob's own picture, worked out again 24 times a second as its
  // lobes drift, whatever the screen; `boost` widens its aberration (the
  // opening, a change)
  // (never more than thirty times a second since 2026-11-10, its aberration
  // too — it was worked out again every frame of an opening, and the
  // opening stuttered for it)
  function paintCur(w, t, force, boost) {
    if (!w.paint) { w.paint = document.createElement("canvas"); w.tick = -1; w.boost = 1; }
    const tick = STILL ? 0 : Math.floor(t * 30);
    const b = boost || 1;
    if (!force && tick === w.tick) return;
    if (!force && w.tick >= 0 && Math.abs(b - w.boost) < 0.01 && STILL) return;
    w.tick = tick; w.boost = b;
    driftLobes(w.lobes, t);
    paintAny(w.paint, phone ? 132 : 176, w.lobes, 0.05 * b, 0.95 + (b - 1) * 0.2, 0.45, w.kind);
  }
  function drawCur(c, w, x, y, r, t, alpha, boost) {
    if (alpha <= 0.003) return;
    paintCur(w, t, false, boost);
    const s = sizeOf(r);
    c.save();
    c.imageSmoothingQuality = "high";
    c.globalAlpha = alpha;
    c.drawImage(w.paint, x - s / 2, y - s / 2, s, s);
    c.restore();
  }
  // A TRAVELLER (2026-11-08): a body on its way between a sphere and the
  // middle — its lobes melting from the one's into the other's as it goes,
  // painted afresh 24 times a second, the aberration widest half way
  function mixLobes(A, B, g) {
    const out = [], ga = soft(g);
    for (const o of A) { const r = o.r * Math.pow(1 - ga, 1.3); if (r > 0.015) out.push({ x: o.x * (1 - 0.3 * ga), y: o.y * (1 - 0.3 * ga), r, sides: o.sides, rot: o.rot }); }
    for (const o of B) { const r = o.r * Math.sqrt(ga); if (r > 0.015) out.push({ x: o.x * ga, y: o.y * ga, r, sides: o.sides, rot: o.rot }); }
    return out.length ? out : [{ x: 0, y: 0, r: 0.5 }];
  }
  function drawTraveller(c, tr, g, t, alpha) {
    if (alpha <= 0.003) return;
    if (!tr.paint) { tr.paint = document.createElement("canvas"); tr.tick = -1; }
    const e = ease(g);
    const x = lerp(tr.x0, tr.x1, e), y = lerp(tr.y0, tr.y1, e), r = lerp(tr.r0, tr.r1, e);
    const tick = STILL ? 0 : Math.floor(t * 24);
    if (tick !== tr.tick) {
      tr.tick = tick;
      if (tr.liveTo) driftLobes(tr.to, t);
      if (tr.liveFrom) driftLobes(tr.from, t);
      const lb = mixLobes(tr.from, tr.to, g);
      const spike = 1 + 1.7 * Math.sin(Math.PI * clamp(g, 0, 1));
      const n = clamp(Math.round(sizeOf(r) * DPR * 0.36), 56, phone ? 132 : 176);
      paintAny(tr.paint, n, lb, lerp(tr.sh0, tr.sh1, g) * spike, lerp(tr.so0, tr.so1, g) + (spike - 1) * 0.15, lerp(0.9, 0.45, g), tr.kind);
    }
    const s = sizeOf(r);
    c.save();
    c.imageSmoothingQuality = "high";
    c.globalAlpha = alpha;
    c.drawImage(tr.paint, x - s / 2, y - s / 2, s, s);
    c.restore();
  }

  // A HEXAGON THROUGH THE LENS: a line of ink each colour sees a little apart,
  // as the blobs are seen — dark where all three meet, a blue fringe above
  // and a gold one below — an outline and a fainter one turned inside it
  const HEX_FILL = ["#00ffff", "#ff00ff", "#ffff00"];
  function drawHexLens(c, x, y, r, alpha, t, lw, fill) {
    if (alpha <= 0.003 || r <= 0.5) return;
    const op = c.globalCompositeOperation;
    c.globalCompositeOperation = "multiply";
    const k = (phone ? 1 : 1.5) * (lw || 1), rot = -Math.PI / 2 + (STILL ? 0 : Math.sin(t * 0.35) * 0.04);
    c.lineJoin = "round";
    for (let ci = 0; ci < 3; ci++) {
      const ox = -LENS_AT[ci] * k * 0.8, oy = -LENS_AT[ci] * k;
      c.strokeStyle = c.fillStyle = HEX_FILL[ci];
      c.beginPath(); hexPath(c, x + ox, y + oy, r, rot);
      if (fill) { c.globalAlpha = alpha * fill * SW_INK[ci]; c.fill(); }
      c.globalAlpha = alpha * SW_INK[ci]; c.lineWidth = 1.1 * (lw || 1); c.stroke();
      c.globalAlpha = alpha * 0.5 * SW_INK[ci]; c.lineWidth = 0.8 * (lw || 1);
      // a second line: a smaller one turned inside it on a sphere; round the
      // list, a faint one just outside it, so nothing crosses the writing
      c.beginPath();
      if (r > 80) hexPath(c, x + ox, y + oy, r * 1.035, rot);
      else hexPath(c, x + ox, y + oy, r * 0.86, rot + Math.PI / 6);
      c.stroke();
    }
    c.globalCompositeOperation = op;
    c.globalAlpha = 1;
  }
  // the list in its middle: every perfume no source credits, by house
  function writeNf() {
    const p = cur.p, rows = p.list.slice().sort((a, b) => cmp(HOU[a.h].name, HOU[b.h].name) || cmp(a.n, b.n));
    el(".pw-nf-rows").innerHTML = rows.map((e, i) => '<tr style="--i:' + i + '"><td class="pw-nf-no">' + String(i + 1).padStart(2, "0") + '</td><td class="pw-nf-name">' + perfumeHtml(e) + '</td><td class="pw-nf-house">' + esc(HOU[e.h].name) + '</td><td class="pw-nf-year">' + (e.y || "—") + "</td></tr>").join("");
    el("[data-v=nf-n]").textContent = rows.length + (rows.length === 1 ? " perfume" : " perfumes");
    placeNf();
  }
  function placeNf() {
    const box = el(".pw-nf");
    if (!box) return;
    box.style.left = Math.round(P.x) + "px"; box.style.top = Math.round(P.y) + "px";
    // a list as wide as the room lets it be, and no wider than reads well
    box.style.setProperty("--nf-w", Math.round(Math.min(phone ? W - 32 : 480, (F.x1 - F.x0) * 0.9)) + "px");
  }

  // ---- WHAT IS IN FOCUS, AND HOW IT CHANGES --------------------------------
  let view = "rays";                  // "rays" (the strings) or "world"
  // EVERY CHANGE ITS OWN (2026-11-08 — "please smooth out the animations and
  // make them page-specific"): one transition at a time, and each of the
  // three made for what it joins —
  //   "open"   the strings into a world: the block's strings snap taut and
  //            reel its dots in to the point while the rest fall slack and
  //            come apart into red, green and blue; then three discs, one a
  //            colour, open out of the point a little apart, the world whole
  //            only inside all three, its blob settling out of a wide
  //            aberration ("make the animation better, make it revolve
  //            around chromatic abberation")
  //   "change" a world into another: the sphere pressed travels in and
  //            unfolds into the middle's blob, the middle folds into a sphere
  //            and goes to its place round it, the aberration widest half way
  //   "close"  a world back to the strings: the three discs close on the
  //            point, the world coming apart into its colours, and the
  //            strings fall from taut to slack with a bounce
  const TR = { kind: null, t0: 0, ms: 0, from: null, chosen: null, cameFrom: null, litT: 0 };
  const OPEN_MS = 2100, DISC_FROM = 0.2, CLOSE_MS = 1450, CHANGE_MS = 1300, SLIDE_MS = 1150;
  let lastPer = null;                 // the perfumer last in the middle, for ‹ ›
  function busy() { return TR.kind !== null; }
  function openWorld(w, quick) {
    if (busy()) return;
    layLater();
    showTip(null); overBlock = null;
    cur = w; if (w.kind === "per") lastPer = w.p;
    stick = null; aim = null;
    layWorld(); writeHud(); writeList();
    if (STILL || quick) { view = "world"; setBody(); kick(); return; }
    // what gathers: the perfumer's own dots, or every dot of a house
    TR.chosen = new Set(map.dots.filter((d) => (w.kind === "per" ? d.p === w.p : d.h === w.ho.i)));
    TR.kind = "open"; TR.t0 = performance.now(); TR.ms = OPEN_MS;
    document.body.classList.add("is-revealing");
    kick();
  }
  function opened() {
    TR.kind = null; TR.chosen = null;
    view = "world";
    document.body.classList.remove("is-revealing");
    document.body.style.removeProperty("--reveal");
    setBody();
  }
  // `dir` (‹ ›, and the list of every perfumer): the world slides — the one
  // pressed comes in from that side, the one before goes out the other, its
  // spheres with it (2026-11-10 — "animate it better when you change the
  // settings using the functions shown in image 1")
  function change(next, dir) {
    if (busy() || !cur || same(cur, next)) return;
    if (view !== "world") { openWorld(next); return; }
    pinned = null; showTip(null);
    const was = cur, wasBlobs = blobs, wasNf = isNf(was), toNf = isNf(next);
    const hit = dir ? null : wasBlobs.find((b) => same(b, next));
    cur = next; if (next.kind === "per") lastPer = next.p;
    stick = null; aim = null; lightRow();
    layWorld();
    const back = dir ? null : blobs.find((b) => same(b, was));
    if (STILL) { writeHud(); writeList(); kick(); return; }
    const side = (F.x1 - F.x0) * 0.5 + P.r * 0.4;
    TR.slide = dir || 0;
    TR.inT = TR.outT = null;
    // the one pressed comes in: from its sphere, or from the side it slides in from
    const x0 = hit ? hit.x + hit.dx : P.x + (dir || 0) * side, y0 = hit ? hit.y + hit.dy : P.y;
    // (into the perfumes no source credits, nothing travels: their list
    // comes in where the blob was)
    if (!toNf) {
      const shIn = hit ? SPH(hit.focus) : SPH(0.6);
      TR.inT = { kind: next.kind, from: hit && !hit.nf ? hit.lobes : sphereLobes(next.kind, hash(keyOf(next))), to: cur.lobes, liveTo: true,
        x0, y0, r0: hit ? hit.r : P.r * (dir ? 0.42 : 0.3), x1: P.x, y1: P.y, r1: P.r,
        sh0: shIn.shift, sh1: 0.05, so0: shIn.soft, so1: 0.95 };
    }
    // the middle goes out: to its place round the new one, or off the other side
    const x1 = back ? back.x : P.x - (dir || 0) * side, y1 = back ? back.y : P.y;
    if (!wasNf) {
      const shOut = back ? SPH(back.focus) : SPH(0.5);
      TR.outT = { kind: was.kind, from: was.lobes, to: back && !back.nf ? back.lobes : [{ x: 0, y: 0, r: 0.3 }], liveFrom: true,
        x0: P.x, y0: P.y, r0: P.r, x1, y1, r1: back ? back.r : P.r * (dir ? 0.4 : 0.2),
        sh0: 0.05, sh1: shOut.shift, so0: 0.95, so1: shOut.soft, gone: !back };
    }
    TR.back = back || null;
    TR.old = wasBlobs.filter((b) => b !== hit);
    // the sphere the middle becomes is painted first, so it is there when it lands
    if (back) paintSphere(back);
    TR.kind = "change"; TR.t0 = performance.now(); TR.ms = dir ? SLIDE_MS : CHANGE_MS;
    writeHud(); writeList();
    kick();
  }
  function changed() { TR.kind = null; TR.inT = TR.outT = TR.back = null; TR.old = null; TR.slide = 0; if (cur) cur.paint = null; }
  // RETURN, always to the strings (2026-11-08 — "make the return button just
  // go back to the black nodes page"); Esc the same — and since 2026-11-10
  // ("i want the top left return button to always point you to the nodes
  // page, the black and white one") from anywhere, whatever is going on: a
  // world opening closes back from where its discs have got to, a change
  // between two worlds is finished at once and closed
  function returnUp() {
    pinned = null; showTip(null);
    if (TR.kind === "close" || (view !== "world" && TR.kind !== "open")) return;
    closeMore(true);
    let vs0 = [1, 1, 1], reveal0 = 1;
    if (TR.kind === "open") {
      vs0 = openDiscs(clamp((performance.now() - TR.t0) / TR.ms, 0, 1));
      reveal0 = +(document.body.style.getPropertyValue("--reveal") || 0);
      TR.chosen = null;
    } else if (TR.kind === "change") changed();
    TR.kind = null;
    if (STILL || Math.max(...vs0) <= 0) { view = "rays"; document.body.classList.remove("is-revealing"); document.body.style.removeProperty("--reveal"); setBody(); kick(); return; }
    // the strings come back taut and fall slack as the world closes
    for (const s of map.strings) restString(s, TAUT);
    TR.cameFrom = cur && cur.kind === "per" ? map.blocks.find((b) => b.p === cur.p) : null;
    TR.vs0 = vs0; TR.reveal0 = reveal0;
    TR.kind = "close"; TR.t0 = performance.now(); TR.ms = CLOSE_MS * Math.max(0.4, Math.max(...vs0));
    view = "world";
    document.body.classList.add("is-revealing");
    kick();
  }
  function closed() {
    TR.kind = null; view = "rays";
    TR.litT = performance.now();
    document.body.classList.remove("is-revealing");
    document.body.style.removeProperty("--reveal");
    setBody();
  }
  function setBody() {
    if (view !== "world") closeMore(true);
    document.body.classList.toggle("is-rays", view === "rays");
    document.body.classList.toggle("is-world", view === "world");
    // the black of the strings is dark under the site's cursor and Menu
    document.body.classList.toggle("dark-surface", view === "rays");
    el(".pw-return").hidden = view !== "world";
    el(".pw-more-open").hidden = view !== "world" || isNf(cur);
  }
  // LEARN MORE (2026-11-07; and since 2026-11-08 — "below the blobs, i want
  // you to remove that paragraph, and then move it to the bottom of the
  // scrolled page ... make the button say 'Learn More about ________'"): the
  // paragraph that stood under the blob is the sheet's opening now, under the
  // poster, and the page scrolls down to it — a perfumer's biography and its
  // three sources after it, or a house's perfumers and what each made for it
  const more = el(".pw-more"), moreBtn = el(".pw-more-open");
  function writeMore(w) {
    const say = moreBtn.querySelector("[data-v=more-who]");
    say.textContent = nameOf(w);
    more.dataset.who = keyOf(w);
    const set = (s, v) => { const e = el(s); if (e) e.textContent = v; };
    const lead = el(".pw-more-lead"), text = el(".pw-more-text"), src = el(".pw-more-sources"), srcHead = el(".pw-more-src-head");
    const made = el(".pw-more-made");
    if (w.kind === "per") {
      const p = w.p;
      set("[data-v=more-kicker]", p.none ? "About these perfumes" : "About the perfumer");
      set("[data-v=more-name]", perName(p));
      set("[data-v=more-sub]", [p.from, p.born ? "born " + p.born : "", p.houses.size + (p.houses.size === 1 ? " house" : " houses")].filter(Boolean).join(" · "));
      const lines = p.about && p.about.length ? p.about : [p.none ? "The perfumes no source found credits to anyone." : p.name + "."];
      lead.innerHTML = lines.map((l) => "<p>" + esc(l) + "</p>").join("");
      text.innerHTML = p.bio ? '<h3 class="pw-more-h">Biography</h3>' + p.bio.t.map((t) => "<p>" + esc(t) + "</p>").join("") : "";
      made.innerHTML = madeHtml(Array.from(p.houses.entries()).map(([h, l]) => [HOU[h].name, l]), p.none ? "By house" : "Their perfumes, by house");
      // the biography's three sources, and then the ledger's for their perfumes
      const seen = new Set(), li = [];
      if (p.bio) p.bio.s.forEach(([c, u]) => { seen.add(u); li.push("<li>" + esc(c).replace(/\*(.+?)\*/g, "<cite>$1</cite>") + " " + linkOf(u) + "</li>"); });
      sourcesOf(p.list).forEach((id) => { const x = D.src.get(id); if (x && !seen.has(x.url)) { seen.add(x.url); li.push("<li>" + citeOf(x) + "</li>"); } });
      src.innerHTML = li.join("");
    } else {
      const ho = w.ho;
      set("[data-v=more-kicker]", "About the house");
      set("[data-v=more-name]", ho.name);
      set("[data-v=more-sub]", [ho.from, ho.founded ? "founded " + ho.founded : "", ho.list.length + (ho.list.length === 1 ? " perfume" : " perfumes")].filter(Boolean).join(" · "));
      lead.innerHTML = "<p>" + esc(ho.about || ho.name + ".") + "</p>";
      text.innerHTML = ho.page ? '<p class="pw-more-page"><a href="' + esc(ROOT + ho.page) + '">Read about ' + esc(ho.name) + " on the site →</a></p>" : "";
      made.innerHTML = madeHtml(partsOf(w).map((x) => [perName(PER[x.q]), ho.pers.get(x.q)]), "What was made for it");
      src.innerHTML = sourcesOf(ho.list, ho.s).map((id) => D.src.get(id)).filter(Boolean).map((x) => "<li>" + citeOf(x) + "</li>").join("");
    }
    srcHead.hidden = !src.innerHTML;
  }
  // a source of the ledger, in MLA 8, with its address; a page of the site's own linked in the site
  function linkOf(u) {
    const site = u.startsWith("SITE:"), href = site ? ROOT + u.slice(5) : u;
    return '<a href="' + esc(href) + '"' + (site ? "" : ' target="_blank" rel="noopener"') + ">" + esc(site ? "thetasteofaldehydes.com/" + u.slice(5) : u.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a>";
  }
  const citeOf = (x) => esc(x.cite).replace(/\*(.+?)\*/g, "<cite>$1</cite>") + " " + linkOf(x.url);
  function sourcesOf(list, more) {
    const ids = [];
    (more || []).concat(...list.map((e) => e.s)).forEach((id) => { if (!ids.includes(id)) ids.push(id); });
    return ids.sort((a, b) => +a.slice(1) - +b.slice(1));
  }
  const perfumeHtml = (e) => (e.at ? '<a href="' + esc(ROOT + e.at) + '">' + esc(e.n) + "</a>" : esc(e.n));
  function madeHtml(groups, head) {
    return '<h3 class="pw-more-h">' + esc(head) + "</h3>" + groups.map(([who, l]) =>
      '<div class="pw-more-group"><p class="pw-more-who">' + esc(who) + " <span>" + l.length + "</span></p><ul>" +
      l.slice().sort((a, b) => (a.y || 9999) - (b.y || 9999) || cmp(a.n, b.n)).map((e) => "<li>" + perfumeHtml(e) + "<span>" + (e.y || "—") + "</span></li>").join("") + "</ul></div>").join("");
  }
  // THE GLIDE to it and back (2026-11-10 — "i want that to scroll smoother,
  // slightly slower, and all the way up, rather than almost all the way up"):
  // the page carried on a curve at rest at both ends, the sheet's top to the
  // window's top, over a second and a third; back up the same way. A wheel
  // or a finger takes the page back at once.
  let glide = 0;
  function glideTo(top, ms, done) {
    cancelAnimationFrame(glide);
    const y0 = window.scrollY, t0 = performance.now();
    if (STILL || Math.abs(top - y0) < 2) { window.scrollTo(0, top); if (done) done(); return; }
    const go = (now) => {
      const u = clamp((now - t0) / ms, 0, 1);
      window.scrollTo(0, Math.round(y0 + (top - y0) * soft(u)));
      if (u < 1) glide = requestAnimationFrame(go); else { glide = 0; if (done) done(); }
    };
    glide = requestAnimationFrame(go);
  }
  ["wheel", "touchstart"].forEach((e) => window.addEventListener(e, () => { if (glide) { cancelAnimationFrame(glide); glide = 0; } }, { passive: true }));
  function openMore() {
    if (!cur) return;
    more.hidden = false;
    document.body.classList.add("is-more");
    moreBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => glideTo(Math.round(more.getBoundingClientRect().top + window.scrollY), 1350));
  }
  function closeMore(now) {
    moreBtn.setAttribute("aria-expanded", "false");
    if (more.hidden) return;
    const done = () => { more.hidden = true; document.body.classList.remove("is-more"); };
    if (now || STILL || window.scrollY < 2) { cancelAnimationFrame(glide); glide = 0; window.scrollTo(0, 0); done(); return; }
    glideTo(0, 1200, done);
  }
  moreBtn.addEventListener("click", () => (more.hidden ? openMore() : closeMore()));
  el(".pw-more-close").addEventListener("click", () => closeMore());
  // THE READINGS, as few as the owner's pictures keep — and fewer since
  // 2026-11-08 ("remove the 'the most ___'"; "under the houses on the left,
  // you should ommit the informatio of the houses"): a perfumer's kicker,
  // name, country, perfumes and houses; a house's kicker, name, country and
  // founding, perfumes and perfumers
  function writeHud() {
    const set = (s, v) => { const e = el(s); if (e) e.textContent = v; };
    const house = cur.kind === "house";
    set("[data-v=kicker]", house ? "House" : cur.p.none ? "Not credited" : "Perfumer");
    set("[data-v=name]", nameOf(cur));
    if (house) set("[data-v=sub]", [cur.ho.from, cur.ho.founded ? "founded " + cur.ho.founded : ""].filter(Boolean).join(" · ") || "country not given");
    else set("[data-v=sub]", cur.p.from || (cur.p.none ? "no source names who made them" : "country not given"));
    set("[data-v=count]", String(listOf(cur).length));
    set("[data-v=houses-say]", house ? "Perfumers" : "Houses");
    set("[data-v=houses]", String(house ? Array.from(cur.ho.pers.keys()).filter((q) => !PER[q].none).length : cur.p.houses.size));
    writeMore(cur);
    if (!STILL) [".pw-hud", ".pw-list"].forEach((s) => { const e = el(s); e.classList.remove("is-fresh"); void e.offsetWidth; e.classList.add("is-fresh"); });
    const p = lastPer || ORDER[0];
    set("[data-v=no]", String(p.k + 1).padStart(2, "0") + " / " + NP);
    const pick = el(".pw-pick");
    if (+pick.value !== p.i) pick.value = String(p.i);
    // the page's official names (2026-11-08): the World of whoever is in it
    set(".pw-head-name", isNf(cur) ? "Perfumers not found" : "The World of " + nameOf(cur));
    el(".pw-more-open").hidden = view !== "world" || isNf(cur);
    el(".pw-hud").setAttribute("aria-label", (house ? "The house " : "The perfumer ") + nameOf(cur));
  }

  // ---- THE LIST, beside the world: a perfumer's houses, or a house's
  // perfumers — names only, and what they made between them ------------------
  const listBox = el(".pw-list");
  let listRows = [];
  function writeList() {
    if (!cur) return;
    const house = cur.kind === "house";
    listRows = partsOf(cur).map((x) => (house ? { kind: "per", p: PER[x.q], n: x.n } : { kind: "house", ho: HOS[x.h], n: x.n }));
    el(".pw-list-rows").innerHTML = listRows.map((r, i) => '<li><button type="button" data-row="' + i + '"><span class="pw-li-no">' + String(i + 1).padStart(2, "0") + '</span><span class="pw-li-name">' + esc(nameOf(r)) + '</span><span class="pw-li-n">' + r.n + "</span></button></li>").join("");
    el("[data-v=list-say]").textContent = house ? "Its perfumers" : "Its houses";
    // a house's perfumers counted as its readings count them: "Perfumer not
    // found" is a row of its own, and no perfumer
    const n = house ? listRows.filter((r) => !r.p.none).length : listRows.length;
    el("[data-v=list-n]").textContent = n + (house ? (n === 1 ? " perfumer" : " perfumers") : (n === 1 ? " house" : " houses"));
    el("[data-v=list-how]").textContent = house ? "press one to open their world" : "press one to open its world";
    el(".pw-list-rows").scrollTop = 0;
  }
  function rowOf(ev) { const b = ev.target.closest && ev.target.closest("[data-row]"); return b ? { b, r: listRows[+b.dataset.row] } : null; }
  const sphereOf = (r) => blobs.find((x) => same(x, r)) || null;
  listBox.addEventListener("pointerover", (ev) => {
    const o = rowOf(ev);
    if (!o || !ready || busy()) return;
    aim = sphereOf(o.r); if (aim) stick = aim;
    lightRow(); kick();
  });
  listBox.addEventListener("pointerleave", () => { aim = null; kick(); });
  listBox.addEventListener("click", (ev) => {
    const o = rowOf(ev);
    if (!o) return;
    aim = null; showTip(null);
    change(o.r.kind === "per" ? { kind: "per", p: o.r.p } : { kind: "house", ho: o.r.ho });
  });
  listBox.addEventListener("focusin", (ev) => { const o = rowOf(ev); if (o) { aim = sphereOf(o.r); if (aim) stick = aim; lightRow(); kick(); } });

  // ---- THE HAND --------------------------------------------------------------
  const hand = { x: -1, y: -1, on: false, lx: -1, ly: -1, lt: 0 };
  // where the spheres lean to: the hand, followed a little behind
  const handS = { x: 0, y: 0 };
  // `aim` the sphere under the hand now; `stick` the last one it was on — the
  // swarm stays round it until the hand is on another (2026-11-08 — "make it
  // also stay there, unless you hover over another blob")
  let aim = null, stick = null, pinned = null, overBlock = null;
  function blobUnder(x, y) {
    for (let i = blobs.length - 1; i >= 0; i--) { const b = blobs[i]; if (b.img && Math.hypot(x - (b.x + b.dx), y - (b.y + b.dy)) < b.r * 1.15) return b; }
    return null;
  }
  // a block of the strings: its dots, or anywhere in its box
  function blockUnder(x, y) {
    for (const b of map.blocks) if (b.hex && Math.hypot(x - b.hx, y - b.hy) < b.hr * 1.6) return b;
    let best = null, bd = Math.max(9, map.cell * 0.8);
    for (const d of map.dots) { const dd = Math.hypot(x - d.x, y - d.y); if (dd < bd) { bd = dd; best = d.b; } }
    if (best) return best;
    for (const b of map.blocks) if (x >= b.x0 - 4 && x <= b.x1 + 4 && y >= b.y0 - 4 && y <= b.y1 + 4) return b;
    return null;
  }
  function placeTip(x, y) {
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let px = x + 14, py = y + 14;
    if (px + tw > W - 10) px = x - tw - 14;
    if (py + th > H - 10) py = y - th - 14;
    tip.style.transform = "translate(" + Math.round(Math.max(8, px)) + "px," + Math.round(Math.max(8, py)) + "px)";
  }
  function showTip(h) {
    if (!h) { tip.hidden = true; return; }
    tip.innerHTML = h.html;
    tip.hidden = false;
    placeTip(h.x, h.y);
  }
  // what a block says (2026-11-08 — "just show the perfumer's name, and
  // number of houses")
  const blockTip = (b) => b.hex
    ? "<b>Perfumers not found</b><span>" + b.p.list.length + (b.p.list.length === 1 ? " perfume" : " perfumes") + " no source credits to anyone</span>"
    : "<b>" + esc(perName(b.p)) + "</b><span>" + b.p.houses.size + (b.p.houses.size === 1 ? " house" : " houses") + "</span>";
  const sphereTip = (b) => "<b>" + esc(nameOf(b)) + "</b><span>" + (b.kind === "house" ? "House · press to open its world" : "Perfumer · press to open their world") + "</span>";
  // the hand pulled across a string plucks it where it crossed it
  function pluck(x0, y0, x1, y1, now) {
    const sp = Math.hypot(x1 - x0, y1 - y0), dt = Math.max(0.008, (now - hand.lt) / 1000);
    if (sp < 1.5 || sp > 400) return;
    for (const s of map.strings) {
      if (now - s.plucked < 140) continue;
      const p = s.pts;
      for (let i = 0; i < SEG; i++) {
        const ax = p[2 * i], ay = p[2 * i + 1], bx = p[2 * i + 2], by = p[2 * i + 3];
        const d1 = (x1 - x0) * (ay - y0) - (y1 - y0) * (ax - x0), d2 = (x1 - x0) * (by - y0) - (y1 - y0) * (bx - x0);
        if (d1 * d2 >= 0) continue;
        const d3 = (bx - ax) * (y0 - ay) - (by - ay) * (x0 - ax), d4 = (bx - ax) * (y1 - ay) - (by - ay) * (x1 - ax);
        if (d3 * d4 >= 0) continue;
        // where along it, and how fast the hand was going across it
        const f = d1 / (d1 - d2);
        const v = ((x1 - x0) * s.nx + (y1 - y0) * s.ny) / dt;
        pluckString(s, (i + f) / SEG, v);
        s.plucked = now;
        break;
      }
    }
  }
  window.addEventListener("pointermove", (ev) => { hand.x = ev.clientX; hand.y = ev.clientY; hand.on = true; }, { passive: true });
  document.addEventListener("pointerout", (ev) => { if (!ev.relatedTarget) { hand.on = false; kick(); } });
  cv.addEventListener("pointermove", (ev) => {
    const now = performance.now();
    const x = ev.clientX, y = ev.clientY;
    if (view === "rays" && ready && !busy() && hand.lx >= 0 && now - hand.lt < 120) pluck(hand.lx, hand.ly, x, y, now);
    hand.lx = x; hand.ly = y; hand.lt = now;
    hand.x = x; hand.y = y; hand.on = true;
    // nothing answers the hand until the page has come in whole
    if (busy() || !ready) { cv.style.cursor = "default"; return; }
    if (view === "rays") {
      const b = blockUnder(x, y);
      if (b !== overBlock) {
        // (its strings snap taut of themselves: pullOf)
        overBlock = b;
        showTip(b ? { html: blockTip(b), x, y } : null);
        kick();
      } else if (b) placeTip(x, y);
      cv.style.cursor = b ? "pointer" : "default";
      return;
    }
    const was = aim;
    aim = blobUnder(x, y);
    if (aim) stick = aim;
    cv.style.cursor = aim ? "pointer" : "default";
    if (aim !== was) lightRow();
    if (!pinned) {
      if (aim) showTip({ html: sphereTip(aim), x, y });
      else if (was) showTip(null);
    }
  });
  function lightRow() {
    const lit = aim || stick;
    listBox.querySelectorAll("[data-row]").forEach((b) => {
      const r = listRows[+b.dataset.row];
      b.classList.toggle("is-lit", !!(lit && r && same(r, lit)));
    });
  }
  cv.addEventListener("pointerleave", () => {
    aim = null; overBlock = null; lightRow();
    if (!pinned) showTip(null);
    kick();
  });
  cv.addEventListener("click", (ev) => {
    if (busy() || !ready) return;
    if (view === "rays") {
      const b = blockUnder(ev.clientX, ev.clientY);
      if (b) openWorld({ kind: "per", p: b.p });
      return;
    }
    const b = blobUnder(ev.clientX, ev.clientY);
    if (b) { aim = null; change(b.kind === "per" ? { kind: "per", p: b.p } : { kind: "house", ho: b.ho }); }
  });
  el(".pw-return").addEventListener("click", returnUp);
  const step = (d) => {
    if (!ready || busy()) return;
    const p = lastPer || ORDER[NP - 1];
    const q = ORDER[(p.k + d + NP) % NP];
    if (view === "rays") openWorld({ kind: "per", p: q });
    else change({ kind: "per", p: q }, d > 0 ? 1 : -1);
  };
  el(".pw-prev").addEventListener("click", () => step(-1));
  el(".pw-next").addEventListener("click", () => step(1));
  document.addEventListener("keydown", (ev) => {
    if (ev.target && ev.target.matches && ev.target.matches("select, input")) return;
    // (the site's Menu takes its own Escape)
    if (document.body.classList.contains("menu-open")) return;
    if (ev.key === "Escape") { ev.preventDefault(); returnUp(); }
    else if (view === "world" && ev.key === "ArrowRight") { ev.preventDefault(); step(1); }
    else if (view === "world" && ev.key === "ArrowLeft") { ev.preventDefault(); step(-1); }
  });
  const pick = el(".pw-pick");
  pick.innerHTML = ORDER.map((p) => '<option value="' + p.i + '">' + esc(perName(p)) + "</option>").join("");
  pick.addEventListener("change", () => {
    const p = PER[+pick.value];
    if (view === "rays") openWorld({ kind: "per", p });
    else change({ kind: "per", p }, p.k >= (lastPer || ORDER[0]).k ? 1 : -1);
  });
  // ---- THE SEARCH (2026-11-07): one field at the top right, on the strings
  // and in the worlds; a perfumer, a house or a perfume, found as it is
  // typed, each answer saying which. Pressed (or Enter): a perfumer's world,
  // or — since 2026-11-08, when a house has a world of its own — a house's;
  // a perfume opens its perfumer's, its house lit there.
  const findBox = el(".pw-find"), findIn = el(".pw-find input"), findOut = el(".pw-found");
  const plainOf = (t) => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const FIND = [];
  ORDER.forEach((p) => FIND.push({ kind: "Perfumer", name: perName(p), say: [p.from, p.houses.size + (p.houses.size === 1 ? " house" : " houses")].filter(Boolean).join(" · "), w: { kind: "per", p } }));
  HOS.slice().sort((a, b) => cmp(a.name, b.name)).forEach((ho) => FIND.push({ kind: "House", name: ho.name, say: [ho.from, ho.list.length + (ho.list.length === 1 ? " perfume" : " perfumes")].filter(Boolean).join(" · "), w: { kind: "house", ho } }));
  ORDER.forEach((p) => p.list.forEach((e) => FIND.push({ kind: "Perfume", name: e.n, say: HOU[e.h].name + " · by " + perName(p) + (e.y ? " · " + e.y : ""), w: { kind: "per", p }, h: e.h, e })));
  FIND.forEach((it) => (it.key = plainOf(it.name)));
  const KINDS = ["Perfumer", "House", "Perfume"];
  let found = [], foundAt = -1;
  function findNow() {
    const q = plainOf(findIn.value.trim());
    if (!q) { findOut.hidden = true; findBox.classList.remove("has-found"); found = []; return; }
    const scoreOf = (k) => (k.startsWith(q) ? 3 : k.split(/[^a-z0-9]+/).some((w) => w.startsWith(q)) ? 2.5 : k.indexOf(q) >= 0 ? 2 : 0);
    found = FIND.map((it) => ({ it, s: scoreOf(it.key) })).filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || KINDS.indexOf(a.it.kind) - KINDS.indexOf(b.it.kind) || cmp(a.it.name, b.it.name))
      .slice(0, 8).map((x) => x.it);
    foundAt = found.length ? 0 : -1;
    findOut.innerHTML = found.length
      ? found.map((it, i) => '<li style="--i:' + i + '"><button type="button" data-f="' + i + '"' + (i === 0 ? ' class="is-at"' : "") + "><b>" + it.kind + "</b><span>" + esc(it.name) + "</span><small>" + esc(it.say) + "</small></button></li>").join("")
      : '<li class="pw-found-none">Nothing by that name on the chart.</li>';
    findOut.hidden = false;
    findBox.classList.add("has-found");
  }
  function findAt(i) {
    if (!found.length) return;
    foundAt = (i + found.length) % found.length;
    findOut.querySelectorAll("button").forEach((b, k) => b.classList.toggle("is-at", k === foundAt));
  }
  function findGo(it) {
    findIn.value = ""; findOut.hidden = true; findBox.classList.remove("has-found"); found = [];
    findIn.blur();
    if (busy()) return;
    let wait = 0;
    if (view === "rays") { openWorld(it.w); wait = STILL ? 0 : OPEN_MS + 150; }
    else if (!same(cur, it.w)) { change(it.w); wait = STILL ? 0 : CHANGE_MS + 100; }
    if (it.h == null) return;
    // a perfume's house lit once the world has come: its sphere, its row, and
    // the perfume by the row
    setTimeout(() => {
      if (view !== "world" || !cur || !same(cur, it.w)) return;
      const ho = { kind: "house", ho: HOS[it.h] };
      const b = blobs.find((x) => same(x, ho));
      if (b) { stick = b; lightRow(); }
      const k = listRows.findIndex((r) => same(r, ho));
      const row = listBox.querySelector('[data-row="' + k + '"]');
      if (row) {
        row.classList.add("is-found");
        if (it.e) { pinned = ho; tipBeside(row, perfumeTip(it.e)); }
        setTimeout(() => { row.classList.remove("is-found"); kick(); }, 3200);
      }
      kick();
    }, wait);
  }
  function perfumeTip(e) {
    const who = e.who.map((q) => perName(PER[q])).join(" & ");
    return "<b>" + esc(e.n) + "</b><span>" + esc(HOU[e.h].name) + " · " + (e.y || "year not found") + "</span><em>" + esc(who) + " — " + CREDIT[e.c] + "</em>";
  }
  function tipBeside(b, html) {
    tip.innerHTML = html;
    tip.hidden = false;
    const rc = b.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let px, py;
    if (phone) { px = clamp(rc.left + 8, 8, W - tw - 8); py = rc.top - th - 6; if (py < 8) py = rc.bottom + 6; }
    else { px = rc.left - tw - 14; py = clamp(rc.top - 6, 8, H - th - 8); if (px < 8) px = rc.right + 14; }
    tip.style.transform = "translate(" + Math.round(px) + "px," + Math.round(py) + "px)";
  }
  // a pinned perfume's note goes with the next press anywhere
  document.addEventListener("pointerdown", (ev) => { if (pinned && !(ev.target.closest && ev.target.closest(".pw-find"))) { pinned = null; showTip(null); } });
  findIn.addEventListener("input", findNow);
  findIn.addEventListener("focus", () => { findBox.classList.add("is-open"); if (findIn.value) findNow(); });
  findIn.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== findIn) { findBox.classList.remove("is-open"); findOut.hidden = true; findBox.classList.remove("has-found"); } }, 160));
  findIn.addEventListener("keydown", (ev) => {
    ev.stopPropagation();
    if (ev.key === "ArrowDown") { ev.preventDefault(); findAt(foundAt + 1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); findAt(foundAt - 1); }
    else if (ev.key === "Enter") { ev.preventDefault(); if (found[foundAt]) findGo(found[foundAt]); }
    else if (ev.key === "Escape") { findIn.value = ""; findNow(); findIn.blur(); }
  });
  findOut.addEventListener("pointerdown", (ev) => ev.preventDefault());
  findOut.addEventListener("click", (ev) => { const b = ev.target.closest("[data-f]"); if (b) findGo(found[+b.dataset.f]); });
  el(".pw-find-mark").addEventListener("click", () => findIn.focus());
  // ---- DRAWING ------------------------------------------------------------
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    phone = W < 760;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    // the room the world has: between the readings on the left and the list
    // on the right, under the head and over Learn More; on a phone the top
    // of the window, over the list and the readings
    if (phone) {
      F.x0 = 10; F.x1 = W - 10; F.y0 = 92; F.y1 = Math.round(H * 0.45);
      P.r = Math.min((F.y1 - F.y0) * 0.34, W * 0.25);
    } else {
      const edge = W < 1100 ? 32 : 48;
      const hud = el(".pw-hud").getBoundingClientRect(), list = listBox.getBoundingClientRect();
      F.x0 = (hud.right > 0 ? hud.right : edge + 250) + 16;
      F.x1 = (list.left > 0 ? list.left : W - edge - 280) - 16;
      F.y0 = 112; F.y1 = H - (H < 640 ? 70 : 130);
      P.r = Math.min((F.y1 - F.y0) * 0.33, (F.x1 - F.x0) * 0.24);
    }
    P.x = (F.x0 + F.x1) / 2; P.y = (F.y0 + F.y1) / 2;
    // Learn More under the world, in the middle of its room
    const btn = el(".pw-more-open");
    if (!phone) btn.style.left = Math.round(P.x) + "px"; else btn.style.left = "";
    ground = null;
    layMap();
    if (cur) layWorld();
  }
  // the poster: pale, a light behind the world, its corners a little darker
  let ground = null;
  function drawGround() {
    const c = document.createElement("canvas");
    c.width = cv.width; c.height = cv.height;
    const x = c.getContext("2d");
    x.scale(DPR, DPR);
    let g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#e7eeea"); g.addColorStop(1, "#dce5e1");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const big = Math.max(W, H);
    g = x.createRadialGradient(P.x, P.y, P.r * 0.6, P.x, P.y, big * 0.8);
    g.addColorStop(0, "rgba(255,255,255,0.55)"); g.addColorStop(0.45, "rgba(255,255,255,0.12)"); g.addColorStop(1, "rgba(120,140,135,0.22)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    g = x.createRadialGradient(P.x - P.r * 0.2, P.y - P.r * 0.1, 0, P.x, P.y, P.r * 2.2);
    g.addColorStop(0, "rgba(200,190,240,0.22)"); g.addColorStop(1, "rgba(200,190,240,0)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    g = x.createRadialGradient(P.x + P.r * 0.5, P.y + P.r * 0.9, 0, P.x + P.r * 0.5, P.y + P.r * 0.9, P.r * 1.4);
    g.addColorStop(0, "rgba(255,226,170,0.16)"); g.addColorStop(1, "rgba(255,226,170,0)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    return c;
  }
  // READY (2026-11-07): nothing answers the hand until the strings are all
  // out and the type has come in; then the page says so (is-ready)
  let ready = STILL, fontsIn = !document.fonts;
  if (document.fonts) document.fonts.ready.then(() => { fontsIn = true; layMap(); kick(); });
  let lightNext = 0, mapT0 = -1;
  const RAYS_IN = 1800;
  const lights = [];
  // what the strings are doing this frame, worked out once and drawn as
  // often as the lens (or the opening's discs) needs
  const RS = { intro: 1, dim: 0, lens: 1.6, open: -1, close: -1, gone: 0 };
  // how hard each string is pulled this frame, as a multiple of its slack
  // tension: taut while its perfumer is pointed at — at once, and only then
  // (2026-11-10 — "only make it when hovered, not with a delay") — the
  // chosen pulled tauter still as they reel in, and the rest let slacker
  function pullOf(s) {
    if (TR.kind === "open") return TR.chosen.has(s.d) ? TAUT * 1.3 : 1 / 1.6;
    if (overBlock && overBlock === s.d.b && view === "rays" && !busy()) return TAUT;
    return 1;
  }
  function stepRays(now, t, dt) {
    RS.intro = STILL ? 1 : clamp((now - mapT0) / RAYS_IN, 0, 1);
    stepStrings(dt, now, t, pullOf);
    const f = 1 - Math.exp(-dt * 16);
    for (const b of map.blocks) {
      let g = overBlock === b && !busy() ? 1 : 0;
      // the perfumer the world closed on, lit a moment on the way back
      if (TR.cameFrom === b) g = Math.max(g, TR.kind === "close" ? 1 : 1 - clamp((now - TR.litT) / 1600, 0, 1));
      b.g += (g - b.g) * f;
    }
    RS.dim += ((overBlock && !busy() ? 1 : 0) - RS.dim) * f;
    RS.open = TR.kind === "open" ? clamp((now - TR.t0) / TR.ms, 0, 1) : -1;
    // the lens coming apart as the opening gathers, together as the strings come back
    RS.lens = (phone ? 1.1 : 1.6) * (RS.open >= 0 ? 1 + 2.8 * smooth(RS.open / DISC_FROM) : TR.kind === "close" ? 1 + 2.4 * (1 - smooth((now - TR.t0) / TR.ms)) : 1);
    // the lights running in, now and then
    if (!STILL && RS.intro >= 1 && !busy()) {
      if (t > lightNext && lights.length < 9) { lights.push({ s: map.strings[Math.floor(Math.random() * map.strings.length)], t0: t, dur: 1.5 + Math.random() * 1.3 }); lightNext = t + 0.25 + Math.random() * 0.45; }
    }
    for (let i = lights.length - 1; i >= 0; i--) if ((t - lights[i].t0) / lights[i].dur >= 1) lights.splice(i, 1);
  }
  // ONE COLOUR OF THE STRINGS (col its pure colour, c which of the three):
  // the strings, the dots, the point, the lights and what is reeling in
  function raysPass(x, col, t) {
    const { hub } = map, open = RS.open;
    const intro = RS.intro, gone = open >= 0 ? smooth(open / (DISC_FROM * 0.9)) : 0;
    x.strokeStyle = col; x.fillStyle = col;
    x.lineCap = "round";
    // every block's strings at its own strength: lit, dimmed, or falling away
    for (const b of map.blocks) {
      let a = (0.22 + 0.63 * b.g) * (1 - 0.6 * RS.dim * (1 - b.g));
      if (open >= 0) a = 0.22 * (1 - 0.8 * gone);
      if (a < 0.01) continue;
      x.globalAlpha = a; x.lineWidth = 0.65 + 0.45 * b.g;
      x.beginPath();
      for (const d of b.dots) {
        const s = d.s;
        if (open >= 0 && TR.chosen.has(d)) continue;     // drawn reeling in, below
        const u = intro >= 1 ? 1 : ease(clamp(intro * 1.6 - d.ph * 0.6, 0, 1));
        if (u <= 0) continue;
        tracePart(x, s, 1 - u, 1);
      }
      x.stroke();
      // its dots — or, for the perfumes no source credits, its hexagon
      const r = map.r * (1 + 0.5 * b.g);
      x.globalAlpha = (0.9 * (1 - 0.55 * RS.dim * (1 - b.g)) + 0.1 * b.g) * (open >= 0 ? 1 - 0.8 * (TR.chosen.has(b.dots[0]) ? 0 : gone) : 1) * (b.hex ? smooth(intro * 1.6 - 0.3) : 1);
      if (b.hex) { hexPass(x, b); continue; }
      x.beginPath();
      for (const d of b.dots) {
        if (open >= 0 && TR.chosen.has(d)) continue;
        if (intro >= 1 || intro * 1.6 - d.ph * 0.6 >= 1) { x.moveTo(d.x + r, d.y); x.arc(d.x, d.y, r, 0, TAU); }
      }
      x.fill();
    }
    // the chosen: their strings taut, their dots reeling in along them to the
    // point, each string shortening behind its dot
    if (open >= 0) {
      let arrived = 0, n = 0;
      x.lineWidth = 1.1;
      for (const d of TR.chosen) {
        n++;
        const q = ease(clamp(open / (DISC_FROM * 0.95) * 1.15 - d.ph * 0.15, 0, 1));
        if (q >= 1) { arrived++; continue; }
        x.globalAlpha = 0.9;
        x.beginPath(); tracePart(x, d.s, q, 1); x.stroke();
        const [px, py] = along(d.s, q);
        x.globalAlpha = 1;
        x.beginPath(); x.arc(px, py, map.r * 1.5, 0, TAU); x.fill();
      }
      const a = n ? arrived / n : 1;
      // the point swelling as they arrive
      x.globalAlpha = 0.95; x.lineWidth = 1.2;
      x.beginPath(); x.arc(hub.x, hub.y, 4 + 14 * ease(a), 0, TAU); x.stroke();
      x.globalAlpha = 0.35 * a;
      x.beginPath(); x.arc(hub.x, hub.y, 10 + 34 * ease(a), 0, TAU); x.stroke();
    }
    // the point they all go to
    const br = 3 + (STILL ? 0 : Math.sin(t * 1.6) * 0.8);
    x.lineWidth = 1; x.globalAlpha = 0.9 * smooth(intro * 3);
    x.beginPath(); x.arc(hub.x, hub.y, br, 0, TAU); x.stroke();
    x.globalAlpha = 0.3 * smooth(intro * 3);
    x.beginPath(); x.arc(hub.x, hub.y, br * 3.4, 0, TAU); x.stroke();
    // the lights running in along the strings
    if (lights.length) {
      x.lineWidth = 1.4;
      for (const L of lights) {
        const u = (t - L.t0) / L.dur, k = ease(clamp(u, 0, 1));
        x.globalAlpha = Math.sin(Math.PI * clamp(u, 0, 1)) * 0.85;
        x.beginPath(); tracePart(x, L.s, Math.max(0, k - 0.1), k); x.stroke();
      }
    }
    x.globalAlpha = 1; x.lineCap = "butt";
  }
  // the hexagon of the perfumes no source credits: an outline, a fainter one
  // inside it, a faint fill, turning a breath and swelling as it is lit
  function hexPath(x, cx, cy, r, rot) {
    x.moveTo(cx + Math.cos(rot) * r, cy + Math.sin(rot) * r);
    for (let k = 1; k <= 6; k++) { const a = rot + (k * TAU) / 6; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); }
    x.closePath();
  }
  function hexPass(x, b) {
    const a = x.globalAlpha, r = b.hr * (1 + 0.18 * b.g), rot = -Math.PI / 2 + (STILL ? 0 : Math.sin(clock * 0.4) * 0.05);
    x.lineWidth = 1 + 0.5 * b.g;
    x.beginPath(); hexPath(x, b.hx, b.hy, r, rot); x.stroke();
    x.globalAlpha = a * (0.1 + 0.18 * b.g); x.fill();
    x.globalAlpha = a * 0.45; x.lineWidth = 0.7;
    x.beginPath(); hexPath(x, b.hx, b.hy, r * 0.58, rot + Math.PI / 6); x.stroke();
    x.globalAlpha = a;
  }
  // the names over the blocks, and round the one pointed at, its corners
  function raysWords(x, col) {
    x.font = "400 " + (phone ? 8.5 : 9.5) + 'px "IBM Plex Mono", ui-monospace, monospace';
    x.textBaseline = "alphabetic";
    x.fillStyle = col; x.strokeStyle = col;
    const open = RS.open, gone = open >= 0 ? smooth(open / (DISC_FROM * 0.7)) : 0;
    const come = smooth((RS.intro - 0.55) / 0.45);
    for (const b of map.blocks) {
      const a = (0.42 + 0.58 * b.g) * (1 - 0.55 * RS.dim * (1 - b.g)) * come * (1 - gone);
      if (a < 0.01) continue;
      x.globalAlpha = a;
      x.textAlign = b.hex ? "center" : b.side === 0 ? "left" : "right";
      x.fillText(b.label, b.hex ? b.hx : b.side === 0 ? b.lx0 : b.lx1, b.ly);
      // the block lit whole (2026-11-08 — "the entire block and all the dots
      // get highlighted"): a registration bracket at each of its corners
      if (b.g > 0.02) {
        const m = 7 + 3 * (1 - b.g), x0 = b.x0 - m, x1 = b.x1 + m, y0 = b.y0 - m, y1 = b.y1 + m, l = 6;
        x.globalAlpha = 0.85 * b.g * (1 - gone); x.lineWidth = 1;
        x.beginPath();
        x.moveTo(x0, y0 + l); x.lineTo(x0, y0); x.lineTo(x0 + l, y0);
        x.moveTo(x1 - l, y0); x.lineTo(x1, y0); x.lineTo(x1, y0 + l);
        x.moveTo(x1, y1 - l); x.lineTo(x1, y1); x.lineTo(x1 - l, y1);
        x.moveTo(x0 + l, y1); x.lineTo(x0, y1); x.lineTo(x0, y1 - l);
        x.stroke();
      }
    }
    x.globalAlpha = 1;
  }
  // the strings whole: through the lens, the names white over them
  function drawRays(x, t) {
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
    x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
    x.fillStyle = "#050505"; x.fillRect(0, 0, W, H);
    lensed(x, (col) => raysPass(x, col, t), RS.lens);
    raysWords(x, "#ffffff");
  }
  // one colour of the strings alone, for the discs: their ground, the
  // strings in that colour where the lens throws it, the names in it too
  const PURE = ["#ff0000", "#00ff00", "#0000ff"], DARK = ["#050000", "#000500", "#000005"];
  function drawRaysOne(x, c, t) {
    const op = x.globalCompositeOperation;
    x.fillStyle = DARK[c]; x.fillRect(0, 0, W, H);
    lensed(x, (col) => raysPass(x, col, t), RS.lens, c);
    x.globalCompositeOperation = "lighter";
    raysWords(x, PURE[c]);
    x.globalCompositeOperation = op;
  }

  // THE WORLD: the poster, its spheres out of focus, the blob at the middle.
  // `c` is drawn into at `sc` pixels a point (the screen's own, or the
  // opening's smaller picture); `boost` widens the middle's aberration
  function drawWorldView(c, sc, now, t, dt, boost) {
    if (!ground) ground = drawGround();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;
    c.imageSmoothingQuality = "high";
    c.drawImage(ground, 0, 0, c.canvas.width, c.canvas.height);
    c.setTransform(sc, 0, 0, sc, 0, 0);
    const ch = TR.kind === "change" ? clamp((now - TR.t0) / TR.ms, 0, 1) : -1;
    // the spheres round it, drifting, the nearer moving more with the hand
    const fh = STILL ? 1 : 1 - Math.exp(-dt * 3.2);
    handS.x += ((hand.on ? hand.x / W - 0.5 : 0) - handS.x) * fh;
    handS.y += ((hand.on ? hand.y / H - 0.5 : 0) - handS.y) * fh;
    const px = handS.x, py = handS.y;
    const lean = (b) => {
      const depth = 0.4 + b.focus;
      b.dx = (STILL ? 0 : Math.sin(t * b.sp + b.ph) * 9) - px * 18 * depth;
      b.dy = (STILL ? 0 : Math.cos(t * b.sp * 0.8 + b.ph) * 7) - py * 14 * depth;
    };
    // the spheres of the world before, going where they stand
    // (gone the way the world is going, when it slides: ‹ › and the list)
    const slide = ch >= 0 && TR.slide ? TR.slide : 0;
    if (ch >= 0 && TR.old) {
      const a = 1 - soft(ch * (slide ? 1.3 : 1.7));
      for (const b of TR.old) {
        if (!b.img || a <= 0.01) continue;
        lean(b);
        const s = b.img.s * (1 - 0.12 * soft(ch * 1.7));
        sphereAt(c, b, b.x + b.dx - slide * 140 * soft(ch), b.y + b.dy, s, a * 0.94, t);
      }
    }
    const fl = STILL ? 1 : 1 - Math.exp(-dt * 6);
    for (const b of blobs) {
      lean(b);
      // the one the middle becomes is the traveller until it lands
      if (ch >= 0 && b === TR.back) continue;
      if (!b.img) continue;
      // coming in one after another (after the change has turned)
      const startAt = ch >= 0 ? 0.42 : 0;
      if (ch < 0 || ch > startAt) b.in = Math.min(1, b.in + dt * (STILL ? 99 : 1.3));
      b.lift += ((stick === b || aim === b ? 1 : 0) - b.lift) * fl;
      const k = soft(clamp(b.in * 1.15 - b.wait, 0, 1));
      if (k <= 0) continue;
      const s = b.img.s * (0.84 + 0.16 * k) * (1 + 0.06 * b.lift);
      sphereAt(c, b, b.x + b.dx + slide * 140 * (1 - k), b.y + b.dy, s, k * (0.94 + 0.06 * b.lift), t);
      // nothing written by it (2026-11-07, last): the list names it and
      // lights it, and a small note by the hand says which it is
    }
    c.globalAlpha = 1;
    if (ch >= 0) {
      // A CHANGE: the middle going out to its place, the one pressed coming in
      if (TR.back && TR.outT) { TR.outT.x1 = TR.back.x + TR.back.dx; TR.outT.y1 = TR.back.y + TR.back.dy; }
      if (TR.outT) drawTraveller(c, TR.outT, ch, t, TR.outT.gone ? 1 - soft((ch - (slide ? 0.3 : 0.5)) / (slide ? 0.55 : 0.5)) : 1);
      if (TR.inT) drawTraveller(c, TR.inT, ch, t, slide ? smooth(ch / 0.35) : 1);
      if (ch >= 1) {
        if (TR.back) { TR.back.in = 1; }
        changed();
      }
    } else if (cur.lobes) drawCur(c, cur, P.x, P.y, P.r, t, 1, boost || 1);
    // (the perfumes no source credits: their list, and nothing drawn — "i dont
    // want it to be a hexagon, rather make it just a list. a normal list")
    drawSwarm(c, dt, t, ch);
  }

  // a sphere where it stands: its picture, or the hexagon of the perfumes no
  // source credits
  function sphereAt(c, b, x, y, s, alpha, t) {
    if (b.img.hex) { drawHexLens(c, x, y, b.r * 0.92 * (s / b.img.s), alpha, t, 0.9, 0.05); return; }
    c.globalAlpha = alpha;
    c.drawImage(b.img.c, x - s / 2, y - s / 2, s, s);
  }
  // THE SWARM (2026-11-10 — "remove the circle that goes around the things,
  // and instead make it something more thematic; something more
  // particulate"; it was a double circle, after the poster's): a ring of fine
  // specks turning slowly round the last sphere the hand was on, as the air
  // round a scent is full of it — each at a distance of its own, the most a
  // little way out from its edge, the rest thinning further out. Pressed on
  // to another sphere, they stream across to it, each on a spring of its
  // own, the quick ones first, and settle into turning round it. Nothing
  // round the middle (2026-11-10 — "remove the ability of the person to
  // hover over the middle blob (just remove the emphasis on it)"). Drawn
  // through the lens as the blobs are: each colour takes its speck a little
  // apart, so a speck is dark with a blue fringe above and a gold one below.
  const SW = { parts: [], on: null, a: 0, cx: 0, cy: 0, r: 0 };
  (function () {
    const R = rng(29), n = phone ? 80 : 120;
    for (let i = 0; i < n; i++) {
      const far = R();
      SW.parts.push({
        th: R() * TAU, om: (R() < 0.82 ? 1 : -1) * (0.12 + R() * 0.34), rho: 1.1 + far * far * 0.62,
        w: 3.2 + R() * 5.5, ph: R() * TAU, f: 0.4 + R() * 0.9, sz: 0.7 + R() * R() * 1.6, al: 0.35 + R() * 0.65,
        x: 0, y: 0, vx: 0, vy: 0, set: false,
      });
    }
  })();
  const SW_INK = [0.82, 0.9, 0.86];
  function drawSwarm(c, dt, t, ch) {
    const on = stick && blobs.includes(stick) && stick.img && ch < 0 ? stick : null;
    if (on !== SW.on) { SW.on = on; }
    if (on) { SW.cx = on.x + on.dx; SW.cy = on.y + on.dy; SW.r = on.r; }
    const f = STILL ? 1 : 1 - Math.exp(-dt * (on ? 3 : 2.2));
    SW.a += ((on ? 1 : 0) - SW.a) * f;
    if (SW.a < 0.004) { SW.a = 0; for (const p of SW.parts) p.set = false; return; }
    const h = Math.min(dt, 1 / 30);
    for (const p of SW.parts) {
      if (!STILL) p.th += p.om * dt * (on ? 1 : 0.4);
      // its place round the sphere — and with nothing to go round, out and away
      const out = on ? 1 : 1 + (1 - SW.a) * 0.9;
      const rr = SW.r * p.rho * out * (1 + (STILL ? 0 : 0.05 * Math.sin(t * p.f + p.ph)));
      const tx = SW.cx + Math.cos(p.th) * rr, ty = SW.cy + Math.sin(p.th) * rr * 0.94 - (STILL ? 0 : 3 * Math.sin(t * p.f * 0.7 + p.ph));
      if (!p.set || STILL) { p.x = tx; p.y = ty; p.vx = p.vy = 0; p.set = true; continue; }
      const w = p.w;
      p.vx += (w * w * (tx - p.x) - 2 * w * p.vx) * h; p.x += p.vx * h;
      p.vy += (w * w * (ty - p.y) - 2 * w * p.vy) * h; p.y += p.vy * h;
    }
    // three passes, each taking one colour out where its speck falls
    const op = c.globalCompositeOperation;
    c.globalCompositeOperation = "multiply";
    const k = phone ? 1 : 1.35;
    const FILL = ["#00ffff", "#ff00ff", "#ffff00"];
    for (let ci = 0; ci < 3; ci++) {
      c.fillStyle = FILL[ci];
      const ox = -LENS_AT[ci] * k * 0.8, oy = -LENS_AT[ci] * k;   // red up and left, blue down and right
      for (const p of SW.parts) {
        // fainter the further out it stands, and as it streams across
        const sp = Math.min(1, Math.hypot(p.vx, p.vy) / 900);
        c.globalAlpha = SW.a * p.al * SW_INK[ci] * (1.15 - 0.45 * (p.rho - 1.1) / 0.62) * (1 - 0.35 * sp);
        const z = p.sz * (1 + 0.6 * sp);
        c.fillRect(p.x + ox - z / 2, p.y + oy - z / 2, z, z);
      }
    }
    c.globalCompositeOperation = op;
    c.globalAlpha = 1;
  }
  // ---- THE DISCS (2026-11-08): the world opening out of the point, or
  // closing on it, one colour at a time. Each of red, green and blue sees
  // the world inside a disc of its own and the strings outside it — and
  // since 2026-11-10 ("I want you to actually make that chromatically
  // abberate as in lag a little ... just modulate it so its smoother") the
  // three are a beat apart in time as well as a little apart in place: blue
  // opens first and red last, so the edge of the world comes in blue, then
  // cyan, then whole, and goes the same way round when it closes, every disc
  // on one gentle curve, setting off and arriving softly.
  let wcv = null, wch = null;
  const DISC_AT = [1, 0.3, -1], DISC_R = [0.99, 1, 1.01];
  // how far behind blue each colour sets off, of the discs' time
  const LAG = [0.024, 0.012, 0];
  // as far as the farthest corner, and the feather and the throw past it
  const farthest = () => Math.max(Math.hypot(map.hub.x, map.hub.y), Math.hypot(W - map.hub.x, map.hub.y), Math.hypot(map.hub.x, H - map.hub.y), Math.hypot(W - map.hub.x, H - map.hub.y));
  // the discs' curve: at rest at both ends, quickest a little before half way
  const discCurve = (x) => { x = clamp(x, 0, 1); return 1 - Math.pow(1 - Math.pow(x, 1.45), 2.3); };
  function disc(c, v) {
    const R = v * (farthest() * 1.12 + 70), o = (4 + R * 0.025) * Math.sin(Math.PI * Math.min(1, v * 1.1)) + R * 0.006;
    return { x: map.hub.x + DISC_AT[c] * o * 0.8, y: map.hub.y + DISC_AT[c] * o, r: Math.max(0, R * DISC_R[c]), f: 8 + R * 0.05 };
  }
  function drawDiscs(now, t, dt, vs, boost) {
    // the world drawn a little smaller than the screen while it opens, and
    // taken apart into its three colours
    const ts = Math.min(DPR, 1.25), tw = Math.round(W * ts), th = Math.round(H * ts);
    if (!wcv || wcv.width !== tw || wcv.height !== th) {
      wcv = document.createElement("canvas"); wcv.width = tw; wcv.height = th;
      wch = [0, 1, 2].map(() => { const c = document.createElement("canvas"); c.width = tw; c.height = th; return c; });
    }
    const wx = wcv.getContext("2d");
    drawWorldView(wx, ts, now, t, dt, boost);
    for (let c = 0; c < 3; c++) {
      const x = wch[c].getContext("2d");
      x.globalCompositeOperation = "source-over"; x.drawImage(wcv, 0, 0);
      x.globalCompositeOperation = "multiply"; x.fillStyle = PURE[c]; x.fillRect(0, 0, tw, th);
      x.globalCompositeOperation = "source-over";
    }
    const x = ctx0;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
    x.fillStyle = "#000"; x.fillRect(0, 0, cv.width, cv.height);
    x.globalCompositeOperation = "lighter";
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
    for (let c = 0; c < 3; c++) {
      const d = disc(c, vs[c]), r0 = Math.max(0, d.r - d.f), r1 = d.r;
      // the strings outside, half in the feather
      x.save(); x.beginPath(); x.rect(-10, -10, W + 20, H + 20); x.arc(d.x, d.y, r1, 0, TAU, true); x.clip("evenodd");
      drawRaysOne(x, c, t); x.restore();
      if (r1 > 0.5) {
        x.save(); x.beginPath(); x.arc(d.x, d.y, r1, 0, TAU); if (r0 > 0) x.arc(d.x, d.y, r0, 0, TAU, true); x.clip("evenodd");
        drawRaysOne(x, c, t);
        x.globalAlpha = 0.5;
        x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(wch[c], 0, 0, cv.width, cv.height); x.setTransform(DPR, 0, 0, DPR, 0, 0);
        x.globalAlpha = 1; x.restore();
      }
      // the world inside
      if (r0 > 0.5) {
        x.save(); x.beginPath(); x.arc(d.x, d.y, r0, 0, TAU); x.clip();
        x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(wch[c], 0, 0, cv.width, cv.height);
        x.restore();
      }
    }
    x.globalCompositeOperation = "source-over";
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  // the spheres painted one a frame, the nearest first, so no frame waits
  // for all of them
  function paintSome() {
    let n = STILL ? 99 : 1;
    const todo = blobs.filter((b) => !b.img).sort((a, b) => b.focus - a.focus);
    for (const b of todo) { if (n-- <= 0) break; paintSphere(b); }
    return todo.length > 0;
  }
  // where each disc stands as the world opens (u its time, 0 to 1): none
  // until the strings have reeled in, then blue, green and red in turn
  function openDiscs(u) {
    const x = (u - DISC_FROM) / (1 - DISC_FROM);
    return LAG.map((l) => discCurve((x - l) / (1 - LAG[0])));
  }
  // and as it closes, from wherever they stood: red first, blue last
  function closeDiscs(u) {
    return [0, 1, 2].map((c) => TR.vs0[c] * (1 - discCurve((u - LAG[2 - c]) / (1 - LAG[0]))));
  }
  let clock = 0, last = 0, raf = 0;
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (!STILL) clock += dt;
    const t = clock;
    if (mapT0 < 0) mapT0 = now;
    if (!ready && fontsIn && now - mapT0 >= RAYS_IN + 120) { ready = true; document.body.classList.add("is-ready"); }
    if (cur && laid) paintSome();
    const raysOn = view === "rays" || TR.kind === "open" || TR.kind === "close";
    if (raysOn) stepRays(now, t, dt);
    if (TR.kind === "open") {
      const u = clamp((now - TR.t0) / TR.ms, 0, 1);
      const vs = openDiscs(u);
      // the blob comes out of a wide aberration into its own
      const boost = 1 + 2.4 * (1 - smooth((vs[1] - 0.2) / 0.8));
      if (vs[2] <= 0) drawRays(ctx0, t);
      else drawDiscs(now, t, dt, vs, boost);
      document.body.style.setProperty("--reveal", smooth((vs[1] - 0.45) / 0.5).toFixed(3));
      if (u >= 1) opened();
    } else if (TR.kind === "close") {
      const u = clamp((now - TR.t0) / TR.ms, 0, 1);
      const vs = closeDiscs(u);
      drawDiscs(now, t, dt, vs, 1 + 2.4 * smooth(u * 1.4));
      document.body.style.setProperty("--reveal", (TR.reveal0 * (1 - smooth(u / 0.35))).toFixed(3));
      if (u >= 1) closed();
    } else if (view === "rays") drawRays(ctx0, t);
    else drawWorldView(ctx0, DPR, now, t, dt, 1);
    if (!STILL && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  // ---- THE GRAIN, as the poster's: a picture of noise jumped about by its
  // transform, never drawn again — softer since 2026-11-10 ("make the noise
  // softer in the blobs page"): a narrower, lighter noise, fainter and slower ---------------------------------------------
  (function grain() {
    const g = document.createElement("canvas");
    g.width = g.height = 160;
    const x = g.getContext("2d"), im = x.createImageData(160, 160), R = rng(3);
    for (let i = 0; i < im.data.length; i += 4) { const v = 150 + (R() + R()) * 52; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    x.putImageData(im, 0, 0);
    el(".pw-grain").style.backgroundImage = "url(" + g.toDataURL() + ")";
  })();


  // ---- BEGIN -----------------------------------------------------------------
  // the world is not laid before the strings have begun (2026-11-07 — "make
  // the loading of it smoother"): its pictures are painted once the first
  // frames are out
  let laid = false;
  const layLater = () => { if (!laid) { laid = true; if (!cur) cur = { kind: "per", p: ORDER[0] }; layWorld(); writeHud(); writeList(); } };
  resize();
  setBody();
  // the drawing has come: the plain index below is put away
  document.documentElement.classList.add("pw-drawn");
  document.documentElement.classList.remove("js-coming");
  // an address naming a perfumer opens their world; "house-" and a house's
  // name, the house's
  function fromAddress() {
    const hsh = decodeURIComponent(location.hash.slice(1));
    if (!hsh || busy()) return;
    const p = PER.find((q) => q.id === hsh);
    const ho = !p && hsh.startsWith("house-") ? HOS.find((h) => h.id === hsh.slice(6)) : null;
    if (!p && !ho) return;
    cur = p ? { kind: "per", p } : { kind: "house", ho }; if (p) lastPer = p;
    laid = true; stick = null; aim = null; closeMore(true);
    layWorld(); writeHud(); writeList(); view = "world"; setBody(); kick();
  }
  fromAddress();
  window.addEventListener("hashchange", fromAddress);
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 60));
  setTimeout(() => idle(layLater, { timeout: 600 }), 320);
  window.addEventListener("resize", () => { resize(); kick(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { last = 0; kick(); } });
  if (STILL) {
    const again = () => requestAnimationFrame(frame);
    ["click", "keydown", "change", "pointermove"].forEach((e) => document.addEventListener(e, again));
  }
  kick();
  const findBody = (id) => blobs.find((x) => (x.kind === "house" ? x.ho.id : x.p.id) === id);
  window.PerfumerWorlds = {
    view: () => view,
    busy: () => TR.kind,
    now: () => (cur ? { kind: cur.kind, perfumer: cur.kind === "per" ? cur.p.id : null, house: cur.kind === "house" ? cur.ho.id : null, count: listOf(cur).length } : null),
    dots: () => map.dots.length,
    perfumers: NP,
    // a perfumer's dots: where the first stands, and how many
    dotOf: (id) => { const d = map.dots.find((x) => x.p.id === id); return d ? { x: d.x, y: d.y } : null; },
    blockOf: (id) => { const b = map.blocks.find((x) => x.p.id === id); return b ? { dots: b.dots.length, x0: b.x0, x1: b.x1, y0: b.y0, y1: b.y1, lit: +b.g.toFixed(2) } : null; },
    // how slack a perfumer's strings are: 1 hanging, 0 taut
    slack: (id) => { const ds = map.dots.filter((x) => x.p.id === id); return ds.length ? +(ds.reduce((s, d) => s + d.s.k, 0) / ds.length).toFixed(2) : null; },
    // how far the middle of a perfumer's first string hangs off the straight
    sag: (id) => { const d = map.dots.find((x) => x.p.id === id); if (!d) return null; const [mx, my] = along(d.s, 0.5); return +Math.hypot(mx - (d.x + map.hub.x) / 2, my - (d.y + map.hub.y) / 2).toFixed(1); },
    // how many strings are ringing (plucked, or twanging as they pull taut)
    ringing: () => map.strings.filter((s) => s.ring > 0.5).length,
    houseAt: (id) => { const b = blobs.find((x) => x.kind === "house" && x.ho.id === id); return b ? { x: b.x + b.dx, y: b.y + b.dy } : null; },
    perfumerAt: (id) => { const b = blobs.find((x) => x.kind === "per" && x.p.id === id); return b ? { x: b.x + b.dx, y: b.y + b.dy } : null; },
    middle: () => ({ x: P.x, y: P.y }),
    // the swarm: round which sphere, how much of it is there, and where its middle is
    swarm: () => ({ on: SW.on ? (SW.on.kind === "house" ? SW.on.ho.id : SW.on.p.id) : null, a: +SW.a.toFixed(2), n: SW.parts.length, x: +SW.cx.toFixed(1), y: +SW.cy.toFixed(1) }),
    open: (id, quick) => { const p = PER.find((q) => q.id === id); if (p) openWorld({ kind: "per", p }, quick); },
    openHouse: (id, quick) => { const ho = HOS.find((q) => q.id === id); if (ho) openWorld({ kind: "house", ho }, quick); },
    go: (id) => { const b = findBody(id); if (b) change(b.kind === "per" ? { kind: "per", p: b.p } : { kind: "house", ho: b.ho }); },
    ret: returnUp,
    lobes: () => (cur && cur.lobes ? cur.lobes.filter((o) => o.part).map((o) => o.part.say) : []),
    shape: () => (cur && cur.lobes ? (cur.lobes.every((o) => o.sides === 6) ? "cut" : cur.lobes.every((o) => !o.sides) ? "round" : "mixed") : null),
    list: () => listRows.map((r) => nameOf(r)),
    spheres: () => blobs.length,
    sphereKinds: () => blobs.map((b) => b.kind + (b.lobes.every((o) => o.sides === 6) ? ":cut" : ":round")),
    // how sharp a sphere is painted, against the screen's pixels it covers
    sharpness: () => blobs.filter((b) => b.img).map((b) => +(b.img.c.width / (b.img.s * DPR)).toFixed(2)),
    look: () => LOOK,
    // the colour where the blob's edge begins, walking in from its upper left
    // and from its lower right (the picture's own colour, before the poster)
    rim: () => {
      if (!cur || !cur.paint) return null;
      const c = cur.paint, n = c.width, d = c.getContext("2d").getImageData(0, 0, n, n).data;
      const walk = (s) => {
        for (let k = 0; k < n / 2; k++) {
          const q = (n / 2 - k) * 0.7071, i = Math.round(n / 2 + s * q), j = Math.round(n / 2 + s * q), o = (j * n + i) * 4;
          if (d[o + 3] > 150) return [d[o], d[o + 1], d[o + 2]];
        }
        return null;
      };
      return { upLeft: walk(-1), downRight: walk(1) };
    },
    // the middle's darkest colour: a perfumer's plum, a house's ink
    core: () => {
      if (!cur || !cur.paint) return null;
      const c = cur.paint, n = c.width, d = c.getContext("2d").getImageData(0, 0, n, n).data;
      let best = null, lum = 1e9;
      for (let o = 0; o < d.length; o += 4) if (d[o + 3] > 240) { const l = d[o] + d[o + 1] + d[o + 2]; if (l < lum) { lum = l; best = [d[o], d[o + 1], d[o + 2]]; } }
      return best;
    },
  };
})();

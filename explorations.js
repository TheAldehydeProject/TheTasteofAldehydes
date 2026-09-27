// ============================================================
// THE FIELD — categories/researches.html (Explorations & Researches)
//
// The owner, 2026-09-26: "Delete the right side of the page, and move
// the table upwards, so that it takes up abour 3/5ths of the page on the
// left ... On the right side, I want you to make something extravagant
// with the particles". Then, of a figure for each work: "REmove the
// research specific stuff; and make it more so a general abstract
// geometric particulate thing". And then, of forms chosen by the row
// pointed at:
//
//   "for the researches, I want the shapes to not change based on which
//   research you hover, but rather to transform from one to another ...
//   I want these eto look mathematical and abstract, as well as made from
//   particles with some loci where you have geometric elements (such as
//   triangles from the connected dots)"
//
// And last, choosing from two lists of candidates shown to them:
//
//   "i want you to put these on the page instead of what there is right
//   now, and make it now last 8 seconds transforming to 8 seocnds
//   holding. i also want you to be able to on command go to the next one
//   or back with two arrows that are small and subtle near the bottom,
//   and i want it to display the name (in tiny script) of what is
//   actually being shown in the particle thing. Also, to the shapes and
//   stuff, i want you to add triangles and a little geometry."
//
// So the field keeps ITS OWN TIME and the table does not conduct it. It
// stands in one FORM for `HOLD` (12s), then TRANSFORMS into the next over
// `MORPH` (6s) — "make it 6 transforming and 12 holding" (2026-09-27; it
// was eight and eight) — every speck travelling from its place in the one to its
// place in the other, the ones at the top setting off first, each
// swinging a little out of its straight way — and round again (`CYCLE`,
// the seventeen the owner chose, in their order). Every form is a cloud of
// specks round a mathematical shape, standing in three dimensions and
// turning slowly about a tilted axis, the nearer specks larger and darker.
//
// THE ARROWS at its foot, either side of the form's name, go on to the
// next form or back to the one before at once, in a quicker
// transformation (`QUICK`); the clock carries on from there.
//
// And the geometry: THE LOCI, here and there on a form — a few specks
// joined each to its nearest by hairlines, the triangles they make
// faintly filled, each coming up, standing a while and going; THE SPANS,
// a larger triangle or two across the whole form with its angles marked;
// and THE FRAME the form turns in — its axis, and the equator it turns
// round, ticked every thirty degrees and turning with it.
//
// With reduced motion nothing moves: the first form is simply there, drawn
// once, and the arrows change it without a transformation. The pointer
// over the field parts the specks near it.
// ============================================================
(function () {
  const field = document.querySelector(".re-field");
  const canvas = field && field.querySelector(".re-canvas");
  if (!canvas) return;
  const g = canvas.getContext("2d");
  if (!g) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INK = "23, 23, 15";            // --ink
  const MONO = getComputedStyle(document.documentElement).getPropertyValue("--mono").trim() || "monospace";
  const TAU = Math.PI * 2;

  // "add a few more particles to the 3d shapes on the RE page, so the
  // shapes look more complete" (2026-09-27): half as many again as the
  // 2400 (1300 on a phone) they had, and all of them on the shapes — the
  // haze keeps the number it had.
  const COUNT = () => (window.innerWidth < 700 ? 2000 : 3600);
  const HOLD = 12000;                  // ms a form stands
  const MORPH = 6000;                  // ms a form takes to become the next
  const QUICK = 2600;                  // ms it takes when an arrow asks for it
  const ARRIVE = 1600;                 // ms the first form takes to gather, before its hold
  const SWEEP = 0.5;                   // of a transformation, over which the specks set off in turn
  const ARC = 0.24;                    // how far out of its straight way a speck swings on the way
  const SPRING = 0.045;                // how hard a speck is drawn to its place
  const DAMP = 0.84;                   // and how much of its way it keeps
  const PART = 74;                     // px the pointer parts the specks within
  const SPIN = 0.00012;                // radians a millisecond the whole field turns
  const TILT = 0.38;                   // radians its axis leans towards you
  const FOCAL = 3.2;                   // the perspective: larger is flatter
  const HAZE = 0.067;                  // share of every form's specks left loose round it (240 of 3600, as it was of 2400)
  // THE LOCI: "some loci where you have geometric elements (such as
  // triangles from the connected dots)" — and then "add triangles".
  const LOCI = 7;                      // standing at once
  const LOCUS_LIFE = 7600;             // ms each stands, coming and going
  const LOCUS_FADE = 1400;             // ms of that coming up, and going
  const LOCUS_SIZE = 13;               // specks to a locus
  const LOCUS_LINKS = 3;               // each joined to its nearest three
  const LOCUS_FROM = 84;               // px round its anchor it gathers from
  const LOCUS_GAP = 17;                // px, the least between two of its specks
  const LOCUS_REACH = 96;              // px beyond which a line is let go
  const LOCUS_FILL = 0.08;             // how dark a locus's triangles are filled
  // THE SPANS: "and a little geometry" — a large triangle across the form,
  // its corners on the shape, its angles marked.
  const SPANS = 2;                     // standing at once
  const SPAN_LIFE = 9000;              // ms each stands
  const SPAN_FADE = 1600;              // ms of that coming up, and going
  const SPAN_NEAR = 110;               // px, the shortest side a span may have
  const SPAN_FAR = 250;                // px, and the longest
  const SPAN_ANGLE = 0.55;             // radians, the least angle a span may have (no slivers)
  const SPAN_ARC = 11;                 // px, the radius of the arc marking an angle
  // THE FRAME the form turns in: its axis, and the equator round it.
  const EQUATOR = 1.02;                // the equator's radius, in the forms' own units
  const EQUATOR_TICKS = 12;            // every thirty degrees
  const FRAME_INK = 0.13;              // how dark the frame is drawn

  // THE CYCLE, in the order the owner gave it; the first is where it starts.
  const CYCLE = ["geodesic", "borromean", "rossler", "aizawa", "lissajous", "gyre", "ripple",
    "tesseract", "cell24", "spirograph", "dini", "sierpinski", "hilbert", "thomas", "chladni", "eight", "helix"];
  const NAMES = {
    geodesic: "Geodesic sphere", borromean: "Borromean rings", rossler: "Rössler attractor",
    aizawa: "Aizawa attractor", lissajous: "Lissajous knot", gyre: "Armillary", ripple: "Ripple",
    tesseract: "Tesseract", cell24: "24-cell", spirograph: "Spirograph", dini: "Dini’s surface",
    sierpinski: "Sierpiński tetrahedron", hilbert: "Hilbert curve", thomas: "Thomas attractor",
    chladni: "Chladni figure", eight: "Figure-eight knot", helix: "Helix",
  };

  // ============================================================
  // SEEDED NUMBERS. Every speck has four of its own, fixed, so a form is
  // the same form every time it is gathered; `more` gives it as many
  // again as a form needs.
  // ============================================================
  const stream = (seed) => {
    let s = seed || 1;
    return () => {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  };
  const more = (i, k) => {
    const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  let N = 0, X, Y, VX, VY, R1, R2, R3, R4, A, Z, SLOT, NEXT, SETOFF;
  function make(n) {
    N = n;
    X = new Float32Array(n); Y = new Float32Array(n);
    VX = new Float32Array(n); VY = new Float32Array(n);
    R1 = new Float32Array(n); R2 = new Float32Array(n);
    R3 = new Float32Array(n); R4 = new Float32Array(n);
    // How strongly each speck was last drawn, and how big — its depth.
    A = new Float32Array(n); Z = new Float32Array(n);
    // Where in the form it stands now, where it is going in the next,
    // and when in a transformation it sets off.
    SLOT = new Int32Array(n); NEXT = new Int32Array(n); SETOFF = new Float32Array(n);
    const rnd = stream(907);
    for (let i = 0; i < n; i++) {
      R1[i] = rnd(); R2[i] = rnd(); R3[i] = rnd(); R4[i] = rnd();
      SLOT[i] = i;
      // They arrive from everywhere on the field.
      X[i] = rnd() * W; Y[i] = rnd() * H;
    }
  }

  // ============================================================
  // THE FORMS. Each gives speck `i` a place in three dimensions, in a box
  // from -1 to 1 each way, worked out once and kept. A share of every form
  // (`HAZE`) is left loose round it as a faint cloud, and every place is
  // blurred a little (`fuzz`), so each is a cloud with a shape in it rather
  // than a hard figure. A form marked `fit` is recentred and scaled to fill
  // the field whatever its own numbers are; `turn` stands it at an angle.
  // ============================================================
  const gauss = (u, v) => Math.sqrt(-2 * Math.log(Math.max(1e-6, u))) * Math.cos(TAU * v);
  const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  /** A path traced once and kept — the attractors, which are sampled
      along the way a point goes when it is let run. */
  const traced = {};
  function trace(name, step, start, dt, steps, every, skip, map) {
    if (traced[name]) return traced[name];
    const out = [];
    let p = start.slice();
    for (let n = 0; n < steps; n++) {
      const d = step(p);
      p = [p[0] + d[0] * dt, p[1] + d[1] * dt, p[2] + d[2] * dt];
      if (n > skip && n % every === 0) out.push(map(p));
    }
    return (traced[name] = out);
  }
  /** Places found once by searching a volume — the Chladni figure's sand. */
  function pool(name, want, seed, find) {
    if (traced[name] && traced[name].length >= want) return traced[name];
    const rnd = stream(seed), out = [];
    for (let tries = 0; out.length < want && tries < want * 400; tries++) {
      const p = find(rnd);
      if (p) out.push(p);
    }
    while (out.length < want) out.push([0, 0, 0]);
    return (traced[name] = out);
  }
  /** Worked out once and kept, under its name. */
  const once = (name, make) => traced[name] || (traced[name] = make());
  const PHI = (1 + Math.sqrt(5)) / 2;
  /** The icosahedron's twelve corners, on the sphere. */
  const icosa = () => [[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
    [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]].map((p) => { const l = Math.hypot(...p); return p.map((c) => c / l); });
  /** The icosahedron's edges, each cut in two and pushed out to the
      sphere — a geodesic of frequency two. Worked out once. */
  let dome = null;
  function geodesic() {
    if (dome) return dome;
    const v = icosa();
    const f = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
    const mid = (a, b) => { const m = lerp3(a, b, 0.5), l = Math.hypot(...m); return m.map((c) => c / l); };
    const edges = [], seen = new Set(), key = (a, b) => a.map((c) => c.toFixed(3)).join() + "|" + b.map((c) => c.toFixed(3)).join();
    const add = (a, b) => { if (seen.has(key(a, b)) || seen.has(key(b, a))) return; seen.add(key(a, b)); edges.push([a, b]); };
    f.forEach(([a, b, c]) => {
      const A1 = v[a], B1 = v[b], C1 = v[c], ab = mid(A1, B1), bc = mid(B1, C1), ca = mid(C1, A1);
      [[A1, ab, ca], [ab, B1, bc], [ca, bc, C1], [ab, bc, ca]].forEach(([p, q, r]) => { add(p, q); add(q, r); add(r, p); });
    });
    return (dome = edges);
  }
  /** Every pair of corners standing `d` apart: a polytope's edges, in
      three dimensions or in four. */
  const edgesAt = (V, d) => {
    const E = [];
    V.forEach((a, j) => V.forEach((b, k) => {
      if (k > j && Math.abs(Math.hypot(...a.map((c, n) => c - b[n])) - d) < 1e-3) E.push([a, b]);
    }));
    return E;
  };
  /** A place along one of a figure's edges, a few standing on its corners. */
  const onEdge = (E, i, k) => {
    const [a, b] = E[i % E.length];
    return lerp3(a, b, R3[i] < 0.14 ? Math.round(R1[i]) : R1[i]).map((c) => c * k);
  };
  /** A regular tetrahedron's four corners on the sphere, a point upward. */
  const tetra = () => [[0, -1, 0], ...[0, 1, 2].map((k) => {
    const a = (k / 3) * TAU, r = (2 * Math.SQRT2) / 3;
    return [Math.cos(a) * r, 1 / 3, Math.sin(a) * r];
  })];
  /** A figure symmetric about the (1, 1, 1) diagonal, stood on it. */
  const diag = ([x, y, z]) => [(x - y) / Math.SQRT2, -(x + y + z) / Math.sqrt(3), (x + y - 2 * z) / Math.sqrt(6)];
  /** The `h`th corner of the Hilbert curve that fills a cube of 2^bits
      a side (Skilling's way: the index dealt out across the three axes,
      Gray-decoded, and the excess turns undone). */
  const hilbert = (h, bits) => {
    const X = [0, 0, 0];
    for (let j = 0; j < 3 * bits; j++) {
      if ((h >> (3 * bits - 1 - j)) & 1) X[j % 3] |= 1 << (bits - 1 - Math.floor(j / 3));
    }
    const top = 2 << (bits - 1);
    let t = X[2] >> 1;
    for (let k = 2; k > 0; k--) X[k] ^= X[k - 1];
    X[0] ^= t;
    for (let Q = 2; Q !== top; Q <<= 1) {
      const P = Q - 1;
      for (let k = 2; k >= 0; k--) {
        if (X[k] & Q) X[0] ^= P;
        else { t = (X[0] ^ X[k]) & P; X[0] ^= t; X[k] ^= t; }
      }
    }
    return X;
  };
  /** A place on a surface's WIREFRAME: along one of `nu` lines one way
      or `nv` the other, so a surface is drawn as a mathematician draws
      one rather than filled. */
  const wire = (i, nu, nv) => {
    const along = more(i, 22);
    return more(i, 21) < 0.5 ? [Math.round(more(i, 23) * nu) / nu, along] : [along, Math.round(more(i, 23) * nv) / nv];
  };

  const SHAPES = {
    // An icosahedron's edges cut in two and pushed out: triangles.
    geodesic: { fuzz: 0.008, place(i) {
      const E = geodesic(), [a, b] = E[i % E.length];
      const t = R3[i] < 0.14 ? Math.round(R1[i]) : R1[i];
      return lerp3(a, b, t).map((c) => c * 0.8);
    } },
    // Three rings, no two linked, all three held.
    borromean: { fuzz: 0.025, place(i) {
      const k = i % 3, t = R1[i] * TAU, a = 0.8, b = 0.42;
      const c = Math.cos(t) * a, s = Math.sin(t) * b;
      return k === 0 ? [c, s, 0] : k === 1 ? [0, c, s] : [s, 0, c];
    } },
    // Rössler's: a flat spiral that folds over at its edge.
    rossler: { fuzz: 0.012, fit: true, turn: [0.5, 0, 0], place(i) {
      const P = trace("rossler", ([x, y, z]) => [-y - z, x + 0.2 * y, 0.2 + z * (x - 5.7)],
        [0.1, 0, 0], 0.01, 24000, 2, 3000, ([x, y, z]) => [x, -z * 0.35, y]);
      return P[Math.floor((i / N) * P.length)].slice();
    } },
    // Aizawa's: a sphere with a tube drawn down through it.
    aizawa: { fuzz: 0.01, fit: true, place(i) {
      const [a, b, c, d, e, f] = [0.95, 0.7, 0.6, 3.5, 0.25, 0.1];
      const P = trace("aizawa", ([x, y, z]) => [(z - b) * x - d * y, d * x + (z - b) * y,
        c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x],
      [0.1, 0, 0], 0.008, 24000, 2, 3000, ([x, y, z]) => [x, -z, y]);
      return P[Math.floor((i / N) * P.length)].slice();
    } },
    // A curve of three sines.
    lissajous: { fuzz: 0.03, place(i) {
      const t = R1[i] * TAU;
      return [Math.sin(3 * t + 0.4) * 0.74, Math.sin(4 * t + 1.1) * 0.74, Math.sin(5 * t) * 0.74];
    } },
    // The armillary: three rings crossed.
    gyre: { fuzz: 0.025, place(i) {
      const a = R1[i] * TAU, r = 0.74, k = i % 3;
      const c = Math.cos(a) * r, s = Math.sin(a) * r;
      return k === 0 ? [c, s, 0] : k === 1 ? [c, 0, s] : [0, c, s];
    } },
    // Rings on a still surface, dying away from where it was touched.
    ripple: { fuzz: 0.008, place(i) {
      const rho = (Math.round(R1[i] * 17) + R3[i] * 0.2) / 17 * 0.9, a = R2[i] * TAU;
      const h = 0.2 * Math.cos(rho * 15) * Math.exp(-rho * 1.7);
      return [rho * Math.cos(a), -h, rho * Math.sin(a)];
    } },
    // The four-dimensional cube, turned a little through the fourth
    // dimension and seen from along it: a cube inside a cube, corner to
    // corner.
    tesseract: { fuzz: 0.006, fit: true, place(i) {
      const E = once("tesseract", () => {
        const V = [];
        for (let k = 0; k < 16; k++) V.push([0, 1, 2, 3].map((b) => ((k >> b) & 1 ? 1 : -1)));
        const a = 0.34, c = Math.cos(a), s = Math.sin(a);
        const see = ([x, y, z, w]) => {
          [x, w] = [x * c - w * s, x * s + w * c];
          [y, w] = [y * c - w * s, y * s + w * c];
          const k = 2.4 / (3.4 - w);
          return [x * k, y * k, z * k];
        };
        return edgesAt(V, 2).map(([p, q]) => [see(p), see(q)]);
      });
      return onEdge(E, i, 1);
    } },
    // The 24-cell: a solid of the fourth dimension with no match in the
    // third, twenty-four corners and ninety-six edges, seen as the
    // tesseract is.
    cell24: { fuzz: 0.006, fit: true, place(i) {
      const E = once("cell24", () => {
        const V = [];
        for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) for (const sa of [1, -1]) for (const sb of [1, -1]) {
          const v = [0, 0, 0, 0];
          v[a] = sa; v[b] = sb;
          V.push(v);
        }
        const t = 0.3, c = Math.cos(t), s = Math.sin(t);
        const see = ([x, y, z, w]) => {
          [x, w] = [x * c - w * s, x * s + w * c];
          [z, w] = [z * c - w * s, z * s + w * c];
          const k = 2.4 / (3.2 - w);
          return [x * k, y * k, z * k];
        };
        return edgesAt(V, Math.SQRT2).map(([p, q]) => [see(p), see(q)]);
      });
      return onEdge(E, i, 1);
    } },
    // The toy's curve: a small wheel rolled inside a large one, a pen held
    // off its rim — lifted and let down as it goes round.
    spirograph: { fuzz: 0.01, turn: [0.75, 0, 0], place(i) {
      const R = 7, r = 3, d = 4.2, k = (R - r) / r, t = R1[i] * TAU * 3;
      return [((R - r) * Math.cos(t) + d * Math.cos(k * t)) * 0.095, Math.sin(t * 7) * 0.07, ((R - r) * Math.sin(t) - d * Math.sin(k * t)) * 0.095];
    } },
    // Dini's surface: a funnel twisted into a spiral, narrowing for ever.
    dini: { fuzz: 0.004, fit: true, place(i) {
      const [wu, wv] = wire(i, 26, 9), u = wu * 3.2 * Math.PI, v = 0.08 + wv * 1.7;
      return [Math.cos(u) * Math.sin(v), -(Math.cos(v) + Math.log(Math.tan(v / 2)) + 0.18 * u), Math.sin(u) * Math.sin(v)];
    } },
    // A tetrahedron made of four half-size ones, each of those of four
    // more, and so on down: three levels, drawn as their edges.
    sierpinski: { fuzz: 0.004, place(i) {
      const E = once("sierpinski", () => {
        let T = [tetra()];
        for (let n = 0; n < 3; n++) T = T.flatMap((t) => t.map((c) => t.map((v) => lerp3(c, v, 0.5))));
        const out = [];
        T.forEach((t) => t.forEach((a, j) => t.forEach((b, k) => { if (k > j) out.push([a, b]); })));
        return out;
      });
      return onEdge(E, i, 0.86);
    } },
    // The Hilbert curve: one line that visits every cell of a cube of
    // four by four by four, turning at right angles, never crossing itself.
    hilbert: { fuzz: 0.006, turn: [0.2, 0.5, 0], place(i) {
      const E = once("hilbert", () => {
        const P = [];
        for (let h = 0; h < 64; h++) P.push(hilbert(h, 2).map((c) => (c - 1.5) / 1.5));
        return P.slice(1).map((p, k) => [P[k], p]);
      });
      const [a, b] = E[i % E.length];
      return lerp3(a, b, R1[i]).map((c) => c * 0.62);
    } },
    // Thomas's cyclically symmetric attractor: a point wandering a lattice
    // of loops, never the same way twice.
    thomas: { fuzz: 0.005, fit: true, place(i) {
      const b = 0.208186;
      const P = trace("thomas", ([x, y, z]) => [Math.sin(y) - b * x, Math.sin(z) - b * y, Math.sin(x) - b * z],
        [0.1, 0, -0.1], 0.05, 7000, 1, 1500, diag);
      return P[Math.floor((i / N) * P.length)].slice();
    } },
    // Sand on a sounded plate, gathered on the lines that stand still.
    chladni: { fuzz: 0.003, turn: [-0.9, 0, 0], place(i) {
      if (R2[i] < 0.1) {
        // The plate's edge.
        const s = R1[i] * 4, e = Math.floor(s) % 4, f = (s - Math.floor(s)) * 2 - 1;
        const [x, z] = [[f, 1], [1, -f], [-f, -1], [-1, f]][e];
        return [x * 0.8, 0, z * 0.8];
      }
      const P = pool("chladni", N, 53, (rnd) => {
        const x = rnd() * 2 - 1, z = rnd() * 2 - 1, n = 2, m = 5;
        const f = Math.cos(n * Math.PI * x) * Math.cos(m * Math.PI * z) - Math.cos(m * Math.PI * x) * Math.cos(n * Math.PI * z);
        return Math.abs(f) < 0.045 ? [x * 0.8, 0, z * 0.8] : null;
      });
      return P[i % P.length].slice();
    } },
    // The knot with four crossings.
    eight: { fuzz: 0.04, turn: [0.7, 0, 0], place(i) {
      const t = R1[i] * TAU, k = 0.26;
      return [(2 + Math.cos(2 * t)) * Math.cos(3 * t) * k, Math.sin(4 * t) * k * 1.3, (2 + Math.cos(2 * t)) * Math.sin(3 * t) * k];
    } },
    // Two strands wound round each other, with a rung across now and then.
    helix: { fuzz: 0.03, place(i) {
      const s = R1[i], strand = i % 2;
      if (R2[i] < 0.12) {
        const s2 = Math.round(s * 18) / 18, a = s2 * TAU * 2.5, u = R3[i];
        const x0 = Math.cos(a) * 0.42, z0 = Math.sin(a) * 0.42;
        return [x0 * (1 - 2 * u), (s2 - 0.5) * 1.6, z0 * (1 - 2 * u)];
      }
      const a = s * TAU * 2.5 + strand * Math.PI;
      return [Math.cos(a) * 0.42, (s - 0.5) * 1.6, Math.sin(a) * 0.42];
    } },
  };

  const turned = (p, [ax, ay, az]) => {
    let [x, y, z] = p;
    if (ax) { const c = Math.cos(ax), s = Math.sin(ax); [y, z] = [y * c - z * s, y * s + z * c]; }
    if (ay) { const c = Math.cos(ay), s = Math.sin(ay); [x, z] = [x * c + z * s, -x * s + z * c]; }
    if (az) { const c = Math.cos(az), s = Math.sin(az); [x, y] = [x * c - y * s, x * s + y * c]; }
    return [x, y, z];
  };

  const made = new Map();
  /** A form's places, worked out once and kept: three numbers a place,
      and the order its places are paired in with another form's. */
  function formOf(name) {
    if (made.has(name)) return made.get(name);
    const shape = SHAPES[name];
    const P = new Float32Array(N * 3);
    const loose = new Uint8Array(N);
    const raw = [];
    for (let i = 0; i < N; i++) {
      if (R4[i] < HAZE) { loose[i] = 1; raw.push(null); continue; }
      let p = shape.place(i);
      if (shape.turn) p = turned(p, shape.turn);
      raw.push(p);
    }
    if (shape.fit) {
      // Centred on its own middle, and its reach (all but the furthest
      // few) made the same as every other form's.
      let cx = 0, cy = 0, cz = 0, n = 0;
      raw.forEach((p) => { if (p) { cx += p[0]; cy += p[1]; cz += p[2]; n++; } });
      cx /= n; cy /= n; cz /= n;
      const far = raw.filter(Boolean).map((p) => Math.hypot(p[0] - cx, p[1] - cy, p[2] - cz)).sort((a, b) => a - b);
      const k = 0.82 / (far[Math.floor(far.length * 0.97)] || 1);
      raw.forEach((p, i) => { if (p) raw[i] = [(p[0] - cx) * k, (p[1] - cy) * k, (p[2] - cz) * k]; });
    }
    for (let i = 0; i < N; i++) {
      let p = raw[i];
      if (!p) {
        // The haze round every form: a cloud, wider and fainter.
        const s = 0.5;
        p = [gauss(R1[i], R3[i]) * s, gauss(R3[i], R2[i]) * s * 0.8, gauss(R2[i], R1[i]) * s];
      } else if (shape.fuzz) {
        p = [p[0] + gauss(R3[i], R4[i]) * shape.fuzz, p[1] + gauss(R4[i], R1[i]) * shape.fuzz, p[2] + gauss(R1[i], R4[i]) * shape.fuzz];
      }
      P[i * 3] = p[0]; P[i * 3 + 1] = p[1]; P[i * 3 + 2] = p[2];
    }
    // THE PAIRING. Two forms' places are paired by rank: from the top down
    // in bands, and round each band in order — so a transformation takes
    // the top of one form to the top of the next, and turns rather than
    // tangles.
    const key = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const band = Math.max(0, Math.min(23, Math.floor(((P[i * 3 + 1] + 1.1) / 2.2) * 24)));
      key[i] = band * 10 + ((Math.atan2(P[i * 3 + 2], P[i * 3]) + Math.PI) / TAU) * 9.99;
    }
    const perm = Int32Array.from({ length: N }, (_, i) => i).sort((a, b) => key[a] - key[b]);
    const rank = new Int32Array(N);
    perm.forEach((slot, r) => { rank[slot] = r; });
    const form = { name, P, perm, rank, loose };
    made.set(name, form);
    return form;
  }

  // ============================================================
  // WHICH FORM, AND WHEN. `?form=<name>` holds one form still on the page
  // (how the candidates were shown to the owner); otherwise THE CYCLE.
  //
  // THE CLOCK: showing form `cur`, either holding it (`to` is -1) or on its
  // way from it to form `to`, since `since`, for `dur`. It is kept up with
  // the time however long the window was away, and an arrow can start a
  // transformation at any moment.
  // ============================================================
  const asked = new URLSearchParams(window.location.search).get("form");
  const held = asked && SHAPES[asked] ? asked : "";
  const cycle = held ? [held] : CYCLE;
  field.dataset.cycle = cycle.join(",");
  const wrap = (k) => ((k % cycle.length) + cycle.length) % cycle.length;
  const formAt = (k) => formOf(cycle[wrap(k)]);
  let cur = 0, to = -1, since = -1, dur = ARRIVE + HOLD;
  let phase = { morph: false, q: 0 };
  /** The pairing for a transformation from form `a` to form `b`: where
      each speck goes, and when in it it sets off — the top first, and the
      rest in turn with a little of each speck's own. */
  function pair(a, b) {
    const from = formAt(a), into = formAt(b);
    for (let i = 0; i < N; i++) {
      const r = from.rank[SLOT[i]];
      NEXT[i] = into.perm[r];
      SETOFF[i] = (0.62 * (r / N) + 0.38 * more(i, 11)) * SWEEP;
    }
  }
  function setOut(k, length, t) {
    to = wrap(k); since = t; dur = length;
    pair(cur, to);
    // A span is drawn across one form: it goes as the form starts to.
    spans.forEach((s) => { s.life = Math.min(s.life, t - s.born + SPAN_FADE * 0.6); });
  }
  function land(t) {
    SLOT.set(NEXT);
    cur = to; to = -1; since = t; dur = HOLD;
  }
  /** Bring the clock up to `t`: every hold and transformation already
      over is taken, however many (a window left hidden). */
  function tick(t) {
    if (since < 0) since = t;
    if (cycle.length > 1 && !still) {
      for (let n = 0; t - since >= dur && n < 1000; n++) {
        const end = since + dur;
        if (to < 0) setOut(cur + 1, MORPH, end);
        else land(end);
      }
    }
    phase = { morph: to >= 0, q: Math.max(0, Math.min(1, (t - since) / dur)) };
  }
  /** An arrow: on to the next form, or back to the one before, now. One
      already on its way lands where it was going first — the specks are
      sprung, so they carry on there rather than jump. */
  function go(dir) {
    if (cycle.length < 2 || !N) return;
    const t = performance.now();
    tick(t);
    if (to >= 0) land(t);
    setOut(cur + dir, QUICK, t);
    if (still) {
      // Nothing moves: simply the other form, drawn once.
      land(t);
      tick(t);
      settle(t);
      stillLoci();
      caption();
      draw(t);
      return;
    }
    tick(t);
    caption();
    wake();
  }

  // ============================================================
  // THE CAPTION at the field's foot, with THE ARROWS either side of it:
  // the name of the form the field is actually showing — a
  // transformation's new name taken up half way through it, when there
  // is more of the new form than the old — and its number, with a
  // hairline over it filling as the hold or the transformation goes.
  // ============================================================
  const capNo = field.querySelector(".re-caption-no");
  const capName = field.querySelector(".re-caption-name");
  const cap = field.querySelector(".re-caption");
  // THE BAR runs across the field's foot, nearly the whole of its width,
  // over the caption — "i want it to be longer (as it was before)"
  // (2026-09-27): it had been cut down to the room between the arrows.
  const run = document.createElement("span");
  run.className = "re-run";
  run.setAttribute("aria-hidden", "true");
  run.appendChild(document.createElement("i"));
  if (cap) field.appendChild(run);
  field.querySelectorAll(".re-step").forEach((b) => {
    if (cycle.length < 2) { b.hidden = true; return; }
    b.addEventListener("click", () => go(b.classList.contains("re-prev") ? -1 : 1));
  });
  let said = "";
  function caption() {
    field.style.setProperty("--run", phase.q.toFixed(3));
    const shown = to >= 0 && phase.q >= 0.5 ? to : cur;
    const say = cur + ">" + to + ":" + shown;
    if (say === said) return;
    said = say;
    field.dataset.figure = cycle[to >= 0 ? to : cur];
    field.dataset.phase = to >= 0 ? "morph" : "hold";
    if (field.dataset.shown === cycle[shown]) return;
    field.dataset.shown = cycle[shown];
    if (!capName) return;
    capName.textContent = NAMES[cycle[shown]];
    if (capNo) capNo.textContent = String(shown + 1).padStart(2, "0") + " / " + String(cycle.length).padStart(2, "0");
    // Taken up with a short fade, not a cut.
    capName.classList.remove("is-new");
    void capName.offsetWidth;
    capName.classList.add("is-new");
  }

  // ============================================================
  // TURNING AND SEEING: a place in a form, turned about the tilted axis by
  // the clock and seen in perspective. Out: where on the field, and how
  // near (0 far, 1 near).
  // ============================================================
  const out = new Float32Array(3);
  let spin = 0, cosA = 1, sinA = 0;
  const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
  function turnTo(t) {
    spin = still ? 0.6 : t * SPIN;
    cosA = Math.cos(spin); sinA = Math.sin(spin);
  }
  function project(x, y, z) {
    // About the upright axis, then leaning towards you.
    const x1 = x * cosA + z * sinA, z1 = -x * sinA + z * cosA;
    const y2 = y * cosT - z1 * sinT, z2 = y * sinT + z1 * cosT;
    const k = FOCAL / (FOCAL + z2);
    out[0] = CX + x1 * S * k;
    out[1] = CY + y2 * S * k;
    out[2] = Math.max(0, Math.min(1, 0.5 - z2 * 0.55));
  }
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * x * (x * (x * 6 - 15) + 10));
  /** Where speck `i` belongs now: its place in form `F`, or on its way
      from there to its place in form `G`. */
  function target(i, F, G) {
    const j = SLOT[i] * 3;
    if (!G) {
      project(F[j], F[j + 1], F[j + 2]);
      return;
    }
    const k = NEXT[i] * 3;
    const e = ease((phase.q - SETOFF[i]) / (1 - SWEEP));
    // Swung out of its straight way, most at half way.
    const swing = Math.sin(Math.PI * e) * ARC;
    project(F[j] + (G[k] - F[j]) * e + (R1[i] - 0.5) * 2 * swing,
      F[j + 1] + (G[k + 1] - F[j + 1]) * e + (R2[i] - 0.5) * 1.4 * swing,
      F[j + 2] + (G[k + 2] - F[j + 2]) * e + (R3[i] - 0.5) * 2 * swing);
  }
  const forms = () => [formAt(cur).P, to >= 0 ? formAt(to).P : null];

  /** Every speck straight to its place: the still drawing. */
  function settle(t) {
    turnTo(t);
    const [F, G] = forms();
    for (let i = 0; i < N; i++) {
      target(i, F, G);
      X[i] = out[0]; Y[i] = out[1];
      VX[i] = 0; VY[i] = 0;
      keep(i, out[2]);
    }
  }
  function keep(i, near) {
    A[i] = 0.28 + 0.72 * near;
    Z[i] = 0.75 + near * 0.9;
  }

  // ============================================================
  // THE LOCI. Each gathers the specks nearest a speck picked at random,
  // joins each of them to its nearest few, and fills faintly the
  // triangles those lines close — all worked out once, when it comes, so
  // it turns with the form as one piece rather than flickering; a line
  // pulled too long (the specks going different ways in a
  // transformation) is let go.
  // ============================================================
  const loci = [];
  const pick = stream(4099);
  /** On the shape itself, never in the haze round it. */
  const onIt = (loose, i) => !loose[SLOT[i]] && A[i] >= 0.3;
  function locus(born) {
    const loose = formAt(cur).loose;
    let anchor = -1;
    for (let tries = 0; tries < 40; tries++) {
      const c = Math.floor(pick() * N);
      if (onIt(loose, c) && A[c] > 0.35) { anchor = c; break; }
    }
    if (anchor < 0) return null;
    // Its company: specks round it, never nearer each other than
    // `LOCUS_GAP`, so the triangles they make are open rather than a knot.
    const near = [];
    for (let i = 0; i < N; i++) {
      if (!onIt(loose, i)) continue;
      const d = Math.hypot(X[i] - X[anchor], Y[i] - Y[anchor]);
      if (d < LOCUS_FROM) near.push([d + pick() * 20, i]);
    }
    near.sort((a, b) => a[0] - b[0]);
    const who = [];
    for (const [, i] of near) {
      if (who.every((j) => Math.hypot(X[i] - X[j], Y[i] - Y[j]) >= LOCUS_GAP)) who.push(i);
      if (who.length >= LOCUS_SIZE) break;
    }
    if (who.length < 4) return null;
    const links = new Set();
    who.forEach((a) => {
      who.filter((b) => b !== a)
        .map((b) => [Math.hypot(X[a] - X[b], Y[a] - Y[b]), b])
        .sort((p, q) => p[0] - q[0]).slice(0, LOCUS_LINKS)
        .forEach(([, b]) => links.add(a < b ? a + ":" + b : b + ":" + a));
    });
    const pairs = [...links].map((s) => s.split(":").map(Number));
    const tris = [];
    const has = (a, b) => links.has(a < b ? a + ":" + b : b + ":" + a);
    pairs.forEach(([a, b]) => who.forEach((c) => {
      if (c > b && c > a && has(a, c) && has(b, c)) tris.push([a, b, c]);
    }));
    return { who, pairs, tris, born, life: LOCUS_LIFE * (0.8 + pick() * 0.4) };
  }

  // ============================================================
  // THE SPANS: a triangle across the whole form, its three corners specks
  // on the shape well apart and none of its angles narrow — each angle
  // marked with a small arc, one of them written out in degrees.
  // ============================================================
  const spans = [];
  const angleAt = (a, b, c) => {
    const ux = X[b] - X[a], uy = Y[b] - Y[a], vx = X[c] - X[a], vy = Y[c] - Y[a];
    return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy) || 1))));
  };
  function span(born) {
    const loose = formAt(cur).loose, some = [];
    for (let tries = 0; tries < 400 && some.length < 90; tries++) {
      const c = Math.floor(pick() * N);
      if (onIt(loose, c) && A[c] > 0.4) some.push(c);
    }
    const fits = (a, b) => { const d = Math.hypot(X[a] - X[b], Y[a] - Y[b]); return d >= SPAN_NEAR && d <= SPAN_FAR; };
    for (let tries = 0; tries < 300 && some.length > 3; tries++) {
      const a = some[Math.floor(pick() * some.length)], b = some[Math.floor(pick() * some.length)], c = some[Math.floor(pick() * some.length)];
      if (a === b || b === c || a === c || !fits(a, b) || !fits(b, c) || !fits(a, c)) continue;
      if (Math.min(angleAt(a, b, c), angleAt(b, c, a), angleAt(c, a, b)) < SPAN_ANGLE) continue;
      return { who: [a, b, c], born, life: SPAN_LIFE * (0.85 + pick() * 0.3), writ: Math.floor(pick() * 3) };
    }
    return null;
  }
  function tendLoci(t) {
    for (let k = loci.length - 1; k >= 0; k--) if (t - loci[k].born > loci[k].life) loci.splice(k, 1);
    // One at a time, staggered, never all together.
    if (loci.length < LOCI && (!loci.length || t - loci[loci.length - 1].born > LOCUS_LIFE / LOCI)) {
      const l = locus(t);
      if (l) loci.push(l);
    }
    for (let k = spans.length - 1; k >= 0; k--) if (t - spans[k].born > spans[k].life) spans.splice(k, 1);
    // Only across a form that is standing, never one on its way.
    if (!phase.morph && t - since > 900 && spans.length < SPANS && (!spans.length || t - spans[spans.length - 1].born > SPAN_LIFE / SPANS)) {
      const s = span(t);
      if (s) spans.push(s);
    }
  }

  // ============================================================
  // THE POINTER over the field parts the specks.
  // ============================================================
  let px = -1e4, py = -1e4;
  field.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top;
    wake();
  });
  field.addEventListener("pointerleave", () => { px = -1e4; py = -1e4; });

  // ============================================================
  // DRAWING
  // ============================================================
  let W = 0, H = 0, ratio = 1, S = 1, CX = 0, CY = 0;
  function size() {
    const r = field.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const first = !N;
    const was = [W, H];
    W = w; H = h;
    ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
    canvas.width = Math.round(W * ratio);
    canvas.height = Math.round(H * ratio);
    S = Math.min(W * 0.42, H * 0.34);
    CX = W / 2; CY = H * 0.47;
    if (first) make(COUNT());
    else if (was[0] && was[1]) {
      for (let i = 0; i < N; i++) { X[i] *= W / was[0]; Y[i] *= H / was[1]; }
    }
    if (still) { settle(0); stillLoci(); }
    draw(performance.now());
  }

  /** THE FRAME the form turns in: the equator it turns round — dashed,
      and ticked every thirty degrees, the ticks turning with the form —
      and the axis through it, with a short bar at each end. */
  function drawFrame() {
    g.lineWidth = 1 / ratio;
    g.strokeStyle = "rgba(" + INK + "," + FRAME_INK + ")";
    g.setLineDash([2, 5]);
    g.beginPath();
    for (let k = 0; k <= 96; k++) {
      const a = (k / 96) * TAU;
      project(Math.cos(a) * EQUATOR, 0, Math.sin(a) * EQUATOR);
      if (k) g.lineTo(out[0], out[1]); else g.moveTo(out[0], out[1]);
    }
    g.stroke();
    project(0, -EQUATOR, 0);
    const ax = out[0], ay = out[1];
    project(0, EQUATOR, 0);
    const bx = out[0], by = out[1];
    g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
    g.setLineDash([]);
    g.beginPath();
    g.moveTo(ax - 4, ay); g.lineTo(ax + 4, ay);
    g.moveTo(bx - 4, by); g.lineTo(bx + 4, by);
    g.stroke();
    // The ticks, set on the form's own turning: nearer ones plainer.
    for (let k = 0; k < EQUATOR_TICKS; k++) {
      const a = (k / EQUATOR_TICKS) * TAU - spin;
      project(Math.cos(a) * EQUATOR, 0, Math.sin(a) * EQUATOR);
      const x0 = out[0], y0 = out[1], near = out[2];
      project(Math.cos(a) * (EQUATOR + 0.05), 0, Math.sin(a) * (EQUATOR + 0.05));
      g.strokeStyle = "rgba(" + INK + "," + (FRAME_INK * (0.6 + near * 1.4)).toFixed(3) + ")";
      g.beginPath(); g.moveTo(x0, y0); g.lineTo(out[0], out[1]); g.stroke();
    }
  }

  /** A span: its sides, its faint fill, an arc in each corner, a small
      open square on each corner, and one angle written out beside its arc. */
  function drawSpan(s, e) {
    const [a, b, c] = s.who;
    const k = Math.min(A[a], A[b], A[c]) * e;
    g.fillStyle = "rgba(" + INK + "," + (0.028 * k).toFixed(3) + ")";
    g.strokeStyle = "rgba(" + INK + "," + (0.34 * k).toFixed(3) + ")";
    g.beginPath(); g.moveTo(X[a], Y[a]); g.lineTo(X[b], Y[b]); g.lineTo(X[c], Y[c]); g.closePath();
    g.fill();
    g.stroke();
    [[a, b, c], [b, c, a], [c, a, b]].forEach(([p, q, r], n) => {
      const from = Math.atan2(Y[q] - Y[p], X[q] - X[p]);
      let sweep = Math.atan2(Y[r] - Y[p], X[r] - X[p]) - from;
      while (sweep > Math.PI) sweep -= TAU;
      while (sweep < -Math.PI) sweep += TAU;
      g.beginPath();
      g.arc(X[p], Y[p], SPAN_ARC, from, from + sweep, sweep < 0);
      g.stroke();
      g.strokeRect(X[p] - 2.5, Y[p] - 2.5, 5, 5);
      if (n !== s.writ) return;
      const mid = from + sweep / 2;
      g.font = "9px " + MONO;
      g.textBaseline = "middle";
      g.textAlign = "center";
      g.fillStyle = "rgba(" + INK + "," + (0.55 * k).toFixed(3) + ")";
      g.fillText(Math.round((Math.abs(sweep) * 180) / Math.PI) + "°", X[p] + Math.cos(mid) * (SPAN_ARC + 12), Y[p] + Math.sin(mid) * (SPAN_ARC + 12));
    });
  }

  function draw(t) {
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, W, H);
    turnTo(t);
    drawFrame();
    // THE LOCI: their triangles first, faint, then their lines.
    g.lineWidth = 1 / ratio;
    const reach2 = LOCUS_REACH * LOCUS_REACH;
    const lit = new Map();
    const env = (born, life, fade) => {
      const age = still ? fade : t - born;
      const v = Math.min(1, age / fade, (life - age) / fade);
      return v <= 0 ? 0 : v * v * (3 - 2 * v);
    };
    loci.forEach((l) => {
      const e = env(l.born, l.life, LOCUS_FADE);
      if (!e) return;
      l.who.forEach((i) => lit.set(i, Math.max(lit.get(i) || 0, e)));
      l.tris.forEach(([a, b, c]) => {
        const far = Math.max((X[a] - X[b]) ** 2 + (Y[a] - Y[b]) ** 2, (X[b] - X[c]) ** 2 + (Y[b] - Y[c]) ** 2, (X[a] - X[c]) ** 2 + (Y[a] - Y[c]) ** 2);
        if (far > reach2 * 0.5) return;
        g.fillStyle = "rgba(" + INK + "," + (LOCUS_FILL * e * Math.min(A[a], A[b], A[c])).toFixed(3) + ")";
        g.beginPath(); g.moveTo(X[a], Y[a]); g.lineTo(X[b], Y[b]); g.lineTo(X[c], Y[c]); g.closePath(); g.fill();
      });
      l.pairs.forEach(([a, b]) => {
        const d2 = (X[a] - X[b]) ** 2 + (Y[a] - Y[b]) ** 2;
        if (d2 > reach2) return;
        const k = (1 - Math.sqrt(d2) / LOCUS_REACH) * Math.min(A[a], A[b]) * 0.62 * e;
        if (k < 0.01) return;
        g.strokeStyle = "rgba(" + INK + "," + k.toFixed(3) + ")";
        g.beginPath(); g.moveTo(X[a], Y[a]); g.lineTo(X[b], Y[b]); g.stroke();
      });
    });
    // THE SPANS, over the loci.
    spans.forEach((s) => {
      const e = env(s.born, s.life, SPAN_FADE);
      if (e) drawSpan(s, e);
    });
    // THE SPECKS, as they were last told — the ones in a locus a little
    // larger and plainer, as the corners of a drawing are.
    g.fillStyle = "rgb(" + INK + ")";
    for (let i = 0; i < N; i++) {
      let a = A[i];
      const x = X[i], y = Y[i];
      const dx = x - px, dy = y - py, d2 = dx * dx + dy * dy;
      if (d2 < PART * PART) a = Math.min(1, a + (1 - Math.sqrt(d2) / PART) * 0.5);
      const on = lit.get(i) || 0;
      if (on) a = Math.min(1, a + 0.25 * on);
      if (a <= 0.01) continue;
      g.globalAlpha = Math.min(1, a * 0.8);
      const s = 1.2 * Z[i] * (1 + on * 0.6);
      g.fillRect(x - s / 2, y - s / 2, s, s);
    }
    g.globalAlpha = 1;
  }

  let T0 = -1;
  function step(t) {
    if (T0 < 0) T0 = t;
    tick(t);
    caption();
    turnTo(t);
    const [F, G] = forms();
    for (let i = 0; i < N; i++) {
      target(i, F, G);
      keep(i, out[2]);
      const k = SPRING * (0.7 + 0.6 * R3[i]);
      VX[i] = (VX[i] + (out[0] - X[i]) * k) * DAMP;
      VY[i] = (VY[i] + (out[1] - Y[i]) * k) * DAMP;
      // The pointer parts them.
      const dx = X[i] - px, dy = Y[i] - py, d2 = dx * dx + dy * dy;
      if (d2 < PART * PART && d2 > 0.01) {
        const d = Math.sqrt(d2), f = (1 - d / PART) * 1.8;
        VX[i] += (dx / d) * f; VY[i] += (dy / d) * f;
      }
      X[i] += VX[i]; Y[i] += VY[i];
    }
    if (t - T0 > ARRIVE * 0.8) tendLoci(t);
  }

  /** With reduced motion, the loci and the spans stand where they would, once. */
  function stillLoci() {
    loci.length = 0;
    spans.length = 0;
    for (let k = 0; k < LOCI; k++) { const l = locus(0); if (l) loci.push(l); }
    for (let k = 0; k < SPANS; k++) { const s = span(0); if (s) spans.push(s); }
  }

  let frame = 0, seen = true;
  function loop(t) {
    frame = 0;
    if (!seen) return;
    step(t);
    draw(t);
    frame = requestAnimationFrame(loop);
  }
  function wake() {
    if (still || frame || !seen) return;
    frame = requestAnimationFrame(loop);
  }
  // Only while it is on the window.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      seen = entries[entries.length - 1].isIntersecting;
      if (seen) wake();
    }).observe(field);
  }
  if ("ResizeObserver" in window) new ResizeObserver(size).observe(field);
  else window.addEventListener("resize", size);

  size();
  tick(performance.now());
  caption();
  field.classList.add("is-drawn");
  if (still) { settle(0); stillLoci(); draw(0); }
  else wake();
})();

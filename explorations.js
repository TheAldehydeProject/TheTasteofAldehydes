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
//   research you hover, but rather to transform from one to another in
//   the span of 12.5 seconds, then stay in their form for 5 and then
//   start transforming again into the next one ... I want these eto look
//   mathematical and abstract, as well as made from particles with some
//   loci where you have geometric elements (such as triangles from the
//   connected dots)"
//
// So the field keeps ITS OWN TIME and the table no longer conducts it.
// It stands in one FORM for `HOLD` (5s), then TRANSFORMS into the next
// over `MORPH` (12.5s) — every speck travelling from its place in the one
// to its place in the other, the ones at the top setting off first, each
// swinging a little out of its straight way — and round again (`CYCLE`).
// Every form is a cloud of specks round a mathematical shape, standing in
// three dimensions and turning slowly about a tilted axis, the nearer
// specks larger and darker. And here and there on it, THE LOCI: a few
// specks joined each to its nearest by hairlines, the triangles they make
// faintly filled, each locus coming up, standing a while and going.
//
// THE CYCLE, which the owner chose to keep: the galaxy (the ring with
// dust inside it, first, as it was), the sphere, the trefoil knot, the
// torus, the helix, the spiral and the gas cloud (made bigger, and
// churning). The cube is gone. Every other shape in SHAPES is a CANDIDATE
// the owner was shown to choose from — `?form=<name>` holds any one of
// them still on the page — and the ones not chosen come out.
//
// With reduced motion nothing moves: the galaxy is simply there, drawn
// once. The pointer over the field parts the specks near it.
// ============================================================
(function () {
  const field = document.querySelector(".re-field");
  const canvas = field && field.querySelector(".re-canvas");
  if (!canvas) return;
  const g = canvas.getContext("2d");
  if (!g) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INK = "23, 23, 15";            // --ink
  const TAU = Math.PI * 2;

  const COUNT = () => (window.innerWidth < 700 ? 1300 : 2400);
  const HOLD = 5000;                   // ms a form stands
  const MORPH = 12500;                 // ms a form takes to become the next
  const ARRIVE = 1600;                 // ms the first form takes to gather, before its hold
  const SWEEP = 0.5;                   // of a transformation, over which the specks set off in turn
  const ARC = 0.24;                    // how far out of its straight way a speck swings on the way
  const SPRING = 0.045;                // how hard a speck is drawn to its place
  const DAMP = 0.84;                   // and how much of its way it keeps
  const PART = 74;                     // px the pointer parts the specks within
  const SPIN = 0.00012;                // radians a millisecond the whole field turns
  const TILT = 0.38;                   // radians its axis leans towards you
  const FOCAL = 3.2;                   // the perspective: larger is flatter
  const HAZE = 0.1;                    // share of every form's specks left loose round it
  // THE LOCI: "some loci where you have geometric elements (such as
  // triangles from the connected dots)".
  const LOCI = 5;                      // standing at once
  const LOCUS_LIFE = 7600;             // ms each stands, coming and going
  const LOCUS_FADE = 1400;             // ms of that coming up, and going
  const LOCUS_SIZE = 13;               // specks to a locus
  const LOCUS_LINKS = 3;               // each joined to its nearest three
  const LOCUS_FROM = 84;               // px round its anchor it gathers from
  const LOCUS_GAP = 17;                // px, the least between two of its specks
  const LOCUS_REACH = 96;              // px beyond which a line is let go

  // THE CYCLE, in the order it comes round; the first is where it starts.
  const CYCLE = ["galaxy", "sphere", "knot", "torus", "helix", "spiral", "cloud"];
  const NAMES = {
    galaxy: "Galaxy", cloud: "Gas cloud", sphere: "Sphere", knot: "Trefoil knot", torus: "Torus",
    helix: "Helix", spiral: "Spiral",
    // The candidates.
    gyre: "Armillary", saddle: "Saddle", shells: "Nested shells", hourglass: "Double cone",
    lorenz: "Lorenz attractor", aizawa: "Aizawa attractor", rossler: "Rössler attractor",
    mobius: "Möbius strip", klein: "Klein bottle", hopf: "Hopf fibration", lissajous: "Lissajous knot",
    torusknot: "Torus knot (7, 3)", seashell: "Seashell", hyperboloid: "Hyperboloid",
    geodesic: "Geodesic sphere", phyllotaxis: "Phyllotaxis", harmonic: "Spherical harmonic",
    enneper: "Enneper surface", ripple: "Ripple", borromean: "Borromean rings",
    supershape: "Supershape", vortex: "Vortex", gyroid: "Gyroid", helicoid: "Helicoid",
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
  const fib = (k, n) => {
    const y = 1 - (2 * (k + 0.5)) / n, r = Math.sqrt(Math.max(0, 1 - y * y)), th = Math.PI * (3 - Math.sqrt(5)) * k;
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  };
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
  /** Places found once by searching a volume — the gyroid. */
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
  /** The icosahedron's edges, each cut in two and pushed out to the
      sphere — a geodesic of frequency two. Worked out once. */
  let dome = null;
  function geodesic() {
    if (dome) return dome;
    const t = (1 + Math.sqrt(5)) / 2;
    const v = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((p) => { const l = Math.hypot(...p); return p.map((c) => c / l); });
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
  /** A place on a surface's WIREFRAME: along one of `nu` lines one way
      or `nv` the other, so a surface is drawn as a mathematician draws
      one rather than filled. */
  const wire = (i, nu, nv) => {
    const along = more(i, 22);
    return more(i, 21) < 0.5 ? [Math.round(more(i, 23) * nu) / nu, along] : [along, Math.round(more(i, 23) * nv) / nv];
  };
  const superformula = (a, m, n1, n2, n3) =>
    Math.pow(Math.pow(Math.abs(Math.cos((m * a) / 4)), n2) + Math.pow(Math.abs(Math.sin((m * a) / 4)), n3), -1 / n1);

  const SHAPES = {
    // ---------- THE CYCLE ----------
    // THE GALAXY: the ring with dust inside it, as it always was.
    galaxy: { fuzz: 0.035, drift: "float", place(i) {
      if (R2[i] < 0.16) {
        const d = Math.sqrt(R3[i]) * 0.48, a = R1[i] * TAU;
        return [Math.cos(a) * d, (R4[i] - 0.5) * 0.12, Math.sin(a) * d];
      }
      const a = R1[i] * TAU, r = 0.8 + (R3[i] - 0.5) * 0.12;
      return [Math.cos(a) * r, (R4[i] - 0.5) * 0.05, Math.sin(a) * r];
    } },
    // THE GAS CLOUD, "bigger and cooler": four lobes of gas overlapping,
    // two long filaments drawn through them, a few dense knots where
    // something is gathering, and a wide faint halo — churning slowly,
    // the inner part turning faster than the outer.
    cloud: { fuzz: 0, drift: "churn", place(i) {
      const b = more(i, 1), u = more(i, 2), v = more(i, 3), w = more(i, 4), q = more(i, 5);
      if (b < 0.34) {
        // Two wisps curling out of the middle, thickening as they go.
        const t = u, arm = q < 0.5 ? 0 : Math.PI, a = t * TAU * 1.35 + arm;
        const rad = 0.12 + 0.86 * t, th = 0.035 + 0.09 * t;
        return [Math.cos(a) * rad + gauss(v, w) * th, Math.sin(t * Math.PI * 2 + arm) * 0.22 + gauss(w, v) * th * 0.8, Math.sin(a) * rad * 0.8 + gauss(v, u) * th];
      }
      if (b < 0.66) {
        const L = [[0, 0, 0, 0.46, 0.3, 0.42], [-0.52, 0.2, 0.12, 0.32, 0.22, 0.28], [0.5, -0.22, -0.16, 0.34, 0.22, 0.3], [0.12, 0.36, -0.36, 0.26, 0.2, 0.22]][Math.floor(q * 4)];
        return [L[0] + gauss(u, v) * L[3], L[1] + gauss(v, w) * L[4], L[2] + gauss(w, u) * L[5]];
      }
      if (b < 0.8) {
        const t = u, one = q < 0.5;
        const c = one ? [-1.05 + 2.1 * t, 0.38 * Math.sin(Math.PI * t * 1.3) - 0.12, 0.34 * Math.cos(Math.PI * t)]
          : [0.62 * Math.cos(3 * t + 1), -0.62 + 1.1 * t, 0.52 * Math.sin(2 * t)];
        const th = 0.05 + 0.04 * Math.sin(t * 9);
        return [c[0] + gauss(v, w) * th, c[1] + gauss(w, v) * th, c[2] + gauss(v, u) * th];
      }
      if (b < 0.9) {
        const K = [[-0.3, -0.1, 0.2], [0.26, 0.12, -0.1], [0.62, -0.3, 0.1], [-0.62, 0.3, -0.1], [0.05, 0.42, -0.4], [-0.1, -0.45, 0.3]][Math.floor(q * 6)];
        return [K[0] + gauss(u, v) * 0.045, K[1] + gauss(v, w) * 0.045, K[2] + gauss(w, u) * 0.045];
      }
      return [gauss(u, v) * 0.78, gauss(v, w) * 0.55, gauss(w, u) * 0.7];
    } },
    sphere: { fuzz: 0.03, place(i) {
      const [x, y, z] = fib(i, N);
      const r = R2[i] < 0.1 ? 0.3 * Math.cbrt(R3[i]) : 0.78;
      return [x * r, y * r, z * r];
    } },
    knot: { fuzz: 0.05, place(i) {
      const t = R1[i] * TAU, k = 0.25;
      return [(Math.sin(t) + 2 * Math.sin(2 * t)) * k, (Math.cos(t) - 2 * Math.cos(2 * t)) * k, -Math.sin(3 * t) * k * 1.4];
    } },
    // Tipped over at an angle, so it is neither the galaxy lying down nor,
    // turned edge on, a band standing up like the helix.
    torus: { fuzz: 0.03, place(i) {
      const u = R1[i] * TAU, v = R2[i] * TAU, R = 0.56, r = 0.24, tip = 0.95;
      const x = (R + r * Math.cos(v)) * Math.cos(u), y = r * Math.sin(v), z = (R + r * Math.cos(v)) * Math.sin(u);
      return [x, y * Math.cos(tip) - z * Math.sin(tip), y * Math.sin(tip) + z * Math.cos(tip)];
    } },
    helix: { fuzz: 0.03, place(i) {
      const s = R1[i], strand = i % 2;
      if (R2[i] < 0.12) {
        // A rung across, now and then.
        const s2 = Math.round(s * 18) / 18, a = s2 * TAU * 2.5, u = R3[i];
        const x0 = Math.cos(a) * 0.42, z0 = Math.sin(a) * 0.42;
        return [x0 * (1 - 2 * u), (s2 - 0.5) * 1.6, z0 * (1 - 2 * u)];
      }
      const a = s * TAU * 2.5 + strand * Math.PI;
      return [Math.cos(a) * 0.42, (s - 0.5) * 1.6, Math.sin(a) * 0.42];
    } },
    // Three arms round a core.
    spiral: { fuzz: 0.02, place(i) {
      if (R2[i] < 0.14) {
        const d = Math.cbrt(R3[i]) * 0.18, [x, y, z] = fib(i, N);
        return [x * d, y * d * 0.6, z * d];
      }
      const arm = i % 3, r = 0.1 + Math.pow(R1[i], 0.7) * 0.8;
      const a = (arm / 3) * TAU + r * 4.2 + gauss(R3[i], R4[i]) * 0.22 / (r + 0.3);
      return [Math.cos(a) * r, gauss(R4[i], R3[i]) * 0.03 * (1 - r), Math.sin(a) * r];
    } },

    // ---------- THE CANDIDATES ----------
    gyre: { fuzz: 0.025, place(i) {
      const a = R1[i] * TAU, r = 0.74, k = i % 3;
      const c = Math.cos(a) * r, s = Math.sin(a) * r;
      return k === 0 ? [c, s, 0] : k === 1 ? [c, 0, s] : [0, c, s];
    } },
    saddle: { fuzz: 0.02, place(i) {
      const a = R1[i] * TAU, d = Math.sqrt(R2[i]) * 0.78;
      const x = Math.cos(a) * d, z = Math.sin(a) * d;
      return [x, (x * x - z * z) * 1.1, z];
    } },
    shells: { fuzz: 0.025, place(i) {
      const k = i % 3, [x, y, z] = fib(Math.floor(i / 3), Math.ceil(N / 3));
      const r = [0.3, 0.56, 0.82][k];
      return [x * r, y * r, z * r];
    } },
    hourglass: { fuzz: 0.025, place(i) {
      const h = R1[i] * 2 - 1, r = Math.abs(h) * 0.58, a = R2[i] * TAU;
      return [Math.cos(a) * r, h * 0.78, Math.sin(a) * r];
    } },
    // The butterfly: where a point goes under Lorenz's three equations.
    lorenz: { fuzz: 0.006, fit: true, place(i) {
      const P = trace("lorenz", ([x, y, z]) => [10 * (y - x), x * (28 - z) - y, x * y - (8 / 3) * z],
        [0.1, 0, 0], 0.005, 26000, 1, 1500, ([x, y, z]) => [x, -(z - 25), y * 0.3]);
      return P[Math.floor((i / N) * P.length)].slice();
    } },
    aizawa: { fuzz: 0.01, fit: true, place(i) {
      const [a, b, c, d, e, f] = [0.95, 0.7, 0.6, 3.5, 0.25, 0.1];
      const P = trace("aizawa", ([x, y, z]) => [(z - b) * x - d * y, d * x + (z - b) * y,
        c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x],
      [0.1, 0, 0], 0.008, 24000, 2, 3000, ([x, y, z]) => [x, -z, y]);
      return P[Math.floor((i / N) * P.length)].slice();
    } },
    rossler: { fuzz: 0.012, fit: true, turn: [0.5, 0, 0], place(i) {
      const P = trace("rossler", ([x, y, z]) => [-y - z, x + 0.2 * y, 0.2 + z * (x - 5.7)],
        [0.1, 0, 0], 0.01, 24000, 2, 3000, ([x, y, z]) => [x, -z * 0.35, y]);
      return P[Math.floor((i / N) * P.length)].slice();
    } },
    // Drawn as its rulings — straight lines across it — and its one edge.
    mobius: { fuzz: 0.008, fit: true, place(i) {
      const edge = more(i, 24) < 0.35;
      const u = edge ? R1[i] * TAU * 2 : (Math.round(R1[i] * 44) / 44) * TAU;
      const v = edge ? 0.45 : (R2[i] * 2 - 1) * 0.45;
      const r = 1 + v * Math.cos(u / 2);
      return [r * Math.cos(u), v * Math.sin(u / 2), r * Math.sin(u)];
    } },
    klein: { fuzz: 0.006, fit: true, turn: [0, 0, Math.PI / 2], place(i) {
      const [wu, wv] = wire(i, 26, 14), u = wu * Math.PI, v = wv * TAU;
      const cu = Math.cos(u), su = Math.sin(u), cv = Math.cos(v), sv = Math.sin(v);
      const x = (-2 / 15) * cu * (3 * cv - 30 * su + 90 * cu ** 4 * su - 60 * cu ** 6 * su + 5 * cu * cv * su);
      const y = (-1 / 15) * su * (3 * cv - 3 * cu ** 2 * cv - 48 * cu ** 4 * cv + 48 * cu ** 6 * cv - 60 * su + 5 * cu * cv * su
        - 5 * cu ** 3 * cv * su - 80 * cu ** 5 * cv * su + 80 * cu ** 7 * cv * su);
      const z = (2 / 15) * (3 + 5 * cu * su) * sv;
      return [x, y, z];
    } },
    // The fibres of one torus of the Hopf fibration: circles lying on a
    // torus (its Villarceau circles), every one linked through every other.
    hopf: { fuzz: 0.012, place(i) {
      const R = 0.58, r = 0.32, th = Math.asin(r / R), ph = ((i % 16) / 16) * TAU, s = R1[i] * TAU;
      const x = R * Math.cos(s) * Math.cos(th), y = r + R * Math.sin(s), z = R * Math.cos(s) * Math.sin(th);
      return [x * Math.cos(ph) - y * Math.sin(ph), z, x * Math.sin(ph) + y * Math.cos(ph)];
    } },
    lissajous: { fuzz: 0.03, place(i) {
      const t = R1[i] * TAU;
      return [Math.sin(3 * t + 0.4) * 0.74, Math.sin(4 * t + 1.1) * 0.74, Math.sin(5 * t) * 0.74];
    } },
    torusknot: { fuzz: 0.028, place(i) {
      const t = R1[i] * TAU, r = 0.52 + 0.22 * Math.cos(3 * t), tip = 0.85;
      const x = r * Math.cos(7 * t), y = 0.22 * Math.sin(3 * t), z = r * Math.sin(7 * t);
      return [x, y * Math.cos(tip) - z * Math.sin(tip), y * Math.sin(tip) + z * Math.cos(tip)];
    } },
    seashell: { fuzz: 0.006, fit: true, turn: [0.25, 0, 0], place(i) {
      const [wu, wv] = wire(i, 64, 10), u = Math.sqrt(wu), th = u * 4.5 * TAU, v = wv * TAU;
      const r = 0.03 + 0.24 * u, rc = 0.05 + 0.42 * u, y = 0.75 - 1.45 * u;
      return [(rc + r * Math.cos(v)) * Math.cos(th), y + r * Math.sin(v), (rc + r * Math.cos(v)) * Math.sin(th)];
    } },
    // Straight lines, two families of them, crossing into a waist.
    hyperboloid: { fuzz: 0.01, place(i) {
      if (R3[i] < 0.12) {
        const a = R1[i] * TAU, top = R2[i] < 0.5;
        return [Math.cos(a) * 0.62, top ? -0.8 : 0.8, Math.sin(a) * 0.62];
      }
      const fam = i % 2 ? 1 : -1, k = Math.floor(R2[i] * 28), a = (k / 28) * TAU, t = R1[i];
      return lerp3([Math.cos(a) * 0.62, -0.8, Math.sin(a) * 0.62], [Math.cos(a + fam * 2.2) * 0.62, 0.8, Math.sin(a + fam * 2.2) * 0.62], t);
    } },
    geodesic: { fuzz: 0.008, place(i) {
      const E = geodesic(), [a, b] = E[i % E.length];
      const t = R3[i] < 0.14 ? Math.round(R1[i]) : R1[i];
      return lerp3(a, b, t).map((c) => c * 0.8);
    } },
    // The seeds of a sunflower, on a dome: every one turned the golden
    // angle from the one before.
    phyllotaxis: { fuzz: 0.004, turn: [-1.25, 0, 0], place(i) {
      const r = Math.sqrt((i + 0.5) / N) * 0.86, th = i * Math.PI * (3 - Math.sqrt(5));
      const h = 0.5 * Math.sqrt(Math.max(0, 1 - (r / 0.86) ** 2)) - 0.18;
      return [r * Math.cos(th), -h, r * Math.sin(th)];
    } },
    harmonic: { fuzz: 0.012, place(i) {
      const [x, y, z] = fib(i, N);
      const th = Math.acos(y), ph = Math.atan2(z, x);
      const r = 0.28 + 1.55 * Math.abs(Math.sin(th) ** 3 * Math.cos(th) * Math.cos(3 * ph));
      return [x * r, y * r, z * r];
    } },
    enneper: { fuzz: 0.006, fit: true, place(i) {
      const [wr, wa] = wire(i, 9, 28), rho = wr * 1.25, a = wa * TAU, u = rho * Math.cos(a), v = rho * Math.sin(a);
      return [u - (u * u * u) / 3 + u * v * v, u * u - v * v, v - (v * v * v) / 3 + v * u * u];
    } },
    // Rings on a still surface, dying away from where it was touched.
    ripple: { fuzz: 0.008, place(i) {
      const rho = (Math.round(R1[i] * 17) + R3[i] * 0.2) / 17 * 0.9, a = R2[i] * TAU;
      const h = 0.2 * Math.cos(rho * 15) * Math.exp(-rho * 1.7);
      return [rho * Math.cos(a), -h, rho * Math.sin(a)];
    } },
    borromean: { fuzz: 0.025, place(i) {
      const k = i % 3, t = R1[i] * TAU, a = 0.8, b = 0.42;
      const c = Math.cos(t) * a, s = Math.sin(t) * b;
      return k === 0 ? [c, s, 0] : k === 1 ? [0, c, s] : [s, 0, c];
    } },
    supershape: { fuzz: 0.006, fit: true, place(i) {
      const [wt, wp] = wire(i, 36, 14), th = (wt * 2 - 1) * Math.PI, ph = (wp - 0.5) * Math.PI;
      const r1 = superformula(th, 6, 1, 1.4, 1.4), r2 = superformula(ph, 3, 1, 1.4, 1.4);
      return [r1 * Math.cos(th) * r2 * Math.cos(ph), r2 * Math.sin(ph), r1 * Math.sin(th) * r2 * Math.cos(ph)];
    } },
    vortex: { fuzz: 0.015, drift: "whirl", place(i) {
      const h = R1[i] * 2 - 1, r = 0.07 + 0.62 * Math.pow((h + 1) / 2, 1.6), a = R2[i] * TAU + h * 5;
      return [r * Math.cos(a), -h * 0.8, r * Math.sin(a)];
    } },
    gyroid: { fuzz: 0.006, place(i) {
      const P = pool("gyroid", N, 71, (rnd) => {
        const x = (rnd() * 2 - 1) * 0.8, y = (rnd() * 2 - 1) * 0.8, z = (rnd() * 2 - 1) * 0.8;
        if (x * x + y * y + z * z > 0.64) return null;
        const k = 5.2;
        const v = Math.sin(k * x) * Math.cos(k * y) + Math.sin(k * y) * Math.cos(k * z) + Math.sin(k * z) * Math.cos(k * x);
        return Math.abs(v) < 0.06 ? [x, y, z] : null;
      });
      return P[i % P.length].slice();
    } },
    helicoid: { fuzz: 0.012, place(i) {
      const u = (R1[i] * 2 - 1) * 2.3 * Math.PI, v = (R2[i] * 2 - 1) * 0.62;
      return [v * Math.cos(u), u * 0.105, v * Math.sin(u)];
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
      // The galaxy and the gas cloud are haze already.
      if (name !== "cloud" && name !== "galaxy" && R4[i] < HAZE) { loose[i] = 1; raw.push(null); continue; }
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
        // The haze round every form: the cloud, wider and fainter.
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
    const form = { name, P, perm, rank, loose, drift: shape.drift || "" };
    made.set(name, form);
    return form;
  }

  // ============================================================
  // WHICH FORM, AND WHEN. `?form=<name>` holds one form still on the page
  // (how the candidates were shown to the owner); otherwise THE CYCLE.
  // ============================================================
  const asked = new URLSearchParams(window.location.search).get("form");
  const held = asked && SHAPES[asked] ? asked : "";
  const cycle = held ? [held] : CYCLE;
  field.dataset.cycle = cycle.join(",");
  let T0 = -1;                         // when the first form began to gather
  let applied = 0;                     // transformations the specks have made
  let phase = { k: 0, morph: false, q: 0 };
  /** Where in the cycle the clock stands: holding form `k`, or on its way
      from form `k` to the next, `q` of the way through. */
  function when(t) {
    if (cycle.length < 2 || still) return { k: 0, morph: false, q: 0 };
    const s = t - T0 - ARRIVE - HOLD;
    if (s < 0) return { k: 0, morph: false, q: (t - T0) / (ARRIVE + HOLD) };
    const lap = MORPH + HOLD, n = Math.floor(s / lap), r = s - n * lap;
    return r < MORPH ? { k: n, morph: true, q: r / MORPH } : { k: n + 1, morph: false, q: (r - MORPH) / HOLD };
  }
  const formAt = (k) => formOf(cycle[((k % cycle.length) + cycle.length) % cycle.length]);
  /** The pairing for the transformation out of form `k`: where each speck
      goes, and when in it it sets off — the top first, and the rest in
      turn with a little of each speck's own. */
  function pair(k) {
    const from = formAt(k), to = formAt(k + 1);
    for (let i = 0; i < N; i++) {
      const r = from.rank[SLOT[i]];
      NEXT[i] = to.perm[r];
      SETOFF[i] = (0.62 * (r / N) + 0.38 * more(i, 11)) * SWEEP;
    }
  }
  let paired = -1;
  /** Bring the specks' places up to the clock: every transformation
      already finished is taken, however many (a window left hidden). */
  function keepUp(p) {
    // Holding form k, or setting out from it, the specks have made k.
    while (applied < p.k) {
      pair(applied);
      SLOT.set(NEXT);
      applied++;
    }
    if (p.morph && paired !== p.k) { pair(p.k); paired = p.k; }
  }

  // ============================================================
  // THE CAPTION under the drawing: which form, and a hairline filling as
  // it holds or turns into the next.
  // ============================================================
  const capNo = field.querySelector(".re-caption-no");
  const capName = field.querySelector(".re-caption-name");
  const capKind = field.querySelector(".re-caption-kind");
  const cap = field.querySelector(".re-caption");
  const run = document.createElement("span");
  run.className = "re-run";
  run.setAttribute("aria-hidden", "true");
  run.appendChild(document.createElement("i"));
  if (cap) cap.appendChild(run);
  let said = "";
  function caption(p) {
    const at = ((p.k % cycle.length) + cycle.length) % cycle.length;
    const now = cycle[at], next = cycle[(at + 1) % cycle.length];
    field.style.setProperty("--run", Math.max(0, Math.min(1, p.q)).toFixed(3));
    const say = p.morph ? now + ">" + next : now;
    if (say === said) return;
    said = say;
    field.dataset.figure = p.morph ? next : now;
    field.dataset.phase = p.morph ? "morph" : "hold";
    if (!capName) return;
    capNo.textContent = String((p.morph ? (at + 1) % cycle.length : at) + 1).padStart(2, "0") + " / " + String(cycle.length).padStart(2, "0");
    capName.textContent = p.morph ? NAMES[now] + " → " + NAMES[next] : NAMES[now];
    capKind.textContent = held ? "Held" : p.morph ? "Transforming" : "Holding";
  }

  // ============================================================
  // TURNING AND SEEING: a place in a form, turned about the tilted axis by
  // the clock and seen in perspective. Out: where on the field, and how
  // near (0 far, 1 near).
  // ============================================================
  const out = new Float32Array(3);
  const at3 = new Float32Array(3);
  let cosA = 1, sinA = 0;
  const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
  function turnTo(t) {
    const a = still ? 0.6 : t * SPIN;
    cosA = Math.cos(a); sinA = Math.sin(a);
  }
  /** Where place `j` of `form` stands at `t`, drifting as that form does. */
  function placeOf(form, j, t, o, w) {
    let x = form.P[j * 3], y = form.P[j * 3 + 1], z = form.P[j * 3 + 2];
    if (form.drift && !still) {
      if (form.drift === "float") {
        x += Math.sin(t * 0.0003 + R4[j] * 6) * 0.03;
        y += Math.cos(t * 0.00025 + R1[j] * 6) * 0.025;
      } else {
        // The gas cloud churns, and the vortex whirls: turned about the
        // upright axis, faster nearer it.
        const r = Math.hypot(x, z);
        const a = t * (form.drift === "whirl" ? 0.0011 / (r + 0.12) : 0.00016 * (1.6 - Math.min(1.4, r)));
        const c = Math.cos(a), s = Math.sin(a);
        [x, z] = [x * c - z * s, x * s + z * c];
        y += Math.sin(t * 0.0004 + r * 5) * (form.drift === "churn" ? 0.03 : 0);
      }
    }
    o[0] += x * w; o[1] += y * w; o[2] += z * w;
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
  /** Where speck `i` belongs at `t`. */
  function target(i, t, p) {
    at3[0] = 0; at3[1] = 0; at3[2] = 0;
    if (!p.morph) {
      placeOf(formAt(p.k), SLOT[i], t, at3, 1);
    } else {
      const e = ease((p.q - SETOFF[i]) / (1 - SWEEP));
      placeOf(formAt(p.k), SLOT[i], t, at3, 1 - e);
      placeOf(formAt(p.k + 1), NEXT[i], t, at3, e);
      // Swung out of its straight way, most at half way.
      const swing = Math.sin(Math.PI * e) * ARC;
      at3[0] += (R1[i] - 0.5) * 2 * swing; at3[1] += (R2[i] - 0.5) * 1.4 * swing; at3[2] += (R3[i] - 0.5) * 2 * swing;
    }
    project(at3[0], at3[1], at3[2]);
  }

  /** Every speck straight to its place: the still drawing. */
  function settle(t) {
    turnTo(t);
    for (let i = 0; i < N; i++) {
      target(i, t, phase);
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
  function locus(born) {
    // On the shape itself, never in the haze round it.
    const form = formAt(phase.k);
    const onIt = (i) => !form.loose[SLOT[i]] && A[i] >= 0.3;
    let anchor = -1;
    for (let tries = 0; tries < 40; tries++) {
      const c = Math.floor(pick() * N);
      if (onIt(c) && A[c] > 0.35) { anchor = c; break; }
    }
    if (anchor < 0) return null;
    // Its company: specks round it, never nearer each other than
    // `LOCUS_GAP`, so the triangles they make are open rather than a knot.
    const near = [];
    for (let i = 0; i < N; i++) {
      if (!onIt(i)) continue;
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
  function tendLoci(t) {
    for (let k = loci.length - 1; k >= 0; k--) if (t - loci[k].born > loci[k].life) loci.splice(k, 1);
    // One at a time, staggered, never all together.
    if (loci.length < LOCI && (!loci.length || t - loci[loci.length - 1].born > LOCUS_LIFE / LOCI)) {
      const l = locus(t);
      if (l) loci.push(l);
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

  function draw(t) {
    g.setTransform(ratio, 0, 0, ratio, 0, 0);
    g.clearRect(0, 0, W, H);
    // THE LOCI: their triangles first, faint, then their lines.
    g.lineWidth = 1 / ratio;
    const reach2 = LOCUS_REACH * LOCUS_REACH;
    const lit = new Map();
    loci.forEach((l) => {
      const age = still ? LOCUS_FADE : t - l.born;
      const env = Math.min(1, age / LOCUS_FADE, (l.life - age) / LOCUS_FADE);
      if (env <= 0) return;
      const e = env * env * (3 - 2 * env);
      l.who.forEach((i) => lit.set(i, Math.max(lit.get(i) || 0, e)));
      l.tris.forEach(([a, b, c]) => {
        const far = Math.max((X[a] - X[b]) ** 2 + (Y[a] - Y[b]) ** 2, (X[b] - X[c]) ** 2 + (Y[b] - Y[c]) ** 2, (X[a] - X[c]) ** 2 + (Y[a] - Y[c]) ** 2);
        if (far > reach2 * 0.5) return;
        g.fillStyle = "rgba(" + INK + "," + (0.06 * e * Math.min(A[a], A[b], A[c])).toFixed(3) + ")";
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

  function step(t) {
    if (T0 < 0) T0 = t;
    phase = when(t);
    keepUp(phase);
    caption(phase);
    turnTo(t);
    for (let i = 0; i < N; i++) {
      target(i, t, phase);
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

  /** With reduced motion, the loci stand where they would, once. */
  function stillLoci() {
    loci.length = 0;
    for (let k = 0; k < LOCI; k++) { const l = locus(0); if (l) loci.push(l); }
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
  caption(phase);
  field.classList.add("is-drawn");
  if (still) { settle(0); stillLoci(); draw(0); }
  else wake();
})();

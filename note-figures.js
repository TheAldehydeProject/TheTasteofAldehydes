// ============================================================
// NOTE FIGURES — the test page's note window (network.js)
//
// The owner, 2026-09-28: "I also want you to add a particle diagram in red
// particles that are show what it is that the note is of. if there is
// grapefruit, make a grapefruit from particles. Do this for all notes.
// make it minimalist and geometric."
//
// So every note in the Note Library has a FIGURE of its own here, written
// out by name in `FIGURES` below: what the note is of, built from a few
// geometric parts —
//
//   LATHE    an outline turned round an upright axis (a pear, a bottle, a
//            cup, a candle, a mushroom, a bell);
//   BALL     a sphere of evenly spread specks, pressed, dimpled, grooved or
//            made rough (a fruit, a berry, a stone, a cloud);
//   PATH     a line of specks with the line drawn under them (a stem, a
//            thread, a wisp of smoke, a root);
//   LEAF and PETAL   an outline with its midrib and veins;
//   BOX, DISC, SHEET, WAVE   for everything made rather than grown;
//
// — and drawn as specks in the page's red over faint hairlines, turning
// slowly on a dashed ring, nearer specks larger and brighter. A note the
// list does not name (one added to the library later) is given a figure of
// its accord's (`BY_ACCORD`), and a test says there is none of those now.
//
// Every figure is built once, the first time it is asked for, from a seed
// of its own name, so the same note is always the same figure.
// ============================================================
(function () {
  "use strict";
  const TAU = Math.PI * 2;
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const jit = (a) => (rnd() - 0.5) * 2 * a;
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 2147483646 + 1; };

  // ============================================================
  // A PART: specks (`d`: x, y, z and a weight) and hairlines (`l`: lines of
  // points). Every builder returns one; `at` moves, turns and sizes one.
  // ============================================================
  const part = (d, l) => ({ d: d || [], l: l || [] });
  function join() {
    const out = part();
    for (let i = 0; i < arguments.length; i++) {
      const p = arguments[i];
      if (!p) continue;
      for (const q of p.d) out.d.push(q);
      for (const q of p.l) out.l.push(q);
    }
    return out;
  }
  /** Sized (s, or sx/sy/sz), turned (rx, then ry, then rz) and moved (x, y, z). */
  function at(p, o) {
    const s = o.s == null ? 1 : o.s;
    const sx = (o.sx == null ? 1 : o.sx) * s, sy = (o.sy == null ? 1 : o.sy) * s, sz = (o.sz == null ? 1 : o.sz) * s;
    const cx = Math.cos(o.rx || 0), snx = Math.sin(o.rx || 0);
    const cy = Math.cos(o.ry || 0), sny = Math.sin(o.ry || 0);
    const cz = Math.cos(o.rz || 0), snz = Math.sin(o.rz || 0);
    const X = o.x || 0, Y = o.y || 0, Z = o.z || 0;
    const f = (q) => {
      let x = q[0] * sx, y = q[1] * sy, z = q[2] * sz;
      let t = y * cx - z * snx; z = y * snx + z * cx; y = t;
      t = x * cy + z * sny; z = -x * sny + z * cy; x = t;
      t = x * cz - y * snz; y = x * snz + y * cz; x = t;
      return q.length > 3 ? [x + X, y + Y, z + Z, q[3]] : [x + X, y + Y, z + Z];
    };
    return part(p.d.map(f), p.l.map((line) => line.map(f)));
  }
  /** Many of one part, each placed by `each(k)`. */
  const many = (n, make, each) => join.apply(null, Array.from({ length: n }, (_, k) => at(make(k), each(k))));

  /** Specks along a line, one every `step`, and the line under them. */
  function path(pts, step, w, bare) {
    const d = [];
    const st = step || 0.06;
    let carry = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      let u = carry;
      while (u <= L) {
        const t = L ? u / L : 0;
        d.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, w || 1]);
        u += st;
      }
      carry = u - L;
    }
    return part(d, bare ? [] : [pts]);
  }
  /** Points along a curve given as a function of 0..1. */
  const curve = (fn, n) => Array.from({ length: (n || 24) + 1 }, (_, k) => fn(k / (n || 24)));
  const bez = (a, b, c, e, n) => curve((t) => {
    const u = 1 - t;
    return [0, 1, 2].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * e[k]);
  }, n);
  const circle = (r, n, y) => curve((t) => [Math.cos(t * TAU) * r, y || 0, Math.sin(t * TAU) * r], n || 36);

  /** A BALL of evenly spread specks: r, pressed by sx/sy/sz; `rough`
      makes it knobbly (at `bumps` to the round), `dent` dimples it top and
      bottom, `pear` narrows it towards the top, `ribs` grooves it from pole
      to pole, `tip` draws its ends to points; `cut` leaves off what lies
      in front of that plane, so a half shows its face. */
  function ball(o) {
    o = o || {};
    const n = o.n || 240, r = o.r || 1, d = [], sx = o.sx || 1, sy = o.sy || 1, sz = o.sz || 1;
    const bumps = o.bumps || 7;
    for (let i = 0; i < n; i++) {
      const y = 1 - (2 * (i + 0.5)) / n;
      const rr = Math.sqrt(1 - y * y), a = i * 2.39996323;
      let x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      let k = 1;
      if (o.rough) k += o.rough * Math.sin(x * bumps + 1.3) * Math.sin(y * bumps * 1.1 + 0.4) * Math.sin(z * bumps * 0.9 + 2.1);
      if (o.ribs) k -= o.ribDepth == null ? 0.06 * Math.pow(Math.abs(Math.cos((Math.atan2(z, x) * o.ribs) / 2)), 8) : o.ribDepth * Math.pow(Math.abs(Math.cos((Math.atan2(z, x) * o.ribs) / 2)), 8);
      if (o.dent) k -= o.dent * Math.exp(-rr * rr * 18);
      let yy = y * k, xx = x * k, zz = z * k;
      if (o.pear) { const f = 1 - o.pear * Math.max(0, yy) * 0.9; xx *= f; zz *= f; }
      if (o.tip) { const f = Math.pow(Math.abs(yy), 6) * o.tip; xx *= 1 - f; zz *= 1 - f; yy *= 1 + f * 0.6; }
      const p = [xx * r * sx, yy * r * sy, zz * r * sz, o.w || 1];
      if (o.cut != null && p[2] > o.cut) continue;
      d.push(p);
    }
    const l = [];
    if (o.lines !== false) {
      l.push(circle(r * sx * (o.pear ? 0.96 : 1), 40).map((q) => [q[0], 0, q[2] * sz / sx]));
      if (o.ribs) for (let m = 0; m < o.ribs; m++) {
        const a = (m / o.ribs) * TAU + TAU / (2 * o.ribs);
        l.push(curve((t) => { const th = -Math.PI / 2 + t * Math.PI; return [Math.cos(th) * Math.cos(a) * r * sx * 0.95, Math.sin(th) * r * sy, Math.cos(th) * Math.sin(a) * r * sz * 0.95]; }, 16));
      }
    }
    return part(d, l);
  }
  /** An outline [[radius, height] ...] turned round the upright axis: a
      ring of specks at every point of it, and a few of its meridians. */
  function lathe(profile, o) {
    o = o || {};
    const seg = o.seg || 18, mer = o.mer == null ? 6 : o.mer, d = [], l = [];
    profile.forEach(([r, y], k) => {
      if (r < 0.012) { d.push([0, y, 0, o.w || 1]); return; }
      const m = Math.max(5, Math.round(seg * Math.min(1.4, r * 1.8 + 0.3)));
      for (let j = 0; j < m; j++) {
        const a = (j / m) * TAU + (k % 2) * (Math.PI / m);
        d.push([Math.cos(a) * r, y, Math.sin(a) * r, o.w || 1]);
      }
      if (o.rings) l.push(circle(r, 32, y));
    });
    for (let j = 0; j < mer; j++) {
      const a = (j / mer) * TAU;
      l.push(profile.map(([r, y]) => [Math.cos(a) * r, y, Math.sin(a) * r]));
    }
    return part(d, l);
  }
  /** A smooth outline from a few [radius, height] points, filled in. */
  function outline(points, n) {
    const out = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i], b = points[i + 1];
      const steps = n || 3;
      for (let k = 0; k < steps; k++) {
        const t = k / steps, s = t * t * (3 - 2 * t);
        out.push([a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * t]);
      }
    }
    out.push(points[points.length - 1]);
    return out;
  }
  const turned = (points, o) => lathe(outline(points, (o && o.steps) || 3), o);

  /** A LEAF in the upright plane, its stalk at the origin and its tip up:
      `shape` lance, oval, round, heart, needle or broad; `lobes` cut it
      (a fig's, an oak's), `teeth` serrate it, `veins` pairs of veins off
      the midrib, `curl` bends it back. */
  function leaf(o) {
    o = o || {};
    const L = o.len || 1, W = o.w == null ? 0.36 : o.w, curl = o.curl == null ? 0.12 : o.curl;
    const shape = o.shape || "lance";
    const width = (t) => {
      let f;
      if (shape === "oval") f = Math.pow(Math.sin(Math.PI * t), 0.75);
      else if (shape === "round") f = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.95 + 0.03)), 0.5);
      else if (shape === "heart") f = Math.pow(Math.sin(Math.PI * t), 0.6) * (1 + 0.5 * Math.exp(-Math.pow((t - 0.12) / 0.14, 2)));
      else if (shape === "needle") f = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.6 + 0.2)), 2) * 0.35;
      else if (shape === "broad") f = Math.pow(Math.sin(Math.PI * t), 0.55);
      else f = Math.pow(Math.sin(Math.PI * t), 1.3) * (1.15 - 0.3 * t);
      if (o.lobes) f *= 0.55 + 0.45 * Math.abs(Math.sin(t * Math.PI * o.lobes));
      if (o.teeth) f *= 1 + 0.08 * (((t * o.teeth * 2) % 1) - 0.5);
      return f * W;
    };
    const z = (x, t) => curl * (x * x * 2.2 + t * t * 0.6);
    const n = 26, right = [], left = [], mid = [];
    for (let k = 0; k <= n; k++) {
      const t = k / n, y = t * L, x = width(t);
      right.push([x, y, z(x, t)]);
      left.push([-x, y, z(x, t)]);
      mid.push([0, y, z(0, t)]);
    }
    const edge = right.concat(left.slice().reverse());
    const out = join(path(edge, Math.max(0.035, 0.05 * L)), path(mid, Math.max(0.05, 0.07 * L), 0.8));
    const pairs = o.veins == null ? 4 : o.veins;
    for (let k = 1; k <= pairs; k++) {
      const t = k / (pairs + 1) * 0.9, y = t * L, x = width(t + 0.08) * 0.92;
      out.l.push([[0, y, z(0, t)], [x, y + 0.12 * L, z(x, t)]], [[0, y, z(0, t)], [-x, y + 0.12 * L, z(x, t)]]);
    }
    return out;
  }
  /** A PETAL: a leaf's outline, cupped. */
  const petal = (o) => leaf(Object.assign({ shape: "oval", veins: 0, curl: -0.25 }, o));
  /** A FLOWER looking up: `n` petals round a heart, cupped by `cup`, in
      `rows` rows, the heart a small ball (and stamens, if asked). */
  function flower(o) {
    o = o || {};
    const n = o.n || 5, len = o.len || 0.55, w = o.w || 0.26, rows = o.rows || 1;
    const parts = [];
    for (let row = 0; row < rows; row++) {
      const cup = (o.cup == null ? 0.5 : o.cup) + row * 0.35;
      const s = 1 - row * 0.22;
      for (let k = 0; k < n; k++) {
        parts.push(at(petal({ len: len * s, w: w * s, shape: o.shape || "oval", curl: o.curl == null ? -0.25 : o.curl, lobes: o.lobes, teeth: o.teeth }),
          { rx: -Math.PI / 2 + cup, ry: (k / n) * TAU + row * (Math.PI / n) + (o.turn || 0) }));
      }
    }
    if (o.heart !== false) parts.push(ball({ r: o.heart || 0.08, n: 40, lines: false, w: 1.2 }));
    if (o.stamens) for (let k = 0; k < o.stamens; k++) {
      const a = (k / o.stamens) * TAU, r = 0.1 + rnd() * 0.06, h = o.stamenLen || 0.28;
      parts.push(path([[0, 0, 0], [Math.cos(a) * r, h, Math.sin(a) * r]], 0.05, 0.7));
      parts.push(part([[Math.cos(a) * r, h, Math.sin(a) * r, 1.4]]));
    }
    return join.apply(null, parts);
  }
  /** A STEM from the ground up, bending by `bend`. */
  const stem = (h, bend, lean) => path(bez([0, 0, 0], [(lean || 0) * 0.3, h * 0.35, 0], [(bend || 0) + (lean || 0) * 0.6, h * 0.7, 0], [(bend || 0) * 1.4 + (lean || 0), h, 0], 16), 0.06, 0.8);
  /** A SPRIG: a stem with leaves in pairs (or alone, `alt`) up it. */
  function sprig(o) {
    o = o || {};
    const h = o.h || 1.8, pairs = o.pairs || 4, parts = [stem(h, o.bend || 0.1)];
    for (let k = 0; k < pairs; k++) {
      const t = 0.25 + (k / pairs) * 0.7, y = h * t, s = (o.size || 0.55) * (1 - t * (o.taper == null ? 0.45 : o.taper));
      const x = (o.bend || 0.1) * t * t * 1.4;
      const L = leaf({ len: s, w: s * (o.wide || 0.45), shape: o.shape || "oval", teeth: o.teeth, lobes: o.lobes, veins: o.veins == null ? 2 : o.veins, curl: 0.1 });
      const side = o.alt ? (k % 2 ? 1 : -1) : 1;
      // Each pair a quarter-turn from the last, as mint and basil grow.
      const turn = o.whorl ? k * 1.1 : o.alt ? k * 0.9 : (k % 2) * (Math.PI / 2);
      parts.push(at(L, { x, y, rz: -1.0 * side, ry: turn }));
      if (!o.alt) parts.push(at(L, { x, y, rz: 1.0, ry: Math.PI + turn }));
      if (o.whorl === 3) parts.push(at(L, { x, y, rz: 1.0, ry: Math.PI / 2 + k }));
    }
    if (o.top) parts.push(at(o.top, { x: (o.bend || 0.1) * 1.4, y: h }));
    return join.apply(null, parts);
  }
  /** A BOX of edges, and specks on its faces if asked. */
  function box(w, h, dp, o) {
    o = o || {};
    const x = w / 2, y = h / 2, z = dp / 2;
    const c = [[-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z], [-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const out = join.apply(null, E.map(([a, b]) => path([c[a], c[b]], o.step || 0.08)));
    if (o.fill) for (let k = 0; k < o.fill; k++) {
      const f = Math.floor(rnd() * 3), u = rnd() - 0.5, v = rnd() - 0.5, s = rnd() < 0.5 ? -1 : 1;
      out.d.push(f === 0 ? [s * x, u * h, v * dp, 0.7] : f === 1 ? [u * w, s * y, v * dp, 0.7] : [u * w, v * h, s * z, 0.7]);
    }
    return out;
  }
  /** A DISC lying flat: rings and spokes. */
  function disc(r, rings, spokes, o) {
    o = o || {};
    const parts = [];
    for (let k = 1; k <= (rings || 2); k++) parts.push(path(circle((r * k) / (rings || 2), 44), o.step || 0.06));
    for (let k = 0; k < (spokes || 0); k++) { const a = (k / spokes) * TAU; parts.push(path([[0, 0, 0], [Math.cos(a) * r, 0, Math.sin(a) * r]], 0.07, 0.7)); }
    return join.apply(null, parts);
  }
  /** A SHEET: a rectangle in the upright plane, ruled across if asked. */
  function sheet(w, h, o) {
    o = o || {};
    const x = w / 2, y = h / 2, bend = o.bend || 0;
    const z = (px) => bend * (px * px) * 1.2;
    const edge = [[-x, -y], [x, -y], [x, y], [-x, y], [-x, -y]].map(([a, b]) => [a, b, z(a)]);
    const out = path(edge, 0.06);
    for (let k = 1; k <= (o.rules || 0); k++) {
      const yy = -y + (k / (o.rules + 1)) * h;
      out.l.push(curve((t) => { const xx = -x * 0.8 + t * x * 1.6; return [xx, yy, z(xx)]; }, 8));
    }
    return out;
  }
  /** A WAVE: a surface of specks rippling one way. */
  function wave(w, dp, o) {
    o = o || {};
    const nx = o.nx || 22, nz = o.nz || 12, amp = o.amp == null ? 0.12 : o.amp, k = o.k || 2.2, d = [], l = [];
    const hgt = (x, z) => amp * Math.sin(x * k * Math.PI / w * 2 + z * (o.skew || 0.8)) + (o.swell || 0) * Math.exp(-x * x * 2);
    for (let i = 0; i < nz; i++) {
      const z = -dp / 2 + (i / (nz - 1)) * dp, row = [];
      for (let j = 0; j < nx; j++) { const x = -w / 2 + (j / (nx - 1)) * w; const p = [x, hgt(x, z), z]; d.push([...p, 0.8]); row.push(p); }
      if (i % 3 === 0) l.push(row);
    }
    return part(d, l);
  }
  /** A cloud of specks. */
  const cloud = (n, r, o) => part(Array.from({ length: n }, () => {
    const u = rnd() * TAU, v = Math.acos(2 * rnd() - 1), rr = r * Math.cbrt(rnd());
    return [Math.sin(v) * Math.cos(u) * rr * ((o && o.sx) || 1), Math.cos(v) * rr * ((o && o.sy) || 1), Math.sin(v) * Math.sin(u) * rr, (o && o.w) || 0.7];
  }));
  /** A WISP of smoke rising and curling. */
  function wisp(h, o) {
    o = o || {};
    const turns = o.turns || 1.6, r = o.r || 0.18, ph = o.ph || 0;
    return path(curve((t) => [Math.sin(t * turns * TAU + ph) * r * (0.3 + t), t * h, Math.cos(t * turns * TAU + ph) * r * 0.6 * t], 40), 0.05, 0.7);
  }
  /** A DROP: round below, drawn to a point above. */
  const drop = (r, o) => turned([[0, -r], [r * 0.72, -r * 0.62], [r, -r * 0.05], [r * 0.7, r * 0.6], [r * 0.3, r * 1.15], [0, r * 1.6]], Object.assign({ seg: 16, mer: 4 }, o));
  /** A STAR of points, lying flat (star anise, a sparkle). */
  function star(n, r1, r2, o) {
    const pts = [];
    for (let k = 0; k <= n * 2; k++) { const a = (k / (n * 2)) * TAU, r = k % 2 ? r2 : r1; pts.push([Math.cos(a) * r, (o && o.lift) ? (k % 2 ? 0 : o.lift) : 0, Math.sin(a) * r]); }
    return path(pts, 0.05);
  }
  /** A TREE: a conifer in tiers of cones on its trunk. */
  function tree(o) {
    o = o || {};
    const h = o.h || 2, tiers = o.tiers || 5, R = o.r || 0.7, parts = [path([[0, -0.3, 0], [0, h, 0]], 0.07)];
    for (let k = 0; k < tiers; k++) {
      const t = k / tiers, base = h * (0.12 + t * 0.78), r = R * (1 - t * (o.narrow == null ? 0.8 : o.narrow)), top = base + h * (o.step || 0.28);
      const droop = o.droop || 0;
      parts.push(lathe([[r, base - droop * r], [r * 0.55, (base + top) / 2], [0.02, top]], { seg: 16, mer: o.mer || 8 }));
    }
    return join.apply(null, parts);
  }
  /** A LOG lying along x: a cylinder, its end ringed with its years. */
  function log(o) {
    o = o || {};
    const r = o.r || 0.35, L = o.len || 1.6, rings = o.rings == null ? 4 : o.rings;
    const body = at(lathe([[r, -L / 2], [r * (o.taper || 1), L / 2]], { seg: 20, mer: 10 }), { rz: Math.PI / 2 });
    const ends = [];
    for (let k = 1; k <= rings; k++) ends.push(at(path(circle((r * k) / rings, 30), 0.05), { rz: Math.PI / 2, x: L / 2 }));
    return join(body, join.apply(null, ends));
  }
  /** A BERRY: a small ball with a star at its crown. */
  const berry = (r, o) => join(ball({ r, n: Math.round(60 + r * 200), lines: false }), (o && o.crown) ? at(star(5, r * 0.28, r * 0.12), { y: r * 0.96 }) : null);
  /** A CLUSTER of `n` like things, heaped. */
  function heap(n, make, r, o) {
    return many(n, make, (k) => {
      const a = k * 2.4, d = r * Math.sqrt((k + 0.5) / n);
      return { x: Math.cos(a) * d, y: (o && o.flat) ? jit(0.05) : jit(r * 0.25) + (n - k) / n * r * ((o && o.rise) || 0.4), z: Math.sin(a) * d, rx: jit(1), ry: rnd() * TAU, rz: jit(1) };
    });
  }
  /** FALLING things: `n` of a part scattered down a column. */
  const falling = (n, make, h, w) => many(n, make, (k) => ({ x: jit(w || 0.6), y: (k / n) * (h || 1.6), z: jit(w || 0.6), ry: rnd() * TAU, rz: jit(0.6) }));

  // ============================================================
  // THINGS MADE OF THE PARTS — and then every note.
  // ============================================================
  /** A CITRUS: the fruit, faintly rough, and a slice of it standing
      beside it — rind, pith, and its segments with a pip or two. */
  function slice(r, segs, o) {
    o = o || {};
    const parts = [path(circle(r, 48), 0.045, 1.1), path(circle(r * 0.86, 44), 0.06, 0.7)];
    for (let k = 0; k < segs; k++) {
      const a = (k / segs) * TAU;
      parts.push(path([[Math.cos(a) * r * 0.1, 0, Math.sin(a) * r * 0.1], [Math.cos(a) * r * 0.84, 0, Math.sin(a) * r * 0.84]], 0.06, 0.7));
      if (o.full) for (let j = 0; j < 5; j++) {
        const aa = a + (Math.PI / segs) * (0.4 + rnd() * 1.2), rr = r * (0.25 + rnd() * 0.55);
        parts.push(part([[Math.cos(aa) * rr, 0, Math.sin(aa) * rr, 0.6]]));
      }
    }
    return at(join.apply(null, parts), { rx: Math.PI / 2 });
  }
  function citrus(o) {
    o = o || {};
    const r = o.r || 0.8;
    const fruit = ball({ r, sx: o.sx || 1, sy: o.sy || 1, sz: o.sx || 1, n: 300, rough: o.rough == null ? 0.02 : o.rough, bumps: o.bumps || 14, pear: o.pear, tip: o.tip, ribs: o.ribs, ribDepth: o.ribDepth });
    const parts = [at(fruit, { x: o.slice === false ? 0 : -0.35 })];
    if (o.nub) parts.push(at(ball({ r: r * 0.12, n: 24, lines: false }), { x: -0.35, y: r * (o.sy || 1) * (o.pear ? 0.95 : 1) }));
    if (o.slice !== false) parts.push(at(slice(r * 0.72, o.segs || 10, { full: o.full }), { x: r + 0.25, y: -r * 0.2, z: 0.2, ry: -0.5 }));
    if (o.leaf) parts.push(at(leaf({ len: r * 0.9, w: r * 0.28, shape: "oval" }), { x: -0.35 + r * 0.1, y: r * (o.sy || 1) * 0.95, rz: -0.9 }));
    if (o.leaves) parts.push(at(leaf({ len: r * 0.8, w: r * 0.26, shape: "oval" }), { x: -0.35 - r * 0.1, y: r * (o.sy || 1) * 0.95, rz: 1.0, ry: 0.6 }));
    return join.apply(null, parts);
  }
  /** A HALF, lying open: the half ball behind its face. */
  const half = (r, segs, o) => join(at(ball(Object.assign({ r, n: 200, cut: 0 }, o)), {}), at(slice(r * 0.96, segs, { full: o && o.full }), { rx: 0 }), at(path(circle(r, 48), 0.05), { rx: Math.PI / 2 }));
  /** AN APPLE: dimpled top and bottom, a stalk and a leaf. */
  const apple = (o) => join(ball({ r: (o && o.r) || 0.8, sy: (o && o.sy) || 0.9, dent: 0.35, n: 300 }), path([[0, 0.55, 0], [0.05, 0.85, 0], [0.12, 0.98, 0]], 0.04), (o && o.leaf === false) ? null : at(leaf({ len: 0.5, w: 0.2, shape: "oval" }), { x: 0.08, y: 0.85, rz: -1.1 }));
  const pearShape = (s) => at(turned([[0, -0.75], [0.5, -0.6], [0.62, -0.25], [0.45, 0.2], [0.28, 0.55], [0.2, 0.78], [0, 0.88]], { seg: 22, mer: 8 }), { s: s || 1 });
  const bottle = (o) => turned(o && o.profile ? o.profile : [[0, -1], [0.42, -1], [0.45, -0.9], [0.45, 0.2], [0.4, 0.38], [0.16, 0.55], [0.13, 0.9], [0.15, 0.95], [0, 0.95]], { seg: 20, mer: 8, rings: true });
  const glass = (o) => turned((o && o.profile) || [[0, -0.9], [0.32, -0.9], [0.06, -0.86], [0.05, -0.3], [0.2, -0.22], [0.48, 0.1], [0.5, 0.55], [0.44, 0.85]], { seg: 22, mer: 6, rings: true });
  const cup = (o) => join(turned([[0, -0.4], [0.42, -0.4], [0.55, -0.2], [0.62, 0.2], [0.62, 0.35]], { seg: 22, mer: 8, rings: true }),
    (o && o.handle === false) ? null : path(bez([0.6, 0.2, 0], [0.95, 0.25, 0], [0.9, -0.2, 0], [0.5, -0.22, 0], 10), 0.05),
    (o && o.saucer) ? at(disc(0.95, 2, 0), { y: -0.42 }) : null,
    (o && o.steam) ? join(at(wisp(0.9, { ph: 0 }), { y: 0.4, x: -0.12 }), at(wisp(0.8, { ph: 2 }), { y: 0.4, x: 0.14 })) : null);
  const smoke = (n, h) => many(n || 3, (k) => wisp(h || 1.2, { ph: k * 2.1, r: 0.16 + k * 0.05, turns: 1.3 + k * 0.4 }), (k) => ({ x: (k - (n || 3) / 2) * 0.12 }));
  const flame = (s) => at(turned([[0, -0.3], [0.22, -0.18], [0.26, 0.05], [0.14, 0.35], [0.04, 0.6], [0, 0.72]], { seg: 14, mer: 6 }), { s: s || 1 });
  const candle = (o) => join(turned([[0, -0.9], [0.28, -0.9], [0.28, 0.35], [0, 0.35]], { seg: 18, mer: 6, rings: true }), path([[0, 0.35, 0], [0, 0.48, 0]], 0.03), at(flame(0.5), { y: 0.66 }),
    (o && o.drips) ? many(4, () => path([[0, 0, 0], [0, -0.3 - rnd() * 0.3, 0]], 0.04), (k) => ({ x: Math.cos(k * 1.6) * 0.285, y: 0.35, z: Math.sin(k * 1.6) * 0.285 })) : null);
  /** A ROSE: petals in a spiral, the inner ones cupped close. */
  function rose(o) {
    o = o || {};
    const parts = [];
    const n = o.n || 14;
    for (let k = 0; k < n; k++) {
      const t = k / n, s = 0.3 + t * 0.55;
      parts.push(at(petal({ len: s, w: s * 0.75, shape: "round", curl: -0.5 + t * 0.35 }), { rx: -Math.PI / 2 + 1.35 - t * (o.open || 0.95), ry: k * 2.4 }));
    }
    parts.push(ball({ r: 0.07, n: 20, lines: false }));
    return join.apply(null, parts);
  }
  const bell = (s) => at(turned([[0, 0.25], [0.12, 0.2], [0.2, 0], [0.26, -0.2], [0.32, -0.26]], { seg: 14, mer: 6 }), { s: s || 1 });
  /** Bells hanging off one side of an arching stem. */
  function bells(n, o) {
    const parts = [path(bez([0, -1, 0], [0, 0.2, 0], [0.4, 0.9, 0], [1.1, 0.7, 0], 20), 0.05, 0.8)];
    for (let k = 0; k < n; k++) {
      const t = 0.35 + (k / n) * 0.6;
      const u = 1 - t, x = 3 * u * t * t * 0.4 + t * t * t * 1.1, y = -1 * u * u * u + 3 * u * u * t * 0.2 + 3 * u * t * t * 0.9 + t * t * t * 0.7;
      parts.push(path([[x, y, 0], [x + 0.02, y - 0.16, 0]], 0.04, 0.7));
      parts.push(at(bell((o && o.s) || 0.6), { x: x + 0.02, y: y - 0.3 }));
    }
    return join.apply(null, parts);
  }
  /** A TRUMPET flower: a tube flaring into `n` points. */
  const trumpet = (o) => join(turned([[0.04, 0], [0.05, 0.4], [0.1, 0.6], [0.3, 0.72], [0.38, 0.74]], { seg: 16, mer: (o && o.n) || 5 }), at(star((o && o.n) || 5, 0.42, 0.22), { y: 0.74 }));
  /** A DAISY: a ring of thin petals round a raised heart. */
  const daisy = (o) => join(flower({ n: (o && o.n) || 16, len: (o && o.len) || 0.42, w: 0.07, cup: (o && o.cup) || 0.15, shape: "lance", curl: 0 }), at(ball({ r: 0.13, sy: 0.6, n: 50, lines: false }), { y: 0.03 }));
  const onStem = (flowerPart, h, lean) => join(stem(h || 1.3, 0.05, lean || 0), at(flowerPart, { y: h || 1.3, x: (lean || 0) + 0.07, rx: -0.2 }));
  /** GRASS: blades rising and bending. */
  const blades = (n, h, o) => many(n, (k) => path(bez([0, 0, 0], [0, h * 0.4, 0], [((k % 2 ? 1 : -1) * (0.1 + rnd() * 0.3)), h * 0.8, 0], [((k % 2 ? 1 : -1) * (0.3 + rnd() * 0.4)), h * (0.8 + rnd() * 0.3), 0], 14), 0.05, 0.8), (k) => ({ x: jit((o && o.spread) || 0.3), z: jit((o && o.spread) || 0.3), ry: rnd() * TAU }));
  /** AN EAR of grain on its stalk: rows of seeds, and awns if asked. */
  function ear(o) {
    o = o || {};
    const parts = [path([[0, -1.1, 0], [0, 0, 0]], 0.07, 0.8)];
    const rows = o.rows || 9;
    for (let k = 0; k < rows; k++) {
      const y = k * 0.11, s = 1 - k / (rows * 1.4);
      [-1, 1].forEach((side) => {
        parts.push(at(ball({ r: 0.07 * s, sy: 1.7, n: 16, lines: false }), { x: side * 0.07 * s, y, rz: -side * 0.35 }));
        if (o.awns) parts.push(path([[side * 0.08 * s, y + 0.08, 0], [side * (0.2 + 0.1 * s), y + (o.awns || 0.6), 0]], 0.05, 0.6));
      });
    }
    return join.apply(null, parts);
  }
  /** A POD: a long, curved body (vanilla, carob, chilli, a bean). */
  function pod(o) {
    o = o || {};
    const L = o.len || 1.8, r = o.r || 0.1, bend = o.bend == null ? 0.25 : o.bend, d = [], l = [];
    const n = 26;
    const spine = curve((t) => [(t - 0.5) * L, Math.sin(t * Math.PI) * bend, 0], n);
    spine.forEach((p, k) => {
      const t = k / n, rr = r * Math.pow(Math.sin(Math.PI * Math.min(0.98, Math.max(0.02, t))), o.blunt ? 0.25 : 0.6) * (o.bumps ? 1 + 0.35 * Math.abs(Math.sin(t * Math.PI * o.bumps)) : 1);
      const m = 9;
      for (let j = 0; j < m; j++) { const a = (j / m) * TAU; d.push([p[0], p[1] + Math.cos(a) * rr, Math.sin(a) * rr * (o.flat || 1), 1]); }
    });
    l.push(spine);
    return part(d, l);
  }
  /** A NUT or a SEED: a small ball, pointed and pressed as asked. */
  const seed1 = (o) => ball(Object.assign({ r: 0.2, n: 60, lines: false }, o));
  /** A QUILL of bark rolled on itself (cinnamon, cassia). */
  function quill(o) {
    o = o || {};
    const L = o.len || 1.6, turns = o.turns || 1.6, d = [], l = [];
    for (let k = 0; k <= 12; k++) {
      const x = (k / 12 - 0.5) * L, ring = [];
      for (let j = 0; j <= 30; j++) {
        const a = (j / 30) * turns * TAU, r = 0.16 - (j / 30) * 0.07 * turns;
        const p = [x, Math.cos(a) * r, Math.sin(a) * r];
        ring.push(p);
        if (j % 2 === 0) d.push([...p, 0.8]);
      }
      if (k % 4 === 0) l.push(ring);
    }
    return part(d, l);
  }
  /** Bumpy fingers of a root (ginger, turmeric, orris, costus). */
  function roots(o) {
    o = o || {};
    const L0 = (o.len || 0.8) * 1.7, r0 = o.r || 0.16;
    const parts = [pod({ len: L0, r: r0 * 1.15, bend: 0.08, bumps: o.bumps || 3, blunt: true })];
    const n = o.n || 4;
    for (let k = 0; k < n; k++) {
      const x = -L0 * 0.4 + (k / Math.max(1, n - 1)) * L0 * 0.8, up = k % 2 ? 1 : -1;
      const L = (o.len || 0.8) * (0.55 + rnd() * 0.35);
      const a = up * (0.7 + rnd() * 0.5);
      parts.push(at(pod({ len: L, r: r0 * 0.85, bend: 0.05, bumps: Math.max(1, (o.bumps || 3) - 1), blunt: true }), { x: x + Math.cos(a) * L * 0.45, y: Math.sin(a) * L * 0.45, rz: a, ry: jit(0.6) }));
    }
    if (o.hairs) for (let k = 0; k < o.hairs; k++) parts.push(path([[jit(0.5), jit(0.2), jit(0.2)], [jit(0.8), -0.4 - rnd() * 0.7, jit(0.4)]], 0.05, 0.5));
    return join.apply(null, parts);
  }
  /** A BUNDLE of strands hanging (vetiver's roots, hair, a tuft). */
  function strands(n, L, o) {
    o = o || {};
    return many(n, (k) => path(curve((t) => [Math.sin(t * (o.wave || 3) + k) * (o.amp || 0.06) * t + (o.fan || 0.5) * (k / n - 0.5) * t, -t * L * (0.8 + rnd() * 0.3), Math.cos(t * 2 + k) * 0.05 * t], 20), 0.05, 0.6),
      () => ({ x: jit(o.spread || 0.12), z: jit(o.spread || 0.12) }));
  }
  const hexes = (rows, cols, r) => {
    const parts = [];
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const x = (j - (cols - 1) / 2) * r * 1.75, y = (i - (rows - 1) / 2) * r * 1.52 + (j % 2) * r * 0.76;
      parts.push(path(curve((t) => [x + Math.cos(t * TAU + Math.PI / 6) * r, y + Math.sin(t * TAU + Math.PI / 6) * r, 0], 6), 0.05));
    }
    return join.apply(null, parts);
  };
  const cube = (s) => box(s, s, s, { step: 0.06, fill: 20 });
  const crystal = (h, r) => join(lathe([[0, -h / 2], [r, -h / 2 + r * 0.6], [r, h / 2 - r * 0.6], [0, h / 2]], { seg: 6, mer: 6 }));
  const tear = (s) => at(ball({ r: 0.2, sy: 1.25, n: 50, rough: 0.12, bumps: 5, lines: false, tip: 0.3 }), { s: s || 1 });
  const lumps = (n, s) => heap(n, () => ball({ r: 0.22 * (s || 1), n: 60, rough: 0.2, bumps: 4, lines: false }), 0.4 * (s || 1));
  const drops = (n, s) => many(n, () => drop(0.12 * (s || 1)), (k) => ({ x: (k - (n - 1) / 2) * 0.4 * (s || 1), y: -k * 0.35 + 0.3 }));
  const book = (w, h, t) => join(box(w, t, h, { step: 0.06 }), sheet(w * 0.96, h * 0.9, {}));
  const sprinkle = (n, r) => cloud(n, r, { w: 0.55 });
  const pipe = () => join(turned([[0.05, 0], [0.22, 0.02], [0.24, 0.35], [0.18, 0.38]], { seg: 16, mer: 6, rings: true }), path(bez([0.2, 0.08, 0], [0.6, 0.02, 0], [0.9, -0.05, 0], [1.25, 0.05, 0], 12), 0.04));
  const lantern = () => join(turned([[0, -0.8], [0.3, -0.8], [0.5, -0.5], [0.58, 0], [0.5, 0.5], [0.3, 0.75], [0.12, 0.8], [0.12, 0.95]], { seg: 20, mer: 10, rings: true }), at(flame(0.35), { y: -0.2 }));
  const urn = () => turned([[0, -0.9], [0.3, -0.9], [0.22, -0.7], [0.45, -0.3], [0.52, 0.1], [0.36, 0.5], [0.22, 0.62], [0.3, 0.8]], { seg: 22, mer: 8, rings: true });
  const barrel = () => turned([[0.5, -0.8], [0.62, -0.4], [0.66, 0], [0.62, 0.4], [0.5, 0.8]], { seg: 22, mer: 14, rings: true });
  const conePine = (s) => at(join(turned([[0, -0.5], [0.28, -0.3], [0.3, 0.1], [0.18, 0.45], [0, 0.6]], { seg: 10, mer: 0 }), many(20, () => petal({ len: 0.16, w: 0.12, shape: "round" }), (k) => ({ y: -0.4 + (k / 20) * 0.9, ry: k * 2.4, rx: -0.6, x: Math.cos(k * 2.4) * 0.26 * Math.sin(Math.PI * (k / 20)), z: Math.sin(k * 2.4) * 0.26 * Math.sin(Math.PI * (k / 20)) }))), { s: s || 1 });
  const needles = (n, L) => many(n, () => path([[0, 0, 0], [0, L || 0.6, 0]], 0.05, 0.6), (k) => ({ rz: (k / n - 0.5) * 1.6, ry: k * 0.9 }));
  const twig = (L) => path(bez([-L / 2, 0, 0], [-L / 6, 0.1, 0], [L / 6, -0.08, 0], [L / 2, 0.05, 0], 14), 0.06, 0.8);
  const umbel = (n, r, h, head) => many(n, (k) => join(path([[0, 0, 0], [0, h, 0]], 0.06, 0.6), at(head(k), { y: h })), (k) => ({ rz: Math.cos(k * 2.4) * (r || 0.6), rx: Math.sin(k * 2.4) * (r || 0.6) }));
  const florets = (n, r, s) => heap(n, () => star(4, 0.07 * (s || 1), 0.03 * (s || 1)), r || 0.3, { rise: 0.6 });
  /** An INGOT: a bar narrower at the top than at its foot. */
  function ingot(w, d, h) {
    const b = [[-w / 2, 0, -d / 2], [w / 2, 0, -d / 2], [w / 2, 0, d / 2], [-w / 2, 0, d / 2]];
    const t = b.map(([x, , z]) => [x * 0.72, h, z * 0.62]);
    const E = [];
    for (let k = 0; k < 4; k++) E.push([b[k], b[(k + 1) % 4]], [t[k], t[(k + 1) % 4]], [b[k], t[k]]);
    return join.apply(null, E.map((e) => path(e, 0.05)).concat([box(w * 0.72 - 0.02, 0.001, d * 0.62 - 0.02, { step: 1, fill: 30 })].map((q) => at(q, { y: h }))));
  }
  const pan = (r) => join(path(circle(r, 40), 0.05), at(path(circle(r * 0.8, 36), 0.06, 0.7), { y: -0.03 }));
  const flake = (s) => at(star(6, 0.2, 0.08), { s: s || 1 });
  const chunk = (s, o) => at(join(lathe([[0, -0.4], [0.22, -0.37], [0.35, -0.3], [0.4, -0.12], [0.42, 0.05], [0.36, 0.2], [0.28, 0.35], [0.14, 0.42], [0, 0.45]], { seg: 9, mer: 9 })), Object.assign({ s: s || 1 }, o));
  const frond = (L, n) => join(path([[0, 0, 0], [0, L, 0]], 0.05, 0.7), many(n || 8, () => leaf({ len: 0.18, w: 0.05, shape: "lance", veins: 0 }), (k) => ({ y: (k / (n || 8)) * L * 0.9, rz: k % 2 ? 1.1 : -1.1 })));

  // ============================================================
  // SYMBOLS (2026-09-29): "I want it to be representative, and better
  // demonstrating something, like holy bread should be a cross". What is
  // best known by its outline — a cross, a paw print, a bolt of lightning,
  // a fingerprint, a hide — is drawn as a FLAT SHAPE facing you, given a
  // little thickness and specks inside it; and a flower is turned to face
  // you rather than the sky.
  // ============================================================
  /** Whether a point lies inside an outline. */
  function inside(pts, x, y) {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  /** A FLAT SHAPE: an outline [[x, y] ...] in the upright plane, `depth`
      thick (its front firm, its back fainter), its corners joined if asked,
      and `fill` specks inside it. */
  function flat(pts, o) {
    o = o || {};
    const dz = (o.depth == null ? 0.12 : o.depth) / 2, ring = pts.concat([pts[0]]), st = o.step || 0.045;
    const parts = [path(ring.map(([x, y]) => [x, y, dz]), st), path(ring.map(([x, y]) => [x, y, -dz]), st * 1.5, 0.5)];
    if (o.corners) pts.forEach(([x, y]) => parts.push(path([[x, y, dz], [x, y, -dz]], 0.04, 0.5)));
    if (o.fill) {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), d = [];
      for (let tries = 0; d.length < o.fill && tries < o.fill * 40; tries++) {
        const x = x0 + rnd() * (x1 - x0), y = y0 + rnd() * (y1 - y0);
        if (inside(pts, x, y)) d.push([x, y, (rnd() - 0.5) * 2 * dz, 0.55]);
      }
      parts.push(part(d));
    }
    return join.apply(null, parts);
  }
  /** An outline from a function of the angle round it, measured from
      straight up: r(θ), sized by sx and sy. */
  const polar = (fn, n, sx, sy) => Array.from({ length: n || 96 }, (_, k) => {
    const a = (k / (n || 96)) * TAU, r = fn(a);
    return [Math.sin(a) * r * (sx || 1), Math.cos(a) * r * (sy || 1)];
  });
  const oval = (rx, ry, n) => polar(() => 1, n || 40, rx, ry);
  const moved = (pts, x, y, turn) => pts.map(([px, py]) => {
    const c = Math.cos(turn || 0), s = Math.sin(turn || 0);
    return [px * c - py * s + (x || 0), px * s + py * c + (y || 0)];
  });
  /** How far apart two angles are, the short way round. */
  const apart = (a, b) => { const d = Math.abs(((a - b) % TAU + TAU) % TAU); return Math.min(d, TAU - d); };
  /** Lines drawn across the inside of an outline at a slant (a hatch). */
  function hatch(pts, gap, slant) {
    const d = [], xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const c = Math.cos(slant), s = Math.sin(slant), R = Math.hypot(x1 - x0, y1 - y0);
    for (let u = -R; u <= R; u += gap) for (let v = -R; v <= R; v += 0.05) {
      const x = (x0 + x1) / 2 + u * c - v * s, y = (y0 + y1) / 2 + u * s + v * c;
      if (inside(pts, x, y)) d.push([x, y, 0.07, 0.6]);
    }
    return part(d);
  }
  /** A RING standing upright and facing you: radius r about (cx, cy). */
  const hoop = (r, n, cx, cy, z) => curve((t) => [(cx || 0) + Math.cos(t * TAU) * r, (cy || 0) + Math.sin(t * TAU) * r, z || 0], n || 36);
  /** A flower turned to face you (flowers are built looking up). */
  const facing = (flowerPart, tilt) => at(flowerPart, { rx: tilt == null ? 1.15 : tilt });
  /** A seam down the front of a fruit of radius r (a peach's, a plum's). */
  const seam = (r, sy) => path(curve((t) => { const a = -Math.PI / 2 + t * Math.PI; return [r * Math.cos(a) * Math.sin(0.4), r * Math.sin(a) * (sy || 1), r * Math.cos(a) * Math.cos(0.4)]; }, 26), 0.03, 1.1);
  /** A torus of specks (a doughnut, a ring). */
  function torus(R, r, n) {
    const d = [];
    for (let k = 0; k < (n || 420); k++) {
      const u = (k * 2.39996323) % TAU, v = ((k * 0.61803) % 1) * TAU;
      d.push([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u), 1]);
    }
    return part(d, [circle(R + r, 48), circle(R - r, 40)]);
  }

  // Every note in the library, by name, as the library writes it.
  const FIGURES = {
    // ---------------- CITRUS ----------------
    "Bergamot": () => citrus({ r: 0.72, pear: 0.28, nub: true, rough: 0.03 }),
    "Bitter Orange": () => citrus({ r: 0.72, rough: 0.06, leaf: true }),
    "Blood Orange": () => citrus({ r: 0.76, full: true, segs: 12 }),
    "Citron": () => citrus({ r: 0.7, sx: 0.78, sy: 1.25, rough: 0.14, bumps: 7, slice: false, leaf: true }),
    "Citrus": () => join(at(citrus({ r: 0.5, sx: 0.8, sy: 1.05, tip: 0.5, slice: false }), { x: -0.5 }), at(citrus({ r: 0.55, slice: false }), { x: 0.45, z: 0.3 }), at(slice(0.45, 9), { y: -0.75, x: 0 })),
    "Clementine": () => citrus({ r: 0.6, sy: 0.84, leaf: true, slice: false, ribs: 10, ribDepth: 0.03 }),
    "Grapefruit": () => join(at(ball({ r: 0.72, n: 320, rough: 0.02, bumps: 14 }), { x: -0.55 }), at(half(0.72, 12, { full: true }), { x: 0.75, z: 0.1, ry: -0.4 })),
    "Green Mandarin": () => citrus({ r: 0.55, sy: 0.84, leaf: true, leaves: true, slice: false }),
    "Lemon": () => citrus({ r: 0.62, sx: 0.78, sy: 1.06, tip: 0.9, rough: 0.025 }),
    "Lime": () => citrus({ r: 0.55, segs: 9 }),
    "Orange": () => citrus({ r: 0.75, segs: 10 }),
    "Petitgrain": () => join(at(twig(1.8), { rz: 0.3 }), many(6, () => leaf({ len: 0.55, w: 0.2, shape: "oval" }), (k) => ({ x: -0.7 + k * 0.28, y: -0.15 + k * 0.08, rz: k % 2 ? -0.7 : 0.7 + Math.PI })), at(ball({ r: 0.16, n: 40, lines: false }), { x: 0.8, y: 0.1 })),
    "Tangerine": () => join(ball({ r: 0.66, sy: 0.82, n: 300, ribs: 10, ribDepth: 0.08 }), at(leaf({ len: 0.45, w: 0.16, shape: "oval" }), { y: 0.55, rz: -0.9 })),
    "Yuzu": () => citrus({ r: 0.66, rough: 0.12, bumps: 12 }),
    // ---------------- AROMATICS ----------------
    "Artemisia": () => sprig({ h: 1.8, pairs: 5, shape: "lance", size: 0.5, wide: 0.28, lobes: 4, alt: true }),
    "Basil": () => sprig({ h: 1.5, pairs: 3, shape: "oval", size: 0.7, wide: 0.55, top: at(flower({ n: 4, len: 0.12, w: 0.06 }), {}) }),
    "Chamomile": () => join(onStem(daisy({ n: 14 }), 1.2, -0.3), at(onStem(daisy({ n: 13, len: 0.36 }), 0.9, 0.2), { x: 0.5, z: 0.2 }), at(onStem(daisy({ n: 12, len: 0.32 }), 0.7, 0.1), { x: -0.3, z: -0.3 })),
    "Clary Sage": () => join(stem(2, 0.05), many(7, () => flower({ n: 4, len: 0.2, w: 0.12, cup: 1.2 }), (k) => ({ y: 0.6 + k * 0.2, x: 0.02 * k, s: 1 - k * 0.08 })), at(leaf({ len: 0.7, w: 0.35, shape: "heart" }), { y: 0.1, rz: -1.1 }), at(leaf({ len: 0.7, w: 0.35, shape: "heart" }), { y: 0.1, rz: 1.1, ry: Math.PI })),
    "Davana": () => join(sprig({ h: 1.4, pairs: 3, shape: "lance", size: 0.5, wide: 0.25, lobes: 5 }), at(ball({ r: 0.12, n: 40, lines: false }), { y: 1.45, x: 0.2 })),
    "Eucalyptus": () => { const st = bez([-0.95, 0.72, 0], [-0.4, 0.95, 0], [0.35, 0.95, 0], [0.95, 0.7, 0], 24); const at_ = (t) => st[Math.round(t * 24)]; return join(path(st, 0.045, 1), many(6, () => leaf({ len: 0.95, w: 0.12, shape: "lance", veins: 0, curl: 0.06 }), (k) => { const p = at_(0.08 + k * 0.16); return { x: p[0], y: p[1], rz: Math.PI + (k % 2 ? 0.28 : -0.28), ry: k % 2 ? 0.5 : -0.5 }; }), many(3, () => join(path([[0, 0, 0], [0, -0.12, 0]], 0.03, 0.7), at(turned([[0.02, 0], [0.08, -0.03], [0.1, -0.12], [0.07, -0.2], [0.03, -0.21]], { seg: 12, mer: 4 }), { y: -0.12 })), (k) => { const p = at_(0.9); return { x: p[0] - 0.12 + k * 0.12, y: p[1] - 0.02, z: (k - 1) * 0.06 }; })); },
    "Herbal Notes": () => join(turned([[0, -0.85], [0.3, -0.85], [0.36, -0.78], [0.5, -0.55], [0.62, -0.2], [0.66, 0.05], [0.58, 0.07], [0.54, -0.18]], { seg: 24, mer: 8, rings: true }), at(turned([[0.07, 0], [0.09, 0.8], [0.14, 1.0], [0.1, 1.12], [0, 1.15]], { seg: 12, mer: 4 }), { x: 0.05, y: -0.55, rz: -0.55 }), many(4, (k) => leaf({ len: 0.5 - k * 0.05, w: [0.1, 0.2, 0.14, 0.24][k], shape: ["lance", "oval", "lance", "round"][k], veins: k % 2 ? 2 : 0 }), (k) => ({ x: -0.35 + k * 0.14, y: -0.05, z: (k % 2 ? 0.1 : -0.1), rz: 0.7 - k * 0.3 }))),
    "Hops": () => { const scales = []; for (let k = 0; k < 34; k++) { const t = k / 33, y = 0.5 - t * 1.25, r = 0.36 * Math.pow(Math.sin(Math.PI * (0.12 + t * 0.8)), 0.8) * (1 - t * 0.25), a = k * 2.39996; scales.push(at(at(petal({ len: 0.28 - t * 0.06, w: 0.22 - t * 0.04, shape: "round", curl: -0.3 }), { rx: 0.45 }), { rz: Math.PI, ry: a, x: Math.sin(a) * r, y: y + 0.12, z: Math.cos(a) * r })); } return join(path(bez([0.55, 1.05, 0], [0.3, 1.0, 0], [0.05, 0.85, 0], [0, 0.6, 0], 12), 0.04, 0.9), ...scales, at(leaf({ len: 0.6, w: 0.5, shape: "heart", lobes: 1.5, teeth: 10, veins: 3 }), { x: 0.5, y: 1.0, rz: -1.9, rx: 0.3 })); },
    "Juniper Berry": () => join(at(twig(1.7), { rz: 0.35 }), many(4, () => berry(0.2, { crown: true }), (k) => ({ x: -0.5 + k * 0.33, y: -0.18 + k * 0.12 + (k % 2 ? 0.2 : -0.2), z: 0.1 })), many(10, () => leaf({ len: 0.34, w: 0.03, shape: "needle", veins: 0 }), (k) => ({ x: -0.7 + k * 0.15, y: -0.25 + k * 0.055, rx: k % 2 ? 0.7 : -0.7, ry: k * 0.9 }))),
    "Lavender": () => many(3, () => join(stem(1.6, 0.05), many(9, () => ball({ r: 0.05, n: 14, lines: false }), (k) => ({ y: 1.1 + k * 0.07, x: Math.cos(k * 2) * 0.05, z: Math.sin(k * 2) * 0.05 }))), (k) => ({ x: (k - 1) * 0.35, rz: (1 - k) * 0.25, ry: k })),
    "Lemon Verbena": () => sprig({ h: 1.8, pairs: 4, shape: "lance", size: 0.6, wide: 0.22, whorl: 3 }),
    "Marjoram": () => sprig({ h: 1.4, pairs: 4, shape: "oval", size: 0.35, wide: 0.5, top: heap(6, () => ball({ r: 0.06, n: 12, lines: false }), 0.12) }),
    "Mint": () => sprig({ h: 1.6, pairs: 4, shape: "oval", size: 0.6, wide: 0.5, teeth: 8, whorl: 1 }),
    "Myrtle": () => join(sprig({ h: 1.4, pairs: 4, shape: "lance", size: 0.4, wide: 0.3 }), at(flower({ n: 5, len: 0.18, w: 0.12, stamens: 16, stamenLen: 0.2 }), { y: 1.45, x: 0.2 })),
    "Oregano": () => sprig({ h: 1.3, pairs: 4, shape: "oval", size: 0.38, wide: 0.6, top: florets(8, 0.15) }),
    "Rosemary": () => join(stem(1.8, 0.1), many(28, () => leaf({ len: 0.26, w: 0.03, shape: "needle", veins: 0 }), (k) => ({ y: 0.2 + k * 0.055, x: 0.1 * Math.pow(k / 28, 2) * 1.4, rz: k % 2 ? 1 : -1, ry: k * 0.8 }))),
    "Sage": () => sprig({ h: 1.4, pairs: 3, shape: "oval", size: 0.8, wide: 0.42, veins: 5 }),
    "Thyme": () => many(3, () => join(stem(1.2, 0.15), many(10, () => leaf({ len: 0.1, w: 0.05, shape: "oval", veins: 0 }), (k) => ({ y: 0.2 + k * 0.1, x: 0.02 * k, rz: k % 2 ? 1 : -1 }))), (k) => ({ x: (k - 1) * 0.3, rz: (1 - k) * 0.35, ry: k * 1.3 })),
    "Wormwood": () => sprig({ h: 1.8, pairs: 4, shape: "lance", size: 0.7, wide: 0.42, lobes: 3.5, veins: 2, alt: true }),
    "Yarrow": () => join(stem(1.5, 0.05), at(umbel(9, 0.55, 0.3, () => florets(5, 0.08, 0.6)), { y: 1.5 }), at(frond(0.8, 12), { y: 0.3, rz: -0.8 })),
    // ---------------- GREEN ----------------
    "Crushed Leaves": () => many(6, (k) => leaf({ len: 0.5 + rnd() * 0.3, w: 0.25, shape: "oval", lobes: 1.2 + rnd() * 2, curl: 0.4 }), (k) => ({ x: jit(0.7), y: jit(0.5), z: jit(0.4), rz: rnd() * TAU, rx: jit(1) })),
    "Fig Leaf": () => { const lobes = [[0, 0.78], [0.98, 0.7], [-0.98, 0.7], [1.95, 0.52], [-1.95, 0.52]]; const pts = polar((a) => { let r = 0.26; lobes.forEach(([c, L]) => { r += L * Math.exp(-Math.pow(apart(a, c) / 0.3, 2)); }); return r - 0.18 * Math.exp(-Math.pow(apart(a, Math.PI) / 0.2, 2)); }, 140); return join(flat(pts, { depth: 0.04, fill: 120 }), many(5, (k) => path([[0, 0, 0.03], [Math.sin(lobes[k][0]) * (0.26 + lobes[k][1]) * 0.85, Math.cos(lobes[k][0]) * (0.26 + lobes[k][1]) * 0.85, 0.03]], 0.05, 0.8), () => ({})), path([[0, -0.08, 0], [0.04, -0.75, 0]], 0.04)); },
    "Galbanum": () => join(at(umbel(10, 0.6, 0.5, () => florets(4, 0.07, 0.5)), { y: 0.4 }), path([[0, -1, 0], [0, 0.4, 0]], 0.06), at(tear(1.2), { x: 0.2, y: -0.4 })),
    "Grass": () => blades(14, 1.6, { spread: 0.4 }),
    "Green Notes": () => leaf({ len: 1.6, w: 0.5, shape: "lance", veins: 6, curl: 0.2 }),
    "Green Wheat": () => join(ear({ rows: 9 }), at(path(bez([0, -1.1, 0], [0.1, -0.6, 0], [0.4, -0.3, 0], [0.55, 0.1, 0], 10), 0.05, 0.7), {})),
    "Hay": () => join(box(1.5, 0.8, 0.9, { step: 0.07 }), many(22, () => path([[-0.75, 0, 0], [0.75, jit(0.05), jit(0.05)]], 0.09, 0.6), (k) => ({ y: -0.35 + (k % 11) * 0.07, z: k < 11 ? 0.45 : -0.45 })), path([[-0.3, 0.41, -0.46], [-0.3, 0.41, 0.46]], 0.05), path([[0.3, 0.41, -0.46], [0.3, 0.41, 0.46]], 0.05)),
    "Ivy": () => join(path(bez([-0.9, -0.9, 0], [-0.2, -0.4, 0], [0.2, 0.3, 0], [0.8, 0.9, 0], 16), 0.06, 0.8), many(4, () => leaf({ len: 0.5, w: 0.35, shape: "heart", lobes: 1.5, veins: 2 }), (k) => ({ x: -0.6 + k * 0.45, y: -0.6 + k * 0.45, rz: k % 2 ? 0.8 : -0.8 }))),
    "Poplar Bud": () => join(path([[0, -1.05, 0], [0.03, 0.2, 0], [0, 0.55, 0]], 0.05, 0.8), at(ball({ r: 0.16, sy: 2.6, tip: 1, n: 90 }), { y: 0.95 }), many(4, () => ball({ r: 0.12, sy: 2.5, tip: 1, n: 60 }), (k) => ({ x: (k % 2 ? 0.2 : -0.2), y: -0.65 + k * 0.33, rz: k % 2 ? -0.55 : 0.55 }))),
    "Raspberry Leaf": () => join(path([[0, -0.8, 0], [0, 0, 0]], 0.05), at(leaf({ len: 0.8, w: 0.35, shape: "oval", teeth: 10 }), {}), at(leaf({ len: 0.6, w: 0.28, shape: "oval", teeth: 9 }), { rz: 1.1 }), at(leaf({ len: 0.6, w: 0.28, shape: "oval", teeth: 9 }), { rz: -1.1 })),
    "Rhubarb": () => join(many(3, () => at(lathe([[0.1, -1], [0.1, 0.4]], { seg: 10, mer: 4 }), {}), (k) => ({ x: (k - 1) * 0.28, rz: (1 - k) * 0.12 })), at(leaf({ len: 1.1, w: 0.8, shape: "broad", lobes: 2, veins: 4, curl: 0.3 }), { y: 0.4, rx: -0.5 })),
    "Sugar Cane": () => many(3, () => join(lathe([[0.1, -1], [0.1, 1]], { seg: 12, mer: 4 }), many(6, () => path(circle(0.115, 16), 0.03), (k) => ({ y: -0.8 + k * 0.33 }))), (k) => ({ x: (k - 1) * 0.32, rz: (k - 1) * 0.1 })),
    "Sweet Vernalgrass": () => join(blades(9, 1.3), at(ear({ rows: 6 }), { y: 1.2, s: 0.5, rz: 0.2 })),
    "Sweetgrass": () => many(3, (k) => path(curve((t) => [Math.sin(t * 14 + (k * TAU) / 3) * 0.12, t * 2 - 1, Math.cos(t * 14 + (k * TAU) / 3) * 0.12], 70), 0.04), () => ({})),
    "Tomato Leaf": () => join(path([[0, -0.9, 0], [0, 0.8, 0]], 0.05), many(6, () => leaf({ len: 0.45, w: 0.22, shape: "oval", lobes: 2, teeth: 6 }), (k) => ({ y: -0.6 + Math.floor(k / 2) * 0.5, rz: k % 2 ? 1.1 : -1.1 })), at(leaf({ len: 0.45, w: 0.22, shape: "oval", lobes: 2 }), { y: 0.8 })),
    "Violet Leaf": () => join(leaf({ len: 1.3, w: 0.62, shape: "heart", veins: 4, teeth: 12 }), path([[0, 0, 0], [0, -0.6, 0]], 0.04)),
    "Watercress": () => join(stem(1.2, 0.2), many(7, () => leaf({ len: 0.2, w: 0.2, shape: "round", veins: 0 }), (k) => ({ y: 0.3 + k * 0.13, x: 0.03 * k, rz: k % 2 ? 1.2 : -1.2 })), at(leaf({ len: 0.3, w: 0.3, shape: "round", veins: 1 }), { y: 1.25, x: 0.25 })),
    // ---------------- FLORAL ----------------
    "Alpine Sandwort": () => join(at(ball({ r: 0.7, sy: 0.35, n: 120, cut: 5, lines: false, w: 0.6 }), {}), many(9, () => flower({ n: 5, len: 0.14, w: 0.09, cup: 0.3 }), (k) => ({ x: Math.cos(k * 2.4) * 0.45 * Math.sqrt(k / 9), z: Math.sin(k * 2.4) * 0.45 * Math.sqrt(k / 9), y: 0.25 }))),
    "Azure Bluet": () => many(4, () => onStem(flower({ n: 4, len: 0.2, w: 0.15, cup: 0.3 }), 1, 0), (k) => ({ x: (k - 1.5) * 0.35, rz: (1.5 - k) * 0.15, ry: k })),
    "Bluebell": () => bells(6, { s: 0.55 }),
    "Carnation": () => join(facing(join(flower({ n: 14, rows: 3, len: 0.4, w: 0.2, cup: 0.35, shape: "round", teeth: 10 }), at(ball({ r: 0.1, sy: 2, n: 30, lines: false }), { y: -0.15 }))), at(stem(1.2, 0), { y: -1.25 })),
    "Champaca": () => join(flower({ n: 12, rows: 2, len: 0.6, w: 0.1, cup: 0.9, shape: "lance" }), at(stem(0.8, 0), { y: -0.8 })),
    "Chrysanthemum": () => join(facing(flower({ n: 22, rows: 4, len: 0.45, w: 0.06, cup: 0.1, shape: "lance", curl: 0.2 })), at(stem(1, 0), { y: -1.05 })),
    "Clear Orchid": () => join(at(petal({ len: 0.55, w: 0.2 }), { rz: 0 }), at(petal({ len: 0.5, w: 0.18 }), { rz: 2.2 }), at(petal({ len: 0.5, w: 0.18 }), { rz: -2.2 }), at(petal({ len: 0.45, w: 0.3, shape: "round" }), { rz: 1.2 }), at(petal({ len: 0.45, w: 0.3, shape: "round" }), { rz: -1.2 }), at(turned([[0, 0], [0.16, -0.05], [0.24, -0.2], [0.26, -0.4], [0.2, -0.5]], { seg: 14, mer: 4 }), { z: 0.08 }), at(path(bez([0, -0.4, -0.1], [0.3, -0.9, -0.1], [0.6, -1, -0.1], [0.9, -1.1, -0.1], 10), 0.05), {})),
    "Freesia": () => join(path(bez([0, -1, 0], [0, 0.3, 0], [0.4, 0.5, 0], [1, 0.45, 0], 16), 0.05, 0.8), many(5, () => trumpet({ n: 6 }), (k) => ({ x: 0.15 + k * 0.2, y: 0.4 + k * 0.02, rz: -1.2, s: 0.55 - k * 0.07 }))),
    "Gardenia": () => join(facing(flower({ n: 6, rows: 3, len: 0.55, w: 0.28, cup: 0.25, shape: "oval", turn: 0.3 })), at(leaf({ len: 0.8, w: 0.3, shape: "oval" }), { y: -0.2, rz: 2.2 }), at(leaf({ len: 0.7, w: 0.28, shape: "oval" }), { y: -0.2, rz: -2.3 })),
    "Geranium": () => join(at(umbel(9, 0.7, 0.35, () => flower({ n: 5, len: 0.14, w: 0.1, cup: 0.4 })), { y: 0.55 }), path([[0, -1, 0], [0, 0.55, 0]], 0.06), at(leaf({ len: 0.7, w: 0.45, shape: "round", lobes: 3.5, veins: 3 }), { y: -0.5, rz: -1.2 })),
    "Goldenrod": () => join(stem(1.8, 0.2), many(6, (k) => join(path([[0, 0, 0], [0.4 - k * 0.04, 0.2, 0]], 0.05, 0.6), many(6, () => ball({ r: 0.035, n: 8, lines: false }), (j) => ({ x: j * 0.07, y: 0.03 * j, z: jit(0.03) }))), (k) => ({ y: 1 + k * 0.14, x: 0.05 * k, ry: k % 2 ? 0 : Math.PI }))),
    "Green Tea Flowers": () => join(facing(flower({ n: 5, len: 0.5, w: 0.4, cup: 0.5, shape: "round", stamens: 26, stamenLen: 0.2 })), at(leaf({ len: 0.7, w: 0.26, shape: "oval", teeth: 10 }), { y: -0.15, rz: 2.2 })),
    "Heliotrope": () => join(at(ball({ r: 0.6, sy: 0.5, n: 60, cut: 5, lines: false, w: 0.5 }), { y: 0.5 }), many(22, () => flower({ n: 5, len: 0.08, w: 0.06, cup: 0.5 }), (k) => { const a = k * 2.4, d = 0.55 * Math.sqrt(k / 22); return { x: Math.cos(a) * d, z: Math.sin(a) * d, y: 0.5 + 0.3 * (1 - d * d * 2.5) }; }), path([[0, -1, 0], [0, 0.4, 0]], 0.06)),
    "Honeysuckle": () => join(many(4, () => join(path(bez([0, 0, 0], [0.2, 0.3, 0], [0.5, 0.55, 0], [0.8, 0.6, 0], 12), 0.04), at(flower({ n: 2, len: 0.2, w: 0.08 }), { x: 0.8, y: 0.6, rz: -1.2 }), path([[0.8, 0.6, 0], [1.05, 0.75, 0]], 0.04, 0.6)), (k) => ({ ry: (k / 4) * TAU, y: -0.2 })), at(ball({ r: 0.1, n: 20, lines: false }), { y: -0.2 })),
    "Jasmine": () => join(at(twig(1.8), { rz: 0.3 }), many(3, () => onStem(flower({ n: 5, len: 0.28, w: 0.13, cup: 0.25, shape: "lance" }), 0.35, 0), (k) => ({ x: -0.5 + k * 0.5, y: -0.1 + k * 0.14 })), many(2, () => leaf({ len: 0.4, w: 0.15, shape: "lance" }), (k) => ({ x: -0.2 + k * 0.6, y: -0.05 + k * 0.15, rz: 2.3 }))),
    "Lily": () => join(flower({ n: 6, len: 0.8, w: 0.2, cup: 0.7, shape: "lance", curl: 0.3, stamens: 6, stamenLen: 0.6 }), at(stem(1, 0), { y: -1 })),
    "Lily of the Valley": () => join(bells(7, { s: 0.35 }), at(leaf({ len: 1.5, w: 0.4, shape: "oval", veins: 0 }), { x: -0.25, y: -1, rz: 0.2, ry: 0.8 })),
    "Magnolia": () => join(flower({ n: 6, rows: 2, len: 0.75, w: 0.36, cup: 1.1, shape: "oval" }), at(ball({ r: 0.12, sy: 2, n: 30, lines: false }), { y: 0.15 }), at(twig(1.4), { y: -0.2, rz: 0.4 })),
    "Marigold": () => join(facing(flower({ n: 18, rows: 4, len: 0.36, w: 0.14, cup: 0.3, shape: "round", teeth: 6 })), at(stem(1, 0), { y: -1.05 })),
    "Mimosa": () => join(frond(1.8, 14), many(7, () => ball({ r: 0.12, n: 45, rough: 0.3, bumps: 12, lines: false }), (k) => ({ x: (k % 2 ? 0.25 : -0.25) + jit(0.05), y: 0.5 + k * 0.17, z: jit(0.1) }))),
    "Mountain Wildflowers": () => join(at(onStem(daisy({ n: 11, len: 0.3 }), 1.2, -0.2), { x: -0.5 }), at(onStem(flower({ n: 5, len: 0.25, w: 0.14 }), 1, 0.1), { x: 0.1, z: 0.2 }), at(bells(3, { s: 0.35 }), { x: 0.5, y: 0.1, s: 0.8 }), at(blades(6, 0.7), { y: -0.4 })),
    "Nectar": () => join(flower({ n: 5, len: 0.6, w: 0.3, cup: 0.8 }), at(drop(0.13), { y: 0.25 })),
    "Neroli": () => join(flower({ n: 5, len: 0.45, w: 0.2, cup: 0.4, shape: "oval", stamens: 14, stamenLen: 0.22 }), at(drop(0.14), { x: 0.75, y: -0.3 }), at(drop(0.1), { x: 0.75, y: -0.75 })),
    "Orange Blossom": () => join(at(twig(1.8), { rz: 0.2, y: -0.4 }), at(flower({ n: 5, len: 0.4, w: 0.18, cup: 0.5, stamens: 14, stamenLen: 0.2 }), { x: -0.3 }), many(2, () => ball({ r: 0.12, sy: 1.7, n: 30, lines: false }), (k) => ({ x: 0.35 + k * 0.3, y: -0.2 + k * 0.08 })), at(leaf({ len: 0.6, w: 0.24, shape: "oval" }), { x: 0.6, y: -0.35, rz: -2 })),
    "Orris": () => { const falls = many(3, () => petal({ len: 0.62, w: 0.3, shape: "oval", curl: 0.3 }), (k) => ({ rx: 2.1, ry: (k / 3) * TAU })); const standards = many(3, () => petal({ len: 0.55, w: 0.24, shape: "oval", curl: -0.35 }), (k) => ({ rx: 0.3, ry: (k / 3) * TAU + TAU / 6 })); return join(at(join(falls, standards), { y: 0.55 }), path([[0, -0.55, 0], [0, 0.55, 0]], 0.05), at(leaf({ len: 1.1, w: 0.1, shape: "lance", veins: 0 }), { y: -0.55, rz: 0.25 }), at(leaf({ len: 0.95, w: 0.1, shape: "lance", veins: 0 }), { y: -0.55, rz: -0.3 }), at(roots({ n: 3, len: 0.6, r: 0.14, bumps: 3 }), { y: -0.7, s: 0.8 })); },
    "Osmanthus": () => join(at(twig(1.8), { rz: 0.35 }), many(5, () => florets(5, 0.1, 0.9), (k) => ({ x: -0.6 + k * 0.3, y: -0.25 + k * 0.12 })), at(leaf({ len: 0.7, w: 0.22, shape: "lance", teeth: 12 }), { x: 0.4, y: 0.2, rz: -1.7 })),
    "Passionflower": () => join(flower({ n: 10, len: 0.6, w: 0.14, cup: 0.15, shape: "lance" }), many(40, () => path([[0, 0, 0], [0.42, 0.06, 0]], 0.05, 0.55), (k) => ({ ry: (k / 40) * TAU, y: 0.04 })), at(path([[0, 0, 0], [0, 0.35, 0]], 0.04), {}), many(3, () => path([[0, 0.35, 0], [0.18, 0.5, 0]], 0.04), (k) => ({ ry: (k / 3) * TAU }))),
    "Plum Blossom": () => join(at(path(bez([-1, -0.6, 0], [-0.3, -0.3, 0], [0.2, 0.2, 0], [1, 0.4, 0], 16), 0.06), {}), many(3, () => flower({ n: 5, len: 0.25, w: 0.2, shape: "round", cup: 0.3, stamens: 10, stamenLen: 0.14 }), (k) => ({ x: -0.5 + k * 0.55, y: -0.3 + k * 0.28, rz: -0.3 }))),
    "Pollen": () => many(16, () => join(ball({ r: 0.08, n: 26, lines: false }), star(6, 0.12, 0.08)), (k) => ({ x: jit(0.8), y: jit(0.8), z: jit(0.6), rx: rnd() * 3 })),
    "Rose": () => join(facing(rose({ n: 16 }), 1.0), at(stem(1.2, 0.05), { y: -1.25 }), at(leaf({ len: 0.5, w: 0.25, shape: "oval", teeth: 10 }), { y: -0.75, rz: -1.2 }), at(leaf({ len: 0.42, w: 0.22, shape: "oval", teeth: 10 }), { y: -0.45, rz: 1.25 }), many(3, () => path([[0, 0, 0], [0.09, 0.05, 0]], 0.03), (k) => ({ y: -1.05 + k * 0.28, x: 0.01 * k, ry: k % 2 ? Math.PI : 0 }))),
    "Snowdrops": () => many(3, () => join(path(bez([0, -1, 0], [0, 0.2, 0], [0.1, 0.5, 0], [0.3, 0.45, 0], 12), 0.05), at(join(petal({ len: 0.3, w: 0.13 }), at(petal({ len: 0.3, w: 0.13 }), { ry: TAU / 3 }), at(petal({ len: 0.3, w: 0.13 }), { ry: (2 * TAU) / 3 })), { x: 0.3, y: 0.45, rx: Math.PI })), (k) => ({ x: (k - 1) * 0.35, ry: k * 1.3 })),
    "Tiare Flower": () => join(facing(flower({ n: 7, len: 0.55, w: 0.2, cup: 0.15, shape: "oval", turn: 0.2 })), at(path([[0, 0, 0], [0, -0.6, 0]], 0.04), {})),
    "Tobacco Flower": () => join(many(3, () => trumpet({ n: 5 }), (k) => ({ ry: (k / 3) * TAU, rz: 0.5, s: 0.9 })), path([[0, -1, 0], [0, 0, 0]], 0.06)),
    "Tuberose": () => join(stem(1.8, 0.05), many(6, () => trumpet({ n: 6 }), (k) => ({ y: 1 + k * 0.15, ry: k * 2.1, rz: 0.9, s: 0.5 - k * 0.03 }))),
    "Violet": () => join(at(petal({ len: 0.35, w: 0.2, shape: "round" }), { rz: 0.4 }), at(petal({ len: 0.35, w: 0.2, shape: "round" }), { rz: -0.4 }), at(petal({ len: 0.32, w: 0.2, shape: "round" }), { rz: 1.8 }), at(petal({ len: 0.32, w: 0.2, shape: "round" }), { rz: -1.8 }), at(petal({ len: 0.36, w: 0.22, shape: "round" }), { rz: Math.PI }), path(bez([0, 0, 0], [0.1, -0.3, 0], [0.3, -0.7, 0], [0.2, -1.1, 0], 10), 0.05), at(leaf({ len: 0.7, w: 0.4, shape: "heart" }), { x: 0.2, y: -1.1, rz: -0.9 })),
    "Waterlily": () => join(at(disc(1.05, 1, 0), { y: -0.05 }), at(flower({ n: 12, rows: 2, len: 0.45, w: 0.14, cup: 0.4, shape: "lance" }), { rx: 0.5 })),
    "White Lotus": () => join(flower({ n: 10, rows: 2, len: 0.7, w: 0.3, cup: 0.9, shape: "oval" }), at(lathe([[0.18, 0.1], [0.24, 0.2], [0.24, 0.24], [0, 0.26]], { seg: 14, mer: 4 }), {}), at(path([[0, 0, 0], [0, -0.9, 0]], 0.05), {})),
    "Yellow Flowers": () => many(3, (k) => join(stem(1 - k * 0.15, (k - 1) * 0.15), at(facing(daisy({ n: 10 + k, len: 0.3 }), 1.0), { y: 1 - k * 0.15, x: (k - 1) * 0.21 })), (k) => ({ x: (k - 1) * 0.55 })),
    "Ylang Ylang": () => join(many(6, (k) => path(curve((t) => [Math.sin(t * 2.4) * 0.5, -Math.pow(t, 1.6) * 0.9, Math.sin(t * 5 + k) * 0.08], 16), 0.04), (k) => ({ ry: (k / 6) * TAU })), many(6, (k) => petal({ len: 0.8, w: 0.1, shape: "lance", curl: 0.4 }), (k) => ({ ry: (k / 6) * TAU, rx: Math.PI * 0.72 })), path([[0, 0, 0], [0, 0.5, 0]], 0.05)),
    // ---------------- FRUITY ----------------
    "Apple": () => apple(),
    "Apricot": () => join(ball({ r: 0.55, n: 240, dent: 0.15 }), seam(0.55), path([[0, 0.5, 0], [0.04, 0.68, 0]], 0.03), at(leaf({ len: 0.45, w: 0.2, shape: "oval" }), { x: 0.03, y: 0.66, rz: -1 })),
    "Banana": () => many(3, () => pod({ len: 1.8, r: 0.16, bend: 0.4, blunt: true }), (k) => ({ z: (k - 1) * 0.3, rx: (k - 1) * 0.3, y: -k * 0.05 })),
    "Blackberry": () => join(many(26, () => ball({ r: 0.13, n: 22 }), (k) => { const t = (k + 0.5) / 26, y = 1 - 2 * t, rr = Math.sqrt(1 - y * y), a = k * 2.39996; return { x: Math.cos(a) * rr * 0.36, y: y * 0.5 - 0.1, z: Math.sin(a) * rr * 0.36 }; }), at(star(5, 0.3, 0.1), { y: 0.43 }), path([[0, 0.43, 0], [0.08, 0.95, 0]], 0.04), at(leaf({ len: 0.55, w: 0.24, shape: "oval", teeth: 10, veins: 3 }), { x: 0.1, y: 0.78, rz: -1.2 })),
    "Blueberry": () => heap(5, () => berry(0.26, { crown: true }), 0.55, { flat: true }),
    "Cassis": () => join(path(bez([-0.2, 1, 0], [0.1, 0.6, 0], [0.2, 0, 0], [0.15, -0.8, 0], 14), 0.05), many(8, () => berry(0.13), (k) => ({ x: 0.2 + (k % 2 ? 0.16 : -0.14), y: 0.6 - k * 0.18, z: jit(0.1) }))),
    "Cherry": () => join(at(ball({ r: 0.4, n: 160, dent: 0.25 }), { x: -0.45, y: -0.5 }), at(ball({ r: 0.4, n: 160, dent: 0.25 }), { x: 0.4, y: -0.6, z: 0.2 }), path(bez([-0.45, -0.1, 0], [-0.4, 0.4, 0], [-0.1, 0.8, 0], [0, 0.9, 0], 12), 0.04), path(bez([0.4, -0.2, 0.2], [0.3, 0.3, 0.1], [0.1, 0.8, 0], [0, 0.9, 0], 12), 0.04), at(leaf({ len: 0.45, w: 0.18, shape: "oval" }), { y: 0.9, rz: -1 })),
    "Cranberry": () => join(at(wave(2.3, 1.4, { amp: 0.035, nx: 28, nz: 10 }), { y: -0.35 }), many(5, () => join(ball({ r: 0.22, sy: 0.92, n: 90 }), at(star(5, 0.06, 0.025), { y: 0.2 })), (k) => ({ x: -0.72 + k * 0.36, y: -0.22 + (k % 2) * 0.03, z: (k % 2 ? 0.28 : -0.12) }))),
    "Dates": () => many(3, () => ball({ r: 0.22, sy: 2.2, n: 90, rough: 0.05, bumps: 16 }), (k) => ({ x: (k - 1) * 0.5, rz: 1.3 + (k - 1) * 0.15, y: (k % 2) * 0.1 })),
    "Dried Fruits": () => join(at(join(path(circle(0.5, 36), 0.05), path(circle(0.38, 30), 0.06, 0.7), many(8, (k) => path([[0.05, 0, 0], [0.36, 0, 0]], 0.06, 0.6), (k) => ({ ry: (k / 8) * TAU }))), { rx: Math.PI / 2, x: -0.35 }), heap(5, () => ball({ r: 0.14, n: 40, rough: 0.25, bumps: 8, lines: false }), 0.35, { flat: true }), at(ball({ r: 0.28, sy: 1.8, n: 80, rough: 0.15, bumps: 10, lines: false }), { x: 0.6, rz: 1.2 })),
    "Fig": () => join(at(turned([[0, -0.7], [0.45, -0.55], [0.55, -0.1], [0.35, 0.35], [0.1, 0.6], [0.06, 0.8]], { seg: 20, mer: 8 }), { x: -0.45 }), at(join(turned([[0, -0.7], [0.45, -0.55], [0.55, -0.1], [0.35, 0.35], [0.1, 0.6]], { seg: 18, mer: 0 }), cloud(40, 0.3, { sy: 1.3 })), { x: 0.55, sz: 0.3, ry: -0.4 })),
    "Goldenberry": () => join(ball({ r: 0.28, n: 80, lines: false }), turned([[0, 0.62], [0.2, 0.45], [0.45, 0.05], [0.4, -0.3], [0.1, -0.5], [0, -0.52]], { seg: 5, mer: 5 })),
    "Green Apple": () => join(apple({ sy: 1.02 }), at(leaf({ len: 0.4, w: 0.16, shape: "oval" }), { x: -0.1, y: 0.85, rz: 1, ry: 1 })),
    "Guava": () => join(at(ball({ r: 0.62, sy: 1.1, pear: 0.15, n: 240 }), { x: -0.45 }), at(join(path(circle(0.55, 44), 0.05), path(circle(0.35, 36), 0.06, 0.7), cloud(30, 0.3, { w: 0.9 })), { rx: Math.PI / 2, x: 0.65, ry: -0.5 })),
    "Japanese Plum": () => join(at(twig(1.8), { rz: 0.3, y: 0.4 }), many(3, () => ball({ r: 0.28, n: 120, ribs: 1, ribDepth: 0.06 }), (k) => ({ x: -0.5 + k * 0.5, y: 0.02 + k * 0.1 - 0.28 }))),
    "Litchi": () => join(at(ball({ r: 0.5, sy: 1.1, n: 240, rough: 0.14, bumps: 16 }), { x: -0.4 }), at(ball({ r: 0.42, sy: 1.1, n: 160 }), { x: 0.55, y: -0.1 })),
    "Mango": () => join(at(ball({ r: 0.7, sx: 0.78, sy: 1.1, sz: 0.66, n: 300, pear: -0.12 }), { rz: 0.45 }), path([[-0.3, 0.65, 0], [-0.36, 0.95, 0]], 0.04), at(leaf({ len: 0.7, w: 0.2, shape: "lance" }), { x: -0.34, y: 0.92, rz: -1.2 })),
    "Maninka": () => join(ball({ r: 0.6, sy: 1.3, n: 280, ribs: 5, ribDepth: 0.14, tip: 0.3 }), path([[0, 0.78, 0], [0.06, 0.98, 0]], 0.04)),
    "Passionfruit": () => join(at(ball({ r: 0.6, n: 260, rough: 0.03 }), { x: -0.45 }), at(join(ball({ r: 0.55, n: 150, cut: 0 }), path(circle(0.55, 44), 0.05), cloud(36, 0.4, { w: 1.1 })), { x: 0.65, rx: Math.PI / 2, ry: -0.3 })),
    "Peach": () => join(ball({ r: 0.72, n: 320, dent: 0.12 }), seam(0.72), at(leaf({ len: 0.6, w: 0.2, shape: "lance" }), { y: 0.7, rz: -1 }), at(leaf({ len: 0.5, w: 0.18, shape: "lance" }), { y: 0.7, ry: 0.5, rz: 1.1 })),
    "Pear": () => join(pearShape(1.05), path([[0, 0.9, 0], [0.08, 1.2, 0]], 0.04)),
    "Plum": () => join(ball({ r: 0.62, sy: 1.12, n: 260 }), seam(0.62, 1.12), path([[0, 0.66, 0], [0.05, 0.92, 0]], 0.04)),
    "Quince": () => join(at(pearShape(1.1), {}), at(ball({ r: 0.72, n: 120, rough: 0.15, bumps: 5, lines: false, w: 0.5 }), { y: -0.2, s: 0.95 }), at(leaf({ len: 0.4, w: 0.2, shape: "oval" }), { y: 0.95, rz: -1 })),
    "Raspberry": () => join(many(40, () => ball({ r: 0.09, n: 12, lines: false }), (k) => { const t = k / 40, a = k * 2.4, h = t * 0.8; const r = 0.42 * Math.sin(Math.PI * (0.25 + t * 0.6)); return { x: Math.cos(a) * r, y: h - 0.4, z: Math.sin(a) * r }; }), at(star(5, 0.35, 0.12), { y: -0.45 })),
    "Red Berries": () => join(at(heap(14, () => ball({ r: 0.08, n: 10, lines: false }), 0.2, { rise: 1.5 }), { x: -0.5 }), many(4, () => berry(0.14), (k) => ({ x: 0.1 + k * 0.2, y: 0.2 - k * 0.15 })), path(bez([0.1, 0.5, 0], [0.3, 0.3, 0], [0.6, 0, 0], [0.8, -0.4, 0], 10), 0.04), at(turned([[0, -0.4], [0.2, -0.2], [0.28, 0.1], [0.2, 0.25], [0, 0.28]], { seg: 14, mer: 6 }), { x: 0.4, y: -0.5 })),
    "Scorched Pineapple": () => join(at(ball({ r: 0.5, sy: 1.35, n: 260, ribs: 12, ribDepth: 0.05 }), { y: -0.35 }), many(9, () => leaf({ len: 0.7, w: 0.08, shape: "lance", veins: 0 }), (k) => ({ y: 0.3, ry: (k / 9) * TAU, rx: -0.35 - (k % 3) * 0.15 })), falling(10, () => part([[0, 0, 0, 1.2]]), 1.2, 0.7)),
    "Strawberry": () => join(turned([[0, -0.75], [0.3, -0.5], [0.5, -0.05], [0.48, 0.3], [0.25, 0.48], [0, 0.5]], { seg: 22, mer: 0 }), many(30, () => part([[0, 0, 0, 0.9]]), (k) => { const t = (k * 0.618) % 1, a = k * 2.4; const y = -0.6 + t * 1, r = y < 0.3 ? 0.52 * Math.sin(Math.PI * ((y + 0.75) / 1.25)) : 0.3; return { x: Math.cos(a) * r, y, z: Math.sin(a) * r }; }), at(star(6, 0.4, 0.14), { y: 0.5 })),
    // ---------------- SPICES ----------------
    "Allspice": () => heap(8, () => berry(0.18, { crown: true }), 0.55, { flat: true }),
    "Anise": () => join(many(8, () => at(pod({ len: 0.55, r: 0.1, bend: 0.1 }), { x: 0.3 }), (k) => ({ ry: (k / 8) * TAU })), ball({ r: 0.08, n: 16, lines: false }), many(8, () => ball({ r: 0.05, sy: 1.6, n: 10, lines: false }), (k) => ({ ry: (k / 8) * TAU, x: Math.cos((k / 8) * TAU) * 0.32, z: Math.sin((k / 8) * TAU) * -0.32, y: 0.08 }))),
    "Black Pepper": () => heap(11, () => ball({ r: 0.15, n: 50, rough: 0.2, bumps: 9, lines: false }), 0.55, { flat: true }),
    "Caraway": () => many(7, () => pod({ len: 0.5, r: 0.06, bend: 0.12 }), (k) => ({ x: jit(0.5), y: jit(0.4), z: jit(0.3), rz: rnd() * TAU, ry: rnd() * TAU })),
    "Cardamom": () => join(ball({ r: 0.35, sy: 1.8, n: 160, ribs: 3, ribDepth: 0.15, tip: 0.5 }), at(heap(6, () => ball({ r: 0.07, n: 10, lines: false }), 0.2), { x: 0.75, y: -0.5 })),
    "Cassia": () => at(quill({ len: 1.8, turns: 1.1 }), { rz: 0.3 }),
    "Chilli": () => join(pod({ len: 1.8, r: 0.16, bend: 0.35 }), at(join(ball({ r: 0.13, sy: 0.6, n: 30, lines: false }), path([[0, 0, 0], [-0.15, 0.3, 0]], 0.04)), { x: -0.92, y: 0.05 })),
    "Cinnamon": () => many(3, () => quill({ len: 1.8, turns: 2.2 }), (k) => ({ y: (k % 2) * 0.2 - 0.1, z: (k - 1) * 0.35, ry: (k - 1) * 0.1 })),
    "Clove": () => many(3, () => join(path([[0, -0.6, 0], [0, 0.2, 0]], 0.04), at(star(4, 0.12, 0.05), { y: 0.2 }), at(ball({ r: 0.1, n: 30, lines: false }), { y: 0.3 })), (k) => ({ x: (k - 1) * 0.45, rz: (k - 1) * 0.3, ry: k })),
    "Coriander": () => heap(8, () => ball({ r: 0.16, n: 60, ribs: 10, ribDepth: 0.06 }), 0.5, { flat: true }),
    "Cumin": () => many(8, () => ball({ r: 0.07, sy: 3.2, n: 40, ribs: 6, ribDepth: 0.08, tip: 1 }), (k) => ({ x: jit(0.6), y: jit(0.4), z: jit(0.4), rz: rnd() * TAU, rx: rnd() * TAU })),
    "Fenugreek": () => many(10, () => box(0.14, 0.2, 0.1, { step: 0.04 }), (k) => ({ x: jit(0.6), y: jit(0.3), z: jit(0.5), ry: rnd() * TAU, rz: jit(0.6) })),
    "Ginger": () => roots({ n: 5, len: 0.9, r: 0.2, bumps: 2 }),
    "Nutmeg": () => join(ball({ r: 0.55, sy: 1.25, n: 220 }), many(10, () => path(curve((t) => [Math.sin(t * Math.PI) * 0.58, (t - 0.5) * 1.4, 0], 12), 0.05, 0.7), (k) => ({ ry: (k / 10) * TAU + jit(0.2) }))),
    "Pink Pepper": () => join(path(bez([0, -1, 0], [0.1, -0.2, 0], [-0.1, 0.4, 0], [0.1, 0.9, 0], 12), 0.05), many(5, () => join(path([[0, 0, 0], [0.4, 0.2, 0]], 0.05), at(heap(4, () => berry(0.08), 0.1), { x: 0.4, y: 0.2 })), (k) => ({ y: -0.5 + k * 0.3, ry: k * 2.2 }))),
    "Saffron": () => join(flower({ n: 6, len: 0.55, w: 0.2, cup: 1.1 }), many(3, (k) => path(bez([0, 0, 0], [0.05, 0.4, 0], [0.2, 0.6, 0], [0.3 + k * 0.1, 0.95, 0], 12), 0.035, 1.2), (k) => ({ ry: (k / 3) * TAU })), at(stem(0.9, 0), { y: -0.9 })),
    "Spices": () => join(at(many(8, () => at(pod({ len: 0.4, r: 0.07, bend: 0.08 }), { x: 0.22 }), (k) => ({ ry: (k / 8) * TAU })), { x: -0.55, y: 0.3 }), at(quill({ len: 1.2, turns: 1.8 }), { y: -0.4, s: 0.9 }), at(heap(5, () => ball({ r: 0.1, n: 24, rough: 0.2, lines: false }), 0.25), { x: 0.6, y: 0.35 })),
    "Turmeric": () => roots({ n: 6, len: 0.8, r: 0.13, bumps: 5 }),
    "Wasabi": () => join(at(ball({ r: 0.25, sy: 2.6, n: 160, rough: 0.12, bumps: 14 }), { y: -0.3 }), many(3, (k) => path(bez([0, 0, 0], [0, 0.3, 0], [(k - 1) * 0.3, 0.6, 0], [(k - 1) * 0.5, 0.9, 0], 10), 0.05), (k) => ({ y: 0.35 })), many(3, () => leaf({ len: 0.4, w: 0.3, shape: "heart", veins: 0 }), (k) => ({ x: (k - 1) * 0.5, y: 1.25, rz: (1 - k) * 0.5 }))),
    "Water Pepper": () => join(stem(1.8, 0.15), many(3, () => leaf({ len: 0.6, w: 0.12, shape: "lance" }), (k) => ({ y: 0.3 + k * 0.35, rz: k % 2 ? 1.2 : -1.2 })), at(many(8, () => ball({ r: 0.04, n: 8, lines: false }), (k) => ({ y: k * 0.08, x: Math.sin(k) * 0.02 })), { y: 1.8, x: 0.2, rz: -0.5 })),
    // ---------------- GOURMAND ----------------
    "Almond": () => join(many(2, () => ball({ r: 0.35, sy: 1.6, sz: 0.55, n: 110, tip: 0.8, rough: 0.05, bumps: 16 }), (k) => ({ x: k * 0.55 - 0.5, rz: (k - 0.5) * 0.5 })), at(join(ball({ r: 0.38, sy: 1.6, sz: 0.6, n: 90, tip: 0.8, cut: 0 }), path(circle(0.38, 24).map((p) => [p[0], p[2] * 1.6, 0]), 0.05)), { x: 0.75, y: -0.1, ry: -0.6 })),
    "Baked Apple": () => join(apple({ leaf: false }), smoke(3, 1)),
    "Balsamic Vinegar": () => join(bottle({ profile: [[0, -1], [0.42, -1], [0.5, -0.7], [0.5, -0.2], [0.32, 0.25], [0.12, 0.45], [0.1, 0.8], [0.14, 0.85], [0, 0.85]] }), at(drop(0.12), { x: 0.75, y: -0.6 })),
    "Barley": () => ear({ rows: 8, awns: 0.8 }),
    "Beeswax": () => join(box(1.5, 0.5, 0.9, { step: 0.07 }), at(hexes(3, 6, 0.14), { z: 0.451 })),
    "Black Walnut": () => join(many(2, () => ball({ r: 0.45, sx: 0.8, n: 220, rough: 0.18, bumps: 10, cut: 0.02 }), (k) => ({ ry: k * Math.PI, x: 0 })), path(circle(0.45, 36).map((p) => [p[0] * 0.8, p[2], 0]), 0.05)),
    "Bread": () => join(ball({ r: 0.6, sx: 1.7, sy: 0.72, n: 360 }), path([[-1.02, -0.02, 0], [1.02, -0.02, 0]], 0.05, 0.6), many(3, () => path(bez([-0.2, 0, 0], [-0.07, 0.04, 0], [0.07, 0.04, 0], [0.2, 0, 0], 8), 0.025, 1.3), (k) => ({ x: (k - 1) * 0.55, y: 0.4, z: 0.1, ry: 0.5, rz: 0.15 }))),
    "Brown Sugar": () => heap(40, () => box(0.08, 0.08, 0.08, { step: 0.04 }), 0.8, { rise: 1.4 }),
    "Butter": () => join(box(1.2, 0.5, 0.7, { step: 0.06 }), at(path(curve((t) => [Math.cos(t * 3.4) * 0.12 * (1 + t), t * 0.1, Math.sin(t * 3.4) * 0.3], 30), 0.03), { y: 0.3 })),
    "Butterscotch": () => join(ball({ r: 0.4, sx: 1.1, sy: 0.5, n: 140 }), at(turned([[0.02, 0], [0.12, 0.2], [0.26, 0.42]], { seg: 10, mer: 6 }), { x: 0.55, rz: -Math.PI / 2 }), at(turned([[0.02, 0], [0.12, 0.2], [0.26, 0.42]], { seg: 10, mer: 6 }), { x: -0.55, rz: Math.PI / 2 })),
    "Cacao": () => join(at(ball({ r: 0.4, sy: 1.95, n: 300, ribs: 10, ribDepth: 0.12, tip: 0.55 }), { x: -0.35, y: 0.05, rz: -0.45 }), path([[-0.05, 0.75, 0], [0.12, 0.98, 0]], 0.04, 1), many(2, () => join(ball({ r: 0.17, sy: 1.5, sz: 0.62, n: 70, lines: false }), path(curve((t) => [0, (t - 0.5) * 0.44, 0.1], 8), 0.03, 1.1)), (k) => ({ x: 0.55 + k * 0.28, y: -0.55 + k * 0.12, rz: 0.9 - k * 0.5 }))),
    "Caramel": () => join(many(3, () => box(0.4, 0.4, 0.4, { step: 0.05 }), (k) => ({ x: (k - 1) * 0.52, y: k === 1 ? 0.45 : 0, ry: k * 0.4 })), at(path(bez([0, 0, 0], [0.05, -0.2, 0], [-0.05, -0.4, 0], [0, -0.55, 0], 8), 0.03), { x: 0.3, y: -0.2 }), at(drop(0.08), { x: 0.3, y: -0.7 })),
    "Carob Pods": () => many(2, () => pod({ len: 1.9, r: 0.16, flat: 0.35, bend: 0.3, bumps: 8 }), (k) => ({ y: k * 0.4 - 0.2, rx: k * 0.5, rz: (k - 0.5) * 0.2 })),
    "Chantilly Cream": () => many(5, (k) => path(curve((t) => { const a = t * 4 * TAU + k * (TAU / 5), r = 0.55 * (1 - t); return [Math.cos(a) * r, t * 1.1 - 0.5, Math.sin(a) * r]; }, 90), 0.045), () => ({})),
    "Chocolate": () => join(box(1.6, 0.14, 1, { step: 0.06 }), many(3, (k) => path([[-0.8, 0.075, (k - 1) * 0.33 + 0.165 - 0.165], [0.8, 0.075, (k - 1) * 0.33 + 0.165 - 0.165]], 0.07, 0.7), () => ({})), many(3, (k) => path([[(k - 1) * 0.4, 0.075, -0.5], [(k - 1) * 0.4, 0.075, 0.5]], 0.07, 0.7), () => ({}))),
    "Chocolate Cake": () => join(box(1.2, 0.9, 0.9, { step: 0.07 }), many(2, (k) => path([[-0.6, -0.15 + k * 0.3, 0.451], [0.6, -0.15 + k * 0.3, 0.451]], 0.05), () => ({})), at(ball({ r: 0.15, n: 30, lines: false }), { y: 0.55 })),
    "Cocoa Butter": () => join(turned([[0, -0.15], [0.7, -0.15], [0.7, 0.15], [0, 0.15]], { seg: 26, mer: 0, rings: true }), at(star(6, 0.35, 0.2), { y: 0.16 })),
    "Cocoa Pod": () => ball({ r: 0.55, sy: 1.7, n: 320, ribs: 10, ribDepth: 0.08, tip: 0.6 }),
    "Condensed Milk": () => join(turned([[0, -0.7], [0.5, -0.7], [0.5, 0.5], [0, 0.5]], { seg: 22, mer: 6, rings: true }), at(path(bez([0.4, 0.5, 0], [0.8, 0.6, 0], [0.9, 0.2, 0], [0.9, -0.6, 0], 12), 0.04), {}), at(drop(0.1), { x: 0.9, y: -0.8 })),
    "Coumarin": () => join(stem(1.8, 0.05), many(4, (k) => many(8, () => leaf({ len: 0.35 - k * 0.04, w: 0.08, shape: "lance", veins: 0 }), (j) => ({ ry: (j / 8) * TAU, rz: 1.35 })), (k) => ({ y: 0.4 + k * 0.4 })), at(florets(5, 0.1), { y: 1.8 })),
    "Edamame": () => join(pod({ len: 1.6, r: 0.2, flat: 0.6, bend: 0.25, bumps: 3 }), many(3, () => ball({ r: 0.14, n: 30, lines: false }), (k) => ({ x: (k - 1) * 0.5, y: 0.2, z: 0.18 }))),
    "Halva": () => join(box(1.3, 0.8, 0.8, { step: 0.07 }), many(7, (k) => path(curve((t) => [-0.65 + t * 1.3, -0.3 + k * 0.1 + Math.sin(t * 8 + k) * 0.015, 0.41], 14), 0.05, 0.6), () => ({}))),
    "Hazelnut": () => many(2, () => join(ball({ r: 0.35, n: 130, pear: 0.1 }), at(many(10, () => petal({ len: 0.28, w: 0.1, shape: "lance", curl: 0.4 }), (j) => ({ ry: (j / 10) * TAU, rx: -1 })), { y: -0.2 })), (k) => ({ x: (k - 0.5) * 0.9, rz: (k - 0.5) * 0.4, y: k * 0.1 })),
    "Holy Bread": () => flat([[-0.13, -1], [0.13, -1], [0.13, 0.26], [0.54, 0.26], [0.54, 0.54], [0.13, 0.54], [0.13, 0.95], [-0.13, 0.95], [-0.13, 0.54], [-0.54, 0.54], [-0.54, 0.26], [-0.13, 0.26]], { depth: 0.22, fill: 280, corners: true }),
    "Honey": () => join(turned([[0.1, 0], [0.25, 0.05], [0.28, 0.2], [0.25, 0.35], [0.28, 0.5], [0.25, 0.62], [0.1, 0.68]], { seg: 16, mer: 6, rings: true }), path([[0, 0.68, 0], [0, 1.5, 0]], 0.05), at(path(bez([0, 0, 0], [0, -0.3, 0], [0.02, -0.5, 0], [0, -0.7, 0], 8), 0.04), {}), at(drop(0.1), { y: -0.85 })),
    "Honeycomb": () => join(hexes(5, 5, 0.2), many(4, () => drop(0.07), (k) => ({ x: -0.35 + k * 0.25, y: -0.95 - (k % 2) * 0.1 }))),
    "Icing": () => at(join(torus(0.52, 0.26, 460), path(curve((t) => { const a = t * TAU, R = 0.72 + 0.07 * Math.sin(a * 9); return [Math.cos(a) * R, 0.12 + 0.05 * Math.sin(a * 9), Math.sin(a) * R]; }, 120), 0.03, 1.2), many(14, () => path([[-0.04, 0, 0], [0.04, 0, 0]], 0.02, 1.4), (k) => { const u = k * 2.4, R = 0.5 + 0.12 * Math.sin(k * 1.7); return { x: Math.cos(u) * R, y: 0.25, z: Math.sin(u) * R, ry: k }; })), { rx: 1.0 }),
    // MALTED MILK BALLS: malt's sweet, toasted smell as most people know it — one whole, one bitten through to its crumb.
    "Malt": () => join(at(ball({ r: 0.5, n: 320, rough: 0.04, bumps: 12 }), { x: -0.42, y: 0.12 }), at(join(ball({ r: 0.5, n: 220, cut: 0, lines: false }), path(hoop(0.5, 48), 0.04, 1.1), path(hoop(0.43, 44), 0.06, 0.7), hexes(5, 5, 0.075)), { x: 0.5, y: -0.28, ry: -0.45 })),
    "Maple": () => join(many(5, (k) => leaf({ len: 0.75 - Math.abs(k - 2) * 0.12, w: 0.2, shape: "lance", lobes: 2, veins: 1 }), (k) => ({ rz: (k - 2) * 0.72 })), path([[0, 0, 0], [0, -0.5, 0]], 0.04), at(drop(0.1), { x: 0.5, y: -0.55 })),
    "Milk": () => join(turned([[0, -0.9], [0.38, -0.9], [0.44, 0.7]], { seg: 22, mer: 6, rings: true }), turned([[0, 0.25], [0.42, 0.25]], { seg: 20, mer: 0 }), at(drop(0.1), { x: 0.2, y: 1 })),
    "Molasses": () => join(turned([[0, 0], [0.25, 0.04], [0.32, 0.12], [0.3, 0.2]], { seg: 14, mer: 4 }), path([[0.25, 0.1, 0], [1.1, 0.5, 0]], 0.05), path(bez([0, 0, 0], [0.03, -0.4, 0], [-0.03, -0.8, 0], [0, -1.1, 0], 12), 0.035, 1.2), at(drop(0.12), { y: -1.2 })),
    "Murumuru Butter": () => join(path([[0, -1, 0], [0, 0.6, 0]], 0.06), many(16, () => ball({ r: 0.13, sy: 1.4, n: 30, lines: false }), (k) => { const a = k * 2.4, y = -0.4 + (k / 16) * 0.9; return { x: Math.cos(a) * 0.25, y, z: Math.sin(a) * 0.25 }; })),
    "Oat": () => join(path(bez([0, -1, 0], [0, 0, 0], [0.1, 0.6, 0], [0.2, 1, 0], 14), 0.05), many(7, () => join(path([[0, 0, 0], [0.3, -0.15, 0]], 0.04, 0.6), at(ball({ r: 0.06, sy: 2.2, n: 16, lines: false }), { x: 0.32, y: -0.25 })), (k) => ({ y: 0.2 + k * 0.12, ry: k * 2.2 }))),
    "Pistachio": () => many(3, () => join(ball({ r: 0.3, sy: 1.4, n: 90, tip: 0.3, cut: 0.1 }), at(ball({ r: 0.2, sy: 1.3, n: 40, lines: false }), { z: 0.1 })), (k) => ({ x: (k - 1) * 0.6, ry: k * 0.8, rz: (k - 1) * 0.4 })),
    "Potato": () => join(ball({ r: 0.6, sx: 1.45, sy: 0.9, n: 320, rough: 0.12, bumps: 4 }), many(5, () => path(circle(0.04, 8), 0.02), (k) => ({ x: jit(0.6), y: 0.5 + jit(0.05), z: jit(0.3) }))),
    "Raisin Cookies": () => many(2, () => join(turned([[0, -0.1], [0.65, -0.08], [0.68, 0.04], [0, 0.1]], { seg: 24, mer: 0, rings: true }), many(6, () => ball({ r: 0.06, n: 12, rough: 0.3, lines: false }), (j) => ({ x: Math.cos(j * 2.4) * 0.4 * Math.sqrt(j / 6 + 0.1), y: 0.1, z: Math.sin(j * 2.4) * 0.4 * Math.sqrt(j / 6 + 0.1) }))), (k) => ({ y: k * 0.25, x: k * 0.2, ry: k })),
    "Rice": () => join(turned([[0, -0.4], [0.45, -0.35], [0.7, 0], [0.72, 0.05]], { seg: 26, mer: 6, rings: true }), heap(40, () => ball({ r: 0.04, sy: 2.4, n: 10, lines: false }), 0.6, { rise: 0.3 })),
    "Seed Cake": () => join(box(1.4, 0.7, 0.7, { step: 0.07 }), many(24, () => part([[0, 0, 0, 1.2]]), (k) => ({ x: jit(0.65), y: jit(0.33), z: 0.36 }))),
    "Sugar": () => join(at(cube(0.5), { x: -0.3 }), at(cube(0.5), { x: 0.3, ry: 0.3 }), at(cube(0.5), { y: 0.52, ry: 0.8 })),
    "Tobacco": () => leaf({ len: 1.9, w: 0.55, shape: "broad", veins: 7, curl: 0.35 }),
    "Toffee": () => join(at(flat([[-0.5, -0.3], [0.4, -0.45], [0.55, 0.1], [0.1, 0.42], [-0.45, 0.25]], { depth: 0.14, fill: 110, corners: true }), { x: -0.3, rx: -0.5 }), at(flat([[-0.35, -0.25], [0.35, -0.3], [0.3, 0.3], [-0.2, 0.35]], { depth: 0.14, fill: 80, corners: true }), { x: 0.55, y: 0.25, rx: -0.4, rz: 0.4 }), at(flat([[-0.2, -0.2], [0.25, -0.15], [0.1, 0.25]], { depth: 0.14, fill: 40, corners: true }), { x: 0.35, y: -0.45, rx: -0.6, rz: -0.3 })),
    "Tonka": () => { const bean = (k) => { const d = []; for (let j = 0; j < 5; j++) { const c = -0.7 + j * 0.35, y0 = -0.4 + (j % 3) * 0.1, y1 = 0.25 + ((j + k) % 2) * 0.15; d.push(path(curve((t) => { const y = y0 + (y1 - y0) * t, f = Math.sqrt(Math.max(0, 1 - Math.pow(y / 0.5, 2))), cc = Math.max(-0.95, Math.min(0.95, c + Math.sin(y * 16 + j * 2 + k) * 0.18)); return [cc * 0.21 * f, y, Math.sqrt(1 - cc * cc) * 0.2 * f + 0.005]; }, 16), 0.03, 0.75)); } return join(ball({ r: 0.21, sy: 2.4, n: 150, rough: 0.16, bumps: 30, tip: 0.25, lines: false }), ...d); }; return many(3, bean, (k) => [{ x: 0.12, y: 0.5, rz: 1.45 }, { x: -0.12, y: 0.02, rz: 1.68 }, { x: 0.1, y: -0.46, rz: 1.52 }][k]); },
    "Vanilla": () => many(3, () => pod({ len: 1.9, r: 0.06, bend: 0.18 }), (k) => ({ y: (k - 1) * 0.16, rx: (k - 1) * 0.4, rz: (k - 1) * 0.08 })),
    "Wheat": () => join(ear({ rows: 10, awns: 0.35 }), at(ear({ rows: 8, awns: 0.3 }), { x: 0.35, rz: -0.25, s: 0.85 })),
    // ---------------- BREWS ----------------
    "Absinthe": () => join(glass({ profile: [[0, -0.9], [0.3, -0.9], [0.05, -0.85], [0.05, -0.3], [0.35, -0.2], [0.42, 0.6]] }), at(box(1.3, 0.02, 0.28, { step: 0.05 }), { y: 0.62 }), at(cube(0.2), { y: 0.74 })),
    "Amaretto": () => join(turned([[0, -1], [0.5, -1], [0.5, 0.2], [0.35, 0.4], [0.12, 0.5], [0.12, 0.8], [0.2, 0.9], [0, 0.95]], { seg: 6, mer: 6, rings: true }), at(ball({ r: 0.18, sy: 1.5, sz: 0.6, n: 40, tip: 0.8, lines: false }), { x: 0.8, y: -0.8, rz: 1.2 })),
    "Coffee": () => join(cup({ saucer: true, steam: true }), at(heap(3, () => ball({ r: 0.12, sy: 1.4, sz: 0.8, n: 30, lines: false }), 0.2), { x: 0.9, y: -0.35 })),
    "Cognac": () => glass({ profile: [[0, -0.9], [0.35, -0.9], [0.05, -0.85], [0.05, -0.5], [0.3, -0.45], [0.6, -0.15], [0.62, 0.15], [0.45, 0.5], [0.36, 0.62]] }),
    "Cola": () => join(bottle({ profile: [[0, -1], [0.35, -1], [0.4, -0.8], [0.32, -0.4], [0.4, 0], [0.34, 0.3], [0.12, 0.65], [0.12, 0.95], [0, 0.95]] }), falling(8, () => path(circle(0.04, 8), 0.02), 1.2, 0.2)),
    "Green Tea": () => join(turned([[0, -0.4], [0.35, -0.4], [0.6, -0.1], [0.66, 0.35]], { seg: 22, mer: 6, rings: true }), at(leaf({ len: 0.45, w: 0.16, shape: "oval", teeth: 10 }), { x: 0.2, y: 0.36, rx: -1.5 })),
    "Herbal Tea": () => join(cup({ steam: true }), at(sprig({ h: 0.8, pairs: 2, size: 0.3 }), { x: 0.2, y: 0.3, rz: -0.5 })),
    "Jasmine Tea": () => join(cup({ handle: false }), at(flower({ n: 5, len: 0.22, w: 0.1, shape: "lance", cup: 0.1 }), { y: 0.3 })),
    "Lapsang Souchong": () => join(cup({ saucer: true }), at(smoke(3, 1.1), { y: 0.4 })),
    "Liquor": () => join(bottle(), at(glass({ profile: [[0, -0.3], [0.2, -0.3], [0.24, 0.1]] }), { x: 0.8, y: -0.7 })),
    "Masala Chai": () => join(turned([[0, -0.6], [0.3, -0.6], [0.42, 0.4]], { seg: 20, mer: 6, rings: true }), at(star(8, 0.25, 0.1), { x: 0.75, y: -0.55 }), at(quill({ len: 0.8, turns: 1.5 }), { x: 0.6, y: -0.35, s: 0.7, rz: 0.4 }), at(smoke(2, 0.8), { y: 0.4 })),
    "Maté": () => join(turned([[0, -0.8], [0.4, -0.7], [0.55, -0.3], [0.52, 0.1], [0.3, 0.35], [0.28, 0.45]], { seg: 20, mer: 8, rings: true }), path([[0.05, 0, 0], [0.35, 1.1, 0]], 0.04), at(turned([[0.08, 0], [0.1, 0.1], [0, 0.12]], { seg: 10, mer: 2 }), { x: 0.07, y: 0.05 })),
    "Moroccan Tea": () => join(turned([[0, -0.6], [0.45, -0.6], [0.55, -0.3], [0.5, 0.05], [0.25, 0.3], [0.2, 0.45], [0.28, 0.55], [0.05, 0.75]], { seg: 20, mer: 8, rings: true }), path(bez([0.5, -0.3, 0], [0.8, -0.2, 0], [0.9, 0.2, 0], [1.1, 0.35, 0], 12), 0.04), path(bez([-0.5, 0.05, 0], [-0.9, 0.1, 0], [-0.9, -0.4, 0], [-0.5, -0.4, 0], 12), 0.04), at(sprig({ h: 0.5, pairs: 2, size: 0.25 }), { x: 0.05, y: 0.75 })),
    "Oolong Tea": () => join(heap(8, () => ball({ r: 0.12, n: 26, rough: 0.35, bumps: 7, lines: false }), 0.5, { flat: true }), at(leaf({ len: 0.7, w: 0.25, shape: "oval", teeth: 10, curl: 0.4 }), { y: 0.2, rz: -0.6 })),
    "Root Beer": () => join(turned([[0, -0.8], [0.45, -0.8], [0.45, 0.4]], { seg: 20, mer: 6, rings: true }), at(ball({ r: 0.46, sy: 0.35, n: 90, rough: 0.2, lines: false }), { y: 0.45 }), path(bez([0.45, 0.2, 0], [0.8, 0.2, 0], [0.8, -0.5, 0], [0.45, -0.5, 0], 12), 0.05)),
    "Rum": () => bottle({ profile: [[0, -1], [0.55, -1], [0.6, -0.6], [0.55, -0.1], [0.3, 0.2], [0.12, 0.35], [0.12, 0.8], [0, 0.82]] }),
    "Soda Bubbles": () => many(18, (k) => path(circle(0.04 + (k % 5) * 0.03, 14), 0.025), (k) => ({ x: jit(0.5), y: -1 + (k / 18) * 2, z: jit(0.4), rx: Math.PI / 2 })),
    "Sparkling Water": () => join(turned([[0, -1], [0.34, -1], [0.4, 0.9]], { seg: 20, mer: 6, rings: true }), many(14, (k) => path(circle(0.025 + (k % 3) * 0.015, 10), 0.02), (k) => ({ x: jit(0.22), y: -0.9 + (k / 14) * 1.6, z: jit(0.2), rx: Math.PI / 2 }))),
    "Tea": () => cup({ saucer: true, steam: true }),
    // ---------------- WOODS ----------------
    // A MABKHARA, the burner oud and amber are smoked on: a square foot and stem, a flared square bowl, chips of the wood, and the smoke.
    "Amber Oud": () => { const bowl = [[-0.17, -0.26, -0.17], [0.17, -0.26, -0.17], [0.17, -0.26, 0.17], [-0.17, -0.26, 0.17]], top = bowl.map(([x, , z]) => [x * 2.6, 0.08, z * 2.6]); const edges = []; for (let k = 0; k < 4; k++) { edges.push(path([bowl[k], bowl[(k + 1) % 4]], 0.06), path([top[k], top[(k + 1) % 4]], 0.05), path([bowl[k], top[k]], 0.05)); } return join(at(box(0.84, 0.14, 0.84, { fill: 30 }), { y: -0.86 }), at(box(0.26, 0.46, 0.26, { fill: 16 }), { y: -0.56 }), ...edges, at(chunk(0.32), { x: -0.08, y: 0.16, ry: 0.5 }), at(chunk(0.24), { x: 0.2, y: 0.13, ry: 1.7 }), at(smoke(3, 0.85), { y: 0.26 })); },
    "Amberwood": () => join(at(disc(0.9, 6, 0), { rx: Math.PI / 2 }), at(path(circle(0.9, 50), 0.05), { rx: Math.PI / 2, z: -0.25 }), many(8, (k) => path([[Math.cos(k * 0.785) * 0.9, Math.sin(k * 0.785) * 0.9, 0], [Math.cos(k * 0.785) * 0.9, Math.sin(k * 0.785) * 0.9, -0.25]], 0.05), () => ({}))),
    "Amyris": () => join(at(twig(1.8), { rz: 0.3 }), many(3, () => join(path([[0, 0, 0], [0.3, 0.3, 0]], 0.04), many(3, () => leaf({ len: 0.3, w: 0.12, shape: "oval" }), (j) => ({ x: 0.3, y: 0.3, rz: (j - 1) * 0.9 }))), (k) => ({ x: -0.6 + k * 0.55, y: -0.15 + k * 0.15, ry: k * 2 }))),
    "Bark": () => join(sheet(1.2, 1.8, { bend: 0.6 }), many(7, (k) => path(curve((t) => [-0.55 + k * 0.18 + Math.sin(t * 9 + k) * 0.03, -0.9 + t * 1.8, 0.6 * 1.2 * Math.pow(-0.55 + k * 0.18, 2)], 16), 0.06, 0.6), () => ({}))),
    "Birch": () => join(at(lathe([[0.32, -1], [0.3, 1]], { seg: 20, mer: 6 }), {}), many(10, () => path([[-0.1, 0, 0.3], [0.1, 0, 0.3]], 0.03, 1.1), (k) => ({ y: -0.9 + k * 0.19, ry: k * 1.9 }))),
    "Cashmeran": () => join(ball({ r: 0.62, n: 120, lines: false, w: 0.6 }), many(9, (k) => path(curve((t) => { const a = t * TAU; return [Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0]; }, 40), 0.05), (k) => ({ rx: k * 0.35, ry: k * 0.7 })), path(bez([0.5, -0.4, 0.2], [0.9, -0.7, 0], [1.1, -0.2, 0], [1.3, -0.8, 0], 12), 0.04)),
    "Cedarwood": () => log({ r: 0.4, len: 1.7, rings: 5 }),
    "Cypriol": () => join(path(bez([-1, -0.2, 0], [-0.4, 0.1, 0], [0.3, -0.3, 0], [1, 0, 0], 16), 0.06), many(4, () => ball({ r: 0.16, sy: 1.5, n: 40, rough: 0.1, lines: false }), (k) => ({ x: -0.8 + k * 0.55, y: -0.1 + (k % 2) * 0.1 - 0.15, rz: 1.2 })), many(8, () => path([[0, 0, 0], [jit(0.15), -0.35, 0]], 0.04, 0.5), (k) => ({ x: -0.8 + k * 0.25, y: -0.2 }))),
    "Edelwood Oil": () => join(at(log({ r: 0.25, len: 1.2, rings: 3 }), { y: -0.5 }), at(drop(0.18), { y: 0.45 })),
    "Guaiac Wood": () => join(at(log({ r: 0.3, len: 1.5, rings: 4 }), { y: -0.5 }), at(smoke(3, 1.2), { y: -0.2 })),
    "Mahogany": () => join(box(1.8, 0.2, 0.6, { step: 0.06 }), many(6, (k) => path(curve((t) => [-0.9 + t * 1.8, 0.101, -0.25 + k * 0.1 + Math.sin(t * 6 + k) * 0.03], 20), 0.07, 0.6), () => ({}))),
    "Moldy Cedarwood": () => join(log({ r: 0.35, len: 1.6, rings: 4 }), many(14, () => join(path([[0, 0, 0], [0, 0.18, 0]], 0.04, 0.5), at(ball({ r: 0.03, n: 6, lines: false }), { y: 0.2 })), (k) => ({ x: -0.7 + k * 0.1, y: 0.33, z: jit(0.15) }))),
    "Oak": () => join(at(join(ball({ r: 0.3, sy: 1.3, n: 90, tip: 0.3 }), at(ball({ r: 0.33, sy: 0.55, n: 60, rough: 0.2, bumps: 12, cut: 5 }), { y: 0.25 }), path([[0, 0.4, 0], [0.02, 0.55, 0]], 0.03)), { x: -0.55, y: -0.3 }), at(leaf({ len: 1.2, w: 0.38, shape: "oval", lobes: 3.5, veins: 4 }), { x: 0.35, y: -0.6, rz: -0.2 })),
    "Oud": () => join(at(chunk(0.85), { x: -0.3, y: -0.35, ry: 0.4 }), at(chunk(0.6), { x: 0.4, y: -0.45, ry: 1.5 }), at(chunk(0.45), { x: 0.05, y: -0.05, ry: 2.1 }), at(smoke(2, 1.1), { y: 0.05, s: 0.8 })),
    "Patchouli": () => sprig({ h: 1.5, pairs: 3, shape: "oval", size: 0.7, wide: 0.6, teeth: 9, veins: 3 }),
    "Petrified Driftwood": () => join(pod({ len: 2, r: 0.2, bend: 0.4, bumps: 3, blunt: true }), at(pod({ len: 0.8, r: 0.1, bend: 0.1, blunt: true }), { x: 0.3, y: 0.55, rz: 0.8 })),
    "Pineboard": () => many(3, () => box(1.8, 0.14, 0.45, { step: 0.07 }), (k) => ({ y: k * 0.16, x: (k % 2) * 0.1, ry: (k - 1) * 0.12 })),
    // A SANDALWOOD FAN, the thing the wood is best known for: pleated ribs from a rivet, pierced, with its tassel.
    "Sandalwood": () => { const px = 0, py = -0.72, L = 1.3, span = 1.8, n = 15, ends = [], inner = [], parts = []; for (let k = 0; k < n; k++) { const a = Math.PI / 2 - span / 2 + (k / (n - 1)) * span, z = k % 2 ? 0.05 : -0.05; ends.push([px + Math.cos(a) * L, py + Math.sin(a) * L, z]); inner.push([px + Math.cos(a) * L * 0.42, py + Math.sin(a) * L * 0.42, z * 0.4]); parts.push(path([[px + Math.cos(a) * 0.06, py + Math.sin(a) * 0.06, 0], [px + Math.cos(a) * L, py + Math.sin(a) * L, z]], 0.035, 0.9)); } parts.push(path(ends, 0.03, 1.1), path(inner, 0.04, 0.8)); const d = []; for (let k = 0; k < n - 1; k++) for (let j = 0; j < 5; j++) { const a = Math.PI / 2 - span / 2 + ((k + 0.5) / (n - 1)) * span, r = L * (0.5 + j * 0.1); d.push([px + Math.cos(a) * r, py + Math.sin(a) * r, 0, (j + k) % 2 ? 0.5 : 1.2]); } parts.push(part(d), flat(moved(oval(0.05, 0.05, 14), px, py), { depth: 0.14, fill: 6 }), path([[px, py, 0], [px, py - 0.14, 0]], 0.02, 0.9), at(strands(8, 0.26, { spread: 0.02, fan: 0.3 }), { x: px, y: py - 0.14 })); return join.apply(null, parts); },
    "Sawdust": () => join(heap(60, () => part([[0, 0, 0, 0.9]]), 0.9, { rise: 1 }), many(3, (k) => path(curve((t) => [Math.cos(t * 3 * TAU) * 0.15, t * 0.2, Math.sin(t * 3 * TAU) * 0.15], 30), 0.03), (k) => ({ x: (k - 1) * 0.55, y: 0.4, rz: jit(0.6) }))),
    "Teak Wood": () => join(box(1.6, 0.9, 0.12, { step: 0.07 }), many(8, (k) => path(curve((t) => [-0.8 + t * 1.6, -0.38 + k * 0.11 + Math.sin(t * 5 + k * 0.7) * 0.04, 0.061], 20), 0.06, 0.6), () => ({}))),
    "Vetiver": () => join(blades(8, 0.9, { spread: 0.15 }), strands(22, 1.1, { fan: 0.9, amp: 0.08 })),
    "Willow Bark": () => many(3, () => at(quill({ len: 1.5, turns: 0.9 }), {}), (k) => ({ y: (k - 1) * 0.42, rz: (k - 1) * 0.2, ry: k * 0.5 })),
    "Woody Notes": () => join(at(log({ r: 0.3, len: 1.6, rings: 4 }), { y: -0.35 }), at(log({ r: 0.24, len: 1.3, rings: 3 }), { y: 0.2, ry: 0.5 })),
    // ---------------- CONIFERS ----------------
    "Black Hemlock": () => join(tree({ h: 2, tiers: 6, r: 0.7, droop: 0.25 }), at(path(bez([0, 0, 0], [0, 0.2, 0], [0.15, 0.3, 0], [0.3, 0.25, 0], 8), 0.04), { y: 2 })),
    "Cedar Leaf": () => join(path([[0, -1, 0], [0, 1, 0]], 0.05), many(10, (k) => frond(0.5 - Math.abs(k - 5) * 0.04, 6), (k) => ({ y: -0.8 + Math.floor(k / 2) * 0.35, rz: k % 2 ? 1 : -1 }))),
    "Cypress": () => tree({ h: 2.2, tiers: 7, r: 0.35, narrow: 0.5, step: 0.35 }),
    "Fir": () => tree({ h: 2, tiers: 6, r: 0.8 }),
    "Juniper": () => join(path(bez([0, -1, 0], [0.05, -0.3, 0], [-0.05, 0.3, 0], [0.02, 1, 0], 14), 0.05, 0.8), many(24, () => leaf({ len: 0.3, w: 0.03, shape: "needle", veins: 0 }), (k) => ({ y: -0.85 + Math.floor(k / 3) * 0.24, rx: 0.9, ry: (k % 3) * (TAU / 3) + Math.floor(k / 3) * 0.5 })), many(2, () => berry(0.15, { crown: true }), (k) => ({ x: k ? 0.2 : -0.22, y: k ? 0.15 : -0.3, z: 0.1 }))),
    "Larch Cones": () => join(at(twig(1.9), { rz: 0.15 }), many(3, () => conePine(0.55), (k) => ({ x: -0.6 + k * 0.6, y: 0.2 + (k % 2) * 0.05 }))),
    "Nootka": () => tree({ h: 2, tiers: 6, r: 0.75, droop: 0.5, narrow: 0.75 }),
    "Pine": () => { const scales = []; for (let k = 0; k < 46; k++) { const t = k / 45, y = -0.75 + t * 1.3, r = 0.42 * Math.pow(Math.sin(Math.PI * (0.06 + t * 0.9)), 0.7) * (1 - t * 0.3), a = k * 2.39996; scales.push(at(at(petal({ len: 0.2, w: 0.15, shape: "round", curl: -0.15 }), { rx: 1.05 }), { ry: a, x: Math.sin(a) * r * 0.85, y, z: Math.cos(a) * r * 0.85 })); } return join(...scales, path([[0, 0.55, 0], [0.1, 0.8, 0]], 0.04, 1), at(needles(6, 0.75), { x: 0.1, y: 0.8, rz: -0.35 }), at(needles(6, 0.75), { x: 0.1, y: 0.8, rz: 0.45, ry: 1.2 })); },
    "Pine Needles": () => many(4, () => join(needles(6, 0.8), path([[0, -0.05, 0], [0, 0, 0]], 0.03)), (k) => ({ x: (k - 1.5) * 0.5, rz: (1.5 - k) * 0.3, ry: k })),
    "Snoqualmie Forest Evergreens": () => join(at(tree({ h: 2, tiers: 6, r: 0.55 }), { x: -0.5 }), at(tree({ h: 1.5, tiers: 5, r: 0.45 }), { x: 0.45, z: 0.3 }), at(tree({ h: 1.1, tiers: 4, r: 0.35 }), { x: 0.2, z: -0.5 })),
    "Spruce": () => join(tree({ h: 2, tiers: 8, r: 0.65, step: 0.22 }), at(conePine(0.45), { x: 0.75, y: 0.2, rz: 0.3 })),
    "Tamarack": () => join(path([[0, -1, 0], [0, 1, 0]], 0.06), many(9, (k) => join(path([[0, 0, 0], [0.5 - k * 0.04, 0.05, 0]], 0.05, 0.6), at(needles(7, 0.14), { x: 0.5 - k * 0.04 })), (k) => ({ y: -0.6 + k * 0.18, ry: k * 2.3 }))),
    // ---------------- RESINS ----------------
    "Amber": () => join(drop(0.62, { seg: 22, mer: 6 }), at(join(ball({ r: 0.05, sy: 2.2, n: 20, lines: false }), path(bez([0, 0, 0], [0.12, 0.08, 0], [0.22, 0.05, 0], [0.26, -0.02, 0], 6), 0.02, 1.2), path(bez([0, 0, 0], [-0.12, 0.08, 0], [-0.22, 0.05, 0], [-0.26, -0.02, 0], 6), 0.02, 1.2)), { y: 0.05, z: 0.1 })),
    "Balsam": () => { const R = 0.4, onBark = (x, y) => [x, y, Math.sqrt(Math.max(0, R * R - x * x)) + 0.01]; return join(turned([[R, -1], [R * 1.02, 0], [R, 1]], { seg: 22, mer: 12 }), path([onBark(-0.24, 0.62), onBark(0, 0.3), onBark(0.24, 0.62)], 0.03, 1.3), path([onBark(-0.2, 0.4), onBark(0, 0.12), onBark(0.2, 0.4)], 0.03, 1.1), path(curve((t) => onBark(Math.sin(t * 5) * 0.02, 0.1 - t * 0.55), 12), 0.025, 1.4), at(drop(0.08), { y: -0.52, z: R + 0.06 }), at(turned([[0, -0.2], [0.2, -0.18], [0.3, -0.05], [0.32, 0.08]], { seg: 18, mer: 6, rings: true }), { y: -0.8, z: R + 0.28 })); },
    "Benzoin": () => { const almonds = []; [[-0.35, 0.18, 0.5], [0.15, 0.25, -0.4], [0.42, -0.12, 0.8], [-0.18, -0.22, -0.2], [0.05, 0.02, 1.1]].forEach(([x, y, a]) => almonds.push(path(moved(oval(0.12, 0.07, 22), x, y, a).map(([px, py]) => [px, py, 0.23]).concat([[x + Math.cos(a) * 0.12, y + Math.sin(a) * 0.12, 0.23]]), 0.03, 1.2))); return join(box(1.3, 0.8, 0.44, { step: 0.05, fill: 160 }), ...almonds); },
    "Dragon's Blood": () => join(at(pod({ len: 1.6, r: 0.13, bend: 0.05, blunt: true }), { y: 0.3 }), drops(3, 1)),
    "Elemi": () => join(heap(4, () => tear(0.9), 0.4), at(leaf({ len: 0.6, w: 0.2, shape: "oval" }), { x: 0.6, y: 0.3, rz: -1.4 })),
    "Frankincense": () => join(heap(5, () => tear(0.9), 0.45), at(smoke(3, 1.2), { y: 0.1 })),
    "Incense": () => join(turned([[0, -0.9], [0.45, -0.9], [0.45, -0.8], [0, -0.8]], { seg: 20, mer: 0, rings: true }), path([[0, -0.8, 0], [0.25, 0.3, 0]], 0.03, 1.1), at(smoke(3, 1), { x: 0.25, y: 0.3 })),
    "Labdanum": () => join(facing(flower({ n: 5, len: 0.5, w: 0.42, cup: 0.35, shape: "round", stamens: 20, stamenLen: 0.15 }), 1.1), at(lumps(3, 0.9), { y: -0.75 })),
    "Myrrh": () => { const br = [[-0.95, -0.6, 0], [-0.45, -0.2, 0], [-0.1, -0.35, 0], [0.3, 0.1, 0], [0.55, 0.0, 0], [0.9, 0.45, 0]]; const thorns = []; for (let k = 1; k < br.length - 1; k++) { const p = br[k]; thorns.push(path([p, [p[0] + 0.02, p[1] + (k % 2 ? 0.22 : -0.22), 0]], 0.03, 0.8)); } return join(path(br, 0.04, 0.9), path([br[3], [0.2, 0.55, 0], [0.05, 0.75, 0]], 0.04, 0.8), ...thorns, at(tear(1.1), { x: -0.45, y: -0.42 }), at(tear(0.95), { x: 0.32, y: -0.14 }), at(tear(0.8), { x: 0.18, y: 0.42 })); },
    // A CENSER on three chains, the sweet myrrh smoking out of its dome — opoponax is a resin burned, sweeter than myrrh.
    "Opoponax": () => join(turned([[0, -0.62], [0.14, -0.62], [0.2, -0.52], [0.42, -0.4], [0.5, -0.2], [0.48, -0.05], [0.4, 0.0]], { seg: 22, mer: 8, rings: true }), turned([[0.4, 0.02], [0.36, 0.16], [0.24, 0.3], [0.1, 0.4], [0.06, 0.46], [0, 0.5]], { seg: 20, mer: 8 }), many(3, () => path([[0.4, 0.02, 0], [0.02, 0.92, 0]], 0.05, 0.7), (k) => ({ ry: (k / 3) * TAU + 0.4 })), at(path(circle(0.07, 16), 0.03), { y: 0.96, rx: Math.PI / 2 }), at(smoke(2, 0.55), { y: 0.48, x: 0.06 })),
    "Peru Balsam": () => join(turned([[0, -0.4], [0.5, -0.35], [0.7, 0], [0.72, 0.05]], { seg: 22, mer: 6, rings: true }), at(drop(0.2), { y: 0.55 })),
    "Ponderosa Resin": () => join(at(sheet(1, 2, { bend: 0.4 }), {}), path(bez([0.1, 0.4, 0.25], [0.12, 0.1, 0.25], [0.08, -0.2, 0.25], [0.12, -0.5, 0.25], 10), 0.04, 1.2), at(tear(0.9), { x: 0.12, y: -0.6, z: 0.25 })),
    "Propolis": () => join(lumps(3, 0.9), at(hexes(1, 2, 0.18), { y: 0.5 })),
    "Resins": () => join(heap(3, () => tear(1), 0.35), at(chunk(0.6), { x: 0.7, y: -0.2 }), at(drop(0.12), { x: -0.7, y: -0.1 })),
    "Rum Resin": () => join(at(barrel(), { s: 0.8 }), at(drop(0.14), { x: 0.75, y: -0.3 })),
    "Sandarac": () => many(5, () => ball({ r: 0.1, sy: 3, n: 30, rough: 0.1, lines: false, tip: 0.4 }), (k) => ({ x: (k - 2) * 0.3, rz: jit(0.5), y: jit(0.2) })),
    "Sawn Resin": () => join(box(1, 0.7, 0.7, { step: 0.06, fill: 30 }), many(3, () => path([[0, 0, 0], [0, -0.4, 0]], 0.04, 1.1), (k) => ({ x: -0.3 + k * 0.3, y: -0.35, z: 0.35 }))),
    "Styrax": () => join(leaf({ len: 1, w: 0.25, shape: "lance", veins: 0 }), at(leaf({ len: 0.8, w: 0.2, shape: "lance", veins: 0 }), { rz: 1.2 }), at(leaf({ len: 0.8, w: 0.2, shape: "lance", veins: 0 }), { rz: -1.2 }), at(leaf({ len: 0.7, w: 0.2, shape: "lance", veins: 0 }), { rz: 2.4 }), at(leaf({ len: 0.7, w: 0.2, shape: "lance", veins: 0 }), { rz: -2.4 }), at(drop(0.15), { x: 0.7, y: -0.6 })),
    "Tolu Balsam": () => join(turned([[0, -0.4], [0.5, -0.4], [0.7, 0.1]], { seg: 22, mer: 6, rings: true }), at(ball({ r: 0.5, sy: 0.25, n: 60, lines: false }), { y: 0.05 }), at(drop(0.12), { y: 0.6 })),
    "Turpentine": () => join(at(conePine(1), { x: -0.4 }), at(drop(0.2), { x: 0.6, y: -0.2 })),
    // ---------------- ANIMALIC ----------------
    "Ambergris": () => join(ball({ r: 0.62, sx: 1.3, sy: 0.78, n: 300, rough: 0.14, bumps: 5 }), at(wave(2.4, 1.2, { amp: 0.05, nx: 26, nz: 8 }), { y: -0.55 })),
    "Ambrette": () => join(flower({ n: 5, len: 0.5, w: 0.35, shape: "round", cup: 0.5, stamens: 10, stamenLen: 0.35 }), at(heap(5, () => ball({ r: 0.1, sx: 1.4, n: 20, lines: false }), 0.25), { x: 0.75, y: -0.65 })),
    "Animal Notes": () => { const pad = polar((a) => 0.4 * (1 + 0.14 * Math.cos(3 * a + Math.PI)), 60, 1.15, 0.95); return join(flat(moved(pad, 0, -0.35), { depth: 0.1, fill: 140 }), ...[[-0.62, 0.3, 0.5], [-0.22, 0.62, 0.15], [0.22, 0.62, -0.15], [0.62, 0.3, -0.5]].map(([x, y, t]) => flat(moved(oval(0.17, 0.23), x, y, t), { depth: 0.1, fill: 40 }))); },
    // THE MUSK MALLOW'S SEED POD, split open at its tip and spilling the seeds botanical musk is pressed from.
    "Botanical Musk": () => join(at(ball({ r: 0.32, sy: 1.55, n: 150, ribs: 5, ribDepth: 0.12, tip: 0.9, lines: true }), { rz: -0.35 }), many(4, () => ball({ r: 0.06, sx: 1.35, n: 14, lines: false }), (k) => ({ x: 0.3 + k * 0.1, y: 0.55 - k * 0.3 })), many(5, () => leaf({ len: 0.34, w: 0.1, shape: "lance", veins: 0, curl: -0.3 }), (k) => ({ y: -0.5, rz: Math.PI + (k - 2) * 0.5, ry: k * 1.25 })), path([[0, -0.55, 0], [0.05, -0.95, 0]], 0.035, 0.9), at(heap(7, () => ball({ r: 0.08, sx: 1.35, n: 20, lines: false }), 0.3, { flat: true }), { x: 0.6, y: -0.82 }), at(ball({ r: 0.07, sx: 1.35, n: 18, lines: false }), { x: 0.3, y: 0.2 })),
    "Castoreum": () => { const tail = polar((a) => 0.55 + 0.08 * Math.cos(2 * a), 80, 0.8, 1.35); return join(flat(tail, { depth: 0.1 }), hatch(tail, 0.14, 0.8), hatch(tail, 0.14, -0.8), path([[0, -0.74, 0], [0, -1.05, 0]], 0.04)); },
    "Civet": () => { const body = [[1.0, -0.02], [0.86, 0.08], [0.78, 0.17], [0.76, 0.32], [0.69, 0.2], [0.58, 0.2], [0.3, 0.25], [0.0, 0.29], [-0.35, 0.26], [-0.55, 0.17], [-0.66, 0.1], [-0.82, 0.02], [-0.96, -0.1], [-1.06, -0.3], [-1.02, -0.36], [-0.9, -0.2], [-0.74, -0.07], [-0.6, -0.04], [-0.57, -0.42], [-0.47, -0.42], [-0.43, -0.12], [-0.1, -0.13], [0.26, -0.12], [0.3, -0.42], [0.4, -0.42], [0.43, -0.1], [0.62, -0.08], [0.8, -0.1], [0.95, -0.08]]; const T = [[-0.66, 0.1], [-0.82, 0.02], [-0.96, -0.1], [-1.04, -0.28]], B = [[-0.6, -0.04], [-0.74, -0.07], [-0.9, -0.2], [-1.0, -0.33]]; const bands = []; for (let k = 0; k < 3; k++) bands.push(hatch([T[k], [(T[k][0] + T[k + 1][0]) / 2, (T[k][1] + T[k + 1][1]) / 2], [(B[k][0] + B[k + 1][0]) / 2, (B[k][1] + B[k + 1][1]) / 2], B[k]], 0.025, 0.4)); const spots = []; for (let k = 0; k < 16; k++) { const x = -0.45 + (k % 8) * 0.13 + (k > 7 ? 0.06 : 0), y = k > 7 ? 0.02 : 0.15; spots.push(flat(moved(oval(0.035, 0.025, 10), x, y - (k % 2) * 0.04), { depth: 0.02, fill: 6 })); } return join(flat(body, { depth: 0.16 }), ...bands, ...spots, flat(moved(oval(0.1, 0.05, 14), 0.82, 0.05, -0.3), { depth: 0.02, fill: 20 })); },
    "Costus": () => roots({ n: 3, len: 1.1, r: 0.2, bumps: 2, hairs: 10 }),
    "Goat Hair": () => strands(26, 1.6, { amp: 0.14, wave: 7, fan: 0.6, spread: 0.2 }),
    "Hyrax": () => many(4, () => ball({ r: 0.55, sx: 1.4, sy: 0.3, n: 90, rough: 0.2, bumps: 5 }), (k) => ({ y: -0.6 + k * 0.32, ry: k * 0.7, s: 1 - k * 0.15 })),
    // A POT OF BALM — lanolin is the wax of a fleece made into a salve — its lid off, a swirl on top, and a tuft of wool beside it.
    "Lanolin": () => join(turned([[0, -0.7], [0.56, -0.7], [0.6, -0.64], [0.6, 0.02], [0.54, 0.06]], { seg: 24, mer: 8, rings: true }), turned([[0.52, 0.04], [0.46, 0.2], [0.3, 0.3], [0.12, 0.34], [0.04, 0.44], [0, 0.5]], { seg: 22, mer: 0 }), path(curve((t) => [Math.cos(t * 1.6 * TAU) * 0.14 * (1 - t), 0.36 + t * 0.14, Math.sin(t * 1.6 * TAU) * 0.14 * (1 - t)], 24), 0.02, 0.9), at(turned([[0, 0.08], [0.62, 0.08], [0.64, 0.02], [0.62, -0.04], [0, -0.04]], { seg: 24, mer: 6, rings: true }), { x: 0.72, y: -0.12, z: -0.35, rx: 1.25, rz: -0.25, s: 0.9 }), at(many(9, () => path(curve((t) => [Math.cos(t * 2.5 * TAU) * 0.08 * (1 - t * 0.4), t * 0.14, Math.sin(t * 2.5 * TAU) * 0.08 * (1 - t * 0.4)], 18), 0.03), (k) => ({ x: Math.cos(k * 2.4) * 0.26 * Math.sqrt(k / 9), z: Math.sin(k * 2.4) * 0.26 * Math.sqrt(k / 9), y: 0.1 * (1 - k / 9) })), { x: -0.86, y: -0.72, s: 1.35 })),
    "Leather": () => { const hide = polar((a) => { let r = 0.58; [[0.75, 0.35], [-0.75, 0.35], [2.45, 0.4], [-2.45, 0.4], [0, 0.18], [Math.PI, 0.25]].forEach(([c, L]) => { r += L * Math.exp(-Math.pow(apart(a, c) / 0.22, 2)); }); return r; }, 140, 1.05, 1.1); return join(flat(hide, { depth: 0.05, fill: 200 }), at(path(hide.map(([x, y]) => [x * 0.86, y * 0.86, 0]).concat([[hide[0][0] * 0.86, hide[0][1] * 0.86, 0]]), 0.08, 0.7), { z: 0.03 })); },
    // A MUSK DEER, where musk was first taken from: no antlers, a hunched back higher at the rump, big ears, and the long tusk.
    "Musk": () => { const deer = [[0.97, 0.2], [0.9, 0.3], [0.82, 0.38], [0.8, 0.56], [0.74, 0.64], [0.7, 0.46], [0.6, 0.38], [0.3, 0.34], [0.0, 0.38], [-0.3, 0.46], [-0.55, 0.44], [-0.68, 0.34], [-0.74, 0.26], [-0.7, 0.1], [-0.62, -0.1], [-0.6, -0.3], [-0.66, -0.72], [-0.56, -0.72], [-0.5, -0.32], [-0.44, -0.06], [-0.1, -0.02], [0.28, -0.02], [0.3, -0.72], [0.39, -0.72], [0.42, -0.04], [0.54, 0.06], [0.68, 0.1], [0.84, 0.1], [0.96, 0.14]]; const far = [[[-0.46, -0.1], [-0.42, -0.7], [-0.34, -0.7], [-0.36, -0.08]], [[0.18, -0.02], [0.16, -0.7], [0.24, -0.7], [0.26, -0.02]]]; return join(flat(deer, { depth: 0.12, fill: 170 }), ...far.map((l) => at(flat(l, { depth: 0.06, fill: 10 }), { z: -0.12 })), path(bez([0.84, 0.13, 0.08], [0.88, 0.0, 0.08], [0.86, -0.14, 0.08], [0.78, -0.24, 0.08], 12), 0.015, 1.6), part([[0.83, 0.3, 0.07, 1.8]])); },
    "Sheep Wool": () => many(22, (k) => path(curve((t) => [Math.cos(t * 2.5 * TAU) * 0.1 * (1 - t * 0.4), t * 0.18, Math.sin(t * 2.5 * TAU) * 0.1 * (1 - t * 0.4)], 20), 0.03), (k) => ({ x: Math.cos(k * 2.4) * 0.7 * Math.sqrt(k / 22), z: Math.sin(k * 2.4) * 0.7 * Math.sqrt(k / 22), y: 0.3 * (1 - k / 22) })),
    "Skin": () => { const parts = []; for (let k = 1; k <= 8; k++) { const rx = 0.1 + k * 0.1, ry = 0.14 + k * 0.12, gap = 0.55 - k * 0.035; parts.push(path(curve((t) => { const a = -Math.PI / 2 + gap + t * (TAU - 2 * gap); return [Math.cos(a) * rx, Math.sin(a) * ry, 0]; }, 44), 0.035, 0.95)); } return join.apply(null, parts); },
    // A SUEDE BOOT, a chukka laced through three eyelets, its nap brushed one way.
    "Suede": () => { const boot = [[0.98, -0.62], [0.95, -0.48], [0.84, -0.36], [0.56, -0.22], [0.26, -0.06], [0.12, 0.28], [0.04, 0.6], [-0.54, 0.6], [-0.6, 0.3], [-0.66, -0.1], [-0.76, -0.38], [-0.8, -0.56], [-0.76, -0.72], [0.92, -0.72]]; const holes = [[-0.02, 0.48], [0.05, 0.3], [0.13, 0.12]]; return join(flat(boot, { depth: 0.16, fill: 90 }), at(hatch(boot, 0.075, 1.15), { z: 0.08 }), path([[-0.78, -0.6, 0.09], [0.96, -0.6, 0.09]], 0.03, 0.9), ...holes.map(([x, y]) => path(hoop(0.035, 10, x, y, 0.09), 0.02, 1.2)), path([[-0.02, 0.48, 0.1], [0.12, 0.3, 0.1], [0.05, 0.3, 0.1], [0.2, 0.12, 0.1], [0.13, 0.12, 0.1]], 0.025, 1.1), path(bez([-0.02, 0.48, 0.1], [-0.2, 0.7, 0.1], [-0.28, 0.62, 0.1], [-0.12, 0.5, 0.1], 10), 0.025, 1.1), path(bez([-0.02, 0.48, 0.1], [0.12, 0.72, 0.1], [0.22, 0.64, 0.1], [0.06, 0.5, 0.1], 10), 0.025, 1.1)); },
    // ---------------- EARTHY ----------------
    "Cedarmoss": () => join(at(ball({ r: 0.8, sy: 0.4, n: 160, rough: 0.25, bumps: 9, cut: 5, lines: false }), { y: -0.3 }), at(frond(0.8, 10), { x: 0.3, y: -0.1, rz: -0.3 })),
    "Concrete": () => box(1.4, 0.9, 0.9, { step: 0.07, fill: 90 }),
    "Damp Vegetation": () => join(many(5, () => leaf({ len: 0.7, w: 0.25, shape: "oval", curl: 0.3 }), (k) => ({ ry: (k / 5) * TAU, rx: -1.2, y: -0.5 })), falling(6, () => drop(0.07), 1.2, 0.5)),
    "Dust": () => join(lathe([[0.9, -1], [0.05, 1]], { seg: 20, mer: 2 }), cloud(120, 0.7, { w: 0.5 })),
    "Lichen": () => many(6, () => join(path(circle(0.18, 20), 0.03), path(circle(0.1, 14), 0.03), path(circle(0.05, 10), 0.03)), (k) => ({ x: Math.cos(k * 2.4) * 0.5 * Math.sqrt(k / 6 + 0.1), z: Math.sin(k * 2.4) * 0.5 * Math.sqrt(k / 6 + 0.1), rx: jit(0.3), s: 1.3 - k * 0.1 })),
    "Mineral Accord": () => join(at(crystal(1.4, 0.2), { rz: 0.15 }), at(crystal(1, 0.16), { x: -0.35, y: -0.2, rz: 0.55 }), at(crystal(0.9, 0.15), { x: 0.35, y: -0.25, rz: -0.5 }), at(crystal(0.6, 0.12), { x: 0.1, y: -0.35, z: 0.25, rx: 0.5 }), at(ball({ r: 0.55, sy: 0.25, n: 90, rough: 0.2, bumps: 5, lines: false }), { y: -0.6 })),
    "Moss": () => join(ball({ r: 0.9, sy: 0.35, n: 200, rough: 0.22, bumps: 11, cut: 5, lines: false }), many(16, () => path([[0, 0, 0], [0, 0.14, 0]], 0.03), (k) => ({ x: Math.cos(k * 2.4) * 0.7 * Math.sqrt(k / 16), z: Math.sin(k * 2.4) * 0.7 * Math.sqrt(k / 16), y: 0.2 + jit(0.05) }))),
    "Mushroom": () => join(turned([[0.12, -0.9], [0.14, -0.3], [0.12, 0.1], [0.6, 0.12], [0.55, 0.3], [0.35, 0.48], [0, 0.55]], { seg: 22, mer: 8, rings: true }), many(16, () => path([[0.14, 0.1, 0], [0.58, 0.12, 0]], 0.05, 0.6), (k) => ({ ry: (k / 16) * TAU }))),
    "Oakmoss": () => { const parts = []; const grow = (x, y, a, L, depth) => { const x2 = x + Math.sin(a) * L, y2 = y + Math.cos(a) * L; parts.push(path([[x, y, 0], [x2, y2, 0]], 0.04, 0.8 + depth * 0.1)); if (depth < 4) { grow(x2, y2, a - 0.45, L * 0.72, depth + 1); grow(x2, y2, a + 0.45, L * 0.72, depth + 1); } }; [-0.5, 0, 0.5].forEach((a, k) => grow((k - 1) * 0.15, -0.9, a, 0.45, 0)); return join.apply(null, parts); },
    "Peat": () => join(box(1.4, 0.8, 0.8, { step: 0.07 }), many(5, (k) => path(curve((t) => [-0.7 + t * 1.4, -0.3 + k * 0.15 + Math.sin(t * 6 + k) * 0.02, 0.41], 14), 0.05, 0.6), () => ({}))),
    "Petrichor": () => join(at(wave(2, 1.4, { amp: 0.0, nx: 14, nz: 9 }), { y: -0.7 }), falling(7, () => drop(0.07), 1.2, 0.6), many(4, (k) => path(circle(0.12 + k * 0.08, 24), 0.04, 0.6), (k) => ({ y: -0.69, x: 0.2, z: 0.1 }))),
    "Sand": () => wave(2, 1.6, { amp: 0.1, k: 1.6, skew: 1.6, nx: 26, nz: 14 }),
    "Soil": () => join(box(1.6, 1.1, 0.9, { step: 0.08 }), many(3, (k) => path([[-0.8, -0.2 + k * 0.28, 0.45], [0.8, -0.2 + k * 0.28, 0.45]], 0.07, 0.6), () => ({})), cloud(60, 0.5, { sx: 1.4, w: 0.7 }), at(strands(4, 0.5), { y: 0.55 })),
    "Spikenard": () => join(ball({ r: 0.3, sy: 1.3, n: 80, rough: 0.15 }), strands(24, 0.8, { fan: 0.4, amp: 0.1, spread: 0.2 }), many(10, () => path([[0, 0, 0], [0, 0.45, 0]], 0.04, 0.6), (k) => ({ y: 0.3, rz: (k - 5) * 0.12, ry: k }))),
    "Swamp Water": () => join(at(wave(2, 1.4, { amp: 0.02, nx: 16, nz: 10 }), { y: -0.6 }), many(4, (k) => path(bez([0, 0, 0], [0, 0.5, 0], [0.05 * k, 1, 0], [0.1 * k, 1.5, 0], 10), 0.05), (k) => ({ x: -0.5 + k * 0.25, y: -0.6, z: jit(0.3) })), many(3, (k) => path(circle(0.15 + k * 0.1, 24), 0.05, 0.6), () => ({ y: -0.59, x: 0.4 }))),
    "Treemoss": () => join(at(twig(2), { y: 0.8 }), strands(26, 1.4, { fan: 1.4, amp: 0.05, wave: 9, spread: 0.2 })),
    "Wet Stone": () => join(ball({ r: 0.75, sx: 1.4, sy: 0.6, n: 300 }), falling(4, () => drop(0.06), 0.8, 0.4)),
    // ---------------- AIR AND WATER ----------------
    "Airy Note": () => many(7, (k) => path(curve((t) => [(t - 0.5) * 2, Math.sin(t * 5 + k * 0.7) * 0.18 + (k - 3) * 0.16, Math.cos(t * 3 + k) * 0.2], 30), 0.07, 0.7), () => ({})),
    "Aquatic Notes": () => join(wave(2, 1, { amp: 0.14, k: 1.5, nx: 20, nz: 8 }), at(path(curve((t) => { const a = t * 1.6 * Math.PI; return [0.2 + Math.cos(a) * 0.3 * (1 - t * 0.5), 0.2 + Math.sin(a) * 0.4, 0]; }, 20), 0.04), {})),
    "Clear Skies": () => join(at(path(circle(0.35, 40), 0.04, 1.1), { rx: Math.PI / 2, y: 0.2 }), many(12, () => path([[0, 0.48, 0], [0, 0.7, 0]], 0.04, 0.8), (k) => ({ y: 0.2, rz: (k / 12) * TAU })), path([[-1.1, -0.6, 0], [1.1, -0.6, 0]], 0.05, 0.8)),
    "Cold Night Air": () => join(at(join(path(curve((t) => [Math.cos(-Math.PI / 2 + t * Math.PI) * 0.5, Math.sin(-Math.PI / 2 + t * Math.PI) * 0.5, 0], 20), 0.04), path(curve((t) => [0.2 + Math.cos(-Math.PI / 2 + t * Math.PI) * 0.35, Math.sin(-Math.PI / 2 + t * Math.PI) * 0.46, 0], 20), 0.04)), { x: -0.4, y: 0.3 }), at(flake(1.4), { x: 0.6, y: -0.3, rx: Math.PI / 2 }), many(6, () => star(4, 0.07, 0.02), (k) => ({ x: jit(1), y: jit(0.8), rx: Math.PI / 2 }))),
    "Dead Water": () => wave(2.2, 1.6, { amp: 0, nx: 22, nz: 14 }),
    "Marine Accord": () => wave(2.2, 1.4, { amp: 0.16, k: 2, skew: 0.5, nx: 24, nz: 12 }),
    "Ozone": () => flat([[0.16, 1], [-0.42, -0.06], [-0.02, -0.06], [-0.22, -1], [0.46, 0.2], [0.06, 0.2], [0.36, 1]], { depth: 0.14, fill: 170, corners: true }),
    "Rain Notes": () => many(14, (k) => join(path([[0, 0, 0], [0.04, -0.3, 0]], 0.04, 0.7), at(drop(0.04), { y: -0.35, rz: Math.PI })), (k) => ({ x: jit(0.9), y: -0.6 + (k / 14) * 1.6, z: jit(0.6) })),
    "Sea Salt": () => heap(6, () => cube(0.3), 0.6, { flat: true }),
    "Sea Water": () => join(wave(2, 1.2, { amp: 0.12, k: 1.8, nx: 20, nz: 10 }), at(drop(0.14), { y: 0.6 })),
    "Seaweed": () => many(4, (k) => path(curve((t) => [Math.sin(t * 5 + k) * 0.15 * t, t * 1.9 - 1, Math.cos(t * 3 + k) * 0.05], 30), 0.04), (k) => ({ x: (k - 1.5) * 0.3 })),
    "Solar Notes": () => join(ball({ r: 0.45, n: 150 }), many(12, () => path([[0.6, 0, 0], [0.95, 0, 0]], 0.06), (k) => ({ rz: (k / 12) * TAU }))),
    "Steam": () => join(smoke(4, 1.5), at(turned([[0, 0], [0.5, 0.02], [0.5, 0.1]], { seg: 20, mer: 0, rings: true }), { y: -0.2 })),
    // ---------------- SMOKY ----------------
    "Ash": () => join(heap(40, () => part([[0, 0, 0, 0.8]]), 0.7, { rise: 0.5 }), falling(8, () => flake(0.4), 1.3, 0.6)),
    "Birch Tar": () => join(at(log({ r: 0.25, len: 1.4, rings: 3 }), { y: -0.6 }), at(drop(0.22), { y: 0.35 })),
    "Fire": () => join(flame(1.6), at(flame(1), { x: -0.35, y: -0.2 }), at(flame(1.1), { x: 0.35, y: -0.15, z: 0.1 })),
    "Gasoline": () => join(box(1, 1.3, 0.45, { step: 0.07 }), path([[0.2, 0.65, 0], [0.45, 0.95, 0], [0.5, 1.05, 0]], 0.04), at(drop(0.14), { x: 0.7, y: -0.2 })),
    "Palo Santo": () => join(many(3, () => lathe([[0.1, -0.8], [0.1, 0.8]], { seg: 10, mer: 4 }), (k) => ({ x: (k - 1) * 0.25, rz: 0.3 + (k - 1) * 0.1 })), at(smoke(2, 0.9), { x: 0.28, y: 0.75 })),
    "Pine Tar": () => join(at(conePine(0.8), { x: -0.45, y: -0.2 }), at(drop(0.22), { x: 0.5, y: 0.1 })),
    "Smoke": () => smoke(4, 1.8),
    "Smouldering Logs": () => join(at(log({ r: 0.2, len: 1.6, rings: 3 }), { ry: 0.6, y: -0.6 }), at(log({ r: 0.2, len: 1.6, rings: 3 }), { ry: -0.6, y: -0.35 }), at(smoke(3, 1.2), { y: -0.3 }), many(8, () => part([[0, 0, 0, 1.3]]), (k) => ({ x: jit(0.4), y: -0.5 + rnd() * 0.3, z: jit(0.4) }))),
    // ---------------- IMPRESSIONS ----------------
    "Aged Parchment": () => join(sheet(1.4, 1.2, { rules: 5, bend: 0.1 }), at(quill({ len: 1.5, turns: 1.2 }), { y: 0.68, s: 1 }), at(quill({ len: 1.5, turns: 1.2 }), { y: -0.68 })),
    "Blush": () => join(turned([[0, -0.08], [0.6, -0.08], [0.62, 0.05], [0, 0.05]], { seg: 24, mer: 0, rings: true }), at(pan(0.45), { y: 0.06 }), at(join(path([[0, 0, 0], [0, 0.8, 0]], 0.04), at(ball({ r: 0.18, sy: 1.6, n: 60, lines: false, pear: -0.3 }), { y: 0.95 })), { x: 0.75, y: 0.05, rz: -0.5 })),
    "Candle Wax": () => candle({ drips: true }),
    // A PRESSURE GAUGE: carbon dioxide takes the smell out only under pressure — the dial, its ticks and needle, and a drop from the pipe below.
    "CO2 Extracts": () => { const R = 0.6, cy = 0.22, parts = [flat(moved(oval(R, R, 60), 0, cy), { depth: 0.16 }), path(hoop(R * 0.86, 56, 0, cy, 0.08), 0.05, 0.6)]; for (let k = 0; k <= 18; k++) { const a = (225 - k * 15) * Math.PI / 180, r0 = R * (k % 3 ? 0.72 : 0.62); parts.push(path([[Math.cos(a) * r0, cy + Math.sin(a) * r0, 0.08], [Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82, 0.08]], 0.02, k % 3 ? 0.8 : 1.2)); } const a = 40 * Math.PI / 180; parts.push(path([[-Math.cos(a) * 0.1, cy - Math.sin(a) * 0.1, 0.1], [Math.cos(a) * R * 0.7, cy + Math.sin(a) * R * 0.7, 0.1]], 0.02, 1.4), flat(moved(oval(0.06, 0.06, 16), 0, cy), { depth: 0.2, fill: 8 }), lathe([[0.08, -0.72], [0.08, -0.38]], { seg: 14, mer: 6 }), lathe([[0.15, -0.6], [0.15, -0.48]], { seg: 6, mer: 6, rings: true }), at(drop(0.09), { y: -0.93 })); return join.apply(null, parts); },
    "Decayed Rose": () => join(path(bez([0, -1, 0], [0.05, 0.1, 0], [0.4, 0.55, 0], [0.62, 0.2, 0], 16), 0.05, 0.8), at(rose({ n: 12, open: 1.25 }), { x: 0.62, y: 0.15, rx: Math.PI * 0.85, s: 0.8 }), many(4, () => petal({ len: 0.24, w: 0.2, shape: "round", curl: -0.4 }), (k) => ({ x: -0.3 + k * 0.28, y: -1, rx: -Math.PI / 2 + 0.2, ry: k * 1.7 })), at(leaf({ len: 0.4, w: 0.18, shape: "oval", curl: 0.5 }), { y: -0.4, rz: 1.9 })),
    "Dried Blood": () => join(many(4, (k) => join(at(ball({ r: 0.3 - k * 0.05, sy: 0.15, n: 80, cut: 5 }), {}), path(curve((t) => [Math.cos(t * TAU) * (0.3 - k * 0.05) * (1 + 0.15 * Math.sin(t * 9)), 0, Math.sin(t * TAU) * (0.3 - k * 0.05) * (1 + 0.15 * Math.sin(t * 9))], 30), 0.04)), (k) => ({ x: [-0.5, 0.35, 0.1, -0.2][k], z: [0, 0.3, -0.5, 0.5][k] })), at(drop(0.12), { y: 0.6 })),
    "Dusty Antiques": () => join(urn(), cloud(50, 1, { w: 0.4 })),
    "Dusty Sofa": () => join(box(1.8, 0.35, 0.8, { step: 0.08 }), at(box(1.8, 0.6, 0.2, { step: 0.08 }), { y: 0.45, z: -0.3 }), at(box(0.2, 0.5, 0.8, { step: 0.08 }), { x: -0.95, y: 0.2 }), at(box(0.2, 0.5, 0.8, { step: 0.08 }), { x: 0.95, y: 0.2 }), cloud(40, 1.1, { w: 0.4 })),
    "Eye Pencil": () => at(join(lathe([[0.1, -0.9], [0.1, 0.6], [0.02, 0.9]], { seg: 6, mer: 6 }), path(circle(0.1, 12), 0.03)), { rz: 0.9 }),
    "Gold": () => join(at(ingot(1.1, 0.55, 0.32), { x: -0.32, z: 0.2 }), at(ingot(1.1, 0.55, 0.32), { x: 0.32, z: -0.2 }), at(ingot(1.1, 0.55, 0.32), { y: 0.33, ry: 0.35 })),
    "Instant Film": () => join(sheet(1.2, 1.45, {}), at(sheet(1, 1, {}), { y: 0.14, z: 0.01 }), many(3, (k) => path(circle(0.12 + k * 0.1, 24), 0.05, 0.6), () => ({ y: 0.14, rx: Math.PI / 2 }))),
    "Lip Gloss": () => join(turned([[0, -1], [0.18, -1], [0.18, 0.2], [0.14, 0.25], [0, 0.26]], { seg: 16, mer: 6, rings: true }), at(join(path([[0, 0, 0], [0, 0.9, 0]], 0.03), at(ball({ r: 0.06, sy: 2.2, n: 20, lines: false }), { y: 0 })), { x: 0.45, y: -0.4, rz: -0.3 })),
    "Lipstick": () => join(turned([[0, -1], [0.26, -1], [0.26, 0.1], [0.2, 0.12], [0.2, 0.5], [0.16, 0.55]], { seg: 18, mer: 6, rings: true }), path(curve((t) => [Math.cos(t * TAU) * 0.16, 0.55 + 0.35 * (1 - Math.cos(t * TAU)) * 0.5, Math.sin(t * TAU) * 0.16], 20), 0.04)),
    "Makeup Palette": () => join(box(1.8, 0.1, 1.1, { step: 0.07 }), many(6, () => pan(0.2), (k) => ({ x: -0.55 + (k % 3) * 0.55, z: -0.25 + Math.floor(k / 3) * 0.5, y: 0.06 }))),
    // SAXONY'S ARMS for "moss of Saxony": a shield barred across, the green crown-wreath laid over it on the bend, and moss at its foot.
    "Mousse de Saxe": () => { const sh = [[-0.6, 0.82], [0.6, 0.82], [0.6, -0.05]].concat(curve((t) => [0.6 * (1 - t) * (1 - t) + 0.46 * 2 * t * (1 - t) * 0.5, -0.05 * (1 - t) * (1 - t) + 2 * t * (1 - t) * -0.62 + t * t * -0.86], 10).slice(1).map((q) => [q[0], q[1]])); const shield = sh.concat(sh.slice(1, -1).reverse().map(([x, y]) => [-x, y])).filter((q, k, all) => k === 0 || q[0] !== all[k - 1][0] || q[1] !== all[k - 1][1]); const bars = []; for (let k = 1; k < 10; k++) { const y = 0.82 - k * 0.168; const xs = []; for (let x = -0.6; x <= 0.6; x += 0.01) if (inside(shield, x, y)) xs.push(x); if (xs.length) bars.push(path([[xs[0], y, 0.06], [xs[xs.length - 1], y, 0.06]], 0.035, 0.7)); } const d = []; for (let tries = 0; d.length < 150 && tries < 6000; tries++) { const x = -0.6 + rnd() * 1.2, y = -0.86 + rnd() * 1.68; if (inside(shield, x, y) && Math.floor((0.82 - y) / 0.168) % 2 === 0) d.push([x, y, (rnd() - 0.5) * 0.08, 0.55]); } const b1 = bez([-0.6, 0.5, 0.1], [-0.2, 0.25, 0.1], [0.2, -0.05, 0.1], [0.52, -0.4, 0.1], 20), b2 = b1.map(([x, y, z]) => [x + 0.05, y - 0.08, z]); const crown = []; for (let k = 1; k < 7; k++) { const q = b1[k * 3]; crown.push(path([[q[0] - 0.05, q[1] + 0.02, 0.1], [q[0] + 0.01, q[1] + 0.12, 0.1], [q[0] + 0.06, q[1] - 0.02, 0.1]], 0.025, 1)); } return join(flat(shield, { depth: 0.1 }), ...bars, part(d), path(b1, 0.03, 1.1), path(b2, 0.03, 1.1), ...crown, at(ball({ r: 0.55, sy: 0.18, n: 110, rough: 0.28, bumps: 11, lines: false }), { y: -0.96 })); },
    "Old Books": () => many(4, () => book(1.3, 0.9, 0.2), (k) => ({ y: -0.4 + k * 0.23, ry: jit(0.3), rx: Math.PI / 2, x: jit(0.1) })),
    "Oriental Notes": () => lantern(),
    "Paper": () => join(sheet(1.3, 1.7, { rules: 7 }), path([[0.35, 0.85, 0], [0.65, 0.55, 0]], 0.04)),
    "Porcelain": () => join(cup({ saucer: true }), many(2, () => path(circle(0.58, 30), 0.05, 0.6), (k) => ({ y: 0.05 + k * 0.12 }))),
    // A FLY, from above: what rot is known by — its eyes, its striped body, veined wings folded back, six jointed legs.
    "Rotten Flesh": () => { const thorax = oval(0.19, 0.21, 30), abdomen = moved(oval(0.2, 0.34, 36), 0, -0.5), head = moved(oval(0.15, 0.12, 26), 0, 0.3); const wing = (sd) => moved(oval(0.17, 0.5, 30), sd * 0.34, -0.38, sd * 0.45); const legs = [[0.1, 0.12, 0.34, 0.3, 0.5, 0.62], [0.16, 0.0, 0.46, 0.02, 0.66, -0.16], [0.12, -0.12, 0.34, -0.36, 0.44, -0.72]]; const parts = [flat(thorax, { depth: 0.14, fill: 60 }), flat(abdomen, { depth: 0.14, fill: 50 }), flat(head, { depth: 0.12, fill: 12 })]; [-1, 1].forEach((sd) => { parts.push(flat(moved(oval(0.08, 0.1, 20), sd * 0.1, 0.34), { depth: 0.1, fill: 16 })); parts.push(at(flat(wing(sd), { depth: 0.02 }), { z: 0.1 })); parts.push(path([[sd * 0.12, -0.02, 0.11], [sd * 0.4, -0.4, 0.11], [sd * 0.52, -0.78, 0.11]], 0.04, 0.6)); legs.forEach(([a, b, c, d, e, f]) => parts.push(path([[sd * a, b, -0.02], [sd * c, d, -0.02], [sd * e, f, -0.02]], 0.035, 0.9))); }); for (let k = 1; k <= 3; k++) { const y = -0.5 + 0.34 - k * 0.17, w = 0.2 * Math.sqrt(Math.max(0, 1 - Math.pow((y + 0.5) / 0.34, 2))); parts.push(path([[-w, y, 0.08], [w, y, 0.08]], 0.03, 0.9)); } return join.apply(null, parts); },
    "Salty Tears": () => join(many(3, () => drop(0.14), (k) => ({ x: (k - 1) * 0.35, y: 0.6 - k * 0.45, z: jit(0.1) })), at(heap(4, () => cube(0.1), 0.2), { y: -0.8 })),
    "Spinal Fluid": () => join(many(7, () => join(turned([[0, -0.07], [0.22, -0.07], [0.24, 0.07], [0, 0.07]], { seg: 16, mer: 0, rings: true }), path([[0, 0, -0.2], [0, 0, -0.45]], 0.04), path([[-0.2, 0, -0.1], [-0.42, -0.05, -0.15]], 0.04), path([[0.2, 0, -0.1], [0.42, -0.05, -0.15]], 0.04)), (k) => ({ y: -0.9 + k * 0.3, x: Math.sin(k * 0.6) * 0.08 })), at(drop(0.1), { x: 0.6, y: -0.3 })),
    "Velvet": () => join(at(wave(1.6, 1.9, { amp: 0.16, k: 3.2, skew: 0.3, nx: 26, nz: 14 }), { rx: Math.PI / 2 }), path([[-0.85, 0.95, 0], [0.85, 0.95, 0]], 0.05)),
    "Westfarthing Leaf": () => join(at(turned([[0.05, 0], [0.2, 0.02], [0.22, 0.32], [0.17, 0.35]], { seg: 16, mer: 6, rings: true }), { x: 0.75, y: -0.1 }), path(bez([0.72, -0.05, 0], [0.2, -0.2, 0], [-0.4, -0.25, 0], [-1.05, -0.1, 0], 20), 0.04), at(smoke(2, 0.9), { x: 0.75, y: 0.3, s: 0.8 })),
  };
  // For a note the list does not name — one added to the library later —
  // a figure of its accord's.
  const BY_ACCORD = {
    CIT: () => citrus({ r: 0.7 }), ARO: () => sprig({}), GRN: () => leaf({ len: 1.6, w: 0.5 }), FLO: () => flower({ n: 6, len: 0.6, w: 0.25 }),
    FRU: () => ball({ r: 0.7, n: 260 }), SPI: () => heap(6, () => seed1({ r: 0.15 }), 0.5), GOU: () => box(1.2, 0.6, 0.8), BRW: () => cup({}),
    WOO: () => log({}), CON: () => tree({}), RES: () => heap(4, () => tear(1), 0.4), ANI: () => cloud(200, 0.8), EAR: () => ball({ r: 0.8, sy: 0.4, rough: 0.2, cut: 5 }),
    AIR: () => wave(2, 1.2), SMK: () => smoke(3, 1.6), IMP: () => sheet(1.3, 1.6, { rules: 5 }),
  };

  // ============================================================
  // MAKING ONE, ONCE: built from its own seed, stood in the middle, and
  // sized to a radius of one.
  // ============================================================
  const made = new Map();
  const MOST = 1500, FEWEST = 160;
  function of(name, code) {
    if (made.has(name)) return made.get(name);
    const make = FIGURES[name] || BY_ACCORD[code] || BY_ACCORD.IMP;
    seed = hash(name);
    const fig = make();
    // Never so many specks that it is a blur, nor so few that it is not
    // there: thinned evenly past MOST, and filled in along its hairlines
    // under FEWEST.
    if (fig.d.length < FEWEST) fig.l.forEach((line) => { path(line, 0.07, 0.8, true).d.forEach((q) => fig.d.push(q)); });
    if (fig.d.length > MOST) { const k = fig.d.length / MOST; fig.d = Array.from({ length: MOST }, (_, j) => fig.d[Math.floor(j * k)]); }
    let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    const see = (p) => { for (let k = 0; k < 3; k++) { if (p[k] < lo[k]) lo[k] = p[k]; if (p[k] > hi[k]) hi[k] = p[k]; } };
    fig.d.forEach(see);
    fig.l.forEach((line) => line.forEach(see));
    const c = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2);
    let R = 0;
    const far = (p) => { R = Math.max(R, Math.hypot(p[0] - c[0], (p[1] - c[1]) * 0.85, p[2] - c[2])); };
    fig.d.forEach(far);
    fig.l.forEach((line) => line.forEach(far));
    const s = 1 / Math.max(0.01, R);
    const norm = (p) => [(p[0] - c[0]) * s, (p[1] - c[1]) * s, (p[2] - c[2]) * s];
    const out = {
      name,
      d: Float32Array.from(fig.d.flatMap((p) => [...norm(p), p[3] || 1])),
      l: fig.l.map((line) => Float32Array.from(line.flatMap(norm))),
      low: (lo[1] - c[1]) * s,
      own: !!FIGURES[name],
      turn: (hash(name + "~") % 628) / 100,
    };
    made.set(name, out);
    return out;
  }

  // ============================================================
  // DRAWING ONE: swaying slowly about its upright, a little from above, on
  // a dashed ring; hairlines first, then the specks, the nearer larger and
  // brighter. It SWAYS rather than turning all the way round (2026-09-29):
  // a symbol known by its outline — a cross, a paw print, a bolt — would
  // stand edge on half the time, and say nothing then.
  // ============================================================
  const RED = [255, 58, 68], NEAR = [255, 150, 154];
  // Swaying either side of a little to the left of straight on, by this
  // much (radians), once every fourteen seconds or so.
  const SWAY_AT = -0.28, SWAY = 0.62, SWAY_RATE = 0.00045;
  function draw(g, fig, w, h, t) {
    g.clearRect(0, 0, w, h);
    const yaw = SWAY_AT + Math.sin((t || 0) * SWAY_RATE + fig.turn) * SWAY, tilt = 0.28;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
    const S = Math.min(w * 0.44, h * 0.42), X = w / 2, Y = h / 2, D = 4;
    const P = (x, y, z) => {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      const f = D / (D - z2);
      return [X + x1 * S * f, Y - y2 * S * f, z2];
    };
    // The ring it turns on, dashed, under it.
    g.lineWidth = 1;
    g.strokeStyle = "rgba(236, 232, 226, 0.14)";
    g.setLineDash([2, 4]);
    g.beginPath();
    for (let k = 0; k <= 72; k++) {
      const a = (k / 72) * TAU, p = P(Math.cos(a) * 0.95, fig.low - 0.06, Math.sin(a) * 0.95);
      if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
    }
    g.stroke();
    g.setLineDash([]);
    // The hairlines.
    g.strokeStyle = "rgba(255, 74, 84, 0.26)";
    g.lineWidth = 0.8;
    g.beginPath();
    for (const line of fig.l) {
      for (let k = 0; k < line.length; k += 3) {
        const p = P(line[k], line[k + 1], line[k + 2]);
        if (k) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
      }
    }
    g.stroke();
    // The specks, the far ones first.
    const d = fig.d, n = d.length / 4;
    if (!fig.order || fig.order.length !== n) { fig.order = new Uint16Array(n); fig.depth = new Float32Array(n); fig.sx = new Float32Array(n); fig.sy = new Float32Array(n); }
    for (let k = 0; k < n; k++) {
      const p = P(d[k * 4], d[k * 4 + 1], d[k * 4 + 2]);
      fig.sx[k] = p[0]; fig.sy[k] = p[1]; fig.depth[k] = p[2]; fig.order[k] = k;
    }
    fig.order.sort((a, b) => fig.depth[a] - fig.depth[b]);
    for (let j = 0; j < n; j++) {
      const k = fig.order[j];
      const near = Math.max(0, Math.min(1, (fig.depth[k] + 1) / 2));
      const size = (1.1 + 1.5 * near) * d[k * 4 + 3];
      const a = 0.3 + 0.7 * near;
      const r = Math.round(RED[0] + (NEAR[0] - RED[0]) * near * 0.6), gg = Math.round(RED[1] + (NEAR[1] - RED[1]) * near * 0.6), b = Math.round(RED[2] + (NEAR[2] - RED[2]) * near * 0.6);
      g.fillStyle = "rgba(" + r + "," + gg + "," + b + "," + a.toFixed(2) + ")";
      g.fillRect(fig.sx[k] - size / 2, fig.sy[k] - size / 2, size, size);
    }
  }

  window.NoteFigures = {
    of,
    draw,
    /** Every name with a figure of its own (for the test that none is
        left to its accord's). */
    names: () => Object.keys(FIGURES),
  };
})();

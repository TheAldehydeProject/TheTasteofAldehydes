// ============================================================
// THE TREE — works/test-page.html (the test page)
//
// The owner, 2026-09-26, sending a photograph of a conifer standing on
// its own great roots over a forest floor:
//
//   "add a new page to the whole site, and make it completly blank. this
//   will be a test page. On this test page, I want you to take this tree
//   ... and make it into a 3D render, I want it to be made mechanical,
//   but i want it to keep some of its coours, so you would have areas of
//   green and brown. I want it to be fully made 3d so you can rotate it.
//   From this tree in different areas, i want there to be labels that
//   come out of it." And then: "make the tree translucent. render the
//   ground with it, but not all of the background".
//
// So the tree is BUILT, as a machine is, out of the photograph's parts:
//   - THE TRUNK, a faceted column in eight flanged sections, widening into
//     THE ROOT FLARE at its foot — and inside it, seen through it, a core
//     and six green SAP CONDUITS running up it from the roots;
//   - THE ROOTS, jointed like arms — pipe by pipe, a collar at every joint
//     — sprawling over the ground as the photograph's do, one of them
//     ARCHING over a hollow on a strut, each ending in an ANCHOR driven
//     into the soil;
//   - THE CROWN, nine tiers of green panels on drooping ribs, a spruce
//     drawn as an array, with THE LEADER standing out of its top;
//   - and on THE GROUND — a patch of the forest floor, soil and needle
//     litter and moss, fading out into the blank page rather than filling
//     it — the photograph's STONES and FERNS.
// All of it TRANSLUCENT, its edges drawn, the brown and the green kept
// off the photograph. It turns: dragged, or slowly on its own when left.
//
// THE LABELS come out of it: each a leader line from a point on the tree
// out to a name standing either side of it, drawn out one after another
// when the page arrives, going faint when its point turns away. What they
// say is in the page (`.tree-label`); where they come out of is here
// (`ANCHOR`, by each label's `data-part`).
//
// Three.js r128, from the same address as the home page's map. Without
// it the page says so and stays blank. With reduced motion it never
// turns on its own and the labels are simply there.
// ============================================================
(function () {
  const stage = document.querySelector(".tree-stage");
  const canvas = stage && stage.querySelector(".tree-canvas");
  if (!canvas) return;
  if (typeof THREE === "undefined") {
    const bare = stage.querySelector(".tree-fallback");
    if (bare) bare.hidden = false;
    stage.classList.add("is-bare");
    return;
  }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // THE COLOURS, off the photograph: its reddish bark, the greyer tops of
  // the roots, the spruce's green and the ferns' lighter one, the soil.
  const BARK = 0x8c4a30;
  const ROOT = 0x9a6650;
  const METAL = 0x4a281b;               // the flanges, collars and anchors
  const CORE = 0x3a2016;
  const SAP = 0x4f9a3e;
  const NEEDLE = 0x3d7a3a;
  const FERN = 0x62a048;
  const STONE = 0x9a9b96;
  const SOIL = [110, 64, 46];

  const TURN_RATE = 0.00009;            // radians a millisecond it turns on its own
  const TURN_AFTER = 2600;              // ms after a drag before it turns on its own again
  const DRAG = 0.0065;                  // radians a pixel of drag
  const PITCH = [0.02, 0.62];           // how far it can be tipped, radians
  const LABEL_IN = 700;                 // ms before the first label comes out
  const LABEL_STEP = 130;               // ms between one label and the next
  const LABEL_DRAW = 520;               // ms a label's line takes to draw out
  const LABEL_GAP = 38;                 // px, the least between two labels on one side

  // Seeded, so the tree is the same tree every time.
  let seed = 20260926;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const polar = (deg, r, y) => V(Math.cos((deg * Math.PI) / 180) * r, y, Math.sin((deg * Math.PI) / 180) * r);

  // ============================================================
  // THE GROUND'S HEIGHT: a mound where the roots heave the soil up round
  // the trunk, and the slope rising gently behind, as the photograph's
  // does.
  // ============================================================
  const ground = (x, z) => 0.24 * Math.exp(-(x * x + z * z) / 2.6) - 0.05 * z + 0.02 * Math.sin(x * 1.7) * Math.cos(z * 1.3);

  // ============================================================
  // BUILDING. Every piece is put into a BIN by what it is made of, and
  // each bin becomes one mesh and one set of edges — a few hundred pieces,
  // a handful of things drawn.
  // ============================================================
  const bins = new Map();
  function put(bin, geo, matrix) {
    let g = geo.index ? geo.toNonIndexed() : geo;
    if (matrix) g.applyMatrix4(matrix);
    if (!bins.has(bin)) bins.set(bin, []);
    bins.get(bin).push(g);
  }
  function merged(list) {
    let n = 0;
    list.forEach((g) => { n += g.attributes.position.count; });
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
    let o = 0;
    list.forEach((g) => {
      pos.set(g.attributes.position.array, o * 3);
      if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
      o += g.attributes.position.count;
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    return out;
  }
  const UP = V(0, 1, 0);
  const ONE = V(1, 1, 1);
  /** A pipe from `a` to `b`, `ra` wide at one end and `rb` at the other. */
  function pipe(bin, a, b, ra, rb, sides) {
    const d = new THREE.Vector3().subVectors(b, a), len = d.length();
    if (len < 1e-4) return;
    const m = new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()), ONE);
    put(bin, new THREE.CylinderGeometry(rb, ra, len, sides || 8, 1, true), m);
  }
  /** A collar round a pipe at `p`, facing along `dir`. */
  function collar(bin, p, dir, r, h, sides) {
    const m = new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromUnitVectors(UP, dir.clone().normalize()), ONE);
    put(bin, new THREE.CylinderGeometry(r, r, h, sides || 8), m);
  }

  // Where each label comes out of, filled in as the parts are built.
  const ANCHOR = {};

  // ---------- THE TRUNK ----------
  // Its radius up its height: the flare at its foot, the column, the
  // leader's narrowing.
  const PROFILE = [[0, 1.75], [0.15, 1.4], [0.38, 1.1], [0.75, 0.9], [1.3, 0.78], [2.2, 0.7], [3.6, 0.6], [5.4, 0.46], [7.0, 0.3], [8.4, 0.14], [9.1, 0.04]];
  const radiusAt = (y) => {
    for (let k = 1; k < PROFILE.length; k++) {
      if (y <= PROFILE[k][0]) {
        const [y0, r0] = PROFILE[k - 1], [y1, r1] = PROFILE[k];
        return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
      }
    }
    return 0.03;
  };
  const SIDES = 10;                     // the trunk's facets
  put("bark", new THREE.LatheGeometry(PROFILE.map(([y, r]) => new THREE.Vector2(r, y - 0.12)), SIDES));
  // The flanges between its eight sections, bolted.
  for (let k = 1; k <= 8; k++) {
    const y = 0.25 + k * 0.92, r = radiusAt(y) * 1.08;
    collar("metal", V(0, y, 0), UP, r, 0.07, SIDES);
    for (let b = 0; b < SIDES; b++) {
      const a = ((b + 0.5) / SIDES) * Math.PI * 2;
      const m = new THREE.Matrix4().compose(V(Math.cos(a) * r * 1.02, y, Math.sin(a) * r * 1.02), new THREE.Quaternion(), ONE);
      put("metal", new THREE.BoxGeometry(0.05, 0.1, 0.05), m);
    }
  }
  // The core, and the sap conduits wound up round it.
  pipe("core", V(0, -0.1, 0), V(0, 9.3, 0), 0.14, 0.03, 8);
  const CONDUITS = 6;
  for (let c = 0; c < CONDUITS; c++) {
    const pts = [];
    for (let s = 0; s <= 40; s++) {
      const y = 0.15 + (s / 40) * 8.0, a = (c / CONDUITS) * Math.PI * 2 + y * 0.42;
      const r = Math.max(0.16, radiusAt(y) * 0.55);
      pts.push(V(Math.cos(a) * r, y, Math.sin(a) * r));
    }
    put("sap", new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.028, 5, false));
    if (c === 0) ANCHOR.sap = { at: pts[9].clone(), out: V(pts[9].x, 0, pts[9].z) };
  }
  ANCHOR.trunk = { at: V(Math.cos(1.3) * radiusAt(3.4), 3.4, Math.sin(1.3) * radiusAt(3.4)), out: V(Math.cos(1.3), 0, Math.sin(1.3)) };
  ANCHOR.flare = { at: polar(58, radiusAt(0.32), 0.2), out: polar(58, 1, 0) };

  // ---------- THE ROOTS ----------
  // Each: which way it leaves (degrees round the trunk — 90 is towards
  // you, 180 to your left), how far it runs, how thick it starts, and how
  // high it humps over the ground on its way.
  const ROOTS = [
    { deg: 125, reach: 4.1, thick: 0.46, hump: 1.05, arch: true },
    { deg: 82, reach: 3.2, thick: 0.34, hump: 0.14 },
    { deg: 38, reach: 2.9, thick: 0.38, hump: 0.3, knuckle: true },
    { deg: 8, reach: 2.5, thick: 0.28, hump: 0.08 },
    { deg: 332, reach: 3.8, thick: 0.36, hump: 0.2, branch: 0.55 },
    { deg: 286, reach: 3.3, thick: 0.32, hump: 0.12 },
    { deg: 236, reach: 3.7, thick: 0.35, hump: 0.22 },
    { deg: 192, reach: 4.3, thick: 0.4, hump: 0.28, branch: 0.5 },
    { deg: 158, reach: 3.5, thick: 0.34, hump: 0.42 },
  ];
  const SEGMENTS = 11;
  function root(spec, from, fromDeg) {
    // Its line: out from the flare, over the ground, and down into it.
    const pts = [];
    const start = from || polar(spec.deg, radiusAt(0.4) * 0.86, 0.42);
    const wob = (rnd() - 0.5) * 22;
    for (let s = 0; s <= 6; s++) {
      const t = s / 6;
      const deg = (fromDeg == null ? spec.deg : fromDeg) + wob * Math.sin(t * Math.PI) + (rnd() - 0.5) * 6;
      const r = from ? 0 : radiusAt(0.4) * 0.86;
      const p = from ? start.clone().add(polar(deg, spec.reach * t, 0)) : polar(deg, r + (spec.reach - r) * t, 0);
      const lift = spec.hump * Math.sin(Math.min(1, t * 1.15) * Math.PI) * (spec.arch ? 1 : 0.6);
      const thick = spec.thick * Math.pow(1 - t, 0.8) + 0.05;
      p.y = ground(p.x, p.z) + thick * 0.45 + lift - (t > 0.9 ? (t - 0.9) * 3 : 0);
      if (s === 0 && !from) p.y = 0.42;
      if (s === 0 && from) p.y = start.y;
      pts.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const P = curve.getSpacedPoints(SEGMENTS);
    const width = (k) => spec.thick * Math.pow(1 - k / SEGMENTS, 0.8) + 0.05;
    for (let k = 0; k < SEGMENTS; k++) {
      pipe("root", P[k], P[k + 1], width(k), width(k + 1), 8);
      if (k % 2 === 0 && k) collar("joint", P[k], new THREE.Vector3().subVectors(P[k + 1], P[k - 1]), width(k) * 1.12, 0.045, 8);
    }
    // The anchor: a spike driven down, and a plate on the soil round it.
    const end = P[SEGMENTS];
    pipe("metal", end, V(end.x, end.y - 0.45, end.z), 0.06, 0.005, 6);
    const plate = new THREE.Matrix4().compose(V(end.x, ground(end.x, end.z) + 0.015, end.z), new THREE.Quaternion(), ONE);
    put("metal", new THREE.CylinderGeometry(0.2, 0.2, 0.02, 12), plate);
    // A knuckle, as the photograph's right-hand root has.
    if (spec.knuckle) {
      const m = new THREE.Matrix4().compose(P[5], new THREE.Quaternion(), V(1, 0.8, 1));
      put("root", new THREE.IcosahedronGeometry(width(5) * 1.45, 0), m);
    }
    // The arch stands on a strut over the hollow under it.
    if (spec.arch) {
      const top = P[4];
      const foot = V(top.x - 0.1, ground(top.x - 0.1, top.z + 0.25), top.z + 0.25);
      pipe("root", top, foot, width(4) * 0.8, width(4) * 0.62, 8);
      collar("joint", foot.clone().setY(foot.y + 0.08), UP, width(4) * 0.8, 0.07, 8);
      ANCHOR.arch = { at: P[3].clone().setY(P[3].y + width(3) * 0.9), out: polar(spec.deg, 1, 0.6) };
    }
    if (spec.deg === 82) ANCHOR.anchor = { at: end.clone(), out: polar(80, 1, 0.3) };
    // A lesser root branching off it.
    if (spec.branch) {
      const at = curve.getPoint(spec.branch);
      root({ deg: spec.deg + 34, reach: 1.5, thick: spec.thick * 0.5, hump: 0.1 }, at, spec.deg + 34);
    }
    return P;
  }
  ROOTS.forEach((r) => root(r));

  // ---------- THE CROWN ----------
  // Nine tiers of boughs, fewer and shorter up the tree, each a drooping
  // rib carrying a tapered green blade and needles along it — a spruce
  // drawn as a machine is, bough by bough.
  const TIERS = 9;
  const needles = [];
  for (let k = 0; k < TIERS; k++) {
    const h = 3.3 + k * 0.6, reach = 0.4 + 2.6 * Math.pow(1 - k / TIERS, 1.05);
    const boughs = 11 - Math.floor(k / 3), turn = k * 0.61;
    for (let i = 0; i < boughs; i++) {
      const a = turn + ((i + (rnd() - 0.5) * 0.35) / boughs) * Math.PI * 2;
      const len = reach * (0.82 + rnd() * 0.3), droop = 0.3 + len * 0.3 + rnd() * 0.15;
      const r0 = radiusAt(h) * 0.9;
      const along = (t) => V(Math.cos(a) * (r0 + (len - r0) * t), h - droop * Math.pow(t, 1.7), Math.sin(a) * (r0 + (len - r0) * t));
      const side = V(-Math.sin(a), 0, Math.cos(a));
      const STEPS = 5;
      const pos = [];
      for (let s2 = 0; s2 < STEPS; s2++) {
        const t0 = s2 / STEPS, t1 = (s2 + 1) / STEPS, p0 = along(t0), p1 = along(t1);
        pipe("branch", p0, p1, 0.045 * (1 - t0 * 0.8), 0.045 * (1 - t1 * 0.8), 5);
        // The blade: widest a little way out, its edges hanging lower.
        const w0 = 0.34 * Math.sin(Math.min(1, t0 * 1.6 + 0.12) * Math.PI * 0.9) * (1 - t0 * 0.55);
        const w1 = 0.34 * Math.sin(Math.min(1, t1 * 1.6 + 0.12) * Math.PI * 0.9) * (1 - t1 * 0.55);
        const l0 = p0.clone().addScaledVector(side, w0).setY(p0.y - w0 * 0.35), r0e = p0.clone().addScaledVector(side, -w0).setY(p0.y - w0 * 0.35);
        const l1 = p1.clone().addScaledVector(side, w1).setY(p1.y - w1 * 0.35), r1e = p1.clone().addScaledVector(side, -w1).setY(p1.y - w1 * 0.35);
        [p0, l0, l1, p0, l1, p1, p0, p1, r1e, p0, r1e, r0e].forEach((p) => pos.push(p.x, p.y, p.z));
      }
      const blade = new THREE.BufferGeometry();
      blade.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      blade.computeVertexNormals();
      put((k + i) % 2 ? "crown" : "crownDeep", blade);
      // Needles hanging off it, both sides.
      for (let n = 1; n <= 9; n++) {
        const t = n / 10, p = along(t), w = 0.36 * (1 - t * 0.5);
        [1, -1].forEach((sg) => {
          const e = p.clone().addScaledVector(side, w * sg);
          needles.push(p.x, p.y, p.z, e.x, e.y - 0.2 - 0.1 * t, e.z);
        });
      }
      if (k === 2 && i === 1) ANCHOR.crown = { at: along(0.88), out: V(Math.cos(a), 0, Math.sin(a)) };
    }
  }
  // The leader, and its tip.
  pipe("branch", V(0, 8.6, 0), V(0, 9.7, 0), 0.035, 0.012, 6);
  put("sap", new THREE.OctahedronGeometry(0.1, 0), new THREE.Matrix4().makeTranslation(0, 9.75, 0));
  ANCHOR.leader = { at: V(0, 9.75, 0), out: UP.clone() };

  // ---------- THE STONES ----------
  const STONES = [[1.95, 2.45, 0.62], [-1.05, 1.45, 0.4], [-3.05, 0.35, 0.46], [2.45, -1.85, 0.5], [-1.6, -2.75, 0.34], [3.3, 1.2, 0.26]];
  STONES.forEach(([x, z, s], n) => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const p = geo.attributes.position;
    const shake = (v) => 0.78 + 0.34 * Math.abs(Math.sin(v.x * 12.9 + v.y * 78.2 + v.z * 37.7 + n * 3.1));
    for (let i = 0; i < p.count; i++) {
      const v = V(p.getX(i), p.getY(i), p.getZ(i)), k = shake(v);
      p.setXYZ(i, v.x * k, v.y * k, v.z * k);
    }
    geo.computeVertexNormals();
    const m = new THREE.Matrix4().compose(V(x, ground(x, z) + s * 0.12, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, n * 1.3, 0.1)), V(s * 1.1, s * 0.5, s * 0.85));
    put("stone", geo, m);
    if (n === 0) ANCHOR.stone = { at: V(x, ground(x, z) + s * 0.5, z), out: V(0.5, 1, 0.5) };
  });

  // ---------- THE FERNS ----------
  // Fronds arching out of a crown, their leaflets in pairs down the stem,
  // smaller towards the tip.
  const FERNS = [[-2.55, 2.1], [0.55, 3.35], [3.15, 0.95], [-2.65, -1.85], [-3.7, -0.55], [1.2, -3.2], [-0.9, 3.1]];
  FERNS.forEach(([x, z], n) => {
    const base = V(x, ground(x, z), z), fronds = 5 + (n % 3);
    for (let f = 0; f < fronds; f++) {
      const dir = (f / fronds) * Math.PI * 2 + n, len = 0.8 + rnd() * 0.5, lean = 0.55 + rnd() * 0.25;
      const at = (t) => V(base.x + Math.cos(dir) * len * lean * t, base.y + len * (0.9 * t - 0.75 * t * t), base.z + Math.sin(dir) * len * lean * t);
      const STEPS = 9;
      for (let s = 0; s < STEPS; s++) {
        const p = at(s / STEPS), q = at((s + 1) / STEPS);
        pipe("fernStem", p, q, 0.014, 0.01, 4);
        if (s < 1) continue;
        const along = new THREE.Vector3().subVectors(q, p).normalize(), side = V(-along.z, 0, along.x);
        const w = 0.2 * (1 - s / (STEPS + 1));
        const pos = [];
        [1, -1].forEach((sg) => {
          const tip = p.clone().add(side.clone().multiplyScalar(w * sg)).add(V(0, -0.03, 0)), back = p.clone().add(along.clone().multiplyScalar(0.07));
          pos.push(p.x, p.y, p.z, tip.x, tip.y, tip.z, back.x, back.y, back.z);
        });
        const leaf = new THREE.BufferGeometry();
        leaf.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        leaf.computeVertexNormals();
        put("fern", leaf);
      }
      if (n === 0 && f === 1) ANCHOR.fern = { at: at(0.55), out: V(Math.cos(dir), 0.4, Math.sin(dir)) };
    }
  });

  // ============================================================
  // THE SCENE: every bin a translucent mesh with its edges drawn over it.
  // ============================================================
  const scene = new THREE.Scene();
  const LOOK = {
    // [colour, opacity, its edges' colour, their opacity (0: none), the
    // order it is drawn in, the least angle between faces an edge marks]
    bark:      [BARK, 0.36, 0x4a2014, 0.55, 3, 20],
    root:      [ROOT, 0.36, 0x5a3020, 0.5, 3, 24],
    metal:     [METAL, 0.72, 0x2a160e, 0.35, 4, 40],
    joint:     [0x6a3a26, 0.45, 0x3a2016, 0.35, 4, 40],
    branch:    [0x5a3624, 0.7, 0x3a2016, 0.0, 5, 40],
    core:      [CORE, 0.85, 0x2a160e, 0.4, 1, 40],
    sap:       [SAP, 0.9, 0x2f6a28, 0.0, 2, 40],
    crown:     [NEEDLE, 0.34, 0x24522a, 0.45, 6, 25],
    crownDeep: [0x2f6a33, 0.38, 0x1e4424, 0.45, 6, 25],
    stone:     [STONE, 0.55, 0x5c5d58, 0.5, 3, 20],
    fern:      [FERN, 0.55, 0x3f7a30, 0.0, 6, 40],
    fernStem:  [0x4f8a3a, 0.8, 0x3f7a30, 0.0, 6, 40],
  };
  bins.forEach((list, bin) => {
    const [color, opacity, edge, edgeOpacity, order, angle] = LOOK[bin];
    const geo = merged(list);
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color, transparent: true, opacity, roughness: 0.62, metalness: bin === "metal" ? 0.45 : 0.15,
      flatShading: true, side: THREE.DoubleSide, depthWrite: false,
    }));
    mesh.renderOrder = order;
    scene.add(mesh);
    if (edgeOpacity) {
      const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geo, angle), new THREE.LineBasicMaterial({ color: edge, transparent: true, opacity: edgeOpacity, depthWrite: false }));
      lines.renderOrder = order + 0.5;
      scene.add(lines);
    }
  });
  const needleGeo = new THREE.BufferGeometry();
  needleGeo.setAttribute("position", new THREE.Float32BufferAttribute(needles, 3));
  const needleLines = new THREE.LineSegments(needleGeo, new THREE.LineBasicMaterial({ color: 0x2c6030, transparent: true, opacity: 0.45, depthWrite: false }));
  needleLines.renderOrder = 7;
  scene.add(needleLines);

  // ---------- THE GROUND ----------
  // A patch of the forest floor, painted: soil, needle litter, a little
  // moss, darker round the trunk's foot — fading out at its edge into the
  // page, so the ground is drawn and the rest of the background is not.
  const FLOOR = 5.4;
  function floorTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 1024;
    const x = c.getContext("2d"), mid = 512;
    x.fillStyle = "rgb(" + SOIL.join(",") + ")";
    x.fillRect(0, 0, 1024, 1024);
    // The needle litter.
    const LITTER = ["#8e5236", "#5a3020", "#a06a4a", "#6e3c28", "#b07a56"];
    for (let n = 0; n < 9000; n++) {
      const px = rnd() * 1024, py = rnd() * 1024, a = rnd() * Math.PI, l = 4 + rnd() * 9;
      x.strokeStyle = LITTER[n % LITTER.length];
      x.globalAlpha = 0.35 + rnd() * 0.4;
      x.lineWidth = 1 + rnd();
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
    }
    // Moss and small green, mostly towards the edge, as in the photograph.
    for (let n = 0; n < 60; n++) {
      const a = rnd() * Math.PI * 2, r = 250 + rnd() * 200, px = mid + Math.cos(a) * r, py = mid + Math.sin(a) * r, s = 20 + rnd() * 50;
      const gr = x.createRadialGradient(px, py, 0, px, py, s);
      gr.addColorStop(0, "rgba(84, 130, 60, 0.55)");
      gr.addColorStop(1, "rgba(84, 130, 60, 0)");
      x.globalAlpha = 1;
      x.fillStyle = gr;
      x.fillRect(px - s, py - s, s * 2, s * 2);
    }
    // Darker round the trunk's foot.
    const shade = x.createRadialGradient(mid, mid, 0, mid, mid, 260);
    shade.addColorStop(0, "rgba(40, 20, 12, 0.5)");
    shade.addColorStop(1, "rgba(40, 20, 12, 0)");
    x.fillStyle = shade;
    x.fillRect(0, 0, 1024, 1024);
    // Faded out towards its edge.
    x.globalCompositeOperation = "destination-in";
    const fade = x.createRadialGradient(mid, mid, 300, mid, mid, 512);
    fade.addColorStop(0, "rgba(0,0,0,1)");
    fade.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = fade;
    x.fillRect(0, 0, 1024, 1024);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }
  const floorGeo = new THREE.RingGeometry(0.001, FLOOR, 96, 24);
  floorGeo.rotateX(-Math.PI / 2);
  {
    const p = floorGeo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, ground(p.getX(i), p.getZ(i)));
    // The ring's own texture coordinates are laid on it flat before it is
    // turned; turned, the far side is +z, so the painting is flipped to match.
    const uv = floorGeo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / (2 * FLOOR) + 0.5, 0.5 - p.getZ(i) / (2 * FLOOR));
    floorGeo.computeVertexNormals();
  }
  const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ map: floorTexture(), transparent: true, depthWrite: false, roughness: 1, metalness: 0 }));
  floor.renderOrder = 0;
  scene.add(floor);
  // The plate's rule: a ring round the patch, ticked every ten degrees,
  // as a specimen is measured.
  {
    const pos = [], R = FLOOR * 0.82;
    for (let k = 0; k < 144; k++) {
      const a0 = (k / 144) * Math.PI * 2, a1 = ((k + 1) / 144) * Math.PI * 2;
      const p0 = V(Math.cos(a0) * R, 0, Math.sin(a0) * R), p1 = V(Math.cos(a1) * R, 0, Math.sin(a1) * R);
      p0.y = ground(p0.x, p0.z) + 0.01; p1.y = ground(p1.x, p1.z) + 0.01;
      pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
      if (k % 4 === 0) {
        const tick = k % 36 === 0 ? 0.3 : 0.14, p2 = V(Math.cos(a0) * (R + tick), 0, Math.sin(a0) * (R + tick));
        p2.y = ground(p2.x, p2.z) + 0.01;
        pos.push(p0.x, p0.y, p0.z, p2.x, p2.y, p2.z);
      }
    }
    const rule = new THREE.BufferGeometry();
    rule.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    const ring = new THREE.LineSegments(rule, new THREE.LineBasicMaterial({ color: 0x3a2418, transparent: true, opacity: 0.35, depthWrite: false }));
    ring.renderOrder = 1;
    scene.add(ring);
    const a = (18 * Math.PI) / 180;
    ANCHOR.ground = { at: V(Math.cos(a) * R, ground(Math.cos(a) * R, Math.sin(a) * R), Math.sin(a) * R), out: V(Math.cos(a), 0.2, Math.sin(a)) };
  }

  // ---------- LIGHT ----------
  scene.add(new THREE.HemisphereLight(0xf2f5ec, 0x6b4a36, 0.95));
  const sun = new THREE.DirectionalLight(0xfff4e6, 0.85);
  sun.position.set(5, 11, 7);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xffffff, 0.18));

  // ============================================================
  // SEEING IT: a camera going round the tree at a distance that keeps the
  // whole of it in the window, turned by a drag and slowly on its own.
  // ============================================================
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const TARGET = V(0, 3.9, 0);
  let yaw = 0, pitch = 0.2, zoom = 1, W = 0, H = 0, far = 20;
  function size() {
    W = stage.clientWidth; H = stage.clientHeight;
    labels.forEach((l) => { l.w = 0; });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / Math.max(1, H);
    camera.updateProjectionMatrix();
    // Far enough that the tree's height, and the ground's width, fit —
    // with room either side for the labels on a wide window.
    const half = Math.tan((camera.fov * Math.PI) / 360);
    far = Math.max(13.6 / (2 * half), (W < 700 ? 9.5 : 17) / (2 * half * camera.aspect));
    frame();
  }
  function place() {
    const d = far * zoom;
    camera.position.set(TARGET.x + Math.sin(yaw) * Math.cos(pitch) * d, TARGET.y + Math.sin(pitch) * d, TARGET.z + Math.cos(yaw) * Math.cos(pitch) * d);
    camera.lookAt(TARGET);
    stage.dataset.yaw = yaw.toFixed(3);
  }

  // ---------- THE LABELS ----------
  const NS = "http://www.w3.org/2000/svg";
  const svg = stage.querySelector(".tree-leaders");
  const labels = [...stage.querySelectorAll(".tree-label")].map((el, n) => {
    const part = ANCHOR[el.dataset.part];
    if (!part || !svg) { el.hidden = true; return null; }
    const line = document.createElementNS(NS, "polyline");
    const mark = document.createElementNS(NS, "rect");
    mark.setAttribute("width", "5"); mark.setAttribute("height", "5");
    svg.appendChild(line); svg.appendChild(mark);
    return { el, part, line, mark, n, y: 0, side: 1 };
  }).filter(Boolean);
  const seen = V(0, 0, 0), toEye = V(0, 0, 0);
  let born = -1;
  function lay(t) {
    if (born < 0) born = t;
    const cx = W / 2, column = Math.min(W * 0.3, 380) + (W < 700 ? -W * 0.08 : 0);
    // Where each comes out of, on the window, and whether it faces you.
    labels.forEach((l) => {
      seen.copy(l.part.at).project(camera);
      l.sx = (seen.x * 0.5 + 0.5) * W;
      l.sy = (-seen.y * 0.5 + 0.5) * H;
      toEye.subVectors(camera.position, l.part.at).normalize();
      const out = l.part.out.clone().normalize();
      l.face = Math.max(0.28, Math.min(1, 0.6 + out.dot(toEye)));
      l.side = l.sx < cx ? -1 : 1;
      l.x = l.side < 0 ? Math.min(l.sx - 44, cx - column) : Math.max(l.sx + 44, cx + column);
      // Never off the window: on a narrow one the names stand at its
      // edges, over the tree's own edge if they must.
      if (!l.w) l.w = l.el.offsetWidth + 6;
      l.x = l.side < 0 ? Math.max(l.x, 8 + l.w) : Math.min(l.x, W - 8 - l.w);
      l.y = l.sy;
    });
    // One side at a time: kept apart, top to bottom, and on the window.
    [-1, 1].forEach((side) => {
      const on = labels.filter((l) => l.side === side).sort((a, b) => a.sy - b.sy);
      for (let k = 1; k < on.length; k++) on[k].y = Math.max(on[k].y, on[k - 1].y + LABEL_GAP);
      const over = on.length ? on[on.length - 1].y - (H - 60) : 0;
      if (over > 0) on.forEach((l) => { l.y -= over; });
      for (let k = on.length - 2; k >= 0; k--) on[k].y = Math.min(on[k].y, on[k + 1].y - LABEL_GAP);
      on.forEach((l) => { l.y = Math.max(70, Math.min(H - 30, l.y)); });
    });
    labels.forEach((l) => {
      const age = still ? 1e9 : t - born - LABEL_IN - l.n * LABEL_STEP;
      const grow = Math.max(0, Math.min(1, age / LABEL_DRAW));
      const e = grow * grow * (3 - 2 * grow);
      const elbow = l.x - l.side * 16;
      const pts = [[l.sx, l.sy], [elbow, l.y], [l.x, l.y]];
      // Drawn out from the tree, as far as it has come.
      const lens = [Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), Math.abs(pts[2][0] - pts[1][0])];
      let left = e * (lens[0] + lens[1]);
      const shown = [pts[0]];
      for (let k = 0; k < 2 && left > 0; k++) {
        const f = Math.min(1, left / (lens[k] || 1));
        shown.push([pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f]);
        left -= lens[k];
      }
      l.line.setAttribute("points", shown.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "));
      l.line.style.opacity = (l.face * (e > 0 ? 1 : 0)).toFixed(3);
      l.mark.setAttribute("x", (l.sx - 2.5).toFixed(1));
      l.mark.setAttribute("y", (l.sy - 2.5).toFixed(1));
      l.mark.style.opacity = (l.face * Math.min(1, e * 3)).toFixed(3);
      l.el.style.transform = "translate(" + (l.side < 0 ? "calc(" + (l.x - 6).toFixed(1) + "px - 100%)" : (l.x + 6).toFixed(1) + "px") + ", " + (l.y - 8).toFixed(1) + "px)";
      l.el.style.opacity = (l.face * Math.max(0, (e - 0.6) / 0.4)).toFixed(3);
      l.el.classList.toggle("is-left", l.side < 0);
    });
  }

  // ---------- TURNING IT ----------
  let dragging = null, lastDrag = -1e9, lastT = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = { x: e.clientX, y: e.clientY, yaw, pitch, id: e.pointerId };
    canvas.setPointerCapture(e.pointerId);
    stage.classList.add("is-turned");
    wake();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging || e.pointerId !== dragging.id) return;
    yaw = dragging.yaw - (e.clientX - dragging.x) * DRAG;
    pitch = Math.max(PITCH[0], Math.min(PITCH[1], dragging.pitch + (e.clientY - dragging.y) * DRAG * 0.6));
    lastDrag = performance.now();
    wake();
  });
  const letGo = () => { dragging = null; lastDrag = performance.now(); };
  canvas.addEventListener("pointerup", letGo);
  canvas.addEventListener("pointercancel", letGo);
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom = Math.max(0.55, Math.min(1.5, zoom * Math.exp(e.deltaY * 0.001)));
    stage.classList.add("is-turned");
    wake();
  }, { passive: false });

  function frame(t) {
    t = t || performance.now();
    place();
    renderer.render(scene, camera);
    lay(t);
  }
  let raf = 0;
  function loop(t) {
    raf = 0;
    const dt = Math.min(64, t - (lastT || t));
    lastT = t;
    if (!still && !dragging && t - lastDrag > TURN_AFTER) yaw += dt * TURN_RATE;
    frame(t);
    // It goes on while it is turning on its own, or labels are coming out.
    if (!still || dragging || t - born < LABEL_IN + labels.length * LABEL_STEP + LABEL_DRAW) raf = requestAnimationFrame(loop);
  }
  function wake() {
    if (!raf) raf = requestAnimationFrame(loop);
  }
  if ("ResizeObserver" in window) new ResizeObserver(size).observe(stage);
  else window.addEventListener("resize", size);
  size();
  stage.classList.add("is-drawn");
  wake();
})();

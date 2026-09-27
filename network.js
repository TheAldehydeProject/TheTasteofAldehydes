// ============================================================
// THE NETWORK — works/test-page.html (the test page)
//
// It began (2026-09-26) as the owner's picture of a dense red network —
// solid red spheres, thousands of hair-thin lines, small black tags, two
// yellow — standing for nothing. Then, 2026-09-27:
//
//   "for the test page, I want you to make more spaced out, the balls
//   should be red and glowy, i want them to be more techy and geometric,
//   i also want there to be more effects. i like it spinning, i like it
//   being a netweork. I want the balls to correspond to something, for
//   now make it arbitrary.
//   I want when you select a sphere, the rest turn translucent (opacity
//   change), make it a part of a several part system going in 5
//   directions where you would have a system in the middle and then 4
//   more such systems, one on each "corner" of this system. you should
//   have a line attaching them and clicking on it will take you from one
//   to another."
//
// So it is FIVE SYSTEMS now (`SYSTEMS`): one in the middle and one at each
// of its four corners, a quincunx, the corner ones standing further back.
// Each is a network of its own:
//
//   - THE NODES, spaced out (`GAP`: no two nearer than a set distance),
//     every one RED AND GLOWING — a faceted sphere, lit and glowing from
//     within, with a soft halo round it (`glow`) — and the busiest of them
//     (the HUBS) carrying a turning wire cage and a ring: techy and
//     geometric.
//   - EVERY NODE STANDS FOR SOMETHING, arbitrarily for now: a code (NXS-042),
//     a role (RELAY, ARCHIVE, SENSOR …), a load and a latency, the system it
//     belongs to and how many links it has. Pointed at, it says its code;
//     SELECTED (pressed), it says all of it in a card beside it — and every
//     other sphere turns TRANSLUCENT, every other line faint, its own links
//     lit. Pressing it again, pressing empty space or Escape lets it go.
//   - THE LINKS, hair-thin and glowing, each to its nearest few, hubs out
//     all over; PULSES running along them.
//   - THE FRAME each system turns in: a ticked ring round its middle and a
//     second across it, turning the other way; and now and then a PING, a
//     ring going out from the middle of the system you are at.
//
// THE BRIDGES: a line from the middle system to each corner one, with
// pulses running along it and markers on it. Pressing a bridge TAKES YOU
// ALONG IT to the system at its other end (the camera flies there); the
// little map at the foot of the page says where you are, and its dots go
// there too. Every system SPINS slowly on its own; a drag turns the view
// round the system you are at, and the wheel brings it closer.
//
// THE TAGS (the page's `.net-label` list) stay where they were asked for:
// beside nodes of the middle system — those nodes are NAMED by them — and
// the two yellow ones beside its two marked nodes, joined to their
// neighbours by yellow lines. They fade while you are at another system.
//
// Three.js r128, from the same address as the home page's map, with the
// library's own meshes, lines and points — no shader of its own. Seeded,
// so it is the same five systems every time. Without the library the page
// says so. With reduced motion nothing turns, runs or pings on its own, and
// a journey along a bridge is made at once.
// ============================================================
(function () {
  const stage = document.querySelector(".net-stage");
  const canvas = stage && stage.querySelector(".net-canvas");
  if (!canvas) return;
  if (typeof THREE === "undefined") {
    const say = stage.querySelector(".net-fallback");
    if (say) say.hidden = false;
    stage.classList.add("is-bare");
    return;
  }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const GROUND = 0x1f1f20;              // the page's own (--bg)
  const REDS = [0xff3a44, 0xf2404b, 0xff525b, 0xe8323d, 0xff6168];
  const HOT = 0xffe4e6;                 // a selected node, white-hot
  const LINE = 0xff5a63;                // the links
  const FRAME = 0x9a3b41;               // the rings a system turns in
  const MARK = 0xf2b418;                // the two yellow tags, and their lines

  // THE FIVE SYSTEMS: the middle one, then the four corners — top left, top
  // right, bottom right, bottom left — further back, so from the middle
  // they stand in the window's corners.
  const SYSTEMS = [
    { name: "NEXUS", code: "NXS", at: [0, 0, 0], count: 150 },
    { name: "ARGO", code: "ARG", at: [-9.6, 5.3, -9], count: 110 },
    { name: "HALCYON", code: "HLC", at: [9.6, 5.3, -9], count: 110 },
    { name: "KESTREL", code: "KST", at: [9.6, -5.3, -9], count: 110 },
    { name: "VANTA", code: "VNT", at: [-9.6, -5.3, -9], count: 110 },
  ];
  const RADIUS = 1.9;                   // how far a system's body reaches
  const GAP = 0.33;                     // no two nodes nearer than this
  const NEAREST = [2, 4];               // each joined to between this many of its nearest
  const HUBS = 7;                       // per system: nodes that send lines out all over
  const HUB_LINKS = [7, 15];
  const CAGES = 6;                      // the busiest nodes in a system carry a cage
  const PULSES = 46;                    // running along a system's links at once
  const ROLES = ["RELAY", "ARCHIVE", "SENSOR", "BEACON", "VAULT", "GATE", "CACHE", "ORACLE", "ROUTER", "SEED"];

  const SPIN = 0.00011;                 // radians a millisecond a system turns on its own
  const DRAG = 0.0058;                  // radians a pixel of drag
  const PITCH = [-0.7, 0.9];            // how far the view can be tipped
  const FLY_MS = 1900;                  // a journey along a bridge
  const FADE_MS = 520;                  // the rest going translucent, and coming back
  const GHOST = 0.13;                   // how solid the rest stay while one is selected
  const PING_EVERY = 4200;              // ms between one ping and the next
  const TAG_IN = 700;                   // ms before the first tag comes up
  const TAG_STEP = 90;                  // ms between one tag and the next

  // Seeded, so it is the same five systems every time.
  let seed = 7240926;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  const between = ([a, b]) => a + Math.floor(rnd() * (b - a + 1));
  const pad = (n) => String(n).padStart(3, "0");
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  // THE GLOW: one soft round spot, drawn once, that every halo and pulse is.
  function spot() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(0.16, "rgba(255,255,255,0.8)");
    r.addColorStop(0.42, "rgba(255,255,255,0.22)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const SPOT = spot();

  // ============================================================
  // THE SCENE
  // ============================================================
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 140);
  scene.fog = new THREE.Fog(GROUND, 10, 30);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  scene.add(new THREE.HemisphereLight(0xfff0ee, 0x2a1416, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff8c8c, 0.45);
  rim.position.set(4, -2, -3);
  scene.add(rim);

  const BALL = new THREE.IcosahedronGeometry(1, 1);           // faceted: geometric
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  const circle = (r, n, dashed) => {
    const pos = [];
    for (let k = 0; k < n; k++) {
      if (dashed && k % 2) continue;
      const a = (k / n) * Math.PI * 2, b = ((k + 1) / n) * Math.PI * 2;
      pos.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(b) * r, 0, Math.sin(b) * r);
    }
    return pos;
  };
  const segments = (pos, colour, opacity, additive) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
      color: colour, transparent: true, opacity, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
  };

  // ============================================================
  // ONE SYSTEM: its nodes, what each stands for, its links, and how it is
  // drawn.
  // ============================================================
  const names = [...stage.querySelectorAll(".net-label")];
  function build(def, index) {
    const S = { ...def, index, P: [], SIZE: [], data: [], links: [], near: [], lit: new Set() };
    const group = new THREE.Group();
    group.position.set(...def.at);
    scene.add(group);
    S.group = group;
    S.centre = new THREE.Vector3(...def.at);

    // THE NODES, SPACED OUT: a core, a body round it, a few far out — none
    // nearer another than GAP.
    const P = S.P;
    for (let tries = 0; P.length < def.count && tries < def.count * 60; tries++) {
      const r = rnd();
      let p;
      if (r < 0.3) p = [gauss() * 0.75, gauss() * 0.6, gauss() * 0.65];
      else if (r < 0.86) p = [gauss() * 1.2, gauss() * 0.86, gauss() * 1];
      else {
        const a = rnd() * Math.PI * 2, e = (rnd() - 0.5) * 1.6, d = RADIUS * (1 + rnd() * 0.45);
        p = [Math.cos(a) * Math.cos(e) * d, Math.sin(e) * d * 0.8, Math.sin(a) * Math.cos(e) * d];
      }
      if (Math.hypot(...p) > RADIUS * 1.5) continue;
      if (P.some((o) => Math.hypot(o[0] - p[0], o[1] - p[1], o[2] - p[2]) < GAP)) continue;
      P.push(p);
    }
    const N = P.length;
    const dist = (a, b) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1], P[a][2] - P[b][2]);

    // THE LINKS.
    const seen = new Set();
    const join = (a, b, kind) => {
      if (a === b) return;
      const k = a < b ? a + ":" + b : b + ":" + a;
      if (seen.has(k)) return;
      seen.add(k);
      S.links.push([a, b, kind || ""]);
    };
    for (let i = 0; i < N; i++) {
      const near = [];
      for (let j = 0; j < N; j++) if (j !== i) near.push([dist(i, j), j]);
      near.sort((x, y) => x[0] - y[0]);
      const n = between(NEAREST);
      for (let k = 0; k < n; k++) join(i, near[k][1]);
    }
    const hubs = [];
    while (hubs.length < HUBS) {
      const h = Math.floor(rnd() * N);
      if (Math.hypot(...P[h]) < RADIUS && !hubs.includes(h)) hubs.push(h);
    }
    hubs.forEach((h) => {
      const n = between(HUB_LINKS);
      for (let k = 0, tries = 0; k < n && tries < n * 20; tries++) {
        const j = Math.floor(rnd() * N);
        if (rnd() < Math.min(1, 0.3 + dist(h, j) * 0.25)) { join(h, j); k++; }
      }
    });
    // THE MARKED TWO, in the middle system only: low in it, each joined to
    // its four nearest by yellow lines.
    S.marked = [];
    if (index === 0) {
      const low = [...P.keys()].filter((i) => P[i][1] < -0.35 && Math.hypot(...P[i]) < RADIUS).sort((a, b) => P[a][1] - P[b][1]);
      // Two of them, well apart, so their yellow tags never meet.
      const first = low[Math.floor(low.length * 0.3)];
      const second = low.filter((i) => i !== first).sort((a, b) => dist(b, first) - dist(a, first))[0];
      S.marked = [first, second].filter((i) => i != null);
      S.marked.forEach((m) => {
        [...P.keys()].filter((j) => j !== m).sort((a, b) => dist(m, a) - dist(m, b)).slice(0, 4)
          .forEach((j) => { S.links = S.links.filter(([a, b]) => !((a === m && b === j) || (a === j && b === m))); S.links.push([m, j, "mark"]); });
      });
    }
    const degree = new Array(N).fill(0);
    S.near = P.map(() => []);
    S.links.forEach(([a, b]) => { degree[a]++; degree[b]++; S.near[a].push(b); S.near[b].push(a); });
    S.degree = degree;
    S.hubs = hubs;
    S.SIZE = P.map((_, i) => Math.min(0.085, 0.026 + 0.0068 * Math.sqrt(degree[i]) + (rnd() < 0.05 ? 0.022 : 0) + rnd() * 0.008));

    // WHAT EACH NODE STANDS FOR — arbitrarily, for now.
    S.data = P.map((_, i) => ({
      code: def.code + "-" + pad(i + 1),
      role: pick(ROLES),
      load: 8 + Math.floor(rnd() * 88),
      latency: 2 + Math.floor(rnd() * 140),
      links: degree[i],
      name: "",
    }));

    // THE SPHERES: every node twice over — SOLID, and a GHOST of it for
    // while another is selected — only one of the two ever at its size.
    const solid = new THREE.InstancedMesh(BALL, new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x6b0b12, emissiveIntensity: 1, roughness: 0.32, metalness: 0.3, flatShading: true,
    }), N);
    const ghost = new THREE.InstancedMesh(BALL, new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x6b0b12, roughness: 0.4, metalness: 0.2, flatShading: true,
      transparent: true, opacity: 1, depthWrite: false,
    }), N);
    S.colour = P.map(() => new THREE.Color(pick(REDS)));
    for (let i = 0; i < N; i++) { solid.setColorAt(i, S.colour[i]); ghost.setColorAt(i, S.colour[i]); }
    group.add(solid, ghost);
    S.solid = solid;
    S.ghost = ghost;
    S.place = (i, where, grow) => {
      m4.compose(v3.set(...P[i]), q.identity(), s3.setScalar(S.SIZE[i] * (grow || 1)));
      const zero = new THREE.Matrix4().makeScale(0, 0, 0);
      solid.setMatrixAt(i, where === "solid" ? m4 : zero);
      ghost.setMatrixAt(i, where === "ghost" ? m4 : zero);
    };
    for (let i = 0; i < N; i++) S.place(i, "solid");

    // THE GLOW round every node: a soft halo, added to what is behind it.
    const glowPos = new Float32Array(N * 3), glowCol = new Float32Array(N * 3);
    P.forEach((p, i) => glowPos.set(p, i * 3));
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));
    glowGeo.setAttribute("color", new THREE.BufferAttribute(glowCol, 3));
    S.glow = new THREE.Points(glowGeo, new THREE.PointsMaterial({
      map: SPOT, size: 0.95, sizeAttenuation: true, vertexColors: true, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    group.add(S.glow);

    // THE LINKS, glowing, in the red of what they join; the yellow ones.
    const linePos = new Float32Array(S.links.length * 6), lineCol = new Float32Array(S.links.length * 6);
    const tint = new THREE.Color();
    S.links.forEach(([a, b, kind], n) => {
      linePos.set(P[a], n * 6); linePos.set(P[b], n * 6 + 3);
      tint.set(kind === "mark" ? MARK : LINE).multiplyScalar(kind === "mark" ? 0.9 : Math.max(0.2, 0.55 - dist(a, b) * 0.12));
      lineCol.set([tint.r, tint.g, tint.b, tint.r, tint.g, tint.b], n * 6);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
    S.lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    group.add(S.lines);
    // A node's own links, lit, while it is pointed at or selected.
    S.litLines = segments([], 0xffd0d4, 0.95, true);
    group.add(S.litLines);

    // THE CAGES: the busiest nodes each in a turning wire octahedron, with a
    // ring round it.
    S.cages = [];
    const busiest = [...P.keys()].sort((a, b) => degree[b] - degree[a]).slice(0, CAGES);
    busiest.forEach((i, n) => {
      const cage = new THREE.Group();
      cage.position.set(...P[i]);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(S.SIZE[i] * 2.4)),
        new THREE.LineBasicMaterial({ color: 0xff7c83, transparent: true, opacity: 0.8, depthWrite: false }));
      const ring = segments(circle(S.SIZE[i] * 3.3, 40, true), 0xff9aa0, 0.55, true);
      ring.rotation.x = 0.4 + n * 0.3;
      cage.add(edge, ring);
      cage.userData = { edge, ring, node: i, rate: 0.0006 + n * 0.00012 };
      group.add(cage);
      S.cages.push(cage);
    });

    // THE FRAME the system turns in: a ticked, dashed ring round its middle
    // and one across it, turning the other way.
    const frame = new THREE.Group();
    const R = RADIUS * 1.28;
    const ticks = [];
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2, l = k % 6 ? 0.06 : 0.16;
      ticks.push(Math.cos(a) * R, 0, Math.sin(a) * R, Math.cos(a) * (R + l), 0, Math.sin(a) * (R + l));
    }
    const equator = segments(circle(R, 120, true).concat(ticks), FRAME, 0.7, true);
    const meridian = segments(circle(R * 0.96, 90, true), FRAME, 0.4, true);
    meridian.rotation.z = Math.PI / 2;
    meridian.rotation.y = 0.5;
    const axis = segments([0, -R * 1.1, 0, 0, R * 1.1, 0], FRAME, 0.35, true);
    frame.add(equator, meridian, axis);
    group.add(frame);
    S.frame = frame;

    // THE PING: a ring going out from the middle of the system you are at.
    S.ping = segments(circle(1, 96, false), 0xff6b73, 0, true);
    group.add(S.ping);
    S.pingAt = -1e9;

    // THE PULSES running along its links.
    S.pulse = [];
    const pulsePos = new Float32Array(PULSES * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    S.pulses = new THREE.Points(pulseGeo, new THREE.PointsMaterial({
      map: SPOT, color: 0xffd7da, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0.95,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    for (let k = 0; k < PULSES; k++) S.pulse.push({ link: Math.floor(rnd() * S.links.length), t: rnd(), rate: 0.00025 + rnd() * 0.0005, back: rnd() < 0.5 });
    group.add(S.pulses);

    S.spin = rnd() * Math.PI * 2;
    S.rate = SPIN * (0.85 + rnd() * 0.3);
    return S;
  }
  const systems = SYSTEMS.map(build);
  const middle = systems[0];

  // The tags NAME the nodes they stand beside, in the middle system.
  const middleHubs = [...middle.P.keys()].sort((a, b) => middle.degree[b] - middle.degree[a]);
  const outer = [...middle.P.keys()].filter((i) => Math.hypot(...middle.P[i]) > RADIUS * 0.95).sort((a, b) => middle.degree[b] - middle.degree[a]);
  const bearers = [...middleHubs.slice(0, 6), ...outer].filter((v, n, all) => all.indexOf(v) === n);
  const plain = names.filter((el) => !el.classList.contains("is-marked"));
  const yellow = names.filter((el) => el.classList.contains("is-marked"));
  const taken = new Set();
  const tags = [
    ...plain.map((el, n) => ({ el, node: bearers[(n * 5) % bearers.length] })),
    ...yellow.map((el, n) => ({ el, node: middle.marked[n] })),
  ].filter((t) => t.node != null).map((t, n) => ({ ...t, n }));
  tags.forEach((t) => {
    while (taken.has(t.node)) t.node = bearers[(bearers.indexOf(t.node) + 1) % bearers.length];
    taken.add(t.node);
    const word = t.el.firstChild ? t.el.firstChild.textContent.trim() : t.el.textContent.trim();
    middle.data[t.node].name = word;
  });

  // ============================================================
  // THE BRIDGES: the middle system to each corner.
  // ============================================================
  const bridges = systems.slice(1).map((S, k) => {
    const from = middle.centre.clone(), to = S.centre.clone();
    const way = to.clone().sub(from).normalize();
    const a = from.clone().addScaledVector(way, RADIUS * 1.35), b = to.clone().addScaledVector(way, -RADIUS * 1.35);
    const group = new THREE.Group();
    scene.add(group);
    const core = segments([...a.toArray(), ...b.toArray()], 0xff5a63, 0.9, true);
    // Two faint rails either side of it.
    const side = new THREE.Vector3().crossVectors(way, new THREE.Vector3(0, 0, 1)).normalize().multiplyScalar(0.05);
    const rails = segments([
      ...a.clone().add(side).toArray(), ...b.clone().add(side).toArray(),
      ...a.clone().sub(side).toArray(), ...b.clone().sub(side).toArray(),
    ], 0xff5a63, 0.28, true);
    // Markers along it: small wire diamonds.
    const markers = [];
    [0.25, 0.5, 0.75].forEach((t) => {
      const d = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.1)),
        new THREE.LineBasicMaterial({ color: 0xff8a90, transparent: true, opacity: 0.8, depthWrite: false }));
      d.position.copy(a).lerp(b, t);
      group.add(d);
      markers.push(d);
    });
    // Pulses along it, both ways.
    const pos = new Float32Array(8 * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pulses = new THREE.Points(geo, new THREE.PointsMaterial({
      map: SPOT, color: 0xffc9cd, size: 0.34, sizeAttenuation: true, transparent: true, opacity: 0.95,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    group.add(core, rails, pulses);
    return { k, to: k + 1, a, b, group, core, rails, markers, pulses, glow: 0 };
  });

  const total = systems.reduce((n, S) => n + S.P.length, 0);
  const totalLinks = systems.reduce((n, S) => n + S.links.length, 0);
  stage.dataset.nodes = String(total);
  stage.dataset.links = String(totalLinks);
  stage.dataset.systems = String(systems.length);
  stage.dataset.bridges = String(bridges.length);

  // Specks in the air round it all.
  const dust = [];
  for (let i = 0; i < 420; i++) dust.push((rnd() - 0.5) * 34, (rnd() - 0.5) * 22, (rnd() - 0.5) * 26 - 3);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
  const dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x8a7f7d, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.7 }));
  scene.add(dustPts);

  // ============================================================
  // THE CHROME the script adds: the card a selected node says itself in,
  // the label a pointed-at node or bridge says its name in, and the map
  // at the foot saying which system you are at.
  // ============================================================
  const card = document.createElement("div");
  card.className = "net-card";
  card.hidden = true;
  card.setAttribute("aria-live", "polite");
  stage.appendChild(card);
  const hoverTag = document.createElement("p");
  hoverTag.className = "net-hover";
  hoverTag.setAttribute("aria-hidden", "true");
  stage.appendChild(hoverTag);
  const bridgeTag = document.createElement("p");
  bridgeTag.className = "net-bridge";
  bridgeTag.setAttribute("aria-hidden", "true");
  stage.appendChild(bridgeTag);

  const map = document.createElement("nav");
  map.className = "net-map";
  map.setAttribute("aria-label", "The five systems");
  const DOT = [[50, 50], [14, 18], [86, 18], [86, 82], [14, 82]];
  map.innerHTML =
    '<p class="net-map-say"><span class="net-map-no"></span><span class="net-map-name"></span><span class="net-map-count"></span></p>' +
    '<div class="net-map-plan">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true">' +
        DOT.slice(1).map(([x, y]) => '<line x1="50" y1="50" x2="' + x + '" y2="' + y + '"/>').join("") +
      "</svg>" +
      systems.map((S, i) => '<button type="button" class="net-map-dot" style="left:' + DOT[i][0] + "%;top:" + DOT[i][1] + '%" data-system="' + i + '" aria-label="Go to system ' + (i + 1) + ", " + S.name + '"></button>').join("") +
    "</div>";
  stage.appendChild(map);
  const mapDots = [...map.querySelectorAll(".net-map-dot")];
  mapDots.forEach((b) => b.addEventListener("click", () => travel(+b.dataset.system)));

  // ============================================================
  // SEEING IT
  // ============================================================
  const target = middle.centre.clone();
  let focus = 0, flight = null;
  let yaw = 0, pitch = 0.08, zoom = 1, W = 0, H = 0, far = 12;
  function size() {
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    tags.forEach((g) => { g.w = 0; });
    camera.aspect = W / Math.max(1, H);
    camera.updateProjectionMatrix();
    // Far enough that a system stands in the middle with room round it, and
    // on a wide window the four corners show in its corners.
    const half = Math.tan((camera.fov * Math.PI) / 360);
    far = Math.max(7.2 / (2 * half), 7.6 / (2 * half * camera.aspect));
    frame(performance.now());
  }
  function aim() {
    const d = far * zoom;
    camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * d, target.y + Math.sin(pitch) * d, target.z + Math.cos(yaw) * Math.cos(pitch) * d);
    camera.lookAt(target);
    scene.fog.near = d + 2;
    scene.fog.far = d + 24;
  }
  const onScreen = (v) => {
    const p = v.clone().project(camera);
    return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z };
  };
  const worldOf = (S, i) => new THREE.Vector3(...S.P[i]).applyMatrix4(S.group.matrixWorld);

  // ============================================================
  // SELECTING: one node whole and lit, and every other sphere in every
  // system translucent, every other line faint.
  // ============================================================
  let selected = null;                   // { S, i }
  let fade = { from: 0, to: 0, t0: 0 };  // 0: all whole, 1: the rest translucent
  let fadeNow = 0;
  function brightness(S, i) {
    if (!selected || fadeNow <= 0) return 1;
    if (selected.S === S && selected.i === i) return 1 + fadeNow * 1.2;
    const near = selected.S === S && S.near[selected.i].includes(i);
    return 1 - fadeNow * (near ? 0.45 : 0.86);
  }
  function paintGlow() {
    systems.forEach((S) => {
      const col = S.glow.geometry.attributes.color;
      for (let i = 0; i < S.P.length; i++) {
        const k = brightness(S, i) * (0.5 + S.SIZE[i] * 6);
        const hot = selected && selected.S === S && selected.i === i ? fadeNow : 0;
        const c = S.colour[i];
        col.setXYZ(i, (c.r + (1 - c.r) * hot) * k, (c.g + (1 - c.g) * hot) * k * 0.62, (c.b + (1 - c.b) * hot) * k * 0.62);
      }
      col.needsUpdate = true;
    });
  }
  function litOf(S, i) {
    const pos = [];
    if (i >= 0) S.links.forEach(([a, b]) => { if (a === i || b === i) pos.push(...S.P[a], ...S.P[b]); });
    S.litLines.geometry.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return pos.length / 6;
  }
  function select(S, i) {
    if (selected && selected.S === S && selected.i === i) { deselect(); return; }
    if (selected) selected.S.lit.clear();
    selected = { S, i };
    systems.forEach((T) => {
      for (let j = 0; j < T.P.length; j++) T.place(j, T === S && j === i ? "solid" : "ghost", T === S && j === i ? 1.5 : 1);
      T.solid.instanceMatrix.needsUpdate = true;
      T.ghost.instanceMatrix.needsUpdate = true;
      if (T !== S) litOf(T, -1);
    });
    const n = litOf(S, i);
    fade = { from: fadeNow, to: 1, t0: performance.now() };
    const d = S.data[i];
    card.innerHTML =
      '<p class="net-card-code">' + d.code + (d.name ? " · " + d.name : "") + "</p>" +
      '<p class="net-card-role">' + d.role + "</p>" +
      "<dl>" +
        "<div><dt>System</dt><dd>" + S.name + "</dd></div>" +
        "<div><dt>Links</dt><dd>" + d.links + "</dd></div>" +
        "<div><dt>Load</dt><dd>" + d.load + "%</dd></div>" +
        "<div><dt>Latency</dt><dd>" + d.latency + " ms</dd></div>" +
      "</dl>";
    card.hidden = false;
    card.w = 0;
    stage.classList.add("is-selecting");
    stage.dataset.selected = d.code;
    stage.dataset.lit = String(n);
    wake();
  }
  function deselect() {
    if (!selected) return;
    fade = { from: fadeNow, to: 0, t0: performance.now() };
    litOf(selected.S, -1);
    card.hidden = true;
    stage.classList.remove("is-selecting");
    stage.dataset.selected = "";
    stage.dataset.lit = "0";
    wake();
  }
  /** Once the rest are whole again, they are solid again. */
  function settleFade(t) {
    const dur = still ? 1 : FADE_MS;
    const e = ease(Math.min(1, (t - fade.t0) / dur));
    fadeNow = fade.from + (fade.to - fade.from) * e;
    const ghostOpacity = 1 - fadeNow * (1 - GHOST);
    systems.forEach((S) => {
      S.ghost.material.opacity = ghostOpacity;
      S.lines.material.opacity = 1 - fadeNow * 0.84;
      S.pulses.material.opacity = 0.95 - fadeNow * 0.7;
      S.cages.forEach((c) => {
        const mine = selected && selected.S === S && selected.i === c.userData.node;
        c.userData.edge.material.opacity = 0.8 - (mine ? 0 : fadeNow * 0.62);
        c.userData.ring.material.opacity = 0.55 - (mine ? 0 : fadeNow * 0.42);
      });
      S.frame.children.forEach((f, n) => { f.material.opacity = [0.7, 0.4, 0.35][n] * (1 - fadeNow * 0.5); });
    });
    bridges.forEach((B) => { B.group.visible = true; B.core.material.opacity = (0.9 - fadeNow * 0.5) + B.glow * 0.1; });
    stage.dataset.ghost = ghostOpacity.toFixed(2);
    if (fade.to === 0 && e >= 1 && selected) {
      systems.forEach((S) => {
        for (let j = 0; j < S.P.length; j++) S.place(j, "solid");
        S.solid.instanceMatrix.needsUpdate = true;
        S.ghost.instanceMatrix.needsUpdate = true;
      });
      selected = null;
    }
    paintGlow();
    return e < 1;
  }

  // ============================================================
  // TRAVELLING along a bridge.
  // ============================================================
  /** How the view stands at a system: square on to the middle one; at a
      corner, turned part of the way round so that you look back across it
      towards the middle, which stands off to one side behind it. */
  function poseAt(i) {
    if (i === 0) return { yaw: 0, pitch: 0.08 };
    const away = systems[i].centre.clone().sub(middle.centre).normalize();
    const d = away.multiplyScalar(0.55).add(new THREE.Vector3(0, Math.sin(0.08), Math.cos(0.08)).multiplyScalar(0.45)).normalize();
    return { yaw: Math.atan2(d.x, d.z), pitch: Math.asin(d.y) * 0.6 };
  }
  function travel(to) {
    if (to === focus || to < 0 || to >= systems.length) return;
    deselect();
    const pose = poseAt(to);
    // The shortest way round to the new heading.
    let turn = pose.yaw - yaw;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    flight = { from: target.clone(), to: systems[to].centre.clone(), t0: performance.now(), dest: to,
      yaw0: yaw, yaw1: yaw + turn, pitch0: pitch, pitch1: pose.pitch };
    stage.dataset.flying = "1";
    if (still) { target.copy(flight.to); yaw = flight.yaw1; pitch = flight.pitch1; arrive(); }
    wake();
  }
  function arrive() {
    focus = flight.dest;
    flight = null;
    stage.dataset.flying = "";
    systems[focus].pingAt = performance.now() - PING_EVERY * 0.7;
    say();
  }
  function say() {
    const S = systems[focus];
    stage.dataset.focus = String(focus);
    stage.dataset.system = S.name;
    map.querySelector(".net-map-no").textContent = pad(focus + 1).slice(1) + " / 05";
    map.querySelector(".net-map-name").textContent = S.name;
    map.querySelector(".net-map-count").textContent = S.P.length + " nodes · " + S.links.length + " links";
    mapDots.forEach((b, i) => { b.classList.toggle("is-here", i === focus); b.setAttribute("aria-current", i === focus ? "true" : "false"); });
  }

  // ============================================================
  // THE TAGS: black labels beside nodes of the middle system, the two
  // yellow ones beside its marked nodes; they fade while you are away.
  // ============================================================
  let born = -1;
  function tag(t) {
    if (born < 0) born = t;
    const cx = W / 2;
    const home = focus === 0 && !flight ? 1 : 0;
    tags.forEach((g) => {
      const at = onScreen(worldOf(middle, g.node));
      const right = at.x >= cx, gap = 10 + middle.SIZE[g.node] * 70;
      const age = still ? 1e9 : t - born - TAG_IN - g.n * TAG_STEP;
      const e = Math.max(0, Math.min(1, age / 400));
      const toEye = worldOf(middle, g.node).sub(camera.position).length() - far * zoom;
      const face = g.el.classList.contains("is-marked") ? 1 : Math.max(0.35, Math.min(1, 0.85 - toEye * 0.35));
      if (!g.w) { g.w = g.el.offsetWidth; g.h = g.el.offsetHeight; }
      g.box = [right ? at.x + gap : at.x - gap - g.w, at.y - 9, g.w, g.h];
      g.el.style.transform = "translate(" + (right ? (at.x + gap).toFixed(1) + "px" : "calc(" + (at.x - gap).toFixed(1) + "px - 100%)") + ", " + (at.y - 9).toFixed(1) + "px)";
      const dim = selected && fadeNow > 0 && !(selected.S === middle && selected.i === g.node) ? 1 - fadeNow * 0.75 : 1;
      g.show = e * face * home * dim;
    });
    tags.forEach((g, a) => {
      for (let b = 0; b < a; b++) {
        const o = tags[b];
        if (o.show <= 0.01) continue;
        const [x1, y1, w1, h1] = g.box, [x2, y2, w2, h2] = o.box;
        if (x1 < x2 + w2 + 4 && x2 < x1 + w1 + 4 && y1 < y2 + h2 + 3 && y2 < y1 + h1 + 3) {
          const loser = g.el.classList.contains("is-marked") ? o : g;
          if (!loser.el.classList.contains("is-marked")) loser.show = 0;
        }
      }
    });
    // The two yellow ones never give way — so if they meet, the second
    // stands just under the first.
    const [m1, m2] = tags.filter((g) => g.el.classList.contains("is-marked"));
    if (m1 && m2) {
      const [x1, y1, w1, h1] = m1.box, [x2, y2, w2] = m2.box;
      if (x1 < x2 + w2 + 4 && x2 < x1 + w1 + 4 && y1 < y2 + h1 + 3 && y2 < y1 + h1 + 3) {
        const y = y1 + h1 + 4;
        m2.box[1] = y;
        m2.el.style.transform = m2.el.style.transform.replace(/,\s*[-\d.]+px\)$/, ", " + y.toFixed(1) + "px)");
      }
    }
    tags.forEach((g) => { g.el.style.opacity = g.show.toFixed(3); });
  }
  /** The card beside the node it describes, kept on the window. */
  function cardTo() {
    if (!selected || card.hidden) return;
    const at = onScreen(worldOf(selected.S, selected.i));
    if (!card.w) { card.w = card.offsetWidth; card.h = card.offsetHeight; }
    let x = at.x + 26, y = at.y - card.h / 2;
    if (x + card.w > W - 16) x = at.x - 26 - card.w;
    y = Math.max(16, Math.min(H - card.h - 90, y));
    card.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
  }

  // ============================================================
  // THE POINTER: a node under it says its code and lights its links; a
  // bridge under it lights up and says where it goes.
  // ============================================================
  let hovered = null, overBridge = -1, handX = -1, handY = -1;
  function nodeAt(x, y) {
    let best = null, bestZ = Infinity;
    const scale = H / (2 * Math.tan((camera.fov * Math.PI) / 360));
    systems.forEach((S) => {
      for (let i = 0; i < S.P.length; i++) {
        const w = worldOf(S, i);
        const d = w.distanceTo(camera.position);
        const p = onScreen(w);
        if (p.z > 1) continue;
        const r = Math.max(6, (S.SIZE[i] * 1.3 * scale) / d);
        if (Math.hypot(p.x - x, p.y - y) > r) continue;
        if (d < bestZ) { bestZ = d; best = { S, i }; }
      }
    });
    return best;
  }
  function bridgeAt(x, y) {
    let best = -1, bestD = 10;
    bridges.forEach((B, k) => {
      const a = onScreen(B.a), b = onScreen(B.b);
      if (a.z > 1 || b.z > 1) return;
      const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy;
      const u = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / Math.max(1, L)));
      const d = Math.hypot(a.x + dx * u - x, a.y + dy * u - y);
      if (d < bestD) { bestD = d; best = k; }
    });
    return best;
  }
  /** Where a bridge leads from here: the end you are not at, or the
      further of the two. */
  function leadsTo(k) {
    const B = bridges[k];
    if (focus === 0) return B.to;
    if (focus === B.to) return 0;
    return B.to;
  }
  function point(x, y) {
    handX = x; handY = y;
    if (flight) return;
    const n = nodeAt(x, y);
    const k = n ? -1 : bridgeAt(x, y);
    const same = n && hovered && n.S === hovered.S && n.i === hovered.i;
    if (!same) {
      if (hovered && !(selected && selected.S === hovered.S)) litOf(hovered.S, -1);
      hovered = n;
      if (n && !selected) stage.dataset.lit = String(litOf(n.S, n.i));
      else if (!selected) stage.dataset.lit = "0";
      stage.dataset.hover = n ? n.S.data[n.i].code : "";
    }
    overBridge = k;
    stage.dataset.overBridge = k >= 0 ? String(k) : "";
    canvas.style.cursor = n || k >= 0 ? "pointer" : "";
    wake();
  }
  function unpoint() {
    if (hovered && !selected) litOf(hovered.S, -1);
    hovered = null;
    overBridge = -1;
    stage.dataset.hover = "";
    stage.dataset.overBridge = "";
    if (!selected) stage.dataset.lit = "0";
    canvas.style.cursor = "";
    wake();
  }
  function labels() {
    const isSelected = hovered && selected && fade.to === 1 && selected.S === hovered.S && selected.i === hovered.i;
    if (hovered && !flight && !isSelected) {
      const d = hovered.S.data[hovered.i];
      hoverTag.textContent = d.code + (d.name ? " · " + d.name : "") + " · " + d.role;
      const at = onScreen(worldOf(hovered.S, hovered.i));
      hoverTag.style.transform = "translate(" + (at.x + 14).toFixed(1) + "px," + (at.y + 10).toFixed(1) + "px)";
      hoverTag.classList.add("is-on");
    } else hoverTag.classList.remove("is-on");
    if (overBridge >= 0 && !flight) {
      const to = leadsTo(overBridge);
      bridgeTag.textContent = "Travel to " + pad(to + 1).slice(1) + " · " + systems[to].name + " →";
      bridgeTag.style.transform = "translate(" + (handX + 16).toFixed(1) + "px," + (handY - 30).toFixed(1) + "px)";
      bridgeTag.classList.add("is-on");
    } else bridgeTag.classList.remove("is-on");
  }

  // ============================================================
  // TURNING, PRESSING, THE WHEEL
  // ============================================================
  let dragging = null, lastT = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = { x: e.clientX, y: e.clientY, yaw, pitch, id: e.pointerId, moved: false, t: performance.now() };
    canvas.setPointerCapture(e.pointerId);
    stage.classList.add("is-turned");
    wake();
  });
  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    if (dragging && e.pointerId === dragging.id) {
      if (Math.hypot(e.clientX - dragging.x, e.clientY - dragging.y) > 5) dragging.moved = true;
      if (dragging.moved) {
        yaw = dragging.yaw - (e.clientX - dragging.x) * DRAG;
        pitch = Math.max(PITCH[0], Math.min(PITCH[1], dragging.pitch + (e.clientY - dragging.y) * DRAG * 0.6));
        wake();
        return;
      }
    }
    point(e.clientX - r.left, e.clientY - r.top);
  });
  canvas.addEventListener("pointerleave", () => { if (!dragging) unpoint(); });
  const letGo = (e) => {
    const was = dragging;
    dragging = null;
    if (!was || was.moved || e.type === "pointercancel") return;
    // A PRESS, not a drag.
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (flight) return;
    const n = nodeAt(x, y);
    if (n) { select(n.S, n.i); return; }
    const k = bridgeAt(x, y);
    if (k >= 0) { travel(leadsTo(k)); return; }
    deselect();
  };
  canvas.addEventListener("pointerup", letGo);
  canvas.addEventListener("pointercancel", letGo);
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom = Math.max(0.4, Math.min(1.7, zoom * Math.exp(e.deltaY * 0.001)));
    stage.classList.add("is-turned");
    wake();
  }, { passive: false });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") deselect(); });

  // ============================================================
  // EVERY FRAME
  // ============================================================
  let spinTotal = 0;
  function frame(t) {
    const dt = Math.min(64, t - (lastT || t));
    lastT = t;
    const moving = !still;
    // THE JOURNEY.
    if (flight) {
      const e = ease(Math.min(1, (t - flight.t0) / FLY_MS));
      target.copy(flight.from).lerp(flight.to, e);
      yaw = flight.yaw0 + (flight.yaw1 - flight.yaw0) * e;
      pitch = flight.pitch0 + (flight.pitch1 - flight.pitch0) * e;
      // A little further out half way, as a camera pulls back to cross.
      zoomLift = Math.sin(e * Math.PI) * 0.35;
      if (e >= 1) { zoomLift = 0; arrive(); }
    }
    const zoomWas = zoom;
    zoom = zoomWas * (1 + zoomLift);
    aim();
    zoom = zoomWas;
    // THE SPIN: every system about its own upright, slower while a node is
    // selected or pointed at.
    const slow = selected ? 0.3 : hovered ? 0.35 : 1;
    if (moving && !(dragging && dragging.moved)) {
      systems.forEach((S) => { S.spin += dt * S.rate * slow; });
      spinTotal += dt * SPIN * slow;
    }
    systems.forEach((S) => {
      S.group.rotation.y = S.spin;
      S.frame.rotation.y = -S.spin * 1.6;
      S.cages.forEach((c) => {
        c.userData.edge.rotation.y = t * c.userData.rate;
        c.userData.edge.rotation.x = t * c.userData.rate * 0.6;
        c.userData.ring.rotation.z = t * c.userData.rate * 0.8;
      });
      // THE PULSES.
      const pos = S.pulses.geometry.attributes.position;
      S.pulse.forEach((p, n) => {
        if (moving) p.t += dt * p.rate;
        if (p.t > 1) { p.t = 0; p.link = Math.floor(rnd() * S.links.length); p.back = rnd() < 0.5; }
        const [a, b] = S.links[p.link];
        const u = p.back ? 1 - p.t : p.t;
        pos.setXYZ(n, S.P[a][0] + (S.P[b][0] - S.P[a][0]) * u, S.P[a][1] + (S.P[b][1] - S.P[a][1]) * u, S.P[a][2] + (S.P[b][2] - S.P[a][2]) * u);
      });
      pos.needsUpdate = true;
      // THE PING, from the system you are at.
      if (moving && S.index === focus && !flight && t - S.pingAt > PING_EVERY) S.pingAt = t;
      const age = (t - S.pingAt) / 2200;
      if (age >= 0 && age < 1) {
        S.ping.scale.setScalar(0.4 + age * RADIUS * 1.2);
        S.ping.material.opacity = (1 - age) * 0.7;
      } else S.ping.material.opacity = 0;
    });
    scene.updateMatrixWorld();
    // THE BRIDGES: their pulses, and the one under the hand lit.
    bridges.forEach((B, k) => {
      B.glow += ((k === overBridge ? 1 : 0) - B.glow) * 0.18;
      B.rails.material.opacity = 0.28 + B.glow * 0.5;
      B.markers.forEach((m, n) => {
        m.rotation.y = t * 0.0012 + n;
        m.material.opacity = 0.7 + B.glow * 0.3;
        m.scale.setScalar(1 + B.glow * 0.4);
      });
      const pos = B.pulses.geometry.attributes.position;
      for (let n = 0; n < 8; n++) {
        const u = (((moving ? t : 0) * 0.00018 * (1 + B.glow * 2) + n / 8) % 1);
        const w = n % 2 ? 1 - u : u;
        pos.setXYZ(n, B.a.x + (B.b.x - B.a.x) * w, B.a.y + (B.b.y - B.a.y) * w, B.a.z + (B.b.z - B.a.z) * w);
      }
      pos.needsUpdate = true;
    });
    const fading = settleFade(t);
    renderer.render(scene, camera);
    tag(t);
    cardTo();
    labels();
    stage.dataset.yaw = (yaw + spinTotal).toFixed(3);
    return fading;
  }
  let zoomLift = 0;
  let raf = 0;
  function loop(t) {
    raf = 0;
    const busy = frame(t);
    // Always on while things move on their own; otherwise only while
    // something is still settling.
    if (!still || busy || flight || (dragging && dragging.moved) || t - born < TAG_IN + tags.length * TAG_STEP + 400) raf = requestAnimationFrame(loop);
  }
  function wake() {
    if (!raf) raf = requestAnimationFrame(loop);
  }

  // FOR THE TESTS: where things are on the window, and what state it is in.
  window.NetScene = {
    state: () => ({ focus, flying: !!flight, selected: selected && fade.to === 1 ? selected.S.data[selected.i].code : null,
      ghost: +stage.dataset.ghost, systems: systems.map((S) => ({ name: S.name, nodes: S.P.length, links: S.links.length })) }),
    node: (s, i) => { const S = systems[s]; scene.updateMatrixWorld(); const p = onScreen(worldOf(S, i)); return { x: p.x, y: p.y, code: S.data[i].code, near: S.near[i].length }; },
    busiest: (s) => { const S = systems[s]; return [...S.P.keys()].sort((a, b) => S.degree[b] - S.degree[a]); },
    bridge: (k) => { const B = bridges[k]; const a = onScreen(B.a), b = onScreen(B.b); return { a, b, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, to: leadsTo(k) }; },
    gap: (s) => { const P = systems[s].P; let m = Infinity; for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) m = Math.min(m, Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1], P[i][2] - P[j][2])); return m; },
  };

  if ("ResizeObserver" in window) new ResizeObserver(size).observe(stage);
  else window.addEventListener("resize", size);
  say();
  paintGlow();
  size();
  stage.classList.add("is-drawn");
  wake();
})();

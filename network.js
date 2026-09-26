// ============================================================
// THE NETWORK — works/test-page.html (the test page)
//
// The owner, 2026-09-26, sending a picture of a dense red network on a
// dark ground — solid red spheres of every size, a few white and amber
// among them, thousands of hair-thin lines between them, long ones
// running out to outlying nodes, and small black tags here and there, two
// of them yellow:
//
//   "remove that tree entirely, and i want to try soemthing else. I want
//   you to make a dense map of red nodes that are interconnected. these
//   nodes should be solid and resemble a network. do this on the test
//   page. Addiyionally, let it resemble the attached picture"
//
// — the nodes standing for nothing, "abstract, like the picture". So:
//
//   - THE NODES (`COUNT`): solid, lit spheres, most of them red, some pale,
//     a few amber, and specks of grey — gathered into a dense CORE, a
//     looser BODY round it, and OUTLIERS far out. The more links a node
//     has, the bigger it is.
//   - THE LINKS: each node joined to its nearest few, so the core is a
//     dense mesh; a few dozen HUBS each sending lines out to nodes all
//     over, near and far; and every outlier tied back in by long ones.
//     Hair-thin, in the colours of what they join, a few of them teal.
//   - THE TAGS: small black labels beside some of the nodes — what they
//     say is in the page (`.net-label`) — and two marked yellow, joined to
//     their neighbours by yellow lines, as the picture's are.
//
// It stands in three dimensions and turns slowly on its own; a drag turns
// it, the wheel brings it closer, and a node under the pointer lights up
// its own links. The dark page, and a soft shadow under the network, are
// the picture's.
//
// Three.js r128, from the same address as the home page's map, with the
// library's own lit spheres, lines and points. Without it the page says
// so. With reduced motion it never turns on its own.
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

  // THE COLOURS, off the picture.
  const GROUND = 0x1f1f20;              // the page's own (--bg)
  const RED = [0xf0545c, 0xe9464f, 0xf46a72, 0xdb3d47, 0xfa7a80];
  const PALE = [0xece6de, 0xdcd6cf, 0xcfc9c2];
  const AMBER = [0xe0a126, 0xc9822c, 0xa9642f];
  const GREY = [0x8e8984, 0x6f6b68, 0xb3aea8];
  const TEAL = 0x6f9b9a;
  const MARK = 0xf2b418;                // the two yellow tags, and their lines

  const COUNT = 540;                    // nodes
  const NEAREST = [2, 5];               // each joined to between this many of its nearest
  const HUBS = 26;                      // nodes that send lines out all over
  const HUB_LINKS = [10, 34];           // and how many each
  const OUTLIER_LINKS = [2, 5];         // long lines tying each outlier back in
  const TURN_RATE = 0.00007;            // radians a millisecond it turns on its own
  const TURN_AFTER = 2600;              // ms after a drag before it turns on its own again
  const DRAG = 0.0058;                  // radians a pixel of drag
  const PITCH = [-0.7, 0.9];            // how far it can be tipped
  const TAG_IN = 700;                   // ms before the first tag comes up
  const TAG_STEP = 90;                  // ms between one tag and the next

  // Seeded, so it is the same network every time.
  let seed = 7240926;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  const between = ([a, b]) => a + Math.floor(rnd() * (b - a + 1));

  // ============================================================
  // THE NODES: where each stands, and what it is.
  // ============================================================
  const P = [];                         // [x, y, z]
  const KIND = [];                      // "red" | "pale" | "amber" | "grey"
  const WHERE = [];                     // "core" | "body" | "out"
  for (let i = 0; i < COUNT; i++) {
    const r = rnd();
    let p, where;
    if (r < 0.5) {
      // THE CORE: dense, a little above the middle, as the picture's is.
      p = [gauss() * 0.62 + 0.1, gauss() * 0.46 + 0.28, gauss() * 0.5];
      where = "core";
    } else if (r < 0.86) {
      p = [gauss() * 1.25, gauss() * 0.82 - 0.05, gauss() * 0.85];
      where = "body";
    } else {
      // OUTLIERS, far out, more of them below and to the sides.
      const a = rnd() * Math.PI * 2, e = (rnd() - 0.62) * 1.9, d = 1.8 + rnd() * 1.1;
      p = [Math.cos(a) * Math.cos(e) * d * 1.25, Math.sin(e) * d * 0.9, Math.sin(a) * Math.cos(e) * d * 0.7];
      where = "out";
    }
    P.push(p);
    WHERE.push(where);
    const k = rnd();
    KIND.push(k < 0.66 ? "red" : k < 0.83 ? "pale" : k < 0.89 ? "amber" : "grey");
  }
  const dist = (a, b) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1], P[a][2] - P[b][2]);

  // ============================================================
  // THE LINKS.
  // ============================================================
  const links = new Map();              // "a:b" -> [a, b, kind]
  const join = (a, b, kind) => {
    if (a === b) return;
    const key = a < b ? a + ":" + b : b + ":" + a;
    if (!links.has(key)) links.set(key, [a, b, kind || ""]);
  };
  // Each to its nearest few: the mesh.
  for (let i = 0; i < COUNT; i++) {
    const near = [];
    for (let j = 0; j < COUNT; j++) if (j !== i) near.push([dist(i, j), j]);
    near.sort((x, y) => x[0] - y[0]);
    const n = between(NEAREST);
    for (let k = 0; k < n; k++) join(i, near[k][1]);
  }
  // The hubs: lines out all over, the further the likelier.
  const hubs = [];
  while (hubs.length < HUBS) {
    const h = Math.floor(rnd() * COUNT);
    if (WHERE[h] !== "out" && KIND[h] !== "grey" && !hubs.includes(h)) hubs.push(h);
  }
  hubs.forEach((h) => {
    const n = between(HUB_LINKS);
    for (let k = 0, tries = 0; k < n && tries < n * 20; tries++) {
      const j = Math.floor(rnd() * COUNT);
      if (rnd() < Math.min(1, 0.35 + dist(h, j) * 0.3)) { join(h, j); k++; }
    }
  });
  // The outliers, tied back in by long lines.
  for (let i = 0; i < COUNT; i++) {
    if (WHERE[i] !== "out") continue;
    const n = between(OUTLIER_LINKS);
    for (let k = 0; k < n; k++) join(i, rnd() < 0.5 ? pick(hubs) : Math.floor(rnd() * COUNT));
  }
  const degree = new Array(COUNT).fill(0);
  links.forEach(([a, b]) => { degree[a]++; degree[b]++; });

  // THE TWO MARKED NODES, low in the network, each joined to a few of its
  // neighbours by yellow lines.
  const low = [...P.keys()].filter((i) => P[i][1] < -0.45 && WHERE[i] !== "out" && KIND[i] !== "grey").sort((a, b) => P[a][1] - P[b][1]);
  const marked = [low[Math.floor(low.length * 0.35)], low[Math.floor(low.length * 0.8)]].filter((i) => i != null);
  marked.forEach((m) => {
    const near = [...P.keys()].filter((j) => j !== m).sort((a, b) => dist(m, a) - dist(m, b)).slice(0, 4);
    near.forEach((j) => links.set(m < j ? m + ":" + j : j + ":" + m, [m, j, "mark"]));
  });

  // SIZES: the more links, the bigger — and a few large ones anyway.
  const SIZE = P.map((_, i) => {
    if (KIND[i] === "grey") return 0.011 + rnd() * 0.01;
    const s = 0.018 + 0.0065 * Math.sqrt(degree[i]) + (rnd() < 0.05 ? 0.03 : 0) + rnd() * 0.01;
    return Math.min(0.088, s * (WHERE[i] === "out" ? 0.8 : 1));
  });
  const COLOUR = P.map((_, i) => new THREE.Color(pick({ red: RED, pale: PALE, amber: AMBER, grey: GREY }[KIND[i]])));

  // ============================================================
  // THE SCENE
  // ============================================================
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 100);
  scene.fog = new THREE.Fog(GROUND, 5, 11);

  // The spheres: one mesh, a sphere for every node.
  const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 18, 12), new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.04 }), COUNT);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
  const place = (i, grow) => {
    m4.compose(new THREE.Vector3(...P[i]), q, new THREE.Vector3(1, 1, 1).multiplyScalar(SIZE[i] * (grow || 1)));
    balls.setMatrixAt(i, m4);
  };
  for (let i = 0; i < COUNT; i++) { place(i); balls.setColorAt(i, COLOUR[i]); }
  scene.add(balls);

  // The links: hair-thin, in the colours of what they join.
  const all = [...links.values()];
  const linePos = new Float32Array(all.length * 6), lineCol = new Float32Array(all.length * 6);
  const tint = new THREE.Color(), bg = new THREE.Color(GROUND);
  all.forEach(([a, b, kind], n) => {
    linePos.set(P[a], n * 6); linePos.set(P[b], n * 6 + 3);
    if (kind === "mark") tint.set(MARK);
    else if (rnd() < 0.06) tint.set(TEAL);
    else if (KIND[a] === "pale" && KIND[b] === "pale") tint.set(0xd8d2cb);
    else tint.copy(COLOUR[KIND[a] === "red" ? a : b]).lerp(new THREE.Color(0xf2b3b6), 0.25);
    // Faded towards the ground by how long it is, as thin lines at a distance are.
    const fade = kind === "mark" ? 0.95 : Math.max(0.28, 0.72 - dist(a, b) * 0.12);
    const c = tint.clone().lerp(bg, 1 - fade);
    lineCol.set([c.r, c.g, c.b, c.r, c.g, c.b], n * 6);
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
  lineGeo.setAttribute("color", new THREE.BufferAttribute(lineCol, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false }));
  scene.add(lines);
  // A node's own links, lit, while it is under the pointer.
  const litGeo = new THREE.BufferGeometry();
  litGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3));
  const lit = new THREE.LineSegments(litGeo, new THREE.LineBasicMaterial({ color: 0xffe1e3, transparent: true, opacity: 0.95, depthWrite: false }));
  scene.add(lit);

  // Specks in the air round it, as the picture has.
  const dust = [];
  for (let i = 0; i < 90; i++) {
    const a = rnd() * Math.PI * 2, d = 2 + rnd() * 2.8;
    dust.push(Math.cos(a) * d * 1.2, (rnd() - 0.5) * 4.2, Math.sin(a) * d * 0.8);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x9d9893, size: 2.2, sizeAttenuation: false })));

  // Light: a key from above and to the left, as the picture's, a cool
  // fill, and enough all round that no sphere goes black.
  scene.add(new THREE.AmbientLight(0xffffff, 0.34));
  scene.add(new THREE.HemisphereLight(0xfff4f0, 0x2a2a2c, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 0.95);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd6d0, 0.3);
  rim.position.set(4, -2, -3);
  scene.add(rim);

  stage.dataset.nodes = String(COUNT);
  stage.dataset.links = String(all.length);

  // ============================================================
  // SEEING IT
  // ============================================================
  const TARGET = new THREE.Vector3(0, 0.1, 0);
  let yaw = 0.35, pitch = 0.12, zoom = 1, W = 0, H = 0, far = 8;
  function size() {
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    tags.forEach((g) => { g.w = 0; });
    camera.aspect = W / Math.max(1, H);
    camera.updateProjectionMatrix();
    // Far enough that the whole network fits, height and width.
    const half = Math.tan((camera.fov * Math.PI) / 360);
    far = Math.max(5.4 / (2 * half), 8.6 / (2 * half * camera.aspect));
    frame();
  }
  function aim() {
    const d = far * zoom;
    camera.position.set(TARGET.x + Math.sin(yaw) * Math.cos(pitch) * d, TARGET.y + Math.sin(pitch) * d, TARGET.z + Math.cos(yaw) * Math.cos(pitch) * d);
    camera.lookAt(TARGET);
    scene.fog.near = far * zoom - 2.4;
    scene.fog.far = far * zoom + 4.2;
    stage.dataset.yaw = yaw.toFixed(3);
  }

  // ============================================================
  // THE TAGS: small black labels beside nodes — the outlying ones and the
  // hubs, as the picture's stand at the ends of its lines — and the two
  // yellow ones beside the marked nodes.
  // ============================================================
  const tagEls = [...stage.querySelectorAll(".net-label")];
  const plain = tagEls.filter((el) => !el.classList.contains("is-marked"));
  const yellow = tagEls.filter((el) => el.classList.contains("is-marked"));
  const outlying = [...P.keys()].filter((i) => WHERE[i] === "out").sort((a, b) => degree[b] - degree[a]);
  const bearers = [...hubs.slice(0, 6), ...outlying].filter((v, n, all2) => all2.indexOf(v) === n);
  const tags = [
    ...plain.map((el, n) => ({ el, node: bearers[(n * 7) % bearers.length] })),
    ...yellow.map((el, n) => ({ el, node: marked[n] })),
  ].filter((t) => t.node != null).map((t, n) => ({ ...t, n }));
  // Two tags never on one node.
  const taken = new Set();
  tags.forEach((t) => {
    while (taken.has(t.node)) t.node = bearers[(bearers.indexOf(t.node) + 1) % bearers.length];
    taken.add(t.node);
  });
  const seen = new THREE.Vector3(), toEye = new THREE.Vector3();
  let born = -1;
  function tag(t) {
    if (born < 0) born = t;
    const cx = W / 2;
    tags.forEach((g) => {
      seen.set(...P[g.node]).project(camera);
      const sx = (seen.x * 0.5 + 0.5) * W, sy = (-seen.y * 0.5 + 0.5) * H;
      // Beside its node, on the side away from the middle.
      const right = sx >= cx, gap = 8 + SIZE[g.node] * 60;
      const age = still ? 1e9 : t - born - TAG_IN - g.n * TAG_STEP;
      const e = Math.max(0, Math.min(1, age / 400));
      // Fainter the further back its node stands.
      toEye.set(...P[g.node]).sub(camera.position);
      const depth = toEye.length() - far * zoom;
      const face = g.el.classList.contains("is-marked") ? 1 : Math.max(0.35, Math.min(1, 0.85 - depth * 0.35));
      if (!g.w) { g.w = g.el.offsetWidth; g.h = g.el.offsetHeight; }
      g.box = [right ? sx + gap : sx - gap - g.w, sy - 9, g.w, g.h];
      g.el.style.transform = "translate(" + (right ? (sx + gap).toFixed(1) + "px" : "calc(" + (sx - gap).toFixed(1) + "px - 100%)") + ", " + (sy - 9).toFixed(1) + "px)";
      g.show = e * face;
    });
    // Never one over another: of two that would touch, the fainter steps
    // aside (the yellow ones never do).
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
    tags.forEach((g) => { g.el.style.opacity = g.show.toFixed(3); });
  }

  // ============================================================
  // THE POINTER: a node under it lights its own links.
  // ============================================================
  const ray = new THREE.Raycaster(), hand = new THREE.Vector2(), at = new THREE.Vector3();
  let hovered = -1;
  function light(i) {
    if (i === hovered) return;
    if (hovered >= 0) place(hovered);
    hovered = i;
    const pos = [];
    if (i >= 0) {
      all.forEach(([a, b]) => { if (a === i || b === i) pos.push(...P[a], ...P[b]); });
      place(i, 1.35);
    }
    litGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    balls.instanceMatrix.needsUpdate = true;
    lines.material.opacity = i >= 0 ? 0.45 : 0.85;
    stage.dataset.hover = i >= 0 ? String(i) : "";
    stage.dataset.lit = String(pos.length / 6);
    wake();
  }

  // ============================================================
  // TURNING IT
  // ============================================================
  let dragging = null, lastDrag = -1e9, lastT = 0;
  canvas.addEventListener("pointerdown", (e) => {
    dragging = { x: e.clientX, y: e.clientY, yaw, pitch, id: e.pointerId };
    canvas.setPointerCapture(e.pointerId);
    stage.classList.add("is-turned");
    light(-1);
    wake();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging && e.pointerId === dragging.id) {
      yaw = dragging.yaw - (e.clientX - dragging.x) * DRAG;
      pitch = Math.max(PITCH[0], Math.min(PITCH[1], dragging.pitch + (e.clientY - dragging.y) * DRAG * 0.6));
      lastDrag = performance.now();
      wake();
      return;
    }
    const r = canvas.getBoundingClientRect();
    hand.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(hand, camera);
    // The nearest node the pointer's ray passes through — worked out from
    // each sphere's middle and size, not triangle by triangle.
    let best = -1, bestAt = Infinity;
    for (let i = 0; i < COUNT; i++) {
      at.set(...P[i]);
      const r = SIZE[i] * 1.15;
      if (ray.ray.distanceSqToPoint(at) > r * r) continue;
      const d = at.distanceTo(ray.ray.origin);
      if (d < bestAt) { bestAt = d; best = i; }
    }
    light(best);
  });
  canvas.addEventListener("pointerleave", () => { if (!dragging) light(-1); });
  const letGo = () => { dragging = null; lastDrag = performance.now(); };
  canvas.addEventListener("pointerup", letGo);
  canvas.addEventListener("pointercancel", letGo);
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoom = Math.max(0.45, Math.min(1.6, zoom * Math.exp(e.deltaY * 0.001)));
    stage.classList.add("is-turned");
    wake();
  }, { passive: false });

  function frame(t) {
    t = t || performance.now();
    aim();
    renderer.render(scene, camera);
    tag(t);
  }
  let raf = 0;
  function loop(t) {
    raf = 0;
    const dt = Math.min(64, t - (lastT || t));
    lastT = t;
    if (!still && !dragging && hovered < 0 && t - lastDrag > TURN_AFTER) yaw += dt * TURN_RATE;
    frame(t);
    // It goes on while it is turning on its own, or the tags are coming up.
    if (!still || dragging || t - born < TAG_IN + tags.length * TAG_STEP + 400) raf = requestAnimationFrame(loop);
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

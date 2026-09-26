// ============================================================
// THE TREE — works/test-page.html (the test page)
//
// The owner, 2026-09-26, sending a photograph of a conifer standing on
// its own great roots over a forest floor: "add a new page to the whole
// site, and make it completly blank. this will be a test page ... take
// this tree ... and make it into a 3D render ... fully made 3d so you can
// rotate it. From this tree in different areas, i want there to be labels
// that come out of it", and "render the ground with it, but not all of
// the background". And then, of a first version built as a machine:
//
//   "The tree, i want you to take the image as is and make it into a 3d
//   one, not recreate it. i want the tree as is to be made into a 3d
//   tree."
//
// — as a cloud of coloured specks, turning all the way round, keeping the
// labels. So THE TREE IS THE PHOTOGRAPH: every speck is one of its pixels,
// in its own colour, stood at the depth it has in the scene. Where each
// stands was worked out once, from the picture, by tools/tree-cloud.mjs,
// and is read here from images/Test-Page/tree-cloud.bin: the ground as a
// floor, the trunk as a column (its far side given the same pixels, a
// little darker), the roots as tubes — the great one arching over its
// hollow — the stones as low domes, the ferns standing off the ground;
// and the background, and all the ground further from the trunk than a
// patch round it, left out.
//
// IT OPENS WHERE THE PICTURE WAS TAKEN FROM — the same place, the same way
// of looking, drawn back a little to leave room for the labels — so at
// first it is the photograph; then it turns, slowly, all the way round,
// and a drag turns it by hand.
//
// THE LABELS come out of it: each a leader line from a point on the tree
// out to a name standing either side of it, drawn out one after another,
// going faint when its point turns away. What they say is in the page
// (`.tree-label`); where they come out of is in tree-cloud.json, by each
// label's `data-part`.
//
// Three.js r128, from the same address as the home page's map. Without it,
// or without the cloud, the page says so and stays blank. With reduced
// motion it never turns on its own and the labels are simply there.
// ============================================================
(function () {
  const stage = document.querySelector(".tree-stage");
  const canvas = stage && stage.querySelector(".tree-canvas");
  if (!canvas) return;
  const bare = () => {
    const say = stage.querySelector(".tree-fallback");
    if (say) say.hidden = false;
    stage.classList.add("is-bare");
  };
  if (typeof THREE === "undefined") { bare(); return; }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const CLOUD = "../images/Test-Page/tree-cloud";
  const SPECK = 0.0125;                 // m, how big a speck is drawn
  const BACK = 1.6;                     // how far behind the photographer the page stands, once it has drawn back
  const DRAW_BACK = [700, 2100];        // ms: it opens as the photograph itself, then draws back between these
  const REVEAL = 2600;                  // ms it stays the photograph before it starts to turn
  const TURN_RATE = 0.00011;            // radians a millisecond it turns on its own
  const TURN_AFTER = 2600;              // ms after a drag before it turns on its own again
  const DRAG = 0.0065;                  // radians a pixel of drag
  const PITCH = [0.04, 1.2];            // how far it can be tipped, radians
  const LABEL_IN = 900;                 // ms before the first label comes out
  const LABEL_STEP = 130;               // ms between one label and the next
  const LABEL_DRAW = 520;               // ms a label's line takes to draw out
  const LABEL_GAP = 38;                 // px, the least between two labels on one side

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(41, 1, 0.05, 100);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  Promise.all([
    fetch(CLOUD + ".json").then((r) => { if (!r.ok) throw new Error("no cloud"); return r.json(); }),
    fetch(CLOUD + ".bin").then((r) => { if (!r.ok) throw new Error("no cloud"); return r.arrayBuffer(); }),
  ]).then(([meta, bin]) => begin(meta, bin), bare);

  function begin(meta, bin) {
    // ---------- THE CLOUD ----------
    const n = meta.count, view = new DataView(bin), k = 1 / meta.unit;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const o = i * 9;
      pos[i * 3] = view.getInt16(o, true) * k;
      pos[i * 3 + 1] = view.getInt16(o + 2, true) * k;
      pos[i * 3 + 2] = view.getInt16(o + 4, true) * k;
      col[i * 3] = view.getUint8(o + 6) / 255;
      col[i * 3 + 1] = view.getUint8(o + 7) / 255;
      col[i * 3 + 2] = view.getUint8(o + 8) / 255;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: SPECK, vertexColors: true, sizeAttenuation: true })));

    // ---------- SEEING IT ----------
    // Round the trunk, starting from exactly where the photograph was taken:
    // its camera, looking at the trunk's foot, the same way down.
    const eye = V(...meta.camera.at), pitch0 = meta.camera.pitch;
    const flat = Math.hypot(eye.x, eye.z);
    const TARGET = V(0, eye.y - flat * Math.tan(pitch0), 0);
    const reach = eye.distanceTo(TARGET);
    let yaw = Math.atan2(eye.x, eye.z), pitch = pitch0, zoom = 1, W = 0, H = 0;
    camera.fov = meta.camera.fov;
    function size() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / Math.max(1, H);
      camera.updateProjectionMatrix();
      labels.forEach((l) => { l.w = 0; });
      frame();
    }
    let back = still ? BACK : 1;
    function place() {
      const d = reach * back * zoom;
      camera.position.set(TARGET.x + Math.sin(yaw) * Math.cos(pitch) * d, TARGET.y + Math.sin(pitch) * d, TARGET.z + Math.cos(yaw) * Math.cos(pitch) * d);
      camera.lookAt(TARGET);
      stage.dataset.yaw = yaw.toFixed(3);
    }

    // ---------- THE LABELS ----------
    const NS = "http://www.w3.org/2000/svg";
    const svg = stage.querySelector(".tree-leaders");
    const labels = [...stage.querySelectorAll(".tree-label")].map((el, i) => {
      const part = meta.anchors[el.dataset.part];
      if (!part || !svg) { el.hidden = true; return null; }
      const line = document.createElementNS(NS, "polyline");
      const mark = document.createElementNS(NS, "rect");
      mark.setAttribute("width", "5"); mark.setAttribute("height", "5");
      svg.appendChild(line); svg.appendChild(mark);
      return { el, at: V(...part.at), out: V(...part.out).normalize(), line, mark, n: i, y: 0, side: 1, w: 0 };
    }).filter(Boolean);
    const seen = V(0, 0, 0), toEye = V(0, 0, 0);
    let born = -1;
    function lay(t) {
      if (born < 0) born = t;
      const cx = W / 2, column = Math.min(W * 0.34, 470);
      // Where each comes out of, on the window, and whether it faces you.
      labels.forEach((l) => {
        seen.copy(l.at).project(camera);
        l.sx = (seen.x * 0.5 + 0.5) * W;
        l.sy = (-seen.y * 0.5 + 0.5) * H;
        toEye.subVectors(camera.position, l.at).normalize();
        l.face = Math.max(0.28, Math.min(1, 0.6 + l.out.dot(toEye)));
        l.side = l.sx < cx ? -1 : 1;
        l.x = l.side < 0 ? Math.min(l.sx - 44, cx - column) : Math.max(l.sx + 44, cx + column);
        if (!l.w) l.w = l.el.offsetWidth + 6;
        l.x = l.side < 0 ? Math.max(l.x, 8 + l.w) : Math.min(l.x, W - 8 - l.w);
        l.y = l.sy;
      });
      // One side at a time: kept apart, top to bottom, and on the window.
      [-1, 1].forEach((side) => {
        const on = labels.filter((l) => l.side === side).sort((a, b) => a.sy - b.sy);
        for (let i = 1; i < on.length; i++) on[i].y = Math.max(on[i].y, on[i - 1].y + LABEL_GAP);
        const over = on.length ? on[on.length - 1].y - (H - 60) : 0;
        if (over > 0) on.forEach((l) => { l.y -= over; });
        for (let i = on.length - 2; i >= 0; i--) on[i].y = Math.min(on[i].y, on[i + 1].y - LABEL_GAP);
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
        for (let i = 0; i < 2 && left > 0; i++) {
          const f = Math.min(1, left / (lens[i] || 1));
          shown.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]);
          left -= lens[i];
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
    let dragging = null, lastDrag = -1e9, lastT = 0, opened = -1;
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
      zoom = Math.max(0.5, Math.min(1.6, zoom * Math.exp(e.deltaY * 0.001)));
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
      if (opened < 0) opened = t;
      const dt = Math.min(64, t - (lastT || t));
      lastT = t;
      // Opened exactly where the photograph was taken from, it is the
      // photograph; then it draws back, to leave the labels room.
      if (!still) {
        const q = Math.max(0, Math.min(1, (t - opened - DRAW_BACK[0]) / (DRAW_BACK[1] - DRAW_BACK[0])));
        back = 1 + (BACK - 1) * q * q * (3 - 2 * q);
      }
      // The photograph first; then turning, slowly, on its own.
      if (!still && !dragging && t - opened > REVEAL && t - lastDrag > TURN_AFTER) yaw += dt * TURN_RATE;
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
  }
})();

// ============================================================
// THE ALDEHYDE (index.html only, the first slide)
//
// The owner, 2026-09-30: "redesign the front page of home. I want a big
// aldehyde molecule in the very middle of it, with the electron cloud
// being done as colour coded exactly as described in my previous message,
// and have the electron cloud made with the curl noise page elements."
//
// The molecule is formaldehyde, H2C=O, the smallest aldehyde there is, as
// Schrodinger's equation has it (solved once, by tools/aldehyde/cloud.py,
// into aldehyde-data.js): a cloud of specks, each one a place an electron
// may be found, in three parts that add up to the whole —
//
//   the double bond   its second pair, in GOLD, brought forward
//   the lone pair     oxygen's loosest pair, in VIOLET, brought forward
//   the rest          every other electron, in faint ink
//
// "The colour coding exactly as described" is the owner's note before:
// "the normal electrons are insignificant, but the lone pair and the double
// bond each have an assigned emphasized parameter to them, which makes
// them stand out". Those parameters are EMPHASIS below: x1 is a part's
// true share of the specks; x3 draws it as if it held three times its
// electrons.
//
// "The curl noise page elements" are pmndrs' GPGPU Curl Noise DOF: specks
// carried by CURL NOISE (a smooth, swirling flow that neither bunches nor
// thins them, like smoke in a slow current) and drawn through a LENS
// (sharp where the focus is, soft wide discs in front of it and behind),
// under a camera that moves a little as if held. There, the flow is worked
// out in one pass into a picture and read back by the next; each speck's
// place is a function of where it started and the time, so here it is
// worked out in the same pass that draws it, which is the same arithmetic
// with one step fewer. Every speck swirls about its own place in the cloud,
// so the orbitals keep their shape while the whole of it moves.
//
// It gathers as the title does, from a wide shell round the slide in to
// its places; it sways (never turning end on, where the two parts would
// stand on each other), and it leans a little to the pointer. It draws
// only while the first slide is on the screen. With reduced motion it is
// simply there, still, focus and all. If the drawing cannot be made, it
// is not there, and the slide is the title alone.
//
// This is one of two files here that write a shader of their own (the
// other is node-scene.js): a shader that fails to compile takes the whole
// drawing with it, so after compiling it checks, and quietly steps aside.
// It talks to no other script and sets no global.
// ============================================================
(function () {
  const D = window.ALDEHYDE;
  const slide = document.getElementById("slide-1");
  const wrap = document.getElementById("molecule");
  const titleEl = document.querySelector(".title-content");
  if (!D || !slide || !wrap || !titleEl || !window.THREE) return;

  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // HOW STRONGLY EACH PART IS DRAWN. x1 is its true share of the specks
  // (two electrons of sixteen for the double bond and for the lone pair,
  // twelve for the rest); the data holds enough for up to x4 of the two
  // and x0.4 of the rest.
  const EMPHASIS = { pi: 3, lone: 3, rest: 0.3 };
  const SHARE = { pi: 5000, lone: 5000, rest: 30000 };   // sixteen electrons as 40,000 specks
  // Their colours, on the white page: gold, violet, and the page's own ink.
  const COLOUR = { pi: [0.69, 0.49, 0.1], lone: [0.4, 0.28, 0.74], rest: [0.09, 0.09, 0.06] };
  const ALPHA = { pi: 0.92, lone: 0.92, rest: 0.4 };

  const GATHER_MS = 2600;   // the specks coming in to their places, as the title gathers
  const SWAY = 0.26;        // how far it sways either side of its side, radians
  const SWAY_S = 34;        // and how slowly: one sway in 34 seconds
  // The side it is seen from: three-quarters on, as a textbook draws a solid, so the C=O, the
  // double bond's lobes and the lone pair's point three different ways, a third of a turn apart.
  const SIDE = { yaw: 0.785, pitch: 0.615 };
  const LEAN = 0.1;         // how far it leans to the pointer
  const FLOW = 0.3;         // how far a speck is carried off its place by the flow, angstrom
  const FREQ = 0.55;        // how fine the flow's swirls are
  const FOCUS_SWING = 0.9;  // the focus drifting through the molecule, angstrom either side
  const BLUR = 0.11;        // how wide a speck grows out of focus: of an angstrom's width, per angstrom
  const FIT = 1.8;          // the cloud's reach from its middle, angstrom (what is framed)

  const phone = () => window.innerWidth < 700;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: wrap.querySelector("canvas"), antialias: true, alpha: true, premultipliedAlpha: false });
  } catch (e) {
    wrap.remove();
    return;
  }
  renderer.setClearColor(0xffffff, 0);
  // A machine drawing without a graphics card (a test's browser, an old
  // laptop) works the flow out on its processor, which everything else on
  // the page shares: it gets a fifth of the specks, one swirl rather than
  // two, and a new frame a twelfth of a second at most.
  let soft = false;
  try {
    const gl = renderer.getContext();
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    soft = /swiftshader|llvmpipe|software/i.test(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "");
  } catch (e) { /* not knowing is fine */ }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const turn = new THREE.Group();   // the sway, the lean
  const body = new THREE.Group();   // the molecule: C=O across, the double bond's lobes up, the H towards you
  body.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0)));
  turn.add(body);
  scene.add(turn);

  // ---- the shader: curl noise, and the lens --------------------------------
  // Simplex noise in three dimensions: Ashima Arts and Stefan Gustavson
  // (MIT), as the pmndrs example uses it; the curl of three of them.
  const NOISE = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    vec3 snoiseVec3(vec3 x) {
      return vec3(snoise(x),
                  snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
                  snoise(vec3(x.z + 74.2, x.x - 124.4, x.y + 99.4)));
    }
    vec3 curlNoise(vec3 p) {
      const float e = 0.1;
      vec3 dx = vec3(e, 0.0, 0.0), dy = vec3(0.0, e, 0.0), dz = vec3(0.0, 0.0, e);
      vec3 px0 = snoiseVec3(p - dx), px1 = snoiseVec3(p + dx);
      vec3 py0 = snoiseVec3(p - dy), py1 = snoiseVec3(p + dy);
      vec3 pz0 = snoiseVec3(p - dz), pz1 = snoiseVec3(p + dz);
      float x = py1.z - py0.z - pz1.y + pz0.y;
      float y = pz1.x - pz0.x - px1.z + px0.z;
      float z = px1.y - px0.y - py1.x + py0.x;
      return normalize(vec3(x, y, z) / (2.0 * e));
    }`;

  const VERTEX = `
    uniform float uTime, uFlow, uFreq, uGather, uFocus, uBlur, uSize, uAlpha, uTwo;
    attribute float aShade, aSeed;
    attribute vec3 aStart;
    varying float vAlpha, vSoft;
    ${NOISE}
    void main() {
      vec3 home = position;
      float t = uTime;
      // the flow: each speck swirls about its own place, as smoke in a slow current
      vec3 drift = curlNoise(home * uFreq + vec3(0.13, 0.09, -0.11) * t);
      if (uTwo > 0.5) drift += 0.5 * curlNoise(home * uFreq * 2.3 - vec3(0.17, -0.05, 0.12) * t);
      vec3 p = home + uFlow * drift;
      // the gathering: in from a shell round the slide, each on its own delay
      float g = clamp((uGather - aSeed * 0.42) / 0.58, 0.0, 1.0);
      g = g * g * (3.0 - 2.0 * g);
      p = mix(aStart, p, g);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      // the lens: how far out of focus, in angstrom; a speck grows into a soft disc
      float off = abs(-mv.z - uFocus);
      float size = uSize + off * uBlur;
      gl_PointSize = size;
      vSoft = clamp(off / 1.6, 0.0, 1.0);
      // a disc spreads the same light over more of the page, so it is fainter
      float spread = clamp(pow(uSize / size, 1.2) * 2.6, 0.12, 1.0);
      vAlpha = uAlpha * (0.3 + 0.7 * aShade) * spread * g;
    }`;

  const FRAGMENT = `
    uniform vec3 uColour;
    varying float vAlpha, vSoft;
    void main() {
      vec2 c = 2.0 * gl_PointCoord - 1.0;
      float r = dot(c, c);
      if (r > 1.0) discard;
      // sharp: a solid speck; soft: a flat disc with a faint bright rim, as a lens draws one
      float disc = mix(1.0, 0.75 + 0.25 * smoothstep(0.55, 0.95, r), vSoft);
      float edge = 1.0 - smoothstep(0.82, 1.0, r);
      gl_FragColor = vec4(uColour, vAlpha * disc * edge);
    }`;

  // ---- the specks ----------------------------------------------------------
  function decode(b64) {
    const s = atob(b64);
    const u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u;
  }
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const parts = {};
  for (const name of ["rest", "pi", "lone"]) {
    const d = D.parts[name];
    const q = new Int8Array(decode(d.xyz).buffer);
    const shade = decode(d.shade);
    const n = d.n;
    const pos = new Float32Array(n * 3), start = new Float32Array(n * 3);
    const sh = new Float32Array(n), sd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // a byte a coordinate, and a hair of jitter so no lattice shows
      for (let a = 0; a < 3; a++) pos[i * 3 + a] = (q[i * 3 + a] + rand() - 0.5) * D.step;
      sh[i] = name === "rest" ? 0.6 : Math.pow(shade[i] / 255, 1.1);
      sd[i] = rand();
      // where it comes in from: a wide shell round the molecule
      const u = rand() * 2 - 1, th = rand() * Math.PI * 2, rr = 7 + rand() * 3;
      const s = Math.sqrt(1 - u * u);
      start[i * 3] = rr * s * Math.cos(th); start[i * 3 + 1] = rr * s * Math.sin(th); start[i * 3 + 2] = rr * u;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("aShade", new THREE.BufferAttribute(sh, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(sd, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTime: { value: 0 }, uFlow: { value: REDUCE ? 0 : FLOW }, uFreq: { value: FREQ },
        uGather: { value: REDUCE ? 1 : 0 }, uFocus: { value: 10 }, uBlur: { value: 1 },
        uSize: { value: 2 }, uAlpha: { value: ALPHA[name] }, uTwo: { value: 1 },
        uColour: { value: new THREE.Vector3(...COLOUR[name]) },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    pts.renderOrder = { rest: 1, lone: 2, pi: 3 }[name];   // what is brought forward is drawn over the rest
    body.add(pts);
    parts[name] = pts;
  }

  // The skeleton, in hairlines, and the atoms named: the double bond as two lines.
  const A = D.atoms;
  const bondPts = [];
  const at = (i, dy) => new THREE.Vector3(A[i][1], A[i][2] + dy, A[i][3]);
  bondPts.push(at(0, 0.055), at(1, 0.055), at(0, -0.055), at(1, -0.055), at(0, 0), at(2, 0), at(0, 0), at(3, 0));
  const bonds = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(bondPts),
    new THREE.LineBasicMaterial({ color: 0x17170f, transparent: true, opacity: 0, depthTest: false }));
  bonds.renderOrder = 3;
  body.add(bonds);
  const labels = Array.from(wrap.querySelectorAll(".molecule-atom"));

  // A shader that did not compile takes the drawing with it: check, and step aside.
  try {
    renderer.compile(scene, camera);
    const programs = renderer.info.programs || [];
    if (programs.some((p) => p.diagnostics && p.diagnostics.runnable === false)) throw new Error("shader");
  } catch (e) {
    renderer.dispose();
    wrap.remove();
    return;
  }

  // ---- framing -------------------------------------------------------------
  // The molecule stands in the middle of the room the slide leaves above the
  // title (the title is its caption, under it), as large as that room lets it.
  let W = 1, H = 1, pxPerA = 100, dist = 20;
  const half = Math.tan((camera.fov * Math.PI) / 360);
  function size() {
    const r = slide.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const small = phone();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setSize(W, H, false);
    const t = titleEl.getBoundingClientRect();
    const top = small ? 70 : 64, bottom = Math.max(top + 160, t.top - r.top - (small ? 18 : 26));
    const room = bottom - top;
    // (it is wider than it is tall, three-quarters on: the hydrogens reach out to the left)
    pxPerA = Math.min((room / 2) / FIT, (W / 2 - (small ? 8 : 48)) / (FIT * (small ? 1.3 : 1.08)));
    dist = (H / 2) / (half * pxPerA);
    camera.aspect = W / H;
    // raise the picture so the molecule's middle is the middle of that room
    camera.setViewOffset(W, H, 0, H / 2 - (top + bottom) / 2, W, H);
    camera.updateProjectionMatrix();
    const scale = renderer.getPixelRatio();
    const cut = soft ? 0.2 : small ? 0.6 : 1;
    for (const name in parts) {
      const u = parts[name].material.uniforms;
      u.uSize.value = (small ? 1.5 : 1.7) * scale;
      u.uBlur.value = BLUR * pxPerA * scale;
      u.uTwo.value = soft || small ? 0 : 1;
      parts[name].geometry.setDrawRange(0, Math.min(D.parts[name].n, Math.round(SHARE[name] * EMPHASIS[name] * cut)));
    }
    if (REDUCE) draw(performance.now());
  }

  // ---- the frame -----------------------------------------------------------
  let lean = { x: 0, y: 0 }, leanTo = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    leanTo = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
  }, { passive: true });

  const born = performance.now();
  const v3 = new THREE.Vector3();
  function draw(now) {
    const t = REDUCE ? 0 : (now - born) / 1000;
    const gather = REDUCE ? 1 : Math.min(1, (now - born) / GATHER_MS);
    if (!REDUCE) { lean.x += (leanTo.x - lean.x) * 0.04; lean.y += (leanTo.y - lean.y) * 0.04; }
    turn.rotation.set(
      SIDE.pitch + lean.y * LEAN,
      SIDE.yaw + (REDUCE ? 0 : SWAY * Math.sin((t * 2 * Math.PI) / SWAY_S)) + lean.x * LEAN, 0);
    // a camera held in the hand: the smallest wander, as the pmndrs camera shakes
    const shake = REDUCE ? 0 : 1;
    camera.position.set(0.05 * shake * Math.sin(t * 0.7), 0.04 * shake * Math.sin(t * 0.9 + 1), dist);
    camera.rotation.set(0, 0, 0.004 * shake * Math.sin(t * 0.5));
    // the focus drifting through the molecule, front to back and back
    const focus = dist + (REDUCE ? 0 : FOCUS_SWING * Math.sin((t * 2 * Math.PI) / 16));
    for (const name in parts) {
      const u = parts[name].material.uniforms;
      u.uTime.value = t; u.uGather.value = gather; u.uFocus.value = focus;
    }
    bonds.material.opacity = 0.34 * Math.max(0, (gather - 0.6) / 0.4);
    renderer.render(scene, camera);
    // the atoms' names, beside them
    body.updateMatrixWorld();
    labels.forEach((el, i) => {
      v3.set(A[i][1], A[i][2], A[i][3]).applyMatrix4(body.matrixWorld).project(camera);
      const x = (v3.x + 1) / 2 * W, y = (1 - v3.y) / 2 * H;
      const off = i === 1 ? [16, -14] : i === 0 ? [-14, -14] : [0, -14];
      el.style.transform = "translate(" + (x + off[0]).toFixed(1) + "px," + (y + off[1]).toFixed(1) + "px) translate(-50%, -50%)";
    });
    wrap.classList.toggle("molecule-named", gather > 0.85);
  }

  // Drawn only while the first slide is on the screen, and not under the menu or About me.
  let seen = true, running = false, drawn = 0;
  function loop(now) {
    running = false;
    if (!seen) return;
    const covered = document.body.classList.contains("menu-open") || document.body.classList.contains("about-shown");
    if (!covered && (!soft || now - drawn > 80)) { draw(now); drawn = now; }
    running = true;
    requestAnimationFrame(loop);
  }
  function wake() { if (!running && !REDUCE && seen) { running = true; requestAnimationFrame(loop); } }
  new IntersectionObserver((entries) => {
    seen = entries[entries.length - 1].isIntersecting;
    if (seen) { if (REDUCE) draw(performance.now()); else wake(); }
  }).observe(slide);
  new ResizeObserver(size).observe(slide);
  size();
  wrap.classList.add("molecule-drawn");
  if (REDUCE) draw(performance.now()); else wake();
})();

// ============================================================
// THE NOTE LIBRARY IN THREE DIMENSIONS — works/test-page.html
// (the test page)
//
// The test page began (2026-09-26) as the owner's picture of a dense red
// network standing for nothing, and became five glowing systems joined by
// lines you could travel along. Then, 2026-09-27:
//
//   "I want you to model the note library according to that. I want each
//   galaxy to be an accord, and then the dots on it should be the
//   individual notes that belong to that accord group. I want this all to
//   be 3d (as it is), and navigtable freely with rotation. I want you to
//   have a window on the right that contains the option to make the
//   search bar available. On this right side window should also be the
//   selection of the accords manually ...
//   there would be one central red library, with all the notes and
//   accords within that central galaxy. Then, if you press a button to
//   expand it (bottom middle of the screen), then each of the accords'
//   galaxies will separate and go into a separate direction ... You can
//   select the accord you want to go to in a drop down menu on the bottom
//   of the page (it appears after the expansion of the galaxy).
//   The nodes should remain red and glowing, until they expand, where
//   they will then turn their individual colours as they are now. They
//   should remain aglow. While they transition from the red to their
//   respective colours, I want them to turn white and have changing
//   geometrical links between them too. I want all transitions to be
//   smooth and run at 60FPS. when the nodes diverge from the central
//   galaxy ... I want there to be a central node which is connected to
//   all the galaxies. This will be used as a navigation point so you can
//   go from one accord to another interchangeably, which I want you to
//   make quite easy."
//
// So:
//
//   THE LIBRARY is read off the Note Library's own page
//   (categories/note-library.html), fetched as the page opens, so there
//   is one catalogue on the site and not two: every accord, every note in
//   it, what it is, its other spellings. How many fragrances use a note
//   is worked out from notes-data.js exactly as the library works it out,
//   and every note carries the library's own number and symbol.
//
//   ONE RED GALAXY to begin with: all 332 notes in a spiral disc, every
//   node red and glowing, each accord a slice of it — the most used notes
//   of an accord nearest the core. It turns slowly.
//
//   EXPANDING (the button at the foot, in the middle): the galaxy comes
//   apart. Every node turns WHITE, and while it is white the nodes of
//   each accord are joined by CHANGING LINKS — every pair near enough,
//   fading in and out as the nodes move — then each accord flies out on
//   a curve in a direction of its own and reforms as a small spiral
//   galaxy of its own, and turns its own colour, the colour the Note
//   Library gives it. THE CENTRE — a white node in a turning cage —
//   comes up where the library was, and a BRIDGE runs from it to every
//   galaxy. Collapsing runs the same thing backwards.
//
//   GOING BETWEEN ACCORDS: the dropdown at the foot (once expanded) with
//   an arrow either side of it; the keyboard's arrows; the name beside
//   every galaxy; a bridge; a note (which goes to its galaxy); the list of
//   accords in the window on the right. Every journey from one galaxy to
//   another bends in towards the centre and out again — the centre is
//   the way through — and pressing the centre goes back to seeing them
//   all.
//
//   THE WINDOW ON THE RIGHT: the switch that makes the search bar
//   available (it comes down at the top, the library's own `query>`, by
//   the library's own rule: direct words), and the accords, chosen by
//   hand as the library's tabs are — one lights and the rest go
//   translucent.
//
//   A NOTE PRESSED is selected: every other node turns translucent and
//   the card on the left says what it is — its symbol and number, its
//   accord, how many fragrances use it, what it is — with the way to it
//   in the Note Library.
//
// SIXTY FRAMES A SECOND. Every node, line and speck is one of a handful
// of buffers written in place each frame — nothing is made or thrown
// away while it runs — and the page's chrome is moved by transforms and
// faded by opacity only, never by anything that makes the browser lay
// the page out again. If the frames still come slower than they should
// (a large, sharp screen on a weak graphics card), it draws at a lower
// resolution rather than dropping frames.
//
// Three.js r128, from the same address as the home page's map. ONE
// SMALL ADDITION TO THE LIBRARY'S OWN SHADER (`perNode`): each sphere's
// own opacity, which is what lets one node go translucent while the
// next stays solid; everything else is the library's own. Without the
// library, or without the Note Library's page, the page says so. With
// reduced motion nothing turns on its own, and expanding, collapsing and
// every journey are made at once.
// ============================================================
(function () {
  const stage = document.querySelector(".net-stage");
  const canvas = stage && stage.querySelector(".net-canvas");
  if (!canvas) return;
  const root = typeof window.SITE_ROOT === "string" ? window.SITE_ROOT : "";
  const LIBRARY = "categories/note-library.html";

  function bare(unread) {
    const say = stage.querySelector(".net-fallback");
    if (say) {
      if (unread) {
        say.textContent = "The Note Library could not be read here. ";
        const a = document.createElement("a");
        a.href = root + LIBRARY;
        a.textContent = "Open the Note Library →";
        say.appendChild(a);
      }
      say.hidden = false;
    }
    stage.classList.add("is-bare");
  }
  if (typeof THREE === "undefined") { bare(false); return; }
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const REDS = [0xff3a44, 0xf2404b, 0xff525b, 0xe8323d, 0xff6168];
  const LINE_RED = 0xff5a63;            // the links while it is one galaxy
  const FRAME_RED = 0x9a3b41;           // the ring it turns in
  // Each accord's colour, as a hue — THE NOTE LIBRARY'S OWN (`HUE` in
  // note-library.js; a test keeps the two the same), a little more
  // saturated here so that it glows as that colour rather than as white.
  const HUE = {
    CIT: 50, ARO: 150, GRN: 100, FLO: 335, FRU: 8, SPI: 22, GOU: 36, BRW: 26,
    WOO: 30, CON: 135, RES: 40, ANI: 14, EAR: 75, AIR: 200, SMK: 220, IMP: 268, RET: 0,
  };
  const SAT = 0.72, LIGHT = 0.6;

  // THE ONE GALAXY
  const CENTRAL_R = 5.4;                // how far its disc reaches
  const ARMS = 4;
  const TWIST = 0.62;                   // how far an arm winds, per unit out
  const GAP = 0.34;                     // no two notes nearer than this
  // THE ACCORDS' GALAXIES
  const REACH = 15.5;                   // from the centre to each galaxy
  const LIFTS = [0.78, 0, -0.78];       // radians above, level and below, in turn
  const GAL_GAP = 0.3;
  const NEAREST = 3;                    // the links: each note to its nearest few
  // THE CHANGING LINKS while the nodes are white: every pair of one accord
  // nearer than this, brighter the nearer.
  const LINK_REACH = 0.86;
  const MAX_SEGMENTS = 6000;

  const EXPAND_MS = 3400;               // coming apart, and back together
  const FLY_MS = 2100;                  // one galaxy to another
  const FLY_NEAR_MS = 1500;             // the centre to a galaxy, and back
  const FADE_RATE = 0.0072;             // translucency, eased: gone in ~0.5s
  const GHOST = 0.12;                   // how solid the rest stay
  const SPIN = 0.00008;                 // radians a ms the one galaxy turns
  const GAL_SPIN = 0.00017;             // and each accord's
  const DRAG = 0.0056;                  // radians a pixel of drag
  const PITCH_MAX = 1.45;               // freely: nearly straight up or down
  const ONE_PITCH = 0.46;               // how high the one galaxy is seen from
  const APART_PITCH = 0.2;              // and the galaxies, once apart
  const PULSES = 80;
  const TAGS_ONE = 10;                  // names shown while it is one galaxy
  const TAGS_AT = 6;                    // names shown at an accord's galaxy

  // Seeded, so it is the same library every time.
  let seed = 7240927;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
  const pad = (n, w) => String(n).padStart(w || 2, "0");
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  // ============================================================
  // READING THE LIBRARY — the Note Library's own page, and the same
  // counting and naming it does. (Copied from note-library.js: `norm`
  // from search.js, the direct-words matching, `symbolFor` and the way
  // uses are counted. The tests hold the two pages to the same answers.)
  // ============================================================
  function norm(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/α/g, "a")
      .replace(/[^a-z0-9Ͱ-Ͽ]+/g, " ")
      .trim();
  }
  function read(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return [...doc.querySelectorAll(".lib-shelf")]
      .filter((shelf) => shelf.dataset.shelf && shelf.dataset.shelf !== "RET")
      .map((shelf) => {
        const code = shelf.dataset.shelf;
        const plate = shelf.querySelector(".lib-shelf-name");
        const say = shelf.querySelector(".lib-shelf-say");
        return {
          code,
          name: plate ? plate.textContent.replace(code, "").trim() : code,
          say: say ? say.textContent.trim() : "",
          notes: [...shelf.querySelectorAll(".lib-record")].map((el, i) => {
            const text = el.querySelector(".lib-say");
            return {
              id: el.id,
              name: el.querySelector(".lib-name").textContent.trim(),
              aka: (el.dataset.aka || "").split("|").map((s) => s.trim()).filter(Boolean),
              say: text ? text.textContent.trim() : "",
              call: code + " " + pad(i + 1, 3),
            };
          }),
        };
      })
      .filter((A) => A.notes.length);
  }
  /** Which fragrances name each spelling, as the library counts it. */
  function counted() {
    const uses = new Map();
    const NOTES = window.FRAGRANCE_NOTES || {};
    Object.keys(NOTES).forEach((key) => {
      const e = NOTES[key];
      const lists = [e.top, e.mid, e.base, e.flat];
      if (e.also) lists.push(e.also.top, e.also.mid, e.also.base, e.also.flat);
      lists.filter(Boolean).forEach((list) => list.forEach((note) => {
        const k = note.toLowerCase();
        if (!uses.has(k)) uses.set(k, new Set());
        uses.get(k).add(key);
      }));
    });
    return uses;
  }
  const taken = new Set();
  function symbolFor(name) {
    const plain = name.normalize("NFD").replace(/[^A-Za-z\s]/g, "");
    const words = plain.split(/\s+/).filter(Boolean);
    const letters = plain.replace(/\s+/g, "").toLowerCase();
    if (!letters) return "?";
    const first = letters[0].toUpperCase();
    const tries = [];
    if (words[1]) tries.push(first + words[1][0].toLowerCase());
    for (let i = 1; i < letters.length; i++) tries.push(first + letters[i]);
    for (let i = 1; i < letters.length; i++) for (let j = i + 1; j < letters.length; j++) tries.push(first + letters[i] + letters[j]);
    const got = tries.find((t) => !taken.has(t)) || first + String(taken.size);
    taken.add(got);
    return got;
  }
  // DIRECT WORDS ONLY, the library's rule: every word typed must BE a word
  // in the note's name or one of its other spellings (a plural counts).
  const words = (text) => norm(text).split(" ").filter(Boolean);
  const same = (a, b) => a === b || a === b + "s" || b === a + "s" || a === b + "es" || b === a + "es";
  function answer(n, q) {
    const asked = words(q);
    if (!asked.length) return 0;
    let best = 0;
    [n.name].concat(n.aka).forEach((name, i) => {
      const mine = words(name);
      if (!asked.every((w) => mine.some((m) => same(m, w)))) return;
      const whole = mine.length === asked.length ? 3 : same(mine[0], asked[0]) ? 2 : 1;
      best = Math.max(best, whole - (i ? 0.1 : 0));
    });
    return best;
  }

  stage.classList.add("is-reading");
  fetch(root + LIBRARY)
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status))))
    .then(read)
    .then((accords) => (accords.length ? accords : Promise.reject(new Error("empty"))))
    .then(start, () => { stage.classList.remove("is-reading"); bare(true); });

  // ============================================================
  // EVERYTHING ELSE, once the library has been read
  // ============================================================
  function start(accords) {
    stage.classList.remove("is-reading");
    const uses = counted();
    const notes = [];
    accords.forEach((A, k) => {
      A.k = k;
      A.hue = HUE[A.code] != null ? HUE[A.code] : 0;
      A.colour = new THREE.Color().setHSL(A.hue / 360, SAT, LIGHT);
      A.chip = "hsl(" + A.hue + ", 45%, 58%)";           // the library's own, for the chrome
      A.notes.forEach((n) => {
        const keys = new Set();
        [n.name].concat(n.aka).forEach((s) => (uses.get(s.toLowerCase()) || []).forEach((key) => keys.add(key)));
        n.A = A;
        n.i = notes.length;
        n.no = notes.length + 1;
        n.sym = symbolFor(n.name);
        n.uses = keys.size;
        n.size = 0.05 + 0.016 * Math.sqrt(n.uses);
        notes.push(n);
      });
    });
    const N = notes.length;
    stage.dataset.notes = String(N);
    stage.dataset.accords = String(accords.length);

    // ============================================================
    // WHERE EVERY NOTE STANDS — twice over: in the one galaxy, and in its
    // accord's own. Both in the same frame, the LAYOUT, which turns as the
    // one galaxy turns (and stops turning as it comes apart).
    // ============================================================
    const apart = (P, p, gap) => {
      for (let k = 0; k < P.length; k++) {
        const o = P[k], dx = o[0] - p[0], dy = o[1] - p[1], dz = o[2] - p[2];
        if (dx * dx + dy * dy + dz * dz < gap * gap) return false;
      }
      return true;
    };
    // THE ONE GALAXY: a bulge, and four arms winding out.
    const C = [];
    for (let tries = 0, gap = GAP; C.length < N; tries++) {
      if (tries > N * 300) { gap *= 0.92; tries = 0; }
      let p;
      if (rnd() < 0.13) p = [gauss() * 0.72, gauss() * 0.3, gauss() * 0.72];
      else {
        const arm = Math.floor(rnd() * ARMS), t = Math.pow(rnd(), 0.85);
        const rho = 0.8 + t * (CENTRAL_R - 0.8) + gauss() * 0.16;
        const a = arm * ((2 * Math.PI) / ARMS) + rho * TWIST + gauss() * (0.1 + 0.07 * t);
        p = [Math.cos(a) * rho, gauss() * 0.14 * (1.1 - 0.6 * t), Math.sin(a) * rho];
      }
      if (apart(C, p, gap)) C.push(p);
    }
    // EACH ACCORD A SLICE OF IT, round in order, its most used notes
    // nearest the core.
    const angle = (p) => Math.atan2(p[2], p[0]);
    const radius = (p) => Math.hypot(p[0], p[2]);
    const round = [...C.keys()].sort((a, b) => angle(C[a]) - angle(C[b]));
    let cursor = 0;
    const byUse = (a, b) => b.uses - a.uses || a.no - b.no;
    accords.forEach((A) => {
      const mine = round.slice(cursor, cursor + A.notes.length);
      cursor += A.notes.length;
      A.theta = (angle(C[mine[0]]) + angle(C[mine[mine.length - 1]])) / 2;
      mine.sort((a, b) => radius(C[a]) - radius(C[b]));
      A.byUse = A.notes.slice().sort(byUse);
      A.byUse.forEach((n, j) => { n.c = C[mine[j]]; });
      A.centroid = new THREE.Vector3();
      A.notes.forEach((n) => A.centroid.add(new THREE.Vector3(...n.c)));
      A.centroid.divideScalar(A.notes.length);
    });
    // EACH ACCORD'S OWN GALAXY: out along its slice's own direction, above
    // and below in turn, a small spiral of its own with its most used notes
    // at the core, facing the way it will be looked at from.
    const UP = new THREE.Vector3(0, 1, 0);
    // Above, level and below in turn — and where the ring closes, the last
    // one kept off the heights of both its neighbours.
    const lifts = accords.map((A, k) => LIFTS[k % LIFTS.length]);
    const n = lifts.length;
    if (n > 2 && lifts[n - 1] === lifts[0]) lifts[n - 1] = LIFTS.find((l) => l !== lifts[0] && l !== lifts[n - 2]);
    accords.forEach((A, k) => {
      const lift = lifts[k];
      A.out = new THREE.Vector3(Math.cos(A.theta) * Math.cos(lift), Math.sin(lift), Math.sin(A.theta) * Math.cos(lift));
      A.G = A.out.clone().multiplyScalar(REACH);
      A.side = new THREE.Vector3().crossVectors(UP, A.out).normalize();
      // Arrived at, it is seen from the centre's side of it, a little above
      // — having come out along its bridge — so that it stands alone
      // against the stars; and its disc faces nearly that way, so it is
      // seen open and not edge on.
      const level = new THREE.Vector3(A.out.x, 0, A.out.z).normalize();
      A.view = level.clone().negate().addScaledVector(UP, 0.55).addScaledVector(A.side, 0.22).normalize();
      A.normal = A.view.clone().multiplyScalar(0.8).addScaledVector(UP, 0.4).normalize();
      A.base = new THREE.Quaternion().setFromUnitVectors(UP, A.normal);
      A.swirl = new THREE.Vector3(Math.sin(A.theta), 0, -Math.cos(A.theta));  // the way the galaxy turns
      A.r = 0.62 + 0.3 * Math.sqrt(A.notes.length);
      const arms = A.notes.length > 26 ? 3 : 2;
      const P = [];
      A.byUse.forEach((n, j) => {
        for (let tries = 0, gap = GAL_GAP; ; tries++) {
          if (tries > 400) { gap *= 0.9; tries = 0; }
          const t = (j + 0.6) / A.notes.length;
          const rho = A.r * Math.pow(t, 0.62) + gauss() * 0.08;
          const a = (j % arms) * ((2 * Math.PI) / arms) + rho * 1.3 + gauss() * 0.28;
          const p = [Math.cos(a) * rho, gauss() * 0.06 * A.r * (1 - 0.5 * t), Math.sin(a) * rho];
          if (apart(P, p, gap)) { P.push(p); n.g = new THREE.Vector3(...p); break; }
        }
      });
      A.spin = rnd() * Math.PI * 2;
      A.rate = GAL_SPIN * (0.8 + rnd() * 0.4) * (k % 3 === 1 ? -1 : 1);
      A.q = new THREE.Quaternion();
    });

    // THE LINKS: each note to its nearest few — once as the one galaxy
    // has it, once as its accord's galaxy has it.
    function nearest(list, at, n) {
      const out = [];
      const seen = new Set();
      list.forEach((a) => {
        list.filter((b) => b !== a).map((b) => [at(a).distanceTo(at(b)), b])
          .sort((x, y) => x[0] - y[0]).slice(0, n).forEach(([, b]) => {
            const key = a.i < b.i ? a.i + ":" + b.i : b.i + ":" + a.i;
            if (!seen.has(key)) { seen.add(key); out.push([a.i, b.i]); }
          });
      });
      return out;
    }
    const cv = (n) => new THREE.Vector3(...n.c);
    const oneLinks = nearest(notes, cv, NEAREST - 1);       // whole galaxy: two each is plenty
    const galLinks = [];
    accords.forEach((A) => nearest(A.notes, (n) => n.g, NEAREST).forEach((l) => galLinks.push(l)));
    stage.dataset.links = String(oneLinks.length + galLinks.length);
    const near = notes.map(() => new Set());
    oneLinks.concat(galLinks).forEach(([a, b]) => { near[a].add(b); near[b].add(a); });

    // ============================================================
    // THE SCENE
    // ============================================================
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 400);
    scene.fog = new THREE.Fog(0x1f1f20, 20, 60);
    scene.add(new THREE.AmbientLight(0xffffff, 0.34));
    scene.add(new THREE.HemisphereLight(0xfff4f0, 0x2a1c1c, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffd8d8, 0.4);
    rim.position.set(4, -2, -3);
    scene.add(rim);

    // THE GLOW: one soft round spot, drawn once, that every halo and pulse is.
    const SPOT = (() => {
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
    })();
    const additive = (extra) => Object.assign({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }, extra);
    const circle = (r, n, dashed) => {
      const pos = [];
      for (let k = 0; k < n; k++) {
        if (dashed && k % 2) continue;
        const a = (k / n) * Math.PI * 2, b = ((k + 1) / n) * Math.PI * 2;
        pos.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(b) * r, 0, Math.sin(b) * r);
      }
      return pos;
    };
    const lines = (pos, colour, opacity) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      return new THREE.LineSegments(geo, new THREE.LineBasicMaterial(additive({ color: colour, opacity })));
    };

    // THE NOTES: faceted spheres, lit, glowing from within in their own
    // colour, drawn twice over — the ones at full strength (writing depth,
    // so they hide what is behind them) and the ones going or gone
    // translucent (not writing it) — sharing one opacity per note.
    //
    // perNode: the one addition to the library's shader. Each note's own
    // opacity, and its glow from within taken in its own colour.
    const BALL = new THREE.IcosahedronGeometry(1, 1);
    const opacity = new Float32Array(N).fill(1);
    const opacityAttr = new THREE.InstancedBufferAttribute(opacity, 1);
    opacityAttr.setUsage(THREE.DynamicDrawUsage);
    BALL.setAttribute("instOpacity", opacityAttr);
    function perNode(material) {
      material.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nattribute float instOpacity;\nvarying float vInstOpacity;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvInstOpacity = instOpacity;");
        sh.fragmentShader = sh.fragmentShader
          .replace("#include <common>", "#include <common>\nvarying float vInstOpacity;")
          .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.a *= vInstOpacity;")
          .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance *= vColor.rgb;");
      };
      return material;
    }
    const solid = new THREE.InstancedMesh(BALL, perNode(new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x4a4a4a, roughness: 0.32, metalness: 0.28, flatShading: true,
    })), N);
    const faint = new THREE.InstancedMesh(BALL, perNode(new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x4a4a4a, roughness: 0.4, metalness: 0.2, flatShading: true,
      transparent: true, depthWrite: false,
    })), N);
    const tint = new THREE.Color();
    for (let i = 0; i < N; i++) { solid.setColorAt(i, tint.set(REDS[i % REDS.length])); faint.setColorAt(i, tint); }
    faint.instanceColor = solid.instanceColor;           // one colour per note, for both
    solid.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    faint.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    solid.instanceColor.setUsage(THREE.DynamicDrawUsage);
    solid.frustumCulled = faint.frustumCulled = false;
    faint.renderOrder = 2;
    scene.add(solid, faint);
    const red = notes.map((n, i) => new THREE.Color(REDS[(i * 7 + (n.A.k * 3)) % REDS.length]));

    // THE GLOW round every note, added to what is behind it.
    const glowPos = new Float32Array(N * 3), glowCol = new Float32Array(N * 3);
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3).setUsage(THREE.DynamicDrawUsage));
    glowGeo.setAttribute("color", new THREE.BufferAttribute(glowCol, 3).setUsage(THREE.DynamicDrawUsage));
    const glow = new THREE.Points(glowGeo, new THREE.PointsMaterial(additive({ map: SPOT, size: 0.9, sizeAttenuation: true, vertexColors: true })));
    glow.frustumCulled = false;
    scene.add(glow);

    // THE LINKS — the one galaxy's, the accords', and the changing ones —
    // one set of lines, written each frame.
    const linkPos = new Float32Array(MAX_SEGMENTS * 6), linkCol = new Float32Array(MAX_SEGMENTS * 6);
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPos, 3).setUsage(THREE.DynamicDrawUsage));
    linkGeo.setAttribute("color", new THREE.BufferAttribute(linkCol, 3).setUsage(THREE.DynamicDrawUsage));
    const links = new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial(additive({ vertexColors: true })));
    links.frustumCulled = false;
    scene.add(links);

    // THE PULSES running along the links.
    const pulse = [];
    const pulsePos = new Float32Array(PULSES * 3), pulseCol = new Float32Array(PULSES * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3).setUsage(THREE.DynamicDrawUsage));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseCol, 3).setUsage(THREE.DynamicDrawUsage));
    const pulses = new THREE.Points(pulseGeo, new THREE.PointsMaterial(additive({ map: SPOT, size: 0.18, sizeAttenuation: true, vertexColors: true })));
    pulses.frustumCulled = false;
    scene.add(pulses);
    for (let k = 0; k < PULSES; k++) pulse.push({ one: Math.floor(rnd() * oneLinks.length), gal: Math.floor(rnd() * galLinks.length), t: rnd(), rate: 0.00028 + rnd() * 0.0005, back: rnd() < 0.5 });

    // THE RING the one galaxy turns in, ticked.
    const ringR = CENTRAL_R * 1.14;
    const ticks = [];
    for (let k = 0; k < 36; k++) {
      const a = (k / 36) * Math.PI * 2, l = k % 3 ? 0.08 : 0.24;
      ticks.push(Math.cos(a) * ringR, 0, Math.sin(a) * ringR, Math.cos(a) * (ringR + l), 0, Math.sin(a) * (ringR + l));
    }
    const oneRing = lines(circle(ringR, 160, true).concat(ticks), FRAME_RED, 0.7);
    scene.add(oneRing);

    // THE CENTRE: a white node in a turning cage, with a ring — and THE
    // BRIDGES from it to every galaxy.
    const hub = new THREE.Group();
    const hubBall = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffe8e8, emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.3, flatShading: true,
    }));
    const hubCage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 0)),
      new THREE.LineBasicMaterial(additive({ color: 0xffe0e0, opacity: 0.8 })));
    const hubRing = lines(circle(1.15, 72, true), 0xffc8c8, 0.6);
    const hubRing2 = lines(circle(1.3, 96, true), 0xffc8c8, 0.35);
    hubRing2.rotation.x = Math.PI / 2;
    const hubGlow = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)),
      new THREE.PointsMaterial(additive({ map: SPOT, size: 3.2, color: 0xffd6d6, opacity: 0.9 })));
    hub.add(hubBall, hubCage, hubRing, hubRing2, hubGlow);
    hub.visible = false;
    scene.add(hub);

    const A16 = accords.length;
    const bridgePos = new Float32Array(A16 * 6), bridgeCol = new Float32Array(A16 * 6);
    const bridgeGeo = new THREE.BufferGeometry();
    bridgeGeo.setAttribute("position", new THREE.BufferAttribute(bridgePos, 3).setUsage(THREE.DynamicDrawUsage));
    bridgeGeo.setAttribute("color", new THREE.BufferAttribute(bridgeCol, 3).setUsage(THREE.DynamicDrawUsage));
    const bridges = new THREE.LineSegments(bridgeGeo, new THREE.LineBasicMaterial(additive({ vertexColors: true })));
    bridges.frustumCulled = false;
    scene.add(bridges);
    const BP = 4;                                         // pulses a bridge
    const bpPos = new Float32Array(A16 * BP * 3), bpCol = new Float32Array(A16 * BP * 3);
    const bpGeo = new THREE.BufferGeometry();
    bpGeo.setAttribute("position", new THREE.BufferAttribute(bpPos, 3).setUsage(THREE.DynamicDrawUsage));
    bpGeo.setAttribute("color", new THREE.BufferAttribute(bpCol, 3).setUsage(THREE.DynamicDrawUsage));
    const bridgePulses = new THREE.Points(bpGeo, new THREE.PointsMaterial(additive({ map: SPOT, size: 0.42, sizeAttenuation: true, vertexColors: true })));
    bridgePulses.frustumCulled = false;
    scene.add(bridgePulses);

    // EACH GALAXY'S CORE — a small wire diamond the bridge ties on to — and
    // the ring it turns in, in its own colour.
    const OCT = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.26));
    const UNIT_RING = circle(1, 90, true);
    accords.forEach((A) => {
      A.core = new THREE.LineSegments(OCT, new THREE.LineBasicMaterial(additive({ color: A.colour, opacity: 0 })));
      A.ring = lines(UNIT_RING, A.colour, 0);
      A.ring.scale.setScalar(A.r * 1.12);
      A.core.visible = A.ring.visible = false;
      scene.add(A.core, A.ring);
    });

    // THE HAZE: fine specks strewn along the arms — the one galaxy's, and
    // each accord's own — so that they read as galaxies and not only as
    // networks. Each is one set of points turned as a whole, so it costs
    // nothing a frame.
    function haze(n, make, colour, size) {
      const pos = [];
      for (let k = 0; k < n; k++) pos.push(...make());
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial(additive({ map: SPOT, size, color: colour, opacity: 0 })));
      pts.frustumCulled = false;
      scene.add(pts);
      return pts;
    }
    const oneHaze = haze(1600, () => {
      if (rnd() < 0.15) return [gauss() * 0.85, gauss() * 0.26, gauss() * 0.85];
      const arm = Math.floor(rnd() * ARMS), t = Math.pow(rnd(), 0.9);
      const rho = 0.6 + t * (CENTRAL_R * 1.06 - 0.6);
      const a = arm * ((2 * Math.PI) / ARMS) + rho * TWIST + gauss() * (0.1 + 0.07 * t);
      return [Math.cos(a) * rho, gauss() * 0.1 * (1.1 - 0.6 * t), Math.sin(a) * rho];
    }, 0xff4a54, 0.12);
    accords.forEach((A) => {
      const arms = A.notes.length > 26 ? 3 : 2;
      A.haze = haze(50 + A.notes.length * 3, () => {
        const t = Math.pow(rnd(), 0.8);
        const rho = A.r * 1.08 * Math.pow(t, 0.62);
        const a = Math.floor(rnd() * arms) * ((2 * Math.PI) / arms) + rho * 1.3 + gauss() * 0.3;
        return [Math.cos(a) * rho, gauss() * 0.05 * A.r, Math.sin(a) * rho];
      }, A.colour, 0.1);
      A.haze.visible = false;
    });

    // Specks in the far air: a field of stars round it all.
    const dust = [];
    for (let i = 0; i < 900; i++) {
      const v = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(40 + rnd() * 60);
      dust.push(v.x, v.y, v.z);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
    const stars = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x8a8480, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55, fog: false }));
    scene.add(stars);

    // ============================================================
    // THE CHROME: the window on the right, the search bar it makes
    // available, the button and the dropdown at the foot, the card, the
    // names beside the galaxies and the notes, and the labels under the
    // hand.
    // ============================================================
    const el = (tag, cls, html) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    };

    // THE WINDOW ON THE RIGHT
    const panel = el("aside", "net-panel");
    panel.setAttribute("aria-label", "The Note Library: search and accords");
    panel.innerHTML =
      '<div class="net-panel-head">' +
        '<button type="button" class="net-fold" aria-expanded="true" aria-label="Fold the window away"><span aria-hidden="true"></span></button>' +
        '<p class="net-panel-title">Note Library</p>' +
      "</div>" +
      '<p class="net-panel-count"><span class="net-panel-notes"></span> notes · <span class="net-panel-accords"></span> accords · <span class="net-panel-state"></span></p>' +
      '<div class="net-panel-row">' +
        '<span class="net-panel-label" id="net-search-label">Search bar</span>' +
        '<button type="button" class="net-switch" role="switch" aria-checked="false" aria-labelledby="net-search-label"><span aria-hidden="true"></span></button>' +
      "</div>" +
      '<p class="net-panel-label net-panel-sub">Accords</p>' +
      '<div class="net-accords" role="group" aria-label="Choose an accord"></div>';
    stage.appendChild(panel);
    panel.querySelector(".net-panel-notes").textContent = String(N);
    panel.querySelector(".net-panel-accords").textContent = String(A16);
    const panelState = panel.querySelector(".net-panel-state");
    const list = panel.querySelector(".net-accords");
    const accordButton = (code, no, word, count, chip) => {
      const b = el("button", "net-accord");
      b.type = "button";
      b.dataset.code = code;
      b.setAttribute("aria-pressed", code ? "false" : "true");
      if (!code) b.classList.add("is-on");
      b.innerHTML = '<span class="net-chip" aria-hidden="true"></span><span class="net-accord-no"></span><span class="net-accord-code"></span><span class="net-accord-name"></span><span class="net-accord-count"></span>';
      b.querySelector(".net-chip").style.background = chip;
      b.querySelector(".net-accord-no").textContent = no;
      b.querySelector(".net-accord-code").textContent = code || "ALL";
      b.querySelector(".net-accord-name").textContent = word;
      b.querySelector(".net-accord-count").textContent = String(count);
      list.appendChild(b);
      return b;
    };
    const accordButtons = [accordButton("", "", "Every accord", N, "#ff3a44")];
    accords.forEach((A) => accordButtons.push(accordButton(A.code, pad(A.k + 1), A.name, A.notes.length, A.chip)));

    // THE SEARCH BAR, made available by the switch.
    const search = el("form", "net-search");
    search.setAttribute("role", "search");
    search.innerHTML =
      '<label class="net-prompt" for="net-query">query&gt;</label>' +
      '<input class="net-query" id="net-query" type="search" autocomplete="off" spellcheck="false" placeholder="type a note, like cedar or tonka" aria-label="Search the notes">' +
      '<output class="net-count" aria-live="polite"></output>' +
      '<button type="button" class="net-clear" aria-label="Clear the search" disabled><span aria-hidden="true"></span></button>' +
      '<ul class="net-results" role="listbox" aria-label="Notes found"></ul>';
    search.hidden = true;
    stage.appendChild(search);
    const query = search.querySelector(".net-query");
    const countOut = search.querySelector(".net-count");
    const clearButton = search.querySelector(".net-clear");
    const results = search.querySelector(".net-results");
    const switcher = panel.querySelector(".net-switch");

    // THE FOOT: the button that expands it, and — once expanded — the
    // dropdown with an arrow either side.
    const dock = el("div", "net-dock");
    dock.innerHTML =
      '<div class="net-nav" aria-hidden="true">' +
        '<button type="button" class="net-step" data-step="-1" aria-label="The accord before" tabindex="-1"><span aria-hidden="true"></span></button>' +
        '<div class="net-drop">' +
          '<button type="button" class="net-drop-button" aria-haspopup="listbox" aria-expanded="false" tabindex="-1">' +
            '<span class="net-chip" aria-hidden="true"></span><span class="net-drop-say"></span><span class="net-drop-caret" aria-hidden="true"></span></button>' +
          '<ul class="net-drop-list" role="listbox" aria-label="Go to an accord" tabindex="-1"></ul>' +
        "</div>" +
        '<button type="button" class="net-step" data-step="1" aria-label="The accord after" tabindex="-1"><span aria-hidden="true"></span></button>' +
      "</div>" +
      '<button type="button" class="net-expand" aria-expanded="false"><span class="net-expand-mark" aria-hidden="true"></span><span class="net-expand-say">Expand the library</span></button>';
    stage.appendChild(dock);
    const nav = dock.querySelector(".net-nav");
    const expandButton = dock.querySelector(".net-expand");
    const expandSay = dock.querySelector(".net-expand-say");
    const dropButton = dock.querySelector(".net-drop-button");
    const dropSay = dock.querySelector(".net-drop-say");
    const dropChip = dropButton.querySelector(".net-chip");
    const dropList = dock.querySelector(".net-drop-list");
    const options = [];
    const option = (k, text, chip) => {
      const li = el("li", "net-drop-option");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.dataset.to = String(k);
      li.innerHTML = '<span class="net-chip" aria-hidden="true"></span><span></span>';
      li.firstChild.style.background = chip;
      li.lastChild.textContent = text;
      dropList.appendChild(li);
      options.push(li);
    };
    option(-1, "The centre — every accord", "#ffffff");
    accords.forEach((A) => option(A.k, pad(A.k + 1) + " · " + A.code + " · " + A.name, A.chip));

    // THE CARD a selected note says itself in, on the left, and the line
    // from it to the note.
    const card = el("aside", "net-card");
    card.hidden = true;
    card.setAttribute("aria-live", "polite");
    card.setAttribute("aria-label", "The note selected");
    stage.appendChild(card);
    const leader = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    leader.setAttribute("class", "net-leader");
    leader.setAttribute("aria-hidden", "true");
    const leaderLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const leaderDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    leaderDot.setAttribute("r", "3");
    leader.append(leaderLine, leaderDot);
    stage.appendChild(leader);

    const hoverTag = el("p", "net-hover");
    hoverTag.setAttribute("aria-hidden", "true");
    const bridgeTag = el("p", "net-bridge");
    bridgeTag.setAttribute("aria-hidden", "true");
    stage.append(hoverTag, bridgeTag);

    // THE NAMES: one beside every galaxy once it has come apart (a way
    // there), and a few notes' names beside their nodes.
    const names = el("div", "net-names");
    stage.appendChild(names);
    accords.forEach((A) => {
      const b = el("button", "net-name");
      b.type = "button";
      b.tabIndex = -1;
      b.innerHTML = '<span class="net-chip" aria-hidden="true"></span><span class="net-name-code"></span><span class="net-name-word"></span>';
      b.firstChild.style.background = A.chip;
      b.children[1].textContent = A.code;
      b.children[2].textContent = A.name;
      b.setAttribute("aria-label", "Go to " + A.name);
      b.addEventListener("click", () => travel(A.k));
      names.appendChild(b);
      A.label = { el: b, w: 0, h: 0, show: 0, on: false };
    });
    const tagList = el("ol", "net-labels");
    tagList.setAttribute("aria-hidden", "true");
    stage.appendChild(tagList);
    const tags = [];
    for (let k = 0; k < Math.max(TAGS_ONE, TAGS_AT); k++) {
      const li = el("li", "net-label");
      tagList.appendChild(li);
      tags.push({ el: li, note: -1, show: 0, w: 0, h: 0 });
    }

    // ============================================================
    // STATE
    // ============================================================
    let u = 0, uTo = 0;                   // 0: one red galaxy; 1: apart, in colour
    let focus = -1;                       // -1: the centre; or an accord's number
    let flight = null;
    let psi = 0;                          // how far the one galaxy has turned
    let filter = "";                      // an accord chosen by hand
    let hits = [], hitSet = new Set();
    let selected = -1, hovered = -1, overBridge = -1, overHub = false;
    let panelOpen = window.innerWidth >= 700;
    let viewOff = 0, viewLift = 0, fitted = false;
    const cam = { T: new THREE.Vector3(), d: 20, yaw: 0.35, pitch: ONE_PITCH, zoom: 1 };
    let W = 1, H = 1, ratio = 1, fitMin = 1;
    let dOne = 16, dAll = 60;
    let raf = 0, quality = 1;

    // ============================================================
    // EVERY NOTE'S PLACE, EACH FRAME: the layout, turned by psi.
    // ============================================================
    const P = new Float32Array(N * 3);    // where every note is, in the world
    const Gw = accords.map(() => new THREE.Vector3());   // each galaxy's middle
    const Cw = accords.map(() => new THREE.Vector3());   // each accord's middle, as it moves
    const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3();
    const qs = new THREE.Quaternion();
    let cosP = 1, sinP = 0;
    const turn = (v) => { const x = v.x, z = v.z; v.x = x * cosP + z * sinP; v.z = -x * sinP + z * cosP; return v; };
    // How far the whole has come apart, by one clock (u) read three ways.
    const phase = () => ({
      white: smooth(0.02, 0.28, u),                    // red -> white
      colour: smooth(0.62, 0.95, u),                   // white -> the accord's colour
      move: ease(clamp((u - 0.12) / 0.78, 0, 1)),      // flying out
      shape: ease(clamp((u - 0.2) / 0.7, 0, 1)),       // reforming as a galaxy
      changing: smooth(0.1, 0.28, u) * (1 - smooth(0.7, 0.9, u)),
      one: 1 - smooth(0, 0.18, u),
      apart: smooth(0.82, 1, u),
      centre: smooth(0.45, 0.8, u),
      bridges: smooth(0.55, 0.95, u),
    });
    let ph = phase();
    function place() {
      cosP = Math.cos(psi); sinP = Math.sin(psi);
      accords.forEach((A) => {
        A.q.setFromAxisAngle(A.normal, A.spin).multiply(A.base);
        // Its middle, out on a curve that carries on the way the galaxy
        // was turning.
        const m = ph.move, im = 1 - m;
        v1.copy(A.centroid).add(A.G).multiplyScalar(0.5).addScaledVector(A.swirl, 3.2);
        Cw[A.k].copy(A.centroid).multiplyScalar(im * im).addScaledVector(v1, 2 * im * m).addScaledVector(A.G, m * m);
        A.notes.forEach((n) => {
          // Its place about the middle, from where it stood in the slice
          // to where it stands in its own galaxy.
          v2.set(n.c[0], n.c[1], n.c[2]).sub(A.centroid);
          v3.copy(n.g).applyQuaternion(A.q);
          v2.lerp(v3, ph.shape).add(Cw[A.k]);
          turn(v2);
          P[n.i * 3] = v2.x; P[n.i * 3 + 1] = v2.y; P[n.i * 3 + 2] = v2.z;
        });
        turn(Cw[A.k]);
        Gw[A.k].copy(A.G);
        turn(Gw[A.k]);
      });
    }

    // ============================================================
    // SEEING IT: a camera looking at a point (the centre, or a galaxy's
    // middle) from a distance, a heading and a height — all turned freely
    // by a drag.
    // ============================================================
    const room = () => (panelOpen && W >= 700 ? Math.min(330, W * 0.3) : 0);
    // The foot: the button, and once apart the dropdown over it.
    const foot = () => (uTo === 1 ? (W < 700 ? 150 : 132) : (W < 700 ? 90 : 78));
    const TOP = 24;
    const halfFov = () => {
      const t = Math.tan((camera.fov * Math.PI) / 360);
      const high = Math.atan(t * ((H - foot() - TOP) / Math.max(1, H)));
      return Math.min(high, Math.atan(t * ((W - room()) / Math.max(1, H))));
    };
    const fit = (r) => r / Math.sin(fitMin);
    // THE DRAWING'S OWN SIZE, only when the window's changes (setting it
    // clears and makes the drawing surface again, which is not something
    // to do in the middle of a movement) ...
    function size() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setPixelRatio(ratio = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2) * quality);
      renderer.setSize(W, H, false);
      camera.aspect = W / Math.max(1, H);
      camera.updateProjectionMatrix();
      tags.forEach((g) => { g.w = 0; });
      accords.forEach((A) => { A.label.w = 0; });
      refit();
    }
    // ... and everything fitted to the room the window on the right and the
    // foot leave, whenever either changes.
    function refit() {
      // The first time, the view starts where it belongs rather than
      // sliding there as the page opens.
      if (!fitted) { fitted = true; viewOff = room() / 2; viewLift = (foot() - TOP) / 2; }
      fitMin = halfFov();
      dOne = fit(CENTRAL_R * 1.02);
      dAll = fitApart(cam.yaw, APART_PITCH);
      accords.forEach((A) => { A.d = fit(A.r * 1.5); });
      wake();
    }
    /** How far back to stand to see every galaxy at once, from a heading
        and a height: each galaxy's middle, its reach and its name kept
        inside the room left — worked out from where they actually stand,
        which is nearer than a sphere round them all would put it. */
    function fitApart(yaw, pitch) {
      const t = Math.tan((camera.fov * Math.PI) / 360);
      const tv = t * ((H - (W < 700 ? 150 : 132) - TOP) / Math.max(1, H));
      const th = t * ((W - room()) / Math.max(1, H));
      const fwd = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), -Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
      const right = new THREE.Vector3().crossVectors(fwd, UP).normalize();
      const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
      cosP = Math.cos(psi); sinP = Math.sin(psi);
      let d = 0;
      accords.forEach((A) => {
        const g = turn(A.G.clone());
        const depth = g.dot(fwd);
        d = Math.max(d, (Math.abs(g.dot(right)) + A.r * 1.25) / th - depth, (Math.abs(g.dot(up)) + A.r * 1.25 + 1.1) / tv - depth);
      });
      return d;
    }
    const restTarget = (out) => (focus < 0 ? out.set(0, 0, 0) : out.copy(Gw[focus]));
    const restDistance = () => (focus < 0 ? lerp(dOne, dAll, ph.move) : accords[focus].d);
    /** How the view stands at a galaxy: from outside it, a little above
        and to one side, the centre behind it. */
    function poseAt(k) {
      if (k < 0) return null;
      const v = accords[k].view.clone();
      turn(v);
      return { yaw: Math.atan2(v.x, v.z), pitch: Math.asin(clamp(v.y, -1, 1)) };
    }
    const target = new THREE.Vector3();
    function aim(t) {
      if (flight) {
        const e = ease(clamp((t - flight.t0) / flight.ms, 0, 1));
        restTarget(target);
        // THROUGH THE CENTRE: from one galaxy to another the way bends in
        // towards the middle and out again.
        const ie = 1 - e;
        cam.T.copy(flight.T).multiplyScalar(ie * ie).addScaledVector(target, e * e);
        if (flight.via) cam.T.addScaledVector(v1.set(0, 0, 0), 2 * ie * e);
        else cam.T.addScaledVector(v1.copy(flight.T).lerp(target, 0.5), 2 * ie * e);
        cam.d = lerp(flight.d, restDistance(), e) + flight.lift * Math.sin(Math.PI * e);
        if (flight.pose) {
          cam.yaw = lerp(flight.yaw, flight.pose.yaw, e);
          cam.pitch = lerp(flight.pitch, flight.pose.pitch, e);
        }
        cam.zoom = lerp(flight.zoom, 1, e);
        if (e >= 1) arrive();
      } else {
        restTarget(cam.T);
        cam.d = restDistance();
      }
      const d = cam.d * cam.zoom;
      const cp = Math.cos(cam.pitch);
      camera.position.set(cam.T.x + Math.sin(cam.yaw) * cp * d, cam.T.y + Math.sin(cam.pitch) * d, cam.T.z + Math.cos(cam.yaw) * cp * d);
      camera.lookAt(cam.T);
      scene.fog.near = d * 0.9;
      scene.fog.far = d + (focus < 0 ? 18 + ph.move * 30 : 34);
      // Keep what is being looked at in the middle of the room the window
      // on the right and the foot leave.
      viewOff += (room() / 2 - viewOff) * (still ? 1 : 0.14);
      viewLift += ((foot() - TOP) / 2 - viewLift) * (still ? 1 : 0.14);
      camera.setViewOffset(W, H, viewOff, viewLift, W, H);
    }

    // ============================================================
    // TRAVELLING: to a galaxy, or back to the centre.
    // ============================================================
    function travel(k) {
      if (uTo < 1 && k >= 0) return;
      if (k === focus && !flight) return;
      const from = focus;
      const pose = k >= 0 ? poseAt(k) : null;
      if (pose) {
        let dy = pose.yaw - cam.yaw;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        pose.yaw = cam.yaw + dy;
      }
      flight = {
        T: cam.T.clone(), d: cam.d, yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom, pose,
        via: from >= 0 && k >= 0, lift: from >= 0 && k >= 0 ? dAll * 0.28 : 0,
        ms: still ? 1 : from >= 0 && k >= 0 ? FLY_MS : FLY_NEAR_MS, t0: performance.now(),
      };
      focus = k;
      stage.dataset.flying = "1";
      say();
      tagsFor();
      wake();
      if (still) { aim(performance.now() + 10); }
    }
    function arrive() {
      flight = null;
      stage.dataset.flying = "";
      if (focus >= 0) accords[focus].pingAt = performance.now();
      say();
      tagsFor();
    }
    const step = (by) => {
      if (uTo < 1) return;
      const n = A16;
      const k = focus < 0 ? (by > 0 ? 0 : n - 1) : (focus + by + n) % n;
      travel(k);
    };

    // ============================================================
    // COMING APART, AND BACK
    // ============================================================
    function expand(to) {
      uTo = to ? 1 : 0;
      if (still) u = uTo;
      if (to && focus < 0 && !still) {
        flight = { T: cam.T.clone(), d: cam.d, yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom,
          pose: { yaw: cam.yaw, pitch: APART_PITCH }, via: false, lift: 0, ms: EXPAND_MS * 0.92, t0: performance.now() };
      }
      if (!to) {
        closeDrop();
        if (focus >= 0 || flight) {
          // Back to the centre as it comes together.
          flight = { T: cam.T.clone(), d: cam.d, yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom, pose: null, via: false, lift: 0,
            ms: still ? 1 : EXPAND_MS * 0.7, t0: performance.now() };
          focus = -1;
        }
        if (!still) {
          flight = { T: cam.T.clone(), d: cam.d, yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom,
            pose: { yaw: cam.yaw, pitch: ONE_PITCH }, via: false, lift: 0, ms: EXPAND_MS * 0.8, t0: performance.now() };
        }
      }
      refit();
      stage.classList.add("is-turned");
      expandButton.setAttribute("aria-expanded", to ? "true" : "false");
      expandSay.textContent = to ? "Collapse into one" : "Expand the library";
      stage.classList.toggle("is-apart", !!to);
      say();
      tagsFor();
      wake();
    }
    expandButton.addEventListener("click", () => expand(uTo < 1));

    /** Everything that says where you are. */
    function say() {
      const where = u >= 1 || uTo === 1 ? (focus < 0 ? "centre" : accords[focus].code) : "one";
      stage.dataset.state = uTo === 1 ? (u >= 1 ? "apart" : "expanding") : u <= 0 ? "one" : "collapsing";
      stage.dataset.focus = focus < 0 ? "centre" : accords[focus].code;
      panelState.textContent = uTo === 1 ? "in " + A16 + " galaxies" : "in one galaxy";
      const A = focus >= 0 ? accords[focus] : null;
      dropSay.textContent = A ? pad(A.k + 1) + " · " + A.code + " · " + A.name : "The centre — every accord";
      dropChip.style.background = A ? A.chip : "#ffffff";
      options.forEach((o) => {
        const on = +o.dataset.to === focus;
        o.setAttribute("aria-selected", on ? "true" : "false");
        o.classList.toggle("is-here", on);
      });
      accordButtons.forEach((b) => b.classList.toggle("is-here", !!A && b.dataset.code === A.code));
      const open = uTo === 1;
      nav.setAttribute("aria-hidden", open ? "false" : "true");
      nav.querySelectorAll("button").forEach((b) => { b.tabIndex = open ? 0 : -1; });
      names.querySelectorAll("button").forEach((b) => { b.tabIndex = open ? 0 : -1; });
      stage.dataset.where = where;
    }

    // ============================================================
    // THE DROPDOWN at the foot
    // ============================================================
    let active = -1;
    function openDrop() {
      if (uTo !== 1) return;
      dock.classList.add("is-open");
      dropButton.setAttribute("aria-expanded", "true");
      active = options.findIndex((o) => +o.dataset.to === focus);
      mark();
      dropList.focus({ preventScroll: true });
    }
    function closeDrop(back) {
      if (!dock.classList.contains("is-open")) return;
      dock.classList.remove("is-open");
      dropButton.setAttribute("aria-expanded", "false");
      if (back) dropButton.focus({ preventScroll: true });
    }
    function mark() {
      options.forEach((o, n) => o.classList.toggle("is-active", n === active));
      if (options[active]) dropList.setAttribute("aria-activedescendant", options[active].id = "net-option-" + active);
    }
    dropButton.addEventListener("click", () => (dock.classList.contains("is-open") ? closeDrop(true) : openDrop()));
    options.forEach((o, n) => {
      o.addEventListener("click", () => { closeDrop(true); travel(+o.dataset.to); });
      o.addEventListener("pointermove", () => { if (active !== n) { active = n; mark(); } });
    });
    dropList.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        mark();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const to = +options[Math.max(0, active)].dataset.to;
        closeDrop(true);
        travel(to);
      } else if (e.key === "Escape" || e.key === "Tab") {
        closeDrop(e.key === "Escape");
      }
    });
    dropButton.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); openDrop(); }
    });
    document.addEventListener("pointerdown", (e) => { if (!dock.contains(e.target)) closeDrop(); });
    nav.querySelectorAll(".net-step").forEach((b) => b.addEventListener("click", () => step(+b.dataset.step)));

    // ============================================================
    // THE WINDOW ON THE RIGHT: folding it, the switch, the accords
    // ============================================================
    const fold = panel.querySelector(".net-fold");
    function setPanel(open) {
      panelOpen = open;
      panel.classList.toggle("is-folded", !open);
      stage.classList.toggle("has-panel", open);
      fold.setAttribute("aria-expanded", open ? "true" : "false");
      fold.setAttribute("aria-label", open ? "Fold the window away" : "Open the window");
      list.querySelectorAll("button").forEach((b) => { b.tabIndex = open ? 0 : -1; });
      switcher.tabIndex = open ? 0 : -1;
      if (W > 1) refit();
    }
    fold.addEventListener("click", () => setPanel(!panelOpen));
    setPanel(panelOpen);

    function setSearch(on) {
      switcher.setAttribute("aria-checked", on ? "true" : "false");
      search.hidden = !on;
      stage.classList.toggle("has-search", on);
      // On a phone the window stands over the bar: it folds away to use it.
      if (on && W < 700 && panelOpen) setPanel(false);
      if (on) query.focus({ preventScroll: true });
      else if (query.value) { query.value = ""; find(); }
    }
    switcher.addEventListener("click", () => setSearch(switcher.getAttribute("aria-checked") !== "true"));

    accordButtons.forEach((b) => b.addEventListener("click", () => {
      filter = b.dataset.code;
      accordButtons.forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      stage.dataset.filter = filter;
      // Apart, choosing an accord also goes there; choosing them all goes
      // back to the centre.
      if (uTo === 1) {
        const A = accords.find((x) => x.code === filter);
        travel(A ? A.k : -1);
      }
      wake();
    }));

    // THE SEARCH: direct words, as the library's own.
    function find() {
      const q = query.value.trim();
      hits = [];
      if (q) {
        hits = notes.map((n) => ({ n, s: answer(n, q) })).filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s || a.n.name.localeCompare(b.n.name)).map((x) => x.n);
      }
      hitSet = new Set(hits.map((n) => n.i));
      countOut.textContent = q ? hits.length + " / " + N : N + " notes";
      clearButton.disabled = !query.value;
      results.innerHTML = "";
      hits.slice(0, 8).forEach((n) => {
        const li = el("li", "net-result");
        li.setAttribute("role", "option");
        li.innerHTML = '<span class="net-chip" aria-hidden="true"></span><span class="net-result-sym"></span><span class="net-result-name"></span><span class="net-result-code"></span>';
        li.firstChild.style.background = n.A.chip;
        li.children[1].textContent = n.sym;
        li.children[2].textContent = n.name;
        li.children[3].textContent = n.A.code;
        li.addEventListener("click", () => { go(n); search.classList.remove("has-results"); });
        results.appendChild(li);
      });
      if (q && !hits.length) results.appendChild(el("li", "net-result is-none", "No note answers that."));
      search.classList.toggle("has-results", !!q);
      stage.dataset.query = q;
      stage.dataset.hits = String(hits.length);
      wake();
    }
    query.addEventListener("input", find);
    clearButton.addEventListener("click", () => { query.value = ""; find(); query.focus(); });
    search.addEventListener("submit", (e) => { e.preventDefault(); if (hits[0]) { go(hits[0]); search.classList.remove("has-results"); } });
    query.addEventListener("focus", () => { if (query.value.trim()) search.classList.add("has-results"); });
    query.addEventListener("keydown", (e) => { if (e.key === "Escape" && query.value) { e.stopPropagation(); query.value = ""; find(); } });
    find();

    /** A note, chosen from anywhere: selected, and — apart — its galaxy
        gone to. */
    function go(n) {
      if (uTo === 1 && focus !== n.A.k) travel(n.A.k);
      select(n.i, true);
    }

    // ============================================================
    // SELECTING: one note whole and lit, every other translucent.
    // ============================================================
    function select(i, keep) {
      if (selected === i && !keep) { deselect(); return; }
      selected = i;
      const n = notes[i];
      card.innerHTML =
        '<div class="net-card-top">' +
          '<span class="net-card-sym"></span>' +
          '<div><p class="net-card-name"></p><p class="net-card-accord"><span class="net-chip" aria-hidden="true"></span><span></span></p></div>' +
          '<button type="button" class="net-card-close" aria-label="Let it go">×</button>' +
        "</div>" +
        '<dl class="net-card-facts">' +
          "<div><dt>Element</dt><dd class=\"net-card-no\"></dd></div>" +
          "<div><dt>Call number</dt><dd class=\"net-card-call\"></dd></div>" +
          "<div><dt>Fragrances</dt><dd class=\"net-card-uses\"></dd></div>" +
        "</dl>" +
        '<p class="net-card-say"></p>' +
        '<a class="net-card-open"></a>';
      card.querySelector(".net-card-sym").textContent = n.sym;
      card.querySelector(".net-card-name").textContent = n.name;
      card.querySelector(".net-card-accord .net-chip").style.background = n.A.chip;
      card.querySelector(".net-card-accord span:last-child").textContent = n.A.code + " · " + n.A.name;
      card.querySelector(".net-card-no").textContent = String(n.no);
      card.querySelector(".net-card-call").textContent = n.call;
      card.querySelector(".net-card-uses").textContent = n.uses === 1 ? "used in 1" : "used in " + n.uses;
      card.querySelector(".net-card-say").textContent = n.say;
      const open = card.querySelector(".net-card-open");
      open.href = root + LIBRARY + "#" + n.id;
      open.textContent = "Open it in the Note Library →";
      card.querySelector(".net-card-close").addEventListener("click", deselect);
      card.hidden = false;
      card.style.setProperty("--chip", n.A.chip);
      stage.classList.add("is-selecting");
      stage.dataset.selected = n.name;
      wake();
    }
    function deselect() {
      if (selected < 0) return;
      selected = -1;
      card.hidden = true;
      stage.classList.remove("is-selecting");
      stage.dataset.selected = "";
      wake();
    }

    // ============================================================
    // THE NAMES OF A FEW NOTES beside their nodes: the most used in the
    // whole library while it is one, the most used of an accord at its
    // galaxy, none between.
    // ============================================================
    function tagsFor() {
      let want = [];
      if (uTo === 0) want = notes.slice().sort(byUse).slice(0, TAGS_ONE);
      else if (focus >= 0 && !flight) want = accords[focus].byUse.slice(0, TAGS_AT);
      tags.forEach((g, k) => {
        const n = want[k];
        const to = n ? n.i : -1;
        if (to === g.note) return;
        g.next = to;                     // swapped once it has faded out
      });
    }

    // ============================================================
    // THE POINTER
    // ============================================================
    const scr = new THREE.Vector3();
    const project = (x, y, z) => {
      scr.set(x, y, z).project(camera);
      return scr;
    };
    const toX = (p) => (p.x * 0.5 + 0.5) * W;
    const toY = (p) => (-p.y * 0.5 + 0.5) * H;
    const scale = () => H / (2 * Math.tan((camera.fov * Math.PI) / 360));
    /** The note under the pointer: of those it is on, the one whose middle
        it is nearest — where they crowd, the one you are pointing AT, not
        the one nearest you — the nearer only between two as near. */
    function nodeAt(x, y) {
      let best = -1, bestScore = Infinity;
      const s = scale();
      for (let i = 0; i < N; i++) {
        const px = P[i * 3], py = P[i * 3 + 1], pz = P[i * 3 + 2];
        const p = project(px, py, pz);
        if (p.z > 1 || p.z < -1) continue;
        const dx = toX(p) - x, dy = toY(p) - y;
        const d = Math.hypot(px - camera.position.x, py - camera.position.y, pz - camera.position.z);
        const r = Math.max(7, (notes[i].size * 1.5 * s) / d);
        const off = Math.sqrt(dx * dx + dy * dy);
        if (off > r) continue;
        if (opacity[i] < 0.5 && selected >= 0) continue;
        const score = Math.round((off / r) * 8) + d * 0.001;
        if (score < bestScore) { bestScore = score; best = i; }
      }
      return best;
    }
    function bridgeAt(x, y) {
      if (ph.bridges < 0.9) return -1;
      let best = -1, bestD = 9;
      accords.forEach((A) => {
        const a = project(0, 0, 0), ax = toX(a), ay = toY(a), az = a.z;
        const b = project(Gw[A.k].x, Gw[A.k].y, Gw[A.k].z), bx = toX(b), by = toY(b);
        if (az > 1 || b.z > 1) return;
        const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
        const t = clamp(((x - ax) * dx + (y - ay) * dy) / Math.max(1, L), 0.12, 0.82);
        const d = Math.hypot(ax + dx * t - x, ay + dy * t - y);
        if (d < bestD) { bestD = d; best = A.k; }
      });
      return best;
    }
    function hubAt(x, y) {
      if (ph.centre < 0.9) return false;
      const p = project(0, 0, 0);
      const d = camera.position.length();
      return p.z < 1 && Math.hypot(toX(p) - x, toY(p) - y) < Math.max(14, (0.8 * scale()) / d);
    }
    let hand = null;                      // where the pointer is, read in the frame
    function point() {
      if (!hand || flight) return;
      const i = nodeAt(hand.x, hand.y);
      const h = i < 0 && hubAt(hand.x, hand.y);
      const k = i < 0 && !h ? bridgeAt(hand.x, hand.y) : -1;
      if (i !== hovered) { hovered = i; stage.dataset.hover = i >= 0 ? notes[i].name : ""; }
      overHub = h;
      overBridge = k;
      stage.dataset.overBridge = k >= 0 ? accords[k].code : "";
      stage.dataset.overCentre = h ? "1" : "";
    }

    // ============================================================
    // TURNING IT FREELY, PRESSING, THE WHEEL, A PINCH
    // ============================================================
    const down = new Map();
    let drag = null, spinYaw = 0, spinPitch = 0, pinch = 0;
    canvas.addEventListener("pointerdown", (e) => {
      down.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.setPointerCapture(e.pointerId);
      if (down.size === 2) {
        const [a, b] = [...down.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
        drag = null;
        return;
      }
      drag = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, lt: performance.now(), id: e.pointerId, moved: false };
      spinYaw = spinPitch = 0;
      closeDrop();
      wake();
    });
    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      if (down.has(e.pointerId)) down.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (down.size === 2 && pinch) {
        const [a, b] = [...down.values()];
        const now = Math.hypot(a.x - b.x, a.y - b.y);
        cam.zoom = clamp(cam.zoom * (pinch / Math.max(1, now)), 0.3, 2.4);
        pinch = now;
        wake();
        return;
      }
      if (drag && e.pointerId === drag.id) {
        if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) {
          drag.moved = true;
          stage.classList.add("is-turned");
        }
        if (drag.moved && !flight) {
          const now = performance.now();
          const dx = e.clientX - drag.lx, dy = e.clientY - drag.ly;
          cam.yaw -= dx * DRAG;
          cam.pitch = clamp(cam.pitch + dy * DRAG * 0.8, -PITCH_MAX, PITCH_MAX);
          const dt = Math.max(8, now - drag.lt);
          spinYaw = (-dx * DRAG) / dt;
          spinPitch = (dy * DRAG * 0.8) / dt;
          drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now;
          wake();
          return;
        }
      }
      hand = { x: e.clientX - r.left, y: e.clientY - r.top };
      wake();
    });
    const letGo = (e) => {
      down.delete(e.pointerId);
      if (down.size < 2) pinch = 0;
      const was = drag;
      if (!was || e.pointerId !== was.id) return;
      drag = null;
      if (performance.now() - was.lt > 90) spinYaw = spinPitch = 0;
      if (was.moved || e.type === "pointercancel" || flight) return;
      // A PRESS, not a drag.
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const i = nodeAt(x, y);
      if (i >= 0) {
        if (uTo === 1 && focus !== notes[i].A.k) { travel(notes[i].A.k); select(i, true); }
        else select(i);
        return;
      }
      if (hubAt(x, y)) { travel(-1); return; }
      const k = bridgeAt(x, y);
      if (k >= 0) { travel(focus === k ? -1 : k); return; }
      deselect();
    };
    canvas.addEventListener("pointerup", letGo);
    canvas.addEventListener("pointercancel", letGo);
    canvas.addEventListener("pointerleave", () => { if (!drag) { hand = null; hovered = -1; overBridge = -1; overHub = false; stage.dataset.hover = ""; wake(); } });
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (flight) return;
      cam.zoom = clamp(cam.zoom * Math.exp(e.deltaY * 0.0011), 0.3, 2.4);
      stage.classList.add("is-turned");
      wake();
    }, { passive: false });
    document.addEventListener("keydown", (e) => {
      const typing = e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");
      if (e.key === "Escape" && !typing) { closeDrop(); deselect(); return; }
      if (typing || dock.classList.contains("is-open") || e.target === dropList) return;
      if (uTo < 1) return;
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === "Home") { e.preventDefault(); travel(-1); }
    });

    // ============================================================
    // EVERY FRAME
    // ============================================================
    let lastT = 0, born = 0;
    const white = new THREE.Color(1, 1, 1);
    const cA = new THREE.Color(), cB = new THREE.Color();
    const m4 = new THREE.Matrix4(), ZERO = new THREE.Matrix4().makeScale(0, 0, 0);
    const qI = new THREE.Quaternion(), sc = new THREE.Vector3(), at = new THREE.Vector3();
    const wantOpacity = new Float32Array(N);
    const colours = new Float32Array(N * 3);        // each note's colour this frame
    let segs = 0, changing = 0;

    function colourOf(n, out) {
      out.copy(red[n.i]).lerp(white, ph.white);
      return out.lerp(n.A.colour, ph.colour);
    }
    function want(i) {
      let o = 1;
      const n = notes[i];
      if (filter && n.A.code !== filter) o = GHOST;
      if (hits.length || query.value.trim()) { if (!hitSet.has(i)) o = GHOST; }
      if (selected >= 0 && i !== selected) o = Math.min(o, near[selected].has(i) ? 0.4 : GHOST);
      return o;
    }
    function segment(ax, ay, az, bx, by, bz, r, g, b) {
      if (segs >= MAX_SEGMENTS) return;
      const o = segs * 6;
      linkPos[o] = ax; linkPos[o + 1] = ay; linkPos[o + 2] = az;
      linkPos[o + 3] = bx; linkPos[o + 4] = by; linkPos[o + 5] = bz;
      linkCol[o] = linkCol[o + 3] = r;
      linkCol[o + 1] = linkCol[o + 4] = g;
      linkCol[o + 2] = linkCol[o + 5] = b;
      segs++;
    }
    function staticLinks(set, weight, colourFor) {
      if (weight <= 0.01) return;
      for (let k = 0; k < set.length; k++) {
        const a = set[k][0], b = set[k][1];
        const lit = a === selected || b === selected || a === hovered || b === hovered;
        const f = weight * Math.min(opacity[a], opacity[b]) * (lit ? 2.2 : 1);
        if (f < 0.02) continue;
        colourFor(a, cA);
        const w = lit ? 0.45 : 0;
        segment(P[a * 3], P[a * 3 + 1], P[a * 3 + 2], P[b * 3], P[b * 3 + 1], P[b * 3 + 2],
          (cA.r + (1 - cA.r) * w) * f, (cA.g + (1 - cA.g) * w) * f, (cA.b + (1 - cA.b) * w) * f);
      }
    }
    const oneColour = (a, out) => out.setRGB(1, 0.35, 0.39).multiplyScalar(0.42);
    const galColour = (a, out) => out.copy(notes[a].A.colour).multiplyScalar(0.5);

    function frame(t) {
      const began = performance.now();
      const dt = Math.min(50, t - (lastT || t));
      lastT = t;
      if (!born) born = t;
      // THE CLOCK THAT TAKES IT APART, and puts it back.
      if (u !== uTo) {
        const by = still ? 1 : dt / EXPAND_MS;
        u = uTo > u ? Math.min(uTo, u + by) : Math.max(uTo, u - by);
        if (u === uTo) { say(); tagsFor(); }
      }
      ph = phase();
      const slow = selected >= 0 ? 0.25 : hovered >= 0 ? 0.35 : 1;
      if (!still) {
        psi += dt * SPIN * (1 - ph.move) * slow;
        accords.forEach((A) => { A.spin += dt * A.rate * ph.move * slow; });
      }
      place();

      // THE CAMERA, and the turn a drag leaves behind it.
      if (!drag && !flight && (spinYaw || spinPitch)) {
        cam.yaw += spinYaw * dt;
        cam.pitch = clamp(cam.pitch + spinPitch * dt, -PITCH_MAX, PITCH_MAX);
        const k = Math.exp(-dt / 320);
        spinYaw *= k; spinPitch *= k;
        if (Math.abs(spinYaw) < 1e-6 && Math.abs(spinPitch) < 1e-6) spinYaw = spinPitch = 0;
      }
      aim(t);
      scene.updateMatrixWorld();
      point();

      // TRANSLUCENCY, eased note by note.
      const fade = still ? 1 : 1 - Math.exp(-dt * FADE_RATE);
      let dim = 0, settling = false;
      const intro = still ? 1 : smooth(0, 1200, t - born);
      for (let i = 0; i < N; i++) {
        const w = want(i);
        wantOpacity[i] = w;
        const o = opacity[i] + (w - opacity[i]) * fade;
        opacity[i] = Math.abs(o - w) < 0.002 ? w : o;
        if (opacity[i] !== w) settling = true;
        if (opacity[i] < 0.5) dim++;
      }
      opacityAttr.needsUpdate = true;

      // THE NOTES: where, how large, what colour.
      for (let i = 0; i < N; i++) {
        const n = notes[i];
        colourOf(n, cB);
        const hot = i === selected ? 0.6 : i === hovered ? 0.25 : hitSet.has(i) ? 0.15 : 0;
        cB.lerp(white, hot);
        colours[i * 3] = cB.r; colours[i * 3 + 1] = cB.g; colours[i * 3 + 2] = cB.b;
        solid.instanceColor.setXYZ(i, cB.r, cB.g, cB.b);
        const grow = (i === selected ? 1.55 : i === hovered ? 1.3 : 1) * (0.2 + 0.8 * smooth(0, 1, (intro - radiusOf(i) * 0.6) / 0.4));
        at.set(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
        m4.compose(at, qI, sc.setScalar(n.size * grow));
        const whole = opacity[i] > 0.995;
        solid.setMatrixAt(i, whole ? m4 : ZERO);
        faint.setMatrixAt(i, whole ? ZERO : m4);
        // Its glow: brighter while white, and for a note that answers.
        const k = (0.34 + n.size * 2.2) * (1 + 0.55 * ph.changing) * (0.2 + 0.8 * opacity[i]) * (i === selected ? 2 : 1) * grow;
        glowPos[i * 3] = at.x; glowPos[i * 3 + 1] = at.y; glowPos[i * 3 + 2] = at.z;
        glowCol[i * 3] = cB.r * k; glowCol[i * 3 + 1] = cB.g * k * 0.9; glowCol[i * 3 + 2] = cB.b * k * 0.9;
      }
      solid.instanceMatrix.needsUpdate = true;
      faint.instanceMatrix.needsUpdate = true;
      solid.instanceColor.needsUpdate = true;
      glowGeo.attributes.position.needsUpdate = true;
      glowGeo.attributes.color.needsUpdate = true;

      // THE LINKS: the one galaxy's going as it comes apart, the changing
      // ones while it is white, the accords' as each galaxy forms.
      segs = 0;
      staticLinks(oneLinks, ph.one * intro, oneColour);
      staticLinks(galLinks, ph.apart, galColour);
      changing = 0;
      if (ph.changing > 0.01) {
        const R2 = LINK_REACH * LINK_REACH;
        for (let k = 0; k < A16; k++) {
          const list = accords[k].notes;
          for (let x = 0; x < list.length; x++) {
            const a = list[x].i;
            const ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2];
            for (let y = x + 1; y < list.length; y++) {
              const b = list[y].i;
              const dx = P[b * 3] - ax, dy = P[b * 3 + 1] - ay, dz = P[b * 3 + 2] - az;
              const d2 = dx * dx + dy * dy + dz * dz;
              if (d2 >= R2) continue;
              const f = Math.pow(1 - Math.sqrt(d2) / LINK_REACH, 1.1) * ph.changing * 1.8 * Math.min(opacity[a], opacity[b]);
              if (f < 0.02) continue;
              segment(ax, ay, az, P[b * 3], P[b * 3 + 1], P[b * 3 + 2], f, f * 0.96, f * 0.94);
              changing++;
            }
          }
        }
      }
      linkGeo.setDrawRange(0, segs * 2);
      linkGeo.attributes.position.updateRange.count = segs * 6;
      linkGeo.attributes.color.updateRange.count = segs * 6;
      linkGeo.attributes.position.needsUpdate = true;
      linkGeo.attributes.color.needsUpdate = true;

      // THE PULSES, on the one galaxy's links and then the accords'.
      const onGal = ph.move > 0.5;
      const pulseStrength = (onGal ? ph.apart : ph.one) * intro;
      for (let k = 0; k < PULSES; k++) {
        const p = pulse[k];
        if (!still) p.t += dt * p.rate;
        if (p.t > 1) { p.t = 0; p.one = Math.floor(rnd() * oneLinks.length); p.gal = Math.floor(rnd() * galLinks.length); p.back = rnd() < 0.5; }
        const l = onGal ? galLinks[p.gal] : oneLinks[p.one];
        const a = p.back ? l[1] : l[0], b = p.back ? l[0] : l[1];
        pulsePos[k * 3] = lerp(P[a * 3], P[b * 3], p.t);
        pulsePos[k * 3 + 1] = lerp(P[a * 3 + 1], P[b * 3 + 1], p.t);
        pulsePos[k * 3 + 2] = lerp(P[a * 3 + 2], P[b * 3 + 2], p.t);
        const f = pulseStrength * Math.min(opacity[a], opacity[b]) * Math.sin(Math.PI * p.t);
        pulseCol[k * 3] = (0.55 + colours[a * 3] * 0.45) * f;
        pulseCol[k * 3 + 1] = (0.55 + colours[a * 3 + 1] * 0.45) * f;
        pulseCol[k * 3 + 2] = (0.55 + colours[a * 3 + 2] * 0.45) * f;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      // THE HAZE along the arms.
      oneHaze.rotation.y = psi;
      oneHaze.material.opacity = 0.5 * ph.one * intro * (selected >= 0 || filter || hitSet.size ? 0.45 : 1);
      oneHaze.visible = ph.one > 0.01;
      const hazeIn = smooth(0.55, 1, u);
      accords.forEach((A) => {
        A.haze.visible = hazeIn > 0.01;
        if (!A.haze.visible) return;
        A.haze.position.copy(Cw[A.k]);
        A.haze.quaternion.copy(A.q).premultiply(qs.setFromAxisAngle(UP, psi));
        A.haze.material.opacity = 0.62 * hazeIn * (filter && filter !== A.code ? 0.3 : 1) * (selected >= 0 ? 0.6 : 1);
      });

      // THE RING the one galaxy turns in.
      oneRing.rotation.y = -psi * 1.6;
      oneRing.material.opacity = 0.7 * ph.one * intro * (selected >= 0 ? 0.5 : 1);
      oneRing.visible = ph.one > 0.01;

      // THE CENTRE, and the bridges out from it.
      hub.visible = ph.centre > 0.01;
      if (hub.visible) {
        const s = 0.2 + 0.8 * ph.centre;
        hub.scale.setScalar(s);
        hubCage.rotation.set(t * 0.0004, t * 0.0006, 0);
        hubRing.rotation.set(0.5, t * 0.0003, 0);
        hubRing2.rotation.set(Math.PI / 2, 0, t * -0.00025);
        const lit = overHub ? 1.5 : 1;
        hubCage.material.opacity = 0.8 * ph.centre * lit;
        hubGlow.material.opacity = 0.9 * ph.centre * lit;
      }
      const reach = ph.bridges;
      for (let k = 0; k < A16; k++) {
        const A = accords[k];
        const to = Cw[k];
        const len = to.length();
        v1.copy(to).multiplyScalar(len > 0 ? 0.75 / len : 0);             // out from the centre's cage
        v2.copy(to).multiplyScalar(len > 0 ? (len - 0.3) / len : 0);       // to the galaxy's core
        v2.lerp(v1, 1 - reach);
        const o = k * 6;
        bridgePos[o] = v1.x; bridgePos[o + 1] = v1.y; bridgePos[o + 2] = v1.z;
        bridgePos[o + 3] = v2.x; bridgePos[o + 4] = v2.y; bridgePos[o + 5] = v2.z;
        const lit = (overBridge === k || focus === k ? 1.8 : 1) * reach * (selected >= 0 ? 0.5 : 1) * (filter && filter !== A.code ? 0.35 : 1);
        bridgeCol[o] = 0.85 * lit; bridgeCol[o + 1] = 0.8 * lit; bridgeCol[o + 2] = 0.8 * lit;
        bridgeCol[o + 3] = A.colour.r * 0.9 * lit; bridgeCol[o + 4] = A.colour.g * 0.9 * lit; bridgeCol[o + 5] = A.colour.b * 0.9 * lit;
        for (let j = 0; j < BP; j++) {
          const w = ((still ? 0 : t) * 0.00016 * (overBridge === k ? 2.5 : 1) + j / BP + k * 0.13) % 1;
          const x = j % 2 ? 1 - w : w;
          const q = (k * BP + j) * 3;
          bpPos[q] = lerp(v1.x, v2.x, x); bpPos[q + 1] = lerp(v1.y, v2.y, x); bpPos[q + 2] = lerp(v1.z, v2.z, x);
          const f = reach * Math.sin(Math.PI * x) * (overBridge === k ? 1.4 : 0.8);
          bpCol[q] = lerp(1, A.colour.r, x) * f; bpCol[q + 1] = lerp(0.9, A.colour.g, x) * f; bpCol[q + 2] = lerp(0.9, A.colour.b, x) * f;
        }
        // Its core and the ring its galaxy turns in.
        const show = ph.apart;
        A.core.visible = A.ring.visible = show > 0.01;
        if (show > 0.01) {
          A.core.position.copy(Gw[k]);
          A.core.rotation.set(t * 0.0009, t * 0.0012 + k, 0);
          A.core.material.opacity = 0.9 * show;
          A.core.scale.setScalar(overBridge === k ? 1.5 : 1);
          A.ring.position.copy(Gw[k]);
          A.ring.quaternion.copy(A.q).premultiply(qs.setFromAxisAngle(UP, psi));
          const ping = A.pingAt ? (t - A.pingAt) / 1600 : 1;
          A.ring.scale.setScalar(A.r * 1.12 * (ping < 1 ? 1 + ping * 0.3 : 1));
          A.ring.material.opacity = (ping < 1 ? 0.35 + (1 - ping) * 0.6 : 0.35) * show * (filter && filter !== A.code ? 0.3 : 1);
        }
      }
      bridges.visible = bridgePulses.visible = reach > 0.01;
      bridgeGeo.attributes.position.needsUpdate = true;
      bridgeGeo.attributes.color.needsUpdate = true;
      bpGeo.attributes.position.needsUpdate = true;
      bpGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
      chrome(t);

      setData(stage, "u", u.toFixed(3));
      setData(stage, "dim", String(dim));
      setData(stage, "changing", String(changing));
      setData(stage, "yaw", cam.yaw.toFixed(2));
      setData(stage, "pitch", cam.pitch.toFixed(2));
      record(performance.now() - began, t);
      return settling || u !== uTo || !!flight || !!drag || !!spinYaw || !!spinPitch || t - born < 1400 || tagsMoving;
    }
    const radiusOf = (i) => Math.min(1, Math.hypot(notes[i].c[0], notes[i].c[2]) / CENTRAL_R);

    // ============================================================
    // THE CHROME, each frame: the galaxies' names, the notes' names, the
    // card's line, the labels under the hand. Moved by transform and
    // faded by opacity only; a size is measured once, when it changes.
    // ============================================================
    let tagsMoving = false;
    // WRITTEN ONLY WHEN IT CHANGES: a name standing still, or gone, costs
    // the browser nothing.
    const move = (el, x, y) => {
      const v = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      if (el._at !== v) { el._at = v; el.style.transform = v; }
    };
    const fadeTo = (el, o) => {
      const v = o < 0.004 ? "0" : o.toFixed(3);
      if (el._o !== v) { el._o = v; el.style.opacity = v; }
    };
    const setData = (el, key, v) => { if (el.dataset[key] !== v) el.dataset[key] = v; };
    /** Whether a box on the window stands under the window on the right or
        the foot, where a name would be read through them. */
    function covered(x, y, w, h) {
      const r = room();
      if (r && x + w > W - r - 6) return true;
      const mid = W / 2 - r / 2, half = W < 700 ? W : 200;
      return y + h > H - foot() && x + w > mid - half && x < mid + half;
    }
    function chrome(t) {
      const s = scale();
      // First whatever changes its words; then every size read at once;
      // then nothing but writing — so the browser lays the page out at
      // most once in a frame, and usually not at all.
      tags.forEach((g) => {
        if (g.next !== undefined && (g.show < 0.02 || g.note < 0)) {
          g.note = g.next;
          g.next = undefined;
          g.w = 0;
          if (g.note >= 0) g.el.textContent = notes[g.note].name;
        }
      });
      accords.forEach((A) => { const L = A.label; if (!L.w) { L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; } });
      tags.forEach((g) => { if (!g.w && g.note >= 0) { g.w = g.el.offsetWidth; g.h = g.el.offsetHeight; } });
      if (selected >= 0 && !card.hidden && !card.w) {
        const b = card.getBoundingClientRect(), o = stage.getBoundingClientRect();
        card.w = b.width; card.h = b.height; card.x = b.left - o.left; card.y = b.top - o.top;
      }
      // The galaxies' names, once apart.
      const namesOn = ph.apart;
      const boxes = [];
      accords.forEach((A) => {
        const L = A.label;
        let show = namesOn * (focus === A.k && !flight ? 0 : 1);
        const p = project(Gw[A.k].x, Gw[A.k].y, Gw[A.k].z);
        const x = toX(p), y = toY(p);
        const d = camera.position.distanceTo(Gw[A.k]);
        if (p.z > 1) show = 0;
        const below = (A.r * 0.8 * s) / Math.max(1, d) + 10;
        const bx = x - L.w / 2, by = y + below;
        if (covered(bx, by, L.w, L.h)) show = 0;
        // Of two that would touch, the further one steps back.
        if (show > 0) {
          for (const o of boxes) {
            if (bx < o[0] + o[2] + 6 && o[0] < bx + L.w + 6 && by < o[1] + o[3] + 4 && o[1] < by + L.h + 4) { show *= 0.18; break; }
          }
          if (show > 0.5) boxes.push([bx, by, L.w, L.h]);
        }
        show *= filter && filter !== A.code ? 0.45 : 1;
        L.show += (show - L.show) * (still ? 1 : 0.2);
        move(L.el, bx, by);
        fadeTo(L.el, L.show);
        const on = L.show > 0.3;
        if (on !== L.on) { L.on = on; L.el.classList.toggle("is-on", on); }
      });
      // The notes' names.
      tagsMoving = false;
      const cx = W / 2;
      tags.forEach((g) => {
        let show = g.note >= 0 && g.next === undefined ? 1 : 0;
        if (g.note >= 0) {
          const i = g.note;
          const p = project(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
          const x = toX(p), y = toY(p);
          if (p.z > 1) show = 0;
          const right = x >= cx, gap = 10;
          const gx = right ? x + gap : x - gap - g.w;
          g.box = [gx, y - 8, g.w, g.h];
          if (covered(gx, y - 8, g.w, g.h)) show = 0;
          show *= opacity[i] > 0.5 ? 1 : 0.2;
          show *= flight ? 0 : 1;
          show *= uTo === 0 ? 1 - ph.white : ph.apart;
          if (i === selected || i === hovered) show = 0;
          move(g.el, gx, y - 8);
        }
        g.want = show;
      });
      tags.forEach((g, a) => {
        if (g.want <= 0.01 || !g.box) return;
        for (let b = 0; b < a; b++) {
          const o = tags[b];
          if (o.want <= 0.01 || !o.box) continue;
          const [x1, y1, w1, h1] = g.box, [x2, y2, w2, h2] = o.box;
          if (x1 < x2 + w2 + 4 && x2 < x1 + w1 + 4 && y1 < y2 + h2 + 3 && y2 < y1 + h1 + 3) { g.want = 0; break; }
        }
      });
      tags.forEach((g) => {
        const next = g.show + (g.want - g.show) * (still ? 1 : 0.16);
        g.show = Math.abs(next - g.want) < 0.01 ? g.want : next;
        if (g.show !== g.want || g.next !== undefined) tagsMoving = true;
        fadeTo(g.el, g.show);
      });
      // The card's line to its note.
      if (selected >= 0 && !card.hidden) {
        const i = selected;
        const p = project(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
        const x = toX(p), y = toY(p);
        const fromX = card.x + card.w, fromY = clamp(y, card.y + 14, card.y + card.h - 14);
        const phone = W < 700;
        leaderLine.setAttribute("x1", phone ? String(x) : fromX.toFixed(1));
        leaderLine.setAttribute("y1", phone ? String(card.y) : fromY.toFixed(1));
        leaderLine.setAttribute("x2", x.toFixed(1));
        leaderLine.setAttribute("y2", y.toFixed(1));
        leaderDot.setAttribute("cx", x.toFixed(1));
        leaderDot.setAttribute("cy", y.toFixed(1));
        leader.classList.toggle("is-on", p.z < 1);
      } else {
        leader.classList.remove("is-on");
        card.w = 0;
      }
      // Under the hand.
      if (hovered >= 0 && !flight && hovered !== selected) {
        const n = notes[hovered];
        hoverTag.textContent = n.sym + " · " + n.name + " · " + n.A.code;
        const i = hovered;
        const p = project(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
        move(hoverTag, toX(p) + 14, toY(p) + 10);
        hoverTag.classList.add("is-on");
      } else hoverTag.classList.remove("is-on");
      if ((overBridge >= 0 || overHub) && !flight && hand) {
        const k = overBridge;
        bridgeTag.textContent = overHub ? "The centre — see every accord" :
          focus === k ? "Back to the centre ←" : "Go to " + pad(k + 1) + " · " + accords[k].name + " →";
        move(bridgeTag, hand.x + 16, hand.y - 30);
        bridgeTag.classList.add("is-on");
      } else bridgeTag.classList.remove("is-on");
    }
    window.addEventListener("resize", () => { card.w = 0; });
    card.addEventListener("animationend", () => { card.w = 0; });
    // The names measured again once the page's own faces have arrived.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      accords.forEach((A) => { A.label.w = 0; });
      tags.forEach((g) => { g.w = 0; });
      card.w = 0;
      wake();
    });

    // ============================================================
    // HOW QUICK EACH FRAME IS — and, if the frames come too slowly for
    // sixty a second, drawing at a lower resolution rather than dropping
    // them.
    // ============================================================
    const took = new Float32Array(240), gaps = new Float32Array(90);
    let tookN = 0, gapN = 0, lastFrame = 0;
    function record(ms, t) {
      took[tookN++ % took.length] = ms;
      if (lastFrame && t - lastFrame < 200) gaps[gapN++ % gaps.length] = t - lastFrame;
      lastFrame = t;
      if (gapN >= gaps.length && gapN % 30 === 0 && quality > 0.6) {
        const sorted = Array.from(gaps).sort((a, b) => a - b);
        if (sorted[gaps.length >> 1] > 21) { quality = Math.max(0.6, quality - 0.15); gapN = 0; size(); }
      }
    }

    function loop(t) {
      raf = 0;
      const busy = frame(t);
      // (A frame that asked for another itself — by resizing — has one.)
      if ((!still || busy) && !raf) raf = requestAnimationFrame(loop);
      else if (!raf) lastFrame = 0;
    }
    function wake() { if (!raf) raf = requestAnimationFrame(loop); }
    document.addEventListener("visibilitychange", () => { lastT = 0; lastFrame = 0; if (!document.hidden) wake(); });

    // FOR THE TESTS: where things are on the window, and what state it is in.
    const onScreen = (v) => { scene.updateMatrixWorld(); const p = project(v.x, v.y, v.z); return { x: toX(p), y: toY(p), z: p.z }; };
    window.NetScene = {
      state: () => ({
        u, state: stage.dataset.state, focus: focus < 0 ? "centre" : accords[focus].code, flying: !!flight,
        selected: selected >= 0 ? notes[selected].name : null, filter, query: query.value, hits: hits.map((n) => n.name),
        dim: Array.from(opacity).filter((o) => o < 0.5).length, faintest: Math.min(...opacity),
        changing, segments: segs, quality, panel: panelOpen, target: cam.T.length(), pitch: cam.pitch, yaw: cam.yaw,
      }),
      notes: () => notes.map((n) => ({ id: n.id, name: n.name, sym: n.sym, no: n.no, uses: n.uses, code: n.A.code })),
      accords: () => accords.map((A) => ({ code: A.code, name: A.name, count: A.notes.length, hue: A.hue })),
      note: (name) => {
        const n = notes.find((x) => x.name === name);
        if (!n) return null;
        const i = n.i;
        const p = onScreen(new THREE.Vector3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]));
        return { ...p, i, code: n.A.code, opacity: opacity[i], colour: [colours[i * 3], colours[i * 3 + 1], colours[i * 3 + 2]] };
      },
      galaxy: (code) => { const A = accords.find((x) => x.code === code); return A && { ...onScreen(Gw[A.k]), spread: Cw[A.k].distanceTo(Gw[A.k]), at: Gw[A.k].toArray(), r: A.r }; },
      centre: () => onScreen(new THREE.Vector3()),
      bridge: (code) => {
        const A = accords.find((x) => x.code === code);
        if (!A) return null;
        const a = onScreen(new THREE.Vector3()), b = onScreen(Gw[A.k]);
        return { a, b, at: { x: a.x + (b.x - a.x) * 0.5, y: a.y + (b.y - a.y) * 0.5 } };
      },
      stats: () => {
        const n = Math.min(tookN, took.length);
        const list = Array.from(took.slice(0, n)).sort((a, b) => a - b);
        return { frames: tookN, mean: list.reduce((a, b) => a + b, 0) / Math.max(1, n), p95: list[Math.floor(n * 0.95)] || 0, max: list[n - 1] || 0 };
      },
      reset: () => { tookN = 0; },
    };

    // EVERY DRAWING'S PROGRAM MADE NOW, and not the first time it is shown
    // — which would be one long frame just as the library comes apart.
    const unseen = [];
    scene.traverse((o) => { if (!o.visible) { unseen.push(o); o.visible = true; } });
    renderer.compile(scene, camera);
    unseen.forEach((o) => { o.visible = false; });

    if ("ResizeObserver" in window) new ResizeObserver(size).observe(stage);
    else window.addEventListener("resize", size);
    say();
    size();
    tagsFor();
    stage.classList.add("is-drawn");
    wake();
  }
})();

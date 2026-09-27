// ============================================================
// THE NOTE LIBRARY AS NETWORKS — works/test-page.html (the test page)
//
// The test page began (2026-09-26) as the owner's picture of a dense red
// network standing for nothing, became five glowing systems, and then
// (the evening of 2026-09-27) the Note Library in three dimensions — one
// red galaxy of every note that came apart into a galaxy for each accord.
// Then, the same night:
//
//   "I want you to make it red regardless, screw the colouring (test
//   page). I also want them to be less of galaxies and more true to their
//   original form: like complex networks of nodes and connections. I want
//   it to look more like before you made it into a galaxy. I have added a
//   picture, but i want it more red and glowing. I want nothing to be
//   selectable in the main galaxy before the expansion. once the
//   expansion occurs, I want there to be several galaxies for the accords
//   ... each to have main nodes which are the notes (labeleld), and some
//   other arbitraty spheres or nodes that lead to nothing and cannot be
//   clicked ... give importance to the clickable ones.
//   I like the way you have made each of the galaxies have a center and a
//   central node; keep that, but truly make it a node. I also want the
//   galaxies not to be equidistant from the central galaxy after
//   expansion ... IN REALITY I WANT THEM TO BE COMPLEX NETWORKS WITH
//   CONNECTIONS AND GEOMETRICS AND WHATNOT ... I also want there to be a
//   signal travelling to all the connections from the central node to the
//   differnet netweorks when expanded. I also want them all tobe slightly
//   different than one another structurally. But most importantly, i want
//   them to be quite dense in nodes and connections.
//   I also like that when you hover the accord on the right, it lights up
//   in isolation. keep that. but make the window on the right less techy
//   ... minimalist, geometric and simple (with particles!).
//   I also want you to keep the transition COLOURS from the expansion.
//   Otherwise, i want you to make it a little more chaotic ... create
//   additional nodes and connections for each of the clusters so that
//   they will appear dense when inspected. Additionally, I want you to
//   move the bar on the right hand side to the left."
//
// So:
//
//   THE LIBRARY is still read off the Note Library's own page
//   (categories/note-library.html) and notes-data.js: every accord, every
//   note, what it is, how many fragrances use it, its number and symbol.
//
//   ONE RED NETWORK to begin with, after the owner's picture: every note a
//   glowing red node, among them the network's own FILLERS — smaller dark
//   red nodes, pale ones and grey specks that stand for nothing — all
//   joined to their nearest, the busiest sending lines out all over, a few
//   far out tied back in by long ones. Each accord is a knot of it, the
//   knots run together. Nothing in it answers the hand: it is one thing,
//   until it comes apart.
//
//   EXPANDING (the button at the foot): every node goes WHITE with links
//   between the nodes of each accord that change as they move — the
//   colours the owner asked to keep — and, a little chaotic, each node
//   flies out on a path of its own, at a moment of its own, shaken as it
//   goes, to its accord's own network, which grows more nodes and more
//   links as it forms; then they go red again. Every accord's network is
//   built differently (a knot, a long one, twins, a shell, a flat one, a
//   ring), stands at a distance of its own from the centre, and has at its
//   middle A TRUE NODE of its own, in a cage, joined to the network. The
//   centre is the library's own centre (the owner's picture 2): a white
//   node in a turning cage, joined to every network's node by a bridge,
//   and from it A SIGNAL goes out along every bridge, over and over, and
//   on arriving runs through the whole network, link by link.
//
//   THE NOTES are the nodes that matter: larger, brighter, glowing, each
//   NAMED where you are, and the only ones that answer the hand once it
//   has come apart — pressed, every other node turns translucent and the
//   card on the right says what it is. The fillers do not answer at all.
//
//   GOING BETWEEN ACCORDS is as it was: the dropdown at the foot with an
//   arrow either side, the keyboard, the names, the bridges, the window,
//   every journey bending through the centre.
//
//   THE WINDOW is on the left now, minimal: the library's name, a small
//   ring of specks — one for every note, the accords round it in turn —
//   the switch that opens the search in the window itself, and the
//   accords, each lighting up alone under the hand.
//
// SIXTY FRAMES A SECOND, as before: every node, link and speck written in
// place in a handful of buffers, every program compiled before it is
// first shown, the chrome moved by transform and opacity only, and a lower
// resolution where the frames come too slowly.
//
// Three.js r128, from the same address as the home page's map, with one
// small addition to the library's own shader (`perNode`: each sphere's
// own opacity). Without the library, or without the Note Library's page,
// the page says so. With reduced motion nothing turns, shakes or signals
// on its own, and expanding, collapsing and every journey are made at
// once.
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
  const REDS = [0xff3a44, 0xf2404b, 0xff525b, 0xe8323d, 0xff6168];   // the notes
  const DARKS = [0xc22a34, 0xd0313b, 0xb3222c, 0xc93a43, 0xa9242d];   // the fillers
  const PALES = [0xf4dcdc, 0xe9c9c9, 0xffe8e6];                       // a few pale ones, as the picture has
  const SPECK = 0x8e8784;                                              // and grey specks
  const LINE = [1, 0.34, 0.38];                                        // a link, red
  const FRAME_RED = 0x9a3b41;

  // THE ONE NETWORK
  const ONE_R = 5.2;                    // how far its body reaches
  const ONE_GAP = 0.2;                  // no two nodes nearer than this
  const BASE_SHARE = 0.25;              // of an accord's fillers, how many are in it already
  // THE ACCORDS' NETWORKS
  const REACH = [11, 24];               // from the centre: each at a distance of its own
  const NET_GAP = 0.15;
  const FILL_PER_NOTE = 4.2, FILL_MORE = 80;   // an accord's fillers: dense
  const TYPES = ["knot", "long", "twin", "shell", "flat", "ring"];
  // THE CHANGING LINKS while white: every pair of an accord nearer than this.
  const LINK_REACH = 0.6;
  const MAX_SEGMENTS = 26000;
  // Nearer the lens than this (squared), a node is let go: 3 to 8.5 units.
  const NEAR_IN = 9, NEAR_OUT = 72;

  const EXPAND_MS = 3800;               // coming apart, and back together
  const FLY_MS = 2100;
  const FLY_NEAR_MS = 1500;
  const FADE_RATE = 0.0072;             // translucency, eased: gone in ~0.5s
  const GHOST = 0.1;
  const SPIN = 0.00008;                 // the one network's turn, radians a ms
  const NET_SPIN = 0.00014;             // each accord's
  const DRAG = 0.0056;
  const PITCH_MAX = 1.45;
  const ONE_PITCH = 0.36, APART_PITCH = 0.2;
  const PULSES = 140;
  // THE SIGNAL from the centre: how often, how fast along a bridge (units
  // a ms), how long a link takes to pass it on, how long a link stays lit.
  const SIGNAL_EVERY = 3600, SIGNAL_SPEED = 0.016, HOP = 85, SIGNAL_WIDTH = 70;

  // Seeded, so it is the same library every time.
  let seed = 7240928;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
  const between = (a, b) => a + rnd() * (b - a);
  const pick = (list) => list[Math.floor(rnd() * list.length)];
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
    const byUse = (a, b) => b.uses - a.uses || a.no - b.no;
    accords.forEach((A, k) => {
      A.k = k;
      A.notes.forEach((n) => {
        const keys = new Set();
        [n.name].concat(n.aka).forEach((s) => (uses.get(s.toLowerCase()) || []).forEach((key) => keys.add(key)));
        n.A = A;
        n.no = notes.length + 1;
        n.sym = symbolFor(n.name);
        n.uses = keys.size;
        notes.push(n);
      });
      A.byUse = A.notes.slice().sort(byUse);
    });
    const NOTE_COUNT = notes.length;
    const A16 = accords.length;
    const UP = new THREE.Vector3(0, 1, 0);

    // ============================================================
    // EVERY NODE: the notes, and each accord's fillers — dark red nodes,
    // a few pale ones and grey specks, standing for nothing. Some fillers
    // are in the one network already; the rest are MADE AS IT COMES
    // APART, so that each accord's network is dense when you are at it.
    // ============================================================
    const nodes = [];
    accords.forEach((A) => {
      A.members = [];
      A.notes.forEach((n) => {
        n.i = nodes.length;
        const node = { i: nodes.length, A, note: n, kind: 0, spawn: false, size: 0.092 + 0.02 * Math.sqrt(n.uses) };
        nodes.push(node);
        A.members.push(node);
      });
      const F = Math.round(A.notes.length * FILL_PER_NOTE + FILL_MORE);
      for (let f = 0; f < F; f++) {
        const r = rnd();
        const kind = r < 0.72 ? 1 : r < 0.86 ? 2 : 3;
        const size = kind === 1 ? between(0.032, 0.076) : kind === 2 ? between(0.034, 0.068) : between(0.016, 0.026);
        const node = { i: nodes.length, A, note: null, kind, spawn: rnd() > BASE_SHARE, size };
        nodes.push(node);
        A.members.push(node);
      }
    });
    const T = nodes.length;
    nodes.forEach((node) => {
      // CHAOS: when it sets off, the shake it goes with, how its path bends.
      node.delay = rnd() * 0.26;
      node.amp = between(0.3, 1.3);
      node.f = [between(1.2, 3.2), between(1.2, 3.2), between(1.2, 3.2)];
      node.ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
      node.bend = new THREE.Vector3(gauss(), gauss() * 0.7, gauss()).multiplyScalar(between(1, 3.4));
      node.born = between(0.3, 0.66);           // when a made node appears
      // ... and where from: thrown in from somewhere near, to its place.
      node.scatter = new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(between(1.2, 3.8));
      node.base = node.kind === 0 ? pick(REDS) : node.kind === 1 ? pick(DARKS) : node.kind === 2 ? pick(PALES) : SPECK;
    });
    stage.dataset.notes = String(NOTE_COUNT);
    stage.dataset.nodes = String(T);
    stage.dataset.accords = String(A16);

    // A spatial hash, so that placing a thousand nodes apart is quick.
    function spacer(gap) {
      const cells = new Map();
      const key = (x, y, z) => x + "," + y + "," + z;
      const g2 = gap * gap;
      return {
        free(p) {
          const cx = Math.floor(p[0] / gap), cy = Math.floor(p[1] / gap), cz = Math.floor(p[2] / gap);
          for (let x = cx - 1; x <= cx + 1; x++) for (let y = cy - 1; y <= cy + 1; y++) for (let z = cz - 1; z <= cz + 1; z++) {
            const list = cells.get(key(x, y, z));
            if (!list) continue;
            for (const o of list) {
              const dx = o[0] - p[0], dy = o[1] - p[1], dz = o[2] - p[2];
              if (dx * dx + dy * dy + dz * dz < g2) return false;
            }
          }
          return true;
        },
        add(p) {
          const k = key(Math.floor(p[0] / gap), Math.floor(p[1] / gap), Math.floor(p[2] / gap));
          if (!cells.has(k)) cells.set(k, []);
          cells.get(k).push(p);
        },
      };
    }

    // ============================================================
    // THE ONE NETWORK: every accord a knot round a home of its own, the
    // homes spread through one body so that the knots run together — a
    // dense middle, a looser body, a few far out.
    // ============================================================
    const oneSpace = spacer(ONE_GAP);
    accords.forEach((A, k) => {
      // Its home: spread through the body (a Fibonacci spiral, jittered).
      const y = 1 - (2 * (k + 0.5)) / A16;
      const r = Math.sqrt(1 - y * y), a = k * 2.39996 + rnd() * 0.4;
      const d = between(1.4, 3.1);
      A.home = new THREE.Vector3(Math.cos(a) * r * d, y * d * 0.62, Math.sin(a) * r * d);
      A.spread = between(0.95, 1.35);
      const inIt = A.members.filter((m) => !m.spawn);
      inIt.forEach((m) => {
        for (let tries = 0; ; tries++) {
          let p;
          const far = m.kind !== 0 && rnd() < 0.07;
          if (far) {
            const dir = new THREE.Vector3(gauss(), gauss() * 0.7, gauss()).normalize();
            const dist = between(ONE_R * 0.85, ONE_R * 1.35);
            p = [dir.x * dist, dir.y * dist, dir.z * dist];
          } else {
            const s = A.spread * (m.kind === 0 ? 0.85 : 1.1) * (1 + tries * 0.002);
            p = [A.home.x + gauss() * s, A.home.y + gauss() * s * 0.78, A.home.z + gauss() * s];
          }
          if (oneSpace.free(p) || tries > 600) { oneSpace.add(p); m.c = new THREE.Vector3(...p); break; }
        }
      });
      A.centroid = new THREE.Vector3();
      inIt.forEach((m) => A.centroid.add(m.c));
      A.centroid.divideScalar(Math.max(1, inIt.length));
    });

    // ============================================================
    // EACH ACCORD'S OWN NETWORK — built its own way (`TYPES`), dense, with
    // its notes spread through it from the middle out, the most used
    // nearest the middle; and where it stands: out the way its knot lay,
    // at a distance of its own.
    // ============================================================
    function shape(type, m, R) {
      const pts = [];
      const space = spacer(NET_GAP);
      const axis = new THREE.Vector3(gauss(), gauss() * 0.5, gauss()).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
      const v = new THREE.Vector3();
      for (let tries = 0; pts.length < m; tries++) {
        const t = rnd();
        switch (type) {
          case "knot":
            if (t < 0.3) v.set(gauss() * 0.28, gauss() * 0.24, gauss() * 0.28);
            else if (t < 0.86) v.set(gauss() * 0.55, gauss() * 0.45, gauss() * 0.55);
            else v.set(gauss(), gauss() * 0.7, gauss()).normalize().multiplyScalar(between(0.95, 1.35));
            break;
          case "long":
            v.set(gauss() * 0.95, gauss() * 0.28, gauss() * 0.3);
            if (t > 0.9) v.multiplyScalar(1.3);
            break;
          case "twin": {
            const side = t < 0.5 ? -1 : 1;
            v.set(side * 0.55 + gauss() * 0.3, gauss() * 0.3, gauss() * 0.3);
            if (t > 0.46 && t < 0.54) v.set(gauss() * 0.3, gauss() * 0.2, gauss() * 0.2);
            break;
          }
          case "shell":
            if (t < 0.2) v.set(gauss() * 0.25, gauss() * 0.25, gauss() * 0.25);
            else v.set(gauss(), gauss(), gauss()).normalize().multiplyScalar(between(0.62, 0.9));
            break;
          case "flat":
            v.set(gauss() * 0.62, gauss() * 0.12, gauss() * 0.62);
            if (t > 0.9) v.multiplyScalar(1.4);
            break;
          default: {                  // "ring"
            const a = rnd() * Math.PI * 2;
            v.set(Math.cos(a) * (0.7 + gauss() * 0.16), gauss() * 0.14, Math.sin(a) * (0.7 + gauss() * 0.16));
            if (t < 0.12) v.set(gauss() * 0.25, gauss() * 0.25, gauss() * 0.25);
          }
        }
        v.applyQuaternion(q).multiplyScalar(R);
        const p = [v.x, v.y, v.z];
        if (space.free(p) || tries > m * 400) { space.add(p); pts.push(new THREE.Vector3(...p)); }
      }
      return pts;
    }
    accords.forEach((A, k) => {
      A.type = TYPES[k % TYPES.length];
      const m = A.members.length;
      A.R = 1.1 + 0.2 * Math.sqrt(m);
      const pts = shape(A.type, m, A.R).sort((a, b) => a.length() - b.length());
      // The notes through it from the middle out; the fillers in between.
      const ranks = new Set();
      const n = A.byUse.length;
      A.byUse.forEach((note, j) => {
        let r = Math.floor((j * (m * 0.86)) / n);
        while (ranks.has(r)) r++;
        ranks.add(r);
        nodes[note.i].g = pts[r];
      });
      let at = 0;
      A.members.forEach((node) => {
        if (node.g) return;
        while (ranks.has(at)) at++;
        ranks.add(at);
        node.g = pts[at];
      });
      A.ext = Math.max(...A.members.map((node) => node.g.length()));   // how far it actually reaches
      A.spin = rnd() * Math.PI * 2;
      A.rate = NET_SPIN * between(0.7, 1.3) * (k % 3 === 1 ? -1 : 1);
      A.tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(gauss() * 0.4, rnd() * 6.28, gauss() * 0.4));
      A.q = new THREE.Quaternion();
    });
    // Where each stands: out the way its knot lay, a distance of its own,
    // and pushed apart until no two networks' reaches meet.
    accords.forEach((A) => {
      const dir = A.home.clone().setY(A.home.y * 1.4).normalize();
      A.G = dir.multiplyScalar(between(REACH[0], REACH[1]));
    });
    for (let pass = 0; pass < 60; pass++) {
      let moved = false;
      for (let a = 0; a < A16; a++) for (let b = a + 1; b < A16; b++) {
        const P1 = accords[a].G, P2 = accords[b].G;
        const need = (accords[a].R + accords[b].R) * 1.45 + 1.4;
        const d = P1.distanceTo(P2);
        if (d >= need) continue;
        const push = new THREE.Vector3().subVectors(P2, P1).normalize().multiplyScalar((need - d) / 2 + 0.05);
        P1.sub(push); P2.add(push);
        moved = true;
      }
      accords.forEach((A) => { const L = A.G.length(); A.G.setLength(clamp(L, REACH[0] * 0.9, REACH[1] * 1.15)); });
      if (!moved) break;
    }
    accords.forEach((A) => {
      A.out = A.G.clone().normalize();
      A.reach = A.G.length();
      A.side = new THREE.Vector3().crossVectors(UP, A.out);
      if (A.side.lengthSq() < 1e-4) A.side.set(1, 0, 0);
      A.side.normalize();
      // Arrived at, it is seen from the centre's side of it, a little
      // above — having come out along its bridge — alone against the stars.
      A.view = A.out.clone().negate().addScaledVector(UP, 0.42).addScaledVector(A.side, 0.24).normalize();
      A.swirl = new THREE.Vector3().crossVectors(UP, A.home);
      if (A.swirl.lengthSq() < 1e-6) A.swirl.set(1, 0, 0);
      A.swirl.normalize().multiplyScalar(-1);
    });

    // ============================================================
    // THE LINKS: each node to its nearest few, the busiest sending lines
    // out all over, the far ones tied back in — once for the one network,
    // once within each accord's; and each accord's middle node joined in.
    // ============================================================
    function linkUp(list, at, few, hubs, hubLinks, out) {
      const seen = new Set();
      const join = (a, b) => {
        if (a === b) return;
        const key = a < b ? a * 100000 + b : b * 100000 + a;
        if (seen.has(key)) return;
        seen.add(key);
        out.push([a, b]);
      };
      // Each to its nearest few: the few kept as it goes, nothing sorted.
      const best = new Float64Array(8), who = new Int32Array(8);
      list.forEach((a) => {
        const k = few[0] + Math.floor(rnd() * (few[1] - few[0] + 1));
        let have = 0;
        const pa = at(a);
        list.forEach((b) => {
          if (b === a) return;
          const d = pa.distanceToSquared(at(b));
          if (have === k && d >= best[k - 1]) return;
          let j = have < k ? have++ : k - 1;
          while (j > 0 && best[j - 1] > d) { best[j] = best[j - 1]; who[j] = who[j - 1]; j--; }
          best[j] = d; who[j] = b.i;
        });
        for (let j = 0; j < have; j++) join(a.i, who[j]);
      });
      hubs.forEach((h) => {
        const n = hubLinks[0] + Math.floor(rnd() * (hubLinks[1] - hubLinks[0] + 1));
        for (let j = 0, tries = 0; j < n && tries < n * 30; tries++) {
          const b = list[Math.floor(rnd() * list.length)];
          if (b === h) continue;
          if (rnd() < Math.min(1, 0.25 + at(h).distanceTo(at(b)) * 0.18)) { join(h.i, b.i); j++; }
        }
      });
      return out;
    }
    const oneMembers = nodes.filter((n) => !n.spawn);
    const oneHubs = oneMembers.filter((n) => n.kind === 0).sort((a, b) => b.note.uses - a.note.uses).slice(0, 28);
    const oneLinks = linkUp(oneMembers, (n) => n.c, [2, 3], oneHubs, [6, 18], []);
    const netLinks = [];
    accords.forEach((A) => {
      const hubs = A.members.filter((n) => n.kind === 0).sort((a, b) => b.note.uses - a.note.uses).slice(0, 3 + (A.k % 4));
      A.hubs = hubs;
      const got = linkUp(A.members, (n) => n.g, [2, 4], hubs, [5, 12], []);
      A.links = got.length;
      got.forEach((l) => netLinks.push(l));
    });
    // Each accord's MIDDLE NODE, joined to the nodes nearest the middle and
    // to its busiest notes — the root the signal spreads from.
    accords.forEach((A) => {
      const nearest = A.members.slice().sort((a, b) => a.g.length() - b.g.length()).slice(0, 7);
      A.core = [...new Set(nearest.concat(A.hubs))].map((n) => n.i);
    });
    stage.dataset.links = String(oneLinks.length + netLinks.length);
    // How many links the signal takes to reach each node from the middle.
    const depth = new Int16Array(T).fill(99);
    const adjacent = nodes.map(() => []);
    netLinks.forEach(([a, b]) => { adjacent[a].push(b); adjacent[b].push(a); });
    accords.forEach((A) => {
      const queue = [];
      A.core.forEach((i) => { depth[i] = 1; queue.push(i); });
      for (let h = 0; h < queue.length; h++) {
        const i = queue[h];
        adjacent[i].forEach((j) => { if (depth[j] > depth[i] + 1) { depth[j] = depth[i] + 1; queue.push(j); } });
      }
    });
    // The links among the nodes MADE as it comes apart are there while it
    // does — so each network is dense on the way — the rest once it has.
    const netMade = [], netRest = [];
    netLinks.forEach((l) => (nodes[l[0]].spawn && nodes[l[1]].spawn ? netMade : netRest).push(l));
    const near = nodes.map(() => new Set());
    netLinks.forEach(([a, b]) => { near[a].add(b); near[b].add(a); });

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
    const rim = new THREE.DirectionalLight(0xffd0d0, 0.45);
    rim.position.set(4, -2, -3);
    scene.add(rim);

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
    // Added to what is behind it — and never to the canvas's own alpha, or
    // a glow gone dark would print black over the page.
    const additive = (extra) => Object.assign({
      transparent: true, depthWrite: false, blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneFactor,
      blendEquationAlpha: THREE.AddEquation, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    }, extra);
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
    const dynamic = (n, size) => new THREE.BufferAttribute(new Float32Array(n * size), size).setUsage(THREE.DynamicDrawUsage);

    // THE NODES: faceted spheres, lit, glowing from within in their own
    // colour, drawn twice over — whole (writing depth) and going or gone
    // translucent (not) — sharing one opacity per node.
    // perNode: the one addition to the library's shader — each node's own
    // opacity, and its glow from within taken in its own colour.
    const BALL = new THREE.IcosahedronGeometry(1, 1);
    const opacity = new Float32Array(T).fill(1);
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
      color: 0xffffff, emissive: 0x505050, roughness: 0.32, metalness: 0.28, flatShading: true,
    })), T);
    const faint = new THREE.InstancedMesh(BALL, perNode(new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0x505050, roughness: 0.4, metalness: 0.2, flatShading: true,
      transparent: true, depthWrite: false,
    })), T);
    const tint = new THREE.Color();
    for (let i = 0; i < T; i++) { solid.setColorAt(i, tint.set(nodes[i].base)); faint.setColorAt(i, tint); }
    faint.instanceColor = solid.instanceColor;
    solid.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    faint.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    solid.instanceColor.setUsage(THREE.DynamicDrawUsage);
    solid.frustumCulled = faint.frustumCulled = false;
    faint.renderOrder = 2;
    scene.add(solid, faint);
    // Each node's own red, as three numbers, for the arithmetic each frame.
    const baseRGB = new Float32Array(T * 3);
    nodes.forEach((n, i) => { const c = new THREE.Color(n.base); baseRGB[i * 3] = c.r; baseRGB[i * 3 + 1] = c.g; baseRGB[i * 3 + 2] = c.b; });

    // THE GLOW round every node but the specks, added to what is behind it.
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", dynamic(T, 3));
    glowGeo.setAttribute("color", dynamic(T, 3));
    const glow = new THREE.Points(glowGeo, new THREE.PointsMaterial(additive({ map: SPOT, size: 0.78, sizeAttenuation: true, vertexColors: true })));
    glow.frustumCulled = false;
    scene.add(glow);

    // THE LINKS — the one network's, the accords', the changing ones and
    // the middle nodes' — one set of lines, written each frame.
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", dynamic(MAX_SEGMENTS * 2, 3));
    linkGeo.setAttribute("color", dynamic(MAX_SEGMENTS * 2, 3));
    const linkPos = linkGeo.attributes.position.array, linkCol = linkGeo.attributes.color.array;
    const links = new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial(additive({ vertexColors: true })));
    links.frustumCulled = false;
    scene.add(links);

    // THE PULSES running along the links.
    const pulse = [];
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", dynamic(PULSES, 3));
    pulseGeo.setAttribute("color", dynamic(PULSES, 3));
    const pulses = new THREE.Points(pulseGeo, new THREE.PointsMaterial(additive({ map: SPOT, size: 0.16, sizeAttenuation: true, vertexColors: true })));
    pulses.frustumCulled = false;
    scene.add(pulses);
    for (let k = 0; k < PULSES; k++) pulse.push({ one: Math.floor(rnd() * oneLinks.length), net: Math.floor(rnd() * netLinks.length), t: rnd(), rate: 0.0003 + rnd() * 0.0006, back: rnd() < 0.5 });

    // THE FRAME the one network turns in, ticked.
    const ringR = ONE_R * 1.2;
    const ticks = [];
    for (let k = 0; k < 36; k++) {
      const a = (k / 36) * Math.PI * 2, l = k % 3 ? 0.08 : 0.24;
      ticks.push(Math.cos(a) * ringR, 0, Math.sin(a) * ringR, Math.cos(a) * (ringR + l), 0, Math.sin(a) * (ringR + l));
    }
    const oneRing = lines(circle(ringR, 160, true).concat(ticks), FRAME_RED, 0.6);
    scene.add(oneRing);

    // THE CENTRE (the owner's picture 2): a white node in a turning cage,
    // with two dashed rings.
    const hub = new THREE.Group();
    const hubBall = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36, 1), new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xffe8e8, emissiveIntensity: 0.55, roughness: 0.3, metalness: 0.3, flatShading: true,
    }));
    const hubCage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.78, 0)),
      new THREE.LineBasicMaterial(additive({ color: 0xffe0e0, opacity: 0.8 })));
    const hubRing = lines(circle(1.15, 72, true), 0xffc8c8, 0.6);
    const hubRing2 = lines(circle(1.3, 96, true), 0xffc8c8, 0.35);
    const hubGlow = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)),
      new THREE.PointsMaterial(additive({ map: SPOT, size: 3.2, color: 0xffd6d6, opacity: 0.9 })));
    hub.add(hubBall, hubCage, hubRing, hubRing2, hubGlow);
    hub.visible = false;
    scene.add(hub);

    // EACH ACCORD'S MIDDLE NODE — a true node: a red sphere, glowing, in a
    // turning cage — and the frame its network turns in.
    const CORE = new THREE.IcosahedronGeometry(0.2, 1);
    const CAGE = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.44));
    const UNIT_RING = circle(1, 90, true);
    const coreTicks = [];
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2, l = k % 6 ? 0.03 : 0.08;
      coreTicks.push(Math.cos(a), 0, Math.sin(a), Math.cos(a) * (1 + l), 0, Math.sin(a) * (1 + l));
    }
    accords.forEach((A) => {
      const g = new THREE.Group();
      A.coreBall = new THREE.Mesh(CORE, new THREE.MeshStandardMaterial({
        color: 0xff4a54, emissive: 0xff2a36, emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.3, flatShading: true, transparent: true,
      }));
      A.coreCage = new THREE.LineSegments(CAGE, new THREE.LineBasicMaterial(additive({ color: 0xff8a90, opacity: 0.9 })));
      A.coreGlow = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)),
        new THREE.PointsMaterial(additive({ map: SPOT, size: 1.6, color: 0xff5a63, opacity: 0.9 })));
      g.add(A.coreBall, A.coreCage, A.coreGlow);
      g.visible = false;
      scene.add(g);
      A.coreGroup = g;
      A.frame = lines(UNIT_RING.concat(coreTicks), FRAME_RED, 0);
      A.frame.visible = false;
      scene.add(A.frame);
      A.arrived = -1e9;
    });

    // THE BRIDGES from the centre to every accord's middle node, the pulses
    // on them, and THE SIGNAL going out along them.
    const bridgeGeo = new THREE.BufferGeometry();
    bridgeGeo.setAttribute("position", dynamic(A16 * 2, 3));
    bridgeGeo.setAttribute("color", dynamic(A16 * 2, 3));
    const bridges = new THREE.LineSegments(bridgeGeo, new THREE.LineBasicMaterial(additive({ vertexColors: true })));
    bridges.frustumCulled = false;
    scene.add(bridges);
    const BP = 3;
    const bpGeo = new THREE.BufferGeometry();
    bpGeo.setAttribute("position", dynamic(A16 * (BP + 1), 3));
    bpGeo.setAttribute("color", dynamic(A16 * (BP + 1), 3));
    const bridgePulses = new THREE.Points(bpGeo, new THREE.PointsMaterial(additive({ map: SPOT, size: 0.5, sizeAttenuation: true, vertexColors: true })));
    bridgePulses.frustumCulled = false;
    scene.add(bridgePulses);

    // Specks in the far air.
    const dust = [];
    for (let i = 0; i < 900; i++) {
      const v = new THREE.Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(45 + rnd() * 60);
      dust.push(v.x, v.y, v.z);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
    scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x8a8480, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55, fog: false })));

    // ============================================================
    // THE CHROME: the window on the left (with the search in it), the
    // foot, the card on the right, the names, the labels under the hand.
    // ============================================================
    const el = (tag, cls, html) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    };

    // THE WINDOW ON THE LEFT: minimal, geometric, with particles.
    const panel = el("aside", "net-panel");
    panel.setAttribute("aria-label", "The Note Library: search and accords");
    panel.innerHTML =
      '<div class="net-panel-head">' +
        '<p class="net-panel-title">Note Library</p>' +
        '<button type="button" class="net-fold" aria-expanded="true" aria-label="Fold the window away"><span aria-hidden="true"></span></button>' +
      "</div>" +
      '<p class="net-panel-count"><span class="net-panel-notes"></span> notes · <span class="net-panel-accords"></span> accords · <span class="net-panel-state"></span></p>' +
      '<canvas class="net-mark" aria-hidden="true"></canvas>' +
      '<div class="net-panel-row">' +
        '<span class="net-panel-label" id="net-search-label">Search</span>' +
        '<button type="button" class="net-switch" role="switch" aria-checked="false" aria-labelledby="net-search-label"><span aria-hidden="true"></span></button>' +
      "</div>" +
      '<form class="net-search" role="search" hidden>' +
        '<div class="net-search-field">' +
          '<input class="net-query" id="net-query" type="search" autocomplete="off" spellcheck="false" placeholder="a note, like cedar or tonka" aria-label="Search the notes">' +
          '<output class="net-count" aria-live="polite"></output>' +
          '<button type="button" class="net-clear" aria-label="Clear the search" disabled><span aria-hidden="true"></span></button>' +
        "</div>" +
        '<ul class="net-results" role="listbox" aria-label="Notes found"></ul>' +
      "</form>" +
      '<p class="net-panel-label net-panel-sub">Accords</p>' +
      '<div class="net-accords" role="group" aria-label="Choose an accord"></div>';
    stage.appendChild(panel);
    panel.querySelector(".net-panel-notes").textContent = String(NOTE_COUNT);
    panel.querySelector(".net-panel-accords").textContent = String(A16);
    const panelState = panel.querySelector(".net-panel-state");
    const list = panel.querySelector(".net-accords");
    const accordButton = (code, no, word, count) => {
      const b = el("button", "net-accord");
      b.type = "button";
      b.dataset.code = code;
      b.setAttribute("aria-pressed", code ? "false" : "true");
      if (!code) b.classList.add("is-on");
      b.innerHTML = '<span class="net-dot" aria-hidden="true"></span><span class="net-accord-no"></span><span class="net-accord-name"></span><span class="net-accord-count"></span>';
      b.querySelector(".net-accord-no").textContent = no;
      b.querySelector(".net-accord-name").textContent = word;
      b.querySelector(".net-accord-count").textContent = String(count);
      list.appendChild(b);
      return b;
    };
    const accordButtons = [accordButton("", "", "Every accord", NOTE_COUNT)];
    accords.forEach((A) => accordButtons.push(accordButton(A.code, pad(A.k + 1), A.name, A.notes.length)));
    const search = panel.querySelector(".net-search");
    const query = search.querySelector(".net-query");
    const countOut = search.querySelector(".net-count");
    const clearButton = search.querySelector(".net-clear");
    const results = search.querySelector(".net-results");
    const switcher = panel.querySelector(".net-switch");
    const markCanvas = panel.querySelector(".net-mark");
    const markCtx = markCanvas.getContext("2d");

    // THE FOOT: the button that expands it, and — once expanded — the
    // dropdown with an arrow either side.
    const dock = el("div", "net-dock");
    dock.innerHTML =
      '<div class="net-nav" aria-hidden="true">' +
        '<button type="button" class="net-step" data-step="-1" aria-label="The accord before" tabindex="-1"><span aria-hidden="true"></span></button>' +
        '<div class="net-drop">' +
          '<button type="button" class="net-drop-button" aria-haspopup="listbox" aria-expanded="false" tabindex="-1">' +
            '<span class="net-dot" aria-hidden="true"></span><span class="net-drop-say"></span><span class="net-drop-caret" aria-hidden="true"></span></button>' +
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
    const dropList = dock.querySelector(".net-drop-list");
    const options = [];
    const option = (k, text) => {
      const li = el("li", "net-drop-option");
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");
      li.dataset.to = String(k);
      li.innerHTML = '<span class="net-dot" aria-hidden="true"></span><span></span>';
      li.lastChild.textContent = text;
      dropList.appendChild(li);
      options.push(li);
    };
    option(-1, "The centre — every accord");
    accords.forEach((A) => option(A.k, pad(A.k + 1) + " · " + A.name));

    // THE CARD a selected note says itself in, on the right, and its line.
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

    // THE NAMES: one beside every accord's network once apart (a way
    // there), and every note of the one you are at named beside its node.
    const names = el("div", "net-names");
    stage.appendChild(names);
    accords.forEach((A) => {
      const b = el("button", "net-name");
      b.type = "button";
      b.tabIndex = -1;
      b.innerHTML = '<span class="net-name-no"></span><span class="net-name-word"></span>';
      b.children[0].textContent = pad(A.k + 1);
      b.children[1].textContent = A.name;
      b.dataset.code = A.code;
      b.setAttribute("aria-label", "Go to " + A.name);
      b.addEventListener("click", () => travel(A.k));
      names.appendChild(b);
      A.label = { el: b, w: 0, h: 0, show: 0, on: false };
    });
    const tagList = el("ol", "net-labels");
    tagList.setAttribute("aria-hidden", "true");
    stage.appendChild(tagList);
    const MOST = Math.max(...accords.map((A) => A.notes.length));
    const tags = [];
    for (let k = 0; k < MOST; k++) {
      const li = el("li", "net-label");
      tagList.appendChild(li);
      tags.push({ el: li, node: -1, show: 0, w: 0, h: 0 });
    }

    // ============================================================
    // STATE
    // ============================================================
    let u = 0, uTo = 0;                   // 0: one red network; 1: apart
    let focus = -1;                       // -1: the centre; or an accord's number
    let flight = null;
    let psi = 0;
    let filter = "", previewing = "";     // an accord chosen by hand; one under the hand
    let hits = [], hitSet = new Set();
    let selected = -1, hovered = -1, overBridge = -1, overHub = false;
    let panelOpen = window.innerWidth >= 700;
    let viewOff = 0, viewLift = 0, fitted = false;
    const cam = { T: new THREE.Vector3(), d: 20, yaw: 0.35, pitch: ONE_PITCH, zoom: 1 };
    let W = 1, H = 1, fitMin = 1;
    let dOne = 16, dAll = 60;
    let raf = 0, quality = 1;
    let signalAt = -1e9;                  // when the last signal left the centre
    let markDirty = true;
    let tagsMoving = false;

    // ============================================================
    // EVERY NODE'S PLACE, EACH FRAME: the layout, turned by psi.
    // ============================================================
    const P = new Float32Array(T * 3);
    const scaleOf = new Float32Array(T);  // a made node grows in, and out
    const vis = new Float32Array(T);      // ... and anything at the lens goes
    const empty = new Uint8Array(T);      // written empty, and left so
    const Gw = accords.map(() => new THREE.Vector3());
    const Cw = accords.map(() => new THREE.Vector3());
    const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
    const qs = new THREE.Quaternion();
    const rot = new THREE.Matrix4();
    let cosP = 1, sinP = 0;
    const turn = (v) => { const x = v.x, z = v.z; v.x = x * cosP + z * sinP; v.z = -x * sinP + z * cosP; return v; };
    const phase = () => ({
      white: smooth(0.02, 0.26, u) * (1 - smooth(0.62, 0.95, u)),    // red -> white -> red
      move: ease(clamp((u - 0.1) / 0.72, 0, 1)),
      changing: smooth(0.1, 0.28, u) * (1 - smooth(0.7, 0.9, u)),
      form: smooth(0.3, 0.62, u),                                   // the made nodes' own links
      shake: Math.sin(Math.PI * clamp((u - 0.08) / 0.8, 0, 1)),
      one: 1 - smooth(0, 0.18, u),
      apart: smooth(0.82, 1, u),
      centre: smooth(0.45, 0.8, u),
      bridges: smooth(0.55, 0.95, u),
    });
    let ph = phase();
    let clock = 0;
    function place() {
      cosP = Math.cos(psi); sinP = Math.sin(psi);
      const s = clock * 0.001;
      const shaking = ph.shake > 0.001 && !still;
      accords.forEach((A) => {
        A.q.setFromAxisAngle(UP, A.spin).premultiply(A.tilt);
        // The accord's own way out: from its knot to where its network
        // stands, bending the way the one network was turning.
        const m = ph.move, im = 1 - m;
        v1.copy(A.centroid).add(A.G).multiplyScalar(0.5).addScaledVector(A.swirl, 3.5);
        Cw[A.k].copy(A.centroid).multiplyScalar(im * im).addScaledVector(v1, 2 * im * m).addScaledVector(A.G, m * m);
        // Its turn as a matrix, once — then every node by plain arithmetic.
        const e = rot.makeRotationFromQuaternion(A.q).elements;
        const Gx = A.G.x, Gy = A.G.y, Gz = A.G.z, C = Cw[A.k], sw = A.swirl;
        const members = A.members;
        for (let j = 0; j < members.length; j++) {
          const n = members[j], i = n.i, g = n.g;
          const rx = e[0] * g.x + e[4] * g.y + e[8] * g.z;
          const ry = e[1] * g.x + e[5] * g.y + e[9] * g.z;
          const rz = e[2] * g.x + e[6] * g.y + e[10] * g.z;
          let x, y, z;
          if (n.spawn) {
            // MADE AS IT COMES APART: thrown in from somewhere near to its
            // place in the network as the network travels, growing in.
            const b = smooth(n.born, n.born + 0.22, u), ib = (1 - b) * (1 - b), sc = n.scatter;
            scaleOf[i] = b;
            if (b <= 0) continue;              // not made yet: nowhere
            x = rx + C.x + sc.x * ib; y = ry + C.y + sc.y * ib; z = rz + C.z + sc.z * ib;
          } else {
            // Its own way, a little chaotic: setting off at a moment of its
            // own, on a path bent its own way, to where it ends.
            const ex = rx + Gx, ey = ry + Gy, ez = rz + Gz;
            const mi = ease(clamp((u - 0.08 - n.delay) / 0.66, 0, 1));
            if (mi >= 1) { x = ex; y = ey; z = ez; }
            else {
              const im2 = 1 - mi, c = n.c, bd = n.bend;
              const a0 = im2 * im2, a1 = 2 * im2 * mi, a2 = mi * mi;
              x = c.x * a0 + ((c.x + ex) * 0.5 + bd.x + sw.x * 2.2) * a1 + ex * a2;
              y = c.y * a0 + ((c.y + ey) * 0.5 + bd.y + sw.y * 2.2) * a1 + ey * a2;
              z = c.z * a0 + ((c.z + ez) * 0.5 + bd.z + sw.z * 2.2) * a1 + ez * a2;
            }
            scaleOf[i] = 1;
          }
          // Shaken as it goes.
          if (shaking) {
            const a = n.amp * ph.shake;
            x += Math.sin(s * n.f[0] + n.ph[0]) * a;
            y += Math.sin(s * n.f[1] + n.ph[1]) * a * 0.8;
            z += Math.sin(s * n.f[2] + n.ph[2]) * a;
          }
          // Turned with the whole (psi).
          P[i * 3] = x * cosP + z * sinP; P[i * 3 + 1] = y; P[i * 3 + 2] = -x * sinP + z * cosP;
        }
        turn(Cw[A.k]);
        Gw[A.k].copy(A.G);
        turn(Gw[A.k]);
      });
    }

    // ============================================================
    // SEEING IT
    // ============================================================
    const room = () => (panelOpen && W >= 700 ? Math.min(320, W * 0.28) : 0);
    const foot = () => (uTo === 1 ? (W < 700 ? 150 : 132) : (W < 700 ? 90 : 78));
    const TOP = 24;
    const halfFov = () => {
      const t = Math.tan((camera.fov * Math.PI) / 360);
      const high = Math.atan(t * ((H - foot() - TOP) / Math.max(1, H)));
      return Math.min(high, Math.atan(t * ((W - room()) / Math.max(1, H))));
    };
    const fit = (r) => r / Math.sin(fitMin);
    function size() {
      W = stage.clientWidth; H = stage.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2) * quality);
      renderer.setSize(W, H, false);
      camera.aspect = W / Math.max(1, H);
      camera.updateProjectionMatrix();
      tags.forEach((g) => { g.w = 0; });
      accords.forEach((A) => { A.label.w = 0; });
      sizeMark();
      refit();
    }
    function refit() {
      if (!fitted) { fitted = true; viewOff = room() / 2; viewLift = (foot() - TOP) / 2; }
      fitMin = halfFov();
      dOne = fit(ONE_R * 1.08);
      dAll = fitApart(cam.yaw, APART_PITCH);
      accords.forEach((A) => { A.d = fit(A.R * 1.22); });
      wake();
    }
    /** How far back to stand to see every network at once, from where
        they actually stand. */
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
        const depthIn = g.dot(fwd);
        d = Math.max(d, (Math.abs(g.dot(right)) + A.ext) / th - depthIn, (Math.abs(g.dot(up)) + A.ext + 1.1) / tv - depthIn);
      });
      return d;
    }
    const restTarget = (out) => (focus < 0 ? out.set(0, 0, 0) : out.copy(Gw[focus]));
    const restDistance = () => (focus < 0 ? lerp(dOne, dAll, ph.move) : accords[focus].d);
    function poseAt(k) {
      if (k < 0) return null;
      cosP = Math.cos(psi); sinP = Math.sin(psi);
      const v = turn(accords[k].view.clone());
      return { yaw: Math.atan2(v.x, v.z), pitch: Math.asin(clamp(v.y, -1, 1)) };
    }
    const target = new THREE.Vector3();
    /** Where a journey is looking, e of the way along: from one network to
        another it bends in by the centre (the centre is the curve's pull);
        otherwise it goes straight. */
    function along(e, out) {
      restTarget(target);
      const ie = 1 - e;
      out.copy(flight.T).multiplyScalar(ie * ie).addScaledVector(target, e * e);
      if (!flight.via) out.addScaledVector(v1.copy(flight.T).lerp(target, 0.5), 2 * ie * e);
      return out;
    }
    function aim(t) {
      if (flight) {
        const e = ease(clamp((t - flight.t0) / flight.ms, 0, 1));
        along(e, cam.T);
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
      scene.fog.far = d + (focus < 0 ? 18 + ph.move * 34 : 38);
      // Keep what is looked at in the middle of the room the window on the
      // left and the foot leave.
      viewOff += (room() / 2 - viewOff) * (still ? 1 : 0.14);
      viewLift += ((foot() - TOP) / 2 - viewLift) * (still ? 1 : 0.14);
      camera.setViewOffset(W, H, -viewOff, viewLift, W, H);
    }

    // ============================================================
    // TRAVELLING, COMING APART, AND BACK
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
      stage.classList.add("is-turned");
      say();
      tagsFor();
      wake();
      if (still) aim(performance.now() + 10);
    }
    function arrive() {
      flight = null;
      stage.dataset.flying = "";
      say();
      tagsFor();
    }
    const step = (by) => {
      if (uTo < 1) return;
      const k = focus < 0 ? (by > 0 ? 0 : A16 - 1) : (focus + by + A16) % A16;
      travel(k);
    };
    function expand(to) {
      uTo = to ? 1 : 0;
      if (still) u = uTo;
      if (!to) {
        closeDrop();
        deselect();
        focus = -1;
      }
      if (!still) {
        flight = { T: cam.T.clone(), d: cam.d, yaw: cam.yaw, pitch: cam.pitch, zoom: cam.zoom,
          pose: { yaw: cam.yaw, pitch: to ? APART_PITCH : ONE_PITCH }, via: false, lift: 0,
          ms: EXPAND_MS * (to ? 0.92 : 0.8), t0: performance.now() };
      }
      if (to) signalAt = performance.now() + EXPAND_MS * 0.55;
      refit();
      stage.classList.add("is-turned");
      expandButton.setAttribute("aria-expanded", to ? "true" : "false");
      expandSay.textContent = to ? "Collapse into one" : "Expand the library";
      stage.classList.toggle("is-apart", !!to);
      hovered = -1;
      say();
      tagsFor();
      wake();
    }
    expandButton.addEventListener("click", () => expand(uTo < 1));

    /** Everything that says where you are. */
    function say() {
      stage.dataset.state = uTo === 1 ? (u >= 1 ? "apart" : "expanding") : u <= 0 ? "one" : "collapsing";
      stage.dataset.focus = focus < 0 ? "centre" : accords[focus].code;
      panelState.textContent = uTo === 1 ? A16 + " networks" : "one network";
      const A = focus >= 0 ? accords[focus] : null;
      dropSay.textContent = A ? pad(A.k + 1) + " · " + A.name : "The centre — every accord";
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
      markDirty = true;
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
      markOption();
      dropList.focus({ preventScroll: true });
    }
    function closeDrop(back) {
      if (!dock.classList.contains("is-open")) return;
      dock.classList.remove("is-open");
      dropButton.setAttribute("aria-expanded", "false");
      if (back) dropButton.focus({ preventScroll: true });
    }
    function markOption() {
      options.forEach((o, n) => o.classList.toggle("is-active", n === active));
      if (options[active]) dropList.setAttribute("aria-activedescendant", options[active].id = "net-option-" + active);
    }
    dropButton.addEventListener("click", () => (dock.classList.contains("is-open") ? closeDrop(true) : openDrop()));
    options.forEach((o, n) => {
      o.addEventListener("click", () => { closeDrop(true); travel(+o.dataset.to); });
      o.addEventListener("pointermove", () => { if (active !== n) { active = n; markOption(); } });
    });
    dropList.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
        markOption();
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
    // THE WINDOW ON THE LEFT: folding it, the search, the accords — each
    // lighting up alone under the hand, and staying lit when pressed.
    // ============================================================
    const fold = panel.querySelector(".net-fold");
    function setPanel(open) {
      panelOpen = open;
      panel.classList.toggle("is-folded", !open);
      stage.classList.toggle("has-panel", open);
      fold.setAttribute("aria-expanded", open ? "true" : "false");
      fold.setAttribute("aria-label", open ? "Fold the window away" : "Open the window");
      panel.querySelectorAll(".net-accord, .net-switch, .net-query, .net-clear").forEach((b) => { b.tabIndex = open ? 0 : -1; });
      markDirty = true;
      if (W > 1) refit();
    }
    fold.addEventListener("click", () => setPanel(!panelOpen));

    function setSearch(on) {
      switcher.setAttribute("aria-checked", on ? "true" : "false");
      search.hidden = !on;
      stage.classList.toggle("has-search", on);
      if (on) query.focus({ preventScroll: true });
      else if (query.value) { query.value = ""; find(); }
    }
    switcher.addEventListener("click", () => setSearch(switcher.getAttribute("aria-checked") !== "true"));

    accordButtons.forEach((b) => {
      b.addEventListener("click", () => {
        filter = b.dataset.code;
        accordButtons.forEach((x) => { const on = x === b; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
        stage.dataset.filter = filter;
        if (uTo === 1) {
          const A = accords.find((x) => x.code === filter);
          travel(A ? A.k : -1);
        }
        markDirty = true;
        wake();
      });
      // Under the hand, it lights up alone — for as long as the hand is on it.
      const hand = (on) => {
        previewing = on ? b.dataset.code : "";
        stage.dataset.previewing = previewing;
        markDirty = true;
        wake();
      };
      b.addEventListener("pointerenter", () => hand(true));
      b.addEventListener("pointerleave", () => hand(false));
      b.addEventListener("focus", () => hand(true));
      b.addEventListener("blur", () => hand(false));
    });

    // THE SEARCH, in the window: direct words, as the library's own.
    function find() {
      const q = query.value.trim();
      hits = [];
      if (q) {
        hits = notes.map((n) => ({ n, s: answer(n, q) })).filter((x) => x.s > 0)
          .sort((a, b) => b.s - a.s || a.n.name.localeCompare(b.n.name)).map((x) => x.n);
      }
      hitSet = new Set(hits.map((n) => n.i));
      countOut.textContent = q ? hits.length + " / " + NOTE_COUNT : "";
      clearButton.disabled = !query.value;
      results.innerHTML = "";
      hits.slice(0, 8).forEach((n) => {
        const li = el("li", "net-result");
        li.setAttribute("role", "option");
        li.innerHTML = '<span class="net-result-sym"></span><span class="net-result-name"></span><span class="net-result-code"></span>';
        li.children[0].textContent = n.sym;
        li.children[1].textContent = n.name;
        li.children[2].textContent = n.A.name;
        li.addEventListener("click", () => { go(n); search.classList.remove("has-results"); });
        results.appendChild(li);
      });
      if (q && !hits.length) results.appendChild(el("li", "net-result is-none", "No note answers that."));
      search.classList.toggle("has-results", !!q);
      stage.dataset.query = q;
      stage.dataset.hits = String(hits.length);
      markDirty = true;
      wake();
    }
    query.addEventListener("input", find);
    clearButton.addEventListener("click", () => { query.value = ""; find(); query.focus(); });
    search.addEventListener("submit", (e) => { e.preventDefault(); if (hits[0]) { go(hits[0]); search.classList.remove("has-results"); } });
    query.addEventListener("keydown", (e) => { if (e.key === "Escape" && query.value) { e.stopPropagation(); query.value = ""; find(); } });
    query.addEventListener("focus", () => { if (query.value.trim()) search.classList.add("has-results"); });

    /** A note chosen from the search: the library comes apart if it has
        not, its network is gone to, and the note selected. */
    function go(n) {
      if (uTo < 1) expand(true);
      if (focus !== n.A.k) travel(n.A.k);
      select(n.i, true);
    }

    // ============================================================
    // SELECTING a note (only once it has come apart): whole and lit, and
    // every other node translucent.
    // ============================================================
    function select(i, keep) {
      if (selected === i && !keep) { deselect(); return; }
      selected = i;
      const n = nodes[i].note;
      card.innerHTML =
        '<div class="net-card-top">' +
          '<span class="net-card-sym"></span>' +
          '<div><p class="net-card-name"></p><p class="net-card-accord"></p></div>' +
          '<button type="button" class="net-card-close" aria-label="Let it go">×</button>' +
        "</div>" +
        '<dl class="net-card-facts">' +
          '<div><dt>Element</dt><dd class="net-card-no"></dd></div>' +
          '<div><dt>Call number</dt><dd class="net-card-call"></dd></div>' +
          '<div><dt>Fragrances</dt><dd class="net-card-uses"></dd></div>' +
        "</dl>" +
        '<p class="net-card-say"></p>' +
        '<a class="net-card-open"></a>';
      card.querySelector(".net-card-sym").textContent = n.sym;
      card.querySelector(".net-card-name").textContent = n.name;
      card.querySelector(".net-card-accord").textContent = n.A.name;
      card.querySelector(".net-card-no").textContent = String(n.no);
      card.querySelector(".net-card-call").textContent = n.call;
      card.querySelector(".net-card-uses").textContent = n.uses === 1 ? "used in 1" : "used in " + n.uses;
      card.querySelector(".net-card-say").textContent = n.say;
      const open = card.querySelector(".net-card-open");
      open.href = root + LIBRARY + "#" + n.id;
      open.textContent = "Open it in the Note Library →";
      card.querySelector(".net-card-close").addEventListener("click", deselect);
      card.hidden = false;
      card.w = 0;
      stage.classList.add("is-selecting");
      stage.dataset.selected = n.name;
      markDirty = true;
      wake();
    }
    function deselect() {
      if (selected < 0) return;
      selected = -1;
      card.hidden = true;
      stage.classList.remove("is-selecting");
      stage.dataset.selected = "";
      markDirty = true;
      wake();
    }

    /** The names beside the notes: every note of the network you are at. */
    function tagsFor() {
      const want = focus >= 0 && !flight && uTo === 1 ? accords[focus].byUse : [];
      tags.forEach((g, k) => {
        const n = want[k];
        const to = n ? n.i : -1;
        if (to !== g.node) g.next = to;
      });
    }

    // ============================================================
    // THE POINTER — the notes, the centre and the bridges, and only once
    // it has come apart. Before that nothing in it answers the hand.
    // ============================================================
    const scr = new THREE.Vector3();
    const project = (x, y, z) => scr.set(x, y, z).project(camera);
    const toX = (p) => (p.x * 0.5 + 0.5) * W;
    const toY = (p) => (-p.y * 0.5 + 0.5) * H;
    const scale = () => H / (2 * Math.tan((camera.fov * Math.PI) / 360));
    const answering = () => uTo === 1 && u > 0.98;
    function nodeAt(x, y) {
      if (!answering()) return -1;
      let best = -1, bestScore = Infinity;
      const s = scale();
      for (let k = 0; k < NOTE_COUNT; k++) {
        const i = notes[k].i;
        const px = P[i * 3], py = P[i * 3 + 1], pz = P[i * 3 + 2];
        const p = project(px, py, pz);
        if (p.z > 1 || p.z < -1) continue;
        const dx = toX(p) - x, dy = toY(p) - y;
        const d = Math.hypot(px - camera.position.x, py - camera.position.y, pz - camera.position.z);
        const r = Math.max(7, (nodes[i].size * 1.6 * s) / d);
        const off = Math.sqrt(dx * dx + dy * dy);
        if (off > r) continue;
        if ((opacity[i] < 0.5 && selected >= 0) || vis[i] < 0.4) continue;
        const score = Math.round((off / r) * 8) + d * 0.001;
        if (score < bestScore) { bestScore = score; best = i; }
      }
      return best;
    }
    function bridgeAt(x, y) {
      if (!answering()) return -1;
      let best = -1, bestD = 9;
      const a = project(0, 0, 0), ax = toX(a), ay = toY(a), az = a.z;
      if (az > 1) return -1;
      accords.forEach((A) => {
        const b = project(Gw[A.k].x, Gw[A.k].y, Gw[A.k].z), bx = toX(b), by = toY(b);
        if (b.z > 1) return;
        const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
        const t = clamp(((x - ax) * dx + (y - ay) * dy) / Math.max(1, L), 0.12, 0.82);
        const d = Math.hypot(ax + dx * t - x, ay + dy * t - y);
        if (d < bestD) { bestD = d; best = A.k; }
      });
      return best;
    }
    function hubAt(x, y) {
      if (!answering()) return false;
      const p = project(0, 0, 0);
      return p.z < 1 && Math.hypot(toX(p) - x, toY(p) - y) < Math.max(14, (0.8 * scale()) / camera.position.length());
    }
    let hand = null;
    function point() {
      if (!hand || flight) return;
      const i = nodeAt(hand.x, hand.y);
      const h = i < 0 && hubAt(hand.x, hand.y);
      const k = i < 0 && !h ? bridgeAt(hand.x, hand.y) : -1;
      if (i !== hovered) { hovered = i; stage.dataset.hover = i >= 0 ? nodes[i].note.name : ""; }
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
      // A PRESS, not a drag — and only once it has come apart.
      if (!answering()) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const i = nodeAt(x, y);
      if (i >= 0) {
        if (focus !== nodes[i].A.k) { travel(nodes[i].A.k); select(i, true); }
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
    let lastT = 0, born = 0, segs = 0, changing = 0, sorted = false;
    const colours = new Float32Array(T * 3);
    const lit = new Float32Array(T);      // how lit each node is by the signal passing it
    const glowPos = glowGeo.attributes.position.array, glowCol = glowGeo.attributes.color.array;
    const pulsePos = pulseGeo.attributes.position.array, pulseCol = pulseGeo.attributes.color.array;
    const bridgePos = bridgeGeo.attributes.position.array, bridgeCol = bridgeGeo.attributes.color.array;
    const bpPos = bpGeo.attributes.position.array, bpCol = bpGeo.attributes.color.array;
    // The changing links: each accord's nodes kept sorted along x, so only
    // near ones are compared.
    accords.forEach((A) => { A.order = Int32Array.from(A.members.map((n) => n.i)); });

    // What each node is asked to be, read once a frame rather than a node.
    let onlyNow = "", searchingNow = false;
    function want(i) {
      const n = nodes[i];
      let o = 1;
      if (onlyNow && n.A.code !== onlyNow) o = GHOST;
      if (searchingNow && !hitSet.has(i)) o = GHOST;
      if (selected >= 0 && i !== selected) o = Math.min(o, near[selected].has(i) ? 0.35 : GHOST);
      return o;
    }
    // A node's matrix written in place: it is never turned, only moved and
    // sized, so the matrix is a scale and a translation.
    function put(arr, i, s, x, y, z) {
      const o = i * 16;
      arr[o] = s; arr[o + 1] = 0; arr[o + 2] = 0; arr[o + 3] = 0;
      arr[o + 4] = 0; arr[o + 5] = s; arr[o + 6] = 0; arr[o + 7] = 0;
      arr[o + 8] = 0; arr[o + 9] = 0; arr[o + 10] = s; arr[o + 11] = 0;
      arr[o + 12] = x; arr[o + 13] = y; arr[o + 14] = z; arr[o + 15] = 1;
    }
    const nothing = (arr, i) => arr.fill(0, i * 16, i * 16 + 16);
    let faintWas = true;
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
    function drawLinks(set, weight, strength, signalled) {
      if (weight <= 0.01) return;
      const wh = ph.white;
      for (let k = 0; k < set.length; k++) {
        const a = set[k][0], b = set[k][1];
        const sa = vis[a], sb = vis[b];
        if (sa < 0.05 || sb < 0.05) continue;
        const litUp = a === selected || b === selected || a === hovered || b === hovered;
        let f = weight * Math.min(opacity[a], opacity[b]) * Math.min(sa, sb) * (litUp ? 2.4 : 1) * strength;
        const s = signalled ? Math.max(lit[a], lit[b]) : 0;
        if (f < 0.015 && s < 0.02) continue;
        const w = Math.max(litUp ? 0.45 : 0, wh);
        const r = lerp(LINE[0], 1, w), g = lerp(LINE[1], 1, w), bl = lerp(LINE[2], 1, w);
        f += s * 1.3 * weight;
        segment(P[a * 3], P[a * 3 + 1], P[a * 3 + 2], P[b * 3], P[b * 3 + 1], P[b * 3 + 2],
          (r + (1 - r) * s * 0.6) * f, (g + (1 - g) * s * 0.5) * f, (bl + (1 - bl) * s * 0.5) * f);
      }
    }

    function frame(t) {
      const began = performance.now();
      const dt = Math.min(50, t - (lastT || t));
      lastT = t;
      if (!born) born = t;
      if (!still) clock += dt;
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

      // THE SIGNAL: out from the centre along every bridge, and on through
      // each network from its middle node, link by link.
      if (!still && ph.bridges > 0.9 && t - signalAt > SIGNAL_EVERY) signalAt = t;
      const since = t - signalAt;
      lit.fill(0);
      accords.forEach((A) => {
        A.arrived = since - A.reach / SIGNAL_SPEED;
        if (still || ph.apart < 0.5 || A.arrived < -10 || A.arrived > 1600) return;
        A.members.forEach((n) => {
          const x = (A.arrived - depth[n.i] * HOP) / SIGNAL_WIDTH;
          if (x > -3 && x < 3) lit[n.i] = Math.exp(-x * x) * ph.apart;
        });
      });

      // TRANSLUCENCY, eased node by node.
      const fade = still ? 1 : 1 - Math.exp(-dt * FADE_RATE);
      let dim = 0, settling = false, anyFaint = false, changed = false;
      const intro = still ? 1 : smooth(0, 1200, t - born);
      onlyNow = previewing || filter;
      searchingNow = hits.length > 0 || query.value.trim() !== "";
      for (let i = 0; i < T; i++) {
        const w = want(i), was = opacity[i];
        if (was !== w) {
          const o = was + (w - was) * fade;
          opacity[i] = Math.abs(o - w) < 0.002 ? w : o;
          changed = true;
          if (opacity[i] !== w) settling = true;
        }
        if (opacity[i] <= 0.995) anyFaint = true;
        if (opacity[i] < 0.5 && nodes[i].kind === 0) dim++;
      }
      if (changed) opacityAttr.needsUpdate = true;
      // The translucent set is drawn only while something is translucent.
      const faintNow = anyFaint || faintWas;
      faintWas = anyFaint;
      faint.visible = anyFaint;
      const solidM = solid.instanceMatrix.array, faintM = faint.instanceMatrix.array;
      const instColour = solid.instanceColor.array;

      // THE NODES: where, how large, what colour — red, white on the way.
      const wh = ph.white;
      const eyeX = camera.position.x, eyeY = camera.position.y, eyeZ = camera.position.z;
      for (let i = 0; i < T; i++) {
        const n = nodes[i];
        // A node not made yet (or gone again) is written empty once, and
        // then left alone until it is made.
        if (scaleOf[i] <= 0) {
          vis[i] = 0;
          if (!empty[i]) {
            empty[i] = 1;
            nothing(solidM, i); nothing(faintM, i);
            glowCol[i * 3] = glowCol[i * 3 + 1] = glowCol[i * 3 + 2] = 0;
          }
          continue;
        }
        empty[i] = 0;
        // Its red, towards white on the way, when chosen, and as the signal
        // passes.
        const wk = n.kind === 3 ? wh * 0.7 : wh;
        let r = baseRGB[i * 3], g = baseRGB[i * 3 + 1], b = baseRGB[i * 3 + 2];
        r += (1 - r) * wk; g += (1 - g) * wk; b += (1 - b) * wk;
        const hot = i === selected ? 0.6 : i === hovered ? 0.3 : searchingNow && hitSet.has(i) ? 0.2 : 0;
        if (hot) { r += (1 - r) * hot; g += (1 - g) * hot; b += (1 - b) * hot; }
        const li = lit[i] * 0.55;
        if (li > 0.01) { r += (1 - r) * li; g += (1 - g) * li; b += (1 - b) * li; }
        colours[i * 3] = r; colours[i * 3 + 1] = g; colours[i * 3 + 2] = b;
        instColour[i * 3] = r; instColour[i * 3 + 1] = g; instColour[i * 3 + 2] = b;
        // Anything right in front of the lens is let go, so that a network
        // standing between the eye and the one looked at never fills it.
        const ex = P[i * 3] - eyeX, ey = P[i * 3 + 1] - eyeY, ez = P[i * 3 + 2] - eyeZ;
        const dd = ex * ex + ey * ey + ez * ez;
        vis[i] = scaleOf[i] * (dd >= NEAR_OUT ? 1 : smooth(NEAR_IN, NEAR_OUT, dd));
        const grow = (i === selected ? 1.55 : i === hovered ? 1.35 : 1) * vis[i] * (0.15 + 0.85 * intro) * (1 + lit[i] * 0.25);
        const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
        if (grow < 0.01) { nothing(solidM, i); if (faintNow) nothing(faintM, i); }
        else if (opacity[i] > 0.995) { put(solidM, i, n.size * grow, x, y, z); if (faintNow) nothing(faintM, i); }
        else { nothing(solidM, i); put(faintM, i, n.size * grow, x, y, z); }
        // Its glow: the notes the most, the pale ones softly, the specks not
        // at all — brighter while white, and as the signal passes.
        const kindGlow = n.kind === 0 ? 0.62 + n.size * 2.4 : n.kind === 1 ? 0.28 : n.kind === 2 ? 0.3 : 0;
        const k = kindGlow * (1 + 0.6 * ph.changing + lit[i] * 1.6) * (0.2 + 0.8 * opacity[i]) * (i === selected ? 2 : 1) * grow;
        glowPos[i * 3] = x; glowPos[i * 3 + 1] = y; glowPos[i * 3 + 2] = z;
        glowCol[i * 3] = r * k; glowCol[i * 3 + 1] = g * k * 0.9; glowCol[i * 3 + 2] = b * k * 0.9;
      }
      solid.instanceMatrix.needsUpdate = true;
      if (faintNow) faint.instanceMatrix.needsUpdate = true;
      solid.instanceColor.needsUpdate = true;
      glowGeo.attributes.position.needsUpdate = true;
      glowGeo.attributes.color.needsUpdate = true;

      // THE LINKS: the one network's going as it comes apart, the changing
      // ones while white, the accords' as each network forms, and each
      // middle node's.
      segs = 0;
      drawLinks(oneLinks, ph.one * intro, 0.46, false);
      drawLinks(netMade, Math.max(ph.apart, ph.form) * (1 + 0.5 * ph.changing), 0.4, true);
      drawLinks(netRest, ph.apart, 0.4, true);
      changing = 0;
      if (ph.changing > 0.03) {
        // They shorten as they go, so that fewer are sought as the networks
        // close up.
        const reach = LINK_REACH * (0.45 + 0.55 * Math.min(1, ph.changing * 1.4));
        const R2 = reach * reach;
        const s = clock * 0.001;
        for (let k = 0; k < A16; k++) {
          const ord = accords[k].order;
          // Sorted along x properly the first time; after that kept sorted
          // (nearly sorted already, so this is quick).
          if (!sorted) ord.sort((a, b) => P[a * 3] - P[b * 3]);
          for (let x = 1; x < ord.length; x++) {
            const v = ord[x], vx = P[v * 3];
            let y = x - 1;
            while (y >= 0 && P[ord[y] * 3] > vx) { ord[y + 1] = ord[y]; y--; }
            ord[y + 1] = v;
          }
          for (let x = 0; x < ord.length; x++) {
            const a = ord[x];
            if (vis[a] < 0.2) continue;
            const ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2];
            for (let y = x + 1; y < ord.length; y++) {
              const b = ord[y];
              const dx = P[b * 3] - ax;
              if (dx > reach) break;
              if (vis[b] < 0.2) continue;
              const dy = P[b * 3 + 1] - ay, dz = P[b * 3 + 2] - az;
              const d2 = dx * dx + dy * dy + dz * dz;
              if (d2 >= R2) continue;
              // Flickering, a little — they are changing.
              const flick = still ? 1 : 0.65 + 0.35 * Math.sin(s * 9 + a * 1.7 + b * 0.9);
              const f = Math.pow(1 - Math.sqrt(d2) / reach, 1.1) * ph.changing * 2.2 * flick * Math.min(opacity[a], opacity[b]);
              if (f < 0.02) continue;
              segment(ax, ay, az, P[b * 3], P[b * 3 + 1], P[b * 3 + 2], f, f * 0.95, f * 0.93);
              changing++;
            }
          }
        }
        sorted = true;
      } else sorted = false;
      // Each accord's middle node, and its links into its network.
      const only = previewing || filter;
      accords.forEach((A) => {
        const show = ph.apart;
        A.coreGroup.visible = A.frame.visible = show > 0.01;
        if (show <= 0.01) return;
        const c = Cw[A.k];
        A.coreGroup.position.copy(c);
        A.coreGroup.scale.setScalar(0.3 + 0.7 * show);
        A.coreCage.rotation.set(t * 0.0008, t * 0.0011 + A.k, 0);
        const flash = !still && A.arrived > -40 && A.arrived < 500 ? Math.exp(-Math.pow(A.arrived / 180, 2)) : 0;
        const dimmed = only && only !== A.code ? 0.3 : 1;
        A.coreBall.material.opacity = dimmed;
        A.coreCage.material.opacity = (0.75 + flash * 0.25) * show * dimmed;
        A.coreGlow.material.opacity = (0.7 + flash) * show * dimmed;
        A.coreGlow.material.size = 1.6 + flash * 1.4;
        A.frame.position.copy(c);
        A.frame.quaternion.copy(A.q).premultiply(qs.setFromAxisAngle(UP, psi));
        A.frame.scale.setScalar(A.R * 1.12);
        A.frame.material.opacity = 0.3 * show * dimmed;
        for (const i of A.core) {
          const f = 0.5 * show * Math.min(opacity[i], dimmed) + flash * 0.8 * show;
          segment(c.x, c.y, c.z, P[i * 3], P[i * 3 + 1], P[i * 3 + 2], f, f * 0.4, f * 0.45);
        }
      });
      linkGeo.setDrawRange(0, segs * 2);
      linkGeo.attributes.position.updateRange.count = segs * 6;
      linkGeo.attributes.color.updateRange.count = segs * 6;
      linkGeo.attributes.position.needsUpdate = true;
      linkGeo.attributes.color.needsUpdate = true;

      // THE PULSES along the links.
      const onNet = ph.move > 0.5;
      const pulseStrength = (onNet ? ph.apart : ph.one) * intro;
      for (let k = 0; k < PULSES; k++) {
        const p = pulse[k];
        if (!still) p.t += dt * p.rate;
        if (p.t > 1) { p.t = 0; p.one = Math.floor(rnd() * oneLinks.length); p.net = Math.floor(rnd() * netLinks.length); p.back = rnd() < 0.5; }
        const l = onNet ? netLinks[p.net] : oneLinks[p.one];
        const a = p.back ? l[1] : l[0], b = p.back ? l[0] : l[1];
        pulsePos[k * 3] = lerp(P[a * 3], P[b * 3], p.t);
        pulsePos[k * 3 + 1] = lerp(P[a * 3 + 1], P[b * 3 + 1], p.t);
        pulsePos[k * 3 + 2] = lerp(P[a * 3 + 2], P[b * 3 + 2], p.t);
        const f = pulseStrength * Math.min(opacity[a], opacity[b], vis[a], vis[b]) * Math.sin(Math.PI * p.t);
        pulseCol[k * 3] = f; pulseCol[k * 3 + 1] = f * 0.62; pulseCol[k * 3 + 2] = f * 0.64;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      // THE RING the one network turns in.
      oneRing.rotation.y = -psi * 1.6;
      oneRing.material.opacity = 0.55 * ph.one * intro * (only || hitSet.size ? 0.5 : 1);
      oneRing.visible = ph.one > 0.01;

      // THE CENTRE, the bridges, the pulses on them, and the signal.
      hub.visible = ph.centre > 0.01;
      if (hub.visible) {
        hub.scale.setScalar(0.2 + 0.8 * ph.centre);
        hubCage.rotation.set(t * 0.0004, t * 0.0006, 0);
        hubRing.rotation.set(0.5, t * 0.0003, 0);
        hubRing2.rotation.set(Math.PI / 2, 0, t * -0.00025);
        const pulseOut = !still && since >= 0 && since < 500 ? 1 - since / 500 : 0;
        hubCage.material.opacity = 0.8 * ph.centre * (overHub ? 1.5 : 1);
        hubGlow.material.opacity = (0.9 + pulseOut * 0.8) * ph.centre * (overHub ? 1.5 : 1);
      }
      const reach = ph.bridges;
      for (let k = 0; k < A16; k++) {
        const A = accords[k];
        const to = Cw[k];
        const len = to.length();
        v1.copy(to).multiplyScalar(len > 0 ? 0.8 / len : 0);
        v2.copy(to).multiplyScalar(len > 0 ? (len - 0.5) / len : 0);
        v2.lerp(v1, 1 - reach);
        const o = k * 6;
        bridgePos[o] = v1.x; bridgePos[o + 1] = v1.y; bridgePos[o + 2] = v1.z;
        bridgePos[o + 3] = v2.x; bridgePos[o + 4] = v2.y; bridgePos[o + 5] = v2.z;
        const dimmed = only && only !== A.code ? 0.35 : 1;
        const litB = (overBridge === k || focus === k ? 1.8 : 1) * reach * (selected >= 0 ? 0.5 : 1) * dimmed;
        bridgeCol[o] = 0.85 * litB; bridgeCol[o + 1] = 0.8 * litB; bridgeCol[o + 2] = 0.8 * litB;
        bridgeCol[o + 3] = 0.95 * litB; bridgeCol[o + 4] = 0.35 * litB; bridgeCol[o + 5] = 0.38 * litB;
        for (let j = 0; j < BP; j++) {
          const w = ((still ? 0 : t) * 0.00014 * (overBridge === k ? 2.5 : 1) + j / BP + k * 0.13) % 1;
          const x = j % 2 ? 1 - w : w;
          const q = (k * (BP + 1) + j) * 3;
          bpPos[q] = lerp(v1.x, v2.x, x); bpPos[q + 1] = lerp(v1.y, v2.y, x); bpPos[q + 2] = lerp(v1.z, v2.z, x);
          const f = reach * Math.sin(Math.PI * x) * (overBridge === k ? 1.2 : 0.55) * dimmed;
          bpCol[q] = f; bpCol[q + 1] = f * 0.7; bpCol[q + 2] = f * 0.72;
        }
        // THE SIGNAL, out along this bridge.
        const q = (k * (BP + 1) + BP) * 3;
        const travelled = (since * SIGNAL_SPEED) / Math.max(1, A.reach);
        if (!still && since >= 0 && travelled <= 1 && reach > 0.9) {
          bpPos[q] = lerp(v1.x, v2.x, travelled); bpPos[q + 1] = lerp(v1.y, v2.y, travelled); bpPos[q + 2] = lerp(v1.z, v2.z, travelled);
          bpCol[q] = 1.6 * dimmed; bpCol[q + 1] = 1.4 * dimmed; bpCol[q + 2] = 1.4 * dimmed;
        } else { bpCol[q] = bpCol[q + 1] = bpCol[q + 2] = 0; }
      }
      bridges.visible = bridgePulses.visible = reach > 0.01;
      bridgeGeo.attributes.position.needsUpdate = true;
      bridgeGeo.attributes.color.needsUpdate = true;
      bpGeo.attributes.position.needsUpdate = true;
      bpGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
      chrome(t, dt);

      setData(stage, "u", u.toFixed(3));
      setData(stage, "dim", String(dim));
      setData(stage, "changing", String(changing));
      setData(stage, "yaw", cam.yaw.toFixed(2));
      setData(stage, "pitch", cam.pitch.toFixed(2));
      record(performance.now() - began, t);
      return settling || u !== uTo || !!flight || !!drag || !!spinYaw || !!spinPitch || t - born < 1400 || tagsMoving || markDirty;
    }

    // ============================================================
    // THE CHROME, each frame: words changed first, every size read at
    // once, then only writing — by transform and opacity, and only when
    // it changes.
    // ============================================================
    const move = (e, x, y) => {
      const v = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      if (e._at !== v) { e._at = v; e.style.transform = v; }
    };
    const fadeTo = (e, o) => {
      const v = o < 0.004 ? "0" : o.toFixed(3);
      if (e._o !== v) { e._o = v; e.style.opacity = v; }
    };
    const setData = (e, k, v) => { if (e.dataset[k] !== v) e.dataset[k] = v; };
    /** Whether a box stands under the window on the left or the foot. */
    function covered(x, y, w, h) {
      const r = room();
      if (r && x < r + 24) return true;
      const mid = W / 2 + r / 2, half = W < 700 ? W : 200;
      return y + h > H - foot() && x + w > mid - half && x < mid + half;
    }
    function chrome(t, dt) {
      const s = scale();
      tags.forEach((g) => {
        if (g.next !== undefined && (g.show < 0.02 || g.node < 0)) {
          g.node = g.next;
          g.next = undefined;
          g.w = 0;
          if (g.node >= 0) g.el.textContent = nodes[g.node].note.name;
        }
      });
      accords.forEach((A) => { const L = A.label; if (!L.w) { L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; } });
      tags.forEach((g) => { if (!g.w && g.node >= 0) { g.w = g.el.offsetWidth; g.h = g.el.offsetHeight; } });
      if (selected >= 0 && !card.hidden && !card.w) {
        const b = card.getBoundingClientRect(), o = stage.getBoundingClientRect();
        card.w = b.width; card.h = b.height; card.x = b.left - o.left; card.y = b.top - o.top;
      }
      const only = previewing || filter;
      // The networks' names, once apart.
      const boxes = [];
      accords.forEach((A) => {
        const L = A.label;
        let show = ph.apart * (focus === A.k && !flight ? 0 : 1);
        const p = project(Gw[A.k].x, Gw[A.k].y, Gw[A.k].z);
        const x = toX(p), y = toY(p);
        const d = camera.position.distanceTo(Gw[A.k]);
        if (p.z > 1) show = 0;
        const below = (A.R * 0.8 * s) / Math.max(1, d) + 10;
        const bx = x - L.w / 2, by = y + below;
        if (covered(bx, by, L.w, L.h)) show = 0;
        if (show > 0) {
          for (const o of boxes) {
            if (bx < o[0] + o[2] + 6 && o[0] < bx + L.w + 6 && by < o[1] + o[3] + 4 && o[1] < by + L.h + 4) { show *= 0.18; break; }
          }
          if (show > 0.5) boxes.push([bx, by, L.w, L.h]);
        }
        show *= only && only !== A.code ? 0.4 : 1;
        L.show += (show - L.show) * (still ? 1 : 0.2);
        move(L.el, bx, by);
        fadeTo(L.el, L.show);
        const on = L.show > 0.3;
        if (on !== L.on) { L.on = on; L.el.classList.toggle("is-on", on); }
      });
      // Every note of the network you are at, named beside its node.
      tagsMoving = false;
      const cx = W / 2 + room() / 2;
      tags.forEach((g) => {
        let show = g.node >= 0 && g.next === undefined ? 1 : 0;
        if (g.node >= 0) {
          const i = g.node;
          const p = project(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
          const x = toX(p), y = toY(p);
          if (p.z > 1) show = 0;
          const right = x >= cx, gap = 9;
          const gx = right ? x + gap : x - gap - g.w;
          g.box = [gx, y - 8, g.w, g.h];
          if (covered(gx, y - 8, g.w, g.h)) show = 0;
          show *= (opacity[i] > 0.5 ? 1 : 0.15) * (vis[i] > 0.5 ? 1 : 0);
          show *= flight ? 0 : ph.apart;
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
          if (x1 < x2 + w2 + 3 && x2 < x1 + w1 + 3 && y1 < y2 + h2 + 2 && y2 < y1 + h1 + 2) { g.want = 0; break; }
        }
      });
      tags.forEach((g) => {
        const next = g.show + (g.want - g.show) * (still ? 1 : 0.16);
        g.show = Math.abs(next - g.want) < 0.01 ? g.want : next;
        if (g.show !== g.want || g.next !== undefined) tagsMoving = true;
        fadeTo(g.el, g.show);
      });
      // The card's line to its note, from the card's left edge.
      if (selected >= 0 && !card.hidden) {
        const i = selected;
        const p = project(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
        const x = toX(p), y = toY(p);
        const phone = W < 700;
        leaderLine.setAttribute("x1", phone ? x.toFixed(1) : card.x.toFixed(1));
        leaderLine.setAttribute("y1", phone ? card.y.toFixed(1) : clamp(y, card.y + 14, card.y + card.h - 14).toFixed(1));
        leaderLine.setAttribute("x2", x.toFixed(1));
        leaderLine.setAttribute("y2", y.toFixed(1));
        leaderDot.setAttribute("cx", x.toFixed(1));
        leaderDot.setAttribute("cy", y.toFixed(1));
        leader.classList.toggle("is-on", p.z < 1);
      } else {
        leader.classList.remove("is-on");
        card.w = 0;
      }
      if (hovered >= 0 && !flight && hovered !== selected) {
        const n = nodes[hovered].note;
        hoverTag.textContent = n.sym + " · " + n.name;
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
      drawMark(dt);
    }
    window.addEventListener("resize", () => { card.w = 0; });
    card.addEventListener("animationend", () => { card.w = 0; });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      accords.forEach((A) => { A.label.w = 0; });
      tags.forEach((g) => { g.w = 0; });
      card.w = 0;
      markDirty = true;
      wake();
    });

    // ============================================================
    // THE MARK in the window: a ring of specks, one for every note, the
    // accords round it in turn with a gap between — lit where the hand or
    // the search is, turning slowly.
    // ============================================================
    let markW = 0, markH = 0, markTurn = 0, markSince = 0;
    const MARK_GAP = 0.08;
    const markAngles = new Float32Array(T);
    (() => {
      const span = Math.PI * 2 - MARK_GAP * A16;
      let a = 0;
      accords.forEach((A) => {
        A.markFrom = a;
        A.notes.forEach((n, j) => { markAngles[n.i] = a + (span * (j + 0.5)) / NOTE_COUNT; });
        a += (span * A.notes.length) / NOTE_COUNT + MARK_GAP;
      });
    })();
    function sizeMark() {
      const r = markCanvas.getBoundingClientRect();
      if (!r.width) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      markW = r.width; markH = r.height;
      markCanvas.width = Math.round(markW * ratio);
      markCanvas.height = Math.round(markH * ratio);
      markCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      markDirty = true;
    }
    function drawMark(dt) {
      if (!panelOpen) return;
      if (!markW) sizeMark();
      if (!markW) return;
      // It turns slowly enough to be drawn again a dozen times a second
      // rather than every frame.
      if (!still) { markTurn += dt * 0.00005; markSince += dt; if (markSince > 80) { markSince = 0; markDirty = true; } }
      if (!markDirty) return;
      markDirty = false;
      const g = markCtx;
      g.clearRect(0, 0, markW, markH);
      const cx = markW / 2, cy = markH / 2, R = markW * 0.3, FLAT = 0.36;
      const only = previewing || filter;
      const here = focus >= 0 ? accords[focus].code : "";
      const searching = hits.length || query.value.trim();
      // A hairline round it, and a tick where one accord gives way to the next.
      g.strokeStyle = "rgba(236,232,226,0.12)";
      g.lineWidth = 1;
      g.beginPath();
      g.ellipse(cx, cy, R * 1.3, R * 1.3 * FLAT, 0, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = "rgba(236,232,226,0.3)";
      accords.forEach((A) => {
        const a = A.markFrom - MARK_GAP / 2 + markTurn;
        g.fillRect(cx + Math.cos(a) * R * 1.3 - 0.75, cy + Math.sin(a) * R * 1.3 * FLAT - 0.75, 1.5, 1.5);
      });
      notes.forEach((n) => {
        const i = n.i;
        const a = markAngles[i] + markTurn;
        const on = only ? n.A.code === only : true;
        const hit = hitSet.has(i);
        const sel = i === selected;
        const lift = (on && only) || hit ? 5 : 0;
        const r = R + Math.min(9, Math.sqrt(n.uses) * 1.5) + lift;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * FLAT;
        const sz = sel ? 3 : 1 + Math.min(1.3, n.uses / 18);
        let alpha = on ? 0.85 : 0.13;
        if (searching) alpha = hit ? 1 : 0.1;
        g.fillStyle = hit || sel ? "rgba(255,255,255," + alpha + ")" :
          n.A.code === here ? "rgba(255,120,126," + Math.max(alpha, 0.9) + ")" : "rgba(255,74,84," + alpha + ")";
        g.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      });
      // What is lit, said small in the middle of it.
      const A = only ? accords.find((x) => x.code === only) : focus >= 0 ? accords[focus] : null;
      g.font = "400 9.5px 'IBM Plex Mono', monospace";
      g.textAlign = "center";
      g.fillStyle = "rgba(236,232,226,0.55)";
      g.fillText(A ? A.name : uTo === 1 ? "every accord, apart" : "every accord, together", cx, cy + 3);
    }

    // ============================================================
    // HOW QUICK EACH FRAME IS — and a lower resolution where the frames
    // come too slowly for sixty a second.
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
      if ((!still || busy) && !raf) raf = requestAnimationFrame(loop);
      else if (!raf) lastFrame = 0;
    }
    function wake() { if (!raf) raf = requestAnimationFrame(loop); }
    document.addEventListener("visibilitychange", () => { lastT = 0; lastFrame = 0; if (!document.hidden) wake(); });

    // FOR THE TESTS: where things are on the window, and what state it is in.
    const onScreen = (v) => { scene.updateMatrixWorld(); const p = project(v.x, v.y, v.z); return { x: toX(p), y: toY(p), z: p.z }; };
    const shown = () => { let n = 0; for (let i = 0; i < T; i++) if (scaleOf[i] > 0.5) n++; return n; };
    window.NetScene = {
      state: () => ({
        u, state: stage.dataset.state, focus: focus < 0 ? "centre" : accords[focus].code, flying: !!flight,
        selected: selected >= 0 ? nodes[selected].note.name : null, filter, previewing, query: query.value, hits: hits.map((n) => n.name),
        dim: notes.filter((n) => opacity[n.i] < 0.5).length, faintest: Math.min(...opacity),
        changing, segments: segs, quality, panel: panelOpen, target: cam.T.length(), pitch: cam.pitch, yaw: cam.yaw,
        nodes: T, shown: shown(), answering: answering(), litNodes: lit.filter((l) => l > 0.3).length,
      }),
      notes: () => notes.map((n) => ({ id: n.id, name: n.name, sym: n.sym, no: n.no, uses: n.uses, code: n.A.code })),
      accords: () => accords.map((A) => ({ code: A.code, name: A.name, count: A.notes.length, members: A.members.length, links: A.links, type: A.type, reach: A.reach, R: A.R, middle: A.coreGroup.visible })),
      /** A filler of an accord's network standing clear of every note on
          the window — to press, and find that nothing answers. */
      filler: (code) => {
        const A = accords.find((x) => x.code === code);
        if (!A) return null;
        scene.updateMatrixWorld();
        const spots = A.notes.map((n) => { const p = project(P[n.i * 3], P[n.i * 3 + 1], P[n.i * 3 + 2]); return [toX(p), toY(p)]; });
        for (const m of A.members) {
          if (m.kind === 0 || vis[m.i] < 0.9) continue;
          const p = project(P[m.i * 3], P[m.i * 3 + 1], P[m.i * 3 + 2]);
          const x = toX(p), y = toY(p);
          if (p.z > 1 || x < room() + 40 || x > W - 40 || y < 40 || y > H - 160) continue;
          if (spots.every(([sx, sy]) => Math.hypot(sx - x, sy - y) > 40)) return { x, y, i: m.i };
        }
        return null;
      },
      note: (name) => {
        const n = notes.find((x) => x.name === name);
        if (!n) return null;
        const i = n.i;
        const p = onScreen(new THREE.Vector3(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]));
        return { ...p, i, code: n.A.code, opacity: opacity[i], colour: [colours[i * 3], colours[i * 3 + 1], colours[i * 3 + 2]] };
      },
      network: (code) => {
        const A = accords.find((x) => x.code === code);
        return A && { ...onScreen(Gw[A.k]), spread: Cw[A.k].distanceTo(Gw[A.k]), at: Gw[A.k].toArray(), R: A.R, reach: A.reach };
      },
      centre: () => onScreen(new THREE.Vector3()),
      /** How near the centre the journey under way comes, at its middle. */
      bend: () => (flight ? along(0.5, new THREE.Vector3()).length() : null),
      bridge: (code) => {
        const A = accords.find((x) => x.code === code);
        if (!A) return null;
        const a = onScreen(new THREE.Vector3()), b = onScreen(Gw[A.k]);
        return { a, b, at: { x: a.x + (b.x - a.x) * 0.5, y: a.y + (b.y - a.y) * 0.5 } };
      },
      stats: () => {
        const n = Math.min(tookN, took.length);
        const sorted = Array.from(took.slice(0, n)).sort((a, b) => a - b);
        return { frames: tookN, mean: sorted.reduce((a, b) => a + b, 0) / Math.max(1, n), p95: sorted[Math.floor(n * 0.95)] || 0, max: sorted[n - 1] || 0 };
      },
      reset: () => { tookN = 0; },
    };

    // EVERY DRAWING'S PROGRAM MADE NOW, not the first time it is shown.
    const unseen = [];
    scene.traverse((o) => { if (!o.visible) { unseen.push(o); o.visible = true; } });
    renderer.compile(scene, camera);
    unseen.forEach((o) => { o.visible = false; });

    setPanel(panelOpen);
    find();
    if ("ResizeObserver" in window) new ResizeObserver(size).observe(stage);
    else window.addEventListener("resize", size);
    say();
    size();
    tagsFor();
    stage.classList.add("is-drawn");
    wake();
  }
})();

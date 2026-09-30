// ============================================================
// THE ALDEHYDE (index.html only, the first two slides)
//
// The owner, 2026-09-30: "redesign the front page of home. I want a big
// aldehyde molecule in the very middle of it, with the electron cloud
// being done as colour coded exactly as described in my previous message,
// and have the electron cloud made with the curl noise page elements." And
// then, of the first try: "i want the taste of aldehydes to be in front of
// the aldehyde. I want them both to be centered ... make the actual
// aldehyde look a little smoother, and isntead of the way it looks, i
// actually want it to look like the thing i see on the right; as close as
// possible to it" — the thing on the right being the private page where it
// was first drawn (The Aldehyde Cloud), on its dark ground. So the first
// slide is that page's dark grey, and this draws the molecule as it does.
//
// The molecule is formaldehyde, H2C=O, the smallest aldehyde there is, as
// Schrodinger's equation has it (solved once, by tools/aldehyde/cloud.py,
// into aldehyde-data.js): a cloud of specks, each one a place an electron
// may be found, in three parts that add up to the whole —
//
//   the double bond   its second pair, in GOLD, brought forward
//   the lone pair     oxygen's loosest pair, in VIOLET, brought forward
//   the rest          every other electron, faint
//
// "The colour coding exactly as described" is the owner's note before:
// "the normal electrons are insignificant, but the lone pair and the double
// bond each have an assigned emphasized parameter to them, which makes
// them stand out". Those parameters are EMPHASIS below: x1 is a part's
// true share of the specks; x3 draws it as if it held three times its
// electrons. The specks add up to light where they crowd (they are drawn
// additively, as light is), and the two brought forward are lit by how
// dense their cloud is where each speck stands, so their lobes read as
// shapes rather than haze — all as the private page draws it.
//
// Of "the curl noise page elements" (pmndrs' GPGPU Curl Noise DOF) the
// CURL NOISE stays: every speck swirls a little about its own place, as
// smoke in a slow current, worked out in the same pass that draws it.
//
// THE FORMULA (the same day, later): "when you scroll, I want us to
// introduce a 4th page, between the first and second ... the title and
// text to fade away; 3d model of the aldehyde to become more concrete and
// I want you to add in the element backbone ... displayed horizontally,
// where the O is facing upwards. This rearranging should be done after the
// title fades away. When it is rearranged, I want a part of the particles
// to flow in very slim lines and fill 4 areas on each sides. This should
// be symmetrical, and the areas should be equally spaced from each other.
// These 8 areas should be texts that are made up of the particles (but not
// taking from them by number or volume) and they should be the contents of
// the menu." And then, of the names: "the text itself to be the same as the
// title in the way it appears ... make some particles, similar to that of
// the aldehyde molecule around each of the word", "it should be a proper
// cloud like in the title", "remove the lines connecting the aldehyde to the
// words ... make it look a little minimalist and neat ... make the whole
// second page reactive to the scroll wheel". So the drawing stands still in
// the window across both slides (it is pinned, style.css), and the
// formula's sequence is ONE NUMBER the wheel moves (window.__formula, set by
// landing.js, which runs the stage; here `S`), whichever way it is turned:
//
//   THE TURNING (`u`, the first TURN of it): the cloud turns to face you,
//     flat, the O at the top and the two H below it either side, draws in
//     close round the bonds (more concrete), its swirl calms, and the
//     formula comes up in it — the bonds drawn out of the C in bright
//     specks, the C=O as two lines, and the atoms named as a chemistry book
//     names them.
//   THE GATHERING (`f`, the next GATHER): a cloud of specks gathers round
//     each of the Menu's eight pages, four each side of the formula, and the
//     specks of its letters come up in it and condense into them, nearest
//     the formula first — as the title's specks settle into its letters.
//     They are their own specks, as many as the letters and the clouds need:
//     the aldehyde loses none. Nothing runs between the aldehyde and them.
//   THE NAMES (`r`, the rest): each name comes up over its specks, set as
//     the title is, and they let go back into its cloud; pointed at, a
//     name's cloud brightens and stirs.
//
// It gathers as the title does, in from a wide shell round the slide to
// its places; it sways about the side the private page shows it from and
// leans a little to the pointer. It draws only while one of the two dark
// slides is on the screen. With reduced motion it is simply there, still,
// and changes at once. If the drawing cannot be made, it is not there: the
// title stands alone on its dark ground, and the formula slide is the eight
// links, plainly.
//
// This is one of two files here that write a shader of their own (the
// other is node-scene.js): a shader that fails to compile takes the whole
// drawing with it, so after compiling it checks, and quietly steps aside.
// It sets no global; the one it reads is landing.js's `__formula`.
// ============================================================
(function () {
  const D = window.ALDEHYDE;
  const stage = document.getElementById("aldehyde-stage");
  const first = document.getElementById("slide-1");
  const formula = document.getElementById("slide-formula");
  const wrap = document.getElementById("molecule");
  const container = document.getElementById("scroll-container");
  if (!D || !first || !wrap || !window.THREE) return;
  const links = formula ? Array.from(formula.querySelectorAll(".formula-link")) : [];

  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // HOW STRONGLY EACH PART IS DRAWN. x1 is its true share of the specks
  // (two electrons of sixteen for the double bond and for the lone pair,
  // twelve for the rest); the data holds enough for the two to be drawn a
  // little over x3 and the rest a little over x0.3.
  const EMPHASIS = { pi: 3, lone: 3, rest: 0.3 };
  const SHARE = { pi: 7500, lone: 7500, rest: 45000 };   // sixteen electrons as 60,000 specks
  // As the private page draws them, on its dark ground: gold, violet, and a
  // warm grey for the rest; how strong each is; how much larger a speck of
  // the two brought forward is.
  const COLOUR = { pi: [0xe0 / 255, 0xb2 / 255, 0x52 / 255], lone: [0xa9 / 255, 0x8a / 255, 0xd8 / 255], rest: [0x9a / 255, 0x94 / 255, 0x8c / 255] };
  const PEAK = { pi: 1, lone: 1, rest: 0.4 };
  const GROW = { pi: 1.5, lone: 1.5, rest: 1 };

  const GATHER_MS = 2600;   // the specks coming in to their places, as the title gathers
  // The side it is seen from, and its sway about it: the private page's.
  const SIDE = { yaw: 0.62, pitch: 0.24 };
  const SWAY = 0.4;         // either side, radians
  const SWAY_S = 26;        // one sway in 26 seconds
  const LEAN = 0.06;        // how far it leans to the pointer
  const FLOW = 0.12;        // how far a speck is carried off its place by the curl noise, angstrom
  const FREQ = 0.55;        // how fine its swirls are
  const PACE = 0.5;         // and how slowly they change
  // The framing: the private page's, the cloud 2.3 angstrom either side of
  // its middle up and down, 2.2 across, whichever the window is shorter in.
  const FOV = 32, FIT_TALL = 2.3, FIT_WIDE = 2.2;

  // THE FORMULA. How long each state takes to come, and to go again.
  // The formula's sequence is one number, `S`, 0 to 1, which follows how
  // far landing.js has taken the stage (window.__formula — the wheel's):
  // the first TURN of it the aldehyde turning into its formula, the next
  // GATHER the clouds gathering round the names and their letters
  // condensing out of them, and the rest the names coming up and their
  // specks letting go. It follows at FOLLOW a second at most, so a jump
  // (the page moved by a finger) is still a movement.
  const TURN = 0.3, GATHER = 0.45, FOLLOW = 1.25;
  // How close the cloud draws in round the bonds (1 not at all), how strong
  // each part is drawn once it has, and how much it still swirls.
  const TIGHT = { rest: 0.5, pi: 0.88, lone: 0.84 };
  const FORM_PEAK = { rest: 0.72, pi: 0.78, lone: 0.74 };
  const FORM_FLOW = 0.3;       // of FLOW
  const FORM_SWAY = 0.14;      // it sways a little either side of facing you, radians
  const FORM_EXTENT = 1.45;    // the formula and its cloud, angstrom either side of its middle
  // The formula itself: the bonds in bright specks, stopping short of each
  // atom's name; the C=O as two lines; the names as a chemistry book sets them.
  const BOND_STEP = 0.004;     // angstrom between specks along a bond
  const BOND_PAIR = 0.075;     // either side of the C=O's axis, angstrom
  const BOND_GAP = 0.19;       // how far short of an atom's middle a bond stops
  const BOND_INK = [1.0, 0.96, 0.9];
  const ATOM_SIZE = 0.23;      // the names' letters, angstrom
  const CLEAR = 0.78;          // the clear space round each, of that
  // The threads and the names.
  // The names' clouds: how much of the gathering each speck of a letter
  // takes, from its place in the cloud to its place in the letter; how many
  // specks of its own each cloud has for every square pixel of the name; and
  // the page's light ink the letters settle in.
  const TRAVEL = 0.55;
  const CLOUD_DENSITY = 1.05;
  const INK = [0.95, 0.93, 0.9];

  const phone = () => window.innerWidth < 700;
  const smooth = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: wrap.querySelector("canvas"), antialias: true, alpha: true });
  } catch (e) {
    wrap.remove();
    return;
  }
  renderer.setClearColor(0x000000, 0);
  // A machine drawing without a graphics card (a test's browser, an old
  // laptop) works the flow out on its processor, which everything else on
  // the page shares: it gets a fifth of the specks, one swirl rather than
  // two, and a new frame a twelfth of a second at most.
  // `?molecule=full` on the address draws it whole there too (for a picture of it).
  let soft = false;
  if (!/[?&]molecule=full\b/.test(location.search)) try {
    const gl = renderer.getContext();
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    soft = /swiftshader|llvmpipe|software/i.test(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "");
  } catch (e) { /* not knowing is fine */ }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
  const mol = new THREE.Group();    // the molecule, turned between its two ways of standing
  scene.add(mol);
  // The cloud as the private page shows it: C=O across, the double bond's
  // lobes up, the H towards you — and seen from its side, swaying.
  const CLOUD_BODY = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0)));
  // The formula as a book prints it: flat, facing you, the O at the top,
  // the two H below either side, the double bond's lobes towards you.
  const FORM_BODY = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0)));

  // ---- the shader: curl noise, and a soft speck --------------------------
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

  // The cloud: each speck at its place (drawn in towards the bonds as the
  // formula comes, `uConcrete`), swirled by the curl noise, gathered in.
  const VERTEX = `
    uniform float uTime, uFlow, uFreq, uGather, uSize, uTwo, uConcrete, uTight, uClear;
    uniform vec3 uAtoms[4];
    attribute float aSeed;
    attribute vec3 aStart, aColour, aCore;
    varying vec3 vColour;
    ${NOISE}
    void main() {
      vec3 home = mix(position, aCore + (position - aCore) * uTight, uConcrete);
      vec3 p = home;
      // the curl noise: each speck swirls a little about its own place
      if (uFlow > 0.0) {
        vec3 drift = curlNoise(home * uFreq + vec3(0.13, 0.09, -0.11) * uTime);
        if (uTwo > 0.5) drift += 0.5 * curlNoise(home * uFreq * 2.3 - vec3(0.17, -0.05, 0.12) * uTime);
        p += uFlow * drift;
      }
      // the gathering: in from a shell round the slide, each on its own delay
      float g = clamp((uGather - aSeed * 0.42) / 0.58, 0.0, 1.0);
      g = g * g * (3.0 - 2.0 * g);
      // as the formula, a clear space round each atom for its name, as a
      // book leaves the paper bare round a letter (in the molecule's plane:
      // it faces you then)
      float keep = 1.0;
      if (uConcrete > 0.0) {
        for (int i = 0; i < 4; i++) keep = min(keep, smoothstep(uClear * 0.55, uClear, length(p.yz - uAtoms[i].yz)));
      }
      p = mix(aStart, p, g);
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize;
      vColour = aColour * g * mix(1.0, keep, uConcrete);
    }`;

  // A soft round speck, as the private page's: full in the middle, four
  // fifths of it a third of the way out, nothing at its edge.
  const SPECK = `
    float speck() {
      float r = length(2.0 * gl_PointCoord - 1.0);
      if (r > 1.0) return -1.0;
      return r < 0.35 ? mix(1.0, 0.8, r / 0.35) : mix(0.8, 0.0, (r - 0.35) / 0.65);
    }`;
  const FRAGMENT = `
    uniform float uAlpha;
    varying vec3 vColour;
    ${SPECK}
    void main() {
      float a = speck();
      if (a < 0.0) discard;
      gl_FragColor = vec4(vColour, uAlpha * a);
    }`;

  // The bonds: specks strung along them, drawn out of the C (`aT` is how
  // far along from it) as the formula comes.
  const BOND_VERTEX = `
    uniform float uSize, uGrow;
    attribute float aT;
    varying vec3 vColour;
    void main() {
      float shown = smoothstep(aT, aT + 0.08, uGrow);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uSize;
      vColour = vec3(${BOND_INK.map((v) => v.toFixed(3)).join(", ")}) * shown;
    }`;

  // The names' clouds and letters, drawn straight onto the window in its
  // own pixels. Every speck belongs to one name (`aInfo.x`) and has a place
  // in that name's CLOUD (`aCloud`, and a depth, `aDepth`), in a colour of
  // the aldehyde's (`aTone`). The cloud's own specks (`aKind` 1) come up
  // there as the clouds gather (uFlow). A letter's (`aKind` 0) comes up there
  // too, each on its own beat (`aInfo.y`: nearest the formula first), and
  // then condenses into its place in a letter (`aTarget`), in the page's
  // light ink — as the title's specks settle into its letters; once the
  // name has come up over them (uLetGo) each lets go, back into the cloud.
  // Nothing runs between the aldehyde and the names (the owner: "remove the
  // lines connecting the aldehyde to the words").
  const TEXT_VERTEX = `
    uniform vec2 uRes, uCentre[8];
    uniform vec3 uInk;
    uniform float uHot[8], uFlow, uLetGo, uTime, uSize, uSwirl;
    attribute vec2 aTarget, aCloud;
    attribute float aDepth, aKind;
    attribute vec4 aInfo;
    attribute vec3 aTone;
    varying vec3 vColour;
    varying float vAlpha;
    ${NOISE}
    // Where a speck is in its name's cloud: turning slowly about the cloud's
    // upright, a little either way (it has depth, as the aldehyde's has),
    // and swirling; "near" is how much nearer than the middle it stands.
    vec2 cloudPlace(int k, float hot, out float near) {
      float tw = uTime * 0.14;
      float turn = 0.18 * sin(uTime * 0.19 + float(k) * 1.7);
      vec2 rel = aCloud - uCentre[k];
      near = clamp(1.0 + (-rel.x * sin(turn) + aDepth * cos(turn)) / 220.0, 0.75, 1.25);
      vec2 swirl = uSwirl * (1.0 + 0.6 * hot) * vec2(
        snoise(vec3(aCloud * 0.011, aDepth * 0.011 + tw + aInfo.w * 3.0)),
        snoise(vec3(aCloud * 0.011 + 17.3, aDepth * 0.011 + tw - aInfo.w * 3.0)));
      return uCentre[k] + vec2(rel.x * cos(turn) + aDepth * sin(turn), rel.y) + swirl;
    }
    void main() {
      int k = int(aInfo.x + 0.5);
      float hot = uHot[k];
      float twinkle = 0.82 + 0.18 * sin(uTime * 1.7 + aInfo.w * 60.0);
      float near = 1.0;
      vec2 p;
      vec3 c;
      float alpha;
      if (aKind < 0.5) {
        // a letter's speck: up in the cloud, then into its letter
        float local = clamp((uFlow - aInfo.y) / ${TRAVEL.toFixed(3)}, 0.0, 1.0);
        if (local <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
        vec2 home = cloudPlace(k, hot, near);
        float into = smoothstep(0.3, 1.0, local);
        p = mix(home, aTarget, into);
        c = mix(aTone, uInk, into);
        alpha = smoothstep(0.0, 0.3, local) * mix(near * twinkle, 1.0, into);
        // letting go, once the name has come up: back into the cloud
        float go = smoothstep(0.0, 1.0, clamp((uLetGo - 0.12 - aInfo.w * 0.3) / 0.58, 0.0, 1.0));
        p = mix(p, home, go);
        c = mix(c, aTone, go);
        alpha = mix(alpha, near * twinkle, go);
      } else {
        // the cloud's own: coming up round the name as the clouds gather
        float on = clamp((uFlow - aInfo.y * 0.6) / 0.4, 0.0, 1.0);
        if (on <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
        p = cloudPlace(k, hot, near);
        c = aTone;
        alpha = near * twinkle * smoothstep(0.0, 1.0, on);
      }
      vColour = mix(c, vec3(1.0), hot * 0.3);
      vAlpha = alpha * (1.0 + 0.3 * hot);
      gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
      gl_PointSize = uSize * (1.0 + 0.15 * hot) * near;
    }`;
  const TEXT_FRAGMENT = `
    varying vec3 vColour;
    varying float vAlpha;
    ${SPECK}
    void main() {
      float a = speck();
      if (a < 0.0) discard;
      gl_FragColor = vec4(vColour, vAlpha * a);
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

  // The atoms, and the bonds the cloud draws in round.
  const atom = {};
  const Hs = [];
  for (const [sym, x, y, z] of D.atoms) {
    const v = new THREE.Vector3(x, y, z);
    if (sym === "H") Hs.push(v); else atom[sym] = v;
  }
  Hs.sort((a, b) => a.y - b.y);   // the left one first, as the formula faces you
  const BONDS = [[atom.C, atom.O], [atom.C, Hs[0]], [atom.C, Hs[1]]];
  const nearest = new THREE.Vector3(), seg = new THREE.Vector3(), rel = new THREE.Vector3();
  function coreOf(x, y, z, out) {
    let best = Infinity;
    for (const [a, b] of BONDS) {
      seg.subVectors(b, a);
      rel.set(x - a.x, y - a.y, z - a.z);
      const t = Math.max(0, Math.min(1, rel.dot(seg) / seg.lengthSq()));
      nearest.copy(a).addScaledVector(seg, t);
      const d = (nearest.x - x) ** 2 + (nearest.y - y) ** 2 + (nearest.z - z) ** 2;
      if (d < best) { best = d; out[0] = nearest.x; out[1] = nearest.y; out[2] = nearest.z; }
    }
  }

  const parts = {};
  const core = [0, 0, 0];
  for (const name of ["rest", "lone", "pi"]) {
    const d = D.parts[name];
    const q = new Int8Array(decode(d.xyz).buffer);
    const shade = decode(d.shade);
    const n = d.n;
    const pos = new Float32Array(n * 3), start = new Float32Array(n * 3), cores = new Float32Array(n * 3);
    const col = new Float32Array(n * 3), sd = new Float32Array(n);
    const [cr, cg, cb] = COLOUR[name];
    for (let i = 0; i < n; i++) {
      // a byte a coordinate, and a hair of jitter so no lattice shows
      for (let a = 0; a < 3; a++) pos[i * 3 + a] = (q[i * 3 + a] + rand() - 0.5) * D.step;
      coreOf(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], core);
      cores[i * 3] = core[0]; cores[i * 3 + 1] = core[1]; cores[i * 3 + 2] = core[2];
      // lit as the private page lights it: the two brought forward by how
      // dense their cloud is where the speck stands, and every speck a little
      // brighter or darker than the next
      const lit = (0.78 + rand() * 0.22) * (name === "rest" ? 1 : 0.12 + 0.88 * Math.pow(shade[i] / 255, 1.1));
      col[i * 3] = cr * lit; col[i * 3 + 1] = cg * lit; col[i * 3 + 2] = cb * lit;
      sd[i] = rand();
      // where it comes in from: a wide shell round the molecule
      const u = rand() * 2 - 1, th = rand() * Math.PI * 2, rr = 7 + rand() * 3;
      const s = Math.sqrt(1 - u * u);
      start[i * 3] = rr * s * Math.cos(th); start[i * 3 + 1] = rr * s * Math.sin(th); start[i * 3 + 2] = rr * u;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
    geo.setAttribute("aCore", new THREE.BufferAttribute(cores, 3));
    geo.setAttribute("aColour", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(sd, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTime: { value: 0 }, uFlow: { value: REDUCE ? 0 : FLOW }, uFreq: { value: FREQ },
        uGather: { value: REDUCE ? 1 : 0 }, uSize: { value: 2 }, uAlpha: { value: PEAK[name] }, uTwo: { value: 1 },
        uConcrete: { value: 0 }, uTight: { value: TIGHT[name] }, uClear: { value: ATOM_SIZE * CLEAR },
        uAtoms: { value: [atom.O, atom.C, Hs[0], Hs[1]] },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    pts.renderOrder = { rest: 1, lone: 2, pi: 3 }[name];
    mol.add(pts);
    parts[name] = pts;
  }

  // ---- the formula ---------------------------------------------------------
  // The bonds, each stopping BOND_GAP short of the atoms at its ends; the
  // C=O as two lines either side of its axis, in the molecule's own plane.
  const bondPos = [], bondT = [];
  function strand(a, b, shift) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    dir.normalize();
    const from = a.clone().addScaledVector(dir, BOND_GAP).add(shift);
    const run = len - 2 * BOND_GAP;
    for (let s = 0; s <= run; s += BOND_STEP) {
      const p = from.clone().addScaledVector(dir, s);
      bondPos.push(p.x, p.y, p.z);
      bondT.push((BOND_GAP + s) / len);
    }
  }
  const across = new THREE.Vector3(0, 1, 0);   // in the plane, square to the C=O
  strand(atom.C, atom.O, across.clone().multiplyScalar(BOND_PAIR));
  strand(atom.C, atom.O, across.clone().multiplyScalar(-BOND_PAIR));
  strand(atom.C, Hs[0], new THREE.Vector3());
  strand(atom.C, Hs[1], new THREE.Vector3());
  const bondGeo = new THREE.BufferGeometry();
  bondGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(bondPos), 3));
  bondGeo.setAttribute("aT", new THREE.BufferAttribute(new Float32Array(bondT), 1));
  const bonds = new THREE.Points(bondGeo, new THREE.ShaderMaterial({
    vertexShader: BOND_VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: { uSize: { value: 2 }, uGrow: { value: 0 }, uAlpha: { value: 0 } },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  }));
  bonds.frustumCulled = false;
  bonds.renderOrder = 4;
  bonds.visible = false;
  mol.add(bonds);

  // The atoms' names, on the page over the drawing (crisper than specks).
  const names = [["O", atom.O], ["C", atom.C], ["H", Hs[0]], ["H", Hs[1]]].map(([sym, at]) => {
    const el = document.createElement("span");
    el.className = "formula-atom";
    el.textContent = sym;
    wrap.appendChild(el);
    return { el, at };
  });

  // ---- the threads and the names ----------------------------------------
  const textGeo = new THREE.BufferGeometry();
  const textMat = new THREE.ShaderMaterial({
    vertexShader: TEXT_VERTEX,
    fragmentShader: TEXT_FRAGMENT,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uInk: { value: new THREE.Vector3(...INK) },
      uHot: { value: new Float32Array(8) },
      uFlow: { value: 0 }, uLetGo: { value: 0 }, uTime: { value: 0 }, uSize: { value: 2 },
      uSwirl: { value: 6 },
      uCentre: { value: Array.from({ length: 8 }, () => new THREE.Vector2()) },
    },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });
  const text = new THREE.Points(textGeo, textMat);
  text.frustumCulled = false;
  text.renderOrder = 5;
  text.visible = false;
  scene.add(text);

  // A shader that did not compile takes the drawing with it: check, and step aside.
  try {
    bonds.visible = true;
    // (the names' geometry is made once the page is laid out; one speck to compile against)
    textGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
    textGeo.setAttribute("aTarget", new THREE.BufferAttribute(new Float32Array(2), 2));
    textGeo.setAttribute("aCloud", new THREE.BufferAttribute(new Float32Array(2), 2));
    textGeo.setAttribute("aDepth", new THREE.BufferAttribute(new Float32Array(1), 1));
    textGeo.setAttribute("aInfo", new THREE.BufferAttribute(new Float32Array(4), 4));
    textGeo.setAttribute("aTone", new THREE.BufferAttribute(new Float32Array(3), 3));
    textGeo.setAttribute("aKind", new THREE.BufferAttribute(new Float32Array(1), 1));
    text.visible = true;
    renderer.compile(scene, camera);
    const programs = renderer.info.programs || [];
    if (programs.some((p) => p.diagnostics && p.diagnostics.runnable === false)) throw new Error("shader");
    bonds.visible = false;
    text.visible = false;
  } catch (e) {
    renderer.dispose();
    names.forEach((n) => n.el.remove());
    wrap.remove();
    return;
  }

  // ---- framing -------------------------------------------------------------
  // In the middle of the window, as large as the private page draws it; and,
  // as the formula, as large as the room between the names leaves it.
  let W = 1, H = 1, distCloud = 10, distForm = 10, denseCloud = 1, denseForm = 1, pxForm = 100;
  let firstTop = 0, formulaTop = 1, band = false;
  const half = Math.tan((FOV * Math.PI) / 360);
  const density = (px) => Math.max(0.5, Math.min(1, (px / 190) ** 2));
  function size() {
    const r = wrap.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const small = phone();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    distCloud = Math.max(FIT_TALL / half, FIT_WIDE / (half * camera.aspect));
    // one angstrom on screen; the specks sized in angstrom so they grow and
    // shrink with the cloud, and a smaller cloud, packing them closer, drawn
    // fainter — as the private page does
    const px = (H / 2) / (half * distCloud);
    denseCloud = density(px);
    // the formula, in the room the names leave it (never larger than the cloud)
    pxForm = px;
    if (formula && links.length === 8) {
      const box = formula.getBoundingClientRect();
      const rects = links.map((a) => a.getBoundingClientRect());
      band = getComputedStyle(links[0].parentNode).getPropertyValue("--formula-layout").trim() === "band";
      let halfW, halfH;
      if (band) {
        const top = Math.max(...[0, 1, 4, 5].map((i) => rects[i].bottom)) - box.top;
        const bottom = Math.min(...[2, 3, 6, 7].map((i) => rects[i].top)) - box.top;
        halfH = (bottom - top) / 2 - 12;
        halfW = W / 2 - 18;
      } else {
        halfW = Math.min(...[0, 1, 2, 3].map((i) => box.left + W / 2 - rects[i].right)) - 28;
        halfH = H / 2 - 64;
      }
      pxForm = Math.max(20, Math.min(px * 1.05, halfW / FORM_EXTENT, halfH / FORM_EXTENT));
    }
    distForm = (H / 2) / (half * pxForm);
    denseForm = density(pxForm);
    firstTop = first.offsetTop;
    formulaTop = formula ? formula.offsetTop : firstTop + H;
    const scale = renderer.getPixelRatio();
    const cut = soft ? 0.2 : 1;
    for (const name in parts) {
      const u = parts[name].material.uniforms;
      u.uSize.value = (small ? 1.25 : 1.5) * GROW[name] * scale;
      u.uTwo.value = soft || small ? 0 : 1;
      parts[name].geometry.setDrawRange(0, Math.min(D.parts[name].n, Math.round(SHARE[name] * EMPHASIS[name] * cut)));
    }
    bonds.material.uniforms.uSize.value = (small ? 1.8 : 2.2) * scale;
    textMat.uniforms.uSize.value = (small ? 1.55 : 1.75) * scale;
    textMat.uniforms.uRes.value.set(W, H);
    textMat.uniforms.uSwirl.value = small ? 3 : 4;
    names.forEach((n) => { n.el.style.fontSize = (ATOM_SIZE * pxForm).toFixed(1) + "px"; });
    write();
    drewAt = -1;
    if (REDUCE || !running) draw(performance.now());
  }

  // WRITING THE NAMES: each link's own words drawn where the page lays them
  // out (so a name that wraps on a phone is written as it wraps), and the
  // inked pixels taken as places for specks — each with a place in the
  // name's CLOUD as well, and a beat to come in on, nearest the formula
  // first.
  //
  // THE CLOUD ROUND A NAME, as the aldehyde's is a cloud and kept plain (the
  // owner: "a little minimalist and neat (especially the words)"): one soft
  // oval of specks round the word, thickest at its middle and thinning
  // outwards in every direction (towards you and away as well), a few
  // further out in a haze; the same on every name, mostly the aldehyde's
  // warm grey with a little of its gold and its violet, every speck lit by
  // how thick the cloud is where it stands, so it glows at its heart.
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rand() * 0.999)) * Math.cos(2 * Math.PI * rand());
  const GREY = [0.7, 0.67, 0.63];
  function toneOf() {
    const x = rand();
    return x < 0.16 ? COLOUR.pi : x < 0.32 ? COLOUR.lone : GREY;
  }
  let written = false;
  function write() {
    if (!formula || links.length !== 8) return;
    const box = formula.getBoundingClientRect();
    const targets = [], clouds = [], depths = [], info = [], tones = [], kind = [];
    const small = phone();
    let shape = null;
    function shapeFor(r) {
      const w = r.width, h = r.height;
      return {
        cx: r.left - box.left + w / 2, cy: r.top - box.top + h / 2,
        sx: w * 0.34 + h * 0.4, sy: h * 0.55, sz: h * 0.5,
        hx: w * 0.5 + h * 0.5, hy: h * 0.95, hz: h * 0.7,
      };
    }
    const cloudAt = () => {
      const haze = rand() < 0.12;
      const x = shape.cx + gauss() * (haze ? shape.hx : shape.sx);
      const y = shape.cy + gauss() * (haze ? shape.hy : shape.sy);
      const z = gauss() * (haze ? shape.hz : shape.sz);
      const thick = Math.exp(-0.5 * (((x - shape.cx) / shape.sx) ** 2 + ((y - shape.cy) / shape.sy) ** 2 + (z / shape.sz) ** 2));
      const lit = (0.14 + 0.86 * Math.pow(thick, 0.9)) * (0.8 + 0.2 * rand());
      const tone = toneOf();
      clouds.push(x, y);
      depths.push(z);
      tones.push(tone[0] * lit, tone[1] * lit, tone[2] * lit);
    };
    links.forEach((a, k) => {
      const r = a.getBoundingClientRect();
      const side = k < 4 ? -1 : 1;
      shape = shapeFor(r);
      textMat.uniforms.uCentre.value[k].set(shape.cx, shape.cy);
      const t = a.firstChild && a.firstChild.nodeType === 3 ? a.firstChild : null;
      const cs = getComputedStyle(a);
      const font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      const sizePx = parseFloat(cs.fontSize) || 20;
      const SS = 3;
      const cw = Math.max(1, Math.ceil(r.width * SS)), ch = Math.max(1, Math.ceil(r.height * SS));
      const ink = document.createElement("canvas");
      ink.width = cw; ink.height = ch;
      const g = ink.getContext("2d");
      g.setTransform(SS, 0, 0, SS, 0, 0);
      g.font = font;
      g.fillStyle = "#000";
      g.textBaseline = "alphabetic";
      let inner = side < 0 ? 0 : Infinity;
      if (t) {
        const re = /\S+/g;
        let m;
        while ((m = re.exec(t.data))) {
          const range = document.createRange();
          range.setStart(t, m.index);
          range.setEnd(t, m.index + m[0].length);
          const wr = range.getBoundingClientRect();
          const mt = g.measureText(m[0]);
          const asc = mt.fontBoundingBoxAscent || wr.height * 0.78;
          const desc = mt.fontBoundingBoxDescent || wr.height * 0.22;
          g.fillText(m[0], wr.left - r.left, wr.top - r.top + (wr.height - (asc + desc)) / 2 + asc);
          inner = side < 0 ? Math.max(inner, wr.right) : Math.min(inner, wr.left);
        }
      }
      if (!isFinite(inner) || !inner) inner = side < 0 ? r.right : r.left;
      const ex = inner - box.left;   // the name's end nearer the formula
      const data = g.getImageData(0, 0, cw, ch).data;
      const step = Math.max(0.9, sizePx / 24);
      const span = Math.max(1, r.width);
      for (let y = 0; y < r.height; y += step) {
        for (let x = 0; x < r.width; x += step) {
          const jx = x + rand() * step, jy = y + rand() * step;
          const i = (Math.min(ch - 1, Math.floor(jy * SS)) * cw + Math.min(cw - 1, Math.floor(jx * SS))) * 4 + 3;
          if (data[i] < 120) continue;
          const tx = r.left - box.left + jx, ty = r.top - box.top + jy;
          // in nearest the formula first, so the name comes from its near end
          const far = Math.abs(tx - ex) / span;
          targets.push(tx, ty);
          info.push(k, (1 - TRAVEL) * Math.min(1, far * 0.86 + rand() * 0.14), 0, rand());
          cloudAt();
          kind.push(0);
        }
      }
      // and the cloud's own specks, as many as the name is large
      const many = Math.round(r.width * r.height * CLOUD_DENSITY * (small ? 0.6 : 1) * (soft ? 0.3 : 1));
      for (let c = 0; c < many; c++) {
        targets.push(0, 0);
        info.push(k, rand(), 0, rand());
        cloudAt();
        kind.push(1);
      }
    });
    const n = kind.length;
    textGeo.dispose();
    textGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    textGeo.setAttribute("aTarget", new THREE.BufferAttribute(new Float32Array(targets), 2));
    textGeo.setAttribute("aCloud", new THREE.BufferAttribute(new Float32Array(clouds), 2));
    textGeo.setAttribute("aDepth", new THREE.BufferAttribute(new Float32Array(depths), 1));
    textGeo.setAttribute("aInfo", new THREE.BufferAttribute(new Float32Array(info), 4));
    textGeo.setAttribute("aTone", new THREE.BufferAttribute(new Float32Array(tones), 3));
    textGeo.setAttribute("aKind", new THREE.BufferAttribute(new Float32Array(kind), 1));
    textGeo.setDrawRange(0, n);
    written = n > 0;
    if (stage) stage.classList.toggle("formula-written", written);
  }

  // ---- the hand on a name ------------------------------------------------
  const hot = new Float32Array(8), hotTo = new Float32Array(8);
  links.forEach((a, k) => {
    const on = () => { hotTo[k] = 1; drewAt = -1; };
    const off = () => { hotTo[k] = document.activeElement === a || a.matches(":hover") ? 1 : 0; drewAt = -1; };
    a.addEventListener("pointerenter", on);
    a.addEventListener("pointerleave", () => { hotTo[k] = document.activeElement === a ? 1 : 0; drewAt = -1; });
    a.addEventListener("focus", on);
    a.addEventListener("blur", off);
  });

  // ---- the frame -----------------------------------------------------------
  let lean = { x: 0, y: 0 }, leanTo = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    leanTo = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
  }, { passive: true });

  let S = 0, u = 0, f = 0, r = 0;   // the sequence, and its three parts: the turning, the gathering, the names
  let shownNames = -1;
  const qCloud = new THREE.Quaternion(), qForm = new THREE.Quaternion(), qTurn = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const v = new THREE.Vector3();
  function toScreen(p) {
    v.copy(p).applyMatrix4(mol.matrixWorld).project(camera);
    return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H };
  }
  let namesShown = true;

  const born = performance.now();
  let last = born;
  function draw(now) {
    // (a slow frame moves the clocks on by a quarter of a second at most:
    // a machine without a graphics card is slow, not stopped)
    const dt = Math.min(250, Math.max(0, now - last));
    last = now;
    const t = REDUCE ? 0 : (now - born) / 1000;
    const gather = REDUCE ? 1 : Math.min(1, (now - born) / GATHER_MS);

    // how far the sequence is: as far as the stage has been taken
    // (landing.js, by the wheel), followed at FOLLOW a second at most
    const to = Math.max(0, Math.min(1, +window.__formula || 0));
    const most = (FOLLOW * dt) / 1000;
    S = REDUCE ? to : S + Math.max(-most, Math.min(most, to - S));
    u = smooth(S / TURN);
    f = Math.max(0, Math.min(1, (S - TURN) / GATHER));
    r = Math.max(0, Math.min(1, (S - TURN - GATHER) / (1 - TURN - GATHER)));

    const up = smooth(r / 0.4);
    // the names come up over their specks as the title does over its own
    const shown = Math.round(up * 100) / 100;
    if (written && shown !== shownNames) {
      links.forEach((a) => { a.style.opacity = shown; });
      shownNames = shown;
    }
    const e = ease(u);

    if (!REDUCE) { lean.x += (leanTo.x - lean.x) * 0.04; lean.y += (leanTo.y - lean.y) * 0.04; }
    const sway = REDUCE ? 0 : Math.sin((t * 2 * Math.PI) / SWAY_S);
    euler.set(SIDE.pitch + lean.y * LEAN, SIDE.yaw + SWAY * sway + lean.x * LEAN, 0);
    qCloud.setFromEuler(euler).multiply(CLOUD_BODY);
    euler.set(lean.y * LEAN * 0.6, FORM_SWAY * sway + lean.x * LEAN * 0.6, 0);
    qForm.setFromEuler(euler).multiply(FORM_BODY);
    mol.quaternion.copy(qCloud).slerp(qForm, e);
    camera.position.set(0, 0, distCloud + (distForm - distCloud) * e);
    camera.updateMatrixWorld();   // (the names are placed before the frame is drawn)
    scene.updateMatrixWorld();

    const dense = denseCloud + (denseForm - denseCloud) * e;
    for (const name in parts) {
      const m = parts[name].material.uniforms;
      m.uTime.value = t * PACE; m.uGather.value = gather;
      m.uConcrete.value = e;
      m.uFlow.value = REDUCE ? 0 : FLOW * (1 - (1 - FORM_FLOW) * e);
      m.uAlpha.value = (PEAK[name] + (FORM_PEAK[name] - PEAK[name]) * e) * dense;
    }

    // the formula: the bonds drawn out of the C, then the names of the atoms
    const grow = smooth((u - 0.25) / 0.55);
    bonds.visible = grow > 0;
    bonds.material.uniforms.uGrow.value = grow * 1.1;
    bonds.material.uniforms.uAlpha.value = 0.9 * dense;
    const named = smooth((u - 0.6) / 0.4);
    if (named > 0 || namesShown) {
      for (const n of names) {
        const s = toScreen(n.at);
        n.el.style.transform = "translate(" + s.x.toFixed(1) + "px," + s.y.toFixed(1) + "px) translate(-50%,-50%)";
        n.el.style.opacity = named.toFixed(3);
      }
      namesShown = named > 0;
    }

    // the names' clouds and letters
    text.visible = written && f > 0;
    for (let k = 0; k < 8; k++) hot[k] += (hotTo[k] - hot[k]) * (REDUCE ? 1 : 0.12);
    if (text.visible) {
      const m = textMat.uniforms;
      for (let k = 0; k < 8; k++) m.uHot.value[k] = hot[k];
      m.uFlow.value = f;
      m.uLetGo.value = r;
      m.uTime.value = t;
    }

    renderer.render(scene, camera);

    // Where it is, said on the drawing for anything that wants to know
    // (the tests): cloud, turning, formula, gathering, written, named.
    const state = u <= 0 ? "cloud" : u < 1 ? "turning" : f <= 0 ? "formula" : f < 1 ? "gathering" : r < 1 ? "written" : "named";
    if (state !== wrap.dataset.state) wrap.dataset.state = state;
    return to !== S || hot.some((h, k) => Math.abs(h - hotTo[k]) > 0.001);
  }

  // Drawn only while the dark slides are on the screen, and not under the
  // menu or About me — and, with motion turned off, only when something has
  // changed (the stage moved on, a name pointed at, the window resized).
  let seen = true, running = false, drawn = 0, drewAt = -1;
  function loop(now) {
    running = false;
    if (!seen) return;
    const covered = document.body.classList.contains("menu-open") || document.body.classList.contains("about-shown");
    const changed = !REDUCE || drewAt !== (+window.__formula || 0);
    if (!covered && changed && (!soft || now - drawn > 80)) {
      const more = draw(now);
      drawn = now;
      drewAt = more ? -1 : (+window.__formula || 0);
    } else last = now;
    running = true;
    requestAnimationFrame(loop);
  }
  function wake() { if (!running && seen) { running = true; requestAnimationFrame(loop); } }
  new IntersectionObserver((entries) => {
    seen = entries[entries.length - 1].isIntersecting;
    if (seen) wake();
  }).observe(stage || first);
  let resizing = 0;
  new ResizeObserver(() => {
    window.clearTimeout(resizing);
    resizing = window.setTimeout(size, 120);
  }).observe(stage || first);
  size();
  // the names written again once the page's own face has come
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => size());
  wrap.classList.add("molecule-drawn");
  wake();
})();

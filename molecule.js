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
// THE FIVE STAGES (the same day, later). The drawing stands still in the
// window (it is pinned, style.css) while the page is scrolled down the
// stage (index.html), and follows how far down it is, smoothly, both ways —
// ONE NUMBER, window.__formula, 0 to 4, set by landing.js (here `S`): the
// owner's "5 increments ... gradual (not sudden like now)":
//
//   1  (S 0) the aldehyde as it is first seen, the title in front of it
//   2  (S 1) the same, the title gone (landing.js fades it)
//   3  (S 2) the aldehyde TURNED UPRIGHT: from S 1 to 2 it turns to face
//      you, flat, the O at the top and the two H below it either side
//   4  (S 3) its FORMULA drawn in it: from S 2 to 3 the cloud draws in close
//      round the bonds (more concrete), its swirl calms, the bonds are drawn
//      out of the C in bright specks, the C=O as two lines, and the atoms
//      named as a chemistry book names them
//   5  (S 4) THE SILLAGE, THE ALDEHYDES OF PERFUMERY and the names: from
//      S 3 the aldehyde's own scent spreads out of it into the room on every
//      side, the aldehydes a perfumer reaches for come up in the gaps as a
//      chemistry book draws them, and the Menu's eight pages come up,
//      scattered a little, each the R of an aldehyde (style.css, landing.js)
//      — "rework the words and the particles surrounding the main aldehyde
//      molecule. that stays 100% as it is ... fill in the gaps and make it
//      all thematic" (2026-10-03, last). For that day a very light drift of
//      specks fell either side, as ADAR's dust does; and until it two LINES
//      of specks came down the window, the names on the outside of them;
//      none of either is in this file now.
//
// THE ELECTRONEGATIVE HAND ("i want the cursor to have an electronegative
// character, so the electrons would be attracted to it"): wherever the
// pointer is over the stage, the specks near it — the aldehyde's and the
// sillage's — are drawn towards it, and brighten, and a small δ− stands beside
// it. A name pointed at is lit, with a backdrop of specks of its own.
//
// Before the five stages (the same evening) the formula stood on a slide of
// its own after the title, and the names came up out of clouds of their own,
// and before that out of streams of specks from the aldehyde; none of that is
// in this file now.
//
// It gathers as the title does, in from a wide shell round the slide to
// its places; it sways about the side the private page shows it from and
// leans a little to the pointer. It draws only while the stage is on the
// screen. With reduced motion it is simply there, still, changes at once,
// and the hand draws nothing to it. If the drawing cannot be made, it is not
// there: the title stands alone on its dark ground, and the last stage is
// the eight names, plainly.
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

  // THE STAGES. `S` is window.__formula (0 to 4, landing.js). Each change is
  // spread over the whole of its leg and a little into the one before, on a
  // gentle curve (2026-09-30: "EVERYTHING should be smooth and gradual; and
  // not incremental"), so something is always on its way and nothing waits
  // for the one before it to stop: the turning from TURN_FROM to 2, the
  // formula from FORM_FROM to 3, the last stage — the sillage, the
  // aldehydes in the gaps — coming up from 3 over DRIFT_OVER, the names
  // after it (landing.js).
  const TURN_FROM = 0.95, FORM_FROM = 1.95, DRIFT_OVER = 0.85;   // (the turn from 0.85 until 2026-10-01, when its leg grew)
  // THE TURN UPRIGHT, prolonged and smoothed (2026-10-01: "prolongue the
  // horizontal to vertical transformation of the aldehyde. thats the only
  // part that looks fast. I want you to smooth it out"). Its leg of the
  // page is the longest (LEGS in landing.js), and the turn itself does not
  // follow the page straight: it follows it on a spring, critically damped
  // (TURN_W, per second) — setting off gently and coming to rest softly — so
  // however quickly the page is scrolled, or a key pressed, it turns over two
  // seconds or so, never faster. The formula waits for it to stand upright.
  const TURN_W = 2.6;
  // At the title the hand is felt only a little (the owner: "when youre
  // still at the title, make it way less reactive to the cursor"): its pull
  // and the lean are REACT_TITLE of themselves there, whole by the formula.
  const REACT_TITLE = 0.12;
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
  // THE SILLAGE (2026-10-03, last, in place of the drift — the owner:
  // "rework the words and the particles surrounding the main aldehyde
  // molecule ... fill in the gaps and make it all thematic"): the aldehyde's
  // own scent leaving it. Its specks come off the edge of its cloud and go
  // out into the room on every side, slowly, as a smell spreads — fast at
  // first and slower as they go, as anything diffusing does (`SILL_EASE`: how
  // far out is how far through its life to this power; a half would be a
  // true diffusion) — curling a little as they go and wandering on a slow
  // current under them, and fading as they reach the window's edge; in the
  // aldehyde's warm grey, some of its gold and violet; reaching out further
  // as the last stage comes; drawn to the electronegative hand. How many to
  // a square pixel of the window; where they leave from and how far they go,
  // of the formula's half-size and of the window's half-diagonal; how long a
  // life is, seconds; how far a speck curls over it, radians; how far the
  // current carries one, pixels and of its distance out, and how slowly it
  // turns over; how strong a speck is at most. (ADAR's dust fell here for a
  // day, in the rooms either side: it was ADAR's, not this page's.)
  const SILL_DENSITY = 0.0048;
  const SILL_FROM = 0.78, SILL_REACH = 1.08;
  const SILL_EASE = 0.85;
  const SILL_LIFE = [55, 120];
  const SILL_CURL = 0.4;
  const SILL_WANDER = [10, 0.07], SILL_STIR = 0.03;
  const SILL_INK = 0.85;
  const SILL_TONES = [[0.16, "pi"], [0.14, "lone"]];
  // THE ALDEHYDES OF PERFUMERY, in the gaps (the same round): the aldehydes a
  // perfumer reaches for, drawn as a chemistry book draws them — skeletal
  // formulas, the carbons at the corners, only the oxygens named — in fine
  // lines of specks, the C=O's double bond in the aldehyde's GOLD and the
  // oxygen's lone pair a faint VIOLET haze round its O, as the big one is
  // coloured; each with its name in small type under it. They stand in
  // whatever room the names and the formula leave (laid once, wherever the
  // most room is), each turned its own way, drifting a few pixels and
  // turning a little, coming up one by one as the last stage comes, and
  // drawn a little to the hand. The bond in pixels (of the window's width,
  // and its least and most), how much smaller the farther ones are, how
  // strong at most, how many tries each is given to find a place, and the
  // room kept round the names, the formula and each other.
  const AIR_BOND = [0.0118, 11, 19];
  const AIR_DEPTH = [0.74, 1];
  const AIR_INK = 0.64;
  const AIR_TRIES = 140;
  const AIR_KEEP = { name: 16, formula: 1.1, apart: 26, edge: 14 };
  const LINE_SWIRL = 3.2;   // (a name's backdrop swirls by it)
  // A NAME'S BACKDROP (2026-09-30: "make them slightly particular when
  // hovered. give them a slight backdrop of particles, same colours as the
  // aldehyde"): a soft oval of specks behind a name the hand or the keys
  // are on — the aldehyde's gold, violet and grey — swirling as the
  // aldehyde's do. **Many small ones, coming one by one** since 2026-10-01
  // ("not to have such a sudden burst of large particles, rather the
  // gradual appearance of many small ones ... when you hover one of the 8
  // titles"): each speck shows at a moment of its own as the backdrop comes
  // up (`HAZE_STAGGER` of the way, each its own share of it), settling the
  // last little way into its place as it does — it was 420 a name, twice
  // the size, all coming at once and drawn in from half as far again. How
  // many to a name, how far out they stand, of the name's own half-size and
  // pixels more, how quickly they come and go, and how bright at most.
  const HAZE_PER_NAME = 1000;
  const HAZE_REACH = [0.62, 14];    // [of the name's half-width, pixels]
  const HAZE_RISE = [0.72, 9];      // the same, up and down
  const HAZE_EASE = 650;            // ms, the time constant it comes up and goes on (420 until 2026-10-01)
  const HAZE_ALPHA = 0.95;
  const HAZE_STAGGER = 0.75;        // the share of its coming over which the specks' own moments are spread
  const HAZE_TONES = [[0.34, "rest"], [0.36, "pi"], [0.3, "lone"]];   // [share, the aldehyde's colour]
  // THE ELECTRONEGATIVE HAND: how far its pull reaches, how much of the way
  // to it a speck at its heart is drawn, and how much brighter it is there.
  const HAND_REACH = 0.16;     // of the window's height, for the aldehyde's specks
  const HAND_PULL = 0.45;
  const LINE_REACH = 150;      // pixels, for the sillage's (the lines' reach, kept)
  // the sillage as little moved by it as the lines were made (2026-10-01: "i
  // want them half as reactive") — a name's backdrop keeps its own
  const LINE_PULL = 0.25;
  const LINE_LIGHT = 0.5;      // of HAND_LIGHT
  const HAZE_PULL = 0.175;
  const HAND_LIGHT = 0.55;

  const phone = () => window.innerWidth < 700;
  const smooth = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

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
  // formula comes, `uConcrete`), swirled by the curl noise, gathered in —
  // and drawn a little of the way to the hand where it is near it (`uHand`,
  // where the pointer is on the drawing, -1 to 1 each way; `uPull`, how
  // much it is there).
  const VERTEX = `
    uniform float uTime, uFlow, uFreq, uGather, uSize, uTwo, uConcrete, uTight, uClear, uPull, uAspect;
    uniform vec2 uHand;
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
      // the hand: the electrons drawn to it
      float near = 0.0;
      if (uPull > 0.0) {
        vec2 at = gl_Position.xy / gl_Position.w;
        vec2 d = uHand - at;
        vec2 dd = vec2(d.x * uAspect, d.y);
        near = exp(-dot(dd, dd) / (${HAND_REACH.toFixed(3)} * ${HAND_REACH.toFixed(3)} * 4.0)) * uPull;
        // (as the formula, gentler, and never round an atom's name: the
        // clear space stays where the name is)
        near *= mix(1.0, 0.55 * keep * keep, uConcrete);
        gl_Position.xy += d * ${HAND_PULL.toFixed(3)} * near * gl_Position.w;
      }
      gl_PointSize = uSize;
      vColour = aColour * g * mix(1.0, keep, uConcrete) * (1.0 + ${HAND_LIGHT.toFixed(3)} * near);
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

  // THE SILLAGE, drawn straight onto the window in its own pixels. Every
  // speck leaves the edge of the aldehyde's cloud (`uFrom`, pixels from the
  // formula's middle, `uMid`) in its own direction (`aSill.x`, of a turn),
  // and goes out to `uReach` over its own life (`aSill.z`, seconds) from its
  // own moment in it (`aSill.y`), round and round — fast at first and slower
  // as it goes (SILL_EASE), so thinning as it spreads, curling a little,
  // carried on a slow current; it
  // shows only as far out as the stage has let the scent reach (`uOut`), and
  // fades in as it leaves the cloud and out as it nears the window's edge.
  // The hand draws it to it.
  const SILL_VERTEX = `
    uniform vec2 uRes, uHandPx, uMid;
    uniform float uTime, uDraw, uSize, uPull, uFrom, uReach, uOut;
    attribute vec4 aSill;
    attribute vec3 aTone;
    varying vec3 vColour;
    varying float vAlpha;
    ${NOISE}
    void main() {
      float seed = aSill.w;
      float u = fract(aSill.y + uTime / aSill.z);
      float r = uFrom + (uReach - uFrom) * pow(u, ${SILL_EASE.toFixed(3)});
      float a = aSill.x * 6.2832 + ${SILL_CURL.toFixed(3)} * u * (seed < 0.5 ? 1.0 : -1.0);
      // (a little taller than round, as the formula stands)
      vec2 p = uMid + vec2(cos(a), sin(a) * 1.06) * r;
      // the slow current under it, carrying it further the further out it is
      // (one noise, turned into a way and how far: half the work of two)
      float carry = ${SILL_WANDER[0].toFixed(1)} + ${SILL_WANDER[1].toFixed(3)} * (r - uFrom);
      float n = snoise(vec3(p * 0.0035, uTime * ${SILL_STIR.toFixed(3)} + seed * 4.0));
      float w = n * 3.6 + seed * 6.2832;
      p += carry * (0.35 + 0.65 * abs(n)) * vec2(cos(w), sin(w));
      // in as it leaves the cloud, out towards the edge, and only as far as
      // the scent has reached
      float fade = smoothstep(0.0, 0.06, u) * (1.0 - smoothstep(0.62, 1.0, u));
      fade *= 1.0 - smoothstep(uOut - 90.0, uOut, r);
      // the hand: the electrons drawn to it
      float near = 0.0;
      if (uPull > 0.0) {
        vec2 d = uHandPx - p;
        near = exp(-dot(d, d) / (${LINE_REACH.toFixed(1)} * ${LINE_REACH.toFixed(1)})) * uPull;
        p += d * ${LINE_PULL.toFixed(3)} * near;
      }
      float twinkle = 0.7 + 0.3 * sin(uTime * 0.9 + seed * 60.0);
      vColour = aTone * (1.0 + ${(HAND_LIGHT * LINE_LIGHT).toFixed(3)} * near);
      vAlpha = uDraw * fade * twinkle;
      if (vAlpha <= 0.002) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
      gl_PointSize = uSize * (seed < 0.1 ? 1.4 : 0.65 + 0.4 * fract(seed * 11.0));
    }`;
  const LINE_FRAGMENT = `
    uniform float uAlpha;
    varying vec3 vColour;
    varying float vAlpha;
    ${SPECK}
    void main() {
      float a = speck();
      if (a < 0.0) discard;
      gl_FragColor = vec4(vColour, uAlpha * vAlpha * a);
    }`;

  // A NAME'S BACKDROP, drawn straight onto the window in its pixels like the
  // sillage: every speck belongs to one name (`aHaze.x`) and stands at its own
  // place in an oval round it (`aHaze.yz`, in the name's own half-sizes),
  // drawn in from half as far again as the name comes up (`uHeat`), swirling
  // a little, and drawn a part of the way to the hand.
  const HAZE_VERTEX = `
    uniform vec2 uRes, uHandPx;
    uniform float uTime, uSize, uSwirl, uPull;
    uniform float uHeat[8], uWordX[8], uWordY[8], uHalfW[8], uHalfH[8];
    attribute vec4 aHaze;
    attribute vec3 aTone;
    varying vec3 vColour;
    varying float vAlpha;
    ${NOISE}
    void main() {
      int k = int(aHaze.x + 0.5);
      float heat = 0.0, cx = 0.0, cy = 0.0, hw = 0.0, hh = 0.0;
      for (int i = 0; i < 8; i++) {
        if (i == k) { heat = uHeat[i]; cx = uWordX[i]; cy = uWordY[i]; hw = uHalfW[i]; hh = uHalfH[i]; }
      }
      if (heat <= 0.002) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      float seed = aHaze.w;
      vec2 off = aHaze.yz * vec2(hw * ${HAZE_REACH[0].toFixed(3)} + ${HAZE_REACH[1].toFixed(1)}, hh * ${HAZE_RISE[0].toFixed(3)} + ${HAZE_RISE[1].toFixed(1)});
      // each speck at a moment of its own as it comes up, and settling the
      // last little way into its place as it does
      float from = seed * ${HAZE_STAGGER.toFixed(3)};
      float come = smoothstep(from, from + ${(1 - HAZE_STAGGER).toFixed(3)}, heat);
      off *= mix(1.12, 1.0, come);
      vec2 p = vec2(cx, cy) + off;
      // a slow turn of its own, and the aldehyde's swirl
      float a = uTime * (0.25 + 0.35 * seed) + seed * 40.0;
      p += vec2(cos(a), sin(a)) * (1.5 + 2.5 * seed);
      p += uSwirl * 1.4 * vec2(
        snoise(vec3(p.x * 0.02, p.y * 0.02, uTime * 0.16 + seed * 5.0)),
        snoise(vec3(p.x * 0.02 + 9.1, p.y * 0.02, uTime * 0.16 - seed * 5.0)));
      // the hand
      float near = 0.0;
      if (uPull > 0.0) {
        vec2 d = uHandPx - p;
        near = exp(-dot(d, d) / (${(LINE_REACH * 0.7).toFixed(1)} * ${(LINE_REACH * 0.7).toFixed(1)})) * uPull;
        p += d * ${HAZE_PULL.toFixed(3)} * near;
      }
      // brightest at its middle, fading out to its edge
      float r = length(aHaze.yz);
      float shape = exp(-r * r * 0.55);
      float twinkle = 0.75 + 0.25 * sin(uTime * 1.9 + seed * 70.0);
      vColour = aTone * (1.0 + ${HAND_LIGHT.toFixed(3)} * near);
      vAlpha = come * shape * twinkle;
      gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
      gl_PointSize = uSize * (0.75 + 0.5 * fract(seed * 13.7));
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

  const hand = { x: 0, y: 0 };   // where the hand is on the drawing, -1 to 1 each way
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
        uHand: { value: new THREE.Vector2() }, uPull: { value: 0 }, uAspect: { value: 1 },
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

  // ---- the sillage -----------------------------------------------------------
  const sillGeo = new THREE.BufferGeometry();
  const sillMat = new THREE.ShaderMaterial({
    vertexShader: SILL_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uMid: { value: new THREE.Vector2() },
      uHandPx: { value: new THREE.Vector2() },
      uTime: { value: 0 }, uDraw: { value: 0 }, uSize: { value: 2 },
      uFrom: { value: 100 }, uReach: { value: 800 }, uOut: { value: 800 },
      uPull: { value: 0 }, uAlpha: { value: SILL_INK },
    },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });
  const sill = new THREE.Points(sillGeo, sillMat);
  sill.frustumCulled = false;
  sill.renderOrder = 5;
  sill.visible = false;
  scene.add(sill);

  // ---- a name's backdrop -----------------------------------------------------
  const hazeGeo = new THREE.BufferGeometry();
  const hazeMat = new THREE.ShaderMaterial({
    vertexShader: HAZE_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uHandPx: { value: new THREE.Vector2() },
      uTime: { value: 0 }, uSize: { value: 2 }, uSwirl: { value: LINE_SWIRL },
      uPull: { value: 0 }, uAlpha: { value: HAZE_ALPHA },
      uHeat: { value: new Float32Array(8) }, uWordX: { value: new Float32Array(8) },
      uWordY: { value: new Float32Array(8) }, uHalfW: { value: new Float32Array(8) },
      uHalfH: { value: new Float32Array(8) },
    },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });
  const haze = new THREE.Points(hazeGeo, hazeMat);
  haze.frustumCulled = false;
  haze.renderOrder = 6;
  haze.visible = false;
  scene.add(haze);

  // A shader that did not compile takes the drawing with it: check, and step aside.
  try {
    bonds.visible = true;
    // (the sillage's specks are made once the page is laid out; one speck to compile against)
    sillGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
    sillGeo.setAttribute("aSill", new THREE.BufferAttribute(new Float32Array(4), 4));
    sillGeo.setAttribute("aTone", new THREE.BufferAttribute(new Float32Array(3), 3));
    sill.visible = true;
    hazeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
    hazeGeo.setAttribute("aHaze", new THREE.BufferAttribute(new Float32Array(4), 4));
    hazeGeo.setAttribute("aTone", new THREE.BufferAttribute(new Float32Array(3), 3));
    haze.visible = true;
    renderer.compile(scene, camera);
    const programs = renderer.info.programs || [];
    if (programs.some((p) => p.diagnostics && p.diagnostics.runnable === false)) throw new Error("shader");
    bonds.visible = false;
    sill.visible = false;
    haze.visible = false;
  } catch (e) {
    renderer.dispose();
    names.forEach((n) => n.el.remove());
    wrap.remove();
    return;
  }

  // THE δ− by the hand, where the specks are drawn to it.
  const charge = document.createElement("span");
  charge.className = "molecule-charge";
  charge.textContent = "δ−";
  wrap.appendChild(charge);

  // ---- the aldehydes of perfumery, in the gaps -------------------------------
  // Each as a chemistry book draws it, a bond one long, up the page positive:
  // its corners (`at`: [x, y], and a letter where an oxygen stands) and its
  // bonds ([from, to, 1 or 2], or 3 for the inner line of a ring's double
  // bond). A straight chain is a zig-zag from its tail to the aldehyde's
  // carbon, the =O next along it; a ring is a hexagon with its first corner
  // on the right, where the aldehyde's carbon goes on.
  const zig = (k) => [k * 0.866, (k % 2) * 0.5];
  function chainOf(n) {
    const at = [], bonds = [];
    for (let k = 0; k <= n; k++) at.push(k < n ? zig(k) : [...zig(k), "O"]);
    for (let k = 0; k < n; k++) bonds.push([k, k + 1, k === n - 1 ? 2 : 1]);
    return { at, bonds };
  }
  function ringOf(aromatic) {
    const at = [], bonds = [];
    for (let k = 0; k < 6; k++) at.push([Math.cos((k * Math.PI) / 3), Math.sin((k * Math.PI) / 3)]);
    for (let k = 0; k < 6; k++) bonds.push([k, (k + 1) % 6, 1]);
    if (aromatic) for (const k of [0, 2, 4]) bonds.push([k, k + 1, 3]);
    return { at, bonds };
  }
  // (a corner more, bonded to corner `to`)
  const add = (m, x, y, to, order = 1, label) => {
    m.at.push(label ? [x, y, label] : [x, y]);
    m.bonds.push([to, m.at.length - 1, order]);
    return m.at.length - 1;
  };
  // the aldehyde's carbon on a ring's first corner, and its =O
  const cho = (m) => { const c = add(m, 2, 0, 0); add(m, 2.5, 0.866, c, 2, "O"); return m; };
  const AIR_LIST = [
    ["C-12 MNA", () => { const m = chainOf(11); add(m, zig(9)[0], 1.5, 9); return m; }],
    ["C-11 undecylenic", () => { const m = chainOf(11); m.bonds[0][2] = 2; return m; }],
    ["Vanillin", () => { const m = cho(ringOf(true)); const o = add(m, -1, 1.732, 2, 1, "O"); add(m, -2, 1.732, o); add(m, -2, 0, 3, 1, "HO"); return m; }],
    ["Cinnamal", () => { const m = ringOf(true); const a = add(m, 2, 0, 0); const b = add(m, 2.5, 0.866, a, 2); const c = add(m, 3.5, 0.866, b); add(m, 4, 0, c, 2, "O"); return m; }],
    ["C-10 decanal", () => chainOf(10)],
    ["Citral", () => { const m = chainOf(8); m.bonds[1][2] = 2; m.bonds[5][2] = 2; add(m, zig(1)[0], 1.5, 1); add(m, zig(5)[0], 1.5, 5); return m; }],
    ["Benzaldehyde", () => cho(ringOf(true))],
    ["Hydroxycitronellal", () => { const m = chainOf(8); add(m, zig(1)[0], 1.5, 1, 1, "OH"); add(m, 0, 1, 1); add(m, zig(5)[0], 1.5, 5); return m; }],
    ["C-12 lauric", () => chainOf(12)],
    ["Anisaldehyde", () => { const m = cho(ringOf(true)); const o = add(m, -2, 0, 3, 1, "O"); add(m, -2.5, 0.866, o); return m; }],
    ["Melonal", () => { const m = chainOf(7); m.bonds[1][2] = 2; add(m, zig(1)[0], 1.5, 1); add(m, zig(5)[0], 1.5, 5); return m; }],
    ["Safranal", () => { const m = cho(ringOf(false)); m.bonds.push([0, 1, 3], [2, 3, 3]); add(m, 1, 1.732, 1); add(m, 0.5, -1.866, 5); add(m, 1.366, -1.366, 5); return m; }],
    ["Phenylacetaldehyde", () => { const m = ringOf(true); const a = add(m, 2, 0, 0); const b = add(m, 2.5, 0.866, a); add(m, 3.5, 0.866, b, 2, "O"); return m; }],
    ["Cuminaldehyde", () => { const m = cho(ringOf(true)); const c = add(m, -2, 0, 3); add(m, -2.5, 0.866, c); add(m, -2.5, -0.866, c); return m; }],
    ["C-9 nonanal", () => chainOf(9)],
    ["C-8 octanal", () => chainOf(8)],
  ];
  const AIR_INKS = { bond: "rgb(226,220,210)", pi: "rgb(224,178,82)", lone: "rgb(169,138,216)", letter: "rgb(236,232,226)" };
  // Drawn by the aldehyde's own renderer, over it, in a scene of their own
  // measured in the window's pixels (y down): each a flat picture made once
  // and only moved and turned as it is drawn — no picture of the whole
  // window over the drawing (one, laid down every frame, had the last stage
  // drawing at half the frames of the rest, measured).
  const airScene = new THREE.Scene();
  const airCam = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
  const airPlane = new THREE.PlaneGeometry(1, 1);
  let airPlaced = [], airRatio = 1;
  const glyphs = {};
  function texture(canvas) {
    const t = new THREE.CanvasTexture(canvas);
    t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false;
    return t;
  }
  // a picture as a flat thing in that scene, w by h pixels
  function plate(map, w, h) {
    const mesh = new THREE.Mesh(airPlane, new THREE.MeshBasicMaterial({
      map, transparent: true, opacity: 0, depthTest: false, depthWrite: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    }));
    mesh.scale.set(w, -h, 1);   // (y down: the picture the right way up)
    mesh.frustumCulled = false;
    mesh.visible = false;
    airScene.add(mesh);
    return mesh;
  }
  // a letter — an O, an H — upright, as the formula's are set
  function glyph(text, size) {
    const key = text + "|" + size.toFixed(1) + "|" + airRatio;
    if (glyphs[key]) return glyphs[key];
    const c = document.createElement("canvas"), g = c.getContext("2d");
    const font = size.toFixed(1) + "px Arial, 'Liberation Sans', Helvetica, sans-serif";
    g.font = font;
    const w = Math.ceil(g.measureText(text).width) + 2, h = Math.ceil(size * 1.3);
    c.width = Math.ceil(w * airRatio); c.height = Math.ceil(h * airRatio);
    g.scale(airRatio, airRatio);
    g.font = font; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = AIR_INKS.letter;
    g.fillText(text, w / 2, h / 2 + size * 0.04);
    return (glyphs[key] = { map: texture(c), w, h });
  }

  // One molecule drawn once, in specks, into a picture of its own: its
  // bonds as fine lines of specks (the double bond to an O in gold, with a
  // little gold cloud along it; a ring's inner lines), and a faint violet
  // haze round each O for its lone pair. The letters are drawn upright as
  // it is laid down, not here. Its middle is the picture's middle.
  function airSprite(m, L) {
    const xs = m.at.map((a) => a[0]), ys = m.at.map((a) => a[1]);
    const pad = 0.7;
    const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
    const w = (maxX - minX) * L, h = (maxY - minY) * L;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(w * airRatio)); c.height = Math.max(1, Math.ceil(h * airRatio));
    const g = c.getContext("2d");
    g.scale(airRatio, airRatio);
    const P = (a) => [(a[0] - minX) * L, (maxY - a[1]) * L];
    const strand = (x0, y0, x1, y1, ink) => {
      const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(len / 0.95));
      const nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
      g.fillStyle = ink;
      for (let i = 0; i <= n; i++) {
        const t = i / n, j = (rand() - 0.5) * 0.5;
        g.globalAlpha = 0.45 + 0.5 * rand();
        g.beginPath();
        g.arc(x0 + (x1 - x0) * t + nx * j, y0 + (y1 - y0) * t + ny * j, 0.5 + 0.25 * rand(), 0, 6.283);
        g.fill();
      }
    };
    const cloud = (x, y, n, sx, sy, ink, alpha) => {
      g.fillStyle = ink;
      for (let i = 0; i < n; i++) {
        g.globalAlpha = alpha * (0.4 + 0.6 * rand());
        g.beginPath();
        g.arc(x + gauss() * sx, y + gauss() * sy, 0.45 + 0.3 * rand(), 0, 6.283);
        g.fill();
      }
    };
    const SHORT = 0.36 * L;                 // a bond stops short of a letter
    const cx = m.at.slice(0, 6).reduce((s, a) => s + a[0], 0) / 6;   // (a ring's middle, for its inner lines)
    const cy = m.at.slice(0, 6).reduce((s, a) => s + a[1], 0) / 6;
    for (const [i, j, order] of m.bonds) {
      let [x0, y0] = P(m.at[i]), [x1, y1] = P(m.at[j]);
      const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
      if (m.at[i][2]) { x0 += ux * SHORT; y0 += uy * SHORT; }
      if (m.at[j][2]) { x1 -= ux * SHORT; y1 -= uy * SHORT; }
      const nx = -uy, ny = ux;
      if (order === 3) {
        // a ring's double bond: an inner line, shorter, towards its middle
        const [mx, my] = P([cx, cy]);
        const side = Math.sign((mx - x0) * nx + (my - y0) * ny) || 1, off = 0.2 * L * side, cut = 0.17 * len;
        strand(x0 + ux * cut + nx * off, y0 + uy * cut + ny * off, x1 - ux * cut + nx * off, y1 - uy * cut + ny * off, AIR_INKS.bond);
      } else if (order === 2) {
        const toO = m.at[i][2] === "O" || m.at[j][2] === "O";
        const ink = toO ? AIR_INKS.pi : AIR_INKS.bond, off = 0.1 * L;
        strand(x0 + nx * off, y0 + ny * off, x1 + nx * off, y1 + ny * off, ink);
        strand(x0 - nx * off, y0 - ny * off, x1 - nx * off, y1 - ny * off, ink);
        if (toO) cloud((x0 + x1) / 2, (y0 + y1) / 2, 34, 0.28 * L, 0.28 * L, AIR_INKS.pi, 0.45);
      } else strand(x0, y0, x1, y1, AIR_INKS.bond);
    }
    // the lone pairs: a faint violet haze round every O
    for (const a of m.at) if (a[2]) { const [x, y] = P(a); cloud(x, y, 46, 0.36 * L, 0.36 * L, AIR_INKS.lone, 0.38); }
    g.globalAlpha = 1;
    // where its middle is, and its letters, from the picture's middle
    const ox = (minX + maxX) / 2, oy = (minY + maxY) / 2;
    const letters = m.at.filter((a) => a[2]).map((a) => ({ x: (a[0] - ox) * L, y: -(a[1] - oy) * L, text: a[2],
      // a hydrogen's side: away from the corner it hangs off
      side: a[2].length > 1 ? (a[2][0] === "H" ? -1 : 1) : 0 }));
    return { canvas: c, w, h, letters, pad: pad * L };
  }
  // its name, small, in the site's readings face
  function airLabel(text, size) {
    const c = document.createElement("canvas");
    const g = c.getContext("2d");
    const font = "500 " + size + "px 'IBM Plex Mono', ui-monospace, Menlo, monospace";
    const word = text.toUpperCase();
    // (spaced as the site's readings are, where the browser can)
    const spaced = (gc) => { gc.font = font; if ("letterSpacing" in gc) gc.letterSpacing = (size * 0.1).toFixed(2) + "px"; };
    spaced(g);
    const w = Math.ceil(g.measureText(word).width) + 2, h = Math.ceil(size * 1.5);
    c.width = Math.ceil(w * airRatio); c.height = Math.ceil(h * airRatio);
    g.scale(airRatio, airRatio);
    spaced(g);
    g.textBaseline = "middle";
    g.fillStyle = "rgb(214,208,200)";
    g.fillText(word, 1, h / 2);
    return { canvas: c, w, h };
  }

  // LAYING THEM IN THE GAPS: each, in turn, given AIR_TRIES places and
  // turns at random, and put at the one furthest from everything already
  // there that keeps clear of the window's edges, the Menu, the names (and
  // their aldehyde groups), the formula and its cloud, and the others; one
  // that finds nowhere is left out. The same places every time for one size
  // of window.
  function layAir(formHalf) {
    airRatio = renderer.getPixelRatio();
    airCam.right = W; airCam.bottom = H; airCam.updateProjectionMatrix();
    // (what was laid before, taken away)
    for (const m of airPlaced) for (const mesh of m.meshes) { airScene.remove(mesh); mesh.material.dispose(); if (mesh.userData.own) mesh.material.map.dispose(); }
    airPlaced = [];
    seed = 37;
    const L0 = Math.max(AIR_BOND[1], Math.min(AIR_BOND[2], W * AIR_BOND[0])) * (phone() ? 0.86 : 1);
    const labelSize = phone() ? 8 : 9;
    const keep = AIR_KEEP;
    const blocks = nameBoxes.map((b) => ({ l: b.l - keep.name, r: b.r + keep.name, t: b.t - keep.name, b: b.b + keep.name }));
    const menu = document.querySelector(".menu-trigger");
    if (menu) {
      const r = menu.getBoundingClientRect(), box = wrap.getBoundingClientRect();
      blocks.push({ l: r.left - box.left - 20, r: r.right - box.left + 30, t: r.top - box.top - 20, b: r.bottom - box.top + 24 });
    }
    const ex = { x: W / 2, y: H / 2, rx: formHalf * keep.formula, ry: formHalf * 1.06 * keep.formula };
    const inFormula = (x, y) => ((x - ex.x) / ex.rx) ** 2 + ((y - ex.y) / ex.ry) ** 2 < 1;
    const overlaps = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
    for (const [name, make] of AIR_LIST) {
      const m = make();
      const depth = AIR_DEPTH[0] + rand() * (AIR_DEPTH[1] - AIR_DEPTH[0]);
      const sprite = airSprite(m, L0 * depth);
      const label = airLabel(name, labelSize);
      let best = null, bestScore = -1;
      for (let t = 0; t < AIR_TRIES; t++) {
        const turn = (rand() - 0.5) * 0.9;
        const x = keep.edge + rand() * (W - 2 * keep.edge), y = keep.edge + rand() * (H - 2 * keep.edge);
        const c = Math.abs(Math.cos(turn)), s = Math.abs(Math.sin(turn));
        const bw = sprite.w * c + sprite.h * s, bh = sprite.w * s + sprite.h * c;
        const half = Math.max(bw, label.w) / 2;
        const box = { l: x - half, r: x + half, t: y - bh / 2, b: y + bh / 2 - 0.4 * sprite.pad + label.h };
        if (box.l < keep.edge || box.t < keep.edge || box.r > W - keep.edge || box.b > H - keep.edge) continue;
        if (blocks.some((b) => overlaps(box, b))) continue;
        if (airPlaced.some((p) => overlaps(box, { l: p.box.l - keep.apart, r: p.box.r + keep.apart, t: p.box.t - keep.apart, b: p.box.b + keep.apart }))) continue;
        // clear of the formula's cloud: round the box's edge, and its middle
        let clear = !inFormula(x, y);
        for (let k = 0; clear && k <= 12; k++) {
          const f = k / 12;
          clear = !inFormula(box.l + (box.r - box.l) * f, box.t) && !inFormula(box.l + (box.r - box.l) * f, box.b) &&
            !inFormula(box.l, box.t + (box.b - box.t) * f) && !inFormula(box.r, box.t + (box.b - box.t) * f);
        }
        if (!clear) continue;
        // as far as it can be from the others and the names
        let score = 1e9;
        for (const p of airPlaced) score = Math.min(score, Math.hypot(p.x - x, p.y - y));
        for (const b of blocks) score = Math.min(score, Math.hypot((b.l + b.r) / 2 - x, (b.t + b.b) / 2 - y) * 1.3);
        // (and from the window's edges, as if they were others: in the
        // gaps, not lined up along the edges)
        score = Math.min(score, 2.4 * Math.min(x, W - x, y, H - y));
        if (score > bestScore) { bestScore = score; best = { x, y, turn, box, bh, under: bh / 2 - 0.4 * sprite.pad }; }
      }
      if (!best) continue;
      // its plates: the molecule, its name, and its letters (shared)
      const body = plate(texture(sprite.canvas), sprite.w, sprite.h);
      const tag = plate(texture(label.canvas), label.w, label.h);
      body.userData.own = tag.userData.own = true;
      const size = Math.round(0.62 * L0 * depth * 2) / 2;
      const letters = sprite.letters.map((l) => ({ l, o: glyph("O", size), h: l.side ? glyph("H", size) : null }));
      const marks = letters.flatMap((x) => [x.o, x.h].filter(Boolean).map((gl) => plate(gl.map, gl.w, gl.h)));
      airPlaced.push({
        name, sprite, label, ...best, body, tag, letters, marks, size,
        meshes: [body, tag, ...marks],
        ink: 0.62 + 0.38 * depth,
        // its own moment as the stage comes, and its own drift and turn
        at: Math.min(0.6, airPlaced.length * 0.045 + rand() * 0.12),
        phase: [rand() * 6.283, rand() * 6.283, rand() * 6.283],
      });
    }
    // (for the tests: how many found a place, and where, on the drawing)
    wrap.dataset.aldehydes = String(airPlaced.length);
    wrap.aldehydes = airPlaced.map((p) => ({ name: p.name, x: p.x, y: p.y, box: p.box }));
  }

  // Every frame the last stage is there: each drifting a few pixels about
  // its place and turning a little, coming up at its own moment and from a
  // little further out, a little drawn to the hand and brightened by it; its
  // letters upright; its name under it. Drawn over the aldehyde by the same
  // renderer.
  function drawAir(t, down, hx, hy, pull) {
    if (!airPlaced.length) return;
    for (const m of airPlaced) {
      const show = down <= 0 ? 0 : REDUCE ? down : smooth((down - m.at) / 0.4);
      for (const mesh of m.meshes) mesh.visible = show > 0;
      if (show <= 0) continue;
      const [p0, p1, p2] = m.phase;
      let x = m.x + (REDUCE ? 0 : Math.sin(t * 0.11 + p0) * 5);
      let y = m.y + (REDUCE ? 0 : Math.cos(t * 0.09 + p1) * 4);
      // from a little further out, as it comes
      x = W / 2 + (x - W / 2) * (1 + 0.06 * (1 - show));
      y = H / 2 + (y - H / 2) * (1 + 0.06 * (1 - show));
      const turn = m.turn + (REDUCE ? 0 : Math.sin(t * 0.07 + p2) * 0.06);
      // the hand
      let near = 0;
      if (pull > 0) {
        const dx = hx - x, dy = hy - y;
        near = Math.exp(-(dx * dx + dy * dy) / (200 * 200)) * pull;
        x += dx * 0.05 * near; y += dy * 0.05 * near;
      }
      const a = Math.min(1, AIR_INK * m.ink * show * (1 + 0.45 * near));
      const cs = Math.cos(turn), sn = Math.sin(turn);
      m.body.position.set(x, y, 0);
      m.body.rotation.z = turn;
      m.body.material.opacity = a;
      // its letters, upright, where they stand once it is turned
      let k = 0;
      for (const { l, h } of m.letters) {
        const lx = x + l.x * cs - l.y * sn, ly = y + l.x * sn + l.y * cs;
        const o = m.marks[k++];
        o.position.set(lx, ly, 0);
        o.material.opacity = a;
        // (an H beside its O)
        if (h) { const hm = m.marks[k++]; hm.position.set(lx + l.side * m.size * 0.74, ly, 0); hm.material.opacity = a; }
      }
      // its name, under it
      m.tag.position.set(x, y + m.under + m.label.h / 2, 0);
      m.tag.material.opacity = a * 0.7;
    }
    if (down <= 0) return;
    renderer.autoClear = false;
    renderer.render(airScene, airCam);
    renderer.autoClear = true;
  }

  // ---- framing -------------------------------------------------------------
  // In the middle of the window, as large as the private page draws it; and,
  // upright and as the formula, as large as the room between the names leaves it.
  let W = 1, H = 1, distCloud = 10, distForm = 10, denseCloud = 1, denseForm = 1, pxForm = 100, thin = 1;
  const PHONE_THIN = 0.5;    // the share of the specks drawn on a phone (each the brighter for it)
  let band = false;
  const half = Math.tan((FOV * Math.PI) / 360);
  const density = (px) => Math.max(0.5, Math.min(1, (px / 190) ** 2));
  // How sharp it is drawn: nav.js's `Sharpness` (2026-10-01).
  const sharp = window.Sharpness ? window.Sharpness(() => size()) : null;
  function size() {
    box = null;
    const r = wrap.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const small = phone();
    // as sharp as the screen up to two, a phone too (it had 1.5 until
    // 2026-10-01 — "really not HD on the phone"); half the specks there
    // (`PHONE_THIN`) keep the fill under what it was; and a machine that
    // cannot keep up at that let down a step at a time, never below 1.5
    // (nav.js, `Sharpness`)
    renderer.setPixelRatio(sharp ? sharp.ratio : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    distCloud = Math.max(FIT_TALL / half, FIT_WIDE / (half * camera.aspect));
    // one angstrom on screen; the specks sized in angstrom so they grow and
    // shrink with the cloud, and a smaller cloud, packing them closer, drawn
    // fainter — as the private page does
    const px = (H / 2) / (half * distCloud);
    denseCloud = density(px);
    pxForm = px;
    const room = layRoom();
    if (room) pxForm = Math.max(20, Math.min(px * 1.05, room.halfW / FORM_EXTENT, room.halfH / FORM_EXTENT));
    distForm = (H / 2) / (half * pxForm);
    denseForm = density(pxForm);
    const scale = renderer.getPixelRatio();
    const cut = soft ? 0.2 : 1;
    // ON A PHONE, HALF THE SPECKS, EACH TWICE AS STRONG (2026-10-01). The
    // cloud is drawn some two and a quarter times smaller there, with every
    // one of its specks, each working its swirl out from scratch every frame
    // — more than twice as many to the inch as on a desktop. Half of them,
    // twice as bright, is the same light in the same place for half the
    // work, and still twice a desktop's to the inch.
    thin = small ? PHONE_THIN : 1;
    for (const name in parts) {
      const u = parts[name].material.uniforms;
      u.uSize.value = (small ? 1.25 : 1.5) * GROW[name] * scale;
      u.uTwo.value = soft || small ? 0 : 1;
      u.uAspect.value = W / H;
      parts[name].geometry.setDrawRange(0, Math.min(D.parts[name].n, Math.round(SHARE[name] * EMPHASIS[name] * cut * thin)));
    }
    bonds.material.uniforms.uSize.value = (small ? 1.8 : 2.2) * scale;
    // the sillage leaves the edge of the formula's cloud and goes out past
    // the window's corners; the aldehydes stand in the gaps it leaves
    const formHalf = FORM_EXTENT * pxForm;
    const su = sillMat.uniforms;
    su.uSize.value = (small ? 1.7 : 1.9) * scale;
    su.uRes.value.set(W, H);
    su.uMid.value.set(W / 2, H / 2);
    su.uFrom.value = formHalf * SILL_FROM;
    su.uReach.value = (Math.hypot(W, H) / 2) * SILL_REACH;
    if (formula && links.length === 8) layAir(formHalf);
    hazeMat.uniforms.uSize.value = (small ? 1.4 : 1.6) * scale;    // small (it was 2.2 and 2.6)
    hazeMat.uniforms.uRes.value.set(W, H);
    hazeMat.uniforms.uSwirl.value = small ? LINE_SWIRL * 0.8 : LINE_SWIRL;
    names.forEach((n) => { n.el.style.fontSize = (ATOM_SIZE * pxForm).toFixed(1) + "px"; });
    drewAt = -1;
    if (REDUCE || !running) draw(performance.now());
  }

  // LAYING THE ROOM: where the formula's room is between the names — the
  // grid's middle column (style.css), or, on a narrow window (the BAND, the
  // names above and below the formula), between the rows — and where each
  // name stands, for its backdrop and for the aldehydes in the gaps to keep
  // clear of; and the sillage's specks, made again only when the window's
  // size changes. Returns the room the formula has between the names.
  const PALE = [0.86, 0.84, 0.8];
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rand() * 0.999)) * Math.cos(2 * Math.PI * rand());
  let laidFor = "";
  let nameBoxes = [];
  function layRoom() {
    if (!formula || links.length !== 8) return null;
    const menu = links[0].parentNode;
    const cs = getComputedStyle(menu);
    band = cs.getPropertyValue("--formula-layout").trim() === "band";
    const cols = cs.gridTemplateColumns.split(/\s+/).map(parseFloat);
    const box = wrap.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    const left = m.left - box.left + (parseFloat(cs.paddingLeft) || 0) + (cols[0] || 0);
    const right = left + (cols[1] || 0);
    const rects = links.map((a) => a.getBoundingClientRect());
    // each name's backdrop stands round the name's own lettering (the link
    // less its padding)
    const hu = hazeMat.uniforms;
    links.forEach((a, k) => {
      const r = rects[k], ls = getComputedStyle(a);
      const padX = parseFloat(ls.paddingLeft) || 0, padY = parseFloat(ls.paddingTop) || 0;
      hu.uWordX.value[k] = r.left - box.left + r.width / 2;
      hu.uWordY.value[k] = r.top - box.top + r.height / 2;
      hu.uHalfW.value[k] = Math.max(8, r.width / 2 - padX);
      hu.uHalfH.value[k] = Math.max(6, r.height / 2 - padY);
    });
    layHaze();
    let halfW, halfH;
    if (band) {
      const top = Math.max(...[0, 1, 4, 5].map((i) => rects[i].bottom)) - box.top;
      const foot = Math.min(...[2, 3, 6, 7].map((i) => rects[i].top)) - box.top;
      halfH = (foot - top) / 2 - 12;
      halfW = W / 2 - 18;
    } else {
      // (a quarter of the room left clear either side: the aldehyde's space)
      halfW = ((right - left) / 2) * 0.78;
      halfH = H / 2 - 64;
    }
    // what the aldehydes in the gaps keep clear of: each name, and its
    // aldehyde group (landing.js), on the drawing
    nameBoxes = links.map((a, k) => {
      const r = rects[k];
      const b = { l: r.left - box.left, t: r.top - box.top, r: r.right - box.left, b: r.bottom - box.top };
      const tail = a.querySelector(".formula-tail");
      const tr = tail && getComputedStyle(tail).display !== "none" ? tail.getBoundingClientRect() : null;
      if (tr && tr.width) {
        b.l = Math.min(b.l, tr.left - box.left); b.r = Math.max(b.r, tr.right - box.left);
        b.t = Math.min(b.t, tr.top - box.top); b.b = Math.max(b.b, tr.bottom - box.top);
      }
      return b;
    });
    // the sillage's specks, made again only when the window's size changes
    const n = Math.round(W * H * SILL_DENSITY * (phone() ? 0.6 : 1) * (soft ? 0.15 : 1));
    const key = String(n);
    if (key !== laidFor) {
      laidFor = key;
      seed = 11;
      const sl = new Float32Array(n * 4), tone = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        sl[i * 4] = rand();                                                  // its direction
        sl[i * 4 + 1] = rand();                                              // its moment in its life
        sl[i * 4 + 2] = SILL_LIFE[0] + rand() * (SILL_LIFE[1] - SILL_LIFE[0]);   // how long that is
        sl[i * 4 + 3] = rand();
        let x = rand(), c = PALE;
        for (const [share, name] of SILL_TONES) { if (x < share) { c = COLOUR[name]; break; } x -= share; }
        // most faint, a few a little stronger
        const ink = 0.3 + 0.7 * rand();
        tone[i * 3] = c[0] * ink; tone[i * 3 + 1] = c[1] * ink; tone[i * 3 + 2] = c[2] * ink;
      }
      sillGeo.dispose();
      sillGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      sillGeo.setAttribute("aSill", new THREE.BufferAttribute(sl, 4));
      sillGeo.setAttribute("aTone", new THREE.BufferAttribute(tone, 3));
      sillGeo.setDrawRange(0, n);
    }
    return { halfW, halfH };
  }

  // The specks of every name's backdrop, made once (a name's shape is in
  // the shader, from where the name stands).
  let hazeLaid = false;
  function layHaze() {
    if (hazeLaid) return;
    hazeLaid = true;
    seed = 23;
    const per = Math.round(HAZE_PER_NAME * (phone() ? 0.6 : 1) * (soft ? 0.3 : 1));
    const n = per * 8;
    const hz = new Float32Array(n * 4), tone = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      hz[i * 4] = Math.floor(i / per);
      hz[i * 4 + 1] = gauss() * 0.9;
      hz[i * 4 + 2] = gauss() * 0.9;
      hz[i * 4 + 3] = rand();
      let x = rand(), c = COLOUR.rest;
      for (const [share, name] of HAZE_TONES) { if (x < share) { c = COLOUR[name]; break; } x -= share; }
      const lit = 0.95 + 0.4 * rand();
      tone[i * 3] = c[0] * lit; tone[i * 3 + 1] = c[1] * lit; tone[i * 3 + 2] = c[2] * lit;
    }
    hazeGeo.dispose();
    hazeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    hazeGeo.setAttribute("aHaze", new THREE.BufferAttribute(hz, 4));
    hazeGeo.setAttribute("aTone", new THREE.BufferAttribute(tone, 3));
    hazeGeo.setDrawRange(0, n);
  }

  // ---- where the drawing stands on the window --------------------------------
  // Read when the page has scrolled or the window changed — at the head of a
  // frame, before anything has been written in it — and kept.
  let box = null;
  const boxNow = () => box || (box = wrap.getBoundingClientRect());
  const container = document.getElementById("scroll-container");
  const forget = () => { box = null; };
  if (container) container.addEventListener("scroll", () => { box = wrap.getBoundingClientRect(); }, { passive: true });
  window.addEventListener("resize", forget);

  // ---- the hand ------------------------------------------------------------
  // A name is lit while the hand or the keys are on it, and while it asks
  // to be left for (landing.js marks it `is-lit`).
  const hotTo = new Float32Array(8), heat = new Float32Array(8);
  const litNow = (a) => a.matches(":hover") || a.matches(":focus-visible") || a.classList.contains("is-lit");
  // (read on every frame; these only ask for one when the drawing is still)
  const again = () => { drewAt = -1; };
  links.forEach((a) => ["pointerenter", "pointerleave", "focus", "blur"].forEach((ev) => a.addEventListener(ev, again)));
  // The hand itself, on a mouse or a pen (a finger has none to hover with).
  let lean = { x: 0, y: 0 }, leanTo = { x: 0, y: 0 };
  const pointer = { x: 0, y: 0, on: false };
  const eased = { x: 0, y: 0 };
  let pull = 0;
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    leanTo = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    if (!pointer.on) { eased.x = e.clientX; eased.y = e.clientY; }
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.on = true;
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { pointer.on = false; });
  window.addEventListener("blur", () => { pointer.on = false; });

  let S = 0;
  const qCloud = new THREE.Quaternion(), qForm = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const v = new THREE.Vector3();
  function toScreen(p) {
    v.copy(p).applyMatrix4(mol.matrixWorld).project(camera);
    return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H };
  }
  let namesShown = true;

  // The drawing's own clock: it runs only while the drawing is drawn, so
  // that coming back from under the menu or About me it carries on from
  // where it was, rather than jumping on by however long it was covered.
  let clock = 0, last = performance.now();
  let turnAt = -1, turnV = 0;   // the turn upright as drawn, and how fast it is turning
  function draw(now) {
    // (a slow frame moves the clocks on by a quarter of a second at most:
    // a machine without a graphics card is slow, not stopped)
    const dt = Math.min(250, Math.max(0, now - last));
    last = now;
    clock += dt;
    const t = REDUCE ? 0 : clock / 1000;
    const gather = REDUCE ? 1 : Math.min(1, clock / GATHER_MS);

    // where the stage is (landing.js follows the page, smoothly)
    S = Math.max(0, Math.min(4, +window.__formula || 0));
    // the turn upright: where the page says, followed on its spring
    const turnTo = smooth((S - TURN_FROM) / (2 - TURN_FROM));
    if (REDUCE || turnAt < 0) { turnAt = turnTo; turnV = 0; }
    else {
      for (let left = dt / 1000; left > 1e-6; left -= 1 / 120) {
        const h = Math.min(1 / 120, left);
        turnV += (TURN_W * TURN_W * (turnTo - turnAt) - 2 * TURN_W * turnV) * h;
        turnAt += turnV * h;
      }
      if (Math.abs(turnTo - turnAt) < 0.0005 && Math.abs(turnV) < 0.002) { turnAt = turnTo; turnV = 0; }
    }
    const turned = Math.max(0, Math.min(1, turnAt));                    // upright
    wrap.turned = turned;   // (for the tests: how far it has turned, 0 to 1)
    const upright = smooth((turned - 0.72) / 0.28);                      // and the formula may come
    const formed = Math.min(smooth((S - FORM_FROM) / (3 - FORM_FROM)), upright);   // its formula
    const down = smooth((S - 3) / DRIFT_OVER);                  // the last stage comes up
    const react = REACT_TITLE + (1 - REACT_TITLE) * smooth((S - 0.15) / 1.1);

    // the hand (where the drawing stands, read when the page moves, not
    // here: read here, straight after landing.js has set the page for this
    // frame, it made the browser lay the page out again every frame)
    const box = boxNow();
    const handOn = !REDUCE && pointer.on && !document.body.classList.contains("ask-shown") &&
      pointer.y >= box.top && pointer.y <= box.bottom;
    pull += ((handOn ? 1 : 0) - pull) * Math.min(1, dt / 220);
    if (pull < 0.002) pull = 0;
    const follow = Math.min(1, dt / 70);
    eased.x += (pointer.x - eased.x) * follow;
    eased.y += (pointer.y - eased.y) * follow;
    hand.x = ((eased.x - box.left) / W) * 2 - 1;
    hand.y = 1 - ((eased.y - box.top) / H) * 2;
    charge.style.transform = "translate(" + (eased.x - box.left + 13).toFixed(1) + "px," + (eased.y - box.top + 15).toFixed(1) + "px)";
    charge.classList.toggle("is-on", pull * react > 0.4);

    if (!REDUCE) { lean.x += (leanTo.x * react - lean.x) * 0.04; lean.y += (leanTo.y * react - lean.y) * 0.04; }
    const sway = REDUCE ? 0 : Math.sin((t * 2 * Math.PI) / SWAY_S);
    euler.set(SIDE.pitch + lean.y * LEAN, SIDE.yaw + SWAY * sway + lean.x * LEAN, 0);
    qCloud.setFromEuler(euler).multiply(CLOUD_BODY);
    euler.set(lean.y * LEAN * 0.6, FORM_SWAY * sway + lean.x * LEAN * 0.6, 0);
    qForm.setFromEuler(euler).multiply(FORM_BODY);
    mol.quaternion.copy(qCloud).slerp(qForm, turned);
    camera.position.set(0, 0, distCloud + (distForm - distCloud) * turned);
    camera.updateMatrixWorld();   // (the names are placed before the frame is drawn)
    scene.updateMatrixWorld();

    const dense = denseCloud + (denseForm - denseCloud) * turned;
    for (const name in parts) {
      const m = parts[name].material.uniforms;
      m.uTime.value = t * PACE; m.uGather.value = gather;
      m.uConcrete.value = formed;
      m.uFlow.value = REDUCE ? 0 : FLOW * (1 - (1 - FORM_FLOW) * formed);
      m.uAlpha.value = Math.min(1, (PEAK[name] + (FORM_PEAK[name] - PEAK[name]) * formed) * dense / thin);
      m.uHand.value.set(hand.x, hand.y);
      m.uPull.value = pull * react;
    }

    // the formula: the bonds drawn out of the C, then the names of the atoms
    const grow = Math.min(smooth((S - 2) / 0.85), upright);
    bonds.visible = grow > 0;
    bonds.material.uniforms.uGrow.value = grow * 1.1;
    bonds.material.uniforms.uAlpha.value = 0.9 * dense;
    const named = Math.min(smooth((S - 2.3) / 0.65), upright);
    if (named > 0 || namesShown) {
      for (const n of names) {
        const s = toScreen(n.at);
        n.el.style.transform = "translate(" + s.x.toFixed(1) + "px," + s.y.toFixed(1) + "px) translate(-50%,-50%)";
        n.el.style.opacity = named.toFixed(3);
      }
      namesShown = named > 0;
    }

    // the sillage, and the names lit with their backdrops
    for (let k = 0; k < links.length && k < 8; k++) {
      hotTo[k] = litNow(links[k]) ? 1 : 0;
      // (the backdrop comes and goes slowly, as the name itself does)
      heat[k] += (hotTo[k] - heat[k]) * (REDUCE ? 1 : Math.min(1, dt / HAZE_EASE));
      if (Math.abs(heat[k] - hotTo[k]) < 0.002) heat[k] = hotTo[k];
    }
    sill.visible = laidFor !== "" && down > 0;
    if (sill.visible) {
      const m = sillMat.uniforms;
      m.uTime.value = t;
      m.uDraw.value = down;
      m.uPull.value = pull;
      m.uHandPx.value.set(eased.x - box.left, eased.y - box.top);
      // the scent reaching out into the room as the last stage comes
      m.uOut.value = m.uFrom.value + (m.uReach.value + 120 - m.uFrom.value) * (REDUCE ? down : smooth(down * 1.1));
    }
    haze.visible = hazeLaid && down > 0 && heat.some((h) => h > 0.002);
    if (haze.visible) {
      const m = hazeMat.uniforms;
      m.uTime.value = t;
      m.uPull.value = pull;
      m.uHandPx.value.set(eased.x - box.left, eased.y - box.top);
      for (let k = 0; k < 8; k++) m.uHeat.value[k] = heat[k] * down;
    }

    renderer.render(scene, camera);
    drawAir(t, down, eased.x - box.left, eased.y - box.top, pull);

    // Where it is, said on the drawing for anything that wants to know (the
    // tests): cloud (the first two stages), turning, turned, forming,
    // formula, drifting (the last stage coming up — the words kept from the
    // drift it was for a day), drift (it there, and the names).
    // (turning for as long as it is still turning, whatever the page says)
    const state = S <= 1.02 && turned < 0.01 ? "cloud" : S < 1.98 || turned < 0.995 ? "turning" : S <= 2.02 ? "turned"
      : S < 2.98 ? "forming" : S <= 3.02 ? "formula" : down < 0.999 ? "drifting" : "drift";
    if (state !== wrap.dataset.state) wrap.dataset.state = state;
    return turnAt !== turnTo || heat.some((h, k) => h !== hotTo[k]);
  }

  // Drawn only while the stage is on the screen, and not under the menu or
  // About me — but under the way out it goes on (2026-09-30: "When the
  // popup window happens, I also want the page in the back to keep
  // moving"), the hand letting go of it — and, with motion turned off, only when
  // something has changed (the stage moved on, a name pointed at, the
  // window resized).
  // (Under the menu or About me it stops only once either has come all the
  // way up — COVER_MS — so it never stands still while it can still be seen:
  // stopping the moment About me was pressed read as the page catching.)
  const COVER_MS = 650;
  let seen = true, running = false, drawn = 0, drewAt = -1, coverSince = 0;
  function loop(now) {
    running = false;
    if (!seen) return;
    const body = document.body.classList;
    if (body.contains("menu-open") || body.contains("about-shown")) { if (!coverSince) coverSince = now; }
    else coverSince = 0;
    const covered = coverSince > 0 && now - coverSince > COVER_MS;
    const changed = !REDUCE || drewAt !== (+window.__formula || 0);
    if (!covered && changed) {
      // (a frame skipped on a machine without a graphics card is still time
      // gone: the clock counts it at the next one drawn)
      if (!soft || now - drawn > 80) {
        if (sharp) sharp.frame(now);
        const more = draw(now);
        drawn = now;
        drewAt = more ? -1 : (+window.__formula || 0);
      }
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
  }).observe(first);
  size();
  // laid again once the page's own face has come (the names' places move)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => size());
  wrap.classList.add("molecule-drawn");
  wake();
})();

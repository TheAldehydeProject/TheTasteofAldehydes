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
//   5  (S 4) THE SILLAGE and THE ORBIT: from S 3 the aldehyde's own scent
//      spreads out of it into the room on every side ("rework ... the
//      particles surrounding the main aldehyde molecule", 2026-10-03, last),
//      and on a wide window the Menu's eight pages come up on a ring of
//      specks round it, each beside an electron of its own (2026-10-04:
//      "remove the chemicals and redesign it again. KEEP THE MIDDLE
//      ALDEHYDE AS IT IS"; landing.js places them). For a day a very light
//      drift of specks fell either side, as ADAR's dust does, and for a day
//      the aldehydes of perfumery stood in the gaps; until then two LINES of
//      specks came down the window, the names on the outside of them; none
//      of it is in this file now.
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
  // orbit — coming up from 3 over DRIFT_OVER, the names after it
  // (landing.js).
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
  // HOW IT MOVES, TO CHOOSE FROM (2026-10-04, later — the owner: "the
  // colour and size are very good. idk about the movement. if you want give
  // me suggestions what would be stylistically possible"). The sillage's
  // colours, sizes and numbers are the same in every one; only how its
  // specks go differs, and none of them ever crosses the aldehyde's cloud.
  // What the page draws is DIFFUSE, as it was; the others are shown by the
  // address alone, `?sillage=` and the name, for the owner to look at:
  //   diffuse  out from the aldehyde on every side, slowing as it spreads
  //   rise     rising up the window like vapour off warm skin, swaying
  //   swirl    circling the aldehyde, slowly, the near ones the quicker
  //   still    still air: each speck wandering a few pixels about its place
  //   breeze   carried across the room, left to right, on a slow wavy air
  // Once one is chosen, the rest come out of the code.
  const SILL_MOVES = ["diffuse", "rise", "swirl", "still", "breeze"];
  const SILL_MOVE = (location.search.match(/[?&]sillage=([a-z]+)/) || [])[1];
  const MOVE = SILL_MOVES.includes(SILL_MOVE) ? SILL_MOVE : "diffuse";
  // THE ORBIT (2026-10-04, in place of the aldehydes of perfumery — the
  // owner: "For the menu in the second page, i dont like it. I want you to
  // remove the chemicals and redesign it again. KEEP THE MIDDLE ALDEHYDE AS
  // IT IS"): on a wide window the Menu's eight pages stand on an orbit round
  // the aldehyde, drawn here where landing.js says it stands (`--orbit-*` on
  // the names' nav) — and an ELECTRON for each page beside its name (its
  // place round the ring, `--oa` on the name). Under the hand (or the keys,
  // or while the page is asked for) a name's electron and the stretch of ring
  // round it light up in the aldehyde's gold, as gradually as the name comes
  // up. It is traced round from the top, both ways, as the last stage comes;
  // quiet under the names' letters; brightened a little by the
  // electronegative hand (it was drawn to it, until the ring was a line).
  // Nothing of it touches the aldehyde: it stands well outside its cloud.
  //
  // A LINE, NOT A CRAWL (2026-10-04, later: "the spinning ring of particles
  // look sketchy"): the ring was a scatter of specks each going round at a
  // speed of its own, some the other way, a few off the line, every one
  // trembling — a pencil line, broken and crawling. It is one even, still
  // hairline now, its specks laid closer than a pixel apart so they read as
  // a line (as the formula's bonds are drawn), the half of it turned away
  // from you fainter than the half turned towards you (ORBIT_FAR), so it
  // reads as an orbit seen at a slant; and an electron is a small still
  // point of light, a warm white heart in a soft gold glow, breathing slowly.
  // How many specks to a pixel of the ring, and how strong each; the far
  // half's strength, of the near half's; an electron's specks at its heart
  // and in its glow, and how wide the glow is (pixels); how far round a lit
  // electron the ring lights (radians); the ring's colour. The hand only
  // brightens it a little: bent, the line would leave its electrons.
  const ORBIT_DENSITY = 2.4;
  const ORBIT_INK = 0.24;
  const ORBIT_FAR = 0.45;
  const ELECTRON = [8, 30, 3];
  const ORBIT_LIT = 0.32;
  const ORBIT_TONE = [0.86, 0.8, 0.68];
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

  // Each move works out where a speck is (`p`) and how much of it shows
  // (`fade`); DIFFUSE is the sillage as it was, word for word.
  const MOVE_GLSL = {
    diffuse: `
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
`,
    // RISE: each speck its own column (`aSill.x`), rising from below the
    // window to above it over its life, swaying and carried a little sideways
    rise: `
      float u = fract(aSill.y + uTime * 1.2 / aSill.z);
      float x0 = aSill.x * (uRes.x + 120.0) - 60.0;
      vec2 p = vec2(x0, uRes.y + 40.0 - u * (uRes.y + 80.0));
      float n = snoise(vec3(x0 * 0.004, p.y * 0.003, uTime * 0.04 + seed * 4.0));
      p.x += 26.0 * n + 10.0 * sin(uTime * 0.3 + seed * 30.0);
      float fade = smoothstep(0.0, 0.1, u) * (1.0 - smoothstep(0.8, 1.0, u));`,
    // SWIRL: each speck at its own distance out (`aSill.y`), going round,
    // the nearer the quicker in its turning, breathing in and out a little
    swirl: `
      float r0 = uFrom + (uReach - uFrom) * aSill.y;
      float turn = 0.045 * pow(uFrom / r0, 0.5) * (0.85 + 0.3 * fract(seed * 5.3));
      float a = aSill.x * 6.2832 + uTime * turn;
      vec2 p = uMid + vec2(cos(a), sin(a) * 1.06) * r0;
      float n = snoise(vec3(p * 0.003, uTime * 0.03 + seed * 4.0));
      p += 7.0 * n * vec2(cos(a), sin(a));
      float v = fract(seed * 7.13 + uTime / aSill.z);
      float fade = smoothstep(0.0, 0.2, v) * (1.0 - smoothstep(0.8, 1.0, v));`,
    // STILL: each speck at its own place round the aldehyde, wandering a
    // few pixels about it, as a molecule in still air does
    still: `
      float r0 = uFrom + (uReach - uFrom) * aSill.y;
      float a = aSill.x * 6.2832;
      vec2 p = uMid + vec2(cos(a), sin(a) * 1.06) * r0;
      float n = snoise(vec3(seed * 37.0, uTime * 0.11, seed * 11.0));
      float w = n * 4.0 + seed * 6.2832;
      p += (2.0 + 5.0 * abs(n)) * vec2(cos(w), sin(w));
      float v = fract(seed * 7.13 + uTime * 0.6 / aSill.z);
      float fade = smoothstep(0.0, 0.2, v) * (1.0 - smoothstep(0.8, 1.0, v));`,
    // BREEZE: each speck at its own height (`aSill.y`), carried left to
    // right across the room and round again, on a slow wavy air
    breeze: `
      float span = uRes.x + 240.0;
      float x = mod(aSill.x * span + uTime * span / (aSill.z * 1.5), span) - 120.0;
      float y0 = aSill.y * (uRes.y + 80.0) - 40.0;
      float n = snoise(vec3(x * 0.0025, y0 * 0.004, uTime * 0.035 + seed * 4.0));
      vec2 p = vec2(x, y0 + 30.0 * n + 14.0 * sin(x * 0.006 + seed * 6.2832));
      float fade = smoothstep(-120.0, 40.0, x) * (1.0 - smoothstep(uRes.x - 40.0, uRes.x + 120.0, x));`,
  };
  // Every move but diffuse: kept off the aldehyde's cloud, shown only as far
  // out as the scent has reached, and — where it fills the room evenly —
  // fainter the further from the aldehyde, so it still thins as it spreads.
  const MOVE_TAIL = MOVE === "diffuse" ? "" : `
      vec2 q = p - uMid;
      float rr = length(vec2(q.x, q.y / 1.06));
      fade *= smoothstep(uFrom * 0.92, uFrom * 1.12, rr);
      fade *= 1.0 - smoothstep(uOut - 90.0, uOut, rr);
      ${MOVE === "rise" || MOVE === "breeze"
        ? "fade *= clamp(pow(uFrom * 1.5 / max(rr, 1.0), 0.75), 0.25, 1.0);"
        : "fade *= 1.0 - 0.85 * smoothstep(0.6, 1.0, (rr - uFrom) / (uReach - uFrom));"}`;

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
${MOVE_GLSL[MOVE]}${MOVE_TAIL}
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

  // THE ORBIT, drawn straight onto the window in its pixels like the
  // sillage: every speck either lies on the ring (`aOrb.x` -1, at its own
  // place round it, `aOrb.y` of a turn, still) or is one of a name's
  // electron (`aOrb.x` the name, 0 to 7; `aOrb.z` 0 its heart, 1 its glow),
  // standing `aOff` pixels off the electron's point. The ring is an ellipse
  // about `uMid`, `uRx` by `uRy`, turned `uTilt`; its lower half is the
  // near one.
  const ORBIT_VERTEX = `
    uniform vec2 uRes, uHandPx, uMid;
    uniform float uTime, uDraw, uReveal, uSize, uPull, uRx, uRy, uTilt;
    uniform float uHeat[8], uAng[8], uWordX[8], uWordY[8], uHalfW[8], uHalfH[8];
    attribute vec4 aOrb;
    attribute vec2 aOff;
    attribute vec3 aTone;
    varying vec3 vColour;
    varying float vAlpha;
    float round1(float a) { return mod(a + 3.14159265, 6.2831853) - 3.14159265; }
    void main() {
      float who = aOrb.x, seed = aOrb.w;
      bool electron = who > -0.5;
      bool glow = aOrb.z > 0.5;
      float a = 6.2831853 * aOrb.y;
      float own = 0.0, phase = 0.0;
      if (electron) {
        for (int i = 0; i < 8; i++) if (i == int(who + 0.5)) { a = uAng[i]; own = uHeat[i]; phase = float(i) * 1.7; }
      }
      float c = cos(uTilt), s = sin(uTilt);
      vec2 e = vec2(cos(a) * uRx, sin(a) * uRy);
      vec2 p = uMid + vec2(e.x * c - e.y * s, e.x * s + e.y * c) + aOff;
      // near and far: the lower half turned towards you
      float depth = mix(${ORBIT_FAR.toFixed(3)}, 1.0, 0.5 + 0.5 * sin(a));
      // traced round from the top, both ways, as the last stage comes
      float fromTop = abs(round1(a + 1.5707963)) / 3.14159265;
      float shown = 1.0 - smoothstep(uReveal - 0.1, uReveal, fromTop);
      // lit round a name the hand is on
      float lit = own;
      if (!electron) {
        for (int i = 0; i < 8; i++) {
          float d = round1(a - uAng[i]);
          lit = max(lit, uHeat[i] * exp(-d * d / ${(ORBIT_LIT * ORBIT_LIT).toFixed(4)}));
        }
      }
      // quiet under the names' letters (the ring: an electron stands beside
      // its name, and is never quietened)
      float under = 0.0;
      if (!electron) {
        for (int i = 0; i < 8; i++) {
          float q = max(abs(p.x - uWordX[i]) / max(uHalfW[i], 1.0), abs(p.y - uWordY[i]) / max(uHalfH[i], 1.0));
          under = max(under, 1.0 - smoothstep(0.95, 1.3, q));
        }
      }
      // the hand: the ring a little brighter near it, and never bent — a
      // line, with each electron on it, where its name is
      float near = 0.0;
      if (uPull > 0.0) {
        vec2 d = uHandPx - p;
        near = exp(-dot(d, d) / (${LINE_REACH.toFixed(1)} * ${LINE_REACH.toFixed(1)})) * uPull;
      }
      vec3 gold = vec3(${COLOUR.pi.map((v) => v.toFixed(3)).join(", ")});
      float alpha;
      if (electron) {
        // a still point of light, breathing slowly
        float breath = 0.86 + 0.14 * sin(uTime * 0.8 + phase);
        vColour = mix(aTone, gold * 1.15, lit * (glow ? 0.8 : 0.45)) * (1.0 + 0.5 * lit + ${(HAND_LIGHT * LINE_LIGHT).toFixed(3)} * near);
        alpha = (glow ? 0.5 + 0.4 * lit : 1.0) * breath * mix(0.8, 1.0, depth);
      } else {
        vColour = mix(aTone, gold * 1.15, lit * 0.8) * (1.0 + 1.2 * lit + ${(HAND_LIGHT * LINE_LIGHT).toFixed(3)} * near);
        alpha = depth * (1.0 + 1.5 * lit);
      }
      vAlpha = uDraw * shown * (1.0 - 0.85 * under) * alpha;
      if (vAlpha <= 0.002) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
      gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
      gl_PointSize = uSize * (electron ? (glow ? 1.3 : 2.3) * (1.0 + 0.2 * lit) : 0.9);
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

  // ---- the orbit --------------------------------------------------------------
  const orbitGeo = new THREE.BufferGeometry();
  const orbitMat = new THREE.ShaderMaterial({
    vertexShader: ORBIT_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uMid: { value: new THREE.Vector2() },
      uHandPx: { value: new THREE.Vector2() },
      uTime: { value: 0 }, uDraw: { value: 0 }, uReveal: { value: 0 }, uSize: { value: 2 },
      uPull: { value: 0 }, uAlpha: { value: ORBIT_INK },
      uRx: { value: 100 }, uRy: { value: 100 }, uTilt: { value: 0 },
      uHeat: { value: new Float32Array(8) }, uAng: { value: new Float32Array(8) },
      // (where the names' letters are: the backdrop's own numbers, shared)
      uWordX: { value: hazeMat.uniforms.uWordX.value }, uWordY: { value: hazeMat.uniforms.uWordY.value },
      uHalfW: { value: hazeMat.uniforms.uHalfW.value }, uHalfH: { value: hazeMat.uniforms.uHalfH.value },
    },
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  });
  const orbit = new THREE.Points(orbitGeo, orbitMat);
  orbit.frustumCulled = false;
  orbit.renderOrder = 6;
  orbit.visible = false;
  scene.add(orbit);
  let orbitOn = false, orbitLaid = "";

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
    orbitGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
    orbitGeo.setAttribute("aOrb", new THREE.BufferAttribute(new Float32Array(4), 4));
    orbitGeo.setAttribute("aOff", new THREE.BufferAttribute(new Float32Array(2), 2));
    orbitGeo.setAttribute("aTone", new THREE.BufferAttribute(new Float32Array(3), 3));
    orbit.visible = true;
    renderer.compile(scene, camera);
    const programs = renderer.info.programs || [];
    if (programs.some((p) => p.diagnostics && p.diagnostics.runnable === false)) throw new Error("shader");
    bonds.visible = false;
    sill.visible = false;
    haze.visible = false;
    orbit.visible = false;
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
    // the window's corners
    const formHalf = FORM_EXTENT * pxForm;
    const su = sillMat.uniforms;
    su.uSize.value = (small ? 1.7 : 1.9) * scale;
    su.uRes.value.set(W, H);
    su.uMid.value.set(W / 2, H / 2);
    su.uFrom.value = formHalf * SILL_FROM;
    su.uReach.value = (Math.hypot(W, H) / 2) * SILL_REACH;
    hazeMat.uniforms.uSize.value = (small ? 1.4 : 1.6) * scale;    // small (it was 2.2 and 2.6)
    hazeMat.uniforms.uRes.value.set(W, H);
    orbitMat.uniforms.uRes.value.set(W, H);
    orbitMat.uniforms.uSize.value = 1.8 * scale;
    hazeMat.uniforms.uSwirl.value = small ? LINE_SWIRL * 0.8 : LINE_SWIRL;
    names.forEach((n) => { n.el.style.fontSize = (ATOM_SIZE * pxForm).toFixed(1) + "px"; });
    drewAt = -1;
    if (REDUCE || !running) draw(performance.now());
  }

  // LAYING THE ROOM: where the formula's room is between the names — the
  // grid's middle column (style.css), or, on a narrow window (the BAND, the
  // names above and below the formula), between the rows — and where each
  // name stands, for its backdrop and the orbit's quiet under it; and the
  // orbit (`layOrbit`); and the sillage's specks, made again only when the window's
  // size changes. Returns the room the formula has between the names.
  const PALE = [0.86, 0.84, 0.8];
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rand() * 0.999)) * Math.cos(2 * Math.PI * rand());
  let laidFor = "";
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
    layOrbit(cs, box);
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

  // THE ORBIT, laid where landing.js says it stands (on a wide window only),
  // its specks made again only when its length changes.
  function layOrbit(cs, box) {
    const menu = links[0].parentNode;
    orbitOn = !band && menu.classList.contains("orbit-laid");
    if (!orbitOn) return;
    const px = (name) => parseFloat(cs.getPropertyValue(name)) || 0;
    const ou = orbitMat.uniforms;
    const m = menu.getBoundingClientRect();
    ou.uMid.value.set(m.left - box.left + px("--orbit-cx"), m.top - box.top + px("--orbit-cy"));
    ou.uRx.value = Math.max(1, px("--orbit-rx"));
    ou.uRy.value = Math.max(1, px("--orbit-ry"));
    ou.uTilt.value = px("--orbit-tilt");
    links.forEach((a, k) => { ou.uAng.value[k] = parseFloat(getComputedStyle(a).getPropertyValue("--oa")) || 0; });
    // (the ring's length, near enough)
    const rx = ou.uRx.value, ry = ou.uRy.value;
    const length = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    const ring = Math.round(length * ORBIT_DENSITY * (soft ? 0.5 : 1));
    const per = ELECTRON[0] + ELECTRON[1];
    const key = ring + "|" + per;
    if (key === orbitLaid) return;
    orbitLaid = key;
    seed = 41;
    const n = ring + per * 8;
    const ob = new Float32Array(n * 4), off = new Float32Array(n * 2), tone = new Float32Array(n * 3);
    // (a machine drawing without a graphics card has half the specks, each the stronger)
    const ink = ORBIT_INK * (soft ? 2 : 1);
    for (let i = 0; i < n; i++) {
      const who = i < ring ? -1 : Math.floor((i - ring) / per);
      ob[i * 4] = who;
      ob[i * 4 + 3] = rand();
      if (who < 0) {
        // evenly round it, a line
        ob[i * 4 + 1] = i / ring;
        tone[i * 3] = ORBIT_TONE[0] * ink; tone[i * 3 + 1] = ORBIT_TONE[1] * ink; tone[i * 3 + 2] = ORBIT_TONE[2] * ink;
      } else {
        const glow = (i - ring) % per >= ELECTRON[0];
        ob[i * 4 + 2] = glow ? 1 : 0;
        const spread = glow ? ELECTRON[2] : 0.45;
        off[i * 2] = gauss() * spread; off[i * 2 + 1] = gauss() * spread;
        // a warm white heart, a gold glow
        const c = glow ? COLOUR.pi : PALE, k = glow ? 0.8 : 1;
        tone[i * 3] = c[0] * k; tone[i * 3 + 1] = c[1] * k; tone[i * 3 + 2] = c[2] * k;
      }
    }
    orbitGeo.dispose();
    orbitGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    orbitGeo.setAttribute("aOrb", new THREE.BufferAttribute(ob, 4));
    orbitGeo.setAttribute("aOff", new THREE.BufferAttribute(off, 2));
    orbitGeo.setAttribute("aTone", new THREE.BufferAttribute(tone, 3));
    orbitGeo.setDrawRange(0, n);
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
    orbit.visible = orbitOn && orbitLaid !== "" && down > 0;
    if (orbit.visible) {
      const m = orbitMat.uniforms;
      m.uTime.value = t;
      m.uDraw.value = down;
      // traced round from the top as the last stage comes
      m.uReveal.value = REDUCE ? 1.2 : smooth(down * 1.15) * 1.12;
      m.uPull.value = pull;
      m.uHandPx.value.set(eased.x - box.left, eased.y - box.top);
      for (let k = 0; k < 8; k++) m.uHeat.value[k] = heat[k];
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

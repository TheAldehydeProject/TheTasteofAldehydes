// ============================================================
// APOTEKER TEPE — houses/apoteker-tepe.html
//
// The thirteenth house, and its ground: A MOUNTAIN. The owner, 2026-10-20:
// "The house page should be themed like a mountain. I want there to be a
// whole mountain constructed in 3d in the background ... Following this, I
// want you to add lines to this mountain, as if tracks or trails that are
// just random indications ... incorporate the logo of apoteker tepe there
// ... rotate when you scroll. I want the text in front of the mountain to
// be legible." And later the same day: "make the particles smaller and way
// more dense ... smooth out the textures and decrease the emphasis on the
// colour green ... deminish everything that is in front of the writing in
// a similar way to ataraxia's page ... I want the actual logo of the house
// to appear somewhere on this mountain. I do not want the mountain to be
// translucent ... it should be well coloured - like an actual mountain. The
// rotation is too fast ... The reactivity too, I would actually suggest
// removeing that entirely. On the top right, add a button saying "free
// view" where you can look at the mountain in a free view, sort of a
// sandbox way. In this mode, i want there to be nodes on the mountain,
// which when hovered, will correspodn to different perfumes from the house.
// For the background of the page, please add an environment. I want
// something that is subtle but accomodates the mountain nicely."
//
//   THE MOUNTAIN  MOUNT ATHOS, drawn by tepe-gl.js: its real heights as a
//                 solid surface coloured by a real photograph of it from
//                 above, small specks over it many to the pixel, the
//                 house's sign laid on a slope as a figure on a hillside,
//                 the shallows and the foam round its shore. It TURNS AS
//                 THE PAGE IS SCROLLED — slowly, a little over a quarter of
//                 a turn from the head of the page to its foot (TURN) — and
//                 glides after the scroll (TURN_EASE). Nothing answers the
//                 hand.
//   THE ENVIRONMENT  the sky over it, pale, warmer at the horizon, the
//                 sun's light low in the south-west; the Aegean round it,
//                 hazy towards the horizon; on the horizon, faint, the real
//                 islands and peninsulas as Athos sees them — Sithonia,
//                 Kassandra, Olympus, Thasos, Samothrace, Lemnos — passing
//                 as the mountain turns; a cloud at its summit, as Athos
//                 so often has, drifting off it, and a mist at its foot.
//   THE TRAILS    walks up its slopes from the shore and one round its
//                 shoulder, in a pencil's red-brown — dashed, the dashes
//                 going slowly along them, each numbered at its foot and
//                 BLAZED with the house's own sign as a path is marked on a
//                 tree, the summit with its height and where it stands;
//                 hidden where the mountain stands in front of them.
//   THE QUIET     ATARAXIA'S (ataraxia.js): over the column of writing the
//                 whole of it — the sky, the sea, the mountain, its trails
//                 — goes to QUIET of itself, under a veil of the page's own
//                 paper, easing in over SOFT px either side; on a phone,
//                 where the writing is the whole width, everywhere, and
//                 quieter again behind the words (`Writing.under`).
//   FREE VIEW     the button at the top right: the writing goes, the veil
//                 lifts, and the mountain stands whole in the window, to
//                 turn by a drag, bring nearer by the wheel or a pinch,
//                 move by a right-drag or two fingers — and on it, a NODE
//                 for each of the eight, where its name says it stands
//                 (`TEPE.places`): pointed at, the fragrance it is; pressed,
//                 back to the page at that fragrance, opened.
//
// QUICK TO DRAW: the mountain, the sky and where the trails can be seen
// are drawn again ONLY when the camera has moved; every frame only the
// trails' dashes and the clouds, on a canvas of their own. Sharp on every
// screen (`window.Sharpness`), let down on a slow one.
//
// WITH REDUCED MOTION: the mountain stands as the scroll puts it, at once,
// nothing going along the trails, the clouds still; the free view moves
// at once to where it is sent. WITHOUT THIS SCRIPT (or WebGL) the page is
// its writing on aged paper.
// ============================================================
(function () {
  const field = document.querySelector(".human-field");
  const DATA = window.TEPE, GL = window.TepeGL;
  if (!field || !DATA || !GL) return;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- TUNING ----------
  const NARROW_AT = 700;
  // SMALLER AND FAR MORE OF THEM, over a surface of the ground's own colour
  // (2026-10-20, last — they were 34,000 and 40,000 specks of 0.8 and 0.42).
  const SPECKS_WIDE = 300000;
  const SPECKS_NARROW = 260000;
  const SPECK_WIDE = 0.62;         // css px a speck is, near
  const SPECK_NARROW = 0.42;
  const SURFACE = 0.86;            // the surface under the specks, a shade darker than they are
  const REACH = 0.47;              // of the square, round the summit: how far the mountain is drawn before it fades out
  const LIFT = 0.42;               // the summit's height, in half-widths of the square (the real one is 0.25: raised a little)
  const PITCH = 0.235;             // radians the eye looks down on it (0.36 until the horizon was wanted in the window)
  const EYE = 3.0;                 // how far the eye stands off, in half-widths (perspective)
  // SLOWER (2026-10-20, last — "The rotation is too fast"): a little over a
  // quarter of a turn from the head of the page to its foot (it was most of
  // a turn, 1.55π), gliding after the scroll over a little longer (0.42 s).
  const TURN_FROM = -0.55;         // radians it is turned at the head of the page: its north face, the sign on it
  const TURN = Math.PI * 0.55;
  const TURN_EASE = 0.6;
  // THE QUIET — Ataraxia's own numbers (ataraxia.js `QUIET`, `SOFT`).
  const QUIET = 0.26;
  const SOFT = 96;
  const VEIL_STEP = 6;             // css px to a pixel of the veil
  const PAPER = [236, 229, 210];   // the page's own paper (`--bg`)
  // THE ENVIRONMENT
  const SKY_TOP = [200, 211, 210], SKY_LOW = [233, 228, 211];
  const SEA_FAR = [219, 220, 207], SEA_NEAR = [178, 193, 187];
  const HAZE = [222, 222, 210];
  const SUN_AZ = (225 * Math.PI) / 180;
  const ISLAND = [128, 140, 140];
  // The land Athos sees on its horizon: where it stands (degrees from
  // north), how far (km), how high (m) and how wide (km).
  const HORIZON = [
    { name: "Sithonia", az: 262, km: 40, m: 811, wide: 34 },
    { name: "Kassandra", az: 256, km: 82, m: 350, wide: 38 },
    { name: "Olympus", az: 267, km: 168, m: 2918, wide: 30 },
    { name: "Holomontas", az: 293, km: 75, m: 1165, wide: 46 },
    { name: "the Athos peninsula", az: 318, km: 22, m: 520, wide: 26 },
    { name: "Thasos", az: 24, km: 68, m: 1204, wide: 24 },
    { name: "Samothrace", az: 73, km: 112, m: 1611, wide: 18 },
    { name: "Lemnos", az: 110, km: 83, m: 470, wide: 32 },
  ];
  const RAISE = 2.2;               // the horizon's heights raised as the mountain's are, so they read at all
  // THE CLOUDS: a cap at the summit, carried off it on the wind from the
  // north-east, and a mist along the shore.
  const CLOUD = [250, 248, 242];
  const CAP_PUFFS = 9, MIST_PUFFS = 7;
  const WIND = [-0.012, 0.016];    // half-widths a second the clouds drift (west and south)
  // THE TRAILS
  const TRAIL = [138, 58, 38];     // the pencil's red-brown, a little warmer on the coloured ground
  const TRAIL_A = 0.9;
  const TRAIL_WIDE = 1.5, TRAIL_NARROW = 1.3;   // px, the lines' width
  const UNDER = 0.4;              // the paper-coloured line under each, so it reads on the forest
  const DASH = [5, 4];
  const DASH_SPEED = 7;            // px a second the dashes go along a trail
  const BLAZE_EVERY = 28;          // trail points between one blaze and the next
  const BLAZE_TALL = 11;           // px, the house's sign as a blaze
  const MARK_INK = [40, 44, 34];   // the labels' ink
  const MONO = "500 9.5px 'IBM Plex Mono', ui-monospace, monospace";
  const TRAILS_NARROW = [0, 2, 4]; // which trails a phone draws: every other, so the summit stays clear
  // FREE VIEW
  const FREE_PITCH = 0.3;
  const FREE_EASE = 0.16;          // s the free view's camera takes to arrive where it is sent
  const FREE_ZOOM = [0.55, 4.2];   // how far it may be brought nearer or sent back, of its fitted size
  const NODE_UP = 0.018;           // half-widths a node stands above the ground
  const SOFT_WIDE = 0.6;            // the mountain's pixels to a css px there, on a wide window
  const SOFT_EVERY = 300;          // ms: without a graphics card, at most one new picture of it so often (as the home page's aldehyde)

  // ---------- THE GROUND ----------
  const n = DATA.n;
  const [pi, pj] = DATA.summit;
  const parts = [...document.querySelectorAll(".human-part")];

  // ---------- THE WINDOW ----------
  // Under the mountain the sky; over it the trails and the clouds, and the
  // veil of the quiet over all of them.
  // (Drawn on a canvas of its own off the page, and laid under the mountain
  // in its own drawing, which is then opaque: one layer the less for the
  // browser to put together every frame.)
  const sky = document.createElement("canvas");
  const air = sky.getContext("2d");
  const trailCanvas = document.createElement("canvas");
  trailCanvas.className = "tepe-trails";
  trailCanvas.setAttribute("aria-hidden", "true");
  field.after(trailCanvas);
  const pen = trailCanvas.getContext("2d");
  // The clouds are soft: drawn at a quarter of the window's pixels, off the
  // page, and laid over the trails stretched.
  const cloudCanvas = document.createElement("canvas");
  const fog = cloudCanvas.getContext("2d");
  const CLOUD_STEP = 4;
  // THE VEIL: on a wide window a band of the paper over the column, a
  // gradient the stylesheet draws (a stretched picture of it cost the
  // browser a fifth of its frames); on a phone a picture of where the
  // words are, made again as the page scrolls.
  const band = document.createElement("div");
  band.className = "tepe-veil tepe-veil-band";
  band.setAttribute("aria-hidden", "true");
  trailCanvas.after(band);
  const veil = document.createElement("canvas");
  veil.className = "tepe-veil";
  veil.setAttribute("aria-hidden", "true");
  band.after(veil);
  const veilInk = veil.getContext("2d");

  const draw3d = GL.make(field, { opaque: true });
  if (!draw3d) { trailCanvas.remove(); band.remove(); veil.remove(); return; }
  document.documentElement.classList.add("tepe-drawn");

  let W = 0, H = 0, ratio = 1, narrow = false;
  const sharp = window.Sharpness ? window.Sharpness(() => size()) : null;
  let ground = null, mountain = null, specksFor = 0;
  let dirty = true;

  // ---------- THE CAMERA ----------
  const turnFor = () => {
    const room = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return TURN_FROM + TURN * Math.max(0, Math.min(1, window.scrollY / room));
  };
  // Where the mountain stands on the window, reading the page. ON A PHONE,
  // ONE SIDE OF IT: drawn nearly twice as large, its summit towards the
  // right edge, so one flank runs across the window.
  const frameOf = () => {
    if (narrow) { const S = Math.min(W * 1.02, H * 0.92); return { S, cx: W * 0.78, cy: H * 0.58 }; }
    const S = Math.min(W * 0.56, H * 0.8);
    return { S, cx: W / 2, cy: H * 0.6 };
  };
  // And in the free view, the whole of it, a little above the middle.
  const fitFree = () => {
    const S = narrow ? Math.min(W * 0.48, H * 0.4) : Math.min(W * 0.36, H * 0.52);
    return { S, cx: W / 2, cy: H * (narrow ? 0.5 : 0.57) };
  };
  const cam = { yaw: turnFor(), pitch: PITCH, S: 1, cx: 0, cy: 0, eye: EYE };
  let want = { ...cam };
  let free = false, freeAt = 0;
  let drawnKey = 0, drawnCam = null;

  function size() {
    W = window.innerWidth; H = window.innerHeight;
    narrow = W < NARROW_AT;
    ratio = sharp ? sharp.ratio : Math.min(window.devicePixelRatio || 1, 2);
    // (Without a graphics card on a wide window, at SOFT_WIDE of the
    // screen's pixels: that much less for the processor to draw.)
    draw3d.size(W, H, draw3d.soft && !narrow ? Math.min(ratio, SOFT_WIDE) : ratio);
    field.style.width = W + "px"; field.style.height = H + "px";
    trailCanvas.width = Math.round(W * ratio); trailCanvas.height = Math.round(H * ratio);
    trailCanvas.style.width = W + "px"; trailCanvas.style.height = H + "px";
    // The sky is soft: half the window's pixels, stretched.
    sky.width = Math.ceil(W / 2); sky.height = Math.ceil(H / 2);
    cloudCanvas.width = Math.ceil(W / CLOUD_STEP); cloudCanvas.height = Math.ceil(H / CLOUD_STEP);
    veil.width = Math.ceil(W / VEIL_STEP); veil.height = Math.ceil(H / VEIL_STEP);
    veil.style.width = veil.width * VEIL_STEP + "px"; veil.style.height = veil.height * VEIL_STEP + "px";
    const f = free ? fitFree() : frameOf();
    if (!free) Object.assign(want, f);
    else if (!freeMoved) Object.assign(want, f);
    if (!cam.S || cam.S === 1) Object.assign(cam, f);
    const specks = narrow ? SPECKS_NARROW : SPECKS_WIDE;
    if (ground && specks !== specksFor) build();
    veilFor = "";
    dirty = true;
  }
  function build() {
    if (mountain) mountain.dispose();
    specksFor = narrow ? SPECKS_NARROW : SPECKS_WIDE;
    mountain = draw3d.piece(ground, { centre: [pi, pj], scale: n / 2, reach: n * REACH, fade: 0.72, lift: LIFT, sea: true, sink: true, specks: specksFor, seed: 1925 });
    dirty = true;
  }

  // ---------- THE SKY AND THE SEA ----------
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgb = (c, a = 1) => (a >= 1 ? "rgb(" + c.join(",") + ")" : "rgba(" + c.join(",") + "," + a + ")");
  /** A direction (degrees from north, and up) as a place on the window, or null if behind. */
  function towards(azDeg, up) {
    const A = (azDeg * Math.PI) / 180, ce = Math.cos(up);
    const X = Math.sin(A) * ce, Y = Math.sin(up), Z = -Math.cos(A) * ce;
    const c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const xr = X * c - Z * s, zr = X * s + Z * c, y2 = Y * cp + zr * sp, z2 = -Y * sp + zr * cp;
    if (z2 < 0.05) return null;
    const k = cam.S * cam.eye;
    return { x: cam.cx - (xr / z2) * k, y: cam.cy - (y2 / z2) * k };
  }
  function drawSky() {
    const k = 0.5;                                  // the sky's pixels to a css px
    air.setTransform(k, 0, 0, k, 0, 0);
    const horizon = cam.cy - cam.S * cam.eye * Math.tan(cam.pitch);
    // The sky down to the horizon, the sea from it.
    const top = Math.min(horizon - 1, 0), g1 = air.createLinearGradient(0, Math.min(top, horizon - 400), 0, horizon);
    g1.addColorStop(0, rgb(SKY_TOP)); g1.addColorStop(1, rgb(SKY_LOW));
    air.fillStyle = g1;
    air.fillRect(0, 0, W, Math.max(0, horizon));
    const g2 = air.createLinearGradient(0, horizon, 0, Math.max(horizon + 40, H + 60));
    g2.addColorStop(0, rgb(SEA_FAR)); g2.addColorStop(0.18, rgb(mix(SEA_FAR, SEA_NEAR, 0.45))); g2.addColorStop(1, rgb(SEA_NEAR));
    air.fillStyle = g2;
    air.fillRect(0, Math.max(0, horizon), W, H - Math.max(0, horizon));
    // The sun's light, low in the south-west, and its path on the water.
    const sun = towards((SUN_AZ * 180) / Math.PI, 0.09);
    if (sun) {
      const r = Math.max(W, H) * 0.55, g = air.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, r);
      g.addColorStop(0, "rgba(255, 246, 222, 0.5)"); g.addColorStop(0.35, "rgba(255, 244, 220, 0.16)"); g.addColorStop(1, "rgba(255, 244, 220, 0)");
      air.fillStyle = g;
      air.fillRect(0, 0, W, H);
      // Its path on the water: brightest at the horizon under it, and gone
      // a little way towards the eye.
      if (horizon > -50 && horizon < H) {
        const long = Math.min(H - horizon, H * 0.45);
        air.save();
        air.translate(sun.x, horizon);
        air.scale(0.22, 1);
        const path = air.createRadialGradient(0, 0, 0, 0, 0, long);
        path.addColorStop(0, "rgba(255, 250, 236, 0.3)"); path.addColorStop(0.4, "rgba(255, 250, 236, 0.1)"); path.addColorStop(1, "rgba(255, 250, 236, 0)");
        air.fillStyle = path;
        air.fillRect(-long, 0, long * 2, long);
        air.restore();
      }
    }
    // The land on the horizon, faint, the further the fainter.
    for (const h of HORIZON) {
      const d = h.km * 1000, drop = (d * d) / (2 * 6371000), rise = Math.max(0, h.m - drop) * RAISE;
      const up = Math.atan2(rise, d), half = ((h.wide / 2) / h.km) * (180 / Math.PI);
      const pts = [];
      let shown = false;
      for (let q = -1; q <= 1.0001; q += 0.08) {
        const shape = Math.pow(Math.cos((q * Math.PI) / 2), 1.6) * (0.82 + 0.18 * Math.sin(q * 7.3 + h.az));
        const p = towards(h.az + q * half, up * shape), b = towards(h.az + q * half, 0);
        if (!p || !b) { pts.length = 0; break; }
        pts.push(p, b);
        if (p.x > -100 && p.x < W + 100) shown = true;
      }
      if (!shown || pts.length < 4) continue;
      air.beginPath();
      for (let q = 0; q < pts.length; q += 2) (q ? air.lineTo(pts[q].x, pts[q].y) : air.moveTo(pts[q].x, pts[q].y));
      for (let q = pts.length - 1; q >= 1; q -= 2) air.lineTo(pts[q].x, pts[q].y);
      air.closePath();
      air.fillStyle = rgb(mix(SKY_LOW, ISLAND, 0.5 * Math.max(0.15, 1 - h.km / 200)));
      air.fill();
    }
    // The haze along the horizon over all of it.
    const g3 = air.createLinearGradient(0, horizon - 60, 0, horizon + 50);
    g3.addColorStop(0, rgb(HAZE, 0)); g3.addColorStop(0.55, rgb(HAZE, 0.75)); g3.addColorStop(1, rgb(HAZE, 0));
    air.fillStyle = g3;
    air.fillRect(0, horizon - 60, W, 110);
  }

  // ---------- THE MOUNTAIN ----------
  const LOOK = () => ({
    surface: SURFACE,
    speck: narrow ? SPECK_NARROW : SPECK_WIDE,
    fog: [HAZE[0] / 255, HAZE[1] / 255, HAZE[2] / 255, 0.32],
    fogZ: [-0.5, 1.5],
    shallow: [170, 198, 190],
  });
  function drawMountain() {
    if (!mountain) return;
    draw3d.clear();
    draw3d.backdrop(sky);
    draw3d.draw(mountain, cam, LOOK());
  }

  // ---------- WHAT CAN BE SEEN ----------
  // Whether the mountain stands between a point and the eye: a walk from
  // the point to the eye over the heights.
  const heightAt = (x, z) => {
    const u = pi + x * (n / 2), v = pj + z * (n / 2);
    if (u < 0 || v < 0 || u > n - 1 || v > n - 1) return 0;
    return mountain.point(u, v).y;
  };
  function seen(p) {
    if (!ground) return true;
    const c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const ex = -cam.eye * cp * s, ey = cam.eye * sp, ez = -cam.eye * cp * c;
    for (let k = 1; k <= 36; k++) {
      const t = (k / 36) * (k / 36) * 0.9 + 0.012;
      const x = p.x + (ex - p.x) * t, y = p.y + (ey - p.y) * t, z = p.z + (ez - p.z) * t;
      if (y > LIFT * 1.02) return true;
      if (y < heightAt(x, z) - 0.004) return false;
    }
    return true;
  }
  const worldOf = (u, v, up) => mountain.point(u, v, up);
  let trailPts = [], marks = [];
  function lookAgain() {
    trailPts = DATA.trails.map((trail, ti) => {
      if (narrow && !free && !TRAILS_NARROW.includes(ti)) return null;
      return trail.map(([u, v]) => {
        const w = worldOf(u, v, 0.004), q = GL.project(w, cam);
        q.seen = seen(w); q.m = Math.round(Math.max(0, ground.at(u, v)) * DATA.top);
        return q;
      });
    });
    nodesAgain();
  }

  // ---------- THE CLOUDS ----------
  let seed = 1925;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const cap = Array.from({ length: CAP_PUFFS }, (_, k) => ({ x: (random() - 0.5) * 0.12, y: LIFT * (1.02 + random() * 0.14), z: (random() - 0.5) * 0.12, r: 0.05 + random() * 0.07, a: 0.16 + random() * 0.14, off: random() * 40, k }));
  const mist = Array.from({ length: MIST_PUFFS }, () => { const a = random() * Math.PI * 2, d = 0.55 + random() * 0.3; return { x: Math.cos(a) * d, y: 0.03 + random() * 0.04, z: Math.sin(a) * d, r: 0.16 + random() * 0.14, a: 0.1 + random() * 0.08, off: random() * 60 }; });
  function drawClouds(t) {
    fog.setTransform(1 / CLOUD_STEP, 0, 0, 1 / CLOUD_STEP, 0, 0);
    fog.clearRect(0, 0, W, H);
    const life = 26;                                // s a puff takes to drift off the summit and go
    for (const p of cap) {
      const age = ((t + p.off) % life) / life;
      const w = { x: p.x + WIND[0] * age * life, y: p.y - 0.02 * age, z: p.z + WIND[1] * age * life };
      const q = GL.project(w, cam), r = p.r * (1 + age * 1.4) * cam.S * (cam.eye / (cam.eye + q.z));
      const a = p.a * Math.sin(Math.PI * Math.min(1, age * 1.15)) * (free ? 0.7 : 1);
      if (a < 0.01) continue;
      puff(q.x, q.y, r, r * 0.62, a);
    }
    for (const m of mist) {
      const sway = Math.sin(t * 0.05 + m.off) * 0.04;
      const q = GL.project({ x: m.x + sway, y: m.y, z: m.z }, cam), r = m.r * cam.S * (cam.eye / (cam.eye + q.z));
      puff(q.x, q.y, r * 1.8, r * 0.34, m.a * (0.75 + 0.25 * Math.sin(t * 0.11 + m.off)) * (free ? 0.6 : 1));
    }
  }
  function puff(x, y, rx, ry, a) {
    if (x + rx < 0 || x - rx > W || y + ry < 0 || y - ry > H) return;
    fog.save();
    fog.translate(x, y);
    fog.scale(1, ry / rx);
    const g = fog.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, rgb(CLOUD, a)); g.addColorStop(0.55, rgb(CLOUD, a * 0.45)); g.addColorStop(1, rgb(CLOUD, 0));
    fog.fillStyle = g;
    fog.fillRect(-rx, -rx, rx * 2, rx * 2);
    fog.restore();
  }

  // ---------- THE TRAILS, DRAWN ----------
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  let blaze = null;
  const logo = new Image();
  logo.onload = () => {
    const h = BLAZE_TALL * 2, w = Math.round((logo.width / logo.height) * h);
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    g.drawImage(logo, 0, 0, w, h);
    g.globalCompositeOperation = "source-in";
    g.fillStyle = rgb(TRAIL);
    g.fillRect(0, 0, w, h);
    blaze = c;
  };
  logo.src = (window.SITE_ROOT || "../") + "images/Apoteker Tepe/Apoteker Tepe Logo.webp";

  // The dashes go slowly and the clouds more slowly still: both drawn again
  // every other frame — and whenever the mountain has moved, so they never
  // stand off it.
  let frames = 0, overFor = "";
  function overlay(t, moved) {
    const odd = (frames++ & 1) === 1;
    if (REDUCE ? overFor === drawnKey : !moved && odd) return;
    overFor = drawnKey;
    drawClouds(REDUCE ? 0 : t);
    drawTrails(t);
  }
  function drawTrails(t) {
    pen.setTransform(ratio, 0, 0, ratio, 0, 0);
    pen.clearRect(0, 0, W, H);
    if (!ground) return;
    const colour = rgb(TRAIL);
    pen.lineCap = "round";
    marks = [];
    const width = narrow ? TRAIL_NARROW : TRAIL_WIDE;
    trailPts.forEach((pts, ti) => {
      if (!pts) return;
      const runs = [];
      for (let k = 1; k < pts.length; k++) if (pts[k - 1].seen && pts[k].seen) runs.push(pts[k - 1], pts[k]);
      if (runs.length) {
        const path = () => { pen.beginPath(); for (let q = 0; q < runs.length; q += 2) { pen.moveTo(runs[q].x, runs[q].y); pen.lineTo(runs[q + 1].x, runs[q + 1].y); } };
        pen.setLineDash([]);
        pen.globalAlpha = UNDER;
        pen.strokeStyle = rgb(PAPER);
        pen.lineWidth = width + 1.4;
        path(); pen.stroke();
        pen.setLineDash(DASH);
        pen.lineDashOffset = REDUCE ? 0 : -t * DASH_SPEED;
        pen.globalAlpha = TRAIL_A;
        pen.strokeStyle = colour;
        pen.lineWidth = width;
        path(); pen.stroke();
      }
      // Its number at its foot, and the house's sign blazed along it.
      if (pts[0].seen) marks.push({ kind: "no", x: pts[0].x, y: pts[0].y, say: ROMAN[ti] || String(ti + 1) });
      for (let k = BLAZE_EVERY; k < pts.length - 4; k += BLAZE_EVERY) {
        if (pts[k].seen) marks.push({ kind: "blaze", x: pts[k].x, y: pts[k].y, z: pts[k].z });
        if (k === BLAZE_EVERY * 2 && !narrow && pts[k].seen) marks.push({ kind: "spot", x: pts[k].x, y: pts[k].y, say: pts[k].m.toLocaleString("en-GB") + " m" });
      }
    });
    pen.setLineDash([]);
    pen.font = MONO;
    pen.textBaseline = "middle";
    const label = (text, x, y, align, alpha, ink) => {
      pen.textAlign = align;
      pen.globalAlpha = alpha * 0.7;
      pen.strokeStyle = rgb(PAPER);
      pen.lineWidth = 3;
      pen.lineJoin = "round";
      pen.strokeText(text, x, y);
      pen.globalAlpha = alpha;
      pen.fillStyle = ink;
      pen.fillText(text, x, y);
    };
    for (const m of marks) {
      if (m.kind === "blaze") {
        if (!blaze) continue;
        const h = BLAZE_TALL * (0.75 + 0.3 * (cam.eye / (cam.eye + m.z))), w = (blaze.width / blaze.height) * h;
        pen.globalAlpha = 0.9;
        pen.drawImage(blaze, m.x - w / 2, m.y - h - 2, w, h);
      } else if (m.kind === "no") {
        pen.globalAlpha = 0.75;
        pen.fillStyle = rgb(PAPER);
        pen.beginPath(); pen.arc(m.x, m.y, 7.5, 0, Math.PI * 2); pen.fill();
        pen.globalAlpha = 0.95;
        pen.strokeStyle = colour;
        pen.lineWidth = 1.1;
        pen.beginPath(); pen.arc(m.x, m.y, 7.5, 0, Math.PI * 2); pen.stroke();
        pen.fillStyle = colour;
        pen.textAlign = "center";
        pen.fillText(m.say, m.x, m.y + 0.5);
      } else if (m.kind === "spot") {
        label("× " + m.say, m.x + 4, m.y - 1, "left", 0.8, rgb(MARK_INK));
      }
    }
    // The summit: its height, as surveyed, and where it stands.
    const top = worldOf(pi, pj, 0.012), tq = GL.project(top, cam);
    if (seen(top)) {
      // (Written to its left where there is no room to its right, and in
      // the free view, where its node stands on its right.)
      const left = free || tq.x + 150 > W, tx = left ? tq.x - 14 : tq.x + 10;
      pen.globalAlpha = 0.9;
      pen.fillStyle = colour;
      pen.beginPath(); pen.moveTo(tq.x, tq.y - 9); pen.lineTo(tq.x - 5, tq.y - 1); pen.lineTo(tq.x + 5, tq.y - 1); pen.closePath(); pen.fill();
      label("ATHOS  2,033 m", tx, tq.y - 10, left ? "right" : "left", 0.85, rgb(MARK_INK));
      label("40°09′ N  24°19′ E", tx, tq.y + 2, left ? "right" : "left", 0.6, rgb(MARK_INK));
    }
    // The clouds over all of it.
    pen.globalAlpha = 1;
    pen.drawImage(cloudCanvas, 0, 0, cloudCanvas.width * CLOUD_STEP, cloudCanvas.height * CLOUD_STEP);
  }

  // ---------- THE QUIET ----------
  // Ataraxia's: how much of the drawing is left at a place on the window.
  let column = { l: 0, r: 0 };
  function measureColumn() {
    const boxes = [".human-head", ".human-intro", ".human-parts", ".house-credit", ".human-foot"].map((s) => document.querySelector(s)).filter(Boolean).map((e) => e.getBoundingClientRect());
    column = boxes.length ? { l: Math.min(...boxes.map((b) => b.left)), r: Math.max(...boxes.map((b) => b.right)) } : { l: W * 0.2, r: W * 0.8 };
  }
  function quietAt(x, y) {
    if (narrow) return QUIET * (window.Writing ? window.Writing.under(x, y) : 1);
    const soft = Math.min(SOFT, W * 0.14), from = column.l - soft, to = column.r + soft;
    if (x <= from || x >= to) return 1;
    const inside = Math.min(x - from, to - x) / soft;
    return QUIET + (1 - QUIET) * Math.max(0, 1 - Math.min(1, inside));
  }
  // THE VEIL: the paper laid over the drawing, as much as is taken from it
  // — worked out a cell of VEIL_STEP px at a time, and on a phone from the
  // writing's own boxes, once a frame, as `Writing.at` would have them.
  let veilFor = "", veilPix = null, words = null;
  const FEATHER = 24;
  function drawVeil() {
    const boxes = narrow && window.Writing ? window.Writing.boxes() : null;
    const key = narrow ? W + "x" + H + "," + window.scrollY + "," + (boxes ? boxes.length : 0) : W + "x" + H + "," + Math.round(column.l) + "," + Math.round(column.r);
    if (key === veilFor) return;
    veilFor = key;
    band.hidden = narrow;
    veil.hidden = !narrow;
    if (!narrow) {
      // Ataraxia's quiet, as stops: the whole of it out to SOFT px short of
      // the column, QUIET over it.
      const soft = Math.min(SOFT, W * 0.14), paper = (a) => "rgba(" + PAPER.join(",") + "," + a + ")";
      band.style.background = "linear-gradient(to right, " + paper(0) + " " + (column.l - soft).toFixed(1) + "px, " + paper(1 - QUIET) + " " + column.l.toFixed(1) + "px, " +
        paper(1 - QUIET) + " " + column.r.toFixed(1) + "px, " + paper(0) + " " + (column.r + soft).toFixed(1) + "px)";
      return;
    }
    const vw = veil.width, vh = veil.height;
    if (!veilPix || veilPix.width !== vw || veilPix.height !== vh) { veilPix = veilInk.createImageData(vw, vh); words = new Float32Array(vw * vh); const d = veilPix.data; for (let k = 0; k < d.length; k += 4) { d[k] = PAPER[0]; d[k + 1] = PAPER[1]; d[k + 2] = PAPER[2]; } }
    const d = veilPix.data;
    {
      words.fill(0);
      for (const b of boxes || []) {
        if (b.b < -FEATHER || b.t > H + FEATHER || b.r < -FEATHER || b.l > W + FEATHER) continue;
        const i0 = Math.max(0, Math.floor((b.l - FEATHER) / VEIL_STEP)), i1 = Math.min(vw - 1, Math.floor((b.r + FEATHER) / VEIL_STEP));
        const j0 = Math.max(0, Math.floor((b.t - FEATHER) / VEIL_STEP)), j1 = Math.min(vh - 1, Math.floor((b.b + FEATHER) / VEIL_STEP));
        for (let j = j0; j <= j1; j++) {
          const y = (j + 0.5) * VEIL_STEP, dy = Math.max(b.t - y, 0, y - b.b);
          for (let i = i0; i <= i1; i++) {
            const x = (i + 0.5) * VEIL_STEP, dx = Math.max(b.l - x, 0, x - b.r), v = 1 - Math.hypot(dx, dy) / FEATHER, k = j * vw + i;
            if (v > words[k]) words[k] = v;
          }
        }
      }
      const keep = window.Writing ? window.Writing.KEEP : 1;
      for (let k = 0; k < vw * vh; k++) d[k * 4 + 3] = Math.round((1 - QUIET * (1 - (1 - keep) * words[k])) * 255);
    }
    veilInk.putImageData(veilPix, 0, 0);
  }

  // ---------- FREE VIEW ----------
  const button = document.createElement("button");
  button.type = "button";
  button.className = "tepe-free";
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = '<svg class="tepe-free-mark" width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M1 13 L6 4 L8.6 8 L10.6 5.4 L15 13 Z"/><circle cx="12.4" cy="2.4" r="1.4"/></svg><span class="tepe-free-say">Free view</span>';
  document.body.appendChild(button);
  const stage = document.createElement("div");
  stage.className = "tepe-stage";
  stage.tabIndex = -1;
  stage.setAttribute("role", "application");
  stage.setAttribute("aria-label", "Mount Athos, to look round: drag to turn it, the wheel or a pinch to bring it nearer, the arrow keys too");
  stage.hidden = true;
  stage.innerHTML = '<p class="tepe-hint"></p><div class="tepe-card" hidden><span class="tepe-card-pic"><img alt=""></span><span class="tepe-card-text"><span class="tepe-card-no"></span><span class="tepe-card-name"></span><span class="tepe-card-made"></span><span class="tepe-card-go">Read about it →</span></span></div>';
  document.body.appendChild(stage);
  const hint = stage.querySelector(".tepe-hint"), card = stage.querySelector(".tepe-card");
  // A NODE for each fragrance, where its name says it stands.
  const nodes = parts.map((part) => {
    const no = part.id.replace("part-", ""), at = DATA.places && DATA.places[no];
    if (!at) return null;
    const name = part.querySelector(".human-title").textContent.trim(), made = (part.querySelector(".human-made") || { textContent: "" }).textContent.trim();
    const img = part.querySelector("summary img");
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tepe-node";
    el.dataset.part = no;
    el.setAttribute("aria-label", name + (made ? ", " + made : "") + " — go to it on the page");
    el.innerHTML = '<span class="tepe-node-ring" aria-hidden="true"></span><span class="tepe-node-no" aria-hidden="true">' + no + "</span>";
    stage.appendChild(el);
    return { el, part, no, name, made, pic: img ? img.getAttribute("src") : "", u: at[0], v: at[1], q: null };
  }).filter(Boolean);
  let shownCard = null;
  function nodesAgain() {
    if (!free) return;
    for (const d of nodes) {
      const w = worldOf(d.u, d.v, NODE_UP), q = GL.project(w, cam);
      d.q = q;
      const ok = seen(w) && q.x > -20 && q.x < W + 20 && q.y > -20 && q.y < H + 20;
      d.el.style.transform = "translate(" + q.x.toFixed(1) + "px," + q.y.toFixed(1) + "px)";
      d.el.classList.toggle("behind", !ok);
      d.el.tabIndex = ok ? 0 : -1;
    }
    if (shownCard) placeCard(shownCard);
  }
  function placeCard(d) {
    if (!d.q) return;
    const cw = card.offsetWidth || 240, ch = card.offsetHeight || 80;
    let x = d.q.x + 18, y = d.q.y - ch / 2;
    if (x + cw > W - 12) x = d.q.x - 18 - cw;
    y = Math.max(64, Math.min(H - ch - 12, y));
    card.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
  }
  function showCard(d) {
    if (shownCard === d) return;
    shownCard = d;
    nodes.forEach((x) => x.el.classList.toggle("lit", x === d));
    card.querySelector(".tepe-card-no").textContent = d.no;
    card.querySelector(".tepe-card-name").textContent = d.name;
    card.querySelector(".tepe-card-made").textContent = d.made;
    const im = card.querySelector("img");
    im.src = d.pic; im.alt = "";
    card.hidden = false;
    card.dataset.part = d.no;
    requestAnimationFrame(() => card.classList.add("shown"));
    placeCard(d);
  }
  function hideCard() {
    shownCard = null;
    nodes.forEach((x) => x.el.classList.remove("lit"));
    card.classList.remove("shown");
    card.hidden = true;
  }
  /** Back to the page, at fragrance `d`, opened. */
  function goTo(d) {
    leaveFree();
    const part = d.part;
    setTimeout(() => {
      if (!part.open) part.querySelector("summary").click();
      const top = part.getBoundingClientRect().top + window.scrollY - (narrow ? 70 : 80);
      window.scrollTo({ top, behavior: REDUCE ? "auto" : "smooth" });
    }, REDUCE ? 0 : 380);
  }
  nodes.forEach((d) => {
    d.el.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") showCard(d); });
    // (Focus from the keyboard only: a tap focuses as it lands, and the
    // tap's own press would then take it straight to the page.)
    d.el.addEventListener("focus", () => { if (d.el.matches(":focus-visible")) showCard(d); });
    d.el.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch" && !card.matches(":hover")) setTimeout(() => { if (shownCard === d && !card.matches(":hover") && !d.el.matches(":hover")) hideCard(); }, 120); });
    d.el.addEventListener("click", (e) => {
      // A finger's first tap says what it is; the second, or the card, goes.
      if (lastPointer === "touch" && shownCard !== d) { showCard(d); return; }
      goTo(d);
    });
  });
  card.addEventListener("click", () => { const d = nodes.find((x) => x.no === card.dataset.part); if (d) goTo(d); });
  card.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") setTimeout(() => { if (shownCard && !card.matches(":hover") && !shownCard.el.matches(":hover")) hideCard(); }, 120); });

  let freeMoved = false, restoreFocus = null;
  function enterFree() {
    if (free) return;
    free = true; freeMoved = false; freeAt = performance.now();
    restoreFocus = document.activeElement;
    document.documentElement.classList.add("tepe-free-on");
    document.documentElement.style.overflow = "hidden";
    button.setAttribute("aria-pressed", "true");
    button.querySelector(".tepe-free-say").textContent = "Back to the page";
    stage.hidden = false;
    hint.textContent = matchMedia("(pointer: coarse)").matches ? "Drag to turn · pinch to bring it nearer · two fingers to move it · tap a node" : "Drag to turn · scroll to bring it nearer · right-drag to move it · point at a node";
    Object.assign(want, fitFree(), { pitch: FREE_PITCH });
    lookAgain();
    stage.focus({ preventScroll: true });
  }
  function leaveFree() {
    if (!free) return;
    free = false;
    hideCard();
    document.documentElement.classList.remove("tepe-free-on");
    document.documentElement.style.overflow = "";
    button.setAttribute("aria-pressed", "false");
    button.querySelector(".tepe-free-say").textContent = "Free view";
    stage.hidden = true;
    Object.assign(want, frameOf(), { pitch: PITCH, yaw: turnFor() });
    // The turn comes back round the shorter way.
    const two = Math.PI * 2;
    cam.yaw = want.yaw + ((((cam.yaw - want.yaw) % two) + two * 1.5) % two - Math.PI);
    if (restoreFocus && restoreFocus.focus && document.contains(restoreFocus)) restoreFocus.focus({ preventScroll: true });
    else button.focus({ preventScroll: true });
    veilFor = "";
  }
  button.addEventListener("click", () => (free ? leaveFree() : enterFree()));
  document.addEventListener("keydown", (e) => {
    if (!free) return;
    const step = e.shiftKey ? 0.3 : 0.12;
    if (e.key === "Escape") { leaveFree(); e.preventDefault(); return; }
    if (e.target && e.target.closest && e.target.closest(".site-menu, .menu-overlay")) return;
    const k = e.key;
    if (k === "ArrowLeft") want.yaw -= step;
    else if (k === "ArrowRight") want.yaw += step;
    else if (k === "ArrowUp") want.pitch = clampPitch(want.pitch + step * 0.6);
    else if (k === "ArrowDown") want.pitch = clampPitch(want.pitch - step * 0.6);
    else if (k === "+" || k === "=") zoom(1.25, W / 2, H / 2);
    else if (k === "-" || k === "_") zoom(0.8, W / 2, H / 2);
    else if (k === "0") { Object.assign(want, fitFree(), { pitch: FREE_PITCH }); freeMoved = false; }
    else return;
    freeMoved = true;
    e.preventDefault();
  });
  const clampPitch = (p) => Math.max(0.06, Math.min(1.25, p));
  function zoom(k, x, y) {
    const fit = fitFree().S, S = Math.max(fit * FREE_ZOOM[0], Math.min(fit * FREE_ZOOM[1], want.S * k)), q = S / want.S;
    want.cx = x - (x - want.cx) * q; want.cy = y - (y - want.cy) * q; want.S = S;
    freeMoved = true;
  }
  // THE HAND IN THE FREE VIEW: a drag turns it, a right-drag (or shift, or
  // two fingers) moves it, the wheel or a pinch brings it nearer.
  const held = new Map();
  let lastPointer = "mouse", pinch = null;
  stage.addEventListener("contextmenu", (e) => e.preventDefault());
  stage.addEventListener("pointerdown", (e) => {
    lastPointer = e.pointerType;
    if (e.target.closest(".tepe-node, .tepe-card")) return;
    if (e.pointerType === "touch" && shownCard) hideCard();
    stage.setPointerCapture(e.pointerId);
    held.set(e.pointerId, { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey });
    if (held.size === 2) {
      const [a, b] = [...held.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
    stage.classList.add("held");
  });
  stage.addEventListener("pointermove", (e) => {
    const h = held.get(e.pointerId);
    if (!h) return;
    const dx = e.clientX - h.x, dy = e.clientY - h.y;
    h.x = e.clientX; h.y = e.clientY;
    if (held.size >= 2 && pinch) {
      const [a, b] = [...held.values()], d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      want.cx += mx - pinch.x; want.cy += my - pinch.y;
      if (pinch.d > 10) zoom(d / pinch.d, mx, my);
      pinch = { d, x: mx, y: my };
    } else if (h.pan) { want.cx += dx; want.cy += dy; }
    else { want.yaw += dx * 0.0062; want.pitch = clampPitch(want.pitch + dy * 0.0042); }
    freeMoved = true;
    hint.classList.add("gone");
  });
  const up = (e) => {
    held.delete(e.pointerId);
    if (held.size < 2) pinch = null;
    if (!held.size) stage.classList.remove("held");
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    zoom(Math.exp(-d * 0.0016), e.clientX, e.clientY);
    hint.classList.add("gone");
  }, { passive: false });
  stage.addEventListener("dblclick", (e) => { if (e.target === stage) { Object.assign(want, fitFree(), { pitch: FREE_PITCH }); freeMoved = false; } });

  // ---------- KEEPING UP ----------
  window.addEventListener("resize", () => { size(); measureColumn(); });
  size();
  measureColumn();
  GL.ground().then((g) => {
    ground = g;
    build();
    lookAgain();
  });

  let last = performance.now(), drawnAt = -1e9;
  function frame(now) {
    if (sharp) sharp.frame(now);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!free) Object.assign(want, frameOf(), { yaw: turnFor(), pitch: PITCH });
    // The camera goes after where it is wanted: slowly on the page, quickly
    // in the free view.
    const tau = free ? FREE_EASE : TURN_EASE;
    const e = REDUCE ? 1 : 1 - Math.exp(-dt / tau), ef = REDUCE ? 1 : 1 - Math.exp(-dt / (free || now - freeAt < 1500 ? FREE_EASE * 2.5 : 0.35));
    cam.yaw += (want.yaw - cam.yaw) * e;
    cam.pitch += (want.pitch - cam.pitch) * ef;
    cam.S += (want.S - cam.S) * ef; cam.cx += (want.cx - cam.cx) * ef; cam.cy += (want.cy - cam.cy) * ef;
    // Drawn again only once it has moved by as much as a third of a pixel
    // anywhere: the last of a glide is not worth a picture.
    const S = Math.max(cam.S, 1), dc = drawnCam;
    const away = !dc || Math.abs(cam.yaw - dc.yaw) * S > 0.33 || Math.abs(cam.pitch - dc.pitch) * S > 0.33 || Math.abs(cam.S - dc.S) > 0.33 || Math.abs(cam.cx - dc.cx) > 0.33 || Math.abs(cam.cy - dc.cy) > 0.33;
    let moved = false;
    if (ground && (dirty || away) && !(draw3d.soft && now - drawnAt < SOFT_EVERY && !REDUCE)) {
      drawSky();
      drawMountain();
      lookAgain();
      drawnCam = { ...cam }; drawnKey = (drawnKey | 0) + 1; dirty = false; drawnAt = now; moved = true;
      document.documentElement.classList.add("tepe-ground");
    }
    if (!free) drawVeil();
    if (ground) overlay(now / 1000, moved);
  }
  // FOR THE TESTS: how far it is turned, how many specks, the trails, the
  // quiet at a place, the free view and its nodes.
  window.TepeMountain = {
    turn: () => cam.yaw,
    // How long the mountain and its sky take to draw again, in ms (the mean
    // of `times`, each waited for).
    time: (times = 10) => {
      const gl = draw3d.gl, one = new Uint8Array(4), t0 = performance.now();
      for (let i = 0; i < times; i++) { cam.yaw += 0.001; drawSky(); drawMountain(); lookAgain(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, one); }
      return (performance.now() - t0) / times;
    },
    ready: () => !!(ground && mountain),
    // The mountain alone, drawn over black and then over white: how much of
    // the window it covers, how much of that is SOLID (the same over both),
    // and of what colours.
    sample: () => {
      const gl = draw3d.gl, w = field.width, h = field.height, a = new Uint8Array(w * h * 4), b = new Uint8Array(w * h * 4);
      draw3d.clear([0, 0, 0]); draw3d.draw(mountain, cam, LOOK()); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, a);
      draw3d.clear([1, 1, 1]); draw3d.draw(mountain, cam, LOOK()); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, b);
      drawnCam = null;
      // Its body, under the summit, well inside where it fades into the
      // mist round its foot: every pixel of it solid.
      const top = GL.project(worldOf(pi, pj, 0), cam), r = draw3d.gl.canvas.width / W;
      const body = { l: (top.x - cam.S * 0.25) * r, r: (top.x + cam.S * 0.25) * r, t: (top.y + cam.S * 0.06) * r, b: (top.y + cam.S * 0.3) * r };
      let inBody = 0, bodySolid = 0;
      let land = 0, solid = 0, green = 0, grey = 0, warm = 0;
      for (let k = 0; k < a.length; k += 4 * 5) {
        const shown = a[k] + a[k + 1] + a[k + 2] > 6 || b[k] + b[k + 1] + b[k + 2] < 759;
        if (!shown) continue;
        const px = (k / 4) % w, py = h - 1 - Math.floor(k / 4 / w);
        if (px > body.l && px < body.r && py > body.t && py < body.b) {
          inBody++;
          if (Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]) < 6) bodySolid++;
        }
        land++;
        const same = Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]) < 6;
        if (!same) continue;
        solid++;
        const r = a[k], g = a[k + 1], bl = a[k + 2], hi = Math.max(r, g, bl), lo = Math.min(r, g, bl);
        if (g > r * 1.06 && g > bl * 1.06) green++;
        else if (hi - lo < 16) grey++;
        else if (r >= g) warm++;
      }
      return { covers: land / (a.length / 20), body: bodySolid / Math.max(1, inBody), solid: solid / Math.max(1, land), green: green / Math.max(1, solid), grey: grey / Math.max(1, solid), warm: warm / Math.max(1, solid) };
    },
    parts: (times = 5) => {
      const gl = draw3d.gl, one = new Uint8Array(4), out = {};
      const t = (name, f) => { const t0 = performance.now(); for (let i = 0; i < times; i++) { cam.yaw += 0.001; f(); } gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, one); out[name] = (performance.now() - t0) / times; };
      t("sky", drawSky); t("mountain", () => { drawMountain(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, one); }); t("look", lookAgain); t("trails", () => { drawClouds(performance.now() / 1000); drawTrails(performance.now() / 1000); });
      return out;
    },
    specks: () => (mountain ? mountain.specks : 0),
    soft: () => draw3d.soft,
    trails: () => DATA.trails.length,
    blazes: () => !!blaze,
    figure: () => DATA.figure,
    quiet: (x, y) => { drawVeil(); return quietAt(x, y); },
    free: () => free,
    // Send the free view's camera somewhere (a picture of it, a test).
    look: ({ now, ...o }) => { Object.assign(want, o); if (REDUCE || now) Object.assign(cam, want); freeMoved = true; },
    camera: () => ({ ...cam }),
    nodes: () => nodes.map((d) => ({ no: d.no, name: d.name, x: d.q ? d.q.x : null, y: d.q ? d.q.y : null, seen: !d.el.classList.contains("behind") })),
  };
  if (REDUCE) {
    frame(performance.now());
    const again = () => requestAnimationFrame((t) => frame(t));
    window.addEventListener("scroll", again, { passive: true });
    window.addEventListener("resize", again);
    // The free view still moves when it is moved, at once.
    ["pointermove", "wheel", "keydown", "click"].forEach((ev) => document.addEventListener(ev, () => (free || ev === "click") && again(), { passive: true }));
    GL.ground().then(again);
  } else {
    (function tick(now) { frame(now); requestAnimationFrame(tick); })(performance.now());
  }
})();

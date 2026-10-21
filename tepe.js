// ============================================================
// APOTEKER TEPE — houses/apoteker-tepe.html
//
// The thirteenth house, and its ground: A MOUNTAIN. The owner, 2026-10-20:
// "The house page should be themed like a mountain. I want there to be a
// whole mountain constructed in 3d in the background ... Following this, I
// want you to add lines to this mountain, as if tracks or trails that are
// just random indications ... incorporate the logo of apoteker tepe there
// ... rotate when you scroll. I want the text in front of the mountain to
// be legible." Later that day: solid, coloured as a mountain is, smaller
// specks and many more, the turn slower, nothing answering the hand, a FREE
// VIEW with a node for each fragrance, an environment round it. And last:
// "make the graphics way denser ... a little digitalized ... give it noise
// ... remove the logo being plastered on the mountain; rather it should be a
// part of it. The paths are good, but there is unneccessary coordinates on
// it ... make it seem less like an island ... an abstract biome ... all
// around this one mountain ... the mountain loses opacity instead of putting
// a whole object in front of it ... the rotation should be slower in the
// main page too ... you cannot turn the mountain all the way, but rather to
// a certain point ... I want the mountain to have some motion even when not
// interacted with; and I want the same to be true for the environment it is
// in. this motion should also include temporary popups of the fragrances
// ... you should not be able to zoom in or out ... AT THE TOP OF THE
// MOUNTAIN, I WANT THE POPUP TO BE THE LOGO ... simulate mist that moves in
// and around this mountain."
//
//   THE MOUNTAIN  MOUNT ATHOS, drawn by tepe-gl.js: its real heights as a
//                 solid surface coloured by a real photograph of it from
//                 above, very small specks over it many to the pixel, the
//                 house's sign CUT into a slope, dithered as a screen of not
//                 many colours shows it. It stands in A LAND of no map — its
//                 ridge running on, water in the gulfs either side, hills and
//                 fields beyond, ranges going into the haze — under a pale
//                 sky with high cloud, the shadows of clouds passing over it
//                 and MIST lying low and drifting round it and off its
//                 summit.
//   THE TURN      as the page is scrolled it turns a little — PAGE either way
//                 of the view the data gives it (`TEPE.view`), from the
//                 west-south-west, the sun's side — and glides after the
//                 scroll (TURN_EASE). Left alone it is never quite still: it
//                 breathes (SWAY). Nothing answers the hand.
//   THE TRAILS    walks up its slopes from the water and one round its
//                 shoulder, in a pencil's red-brown — dashed, the dashes
//                 going slowly along them, each numbered at its foot and
//                 BLAZED with the house's own sign as a path is marked on a
//                 tree; hidden where the mountain stands in front of them.
//   THE QUIET     behind the writing the mountain and its land LOSE THEIR
//                 OPACITY — Ataraxia's numbers (ataraxia.js `QUIET`, `SOFT`):
//                 down to QUIET of themselves where the words are, coming on
//                 over SOFT px round them (on a phone, where the writing is
//                 the whole width, QUIET everywhere and less again behind the
//                 words) — the sky and the haze showing through, nothing laid
//                 in front of them (`window.Writing` says where the words are).
//   FREE VIEW     the button at the top right: the writing goes and the
//                 mountain stands whole in the window, to be looked round by
//                 a drag — only so far, FREE either way and between
//                 PITCH_FREE, and then it springs back; nothing brings it
//                 nearer or moves it — and on it a NODE for each of the
//                 eight, where its name says it stands (`TEPE.places`), and
//                 the house's own at the summit: pointed at, what it is (at
//                 the summit, the house's sign); pressed, back to the page at
//                 that fragrance. Left alone, the nodes say what they are of
//                 their own accord, one after another (POP_*).
//
// QUICK TO DRAW: the drawing is drawn every frame while anything moves and
// at half that while only the mist and the clouds do; where the trails and
// the nodes can be seen is worked out again only when the camera has moved.
// Sharp on every screen (`window.Sharpness`), let down on a slow one.
//
// WITH REDUCED MOTION: the mountain stands as the scroll puts it, at once,
// nothing going along the trails, the mist and the clouds still, no
// breathing; the free view moves at once to where it is sent, and the nodes
// say nothing of their own accord. WITHOUT THIS SCRIPT (or WebGL) the page is
// its writing on aged paper.
// ============================================================
(function () {
  const field = document.querySelector(".human-field");
  const DATA = window.TEPE, GL = window.TepeGL;
  if (!field || !DATA || !GL) return;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- TUNING ----------
  const VIEW = DATA.view || { yaw: 2, pitch: 0.24, eye: 3, lift: 0.42, page: 0.3, free: 0.45, pitchFree: [0.17, 0.42] };
  const NARROW_AT = 700;
  // VERY SMALL AND VERY MANY (2026-10-20, last — "way denser"; they were
  // 300,000 and 260,000 of 0.62 and 0.42 px): on the mountain, and fewer on
  // the land round it.
  const SPECKS_WIDE = 460000, LAND_WIDE = 80000;
  const SPECKS_NARROW = 320000, LAND_NARROW = 50000;
  const SPECK_WIDE = 0.52;         // css px a speck is, near
  const SPECK_NARROW = 0.4;
  const SURFACE = 0.92;            // the surface's light
  const LIFT = VIEW.lift;          // the summit's height, in half-widths of the square (the real one is 0.25: raised a little)
  const PITCH = VIEW.pitch;        // radians the eye looks down on it
  const EYE = VIEW.eye;            // how far the eye stands off, in half-widths (perspective)
  // THE TURN (2026-10-20, last — "slower ... less sensitive ... only turn it
  // a little"): PAGE either way of the view from the head of the page to its
  // foot, gliding after the scroll; it was a little over a quarter of a turn,
  // and most of a turn before that.
  const HOME = VIEW.yaw, PAGE = VIEW.page;
  const TURN_EASE = 0.7;
  // ...and breathing when left alone, as the land does (radians, and seconds a breath).
  const SWAY = { yaw: 0.028, pitch: 0.009, yawEvery: 41, pitchEvery: 29 };
  // THE QUIET — Ataraxia's own numbers (ataraxia.js `QUIET`, `SOFT`).
  const QUIET = 0.26;
  const SOFT = 96;
  const QUIET_STEP = 6;            // css px to a step of the quiet's picture
  const PAPER = [236, 229, 210];   // the page's own paper (`--bg`)
  // THE AIR: the sky (its zenith, its horizon, the haze under the far land),
  // the haze per half-width, and the mist.
  const SKY = { zen: [192, 206, 208], hor: [233, 229, 214], haze: [212, 218, 215], mistLit: [247, 246, 239], mistShade: [208, 213, 210], glow: [255, 242, 214], cloud: [251, 249, 243] };
  const AIR = [0.13, 5.5, 30, 0.85];   // haze, the mist's density, how fast it thins upward, how much of it lies in wisps
  const HAZE_FROM = 2.3;           // half-widths off the eye the haze begins: the mountain clear, the land beyond going into it
  const MIST = { banks: 34, wisps: 26, cap: 9, far: 10, alpha: 0.82 };
  const MIST_NARROW = { banks: 20, wisps: 14, cap: 7, far: 6 };
  const MIST_SOFT = { banks: 4, wisps: 3, cap: 3, far: 0 };
  const WIND = [-0.012, 0.016];    // the way the mist drifts (west and south)
  const DITHER = { levels: 34, grain: 0.75, px: 1 };   // the steps of its light, a css px to a step
  // THE TRAILS
  const TRAIL = [138, 58, 38];     // the pencil's red-brown, a little warmer on the coloured ground
  const TRAIL_A = 0.9;
  const TRAIL_WIDE = 1.5, TRAIL_NARROW = 1.3;   // px, the lines' width
  const UNDER = 0.4;              // the paper-coloured line under each, so it reads on the forest
  const DASH = [5, 4];
  const DASH_SPEED = 7;            // px a second the dashes go along a trail
  const BLAZE_EVERY = 64;          // trail points between one blaze and the next
  const BLAZE_TALL = 11;           // px, the house's sign as a blaze
  const TRAILS_NARROW = [0, 2, 4]; // which trails a phone draws: every other, so the summit stays clear
  // FREE VIEW
  const FREE = VIEW.free, PITCH_FREE = VIEW.pitchFree;
  const FREE_PITCH = 0.27;
  const FREE_PITCH_NARROW = 0.34;  // (a phone's window is tall: looked down on a little more, less of it sky)
  const freePitch = () => (narrow ? FREE_PITCH_NARROW : FREE_PITCH);
  const FREE_EASE = 0.16;          // s the free view's camera takes to arrive where it is sent
  const GIVE = 0.22;               // how far past its limits a drag takes it (a share of the limit), before it springs back
  const NODE_UP = 0.018;           // half-widths a node stands above the ground
  // THE NODES SAY WHAT THEY ARE of their own accord, left alone: one after
  // another, each so long, so often, beginning so long after the hand.
  const POP_FIRST = 2600, POP_EVERY = 4600, POP_SHOWN = 3200, POP_AFTER = 4000;
  const SOFT_WIDE = 0.5;            // the mountain's pixels to a css px without a graphics card, on a wide window
  const SOFT_EVERY = 300;          // ms: without a graphics card, at most one new picture of it so often
  // THE TRIALS OF ITS RESOLUTION (`?res=` on the address; see tepe-gl.js):
  // those that are the page's to do — the screen's every pixel, never let
  // down (`native`); the mountain larger in the window (`closer`); the
  // dither's steps a device pixel each (`ditherfine`), finer (`levels`) or
  // none (`nodither`); the specks gone (`nospecks`) or finer and more
  // (`finespecks`); and the trails drawn into the ground (`trailsgl`), not
  // over it.
  const res = GL.res || (() => false);
  const CLOSER = 1.32;
  // (the realism trials that draw on more of the world's data say whose, in
  // the mountain's credit, while they are asked for)
  {
    const said = [];
    if (res("canopy")) said.push("Its trees’ crowns from the Canopy Height Map v2 of Meta and the World Resources Institute (CC BY 4.0).");
    if (res("osmtrails") || res("buildings")) said.push("Its " + [res("osmtrails") && "footpaths", res("buildings") && "monasteries and buildings"].filter(Boolean).join(" and ") + " © OpenStreetMap contributors (ODbL 1.0), via the Overture Maps Foundation.");
    const text = said.length && document.querySelector(".house-credit-ground .house-credit-text");
    if (text) text.append(" " + said.join(" "));
  }
  // (`clear`: the air between the eye and the mountain clearer — a third of
  // the haze and the mist, the banks fainter — for contrast is half of what
  // reads as sharp)
  const CLEAR_AIR = [0.13 * 0.4, 5.5 * 0.35, 30, 0.85];
  const HAZE_AIR = [0.13, 5.5 * 0.6, 30, 0.85];
  // THE LOOKS (`?res=style`, a trial — 2026-10-21, last: "add effects to it
  // too, so that it looks unique, and not entirely lifelike ... a temporary
  // setting on the bottom right of the page where i can cycle through them"):
  // a panel at the bottom right of the page, changing the drawing as it is
  // pressed — its colour (tepe-gl.js's palettes), its texture, the line art
  // over it and the extras — and keeping what it shows in the address
  // (`fx=`), for a reload or a link. Opened without `fx=`, it shows the
  // sunset gradient in halftone dots, a drawing at each fragrance's place,
  // the coastline glowing and the air in the gradient's colours. Whichever the owner does not keep comes out.
  const STYLE = res("style");
  const FX_WORDS = ["halftone", "dither", "engrave", "grain", "icons", "shapes", "seal", "coast", "haze", "contours", "drift"];
  const COLOURS = [["real", "Real colours"], ["sunset", "Sunset gradient"], ["infrared", "Infrared film"], ["print", "Two-ink print"]];
  const FX = { palette: "sunset", halftone: true, icons: true, coast: true, haze: true };
  {
    const asked = (location.search.match(/[?&]fx=([^&#]*)/) || [])[1];
    if (asked != null) {
      const words = decodeURIComponent(asked).split(/[,+]/).map((w) => w.trim());
      FX_WORDS.forEach((k) => { FX[k] = words.includes(k); });
      FX.palette = (COLOURS.find(([k]) => words.includes(k)) || ["real"])[0];
    }
  }
  const ART = [255, 255, 255];     // the line art's white
  const ART_UNDER = [24, 14, 34];  // and the faint dark under it, so it reads on the light
  const ART_WIDE = 1.35, ART_NARROW = 1.15;   // px, its lines
  const SEAL_WORDS = "CAUSA LATET VIS EST NOTISSIMA FONTIS";   // (the owner's picture's — Ovid, Metamorphoses IV: the cause is hidden, the power of the spring well known)
  const SEAL_TURN = 150;           // s a turn of the seal

  // ---------- THE GROUND ----------
  const n = DATA.n;
  const [pi, pj] = DATA.summit;
  const parts = [...document.querySelectorAll(".human-part")];

  // ---------- THE WINDOW ----------
  const trailCanvas = document.createElement("canvas");
  trailCanvas.className = "tepe-trails";
  trailCanvas.setAttribute("aria-hidden", "true");
  field.after(trailCanvas);
  const pen = trailCanvas.getContext("2d");

  const draw3d = GL.make(field, { opaque: true });
  if (!draw3d) { trailCanvas.remove(); return; }
  document.documentElement.classList.add("tepe-drawn");

  let W = 0, H = 0, ratio = 1, narrow = false;
  const sharp = window.Sharpness ? window.Sharpness(() => size()) : null;
  let ground = null, world = null, mist = null, specksFor = "";

  // ---------- THE CAMERA ----------
  const scrollShare = () => {
    const room = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(1, window.scrollY / room));
  };
  const turnFor = () => HOME - PAGE + 2 * PAGE * scrollShare();
  // Where the mountain stands on the window, reading the page. ON A PHONE,
  // ONE SIDE OF IT: drawn nearly twice as large, its summit towards the
  // right edge, so one flank runs across the window.
  const frameOf = () => {
    const k = res("closer") ? CLOSER : 1;
    if (narrow) { const S = Math.min(W * 1.02, H * 0.92) * k; return { S, cx: W * 0.78, cy: H * (res("closer") ? 0.62 : 0.58) }; }
    const S = Math.min(W * 0.56, H * 0.8) * k;
    return { S, cx: W / 2, cy: H * (res("closer") ? 0.66 : 0.6) };
  };
  // And in the free view, the whole of it, a little above the middle.
  const fitFree = () => {
    const S = narrow ? Math.min(W * 0.7, H * 0.46) : Math.min(W * 0.38, H * 0.54);
    return { S, cx: W / 2, cy: H * (narrow ? 0.5 : 0.58) };
  };
  const cam = { yaw: turnFor(), pitch: PITCH, S: 1, cx: 0, cy: 0, eye: EYE, far: 13.5 };
  let want = { yaw: cam.yaw, pitch: PITCH, S: 1, cx: 0, cy: 0 };
  let free = false, freeAt = 0;
  let drawnCam = null, lookKey = 0;
  let bare = false;                // (for a picture of the mountain alone: no quiet behind the writing — TepeMountain.bare)

  function size() {
    W = window.innerWidth; H = window.innerHeight;
    narrow = W < NARROW_AT;
    ratio = res("native") ? Math.min(window.devicePixelRatio || 1, 3) : sharp ? sharp.ratio : Math.min(window.devicePixelRatio || 1, 2);
    // (Without a graphics card on a wide window, at SOFT_WIDE of the
    // screen's pixels: that much less for the processor to draw.)
    draw3d.size(W, H, draw3d.soft && !narrow && !res("native") ? Math.min(ratio, SOFT_WIDE) : ratio);
    field.style.width = W + "px"; field.style.height = H + "px";
    trailCanvas.width = Math.round(W * ratio); trailCanvas.height = Math.round(H * ratio);
    trailCanvas.style.width = W + "px"; trailCanvas.style.height = H + "px";
    const f = free ? fitFree() : frameOf();
    Object.assign(want, f);
    if (cam.S === 1) Object.assign(cam, f);
    const key = narrow ? "narrow" : "wide";
    if (ground && key !== specksFor) build();
    quietFor = "";
    drawnCam = null;
  }
  function build() {
    if (world) world.dispose();
    if (mist) mist.dispose();
    specksFor = narrow ? "narrow" : "wide";
    const more = res("nospecks") ? 0 : res("finespecks") ? 1.5 : 1;
    world = draw3d.piece(ground, { world: true, lift: LIFT, specks: Math.round((narrow ? SPECKS_NARROW : SPECKS_WIDE) * more), landSpecks: Math.round((narrow ? LAND_NARROW : LAND_WIDE) * more), grid: narrow && !draw3d.soft ? 420 : undefined, seed: 1925 });
    const m0 = draw3d.soft ? MIST_SOFT : narrow ? MIST_NARROW : MIST;
    const m = res("clear") ? { banks: Math.round(m0.banks * 0.5), wisps: Math.round(m0.wisps * 0.5), cap: m0.cap, far: m0.far } : m0;
    mist = draw3d.mist(ground, { lift: LIFT, ...m, seed: 31 });
    drawnCam = null;
  }

  // ---------- THE LOOK ----------
  const top3 = [0, LIFT * 1.01, 0];
  const LOOK = (t, quiet) => ({
    time: t, still: REDUCE, quiet,
    surface: SURFACE,
    speck: narrow ? SPECK_NARROW : SPECK_WIDE,
    // (`haze`: the real air doing much of what the mist did, less of it)
    air: res("clear") ? CLEAR_AIR : res("haze") ? HAZE_AIR : AIR, hazeFrom: res("clear") ? HAZE_FROM * 1.4 : HAZE_FROM, sky: SKY, wind: WIND, cap: top3, mist: res("clear") ? MIST.alpha * 0.55 : res("haze") ? MIST.alpha * 0.7 : MIST.alpha,
    levels: res("nodither") ? 0 : res("levels") ? 128 : DITHER.levels, grain: res("nodither") ? 0 : DITHER.grain, ditherPx: res("ditherfine") ? 1 / ratio : DITHER.px,
    style: STYLE ? FX : undefined,
  });
  const clock = () => (REDUCE ? 0 : (performance.now() / 1000) % 3000);
  function drawAll(t) {
    if (!world) return;
    const quiet = !free && !bare;
    if (quiet) quietAgain();
    if (draw3d.begin) draw3d.begin(cam);
    draw3d.clear();
    draw3d.sky(cam, LOOK(t, false));
    draw3d.draw(world, cam, LOOK(t, quiet));
    draw3d.drawMist(mist, cam, LOOK(t, quiet));
    if (draw3d.end) draw3d.end(LOOK(t, quiet));
  }

  // ---------- WHAT CAN BE SEEN ----------
  // Whether the mountain stands between a point and the eye: a walk from the
  // point to the eye over its heights (the mountain's own: nothing of the
  // land round it stands in the way of anything on it).
  const athosAt = (x, z) => ground.at(pi + x * (n / 2), pj + z * (n / 2)) * LIFT;
  function seen(p) {
    if (!ground) return true;
    const e = GL.eyeOf(cam);
    for (let k = 1; k <= 36; k++) {
      const t = (k / 36) * (k / 36) * 0.9 + 0.012;
      const x = p.x + (e[0] - p.x) * t, y = p.y + (e[1] - p.y) * t, z = p.z + (e[2] - p.z) * t;
      if (y > LIFT * 1.02) return true;
      if (y < athosAt(x, z) - 0.004) return false;
    }
    return true;
  }
  const worldOf = (u, v, up) => world.point(u, v, up);
  let trailPts = [];
  function lookAgain() {
    trailPts = DATA.trails.map((trail, ti) => {
      if (narrow && !free && !TRAILS_NARROW.includes(ti)) return null;
      return trail.map(([u, v]) => {
        const w = worldOf(u, v, 0.004), q = GL.project(w, cam);
        q.seen = seen(w);
        return q;
      });
    });
    nodesAgain();
    if (STYLE) artAgain();
    lookKey++;
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
    g.fillStyle = "rgb(" + TRAIL.join(",") + ")";
    g.fillRect(0, 0, w, h);
    blaze = c;
    if (STYLE) {
      // (the looks: the same in the line art's white, as a blaze and in the seal)
      const tint = (hh) => { const cw = Math.round((logo.width / logo.height) * hh), cc = document.createElement("canvas"); cc.width = cw; cc.height = hh; const gg = cc.getContext("2d"); gg.drawImage(logo, 0, 0, cw, hh); gg.globalCompositeOperation = "source-in"; gg.fillStyle = "rgb(" + ART.join(",") + ")"; gg.fillRect(0, 0, cw, hh); return cc; };
      blazeWhite = tint(h); logoWhite = tint(240);
    }
  };
  const LOGO_SRC = (window.SITE_ROOT || "../") + "images/Apoteker Tepe/Apoteker Tepe Logo.webp";
  logo.src = LOGO_SRC;
  const rgb = (c, a = 1) => (a >= 1 ? "rgb(" + c.join(",") + ")" : "rgba(" + c.join(",") + "," + a + ")");

  // The trails, losing their opacity behind the writing with the mountain:
  // each stretch drawn at the quiet where it stands, in a few strengths.
  const LEVELS = 5;
  function drawTrails(t) {
    pen.setTransform(ratio, 0, 0, ratio, 0, 0);
    pen.clearRect(0, 0, W, H);
    if (!ground) return;
    // (the looks: with the line art's drawings, the trails white too)
    const white = STYLE && FX.icons, ink = white ? ART : TRAIL, under = white ? ART_UNDER : PAPER;
    const colour = rgb(ink);
    pen.lineCap = "round";
    const width = narrow ? TRAIL_NARROW : TRAIL_WIDE;
    const marks = [];
    const level = (x, y) => (free ? LEVELS - 1 : Math.round(quietAt(x, y) * (LEVELS - 1)));
    // The trails to the summit stop just short of it, where they come
    // together under the house's own mark.
    const top = GL.project(worldOf(pi, pj, 0), cam), clear = Math.max(10, cam.S * 0.035);
    const away = (q) => Math.hypot(q.x - top.x, q.y - top.y) > clear;
    trailPts.forEach((pts, ti) => {
      if (!pts) return;
      const runs = Array.from({ length: LEVELS }, () => []);
      for (let k = 1; k < pts.length; k++) if (pts[k - 1].seen && pts[k].seen && away(pts[k])) runs[level((pts[k - 1].x + pts[k].x) / 2, (pts[k - 1].y + pts[k].y) / 2)].push(pts[k - 1], pts[k]);
      runs.forEach((run, lv) => {
        if (!run.length || !lv || res("trailsgl")) return;   // (`trailsgl`: drawn into the ground itself)
        const strength = lv / (LEVELS - 1);
        const path = () => { pen.beginPath(); for (let q = 0; q < run.length; q += 2) { pen.moveTo(run[q].x, run[q].y); pen.lineTo(run[q + 1].x, run[q + 1].y); } };
        pen.setLineDash([]);
        pen.globalAlpha = (white ? 0.3 : UNDER) * strength;
        pen.strokeStyle = rgb(under);
        pen.lineWidth = width + 1.4;
        path(); pen.stroke();
        pen.setLineDash(DASH);
        pen.lineDashOffset = REDUCE ? 0 : -t * DASH_SPEED;
        pen.globalAlpha = TRAIL_A * strength;
        pen.strokeStyle = colour;
        pen.lineWidth = width;
        path(); pen.stroke();
      });
      // Its number at its foot, and the house's sign blazed along it.
      if (pts[0].seen) marks.push({ kind: "no", x: pts[0].x, y: pts[0].y, say: ROMAN[ti] || String(ti + 1) });
      // (none in the last stretch, where the trails to the summit come together)
      for (let k = BLAZE_EVERY; k < pts.length - Math.max(12, pts.length * 0.12); k += BLAZE_EVERY) if (pts[k].seen && Math.hypot(pts[k].x - top.x, pts[k].y - top.y) > clear * 3) marks.push({ kind: "blaze", x: pts[k].x, y: pts[k].y, z: pts[k].z });
    });
    pen.setLineDash([]);
    pen.font = "500 9.5px 'IBM Plex Mono', ui-monospace, monospace";
    pen.textBaseline = "middle";
    pen.textAlign = "center";
    for (const m of marks) {
      const q = free ? 1 : quietAt(m.x, m.y);
      if (m.kind === "blaze") {
        const mark = white ? blazeWhite : blaze;
        if (!mark) continue;
        const h = BLAZE_TALL * (0.75 + 0.3 * (cam.eye / (cam.eye + m.z))), w = (mark.width / mark.height) * h;
        pen.globalAlpha = 0.9 * q;
        pen.drawImage(mark, m.x - w / 2, m.y - h - 2, w, h);
      } else {
        pen.globalAlpha = (white ? 0.42 : 0.75) * q;
        pen.fillStyle = rgb(under);
        pen.beginPath(); pen.arc(m.x, m.y, 7.5, 0, Math.PI * 2); pen.fill();
        pen.globalAlpha = 0.95 * q;
        pen.strokeStyle = colour;
        pen.lineWidth = 1.1;
        pen.beginPath(); pen.arc(m.x, m.y, 7.5, 0, Math.PI * 2); pen.stroke();
        pen.fillStyle = colour;
        pen.fillText(m.say, m.x, m.y + 0.5);
      }
    }
    pen.globalAlpha = 1;
    if (STYLE) drawArt(t);
  }

  // ---------- THE LOOKS' LINE ART ----------
  // White line drawings over the mountain, turning with it (each worked out
  // in the ground's own space and put on the window as the camera moves):
  //   icons   at each fragrance's place, on a short stem, a drawing of what
  //           it is — an eye in a triangle (The Holy Mountain), a plateau
  //           under the sun (Kogen, the high plain), a crescent and a star
  //           (Brother Night), a crow in flight (Karasu, the crow), a cut
  //           crystal (The Peradam), a flame (Pale Fire), steps going up
  //           (Anabasis, the going up), waves under a rainbow (After the
  //           Flood) — and the trails white;
  //   shapes  geometry standing in the mountain's air, meaning nothing in
  //           particular: an arc from the summit down to a ring on a slope,
  //           a stair of steps up a trail, an arch standing on the ground,
  //           rings round a trail's foot, sights on three places, a plumb
  //           line ticked up from the summit;
  //   seal    fixed to the window: the house's sign in a ring of words,
  //           turning slowly.
  // All of it losing its opacity behind the writing with the mountain.
  const KINDS = [["holy mountain", "eye"], ["kogen", "plateau"], ["brother night", "moon"], ["karasu", "crow"], ["peradam", "crystal"], ["pale fire", "flame"], ["anabasis", "stairs"], ["flood", "waves"]];
  let artIcons = [], artShapes = [], artMarks = [];
  let looksSet = () => {};
  const add3 = (a, b, k = 1) => ({ x: a.x + b.x * k, y: a.y + b.y * k, z: a.z + b.z * k });
  const sub3 = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
  const len3 = (a) => Math.hypot(a.x, a.y, a.z);
  function artAgain() {
    if (!world) return;
    const P = (w) => GL.project(w, cam);
    // the icons, where the free view's nodes stand
    artIcons = !FX.icons ? [] : all.filter((d) => !d.house).map((d) => {
      const w = worldOf(d.u, d.v, NODE_UP * 0.5), q = P(w), name = d.name.toLowerCase();
      return { ...q, seen: seen(w), kind: (KINDS.find(([k]) => name.includes(k)) || [null, "eye"])[1] };
    });
    artShapes = []; artMarks = [];
    if (!FX.shapes) return;
    const T = DATA.trails, at = (ti, share, up = 0) => { const tr = T[ti % T.length], c = tr[Math.round(share * (tr.length - 1))]; return worldOf(c[0], c[1], up); };
    const line = (pts, o = {}) => artShapes.push({ pts: pts.map(P), ...o });
    // an arc from over the summit down to a ring on a slope
    const A = worldOf(pi, pj, 0.03), B = at(1, 0.45, 0.006), C = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, z: (A.z + B.z) / 2 }, r = len3(sub3(A, C));
    const e1 = { x: (A.x - C.x) / r, y: (A.y - C.y) / r, z: (A.z - C.z) / r }, d = e1.y, e2l = Math.hypot(-d * e1.x, 1 - d * e1.y, -d * e1.z) || 1;
    const e2 = { x: (-d * e1.x) / e2l, y: (1 - d * e1.y) / e2l, z: (-d * e1.z) / e2l };
    line(Array.from({ length: 49 }, (_, k) => { const th = (k / 48) * Math.PI; return add3(add3(C, e1, r * Math.cos(th)), e2, r * Math.sin(th)); }));
    artMarks.push({ kind: "ring", ...P(B) }, { kind: "dot", ...P(A) });
    // a stair up a trail, standing a little over it
    let g0 = at(3, 0.2, 0.024), g1 = at(3, 0.55, 0.024);
    if (g1.y < g0.y) [g0, g1] = [g1, g0];
    const stairs = [g0];
    for (let i = 1; i <= 6; i++) { const f = i / 6, x = g0.x + (g1.x - g0.x) * f, z = g0.z + (g1.z - g0.z) * f; stairs.push({ x, y: g0.y + (g1.y - g0.y) * (i - 1) / 6, z }, { x, y: g0.y + (g1.y - g0.y) * f, z }); }
    line(stairs);
    // an arch standing on the ground, square to the page's view
    const Q = at(5, 0.4, 0), right = { x: Math.cos(HOME), y: 0, z: -Math.sin(HOME) }, up = { x: 0, y: 1, z: 0 };
    const arch = (wd, ht) => {
      const pts = [add3(Q, right, -wd / 2)];
      pts.push(add3(pts[0], up, ht - wd / 2));
      const top = add3(Q, up, ht - wd / 2);
      for (let k = 1; k < 24; k++) { const th = Math.PI - (k / 24) * Math.PI; pts.push(add3(add3(top, right, (wd / 2) * Math.cos(th)), up, (wd / 2) * Math.sin(th))); }
      pts.push(add3(add3(Q, right, wd / 2), up, ht - wd / 2), add3(Q, right, wd / 2));
      return pts;
    };
    line(arch(0.075, 0.11)); line(arch(0.05, 0.085));
    line([add3(Q, right, -0.07), add3(Q, right, 0.07)]);
    // rings round a trail's foot, on the ground
    const F = at(4, 0, 0.002);
    [0.045, 0.075, 0.11].forEach((rr) => line(Array.from({ length: 73 }, (_, k) => { const th = (k / 72) * Math.PI * 2; return { x: F.x + rr * Math.cos(th), y: F.y, z: F.z + rr * Math.sin(th) }; }), { dash: [3, 4] }));
    // sights on three places
    [[0, 0.7], [2, 0.3], [4, 0.62]].forEach(([ti, sh]) => { const w = at(ti, sh, 0.004); artMarks.push({ kind: "sight", ...P(w), seen: seen(w) }); });
    // a plumb line ticked up from the summit
    const p0 = worldOf(pi, pj, 0.035), p1 = add3(p0, up, 0.24);
    line([p0, p1], { dash: [2, 3] });
    for (let k = 1; k <= 5; k++) artMarks.push({ kind: "tick", ...P(add3(p0, up, k * 0.04)) });
    artMarks.push({ kind: "ring", ...P(p1) });
  }
  // A drawing of `kind`, half its size `s`, round (x, y): its lines as a path.
  function iconPath(kind, x, y, s) {
    const g = pen;
    g.beginPath();
    if (kind === "eye") {
      g.moveTo(x, y - s * 1.05); g.lineTo(x + s * 1.05, y + s * 0.75); g.lineTo(x - s * 1.05, y + s * 0.75); g.closePath();
      g.moveTo(x - s * 0.62, y + s * 0.22); g.quadraticCurveTo(x, y - s * 0.32, x + s * 0.62, y + s * 0.22); g.quadraticCurveTo(x, y + s * 0.7, x - s * 0.62, y + s * 0.22);
      g.moveTo(x + s * 0.2, y + s * 0.22); g.arc(x, y + s * 0.22, s * 0.2, 0, Math.PI * 2);
    } else if (kind === "plateau") {
      g.moveTo(x - s, y + s * 0.6); g.lineTo(x - s * 0.55, y - s * 0.05); g.lineTo(x + s * 0.55, y - s * 0.05); g.lineTo(x + s, y + s * 0.6); g.closePath();
      g.moveTo(x + s * 0.3, y - s * 0.62); g.arc(x, y - s * 0.62, s * 0.3, 0, Math.PI * 2);
    } else if (kind === "moon") {
      g.arc(x - s * 0.1, y, s * 0.8, Math.PI * 0.3, Math.PI * 1.7);
      g.arc(x + s * 0.22, y - s * 0.02, s * 0.62, Math.PI * 1.45, Math.PI * 0.55, true);
      g.closePath();
      g.moveTo(x + s * 0.75, y - s * 0.95); g.lineTo(x + s * 0.75, y - s * 0.35); g.moveTo(x + s * 0.45, y - s * 0.65); g.lineTo(x + s * 1.05, y - s * 0.65);
    } else if (kind === "crow") {
      g.moveTo(x - s * 1.05, y - s * 0.35); g.quadraticCurveTo(x - s * 0.5, y - s * 0.65, x - s * 0.08, y + s * 0.08);
      g.quadraticCurveTo(x + s * 0.45, y - s * 0.7, x + s * 1.05, y - s * 0.4);
      g.moveTo(x - s * 0.3, y + s * 0.12); g.quadraticCurveTo(x, y + s * 0.38, x + s * 0.32, y + s * 0.1); g.lineTo(x + s * 0.55, y + s * 0.42);
      g.moveTo(x - s * 0.3, y + s * 0.12); g.lineTo(x - s * 0.52, y + s * 0.06);
    } else if (kind === "crystal") {
      g.moveTo(x, y - s); g.lineTo(x + s * 0.68, y - s * 0.34); g.lineTo(x + s * 0.5, y + s * 0.42); g.lineTo(x, y + s); g.lineTo(x - s * 0.5, y + s * 0.42); g.lineTo(x - s * 0.68, y - s * 0.34); g.closePath();
      g.moveTo(x - s * 0.68, y - s * 0.34); g.lineTo(x + s * 0.68, y - s * 0.34);
      g.moveTo(x - s * 0.28, y - s * 0.34); g.lineTo(x, y + s); g.lineTo(x + s * 0.28, y - s * 0.34);
      g.moveTo(x - s * 0.28, y - s * 0.34); g.lineTo(x, y - s); g.lineTo(x + s * 0.28, y - s * 0.34);
    } else if (kind === "flame") {
      g.moveTo(x, y - s * 1.05); g.bezierCurveTo(x + s * 0.55, y - s * 0.38, x + s * 0.78, y + s * 0.38, x, y + s * 0.95); g.bezierCurveTo(x - s * 0.78, y + s * 0.38, x - s * 0.55, y - s * 0.38, x, y - s * 1.05);
      g.moveTo(x, y - s * 0.2); g.bezierCurveTo(x + s * 0.3, y + s * 0.14, x + s * 0.36, y + s * 0.5, x, y + s * 0.72); g.bezierCurveTo(x - s * 0.36, y + s * 0.5, x - s * 0.3, y + s * 0.14, x, y - s * 0.2);
    } else if (kind === "stairs") {
      g.moveTo(x - s, y + s * 0.85);
      for (let k = 0; k < 4; k++) { const sx = x - s + (k + 1) * s * 0.5, sy = y + s * 0.85 - (k + 1) * s * 0.42; g.lineTo(sx - s * 0.5, sy); g.lineTo(sx, sy); }
      g.moveTo(x + s, y - s * 0.83); g.lineTo(x + s, y - s * 1.2); g.lineTo(x + s * 0.64, y - s * 1.08); g.lineTo(x + s, y - s * 0.96);
    } else {
      for (let k = 0; k < 3; k++) { const yy = y + s * (0.18 + k * 0.32); g.moveTo(x - s, yy); for (let i = 1; i <= 12; i++) g.lineTo(x - s + (i / 12) * 2 * s, yy + Math.sin((i / 12) * Math.PI * 3) * s * 0.1); }
      [0.95, 0.72].forEach((rr) => { g.moveTo(x + s * rr, y + s * 0.02); g.arc(x, y + s * 0.02, s * rr, 0, Math.PI, true); });
    }
  }
  function strokeArt(alpha, width) {
    pen.globalAlpha = 0.3 * alpha; pen.strokeStyle = rgb(ART_UNDER); pen.lineWidth = width + 1.6; pen.stroke();
    pen.globalAlpha = 0.95 * alpha; pen.strokeStyle = rgb(ART); pen.lineWidth = width; pen.stroke();
  }
  // A polyline in stretches, each at the quiet where it stands.
  function strokeRuns(pts, dash, width) {
    const runs = Array.from({ length: LEVELS }, () => []);
    for (let k = 1; k < pts.length; k++) runs[free ? LEVELS - 1 : Math.round(quietAt((pts[k - 1].x + pts[k].x) / 2, (pts[k - 1].y + pts[k].y) / 2) * (LEVELS - 1))].push(pts[k - 1], pts[k]);
    pen.setLineDash(dash || []);
    runs.forEach((run, lv) => {
      if (!run.length || !lv) return;
      pen.beginPath();
      for (let q = 0; q < run.length; q += 2) { pen.moveTo(run[q].x, run[q].y); pen.lineTo(run[q + 1].x, run[q + 1].y); }
      strokeArt(lv / (LEVELS - 1), width);
    });
    pen.setLineDash([]);
  }
  let logoWhite = null, blazeWhite = null;
  function drawArt(t) {
    const width = narrow ? ART_NARROW : ART_WIDE;
    pen.lineCap = "round"; pen.lineJoin = "round";
    const qAt = (x, y) => (free ? 1 : quietAt(x, y));
    // the icons, each on a stem from its place
    const s = narrow ? 9 : 12.5, stem = narrow ? 13 : 18;
    for (const ic of artIcons) {
      if (!ic.seen || ic.x < -30 || ic.x > W + 30 || ic.y < -30 || ic.y > H + 30) continue;
      const a = qAt(ic.x, ic.y - stem);
      pen.beginPath(); pen.moveTo(ic.x, ic.y - 2.5); pen.lineTo(ic.x, ic.y - stem);
      pen.moveTo(ic.x + 1.8, ic.y); pen.arc(ic.x, ic.y, 1.8, 0, Math.PI * 2);
      strokeArt(a, width);
      iconPath(ic.kind, ic.x, ic.y - stem - s - 2, s);
      strokeArt(a, width);
    }
    // the shapes
    for (const sh of artShapes) strokeRuns(sh.pts, sh.dash, width);
    for (const m of artMarks) {
      if (m.seen === false) continue;
      const a = qAt(m.x, m.y);
      pen.beginPath();
      if (m.kind === "ring") { pen.arc(m.x, m.y, 5, 0, Math.PI * 2); pen.moveTo(m.x + 1.6, m.y); pen.arc(m.x, m.y, 1.6, 0, Math.PI * 2); }
      else if (m.kind === "dot") pen.arc(m.x, m.y, 2.2, 0, Math.PI * 2);
      else if (m.kind === "tick") { pen.moveTo(m.x - 4, m.y); pen.lineTo(m.x + 4, m.y); }
      else { pen.arc(m.x, m.y, 4.5, 0, Math.PI * 2); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { pen.moveTo(m.x + dx * 6.5, m.y + dy * 6.5); pen.lineTo(m.x + dx * 10, m.y + dy * 10); }); }
      strokeArt(a, width);
    }
    if (FX.seal) drawSeal(t);
    pen.globalAlpha = 1;
  }
  // THE SEAL: the house's sign in a ring of words, turning slowly, fixed to
  // the window — at the bottom left of a wide one, under the button at the
  // top right of a phone's.
  function drawSeal(t) {
    const R = narrow ? 44 : 62, cx = narrow ? W - R - 16 : R + 34, cy = narrow ? 74 + R : H - R - 34;
    const a = free ? 1 : quietAt(cx, cy), turn = REDUCE ? 0 : ((t % SEAL_TURN) / SEAL_TURN) * Math.PI * 2;
    const width = narrow ? ART_NARROW : ART_WIDE, band = narrow ? 12 : 16;
    pen.beginPath();
    pen.arc(cx, cy, R, 0, Math.PI * 2);
    pen.moveTo(cx + R - band, cy); pen.arc(cx, cy, R - band, 0, Math.PI * 2);
    for (let k = 0; k < 48; k++) { const th = turn * -0.6 + (k / 48) * Math.PI * 2, r0 = R - band - 3, r1 = r0 - (k % 4 ? 2.5 : 5); pen.moveTo(cx + Math.cos(th) * r0, cy + Math.sin(th) * r0); pen.lineTo(cx + Math.cos(th) * r1, cy + Math.sin(th) * r1); }
    strokeArt(a, width);
    const chars = (SEAL_WORDS + "  ·  ").split(""), step = (Math.PI * 2) / chars.length, rt = R - band / 2;
    pen.font = "500 " + (narrow ? 7 : 8.6) + "px 'IBM Plex Mono', ui-monospace, monospace";
    pen.textAlign = "center"; pen.textBaseline = "middle";
    pen.fillStyle = rgb(ART);
    pen.globalAlpha = 0.95 * a;
    chars.forEach((ch, k) => {
      if (ch === " ") return;
      const th = turn + k * step - Math.PI / 2;
      pen.save(); pen.translate(cx + Math.cos(th) * rt, cy + Math.sin(th) * rt); pen.rotate(th + Math.PI / 2); pen.fillText(ch, 0, 0.5); pen.restore();
    });
    if (logoWhite) {
      const h = (R - band - 9) * 1.35, w = (logoWhite.width / logoWhite.height) * h;
      pen.globalAlpha = 0.95 * a;
      pen.drawImage(logoWhite, cx - w / 2, cy - h / 2, w, h);
    }
  }

  // ---------- THE QUIET ----------
  // How much of the drawing is left at every place of the window: from the
  // writing's own boxes, worked out a step of QUIET_STEP px at a time, made
  // again as the page moves and handed to the drawing. On a wide window,
  // QUIET where the words are, coming on over SOFT px round them; on a
  // phone, where the writing is the whole width, QUIET everywhere and the
  // words' own KEEP of that behind them.
  let quietFor = "", quietCells = null, quietBytes = null, qw = 0, qh = 0;
  // (The writing's boxes, on the window.)
  const wordsNow = () => (window.Writing ? window.Writing.boxes() : []);
  const wordsKey = (boxes) => W + "x" + H + "," + boxes.length + "," + (boxes.length ? Math.round(boxes[0].t) + "," + Math.round(boxes[boxes.length - 1].b) : "") + "," + narrow;
  function quietAgain() {
    const boxes = wordsNow();
    const key = wordsKey(boxes);
    if (key === quietFor) return false;
    quietFor = key;
    qw = Math.ceil(W / QUIET_STEP); qh = Math.ceil(H / QUIET_STEP);
    if (!quietCells || quietCells.length !== qw * qh) { quietCells = new Float32Array(qw * qh); quietBytes = new Uint8Array(qw * qh); }
    quietCells.fill(0);
    const feather = narrow ? 24 : Math.min(SOFT, W * 0.14);
    for (const b of boxes) {
      const l = b.l, t = b.t, r = b.r, bt = b.b;
      if (bt < -feather || t > H + feather || r < -feather || l > W + feather) continue;
      const i0 = Math.max(0, Math.floor((l - feather) / QUIET_STEP)), i1 = Math.min(qw - 1, Math.floor((r + feather) / QUIET_STEP));
      const j0 = Math.max(0, Math.floor((t - feather) / QUIET_STEP)), j1 = Math.min(qh - 1, Math.floor((bt + feather) / QUIET_STEP));
      for (let j = j0; j <= j1; j++) {
        const y = (j + 0.5) * QUIET_STEP, dy = Math.max(t - y, 0, y - bt);
        for (let i = i0; i <= i1; i++) {
          const x = (i + 0.5) * QUIET_STEP, dx = Math.max(l - x, 0, x - r), k = j * qw + i;
          const v = 1 - Math.hypot(dx, dy) / feather;
          if (v > quietCells[k]) quietCells[k] = v;
        }
      }
    }
    const keep = window.Writing ? window.Writing.KEEP : 0.3;
    for (let k = 0; k < qw * qh; k++) {
      const words = quietCells[k], ease = words * words * (3 - 2 * words);
      const left = narrow ? QUIET * (1 - (1 - keep) * ease) : 1 - (1 - QUIET) * ease;
      quietCells[k] = left;
      quietBytes[k] = Math.round(left * 255);
    }
    draw3d.quiet(quietBytes, qw, qh);
    return true;
  }
  function quietAt(x, y) {
    if (free) return 1;
    if (!quietCells) quietAgain();
    const i = Math.floor(x / QUIET_STEP), j = Math.floor(y / QUIET_STEP);
    if (i < 0 || j < 0 || i >= qw || j >= qh) return narrow ? QUIET : 1;
    return quietCells[j * qw + i];
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
  stage.setAttribute("aria-label", "Mount Athos, to look round: drag to turn it a little, the arrow keys too");
  stage.hidden = true;
  stage.innerHTML = '<p class="tepe-hint"></p><div class="tepe-card" hidden><span class="tepe-card-pic"><img alt=""></span><span class="tepe-card-text"><span class="tepe-card-no"></span><span class="tepe-card-name"></span><span class="tepe-card-made"></span><span class="tepe-card-go"></span></span></div>';
  document.body.appendChild(stage);
  const hint = stage.querySelector(".tepe-hint"), card = stage.querySelector(".tepe-card");
  // A NODE for each fragrance, where its name says it stands — and the
  // house's own, at the summit, which shows the house's sign.
  const makeNode = (say, cls) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "tepe-node" + (cls ? " " + cls : "");
    el.setAttribute("aria-label", say);
    stage.appendChild(el);
    return el;
  };
  const nodes = parts.map((part) => {
    const no = part.id.replace("part-", ""), at = DATA.places && DATA.places[no];
    if (!at) return null;
    const name = part.querySelector(".human-title").textContent.trim(), made = (part.querySelector(".human-made") || { textContent: "" }).textContent.trim();
    const img = part.querySelector("summary img");
    const el = makeNode(name + (made ? ", " + made : "") + " — go to it on the page");
    el.dataset.part = no;
    el.innerHTML = '<span class="tepe-node-ring" aria-hidden="true"></span><span class="tepe-node-no" aria-hidden="true">' + no + "</span>";
    return { el, part, no, name, made, pic: img ? img.getAttribute("src") : "", u: at[0], v: at[1], q: null };
  }).filter(Boolean);
  const houseName = (document.querySelector(".human-head h1") || { childNodes: [] }).childNodes[0];
  const house = {
    el: makeNode("Apoteker Tepe — to the head of the page", "tepe-node-house"), house: true, no: "", name: houseName && houseName.textContent ? houseName.textContent.trim() : "Apoteker Tepe",
    made: ((document.querySelector(".human-head h1 em") || { textContent: "" }).textContent || "").trim(), pic: LOGO_SRC, u: pi, v: pj, q: null,
  };
  house.el.dataset.part = "house";
  house.el.innerHTML = '<span class="tepe-node-ring" aria-hidden="true"></span>';
  const all = [house, ...nodes];
  let shownCard = null, shownBy = "";
  function nodesAgain() {
    if (!free) return;
    for (const d of all) {
      const w = worldOf(d.u, d.v, d.house ? NODE_UP * 2.2 : NODE_UP), q = GL.project(w, cam);
      d.q = q;
      const ok = seen(w) && q.x > -20 && q.x < W + 20 && q.y > -20 && q.y < H + 20;
      d.el.style.transform = "translate(" + q.x.toFixed(1) + "px," + q.y.toFixed(1) + "px)";
      d.el.classList.toggle("behind", !ok);
      d.el.tabIndex = ok ? 0 : -1;
      d.ok = ok;
    }
    if (shownCard) placeCard(shownCard);
  }
  function placeCard(d) {
    if (!d.q) return;
    const cw = card.offsetWidth || 240, ch = card.offsetHeight || 80;
    let x = d.q.x + 18, y = d.q.y - ch / 2;
    if (d.house) { x = d.q.x - cw / 2; y = d.q.y - ch - 24; if (y < 64) { x = d.q.x + 22; y = Math.max(64, d.q.y - ch / 2); } }
    else if (x + cw > W - 12) x = d.q.x - 18 - cw;
    x = Math.max(10, Math.min(W - cw - 10, x));
    y = Math.max(64, Math.min(H - ch - 12, y));
    card.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
  }
  function showCard(d, by = "hand") {
    if (shownCard === d) { shownBy = by; return; }
    shownCard = d; shownBy = by;
    all.forEach((x) => x.el.classList.toggle("lit", x === d));
    card.classList.toggle("tepe-card-house", !!d.house);
    card.querySelector(".tepe-card-no").textContent = d.no;
    card.querySelector(".tepe-card-name").textContent = d.name;
    card.querySelector(".tepe-card-made").textContent = d.made;
    card.querySelector(".tepe-card-go").textContent = d.house ? "To the head of the page →" : "Read about it →";
    const im = card.querySelector("img");
    im.src = d.pic; im.alt = d.house ? "The house's sign" : "";
    card.hidden = false;
    card.dataset.part = d.house ? "house" : d.no;
    card.classList.remove("shown");
    requestAnimationFrame(() => card.classList.add("shown"));
    placeCard(d);
  }
  function hideCard() {
    shownCard = null; shownBy = "";
    all.forEach((x) => x.el.classList.remove("lit"));
    card.classList.remove("shown");
    card.hidden = true;
  }
  /** Back to the page, at fragrance `d`, opened (or at its head, for the house). */
  function goTo(d) {
    leaveFree();
    setTimeout(() => {
      if (d.house) { window.scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" }); return; }
      const part = d.part;
      if (!part.open) part.querySelector("summary").click();
      const top = part.getBoundingClientRect().top + window.scrollY - (narrow ? 70 : 80);
      window.scrollTo({ top, behavior: REDUCE ? "auto" : "smooth" });
    }, REDUCE ? 0 : 380);
  }
  // THE HAND's last doing, so the nodes speak of their own accord only once it is gone.
  let handAt = 0, popAt = 0, popNext = 0;
  const handled = () => { handAt = performance.now(); };
  all.forEach((d) => {
    d.el.addEventListener("pointerenter", (e) => { handled(); if (e.pointerType !== "touch") showCard(d); });
    // (Focus from the keyboard only: a tap focuses as it lands, and the
    // tap's own press would then take it straight to the page.)
    d.el.addEventListener("focus", () => { if (d.el.matches(":focus-visible")) { handled(); showCard(d); } });
    d.el.addEventListener("pointerleave", (e) => { handled(); if (e.pointerType !== "touch" && !card.matches(":hover")) setTimeout(() => { if (shownCard === d && !card.matches(":hover") && !d.el.matches(":hover")) hideCard(); }, 120); });
    d.el.addEventListener("click", () => {
      handled();
      // A finger's first tap says what it is; the second, or the card, goes
      // (and so does the first, on a node already saying what it is).
      if (lastPointer === "touch" && shownCard !== d) { showCard(d); return; }
      goTo(d);
    });
  });
  card.addEventListener("click", () => { const d = all.find((x) => (x.house ? "house" : x.no) === card.dataset.part); if (d) goTo(d); });
  card.addEventListener("pointerenter", handled);
  card.addEventListener("pointerleave", (e) => { handled(); if (e.pointerType !== "touch") setTimeout(() => { if (shownCard && !card.matches(":hover") && !shownCard.el.matches(":hover")) hideCard(); }, 120); });
  // Left alone, one after another, each says what it is for a moment.
  function popAgain(now) {
    if (!free || REDUCE || held.size) return;
    if (shownCard && shownBy === "auto" && now - popAt > POP_SHOWN) hideCard();
    if (shownCard && shownBy !== "auto") return;
    if (now - handAt < POP_AFTER || now - freeAt < POP_FIRST || now - popAt < POP_EVERY) return;
    for (let k = 0; k < all.length; k++) {
      const d = all[(popNext + k) % all.length];
      if (d.ok) { popNext = (all.indexOf(d) + 1) % all.length; popAt = now; showCard(d, "auto"); return; }
    }
  }

  let restoreFocus = null;
  function enterFree() {
    if (free) return;
    free = true; freeAt = performance.now(); popAt = 0; popNext = 0;
    restoreFocus = document.activeElement;
    document.documentElement.classList.add("tepe-free-on");
    document.documentElement.style.overflow = "hidden";
    button.setAttribute("aria-pressed", "true");
    button.querySelector(".tepe-free-say").textContent = "Back to the page";
    stage.hidden = false;
    hint.classList.remove("gone");
    hint.textContent = matchMedia("(pointer: coarse)").matches ? "Drag to look round · tap a node" : "Drag to look round · point at a node";
    Object.assign(want, fitFree(), { yaw: clampYaw(cam.yaw, 0), pitch: freePitch() });
    lookAgain();
    stage.focus({ preventScroll: true });
    setTimeout(() => { if (free) hint.classList.add("gone"); }, 6000);
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
    if (restoreFocus && restoreFocus.focus && document.contains(restoreFocus)) restoreFocus.focus({ preventScroll: true });
    else button.focus({ preventScroll: true });
    quietFor = "";
  }
  button.addEventListener("click", () => (free ? leaveFree() : enterFree()));
  // ONLY SO FAR: FREE either way of the view, PITCH_FREE up and down — a
  // drag past it gives a little (GIVE) and springs back once let go.
  const clampYaw = (y, give) => { const lo = HOME - FREE * (1 + give), hi = HOME + FREE * (1 + give); return Math.max(lo, Math.min(hi, y)); };
  const clampPitch = (p, give) => { const span = PITCH_FREE[1] - PITCH_FREE[0], lo = PITCH_FREE[0] - span * give * 0.5, hi = PITCH_FREE[1] + span * give * 0.5; return Math.max(lo, Math.min(hi, p)); };
  // Past the limit, a drag goes a third as far.
  const resist = (v, d, lo, hi) => { const nv = v + d; return (nv < lo && d < 0) || (nv > hi && d > 0) ? v + d * 0.35 : nv; };
  document.addEventListener("keydown", (e) => {
    if (!free) return;
    const step = e.shiftKey ? 0.2 : 0.08;
    if (e.key === "Escape") { leaveFree(); e.preventDefault(); return; }
    if (e.target && e.target.closest && e.target.closest(".site-menu, .menu-overlay")) return;
    const k = e.key;
    if (k === "ArrowLeft") want.yaw = clampYaw(want.yaw - step, 0);
    else if (k === "ArrowRight") want.yaw = clampYaw(want.yaw + step, 0);
    else if (k === "ArrowUp") want.pitch = clampPitch(want.pitch + step * 0.5, 0);
    else if (k === "ArrowDown") want.pitch = clampPitch(want.pitch - step * 0.5, 0);
    else if (k === "0") Object.assign(want, { yaw: HOME, pitch: freePitch() });
    else return;
    handled();
    e.preventDefault();
  });
  // THE HAND IN THE FREE VIEW: a drag turns it, a little.
  const held = new Map();
  let lastPointer = "mouse";
  stage.addEventListener("contextmenu", (e) => e.preventDefault());
  stage.addEventListener("pointerdown", (e) => {
    lastPointer = e.pointerType;
    handled();
    if (e.target.closest(".tepe-node, .tepe-card")) return;
    if (shownCard && (e.pointerType === "touch" || shownBy === "auto")) hideCard();
    stage.setPointerCapture(e.pointerId);
    held.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.classList.add("held");
    e.preventDefault();
  });
  stage.addEventListener("pointermove", (e) => {
    const h = held.get(e.pointerId);
    if (!h) return;
    const dx = e.clientX - h.x, dy = e.clientY - h.y;
    h.x = e.clientX; h.y = e.clientY;
    if (held.size > 1) return;
    want.yaw = clampYaw(resist(want.yaw, dx * 0.0042, HOME - FREE, HOME + FREE), GIVE);
    want.pitch = clampPitch(resist(want.pitch, dy * 0.003, PITCH_FREE[0], PITCH_FREE[1]), GIVE);
    handled();
    hint.classList.add("gone");
  });
  const up = (e) => {
    held.delete(e.pointerId);
    if (!held.size) {
      stage.classList.remove("held");
      // ...and back within its limits.
      want.yaw = clampYaw(want.yaw, 0); want.pitch = clampPitch(want.pitch, 0);
    }
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
  // No nearer and no further: the wheel and a pinch do nothing here.
  stage.addEventListener("wheel", (e) => e.preventDefault(), { passive: false });
  stage.addEventListener("dblclick", (e) => { if (e.target === stage) Object.assign(want, { yaw: HOME, pitch: freePitch() }); });

  // ---------- THE LOOKS' PANEL (a trial: `?res=style`) ----------
  // At the bottom right: the colour, gone round by its arrows; the texture,
  // the line art and the extras, each pressed on or off; and the drawing
  // under it — the page as it is, or the realistic one (`?res=real`), which
  // is a reload. What it shows is kept in the address as it changes.
  if (STYLE) {
    const panel = document.createElement("aside");
    panel.className = "tepe-looks";
    panel.setAttribute("aria-label", "Looks — a temporary panel, to try them");
    const chip = (k, say) => '<button type="button" class="tepe-looks-chip" data-fx="' + k + '" aria-pressed="false">' + say + "</button>";
    panel.innerHTML =
      '<div class="tepe-looks-head"><span class="tepe-looks-title">Looks</span><span class="tepe-looks-note">Temporary</span><button type="button" class="tepe-looks-fold" aria-expanded="true">Hide</button></div>' +
      '<div class="tepe-looks-body">' +
      '<div class="tepe-looks-row"><span class="tepe-looks-name">Colour</span><span class="tepe-looks-cycle"><button type="button" class="tepe-looks-step" data-step="-1" aria-label="The colour before">‹</button><span class="tepe-looks-colour" aria-live="polite"></span><button type="button" class="tepe-looks-step" data-step="1" aria-label="The next colour">›</button></span></div>' +
      '<div class="tepe-looks-row"><span class="tepe-looks-name">Texture</span><span class="tepe-looks-chips">' + chip("halftone", "Halftone") + chip("dither", "Dither") + chip("engrave", "Engraved") + chip("grain", "Grain") + "</span></div>" +
      '<div class="tepe-looks-row"><span class="tepe-looks-name">Line art</span><span class="tepe-looks-chips">' + chip("icons", "Icons") + chip("shapes", "Shapes") + chip("seal", "Seal") + "</span></div>" +
      '<div class="tepe-looks-row"><span class="tepe-looks-name">Extras</span><span class="tepe-looks-chips">' + chip("coast", "Coastline") + chip("haze", "Colour haze") + chip("contours", "Contours") + chip("drift", "Drift") + "</span></div>" +
      '<div class="tepe-looks-row"><span class="tepe-looks-name">Base</span><span class="tepe-looks-chips"><a class="tepe-looks-chip" data-base="page">As it is</a><a class="tepe-looks-chip" data-base="real">Realistic</a></span></div>' +
      "</div>";
    document.body.appendChild(panel);
    document.documentElement.classList.add("tepe-looks-on");
    const baseNow = res("real") ? "real" : "page";
    const words = () => [FX.palette, ...FX_WORDS.filter((k) => FX[k])].join(",");
    // (a word put in the address as it is: commas and all, as tepe-gl.js reads `res=`)
    const withParam = (search, key, value) => { const re = new RegExp("([?&])" + key + "=[^&#]*"); return re.test(search) ? search.replace(re, "$1" + key + "=" + value) : search + (search ? "&" : "?") + key + "=" + value; };
    function show() {
      panel.querySelector(".tepe-looks-colour").textContent = COLOURS.find(([k]) => k === FX.palette)[1];
      panel.querySelectorAll("[data-fx]").forEach((b) => b.setAttribute("aria-pressed", FX[b.dataset.fx] ? "true" : "false"));
      panel.querySelectorAll("[data-base]").forEach((a) => {
        const b = a.dataset.base, search = withParam(withParam(location.search, "res", b === "real" ? "real,style" : "style"), "fx", words());
        a.href = location.pathname + search + location.hash;
        if (b === baseNow) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }
    function changed() {
      show();
      try { history.replaceState(history.state, "", location.pathname + withParam(location.search, "fx", words()) + location.hash); } catch (e) { /* only the address */ }
      drawnCam = null;
      if (draw3d.restart) draw3d.restart();
      if (REDUCE) requestAnimationFrame((t) => frame(t));
    }
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.fx) { FX[b.dataset.fx] = !FX[b.dataset.fx]; changed(); }
      else if (b.dataset.step) { const i = COLOURS.findIndex(([k]) => k === FX.palette); FX.palette = COLOURS[(i + Number(b.dataset.step) + COLOURS.length) % COLOURS.length][0]; changed(); }
      else if (b.classList.contains("tepe-looks-fold")) {
        const folded = panel.classList.toggle("folded");
        b.setAttribute("aria-expanded", folded ? "false" : "true");
        b.textContent = folded ? "Show" : "Hide";
      }
    });
    show();
    looksSet = (o) => { Object.assign(FX, o); changed(); };
  }

  // ---------- KEEPING UP ----------
  window.addEventListener("resize", size);
  size();
  GL.ground().then((g) => {
    ground = g;
    build();
    drawnCam = null;
  });

  let last = performance.now(), drawnAt = -1e9, frames = 0, scrolledAt = 0;
  window.addEventListener("scroll", () => { scrolledAt = performance.now(); }, { passive: true });
  function frame(now) {
    if (sharp) sharp.frame(now);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = clock();
    // Never quite still: it breathes.
    const sway = REDUCE ? { y: 0, p: 0 } : { y: SWAY.yaw * Math.sin((t / SWAY.yawEvery) * Math.PI * 2), p: SWAY.pitch * Math.sin((t / SWAY.pitchEvery) * Math.PI * 2 + 1.3) };
    if (!free) Object.assign(want, frameOf(), { yaw: turnFor(), pitch: PITCH });
    // The camera goes after where it is wanted: slowly on the page, quickly
    // in the free view.
    const tau = free ? FREE_EASE : TURN_EASE;
    const e = REDUCE ? 1 : 1 - Math.exp(-dt / tau), ef = REDUCE ? 1 : 1 - Math.exp(-dt / (free || now - freeAt < 1500 ? FREE_EASE * 2.5 : 0.35));
    cam.yaw += (want.yaw + sway.y - cam.yaw) * e;
    cam.pitch += (want.pitch + sway.p - cam.pitch) * ef;
    cam.S += (want.S - cam.S) * ef; cam.cx += (want.cx - cam.cx) * ef; cam.cy += (want.cy - cam.cy) * ef;
    if (!ground || !world) return;
    // The trails and the nodes are placed again only once the camera has
    // moved by as much as a third of a pixel anywhere.
    const S = Math.max(cam.S, 1), dc = drawnCam;
    const moved = !dc || Math.abs(cam.yaw - dc.yaw) * S > 0.33 || Math.abs(cam.pitch - dc.pitch) * S > 0.33 || Math.abs(cam.S - dc.S) > 0.33 || Math.abs(cam.cx - dc.cx) > 0.33 || Math.abs(cam.cy - dc.cy) > 0.33;
    // Drawn every frame while anything moves, every other frame while only
    // the mist and the clouds do; without a graphics card, at most so often;
    // with reduced motion, only when something has changed.
    const odd = (frames++ & 1) === 1;
    // (and, without one, less often still while the page is being scrolled:
    // it keeps its frames, and the mountain catches up as it comes to rest
    // — and while nothing moves but the mist, a picture a second is enough)
    const slowEvery = draw3d.soft ? (now - scrolledAt < 250 ? SOFT_EVERY * 2.5 : moved ? SOFT_EVERY : SOFT_EVERY * 3.3) : SOFT_EVERY * 10;
    const due = REDUCE ? moved || quietMoved() || drawnAt < 0 : draw3d.slow ? now - drawnAt >= slowEvery : moved || !odd;
    popAgain(now);
    if (!due) return;
    drawAll(t);
    if (moved || free) { lookAgain(); drawnCam = { ...cam }; }
    drawTrails(t);
    drawnAt = now;
    document.documentElement.classList.add("tepe-ground");
  }
  // (With reduced motion it is drawn again only when something has changed:
  // the camera, or where the words stand on the window.)
  let quietSeen = "";
  const quietMoved = () => { const k = wordsKey(wordsNow()) + "," + free; const c = k !== quietSeen; quietSeen = k; return c; };

  // FOR THE TESTS: how far it is turned, how many specks, the trails, the
  // quiet at a place, the free view and its nodes.
  window.TepeMountain = {
    turn: () => cam.yaw,
    view: () => ({ ...VIEW }),
    // How long the mountain and its sky take to draw again, in ms (the mean
    // of `times`, each waited for).
    time: (times = 10) => {
      const gl = draw3d.gl, one = new Uint8Array(4), t0 = performance.now();
      for (let i = 0; i < times; i++) { cam.yaw += 0.0005; drawAll(clock()); lookAgain(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, one); }
      return (performance.now() - t0) / times;
    },
    ready: () => !!(ground && world),
    // Each part of a picture, timed on its own (ms, each waited for).
    parts: (times = 2) => {
      const gl = draw3d.gl, one = new Uint8Array(4), out = {}, t = clock();
      const time = (name, f) => { gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, one); const t0 = performance.now(); for (let i = 0; i < times; i++) { f(); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, one); } out[name] = Math.round((performance.now() - t0) / times); };
      time("clear", () => draw3d.clear());
      time("sky", () => draw3d.sky(cam, LOOK(t, false)));
      time("ground+specks", () => draw3d.draw(world, cam, LOOK(t, true)));
      time("ground+specks, no quiet", () => draw3d.draw(world, cam, LOOK(t, false)));
      time("mist", () => draw3d.drawMist(mist, cam, LOOK(t, true)));
      time("trails", () => drawTrails(t));
      time("quiet", () => { quietFor = ""; quietAgain(); });
      return out;
    },
    // The ground alone (the mountain and the land), drawn without the quiet
    // over black and then over white: how much of the window it covers, how
    // much of that is SOLID (the same over both), and of what colours; and
    // the mountain's own body, under the summit.
    sample: () => {
      const gl = draw3d.gl, w = field.width, h = field.height, a = new Uint8Array(w * h * 4), b = new Uint8Array(w * h * 4);
      const look = { ...LOOK(clock(), false), air: [AIR[0], 0, AIR[2], 0] };
      draw3d.clear([0, 0, 0]); draw3d.draw(world, cam, look); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, a);
      draw3d.clear([1, 1, 1]); draw3d.draw(world, cam, look); gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, b);
      drawnCam = null;
      const top = GL.project(worldOf(pi, pj, 0), cam), r = draw3d.gl.canvas.width / W;
      const body = { l: (top.x - cam.S * 0.22) * r, r: (top.x + cam.S * 0.22) * r, t: (top.y + cam.S * 0.06) * r, b: (top.y + cam.S * 0.26) * r };
      let inBody = 0, bodySolid = 0, land = 0, solid = 0, green = 0, grey = 0, warm = 0;
      for (let k = 0; k < a.length; k += 4 * 5) {
        const shown = a[k] + a[k + 1] + a[k + 2] > 6 || b[k] + b[k + 1] + b[k + 2] < 759;
        if (!shown) continue;
        const px = (k / 4) % w, py = h - 1 - Math.floor(k / 4 / w);
        const same = Math.abs(a[k] - b[k]) + Math.abs(a[k + 1] - b[k + 1]) + Math.abs(a[k + 2] - b[k + 2]) < 6;
        if (px > body.l && px < body.r && py > body.t && py < body.b) { inBody++; if (same) bodySolid++; }
        land++;
        if (!same) continue;
        solid++;
        const R = a[k], g = a[k + 1], bl = a[k + 2], hi = Math.max(R, g, bl), lo = Math.min(R, g, bl);
        if (g > R * 1.06 && g > bl * 1.06) green++;
        else if (hi - lo < 16) grey++;
        else if (R >= g) warm++;
      }
      return { covers: land / (a.length / 20), body: bodySolid / Math.max(1, inBody), solid: solid / Math.max(1, land), green: green / Math.max(1, solid), grey: grey / Math.max(1, solid), warm: warm / Math.max(1, solid) };
    },
    // THE DITHER, read off the sky at the top of the window: how many of its
    // pixels stand a step of light from the one beside them (a step is a
    // 255 / `levels` of the way), as an ordered dither puts them.
    dither: () => {
      const gl = draw3d.gl, w = field.width, h = Math.max(4, Math.round(field.height * 0.12)), a = new Uint8Array(w * h * 4);
      drawAll(clock());
      gl.readPixels(0, field.height - h, w, h, gl.RGBA, gl.UNSIGNED_BYTE, a);
      let pairs = 0, steps = 0;
      const shades = new Set();
      for (let y = 0; y < h; y += 2) for (let x = 0; x < w - 1; x++) {
        const k = (y * w + x) * 4, d = Math.abs(a[k] - a[k + 4]);
        shades.add(a[k]);
        pairs++;
        if (d >= 4 && d <= 14) steps++;
      }
      return { steps: steps / Math.max(1, pairs), shades: shades.size, levels: DITHER.levels };
    },
    specks: () => (world ? world.specks : 0),
    // THE TRIALS: which are on and what the machine let them do; and, for
    // a still picture of `accum`, so many more pictures laid over it.
    trials: () => ({ ...(window.__tepeTrials || {}), ratio, canvas: [field.width, field.height] }),
    bare: (on = true) => { bare = on; drawnCam = null; },
    // where a place on the grid stands on the window (css px), as drawn now
    at: (u, v, up = 0) => (world ? GL.project(worldOf(u, v, up), cam) : null),
    settle: (times = 16) => { for (let i = 0; i < times; i++) drawAll(clock()); drawTrails(clock()); return draw3d.settled ? draw3d.settled() : 0; },
    vertices: () => (world ? world.vertices : 0),
    mist: () => (mist ? mist.count : 0),
    soft: () => draw3d.soft,
    slow: () => draw3d.slow,
    trails: () => DATA.trails.length,
    blazes: () => !!blaze,
    figure: () => DATA.figure,
    sign: () => !!(ground && ground.sign),
    quiet: (x, y) => { quietFor = ""; quietAgain(); return quietAt(x, y); },
    free: () => free,
    // Send the free view's camera somewhere (a picture of it, a test).
    look: ({ now, ...o }) => { Object.assign(want, o); if (REDUCE || now) Object.assign(cam, want); handled(); },
    camera: () => ({ ...cam }),
    // where the camera is going (the page's turn, or the free view's), before it breathes
    want: () => ({ yaw: want.yaw, pitch: want.pitch }),
    limits: () => ({ yaw: [HOME - FREE, HOME + FREE], pitch: PITCH_FREE.slice(), page: [HOME - PAGE, HOME + PAGE] }),
    nodes: () => all.map((d) => ({ no: d.house ? "house" : d.no, name: d.name, x: d.q ? d.q.x : null, y: d.q ? d.q.y : null, seen: !d.el.classList.contains("behind") })),
    card: () => (shownCard ? { part: card.dataset.part, by: shownBy } : null),
    // THE LOOKS (a trial): what the panel shows, and changing it as a press would
    looks: () => (STYLE ? { ...FX } : null),
    setLooks: (o) => looksSet(o),
    art: () => ({ icons: artIcons.filter((d) => d.seen).length, shapes: artShapes.length, marks: artMarks.length, seal: STYLE && !!FX.seal }),
  };
  if (REDUCE) {
    const again = () => requestAnimationFrame((t) => frame(t));
    window.addEventListener("scroll", again, { passive: true });
    window.addEventListener("resize", again);
    // The free view still moves when it is moved, at once.
    ["pointermove", "keydown", "click"].forEach((ev) => document.addEventListener(ev, () => (free || ev === "click") && again(), { passive: true }));
    GL.ground().then(() => requestAnimationFrame(() => { again(); }));
    // (and once the writing has been measured)
    setTimeout(again, 1600); setTimeout(again, 3400);
  } else {
    (function tick(now) { frame(now); requestAnimationFrame(tick); })(performance.now());
  }
})();

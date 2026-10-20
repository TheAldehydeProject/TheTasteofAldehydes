// ============================================================
// APOTEKER TEPE — houses/apoteker-tepe.html
//
// The thirteenth house, and its ground: A MOUNTAIN. The owner, 2026-10-20:
// "The house page should be themed like a mountain. I want there to be a
// whole mountain constructed in 3d in the background ... using
// https://github.com/image-js/image-js. I want you to make this mountain
// green, and granular, and make it feel like a really vintage photograph,
// made digital and then made into a 3d render. Following this, I want you
// to add lines to this mountain, as if tracks or trails that are just
// random indications. Feel free to use an actual mountain that exists in
// the world for this ... For the random lines and such, feel free to
// incorporate the logo of apoteker tepe there, I want this to be reactive,
// and rotate when you scroll. I want the text in front of the mountain to
// be legible."
//
//   THE MOUNTAIN  MOUNT ATHOS, the Holy Mountain of northern Greece, out of
//                 the real ground's heights: tepe-data.js, written by
//                 tools/apoteker/mountain.mjs with image-js — the heights,
//                 and an AGED PHOTOGRAPH of it (lit by an afternoon sun,
//                 softened, faded, grained, darker to its corners). The
//                 page raises the photograph into three dimensions by the
//                 heights, in SPECKS of green — darker and closer together
//                 where the photograph is darker — fading out round the
//                 mountain's foot so it stands whole, the sea a few pale
//                 specks under it. It TURNS AS THE PAGE IS SCROLLED, most
//                 of a turn from the head of the page to its foot (TURN),
//                 catching the scroll up a beat behind it.
//   THE TRAILS    walks up its slopes from the shore and one round its
//                 shoulder, in the faded red-brown of a pencil on an old
//                 print — dashed, the dashes going slowly along them, each
//                 numbered at its foot and BLAZED with the house's own
//                 sign as a path is marked on a tree, the summit with its
//                 height and where it stands; hidden where the mountain
//                 stands in front of them.
//   THE HAND      the specks near it lift a little and lighten, as grass
//                 does under a breath; and the trail nearest it is drawn
//                 a little more plainly.
//   THE PRINT     the paper aged and its grain (style.css, and a grain laid
//                 once over the window, never drawn again).
//
// READABILITY: every speck, line and mark goes faint behind the words
// (`window.Writing`, KEEP), on every width — the mountain stands behind the
// writing, and the writing is read in front of it.
//
// QUICK TO DRAW: the specks are drawn on their own canvas, again ONLY when
// something has moved (the turn, the hand, the page under the window) —
// sorted into a few tones and strengths, each set once; the trails on a
// canvas of their own over it, the one thing drawn every frame. Sharp on
// every screen (`window.Sharpness`), let down on a slow one.
//
// WITH REDUCED MOTION: the mountain stands as the scroll puts it, at once,
// nothing going along the trails, nothing answering the hand. WITHOUT THIS
// SCRIPT the page is its writing on aged paper.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  const DATA = window.TEPE;
  if (!canvas || !DATA) return;
  const ink = canvas.getContext("2d");
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- TUNING ----------
  const NARROW_AT = 700;
  const SPECKS_WIDE = 28000;       // the mountain's specks on a wide window
  const SPECKS_NARROW = 14000;     // and on a phone: fewer, a little stronger
  const SEA = 0.05;                // of the specks' weight, on the water
  const REACH = 0.47;              // of the square, round the summit: how far the mountain is drawn before it fades out
  const LIFT = 0.42;               // the summit's height, in half-widths of the square (the real one is 0.25: raised a little)
  const PITCH = 0.36;              // radians the eye looks down on it
  const EYE = 4.2;                 // how far the eye stands off, in half-widths (perspective)
  const TURN_FROM = -0.55;         // radians it is turned at the head of the page
  const TURN = Math.PI * 1.55;     // and how much more by its foot
  const TURN_EASE = 0.42;          // s in which it catches the scroll up
  const KEEP = 0.2;                // what is left of a speck or a line behind the words
  const TONES = [                  // the print's greens, darkest first
    [24, 46, 30], [36, 62, 38], [52, 80, 48], [74, 98, 60], [104, 120, 82], [140, 150, 112],
  ];
  const FAR_FADE = 0.55;           // how much fainter the far side of the mountain is
  const WASH_EVERY = 3;            // one speck in so many also laid in the wash under the grain, so the print reads as tone, not only as dots
  const WASH_A = 0.05;             // and how faint
  const HAND_REACH = 110;          // px
  const HAND_LIFT = 9;             // px a speck lifts under the hand, at most
  const HAND_LIGHT = 0.55;         // and how much lighter
  const TRAIL = [124, 66, 46];     // the pencil's red-brown
  const TRAIL_A = 0.62;
  const DASH = [5, 4];
  const DASH_SPEED = 7;            // px a second the dashes go along a trail
  const BLAZE_EVERY = 22;          // trail points between one blaze and the next
  const BLAZE_TALL = 11;           // px, the house's sign as a blaze
  const MARK_INK = [52, 58, 44];   // the labels' ink
  const MONO = "500 9.5px 'IBM Plex Mono', ui-monospace, monospace";

  // ---------- THE DATA ----------
  const n = DATA.n;
  const unpack = (b64) => { const s = atob(b64), out = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i); return out; };
  const H8 = unpack(DATA.heights), P8 = unpack(DATA.photo);
  const at = (grid, u, v) => {                // bilinear, u and v in cells
    const i = Math.max(0, Math.min(n - 1.001, u)), j = Math.max(0, Math.min(n - 1.001, v));
    const i0 = i | 0, j0 = j | 0, fx = i - i0, fy = j - j0, k = j0 * n + i0;
    return (grid[k] * (1 - fx) + grid[k + 1] * fx) * (1 - fy) + (grid[k + n] * (1 - fx) + grid[k + n + 1] * fx) * fy;
  };
  const [pi, pj] = DATA.summit;
  const toWorld = (u, v) => [((u - pi) / n) * 2, ((v - pj) / n) * 2];   // the summit at (0, 0), the square ±1
  const heightAt = (u, v) => (at(H8, u, v) / 255) * LIFT;

  let seed = 1925;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  // ---------- THE SPECKS ----------
  // Laid once: each a place on the photograph, chosen as often as the
  // photograph is dark there (granular, as a print's grain is), raised by
  // the heights; with the way its ground faces, its tone and its strength.
  let count = 0, X, Y, Z, NX, NY, NZ, TONE, BASE, SIZE;
  function lay(total) {
    seed = 1925;
    const weight = new Float32Array(n * n);
    let sum = 0;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const d = Math.hypot(i - pi, j - pj) / (n * REACH);
        const keep = 1 - smooth(0.72, 1, d);
        if (keep <= 0) continue;
        const k = j * n + i, land = H8[k] > 1;
        const dark = 1 - P8[k] / 255;
        const w = keep * (land ? 0.4 + Math.pow(dark, 1.3) * 1.3 : SEA);
        weight[k] = w; sum += w;
      }
    }
    const cum = new Float32Array(n * n);
    let run = 0;
    for (let k = 0; k < n * n; k++) { run += weight[k]; cum[k] = run; }
    count = total;
    X = new Float32Array(total); Y = new Float32Array(total); Z = new Float32Array(total);
    NX = new Float32Array(total); NY = new Float32Array(total); NZ = new Float32Array(total);
    TONE = new Uint8Array(total); BASE = new Float32Array(total); SIZE = new Float32Array(total);
    for (let s = 0; s < total; s++) {
      const r = random() * sum;
      let lo = 0, hi = n * n - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < r) lo = mid + 1; else hi = mid; }
      const u = (lo % n) + random(), v = Math.floor(lo / n) + random();
      const [x, z] = toWorld(u, v), y = heightAt(u, v);
      const e = 0.5, dx = (heightAt(u + e, v) - heightAt(u - e, v)) / ((2 * e / n) * 2), dz = (heightAt(u, v + e) - heightAt(u, v - e)) / ((2 * e / n) * 2);
      const nl = Math.hypot(dx, 1, dz);
      X[s] = x; Y[s] = y; Z[s] = z;
      NX[s] = -dx / nl; NY[s] = 1 / nl; NZ[s] = -dz / nl;
      const p = at(P8, u, v) / 255, land = y > 0.002;
      const tone = land ? Math.min(TONES.length - 1, Math.max(0, Math.round(p * (TONES.length - 1) * 1.15 - 0.3 + (random() - 0.5) * 0.9))) : TONES.length - 1;
      TONE[s] = tone;
      const d = Math.hypot(u - pi, v - pj) / (n * REACH);
      BASE[s] = (land ? 0.5 + 0.5 * Math.pow(1 - p, 1.1) : 0.22) * (1 - smooth(0.72, 1, d));
      SIZE[s] = land ? 1 + random() * 0.9 : 0.8 + random() * 0.5;
    }
  }

  // ---------- THE TRAILS ----------
  // On the ground, a hair above it; how far along each point is, for the
  // blazes; and the summit and a few spot heights to mark.
  const trails = DATA.trails.map((t) => t.map(([u, v]) => { const [x, z] = toWorld(u, v); return { x, z, y: heightAt(u, v) + 0.006, m: Math.round((at(H8, u, v) / 255) * DATA.top) }; }));
  const summit = { x: 0, z: 0, y: heightAt(pi, pj) + 0.012 };
  const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  // The house's sign, inked once in the pencil's colour, for the blazes.
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
    dirty = true;
  };
  logo.src = (window.SITE_ROOT || "../") + "images/Apoteker Tepe/Apoteker Tepe Logo.webp";

  // ---------- THE WINDOW ----------
  const trailCanvas = document.createElement("canvas");
  trailCanvas.className = "tepe-trails";
  trailCanvas.setAttribute("aria-hidden", "true");
  canvas.after(trailCanvas);
  // THE WASH: a picture a sixth the size, under the specks, stretched over
  // the window by the stylesheet (`.tepe-wash`) — drawing it enlarged into
  // the specks' own canvas every time cost a sixth of every frame.
  const wash = document.createElement("canvas");
  wash.className = "tepe-wash";
  wash.setAttribute("aria-hidden", "true");
  canvas.before(wash);
  const washInk = wash.getContext("2d");
  const pen = trailCanvas.getContext("2d");
  let W = 0, H = 0, ratio = 1, narrow = false, laidFor = 0;
  const sharp = window.Sharpness ? window.Sharpness(() => size()) : null;
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    narrow = W < NARROW_AT;
    ratio = sharp ? sharp.ratio : Math.min(window.devicePixelRatio || 1, 2);
    [canvas, trailCanvas].forEach((c) => { c.width = Math.round(W * ratio); c.height = Math.round(H * ratio); c.style.width = W + "px"; c.style.height = H + "px"; });
    const want = narrow ? SPECKS_NARROW : SPECKS_WIDE;
    if (want !== laidFor) { lay(want); laidFor = want; SX = new Float32Array(count); SY = new Float32Array(count); }
    dirty = true;
  }
  let SX = null, SY = null;

  // THE GRAIN of the print, made once and laid over the window by the
  // stylesheet (`.tepe-grain`), never drawn again.
  (function grain() {
    const c = document.createElement("canvas");
    c.width = c.height = 180;
    const g = c.getContext("2d"), img = g.createImageData(180, 180);
    for (let k = 0; k < img.data.length; k += 4) {
      const v = 128 + (random() + random() + random() - 1.5) * 70;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = v; img.data[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    const layer = document.createElement("div");
    layer.className = "tepe-grain";
    layer.setAttribute("aria-hidden", "true");
    layer.style.backgroundImage = "url(" + c.toDataURL("image/png") + ")";
    document.body.insertBefore(layer, trailCanvas.nextSibling);
  })();

  // ---------- THE TURN AND THE HAND ----------
  const turnFor = () => {
    const room = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return TURN_FROM + TURN * Math.max(0, Math.min(1, window.scrollY / room));
  };
  let turn = turnFor(), drawnTurn = NaN, drawnScroll = NaN;
  let handX = -1e5, handY = -1e5, hand = 0, drawnHand = -1;
  const pointer = (e) => { if (e.pointerType === "touch") return; handX = e.clientX; handY = e.clientY; };
  window.addEventListener("pointermove", pointer, { passive: true });
  document.addEventListener("pointerleave", () => { handX = handY = -1e5; });
  let dirty = true;
  window.addEventListener("resize", size);

  // Where the mountain stands on the window.
  const frameOf = () => {
    const S = Math.min(W * (narrow ? 0.56 : 0.47), H * (narrow ? 0.52 : 0.68));
    return { S, cx: W / 2, cy: H * (narrow ? 0.6 : 0.62) };
  };

  // ---------- THE SPECKS, DRAWN ----------
  // Into the picture's own pixels (an ImageData), every speck a small
  // square laid over what is there — tens of thousands of fillRects took a
  // tenth of a second a frame — and then put down at once; THE WASH under
  // them is the same specks a few at a time in a picture a sixth the size,
  // laid down enlarged, so the print reads as soft tone and not only as
  // dots. Then the quiet behind the words, over the mountain's own box only
  // (`Writing.hush`).
  const ZC = 6;                                   // px, the squares the mountain's nearness is kept in
  let zb = null, zbCols = 0, zbRows = 0;
  let pix = null, pix32 = null, PW = 0, PH = 0;
  let wpix = null, wpix32 = null, WW = 0, WH = 0;
  const WASH_STEP = 6;                            // css px to a pixel of the wash
  const RGB = TONES.map(([r, g, b]) => [r, g, b]);
  function buffers() {
    PW = canvas.width; PH = canvas.height;
    pix = ink.createImageData(PW, PH); pix32 = new Uint32Array(pix.data.buffer);
    WW = Math.ceil(W / WASH_STEP); WH = Math.ceil(H / WASH_STEP);
    wash.width = WW; wash.height = WH;
    wash.style.width = WW * WASH_STEP + "px"; wash.style.height = WH * WASH_STEP + "px";
    wpix = washInk.createImageData(WW, WH); wpix32 = new Uint32Array(wpix.data.buffer);
  }
  /** A speck laid OVER what is there (both of them unpremultiplied). */
  function lay32(buf, w, h, x0, y0, sz, rgb, a) {
    const x1 = Math.min(w, x0 + sz), y1 = Math.min(h, y0 + sz);
    if (x0 < 0) x0 = 0;
    if (y0 < 0) y0 = 0;
    for (let y = y0; y < y1; y++) {
      let i = y * w + x0;
      for (let x = x0; x < x1; x++, i++) {
        const d = buf[i], da = (d >>> 24) / 255;
        if (da === 0) { buf[i] = ((a * 255) << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]; continue; }
        const oa = a + da * (1 - a), k = da * (1 - a);
        const r = (rgb[0] * a + (d & 255) * k) / oa, g = (rgb[1] * a + ((d >>> 8) & 255) * k) / oa, b = (rgb[2] * a + ((d >>> 16) & 255) * k) / oa;
        buf[i] = ((oa * 255) << 24) | (b << 16) | (g << 8) | r;
      }
    }
  }
  let box = null;                                 // the mountain's box on the window, as last drawn
  function drawSpecks() {
    const { S, cx, cy } = frameOf();
    if (!pix || PW !== canvas.width || PH !== canvas.height) buffers();
    const c = Math.cos(turn), s = Math.sin(turn), cp = Math.cos(PITCH), sp = Math.sin(PITCH);
    zbCols = Math.ceil(W / ZC) + 1; zbRows = Math.ceil(H / ZC) + 1;
    if (!zb || zb.length !== zbCols * zbRows) zb = new Float32Array(zbCols * zbRows);
    zb.fill(1e9);
    pix32.fill(0); wpix32.fill(0);
    const R2 = HAND_REACH * HAND_REACH, handing = hand > 0.01 && !REDUCE, r = ratio, grow = narrow ? 1.15 : 1;
    let l = 1e9, t = 1e9, rr = -1e9, b = -1e9;
    for (let k = 0; k < count; k++) {
      const xr = X[k] * c - Z[k] * s, zr = X[k] * s + Z[k] * c;
      const y2 = Y[k] * cp + zr * sp, z2 = -Y[k] * sp + zr * cp;
      const f = EYE / (EYE + z2);
      const sx = cx + xr * S * f;
      let sy = cy - y2 * S * f;
      // How it faces the eye (its ground's way), and how far back it is.
      const nzr = NX[k] * s + NZ[k] * c, nz2 = -NY[k] * sp + nzr * cp;
      const facing = Math.max(0.12, Math.min(1, 0.3 - nz2 * 1.5));
      let a = BASE[k] * facing * (1 - FAR_FADE * Math.max(0, Math.min(1, (z2 + 0.6) / 1.8)));
      let tone = TONE[k];
      if (handing) {
        const dx = sx - handX, dy = sy - handY, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const g = 1 - Math.sqrt(d2) / HAND_REACH, w = g * g * hand;
          sy -= HAND_LIFT * w;
          tone = Math.min(TONES.length - 1, tone + Math.round(w * HAND_LIGHT * 4));
          a *= 1 + 0.35 * w;
        }
      }
      if (sx < -4 || sy < -4 || sx > W + 4 || sy > H + 4 || a < 0.02) { SX[k] = -1e5; continue; }
      SX[k] = sx; SY[k] = sy;
      if (sx < l) l = sx; if (sx > rr) rr = sx; if (sy < t) t = sy; if (sy > b) b = sy;
      const cell = ((sy / ZC) | 0) * zbCols + ((sx / ZC) | 0);
      if (Y[k] > 0.002 && z2 < zb[cell]) zb[cell] = z2;
      if (a > 1) a = 1;
      // Its square, in the picture's own pixels: as many whole pixels as
      // its size, the rest of its size given as strength.
      const want = SIZE[k] * (0.7 + 0.45 * f) * grow * r, side = Math.max(1, Math.round(want));
      const aa = Math.min(1, a * (want * want) / (side * side));
      const px = Math.round(sx * r - side / 2), py = Math.round(sy * r - side / 2), rgb = RGB[tone];
      if (side === 1) {
        // (The commonest: one pixel, laid over what is there, here.)
        if (px >= 0 && py >= 0 && px < PW && py < PH) {
          const i = py * PW + px, d = pix32[i], da = (d >>> 24) / 255;
          if (da === 0) pix32[i] = ((aa * 255) << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0];
          else {
            const oa = aa + da * (1 - aa), q = da * (1 - aa);
            pix32[i] = ((oa * 255) << 24) | (((rgb[2] * aa + ((d >>> 16) & 255) * q) / oa) << 16) | (((rgb[1] * aa + ((d >>> 8) & 255) * q) / oa) << 8) | ((rgb[0] * aa + (d & 255) * q) / oa);
          }
        }
      } else lay32(pix32, PW, PH, px, py, side, rgb, aa);
      if (k % WASH_EVERY === 0) lay32(wpix32, WW, WH, (sx / WASH_STEP) | 0, (sy / WASH_STEP) | 0, 1, RGB[tone], Math.min(1, a * WASH_A * 6));
    }
    box = rr > l ? { l: l - 8, t: t - 8, r: rr + 8, b: b + 8 } : null;
    // The specks put straight onto the canvas (it is replaced, nothing to
    // clear), and the wash into its own.
    ink.putImageData(pix, 0, 0);
    washInk.putImageData(wpix, 0, 0);
    // THE QUIET behind the words: only over the mountain's own box, in both.
    ink.setTransform(r, 0, 0, r, 0, 0);
    washInk.setTransform(1 / WASH_STEP, 0, 0, 1 / WASH_STEP, 0, 0);
    if (window.Writing && box) {
      window.Writing.hush(ink, { regions: [box], keep: KEEP });
      window.Writing.hush(washInk, { regions: [box], keep: KEEP });
    }
    washInk.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ---------- THE TRAILS, DRAWN ----------
  function project(p, frame, c, s, cp, sp) {
    const xr = p.x * c - p.z * s, zr = p.x * s + p.z * c;
    const y2 = p.y * cp + zr * sp, z2 = -p.y * sp + zr * cp;
    const f = EYE / (EYE + z2);
    return { x: frame.cx + xr * frame.S * f, y: frame.cy - y2 * frame.S * f, z: z2 };
  }
  /** Whether the mountain stands in front of a point on the window. */
  function hidden(q) {
    if (!zb) return false;
    const i = (q.x / ZC) | 0, j = (q.y / ZC) | 0;
    let near = 1e9;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
      const ii = i + di, jj = j + dj;
      if (ii < 0 || jj < 0 || ii >= zbCols || jj >= zbRows) continue;
      near = Math.min(near, zb[jj * zbCols + ii]);
    }
    return near < q.z - 0.045;
  }
  let nearest = -1;
  function drawTrails(t) {
    const frame = frameOf();
    const c = Math.cos(turn), s = Math.sin(turn), cp = Math.cos(PITCH), sp = Math.sin(PITCH);
    pen.setTransform(ratio, 0, 0, ratio, 0, 0);
    pen.clearRect(0, 0, W, H);
    const Wr = window.Writing, color = "rgb(" + TRAIL.join(",") + ")";
    pen.lineWidth = narrow ? 1.1 : 1.2;
    pen.lineCap = "round";
    pen.setLineDash(DASH);
    pen.lineDashOffset = REDUCE ? 0 : -t * DASH_SPEED;
    pen.strokeStyle = color;
    let best = 1e9, bestK = -1;
    const marks = [];
    trails.forEach((trail, ti) => {
      const pts = trail.map((p) => project(p, frame, c, s, cp, sp));
      // In three strengths: clear, behind the words, and the nearest the hand.
      const runs = [[], [], []];
      for (let k = 1; k < pts.length; k++) {
        const a = pts[k - 1], b = pts[k];
        if (hidden(a) || hidden(b)) continue;
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const under = Wr ? Wr.at(mx, my) : 0;
        if (handX > -1e4) { const d = Math.hypot(mx - handX, my - handY); if (d < best) { best = d; bestK = ti; } }
        runs[ti === nearest ? 2 : under > 0.5 ? 1 : 0].push(a, b);
      }
      [[runs[0], TRAIL_A], [runs[1], TRAIL_A * KEEP * 1.2], [runs[2], Math.min(1, TRAIL_A * 1.45)]].forEach(([list, alpha]) => {
        if (!list.length) return;
        pen.globalAlpha = alpha;
        pen.beginPath();
        for (let q = 0; q < list.length; q += 2) { pen.moveTo(list[q].x, list[q].y); pen.lineTo(list[q + 1].x, list[q + 1].y); }
        pen.stroke();
      });
      // Its number at its foot, and the house's sign blazed along it.
      const foot = pts[0];
      if (!hidden(foot)) marks.push({ kind: "no", x: foot.x, y: foot.y, say: ROMAN[ti] || String(ti + 1) });
      for (let k = BLAZE_EVERY; k < pts.length - 4; k += BLAZE_EVERY) {
        if (!hidden(pts[k])) marks.push({ kind: "blaze", x: pts[k].x, y: pts[k].y, z: pts[k].z });
        if (k === BLAZE_EVERY * 2 && !hidden(pts[k])) marks.push({ kind: "spot", x: pts[k].x, y: pts[k].y, say: trail[k].m.toLocaleString("en-GB") + " m" });
      }
    });
    nearest = best < 80 ? bestK : -1;
    pen.setLineDash([]);
    // THE MARKS — a label as quiet as the most writing anywhere along it.
    const along = (x, y, w) => { if (!Wr) return 1; let q = 1; for (let k = 0; k <= 4; k++) q = Math.min(q, Wr.under(x + (w * k) / 4, y, KEEP)); return q; };
    pen.font = MONO;
    pen.textBaseline = "middle";
    for (const m of marks) {
      const q = Wr ? Wr.under(m.x, m.y, KEEP) : 1;
      if (m.kind === "blaze") {
        if (!blaze) continue;
        const h = BLAZE_TALL * (0.75 + 0.3 * (EYE / (EYE + m.z))), w = (blaze.width / blaze.height) * h;
        pen.globalAlpha = 0.72 * q;
        pen.drawImage(blaze, m.x - w / 2, m.y - h - 2, w, h);
      } else if (m.kind === "no") {
        pen.globalAlpha = 0.8 * q;
        pen.strokeStyle = color;
        pen.lineWidth = 1;
        pen.beginPath(); pen.arc(m.x, m.y, 7.5, 0, Math.PI * 2); pen.stroke();
        pen.fillStyle = color;
        pen.textAlign = "center";
        pen.fillText(m.say, m.x, m.y + 0.5);
      } else if (m.kind === "spot") {
        pen.globalAlpha = 0.66 * Math.min(q, along(m.x + 4, m.y - 1, 70));
        pen.fillStyle = "rgb(" + MARK_INK.join(",") + ")";
        pen.textAlign = "left";
        pen.fillText("× " + m.say, m.x + 4, m.y - 1);
      }
    }
    // The summit: its height, as surveyed, and where it stands.
    const top = project(summit, frame, c, s, cp, sp);
    if (!hidden(top)) {
      const q = Math.min(along(top.x, top.y - 10, 130), along(top.x, top.y + 2, 130));
      pen.globalAlpha = 0.85 * q;
      pen.fillStyle = color;
      pen.beginPath(); pen.moveTo(top.x, top.y - 9); pen.lineTo(top.x - 5, top.y - 1); pen.lineTo(top.x + 5, top.y - 1); pen.closePath(); pen.fill();
      pen.fillStyle = "rgb(" + MARK_INK.join(",") + ")";
      pen.textAlign = "left";
      pen.globalAlpha = 0.72 * q;
      pen.fillText("ATHOS  2,033 m", top.x + 10, top.y - 10);
      pen.globalAlpha = 0.5 * q;
      pen.fillText("40°09′ N  24°19′ E", top.x + 10, top.y + 2);
    }
    pen.globalAlpha = 1;
  }

  // ---------- KEEPING UP ----------
  size();
  let last = performance.now();
  function frame(now) {
    if (sharp) sharp.frame(now);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const want = turnFor();
    turn = REDUCE ? want : turn + (want - turn) * (1 - Math.exp(-dt / TURN_EASE));
    const handWant = handX > -1e4 ? 1 : 0;
    hand += (handWant - hand) * (REDUCE ? 1 : 1 - Math.exp(-dt / 0.18));
    // The specks again only when something has moved.
    const handKey = hand > 0.01 ? Math.round(handX) * 4096 + Math.round(handY) + Math.round(hand * 50) * 1e8 : 0;
    if (dirty || Math.abs(turn - drawnTurn) > 0.0004 || window.scrollY !== drawnScroll || handKey !== drawnHand) {
      drawSpecks();
      drawnTurn = turn; drawnScroll = window.scrollY; drawnHand = handKey; dirty = false;
    }
    drawTrails(now / 1000);
  }
  // FOR THE TESTS: how far it is turned, how many specks it is drawn in,
  // how many of them stand behind words and how faint, and the trails.
  window.TepeMountain = {
    turn: () => turn,
    // How long the specks take to draw again, in ms (the mean of `times`).
    time: (times = 10) => { const t0 = performance.now(); for (let i = 0; i < times; i++) { turn += 0.001; drawSpecks(); } return (performance.now() - t0) / times; },
    specks: () => count,
    trails: () => trails.length,
    blazes: () => !!blaze,
    behind: () => {
      const Wr = window.Writing;
      if (!Wr || !SX) return { behind: 0, keep: KEEP };
      let behind = 0;
      for (let k = 0; k < count; k += 7) if (SX[k] > -1e4 && Wr.at(SX[k], SY[k]) > 0.9) behind++;
      return { behind, keep: KEEP };
    },
  };
  if (REDUCE) {
    frame(performance.now());
    window.addEventListener("scroll", () => frame(performance.now()), { passive: true });
    window.addEventListener("resize", () => frame(performance.now()));
  } else {
    (function tick(now) { frame(now); requestAnimationFrame(tick); })(performance.now());
  }
})();

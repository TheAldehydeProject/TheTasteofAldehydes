// ============================================================
// APOTEKER TEPE — houses/apoteker-tepe.html
//
// The thirteenth house, and its ground since 2026-10-27: A MOUNTAIN,
// PHOTOGRAPHED, BEHIND FROSTED GLASS — A TRIAL. The owner, with the
// Musica 2011 poster (a horse behind frosted glass, seen sharp through a
// clear rectangle in it): "For apoteker tepe, remove the mointain as it is currently,
// and i want you to replace it with one of the files from AT MOINTAIN 1-5.
// I want you to replace it with all pf ghe, and then let me see how its
// goimg yo look with each of them do this with a top right setting which
// allows you to switch between the pictures. Add optional filters too so
// that i can have fun with it before settling kn a final version. The
// mountain should be blurred out, except for a mask on the right-ish middle
// of yhe screen, inspired by the image provided in this message."
//
//   THE FROST     the owner's photograph (images/Apoteker Tepe/AT MOUNTAIN
//                 n.webp) laid over the whole window, blurred out and
//                 misted towards the house's paper — glass the mountain
//                 stands behind.
//   THE WINDOW    on the right-ish middle, A SHARP UPRIGHT RECTANGLE of
//                 clear glass, 2 : 3 (since later the same day — "I want the
//                 mask to be a sharp rctangle, as it was with the horse
//                 picture"; it was an irregular shape, sharp at its heart and
//                 soft round it, for its first round): the mountain sharp and
//                 clear inside it and frosted from its very edge, cut on whole
//                 pixels of the screen. Each picture is placed so its peak
//                 stands in it (`focus`). The Edge slider softens it, for a
//                 look; at 0, where it starts, it is cut clean.
//   THE TRIAL     the boxed button at the top right — "Mountain 1 / 5" —
//                 opens THE PANEL: the five pictures, the blur, the mist, the
//                 window's size and its edge, a colour (natural, black and
//                 white, sepia, duotone, frost, warm) and filters (faded,
//                 contrast, vignette, grain, posterise, negative). Kept in
//                 the address (`?mountain=3&colour=sepia&fx=grain`), and in
//                 the browser for the next visit, until the owner settles on
//                 one; then the rest comes out.
//
// IT IS DRAWN ONCE, not every frame: on one canvas fixed to the window,
// made again only when something in the panel changes or the window's width
// does — the page scrolls over a still picture and costs nothing to read.
// A slider being dragged draws it at half the pixels and the whole on
// letting go. Blurring is done on small copies, made smooth again as they
// are laid down large — never a filter over the whole window.
//
// WITHOUT THIS SCRIPT the page is its writing on the house's aged paper.
// Nothing in it moves, so there is nothing for reduced motion to still.
// ============================================================
(function () {
  const canvas = document.querySelector(".tepe-photo");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
  if (!ink) return;
  const root = document.documentElement;
  const SITE = typeof window.SITE_ROOT === "string" ? window.SITE_ROOT : "";

  // ============================================================
  // THE PICTURES — the owner's five, each with where its peak is (as a share
  // of the picture across and down) and how much nearer it is drawn, so the
  // peak can be stood in the window.
  // ============================================================
  const PICTURES = [
    { file: "AT MOUNTAIN 1.webp", focus: [0.8, 0.56], zoom: 1.15 },
    { file: "AT MOUNTAIN 2.webp", focus: [0.84, 0.57], zoom: 1.15 },
    { file: "AT MOUNTAIN 3.webp", focus: [0.5, 0.3], zoom: 1.38 },
    { file: "AT MOUNTAIN 4.webp", focus: [0.5, 0.46], zoom: 1.12 },
    { file: "AT MOUNTAIN 5.webp", focus: [0.8, 0.4], zoom: 1.2 },
  ];
  const FOLDER = SITE + "images/Apoteker%20Tepe/";
  const srcOf = (n) => FOLDER + encodeURIComponent(PICTURES[n - 1].file);
  const thumbOf = (n) => FOLDER + "mountain-thumbs/at-mountain-" + n + ".webp";

  // ============================================================
  // TUNING
  // ============================================================
  const PAPER = [236, 229, 210];        // the house's paper (--bg), what the frost mists towards
  const CLEAR_AT = [0.775, 0.5];        // the window's middle on a wide window, as a share of it
  const CLEAR_AT_NARROW = [0.68, 0.5];  // and on a phone
  const TALL = 1.5;                     // the window's height to its width: upright, 2 : 3, as the poster's is
  const PHONE_ZOOM = 1.15;              // on a phone a picture is brought no nearer than this
  const GLASS = 0.9;                    // how much of the mist the window clears at its heart
  const MOST_PIXELS = 3.6e6;            // device pixels the picture is drawn in at most
  const LIGHT_BLUR = 0.18;              // with a soft edge, the ring round the window: this share of the frost's blur
  const EDGE_MOST = 0.45;               // the softest edge, Edge at 100: this share of the window's narrower side
  const COLOURS = ["natural", "bw", "sepia", "duotone", "frost", "warm"];
  const COLOUR_NAMES = { natural: "Natural", bw: "Black & white", sepia: "Sepia", duotone: "Duotone", frost: "Frost", warm: "Warm" };
  const FX = ["faded", "contrast", "vignette", "grain", "posterise", "negative"];
  const FX_NAMES = { faded: "Faded", contrast: "Contrast", vignette: "Vignette", grain: "Grain", posterise: "Posterise", negative: "Negative" };
  // THE FROST colour's mist (the poster's pale grey-green) and the warm one's.
  const MIST_OF = { frost: [214, 224, 220], warm: [241, 228, 204] };
  const GREEN = [46, 76, 46];           // the house's green (--tepe-green), the duotone's dark
  const DEFAULTS = { mountain: 1, blur: 70, mist: 68, window: 50, edge: 0, colour: "natural", fx: [] };
  const STORE = "tepe-mountain-trial";

  // ============================================================
  // THE STATE — the address first, then what this browser kept, then the
  // defaults.
  // ============================================================
  const clampInt = (v, lo, hi, d) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : d; };
  function read(from) {
    const get = (k) => (from instanceof URLSearchParams ? from.get(k) : from[k]);
    const fx = get("fx");
    const list = Array.isArray(fx) ? fx : typeof fx === "string" && fx ? fx.split(",") : [];
    const colour = get("colour");
    return {
      mountain: clampInt(get("mountain"), 1, PICTURES.length, DEFAULTS.mountain),
      blur: clampInt(get("blur"), 0, 100, DEFAULTS.blur),
      mist: clampInt(get("mist"), 0, 100, DEFAULTS.mist),
      window: clampInt(get("window"), 0, 100, DEFAULTS.window),
      edge: clampInt(get("edge"), 0, 100, DEFAULTS.edge),
      colour: COLOURS.includes(colour) ? colour : DEFAULTS.colour,
      fx: FX.filter((f) => list.includes(f)),
    };
  }
  const here = new URLSearchParams(location.search);
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { stored = null; }
  const asked = ["mountain", "blur", "mist", "window", "edge", "colour", "fx"].some((k) => here.has(k));
  const state = read(asked ? here : stored || {});

  function keep() {
    const p = new URLSearchParams(location.search);
    ["mountain", "blur", "mist", "window", "edge", "colour", "fx"].forEach((k) => p.delete(k));
    for (const k of ["mountain", "blur", "mist", "window", "edge", "colour"]) if (state[k] !== DEFAULTS[k]) p.set(k, state[k]);
    if (state.fx.length) p.set("fx", state.fx.join(","));
    const q = p.toString().replace(/%2C/g, ",");
    try { history.replaceState(history.state, "", location.pathname + (q ? "?" + q : "") + location.hash); } catch (e) { /* (a file:// page) */ }
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* (storage off) */ }
  }

  // ============================================================
  // SMALL TOOLS
  // ============================================================
  const make = (w, h) => { const c = document.createElement("canvas"); c.width = Math.max(1, w); c.height = Math.max(1, h); return c; };
  const ctxOf = (c) => c.getContext("2d", { willReadFrequently: true });
  // A copy of `src` made `w` by `h`, halved a step at a time so nothing in
  // it is lost to the step (a picture made a sixteenth at once flickers).
  function shrink(src, w, h) {
    let cur = src, cw = src.width, ch = src.height;
    while (cw / 2 > w * 1.1 && ch / 2 > h * 1.1) {
      const n = make(Math.round(cw / 2), Math.round(ch / 2)), g = n.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(cur, 0, 0, n.width, n.height);
      cur = n; cw = n.width; ch = n.height;
    }
    const out = make(w, h), g = out.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(cur, 0, 0, w, h);
    return out;
  }
  // Three box blurs one after the other: near enough a gaussian, on a small
  // picture (every channel, or the alpha alone for a mask).
  function boxBlur(c, r, alphaOnly) {
    if (r < 1) return;
    const g = ctxOf(c), w = c.width, h = c.height, img = g.getImageData(0, 0, w, h), d = img.data;
    const chans = alphaOnly ? [3] : [0, 1, 2];
    const tmp = new Float32Array(Math.max(w, h));
    const line = new Float32Array(Math.max(w, h));
    for (let pass = 0; pass < 3; pass++) {
      for (const ch of chans) {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) line[x] = d[(y * w + x) * 4 + ch];
          boxLine(line, tmp, w, r);
          for (let x = 0; x < w; x++) d[(y * w + x) * 4 + ch] = tmp[x];
        }
        for (let x = 0; x < w; x++) {
          for (let y = 0; y < h; y++) line[y] = d[(y * w + x) * 4 + ch];
          boxLine(line, tmp, h, r);
          for (let y = 0; y < h; y++) d[(y * w + x) * 4 + ch] = tmp[y];
        }
      }
    }
    g.putImageData(img, 0, 0);
  }
  function boxLine(src, out, n, r) {
    const k = 1 / (2 * r + 1);
    let sum = 0;
    for (let i = -r; i <= r; i++) sum += src[Math.min(n - 1, Math.max(0, i))];
    for (let i = 0; i < n; i++) {
      out[i] = sum * k;
      sum += src[Math.min(n - 1, i + r + 1)] - src[Math.max(0, i - r)];
    }
  }
  // `src` blurred by about `radius` of its own pixels: made small enough
  // that the blur is three of its pixels, blurred there, and laid down large
  // again — the laying down itself smooth.
  function blurred(src, radius) {
    const w = src.width, h = src.height;
    if (radius < 1.5) return src;
    const step = Math.max(1, radius / 3);
    const small = shrink(src, Math.max(8, Math.round(w / step)), Math.max(8, Math.round(h / step)));
    boxBlur(small, 2);
    const out = make(w, h), g = out.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(small, 0, 0, w, h);
    return out;
  }
  // A seeded random, so a picture's window and grain are the same every time.
  function seeded(seed) {
    let s = seed >>> 0 || 1;
    return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }

  // ============================================================
  // THE WINDOW — a sharp upright rectangle on the right-ish middle, as the
  // poster's is: the glass clear inside it, frosted from its very edge. The
  // Edge slider can soften it, for a look; at 0 it is cut clean, on whole
  // pixels of the screen.
  // ============================================================
  function windowRect(W, H) {
    const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT;
    const base = W < 700 ? W * 1.6 : Math.min(W, H * 1.6);
    let w = base * (0.12 + 0.2 * state.window / 100), h = w * TALL;
    if (h > H * 0.86) { h = H * 0.86; w = h / TALL; }
    return { x: W * at[0] - w / 2, y: H * at[1] - h / 2, w, h };
  }
  const softOf = (r) => (state.edge / 100) * EDGE_MOST * Math.min(r.w, r.h);
  const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  // How clear the glass is along one line of `n` pixels, starting at `from`
  // (css px) a `step` at a time: 1 between `a` and `b`, 0 outside, eased
  // across each edge over `soft` (none, when it is 0). The window is a
  // rectangle, so across and down are worked out apart and multiplied.
  function along(n, from, step, a, b, soft) {
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = from + (i + 0.5) * step;
      out[i] = soft > 0 ? ease((v - a) / soft + 0.5) * ease((b - v) / soft + 0.5) : v >= a && v < b ? 1 : 0;
    }
    return out;
  }

  // ============================================================
  // DRAWING IT — once, into the canvas fixed to the window.
  // ============================================================
  const pictures = new Map();          // n -> a promise of its image
  function picture(n) {
    if (!pictures.has(n)) {
      pictures.set(n, new Promise((done, fail) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => done(img));
        img.onerror = () => fail(new Error("no picture " + n));
        img.src = srcOf(n);
      }));
    }
    return pictures.get(n);
  }
  // Its height: the tallest the window has been at this width, so a phone's
  // bar coming and going does not draw it again (it is laid at the top).
  let tallest = 0, drawnWidth = 0, drawnAt = 0, drawing = null, again = false;
  let shown = null;                    // where the window was last drawn, css px (for the tests)
  function size() {
    const W = Math.max(1, document.documentElement.clientWidth || innerWidth);
    if (W !== drawnWidth) tallest = 0;
    tallest = Math.max(tallest, innerHeight);
    return [W, tallest];
  }
  // THE GRAIN, a square of noise laid over the whole of it (overlay).
  let grainTile = null;
  function grain() {
    if (grainTile) return grainTile;
    grainTile = make(192, 192);
    const g = ctxOf(grainTile), img = g.createImageData(192, 192), rnd = seeded(7919);
    for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (rnd() - 0.5) * 150; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
    return grainTile;
  }

  // THE FROST IS DRAWN SMALL (a quarter of the pixels each way — it is
  // blurred, so nothing is lost) and laid down large; only THE WINDOW'S
  // HEART is drawn at the whole of the window's sharpness, in its own box.
  const SMALL = 4;
  async function draw(draft) {
    if (drawing) { again = !draft || again === "full" ? "full" : "draft"; return drawing; }
    drawing = (async () => {
      const n = state.mountain;
      let img;
      try { img = await picture(n); } catch (e) { root.classList.remove("tepe-photo-drawn"); return; }
      if (n !== state.mountain) return;
      const t0 = performance.now();
      const [W, H] = size();
      const dpr = window.devicePixelRatio || 1;
      let ratio = Math.min(dpr, W < 700 ? 1.5 : 2);
      if (W * H * ratio * ratio > MOST_PIXELS) ratio = Math.sqrt(MOST_PIXELS / (W * H));
      if (draft) ratio *= 0.5;
      const cw = Math.round(W * ratio), ch = Math.round(H * ratio);
      // THE PICTURE, laid over the window with its peak in the window (in css px).
      const P = PICTURES[n - 1];
      const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT;
      // (on a phone the picture already stands far nearer, laid over a tall
      // window by its height, so it is brought only a little nearer — enough
      // to move its peak up or down into the window)
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * (W < 700 ? Math.min(P.zoom, PHONE_ZOOM) : P.zoom);
      const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      const ox = Math.min(0, Math.max(W - iw, W * at[0] - P.focus[0] * iw));
      const oy = Math.min(0, Math.max(H - ih, H * at[1] - P.focus[1] * ih));
      // THE WINDOW, and how soft its edge is (css px; 0, cut clean).
      const r = windowRect(W, H), soft = softOf(r);
      // THE FROST, small: the picture, blurred out — with a soft edge, a ring
      // a little less blurred round the window — coloured and misted.
      const lr = ratio / SMALL, lw = Math.max(16, Math.round(W * lr)), lh = Math.max(16, Math.round(H * lr));
      const small = make(lw, lh), smg = small.getContext("2d");
      smg.imageSmoothingQuality = "high";
      smg.drawImage(img, ox * lr, oy * lr, iw * lr, ih * lr);
      const R = 8 + state.blur * 1.0;                        // css px
      const low = make(lw, lh), lg = ctxOf(low);
      lg.drawImage(blurred(small, R * lr), 0, 0);
      const light = soft > 0 ? ctxOf(blurred(small, Math.max(1.6, R * LIGHT_BLUR * lr))).getImageData(0, 0, lw, lh).data : null;
      finish(lg, lw, lh, { x: 0, y: 0, sx: W / lw, sy: H / lh, r, soft, light });
      // (drawn straight into the page's own canvas: all of it at once, before
      // the next frame, so nothing half drawn is ever seen)
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      canvas.style.height = H + "px";
      const og = ink;
      og.globalCompositeOperation = "source-over";
      og.globalAlpha = 1;
      og.imageSmoothingQuality = "high";
      og.drawImage(low, 0, 0, cw, ch);
      // THE WINDOW ITSELF, sharp, in its own box — the rectangle on whole
      // pixels of the screen, and with a soft edge as far out as it goes.
      const pad = soft > 0 ? soft / 2 + 2 : 0;
      const x0 = Math.max(0, Math.round((r.x - pad) * ratio)), y0 = Math.max(0, Math.round((r.y - pad) * ratio));
      const x1 = Math.min(cw, Math.round((r.x + r.w + pad) * ratio)), y1 = Math.min(ch, Math.round((r.y + r.h + pad) * ratio));
      const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
      const heart = make(bw, bh), hg = ctxOf(heart);
      hg.imageSmoothingQuality = "high";
      hg.drawImage(img, ox * ratio - x0, oy * ratio - y0, iw * ratio, ih * ratio);
      finish(hg, bw, bh, { x: x0 / ratio, y: y0 / ratio, sx: 1 / ratio, sy: 1 / ratio, r, soft, heart: true });
      og.drawImage(heart, x0, y0);
      shown = { x: x0 / ratio, y: y0 / ratio, w: bw / ratio, h: bh / ratio, soft };
      // THE VIGNETTE and THE GRAIN, laid over the whole.
      const fx = new Set(state.fx);
      if (fx.has("vignette")) {
        const v = og.createRadialGradient(cw / 2, ch / 2, Math.hypot(cw, ch) * 0.22, cw / 2, ch / 2, Math.hypot(cw, ch) * 0.52);
        v.addColorStop(0, "rgba(24, 22, 14, 0)");
        v.addColorStop(1, "rgba(24, 22, 14, 0.42)");
        og.fillStyle = v;
        og.fillRect(0, 0, cw, ch);
      }
      if (fx.has("grain")) {
        og.globalCompositeOperation = "overlay";
        og.globalAlpha = 0.34;
        og.fillStyle = og.createPattern(grain(), "repeat");
        og.fillRect(0, 0, cw, ch);
        og.globalCompositeOperation = "source-over";
        og.globalAlpha = 1;
      }
      drawnWidth = W; drawnAt = performance.now() - t0;
      root.classList.add("tepe-photo-drawn");
      canvas.dataset.mountain = n;
      canvas.dataset.draft = draft ? "yes" : "no";
    })();
    try { await drawing; } finally {
      drawing = null;
      if (again) { const d = again === "draft"; again = false; draw(d); }
    }
  }
  // THE COLOUR, THE FILTERS AND THE MIST, a pixel at a time, over a piece of
  // the window `w` by `h` pixels whose first stands at (`x`, `y`) css px, a
  // pixel `sx` by `sy` css px. The mist is cleared in the window; drawing
  // the window itself (`heart`), what is outside it is left out, to see the
  // frost through; a `light` copy is the ring round a soft window.
  function finish(g, w, h, o) {
    const img = g.getImageData(0, 0, w, h), d = img.data;
    const { r: win, soft, light, heart } = o;
    const inX = along(w, o.x, o.sx, win.x, win.x + win.w, soft), inY = along(h, o.y, o.sy, win.y, win.y + win.h, soft);
    const ringX = light ? along(w, o.x, o.sx, win.x - soft * 0.8, win.x + win.w + soft * 0.8, soft * 1.6) : null;
    const ringY = light ? along(h, o.y, o.sy, win.y - soft * 0.8, win.y + win.h + soft * 0.8, soft * 1.6) : null;
    // Cut clean, the window is all window and the frost all frost: misted
    // right up to the edge, so nothing clear is smeared out past it as the
    // small frost is laid down large.
    const clean = !(soft > 0);
    const c = state.colour, fx = new Set(state.fx);
    const mist = MIST_OF[c] || PAPER;
    const most = (state.mist / 100) * 0.94;
    const faded = fx.has("faded"), contrast = fx.has("contrast"), poster = fx.has("posterise"), negative = fx.has("negative");
    const q = 255 / 4;
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const px = p % w, py = (p - px) / w;
      const inner = clean ? (heart ? 1 : 0) : inX[px] * inY[py];
      const ring = light ? ringX[px] * ringY[py] : 0;
      let r = d[i], gr = d[i + 1], b = d[i + 2];
      if (ring > 0) { r += (light[i] - r) * ring; gr += (light[i + 1] - gr) * ring; b += (light[i + 2] - b) * ring; }
      const L = 0.2126 * r + 0.7152 * gr + 0.0722 * b;
      // the photograph's colour
      if (c === "bw") { r = gr = b = L; }
      else if (c === "sepia") { const R0 = r, G0 = gr, B0 = b; r = 0.393 * R0 + 0.769 * G0 + 0.189 * B0; gr = 0.349 * R0 + 0.686 * G0 + 0.168 * B0; b = 0.272 * R0 + 0.534 * G0 + 0.131 * B0; }
      else if (c === "duotone") { const t = L / 255; r = GREEN[0] + (PAPER[0] - GREEN[0]) * t; gr = GREEN[1] + (PAPER[1] - GREEN[1]) * t; b = GREEN[2] + (PAPER[2] - GREEN[2]) * t; }
      else if (c === "frost") { r = L + (r - L) * 0.45 - 4; gr = L + (gr - L) * 0.45 + 3; b = L + (b - L) * 0.45 + 4; }
      else if (c === "warm") { r = r * 1.08 + 10; gr = gr * 1.0 + 4; b = b * 0.86; }
      if (faded) { r = 34 + r * 0.8; gr = 32 + gr * 0.8; b = 36 + b * 0.78; }
      if (contrast) { r = (r - 128) * 1.35 + 128; gr = (gr - 128) * 1.35 + 128; b = (b - 128) * 1.35 + 128; }
      if (poster) { r = Math.round(r / q) * q; gr = Math.round(gr / q) * q; b = Math.round(b / q) * q; }
      if (negative) { r = 255 - r; gr = 255 - gr; b = 255 - b; }
      // the mist, cleared in the window
      const a = most * (1 - GLASS * (inner + 0.6 * ring * (1 - inner)));
      d[i] = r + (mist[0] - r) * a; d[i + 1] = gr + (mist[1] - gr) * a; d[i + 2] = b + (mist[2] - b) * a;
      d[i + 3] = heart ? 255 * inner : 255;
    }
    g.putImageData(img, 0, 0);
  }

  // ============================================================
  // THE PANEL — the boxed button at the top right, and what it opens.
  // ============================================================
  const box = document.createElement("div");
  box.className = "tepe-try";
  box.innerHTML = `
    <button class="tepe-try-open" type="button" aria-expanded="false" aria-controls="tepe-try-panel">
      <svg class="tepe-try-mark" width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="M1 11 L5.5 4 L8 7 L10.5 2.5 L15 11 Z"/></svg>
      <span class="tepe-try-word">Mountain</span> <span class="tepe-try-now"></span>
    </button>
    <div class="tepe-try-panel" id="tepe-try-panel" role="group" aria-label="The mountain behind the page: a trial" hidden>
      <p class="tepe-try-head">A trial · not the final page</p>
      <div class="tepe-try-pics" role="group" aria-label="Picture"></div>
      <div class="tepe-try-sliders"></div>
      <p class="tepe-try-label">Colour</p>
      <div class="tepe-try-chips" data-row="colour" role="group" aria-label="Colour"></div>
      <p class="tepe-try-label">Filters</p>
      <div class="tepe-try-chips" data-row="fx" role="group" aria-label="Filters"></div>
      <div class="tepe-try-foot">
        <button type="button" class="tepe-try-reset">Reset</button>
        <button type="button" class="tepe-try-close">Close</button>
      </div>
    </div>`;
  document.body.appendChild(box);
  const open = box.querySelector(".tepe-try-open"), panel = box.querySelector(".tepe-try-panel"), now = box.querySelector(".tepe-try-now");
  const pics = box.querySelector(".tepe-try-pics");
  PICTURES.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "tepe-try-pic";
    b.dataset.mountain = i + 1;
    b.setAttribute("aria-label", "Mountain " + (i + 1));
    b.innerHTML = `<img alt="" loading="lazy" src="${thumbOf(i + 1)}"><span>${i + 1}</span>`;
    pics.appendChild(b);
  });
  const SLIDERS = [["blur", "Blur"], ["mist", "Mist"], ["window", "Window"], ["edge", "Edge"]];
  const sliders = box.querySelector(".tepe-try-sliders");
  for (const [k, name] of SLIDERS) {
    const l = document.createElement("label");
    l.className = "tepe-try-slider";
    l.innerHTML = `<span>${name}</span><input type="range" min="0" max="100" step="1" data-k="${k}"><output></output>`;
    sliders.appendChild(l);
  }
  const chipsOf = (row, list, names) => {
    const el = box.querySelector(`[data-row="${row}"]`);
    for (const v of list) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "tepe-try-chip";
      b.dataset[row] = v;
      b.textContent = names[v];
      el.appendChild(b);
    }
  };
  chipsOf("colour", COLOURS, COLOUR_NAMES);
  chipsOf("fx", FX, FX_NAMES);

  function show() {
    now.textContent = state.mountain + " / " + PICTURES.length;
    box.querySelectorAll(".tepe-try-pic").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.mountain === state.mountain)));
    box.querySelectorAll(".tepe-try-slider input").forEach((i) => { i.value = state[i.dataset.k]; i.nextElementSibling.textContent = state[i.dataset.k]; });
    box.querySelectorAll("[data-colour]").forEach((b) => { if (b.classList.contains("tepe-try-chip")) b.setAttribute("aria-pressed", String(b.dataset.colour === state.colour)); });
    box.querySelectorAll(".tepe-try-chip[data-fx]").forEach((b) => b.setAttribute("aria-pressed", String(state.fx.includes(b.dataset.fx))));
  }
  function change(draft) { show(); keep(); draw(draft); }
  function setOpen(on) {
    panel.hidden = !on;
    open.setAttribute("aria-expanded", String(on));
    box.classList.toggle("open", on);
    if (on) for (let n = 1; n <= PICTURES.length; n++) picture(n).catch(() => {});
  }
  open.addEventListener("click", () => setOpen(panel.hidden));
  box.querySelector(".tepe-try-close").addEventListener("click", () => { setOpen(false); open.focus(); });
  box.querySelector(".tepe-try-reset").addEventListener("click", () => { Object.assign(state, read({})); change(false); });
  box.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); open.focus(); } });
  pics.addEventListener("click", (e) => {
    const b = e.target.closest(".tepe-try-pic");
    if (!b) return;
    state.mountain = +b.dataset.mountain;
    change(false);
  });
  box.addEventListener("click", (e) => {
    const b = e.target.closest(".tepe-try-chip");
    if (!b) return;
    if (b.dataset.colour) state.colour = b.dataset.colour;
    else if (b.dataset.fx) state.fx = FX.filter((f) => (f === b.dataset.fx ? !state.fx.includes(f) : state.fx.includes(f)));
    change(false);
  });
  sliders.addEventListener("input", (e) => {
    const i = e.target.closest("input");
    if (!i) return;
    state[i.dataset.k] = +i.value;
    change(true);
  });
  sliders.addEventListener("change", (e) => { if (e.target.closest("input")) change(false); });
  // A click anywhere else on the page puts the panel away.
  document.addEventListener("pointerdown", (e) => { if (!panel.hidden && !box.contains(e.target)) setOpen(false); });

  // Drawn again when the window's width changes (or it grows taller than it
  // has been) — never as a phone's bar comes and goes.
  let resizing = 0;
  addEventListener("resize", () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => {
      const W = document.documentElement.clientWidth || innerWidth;
      if (W !== drawnWidth || innerHeight > tallest + 2) draw(false);
    }, 180);
  });

  show();
  draw(false);

  // For the tests.
  window.TepePhoto = {
    state: () => JSON.parse(JSON.stringify(state)),
    drawn: () => root.classList.contains("tepe-photo-drawn") && !drawing,
    took: () => drawnAt,
    pictures: () => PICTURES.map((p) => p.file),
    // Where the window's middle stands, and the window as last drawn
    // (its box on the screen's pixels, and how soft its edge), in css px.
    clearAt: () => { const [W, H] = size(); const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT; return { x: W * at[0], y: H * at[1] }; },
    windowRect: () => shown && { ...shown },
    set: (s) => { Object.assign(state, read({ ...state, ...s })); change(false); },
  };
})();

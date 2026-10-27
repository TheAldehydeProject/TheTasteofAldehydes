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
//   THE WINDOW    on the right-ish middle, AN UPRIGHT RECTANGLE, 2 : 3,
//                 the mountain sharp and clear in it right to its edge,
//                 nothing feathered inside it; and THE GRADE outside it,
//                 blurred and misted more the further out, from nothing at
//                 its edge to the whole frost a feather's width out. Later
//                 the same day, in three notes: "I want the mask to be a sharp
//                 rctangle, as it was with the horse picture"; then "a blur
//                 of everything, except one rectangular NOT FEATHERED mask.
//                 On the outside of the rectangle, it should be feathered
//                 (and gradually getting more blurry). On the inside, no
//                 feather whatsoever"; then "Less blur on the outside of the
//                 rectangle, and feather the edges of the rectangle in the
//                 outward direction ONLY". (It was an irregular shape, sharp
//                 at its heart and soft round it, for its first round, and a
//                 rectangle cut clean for its second.) Each picture is
//                 placed so its peak stands in it (`focus`).
//   THE TRIAL     the boxed button at the top right — "Mountain 1 / 5" —
//                 opens THE PANEL: the five pictures, the blur, the mist, the
//                 window's size and its feather, a colour (natural, black and
//                 white, sepia, duotone, frost, warm), filters (faded,
//                 contrast, vignette, grain, posterise, negative) and THE
//                 TEXT'S BLENDING ("allow a person to change the blending of
//                 the text") — the writing laid over the mountain normally,
//                 multiplied, burnt, as hard or soft light, overlaid, by
//                 luminosity or inverted. Kept in the address
//                 (`?mountain=3&colour=sepia&fx=grain&text=multiply`), and in
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
  const GLASS = 0.9;                    // how much of the mist the window clears
  const MOST_PIXELS = 3.6e6;            // device pixels the picture is drawn in at most
  const BLUR_LEAST = 4, BLUR_STEP = 0.8; // the frost's blur, css px: 4 at Blur 0, 84 at 100
  const FEATHER_MOST = 0.7;             // the widest feather, Feather at 100: this share of the window's shorter side
  const LINE = 0.85;                    // THE LINE round the window: white, laid on as a screen, this strong
  const LINE_WIDE = 3;                  // and this wide (css px), astride the window's edge
  const COLOURS = ["natural", "bw", "sepia", "duotone", "frost", "warm"];
  const COLOUR_NAMES = { natural: "Natural", bw: "Black & white", sepia: "Sepia", duotone: "Duotone", frost: "Frost", warm: "Warm" };
  const FX = ["faded", "contrast", "vignette", "grain", "posterise", "negative"];
  const FX_NAMES = { faded: "Faded", contrast: "Contrast", vignette: "Vignette", grain: "Grain", posterise: "Posterise", negative: "Negative" };
  // THE FROST colour's mist (the poster's pale grey-green) and the warm one's.
  const MIST_OF = { frost: [214, 224, 220], warm: [241, 228, 204] };
  const GREEN = [46, 76, 46];           // the house's green (--tepe-green), the duotone's dark
  // THE TEXT'S BLENDING — how the writing is laid over the mountain (a
  // `mix-blend-mode`; Invert is the writing turned light and laid on as a
  // difference, so it reads as the picture turned over).
  const TEXTS = ["normal", "multiply", "burn", "hardlight", "overlay", "softlight", "luminosity", "invert"];
  const TEXT_NAMES = { normal: "Normal", multiply: "Multiply", burn: "Colour burn", hardlight: "Hard light", overlay: "Overlay", softlight: "Soft light", luminosity: "Luminosity", invert: "Invert" };
  const TEXT_BLEND = { normal: "normal", multiply: "multiply", burn: "color-burn", hardlight: "hard-light", overlay: "overlay", softlight: "soft-light", luminosity: "luminosity", invert: "difference" };
  const DEFAULTS = { mountain: 1, blur: 45, mist: 68, window: 50, feather: 32, edge: 20, colour: "natural", fx: [], text: "normal" };
  const KEYS = ["mountain", "blur", "mist", "window", "feather", "edge", "colour", "fx", "text"];
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
      feather: clampInt(get("feather"), 0, 100, DEFAULTS.feather),
      edge: clampInt(get("edge"), 0, 100, DEFAULTS.edge),
      colour: COLOURS.includes(colour) ? colour : DEFAULTS.colour,
      fx: FX.filter((f) => list.includes(f)),
      text: TEXTS.includes(get("text")) ? get("text") : DEFAULTS.text,
    };
  }
  const here = new URLSearchParams(location.search);
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) { stored = null; }
  const asked = KEYS.some((k) => here.has(k));
  const state = read(asked ? here : stored || {});

  function keep() {
    const p = new URLSearchParams(location.search);
    KEYS.forEach((k) => p.delete(k));
    for (const k of KEYS) if (k !== "fx" && state[k] !== DEFAULTS[k]) p.set(k, state[k]);
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
    if (radius < (FILTER ? 0.5 : 1.5)) return src;
    // (where the browser blurs a canvas itself, it is asked to: many times
    // quicker than the blur here, and the same to the eye)
    if (FILTER) {
      const out = make(w, h), g = out.getContext("2d");
      g.filter = "blur(" + (radius * 0.82).toFixed(2) + "px)";
      g.drawImage(src, 0, 0);
      return out;
    }
    const step = Math.max(1, radius / 3);
    const small = shrink(src, Math.max(8, Math.round(w / step)), Math.max(8, Math.round(h / step)));
    boxBlur(small, 2);
    const out = make(w, h), g = out.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(small, 0, 0, w, h);
    return out;
  }
  // Whether this browser blurs a canvas itself (`filter` on a canvas's
  // drawing: not every Safari does): a dot drawn through a blur, and read.
  const FILTER = (() => {
    try {
      const dot = make(9, 1), g = dot.getContext("2d");
      if (!("filter" in g)) return false;
      g.fillStyle = "#000";
      g.fillRect(4, 0, 1, 1);
      const c = make(9, 1), cg = ctxOf(c);
      cg.filter = "blur(2px)";
      cg.drawImage(dot, 0, 0);
      return cg.getImageData(2, 0, 1, 1).data[3] > 0;
    } catch (e) { return false; }
  })();
  // A seeded random, so a picture's window and grain are the same every time.
  function seeded(seed) {
    let s = seed >>> 0 || 1;
    return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }

  // ============================================================
  // THE WINDOW — an upright rectangle on the right-ish middle, sharp to its
  // very edge and nothing feathered inside it ("one rectangular NOT FEATHERED
  // mask"). THE GRADE outside it: the further out from it, the more blurred
  // and misted — "feathered (and gradually getting more blurry) ... feather
  // the edges of the rectangle in the outward direction ONLY" — from nothing
  // at its edge to the whole frost a feather's width out. Feather at 0 is the
  // frost from the edge at once.
  // ============================================================
  function windowRect(W, H) {
    const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT;
    const base = W < 700 ? W * 1.6 : Math.min(W, H * 1.6);
    let w = base * (0.12 + 0.2 * state.window / 100), h = w * TALL;
    if (h > H * 0.86) { h = H * 0.86; w = h / TALL; }
    return { x: W * at[0] - w / 2, y: H * at[1] - h / 2, w, h };
  }
  const featherOf = (W, H) => (state.feather / 100) * FEATHER_MOST * Math.min(W, H);
  const blurOf = () => BLUR_LEAST + BLUR_STEP * state.blur;
  const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  // How far through the feather a place `d` css px out of the window is: 0
  // in it and at its edge, 1 a feather's width out and beyond.
  const throughAt = (d, F) => (d <= 0 ? 0 : F > 0 ? Math.min(1, d / F) : 1);
  // How blurred and misted it is there, as a share of the frost at its
  // most — after the owner's drawing (a rectangle "clear / no blur", "nvb"
  // — not very blurry — just outside each of its sides, and arrows out to
  // "vb", very blurry; "blur" all about): nothing in the window; outside
  // it, NOT VERY BLURRY at its edge, the Edge's share, and growing from
  // there evenly to the eye — each step out by the same proportion, as a
  // blur is seen — to VERY BLURRY, the whole, a Feather's width out. (Its
  // rounds before: from nothing at the edge on a plain ease, then evenly to
  // the eye from nothing — "Make the feather a bit smoother" — then half
  // blurred at the edge and rising quickly — "The blur should be way more
  // intense nex to the masks border".)
  const startOf = () => Math.max(state.edge / 100, 0.5 / blurOf());
  const shareAt = (t) => { if (t <= 0) return 0; if (t >= 1) return 1; const s0 = startOf(); return s0 * Math.pow(1 / s0, t); };
  // How far out the blur reaches `share` of its most (0 when the edge
  // already has it).
  function outFor(share, F) {
    const s0 = startOf();
    if (!(F > 0) || share <= s0) return 0;
    if (share >= 1) return F;
    return (Math.log(share / s0) / Math.log(1 / s0)) * F;
  }
  // How far out of the window, across or down, a line of `n` pixels stands,
  // starting at `from` (css px) a `step` at a time.
  function outAlong(n, from, step, a, b) {
    const out = new Float32Array(n);
    for (let i = 0; i < n; i++) { const v = from + (i + 0.5) * step; out[i] = v < a ? a - v : v > b ? v - b : 0; }
    return out;
  }
  // THE LADDER: the same piece of picture blurred more and more, each rung
  // the last and a half again, near enough (in css px; `sc` of its pixels to
  // a css px) — a place is drawn from the two rungs either side of its own
  // blur. A rung is made only when it is wanted, and let go once it is used.
  function ladder(src, radii, sc) {
    return { radii, rung: (k) => { const c = radii[k] > 0 ? blurred(src, radii[k] * sc) : src; return ctxOf(c).getImageData(0, 0, c.width, c.height).data; } };
  }
  function rungs(from, to) {
    const out = [];
    // (twice the last below 2 css px, where a step is hard to see; the last
    // and a half again above it)
    for (let r = from; r < to * 0.97; r *= r < 2 ? 2 : Math.SQRT2) out.push(r);
    out.push(to);
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
      // THE WINDOW, THE FEATHER (css px out from its edge to the whole frost)
      // and THE BLUR at its most (css px).
      const r = windowRect(W, H), F = featherOf(W, H), R = blurOf();
      // THE FROST, small — as small as it can be and still be drawn true at
      // the least blur it is ever seen at (`least`, css px); nearer the window
      // than that, THE NEAR PIECE is drawn over it at the whole sharpness.
      const lr = Math.min(ratio, Math.max(ratio / SMALL, 3.75 / R));
      const least = Math.min(R, 2.5 / lr);
      const lw = Math.max(16, Math.round(W * lr)), lh = Math.max(16, Math.round(H * lr));
      const small = make(lw, lh), smg = small.getContext("2d");
      smg.imageSmoothingQuality = "high";
      smg.drawImage(img, ox * lr, oy * lr, iw * lr, ih * lr);
      const low = make(lw, lh), lg = ctxOf(low);
      lg.drawImage(small, 0, 0);
      // (in the window the frost is drawn as it is at the window's edge, so
      // nothing clear is smeared out past the edge as the small frost is laid
      // down large; the near piece covers it)
      grade(lg, lw, lh, { x: 0, y: 0, sx: W / lw, sy: H / lh, win: r, F, R, steps: ladder(small, rungs(least, R), lr), frost: true });
      // (drawn straight into the page's own canvas: all of it at once, before
      // the next frame, so nothing half drawn is ever seen)
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      canvas.style.height = H + "px";
      const og = ink;
      og.globalCompositeOperation = "source-over";
      og.globalAlpha = 1;
      og.imageSmoothingQuality = "high";
      og.drawImage(low, 0, 0, cw, ch);
      // THE NEAR PIECE: the window, sharp on whole pixels of the screen, and
      // round it, as far as the feather is blurred less than the frost can
      // show (none, when the edge is blurred more than that already), the
      // feather at the whole sharpness — handed over to the frost across a
      // few pixels (`hand`) where both are blurred alike.
      const band = R > least ? outFor(least / R, F) : 0;
      const hand = band > 0 ? Math.max(4, least * 1.5) : 0;
      const reach = band + hand;
      const x0 = Math.max(0, Math.round((r.x - reach) * ratio)), y0 = Math.max(0, Math.round((r.y - reach) * ratio));
      const x1 = Math.min(cw, Math.round((r.x + r.w + reach) * ratio)), y1 = Math.min(ch, Math.round((r.y + r.h + reach) * ratio));
      const bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
      // (the picture taken a little wider than the piece, so its blurring
      // has the picture to draw on at the piece's edge, not nothing)
      const most = reach > 0 ? R * shareAt(throughAt(reach, F)) : 0;
      const pad = Math.ceil(most * 2.5 * ratio) + 2;
      const near = make(bw + pad * 2, bh + pad * 2), ng = ctxOf(near);
      ng.imageSmoothingQuality = "high";
      ng.drawImage(img, ox * ratio - x0 + pad, oy * ratio - y0 + pad, iw * ratio, ih * ratio);
      const nearRungs = ladder(near, most > 0 ? [0].concat(rungs(Math.min(0.5, most), most)) : [0], ratio);
      const piece = make(bw, bh), pg = ctxOf(piece);
      pg.drawImage(near, -pad, -pad);
      grade(pg, bw, bh, {
        x: x0 / ratio, y: y0 / ratio, sx: 1 / ratio, sy: 1 / ratio, win: r, F, R,
        steps: nearRungs, pad, padW: bw + pad * 2,
        alpha: hand > 0 ? (d) => (d <= band ? 1 : 1 - ease((d - band) / hand)) : () => 1,
      });
      og.drawImage(piece, x0, y0);
      // THE LINE where the window is ("put a line border to where the actual
      // mask is, it should be white and screen blended"; "make the border
      // thicker by a factor of 3" — it was a hairline): astride its edge, on
      // whole pixels of the screen.
      {
        const lw = Math.max(LINE_WIDE, Math.round(LINE_WIDE * ratio)), half = Math.floor(lw / 2);
        const rx0 = Math.round(r.x * ratio) - half, ry0 = Math.round(r.y * ratio) - half;
        const rx1 = Math.round((r.x + r.w) * ratio) - half + lw, ry1 = Math.round((r.y + r.h) * ratio) - half + lw;
        og.globalCompositeOperation = "screen";
        og.fillStyle = "rgba(255, 255, 255, " + LINE + ")";
        og.fillRect(rx0, ry0, rx1 - rx0, lw);
        og.fillRect(rx0, ry1 - lw, rx1 - rx0, lw);
        og.fillRect(rx0, ry0 + lw, lw, ry1 - ry0 - 2 * lw);
        og.fillRect(rx1 - lw, ry0 + lw, lw, ry1 - ry0 - 2 * lw);
        og.globalCompositeOperation = "source-over";
      }
      shown = {
        x: Math.round(r.x * ratio) / ratio, y: Math.round(r.y * ratio) / ratio,
        w: (Math.round((r.x + r.w) * ratio) - Math.round(r.x * ratio)) / ratio,
        h: (Math.round((r.y + r.h) * ratio) - Math.round(r.y * ratio)) / ratio,
        feather: F, blur: R, edge: startOf(), near: reach, line: Math.max(LINE_WIDE, Math.round(LINE_WIDE * ratio)) / ratio,
      };
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
  // THE GRADE, THE COLOUR, THE FILTERS AND THE MIST, a pixel at a time, over
  // a piece of the window `w` by `h` pixels whose first stands at (`x`, `y`)
  // css px, a pixel `sx` by `sy` css px: each pixel taken from the ladder's
  // rungs either side of its blur, and misted as far as it is through the
  // feather (the mist cleared in the window). `alpha`, by how far out it is,
  // hands the near piece over to the frost. (The near piece's rungs are a
  // little wider than it, by `pad` all round, `padW` across.) The rungs are
  // taken one at a time, each laid into the pixels that want it, so only one
  // is ever held.
  function grade(g, w, h, o) {
    const img = g.createImageData(w, h), d = img.data, n = w * h;
    const { win, F, R, steps, alpha, frost } = o;
    // (`frost`: the small frost, drawn in the window as it is at its edge)
    const pad = o.pad || 0, rw = o.padW || w, radii = steps.radii, top = radii.length - 1;
    const outX = outAlong(w, o.x, o.sx, win.x, win.x + win.w), outY = outAlong(h, o.y, o.sy, win.y, win.y + win.h);
    const outOf = (p) => { const px = p % w, ax = outX[px], ay = outY[(p - px) / w]; return ax || ay ? Math.sqrt(ax * ax + ay * ay) : frost ? 1e-3 : 0; };
    // which two rungs each pixel is drawn from (`lo`, and the one after it)
    // and how far between them (`at`, in 255ths) — and the pixels put in
    // order of their rung (`order`, rung k's from `from[k]`), so each rung
    // is laid only into its own
    const lo = new Uint8Array(n), at = new Uint8Array(n), count = new Uint32Array(top + 2);
    for (let p = 0; p < n; p++) {
      const blur = R * shareAt(throughAt(outOf(p), F));
      let k = 0;
      while (k < top && radii[k + 1] <= blur) k++;
      if (k < top && blur > radii[k]) at[p] = Math.round((255 * (blur - radii[k])) / (radii[k + 1] - radii[k]));
      lo[p] = k;
      count[k + 1]++;
    }
    const from = new Uint32Array(top + 2);
    for (let k = 0; k <= top; k++) from[k + 1] = from[k] + count[k + 1];
    const order = new Uint32Array(n), fill = from.slice();
    for (let p = 0; p < n; p++) order[fill[lo[p]]++] = p;
    const lay = (q, a, b, f0, add) => {
      for (let o = a; o < b; o++) {
        const p = order[o], f = f0 ? 1 - at[p] / 255 : at[p] / 255;
        if (add && !at[p]) continue;
        const px = p % w, j = (((p - px) / w + pad) * rw + px + pad) * 4, i = p * 4;
        if (add) { d[i] += q[j] * f; d[i + 1] += q[j + 1] * f; d[i + 2] += q[j + 2] * f; }
        else { d[i] = q[j] * f; d[i + 1] = q[j + 1] * f; d[i + 2] = q[j + 2] * f; }
      }
    };
    for (let m = 0; m <= top; m++) {
      const mine = from[m + 1] > from[m], below = m > 0 && from[m] > from[m - 1];
      if (!mine && !below) continue;
      const q = steps.rung(m);
      if (mine) lay(q, from[m], from[m + 1], true, false);
      if (below) lay(q, from[m - 1], from[m], false, true);
    }
    const c = state.colour, fx = new Set(state.fx);
    const mist = MIST_OF[c] || PAPER;
    const most = (state.mist / 100) * 0.94;
    const faded = fx.has("faded"), contrast = fx.has("contrast"), poster = fx.has("posterise"), negative = fx.has("negative");
    const q = 255 / 4;
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const out = outOf(p);
      const share = shareAt(throughAt(out, F));
      let r = d[i], gr = d[i + 1], b = d[i + 2];
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
      // the mist, cleared in the window and coming up with the blur
      const a = most * (1 - GLASS * (1 - share));
      d[i] = r + (mist[0] - r) * a; d[i + 1] = gr + (mist[1] - gr) * a; d[i + 2] = b + (mist[2] - b) * a;
      d[i + 3] = alpha ? 255 * alpha(out) : 255;
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
      <p class="tepe-try-label">Text</p>
      <div class="tepe-try-chips" data-row="text" role="group" aria-label="The text's blending"></div>
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
  const SLIDERS = [["blur", "Blur"], ["mist", "Mist"], ["window", "Window"], ["feather", "Feather"], ["edge", "Edge"]];
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
  chipsOf("text", TEXTS, TEXT_NAMES);

  function show() {
    now.textContent = state.mountain + " / " + PICTURES.length;
    box.querySelectorAll(".tepe-try-pic").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.mountain === state.mountain)));
    box.querySelectorAll(".tepe-try-slider input").forEach((i) => { i.value = state[i.dataset.k]; i.nextElementSibling.textContent = state[i.dataset.k]; });
    box.querySelectorAll("[data-colour]").forEach((b) => { if (b.classList.contains("tepe-try-chip")) b.setAttribute("aria-pressed", String(b.dataset.colour === state.colour)); });
    box.querySelectorAll(".tepe-try-chip[data-fx]").forEach((b) => b.setAttribute("aria-pressed", String(state.fx.includes(b.dataset.fx))));
    box.querySelectorAll(".tepe-try-chip[data-text]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.text === state.text)));
    blendText();
  }
  // The text's blending is the stylesheet's (`data-tepe-text` on <html>, the
  // mode in `--tepe-text-blend`); the drawing is not made again for it.
  function blendText() {
    if (state.text === "normal") { delete root.dataset.tepeText; root.style.removeProperty("--tepe-text-blend"); }
    else { root.dataset.tepeText = state.text; root.style.setProperty("--tepe-text-blend", TEXT_BLEND[state.text]); }
  }
  function change(draft, redraw = true) { show(); keep(); if (redraw) draw(draft); }
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
    if (b.dataset.text) { state.text = b.dataset.text; change(false, false); return; }
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
    // Where the window's middle stands, and the window as last drawn (on
    // the screen's pixels), with its feather, its blur at its most and how
    // far out the near piece reaches, in css px.
    clearAt: () => { const [W, H] = size(); const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT; return { x: W * at[0], y: H * at[1] }; },
    windowRect: () => shown && { ...shown },
    set: (s) => { Object.assign(state, read({ ...state, ...s })); change(false); },
  };
})();

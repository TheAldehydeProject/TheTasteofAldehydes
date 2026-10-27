// ============================================================
// APOTEKER TEPE — houses/apoteker-tepe.html
//
// The thirteenth house, and its ground since 2026-10-27: A MOUNTAIN,
// PHOTOGRAPHED, BEHIND FROSTED GLASS — A TRIAL. The owner, with the
// Musica 2011 poster (a horse behind frosted glass, only what touches the
// glass sharp): "For apoteker tepe, remove the mointain as it is currently,
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
//   THE WINDOW    on the right-ish middle, an irregular upright shape where
//                 the mountain touches the glass: SHARP at its heart, a
//                 little soft round that, and into the frost — graded, as the
//                 poster's horse is sharp where it is pressed to the glass
//                 and a shadow where it is not. Each picture is placed so its
//                 peak stands in it (`focus`).
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
  const TALL = 1.6;                    // the window's height to its width: upright, as the poster's horse is
  const GLASS = 0.9;                    // how much of the mist the window clears at its heart
  const MOST_PIXELS = 3.6e6;            // device pixels the picture is drawn in at most
  const LIGHT_BLUR = 0.18;              // the soft ring round the window's heart: this share of the frost's blur
  const COLOURS = ["natural", "bw", "sepia", "duotone", "frost", "warm"];
  const COLOUR_NAMES = { natural: "Natural", bw: "Black & white", sepia: "Sepia", duotone: "Duotone", frost: "Frost", warm: "Warm" };
  const FX = ["faded", "contrast", "vignette", "grain", "posterise", "negative"];
  const FX_NAMES = { faded: "Faded", contrast: "Contrast", vignette: "Vignette", grain: "Grain", posterise: "Posterise", negative: "Negative" };
  // THE FROST colour's mist (the poster's pale grey-green) and the warm one's.
  const MIST_OF = { frost: [214, 224, 220], warm: [241, 228, 204] };
  const GREEN = [46, 76, 46];           // the house's green (--tepe-green), the duotone's dark
  const DEFAULTS = { mountain: 1, blur: 70, mist: 68, window: 50, edge: 50, colour: "natural", fx: [] };
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
  // THE WINDOW — an irregular upright shape round its middle, its outline a
  // few slow waves of its own (the same for each picture every time), on a
  // small picture of its own, made soft at its edge.
  // ============================================================
  function windowMask(W, H, scale, soft, seed, k) {
    // (`k`: how many css px a pixel of the mask is. It covers the whole
    // window; `box` is where in it, in css px, anything of it stands.)
    const mw = Math.max(8, Math.round(W / k)), mh = Math.max(8, Math.round(H / k));
    const m = make(mw, mh), g = m.getContext("2d");
    const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT;
    const base = W < 700 ? W * 1.6 : Math.min(W, H * 1.6);
    const rx = base * (0.07 + 0.15 * state.window / 100) * scale / k, ry = rx * TALL;
    const cx = (W * at[0]) / k, cy = (H * at[1]) / k;
    const rnd = seeded(seed);
    const waves = [2, 3, 5].map((n, i) => ({ n, a: [0.09, 0.07, 0.035][i] * (0.6 + rnd() * 0.8), p: rnd() * 6.283 }));
    const most = 1 + waves.reduce((t, w) => t + w.a, 0);
    g.fillStyle = "#fff";
    g.beginPath();
    const N = 96;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 6.283;
      let r = 1;
      for (const w of waves) r += w.a * Math.sin(w.n * t + w.p);
      const x = cx + Math.cos(t) * rx * r, y = cy + Math.sin(t) * ry * r;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
    g.fill();
    const blur = Math.max(1, Math.round(rx * soft));
    boxBlur(m, blur, true);
    const pad = blur * 2.2 + 2;
    const box = [(cx - rx * most - pad) * k, (cy - ry * most - pad) * k, (cx + rx * most + pad) * k, (cy + ry * most + pad) * k]
      .map((v, i) => Math.max(0, Math.min(i % 2 ? H : W, v)));
    return { m, box };
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
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * P.zoom;
      const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      const ox = Math.min(0, Math.max(W - iw, W * at[0] - P.focus[0] * iw));
      const oy = Math.min(0, Math.max(H - ih, H * at[1] - P.focus[1] * ih));
      // THE WINDOW: its heart and the ring round it, each a mask over the
      // whole window, and how clear the glass is at each place.
      const soft = 0.06 + 0.42 * state.edge / 100;
      const k = 6;
      const inner = windowMask(W, H, 0.82, soft, 1009 * n, k), outer = windowMask(W, H, 1.22, soft * 1.6 + 0.12, 1009 * n, k);
      const clearMask = make(inner.m.width, inner.m.height), cmg = clearMask.getContext("2d");
      cmg.globalAlpha = 0.6; cmg.drawImage(outer.m, 0, 0);
      cmg.globalAlpha = 1; cmg.drawImage(inner.m, 0, 0);
      // THE FROST, small: the picture, blurred out, and the ring a little
      // soft round the heart; coloured and misted.
      const lr = ratio / SMALL, lw = Math.max(16, Math.round(W * lr)), lh = Math.max(16, Math.round(H * lr));
      const small = make(lw, lh), smg = small.getContext("2d");
      smg.imageSmoothingQuality = "high";
      smg.drawImage(img, ox * lr, oy * lr, iw * lr, ih * lr);
      const R = 8 + state.blur * 1.0;                        // css px
      const heavy = blurred(small, R * lr), light = blurred(small, Math.max(1.6, R * LIGHT_BLUR * lr));
      const low = make(lw, lh), lg = ctxOf(low);
      lg.imageSmoothingQuality = "high";
      lg.drawImage(heavy, 0, 0);
      const ring = make(lw, lh), rg = ring.getContext("2d");
      rg.drawImage(light, 0, 0);
      rg.globalCompositeOperation = "destination-in";
      rg.imageSmoothingQuality = "high";
      rg.drawImage(outer.m, 0, 0, lw, lh);
      lg.drawImage(ring, 0, 0);
      finish(lg, lw, lh, clearOf(clearMask, [0, 0, W, H], lw, lh));
      // (drawn straight into the page's own canvas: all of it at once, before
      // the next frame, so nothing half drawn is ever seen)
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      canvas.style.height = H + "px";
      const og = ink;
      og.globalCompositeOperation = "source-over";
      og.globalAlpha = 1;
      og.imageSmoothingQuality = "high";
      og.drawImage(low, 0, 0, cw, ch);
      // THE HEART, sharp, in its own box.
      const [bx0, by0, bx1, by1] = inner.box;
      const x0 = Math.floor(bx0 * ratio), y0 = Math.floor(by0 * ratio);
      const bw = Math.max(1, Math.ceil(bx1 * ratio) - x0), bh = Math.max(1, Math.ceil(by1 * ratio) - y0);
      const heart = make(bw, bh), hg = ctxOf(heart);
      hg.imageSmoothingQuality = "high";
      hg.drawImage(img, ox * ratio - x0, oy * ratio - y0, iw * ratio, ih * ratio);
      finish(hg, bw, bh, clearOf(clearMask, [x0 / ratio, y0 / ratio, (x0 + bw) / ratio, (y0 + bh) / ratio], bw, bh));
      hg.globalCompositeOperation = "destination-in";
      hg.drawImage(inner.m, (x0 / ratio) / k, (y0 / ratio) / k, (bw / ratio) / k, (bh / ratio) / k, 0, 0, bw, bh);
      og.drawImage(heart, x0, y0);
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
  // How clear the glass is over `rect` (css px) of the window, `w` by `h`,
  // read off the mask (which covers the whole window).
  function clearOf(mask, rect, w, h) {
    const c = make(w, h), g = ctxOf(c);
    g.imageSmoothingQuality = "high";
    const sx = mask.width / size()[0];
    g.drawImage(mask, rect[0] * sx, rect[1] * sx, (rect[2] - rect[0]) * sx, (rect[3] - rect[1]) * sx, 0, 0, w, h);
    return g.getImageData(0, 0, w, h).data;
  }

  // THE COLOUR, THE FILTERS AND THE MIST, a pixel at a time.
  function finish(g, w, h, clear) {
    const img = g.getImageData(0, 0, w, h), d = img.data;
    const c = state.colour, fx = new Set(state.fx);
    const mist = MIST_OF[c] || PAPER;
    const most = (state.mist / 100) * 0.94;
    const faded = fx.has("faded"), contrast = fx.has("contrast"), poster = fx.has("posterise"), negative = fx.has("negative");
    const q = 255 / 4;
    for (let i = 0; i < d.length; i += 4) {
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
      // the mist, cleared in the window
      const a = most * (1 - GLASS * (clear[i + 3] / 255));
      d[i] = r + (mist[0] - r) * a; d[i + 1] = gr + (mist[1] - gr) * a; d[i + 2] = b + (mist[2] - b) * a; d[i + 3] = 255;
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
    // Where the window's heart stands, in css px.
    clearAt: () => { const [W, H] = size(); const at = W < 700 ? CLEAR_AT_NARROW : CLEAR_AT; return { x: W * at[0], y: H * at[1] }; },
    set: (s) => { Object.assign(state, read({ ...state, ...s })); change(false); },
  };
})();

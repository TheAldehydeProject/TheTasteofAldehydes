// ============================================================
// THE MOUNTAIN, DRAWN — tepe-gl.js
//
// Apoteker Tepe's mountain as both of its pages draw it: the house's own
// page (tepe.js), whole behind the writing, and the Houses view (motifs.js),
// in fragments. The owner, 2026-10-20, later: "make the particles smaller
// and way more dense ... smooth out the textures and decrease the emphasis
// on the colour green ... I do not want the mountain to be translucent, i
// want it to be visible exactly the same as any other mountain; and i want
// there to be colours, not just green. it should be well coloured - like
// an actual mountain ... I want the actual logo of the house to appear
// somewhere on this mountain ... Please also apply the above changes to be
// true for the house in SD, not only in page."
//
//   THE GROUND    Mount Athos out of its real heights (tepe-data.js) and
//                 coloured by a real photograph of it from above — the
//                 Copernicus Sentinel-2 satellite's, printed and its greens
//                 quieted (`images/Apoteker Tepe/mountain/athos.jpg`; both
//                 written by tools/apoteker/mountain.mjs) — lit by a low
//                 sun from the south-west, its hollows a little darker.
//   THE SIGN      the house's own sign laid on a broad slope, its head
//                 uphill, pale as a figure cut into a hillside
//                 (`TEPE.figure`, chosen by the tool): part of the ground's
//                 own colour, so it turns, hides and goes quiet with it.
//   SOLID         a SURFACE — the heights as a mesh of triangles, every
//                 one opaque, hiding what stands behind it — and over it
//                 the SPECKS, small and many, each the ground's own colour
//                 where it stands, a shade lighter or darker: a mountain
//                 made of particles that is a mountain all the same.
//   THE SHORE     the shallows round the land, paler where the water is
//                 shallowest, a line of foam at the water's edge, the open
//                 sea left to whatever stands behind (the page's
//                 environment; on the Houses view, the paper).
//
// WebGL: one small program for the surface and one for the specks, both
// checked once compiled; if either fails, `make` gives nothing and the
// page goes on without its mountain rather than with a blank. On a machine
// drawing without a graphics card (a test's browser, an old laptop) it
// lays a tenth of the specks, as the home page's aldehyde does, and the
// page draws it again less often.
//
//   TepeGL.ground()          a promise of the ground: its heights, its
//                            colour with the sign laid on, and everything
//                            worked out from them, made once a page.
//   TepeGL.make(canvas)      a drawing on that canvas, or null.
//     .piece(opts)           a stretch of the ground made ready to draw —
//                            the whole mountain, or a fragment of it.
//     .size(w, h, ratio), .clear(), .draw(piece, camera)
//   TepeGL.project(p, cam)   where a point stands on the window, as the
//                            drawing puts it (for what is drawn over it).
//
// THE CAMERA is the page's, as it always was: turned about the upright
// (`yaw`), looked down on (`pitch`), its eye `eye` half-widths off, drawn
// `S` px to a half-width about (`cx`, `cy`).
// ============================================================
(function () {
  const DATA = window.TEPE;
  if (!DATA || window.TepeGL) return;

  // ---------- TUNING ----------
  const SUN = { az: (225 * Math.PI) / 180, alt: (34 * Math.PI) / 180 };   // the light: low, from the south-west
  const SHADE_FLOOR = 0.52;        // how much light a slope turned from the sun still has
  const SHADE_GAIN = 0.62;         // and how much more one facing it gets
  const HOLLOW = 5.5;              // how much darker the hollows are (the heights against their own blur)
  const SIGN = [226, 220, 205];    // the sign's pale stone
  const SIGN_A = 0.86;
  const SHALLOW = [150, 186, 180]; // the shallows at the shore, and the open water they fade into
  const FOAM = [238, 236, 226];
  const SHALLOW_CELLS = 4.5;       // how far out from the land the shallows reach, in cells
  const SOFT_SHARE = 0.1;          // a tenth of the specks without a graphics card

  const n = DATA.n;
  const root = window.SITE_ROOT || "../";

  // ---------- THE GROUND, ONCE A PAGE ----------
  let groundPromise = null;
  function unpackHeights() {
    const s = atob(DATA.heights), out = new Float32Array(n * n);
    for (let k = 0; k < n * n; k++) out[k] = ((s.charCodeAt(2 * k) << 8) | s.charCodeAt(2 * k + 1)) / 65535;
    return out;
  }
  const load = (src) => new Promise((done) => { const i = new Image(); i.onload = () => done(i); i.onerror = () => done(null); i.src = src; });

  function ground() {
    if (groundPromise) return groundPromise;
    groundPromise = Promise.all([load(root + encodeURI(DATA.colour)), load(root + encodeURI("images/Apoteker Tepe/Apoteker Tepe Logo.webp"))]).then(([photo, logo]) => {
      const H = unpackHeights();
      const at = (u, v) => {                     // bilinear, u and v in cells
        const i = Math.max(0, Math.min(n - 1.001, u)), j = Math.max(0, Math.min(n - 1.001, v));
        const i0 = i | 0, j0 = j | 0, fx = i - i0, fy = j - j0, k = j0 * n + i0;
        return (H[k] * (1 - fx) + H[k + 1] * fx) * (1 - fy) + (H[k + n] * (1 - fx) + H[k + n + 1] * fx) * fy;
      };
      // THE COLOUR, with the sign laid on it.
      const C = photo ? photo.naturalWidth : 4;
      const tex = document.createElement("canvas");
      tex.width = tex.height = C;
      const g = tex.getContext("2d", { willReadFrequently: true });
      if (photo) g.drawImage(photo, 0, 0, C, C);
      else { g.fillStyle = "#7d7a66"; g.fillRect(0, 0, C, C); }
      if (logo && DATA.figure) {
        const f = DATA.figure, k = C / n, tall = f.tall * k, wide = (logo.naturalWidth / logo.naturalHeight) * tall;
        const inked = (colour) => {
          const c = document.createElement("canvas");
          c.width = Math.ceil(wide); c.height = Math.ceil(tall);
          const ig = c.getContext("2d");
          ig.drawImage(logo, 0, 0, c.width, c.height);
          ig.globalCompositeOperation = "source-in";
          ig.fillStyle = "rgb(" + colour.join(",") + ")";
          ig.fillRect(0, 0, c.width, c.height);
          return c;
        };
        const ink = inked(SIGN), edge = inked([40, 38, 30]);
        // Its head towards `up` (the way to the summit, on the grid).
        const turn = Math.atan2(Math.cos(f.up), -Math.sin(f.up));
        g.save();
        g.translate((f.at[0] + 0.5) * k, (f.at[1] + 0.5) * k);
        g.rotate(turn);
        // A shadow of it downhill first, as a figure cut in has its edge.
        g.globalAlpha = 0.3;
        g.drawImage(edge, -wide / 2, -tall / 2 + 1.5, wide, tall);
        g.globalAlpha = SIGN_A;
        g.drawImage(ink, -wide / 2, -tall / 2, wide, tall);
        g.restore();
      }
      const px = g.getImageData(0, 0, C, C).data;
      const colourAt = (u, v) => {               // the colour at a place on the grid, nearest pixel
        const a = Math.max(0, Math.min(C - 1, Math.floor(((u + 0.5) / n) * C))), b = Math.max(0, Math.min(C - 1, Math.floor(((v + 0.5) / n) * C)));
        const k = (b * C + a) * 4;
        return [px[k], px[k + 1], px[k + 2]];
      };
      // THE LIGHT on every place of the grid, worked out on the heights as
      // they are drawn (raised LIFT, as the page raises them), and the
      // hollows darker.
      const LIFT = 0.42, shade = new Float32Array(n * n);
      // Towards the sun, east +x, up +y, south +z.
      const L = [Math.sin(SUN.az) * Math.cos(SUN.alt), Math.sin(SUN.alt), -Math.cos(SUN.az) * Math.cos(SUN.alt)];
      const blur = new Float32Array(n * n), tmp = new Float32Array(n * n), R = 3;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let d = -R; d <= R; d++) { const ii = i + d; if (ii >= 0 && ii < n) { s += H[j * n + ii]; c++; } } tmp[j * n + i] = s / c; }
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let s = 0, c = 0; for (let d = -R; d <= R; d++) { const jj = j + d; if (jj >= 0 && jj < n) { s += tmp[jj * n + i]; c++; } } blur[j * n + i] = s / c; }
      const k2 = (LIFT * n) / 2;
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const dx = (at(i + 1, j) - at(i - 1, j)) * 0.5 * k2, dz = (at(i, j + 1) - at(i, j - 1)) * 0.5 * k2;
          const len = Math.hypot(dx, 1, dz), nx = -dx / len, ny = 1 / len, nz = -dz / len;
          const lit = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          const hollow = Math.max(-0.18, Math.min(0.12, (H[j * n + i] - blur[j * n + i]) * HOLLOW));
          shade[j * n + i] = (SHADE_FLOOR + SHADE_GAIN * lit) * (1 + hollow);
        }
      }
      // THE SHALLOWS: how far each place of the sea is from the land, in
      // cells (two passes of a chamfer), so the water pales towards it.
      const land = (k) => H[k] > 0.0015;
      const wet = new Float32Array(n * n);
      for (let k = 0; k < n * n; k++) wet[k] = land(k) ? 0 : 1e9;
      const D1 = 1, D2 = Math.SQRT2;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const k = j * n + i; let d = wet[k];
        if (i > 0) d = Math.min(d, wet[k - 1] + D1);
        if (j > 0) { d = Math.min(d, wet[k - n] + D1); if (i > 0) d = Math.min(d, wet[k - n - 1] + D2); if (i < n - 1) d = Math.min(d, wet[k - n + 1] + D2); }
        wet[k] = d;
      }
      for (let j = n - 1; j >= 0; j--) for (let i = n - 1; i >= 0; i--) {
        const k = j * n + i; let d = wet[k];
        if (i < n - 1) d = Math.min(d, wet[k + 1] + D1);
        if (j < n - 1) { d = Math.min(d, wet[k + n] + D1); if (i < n - 1) d = Math.min(d, wet[k + n + 1] + D2); if (i > 0) d = Math.min(d, wet[k + n - 1] + D2); }
        wet[k] = d;
      }
      return { n, H, at, shade, wet, tex, colourAt, LIFT, summit: DATA.summit, trails: DATA.trails, places: DATA.places || {}, figure: DATA.figure, top: DATA.top };
    });
    return groundPromise;
  }

  // ---------- THE PROGRAMS ----------
  const SURFACE_VS = `
    attribute vec3 aPos; attribute vec2 aUV; attribute float aShade; attribute float aA; attribute float aWet;
    uniform mat4 uM; uniform float uEye;
    varying vec2 vUV; varying float vShade; varying float vA; varying float vWet; varying float vZ;
    void main() {
      gl_Position = uM * vec4(aPos, 1.0);
      vUV = aUV; vShade = aShade; vA = aA; vWet = aWet; vZ = gl_Position.w - uEye;
    }`;
  const SURFACE_FS = `
    precision mediump float;
    uniform sampler2D uTex; uniform float uSurface; uniform vec4 uFog; uniform vec2 uFogZ;
    uniform vec3 uShallow; uniform vec3 uFoam; uniform float uSea;
    varying vec2 vUV; varying float vShade; varying float vA; varying float vWet; varying float vZ;
    void main() {
      vec3 land = texture2D(uTex, vUV).rgb * vShade * uSurface;
      // The sea: the shallows pale at the shore, a line of foam at its edge,
      // and gone into whatever stands behind further out.
      float w = clamp(vWet, 0.0, 1.0), wet = smoothstep(0.0, 0.16, vWet);
      vec3 water = mix(uFoam, uShallow, smoothstep(0.08, 0.32, w));
      vec3 col = mix(land, water, wet);
      float a = vA * mix(1.0, uSea * (1.0 - smoothstep(0.25, 1.0, w)) * 0.9, wet);
      col = mix(col, uFog.rgb, uFog.a * smoothstep(uFogZ.x, uFogZ.y, vZ));
      gl_FragColor = vec4(col * a, a);
    }`;
  const SPECK_VS = `
    attribute vec3 aPos; attribute vec3 aCol; attribute float aSize; attribute float aA;
    uniform mat4 uM; uniform float uEye; uniform float uPx;
    uniform vec4 uFog; uniform vec2 uFogZ;
    varying vec3 vCol; varying float vA;
    void main() {
      gl_Position = uM * vec4(aPos, 1.0);
      gl_Position.z -= 0.0025 * gl_Position.w;
      gl_PointSize = max(1.0, uPx * aSize * (uEye / gl_Position.w));
      float z = gl_Position.w - uEye;
      vCol = mix(aCol, uFog.rgb, uFog.a * smoothstep(uFogZ.x, uFogZ.y, z));
      vA = aA;
    }`;
  const SPECK_FS = `
    precision mediump float;
    varying vec3 vCol; varying float vA;
    void main() { gl_FragColor = vec4(vCol * vA, vA); }`;

  const BACK_VS = `
    attribute vec2 aXY; varying vec2 vST;
    void main() { vST = vec2(aXY.x * 0.5 + 0.5, 0.5 - aXY.y * 0.5); gl_Position = vec4(aXY, 0.999, 1.0); }`;
  const BACK_FS = `
    precision mediump float;
    uniform sampler2D uBack; varying vec2 vST;
    void main() { gl_FragColor = texture2D(uBack, vST); }`;

  function program(gl, vs, fs) {
    const make = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const v = make(gl.VERTEX_SHADER, vs), f = make(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    const out = { p, a: {}, u: {} };
    for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES); i++) { const x = gl.getActiveAttrib(p, i); out.a[x.name] = gl.getAttribLocation(p, x.name); }
    for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) { const x = gl.getActiveUniform(p, i); out.u[x.name] = gl.getUniformLocation(p, x.name); }
    return out;
  }

  // ---------- THE CAMERA ----------
  /** Where a point (x, y, z) of the ground's own space stands for `cam`:
      on the window (x, y, css px) and how far back (z, half-widths). East
      is +x and south +z, so facing south the east is on the LEFT: the
      window's x is the turned x the other way round (until 2026-10-20,
      later, the mountain was drawn as in a mirror — which no one could see
      until a photograph of it, and the house's sign, were laid on it). */
  function project(p, cam) {
    const c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    const xr = p.x * c - p.z * s, zr = p.x * s + p.z * c;
    const y2 = p.y * cp + zr * sp, z2 = -p.y * sp + zr * cp;
    const f = cam.eye / (cam.eye + z2);
    return { x: cam.cx - xr * cam.S * f, y: cam.cy - y2 * cam.S * f, z: z2 };
  }
  /** The same as a matrix, for a canvas `W` by `H` css px (column-major). */
  function matrix(cam, W, H) {
    const c = Math.cos(cam.yaw), s = Math.sin(cam.yaw), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    // xr = c x - s z;  y2 = cp y + sp (s x + c z);  z2 = -sp y + cp (s x + c z)
    const R = [
      [c, 0, -s],
      [sp * s, cp, sp * c],
      [cp * s, -sp, cp * c],
    ];
    const kx = (2 * cam.S * cam.eye) / W, ky = (2 * cam.S * cam.eye) / H;
    const ox = (2 * cam.cx) / W - 1, oy = 1 - (2 * cam.cy) / H;
    const wn = Math.max(0.05, cam.eye - 2.6), wf = cam.eye + 2.6;
    const A = (wf + wn) / (wf - wn), B = (-2 * wf * wn) / (wf - wn);
    // clip.x = -kx xr + ox w;  clip.y = ky y2 + oy w;  clip.z = A w + B;  clip.w = w = z2 + eye
    const rowX = [-kx * R[0][0] + ox * R[2][0], -kx * R[0][1] + ox * R[2][1], -kx * R[0][2] + ox * R[2][2], ox * cam.eye];
    const rowY = [ky * R[1][0] + oy * R[2][0], ky * R[1][1] + oy * R[2][1], ky * R[1][2] + oy * R[2][2], oy * cam.eye];
    const rowZ = [A * R[2][0], A * R[2][1], A * R[2][2], A * cam.eye + B];
    const rowW = [R[2][0], R[2][1], R[2][2], cam.eye];
    const m = new Float32Array(16);
    for (let col = 0; col < 4; col++) { m[col * 4] = rowX[col]; m[col * 4 + 1] = rowY[col]; m[col * 4 + 2] = rowZ[col]; m[col * 4 + 3] = rowW[col]; }
    return m;
  }

  // ---------- A DRAWING ----------
  // Whether this machine draws without a graphics card, asked once of a
  // canvas of its own (so the drawing's own can be made to suit). (`?tepe=full`
  // on the address draws it whole there too, for a picture of it.)
  let softKnown = null;
  function software() {
    if (softKnown != null) return softKnown;
    softKnown = false;
    if (/[?&]tepe=full\b/.test(location.search)) return softKnown;
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      const info = gl && gl.getExtension("WEBGL_debug_renderer_info");
      softKnown = /swiftshader|llvmpipe|software/i.test(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "");
      const lose = gl && gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    } catch (e) { /* not knowing is fine */ }
    return softKnown;
  }

  function make(canvas, opts = {}) {
    const soft = software();
    let gl = null;
    try {
      // Without a graphics card, no smoothing of its edges either: on the
      // processor that is four times the drawing.
      // OPAQUE when it carries its own backdrop (the page's sky and sea):
      // nothing under it is drawn, nothing over the page is blended.
      const o = { alpha: !opts.opaque, premultipliedAlpha: true, antialias: !soft, depth: true, preserveDrawingBuffer: !!opts.preserve };
      gl = canvas.getContext("webgl", o) || canvas.getContext("experimental-webgl", o);
    } catch (e) { gl = null; }
    if (!gl) return null;
    const surface = program(gl, SURFACE_VS, SURFACE_FS), specks = program(gl, SPECK_VS, SPECK_FS), back = program(gl, BACK_VS, BACK_FS);
    if (!surface || !specks || !back) return null;
    let backTex = null, quad = null;
    let W = 1, H = 1, ratio = 1, texture = null, G = null;

    function textureOf(ground) {
      if (texture) return texture;
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, ground.tex);
      const pow2 = (ground.tex.width & (ground.tex.width - 1)) === 0;
      if (pow2) gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, pow2 ? (soft ? gl.LINEAR_MIPMAP_NEAREST : gl.LINEAR_MIPMAP_LINEAR) : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return texture;
    }

    /** A stretch of ground made ready to draw:
          centre  [u, v] on the grid, the piece's (0, 0, 0)
          scale   cells to a half-width (n / 2 for the whole mountain)
          reach   cells from the centre it is drawn to, at most
          edge    (angle) => share of `reach` it is drawn to that way (a torn edge)
          fade    share of the reach where it begins to fade out
          lift    half-widths of height for the whole of `top`
          base    the height (a share of `top`) at the piece's 0
          sea     whether its shallows are drawn
          sink    whether its land sinks to the sea as it fades out (the whole
                  mountain's: the peninsula it stands on runs on past the square,
                  and cut off and faded it hung under it like a curtain)
          specks  how many specks it is drawn in (a fifth without a graphics card)
          seed    the specks' own randomness */
    function piece(ground, o) {
      G = ground;
      const [cu, cv] = o.centre, scale = o.scale, reach = o.reach, edge = o.edge || (() => 1), fade = o.fade == null ? 0.72 : o.fade;
      const lift = o.lift, base = o.base || 0;
      const N = ground.n, Hh = ground.H;
      let seed = o.seed || 1925;
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
      const keepAt = (u, v) => {                 // 1 inside, fading to 0 at the (torn) edge
        const du = u - cu, dv = v - cv, d = Math.hypot(du, dv) / (reach * edge(Math.atan2(dv, du)));
        return 1 - smooth(fade, 1, d);
      };
      const sinkAt = (keep) => (o.sink ? Math.pow(keep, 0.7) : 1);
      // THE SURFACE: the grid's places within reach, and the triangles between them.
      // (Every other place of the grid without a graphics card: a quarter of the triangles.)
      const st = soft && !o.fine ? 2 : 1;
      const i0 = Math.max(0, Math.floor(cu - reach - 1)), i1 = Math.min(N - 1, Math.ceil(cu + reach + 1));
      const j0 = Math.max(0, Math.floor(cv - reach - 1)), j1 = Math.min(N - 1, Math.ceil(cv + reach + 1));
      const cols = Math.floor((i1 - i0) / st) + 1, rows = Math.floor((j1 - j0) / st) + 1;
      const index = new Int32Array(cols * rows).fill(-1);
      const pos = [], uv = [], sh = [], al = [], we = [];
      let count = 0;
      for (let j = j0; j <= j1; j += st) {
        for (let i = i0; i <= i1; i += st) {
          const keep = keepAt(i, j);
          if (keep <= 0) continue;
          const k = j * N + i, w = ground.wet[k];
          if (w > 0 && !o.sea) continue;
          if (w > SHALLOW_CELLS + 1.5) continue;
          index[((j - j0) / st) * cols + (i - i0) / st] = count++;
          pos.push((i - cu) / scale, (Math.max(0, Hh[k]) * sinkAt(keep) - base) * lift, (j - cv) / scale);
          uv.push((i + 0.5) / N, (j + 0.5) / N);
          sh.push(ground.shade[k]);
          al.push(keep);
          we.push(w > 0 ? Math.min(1.5, w / SHALLOW_CELLS) : 0);
        }
      }
      const tri = [];
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = index[j * cols + i], b = index[j * cols + i + 1], c = index[(j + 1) * cols + i], d = index[(j + 1) * cols + i + 1];
          if (a >= 0 && b >= 0 && c >= 0) tri.push(a, b, c);
          if (b >= 0 && d >= 0 && c >= 0) tri.push(b, d, c);
        }
      }
      const big = count > 65535;
      const ext = big ? gl.getExtension("OES_element_index_uint") : null;
      const buf = (data, target = gl.ARRAY_BUFFER) => { const b = gl.createBuffer(); gl.bindBuffer(target, b); gl.bufferData(target, data, gl.STATIC_DRAW); return b; };
      const mesh = {
        pos: buf(new Float32Array(pos)), uv: buf(new Float32Array(uv)), sh: buf(new Float32Array(sh)), al: buf(new Float32Array(al)), we: buf(new Float32Array(we)),
        idx: buf(big && ext ? new Uint32Array(tri) : new Uint16Array(tri), gl.ELEMENT_ARRAY_BUFFER), count: tri.length, type: big && ext ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
      };
      // THE SPECKS: on the land within reach, as many to a cell everywhere,
      // each the ground's own colour, lit as it is, a shade either way.
      const want = Math.round((o.specks || 0) * (soft ? SOFT_SHARE : 1));
      const sp = new Float32Array(want * 3), sc = new Uint8Array(want * 3), ss = new Float32Array(want), sa = new Float32Array(want);
      let m = 0;
      for (let tries = 0; m < want && tries < want * 8; tries++) {
        const a = random() * Math.PI * 2, d = Math.sqrt(random()) * reach;
        const u = cu + Math.cos(a) * d, v = cv + Math.sin(a) * d;
        if (u < 0 || v < 0 || u > N - 1.001 || v > N - 1.001) continue;
        const keep = keepAt(u, v);
        if (keep <= 0.02) continue;
        const h = ground.at(u, v);
        if (h <= 0.002) continue;
        const ui = Math.round(u), vi = Math.round(v), lit = ground.shade[vi * N + ui];
        const rgb = ground.colourAt(u, v), vary = 1 + (random() - 0.5) * 0.14;
        sp[m * 3] = (u - cu) / scale; sp[m * 3 + 1] = (h * sinkAt(keep) - base) * lift; sp[m * 3 + 2] = (v - cv) / scale;
        for (let ch = 0; ch < 3; ch++) sc[m * 3 + ch] = Math.max(0, Math.min(255, Math.round(rgb[ch] * lit * vary)));
        ss[m] = 0.8 + random() * 0.45;
        sa[m] = keep * keep;
        m++;
      }
      const dots = { pos: buf(sp.subarray(0, m * 3)), col: buf(sc.subarray(0, m * 3)), size: buf(ss.subarray(0, m)), al: buf(sa.subarray(0, m)), count: m };
      return {
        mesh, dots, vertices: count, specks: m,
        /** A place on the grid as the piece's own point (for what is drawn over it). */
        point(u, v, up = 0) { return { x: (u - cu) / scale, y: (Math.max(0, ground.at(u, v)) * sinkAt(keepAt(u, v)) - base) * lift + up, z: (v - cv) / scale }; },
        dispose() { [mesh.pos, mesh.uv, mesh.sh, mesh.al, mesh.we, mesh.idx, dots.pos, dots.col, dots.size, dots.al].forEach((b) => gl.deleteBuffer(b)); },
      };
    }

    function attrib(prog, name, buffer, size, type = gl.FLOAT, norm = false) {
      const loc = prog.a[name];
      if (loc == null || loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, type, norm, 0, 0);
    }
    function off(prog) { Object.values(prog.a).forEach((loc) => loc >= 0 && gl.disableVertexAttribArray(loc)); }

    return {
      gl, soft,
      piece: (ground, o) => piece(ground, o),
      size(w, h, r) {
        W = w; H = h; ratio = r;
        canvas.width = Math.max(1, Math.round(w * r)); canvas.height = Math.max(1, Math.round(h * r));
      },
      clear(rgb) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (rgb) gl.clearColor(rgb[0], rgb[1], rgb[2], 1);
        else gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      },
      /** Lay a picture (a canvas) over the whole drawing, behind everything. */
      backdrop(picture) {
        if (!backTex) {
          backTex = gl.createTexture();
          quad = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, quad);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        }
        gl.bindTexture(gl.TEXTURE_2D, backTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, picture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.useProgram(back.p);
        gl.uniform1i(back.u.uBack, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(back.a.aXY);
        gl.vertexAttribPointer(back.a.aXY, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(back.a.aXY);
      },
      /** Draw `p` for `cam`. `look`: the fog's colour and strength, how
          strong the shallows are, the surface's brightness, the specks' size. */
      draw(p, cam, look = {}) {
        if (!G) return;
        const M = matrix(cam, W, H);
        const fog = look.fog || [0.85, 0.85, 0.82, 0], fogZ = look.fogZ || [-0.6, 1.4];
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        // The surface.
        gl.useProgram(surface.p);
        gl.depthMask(true);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureOf(G));
        gl.uniform1i(surface.u.uTex, 0);
        gl.uniformMatrix4fv(surface.u.uM, false, M);
        gl.uniform1f(surface.u.uEye, cam.eye);
        gl.uniform1f(surface.u.uSurface, look.surface == null ? 0.9 : look.surface);
        gl.uniform4fv(surface.u.uFog, fog);
        gl.uniform2fv(surface.u.uFogZ, fogZ);
        gl.uniform3fv(surface.u.uShallow, (look.shallow || SHALLOW).map((v) => v / 255));
        gl.uniform3fv(surface.u.uFoam, FOAM.map((v) => v / 255));
        gl.uniform1f(surface.u.uSea, look.sea == null ? 1 : look.sea);
        attrib(surface, "aPos", p.mesh.pos, 3);
        attrib(surface, "aUV", p.mesh.uv, 2);
        attrib(surface, "aShade", p.mesh.sh, 1);
        attrib(surface, "aA", p.mesh.al, 1);
        attrib(surface, "aWet", p.mesh.we, 1);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.mesh.idx);
        gl.drawElements(gl.TRIANGLES, p.mesh.count, p.mesh.type, 0);
        off(surface);
        // The specks, over it, hidden where the surface stands in front.
        if (p.dots.count) {
          gl.useProgram(specks.p);
          gl.depthMask(false);
          gl.uniformMatrix4fv(specks.u.uM, false, M);
          gl.uniform1f(specks.u.uEye, cam.eye);
          gl.uniform1f(specks.u.uPx, (look.speck == null ? 0.7 : look.speck) * ratio);
          gl.uniform4fv(specks.u.uFog, fog);
          gl.uniform2fv(specks.u.uFogZ, fogZ);
          attrib(specks, "aPos", p.dots.pos, 3);
          attrib(specks, "aCol", p.dots.col, 3, gl.UNSIGNED_BYTE, true);
          attrib(specks, "aSize", p.dots.size, 1);
          attrib(specks, "aA", p.dots.al, 1);
          gl.drawArrays(gl.POINTS, 0, p.dots.count);
          off(specks);
          gl.depthMask(true);
        }
      },
      dispose() { if (texture) gl.deleteTexture(texture); },
    };
  }

  window.TepeGL = { ground, make, project, matrix };
})();

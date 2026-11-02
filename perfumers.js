// ============================================================
// PERFUMERS — perfumers/index.html only (2026-11-02).
//
// The owner's picture 1 — a poster of a year round a circle — redrawn as
// PERFUMER → HOUSE → PERFUME, and their picture 2 — the same poster seen
// up close, tipped back, the near part sharp and the rest out of focus —
// as what a click does.
//
// WHAT IT DRAWS, from the middle out (world units: the chart is about
// 2,300 across; R below):
//   THE GLOBE     a sphere of specks turning slowly, lit from the upper
//                 left, with a few gold lights on its night side — the
//                 poster's Earth at night — and a ring of gold dust round
//                 it in the plane of the chart.
//   THE BAND      a segment for each group round the globe: a perfumer
//                 (A–Z) or a year (By year).
//   THE SPOKES    one line out from the band for every perfume, ending in
//                 its dot at ITS YEAR — the rings are years, 2009 nearest
//                 the middle and 2026 furthest out; a perfume no source
//                 dates ends hollow on the dashed ring beyond them. The
//                 line says how sure its perfumer is (solid: named;
//                 dashed: the house's perfumer; dotted: not found); the dot
//                 says what it is (gold: an individual fragrance written
//                 about here; blue-white: a house perfume written about
//                 here; rose: Prin Lomros' houses, not written about here).
//   THE NAMES     each group's name in spaced capitals along the rim, as
//                 the poster's months are, and its houses smaller under it.
//   THE RIM       every perfume's number and year, as the poster's days.
//   THE LABELS    every perfume's name written out past the rim, its house
//                 after it, on a drift of dust.
//
// THE CAMERA. Everything is projected through one camera — a focus point,
// a zoom, a turn and a tilt, with perspective — so the same drawing is the
// flat poster at rest and picture 2 up close. Text is drawn letter-true in
// perspective by giving each piece of text the camera's own local
// stretch (its Jacobian) as its transform. A click flies the camera to the
// point clicked (`zoomTo`); once it has settled, a blurred copy of the
// drawing is laid over it with the part in focus cut out of it (`dof`),
// faded in, never redrawn every frame.
//
// THE SWITCH at the top right re-sorts the perfumes and sweeps every
// spoke round to its new place (`arrange`, `SORT_MS`).
//
// THE WINDOW: a perfumer, a house or a perfume, opened by a click on its
// name once zoomed in (or from the index at the foot of the page), with
// what is known of it and its sources, numbered.
//
// All of it reads window.PERFUMERS_DATA, written by tools/perfumers/build.py
// from tools/perfumers/LEDGER.md. Nothing here knows a perfume by name.
//
// prefers-reduced-motion: nothing moves — the globe stands still, the
// chart is simply there, the camera and the switch go at once.
// ============================================================
(function () {
  "use strict";

  const D = window.PERFUMERS_DATA;
  const stage = document.querySelector(".pf-stage");
  if (!D || !stage) return;
  const root = document.querySelector(".pf");
  const cvChart = stage.querySelector(".pf-chart");
  const cvDof = stage.querySelector(".pf-dof");
  const cvLive = stage.querySelector(".pf-live");
  const ctx = cvChart.getContext("2d");
  const dctx = cvDof.getContext("2d");
  const lctx = cvLive.getContext("2d");
  const tip = stage.querySelector(".pf-tip");
  const hint = stage.querySelector(".pf-hint");
  const backBtn = stage.querySelector(".pf-back");
  const sortBtns = Array.from(stage.querySelectorAll(".pf-sort-button"));
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- THE GEOMETRY, in world units -----------------------------------
  const R = {
    sphere: 112, hazeIn: 122, hazeOut: 176,
    band0: 184, band1: 198,
    base: 214,                 // where every spoke leaves from
    y0: 250, y1: 640,          // 2008 … 2026
    und: 686,                  // the ring of perfumes with no year found
    group: 716, house: 732,    // the names along the rim
    tick0: 742, tick1: 751,    // the rim's ticks
    num: 757,                  // the rim's numbers
    label: 826,                // the names past the rim
    dust0: 800, dust1: 1160,
    fit: 1180,                 // what the whole chart is fitted to
  };
  const Y_FROM = 2008, Y_TO = 2026;
  const GAP = 2.4;             // slots of gap before each group
  const SORT_MS = 1700, CAM_MS = 1500, INTRO_MS = 2100;
  const TILT = 0.94;           // how far a zoom tips the chart back
  const FOCUS_X = 0.43, FOCUS_Y = 0.56;
  const COL = {
    gold: "235,163,63", blue: "188,211,234", rose: "226,88,126",
    ink: "235,232,226", muted: "141,143,146",
  };
  const F = {
    label: '400 20px Archivo, "Segoe UI", sans-serif',
    labelHere: '600 20px Archivo, "Segoe UI", sans-serif',
    group: '700 20px Archivo, "Segoe UI", sans-serif',
    mono: '400 20px "IBM Plex Mono", ui-monospace, monospace',
  };
  const FPX = 20;
  const TAU = Math.PI * 2;

  // ---- THE DATA --------------------------------------------------------
  const PER = {}; D.perfumers.forEach((p) => (PER[p.id] = p));
  const HOU = {}; D.houses.forEach((h) => (HOU[h.id] = h));
  const SRC = {}; D.sources.forEach((s) => (SRC[s.id] = s));
  const cmp = (a, b) => String(a).localeCompare(String(b), "en", { sensitivity: "base" });
  const perSort = (id) => (id === "not-found" ? "￿" : (PER[id].sort || PER[id].name));

  const entries = [];
  D.perfumes.forEach((p) => {
    p.p.forEach((pid) => {
      entries.push({
        p, pid,
        tone: p.k === "individual" ? "gold" : p.k === "house" ? "blue" : "rose",
        a: 0, from: 0, to: 0, no: 0,
        rDot: p.y ? R.y0 + ((p.y - Y_FROM) / (Y_TO - Y_FROM)) * (R.y1 - R.y0) : R.und,
        withWho: false,
      });
    });
  });
  const N = entries.length;
  const yearR = (y) => R.y0 + ((y - Y_FROM) / (Y_TO - Y_FROM)) * (R.y1 - R.y0);

  // ---- ARRANGING: A–Z or by year --------------------------------------
  let mode = "az";
  try { if (localStorage.getItem("pf-sort") === "year") mode = "year"; } catch (e) { /* no storage */ }
  let groups = [], oldGroups = [];
  let order = entries.slice();
  let slot = 0, gapAngle = 0;
  let sortT0 = -1;

  function arrange(m, animate) {
    const list = entries.slice();
    const byWho = (x, y) => cmp(perSort(x.pid), perSort(y.pid)) || cmp(HOU[x.p.h].name, HOU[y.p.h].name) || cmp(x.p.n, y.p.n);
    if (m === "az") list.sort(byWho);
    else list.sort((x, y) => (x.p.y || 9999) - (y.p.y || 9999) || byWho(x, y));
    const keyOf = (e) => (m === "az" ? e.pid : (e.p.y || "none"));
    const gs = [];
    list.forEach((e) => {
      const k = keyOf(e);
      if (!gs.length || gs[gs.length - 1].key !== k) gs.push({ key: k, members: [] });
      gs[gs.length - 1].members.push(e);
    });
    slot = TAU / (N + gs.length * GAP);
    gapAngle = -Math.PI / 2 + (slot * GAP) / 2;
    let i = 0;
    gs.forEach((g, gi) => {
      const first = i;
      g.members.forEach((e) => {
        e.from = e.a;
        e.to = -Math.PI / 2 + ((gi + 1) * GAP + i + 0.5) * slot;
        e.no = i + 1;
        i++;
      });
      g.a0 = g.members[0].to - slot / 2;
      g.a1 = g.members[g.members.length - 1].to + slot / 2;
      g.label = m === "az" ? PER[g.key].name : g.key === "none" ? "Year not found" : String(g.key);
      g.id = m === "az" ? g.key : null;
      g.first = first;
      // the houses inside it, for the smaller names and the square markers
      g.houses = [];
      g.members.forEach((e) => {
        const last = g.houses[g.houses.length - 1];
        if (!last || last.h !== e.p.h) g.houses.push({ h: e.p.h, members: [e] });
        else last.members.push(e);
      });
      g.houses.forEach((h) => {
        h.a0 = h.members[0].to - slot / 2;
        h.a1 = h.members[h.members.length - 1].to + slot / 2;
      });
    });
    oldGroups = animate ? groups : [];
    groups = gs;
    order = list;
    measureGroups();
    if (animate && !STILL) sortT0 = performance.now();
    else { entries.forEach((e) => (e.a = e.to)); sortT0 = -1; oldGroups = []; }
    dirty = true;
    kick();
  }

  // ---- THE CANVASES ----------------------------------------------------
  let W = 0, H = 0, DPR = 1, fitZ = 1;
  const cam = { fx: 0, fy: 0, z: 1, rot: 0, tilt: 0, cx: 0.5, cy: 0.5 };
  let camFrom = null, camTo = null, camT0 = -1;
  let zoomed = false;

  function overview() {
    return { fx: 0, fy: 0, z: fitZ, rot: 0, tilt: 0, cx: 0.5, cy: 0.5 };
  }

  function resize() {
    W = stage.clientWidth; H = stage.clientHeight;
    DPR = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
    [cvChart, cvDof, cvLive].forEach((c) => { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); });
    // Where the notes stand over the stage (a wide window), the chart is
    // fitted between their columns, never under them.
    let room = Math.min(W, H);
    const cols = Array.from(document.querySelectorAll(".pf-notes-col"));
    if (cols.length && getComputedStyle(cols[0].parentNode).position === "absolute") {
      const sb = stage.getBoundingClientRect();
      let side = 0;
      cols.forEach((col) => {
        const b = col.getBoundingClientRect();
        if (!b.width) return;
        side = Math.max(side, b.left - sb.left < W / 2 ? b.right - sb.left : sb.right - b.left);
      });
      room = Math.min(room, W - 2 * (side + 12));
    }
    fitZ = Math.max(80, room) / (2 * R.fit);
    if (!zoomed) { Object.assign(cam, overview()); camT0 = -1; }
    widths.clear();
    dofOff();
    dirty = true;
    kick();
  }

  // ---- THE PROJECTION ---------------------------------------------------
  const PJ = { c: 1, s: 0, ct: 1, st: 0, F: 1000, cx: 0, cy: 0 };
  function prep() {
    PJ.c = Math.cos(cam.rot); PJ.s = Math.sin(cam.rot);
    PJ.ct = Math.cos(cam.tilt); PJ.st = Math.sin(cam.tilt);
    PJ.F = 1.25 * Math.max(H, 400);
    PJ.cx = cam.cx * W; PJ.cy = cam.cy * H;
  }
  // world (x, y) -> screen; o.ok is false behind the eye.
  function proj(x, y, o) {
    const dx = x - cam.fx, dy = y - cam.fy;
    const u = (dx * PJ.c - dy * PJ.s) * cam.z;
    const v = (dx * PJ.s + dy * PJ.c) * cam.z;
    const d = PJ.F - v * PJ.st;
    if (d < PJ.F * 0.16) { o.ok = false; return o; }
    const k = PJ.F / d;
    o.x = PJ.cx + u * k; o.y = PJ.cy + v * PJ.ct * k; o.k = k; o.ok = true;
    return o;
  }
  // screen -> world, on the chart's plane; null above its horizon.
  function unproj(X, Y) {
    const xs = X - PJ.cx, ys = Y - PJ.cy;
    const den = PJ.ct * PJ.F + ys * PJ.st;
    if (den <= 1e-6) return null;
    const v = (ys * PJ.F) / den;
    const u = (xs * (PJ.F - v * PJ.st)) / PJ.F;
    const uu = u / cam.z, vv = v / cam.z;
    return { x: cam.fx + uu * PJ.c + vv * PJ.s, y: cam.fy - uu * PJ.s + vv * PJ.c };
  }
  const T0 = {}, T1 = {}, T2 = {};

  // ---- TEXT, true to the perspective -----------------------------------
  const widths = new Map();
  function wOf(c, font, txt) {
    const key = font + "|" + txt;
    let w = widths.get(key);
    if (w === undefined) { c.font = font; w = c.measureText(txt).width; widths.set(key, w); }
    return w;
  }
  let texture = [];
  // Draw txt with its start (or centre) at world (x, y), reading along world
  // angle `ang`, `size` world units tall. Returns false if not drawn.
  function textAt(c, x, y, ang, txt, size, align, font) {
    const ux = Math.cos(ang), uy = Math.sin(ang);
    proj(x, y, T0); if (!T0.ok) return false;
    proj(x + ux, y + uy, T1); if (!T1.ok) return false;
    proj(x - uy, y + ux, T2); if (!T2.ok) return false;
    const jux = T1.x - T0.x, juy = T1.y - T0.y, jvx = T2.x - T0.x, jvy = T2.y - T0.y;
    const tall = Math.hypot(jvx, jvy) * size;
    const wWorld = (wOf(c, font, txt) * size) / FPX;
    let sx = T0.x, sy = T0.y;
    if (align === "center") { sx -= (jux * wWorld) / 2; sy -= (juy * wWorld) / 2; }
    const ex = sx + jux * wWorld, ey = sy + juy * wWorld;
    const pad = 40;
    if (Math.max(sx, ex) < -pad || Math.min(sx, ex) > W + pad || Math.max(sy, ey) < -pad || Math.min(sy, ey) > H + pad) return false;
    if (tall < 1.7) { texture.push(sx, sy, ex, ey, tall); return true; }
    const s = size / FPX;
    c.setTransform(DPR * jux * s, DPR * juy * s, DPR * jvx * s, DPR * jvy * s, DPR * sx, DPR * sy);
    c.fillText(txt, 0, 0);
    return true;
  }
  function flushTexture(c, rgb, alpha) {
    if (!texture.length) return;
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.strokeStyle = "rgba(" + rgb + "," + alpha + ")";
    c.beginPath();
    let lw = 0;
    for (let i = 0; i < texture.length; i += 5) {
      c.moveTo(texture[i], texture[i + 1]); c.lineTo(texture[i + 2], texture[i + 3]);
      lw += texture[i + 4];
    }
    c.lineWidth = Math.max(0.5, (lw / (texture.length / 5)) * 0.55);
    c.stroke();
    texture = [];
  }
  // letters spaced round an arc, upright at the top and at the bottom
  function arcText(c, txt, r, mid, size, font, track) {
    const chars = Array.from(txt);
    const ws = chars.map((ch) => (wOf(c, font, ch) * size) / FPX);
    const gap = size * track;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    const bottom = Math.sin(mid + cam.rot) > 0.05;
    const dir = bottom ? -1 : 1;
    let a = mid - (dir * total) / (2 * r);
    for (let i = 0; i < chars.length; i++) {
      const ac = a + (dir * ws[i]) / (2 * r);
      const tan = ac + (dir * Math.PI) / 2;
      // centre the letter on the arc's radius (its middle, not its baseline)
      textAt(c, Math.cos(ac) * r, Math.sin(ac) * r, tan, chars[i], size, "center", font);
      a += (dir * (ws[i] + gap)) / r;
    }
    return total;
  }
  function arcFits(txt, r, a0, a1, size, font, track) {
    const chars = Array.from(txt);
    const total = chars.reduce((s, ch) => s + (wOf(ctx, font, ch) * size) / FPX, 0) + size * track * (chars.length - 1);
    return total < (a1 - a0) * r - 10;
  }

  function measureGroups() {
    groups.forEach((g) => {
      g.size = 15; g.text = g.label.toUpperCase();
      g.fits = arcFits(g.text, R.group, g.a0, g.a1, g.size, F.group, 0.32);
      if (!g.fits) { g.size = 10; g.fits = arcFits(g.text, R.group, g.a0, g.a1, g.size, F.group, 0.24); }
      g.houses.forEach((h) => {
        h.text = HOU[h.h].name.toUpperCase();
        h.fits = mode === "az" && arcFits(h.text, R.house, h.a0, h.a1, 6, F.mono, 0.18);
      });
      g.members.forEach((e) => (e.withWho = mode === "year" || !g.fits));
    });
  }

  // ---- THE STILL THINGS: dust, haze, the globe's specks ----------------
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const rand = rng(20261102);
  const dust = [];
  for (let i = 0; i < 2600; i++) {
    const t = rand();
    const r = R.dust0 + Math.pow(t, 1.6) * (R.dust1 - R.dust0);
    const a = rand() * TAU;
    dust.push(Math.cos(a) * r, Math.sin(a) * r, 0.5 + rand() * 1.4, 0.12 + rand() * 0.5 * (1 - t * 0.6));
  }
  const field = [];
  for (let i = 0; i < 380; i++) {
    const r = 220 + rand() * 1500, a = rand() * TAU;
    field.push(Math.cos(a) * r, Math.sin(a) * r, 0.4 + rand() * 1.0, 0.05 + rand() * 0.18);
  }
  const haze = [];
  for (let i = 0; i < 1100; i++) {
    const t = Math.pow(rand(), 1.7);
    const r = R.hazeIn + t * (R.hazeOut - R.hazeIn) + (rand() - 0.5) * 6;
    const a = rand() * TAU;
    // thicker on one side, as the poster's ring is
    const side = 0.55 + 0.45 * Math.cos(a - 2.3);
    if (rand() > side) continue;
    haze.push(Math.cos(a) * r, Math.sin(a) * r, 0.5 + rand() * 1.1, (0.2 + rand() * 0.6) * (1 - t * 0.7));
  }
  const globe = [];
  const GN = W < 700 ? 900 : 1500;
  for (let i = 0; i < GN; i++) {
    const y = 1 - (2 * (i + 0.5)) / GN, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
    globe.push(Math.cos(th) * r, y, Math.sin(th) * r, rand());
  }

  // ---- DRAWING THE CHART -------------------------------------------------
  let dirty = true, introT0 = -1, intro = STILL ? 1 : 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  function ring(c, r, a0, a1, step) {
    let pen = false;
    for (let a = a0; a <= a1 + 1e-9; a += step) {
      proj(Math.cos(a) * r, Math.sin(a) * r, T0);
      if (!T0.ok) { pen = false; continue; }
      if (!pen) { c.moveTo(T0.x, T0.y); pen = true; } else c.lineTo(T0.x, T0.y);
    }
  }
  function specks(c, arr, step, rgb, mul) {
    c.fillStyle = "rgb(" + rgb + ")";
    const zs = cam.z;
    for (let i = 0; i < arr.length; i += step) {
      proj(arr[i], arr[i + 1], T0);
      if (!T0.ok || T0.x < -4 || T0.x > W + 4 || T0.y < -4 || T0.y > H + 4) continue;
      const sz = Math.max(0.55, arr[i + 2] * zs * T0.k * 1.4);
      c.globalAlpha = arr[i + 3] * mul;
      c.fillRect(T0.x - sz / 2, T0.y - sz / 2, sz, sz);
    }
    c.globalAlpha = 1;
  }

  function drawChart(now) {
    prep();
    const c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cvChart.width, cvChart.height);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    const lw = clamp(0.8 * cam.z, 0.55, 2.4);
    const fade = intro;

    // the dust and the far field
    specks(c, field, 4, COL.ink, fade);
    specks(c, dust, 4, COL.ink, 0.85 * fade);

    // the years' rings
    c.lineWidth = Math.max(0.5, 0.6 * cam.z);
    for (let y = Y_FROM + 1; y <= Y_TO; y++) {
      c.beginPath(); ring(c, yearR(y), -Math.PI / 2, Math.PI * 1.5, 0.03);
      c.strokeStyle = "rgba(" + COL.ink + "," + ((y % 5 === 0 ? 0.13 : 0.06) * fade) + ")";
      c.stroke();
    }
    c.setLineDash([3, 4]);
    c.beginPath(); ring(c, R.und, -Math.PI / 2, Math.PI * 1.5, 0.02);
    c.strokeStyle = "rgba(" + COL.ink + "," + 0.2 * fade + ")"; c.stroke();
    c.setLineDash([]);
    c.beginPath(); ring(c, R.base, -Math.PI / 2, Math.PI * 1.5, 0.03);
    c.strokeStyle = "rgba(" + COL.ink + "," + 0.12 * fade + ")"; c.stroke();
    c.beginPath(); ring(c, R.tick1 + 1, -Math.PI / 2, Math.PI * 1.5, 0.02);
    c.strokeStyle = "rgba(" + COL.ink + "," + 0.16 * fade + ")"; c.stroke();

    // the gold haze round the globe
    specks(c, haze, 4, COL.gold, 0.9 * fade);

    // the years named up the gap at the top
    c.font = F.mono; c.textBaseline = "middle"; c.textAlign = "left";
    c.fillStyle = "rgba(" + COL.ink + "," + 0.42 * fade + ")";
    const ga = gapAngle;
    [2010, 2014, 2018, 2022, 2026].forEach((y) => {
      textAt(c, Math.cos(ga) * yearR(y), Math.sin(ga) * yearR(y) - 4, ga + Math.PI / 2, String(y), 6.5, "center", F.mono);
    });
    textAt(c, Math.cos(ga) * R.und, Math.sin(ga) * R.und - 4, ga + Math.PI / 2, "NO YEAR FOUND", 5.4, "center", F.mono);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);

    // the band round the globe: a segment a group
    const sortT = sortT0 < 0 ? 1 : clamp((now - sortT0) / SORT_MS, 0, 1);
    const gNew = sortT0 < 0 ? 1 : clamp(sortT * 2 - 1, 0, 1);
    const gOld = sortT0 < 0 ? 0 : clamp(1 - sortT * 2, 0, 1);
    c.lineCap = "butt";
    const band = (gs, alpha) => {
      if (alpha <= 0) return;
      c.lineWidth = Math.max(1, (R.band1 - R.band0) * cam.z * 0.9);
      gs.forEach((g, i) => {
        c.beginPath(); ring(c, (R.band0 + R.band1) / 2, g.a0 + slot * 0.3, g.a1 - slot * 0.3, 0.01);
        c.strokeStyle = "rgba(" + COL.ink + "," + (i % 2 ? 0.1 : 0.2) * alpha * fade + ")";
        c.stroke();
      });
    };
    band(oldGroups, gOld); band(groups, gNew);

    // the spokes, by tone and by credit
    const dashes = { named: [], house: [clamp(3.5 * cam.z, 2, 9), clamp(3 * cam.z, 2, 7)], none: [1, clamp(3 * cam.z, 2.4, 7)] };
    ["named", "house", "none"].forEach((cr) => {
      c.setLineDash(dashes[cr]);
      ["rose", "blue", "gold"].forEach((tone) => {
        c.beginPath();
        let any = false;
        for (let i = 0; i < order.length; i++) {
          const e = order[i];
          if (e.p.c !== cr || e.tone !== tone) continue;
          const g = growth(e);
          if (g <= 0) continue;
          const r1 = R.base + (e.rDot - R.base) * g;
          proj(Math.cos(e.a) * R.base, Math.sin(e.a) * R.base, T0);
          proj(Math.cos(e.a) * r1, Math.sin(e.a) * r1, T1);
          if (!T0.ok || !T1.ok) continue;
          c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y); any = true;
        }
        if (!any) return;
        c.lineWidth = lw;
        c.strokeStyle = "rgba(" + COL[tone] + "," + (tone === "rose" ? 0.42 : 0.6) + ")";
        c.stroke();
      });
    });
    c.setLineDash([]);

    // the dots
    for (let i = 0; i < order.length; i++) {
      const e = order[i];
      const g = growth(e);
      if (g < 0.98) continue;
      proj(Math.cos(e.a) * e.rDot, Math.sin(e.a) * e.rDot, T0);
      if (!T0.ok || T0.x < -20 || T0.x > W + 20 || T0.y < -20 || T0.y > H + 20) continue;
      const rr = Math.max(1.1, (e.tone === "rose" ? 3 : 3.8) * cam.z * T0.k);
      const col = COL[e.tone];
      if (e.p.y) {
        c.fillStyle = "rgba(" + col + ",0.16)";
        c.beginPath(); c.arc(T0.x, T0.y, rr * 2.6, 0, TAU); c.fill();
        c.fillStyle = "rgb(" + col + ")";
        c.beginPath(); c.arc(T0.x, T0.y, rr, 0, TAU); c.fill();
      } else {
        c.strokeStyle = "rgb(" + col + ")"; c.lineWidth = Math.max(0.7, rr * 0.4);
        c.beginPath(); c.arc(T0.x, T0.y, rr, 0, TAU); c.stroke();
      }
    }

    // the group names along the rim, and their houses
    c.textBaseline = "middle";
    const names = (gs, alpha) => {
      if (alpha <= 0) return;
      c.font = F.group;
      c.fillStyle = "rgba(" + COL.ink + "," + 0.92 * alpha * fade + ")";
      gs.forEach((g) => { if (g.fits) arcText(c, g.text, R.group, (g.a0 + g.a1) / 2, g.size, F.group, g.size > 12 ? 0.32 : 0.24); });
      flushTexture(c, COL.ink, 0.35 * alpha * fade);
      c.font = F.mono;
      c.fillStyle = "rgba(" + COL.ink + "," + 0.5 * alpha * fade + ")";
      gs.forEach((g) => g.houses.forEach((h) => { if (h.fits) arcText(c, h.text, R.house, (h.a0 + h.a1) / 2, 6, F.mono, 0.18); }));
      flushTexture(c, COL.ink, 0.2 * alpha * fade);
      c.setTransform(DPR, 0, 0, DPR, 0, 0);
      // a square where each house begins, a longer tick where each group does
      gs.forEach((g) => g.houses.forEach((h, hi) => {
        const a = h.a0 + slot * 0.5;
        proj(Math.cos(a) * (R.tick0 - 5), Math.sin(a) * (R.tick0 - 5), T0);
        if (!T0.ok) return;
        const sq = Math.max(1.2, 2.6 * cam.z * T0.k);
        c.fillStyle = "rgba(" + COL.ink + "," + (hi === 0 ? 0.85 : 0.45) * alpha * fade + ")";
        c.fillRect(T0.x - sq / 2, T0.y - sq / 2, sq, sq);
      }));
    };
    names(oldGroups, gOld); names(groups, gNew);

    // the rim: a tick, a number and a year for every perfume
    c.beginPath();
    for (let i = 0; i < order.length; i++) {
      const e = order[i];
      proj(Math.cos(e.a) * R.tick0, Math.sin(e.a) * R.tick0, T0);
      proj(Math.cos(e.a) * R.tick1, Math.sin(e.a) * R.tick1, T1);
      if (!T0.ok || !T1.ok) continue;
      c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y);
    }
    c.lineWidth = Math.max(0.5, 0.5 * cam.z);
    c.strokeStyle = "rgba(" + COL.ink + "," + 0.4 * fade + ")"; c.stroke();

    const labelsOn = clamp(intro * 1.6 - 0.6, 0, 1);
    if (labelsOn > 0) {
      c.font = F.mono;
      for (let i = 0; i < order.length; i++) {
        const e = order[i];
        const flip = Math.cos(e.a + cam.rot) < 0;
        const no = String(e.no).padStart(3, "0");
        const yr = e.p.y ? "’" + String(e.p.y).slice(2) : "—";
        c.fillStyle = "rgba(" + COL.ink + "," + 0.72 * labelsOn + ")";
        runText(c, e.a, R.num, flip, [[no, 5.6, F.mono, "rgba(" + COL.ink + "," + 0.72 * labelsOn + ")"], [" " + yr, 5.6, F.mono, "rgba(" + COL.muted + "," + 0.75 * labelsOn + ")"]]);
      }
      flushTexture(c, COL.ink, 0.25 * labelsOn);

      // the names past the rim
      for (let i = 0; i < order.length; i++) {
        const e = order[i];
        const flip = Math.cos(e.a + cam.rot) < 0;
        const here = !!e.p.at;
        const main = e.p.n;
        let sub = "  " + HOU[e.p.h].name;
        if (e.withWho && e.pid !== "not-found") sub += " · " + PER[e.pid].name;
        const a1 = here ? 0.94 : 0.6;
        runText(c, e.a, R.label, flip, [
          [main, 8.4, here ? F.labelHere : F.label, "rgba(" + (here ? COL.ink : COL.ink) + "," + a1 * labelsOn + ")"],
          [sub, 6.4, F.mono, "rgba(" + COL.muted + "," + 0.7 * labelsOn + ")"],
        ]);
      }
      flushTexture(c, COL.ink, 0.2 * labelsOn);
    }
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // Pieces of text one after another along a spoke at radius r, reading
  // outward — or, on the left of the circle, reading inward so nothing is
  // upside down, ending at r as the poster's do.
  function runText(c, a, r, flip, parts) {
    let total = 0;
    parts.forEach((p) => (p.w = (wOf(c, p[2], p[0]) * p[1]) / FPX));
    parts.forEach((p) => (total += p.w));
    const dir = flip ? a + Math.PI : a;
    let rr = flip ? r + total : r;
    const step = flip ? -1 : 1;
    for (const p of parts) {
      c.font = p[2]; c.fillStyle = p[3];
      textAt(c, Math.cos(a) * rr, Math.sin(a) * rr, dir, p[0], p[1], "left", p[2]);
      rr += step * p.w;
    }
  }

  function growth(e) {
    if (intro >= 1) return 1;
    const i = e.no / N;
    return ease(clamp(intro * 1.55 - i * 0.55, 0, 1));
  }

  // ---- THE OUT-OF-FOCUS COPY, once a zoom has settled ---------------------
  let dofDone = false;
  function dofOff() { cvDof.classList.remove("is-on"); dofDone = false; }
  function renderDof() {
    dofDone = true;
    if (!zoomed || STILL) return;
    const w = cvDof.width, h = cvDof.height;
    dctx.setTransform(1, 0, 0, 1, 0, 0);
    dctx.globalCompositeOperation = "source-over";
    dctx.clearRect(0, 0, w, h);
    dctx.fillStyle = "#0b0c0d";
    dctx.fillRect(0, 0, w, h);
    dctx.filter = "blur(" + (2.8 * DPR).toFixed(1) + "px)";
    dctx.drawImage(cvChart, 0, 0);
    dctx.filter = "none";
    // cut the part in focus back out, softly: a wide band through the
    // point flown to, as a lens close to a page has it
    dctx.globalCompositeOperation = "destination-out";
    const cx = cam.cx * w, cy = cam.cy * h;
    dctx.save();
    dctx.translate(cx, cy);
    dctx.rotate(-0.18);
    dctx.scale(1.9, 1);
    const rad = Math.max(w, h) * 0.3;
    const gr = dctx.createRadialGradient(0, 0, rad * 0.35, 0, 0, rad);
    gr.addColorStop(0, "rgba(0,0,0,1)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    dctx.fillStyle = gr;
    dctx.fillRect(-w, -h, w * 2, h * 2);
    dctx.restore();
    dctx.globalCompositeOperation = "source-over";
    cvDof.classList.add("is-on");
  }

  // ---- THE LIVE LAYER: the globe, and what the hand is on -----------------
  let hover = null;
  let globeAngle = 0;
  function drawLive(now, dt) {
    const c = lctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cvLive.width, cvLive.height);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    prep();
    // the globe
    proj(0, 0, T0);
    let visible = false;
    if (T0.ok) {
      const gr = R.sphere * cam.z * T0.k;
      if (T0.x + gr > 0 && T0.x - gr < W && T0.y + gr > 0 && T0.y - gr < H) {
        visible = true;
        if (!STILL) globeAngle += dt * 0.00007;
        drawGlobe(c, T0.x, T0.y, gr, clamp(intro * 2, 0, 1));
      }
    }
    if (hover) drawHover(c);
    return visible;
  }
  function drawGlobe(c, cx, cy, gr, alpha) {
    // a dark disc first, so the dust behind does not show through it
    const g0 = c.createRadialGradient(cx - gr * 0.35, cy - gr * 0.4, gr * 0.1, cx, cy, gr);
    g0.addColorStop(0, "rgba(40,46,56," + alpha + ")");
    g0.addColorStop(1, "rgba(8,9,11," + alpha + ")");
    c.fillStyle = g0;
    c.beginPath(); c.arc(cx, cy, gr, 0, TAU); c.fill();
    const ca = Math.cos(globeAngle), sa = Math.sin(globeAngle);
    const tilt = 0.41, ct = Math.cos(tilt), st = Math.sin(tilt);
    const lx = -0.55, ly = -0.55, lz = 0.63;
    const sz = Math.max(0.6, gr * 0.018);
    for (let i = 0; i < globe.length; i += 4) {
      let x = globe[i], y = globe[i + 1], z = globe[i + 2];
      const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
      if (z2 < -0.05) continue;
      const lit = x1 * lx + y2 * ly + z2 * lz;
      const px = cx + x1 * gr, py = cy + y2 * gr;
      if (lit > 0) {
        c.fillStyle = "rgba(" + COL.blue + "," + (0.18 + lit * 0.7) * z2 * alpha + ")";
        c.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      } else if (globe[i + 3] > 0.84) {
        // lights on the night side
        c.fillStyle = "rgba(" + COL.gold + "," + (0.35 + globe[i + 3] * 0.5) * z2 * alpha + ")";
        c.fillRect(px - sz / 2, py - sz / 2, sz * 1.2, sz * 1.2);
      }
    }
    // the rim of light
    c.strokeStyle = "rgba(" + COL.blue + "," + 0.35 * alpha + ")";
    c.lineWidth = Math.max(0.6, gr * 0.012);
    c.beginPath(); c.arc(cx, cy, gr, Math.PI * 0.85, Math.PI * 1.75); c.stroke();
  }
  function drawHover(c) {
    const list = hover.type === "entry" ? [hover.e] : hover.g.members;
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.textBaseline = "middle"; c.textAlign = "left";
    list.forEach((e) => {
      proj(Math.cos(e.a) * R.base, Math.sin(e.a) * R.base, T0);
      proj(Math.cos(e.a) * e.rDot, Math.sin(e.a) * e.rDot, T1);
      if (!T0.ok || !T1.ok) return;
      c.strokeStyle = "rgba(" + COL[e.tone] + ",0.95)";
      c.lineWidth = clamp(1.4 * cam.z, 1, 3.4);
      c.beginPath(); c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y); c.stroke();
      const rr = Math.max(2.2, 5.2 * cam.z * T1.k);
      c.beginPath(); c.arc(T1.x, T1.y, rr, 0, TAU); c.stroke();
    });
    if (hover.type === "entry") {
      const e = hover.e;
      const flip = Math.cos(e.a + cam.rot) < 0;
      runText(c, e.a, R.label, flip, [[e.p.n, 8.4, F.labelHere, "rgb(" + COL[e.tone] + ")"]]);
      texture = [];
      c.setTransform(DPR, 0, 0, DPR, 0, 0);
    } else {
      const g = hover.g;
      c.lineWidth = Math.max(1, (R.band1 - R.band0) * cam.z * 0.9);
      c.strokeStyle = "rgba(" + COL.gold + ",0.8)";
      c.beginPath(); ring(c, (R.band0 + R.band1) / 2, g.a0 + slot * 0.3, g.a1 - slot * 0.3, 0.01); c.stroke();
      if (g.fits) {
        c.fillStyle = "rgb(" + COL.gold + ")";
        arcText(c, g.text, R.group, (g.a0 + g.a1) / 2, g.size, F.group, g.size > 12 ? 0.32 : 0.24);
        texture = [];
      }
      c.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
  }

  // ---- THE CLOCK -------------------------------------------------------
  let raf = 0, last = 0, lastMove = 0, dragging = false;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(64, now - last) : 16;
    last = now;
    let moving = false;
    // the opening
    if (intro < 1) {
      if (introT0 < 0) introT0 = now;
      intro = clamp((now - introT0) / INTRO_MS, 0, 1);
      moving = true;
    }
    // the switch's sweep
    if (sortT0 >= 0) {
      const t = clamp((now - sortT0) / SORT_MS, 0, 1);
      for (let i = 0; i < order.length; i++) {
        const e = order[i];
        const local = ease(clamp(t * 1.4 - (i / N) * 0.4, 0, 1));
        e.a = e.from + (e.to - e.from) * local;
      }
      if (t >= 1) { sortT0 = -1; oldGroups = []; }
      moving = true;
    }
    // the camera's flight
    if (camT0 >= 0) {
      const t = clamp((now - camT0) / CAM_MS, 0, 1), k = ease(t);
      for (const key of ["fx", "fy", "z", "tilt", "cx", "cy"]) cam[key] = camFrom[key] + (camTo[key] - camFrom[key]) * k;
      cam.z = Math.exp(Math.log(camFrom.z) + (Math.log(camTo.z) - Math.log(camFrom.z)) * k);
      cam.rot = camFrom.rot + (camTo.rot - camFrom.rot) * k;
      if (t >= 1) { camT0 = -1; if (!zoomed) setZoomedClasses(false); }
      moving = true;
    }
    if (moving || dirty || dragging) { drawChart(now); dirty = false; lastMove = now; if (dofDone || cvDof.classList.contains("is-on")) dofOff(); }
    const globeOn = drawLive(now, dt);
    if (zoomed && !dofDone && !moving && !dragging && now - lastMove > 160) renderDof();
    if (moving || dragging || (globeOn && !STILL) || (zoomed && !dofDone) || dirty) kick();
  }

  // ---- THE CAMERA'S MOVES -----------------------------------------------
  function flyTo(target) {
    if (STILL) { Object.assign(cam, target); camT0 = -1; dirty = true; kick(); if (!zoomed) setZoomedClasses(false); return; }
    camFrom = Object.assign({}, cam);
    camTo = target;
    camT0 = performance.now();
    dofOff();
    kick();
  }
  function zoomLevel() { return Math.max(fitZ * 5.4, W < 700 ? 1.25 : 1.55); }
  function zoomTo(wx, wy) {
    const r = Math.hypot(wx, wy);
    if (r > R.fit) { wx *= R.fit / r; wy *= R.fit / r; }
    let rot = cam.rot;
    if (r > 150) {
      rot = -0.4 - Math.atan2(wy, wx);
      while (rot - cam.rot > Math.PI) rot -= TAU;
      while (rot - cam.rot < -Math.PI) rot += TAU;
    }
    zoomed = true;
    setZoomedClasses(true);
    flyTo({ fx: wx, fy: wy, z: zoomed && cam.z > fitZ * 2 ? cam.z : zoomLevel(), rot, tilt: TILT, cx: W < 700 ? 0.4 : FOCUS_X, cy: FOCUS_Y });
  }
  function zoomOut() {
    if (!zoomed) return;
    zoomed = false;
    hideTip(); hover = null;
    const o = overview();
    // come back the short way round
    o.rot = Math.round(cam.rot / TAU) * TAU;
    flyTo(o);
    // the rest of the page's words come back at once
    root.classList.remove("is-zoomed");
    backBtn.hidden = true;
    hint.textContent = "Click anywhere to look closer";
  }
  function setZoomedClasses(on) {
    stage.classList.toggle("is-zoomed", on);
    root.classList.toggle("is-zoomed", on);
    backBtn.hidden = !on;
    hint.textContent = on ? (W < 700 ? "Tap a name · drag to move" : "Click a name for more · drag to move · Esc for the whole chart") : "Click anywhere to look closer";
    if (!on) cam.rot = 0;
  }

  // ---- WHAT IS UNDER THE HAND --------------------------------------------
  function normAngle(a) { while (a < -Math.PI / 2) a += TAU; while (a >= Math.PI * 1.5) a -= TAU; return a; }
  function angDist(a, b) { let d = Math.abs(normAngle(a) - normAngle(b)); return d > Math.PI ? TAU - d : d; }
  function hit(X, Y) {
    prep();
    const w = unproj(X, Y);
    if (!w) return null;
    const r = Math.hypot(w.x, w.y);
    const th = Math.atan2(w.y, w.x);
    if (r < R.sphere) return null;
    const groupAt = () => groups.find((g) => angDist(th, (g.a0 + g.a1) / 2) <= (g.a1 - g.a0) / 2);
    if ((r >= R.band0 - 6 && r <= R.band1 + 6) || (r >= R.group - 14 && r <= R.house + 5)) {
      const g = groupAt();
      return g ? { type: "group", g } : null;
    }
    let best = null, bd = Infinity;
    for (const e of order) { const d = angDist(th, e.a); if (d < bd) { bd = d; best = e; } }
    if (!best) return null;
    if (r >= R.base - 4 && r <= best.rDot + 10) return bd * r < 7 ? { type: "entry", e: best } : null;
    if (r >= R.tick0 - 3) {
      const len = (wOf(ctx, F.labelHere, best.p.n) * 8.4) / FPX + 150;
      if (bd < slot * 0.6 && r <= R.label + len) return { type: "entry", e: best };
    }
    return null;
  }

  function tipFor(h) {
    if (h.type === "entry") {
      const e = h.e, p = e.p;
      const who = p.p.map((id) => PER[id].name).join(" & ");
      return "<b>" + esc(p.n) + "</b><span>" + esc(HOU[p.h].name) + " · " + (p.y || "year not found") + "</span><span>" + esc(who) + "</span>";
    }
    const g = h.g;
    const n = g.members.length;
    return "<b>" + esc(g.label) + "</b><span>" + n + (n === 1 ? " perfume" : " perfumes") + (g.id && zoomed ? " · click for more" : "") + "</span>";
  }
  function showTip(h, X, Y) {
    tip.innerHTML = tipFor(h);
    tip.hidden = false;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = X + 16, y = Y + 16;
    if (x + tw > W - 8) x = X - tw - 16;
    if (y + th > H - 8) y = Y - th - 16;
    tip.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
  }
  function hideTip() { tip.hidden = true; }

  // ---- THE HAND ----------------------------------------------------------
  let down = null;
  function local(ev) { const b = stage.getBoundingClientRect(); return { x: ev.clientX - b.left, y: ev.clientY - b.top }; }
  stage.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest("button, a")) return;
    const p = local(ev);
    down = { x: p.x, y: p.y, id: ev.pointerId, moved: false, world: zoomed ? unproj(p.x, p.y) : null, type: ev.pointerType };
  });
  stage.addEventListener("pointermove", (ev) => {
    const p = local(ev);
    if (down && zoomed && down.world) {
      if (!down.moved && Math.hypot(p.x - down.x, p.y - down.y) > 5) {
        down.moved = true; dragging = true;
        stage.classList.add("is-dragging");
        try { stage.setPointerCapture(down.id); } catch (e) { /* fine */ }
        camT0 = -1; hideTip(); hover = null;
      }
      if (down.moved) {
        prep();
        const now = unproj(p.x, p.y);
        if (now) { cam.fx += down.world.x - now.x; cam.fy += down.world.y - now.y; }
        dirty = true; kick();
        return;
      }
    }
    if (ev.pointerType === "touch") return;
    if (camT0 >= 0 || sortT0 >= 0) return;
    const h = hit(p.x, p.y);
    const same = h && hover && h.type === hover.type && (h.e || h.g) === (hover.e || hover.g);
    if (!same) { hover = h; kick(); }
    stage.classList.toggle("is-over", !!h && zoomed);
    if (h) showTip(h, p.x, p.y); else hideTip();
  });
  stage.addEventListener("pointerleave", () => { if (!dragging) { hover = null; hideTip(); kick(); } });
  function endDrag(ev) {
    if (!down) return;
    const p = local(ev);
    const was = down;
    down = null;
    if (was.moved) {
      dragging = false; stage.classList.remove("is-dragging");
      lastMove = performance.now(); kick();
      return;
    }
    if (ev.type === "pointercancel") return;
    click(p.x, p.y);
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  function click(X, Y) {
    prep();
    if (!zoomed) {
      const w = unproj(X, Y);
      if (w) zoomTo(w.x, w.y);
      return;
    }
    const h = hit(X, Y);
    if (h && h.type === "entry") { openCard("perfume", h.e.p, false); return; }
    if (h && h.type === "group" && h.g.id) { openCard("perfumer", h.g.id, false); return; }
    const w = unproj(X, Y);
    if (w) zoomTo(w.x, w.y);
  }

  stage.addEventListener("dblclick", (ev) => { if (zoomed) { ev.preventDefault(); zoomOut(); } });
  stage.addEventListener("wheel", (ev) => {
    if (!zoomed) return;
    ev.preventDefault();
    const p = local(ev);
    prep();
    const before = unproj(p.x, p.y);
    camT0 = -1;
    const nz = clamp(cam.z * Math.exp(-ev.deltaY * 0.0016), fitZ * 1.2, Math.max(4.5, zoomLevel() * 2.6));
    if (nz <= fitZ * 1.25 && ev.deltaY > 0) { zoomOut(); return; }
    cam.z = nz;
    prep();
    const after = unproj(p.x, p.y);
    if (before && after) { cam.fx += before.x - after.x; cam.fy += before.y - after.y; }
    dirty = true; dofOff(); kick();
  }, { passive: false });
  backBtn.addEventListener("click", zoomOut);
  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Escape") return;
    if (!card.hidden) { closeCard(); return; }
    if (zoomed) zoomOut();
  });

  // ---- THE SWITCH --------------------------------------------------------
  function pressSort(m) {
    sortBtns.forEach((b) => b.setAttribute("aria-pressed", b.dataset.sort === m ? "true" : "false"));
  }
  sortBtns.forEach((b) => b.addEventListener("click", () => {
    const m = b.dataset.sort;
    if (m === mode) return;
    mode = m;
    try { localStorage.setItem("pf-sort", m); } catch (e) { /* no storage */ }
    pressSort(m);
    hover = null; hideTip();
    dofOff();
    arrange(m, true);
  }));

  // ---- THE WINDOW ---------------------------------------------------------
  const card = document.querySelector(".pf-card");
  const sheet = card.querySelector(".pf-card-sheet");
  const body = card.querySelector(".pf-card-body");
  const cardBack = card.querySelector(".pf-card-back");
  const cardClose = card.querySelector(".pf-card-close");
  let stack = [], current = null, opener = null, closeTimer = 0;

  function esc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]); }
  const ROOT = window.SITE_ROOT || "../";

  function citeHtml(s) {
    const cite = esc(s.cite).replace(/\*(.+?)\*/g, "<cite>$1</cite>");
    const href = s.url.startsWith("SITE:") ? ROOT + s.url.slice(5) : s.url;
    const shown = s.url.startsWith("SITE:") ? "thetasteofaldehydes.com/" + s.url.slice(5) : s.url.replace(/^https?:\/\//, "");
    return cite + ' <a href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(shown) + "</a>";
  }
  // number a card's sources in the order it first cites them
  function numberer() {
    const ids = [];
    return {
      ref(list) {
        return (list || []).map((id) => {
          let n = ids.indexOf(id);
          if (n < 0) { ids.push(id); n = ids.length - 1; }
          return '<a class="pf-card-ref" href="#" data-ref="' + (n + 1) + '">' + (n + 1) + "</a>";
        }).join("");
      },
      add(list) { (list || []).forEach((id) => { if (ids.indexOf(id) < 0) ids.push(id); }); },
      list() {
        if (!ids.length) return "";
        return '<h3 class="pf-card-sub">Sources</h3><ol class="pf-card-sources">' + ids.map((id, i) =>
          '<li data-n="' + (i + 1) + '"><b>' + (i + 1) + "</b>" + (SRC[id] ? citeHtml(SRC[id]) : esc(id)) + "</li>").join("") + "</ol>";
      },
    };
  }
  const perfumesOf = (pid) => D.perfumes.filter((p) => p.p.includes(pid));
  const housesOf = (list) => {
    const m = new Map();
    list.forEach((p) => { if (!m.has(p.h)) m.set(p.h, []); m.get(p.h).push(p); });
    return Array.from(m.entries()).sort((a, b) => cmp(HOU[a[0]].name, HOU[b[0]].name));
  };
  function chips(list) {
    return '<ul class="pf-card-chips">' + list.slice().sort((a, b) => (a.y || 9999) - (b.y || 9999) || cmp(a.n, b.n)).map((p) =>
      '<li><button type="button" class="pf-card-chip' + (p.at ? " is-here" : "") + '" data-perfume="' + D.perfumes.indexOf(p) + '">' +
      esc(p.n) + " <i>" + (p.y || "—") + "</i></button></li>").join("") + "</ul>";
  }
  const perfumerButton = (id) => '<button type="button" class="pf-card-link" data-perfumer="' + esc(id) + '">' + esc(PER[id].name) + "</button>";
  const houseButton = (id) => '<button type="button" class="pf-card-link" data-house="' + esc(id) + '">' + esc(HOU[id].name) + "</button>";

  function renderPerfumer(id) {
    const p = PER[id], S = numberer();
    const mine = perfumesOf(id);
    const here = mine.filter((x) => x.at).length;
    const houses = housesOf(mine);
    const sorted = D.perfumers.filter((x) => x.id !== "not-found").sort((a, b) => cmp(a.sort || a.name, b.sort || b.name));
    const idx = sorted.indexOf(p);
    const meta = [];
    if (p.born) meta.push("Born <b>" + esc(p.born) + "</b>");
    if (p.from) meta.push(esc(p.from));
    meta.push("<b>" + mine.length + "</b> " + (mine.length === 1 ? "perfume" : "perfumes") + " on the chart");
    if (here !== mine.length) meta.push("<b>" + here + "</b> written about here");
    const about = (p.about || []).map((a) => esc(a.t) + S.ref(a.s)).join(" ");
    let h = '<p class="pf-card-kicker">' + (id === "not-found" ? "Not found" : "Perfumer · " + String(idx + 1).padStart(2, "0") + " of " + sorted.length) + "</p>";
    h += '<h2 class="pf-card-name" id="pf-card-name">' + esc(p.name) + "</h2>";
    h += '<p class="pf-card-meta">' + meta.join(" · ") + "</p>";
    if (about) h += '<div class="pf-card-about"><p>' + about + "</p></div>";
    h += '<h3 class="pf-card-sub">' + (houses.length === 1 ? "House & perfumes" : "Houses & perfumes") + "</h3>";
    houses.forEach(([hid, list]) => { h += '<div class="pf-card-house">' + houseButton(hid) + chips(list) + "</div>"; });
    mine.forEach((x) => S.add(x.s));
    h += S.list();
    return h;
  }
  const CREDIT = {
    named: "A source names its perfumer.",
    house: "Credited to the house's own perfumer — no source names the nose of this one.",
    none: "No source found names its perfumer.",
  };
  function renderPerfume(p) {
    const S = numberer();
    const e = entries.find((x) => x.p === p);
    let h = '<p class="pf-card-kicker">Perfume · No. ' + String(e ? e.no : 0).padStart(3, "0") + "</p>";
    h += '<h2 class="pf-card-name" id="pf-card-name">' + esc(p.n) + S.ref(p.s) + "</h2>";
    h += '<p class="pf-card-meta">' + houseButton(p.h) + " · " + (p.y ? "<b>" + p.y + "</b>" : "year not found") + "</p>";
    h += '<h3 class="pf-card-sub">' + (p.p.length > 1 ? "Perfumers" : "Perfumer") + "</h3>";
    h += '<p class="pf-card-people">' + p.p.map(perfumerButton).join("") + "</p>";
    h += '<p class="pf-card-meta">' + esc(CREDIT[p.c] || "") + "</p>";
    if (p.note) h += '<p class="pf-card-note">' + esc(p.note) + "</p>";
    if (p.at) h += '<a class="pf-card-go" href="' + esc(ROOT + p.at) + '">Read it on this site →</a>';
    h += S.list();
    return h;
  }
  function renderHouse(id) {
    const ho = HOU[id], S = numberer();
    const list = D.perfumes.filter((p) => p.h === id);
    const who = Array.from(new Set(list.flatMap((p) => p.p)));
    const meta = [];
    if (ho.founded) meta.push("Founded <b>" + esc(ho.founded) + "</b>");
    if (ho.from) meta.push(esc(ho.from));
    meta.push("<b>" + list.length + "</b> on the chart");
    let h = '<p class="pf-card-kicker">House</p>';
    h += '<h2 class="pf-card-name" id="pf-card-name">' + esc(ho.name) + "</h2>";
    h += '<p class="pf-card-meta">' + meta.join(" · ") + "</p>";
    if (ho.about) h += '<div class="pf-card-about"><p>' + esc(ho.about) + S.ref(ho.s) + "</p></div>";
    h += '<h3 class="pf-card-sub">' + (who.length > 1 ? "Perfumers" : "Perfumer") + '</h3><p class="pf-card-people">' + who.map(perfumerButton).join("") + "</p>";
    h += '<h3 class="pf-card-sub">Perfumes</h3>' + chips(list);
    if (ho.page) h += '<a class="pf-card-go" href="' + esc(ROOT + ho.page) + '">Go to the house →</a>';
    list.forEach((p) => S.add(p.s));
    h += S.list();
    return h;
  }
  function render(item) {
    if (item.kind === "perfumer") return renderPerfumer(item.id);
    if (item.kind === "house") return renderHouse(item.id);
    return renderPerfume(item.id);
  }
  function openCard(kind, id, push) {
    const item = { kind, id };
    hideTip();
    clearTimeout(closeTimer);
    if (card.hidden || !card.classList.contains("is-open")) {
      stack = [];
      opener = document.activeElement;
      body.innerHTML = render(item);
      current = item;
      card.hidden = false;
      void card.offsetWidth;
      card.classList.add("is-open");
      sheet.scrollTop = 0; card.scrollTop = 0;
      sheet.focus({ preventScroll: true });
    } else {
      if (push && current) stack.push(current);
      swap(item);
    }
    cardBack.hidden = !stack.length;
  }
  function swap(item) {
    current = item;
    if (STILL) { body.innerHTML = render(item); card.scrollTop = 0; return; }
    body.classList.add("is-swapping");
    setTimeout(() => {
      body.innerHTML = render(item);
      card.scrollTop = 0;
      body.classList.remove("is-swapping");
    }, 180);
  }
  function closeCard() {
    card.classList.remove("is-open");
    closeTimer = setTimeout(() => { card.hidden = true; body.innerHTML = ""; }, STILL ? 0 : 450);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  card.addEventListener("click", (ev) => {
    if (!sheet.contains(ev.target)) { closeCard(); return; }
    const ref = ev.target.closest("[data-ref]");
    if (ref) {
      ev.preventDefault();
      const li = body.querySelector('.pf-card-sources li[data-n="' + ref.dataset.ref + '"]');
      if (li) {
        body.querySelectorAll(".pf-card-sources li.is-lit").forEach((x) => x.classList.remove("is-lit"));
        li.classList.add("is-lit");
        li.scrollIntoView({ block: "center", behavior: STILL ? "auto" : "smooth" });
      }
      return;
    }
    const per = ev.target.closest("[data-perfumer]");
    if (per) { openCard("perfumer", per.dataset.perfumer, true); return; }
    const ho = ev.target.closest("[data-house]");
    if (ho) { openCard("house", ho.dataset.house, true); return; }
    const pe = ev.target.closest("[data-perfume]");
    if (pe) { openCard("perfume", D.perfumes[+pe.dataset.perfume], true); return; }
  });
  cardClose.addEventListener("click", closeCard);
  cardBack.addEventListener("click", () => {
    const prev = stack.pop();
    if (prev) swap(prev);
    cardBack.hidden = !stack.length;
  });

  // the index at the foot of the page opens the same window
  document.querySelectorAll(".pf-entry").forEach((art) => {
    const id = art.id.replace(/^perfumer-/, "");
    const h = art.querySelector(".pf-entry-name");
    if (!h || !PER[id]) return;
    h.setAttribute("role", "button");
    h.tabIndex = 0;
    h.addEventListener("click", () => openCard("perfumer", id, false));
    h.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); openCard("perfumer", id, false); } });
  });
  const counts = document.querySelector("[data-counts]");
  if (counts && D.counts) {
    counts.textContent = D.counts.perfumes + " perfumes · " + D.counts.onSite + " written about here · " +
      D.counts.perfumers + " perfumers · " + D.counts.houses + " houses";
  }

  // ---- BEGIN -------------------------------------------------------------
  pressSort(mode);
  window.addEventListener("resize", resize);
  resize();
  arrange(mode, false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { widths.clear(); measureGroups(); dirty = true; kick(); });
  kick();

  // for whoever needs to look at it from outside
  window.PerfumersChart = {
    zoomTo, zoomOut,
    arrange: (m) => { mode = m; pressSort(m); arrange(m, true); },
    state: () => ({ zoomed, mode, n: N, cam: Object.assign({}, cam) }),
    open: openCard,
  };
})();

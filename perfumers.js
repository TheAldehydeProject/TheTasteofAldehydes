// ============================================================
// PERFUMERS — perfumers/index.html only (2026-11-02; rebuilt the same day,
// later — "turn slowly; and have idle animations ... When you click and zoom
// in, i want you to be in a fixed place, where you cannot use the
// scrollwheel. instead of the legend ... a fixed list of perfumers that you
// can scroll. alphabetical ... when you select something, you select the
// perfumer then the houses appear ... optimize tf out of it").
//
// The owner's picture 1 — a poster of a year round a circle — redrawn as
// PERFUMER → HOUSE → PERFUME, and their picture 2 — the same poster seen
// up close, tipped back, the near part sharp and the rest out of focus —
// as what choosing something does.
//
// WHAT IT DRAWS, from the middle out (world units: the chart is about
// 2,300 across; R below):
//   THE GLOBE     a sphere of specks turning, lit from the upper left, with
//                 lights on its night side, and a ring of gold dust round it.
//   THE BAND      a segment for each group round the globe: a perfumer
//                 (A–Z) or a year (By year), and a glint running round it.
//   THE SPOKES    one line out from the band for every perfume, ending in
//                 its dot at ITS YEAR — the rings are years, 2009 nearest
//                 the middle and 2026 furthest out; a perfume no source
//                 dates ends hollow on the dashed ring beyond them. The
//                 line says how sure its perfumer is (solid: named; dashed:
//                 the house's perfumer; dotted: not found); the dot says what
//                 it is (gold: an individual fragrance written about here;
//                 blue-white: a house perfume written about here; rose:
//                 Prin Lomros' houses, not written about here). Now and then
//                 a light runs out along one and its dot flares.
//   THE NAMES     each group's name in spaced capitals along the rim — and,
//                 for a chosen perfumer, its HOUSES in its name's place.
//   THE RIM       a tick for every perfume; its number and year are written
//                 only for what is chosen, a faint line for the rest.
//   THE LABELS    every perfume's name past the rim — written out only for
//                 what is chosen, the poster's faint lines for the rest
//                 ("all the information doesnt have to be there from the
//                 zoomed out view").
//
// CHOOSING: a perfumer (on the circle, or in THE LIST down the right, A to
// Z), then one of its houses, then a perfume, which opens its window. The
// camera flies to what is chosen and STAYS there — no wheel, no drag ("a
// fixed place") — the page held still under it; Esc, the list or "The whole
// chart" go back up. By year, the circle's groups are years.
//
// HOW IT IS KEPT SMOOTH — three layers, so that nothing is drawn again only
// because it moves:
//   THE ROTOR   (.pf-rotor) the whole chart at rest, drawn ONCE into a
//               square canvas that the browser TURNS by its transform: the
//               slow turn costs nothing a frame.
//   THE SWAY    (.pf-sway) the chart in perspective — drawn every frame only
//               while the camera flies; close in, drawn once, with its
//               out-of-focus copy, and SWAYED by its transform, slowly.
//   THE LIVE    (.pf-live) what moves of itself, all of it small: the globe,
//               the far field and the dust drifting, the lights on the
//               spokes, the glint, the names while the chart turns (so they
//               never stand upside down), what the hand is on.
// data-view on the stage says which: "turn", "live" (flying) or "still".
// Nothing is drawn while the chart is off the screen, the tab is hidden or
// a window is open over it. Every speck is drawn in one colour at a varied
// globalAlpha, every line batched, every glyph's width measured once.
//
// THE CAMERA: a focus point, a zoom, a turn and a tilt, with perspective,
// eased by two springs one behind the other (`stepCam`) — so a flight sets
// off gently, lands gently, and turns smoothly when it is sent somewhere
// else on the way.
//
// All of it reads window.PERFUMERS_DATA, written by tools/perfumers/build.py
// from tools/perfumers/LEDGER.md. Nothing here knows a perfume by name.
//
// prefers-reduced-motion: nothing moves of itself — the chart does not
// turn or sway, no lights run, the globe stands still, the camera and the
// switch go at once.
// ============================================================
(function () {
  "use strict";

  const D = window.PERFUMERS_DATA;
  const stage = document.querySelector(".pf-stage");
  if (!D || !stage) return;
  const root = document.querySelector(".pf");
  const rotor = stage.querySelector(".pf-rotor");
  const cvTurn = stage.querySelector(".pf-turn");
  const swayBox = stage.querySelector(".pf-sway");
  const cvChart = stage.querySelector(".pf-chart");
  const cvDof = stage.querySelector(".pf-dof");
  const cvLive = stage.querySelector(".pf-live");
  const tctx = cvTurn.getContext("2d");
  const ctx = cvChart.getContext("2d");
  const dctx = cvDof.getContext("2d");
  const lctx = cvLive.getContext("2d");
  // the chart while the camera flies, drawn at a lower resolution — every
  // frame of a flight is a whole new drawing, and on a sharp screen most of
  // its cost is pixels no one can see while it moves; it is drawn sharp
  // again the frame it lands (2026-11-03 — "make the animation smoother")
  const cvFly = document.createElement("canvas");
  cvFly.className = "pf-fly";
  swayBox.insertBefore(cvFly, cvChart);
  const fctx = cvFly.getContext("2d");
  let FLY_K = 1, flying = false;
  const mctx = document.createElement("canvas").getContext("2d");
  const title = stage.querySelector(".pf-title");
  const tip = stage.querySelector(".pf-tip");
  const hint = stage.querySelector(".pf-hint");
  const backBtn = stage.querySelector(".pf-back");
  const here = stage.querySelector(".pf-here");
  const nav = stage.querySelector(".pf-nav");
  const navList = nav.querySelector(".pf-nav-list");
  const navScroll = nav.querySelector(".pf-nav-scroll");
  const navToggle = nav.querySelector(".pf-nav-toggle");
  const navPath = nav.querySelector(".pf-nav-path");
  const sortBtns = Array.from(stage.querySelectorAll(".pf-sort-button"));
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PHONE = window.matchMedia("(max-width: 700px)");
  const TAU = Math.PI * 2;

  // ---- THE GEOMETRY, in world units -----------------------------------
  const R = {
    sphere: 112, hazeIn: 122, hazeOut: 176,
    band0: 184, band1: 198,
    base: 214,                 // where every spoke leaves from
    y0: 250, y1: 640,          // 2008 … 2026
    und: 686,                  // the ring of perfumes with no year found
    group: 716,                // the names along the rim
    tick0: 742, tick1: 751,    // the rim's ticks
    num: 757,                  // the rim's numbers
    label: 826,                // the names past the rim
    dust0: 800, dust1: 1160,
    fit: 1180,                 // what the whole chart is fitted to
    look: 760,                 // the radius a close look is centred on
  };
  const Y_FROM = 2008, Y_TO = 2026;
  const GAP = 2.4;             // slots of gap before each group
  const SORT_MS = 1700, INTRO_MS = 2100, EM_MS = 650;
  const TILT = 0.94;           // how far a close look tips the chart back
  const TURN_S = 260;          // seconds the chart takes to turn once, at rest
  const SPIN = TAU / TURN_S;
  const SPRING = 5.8;          // the camera's two springs (per second) — gentler since 2026-11-03 ("make the animation smoother")
  const REST_PX = 0.35;        // the camera is at rest once nothing is left to move by more than this
  const DIM = 0.2;             // what is not chosen, of itself
  const AROUND = 0.46;         // the rest of a chosen perfume's house, of itself
  const MAX_FRAME = 2.2;       // radians: a choice wider than this is looked at where most of it is
  const FLIP = 0.07;           // a name on the rim turns over across this band, crossfading
  // a perfume's window (2026-11-03): lit first, then the window drawn out of it
  const CALL_AFTER = 560;      // ms the perfume is lit before its window comes
  const CALL_WAIT = 2400;      // at most this long waiting for the chart to settle
  const CALL_LINE_MS = 320;    // the line drawn out to the window
  const CALL_GAP = 46;         // from the dot to the window, about
  // the sway close in: a slow roll about the point looked at, a breath of
  // scale, a drift of a few pixels — the browser's to draw (`swayBox`)
  const SWAY = { roll: 0.03, roll2: 0.011, breath: 0.011, dx: 7, dy: 4, rollHz: 1 / 27, roll2Hz: 1 / 11.5, breathHz: 1 / 19, driftHz: 1 / 23 };
  const RGB = { gold: "235,163,63", blue: "188,211,234", rose: "226,88,126", ink: "235,232,226", muted: "141,143,146" };
  const SOLID = {}; Object.keys(RGB).forEach((k) => (SOLID[k] = "rgb(" + RGB[k] + ")"));
  const GROUND = "#0b0c0d";
  const F = {
    label: '400 20px Archivo, "Segoe UI", sans-serif',
    labelHere: '600 20px Archivo, "Segoe UI", sans-serif',
    group: '700 20px Archivo, "Segoe UI", sans-serif',
    house: '500 20px "IBM Plex Mono", ui-monospace, monospace',
    mono: '400 20px "IBM Plex Mono", ui-monospace, monospace',
  };
  const FPX = 20;
  const TONES = ["rose", "blue", "gold"];
  const CREDITS = ["named", "house", "none"];
  const LV = 8;                // the levels emphasis is batched in

  // ---- THE DATA --------------------------------------------------------
  const PER = {}; D.perfumers.forEach((p) => (PER[p.id] = p));
  const HOU = {}; D.houses.forEach((h) => (HOU[h.id] = h));
  const SRC = {}; D.sources.forEach((s) => (SRC[s.id] = s));
  const cmp = (a, b) => String(a).localeCompare(String(b), "en", { sensitivity: "base" });
  const perSort = (id) => (id === "not-found" ? "￿" : (PER[id].sort || PER[id].name));
  const yearKey = (e) => e.p.y || "none";

  const entries = [];
  D.perfumes.forEach((p) => {
    p.p.forEach((pid) => {
      entries.push({
        p, pid,
        tone: p.k === "individual" ? "gold" : p.k === "house" ? "blue" : "rose",
        a: 0, from: 0, to: 0, no: 0,
        rDot: p.y ? R.y0 + ((p.y - Y_FROM) / (Y_TO - Y_FROM)) * (R.y1 - R.y0) : R.und,
        em: 1, emFrom: 1, emTo: 1,
        withWho: false,
      });
    });
  });
  const N = entries.length;
  const yearR = (y) => R.y0 + ((y - Y_FROM) / (Y_TO - Y_FROM)) * (R.y1 - R.y0);
  const byCT = {};
  CREDITS.forEach((cr) => { byCT[cr] = {}; TONES.forEach((t) => (byCT[cr][t] = entries.filter((e) => e.p.c === cr && e.tone === t))); });
  // the perfumers in the list's order, which is the chart's A–Z: by surname
  const PERFUMERS = D.perfumers.slice().sort((a, b) => cmp(perSort(a.id), perSort(b.id)));
  const named = PERFUMERS.filter((p) => p.id !== "not-found");
  const entriesOf = (pid) => entries.filter((e) => e.pid === pid);
  function housesOf(pid) {
    const m = new Map();
    entriesOf(pid).forEach((e) => { if (!m.has(e.p.h)) m.set(e.p.h, []); m.get(e.p.h).push(e); });
    m.forEach((list) => list.sort((x, y) => cmp(x.p.n, y.p.n)));
    return Array.from(m.entries()).sort((a, b) => cmp(HOU[a[0]].name, HOU[b[0]].name));
  }

  // ---- THE TOOLS -------------------------------------------------------
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  function angDist(a, b) { let d = ((a - b) % TAU + TAU) % TAU; return d > Math.PI ? TAU - d : d; }
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function esc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]); }
  const level = (em) => clamp(Math.round(em * LV), 0, LV);

  // ---- ARRANGING: A–Z or by year --------------------------------------
  let mode = "az";
  try { if (localStorage.getItem("pf-sort") === "year") mode = "year"; } catch (e) { /* no storage */ }
  let groups = [], oldGroups = [], order = entries.slice();
  let slot = 0, gapAngle = 0, sortT0 = -1;

  function arrange(m, animate) {
    const list = entries.slice();
    const byWho = (x, y) => cmp(perSort(x.pid), perSort(y.pid)) || cmp(HOU[x.p.h].name, HOU[y.p.h].name) || cmp(x.p.n, y.p.n);
    if (m === "az") list.sort(byWho);
    else list.sort((x, y) => (x.p.y || 9999) - (y.p.y || 9999) || byWho(x, y));
    const keyOf = (e) => (m === "az" ? e.pid : yearKey(e));
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
      g.members.forEach((e) => {
        e.from = e.a;
        e.to = -Math.PI / 2 + ((gi + 1) * GAP + i + 0.5) * slot;
        e.no = i + 1;
        e.g = g;
        i++;
      });
      g.a0 = g.members[0].to - slot / 2;
      g.a1 = g.members[g.members.length - 1].to + slot / 2;
      g.label = m === "az" ? PER[g.key].name : g.key === "none" ? "Year not found" : String(g.key);
      g.id = m === "az" ? g.key : null;
      // the houses inside it
      g.houses = [];
      g.members.forEach((e) => {
        const last = g.houses[g.houses.length - 1];
        if (!last || last.h !== e.p.h) g.houses.push({ h: e.p.h, g, members: [e] });
        else last.members.push(e);
      });
      g.houses.forEach((h) => {
        h.a0 = h.members[0].to - slot / 2;
        h.a1 = h.members[h.members.length - 1].to + slot / 2;
      });
    });
    oldGroups = animate && !STILL ? groups : [];
    groups = gs;
    order = list;
    measureGroups();
    if (animate && !STILL) sortT0 = performance.now();
    else { entries.forEach((e) => (e.a = e.to)); sortT0 = -1; oldGroups = []; }
    rotorDirty = true; chartDirty = true;
    kick();
  }

  // ---- TEXT: widths measured once, set true to the perspective ----------
  const widths = new Map();
  let widthsEpoch = 0;
  function wOf(font, txt) {
    const key = font + "|" + txt;
    let w = widths.get(key);
    if (w === undefined) { mctx.font = font; w = mctx.measureText(txt).width; widths.set(key, w); }
    return w;
  }
  const charsMemo = new Map();
  function charsOf(font, txt) {
    const key = font + "|" + txt;
    let m = charsMemo.get(key);
    if (!m) {
      const chars = Array.from(txt);
      m = { chars, ws: chars.map((ch) => wOf(font, ch)) };
      charsMemo.set(key, m);
    }
    return m;
  }
  const trackOf = (size) => (size > 12 ? 0.32 : 0.24);
  function arcLen(txt, size, font, track) {
    const m = charsOf(font, txt);
    let t = 0;
    for (const w of m.ws) t += (w * size) / FPX;
    return t + size * track * (m.chars.length - 1);
  }
  const NAME_SIZES = [15, 10, 7, 5];
  const HOUSE_SIZES = [26, 20, 15, 11, 8, 6, 4.5, 3.5];
  function fitSize(txt, a0, a1, sizes, font, track) {
    for (const s of sizes) if (arcLen(txt, s, font, track(s)) < (a1 - a0) * R.group - 10) return s;
    return 0;
  }
  // a chosen perfumer's houses are written as large as their arcs allow on
  // the whole chart, and no larger than reads well close in
  function houseSize(h, z) {
    let best = 0;
    for (const s of h.sizes) { if (s * z <= 17) return s; best = s; }
    return best;
  }
  function measureGroups() {
    groups.forEach((g) => {
      g.text = g.label.toUpperCase();
      g.size = fitSize(g.text, g.a0, g.a1, NAME_SIZES, F.group, trackOf);
      g.houses.forEach((h) => {
        h.text = HOU[h.h].name.toUpperCase();
        h.sizes = mode === "az" ? HOUSE_SIZES.filter((sz) => arcLen(h.text, sz, F.house, 0.18) < (h.a1 - h.a0) * R.group - 10) : [];
        h.size = h.sizes[0] || 0;
      });
      g.members.forEach((e) => (e.withWho = mode === "year"));
    });
  }

  // ---- THE LAYOUT -------------------------------------------------------
  let W = 0, H = 0, DPR = 1, OV = 0, S = 0, fitZ = 0.3, phone = false;
  const L = { ocx: 0.5, ocy: 0.5, oz: 0.3, zx: 0.4, zy: 0.56, zoomH: 600, free: { x0: 0, y0: 0, x1: 0, y1: 0 } };
  let navOpen = false;
  let rotorDirty = true, chartDirty = true;
  const sharp = typeof window.Sharpness === "function"
    ? window.Sharpness(() => { sizeCanvases(); rotorDirty = chartDirty = true; dofOff(); kick(); })
    : null;

  function measure() {
    W = stage.clientWidth; H = stage.clientHeight;
    phone = PHONE.matches;
    DPR = sharp ? sharp.ratio : Math.min(window.devicePixelRatio || 1, 2);
    OV = Math.ceil(Math.max(W, H) * (phone ? 0.05 : 0.06));
    const sb = stage.getBoundingClientRect();
    let x0 = 0, x1 = W, y0 = 0, y1 = H;
    if (!phone && !nav.hidden) {
      const b = nav.getBoundingClientRect();
      if (b.width) x1 = b.left - sb.left - 14;
    }
    const notes = document.querySelector(".pf-notes");
    const left = document.querySelector(".pf-notes-left");
    if (notes && left && getComputedStyle(notes).position === "absolute") {
      const b = left.getBoundingClientRect();
      if (b.width) x0 = b.right - sb.left + 14;
    }
    if (phone) {
      const t = title.getBoundingClientRect();
      y0 = Math.max(0, t.bottom - sb.top + 4);
      y1 = H - 60;
    }
    L.free = { x0, y0, x1, y1 };
    const room = Math.max(140, Math.min(x1 - x0, y1 - y0));
    fitZ = room / (2 * R.fit);
    L.ocx = (x0 + x1) / 2 / W;
    L.ocy = (y0 + y1) / 2 / H;
    L.oz = fitZ;
    if (phone && navOpen) {
      // the list up over the lower half: the whole chart stands smaller, above it
      const y2 = H * 0.48 - 6, room2 = Math.max(120, Math.min(x1 - x0, y2 - y0));
      L.oz = room2 / (2 * R.fit);
      L.ocy = (y0 + y2) / 2 / H;
    }
    // a close look stands left of the middle of its room, the names
    // reading out to its right; on a phone, above the list when it is up
    L.zx = phone ? 0.25 : (0.4 * x1) / W;
    L.zy = phone ? (navOpen ? 0.26 : 0.46) : 0.56;
    L.zoomH = phone ? H * (navOpen ? 0.36 : 0.56) : H * 0.8;
    S = Math.ceil(2 * R.fit * fitZ) + 4;
    stage.style.setProperty("--chart-x", Math.round(L.ocx * W) + "px");
  }
  function sizeCanvases() {
    if (sharp) DPR = sharp.ratio;
    const k = DPR;
    const cw = W + 2 * OV, ch = H + 2 * OV;
    cvChart.width = Math.round(cw * k); cvChart.height = Math.round(ch * k);
    cvDof.width = Math.round(cw * k * 0.5); cvDof.height = Math.round(ch * k * 0.5);
    FLY_K = k > 1.25 ? Math.max(1, k * 0.6) : k;
    cvFly.width = FLY_K < k ? Math.round(cw * FLY_K) : 1; cvFly.height = FLY_K < k ? Math.round(ch * FLY_K) : 1;
    [cvChart, cvDof, cvFly].forEach((c) => {
      c.style.left = -OV + "px"; c.style.top = -OV + "px";
      c.style.width = cw + "px"; c.style.height = ch + "px";
    });
    cvLive.width = Math.round(W * k); cvLive.height = Math.round(H * k);
    cvTurn.width = Math.round(S * k); cvTurn.height = Math.round(S * k);
    rotor.style.width = S + "px"; rotor.style.height = S + "px";
    lastRotor = "";
  }
  function resize() {
    measure();
    sizeCanvases();
    rotorDirty = chartDirty = true;
    dofOff();
    setGoal(poseFor(), true);
    if (callE) { sway(clock); placeCallFirst(); }
    kick();
  }

  // ---- THE PROJECTION ---------------------------------------------------
  const V = { fx: 0, fy: 0, z: 1, rot: 0, c: 1, s: 0, ct: 1, st: 0, F: 1000, cx: 0, cy: 0 };
  function view(fx, fy, z, rot, tilt, cxPx, cyPx) {
    V.fx = fx; V.fy = fy; V.z = z; V.rot = rot;
    V.c = Math.cos(rot); V.s = Math.sin(rot);
    V.ct = Math.cos(tilt); V.st = Math.sin(tilt);
    V.F = 1.25 * Math.max(H, 400);
    V.cx = cxPx; V.cy = cyPx;
  }
  function viewCam() { view(cam.fx, cam.fy, Math.exp(cam.lz), cam.rot, cam.tilt, cam.cx * W, cam.cy * H); }
  // world (x, y) -> screen; o.ok is false behind the eye.
  function proj(x, y, o) {
    const dx = x - V.fx, dy = y - V.fy;
    const u = (dx * V.c - dy * V.s) * V.z;
    const v = (dx * V.s + dy * V.c) * V.z;
    const d = V.F - v * V.st;
    if (d < V.F * 0.16) { o.ok = false; return o; }
    const k = V.F / d;
    o.x = V.cx + u * k; o.y = V.cy + v * V.ct * k; o.k = k; o.ok = true;
    return o;
  }
  // screen -> world, on the chart's plane; null above its horizon.
  function unproj(X, Y) {
    const xs = X - V.cx, ys = Y - V.cy;
    const den = V.ct * V.F + ys * V.st;
    if (den <= 1e-6) return null;
    const v = (ys * V.F) / den;
    const u = (xs * (V.F - v * V.st)) / V.F;
    const uu = u / V.z, vv = v / V.z;
    return { x: V.fx + uu * V.c + vv * V.s, y: V.fy - uu * V.s + vv * V.c };
  }
  const T0 = {}, T1 = {}, T2 = {};

  // ---- THE SURFACE being drawn on: its device transform and its bounds ---
  const SF = { c: null, a: 1, b: 0, cc: 0, d: 1, e: 0, f: 0, x0: 0, y0: 0, x1: 0, y1: 0 };
  function surface(c, a, b, cc, d, e, f, x0, y0, x1, y1) {
    SF.c = c; SF.a = a; SF.b = b; SF.cc = cc; SF.d = d; SF.e = e; SF.f = f;
    SF.x0 = x0; SF.y0 = y0; SF.x1 = x1; SF.y1 = y1;
  }
  function base() { SF.c.setTransform(SF.a, SF.b, SF.cc, SF.d, SF.e, SF.f); }
  function local(la, lb, lc, ld, le, lf) {
    const s = SF;
    s.c.setTransform(s.a * la + s.cc * lb, s.b * la + s.d * lb, s.a * lc + s.cc * ld, s.b * lc + s.d * ld,
      s.a * le + s.cc * lf + s.e, s.b * le + s.d * lf + s.f);
  }
  const inView = (x, y, pad) => x > SF.x0 - pad && x < SF.x1 + pad && y > SF.y0 - pad && y < SF.y1 + pad;

  // Draw txt with its start (or centre) at world (x, y), reading along world
  // angle `ang`, `size` world units tall. Too small or off the surface: not drawn.
  function textAt(c, x, y, ang, txt, size, align, font) {
    const ux = Math.cos(ang), uy = Math.sin(ang);
    proj(x, y, T0); if (!T0.ok) return false;
    proj(x + ux, y + uy, T1); if (!T1.ok) return false;
    proj(x - uy, y + ux, T2); if (!T2.ok) return false;
    const jux = T1.x - T0.x, juy = T1.y - T0.y, jvx = T2.x - T0.x, jvy = T2.y - T0.y;
    if (Math.hypot(jvx, jvy) * size < 1.6) return false;
    const wWorld = (wOf(font, txt) * size) / FPX;
    let sx = T0.x, sy = T0.y;
    if (align === "center") { sx -= (jux * wWorld) / 2; sy -= (juy * wWorld) / 2; }
    const ex = sx + jux * wWorld, ey = sy + juy * wWorld;
    if (Math.max(sx, ex) < SF.x0 - 40 || Math.min(sx, ex) > SF.x1 + 40 || Math.max(sy, ey) < SF.y0 - 40 || Math.min(sy, ey) > SF.y1 + 40) return false;
    const s = size / FPX;
    local(jux * s, juy * s, jvx * s, jvy * s, sx, sy);
    c.fillText(txt, 0, 0);
    return true;
  }
  // letters spaced round an arc, upright at the top and at the bottom — and
  // turned over across the sides by a crossfade, never a jump, as the chart
  // turns them round
  function arcText(c, txt, r, mid, size, font, track, alpha) {
    if (alpha <= 0.003) return;
    const wb = smooth((Math.sin(mid + V.rot) + FLIP) / (2 * FLIP));
    if (wb < 0.999) { c.globalAlpha = alpha * (1 - wb); arcRun(c, txt, r, mid, size, font, track, 1); }
    if (wb > 0.001) { c.globalAlpha = alpha * wb; arcRun(c, txt, r, mid, size, font, track, -1); }
  }
  function arcRun(c, txt, r, mid, size, font, track, dir) {
    const m = charsOf(font, txt);
    const k = size / FPX, gap = size * track;
    let total = gap * (m.chars.length - 1);
    for (const w of m.ws) total += w * k;
    let a = mid - (dir * total) / (2 * r);
    for (let i = 0; i < m.chars.length; i++) {
      const w = m.ws[i] * k;
      const ac = a + (dir * w) / (2 * r);
      textAt(c, Math.cos(ac) * r, Math.sin(ac) * r, ac + (dir * Math.PI) / 2, m.chars[i], size, "center", font);
      a += (dir * (w + gap)) / r;
    }
  }

  // ---- THE STILL THINGS, and the moving ones ------------------------------
  const rand = rng(20261102);
  const dust = [];
  for (let i = 0; i < 2300; i++) {
    const t = rand();
    const r = R.dust0 + Math.pow(t, 1.6) * (R.dust1 - R.dust0);
    const a = rand() * TAU;
    dust.push(Math.cos(a) * r, Math.sin(a) * r, 0.5 + rand() * 1.4, 0.12 + rand() * 0.5 * (1 - t * 0.6));
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
  // the far field, turning a little on its own and twinkling: r, a, size, alpha, turn, phase, rate
  const SKY = 300;
  const sky = new Float32Array(SKY * 7);
  for (let i = 0; i < SKY; i++) {
    sky.set([220 + rand() * 1500, rand() * TAU, 0.4 + rand() * 1.0, 0.05 + rand() * 0.2, (rand() - 0.5) * 0.006, rand() * TAU, 0.3 + rand() * 1.2], i * 7);
  }
  // the dust drifting past the rim: r, a, size, alpha, turn, swell, phase, rate
  const DRIFT = 360;
  const drift = new Float32Array(DRIFT * 8);
  for (let i = 0; i < DRIFT; i++) {
    const t = rand();
    drift.set([R.dust0 - 30 + Math.pow(t, 1.3) * (R.dust1 - R.dust0 + 60), rand() * TAU, 0.6 + rand() * 1.5, 0.18 + rand() * 0.42,
      (0.004 + rand() * 0.012) * (rand() < 0.3 ? -1 : 1), 4 + rand() * 14, rand() * TAU, 0.15 + rand() * 0.5], i * 8);
  }
  // the globe's specks: x, y, z, and a number for its lights
  const GN = 760;
  const globe = new Float32Array(GN * 4);
  for (let i = 0; i < GN; i++) {
    const y = 1 - (2 * (i + 0.5)) / GN, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
    globe.set([Math.cos(th) * r, y, Math.sin(th) * r, rand()], i * 4);
  }

  // ---- THE CAMERA, on two springs -----------------------------------------
  const KEYS = ["fx", "fy", "lz", "rot", "tilt", "cx", "cy"];
  // how many pixels on the window a unit of each comes to, to say when it is at rest
  const PX = { fx: 1, fy: 1, lz: 600, rot: 700, tilt: 400, cx: 1000, cy: 800 };
  const cam = { fx: 0, fy: 0, lz: Math.log(0.3), rot: 0, tilt: 0, cx: 0.5, cy: 0.5 };
  const lead = Object.assign({}, cam), goal = Object.assign({}, cam);
  const camV = {}, leadV = {};
  KEYS.forEach((k) => { camV[k] = 0; leadV[k] = 0; });
  let labelZ = 1.5;            // the zoom the chosen names are sized for
  function stepCam(dt) {
    let moving = false;
    const w = SPRING;
    const e = Math.exp(-w * dt);
    PX.fx = PX.fy = Math.exp(Math.max(cam.lz, goal.lz));
    PX.cx = W; PX.cy = H;
    for (const k of KEYS) {
      let d = lead[k] - goal[k], t1 = (leadV[k] + w * d) * dt;
      lead[k] = goal[k] + (d + t1) * e; leadV[k] = (leadV[k] - w * t1) * e;
      d = cam[k] - lead[k]; t1 = (camV[k] + w * d) * dt;
      cam[k] = lead[k] + (d + t1) * e; camV[k] = (camV[k] - w * t1) * e;
      const px = PX[k];
      if (Math.abs(cam[k] - goal[k]) * px > REST_PX || Math.abs(lead[k] - goal[k]) * px > REST_PX || Math.abs(camV[k]) * px > 8) moving = true;
    }
    if (!moving) jumpCam();
    return moving;
  }
  function jumpCam() { for (const k of KEYS) { cam[k] = lead[k] = goal[k]; camV[k] = leadV[k] = 0; } }
  function setGoal(p, jump) {
    let r = p.rot;
    while (r - cam.rot > Math.PI) r -= TAU;
    while (r - cam.rot < -Math.PI) r += TAU;
    Object.assign(goal, p);
    goal.rot = r;
    if (goal.tilt > 0.01) labelZ = Math.exp(goal.lz);
    if (jump || STILL) jumpCam();
    kick();
  }
  const zoomed = () => goal.tilt > 0.01;
  const zHi = () => (phone ? 1.35 : 2.1);
  const zLo = () => Math.max(fitZ * 1.8, phone ? 0.5 : 0.62);
  function overviewPose() {
    return { fx: 0, fy: 0, lz: Math.log(L.oz), rot: goal.rot, tilt: 0, cx: L.ocx, cy: L.ocy };
  }
  function closePose(ang, r, z) {
    return { fx: Math.cos(ang) * r, fy: Math.sin(ang) * r, lz: Math.log(z), rot: -0.4 - ang, tilt: TILT, cx: L.zx, cy: L.zy };
  }
  // the smallest arc round the circle holding every angle given
  function coverArc(as) {
    const n = as.map((a) => ((a % TAU) + TAU) % TAU).sort((x, y) => x - y);
    if (n.length === 1) return { mid: n[0], span: 0 };
    let gap = TAU - n[n.length - 1] + n[0], at = 0;
    for (let i = 1; i < n.length; i++) { const g = n[i] - n[i - 1]; if (g > gap) { gap = g; at = i; } }
    const span = TAU - gap;
    return { mid: n[at] + span / 2, span };
  }
  // where most of a choice too wide to frame stands: the window of `w`
  // radians round the circle holding the most of it
  function densest(f, w) {
    const as = Array.from(f, (e) => ((e.to % TAU) + TAU) % TAU).sort((x, y) => x - y);
    const n = as.length, two = as.concat(as.map((a) => a + TAU));
    let best = 0, at = 0;
    for (let i = 0, j = 0; i < n; i++) {
      if (j < i) j = i;
      while (j + 1 < i + n && two[j + 1] - two[i] <= w) j++;
      if (j - i + 1 > best) { best = j - i + 1; at = i; }
    }
    let j = at; while (j + 1 < at + n && two[j + 1] - two[at] <= w) j++;
    return (two[at] + two[j]) / 2;
  }
  // the pose for a set chosen: framed whole if it can be, and if it is too
  // wide (Prin Lomros, a perfumer by year) close in all the same, on where
  // most of it is — every choice zooms (2026-11-03: "make the zooming
  // consistent; such that it zooms once a user selects a house or perfumer")
  function poseOf(f, at) {
    if (!f || !f.size) return overviewPose();
    if (at != null) return closePose(at, R.look, zHi());
    const arc = coverArc(Array.from(f, (e) => e.to));
    const span = arc.span + slot * 2;
    if (span <= MAX_FRAME) return closePose(arc.mid, R.look, clamp(L.zoomH / (span * R.label * 0.95), zLo(), zHi()));
    return closePose(densest(f, MAX_FRAME * 0.8), R.look, zLo());
  }
  // where a point of the chart would stand on the window, from a pose
  function screenUnder(q, x, y) {
    view(q.fx, q.fy, Math.exp(q.lz), q.rot, q.tilt, q.cx * W, q.cy * H);
    proj(x, y, T2);
    const o = { ok: T2.ok, x: T2.x, y: T2.y };
    viewCam();
    return o;
  }
  function poseFor() {
    if (!sel.kind || !focus || !focus.size) return overviewPose();
    if (sel.kind === "perfume") {
      // a perfume is looked at from where its house (or its year) is: the
      // same place, its name lit there — moved only as far as it takes to
      // bring its dot onto the window, clear of its edges
      const p = poseOf(focus, look), e = sel.e;
      const wx = Math.cos(e.to) * e.rDot, wy = Math.sin(e.to) * e.rDot;
      const F = callRoom(), m = phone ? 34 : 64;
      for (let i = 0; i <= 6; i++) {
        const t = i / 6;
        const q = Object.assign({}, p, { fx: lerp(p.fx, wx, t), fy: lerp(p.fy, wy, t) });
        const o = screenUnder(q, wx, wy);
        if (o.ok && o.x > F.x0 + m && o.x < F.x1 - m && o.y > F.y0 + m && o.y < F.y1 - m) return q;
      }
      return Object.assign({}, p, { fx: wx, fy: wy });
    }
    return poseOf(focus, look);
  }

  // ---- WHAT IS CHOSEN ---------------------------------------------------
  let sel = { kind: null, pid: null, hid: null, year: null, e: null };
  // a perfume's window: the one shown (callE), the one waiting to be shown
  // once the chart has settled, and when the perfume was lit
  let callE = null, callWait = null, litT0 = -1;
  let focus = null, focusList = null, emT0 = -1;
  // a closer look inside what is chosen, at an angle round the circle — for
  // a house of many perfumes, whose names are small when it is seen whole
  let look = null;
  const canLookCloser = () => zoomed() && sel.kind !== "perfume" && Math.exp(goal.lz) < zHi() * 0.8;

  // ---- DRAWING THE CHART -------------------------------------------------
  let intro = STILL ? 1 : 0, introT0 = -1;
  const labelsOn = () => clamp(intro * 1.6 - 0.6, 0, 1);
  function growth(e) {
    if (intro >= 1) return 1;
    return ease(clamp(intro * 1.55 - (e.no / N) * 0.55, 0, 1));
  }
  // how far the chosen names are written: none on the whole chart, all close in
  const closeAmt = () => clamp((cam.tilt / TILT - 0.35) / 0.5, 0, 1);
  const labelSize = () => clamp(11.5 / labelZ, 8.4, 12.5);
  const written = (e) => focus && focus.has(e) && zoomed();

  // Close in, only part of the circle is on the window: the angles round it
  // that can be seen at all, found once a drawing from the window's edge, so
  // a ring is walked only where it shows.
  const VIS = { all: true, a0: 0, a1: 0 };
  function visibleArc() {
    VIS.all = true;
    proj(0, 0, T0);
    if (V.st < 1e-3 || (T0.ok && inView(T0.x, T0.y, 0))) return;
    const as = [];
    const n = 10, w = SF.x1 - SF.x0, h = SF.y1 - SF.y0;
    for (let i = 0; i <= n; i++) {
      for (const [x, y] of [[SF.x0 + (w * i) / n, SF.y0], [SF.x0 + (w * i) / n, SF.y1], [SF.x0, SF.y0 + (h * i) / n], [SF.x1, SF.y0 + (h * i) / n]]) {
        const q = unproj(x, y);
        if (!q) return;
        as.push(Math.atan2(q.y, q.x));
      }
    }
    const arc = coverArc(as);
    if (arc.span > Math.PI * 1.5) return;
    VIS.all = false;
    VIS.a0 = arc.mid - arc.span / 2 - 0.08;
    VIS.a1 = arc.mid + arc.span / 2 + 0.08;
  }
  function ringPath(c, r, a0, a1) {
    if (VIS.all) { ringWalk(c, r, a0, a1); return; }
    // the parts of [a0, a1] inside the window's arc, taken round the circle
    const L = VIS.a1 - VIS.a0;
    let v0 = VIS.a0;
    while (v0 > a0) v0 -= TAU;
    while (v0 + TAU <= a0) v0 += TAU;
    for (let k = 0; k < 2; k++, v0 += TAU) {
      const lo = Math.max(a0, v0), hi = Math.min(a1, v0 + L);
      if (hi > lo) ringWalk(c, r, lo, hi);
    }
  }
  function ringWalk(c, r, a0, a1) {
    const step = clamp(5 / (r * V.z), 0.004, 0.06);
    let pen = false;
    for (let a = a0; a <= a1 + 1e-9; a += step) {
      proj(Math.cos(a) * r, Math.sin(a) * r, T0);
      if (!T0.ok || !inView(T0.x, T0.y, 260)) { pen = false; continue; }
      if (!pen) { c.moveTo(T0.x, T0.y); pen = true; } else c.lineTo(T0.x, T0.y);
    }
  }
  function specks(c, arr, col, mul) {
    if (mul <= 0) return;
    c.fillStyle = col;
    const z = V.z, x0 = SF.x0 - 4, x1 = SF.x1 + 4, y0 = SF.y0 - 4, y1 = SF.y1 + 4;
    for (let i = 0; i < arr.length; i += 4) {
      proj(arr[i], arr[i + 1], T0);
      if (!T0.ok) continue;
      const X = T0.x, Y = T0.y;
      if (X < x0 || X > x1 || Y < y0 || Y > y1) continue;
      const s = Math.max(0.55, arr[i + 2] * z * T0.k * 1.4);
      c.globalAlpha = arr[i + 3] * mul;
      c.fillRect(X - s / 2, Y - s / 2, s, s);
    }
    c.globalAlpha = 1;
  }
  function sortMix() {
    if (sortT0 < 0) return [1, 0];
    const t = clamp((performance.now() - sortT0) / SORT_MS, 0, 1);
    return [clamp(t * 2 - 1, 0, 1), clamp(1 - t * 2, 0, 1)];
  }
  function groupEm(g) { let m = 0; for (const e of g.members) if (e.em > m) m = e.em; return m; }

  function drawScene(withNames) {
    const c = SF.c, z = V.z, fade = intro;
    visibleArc();
    base();
    c.globalAlpha = 1;
    c.textBaseline = "middle"; c.textAlign = "left";

    // the dust past the rim
    specks(c, dust, SOLID.ink, 0.8 * fade);

    // the years' rings, every fifth a little brighter
    c.strokeStyle = SOLID.ink;
    c.lineWidth = Math.max(0.5, 0.6 * z);
    for (const bright of [false, true]) {
      c.beginPath();
      for (let y = Y_FROM + 1; y <= Y_TO; y++) if ((y % 5 === 0) === bright) ringPath(c, yearR(y), -Math.PI / 2, Math.PI * 1.5);
      c.globalAlpha = (bright ? 0.13 : 0.06) * fade;
      c.stroke();
    }
    c.setLineDash([3, 4]);
    c.beginPath(); ringPath(c, R.und, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.2 * fade; c.stroke();
    c.setLineDash([]);
    c.beginPath(); ringPath(c, R.base, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.12 * fade; c.stroke();
    c.beginPath(); ringPath(c, R.tick1 + 1, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.16 * fade; c.stroke();

    // the gold haze round the globe
    specks(c, haze, SOLID.gold, 0.9 * fade);

    // the years named up the gap at the top
    c.font = F.mono; c.fillStyle = SOLID.ink; c.globalAlpha = 0.42 * fade;
    const ga = gapAngle;
    [2010, 2014, 2018, 2022, 2026].forEach((y) => {
      textAt(c, Math.cos(ga) * yearR(y), Math.sin(ga) * yearR(y) - 4, ga + Math.PI / 2, String(y), 6.5, "center", F.mono);
    });
    textAt(c, Math.cos(ga) * R.und, Math.sin(ga) * R.und - 4, ga + Math.PI / 2, "NO YEAR FOUND", 5.4, "center", F.mono);
    base();

    // the band round the globe: a segment a group
    const [gNew, gOld] = sortMix();
    c.lineCap = "butt";
    c.lineWidth = Math.max(1, (R.band1 - R.band0) * z * 0.9);
    const band = (gs, alpha) => {
      if (alpha <= 0) return;
      gs.forEach((g, i) => {
        c.beginPath(); ringPath(c, (R.band0 + R.band1) / 2, g.a0 + slot * 0.3, g.a1 - slot * 0.3);
        c.globalAlpha = (i % 2 ? 0.1 : 0.2) * alpha * fade * (gs === groups ? 0.4 + 0.6 * groupEm(g) : 1);
        c.stroke();
      });
    };
    band(oldGroups, gOld); band(groups, gNew);

    // the spokes, by credit, tone and emphasis
    const lw = clamp(0.8 * z, 0.55, 2.4);
    const dashes = { named: [], house: [clamp(3.5 * z, 2, 9), clamp(3 * z, 2, 7)], none: [1, clamp(3 * z, 2.4, 7)] };
    c.lineWidth = lw;
    for (const cr of CREDITS) {
      c.setLineDash(dashes[cr]);
      for (const tone of TONES) {
        const paths = [];
        for (const e of byCT[cr][tone]) {
          const g = growth(e);
          if (g <= 0) continue;
          const ca = Math.cos(e.a), sa = Math.sin(e.a);
          const r1 = R.base + (e.rDot - R.base) * g;
          proj(ca * R.base, sa * R.base, T0);
          proj(ca * r1, sa * r1, T1);
          if (!T0.ok || !T1.ok) continue;
          if (!inView(T0.x, T0.y, 40) && !inView(T1.x, T1.y, 40)) continue;
          const lv = level(e.em);
          const p = paths[lv] || (paths[lv] = new Path2D());
          p.moveTo(T0.x, T0.y); p.lineTo(T1.x, T1.y);
        }
        c.strokeStyle = SOLID[tone];
        const a = tone === "rose" ? 0.42 : 0.6;
        for (let lv = 0; lv <= LV; lv++) if (paths[lv]) { c.globalAlpha = (a * lv) / LV; c.stroke(paths[lv]); }
      }
    }
    c.setLineDash([]);

    // the dots
    for (const tone of TONES) {
      const glow = [], core = [], hollow = [];
      let hw = 0, hn = 0;
      for (const e of entries) {
        if (e.tone !== tone || growth(e) < 0.98) continue;
        proj(Math.cos(e.a) * e.rDot, Math.sin(e.a) * e.rDot, T0);
        if (!T0.ok || !inView(T0.x, T0.y, 20)) continue;
        const rr = Math.max(1.1, (tone === "rose" ? 3 : 3.8) * z * T0.k);
        const lv = level(e.em);
        if (e.p.y) {
          const g = glow[lv] || (glow[lv] = new Path2D());
          g.moveTo(T0.x + rr * 2.6, T0.y); g.arc(T0.x, T0.y, rr * 2.6, 0, TAU);
          const k = core[lv] || (core[lv] = new Path2D());
          k.moveTo(T0.x + rr, T0.y); k.arc(T0.x, T0.y, rr, 0, TAU);
        } else {
          const h = hollow[lv] || (hollow[lv] = new Path2D());
          h.moveTo(T0.x + rr, T0.y); h.arc(T0.x, T0.y, rr, 0, TAU);
          hw += rr * 0.4; hn++;
        }
      }
      c.fillStyle = SOLID[tone]; c.strokeStyle = SOLID[tone];
      c.lineWidth = Math.max(0.7, hn ? hw / hn : 1);
      for (let lv = 0; lv <= LV; lv++) {
        const k = lv / LV;
        if (glow[lv]) { c.globalAlpha = 0.16 * k; c.fill(glow[lv]); }
        if (core[lv]) { c.globalAlpha = k; c.fill(core[lv]); }
        if (hollow[lv]) { c.globalAlpha = k; c.stroke(hollow[lv]); }
      }
    }

    // the rim: a tick for every perfume
    c.beginPath();
    for (const e of order) {
      const ca = Math.cos(e.a), sa = Math.sin(e.a);
      proj(ca * R.tick0, sa * R.tick0, T0);
      proj(ca * R.tick1, sa * R.tick1, T1);
      if (!T0.ok || !T1.ok || !inView(T0.x, T0.y, 20)) continue;
      c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y);
    }
    c.lineWidth = Math.max(0.5, 0.5 * z);
    c.strokeStyle = SOLID.ink; c.globalAlpha = 0.4 * fade; c.stroke();

    drawRim(c);
    if (withNames) drawNames(c, 1);
    c.globalAlpha = 1;
    base();
  }

  // Where a perfume's words stand along its spoke: its name, then its house
  // (and, by year, its perfumer), reading outward — or, on the left of the
  // circle, reading inward so nothing is upside down, ending at the rim's
  // side as the poster's do.
  const LP = { flip: false, dir: 0, main: "", sub: "", size: 0, sub2: 0, wMain: 0, wSub: 0, rMain: 0, rSub: 0, font: "" };
  function placeLabel(e, size) {
    LP.flip = Math.cos(e.a + V.rot) < 0;
    LP.dir = LP.flip ? e.a + Math.PI : e.a;
    LP.main = e.p.n;
    LP.sub = "  " + HOU[e.p.h].name + (e.withWho && e.pid !== "not-found" ? " · " + PER[e.pid].name : "");
    LP.size = size; LP.sub2 = size * 0.76;
    LP.font = e.p.at ? F.labelHere : F.label;
    if (e.wEpoch !== widthsEpoch || e.wMode !== mode) {
      e.wMain = wOf(LP.font, LP.main); e.wSub = wOf(F.mono, LP.sub);
      e.wEpoch = widthsEpoch; e.wMode = mode;
    }
    LP.wMain = (e.wMain * size) / FPX;
    LP.wSub = (e.wSub * LP.sub2) / FPX;
    if (LP.flip) { LP.rMain = R.label + LP.wMain + LP.wSub; LP.rSub = R.label + LP.wSub; }
    else { LP.rMain = R.label; LP.rSub = R.label + LP.wMain; }
    return LP;
  }
  // a run of words as a faint line, where they are not written
  function lineRun(p, a, r0, len) {
    const ca = Math.cos(a), sa = Math.sin(a);
    proj(ca * r0, sa * r0, T0); proj(ca * (r0 + len), sa * (r0 + len), T1);
    if (!T0.ok || !T1.ok || (!inView(T0.x, T0.y, 10) && !inView(T1.x, T1.y, 10))) return;
    p.moveTo(T0.x, T0.y); p.lineTo(T1.x, T1.y);
  }
  function drawRim(c) {
    const on = labelsOn();
    if (on <= 0) return;
    const z = V.z, close = closeAmt();
    const ls = labelSize();
    const mains = [], subs = [], nums = [];
    const chosen = [];
    for (const e of order) {
      const w = written(e) ? close : 0;
      if (w > 0.01) chosen.push(e);
      if (w > 0.99) continue;
      const lv = level(e.em * (1 - w));
      if (!lv) continue;
      // the faint lines stand the same way round whichever way the words
      // would read, so turning the chart never shuffles them
      const P = placeLabel(e, 8.4);
      lineRun(mains[lv] || (mains[lv] = new Path2D()), e.a, R.label, P.wMain);
      lineRun(subs[lv] || (subs[lv] = new Path2D()), e.a, R.label + P.wMain + 4, P.wSub * 0.8);
      lineRun(nums[lv] || (nums[lv] = new Path2D()), e.a, R.num, 13);
    }
    c.strokeStyle = SOLID.ink;
    const strokeAll = (paths, width, alpha) => {
      c.lineWidth = Math.max(0.5, width);
      for (let lv = 1; lv <= LV; lv++) if (paths[lv]) { c.globalAlpha = (alpha * lv * on) / LV; c.stroke(paths[lv]); }
    };
    strokeAll(mains, 8.4 * 0.36 * z, 0.24);
    strokeAll(subs, 6.4 * 0.3 * z, 0.13);
    strokeAll(nums, 5.6 * 0.32 * z, 0.2);
    if (!chosen.length) return;

    // the chosen, written out: their names, their houses, their numbers
    c.textBaseline = "middle"; c.textAlign = "left";
    c.fillStyle = SOLID.ink;
    for (const font of [F.label, F.labelHere]) {
      c.font = font;
      for (const e of chosen) {
        const P = placeLabel(e, ls);
        if (P.font !== font) continue;
        c.globalAlpha = (e.p.at ? 0.95 : 0.66) * close * e.em * on;
        textAt(c, Math.cos(e.a) * P.rMain, Math.sin(e.a) * P.rMain, P.dir, P.main, P.size, "left", font);
      }
    }
    c.font = F.mono; c.fillStyle = SOLID.muted;
    for (const e of chosen) {
      const P = placeLabel(e, ls);
      c.globalAlpha = 0.72 * close * e.em * on;
      textAt(c, Math.cos(e.a) * P.rSub, Math.sin(e.a) * P.rSub, P.dir, P.sub, P.sub2, "left", F.mono);
    }
    const ns = ls * 0.667;
    for (const e of chosen) {
      const flip = Math.cos(e.a + V.rot) < 0;
      const no = String(e.no).padStart(3, "0");
      const yr = e.p.y ? " ’" + String(e.p.y).slice(2) : " —";
      const w = ((wOf(F.mono, no) + wOf(F.mono, yr)) * ns) / FPX;
      const r0 = flip ? R.num + w : R.num, dir = flip ? e.a + Math.PI : e.a;
      c.globalAlpha = 0.75 * close * e.em * on;
      c.fillStyle = SOLID.ink;
      textAt(c, Math.cos(e.a) * r0, Math.sin(e.a) * r0, dir, no, ns, "left", F.mono);
      const r1 = flip ? r0 - (wOf(F.mono, no) * ns) / FPX : r0 + (wOf(F.mono, no) * ns) / FPX;
      c.fillStyle = SOLID.muted;
      textAt(c, Math.cos(e.a) * r1, Math.sin(e.a) * r1, dir, yr, ns, "left", F.mono);
    }
    base();
  }

  // The group names along the rim — and, for a chosen perfumer, its houses
  // in its name's place, with a square where each begins.
  function drawNames(c, mul) {
    const [gNew, gOld] = sortMix();
    namesFor(c, oldGroups, gOld * mul);
    namesFor(c, groups, gNew * mul);
  }
  function namesFor(c, gs, alpha) {
    alpha *= labelsOn();
    if (alpha <= 0.003) return;
    const z = V.z;
    c.textBaseline = "middle"; c.textAlign = "left";
    const chosenG = mode === "az" && sel.pid && gs === groups ? gs.find((g) => g.id === sel.pid) : null;
    c.font = F.group; c.fillStyle = SOLID.ink;
    for (const g of gs) {
      if (g === chosenG || !g.size || g.size * z < 2.3) continue;
      const em = gs === groups && focus ? 0.4 + 0.6 * (groupEm(g) - DIM) / (1 - DIM) : 1;
      arcText(c, g.text, R.group, (g.a0 + g.a1) / 2, g.size, F.group, trackOf(g.size), 0.92 * alpha * em);
    }
    if (!chosenG) { base(); return; }
    c.font = F.house;
    for (const h of chosenG.houses) {
      const size = houseSize(h, z);
      if (!size || size * z < 2.3) continue;
      const on = sel.hid === h.h;
      c.fillStyle = on ? SOLID.gold : SOLID.ink;
      arcText(c, h.text, R.group, (h.a0 + h.a1) / 2, size, F.house, 0.18, alpha * (sel.hid && !on ? 0.5 : 0.95));
    }
    base();
    for (const h of chosenG.houses) {
      const a = h.a0 + slot * 0.5;
      proj(Math.cos(a) * (R.tick0 - 4), Math.sin(a) * (R.tick0 - 4), T0);
      if (!T0.ok) continue;
      const sq = Math.max(1.4, 2.8 * z * T0.k);
      c.fillStyle = sel.hid === h.h ? SOLID.gold : SOLID.ink;
      c.globalAlpha = 0.85 * alpha;
      c.fillRect(T0.x - sq / 2, T0.y - sq / 2, sq, sq);
    }
    c.globalAlpha = 1;
  }

  // ---- THE ROTOR: the chart at rest, drawn once, turned by the browser -----
  let lastRotor = "";
  const stats = { rotor: 0, chart: 0, live: 0, dof: 0 };
  function renderRotor() {
    rotorDirty = false;
    stats.rotor++;
    const k = DPR;
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.clearRect(0, 0, cvTurn.width, cvTurn.height);
    surface(tctx, k, 0, 0, k, 0, 0, 0, 0, S, S);
    view(0, 0, fitZ, 0, 0, S / 2, S / 2);
    drawScene(false);
  }
  function placeRotor() {
    const x = cam.cx * W - S / 2, y = cam.cy * H - S / 2;
    const sc = Math.exp(cam.lz) / fitZ;
    const t = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px) rotate(" + (cam.rot % TAU).toFixed(5) + "rad)" +
      (Math.abs(sc - 1) > 1e-4 ? " scale(" + sc.toFixed(5) + ")" : "");
    if (t !== lastRotor) { rotor.style.transform = t; lastRotor = t; }
  }

  // ---- THE CHART IN PERSPECTIVE ---------------------------------------------
  function drawChart(lo) {
    chartDirty = false;
    stats.chart++;
    lo = !!lo && FLY_K < DPR;
    const k = lo ? FLY_K : DPR, c = lo ? fctx : ctx, cv = lo ? cvFly : cvChart;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    surface(c, k, 0, 0, k, k * OV, k * OV, -OV, -OV, W + OV, H + OV);
    viewCam();
    drawScene(true);
    setFlying(lo);
  }
  function setFlying(on) {
    if (on === flying) return;
    flying = on;
    stage.classList.toggle("is-flying", on);
  }

  // ---- THE OUT-OF-FOCUS COPY, once a close look has settled -----------------
  let dofDone = false, stillSince = 0;
  const canFilter = typeof dctx.filter === "string";
  let small = null;
  function dofOff() { cvDof.classList.remove("is-on"); dofDone = false; }
  function renderDof() {
    dofDone = true;
    if (STILL) return;
    stats.dof++;
    const w = cvDof.width, h = cvDof.height;
    dctx.setTransform(1, 0, 0, 1, 0, 0);
    dctx.globalCompositeOperation = "source-over";
    dctx.globalAlpha = 1;
    dctx.fillStyle = GROUND;
    dctx.fillRect(0, 0, w, h);
    if (canFilter) {
      dctx.filter = "blur(" + (1.4 * DPR).toFixed(1) + "px)";
      dctx.drawImage(cvChart, 0, 0, w, h);
      dctx.filter = "none";
    } else {
      // no canvas filter (an older Safari): blur by drawing small and back
      if (!small) small = document.createElement("canvas");
      small.width = Math.max(1, Math.round(w / 4)); small.height = Math.max(1, Math.round(h / 4));
      const sc = small.getContext("2d");
      sc.drawImage(cvChart, 0, 0, small.width, small.height);
      dctx.imageSmoothingQuality = "high";
      dctx.drawImage(small, 0, 0, w, h);
    }
    // cut the part in focus back out, softly: a wide band through the point
    // looked at, as a lens close to a page has it
    dctx.globalCompositeOperation = "destination-out";
    const sc = w / (W + 2 * OV);
    dctx.save();
    dctx.translate((OV + cam.cx * W) * sc, (OV + cam.cy * H) * sc);
    dctx.rotate(-0.18);
    dctx.scale(1.9, 1);
    const rad = Math.max(W, H) * 0.3 * sc;
    const gr = dctx.createRadialGradient(0, 0, rad * 0.35, 0, 0, rad);
    gr.addColorStop(0, "rgba(0,0,0,1)");
    gr.addColorStop(1, "rgba(0,0,0,0)");
    dctx.fillStyle = gr;
    dctx.fillRect(-w, -h, w * 2, h * 2);
    dctx.restore();
    dctx.globalCompositeOperation = "source-over";
    cvDof.classList.add("is-on");
  }
  // how far a point on the window is from the part in focus, as a quiet:
  // the live specks fade out of it as the copy blurs it
  function quietAt(X, Y, amt) {
    if (amt <= 0) return 1;
    const dx = X - cam.cx * W, dy = Y - cam.cy * H;
    const c = Math.cos(0.18), s = Math.sin(0.18);
    const u = (dx * c - dy * s) / 1.9, v = dx * s + dy * c;
    const d = Math.hypot(u, v) / (Math.max(W, H) * 0.3);
    return 1 - amt * 0.7 * smooth((d - 0.35) / 0.65);
  }

  // ---- THE SWAY, close in: the browser's to draw ---------------------------
  let swayAmt = 0;
  const M = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  let lastSway = "";
  function sway(t) {
    if (swayAmt <= 0) { M.a = 1; M.b = 0; M.c = 0; M.d = 1; M.e = 0; M.f = 0; }
    else {
      const th = swayAmt * (SWAY.roll * Math.sin(TAU * SWAY.rollHz * t) + SWAY.roll2 * Math.sin(TAU * SWAY.roll2Hz * t + 1.3));
      const sc = 1 + swayAmt * SWAY.breath * (0.5 - 0.5 * Math.cos(TAU * SWAY.breathHz * t));
      const tx = swayAmt * SWAY.dx * Math.sin(TAU * SWAY.driftHz * t + 0.6);
      const ty = swayAmt * SWAY.dy * Math.sin(TAU * SWAY.driftHz * 0.77 * t + 2.1);
      const px = cam.cx * W, py = cam.cy * H;
      const c = Math.cos(th) * sc, s = Math.sin(th) * sc;
      M.a = c; M.b = s; M.c = -s; M.d = c;
      M.e = px + tx - (c * px - s * py);
      M.f = py + ty - (s * px + c * py);
    }
    const css = swayAmt <= 0 ? "none" : "matrix(" + [M.a, M.b, M.c, M.d, M.e, M.f].map((v) => v.toFixed(5)).join(",") + ")";
    if (css !== lastSway) { swayBox.style.transform = css; lastSway = css; }
  }
  function unsway(X, Y) {
    const det = M.a * M.d - M.b * M.c;
    const x = X - M.e, y = Y - M.f;
    return { x: (M.d * x - M.c * y) / det, y: (-M.b * x + M.a * y) / det };
  }

  // ---- THE LIVE LAYER: what moves of itself, and what the hand is on --------
  let clock = 0, globeAngle = 0, hover = null;
  const pulses = [];
  let pulseNext = 1.2;
  function tendPulses() {
    if (STILL || intro < 1) return;
    for (let i = pulses.length - 1; i >= 0; i--) if (clock > pulses[i].t0 + pulses[i].dur + 1) pulses.splice(i, 1);
    if (clock < pulseNext || pulses.length >= 9) return;
    const pool = focusList && zoomed() ? focusList : order;
    const e = pool[Math.floor(Math.random() * pool.length)];
    if (e) pulses.push({ e, t0: clock, dur: 1.5 + Math.random() * 1.2 });
    pulseNext = clock + (zoomed() ? 0.5 : 0.28) + Math.random() * 0.55;
  }
  function drawLive() {
    stats.live++;
    const c = lctx, k = DPR;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cvLive.width, cvLive.height);
    surface(c, k * M.a, k * M.b, k * M.c, k * M.d, k * M.e, k * M.f, -50, -50, W + 50, H + 50);
    viewCam();
    VIS.all = true;
    base();
    const t = STILL ? 0 : clock;
    const z = V.z, fade = intro;
    const q = cam.tilt / TILT;

    // the far field and the dust past the rim, drifting
    c.fillStyle = SOLID.ink;
    for (let i = 0; i < SKY; i++) {
      const o = i * 7, a = sky[o + 1] + sky[o + 4] * t, r = sky[o];
      proj(Math.cos(a) * r, Math.sin(a) * r, T0);
      if (!T0.ok || !inView(T0.x, T0.y, 4)) continue;
      const s = Math.max(0.5, sky[o + 2] * z * T0.k * 1.4);
      c.globalAlpha = sky[o + 3] * (0.6 + 0.4 * Math.sin(sky[o + 6] * t + sky[o + 5])) * fade * quietAt(T0.x, T0.y, q);
      c.fillRect(T0.x - s / 2, T0.y - s / 2, s, s);
    }
    for (let i = 0; i < DRIFT; i++) {
      const o = i * 8, a = drift[o + 1] + drift[o + 4] * t, r = drift[o] + drift[o + 5] * Math.sin(drift[o + 7] * t + drift[o + 6]);
      proj(Math.cos(a) * r, Math.sin(a) * r, T0);
      if (!T0.ok || !inView(T0.x, T0.y, 4)) continue;
      const s = Math.max(0.55, drift[o + 2] * z * T0.k * 1.3);
      c.globalAlpha = drift[o + 3] * (0.55 + 0.45 * Math.sin(drift[o + 7] * 2.3 * t + drift[o + 6] * 1.7)) * fade * quietAt(T0.x, T0.y, q);
      c.fillRect(T0.x - s / 2, T0.y - s / 2, s, s);
    }

    // the globe
    proj(0, 0, T0);
    if (T0.ok) {
      const gr = R.sphere * z * T0.k;
      if (T0.x + gr > -50 && T0.x - gr < W + 50 && T0.y + gr > -50 && T0.y - gr < H + 50) {
        drawGlobe(c, T0.x, T0.y, gr, clamp(intro * 2, 0, 1) * quietAt(T0.x, T0.y, q * 0.8), t);
      }
    }

    // a glint running round the band
    if (!STILL && intro >= 1) {
      const a = -Math.PI / 2 + ((t / 24) % 1) * TAU;
      c.strokeStyle = SOLID.gold;
      c.lineCap = "round";
      c.lineWidth = Math.max(1, (R.band1 - R.band0) * z * 0.5);
      const rm = (R.band0 + R.band1) / 2;
      [[0.32, 0.07], [0.16, 0.12], [0.06, 0.22]].forEach(([len, al]) => {
        c.beginPath(); ringPath(c, rm, a - len, a);
        c.globalAlpha = al; c.stroke();
      });
      c.lineCap = "butt";
    }

    // the lights running out along the spokes
    drawPulses(c, t);

    // the names on the rim, while the chart turns — here so that they turn
    // over as they come round, rather than stand upside down
    if (viewNow === "turn") drawNames(c, 1);

    // what is chosen, lit, while it is seen on the whole chart (close in its
    // names are written instead)
    if (focusList && !sel.e && q < 0.5) { c.globalAlpha = 1; markSpokes(c, focusList, 0.75 * (1 - 2 * q)); }
    // what is lit, and what the hand is on
    if (sel.e) { markEntry(c, sel.e); markLit(c, sel.e); }
    if (callE && callAt.ok) drawCallLine(c);
    if (hover) drawHover(c);
    c.globalAlpha = 1;
  }
  function drawGlobe(c, cx, cy, gr, alpha, t) {
    if (alpha <= 0.01) return;
    // a dark disc first, so the dust behind does not show through it
    const g0 = c.createRadialGradient(cx - gr * 0.35, cy - gr * 0.4, gr * 0.1, cx, cy, gr);
    g0.addColorStop(0, "rgb(40,46,56)");
    g0.addColorStop(1, "rgb(8,9,11)");
    c.globalAlpha = alpha;
    c.fillStyle = g0;
    c.beginPath(); c.arc(cx, cy, gr, 0, TAU); c.fill();
    const ca = Math.cos(globeAngle), sa = Math.sin(globeAngle);
    const ct = Math.cos(0.41), st = Math.sin(0.41);
    const lx = -0.55, ly = -0.55, lz = 0.63;
    const sz = Math.max(0.6, gr * 0.02);
    for (let pass = 0; pass < 2; pass++) {
      c.fillStyle = pass ? SOLID.gold : SOLID.blue;
      for (let i = 0; i < GN; i++) {
        const o = i * 4, x = globe[o], y = globe[o + 1], zz = globe[o + 2];
        const x1 = x * ca + zz * sa, z1 = -x * sa + zz * ca;
        const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
        if (z2 < -0.05) continue;
        const lit = x1 * lx + y2 * ly + z2 * lz;
        if (!pass && lit > 0) {
          c.globalAlpha = (0.18 + lit * 0.7) * z2 * alpha;
          c.fillRect(cx + x1 * gr - sz / 2, cy + y2 * gr - sz / 2, sz, sz);
        } else if (pass && lit <= 0 && globe[o + 3] > 0.84) {
          // the lights on the night side, twinkling
          c.globalAlpha = (0.35 + globe[o + 3] * 0.5) * z2 * alpha * (0.75 + 0.25 * Math.sin(t * (1.3 + globe[o + 3] * 2) + i));
          c.fillRect(cx + x1 * gr - sz * 0.6, cy + y2 * gr - sz * 0.6, sz * 1.2, sz * 1.2);
        }
      }
    }
    c.globalAlpha = 0.35 * alpha;
    c.strokeStyle = SOLID.blue;
    c.lineWidth = Math.max(0.6, gr * 0.012);
    c.beginPath(); c.arc(cx, cy, gr, Math.PI * 0.85, Math.PI * 1.75); c.stroke();
    c.globalAlpha = 1;
  }
  function drawPulses(c, t) {
    if (!pulses.length) return;
    const z = V.z;
    c.lineCap = "round";
    for (const p of pulses) {
      const e = p.e, u = (t - p.t0) / p.dur;
      if (u < 0) continue;
      const ca = Math.cos(e.a), sa = Math.sin(e.a);
      c.strokeStyle = SOLID[e.tone]; c.fillStyle = SOLID[e.tone];
      const em = 0.35 + 0.65 * e.em;
      if (u < 1) {
        const k = ease(u), r = R.base + (e.rDot - R.base) * k;
        const tail = Math.min(46, r - R.base);
        proj(ca * (r - tail), sa * (r - tail), T0); proj(ca * r, sa * r, T1);
        if (!T0.ok || !T1.ok || (!inView(T0.x, T0.y, 20) && !inView(T1.x, T1.y, 20))) continue;
        const a = Math.sin(Math.PI * u);
        c.lineWidth = clamp(1.7 * z, 1, 3.2);
        c.globalAlpha = 0.85 * a * em;
        c.beginPath(); c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y); c.stroke();
        c.globalAlpha = 0.95 * a * em;
        c.beginPath(); c.arc(T1.x, T1.y, clamp(2.2 * z * T1.k, 1.2, 4), 0, TAU); c.fill();
      } else {
        // its dot flares as the light arrives
        const v = (t - p.t0 - p.dur) / 1;
        if (v > 1) continue;
        proj(ca * e.rDot, sa * e.rDot, T0);
        if (!T0.ok || !inView(T0.x, T0.y, 30)) continue;
        const rr = Math.max(1.4, 3.6 * z * T0.k);
        c.lineWidth = clamp(1.1 * z, 0.7, 2);
        c.globalAlpha = 0.7 * (1 - v) * em;
        c.beginPath(); c.arc(T0.x, T0.y, rr * (1.4 + v * 3.2), 0, TAU); c.stroke();
        c.globalAlpha = 0.35 * (1 - v) * em;
        c.beginPath(); c.arc(T0.x, T0.y, rr * 1.6, 0, TAU); c.fill();
      }
    }
    c.lineCap = "butt";
    c.globalAlpha = 1;
  }
  function markSpokes(c, list, alpha) {
    const z = V.z;
    c.lineWidth = clamp(1.4 * z, 1, 3.4);
    for (const tone of TONES) {
      c.strokeStyle = SOLID[tone];
      c.globalAlpha = 0.95 * (alpha == null ? 1 : alpha);
      c.beginPath();
      for (const e of list) {
        if (e.tone !== tone) continue;
        const ca = Math.cos(e.a), sa = Math.sin(e.a);
        proj(ca * R.base, sa * R.base, T0); proj(ca * e.rDot, sa * e.rDot, T1);
        if (!T0.ok || !T1.ok) continue;
        c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y);
        const rr = Math.max(2.2, 5.2 * z * T1.k);
        c.moveTo(T1.x + rr, T1.y); c.arc(T1.x, T1.y, rr, 0, TAU);
      }
      c.stroke();
    }
  }
  function markEntry(c, e) {
    markSpokes(c, [e]);
    if (!written(e) || closeAmt() < 0.5) return;
    const P = placeLabel(e, labelSize());
    c.textBaseline = "middle"; c.textAlign = "left";
    c.font = P.font; c.fillStyle = SOLID[e.tone]; c.globalAlpha = closeAmt();
    textAt(c, Math.cos(e.a) * P.rMain, Math.sin(e.a) * P.rMain, P.dir, P.main, P.size, "left", P.font);
    base();
  }
  // the perfume chosen, lit where it stands: a ring breathing round its dot,
  // and as it is lit, two going out from it
  function markLit(c, e) {
    proj(Math.cos(e.a) * e.rDot, Math.sin(e.a) * e.rDot, T0);
    if (!T0.ok) return;
    const rr = Math.max(3, 5.2 * V.z * T0.k);
    const t = STILL ? 0 : clock;
    c.strokeStyle = SOLID[e.tone];
    c.lineWidth = 1;
    c.globalAlpha = 0.55 + 0.3 * Math.sin(t * 2.2);
    c.beginPath(); c.arc(T0.x, T0.y, rr * 2.1, 0, TAU); c.stroke();
    c.fillStyle = SOLID[e.tone];
    c.globalAlpha = 0.16;
    c.beginPath(); c.arc(T0.x, T0.y, rr * 2.1, 0, TAU); c.fill();
    if (litT0 >= 0 && !STILL) {
      const v = (performance.now() - litT0) / 1200;
      if (v < 1) {
        for (const d of [0, 0.3]) {
          const w = clamp((v - d) / 0.7, 0, 1);
          if (w <= 0 || w >= 1) continue;
          c.globalAlpha = 0.85 * (1 - w) * (1 - w);
          c.beginPath(); c.arc(T0.x, T0.y, rr * (2.1 + ease(w) * 7), 0, TAU); c.stroke();
        }
      }
    }
    c.globalAlpha = 1;
  }
  // the line from the dot out to its window, drawn out as the window comes
  function drawCallLine(c) {
    const u = callT0 < 0 ? 1 : clamp((performance.now() - callT0) / CALL_LINE_MS, 0, 1);
    const nx = clamp(callAt.x, callX, callX + callW), ny = clamp(callAt.y, callY, callY + callH);
    const a = unsway(callAt.x, callAt.y), b = unsway(nx, ny);
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d < 14) return;
    const r0 = Math.min(d * 0.4, 12), k = ease(u);
    const sx = a.x + (dx / d) * r0, sy = a.y + (dy / d) * r0;
    c.strokeStyle = SOLID[callE.tone];
    c.lineWidth = 1;
    c.globalAlpha = 0.85;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + (b.x - sx) * k, sy + (b.y - sy) * k); c.stroke();
    if (u >= 1) {
      c.fillStyle = SOLID[callE.tone];
      c.fillRect(b.x - 2.5, b.y - 2.5, 5, 5);
    }
    c.globalAlpha = 1;
  }
  function drawHover(c) {
    const h = hover;
    if (h.type === "entry") { markEntry(c, h.e); return; }
    const list = h.type === "group" ? h.g.members : h.type === "house" ? h.h.members : h.list;
    markSpokes(c, list);
    const g = h.type === "group" ? h.g : h.type === "house" ? null : h.g;
    if (g) {
      c.lineWidth = Math.max(1, (R.band1 - R.band0) * V.z * 0.9);
      c.strokeStyle = SOLID.gold; c.globalAlpha = 0.8;
      c.beginPath(); ringPath(c, (R.band0 + R.band1) / 2, g.a0 + slot * 0.3, g.a1 - slot * 0.3); c.stroke();
      const chosenHere = mode === "az" && sel.pid === g.id;
      if (g.size && !chosenHere) {
        c.font = F.group; c.fillStyle = SOLID.gold;
        c.textBaseline = "middle"; c.textAlign = "left";
        arcText(c, g.text, R.group, (g.a0 + g.a1) / 2, g.size, F.group, trackOf(g.size), 1);
      }
    }
    if (h.type === "house" && h.h.size) {
      c.font = F.house; c.fillStyle = SOLID.gold;
      c.textBaseline = "middle"; c.textAlign = "left";
      arcText(c, h.h.text, R.group, (h.h.a0 + h.h.a1) / 2, houseSize(h.h, V.z), F.house, 0.18, 1);
    }
    base();
  }

  // ---- THE CLOCK -------------------------------------------------------
  let raf = 0, last = 0, viewNow = "", seen = true;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function setView(v) {
    viewNow = v;
    stage.dataset.view = v;
  }
  function frame(now) {
    raf = 0;
    if (!W) return;
    if (sharp) sharp.frame(now);
    const dt = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60;
    last = now;
    const running = !STILL && seen && !document.hidden;
    if (running) clock += dt;

    // the opening
    if (intro < 1) {
      if (introT0 < 0) introT0 = now;
      intro = clamp((now - introT0) / INTRO_MS, 0, 1);
    }
    // the switch's sweep
    let sorting = false;
    if (sortT0 >= 0) {
      const t = clamp((now - sortT0) / SORT_MS, 0, 1);
      for (let i = 0; i < order.length; i++) {
        const e = order[i];
        e.a = e.from + (e.to - e.from) * ease(clamp(t * 1.4 - (i / N) * 0.4, 0, 1));
      }
      if (t >= 1) { sortT0 = -1; oldGroups = []; } else sorting = true;
    }
    // the emphasis, coming and going
    let fading = false;
    if (emT0 >= 0) {
      const t = clamp((now - emT0) / EM_MS, 0, 1), k = ease(t);
      for (const e of entries) e.em = e.emFrom + (e.emTo - e.emFrom) * k;
      if (t >= 1) emT0 = -1; else fading = true;
    }
    // the camera; at rest on the whole chart, the chart turns
    const moving = !STILL && stepCam(dt);
    if (!moving && !zoomed() && running) {
      goal.rot += SPIN * dt;
      cam.rot = lead.rot = goal.rot;
    }
    if (running) globeAngle += dt * 0.07;

    // flat and centred, a move is only a turn, a slide and a scale — the
    // rotor's to carry; anything else is drawn as it goes
    const flat = !zoomed() && cam.tilt < 1e-4 && Math.abs(cam.fx) < 0.01 && Math.abs(cam.fy) < 0.01;
    const settling = moving || sorting || fading || intro < 1;
    const v = settling && !(flat && !sorting && !fading && intro >= 1) ? "live" : zoomed() ? "still" : "turn";
    if (v !== viewNow) {
      if (v === "turn") { if (rotorDirty) renderRotor(); dofOff(); }
      if (v === "live") dofOff();
      if (v === "still") { chartDirty = true; }
      setView(v);
    }
    // the sway comes in slowly once a close look has settled, and goes quickly
    const swayOn = v === "still" && !STILL;
    swayAmt += ((swayOn ? 1 : 0) - swayAmt) * (1 - Math.exp(-dt / (swayOn ? 1.8 : 0.32)));
    if (!swayOn && swayAmt < 0.002) swayAmt = 0;
    sway(clock);
    // a perfume's window, once it has been lit a moment and the chart has
    // (nearly) settled; and wherever it is, beside its dot
    if (callWait && now - callWait.t0 >= callWait.delay && (!moving || now - callWait.t0 > CALL_WAIT)) {
      const e = callWait.e;
      callWait = null;
      openCall(e);
    }
    if (callE) placeCall();

    if (v === "live") { drawChart(moving); rotorDirty = true; }
    else if (v === "turn") { if (rotorDirty) renderRotor(); placeRotor(); setFlying(false); }
    else {
      if (chartDirty) { drawChart(); dofOff(); stillSince = now; }
      if (!dofDone && now - stillSince > 240) renderDof();
    }
    tendPulses();
    drawLive();

    const idle = running && card.hidden && !menuOpen;
    if (settling || idle || callWait || swayAmt > 0 && running || (v === "still" && !dofDone)) kick();
    else last = 0;
  }

  // ---- WHAT IS UNDER THE HAND --------------------------------------------
  function groupAt(th) {
    let best = null, bd = Infinity;
    for (const g of groups) {
      const d = Math.max(0, angDist(th, (g.a0 + g.a1) / 2) - (g.a1 - g.a0) / 2);
      if (d < bd) { bd = d; best = g; }
    }
    return bd <= slot * GAP ? best : null;
  }
  function houseAt(g, th) {
    let best = null, bd = Infinity;
    for (const h of g.houses) {
      const d = Math.max(0, angDist(th, (h.a0 + h.a1) / 2) - (h.a1 - h.a0) / 2);
      if (d < bd) { bd = d; best = h; }
    }
    return best;
  }
  function hit(X, Y) {
    const p = unsway(X, Y);
    viewCam();
    const w = unproj(p.x, p.y);
    if (!w) return null;
    const r = Math.hypot(w.x, w.y);
    if (r < R.sphere || r > R.fit) return null;
    const th = Math.atan2(w.y, w.x);
    const g = groupAt(th);
    if (!g) return null;
    // a perfume whose name is written can be pressed by its name or its spoke
    if (closeAmt() > 0.5) {
      let best = null, bd = Infinity;
      for (const e of g.members) { if (!written(e)) continue; const d = angDist(th, e.a); if (d < bd) { bd = d; best = e; } }
      if (best) {
        const onSpoke = r >= R.base - 6 && r <= best.rDot + 12 && bd * r < 9;
        const P = placeLabel(best, labelSize());
        const onLabel = r >= R.tick0 - 4 && r <= R.label + P.wMain + P.wSub + 8 && bd < slot * 0.55;
        if (onSpoke || onLabel) return { type: "entry", e: best, g, th };
      }
    }
    if (mode === "az" && sel.pid === g.id) return { type: "house", g, h: houseAt(g, th), th };
    return { type: "group", g, th };
  }
  function sameHover(a, b) {
    if (!a || !b || a.type !== b.type) return a === b;
    return (a.e || a.h || a.g || a.list) === (b.e || b.h || b.g || b.list);
  }
  function tipFor(h) {
    if (h.type === "entry") {
      const e = h.e, p = e.p;
      const who = p.p.map((id) => PER[id].name).join(" & ");
      return "<b>" + esc(p.n) + "</b><span>" + esc(HOU[p.h].name) + " · " + (p.y || "year not found") + "</span><span>" + esc(who) + "</span>";
    }
    if (h.type === "house") {
      const n = h.h.members.length;
      return "<b>" + esc(HOU[h.h.h].name) + "</b><span>" + n + (n === 1 ? " perfume" : " perfumes") + (sel.hid === h.h.h ? "" : " · choose the house") + "</span>";
    }
    const g = h.g, n = g.members.length;
    const houses = mode === "az" ? g.houses.length : 0;
    return "<b>" + esc(g.label) + "</b><span>" + n + (n === 1 ? " perfume" : " perfumes") +
      (houses ? " · " + houses + (houses === 1 ? " house" : " houses") : "") + "</span>";
  }
  let tipAt = null;
  function showTip(h, X, Y) {
    tip.innerHTML = tipFor(h);
    tip.hidden = false;
    tipAt = { x: X, y: Y };
    placeTip();
  }
  function placeTip() {
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = tipAt.x + 16, y = tipAt.y + 16;
    if (x + tw > W - 8) x = tipAt.x - tw - 16;
    if (y + th > H - 8) y = tipAt.y - th - 16;
    tip.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
  }
  function hideTip() { tip.hidden = true; tipAt = null; }

  // ---- THE HAND ----------------------------------------------------------
  let down = null, handHover = false;
  const CHROME = "button, a, .pf-nav, .pf-here, .pf-sort, .pf-call";
  function localXY(ev) { const b = stage.getBoundingClientRect(); return { x: ev.clientX - b.left, y: ev.clientY - b.top }; }
  stage.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest(CHROME)) return;
    const p = localXY(ev);
    down = { x: p.x, y: p.y };
  });
  stage.addEventListener("pointermove", (ev) => {
    if (ev.pointerType === "touch") return;
    if (ev.target.closest(CHROME)) { if (handHover) clearHandHover(); return; }
    if (viewNow === "live" && zoomed()) return;
    const p = localXY(ev);
    const h = hit(p.x, p.y);
    if (!sameHover(h, hover)) { hover = h; kick(); }
    handHover = !!h;
    stage.classList.toggle("is-over", !!h);
    if (h) showTip(h, p.x, p.y); else hideTip();
  });
  function clearHandHover() {
    handHover = false; hover = null; hideTip();
    stage.classList.remove("is-over");
    kick();
  }
  stage.addEventListener("pointerleave", () => { if (handHover) clearHandHover(); });
  stage.addEventListener("pointerup", (ev) => {
    if (!down) return;
    const p = localXY(ev), was = down;
    down = null;
    if (Math.hypot(p.x - was.x, p.y - was.y) > 10) return;
    press(hit(p.x, p.y));
  });
  stage.addEventListener("pointercancel", () => { down = null; });

  function press(h) {
    if (!h) { if (callE) dismissCall(); return; }
    if (h.type === "entry") { choosePerfume(h.e); return; }
    // pressed inside what is already chosen: a closer look there, if there
    // is one to be had
    const already = h.type === "house" ? sel.kind === "house" && sel.hid === h.h.h
      : mode === "az" ? sel.pid === h.g.id && sel.kind === "perfumer" : sel.kind === "year" && sel.year === h.g.key;
    if (already) { if (canLookCloser() || look != null) lookAt(h.th); return; }
    if (h.type === "house") { chooseHouse(h.g.id, h.h.h); return; }
    if (mode === "az") choosePerfumer(h.g.id);
    else chooseYear(h.g.key);
  }
  function lookAt(th) {
    // the nearest of the chosen to where it was pressed
    let best = null, bd = Infinity;
    for (const e of focusList || []) { const d = angDist(th, e.to); if (d < bd) { bd = d; best = e; } }
    if (!best) return;
    look = best.to;
    hover = null; hideTip();
    setGoal(poseFor());
    showChosen();
  }

  // ---- CHOOSING ----------------------------------------------------------
  function choose(next) {
    const was = sel;
    sel = Object.assign({ kind: null, pid: null, hid: null, year: null, e: null }, next || {});
    // a perfume chosen where a closer look already is keeps that look: the
    // perspective it is chosen from is the one it is shown in
    // — and going back up from it keeps it too
    const sameParent = (sel.kind === "perfume" || was.kind === "perfume") && was.kind && sel.kind &&
      was.pid === sel.pid && was.hid === sel.hid && was.year === sel.year;
    if (!sameParent) look = null;
    if (sel.e !== callE) closeCall(true);
    if (!sel.kind) focus = null;
    else {
      let f;
      if (sel.hid) f = (e) => e.pid === sel.pid && e.p.h === sel.hid;
      else if (sel.pid) f = (e) => e.pid === sel.pid;
      else if (sel.year != null) f = (e) => yearKey(e) === sel.year;
      else f = (e) => e === sel.e;
      focus = new Set(entries.filter(f));
    }
    focusList = focus ? order.filter((e) => focus.has(e)) : null;
    // a perfume chosen is lit, the rest of its house stepped back a little
    // and everything else as far as ever
    for (const e of entries) { e.emFrom = e.em; e.emTo = !focus ? 1 : sel.e ? (e === sel.e ? 1 : focus.has(e) ? AROUND : DIM) : focus.has(e) ? 1 : DIM; }
    if (STILL) { for (const e of entries) e.em = e.emTo; emT0 = -1; } else emT0 = performance.now();
    rotorDirty = chartDirty = true;
    hover = null; hideTip(); handHover = false; stage.classList.remove("is-over");
    setGoal(poseFor());
    showChosen();
    if (sel.kind && window.scrollY > 1) window.scrollTo({ top: 0, behavior: STILL ? "auto" : "smooth" });
    kick();
  }
  const choosePerfumer = (pid) => choose({ kind: "perfumer", pid });
  const chooseHouse = (pid, hid) => choose({ kind: "house", pid, hid });
  const chooseYear = (year) => choose({ kind: "year", year });
  // a perfume chosen: the chart goes (or stays) where its house is seen,
  // the perfume is lit there, and then its window is drawn out of its dot
  // (2026-11-03 — "let the popup window be animated with the chart ... the
  // specific perfume being viewed would be highlighted, then the popup would
  // appear")
  function choosePerfume(e, quiet) {
    const next = { kind: "perfume", e };
    if (sel.year != null && sel.kind !== null && !sel.pid) next.year = sel.year;
    else { next.pid = e.pid; next.hid = e.p.h; }
    if (sel.kind === "perfume" && sel.e === e) { if (!quiet && !callE) callFor(e, 0); return; }
    choose(next);
    litT0 = performance.now();
    if (phone && navOpen) toggleNav(false);
    if (!quiet) callFor(e, STILL ? 0 : CALL_AFTER);
  }
  function up() {
    if (sel.kind === "perfume") { closeCall(); if (sel.year != null) chooseYear(sel.year); else chooseHouse(sel.pid, sel.hid); return; }
    if (look != null) { look = null; setGoal(poseFor()); showChosen(); return; }
    if (sel.kind === "perfume") { if (sel.year != null) chooseYear(sel.year); else chooseHouse(sel.pid, sel.hid); return; }
    if (sel.kind === "house") { choosePerfumer(sel.pid); return; }
    choose(null);
  }

  // what is chosen, said in the title's place, the list and the hint
  let hereTimer = 0;
  function showChosen() {
    const on = !!sel.kind;
    root.classList.toggle("is-chosen", on);
    stage.classList.toggle("is-chosen", on);
    backBtn.hidden = !on;
    hold(on);
    const touch = window.matchMedia("(hover: none)").matches;
    const back = touch ? "" : " · Esc to go back";
    hint.textContent = !on ? (mode === "az" ? (touch ? "Tap a perfumer — on the circle or in the list" : "Choose a perfumer — on the circle or in the list")
      : (touch ? "Tap a year — or a perfumer in the list" : "Choose a year — or a perfumer in the list"))
      : sel.kind === "perfumer" ? (zoomed() || mode === "az" ? "Choose a house" + back : "Choose a house in the list" + back)
      : sel.kind === "perfume" ? (touch ? "" : "Esc to go back")
      : (!zoomed() ? "Choose a perfume in the list" : canLookCloser() ? (touch ? "Tap a perfume — or tap to look closer" : "Choose a perfume — or click to look closer") : "Choose a perfume") + back;
    clearTimeout(hereTimer);
    if (!on) {
      here.classList.remove("is-on");
      hereTimer = setTimeout(() => { here.hidden = true; }, STILL ? 0 : 600);
    } else {
      fillHere();
      if (here.hidden) { here.hidden = false; void here.offsetWidth; }
      here.classList.add("is-on");
    }
    syncNav();
  }
  const about = here.querySelector(".pf-here-about");
  function fillHere() {
    const k = here.querySelector(".pf-here-kicker"), n = here.querySelector(".pf-here-name"), m = here.querySelector(".pf-here-meta");
    let kicker = "", name = "", meta = "", aboutSay = "", aboutDo = null;
    const plural = (x, one, many) => x + " " + (x === 1 ? one : many);
    if (sel.kind === "perfumer") {
      const p = PER[sel.pid], list = entriesOf(sel.pid), hs = housesOf(sel.pid);
      kicker = sel.pid === "not-found" ? "Perfumer" : "Perfumer · " + String(named.indexOf(p) + 1).padStart(2, "0") + " of " + named.length;
      name = p.name;
      meta = plural(list.length, "perfume", "perfumes") + " · " + plural(hs.length, "house", "houses");
      aboutSay = sel.pid === "not-found" ? "About these" : "About " + p.name;
      aboutDo = () => openCard("perfumer", sel.pid, false);
    } else if (sel.kind === "house") {
      const h = HOU[sel.hid], list = entries.filter((e) => e.pid === sel.pid && e.p.h === sel.hid);
      kicker = "House · " + PER[sel.pid].name;
      name = h.name;
      meta = plural(list.length, "perfume", "perfumes") + (h.founded ? " · founded " + h.founded : "");
      aboutSay = "About the house";
      aboutDo = () => openCard("house", sel.hid, false);
    } else if (sel.kind === "year") {
      const list = entries.filter((e) => yearKey(e) === sel.year);
      kicker = "Year";
      name = sel.year === "none" ? "Year not found" : String(sel.year);
      meta = plural(list.length, "perfume", "perfumes") + " · " + plural(new Set(list.map((e) => e.pid)).size, "perfumer", "perfumers");
    } else if (sel.kind === "perfume") {
      const p = sel.e.p;
      kicker = "Perfume · " + HOU[p.h].name;
      name = p.n;
      meta = (p.y || "year not found") + " · " + p.p.map((id) => PER[id].name).join(" & ");
      aboutSay = "Its window";
      aboutDo = () => callFor(sel.e, 0);
    }
    k.textContent = kicker; n.textContent = name; m.textContent = meta;
    about.hidden = !aboutDo;
    about.textContent = aboutSay;
    about.onclick = aboutDo;
  }

  // ---- THE LIST OF PERFUMERS ----------------------------------------------
  const navItems = {};
  function row(cls, name, n) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pf-nav-row " + cls;
    b.innerHTML = '<span class="pf-nav-name">' + esc(name) + '</span><span class="pf-nav-n">' + n + "</span>";
    return b;
  }
  function buildNav() {
    nav.querySelector(".pf-nav-total").textContent = String(named.length);
    PERFUMERS.forEach((p) => {
      const li = document.createElement("li");
      li.className = "pf-nav-item";
      li.dataset.per = p.id;
      const b = row("pf-nav-per", p.name, entriesOf(p.id).length);
      b.setAttribute("aria-expanded", "false");
      li.appendChild(b);
      navList.appendChild(li);
      navItems[p.id] = li;
    });
    nav.hidden = false;
  }
  function housesList(li, pid) {
    let ul = li.querySelector(".pf-nav-houses");
    if (ul) return ul;
    ul = document.createElement("ul");
    ul.className = "pf-nav-houses";
    ul.hidden = true;
    housesOf(pid).forEach(([hid, list]) => {
      const hli = document.createElement("li");
      hli.className = "pf-nav-hitem";
      hli.dataset.house = hid;
      const b = row("pf-nav-house", HOU[hid].name, list.length);
      b.setAttribute("aria-expanded", "false");
      hli.appendChild(b);
      const pul = document.createElement("ul");
      pul.className = "pf-nav-perfumes";
      pul.hidden = true;
      list.forEach((e) => {
        const pli = document.createElement("li");
        const pb = document.createElement("button");
        pb.type = "button";
        pb.className = "pf-nav-row pf-nav-perfume" + (e.p.at ? " is-here" : "");
        pb.dataset.entry = String(entries.indexOf(e));
        pb.innerHTML = '<span class="pf-nav-name">' + esc(e.p.n) + "</span><i>" + (e.p.y || "—") + "</i>";
        pli.appendChild(pb);
        pul.appendChild(pli);
      });
      hli.appendChild(pul);
      ul.appendChild(hli);
    });
    li.appendChild(ul);
    return ul;
  }
  function reveal(el, show) {
    if (show === !el.hidden) return;
    el.hidden = !show;
    if (show && !STILL) { el.classList.remove("pf-nav-opened"); void el.offsetWidth; el.classList.add("pf-nav-opened"); }
  }
  function syncNav() {
    let target = null;
    PERFUMERS.forEach((p) => {
      const li = navItems[p.id];
      const on = sel.pid === p.id;
      li.classList.toggle("is-on", on);
      li.firstChild.setAttribute("aria-expanded", on ? "true" : "false");
      const ul = on ? housesList(li, p.id) : li.querySelector(".pf-nav-houses");
      if (ul) reveal(ul, on);
      if (!on) return;
      target = li.firstChild;
      ul.querySelectorAll(".pf-nav-hitem").forEach((hli) => {
        const hon = sel.hid === hli.dataset.house;
        hli.classList.toggle("is-on", hon);
        hli.firstChild.setAttribute("aria-expanded", hon ? "true" : "false");
        reveal(hli.querySelector(".pf-nav-perfumes"), hon);
        if (hon) target = hli.firstChild;
      });
      ul.querySelectorAll(".pf-nav-perfume").forEach((b) => {
        const lit = sel.e === entries[+b.dataset.entry];
        b.classList.toggle("is-lit", lit);
        if (lit) target = b;
      });
    });
    navPath.textContent = !sel.kind ? "Choose a perfumer"
      : sel.kind === "year" ? (sel.year === "none" ? "Year not found" : String(sel.year))
      : [sel.pid && PER[sel.pid].name, sel.hid && HOU[sel.hid].name, sel.e && sel.e.p.n].filter(Boolean).join(" · ") || (sel.e ? sel.e.p.n : "");
    if (target) {
      // bring the chosen row into the list's view, never moving the page
      const sb = navScroll.getBoundingClientRect(), tb = target.getBoundingClientRect();
      if (tb.top < sb.top + 20 || tb.bottom > sb.bottom - 40) {
        navScroll.scrollTo({ top: navScroll.scrollTop + tb.top - sb.top - 30, behavior: STILL ? "auto" : "smooth" });
      }
    }
  }
  navList.addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.classList.contains("pf-nav-per")) {
      const pid = b.parentNode.dataset.per;
      if (sel.kind === "perfumer" && sel.pid === pid) choose(null);
      else choosePerfumer(pid);
    } else if (b.classList.contains("pf-nav-house")) {
      const hid = b.parentNode.dataset.house, pid = b.closest(".pf-nav-item").dataset.per;
      if (sel.kind === "house" && sel.hid === hid) choosePerfumer(pid);
      else chooseHouse(pid, hid);
    } else if (b.classList.contains("pf-nav-perfume")) {
      choosePerfume(entries[+b.dataset.entry]);
    }
  });
  // pointed at in the list, it lights on the chart
  navList.addEventListener("pointerover", (ev) => {
    if (ev.pointerType === "touch") return;
    const b = ev.target.closest("button");
    if (!b) return;
    let h = null;
    if (b.classList.contains("pf-nav-per")) {
      const pid = b.parentNode.dataset.per;
      h = { type: "list", list: entriesOf(pid), g: mode === "az" ? groups.find((g) => g.id === pid) : null };
    } else if (b.classList.contains("pf-nav-house")) {
      const hid = b.parentNode.dataset.house, pid = b.closest(".pf-nav-item").dataset.per;
      h = { type: "list", list: entries.filter((e) => e.pid === pid && e.p.h === hid), g: null };
    } else if (b.classList.contains("pf-nav-perfume")) {
      h = { type: "entry", e: entries[+b.dataset.entry] };
    }
    if (h && !(hover && hover.from === b)) { h.from = b; hover = h; kick(); }
  });
  navList.addEventListener("pointerleave", () => { if (hover && hover.from) { hover = null; kick(); } });
  // ---- THE LIST'S SEARCH (2026-11-03 — "Put a search button on the top
  // right of the perfumers list"): a perfumer, a house or a perfume, found
  // as it is typed, the list standing aside while it is; one chosen is
  // chosen on the chart as from the list, and the list comes back to it.
  const findBtn = nav.querySelector(".pf-nav-find");
  const findBox = nav.querySelector(".pf-nav-search");
  const query = nav.querySelector(".pf-nav-query");
  const found = nav.querySelector(".pf-nav-found");
  const findCount = nav.querySelector(".pf-nav-count");
  const fold = (t) => String(t).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const findables = [];
  PERFUMERS.forEach((p) => { if (p.id !== "not-found") findables.push({ kind: "perfumer", pid: p.id, name: p.name, sub: entriesOf(p.id).length + " perfumes" }); });
  const pairs = new Map();
  entries.forEach((e) => { const k = e.pid + "|" + e.p.h; if (!pairs.has(k)) pairs.set(k, { kind: "house", pid: e.pid, hid: e.p.h, name: HOU[e.p.h].name, sub: e.pid === "not-found" ? "perfumer not found" : PER[e.pid].name }); });
  pairs.forEach((v) => findables.push(v));
  entries.forEach((e) => findables.push({ kind: "perfume", e, name: e.p.n, sub: HOU[e.p.h].name + " · " + (e.p.y || "year not found") }));
  findables.forEach((f) => { f.key = fold(f.name); f.subKey = fold(f.sub); });
  const KIND_RANK = { perfumer: 0, house: 1, perfume: 2 };
  function search(q) {
    const t = fold(q.trim());
    if (!t) return null;
    const hits = [];
    for (const f of findables) {
      const at = f.key.indexOf(t);
      let rank = -1;
      if (at === 0) rank = 0;
      else if (at > 0 && /[^a-z0-9]/.test(f.key[at - 1])) rank = 1;
      else if (at > 0) rank = 2;
      else if (f.kind !== "perfumer" && f.subKey.indexOf(t) >= 0) rank = 3;
      if (rank >= 0) hits.push({ f, rank });
    }
    hits.sort((a, b) => a.rank - b.rank || KIND_RANK[a.f.kind] - KIND_RANK[b.f.kind] || cmp(a.f.name, b.f.name));
    return hits.map((h) => h.f);
  }
  const KIND_SAY = { perfumer: "Perfumer", house: "House", perfume: "Perfume" };
  let foundList = [];
  function showFound() {
    const r = search(query.value);
    if (!r) {
      found.hidden = true; navList.hidden = false;
      found.innerHTML = ""; findCount.textContent = "";
      foundList = [];
      return;
    }
    foundList = r.slice(0, 60);
    navList.hidden = true; found.hidden = false;
    findCount.textContent = r.length ? String(r.length) : "";
    found.innerHTML = foundList.length ? foundList.map((f, i) =>
      '<li><button type="button" class="pf-nav-row pf-nav-hit pf-nav-hit-' + f.kind + '" data-hit="' + i + '"><span class="pf-nav-name">' + esc(f.name) +
      '<small>' + KIND_SAY[f.kind] + " · " + esc(f.sub) + "</small></span></button></li>").join("")
      : '<li class="pf-nav-none">Nothing on the chart by that name.</li>';
    navScroll.scrollTop = 0;
  }
  function openFind(on) {
    if (on === !findBox.hidden) { if (on) query.focus(); return; }
    findBox.hidden = !on;
    findBtn.setAttribute("aria-expanded", on ? "true" : "false");
    nav.classList.toggle("is-finding", on);
    if (on) {
      if (phone && !navOpen) toggleNav(true);
      query.focus({ preventScroll: true });
    } else {
      query.value = "";
      showFound();
    }
  }
  function takeHit(f) {
    openFind(false);
    if (f.kind === "perfumer") choosePerfumer(f.pid);
    else if (f.kind === "house") chooseHouse(f.pid, f.hid);
    else choosePerfume(f.e);
  }
  findBtn.addEventListener("click", () => openFind(findBox.hidden));
  query.addEventListener("input", showFound);
  query.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") { ev.stopPropagation(); ev.preventDefault(); openFind(false); findBtn.focus({ preventScroll: true }); }
    else if (ev.key === "Enter") { ev.preventDefault(); if (foundList[0]) takeHit(foundList[0]); }
    else if (ev.key === "ArrowDown") { const b = found.querySelector("button"); if (b) { ev.preventDefault(); b.focus(); } }
  });
  found.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-hit]");
    if (b) takeHit(foundList[+b.dataset.hit]);
  });
  found.addEventListener("keydown", (ev) => {
    const b = ev.target.closest("[data-hit]");
    if (!b) return;
    const all = Array.from(found.querySelectorAll("[data-hit]")), i = all.indexOf(b);
    if (ev.key === "ArrowDown" && all[i + 1]) { ev.preventDefault(); all[i + 1].focus(); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); (all[i - 1] || query).focus(); }
    else if (ev.key === "Escape") { ev.stopPropagation(); ev.preventDefault(); openFind(false); findBtn.focus({ preventScroll: true }); }
  });
  found.addEventListener("pointerover", (ev) => {
    if (ev.pointerType === "touch") return;
    const b = ev.target.closest("[data-hit]");
    if (!b) return;
    const f = foundList[+b.dataset.hit];
    const h = f.kind === "perfume" ? { type: "entry", e: f.e }
      : { type: "list", list: f.kind === "house" ? entries.filter((e) => e.pid === f.pid && e.p.h === f.hid) : entriesOf(f.pid), g: null };
    h.from = b; hover = h; kick();
  });
  found.addEventListener("pointerleave", () => { if (hover && hover.from) { hover = null; kick(); } });

  function toggleNav(on) {
    navOpen = on;
    nav.classList.toggle("is-open", navOpen);
    navToggle.setAttribute("aria-expanded", navOpen ? "true" : "false");
    measure();
    setGoal(poseFor());
  }
  navToggle.addEventListener("click", () => toggleNav(!navOpen));

  // ---- STAYING PUT WHILE SOMETHING IS CHOSEN ("a fixed place, where you
  // cannot use the scrollwheel"): the wheel and the keys that scroll the page
  // do nothing over the chart; the list and an open window still scroll.
  function canScroll(el, dy) {
    if (!el || el.scrollHeight <= el.clientHeight + 1) return false;
    return dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1;
  }
  // listened for only while something is chosen, so the page's own
  // scrolling never waits on it the rest of the time
  function holdWheel(ev) {
    const t = ev.target && ev.target.closest ? ev.target : null;
    const list = t && t.closest(".pf-nav-scroll");
    if (list && canScroll(list, ev.deltaY)) return;
    if (t && t.closest(".pf-card") && canScroll(card, ev.deltaY)) return;
    if (t && t.closest(".pf-call") && canScroll(callSheet, ev.deltaY)) return;
    ev.preventDefault();
  }
  let holding = false;
  function hold(on) {
    if (on === holding) return;
    holding = on;
    if (on) window.addEventListener("wheel", holdWheel, { passive: false });
    else window.removeEventListener("wheel", holdWheel, { passive: false });
  }
  const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      if (!card.hidden && card.classList.contains("is-open")) { closeCard(); return; }
      if (sel.kind) { ev.preventDefault(); up(); }
      return;
    }
    if (!sel.kind || !card.hidden || !SCROLL_KEYS.has(ev.key)) return;
    const a = document.activeElement;
    if (a && a.closest && (a.closest(".pf-nav-scroll") || a.matches("input, textarea, select, button, summary, a"))) return;
    ev.preventDefault();
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
    arrange(m, true);
    // a year chosen means nothing A to Z; a perfumer chosen stays chosen
    if (m === "az" && sel.kind === "year") choose(null);
    else choose(sel.kind ? sel : null);
  }));
  backBtn.addEventListener("click", () => choose(null));

  // ---- THE WINDOW ---------------------------------------------------------
  const card = document.querySelector(".pf-card");
  const sheet = card.querySelector(".pf-card-sheet");
  const body = card.querySelector(".pf-card-body");
  const cardBack = card.querySelector(".pf-card-back");
  const cardClose = card.querySelector(".pf-card-close");
  let stack = [], current = null, opener = null, closeTimer = 0;
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
  // a list of perfumes as a plain table — the perfume, then the one other
  // thing the window is not already about, then its year — each perfume
  // pressed shown on the chart, lit, with its own small window
  function table(list, other) {
    const rows = list.slice().sort((a, b) => (a.p.y || 9999) - (b.p.y || 9999) || cmp(a.p.n, b.p.n));
    return '<table class="pf-card-table"><thead><tr><th scope="col">Perfume</th><th scope="col">' + (other === "house" ? "House" : "Perfumer") +
      '</th><th scope="col">Year</th></tr></thead><tbody>' + rows.map((e) =>
        "<tr><td>" + '<button type="button" class="pf-card-row' + (e.p.at ? " is-here" : "") + '" data-entry="' + entries.indexOf(e) + '">' + esc(e.p.n) + "</button></td>" +
        "<td>" + (other === "house" ? houseButton(e.p.h) : e.pid === "not-found" ? '<span class="pf-card-none">Not found</span>' : perfumerButton(e.pid)) + "</td>" +
        "<td>" + (e.p.y || '<span class="pf-card-none">—</span>') + "</td></tr>").join("") + "</tbody></table>";
  }
  const perfumerButton = (id) => '<button type="button" class="pf-card-link" data-perfumer="' + esc(id) + '">' + esc(PER[id].name) + "</button>";
  const houseButton = (id) => '<button type="button" class="pf-card-link" data-house="' + esc(id) + '">' + esc(HOU[id].name) + "</button>";

  // the windows, simple since 2026-11-03 ("Please make the popups simple;
  // perfumer, perfume, year, and source"): a name, a line about it, its
  // perfumes as a table, and the sources
  function renderPerfumer(id) {
    const p = PER[id], S2 = numberer();
    const mine = entriesOf(id);
    const idx = named.indexOf(p);
    const meta = [];
    if (p.born) meta.push("Born <b>" + esc(p.born) + "</b>");
    if (p.from) meta.push(esc(p.from));
    const aboutTxt = (p.about || []).map((a) => esc(a.t) + S2.ref(a.s)).join(" ");
    let h = '<p class="pf-card-kicker">' + (id === "not-found" ? "Not found" : "Perfumer · " + String(idx + 1).padStart(2, "0") + " of " + named.length) + "</p>";
    h += '<h2 class="pf-card-name" id="pf-card-name">' + esc(p.name) + "</h2>";
    if (meta.length) h += '<p class="pf-card-meta">' + meta.join(" · ") + "</p>";
    if (aboutTxt) h += '<div class="pf-card-about"><p>' + aboutTxt + "</p></div>";
    h += '<h3 class="pf-card-sub">' + (mine.length === 1 ? "Perfume" : mine.length + " perfumes") + "</h3>" + table(mine, "house");
    mine.forEach((e) => S2.add(e.p.s));
    h += S2.list();
    return h;
  }
  function renderHouse(id) {
    const ho = HOU[id], S2 = numberer();
    const list = entries.filter((e) => e.p.h === id);
    const meta = [];
    if (ho.founded) meta.push("Founded <b>" + esc(ho.founded) + "</b>");
    if (ho.from) meta.push(esc(ho.from));
    let h = '<p class="pf-card-kicker">House</p>';
    h += '<h2 class="pf-card-name" id="pf-card-name">' + esc(ho.name) + "</h2>";
    if (meta.length) h += '<p class="pf-card-meta">' + meta.join(" · ") + "</p>";
    if (ho.about) h += '<div class="pf-card-about"><p>' + esc(ho.about) + S2.ref(ho.s) + "</p></div>";
    const n = new Set(list.map((e) => e.p)).size;
    h += '<h3 class="pf-card-sub">' + (n === 1 ? "Perfume" : n + " perfumes") + "</h3>" + table(list, "perfumer");
    if (ho.page) h += '<a class="pf-card-go" href="' + esc(ROOT + ho.page) + '">Go to the house →</a>';
    list.forEach((e) => S2.add(e.p.s));
    h += S2.list();
    return h;
  }
  function render(item) {
    if (item.kind === "perfumer") return renderPerfumer(item.id);
    return renderHouse(item.id);
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
    closeTimer = setTimeout(() => { card.hidden = true; body.innerHTML = ""; kick(); }, STILL ? 0 : 450);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
    kick();
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
    // a perfume in a window's table: the window goes, and the chart shows it
    const row = ev.target.closest("[data-entry]");
    if (row) { const e = entries[+row.dataset.entry]; closeCard(); choosePerfume(e); return; }
  });
  cardClose.addEventListener("click", closeCard);
  cardBack.addEventListener("click", () => {
    const prev = stack.pop();
    if (prev) swap(prev);
    cardBack.hidden = !stack.length;
  });

  // ---- A PERFUME'S WINDOW, drawn out of the chart ---------------------------
  // (2026-11-03 — "let the popup window be animated with the chart, and the
  // animation would start from the perspective provided in image 1; such
  // that the specific perfume being viewed would be highlighted, then the
  // popup would appear. Please make the popups simple; perfumer, perfume,
  // year, and source"): no veil and no flight of its own. The chart goes (or
  // stays) where its house is seen, the perfume is lit there, a line is drawn
  // out of its dot and the window opens from the end of it — and then stands
  // beside the dot, carried with the chart as it sways or moves.
  const call = document.createElement("div");
  call.className = "pf-call";
  call.hidden = true;
  call.innerHTML = '<div class="pf-call-sheet" role="dialog" aria-labelledby="pf-call-name" tabindex="-1">' +
    '<button type="button" class="pf-call-close" aria-label="Close">×</button><div class="pf-call-body"></div></div>';
  stage.appendChild(call);
  const callSheet = call.querySelector(".pf-call-sheet"), callBody = call.querySelector(".pf-call-body");
  const callAt = { x: 0, y: 0, ok: false };   // its dot, on the window
  let callT0 = -1, callOff = { dx: 0, dy: 0 }, callW = 0, callH = 0, callX = 0, callY = 0, callTimer = 0, callOpener = null, lastCall = "";

  // a source said simply: where it is, linked, and what it is called there
  function shortSource(id) {
    const s = SRC[id];
    if (!s) return esc(id);
    const where = /\*(.+?)\*/.exec(s.cite), title = /“(.+?)”/.exec(s.cite);
    const href = s.url.startsWith("SITE:") ? ROOT + s.url.slice(5) : s.url;
    const at = where ? where[1] : s.url.replace(/^(SITE:|https?:\/\/)/, "").split("/")[0];
    return '<a href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(at) + "</a>" +
      (title ? " <span>" + esc(title[1].replace(/[.,]$/, "")) + "</span>" : "");
  }
  function renderCall(e) {
    const p = e.p, srcs = p.s || [];
    const who = p.p.map((id) => id === "not-found" ? '<span class="pf-call-none">Not found</span>'
      : '<button type="button" class="pf-call-link" data-perfumer="' + esc(id) + '">' + esc(PER[id].name) + "</button>").join('<span class="pf-call-and"> &amp; </span>');
    // written about on the site: its name is the way to it, the arrow kept
    // on the line of its last word
    const words = p.n.split(" "), last = words.pop();
    const name = p.at ? '<a class="pf-call-read" href="' + esc(ROOT + p.at) + '">' + esc(words.length ? words.join(" ") + " " : "") +
      '<span class="pf-call-tail">' + esc(last) + '<span class="pf-call-go" aria-hidden="true"> →</span></span></a>' : esc(p.n);
    return '<dl class="pf-call-facts">' +
      "<dt>Perfumer</dt><dd>" + who + (p.c === "house" ? '<span class="pf-call-aside">as the house’s perfumer</span>' : "") + "</dd>" +
      '<dt>Perfume</dt><dd class="pf-call-name" id="pf-call-name">' + name + "</dd>" +
      "<dt>Year</dt><dd>" + (p.y ? "<b>" + p.y + "</b>" : '<span class="pf-call-none">Not found</span>') + "</dd>" +
      "<dt>" + (srcs.length > 1 ? "Sources" : "Source") + "</dt><dd>" +
      (srcs.length ? '<ul class="pf-call-sources">' + srcs.map((id) => "<li>" + shortSource(id) + "</li>").join("") + "</ul>" : "—") + "</dd></dl>";
  }
  function callFor(e, delay) {
    if (!e) return;
    callWait = { e, t0: performance.now(), delay: STILL ? 0 : delay };
    kick();
  }
  function openCall(e) {
    if (sel.e !== e) return;
    clearTimeout(callTimer);
    if (!call.contains(document.activeElement)) callOpener = document.activeElement;
    callE = e;
    callBody.innerHTML = renderCall(e);
    call.classList.remove("is-open");
    call.hidden = false;
    callW = call.offsetWidth; callH = call.offsetHeight;
    placeCallFirst();
    callT0 = STILL ? -1 : performance.now();
    void call.offsetWidth;
    call.classList.add("is-open");
    callSheet.focus({ preventScroll: true });
    hint.textContent = window.matchMedia("(hover: none)").matches ? "" : "Esc to go back";
    kick();
  }
  function closeCall(quick) {
    callWait = null;
    if (!callE) return;
    callE = null;
    callAt.ok = false;
    call.classList.remove("is-open");
    clearTimeout(callTimer);
    const done = () => { call.hidden = true; callBody.innerHTML = ""; };
    if (quick || STILL) done(); else callTimer = setTimeout(done, 280);
    if (call.contains(document.activeElement)) {
      const o = callOpener;
      callOpener = null;
      if (o && o.isConnected && o.focus && o !== document.body) o.focus({ preventScroll: true });
      else document.activeElement.blur();
    }
    kick();
  }
  // put away by its ×, a press on nothing, or Esc: back to its house
  function dismissCall() { if (sel.kind === "perfume") up(); else closeCall(); }
  function dotOnWindow(e, o) {
    viewCam();
    proj(Math.cos(e.a) * e.rDot, Math.sin(e.a) * e.rDot, T2);
    if (!T2.ok) { o.ok = false; return o; }
    o.x = M.a * T2.x + M.c * T2.y + M.e;
    o.y = M.b * T2.x + M.d * T2.y + M.f;
    o.ok = true;
    return o;
  }
  // which side of its dot it stands: wherever it covers least — the room
  // left by the list, the notes and the chrome, then the names written out
  // to the right of the rim, then the nearest
  function placeCallFirst() {
    dotOnWindow(callE, callAt);
    const F = callRoom(), w = callW, h = callH, g = phone ? CALL_GAP * 0.8 : CALL_GAP, d = g * 0.72;
    const sb = stage.getBoundingClientRect();
    const blocks = [];
    document.querySelectorAll(".pf-here, .pf-sort, .pf-back, .pf-hint, .menu-trigger, .page-where").forEach((el) => {
      if (el.hidden) return;
      const b = el.getBoundingClientRect();
      if (b.width && b.height) blocks.push({ x0: b.left - sb.left - 6, y0: b.top - sb.top - 6, x1: b.right - sb.left + 6, y1: b.bottom - sb.top + 6 });
    });
    const fx = cam.cx * W, fy = cam.cy * H;
    const names = { x0: fx - 10, y0: fy - H * 0.42, x1: F.x1, y1: fy + H * 0.42 };
    const over = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
    const tries = [[-d - w, -d - h], [-g - w, -h / 2], [-d - w, d], [-w / 2, -g - h], [-w / 2, g], [d, -d - h], [g, -h / 2], [d, d]];
    let best = null, bs = Infinity;
    tries.forEach(([dx, dy], i) => {
      const r = { x0: callAt.x + dx, y0: callAt.y + dy, x1: callAt.x + dx + w, y1: callAt.y + dy + h };
      const inside = Math.max(0, Math.min(r.x1, F.x1 - 8) - Math.max(r.x0, F.x0 + 8)) * Math.max(0, Math.min(r.y1, F.y1 - 8) - Math.max(r.y0, F.y0 + 8));
      let score = (w * h - inside) * 5 + over(r, names) * 0.6 + i * 40;
      blocks.forEach((b) => (score += over(r, b) * 4));
      if (score < bs) { bs = score; best = { dx, dy }; }
    });
    callOff = best;
    lastCall = "";
    placeCall();
    // the window opens from where the line meets it
    const ox = clamp(callAt.x, callX, callX + w) - callX, oy = clamp(callAt.y, callY, callY + h) - callY;
    callSheet.style.setProperty("--ox", Math.round(ox) + "px");
    callSheet.style.setProperty("--oy", Math.round(oy) + "px");
  }
  // the room it may stand in: the chart's, and the notes' on the left too,
  // which step aside while anything is chosen
  const callRoom = () => ({ x0: 0, y0: L.free.y0, x1: L.free.x1, y1: L.free.y1 });
  function placeCall() {
    dotOnWindow(callE, callAt);
    if (!callAt.ok) return;
    const F = callRoom();
    const x = clamp(callAt.x + callOff.dx, F.x0 + 8, Math.max(F.x0 + 8, F.x1 - callW - 8));
    const y = clamp(callAt.y + callOff.dy, F.y0 + 8, Math.max(F.y0 + 8, F.y1 - callH - 8));
    callX = x; callY = y;
    const t = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
    if (t !== lastCall) { call.style.transform = t; lastCall = t; }
  }
  call.addEventListener("click", (ev) => {
    if (ev.target.closest(".pf-call-close")) { dismissCall(); return; }
    const per = ev.target.closest("[data-perfumer]");
    if (per) { choosePerfumer(per.dataset.perfumer); return; }
  });

  // ---- THE INDEX AND THE SOURCES AT THE FOOT, each behind its button --------
  // (the sources since 2026-11-03 — "make the perfumers page sources also
  // collapsible"): the same <details>, opening and shutting the same way.
  document.querySelectorAll(".pf-fold").forEach((fold) => {
    const open = fold.querySelector(".pf-index-open");
    let timer = 0;
    open.addEventListener("click", (ev) => {
      if (STILL) return;
      ev.preventDefault();
      clearTimeout(timer);
      if (fold.open) {
        fold.classList.remove("is-opening");
        fold.classList.add("is-closing");
        timer = setTimeout(() => { fold.open = false; fold.classList.remove("is-closing"); }, 260);
      } else {
        fold.classList.remove("is-closing");
        fold.open = true;
        fold.classList.add("is-opening");
        timer = setTimeout(() => fold.classList.remove("is-opening"), 760);
      }
    });
    // an address pointing into it opens it
    const toHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const t = id && document.getElementById(id);
      if (t && fold.contains(t) && !fold.open) { fold.open = true; t.scrollIntoView(); }
    };
    window.addEventListener("hashchange", toHash);
    toHash();
  });
  // the dropdowns at the foot (the legend, the terms, the disclaimer): an
  // address into one opens it — the title's asterisk is #disclaimer
  const toDrop = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const t = id && document.getElementById(id);
    const d = t && t.closest(".pf-drop");
    if (d && !d.open) d.open = true;
    if (d) d.scrollIntoView({ behavior: STILL ? "auto" : "smooth", block: "center" });
  };
  window.addEventListener("hashchange", toDrop);
  toDrop();
  const star = document.querySelector(".pf-star");
  if (star) star.addEventListener("click", (ev) => {
    if (location.hash === "#disclaimer") { ev.preventDefault(); toDrop(); }
  });
  const ic = document.querySelector("[data-index-counts]");
  if (ic && D.counts) ic.textContent = D.counts.perfumers + " perfumers · " + D.counts.houses + " houses · " + D.counts.perfumes + " perfumes";
  const sc = document.querySelector("[data-source-count]");
  if (sc && D.sources) sc.textContent = D.sources.length + " sources";
  // the index's perfumers open the same window
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
    counts.textContent = D.counts.perfumes + " perfumes · " + D.counts.onSite + " written about on The Taste of Aldehydes · " +
      D.counts.perfumers + " perfumers · " + D.counts.houses + " houses";
  }

  // ---- NOTHING DRAWN THAT CANNOT BE SEEN -----------------------------------
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((list) => {
      seen = list[list.length - 1].isIntersecting;
      if (seen) { last = 0; kick(); }
    }).observe(stage);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { last = 0; kick(); } });
  // nor under the site's Menu, which stands over the page
  let menuOpen = false;
  new MutationObserver(() => {
    const was = menuOpen;
    menuOpen = document.body.classList.contains("menu-open");
    if (was && !menuOpen) { last = 0; kick(); }
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // the stage is never scrolled within itself (where `overflow: clip` is not
  // known, `hidden` still lets a focus scroll it)
  stage.addEventListener("scroll", () => { if (stage.scrollTop || stage.scrollLeft) { stage.scrollTop = 0; stage.scrollLeft = 0; } });

  // ---- BEGIN -------------------------------------------------------------
  pressSort(mode);
  buildNav();
  let resizeQ = 0;
  window.addEventListener("resize", () => {
    if (resizeQ) return;
    resizeQ = requestAnimationFrame(() => { resizeQ = 0; resize(); });
  });
  measure();
  sizeCanvases();
  arrange(mode, false);
  Object.assign(goal, overviewPose());
  goal.rot = 0;
  jumpCam();
  showChosen();
  setView("live");
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { widths.clear(); charsMemo.clear(); widthsEpoch++; measureGroups(); rotorDirty = chartDirty = true; kick(); });
  }
  kick();

  // for whoever needs to look at it from outside (the tests)
  window.PerfumersChart = {
    choose: (kind, a, b) => {
      if (!kind) choose(null);
      else if (kind === "perfumer") choosePerfumer(a);
      else if (kind === "house") chooseHouse(a, b);
      else if (kind === "year") chooseYear(a);
    },
    up,
    arrange: (m) => { const b = sortBtns.find((x) => x.dataset.sort === m); if (b) b.click(); },
    state: () => ({
      mode, n: N, view: viewNow, zoomed: zoomed(), chosen: Object.assign({}, sel, { e: sel.e ? sel.e.p.n : null }),
      rot: cam.rot, cam: Object.assign({}, cam, { z: Math.exp(cam.lz) }), sway: swayAmt, dof: cvDof.classList.contains("is-on"),
      pulses: pulses.length, clock, call: callE ? callE.p.n : null, flying,
    }),
    // where a perfume's dot stands on the window
    dotOf: (name) => {
      const e = entries.find((x) => x.p.n === name);
      if (!e) return null;
      dotOnWindow(e, T1);
      const b = stage.getBoundingClientRect();
      return T1.ok ? { x: b.left + T1.x, y: b.top + T1.y } : null;
    },
    stats: () => Object.assign({}, stats),
    open: openCard,
    // where on the window a group (a perfumer A–Z, a year by year) or one of
    // the chosen perfumer's houses stands, for a test to press
    pointOf: (key, house) => {
      const g = groups.find((x) => x.key === key);
      if (!g) return null;
      const h = house ? g.houses.find((x) => x.h === house) : null;
      const a = h ? (h.a0 + h.a1) / 2 : (g.a0 + g.a1) / 2;
      viewCam();
      proj(Math.cos(a) * R.und, Math.sin(a) * R.und, T0);
      const b = stage.getBoundingClientRect();
      return { x: b.left + M.a * T0.x + M.c * T0.y + M.e, y: b.top + M.b * T0.x + M.d * T0.y + M.f };
    },
  };
})();

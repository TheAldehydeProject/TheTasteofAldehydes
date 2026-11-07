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
// REMODELLED 2026-11-06 after another picture of the owner's — a poster of
// the Earth drawn as an architect draws it, its bands of information
// standing out round it ("It should look like the earth, with then three
// layers of information in series protruding from it, which is going to be
// the perfumer, the house and then the perfume. It should look like an
// architect's sketch of the earth. I want this to occupy the majority of
// the page ... the zoom length should be fixed, and the scrolling while
// hovering on the image will cause you to scroll through the perfumes of
// that house/perfumer").
//
// WHAT IT DRAWS, from the middle out (world units; R below):
//   THE EARTH     in the middle, upright, turning slowly on its axis: drawn
//                 as an architect's sketch — its coastlines in a hairline
//                 with two waterlines off them, the land hatched, the
//                 graticule every fifteen degrees, the latitudes named down
//                 its left. (The cross through its middle, run out to a
//                 cross-hair at each end, went on 2026-11-07: "remove the
//                 crosshairs in the cardinal directions, and the cross going
//                 through the center of the world".)
//                 A square marks every country a house is from, a ring every
//                 country a perfumer is from (the ledger's countries: a pin
//                 is the country, never a town), and from each house's
//                 country a line runs to every one of its perfumes' places on
//                 the rings, as the picture's lines run from its cities.
//                 (Natural Earth's coastlines, perfumers-earth.js.)
//   THE THREE RINGS, in series, a cell in each for every perfume:
//     1 PERFUMER  a cell filled where a source names the perfumer, half
//                 filled where it is the house's perfumer, empty where none
//                 is found; the perfumers' names along it (years, By year).
//     2 HOUSE     a cell in the colour of where the perfume is: gold, an
//                 individual fragrance written about here; blue-white, a
//                 house perfume written about here; rose, Prin Lomros'
//                 houses, not written about here. A chosen perfumer's houses
//                 are named along it.
//     3 PERFUME   a bar as long as ITS YEAR — 2009 shortest, 2026 longest,
//                 the years' rings behind them — ending in its dot; a perfume
//                 no source dates ends hollow on the dashed ring beyond.
//                 Now and then a light runs from its house's country through
//                 the three rings to its dot, which flares.
//   THE RIM       a tick for every perfume; its number and year are written
//                 only for what is chosen, a faint line for the rest.
//   THE LABELS    every perfume's name past the rim — written out only for
//                 what is chosen, the poster's faint lines for the rest.
//
// CHOOSING: a perfumer (on the circle, or in THE LIST down the right, A to
// Z), then one of its houses, then a perfume, which opens its window. The
// camera flies to what is chosen, ALWAYS AS CLOSE (the zoom fixed), and the
// Earth turns to its country; there THE WHEEL, a swipe, the arrow keys or
// the scrubber beside the chart go through its perfumes one after another
// (Prin Lomros' 139 among them), the page held still under it; Esc, the list
// or "The whole chart" go back up. By year, the circle's groups are years.
//
// HOW IT IS KEPT SMOOTH — three layers, so that nothing is drawn again only
// because it moves:
//   THE ROTOR   (.pf-rotor) the three rings and the rim at rest, drawn ONCE
//               into a square canvas that the browser TURNS by its
//               transform: the slow turn costs nothing a frame.
//   THE SWAY    (.pf-sway) the chart in perspective, the Earth with it —
//               drawn every frame only while the camera flies; close in,
//               drawn once, with its out-of-focus copy, and SWAYED by its
//               transform, slowly. (The Earth stands still close in.)
//   THE LIVE    (.pf-live) what moves of itself: the Earth on the whole
//               chart — drawn into a picture of its own only when it has
//               turned by a third of a pixel, and laid down every frame —
//               its lines out to the rings, the far field and the dust
//               drifting, the lights, the names while the chart turns (so
//               they never stand upside down), what the hand is on.
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
// turn or sway, no lights run, the Earth stands still (turned at once to
// what is chosen), the camera and the switch go at once.
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
  // THE NAMES ON THE RINGS AT REST, a picture of their own in the rotor
  // (2026-11-07 — "optimize this page as much as you can"): drawn into it a
  // few times a second and turned with the chart by the browser in between,
  // where until then they were drawn into the live layer — the whole window,
  // at the screen's full sharpness — every frame.
  const cvNames = document.createElement("canvas");
  cvNames.className = "pf-turn-names";
  rotor.appendChild(cvNames);
  const nctx = cvNames.getContext("2d");
  let namesRot = 0, namesKey = "";
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
  // (2026-11-06: the Earth in the middle, and the three rings in series
  // standing out from it — the perfumer, the house, the perfume)
  const R = {
    earth: 468,                // the Earth's radius
    frame0: 476, frame1: 484,  // its frame, a double circle
    per0: 494, perCell: 505, per1: 522,   // RING 1, the perfumer: its cells, and its names over them
    hou0: 530, houCell: 540, hou1: 554,   // RING 2, the house: the same
    base: 564,                 // RING 3, the perfume: where every bar leaves from
    y0: 578, y1: 702,          // 2008 … 2026
    und: 718,                  // the ring of perfumes with no year found
    tick0: 734, tick1: 742,    // the rim's ticks
    num: 748,                  // the rim's numbers
    label: 806,                // the names past the rim
    dust0: 790, dust1: 1150,
    fit: 890,                  // what the whole chart is fitted to
    out: 990,                  // the farthest of the faint lines past the rim: the stage is made as tall as this
    look: 740,                 // the radius a close look is centred on
  };
  R.perMid = (R.perCell + R.per1) / 2 + 0.5;
  R.houMid = (R.houCell + R.hou1) / 2 + 0.5;
  const Y_FROM = 2008, Y_TO = 2026;
  const GAP = 2.4;             // slots of gap before each group
  const HGAP = 0.7;            // slots of gap between two houses of one group
  const TOPGAP = 9;            // slots of gap at the top, where the rings are named
  const SORT_MS = 1700, INTRO_MS = 2100, EM_MS = 650;
  const TILT = 0.94;           // how far a close look tips the chart back
  const TURN_S = 260;          // seconds the chart takes to turn once, at rest
  const SPIN = TAU / TURN_S;
  const SPRING = 5.8;          // the camera's two springs (per second) — gentler since 2026-11-03 ("make the animation smoother")
  const REST_PX = 0.35;        // the camera is at rest once nothing is left to move by more than this
  const DIM = 0.2;             // what is not chosen, of itself
  const AROUND = 0.46;         // the rest of a chosen perfume's house, of itself
  const FLIP = 0.07;           // a name on the rim turns over across this band, crossfading
  // THE FIXED ZOOM (2026-11-06 — "the zoom length should be fixed"): every
  // choice is looked at from as close as every other, a perfumer of one
  // perfume and Prin Lomros' 139 alike; what does not fit on the window is
  // gone through by the wheel
  const Z_FIX = 1.8, Z_FIX_PHONE = 1.2;
  const WHEEL_PX = 42;         // a perfume a step of this much of the wheel
  const SWIPE_PX = 26;         // a perfume a step of this much of a finger
  // the Earth: how it is seen, how fast it turns, how fast it turns to a choice
  const EARTH_TILT = 0.4;      // radians: it is seen from a little above its equator
  const EARTH_SPIN = TAU / 360;   // once in six minutes
  const EARTH_TO = 1.6;        // per second, turning to what is chosen
  // a perfume's window (2026-11-03): lit first, then the window drawn out of it
  const CALL_AFTER = 560;      // ms the perfume is lit before its window comes
  const CALL_WAIT = 2400;      // at most this long waiting for the chart to settle
  const CALL_LINE_MS = 320;    // the line drawn out to the window
  const CALL_GAP = 46;         // from the dot to the window, about
  // the sway close in: a slow roll about the point looked at, a breath of
  // scale, a drift of a few pixels — the browser's to draw (`swayBox`)
  const SWAY = { roll: 0.03, roll2: 0.011, breath: 0.011, dx: 7, dy: 4, rollHz: 1 / 27, roll2Hz: 1 / 11.5, breathHz: 1 / 19, driftHz: 1 / 23 };
  const RGB = { gold: "235,163,63", blue: "188,211,234", rose: "226,88,126", ink: "235,232,226", muted: "141,143,146", sea: "15,17,20", land: "36,38,43" };
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
  const byTone = {};
  TONES.forEach((t) => (byTone[t] = entries.filter((e) => e.tone === t)));
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

  // ---- WHERE THEY ARE FROM, on the Earth ---------------------------------
  // Only the countries the ledger gives a house or a perfumer ("from"), each
  // pinned at the middle of the country — a pin says the country and nothing
  // nearer; a house or a perfumer the ledger gives no country has no pin.
  const DEG = Math.PI / 180;
  const COUNTRY = {
    "United States": [39.5, -98.5], "United Kingdom": [54, -2.4], "France": [46.6, 2.4],
    "Spain": [40.2, -3.6], "Italy": [42.8, 12.6], "Poland": [52.1, 19.4], "Romania": [45.9, 25],
    "Thailand": [15.4, 101], "Taiwan": [23.7, 121], "Indonesia": [-2.4, 117.5],
  };
  const pins = new Map();      // country -> { name, lat, lon, houses:[], perfumers:[], entries:[] }
  function pinOf(country) {
    if (!country || !COUNTRY[country]) return null;
    if (!pins.has(country)) {
      const [la, lo] = COUNTRY[country];
      pins.set(country, { name: country, lat: la * DEG, lon: lo * DEG, houses: [], perfumers: [], entries: [], x: 0, y: 0, z: 0 });
    }
    return pins.get(country);
  }
  D.houses.forEach((h) => { const p = pinOf(h.from); if (p) p.houses.push(h.id); });
  D.perfumers.forEach((q) => { const p = pinOf(q.from); if (p) p.perfumers.push(q.id); });
  entries.forEach((e) => { e.pin = pinOf(HOU[e.p.h].from); if (e.pin) e.pin.entries.push(e); });
  const PINS = Array.from(pins.values());
  // the country the Earth turns to for a choice: the house's, or the
  // perfumer's own, or that of the house most of its perfumes are from
  function countryOf(list, pid) {
    const n = new Map();
    list.forEach((e) => { if (e.pin) n.set(e.pin, (n.get(e.pin) || 0) + 1); });
    let best = null, bn = 0;
    n.forEach((v, k) => { if (v > bn) { bn = v; best = k; } });
    if (best) return best;
    return pid && PER[pid] ? pinOf(PER[pid].from) : null;
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
    // the gaps: one before every group, a smaller one between two houses of
    // a group, and a wide one at the top, where the three rings are named
    let gaps = TOPGAP + (gs.length - 1) * GAP;
    gs.forEach((g) => g.members.forEach((e, j) => { if (j && e.p.h !== g.members[j - 1].p.h) gaps += HGAP; }));
    slot = TAU / (N + gaps);
    gapAngle = -Math.PI / 2;
    let i = 0, at = TOPGAP / 2;
    gs.forEach((g, gi) => {
      if (gi) at += GAP;
      g.members.forEach((e, j) => {
        if (j && e.p.h !== g.members[j - 1].p.h) at += HGAP;
        e.from = e.a;
        e.to = -Math.PI / 2 + (at + 0.5) * slot;
        e.no = i + 1;
        e.g = g;
        i++; at++;
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
  // the perfumers' names along ring 1, the houses' along ring 2 — no taller
  // than their rings
  const NAME_SIZES = [10.5, 8.5, 6.5, 5];
  const HOUSE_SIZES = [9, 7.5, 6, 5, 4, 3.2];
  function fitSize(txt, a0, a1, sizes, font, track, r) {
    for (const s of sizes) if (arcLen(txt, s, font, track(s)) < (a1 - a0) * r - 6) return s;
    return 0;
  }
  // a chosen perfumer's houses are written as large as their arcs allow on
  // the whole chart, and no larger than reads well close in
  function houseSize(h, z) {
    let best = 0;
    for (const s of h.sizes) { if (s * z <= 15) return s; best = s; }
    return best;
  }
  function measureGroups() {
    groups.forEach((g) => {
      g.text = g.label.toUpperCase();
      g.size = fitSize(g.text, g.a0, g.a1, NAME_SIZES, F.group, trackOf, R.perMid);
      g.houses.forEach((h) => {
        h.text = HOU[h.h].name.toUpperCase();
        h.sizes = mode === "az" ? HOUSE_SIZES.filter((sz) => arcLen(h.text, sz, F.house, 0.18) < (h.a1 - h.a0) * R.houMid - 4) : [];
        h.size = h.sizes[0] || 0;
      });
      g.members.forEach((e) => (e.withWho = mode === "year"));
    });
  }

  // ---- THE LAYOUT -------------------------------------------------------
  let W = 0, H = 0, VH = 800, DPR = 1, OV = 0, S = 0, fitZ = 0.3, phone = false;
  const L = { ocx: 0.5, ocy: 0.5, oz: 0.3, zx: 0.4, zy: 0.56, zoomH: 600, free: { x0: 0, y0: 0, x1: 0, y1: 0 } };
  let navOpen = false;
  let rotorDirty = true, chartDirty = true;
  const sharp = typeof window.Sharpness === "function"
    ? window.Sharpness(() => { sizeCanvases(); rotorDirty = chartDirty = true; dofOff(); kick(); })
    : null;

  function measure() {
    phone = PHONE.matches;
    // THE STAGE A LITTLE TALLER THAN THE WINDOW (2026-11-07 — "make sure that
    // it extends a little more down"): the chart is sized by the window, as it
    // was, and the stage made as tall as its farthest faint lines need, so
    // the circle is whole — it was cut at the window's foot. Everything that
    // stands over the chart is placed by the window (--pf-vh), not the stage.
    VH = Math.max(320, window.innerHeight || 0);
    stage.style.setProperty("--pf-vh", VH + "px");
    W = stage.clientWidth;
    if (phone) { if (stage.style.height) stage.style.height = ""; }
    else {
      const navW = nav.hidden || nav.classList.contains("is-folded") ? 0 : nav.getBoundingClientRect().width;
      const roomX = W - (navW ? navW + 30 + 14 : 0);
      const z0 = Math.max(140, Math.min(roomX, VH - 12)) / (2 * R.fit);
      const want = Math.max(VH, Math.ceil(2 * R.out * z0 + 24));
      if (stage.style.height !== want + "px") stage.style.height = want + "px";
    }
    H = stage.clientHeight;
    DPR = sharp ? sharp.ratio : Math.min(window.devicePixelRatio || 1, 2);
    OV = Math.ceil(Math.max(W, H) * (phone ? 0.05 : 0.06));
    const sb = stage.getBoundingClientRect();
    let x0 = 0, x1 = W, y0 = 0, y1 = H;
    if (!phone && !nav.hidden && !nav.classList.contains("is-folded")) {
      const b = nav.getBoundingClientRect();
      if (b.width) x1 = b.left - sb.left - 14;
    }
    // the words that stand over the stage: the chart's rings are kept clear
    // of them, and only its faint outer parts pass under them
    const clear = [];
    const box = (el) => {
      if (!el) return;
      const b = el.getBoundingClientRect();
      if (b.width && b.height) clear.push({ x0: b.left - sb.left - 10, y0: b.top - sb.top - 10, x1: b.right - sb.left + 10, y1: b.bottom - sb.top + 10 });
    };
    const notes = document.querySelector(".pf-notes");
    if (notes && getComputedStyle(notes).position === "absolute") box(document.querySelector(".pf-notes-left"));
    if (phone) {
      const t = title.getBoundingClientRect();
      y0 = Math.max(0, t.bottom - sb.top + 4);
      y1 = H - 60;
    } else {
      box(title.querySelector(".pf-title-word"));
      box(title.querySelector(".pf-title-years"));
      y0 = 6; y1 = H - 6;
    }
    // the chart's size is the window's room, never the taller stage's
    const roomY = phone ? y1 - y0 : Math.min(y1 - y0, VH - 12);
    L.free = { x0, y0, x1, y1 };
    // the chart as big as the stage's height lets it be ("I want this to
    // occupy the majority of the page"), moved right as far as it takes to
    // keep its rings clear of the title and the intro — and a little smaller
    // only if that is not enough
    const hits = (cx, cy, rr) => clear.some((b) => {
      const dx = Math.max(b.x0 - cx, 0, cx - b.x1), dy = Math.max(b.y0 - cy, 0, cy - b.y1);
      return dx * dx + dy * dy < rr * rr;
    });
    let room = Math.max(140, Math.min(x1 - x0, roomY));
    let cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    for (let tries = 0; tries < 16; tries++) {
      const z = room / (2 * R.fit), rr = R.tick1 * z + 8;
      cx = (x0 + x1) / 2;
      while (hits(cx, cy, rr) && cx + rr < x1 - 4) cx += 4;
      if (!hits(cx, cy, rr)) break;
      room *= 0.96;
    }
    fitZ = room / (2 * R.fit);
    L.ocx = cx / W;
    L.ocy = cy / H;
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
    L.zy = phone ? (navOpen ? 0.26 : 0.46) : (0.56 * Math.min(H, VH)) / H;
    L.zoomH = phone ? H * (navOpen ? 0.36 : 0.56) : Math.min(H, VH) * 0.8;
    S = Math.ceil(2 * R.fit * fitZ) + 4;
    stage.style.setProperty("--chart-x", Math.round(L.ocx * W) + "px");
  }
  function sizeCanvases() {
    if (sharp) DPR = sharp.ratio;
    const k = DPR;
    // the chart in perspective is only ever drawn with the page at its top
    // (anything chosen holds it there), so it is drawn only as tall as the
    // window, not the taller stage (2026-11-07)
    const cw = W + 2 * OV, ch = Math.min(H, VH) + 2 * OV;
    cvChart.width = Math.round(cw * k); cvChart.height = Math.round(ch * k);
    cvDof.width = Math.round(cw * k * 0.5); cvDof.height = Math.round(ch * k * 0.5);
    // (on a plain screen too since 2026-11-07: three quarters of its pixels while it moves)
    FLY_K = k > 1.25 ? Math.max(1, k * 0.6) : k * 0.75;
    cvFly.width = FLY_K < k ? Math.round(cw * FLY_K) : 1; cvFly.height = FLY_K < k ? Math.round(ch * FLY_K) : 1;
    [cvChart, cvDof, cvFly].forEach((c) => {
      c.style.left = -OV + "px"; c.style.top = -OV + "px";
      c.style.width = cw + "px"; c.style.height = ch + "px";
    });
    liveK = 0; liveHiUntil = performance.now() + LIVE_HI_MS;
    liveRes(performance.now());
    cvTurn.width = Math.round(S * k); cvTurn.height = Math.round(S * k);
    cvNames.width = cvTurn.width; cvNames.height = cvTurn.height;
    namesKey = "";
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
    syncScrub();
    earthKey = "";
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
  // the turn a name's reading way is decided by: the camera's own, or — for
  // the names drawn into the rotor, unturned — the turn the rotor stands at
  let flipRot = null;
  function arcText(c, txt, r, mid, size, font, track, alpha) {
    if (alpha <= 0.003) return;
    const wb = smooth((Math.sin(mid + (flipRot === null ? V.rot : flipRot)) + FLIP) / (2 * FLIP));
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
  // ---- THE EARTH, as an architect draws it -------------------------------
  // Its coastlines (perfumers-earth.js: Natural Earth's land, public domain)
  // kept as each point's longitude and the cosine and sine of its latitude,
  // and turned on the Earth's axis by `spin` — the longitude facing you.
  // Seen in orthographic projection from EARTH_TILT above the equator:
  // (x right, y up, z towards you), on a sphere of radius 1.
  const COAST = (window.PERFUMERS_EARTH || []).map((r) => {
    const n = r.length / 2, lam = new Float32Array(n), cp = new Float32Array(n), sp = new Float32Array(n);
    const cl = new Float32Array(n), sl = new Float32Array(n);
    let area = 0;
    for (let i = 0; i < n; i++) {
      lam[i] = r[2 * i] * DEG; const ph = r[2 * i + 1] * DEG;
      cp[i] = Math.cos(ph); sp[i] = Math.sin(ph); cl[i] = Math.cos(lam[i]); sl[i] = Math.sin(lam[i]);
      const j = (i + 1) % n;
      area += r[2 * i] * r[2 * j + 1] - r[2 * j] * r[2 * i + 1];
    }
    // which way round it runs, so that where it goes behind the Earth it is
    // joined along the rim on the side of its own land
    return { n, lam, cp, sp, cl, sl, cw: area < 0 };
  });
  const EX = new Float32Array(2048), EY = new Float32Array(2048), EZ = new Float32Array(2048);
  const cT = Math.cos(EARTH_TILT), sT = Math.sin(EARTH_TILT);
  let spin = -28 * DEG;        // the Atlantic facing you first, as in the picture
  let spinTween = null;        // its turn to a choice: { from, to, t0, ms }
  function turnEarthTo(pin) {
    if (!pin) { spinTween = null; return; }
    let to = pin.lon - 0.12;
    while (to - spin > Math.PI) to -= TAU;
    while (to - spin < -Math.PI) to += TAU;
    spinTween = { from: spin, to, t0: performance.now(), ms: STILL ? 0 : 2200 };
  }
  const E3 = { x: 0, y: 0, z: 0 };
  function onEarth(lam, cp, sp, o) {
    const d = lam - spin, cl = Math.cos(d);
    o.x = cp * Math.sin(d);
    o.y = cT * sp - sT * cp * cl;
    o.z = sT * sp + cT * cp * cl;
    return o;
  }
  PINS.forEach((p) => { p.cp = Math.cos(p.lat); p.sp = Math.sin(p.lat); });
  function placePins() { for (const p of PINS) { onEarth(p.lon, p.cp, p.sp, E3); p.x = E3.x; p.y = E3.y; p.z = E3.z; } }
  // a hatch for the land, made once
  let hatch = null;
  function hatchFor(c) {
    if (hatch && hatch.c === c) return hatch.p;
    const t = document.createElement("canvas");
    t.width = t.height = 7;
    const h = t.getContext("2d");
    h.strokeStyle = SOLID.ink; h.globalAlpha = 0.5; h.lineWidth = 0.6;
    h.beginPath(); h.moveTo(-1, 8); h.lineTo(8, -1); h.stroke();
    hatch = { c, p: c.createPattern(t, "repeat") };
    return hatch.p;
  }
  // The Earth drawn through a mapping from its own (x, y) — flat on the
  // window for its picture, or onto the chart's plane through the camera —
  // with as much of it as the moment asks for (`fine`: the waterlines and
  // the hatching).
  const EM = { flat: true, cx: 0, cy: 0, r: 1, cr: 1, sr: 0 };
  function emap(x, y, o) {
    if (EM.flat) { o.x = EM.cx + EM.r * x; o.y = EM.cy - EM.r * y; o.ok = true; o.k = 1; return o; }
    const ex = R.earth * x, ey = -R.earth * y;
    return proj(ex * EM.cr - ey * EM.sr, ex * EM.sr + ey * EM.cr, o);
  }
  function earthUpright() { EM.flat = false; EM.cr = Math.cos(-V.rot); EM.sr = Math.sin(-V.rot); }
  // the land as two paths: closed and filled — cut at the rim where it goes
  // round behind the Earth and joined along the rim the shorter way, so no
  // straight cut runs across the face — and the coast as a stroke, broken
  // where it goes behind
  function landPaths() {
    const fill = new Path2D(), coast = new Path2D();
    const cS = Math.cos(spin), sS = Math.sin(spin);
    for (const r of COAST) {
      // (the turn by angle addition: no sine or cosine a point)
      let front = 0;
      for (let i = 0; i < r.n; i++) {
        const cd = r.cl[i] * cS + r.sl[i] * sS, sd = r.sl[i] * cS - r.cl[i] * sS, cp = r.cp[i], sp = r.sp[i];
        EX[i] = cp * sd; EY[i] = cT * sp - sT * cp * cd; EZ[i] = sT * sp + cT * cp * cd;
        if (EZ[i] >= 0) front++;
      }
      if (!front) continue;
      clipRing(fill, r.n, front === r.n, r.cw);
      let pen = false;
      for (let i = 0; i < r.n; i++) {
        if (EZ[i] < 0) { pen = false; continue; }
        emap(EX[i], EY[i], T0);
        if (!T0.ok) { pen = false; continue; }
        if (pen) coast.lineTo(T0.x, T0.y); else { coast.moveTo(T0.x, T0.y); pen = true; }
      }
      if (EZ[0] >= 0 && EZ[r.n - 1] >= 0) { emap(EX[0], EY[0], T0); if (T0.ok) coast.lineTo(T0.x, T0.y); }
    }
    return { fill, coast };
  }
  // A ring of land on the Earth's face, clipped where it goes round behind:
  // cut into the pieces that are on the face, and each piece's end on the
  // rim joined round the rim — the way the ring runs, so its land stays on
  // the side it is on — to the start of the piece that comes next there.
  // (ex, ey, ez: the ring turned, z towards you; cw: which way round it runs;
  // put(x, y, first): a point of the outline, on the face's unit circle.)
  function clipFace(ex, ey, ez, n, cw, put) {
    let s0 = -1;
    for (let i = 0; i < n; i++) if (ez[i] >= 0 && ez[(i - 1 + n) % n] < 0) { s0 = i; break; }
    if (s0 < 0) return;
    const cross = (a, b) => {
      const t = ez[a] / (ez[a] - ez[b]);
      const px = ex[a] + (ex[b] - ex[a]) * t, py = ey[a] + (ey[b] - ey[a]) * t, m = Math.hypot(px, py) || 1;
      return [px / m, py / m];
    };
    // the pieces on the face, each from where it comes on to where it goes off
    const pieces = [];
    let cur = null;
    for (let k = 0; k < n; k++) {
      const b = (s0 + k) % n, a = (b - 1 + n) % n;
      const va = ez[a] >= 0, vb = ez[b] >= 0;
      if (!va && vb) { const c = cross(a, b); cur = { in: Math.atan2(c[1], c[0]), pts: [c, [ex[b], ey[b]]] }; }
      else if (va && vb) { if (cur) cur.pts.push([ex[b], ey[b]]); }
      else if (va && !vb && cur) { const c = cross(a, b); cur.pts.push(c); cur.out = Math.atan2(c[1], c[0]); pieces.push(cur); cur = null; }
    }
    if (!pieces.length) return;
    const used = new Array(pieces.length).fill(false);
    // how far round the rim, the way the ring runs, from one angle to another
    const ahead = (from, to) => { let d = cw ? from - to : to - from; while (d < 0) d += TAU; while (d >= TAU) d -= TAU; return d; };
    for (let s = 0; s < pieces.length; s++) {
      if (used[s]) continue;
      let p = s, first = true;
      for (let guard = 0; guard <= pieces.length; guard++) {
        used[p] = true;
        const pc = pieces[p];
        for (const q of pc.pts) { put(q[0], q[1], first); first = false; }
        // the piece whose start comes first round the rim from this end
        let next = -1, best = Infinity;
        for (let j = 0; j < pieces.length; j++) { const d = ahead(pc.out, pieces[j].in); if (d < best) { best = d; next = j; } }
        const steps = Math.ceil(best / 0.06);
        for (let j = 1; j < steps; j++) { const an = pc.out + (cw ? -1 : 1) * (best * j) / steps; put(Math.cos(an), Math.sin(an), false); }
        if (next < 0 || used[next]) break;
        p = next;
      }
      put(NaN, NaN, false);
    }
  }
  function clipRing(x, n, all, cw) {
    if (all) {
      for (let i = 0; i < n; i++) { emap(EX[i], EY[i], T0); if (!i) x.moveTo(T0.x, T0.y); else x.lineTo(T0.x, T0.y); }
      x.closePath();
      return;
    }
    clipFace(EX, EY, EZ, n, cw, (px, py, first) => {
      if (px !== px) { x.closePath(); return; }
      emap(px, py, T0);
      if (!T0.ok) return;
      if (first) x.moveTo(T0.x, T0.y); else x.lineTo(T0.x, T0.y);
    });
  }
  // the graticule, every fifteen degrees, the equator and the meridian
  // facing you a little brighter, and the prime meridian named
  function gratPath(fine, which) {
    const p = new Path2D(), bright = new Path2D();
    const step = fine ? 4 * DEG : 6 * DEG;
    if (which !== "mer") for (let la = -75; la <= 75; la += 15) {
      const cp = Math.cos(la * DEG), sp = Math.sin(la * DEG);
      let pen = false;
      const into = la === 0 ? bright : p;
      for (let lo = -180; lo <= 180.001; lo += step / DEG) {
        onEarth(lo * DEG, cp, sp, E3);
        if (E3.z < 0) { pen = false; continue; }
        emap(E3.x, E3.y, T0); if (!T0.ok) { pen = false; continue; }
        if (pen) into.lineTo(T0.x, T0.y); else { into.moveTo(T0.x, T0.y); pen = true; }
      }
    }
    if (which !== "par") for (let lo = -180; lo < 180; lo += 15) {
      let pen = false;
      const into = lo === 0 ? bright : p;
      for (let la = -90; la <= 90.001; la += step / DEG) {
        onEarth(lo * DEG, Math.cos(la * DEG), Math.sin(la * DEG), E3);
        if (E3.z < 0) { pen = false; continue; }
        emap(E3.x, E3.y, T0); if (!T0.ok) { pen = false; continue; }
        if (pen) into.lineTo(T0.x, T0.y); else { into.moveTo(T0.x, T0.y); pen = true; }
      }
    }
    return { p, bright };
  }
  // the Earth's disc on the surface: a circle flat, its picture on the
  // chart's plane otherwise
  function discPath(r) {
    const d = new Path2D();
    if (EM.flat) { d.arc(EM.cx, EM.cy, EM.r * r, 0, TAU); return d; }
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * TAU;
      emap(Math.cos(a) * r, Math.sin(a) * r, T0);
      if (!T0.ok) continue;
      if (!i) d.moveTo(T0.x, T0.y); else d.lineTo(T0.x, T0.y);
    }
    d.closePath();
    return d;
  }
  // The Earth in three parts, so that on the whole chart what does not move
  // as it turns is drawn once: BACK the sea and the parallels (which a turn
  // about the pole leaves where they are), LAND the land and the meridians,
  // FRONT the night side's shade and the rim. Close in, all three at once.
  function drawEarth(c, alpha, fine, part) {
    if (alpha <= 0.01 || !COAST.length) return;
    part = part || "all";
    const all = part === "all";
    const z = EM.flat ? EM.r / R.earth : V.z;
    const disc = discPath(1);
    c.save();
    c.globalAlpha = alpha;
    if (all || part === "back") {
      c.fillStyle = "rgb(" + RGB.sea + ")";
      c.fill(disc);
      const g = gratPath(fine, "par");
      c.strokeStyle = SOLID.ink; c.lineWidth = 0.6;
      c.globalAlpha = 0.085 * alpha; c.stroke(g.p);
      c.globalAlpha = 0.24 * alpha; c.stroke(g.bright);
    }
    if (all || part === "land") {
      const land = landPaths();
      const k = Math.max(0.55, z * 1.9);
      if (fine === true) {
        // a waterline: the coast drawn wide and its middle taken out, the
        // land laid over its inner half (kept inside the Earth's rim)
        c.save(); c.clip(disc);
        c.lineJoin = "bevel";
        c.globalAlpha = 0.17 * alpha; c.strokeStyle = SOLID.ink; c.lineWidth = 8.4 * k; c.stroke(land.coast);
        c.globalAlpha = 1; c.strokeStyle = "rgb(" + RGB.sea + ")"; c.lineWidth = 6.2 * k; c.stroke(land.coast);
        c.restore();
      } else if (fine === "halo") {
        // on the turning Earth, a soft edge in its place — one thin stroke,
        // the land laid over its inner half: the waterline costs too much to
        // draw again as it turns
        c.lineJoin = "bevel";
        c.globalAlpha = 0.16 * alpha; c.strokeStyle = SOLID.ink; c.lineWidth = 3.4 * k; c.stroke(land.coast);
        c.lineJoin = "miter";
      }
      c.globalAlpha = alpha;
      c.fillStyle = "rgb(" + RGB.land + ")";
      c.fill(land.fill);
      if (fine) { c.fillStyle = hatchFor(c); c.globalAlpha = 0.36 * alpha; c.fill(land.fill); }
      c.lineJoin = "miter";
      const g = gratPath(fine, "mer");
      c.strokeStyle = SOLID.ink; c.lineWidth = 0.6;
      c.globalAlpha = 0.085 * alpha; c.stroke(g.p);
      c.globalAlpha = 0.24 * alpha; c.stroke(g.bright);
      c.globalAlpha = 0.7 * alpha; c.lineWidth = Math.max(0.6, z * 1.5); c.stroke(land.coast);
    }
    if (all || part === "front") {
      c.clip(disc);
      // the night side, shaded off to the lower right
      proj(0, 0, T1);
      const cx = EM.flat ? EM.cx : T1.x, cy = EM.flat ? EM.cy : T1.y, rr = EM.flat ? EM.r : R.earth * V.z * T1.k;
      const sh = c.createRadialGradient(cx - rr * 0.42, cy - rr * 0.46, rr * 0.2, cx, cy, rr * 1.08);
      sh.addColorStop(0, "rgba(11,12,13,0)");
      sh.addColorStop(0.62, "rgba(11,12,13,0.12)");
      sh.addColorStop(1, "rgba(11,12,13,0.62)");
      c.globalAlpha = alpha; c.fillStyle = sh; c.fill(disc);
    }
    c.restore();
    if (all || part === "front") {
      // its rim
      c.strokeStyle = SOLID.ink; c.lineWidth = Math.max(0.7, z * 1.6);
      c.globalAlpha = 0.6 * alpha; c.stroke(disc);
    }
    c.globalAlpha = 1;
  }
  // the pins: a square for a country a house is from, a ring for one a
  // perfumer is from — those turned towards you
  function drawPins(c, alpha) {
    if (alpha <= 0.01) return;
    const z = EM.flat ? EM.r / R.earth : V.z;
    const s = clamp(5.4 * z, 3, 7);
    for (const p of PINS) {
      if (p.z < 0.02) continue;
      emap(p.x, p.y, T0); if (!T0.ok) continue;
      const a = alpha * smooth(p.z / 0.25) * (p.lit ? 1 : 0.8);
      if (p.houses.length) {
        c.fillStyle = p.lit ? SOLID.gold : SOLID.ink; c.globalAlpha = a;
        c.fillRect(T0.x - s / 2, T0.y - s / 2, s, s);
      }
      if (p.perfumers.length) {
        c.strokeStyle = p.lit ? SOLID.gold : SOLID.rose; c.lineWidth = 1; c.globalAlpha = a;
        c.beginPath(); c.arc(T0.x, T0.y, s * 1.25, 0, TAU); c.stroke();
      }
    }
    c.globalAlpha = 1;
  }
  // the lines from a house's country to its perfumes' places on the rings —
  // the picture's lines from its cities; faded as the country turns away
  function drawFans(c, alpha) {
    if (alpha <= 0.02) return;
    const paths = [];
    for (const e of entries) {
      const p = e.pin;
      if (!p || p.z < 0.02 || growth(e) < 0.6) continue;
      emap(p.x, p.y, T0); if (!T0.ok) continue;
      proj(Math.cos(e.a) * R.frame1, Math.sin(e.a) * R.frame1, T1); if (!T1.ok) continue;
      const lv = level(e.em * smooth(p.z / 0.35));
      if (!lv) continue;
      const q = paths[lv] || (paths[lv] = new Path2D());
      q.moveTo(T0.x, T0.y); q.lineTo(T1.x, T1.y);
    }
    c.lineWidth = 0.6;
    for (let lv = 1; lv <= LV; lv++) {
      if (!paths[lv]) continue;
      const k = lv / LV;
      c.strokeStyle = k > 0.9 && focus ? SOLID.gold : SOLID.ink;
      c.globalAlpha = alpha * (focus ? 0.05 + 0.3 * k * k : 0.13 * k);
      c.stroke(paths[lv]);
    }
    c.globalAlpha = 1;
  }
  // the latitudes named off the Earth's left, and the longitudes along its
  // equator as they come round — in its own frame, upright
  function drawDegrees(c, alpha, which) {
    if (alpha <= 0.01) return;
    const z = EM.flat ? EM.r / R.earth : V.z;
    const fs = clamp(7.5 * z * 1.3, 7, 10);
    c.font = "400 " + fs.toFixed(1) + 'px "IBM Plex Mono", ui-monospace, monospace';
    c.fillStyle = SOLID.ink;
    c.textBaseline = "middle";
    // latitude: just inside the Earth's rim on the left, level with where
    // its parallel meets it
    c.textAlign = "left";
    if (which !== "lon") for (let la = -60; la <= 75; la += 15) {
      const y = cT * Math.sin(la * DEG);
      const x = -Math.sqrt(Math.max(0, 1 - y * y));
      emap(x + 0.03, y, T0); if (!T0.ok) continue;
      c.globalAlpha = 0.34 * alpha;
      c.fillText(la === 0 ? "0°" : Math.abs(la) + "° " + (la > 0 ? "N" : "S"), T0.x, T0.y);
    }
    if (which === "lat") { c.globalAlpha = 1; return; }
    // longitude, along the equator, where it faces you
    c.textAlign = "center";
    for (let lo = -165; lo <= 180; lo += 30) {
      onEarth(lo * DEG, 1, 0, E3);
      if (E3.z < 0.3) continue;
      emap(E3.x, E3.y - 0.028, T0); if (!T0.ok) continue;
      c.globalAlpha = 0.3 * alpha * smooth((E3.z - 0.3) / 0.3);
      c.fillText(lo === 180 ? "180°" : Math.abs(lo) + "° " + (lo < 0 ? "W" : "E"), T0.x, T0.y);
    }
    onEarth(0, Math.cos(66 * DEG), Math.sin(66 * DEG), E3);
    if (E3.z > 0.25) {
      emap(E3.x + 0.012, E3.y, T0);
      if (T0.ok) { c.textAlign = "left"; c.globalAlpha = 0.42 * alpha * smooth((E3.z - 0.25) / 0.3); c.fillText("Greenwich", T0.x, T0.y); }
    }
    c.globalAlpha = 1;
  }
  // The Earth's picture on the whole chart: its back and its front drawn
  // once for its size, its land and meridians again only when it has turned
  // by half a pixel, and the whole laid down every frame
  // (a canvas of its own on the page, under the live layer, so that the
  // browser lays it down every frame and nothing is copied for it)
  const earthCv = document.createElement("canvas");
  earthCv.className = "pf-earth";
  earthCv.setAttribute("aria-hidden", "true");
  stage.insertBefore(earthCv, cvLive);
  const ectx = earthCv.getContext("2d");
  let lastEarthCss = "";
  const backCv = document.createElement("canvas"), frontCv = document.createElement("canvas");
  let earthKey = "", staticKey = "", earthPad = 0;
  const stats0 = { earth: 0, earthStill: 0 };
  function earthPicture(r, alpha) {
    const pad = Math.ceil(Math.max(40, r * 0.16));
    const size = Math.ceil(2 * (r + pad));
    const px = Math.round(size * DPR);
    const sk = [px, Math.round(r * 4), alpha.toFixed(2)].join("|");
    if (sk !== staticKey) {
      staticKey = sk; earthKey = "";
      stats0.earthStill++;
      for (const [cv, part] of [[backCv, "back"], [frontCv, "front"]]) {
        cv.width = cv.height = px;
        const x = cv.getContext("2d");
        x.setTransform(px / size, 0, 0, px / size, 0, 0);
        EM.flat = true; EM.cx = size / 2; EM.cy = size / 2; EM.r = r;
        drawEarth(x, alpha, true, part);
        if (part === "front") drawDegrees(x, alpha, "lat");
      }
    }
    const key = [sk, Math.round(spin * r * 1.6), PINS.map((p) => (p.lit ? 1 : 0)).join("")].join("|");
    if (key === earthKey) return;
    earthKey = key; earthPad = pad;
    stats0.earth++;
    if (earthCv.width !== px) { earthCv.width = earthCv.height = px; earthCv.style.width = earthCv.style.height = size + "px"; hatch = null; }
    const k = px / size;
    ectx.setTransform(1, 0, 0, 1, 0, 0);
    ectx.clearRect(0, 0, px, px);
    ectx.drawImage(backCv, 0, 0);
    ectx.setTransform(k, 0, 0, k, 0, 0);
    EM.flat = true; EM.cx = size / 2; EM.cy = size / 2; EM.r = r;
    placePins();
    drawEarth(ectx, alpha, "halo", "land");
    ectx.setTransform(1, 0, 0, 1, 0, 0);
    ectx.drawImage(frontCv, 0, 0);
    ectx.setTransform(k, 0, 0, k, 0, 0);
    drawPins(ectx, alpha);
    drawDegrees(ectx, alpha, "lon");
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
  // every choice from as close as every other (2026-11-06 — "the zoom
  // length should be fixed")
  const zFix = () => (phone ? Z_FIX_PHONE : Z_FIX);
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
  // THE SCROLL: where along what is chosen the camera stands, counted in
  // its perfumes — 0 its first, 1 its second; the wheel, a swipe, the arrow
  // keys and the scrubber move it ("the scrolling while hovering on the
  // image will cause you to scroll through the perfumes of that
  // house/perfumer. This is especially important for big perfumers like
  // prin lomoros")
  let scrollS = 0;
  // how many perfumes the window holds at the fixed zoom
  const viewN = () => (L.zoomH / zFix()) / (R.label * slot);
  // where a choice is first looked at: its middle if it fits, else its
  // beginning, its first perfume near the top of the window
  function startAt(n) { const v = viewN(); return n <= v * 0.85 ? (n - 1) / 2 : Math.min(n - 1, v * 0.36); }
  function angleAt(list, s) {
    const i = clamp(Math.floor(s), 0, list.length - 1), j = Math.min(list.length - 1, i + 1), t = clamp(s - i, 0, 1);
    const a = list[i].to;
    let b = list[j].to;
    while (b - a > Math.PI) b -= TAU;
    while (a - b > Math.PI) b += TAU;
    return a + (b - a) * t;
  }
  function poseOf(list) {
    if (!list || !list.length) return overviewPose();
    return closePose(angleAt(list, clamp(scrollS, 0, list.length - 1)), R.look, zFix());
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
    if (!sel.kind || !focusList || !focusList.length) return overviewPose();
    if (sel.kind === "perfume") {
      // a perfume is looked at from where its house (or its year) is: the
      // same place, its name lit there — moved only as far as it takes to
      // bring its dot onto the window, clear of its edges
      const p = poseOf(focusList), e = sel.e;
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
    return poseOf(focusList);
  }

  // ---- WHAT IS CHOSEN ---------------------------------------------------
  let sel = { kind: null, pid: null, hid: null, year: null, e: null };
  // a perfume's window: the one shown (callE), the one waiting to be shown
  // once the chart has settled, and when the perfume was lit
  let callE = null, callWait = null, litT0 = -1;
  let focus = null, focusList = null, emT0 = -1;
  // the perfume the scroll stands at, close in
  const scrollAt = () => (focusList && zoomed() && sel.kind !== "perfume" ? focusList[clamp(Math.round(scrollS), 0, focusList.length - 1)] : null);

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

  // a cell of a ring, for a perfume: a quad between two radii, across
  // nearly the whole of its slot
  function cellPath(p, a, r0, r1, half) {
    const a0 = a - slot * 0.4, a1 = a + slot * 0.4;
    const c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
    if (half) r1 = (r0 + r1) / 2;
    proj(c0 * r0, s0 * r0, T0); if (!T0.ok) return;
    if (!inView(T0.x, T0.y, 30)) return;
    p.moveTo(T0.x, T0.y);
    proj(c1 * r0, s1 * r0, T0); p.lineTo(T0.x, T0.y);
    proj(c1 * r1, s1 * r1, T0); p.lineTo(T0.x, T0.y);
    proj(c0 * r1, s0 * r1, T0); p.lineTo(T0.x, T0.y);
    p.closePath();
  }
  // how far a perfume has come in as the chart opens: ring by ring, out
  // from the Earth — the perfumer, then the house, then its bar
  const stageIn = (g, k) => clamp(g * 3 - k, 0, 1);

  function drawScene(withNames, withEarth) {
    const c = SF.c, z = V.z, fade = intro;
    visibleArc();
    base();
    c.globalAlpha = 1;
    c.textBaseline = "middle"; c.textAlign = "left";

    // the dust past the rim
    specks(c, dust, SOLID.ink, 0.8 * fade);

    // THE EARTH, on the chart itself whenever the chart is drawn in
    // perspective (on the whole chart at rest it is the live layer's)
    if (withEarth) {
      earthUpright();
      placePins();
      drawEarth(c, clamp(intro * 2, 0, 1), !flyingNow);
      drawFans(c, fade);
      drawPins(c, clamp(intro * 2, 0, 1));
      drawDegrees(c, fade);
      base();
      c.textBaseline = "middle"; c.textAlign = "left";
    }

    // its frame, a double circle
    c.strokeStyle = SOLID.ink;
    c.lineWidth = Math.max(0.5, 0.7 * z);
    c.beginPath(); ringPath(c, R.frame0, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.34 * fade; c.stroke();
    c.lineWidth = Math.max(0.5, 0.5 * z);
    c.beginPath(); ringPath(c, R.frame1, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.2 * fade; c.stroke();

    // the years' rings behind the bars, every fifth a little brighter
    c.lineWidth = Math.max(0.5, 0.6 * z);
    for (const bright of [false, true]) {
      c.beginPath();
      for (let y = Y_FROM + 1; y <= Y_TO; y++) if ((y % 5 === 0) === bright) ringPath(c, yearR(y), -Math.PI / 2, Math.PI * 1.5);
      c.globalAlpha = (bright ? 0.12 : 0.05) * fade;
      c.stroke();
    }
    c.setLineDash([3, 4]);
    c.beginPath(); ringPath(c, R.und, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.2 * fade; c.stroke();
    c.setLineDash([]);
    // the three rings' edges
    c.beginPath();
    for (const r of [R.per0, R.per1, R.hou0, R.hou1, R.base]) ringPath(c, r, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.1 * fade; c.stroke();
    c.beginPath(); ringPath(c, R.tick1 + 1, -Math.PI / 2, Math.PI * 1.5);
    c.globalAlpha = 0.16 * fade; c.stroke();

    // the rings and the years named up the gap at the top, as the picture
    // names its own
    c.font = F.mono; c.fillStyle = SOLID.ink;
    const ga = gapAngle;
    const say = (r, txt, size, alpha) => {
      c.globalAlpha = alpha * fade;
      textAt(c, Math.cos(ga) * r, Math.sin(ga) * r, ga + Math.PI / 2, txt, size, "center", F.mono);
    };
    say(R.perMid, mode === "az" ? "PERFUMER" : "YEAR", 6, 0.62);
    say(R.houMid, "HOUSE", 6, 0.62);
    say(R.base + 7, "PERFUME", 5.4, 0.62);
    [2010, 2014, 2018, 2022, 2026].forEach((y) => say(yearR(y) - 3, String(y), 5.2, 0.42));
    say(R.und - 3, "NO YEAR FOUND", 4.6, 0.42);
    say(R.frame0 - 9, "THE EARTH", 5.4, 0.42);
    base();

    // RING 1, the perfumer: filled where a source names the perfumer, half
    // where it is the house's, empty where none is found; RING 2, the house:
    // in the colour of where the perfume is
    const fills = {}, halfs = [], empties = [];
    for (const e of entries) {
      const g = growth(e);
      if (g <= 0) continue;
      const k1 = stageIn(g, 0);
      if (k1 > 0) {
        const lv = level(e.em * k1);
        if (lv) {
          if (e.p.c === "named") { const q = fills.ink || (fills.ink = []); cellPath(q[lv] || (q[lv] = new Path2D()), e.a, R.per0 + 1.5, R.perCell); }
          else if (e.p.c === "house") { cellPath(halfs[lv] || (halfs[lv] = new Path2D()), e.a, R.per0 + 1.5, R.perCell); }
          else cellPath(empties[lv] || (empties[lv] = new Path2D()), e.a, R.per0 + 1.5, R.perCell);
        }
      }
      const k2 = stageIn(g, 0.7);
      if (k2 > 0) {
        const lv = level(e.em * k2);
        if (lv) { const q = fills[e.tone] || (fills[e.tone] = []); cellPath(q[lv] || (q[lv] = new Path2D()), e.a, R.hou0 + 1.5, R.houCell); }
      }
    }
    for (const key of ["ink", "rose", "blue", "gold"]) {
      const q = fills[key];
      if (!q) continue;
      c.fillStyle = SOLID[key];
      const a = key === "ink" ? 0.5 : key === "rose" ? 0.5 : 0.62;
      for (let lv = 1; lv <= LV; lv++) if (q[lv]) { c.globalAlpha = (a * lv) / LV; c.fill(q[lv]); }
    }
    c.strokeStyle = SOLID.ink; c.fillStyle = SOLID.ink;
    c.lineWidth = Math.max(0.5, 0.55 * z);
    for (let lv = 1; lv <= LV; lv++) {
      if (halfs[lv]) { c.globalAlpha = (0.42 * lv) / LV; c.fill(halfs[lv]); }
      if (empties[lv]) { c.globalAlpha = (0.42 * lv) / LV; c.stroke(empties[lv]); }
    }
    // a half-filled cell is outlined whole, so its empty half reads
    const halfLines = [];
    for (const e of entries) {
      if (e.p.c !== "house") continue;
      const lv = level(e.em * stageIn(growth(e), 0));
      if (lv) cellPath(halfLines[lv] || (halfLines[lv] = new Path2D()), e.a, R.per0 + 1.5, R.perCell);
    }
    for (let lv = 1; lv <= LV; lv++) if (halfLines[lv]) { c.globalAlpha = (0.34 * lv) / LV; c.stroke(halfLines[lv]); }

    // a mark where every group begins on ring 1, and every house on ring 2
    c.beginPath();
    for (const g of groups) {
      const a = g.a0;
      proj(Math.cos(a) * R.frame1, Math.sin(a) * R.frame1, T0); proj(Math.cos(a) * R.per1, Math.sin(a) * R.per1, T1);
      if (T0.ok && T1.ok && (inView(T0.x, T0.y, 20) || inView(T1.x, T1.y, 20))) { c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y); }
      for (const h of g.houses) {
        proj(Math.cos(h.a0) * (R.hou0 - 3), Math.sin(h.a0) * (R.hou0 - 3), T0); proj(Math.cos(h.a0) * (R.hou1 + 3), Math.sin(h.a0) * (R.hou1 + 3), T1);
        if (T0.ok && T1.ok && inView(T0.x, T0.y, 20)) { c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y); }
      }
    }
    c.lineWidth = Math.max(0.5, 0.6 * z);
    c.globalAlpha = 0.3 * clamp(intro * 1.5 - 0.3, 0, 1); c.stroke();

    // RING 3, the perfume: a bar out to its year
    const lw = clamp(1.05 * z, 0.7, 2.8);
    c.lineWidth = lw;
    c.lineCap = "butt";
    for (const dated of [true, false]) {
      c.setLineDash(dated ? [] : [1, clamp(3 * z, 2.4, 7)]);
      for (const tone of TONES) {
        const paths = [];
        for (const e of byTone[tone]) {
          if (!!e.p.y !== dated) continue;
          const g = stageIn(growth(e), 1.5);
          if (g <= 0) continue;
          const ca = Math.cos(e.a), sa = Math.sin(e.a);
          const r1 = R.base + (e.rDot - R.base) * ease(g);
          proj(ca * R.base, sa * R.base, T0);
          proj(ca * r1, sa * r1, T1);
          if (!T0.ok || !T1.ok) continue;
          if (!inView(T0.x, T0.y, 40) && !inView(T1.x, T1.y, 40)) continue;
          const lv = level(e.em);
          const p = paths[lv] || (paths[lv] = new Path2D());
          p.moveTo(T0.x, T0.y); p.lineTo(T1.x, T1.y);
        }
        c.strokeStyle = tone === "rose" ? SOLID.ink : SOLID[tone];
        const a = tone === "rose" ? 0.34 : 0.5;
        for (let lv = 0; lv <= LV; lv++) if (paths[lv]) { c.globalAlpha = (a * lv) / LV; c.stroke(paths[lv]); }
      }
    }
    c.setLineDash([]);

    // the dots at the bars' ends
    for (const tone of TONES) {
      const glow = [], core = [], hollow = [];
      let hw = 0, hn = 0;
      for (const e of entries) {
        if (e.tone !== tone || stageIn(growth(e), 1.5) < 0.98) continue;
        proj(Math.cos(e.a) * e.rDot, Math.sin(e.a) * e.rDot, T0);
        if (!T0.ok || !inView(T0.x, T0.y, 20)) continue;
        const rr = Math.max(1.1, (tone === "rose" ? 2.8 : 3.5) * z * T0.k);
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
        if (glow[lv]) { c.globalAlpha = 0.14 * k; c.fill(glow[lv]); }
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

  // The groups' names along ring 1 — the perfumers (the years, By year) —
  // and, for a chosen perfumer, its houses along ring 2, with a square where
  // each begins.
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
    c.font = F.group;
    for (const g of gs) {
      if (!g.size || g.size * z < 2.3) continue;
      c.fillStyle = g === chosenG ? SOLID.gold : SOLID.ink;
      const em = gs === groups && focus ? 0.4 + 0.6 * (groupEm(g) - DIM) / (1 - DIM) : 1;
      arcText(c, g.text, R.perMid, (g.a0 + g.a1) / 2, g.size, F.group, trackOf(g.size), 0.92 * alpha * em);
    }
    if (!chosenG) { base(); return; }
    c.font = F.house;
    for (const h of chosenG.houses) {
      const size = houseSize(h, z);
      if (!size || size * z < 2.3) continue;
      const on = sel.hid === h.h;
      c.fillStyle = on ? SOLID.gold : SOLID.ink;
      arcText(c, h.text, R.houMid, (h.a0 + h.a1) / 2, size, F.house, 0.18, alpha * (sel.hid && !on ? 0.5 : 0.95));
    }
    base();
    for (const h of chosenG.houses) {
      const a = h.a0 + slot * 0.5;
      proj(Math.cos(a) * (R.hou1 + 4), Math.sin(a) * (R.hou1 + 4), T0);
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
    // (the Earth is not in it: the rotor turns, and the Earth stands upright)
    drawScene(false, false);
  }
  function namesRotor() {
    const key = [sel.pid, sel.hid, mode, labelsOn().toFixed(3), focus ? 1 : 0, S, DPR].join("|");
    if (key === namesKey && Math.abs(cam.rot - namesRot) < 0.003) return;
    namesKey = key; namesRot = cam.rot;
    stats.names = (stats.names || 0) + 1;
    const k = DPR;
    nctx.setTransform(1, 0, 0, 1, 0, 0);
    nctx.clearRect(0, 0, cvNames.width, cvNames.height);
    surface(nctx, k, 0, 0, k, 0, 0, 0, 0, S, S);
    view(0, 0, fitZ, 0, 0, S / 2, S / 2);
    flipRot = cam.rot;
    drawNames(nctx, 1);
    flipRot = null;
    nctx.globalAlpha = 1;
  }
  // THE LIVE LAYER'S SHARPNESS (2026-11-07 — "optimize"): at rest it holds
  // only the dust, the far field, the lights and the Earth's lines, which
  // read the same at a plain screen's pixel, so on a sharper screen it is
  // drawn at one pixel a point — a quarter of the work on a Retina screen —
  // and at the screen's own the moment the hand is on something, something
  // is chosen or anything moves, staying sharp a moment after.
  const LIVE_HI_MS = 1500;
  let liveK = 0, liveHiUntil = 0;
  function liveRes(now) {
    if (hover || sel.kind || callE || !calm) liveHiUntil = now + LIVE_HI_MS;
    const want = now < liveHiUntil ? DPR : Math.min(DPR, 1);
    if (want === liveK && cvLive.width === Math.round(W * want)) return;
    liveK = want;
    cvLive.width = Math.round(W * want); cvLive.height = Math.round(H * want);
  }
  function placeRotor() {
    const x = cam.cx * W - S / 2, y = cam.cy * H - S / 2;
    const sc = Math.exp(cam.lz) / fitZ;
    const t = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px) rotate(" + (cam.rot % TAU).toFixed(5) + "rad)" +
      (Math.abs(sc - 1) > 1e-4 ? " scale(" + sc.toFixed(5) + ")" : "");
    if (t !== lastRotor) { rotor.style.transform = t; lastRotor = t; }
  }

  // ---- THE CHART IN PERSPECTIVE ---------------------------------------------
  let flyingNow = false;
  function drawChart(lo) {
    chartDirty = false;
    stats.chart++;
    const moving = !!lo;
    lo = moving && FLY_K < DPR;
    const k = lo ? FLY_K : DPR, c = lo ? fctx : ctx, cv = lo ? cvFly : cvChart;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    surface(c, k, 0, 0, k, k * OV, k * OV, -OV, -OV, W + OV, Math.min(H, VH) + OV);
    viewCam();
    flyingNow = moving;
    drawScene(true, true);
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
  let clock = 0, hover = null;
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
    const c = lctx, k = liveK;
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

    // THE EARTH, on the whole chart: its picture, laid down; its lines out
    // to the rings, drawn on it — close in it is part of
    // the chart's own drawing, and only the lights are drawn here
    if (viewNow === "turn") {
      proj(0, 0, T0);
      const ox = T0.x, oy = T0.y;
      const er = R.earth * z;
      const ea = clamp(intro * 2, 0, 1);
      earthPicture(er, ea);
      const sz = Math.ceil(2 * (er + earthPad));
      const css = "translate(" + (ox - sz / 2).toFixed(2) + "px," + (oy - sz / 2).toFixed(2) + "px)";
      if (css !== lastEarthCss) { earthCv.style.transform = css; lastEarthCss = css; }
      base();
      EM.flat = true; EM.cx = ox; EM.cy = oy; EM.r = er;
      drawFans(c, fade);
    } else {
      viewCam();
      earthUpright();
      placePins();
    }

    // a glint running round ring 1
    if (!STILL && intro >= 1) {
      const a = -Math.PI / 2 + ((t / 24) % 1) * TAU;
      c.strokeStyle = SOLID.gold;
      c.lineCap = "round";
      c.lineWidth = Math.max(1, 3 * z);
      [[0.32, 0.07], [0.16, 0.12], [0.06, 0.22]].forEach(([len, al]) => {
        c.beginPath(); ringPath(c, R.frame1 + 1, a - len, a);
        c.globalAlpha = al; c.stroke();
      });
      c.lineCap = "butt";
    }

    // the lights, from a house's country through the three rings
    drawPulses(c, t);

    // (the names on the rings, while the chart turns, are the rotor's own
    // picture since 2026-11-07: namesRotor)

    // what is chosen, lit, while it is seen on the whole chart (close in its
    // names are written instead)
    if (focusList && !sel.e && q < 0.5) { c.globalAlpha = 1; markSpokes(c, focusList, 0.75 * (1 - 2 * q)); }
    // the perfume the scroll stands at, close in
    const at = scrollAt();
    if (at && q > 0.6 && !hover) markAt(c, at);
    // what is lit, and what the hand is on
    if (sel.e) { markEntry(c, sel.e); markLit(c, sel.e); }
    if (callE && callAt.ok) drawCallLine(c);
    if (hover) drawHover(c);
    c.globalAlpha = 1;
  }
  // A light runs from the perfume's house's country (when it faces you) to
  // its place on the Earth's frame, and on out through the three rings —
  // the perfumer, the house — to its dot, which flares as it arrives.
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
      const pin = e.pin && e.pin.z > 0.08 ? e.pin : null;
      const split = pin ? 0.42 : 0;
      if (u < 1) {
        const a = Math.sin(Math.PI * u);
        c.lineWidth = clamp(1.6 * z, 1, 3);
        if (u < split) {
          // across the Earth, from the country
          const k = ease(u / split), k0 = Math.max(0, k - 0.16);
          emap(pin.x, pin.y, T2); if (!T2.ok) continue;
          proj(ca * R.frame1, sa * R.frame1, T1); if (!T1.ok) continue;
          const x0 = lerp(T2.x, T1.x, k0), y0 = lerp(T2.y, T1.y, k0), x1 = lerp(T2.x, T1.x, k), y1 = lerp(T2.y, T1.y, k);
          if (!inView(x1, y1, 20)) continue;
          c.globalAlpha = 0.7 * a * em;
          c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          c.globalAlpha = 0.9 * a * em;
          c.beginPath(); c.arc(x1, y1, clamp(1.8 * z, 1.1, 3.4), 0, TAU); c.fill();
          continue;
        }
        const k = ease((u - split) / (1 - split)), r = R.frame1 + (e.rDot - R.frame1) * k;
        const tail = Math.min(46, r - R.frame1);
        proj(ca * (r - tail), sa * (r - tail), T0); proj(ca * r, sa * r, T1);
        if (!T0.ok || !T1.ok || (!inView(T0.x, T0.y, 20) && !inView(T1.x, T1.y, 20))) continue;
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
  // what is lit: its two cells outlined and its bar, in its colour, a ring
  // round its dot
  function markSpokes(c, list, alpha) {
    const z = V.z;
    for (const tone of TONES) {
      c.strokeStyle = SOLID[tone];
      c.globalAlpha = 0.95 * (alpha == null ? 1 : alpha);
      const cells = new Path2D();
      c.lineWidth = clamp(1.4 * z, 1, 3.4);
      c.beginPath();
      for (const e of list) {
        if (e.tone !== tone) continue;
        const ca = Math.cos(e.a), sa = Math.sin(e.a);
        proj(ca * R.base, sa * R.base, T0); proj(ca * e.rDot, sa * e.rDot, T1);
        if (!T0.ok || !T1.ok) continue;
        c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y);
        const rr = Math.max(2.2, 5.2 * z * T1.k);
        c.moveTo(T1.x + rr, T1.y); c.arc(T1.x, T1.y, rr, 0, TAU);
        if (list.length < 90) { cellPath(cells, e.a, R.per0 + 0.5, R.perCell + 1); cellPath(cells, e.a, R.hou0 + 0.5, R.houCell + 1); }
      }
      c.stroke();
      c.lineWidth = Math.max(0.7, 0.8 * z);
      c.stroke(cells);
    }
  }
  // the perfume the scroll stands at, close in: a bracket at its place on
  // the rim and its name a little brighter, as the scrubber says
  function markAt(c, e) {
    const ca = Math.cos(e.a), sa = Math.sin(e.a);
    proj(ca * (R.tick0 - 6), sa * (R.tick0 - 6), T0); proj(ca * (R.tick1 + 6), sa * (R.tick1 + 6), T1);
    if (!T0.ok || !T1.ok) return;
    c.strokeStyle = SOLID.gold; c.lineWidth = 1.2; c.globalAlpha = 0.9;
    c.beginPath(); c.moveTo(T0.x, T0.y); c.lineTo(T1.x, T1.y); c.stroke();
    proj(ca * e.rDot, sa * e.rDot, T0);
    if (T0.ok) {
      const rr = Math.max(3, 5 * V.z * T0.k);
      c.globalAlpha = 0.7; c.beginPath(); c.arc(T0.x, T0.y, rr * 1.7, 0, TAU); c.stroke();
    }
    if (written(e) && closeAmt() > 0.5) {
      const P = placeLabel(e, labelSize());
      c.textBaseline = "middle"; c.textAlign = "left";
      c.font = P.font; c.fillStyle = SOLID.gold; c.globalAlpha = 0.85 * closeAmt();
      textAt(c, Math.cos(e.a) * P.rMain, Math.sin(e.a) * P.rMain, P.dir, P.main, P.size, "left", P.font);
      base();
    }
    c.globalAlpha = 1;
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
    if (h.type === "pin") { markSpokes(c, h.p.entries.length > 160 ? [] : h.p.entries); drawPinRing(c, h.p); return; }
    const list = h.type === "group" ? h.g.members : h.type === "house" ? h.h.members : h.list;
    markSpokes(c, list);
    const g = h.type === "group" ? h.g : h.type === "house" ? null : h.g;
    if (g) {
      c.lineWidth = Math.max(1, 2.2 * V.z);
      c.strokeStyle = SOLID.gold; c.globalAlpha = 0.8;
      c.beginPath(); ringPath(c, R.per0 - 3, g.a0 + slot * 0.3, g.a1 - slot * 0.3); c.stroke();
      if (g.size) {
        c.font = F.group; c.fillStyle = SOLID.gold;
        c.textBaseline = "middle"; c.textAlign = "left";
        arcText(c, g.text, R.perMid, (g.a0 + g.a1) / 2, g.size, F.group, trackOf(g.size), 1);
      }
    }
    if (h.type === "house") {
      c.lineWidth = Math.max(1, 2.2 * V.z);
      c.strokeStyle = SOLID.gold; c.globalAlpha = 0.8;
      c.beginPath(); ringPath(c, R.hou0 - 3, h.h.a0 + slot * 0.3, h.h.a1 - slot * 0.3); c.stroke();
      if (h.h.size) {
        c.font = F.house; c.fillStyle = SOLID.gold;
        c.textBaseline = "middle"; c.textAlign = "left";
        arcText(c, h.h.text, R.houMid, (h.h.a0 + h.h.a1) / 2, houseSize(h.h, V.z), F.house, 0.18, 1);
      }
    }
    base();
  }
  // a country pointed at on the Earth: a ring round its pin
  function drawPinRing(c, p) {
    if (p.z < 0.02) return;
    emap(p.x, p.y, T0); if (!T0.ok) return;
    c.strokeStyle = SOLID.gold; c.lineWidth = 1; c.globalAlpha = 0.9;
    c.beginPath(); c.arc(T0.x, T0.y, 11, 0, TAU); c.stroke();
    c.globalAlpha = 0.4;
    c.beginPath(); c.arc(T0.x, T0.y, 17, 0, TAU); c.stroke();
    c.globalAlpha = 1;
  }

  // ---- THE CLOCK -------------------------------------------------------
  let raf = 0, last = 0, viewNow = "", seen = true;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  const CALM_FPS = 30, CALM_AFTER = 600;
  let calm = false, lastHand = 0, lastDrawn = 0;
  function setView(v) {
    viewNow = v;
    stage.dataset.view = v;
  }
  function frame(now) {
    raf = 0;
    if (!W) return;
    if (sharp) sharp.frame(now);
    // AT REST, ABOUT THIRTY FRAMES A SECOND (2026-11-07 — "optimize this
    // page as much as you can"): while nothing is moving but the slow things
    // — the chart's turn, the dust, the lights, the sway — and the hand has
    // been still a moment, every other frame is let go; anything the hand
    // does, and every flight, has every frame.
    if (calm && now - lastHand > CALM_AFTER && now - lastDrawn < 1000 / CALM_FPS - 4) { kick(); return; }
    lastDrawn = now;
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
    // the Earth: turning slowly on its axis at rest, and turned to the
    // country of what is chosen (and still while anything is)
    let earthTurning = false;
    if (spinTween) {
      const t = STILL ? 1 : clamp((now - spinTween.t0) / spinTween.ms, 0, 1);
      spin = spinTween.from + (spinTween.to - spinTween.from) * ease(t);
      if (t >= 1) spinTween = null; else earthTurning = true;
    } else if (!sel.kind && running) spin += EARTH_SPIN * dt;

    // flat and centred, a move is only a turn, a slide and a scale — the
    // rotor's to carry; anything else is drawn as it goes
    const flat = !zoomed() && cam.tilt < 1e-4 && Math.abs(cam.fx) < 0.01 && Math.abs(cam.fy) < 0.01;
    const settling = moving || sorting || fading || intro < 1 || (earthTurning && zoomed());
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
    else if (v === "turn") { if (rotorDirty) renderRotor(); namesRotor(); placeRotor(); setFlying(false); }
    else {
      if (chartDirty) { drawChart(); dofOff(); stillSince = now; }
      if (!dofDone && now - stillSince > 240) renderDof();
    }
    tendPulses();
    liveRes(now);
    drawLive();

    calm = !settling && !hover && !callWait && !down && !STILL;
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
    if (r < R.frame1) {
      // on the Earth, on the whole chart: a country with a pin
      if (zoomed() || cam.tilt > 0.01) return null;
      proj(0, 0, T0);
      const er = R.earth * V.z;
      let best = null, bd = 14;
      for (const q of PINS) {
        if (q.z < 0.05) continue;
        const d = Math.hypot(T0.x + er * q.x - p.x, T0.y - er * q.y - p.y);
        if (d < bd) { bd = d; best = q; }
      }
      return best ? { type: "pin", p: best } : null;
    }
    if (r > R.fit) return null;
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
    return (a.e || a.h || a.g || a.list || a.p) === (b.e || b.h || b.g || b.list || b.p);
  }
  function tipFor(h) {
    if (h.type === "pin") {
      const q = h.p, n = q.entries.length;
      const lines = [];
      if (q.houses.length) lines.push(q.houses.length + (q.houses.length === 1 ? " house · " : " houses · ") + n + (n === 1 ? " perfume" : " perfumes"));
      if (q.houses.length) lines.push(q.houses.map((id) => HOU[id].name).join(", "));
      if (q.perfumers.length) lines.push("from here: " + q.perfumers.map((id) => PER[id].name).join(", "));
      return "<b>" + esc(q.name) + "</b>" + lines.map((t) => "<span>" + esc(t) + "</span>").join("");
    }
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
  const CHROME = "button, a, .pf-nav, .pf-here, .pf-sort, .pf-call, .pf-scrub";
  function localXY(ev) { const b = stage.getBoundingClientRect(); return { x: ev.clientX - b.left, y: ev.clientY - b.top }; }
  stage.addEventListener("pointerdown", (ev) => {
    if (ev.target.closest(CHROME)) return;
    const p = localXY(ev);
    down = { x: p.x, y: p.y, ly: p.y, lx: p.x, swiped: false };
  });
  stage.addEventListener("pointermove", (ev) => {
    lastHand = performance.now();
    if (ev.pointerType === "touch") {
      // a finger close in goes through the perfumes of what is chosen, as
      // the wheel does: up for the next, down for the one before
      if (!down || !sel.kind || !zoomed()) return;
      const p = localXY(ev);
      const dy = p.y - down.ly, dx = p.x - down.lx;
      down.ly = p.y; down.lx = p.x;
      if (Math.hypot(p.x - down.x, p.y - down.y) > 10) down.swiped = true;
      if (down.swiped) scrollBy(-(Math.abs(dy) >= Math.abs(dx) ? dy : dx) / SWIPE_PX);
      return;
    }
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
    if (was.swiped || Math.hypot(p.x - was.x, p.y - was.y) > 10) return;
    press(hit(p.x, p.y));
  });
  stage.addEventListener("pointercancel", () => { down = null; });

  function press(h) {
    if (!h) { if (callE) dismissCall(); return; }
    if (h.type === "entry") { choosePerfume(h.e); return; }
    // pressed inside what is already chosen: the scroll goes to the perfume
    // nearest to where it was pressed
    const already = h.type === "house" ? sel.kind === "house" && sel.hid === h.h.h
      : mode === "az" ? sel.pid === h.g.id && sel.kind === "perfumer" : sel.kind === "year" && sel.year === h.g.key;
    if (already) { lookAt(h.th); return; }
    if (h.type === "house") { chooseHouse(h.g.id, h.h.h); return; }
    if (mode === "az") choosePerfumer(h.g.id);
    else chooseYear(h.g.key);
  }
  // pressed inside what is chosen: the scroll goes to the perfume nearest
  // to where it was pressed
  function lookAt(th) {
    let best = -1, bd = Infinity;
    (focusList || []).forEach((e, i) => { const d = angDist(th, e.to); if (d < bd) { bd = d; best = i; } });
    if (best < 0) return;
    scrollTo(best);
  }

  // ---- CHOOSING ----------------------------------------------------------
  function choose(next) {
    const was = sel;
    sel = Object.assign({ kind: null, pid: null, hid: null, year: null, e: null }, next || {});
    // a perfume chosen keeps the scroll where it is: the perspective it is
    // chosen from is the one it is shown in — and going back up from it
    // keeps it too
    const sameParent = (sel.kind === "perfume" || was.kind === "perfume") && was.kind && sel.kind &&
      was.pid === sel.pid && was.hid === sel.hid && was.year === sel.year;
    const wasAt = focusList && focusList.length ? focusList[clamp(Math.round(scrollS), 0, focusList.length - 1)] : null;
    const wasFocus = focus;
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
    // where the scroll stands in it: where it stood, for a perfume chosen in
    // it or going back up from one; at the same perfume, going up from a
    // house to its perfumer; else at its start
    if (focusList) {
      const up = wasFocus && wasAt && focus.has(wasAt) && focus.size > wasFocus.size;
      if (sameParent) scrollS = clamp(scrollS, 0, focusList.length - 1);
      else if (up) scrollS = focusList.indexOf(wasAt);
      else scrollS = startAt(focusList.length);
    } else scrollS = 0;
    // the Earth's countries lit, and the Earth turned to the choice's
    PINS.forEach((q) => (q.lit = !!focus && (q.entries.some((e) => focus.has(e)) || !!(sel.pid && PER[sel.pid] && PER[sel.pid].from === q.name))));
    if (!sel.kind) spinTween = null;
    else turnEarthTo(countryOf(sel.e ? [sel.e] : focusList, sel.pid));
    // a perfume chosen is lit, the rest of its house stepped back a little
    // and everything else as far as ever
    for (const e of entries) { e.emFrom = e.em; e.emTo = !focus ? 1 : sel.e ? (e === sel.e ? 1 : focus.has(e) ? AROUND : DIM) : focus.has(e) ? 1 : DIM; }
    if (STILL) { for (const e of entries) e.em = e.emTo; emT0 = -1; } else emT0 = performance.now();
    rotorDirty = chartDirty = true;
    hover = null; hideTip(); handHover = false; stage.classList.remove("is-over");
    setGoal(poseFor());
    showChosen();
    syncScrub();
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
    // brought onto the window if the scroll stands far from it
    const i = focusList ? focusList.indexOf(e) : -1;
    if (i >= 0 && Math.abs(i - scrollS) > viewN() * 0.3) { scrollS = i; setGoal(poseFor()); syncScrub(); }
    litT0 = performance.now();
    if (phone && navOpen) toggleNav(false);
    if (!quiet) callFor(e, STILL ? 0 : CALL_AFTER);
  }
  function up() {
    if (sel.kind === "perfume") { closeCall(); if (sel.year != null) chooseYear(sel.year); else chooseHouse(sel.pid, sel.hid); return; }
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
    // the wheel goes through the perfumes of what is chosen — said only
    // where there are more of them than the window holds
    const many = focusList && focusList.length > viewN() * 0.85;
    const through = many ? (touch ? " · swipe for the rest" : " · scroll for the rest") : "";
    hint.textContent = !on ? (mode === "az" ? (touch ? "Tap a perfumer — on the circle or in the list" : "Choose a perfumer — on the circle or in the list")
      : (touch ? "Tap a year — or a perfumer in the list" : "Choose a year — or a perfumer in the list"))
      : sel.kind === "perfumer" ? (mode === "az" ? "Choose a house" : "Choose a perfume") + through + back
      : sel.kind === "perfume" ? (touch ? "" : "Esc to go back")
      : "Choose a perfume" + through + back;
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
  // THE FOLD (2026-11-07 — "the table on the right should be collapsible"):
  // the list and its search fold away together, leaving the list's name and
  // count, and the chart moves over into the room they leave; kept for the
  // next visit in this browser. Not on a phone, where the list is a drawer.
  const foldBtn = nav.querySelector(".pf-nav-fold");
  let folded = false;
  try { folded = localStorage.getItem("pf-nav-folded") === "1"; } catch (e) { /* storage refused */ }
  function setFold(on, quiet) {
    folded = !!on;
    nav.classList.toggle("is-folded", folded);
    foldBtn.setAttribute("aria-expanded", folded ? "false" : "true");
    foldBtn.setAttribute("aria-label", folded ? "Unfold the list" : "Fold the list away");
    if (folded && !findBox.hidden) openFind(false);
    try { localStorage.setItem("pf-nav-folded", folded ? "1" : "0"); } catch (e) { /* storage refused */ }
    if (quiet) return;
    // the chart into its new room, on the camera's springs rather than at once
    measure();
    rotorDirty = chartDirty = true;
    dofOff();
    setGoal(poseFor(), false);
    syncScrub();
  }
  foldBtn.addEventListener("click", () => setFold(!folded));
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
  // scrolling never waits on it the rest of the time. Over the chart it goes
  // through the perfumes of what is chosen (2026-11-06).
  function holdWheel(ev) {
    const t = ev.target && ev.target.closest ? ev.target : null;
    const list = t && t.closest(".pf-nav-scroll");
    if (list && canScroll(list, ev.deltaY)) return;
    if (t && t.closest(".pf-card") && canScroll(card, ev.deltaY)) return;
    if (t && t.closest(".pf-call") && canScroll(callSheet, ev.deltaY)) return;
    ev.preventDefault();
    if (!t || !stage.contains(t) || t.closest(".pf-nav, .pf-call, .pf-here, .pf-sort") || !card.hidden) return;
    let d = ev.deltaY;
    if (Math.abs(ev.deltaX) > Math.abs(d)) d = ev.deltaX;
    d *= ev.deltaMode === 1 ? 18 : ev.deltaMode === 2 ? H : 1;
    scrollBy(d / WHEEL_PX);
  }
  // ---- GOING THROUGH THE PERFUMES OF WHAT IS CHOSEN -------------------------
  function scrollTo(s) {
    if (!focusList || !focusList.length) return;
    // a perfume's window is put away first, back to its house, where it was
    if (sel.kind === "perfume") up();
    if (!focusList) return;
    const n = focusList.length;
    const next = clamp(s, 0, n - 1);
    if (Math.abs(next - scrollS) < 1e-4) return;
    scrollS = next;
    hover = null; hideTip();
    setGoal(poseFor());
    syncScrub();
    kick();
  }
  const scrollBy = (d) => scrollTo(scrollS + d);
  // THE SCRUBBER, beside the chart while something is chosen: a tick for
  // every perfume of it, a thumb as long as the window holds, the one the
  // scroll stands at named — pressed or dragged, it goes there
  const scrub = document.createElement("div");
  scrub.className = "pf-scrub";
  scrub.hidden = true;
  scrub.innerHTML = '<p class="pf-scrub-at" aria-live="polite"><b></b><span></span></p>' +
    '<div class="pf-scrub-track" role="slider" tabindex="0" aria-label="Go through the perfumes" aria-valuemin="1"><i class="pf-scrub-ticks"></i><i class="pf-scrub-thumb"></i></div>' +
    '<p class="pf-scrub-say" aria-hidden="true"></p>';
  stage.appendChild(scrub);
  const scrubTrack = scrub.querySelector(".pf-scrub-track"), scrubThumb = scrub.querySelector(".pf-scrub-thumb");
  const scrubTicks = scrub.querySelector(".pf-scrub-ticks");
  const scrubNo = scrub.querySelector(".pf-scrub-at b"), scrubName = scrub.querySelector(".pf-scrub-at span");
  const scrubSay = scrub.querySelector(".pf-scrub-say");
  let scrubFor = null;
  function syncScrub() {
    const list = sel.kind && sel.kind !== "perfume" ? focusList : null;
    const n = list ? list.length : 0;
    const on = n > 1;
    if (scrub.hidden === on) scrub.hidden = !on;
    stage.classList.toggle("has-scrub", on);
    if (!on) { scrubFor = null; return; }
    if (scrubFor !== list) {
      scrubFor = list;
      // a tick for every perfume, drawn as one gradient
      const stops = [];
      for (let i = 0; i < n; i++) { const y = n === 1 ? 50 : (i / (n - 1)) * 100; stops.push("transparent " + Math.max(0, y - 0.0001) + "%", "currentColor " + y + "%", "transparent calc(" + y + "% + 1px)"); }
      scrubTicks.style.backgroundImage = n <= 160 ? "linear-gradient(to bottom, " + stops.join(", ") + ")" : "none";
      scrubTrack.setAttribute("aria-valuemax", String(n));
      scrubSay.textContent = window.matchMedia("(hover: none)").matches ? "Swipe" : "Scroll";
    }
    const v = Math.min(1, viewN() / n);
    const k = n > 1 ? scrollS / (n - 1) : 0.5;
    scrubThumb.style.height = (v * 100).toFixed(2) + "%";
    scrubThumb.style.top = (k * (1 - v) * 100).toFixed(2) + "%";
    const e = list[clamp(Math.round(scrollS), 0, n - 1)];
    scrubNo.textContent = String(Math.round(scrollS) + 1).padStart(3, "0") + " / " + String(n).padStart(3, "0");
    scrubName.textContent = e.p.n;
    scrubTrack.setAttribute("aria-valuenow", String(Math.round(scrollS) + 1));
    scrubTrack.setAttribute("aria-valuetext", e.p.n);
  }
  let scrubDrag = false;
  function scrubAt(ev) {
    const b = scrubTrack.getBoundingClientRect();
    const n = focusList ? focusList.length : 0;
    if (!n) return;
    scrollTo(clamp((ev.clientY - b.top) / b.height, 0, 1) * (n - 1));
  }
  scrubTrack.addEventListener("pointerdown", (ev) => { ev.preventDefault(); scrubDrag = true; scrubTrack.setPointerCapture(ev.pointerId); scrubAt(ev); });
  scrubTrack.addEventListener("pointermove", (ev) => { if (scrubDrag) scrubAt(ev); });
  scrubTrack.addEventListener("pointerup", () => { scrubDrag = false; });
  scrubTrack.addEventListener("pointercancel", () => { scrubDrag = false; });
  scrubTrack.addEventListener("keydown", (ev) => {
    const n = focusList ? focusList.length : 0;
    const steps = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, PageDown: Math.max(1, Math.round(viewN() * 0.7)), PageUp: -Math.max(1, Math.round(viewN() * 0.7)) };
    if (ev.key in steps) { ev.preventDefault(); ev.stopPropagation(); scrollTo(Math.round(scrollS) + steps[ev.key]); }
    else if (ev.key === "Home") { ev.preventDefault(); ev.stopPropagation(); scrollTo(0); }
    else if (ev.key === "End") { ev.preventDefault(); ev.stopPropagation(); scrollTo(n - 1); }
  });
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
    // the keys go through the perfumes of what is chosen, as the wheel does
    const n = focusList ? focusList.length : 0;
    const page = Math.max(1, Math.round(viewN() * 0.7));
    const steps = { ArrowDown: 1, ArrowUp: -1, PageDown: page, PageUp: -page, " ": page };
    if (ev.key in steps) scrollTo(Math.round(scrollS) + (ev.key === " " && ev.shiftKey ? -page : steps[ev.key]));
    else if (ev.key === "Home") scrollTo(0);
    else if (ev.key === "End") scrollTo(n - 1);
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
    // (and not while all but a sliver of it is scrolled away, reading the
    // index under it — 2026-11-07)
    new IntersectionObserver((list) => {
      const en = list[list.length - 1];
      seen = en.isIntersecting && en.intersectionRatio > 0.06;
      if (seen) { last = 0; kick(); }
    }, { threshold: [0, 0.06, 0.12] }).observe(stage);
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
  if (folded) setFold(true, true);
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
      scroll: scrollS, count: focusList ? focusList.length : 0, at: (scrollAt() || {}).p ? scrollAt().p.n : null, viewN: viewN(),
    }),
    // where a perfume's dot stands on the window
    dotOf: (name) => {
      const e = entries.find((x) => x.p.n === name);
      if (!e) return null;
      dotOnWindow(e, T1);
      const b = stage.getBoundingClientRect();
      return T1.ok ? { x: b.left + T1.x, y: b.top + T1.y } : null;
    },
    stats: () => Object.assign({}, stats, stats0),
    // going through the perfumes of what is chosen
    scrollBy, scrollTo,
    // the Earth: the longitude facing you, and the countries lit
    earth: () => ({ spin, turning: !!spinTween, lit: PINS.filter((q) => q.lit).map((q) => q.name), pins: PINS.map((q) => q.name), rings: COAST.length }),
    open: openCard,
    // where on the window a group (a perfumer A–Z, a year by year) or one of
    // the chosen perfumer's houses stands, for a test to press
    pointOf: (key, house) => {
      const g = groups.find((x) => x.key === key);
      if (!g) return null;
      const h = house ? g.houses.find((x) => x.h === house) : null;
      let a = h ? (h.a0 + h.a1) / 2 : (g.a0 + g.a1) / 2;
      // close in, where it is on the window: its perfume nearest to where
      // the scroll stands
      if (zoomed() && focusList && focusList.length) {
        const at = angleAt(focusList, scrollS);
        let best = null, bd = Infinity;
        for (const e of (h ? h.members : g.members)) { const d = angDist(e.to, at); if (d < bd) { bd = d; best = e; } }
        if (best) a = best.to;
      }
      const r = h ? R.houMid : R.perMid;
      viewCam();
      proj(Math.cos(a) * r, Math.sin(a) * r, T0);
      const b = stage.getBoundingClientRect();
      return { x: b.left + M.a * T0.x + M.c * T0.y + M.e, y: b.top + M.b * T0.x + M.d * T0.y + M.f };
    },
  };
})();

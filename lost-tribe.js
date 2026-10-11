// ============================================================
// LOST TRIBE — houses/lost-tribe.html
//
// The twelfth house in Scent Descriptions, 2026-10-10. The owner: "The
// design of this shsould be minimalist wildlife and ingredients and
// should emphasize nature through ingredients and wildlife. It should be
// minimalist and with parrticles too; and make it reactive. Idk what
// exactly it is that I want so make something and we will adapt later."
//
// So the page is a NATURALIST'S FIELD NOTES, on linen:
//
//   THE SPECIMENS  down both margins, carried with the page, one every
//                  so far, left and right in turn: the house's own STAG —
//                  read off its mark, speck by speck, wherever the mark
//                  is copper — and the creatures and ingredients of its
//                  six fragrances, each drawn as a line of specks and
//                  named under it as a field guide names a thing, its
//                  Latin first: balsam fir and lavender (Equatorial),
//                  lime and cassia (Dirty Soda), the banana leaf (Kong),
//                  sandalwood (Santal Absolu), the rose (Pan's Labyrinth),
//                  vanilla, pink pepper, a swallowtail, a feather, a fern.
//                  Creatures in the house's slate, ingredients in its
//                  copper — the two colours of its mark.
//   THE STRAY      at rest each specimen's specks stand a little off their
//                  places, as seeds do on paper; bring the hand near and
//                  they come home and the drawing sharpens — and comes
//                  apart again when the hand goes. Each draws itself in
//                  the first time it is seen, along its own lines.
//   THE POLLEN     specks drifting up the window, swaying, drawn to the
//                  hand as moths are to a light.
//   THE LEAVES     falling the height of the window, turning over as they
//                  go and swaying, as the Houses view's do, pushed aside
//                  by the hand — and over the writing drawn quiet, as
//                  Ataraxia's bands are: they pass behind the words and do
//                  not glow while they do (2026-10-11: "i want the falling
//                  leaves to exist on the actual page too. when they fall
//                  behind the text, let them be de-emphasized").
//   THE FLOCK      a small flock crossing the window every few seconds —
//                  "make the birds more frequent" (2026-10-11; it was one
//                  every nine to eighteen) — sometimes two at once, birds
//                  as two strokes and a flap, keeping together, and
//                  scattering from the hand.
//
// READABILITY. The specimens stand only in the margins; where a window has
// none (a phone), they stand at its edges, faint, half off it. The pollen,
// the leaves and the flock are drawn at QUIET over the column, eased in at
// its edges.
//
// WITHOUT THIS SCRIPT the page is its writing on linen. WITH REDUCED
// MOTION the specimens are simply there, home and still, and nothing flies
// or drifts.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
  if (!ink) return;

  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const SEED = 22022;              // the house's year, in its mark
  const COLUMN = 940;
  const QUIET = 0.35;
  const SOFT = 90;

  const COPPER = [176, 118, 72];   // the stag's colour in the mark
  const SLATE = [86, 86, 132];     // its lettering's
  const LABEL = "rgba(86, 86, 132, 0.62)";

  const EVERY = 540;               // px down the page between two specimens
  const FIRST = 150;               // where the first stands
  const SPACING = 3.1;             // px between two specks along a line
  const STRAY = 4.2;               // px a speck stands off its place, at rest
  const HAND = 230;                // how far the hand reaches
  const DRAW_IN = 1700;            // ms a specimen takes to draw itself in

  const POLLEN = 110;
  const LEAVES = 14;               // falling at once (half on a phone)
  const LEAF_QUIET = 0.26;         // what is left of a leaf over the writing
  const FLOCK_EVERY = [3.5, 7];    // seconds between two flocks (it was 9 to 18)
  const FLOCKS = 2;                // how many may be crossing at once
  const FLOCK = [7, 11];           // birds in one
  const FLEE = 170;                // px: how near the hand a bird turns from it

  let seed = SEED;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const between = (a, b) => a + (b - a) * random();
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const gauss = () => (random() + random() + random() - 1.5) / 1.5;

  // ============================================================
  // DRAWING A SPECIMEN — every one is a list of lines in a box one wide
  // (and as tall as it needs), sampled into specks later.
  // ============================================================
  const bez = (p0, p1, p2, p3, n = 24) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
                u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]);
    }
    return out;
  };
  const arc = (cx, cy, rx, ry, a0, a1, n = 40) => {
    const out = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * (i / n); out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return out;
  };
  const seg = (a, b) => [a, b];
  /** A point along a polyline, and its direction, at share t of its length. */
  function along(line, t) {
    let total = 0;
    const lens = [];
    for (let i = 1; i < line.length; i++) { const l = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]); lens.push(l); total += l; }
    let want = total * t;
    for (let i = 0; i < lens.length; i++) {
      if (want <= lens[i] || i === lens.length - 1) {
        const f = lens[i] ? clamp(want / lens[i], 0, 1) : 0;
        const a = line[i], b = line[i + 1];
        return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, dx: (b[0] - a[0]) / (lens[i] || 1), dy: (b[1] - a[1]) / (lens[i] || 1) };
      }
      want -= lens[i];
    }
    return { x: line[0][0], y: line[0][1], dx: 0, dy: -1 };
  }

  function fir() {
    const lines = [];
    const stem = bez([0.52, 1.25], [0.46, 0.9], [0.56, 0.4], [0.48, 0.02]);
    lines.push(stem);
    const twigs = [stem, bez([0.5, 0.86], [0.36, 0.72], [0.22, 0.62], [0.12, 0.48]), bez([0.53, 0.62], [0.66, 0.5], [0.78, 0.42], [0.88, 0.26])];
    lines.push(twigs[1], twigs[2]);
    twigs.forEach((tw, k) => {
      const n = k ? 13 : 24;
      for (let i = 1; i < n; i++) {
        const p = along(tw, i / n);
        const len = 0.095 * (1 - (i / n) * 0.45);
        [-1, 1].forEach((side) => {
          const a = Math.atan2(p.dy, p.dx) + side * 1.0;
          lines.push(seg([p.x, p.y], [p.x + Math.cos(a) * len, p.y + Math.sin(a) * len]));
        });
      }
    });
    return { lines, tall: 1.28 };
  }
  function lime() {
    const lines = [arc(0.5, 0.5, 0.48, 0.48, 0, Math.PI * 2, 90), arc(0.5, 0.5, 0.42, 0.42, 0, Math.PI * 2, 80)];
    const n = 10;
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * Math.PI * 2 + 0.05, a1 = ((k + 1) / n) * Math.PI * 2 - 0.05;
      const am = (a0 + a1) / 2;
      lines.push(seg([0.5 + Math.cos(a0) * 0.05, 0.5 + Math.sin(a0) * 0.05], [0.5 + Math.cos(a0) * 0.38, 0.5 + Math.sin(a0) * 0.38]));
      lines.push(arc(0.5, 0.5, 0.38, 0.38, a0, a1, 10));
      // A vesicle or two in each segment.
      lines.push(arc(0.5 + Math.cos(am) * 0.24, 0.5 + Math.sin(am) * 0.24, 0.03, 0.06, 0, Math.PI * 2, 10));
    }
    return { lines, tall: 1 };
  }
  function leaf() {
    // The banana's: long, its veins parallel, torn here and there.
    const rib = bez([0.5, 1.3], [0.48, 0.9], [0.52, 0.4], [0.5, 0.0]);
    const left = bez([0.5, 1.12], [0.05, 0.95], [0.05, 0.25], [0.5, 0.0]);
    const right = bez([0.5, 1.12], [0.95, 0.95], [0.95, 0.25], [0.5, 0.0]);
    const lines = [rib, left, right];
    for (let i = 2; i < 26; i++) {
      const t = i / 26;
      const c = along(rib, 0.14 + t * 0.84);
      if (i % 7 === 3) continue;            // a tear
      [left, right].forEach((edge, s) => {
        const e = along(edge, 1 - t);
        lines.push(seg([c.x, c.y], [c.x + (e.x - c.x) * 0.97, e.y - 0.02]));
      });
    }
    return { lines, tall: 1.3 };
  }
  function tree() {
    // Sandalwood, as the house's own label draws a tree: a trunk dividing
    // and dividing, its crown left open.
    const lines = [];
    const grow = (x, y, a, len, depth) => {
      const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
      lines.push(seg([x, y], [x2, y2]));
      if (depth === 0) { lines.push(arc(x2, y2, 0.035, 0.03, 0, Math.PI * 2, 8)); return; }
      grow(x2, y2, a - between(0.28, 0.5), len * between(0.66, 0.76), depth - 1);
      grow(x2, y2, a + between(0.28, 0.5), len * between(0.66, 0.76), depth - 1);
    };
    grow(0.5, 1.1, -Math.PI / 2, 0.3, 5);
    lines.push(bez([0.38, 1.12], [0.45, 1.08], [0.55, 1.08], [0.62, 1.12]));
    return { lines, tall: 1.14 };
  }
  function rose() {
    const lines = [];
    for (let k = 0; k < 5; k++) lines.push(arc(0.5 + Math.cos(k * 1.3) * 0.02 * k, 0.3 + Math.sin(k * 1.3) * 0.015 * k, 0.05 + k * 0.045, 0.04 + k * 0.035, k * 1.1, k * 1.1 + Math.PI * 1.45, 28));
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - 0.4;
      lines.push(arc(0.5 + Math.cos(a) * 0.2, 0.32 + Math.sin(a) * 0.15, 0.16, 0.12, a - 1.4, a + 1.4, 20));
    }
    const stem = bez([0.5, 0.5], [0.52, 0.75], [0.46, 0.95], [0.5, 1.3]);
    lines.push(stem);
    [[0.7, -1], [0.92, 1]].forEach(([t, side]) => {
      const p = along(stem, t);
      lines.push(bez([p.x, p.y], [p.x + side * 0.12, p.y - 0.1], [p.x + side * 0.26, p.y - 0.06], [p.x + side * 0.3, p.y - 0.14]));
      lines.push(bez([p.x, p.y], [p.x + side * 0.1, p.y + 0.02], [p.x + side * 0.24, p.y + 0.02], [p.x + side * 0.3, p.y - 0.14]));
    });
    [0.62, 0.82, 1.0].forEach((t, k) => { const p = along(stem, t); const s = k % 2 ? 1 : -1; lines.push(seg([p.x, p.y], [p.x + s * 0.035, p.y - 0.03])); });
    return { lines, tall: 1.3 };
  }
  function vanilla() {
    const lines = [];
    const c = [0.5, 0.26];
    [[-Math.PI / 2, 0.2], [Math.PI / 2 + 0.6, 0.18], [Math.PI / 2 - 0.6, 0.18], [Math.PI + 0.3, 0.15], [-0.3, 0.15]].forEach(([a, r]) => {
      lines.push(arc(c[0] + Math.cos(a) * r * 0.55, c[1] + Math.sin(a) * r * 0.55, r * 0.5, r * 0.2, a - Math.PI, a + Math.PI, 26)
        .map(([x, y]) => { const dx = x - (c[0] + Math.cos(a) * r * 0.55), dy = y - (c[1] + Math.sin(a) * r * 0.55); const ca = Math.cos(a), sa = Math.sin(a);
          return [c[0] + Math.cos(a) * r * 0.55 + dx * ca - dy * sa * 1, c[1] + Math.sin(a) * r * 0.55 + dx * sa + dy * ca]; }));
    });
    lines.push(arc(c[0], c[1] + 0.05, 0.06, 0.07, 0, Math.PI * 2, 18));       // the lip
    // Two pods hanging from the vine.
    const vine = bez([0.18, 0.02], [0.4, 0.12], [0.6, 0.4], [0.62, 0.5]);
    lines.push(vine);
    [[0.6, 0.5], [0.66, 0.52]].forEach(([x, y], k) => {
      lines.push(bez([x, y], [x - 0.02 + k * 0.04, y + 0.3], [x + 0.06 * (k ? 1 : -1), y + 0.6], [x + 0.02 + k * 0.03, y + 0.82]));
      lines.push(bez([x + 0.025, y], [x + 0.005 + k * 0.04, y + 0.3], [x + 0.085 * (k ? 1 : -0.6), y + 0.6], [x + 0.03 + k * 0.03, y + 0.82]));
    });
    return { lines, tall: 1.36 };
  }
  function butterfly() {
    const lines = [];
    const wing = (s) => {
      lines.push(bez([0.5, 0.42], [0.5 + s * 0.2, 0.05], [0.5 + s * 0.52, 0.0], [0.5 + s * 0.47, 0.3]));
      lines.push(bez([0.5 + s * 0.47, 0.3], [0.5 + s * 0.44, 0.44], [0.5 + s * 0.2, 0.46], [0.5, 0.46]));
      lines.push(bez([0.5, 0.48], [0.5 + s * 0.32, 0.5], [0.5 + s * 0.36, 0.72], [0.5 + s * 0.2, 0.78]));
      lines.push(bez([0.5 + s * 0.2, 0.78], [0.5 + s * 0.22, 0.92], [0.5 + s * 0.16, 0.98], [0.5 + s * 0.14, 1.04]));  // the tail
      lines.push(bez([0.5 + s * 0.15, 0.8], [0.5 + s * 0.1, 0.72], [0.5 + s * 0.04, 0.6], [0.5, 0.56]));
      for (let k = 1; k < 5; k++) lines.push(seg([0.5 + s * 0.03, 0.42], [0.5 + s * (0.12 + k * 0.08), 0.1 + k * 0.05]));
      lines.push(arc(0.5 + s * 0.24, 0.66, 0.035, 0.03, 0, Math.PI * 2, 10));   // an eyespot
    };
    wing(-1); wing(1);
    lines.push(seg([0.5, 0.36], [0.5, 0.74]));
    lines.push(bez([0.5, 0.36], [0.47, 0.25], [0.44, 0.16], [0.4, 0.1]));
    lines.push(bez([0.5, 0.36], [0.53, 0.25], [0.56, 0.16], [0.6, 0.1]));
    return { lines, tall: 1.06 };
  }
  function feather() {
    const shaft = bez([0.48, 1.3], [0.5, 0.9], [0.56, 0.4], [0.5, 0.0]);
    const lines = [shaft];
    for (let i = 3; i < 34; i++) {
      const t = i / 34, p = along(shaft, t);
      const w = 0.22 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 0.02;
      [-1, 1].forEach((s) => {
        const a = Math.atan2(p.dy, p.dx) + s * 2.3;
        if (i % 9 === 4 && s > 0) return;       // a gap in the vane
        lines.push(seg([p.x, p.y], [p.x + Math.cos(a) * w, p.y + Math.sin(a) * w]));
      });
    }
    return { lines, tall: 1.3 };
  }
  function pepper() {
    const lines = [];
    const stem = bez([0.2, 0.0], [0.5, 0.15], [0.62, 0.4], [0.58, 0.62]);
    lines.push(stem);
    [0.3, 0.55, 0.85].forEach((t, k) => {
      const p = along(stem, t);
      const twig = bez([p.x, p.y], [p.x + 0.1, p.y + 0.1], [p.x + 0.04 - k * 0.06, p.y + 0.3], [p.x - 0.04 - k * 0.04, p.y + 0.42]);
      lines.push(twig);
      for (let j = 0; j < 9; j++) {
        const q = along(twig, 0.25 + (j / 9) * 0.75);
        lines.push(arc(q.x + (j % 2 ? 0.035 : -0.035), q.y, 0.025, 0.025, 0, Math.PI * 2, 10));
      }
    });
    return { lines, tall: 1.06 };
  }
  function cassia() {
    const lines = [];
    [[0.18, 0], [0.5, 0.08]].forEach(([y, dx]) => {
      const x0 = 0.1 + dx, x1 = 0.86 + dx;
      lines.push(seg([x0, y], [x1, y + 0.06]));
      lines.push(seg([x0, y + 0.12], [x1, y + 0.18]));
      lines.push(arc(x0, y + 0.06, 0.03, 0.06, Math.PI / 2, Math.PI * 1.5, 12));
      // The roll at its end, curled in on itself.
      const sp = [];
      for (let k = 0; k <= 40; k++) { const a = k * 0.35, r = 0.065 * (1 - k / 46); sp.push([x1 + Math.cos(a) * r * 0.5, y + 0.12 + Math.sin(a) * r]); }
      lines.push(sp);
    });
    return { lines, tall: 0.78 };
  }
  function lavender() {
    const lines = [];
    [[0.4, -0.08], [0.55, 0.0], [0.68, 0.1]].forEach(([x, lean]) => {
      const stem = bez([0.5, 1.25], [0.5 + lean * 0.5, 0.9], [x, 0.5], [x + lean, 0.05]);
      lines.push(stem);
      for (let j = 0; j < 9; j++) {
        const q = along(stem, j * 0.04);
        lines.push(arc(q.x - 0.02, q.y, 0.02, 0.012, 0, Math.PI * 2, 8));
        lines.push(arc(q.x + 0.02, q.y, 0.02, 0.012, 0, Math.PI * 2, 8));
      }
    });
    lines.push(bez([0.5, 1.0], [0.36, 0.86], [0.3, 0.72], [0.26, 0.6]));
    lines.push(bez([0.5, 1.05], [0.66, 0.94], [0.72, 0.84], [0.78, 0.74]));
    return { lines, tall: 1.26 };
  }
  function fern() {
    const stem = bez([0.5, 1.3], [0.42, 0.9], [0.6, 0.4], [0.44, 0.0]);
    const lines = [stem];
    for (let i = 1; i < 18; i++) {
      const t = i / 18, p = along(stem, t);
      const len = 0.36 * Math.sin(Math.PI * (1 - t) * 0.9 + 0.12) * (1 - t * 0.5);
      [-1, 1].forEach((s) => {
        const a = Math.atan2(p.dy, p.dx) + s * 1.25;
        const tip = [p.x + Math.cos(a) * len, p.y + Math.sin(a) * len];
        const n = [-Math.sin(a) * len * 0.16, Math.cos(a) * len * 0.16];
        lines.push(bez([p.x, p.y], [p.x + (tip[0] - p.x) * 0.4 + n[0], p.y + (tip[1] - p.y) * 0.4 + n[1]], [p.x + (tip[0] - p.x) * 0.8 + n[0] * 0.5, p.y + (tip[1] - p.y) * 0.8 + n[1] * 0.5], tip, 10));
        lines.push(bez([p.x, p.y], [p.x + (tip[0] - p.x) * 0.4 - n[0], p.y + (tip[1] - p.y) * 0.4 - n[1]], [p.x + (tip[0] - p.x) * 0.8 - n[0] * 0.5, p.y + (tip[1] - p.y) * 0.8 - n[1] * 0.5], tip, 10));
      });
    }
    return { lines, tall: 1.3 };
  }

  // THE PLATES, in the order they stand down the page. The stag first,
  // read off the house's mark once it has loaded.
  const PLATES = [
    { make: null, name: "Cervus elaphus", common: "red deer · the house’s own", colour: SLATE },
    { make: fir, name: "Abies balsamea", common: "balsam fir · Equatorial", colour: COPPER },
    { make: butterfly, name: "Papilio machaon", common: "swallowtail", colour: SLATE },
    { make: lime, name: "Citrus × aurantiifolia", common: "lime · Dirty Soda", colour: COPPER },
    { make: leaf, name: "Musa acuminata", common: "banana leaf · Kong", colour: COPPER },
    { make: feather, name: "Corvus corax", common: "a raven’s feather", colour: SLATE },
    { make: tree, name: "Santalum album", common: "sandalwood · Santal Absolu", colour: COPPER },
    { make: rose, name: "Rosa × damascena", common: "rose · Pan’s Labyrinth", colour: COPPER },
    { make: vanilla, name: "Vanilla planifolia", common: "vanilla · Watch King", colour: COPPER },
    { make: lavender, name: "Lavandula angustifolia", common: "lavender · Equatorial", colour: COPPER },
    { make: pepper, name: "Schinus molle", common: "pink pepper · Dirty Soda", colour: COPPER },
    { make: fern, name: "Polystichum munitum", common: "sword fern", colour: SLATE },
    { make: cassia, name: "Cinnamomum cassia", common: "cassia bark · Dirty Soda", colour: COPPER },
  ];
  const drawn = PLATES.map((p) => (p.make ? p.make() : null));

  /** The stag, off the mark: every copper pixel of it, on a grid. */
  function readStag(done) {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const g = c.getContext("2d", { willReadFrequently: true });
      if (!g) return;
      g.drawImage(img, 0, 0);
      let data;
      try { data = g.getImageData(0, 0, w, h).data; } catch (e) { return; }
      const pts = [];
      const step = 5;
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4, r = data[i], gg = data[i + 1], b = data[i + 2];
        if (r - b > 45 && r > 120 && r < 235 && gg < r) pts.push([x, y]);
      }
      if (pts.length < 40) return;
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const s = 1 / (x1 - x0);
      drawn[0] = { points: pts.map(([x, y]) => [(x - x0) * s, (y - y0) * s]), tall: (y1 - y0) * s };
      done();
    };
    img.src = (window.SITE_ROOT || "../") + "images/Lost%20Tribe/house-web/lost-tribe-house.webp";
  }

  // ============================================================
  // LAYING THEM DOWN THE PAGE — in document space, rebuilt only when the
  // page's width or length changes.
  // ============================================================
  let W = 0, H = 0, docTall = 0, ratio = 1, laidW = 0;
  let plates = [];                  // { x, y, size, specks: [...], name, common, colour, born }
  function specksOf(shape, size) {
    const out = [];
    if (shape.points) {
      shape.points.forEach(([x, y], i) => out.push(speck(x * size, y * size, i / shape.points.length)));
      return out;
    }
    const total = shape.lines.length;
    shape.lines.forEach((line, li) => {
      for (let i = 1; i < line.length; i++) {
        const ax = line[i - 1][0] * size, ay = line[i - 1][1] * size, bx = line[i][0] * size, by = line[i][1] * size;
        const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / SPACING));
        for (let k = 0; k < n; k++) {
          const f = k / n;
          out.push(speck(ax + (bx - ax) * f, ay + (by - ay) * f, (li + (i - 1 + f) / line.length) / total));
        }
      }
    });
    return out;
  }
  function speck(x, y, order) {
    return { x, y, order, ox: gauss() * STRAY, oy: gauss() * STRAY, phase: random() * Math.PI * 2, size: between(1.1, 1.9), base: between(0.7, 1) };
  }
  function lay() {
    seed = SEED + 7;
    // Laid again the same way each time (the same seed), so a plate already
    // drawn in keeps its place and does not draw itself in again.
    const before = plates;
    plates = [];
    const margin = (W - COLUMN) / 2;
    const wide = margin >= 130;
    const size = wide ? Math.min(margin * 0.66, 200) : Math.min(150, W * 0.36);
    let y = FIRST, k = 0;
    while (y < docTall - 120) {
      const shape = drawn[k % drawn.length];
      const p = PLATES[k % PLATES.length];
      if (shape) {
        const right = k % 2 === 0;
        const x = wide ? (right ? W - margin / 2 - size / 2 : margin / 2 - size / 2)
          : (right ? W - size * 0.55 : -size * 0.45);   // half off the edge, faint
        plates.push({ x, y, size, tall: shape.tall * size, specks: specksOf(shape, size), name: p.name, common: p.common, colour: p.colour,
          wide, right, born: before[plates.length] ? before[plates.length].born : 0 });
      }
      y += EVERY + between(-60, 60);
      k++;
    }
  }

  function size() {
    W = window.innerWidth; H = window.innerHeight;
    const tall = Math.max(document.documentElement.scrollHeight, H);
    ratio = Math.min(W < 700 ? 1.5 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * ratio);
    canvas.height = Math.round(H * ratio);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    if (Math.abs(tall - docTall) > 40 || W !== laidW) { docTall = tall; laidW = W; lay(); }
  }

  function quiet(x) {
    const edge = W > COLUMN ? (W - COLUMN) / 2 : 0;
    const soft = Math.min(SOFT, W * 0.14);
    const from = edge - soft, to = W - edge + soft;
    if (x <= from || x >= to) return 1;
    const inside = Math.min(x - from, to - x) / soft;
    return QUIET + (1 - QUIET) * Math.max(0, 1 - Math.min(1, inside));
  }
  /** The same, quieter: a leaf over the writing is nearly gone. */
  const leafQuiet = (x) => LEAF_QUIET + (1 - LEAF_QUIET) * (quiet(x) - QUIET) / (1 - QUIET);

  // ============================================================
  // THE POLLEN, AND THE FLOCK — in window space.
  // ============================================================
  const pollen = [];
  for (let i = 0; i < Math.round(POLLEN * (window.innerWidth < 700 ? 0.5 : 1)); i++) {
    pollen.push({ x: random(), y: random(), vx: 0, vy: 0, rise: between(5, 13), sway: between(6, 18), phase: random() * Math.PI * 2,
      size: between(1, 2.2), base: between(0.25, 0.6), colour: random() < 0.6 ? COPPER : SLATE });
  }
  // THE LEAVES, in window space: each falls, sways, turns over, and comes
  // back in at the top once it has fallen past the foot.
  const leaves = [];
  function fallingLeaf(top) {
    return { x: random(), y: top ? -between(20, 60) : random() * H, fall: between(24, 50), sway: between(16, 44),
      phase: random() * Math.PI * 2, spin: between(-1.1, 1.1), tumble: between(0.7, 1.4), len: between(14, 28),
      base: between(0.5, 0.85), colour: random() < 0.78 ? COPPER : SLATE, vx: 0, turn: 0 };
  }
  function makeLeaves() {
    const want = Math.round(LEAVES * (window.innerWidth < 700 ? 0.5 : 1));
    if (leaves.length >= want) return;
    while (leaves.length < want) leaves.push(fallingLeaf(false));
    canvas.dataset.leaves = String(leaves.length);       // for the tests
  }

  // THE FLOCKS — up to FLOCKS crossing at once, a new one every few seconds.
  let flocks = [], nextFlock = between(1, 2.5), flocked = 0;
  function startFlock(t) {
    const n = Math.round(between(FLOCK[0], FLOCK[1]));
    const fromLeft = random() < 0.5;
    const y0 = between(0.12, 0.6) * H;
    const lead = { x: fromLeft ? -60 : W + 60, y: y0, vx: (fromLeft ? 1 : -1) * between(70, 110), wave: between(0.4, 0.9), amp: between(20, 60), t0: t };
    const flock = [];
    for (let i = 0; i < n; i++) {
      flock.push({ x: lead.x - lead.vx * 0.2 * i + gauss() * 30, y: y0 + gauss() * 30, vx: lead.vx, vy: 0, flap: random() * Math.PI * 2, rate: between(7, 10), lead });
    }
    flocks.push(flock);
    canvas.dataset.flocks = String(++flocked);              // how many have set off, for the tests
  }
  function moveFlocks(t, dt) {
    nextFlock -= dt;
    if (nextFlock <= 0 && flocks.length < FLOCKS) { startFlock(t); nextFlock = between(FLOCK_EVERY[0], FLOCK_EVERY[1]); }
    flocks = flocks.filter((flock) => moveFlock(flock, t, dt));
  }
  /** One flock's frame; false once it has gone off the window. */
  function moveFlock(flock, t, dt) {
    const lead = flock[0].lead;
    lead.x += lead.vx * dt;
    const ly = lead.y + Math.sin((t - lead.t0) * lead.wave) * lead.amp;
    let gone = true;
    flock.forEach((b, i) => {
      // Towards a place in the flock, behind and beside the lead.
      const tx = lead.x - Math.sign(lead.vx) * (i % 4) * 26, ty = ly + ((i % 3) - 1) * 22 + Math.floor(i / 3) * 14;
      let ax = (tx - b.x) * 1.3 - b.vx * 0.6 + lead.vx * 0.6, ay = (ty - b.y) * 1.3 - b.vy * 0.8;
      flock.forEach((o) => { if (o !== b) { const dx = b.x - o.x, dy = b.y - o.y, d = Math.hypot(dx, dy); if (d < 18 && d > 0.1) { ax += (dx / d) * 260; ay += (dy / d) * 260; } } });
      if (handX > -9000) {
        const dx = b.x - handX, dy = b.y - handY, d = Math.hypot(dx, dy);
        if (d < FLEE && d > 0.1) { const f = (1 - d / FLEE) * 2600; ax += (dx / d) * f; ay += (dy / d) * f; b.rate = 14; }
      }
      b.vx += ax * dt; b.vy += ay * dt;
      const sp = Math.hypot(b.vx, b.vy), most = 260;
      if (sp > most) { b.vx *= most / sp; b.vy *= most / sp; }
      b.x += b.vx * dt; b.y += b.vy * dt;
      b.rate += (8.5 - b.rate) * dt;
      b.flap += b.rate * dt;
      if (b.x > -80 && b.x < W + 80 && b.y > -80 && b.y < H + 80) gone = false;
    });
    return !(gone && (lead.x < -200 || lead.x > W + 200));
  }

  // ============================================================
  // DRAWING
  // ============================================================
  let handX = -99999, handY = -99999;
  const rgb = (c) => "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  function draw(now, t, dt) {
    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
    ink.clearRect(0, 0, W, H);
    const down = window.scrollY;

    // THE SPECIMENS
    plates.forEach((p) => {
      const top = p.y - down;
      if (top > H + 40 || top + p.tall + 60 < 0) return;
      if (!p.born) p.born = now;
      const into = REDUCE ? 1 : clamp((now - p.born) / DRAW_IN, 0, 1);
      const faint = p.wide ? 1 : 0.42;
      ink.fillStyle = rgb(p.colour);
      p.specks.forEach((s) => {
        if (s.order > into) return;
        const edge = into < 1 ? clamp((into - s.order) * 14, 0, 1) : 1;
        let x = p.x + s.x, y = top + s.y;
        let home = 0;
        if (handX > -9000) {
          const d = Math.hypot(x - handX, y - handY);
          if (d < HAND) home = Math.pow(1 - d / HAND, 1.3);
        }
        if (!REDUCE) {
          const away = 1 - home * 0.94;
          x += (s.ox + Math.sin(t * 0.7 + s.phase) * 1.4) * away;
          y += (s.oy + Math.cos(t * 0.6 + s.phase) * 1.4) * away;
        }
        ink.globalAlpha = clamp(s.base * (0.66 + 0.34 * home) * edge * faint, 0, 1);
        const z = s.size * (1 + 0.25 * home);
        ink.fillRect(x - z / 2, y - z / 2, z, z);
      });
      // ITS NAME, as a field guide sets it: the Latin, and under it what
      // it is and whose.
      if (p.wide && into > 0.6) {
        ink.globalAlpha = clamp((into - 0.6) / 0.4, 0, 1);
        ink.fillStyle = LABEL;
        ink.textAlign = "center";
        ink.font = "italic 11px Archivo, Helvetica, Arial, sans-serif";
        ink.fillText(p.name, p.x + p.size / 2, top + p.tall + 26);
        ink.font = "9.5px 'IBM Plex Mono', ui-monospace, monospace";
        ink.fillText(p.common.toUpperCase(), p.x + p.size / 2, top + p.tall + 41);
      }
    });
    ink.globalAlpha = 1;

    // THE POLLEN
    pollen.forEach((s) => {
      if (!REDUCE) {
        s.y -= (s.rise * dt) / H;
        let x = s.x * W, y = s.y * H;
        if (handX > -9000) {
          const dx = handX - x, dy = handY - y, d = Math.hypot(dx, dy);
          if (d < 200 && d > 6) { s.vx += (dx / d) * 30 * dt * (1 - d / 200); s.vy += (dy / d) * 30 * dt * (1 - d / 200); }
        }
        s.vx *= 0.97; s.vy *= 0.97;
        s.x += (s.vx * dt) / W; s.y += (s.vy * dt) / H;
        if (s.y < -0.03) { s.y = 1.03; s.x = random(); s.vx = s.vy = 0; }
        if (s.x < -0.03) s.x = 1.03; else if (s.x > 1.03) s.x = -0.03;
      }
      const x = s.x * W + (REDUCE ? 0 : Math.sin(t * 0.4 + s.phase) * s.sway), y = s.y * H;
      ink.fillStyle = rgb(s.colour);
      ink.globalAlpha = s.base * quiet(x);
      ink.fillRect(x, y, s.size, s.size);
    });

    // THE LEAVES
    makeLeaves();
    ink.lineWidth = 1;
    leaves.forEach((L, i) => {
      if (!REDUCE) {
        L.y += L.fall * dt;
        // Pushed aside by the hand, as by a breath, and set turning.
        let x = L.x * W;
        if (handX > -9000) {
          const dx = x - handX, dy = L.y - handY, d = Math.hypot(dx, dy);
          if (d < 150 && d > 1) { L.vx += (dx / d) * 260 * (1 - d / 150) * dt; L.turn += (1 - d / 150) * 4 * dt * Math.sign(dx || 1); }
        }
        L.vx *= 0.96; L.turn *= 0.97;
        L.x += (L.vx * dt) / W;
        if (L.y > H + 40 || L.x < -0.06 || L.x > 1.06) leaves[i] = fallingLeaf(true);
      }
      const x = L.x * W + (REDUCE ? 0 : Math.sin(t * 0.8 + L.phase) * L.sway), y = L.y;
      const q = leafQuiet(x);
      ink.save();
      ink.translate(x, y);
      ink.rotate(L.spin * t + L.turn + Math.sin(t * 1.3 + L.phase) * 0.6);
      ink.scale(1, 0.35 + 0.65 * Math.abs(Math.cos(t * L.tumble + L.phase)));
      const len = L.len;
      // A faint body, then the outline, the midrib and the veins.
      ink.fillStyle = rgb(L.colour);
      ink.strokeStyle = rgb(L.colour);
      ink.beginPath();
      ink.moveTo(0, -len / 2);
      ink.quadraticCurveTo(len * 0.42, 0, 0, len / 2);
      ink.quadraticCurveTo(-len * 0.42, 0, 0, -len / 2);
      ink.globalAlpha = 0.1 * L.base * q;
      ink.fill();
      ink.globalAlpha = 0.75 * L.base * q;
      ink.moveTo(0, -len / 2); ink.lineTo(0, len / 2 + 4);
      for (let k = 1; k < 4; k++) {
        const yy = -len / 2 + (k / 4) * len;
        ink.moveTo(0, yy); ink.lineTo(len * 0.22, yy - len * 0.12);
        ink.moveTo(0, yy); ink.lineTo(-len * 0.22, yy - len * 0.12);
      }
      ink.stroke();
      ink.restore();
    });
    ink.globalAlpha = 1;

    // THE FLOCKS
    if (!REDUCE) {
      moveFlocks(t, dt);
      ink.strokeStyle = rgb(SLATE);
      ink.lineWidth = 1.2;
      ink.lineCap = "round";
      flocks.flat().forEach((b) => {
        const dir = Math.atan2(b.vy, b.vx);
        const up = Math.sin(b.flap) * 0.7;
        const span = 7;
        ink.globalAlpha = 0.62 * quiet(b.x);
        ink.save();
        ink.translate(b.x, b.y);
        ink.rotate(dir + (b.vx < 0 ? Math.PI : 0));
        const sx = b.vx < 0 ? -1 : 1;
        ink.scale(sx, 1);
        ink.beginPath();
        ink.moveTo(-span, -span * (0.35 + up));
        ink.quadraticCurveTo(-span * 0.4, -span * 0.1, 0, 0);
        ink.quadraticCurveTo(span * 0.4, -span * 0.1, span, -span * (0.35 + up));
        ink.stroke();
        ink.restore();
      });
    }
    ink.globalAlpha = 1;
  }

  // ============================================================
  // KEEPING UP
  // ============================================================
  const hand = (event) => { handX = event.clientX; handY = event.clientY; if (REDUCE) draw(performance.now(), 0, 0); };
  window.addEventListener("pointermove", hand, { passive: true });
  window.addEventListener("pointerdown", hand, { passive: true });
  document.addEventListener("pointerleave", () => { handX = -99999; handY = -99999; });
  window.addEventListener("resize", () => { size(); if (REDUCE) draw(performance.now(), 0, 0); });

  size();
  readStag(() => { lay(); if (REDUCE) draw(performance.now(), 0, 0); });
  const began = performance.now();
  let last = began;
  if (REDUCE) {
    draw(began, 0, 0);
    window.addEventListener("scroll", () => draw(performance.now(), 0, 0), { passive: true });
  } else {
    (function frame(now) {
      if (Math.abs(document.documentElement.scrollHeight - docTall) > 40) size();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, (now - began) / 1000, dt);
      requestAnimationFrame(frame);
    })(began);
  }
})();

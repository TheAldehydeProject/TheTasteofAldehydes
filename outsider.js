// ============================================================
// OUTSIDER PARFUMS — houses/outsider-parfums.html
//
// The eleventh house, Om's sister. For its first day it was Om's drawing
// in its own colours, without the fracture: an armillary with a reflected
// twin drifting into register, and its name arriving with an echo. The
// owner, 2026-10-11: "for outsider, remove the merginig motifs and I want
// you to add a door that is slightly ajar, with a small ught coming from
// that door. that is to be the main motif; similarly to les abstraits
// closet. follow the same theme when you enter the house part too pleas."
//
// So the page is A DOOR, standing in the left margin on the floor of the
// window, as Les Abstraits' armoire does, and drawn as it is — plain
// geometry in hairlines, a speck at each joint, DRAWN UP FROM THE FLOOR
// as the page opens, every line growing from its lower end:
//
//   THE FRAME     an architrave round the opening, its head with a
//                 moulding, a block at the foot of each jamb, the
//                 threshold, and the floor line run out either side.
//   THE DOOR      hinged on the left and standing SLIGHTLY AJAR, swung a
//                 little way into the room behind, so it is seen narrowed
//                 in perspective — its four panels with it — its knob near
//                 the open edge.
//   THE LIGHT     coming through the gap between the door and the jamb: a
//                 sliver of pale light the height of the opening, glowing
//                 softly round itself, a thin line of it under the door,
//                 and a wedge of it laid out across the floor in front —
//                 in the house's green, the light of its own photographs.
//                 It comes up once the door is drawn, breathing a little,
//                 as a lamp in another room does.
//   THE MOTES     dust in the light, drifting slowly, bright where the
//                 light is and gone out of it.
//   THE HAND      comes near and the door gives a little — opens a few
//                 degrees more, and the light with it — and settles back
//                 when the hand goes.
//
// THE DOOR LIVES ON THE WINDOW: it stands in the room, and the page scrolls
// over it. Over the writing anything that reaches into it is drawn quiet,
// each piece at the quiet of where it stands — never a mask over the
// whole window, which is what made the Om page slow. It stands CLEAR OF THE
// SCALE down the side (house.js's rank): beside it, or under it.
//
// WITHOUT THIS SCRIPT the page is its writing on the dark ground. WITH
// REDUCED MOTION the door simply stands, ajar, its light steady.
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
  const COLUMN = 940;
  const QUIET = 0.3;
  const SOFT = 44;

  const LINE = "228, 222, 206";    // the hairlines, ivory
  const GREEN = "104, 178, 138";   // the house's green — the light's glow
  const LIGHT = "226, 246, 222";   // the light's heart, white with the green in it

  const TALL_OF = 2.25;            // the frame's height, of its width
  const AJAR = 0.34;               // radians the door stands open
  const AJAR_HAND = 0.12;          // and how much more under the hand
  const BUILD = 2.2;               // seconds, drawn up from the floor
  const LIGHT_IN = 1.3;            // seconds for the light to come up, once the door stands
  const MOTES = 70;                // dust in the light

  let seed = 61117;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const between = (a, b) => a + (b - a) * random();
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const rgba = (c, a) => "rgba(" + c + "," + clamp(a, 0, 1).toFixed(3) + ")";

  let width = 0, height = 0, ratio = 1;
  let frame = null;                // where the door stands, and its size
  const margin = () => Math.max(0, (width - COLUMN) / 2);

  /** What is left of the drawing at x: whole in the margins and a little
      into the column's own margin, where there is no writing yet; QUIET by
      the time the writing begins, 64px in; without margins, quiet all the
      way across. */
  function quiet(x) {
    if (width <= COLUMN) return QUIET;
    const edge = (width - COLUMN) / 2;
    const from = edge + 20, to = width - edge - 20;
    if (x <= from || x >= to) return 1;
    const inside = Math.min(x - from, to - x) / SOFT;
    return QUIET + (1 - QUIET) * Math.max(0, 1 - Math.min(1, inside));
  }

  // ============================================================
  // THE DOOR, in its own frame: x from 0 to W across the architrave, y
  // from 0 at the floor up to -T. `open` is how far ajar the door stands
  // (radians) — the leaf is made again for it, the frame is not.
  // ============================================================
  function design(W) {
    const T = W * TALL_OF;
    const f = W * 0.085;                 // the architrave's breadth
    const head = T * 0.07;               // the head, over the opening
    const ox1 = f, ox2 = W - f, oyTop = -(T - head);
    const lines = [];
    const put = (pts, weight) => {
      let len = 0;
      const at = [0];
      for (let i = 1; i < pts.length; i++) {
        len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        at.push(len);
      }
      const ys = pts.map((p) => -p[1] / T);
      lines.push({ pts, at, len: Math.max(0.01, len), from: Math.min(...ys), to: Math.max(...ys), weight: weight || 1 });
    };
    // THE ARCHITRAVE: its outer edge and its inner, the jambs rising from
    // the floor, a fillet line along each, and the head across.
    put([[0, 0], [0, -T]]); put([[W, 0], [W, -T]]);
    put([[ox1, 0], [ox1, oyTop]]); put([[ox2, 0], [ox2, oyTop]]);
    put([[f * 0.45, -f * 1.6], [f * 0.45, oyTop + head * 0.2]], 0.45);
    put([[W - f * 0.45, -f * 1.6], [W - f * 0.45, oyTop + head * 0.2]], 0.45);
    put([[0, -T], [W, -T]]); put([[ox1, oyTop], [ox2, oyTop]]);
    // The head's moulding: a cap proud of the architrave, and a line
    // under it.
    put([[-f * 0.35, -T], [-f * 0.35, -T - head * 0.32], [W + f * 0.35, -T - head * 0.32], [W + f * 0.35, -T]], 0.9);
    put([[f * 0.45, oyTop + head * 0.2], [W - f * 0.45, oyTop + head * 0.2]], 0.45);
    // A block at the foot of each jamb.
    put([[0, -f * 1.6], [ox1, -f * 1.6]], 0.7);
    put([[ox2, -f * 1.6], [W, -f * 1.6]], 0.7);
    // The floor, run out either side, and the threshold.
    put([[-W * 0.35, 0], [W * 1.45, 0]], 0.55);
    put([[ox1, -2.5], [ox2, -2.5]], 0.6);

    // THE JOINTS, one speck each.
    const joints = [];
    const seen = new Set();
    lines.forEach((l) => l.pts.forEach((p, i) => {
      const key = Math.round(p[0]) + "," + Math.round(p[1]);
      if (seen.has(key) || l.weight < 0.6) return;
      seen.add(key);
      joints.push({ x: p[0], y: p[1], l, at: l.at[i] });
    }));
    return { W, T, f, head, ox1, ox2, oyTop, lines, joints };
  }

  /** The door leaf, hinged at the opening's left edge, standing `open`
      radians into the room: its four corners, its free edge drawn in by
      the perspective (higher at the foot, lower at the head). */
  function leafOf(d, open) {
    const span = d.ox2 - d.ox1 - 1.5;
    const across = span * Math.cos(open);
    const fall = span * Math.sin(open) * 0.16;      // how far the free edge recedes
    const x0 = d.ox1, x1 = d.ox1 + across;
    const top0 = d.oyTop + 1.5, bot0 = -3;
    return { x0, x1, top0, bot0, top1: top0 + fall, bot1: bot0 - fall * 0.55 };
  }
  /** A point on the leaf at u across (0 hinge, 1 free edge), v down (0
      head, 1 foot). */
  function onLeaf(L, u, v) {
    const x = L.x0 + (L.x1 - L.x0) * u;
    const top = L.top0 + (L.top1 - L.top0) * u, bot = L.bot0 + (L.bot1 - L.bot0) * u;
    return [x, top + (bot - top) * v];
  }

  // ============================================================
  // PLACING IT — in the left margin, clear of the scale, as large as the
  // room lets it be (Les Abstraits' armoire, `build`).
  // ============================================================
  function scaleBox() {
    const el = document.querySelector(".human-rank");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return { right: r.left + r.width + 8, bottom: r.bottom };
  }
  function build() {
    const room = margin();
    // The floor a little above the window's foot, so the light laid
    // across it in front of the door has room.
    const baseY = height - Math.max(40, height * 0.075);
    const most = Math.min(230, (height * 0.84) / (TALL_OF + 0.1));
    const scale = scaleBox();
    const under = scale ? (baseY - scale.bottom - 14) / (TALL_OF + 0.1) : Infinity;
    let W, from, faint = 1;
    if (room > 130) {
      const to = room + 30;
      const beside = (x) => Math.min(most, (to - x) / 1.12);
      from = 22;
      W = beside(22);
      if (scale) {
        const a = beside(scale.right + 16), b = Math.min(W, under);
        if (a >= b) { W = a; from = scale.right + 16; } else W = b;
      }
    } else {
      // On a window without margins, a small one in the corner, quiet
      // behind the writing.
      from = 10;
      W = Math.min(width * 0.2, 74, most, under);
      faint = 0.5;
    }
    W = Math.max(44, W);
    const d = design(W);
    frame = { d, left: from + d.f * 0.4, baseY, faint };
  }

  function size() {
    width = window.innerWidth; height = window.innerHeight;
    ratio = Math.min(width < 700 ? 1.5 : 2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    build();
  }

  // ============================================================
  // THE MOTES — each at a place in the light: share of the way out from
  // the gap along the spill (0 the gap, 1 the spill's far end) and up the
  // opening, drifting.
  // ============================================================
  const motes = Array.from({ length: Math.round(MOTES * (window.innerWidth < 700 ? 0.5 : 1)) }, () => ({
    u: random(), v: random(), du: between(-0.012, 0.018), dv: between(-0.02, 0.006),
    size: between(0.8, 1.8), base: between(0.35, 0.9), phase: random() * Math.PI * 2,
  }));

  // ============================================================
  // DRAWING
  // ============================================================
  let handX = -99999, handY = -99999, give = 0;
  function draw(clock, dt) {
    if (!frame) return;
    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
    ink.clearRect(0, 0, width, height);
    const { d, left, baseY, faint } = frame;
    const P = (x, y) => [left + x, baseY + y];
    const built = REDUCE ? 1 : ease(clock / BUILD);
    const reach = built * 1.12;

    // The hand near the door: it gives a little.
    const [cx, cy] = P(d.W / 2, -d.T / 2);
    const near = handX > -9000 && Math.hypot(handX - cx, handY - cy) < d.T * 0.75 ? 1 : 0;
    give += (near - give) * (REDUCE ? 1 : Math.min(1, dt * 2.2));
    const open = AJAR + AJAR_HAND * give;
    const breathe = REDUCE ? 1 : 0.94 + 0.04 * Math.sin(clock * 1.3) + 0.02 * Math.sin(clock * 3.1 + 1.2);
    const lit = (REDUCE ? 1 : ease((clock - BUILD * 0.8) / LIGHT_IN)) * breathe * (1 + 0.25 * give);

    const L = leafOf(d, open);
    // THE GAP between the door and the jamb, where the light comes through.
    const gTop = [L.x1, L.top1], gBot = [L.x1, L.bot1];
    const jTop = [d.ox2, d.oyTop + 1.5], jBot = [d.ox2, -3];

    ink.lineCap = "round";
    // THE LIGHT FIRST, under the lines: the glow round the gap, the wedge on
    // the floor, the line under the door, and the sliver itself.
    if (lit > 0.004) {
      const [gx, gy] = P((L.x1 + d.ox2) / 2, (d.oyTop - 3) / 2);
      const q = Math.max(quiet(gx), 0.6) * faint;
      ink.globalCompositeOperation = "lighter";
      // The glow, round the gap and out into the room in front.
      const gr = d.T * 0.62;
      const glow = ink.createRadialGradient(gx, gy, 0, gx, gy, gr);
      glow.addColorStop(0, rgba(GREEN, 0.3 * lit * q));
      glow.addColorStop(0.35, rgba(GREEN, 0.1 * lit * q));
      glow.addColorStop(1, rgba(GREEN, 0));
      ink.fillStyle = glow;
      ink.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
      // A halo the height of the gap, soft all round it: a round glow drawn
      // long and narrow.
      const [mx] = P((L.x1 + d.ox2) / 2, 0), [, my] = P(0, d.oyTop / 2);
      const hr = d.W * 0.2, tall = (-d.oyTop / 2) / hr;
      ink.save();
      ink.translate(mx, my);
      ink.scale(1, tall);
      const halo = ink.createRadialGradient(0, 0, 0, 0, 0, hr);
      halo.addColorStop(0, rgba(LIGHT, 0.2 * lit * q));
      halo.addColorStop(0.5, rgba(GREEN, 0.08 * lit * q));
      halo.addColorStop(1, rgba(GREEN, 0));
      ink.fillStyle = halo;
      ink.fillRect(-hr, -hr, hr * 2, hr * 2);
      ink.restore();
      // The wedge across the floor, fanning out from the gap towards you.
      const [a1x, a1y] = P(L.x1, 0), [a2x, a2y] = P(d.ox2, 0);
      const out = Math.min(d.T * 0.17, height - baseY - 6);
      const [b1x, b1y] = P(L.x1 - d.W * 0.18, out * 0.55), [b2x, b2y] = P(d.ox2 + d.W * 1.1, out);
      const wedge = ink.createLinearGradient(a1x, a1y, (b1x + b2x) / 2, (b1y + b2y) / 2);
      wedge.addColorStop(0, rgba(LIGHT, 0.5 * lit * q));
      wedge.addColorStop(0.3, rgba(GREEN, 0.2 * lit * q));
      wedge.addColorStop(1, rgba(GREEN, 0));
      ink.fillStyle = wedge;
      ink.beginPath(); ink.moveTo(a1x, a1y); ink.lineTo(a2x, a2y); ink.lineTo(b2x, b2y); ink.lineTo(b1x, b1y); ink.closePath(); ink.fill();
      // The line of it under the door.
      const [u1x, u1y] = P(d.ox1 + 2, -1), [u2x] = P(L.x1, -1);
      ink.strokeStyle = rgba(GREEN, 0.5 * lit * q);
      ink.lineWidth = 1;
      ink.beginPath(); ink.moveTo(u1x, u1y); ink.lineTo(u2x, u1y); ink.stroke();
      // The sliver: the gap, lit, brightest at its heart.
      const [s1x, s1y] = P(gTop[0], gTop[1]), [s2x, s2y] = P(jTop[0], jTop[1]);
      const [s3x, s3y] = P(jBot[0], jBot[1]), [s4x, s4y] = P(gBot[0], gBot[1]);
      const sliver = ink.createLinearGradient(0, s1y, 0, s4y);
      sliver.addColorStop(0, rgba(LIGHT, 0.6 * lit * q));
      sliver.addColorStop(0.55, rgba(LIGHT, 1 * lit * q));
      sliver.addColorStop(1, rgba(LIGHT, 0.8 * lit * q));
      ink.fillStyle = sliver;
      ink.beginPath(); ink.moveTo(s1x, s1y); ink.lineTo(s2x, s2y); ink.lineTo(s3x, s3y); ink.lineTo(s4x, s4y); ink.closePath(); ink.fill();
      ink.globalCompositeOperation = "source-over";
    }

    // THE FRAME, each line grown from its lower end as far as the build has
    // reached.
    ink.lineWidth = 1;
    d.lines.forEach((l) => {
      const k = clamp((reach - l.from) / Math.max(0.06, l.to - l.from), 0, 1);
      l.k = k;
      if (k <= 0) return;
      const upTo = l.len * k;
      const [x0] = P(l.pts[0][0], 0);
      ink.strokeStyle = rgba(LINE, 0.5 * l.weight * quiet(x0) * faint);
      ink.beginPath();
      let [x, y] = P(l.pts[0][0], l.pts[0][1]);
      ink.moveTo(x, y);
      for (let i = 1; i < l.pts.length; i++) {
        const seg = l.at[i] - l.at[i - 1];
        if (l.at[i] <= upTo || seg <= 0) { [x, y] = P(l.pts[i][0], l.pts[i][1]); ink.lineTo(x, y); continue; }
        const t = (upTo - l.at[i - 1]) / seg;
        [x, y] = P(l.pts[i - 1][0] + (l.pts[i][0] - l.pts[i - 1][0]) * t, l.pts[i - 1][1] + (l.pts[i][1] - l.pts[i - 1][1]) * t);
        ink.lineTo(x, y);
        break;
      }
      ink.stroke();
    });

    // THE DOOR, drawn up from the floor with the frame: its edges, four
    // panels, the knob near its open edge.
    const doorUp = clamp((reach - 0.02) / 0.95, 0, 1);
    if (doorUp > 0) {
      const q = quiet(P(L.x0, 0)[0]) * faint;
      const seg = (a, b) => {
        // Grown from its lower end, as far as the door has come up.
        const lowFirst = a[1] >= b[1] ? [a, b] : [b, a];
        const [lo, hi] = lowFirst;
        const top = -doorUp * d.T;
        if (lo[1] < top) return;
        const f = hi[1] >= top ? 1 : (lo[1] - top) / Math.max(0.01, lo[1] - hi[1]);
        const [x1, y1] = P(lo[0], lo[1]), [x2, y2] = P(lo[0] + (hi[0] - lo[0]) * f, lo[1] + (hi[1] - lo[1]) * f);
        ink.moveTo(x1, y1); ink.lineTo(x2, y2);
      };
      ink.strokeStyle = rgba(LINE, 0.62 * q);
      ink.beginPath();
      const c00 = onLeaf(L, 0, 0), c10 = onLeaf(L, 1, 0), c01 = onLeaf(L, 0, 1), c11 = onLeaf(L, 1, 1);
      seg(c01, c00); seg(c11, c10); seg(c00, c10); seg(c01, c11);
      ink.stroke();
      // Four panels: two tall over two short, each set in from the edges.
      ink.strokeStyle = rgba(LINE, 0.36 * q);
      ink.beginPath();
      [[0.09, 0.45, 0.07, 0.5], [0.55, 0.91, 0.07, 0.5], [0.09, 0.45, 0.57, 0.93], [0.55, 0.91, 0.57, 0.93]].forEach(([u0, u1, v0, v1]) => {
        const a = onLeaf(L, u0, v0), b = onLeaf(L, u1, v0), c = onLeaf(L, u1, v1), e = onLeaf(L, u0, v1);
        seg(e, a); seg(c, b); seg(a, b); seg(e, c);
      });
      ink.stroke();
      // The knob, and a keyhole under it.
      if (doorUp > 0.5) {
        const [kx, ky] = P(...onLeaf(L, 0.9, 0.53));
        const k = clamp((doorUp - 0.5) / 0.2, 0, 1);
        ink.strokeStyle = rgba(LINE, 0.7 * q * k);
        ink.beginPath(); ink.arc(kx, ky, Math.max(2, d.W * 0.022), 0, Math.PI * 2); ink.stroke();
        ink.fillStyle = rgba(LINE, 0.5 * q * k);
        ink.fillRect(kx - 0.6, ky + d.W * 0.05, 1.2, Math.max(2.5, d.W * 0.02));
      }
      // The edge of the door catching the light.
      if (lit > 0.004) {
        const [ex1, ey1] = P(...c10), [ex2, ey2] = P(...c11);
        ink.strokeStyle = rgba(GREEN, 0.55 * lit * q);
        ink.beginPath(); ink.moveTo(ex1, ey1); ink.lineTo(ex2, ey2); ink.stroke();
      }
    }

    // A speck at every joint the lines have reached.
    ink.fillStyle = rgba(LINE, 1);
    d.joints.forEach((j) => {
      if (!j.l.k || j.at > j.l.len * j.l.k + 0.01) return;
      const [x, y] = P(j.x, j.y);
      ink.globalAlpha = 0.85 * quiet(x) * faint;
      ink.fillRect(x - 1, y - 1, 2, 2);
    });
    ink.globalAlpha = 1;

    // THE MOTES, in the light: out of the gap and across the floor's wedge.
    if (lit > 0.004) {
      ink.globalCompositeOperation = "lighter";
      ink.fillStyle = rgba(LIGHT, 1);
      const stir = 1 + give * 1.5;
      motes.forEach((m) => {
        if (!REDUCE) {
          m.u += m.du * dt * stir; m.v += m.dv * dt * stir;
          if (m.u > 1.05 || m.u < -0.05 || m.v < -0.05 || m.v > 1.05) { m.u = random() * 0.3; m.v = random(); }
        }
        // u: out from the gap (0) into the room in front (1); v: up the
        // opening (0 the floor, 1 the head) — a beam leaning out.
        const gx = L.x1 + (d.ox2 - L.x1) * 0.5 + m.u * d.W * 0.9;
        const gy = -m.v * (d.T - d.head) * (1 - m.u * 0.55) + m.u * d.T * 0.12;
        const [x, y] = P(gx + Math.sin(clock * 0.5 + m.phase) * 3, gy + Math.cos(clock * 0.4 + m.phase) * 3);
        const inLight = (1 - m.u) * (0.5 + 0.5 * Math.sin(clock * 0.8 + m.phase * 2));
        ink.globalAlpha = clamp(m.base * lit * (0.25 + 0.75 * inLight) * quiet(x) * faint, 0, 1);
        ink.fillRect(x, y, m.size, m.size);
      });
      ink.globalAlpha = 1;
      ink.globalCompositeOperation = "source-over";
    }
  }

  // ============================================================
  // KEEPING UP
  // ============================================================
  const hand = (event) => { handX = event.clientX; handY = event.clientY; if (REDUCE) draw(99, 0); };
  window.addEventListener("pointermove", hand, { passive: true });
  window.addEventListener("pointerdown", hand, { passive: true });
  document.addEventListener("pointerleave", () => { handX = -99999; handY = -99999; });
  window.addEventListener("resize", () => { size(); if (REDUCE) draw(99, 0); });
  // The scale down the side is laid out by house.js; place the door again
  // once the page has settled, so it stands clear of it.
  window.addEventListener("load", () => { build(); if (REDUCE) draw(99, 0); });

  size();
  if (REDUCE) {
    draw(99, 0);
  } else {
    const began = performance.now();
    let last = began;
    (function tick(now) {
      draw((now - began) / 1000, Math.min(0.1, (now - last) / 1000));
      last = now;
      requestAnimationFrame(tick);
    })(began);
  }
})();

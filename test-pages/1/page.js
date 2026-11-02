// ============================================================
// TEST PAGE 1 — "Skin, scanned" (test-pages/1/). Not a page of the site:
// it loads nothing of the site's and nothing of the site loads it.
//
// The owner's image 1 — a spine drawn as a plexus, two red rings marking
// places on it, a glitched numeral, a column of readings — made of the
// site's Skin research: a skeleton (skull, spine, ribs, one arm) in points
// joined to their nearest neighbours, turning slowly in three dimensions,
// shards drifting off it; the four body sites of the research's Table 2
// marked two at a time by red rings with a hairline in to the place, and
// their readings — temperature, sebum, character — beside them. Drag to
// turn it; press a site to mark it.
//
// KEPT SMOOTH: the skeleton is built once; a frame projects ~1,500 points
// and strokes its hairlines in four paths by depth. The grain is a CSS
// layer moved by its transform. Nothing is drawn while the tab is hidden.
// With motion reduced: still, no glitch, no drift.
// ============================================================
(function () {
  "use strict";

  const canvas = document.querySelector(".t1-scene");
  const ctx = canvas.getContext("2d");
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;

  // ---- WHAT IT SAYS: the Skin research's Table 2 (works/skin.html) ------
  const SITES = [
    { id: "ear", name: "Behind ear", temp: 34, sebum: "Low", char: "True-to-formula, intimate sillage", at: [0.088, 0.645, -0.085] },
    { id: "neck", name: "Neck, sides", temp: 35, sebum: "Moderate", char: "Strong projection, more body interaction", at: [0.062, 0.5, -0.13] },
    { id: "elbow", name: "Inner elbow", temp: 33, sebum: "Low", char: "Quiet, close-range, long-lasting", at: [0.25, 0.05, 0.04] },
    { id: "wrist", name: "Inner wrist", temp: 32, sebum: "Low-moderate", char: "Clean, linear, moderate projection", at: [0.215, -0.265, 0.125] },
  ];
  const PAIRS = [[0, 1], [2, 3], [1, 3], [0, 2]];

  // ---- THE SKELETON, in points (y up, the figure facing +z) ------------
  let seed = 20261102;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const P = [];          // x, y, z, brightness, part
  const parts = [];      // [start, end) of each part, for joining neighbours within it
  const chains = [];     // pairs joined in order (ribs, bones)
  function part(fn) { const s = P.length / 5; fn(); parts.push([s, P.length / 5]); }
  function pt(x, y, z, b, k) { P.push(x, y, z, b, k || 0); return P.length / 5 - 1; }

  const j = (a) => (rand() - 0.5) * a;
  // the spine: twenty-four vertebrae down an S, each a cloud of points —
  // its body a squat drum, its arch and spinous process back and down, its
  // transverse processes out to the sides — then the sacrum
  const V = 24;
  const spine = (t) => [0, 0.56 - t * 1.08, -0.12 + 0.045 * Math.sin(t * Math.PI * 2.1 + 0.25) - 0.02 * t];
  const vertebrae = [], vparts = [];
  for (let i = 0; i < V; i++) {
    const t = i / (V - 1);
    const [x0, y0, z0] = spine(t);
    const r = 0.024 + 0.03 * Math.pow(t, 1.3), h = 0.016 + 0.012 * t;
    part(() => {
      for (let k = 0; k < 18; k++) {
        const a = rand() * TAU, rr = r * (0.5 + 0.5 * Math.sqrt(rand()));
        const yy = (rand() < 0.5 ? 1 : -1) * h * (0.55 + 0.45 * rand());
        pt(x0 + Math.cos(a) * rr, y0 + yy, z0 + Math.sin(a) * rr * 0.85, 1);
      }
      const lift = i > 6 && i < 19 ? 1.7 : 0.7;
      for (let k = 0; k <= 6; k++) pt(x0 + j(0.01), y0 - k * 0.005 * lift + j(0.005), z0 - r * 0.85 - k * (0.011 + 0.004 * t), 0.95);
      for (const side of [-1, 1]) for (let k = 1; k <= 3; k++) pt(x0 + side * (r * 0.8 + k * 0.012) + j(0.004), y0 + j(0.008), z0 - r * 0.55 - k * 0.004, 0.85);
    });
    vparts.push(parts[parts.length - 1]);
    vertebrae.push({ y: y0, z: z0, r });
  }
  part(() => {
    for (let i = 0; i < 80; i++) {
      const t = rand(), w = 0.075 * (1 - t * 0.85);
      pt(j(2 * w), -0.565 - t * 0.21, -0.135 - 0.06 * t + j(0.022), 0.9);
    }
  });
  vparts.push(parts[parts.length - 1]);
  // the skull, sat on the first vertebra: a cranium of points, the face
  // left open below the brow, its sockets, and the jaw
  const SK = { x: 0, y: 0.705, z: -0.055 };
  part(() => {
    const n = 340;
    for (let i = 0; i < n; i++) {
      const yy = 1 - (2 * (i + 0.5)) / n, rr = Math.sqrt(1 - yy * yy), th = i * 2.39996 + j(0.5);
      let px = Math.cos(th) * rr * 0.1, py = yy * 0.118, pz = Math.sin(th) * rr * 0.135;
      if (pz > 0.08) pz = 0.08 + (pz - 0.08) * 0.45;
      if (py < -0.02 && pz > 0.035) continue;
      if (py < -0.08 && Math.abs(px) < 0.05) continue;
      pt(SK.x + px + j(0.006), SK.y + py + j(0.006), SK.z + pz + j(0.006), 0.6 + 0.35 * rand());
    }
  });
  part(() => {
    for (let i = 0; i <= 22; i++) {
      const a = Math.PI * (i / 22);
      pt(Math.cos(a) * 0.078 + j(0.004), 0.6 - Math.sin(a) * 0.025 + j(0.004), SK.z - 0.03 + Math.sin(a) * 0.15 + j(0.004), 0.9);
    }
    for (let i = 0; i < 10; i++) pt(j(0.07), 0.585 + j(0.012), SK.z + 0.1 + j(0.02), 0.7);
  });
  for (const side of [-1, 1]) {
    part(() => { for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; pt(side * 0.042 + Math.cos(a) * 0.025, 0.71 + Math.sin(a) * 0.02, SK.z + 0.105, 0.95); } });
  }
  // the ribs: twelve pairs, out from the thoracic vertebrae round to the front
  for (let i = 0; i < 12; i++) {
    const v = vertebrae[7 + i];
    const t = i / 11;
    const ax = 0.11 + 0.1 * Math.sin(Math.PI * (0.25 + t * 0.6)), az = 0.1 + 0.07 * Math.sin(Math.PI * (0.2 + t * 0.65));
    const reach = i < 7 ? 0.98 : 0.98 - (i - 6) * 0.12;
    for (const side of [-1, 1]) {
      part(() => {
        let prev = -1;
        const n = 13;
        for (let k = 0; k <= n; k++) {
          const s = (k / n) * reach;
          const a = -Math.PI / 2 + s * Math.PI * 0.95;
          const p = pt(side * (v.r + Math.cos(a) * ax) + j(0.006), v.y - 0.01 - s * 0.11 + j(0.006), v.z + 0.02 + (Math.sin(a) + 1) * az * 0.95 + j(0.006), 0.5);
          if (prev >= 0) chains.push(prev, p);
          prev = p;
        }
      });
    }
  }
  // the sternum
  part(() => { for (let k = 0; k < 14; k++) pt(j(0.02), 0.33 - k * 0.02, vertebrae[10].z + 0.24 - k * 0.003 + j(0.008), 0.6); });
  // the collar bones and one arm (the near side), as clouds along each bone
  function bone(a, b, r, n, br) {
    part(() => {
      for (let k = 0; k < n; k++) {
        const t = rand(), q = rand() * TAU, rr = r * (0.6 + 0.4 * rand()) * (1 + 0.6 * Math.pow(Math.abs(t - 0.5) * 2, 4));
        pt(a[0] + (b[0] - a[0]) * t + Math.cos(q) * rr, a[1] + (b[1] - a[1]) * t + j(0.006), a[2] + (b[2] - a[2]) * t + Math.sin(q) * rr, br);
      }
    });
  }
  bone([0.02, 0.40, 0.07], [0.2, 0.43, -0.03], 0.008, 22, 0.6);
  bone([-0.02, 0.40, 0.07], [-0.2, 0.43, -0.03], 0.008, 22, 0.45);
  bone([0.23, 0.42, -0.03], [0.25, 0.06, 0.02], 0.016, 95, 0.75);     // the humerus
  bone([0.25, 0.04, 0.03], [0.215, -0.27, 0.12], 0.012, 80, 0.75);    // the forearm
  part(() => {                                                       // the hand, splayed
    for (let f = 0; f < 5; f++) {
      let prev = -1;
      for (let k = 0; k < 5; k++) {
        const p = pt(0.215 + (f - 2) * 0.011 + j(0.004), -0.29 - k * 0.022, 0.13 + (f - 2) * 0.006 + k * 0.006, 0.6);
        if (prev >= 0) chains.push(prev, p);
        prev = p;
      }
    }
  });

  const NP = P.length / 5;
  // joined to their nearest neighbours within a part: the plexus — and
  // each vertebra to the next by its three nearest pairs
  const links = chains.slice();
  const d2 = (i, k) => { const dx = P[i * 5] - P[k * 5], dy = P[i * 5 + 1] - P[k * 5 + 1], dz = P[i * 5 + 2] - P[k * 5 + 2]; return dx * dx + dy * dy + dz * dz; };
  for (const [s0, e0] of parts) {
    for (let i = s0; i < e0; i++) {
      const near = [];
      for (let k = s0; k < e0; k++) if (k !== i) { const d = d2(i, k); if (d < 0.0025) near.push([d, k]); }
      near.sort((x, y) => x[0] - y[0]);
      for (let k = 0; k < Math.min(3, near.length); k++) if (i < near[k][1]) links.push(i, near[k][1]);
    }
  }
  for (let v = 0; v + 1 < vparts.length; v++) {
    const [a0, a1] = vparts[v], [b0, b1] = vparts[v + 1];
    const pairs = [];
    for (let i = a0; i < a1; i++) for (let k = b0; k < b1; k++) pairs.push([d2(i, k), i, k]);
    pairs.sort((x, y) => x[0] - y[0]);
    for (let k = 0; k < 3; k++) links.push(pairs[k][1], pairs[k][2]);
  }
  // a few facets filled faintly, from three points joined in a row
  const facets = [];
  for (let i = 0; i + 5 < links.length && facets.length < 540; i += 14) facets.push(links[i], links[i + 1], links[i + 3]);
  // and lines out from the spine to the dark around it, as the image's
  const reach = [];
  for (let i = 0; i < 26; i++) {
    const a = rand() * TAU, s = vertebrae[Math.floor(rand() * V)];
    reach.push(0, s.y, s.z, Math.cos(a) * (0.6 + rand() * 0.6), s.y + (rand() - 0.5) * 0.5, Math.sin(a) * 0.4);
  }
  // the shards drifting off it
  const SH = STILL ? 60 : 140;
  const shards = [];
  for (let i = 0; i < SH; i++) {
    const v = vertebrae[Math.floor(rand() * V)];
    shards.push({
      x: (rand() - 0.5) * 0.9, y: v.y + (rand() - 0.5) * 0.3, z: (rand() - 0.5) * 0.8,
      vx: (rand() - 0.5) * 0.01, vy: 0.004 + rand() * 0.012, vz: (rand() - 0.5) * 0.01,
      s: 0.006 + rand() * 0.03, a: rand() * TAU, w: (rand() - 0.5) * 0.8, tri: rand() < 0.55, life: rand(),
    });
  }

  // ---- THE VIEW --------------------------------------------------------
  let W = 0, H = 0, DPR = 1, S = 1, CX = 0, CY = 0;
  function resize() {
    W = innerWidth; H = innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    const phone = W < 760;
    S = Math.min(H * 0.62, W * (phone ? 0.85 : 0.55));
    CX = W * (phone ? 0.34 : 0.36); CY = H * (phone ? 0.42 : 0.53);
  }
  addEventListener("resize", resize);
  resize();

  let yaw = -1.05, yawGoal = -1.05, yawV = 0, pitch = 0.06;
  const Q = new Float32Array(NP * 3);
  const F = 3.4;
  function project(x, y, z, out, o) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const rx = x * c - z * s, rz = x * s + z * c;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const ry = (y - 0.12) * cp - rz * sp, rz2 = (y - 0.12) * sp + rz * cp;
    const k = F / (F + rz2);
    out[o] = CX + rx * S * k; out[o + 1] = CY - ry * S * k; out[o + 2] = rz2;
  }
  const tmp = new Float32Array(3);
  const glow = document.createElement("canvas");
  glow.width = glow.height = 32;
  { const g = glow.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); }

  // ---- THE HAND --------------------------------------------------------
  let drag = null;
  canvas.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, yaw }; canvas.setPointerCapture(e.pointerId); canvas.classList.add("is-dragging"); });
  canvas.addEventListener("pointermove", (e) => { if (drag) { yawGoal = drag.yaw + (e.clientX - drag.x) * 0.008; yaw = yawGoal; } });
  const up = () => { drag = null; canvas.classList.remove("is-dragging"); idleFrom = performance.now(); };
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  let idleFrom = 0;

  // ---- THE SITES: the list, the readings, the numeral -------------------
  const list = document.querySelector(".t1-sites");
  const num = document.querySelector(".t1-num");
  const bar = document.querySelector(".t1-bar i");
  const say = (k) => document.querySelector('[data-say="' + k + '"]');
  SITES.forEach((s, i) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button"; b.textContent = s.name; b.dataset.i = i;
    b.addEventListener("click", () => { chosen = i; pairAt = performance.now(); showSite(i, true); });
    li.appendChild(b); list.appendChild(li);
  });
  let pair = 0, chosen = 1, pairAt = performance.now();
  let markers = [{ i: 0, t0: 0 }, { i: 1, t0: 0 }];
  function showSite(i, pressed) {
    const s = SITES[i];
    list.querySelectorAll("button").forEach((b) => b.classList.toggle("is-on", +b.dataset.i === i));
    say("site").textContent = s.name.toLowerCase();
    say("head").textContent = "Site · " + s.name.toLowerCase();
    for (const [k, v] of [["temp", "~" + s.temp + "°C"], ["sebum", s.sebum], ["char", s.char]]) {
      const el = say(k);
      el.textContent = v; el.classList.add("is-new");
      setTimeout(() => el.classList.remove("is-new"), 700);
    }
    bar.style.width = ((s.temp - 30) / 6) * 100 + "%";
    scramble(String(s.temp));
    if (pressed) {
      const other = markers.find((m) => m.i !== i) || markers[1];
      markers = [{ i, t0: performance.now() }, { i: other.i === i ? (i + 1) % 4 : other.i, t0: other.t0 }];
    }
  }
  // the numeral scrambles through digits on its way to the next, glitching
  let scrambleT = 0;
  function scramble(to) {
    if (STILL) { num.firstChild.nodeValue = to; num.dataset.v = to; return; }
    clearInterval(scrambleT);
    let n = 0;
    num.classList.add("is-glitch");
    scrambleT = setInterval(() => {
      n++;
      const v = n < 7 ? String(10 + Math.floor(Math.random() * 89)) : to;
      num.firstChild.nodeValue = v; num.dataset.v = v;
      if (n >= 7) { clearInterval(scrambleT); setTimeout(() => num.classList.remove("is-glitch"), 120); }
    }, 55);
  }
  function nextPair(now) {
    pair = (pair + 1) % PAIRS.length;
    const [a, b] = PAIRS[pair];
    markers = [{ i: a, t0: now }, { i: b, t0: now + 260 }];
    chosen = a;
    showSite(a, false);
  }
  showSite(1, false);
  markers = [{ i: 0, t0: -1e9 }, { i: 1, t0: -1e9 }];

  // ---- THE FRAME -------------------------------------------------------
  const INK = "rgb(233,231,226)", RED = "rgb(255,58,68)";
  let last = 0, glitchUntil = 0, glitchNext = 2500;
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    // turning slowly, and back to it a moment after a drag
    if (!drag && !STILL) {
      const idle = now - idleFrom > 2200;
      if (idle) yawGoal += dt * 0.12;
      yawV += (yawGoal - yaw) * 0.04; yawV *= 0.82; yaw += yawV;
      pitch = 0.06 + 0.03 * Math.sin(now / 5200);
    }
    if (!STILL && now - pairAt > 7000) { pairAt = now; nextPair(now); }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    for (let i = 0; i < NP; i++) project(P[i * 5], P[i * 5 + 1], P[i * 5 + 2], Q, i * 3);

    // lines out into the dark
    ctx.lineWidth = 0.6;
    ctx.strokeStyle = INK;
    ctx.globalAlpha = 0.07;
    ctx.beginPath();
    for (let i = 0; i < reach.length; i += 6) {
      project(reach[i], reach[i + 1], reach[i + 2], tmp, 0); const ax = tmp[0], ay = tmp[1];
      project(reach[i + 3], reach[i + 4], reach[i + 5], tmp, 0);
      ctx.moveTo(ax, ay); ctx.lineTo(tmp[0], tmp[1]);
    }
    ctx.stroke();

    // the facets, faintly
    ctx.fillStyle = INK;
    ctx.globalAlpha = 0.035;
    ctx.beginPath();
    for (let i = 0; i < facets.length; i += 3) {
      const a = facets[i] * 3, b = facets[i + 1] * 3, c = facets[i + 2] * 3;
      ctx.moveTo(Q[a], Q[a + 1]); ctx.lineTo(Q[b], Q[b + 1]); ctx.lineTo(Q[c], Q[c + 1]); ctx.closePath();
    }
    ctx.fill();

    // the hairlines, in four paths by depth: the near ones brighter
    const paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < links.length; i += 2) {
      const a = links[i] * 3, b = links[i + 1] * 3;
      const z = (Q[a + 2] + Q[b + 2]) * 0.5;
      const lv = z < -0.12 ? 3 : z < 0 ? 2 : z < 0.12 ? 1 : 0;
      paths[lv].moveTo(Q[a], Q[a + 1]); paths[lv].lineTo(Q[b], Q[b + 1]);
    }
    ctx.lineWidth = 0.7;
    [0.16, 0.26, 0.4, 0.55].forEach((al, lv) => { ctx.globalAlpha = al; ctx.stroke(paths[lv]); });

    // the points, added light to light, so where they crowd they glow
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = INK;
    for (let i = 0; i < NP; i++) {
      const o = i * 3, z = Q[o + 2];
      const b = P[i * 5 + 3];
      ctx.globalAlpha = Math.max(0.05, (0.55 - z * 1.4) * b);
      const s = 1.1 + b * 1.1 - z * 1.5;
      ctx.fillRect(Q[o] - s / 2, Q[o + 1] - s / 2, s, s);
    }
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < NP; i++) {
      if (P[i * 5 + 3] < 0.95) continue;
      const o = i * 3, gs = 14 - Q[o + 2] * 10;
      ctx.drawImage(glow, Q[o] - gs / 2, Q[o + 1] - gs / 2, gs, gs);
    }
    ctx.globalCompositeOperation = "source-over";

    // the shards, drifting up and away, turning
    ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 0.6;
    for (const s of shards) {
      if (!STILL) {
        s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt; s.a += s.w * dt; s.life += dt * 0.05;
        if (s.life > 1) { const v = vertebrae[Math.floor(Math.random() * V)]; s.x = (Math.random() - 0.5) * 0.3; s.y = v.y; s.z = v.z + (Math.random() - 0.5) * 0.2; s.life = 0; }
      }
      project(s.x, s.y, s.z, tmp, 0);
      const k = Math.sin(Math.PI * Math.min(1, s.life)), r = s.s * S * 0.5;
      ctx.globalAlpha = 0.5 * k;
      if (s.tri) {
        ctx.beginPath();
        for (let j = 0; j < 3; j++) { const q = s.a + (j * TAU) / 3; ctx[j ? "lineTo" : "moveTo"](tmp[0] + Math.cos(q) * r, tmp[1] + Math.sin(q) * r * 0.7); }
        ctx.closePath(); ctx.stroke();
        ctx.globalAlpha = 0.08 * k; ctx.fill();
      } else {
        ctx.fillRect(tmp[0], tmp[1], 1.4, 1.4);
      }
    }

    // the markers: a red ring out to the right, a hairline in to the place
    ctx.globalAlpha = 1;
    const narrow = W < 760;
    const ringX = Math.min(W - (narrow ? 34 : 340), CX + S * 0.62);
    const ys = [];
    markers.forEach((m, n) => {
      const s = SITES[m.i];
      project(s.at[0], s.at[1], s.at[2], tmp, 0);
      const px = tmp[0], py = tmp[1];
      let ry = py;
      for (const y of ys) if (Math.abs(ry - y) < 70) ry = y + (ry >= y ? 70 : -70);
      ys.push(ry);
      const age = STILL ? 1 : Math.max(0, Math.min(1, (now - m.t0) / 700));
      const e = 1 - Math.pow(1 - age, 3);
      const rad = 20 + (W < 760 ? -4 : 0);
      // the line, drawn out from the ring to the place
      ctx.strokeStyle = INK; ctx.globalAlpha = 0.75; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(ringX - rad, ry); ctx.lineTo(ringX - rad + (px - ringX + rad) * e, ry + (py - ry) * e); ctx.stroke();
      // a second, fainter, as the image has
      ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.moveTo(ringX - rad, ry); ctx.lineTo(ringX - rad + (px - 18 - ringX + rad) * e, ry + (py - 30 - ry) * e); ctx.stroke();
      // the place itself, pulsing
      ctx.globalAlpha = e;
      ctx.fillStyle = "#fff"; ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
      ctx.strokeStyle = RED; ctx.lineWidth = 1;
      const pulse = STILL ? 0 : (now / 1400 + n * 0.5) % 1;
      ctx.globalAlpha = (1 - pulse) * 0.6 * e;
      ctx.beginPath(); ctx.arc(px, py, 4 + pulse * 14, 0, TAU); ctx.stroke();
      // the ring
      ctx.globalAlpha = e;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ringX, ry, rad * (0.6 + 0.4 * e), 0, TAU); ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = INK; ctx.globalAlpha = 0.9 * e;
      ctx.beginPath(); ctx.arc(ringX, ry, 4, 0, TAU); ctx.stroke();
      ctx.fillStyle = INK; ctx.fillRect(ringX - 1, ry - 1, 2, 2);
      // its words
      ctx.font = '500 8.5px "IBM Plex Mono", monospace';
      ctx.textBaseline = "middle";
      ctx.globalAlpha = e;
      ctx.fillStyle = INK;
      const label = s.name.toUpperCase().split("").join(" ");
      if (narrow) {
        ctx.textAlign = "right";
        ctx.fillText(label, ringX + rad, ry + rad + 12);
        ctx.fillStyle = RED;
        ctx.fillText(s.temp + "°C", ringX + rad, ry + rad + 24);
        ctx.textAlign = "left";
      } else {
        ctx.fillText(label, ringX + rad + 10, ry - 2);
        ctx.fillStyle = RED;
        ctx.fillText(s.temp + "°C", ringX + rad + 10, ry + 10);
        ctx.fillStyle = INK; ctx.globalAlpha = 0.5 * e;
        ctx.fillRect(ringX + rad + 10 + ctx.measureText(label).width + 8, ry - 2, 16 * e, 1);
      }
    });
    ctx.globalAlpha = 1;

    // now and then the picture slips: a few bands of it pulled sideways
    if (!STILL) {
      if (now > glitchNext) { glitchUntil = now + 140 + Math.random() * 120; glitchNext = now + 3000 + Math.random() * 4000; num.classList.add("is-glitch"); setTimeout(() => num.classList.remove("is-glitch"), 220); }
      if (now < glitchUntil) {
        for (let k = 0; k < 4; k++) {
          const y = Math.random() * H, h = 4 + Math.random() * 26, dx = (Math.random() - 0.5) * 50;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(canvas, 0, y * DPR, canvas.width, h * DPR, dx * DPR, y * DPR, canvas.width, h * DPR);
        }
      }
    }
    raf = 0;
    if (!STILL && !document.hidden) kick();
  }
  let raf = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  kick();
  // still, it is drawn again only when turned by hand or a site is pressed
  canvas.addEventListener("pointermove", () => { if (drag) kick(); });
  list.addEventListener("click", kick);
  addEventListener("resize", kick);
  document.addEventListener("visibilitychange", () => { last = 0; kick(); });

  // ---- THE GRAIN: a small picture of noise, made once -------------------
  const g = document.createElement("canvas");
  g.width = g.height = 160;
  const gx = g.getContext("2d"), img = gx.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  gx.putImageData(img, 0, 0);
  document.querySelector(".t1-grain").style.backgroundImage = "url(" + g.toDataURL() + ")";

  window.TestPage1 = { sites: () => markers.map((m) => SITES[m.i].id), yaw: () => yaw };
})();

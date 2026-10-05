// ============================================================
// THE HOME PAGE'S FIVE STAGES, AND ITS FORMULA (index.html)
//
// The owner, 2026-09-30, of the formula (a slide of its own after the title
// until the same evening): "make it a smooth scrolling instead of
// incremental; I want you to make sure that there are 5 increments of text
// that are gradual (not sudden like now). these five increments should be:
// horizental projection of the aldehyde with title (exactly as now when you
// load in the page), second should be the same without the title page;
// third should be the now vertically rotated aldehyde; fourth should be the
// vertically rotated aldehyde with the formula visible; and fifth should be
// when the 8 pieces of text appear. The way want the text to appear is from
// particles that appear in straight lines from the left and right, and on
// the outer perimeter, you will have the words. the particles should go from
// top to bottom, and should have some movement - exactly like in the
// aldehyde molecule. I want the words to be half concealed, and when you
// hover them, then because of the electronegative character of the cursor,
// the whole thing will be illuminated and you can click it. Additionally,
// when you click it, I want a confirmation message to pop up to go to that
// thing. it should be on theme." And: "i want the cursor to have an
// electronegative character, so the 'electrons' would be attracted to it".
// (landing.js and molecule.js; the report is
// docs/features/2026-09-30-the-formula-slide.md.)
//
// And 2026-10-03: "remove the two parallel particle lines; and then change it
// so that in the space on the left and right is occupied by the 8 categories
// being shown, i want them to be slightly haphazardly arranged. and have VERY
// LIGHT AND FLOWY PARTICLES; very similar to the adar page" — and the page
// PLAYS ITSELF through the five stages ("change the scrolling feature for it
// to be automatic. it should be still as slow as it is now") — and, later the
// same day, only once it is scrolled, ONE SCROLL PLAYING IT ALL THE WAY ("when
// you scroll once, it will go all the way down, not it will scroll by itself
// after a second or so"). The tests that hold a stage, or drive the page a
// notch at a time, open it with `?auto=off`, the old hand-driven page.
//
// And the last of that day: "rework the words and the particles surrounding
// the main aldehyde molecule ... fill in the gaps and make it all thematic" —
// THE SILLAGE, the aldehyde's own scent spreading into the room, where ADAR's
// drift was (and for that day the chemicals, below). Then 2026-10-04: one
// scroll glides the page the whole way, continuously, in about four seconds
// ("it needs to be gradual"); and THE ORBIT — "remove the chemicals and
// redesign it again. KEEP THE MIDDLE ALDEHYDE AS IT IS" — the eight pages on
// a ring round the aldehyde, each beside an electron of its own.
//
// The drawing says where it is on itself, `data-state` on #molecule — cloud,
// turning, turned, forming, formula, drifting, drift — and landing.js which
// stage, `data-stage` on the stage (1 to 5), and how far, window.__formula
// (0 to 4). In the tests' browser, which draws without a graphics card, it
// all takes longer than it does on a real machine.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors, blockThreeJs, jumpToSlide, toStage, stageY, stageAt, HOME_WITH_MAP } = require("./helpers");

const state = (page) => page.evaluate(() => document.getElementById("molecule").dataset.state);
const settled = (page, k, timeout = 8000) => expect.poll(() => stageAt(page), { timeout }).toBeCloseTo(k, 2);

// The atoms' names on the formula, where they stand on the window.
const atoms = (page) => page.locator(".formula-atom").evaluateAll((all) => all.map((a) => {
  const r = a.getBoundingClientRect();
  return { sym: a.textContent, x: r.left + r.width / 2, y: r.top + r.height / 2, shown: +getComputedStyle(a).opacity };
}));
// The eight names' boxes.
const boxes = (page) => page.locator(".formula-link").evaluateAll((all) =>
  all.map((a) => { const r = a.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; }));
// The edges of the formula's room, the grid's middle column (style.css): the
// names stand outside it, the drift in the rooms either side.
const roomXs = (page) => page.evaluate(() => {
  const menu = document.querySelector(".formula-menu");
  const cs = getComputedStyle(menu);
  const cols = cs.gridTemplateColumns.split(/\s+/).map(parseFloat);
  const left = menu.getBoundingClientRect().left + parseFloat(cs.paddingLeft) + cols[0];
  return [left, left + cols[1]];
});

// How much light there is in a box of the window: the bright pixels in it, and their sum.
async function light(page, box) {
  const shot = (await page.screenshot({ clip: box })).toString("base64");
  return page.evaluate(async (shot) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, lit = 0, sum = 0;
    for (let k = 0; k < d.length; k += 4) {
      const v = (d[k] + d[k + 1] + d[k + 2]) / 3;
      if (v > 110) n++;
      if (v > 50) lit++;   // anything plainly lighter than the dark ground (31)
      sum += v;
    }
    return { n, lit, sum };
  }, shot);
}

// The same over several boxes of one screenshot, leaving out what stands in
// `avoid` (boxes) and within `ring.pad` pixels of the orbit's ring: lit
// pixels to a pixel looked at.
async function litPer(page, rects, avoid = [], ring = null) {
  const shot = (await page.screenshot()).toString("base64");
  return page.evaluate(async ({ shot, rects, avoid, ring }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let lit = 0, area = 0;
    for (const r of rects) for (let y = Math.max(0, r.y); y < Math.min(c.height, r.y + r.height); y++) for (let x = Math.max(0, r.x); x < Math.min(c.width, r.x + r.width); x++) {
      if (avoid.some((b) => x >= b.l && x <= b.r && y >= b.t && y <= b.b)) continue;
      if (ring) {
        const dx = x - ring.cx, dy = y - ring.cy, c = Math.cos(-ring.tilt), sn = Math.sin(-ring.tilt);
        const ux = dx * c - dy * sn, uy = dx * sn + dy * c;
        if (Math.abs(Math.hypot(ux / ring.rx, uy / ring.ry) - 1) * Math.min(ring.rx, ring.ry) < ring.pad) continue;
      }
      area++;
      const k = (y * c.width + x) * 4;
      if ((d[k] + d[k + 1] + d[k + 2]) / 3 > 50) lit++;
    }
    return area ? lit / area : 0;
  }, { shot, rects, avoid, ring });
}
// Where the orbit stands (landing.js says it on the names' nav), and each
// name's electron on it; `pad`, how near its ring a pixel is left out.
const orbitOf = (page, pad = 14) => page.evaluate((pad) => {
  const menu = document.querySelector(".formula-menu"), cs = getComputedStyle(menu), m = menu.getBoundingClientRect();
  const v = (n) => parseFloat(cs.getPropertyValue(n));
  return {
    laid: menu.classList.contains("orbit-laid"),
    cx: m.left + v("--orbit-cx"), cy: m.top + v("--orbit-cy"), rx: v("--orbit-rx"), ry: v("--orbit-ry"), tilt: v("--orbit-tilt"), pad,
    electrons: [...menu.querySelectorAll(".formula-link")].map((a) => {
      const ls = getComputedStyle(a);
      return { x: m.left + parseFloat(ls.getPropertyValue("--ox")), y: m.top + parseFloat(ls.getPropertyValue("--oy")), a: parseFloat(ls.getPropertyValue("--oa")) };
    }),
  };
}, pad);

// Where the gold and the violet are, read off a screenshot.
async function colours(page) {
  const shot = (await page.screenshot()).toString("base64");
  return page.evaluate(async (shot) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const out = { gold: { n: 0, y: 0 }, violet: { n: 0, y: 0 } };
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const k = (y * c.width + x) * 4, r = d[k], gr = d[k + 1], b = d[k + 2];
      const which = r - b > 40 && gr - b > 15 && r >= gr ? "gold" : b - gr > 25 && b - r > 10 ? "violet" : null;
      if (!which) continue;
      out[which].n++; out[which].y += y;
    }
    for (const k in out) if (out[k].n) out[k].y /= out[k].n;
    return out;
  }, shot);
}

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* THE ORBIT (2026-10-04: "For the menu in the second page, i dont like it. I
   want you to remove the chemicals and redesign it again"): on a wide window
   the eight pages stand on a ring round the aldehyde, each beside an
   electron of its own — four down the left, four down the right, written
   away from the aldehyde and clear of it. */
test("the last stage carries the Menu's eight pages, in its order, on an orbit round the aldehyde, each beside its electron", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  // the same eight as the Menu (nav.js), without Home, in its order
  const nav = fs.readFileSync(path.join(__dirname, "..", "nav.js"), "utf8");
  const block = nav.slice(nav.indexOf("const SITE_LINKS = ["), nav.indexOf("];", nav.indexOf("const SITE_LINKS = [")));
  const menu = [...block.matchAll(/label: "([^"]+)", href: "([^"]+)"/g)].map((m) => [m[1], m[2]]).filter(([l]) => l !== "Home");
  const links = await page.locator("#slide-formula .formula-link").evaluateAll((all) =>
    all.map((a) => [a.textContent.trim(), a.getAttribute("href")]));
  expect(links).toEqual(menu);
  expect(links).toHaveLength(8);

  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  const o = await orbitOf(page);
  expect(o.laid, "laid on the orbit").toBe(true);
  // the aldehyde's room, which frames it, as wide as it always was
  const [lx, rx] = await roomXs(page);
  expect(rx - lx, "room in the middle").toBeGreaterThan(1440 * 0.5);
  // the ring round the aldehyde, wider than its room and most of the window high
  expect(o.rx * Math.cos(o.tilt)).toBeGreaterThan((rx - lx) / 2);
  expect(o.ry).toBeGreaterThan(900 * 0.35);
  // and, the aldehyde at centre stage (2026-10-04, later), as wide as the
  // window lets it — a third of it either side — with the names smaller
  // than the grid sets them
  expect(o.rx, "the ring well out").toBeGreaterThan(1440 * 0.33);
  const sizes = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => parseFloat(getComputedStyle(a).fontSize)));
  const grid = await page.locator(".formula-menu").evaluate((m) => {
    const probe = document.createElement("span");
    probe.style.fontSize = "var(--formula-size)";
    m.appendChild(probe);
    const z = parseFloat(getComputedStyle(probe).fontSize);
    probe.remove();
    return z;
  });
  expect(grid).toBeGreaterThan(10);
  for (const z of sizes) expect(z, "a name smaller than it was").toBeLessThan(grid * 0.85);
  // every electron on the ring
  for (const e of o.electrons) {
    const dx = e.x - o.cx, dy = e.y - o.cy, c = Math.cos(-o.tilt), sn = Math.sin(-o.tilt);
    const ux = dx * c - dy * sn, uy = dx * sn + dy * c;
    expect(Math.hypot(ux / o.rx, uy / o.ry), "on the ring").toBeCloseTo(1, 2);
  }
  // each name beside its electron, level with it, written away from the
  // aldehyde: the first four on the left of theirs, the next four on the right
  const lettering = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => {
    const r = a.getBoundingClientRect(), ls = getComputedStyle(a);
    const px = parseFloat(ls.paddingLeft);
    return { l: r.left + px, r: r.right - px, t: r.top, b: r.bottom, mid: (r.top + r.bottom) / 2 };
  }));
  lettering.forEach((n, i) => {
    const e = o.electrons[i];
    expect(Math.abs(n.mid - e.y), `name ${i + 1} level with its electron`).toBeLessThan(3);
    if (i < 4) {
      expect(e.x, `name ${i + 1} on the left`).toBeLessThan(720);
      expect(e.x - n.r, "its letters just left of its electron").toBeGreaterThan(6);
      expect(e.x - n.r).toBeLessThan(24);
    } else {
      expect(e.x, `name ${i + 1} on the right`).toBeGreaterThan(720);
      expect(n.l - e.x, "its letters just right of its electron").toBeGreaterThan(6);
      expect(n.l - e.x).toBeLessThan(24);
    }
    expect(n.l, "inside the window").toBeGreaterThanOrEqual(0);
    expect(n.r).toBeLessThanOrEqual(1440);
  });
  // in the Menu's order down each side
  for (let i = 1; i < 4; i++) {
    expect(lettering[i].mid, "down the left in order").toBeGreaterThan(lettering[i - 1].mid + 30);
    expect(lettering[i + 4].mid, "down the right in order").toBeGreaterThan(lettering[i + 3].mid + 30);
  }
  // not a mirror, nor a column: the ring is turned, and the two sides differ
  expect([0, 1, 2, 3].filter((i) => Math.abs(lettering[i].mid - lettering[i + 4].mid) < 20).length, "rows not level across").toBeLessThan(2);
  // every name well clear of the aldehyde's cloud: outside an oval half as
  // wide again as its H stand apart, and two thirds as tall again as its O
  // and H, and — since the aldehyde was given centre stage — by more than a
  // third as far again
  const [O, , H1, H2] = await atoms(page);
  const cx = (H1.x + H2.x) / 2, cy = (O.y + H1.y) / 2, ax = ((H2.x - H1.x) / 2) * 1.5, ay = ((H1.y - O.y) / 2) * 1.6;
  for (const [i, n] of lettering.entries()) {
    for (const [x, y] of [[n.l, n.t], [n.r, n.t], [n.l, n.b], [n.r, n.b], [(n.l + n.r) / 2, n.mid]]) {
      expect(((x - cx) / ax) ** 2 + ((y - cy) / ay) ** 2, `name ${i + 1} well clear of the cloud`).toBeGreaterThan(1.9);
    }
  }
  // the long one on two lines, in its own words' order
  const long = page.locator(".formula-link").nth(2);
  expect(await long.evaluate((a) => a.textContent.replace(/\s+/g, " ").trim())).toBe("Explorations & Researches");
  expect(await long.evaluate((a) => Math.round(a.getBoundingClientRect().height / parseFloat(getComputedStyle(a).lineHeight))), "on two lines").toBeGreaterThanOrEqual(2);
  // and nothing of the chemicals of the round before (2026-10-03, last)
  await expect(page.locator(".formula-tail")).toHaveCount(0);
  const code = fs.readFileSync(path.join(__dirname, "..", "molecule.js"), "utf8") + fs.readFileSync(path.join(__dirname, "..", "landing.js"), "utf8");
  for (const gone of ["AIR_LIST", "layAir", "drawAir", "formula-tail", "TAIL_BOND", "data-chain"]) expect(code, gone).not.toContain(gone);
});

/* The orbit is drawn — its ring in specks, an electron by each name — and a
   name the hand comes to lights its electron and the ring round it, in the
   aldehyde's gold. */
test("the orbit is drawn round the aldehyde, and a name under the hand lights its electron and the ring round it, in gold", async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off&molecule=full");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 3);
  await settled(page, 3);
  const o = await orbitOf(page);
  // round each electron: nothing before the last stage
  // (an electron is a small point of light: read close round it)
  const round = (e, r = 5) => ({ x: Math.round(e.x - r), y: Math.round(e.y - r), width: 2 * r, height: 2 * r });
  await page.addStyleTag({ content: ".cursor-ring, .cursor-dot { visibility: hidden !important; }" });
  await page.mouse.move(720, 880);
  await page.waitForTimeout(400);
  const none = await litPer(page, o.electrons.map((e) => round(e)));
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  await page.waitForTimeout(1500);
  for (const [i, e] of o.electrons.entries()) {
    expect(await litPer(page, [round(e)]), `electron ${i + 1} drawn`).toBeGreaterThan(Math.max(0.05, none * 3));
  }
  // the ring itself: the length of it lit, between the electrons, far more than off it
  const onRing = [], offRing = [];
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2 + 0.07;
    const pt = (f) => {
      const ex = Math.cos(a) * o.rx * f, ey = Math.sin(a) * o.ry * f, c = Math.cos(o.tilt), sn = Math.sin(o.tilt);
      return { x: Math.round(o.cx + ex * c - ey * sn - 5), y: Math.round(o.cy + ex * sn + ey * c - 5), width: 10, height: 10 };
    };
    onRing.push(pt(1)); offRing.push(pt(1.12));
  }
  const names = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => { const r = a.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; }));
  const on = await litPer(page, onRing, names), off = await litPer(page, offRing, names);
  expect(on, "the ring drawn").toBeGreaterThan(off * 1.6);
  // a name under the hand: the ring either side of its electron, gold — read
  // along the ring itself, clear of the name and the specks behind it (its
  // backdrop has gold in it too)
  const k = 5, e = o.electrons[k];
  const pad = names.map((n) => ({ l: n.l - 28, r: n.r + 28, t: n.t - 28, b: n.b + 28 }));
  const stretch = [];
  for (let d = -0.3; d <= 0.3001; d += 0.025) {
    const a = e.a + d, ex = Math.cos(a) * o.rx, ey = Math.sin(a) * o.ry, c = Math.cos(o.tilt), sn = Math.sin(o.tilt);
    const x = o.cx + ex * c - ey * sn, y = o.cy + ex * sn + ey * c;
    if (pad.some((n) => x > n.l && x < n.r && y > n.t && y < n.b)) continue;
    stretch.push({ x: Math.round(x - 10), y: Math.round(y - 10), width: 20, height: 20 });
  }
  expect(stretch.length, "a stretch of ring clear of the names").toBeGreaterThan(8);
  const clip = {
    x: Math.min(...stretch.map((b) => b.x)), y: Math.min(...stretch.map((b) => b.y)),
  };
  clip.width = Math.max(...stretch.map((b) => b.x + b.width)) - clip.x;
  clip.height = Math.max(...stretch.map((b) => b.y + b.height)) - clip.y;
  const gold = async () => {
    const shot = (await page.screenshot({ clip })).toString("base64");
    return page.evaluate(async ({ shot, boxes, clip }) => {
      const img = new Image(); img.src = "data:image/png;base64," + shot; await img.decode();
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const g = c.getContext("2d"); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data, seen = new Set();
      let n = 0;
      for (const b of boxes) for (let y = b.y - clip.y; y < b.y - clip.y + b.height; y++) for (let x = b.x - clip.x; x < b.x - clip.x + b.width; x++) {
        const at = y * c.width + x;
        if (seen.has(at) || x < 0 || y < 0 || x >= c.width || y >= c.height) continue;
        seen.add(at);
        const i = at * 4;
        // how much warmer than it is blue — gold, not the grey or the violet
        n += Math.max(0, Math.min(d[i] - d[i + 2], d[i + 1] - d[i + 2] + 20));
      }
      return n;
    }, { shot, boxes: stretch, clip });
  };
  const restGold = (await gold() + await gold()) / 2;
  const r = await page.locator(".formula-link").nth(k).boundingBox();
  await page.mouse.move(r.x + r.width * 0.6, r.y + r.height / 2, { steps: 4 });
  let litGold = 0;
  // (measured: about 820 at rest, 2,100 to 2,300 lit)
  await expect.poll(async () => (litGold = await gold()), { timeout: 15000 }).toBeGreaterThan(restGold * 1.7);
  await page.mouse.move(720, 880, { steps: 4 });
  await expect.poll(() => gold(), { timeout: 15000 }).toBeLessThan((restGold + litGold) / 2);
});

/* On a narrow window the names stand as they did, two by two, and there is
   no ring: the aldehyde is framed between their rows there, and it is not to
   move ("KEEP THE MIDDLE ALDEHYDE AS IT IS"). */
test("on a narrow window there is no orbit, and the names stand two by two as they did", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/index.html?auto=off");
  await toStage(page, 4);
  await settled(page, 4);
  expect((await orbitOf(page)).laid).toBe(false);
  // and back on a wide one, it is laid again
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect.poll(async () => (await orbitOf(page)).laid).toBe(true);
});

/* A LINE, NOT A CRAWL (2026-10-04, later: "the spinning ring of particles
   look sketchy"): the ring is one even hairline, still, its far half (the
   top) fainter than its near half — read along it, clear of the names, their
   electrons and the hand, twice, a second apart. */
test("the orbit's ring is one even, still line, its far half fainter than its near half", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.addStyleTag({ content: ".cursor-ring, .cursor-dot { visibility: hidden !important; }" });
  await page.mouse.move(720, 450);
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  await page.waitForTimeout(1500);
  const o = await orbitOf(page);
  const names = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => { const r = a.getBoundingClientRect(); return { l: r.left - 20, r: r.right + 20, t: r.top - 20, b: r.bottom + 20 }; }));
  const points = [];
  for (let k = 0; k < 72; k++) {
    const a = (k / 72) * Math.PI * 2;
    if (o.electrons.some((e) => Math.abs(Math.atan2(Math.sin(a - e.a), Math.cos(a - e.a))) < 0.12)) continue;
    const ex = Math.cos(a) * o.rx, ey = Math.sin(a) * o.ry, c = Math.cos(o.tilt), sn = Math.sin(o.tilt);
    const x = o.cx + ex * c - ey * sn, y = o.cy + ex * sn + ey * c;
    if (names.some((n) => x > n.l && x < n.r && y > n.t && y < n.b)) continue;
    if (x < 4 || y < 4 || x > 1436 || y > 896) continue;
    points.push({ a, x, y });
  }
  expect(points.length, "most of the ring to read").toBeGreaterThan(40);
  // how much brighter than the ground each little stretch of it is
  const along = async () => {
    const shot = (await page.screenshot()).toString("base64");
    return page.evaluate(async ({ shot, points }) => {
      const img = new Image(); img.src = "data:image/png;base64," + shot; await img.decode();
      const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      const g = c.getContext("2d"); g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      return points.map(({ x, y }) => {
        let most = 0;
        for (let yy = Math.round(y) - 3; yy <= Math.round(y) + 3; yy++) for (let xx = Math.round(x) - 3; xx <= Math.round(x) + 3; xx++) {
          const k = (yy * c.width + xx) * 4;
          most = Math.max(most, (d[k] + d[k + 1] + d[k + 2]) / 3);
        }
        return most;
      });
    }, { shot, points });
  };
  const ground = (await light(page, { x: 640, y: 4, width: 4, height: 4 })).sum / 16 || 30;
  const one = await along();
  await page.waitForTimeout(1000);
  const two = await along();
  // (the dimmer of the two reads at each place: a speck of the sillage
  // crossing the line at one moment is not the line)
  const lift = one.map((v, i) => Math.min(v, two[i]) - ground);
  // a line: lit the whole way round, nowhere a gap
  expect(Math.min(...lift), "lit the whole way round").toBeGreaterThan(6);
  // still: the same a second later
  const moved = one.reduce((t, v, i) => t + Math.abs(v - two[i]), 0) / one.reduce((t, v) => t + Math.max(1, v - ground), 0);
  expect(moved, "still").toBeLessThan(0.2);
  // even, and turned towards you below: the near half brighter than the far
  const half = (near) => { const v = lift.filter((_, i) => (Math.sin(points[i].a) > 0.4) === near); return v.reduce((t, x) => t + x, 0) / v.length; };
  expect(half(true), "the near half the brighter").toBeGreaterThan(half(false) * 1.25);
  const nearOnes = lift.filter((_, i) => Math.sin(points[i].a) > 0.4).sort((p, q) => p - q);
  const tenth = (f) => nearOnes[Math.min(nearOnes.length - 1, Math.floor(f * nearOnes.length))];
  expect(tenth(0.9), "and even along it").toBeLessThan(tenth(0.1) * 2.6);
  // nothing of the crawl in the drawing's own code
  const code = fs.readFileSync(path.join(__dirname, "..", "molecule.js"), "utf8");
  for (const gone of ["ORBIT_TURN", "ORBIT_OFF", "ORBIT_BACK", "ORBIT_TONES"]) expect(code, gone).not.toContain(gone);
});

/* HOW THE SILLAGE MOVES, TO CHOOSE FROM (2026-10-04, later: "the colour and
   size are very good. idk about the movement"): the page draws it afloat
   (since 2026-10-05; it drew it diffuse until then), and the address shows
   the others — diffuse, rise, swirl, still, breeze — each drawn in the room
   as thickly, near enough, and moving. */
test("the sillage's movements to choose from: the page's own, and each asked for by the address, draws in the room and moves", async ({ page }) => {
  test.setTimeout(240000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  let drawn = 0;
  for (const move of ["afloat", "diffuse", "rise", "swirl", "still", "breeze"]) {
    await page.goto(`/index.html?auto=off${move === "afloat" ? "" : "&sillage=" + move}`);
    await expect(page.locator(".molecule"), move).toHaveAttribute("data-sillage", move);
    await expect(page.locator(".molecule"), move).toHaveClass(/molecule-drawn/, { timeout: 4000 });
    await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot, .molecule-charge { visibility: hidden !important; }" });
    await page.mouse.move(1279, 799);
    await toStage(page, 4);
    await settled(page, 4);
    await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
    await page.waitForTimeout(800);
    // in the room, between the ring and the aldehyde, on both sides
    const o = await orbitOf(page, 16);
    const avoid = o.electrons.map((e) => ({ l: e.x - 14, r: e.x + 14, t: e.y - 14, b: e.y + 14 }));
    const boxes = [{ x: 200, y: 200, width: 200, height: 400 }, { x: 880, y: 200, width: 200, height: 400 }];
    const lit = await litPer(page, boxes, avoid, o);
    // (measured, in a browser without a graphics card: diffuse, rise, swirl
    // and still a little thicker here than afloat, which fills the whole room
    // as evenly; breeze the same)
    if (move === "afloat") { drawn = lit; expect(drawn, "the sillage as the page draws it").toBeGreaterThan(0); }
    else expect(lit, `${move}: specks in the room, as many as the page's near enough`).toBeGreaterThan(drawn * 0.3);
    // and moving: the room is not the same picture a second and a half later
    const shot = async () => (await page.screenshot({ clip: { x: 4, y: 200, width: 300, height: 400 } })).toString("base64");
    const a = await shot();
    await page.waitForTimeout(1500);
    expect(await shot(), `${move}: moving`).not.toBe(a);
  }
  expect(errors, "no errors").toEqual([]);
});

test("five stages, smoothly: the title, the title gone, the aldehyde upright, its formula, and the names", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  const title = () => page.locator(".title-content").evaluate((e) => +getComputedStyle(e).opacity);
  const names = () => page.locator(".formula-link").first().evaluate((e) => +getComputedStyle(e).opacity);
  const stageNo = () => page.locator("#aldehyde-stage").getAttribute("data-stage");
  await page.waitForTimeout(3000);

  // 1 — as it is first seen, the title in front of it
  expect(await title()).toBeGreaterThan(0.95);
  expect(await state(page)).toBe("cloud");
  expect(await stageNo()).toBe("1");
  expect(await names(), "no names yet").toBe(0);
  const first = await colours(page);

  // 2 — the same, the title gone
  await toStage(page, 1);
  await settled(page, 1);
  await expect.poll(title, { timeout: 4000 }).toBeLessThan(0.02);
  expect(await state(page)).toBe("cloud");
  expect(await stageNo()).toBe("2");
  expect(await page.locator(".title-content").evaluate((e) => getComputedStyle(e).pointerEvents), "nor takes a click").toBe("none");

  // 3 — upright: the O at the top, where the lone pair's violet is now; no formula yet
  await toStage(page, 2);
  await settled(page, 2);
  await expect.poll(() => state(page), { timeout: 20000 }).toBe("turned");
  expect(await stageNo()).toBe("3");
  await page.waitForTimeout(1500);
  const upright = await colours(page);
  expect(upright.violet.n, "the lone pair drawn").toBeGreaterThan(60);
  expect(upright.violet.y, "the O and its lone pair at the top").toBeLessThan(first.violet.y - 60);
  for (const a of await atoms(page)) expect(a.shown, `no ${a.sym} named yet`).toBe(0);
  expect(await names()).toBe(0);

  // 4 — its formula: O at the top, the two H below either side, all named
  await toStage(page, 3);
  await settled(page, 3);
  await expect.poll(() => state(page), { timeout: 20000 }).toBe("formula");
  expect(await stageNo()).toBe("4");
  await page.waitForTimeout(800);
  const [O, C, H1, H2] = await atoms(page);
  expect([O.sym, C.sym, H1.sym, H2.sym]).toEqual(["O", "C", "H", "H"]);
  for (const a of [O, C, H1, H2]) expect(a.shown, `${a.sym} named`).toBeGreaterThan(0.95);
  expect(Math.abs(O.x - C.x), "the C=O upright").toBeLessThan(8);
  expect(O.y, "the O at the top").toBeLessThan(C.y - 40);
  expect(H1.y, "the H below").toBeGreaterThan(C.y + 20);
  expect(H2.y).toBeGreaterThan(C.y + 20);
  expect(Math.abs((H1.y - C.y) - (H2.y - C.y)), "level with each other").toBeLessThan(10);
  expect(Math.abs((C.x - H1.x) - (H2.x - C.x)), "either side, alike").toBeLessThan(10);
  expect(await names(), "no names yet").toBe(0);

  // 5 — the names on their orbit, and the aldehyde's sillage spreading round them
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  expect(await stageNo()).toBe("5");
  await expect.poll(names, { timeout: 4000 }).toBeGreaterThan(0.99);
  expect(await page.locator(".formula-link").first().evaluate((e) => getComputedStyle(e).pointerEvents), "and take the hand").toBe("auto");
  await page.waitForTimeout(1200);
  const [lx, rx] = await roomXs(page);
  // specks all down both rooms, top to foot, faint — none of the lines' glow
  // (read with the names and the cursor out of the picture, so what is
  // counted is specks; few, where a browser without a graphics card draws
  // three in ten of them)
  const hidden = await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot { visibility: hidden !important; }" });
  for (const [x, w] of [[8, lx - 16], [rx + 8, 1440 - rx - 16]]) {
    for (const y of [40, 360, 700]) {
      const there = await light(page, { x, y, width: w, height: 140 });
      expect(there.lit, `specks at ${Math.round(x)},${y}`).toBeGreaterThan(3);
    }
  }
  await hidden.evaluate((e) => e.remove());

  // and back, all the way
  await toStage(page, 0);
  await settled(page, 0);
  await expect.poll(title, { timeout: 4000 }).toBeGreaterThan(0.95);
  await expect.poll(names, { timeout: 4000 }).toBe(0);
  await expect.poll(() => state(page), { timeout: 20000 }).toBe("cloud");
  expect(errors).toEqual([]);
});

/* "just prolongue the horizontal to vertical transformation of the
   aldehyde. thats the only part that looks fast. I want you to smooth it
   out" (2026-10-01). Its leg of the page is the longest (LEGS in landing.js)
   and the turn follows the page on a spring of its own, so a key pressed —
   the quickest way there — turns it over two seconds and more, never faster
   than about ninety degrees a second; it took a second, at up to 160. */
test("the turn upright is prolonged and smooth: its leg the longest, and never quick", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  // (the keys a stage at a time: the hand-driven page)
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  const legs = (await page.locator("#aldehyde-stage").getAttribute("data-legs")).split(" ").map(Number);
  expect(legs).toHaveLength(4);
  expect(legs[1], "the turning leg the longest").toBeGreaterThan(Math.max(legs[0], legs[2], legs[3]) * 1.5);
  await page.keyboard.press("ArrowDown");
  await settled(page, 1);
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    window.__turn = []; const m = document.getElementById("molecule"); const t0 = performance.now();
    const f = (t) => { window.__turn.push([t - t0, m.turned]); if (t - t0 < 6000) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(6300);
  const turn = await page.evaluate(() => window.__turn);
  const start = turn.find(([, v]) => v > 0.02), end = turn.find(([, v]) => v > 0.98);
  expect(start && end, "it turned").toBeTruthy();
  expect(end[0] - start[0], "over two seconds and more").toBeGreaterThan(1800);
  // its speed over each quarter of a second (this browser draws it every
  // fifth frame), in degrees: a turn is about ninety
  let peak = 0;
  for (let i = 0; i < turn.length; i++) {
    const j = turn.findIndex(([t]) => t >= turn[i][0] + 250);
    if (j < 0) break;
    peak = Math.max(peak, ((turn[j][1] - turn[i][1]) * 91) / ((turn[j][0] - turn[i][0]) / 1000));
  }
  expect(peak, "never quick").toBeLessThan(100);
  expect(turn[turn.length - 1][1], "and upright at the end").toBeCloseTo(1, 2);
  await expect.poll(() => state(page), { timeout: 4000 }).toBe("turned");
});

// "a smooth scrolling instead of incremental", and then "EVERYTHING should
// be smooth and gradual; and not incremental": the wheel's notches glide
// the page on a spring, the stage follows it, and a wheel stopped between
// two stages stays where it stopped. (The hand-driven page, `?auto=off`,
// since one scroll plays it all the way — and the stage's own wheel with the
// map slides on.)
test("the wheel scrolls it smoothly, as far as it is turned and back, and nothing snaps", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.mouse.move(720, 450);
  await page.waitForTimeout(600);
  // three notches, and where the stage is, frame by frame
  await page.evaluate(() => {
    window.__seen = [];
    const at = () => { window.__seen.push(+window.__formula); if (window.__seen.length < 160) requestAnimationFrame(at); };
    requestAnimationFrame(at);
  });
  for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(60); }
  await page.waitForTimeout(3200);
  const seen = await page.evaluate(() => window.__seen);
  const leg = await stageY(page, 1);   // the first leg (the second, the turning, is longer)
  const end = seen[seen.length - 1];
  // (the glide sends the page half a notch — WHEEL_SCALE in landing.js;
  // it was 0.85 until the owner asked for it "less sensitive/slower")
  expect(end, "as far as it was turned: three notches of a leg").toBeCloseTo((300 * 0.5) / leg, 1);
  const steps = seen.slice(1).map((v, i) => v - seen[i]);
  expect(Math.max(...steps), "never a jump").toBeLessThan(0.15);
  expect(Math.min(...steps), "never back").toBeGreaterThanOrEqual(-1e-6);
  expect(new Set(seen.filter((v) => v > 0.01 && v < end - 0.01).map((v) => v.toFixed(3))).size, "but a glide").toBeGreaterThan(6);
  // stopped part of the way, it stays part of the way: once it has come to
  // rest — the glide's last pixel or two can land after the 160 frames above
  // on a slow machine (2026-10-03: it failed so on the code before as after)
  // — it does not go on to a whole stage
  await expect.poll(async () => { const a = await stageAt(page); await page.waitForTimeout(250); return Math.abs((await stageAt(page)) - a); },
    { timeout: 6000 }).toBeLessThan(1e-4);
  const rest = await stageAt(page);
  expect(rest, "where it was turned to").toBeCloseTo((300 * 0.5) / leg, 2);
  await page.waitForTimeout(1200);
  expect(await stageAt(page), "nothing snaps").toBeCloseTo(rest, 3);
  // and back up
  for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, -100); await page.waitForTimeout(60); }
  await settled(page, 0);
  expect(errors).toEqual([]);
});

/* THE SILLAGE (2026-10-03, last: "rework the words and the particles
   surrounding the main aldehyde molecule ... fill in the gaps and make it all
   thematic"): where ADAR's dust fell either side, the aldehyde's scent in the
   room — since 2026-10-05 ("make the particles not come from the aldehyde
   itself") AFLOAT: specks in the room already, on every side, each coming up
   where it is and drifting on the room's air; nothing streams out of the
   aldehyde, so the room is nearly as full at its edges as near it, and it
   comes up everywhere at once as the last stage comes (it spread out from the
   aldehyde, reaching further as it came, until then — `?sillage=diffuse`).
   Read still (motion off), with the names out of the picture, so what is
   counted is the sillage. */
test("the sillage comes up as the last stage comes: specks afloat in the room on every side, nearly as many at its edges as by the aldehyde, nothing streaming out of it, and nothing of the drift or the lines left", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await expect(page.locator(".molecule")).toHaveAttribute("data-sillage", "afloat");
  await toStage(page, 3);
  await settled(page, 3);
  await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot { visibility: hidden !important; }" });
  const room = () => light(page, { x: 8, y: 70, width: 300, height: 780 });
  const edge = () => light(page, { x: 4, y: 60, width: 110, height: 780 });
  const none = (await room()).lit;
  expect(none, "no sillage before the last stage").toBeLessThan(6);
  const edgeNone = (await edge()).lit;
  await toStage(page, 3.4);
  await settled(page, 3.4);
  await expect.poll(() => state(page)).toBe("drifting");
  const some = (await room()).lit;
  expect(some, "coming up").toBeGreaterThan(none);
  // everywhere at once — at the window's very edge too, not reaching out to it
  expect((await edge()).lit, "at the edge as soon as anywhere").toBeGreaterThan(edgeNone);
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page)).toBe("drift");
  expect((await room()).lit, "and there once it is").toBeGreaterThan(Math.max(some, 15));
  // on every side: above the formula and below it, and in all four corners
  // (the orbit's ring, and its electrons, left out of what is counted)
  const ring = await orbitOf(page, 16);
  const avoid = ring.electrons.map((e) => ({ l: e.x - 14, r: e.x + 14, t: e.y - 14, b: e.y + 14 }));
  for (const [x, y] of [[620, 16], [620, 790], [20, 20], [1220, 20], [20, 730], [1220, 730]]) {
    expect(await litPer(page, [{ x, y, width: 200, height: 94 }], avoid, ring), `specks at ${x},${y}`).toBeGreaterThan(0);
  }
  // nearly as many to a pixel at the window's edges as just outside the cloud
  const near = await litPer(page, [{ x: 240, y: 260, width: 110, height: 380 }, { x: 1090, y: 260, width: 110, height: 380 }], avoid, ring);
  const far = await litPer(page, [{ x: 8, y: 260, width: 110, height: 380 }, { x: 1322, y: 260, width: 110, height: 380 }], avoid, ring);
  // (measured, in a browser without a graphics card: as many at the edges,
  // and more — 0.00031 to 0.00024 of a pixel looked at)
  expect(far, "the room nearly as full at its edges").toBeGreaterThan(near * 0.5);
  // and the way it was, out of the aldehyde, there to compare on the address
  await page.goto("/index.html?sillage=diffuse");
  await expect(page.locator(".molecule")).toHaveAttribute("data-sillage", "diffuse");
  // nothing of the lines, or of ADAR's drift, in the drawing's own code
  const code = fs.readFileSync(path.join(__dirname, "..", "molecule.js"), "utf8");
  for (const gone of ["LINE_VERTEX", "uLineX", "LINE_DENSITY", "lineGeo", "layLines", "DRIFT_DENSITY", "DRIFT_PATCH", "DRIFT_FALL", "aDrift", "layDrift"]) expect(code, gone).not.toContain(gone);
});

test("a name is quiet until the hand comes to it: then it comes up gradually to the whole of itself", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  const name = page.locator(".formula-link").nth(1);
  // how much of itself it shows: its quiet (a filter) times its coming up (opacity)
  const quiet = () => name.evaluate((e) => {
    const m = /opacity\(([\d.]+)\)/.exec(getComputedStyle(e).filter);
    return (m ? +m[1] : 1) * +getComputedStyle(e).opacity;
  });
  // quiet: low, but whole — nothing of it hidden away (it was half veiled for a round)
  const rest = await quiet();
  expect(rest, "low at rest").toBeLessThan(0.45);
  expect(rest, "but there").toBeGreaterThan(0.2);
  expect(await name.evaluate((e) => getComputedStyle(e).maskImage || getComputedStyle(e).webkitMaskImage), "no veil").toBe("none");
  const r = await name.boundingBox();
  await page.mouse.move(1380, 60);
  await page.waitForTimeout(1500);
  // the hand on it: it comes up, gradually, to the whole of itself
  await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 4 });
  await page.waitForTimeout(250);
  const partway = await quiet();
  expect(partway, "on its way up").toBeGreaterThan(rest + 0.02);
  expect(partway, "gradually, not at once").toBeLessThan(0.97);
  await expect.poll(quiet, { timeout: 3000 }).toBeGreaterThan(0.99);
  await page.waitForTimeout(1200);
  await expect(page.locator(".molecule-charge"), "δ− by the hand").toHaveClass(/is-on/);
  expect(await page.locator(".molecule-charge").textContent()).toBe("\u03b4\u2212");
  // and the hand gone, quiet again
  await page.mouse.move(1380, 60, { steps: 4 });
  await expect.poll(quiet, { timeout: 3000 }).toBeLessThan(0.45);
});

test("the electronegative hand draws the sillage's specks to it", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  // (every speck drawn, as a browser with a graphics card draws them: three
  // in ten are too few round one hand to count)
  await page.goto("/index.html?auto=off&molecule=full");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  // round the hand in the left room — the names, the site's cursor and the
  // δ− kept out of the picture — well outside the orbit's ring and its
  // electrons, so what is counted is the sillage
  await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot, .molecule-charge { visibility: hidden !important; }" });
  // (out in the room beyond the ring, which stands further out since the
  // aldehyde was given centre stage)
  const hand = { x: 60, y: 470 };
  const o = await orbitOf(page);
  {
    const dx = hand.x - o.cx, dy = hand.y - o.cy, c = Math.cos(-o.tilt), sn = Math.sin(-o.tilt);
    const ux = dx * c - dy * sn, uy = dx * sn + dy * c;
    expect((Math.hypot(ux / o.rx, uy / o.ry) - 1) * Math.min(o.rx, o.ry), "the hand well off the ring").toBeGreaterThan(90);
    for (const e of o.electrons) expect(Math.hypot(e.x - hand.x, e.y - hand.y), "and its electrons").toBeGreaterThan(130);
  }
  const box = { x: hand.x - 60, y: hand.y - 60, width: 120, height: 120 };
  const sumOver = async (n) => { let t = 0; for (let i = 0; i < n; i++) { t += (await light(page, box)).lit; await page.waitForTimeout(150); } return t / n; };
  await page.mouse.move(1380, 60);
  await page.waitForTimeout(1800);
  const before = await sumOver(6);
  await page.mouse.move(hand.x, hand.y, { steps: 6 });
  await page.waitForTimeout(1800);
  const after = await sumOver(6);
  expect(after, "specks drawn towards the hand, and brighter").toBeGreaterThan(before * 1.15 + 3);
});

test("the electronegative hand draws the aldehyde's own specks to it", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?molecule=full");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 1);
  await settled(page, 1);
  // a box just outside the cloud: faint, until the hand is beyond it
  const box = { x: 1010, y: 420, width: 50, height: 50 };
  await page.mouse.move(40, 860);
  await page.waitForTimeout(3500);
  const before = await light(page, box);
  await page.mouse.move(1080, 445, { steps: 6 });
  await page.waitForTimeout(2200);
  const after = await light(page, box);
  expect(after.sum, "specks drawn out towards the hand, and brighter").toBeGreaterThan(before.sum * 1.05);
  await expect(page.locator(".molecule-charge")).toHaveClass(/is-on/);
  // at the title it is felt only a little ("way less reactive to the cursor"):
  // no δ−, and the specks by the hand barely drawn
  await toStage(page, 0);
  await settled(page, 0);
  await page.mouse.move(40, 860);
  await page.waitForTimeout(2500);
  const calm = await light(page, box);
  await page.mouse.move(1080, 445, { steps: 6 });
  await page.waitForTimeout(2200);
  await expect(page.locator(".molecule-charge"), "no δ− at the title").not.toHaveClass(/is-on/);
  const stirred = await light(page, box);
  expect(Math.abs(stirred.sum - calm.sum) / calm.sum, "barely stirred").toBeLessThan(Math.abs(after.sum - before.sum) / before.sum);
  // away off the page, nothing is drawn
  await page.mouse.move(-10, 450);
  await page.evaluate(() => document.documentElement.dispatchEvent(new PointerEvent("pointerleave")));
  await expect(page.locator(".molecule-charge")).not.toHaveClass(/is-on/, { timeout: 3000 });
});

test("a name pressed asks first, on the stage's own dark: Stay, Escape and the veil keep the page, Go goes, and a key held goes at once", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect(page.locator("#aldehyde-stage")).toHaveClass(/names-here/, { timeout: 4000 });
  const name = page.locator(".formula-link").nth(1);
  const ask = page.locator("#formula-ask");
  await expect(ask).toBeHidden();
  await name.click();
  await expect(ask).toBeVisible();
  await expect(page.locator(".formula-ask-sheet")).toHaveAttribute("role", "alertdialog");
  await expect(page.locator(".formula-ask-name")).toHaveText("Theories");
  // what the page is, in the words its window said on the map; no kicker
  // over the name any more ("remove the text 'leave the aldehyde'")
  await expect(page.locator(".formula-ask-say")).toHaveText("Some frameworks that I came up with myself.");
  await expect(page.locator(".formula-ask-note")).toBeHidden();
  await expect(page.locator(".formula-ask-kicker")).toHaveCount(0);
  await expect(page.locator("#formula-ask")).not.toContainText("Leave the aldehyde");
  await expect(page.locator(".formula-ask-go")).toHaveAttribute("href", "theories/");
  await expect(page.locator(".formula-ask-go")).toBeFocused();
  expect(new URL(page.url()).pathname, "not gone yet").toBe("/index.html");
  // on theme: the stage's dark, its gold, the page behind out of focus
  const look = await page.evaluate(() => ({
    sheet: getComputedStyle(document.querySelector(".formula-ask-sheet")).backgroundColor,
    corner: getComputedStyle(document.querySelector(".formula-ask-sheet"), "::before").borderTopColor,
    // (on its veil, faded in at one size since 2026-10-01, as About me's is)
    veil: getComputedStyle(document.getElementById("formula-ask"), "::before").backdropFilter,
  }));
  expect(look.corner).toBe("rgba(224, 178, 82, 0.9)");
  expect(look.sheet).toMatch(/^rgba\(26, 26, 27/);
  expect(look.veil).toMatch(/blur/);
  // (and it is up — waited for: read straight after it was pressed, its
  // fading in can be a frame from starting)
  await expect.poll(() => page.evaluate(() => +getComputedStyle(document.getElementById("formula-ask"), "::before").opacity),
    { message: "and it is up" }).toBeGreaterThan(0);
  // specks in it ("I want the popup window to have some particles too"),
  // in the aldehyde's colours
  await expect.poll(() => page.evaluate(() => {
    const c = document.querySelector(".formula-ask-specks");
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let k = 3; k < d.length; k += 4) if (d[k] > 20) n++;
    return n;
  }), { timeout: 4000 }).toBeGreaterThan(60);
  // and the page behind it still moving ("I also want the page in the back
  // to keep moving"): the sillage, beside the sheet, one moment and the next
  const [lx] = await roomXs(page);
  const strip = { x: 20, y: 120, width: Math.max(40, lx - 60), height: 520 };
  const one = await page.screenshot({ clip: strip });
  await page.waitForTimeout(900);
  const two = await page.screenshot({ clip: strip });
  expect(one.equals(two), "the page behind goes on moving").toBe(false);
  // the keys stay in it
  await page.keyboard.press("Tab");
  await expect(page.locator(".formula-ask-stay")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".formula-ask-go")).toBeFocused();
  // Stay
  await page.locator(".formula-ask-stay").click();
  await expect(ask).toBeHidden();
  await expect(name).toBeFocused();
  // Escape
  await name.click();
  await expect(ask).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(ask).toBeHidden();
  // the veil round it
  await name.click();
  await expect(ask).toBeVisible();
  await page.mouse.click(60, 860);
  await expect(ask).toBeHidden();
  // a page whose window carried a note carries it here, set apart
  const photo = page.locator(".formula-link").nth(5);
  await photo.click();
  await expect(ask).toBeVisible();
  await expect(page.locator(".formula-ask-name")).toHaveText("Photography");
  await expect(page.locator(".formula-ask-note")).toBeVisible();
  await expect(page.locator(".formula-ask-note")).toHaveText("Work in progress — this part of the website will be completed later.");
  await page.keyboard.press("Escape");
  await expect(ask).toBeHidden();
  // a key held: no asking (nothing is being left)
  const prevented = await name.evaluate((a) => {
    let was = null;
    const see = (e) => { was = e.defaultPrevented; e.preventDefault(); };
    window.addEventListener("click", see);
    a.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
    window.removeEventListener("click", see);
    return was;
  });
  expect(prevented, "a click with a key held is the browser's").toBe(false);
  await expect(ask).toBeHidden();
  // Go
  await name.click();
  await page.locator(".formula-ask-go").click();
  await page.waitForURL(/\/theories\/$/);
  expect(errors).toEqual([]);
});

/* "now, just use the text from what would have been the popup windows on
   page 4 for the same text in the home page now" (2026-09-30): what a name
   says when it asks is what its node's window said on the map, word for
   word — the map is switched off, so the words are kept on the names, and
   this keeps the two copies the same. */
test("what each name says when it asks is its page's window on the map, word for word", async ({ page }) => {
  const src = fs.readFileSync(path.join(__dirname, "..", "node-scene.js"), "utf8");
  const start = src.indexOf("const REAL_NODES = [");
  const end = src.indexOf("\n];", start) + 3;
  const nodes = new Function(src.slice(start, end) + "\nreturn REAL_NODES;")();
  await page.goto("/index.html");
  const names = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => ({
    href: a.getAttribute("href"), say: a.dataset.say || null, note: a.dataset.note || null,
  })));
  expect(names).toHaveLength(8);
  for (const n of names) {
    const node = nodes.find((x) => x.href === n.href);
    expect(node, n.href + " is on the map's list").toBeTruthy();
    expect(n.say, n.href).toBe(node.preview.description);
    expect(n.note, n.href).toBe(node.preview.note || null);
  }
});

/* "for the main titles, i want you to make them slightly particular when
   hovered. give them a slight backdrop of particles, same colours as the
   aldehyde" (2026-09-30). */
test("a name pointed at stands on a slight backdrop of specks, which goes when the hand does", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  // a name on the right: above and below its lettering
  const name = page.locator(".formula-link").nth(4);
  const r = await name.boundingBox();
  const pad = await name.evaluate((e) => parseFloat(getComputedStyle(e).paddingTop));
  const above = { x: r.x + r.width / 2 - 40, y: r.y + 1, width: 80, height: pad - 3 };
  await page.mouse.move(1380, 60);
  await page.waitForTimeout(1500);
  const before = await light(page, above);
  await page.mouse.move(r.x + r.width * 0.2, r.y + r.height / 2, { steps: 4 });
  await expect.poll(async () => (await light(page, above)).lit, { timeout: 8000 }).toBeGreaterThan(before.lit + 14);
  await page.mouse.move(1380, 60, { steps: 4 });
  // (the drift's own specks pass through it now and then)
  await expect.poll(async () => (await light(page, above)).lit, { timeout: 8000 }).toBeLessThanOrEqual(before.lit + 8);
});

test("the names wait for the last stage, and a name tabbed to takes the page there", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await page.waitForTimeout(3200);
  const first = page.locator(".formula-link").first();
  expect(await first.evaluate((e) => +getComputedStyle(e).opacity)).toBe(0);
  expect(await first.evaluate((e) => getComputedStyle(e).pointerEvents), "not to be pressed unseen").toBe("none");
  for (let i = 0; i < 8 && !(await first.evaluate((e) => e === document.activeElement)); i++) await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await settled(page, 4);
  await expect.poll(() => first.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeGreaterThan(0.99);
});

test("with motion turned off the stages are simply there, still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 4);
  await settled(page, 4, 2000);
  await expect.poll(() => state(page), { timeout: 4000 }).toBe("drift");
  // (the hand kept off the picture: the site's cursor is drawn where it is)
  await page.mouse.move(20, 880);
  await page.waitForTimeout(300);
  const clip = { x: 100, y: 60, width: 1240, height: 780 };
  const a = (await page.screenshot({ clip })).toString("base64");
  await page.waitForTimeout(900);
  const b = (await page.screenshot({ clip })).toString("base64");
  expect(a === b, "nothing moved").toBe(true);
  expect((await light(page, clip)).n, "and it is drawn").toBeGreaterThan(2000);
  // and the hand, over it, draws nothing to it
  await page.mouse.move(720, 450, { steps: 4 });
  await page.waitForTimeout(900);
  await expect(page.locator(".molecule-charge")).not.toHaveClass(/is-on/);
});

test("without the 3D library the last stage is the eight names, plainly, and a name still asks first", async ({ page }) => {
  const errors = collectPageErrors(page, ["three.min.js", "ERR_FAILED", "Failed to load resource"]);
  await blockThreeJs(page);
  await page.goto("/index.html");
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  const links = page.locator(".formula-link");
  await expect(links).toHaveCount(8);
  for (let i = 0; i < 8; i++) {
    await expect(links.nth(i)).toBeVisible();
    expect(await links.nth(i).evaluate((e) => +getComputedStyle(e).opacity)).toBe(1);
  }
  await links.nth(0).click();
  await expect(page.locator("#formula-ask")).toBeVisible();
  await expect(page.locator(".formula-ask-name")).toHaveText("Scent Descriptions");
  expect(errors).toEqual([]);
});

test("on a phone the names stand two above and two below the formula each side, scattered a little, in the sillage, and nothing scrolls sideways", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 4);
  await settled(page, 4, 2000);
  await expect.poll(() => state(page), { timeout: 4000 }).toBe("drift");
  const b = await boxes(page);
  const [O, , H1, H2] = await atoms(page);
  for (const i of [0, 1, 4, 5]) expect(b[i].b, `name ${i + 1} above the formula`).toBeLessThan(O.y - 20);
  for (const i of [2, 3, 6, 7]) expect(b[i].t, `name ${i + 1} below it`).toBeGreaterThan(Math.max(H1.y, H2.y) + 20);
  const [lx, rx] = await roomXs(page);
  for (const i of [0, 1, 2, 3]) expect(b[i].r, "on the left of the middle").toBeLessThanOrEqual(lx + 2);
  for (const i of [4, 5, 6, 7]) expect(b[i].l, "on the right of it").toBeGreaterThanOrEqual(rx - 2);
  for (const x of b) { expect(x.l).toBeGreaterThanOrEqual(0); expect(x.r).toBeLessThanOrEqual(390); }
  // the sillage across the whole window there, above the formula and below it
  expect((await light(page, { x: 10, y: 60, width: 370, height: 120 })).lit, "specks above").toBeGreaterThan(8);
  expect((await light(page, { x: 10, y: 844 - 120, width: 370, height: 100 })).lit, "and below").toBeGreaterThan(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

/* A RELOAD DOES NOT FLASH THE LAST STAGE (2026-10-03: "something flashes when
   you reset the page ... i think it is the scrolled version of the page"). Until
   landing.js had said how far up the names were, the stylesheet showed them
   whole, so for the moment between the page being drawn and its scripts
   running, the last stage stood over the title. They are held back by the
   page's own head (`stage-coming`) until landing.js places them; and a reload
   opens at the title. */
test("a reload opens at the title, the names never shown before the page has placed them", async ({ page }) => {
  // the page's own scripts held back, to see it as it stands before they run
  let hold = true;
  await page.route(/landing\.js$/, async (route) => { while (hold) await new Promise((r) => setTimeout(r, 50)); route.continue(); });
  page.goto("/index.html?auto=off").catch(() => {});
  await page.waitForSelector(".formula-link", { state: "attached" });
  await page.waitForTimeout(600);
  const early = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => +getComputedStyle(a).opacity));
  expect(early.every((o) => o === 0), `none of the names before the page has placed them: ${early}`).toBe(true);
  hold = false;
  await expect(page.locator("html")).not.toHaveClass(/stage-coming/, { timeout: 8000 });
  await page.waitForTimeout(400);
  expect(await page.locator(".formula-link").first().evaluate((e) => +getComputedStyle(e).opacity), "and at the title, none").toBe(0);
  // scrolled down to the last stage and reloaded, it opens at the title
  await toStage(page, 4);
  await settled(page, 4);
  await page.reload();
  await expect(page.locator("#aldehyde-stage")).toHaveAttribute("data-stage", "1");
  expect(await stageAt(page)).toBe(0);
});

/* ONE SCROLL, ONE GLIDE, ALL THE WAY (2026-10-04: "I want it to be a
   continuous auto scroll upon detecting a scrolling motion from the user that
   will smoothly in the span of about 4 seconds go all the way to the bottom,
   it needs to be gradual"). It stands at the title until it is scrolled, and
   one turn of the wheel carries it to the names in one movement, about four
   seconds long, setting off and arriving gently and stopping nowhere on the
   way; one turn up carries it all the way back. (It went a stage at a time,
   resting at each, for the round before.) */
test("the page waits at the title until it is scrolled, and one turn of the wheel glides it to the names in one gradual movement of about four seconds; one turn up, all the way back", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  const stage = page.locator("#aldehyde-stage");
  await expect(stage).toHaveAttribute("data-auto", "ready");
  await page.waitForTimeout(6500);
  expect(await stageAt(page), "nothing by itself").toBe(0);
  await page.mouse.move(720, 450);
  // where the page is, frame by frame, from the turn on
  const watch = () => page.evaluate(() => {
    const seen = window.__run = []; const t0 = performance.now(); const c = document.getElementById("scroll-container");
    const f = (t) => { if (window.__run !== seen) return; seen.push([t - t0, c.scrollTop]); if (t - t0 < 7000) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  const run = () => page.evaluate(() => window.__run);
  await watch();
  // one turn: a run of notches, as a wheel sends them
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(40); }
  await expect(stage).toHaveAttribute("data-auto", "down");
  await expect(stage).toHaveAttribute("data-auto", "ready", { timeout: 15000 });
  await settled(page, 4, 4000);
  await expect(stage).toHaveAttribute("data-stage", "5");
  await page.waitForTimeout(800);
  const down = (await run()).filter(([t]) => t < 7000);
  const end = down[down.length - 1][1];
  const set = down.find(([, y]) => y > 2), there = down.find(([, y]) => y >= end - 1);
  const took = there[0] - set[0];
  expect(took, "about four seconds").toBeGreaterThan(3200);
  expect(took).toBeLessThan(5200);
  const steps = down.slice(1).map(([t, y], i) => [t - down[i][0], y - down[i][1]]);
  expect(Math.min(...steps.map(([, d]) => d)), "never back").toBeGreaterThanOrEqual(-0.5);
  // one movement: nowhere on the way does it stand still for a moment (the
  // round before rested over a second at each stage)
  const moving = down.filter(([t]) => t > set[0] + 300 && t < there[0] - 300);
  let still = 0, longest = 0;
  for (let i = 1; i < moving.length; i++) {
    still = moving[i][1] - moving[i - 1][1] < 0.5 ? still + (moving[i][0] - moving[i - 1][0]) : 0;
    longest = Math.max(longest, still);
  }
  expect(longest, "it stops nowhere on the way").toBeLessThan(150);
  // gradual: it sets off gently and arrives gently — under half its middle's
  // speed in its first and last 15%
  const at = (t) => { const r = down.find(([tt]) => tt >= t); return r ? r[1] : end; };
  const speed = (a, b) => (at(set[0] + b * took) - at(set[0] + a * took)) / ((b - a) * took);
  expect(speed(0, 0.15), "setting off gently").toBeLessThan(speed(0.4, 0.6) * 0.5);
  expect(speed(0.85, 1), "arriving gently").toBeLessThan(speed(0.4, 0.6) * 0.5);
  // further turns there go nowhere
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(600);
  await expect(stage).toHaveAttribute("data-auto", "ready");
  // one turn up: all the way back to the title, as gradually
  await watch();
  await page.mouse.wheel(0, -100);
  await expect(stage).toHaveAttribute("data-auto", "up");
  await expect(stage).toHaveAttribute("data-auto", "ready", { timeout: 15000 });
  await settled(page, 0, 4000);
  await expect(stage).toHaveAttribute("data-stage", "1");
  const up = await run();
  const leave = up.find(([, y]) => y < end - 2), home = up.find(([, y]) => y <= 1);
  expect(home[0] - leave[0], "back in about four seconds").toBeGreaterThan(3200);
  expect(home[0] - leave[0]).toBeLessThan(5200);
});

test("the rest of a turn is the same scroll, and a turn the other way turns it round without a jolt; the scrollbar lets go", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  const stage = page.locator("#aldehyde-stage");
  const top = () => page.evaluate(() => document.getElementById("scroll-container").scrollTop);
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 100);
  await expect(stage).toHaveAttribute("data-auto", "down");
  await page.waitForTimeout(500);
  // a trackpad's run-on, or more notches: the same scroll — nothing hurried, nothing turned
  const frames = page.evaluate(() => new Promise((done) => {
    const seen = []; const t0 = performance.now(); const c = document.getElementById("scroll-container");
    const at = (t) => { seen.push(c.scrollTop); if (t - t0 < 700) requestAnimationFrame(at); else done(seen); };
    requestAnimationFrame(at);
  }));
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 50); await page.waitForTimeout(30); }
  const seen = await frames;
  expect(Math.min(...seen.slice(1).map((v, i) => v - seen[i])), "still going on").toBeGreaterThanOrEqual(-0.5);
  // still on its way — or, on a slow machine, already all the way there
  if ((await stage.getAttribute("data-auto")) !== "down") {
    const most = await page.evaluate(() => { const c = document.getElementById("scroll-container"); return c.scrollHeight - c.clientHeight; });
    expect(await top(), "gone on all the way").toBeGreaterThan(most - 260);
  }
  // a turn the other way: back, from where it is, to the title — easing out
  // of the way it was going, never a jump
  const turning = page.evaluate(() => new Promise((done) => {
    const seen = []; const t0 = performance.now(); const c = document.getElementById("scroll-container");
    const at = (t) => { seen.push([t, c.scrollTop]); if (t - t0 < 1500) requestAnimationFrame(at); else done(seen); };
    requestAnimationFrame(at);
  }));
  const was = await top();
  await page.mouse.wheel(0, -120);
  await expect(stage).toHaveAttribute("data-auto", "up");
  const turn = await turning;
  // how fast it goes between frames, in pixels a second — never a leap (the
  // glide at its fastest goes about 1,600 a second, a little more as it turns
  // round); read as a speed, not a distance, since a slow machine's frames
  // come further apart
  const speeds = turn.slice(1).map(([t, y], i) => Math.abs(y - turn[i][1]) / Math.max(1, t - turn[i][0]) * 1000);
  expect(Math.max(...speeds), "no jolt").toBeLessThan(3200);
  await page.waitForTimeout(400);
  expect(await top(), "turned round").toBeLessThan(was + 200);
  await expect(stage).toHaveAttribute("data-auto", "ready", { timeout: 15000 });
  await settled(page, 0);   // (the stage a very little behind the page, FOLLOW_S)
  // set going again, and the page moved by the scrollbar on the way: it lets go there
  await page.mouse.wheel(0, 100);
  await page.waitForTimeout(1000);
  await page.evaluate(() => { document.getElementById("scroll-container").scrollTop += 140; });
  await expect(stage).toHaveAttribute("data-auto", "ready");
  await page.waitForTimeout(700);   // (the stage catching up with where the page was put)
  const left = await top();
  await page.waitForTimeout(2500);
  expect(await top(), "left where it was put").toBe(left);
});

/* A swipe of a finger is a scroll: on a phone, one swipe up the page plays it
   all the way down, the page's own scrolling held off; one down, back. */
test("on a phone one swipe plays it all the way, and the page's own scrolling is held off", async ({ browser }) => {
  test.setTimeout(120000);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto("/index.html");
  const stage = page.locator("#aldehyde-stage");
  await expect(stage).toHaveAttribute("data-auto", "ready");
  const cdp = await context.newCDPSession(page);
  const swipe = async (from, to) => {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: from }] });
    for (let k = 1; k <= 8; k++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y: from + ((to - from) * k) / 8 }] });
      await page.waitForTimeout(16);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  };
  // (whether the page's own scrolling was held off, as the finger moved)
  await page.evaluate(() => {
    window.__held = [];
    document.getElementById("scroll-container").addEventListener("touchmove", (e) => window.__held.push(e.defaultPrevented), { passive: true });
  });
  await swipe(620, 380);
  await expect(stage).toHaveAttribute("data-auto", "down");
  const held = await page.evaluate(() => window.__held);
  expect(held.length, "the finger moved").toBeGreaterThan(4);
  expect(held.every(Boolean), "and the page's own scrolling was held off").toBe(true);
  await expect(stage).toHaveAttribute("data-auto", "ready", { timeout: 60000 });
  expect(await stageAt(page)).toBeCloseTo(4, 2);
  await swipe(300, 600);
  await expect(stage).toHaveAttribute("data-auto", "up");
  await expect(stage).toHaveAttribute("data-auto", "ready", { timeout: 60000 });
  expect(await stageAt(page)).toBeCloseTo(0, 2);
  await context.close();
});

test("the aldehyde stops drawing once the stage is off the screen", async ({ page }) => {
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.__loops = 0;
    window.requestAnimationFrame = (cb) => raf((now) => { if (cb.name === "loop") window.__loops++; cb(now); });
  });
  // (the stage is the whole page now; with the map slides on, it can be left)
  await page.goto(HOME_WITH_MAP);
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__loops), "drawing while it is seen").toBeGreaterThan(3);
  await jumpToSlide(page, "slide-3");
  await page.waitForTimeout(800);
  const then = await page.evaluate(() => window.__loops);
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.__loops) - then, "and not at all once it is not").toBe(0);
});

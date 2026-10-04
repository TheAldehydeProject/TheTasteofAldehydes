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
// the main aldehyde molecule. that stays 100% as it is, but the rest i need
// changed. I want you to fill in the gaps and make it all thematic" — every
// name the R of an aldehyde (R–CHO), the aldehydes of perfumery in the gaps,
// and THE SILLAGE, the aldehyde's own scent spreading into the room, where
// ADAR's drift was.
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
// `avoid` (the aldehydes in the gaps): lit pixels to a pixel looked at.
async function litPer(page, rects, avoid = []) {
  const shot = (await page.screenshot()).toString("base64");
  return page.evaluate(async ({ shot, rects, avoid }) => {
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
      area++;
      const k = (y * c.width + x) * 4;
      if ((d[k] + d[k + 1] + d[k + 2]) / 3 > 50) lit++;
    }
    return area ? lit / area : 0;
  }, { shot, rects, avoid });
}
// Where the aldehydes in the gaps stand (molecule.js), each box a little larger.
const aldehydes = (page, pad = 0) => page.evaluate((pad) => (document.getElementById("molecule").aldehydes || [])
  .map((a) => ({ name: a.name, l: a.box.l - pad, r: a.box.r + pad, t: a.box.t - pad, b: a.box.b + pad })), pad);

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

test("the last stage carries the Menu's eight pages, in its order, four either side of the formula, scattered", async ({ page }) => {
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
  const b = await boxes(page);
  const left = b.slice(0, 4), right = b.slice(4);
  const mid = (x) => (x.t + x.b) / 2;
  // four on the left of the formula and four on the right, inside the window
  // — one or two stepping a little into its room (since the scatter was
  // loosened, 2026-10-03), never far, and every one well clear of it
  const [lx, rx] = await roomXs(page);
  const step = (rx - lx) * 0.08;
  const formula = await atoms(page);
  const formulaL = Math.min(...formula.map((a) => a.x)) - 60, formulaR = Math.max(...formula.map((a) => a.x)) + 60;
  for (const x of left) {
    expect(x.r, "a name on the left of the formula").toBeLessThanOrEqual(lx + step);
    expect(x.r, "clear of it").toBeLessThan(formulaL);
    expect(x.l).toBeGreaterThanOrEqual(0);
  }
  for (const x of right) {
    expect(x.l, "a name on the right of it").toBeGreaterThanOrEqual(rx - step);
    expect(x.l, "clear of it").toBeGreaterThan(formulaR);
    expect(x.r).toBeLessThanOrEqual(1440);
  }
  // the middle, the aldehyde's room, wide: over half the window
  expect(rx - lx, "room in the middle").toBeGreaterThan(1440 * 0.5);
  // still in the Menu's order down each side
  for (let i = 1; i < 4; i++) {
    expect(mid(left[i]), "down the left in order").toBeGreaterThan(mid(left[i - 1]) + 30);
    expect(mid(right[i]), "down the right in order").toBeGreaterThan(mid(right[i - 1]) + 30);
  }
  // SCATTERED ("slightly haphazardly arranged", and then "it feels too
  // organized ... make it a little less organized"): no side anything like
  // lined up on one edge, no two rows level, the two sides not mirrored, the
  // names down a side nowhere near evenly spaced
  const spread = (xs) => Math.max(...xs) - Math.min(...xs);
  expect(spread(left.map((x) => x.r)), "the left not lined up").toBeGreaterThan(120);
  expect(spread(right.map((x) => x.l)), "nor the right").toBeGreaterThan(120);
  const level = [0, 1, 2, 3].filter((i) => Math.abs(mid(left[i]) - mid(right[i])) < 20);
  expect(level.length, "rows not level across").toBeLessThan(2);
  const gaps = [1, 2, 3].map((i) => mid(left[i]) - mid(left[i - 1]));
  expect(spread(gaps), "not equally spaced").toBeGreaterThan(60);
  // the long one on two lines, in its own words' order
  const long = page.locator(".formula-link").nth(2);
  expect(await long.evaluate((a) => a.textContent.replace(/\s+/g, " ").trim())).toBe("Explorations & Researches");
  expect(await long.evaluate((a) => Math.round(a.getBoundingClientRect().height / parseFloat(getComputedStyle(a).lineHeight))), "on two lines").toBeGreaterThanOrEqual(2);
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

  // 5 — the names, the aldehyde's sillage spreading round them and the aldehydes of perfumery in the gaps
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
   thematic"): where ADAR's dust fell either side, the aldehyde's own scent
   leaves it — specks coming off the edge of its cloud and going out into the
   room on every side, thinning as they spread, reaching out as the last
   stage comes. Read still (motion off), with the names and the aldehydes in
   the gaps out of the picture, so what is counted is the sillage. */
test("the sillage comes up as the last stage comes: the aldehyde's own specks spreading into the room on every side, thinning as they go, and nothing of the drift or the lines left", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 3);
  await settled(page, 3);
  await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot { visibility: hidden !important; }" });
  const room = () => light(page, { x: 8, y: 70, width: 300, height: 780 });
  const none = (await room()).lit;
  expect(none, "no sillage before the last stage").toBeLessThan(6);
  await toStage(page, 3.4);
  await settled(page, 3.4);
  await expect.poll(() => state(page)).toBe("drifting");
  const some = (await room()).lit;
  expect(some, "reaching out").toBeGreaterThan(none);
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page)).toBe("drift");
  expect((await room()).lit, "and there once it is").toBeGreaterThan(Math.max(some, 15));
  // on every side: above the formula and below it, and in all four corners
  // (the aldehydes in the gaps left out of what is counted)
  const avoid = await aldehydes(page, 6);
  for (const [x, y] of [[620, 16], [620, 790], [20, 20], [1220, 20], [20, 730], [1220, 730]]) {
    expect(await litPer(page, [{ x, y, width: 200, height: 94 }], avoid), `specks at ${x},${y}`).toBeGreaterThan(0);
  }
  // thinning as it spreads: more to a pixel just outside the cloud than at the window's edges
  const near = await litPer(page, [{ x: 240, y: 260, width: 110, height: 380 }, { x: 1090, y: 260, width: 110, height: 380 }], avoid);
  const far = await litPer(page, [{ x: 8, y: 260, width: 110, height: 380 }, { x: 1322, y: 260, width: 110, height: 380 }], avoid);
  expect(near, "thicker near the aldehyde").toBeGreaterThan(far);
  expect(far, "and still some at the edge").toBeGreaterThan(0);
  // nothing of the lines, or of ADAR's drift, in the drawing's own code
  const code = fs.readFileSync(path.join(__dirname, "..", "molecule.js"), "utf8");
  for (const gone of ["LINE_VERTEX", "uLineX", "LINE_DENSITY", "lineGeo", "layLines", "DRIFT_DENSITY", "DRIFT_PATCH", "DRIFT_FALL", "aDrift", "layDrift"]) expect(code, gone).not.toContain(gone);
});

/* THE ALDEHYDES OF PERFUMERY, in the gaps (the same round): skeletal
   formulas of the aldehydes a perfumer reaches for, each named, standing in
   whatever room the names and the formula leave. Read still (motion off). */
test("the aldehydes of perfumery stand in the gaps as the last stage comes: named, clear of the names, the formula and each other", async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const KNOWN = ["C-12 MNA", "C-11 undecylenic", "Vanillin", "Cinnamal", "C-10 decanal", "Citral", "Benzaldehyde", "Hydroxycitronellal",
    "C-12 lauric", "Anisaldehyde", "Melonal", "Safranal", "Phenylacetaldehyde", "Cuminaldehyde", "C-9 nonanal", "C-8 octanal"];
  for (const [w, h, least] of [[1440, 900, 12], [1024, 768, 8], [390, 844, 3]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto("/index.html?molecule=full");
    await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
    // (the names and the cursor out of the picture)
    await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot { visibility: hidden !important; }" });
    const placed = await aldehydes(page);
    expect(placed.length, `${w}: as many as find room`).toBeGreaterThanOrEqual(least);
    expect(+(await page.locator("#molecule").getAttribute("data-aldehydes")), "said on the drawing").toBe(placed.length);
    for (const p of placed) expect(KNOWN, p.name).toContain(p.name);
    expect(new Set(placed.map((p) => p.name)).size, "each once").toBe(placed.length);
    const boxes = placed.map((p) => ({ x: Math.round(p.l), y: Math.round(p.t), width: Math.round(p.r - p.l), height: Math.round(p.b - p.t) }));
    // none before the last stage, and drawn once it is
    await toStage(page, 3);
    await settled(page, 3, 2000);
    await page.waitForTimeout(400);
    const before = await litPer(page, boxes);
    await toStage(page, 4);
    await settled(page, 4, 2000);
    await expect.poll(() => state(page), { timeout: 4000 }).toBe("drift");
    await page.waitForTimeout(400);
    expect(before, `${w}: none before the last stage`).toBeLessThan(0.002);
    for (const [i, b] of boxes.entries()) expect(await litPer(page, [b]), `${w}: ${placed[i].name} drawn`).toBeGreaterThan(0.01);
    // clear of every name and its aldehyde group, of the formula, and of each other
    const names = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => {
      const r = a.getBoundingClientRect(), t = a.querySelector(".formula-tail");
      const q = t && getComputedStyle(t).display !== "none" ? t.getBoundingClientRect() : r;
      return { l: Math.min(r.left, q.left), r: Math.max(r.right, q.right), t: Math.min(r.top, q.top), b: Math.max(r.bottom, q.bottom) };
    }));
    const formula = await atoms(page);
    const f = { l: Math.min(...formula.map((a) => a.x)) - 30, r: Math.max(...formula.map((a) => a.x)) + 30,
      t: Math.min(...formula.map((a) => a.y)) - 30, b: Math.max(...formula.map((a) => a.y)) + 30 };
    const meet = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
    placed.forEach((b, i) => {
      expect(b.l, b.name).toBeGreaterThanOrEqual(0);
      expect(b.t, b.name).toBeGreaterThanOrEqual(0);
      expect(b.r, b.name).toBeLessThanOrEqual(w);
      expect(b.b, b.name).toBeLessThanOrEqual(h);
      for (const n of names) expect(meet(b, n), `${w}: ${b.name} clear of the names`).toBe(false);
      expect(meet(b, f), `${w}: ${b.name} clear of the formula`).toBe(false);
      placed.slice(i + 1).forEach((q) => expect(meet(b, q), `${b.name} clear of ${q.name}`).toBe(false));
    });
    // each one's double bond to its O in the aldehyde's gold
    if (w === 1440) {
      const shot = (await page.screenshot()).toString("base64");
      const gold = await page.evaluate(async ({ shot, boxes }) => {
        const img = new Image(); img.src = "data:image/png;base64," + shot; await img.decode();
        const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
        const g = c.getContext("2d"); g.drawImage(img, 0, 0);
        return boxes.map((b) => {
          const d = g.getImageData(b.x, b.y, b.width, b.height).data;
          let n = 0;
          for (let k = 0; k < d.length; k += 4) if (d[k] - d[k + 2] > 30 && d[k + 1] - d[k + 2] > 12) n++;
          return n;
        });
      }, { shot, boxes });
      gold.forEach((n, i) => expect(n, `${placed[i].name}: its C=O gold`).toBeGreaterThan(3));
    }
  }
});

/* EVERY PAGE AN ALDEHYDE (the same round): each of the eight names is the R
   of an aldehyde, R–CHO — a short zig-zag and the C=O after it, towards the
   formula, its double bond gold and its O's lone pair a violet haze, quiet
   with the name and lit with it; the name's own words all the link says. */
test("every name is the R of an aldehyde: a chain and its C=O after it, towards the formula, gold and violet, and lit with it", async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html?auto=off");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("drift");
  const tails = await page.locator(".formula-link").evaluateAll((all) => all.map((a) => {
    const t = a.querySelector(".formula-tail");
    const r = t.getBoundingClientRect(), ar = a.getBoundingClientRect();
    return {
      name: a.textContent.replace(/\s+/g, " ").trim(), want: +a.dataset.chain,
      chain: t.querySelector(".ft-bond").getAttribute("d").split("L").length - 1,
      hidden: t.getAttribute("aria-hidden"), words: t.textContent, o: t.querySelectorAll(".ft-o").length,
      pi: getComputedStyle(t.querySelector(".ft-pi")).stroke,
      l: r.left, r: r.right, mid: (r.top + r.bottom) / 2, al: ar.left, ar: ar.right, at: ar.top, ab: ar.bottom,
    };
  }));
  expect(tails).toHaveLength(8);
  expect(tails.map((x) => x.name)).toEqual(["Scent Descriptions", "Theories", "Explorations & Researches", "Favourites", "Note Library", "Photography", "Search", "Contact"]);
  const formula = await atoms(page);
  const formulaL = Math.min(...formula.map((a) => a.x)), formulaR = Math.max(...formula.map((a) => a.x));
  tails.forEach((x, i) => {
    expect([1, 2, 3], x.name).toContain(x.want);
    expect(x.chain, `${x.name}: as long a chain as it says`).toBe(x.want);
    expect(x.o, `${x.name}: its O`).toBe(1);
    expect(x.hidden).toBe("true");
    expect(x.words, "no words of its own").toBe("");
    expect(x.pi, "its C=O gold").toBe("rgb(217, 173, 84)");
    expect(x.mid, `${x.name}: level with it`).toBeGreaterThan(x.at);
    expect(x.mid).toBeLessThan(x.ab);
    if (i < 4) {
      expect(x.l, `${x.name}: after it, towards the formula`).toBeGreaterThan(x.ar - 30);
      expect(x.r, "and clear of the formula").toBeLessThan(formulaL - 40);
    } else {
      expect(x.r, `${x.name}: before it, towards the formula`).toBeLessThan(x.al + 30);
      expect(x.l, "and clear of the formula").toBeGreaterThan(formulaR + 40);
    }
  });
  expect(new Set(tails.map((x) => x.want)).size, "not all one length").toBeGreaterThan(1);
  // lit with its name: the lone pair's haze comes up round the O
  const lone = () => page.locator(".formula-link").nth(1).locator(".ft-lone").evaluate((e) => +getComputedStyle(e).opacity);
  await page.mouse.move(1380, 60);
  await page.waitForTimeout(1200);
  expect(await lone(), "faint at rest").toBeLessThan(0.4);
  const r = await page.locator(".formula-link").nth(1).boundingBox();
  await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 4 });
  await expect.poll(lone, { timeout: 3000 }).toBeGreaterThan(0.95);
  // on a phone, none: the names stand two by two across a narrow channel
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  expect(await page.locator(".formula-tail").evaluateAll((all) => all.map((t) => getComputedStyle(t).display))).toEqual(Array(8).fill("none"));
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
  // round the hand in the left room — the names, the aldehydes in the gaps,
  // the site's cursor and the δ− kept out of the picture
  await page.addStyleTag({ content: ".formula-link, .cursor-ring, .cursor-dot, .molecule-charge { visibility: hidden !important; }" });
  // (a place in the left room with no aldehyde of the gaps near it)
  const avoid = await aldehydes(page, 70);
  const free = [];
  for (let y = 160; y <= 760; y += 20) for (let x = 90; x <= 300; x += 15) if (!avoid.some((b) => x >= b.l && x <= b.r && y >= b.t && y <= b.b)) free.push({ x, y });
  expect(free.length, "room for the hand").toBeGreaterThan(0);
  const hand = free.reduce((best, p) => (Math.abs(p.y - 450) < Math.abs(best.y - 450) ? p : best));
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

/* ONE SCROLL, ALL THE WAY (2026-10-03, later: "make the scrolling automatic
   as in when you scroll once, it will go all the way down, not it will scroll
   by itself after a second or so"). It played itself once the title had been
   read until then. Now it stands at the title until it is scrolled, and one
   turn of the wheel plays it on through every stage — on its own glide,
   resting at each — to the names; one turn up plays it all the way back. */
test("the page waits at the title until it is scrolled, and one turn of the wheel plays it all the way to the names, resting at each stage; one turn up, all the way back", async ({ page }) => {
  test.setTimeout(150000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  const stage = page.locator("#aldehyde-stage");
  await expect(stage).toHaveAttribute("data-auto", "ready");
  await page.waitForTimeout(6500);
  expect(await stageAt(page), "nothing by itself").toBe(0);
  await page.mouse.move(720, 450);
  // one turn: a run of notches, as a wheel sends them
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(40); }
  await expect(stage).toHaveAttribute("data-auto", "down");
  const play = async (dir) => {
    const seen = new Set();
    const t0 = Date.now();
    while (Date.now() - t0 < 80000 && (await stage.getAttribute("data-auto")) === dir) {
      seen.add((await stageAt(page)).toFixed(2));
      await page.waitForTimeout(250);
    }
    return [...seen];
  };
  const down = await play("down");
  await expect(stage).toHaveAttribute("data-auto", "ready");
  await settled(page, 4, 10000);
  await expect(stage).toHaveAttribute("data-stage", "5");
  expect(down.filter((v) => +v > 0.05 && +v < 3.95 && Math.abs(+v - Math.round(+v)) > 0.05).length, "gliding between stages").toBeGreaterThan(4);
  for (const k of ["1.00", "2.00", "3.00"]) expect(down, `resting at stage ${+k + 1}`).toContain(k);
  // further turns there go nowhere
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(600);
  await expect(stage).toHaveAttribute("data-auto", "ready");
  expect(await stageAt(page)).toBeCloseTo(4, 2);
  // one turn up: all the way back to the title
  await page.mouse.wheel(0, -100);
  await expect(stage).toHaveAttribute("data-auto", "up");
  const up = await play("up");
  await settled(page, 0, 10000);
  await expect(stage).toHaveAttribute("data-stage", "1");
  for (const k of ["3.00", "2.00", "1.00"]) expect(up, `resting at stage ${+k + 1} on the way back`).toContain(k);
});

test("the rest of a turn is the same scroll, and a turn the other way turns it round; the scrollbar lets go", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  const stage = page.locator("#aldehyde-stage");
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 100);
  await expect(stage).toHaveAttribute("data-auto", "down");
  await settled(page, 1, 10000);
  // a trackpad's run-on, or more notches: the same scroll — nothing hurried, nothing turned
  const frames = page.evaluate(() => new Promise((done) => {
    const seen = []; const t0 = performance.now();
    const at = (t) => { seen.push(+window.__formula); if (t - t0 < 1500) requestAnimationFrame(at); else done(seen); };
    requestAnimationFrame(at);
  }));
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 50); await page.waitForTimeout(30); }
  const seen = await frames;
  expect(Math.max(...seen.slice(1).map((v, i) => Math.abs(v - seen[i]))), "never a jump").toBeLessThan(0.1);
  await expect(stage).toHaveAttribute("data-auto", "down");
  await expect.poll(() => stageAt(page), { timeout: 15000 }).toBeGreaterThan(1.5);
  // a turn the other way: back, from where it is, to the title
  const was = await stageAt(page);
  await page.mouse.wheel(0, -120);
  await expect(stage).toHaveAttribute("data-auto", "up");
  await page.waitForTimeout(800);
  expect(await stageAt(page), "turned round").toBeLessThan(was);
  await expect(stage).toHaveAttribute("data-auto", "ready", { timeout: 60000 });
  expect(await stageAt(page)).toBeCloseTo(0, 2);
  // set going again, and the page moved by the scrollbar while it rests: it lets go there
  await page.mouse.wheel(0, 100);
  await settled(page, 1, 10000);
  await page.evaluate(() => { document.getElementById("scroll-container").scrollTop += 140; });
  await expect(stage).toHaveAttribute("data-auto", "ready");
  await page.waitForTimeout(700);   // (the stage catching up with where the page was put)
  const left = await stageAt(page);
  await page.waitForTimeout(3500);
  expect(await stageAt(page), "left where it was put").toBeCloseTo(left, 2);
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

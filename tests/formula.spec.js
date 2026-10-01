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
// The drawing says where it is on itself, `data-state` on #molecule — cloud,
// turning, turned, forming, formula, lining, lined — and landing.js which
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
// Where the two lines stand: on the edges of the grid's middle column (style.css).
const lineXs = (page) => page.evaluate(() => {
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

test("the last stage carries the Menu's eight pages, in its order, four down each side, symmetrical and equally spaced, on the outside of the lines", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
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
  // four down the left, ending on one line; four down the right, beginning on one
  for (const x of left) expect(Math.abs(x.r - left[0].r)).toBeLessThan(1.5);
  for (const x of right) expect(Math.abs(x.l - right[0].l)).toBeLessThan(1.5);
  // mirrored about the middle of the window
  expect(Math.abs(left[0].r + right[0].l - 1440), "symmetrical").toBeLessThan(2);
  // row by row, level with each other (a name on two lines in the middle of
  // its row, as a name on one is), and every row as far from the next
  const mid = (x) => (x.t + x.b) / 2;
  for (let i = 0; i < 4; i++) expect(Math.abs(mid(left[i]) - mid(right[i]))).toBeLessThan(1.5);
  const gaps = [1, 2, 3].map((i) => mid(left[i]) - mid(left[i - 1]));
  for (const g of gaps) expect(Math.abs(g - gaps[0]), "equally spaced").toBeLessThan(1.5);
  expect(gaps[0]).toBeGreaterThan(60);
  expect(Math.abs((mid(left[0]) + mid(left[3])) / 2 - 450), "about the middle up and down").toBeLessThan(6);
  // the long one on two lines, in its own words' order
  const long = page.locator(".formula-link").nth(2);
  expect(await long.evaluate((a) => a.textContent.replace(/\s+/g, " ").trim())).toBe("Explorations & Researches");
  expect(await long.evaluate((a) => Math.round(a.getBoundingClientRect().height / parseFloat(getComputedStyle(a).lineHeight))), "on two lines").toBeGreaterThanOrEqual(2);
  // ON THE OUTSIDE of the two lines: the names between each line and its edge of the window
  const [lx, rx] = await lineXs(page);
  expect(Math.abs(lx + rx - 1440), "the lines mirrored too").toBeLessThan(2);
  for (const x of left) expect(x.r, "a name on the left outside its line").toBeLessThanOrEqual(lx);
  for (const x of right) expect(x.l, "a name on the right outside its line").toBeGreaterThanOrEqual(rx);
  expect(lx - left[0].r, "and near it").toBeLessThan(40);
  // and the middle, the aldehyde's room, wide: over half the window
  expect(rx - lx, "room in the middle").toBeGreaterThan(1440 * 0.5);
});

test("five stages, smoothly: the title, the title gone, the aldehyde upright, its formula, and the names", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
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

  // 5 — the names, beside two lines of specks
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("lined");
  expect(await stageNo()).toBe("5");
  await expect.poll(names, { timeout: 4000 }).toBeGreaterThan(0.99);
  expect(await page.locator(".formula-link").first().evaluate((e) => getComputedStyle(e).pointerEvents), "and take the hand").toBe("auto");
  await page.waitForTimeout(1200);
  const [lx, rx] = await lineXs(page);
  for (const x of [lx, rx]) {
    const on = await light(page, { x: x - 6, y: 30, width: 12, height: 120 });
    const off = await light(page, { x: x + (x < 720 ? -150 : 138), y: 30, width: 12, height: 120 });
    expect(on.lit, `the line at ${Math.round(x)}`).toBeGreaterThan(40);
    expect(off.lit, "and nothing either side of it").toBeLessThan(on.lit / 6);
  }

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
  await page.goto("/index.html");
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
// two stages stays where it stopped.
test("the wheel scrolls it smoothly, as far as it is turned and back, and nothing snaps", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
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
  // stopped part of the way, it stays part of the way
  await page.waitForTimeout(1200);
  expect(await stageAt(page), "nothing snaps").toBeCloseTo(end, 3);
  // and back up
  for (let i = 0; i < 3; i++) { await page.mouse.wheel(0, -100); await page.waitForTimeout(60); }
  await settled(page, 0);
  expect(errors).toEqual([]);
});

test("the lines come down the window from the top as the last stage comes", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 3);
  await settled(page, 3);
  const [lx] = await lineXs(page);
  const strip = (y) => light(page, { x: lx - 6, y, width: 12, height: 110 });
  expect((await strip(40)).lit, "no line before the last stage").toBeLessThan(6);
  await toStage(page, 3.4);
  await settled(page, 3.4);
  await expect.poll(() => state(page)).toBe("lining");
  expect((await strip(40)).lit, "come down from the top").toBeGreaterThan(30);
  expect((await strip(760)).lit, "not yet at the foot").toBeLessThan(6);
  await toStage(page, 4);
  await settled(page, 4);
  await expect.poll(() => state(page)).toBe("lined");
  expect((await strip(760)).lit, "and at the foot once it is there").toBeGreaterThan(30);
});

test("a name is quiet until the hand comes to it: then it comes up gradually to the whole of itself, and the specks of its line are drawn to the hand", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("lined");
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

  const [lx] = await lineXs(page);
  const r = await name.boundingBox();
  // between the end of its letters and its line, up and down beside it
  const between = { x: lx - 28, y: r.y + r.height / 2 - 100, width: 22, height: 200 };
  await page.mouse.move(1380, 60);
  await page.waitForTimeout(1500);
  const before = await light(page, between);
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
  const after = await light(page, between);
  expect(after.lit, "the specks of its line drawn out towards the hand").toBeGreaterThan(before.lit * 1.8 + 15);
  // and the hand gone, quiet again
  await page.mouse.move(1380, 60, { steps: 4 });
  await expect.poll(quiet, { timeout: 3000 }).toBeLessThan(0.45);
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
    veilOn: +getComputedStyle(document.getElementById("formula-ask"), "::before").opacity,
  }));
  expect(look.corner).toBe("rgba(224, 178, 82, 0.9)");
  expect(look.sheet).toMatch(/^rgba\(26, 26, 27/);
  expect(look.veil).toMatch(/blur/);
  expect(look.veilOn, "and it is up").toBeGreaterThan(0);
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
  // to keep moving"): the specks of a line, beside the sheet, one moment and the next
  const [lx] = await lineXs(page);
  const strip = { x: lx - 30, y: 120, width: 60, height: 520 };
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
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await jumpToSlide(page, "slide-formula");
  await settled(page, 4);
  await expect.poll(() => state(page), { timeout: 30000 }).toBe("lined");
  // a name on the right, well clear of its line: above and below its lettering
  const name = page.locator(".formula-link").nth(4);
  const r = await name.boundingBox();
  const pad = await name.evaluate((e) => parseFloat(getComputedStyle(e).paddingTop));
  const above = { x: r.x + r.width / 2 - 40, y: r.y + 1, width: 80, height: pad - 3 };
  await page.mouse.move(1380, 60);
  await page.waitForTimeout(1500);
  const before = await light(page, above);
  await page.mouse.move(r.x + r.width * 0.2, r.y + r.height / 2, { steps: 4 });
  await expect.poll(async () => (await light(page, above)).lit, { timeout: 8000 }).toBeGreaterThan(before.lit + 8);
  await page.mouse.move(1380, 60, { steps: 4 });
  await expect.poll(async () => (await light(page, above)).lit, { timeout: 8000 }).toBeLessThanOrEqual(before.lit + 3);
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
  await expect.poll(() => state(page), { timeout: 4000 }).toBe("lined");
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
  await expect(page.locator(".formula-ask-name")).toHaveText("Scent descriptions");
  expect(errors).toEqual([]);
});

test("on a phone the names stand two above and two below the formula each side, the lines down the channel between, and nothing scrolls sideways", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toStage(page, 4);
  await settled(page, 4, 2000);
  await expect.poll(() => state(page), { timeout: 4000 }).toBe("lined");
  const b = await boxes(page);
  const [O, , H1, H2] = await atoms(page);
  for (const i of [0, 1, 4, 5]) expect(b[i].b, `name ${i + 1} above the formula`).toBeLessThan(O.y - 20);
  for (const i of [2, 3, 6, 7]) expect(b[i].t, `name ${i + 1} below it`).toBeGreaterThan(Math.max(H1.y, H2.y) + 20);
  const [lx, rx] = await lineXs(page);
  expect(Math.abs(lx + rx - 390), "the lines about the middle").toBeLessThan(2);
  for (const i of [0, 1, 2, 3]) expect(b[i].r, "on the outside of the left line").toBeLessThanOrEqual(lx + 0.5);
  for (const i of [4, 5, 6, 7]) expect(b[i].l, "on the outside of the right one").toBeGreaterThanOrEqual(rx - 0.5);
  for (const x of b) { expect(x.l).toBeGreaterThanOrEqual(0); expect(x.r).toBeLessThanOrEqual(390); }
  // the lines above the formula and below it (and broken where it stands)
  expect((await light(page, { x: lx - 5, y: 40, width: 10, height: 60 })).lit, "a line above").toBeGreaterThan(8);
  expect((await light(page, { x: lx - 5, y: 844 - 100, width: 10, height: 60 })).lit, "and below").toBeGreaterThan(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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

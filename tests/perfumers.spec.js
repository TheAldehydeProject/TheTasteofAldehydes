// @ts-check
/* ============================================================
   PERFUMERS — perfumers/index.html and perfumers.js.

   The owner, 2026-11-02, the round after the page went live: "move the
   index down a few, and make it a big button that you can press to open
   the actual index. For the main thing, I want it to turn slowly; and have
   idle animations. this is true for zoomed in. When you click and zoom in,
   i want you to be in a fixed place, where you cannot use the scrollwheel.
   instead of the legend, I want you to add a fixed list of perfumers that
   you can scroll. alphabetical. I want you to make it more navigatable, so
   that when you select something, you select the perfumer then the houses
   appear ... optimize tf out of it. it needs to run smoothly."

   What these keep: the chart turns at rest and is NOT drawn again to do it
   (the browser turns the drawing); close in, it sways the same way; the
   list stands in the legend's place, A to Z; a perfumer chosen shows its
   houses, a house its perfumes, a perfume its window; once something is
   chosen the wheel does nothing; Esc goes back a level at a time; the index
   is one big button, shut until pressed — and a details, so it opens
   without the script too.
   ============================================================ */
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const PAGE = "/perfumers/";
const state = (page) => page.evaluate(() => window.PerfumersChart.state());
const stats = (page) => page.evaluate(() => window.PerfumersChart.stats());
const atRest = (page, view) => expect.poll(async () => (await state(page)).view, { timeout: 12000 }).toBe(view);

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("the chart turns slowly at rest, and is not drawn again to turn", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  const a = await state(page), s0 = await stats(page);
  await page.waitForTimeout(1500);
  const b = await state(page), s1 = await stats(page);
  // it turned …
  expect(b.rot).toBeGreaterThan(a.rot + 0.005);
  // … by the rotor's transform, not by drawing the chart again
  expect(s1.chart).toBe(s0.chart);
  expect(s1.rotor).toBe(s0.rotor);
  const t = await page.locator(".pf-rotor").evaluate((el) => el.style.transform);
  expect(t).toContain("rotate(");
  // and the idle things go on: the live layer is drawn, the lights run
  expect(s1.live).toBeGreaterThan(s0.live + 5);
  expect(errors).toEqual([]);
});

test("with motion reduced, nothing turns and nothing is drawn at rest", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  const a = await state(page), s0 = await stats(page);
  await page.waitForTimeout(1200);
  const b = await state(page), s1 = await stats(page);
  expect(b.rot).toBe(a.rot);
  expect(s1.live).toBe(s0.live);
  await context.close();
});

test("the list of perfumers stands in the legend's place, A to Z, and the legend is at the foot", async ({ page }) => {
  await page.goto(PAGE);
  const nav = page.locator(".pf-stage .pf-nav");
  await expect(nav).toBeVisible();
  const names = await nav.locator(".pf-nav-per .pf-nav-name").allTextContents();
  const data = await page.evaluate(() => window.PERFUMERS_DATA.perfumers.map((p) => ({ id: p.id, name: p.name, sort: p.sort })));
  const expected = data.filter((p) => p.id !== "not-found")
    .sort((x, y) => String(x.sort || x.name).localeCompare(String(y.sort || y.name), "en", { sensitivity: "base" }))
    .map((p) => p.name);
  expect(names.slice(0, -1)).toEqual(expected);
  expect(names[names.length - 1]).toBe("Perfumer not found");
  // the list scrolls in its own box
  expect(await nav.locator(".pf-nav-scroll").evaluate((el) => getComputedStyle(el).overflowY)).toBe("auto");
  // no legend over the stage; it is at the foot
  await expect(page.locator(".pf-stage .pf-legend, .pf-notes .pf-legend")).toHaveCount(0);
  await expect(page.locator(".pf-foot .pf-legend")).toHaveCount(1);
});

test("a perfumer chosen shows its houses, a house its perfumes, a perfume its window", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  // only perfumers in the list at first: no houses, no perfumes
  await expect(page.locator(".pf-nav-house:visible")).toHaveCount(0);
  await page.locator('.pf-nav-item[data-per="aichi-liu"] > .pf-nav-row').click();
  await expect(page.locator(".pf-here-name")).toHaveText("Aichi Liu");
  await expect(page.locator('.pf-nav-item[data-per="aichi-liu"] .pf-nav-house:visible')).toHaveCount(2);
  await expect(page.locator(".pf-nav-perfume:visible")).toHaveCount(0);
  // the chart flies there, settles, and its far parts go out of focus
  await atRest(page, "still");
  expect((await state(page)).zoomed).toBe(true);
  await expect.poll(async () => (await state(page)).dof).toBe(true);

  await page.locator('.pf-nav-hitem[data-house="om-parfums"] > .pf-nav-row').click();
  await expect(page.locator(".pf-here-name")).toHaveText("Om Parfums");
  await expect(page.locator(".pf-nav-perfume:visible")).toHaveCount(9);

  await page.locator(".pf-nav-perfume:visible").first().click();
  await expect(page.locator(".pf-card")).toBeVisible();
  await expect(page.locator(".pf-card .pf-card-kicker")).toContainText("Perfume");
  expect((await state(page)).chosen.kind).toBe("perfume");
  expect(errors).toEqual([]);
});

test("a perfumer pressed on the circle is chosen, and then one of its houses", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  const p = await page.evaluate(() => window.PerfumersChart.pointOf("nicholas-nilsson"));
  await page.mouse.click(p.x, p.y);
  await expect.poll(async () => (await state(page)).chosen.pid).toBe("nicholas-nilsson");
  await atRest(page, "still");
  const h = await page.evaluate(() => window.PerfumersChart.pointOf("nicholas-nilsson", "pineward"));
  await page.mouse.click(h.x, h.y);
  await expect.poll(async () => (await state(page)).chosen.kind).toBe("house");
  expect((await state(page)).chosen.hid).toBe("pineward");
});

test("close in, the chart stays put: the wheel does nothing, and it sways without being drawn again", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "antoine-lie"));
  await atRest(page, "still");
  const a = await state(page);
  await page.mouse.move(600, 450);
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(400);
  const b = await state(page);
  expect(b.cam.z).toBeCloseTo(a.cam.z, 5);
  expect(b.cam.fx).toBeCloseTo(a.cam.fx, 5);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  // the sway is the browser's: a transform, and no drawing of the chart
  const s0 = await stats(page);
  await page.waitForTimeout(1200);
  const s1 = await stats(page);
  expect(s1.chart).toBe(s0.chart);
  expect((await state(page)).sway).toBeGreaterThan(0);
  expect(await page.locator(".pf-sway").evaluate((el) => el.style.transform)).toContain("matrix(");
});

test("Esc goes back a level at a time, and The whole chart all the way", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("house", "prin-lomros", "strangers-parfumerie"));
  await page.keyboard.press("Escape");
  expect((await state(page)).chosen.kind).toBe("perfumer");
  await page.keyboard.press("Escape");
  expect((await state(page)).chosen.kind).toBe(null);
  await page.evaluate(() => window.PerfumersChart.choose("house", "prin-lomros", "prin"));
  await page.locator(".pf-back").click();
  expect((await state(page)).chosen.kind).toBe(null);
  await atRest(page, "turn");
  // and with nothing chosen the page scrolls as ever
  await page.mouse.move(600, 450);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("by year, a year is chosen on the circle and a perfumer in the list", async ({ page }) => {
  await page.goto(PAGE);
  await page.locator('.pf-sort-button[data-sort="year"]').click();
  await atRest(page, "turn");
  expect((await state(page)).mode).toBe("year");
  const p = await page.evaluate(() => window.PerfumersChart.pointOf(2021));
  await page.mouse.click(p.x, p.y);
  await expect.poll(async () => (await state(page)).chosen.year).toBe(2021);
  await expect(page.locator(".pf-here-name")).toHaveText("2021");
  await page.locator('.pf-nav-item[data-per="aichi-liu"] > .pf-nav-row').click();
  expect((await state(page)).chosen.pid).toBe("aichi-liu");
  await page.evaluate(() => localStorage.removeItem("pf-sort"));
});

test("the index is one big button, shut until it is pressed", async ({ page }) => {
  await page.goto(PAGE);
  const index = page.locator(".pf-index");
  await expect(index).not.toHaveAttribute("open", "");
  await expect(page.locator(".pf-index-word")).toHaveText("Index");
  await expect(page.locator(".pf-entry").first()).toBeHidden();
  await page.locator(".pf-index-open").click();
  await expect(index).toHaveAttribute("open", "");
  await expect(page.locator(".pf-entry").first()).toBeVisible();
  const perfumers = await page.evaluate(() => window.PERFUMERS_DATA.perfumers.length);
  await expect(page.locator(".pf-entry")).toHaveCount(perfumers);
  // it stands a way down from the chart
  const gap = await page.evaluate(() => document.querySelector(".pf-index").getBoundingClientRect().top -
    document.querySelector(".pf-foot").getBoundingClientRect().top);
  expect(gap).toBeGreaterThan(80);
  await page.locator(".pf-index-open").click();
  await expect(index).not.toHaveAttribute("open", "");
});

test("without the script the index still opens, and the list is not there to be broken", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(PAGE);
  await expect(page.locator(".pf-nav")).toBeHidden();
  await page.locator(".pf-index-open").click();
  await expect(page.locator(".pf-entry").first()).toBeVisible();
  await context.close();
});

test("an address into the index opens it", async ({ page }) => {
  await page.goto(PAGE + "#perfumer-josh-lobb");
  await expect(page.locator(".pf-index")).toHaveAttribute("open", "");
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("the list is a drawer at the foot, and a perfumer chosen in it is looked at above it", async ({ page }) => {
    await page.goto(PAGE);
    await atRest(page, "turn");
    const nav = page.locator(".pf-nav");
    const shut = await nav.boundingBox();
    expect(shut.y).toBeGreaterThan(844 - 80);
    await page.locator(".pf-nav-toggle").tap();
    await expect(nav).toHaveClass(/is-open/);
    await expect.poll(async () => (await nav.boundingBox()).y).toBeLessThan(844 * 0.6);
    await page.locator('.pf-nav-item[data-per="goran-bajazetov"] > .pf-nav-row').tap();
    await expect(page.locator(".pf-here-name")).toHaveText("Goran Bajazetov");
    await atRest(page, "still");
    expect((await state(page)).cam.cy).toBeLessThan(0.4);
    await expect(page.locator(".pf-nav-path")).toHaveText("Goran Bajazetov");
  });
});

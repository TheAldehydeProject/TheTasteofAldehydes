// @ts-check
/* ============================================================
   THE RADIAL POSTER — test-pages/1/ since 2026-11-10 (it was the Perfumers
   page, perfumers/index.html and perfumers.js, from 2026-11-02 until the
   owner swapped it with test page 1: "also replace perfumers apge with test
   page 1, and vice versa"). Its script is test-pages/1/page.js now, with a
   copy of the ledger in it, and close in it stands on THE PLANE (2026-11-10
   — "It does not work smoothly, especially when you open up prin lomoros and
   scroll. it is also low quality").

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

const PAGE = "/test-pages/1/";
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

test("the list of perfumers stands in the legend's place, A to Z, and the legend is under the chart", async ({ page }) => {
  await page.goto(PAGE);
  const nav = page.locator(".pf-stage .pf-nav");
  await expect(nav).toBeVisible();
  const names = await nav.locator(".pf-nav-per .pf-nav-name").allTextContents();
  const data = await page.evaluate(() => window.PerfumersChart.data().perfumers.map((p) => ({ id: p.id, name: p.name, sort: p.sort })));
  const expected = data.filter((p) => p.id !== "not-found")
    .sort((x, y) => String(x.sort || x.name).localeCompare(String(y.sort || y.name), "en", { sensitivity: "base" }))
    .map((p) => p.name);
  expect(names.slice(0, -1)).toEqual(expected);
  // (named "Not publicly available" since 2026-11-08, at the owner's word)
  expect(names[names.length - 1]).toBe("Not publicly available");
  // the list scrolls in its own box
  expect(await nav.locator(".pf-nav-scroll").evaluate((el) => getComputedStyle(el).overflowY)).toBe("auto");
  // no legend over the stage; it is under the chart, beside the intro
  // (2026-11-07 — "below the main perfumers thing (the planet) ... Intro,
  // legend, terms and disclaimer, below that the index and below that the credits")
  await expect(page.locator(".pf-stage .pf-legend")).toHaveCount(0);
  await expect(page.locator(".pf-notes .pf-legend")).toHaveCount(1);
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
  await expect(page.locator(".pf-call")).toBeVisible();
  await expect(page.locator(".pf-card")).toBeHidden();
  expect((await state(page)).chosen.kind).toBe("perfume");
  expect(errors).toEqual([]);
});

/* 2026-11-03 — "make the zooming consistent; such that it zooms once a user
   selects a house or perfumer. Also let the popup window be animated with
   the chart, and the animation would start from the perspective provided in
   image 1; such that the specific perfume being viewed would be highlighted,
   then the popup would appear. Please make the popups simple; perfumer,
   perfume, year, and source." */
test("every choice zooms — a perfumer too wide to frame whole as well", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "prin-lomros"));
  await atRest(page, "still");
  expect((await state(page)).zoomed).toBe(true);
  await page.evaluate(() => window.PerfumersChart.choose(null));
  await page.locator('.pf-sort-button[data-sort="year"]').click();
  await atRest(page, "turn");
  await page.locator('.pf-nav-item[data-per="nicholas-nilsson"] > .pf-nav-row').click();
  await atRest(page, "still");
  expect((await state(page)).zoomed).toBe(true);
  await page.evaluate(() => localStorage.removeItem("pf-sort"));
});

test("a perfume is lit where its house is seen, and then its small window comes out of its dot", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("house", "aichi-liu", "om-parfums"));
  await atRest(page, "still");
  const house = (await state(page)).cam;
  await page.locator('.pf-nav-perfume:visible:has-text("Dark Night of the Soul")').click();
  // lit first: chosen, and no window yet
  expect((await state(page)).chosen.e).toBe("Dark Night of the Soul");
  expect((await state(page)).call).toBe(null);
  await expect(page.locator(".pf-call")).toBeHidden();
  // then the window, beside its dot, the chart where the house was seen
  await expect.poll(async () => (await state(page)).call, { timeout: 6000 }).toBe("Dark Night of the Soul");
  await atRest(page, "still");
  const cam = (await state(page)).cam;
  expect(cam.z).toBeCloseTo(house.z, 3);
  expect(cam.tilt).toBeCloseTo(house.tilt, 3);
  const call = page.locator(".pf-call");
  await expect(call).toBeVisible();
  await expect(page.locator(".pf-card")).toBeHidden();
  // simple: the perfumer, the perfume, the year and the source, and no more
  await expect(call.locator("dt")).toHaveText(["Perfumer", "Perfume", "Year", "Sources"]);
  await expect(call.locator(".pf-call-name")).toContainText("Dark Night of the Soul");
  await expect(call.locator("dd").nth(2)).toHaveText("2024");
  await expect(call.locator(".pf-call-sources a").first()).toHaveAttribute("href", /^https:/);
  await page.waitForTimeout(900);
  const dot = await page.evaluate(() => window.PerfumersChart.dotOf("Dark Night of the Soul"));
  const box = await page.locator(".pf-call-sheet").boundingBox();
  const near = Math.hypot(Math.max(box.x - dot.x, 0, dot.x - box.x - box.width), Math.max(box.y - dot.y, 0, dot.y - box.y - box.height));
  expect(near).toBeGreaterThan(8);
  expect(near).toBeLessThan(140);
  expect(dot.x).toBeGreaterThan(0);
  expect(dot.y).toBeGreaterThan(0);
  // Esc puts it away and goes back to the house, where it was
  await page.keyboard.press("Escape");
  expect((await state(page)).chosen.kind).toBe("house");
  await expect(call).toBeHidden();
  expect(errors).toEqual([]);
});

test("a perfume's window is put away by its close, another perfume, or a press elsewhere on the chart", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("house", "aichi-liu", "om-parfums"));
  await page.locator('.pf-nav-perfume:visible:has-text("Burnana")').click();
  await expect.poll(async () => (await state(page)).call, { timeout: 6000 }).toBe("Burnana");
  await page.locator(".pf-call-close").click();
  expect((await state(page)).chosen.kind).toBe("house");
  await page.locator('.pf-nav-perfume:visible:has-text("Lust")').click();
  await expect.poll(async () => (await state(page)).call, { timeout: 6000 }).toBe("Lust");
  await page.locator('.pf-nav-perfume:visible:has-text("Burnana")').click();
  expect((await state(page)).call).toBe(null);
  await expect.poll(async () => (await state(page)).call, { timeout: 6000 }).toBe("Burnana");
  await page.mouse.click(700, 120);
  await expect.poll(async () => (await state(page)).call).toBe(null);
  await expect(page.locator(".pf-call")).toBeHidden();
  expect((await state(page)).chosen.e).not.toBe("Burnana");
});

test("a perfumer's window is a plain table, and a perfume in it is shown on the chart", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "aichi-liu"));
  await page.locator(".pf-here-about").click();
  const card = page.locator(".pf-card");
  await expect(card).toBeVisible();
  await expect(card.locator(".pf-card-table th")).toHaveText(["Perfume", "House", "Year"]);
  await expect(card.locator(".pf-card-row")).toHaveCount(14);
  await card.locator('.pf-card-row:has-text("Lust")').click();
  await expect(card).toBeHidden();
  expect((await state(page)).chosen.e).toBe("Lust");
  await expect.poll(async () => (await state(page)).call, { timeout: 6000 }).toBe("Lust");
});

test("the list has a search at its top right: a perfumer, a house or a perfume", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  const find = page.locator(".pf-nav-find");
  const head = await page.locator(".pf-nav-head").boundingBox();
  const fb = await find.boundingBox();
  // at the right of the head, beside the fold (2026-11-07)
  expect(fb.x + fb.width).toBeGreaterThan(head.x + head.width - 44);
  expect(fb.x).toBeGreaterThan(head.x + head.width / 2);
  await find.click();
  const q = page.locator(".pf-nav-query");
  await expect(q).toBeFocused();
  await q.fill("nilss");
  await expect(page.locator(".pf-nav-hit").first()).toContainText("Nicholas Nilsson");
  await expect(page.locator(".pf-nav-list")).toBeHidden();
  await q.fill("om parf");
  await expect(page.locator(".pf-nav-hit-house").first()).toContainText("Om Parfums");
  await q.fill("burnan");
  await q.press("Enter");
  expect((await state(page)).chosen.e).toBe("Burnana");
  await expect(page.locator(".pf-nav-search")).toBeHidden();
  await expect(page.locator(".pf-nav-list")).toBeVisible();
  await expect.poll(async () => (await state(page)).call, { timeout: 6000 }).toBe("Burnana");
  // Esc in the field shuts the search and nothing else
  await find.click();
  await q.fill("zzzz");
  await expect(page.locator(".pf-nav-none")).toBeVisible();
  await q.press("Escape");
  await expect(page.locator(".pf-nav-search")).toBeHidden();
  expect((await state(page)).chosen.e).toBe("Burnana");
});

test("the legend, the terms and the disclaimer are shut dropdowns under the chart, the title's asterisk opening the disclaimer", async ({ page }) => {
  await page.goto(PAGE);
  for (const sel of [".pf-legend-box", ".pf-terms", ".pf-disclaimer"]) {
    const d = page.locator(sel);
    await expect(d).toHaveJSProperty("tagName", "DETAILS");
    expect(await d.evaluate((el) => el.open)).toBe(false);
    expect(await d.evaluate((el) => !!el.closest(".pf-notes"))).toBe(true);
  }
  await expect(page.locator(".pf-notes-left")).not.toContainText("Disclaimer");
  await expect(page.locator(".pf-counts")).toContainText("written about on The Taste of Aldehydes");
  await page.locator(".pf-terms summary").click();
  expect(await page.locator(".pf-terms").evaluate((el) => el.open)).toBe(true);
  await page.locator(".pf-star").click();
  await expect.poll(() => page.locator(".pf-disclaimer").evaluate((el) => el.open)).toBe(true);
  await expect(page.locator(".pf-disclaimer .pf-drop-body")).toBeInViewport();
});

test("while the chart flies it is drawn at a lower resolution, and sharp once it lands", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2 });
  await serveDependenciesLocally(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "nicholas-nilsson"));
  await expect.poll(async () => (await state(page)).flying).toBe(true);
  await expect(page.locator(".pf-fly")).toBeVisible();
  await atRest(page, "still");
  expect((await state(page)).flying).toBe(false);
  // sharp once it lands: the chart itself, or its plane
  await expect.poll(() => page.evaluate(() => window.PerfumersChart.plane().on || getComputedStyle(document.querySelector(".pf-chart")).visibility === "visible")).toBe(true);
  await expect(page.locator(".pf-fly")).toBeHidden();
  await page.close();
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

/* 2026-11-06 — "the zoom length should be fixed, and the scrolling while
   hovering on the image will cause you to scroll through the perfumes of
   that house/perfumer. This is especially important for big perfumers like
   prin lomoros." The wheel no longer does nothing close in: it goes through
   the perfumes of what is chosen, the zoom staying as it is and the page
   held still under it; and once it has settled, the chart sways without
   being drawn again. */
test("close in, the zoom is fixed, and the wheel goes through the perfumes of what is chosen", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "prin-lomros"));
  await atRest(page, "still");
  const a = await state(page);
  expect(a.count).toBe(139);
  await page.mouse.move(600, 450);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, 120);
  await atRest(page, "still");
  const b = await state(page);
  // it went on through Prin Lomros' perfumes, as close as before
  expect(b.scroll).toBeGreaterThan(a.scroll + 8);
  expect(b.at).not.toBe(a.at);
  expect(b.cam.z).toBeCloseTo(a.cam.z, 5);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  // the scrubber says which perfumes are in the window — a span, no one
  // perfume of it singled out (2026-11-11 — "when you scroll in the detailed
  // view, you have a highlighting function where one of the perfumes is
  // highlighted. it shouldnt be, it should just be a scrolling of the disc")
  await expect(page.locator(".pf-scrub")).toBeVisible();
  await expect(page.locator(".pf-scrub-at b")).toHaveText(/^\d{3}–\d{3}$/);
  await expect(page.locator(".pf-scrub-at span")).toHaveText("of 139");
  expect(await page.locator(".pf-scrub-at span").textContent()).not.toBe(b.at);
  // the keys do the same, and End goes to its last perfume
  await page.keyboard.press("End");
  await expect.poll(async () => (await state(page)).scroll).toBe(138);
  // a perfumer of four is looked at from exactly as close
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "antoine-lie"));
  await atRest(page, "still");
  expect((await state(page)).cam.z).toBeCloseTo(a.cam.z, 5);
  // the sway is the browser's: a transform, and no drawing of the chart
  // (a moment first, for a slow machine's sharpness to settle after the
  // long way to the End)
  await page.waitForTimeout(1500);
  await atRest(page, "still");
  const s0 = await stats(page);
  await page.waitForTimeout(1200);
  const s1 = await stats(page);
  expect(s1.chart).toBe(s0.chart);
  expect((await state(page)).sway).toBeGreaterThan(0);
  expect(await page.locator(".pf-sway").evaluate((el) => el.style.transform)).toContain("matrix(");
});

/* The Earth (2026-11-06 — "It should look like the earth, with then three
   layers of information in series protruding from it ... like an
   architect's sketch of the earth"): drawn from its coastlines, turning on
   its own on the whole chart without the rings being drawn again, and
   turned to the country of what is chosen. */
test("the Earth is drawn in the middle, turns on its own, and turns to what is chosen", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  const e0 = await page.evaluate(() => window.PerfumersChart.earth());
  expect(e0.rings).toBeGreaterThan(50);
  expect(e0.pins).toContain("Thailand");
  expect(e0.lit).toEqual([]);
  const s0 = await stats(page);
  await page.waitForTimeout(1500);
  const e1 = await page.evaluate(() => window.PerfumersChart.earth()), s1 = await stats(page);
  // it turned, and its picture was drawn again for it, but not the rings
  expect(e1.spin).toBeGreaterThan(e0.spin);
  expect(s1.earth).toBeGreaterThan(s0.earth);
  expect(s1.rotor).toBe(s0.rotor);
  // Prin Lomros: Thailand lit, and the Earth turned to it (101° E)
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "prin-lomros"));
  await atRest(page, "still");
  const e2 = await page.evaluate(() => window.PerfumersChart.earth());
  expect(e2.lit).toEqual(["Thailand"]);
  const toward = ((e2.spin * 180 / Math.PI) % 360 + 360) % 360;
  expect(Math.abs(toward - 101)).toBeLessThan(12);
  // and close in it stands still
  await page.waitForTimeout(800);
  expect((await page.evaluate(() => window.PerfumersChart.earth())).spin).toBe(e2.spin);
  expect(errors).toEqual([]);
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
  await expect(page.locator(".pf-index .pf-index-word")).toHaveText("Index");
  await expect(page.locator(".pf-entry").first()).toBeHidden();
  await page.locator(".pf-index .pf-index-open").click();
  await expect(index).toHaveAttribute("open", "");
  await expect(page.locator(".pf-entry").first()).toBeVisible();
  const perfumers = await page.evaluate(() => window.PerfumersChart.data().perfumers.length);
  await expect(page.locator(".pf-entry")).toHaveCount(perfumers);
  // it stands a way down from the chart: under the intro, the legend, the
  // terms and the disclaimer, and over the sources (2026-11-07)
  const at = await page.evaluate(() => ["pf-stage", "pf-notes", "pf-index", "pf-sources"].map((c) => document.querySelector("." + c).getBoundingClientRect().top + scrollY));
  expect(at[1]).toBeGreaterThan(at[0]);
  expect(at[2]).toBeGreaterThan(at[1] + 80);
  expect(at[3]).toBeGreaterThan(at[2]);
  await page.locator(".pf-index .pf-index-open").click();
  await expect(index).not.toHaveAttribute("open", "");
});

test("without the script the index still opens, and the list is not there to be broken", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(PAGE);
  await expect(page.locator(".pf-nav")).toBeHidden();
  await page.locator(".pf-index .pf-index-open").click();
  await expect(page.locator(".pf-entry").first()).toBeVisible();
  await context.close();
});

test("an address into the index opens it", async ({ page }) => {
  await page.goto(PAGE + "#perfumer-josh-lobb");
  await expect(page.locator(".pf-index")).toHaveAttribute("open", "");
});

/* THE SOURCES BEHIND A BUTTON OF THEIR OWN — the owner, 2026-11-03: "make
   the perfumers page sources also collapsible". The index's button a size
   down: shut until pressed, every source in it, an address into it opens
   it, and without the script it still opens. */
test("the sources are behind a button of their own, shut until it is pressed", async ({ page }) => {
  await page.goto(PAGE);
  const sources = page.locator(".pf-sources");
  await expect(sources).not.toHaveAttribute("open", "");
  await expect(page.locator(".pf-sources .pf-index-word")).toHaveText("Sources");
  await expect(page.locator(".pf-source-list li").first()).toBeHidden();
  const n = await page.evaluate(() => window.PerfumersChart.data().sources.length);
  await expect(page.locator("[data-source-count]")).toHaveText(n + " sources");
  await page.locator(".pf-sources .pf-index-open").click();
  await expect(sources).toHaveAttribute("open", "");
  await expect(page.locator(".pf-source-list li").first()).toBeVisible();
  await expect(page.locator(".pf-source-list li")).toHaveCount(n);
  await page.locator(".pf-sources .pf-index-open").click();
  await expect(sources).not.toHaveAttribute("open", "");
  // the index is not opened with it, nor it with the index
  await expect(page.locator(".pf-index")).not.toHaveAttribute("open", "");
});

test("an address into the sources opens them, and without the script they still open", async ({ page, browser }) => {
  await page.goto(PAGE + "#source-s05");
  await expect(page.locator(".pf-sources")).toHaveAttribute("open", "");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const bare = await context.newPage();
  await serveDependenciesLocally(bare);
  await bare.goto(PAGE);
  await bare.locator(".pf-sources .pf-index-open").click();
  await expect(bare.locator(".pf-source-list li").first()).toBeVisible();
  await context.close();
});

/* THE PLANE, close in (2026-11-10 — "please do eveyrthing you can to optimize
   the page of perfumers. It does not work smoothly, especially when you open
   up prin lomoros and scroll. it is also low quality. fix that. i dont want
   me to repeat this later"): settled close in, the chart is tiles of its own
   plane laid down tipped and turned by the browser; going through Prin
   Lomros' perfumes draws nothing of the chart again, at the screen's own
   sharpness. ?plane=off draws it as it was. */
test("close in, the chart stands on its plane, and the wheel through Prin Lomros draws nothing of it again", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "prin-lomros"));
  await expect.poll(() => page.evaluate(() => window.PerfumersChart.plane().on), { timeout: 12000 }).toBe(true);
  await expect(page.locator(".pf-stage")).toHaveClass(/is-plane/);
  await expect(page.locator(".pf-chart")).toBeHidden();
  const p = await page.evaluate(() => window.PerfumersChart.plane());
  expect(p.shown, "tiles laid down").toBeGreaterThan(8);
  const t = await page.locator(".pf-plane canvas:not([hidden])").first().evaluate((el) => el.style.transform);
  expect(t).toContain("perspective(");
  expect(t).toContain("rotateX(");
  // the wheel: the chart turns under the camera, and none of it is drawn again
  await page.mouse.move(600, 450);
  const s0 = await stats(page);
  for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 90); await page.waitForTimeout(60); }
  await page.waitForTimeout(600);
  const s1 = await stats(page);
  expect(s1.chart, "the chart not drawn again").toBe(s0.chart);
  expect(s1.plane, "laid down every frame instead").toBeGreaterThan(s0.plane + 10);
  expect((await state(page)).scroll).toBeGreaterThan(4);
  expect(errors).toEqual([]);
});

test("the way back is where the Menu stood, and the page links nowhere else", async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.locator(".tp-back")).toBeVisible();
  await expect(page.locator(".tp-back")).toHaveAttribute("href", "../../contact/");
  await expect(page.locator(".menu-trigger")).toHaveCount(0);
  // the asterisk is a button, and still opens the disclaimer
  await expect(page.locator(".pf-star")).toHaveJSProperty("tagName", "BUTTON");
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

// 2026-11-07 — "make sure that it extends a little more down": the stage a
// little taller than the window on a wide one, the chart sized by the window
// and centred in the stage, so its circle is whole
test("the stage stands a little taller than the window, the whole circle in it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE);
  await atRest(page, "turn");
  const st = await page.evaluate(() => {
    const b = document.querySelector(".pf-stage").getBoundingClientRect();
    return { h: b.height, chart: PerfumersChart.state().cam };
  });
  expect(st.h).toBeGreaterThan(900);
  expect(st.h).toBeLessThan(900 * 1.4);
  // the chart's middle stands in the middle of the stage, not of the window
  expect(Math.abs(st.chart.cy * st.h - st.h / 2)).toBeLessThan(4);
  // on a phone the stage is the window
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  const ph = await page.evaluate(() => document.querySelector(".pf-stage").getBoundingClientRect().height);
  expect(ph).toBeLessThanOrEqual(844 + 1);
});

// 2026-11-07 — "remove the crosshairs in the cardinal directions, and the
// cross going through the center of the world"
test("no cross through the Earth and no cross-hairs at the chart's edges", async () => {
  const fs = require("fs");
  const src = fs.readFileSync(require("path").join(__dirname, "..", "test-pages", "1", "page.js"), "utf8");
  expect(src).not.toMatch(/function drawCross/);
  expect(src).not.toMatch(/drawCross\(/);
});

// 2026-11-07 — "the table on the right should be collapsible": the list and
// its search fold away together, the chart moving over into the room
test("the list and its search fold away together, and the chart takes the room", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE);
  await page.evaluate(() => { try { localStorage.removeItem("pf-nav-folded"); } catch (e) {} });
  await page.reload();
  await atRest(page, "turn");
  const fold = page.locator(".pf-nav-fold");
  await expect(fold).toBeVisible();
  await expect(fold).toHaveAttribute("aria-expanded", "true");
  const cx0 = await page.evaluate(() => PerfumersChart.state().cam.cx);
  await page.locator(".pf-nav-find").click();
  await expect(page.locator(".pf-nav-query")).toBeVisible();
  await fold.click();
  await expect(fold).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator(".pf-nav-scroll")).toBeHidden();
  await expect(page.locator(".pf-nav-query")).toBeHidden();
  await expect(page.locator(".pf-nav-find")).toBeHidden();
  await expect(page.locator(".pf-nav-title")).toBeVisible();
  await page.waitForTimeout(2500);
  const cx1 = await page.evaluate(() => PerfumersChart.state().cam.cx);
  expect(cx1).toBeGreaterThan(cx0 + 0.02);
  // kept for the next visit
  await page.reload();
  await expect(page.locator(".pf-nav")).toHaveClass(/is-folded/);
  await page.locator(".pf-nav-fold").click();
  await expect(page.locator(".pf-nav-scroll")).toBeVisible();
  await page.evaluate(() => { try { localStorage.removeItem("pf-nav-folded"); } catch (e) {} });
});

// 2026-11-07 — "optimize this page as much as you can": the names on the
// rings at rest are the rotor's own picture, drawn a few times a second, not
// every frame; and the page draws about thirty frames a second at rest
test("at rest the names are drawn a few times a second, and the live layer about thirty", async ({ page }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  await page.mouse.move(5, 880);
  await page.waitForTimeout(1200);
  const a = await page.evaluate(() => PerfumersChart.stats());
  await page.waitForTimeout(2000);
  const b = await page.evaluate(() => PerfumersChart.stats());
  const names = (b.names - a.names) / 2, live = (b.live - a.live) / 2;
  expect(names).toBeGreaterThan(0);
  expect(names).toBeLessThan(15);
  expect(live).toBeLessThan(40);
  expect(live).toBeGreaterThan(5);
});


// 2026-11-08 — "make the actual perfumers page more thematic, make the index
// button smaller, and the sources too, and again, make it less laggy, and
// more HD" (the theme the owner chose: perfume and aldehydes): the house
// perfumes in the aldehyde's violet, the individual ones in its gold; the
// sillage rising off the houses' countries; the two buttons at the foot a
// size or two down; and on a sharp screen the live layer at its sharpness at
// rest, the flights at three quarters of it, not a plain screen's pixel.
// (Since 2026-11-11 the colours are the night atlas's — brass and verdigris,
// the aldehyde's gold and violet behind ?colours=was — and the lines from
// the countries are back in the sillage's place: "return the lines that
// connect the perfumers to the countries, instead of the particles. that was
// better".)
test("the night atlas's colours, the lines from the countries, the buttons smaller, and the layers drawn sharp", async ({ page, browser }) => {
  await page.goto(PAGE);
  await atRest(page, "turn");
  const tones = () => page.evaluate(() => { const s = getComputedStyle(document.body); return [s.getPropertyValue("--pf-gold").trim(), s.getPropertyValue("--pf-blue").trim()]; });
  expect(await tones()).toEqual(["rgb(228, 186, 106)", "rgb(120, 196, 176)"]);
  await page.mouse.move(5, 880);
  await expect.poll(() => stats(page).then((s) => s.fans || 0), { timeout: 8000 }).toBeGreaterThan(50);
  expect((await stats(page)).sill, "no sillage").toBeUndefined();
  const sizes = await page.evaluate(() => [".pf-index .pf-index-word", ".pf-sources .pf-index-word"].map((s) => parseFloat(getComputedStyle(document.querySelector(s)).fontSize)));
  expect(sizes[0], "the index's word").toBeLessThanOrEqual(36);
  expect(sizes[1], "the sources' word").toBeLessThanOrEqual(26);
  expect(sizes[1]).toBeLessThan(sizes[0]);
  // a sharp screen: the live layer at its own sharpness at rest
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const p2 = await ctx.newPage();
  await serveDependenciesLocally(p2);
  await p2.goto(PAGE);
  await atRest(p2, "turn");
  await p2.mouse.move(5, 780);
  await p2.waitForTimeout(2200);
  const k = await p2.evaluate(() => { const c = document.querySelector(".pf-live"); return c.width / innerWidth; });
  expect(k, "the live layer at the screen's sharpness at rest").toBeGreaterThan(1.4);
  await ctx.close();
});

/* 2026-11-11 — "please also change the font top left ... improve the button
   on the bottom that says return ... rework every part of this page that is
   not on theme ... play with the colour scheme": the title in a Didone, the
   colours the night atlas's (the old ones at ?colours=was), and Return the
   chart drawn small, its word, where it goes and Esc — still going all the
   way back. */
test("the title in the Didone, the old colours at ?colours=was, and Return", async ({ page }) => {
  await page.goto(PAGE + "?colours=was");
  await atRest(page, "turn");
  const was = await page.evaluate(() => { const s = getComputedStyle(document.body); return [s.getPropertyValue("--pf-gold").trim(), s.getPropertyValue("--pf-blue").trim()]; });
  expect(was).toEqual(["rgb(224, 178, 82)", "rgb(185, 160, 232)"]);
  const font = await page.locator(".pf-title-word").evaluate((el) => getComputedStyle(el).fontFamily);
  expect(font).toContain("Bodoni Moda");
  await page.evaluate(() => window.PerfumersChart.choose("perfumer", "aichi-liu"));
  await atRest(page, "still");
  const back = page.locator(".pf-back");
  await expect(back).toBeVisible();
  await expect(back).toHaveAccessibleName(/Return to the whole chart/);
  await expect(back.locator("svg.pf-back-mark")).toHaveCount(1);
  // above the hint, and neither stretched down the stage
  const [b, h] = await Promise.all([back.boundingBox(), page.locator(".pf-hint").boundingBox()]);
  expect(b.height).toBeLessThan(70);
  expect(h.height).toBeLessThan(40);
  expect(h.y + h.height).toBeLessThanOrEqual(b.y + 1);
  await back.click();
  await expect.poll(async () => (await state(page)).chosen.kind).toBeNull();
});

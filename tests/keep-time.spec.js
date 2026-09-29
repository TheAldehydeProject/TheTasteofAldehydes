// @ts-check
// THE PAGE KEEPS ITS OWN TIME (nav.js), 2026-09-28: "please make the
// animations in RE and in the test site clusters animate even when you
// click off of the page. as a matter of fact do that with all animations
// on the page please."
//
// A browser holds animation frames back from a page it thinks is not being
// looked at. nav.js — loaded first on every page — stands in for it: while
// the window is not the one in front, or the page is hidden, every frame
// asked for is also promised by a timer, and whichever comes first draws
// it. In front and looked at, nothing is different. See the page shell's
// report.
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/** Clicked off, as badly as a browser can: the window not the one in
    front, and no frames given by the browser at all. */
const clickedOff = (page) => page.addInitScript(() => {
  document.hasFocus = () => false;
  window.requestAnimationFrame = () => 0;
  window.cancelAnimationFrame = () => {};
});

/** A few thousand pixels of a canvas, as a fingerprint. */
const print = (page, sel) => page.evaluate((sel) => {
  const c = document.querySelector(sel);
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let sum = 0;
  for (let i = 3; i < d.length; i += 97) sum += d[i] * ((i % 13) + 1);
  return sum;
}, sel);

test("clicked off, Explorations & Researches' field keeps moving", async ({ page }) => {
  const errors = collectPageErrors(page);
  await clickedOff(page);
  await page.goto("/categories/researches.html");
  await expect(page.locator(".re-field")).toHaveClass(/is-drawn/);
  await expect.poll(() => page.evaluate(() => window.KeepTime.frames), { timeout: 5000 }).toBeGreaterThan(5);
  const a = await print(page, ".re-canvas");
  await page.waitForTimeout(1200);
  const b = await print(page, ".re-canvas");
  expect(b, "the field drawn again, and moved").not.toBe(a);
  expect(errors).toEqual([]);
});

test("clicked off, the Note Library's network keeps turning", async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await clickedOff(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/categories/note-library.html");
  await expect(page.locator(".net-stage")).toHaveClass(/is-drawn/, { timeout: 30000 });
  await expect.poll(() => page.evaluate(() => window.KeepTime.frames), { timeout: 10000 }).toBeGreaterThan(5);
  const p1 = await page.evaluate(() => window.NetScene.note("Vanilla"));
  await page.waitForTimeout(2500);
  const p2 = await page.evaluate(() => window.NetScene.note("Vanilla"));
  expect(Math.hypot(p2.x - p1.x, p2.y - p1.y), "turned").toBeGreaterThan(0.5);
  expect(errors).toEqual([]);
});

test("clicked off, a house's ground keeps moving too", async ({ page }) => {
  await clickedOff(page);
  await page.goto("/houses/ataraxia.html");
  await expect.poll(() => page.evaluate(() => window.KeepTime.frames), { timeout: 5000 }).toBeGreaterThan(5);
  const a = await print(page, ".human-field");
  await page.waitForTimeout(1200);
  expect(await print(page, ".human-field"), "the bands' light moved on").not.toBe(a);
});

test("in front and looked at, the browser's own frames and no stand-in", async ({ page }) => {
  await page.goto("/categories/researches.html");
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.KeepTime.frames), "no timer drew a frame").toBe(0);
});

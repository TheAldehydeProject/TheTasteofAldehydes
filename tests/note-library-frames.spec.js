// @ts-check
/* ============================================================
   THE NOTE LIBRARY'S FRAMES — note-library/index.html, drawn by network.js.

   One test, in a file of its own so that it can be measured WITHOUT the
   test tool's own recording (its trace, which can only be turned off for a
   whole file). Recording the page while it draws stalled one frame in two
   or three past 40ms on this machine (2026-10-10) — the page as it stood
   before that day's changes just the same, and never once with the
   recording off: the tool's stall, not the page's. The rest of the
   library's tests are in note-library.spec.js.
   ============================================================ */
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally } = require("./helpers");

test.use({ trace: "off" });

const LIBRARY = "/note-library/";
async function open(page, size = { width: 1440, height: 900 }) {
  await page.setViewportSize(size);
  await page.goto(LIBRARY);
  await expect(page.locator(".net-stage")).toHaveClass(/is-drawn/, { timeout: 15000 });
}
async function expandIt(page) {
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "apart", { timeout: 30000 });
}
const state = (page) => page.evaluate(() => window.NetScene.state());
/** Gone to an accord's network by the dropdown, and settled there. */
async function goTo(page, k, code) {
  await page.locator(".net-drop-button").click();
  await page.locator('.net-drop-option[data-to="' + k + '"]').click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", code, { timeout: 20000 });
  await expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* SIXTY FRAMES A SECOND: every frame's own work — the drawing's and the
   page's — through the expansion, a journey and the collapse, is a part of
   the sixtieth of a second a frame has. (What this machine's software
   drawing then takes is not the page's, and a graphics card does it in a
   moment.) Measured without the test tool's own recording (its trace):
   recording the page while it draws stalled one frame in two or three past
   40ms on this machine (2026-10-10), the page before that day's changes
   just the same, and never once with it off — the tool's, not the page's. */
test("every frame of every transition is quick enough for sixty a second", async ({ page }) => {
  test.setTimeout(150000);
  await open(page);
  await page.evaluate(() => window.NetScene.reset());
  await expandIt(page);
  await goTo(page, 8, "WOO");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", "BRW", { timeout: 20000 });
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "one", { timeout: 30000 });
  const s = await page.evaluate(() => window.NetScene.stats());
  // A frame has 16.7ms at sixty a second. The page's own work — here on a
  // machine drawing in software and running other tests beside it — is a
  // part of that on average, and very nearly always inside it.
  expect(s.frames, "frames drawn").toBeGreaterThan(60);
  expect(s.mean, "a frame's own work, on average, in ms").toBeLessThan(7);
  expect(s.p95, "nearly every frame's").toBeLessThan(16.7);
  expect(s.max, "and no stall — a drawing made for the first time mid-way, say").toBeLessThan(40);
});

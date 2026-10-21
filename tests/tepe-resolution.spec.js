// ============================================================
// THE MOUNTAIN'S RESOLUTION, TRIED — Apoteker Tepe (2026-10-21).
//
// The owner: "its ugly, and the main reason is the resolution ... give me a
// list of ways to make the resolution better, including demonstrations of
// each way separately (a trial render)". Each way is a word in `?res=` on
// the page's address (tepe-gl.js, tepe.js); without one the page draws as it
// did. These check that every trial draws — its programs compile, its
// pictures load, the mountain stands solid in the window — and that none of
// them is on without being asked for. How each LOOKS is the trials' own
// pictures, judged by eye.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const TEPE = "/houses/apoteker-tepe.html";
const TRIAL = path.join(__dirname, "..", "images", "Apoteker Tepe", "mountain", "trials");
const SMALL = { width: 800, height: 520 };
const ready = (page) => expect.poll(() => page.evaluate(() => !!(window.TepeMountain && TepeMountain.ready())), { timeout: 60000 }).toBe(true);

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("without ?res= the mountain draws as it did: no trial is on", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(TEPE);
  await ready(page);
  const t = await page.evaluate(() => TepeMountain.trials());
  expect(t.res).toEqual([]);
  // (none of the trials' code in the programs: it slowed the page by half
  // while every trial was off, until it was put behind TRIALS)
  expect(t.code, "the programs as they were, with none of the trials' code").toBe(false);
  expect(t.post, "no picture laid down again").toBe(false);
  expect(t.ray, "no ray over the heights").toBe(false);
  expect(t.aniso).toBe(false);
  expect(errors).toEqual([]);
});

// Every trial, a few to a page (each is only a flag, and they stand together),
// drawn whole (`?tepe=full`) in a small window.
const GROUPS = [
  "native,closer,ditherfine,bluenoise,nospecks",
  "levels,finespecks,trailsgl,contours,relief,clear",
  "nodither,mesh,normals,shore,detail,aniso",
  "dem,shadows,ao,photo",
  "erosion,median,superres",
  "lines",
  "raymarch",
  "ss2,fxaa,cas",
  "accum",
  "best",
];
for (const keys of GROUPS) {
  test(`the resolution trial ?res=${keys} draws the mountain solid, without a fault`, async ({ page }) => {
    test.setTimeout(150000);
    const errors = collectPageErrors(page);
    await page.setViewportSize(SMALL);
    await page.goto(`${TEPE}?tepe=full&res=${keys}`);
    await ready(page);
    const t = await page.evaluate(() => TepeMountain.trials());
    expect(t.error, "every program compiled").toBe("");
    expect(t.code, "the trials' code in the programs").toBe(true);
    for (const k of keys.split(",")) if (k !== "best") expect(t.res).toContain(k);
    if (/raymarch/.test(keys)) expect(t.ray, "the ray's program, where the machine can write a pixel's depth").toBe(t.fragDepth);
    if (/ss2|accum|fxaa|cas/.test(keys)) expect(t.post, "the picture laid down again").toBe(true);
    if (/accum/.test(keys)) expect(await page.evaluate(() => TepeMountain.settle(3)), "pictures laid over each other").toBeGreaterThan(0);
    const look = await page.evaluate(() => TepeMountain.sample());
    expect(look.covers, "the land fills the window").toBeGreaterThan(0.4);
    expect(look.body, "the mountain is solid").toBeGreaterThan(0.85);
    expect(errors).toEqual([]);
  });
}

test("every trial's own picture is there, written by its tool", () => {
  for (const f of ["heights-dem.png", "heights-eroded.png", "athos-10m.jpg", "athos-median.jpg", "athos-sr.jpg", "light-base.png", "light-dem.png", "light-eroded.png"]) {
    expect(fs.existsSync(path.join(TRIAL, f)), f).toBe(true);
  }
  const tool = fs.readFileSync(path.join(__dirname, "..", "tools", "apoteker", "trials.mjs"), "utf8");
  expect(tool).toContain("copernicus-dem-30m");
  expect(tool).toContain("sentinel-cogs");
});

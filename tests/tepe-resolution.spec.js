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
// pictures, judged by eye. And the same for THE TRIALS OF ITS REALISM, the
// same day, later ("I want it to feel as realistic as possible"): the
// camera's (`tonemap` … `sensor`), the light and the air, the sea, the trees,
// the marble, the real paths and buildings, and `real`, all of them. And THE
// LOOKS, the same day, last ("add effects to it too, so that it looks unique,
// and not entirely lifelike ... a temporary setting on the bottom right of
// the page where i can cycle through them"): `style`, its panel and what it
// changes while the page is open.
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
  expect(t.style, "none of the looks").toBe(false);
  await expect(page.locator(".tepe-looks"), "no panel of looks").toHaveCount(0);
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
  "tonemap,bloom,halation,vignette,aberration,clarity,grade,grain",
  "agx,sensor",
  "light,haze,sky,sea,rock,delit",
  "canopy",
  "osmtrails,buildings",
  "real",
  "style",
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
    for (const k of keys.split(",")) if (k !== "best" && k !== "real") expect(t.res).toContain(k);
    if (/tonemap|agx|grain|sensor|bloom/.test(keys)) expect(t.post, "the picture laid down through the camera").toBe(true);
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
  for (const f of ["heights-dem.png", "heights-eroded.png", "athos-10m.jpg", "athos-median.jpg", "athos-sr.jpg", "light-base.png", "light-dem.png", "light-eroded.png", "athos-delit.jpg", "ndvi.png", "canopy.jpg", "athos-osm.json"]) {
    expect(fs.existsSync(path.join(TRIAL, f)), f).toBe(true);
  }
  const tool = fs.readFileSync(path.join(__dirname, "..", "tools", "apoteker", "trials.mjs"), "utf8");
  expect(tool).toContain("copernicus-dem-30m");
  expect(tool).toContain("sentinel-cogs");
  expect(tool, "the trees' crowns, Meta and WRI's canopy heights").toContain("dataforgood-fb-data");
  // (fewer than a hundred of OpenStreetMap's features: an insubstantial extract, its credit with it)
  const osm = JSON.parse(fs.readFileSync(path.join(TRIAL, "athos-osm.json"), "utf8"));
  expect(osm.trails.length + osm.buildings.length).toBeLessThan(100);
  expect(osm.credit).toContain("OpenStreetMap contributors");
});

test("the trials that draw on more of the world's data say whose, in the mountain's credit", async ({ page }) => {
  await page.goto(`${TEPE}?res=canopy,osmtrails,buildings`);
  const credit = page.locator(".house-credit-ground .house-credit-text");
  await expect(credit).toContainText("Canopy Height Map");
  await expect(credit).toContainText("© OpenStreetMap contributors");
  await page.goto(TEPE);
  await expect(credit).not.toContainText("OpenStreetMap");
});

// THE LOOKS: the panel at the bottom right, and the drawing changing as it is pressed.
test("?res=style puts the looks' panel at the bottom right, and the drawing changes as it is pressed", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await page.setViewportSize(SMALL);
  await page.goto(`${TEPE}?tepe=full&res=style`);
  await ready(page);
  const t = await page.evaluate(() => TepeMountain.trials());
  expect(t.error, "every program compiled").toBe("");
  expect(t.style, "the looks' code in the programs").toBe(true);
  expect(t.glow, "the glowing lines' program").toBe(true);
  expect(t.post, "the finished picture laid down through the looks' textures").toBe(true);
  const panel = page.locator(".tepe-looks");
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  expect(box.x + box.width, "at the right").toBeGreaterThan(SMALL.width - 30);
  expect(box.y + box.height, "at the bottom").toBeGreaterThan(SMALL.height - 30);
  await expect(page.locator(".human-readout"), "the page's reading in that corner put away").toBeHidden();
  // Opened without fx=: the sunset gradient, in halftone, the icons, the coast and the haze.
  const colour = panel.locator(".tepe-looks-colour");
  await expect(colour).toHaveText("Sunset gradient");
  for (const k of ["halftone", "icons", "coast", "haze"]) await expect(panel.locator(`[data-fx="${k}"]`)).toHaveAttribute("aria-pressed", "true");
  for (const k of ["dither", "engrave", "grain", "shapes", "seal", "contours", "drift"]) await expect(panel.locator(`[data-fx="${k}"]`)).toHaveAttribute("aria-pressed", "false");
  // The colour gone round, both ways, and kept in the address.
  await panel.locator('[data-step="1"]').click();
  await expect(colour).toHaveText("Infrared film");
  expect(await page.evaluate(() => TepeMountain.looks().palette)).toBe("infrared");
  expect(page.url()).toContain("fx=infrared");
  await panel.locator('[data-step="-1"]').click();
  await panel.locator('[data-step="-1"]').click();
  await expect(colour).toHaveText("Real colours");
  await panel.locator('[data-step="-1"]').click();
  await expect(colour).toHaveText("Two-ink print");
  // A chip on and off, and the line art drawn for it.
  await panel.locator('[data-fx="shapes"]').click();
  await expect(panel.locator('[data-fx="shapes"]')).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => TepeMountain.art().shapes), { timeout: 30000 }).toBeGreaterThan(0);
  expect(await page.evaluate(() => TepeMountain.art().icons), "a drawing at each fragrance's place it can see").toBeGreaterThan(0);
  await panel.locator('[data-fx="halftone"]').click();
  expect(await page.evaluate(() => TepeMountain.looks().halftone)).toBe(false);
  expect(page.url()).toMatch(/fx=print,[a-z,]*shapes/);
  expect(page.url()).not.toMatch(/fx=[a-z,]*halftone/);
  // The base: the realistic drawing is a reload, keeping the looks.
  const real = await panel.locator('[data-base="real"]').getAttribute("href");
  expect(real).toContain("res=real,style");
  expect(real).toContain("fx=print");
  await expect(panel.locator('[data-base="page"]')).toHaveAttribute("aria-current", "true");
  // Folded away and back.
  await panel.locator(".tepe-looks-fold").click();
  await expect(panel.locator(".tepe-looks-body")).toBeHidden();
  await panel.locator(".tepe-looks-fold").click();
  await expect(panel.locator(".tepe-looks-body")).toBeVisible();
  // The mountain still stands solid, whatever is on.
  const look = await page.evaluate(() => TepeMountain.sample());
  expect(look.body, "the mountain is solid").toBeGreaterThan(0.85);
  expect(errors).toEqual([]);
});

test("the looks are read off the address, and the panel fits a phone", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${TEPE}?res=style&fx=print,engrave,seal,contours,drift`);
  await ready(page);
  const panel = page.locator(".tepe-looks");
  await expect(panel.locator(".tepe-looks-colour")).toHaveText("Two-ink print");
  for (const k of ["engrave", "seal", "contours", "drift"]) await expect(panel.locator(`[data-fx="${k}"]`)).toHaveAttribute("aria-pressed", "true");
  for (const k of ["halftone", "icons", "coast", "haze"]) await expect(panel.locator(`[data-fx="${k}"]`)).toHaveAttribute("aria-pressed", "false");
  expect(await page.evaluate(() => TepeMountain.art().seal)).toBe(true);
  const box = await panel.boundingBox();
  expect(box.x, "inside the window").toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth), "nothing sideways").toBeLessThanOrEqual(390);
  expect(errors).toEqual([]);
});

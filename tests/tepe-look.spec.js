// ============================================================
// THE MOUNTAIN'S OWN LOOK — Apoteker Tepe (2026-10-21, last).
//
// Chosen by the owner out of the day's trials: "remove the menu, make it
// realistic, give it grain, two ink print, colour haze, drift, but make the
// colours slightly lighter and less contrasted. I also want you to make it
// easier to look at; and the text easier to read ... make sure that the
// reaslitic version doesnt kill the CPU or RAM." So the page draws, always,
// as a print in two inks — with a graphics card the realistic drawing under
// it (the ground at 10 m, the light, the air, the trees, the marble, the sea,
// OpenStreetMap's paths and buildings) through the camera (the pictures laid
// over each other, its glow, a film's curve and grain); without one, the
// lighter drawing in the same colours. The trials' switch (`?res=`) and the
// looks' panel are gone, with all their code. How it LOOKS is judged by eye;
// these check it works. (The two that draw it whole in software, and that it
// keeps within its means, are at the foot of apoteker-tepe.spec.js, so they
// run in the same worker as its speed and never beside it.)
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const TEPE = "/houses/apoteker-tepe.html";
const FINE = path.join(ROOT, "images", "Apoteker Tepe", "mountain", "fine");
const ready = (page) => expect.poll(() => page.evaluate(() => !!(window.TepeMountain && TepeMountain.ready())), { timeout: 60000 }).toBe(true);

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("the trials' switch and the looks' panel are gone: an old address draws the page's own look, without a fault", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(`${TEPE}?res=real,style&fx=sunset,halftone,icons`);
  await ready(page);
  const d = await page.evaluate(() => TepeMountain.drawing());
  expect(d.page, "the page's own look: the print").toBe(true);
  // (this machine draws without a graphics card: the lighter drawing, dithered)
  expect(d.real, "without a graphics card, the lighter drawing").toBe(false);
  expect(d.post, "and nothing laid down through the camera").toBe(false);
  await expect(page.locator(".tepe-looks"), "no panel of looks").toHaveCount(0);
  expect(await page.evaluate(() => typeof TepeMountain.looks), "nor its hooks").toBe("undefined");
  expect(errors).toEqual([]);
});

test("none of the trials' or the looks' code is left", () => {
  const gl = read("tepe-gl.js"), page = read("tepe.js"), css = read("style.css");
  for (const gone of ["[?&]res=", "TRIALS", "STYLE", "PALETTES", "halftone", "raymarch", "RAY_FS", "GLOW_FS", "fxaa", "agx(", "uStyle", "ndvi", "SKY_REAL", "superres"]) expect(gl, `tepe-gl.js: ${gone}`).not.toContain(gone);
  for (const gone of ["res(", "STYLE", "FX_WORDS", "tepe-looks", "SEAL_WORDS", "drawArt", "iconPath", "CLOSER"]) expect(page, `tepe.js: ${gone}`).not.toContain(gone);
  expect(css, "the panel's styles").not.toContain("tepe-looks");
  expect(fs.existsSync(path.join(ROOT, "images", "Apoteker Tepe", "mountain", "trials")), "the trials' pictures").toBe(false);
  expect(fs.existsSync(path.join(ROOT, "tools", "apoteker", "trials.mjs")), "their tool, now fine.mjs").toBe(false);
  expect(fs.existsSync(path.join(ROOT, "tools", "apoteker", "upscale.py")), "the enlarging tool").toBe(false);
});

test("the fine pictures are there, written by their tools", () => {
  for (const f of ["heights-10m.png", "colour-10m.jpg", "light.png", "canopy.jpg", "athos-osm.json"]) expect(fs.existsSync(path.join(FINE, f)), f).toBe(true);
  const tool = read("tools/apoteker/fine.mjs");
  expect(tool).toContain("copernicus-dem-30m");
  expect(tool).toContain("sentinel-cogs");
  expect(tool, "the trees' crowns, Meta and WRI's canopy heights").toContain("dataforgood-fb-data");
  expect(read("tools/apoteker/osm.py")).toContain("mountain/fine");
  // (fewer than a hundred of OpenStreetMap's features: an insubstantial extract, its credit with it)
  const osm = JSON.parse(fs.readFileSync(path.join(FINE, "athos-osm.json"), "utf8"));
  expect(osm.trails.length + osm.buildings.length).toBeLessThan(100);
  expect(osm.credit).toContain("OpenStreetMap contributors");
});

test("the mountain's credit names every source it is drawn from", async ({ page }) => {
  await page.goto(TEPE);
  const credit = page.locator(".house-credit-ground .house-credit-text");
  await expect(credit).toContainText("Copernicus DEM GLO-30");
  await expect(credit).toContainText("© DLR e.V.");
  await expect(credit).toContainText("Sentinel-2");
  await expect(credit).toContainText("Canopy Height Map");
  await expect(credit).toContainText("© OpenStreetMap contributors");
  await expect(credit).toContainText("Mapzen");
});

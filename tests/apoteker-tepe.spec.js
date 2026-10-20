// ============================================================
// THE THIRTEENTH HOUSE — Apoteker Tepe (2026-10-20), and its Houses view
// motif.
//
//   THE PAGE      eight fragrances, each saying when it was made, as the
//                 owner asked: "0000, before/after 0000" against 2018.
//   THE MOUNTAIN  Mount Athos, out of its own heights (tepe-data.js,
//                 written by tools/apoteker/mountain.mjs with image-js),
//                 in green specks, turning as the page is scrolled, with
//                 its trails and the house's sign blazed along them; faint
//                 behind the words on every width; quick to draw, on a
//                 laptop and on a phone; still with reduced motion; and
//                 the page is its writing without the script. Credited by
//                 name at the foot.
//   THE MOTIF     fragments of the same mountain on the Houses view, a
//                 stretch of trail across each, its dashes going along it.
//
// What the page looks like is checked by eye; these check it works.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const TEPE = "/houses/apoteker-tepe.html";
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* WHEN EACH WAS MADE (2026-10-20 — "a note to every fragrance that was made
   before and after the period of 2014-2018. Make sure to make that
   distinction. Look up their release dates. I want it to be in the format
   of 0000, before/after 0000"). The house's founder let it go in 2018 and
   Pineward took it over in 2022, so the line is drawn at 2018. */
test("every Apoteker Tepe fragrance says when it was made, as 0000, before/after 2018", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(TEPE);
  const rows = await page.locator(".human-part > summary").evaluateAll((list) => list.map((s) => [s.querySelector(".human-title").textContent.trim(), s.querySelector(".human-made").textContent.trim()]));
  expect(rows).toEqual([
    ["Kogen", "2024, after 2018"],
    ["The Holy Mountain", "2015, before 2018"],
    ["Brother Night", "2022, after 2018"],
    ["Karasu", "2016, before 2018"],
    ["The Peradam", "2015, before 2018"],
    ["Pale Fire", "2016, before 2018"],
    ["Anabasis", "2015, before 2018"],
    ["After the Flood", "2015, before 2018"],
  ]);
  for (const [, made] of rows) {
    const [, year, way, line] = /^(\d{4}), (before|after) (\d{4})$/.exec(made);
    expect(way, made).toBe(+year < +line ? "before" : "after");
  }
  // Each part's pictures are in the repository, and they arrive.
  const broken = await page.evaluate(async () => {
    const imgs = [...document.querySelectorAll(".human-part img")];
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    return imgs.filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src"));
  });
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

/* THE CREDIT: the bottles are the house's, the house's picture Scentorium's
   ("Please credit it"), and the mountain is named ("if you do then make
   sure to actually put its name down in the credits below"), with the
   elevation data's own credit. */
test("Apoteker Tepe credits its pictures and names its mountain", async ({ page }) => {
  await page.goto(TEPE);
  const credits = page.locator(".house-credit");
  await expect(credits).toHaveCount(2);
  await expect(credits.nth(0)).toContainText("apotekertepe.net");
  await expect(credits.nth(0).locator('a[href*="scentorium.eu"]')).toHaveText("Scentorium");
  await expect(credits.nth(1)).toContainText("Mount Athos");
  await expect(credits.nth(1)).toContainText("Mapzen");
  await expect(credits.nth(1)).toContainText("EU-DEM");
  expect(read("tepe-data.js"), "the data names it too").toContain('"name":"Mount Athos"');
});

/* THE MOUNTAIN, out of its own heights, in green specks; the trails and the
   house's sign along them; TURNING AS THE PAGE IS SCROLLED ("I want this to
   be reactive, and rotate when you scroll"). */
test("Apoteker Tepe's mountain is drawn from its data, and turns as the page is scrolled", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEPE);
  await expect.poll(() => page.evaluate(() => window.TepeMountain && window.TepeMountain.blazes()), { timeout: 8000 }).toBe(true);
  const at = await page.evaluate(() => ({ specks: TepeMountain.specks(), trails: TepeMountain.trails(), turn: TepeMountain.turn(), n: TEPE.n, heights: atob(TEPE.heights).length, photo: atob(TEPE.photo).length }));
  expect(at.specks).toBeGreaterThan(20000);
  expect(at.trails).toBeGreaterThanOrEqual(5);
  expect(at.heights, "its heights, n by n").toBe(at.n * at.n);
  expect(at.photo, "and its photograph").toBe(at.n * at.n);
  // Drawn: ink on the specks' canvas, in greens.
  const inked = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0, green = 0;
    for (let i = 0; i < d.length; i += 4 * 7) if (d[i + 3] > 20) { n++; if (d[i + 1] > d[i] && d[i + 1] > d[i + 2]) green++; }
    return { n, green };
  });
  expect(inked.n, "the mountain is drawn").toBeGreaterThan(2000);
  expect(inked.green / inked.n, "in green").toBeGreaterThan(0.8);
  // Scrolled to the foot, it turns most of the way round, catching up.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => TepeMountain.turn()), { timeout: 5000 }).toBeGreaterThan(at.turn + 4.5);
  expect(errors).toEqual([]);
});

/* LEGIBLE ("I want the text in front of the mountain to be legible"): the
   mountain goes faint behind the words, on every width — drawn again with
   `Writing` and without it, what stands behind a paragraph is a fraction
   of itself. */
for (const [where, size] of [["a laptop", { width: 1440, height: 900 }], ["a phone", { width: 390, height: 844 }]]) {
  test(`Apoteker Tepe's mountain goes faint behind the words on ${where}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto(TEPE);
    await page.waitForTimeout(800);
    // The paragraph the mountain stands most behind.
    const r = await page.evaluate(() => {
      const c = document.querySelector(".human-field"), g = c.getContext("2d"), k = c.width / innerWidth;
      const inkIn = (b) => {
        const d = g.getImageData(Math.round(b.left * k), Math.round(b.top * k), Math.max(1, Math.round(b.width * k)), Math.max(1, Math.round(b.height * k))).data;
        let s = 0;
        for (let i = 3; i < d.length; i += 4) s += d[i];
        return s;
      };
      const boxes = [...document.querySelectorAll(".human-text p, .human-part > summary")].map((p) => p.getBoundingClientRect()).filter((b) => b.bottom > 0 && b.top < innerHeight);
      const on = boxes.map(inkIn);
      const W = window.Writing;
      window.Writing = null;
      TepeMountain.time(1);
      const off = boxes.map(inkIn);
      window.Writing = W;
      TepeMountain.time(1);
      let best = 0;
      off.forEach((v, i) => { if (v > off[best]) best = i; });
      return { on: on[best], off: off[best] };
    });
    expect(r.off, "the mountain stands behind some writing").toBeGreaterThan(5000);
    expect(r.on / r.off, "what is left of it there").toBeLessThan(0.45);
  });
}

/* SMOOTH ("Make sure that the page runs smoothly ... including the ones that
   ensure that it runs smoothly on the phone"): the specks are drawn again
   only when something has moved, into the picture's own pixels, and the
   wash under them is stretched by the browser — so a redraw is a few
   milliseconds, and the page scrolls at full frames on a phone. */
for (const [where, size, phone] of [["a laptop", { width: 1440, height: 900 }, false], ["a phone", { width: 390, height: 844 }, true]]) {
  test(`Apoteker Tepe is quick to draw and scroll on ${where}`, async ({ browser }) => {
    test.setTimeout(60000);
    const context = await browser.newContext({ viewport: size, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 3 : 1 });
    const page = await context.newPage();
    await serveDependenciesLocally(page);
    await page.goto(TEPE);
    await page.waitForTimeout(1500);
    const src = read("tepe.js");
    expect(src, "no mask over the window").not.toContain("destination-in");
    expect(await page.evaluate(() => TepeMountain.time(10)), "ms to draw the specks again").toBeLessThan(24);
    const scrolling = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); (function f() { n++; window.scrollBy(0, 5); if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(n / 2); })(); }));
    expect(scrolling, "frames a second, scrolling").toBeGreaterThan(phone ? 30 : 24);
    const still = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(f); else res(n / 1.5); })(); }));
    expect(still, "frames a second, read").toBeGreaterThan(phone ? 40 : 30);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), "nothing wider than the window").toBeLessThanOrEqual(size.width);
    await context.close();
  });
}

/* WITH REDUCED MOTION the mountain stands as the scroll puts it, at once,
   and nothing goes along the trails; WITHOUT THE SCRIPT the page is its
   writing on aged paper. */
test("Apoteker Tepe's mountain is still with reduced motion, and the page is its writing without the script", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(TEPE);
  await page.waitForTimeout(600);
  const frames = await page.evaluate(() => new Promise((res) => {
    const c = document.querySelector(".tepe-trails"), a = c.toDataURL();
    setTimeout(() => res(a === c.toDataURL()), 700);
  }));
  expect(frames, "the trails still").toBe(true);
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(100);
  const turned = await page.evaluate(() => TepeMountain.turn());
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => TepeMountain.turn()), "turned at once, as the scroll puts it").toBeCloseTo(turned, 6);
  await context.close();

  const bare = await browser.newPage();
  await serveDependenciesLocally(bare);
  await bare.route(/tepe(-data)?\.js/, (r) => r.abort());
  const errors = collectPageErrors(bare, ["ERR_FAILED"]);
  await bare.goto(TEPE);
  await expect(bare.locator(".human-part")).toHaveCount(8);
  await bare.locator(".human-part > summary").first().click();
  await expect(bare.locator(".human-part").first()).toHaveAttribute("open", "");
  expect(errors).toEqual([]);
  await bare.close();
});

/* THE MOTIF ON THE HOUSES VIEW (2026-10-20 — "fragments of the mountains and
   the lines in the actual page will appear, and the lines will move as if
   along the path. Make it not too flashy, but make it pretty"): a few
   fragments at once, whole on the window, apart from each other. */
test("Apoteker Tepe's motif on the Houses view is fragments of its mountain, each with a stretch of trail", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-13");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect(page.locator("#sheet")).toHaveAttribute("data-front", "13");
  await expect.poll(() => page.evaluate(() => window.HouseMotifs.ridges().length), { timeout: 15000 }).toBeGreaterThanOrEqual(2);
  await page.waitForTimeout(2500);
  const ridges = await page.evaluate(() => window.HouseMotifs.ridges());
  expect(ridges.length).toBeLessThanOrEqual(4);
  for (const r of ridges) {
    expect(r.x - r.px, "whole on the window").toBeGreaterThan(-1);
    expect(r.x + r.px).toBeLessThan(1441);
  }
  for (let i = 0; i < ridges.length; i++) for (let j = i + 1; j < ridges.length; j++) {
    const a = ridges[i], b = ridges[j];
    expect(Math.hypot(a.x - b.x, a.y - b.y), "apart from each other").toBeGreaterThan((a.px + b.px) * 1.1);
  }
  const census = await page.evaluate(() => window.HouseMotifs.census());
  expect(Object.keys(census), "nothing else").toEqual(["ridge"]);
  expect(errors).toEqual([]);
});

/* THE TOOL wrote the data, with image-js, and it says so. */
test("Apoteker Tepe's mountain is written by its tool, with image-js", () => {
  const tool = read("tools/apoteker/mountain.mjs");
  expect(tool).toContain('from "image-js"');
  expect(read("tepe-data.js")).toMatch(/tools\/apoteker\/mountain\.mjs/);
  expect(JSON.parse(read("package.json")).devDependencies["image-js"], "image-js for the tool only").toBeTruthy();
});

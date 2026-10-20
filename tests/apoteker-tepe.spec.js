// ============================================================
// THE THIRTEENTH HOUSE — Apoteker Tepe (2026-10-20), and its Houses view
// motif.
//
//   THE PAGE      eight fragrances, each saying when it was made, as the
//                 owner asked: "0000, before/after 0000" against 2018 —
//                 and their pictures a little further off ("zoom out the
//                 images a little; they are out of frame").
//   THE MOUNTAIN  Mount Athos, out of its own heights and coloured by the
//                 Sentinel-2 satellite's picture of it (tepe-data.js and
//                 images/Apoteker Tepe/mountain/athos.jpg, written by
//                 tools/apoteker/mountain.mjs with image-js), drawn by
//                 tepe-gl.js: SOLID, in more colours than green, in small
//                 specks, many; the house's sign laid on it; turning SLOWLY
//                 as the page is scrolled, and nothing answering the hand;
//                 the sky, the sea and the horizon round it; QUIET behind
//                 the writing as Ataraxia's bands are; quick to draw, on a
//                 laptop and on a phone; still with reduced motion; and the
//                 page is its writing without the script. Credited by name.
//   FREE VIEW     the button at the top right: the writing goes, the
//                 mountain is turned by a drag and brought nearer by the
//                 wheel, and a node for each of the eight says which it is
//                 and goes to it.
//   THE MOTIF     fragments of the same mountain on the Houses view, a
//                 stretch of trail across each, its dashes going along it,
//                 one of them carrying the house's sign; the house's
//                 picture whole in its frame.
//
// What the page looks like is checked by eye; these check it works.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const TEPE = "/houses/apoteker-tepe.html";
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
const LAPTOP = { width: 1440, height: 900 }, PHONE = { width: 390, height: 844 };
const ready = (page) => expect.poll(() => page.evaluate(() => !!(window.TepeMountain && TepeMountain.ready())), { timeout: 20000 }).toBe(true);

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

/* THE PICTURES A LITTLE FURTHER OFF: a cut-out bottle stands in its frame
   with room round it (it filled its picture to the edges), a scene is shown
   whole at its own shape (it was cut to an upright 2 : 3), and the house's
   picture on the Houses view is the whole of it at the frame's own shape. */
test("Apoteker Tepe's pictures stand a little further off, whole in their frames", async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await page.locator(".human-part > summary").nth(1).click();
  const r = await page.evaluate(async () => {
    const part = document.querySelectorAll(".human-part")[1];
    const imgs = [...part.querySelectorAll(".human-plate img")];
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((d) => { i.onload = i.onerror = d; }))));
    const cut = imgs[0], cs = getComputedStyle(cut), scene = imgs[1], sb = scene.getBoundingClientRect();
    return { pad: parseFloat(cs.paddingTop), fit: cs.objectFit, scene: sb.height / sb.width, natural: scene.naturalHeight / scene.naturalWidth };
  });
  expect(r.pad, "the cut-out stands off its frame's edges").toBeGreaterThan(10);
  expect(r.fit).toBe("contain");
  expect(r.scene, "the scene at its own shape").toBeCloseTo(r.natural, 1);
  const house = await page.evaluate(() => new Promise((done) => { const i = new Image(); i.onload = () => done(i.naturalWidth / i.naturalHeight); i.src = "../images/Apoteker Tepe/house-web/apoteker-tepe-house.webp"; }));
  expect(house, "the house's picture at the Houses view's frame's shape (0.86), so nothing of it is cut").toBeCloseTo(0.86, 2);
});

/* THE CREDIT: the bottles are the house's, the house's picture Scentorium's
   ("Please credit it"), and the mountain is named ("if you do then make
   sure to actually put its name down in the credits below"), with the
   elevation data's own credit and the satellite's. */
test("Apoteker Tepe credits its pictures and names its mountain", async ({ page }) => {
  await page.goto(TEPE);
  const credits = page.locator(".house-credit");
  await expect(credits).toHaveCount(2);
  await expect(credits.nth(0)).toContainText("apotekertepe.net");
  await expect(credits.nth(0).locator('a[href*="scentorium.eu"]')).toHaveText("Scentorium");
  await expect(credits.nth(1)).toContainText("Mount Athos");
  await expect(credits.nth(1)).toContainText("Mapzen");
  await expect(credits.nth(1)).toContainText("EU-DEM");
  await expect(credits.nth(1)).toContainText("contains modified Copernicus Sentinel data 2023");
  expect(read("tepe-data.js"), "the data names it too").toContain('"name":"Mount Athos"');
});

/* THE MOUNTAIN ("I do not want the mountain to be translucent, i want it to
   be visible exactly the same as any other mountain; and i want there to be
   colours, not just green ... make the particles smaller and way more
   dense"): drawn over black and over white it is the same — solid — and in
   greys and warm colours as well as greens; its specks many; out of its
   own heights; the house's sign laid on it ("I want the actual logo of the
   house to appear somewhere on this mountain"). */
test("Apoteker Tepe's mountain is solid, coloured as a mountain is, in many specks, with the house's sign on it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await ready(page);
  const at = await page.evaluate(() => ({ specks: TepeMountain.specks(), soft: TepeMountain.soft(), trails: TepeMountain.trails(), n: TEPE.n, heights: atob(TEPE.heights).length }));
  // (A tenth of them on a machine without a graphics card, as this one is.)
  expect(at.specks, "specks, many").toBeGreaterThan(at.soft ? 25000 : 250000);
  expect(at.trails).toBeGreaterThanOrEqual(5);
  expect(at.heights, "its heights, n by n, two bytes each").toBe(at.n * at.n * 2);
  const look = await page.evaluate(() => TepeMountain.sample());
  expect(look.covers, "the mountain is drawn").toBeGreaterThan(0.1);
  // Its body solid — the same over black and over white, every pixel of it
  // — and most of it all told: only its foot fades into the mist.
  expect(look.body, "its body solid").toBeGreaterThan(0.99);
  expect(look.solid, "and most of it").toBeGreaterThan(0.6);
  expect(look.green, "not all green: under two thirds of it").toBeLessThan(0.66);
  expect(look.grey + look.warm, "greys and warm colours too").toBeGreaterThan(0.25);
  // The sign: where the tool laid it, a good part of the ground is its pale
  // stone, and none of it a stone's throw away.
  const sign = await page.evaluate(async () => {
    const g = await TepeGL.ground(), f = TEPE.figure, pale = (u, v) => Math.min(...g.colourAt(u, v)) > 180;
    let on = 0, off = 0, all = 0;
    for (let a = -1; a <= 1; a += 0.05) for (let b = -1; b <= 1; b += 0.05) {
      all++;
      if (pale(f.at[0] + a * f.tall * 0.5, f.at[1] + b * f.tall * 0.5)) on++;
      if (pale(f.at[0] + a * f.tall * 0.5 + f.tall * 1.6, f.at[1] + b * f.tall * 0.5)) off++;
    }
    return { tall: f.tall, on: on / all, off: off / all };
  });
  expect(sign.tall, "the sign is as tall as a hillside").toBeGreaterThan(15);
  expect(sign.on, "its shape, in pale stone, where it was laid").toBeGreaterThan(0.08);
  expect(sign.off, "and not beside it").toBeLessThan(sign.on / 3);
  expect(errors).toEqual([]);
});

/* SLOWER, AND NOTHING ANSWERING THE HAND ("The rotation is too fast, and I
   would prefer it it was slower. The reactivity too, I would actually
   suggest removeing that entirely"): scrolled from the head of the page to
   its foot it turns a little over a quarter of a turn (it was most of
   one); the hand moving over it moves nothing. */
test("Apoteker Tepe's mountain turns slowly as the page is scrolled, and does not answer the hand", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await ready(page);
  await page.waitForTimeout(1200);
  const before = await page.evaluate(() => TepeMountain.camera());
  for (let k = 0; k < 12; k++) await page.mouse.move(300 + k * 70, 300 + (k % 3) * 120);
  await page.waitForTimeout(400);
  const after = await page.evaluate(() => TepeMountain.camera());
  expect(after, "the hand moved nothing").toEqual(before);
  expect(read("tepe.js"), "nothing of the hand left in it").not.toMatch(/HAND_(REACH|LIFT|LIGHT)/);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => TepeMountain.turn()), { timeout: 8000 }).toBeGreaterThan(before.yaw + 1.6);
  await page.waitForTimeout(2500);
  expect(await page.evaluate(() => TepeMountain.turn()), "and no more than a third of a turn").toBeLessThan(before.yaw + Math.PI * 0.67);
  expect(errors).toEqual([]);
});

/* QUIET BEHIND THE WRITING AS ATARAXIA'S BANDS ARE ("deminish everything
   that is in front of the writing in a similar way to ataraxia's page"):
   on a laptop the whole of the drawing over the column of writing is at
   Ataraxia's QUIET, easing back to the whole of itself in the margins; on
   a phone, where the writing is the whole width, at QUIET everywhere and
   quieter again behind the words. Ataraxia's own numbers. */
test("Apoteker Tepe's drawing is quiet behind the writing as Ataraxia's is", async ({ browser }) => {
  const ataraxia = read("ataraxia.js"), tepe = read("tepe.js");
  const num = (src, name) => Number(new RegExp("const " + name + " = ([0-9.]+)").exec(src)[1]);
  expect(num(tepe, "QUIET"), "Ataraxia's QUIET").toBe(num(ataraxia, "QUIET"));
  expect(num(tepe, "SOFT"), "and its SOFT").toBe(num(ataraxia, "SOFT"));
  const QUIET = num(tepe, "QUIET");
  for (const [where, size] of [["laptop", LAPTOP], ["phone", PHONE]]) {
    const page = await browser.newPage({ viewport: size });
    await serveDependenciesLocally(page);
    await page.goto(TEPE);
    await ready(page);
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => {
      const p = document.querySelector(".human-intro .human-text p").getBoundingClientRect();
      const mid = [(p.left + p.right) / 2, p.top + 8];
      const out = { words: TepeMountain.quiet(...mid), margin: TepeMountain.quiet(8, innerHeight / 2), gap: TepeMountain.quiet(innerWidth / 2, p.top - 30) };
      // What is laid over it: on a wide window a band the stylesheet draws,
      // its stops in the paper's colour; on a phone a picture of the words.
      const band = document.querySelector(".tepe-veil-band"), pic = document.querySelector("canvas.tepe-veil");
      out.band = !band.hidden && getComputedStyle(band).backgroundImage;
      if (!pic.hidden) { const d = pic.getContext("2d"), k = pic.width / innerWidth; out.veil = d.getImageData(Math.floor(mid[0] * k), Math.floor(mid[1] * k), 1, 1).data[3] / 255; }
      return out;
    });
    if (where === "laptop") {
      expect(r.words, "over the column").toBeCloseTo(QUIET, 2);
      expect(r.gap, "between its paragraphs too, as Ataraxia's").toBeCloseTo(QUIET, 2);
      expect(r.margin, "and the whole of itself in the margin").toBe(1);
      expect(r.band, "the band of paper laid over the column").toContain("rgba(236, 229, 210, " + (1 - QUIET).toFixed(2));
      expect(r.band, "clear at its edges").toContain("rgba(236, 229, 210, 0)");
    } else {
      expect(r.margin, "a phone: at QUIET everywhere").toBeLessThanOrEqual(QUIET + 1e-6);
      expect(r.words, "and quieter behind the words").toBeLessThan(QUIET * 0.5);
      expect(r.veil, "the veil laid over it").toBeCloseTo(1 - r.words, 1);
    }
    await page.close();
  }
});

/* SMOOTH ("Make sure that the page runs smoothly ... including the ones that
   ensure that it runs smoothly on the phone"): the mountain is drawn again
   only when the camera has moved, the trails' dashes and the clouds every
   other frame — so the page scrolls at full frames on a phone. On a
   machine without a graphics card (as this one is) a picture of the
   mountain takes a few tens of milliseconds, and is made at most five
   times a second there. */
for (const [where, size, phone] of [["a laptop", LAPTOP, false], ["a phone", PHONE, true]]) {
  test(`Apoteker Tepe is quick to draw and scroll on ${where}`, async ({ browser }) => {
    test.setTimeout(60000);
    const context = await browser.newContext({ viewport: size, isMobile: phone, hasTouch: phone, deviceScaleFactor: phone ? 3 : 1 });
    const page = await context.newPage();
    await serveDependenciesLocally(page);
    await page.goto(TEPE);
    await ready(page);
    await page.waitForTimeout(1500);
    const src = read("tepe.js");
    expect(src, "no mask over the window").not.toContain("destination-in");
    expect(await page.evaluate(() => TepeMountain.time(5)), "ms to draw the mountain again").toBeLessThan(await page.evaluate(() => (TepeMountain.soft() ? 110 : 24)));
    const scrolling = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); (function f() { n++; window.scrollBy(0, 5); if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(n / 2); })(); }));
    expect(scrolling, "frames a second, scrolling").toBeGreaterThan(phone ? 30 : 24);
    const still = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(f); else res(n / 1.5); })(); }));
    expect(still, "frames a second, read").toBeGreaterThan(phone ? 40 : 30);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), "nothing wider than the window").toBeLessThanOrEqual(size.width);
    await context.close();
  });
}

/* FREE VIEW ("On the top right, add a button saying "free view" where you
   can look at the mountain in a free view, sort of a sandbox way. In this
   mode, i want there to be nodes on the mountain, which when hovered, will
   correspodn to different perfumes from the house"): the writing goes, a
   drag turns the mountain and the wheel brings it nearer, a node for each
   of the eight says which it is when pointed at and, pressed, goes back to
   the page at that fragrance, opened; Escape comes back too. */
test("Apoteker Tepe's free view: the mountain to look round, and a node for each fragrance", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await ready(page);
  const button = page.locator(".tepe-free");
  await expect(button).toHaveText(/free view/i);
  const box = await button.boundingBox();
  expect(box.x + box.width, "at the top right").toBeGreaterThan(1440 - 40);
  expect(box.y).toBeLessThan(40);
  await button.click();
  await expect(page.locator("html")).toHaveClass(/tepe-free-on/);
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".page-main")).toHaveCSS("opacity", "0", { timeout: 3000 });
  await expect(page.locator(".tepe-node")).toHaveCount(8);
  const names = await page.evaluate(() => TepeMountain.nodes().map((d) => d.name));
  expect(names).toEqual(["Kogen", "The Holy Mountain", "Brother Night", "Karasu", "The Peradam", "Pale Fire", "Anabasis", "After the Flood"]);
  // Turned by a drag, brought nearer by the wheel.
  await page.waitForTimeout(1500);
  const c0 = await page.evaluate(() => TepeMountain.camera());
  await page.mouse.move(400, 700);
  await page.mouse.down();
  await page.mouse.move(600, 690, { steps: 6 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => TepeMountain.camera().yaw), { timeout: 3000 }).toBeGreaterThan(c0.yaw + 0.5);
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, -400);
  await expect.poll(() => page.evaluate(() => TepeMountain.camera().S), { timeout: 3000 }).toBeGreaterThan(c0.S * 1.3);
  // Back to where it was fitted, and the summit's node pointed at.
  await page.keyboard.press("0");
  await page.waitForTimeout(1500);
  const seen = await page.evaluate(() => TepeMountain.nodes().filter((d) => d.seen));
  expect(seen.length, "most of the nodes can be seen").toBeGreaterThanOrEqual(5);
  const holy = seen.find((d) => d.name === "The Holy Mountain");
  expect(holy, "the summit's node").toBeTruthy();
  await page.mouse.move(holy.x, holy.y);
  const card = page.locator(".tepe-card");
  await expect(card).toBeVisible();
  await expect(card).toContainText("The Holy Mountain");
  await expect(card).toContainText("2015, before 2018");
  // Pressed, back to the page at it, opened.
  await page.mouse.click(holy.x, holy.y);
  await expect(page.locator("html")).not.toHaveClass(/tepe-free-on/);
  await expect(page.locator("#part-02")).toHaveAttribute("open", "");
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById("part-02").getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(140);
  // And Escape leaves it as the button does.
  await button.click();
  await expect(page.locator("html")).toHaveClass(/tepe-free-on/);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveClass(/tepe-free-on/);
  await expect(button).toHaveText(/free view/i);
  expect(errors).toEqual([]);
});

/* ON A PHONE a tap on a node says which it is, and a tap on what it says
   goes to it; a drag turns it, as a mouse's does. */
test("Apoteker Tepe's free view on a phone: a tap says which, a second goes", async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  const errors = collectPageErrors(page);
  await page.goto(TEPE);
  await ready(page);
  await page.locator(".tepe-free").tap();
  await expect(page.locator("html")).toHaveClass(/tepe-free-on/);
  await page.waitForTimeout(2000);
  const seen = await page.evaluate(() => TepeMountain.nodes().filter((d) => d.seen && d.x > 20 && d.x < innerWidth - 20));
  expect(seen.length).toBeGreaterThanOrEqual(4);
  const one = seen[0];
  await page.touchscreen.tap(one.x, one.y);
  const card = page.locator(".tepe-card");
  await expect(card).toBeVisible();
  await expect(card).toContainText(one.name);
  await expect(page.locator("html"), "the first tap only says").toHaveClass(/tepe-free-on/);
  await card.tap();
  await expect(page.locator("html")).not.toHaveClass(/tepe-free-on/);
  await expect(page.locator("#part-" + one.no)).toHaveAttribute("open", "");
  expect(errors).toEqual([]);
  await context.close();
});

/* WITH REDUCED MOTION the mountain stands as the scroll puts it, at once,
   and nothing goes along the trails; WITHOUT THE SCRIPT the page is its
   writing on aged paper. */
test("Apoteker Tepe's mountain is still with reduced motion, and the page is its writing without the script", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: LAPTOP });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(TEPE);
  await ready(page);
  await page.waitForTimeout(800);
  const frames = await page.evaluate(() => new Promise((res) => {
    const c = document.querySelector(".tepe-trails"), a = c.toDataURL();
    setTimeout(() => res(a === c.toDataURL()), 700);
  }));
  expect(frames, "the trails still").toBe(true);
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(150);
  const turned = await page.evaluate(() => TepeMountain.turn());
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => TepeMountain.turn()), "turned at once, as the scroll puts it").toBeCloseTo(turned, 6);
  await context.close();

  const bare = await browser.newPage();
  await serveDependenciesLocally(bare);
  await bare.route(/tepe(-data|-gl)?\.js/, (r) => r.abort());
  const errors = collectPageErrors(bare, ["ERR_FAILED"]);
  await bare.goto(TEPE);
  await expect(bare.locator(".human-part")).toHaveCount(8);
  await expect(bare.locator(".tepe-free"), "no free view without the mountain").toHaveCount(0);
  await bare.locator(".human-part > summary").first().click();
  await expect(bare.locator(".human-part").first()).toHaveAttribute("open", "");
  expect(errors).toEqual([]);
  await bare.close();
});

/* THE MOTIF ON THE HOUSES VIEW (2026-10-20 — "fragments of the mountains and
   the lines in the actual page will appear, and the lines will move as if
   along the path. Make it not too flashy, but make it pretty"; and, later,
   "apply the above changes to be true for the house in SD"): a few
   fragments at once, whole on the window, apart from each other — one of
   them the piece the house's sign is on — drawn as the page draws its
   mountain. */
test("Apoteker Tepe's motif on the Houses view is fragments of its mountain, one carrying its sign", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto("/scent-descriptions/#house-13");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect(page.locator("#sheet")).toHaveAttribute("data-front", "13");
  await expect.poll(() => page.evaluate(() => window.HouseMotifs.ridges().length), { timeout: 15000 }).toBeGreaterThanOrEqual(2);
  await page.waitForTimeout(2500);
  const ridges = await page.evaluate(() => window.HouseMotifs.ridges());
  expect(ridges.length).toBeLessThanOrEqual(4);
  expect(ridges.filter((r) => r.sign).length, "one, and only one, carries the house's sign").toBe(1);
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
  expect(read("motifs.js"), "drawn by the page's own drawing").toContain("window.TepeGL.make");
  expect(errors).toEqual([]);
});

/* THE TOOL wrote the data, with image-js, and the colour with the
   satellite's picture, and says so. */
test("Apoteker Tepe's mountain is written by its tool, with image-js", () => {
  const tool = read("tools/apoteker/mountain.mjs");
  expect(tool).toContain('from "image-js"');
  expect(tool).toContain('from "geotiff"');
  expect(tool).toContain("Sentinel-2");
  const data = read("tepe-data.js");
  expect(data).toMatch(/tools\/apoteker\/mountain\.mjs/);
  const colour = JSON.parse(data.slice(data.indexOf("{"), data.lastIndexOf("}") + 1)).colour;
  expect(fs.existsSync(path.join(__dirname, "..", colour)), "the colour it wrote is there").toBe(true);
  const pkg = JSON.parse(read("package.json"));
  expect(pkg.devDependencies["image-js"], "image-js for the tool only").toBeTruthy();
  expect(pkg.devDependencies.geotiff, "and geotiff").toBeTruthy();
});

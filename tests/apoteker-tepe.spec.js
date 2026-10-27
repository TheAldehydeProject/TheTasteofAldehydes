// ============================================================
// THE THIRTEENTH HOUSE — Apoteker Tepe (2026-10-20).
//
//   THE PAGE      eight fragrances, each saying when it was made, as the
//                 owner asked: "0000, before/after 0000" against 2018 —
//                 and their pictures a little further off ("zoom out the
//                 images a little; they are out of frame"); its pictures
//                 credited.
//   THE HILL      since 2026-10-27, at its head: the owner's own photograph
//                 AT MOUNTAIN 5 ("try something new ... use the image numbver
//                 5 from the mountains. make it look cool, make it
//                 minimalist"), its sky cut away so the mountain stands on the
//                 paper, printed in the house's green, contour lines echoing
//                 the ridge, a mark at the summit — and split along a fault
//                 three quarters of the way across ("split the montain ...
//                 3/4 of the way to the right in a semi-diagonal line and
//                 insert something in the split"), the right block moved off
//                 it, the house's eight juices in the split, numbered, and a
//                 section line up out of it. It opens as one movement and
//                 opens further as the page is scrolled ("Make it smoother,
//                 animate it on scrolling and opening; and make it all more
//                 coherent so there arent any weird edges"). Written by
//                 tools/apoteker/hill.py; tepe.js does the scroll. (The
//                 frosted glass it replaced, the same day, is gone.)
//   NO 3D MOUNTAIN  Mount Athos in three dimensions, its trails, its free
//                 view and its fragments on the Houses view were taken out on
//                 2026-10-22 ("remove the mountain"), with their scripts
//                 (tepe-gl.js, tepe-data.js and the old tepe.js), pictures and
//                 tools; the Houses view brings nothing up for the house.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const ROOT = path.join(__dirname, "..");
const TEPE = "/houses/apoteker-tepe.html";
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const LAPTOP = { width: 1440, height: 900 }, PHONE = { width: 390, height: 844 };

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
   ("Please credit it"), and the mountain at the head of the page the
   owner's own photograph. */
test("Apoteker Tepe credits its pictures, and the mountain as the owner's own", async ({ page }) => {
  await page.goto(TEPE);
  const credits = page.locator(".house-credit");
  await expect(credits).toHaveCount(1);
  await expect(credits).toContainText("apotekertepe.net");
  await expect(credits.locator('a[href*="scentorium.eu"]')).toHaveText("Scentorium");
  await expect(credits).toContainText("The mountain at the head of the page is my own photograph.");
  await expect(credits, "the 3D mountain's credit gone with it").not.toContainText("Mount Athos");
});

/** The hill, read off the page: where its box stands, how far the right
    block has been moved off the fault (css px), how open the split is, and
    what is in it. */
const hillOf = (page) => page.evaluate(() => {
  const box = document.querySelector(".tepe-hill-box"), b = box.getBoundingClientRect();
  const right = document.querySelector(".tepe-hill-right");
  const [tx, ty] = (getComputedStyle(right).translate || "0 0").split(" ").map((v) => parseFloat(v) || 0);
  const lands = [...document.querySelectorAll(".tepe-hill-land")];
  return {
    box: { x: b.x, y: b.y + scrollY, w: b.width, h: b.height },
    open: +getComputedStyle(box).getPropertyValue("--open"),
    moved: { x: tx, y: ty },
    lands: lands.map((i) => ({ w: i.naturalWidth, h: i.naturalHeight, src: i.getAttribute("src"), alt: i.getAttribute("alt"), clip: getComputedStyle(i).clipPath })),
    contours: [...document.querySelectorAll(".tepe-hill-lines")].map((s) => s.querySelectorAll(".tepe-contour").length),
    juices: document.querySelectorAll("#tepe-juice stop").length,
    seam: +getComputedStyle(document.querySelector(".tepe-seam")).opacity,
    numbers: [...right.querySelectorAll(".tepe-stratum-no")].map((n) => n.textContent),
    end: document.querySelector(".tepe-section-end").textContent,
    intro: document.querySelector(".human-intro").getBoundingClientRect().top + scrollY,
    title: document.querySelector(".human-head h1").getBoundingClientRect().bottom + scrollY,
    wide: document.documentElement.scrollWidth,
  };
});
const settled = (page) => page.waitForFunction(() => {
  const box = document.querySelector(".tepe-hill-box");
  return box && getComputedStyle(box).getPropertyValue("--open").trim() === "1" && box.getAnimations({ subtree: true }).every((a) => a.playState !== "running");
}, null, { timeout: 15000 });

/* THE HILL, on a laptop and a phone: the photograph arrives, its sky cut
   away (see-through above the ridge, solid in the land); four contour lines
   on each block; the title in the paper's sky and the introduction
   beginning where the mountain is let go; the fault three quarters of the
   way across the window; once opened, the right block moved off it up and
   to the right, the split showing the eight juices, numbered 01 to 08 on
   the right block, and the section line's letter; the page asks for none of
   the 3D mountain's scripts, and nothing is wider than the window. */
for (const [where, size] of [["a laptop", LAPTOP], ["a phone", PHONE]]) {
  test(`Apoteker Tepe's head is the owner's mountain, cut out of its sky and split three quarters across, on ${where}`, async ({ page }) => {
    const errors = collectPageErrors(page);
    const asked = [];
    page.on("request", (r) => { if (/tepe-(data|gl)\.js/.test(r.url())) asked.push(r.url()); });
    await page.setViewportSize(size);
    await page.goto(TEPE);
    await settled(page);
    await page.waitForFunction(() => [...document.querySelectorAll(".tepe-hill-land")].every((i) => i.complete && i.naturalWidth));
    const h = await hillOf(page);
    expect(asked, "none of the 3D mountain's scripts").toEqual([]);
    expect(h.lands.map((l) => [l.w, l.h]), "the same picture for both blocks").toEqual([[2108, 1405], [2108, 1405]]);
    expect(h.lands[0].src).toBe(h.lands[1].src);
    expect(h.lands[0].alt, "described once").toMatch(/my own photograph/);
    expect(h.lands[1].alt, "and the right block's copy left undescribed").toBe("");
    for (const l of h.lands) expect(l.clip, "each cut to its side of the fault").toMatch(/^polygon/);
    // its sky cut away, its land solid
    const alpha = await page.evaluate(() => {
      const i = document.querySelector(".tepe-hill-land"), c = document.createElement("canvas");
      c.width = i.naturalWidth; c.height = i.naturalHeight;
      const g = c.getContext("2d"); g.drawImage(i, 0, 0);
      return { sky: g.getImageData(300, 200, 1, 1).data[3], land: g.getImageData(1000, 900, 1, 1).data[3], foot: g.getImageData(1000, 1400, 1, 1).data[3] };
    });
    expect(alpha.sky, "no sky").toBe(0);
    expect(alpha.land, "the land solid").toBe(255);
    expect(alpha.foot, "let go into the paper at its foot").toBeLessThan(20);
    expect(h.contours, "four contour lines on each block").toEqual([4, 4]);
    expect(h.title, "the title in the paper's sky, above the ridge").toBeLessThan(h.box.y + h.box.h * 0.5);
    expect(h.intro, "the introduction where the mountain is let go").toBeGreaterThan(h.box.y + h.box.h * 0.8);
    const fault = (h.box.x + h.box.w * 0.752) / size.width;
    expect(fault, "the fault three quarters of the way across").toBeGreaterThan(0.7);
    expect(fault).toBeLessThan(0.8);
    expect(h.open, "opened").toBe(1);
    expect(h.moved.x, "the right block moved off it to the right").toBeGreaterThan(size.width < 700 ? 6 : 20);
    expect(h.moved.y, "and up").toBeLessThan(0);
    expect(h.seam, "the split shown").toBe(1);
    expect(h.juices, "the house's eight juices").toBe(8);
    expect(h.numbers).toEqual(["01", "02", "03", "04", "05", "06", "07", "08"]);
    expect(h.end).toBe("A");
    await expect(page.locator(".human-part")).toHaveCount(8);
    expect(h.wide, "nothing wider than the window").toBeLessThanOrEqual(size.width);
    expect(errors).toEqual([]);
  });
}

/* THE OPENING, as one movement: shut to begin with and open at the end; the
   hill rises as ONE (the box, never each block's picture on its own — two
   pictures fading over each other where they meet drew a dark line down the
   fault, "weird edges"); the split opens on its own curve after it, and the
   section line draws up out of it last. */
test("Apoteker Tepe's hill opens as one movement, the split shut and then open, with no line down the fault", async ({ page }) => {
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE, { waitUntil: "commit" });
  await page.waitForSelector(".tepe-hill-box");
  const early = await page.evaluate(() => ({
    open: +getComputedStyle(document.querySelector(".tepe-hill-box")).getPropertyValue("--open"),
    seam: +getComputedStyle(document.querySelector(".tepe-seam")).opacity,
  }));
  expect(early.open, "shut to begin with").toBeLessThan(0.2);
  expect(early.seam, "nothing of the split while it is shut").toBeLessThan(1);
  const how = await page.evaluate(() => ({
    box: getComputedStyle(document.querySelector(".tepe-hill-box")).animationName,
    lands: [...document.querySelectorAll(".tepe-hill-land")].map((i) => getComputedStyle(i).animationName),
    section: getComputedStyle(document.querySelector(".tepe-section")).animationName,
  }));
  expect(how.box, "the hill rises as one, and the split opens").toBe("tepe-rise, tepe-open");
  expect(how.lands, "never each block's picture on its own").toEqual(["none", "none"]);
  expect(how.section).toBe("tepe-up");
  await settled(page);
  expect((await hillOf(page)).open, "open at the end").toBe(1);
});

/* SCROLLED, the split opens further — the right block moved off the fault
   by up to as much again — and the lines lift off the ridge and thin, the
   whole following the page a little behind it so it glides; scrolled back
   up, the split closes to its own and the lines come home. */
test("Apoteker Tepe's split opens further as the page is scrolled, and the lines lift, and back", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await settled(page);
  const top = await hillOf(page);
  expect(await page.evaluate(() => TepeHill.wide()), "no further open at the top").toBe(0);
  await page.evaluate(() => window.scrollTo(0, document.querySelector(".tepe-hill").offsetHeight * 0.5));
  await page.waitForTimeout(150);
  const gliding = await page.evaluate(() => TepeHill.wide());
  await expect.poll(() => page.evaluate(() => TepeHill.wide()), { timeout: 4000 }).toBeGreaterThan(0.4);
  expect(gliding, "it follows a little behind the page").toBeLessThan(await page.evaluate(() => TepeHill.wide()));
  const down = await hillOf(page);
  expect(down.moved.x, "the right block further off the fault").toBeGreaterThan(top.moved.x * 1.3);
  expect(down.moved.y).toBeLessThan(top.moved.y);
  expect(await page.evaluate(() => TepeHill.lift()), "the lines lifted").toBeGreaterThan(50);
  expect(await page.evaluate(() => TepeHill.strength()), "and thinned").toBeLessThan(0.7);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => TepeHill.lift()), { timeout: 4000, message: "the lines home" }).toBe(0);
  expect(await page.evaluate(() => TepeHill.wide()), "the split back to its own").toBe(0);
  expect((await hillOf(page)).moved.x).toBeCloseTo(top.moved.x, 0);
  expect(errors).toEqual([]);
});

/* WITH REDUCED MOTION the hill simply stands, the split open from the
   first frame and still as the page is scrolled. WITHOUT THE SCRIPT it
   opens by itself all the same, and the page is its writing. */
test("Apoteker Tepe's hill stands still with reduced motion, and opens without the script", async ({ browser }) => {
  const still = await browser.newContext({ viewport: LAPTOP, reducedMotion: "reduce" });
  const page = await still.newPage();
  await serveDependenciesLocally(page);
  await page.goto(TEPE);
  const h = await hillOf(page);
  expect(h.open, "open from the first frame").toBe(1);
  expect(h.seam).toBe(1);
  expect(await page.evaluate(() => typeof window.TepeHill), "nothing moved by the scroll").toBe("undefined");
  await still.close();

  const bare = await browser.newPage({ viewport: LAPTOP });
  await serveDependenciesLocally(bare);
  await bare.route(/\/tepe\.js/, (r) => r.abort());
  const errors = collectPageErrors(bare, ["ERR_FAILED"]);
  await bare.goto(TEPE);
  await settled(bare);
  const b = await hillOf(bare);
  expect(b.open, "opened by the stylesheet alone").toBe(1);
  expect(b.moved.x).toBeGreaterThan(20);
  await expect(bare.locator(".human-part")).toHaveCount(8);
  await bare.locator(".human-part > summary").first().click();
  await expect(bare.locator(".human-part").first()).toHaveAttribute("open", "");
  expect(errors).toEqual([]);
  await bare.close();
});

/* ON THE HOUSES VIEW Apoteker Tepe at the front, resting, brings nothing
   up: its fragments of the 3D mountain went with it, until the owner
   redesigns it. */
test("Apoteker Tepe brings nothing up on the Houses view, and the 3D mountain's scripts are not asked for", async ({ page }) => {
  const errors = collectPageErrors(page);
  const asked = [];
  page.on("request", (r) => { if (/tepe(-data|-gl)?\.js/.test(r.url())) asked.push(r.url()); });
  await page.setViewportSize(LAPTOP);
  await page.goto("/scent-descriptions/#house-13");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect(page.locator("#sheet")).toHaveAttribute("data-front", "13");
  await page.waitForTimeout(3000);
  expect(await page.evaluate(() => window.HouseMotifs.census()), "no motif of its own").toEqual({});
  expect(asked).toEqual([]);
  expect(errors).toEqual([]);
});

/* AND NONE OF THE 3D MOUNTAIN IS LEFT IN THE CODE — as the owner's
   removals always are: its scripts, pictures, tools and the two packages
   only the tools used; nothing of it or of Free view in the stylesheet or
   the Houses view's motifs; tepe.js draws in no WebGL. NOR OF THE FROSTED
   GLASS (2026-10-27, the same day): its canvas, its panel, its thumbnails,
   the text's blending. tools/apoteker/ holds the hill's tool alone. */
test("none of Apoteker Tepe's 3D mountain, nor its frosted glass, is left in the code", () => {
  for (const gone of ["tepe-gl.js", "tepe-data.js", "tools/apoteker/mountain.mjs", "tools/apoteker/fine.mjs", "tools/apoteker/osm.py",
    "images/Apoteker Tepe/mountain", "images/Apoteker Tepe/mountain-thumbs", "tests/tepe-look.spec.js"]) {
    expect(fs.existsSync(path.join(ROOT, gone)), gone).toBe(false);
  }
  expect(fs.readdirSync(path.join(ROOT, "tools", "apoteker")), "the hill's tool alone").toEqual(["hill.py"]);
  for (const page of ["houses/apoteker-tepe.html", "scent-descriptions/index.html"]) {
    expect(read(page), page).not.toMatch(/tepe-(data|gl)\.js/);
  }
  expect(read("scent-descriptions/index.html"), "the Houses view loads no tepe.js").not.toMatch(/tepe\.js/);
  const tepe = read("tepe.js");
  for (const gone of ["webgl", "TepeGL", "TEPE.", "TepeMountain", "Athos", "TepePhoto", "tepe-try"]) expect(tepe, gone).not.toContain(gone);
  const css = read("style.css");
  for (const gone of ["tepe-free", "tepe-stage", "tepe-node", "tepe-card", "tepe-trails", "tepe-drawn", "tepe-ground", "house-credit-ground",
    "tepe-photo", "tepe-try", "data-tepe-text", "--tepe-text-blend"]) expect(css, gone).not.toContain(gone);
  const html = read("houses/apoteker-tepe.html");
  for (const gone of ["tepe-photo", "human-field", "data-tepe-text"]) expect(html, gone).not.toContain(gone);
  expect(html, "the hill written by its tool").toContain("<!-- THE HILL: begin — written by tools/apoteker/hill.py, never by hand. -->");
  const motifs = read("motifs.js");
  for (const gone of ["TepeGL", "RIDGE_", "function ridge", "ridges()"]) expect(motifs, gone).not.toContain(gone);
  const pkg = JSON.parse(read("package.json"));
  expect(Object.keys(pkg.devDependencies), "image-js and geotiff, for its tools only").toEqual(["@playwright/test", "three"]);
});

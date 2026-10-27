// ============================================================
// THE THIRTEENTH HOUSE — Apoteker Tepe (2026-10-20).
//
//   THE PAGE      eight fragrances, each saying when it was made, as the
//                 owner asked: "0000, before/after 0000" against 2018 —
//                 and their pictures a little further off ("zoom out the
//                 images a little; they are out of frame"); its pictures
//                 credited.
//   THE MOUNTAIN  since 2026-10-27, a trial: the owner's own photograph
//                 (AT MOUNTAIN 1 to 5) behind frosted glass, blurred out and
//                 misted but for a window on the right-ish middle where it is
//                 sharp, after the Musica 2011 poster ("The mountain should be
//                 blurred out, except for a mask on the right-ish middle of
//                 the screen") — A SHARP RECTANGLE, upright, cut clean ("I
//                 want the mask to be a sharp rctangle, as it was with the
//                 horse picture"), sharp to its edge, the frost blurred hard
//                 right outside it and more further out, a white line round
//                 it laid on as a screen; drawn once, by tepe.js, on a canvas
//                 fixed to the window. THE PANEL at the top right switches
//                 between the five and turns on colours, filters and the
//                 text's blending ("let me see how its going to look with
//                 each of them ... Add optional filters too"; "allow a person
//                 to change the blending of the text"), kept in the address.
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
   ("Please credit it"), and the mountain behind the page the owner's own
   photograph (the site's own mark is on each). */
test("Apoteker Tepe credits its pictures, and the mountain as the owner's own", async ({ page }) => {
  await page.goto(TEPE);
  const credits = page.locator(".house-credit");
  await expect(credits).toHaveCount(1);
  await expect(credits).toContainText("apotekertepe.net");
  await expect(credits.locator('a[href*="scentorium.eu"]')).toHaveText("Scentorium");
  await expect(credits).toContainText("The mountain behind the page is my own photograph.");
  await expect(credits, "the 3D mountain's credit gone with it").not.toContainText("Mount Athos");
});

const drawn = (page) => page.waitForFunction(() => window.TepePhoto && TepePhoto.drawn(), null, { timeout: 30000 });
/** How busy the drawing is round (x, y), css px — the mean difference
    between a pixel and the next, across a box `r` each way — and how pale. */
const look = (page, x, y, r) => page.evaluate(([x, y, r]) => {
  const c = document.querySelector(".tepe-photo"), k = c.width / c.clientWidth, g = c.getContext("2d");
  const x0 = Math.max(0, Math.round((x - r) * k)), y0 = Math.max(0, Math.round((y - r) * k));
  const w = Math.min(c.width - x0, Math.round(2 * r * k)), h = Math.min(c.height - y0, Math.round(2 * r * k));
  const d = g.getImageData(x0, y0, w, h).data;
  let busy = 0, n = 0, L = 0, sat = 0;
  for (let j = 0; j < h; j++) for (let i = 0; i < w - 1; i++) {
    const a = (j * w + i) * 4;
    busy += Math.abs(d[a] - d[a + 4]) + Math.abs(d[a + 1] - d[a + 5]) + Math.abs(d[a + 2] - d[a + 6]);
    L += 0.2126 * d[a] + 0.7152 * d[a + 1] + 0.0722 * d[a + 2];
    sat += Math.max(d[a], d[a + 1], d[a + 2]) - Math.min(d[a], d[a + 1], d[a + 2]);
    n++;
  }
  return { busy: busy / n, light: L / n, sat: sat / n };
}, [x, y, r]);

/** The window as drawn, and its edge, all round it: `inner`, how busy a
    strip just inside the line is (the mean step, the three colours summed,
    from a pixel to the next along the edge); `outer`, the same just outside
    it; `line`, the line's palest pixels' least colour (white is 255). */
const edgeOf = (page) => page.evaluate(() => {
  const c = document.querySelector(".tepe-photo"), k = c.width / c.clientWidth, g = c.getContext("2d");
  const R = TepePhoto.windowRect(), W = c.width, d = g.getImageData(0, 0, c.width, c.height).data;
  const px = (x, y) => (y * W + x) * 4;
  const diff = (a, b) => Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]);
  const lw = Math.round(R.line * k), half = Math.floor(lw / 2);
  const x0 = Math.round(R.x * k) - half, y0 = Math.round(R.y * k) - half;
  const x1 = Math.round((R.x + R.w) * k) - half + lw, y1 = Math.round((R.y + R.h) * k) - half + lw;
  let inner = 0, outer = 0, n = 0, line = 0, m = 0;
  const at = (x, y) => Math.min(d[px(x, y)], d[px(x, y) + 1], d[px(x, y) + 2]);
  for (let s = 3; s <= 9; s += 3) {
    for (let y = y0 + 12; y < y1 - 12; y += 2) {
      inner += diff(px(x0 + lw + s, y), px(x0 + lw + s, y + 1)) + diff(px(x1 - lw - s, y), px(x1 - lw - s, y + 1));
      outer += diff(px(x0 - s, y), px(x0 - s, y + 1)) + diff(px(x1 + s, y), px(x1 + s, y + 1));
      n += 2;
    }
    for (let x = x0 + 12; x < x1 - 12; x += 2) {
      inner += diff(px(x, y0 + lw + s), px(x + 1, y0 + lw + s)) + diff(px(x, y1 - lw - s), px(x + 1, y1 - lw - s));
      outer += diff(px(x, y0 - s), px(x + 1, y0 - s)) + diff(px(x, y1 + s), px(x + 1, y1 + s));
      n += 2;
    }
  }
  for (let y = y0 + 4; y < y1 - 4; y += 3) { line += at(x0 + half, y) + at(x1 - 1 - half, y); m += 2; }
  return { rect: R, inner: inner / n, outer: outer / n, line: line / m };
});

/* BEHIND FROSTED GLASS: on a laptop and a phone, the photograph is drawn,
   blurred out and pale everywhere but the window on the right-ish middle,
   where it is sharp — an upright rectangle, sharp right up to its edge
   ("On the inside, no feather whatsoever") and the frost already well
   blurred right outside it ("The blur should be way more intense nex to
   the masks border"), with THE LINE round it, white, laid on as a screen,
   three css px ("make the border thicker by a factor of 3"); no halo round
   the letters ("remove the white shadow"); the page asks for none of the
   3D mountain's scripts, and nothing is wider than the window. */
for (const [where, size] of [["a laptop", LAPTOP], ["a phone", PHONE]]) {
  test(`Apoteker Tepe's mountain is blurred out behind frosted glass but for a window on the right-ish middle, on ${where}`, async ({ page }) => {
    const errors = collectPageErrors(page);
    const asked = [];
    page.on("request", (r) => { if (/tepe-(data|gl)\.js/.test(r.url())) asked.push(r.url()); });
    await page.setViewportSize(size);
    await page.goto(TEPE);
    await drawn(page);
    expect(asked, "none of the 3D mountain's scripts").toEqual([]);
    await expect(page.locator("html")).toHaveClass(/tepe-photo-drawn/);
    const at = await page.evaluate(() => TepePhoto.clearAt());
    expect(at.x / size.width, "right of the middle").toBeGreaterThan(0.6);
    expect(at.y / size.height, "half way down").toBeCloseTo(0.5, 1);
    const sharp = await look(page, at.x, at.y, 30), frost = await look(page, size.width * 0.12, size.height * 0.5, 30);
    expect(sharp.busy, "sharp in the window").toBeGreaterThan(frost.busy * 3);
    expect(frost.light, "pale in the frost").toBeGreaterThan(sharp.light);
    expect(frost.busy, "the frost has nothing sharp in it").toBeLessThan(4);
    const edge = await edgeOf(page);
    expect(edge.rect.h / edge.rect.w, "an upright rectangle, 2 : 3").toBeCloseTo(1.5, 1);
    expect(edge.rect.x + edge.rect.w / 2, "round its middle").toBeCloseTo(at.x, -1);
    expect(edge.rect.y + edge.rect.h / 2).toBeCloseTo(at.y, -1);
    expect(edge.rect.edge, "the frost half blurred already at the edge, to begin with").toBe(0.5);
    expect(edge.rect.near, "so nothing outside the window is drawn sharp").toBe(0);
    expect(edge.inner, "sharp right up to the line").toBeGreaterThan(edge.outer * 2.5);
    expect(edge.outer, "and blurred right outside it").toBeLessThan(4);
    expect(edge.rect.line, "the line three css px").toBeGreaterThanOrEqual(3);
    expect(edge.line, "white").toBeGreaterThan(205);
    expect(await page.evaluate(() => getComputedStyle(document.querySelector(".human-intro p")).textShadow), "no halo round the letters").toBe("none");
    // Drawn once, not every frame, at the flat drawing's sharpness (1.5 on a phone).
    const r = await page.evaluate(() => { const c = document.querySelector(".tepe-photo"); return c.width / c.clientWidth; });
    expect(r).toBeLessThanOrEqual(size.width < 700 ? 1.5 : 2);
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => TepePhoto.drawn() && document.querySelector(".tepe-photo").dataset.draft), "not drawn again by a scroll").toBe("no");
    await expect(page.locator(".human-part")).toHaveCount(8);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), "nothing wider than the window").toBeLessThanOrEqual(size.width);
    expect(errors).toEqual([]);
  });
}

/* THE PANEL at the top right: the five pictures, each switched to and drawn;
   the address keeps the one chosen; the thumbnails arrive. */
test("Apoteker Tepe's panel at the top right switches between the five pictures, kept in the address", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await drawn(page);
  const open = page.locator(".tepe-try-open");
  const box = await open.boundingBox();
  expect(box.x + box.width, "at the top right").toBeGreaterThan(LAPTOP.width - 60);
  expect(box.y).toBeLessThan(40);
  await expect(open).toContainText("1 / 5");
  await open.click();
  await expect(page.locator(".tepe-try-panel")).toBeVisible();
  const thumbs = page.locator(".tepe-try-pic");
  await expect(thumbs).toHaveCount(5);
  expect(await page.evaluate(() => TepePhoto.pictures()), "the owner's five").toEqual(["AT MOUNTAIN 1.webp", "AT MOUNTAIN 2.webp", "AT MOUNTAIN 3.webp", "AT MOUNTAIN 4.webp", "AT MOUNTAIN 5.webp"]);
  for (let n = 1; n <= 5; n++) {
    expect(fs.existsSync(path.join(ROOT, "images", "Apoteker Tepe", `AT MOUNTAIN ${n}.webp`)), `AT MOUNTAIN ${n}`).toBe(true);
    await thumbs.nth(n - 1).click();
    await expect(page.locator(".tepe-photo")).toHaveAttribute("data-mountain", String(n));
    await drawn(page);
    await expect(thumbs.nth(n - 1)).toHaveAttribute("aria-pressed", "true");
    await expect(open).toContainText(`${n} / 5`);
    expect(new URL(page.url()).searchParams.get("mountain"), "kept in the address").toBe(n === 1 ? null : String(n));
  }
  const broken = await page.locator(".tepe-try-pic img").evaluateAll((list) => Promise.all(list.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))).then(() => list.filter((i) => !i.naturalWidth).length));
  expect(broken, "the thumbnails arrive").toBe(0);
  // Escape puts it away.
  await page.keyboard.press("Escape");
  await expect(page.locator(".tepe-try-panel")).toBeHidden();
  expect(errors).toEqual([]);
});

/* THE FILTERS ("Add optional filters too so that i can have fun with it"):
   black and white takes the colour out; a filter is kept in the address and
   comes back with it; Reset puts it all back. */
test("Apoteker Tepe's colours and filters change the drawing, come back with the address, and reset", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE + "?mountain=2");
  await drawn(page);
  const at = await page.evaluate(() => TepePhoto.clearAt());
  const before = await look(page, at.x, at.y, 40);
  await page.locator(".tepe-try-open").click();
  await page.locator('.tepe-try-chip[data-colour="bw"]').click();
  await expect.poll(() => page.evaluate(() => TepePhoto.drawn() && TepePhoto.state().colour)).toBe("bw");
  await drawn(page);
  const grey = await look(page, at.x, at.y, 40);
  expect(grey.sat, "no colour left").toBeLessThan(3);
  expect(before.sat).toBeGreaterThan(10);
  // the Edge: turned down, the frost right outside the window is blurred
  // less, and the feather near it is drawn at the whole sharpness
  const blurred = await edgeOf(page);
  await page.locator('.tepe-try-slider input[data-k="edge"]').fill("0");
  await expect.poll(() => page.evaluate(() => TepePhoto.drawn() && TepePhoto.state().edge)).toBe(0);
  await drawn(page);
  const nearer = await edgeOf(page);
  expect(nearer.rect.near, "the feather drawn sharp near the window").toBeGreaterThan(0);
  expect(nearer.outer, "less blurred right outside it").toBeGreaterThan(blurred.outer * 1.5);
  // the Feather
  await page.locator('.tepe-try-slider input[data-k="feather"]').fill("10");
  await expect.poll(() => page.evaluate(() => TepePhoto.state().feather)).toBe(10);
  await page.locator('.tepe-try-chip[data-fx="grain"]').click();
  await page.locator('.tepe-try-chip[data-fx="vignette"]').click();
  await expect.poll(() => new URL(page.url()).searchParams.get("fx")).toBe("vignette,grain");
  expect(new URL(page.url()).searchParams.get("colour")).toBe("bw");
  // a slider, drawn at half while it moves and whole once let go
  await page.locator('.tepe-try-slider input[data-k="window"]').fill("80");
  await expect.poll(() => page.evaluate(() => TepePhoto.state().window)).toBe(80);
  // the address brings it all back
  await page.reload();
  await drawn(page);
  expect(await page.evaluate(() => TepePhoto.state())).toMatchObject({ mountain: 2, colour: "bw", fx: ["vignette", "grain"], window: 80, edge: 0, feather: 10 });
  // and Reset puts it back as it was
  await page.locator(".tepe-try-open").click();
  await page.locator(".tepe-try-reset").click();
  await drawn(page);
  expect(await page.evaluate(() => TepePhoto.state())).toMatchObject({ mountain: 1, colour: "natural", fx: [], window: 50, edge: 50, feather: 25, text: "normal" });
  expect(new URL(page.url()).search, "nothing left in the address").toBe("");
  expect(errors).toEqual([]);
});

/* THE TEXT'S BLENDING ("allow a person to change the blending of the
   text"): the eight in the panel; one chosen is laid on the writing's own
   blocks — the head, the introduction, a part's summary, the credit, the
   foot — and never on a picture, the parts' row let go of its own layer so
   they blend with the mountain; Invert turns the writing over first; kept
   in the address; Normal takes it all off. */
test("Apoteker Tepe's text can be blended over the mountain, never its pictures, kept in the address", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize(LAPTOP);
  await page.goto(TEPE);
  await drawn(page);
  await page.locator(".tepe-try-open").click();
  const chips = page.locator(".tepe-try-chip[data-text]");
  await expect(chips).toHaveCount(8);
  await expect(page.locator('.tepe-try-chip[data-text="normal"]')).toHaveAttribute("aria-pressed", "true");
  const modes = () => page.evaluate(() => {
    const of = (sel) => getComputedStyle(document.querySelector(sel));
    return {
      head: of(".human-head").mixBlendMode, intro: of(".human-intro").mixBlendMode,
      title: of(".human-part > summary .human-title").mixBlendMode, credit: of(".house-credit").mixBlendMode,
      thumb: of(".human-part > summary .human-thumb").mixBlendMode, plate: of(".human-plate").mixBlendMode,
      parts: of(".human-parts").zIndex, filter: of(".human-intro").filter,
    };
  });
  expect(await modes(), "nothing blended to begin with").toMatchObject({ head: "normal", intro: "normal", title: "normal" });
  await page.locator('.tepe-try-chip[data-text="multiply"]').click();
  await expect(page.locator("html")).toHaveAttribute("data-tepe-text", "multiply");
  expect(await modes()).toMatchObject({ head: "multiply", intro: "multiply", title: "multiply", credit: "multiply", thumb: "normal", plate: "normal", parts: "auto", filter: "none" });
  await expect.poll(() => new URL(page.url()).searchParams.get("text")).toBe("multiply");
  await page.locator('.tepe-try-chip[data-text="invert"]').click();
  expect(await modes()).toMatchObject({ intro: "difference", filter: "invert(1)", plate: "normal" });
  // the address brings it back
  await page.goto(TEPE + "?text=softlight");
  await drawn(page);
  await expect(page.locator("html")).toHaveAttribute("data-tepe-text", "softlight");
  expect((await modes()).intro).toBe("soft-light");
  // and Normal takes it off
  await page.locator(".tepe-try-open").click();
  await page.locator('.tepe-try-chip[data-text="normal"]').click();
  await expect(page.locator("html")).not.toHaveAttribute("data-tepe-text", /./);
  expect(await modes()).toMatchObject({ intro: "normal", parts: "1" });
  expect(new URL(page.url()).searchParams.get("text"), "nothing in the address for Normal").toBe(null);
  expect(errors).toEqual([]);
});

/* ON A PHONE the button stands at the top right on the chrome's ground and
   its panel fits the window. WITHOUT THE SCRIPT the page is its writing on
   the aged paper, with no button. */
test("Apoteker Tepe's panel fits a phone, and the page is its writing without the script", async ({ browser }) => {
  const context = await browser.newContext({ viewport: PHONE, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(TEPE);
  await drawn(page);
  await page.locator(".tepe-try-open").tap();
  const panel = await page.locator(".tepe-try-panel").boundingBox();
  expect(panel.x, "inside the window").toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(PHONE.width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(PHONE.width);
  await context.close();

  const bare = await browser.newPage();
  await serveDependenciesLocally(bare);
  await bare.route(/\/tepe\.js/, (r) => r.abort());
  const errors = collectPageErrors(bare, ["ERR_FAILED"]);
  await bare.goto(TEPE);
  await expect(bare.locator(".human-part")).toHaveCount(8);
  await expect(bare.locator(".tepe-try"), "no panel without the script").toHaveCount(0);
  expect(await bare.evaluate(() => getComputedStyle(document.querySelector(".tepe-photo")).opacity), "nothing drawn over the paper").toBe("0");
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
   the Houses view's motifs; the new tepe.js draws a photograph, in no
   WebGL. */
test("none of Apoteker Tepe's 3D mountain is left in the code", () => {
  for (const gone of ["tepe-gl.js", "tepe-data.js", "tools/apoteker", "images/Apoteker Tepe/mountain", "tests/tepe-look.spec.js"]) {
    expect(fs.existsSync(path.join(ROOT, gone)), gone).toBe(false);
  }
  for (const page of ["houses/apoteker-tepe.html", "scent-descriptions/index.html"]) {
    expect(read(page), page).not.toMatch(/tepe-(data|gl)\.js/);
  }
  expect(read("scent-descriptions/index.html"), "the Houses view loads no tepe.js").not.toMatch(/tepe\.js/);
  const tepe = read("tepe.js");
  for (const gone of ["webgl", "TepeGL", "TEPE.", "TepeMountain", "Athos"]) expect(tepe, gone).not.toContain(gone);
  const css = read("style.css");
  for (const gone of ["tepe-free", "tepe-stage", "tepe-node", "tepe-card", "tepe-trails", "tepe-drawn", "tepe-ground", "house-credit-ground"]) expect(css, gone).not.toContain(gone);
  const motifs = read("motifs.js");
  for (const gone of ["TepeGL", "RIDGE_", "function ridge", "ridges()"]) expect(motifs, gone).not.toContain(gone);
  const pkg = JSON.parse(read("package.json"));
  expect(Object.keys(pkg.devDependencies), "image-js and geotiff, for its tools only").toEqual(["@playwright/test", "three"]);
});

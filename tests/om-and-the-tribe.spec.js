// ============================================================
// HOUSES TEN TO TWELVE — Om Parfums, Outsider Parfums and Lost Tribe
// (2026-10-10), and the Houses view's motifs for them.
//
//   OM            opens SHATTERED: the page in floating pieces round โอม,
//                 the page itself held back underneath — and one click
//                 brings them together and it stays whole; on a phone they
//                 come together by themselves. Never with reduced motion,
//                 an address at one fragrance, or ?om=whole.
//   ITS WRITING   the owner's two dropdowns, one inside the other, and the
//                 line they asked to have drawn.
//   OUTSIDER      Om's drawing without the shatter, its name arriving with
//                 its echo.
//   LOST TRIBE    field notes in the margins, and the house's other
//                 fragrances in one line.
//
// What these pages look like is checked by eye; these check they work.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const OM = "/houses/om-parfums.html";
const OUTSIDER = "/houses/outsider-parfums.html";
const TRIBE = "/houses/lost-tribe.html";
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* IN PIECES, AND ONE CLICK BRINGS IT TOGETHER — the owner: "making the
   page fragmented, and then when you interact with it, it kinda shifts
   together again and starts being coherent", and their answer, "Whole page,
   one click". The pieces are laid over the page in a closed shadow root, so
   nothing else on the page can find them: the page's own writing is there
   once, under them, and only held back. */
test("Om opens in pieces and one click brings it together, for good", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.goto(OM);
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  await expect(root).toHaveClass(/om-shattered/);
  await expect(page.locator(".om-shards")).toHaveCount(1);
  // The writing is the page's own, once: the copies cannot be found.
  await expect(page.locator(".human-part")).toHaveCount(9);
  await expect(page.locator("h1")).toHaveCount(1);
  // Held back while the pieces stand over it, and it does not scroll.
  expect(await page.locator(".human-head").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe("hidden");

  // One click anywhere.
  await page.mouse.click(700, 450);
  await expect(root).toHaveAttribute("data-om", "gathering");
  await expect(root).toHaveAttribute("data-om", "whole", { timeout: 8000 });
  await expect(page.locator(".om-shards")).toHaveCount(0, { timeout: 3000 });
  await expect(root).not.toHaveClass(/om-shattered/);
  expect(await page.locator(".human-head").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  // And whole it stays: it scrolls, and another click does nothing to it.
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await page.mouse.click(1300, 300);
  await page.waitForTimeout(400);
  await expect(root).toHaveAttribute("data-om", "whole");
  expect(errors).toEqual([]);
});

/* THE PIECES ARE CUT FROM THE PAGE: each copy of the page's flow is laid
   exactly where the page is, so when they come home what was in pieces is
   the page itself — the name stands where it will stand. */
test("Om's pieces land exactly on the page they were cut from", async ({ page }) => {
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  const before = await page.locator("h1").boundingBox();
  await page.mouse.click(700, 450);
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 8000 });
  const after = await page.locator("h1").boundingBox();
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
});

/* A KEY OR THE WHEEL BRINGS IT TOGETHER TOO, so nobody is left looking at
   pieces who did not think to click. */
test("Om's pieces come together at a key, or the wheel", async ({ page }) => {
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 8000 });
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, 200);
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 8000 });
});

/* ON A PHONE IT COMES TOGETHER BY ITSELF — "I dont want it to be on click
   fragmentation, but rather something that happens automatically given a
   slight delay on the page itself." */
test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("Om's pieces come together by themselves, after a moment", async ({ page }) => {
    await page.goto(OM);
    await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
    await page.waitForTimeout(600);
    await expect(page.locator("html"), "still in pieces a moment in").toHaveAttribute("data-om", "pieces");
    await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 9000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

/* NEVER IN PIECES with reduced motion, at an address that points at one
   fragrance, or with ?om=whole — and without its script the page is whole. */
test("Om is whole at once with reduced motion, at one fragrance, or without its script", async ({ browser }) => {
  const still = await browser.newContext({ reducedMotion: "reduce" });
  let page = await still.newPage();
  await serveDependenciesLocally(page);
  await page.goto(OM);
  await expect(page.locator(".om-shards")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  await still.close();

  const ctx = await browser.newContext();
  page = await ctx.newPage();
  await serveDependenciesLocally(page);
  await page.goto(OM + "#part-03");
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole");
  await expect(page.locator(".om-shards")).toHaveCount(0);
  await page.goto(OM + "?om=whole");
  await expect(page.locator(".om-shards")).toHaveCount(0);
  await page.route("**/om.js", (r) => r.abort());
  await page.goto(OM);
  await page.waitForLoadState("load");
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  await expect(page.locator(".human-head")).toHaveCSS("opacity", "1", { timeout: 4000 });
  await ctx.close();
});

/* โอม FROM A REAL THAI TYPEFACE — "a sylized vbersion of this symbol
   "โอม"": its three letters' outlines, and each letter's head. */
test("the โอม Om is drawn from is the three letters, from a real Thai typeface", () => {
  const src = read("om-glyph.js");
  const data = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
  expect(data.word).toBe("โอม");
  expect(data.letters.map((l) => l.ch)).toEqual(["โ", "อ", "ม"]);
  data.letters.forEach((l) => {
    expect(l.contours.length, l.ch + " has its outline").toBeGreaterThan(0);
    expect(l.heads.length, l.ch + " has its head").toBeGreaterThan(0);
  });
  expect(read("tools/om/glyph.py")).toContain("Loma");
});

/* THE OWNER'S DROPDOWNS: "make the following a collapse-able text that if
   you click it, then you reveal it", with "a sub-drop down window titled My
   Interpretation of Atman and Brahman" inside it, and the line drawn
   between the found and the fifth point. Shut to begin with, and opened on
   a measured height. */
test("Om's introduction carries the owner's dropdown, a second inside it, and the line", async ({ page }) => {
  await page.goto(OM + "?om=whole");
  const outer = page.locator(".human-intro > .human-text > .human-fold");
  await expect(outer).toHaveCount(1);
  await expect(outer.locator(":scope > summary")).toHaveText("What I found");
  const inner = outer.locator(":scope > .human-fold-text > .human-fold");
  await expect(inner).toHaveCount(1);
  await expect(inner.locator(":scope > summary")).toHaveText("My Interpretation of Atman and Brahman");
  await expect(outer).not.toHaveAttribute("open", /.*/);
  await expect(outer.locator("hr.human-rule")).toHaveCount(1);
  await expect(outer.locator("ol.human-list")).toHaveAttribute("start", "5");
  // Its writing is the owner's, in its place: the "kind" passage in the
  // inner one, the font in the outer, after the line.
  await expect(inner).toContainText("the word “kind” can only transmit so much of the meaning");
  await expect(outer.locator(":scope > .human-fold-text > p").last()).toContainText("0/10, nearly had a stroke.");
  await outer.locator(":scope > summary").click();
  await page.waitForTimeout(1000);
  await expect(outer).toHaveAttribute("open", /.*/);
  await expect(inner).not.toHaveAttribute("open", /.*/);
  await inner.locator(":scope > summary").click();
  await page.waitForTimeout(1000);
  await expect(inner).toHaveAttribute("open", /.*/);
  expect(await inner.locator(":scope > .human-fold-text").evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(100);
  // The four reasons stand as a list before it, numbered by the page.
  await expect(page.locator(".human-intro > .human-text > ol.human-list > li")).toHaveCount(4);
});

/* THE OWNER'S WORDS, with only the misspellings they agreed to have put
   right, and the repeat in Xocolate Crotch dropped. */
test("the three houses carry the owner's writing, its clear misspellings put right", async ({ page }) => {
  const om = read("houses/om-parfums.html"), out = read("houses/outsider-parfums.html"), tribe = read("houses/lost-tribe.html");
  expect(om).toContain("has banana and tomato leaf accords");
  expect(om).toContain("the traces of life of the plants and animals alike");
  expect(om).toContain("an honorable attribute");
  expect(om).toContain("way way WAY more nuanced than anything here gives them credit for");
  expect(out).toContain("a dessert plate from which the dessert was eaten");
  expect(out).toContain("peeks its head through");
  expect(out).toContain("order two completely separate things");
  expect(out).toContain('lang="ar" dir="rtl"');
  expect(tribe).toContain("Starts super abrasive");
  expect(tribe).toContain("Resin, vanilla, A LOT OF AROMATICS");
  expect(tribe).toContain("I have not had the chance to actually smell");
  // "Mid" repeated the first half of "Mid-Dry Down 1" word for word.
  await page.goto(OUTSIDER);
  const stages = await page.locator("#part-03 .human-stage").allTextContents();
  expect(stages).toEqual(["Top", "Mid-Dry Down 1", "Dry Down 2"]);
  expect((out.match(/In the late top notes; it started turning more realistic/g) || []).length).toBe(1);
});

/* OUTSIDER: "elements from Om parfums, but different and not as extreme. I
   dont want it to be fragmented" — Om's drawing, never in pieces, its name
   arriving with its echo. */
test("Outsider is Om's drawing without the pieces, its name arriving with its echo", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(OUTSIDER);
  await expect(page.locator(".om-shards")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).animationName)).toBe("outsider-echo");
  await page.waitForTimeout(800);
  // Its ground is drawn — hairlines and specks, so not many pixels, but some.
  const lit = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++;
    return n;
  });
  expect(lit).toBeGreaterThan(800);
  expect(errors).toEqual([]);
});

/* LOST TRIBE'S FIELD NOTES: the house's own stag and the creatures and
   ingredients of its six, down the margins, drawn in the house's colours;
   and its other fragrances "separated by a comma in a single line". */
test("Lost Tribe draws its field notes in the margins, and lists the rest on one line", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TRIBE);
  await page.waitForTimeout(2600);
  const margins = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const k = c.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data;
    let left = 0, right = 0;
    for (let y = 0; y < c.height; y += 3) for (let x = 0; x < c.width; x += 3) {
      if (d[(y * c.width + x) * 4 + 3] < 40) continue;
      if (x / k < 250) left++; else if (x / k > innerWidth - 250) right++;
    }
    return { left, right };
  });
  expect(margins.right, "the stag, at the head on the right").toBeGreaterThan(80);
  const after = page.locator(".human-after");
  await expect(after.locator("ul, ol, li")).toHaveCount(0);
  const line = await after.locator("p.human-unsmelled").textContent();
  const names = line.split(",").map((s) => s.trim());
  expect(names.length).toBeGreaterThan(40);
  ["Kong", "Watch King", "Pan’s Labyrinth", "Dirty Soda", "Equatorial", "Santal Absolu"].forEach((n) => expect(names, n + " has been smelled").not.toContain(n));
  await expect(after.locator(".human-unsmelled-from a")).toHaveAttribute("href", "https://losttribeperfumes.com/");
  expect(errors).toEqual([]);
});

/* THE HOUSE'S PICTURE, CROPPED — "MAKE SURE THE IMAGE IS CROPPED
   ACCORDINGLY FOR THE LOST TRIBES HOUSE IMAGE": the copy the Houses view
   shows is the frame's own shape, so nothing of the mark is cut by it. */
test("Lost Tribe's picture on the Houses view is cropped to its frame", async ({ page }) => {
  await page.goto("/scent-descriptions/");
  const img = page.locator('.sheet-frame[href="../houses/lost-tribe.html"] img');
  await expect(img).toHaveAttribute("src", "../images/Lost Tribe/house-web/lost-tribe-house.webp");
  const size = await img.evaluate((el) => new Promise((done) => {
    const check = () => (el.naturalWidth ? done([el.naturalWidth, el.naturalHeight]) : setTimeout(check, 50));
    check();
  }));
  expect(Math.abs(size[0] / size[1] - 0.86)).toBeLessThan(0.01);
});

/* THE HOVER ANIMATIONS, "related to the animations on the pages of the
   fragrances themselves": Om's shards, rings and word; Outsider's mark and
   its twin; Lost Tribe's flock, leaves and pollen. */
for (const [no, kinds] of [["10", ["shard", "omRing", "omWord"]], ["11", ["outsiderMark", "outsiderRing"]], ["12", ["flock", "leafFall", "pollenRise"]]]) {
  test(`the Houses view's motifs come up for house ${no} at the front`, async ({ page }) => {
    test.setTimeout(60000);
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/scent-descriptions/#house-" + no);
    await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
    await expect(page.locator("#sheet")).toHaveAttribute("data-front", String(+no));
    await expect.poll(() => page.evaluate(() => Object.keys(window.HouseMotifs.census())), { timeout: 15000 })
      .toEqual(expect.arrayContaining(kinds.slice(0, 1)));
    await page.waitForTimeout(3000);
    const seen = await page.evaluate(() => Object.keys(window.HouseMotifs.census()));
    kinds.forEach((k) => expect(seen, k).toContain(k));
    expect(errors).toEqual([]);
  });
}

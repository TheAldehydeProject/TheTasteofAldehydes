// ============================================================
// HOUSES TEN TO TWELVE — Om Parfums, Outsider Parfums and Lost Tribe
// (2026-10-10), and the Houses view's motifs for them.
//
//   OM            opens behind CRACKED GLASS, and is read through it: it
//                 scrolls under the glass, the hexagon at the hand shows it
//                 whole and the glass cracks again as it goes, and opening
//                 a fragrance mends it for good (a key too); on a phone it
//                 comes together by itself. Never with reduced motion, an
//                 address at one fragrance, or ?om=whole. And it is quick
//                 to draw, cracked and whole (2026-10-11).
//   ITS WRITING   the owner's two dropdowns, one inside the other, and the
//                 line they asked to have drawn.
//   OUTSIDER      a door, ajar, in the left margin, the light coming
//                 through it (2026-10-11; it was Om's drawing with a twin,
//                 and its name had an echo).
//   LOST TRIBE    field notes in the margins, leaves falling quiet over the
//                 writing, flocks every few seconds, and the house's other
//                 fragrances in one line.
//   THE FEET      of all three: the fragrances not smelled yet, in one
//                 sentence.
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

/* CRACKED WHILE READING — the owner (2026-10-11, later): "i want the
   breaking apart of the page to be reversible when you hover away ...
   like fractured glass unfracturing when hovered within the hexagon", and,
   asked how the page is read, "cracked while reading": it scrolls under the
   glass, and the glass stays. The pieces are laid over the page in a closed
   shadow root, so nothing else on the page can find them: the page's own
   writing is there once, under them, held back — and a press goes through
   the glass to it. */
test("Om opens behind cracked glass and is read through it: it scrolls, and the glass stays", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.goto(OM);
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  await expect(root).toHaveClass(/om-shattered/);
  await expect(page.locator(".om-shards")).toHaveCount(1);
  expect(await page.evaluate(() => window.OmGlass.pieces()), "fine glass, not a few shards").toBeGreaterThan(30);
  // The writing is the page's own, once: the copies cannot be found.
  await expect(page.locator(".human-part")).toHaveCount(9);
  await expect(page.locator("h1")).toHaveCount(1);
  // Held back under the glass — and the glass lets a press through to it.
  expect(await page.locator(".human-head").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  const hit = await page.locator(".house-return").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  });
  expect(hit, "a press goes through the glass").toBe(true);
  // It scrolls, and the glass stays cracked.
  await page.mouse.move(1300, 200);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  await page.mouse.move(1320, 600, { steps: 6 });
  await page.waitForTimeout(500);
  await expect(root).toHaveAttribute("data-om", "pieces");
  expect(errors).toEqual([]);
});

/* THE HEXAGON SHOWS IT WHOLE — "the hexagon to be the thing that affects
   everything behind it; i want it to be larger, and everything unbreaks in
   the hexagon": the glass about the lens comes home as it comes, and cracks
   again as it goes ("reversible when you hover away"). */
test("Om's hexagon shows the page whole, and the glass cracks again when it leaves", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  const homeAt = (x, y) => page.evaluate(([x, y]) => window.OmGlass.homeAt(x, y), [x, y]);
  expect(await homeAt(520, 400), "cracked before the hand comes").toBeLessThan(0.05);
  await page.mouse.move(480, 380);
  await page.mouse.move(520, 400, { steps: 6 });
  await expect.poll(() => page.evaluate(() => window.OmGlass.lens())).toBeGreaterThan(0.9);
  await expect.poll(() => homeAt(520, 400), { message: "whole in the hexagon" }).toBeGreaterThan(0.9);
  // Away to the far side: where it was is cracked again, and it is not mended.
  await page.mouse.move(1150, 700, { steps: 8 });
  await expect.poll(() => homeAt(520, 400), { message: "cracked again once it has gone" }).toBeLessThan(0.05);
  expect(await homeAt(1150, 700)).toBeGreaterThan(0.5);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
});

/* OPENING A FRAGRANCE MENDS IT FOR GOOD — and the press is held while the
   glass mends, so the fragrance opens on the page made whole rather than
   coming out from under a ghost of the shut list in the glass. */
test("opening a fragrance under Om's glass mends it, and the fragrance opens once the page is whole", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.goto(OM);
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  const part = page.locator(".human-part").first();
  await part.locator("summary").evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 300));
  await page.waitForTimeout(300);
  await part.locator("summary").click();
  await expect(root).toHaveAttribute("data-om", "gathering");
  expect(await part.evaluate((el) => el.open), "held while the glass mends").toBe(false);
  await expect(root).toHaveAttribute("data-om", "whole", { timeout: 6000 });
  await expect.poll(() => part.evaluate((el) => el.open), { message: "and then it opens" }).toBe(true);
  await expect(page.locator(".om-shards")).toHaveCount(0, { timeout: 3000 });
  await expect(root).not.toHaveClass(/om-shattered/);
  expect(await page.locator(".human-head").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  // Whole it stays: the hand and a click on nothing do nothing to it.
  await page.mouse.move(900, 300, { steps: 4 });
  await page.mouse.click(1300, 120);
  await page.waitForTimeout(400);
  await expect(root).toHaveAttribute("data-om", "whole");
  expect(errors).toEqual([]);
});

/* THE PIECES ARE CUT FROM THE PAGE, laid out at the page's own width (the
   window's less its scrollbar — they stood 8px off it while they were laid
   out at the window's), so when they come home what was in pieces is the
   page itself, wherever it has been scrolled to. */
test("Om's pieces are laid out as the page is, and land on it exactly", async ({ page }) => {
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  expect(await page.evaluate(() => window.OmGlass.width())).toBe(await page.evaluate(() => document.body.clientWidth));
  const summary = page.locator(".human-part > summary").first();
  await summary.evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 300));
  await page.waitForTimeout(1300);
  const before = await summary.boundingBox();
  await summary.click();
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 8000 });
  const after = await summary.boundingBox();
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
});

/* A KEY MENDS IT, since a keyboard cannot hover — and a hand moving over it
   does not, nor a click on nothing: the glass is read through. */
test("Om's glass is mended by a key, and not by the hand or a click on nothing", async ({ page }) => {
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.mouse.move(600, 400);
  await page.mouse.move(700, 450, { steps: 8 });
  await page.mouse.click(1300, 120);
  await page.waitForTimeout(500);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.keyboard.press("Tab");
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 8000 });
});

/* QUICK TO DRAW — "please smooth the om parfums page out, it slows down the
   laptop A LOT!" (2026-10-11): it was the drawing's quiet over the column,
   painted over every finished frame (16 frames a second on this machine).
   And since the page is read cracked: nothing in the glass is a layer of
   its own but the glints — fifty pieces cut to their shapes on layers of
   their own held it at a quarter of the whole page's frames. */
test("Om is quick to draw, cracked and whole", async ({ page }) => {
  test.setTimeout(60000);
  const src = read("om.js");
  expect(src, "no mask painted over the frame").not.toContain("destination-in");
  expect(src, "no piece on a layer of its own").not.toMatch(/translate3d|\.shard\{[^}]*will-change|\.om-flow\{[^}]*will-change/);
  await page.setViewportSize({ width: 1440, height: 900 });
  const fps = () => page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(n / 2); })(); }));
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.waitForTimeout(1500);
  expect(await fps(), "frames a second, cracked").toBeGreaterThan(24);
  await page.goto(OM + "?om=whole");
  await page.waitForTimeout(1500);
  expect(await fps(), "frames a second, whole").toBeGreaterThan(30);
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

/* OUTSIDER: A DOOR, AJAR, WITH A LIGHT — the owner, 2026-10-11: "remove the
   merginig motifs and I want you to add a door that is slightly ajar, with a
   small ught coming from that door. that is to be the main motif; similarly
   to les abstraits closet. follow the same theme when you enter the house
   part too". Its own script, never Om's; no pieces, no twin, no echo; the
   door drawn in the left margin, and the house's green coming through it. */
test("Outsider is a door standing ajar in the left margin, the light coming through it, and nothing merging", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OUTSIDER);
  await expect(page.locator('script[src="../outsider.js"]')).toHaveCount(1);
  await expect(page.locator('script[src="../om.js"]')).toHaveCount(0);
  await expect(page.locator(".om-shards")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).animationName), "no echo on the name").toBe("none");
  expect(read("style.css")).not.toContain("outsider-echo");
  // Built, and its light come up.
  await page.waitForTimeout(4200);
  const seen = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const k = c.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data;
    const margin = (innerWidth - 940) / 2;
    let left = 0, right = 0, green = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      if (d[i + 3] < 30) continue;
      if (x / k < margin + 20) { left++; if (d[i + 1] > d[i] + 25 && d[i + 1] > d[i + 2] + 10) green++; }
      else if (x / k > innerWidth - margin) right++;
    }
    return { left, right, green };
  });
  expect(seen.left, "the door, on the left").toBeGreaterThan(1500);
  expect(seen.green, "its green light").toBeGreaterThan(200);
  expect(seen.right, "and nothing standing on the right").toBeLessThan(seen.left / 20);
  expect(errors).toEqual([]);
});

/* THE DOOR OPENS AS THE PAGE IS READ — "less open and opens more when you
   scroll (but not entirely)" (2026-10-11, later): ajar a little at the top
   of the page, wider as it is scrolled down, never all the way. */
test("Outsider's door is a little open at the top, opens wider as the page is scrolled, and never all the way", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OUTSIDER);
  const field = page.locator(".human-field");
  await expect.poll(() => field.getAttribute("data-open").then(Number)).toBeGreaterThan(0.1);
  const top = Number(await field.getAttribute("data-open"));
  expect(top, "a little open at the top").toBeLessThan(0.2);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => field.getAttribute("data-open").then(Number), { timeout: 8000 }).toBeGreaterThan(0.55);
  await page.waitForTimeout(1500);
  expect(Number(await field.getAttribute("data-open")), "never all the way").toBeLessThan(0.66);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => field.getAttribute("data-open").then(Number), { timeout: 8000 }).toBeLessThan(0.2);
});

/* LOST TRIBE'S FIELD NOTES: the house's own stag and the creatures and
   ingredients of its six, down the margins, drawn in the house's colours;
   and its other fragrances "separated by a comma in a single line". */
test("Lost Tribe draws its field notes in the margins, and lists the rest on one line, in a dropdown", async ({ page }) => {
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
  const after = page.locator(".human-after").first();
  await expect(after.locator("ul, ol, li")).toHaveCount(0);
  const line = await after.locator("p.human-unsmelled").textContent();
  const names = line.split(",").map((s) => s.trim());
  expect(names.length).toBeGreaterThan(40);
  ["Kong", "Watch King", "Pan’s Labyrinth", "Dirty Soda", "Equatorial", "Santal Absolu"].forEach((n) => expect(names, n + " has been smelled").not.toContain(n));
  await expect(after.locator(".human-unsmelled-from a").first()).toHaveAttribute("href", "https://losttribeperfumes.com/");
  // The ten found on 2026-10-11, in their places.
  ["Blu", "Dubai", "Easter Egg", "Electric Bloom", "Lola’s Lemonana", "Parc Florale", "Prince of Persia", "Red YaYo (Rose Edition)", "Sunny Nights", "The Hamptons"]
    .forEach((n) => expect(names, n).toContain(n));
  // IN A DROPDOWN (2026-10-11, later — "make image 1 a dropdown list"): the
  // line stands in a fold, shut until it is opened, its count beside its
  // name the number of names in it.
  const fold = after.locator("details.human-fold.human-unsmelled-fold");
  await expect(fold).toHaveCount(1);
  expect(await fold.evaluate((d) => d.open), "shut at first").toBe(false);
  await expect(fold.locator("p.human-unsmelled")).toBeHidden();
  await expect(fold.locator(".human-fold-count")).toHaveText(String(names.length));
  await fold.locator("summary").click();
  await expect(fold.locator("p.human-unsmelled")).toBeVisible();
  // Equatorial's picture, uploaded after the others, in its part and its square.
  await expect(page.locator("#part-05 .human-plate img")).toHaveAttribute("src", /Equatorial\.webp$/);
  await expect(page.locator("#part-05 .human-thumb img")).toHaveAttribute("src", /Equatorial\.webp$/);
  expect(await page.locator("#part-05 .human-plate img").evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(errors).toEqual([]);
});

/* THE LEAVES ON THE PAGE, QUIET OVER THE WRITING, AND MORE BIRDS — "i want
   the falling leaves to exist on the actual page too. when they fall behind
   the text, let them be de-emphasized; similarly to ataraxia's beams of
   light. make the birds more frequent in lost tribes page too" (2026-10-11).
   Over the writing nothing is drawn strongly; in the margins the leaves and
   the specimens are; and flocks set off every few seconds. */
test("Lost Tribe's leaves fall on the page, faint over the writing, and its flocks come every few seconds", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TRIBE);
  const field = page.locator(".human-field");
  await expect.poll(async () => +(await field.getAttribute("data-leaves")), { timeout: 5000 }).toBeGreaterThanOrEqual(10);
  await page.waitForTimeout(9000);
  expect(+(await field.getAttribute("data-flocks")), "flocks in nine seconds").toBeGreaterThanOrEqual(2);
  const most = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const k = c.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data;
    const margin = (innerWidth - 940) / 2;
    let column = 0, side = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const a = d[(y * c.width + x) * 4 + 3], at = x / k;
      if (at > margin + 70 && at < innerWidth - margin - 70) column = Math.max(column, a); else side = Math.max(side, a);
    }
    return { column, side };
  });
  expect(most.column, "over the writing, quiet").toBeLessThan(110);
  expect(most.side, "in the margins, plain").toBeGreaterThan(150);
});

/* WHAT HAS NOT BEEN SMELLED YET, at the foot of each — "at the bottom of
   each of these three houses ... find the fragrances NOT smelled, and then
   add them in a sentence" (2026-10-11): Om's and Outsider's in one sentence
   under the last word, each saying where it was read; Lost Tribe's line. */
test("Om and Outsider say at their foot, in one sentence, what has not been smelled yet", async ({ page }) => {
  for (const [url, smelled, some] of [
    [OM + "?om=whole", ["Nymphaea Caerulea", "Lust", "Burnana", "Cannabis Café", "Dark Night of the Soul", "This Too Shall Pass", "When the Linden Blooms", "Oud de Pasión", "Smoke Oud"], ["Aftermath", "Memento Mori", "Wrath"]],
    [OUTSIDER, ["Dragon’s Breath", "Draco", "Xocolate Crotch", "Guilty as Charged", "Amaretto Coffee"], ["Bananaccino", "Sweet Tooth"]],
  ]) {
    await page.goto(url);
    const line = page.locator(".human-unsmelled-block p.human-unsmelled");
    await expect(line).toHaveCount(1);
    const text = (await line.textContent()).trim();
    expect(text.startsWith("Not smelled yet: "), url).toBe(true);
    expect(text.endsWith("."), "one sentence").toBe(true);
    some.forEach((n) => expect(text, n).toContain(n));
    smelled.forEach((n) => expect(text, n + " has been smelled").not.toContain(n));
    await expect(page.locator(".human-unsmelled-block .human-unsmelled-from a").first()).toHaveAttribute("href", /^https:\/\//);
    // It stands after the last word, inside the page's main.
    expect(await page.evaluate(() => document.querySelector("main .human-after + .human-unsmelled-block") !== null)).toBe(true);
  }
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
   fragrances themselves": Om's grand figure merging out of its pieces and its
   rings merging into one ("less random polygons ... more of the idea of
   grand stuff and merging", 2026-10-11); Outsider's door; Lost Tribe's
   flock, leaves and pollen. The loose shards, and Outsider's mark and its
   twin (its merging motifs), are gone from the code. */
test("the loose shards and Outsider's merging motifs are gone", () => {
  const src = read("motifs.js");
  ["function shard(", "outsiderMark", "outsiderRing", "function omMerge("].forEach((w) => expect(src, w).not.toContain(w));
});

/* OM'S RINGS, THE MOTIF (2026-10-11, later — "lets focus on the two circles
   that converge together while rotating in 3D; i want you to make copies of
   those and focus on that. make the circles unique every time thet
   generate"): several standing at once, each of two or three circles, and
   no two drawn alike. */
test("Om's rings on the Houses view are several at once, and each drawn its own way", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-10");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect.poll(() => page.evaluate(() => window.HouseMotifs.rings().length), { timeout: 20000 }).toBeGreaterThanOrEqual(3);
  const rings = await page.evaluate(() => window.HouseMotifs.rings());
  rings.forEach((r) => expect(r.length, "two or three circles to each").toBeGreaterThanOrEqual(2));
  const look = (st) => JSON.stringify([st.line, st.ticks, st.beads, st.double > 0, st.cardinals, st.gold, Math.round(st.width * 10)]);
  const all = rings.flat().map(look);
  expect(new Set(all).size, `no two circles drawn alike: ${all.join(" ")}`).toBe(all.length);
});
/* OUTSIDER'S DOOR ON THE HOUSES VIEW, in the dark (2026-10-11, later — "fix
   the door; the door graphics are really weird. give it physics, make the
   light actual light, and darken the screen accordingly please"): the view
   goes dark behind the houses and the page's words turn light; the door
   stands shut, is pushed and swings open past where it stands and back,
   settling ajar; and its light is light on the dark — bright where the gap
   is and on the floor before it, nothing like it across the room. Leaving
   the house, the dark goes and the words are themselves again. */
test("Outsider's door on the Houses view darkens the room, swings on its hinge, and lets its light through", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-11");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect(page.locator("body")).toHaveClass(/sheet-night/, { timeout: 20000 });
  // The dark is the motifs' own ground; the words are light on it.
  const ground = await page.locator(".sheet-motifs").evaluate((c) => getComputedStyle(c).backgroundColor);
  const g = ground.match(/[\d.]+/g).map(Number);
  expect(g[3], "the room dark behind the houses: " + ground).toBeGreaterThan(0.8);
  const menu = await page.locator(".menu-trigger").evaluate((m) => getComputedStyle(m).color);
  expect(menu.match(/\d+/g).slice(0, 3).map(Number).every((v) => v > 180), "the Menu light on it: " + menu).toBe(true);
  // THE SWING: shut, then pushed open past where it settles, and back.
  let most = 0, settled = 0;
  for (let i = 0; i < 40; i++) {
    const d = await page.evaluate(() => window.HouseMotifs.doors()[0]);
    if (d && d.pushed) { most = Math.max(most, d.angle); settled = d.angle; }
    await page.waitForTimeout(150);
  }
  expect(most, "it swung open").toBeGreaterThan(0.6);
  expect(settled, "and settled ajar, back from the furthest it swung").toBeLessThan(most - 0.02);
  expect(settled).toBeGreaterThan(0.3);
  // THE LIGHT: bright where the gap and the floor before it are, on the left;
  // across the room on the right, none.
  const light = await page.locator(".sheet-motifs").evaluate((c) => {
    const k = c.width / innerWidth, d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let near = 0, far = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      if (d[i + 3] < 60 || d[i] + d[i + 1] + d[i + 2] < 360) continue;
      if (x / k < innerWidth * 0.35) near++; else if (x / k > innerWidth * 0.7) far++;
    }
    return { near, far };
  });
  expect(light.near, "light through the gap and on the floor").toBeGreaterThan(400);
  expect(light.far, "and none across the room").toBeLessThan(light.near / 20);
  // On to the next house: the dark goes, the words are themselves again.
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("body")).not.toHaveClass(/sheet-night/, { timeout: 8000 });
  expect(errors).toEqual([]);
});

/* LOST TRIBE'S BIRDS ON THE HOUSES VIEW, flown as on the house's own page
   (2026-10-11, later — "why when you click the birds they disappear and
   restart? dont do that? animate them the same way as inside the page
   please"). A press on the page, away from any house, lets nothing go — it
   counted as a drag, which let the house at the front go and started its
   motifs again — and the birds turn from the hand, flapping faster. */
test("Lost Tribe's birds on the Houses view stay when the page is pressed, and scatter from the hand", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-12");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  const inView = () => page.evaluate(() => window.HouseMotifs.flocks().flat().filter((b) => b.x > 160 && b.x < innerWidth - 160 && b.y > 80 && b.y < innerHeight - 80));
  await expect.poll(async () => (await inView()).length, { timeout: 40000 }).toBeGreaterThan(2);
  await page.mouse.move(40, 870);
  await page.mouse.down();
  await page.waitForTimeout(160);           // a press held as long as a hand holds one
  await page.mouse.up();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.getElementById("sheet").classList.contains("musing")), "the house at the front is still rested on").toBe(true);
  expect((await page.evaluate(() => window.HouseMotifs.census())).flock || 0, "and its birds are still flying").toBeGreaterThan(0);
  // The hand among them: they turn from it, flapping faster. (Away from
  // the hand, in the corner, they flap at their own pace.)
  const birds = (await inView()).filter((b) => Math.hypot(b.x - 40, b.y - 870) > 220);
  expect(birds.every((b) => b.rate <= 10.5), "flapping at their own pace").toBe(true);
  // A bird is quick, and a busy machine slow to move the hand: the hand is
  // put where one is now, until one is near enough to turn.
  await expect.poll(async () => {
    const bs = await inView();
    if (!bs.length) return false;
    await page.mouse.move(bs[0].x + Math.sign(bs[0].vx) * 30, bs[0].y);
    await page.waitForTimeout(120);
    return (await page.evaluate(() => window.HouseMotifs.flocks().flat())).some((o) => o.rate > 11);
  }, { timeout: 30000, message: "the near ones flap faster, turning away" }).toBe(true);
  expect(errors).toEqual([]);
});
for (const [no, kinds] of [["10", ["omRing"]], ["11", ["door"]], ["12", ["flock", "leafFall", "pollenRise"]]]) {
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

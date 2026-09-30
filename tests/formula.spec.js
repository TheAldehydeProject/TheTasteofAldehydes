// ============================================================
// THE FORMULA SLIDE (index.html, between the title and the sentence)
//
// The owner, 2026-09-30: "introduce a 4th page, between the first and
// second, in the home page. to transition to this pge from the title
// page, I want the title and text to fade away; 3d model of the aldehyde
// to become more concrete and I want you to add in the element backbone
// ... displayed horizontally, where the O is facing upwards. This
// rearranging should be done after the title fadeds away. When it is
// rearranged, I want a part of the particles to flow in very slim lines
// and fill 4 areas on each sides. This should be symmetrical, and the
// areas should be equally spaced from each other. These 8 ares should be
// texts that are made up of the particles ... and they should be the
// contents of the menu." (molecule.js; its report is
// docs/features/2026-09-30-the-formula-slide.md.)
//
// The drawing says where it is on itself, `data-state` on #molecule —
// cloud, turning, formula, flowing, written — which is what these wait on:
// in the tests' browser, which draws without a graphics card, the whole
// way takes several seconds more than it does on a real machine.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors, blockThreeJs, jumpToSlide } = require("./helpers");

const scrollTop = (page) => page.evaluate(() => document.getElementById("scroll-container").scrollTop);
const slideTop = (page, id) => page.evaluate((id) => document.getElementById(id).offsetTop, id);
const state = (page) => page.evaluate(() => document.getElementById("molecule").dataset.state);

// Park the page part of the way from the title to the formula slide.
const park = (page, fraction) => page.evaluate((f) => {
  const c = document.getElementById("scroll-container");
  c.style.scrollSnapType = "none";
  c.scrollTop = document.getElementById("slide-formula").offsetTop * f;
}, fraction);

async function toTheFormula(page) {
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-formula"));
}
const written = (page, timeout = 60000) =>
  page.waitForFunction(() => document.getElementById("molecule").dataset.state === "written", null, { timeout });

// The atoms' names on the formula, where they stand on the window.
const atoms = (page) => page.locator(".formula-atom").evaluateAll((all) => all.map((a) => {
  const r = a.getBoundingClientRect();
  return { sym: a.textContent, x: r.left + r.width / 2, y: r.top + r.height / 2, shown: +getComputedStyle(a).opacity };
}));

// How much light there is in a box of the window: the bright pixels in it, and their sum.
async function light(page, box) {
  const shot = (await page.screenshot({ clip: box })).toString("base64");
  return page.evaluate(async (shot) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, sum = 0;
    for (let k = 0; k < d.length; k += 4) {
      const v = (d[k] + d[k + 1] + d[k + 2]) / 3;
      if (v > 110) n++;
      sum += v;
    }
    return { n, sum };
  }, shot);
}

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("the formula slide carries the Menu's eight pages, in its order, four down each side, symmetrical and equally spaced", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  // the same eight as the Menu (nav.js), without Home, in its order
  const nav = fs.readFileSync(path.join(__dirname, "..", "nav.js"), "utf8");
  const block = nav.slice(nav.indexOf("const SITE_LINKS = ["), nav.indexOf("];", nav.indexOf("const SITE_LINKS = [")));
  const menu = [...block.matchAll(/label: "([^"]+)", href: "([^"]+)"/g)].map((m) => [m[1], m[2]]).filter(([l]) => l !== "Home");
  const links = await page.locator("#slide-formula .formula-link").evaluateAll((all) =>
    all.map((a) => [a.textContent.trim(), a.getAttribute("href")]));
  expect(links).toEqual(menu);
  expect(links).toHaveLength(8);

  await jumpToSlide(page, "slide-formula");
  const boxes = await page.locator("#slide-formula .formula-link").evaluateAll((all) =>
    all.map((a) => { const r = a.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; }));
  const left = boxes.slice(0, 4), right = boxes.slice(4);
  // four down the left, ending on one line; four down the right, beginning on one
  for (const b of left) expect(Math.abs(b.r - left[0].r)).toBeLessThan(1.5);
  for (const b of right) expect(Math.abs(b.l - right[0].l)).toBeLessThan(1.5);
  // mirrored about the middle of the window
  expect(Math.abs(left[0].r + right[0].l - 1440), "symmetrical").toBeLessThan(2);
  expect(left[0].r).toBeLessThan(720 - 150);
  // row by row, level with each other, and every row as far from the next
  for (let i = 0; i < 4; i++) expect(Math.abs(left[i].t - right[i].t)).toBeLessThan(1.5);
  const gaps = [1, 2, 3].map((i) => left[i].t - left[i - 1].t);
  for (const g of gaps) expect(Math.abs(g - gaps[0]), "equally spaced").toBeLessThan(1.5);
  expect(gaps[0]).toBeGreaterThan(60);
  // and about the middle up and down
  expect(Math.abs((left[0].t + left[3].b) / 2 - 450)).toBeLessThan(6);
});

test("the title fades where it stands as the page leaves it, and only then does the aldehyde come together", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await expect.poll(() => page.locator(".title-content").evaluate((e) => e.style.animationName || getComputedStyle(e).animationName), { timeout: 6000 }).toMatch(/none/);
  const title = page.locator(".title-content h1");
  const before = await title.boundingBox();

  // a quarter of the way down: going, and held where it stands (only lifted a little)
  await park(page, 0.25);
  await page.waitForTimeout(700);
  const going = await page.locator(".title-content").evaluate((e) => +getComputedStyle(e).opacity);
  expect(going, "going").toBeLessThan(0.7);
  expect(going, "not gone yet").toBeGreaterThan(0.2);
  const during = await title.boundingBox();
  expect(Math.abs(during.y - before.y), "held where it stands, not carried off with the page").toBeLessThan(30);
  expect(await state(page), "the aldehyde waits for the title to go").toBe("cloud");

  // past half way: gone, and the aldehyde turning into its formula
  await park(page, 0.6);
  await page.waitForTimeout(200);
  expect(await page.locator(".title-content").evaluate((e) => +getComputedStyle(e).opacity)).toBeLessThan(0.02);
  await expect.poll(() => state(page), { timeout: 8000 }).not.toBe("cloud");
  expect(errors).toEqual([]);
});

test("the aldehyde comes together as its formula — flat, the O at the top, the H either side below — and writes the Menu's pages in specks", async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.waitForTimeout(600);
  // every state the drawing passes through, in order
  await page.evaluate(() => {
    const m = document.getElementById("molecule");
    window.__states = [m.dataset.state];
    new MutationObserver(() => window.__states.push(m.dataset.state)).observe(m, { attributes: true, attributeFilter: ["data-state"] });
  });
  await toTheFormula(page);
  await written(page);
  const states = await page.evaluate(() => window.__states.filter((s, i, all) => s !== all[i - 1]));
  expect(states, "the cloud turns, is the formula, and then writes").toEqual(["cloud", "turning", "formula", "flowing", "written"]);

  // THE FORMULA as a book prints it
  const at = await atoms(page);
  expect(at.map((a) => a.sym)).toEqual(["O", "C", "H", "H"]);
  const [O, C, H1, H2] = at;
  for (const a of at) expect(a.shown, `${a.sym} named`).toBeGreaterThan(0.95);
  expect(Math.abs(O.x - C.x), "the C=O upright").toBeLessThan(12);
  expect(O.y, "the O at the top").toBeLessThan(C.y - 100);
  expect(H1.y, "the H below the C").toBeGreaterThan(C.y + 40);
  expect(H2.y).toBeGreaterThan(C.y + 40);
  expect(H1.x).toBeLessThan(C.x - 100);
  expect(H2.x).toBeGreaterThan(C.x + 100);
  expect(Math.abs((H1.x + H2.x) / 2 - C.x), "either side, evenly").toBeLessThan(14);
  expect(Math.abs(C.x - 720), "in the middle").toBeLessThan(12);

  // THE NAMES, written in specks where the links stand: the links' own
  // letters are not shown, and the specks are
  await expect(page.locator("#aldehyde-stage")).toHaveClass(/formula-written/);
  const colour = await page.locator(".formula-link").first().evaluate((e) => getComputedStyle(e).color);
  expect(colour, "the page's own letters not shown").toBe("rgba(0, 0, 0, 0)");
  const boxes = await page.locator(".formula-link").evaluateAll((all) =>
    all.map((a) => { const r = a.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }));
  for (const [i, box] of boxes.entries()) {
    const seen = await light(page, box);
    expect(seen.n, `name ${i + 1} written in specks`).toBeGreaterThan(40);
  }
  expect(errors).toEqual([]);
});

test("a name pointed at brightens, and is the page's own link", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toTheFormula(page);
  await written(page);
  const link = page.locator(".formula-link", { hasText: "Theories" });
  const box = await link.boundingBox();
  const clip = { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8 };
  const still = await light(page, clip);
  await link.hover();
  await page.waitForTimeout(1500);
  const lit = await light(page, clip);
  expect(lit.sum, "brighter under the hand").toBeGreaterThan(still.sum * 1.04);
  await link.click();
  await expect(page).toHaveURL(/categories\/theories\.html$/);
});

test("going back up, the names go back into the aldehyde before the page moves, and the title comes back", async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await toTheFormula(page);
  await written(page);
  await expect(page.locator("body")).toHaveClass(/formula-shown/);
  const parked = await scrollTop(page);
  await page.mouse.move(720, 60);
  await page.evaluate(() => {
    window.__back = [];
    const c = document.getElementById("scroll-container");
    const t0 = performance.now();
    const tick = (now) => {
      window.__back.push({ t: now - t0, top: c.scrollTop, shown: document.body.classList.contains("formula-shown") });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => scrollTop(page), { timeout: 15000 }).toBe(0);
  const frames = await page.evaluate(() => window.__back);
  const moved = frames.find((f) => f.top !== parked);
  const inAgain = frames.find((f) => !f.shown);
  expect(inAgain, "the names went back in").toBeTruthy();
  // held until they were in (or, on a slow machine, for a second at most)
  expect(moved.t >= inAgain.t - 1 || moved.t > 1000, `the page moved at ${Math.round(moved.t)}ms, the names in at ${Math.round(inAgain.t)}ms`).toBe(true);
  await expect.poll(() => state(page), { timeout: 15000 }).toBe("cloud");
  await expect(page.locator("body")).not.toHaveClass(/formula-leaving/);
  await expect.poll(() => page.locator(".title-content").evaluate((e) => +getComputedStyle(e).opacity)).toBeGreaterThan(0.98);
  expect(errors).toEqual([]);
});

test("with motion turned off the formula and its names are simply there, still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.locator("#scroll-cue").click();
  await expect.poll(() => scrollTop(page), { timeout: 4000 }).toBe(await slideTop(page, "slide-formula"));
  await written(page, 4000);
  await page.waitForTimeout(300);
  const clip = { x: 100, y: 150, width: 1240, height: 600 };
  const a = (await page.screenshot({ clip })).toString("base64");
  await page.waitForTimeout(900);
  const b = (await page.screenshot({ clip })).toString("base64");
  expect(a === b, "nothing moved").toBe(true);
  expect((await light(page, clip)).n, "and it is drawn").toBeGreaterThan(2000);
});

test("without the 3D library the formula slide is the eight links, plainly", async ({ page }) => {
  const errors = collectPageErrors(page, ["three.min.js", "ERR_FAILED", "Failed to load resource"]);
  await blockThreeJs(page);
  await page.goto("/index.html");
  await jumpToSlide(page, "slide-formula");
  await page.waitForTimeout(600);
  await expect(page.locator("#aldehyde-stage")).not.toHaveClass(/formula-written/);
  const links = page.locator(".formula-link");
  await expect(links).toHaveCount(8);
  for (let i = 0; i < 8; i++) {
    await expect(links.nth(i)).toBeVisible();
    expect(await links.nth(i).evaluate((e) => getComputedStyle(e).color)).toBe("rgb(236, 232, 226)");
  }
  expect(errors).toEqual([]);
});

test("on a phone the names stand two above and two below the formula each side, and nothing scrolls sideways", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.locator("#scroll-cue").click();
  await expect.poll(() => scrollTop(page), { timeout: 4000 }).toBe(await slideTop(page, "slide-formula"));
  await written(page, 4000);
  const boxes = await page.locator(".formula-link").evaluateAll((all) =>
    all.map((a) => { const r = a.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom }; }));
  const [O, , H1, H2] = await atoms(page);
  for (const i of [0, 1, 4, 5]) expect(boxes[i].b, `name ${i + 1} above the formula`).toBeLessThan(O.y - 20);
  for (const i of [2, 3, 6, 7]) expect(boxes[i].t, `name ${i + 1} below it`).toBeGreaterThan(Math.max(H1.y, H2.y) + 20);
  for (const i of [0, 1, 2, 3]) expect(boxes[i].r).toBeLessThan(195);
  for (const i of [4, 5, 6, 7]) expect(boxes[i].l).toBeGreaterThan(195);
  for (const b of boxes) { expect(b.l).toBeGreaterThanOrEqual(0); expect(b.r).toBeLessThanOrEqual(390); }
  // symmetrical about the middle, up and down as well as across
  expect(Math.abs(boxes[0].t + boxes[7].b - 844), "the first above as far from the top as the last below from the foot").toBeLessThan(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("the aldehyde stops drawing once its slides are off the screen", async ({ page }) => {
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.__loops = 0;
    window.requestAnimationFrame = (cb) => raf((now) => { if (cb.name === "loop") window.__loops++; cb(now); });
  });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__loops), "drawing while it is seen").toBeGreaterThan(3);
  await jumpToSlide(page, "slide-3");
  await page.waitForTimeout(800);
  const then = await page.evaluate(() => window.__loops);
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.__loops) - then, "and not at all once it is not").toBe(0);
});

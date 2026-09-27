// @ts-check
/* ============================================================
   THE TEST PAGE — works/test-page.html, drawn by network.js.

   The owner, 2026-09-26: "add a new page to the whole site, and make it
   completly blank. this will be a test page." And what is on it now: "I
   want you to make a dense map of red nodes that are interconnected.
   these nodes should be solid and resemble a network. do this on the test
   page. Addiyionally, let it resemble the attached picture" — the nodes
   standing for nothing, "abstract, like the picture". (A tree stood here
   first, twice over, and went: see the report.)
   ============================================================ */
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, blockThreeJs, collectPageErrors } = require("./helpers");

const TEST_PAGE = "/works/test-page.html";

/** What the window shows, read back off a screenshot: how many pixels are
 *  the nodes' red, and the colour at a few points. */
async function look(page, points = []) {
  const shot = (await page.screenshot()).toString("base64");
  return page.evaluate(async ({ shot, points }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let red = 0;
    for (let i = 0; i < d.length; i += 16) if (d[i] > 170 && d[i + 1] < 120 && d[i + 2] < 130) red++;
    const at = points.map(([x, y]) => { const k = (y * c.width + x) * 4; return [d[k], d[k + 1], d[k + 2]]; });
    return { red, at };
  }, { shot, points });
}
/** The tags that are showing, and where. */
const shownTags = (page) => page.$$eval(".net-label", (ls) => ls.map((l) => {
  const r = l.getBoundingClientRect(), s = getComputedStyle(l);
  return { text: l.textContent, marked: l.classList.contains("is-marked"), opacity: +s.opacity, ground: s.backgroundColor,
    left: r.left, right: r.right, top: r.top, bottom: r.bottom };
}).filter((t) => t.opacity > 0.2));

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* THE NETWORK: hundreds of solid red nodes and thousands of links, on the
   page's own dark ground, and nothing else on the page. */
test("a dense network of red nodes is drawn on the dark page, and nothing else", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  const stage = page.locator(".net-stage");
  await expect(stage).toHaveClass(/is-drawn/);
  expect(+(await stage.getAttribute("data-nodes")), "hundreds of nodes").toBeGreaterThan(400);
  expect(+(await stage.getAttribute("data-links")), "and thousands of links between them").toBeGreaterThan(1500);
  await page.waitForTimeout(2500);
  const seen = await look(page, [[1410, 40], [1410, 880], [20, 450], [720, 20]]);
  expect(seen.red, "the nodes are red").toBeGreaterThan(2500);
  const ground = await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("--bg").trim());
  expect(ground).toBe("#1f1f20");
  seen.at.forEach((px, n) => px.forEach((v) => expect(v, "point " + n + " is the dark ground").toBeLessThan(60)));
  // No heading and no writing drawn. The page's one <h1> (2026-09-27, "exactly
  // one <h1> per page") is read and not drawn: a single pixel, clipped away.
  expect(await page.locator("h1:not(.visually-hidden), h2, .page-content").count(), "no heading, no writing").toBe(0);
  const title = await page.locator("h1.visually-hidden").evaluate((h) => { const r = h.getBoundingClientRect(); return { w: r.width, h: r.height, text: h.textContent }; });
  expect(title.text).toBe("Test page");
  expect(title.w * title.h, "and it is not drawn").toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

/* THE TAGS: small black labels beside their nodes, two of them yellow,
   never one over another. */
test("tags stand beside the nodes, two of them yellow, none over another", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  await page.waitForTimeout(3500);
  const tags = await shownTags(page);
  expect(tags.length, "most of them showing").toBeGreaterThan(8);
  const marked = tags.filter((t) => t.marked);
  expect(marked.map((t) => t.text).sort()).toEqual(["FHIX.", "FME"]);
  marked.forEach((t) => expect(t.ground, "yellow").toBe("rgb(242, 180, 24)"));
  tags.filter((t) => !t.marked).forEach((t) => expect(t.ground, "black").toBe("rgb(12, 12, 12)"));
  for (let a = 0; a < tags.length; a++) for (let b = a + 1; b < tags.length; b++) {
    const p = tags[a], q = tags[b];
    const over = p.left < q.right && q.left < p.right && p.top < q.bottom && q.top < p.bottom;
    expect(over, p.text + " and " + q.text + " apart").toBe(false);
  }
  expect(errors).toEqual([]);
});

/* IT TURNS, slowly on its own and by a drag, the tags going with it. */
test("a drag turns the network, and its tags go with it", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  await page.mouse.move(1430, 890);
  await page.waitForTimeout(2500);
  const stage = page.locator(".net-stage");
  const yaw = async () => parseFloat(await stage.getAttribute("data-yaw"));
  const where = () => page.$$eval(".net-label", (ls) => ls.map((l) => l.style.transform));
  const a = await yaw();
  await page.waitForTimeout(1500);
  expect((await yaw()) - a, "turning slowly on its own").toBeGreaterThan(0.01);
  const before = await where();
  await page.mouse.move(720, 450);
  await page.mouse.down();
  await page.mouse.move(1020, 470, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  expect(Math.abs((await yaw()) - a), "turned by the drag").toBeGreaterThan(1.2);
  await expect(stage, "and the hint goes").toHaveClass(/is-turned/);
  const after = await where();
  expect(after.filter((t, n) => t !== before[n]).length, "the tags went with it").toBeGreaterThan(10);
  expect(errors).toEqual([]);
});

/* A NODE UNDER THE POINTER lights its own links. */
test("pointing at a node lights up its links", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  await page.waitForTimeout(2000);
  const stage = page.locator(".net-stage");
  let found = null;
  for (let y = 330; y < 600 && !found; y += 8) for (let x = 600; x < 860 && !found; x += 8) {
    await page.mouse.move(x, y);
    if (await stage.getAttribute("data-hover")) found = { x, y };
  }
  expect(found, "a node found under the pointer").not.toBeNull();
  expect(+(await stage.getAttribute("data-lit")), "its links lit").toBeGreaterThan(0);
  await page.mouse.move(1430, 60);
  await expect(stage, "and let go when the pointer leaves it").toHaveAttribute("data-hover", "");
  expect(errors).toEqual([]);
});

test("without its 3D library the page says so, and is otherwise blank", async ({ page }) => {
  await page.unrouteAll();
  const errors = collectPageErrors(page, ["ERR_FAILED", "Failed to load resource"]);
  await blockThreeJs(page);
  await page.goto(TEST_PAGE);
  await expect(page.locator(".net-fallback")).toBeVisible();
  await expect(page.locator(".net-hint")).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test.describe("the test page with animation turned off", () => {
  test("the network stands still, its tags simply there, and still turns by hand", async ({ page }) => {
    test.setTimeout(60000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(TEST_PAGE);
    await page.waitForTimeout(500);
    const stage = page.locator(".net-stage");
    const a = await stage.getAttribute("data-yaw");
    expect((await shownTags(page)).length, "the tags there at once").toBeGreaterThan(8);
    await page.waitForTimeout(2000);
    expect(await stage.getAttribute("data-yaw"), "never turning on its own").toBe(a);
    await page.mouse.move(720, 450);
    await page.mouse.down();
    await page.mouse.move(900, 450, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    expect(Math.abs(parseFloat(await stage.getAttribute("data-yaw")) - parseFloat(a)), "but a drag still turns it").toBeGreaterThan(0.8);
    expect(errors).toEqual([]);
  });
});

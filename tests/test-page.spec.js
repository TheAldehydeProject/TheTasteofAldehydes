// @ts-check
/* ============================================================
   THE TEST PAGE — works/test-page.html, drawn by tree.js.

   The owner, 2026-09-26: "add a new page to the whole site, and make it
   completly blank. this will be a test page. On this test page, I want
   you to take this tree ... and make it into a 3D render, I want it to
   be made mechanical, but i want it to keep some of its coours, so you
   would have areas of green and brown. I want it to be fully made 3d so
   you can rotate it. From this tree in different areas, i want there to
   be labels that come out of it." — and "make the tree translucent.
   render the ground with it, but not all of the background".
   ============================================================ */
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, blockThreeJs, collectPageErrors } = require("./helpers");

const TEST_PAGE = "/works/test-page.html";

/** What the window shows, read back off a screenshot: how many pixels are
 *  the tree's greens, how many its browns, and the colour at a few points. */
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
    let green = 0, brown = 0;
    for (let i = 0; i < d.length; i += 16) {
      const r = d[i], gr = d[i + 1], b = d[i + 2];
      if (gr > r + 12 && gr > b + 8) green++;
      if (r > gr + 22 && r > b + 30 && r < 235) brown++;
    }
    const at = points.map(([x, y]) => { const k = (y * c.width + x) * 4; return [d[k], d[k + 1], d[k + 2]]; });
    return { green, brown, at };
  }, { shot, points });
}

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* THE TREE: green and brown, standing on its ground, in a window that is
   otherwise the page's own blank paper. */
test("the tree is drawn in green and brown, on its ground and nothing else", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  await expect(page.locator(".tree-stage")).toHaveClass(/is-drawn/);
  await page.waitForTimeout(3500);
  const W = 1440, H = 900;
  const seen = await look(page, [[W - 30, 200], [W - 30, H - 30], [30, H / 2], [W / 2, 30]]);
  expect(seen.green, "areas of green").toBeGreaterThan(1500);
  expect(seen.brown, "and of brown").toBeGreaterThan(1500);
  // The corners of the window are the page's paper: the ground is drawn
  // with the tree, and the rest of the background is not.
  const paper = await page.evaluate(() => getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number));
  seen.at.forEach((px, n) => {
    px.forEach((v, k) => expect(Math.abs(v - paper[k]), "point " + n + " is the blank page").toBeLessThan(6));
  });
  // Nothing else on the page: no heading, no writing, only the tree and
  // its labels.
  expect(await page.locator("h1, h2, .page-content").count()).toBe(0);
  expect(errors).toEqual([]);
});

/* THE LABELS come out of it: a leader line from a point on the tree to
   each name, every name on the window, none on top of another. */
test("labels come out of the tree to its parts", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  await page.waitForTimeout(4000);
  const out = await page.evaluate(() => {
    const labels = [...document.querySelectorAll(".tree-label")].map((el) => {
      const r = el.getBoundingClientRect();
      return { part: el.dataset.part, text: el.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom, opacity: +getComputedStyle(el).opacity };
    });
    const lines = [...document.querySelectorAll(".tree-leaders polyline")].map((l) => l.getAttribute("points").trim().split(/\s+/).length);
    return { labels, lines, W: innerWidth, H: innerHeight };
  });
  expect(out.labels.map((l) => l.part)).toEqual(["leader", "crown", "trunk", "sap", "flare", "arch", "anchor", "stone", "fern", "ground"]);
  expect(out.lines.length, "a leader line for every label").toBe(10);
  out.lines.forEach((n) => expect(n, "drawn all the way out").toBe(3));
  expect(out.labels.filter((l) => l.opacity > 0.5).length, "most of them plainly there").toBeGreaterThan(5);
  out.labels.forEach((l) => {
    expect(l.left, l.part + " on the window").toBeGreaterThanOrEqual(0);
    expect(l.right).toBeLessThanOrEqual(out.W);
    expect(l.top).toBeGreaterThanOrEqual(0);
    expect(l.bottom).toBeLessThanOrEqual(out.H);
  });
  for (let a = 0; a < out.labels.length; a++) for (let b = a + 1; b < out.labels.length; b++) {
    const p = out.labels[a], q = out.labels[b];
    const overlap = p.left < q.right && q.left < p.right && p.top < q.bottom - 2 && q.top < p.bottom - 2;
    expect(overlap, p.part + " and " + q.part + " apart").toBe(false);
  }
  expect(errors).toEqual([]);
});

/* IT TURNS: dragged, it goes round, and the labels go round with it; left
   alone, it turns slowly on its own. */
test("a drag turns the tree, and its labels go with it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TEST_PAGE);
  await page.waitForTimeout(3000);
  const stage = page.locator(".tree-stage");
  const yaw = async () => parseFloat(await stage.getAttribute("data-yaw"));
  const where = () => page.$$eval(".tree-leaders rect", (rs) => rs.map((r) => [+r.getAttribute("x"), +r.getAttribute("y")]));
  // On its own, slowly.
  const a = await yaw();
  await page.waitForTimeout(1500);
  const b = await yaw();
  expect(b - a, "turning slowly on its own").toBeGreaterThan(0.02);
  expect(b - a).toBeLessThan(0.5);
  // By hand.
  const before = await where();
  await page.mouse.move(720, 450);
  await page.mouse.down();
  await page.mouse.move(1020, 470, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  const c = await yaw();
  expect(Math.abs(c - b), "turned by the drag").toBeGreaterThan(1.2);
  await expect(stage, "and the hint goes").toHaveClass(/is-turned/);
  const after = await where();
  const moved = after.filter((p, n) => Math.hypot(p[0] - before[n][0], p[1] - before[n][1]) > 20).length;
  expect(moved, "the points the labels come out of turned with it").toBeGreaterThan(5);
  expect(errors).toEqual([]);
});

test("without its 3D library the page says so, and is otherwise blank", async ({ page }) => {
  await page.unrouteAll();
  const errors = collectPageErrors(page, ["ERR_FAILED", "Failed to load resource"]);
  await blockThreeJs(page);
  await page.goto(TEST_PAGE);
  await expect(page.locator(".tree-fallback")).toBeVisible();
  await expect(page.locator(".tree-hint")).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test.describe("the test page with animation turned off", () => {
  test("the tree stands still, its labels simply there, and still turns by hand", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(TEST_PAGE);
    await page.waitForTimeout(500);
    const stage = page.locator(".tree-stage");
    const a = await stage.getAttribute("data-yaw");
    const shown = await page.$$eval(".tree-label", (ls) => ls.filter((l) => +getComputedStyle(l).opacity > 0.2).length);
    expect(shown, "the labels there at once").toBeGreaterThan(5);
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

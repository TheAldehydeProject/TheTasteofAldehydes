// @ts-check
/* ============================================================
   THE FOUR TEST PAGES — test-pages/1/ to 4/, and the four unseen squares
   at the foot of Contact that lead to them.

   The owner, 2026-11-02: "create ... buttons on the very bottom of the
   contact page. They should be white and not visible at all on the bottom
   right these buttons should take you to separate pages which are going to
   be test pages ... make them four ... Please make sure that they are
   excluded from any other part of the website that they are coded
   separately and are not involved in any way shape or form with the search
   engines or the Perfumes on any of the main pages or anything else. I want
   you to make each of them fully functional animated smooth."

   What these keep: the four squares stand at the foot of Contact on its
   right, 1 to 4 from the left, in the page's own colour and with nothing in
   them — nothing a reader or a screen reader or the keyboard finds, and the
   cursor does not close in on them — and each opens its page. Each page is
   its own: none of the site's scripts or its stylesheet, no link into the
   site but the way back to Contact, nothing of the site linking to it but
   those squares, in no menu, search or sitemap, and noindex, nofollow. And
   each page draws, moves, and does what it offers.
   ============================================================ */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const ROOT = path.join(__dirname, "..");
const PAGES = [1, 2, 3, 4];
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("the four squares stand unseen at the foot of Contact, on its right, 1 to 4 from the left", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/contact/");
  const squares = page.locator(".contact-tests a");
  await expect(squares).toHaveCount(4);
  const seen = await squares.evaluateAll((as) => as.map((a) => {
    const r = a.getBoundingClientRect();
    return {
      href: a.getAttribute("href"), left: r.left, right: r.right, bottom: r.bottom, width: r.width,
      ground: getComputedStyle(a).backgroundColor, page: getComputedStyle(document.body).backgroundColor,
      text: a.textContent.trim(), tab: a.tabIndex, rel: a.rel, hidden: !!a.closest('[aria-hidden="true"]'),
      border: getComputedStyle(a).borderStyle, shadow: getComputedStyle(a).boxShadow,
    };
  }));
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  seen.forEach((s, i) => {
    expect(s.href, "square " + (i + 1)).toBe("../test-pages/" + (i + 1) + "/");
    expect(s.ground, "the page's own colour").toBe(s.page);
    expect(s.text).toBe("");
    expect(s.border).toBe("none");
    expect(s.shadow).toBe("none");
    expect(s.tab, "out of the keyboard's way").toBe(-1);
    expect(s.rel).toBe("nofollow");
    expect(s.hidden, "out of a screen reader's way").toBe(true);
    expect(s.width).toBeGreaterThanOrEqual(20);
    expect(height - s.bottom, "at the very foot").toBeLessThan(20);
    if (i) expect(s.left, "left to right").toBeGreaterThan(seen[i - 1].right);
  });
  expect(1280 - seen[3].right, "on the right").toBeLessThan(20);
  expect(seen[0].left, "on the right").toBeGreaterThan(1280 * 0.75);
});

test("the cursor does not close in on the squares, and each opens its page", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const n of PAGES) {
    await page.goto("/contact/");
    const box = await page.locator(`.contact-tests a[data-test-page="${n}"]`).boundingBox();
    if (!box) throw new Error("no square " + n);
    await page.mouse.move(300, 300);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
    await page.waitForTimeout(150);
    expect(await page.evaluate(() => document.querySelector(".cursor-ring").classList.contains("near")), "the cursor gives nothing away").toBe(false);
    await Promise.all([page.waitForURL(new RegExp(`/test-pages/${n}/$`)), page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)]);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.title()).toBe(`Test page ${n} — The Taste of Aldehydes`);
  }
});

test("the test pages are their own: nothing of the site in them, and nothing of the site points at them", () => {
  for (const n of PAGES) {
    const html = read(`test-pages/${n}/index.html`);
    const head = html.split("</head>")[0];
    expect(head, `${n}: noindex, nofollow`).toContain('<meta name="robots" content="noindex, nofollow">');
    // none of the site's scripts or its stylesheet: only its own page.js
    const scripts = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
    expect(scripts, `${n}: its own script alone`).toEqual([expect.stringMatching(/^page\.js\?v=[0-9a-f]{10}$/)]);
    expect(html, `${n}: not the site's stylesheet`).not.toMatch(/style\.css/);
    // its only way into the site is back to Contact (its icons and fonts aside)
    const links = [...html.replace(/<!--[\s\S]*?-->/g, "").matchAll(/<a[^>]*\shref="([^"]+)"/g)].map((m) => m[1]);
    expect(links.length, `${n}: a way back`).toBeGreaterThan(0);
    expect(new Set(links), `${n}: only the way back`).toEqual(new Set(["../../contact/"]));
    const js = read(`test-pages/${n}/page.js`);
    expect(js, `${n}: its script reaches for nothing of the site's`).not.toMatch(/\.\.\/\.\.\/(?!contact)|SITE_ROOT|window\.(HOUSE_NOTES|FRAGRANCE_NOTES|PERFUMERS_DATA)/);
  }
  // in no menu, search, sitemap or map, and linked from nowhere but Contact's squares
  for (const f of ["nav.js", "search-page.js", "search.js", "sitemap.xml", "robots.txt", "node-scene.js", "landing.js", "index.html"]) {
    expect(read(f), f).not.toMatch(/test-pages/);
  }
  const walk = (dir, out = []) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", ".git", "test-results", "playwright-report", "test-pages", "tests", "docs", "tools"].includes(e.name)) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full, out);
      else if (/\.(html|js|css)$/.test(e.name)) out.push(full);
    }
    return out;
  };
  const pointing = walk(ROOT).filter((f) => /test-pages\//.test(fs.readFileSync(f, "utf8"))).map((f) => path.relative(ROOT, f));
  expect(pointing, "only Contact points at them").toEqual(["contact/index.html"]);
});

for (const n of PAGES) {
  test(`test page ${n} draws, moves, and has no errors`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await serveDependenciesLocally(page);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/test-pages/${n}/`);
    await page.waitForTimeout(2600);
    const a = await page.screenshot();
    await page.waitForTimeout(700);
    const b = await page.screenshot();
    expect(a.equals(b), "something on it moves").toBe(false);
    // the drawing is drawn: its canvas carries light
    const lit = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      const g = document.createElement("canvas");
      g.width = 64; g.height = 64;
      const x = g.getContext("2d");
      x.drawImage(c, 0, 0, 64, 64);
      const d = x.getImageData(0, 0, 64, 64).data;
      let bright = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] > 180) bright++;
      return bright;
    });
    expect(lit, "the drawing is there").toBeGreaterThan(20);
    expect(errors).toEqual([]);
  });

  test(`test page ${n} fits a phone`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await serveDependenciesLocally(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/test-pages/${n}/`);
    await page.waitForTimeout(1200);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), "no sideways scroll").toBeLessThanOrEqual(390);
    await expect(page.locator('a[href="../../contact/"]').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

/* 2026-11-03 — "Recreate test page 1 with images 3 and 4" (a planet's
   readings and its ring of nodes; a pale poster of spheres out of focus and
   a thin double circle): every fragrance on the site a world. */
test("test page 1: every fragrance a world, and a world out of focus pressed comes into focus", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.TestPage1.count)).toBeGreaterThan(100);
  const first = await page.evaluate(() => window.TestPage1.now());
  await expect(page.locator("[data-v=name]")).toHaveText(first);
  // the next, by the arrow and by the key
  await page.locator(".t1-next").click();
  const second = await page.evaluate(() => window.TestPage1.now());
  expect(second).not.toBe(first);
  await expect(page.locator("[data-v=name]")).toHaveText(second);
  await page.keyboard.press("ArrowLeft");
  expect(await page.evaluate(() => window.TestPage1.now())).toBe(first);
  // a world chosen by name, from the list of every one
  await page.locator(".t1-pick").selectOption({ label: "Amber Zero" });
  expect(await page.evaluate(() => window.TestPage1.now())).toBe("Amber Zero");
  await expect(page.locator(".t1-lines li")).toHaveCount(3);
  await expect(page.locator(".t1-lines li").first()).toContainText("Top");
  expect(errors).toEqual([]);
});

test("test page 2: an accord pointed at in the list is the one in focus", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/2/");
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.TestPage2.accords)).toBe(16);
  expect(await page.evaluate(() => window.TestPage2.houses)).toBeGreaterThan(10);
  await page.locator('.t2-gloss li[data-code="WOO"]').hover();
  await expect.poll(() => page.evaluate(() => window.TestPage2.focus())).toBe("WOO");
  await expect(page.locator('.t2-gloss li[data-code="WOO"]')).toHaveClass(/is-lit/);
});

/* TEST PAGE 2 ZOOMABLE, AND SAYING WHAT IT SHOWS — the owner, 2026-11-03:
   "make test page 2 zoomable, and functional for information". The wheel,
   the + and −, a double-click and the keys come closer and Fit goes back to
   the whole; a drag moves about; closer in, more of the notes are named. A
   house, an accord or — closer in — a note pressed opens the panel, every
   name in it opening its own, Back going back; the search finds a note and
   flies there; on a phone a tap opens the panel at the foot. */
const t2 = (page, js) => page.evaluate(js);
const t2go = async (page) => {
  await serveDependenciesLocally(page);
  await page.goto("/test-pages/2/");
  await page.waitForTimeout(700);
};
const settled = (page) => expect.poll(() => t2(page, () => window.TestPage2.moving()), { timeout: 6000 }).toBe(false);

test("test page 2 zooms: the wheel, the buttons, a double-click and the keys, and Fit shows the whole again", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await t2go(page);
  expect(await t2(page, () => window.TestPage2.zoom())).toBe(1);
  await page.mouse.move(900, 400);
  await page.mouse.wheel(0, -300);
  await settled(page);
  const z1 = await t2(page, () => window.TestPage2.zoom());
  expect(z1, "the wheel comes closer").toBeGreaterThan(1.5);
  await page.locator('.t2-zoom [data-z="1"]').click();
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom()), "and so does the +").toBeGreaterThan(z1 * 1.5);
  await expect(page.locator(".t2-zoom-say")).not.toHaveText("100%");
  // a drag moves about, closer in, without choosing anything
  await page.mouse.move(900, 400); await page.mouse.down(); await page.mouse.move(700, 300, { steps: 6 }); await page.mouse.up();
  expect(await t2(page, () => window.TestPage2.info()), "a drag chooses nothing").toBeNull();
  await page.locator(".t2-fit").click();
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom()), "Fit: the whole").toBe(1);
  await page.mouse.dblclick(900, 400);
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom()), "a double-click comes closer").toBeGreaterThan(2);
  await page.keyboard.press("0");
  await settled(page);
  await page.keyboard.press("+");
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom()), "and the + key").toBeGreaterThan(1.3);
  // never further out than the whole, nor closer than ten times
  for (let i = 0; i < 12; i++) await page.locator('.t2-zoom [data-z="1"]').click();
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom())).toBeLessThanOrEqual(10);
  for (let i = 0; i < 12; i++) await page.locator('.t2-zoom [data-z="-1"]').click();
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom())).toBe(1);
});

test("test page 2 says what it shows: a house, an accord and, closer in, a note, each opening the next", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await t2go(page);
  const info = () => t2(page, () => window.TestPage2.info());
  // a house
  let [x, y] = await t2(page, () => window.TestPage2.at("house", "Pineward"));
  await page.mouse.click(x, y);
  expect(await info()).toEqual({ kind: "house", name: "Pineward" });
  await expect(page.locator(".t2-info")).toBeVisible();
  await expect(page.locator(".t2-info .t2-n")).toHaveText("Pineward");
  await expect(page.locator(".t2-info .t2-frag")).toHaveCount(48);
  // one of its fragrances opens onto its notes, and a note onto its own
  await page.locator(".t2-info .t2-frag summary").first().click();
  await page.locator(".t2-info .t2-frag[open] .t2-chip").first().click();
  expect((await info()).kind).toBe("note");
  await page.locator(".t2-info-back").click();
  expect(await info()).toEqual({ kind: "house", name: "Pineward" });
  // its accords, each a way on
  await page.locator('.t2-info .t2-row[data-go="accord:WOO"]').click();
  expect(await info()).toEqual({ kind: "accord", name: "Woods" });
  await expect(page.locator(".t2-info .t2-row[data-go^='note:']")).toHaveCount(29);
  expect(await t2(page, () => window.TestPage2.focus())).toBe("WOO");
  // shown on the poster: closer, and the accord's notes there to be pressed
  await page.locator(".t2-info-show").click();
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom())).toBeGreaterThan(2.2);
  [x, y] = await t2(page, () => window.TestPage2.at("note", "Sandalwood"));
  await page.mouse.click(x, y);
  expect(await info()).toEqual({ kind: "note", name: "Sandalwood" });
  expect(await t2(page, () => window.TestPage2.focus())).toBe("note:Sandalwood");
  await expect(page.locator(".t2-info .t2-list li")).toHaveCount(35);
  await expect(page.locator(".t2-info .t2-stats")).toContainText("35");
  // pressed where there is nothing, the panel goes
  await page.locator(".t2-fit").click();
  await settled(page);
  await page.mouse.click(700, 120);
  expect(await info()).toBeNull();
  await expect(page.locator(".t2-info")).toBeHidden();
  // an accord's name pressed at the whole view
  [x, y] = await t2(page, () => window.TestPage2.at("accord", "Citrus"));
  await page.mouse.click(x, y);
  expect(await info()).toEqual({ kind: "accord", name: "Citrus" });
  await page.keyboard.press("Escape");
  expect(await info()).toBeNull();
});

test("test page 2's search finds a house, an accord or a note, and flies there", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await t2go(page);
  await page.locator(".t2-find input").fill("bergam");
  await expect(page.locator(".t2-found li")).toHaveCount(1);
  await expect(page.locator(".t2-found")).toContainText("Bergamot");
  await page.keyboard.press("Enter");
  expect(await t2(page, () => window.TestPage2.info())).toEqual({ kind: "note", name: "Bergamot" });
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom()), "flown there").toBeGreaterThan(2);
  const [x, y] = await t2(page, () => window.TestPage2.at("note", "Bergamot"));
  expect(x, "on the screen, beside the panel").toBeGreaterThan(330);
  expect(x).toBeLessThan(1440);
  expect(y).toBeGreaterThan(0); expect(y).toBeLessThan(900);
  await page.locator(".t2-find input").fill("tombst");
  await page.locator(".t2-found button").first().click();
  expect(await t2(page, () => window.TestPage2.info())).toEqual({ kind: "house", name: "Tombstone" });
  await page.locator(".t2-find input").fill("zzzz");
  await expect(page.locator(".t2-found")).toContainText("Nothing on the poster by that name");
});

test.describe("test page 2 on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("a tap opens the panel at the foot, and the + comes closer", async ({ page }) => {
    await t2go(page);
    const [x, y] = await t2(page, () => window.TestPage2.at("house", "ADAR"));
    await page.touchscreen.tap(x, y);
    expect(await t2(page, () => window.TestPage2.info())).toEqual({ kind: "house", name: "ADAR" });
    const box = await page.locator(".t2-info").boundingBox();
    expect(box.y + box.height, "at the foot of the window").toBeGreaterThan(830);
    expect(box.height, "and leaving the poster above it").toBeLessThan(844 * 0.6);
    await page.locator(".t2-info-close").click();
    await page.locator('.t2-zoom [data-z="1"]').click();
    await settled(page);
    expect(await t2(page, () => window.TestPage2.zoom())).toBeGreaterThan(1.5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

/* 2026-11-03 — "Test Page 3 should be about top mid bottom
   stratification": the pyramids on the site taken apart into three layers. */
test("test page 3: the pyramids taken apart — a fragrance drawn through its layers, and Spray plays them in the primer's order", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/3/");
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.TestPage3.count)).toBeGreaterThan(30);
  await expect(page.locator('.t3-label[data-tier="m"]')).toContainText("20–30 minutes");
  await page.locator(".t3-pick").selectOption({ label: "Amber Zero — ADAR" });
  expect(await page.evaluate(() => window.TestPage3.chosen())).toBe("Amber Zero");
  await expect(page.locator(".t3-chosen h3")).toHaveText("Amber Zero");
  await expect(page.locator(".t3-chosen dt")).toHaveText(["Top", "Middle", "Base"]);
  await page.locator(".t3-clear").click();
  expect(await page.evaluate(() => window.TestPage3.chosen())).toBe(null);
  // spray: the top first, then the heart, then the dry down
  await page.locator(".t3-spray").click();
  await expect.poll(() => page.evaluate(() => window.TestPage3.stage()), { timeout: 4000 }).toBe("t");
  await expect.poll(() => page.evaluate(() => window.TestPage3.stage()), { timeout: 6000 }).toBe("m");
  await expect.poll(() => page.evaluate(() => window.TestPage3.stage()), { timeout: 6000 }).toBe("b");
  // and it turns when dragged
  const yaw = await page.evaluate(() => window.TestPage3.yaw());
  await page.mouse.move(640, 600); await page.mouse.down(); await page.mouse.move(760, 600, { steps: 6 }); await page.mouse.up();
  expect(await page.evaluate(() => window.TestPage3.yaw())).not.toBe(yaw);
  expect(errors).toEqual([]);
});

/* 2026-11-03 — "Recreate test page 4 with the remaining images ... page 4
   surprise me": every note a hill, the land growing year by year, a gold
   contour plane over it and a survey tower walking it. */
test("test page 4: the land grows year by year, the tower surveys where it is sent, and the plane comes down", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/4/");
  await page.waitForTimeout(600);
  const full = await page.evaluate(() => window.TestPage4.year());
  await page.locator(".t4-grow").click();
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.TestPage4.year()), "growing from the first year").toBeLessThan(full);
  await expect.poll(() => page.evaluate(() => window.TestPage4.year()), { timeout: 15000 }).toBe(full);
  // the tower, sent to the land's far corner, walks there and says so
  await page.evaluate(() => window.TestPage4.send(-0.8, -0.8));
  const s = await page.evaluate(() => window.TestPage4.survey());
  expect(s.cell).toMatch(/^[A-T] · \d+$/);
  await expect(page.locator(".t4-survey [data-v=cell]")).toHaveText(s.cell);
  await expect.poll(() => page.evaluate(() => window.TestPage4.tower().x), { timeout: 5000 }).toBeLessThan(-0.7);
  // pressed on the land, it goes there too
  const before = await page.evaluate(() => window.TestPage4.tower());
  await page.mouse.click(700, 420);
  await expect.poll(async () => { const t = await page.evaluate(() => window.TestPage4.tower()); return Math.hypot(t.x - before.x, t.z - before.z); }, { timeout: 5000 }).toBeGreaterThan(0.2);
  // the plane lowered
  const high = await page.evaluate(() => window.TestPage4.plane());
  await page.locator(".t4-level").fill("20");
  await expect.poll(() => page.evaluate(() => window.TestPage4.plane()), { timeout: 4000 }).toBeLessThan(high - 0.5);
  expect(errors).toEqual([]);
});

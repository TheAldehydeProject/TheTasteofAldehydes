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
const PAGES = [1, 2, 3, 4, 5];
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("the five squares stand unseen at the foot of Contact, on its right, 1 to 5 from the left", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/contact/");
  const squares = page.locator(".contact-tests a");
  await expect(squares).toHaveCount(5);
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
  expect(1280 - seen[4].right, "on the right").toBeLessThan(20);
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

/* 2026-11-06 — "change test page 1 to make it more into a perfumer oriented
   page ... you initially start with a diagram like this (image 2), and each
   dot or node on that when clicked will take you to a sphere ... The central
   sphere node should be of the perfumer, and sphere nodes around it should be
   of the houses. You can click those and view the fragrances that were made by
   the perfumer for that house ... a return button." And then: "remove the
   earth actually, make it way more abstract and blobby like in the image i
   referenced ... No need to make 139 tiny nodes for prin lomoros." */
test("test page 1: the rays first, a dot opening its perfumer's world, a house its perfumes, and Return going back", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await page.waitForTimeout(2200);
  // the rays: a dot for every perfume, every perfumer in the list
  expect(await page.evaluate(() => window.TestPage1.view())).toBe("rays");
  expect(await page.evaluate(() => window.TestPage1.dots())).toBe(282);
  expect(await page.evaluate(() => window.TestPage1.perfumers)).toBe(24);
  await expect(page.locator(".t1-return")).toBeHidden();
  // a dot pressed: its perfumer's world, the perfumer in the middle
  const d = await page.evaluate(() => window.TestPage1.dotOf("aichi-liu"));
  await page.mouse.click(d.x, d.y);
  await expect.poll(() => page.evaluate(() => window.TestPage1.view())).toBe("world");
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "per", perfumer: "aichi-liu", house: null, count: 14 });
  await expect(page.locator("[data-v=name]")).toHaveText("Aichi Liu");
  await expect(page.locator("[data-v=houses]")).toHaveText("2");
  await expect(page.locator(".t1-return")).toBeVisible();
  // no Earth and no ring of perfumes: one blob, a lobe for each of her
  // houses, the houses round it, and the houses listed beside it
  expect(await page.evaluate(() => typeof window.TestPage1.spin)).toBe("undefined");
  expect(await page.evaluate(() => window.TestPage1.lobes())).toEqual(["Om Parfums", "Outsider Parfums"]);
  expect(await page.evaluate(() => window.TestPage1.spheres())).toBe(2);
  await expect(page.locator(".t1-list-rows button")).toHaveCount(2);
  // a house round it pressed (once the world has opened): the perfumes she
  // made for it
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => window.TestPage1.houseAt("om-parfums"));
  await page.mouse.click(h.x, h.y);
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "house", perfumer: "aichi-liu", house: "om-parfums", count: 9 });
  await expect(page.locator("[data-v=name]")).toHaveText("Om Parfums");
  await expect(page.locator(".t1-list-rows button")).toHaveCount(9);
  // the house in the middle: a lobe for every year its perfumes were made in
  const years = await page.evaluate(() => window.TestPage1.lobes());
  expect(years.slice().sort()).toEqual(["2023", "2024", "no year"]);
  // a perfume in the list pressed says who made it
  await page.locator(".t1-list-rows button").first().click();
  await expect(page.locator(".t1-tip")).toBeVisible();
  await expect(page.locator(".t1-tip")).toContainText("Aichi Liu");
  // Return: back to the perfumer, then to the rays; Esc the same
  await page.locator(".t1-return").click();
  expect((await page.evaluate(() => window.TestPage1.now())).kind).toBe("per");
  await page.locator(".t1-return").click();
  await expect.poll(() => page.evaluate(() => window.TestPage1.view())).toBe("rays");
  // from the list, and Esc back: Prin Lomros' 139 perfumes in three lobes,
  // and a row of the list taking you into a house
  await page.locator(".t1-pick").selectOption({ label: "Prin Lomros · 139" });
  await expect.poll(() => page.evaluate(() => window.TestPage1.view())).toBe("world");
  expect((await page.evaluate(() => window.TestPage1.now())).count).toBe(139);
  expect(await page.evaluate(() => window.TestPage1.lobes())).toHaveLength(3);
  await page.locator(".t1-list-rows button", { hasText: "PRIN" }).first().click();
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "house", perfumer: "prin-lomros", house: "prin", count: 40 });
  await expect(page.locator(".t1-list-rows button")).toHaveCount(40);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1300);
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => window.TestPage1.view())).toBe("rays");
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
  await expect(page.locator(".t2-info .t2-row[data-go^='note:']")).toHaveCount(30);
  expect(await t2(page, () => window.TestPage2.focus())).toBe("WOO");
  // shown on the poster: closer, and the accord's notes there to be pressed
  await page.locator(".t2-info-show").click();
  await settled(page);
  expect(await t2(page, () => window.TestPage2.zoom())).toBeGreaterThan(2.2);
  [x, y] = await t2(page, () => window.TestPage2.at("note", "Sandalwood"));
  await page.mouse.click(x, y);
  expect(await info()).toEqual({ kind: "note", name: "Sandalwood" });
  expect(await t2(page, () => window.TestPage2.focus())).toBe("note:Sandalwood");
  await expect(page.locator(".t2-info .t2-list li")).toHaveCount(36);
  await expect(page.locator(".t2-info .t2-stats")).toContainText("36");
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

/* 2026-11-06 — "Also please edit the TESTPAGE2 TO Also acccomodate the
   information of oerfumers": every fragrance's perfumer, a perfumer's own
   panel, the perfumers in a house's panel and in the search. */
test("test page 2 carries the perfumers: their list, their panel, a house's perfumers and the search", async ({ page }) => {
  const errors = collectPageErrors(page);
  await t2go(page);
  expect(await t2(page, () => window.TestPage2.perfumers)).toBe(24);
  await expect(page.locator(".t2-pers li")).toHaveCount(24);
  // pointed at, a perfumer lights their houses; pressed, their panel
  const li = page.locator(".t2-pers li", { hasText: "Aichi Liu" });
  await li.scrollIntoViewIfNeeded();
  await li.hover();
  expect(await t2(page, () => window.TestPage2.focusPerfumer())).toBe("aichi-liu");
  await li.click();
  expect(await t2(page, () => window.TestPage2.info())).toEqual({ kind: "perfumer", name: "Aichi Liu" });
  await expect(page.locator(".t2-info-body h3").first()).toContainText("Its houses");
  await expect(page.locator('.t2-info-body [data-go^="house:"]')).toHaveCount(2);
  // a house's panel names its perfumers, each a way to theirs
  await page.locator('.t2-info-body [data-go^="house:"]').first().click();
  expect((await t2(page, () => window.TestPage2.info())).kind).toBe("house");
  await expect(page.locator(".t2-info-body h3").first()).toContainText("Its perfumers");
  await page.locator('.t2-info-body [data-go^="perfumer:"]').first().click();
  expect(await t2(page, () => window.TestPage2.info())).toEqual({ kind: "perfumer", name: "Aichi Liu" });
  // the search finds a perfumer
  await page.locator(".t2-info-close").click();
  await page.locator(".t2-find input").fill("lomros");
  await expect(page.locator(".t2-found li").first()).toContainText("Perfumer");
  await page.keyboard.press("Enter");
  expect(await t2(page, () => window.TestPage2.info())).toEqual({ kind: "perfumer", name: "Prin Lomros" });
  expect(errors).toEqual([]);
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

/* 2026-11-06 — "replace TP3 with another iterations of the perfumers page,
   which should look like image 3. Make it as functional and as
   representative as possible": the perfumers along the top, a thread for
   every perfume falling to its house, each house as high as its years. */
test("test page 3: a thread for every perfume from its perfumer to its house, the houses by their years, and the panel", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/3/");
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.TestPage3.threads())).toBe(282);
  expect(await page.evaluate(() => window.TestPage3.perfumers)).toBe(24);
  expect(await page.evaluate(() => window.TestPage3.houses)).toBe(27);
  // the houses stand as high as their perfumes' middle year, the newest
  // highest (the page the other way up since the owner's "i want the bottom
  // parts to be the perfumers"): Slumberhouse's 2009 under Almost Human's
  // 2026, a house with no year along the top — and the perfumers under all
  // of them
  const y = (id) => page.evaluate((x) => window.TestPage3.yOfHouse(x), id);
  expect(await page.evaluate(() => window.TestPage3.yearOf("slumberhouse"))).toBe(2009);
  expect(await y("slumberhouse")).toBeGreaterThan(await y("almost-human"));
  expect(await page.evaluate(() => window.TestPage3.yearOf("lussur"))).toBe(0);
  expect(await y("lussur")).toBeLessThan(await y("almost-human"));
  const bar = (await page.evaluate(() => window.TestPage3.perfumerAt("aichi-liu"))).y;
  expect(bar).toBeGreaterThan(await y("slumberhouse"));
  // a perfumer pressed on its bar: its panel and its perfumes
  const p = await page.evaluate(() => window.TestPage3.perfumerAt("aichi-liu"));
  await page.mouse.click(p.x, p.y);
  expect(await page.evaluate(() => window.TestPage3.chosen())).toEqual({ kind: "per", id: "aichi-liu" });
  await expect(page.locator(".t3-panel")).toHaveClass(/is-open/);
  await expect(page.locator(".t3-list li")).toHaveCount(14);
  // a house in it, and the search
  await page.locator('.t3-panel [data-entry]').first().hover();
  await page.evaluate(() => window.TestPage3.choose("house", "om-parfums"));
  await expect(page.locator(".t3-panel h2")).toHaveText("Om Parfums");
  await expect(page.locator(".t3-list li")).toHaveCount(9);
  await page.locator(".t3-close").click();
  await expect(page.locator(".t3-panel")).not.toHaveClass(/is-open/);
  await page.locator(".t3-find input").fill("haxan");
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => window.TestPage3.chosen())).toEqual({ kind: "perfume", id: "Haxan" });
  await expect(page.locator(".t3-facts")).toContainText("Prin Lomros");
  expect(errors).toEqual([]);
});

/* 2026-11-06 — "replace tp4 with another iteration of the perfumers page ...
   something like images 5 and 6. It should have a table where you can select
   the perfumers and then it would take you to a node, which would have
   subnodes of houses, then further subnodes of perfumes." */
test("test page 4: the table takes you to a perfumer's node, its houses and then their perfumes", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/4/");
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.TestPage4.nodes())).toEqual({ perfumers: 24, houses: 35, perfumes: 282 });
  // dense, as the references are ("not just a few lines"): every letter of
  // every perfume's name a node, and every note of every perfume on the site
  const n = await page.evaluate(() => window.TestPage4.counts());
  expect(n.letter).toBeGreaterThan(2500);
  expect(n.notes).toBe(379);
  expect(n.links).toBeGreaterThan(4000);
  await expect(page.locator(".t4-table tbody tr")).toHaveCount(24);
  await expect(page.locator("[data-v=stage]")).toHaveText("STAGE 1: PERFUMERS");
  const fit = (await page.evaluate(() => window.TestPage4.cam())).fit;
  // a perfumer chosen in the table: its node, closer, its houses listed
  await page.locator(".t4-table tbody tr", { hasText: "Prin Lomros" }).click();
  expect(await page.evaluate(() => window.TestPage4.focus())).toEqual({ kind: "per", name: "Prin Lomros", stage: 2 });
  await expect(page.locator("[data-v=stage]")).toHaveText("STAGE 2: HOUSES");
  const total = await page.evaluate(() => window.TestPage4.cloud("Prin Lomros"));
  expect(total).toBeGreaterThan(1000);
  await expect(page.locator("[data-v=total]")).toHaveText("TOTAL: " + total.toLocaleString("en").replace(/,/g, " "));
  await expect(page.locator(".t4-sub [data-house]")).toHaveCount(3);
  await expect.poll(async () => (await page.evaluate(() => window.TestPage4.cam())).z).toBeGreaterThan(fit * 1.5);
  // a house: its perfumes
  await page.locator(".t4-sub [data-house]", { hasText: "Parfum Prissana" }).click();
  expect((await page.evaluate(() => window.TestPage4.focus())).stage).toBe(3);
  await expect(page.locator(".t4-sub [data-leaf]")).toHaveCount(32);
  // a perfume: spelled down the left, letter by letter
  await page.locator(".t4-sub [data-leaf]", { hasText: "Haxan" }).click();
  expect(await page.evaluate(() => window.TestPage4.focus())).toEqual({ kind: "perfume", name: "Haxan", stage: 4 });
  await expect(page.locator("[data-v=stage]")).toHaveText("STAGE 4: LETTERS");
  await expect(page.locator(".t4-letters li")).toHaveCount(5);
  // up a level with Esc, and the whole field again
  await page.keyboard.press("Escape");
  expect((await page.evaluate(() => window.TestPage4.focus())).stage).toBe(3);
  await page.locator(".t4-fit").click();
  expect((await page.evaluate(() => window.TestPage4.focus())).stage).toBe(1);
  // a node pressed on the field is chosen too
  await page.waitForTimeout(900);
  const pt = await page.evaluate(() => window.TestPage4.pointOf("Nicholas Nilsson"));
  await page.mouse.click(pt.x, pt.y);
  expect((await page.evaluate(() => window.TestPage4.focus())).name).toBe("Nicholas Nilsson");
  // the ground, image 5's grey or image 6's dark
  await page.locator('.t4-ground [data-ground="dark"]').click();
  await expect(page.locator("body")).toHaveClass(/is-dark/);
  await page.evaluate(() => localStorage.removeItem("t4-ground"));
  expect(errors).toEqual([]);
});

/* 2026-11-06 — "please also generate a 5th test page (by moving all the
   other ones a little to the left on the contacts page), modelled like the
   image attached (architecture sketch) that is going to be another page that
   attempts to house the perfumer information": a section through the houses
   above ground and the perfumers below it. */
/* 2026-11-06 — test page 5, after an architect's sketch, and then: "Completly
   rework the archetecture one ... make designs of perfume bottles that look
   like sketches and then from there design something around the idea of
   perfumers. Make it thematic". A flacon for every perfumer, every part of it
   saying something of them. */
test("test page 5: a flacon for every perfumer — its height, cap, body, juice and graduations its perfumer's — chosen into its detail", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/5/");
  await page.waitForTimeout(3000);
  expect(await page.evaluate(() => [window.TestPage5.flacons, window.TestPage5.perfumes, window.TestPage5.layers])).toEqual([24, 282, 35]);
  const f = (id) => page.evaluate((x) => window.TestPage5.flaconAt(x), id);
  // the height a millilitre a perfume: Prin Lomros' 139 the tallest
  const prin = await f("prin-lomros"), nils = await f("nicholas-nilsson"), lobb = await f("josh-lobb");
  expect(prin.h).toBeGreaterThan(nils.h);
  expect(nils.h).toBeGreaterThan(lobb.h);
  // the cap a tier a house; the family where its perfumes are
  expect([prin.tiers, nils.tiers, lobb.tiers, (await f("aichi-liu")).tiers]).toEqual([3, 1, 1, 2]);
  expect([prin.family, lobb.family, (await f("michael-nordstrand")).family]).toEqual(["faceted", "round", "square"]);
  // the body swells where most were made: Pineward's 2021 wider than its one of 2026
  expect(await page.evaluate(() => window.TestPage5.widthAt("nicholas-nilsson", 2021))).toBeGreaterThan(await page.evaluate(() => window.TestPage5.widthAt("nicholas-nilsson", 2026)));
  // the juice a layer a house, as deep as what was made for it
  const layer = (id, h) => page.evaluate(([a, b]) => window.TestPage5.layerAt(a, b), [id, h]);
  expect((await layer("prin-lomros", "strangers-parfumerie")).depth).toBeGreaterThan((await layer("prin-lomros", "parfum-prissana")).depth * 1.8);
  // a graduation long where a source names the perfumer, short where it is the house's
  const grad = (n) => page.evaluate((x) => window.TestPage5.gradAt(x), n);
  expect((await grad("Dragon’s Breath")).len).toBeGreaterThan((await grad("Lust")).len);
  // a flacon pressed: its detail, its houses
  const aichi = await f("aichi-liu");
  await page.mouse.click(aichi.x, aichi.y);
  expect(await page.evaluate(() => window.TestPage5.chosen())).toEqual({ kind: "per", name: "Aichi Liu" });
  await expect(page.locator(".t5-detail h2")).toHaveText("Aichi Liu");
  await expect(page.locator(".t5-detail [data-house]")).toHaveCount(2);
  // pressed again, a layer is its house, and its perfumes listed
  const om = await layer("aichi-liu", "om-parfums");
  await page.mouse.click(om.x, om.y);
  expect(await page.evaluate(() => window.TestPage5.chosen())).toEqual({ kind: "house", name: "Om Parfums" });
  await expect(page.locator(".t5-detail li")).toHaveCount(9);
  await page.locator(".t5-detail [data-e]").first().click();
  expect((await page.evaluate(() => window.TestPage5.chosen())).kind).toBe("perfume");
  // Esc a level at a time
  await page.keyboard.press("Escape");
  expect((await page.evaluate(() => window.TestPage5.chosen())).kind).toBe("house");
  await page.keyboard.press("Escape");
  expect((await page.evaluate(() => window.TestPage5.chosen())).kind).toBe("per");
  // a graduation: the first press chooses its flacon, the second its perfume
  const hx = await grad("Haxan");
  await page.mouse.click(hx.x, hx.y);
  expect(await page.evaluate(() => window.TestPage5.chosen())).toEqual({ kind: "per", name: "Prin Lomros" });
  await page.mouse.click(hx.x, hx.y);
  expect(await page.evaluate(() => window.TestPage5.chosen())).toEqual({ kind: "perfume", name: "Haxan" });
  // the list, and Esc
  await page.locator(".t5-pick").selectOption({ label: "Nicholas Nilsson · 48" });
  expect(await page.evaluate(() => window.TestPage5.chosen())).toEqual({ kind: "per", name: "Nicholas Nilsson" });
  await page.keyboard.press("Escape");
  expect(await page.evaluate(() => window.TestPage5.chosen())).toBe(null);
  expect(errors).toEqual([]);
});

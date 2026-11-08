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
const PAGES = [1, 2, 3, 4];   // (5 was taken out on 2026-11-07 — "remove test page 5")
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

/* 2026-11-06 — "change test page 1 to make it more into a perfumer oriented
   page ... each dot or node on that when clicked will take you to a sphere
   ... The central sphere node should be of the perfumer, and sphere nodes
   around it should be of the houses ... a return button." And 2026-11-08 —
   "i want the dots not to be perfumes/fragrances, but houses. so prin lomoros
   should be 3 dots"; "when you click on one of the houses, it takes you to a
   blob of the house, and then the surrounding blobs should be blobs of
   PERFUMERS that worked for that house"; "please distinguish the houses blobs
   and the perfumer blobs"; "make the return button just go back to the black
   nodes page". */
test("test page 1: the strings first, a dot a house; a block opens its perfumer's world, a house its world of perfumers, Return the strings", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 5000 });
  // the strings: a dot for every house a perfumer made for — 40 of them
  expect(await page.evaluate(() => window.TestPage1.view())).toBe("rays");
  expect(await page.evaluate(() => window.TestPage1.dots())).toBe(40);
  expect(await page.evaluate(() => window.TestPage1.perfumers)).toBe(32);
  expect((await page.evaluate(() => window.TestPage1.blockOf("prin-lomros"))).dots).toBe(3);
  expect((await page.evaluate(() => window.TestPage1.blockOf("aichi-liu"))).dots).toBe(2);
  await expect(page.locator(".t1-return")).toBeHidden();
  await expect(page.locator(".t1-rays-say")).toHaveCount(0);
  // a block pressed: its perfumer's world, round, its houses round it, cut
  const b = await page.evaluate(() => window.TestPage1.blockOf("aichi-liu"));
  await page.mouse.click((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 5000 }).toBe("world");
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "per", perfumer: "aichi-liu", house: null, count: 14 });
  await expect(page.locator("[data-v=name]")).toHaveText("Aichi Liu");
  await expect(page.locator("[data-v=houses]")).toHaveText("2");
  await expect(page.locator(".t1-head-name")).toHaveText("The World of Aichi Liu");
  await expect(page.locator(".t1-return")).toBeVisible();
  expect(await page.evaluate(() => window.TestPage1.lobes())).toEqual(["Om Parfums", "Outsider Parfums"]);
  expect(await page.evaluate(() => window.TestPage1.shape())).toBe("round");
  expect(await page.evaluate(() => window.TestPage1.sphereKinds())).toEqual(["house:cut", "house:cut"]);
  await expect(page.locator(".t1-list-rows button")).toHaveCount(2);
  // a house round it pressed: the house in the middle, cut, and its
  // perfumers round it — the perfumer it came from among them
  await page.waitForTimeout(900);
  const h = await page.evaluate(() => window.TestPage1.houseAt("om-parfums"));
  await page.mouse.click(h.x, h.y);
  expect(await page.evaluate(() => window.TestPage1.busy())).toBe("change");
  await expect.poll(() => page.evaluate(() => window.TestPage1.busy())).toBe(null);
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "house", perfumer: null, house: "om-parfums", count: 9 });
  await expect(page.locator("[data-v=name]")).toHaveText("Om Parfums");
  await expect(page.locator("[data-v=kicker]")).toHaveText("House");
  await expect(page.locator("[data-v=houses-say]")).toHaveText("Perfumers");
  await expect(page.locator(".t1-head-name")).toHaveText("The World of Om Parfums");
  expect(await page.evaluate(() => window.TestPage1.shape())).toBe("cut");
  expect(await page.evaluate(() => window.TestPage1.sphereKinds())).toEqual(["per:round"]);
  expect(await page.evaluate(() => window.TestPage1.list())).toEqual(["Aichi Liu"]);
  // its perfumer pressed: back in her world
  const a = await page.evaluate(() => window.TestPage1.perfumerAt("aichi-liu"));
  await page.mouse.click(a.x, a.y);
  await expect.poll(() => page.evaluate(() => window.TestPage1.busy())).toBe(null);
  expect((await page.evaluate(() => window.TestPage1.now())).perfumer).toBe("aichi-liu");
  // a house from the list, and Return from it: straight to the strings
  await page.locator(".t1-list-rows button", { hasText: "Outsider Parfums" }).click();
  await expect.poll(() => page.evaluate(() => window.TestPage1.now().house)).toBe("outsider-parfums");
  await expect.poll(() => page.evaluate(() => window.TestPage1.busy())).toBe(null);
  await page.locator(".t1-return").click();
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("rays");
  // from the list of every perfumer, and Esc back: Prin Lomros' three houses
  await page.locator(".t1-pick").selectOption({ label: "Prin Lomros" });
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 5000 }).toBe("world");
  expect((await page.evaluate(() => window.TestPage1.now())).count).toBe(139);
  expect(await page.evaluate(() => window.TestPage1.lobes())).toHaveLength(3);
  await page.locator(".t1-list-rows button", { hasText: "PRIN" }).first().click();
  await expect.poll(() => page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "house", perfumer: null, house: "prin", count: 40 });
  await expect.poll(() => page.evaluate(() => window.TestPage1.busy())).toBe(null);
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("rays");
  // an address can name a house
  await page.goto("/test-pages/1/#house-adar");
  await page.waitForTimeout(900);
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "house", perfumer: null, house: "adar", count: 11 });
  expect(await page.evaluate(() => window.TestPage1.spheres())).toBe(4);
  expect(errors).toEqual([]);
});

/* 2026-11-08 — "make the lines that connect to the node in the bottom center
   like strings, that get taught when you interact with them"; "when you hover
   the dots ... the entire block and all the dots get highlighted. also not
   all this information should be highlighted ... just show the perfumer's
   name, and number of houses". */
test("test page 1: the strings hang slack, pull taut under the hand, ring when plucked; the block lit whole, its note short", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 5000 });
  await page.mouse.move(640, 20);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.TestPage1.slack("prin-lomros")), "slack at rest").toBeGreaterThan(0.8);
  expect(await page.evaluate(() => window.TestPage1.sag("prin-lomros")), "hanging").toBeGreaterThan(8);
  const b = await page.evaluate(() => window.TestPage1.blockOf("prin-lomros"));
  await page.mouse.move((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, { steps: 4 });
  await page.waitForTimeout(900);
  expect(await page.evaluate(() => window.TestPage1.slack("prin-lomros")), "pulled taut").toBeLessThan(0.15);
  expect(await page.evaluate(() => window.TestPage1.sag("prin-lomros")), "straight").toBeLessThan(4);
  expect((await page.evaluate(() => window.TestPage1.blockOf("prin-lomros"))).lit, "the block lit whole").toBeGreaterThan(0.8);
  await expect(page.locator(".t1-tip b")).toHaveText("Prin Lomros");
  await expect(page.locator(".t1-tip span")).toHaveText("3 houses");
  await expect(page.locator(".t1-tip")).toHaveText("Prin Lomros3 houses");
  // the hand gone: slack again
  await page.mouse.move(640, 20, { steps: 3 });
  await page.waitForTimeout(1400);
  expect(await page.evaluate(() => window.TestPage1.slack("prin-lomros"))).toBeGreaterThan(0.8);
  await expect(page.locator(".t1-tip")).toBeHidden();
  // the hand drawn across the strings near the point plucks them
  await page.waitForTimeout(1500);
  const hub = await page.evaluate(() => ({ y: innerHeight * 0.84 - 60, x: innerWidth / 2 }));
  await page.mouse.move(hub.x - 200, hub.y);
  await page.mouse.move(hub.x + 200, hub.y, { steps: 10 });
  expect(await page.evaluate(() => window.TestPage1.ringing()), "ringing").toBeGreaterThan(5);
  expect(errors).toEqual([]);
});

/* Test page 1's blob, the owner (2026-11-06, the very last round): "Maybe
   experiment with chromattic abberation to achieve that colour ..." — the
   lens: no colour painted, the blob's red, green and blue each seeing it a
   little apart, so its edge is blue where it begins on the upper left and
   gold on the lower right. A perfumer's dark a plum, a house's a cold ink
   (2026-11-08). The lens's split before it is ?look=split, and the version
   the owner asked to keep, "TP1 backup", ?look=backup. */
test("test page 1: the lens by default — blue above, gold below, plum or ink — the split and TP1 backup on the address", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/#prin-lomros");
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.TestPage1.look())).toBe("lens");
  expect(await page.evaluate(() => window.TestPage1.lobes())).toHaveLength(3);
  const rim = await page.evaluate(() => window.TestPage1.rim());
  expect(rim.upLeft[2]).toBeGreaterThan(rim.upLeft[0] + 100);
  expect(rim.downRight[0]).toBeGreaterThan(rim.downRight[2] + 100);
  const plum = await page.evaluate(() => window.TestPage1.core());
  expect(plum[0], "a perfumer's dark is warm").toBeGreaterThan(plum[2]);
  // the spheres painted at the screen's own sharpness, not blown up
  await expect.poll(() => page.evaluate(() => window.TestPage1.sharpness().length)).toBe(3);
  for (const k of await page.evaluate(() => window.TestPage1.sharpness())) expect(k).toBeGreaterThan(0.5);
  await page.goto("/test-pages/1/#house-prin");
  await page.waitForTimeout(1500);
  const ink = await page.evaluate(() => window.TestPage1.core());
  expect(ink[2], "a house's dark is cold").toBeGreaterThan(ink[0]);
  for (const look of ["split", "backup"]) {
    await page.goto(`/test-pages/1/?look=${look}#prin-lomros`);
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => window.TestPage1.look())).toBe(look);
    expect(await page.evaluate(() => window.TestPage1.view())).toBe("world");
    expect(await page.evaluate(() => window.TestPage1.lobes())).toHaveLength(3);
  }
  expect(errors).toEqual([]);
});

/* Test page 1, 2026-11-07 and 2026-11-08 — "i want you to be able to hover it
   only when it is fully loaded"; "remove the 'the most ___'"; "under the
   houses on the left, you should ommit the informatio of the houses"; "below
   the blobs, i want you to remove that paragraph, and then move it to the
   bottom of the scrolled page ... make the button say 'Learn More about
   ________'"; the hint, the date, and the line along the strings' foot gone. */
test("test page 1: nothing answers until it is ready; the readings trimmed; Learn More about it at the foot", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await page.waitForTimeout(300);
  const d = await page.evaluate(() => window.TestPage1.dotOf("prin-lomros"));
  await page.mouse.move(d.x, d.y);
  await page.waitForTimeout(150);
  await expect(page.locator(".t1-tip"), "nothing answers while it comes in").toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/is-ready/);
  await expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 5000 });
  await page.mouse.move(d.x + 1, d.y);
  await expect(page.locator(".t1-tip")).toBeVisible();
  // the strings through the lens: a blue and a warm fringe either side of white
  const fr = await page.evaluate(([x, y]) => {
    const c = document.querySelector(".t1-scene"), k = c.width / innerWidth;
    const g = c.getContext("2d").getImageData(Math.round((x - 6) * k), Math.round((y - 6) * k), Math.round(12 * k), Math.round(12 * k)).data;
    let blue = 0, red = 0;
    for (let i = 0; i < g.length; i += 4) { if (g[i + 2] > g[i] + 80) blue++; if (g[i] > g[i + 2] + 80) red++; }
    return { blue, red };
  }, [d.x, d.y]);
  expect(fr.blue, "a blue fringe").toBeGreaterThan(0);
  expect(fr.red, "a warm fringe").toBeGreaterThan(0);
  // gone: the most, the bars, the houses under their count, the three lines,
  // the hint, the date
  await expect(page.locator("[data-v=most], .t1-bar i, [data-v=houses-sub], .t1-lines, .t1-hint, .t1-date, .t1-li-name small")).toHaveCount(0);
  await page.evaluate(() => window.TestPage1.open("antoine-lie", true));
  await page.waitForTimeout(600);
  await expect(page.locator("[data-v=sub]")).toHaveText("France");
  await expect(page.locator("[data-v=houses-say]")).toHaveText("Houses");
  // Learn More about him: the paragraph, his biography and its three sources
  const more = page.locator(".t1-more-open");
  await expect(more).toBeVisible();
  await expect(more).toHaveText(/^Learn More about Antoine Lie/);
  await more.click();
  await expect(page.locator(".t1-more")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await expect(page.locator("[data-v=more-name]")).toHaveText("Antoine Lie");
  await expect(page.locator(".t1-more-lead p")).not.toHaveCount(0);
  await expect(page.locator(".t1-more-text p")).not.toHaveCount(0);
  await expect(page.locator(".t1-more-sources li")).toHaveCount(3);
  await page.locator(".t1-more-close").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(page.locator(".t1-more")).toBeHidden();
  // a house's: what each of its perfumers made for it
  await page.evaluate(() => window.TestPage1.ret());
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("rays");
  await page.evaluate(() => window.TestPage1.openHouse("tale-parfums", true));
  await page.waitForTimeout(500);
  await expect(more).toHaveText(/^Learn More about Tale Parfums/);
  await more.click();
  await expect(page.locator("[data-v=more-kicker]")).toHaveText("About the house");
  await expect(page.locator(".t1-more-group")).toHaveCount(3);
  await expect(page.locator(".t1-more-group li")).toHaveCount(4);
  expect(errors).toEqual([]);
});

/* Test page 1, 2026-11-08 — "when you click on it, make the animation better,
   make it revolve around chromatic abberation": the block's dots reel in to
   the point, and the world opens out of it through three discs, a colour
   each, a little apart — a band only one colour has reached (blue) is seen
   on the way. The search: a perfumer, a house (its own world now) or a
   perfume (its perfumer's world, its house lit). */
test("test page 1: the opening comes apart into its colours; the search takes you to a perfumer or a house", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 5000 });
  const b = await page.evaluate(() => window.TestPage1.blockOf("antoine-lie"));
  await page.mouse.click((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
  expect(await page.evaluate(() => window.TestPage1.busy())).toBe("open");
  expect(await page.evaluate(() => window.TestPage1.view())).toBe("rays");
  // a pure blue band, where only the blue disc has passed
  let blue = 0;
  for (let i = 0; i < 40 && !blue; i++) {
    blue = await page.evaluate(() => {
      if (window.TestPage1.busy() !== "open") return -1;
      const c = document.querySelector(".t1-scene"), g = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let k = 0; k < g.length; k += 16) if (g[k + 2] > 170 && g[k] < 70 && g[k + 1] < 120) n++;
      return n > 60 ? n : 0;
    });
    if (blue < 0) break;
  }
  expect(blue, "a band of blue alone as the world opens").toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 5000 }).toBe("world");
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "per", perfumer: "antoine-lie", house: null, count: 4 });
  // the search: a perfume, on to its perfumer, its house lit in the list
  const find = page.locator(".t1-find input");
  await find.click();
  await find.pressSequentially("haxan", { delay: 20 });
  const first = page.locator(".t1-found button").first();
  await expect(first).toContainText("Perfume");
  await expect(first).toContainText("Haxan");
  await find.press("Enter");
  await expect.poll(() => page.evaluate(() => window.TestPage1.now().perfumer)).toBe("prin-lomros");
  await expect(page.locator(".t1-list-rows button.is-found")).toHaveCount(1, { timeout: 4000 });
  await expect(page.locator(".t1-list-rows button.is-found")).toContainText("Parfum Prissana");
  await expect(page.locator(".t1-tip")).toContainText("Haxan");
  // a house, once, to its own world; a perfumer from the strings
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("rays");
  await find.click();
  await find.pressSequentially("lost tribe", { delay: 20 });
  await expect(page.locator(".t1-found button")).toHaveCount(1);
  await expect(page.locator(".t1-found button").first()).toContainText("House");
  await find.press("Enter");
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 5000 }).toBe("world");
  expect(await page.evaluate(() => window.TestPage1.now())).toEqual({ kind: "house", perfumer: null, house: "lost-tribe", count: 6 });
  await find.click();
  await find.fill("ivan");
  await expect(page.locator(".t1-found button")).toHaveCount(0);
  await find.fill("russian");
  await expect(page.locator(".t1-found button").first()).toContainText("Perfumer");
  await page.locator(".t1-found button").first().click();
  await expect.poll(() => page.evaluate(() => window.TestPage1.now().perfumer), { timeout: 5000 }).toBe("russian-adam");
  expect(errors).toEqual([]);
});

/* Test page 1, 2026-11-07, last — "Remove the names of the houses from the
   blobs", and then "remove all tthose little texts around the middle nodes":
   nothing is written on the poster at all. A sphere under the hand lights its
   row and says what it is in the small note by the hand — and, since
   2026-11-08 ("make it also stay there, unless you hover over another blob"),
   the double circle and the row stay on it after the hand has gone. */
test("page 1: nothing is written round the blobs; the sphere under the hand lights its row, and the circle stays on it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.addInitScript(() => {
    window.__written = null;
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
      if (window.__written) window.__written.push(String(text));
      return fill.call(this, text, ...rest);
    };
  });
  const written = async () => {
    await page.evaluate(() => (window.__written = []));
    await page.waitForTimeout(500);
    return page.evaluate(() => window.__written);
  };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/test-pages/1/#prin-lomros");
  await expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 5000 });
  await page.waitForTimeout(1600);
  await page.mouse.move(5, 890);
  expect(await written(), "a perfumer's world: nothing written").toEqual([]);
  await page.locator('.t1-list-rows button[data-row="1"]').hover();
  expect(await written(), "nor beside a lobe").toEqual([]);
  await page.mouse.move(5, 890);
  // a sphere under the hand: its row lights, the note names it
  const at = await page.evaluate(() => window.TestPage1.houseAt("prin"));
  await page.mouse.move(at.x, at.y, { steps: 4 });
  await expect(page.locator(".t1-list-rows button.is-lit")).toHaveCount(1);
  await expect(page.locator(".t1-list-rows button.is-lit")).toContainText("PRIN");
  await expect(page.locator(".t1-tip")).toContainText("PRIN");
  await expect(page.locator(".t1-tip")).toContainText("press to open its world");
  // the hand gone: the note goes, the circle and the row stay
  await page.mouse.move(5, 890, { steps: 4 });
  await expect(page.locator(".t1-tip")).toBeHidden();
  await page.waitForTimeout(900);
  expect((await page.evaluate(() => window.TestPage1.circle())).on).toBe("prin");
  await expect(page.locator(".t1-list-rows button.is-lit")).toContainText("PRIN");
  const c = await page.evaluate(() => window.TestPage1.circle());
  const p = await page.evaluate(() => window.TestPage1.houseAt("prin"));
  expect(Math.hypot(c.x - p.x, c.y - p.y), "round the sphere").toBeLessThan(12);
  // another sphere takes it; the middle gives it back
  const q = await page.evaluate(() => window.TestPage1.houseAt("parfum-prissana"));
  await page.mouse.move(q.x, q.y, { steps: 4 });
  await page.waitForTimeout(200);
  expect((await page.evaluate(() => window.TestPage1.circle())).on).toBe("parfum-prissana");
  const mid = await page.evaluate(() => window.TestPage1.middle());
  await page.mouse.move(mid.x, mid.y, { steps: 4 });
  await page.waitForTimeout(200);
  expect((await page.evaluate(() => window.TestPage1.circle())).on, "the middle takes it back").toBe(null);
  // a house's world: nothing written; its perfumer's sphere says what it is
  await page.evaluate(() => window.TestPage1.ret());
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("rays");
  await page.evaluate(() => window.TestPage1.openHouse("parfum-prissana", true));
  await page.waitForTimeout(1200);
  expect(await written(), "a house's world: nothing written").toEqual([]);
  const back = await page.evaluate(() => window.TestPage1.perfumerAt("prin-lomros"));
  await page.mouse.move(back.x, back.y, { steps: 3 });
  await expect(page.locator(".t1-tip")).toContainText("Prin Lomros");
  await expect(page.locator(".t1-tip")).toContainText("press to open their world");
  await expect(page.locator(".t1-head-name")).toHaveText("The World of Parfum Prissana");
  expect(errors).toEqual([]);
});

test("test page 1: the spheres keep leaning to the hand while it is over the list", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/#prin-lomros");
  await page.waitForTimeout(2600);
  const at = () => page.evaluate(() => window.TestPage1.houseAt("parfum-prissana"));
  await page.mouse.move(640, 400);
  await page.waitForTimeout(1500);
  const middle = await at();
  const row = await page.locator(".t1-list-rows button").first().boundingBox();
  await page.mouse.move(row.x + row.width / 2, row.y + row.height / 2, { steps: 8 });
  await page.waitForTimeout(1800);
  const over = await at();
  expect(over.x, "leaning, not snapped back").toBeLessThan(middle.x - 3);
});

/* Test page 2, redesigned round the perfumers (2026-11-07 — "completly
   redesign the hierarchy of the information, and focus on it being a
   perfumers page. not an accords page"): a dome for every perfumer, the
   houses round the outside, every perfume a tick; zoomable as it was; the
   panel and the search on perfumers, houses and perfumes. */
test("test page 2: a dome for every perfumer, their houses round it, every perfume a tick, and no accords", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/2/");
  await page.waitForTimeout(900);
  expect(await page.evaluate(() => [window.TestPage2.perfumers, window.TestPage2.houses, window.TestPage2.perfumes])).toEqual([32, 27, 280]);
  expect(await page.evaluate(() => "accords" in window.TestPage2)).toBe(false);
  await expect(page.locator("h1")).toContainText("Perfumer");
  await expect(page.locator(".t2-pers li")).toHaveCount(32);
  await expect(page.locator(".t2-houses li")).toHaveCount(27);
  // a perfumer pointed at in the list is the one in focus
  await page.locator(".t2-pers li", { hasText: "Antoine Lie" }).hover();
  await expect.poll(() => page.evaluate(() => window.TestPage2.focus())).toBe("perfumer:antoine-lie");
  await expect(page.locator(".t2-houses li.is-lit")).toHaveCount(1);
  await expect(page.locator(".t2-houses li.is-lit")).toContainText("Les Abstraits");
  // pressed on the poster: their panel — the biography and its three sources, their houses and perfumes
  const [x, y] = await page.evaluate(() => window.TestPage2.at("perfumer", "Aichi Liu"));
  await page.mouse.click(x, y);
  expect(await page.evaluate(() => window.TestPage2.info())).toEqual({ kind: "perfumer", name: "Aichi Liu" });
  await expect(page.locator(".t2-info .t2-n")).toHaveText("Aichi Liu");
  await expect(page.locator(".t2-info .t2-bio p")).not.toHaveCount(0);
  await expect(page.locator(".t2-info .t2-bio-src li")).toHaveCount(3);
  await expect(page.locator('.t2-info .t2-row[data-go^="house:"]')).toHaveCount(2);
  // a house in it, then a perfume, then Back
  await page.locator('.t2-info .t2-row[data-go^="house:"]', { hasText: "Om Parfums" }).click();
  expect(await page.evaluate(() => window.TestPage2.info())).toEqual({ kind: "house", name: "Om Parfums" });
  await page.locator('.t2-info .t2-link[data-go^="perfume:"]').first().click();
  expect((await page.evaluate(() => window.TestPage2.info())).kind).toBe("perfume");
  await expect(page.locator(".t2-info .t2-n")).not.toHaveText("");
  await page.locator(".t2-info-back").click();
  expect((await page.evaluate(() => window.TestPage2.info())).kind).toBe("house");
  // a perfume's notes, where the Note Library files them, with their accords
  await page.locator(".t2-find input").fill("des cendres");
  await page.locator(".t2-find input").press("Enter");
  expect(await page.evaluate(() => window.TestPage2.info())).toEqual({ kind: "perfume", name: "Des Cendres" });
  await expect(page.locator(".t2-info .t2-chip")).not.toHaveCount(0);
  await expect(page.locator(".t2-info")).toContainText("Antoine Lie");
  expect(errors).toEqual([]);
});

test("test page 2 zooms: the wheel, the buttons, a double-click and the keys, and Fit shows the whole again", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/2/");
  await page.waitForTimeout(700);
  const z = () => page.evaluate(() => window.TestPage2.goal());
  expect(await z()).toBe(1);
  await page.mouse.move(800, 400);
  await page.mouse.wheel(0, -400);
  await expect.poll(z).toBeGreaterThan(1.5);
  await page.locator(".t2-fit").click();
  await expect.poll(z).toBe(1);
  await page.locator('.t2-zoom [data-z="1"]').click();
  await expect.poll(z).toBeGreaterThan(1.5);
  await page.keyboard.press("0");
  await expect.poll(z).toBe(1);
  await page.mouse.dblclick(800, 400);
  await expect.poll(z).toBeGreaterThan(2);
  await page.keyboard.press("-");
  await page.keyboard.press("-");
  await page.keyboard.press("-");
  await expect.poll(z).toBe(1);
});

test("test page 2's search finds a perfumer, a house or a perfume, and flies there", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/2/");
  await page.waitForTimeout(700);
  const find = page.locator(".t2-find input");
  await find.fill("nilss");
  await expect(page.locator(".t2-found li").first()).toContainText("Nicholas Nilsson");
  await expect(page.locator(".t2-found li").first()).toContainText("Perfumer");
  await find.press("Enter");
  expect(await page.evaluate(() => window.TestPage2.info())).toEqual({ kind: "perfumer", name: "Nicholas Nilsson" });
  await expect.poll(() => page.evaluate(() => window.TestPage2.goal())).toBeGreaterThan(1.1);
  await find.fill("strangers");
  await expect(page.locator(".t2-found li").first()).toContainText("House");
  await find.press("Enter");
  expect(await page.evaluate(() => window.TestPage2.info())).toEqual({ kind: "house", name: "Strangers Parfumerie" });
  await find.fill("haxan");
  await find.press("Enter");
  expect(await page.evaluate(() => window.TestPage2.info())).toEqual({ kind: "perfume", name: "Haxan" });
  await find.fill("qqzzvv");
  await expect(page.locator(".t2-found-none")).toBeVisible();
});

test.describe("test page 2 on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("a tap opens the panel, and the + comes closer", async ({ page }) => {
    await serveDependenciesLocally(page);
    await page.goto("/test-pages/2/");
    await page.waitForTimeout(900);
    const [x, y] = await page.evaluate(() => window.TestPage2.at("perfumer", "Prin Lomros"));
    await page.touchscreen.tap(x, y);
    await expect.poll(() => page.evaluate(() => window.TestPage2.info() && window.TestPage2.info().kind)).toBe("perfumer");
    await expect(page.locator(".t2-info")).toBeVisible();
    await page.locator(".t2-info-close").tap();
    await page.locator('.t2-zoom [data-z="1"]').tap();
    await expect.poll(() => page.evaluate(() => window.TestPage2.goal())).toBeGreaterThan(1.5);
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
  expect(await page.evaluate(() => window.TestPage4.nodes())).toEqual({ perfumers: 32, houses: 40, perfumes: 282 });
  // dense, as the references are ("not just a few lines"): every letter of
  // every perfume's name a node, and every note of every perfume on the site
  const n = await page.evaluate(() => window.TestPage4.counts());
  expect(n.letter).toBeGreaterThan(2500);
  expect(n.notes).toBe(379);
  expect(n.links).toBeGreaterThan(4000);
  await expect(page.locator(".t4-table tbody tr")).toHaveCount(32);
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
  // a perfume: its letters drawn round it; no matrix of numbers down the
  // left since 2026-11-07, and Information under the readings
  await page.locator(".t4-sub [data-leaf]", { hasText: "Haxan" }).click();
  expect(await page.evaluate(() => window.TestPage4.focus())).toEqual({ kind: "perfume", name: "Haxan", stage: 4 });
  await expect(page.locator("[data-v=stage]")).toHaveText("STAGE 4: LETTERS");
  await expect(page.locator(".t4-letters")).toHaveCount(0);
  await expect(page.locator(".t4-read")).not.toContainText("{");
  await expect(page.locator(".t4-info")).toBeVisible();
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

/* Test page 4, 2026-11-07 — "you to be able to hover only the strata or
   hierarchy level which youre on ... so make sure that you can only select
   things of the appropriate hierarchy level"; "remove them [the numbers],
   expand the diagram a little an dmove it to the left, and then add a button
   for 'information' that you can click to scroll down and read about this
   perfumer"; and the table, with its search, folding away. */
test("test page 4: only the level you are on answers, Information scrolls to the perfumer, and the table folds", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/4/");
  await page.evaluate(() => { try { localStorage.removeItem("t4-folded"); } catch (e) {} });
  await page.reload();
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.TestPage4.choose("Antoine Lie"));
  await page.waitForTimeout(2200);
  // its own house answers the hand; another perfumer's does not
  const own = await page.evaluate(() => window.TestPage4.pointOf("Les Abstraits"));
  await page.mouse.move(own.x, own.y);
  await expect(page.locator(".t4-tip")).toBeVisible();
  await expect(page.locator(".t4-tip")).toContainText("Les Abstraits");
  const other = await page.evaluate(() => window.TestPage4.pointOf("Nicholas Nilsson"));
  if (other.x > 0 && other.x < 1280 && other.y > 0 && other.y < 800) {
    await page.mouse.move(other.x, other.y);
    await page.waitForTimeout(100);
    await expect(page.locator(".t4-tip")).not.toContainText("Nicholas Nilsson");
  }
  // Information: the biography on a sheet under the graph, scrolled to
  await page.locator(".t4-info").click();
  await expect(page.locator(".t4-more")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await expect(page.locator("[data-v=more-name]")).toHaveText("Antoine Lie");
  await expect(page.locator(".t4-more-sources li")).toHaveCount(3);
  await page.locator(".t4-more-close").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  // the table folds away with its search, and the graph takes the room
  const x0 = (await page.evaluate(() => window.TestPage4.pointOf("Antoine Lie"))).x;
  await page.locator(".t4-fold").click();
  await expect(page.locator(".t4-table-scroll")).toBeHidden();
  await expect(page.locator(".t4-find")).toBeHidden();
  // what is looked at moves over into the middle of the room the table left
  await expect.poll(async () => (await page.evaluate(() => window.TestPage4.pointOf("Antoine Lie"))).x).toBeGreaterThan(x0 + 60);
  await page.locator(".t4-fold").click();
  await expect(page.locator(".t4-table-scroll")).toBeVisible();
  await page.evaluate(() => { try { localStorage.removeItem("t4-folded"); } catch (e) {} });
  expect(errors).toEqual([]);
});

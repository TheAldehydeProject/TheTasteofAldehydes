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
  expect(await page.evaluate(() => window.TestPage1.perfumers)).toBe(32);
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
  await page.waitForTimeout(2000);
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

/* Test page 1's blob, the owner (2026-11-06, the very last round): "Maybe
   experiment with chromattic abberation to achieve that colour. I think in my
   reference there is blue/orange colour average that gives it that vibe" —
   the lens: no colour painted, the blob's red, green and blue each seeing it
   a little apart, so its edge is blue where it begins on the upper left and
   gold on the lower right. The lens's split before it is ?look=split, and the
   version the owner asked to keep, "TP1 backup", ?look=backup. */
test("test page 1: the lens by default — blue above, gold below — the split and TP1 backup on the address", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/#prin-lomros");
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.TestPage1.look())).toBe("lens");
  expect(await page.evaluate(() => window.TestPage1.lobes())).toHaveLength(3);
  const rim = await page.evaluate(() => window.TestPage1.rim());
  // where the edge begins: blue on the upper left, warm on the lower right
  expect(rim.upLeft[2]).toBeGreaterThan(rim.upLeft[0] + 100);
  expect(rim.downRight[0]).toBeGreaterThan(rim.downRight[2] + 100);
  for (const look of ["split", "backup"]) {
    await page.goto(`/test-pages/1/?look=${look}#prin-lomros`);
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => window.TestPage1.look())).toBe(look);
    expect(await page.evaluate(() => window.TestPage1.view())).toBe("world");
    expect(await page.evaluate(() => window.TestPage1.lobes())).toHaveLength(3);
  }
  expect(errors).toEqual([]);
});

/* Test page 1, 2026-11-07 — "make the loading of it smoother, and i want you
   to be able to hover it only when it is fully loaded. also add chromatic
   abberation ... to the first basic test page 1. then when you click on a
   house, from all the information present on image 2, only keep whats on
   image 3 ... (but remove 'the most 139') ... fix a hovering problem ... a
   button to learn more ... also remove the random numbers ... remove that
   random blue bar that sits below each hosue named". */
test("test page 1: nothing answers until it is ready, the readings trimmed, Learn more, and no numbers or bars", async ({ page }) => {
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
  // the rays through the lens: a red and a blue fringe either side of white
  const fr = await page.evaluate(([x, y]) => {
    const c = document.querySelector(".t1-scene"), k = c.width / innerWidth;
    const g = c.getContext("2d").getImageData(Math.round((x - 6) * k), Math.round((y - 6) * k), Math.round(12 * k), Math.round(12 * k)).data;
    let blue = 0, red = 0;
    for (let i = 0; i < g.length; i += 4) { if (g[i + 2] > g[i] + 80) blue++; if (g[i] > g[i + 2] + 80) red++; }
    return { blue, red };
  }, [d.x, d.y]);
  expect(fr.blue, "a blue fringe").toBeGreaterThan(0);
  expect(fr.red, "a warm fringe").toBeGreaterThan(0);
  // a perfumer's readings: who, where, perfumes against the most, houses — no years, no shares
  await page.evaluate(() => window.TestPage1.open("antoine-lie"));
  await page.waitForTimeout(1800);
  await expect(page.locator("[data-v=sub]")).toHaveText("France");
  await expect(page.locator("[data-v=most]")).toHaveText("the most, 139");
  await expect(page.locator("[data-v=years], .t1-credit, .t1-gauge")).toHaveCount(0);
  await expect(page.locator(".t1-li-bar")).toHaveCount(0);
  // a house's: who for, perfumes, founded — and not "the most"
  await page.evaluate(() => window.TestPage1.open("antoine-lie", "les-abstraits"));
  await page.waitForTimeout(800);
  await expect(page.locator("[data-v=sub]")).toHaveText("by Antoine Lie");
  await expect(page.locator("[data-v=most]")).toHaveText("");
  await expect(page.locator("[data-v=houses-say]")).toHaveText("Founded");
  await expect(page.locator(".t1-more-open"), "Learn more is a perfumer's").toBeHidden();
  // Learn more: the biography under the poster, scrolled to, its three sources at its foot
  await page.evaluate(() => window.TestPage1.open("antoine-lie"));
  await page.waitForTimeout(1600);
  const more = page.locator(".t1-more-open");
  await expect(more).toBeVisible();
  const lines = await page.locator(".t1-lines").boundingBox(), mb = await more.boundingBox();
  expect(mb.x, "to the right of the three lines").toBeGreaterThan(lines.x + lines.width);
  await more.click();
  await expect(page.locator(".t1-more")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await expect(page.locator("[data-v=more-name]")).toHaveText("Antoine Lie");
  await expect(page.locator(".t1-more-text p")).not.toHaveCount(0);
  await expect(page.locator(".t1-more-sources li")).toHaveCount(3);
  await page.locator(".t1-more-close").click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  await expect(page.locator(".t1-more")).toBeHidden();
  expect(errors).toEqual([]);
});

/* 2026-11-07 — "fix a hovering problem. whenever you hover anything that is
   clickable, the movement of the position of the objects that can move on
   the page (and follow the mouse) snaps back to their original and defualt
   position": the spheres lean to the hand over the list too. */
/* Test page 1, 2026-11-07, later — "Please animate test page one when you
   clik on any perfumer; and add a search. That search should work by
   searching anything (perfume, perfume) and then taking you to the perfumer.
   Also please animate it so its nice. I want a slightly thematic animation."
   A perfumer pressed: its dots run in along their rays to the point (the
   gathering), then its world opens out of that point through the lens; the
   search finds a perfumer, a house or a perfume and takes you to the
   perfumer, a house or a perfume asked for lit there. */
test("test page 1: a perfumer pressed gathers into the point and opens from it; the search takes you to the perfumer", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/test-pages/1/");
  await expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 5000 });
  const d = await page.evaluate(() => window.TestPage1.dotOf("antoine-lie"));
  await page.mouse.click(d.x, d.y);
  // still the rays while it gathers, the world after
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.TestPage1.view())).toBe("rays");
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("world");
  await page.waitForTimeout(1800);
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
  // a house names every perfumer it has; from the rays a perfumer gathers in
  await page.keyboard.press("Escape");
  await page.evaluate(() => window.TestPage1.ret());
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("rays");
  await page.waitForTimeout(600);
  await find.click();
  await find.pressSequentially("lost tribe", { delay: 20 });
  await expect(page.locator(".t1-found button")).toHaveCount(2);
  await find.fill("ivan");
  await expect(page.locator(".t1-found button")).toHaveCount(0);
  await find.fill("russian");
  await expect(page.locator(".t1-found button").first()).toContainText("Perfumer");
  await page.locator(".t1-found button").first().click();
  await expect.poll(() => page.evaluate(() => window.TestPage1.view()), { timeout: 4000 }).toBe("world");
  expect((await page.evaluate(() => window.TestPage1.now())).perfumer).toBe("russian-adam");
  expect(errors).toEqual([]);
});

/* Test page 1, 2026-11-07, last — "Remove the names of the houses from the
   blobs in TP1. I dont want them there", and then "remove the numbers that
   surround the main nodes. the years ... remove all tthose little texts
   around the middle nodes": nothing is written on the poster at all — no
   house under its sphere or by a lobe, no year, no way back named. A sphere
   under the hand lights its row in the list and says what it is in the small
   note by the hand, the perfumer's that it is the way back. */
test("page 1: nothing is written round the blobs; a sphere under the hand lights its row and says what it is", async ({ page }) => {
  const errors = collectPageErrors(page);
  await serveDependenciesLocally(page);
  // every word a canvas writes, once asked to listen
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
  await page.waitForTimeout(2200);
  await page.mouse.move(5, 890);
  expect(await written(), "a perfumer's world: nothing written").toEqual([]);
  // a house lit from the list: still nothing comes out of the blob
  await page.locator('.t1-list-rows button[data-row="1"]').hover();
  expect(await written(), "nor beside a lobe").toEqual([]);
  // a sphere under the hand: its row lights, and the note by the hand names it
  const at = await page.evaluate(() => window.TestPage1.houseAt("prin"));
  await page.mouse.move(at.x, at.y);
  await expect(page.locator(".t1-list-rows button.is-lit")).toHaveCount(1);
  await expect(page.locator(".t1-list-rows button.is-lit")).toContainText("PRIN");
  await expect(page.locator(".t1-tip")).toContainText("Press to see what Prin Lomros made for it");
  await page.mouse.move(5, 890);
  await expect(page.locator(".t1-list-rows button.is-lit")).toHaveCount(0);
  await expect(page.locator(".t1-tip")).toBeHidden();
  // a house's world: no years, no way back named — the note says it instead
  await page.evaluate(() => window.TestPage1.open("prin-lomros", "parfum-prissana"));
  await page.waitForTimeout(1800);
  expect(await written(), "a house's world: nothing written").toEqual([]);
  const back = await page.evaluate(() => window.TestPage1.backAt());
  await page.mouse.move(back.x, back.y);
  await expect(page.locator(".t1-tip")).toContainText("↩ Prin Lomros");
  await expect(page.locator(".t1-tip")).toContainText("Press to go back to their world");
  await expect(page.locator(".t1-head-name")).toHaveText("Parfum Prissana, and what Prin Lomros made for it");
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
  // the hand far to the right: the spheres are pushed left of where they
  // stood with the hand in the middle, not back to their rest
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

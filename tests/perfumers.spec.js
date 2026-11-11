// @ts-check
/* ============================================================
   PERFUMERS — PERFUMER WORLDS: perfumers/index.html and perfumer-worlds.js
   (since 2026-11-10; test page 1 from 2026-11-06 until the owner swapped
   the two — "also replace perfumers apge with test page 1, and vice
   versa". The radial poster that stood here is test page 1 now, and its
   tests are poster.spec.js).

   What these keep: the strings first, a dot for every house a perfumer made
   for and one hexagon for the perfumes no source credits; a string taut
   only while its perfumer is pointed at, at once, and ringing when plucked;
   a block opens its perfumer's world through three discs a beat apart, a
   house its world of perfumers, the hexagon a list and no blob; the swarm
   round the last sphere the hand was on, never the middle; Return back to
   the strings from anywhere; Learn More glided to, all the way, and Back up;
   ‹ › sliding one world out and the next in; the site's Menu on it, its
   data the live ledger, and without the script the index and the sources.
   ============================================================ */
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const PAGE = "/perfumers/";
const W = (page, f, ...a) => page.evaluate(([f, a]) => window.PerfumerWorlds[f](...a), [f, a]);
const ready = (page) => expect(page.locator("body")).toHaveClass(/is-ready/, { timeout: 6000 });

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize({ width: 1280, height: 800 });
});

/* The strings and the worlds, as on the test page (2026-11-06, 2026-11-08):
   "i want the dots not to be perfumes/fragrances, but houses"; "when you click
   on one of the houses, it takes you to a blob of the house, and then the
   surrounding blobs should be blobs of PERFUMERS"; "make the return button
   just go back to the black nodes page" — with the live ledger since
   2026-11-10, the site's Menu over it. */
test("the strings first, a dot a house; a block opens its perfumer's world, a house its world of perfumers, Return the strings", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await ready(page);
  await expect(page.locator(".menu-trigger")).toBeVisible();
  await expect(page.locator(".page-where")).toHaveText("Perfumers");
  // a dot for every house a perfumer made for, and the hexagon's one
  const want = await page.evaluate(() => {
    const L = window.PERFUMERS_DATA, by = new Map();
    for (const x of L.perfumes) for (const p of x.p) { if (p === "not-found") continue; if (!by.has(p)) by.set(p, new Set()); by.get(p).add(x.h); }
    let n = 0; by.forEach((s) => (n += s.size));
    return { dots: n + 1, perfumers: L.perfumers.length };
  });
  expect(await W(page, "view")).toBe("rays");
  expect(await W(page, "dots")).toBe(want.dots);
  expect(await page.evaluate(() => window.PerfumerWorlds.perfumers)).toBe(want.perfumers);
  expect((await W(page, "blockOf", "prin-lomros")).dots).toBe(3);
  expect((await W(page, "blockOf", "aichi-liu")).dots).toBe(2);
  expect((await W(page, "blockOf", "not-found")).dots).toBe(1);
  await expect(page.locator(".pw-return")).toBeHidden();
  // the line under the title is gone (2026-11-10 — "the second picture should
  // be ommited"), and the title with it (2026-11-11 — "remove the phrase
  // perfumer world or whatever is on the top left"): the page's heading is
  // there for a screen reader alone
  await expect(page.locator(".pw-rays-head h1")).toHaveText("Perfumers");
  await expect(page.locator(".pw-rays-head h1")).toHaveClass(/visually-hidden/);
  expect(await page.locator("body").innerText()).not.toContain("Perfumer Worlds");
  // a block pressed: its perfumer's world, round, its houses round it, cut
  const b = await W(page, "blockOf", "aichi-liu");
  await page.mouse.click((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
  await expect.poll(() => W(page, "view"), { timeout: 5000 }).toBe("world");
  expect(await W(page, "now")).toEqual({ kind: "per", perfumer: "aichi-liu", house: null, count: 14 });
  await expect(page.locator("[data-v=name]")).toHaveText("Aichi Liu");
  await expect(page.locator("[data-v=houses]")).toHaveText("2");
  await expect(page.locator(".pw-head-name")).toHaveText("The World of Aichi Liu");
  await expect(page.locator(".pw-return")).toBeVisible();
  expect(await W(page, "lobes")).toEqual(["Om Parfums", "Outsider Parfums"]);
  expect(await W(page, "shape")).toBe("round");
  expect(await W(page, "sphereKinds")).toEqual(["house:cut", "house:cut"]);
  await expect(page.locator(".pw-list-rows button")).toHaveCount(2);
  // a house round it pressed: the house in the middle, cut, its perfumers round it
  await page.waitForTimeout(900);
  const h = await W(page, "houseAt", "om-parfums");
  await page.mouse.click(h.x, h.y);
  expect(await W(page, "busy")).toBe("change");
  await expect.poll(() => W(page, "busy")).toBe(null);
  expect((await W(page, "now")).house).toBe("om-parfums");
  await expect(page.locator("[data-v=kicker]")).toHaveText("House");
  await expect(page.locator("[data-v=houses-say]")).toHaveText("Perfumers");
  expect(await W(page, "shape")).toBe("cut");
  expect(await W(page, "list")).toContain("Aichi Liu");
  // a house from the list, and Return from it: straight to the strings
  const a = await W(page, "perfumerAt", "aichi-liu");
  await page.mouse.click(a.x, a.y);
  await expect.poll(() => W(page, "busy")).toBe(null);
  await page.locator(".pw-list-rows button", { hasText: "Outsider Parfums" }).click();
  await expect.poll(() => page.evaluate(() => window.PerfumerWorlds.now().house)).toBe("outsider-parfums");
  await expect.poll(() => W(page, "busy")).toBe(null);
  await page.locator(".pw-return").click();
  await expect.poll(() => W(page, "view"), { timeout: 4000 }).toBe("rays");
  // an address names a perfumer or a house
  await page.goto(PAGE + "#house-adar");
  await page.waitForTimeout(900);
  expect((await W(page, "now")).house).toBe("adar");
  expect(errors).toEqual([]);
});

/* 2026-11-10 — "i want you to actually change the tension physics to be more
   realistic, and only make it when hovered, not with a delay": every string
   worked out as a string is, hanging under its own weight; taut the moment
   its perfumer is pointed at and only then — a pluck rings it and leaves it
   slack. */
test("a string hangs slack, is taut at once and only while its perfumer is pointed at, and a pluck rings it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await ready(page);
  await page.mouse.move(640, 20);
  await page.waitForTimeout(500);
  expect(await W(page, "slack", "prin-lomros"), "slack at rest").toBeGreaterThan(0.8);
  expect(await W(page, "sag", "prin-lomros"), "hanging").toBeGreaterThan(8);
  const b = await W(page, "blockOf", "prin-lomros");
  await page.mouse.move((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, { steps: 2 });
  // no delay: pulled within a fifth of a second
  await page.waitForTimeout(200);
  expect(await W(page, "slack", "prin-lomros"), "taut at once").toBeLessThan(0.3);
  await page.waitForTimeout(900);
  expect(await W(page, "slack", "prin-lomros"), "pulled taut").toBeLessThan(0.05);
  expect(await W(page, "sag", "prin-lomros"), "straight").toBeLessThan(4);
  expect((await W(page, "blockOf", "prin-lomros")).lit, "the block lit whole").toBeGreaterThan(0.8);
  await expect(page.locator(".pw-tip")).toHaveText("Prin Lomros3 houses");
  // the hand gone: slack again at once, and hanging again a moment after
  await page.mouse.move(640, 20, { steps: 2 });
  await page.waitForTimeout(250);
  expect(await W(page, "slack", "prin-lomros"), "let go at once").toBeGreaterThan(0.6);
  await page.waitForTimeout(1200);
  expect(await W(page, "slack", "prin-lomros")).toBeGreaterThan(0.95);
  await expect(page.locator(".pw-tip")).toBeHidden();
  // the hand drawn across the strings near the point plucks them, and
  // leaves them slack: a pluck pulls nothing taut
  const hub = await page.evaluate(() => ({ y: innerHeight * 0.84 - 60, x: innerWidth / 2 }));
  await page.mouse.move(hub.x - 200, hub.y);
  await page.mouse.move(hub.x + 200, hub.y, { steps: 10 });
  expect(await W(page, "ringing"), "ringing").toBeGreaterThan(5);
  await page.mouse.move(640, 20);
  await page.waitForTimeout(150);
  const slack = await page.evaluate(() => window.PerfumerWorlds.perfumers && ["antoine-lie", "prin-lomros", "aichi-liu"].map((id) => window.PerfumerWorlds.slack(id)));
  for (const k of slack) expect(k, "a pluck pulls nothing taut").toBeGreaterThan(0.9);
  expect(errors).toEqual([]);
});

/* 2026-11-10 — "replace the node which says perfumer not found with a hexagon,
   which says perfumers not found. it should be a list, not the same as the
   blobs. same format, but no blobs"; and later that day, "make the perfumers
   not found note on the botton right. in page, i dont want it to be a
   hexagon, rather make it just a list. a normal list": one hexagon at the
   bottom right of the strings; its world a plain list of the perfumes no
   source credits — no blob, no spheres, nothing drawn round it — its houses
   beside it as in every world. */
test("the perfumes no source credits are one hexagon at the bottom right, and their world is a plain list", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await ready(page);
  const n = await page.evaluate(() => window.PERFUMERS_DATA.perfumes.filter((x) => x.p.includes("not-found")).length);
  const d = await W(page, "dotOf", "not-found");
  expect(d.x, "on the right").toBeGreaterThan(1280 - 120);
  expect(d.y, "low, level with the point").toBeGreaterThan(800 * 0.75);
  await page.mouse.move(d.x + 12, d.y);
  await expect(page.locator(".pw-tip b")).toHaveText("Perfumers not found");
  await page.mouse.click(d.x + 12, d.y);
  await expect.poll(() => W(page, "view"), { timeout: 5000 }).toBe("world");
  expect(await W(page, "now")).toEqual({ kind: "per", perfumer: "not-found", house: null, count: n });
  await expect(page.locator("body")).toHaveClass(/is-nf/);
  expect(await W(page, "shape"), "no blob").toBe(null);
  expect(await W(page, "spheres"), "no spheres").toBe(0);
  await expect(page.locator(".pw-nf")).toBeVisible();
  await expect(page.locator(".pw-nf-rows tr")).toHaveCount(n);
  // a plain list: nothing drawn round it, and no fringe on its letters
  expect(await page.locator(".pw-nf-name").first().evaluate((el) => getComputedStyle(el).textShadow)).toBe("none");
  const drawn = await page.evaluate(() => {
    const c = document.querySelector(".pw-scene"), x = c.getContext("2d"), k = c.width / innerWidth;
    const box = document.querySelector(".pw-nf").getBoundingClientRect();
    // the ground a little outside the list, where the hexagon's lines stood
    const g = x.getImageData(Math.round((box.left - 30) * k), Math.round(box.top * k), Math.round(20 * k), Math.round(box.height * k)).data;
    let dark = 0;
    for (let i = 0; i < g.length; i += 4) if (g[i] + g[i + 1] + g[i + 2] < 400) dark++;
    return dark;
  });
  expect(drawn, "nothing drawn round it").toBe(0);
  await expect(page.locator(".pw-head-name")).toHaveText("Perfumers not found");
  await expect(page.locator("[data-v=name]")).toHaveText("Perfumers not found");
  await expect(page.locator(".pw-more-open")).toBeHidden();
  // one of its houses: the house's world, the hexagon a sphere round it
  await page.locator(".pw-list-rows button").first().click();
  await expect.poll(() => W(page, "busy"), { timeout: 4000 }).toBe(null);
  expect((await W(page, "now")).kind).toBe("house");
  await expect(page.locator("body")).not.toHaveClass(/is-nf/);
  await expect(page.locator(".pw-nf")).toBeHidden();
  expect(errors).toEqual([]);
});

/* 2026-11-10 — "in the blobs page i want you to actually remove the circle
   that goes around the things, and instead make it something more thematic;
   something more particulate. I also want you to remove the ability of the
   person to hover over the middle blob": the swarm round the last sphere the
   hand was on, staying there, and the middle never taking it. Nothing
   written round the blobs (2026-11-07). */
test("the swarm stays round the last sphere the hand was on, never the middle; nothing written round the blobs", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.addInitScript(() => {
    window.__written = null;
    const fill = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
      if (window.__written) window.__written.push(String(text));
      return fill.call(this, text, ...rest);
    };
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE + "#prin-lomros");
  await ready(page);
  await page.waitForTimeout(1600);
  await page.mouse.move(5, 890);
  expect((await W(page, "swarm")).on, "nothing at first").toBe(null);
  await page.evaluate(() => (window.__written = []));
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.__written), "nothing written").toEqual([]);
  await expect(page.locator("canvas.pw-circle, .pw-circle")).toHaveCount(0);
  const at = await W(page, "houseAt", "prin");
  await page.mouse.move(at.x, at.y, { steps: 4 });
  await expect(page.locator(".pw-list-rows button.is-lit")).toContainText("PRIN");
  await expect(page.locator(".pw-tip")).toContainText("press to open its world");
  await page.mouse.move(5, 890, { steps: 4 });
  await page.waitForTimeout(900);
  const s = await W(page, "swarm");
  expect(s.on, "it stays").toBe("prin");
  expect(s.a).toBeGreaterThan(0.8);
  expect(s.n).toBeGreaterThan(40);
  expect(Math.hypot(s.x - at.x, s.y - at.y), "round the sphere").toBeLessThan(14);
  // the middle takes nothing
  const mid = await W(page, "middle");
  await page.mouse.move(mid.x, mid.y, { steps: 4 });
  await page.waitForTimeout(300);
  expect((await W(page, "swarm")).on, "the middle has no emphasis").toBe("prin");
  // another sphere takes it
  const q = await W(page, "houseAt", "parfum-prissana");
  await page.mouse.move(q.x, q.y, { steps: 4 });
  await page.waitForTimeout(200);
  expect((await W(page, "swarm")).on).toBe("parfum-prissana");
  expect(errors).toEqual([]);
});

/* 2026-11-10 — "make the animation smoother when you click on the nodes and
   then it takes you to the blob pages. I want you to actually make that
   chromatically abberate as in lag a little": the three discs a beat apart,
   blue first — a band blue alone has reached is seen on the way; and "i want
   the top left return button to always point you to the nodes page": Return
   (and Esc) from the middle of an opening closes it back to the strings. */
test("the opening's colours come a beat apart, and Return goes back to the strings from the middle of it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await ready(page);
  const b = await W(page, "blockOf", "antoine-lie");
  await page.mouse.click((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2);
  expect(await W(page, "busy")).toBe("open");
  let blue = 0;
  for (let i = 0; i < 60 && !blue; i++) {
    blue = await page.evaluate(() => {
      if (window.PerfumerWorlds.busy() !== "open") return -1;
      const c = document.querySelector(".pw-scene"), g = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let k = 0; k < g.length; k += 16) if (g[k + 2] > 170 && g[k] < 70 && g[k + 1] < 120) n++;
      return n > 40 ? n : 0;
    });
    if (blue < 0) break;
  }
  expect(blue, "blue ahead of the rest").toBeGreaterThan(0);
  await expect.poll(() => W(page, "view"), { timeout: 5000 }).toBe("world");
  await page.locator(".pw-return").click();
  await expect.poll(() => W(page, "view"), { timeout: 4000 }).toBe("rays");
  await expect.poll(() => W(page, "busy")).toBe(null);
  // half way into the next opening, Esc: closed back, never into the world
  const p = await W(page, "blockOf", "prin-lomros");
  await page.mouse.click((p.x0 + p.x1) / 2, (p.y0 + p.y1) / 2);
  await page.waitForTimeout(900);
  expect(await W(page, "busy")).toBe("open");
  await page.keyboard.press("Escape");
  expect(await W(page, "busy")).toBe("close");
  await expect.poll(() => W(page, "busy"), { timeout: 4000 }).toBe(null);
  expect(await W(page, "view")).toBe("rays");
  // and from the middle of a change between two worlds
  await W(page, "open", "prin-lomros", true);
  await page.waitForTimeout(400);
  await page.locator(".pw-list-rows button").first().click();
  expect(await W(page, "busy")).toBe("change");
  await page.locator(".pw-return").click();
  await expect.poll(() => W(page, "view"), { timeout: 4000 }).toBe("rays");
  expect(errors).toEqual([]);
});

/* 2026-11-10 — "when you click on learn more abou [house], i want that to
   scroll smoother, slightly slower, and all the way up, rather than almost
   all the way up. change the text "back to the world" to simple "back up"";
   and "animate it better when you change the settings using the functions
   shown in image 1" — ‹ › and the list of every perfumer slide one world out
   and the next in. */
test("Learn More glides all the way up and Back up all the way back; ‹ › slide the worlds", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE + "#antoine-lie");
  await ready(page);
  await page.waitForTimeout(700);
  const more = page.locator(".pw-more-open");
  await expect(more).toHaveText(/^Learn More about Antoine Lie/);
  await more.click();
  // on its way, not there at once: a glide
  await page.waitForTimeout(250);
  const part = await page.evaluate(() => scrollY);
  const end = await page.evaluate(() => Math.round(document.querySelector(".pw-more").getBoundingClientRect().top + scrollY));
  expect(part, "on its way").toBeGreaterThan(5);
  expect(part, "not there at once").toBeLessThan(end - 40);
  await expect.poll(() => page.evaluate(() => Math.round(document.querySelector(".pw-more").getBoundingClientRect().top)), { timeout: 3000 }).toBe(0);
  await expect(page.locator(".pw-more-close")).toHaveText(/^Back up/);
  await expect(page.locator("[data-v=more-name]")).toHaveText("Antoine Lie");
  await expect(page.locator(".pw-more-sources li")).not.toHaveCount(0);
  // a perfume written about on the site is the way to it
  await expect(page.locator(".pw-more-made a").first()).toHaveAttribute("href", /^\.\.\/houses\/les-abstraits\.html#part-\d\d$/);
  await page.locator(".pw-more-close").click();
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 3000 }).toBeLessThan(2);
  await expect(page.locator(".pw-more")).toBeHidden();
  // › : the next perfumer, sliding in
  const before = (await W(page, "now")).perfumer;
  await page.locator(".pw-next").click();
  expect(await W(page, "busy")).toBe("change");
  await expect.poll(() => W(page, "busy"), { timeout: 4000 }).toBe(null);
  expect((await W(page, "now")).perfumer).not.toBe(before);
  expect(errors).toEqual([]);
});

/* The lens (2026-11-06) and the grain made softer (2026-11-10 — "make the
   noise softer in the blobs page"). */
test("the lens — blue above, gold below, plum or ink — and the grain soft", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE + "#prin-lomros");
  await page.waitForTimeout(1500);
  expect(await W(page, "look")).toBe("lens");
  const rim = await W(page, "rim");
  expect(rim.upLeft[2]).toBeGreaterThan(rim.upLeft[0] + 100);
  expect(rim.downRight[0]).toBeGreaterThan(rim.downRight[2] + 100);
  const plum = await W(page, "core");
  expect(plum[0], "a perfumer's dark is warm").toBeGreaterThan(plum[2]);
  await expect.poll(() => page.evaluate(() => window.PerfumerWorlds.sharpness().length)).toBe(3);
  await page.goto(PAGE + "#house-prin");
  await page.waitForTimeout(1500);
  const ink = await W(page, "core");
  expect(ink[2], "a house's dark is cold").toBeGreaterThan(ink[0]);
  const grain = await page.locator(".pw-grain").evaluate((el) => +getComputedStyle(el).opacity);
  expect(grain, "the grain soft").toBeLessThan(0.08);
  expect(errors).toEqual([]);
});

/* The noise (2026-11-11 — "i want the object to have an overlay of noise,
   not for it to be noisy itself"; "make it involved with the page ... When
   you actually hover with the noise, make the page change its noise overlay
   levels"; "inherently moving ... blinking and flickering"): on the graphics
   card (?gl=on, as the tests' browser has none) the blobs are drawn clean
   and the noise laid over them as a second picture; the hand in it lifts it
   and the page's own grain, and they settle once it leaves. The page's
   grain flickers of itself. */
test("the noise is an overlay round the blobs, and the hand in it lifts the page's grain", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.goto(PAGE + "?gl=on#prin-lomros");
  await expect.poll(() => W(page, "view"), { timeout: 15000 }).toBe("world");
  await expect.poll(() => page.evaluate(() => window.PerfumerWorlds.noise().grains), { timeout: 15000 }).toBeGreaterThan(0);
  const rest = await page.evaluate(() => window.PerfumerWorlds.noise());
  expect(rest.on).toBe(true);
  expect(rest.lift).toBeLessThan(1.2);
  // the clean blob: the lens's colours at its edge, untouched by the noise
  const rim = await W(page, "rim");
  expect(rim.upLeft[2]).toBeGreaterThan(rim.upLeft[0] + 100);
  // the hand onto the blob's edge
  const box = await page.evaluate(() => { const c = document.querySelector(".pw-scene").getBoundingClientRect(); return { x: c.left + c.width / 2, y: c.top + c.height / 2 }; });
  for (let i = 0; i < 12; i++) { await page.mouse.move(box.x - 175 + i * 2, box.y - 10 + i); await page.waitForTimeout(60); }
  await expect.poll(() => page.evaluate(() => window.PerfumerWorlds.noise().lift), { timeout: 15000 }).toBeGreaterThan(1.5);
  const lifted = await page.locator(".pw-grain").evaluate((el) => +getComputedStyle(el).getPropertyValue("--grain-lift"));
  expect(lifted, "the page's grain lifted with it").toBeGreaterThan(1.4);
  // away from it, it settles
  await page.mouse.move(8, 8);
  await expect.poll(() => page.evaluate(() => window.PerfumerWorlds.noise().over), { timeout: 20000 }).toBeLessThan(0.1);
  // the page's grain flickers of itself
  const anim = await page.locator(".pw-grain").evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).toContain("pw-grain-flick");
  expect(errors).toEqual([]);
});

/* The search, as on the test page: a perfumer, a house or a perfume. */
test("the search takes you to a perfumer, a house, or a perfume's perfumer with its house lit", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(PAGE);
  await ready(page);
  const find = page.locator(".pw-find input");
  await find.click();
  await find.pressSequentially("haxan", { delay: 20 });
  await expect(page.locator(".pw-found button").first()).toContainText("Haxan");
  await find.press("Enter");
  await expect.poll(() => page.evaluate(() => window.PerfumerWorlds.now() && window.PerfumerWorlds.now().perfumer), { timeout: 5000 }).toBe("prin-lomros");
  await expect(page.locator(".pw-list-rows button.is-found")).toContainText("Parfum Prissana", { timeout: 4000 });
  await page.keyboard.press("Escape");
  await expect.poll(() => W(page, "view"), { timeout: 4000 }).toBe("rays");
  await find.click();
  await find.pressSequentially("lost tribe", { delay: 20 });
  await expect(page.locator(".pw-found button").first()).toContainText("House");
  await find.press("Enter");
  await expect.poll(() => W(page, "view"), { timeout: 5000 }).toBe("world");
  expect((await W(page, "now")).house).toBe("lost-tribe");
  expect(errors).toEqual([]);
});

/* Without the script, the page is its index and its sources, as the poster's
   was: every perfumer, their houses and their perfumes, written by
   tools/perfumers/build.py; held back while the drawing comes, and put away
   once it has. */
test("without the script the page is its index and sources; with it, they are put away", async ({ page, browser }) => {
  await page.goto(PAGE);
  await ready(page);
  await expect(page.locator(".pw-plain")).toBeHidden();
  const bare = await browser.newPage();
  await serveDependenciesLocally(bare);
  await bare.route(/perfumer-worlds\.js/, (r) => r.abort());
  await bare.goto(PAGE);
  await expect(bare.locator(".pw-plain")).toBeVisible();
  const n = await bare.evaluate(() => document.querySelectorAll(".pw-plain .pf-entry").length);
  expect(n).toBeGreaterThan(30);
  await expect(bare.locator(".pw-plain-sources li").first()).toBeVisible();
  await expect(bare.locator(".pw-plain a[href^='../houses/']").first()).toBeVisible();
  await bare.close();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("the strings, a world and the not-found list fit, and nothing scrolls sideways", async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const at of ["", "#prin-lomros", "#not-found"]) {
      await page.goto(PAGE + at);
      await page.waitForTimeout(1500);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), at + ": no sideways scroll").toBeLessThanOrEqual(390);
    }
    // the not-found list stands clear of its houses
    const list = await page.locator(".pw-nf").boundingBox(), houses = await page.locator(".pw-list").boundingBox();
    expect(list.y + list.height).toBeLessThan(houses.y);
    expect(errors).toEqual([]);
  });
});

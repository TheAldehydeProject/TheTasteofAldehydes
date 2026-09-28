// @ts-check
/* ============================================================
   THE TEST PAGE — works/test-page.html, drawn by network.js.

   The owner, 2026-09-26: "add a new page to the whole site, and make it
   completly blank. this will be a test page." It carried a network of red
   nodes, then five, then the Note Library as galaxies; and since the night
   of 2026-09-27 it is THE NOTE LIBRARY AS NETWORKS:

     "make it red regardless, screw the colouring ... less of galaxies and
     more true to their original form: like complex networks of nodes and
     connections ... more red and glowing. I want nothing to be selectable
     in the main galaxy before the expansion ... main nodes which are the
     notes (labeleld), and some other arbitraty spheres or nodes that lead
     to nothing and cannot be clicked ... keep that [centre], but truly
     make it a node ... not to be equidistant from the central galaxy ...
     a signal travelling to all the connections from the central node to
     the differnet netweorks when expanded ... slightly different than one
     another structurally ... quite dense in nodes and connections ...
     when you hover the accord on the right, it lights up in isolation.
     keep that ... keep the transition COLOURS from the expansion ... a
     little more chaotic ... create additiona nodes and connections for
     each of the clusters ... move the bar on the right hand side to the
     left. And make the search."

   And then (2026-09-28): "not have it refer to the note library but make
   it into another version of the note library. I want each of the nodes to
   have a window pop up that tells you about the note ... a little more ...
   blur the rest of the page ... add another arrow up above the one that
   pulls out the menu ... have it pull up te search bar ... i want the
   balls to shine more ... a less rigid transition between collapsing and
   expanding ... a short and brief but thematic animation to when you
   first load the page ... isntead of starting with the left window out, I
   want it to be hidden, and I want a temporary text to pop up (while the
   entire page is blurred) that point to that arrow, saying open menu
   here. whenever you stop controlling it for a while, i want the arrows on
   the left to start glowing".

   window.NetScene says where things stand on the window and what state it
   is in. The tests' machine draws in software, so the drawing's own clock
   runs slower than it would on a real screen: every wait here is on a
   state, with room to spare, never on a number of seconds.
   ============================================================ */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { serveDependenciesLocally, blockThreeJs, collectPageErrors } = require("./helpers");

const TEST_PAGE = "/works/test-page.html";
const LIBRARY = "/categories/note-library.html";

/** What the window shows, read back off a screenshot: how many pixels are
 *  the nodes' red, and the colour of the 9 × 9 block round a few points. */
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
    // Red: bright enough, and red far above green and blue — the deep rouge
    // the nodes are drawn in, glowing, as much as the button's.
    for (let i = 0; i < d.length; i += 16) if (d[i] > 120 && d[i] > 2.2 * d[i + 1] && d[i] > 1.6 * d[i + 2]) red++;
    const at = points.map(([x, y]) => {
      const m = [0, 0, 0];
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const k = ((Math.round(y) + dy) * c.width + (Math.round(x) + dx)) * 4;
        m[0] += d[k] / 81; m[1] += d[k + 1] / 81; m[2] += d[k + 2] / 81;
      }
      return m;
    });
    return { red, at };
  }, { shot, points });
}
const state = (page) => page.evaluate(() => window.NetScene.state());
async function open(page, size = { width: 1440, height: 900 }) {
  await page.setViewportSize(size);
  await page.goto(TEST_PAGE);
  await expect(page.locator(".net-stage")).toHaveClass(/is-drawn/, { timeout: 15000 });
}
/** Opened: the network wired in, and the word pointing at the menu put
 *  away by a press on empty ground (the one network answers nothing). */
async function settle(page) {
  await expect.poll(async () => (await state(page)).loaded, { timeout: 30000 }).toBe(true);
  await page.mouse.click(1420, 300);
  await expect.poll(async () => (await state(page)).coaching, { timeout: 5000 }).toBe(false);
  await page.waitForTimeout(600);
}
async function expandIt(page) {
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "apart", { timeout: 30000 });
}
/** Gone to an accord's network by the dropdown, and settled there. */
async function goTo(page, k, code) {
  await page.locator(".net-drop-button").click();
  await page.locator('.net-drop-option[data-to="' + k + '"]').click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", code, { timeout: 20000 });
  await expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
}
/** Rouge, not white: a note's colour once the signal has passed it — a
 *  deep red, the red far above the green and the blue (2026-09-28: "more
 *  red ike rouge ... A darker red"). */
const red = (c) => c[0] > 0.5 && c[0] < 0.8 && c[1] < 0.2 && c[2] < 0.25 && c[0] > 3 * c[1];

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* ONE RED NETWORK: every note in the Note Library a glowing red node among
   fillers of its own, all of it linked; the button to expand it at the
   foot, in the middle; the menu PUT AWAY, its arrow on the left under the
   search's; and nothing in it answers the hand. */
test("the Note Library is drawn as one red network, the menu put away, and nothing in it answers the hand", async ({ page, request }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  // Counted in the library's markup, leaving out its comments (which show
  // what a record looks like).
  const html = (await (await request.get(LIBRARY)).text()).replace(/<!--[\s\S]*?-->/g, "");
  const records = (html.match(/<article class="lib-record"/g) || []).length;
  const shelves = (html.match(/<section class="lib-shelf"/g) || []).length;
  await open(page);
  const stage = page.locator(".net-stage");
  expect(+(await stage.getAttribute("data-notes")), "every note in the library").toBe(records);
  expect(+(await stage.getAttribute("data-accords")), "every accord").toBe(shelves);
  expect(+(await stage.getAttribute("data-nodes")), "and fillers that stand for nothing, many more of them").toBeGreaterThan(records * 5);
  expect(+(await stage.getAttribute("data-links")), "all of it linked").toBeGreaterThan(+(await stage.getAttribute("data-nodes")) * 2);
  await expect(stage).toHaveAttribute("data-state", "one");
  await settle(page);
  const s = await state(page);
  expect(s.shown, "some fillers in it already, the rest made as it comes apart").toBeGreaterThan(records);
  expect(s.shown).toBeLessThan(s.nodes);
  // Red, on the page's own dark ground at its corners.
  const seen = await look(page, [[1420, 450], [1420, 880], [330, 880]]);
  expect(seen.red, "the nodes are red").toBeGreaterThan(1500);
  seen.at.forEach((px, n) => px.forEach((v) => expect(v, "point " + n + " is the dark ground").toBeLessThan(60)));
  const vanilla = await page.evaluate(() => window.NetScene.note("Vanilla"));
  expect(red(vanilla.colour), "a note is red").toBe(true);
  // NOTHING ANSWERS: pointed at, a note says nothing; pressed, nothing is
  // chosen and no window opens.
  expect(s.answering).toBe(false);
  await page.mouse.move(vanilla.x, vanilla.y);
  await page.waitForTimeout(300);
  await expect(page.locator(".net-hover")).not.toHaveClass(/is-on/);
  await page.mouse.click(vanilla.x, vanilla.y);
  await page.waitForTimeout(300);
  await expect(stage).not.toHaveAttribute("data-selected", /./);
  await expect(page.locator(".net-note")).toBeHidden();
  // THE MENU PUT AWAY, and its arrow on the left — the search's arrow above
  // it, where the menu's used to be.
  expect(s.panel, "the menu starts put away").toBe(false);
  await expect(page.locator(".net-panel")).toBeHidden();
  const searchArrow = await page.locator('.net-arrow[data-pull="search"]').boundingBox();
  const menuArrow = await page.locator('.net-arrow[data-pull="menu"]').boundingBox();
  expect(searchArrow.x, "on the left").toBeLessThan(40);
  expect(Math.abs(menuArrow.x - searchArrow.x), "one above the other").toBeLessThan(2);
  expect(menuArrow.y, "the search's on top").toBeGreaterThan(searchArrow.y + searchArrow.height);
  // The button that expands it: at the foot, in the middle.
  const button = await page.locator(".net-expand").boundingBox();
  expect(button.y + button.height, "at the foot").toBeGreaterThan(900 - 50);
  expect(Math.abs(button.x + button.width / 2 - 720), "in the middle").toBeLessThan(40);
  await expect(page.locator(".net-expand")).toHaveText(/Expand the library/i);
  // Before it has come apart there is no dropdown to be had.
  await expect(page.locator(".net-nav")).toHaveCSS("opacity", "0");
  // Nothing written on it but its chrome; the one <h1> is read, not drawn.
  const title = await page.locator("h1.visually-hidden").evaluate((h) => { const r = h.getBoundingClientRect(); return { w: r.width, h: r.height, text: h.textContent }; });
  expect(title.text).toContain("Test page");
  expect(title.w * title.h, "and it is not drawn").toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

/* AS IT OPENS: the network WIRES ITSELF from a spark at the centre
   outwards, and only then does the chrome come in — and then the page goes
   out of focus but for the two arrows, and a line points at the menu's:
   "Open menu here", until the hand does anything (or a few seconds). */
test("as it opens it wires itself in, and then points at the menu's arrow over the page out of focus", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await open(page);
  const stage = page.locator(".net-stage");
  expect((await state(page)).loaded, "wiring itself in, first").toBe(false);
  await expect(page.locator(".net-rail"), "the chrome not in yet").toHaveCSS("opacity", "0");
  await expect.poll(async () => (await state(page)).loaded, { timeout: 30000 }).toBe(true);
  await expect(stage).toHaveClass(/is-loaded/);
  await expect(page.locator(".net-rail")).toHaveCSS("opacity", "1");
  // THE WORD: the page out of focus, the arrows not, the line at the menu's.
  expect((await state(page)).coaching).toBe(true);
  const coach = page.locator(".net-coach");
  await expect(coach).toBeVisible();
  await expect(coach).toContainText("Open menu here");
  expect(await coach.evaluate((c) => getComputedStyle(c).backdropFilter || getComputedStyle(c).webkitBackdropFilter), "out of focus").toContain("blur");
  const z = await page.evaluate(() => [".net-coach", ".net-rail", ".net-dock"].map((c) => +getComputedStyle(document.querySelector(c)).zIndex));
  expect(z[1], "the arrows over it").toBeGreaterThan(z[0]);
  expect(z[2], "and the rest under it").toBeLessThan(z[0]);
  const say = await page.locator(".net-coach-say").boundingBox();
  const arrow = await page.locator('.net-arrow[data-pull="menu"]').boundingBox();
  expect(Math.abs(say.y + say.height / 2 - (arrow.y + arrow.height / 2)), "level with the menu's arrow").toBeLessThan(6);
  expect(say.x, "beside it").toBeGreaterThan(arrow.x + arrow.width - 2);
  // It asks nothing of the hand: the press goes through, and puts it away.
  await page.locator('.net-arrow[data-pull="menu"]').click();
  await expect.poll(async () => (await state(page)).coaching).toBe(false);
  await expect(coach).toBeHidden();
  expect((await state(page)).panel, "and the press opened the menu").toBe(true);
  expect(errors).toEqual([]);
});

/* LEFT ALONE, the arrows glow — and the line at the top right saying what
   can be done comes back — until the hand moves again. */
test("left alone a while, the arrows on the left glow, and the line saying what can be done comes back", async ({ page }) => {
  test.setTimeout(90000);
  await open(page);
  await settle(page);
  const stage = page.locator(".net-stage");
  await page.mouse.move(600, 300);
  await page.mouse.down();
  await page.mouse.move(640, 300, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator(".net-hint"), "gone once it has been turned").toHaveCSS("opacity", "0");
  expect((await state(page)).idle).toBe(false);
  await page.evaluate(() => window.NetScene.leave(20000));
  await expect.poll(async () => (await state(page)).idle, { timeout: 5000 }).toBe(true);
  await expect(stage).toHaveClass(/is-idle/);
  const glow = await page.locator(".net-arrow").evaluateAll((els) => els.map((e) => getComputedStyle(e, "::after").animationName));
  expect(glow, "both arrows glowing").toEqual(["net-glow", "net-glow"]);
  await expect(page.locator(".net-hint"), "and the line back").toHaveCSS("opacity", "1");
  await page.mouse.move(700, 350);
  await expect.poll(async () => (await state(page)).idle).toBe(false);
  await expect(stage).not.toHaveClass(/is-idle/);
});

/* EVERY NOTE IS THE LIBRARY'S OWN: read off the Note Library's page, with
   the number, the symbol and the count of fragrances that page gives it. */
test("every note is the Note Library's own, with its number, symbol and uses", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto(LIBRARY);
  await expect(page.locator("body")).toHaveClass(/lib-built/);
  const library = await page.$$eval(".lib-shelf:not(.lib-returns) .lib-record", (els) => els.map((el) => ({
    id: el.id, no: +el.dataset.no, sym: el.dataset.sym, uses: +el.dataset.uses,
    code: el.closest(".lib-shelf").dataset.shelf, name: el.querySelector(".lib-name").textContent.trim(),
  })));
  await open(page);
  const here = await page.evaluate(() => window.NetScene.notes());
  expect(here.length).toBe(library.length);
  const byId = new Map(here.map((n) => [n.id, n]));
  library.forEach((r) => {
    const n = byId.get(r.id);
    expect(n, r.name).toBeTruthy();
    expect(n.name, r.id).toBe(r.name);
    expect(n.no, r.name + "'s number").toBe(r.no);
    expect(n.sym, r.name + "'s symbol").toBe(r.sym);
    expect(n.uses, r.name + "'s fragrances").toBe(r.uses);
    expect(n.code, r.name + "'s accord").toBe(r.code);
  });
});

/* Where each house's fragrances live, which the note window links to, is
   the Note Library's own table, copied into network.js: kept the same. */
test("the page's copy of where each house's fragrances live is the library's", () => {
  const read = (file) => {
    const text = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    const m = text.match(/const HOUSES = \{([\s\S]*?)\};/);
    return m && m[1].replace(/\s+/g, " ").trim();
  };
  expect(read("network.js")).toBeTruthy();
  expect(read("network.js")).toBe(read("note-library.js"));
});

/* THE TWO ARROWS: the upper pulls out THE SEARCH BAR — the library's own
   `query>`, by its own rule — and the lower THE MENU: a ring of specks and
   the accords, each lighting up alone under the hand, and chosen by a
   press. */
test("the arrows on the left pull out the search bar and the menu, whose accords light up alone under the hand", async ({ page }) => {
  test.setTimeout(180000);
  const errors = collectPageErrors(page);
  // What the library's own search finds for "cedar".
  await page.goto(LIBRARY);
  await page.locator(".lib-query").fill("cedar");
  const found = (await page.$$eval(".lib-record.is-hit .lib-name", (els) => els.map((e) => e.textContent.trim()))).sort();
  expect(found.length).toBeGreaterThan(1);

  await open(page);
  await settle(page);
  const stage = page.locator(".net-stage");
  const N = +(await stage.getAttribute("data-notes"));
  const searchArrow = page.locator('.net-arrow[data-pull="search"]');
  const menuArrow = page.locator('.net-arrow[data-pull="menu"]');

  // THE SEARCH BAR, beside its arrow.
  const bar = page.locator(".net-find");
  await expect(bar, "not there until it is pulled out").toBeHidden();
  await expect(searchArrow).toHaveAttribute("aria-expanded", "false");
  await searchArrow.click();
  await expect(searchArrow).toHaveAttribute("aria-expanded", "true");
  await expect(bar).toBeVisible();
  await expect(bar.locator(".net-find-prompt")).toHaveText("query>");
  const a = await searchArrow.boundingBox(), b = await bar.boundingBox();
  expect(b.x, "beside its arrow").toBeGreaterThan(a.x + a.width);
  expect(Math.abs(b.y - a.y), "level with it").toBeLessThan(3);
  await expect(page.locator(".net-query")).toBeFocused();
  await page.keyboard.type("cedar");
  expect((await state(page)).hits.slice().sort(), "the library's own answers").toEqual(found);
  await expect(page.locator(".net-result")).toHaveCount(found.length);
  await expect(page.locator(".net-count")).toHaveText(found.length + " / " + N);
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - found.length);
  expect((await state(page)).faintest, "the rest translucent").toBeLessThan(0.2);
  // Its × empties it; Escape empties it, and then puts it away.
  await page.locator(".net-clear").click();
  expect((await state(page)).query).toBe("");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
  await page.keyboard.type("cedar");
  await page.keyboard.press("Escape");
  expect((await state(page)).query).toBe("");
  await page.keyboard.press("Escape");
  await expect(bar).toBeHidden();
  expect((await state(page)).search).toBe(false);

  // THE MENU, beside its arrow, with its ring of specks.
  const panel = page.locator(".net-panel");
  await expect(panel).toBeHidden();
  await menuArrow.click();
  await expect(panel).toBeVisible();
  await expect(menuArrow).toHaveAttribute("aria-expanded", "true");
  const m = await menuArrow.boundingBox(), box = await panel.boundingBox();
  expect(box.x, "beside its arrow").toBeGreaterThan(m.x + m.width);
  expect(Math.abs(box.y - m.y), "from its arrow down").toBeLessThan(3);
  const inked = await page.locator(".net-mark").evaluate((c) => {
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  });
  expect(inked, "the ring of specks").toBeGreaterThan(300);
  // UNDER THE HAND an accord lights up alone, and only while it is there.
  const accords = page.locator(".net-accord");
  expect(await accords.count(), "every accord, and all of them").toBe(17);
  const woods = page.locator('.net-accord[data-code="WOO"]');
  const count = +(await woods.locator(".net-accord-count").textContent());
  await woods.hover();
  expect((await state(page)).previewing).toBe("WOO");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - count);
  expect((await page.evaluate(() => window.NetScene.note("Cedarwood"))).opacity, "a wood whole").toBe(1);
  await page.mouse.move(900, 450);
  expect((await state(page)).previewing).toBe("");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
  // Pressed, it stays lit; all of them back again.
  await woods.click();
  await expect(woods).toHaveAttribute("aria-pressed", "true");
  await page.mouse.move(900, 450);
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - count);
  await page.locator('.net-accord[data-code=""]').click();
  await page.mouse.move(900, 450);
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
  // Put away by its arrow again, and the drawing has the room back.
  await menuArrow.click();
  await expect(panel).toBeHidden();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.elementFromPoint(200, 500).className), "the drawing where it stood").toContain("net-canvas");
  expect(errors).toEqual([]);
});

/* EXPANDING: every node turns WHITE, with links between them that CHANGE
   as they move; each sets off on a path of its own; more nodes are MADE
   for every accord on the way, with links of their own; and each accord
   comes to stand as a network of its own — red again, dense, built its
   own way, at a distance of its own — with a true node at its middle, and
   the centre joined to them all. */
test("expanding: through white, with changing links and nodes made on the way, into a dense red network for each accord", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await open(page);
  const stage = page.locator(".net-stage");
  const before = await page.evaluate(() => window.NetScene.accords().map((A) => [A.code, window.NetScene.network(A.code).spread]));
  before.forEach(([code, spread]) => expect(spread, code + " starts in the one network").toBeGreaterThan(6));
  const shownBefore = (await state(page)).shown;
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-expand")).toHaveAttribute("aria-expanded", "true");
  // WHITE, WITH CHANGING LINKS, on the way.
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(0.3);
  const mid1 = await page.evaluate(() => ({ s: window.NetScene.state(), v: window.NetScene.note("Vanilla") }));
  expect(mid1.s.u, "still on its way").toBeLessThan(0.6);
  mid1.v.colour.forEach((c) => expect(c, "white").toBeGreaterThan(0.85));
  expect(mid1.s.changing, "linked, while white").toBeGreaterThan(80);
  expect(mid1.s.answering, "and nothing answers on the way").toBe(false);
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(mid1.s.u + 0.1);
  const mid2 = await page.evaluate(() => ({ s: window.NetScene.state(), v: window.NetScene.note("Vanilla") }));
  expect(mid2.s.changing, "and the links change as they go").not.toBe(mid1.s.changing);
  expect(mid2.v.x !== mid1.v.x || mid2.v.y !== mid1.v.y, "moving").toBe(true);
  // MADE ON THE WAY: more nodes than the one network had, linked.
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(0.66);
  const mid3 = await state(page);
  expect(mid3.shown, "nodes made on the way").toBeGreaterThan(shownBefore + 500);
  expect(mid3.segments, "and their links").toBeGreaterThan(mid3.changing + 500);
  // APART: RED AGAIN, every node there.
  await expect(stage).toHaveAttribute("data-state", "apart", { timeout: 30000 });
  const s = await state(page);
  expect(s.shown, "every node").toBe(s.nodes);
  expect(s.answering).toBe(true);
  for (const name of ["Vanilla", "Cedarwood", "Bergamot", "Rose"]) {
    await expect.poll(async () => red((await page.evaluate((n) => window.NetScene.note(n), name)).colour), { timeout: 10000, message: name + " red again" }).toBe(true);
  }
  const accords = await page.evaluate(() => window.NetScene.accords());
  const after = await page.evaluate(() => window.NetScene.accords().map((A) => window.NetScene.network(A.code)));
  after.forEach((g, k) => expect(g.spread, accords[k].code + " in its own network").toBeLessThan(0.01));
  // DENSE, each built its own way, each at a distance of its own.
  accords.forEach((A) => {
    expect(A.members, A.code + ": dense in nodes").toBeGreaterThan(Math.max(100, A.count * 4));
    expect(A.links, A.code + ": and in links").toBeGreaterThan(A.members * 1.8);
    expect(A.middle, A.code + ": a node at its middle").toBe(true);
  });
  expect(new Set(accords.map((A) => A.type)).size, "built differently").toBeGreaterThanOrEqual(5);
  const reaches = accords.map((A) => A.reach);
  expect(Math.max(...reaches) - Math.min(...reaches), "not all the same way from the centre").toBeGreaterThan(5);
  // No two networks' reaches meet (in three dimensions — on the window,
  // one may stand behind another).
  for (let a = 0; a < after.length; a++) for (let b = a + 1; b < after.length; b++) {
    const d = Math.hypot(...after[a].at.map((v, k) => v - after[b].at[k]));
    expect(d, accords[a].code + " and " + accords[b].code + " apart").toBeGreaterThan((after[a].R + after[b].R) * 1.4);
  }
  // The centre: bright where it stands.
  const c = await page.evaluate(() => window.NetScene.centre());
  const seen = await look(page, [[c.x, c.y]]);
  expect(Math.min(...seen.at[0]), "the centre, white").toBeGreaterThan(120);
  // The dropdown, now, and the names beside the networks.
  await expect(page.locator(".net-nav")).toHaveCSS("opacity", "1");
  await expect(page.locator(".net-drop-option")).toHaveCount(accords.length + 1);
  await expect(page.locator(".net-expand")).toHaveText(/Collapse into one/i);
  expect(await page.locator(".net-name.is-on").count(), "most of the networks named").toBeGreaterThan(8);
  expect(errors).toEqual([]);
});

/* THE SIGNAL: out from the centre along every bridge, over and over, and
   on through each network from its middle node, link by link. */
test("a signal goes out from the centre to every network, and through it", async ({ page }) => {
  test.setTimeout(120000);
  await open(page);
  await expandIt(page);
  let most = 0;
  for (let k = 0; k < 200 && most < 40; k++) {
    most = Math.max(most, (await state(page)).litNodes);
    await page.waitForTimeout(30);
  }
  expect(most, "nodes lit as it passes").toBeGreaterThan(40);
  // And it passes: lit, then not.
  await expect.poll(async () => (await state(page)).litNodes, { timeout: 20000 }).toBeLessThan(most / 4);
});

/* ONCE APART: a note answers — named at its network, pointed at it says its
   name, and pressed it opens ITS WINDOW: the page behind out of focus, and
   in the window what the Note Library says of it and a little more, with
   nothing sending you to the library — and a filler never does. */
test("once apart, a note pressed opens its own window over the page out of focus; a filler never answers", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  // What the Note Library's own card says of Vanilla: its other spellings,
  // and every fragrance naming it.
  await page.goto(LIBRARY);
  await expect(page.locator("body")).toHaveClass(/lib-built/);
  const aka = ((await page.locator("#note-vanilla").getAttribute("data-aka")) || "").split("|").map((x) => x.trim()).filter(Boolean);
  await page.locator("#note-vanilla").click();
  await expect(page.locator(".lib-card")).toBeVisible();
  const keys = (await page.locator(".lib-card-list a[data-key]").evaluateAll((as) => as.map((a) => a.dataset.key))).sort();
  expect(keys.length).toBeGreaterThan(5);

  await open(page);
  await expandIt(page);
  const stage = page.locator(".net-stage");
  await goTo(page, 6, "GOU");
  // Every note of the network you are at named beside its node.
  await expect.poll(async () => page.locator(".net-label").evaluateAll((els) => els.filter((e) => +getComputedStyle(e).opacity > 0.5).length), { timeout: 10000 }).toBeGreaterThan(15);
  const N = +(await stage.getAttribute("data-notes"));
  const about = (await page.evaluate(() => window.NetScene.notes())).find((n) => n.name === "Vanilla");
  const more = await page.evaluate(() => window.NetScene.about("Vanilla"));
  let at = await page.evaluate(() => window.NetScene.note("Vanilla"));
  await page.mouse.move(at.x, at.y);
  await expect(page.locator(".net-hover"), "pointed at, it says its name").toHaveClass(/is-on/);
  await expect(page.locator(".net-hover")).toContainText("Vanilla");
  at = await page.evaluate(() => window.NetScene.note("Vanilla"));
  await page.mouse.click(at.x, at.y);
  await expect(stage).toHaveAttribute("data-selected", "Vanilla");
  expect((await state(page)).note).toBe("Vanilla");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - 1);
  // THE REST OF THE PAGE OUT OF FOCUS, the window over it, translucent.
  const veil = page.locator(".net-veil");
  const win = page.locator(".net-note");
  await expect(veil).toBeVisible();
  await expect(win).toBeVisible();
  await expect(win).toHaveAttribute("role", "dialog");
  expect(await veil.evaluate((v) => getComputedStyle(v).backdropFilter || getComputedStyle(v).webkitBackdropFilter), "the page out of focus").toContain("blur");
  const ground = await win.evaluate((w) => getComputedStyle(w).backgroundColor);
  expect(+ground.match(/[\d.]+(?=\)$)/)[0], "the window translucent").toBeLessThan(0.9);
  const z = await page.evaluate(() => [".net-veil", ".net-rail", ".net-dock", ".net-panel"].map((c) => +getComputedStyle(document.querySelector(c)).zIndex));
  z.slice(1).forEach((v) => expect(v, "everything else under the veil").toBeLessThan(z[0]));
  // WHAT THE LIBRARY SAYS OF IT.
  await expect(win.locator(".net-note-name")).toHaveText("Vanilla");
  await expect(win.locator(".net-note-name")).toBeFocused();
  await expect(win.locator(".net-note-sym")).toHaveText(about.sym);
  await expect(win.locator(".net-note-no")).toHaveText(String(about.no));
  await expect(win.locator(".net-note-uses")).toHaveText(String(about.uses));
  await expect(win.locator(".net-note-call")).toHaveText(/^GOU \d{3}$/);
  await expect(win.locator(".net-note-accord")).toContainText("Gourmand");
  await expect(win.locator(".net-note-say")).not.toBeEmpty();
  expect((await win.locator(".net-note-aka li").allTextContents()).map((x) => x.trim()), "its other spellings, the library's").toEqual(aka);
  const here = (await win.locator(".net-note-found a[data-key]").evaluateAll((as) => as.map((a) => a.dataset.key))).sort();
  expect(here, "every fragrance naming it, the library's").toEqual(keys);
  expect(more.keys, "and the page's own count agrees").toEqual(keys);
  await expect(win.locator(".net-note-found h3")).toHaveText("Compounds · " + String(keys.length).padStart(2, "0"));
  // A LITTLE MORE: its rank, how many of the site's fragrances, where in
  // them it stands, and what it is most often found with.
  await expect(win.locator(".net-note-facts")).toContainText(about.uses + " of the site's " + more.fragrances);
  await expect(win.locator(".net-note-facts")).toContainText(/\d+(st|nd|rd|th) of \d+ · \d+(st|nd|rd|th) of \d+ in Gourmand/);
  const tiers = { top: "Top", mid: "Heart", base: "Base", flat: "Undivided" };
  for (const [t, word] of Object.entries(tiers)) {
    if (more.tally[t]) await expect(win.locator(".net-note-tier-say")).toContainText(word + " " + more.tally[t]);
  }
  const chips = win.locator(".net-note-chip");
  expect(await chips.count(), "the notes it is most often with").toBeGreaterThan(3);
  // NOTHING SENDS YOU TO THE LIBRARY.
  expect(await win.locator('a[href*="note-library"]').count(), "no way out to the library").toBe(0);
  // Its fragrances are ways to them.
  const hrefs = await win.locator(".net-note-found a[data-key]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  hrefs.forEach((h) => expect(h).toMatch(/^\.\.\/(houses\/[a-z-]+|individual-fragrances\/individual-fragrances)\.html#part-\d\d$/));
  // The arrows go through its accord; a chip goes to that note.
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await state(page)).note).not.toBe("Vanilla");
  const next = (await state(page)).note;
  expect((await page.evaluate(() => window.NetScene.notes())).find((n) => n.name === next).code, "the next in its accord").toBe("GOU");
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await state(page)).note).toBe("Vanilla");
  const chipName = (await chips.first().locator(".net-note-chip-name").textContent()).trim();
  await chips.first().click();
  await expect.poll(async () => (await state(page)).note, { timeout: 20000 }).toBe(chipName);
  // Escape puts it away, and the page comes back into focus.
  await page.keyboard.press("Escape");
  await expect(stage).toHaveAttribute("data-selected", "");
  await expect(win).toBeHidden();
  await expect(veil).toBeHidden();
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
  // So does a press on the page round it.
  await expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
  const again = (await page.evaluate(() => window.NetScene.notes())).find((n) => n.code === "GOU" && n.uses > 2);
  await goTo(page, 6, "GOU");
  at = await page.evaluate((name) => window.NetScene.note(name), again.name);
  await page.mouse.click(at.x, at.y);
  await expect(win).toBeVisible();
  await page.mouse.click(40, 500);
  await expect(win).toBeHidden();
  // A FILLER: pointed at, it says nothing; pressed, nothing is chosen and
  // nothing moves.
  const filler = await page.evaluate(() => window.NetScene.filler("GOU"));
  expect(filler, "a filler clear of the notes").not.toBeNull();
  await page.mouse.move(filler.x, filler.y);
  await page.waitForTimeout(300);
  await expect(page.locator(".net-hover")).not.toHaveClass(/is-on/);
  await page.mouse.click(filler.x, filler.y);
  await page.waitForTimeout(300);
  await expect(stage).toHaveAttribute("data-selected", "");
  await expect(stage).toHaveAttribute("data-focus", "GOU");
  await expect(win).toBeHidden();
  expect(errors).toEqual([]);
});

/* THE WAY BETWEEN THEM: the dropdown, the arrows either side of it, the
   keyboard, a bridge, a network's name — every journey from one network to
   another bending in towards the centre — and back to the centre. */
test("the centre joins every network, and going from one accord to another is easy", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await open(page);
  await expandIt(page);
  const stage = page.locator(".net-stage");
  const at = (code) => expect(stage).toHaveAttribute("data-focus", code, { timeout: 20000 });
  const settled = () => expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
  const reach = Object.fromEntries((await page.evaluate(() => window.NetScene.accords())).map((A) => [A.code, A.reach]));
  // The dropdown.
  await page.locator(".net-drop-button").click();
  await expect(page.locator(".net-dock")).toHaveClass(/is-open/);
  await page.locator('.net-drop-option[data-to="6"]').click();
  await at("GOU");
  await expect(page.locator(".net-drop-say")).toHaveText("07 · Gourmand");
  await expect(page.locator('.net-accord[data-code="GOU"]'), "the window says where you are").toHaveClass(/is-here/);
  await settled();
  // The arrow after it — and the way there bends in towards the centre.
  // (Asked of the journey itself, since this machine may draw too few
  // frames to be seen passing it.)
  await page.locator('.net-step[data-step="1"]').click();
  const bend = await page.evaluate(() => window.NetScene.bend());
  expect(bend, "a journey under way").not.toBeNull();
  expect(bend, "by way of the centre").toBeLessThan(0.55 * Math.max(reach.GOU, reach.BRW));
  await at("BRW");
  // The arrow before it, and the keyboard's.
  await page.locator('.net-step[data-step="-1"]').click();
  await at("GOU");
  await settled();
  await page.locator(".net-canvas").focus().catch(() => {});
  await page.keyboard.press("ArrowRight");
  await at("BRW");
  await settled();
  await page.keyboard.press("Home");
  await at("centre");
  await settled();
  // A bridge from the centre: pointed at it says where it goes; pressed, it
  // goes there.
  const B = await page.evaluate(() => window.NetScene.bridge("SPI"));
  let found = null;
  for (const u of [0.5, 0.4, 0.6, 0.3, 0.7]) {
    const x = B.a.x + (B.b.x - B.a.x) * u, y = B.a.y + (B.b.y - B.a.y) * u;
    await page.mouse.move(x, y);
    await page.waitForTimeout(80);
    if ((await stage.getAttribute("data-over-bridge")) === "SPI") { found = { x, y }; break; }
  }
  expect(found, "the bridge found on the window").not.toBeNull();
  await expect(page.locator(".net-bridge")).toContainText("Spice");
  await page.mouse.click(found.x, found.y);
  await at("SPI");
  await settled();
  // Back to the centre from the dropdown, and to a network by its name.
  await page.locator(".net-drop-button").click();
  await page.locator('.net-drop-option[data-to="-1"]').click();
  await at("centre");
  await settled();
  const name = page.locator(".net-name.is-on").first();
  const code = await name.getAttribute("data-code");
  await name.click();
  await at(code);
  // An accord pressed in the menu goes there too.
  await page.locator('.net-arrow[data-pull="menu"]').click();
  await page.locator('.net-accord[data-code="CIT"]').click();
  await at("CIT");
  expect(errors).toEqual([]);
});

/* COLLAPSING: back through white into the one red network, the nodes made
   on the way gone again, and the dropdown goes. */
test("collapsing brings every note back into the one red network", async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await open(page);
  const shownBefore = (await state(page)).shown;
  await expandIt(page);
  await goTo(page, 3, "FLO");
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "one", { timeout: 30000 });
  const s = await state(page);
  expect(s.focus, "back at the centre").toBe("centre");
  expect(s.shown, "the made nodes gone again").toBe(shownBefore);
  expect(s.answering).toBe(false);
  const v = await page.evaluate(() => window.NetScene.note("Vanilla"));
  expect(red(v.colour), "red again").toBe(true);
  const spreads = await page.evaluate(() => window.NetScene.accords().map((A) => window.NetScene.network(A.code).spread));
  spreads.forEach((d) => expect(d, "every accord back in the one network").toBeGreaterThan(6));
  await expect(page.locator(".net-nav")).toHaveCSS("opacity", "0");
  await expect(page.locator(".net-expand")).toHaveText(/Expand the library/i);
  expect(errors).toEqual([]);
});

/* FREELY WITH ROTATION: a drag turns it round and tips it nearly straight
   up or down; the wheel brings it closer; the hint goes. */
test("a drag turns it freely, any way", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await open(page);
  const stage = page.locator(".net-stage");
  const a = await state(page);
  await page.mouse.move(500, 450);
  await page.mouse.down();
  await page.mouse.move(800, 450, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const b = await state(page);
  expect(Math.abs(b.yaw - a.yaw), "turned round").toBeGreaterThan(1.2);
  await expect(stage, "and the hint goes").toHaveClass(/is-turned/);
  await page.mouse.move(700, 200);
  await page.mouse.down();
  await page.mouse.move(700, 700, { steps: 16 });
  await page.mouse.up();
  await page.waitForTimeout(600);
  expect((await state(page)).pitch, "tipped nearly straight over").toBeGreaterThan(1.3);
  expect(errors).toEqual([]);
});

/* SIXTY FRAMES A SECOND: every frame's own work — the drawing's and the
   page's — through the expansion, a journey and the collapse, is a part of
   the sixtieth of a second a frame has. (What this machine's software
   drawing then takes is not the page's, and a graphics card does it in a
   moment.) */
test("every frame of every transition is quick enough for sixty a second", async ({ page }) => {
  test.setTimeout(150000);
  await open(page);
  await page.evaluate(() => window.NetScene.reset());
  await expandIt(page);
  await goTo(page, 8, "WOO");
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", "BRW", { timeout: 20000 });
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "one", { timeout: 30000 });
  const s = await page.evaluate(() => window.NetScene.stats());
  // A frame has 16.7ms at sixty a second. The page's own work — here on a
  // machine drawing in software and running other tests beside it — is a
  // part of that on average, and very nearly always inside it.
  expect(s.frames, "frames drawn").toBeGreaterThan(60);
  expect(s.mean, "a frame's own work, on average, in ms").toBeLessThan(7);
  expect(s.p95, "nearly every frame's").toBeLessThan(16.7);
  expect(s.max, "and no stall — a drawing made for the first time mid-way, say").toBeLessThan(40);
});

test("without its 3D library the page says so", async ({ page }) => {
  await page.unrouteAll();
  const errors = collectPageErrors(page, ["ERR_FAILED", "Failed to load resource"]);
  await blockThreeJs(page);
  await page.goto(TEST_PAGE);
  await expect(page.locator(".net-fallback")).toBeVisible();
  await expect(page.locator(".net-hint")).toHaveCSS("opacity", "0");
  expect(errors).toEqual([]);
});

test("without the Note Library's page it says so, and points at the library", async ({ page }) => {
  const errors = collectPageErrors(page, ["ERR_FAILED", "Failed to load resource"]);
  await page.route("**/categories/note-library.html", (route) => route.abort());
  await page.goto(TEST_PAGE);
  const say = page.locator(".net-fallback");
  await expect(say).toBeVisible();
  await expect(say).toContainText("could not be read");
  await expect(say.locator("a")).toHaveAttribute("href", "../categories/note-library.html");
  expect(errors).toEqual([]);
});

test.describe("the test page with animation turned off", () => {
  test("it stands still, comes apart and travels at once, sends no signal, and still turns by hand", async ({ page }) => {
    test.setTimeout(90000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = collectPageErrors(page);
    await open(page, { width: 1280, height: 800 });
    const stage = page.locator(".net-stage");
    await page.waitForTimeout(400);
    const p1 = await page.evaluate(() => window.NetScene.note("Vanilla"));
    await page.waitForTimeout(1500);
    const p2 = await page.evaluate(() => window.NetScene.note("Vanilla"));
    expect([p2.x, p2.y], "never turning on its own").toEqual([p1.x, p1.y]);
    await page.locator(".net-expand").click();
    await expect(stage, "apart at once").toHaveAttribute("data-state", "apart", { timeout: 1000 });
    await page.waitForTimeout(800);
    expect((await state(page)).litNodes, "no signal").toBe(0);
    await page.locator(".net-drop-button").click();
    await page.locator('.net-drop-option[data-to="3"]').click();
    await expect(stage, "there at once").toHaveAttribute("data-focus", "FLO", { timeout: 1000 });
    expect((await state(page)).flying).toBe(false);
    const a = (await state(page)).yaw;
    await page.mouse.move(700, 400);
    await page.mouse.down();
    await page.mouse.move(860, 420, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    expect(Math.abs((await state(page)).yaw - a), "but a drag still turns it").toBeGreaterThan(0.6);
    expect(errors).toEqual([]);
  });
});

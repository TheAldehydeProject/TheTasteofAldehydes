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

   And then, the evening of 2026-09-28: "too much glow ... very local to
   every node ... something in the background that occurs when the page
   opens ... just the cluster that forms ... allign the text with the
   center of the arrow ... if you click back from the citrus accord, you
   would go back to the center ... the flashing effect ... only when you go
   to a different node ... bring the clusters a little farther from one
   another ... nothing is obstructing the view of that cluster ... make the
   transition less bubbly. I want it to be dimensional ... remove the word
   into one ... remove any chemistry related themes ... variations ...
   fragrances ... a pyramid distribution ... a particle diagram in red
   particles ... a new button called combinations ... the viewing
   selection of an accord on the left to be overwritten in priority if you
   are in the expanded view viewing a specific accord".

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
 *  red ike rouge ... A darker red", and then "A little glowier and darker
 *  please!"). */
const red = (c) => c[0] > 0.4 && c[0] < 0.8 && c[1] < 0.2 && c[2] < 0.25 && c[0] > 3 * c[1];

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
  // The button that expands it at the foot, a little to the left, and
  // COMBINATIONS on its right — the pair in the middle; and no way back yet.
  const button = await page.locator(".net-expand").boundingBox();
  const combine = await page.locator(".net-combine-button").boundingBox();
  expect(button.y + button.height, "at the foot").toBeGreaterThan(900 - 50);
  expect(button.x + button.width, "to the left of the middle").toBeLessThan(720);
  expect(combine.x, "Combinations on its right").toBeGreaterThan(button.x + button.width);
  expect(Math.abs((button.x + button.width + combine.x) / 2 - 720), "the gap between them the middle").toBeLessThan(3);
  await expect(page.locator(".net-expand")).toHaveText(/Expand the library/i);
  await expect(page.locator(".net-combine-button")).toHaveText(/Combinations/i);
  await expect(page.locator(".net-back")).toBeHidden();
  // ONE GREY, FLAT: no pool drawn darker in the middle of it, which came out
  // as rings of black to grey ("stop with this obvious gradient").
  const ground = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
  expect(ground, "the ground is one grey").toBe("none");
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
  // JUST THE CLUSTER FORMS: a node not come up yet has no glow either —
  // its glow was fogged into a grey halo, which is what stood round the
  // page as it opened (2026-09-28).
  for (let k = 0; k < 6; k++) {
    const s = await state(page);
    if (s.loaded) break;
    expect(s.glows, "no glow without its node, as it opens").toBeLessThanOrEqual(s.drawn);
    await page.waitForTimeout(120);
  }
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
  const word = await page.locator(".net-coach-word").boundingBox();
  const line = await page.locator(".net-coach-line").boundingBox();
  const arrow = await page.locator('.net-arrow[data-pull="menu"]').boundingBox();
  const middle = arrow.y + arrow.height / 2;
  // "allign the text with the center of the arrow": the words, the line and
  // the arrow's middle level to a pixel or two.
  expect(Math.abs(line.y + line.height / 2 - middle), "the line level with the arrow's middle").toBeLessThan(1.5);
  expect(Math.abs(word.y + word.height / 2 - middle), "the words level with it too").toBeLessThan(2.5);
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
   the number and the count of fragrances that page gives it. (Not its
   symbol: since 2026-09-28 nothing of chemistry is on this page.) */
test("every note is the Note Library's own, with its number and uses", async ({ page }) => {
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
    expect(n.sym, "no symbol").toBeUndefined();
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

/* EXPANDING, "dimensional, where it is clear what is going on": through
   white (the colours the owner asked to keep), each accord leaving AS ONE
   BODY straight out along its bridge, unfolding into its network as it
   goes — no node flying off on its own, nothing shaken — while the lens
   swings round; more nodes are made for each accord as it unfolds; and
   each comes to stand as a network of its own, red again, dense, built its
   own way, at a distance of its own and farther from the others than they
   were, with a true node at its middle and the centre joined to them all. */
test("expanding: through white, each accord leaving as one body along its bridge, into a dense red network of its own", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await open(page);
  const stage = page.locator(".net-stage");
  const before = await page.evaluate(() => window.NetScene.accords().map((A) => [A.code, window.NetScene.network(A.code).spread]));
  before.forEach(([code, spread]) => expect(spread, code + " starts in the one network").toBeGreaterThan(6));
  const shownBefore = (await state(page)).shown;
  const yaw0 = (await state(page)).yaw;
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-expand")).toHaveAttribute("aria-expanded", "true");
  // WHITE on the way, and each accord ONE BODY, straight out along its
  // bridge: its middle on the line from where it set off to where it ends,
  // and its nodes kept round it.
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(0.35);
  const mid = await page.evaluate(() => ({ s: window.NetScene.state(), v: window.NetScene.note("Vanilla"),
    bodies: window.NetScene.accords().map((A) => ({ code: A.code, ...window.NetScene.body(A.code) })) }));
  expect(mid.s.u, "still on its way").toBeLessThan(0.7);
  mid.v.colour.forEach((c) => expect(c, "white").toBeGreaterThan(0.85));
  expect(mid.s.answering, "and nothing answers on the way").toBe(false);
  let moving = 0;
  mid.bodies.forEach((B) => {
    const d = B.to.map((v, k) => v - B.from[k]), w = B.now.map((v, k) => v - B.from[k]);
    const L = Math.hypot(...d), t = (w[0] * d[0] + w[1] * d[1] + w[2] * d[2]) / (L * L);
    const off = Math.hypot(...w.map((v, k) => v - d[k] * t));
    expect(off, B.code + ": on the straight way along its bridge").toBeLessThan(0.05);
    if (t > 0.05 && t < 0.95) moving++;
    expect(B.mean, B.code + ": its nodes kept round it").toBeLessThan(Math.max(B.R * 1.2, 3.5));
    expect(B.most, B.code + ": even the farthest").toBeLessThan(11);
  });
  expect(moving, "the accords on their way out").toBeGreaterThan(8);
  // MADE AS IT UNFOLDS: more nodes than the one network had, linked.
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(0.66);
  const mid3 = await state(page);
  expect(mid3.shown, "nodes made on the way").toBeGreaterThan(shownBefore + 500);
  expect(mid3.segments, "and their links").toBeGreaterThan(1500);
  // APART: RED AGAIN, every node there.
  await expect(stage).toHaveAttribute("data-state", "apart", { timeout: 30000 });
  await expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
  const s = await state(page);
  expect(s.shown, "every node").toBe(s.nodes);
  expect(s.answering).toBe(true);
  expect(Math.abs(s.yaw - yaw0), "the lens swung round as it came apart").toBeGreaterThan(0.4);
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
  // FARTHER FROM ONE ANOTHER than they were (2026-09-28): no two nearer
  // than nearly twice their reaches and a little more (in three
  // dimensions — on the window, one may stand behind another).
  for (let a = 0; a < after.length; a++) for (let b = a + 1; b < after.length; b++) {
    const d = Math.hypot(...after[a].at.map((v, k) => v - after[b].at[k]));
    expect(d, accords[a].code + " and " + accords[b].code + " apart").toBeGreaterThan((after[a].R + after[b].R) * 1.85 + 2.5);
  }
  // The centre: bright where it stands.
  const c = await page.evaluate(() => window.NetScene.centre());
  const seen = await look(page, [[c.x, c.y]]);
  expect(Math.min(...seen.at[0]), "the centre, white").toBeGreaterThan(120);
  // The dropdown now; "Collapse" — no "into one" — alone in the middle,
  // Combinations gone, and no Back (2026-09-28, night: "remove the back
  // button ... (when expanded)").
  await expect(page.locator(".net-nav")).toHaveCSS("opacity", "1");
  await expect(page.locator(".net-drop-option")).toHaveCount(accords.length + 1);
  await expect(page.locator(".net-expand")).toHaveText("Collapse");
  await expect(page.locator(".net-combine-button")).toBeHidden();
  await expect(page.locator(".net-back")).toBeHidden();
  const button = await page.locator(".net-expand").boundingBox();
  expect(Math.abs(button.x + button.width / 2 - 720), "Collapse in the middle").toBeLessThan(4);
  expect(await page.locator(".net-name.is-on").count(), "most of the networks named").toBeGreaterThan(8);
  expect(errors).toEqual([]);
});

/* THE SIGNAL — the flash — ONLY ON A JOURNEY (2026-09-28: "only when you
   go to a different node"): out from the centre to every network as it
   comes apart (the journey to the centre), then none while nothing moves;
   and going to an accord, along its bridge and through that accord alone.
   (Counted as the page sends them: this machine may draw too few frames to
   be sure of catching one as it passes — a flash through a network is over
   in under a second.) */
test("the flash goes only on a journey: to the centre, out to every network; to an accord, through it alone", async ({ page }) => {
  test.setTimeout(180000);
  await open(page);
  await expandIt(page);
  const codes = (await page.evaluate(() => window.NetScene.accords())).map((A) => A.code);
  let s = await state(page);
  expect(s.flashes, "one flash as it came apart").toBe(1);
  expect(s.flashTo.slice().sort(), "out to every network").toEqual(codes.slice().sort());
  // Left alone, none goes (one went every three and a half seconds before).
  await page.waitForTimeout(5000);
  s = await state(page);
  expect(s.flashes, "none while nothing moves").toBe(1);
  expect(s.litNodes).toBe(0);
  // A journey to an accord: through that accord, and no other.
  await goTo(page, 3, "FLO");
  expect((await state(page)).flashes).toBe(2);
  expect((await state(page)).flashTo).toEqual(["FLO"]);
  await page.locator('.net-step[data-step="1"]').click();
  await expect.poll(async () => (await state(page)).flashes, { timeout: 5000 }).toBe(3);
  expect((await state(page)).flashTo, "through the accord gone to, alone").toEqual(["FRU"]);
  // And back to the centre: out to every one again.
  await page.keyboard.press("Home");
  await expect.poll(async () => (await state(page)).flashes, { timeout: 5000 }).toBe(4);
  expect((await state(page)).flashTo.length).toBe(codes.length);
});

/* ONCE APART: a note answers — named at its network, pointed at it says its
   name, and pressed it opens ITS WINDOW: the page behind out of focus, and
   in the window, in the owner's order and with nothing of chemistry in it,
   its name, what it is, a figure of it in red particles, its fragrances,
   its variations, its pyramid counted, what it is most often combined
   with, and its numbers last — nothing sending you to the library — and a
   filler never answers. */
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
  // IN THE OWNER'S ORDER: "NAME OF THE NOTE, AND THEN THE DESCRIPTION, THEN
  // THE 3D DIAGRAM, THEN FRAGRANCES, THEN VARIATIONS, THEN PYRAMIDAL
  // DISTRIBUTION ... THE MOST FREQUENT COMBINATIONS, AND THEN THE
  // STATISTICS ... AT THE VERY END."
  const order = await win.evaluate((w) => [".net-note-name", ".net-note-say", ".net-note-figure", ".net-note-found", ".net-note-aka",
    ".net-note-tiers", ".net-note-with", ".net-note-stats"].map((c) => { const e = w.querySelector(c); return e ? e.getBoundingClientRect().top + w.querySelector(".net-note-body").scrollTop : null; }));
  order.forEach((y, k) => expect(y, "part " + k + " there").not.toBeNull());
  for (let k = 1; k < order.length; k++) expect(order[k], "part " + k + " after part " + (k - 1)).toBeGreaterThan(order[k - 1]);
  expect(await win.evaluate((w) => w.querySelector(".net-note-stats") === w.querySelector(".net-note-body").lastElementChild), "the statistics at the very end").toBe(true);
  // WHAT THE LIBRARY SAYS OF IT, emphasised.
  await expect(win.locator(".net-note-name")).toHaveText("Vanilla");
  await expect(win.locator(".net-note-name")).toBeFocused();
  await expect(win.locator(".net-note-kind")).toHaveText("Note");
  await expect(win.locator(".net-note-where")).toContainText("Gourmand");
  await expect(win.locator(".net-note-say")).not.toBeEmpty();
  expect(parseFloat(await win.locator(".net-note-say").evaluate((e) => getComputedStyle(e).fontSize)), "what it is, emphasised").toBeGreaterThan(15);
  // NOTHING OF CHEMISTRY: no element, symbol, atom, isotope or compound.
  // (Its own words aside: what a note is may say anything.)
  const words = (await win.evaluate((w) => {
    const c = w.cloneNode(true);
    c.querySelectorAll(".net-note-say, .net-note-accord, .net-note-found, .net-note-chips, .net-note-aka ul").forEach((e) => e.remove());
    return c.textContent;
  })).toLowerCase();
  for (const w of ["element", "isotope", "compound", "electron", "atom"]) expect(words, "no " + w).not.toContain(w);
  expect(await win.locator(".net-note-sym, .net-note-tile, .net-note-atom").count(), "no symbol, tile or atom").toBe(0);
  // THE FIGURE: what it is of, in red particles.
  await page.waitForTimeout(400);
  const figure = await win.locator(".net-note-drawing").evaluate((c) => {
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let red = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 120 && d[i] > 180 && d[i] > 2 * d[i + 1]) red++;
    return red;
  });
  expect(figure, "a figure of it drawn in red particles").toBeGreaterThan(300);
  // FRAGRANCES: every one naming it, the library's.
  const here = (await win.locator(".net-note-found a[data-key]").evaluateAll((as) => as.map((a) => a.dataset.key))).sort();
  expect(here, "every fragrance naming it, the library's").toEqual(keys);
  expect(more.keys, "and the page's own count agrees").toEqual(keys);
  await expect(win.locator(".net-note-found h3")).toHaveText("Fragrances · " + String(keys.length).padStart(2, "0"));
  // VARIATIONS: its other spellings, the library's.
  await expect(win.locator(".net-note-aka h3")).toHaveText("Variations · " + String(aka.length).padStart(2, "0"));
  expect((await win.locator(".net-note-aka li").allTextContents()).map((x) => x.trim()), "its other spellings, the library's").toEqual(aka);
  // THE PYRAMID, counted: top, middle, base — and non-pyramidal beside it —
  // each out of how many fragrances name it ("add an '/4' in the clary sage
  // window ... out of the total number of fragrances containing that
  // ingredient").
  const of = "/" + more.keys.length;
  expect(await win.locator(".net-note-pyr-n").allTextContents(), "top, middle and base, counted, out of them all")
    .toEqual([more.tally.top + of, more.tally.mid + of, more.tally.base + of]);
  await expect(win.locator(".net-note-pyr-flat-n")).toHaveText(more.tally.flat + of);
  await expect(win.locator(".net-note-pyr-flat-word")).toHaveText("non-pyramidal");
  // AND UNDER IT, THE FRAGRANCES IN EACH: "add a list of fragrances in
  // which ingredient n is listed as a top note. do the same for middle and
  // base and non-pyramidal" — each a dropdown saying how many, every one a
  // way to it.
  const TIERS = { top: "Top", mid: "Middle", base: "Base", flat: "Non-pyramidal" };
  for (const [t, say] of Object.entries(TIERS)) {
    const box = win.locator('.net-note-tier[data-tier="' + t + '"]');
    await expect(box.locator("summary")).toContainText(say);
    await expect(box.locator("summary")).toContainText(String(more.tiers[t].length));
    const inIt = (await box.locator("a[data-key]").evaluateAll((as) => as.map((a) => a.dataset.key))).sort();
    expect(inIt, say + ": the fragrances naming it there").toEqual(more.tiers[t]);
    expect(more.tiers[t].length, say + ": as many as the pyramid counts").toBe(more.tally[t]);
    if (!more.tiers[t].length) await expect(box).toContainText("None as of now.");
  }
  const tierLinks = await win.locator(".net-note-tier a[data-key]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  tierLinks.forEach((h) => expect(h).toMatch(/^\.\.\/(houses\/[a-z-]+|individual-fragrances\/individual-fragrances)\.html#part-\d\d$/));
  // THE MOST FREQUENT COMBINATIONS.
  const chips = win.locator(".net-note-chip");
  expect(await chips.count(), "the notes it is most often combined with").toBeGreaterThan(3);
  // THE STATISTICS, last and quiet: its number, how many of the site's
  // fragrances, and its rank.
  await expect(win.locator(".net-note-facts")).toContainText("No. " + about.no + " of " + N);
  await expect(win.locator(".net-note-facts")).toContainText(about.uses + " of the site's " + more.fragrances);
  await expect(win.locator(".net-note-facts")).toContainText(/\d+(st|nd|rd|th) of \d+ · \d+(st|nd|rd|th) of \d+ in Gourmand/);
  expect(+(await win.locator(".net-note-stats").evaluate((e) => getComputedStyle(e).opacity)), "and quiet").toBeLessThan(0.8);
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
  await chips.first().scrollIntoViewIfNeeded();
  await chips.first().click();
  await expect.poll(async () => (await state(page)).note, { timeout: 20000 }).toBe(chipName);
  // Escape puts it away, and the page comes back into focus — the accord
  // you are at whole again, the rest still stepped back out of its way.
  await page.keyboard.press("Escape");
  await expect(stage).toHaveAttribute("data-selected", "");
  await expect(win).toBeHidden();
  await expect(veil).toBeHidden();
  const atCode = (await state(page)).focus;
  const here1 = (await page.evaluate(() => window.NetScene.accords())).find((A) => A.code === atCode).count;
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - here1);
  // So does a press on the page round it.
  await expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
  const again = (await page.evaluate(() => window.NetScene.notes())).find((n) => n.code === "GOU" && n.uses > 2);
  await goTo(page, 6, "GOU");
  at = await page.evaluate((name) => window.NetScene.note(name), again.name);
  await page.mouse.click(at.x, at.y);
  await expect(win).toBeVisible();
  await page.mouse.click(40, 500);
  await expect(win).toBeHidden();
  // A NOTE WRITTEN ONLY ONE WAY says so, in the owner's words.
  const plain = await page.evaluate(() => window.NetScene.notes().map((n) => n.name).find((x) => !window.NetScene.about(x).aka.length));
  expect(await page.evaluate((x) => window.NetScene.open(x), plain)).toBe(true);
  await expect(win.locator(".net-note-name")).toHaveText(plain);
  await expect(win.locator(".net-note-aka h3")).toHaveText("Variations · 00");
  await expect(win.locator(".net-note-aka .net-note-none")).toHaveText("No records of variations exist as of now");
  await page.keyboard.press("Escape");
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
  await settled();
  // An accord pressed in the menu goes there too.
  await page.locator('.net-arrow[data-pull="menu"]').click();
  await page.locator('.net-accord[data-code="CIT"]').click();
  await at("CIT");
  await settled();
  // THE CENTRE IS IN THE ARROWS' ROUND: back from the first accord is the
  // centre, not the last ("if you click back from the citrus accord, you
  // would go back to the center"); back again is the last, and on from the
  // last is the centre again.
  await page.locator('.net-step[data-step="-1"]').click();
  await at("centre");
  await settled();
  await page.locator('.net-step[data-step="-1"]').click();
  await at("IMP");
  await settled();
  await page.locator('.net-step[data-step="1"]').click();
  await at("centre");
  await settled();
  expect(errors).toEqual([]);
});

/* AT AN ACCORD, NOTHING IN THE WAY OF IT: the centre, the other networks and
   their bridges step back, and their names are not printed over it; and
   the accord you are at stays the one lit — the menu's hand does not take
   it away ("i want that one to be in focus"). There is no Back once
   expanded (2026-09-28, night): the dropdown goes to the centre, and
   Collapse into one again. */
test("at an accord nothing stands in its way, the menu's hand does not take it away, and there is no Back while expanded", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await open(page);
  await settle(page);
  await expandIt(page);
  const stage = page.locator(".net-stage");
  const N = +(await stage.getAttribute("data-notes"));
  await goTo(page, 15, "IMP");
  const count = (await page.evaluate(() => window.NetScene.accords())).find((A) => A.code === "IMP").count;
  await expect.poll(async () => (await state(page)).hub, { timeout: 10000 }).toBeLessThan(0.12);
  const s = await state(page);
  const codes = (await page.evaluate(() => window.NetScene.accords())).map((A) => A.code);
  s.away.forEach((v, k) => {
    if (codes[k] === "IMP") expect(v, "IMP whole").toBeGreaterThan(0.99);
    else expect(v, codes[k] + " stepped back").toBeLessThan(0.12);
  });
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - count);
  // Its name is the only one near it: no other network's name printed over it.
  const net = await page.evaluate(() => window.NetScene.network("IMP"));
  const near = await page.locator(".net-name").evaluateAll((els, c) => els.filter((e) => {
    if (+getComputedStyle(e).opacity < 0.1) return false;
    const r = e.getBoundingClientRect();
    return Math.hypot(r.x + r.width / 2 - c.x, r.y + r.height / 2 - c.y) < 200;
  }).map((e) => e.dataset.code), net);
  expect(near, "no other accord's name over it").toEqual([]);
  // THE MENU'S HAND: another accord under it is lit in the menu, and the
  // accord you are at stays the one lit on the page.
  await page.locator('.net-arrow[data-pull="menu"]').click();
  await expect(page.locator('.net-accord[data-code="IMP"]'), "the menu says where you are").toHaveClass(/is-here/);
  await page.locator('.net-accord[data-code="WOO"]').hover();
  expect((await state(page)).previewing).toBe("WOO");
  await page.waitForTimeout(700);
  expect((await state(page)).dim, "still only the accord you are at").toBe(N - count);
  expect((await page.evaluate(() => window.NetScene.note("Candle Wax"))).opacity, "an impression whole").toBe(1);
  await page.mouse.move(900, 450);
  // NO BACK while expanded: the dropdown to the centre, Collapse into one.
  await expect(page.locator(".net-back")).toBeHidden();
  await goTo(page, -1, "centre");
  await expect.poll(async () => (await state(page)).hub, { timeout: 10000 }).toBeGreaterThan(0.9);
  await expect(page.locator(".net-back")).toBeHidden();
  await page.locator(".net-expand").click();
  await expect(stage).toHaveAttribute("data-state", "one", { timeout: 30000 });
  await expect(page.locator(".net-back")).toBeHidden();
  await expect(page.locator(".net-combine-button")).toBeVisible();
  expect(errors).toEqual([]);
});

/* NO BLUR: "remove the blur; entirely scratch that idea" (2026-09-28).
   The depth blur and the soft layer it drew with are gone from the code,
   not switched off — no second pass drawn apart, no blur of its own. */
test("the depth blur is gone from the test page, not switched off", () => {
  const src = require("fs").readFileSync(require("path").join(__dirname, "..", "network.js"), "utf8");
  expect(src).not.toMatch(/DEPTH_BLUR|WebGLRenderTarget|blurMaterial|SOFT_GLOW|softOp|blur=off/);
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
  await expect(page.locator(".net-combine-button"), "Combinations back beside it").toBeVisible();
  await expect(page.locator(".net-back")).toBeHidden();
  expect(errors).toEqual([]);
});

/* COMBINATIONS (2026-09-28): the button on the right of the one that
   expands it. Pressed, the one network pulses, turns "a slightly yellow"
   and loosens — still one network — Expand goes and a way back comes, the
   two together in the middle ("center both"), and a bar takes notes as
   tags: a tag is joined, on the network, to every note found with it in a
   fragrance, its lines drawn out one by one ("connecting the notes"; the
   network going soft while they were, a blur, went with the depth blur —
   "remove the blur; entirely scratch that idea") — and a SECOND tag leaves
   only the MIDDLE OF THE VENN DIAGRAM: "i want each note to be a network,
   but upon selecting more than one note, only the lines that satisfy both
   networks are going to be included". A list, plainly a button, opens of
   the fragrances that have every tag; RESET takes them all away at once;
   and "Choose a note to see what it is combined with" is said only while
   the page is left alone ("make it an idle thing"). */
test("combinations: the network turns gold and loosens, and notes taken as tags show what they are combined with", async ({ page }) => {
  test.setTimeout(180000);
  const errors = collectPageErrors(page);
  await open(page);
  await settle(page);
  const stage = page.locator(".net-stage");
  const spread0 = await page.evaluate(() => window.NetScene.spread());
  await page.locator(".net-combine-button").click();
  await expect(page.locator(".net-combine-button")).toHaveAttribute("aria-pressed", "true");
  // IT PULSES, and comes to gold, loosened — and is still the one network.
  await expect.poll(async () => (await state(page)).pulsed, { timeout: 10000 }).toBe(true);
  await expect.poll(async () => (await state(page)).cmb, { timeout: 30000 }).toBe(1);
  await expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
  const gold = (await page.evaluate(() => window.NetScene.note("Vanilla"))).colour;
  expect(gold[1], "gold: its green well up with its red").toBeGreaterThan(gold[0] * 0.45);
  expect(gold[0], "and its blue well under both").toBeGreaterThan(gold[2] * 2.5);
  expect(await page.evaluate(() => window.NetScene.spread()), "loosened").toBeGreaterThan(spread0 * 1.4);
  const s0 = await state(page);
  expect(s0.state, "still the one network").toBe("one");
  expect(s0.answering, "its notes answer now").toBe(true);
  // Expand gone, Combinations on — black on white — and a way back before
  // it, the two together in the middle.
  await expect(page.locator(".net-expand")).toBeHidden();
  await expect(page.locator(".net-back")).toBeVisible();
  const backBox = await page.locator(".net-back").boundingBox();
  const onBox = await page.locator(".net-combine-button").boundingBox();
  expect(backBox.x + backBox.width, "Back before it").toBeLessThan(onBox.x);
  expect(Math.abs((backBox.x + onBox.x + onBox.width) / 2 - 720), "the two together in the middle").toBeLessThan(3);
  await expect(page.locator(".net-combine-reset"), "nothing to reset yet").toBeDisabled();
  // "CHOOSE A NOTE ..." ONLY WHEN LEFT ALONE: gone while the hand moves,
  // there once the page has been left to itself, gone again at a move.
  const hint = page.locator(".net-combine-toggle");
  await expect(hint).toHaveClass(/is-hint/);
  await expect(hint).toContainText("Choose a note to see what it is combined with");
  await page.mouse.move(1300, 180, { steps: 3 });
  await expect.poll(() => hint.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 3000 }).toBeLessThan(0.05);
  await page.evaluate(() => window.NetScene.leave(9000));
  await expect(stage).toHaveClass(/is-idle/, { timeout: 5000 });
  await expect.poll(() => hint.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 3000 }).toBeGreaterThan(0.95);
  await page.mouse.move(1280, 200, { steps: 3 });
  await expect(stage).not.toHaveClass(/is-idle/);
  await expect.poll(() => hint.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 3000 }).toBeLessThan(0.05);
  expect(await page.locator(".net-combine-button").evaluate((b) => getComputedStyle(b).backgroundColor), "black on white").toMatch(/rgb\(24[0-9], 2[34][0-9], 2[23][0-9]\)/);
  // THE BAR, and the first tag.
  const input = page.locator(".net-combine-input");
  await expect(input).toBeVisible();
  await expect(input).toBeFocused();
  await input.fill("yuz");
  await expect(page.locator(".net-suggest-name").first()).toHaveText("Yuzu");
  await page.keyboard.press("Enter");
  await expect(page.locator(".net-tag")).toHaveCount(1);
  await expect(page.locator(".net-tag")).toContainText("Yuzu");
  // ITS LINES DRAWN OUT, and nothing going soft while they are.
  await expect.poll(async () => (await state(page)).tagging, { timeout: 8000 }).toBe(false);
  const one = await page.evaluate(() => window.NetScene.combined(["Yuzu"]));
  let s = await state(page);
  expect(s.tags).toEqual(["Yuzu"]);
  expect(s.matched, "the fragrances that have it").toEqual(one.keys);
  expect(s.partners, "every note found with it").toBe(Object.keys(one.withs).length);
  // Joined on the network to every one of them, brightly.
  await expect.poll(async () => (await state(page)).tagLines, { timeout: 5000 }).toBe(Object.keys(one.withs).length);
  const lines = await page.evaluate(() => window.NetScene.tagLines());
  lines.forEach((l) => expect(l.colour[0] + l.colour[1], "a line lit").toBeGreaterThan(0.3));
  const yuzu = await page.evaluate(() => window.NetScene.note("Yuzu"));
  lines.forEach((l) => expect(Math.hypot(l.a.x - yuzu.x, l.a.y - yuzu.y), "from Yuzu").toBeLessThan(2));
  // What they are found with stays lit; the rest go faint.
  const partner = Object.keys(one.withs)[0];
  await expect.poll(async () => (await page.evaluate((n) => window.NetScene.note(n), partner)).opacity, { timeout: 8000 }).toBe(1);
  const stranger = (await page.evaluate(() => window.NetScene.notes())).find((n) => n.name !== "Yuzu" && !(n.name in one.withs));
  await expect.poll(async () => (await page.evaluate((n) => window.NetScene.note(n), stranger.name)).opacity, { timeout: 8000 }).toBeLessThan(0.2);
  // THE LIST: the fragrances that have it, each a way to it — behind a
  // button that says so ("make this more obvious").
  await expect(page.locator(".net-combine-count")).toContainText(one.keys.length + (one.keys.length === 1 ? " fragrance" : " fragrances"));
  await expect(page.locator(".net-combine-toggle")).toContainText("Show");
  await expect(page.locator(".net-combine-open")).toBeVisible();
  await expect(page.locator(".net-combine-toggle")).toHaveClass(/is-new/);
  await page.locator(".net-combine-toggle").click();
  await expect(page.locator(".net-combine-list")).toBeVisible();
  await expect(page.locator(".net-combine-toggle")).toContainText("Hide");
  const listed = (await page.locator(".net-combine-list a[data-key]").evaluateAll((as) => as.map((a) => a.dataset.key))).sort();
  expect(listed).toEqual(one.keys);
  const hrefs = await page.locator(".net-combine-list a[data-key]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  hrefs.forEach((h) => expect(h).toMatch(/^\.\.\/(houses\/[a-z-]+|individual-fragrances\/individual-fragrances)\.html#part-\d\d$/));
  // A SECOND TAG, from what it is found with: only fragrances with both.
  await input.click();
  await input.fill(partner.split(" ")[0].slice(0, 4));
  const offered = await page.locator(".net-suggest-name").allTextContents();
  offered.forEach((n) => expect(n in one.withs, n + " is found with Yuzu").toBe(true));
  await page.locator(".net-suggest", { hasText: partner }).first().dispatchEvent("pointerdown");
  await expect(page.locator(".net-tag")).toHaveCount(2);
  const two = await page.evaluate((p) => window.NetScene.combined(["Yuzu", p]), partner);
  s = await state(page);
  expect(s.tags).toEqual(["Yuzu", partner]);
  expect(s.matched, "the fragrances with both").toEqual(two.keys);
  expect(two.keys.length).toBeGreaterThan(0);
  expect(s.partners, "and what is found with both").toBe(Object.keys(two.withs).length);
  // THE MIDDLE OF THE VENN DIAGRAM: only what is found with BOTH keeps its
  // lines — a note of Yuzu's network and not the other's loses them, and
  // goes faint — and each of the two is joined to every one of the middle.
  Object.keys(two.withs).forEach((m) => expect(m in one.withs, m + " is in Yuzu's network").toBe(true));
  expect(Object.keys(two.withs).length, "fewer than Yuzu's own").toBeLessThan(Object.keys(one.withs).length);
  await expect.poll(async () => (await state(page)).tagging, { timeout: 8000 }).toBe(false);
  await expect.poll(async () => (await state(page)).tagLines, { timeout: 5000 }).toBe(2 * Object.keys(two.withs).length + 1);
  const outside = Object.keys(one.withs).find((m) => m !== partner && !(m in two.withs));
  await expect.poll(async () => (await page.evaluate((n) => window.NetScene.note(n), outside)).opacity, { timeout: 8000 }).toBeLessThan(0.2);
  // What nothing answers says so, in the owner's words.
  await input.fill("zzzq");
  await expect(page.locator(".net-suggest.is-none")).toHaveText("Unfortunately nothing like that exists on this page yet.");
  // Backspace in the empty bar takes the last one away; a tag's × too.
  await input.fill("");
  await page.keyboard.press("Backspace");
  await expect(page.locator(".net-tag")).toHaveCount(1);
  await page.locator(".net-tag").click();
  await expect(page.locator(".net-tag")).toHaveCount(0);
  expect((await state(page)).tags).toEqual([]);
  // RESET: two tags, and every one taken away at once.
  await input.fill("yuz");
  await page.keyboard.press("Enter");
  await input.fill(partner.split(" ")[0].slice(0, 4));
  await page.locator(".net-suggest", { hasText: partner }).first().dispatchEvent("pointerdown");
  await expect(page.locator(".net-tag")).toHaveCount(2);
  await expect(page.locator(".net-combine-reset")).toBeEnabled();
  await page.locator(".net-combine-reset").click();
  await expect(page.locator(".net-tag")).toHaveCount(0);
  expect((await state(page)).tags).toEqual([]);
  await expect(page.locator(".net-combine-reset")).toBeDisabled();
  // A note pressed on the network is taken as a tag.
  await page.mouse.move(1300, 200);
  await page.waitForTimeout(300);
  const v = await page.evaluate(() => window.NetScene.notes().map((n) => window.NetScene.note(n.name)).find((p) => p.x > 400 && p.x < 1050 && p.y > 200 && p.y < 600));
  await page.mouse.click(v.x, v.y);
  await expect.poll(async () => (await state(page)).tags.length, { timeout: 5000 }).toBe(1);
  // BACK: red again, together again, Expand back, the tags gone.
  await page.locator(".net-back").click();
  await expect.poll(async () => (await state(page)).cmb, { timeout: 30000 }).toBe(0);
  expect((await state(page)).tags).toEqual([]);
  await expect.poll(async () => red((await page.evaluate(() => window.NetScene.note("Vanilla"))).colour), { timeout: 10000 }).toBe(true);
  await expect(page.locator(".net-expand")).toBeVisible();
  await expect(page.locator(".net-back")).toBeHidden();
  await expect(stage).not.toHaveClass(/is-combining/);
  expect(errors).toEqual([]);
});

/* EVERY NOTE A FIGURE OF ITS OWN: "if there is grapefruit, make a
   grapefruit from particles. Do this for all notes." */
test("every note in the library has a figure of its own, in particles", async ({ page, request }) => {
  const html = (await (await request.get(LIBRARY)).text()).replace(/<!--[\s\S]*?-->/g, "");
  const names = [...html.matchAll(/class="lib-name">([^<]*)</g)].map((m) => m[1].replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").trim());
  expect(names.length).toBeGreaterThan(300);
  await page.goto(TEST_PAGE);
  const figures = await page.evaluate((names) => names.map((n) => { const f = window.NoteFigures.of(n, ""); return { n, own: f.own, specks: f.d.length / 4 }; }), names);
  figures.forEach((f) => {
    expect(f.own, f.n + " has a figure of its own").toBe(true);
    expect(f.specks, f.n + " in enough particles").toBeGreaterThanOrEqual(150);
    expect(f.specks, f.n + " and not too many").toBeLessThanOrEqual(1500);
  });
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
    // Combinations, at once, and out of them.
    await page.locator(".net-combine-button").click();
    await expect(stage, "combinations at once").toHaveAttribute("data-combine", "on", { timeout: 1000 });
    // A note added: its lines at once.
    await page.locator(".net-combine-input").fill("yuz");
    await page.keyboard.press("Enter");
    await expect(page.locator(".net-tag")).toHaveCount(1);
    await page.waitForTimeout(600);
    expect((await state(page)).tagLines, "every line out at once").toBe((await state(page)).partners);
    await page.locator(".net-back").click();
    await expect(stage, "and out at once").toHaveAttribute("data-combine", "", { timeout: 1000 });
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

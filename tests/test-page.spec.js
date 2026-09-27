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

   window.NetScene says where things stand on the window and what state it
   is in. The tests' machine draws in software, so the drawing's own clock
   runs slower than it would on a real screen: every wait here is on a
   state, with room to spare, never on a number of seconds.
   ============================================================ */
const { test, expect } = require("@playwright/test");
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
    for (let i = 0; i < d.length; i += 16) if (d[i] > 170 && d[i + 1] < 120 && d[i + 2] < 130) red++;
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
/** Red, not white: a note's colour once the signal has passed it. */
const red = (c) => c[0] > 0.85 && c[1] < 0.45 && c[2] < 0.5;

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* ONE RED NETWORK: every note in the Note Library a glowing red node among
   fillers of its own, all of it linked; the button to expand it at the
   foot, in the middle of the room the window on the LEFT leaves; and
   nothing in it answers the hand. */
test("the Note Library is drawn as one red network, and nothing in it answers the hand", async ({ page, request }) => {
  test.setTimeout(90000);
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
  const s = await state(page);
  expect(s.shown, "some fillers in it already, the rest made as it comes apart").toBeGreaterThan(records);
  expect(s.shown).toBeLessThan(s.nodes);
  await page.mouse.move(700, 880);
  await page.waitForTimeout(2000);
  // Red, on the page's own dark ground at its corners.
  const seen = await look(page, [[1420, 450], [1420, 880], [330, 880]]);
  expect(seen.red, "the nodes are red").toBeGreaterThan(1500);
  seen.at.forEach((px, n) => px.forEach((v) => expect(v, "point " + n + " is the dark ground").toBeLessThan(60)));
  const vanilla = await page.evaluate(() => window.NetScene.note("Vanilla"));
  expect(red(vanilla.colour), "a note is red").toBe(true);
  // NOTHING ANSWERS: pointed at, a note says nothing; pressed, nothing is
  // chosen.
  expect(s.answering).toBe(false);
  await page.mouse.move(vanilla.x, vanilla.y);
  await page.waitForTimeout(300);
  await expect(page.locator(".net-hover")).not.toHaveClass(/is-on/);
  await page.mouse.click(vanilla.x, vanilla.y);
  await page.waitForTimeout(300);
  await expect(stage).not.toHaveAttribute("data-selected", /./);
  await expect(page.locator(".net-card")).toBeHidden();
  // The button that expands it: at the foot, in the middle of what the
  // window on the left leaves.
  const button = await page.locator(".net-expand").boundingBox();
  const panel = await page.locator(".net-panel").boundingBox();
  expect(panel.x, "the window on the left").toBeLessThan(30);
  expect(button.y + button.height, "at the foot").toBeGreaterThan(900 - 50);
  expect(Math.abs(button.x + button.width / 2 - (1440 + 320) / 2), "in the middle of the room left").toBeLessThan(40);
  await expect(page.locator(".net-expand")).toHaveText(/Expand the library/i);
  // Before it has come apart there is no dropdown to be had.
  await expect(page.locator(".net-nav")).toHaveCSS("opacity", "0");
  // Nothing written on it but its chrome; the one <h1> is read, not drawn.
  const title = await page.locator("h1.visually-hidden").evaluate((h) => { const r = h.getBoundingClientRect(); return { w: r.width, h: r.height, text: h.textContent }; });
  expect(title.text).toContain("Test page");
  expect(title.w * title.h, "and it is not drawn").toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
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

/* THE WINDOW ON THE LEFT: minimal, with a ring of specks; the switch that
   opens the search IN THE WINDOW — the library's own rule — and the
   accords, each lighting up alone under the hand, and chosen by a press. */
test("the window on the left holds the search and the accords, each lighting up alone under the hand", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  // What the library's own search finds for "cedar".
  await page.goto(LIBRARY);
  await page.locator(".lib-query").fill("cedar");
  const found = (await page.$$eval(".lib-record.is-hit .lib-name", (els) => els.map((e) => e.textContent.trim()))).sort();
  expect(found.length).toBeGreaterThan(1);

  await open(page);
  const stage = page.locator(".net-stage");
  const N = +(await stage.getAttribute("data-notes"));
  const panel = page.locator(".net-panel");
  const box = await panel.boundingBox();
  expect(box.x, "on the left").toBeLessThan(30);
  expect(box.width, "and narrow").toBeLessThan(300);
  // The ring of specks in it, drawn.
  const inked = await page.locator(".net-mark").evaluate((c) => {
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
    return n;
  });
  expect(inked, "the ring of specks").toBeGreaterThan(300);

  // THE SEARCH, in the window.
  const bar = page.locator(".net-search");
  const toggle = panel.locator(".net-switch");
  await expect(bar, "not there until it is asked for").toBeHidden();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await expect(bar).toBeVisible();
  const barBox = await bar.boundingBox();
  expect(barBox.x >= box.x && barBox.x + barBox.width <= box.x + box.width, "inside the window").toBe(true);
  await expect(page.locator(".net-query")).toBeFocused();
  await page.keyboard.type("cedar");
  expect((await state(page)).hits.slice().sort(), "the library's own answers").toEqual(found);
  await expect(page.locator(".net-result")).toHaveCount(found.length);
  await expect(page.locator(".net-count")).toHaveText(found.length + " / " + N);
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - found.length);
  expect((await state(page)).faintest, "the rest translucent").toBeLessThan(0.2);
  // Its × empties it.
  await page.locator(".net-clear").click();
  expect((await state(page)).query).toBe("");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
  await page.keyboard.type("cedar");
  // Put away again, and the search goes with it.
  await toggle.click();
  await expect(bar).toBeHidden();
  expect((await state(page)).query).toBe("");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);

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

  // Folded away, it leaves only its button, and the drawing takes the room.
  await page.locator(".net-fold").click();
  await expect(panel).toHaveClass(/is-folded/);
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => document.elementFromPoint(120, 500).className), "the drawing where it stood").toContain("net-canvas");
  await page.locator(".net-fold").click();
  await expect(panel).not.toHaveClass(/is-folded/);
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

/* ONCE APART: a note answers — named at its network, pressed it is chosen,
   every other node turns translucent and the card on the right says what
   it is — and a filler never does. */
test("once apart, pressing a note selects it and its card says what it is; a filler never answers", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await open(page);
  await expandIt(page);
  const stage = page.locator(".net-stage");
  await goTo(page, 6, "GOU");
  // Every note of the network you are at named beside its node.
  await expect.poll(async () => page.locator(".net-label").evaluateAll((els) => els.filter((e) => +getComputedStyle(e).opacity > 0.5).length), { timeout: 10000 }).toBeGreaterThan(15);
  const N = +(await stage.getAttribute("data-notes"));
  const about = (await page.evaluate(() => window.NetScene.notes())).find((n) => n.name === "Vanilla");
  let at = await page.evaluate(() => window.NetScene.note("Vanilla"));
  await page.mouse.move(at.x, at.y);
  await expect(page.locator(".net-hover"), "pointed at, it says its name").toHaveClass(/is-on/);
  await expect(page.locator(".net-hover")).toContainText("Vanilla");
  at = await page.evaluate(() => window.NetScene.note("Vanilla"));
  await page.mouse.click(at.x, at.y);
  await expect(stage).toHaveAttribute("data-selected", "Vanilla");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(N - 1);
  expect((await state(page)).faintest, "the rest translucent").toBeLessThan(0.2);
  const card = page.locator(".net-card");
  await expect(card).toBeVisible();
  const cardBox = await card.boundingBox();
  expect(cardBox.x + cardBox.width, "on the right").toBeGreaterThan(1440 - 40);
  await expect(card.locator(".net-card-name")).toHaveText("Vanilla");
  await expect(card.locator(".net-card-sym")).toHaveText(about.sym);
  await expect(card.locator(".net-card-accord")).toHaveText("Gourmand");
  await expect(card.locator(".net-card-no")).toHaveText(String(about.no));
  await expect(card.locator(".net-card-uses")).toHaveText("used in " + about.uses);
  await expect(card.locator(".net-card-say")).not.toBeEmpty();
  await expect(card.locator(".net-card-open")).toHaveAttribute("href", /categories\/note-library\.html#note-vanilla$/);
  await expect(page.locator(".net-leader"), "a line from the card to the note").toHaveClass(/is-on/);
  await page.keyboard.press("Escape");
  await expect(stage).toHaveAttribute("data-selected", "");
  await expect(card).toBeHidden();
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
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
  // An accord pressed in the window goes there too.
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

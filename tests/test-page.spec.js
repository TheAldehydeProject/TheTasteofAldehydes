// @ts-check
/* ============================================================
   THE TEST PAGE — works/test-page.html, drawn by network.js.

   The owner, 2026-09-26: "add a new page to the whole site, and make it
   completly blank. this will be a test page." It carried a network of red
   nodes, then five; and since 2026-09-27 it is THE NOTE LIBRARY IN THREE
   DIMENSIONS:

     "I want each galaxy to be an accord, and then the dots on it should
     be the individual notes that belong to that accord group ...
     navigtable freely with rotation ... a window on the right that
     contains the option to make the search bar available ... the
     selection of the accords manually ... one central red library ...
     a button to expand it (bottom middle of the screen) ... a drop down
     menu on the bottom of the page (it appears after the expansion) ...
     red and glowing, until they expand, where they will then turn their
     individual colours ... While they transition from the red to their
     respective colours, I want them to turn white and have changing
     geometrical links between them too. I want all transitions to be
     smooth and run at 60FPS ... a central node which is connected to all
     the galaxies ... so you can go from one accord to another
     interchanagably, which I want you to make quite easy."

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
/** An accord's colour as the page gives it: its library hue, glowing. */
const hsl = (h, s, l) => {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0), f(8), f(4)];
};
async function open(page, size = { width: 1440, height: 900 }) {
  await page.setViewportSize(size);
  await page.goto(TEST_PAGE);
  await expect(page.locator(".net-stage")).toHaveClass(/is-drawn/, { timeout: 15000 });
}
async function expandIt(page) {
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "apart", { timeout: 30000 });
}

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* ONE RED GALAXY: every note in the Note Library a glowing red node, the
   accords all in it; the button to expand it at the foot, in the middle;
   the window on the right; nothing else drawn. */
test("the Note Library is drawn as one red galaxy, every note a node", async ({ page, request }) => {
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
  await expect(stage).toHaveAttribute("data-state", "one");
  await page.mouse.move(700, 880);
  await page.waitForTimeout(2000);
  // Red, on the page's own dark ground at its corners.
  const seen = await look(page, [[40, 450], [720, 150], [40, 860]]);
  expect(seen.red, "the nodes are red").toBeGreaterThan(1500);
  seen.at.forEach((px, n) => px.forEach((v) => expect(v, "point " + n + " is the dark ground").toBeLessThan(60)));
  const vanilla = await page.evaluate(() => window.NetScene.note("Vanilla"));
  expect(vanilla.colour[0], "a note is red").toBeGreaterThan(0.85);
  expect(vanilla.colour[1]).toBeLessThan(0.45);
  // The button that expands it: at the foot, in the middle of the room the
  // window on the right leaves.
  const button = await page.locator(".net-expand").boundingBox();
  const panel = await page.locator(".net-panel").boundingBox();
  expect(button.y + button.height, "at the foot").toBeGreaterThan(900 - 50);
  expect(Math.abs(button.x + button.width / 2 - panel.x / 2), "in the middle").toBeLessThan(40);
  await expect(page.locator(".net-expand")).toHaveText(/Expand the library/i);
  expect(panel.x + panel.width, "the window on the right").toBeGreaterThan(1440 - 30);
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
  const hues = await page.$$eval(".lib-shelf", (els) => els.map((el) => [el.dataset.shelf, +el.style.getPropertyValue("--hue")]));
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
  // And every accord in the library's own colour.
  const accords = await page.evaluate(() => window.NetScene.accords());
  accords.forEach((A) => expect(A.hue, A.code).toBe(hues.find(([c]) => c === A.code)[1]));
});

/* The accords' colours, and the rule the search reads by, are the Note
   Library's own, copied into network.js: kept the same. */
test("the page's copy of the library's colours is the library's", () => {
  const read = (file) => {
    const text = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    const m = text.match(/const HUE = \{([\s\S]*?)\};/);
    return m && m[1].replace(/\s+/g, " ").trim();
  };
  expect(read("network.js")).toBe(read("note-library.js"));
});

/* THE WINDOW ON THE RIGHT: the switch that makes the search bar available
   — the library's own `query>`, by its own rule — and the accords, chosen
   by hand: the rest go translucent. */
test("the window on the right makes the search bar available and chooses the accords", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  // What the library's own search finds for "cedar".
  await page.goto(LIBRARY);
  await page.locator(".lib-query").fill("cedar");
  const found = (await page.$$eval(".lib-record.is-hit .lib-name", (els) => els.map((e) => e.textContent.trim()))).sort();
  expect(found.length).toBeGreaterThan(1);

  await open(page);
  const stage = page.locator(".net-stage");
  const bar = page.locator(".net-search");
  const toggle = page.locator(".net-panel .net-switch");
  await expect(bar, "not there until it is asked for").toBeHidden();
  await expect(toggle).toHaveAttribute("aria-checked", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");
  await expect(bar).toBeVisible();
  await expect(page.locator(".net-query")).toBeFocused();
  await page.keyboard.type("cedar");
  expect((await state(page)).hits.slice().sort(), "the library's own answers").toEqual(found);
  await expect(page.locator(".net-result")).toHaveCount(found.length);
  await expect(page.locator(".net-count")).toHaveText(found.length + " / " + (await stage.getAttribute("data-notes")));
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(+(await stage.getAttribute("data-notes")) - found.length);
  expect((await state(page)).faintest, "the rest translucent").toBeLessThan(0.2);
  // Put away again, and the search goes with it.
  await toggle.click();
  await expect(bar).toBeHidden();
  expect((await state(page)).query).toBe("");
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);

  // The accords, by hand: one lights, the rest go translucent; all of them
  // back again.
  const accords = page.locator(".net-accord");
  expect(await accords.count(), "every accord, and all of them").toBe(17);
  const woods = page.locator('.net-accord[data-code="WOO"]');
  await woods.click();
  await expect(woods).toHaveAttribute("aria-pressed", "true");
  const count = +(await woods.locator(".net-accord-count").textContent());
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(+(await stage.getAttribute("data-notes")) - count);
  expect((await page.evaluate(() => window.NetScene.note("Cedarwood"))).opacity, "a wood whole").toBe(1);
  await page.locator('.net-accord[data-code=""]').click();
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);

  // Folded away, it leaves only its button, and the drawing takes the room.
  await page.locator(".net-fold").click();
  await expect(page.locator(".net-panel")).toHaveClass(/is-folded/);
  await page.waitForTimeout(700);
  expect(await page.evaluate(() => document.elementFromPoint(window.innerWidth - 20, 500).className), "the drawing under the strip it left").toContain("net-canvas");
  await page.locator(".net-fold").click();
  await expect(page.locator(".net-panel")).not.toHaveClass(/is-folded/);
  expect(errors).toEqual([]);
});

/* SELECTING: pressing a note — every other turns translucent, and the card
   on the left says what it is, with the way to it in the Note Library. */
test("pressing a note selects it: the rest turn translucent, and its card says what it is", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await open(page);
  const stage = page.locator(".net-stage");
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
  await expect(card.locator(".net-card-name")).toHaveText("Vanilla");
  await expect(card.locator(".net-card-sym")).toHaveText(about.sym);
  await expect(card).toContainText("GOU · Gourmand");
  await expect(card.locator(".net-card-no")).toHaveText(String(about.no));
  await expect(card.locator(".net-card-uses")).toHaveText("used in " + about.uses);
  await expect(card.locator(".net-card-say")).not.toBeEmpty();
  await expect(card.locator(".net-card-open")).toHaveAttribute("href", /categories\/note-library\.html#note-vanilla$/);
  await expect(page.locator(".net-leader"), "a line from the card to the note").toHaveClass(/is-on/);
  await page.keyboard.press("Escape");
  await expect(stage).toHaveAttribute("data-selected", "");
  await expect(card).toBeHidden();
  await expect.poll(async () => (await state(page)).dim, { timeout: 8000 }).toBe(0);
  expect(errors).toEqual([]);
});

/* EXPANDING: the one galaxy comes apart. Every node turns WHITE, with links
   between them that CHANGE as they move; each accord flies out in its own
   direction and reforms as a galaxy of its own, in its own colour; the
   centre comes up where the library was; and the dropdown comes up at the
   foot. */
test("expanding: through white, with changing links, into a galaxy for each accord in its own colour", async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await open(page);
  const stage = page.locator(".net-stage");
  const before = await page.evaluate(() => window.NetScene.accords().map((A) => [A.code, window.NetScene.galaxy(A.code).spread]));
  before.forEach(([code, spread]) => expect(spread, code + " starts in the one galaxy").toBeGreaterThan(8));
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-expand")).toHaveAttribute("aria-expanded", "true");
  // WHITE, WITH CHANGING LINKS, on the way.
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(0.3);
  const mid1 = await page.evaluate(() => ({ s: window.NetScene.state(), v: window.NetScene.note("Vanilla") }));
  expect(mid1.s.u, "still on its way").toBeLessThan(0.65);
  mid1.v.colour.forEach((c) => expect(c, "white").toBeGreaterThan(0.85));
  expect(mid1.s.changing, "linked, while white").toBeGreaterThan(80);
  await expect.poll(async () => (await state(page)).u, { timeout: 20000, intervals: [50] }).toBeGreaterThan(mid1.s.u + 0.1);
  const mid2 = await page.evaluate(() => ({ s: window.NetScene.state(), v: window.NetScene.note("Vanilla") }));
  expect(mid2.s.changing, "and the links change as they go").not.toBe(mid1.s.changing);
  expect(mid2.v.x !== mid1.v.x || mid2.v.y !== mid1.v.y, "moving").toBe(true);
  // APART, IN THEIR COLOURS.
  await expect(stage).toHaveAttribute("data-state", "apart", { timeout: 30000 });
  const accords = await page.evaluate(() => window.NetScene.accords());
  for (const [name, code] of [["Vanilla", "GOU"], ["Cedarwood", "WOO"], ["Bergamot", "CIT"], ["Rose", "FLO"]]) {
    const n = await page.evaluate((name) => window.NetScene.note(name), name);
    const want = hsl(accords.find((A) => A.code === code).hue, 0.72, 0.6);
    n.colour.forEach((c, k) => expect(Math.abs(c - want[k]), name + " in " + code + "'s colour").toBeLessThan(0.02));
  }
  const after = await page.evaluate(() => window.NetScene.accords().map((A) => [A.code, window.NetScene.galaxy(A.code)]));
  after.forEach(([code, g]) => expect(g.spread, code + " in its own galaxy").toBeLessThan(0.01));
  // Each gone its own way: no two galaxies' reaches meet (in three
  // dimensions — on the window, one may stand behind another).
  const apart = after.map(([, g]) => g);
  for (let a = 0; a < apart.length; a++) for (let b = a + 1; b < apart.length; b++) {
    const d = Math.hypot(...apart[a].at.map((v, k) => v - apart[b].at[k]));
    expect(d, after[a][0] + " and " + after[b][0] + " apart").toBeGreaterThan((apart[a].r + apart[b].r) * 1.5);
  }
  // The centre: bright where it stands.
  const c = await page.evaluate(() => window.NetScene.centre());
  const seen = await look(page, [[c.x, c.y]]);
  expect(Math.min(...seen.at[0]), "the centre, white").toBeGreaterThan(120);
  // The dropdown, now, and the names beside the galaxies.
  await expect(page.locator(".net-nav")).toHaveCSS("opacity", "1");
  await expect(page.locator(".net-drop-option")).toHaveCount(accords.length + 1);
  await expect(page.locator(".net-expand")).toHaveText(/Collapse into one/i);
  expect(await page.locator(".net-name.is-on").count(), "most of the galaxies named").toBeGreaterThan(8);
  expect(errors).toEqual([]);
});

/* THE WAY BETWEEN THEM: the dropdown, the arrows either side of it, the
   keyboard, a bridge, a galaxy's name — every journey from one galaxy to
   another bending in towards the centre — and back to the centre. */
test("the centre joins every galaxy, and going from one accord to another is easy", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await open(page);
  await expandIt(page);
  const stage = page.locator(".net-stage");
  const at = (code) => expect(stage).toHaveAttribute("data-focus", code, { timeout: 20000 });
  const settled = () => expect.poll(async () => (await state(page)).flying, { timeout: 20000 }).toBe(false);
  // The dropdown.
  await page.locator(".net-drop-button").click();
  await expect(page.locator(".net-dock")).toHaveClass(/is-open/);
  await page.locator('.net-drop-option[data-to="6"]').click();
  await at("GOU");
  await expect(page.locator(".net-drop-say")).toHaveText("07 · GOU · Gourmand");
  await expect(page.locator('.net-accord[data-code="GOU"]'), "the window says where you are").toHaveClass(/is-here/);
  await settled();
  // The arrow after it — and the way there bends in towards the centre.
  let nearest = Infinity;
  await page.locator('.net-step[data-step="1"]').click();
  for (let k = 0; k < 400; k++) {
    const s = await state(page);
    nearest = Math.min(nearest, s.target);
    if (!s.flying) break;
    await page.waitForTimeout(20);
  }
  await at("BRW");
  expect(nearest, "by way of the centre").toBeLessThan(15.5 * 0.7);
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
  // Back to the centre from the dropdown, and to a galaxy by its name.
  await page.locator(".net-drop-button").click();
  await page.locator('.net-drop-option[data-to="-1"]').click();
  await at("centre");
  await settled();
  const name = page.locator(".net-name.is-on").first();
  const code = await name.locator(".net-name-code").textContent();
  await name.click();
  await at(code);
  expect(errors).toEqual([]);
});

/* COLLAPSING: back through white into the one red galaxy, and the dropdown
   goes. */
test("collapsing brings every note back into the one red galaxy", async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await open(page);
  await expandIt(page);
  await page.locator(".net-drop-button").click();
  await page.locator('.net-drop-option[data-to="3"]').click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", "FLO", { timeout: 20000 });
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "one", { timeout: 30000 });
  expect((await state(page)).focus, "back at the centre").toBe("centre");
  const v = await page.evaluate(() => window.NetScene.note("Vanilla"));
  expect(v.colour[0], "red again").toBeGreaterThan(0.85);
  expect(v.colour[1]).toBeLessThan(0.45);
  const spreads = await page.evaluate(() => window.NetScene.accords().map((A) => window.NetScene.galaxy(A.code).spread));
  spreads.forEach((s) => expect(s, "every accord back in the one galaxy").toBeGreaterThan(8));
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
  await page.mouse.move(500, 200);
  await page.mouse.down();
  await page.mouse.move(500, 700, { steps: 16 });
  await page.mouse.up();
  await page.waitForTimeout(600);
  expect((await state(page)).pitch, "tipped nearly straight over").toBeGreaterThan(1.3);
  expect(errors).toEqual([]);
});

/* SIXTY FRAMES A SECOND: every frame's own work — the drawing's and the
   page's — through the expansion, a journey and the collapse, is a small
   part of the sixtieth of a second a frame has. (What this machine's
   software drawing then takes is not the page's, and a graphics card does
   it in a moment.) */
test("every frame of every transition is quick enough for sixty a second", async ({ page }) => {
  test.setTimeout(150000);
  await open(page);
  await page.evaluate(() => window.NetScene.reset());
  await expandIt(page);
  await page.locator(".net-drop-button").click();
  await page.locator('.net-drop-option[data-to="8"]').click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", "WOO", { timeout: 20000 });
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".net-stage")).toHaveAttribute("data-focus", "BRW", { timeout: 20000 });
  await page.locator(".net-expand").click();
  await expect(page.locator(".net-stage")).toHaveAttribute("data-state", "one", { timeout: 30000 });
  const s = await page.evaluate(() => window.NetScene.stats());
  // A frame has 16.7ms at sixty a second. The page's own work is kept to a
  // few of them — here with room for a busy machine running other tests.
  expect(s.frames, "frames drawn").toBeGreaterThan(60);
  expect(s.mean, "a frame's own work, on average, in ms").toBeLessThan(4);
  expect(s.p95, "nearly every frame's").toBeLessThan(10);
  expect(s.max, "and no stall — a drawing made for the first time mid-way, say").toBeLessThan(30);
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
  test("it stands still, comes apart and travels at once, and still turns by hand", async ({ page }) => {
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
    await page.locator(".net-drop-button").click();
    await page.locator('.net-drop-option[data-to="3"]').click();
    await expect(stage, "there at once").toHaveAttribute("data-focus", "FLO", { timeout: 1000 });
    expect((await state(page)).flying).toBe(false);
    const a = (await state(page)).yaw;
    await page.mouse.move(400, 400);
    await page.mouse.down();
    await page.mouse.move(560, 420, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    expect(Math.abs((await state(page)).yaw - a), "but a drag still turns it").toBeGreaterThan(0.6);
    expect(errors).toEqual([]);
  });
});

// ============================================================
// HOUSES TEN TO TWELVE — Om Parfums, Outsider Parfums and Lost Tribe
// (2026-10-10), and the Houses view's motifs for them.
//
//   OM            opens behind CRACKED GLASS, and is read through it: it
//                 scrolls under the glass, the hexagon at the hand shows it
//                 whole and the glass cracks again as it goes, and opening
//                 a fragrance mends it for good (a key too); on a phone it
//                 comes together by itself. Never with reduced motion, an
//                 address at one fragrance, or ?om=whole. And it is quick
//                 to draw, cracked and whole (2026-10-11).
//   ITS WRITING   the owner's two dropdowns, one inside the other, and the
//                 line they asked to have drawn.
//   OUTSIDER      a door, ajar, in the left margin, the light coming
//                 through it (2026-10-11; it was Om's drawing with a twin,
//                 and its name had an echo).
//   LOST TRIBE    field notes in the margins, leaves falling quiet over the
//                 writing, flocks every few seconds, and the house's other
//                 fragrances in one line.
//   THE FEET      of all three: the fragrances not smelled yet, in one
//                 sentence.
//
// What these pages look like is checked by eye; these check they work.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const OM = "/houses/om-parfums.html";
const OUTSIDER = "/houses/outsider-parfums.html";
const TRIBE = "/houses/lost-tribe.html";
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* CRACKED WHILE READING — the owner (2026-10-11, later): "i want the
   breaking apart of the page to be reversible when you hover away ...
   like fractured glass unfracturing when hovered within the hexagon", and,
   asked how the page is read, "cracked while reading": it scrolls under the
   glass, and the glass stays. The pieces are laid over the page in a closed
   shadow root, so nothing else on the page can find them: the page's own
   writing is there once, under them, held back — and a press goes through
   the glass to it. */
test("Om opens broken and is read through it: it scrolls, and the break stays", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.goto(OM);
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  await expect(root).toHaveClass(/om-shattered/);
  await expect(page.locator(".om-shards, .om-split")).toHaveCount(1);
  // (Two halves since 2026-10-13, the split; many pieces in rings and glass.)
  expect(await page.evaluate(() => window.OmGlass.pieces()), "in pieces").toBeGreaterThanOrEqual(2);
  // The writing is the page's own, once: the copies cannot be found.
  await expect(page.locator(".human-part")).toHaveCount(9);
  await expect(page.locator("h1")).toHaveCount(1);
  // Held back under the glass — and the glass lets a press through to it.
  expect(await page.locator(".human-head").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  const hit = await page.locator(".house-return").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  });
  expect(hit, "a press goes through the glass").toBe(true);
  // It scrolls, and the glass stays cracked.
  await page.mouse.move(1300, 200);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
  await page.mouse.move(1320, 600, { steps: 6 });
  await page.waitForTimeout(500);
  await expect(root).toHaveAttribute("data-om", "pieces");
  expect(errors).toEqual([]);
});

/* THE HEXAGON SHOWS IT WHOLE — "the hexagon to be the thing that affects
   everything behind it; i want it to be larger, and everything unbreaks in
   the hexagon": the glass about the lens comes home as it comes, and cracks
   again as it goes ("reversible when you hover away"). */
test("Om's hexagon shows the page whole, and the break comes back when it leaves", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1280, height: 800 });
  // (The split has no hexagon: it is the rings', kept behind the address.)
  await page.goto(OM + "?glass=rings");
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  const homeAt = (x, y) => page.evaluate(([x, y]) => window.OmGlass.homeAt(x, y), [x, y]);
  expect(await homeAt(520, 400), "cracked before the hand comes").toBeLessThan(0.05);
  await page.mouse.move(480, 380);
  await page.mouse.move(520, 400, { steps: 6 });
  await expect.poll(() => page.evaluate(() => window.OmGlass.lens())).toBeGreaterThan(0.9);
  await expect.poll(() => homeAt(520, 400), { message: "whole in the hexagon" }).toBeGreaterThan(0.9);
  // Away to the far side: where it was is cracked again, and it is not mended.
  await page.mouse.move(1150, 700, { steps: 8 });
  await expect.poll(() => homeAt(520, 400), { message: "cracked again once it has gone" }).toBeLessThan(0.05);
  // (Where it has gone, whole — once it has got there: it follows the hand a
  // beat behind it.)
  await expect.poll(() => homeAt(1150, 700)).toBeGreaterThan(0.5);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
});

/* A FRAGRANCE OPENS UNDER THE BREAK, AND NOTHING MENDS IT (2026-10-13 —
   "whenever you click on anything, the glass gets fixed and it is buggy. fix
   that ... When you click on the perfumes, the break should not be fixed").
   Opening a fragrance mended the page for good until then, the press held
   while it did. Now it opens at once, in the page and in every piece of the
   break with it (the copies follow the page), and the page stays broken; a
   click on nothing and the hand moving over it do nothing to it either. */
test("a fragrance opened under Om's break opens at once, in the pieces too, and the page stays broken", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  // (In rings, where a fragrance is seen where it is; the split's own test,
  // below, presses it where its half shows it.)
  await page.goto(OM + "?glass=rings");
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  const part = page.locator(".human-part").first();
  await part.locator("summary").evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 300));
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const seen = (window.__omSeen = []);
    new MutationObserver(() => seen.push(document.documentElement.dataset.om)).observe(document.documentElement, { attributes: true, attributeFilter: ["data-om"] });
  });
  expect(await page.evaluate(() => window.OmGlass.openIn(0)).then((r) => r.open), "shut in the pieces to begin with").toBe(0);
  await part.locator("summary").click();
  await expect.poll(() => part.evaluate((el) => el.open), { message: "it opens", timeout: 3000 }).toBe(true);
  const copies = await page.evaluate(() => window.OmGlass.openIn(0));
  expect(copies.open, "and opens in every piece").toBe(copies.of);
  // The opening runs in the pieces as it does on the page: its writing is
  // there, at the height the page gives it, once it has opened.
  await page.waitForTimeout(900);
  await expect(root).toHaveAttribute("data-om", "pieces");
  // Shut again, shut in the pieces too.
  await part.locator("summary").click();
  await expect.poll(() => part.evaluate((el) => el.open), { timeout: 3000 }).toBe(false);
  await expect.poll(() => page.evaluate(() => window.OmGlass.openIn(0).open)).toBe(0);
  // A fold in the introduction, a click on nothing, the hand: still broken.
  await page.mouse.move(900, 300, { steps: 4 });
  await page.mouse.click(1300, 120);
  await page.waitForTimeout(400);
  await expect(root).toHaveAttribute("data-om", "pieces");
  expect(await page.evaluate(() => window.__omSeen), "never mending, never gathering").toEqual([]);
  expect(errors).toEqual([]);
});

/* THE PIECES ARE CUT FROM THE PAGE, laid out at the page's own width (the
   window's less its scrollbar — they stood 8px off it while they were laid
   out at the window's), so when they come home what was in pieces is the
   page itself, wherever it has been scrolled to. */
test("Om's pieces are laid out as the page is, and land on it exactly", async ({ page }) => {
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  expect(await page.evaluate(() => window.OmGlass.width())).toBe(await page.evaluate(() => document.body.clientWidth));
  const summary = page.locator(".human-part > summary").first();
  await summary.evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 300));
  await page.waitForTimeout(1300);
  const before = await summary.boundingBox();
  // (Mended by its button: since 2026-10-13 nothing else mends it.)
  await page.locator(".om-mend").click();
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 8000 });
  const after = await summary.boundingBox();
  expect(Math.abs(after.x - before.x)).toBeLessThan(1);
  expect(Math.abs(after.y - before.y)).toBeLessThan(1);
});

/* ONLY THE BUTTON MENDS IT (2026-10-13): not the hand moving over it, not
   a click on nothing, not a key — a key reaching into the page mended it
   until then, since a keyboard cannot hover; the button is first in the
   page's order now, so the keyboard comes to it first. */
test("Om's break is mended only by its button: not by a key, the hand or a click (in rings and glass)", async ({ page }) => {
  await page.goto(OM + "?glass=rings");
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.mouse.move(600, 400);
  await page.mouse.move(700, 450, { steps: 8 });
  await page.mouse.click(1300, 120);
  await page.keyboard.press("Tab");
  await expect(page.locator(".om-mend"), "the keyboard comes to the button first").toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(600);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
});

/* BROKEN AS GLASS BREAKS — a trial (2026-10-11, last — "just as a test (so
   keep the code from the curernt version in case i wanna revert it) but make
   the fractures differnet/ like broken glass more"): the pane is broken in a
   web from where it was struck — long wedges pointing at the blow, many of
   them meeting there — where the fine glass before it was cells of about one
   size. The fine glass is kept, and `?glass=fine` shows it. */
test("the broken pane is a web from where it was struck, and the fine glass is kept, behind the address", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const shape = async () => page.evaluate(() => {
    const all = window.OmGlass.outlines();
    // How drawn out each piece is: its longest reach, squared, over its area.
    const long = all.map((p) => {
      let a = 0, most = 0;
      p.forEach((q, i) => { const r = p[(i + 1) % p.length]; a += q[0] * r[1] - r[0] * q[1]; p.forEach((t) => { most = Math.max(most, Math.hypot(t[0] - q[0], t[1] - q[1])); }); });
      return (most * most) / Math.max(1, Math.abs(a / 2));
    }).sort((x, y) => x - y);
    // The most pieces meeting near any one corner.
    let meet = 0;
    all.forEach((p) => p.forEach((q) => {
      const n = all.filter((o) => o.some((t) => Math.hypot(t[0] - q[0], t[1] - q[1]) < 40)).length;
      meet = Math.max(meet, n);
    }));
    // (The longer pieces: a quarter of them are longer than this.)
    return { style: window.OmGlass.style(), glass: document.documentElement.dataset.glass, n: all.length, long: long[Math.floor(long.length * 0.75)], meet };
  });
  // (Since 2026-10-13 the page opens broken in rings, and the broken pane is
  // kept behind ?glass=broken, as the fine glass is behind ?glass=fine.)
  await page.goto(OM + "?glass=broken");
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  const broken = await shape();
  expect(broken.style).toBe("broken");
  expect(broken.glass).toBe("broken");
  await page.goto(OM + "?glass=fine");
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  const fine = await shape();
  expect(fine.style).toBe("fine");
  expect(fine.glass).toBe("fine");
  expect(fine.n, "the fine glass as it was").toBeGreaterThan(30);
  // (Measured: about 4.1 against 2.9, and 21 pieces against 5.)
  expect(broken.long, `wedges, not cells (${broken.long.toFixed(1)} against ${fine.long.toFixed(1)})`).toBeGreaterThan(fine.long * 1.25);
  expect(broken.meet, "many pieces meeting where it was struck").toBeGreaterThanOrEqual(12);
  expect(fine.meet, "and the fine glass's cells nowhere so").toBeLessThan(10);
});

/* THE RINGS (2026-10-13 — "make it less like glass and more so like just a
   very abstract break. Find a way to be on theme"): the page broken as a
   mandala is drawn, round โอม at the middle of the window — a disc and bands
   out from it, each cut into petals — every piece of a band turned by the
   same angle about the middle, the next band the other way, and nothing of
   glass: no glints. */
test("Om broken in rings round its middle, each band turned a little out of true (kept behind ?glass=rings)", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OM + "?glass=rings");
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  expect(await page.evaluate(() => window.OmGlass.style())).toBe("rings");
  await expect(page.locator("html")).toHaveAttribute("data-glass", "rings");
  const out = await page.evaluate(() => {
    const cx = document.body.clientWidth / 2, cy = window.innerHeight / 2;
    const all = window.OmGlass.outlines();
    // Every corner of a piece that is not on the window's edge stands on one
    // of a few circles round the middle.
    const radii = [];
    all.forEach((p) => p.forEach(([x, y]) => {
      if (x <= 1 || y <= 1 || x >= document.body.clientWidth - 1 || y >= window.innerHeight - 1) return;
      radii.push(Math.round(Math.hypot(x - cx, y - cy) / 6) * 6);
    }));
    const circles = new Set(radii);
    return { n: all.length, circles: circles.size, points: radii.length, turns: window.OmGlass.turns() };
  });
  expect(out.n, "many pieces").toBeGreaterThan(30);
  expect(out.circles, `the corners on a few circles (${out.circles} of ${out.points} points)`).toBeLessThanOrEqual(14);
  // Each band turned as one, the next the other way, by a few pixels.
  const bands = out.turns.filter((t) => t.band > 0);
  bands.forEach((t) => expect(t.spread, `band ${t.band} turned as one`).toBeLessThan(1e-9));
  for (let i = 1; i < bands.length; i++) expect(Math.sign(bands[i].deg), "each band the other way from the last").toBe(-Math.sign(bands[i - 1].deg));
  bands.forEach((t) => expect(Math.abs(t.px), `band ${t.band} a few pixels out of true at its middle`).toBeLessThan(3.5));
  expect(read("om.js"), "no glints on the rings").toMatch(/glint: !rings &&/);
});

/* THE SPLIT — a trial (2026-10-13 — "i want you to change the breaking
   thing entirely (at least as a test) ... the page itself is split into two
   ... run a line down the center, then take everything on the left and push
   it further left, and everything on the right of the line and push it
   further right, creating an empty space in the middle ... a button ...
   saying "OM", which if clicked, will with a shaky animation converge the two
   sides of the page into one. the middle should be themed of breaks ...
   random polygons of broken stuff ... when you converge the two sides with
   the buttons, the breaks will kind of disappear behind it. as faded behind
   text."), and the same night: "widen the gap by a lot; i want it to be the
   majority ... make the shaking at the end of the transition ... make the
   transition involve the background. I want it as smooth as possible." Two
   halves pushed apart, the gap between them most of the window, the drawing
   behind split with them; OM in the gap, broken pieces lying in it; a
   fragrance pressed where its half shows it opens, a press in the gap does
   nothing; OM brings the halves together — the drawing in step with the
   writing, gliding, and shaking only as they meet — the pieces left faint
   behind the writing. The rings and the glass are kept behind ?glass=. */
test("Om opens split in two, the gap the most of it, OM in it; a fragrance opens where it is seen, and OM brings it together, shaking as it meets", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OM);
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  await expect(root).toHaveAttribute("data-glass", "split");
  expect(await page.evaluate(() => window.OmGlass.style())).toBe("split");
  const split = () => page.evaluate(() => window.OmGlass.split());
  await expect.poll(async () => (await split()).offsets[0]).toBeLessThan(-50);
  const at = await split();
  const w = await page.evaluate(() => document.body.clientWidth), cx = w / 2;
  expect(at.offsets, "two halves").toHaveLength(2);
  expect(at.push * 2, "the gap the most of the page").toBeGreaterThan(w / 2);
  expect(at.offsets[0], "the left half further left").toBeCloseTo(-at.push, 0);
  expect(at.offsets[1], "the right half further right").toBeCloseTo(at.push, 0);
  expect(at.pieces, "broken pieces lying in the gap").toBeGreaterThan(40);
  expect(at.alpha).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth), "nothing widening the page").toBeLessThanOrEqual(1440);
  // The drawing behind is split with the page: its halves pushed as far.
  const sky = () => page.evaluate(() => [...document.querySelectorAll(".om-sky-half")].map((el) => new DOMMatrix(getComputedStyle(el).transform).m41));
  const skyAt = await sky();
  expect(skyAt[0], "the drawing's left half with the page's").toBeCloseTo(at.offsets[0], 0);
  expect(skyAt[1], "the drawing's right half with the page's").toBeCloseTo(at.offsets[1], 0);
  // OM in the middle of the gap, in place of the button in the top right.
  const om = page.locator(".om-mend");
  await expect(om).toHaveCount(1);
  await expect(om).toHaveText("OM");
  await expect(om).toHaveCSS("opacity", "1");
  const ob = await om.boundingBox();
  expect(Math.abs(ob.x + ob.width / 2 - cx), "in the middle").toBeLessThan(2);
  expect(ob.width, "inside the gap").toBeLessThan(at.push * 2);
  // A press in the gap does nothing; a fragrance pressed where its half
  // shows it — a push further left than it is on the page — opens.
  const part = page.locator(".human-part").first();
  await part.locator("summary").evaluate((el) => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 300));
  await page.waitForTimeout(300);
  const sb = await part.locator("summary").boundingBox();
  // (The left half shows the page from a push in to its middle.)
  const y = sb.y + sb.height / 2, real = cx - 30;
  expect(real > at.push && real > sb.x && real < sb.x + sb.width, "(on the left half, on the fragrance)").toBe(true);
  await page.mouse.click(cx, y);
  await page.waitForTimeout(500);
  expect(await part.evaluate((el) => el.open), "nothing from the gap").toBe(false);
  await page.mouse.click(real + at.offsets[0], y);
  await expect.poll(() => part.evaluate((el) => el.open), { message: "it opens where it is seen", timeout: 3000 }).toBe(true);
  const copies = await page.evaluate(() => window.OmGlass.openIn(0));
  expect(copies.open, "and in both halves").toBe(copies.of);
  await expect(root).toHaveAttribute("data-om", "pieces");
  // OM: the halves come together, the drawing's with the page's, gliding
  // until the very end of the way, shaking as they meet, and are one.
  const track = page.evaluate(() => new Promise((done) => {
    const out = [], t0 = performance.now(), skyL = document.querySelector(".om-sky-half.l");
    (function f(now) {
      const s = window.OmGlass.split();
      if (s && s.offsets.length) out.push([now, s.offsets[0], new DOMMatrix(getComputedStyle(skyL).transform).m41]);
      if (performance.now() - t0 < 4000 && document.documentElement.dataset.om !== "whole") requestAnimationFrame(f); else done(out);
    })(t0);
  }));
  await om.click();
  const rows = await track;
  const off = rows.findIndex((r) => r[1] > -at.push + 0.5);
  expect(off, "it set off").toBeGreaterThanOrEqual(0);
  const from = rows[Math.max(0, off - 1)][0];
  let turns = 0, firstTurn = -1, last = 0, apart = 0;
  for (let i = Math.max(1, off); i < rows.length; i++) {
    apart = Math.max(apart, Math.abs(rows[i][1] - rows[i][2]));
    const d = rows[i][1] - rows[i - 1][1];
    if (Math.abs(d) < 0.05) continue;
    if (last && Math.sign(d) !== Math.sign(last)) { turns++; if (firstTurn < 0) firstTurn = rows[i][0] - from; }
    last = d;
  }
  expect(apart, "the drawing in step with the writing (px)").toBeLessThan(1.5);
  expect(turns, `shaking (${rows.length} frames)`).toBeGreaterThanOrEqual(2);
  expect(firstTurn, "only once they have nearly met: gliding until then (ms)").toBeGreaterThan(1200);
  await expect(root).toHaveAttribute("data-om", "whole", { timeout: 6000 });
  await expect(om).toHaveCount(0, { timeout: 3000 });
  await expect(page.locator(".om-split-sky"), "the drawing the page's own again").toHaveCount(0);
  expect(await part.evaluate((el) => el.open), "the fragrance still open").toBe(true);
  // The broken pieces left faint, behind the writing.
  await expect.poll(async () => (await split()).alpha).toBeLessThan(0.3);
  expect((await split()).alpha).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

/* ONLY OM BRINGS THE SPLIT TOGETHER — "pressing keyboard buttons stops the
   split; so remove that": the keyboard came to OM first, and Enter or Space
   pressed it; and a window changing size (a page zoomed with a key, a
   phone's bar coming and going) brought it together at once. Now OM is no
   stop of the keyboard's, a key on it does nothing, and a change of size
   lays the halves out again. */
test("Om's split is brought together by nothing but a press on OM: no key, no change of size", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OM);
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement.classList.contains("om-join")), "OM is not a stop of the keyboard's").toBe(false);
  for (const k of ["Space", "ArrowDown", "PageDown", "Home", "Escape", "a"]) await page.keyboard.press(k);
  await page.locator(".om-join").focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
  await expect(root, "no key brings it together").toHaveAttribute("data-om", "pieces");
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1200, height: 700 });
  await page.waitForTimeout(400);
  await expect(root, "nor a change of size").toHaveAttribute("data-om", "pieces");
  const at = await page.evaluate(() => window.OmGlass.split());
  const w = await page.evaluate(() => document.body.clientWidth);
  expect(at.push, "laid out again at the new width").toBe(Math.round(w * 0.3));
  expect(at.offsets[0]).toBeCloseTo(-at.push, 0);
  const ob = await page.locator(".om-join").boundingBox();
  expect(Math.abs(ob.x + ob.width / 2 - w / 2), "OM in the middle again").toBeLessThan(2);
});

/* THE BUTTON IN THE TOP RIGHT (2026-10-11, last — "put a button on the top
   right to fix the page"): over the glass, which takes no press, it mends the
   page for good, and goes. Reached by the keyboard it does not mend the page
   by itself — it says what it does — and pressed, it does it. */
test("Om's button in the top right mends the break for good (in rings and glass)", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OM + "?glass=rings");
  const root = page.locator("html");
  await expect(root).toHaveAttribute("data-om", "pieces");
  const button = page.locator(".om-mend");
  await expect(button).toHaveCount(1);
  await expect(button).toHaveText(/Mend the break/i);
  await expect(button).toHaveCSS("opacity", "1");
  const box = await button.boundingBox();
  expect(box.x + box.width, "at the right").toBeGreaterThan(1440 - 60);
  expect(box.y, "at the top").toBeLessThan(40);
  const onTop = await button.evaluate((el) => { const r = el.getBoundingClientRect(); return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)); });
  expect(onTop, "pressable over the glass").toBe(true);
  // Reached by the keyboard, it waits to be pressed.
  await button.focus();
  await page.waitForTimeout(400);
  await expect(root).toHaveAttribute("data-om", "pieces");
  await page.keyboard.press("Enter");
  await expect(root).toHaveAttribute("data-om", "gathering");
  await expect(root).toHaveAttribute("data-om", "whole", { timeout: 6000 });
  await expect(page.locator(".om-shards")).toHaveCount(0, { timeout: 3000 });
  await expect(button).toHaveCount(0, { timeout: 3000 });
  expect(errors).toEqual([]);
});

/* QUICK TO DRAW — "please smooth the om parfums page out, it slows down the
   laptop A LOT!" (2026-10-11): it was the drawing's quiet over the column,
   painted over every finished frame (16 frames a second on this machine).
   And since the page is read cracked: nothing in the glass is a layer of
   its own but the glints — fifty pieces cut to their shapes on layers of
   their own held it at a quarter of the whole page's frames. */
test("Om is quick to draw, cracked and whole", async ({ page }) => {
  test.setTimeout(60000);
  const src = read("om.js");
  expect(src, "no mask painted over the frame").not.toContain("destination-in");
  expect(src, "no piece on a layer of its own").not.toMatch(/translate3d|\.shard\{[^}]*will-change|\.om-flow\{[^}]*will-change/);
  await page.setViewportSize({ width: 1440, height: 900 });
  const fps = () => page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); (function f() { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(n / 2); })(); }));
  await page.goto(OM);
  await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
  await page.waitForTimeout(1500);
  expect(await fps(), "frames a second, cracked").toBeGreaterThan(24);
  await page.goto(OM + "?om=whole");
  await page.waitForTimeout(1500);
  expect(await fps(), "frames a second, whole").toBeGreaterThan(30);
});

/* ON A PHONE IT COMES TOGETHER BY ITSELF — "I dont want it to be on click
   fragmentation, but rather something that happens automatically given a
   slight delay on the page itself." */
test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  /* "on the phone it acts weird so fix that": the halves were laid over the
     window and moved under the finger a frame behind it, and the bar coming
     and going as the page was scrolled changed the window's size, which
     brought it together at once. The halves are in the page now. */
  test("Om's split on a phone: it scrolls with the page, waits for OM through the bar coming and going, and nothing scrolls sideways", async ({ page }) => {
    await page.goto(OM);
    const root = page.locator("html");
    await expect(root).toHaveAttribute("data-glass", "split");
    await expect(root).toHaveAttribute("data-om", "pieces");
    await page.waitForTimeout(2400);
    await expect(root, "still split well after a moment").toHaveAttribute("data-om", "pieces");
    // The halves are in the page: scrolled, a half is where the page is at once.
    const step = await page.evaluate(() => {
      const box = () => document.querySelector(".om-split").getBoundingClientRect().top;
      const before = box();
      window.scrollBy(0, 600);
      return { moved: before - box(), by: window.scrollY };
    });
    expect(step.moved, "the halves moved with the page, at once").toBeCloseTo(step.by, 0);
    // The bar coming and going.
    await page.setViewportSize({ width: 390, height: 760 });
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await expect(root, "still split as the bar comes and goes").toHaveAttribute("data-om", "pieces");
    const om = await page.locator(".om-join").boundingBox();
    const menu = await page.locator(".menu-trigger").boundingBox();
    expect(om.y > menu.y + menu.height + 8 || om.x > menu.x + menu.width + 8, "clear of the Menu").toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.locator(".om-join").tap();
    await expect(root).toHaveAttribute("data-om", "whole", { timeout: 9000 });
  });
  test("Om's pieces come together by themselves, after a moment (in rings and glass)", async ({ page }) => {
    await page.goto(OM + "?glass=rings");
    await expect(page.locator("html")).toHaveAttribute("data-om", "pieces");
    await page.waitForTimeout(600);
    await expect(page.locator("html"), "still in pieces a moment in").toHaveAttribute("data-om", "pieces");
    // The button in the top right, clear of the Menu.
    const mend = await page.locator(".om-mend").boundingBox();
    const menu = await page.locator(".menu-trigger").boundingBox();
    expect(mend.x + mend.width).toBeLessThanOrEqual(390);
    expect(mend.x, "clear of the Menu").toBeGreaterThan(menu.x + menu.width + 8);
    await expect(page.locator("html")).toHaveAttribute("data-om", "whole", { timeout: 9000 });
    await expect(page.locator(".om-mend"), "and gone once it is whole").toHaveCount(0, { timeout: 3000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });
});

/* NEVER IN PIECES with reduced motion, at an address that points at one
   fragrance, or with ?om=whole — and without its script the page is whole. */
test("Om is whole at once with reduced motion, at one fragrance, or without its script", async ({ browser }) => {
  const still = await browser.newContext({ reducedMotion: "reduce" });
  let page = await still.newPage();
  await serveDependenciesLocally(page);
  await page.goto(OM);
  await expect(page.locator(".om-shards, .om-split")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  await still.close();

  const ctx = await browser.newContext();
  page = await ctx.newPage();
  await serveDependenciesLocally(page);
  await page.goto(OM + "#part-03");
  await expect(page.locator("html")).toHaveAttribute("data-om", "whole");
  await expect(page.locator(".om-shards, .om-split")).toHaveCount(0);
  await page.goto(OM + "?om=whole");
  await expect(page.locator(".om-shards, .om-split")).toHaveCount(0);
  await expect(page.locator(".om-mend"), "nothing to mend").toHaveCount(0);
  await page.route("**/om.js*", (r) => r.abort());
  await page.goto(OM);
  await page.waitForLoadState("load");
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  await expect(page.locator(".human-head")).toHaveCSS("opacity", "1", { timeout: 4000 });
  await ctx.close();
});

/* โอม FROM A REAL THAI TYPEFACE — "a sylized vbersion of this symbol
   "โอม"": its three letters' outlines, and each letter's head. */
test("the โอม Om is drawn from is the three letters, from a real Thai typeface", () => {
  const src = read("om-glyph.js");
  const data = JSON.parse(src.slice(src.indexOf("{"), src.lastIndexOf("}") + 1));
  expect(data.word).toBe("โอม");
  expect(data.letters.map((l) => l.ch)).toEqual(["โ", "อ", "ม"]);
  data.letters.forEach((l) => {
    expect(l.contours.length, l.ch + " has its outline").toBeGreaterThan(0);
    expect(l.heads.length, l.ch + " has its head").toBeGreaterThan(0);
  });
  expect(read("tools/om/glyph.py")).toContain("Loma");
});

/* THE OWNER'S DROPDOWNS: "make the following a collapse-able text that if
   you click it, then you reveal it", with "a sub-drop down window titled My
   Interpretation of Atman and Brahman" inside it, and the line drawn
   between the found and the fifth point. Shut to begin with, and opened on
   a measured height. */
test("Om's introduction carries the owner's dropdown, a second inside it, and the line", async ({ page }) => {
  await page.goto(OM + "?om=whole");
  const outer = page.locator(".human-intro > .human-text > .human-fold");
  await expect(outer).toHaveCount(1);
  await expect(outer.locator(":scope > summary")).toHaveText("What I found");
  const inner = outer.locator(":scope > .human-fold-text > .human-fold");
  await expect(inner).toHaveCount(1);
  await expect(inner.locator(":scope > summary")).toHaveText("My Interpretation of Atman and Brahman");
  await expect(outer).not.toHaveAttribute("open", /.*/);
  await expect(outer.locator("hr.human-rule")).toHaveCount(1);
  await expect(outer.locator("ol.human-list")).toHaveAttribute("start", "5");
  // Its writing is the owner's, in its place: the "kind" passage in the
  // inner one, the font in the outer, after the line.
  await expect(inner).toContainText("the word “kind” can only transmit so much of the meaning");
  await expect(outer.locator(":scope > .human-fold-text > p").last()).toContainText("0/10, nearly had a stroke.");
  await outer.locator(":scope > summary").click();
  await page.waitForTimeout(1000);
  await expect(outer).toHaveAttribute("open", /.*/);
  await expect(inner).not.toHaveAttribute("open", /.*/);
  await inner.locator(":scope > summary").click();
  await page.waitForTimeout(1000);
  await expect(inner).toHaveAttribute("open", /.*/);
  expect(await inner.locator(":scope > .human-fold-text").evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThan(100);
  // The four reasons stand as a list before it, numbered by the page.
  await expect(page.locator(".human-intro > .human-text > ol.human-list > li")).toHaveCount(4);
});

/* THE OWNER'S WORDS, with only the misspellings they agreed to have put
   right, and the repeat in Xocolate Crotch dropped. */
test("the three houses carry the owner's writing, its clear misspellings put right", async ({ page }) => {
  const om = read("houses/om-parfums.html"), out = read("houses/outsider-parfums.html"), tribe = read("houses/lost-tribe.html");
  expect(om).toContain("has banana and tomato leaf accords");
  expect(om).toContain("the traces of life of the plants and animals alike");
  expect(om).toContain("an honorable attribute");
  expect(om).toContain("way way WAY more nuanced than anything here gives them credit for");
  expect(out).toContain("a dessert plate from which the dessert was eaten");
  expect(out).toContain("peeks its head through");
  expect(out).toContain("order two completely separate things");
  expect(out).toContain('lang="ar" dir="rtl"');
  expect(tribe).toContain("Starts super abrasive");
  expect(tribe).toContain("Resin, vanilla, A LOT OF AROMATICS");
  expect(tribe).toContain("I have not had the chance to actually smell");
  // "Mid" repeated the first half of "Mid-Dry Down 1" word for word.
  await page.goto(OUTSIDER);
  const stages = await page.locator("#part-03 .human-stage").allTextContents();
  expect(stages).toEqual(["Top", "Mid-Dry Down 1", "Dry Down 2"]);
  expect((out.match(/In the late top notes; it started turning more realistic/g) || []).length).toBe(1);
});

/* OUTSIDER: A DOOR, AJAR, WITH A LIGHT — the owner, 2026-10-11: "remove the
   merginig motifs and I want you to add a door that is slightly ajar, with a
   small ught coming from that door. that is to be the main motif; similarly
   to les abstraits closet. follow the same theme when you enter the house
   part too". Its own script, never Om's; no pieces, no twin, no echo; the
   door drawn in the left margin, and the house's green coming through it. */
test("Outsider is a door standing ajar in the left margin, the light coming through it, and nothing merging", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OUTSIDER);
  await expect(page.locator('script[src^="../outsider.js"]')).toHaveCount(1);
  await expect(page.locator('script[src^="../om.js"]')).toHaveCount(0);
  await expect(page.locator(".om-shards, .om-split")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/om-shattered/);
  expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).animationName), "no echo on the name").toBe("none");
  expect(read("style.css")).not.toContain("outsider-echo");
  // Built, and its light come up.
  await page.waitForTimeout(4200);
  const seen = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const k = c.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data;
    const margin = (innerWidth - 940) / 2;
    let left = 0, right = 0, green = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      if (d[i + 3] < 30) continue;
      if (x / k < margin + 20) { left++; if (d[i + 1] > d[i] + 25 && d[i + 1] > d[i + 2] + 10) green++; }
      else if (x / k > innerWidth - margin) right++;
    }
    return { left, right, green };
  });
  expect(seen.left, "the door, on the left").toBeGreaterThan(1500);
  expect(seen.green, "its green light").toBeGreaterThan(200);
  expect(seen.right, "and nothing standing on the right").toBeLessThan(seen.left / 20);
  expect(errors).toEqual([]);
});

/* THE DOOR OPENS AS THE PAGE IS READ — "less open and opens more when you
   scroll (but not entirely)" (2026-10-11, later): ajar a little at the top
   of the page, wider as it is scrolled down, never all the way. */
test("Outsider's door is a little open at the top, opens wider as the page is scrolled, and never all the way", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(OUTSIDER);
  const field = page.locator(".human-field");
  await expect.poll(() => field.getAttribute("data-open").then(Number)).toBeGreaterThan(0.1);
  const top = Number(await field.getAttribute("data-open"));
  expect(top, "a little open at the top").toBeLessThan(0.2);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => field.getAttribute("data-open").then(Number), { timeout: 8000 }).toBeGreaterThan(0.55);
  await page.waitForTimeout(1500);
  expect(Number(await field.getAttribute("data-open")), "never all the way").toBeLessThan(0.66);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => field.getAttribute("data-open").then(Number), { timeout: 8000 }).toBeLessThan(0.2);
});

/* LOST TRIBE'S FIELD NOTES: the house's own stag and the creatures and
   ingredients of its six, down the margins, drawn in the house's colours;
   and its other fragrances "separated by a comma in a single line". */
test("Lost Tribe draws its field notes in the margins, and lists the rest on one line, in a dropdown", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TRIBE);
  await page.waitForTimeout(2600);
  const margins = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const k = c.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data;
    let left = 0, right = 0;
    for (let y = 0; y < c.height; y += 3) for (let x = 0; x < c.width; x += 3) {
      if (d[(y * c.width + x) * 4 + 3] < 40) continue;
      if (x / k < 250) left++; else if (x / k > innerWidth - 250) right++;
    }
    return { left, right };
  });
  expect(margins.right, "the stag, at the head on the right").toBeGreaterThan(80);
  const after = page.locator(".human-after").first();
  await expect(after.locator("ul, ol, li")).toHaveCount(0);
  const line = await after.locator("p.human-unsmelled").textContent();
  const names = line.split(",").map((s) => s.trim());
  expect(names.length).toBeGreaterThan(40);
  ["Kong", "Watch King", "Pan’s Labyrinth", "Dirty Soda", "Equatorial", "Santal Absolu"].forEach((n) => expect(names, n + " has been smelled").not.toContain(n));
  await expect(after.locator(".human-unsmelled-from a").first()).toHaveAttribute("href", "https://losttribeperfumes.com/");
  // The ten found on 2026-10-11, in their places.
  ["Blu", "Dubai", "Easter Egg", "Electric Bloom", "Lola’s Lemonana", "Parc Florale", "Prince of Persia", "Red YaYo (Rose Edition)", "Sunny Nights", "The Hamptons"]
    .forEach((n) => expect(names, n).toContain(n));
  // IN A DROPDOWN (2026-10-11, later — "make image 1 a dropdown list"): the
  // line stands in a fold, shut until it is opened, its count beside its
  // name the number of names in it.
  const fold = after.locator("details.human-fold.human-unsmelled-fold");
  await expect(fold).toHaveCount(1);
  expect(await fold.evaluate((d) => d.open), "shut at first").toBe(false);
  await expect(fold.locator("p.human-unsmelled")).toBeHidden();
  await expect(fold.locator(".human-fold-count")).toHaveText(String(names.length));
  await fold.locator("summary").click();
  await expect(fold.locator("p.human-unsmelled")).toBeVisible();
  // Equatorial's picture, uploaded after the others, in its part and its square.
  await expect(page.locator("#part-05 .human-plate img")).toHaveAttribute("src", /Equatorial\.webp$/);
  await expect(page.locator("#part-05 .human-thumb img")).toHaveAttribute("src", /Equatorial\.webp$/);
  expect(await page.locator("#part-05 .human-plate img").evaluate((i) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(errors).toEqual([]);
});

/* THE LEAVES ON THE PAGE, QUIET OVER THE WRITING, AND MORE BIRDS — "i want
   the falling leaves to exist on the actual page too. when they fall behind
   the text, let them be de-emphasized; similarly to ataraxia's beams of
   light. make the birds more frequent in lost tribes page too" (2026-10-11).
   Over the writing nothing is drawn strongly; in the margins the leaves and
   the specimens are; and flocks set off every few seconds. */
test("Lost Tribe's leaves fall on the page, faint over the writing, and its flocks come every few seconds", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TRIBE);
  const field = page.locator(".human-field");
  await expect.poll(async () => +(await field.getAttribute("data-leaves")), { timeout: 5000 }).toBeGreaterThanOrEqual(10);
  await page.waitForTimeout(9000);
  expect(+(await field.getAttribute("data-flocks")), "flocks in nine seconds").toBeGreaterThanOrEqual(2);
  const most = await page.evaluate(() => {
    const c = document.querySelector(".human-field"), g = c.getContext("2d");
    const k = c.width / innerWidth, d = g.getImageData(0, 0, c.width, c.height).data;
    const margin = (innerWidth - 940) / 2;
    let column = 0, side = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const a = d[(y * c.width + x) * 4 + 3], at = x / k;
      if (at > margin + 70 && at < innerWidth - margin - 70) column = Math.max(column, a); else side = Math.max(side, a);
    }
    return { column, side };
  });
  expect(most.column, "over the writing, quiet").toBeLessThan(110);
  expect(most.side, "in the margins, plain").toBeGreaterThan(150);
});

/* WHAT HAS NOT BEEN SMELLED YET, at the foot of each — "at the bottom of
   each of these three houses ... find the fragrances NOT smelled, and then
   add them in a sentence" (2026-10-11): Om's and Outsider's in one sentence
   under the last word, each saying where it was read; Lost Tribe's line. */
test("Om and Outsider say at their foot, in one sentence, what has not been smelled yet", async ({ page }) => {
  for (const [url, smelled, some] of [
    [OM + "?om=whole", ["Nymphaea Caerulea", "Lust", "Burnana", "Cannabis Café", "Dark Night of the Soul", "This Too Shall Pass", "When the Linden Blooms", "Oud de Pasión", "Smoke Oud"], ["Aftermath", "Memento Mori", "Wrath"]],
    [OUTSIDER, ["Dragon’s Breath", "Draco", "Xocolate Crotch", "Guilty as Charged", "Amaretto Coffee"], ["Bananaccino", "Sweet Tooth"]],
  ]) {
    await page.goto(url);
    const line = page.locator(".human-unsmelled-block p.human-unsmelled");
    await expect(line).toHaveCount(1);
    const text = (await line.textContent()).trim();
    expect(text.startsWith("Not smelled yet: "), url).toBe(true);
    expect(text.endsWith("."), "one sentence").toBe(true);
    some.forEach((n) => expect(text, n).toContain(n));
    smelled.forEach((n) => expect(text, n + " has been smelled").not.toContain(n));
    await expect(page.locator(".human-unsmelled-block .human-unsmelled-from a").first()).toHaveAttribute("href", /^https:\/\//);
    // It stands after the last word, inside the page's main.
    expect(await page.evaluate(() => document.querySelector("main .human-after + .human-unsmelled-block") !== null)).toBe(true);
  }
});

/* THE HOUSE'S PICTURE, CROPPED — "MAKE SURE THE IMAGE IS CROPPED
   ACCORDINGLY FOR THE LOST TRIBES HOUSE IMAGE": the copy the Houses view
   shows is the frame's own shape, so nothing of the mark is cut by it. */
test("Lost Tribe's picture on the Houses view is cropped to its frame", async ({ page }) => {
  await page.goto("/scent-descriptions/");
  const img = page.locator('.sheet-frame[href="../houses/lost-tribe.html"] img');
  await expect(img).toHaveAttribute("src", "../images/Lost Tribe/house-web/lost-tribe-house.webp");
  const size = await img.evaluate((el) => new Promise((done) => {
    const check = () => (el.naturalWidth ? done([el.naturalWidth, el.naturalHeight]) : setTimeout(check, 50));
    check();
  }));
  expect(Math.abs(size[0] / size[1] - 0.86)).toBeLessThan(0.01);
});

/* THE HOVER ANIMATIONS, "related to the animations on the pages of the
   fragrances themselves": Om's grand figure merging out of its pieces and its
   rings merging into one ("less random polygons ... more of the idea of
   grand stuff and merging", 2026-10-11); Outsider's door; Lost Tribe's
   flock, leaves and pollen. The loose shards, and Outsider's mark and its
   twin (its merging motifs), are gone from the code. */
test("the loose shards and Outsider's merging motifs are gone", () => {
  const src = read("motifs.js");
  ["function shard(", "outsiderMark", "outsiderRing", "function omMerge("].forEach((w) => expect(src, w).not.toContain(w));
});

/* OM'S RINGS, THE MOTIF (2026-10-11, later — "lets focus on the two circles
   that converge together while rotating in 3D; i want you to make copies of
   those and focus on that. make the circles unique every time thet
   generate"): several standing at once, each of two or three circles, and
   no two drawn alike. */
test("Om's rings on the Houses view are several at once, and each drawn its own way", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-10");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect.poll(() => page.evaluate(() => window.HouseMotifs.rings().length), { timeout: 20000 }).toBeGreaterThanOrEqual(3);
  const rings = await page.evaluate(() => window.HouseMotifs.rings());
  rings.forEach((r) => expect(r.length, "two or three circles to each").toBeGreaterThanOrEqual(2));
  const look = (st) => JSON.stringify([st.line, st.ticks, st.beads, st.double > 0, st.cardinals, st.gold, Math.round(st.width * 10)]);
  const all = rings.flat().map(look);
  expect(new Set(all).size, `no two circles drawn alike: ${all.join(" ")}`).toBe(all.length);
});
/* OUTSIDER'S DOOR AND WINDOW ON THE HOUSES VIEW, under one light (2026-10-12
   — "please make the door less animated, more sobtle and do something
   similar maybe with a window on the right side of the page. make sure that
   the light sources agree with one another"; the day before, "ignore the
   making the darkening of the page for outsider, make it white"): nothing
   is darkened — the motifs' canvas has no ground of its own, the words stay
   ink; the door is let open slowly to rest a little ajar and never swings
   past it; a window stands high on the right of the same wall, clear of the
   way round; the house's green comes through the door's gap and the
   window's panes alike, and falls through both at one slant, from one
   light; and the frames are in ink. */
test("Outsider's door and window on the Houses view stand on white, the door easing open, one light through both", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-11");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect.poll(() => page.evaluate(() => window.HouseMotifs.doors().length), { timeout: 20000 }).toBe(1);
  // THE DOOR, let open slowly: rising to rest and never past it.
  let most = 0, last = 0, rest = 0, fell = 0;
  for (let i = 0; i < 50; i++) {
    const d = await page.evaluate(() => window.HouseMotifs.doors()[0]);
    if (d) {
      rest = d.rest;
      if (d.angle < last - 0.004) fell++;
      most = Math.max(most, d.angle);
      last = d.angle;
    }
    await page.waitForTimeout(150);
  }
  expect(last, "it came to rest a little ajar").toBeGreaterThan(rest * 0.85);
  expect(most, "and never swung past where it rests").toBeLessThan(rest + 0.02);
  expect(fell, "nor back").toBe(0);
  // NOTHING DARKENED: no ground on the motifs' canvas, the Menu in ink, the
  // stage not dark for the cursor, and no class left for a dark view.
  const ground = await page.locator(".sheet-motifs").evaluate((c) => getComputedStyle(c).backgroundColor);
  expect(ground, "the motifs lay no ground of their own").toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  const menu = await page.locator(".menu-trigger").evaluate((m) => getComputedStyle(m).color);
  expect(menu.match(/\d+/g).slice(0, 3).map(Number).every((v) => v < 80), "the Menu in ink: " + menu).toBe(true);
  expect(await page.locator(".sheet-stage.dark-surface, body.sheet-night").count()).toBe(0);
  // THE WINDOW, high on the right, clear of the way round.
  const d = await page.evaluate(() => window.HouseMotifs.doors()[0]);
  const nav = await page.locator(".sheet-nav").boundingBox();
  expect(d.window, "a window").not.toBeNull();
  expect(d.window.left, "on the right").toBeGreaterThan(1440 * 0.6);
  expect(d.window.right, "clear of the way round").toBeLessThan(nav.x);
  expect(d.window.bottom, "high in the wall").toBeLessThan(900 * 0.5);
  // ONE LIGHT: falling through the door and the window at one slant.
  expect(Math.abs(d.slant.door - d.slant.window), `one slant (${d.slant.door.toFixed(1)}° and ${d.slant.window.toFixed(1)}°)`).toBeLessThan(4);
  // The house's green through the door, on the left, and through the
  // window, in its box; between them, across the middle of the room, none —
  // and the frames in ink.
  const light = await page.locator(".sheet-motifs").evaluate((c, w) => {
    const k = c.width / innerWidth, px = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let door = 0, win = 0, middle = 0, inked = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const i = (y * c.width + x) * 4;
      if (px[i + 3] < 40) continue;
      if (px[i] < 90 && px[i + 1] < 90 && px[i + 2] < 90) inked++;
      const green = px[i + 1] > px[i] + 25 && px[i + 1] > px[i + 2] + 12;
      if (!green) continue;
      const X = x / k, Y = y / k;
      if (X < innerWidth * 0.3) door++;
      else if (X > w.left && X < w.right && Y > w.top && Y < w.bottom) win++;
      else if (X > innerWidth * 0.35 && X < innerWidth * 0.6) middle++;
    }
    return { door, win, middle, inked };
  }, d.window);
  expect(light.door, "green through the door's gap and on the floor").toBeGreaterThan(300);
  expect(light.win, "and through the window").toBeGreaterThan(300);
  expect(light.middle, "and none across the middle of the room").toBeLessThan(light.door / 20);
  expect(light.inked, "the door, the window and their frames drawn in ink").toBeGreaterThan(200);
  expect(errors).toEqual([]);
});

/* LOST TRIBE'S BIRDS ON THE HOUSES VIEW, flown as on the house's own page
   (2026-10-11, later — "why when you click the birds they disappear and
   restart? dont do that? animate them the same way as inside the page
   please"). A press on the page, away from any house, lets nothing go — it
   counted as a drag, which let the house at the front go and started its
   motifs again — and the birds turn from the hand, flapping faster. */
test("Lost Tribe's birds on the Houses view stay when the page is pressed, and scatter from the hand", async ({ page }) => {
  test.setTimeout(90000);
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/scent-descriptions/#house-12");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  const inView = () => page.evaluate(() => window.HouseMotifs.flocks().flat().filter((b) => b.x > 160 && b.x < innerWidth - 160 && b.y > 80 && b.y < innerHeight - 80));
  await expect.poll(async () => (await inView()).length, { timeout: 40000 }).toBeGreaterThan(2);
  await page.mouse.move(40, 870);
  await page.mouse.down();
  await page.waitForTimeout(160);           // a press held as long as a hand holds one
  await page.mouse.up();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.getElementById("sheet").classList.contains("musing")), "the house at the front is still rested on").toBe(true);
  expect((await page.evaluate(() => window.HouseMotifs.census())).flock || 0, "and its birds are still flying").toBeGreaterThan(0);
  // The hand among them: they turn from it, flapping faster. (Away from
  // the hand, in the corner, they flap at their own pace.)
  const birds = (await inView()).filter((b) => Math.hypot(b.x - 40, b.y - 870) > 220);
  expect(birds.every((b) => b.rate <= 10.5), "flapping at their own pace").toBe(true);
  // A bird is quick, and a busy machine slow to move the hand: the hand is
  // put where one is now, until one is near enough to turn.
  await expect.poll(async () => {
    const bs = await inView();
    if (!bs.length) return false;
    await page.mouse.move(bs[0].x + Math.sign(bs[0].vx) * 30, bs[0].y);
    await page.waitForTimeout(120);
    return (await page.evaluate(() => window.HouseMotifs.flocks().flat())).some((o) => o.rate > 11);
  }, { timeout: 30000, message: "the near ones flap faster, turning away" }).toBe(true);
  expect(errors).toEqual([]);
});
for (const [no, kinds] of [["10", ["omRing"]], ["11", ["door"]], ["12", ["flock", "leafFall", "pollenRise"]]]) {
  test(`the Houses view's motifs come up for house ${no} at the front`, async ({ page }) => {
    test.setTimeout(60000);
    const errors = collectPageErrors(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/scent-descriptions/#house-" + no);
    await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
    await expect(page.locator("#sheet")).toHaveAttribute("data-front", String(+no));
    await expect.poll(() => page.evaluate(() => Object.keys(window.HouseMotifs.census())), { timeout: 15000 })
      .toEqual(expect.arrayContaining(kinds.slice(0, 1)));
    await page.waitForTimeout(3000);
    const seen = await page.evaluate(() => Object.keys(window.HouseMotifs.census()));
    kinds.forEach((k) => expect(seen, k).toContain(k));
    expect(errors).toEqual([]);
  });
}

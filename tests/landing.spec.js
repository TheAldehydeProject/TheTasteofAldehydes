// ============================================================
// THE LANDING PAGE
//
// index.html is four full-screen panels ("slides") that you move
// between with the wheel, the arrow keys, or the Scroll button: the
// title, the formula (2026-09-30), the sentence and the map.
// The moving is hand-written rather than left to the browser, so
// it is worth checking it actually lands where it should.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors, blockThreeJs, jumpToSlide } = require("./helpers");

const scrollTop = (page) =>
  page.evaluate(() => document.getElementById("scroll-container").scrollTop);
const slideTop = (page, id) =>
  page.evaluate((id) => document.getElementById(id).offsetTop, id);
// Down to the sentence the way a visitor goes: to the formula, then on.
async function toTheSentence(page) {
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-formula"));
  await page.waitForTimeout(300);
  await page.keyboard.press("ArrowDown");
  const two = await slideTop(page, "slide-2");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(two);
  await page.waitForTimeout(300);
  return two;
}

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

// The formula slide stands between the title and the sentence since
// 2026-09-30 ("introduce a 4th page, between the first and second").
test("the landing page has exactly four slides, the formula between the title and the sentence", async ({ page }) => {
  await page.goto("/index.html");
  await expect(page.locator(".slide")).toHaveCount(4);
  expect(await page.locator(".slide").evaluateAll((all) => all.map((s) => s.id)))
    .toEqual(["slide-1", "slide-formula", "slide-2", "slide-3"]);
  await expect(page.locator("#slide-1")).toBeVisible();
});

test("the Scroll button moves to the second slide", async ({ page }) => {
  await page.goto("/index.html");
  expect(await scrollTop(page)).toBe(0);

  await page.locator("#scroll-cue").click();
  const target = await slideTop(page, "slide-formula");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(target);
});

test("arrow keys move one slide at a time, and stop at the ends", async ({ page }) => {
  await page.goto("/index.html");

  await page.keyboard.press("ArrowDown");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-formula"));

  await page.keyboard.press("ArrowUp");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(0);

  // Already at the top — pressing up again should not go anywhere odd.
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(500);
  expect(await scrollTop(page)).toBe(0);
});

// Regression test: the arrow keys used to keep driving the slides while
// the menu was open over the top of them, so the page scrolled around
// behind whatever you were actually looking at.
test("arrow keys do nothing while the menu is open, and work again once it closes", async ({ page }) => {
  await page.goto("/index.html");
  const start = await scrollTop(page);

  await page.locator(".menu-trigger").click();
  await expect(page.locator(".menu-overlay")).toHaveClass(/open/);

  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(900);
  expect(await scrollTop(page), "page must not move behind the open menu").toBe(start);

  await page.keyboard.press("Escape");
  await expect(page.locator(".menu-overlay")).not.toHaveClass(/open/);

  await page.keyboard.press("ArrowDown");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-formula"));
});

// Both corners of the title slide — the block bottom right and the
// Scroll button bottom left — leave on their own as you go down and
// come back as you return, tracking the scroll rather than playing a
// fixed animation, so they reverse the moment you turn round.
for (const [what, selector] of [
  ["title block", ".title-block"],
  ["Scroll button", ".scroll-cue"],
]) {
  test(`the ${what} fades out on the way down and back in on the way up`, async ({ page }) => {
    await page.goto("/index.html");

    const shown = () =>
      page.locator(selector).evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    // The block arrives with an animation of its own, which holds on to
    // opacity until it has finished playing; the scroll takes over after.
    // (Since 2026-09-29 the block comes up last, once the title has
    // gathered, so this waits for it rather than for a fixed time.)
    await expect.poll(shown, { timeout: 6000, message: "should be there to begin with" }).toBeGreaterThan(0.9);
    // And handed from its own arrival to the scroll (landing.js clears the
    // animation once it has played, or at 3s): until then the animation
    // holds its opacity and the scroll cannot move it.
    await expect.poll(() => page.locator(selector).evaluate((el) => el.style.animationName), { timeout: 6000 }).toBe("none");

    // Park the page partway down by hand, rather than waiting out the
    // site's own long scroll, and check it responds to where the page is.
    const park = (fraction) =>
      page.evaluate((f) => {
        const container = document.getElementById("scroll-container");
        container.style.scrollSnapType = "none";
        container.scrollTop = document.getElementById("slide-formula").offsetTop * f;
      }, fraction);

    await park(0.2);
    await page.waitForTimeout(150);
    const partway = await shown();
    expect(partway, "should already be going").toBeLessThan(0.7);
    expect(partway, "but not gone yet").toBeGreaterThan(0);

    await park(0.5);
    await page.waitForTimeout(150);
    expect(await shown(), "gone well before the second slide").toBeLessThan(0.05);

    await park(0);
    await page.waitForTimeout(150);
    expect(await shown(), "and back again on the way up").toBeGreaterThan(0.9);
  });
}

// Nothing you cannot see should still be clickable.
test("the Scroll button stops taking clicks once it has faded", async ({ page }) => {
  await page.goto("/index.html");
  await page.waitForTimeout(1600);

  const clickable = () =>
    page.locator(".scroll-cue").evaluate((el) => getComputedStyle(el).pointerEvents);
  expect(await clickable(), "should work where it can be seen").not.toBe("none");

  await page.evaluate(() => {
    const container = document.getElementById("scroll-container");
    container.style.scrollSnapType = "none";
    container.scrollTop = document.getElementById("slide-2").offsetTop;
  });
  await page.waitForTimeout(150);
  expect(await clickable()).toBe("none");
});

test("the page still works with animations turned off in the operating system", async ({ page }) => {
  // Some people set "reduce motion" system-wide. The site is supposed to
  // go straight to its destination instead of animating, not break.
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = collectPageErrors(page);
  await page.goto("/index.html");

  await page.locator("#scroll-cue").click();
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-formula"));

  expect(errors).toEqual([]);
});

/* THE LONG MOVE IS SMOOTH, AND THIS IS THE REGRESSION FOR IT.
   The owner: "try to make the home page smoother when going from 2 to 3
   and vice versa." Everything on this page draws from where the page is
   — the paper's curtain and grid, the map's arrival, the thread, the
   chromatogram — each in a frame loop of its own. The move used to start
   a fresh frame request for every step, which put it LAST in the frame:
   every drawing read where the page had been a frame before, trailed it
   by ten pixels or so at speed, and caught up in lurches. So landing.js
   keeps one loop, started first, and the page is moved at the head of
   every frame.

   Watched from inside the page: every frame callback is wrapped, and
   records where the page was before and after it ran. In each frame the
   page may move only in landing.js's own loop (`tick`), and every
   drawing (`animate` in node-scene.js, `frame` in the other three) must
   run after it. */
test("on the long move between the sentence and the map, the page is moved before anything draws from it",
  async ({ page }) => {
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.__frames = [];
    window.__watch = false;
    window.requestAnimationFrame = (cb) => raf((now) => {
      const c = document.getElementById("scroll-container");
      const before = c ? c.scrollTop : 0;
      cb(now);
      const after = c ? c.scrollTop : 0;
      if (window.__watch) window.__frames.push({ now, name: cb.name || "", before, after });
    });
  });
  const errors = collectPageErrors(page);
  await page.goto("/index.html");
  await page.waitForTimeout(600);

  const two = await toTheSentence(page);

  await page.evaluate(() => { window.__watch = true; });
  await page.keyboard.press("ArrowDown");
  const three = await slideTop(page, "slide-3");
  await expect.poll(() => scrollTop(page), { timeout: 10000 }).toBe(three);
  await page.waitForTimeout(300);
  await page.keyboard.press("ArrowUp");
  await expect.poll(() => scrollTop(page), { timeout: 12000 }).toBe(two);

  const frames = await page.evaluate(() => {
    const by = new Map();
    window.__frames.forEach((f) => {
      if (!by.has(f.now)) by.set(f.now, []);
      by.get(f.now).push(f);
    });
    return [...by.values()];
  });
  const moving = frames.filter((one) => one.some((f) => f.after !== f.before));
  expect(moving.length, "the page should have been seen moving, frame by frame").toBeGreaterThan(20);
  moving.forEach((one) => {
    const movers = one.filter((f) => f.after !== f.before).map((f) => f.name);
    expect(movers, "only landing.js's own loop moves the page").toEqual(["tick"]);
    const at = one.findIndex((f) => f.name === "tick");
    one.forEach((f, n) => {
      if (f.name === "animate" || f.name === "frame") {
        expect(n, `a drawing (${f.name}) reads the page after it has been moved`).toBeGreaterThan(at);
      }
    });
  });
  // And the drawings are in those frames at all — the check above is
  // worth nothing if none of them ran.
  expect(moving.filter((one) => one.some((f) => f.name === "animate")).length,
    "the map drew while the page moved").toBeGreaterThan(10);
  expect(moving.filter((one) => one.some((f) => f.name === "frame")).length,
    "the paper and the thread drew while the page moved").toBeGreaterThan(10);
  expect(errors).toEqual([]);
});

/* AND IT SETS OFF AT ONCE. Over the 2.4 seconds between the sentence and
   the map the move used to ease on a cube, which all but stood still for
   the first third of a second — a key pressed and nothing seeming to
   happen — and then had to make up for it. It eases on a sine now: by an
   eighth of the way through its time it has gone nearly four percent of
   the way (the cube had gone less than one), and half way through its
   time it is half way there. Read off the frames' own clocks, so a slow
   machine does not change the answer. */
test("the long move to the map sets off at once and eases evenly", async ({ page }) => {
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.__marks = [];
    window.requestAnimationFrame = (cb) => raf((now) => {
      cb(now);
      if (cb.name === "tick" && window.__marks.length) {
        window.__marks.push({ now, top: document.getElementById("scroll-container").scrollTop });
      }
    });
    window.addEventListener("keydown", () => { window.__marks = [{ key: true }]; }, true);
  });
  await page.goto("/index.html");
  await page.waitForTimeout(600);
  const two = await toTheSentence(page);

  await page.keyboard.press("ArrowDown");
  const three = await slideTop(page, "slide-3");
  await expect.poll(() => scrollTop(page), { timeout: 10000 }).toBe(three);

  const marks = await page.evaluate(() => window.__marks.slice(1));
  // The first frame after the press is where the move's clock starts.
  const start = marks[0].now;
  const way = (m) => (m.top - two) / (three - two);
  const near = (ms) => marks.reduce((best, m) =>
    Math.abs(m.now - start - ms) < Math.abs(best.now - start - ms) ? m : best);
  const eighth = near(300);
  const expected = (m) => (1 - Math.cos(Math.PI * Math.min(1, (m.now - start) / 2400))) / 2;
  expect(Math.abs(eighth.now - start - 300), "a frame near an eighth of the way through").toBeLessThan(120);
  expect(way(eighth), "under way by an eighth of its time").toBeGreaterThan(0.6 * expected(eighth));
  expect(way(eighth)).toBeGreaterThan(0.012);
  const half = near(1200);
  expect(Math.abs(way(half) - expected(half)), "half way there, half way through").toBeLessThan(0.03);
});

/* THE TITLE GATHERS as the page loads — the owner, 2026-09-29: "add an
   animation to the title page for when you load it in". Specks drift in
   from all over the slide and settle into the letters; the letters come up
   over them; the specks let go and are gone. Held back until then, the
   title is never flashed first — and never kept waiting: it is there well
   within three seconds. With motion turned off it is simply there. */
test("the title gathers out of specks as the page loads, and is there within three seconds", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/index.html");
  await expect(page.locator("#slide-1 canvas.title-specks"), "the specks drawn over the slide").toHaveCount(1, { timeout: 1500 });
  const h1 = page.locator(".title-content h1");
  await expect.poll(() => h1.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 3500 }).toBeGreaterThan(0.95);
  await expect(page.locator("html")).toHaveClass(/title-here/);
  await expect(page.locator("html")).not.toHaveClass(/title-coming/);
  await expect(page.locator("canvas.title-specks"), "and let go of").toHaveCount(0, { timeout: 4000 });
  await expect.poll(() => page.locator(".about-open").evaluate((e) => +getComputedStyle(e).opacity), { timeout: 3000 }).toBeGreaterThan(0.95);
  expect(errors).toEqual([]);
});

test("with motion turned off the title is simply there", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/index.html");
  await page.waitForTimeout(300);
  await expect(page.locator("canvas.title-specks")).toHaveCount(0);
  expect(await page.locator(".title-content h1").evaluate((e) => +getComputedStyle(e).opacity)).toBe(1);
});

/* ABOUT ME — "a square at the title which will blur out the page and bring
   up a 'about me' page (on the same page more or less)", with the owner's
   two paragraphs, "slightly animated". The square opens it over the page
   gone out of focus; Escape, its close or the page round it put it away;
   the wheel inside it never changes slides. */
test("the square at the title opens About me over the page, out of focus", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/index.html");
  const square = page.locator(".about-open");
  await expect.poll(() => square.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeGreaterThan(0.95);
  const about = page.locator("#about");
  await expect(about).toBeHidden();
  await square.click();
  await expect(about).toBeVisible();
  await expect(about).toHaveAttribute("role", "dialog");
  await expect(square).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveClass(/about-shown/);
  // The owner's words, as they wrote them.
  await expect(page.locator("#about-title")).toContainText("About me");
  await expect(about).toContainText("I like smelling stuff and learning, and this website is essentially my record of combining the two.");
  await expect(about).toContainText("How the name came to be");
  await expect(about).toContainText("why not \u201cThe Taste of Aldehydes\u201d?");
  // The page behind it out of focus.
  expect(await about.evaluate((e) => getComputedStyle(e).backdropFilter || getComputedStyle(e).webkitBackdropFilter)).toMatch(/blur/);
  // A wheel inside it moves no slide.
  const box = await page.locator(".about-sheet").boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(900);
  expect(await scrollTop(page), "the slides stayed where they were").toBe(0);
  await page.keyboard.press("Escape");
  await expect(about).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/about-shown/);
  // Its close, and the page round it, put it away too.
  await square.click();
  await page.locator(".about-close").click();
  await expect(about).toBeHidden();
  await square.click();
  await expect(about).toBeVisible();
  await page.mouse.click(8, 450);
  await expect(about).toBeHidden();
  expect(errors).toEqual([]);
});

test("on a phone the square stands under the title, named, and About me fits the screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  const square = page.locator(".about-open");
  await expect.poll(() => square.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeGreaterThan(0.95);
  const t = await page.locator(".title-content h1").boundingBox();
  const b = await square.boundingBox();
  expect(b.y, "under the title").toBeGreaterThan(t.y + t.height - 1);
  expect(Math.abs(b.x + b.width / 2 - 195), "in the middle").toBeLessThan(8);
  await expect(page.locator(".about-open-word")).toBeVisible();
  await square.tap().catch(() => square.click());
  const sheet = await page.locator(".about-sheet").boundingBox();
  expect(sheet.x).toBeGreaterThanOrEqual(0);
  expect(sheet.x + sheet.width).toBeLessThanOrEqual(390);
});

/* THE ALDEHYDE — the owner, 2026-09-30: "redesign the front page of home.
   I want a big aldehyde molecule in the very middle of it, with the electron
   cloud being done as colour coded exactly as described in my previous
   message [the double bond and the lone pair brought forward, every other
   electron insignificant], and have the electron cloud made with the curl
   noise page elements." And then: "remove the stuff in the top right; and i
   want the taste of aldehydes to be in front of the aldehyde. I want them
   both to be centered ... a little smoother ... look like the thing i see on
   the right [the private page it was first drawn on]; as close as possible
   to it" — on its dark ground, which the owner chose for the first slide.
   Formaldehyde, drawn by molecule.js from aldehyde-data.js (written by
   tools/aldehyde/cloud.py). */

/** Where the gold and the violet are on the screen, read off a screenshot
 *  of the first slide's dark ground. */
async function colours(page, clip) {
  const shot = (await page.screenshot(clip ? { clip } : {})).toString("base64");
  const at = clip || { x: 0, y: 0 };
  return page.evaluate(async ({ shot, at }) => {
    const img = new Image();
    img.src = "data:image/png;base64," + shot;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const out = { gold: { n: 0, x: 0, y: 0 }, violet: { n: 0, x: 0, y: 0 } };
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
      const k = (y * c.width + x) * 4, r = d[k], gr = d[k + 1], b = d[k + 2];
      const which = r - b > 40 && gr - b > 15 && r >= gr ? "gold" : b - gr > 25 && b - r > 10 ? "violet" : null;
      if (!which) continue;
      out[which].n++; out[which].x += x; out[which].y += y;
    }
    for (const k in out) if (out[k].n) { out[k].x = at.x + out[k].x / out[k].n; out[k].y = at.y + out[k].y / out[k].n; }
    return out;
  }, { shot, at });
}

test("the aldehyde glows big in the middle of the dark first slide, the double bond gold and the lone pair violet, the title in front of it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule"), "drawn").toHaveClass(/molecule-drawn/, { timeout: 4000 });
  // the private page's dark ground, and the title in its light ink
  const ground = await page.locator("#slide-1").evaluate((e) => getComputedStyle(e).backgroundColor);
  expect(ground).toBe("rgb(31, 31, 32)");
  // the title in white (2026-09-30, later: "not opposite colour, but rather
  // white with an added layer that makes it more visible", and of the five
  // tried, "the second one"): not inverted any more, with a close dark edge
  // — and nothing cut out of the aldehyde behind it
  const ink = await page.locator(".title-content").evaluate((e) => ({
    colour: getComputedStyle(e.querySelector("h1")).color,
    blend: getComputedStyle(e).mixBlendMode,
    edge: getComputedStyle(e.querySelector("h1")).textShadow !== "none",
  }));
  expect(ink).toEqual({ colour: "rgb(255, 255, 255)", blend: "normal", edge: true });
  expect(require("fs").readFileSync(require("path").join(__dirname, "..", "molecule.js"), "utf8"),
    "no mask of the title's letters").not.toMatch(/uMask|maskCanvas/);
  // over the whole of the slide, taking nothing from the pointer, and under the title
  const slide = await page.locator("#slide-1").boundingBox();
  const canvas = await page.locator(".molecule-canvas").boundingBox();
  expect(Math.abs(canvas.width - slide.width) + Math.abs(canvas.height - slide.height)).toBeLessThan(2);
  expect(await page.locator(".molecule").evaluate((e) => getComputedStyle(e).pointerEvents)).toBe("none");
  const layers = await page.evaluate(() => [
    +getComputedStyle(document.querySelector(".molecule")).zIndex,
    +getComputedStyle(document.querySelector(".title-content")).zIndex,
  ]);
  expect(layers[1], "the title in front of the aldehyde").toBeGreaterThan(layers[0]);
  // the title in the middle, both ways
  const title = await page.locator(".title-content").boundingBox();
  expect(Math.abs(title.x + title.width / 2 - 720), "in the middle across").toBeLessThan(4);
  expect(Math.abs(title.y + title.height / 2 - 450), "in the middle up and down").toBeLessThan(30);
  // and the aldehyde's gold and violet round the same middle
  await page.waitForTimeout(3200);
  const seen = await colours(page);
  expect(seen.gold.n, "the double bond, in gold").toBeGreaterThan(400);
  expect(seen.violet.n, "the lone pair, in violet").toBeGreaterThan(150);
  for (const k of ["gold", "violet"]) {
    expect(Math.abs(seen[k].x - 720), `${k}: in the middle across`).toBeLessThan(200);
    expect(Math.abs(seen[k].y - 450), `${k}: in the middle up and down`).toBeLessThan(200);
  }
  // nothing in the top right any more, and no names or bonds over the title
  await expect(page.locator(".molecule-key")).toHaveCount(0);
  await expect(page.locator(".molecule-atom")).toHaveCount(0);
  // the title still gathered, and its square still there
  await expect.poll(() => page.locator(".about-open").evaluate((e) => +getComputedStyle(e).opacity), { timeout: 3000 }).toBeGreaterThan(0.95);
  expect(errors).toEqual([]);
});

test("the Menu is light over the dark first slides, and dark again on the sentence", async ({ page }) => {
  await page.goto("/index.html");
  const menu = page.locator(".menu-trigger");
  await expect.poll(() => menu.evaluate((e) => getComputedStyle(e).color)).toBe("rgb(236, 232, 226)");
  await jumpToSlide(page, "slide-formula");
  await page.waitForTimeout(200);
  expect(await menu.evaluate((e) => getComputedStyle(e).color), "the formula is dark too").toBe("rgb(236, 232, 226)");
  await jumpToSlide(page, "slide-2");
  await expect.poll(() => menu.evaluate((e) => getComputedStyle(e).color), { timeout: 3000 }).toBe("rgb(23, 23, 15)");
  await jumpToSlide(page, "slide-1");
  await expect.poll(() => menu.evaluate((e) => getComputedStyle(e).color), { timeout: 3000 }).toBe("rgb(236, 232, 226)");
});

test("the aldehyde's cloud is Schrodinger's, in three parts that add up to sixteen electrons, and the two brought forward are emphasised", async ({ page }) => {
  await page.goto("/index.html");
  const data = await page.evaluate(() => {
    const D = window.ALDEHYDE;
    return {
      molecule: D.molecule,
      atoms: D.atoms.map((a) => a[0]),
      electrons: Object.fromEntries(Object.entries(D.parts).map(([k, p]) => [k, p.electrons])),
      counts: Object.fromEntries(Object.entries(D.parts).map(([k, p]) => [k, p.n])),
      bytes: Object.fromEntries(Object.entries(D.parts).map(([k, p]) => [k, atob(p.xyz).length === p.n * 3 && atob(p.shade).length === p.n])),
    };
  });
  expect(data.molecule).toBe("H2C=O");
  expect(data.atoms).toEqual(["C", "O", "H", "H"]);
  expect(data.electrons).toEqual({ rest: 12, pi: 2, lone: 2 });
  expect(Object.values(data.bytes).every(Boolean), "every part whole").toBe(true);
  // how strongly each is drawn is molecule.js's, and the data holds enough for it
  const src = require("fs").readFileSync(require("path").join(__dirname, "..", "molecule.js"), "utf8");
  const m = src.match(/const EMPHASIS = \{ pi: ([\d.]+), lone: ([\d.]+), rest: ([\d.]+) \}/);
  const share = src.match(/const SHARE = \{ pi: (\d+), lone: (\d+), rest: (\d+) \}/);
  expect(m, "EMPHASIS written as it was").not.toBeNull();
  const [pi, lone, rest] = m.slice(1).map(Number);
  expect(pi).toBeGreaterThan(1);
  expect(lone).toBeGreaterThan(1);
  expect(rest, "every other electron insignificant").toBeLessThan(1);
  const [spi, slone, srest] = share.slice(1).map(Number);
  expect(spi / srest, "the shares are the electrons' own: 2 to 12").toBeCloseTo(2 / 12, 5);
  expect(slone).toBe(spi);
  expect(data.counts.pi).toBeGreaterThanOrEqual(spi * pi);
  expect(data.counts.lone).toBeGreaterThanOrEqual(slone * lone);
  expect(data.counts.rest).toBeGreaterThanOrEqual(srest * rest);
  // drawn as the private page draws it: light added to light, and no lens
  expect(src).toMatch(/blending: THREE\.AdditiveBlending/);
  expect(src).not.toMatch(/uFocus|uBlur/);
});

test("with motion turned off the aldehyde is simply there, still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.waitForTimeout(500);
  const clip = { x: 320, y: 60, width: 800, height: 760 };
  const a = (await page.screenshot({ clip })).toString("base64");
  await page.waitForTimeout(900);
  const b = (await page.screenshot({ clip })).toString("base64");
  expect(a === b, "nothing moved").toBe(true);
  const seen = await colours(page);
  expect(seen.gold.n + seen.violet.n, "and it is drawn").toBeGreaterThan(400);
});

test("without the 3D library the first slide is the title alone on its dark ground, and nothing breaks", async ({ page }) => {
  const errors = collectPageErrors(page, ["three.min.js", "ERR_FAILED", "Failed to load resource"]);
  await blockThreeJs(page);
  await page.goto("/index.html");
  const h1 = page.locator(".title-content h1");
  await expect.poll(() => h1.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeGreaterThan(0.95);
  await page.waitForTimeout(2600);
  await expect(page.locator(".molecule")).not.toHaveClass(/molecule-drawn/);
  expect(await page.locator("#slide-1").evaluate((e) => getComputedStyle(e).backgroundColor)).toBe("rgb(31, 31, 32)");
  expect(errors).toEqual([]);
});

test("on a phone the aldehyde and the title stand in the middle together", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html");
  await expect(page.locator(".molecule")).toHaveClass(/molecule-drawn/, { timeout: 4000 });
  await page.waitForTimeout(3200);
  // (above the corner's small print, whose letters' coloured fringes would
  // count for gold now that the title masks most of the gold behind it)
  const seen = await colours(page, { x: 0, y: 0, width: 390, height: 720 });
  const title = await page.locator(".title-content").boundingBox();
  expect(seen.gold.n + seen.violet.n, "drawn (a fifth of it, in a browser without a graphics card)").toBeGreaterThan(40);
  expect(Math.abs(title.x + title.width / 2 - 195)).toBeLessThan(4);
  for (const k of ["gold", "violet"]) {
    if (!seen[k].n) continue;
    expect(Math.abs(seen[k].x - 195), `${k}: in the middle across`).toBeLessThan(90);
    expect(Math.abs(seen[k].y - (title.y + title.height / 2)), `${k}: about the title`).toBeLessThan(200);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

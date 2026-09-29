// ============================================================
// THE LANDING PAGE
//
// index.html is three full-screen panels ("slides") that you move
// between with the wheel, the arrow keys, or the Scroll button.
// The moving is hand-written rather than left to the browser, so
// it is worth checking it actually lands where it should.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const scrollTop = (page) =>
  page.evaluate(() => document.getElementById("scroll-container").scrollTop);
const slideTop = (page, id) =>
  page.evaluate((id) => document.getElementById(id).offsetTop, id);

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("the landing page has exactly three slides", async ({ page }) => {
  await page.goto("/index.html");
  await expect(page.locator(".slide")).toHaveCount(3);
  await expect(page.locator("#slide-1")).toBeVisible();
});

test("the Scroll button moves to the second slide", async ({ page }) => {
  await page.goto("/index.html");
  expect(await scrollTop(page)).toBe(0);

  await page.locator("#scroll-cue").click();
  const target = await slideTop(page, "slide-2");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(target);
});

test("arrow keys move one slide at a time, and stop at the ends", async ({ page }) => {
  await page.goto("/index.html");

  await page.keyboard.press("ArrowDown");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-2"));

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
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-2"));
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

    // Park the page partway down by hand, rather than waiting out the
    // site's own long scroll, and check it responds to where the page is.
    const park = (fraction) =>
      page.evaluate((f) => {
        const container = document.getElementById("scroll-container");
        container.style.scrollSnapType = "none";
        container.scrollTop = document.getElementById("slide-2").offsetTop * f;
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
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(await slideTop(page, "slide-2"));

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

  await page.keyboard.press("ArrowDown");
  const two = await slideTop(page, "slide-2");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(two);
  await page.waitForTimeout(300);

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
  await page.keyboard.press("ArrowDown");
  const two = await slideTop(page, "slide-2");
  await expect.poll(() => scrollTop(page), { timeout: 8000 }).toBe(two);
  await page.waitForTimeout(300);

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

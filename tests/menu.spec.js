// ============================================================
// THE SHARED MENU
//
// nav.js builds the same menu on every page from one list
// (SITE_LINKS). These check that it opens, closes, knows which
// page you're on, and that its links are actually wired up.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, jumpToSlide, waitForMapSettled, collectPageErrors, HOME_WITH_MAP } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("menu opens and closes by the button", async ({ page }) => {
  await page.goto("/index.html");

  const overlay = page.locator(".menu-overlay");
  const trigger = page.locator(".menu-trigger");

  await expect(overlay).not.toHaveClass(/open/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(overlay).toHaveClass(/open/);
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await trigger.click();
  await expect(overlay).not.toHaveClass(/open/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("Escape closes the menu", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator(".menu-trigger").click();
  await expect(page.locator(".menu-overlay")).toHaveClass(/open/);

  await page.keyboard.press("Escape");
  await expect(page.locator(".menu-overlay")).not.toHaveClass(/open/);
});

test("clicking a menu link closes the menu", async ({ page }) => {
  await page.goto("/index.html");
  await page.locator(".menu-trigger").click();
  await expect(page.locator(".menu-overlay")).toHaveClass(/open/);

  await page.locator(".menu-list a", { hasText: "Contact" }).click();
  await expect(page).toHaveURL(/contact\.html$/);
});

// Visiting the site at its bare address ("/") is the normal case, and
// the page served for it is index.html. The menu used to fail to mark
// Home as current in exactly that case, because there is no filename
// in the address to compare against.
test("the page you are on is marked in the menu, including at the bare site address", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".menu-list a.menu-current")).toHaveText("Home");

  await page.goto("/index.html");
  await expect(page.locator(".menu-list a.menu-current")).toHaveText("Home");

  await page.goto("/categories/theories.html");
  await expect(page.locator(".menu-list a.menu-current")).toHaveText("Theories");

  await page.goto("/contact.html");
  await expect(page.locator(".menu-list a.menu-current")).toHaveText("Contact");
});

test("menu lists every page in SITE_LINKS, in order", async ({ page }) => {
  await page.goto("/index.html");
  const labels = await page.$$eval(".menu-list a", (as) => as.map((a) => a.textContent.trim()));
  expect(labels).toEqual([
    "Home",
    "Scent descriptions",
    "Theories",
    "Explorations & Researches",
    "Favourites",
    "Note Library",
    "Photography",
    "Search",
    "Contact",
  ]);
  // The Test page was last until 2026-09-29, when it became the Note
  // Library: "Remove the test page from the menu".
});

test("menu links from a nested page resolve correctly, not relative to the folder", async ({ page }) => {
  // A page inside /categories/ sets SITE_ROOT to "../". If that is
  // wrong, links come out as /categories/categories/... and 404.
  await page.goto("/categories/theories.html");
  const hrefs = await page.$$eval(".menu-list a", (as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs).toContain("../index.html");
  expect(hrefs).toContain("../categories/favorites.html");
  expect(hrefs).toContain("../contact.html");
});

// The landing page once opened this menu three different ways, one per
// slide. It doesn't any more: there is one menu and it behaves the same
// everywhere, which is what these check has not crept back.
test("the menu opens the same way on every slide of the landing page", async ({ page }) => {
  // (the sentence and the map switched on, as they are kept: 2026-09-30)
  await page.goto(HOME_WITH_MAP);
  await page.waitForTimeout(400);

  for (const slide of ["slide-1", "slide-formula", "slide-2", "slide-3"]) {
    if (slide !== "slide-1") {
      await jumpToSlide(page, slide);
      if (slide === "slide-3") await waitForMapSettled(page);
      await page.waitForTimeout(300);
    }

    await page.locator(".menu-trigger").click();
    await page.waitForTimeout(900);

    const state = await page.evaluate(() => {
      const overlay = document.getElementById("site-menu-overlay");
      return {
        classes: overlay.className,
        transform: getComputedStyle(overlay).transform,
        background: getComputedStyle(overlay).backgroundColor,
        // (The smell of aldehydes stands beside the list since 2026-09-29,
        // and is its own drawing, not a layer over the menu.)
        extraLayers: [...overlay.querySelectorAll("svg")].filter((svg) => !svg.closest(".menu-aldehydes")).length,
        loose: document.querySelectorAll("body > svg.menu-fan").length,
        bodyClasses: document.body.className,
      };
    });

    expect(state.classes, `${slide}: no per-slide mode`).not.toMatch(/mode-/);
    expect(state.classes).toContain("open");
    expect(state.transform, `${slide}: the panel simply fades in`).toBe("none");
    expect(state.background, `${slide}: the same dark panel`).toBe("rgb(10, 10, 10)");
    expect(state.extraLayers, `${slide}: nothing drawn over the menu`).toBe(0);
    expect(state.loose).toBe(0);
    expect(state.bodyClasses, `${slide}: the page is not inverted`).not.toMatch(/menu-invert/);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
  }
});

/* THE SMELL OF ALDEHYDES, on the right of the menu — the owner,
   2026-09-29: "add some typography in the menu for the smell of aldehydes
   on the right side ... code several variations, send me screenshots and
   then ill decide." Three were made, and they chose THE MOLECULE; the
   particles and the specimen came out of the code. It stands right of the
   list without touching it, only while the menu is open; it is ornament,
   kept from a screen reader; it asks for no faces of its own; and it is
   not there where there is no room for it. */
test("the menu carries the smell of aldehydes on its right: the molecule, and only it", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/categories/theories.html");
  const aside = page.locator(".menu-aldehydes");
  await expect(aside).toHaveCount(1);
  await expect(aside).toHaveAttribute("aria-hidden", "true");
  await page.locator(".menu-trigger").click();
  await expect.poll(() => aside.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeGreaterThan(0.95);
  // The molecule: R–C(=O)–H in hairlines, a ring of what it smells of.
  await expect(aside.locator("svg.ma-mol")).toBeVisible();
  await expect(aside.locator(".ma-atoms text")).toHaveText(["C", "O", "R", "H"]);
  await expect(aside.locator(".ma-bonds line")).toHaveCount(4);
  await expect(aside.locator("svg.ma-mol textPath")).toContainText("metallic");
  // The other two are gone, and so are the faces they needed.
  await expect(page.locator(".ma-fizz, .ma-big, .ma-sheet")).toHaveCount(0);
  expect(await page.evaluate(() => [...document.querySelectorAll("link[rel=stylesheet]")]
    .some((l) => /Instrument\+Serif|Unbounded|Major\+Mono/.test(l.href))), "no faces of its own").toBe(false);
  const list = await page.locator(".menu-list").boundingBox();
  const box = await aside.boundingBox();
  expect(box.x, "right of the list, clear of it").toBeGreaterThan(list.x + list.width + 40);
  expect(box.x + box.width).toBeLessThanOrEqual(1440 - 40);
  await page.keyboard.press("Escape");
  await expect.poll(() => aside.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeLessThan(0.05);
  // The address that showed the others shows the molecule.
  await page.goto("/categories/theories.html?menu-type=particles");
  await expect(page.locator(".menu-aldehydes svg.ma-mol")).toHaveCount(1);
  // No room beside the list on a narrow desktop window: not there.
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(aside).toBeHidden();
  // On a tall phone, small in the corner under the list, on the screen.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/categories/theories.html");
  await page.locator(".menu-trigger").click();
  await expect.poll(() => aside.evaluate((e) => +getComputedStyle(e).opacity), { timeout: 4000 }).toBeGreaterThan(0.95);
  const small = await aside.boundingBox();
  expect(small.x).toBeGreaterThanOrEqual(0);
  expect(small.x + small.width).toBeLessThanOrEqual(390);
  expect(small.y + small.height).toBeLessThanOrEqual(844);
  const last = await page.locator(".menu-list li").last().boundingBox();
  expect(small.y, "under the list").toBeGreaterThan(last.y);
  expect(errors).toEqual([]);
});

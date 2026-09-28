// ============================================================
// EVERY PAGE LOADS
//
// The plainest thing that can go wrong with a site like this: a
// page that errors, loses its stylesheet, or loses the shared menu
// because the little SITE_ROOT line at the bottom of it is wrong.
// That last one is the documented footgun of this codebase — get it
// wrong on a new page and the whole menu breaks, not just one link.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

// Every page on the site, and how deep it sits, which is what
// SITE_ROOT has to match.
const PAGES = [
  { url: "/index.html", root: "", title: /The Taste of Aldehydes/ },
  { url: "/contact.html", root: "", title: /Contact/ },
  { url: "/search.html", root: "", title: /Search/ },
  { url: "/categories/scent-descriptions.html", root: "../", title: /Scent descriptions/ },
  { url: "/categories/theories.html", root: "../", title: /Theories/ },
  { url: "/categories/favorites.html", root: "../", title: /Favourites/ },
  { url: "/categories/researches.html", root: "../", title: /Explorations/ },
  { url: "/categories/other-2.html", root: "../", title: /Photography/ },
  { url: "/categories/note-library.html", root: "../", title: /Note Library/ },
  { url: "/works/example-gallery-work.html", root: "../", title: /Vetiver/ },
  { url: "/works/example-article-work.html", root: "../", title: /vetiver/ },
  // ADAR names the photograph it wants for each fragrance and works
  // without it — the picture is taken off the page and the placeholder
  // shown — so a picture the owner has not added yet is an expected
  // 404 rather than a fault. See images/README.txt.
  { url: "/houses/adar.html", root: "../", title: /ADAR/ },
  { url: "/works/theory-01.html", root: "../", title: /Architecture of Sunscreen/ },
  { url: "/works/theory-02.html", root: "../", title: /Architecture of Sweat/ },
  { url: "/works/theory-03.html", root: "../", title: /Note Dissemination Framework/ },
  { url: "/works/resins-in-perfumery.html", root: "../", title: /Resins/ },
  { url: "/works/skin.html", root: "../", title: /Skin/ },
  { url: "/works/my-personal-introduction-to-perfume.html", root: "../", title: /Introduction to Perfume/ },
  { url: "/works/dupes-designers-and-niches.html", root: "../", title: /Dupes, Designers and Niches/ },
  { url: "/works/test-node-a.html", root: "../", title: /Test node/ },
  { url: "/works/test-node-b.html", root: "../", title: /Test node/ },
  { url: "/works/test-page.html", root: "../", title: /Test page/ },
];

for (const page_ of PAGES) {
  test(`${page_.url} loads cleanly`, async ({ page }) => {
    const errors = collectPageErrors(page, page_.allow || []);
    await serveDependenciesLocally(page);

    const response = await page.goto(page_.url);
    expect(response.status(), "page should be served, not missing").toBe(200);
    await expect(page).toHaveTitle(page_.title);

    // The stylesheet is shared by every page; if its path is wrong the
    // page still "works" but looks like an unstyled document.
    const styledBody = await page.evaluate(
      () => getComputedStyle(document.body).fontFamily
    );
    expect(styledBody, "style.css should be applied").toContain("Archivo");

    // SITE_ROOT is what tells the menu how deep this page is.
    const siteRoot = await page.evaluate(() => window.SITE_ROOT);
    expect(siteRoot, `SITE_ROOT on ${page_.url}`).toBe(page_.root);

    // The menu is built by nav.js on every page.
    await expect(page.locator(".menu-trigger")).toBeVisible();
    expect(await page.locator(".menu-list li").count()).toBeGreaterThan(0);

    expect(errors, `no errors on ${page_.url}`).toEqual([]);
  });
}

test("every menu link on every page points at a page that exists", async ({ page }) => {
  await serveDependenciesLocally(page);

  for (const page_ of PAGES) {
    await page.goto(page_.url);
    const hrefs = await page.$$eval(".menu-list a", (as) => as.map((a) => a.href));
    expect(hrefs.length, `menu links on ${page_.url}`).toBeGreaterThan(0);

    for (const href of hrefs) {
      const res = await page.request.get(href);
      expect(res.status(), `${href} linked from ${page_.url}`).toBe(200);
    }
  }
});

/* CONTACT IS ONE SENTENCE — AND, SINCE 2026-09-26, AN EMAIL BEHIND A
   CHECK. The owner, 2026-09-24: "remove the email and remove everything.
   Get in touch, send a carrier pigeon. put that instead". Then, 2026-09-26:
   "add a captcha that hides the contact information (let it be filer
   contact information)", and "keep this: Get in touch, send a carrier
   pigeon. Below it add :or just send an email:". So the sentence is still
   the page's heading, the owner's line stands under it, and the only
   other words are the check's own; nothing to follow and no address on
   the page until the check is passed (tests/contact.spec.js has that). */
test("the contact page says to send a carrier pigeon, or an email behind a check", async ({ page }) => {
  await page.goto("/contact.html");
  await expect(page.locator(".page-content h1")).toHaveText("Get in touch, send a carrier pigeon.");
  const rest = await page.evaluate(() => {
    const content = document.querySelector(".page-content").cloneNode(true);
    const links = content.querySelectorAll("a").length;
    // The check's own controls and its no-script line are not writing.
    content.querySelectorAll(".contact-check, .contact-lock-nojs, .contact-details").forEach((el) => el.remove());
    return {
      links,
      mail: document.documentElement.outerHTML.includes("mailto:"),
      text: content.textContent.replace(/\s+/g, " ").trim(),
    };
  });
  expect(rest.links, "nothing to follow").toBe(0);
  expect(rest.mail, "no address anywhere on the page").toBe(false);
  expect(rest.text).toBe("Get in touch, send a carrier pigeon. or just send an email:");
});

/* THE LINE ON SLIDE 2 NAMES THE SITE AS ITS TITLE DOES. It said "The Smell
   of Aldehydes" after the site was named The Taste of Aldehydes; the owner,
   2026-09-26, asked for it fixed "to suit the "taste" of aldehydes". The
   rest of the sentence is theirs and stays exactly as written. */
test("the line on slide 2 names the site as its title does", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.goto("/index.html");
  const title = (await page.locator("#slide-1 h1").textContent()).trim();
  expect(title).toBe("The Taste of Aldehydes");
  const line = (await page.locator("#slide-2 .intro-lede").textContent()).replace(/\s+/g, " ").trim();
  expect(line).toBe("A personal project of perfume exploration. “The Taste of Aldehydes” will act as a library for " +
    "information, interpretations, theories and even ideas.");
});

/* THE TAB, LOOKED AWAY FROM: "when you click off of the tab, then the tab
   should be called 'The Taste of Aldehydes'" (2026-09-27). The page is
   told it has been hidden (as the browser tells it when another tab is
   chosen), and its title becomes the site's name; told it is seen again,
   the page's own title comes back — on a house, and on the home page,
   whose own title already is the name. */
test("a tab looked away from is called The Taste of Aldehydes, and gets its own title back", async ({ page }) => {
  await serveDependenciesLocally(page);
  const seen = (hidden) => page.evaluate((h) => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => h });
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (h ? "hidden" : "visible") });
    document.dispatchEvent(new Event("visibilitychange"));
    return document.title;
  }, hidden);
  await page.goto("/houses/adar.html");
  const own = await page.title();
  expect(own).not.toBe("The Taste of Aldehydes");
  expect(await seen(true)).toBe("The Taste of Aldehydes");
  expect(await seen(false)).toBe(own);
  await page.goto("/works/dupes-designers-and-niches.html");
  expect(await seen(true)).toBe("The Taste of Aldehydes");
  expect(await seen(false)).toBe("Dupes, Designers and Niches — The Taste of Aldehydes");
  await page.goto("/index.html");
  expect(await seen(true)).toBe("The Taste of Aldehydes");
  expect(await seen(false)).toBe("The Taste of Aldehydes");
});

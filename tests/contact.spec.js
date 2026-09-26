// @ts-check
/* ============================================================
   CONTACT — contact.html and contact.js.

   The owner, 2026-09-26: "in contact, add a captcha that hides the
   contact information (let it be filer contact information)". The
   sentence stays at the head of the page; under it, characters drawn in
   specks, a box to type them into, and the (filler) details once they are
   typed. The details are not in the page's source in the clear.
   ============================================================ */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const CONTACT = "/contact.html";

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/** Every random number the page asks for is 0.1 — so the characters it
 *  draws are all the third of its letters, a D. */
async function steady(page) {
  await page.addInitScript(() => { Math.random = () => 0.1; });
}

test("the details are not in the page's source to be harvested", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "contact.html"), "utf8");
  expect(source).not.toContain("example.com");
  expect(source).not.toContain("@your");
  expect(source).not.toMatch(/mailto:/);
  // And the owner's sentence is still the head of the page.
  expect(source).toContain("<h1>Get in touch, send a carrier pigeon.</h1>");
});

test("the details stay hidden until the characters are typed, and a wrong answer draws new ones", async ({ page }) => {
  const errors = collectPageErrors(page);
  await steady(page);
  await page.goto(CONTACT);
  await expect(page.locator("h1")).toHaveText("Get in touch, send a carrier pigeon.");
  const canvas = page.locator(".contact-captcha-canvas");
  await expect(canvas).toBeVisible();
  await expect(page.locator(".contact-details")).toBeHidden();
  await expect(page.locator(".contact-lock-nojs")).toBeHidden();
  // Something is drawn: specks on the canvas.
  const inked = await canvas.evaluate((c) => {
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 40) n++;
    return n;
  });
  expect(inked, "characters drawn").toBeGreaterThan(400);
  const drawn = Number(await page.locator(".contact-lock").getAttribute("data-drawn"));
  await page.locator(".contact-captcha-field").fill("WRONG1");
  await page.locator(".contact-captcha-go").click();
  await expect(page.locator(".contact-captcha-say")).toContainText("Not quite");
  await expect(page.locator(".contact-details")).toBeHidden();
  expect(Number(await page.locator(".contact-lock").getAttribute("data-drawn")), "new characters drawn").toBeGreaterThan(drawn);
  expect(await page.content()).not.toContain("example.com");
  expect(errors).toEqual([]);
});

test("typed right, the details are shown, in either case", async ({ page }) => {
  const errors = collectPageErrors(page);
  await steady(page);
  await page.goto(CONTACT);
  await page.locator(".contact-captcha-field").fill("dddddd");
  await page.locator(".contact-captcha-field").press("Enter");
  const details = page.locator(".contact-details");
  await expect(details).toBeVisible();
  await expect(page.locator(".contact-check")).toBeHidden();
  await expect(details.locator("dt")).toHaveText(["Email", "Instagram"]);
  await expect(details.locator("a")).toHaveAttribute("href", "mailto:hello@example.com");
  await expect(details).toContainText("@your.handle");
  expect(errors).toEqual([]);
});

test("without its script the page says the details need JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(CONTACT);
  await expect(page.locator("h1")).toHaveText("Get in touch, send a carrier pigeon.");
  await expect(page.locator(".contact-lock-nojs")).toBeVisible();
  await expect(page.locator(".contact-check")).toBeHidden();
  await context.close();
});

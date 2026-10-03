// @ts-check
/* ============================================================
   CONTACT — contact/index.html and contact.js.

   The owner, 2026-09-26: "in contact, add a captcha that hides the
   contact information (let it be filer contact information)". The
   sentence stays at the head of the page; under it, characters drawn in
   specks, a box to type them into, and the (filler) details once they are
   typed. The details are not in the page's source in the clear.

   And then: "keep this: Get in touch, send a carrier pigeon. Below it add
   :or just send an email: and there add the stuff that i told you to" —
   the owner's line under the sentence, as the head of the check, and the
   one detail it shows the (filler) email. Since 2026-09-29 that line is
   "... or an email:" ('rewrite "or just send an email:" to "... or an
   email:"').
   ============================================================ */
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const CONTACT = "/contact/";

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/** Every random number the page asks for is 0.1 — so the characters it
 *  draws are all the third of its letters, a D. */
async function steady(page) {
  await page.addInitScript(() => { Math.random = () => 0.1; });
}

/** Anything that looks like an email address — what a harvester looks for. */
const AN_EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
/** The details sealed in the page, unsealed as contact.js does — so no test
 *  here has to write the address out (2026-10-03: the repository is public,
 *  and an address written in a test is an address in the clear). */
function sealedDetails() {
  const source = fs.readFileSync(path.join(__dirname, "..", "contact", "index.html"), "utf8");
  const sealed = /data-sealed="([^"]+)"/.exec(source)[1];
  const bytes = Buffer.from(sealed, "base64").toString("binary"), key = "aldehydes";
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  return JSON.parse(out);
}

test("the details are not in the page's source to be harvested", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "contact", "index.html"), "utf8");
  expect(source, "no address in the clear").not.toMatch(AN_EMAIL);
  expect(source).not.toContain("@your");
  expect(source).not.toMatch(/mailto:/);
  // and none in what it looks like sealed either
  const [[, email]] = sealedDetails();
  expect(email, "an address is sealed in it").toMatch(AN_EMAIL);
  expect(source).not.toContain(email.split("@")[1]);
  // And the owner's sentence is still the head of the page.
  expect(source).toContain("<h1>Get in touch, send a carrier pigeon.</h1>");
});

test("under the sentence, the owner's '... or an email:', and the check under that", async ({ page }) => {
  await page.goto(CONTACT);
  const h1 = page.locator("h1");
  const or = page.locator(".contact-or");
  await expect(or).toHaveText("... or an email:");
  const canvas = page.locator(".contact-captcha-canvas");
  const [a, b, c] = [await h1.boundingBox(), await or.boundingBox(), await canvas.boundingBox()];
  expect(b.y, "the line under the sentence").toBeGreaterThan(a.y + a.height - 1);
  expect(b.y - (a.y + a.height), "and close under it").toBeLessThan(80);
  expect(c.y, "the check under the line").toBeGreaterThan(b.y + b.height - 1);
  await expect(page.locator(".contact-lock")).toHaveAttribute("aria-labelledby", await or.getAttribute("id"));
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
  expect(await page.content(), "no address on the page, its script run").not.toMatch(AN_EMAIL);
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
  // An email, and only the email: what the owner's line says it is.
  await expect(details.locator("dt")).toHaveText(["Email"]);
  const [[label, email, href]] = sealedDetails();
  expect(label).toBe("Email");
  await expect(details.locator("a")).toHaveAttribute("href", href);
  await expect(details.locator("a")).toHaveText(email);
  expect(href).toBe("mailto:" + email);
  expect(errors).toEqual([]);
});

test("without its script the page says the details need JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  await page.goto(CONTACT);
  await expect(page.locator("h1")).toHaveText("Get in touch, send a carrier pigeon.");
  await expect(page.locator(".contact-or")).toHaveText("... or an email:");
  await expect(page.locator(".contact-lock-nojs")).toBeVisible();
  await expect(page.locator(".contact-check")).toBeHidden();
  await context.close();
});

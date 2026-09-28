// ============================================================
// THE ESSAY PAGES (works/theory-*.html, works/resins-in-perfumery.html)
//
// A long piece of writing on the theories drawing's ground: a swarm
// of particles standing in the air behind it, and the RULE down the
// left — one tick per section, filled in as far as you have read,
// with the section you are in named under it.
//
// The two things worth guarding here are the two this site keeps
// getting wrong elsewhere: that the rule is built from the page's own
// sections rather than written out twice, and that WHERE YOU ARE IS
// THE SCROLL — travel down and back and you are where you were, with
// the same drawing behind you.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const THEORY = "/works/theory-01.html";
const RESINS = "/works/resins-in-perfumery.html";

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

test("the rule is built from the piece's own sections", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(RESINS);
  await page.waitForTimeout(400);

  const read = await page.evaluate(() => ({
    sections: [...document.querySelectorAll(".essay-section h2")].map((h) => {
      const copy = h.cloneNode(true);
      const no = copy.querySelector(".essay-no");
      if (no) no.remove();
      return copy.textContent.trim();
    }),
    ticks: [...document.querySelectorAll(".essay-mark-name")].map((n) => n.textContent.trim()),
    links: [...document.querySelectorAll(".essay-mark")].map((a) => a.getAttribute("href")),
  }));

  expect(read.sections.length, "the piece has sections").toBeGreaterThan(5);
  // One tick per section, named for it — and NOT carrying the section
  // number as part of the name, which is what reading the heading
  // whole gave: "01WHAT A RESIN IS".
  expect(read.ticks).toEqual(read.sections);
  // Every tick is a link to its own section, so the rule is a way of
  // getting about and not only a readout.
  read.links.forEach((href) => expect(href).toMatch(/^#section-\d+$/));

  expect(errors, "no console errors").toEqual([]);
});

test("the reading is the scroll, and comes back when you do", async ({ page }) => {
  await page.goto(RESINS);
  await page.waitForTimeout(400);

  const reading = () => page.locator(".essay-read").textContent();
  const here = () => page.locator(".essay-here").textContent();

  expect(await reading()).toBe("00%");
  const first = await here();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
  await page.waitForTimeout(400);
  const through = parseInt(await reading(), 10);
  expect(through, "the reading should have counted up").toBeGreaterThan(30);
  expect(await here(), "and should be naming a different section").not.toBe(first);

  // Standing still is standing still: nothing on this page adds itself
  // up, so a page left alone reads the same a second later.
  await page.waitForTimeout(900);
  expect(parseInt(await reading(), 10), "and not drift while nothing is touched")
    .toBe(through);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  expect(await reading(), "and come all the way back").toBe("00%");
  expect(await here()).toBe(first);
});

test("travelling back gives the same drawing", async ({ page }) => {
  // The field is written from `scrollY` rather than carried along, so
  // going down and back up is not a different sky. The structure
  // drawing learnt this the hard way; the same rule holds here.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(RESINS);
  await page.waitForTimeout(500);

  const shot = () =>
    page.evaluate(() => {
      const canvas = document.querySelector(".essay-field");
      const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) sum += data[i];
      return sum;
    });

  const atTop = await shot();
  expect(atTop, "the air should have something in it").toBeGreaterThan(0);
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(400);
  const down = await shot();
  expect(down, "and the drawing should have moved with the page").not.toBe(atTop);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  expect(await shot(), "and come back to exactly what it was").toBe(atTop);
});

test("with animation turned off the field stands still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(THEORY);
  await page.waitForTimeout(500);

  const shot = () =>
    page.evaluate(() => {
      const canvas = document.querySelector(".essay-field");
      const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      for (let i = 3; i < data.length; i += 4) sum += data[i];
      return sum;
    });
  const before = await shot();
  await page.waitForTimeout(900);
  expect(await shot(), "nothing should have drifted").toBe(before);
});

test("without its script the page is still all of its writing", async ({ page }) => {
  await page.route("**/essay.js", (route) => route.abort());
  const errors = collectPageErrors(page, ["ERR_FAILED", "Failed to load resource"]);
  await page.goto(RESINS);

  // The writing is the page's own; only the field and the rule are the
  // script's, and neither of them carries anything to read.
  await expect(page.locator(".essay-section")).not.toHaveCount(0);
  await expect(page.locator(".essay-section h2").first()).toBeVisible();
  await expect(page.locator(".essay-section p").first()).toBeVisible();
  await expect(page.locator(".essay-rule")).toHaveCount(0);
  expect(errors, "no errors beyond the blocked file").toEqual([]);
});

test("the theories and the researches reach their own pieces", async ({ page }) => {
  await page.goto("/categories/theories.html");
  const first = page.locator(".work-row").first();
  await expect(first).toHaveAttribute("href", "../works/theory-01.html");

  await page.goto("/categories/researches.html");
  // 000 stands first since 2026-09-23; since 2026-09-27 Dupes, Designers
  // and Niches and Buying a Perfume stand before the research, at 003.
  await expect(page.locator(".index-table tbody a").first())
    .toHaveAttribute("href", "../works/my-personal-introduction-to-perfume.html");
  await expect(page.locator(".index-table tbody a").nth(3))
    .toHaveAttribute("href", "../works/resins-in-perfumery.html");

  // And the research carries the owner's own writing rather than a
  // placeholder.
  await page.goto(RESINS);
  await expect(page.locator(".essay-section").first()).toContainText("insoluble in water");
  await expect(page.locator(".essay-section").nth(1)).toContainText("turpentine");
});

/* THE RULE MUST NOT MOVE. It is a fixed column centred on its own
   height, and the name under it wraps to a second line when a section
   is called something long — so going from a one-line name to a
   two-line one shifted the whole ladder, hairline and all, half a line
   up the window and back down again at the next section.

   THIS IS A REGRESSION. The owner found it on The Architecture of
   Sweat, between "Applying the Framework" and "Every Combination": a
   jump of exactly 8px, measured. `holdName()` reserves the room the
   tallest name the page actually has needs. */
test("the rule stands still all the way down a piece, whatever a section is called",
  async ({ page }) => {
  await page.goto("/works/theory-02.html");
  await page.waitForTimeout(700);
  await expect(page.locator(".essay-rule")).toBeVisible();

  const room = await page.evaluate(() =>
    document.documentElement.scrollHeight - window.innerHeight);
  const seen = new Set();
  const names = new Set();
  for (let f = 0; f <= 1.0001; f += 0.04) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(room * f));
    await page.waitForTimeout(70);
    const read = await page.evaluate(() => ({
      top: Math.round(document.querySelector(".essay-rule-line").getBoundingClientRect().top),
      name: document.querySelector(".essay-here").textContent,
    }));
    seen.add(read.top);
    names.add(read.name);
  }

  // The reading has to have changed, or this would pass by never
  // having asked the rule to do anything.
  expect(names.size, "the rule should have named several sections")
    .toBeGreaterThan(3);
  expect([...seen], `the rule moved down the page: ${[...seen].join(", ")}`)
    .toHaveLength(1);
});

/* NO PICTURE AT THE HEAD OF A THEORY — 2026-09-25: "Remove the picture
   from the Note dissemination framework, and all other theories." Each
   theory opened on a plate (the framework's was its summary sheet); none
   does now. The framework's diagrams are the argument itself, drawn in
   the page, and stay. */
test("no theory carries a picture", async ({ page }) => {
  for (const n of ["01", "02", "03"]) {
    await page.goto(`/works/theory-${n}.html`);
    await expect(page.locator(".essay-plate"), `theory ${n}: no plate`).toHaveCount(0);
    await expect(page.locator(".essay-body img"), `theory ${n}: no picture`).toHaveCount(0);
  }
  await expect(page.locator(".zone-figure").first(), "the framework's diagrams stay").toBeVisible();
});

/* EXPLORATIONS 002, BUYING A PERFUME. The row came first (2026-09-26:
   "add another exploration on 'Buying A Perfume - A Philosophical
   Exploration' Make it be 002 ... I will want to just add text later
   on"; 2026-09-27: "The second should be 002, and called 'Buying a
   Perfume'"), and later on 2026-09-27 the writing: "ADD THAT TO THE
   EXPLORATION OF HOW TO BUY A PERFUME". So the row is 002, named only
   that; the page carries the owner's own subtitle, "Simplifying the
   thought process", under its title and nowhere else; and every section
   is theirs, word for word — none waiting — with their smaller headings
   inside the sections (not ticks on the rule) and their footnote leading
   down and back. */
test("Explorations 002 is Buying a Perfume, written in the owner's words, its subtitle on its own page only",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/categories/researches.html");
  const row = page.locator('.index-table tbody tr[data-no="2"]');
  await expect(row).toHaveCount(1);
  await expect(row.locator(".index-no")).toHaveText("002");
  await expect(row.locator(".index-kind")).toHaveText("Exploration");
  await expect(row.locator("a")).toHaveText("Buying a Perfume");
  await expect(row.locator("a")).toHaveAttribute("href", "../works/buying-a-perfume.html");
  // The numbers still run 000 to 009, each once.
  const nos = await page.$$eval(".index-table tbody tr", (all) => all.map((r) => r.dataset.no));
  expect(nos).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

  await page.goto("/works/buying-a-perfume.html");
  await expect(page.locator(".essay-head h1")).toContainText("Buying a Perfume");
  await expect(page.locator(".essay-head h1 em")).toHaveText("Simplifying the thought process");
  await expect(page.locator(".essay-kicker")).toHaveText("Explorations · 002");
  await expect(page.locator(".essay-section h2")).toHaveText([
    "01Introduction", "02What is the fragrance going to be used for?", "03Special Cases", "04Conclusion", "05Footnotes",
  ]);
  await expect(page.locator(".essay-rule")).toBeVisible();
  // Written: no waiting box left, and the owner's own words as they wrote them.
  await expect(page.locator(".essay-waiting")).toHaveCount(0);
  await expect(page.locator(".essay-sub")).toHaveText([
    "Night/Day", "Inside/Outside", "Summer/Winter", "Safe/Divisive", "All-Rounder", "Club", "Romantic1", "Formal",
  ]);
  const text = await page.locator(".essay-body").textContent();
  for (const words of ["Youre welcome.", "HOWEVER", "Diabolical if you ask me.", "Montblac’s Patchouli Ink",
    "Ganneymede by Marc-Antoine Barrois", "Quite simple I think.", "by no means holistic"]) {
    expect(text, words).toContain(words);
  }
  // The two paragraphs the owner set apart, by one thin line down their
  // left (2026-09-28: "a vertical line on the left of the paragraphs ...
  // just a thin line").
  const set = page.locator(".essay-set");
  await expect(set).toHaveCount(1);
  await expect(set.locator("p")).toHaveCount(2);
  await expect(set.locator("p").first()).toContainText("In my opinion, a fragrance is an extension of the person using it.");
  await expect(set.locator("p").last()).toContainText("The way you choose to present yourself");
  const line = await set.evaluate((e) => { const c = getComputedStyle(e); return [c.borderLeftWidth, c.borderLeftStyle, c.borderTopWidth, c.borderRightWidth]; });
  expect(line, "a thin line on the left, and nothing else").toEqual(["1px", "solid", "0px", "0px"]);
  // The footnote: down from Romantic and back again.
  await expect(page.locator("#footnote-1-from")).toHaveAttribute("href", "#footnote-1");
  await expect(page.locator("#footnote-1 .essay-fn-back")).toHaveAttribute("href", "#footnote-1-from");
  await expect(page.locator("#footnote-1")).toContainText("Anyone can wear anything.");
  // The two fragrances it names that live on this site lead to them.
  await expect(page.locator('.essay-body a[href="../houses/qimu-and-musicians.html#part-01"]')).toHaveText("Guitarist");
  await expect(page.locator('.essay-body a[href="../individual-fragrances/individual-fragrances.html#part-04"]')).toHaveText("Tobacolor");
  expect(errors).toEqual([]);
});

/* EXPLORATIONS 001, 2026-09-27: "Add two explorations in the RE tab: the
   first should be 001 (move everything down), and called Dupes,
   Designers and Niches." The row is 001 and named only that; its page
   carries the owner's "*and Private lines and ultra niches" under the
   title ("this should only exist on the page of the exploration
   itself"), and all seven of its sections are the owner's writing —
   none of them waiting. What followed 001 moved down: Resins in
   Perfumery is 003 and Cold vs Warm Incense 004. */
test("Explorations 001 is Dupes, Designers and Niches, written, with its subtitle on its own page only",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/categories/researches.html");
  const row = page.locator('.index-table tbody tr[data-no="1"]');
  await expect(row.locator(".index-no")).toHaveText("001");
  await expect(row.locator(".index-kind")).toHaveText("Exploration");
  await expect(row.locator("a")).toHaveText("Dupes, Designers and Niches");
  await expect(row.locator("a")).toHaveAttribute("href", "../works/dupes-designers-and-niches.html");
  await expect(page.locator(".index-table"), "the subtitle is the page's alone").not.toContainText("Private lines");
  const named = await page.$$eval(".index-table tbody tr", (all) => all.map((r) => r.dataset.no + " " + r.dataset.name));
  expect(named.slice(0, 5)).toEqual(["0 My Personal Introduction to Perfume", "1 Dupes, Designers and Niches",
    "2 Buying a Perfume", "3 Resins in Perfumery", "4 Cold vs Warm Incense"]);

  await page.goto("/works/dupes-designers-and-niches.html");
  await expect(page.locator(".essay-kicker")).toHaveText("Explorations · 001");
  await expect(page.locator(".essay-head h1")).toContainText("Dupes, Designers and Niches*");
  await expect(page.locator(".essay-head h1 em")).toHaveText("*and Private lines and ultra niches");
  await expect(page.locator(".essay-section h2")).toHaveText(["01Introduction", "02Dupes", "03Designers",
    "04Designer Private Line", "05Niches", "06Ultra Niches", "07Conclusion"]);
  await expect(page.locator(".essay-waiting"), "all of it written").toHaveCount(0);
  // The owner's own words, as sent: the euro sign where they asked for
  // it, and the "too" they marked to be underlined.
  await expect(page.locator("#section-02")).toContainText("priced between 25€ to 50€");
  await expect(page.locator("#section-03"), "the designers' price too, at the owner's word").toContainText("priced around 80-150€,");
  await expect(page.locator("#section-02 u")).toHaveText("too");
  await expect(page.locator("#section-07")).toContainText("Trust me, it is pretty fun.");
  await expect(page.locator(".essay-rule")).toBeVisible();
  expect(errors).toEqual([]);
});

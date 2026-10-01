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
  await page.goto("/theories/");
  const first = page.locator(".work-row").first();
  await expect(first).toHaveAttribute("href", "../works/theory-01.html");

  await page.goto("/explorations-and-researches/");
  // 000 stands first since 2026-09-23; since 2026-09-27 Dupes, Designers
  // and Niches and Buying a Perfume stand before the research, and since
  // 2026-09-28 Skin at 003, so the resins research is 004.
  await expect(page.locator(".index-table tbody a").first())
    .toHaveAttribute("href", "../works/my-personal-introduction-to-perfume.html");
  await expect(page.locator(".index-table tbody a").nth(3))
    .toHaveAttribute("href", "../works/skin.html");
  await expect(page.locator(".index-table tbody a").nth(4))
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
  await page.goto("/explorations-and-researches/");
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
   Perfumery was 003 and Cold vs Warm Incense 004 — and since Skin came in
   at 003 (2026-09-28), 004 and 005. */
test("Explorations 001 is Dupes, Designers and Niches, written, with its subtitle on its own page only",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/explorations-and-researches/");
  const row = page.locator('.index-table tbody tr[data-no="1"]');
  await expect(row.locator(".index-no")).toHaveText("001");
  await expect(row.locator(".index-kind")).toHaveText("Exploration");
  await expect(row.locator("a")).toHaveText("Dupes, Designers and Niches");
  await expect(row.locator("a")).toHaveAttribute("href", "../works/dupes-designers-and-niches.html");
  await expect(page.locator(".index-table"), "the subtitle is the page's alone").not.toContainText("Private lines");
  const named = await page.$$eval(".index-table tbody tr", (all) => all.map((r) => r.dataset.no + " " + r.dataset.name));
  expect(named.slice(0, 5)).toEqual(["0 My Personal Introduction to Perfume", "1 Dupes, Designers and Niches",
    "2 Buying a Perfume", "3 Skin", "4 Resins in Perfumery"]);

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

/* RESEARCHES 003, SKIN (2026-09-28): "also please add this into RE, where
   this should be 003" — with the two tables the owner sent as pictures,
   "diagrams here and there, to make it more palpable", the pH equation
   drawn as one, "test it on your skin!" in bold, and the sources "all
   MLA8". The row is 003, a Research, and the one after it moved down: the
   resins research is 004, and its own page says so. Every section is the
   owner's, the two tables carry exactly their cells, every footnote mark
   leads to its note and every note back, the sources are MLA 8 — in
   alphabetical order, hanging, the container in italics — and the notes
   the owner left to me are not on the page. */
test("Researches 003 is Skin: the owner's research with its two tables, its diagrams, its footnotes and its sources",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/explorations-and-researches/");
  const row = page.locator('.index-table tbody tr[data-no="3"]');
  await expect(row.locator(".index-no")).toHaveText("003");
  await expect(row.locator(".index-kind")).toHaveText("Research");
  await expect(row.locator("a")).toHaveText("Skin");
  await expect(row.locator("a")).toHaveAttribute("href", "../works/skin.html");
  const next = page.locator('.index-table tbody tr[data-no="4"]');
  await expect(next.locator("a")).toHaveAttribute("href", "../works/resins-in-perfumery.html");
  const nos = await page.$$eval(".index-table tbody tr", (all) => all.map((r) => r.dataset.no));
  expect(nos).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  await page.goto("/works/resins-in-perfumery.html");
  await expect(page.locator(".essay-kicker")).toHaveText("Researches · 004");

  await page.goto("/works/skin.html");
  await expect(page.locator(".essay-head h1")).toContainText("Skin");
  await expect(page.locator(".essay-head h1 em")).toHaveText("And how it affects the perfume you wear");
  await expect(page.locator(".essay-kicker")).toHaveText("Researches · 003");
  const heads = await page.locator(".essay-section h2").evaluateAll((hs) => hs.map((h) => {
    const c = h.cloneNode(true);
    c.querySelectorAll(".essay-no, .essay-fn").forEach((e) => e.remove());
    return c.textContent.trim();
  }));
  expect(heads).toEqual(["Introduction", "pH", "Bacteria", "Oily, Dry and Moisturized Skin", "Diet",
    "Hormones and Medications", "The Geography of Skin", "Conclusion", "Sources", "Footnotes"]);
  await expect(page.locator(".essay-facts")).toContainText("10");
  // The rule names a section without its footnote mark.
  await expect(page.locator(".essay-rule")).toBeVisible();
  await expect(page.locator(".essay-mark-name"), "the rule's names carry no footnote number").toHaveText(heads);

  // THE OWNER'S WORDS, as they wrote them.
  const text = await page.locator(".essay-body").textContent();
  for (const words of ["no one whom I ever asked was really explain it. So I will.", "In my humble opinion, it is a really cool topic.",
    "The opposite is applies as well", "“The skin you sprayed at 8 a.m. is not the same skin at 6 p.m.”",
    "It is like adding an ingredient that was not there previously.", "8-12 hours", "2-4 hours",
    "among a LOT of other things", "allow several weeks before deciding that a fragrance has changed",
    "a whole new dimension of smelling things, and seeing how they turn out – on your skin."]) {
    expect(text, words).toContain(words);
  }
  // The five slips in the footnotes the owner asked to have put right.
  const notesText = await page.locator("ol.essay-footnotes").textContent();
  for (const fixed of ["the power of Hydrogen", "a 10-fold decrease in the amount of hydrogen", "from pH 6.5 to 4.5",
    "esters, aldehydes and terpenes", "mentioned in footnote 10."]) {
    expect(notesText, fixed).toContain(fixed);
  }
  // Nothing of the notes left to me.
  for (const not of ["CLAUDE", "put it in bold", "\\text", "\\log", "Footnote1", "footnote1", "Footnores", "footntoe", "MLA", "make them all"]) {
    expect(text, "not: " + not).not.toContain(not);
  }
  await expect(page.locator(".essay-section strong", { hasText: "test it on your skin!" })).toHaveCount(1);
  // pH's equation, drawn as one.
  const eq = page.locator("#footnote-1 .essay-eq");
  await expect(eq).toHaveCount(1);
  await expect(eq.locator("sub")).toHaveText("10");
  await expect(eq.locator("sup")).toHaveText("+");
  expect(await eq.evaluate((e) => getComputedStyle(e).fontFamily), "in the page's face for maths").not.toMatch(/Plex Mono/);

  // THE TWO TABLES, cell for cell.
  const tables = await page.locator(".essay-table").evaluateAll((ts) => ts.map((t) =>
    [...t.querySelectorAll("tr")].map((r) => [...r.children].map((c) => c.textContent.replace(/\s+/g, " ").trim()))));
  expect(tables).toEqual([
    [["Skin pH", "Effect on top notes", "Effect on base notes", "Longevity impact"],
      ["4.5–5.0 (acidic)", "Brighter, sharper, faster burnoff", "Minimal change", "Tops fade 10–20% faster"],
      ["5.0–5.5 (average)", "Balanced expression", "Normal development", "Standard performance"],
      ["5.5–6.5 (less acidic)", "Softer, more muted opening", "Slightly extended warmth", "Marginal base improvement"]],
    [["Body site", "Avg. temperature", "Sebum", "Fragrance character"],
      ["Inner wrist", "~32°C", "Low-moderate", "Clean, linear, moderate projection"],
      ["Neck (sides)", "~35°C", "Moderate", "Strong projection, more body interaction"],
      ["Behind ear", "~34°C", "Low", "True-to-formula, intimate sillage"],
      ["Inner elbow", "~33°C", "Low", "Quiet, close-range, long-lasting"]],
  ]);
  // The first table in pH, the second in the geography of the skin.
  await expect(page.locator("#section-02 .essay-table")).toHaveCount(1);
  await expect(page.locator("#section-07 .essay-table")).toHaveCount(1);

  // THE DIAGRAMS: here and there, each saying what it shows, and drawn.
  const figures = page.locator(".essay-figure");
  expect(await figures.count(), "diagrams here and there").toBeGreaterThanOrEqual(7);
  const inSections = await figures.evaluateAll((fs) => new Set(fs.map((f) => f.closest(".essay-section").id)).size);
  expect(inSections, "spread through the piece").toBeGreaterThanOrEqual(6);
  for (const f of await figures.all()) {
    expect((await f.getAttribute("aria-label")) || "", "a figure says what it shows").not.toBe("");
    const box = await f.boundingBox();
    expect(box.height, "and is drawn").toBeGreaterThan(60);
  }

  // THE FOOTNOTES: eighteen, each mark to its note and each note back.
  const notes = page.locator("ol.essay-footnotes > li");
  await expect(notes).toHaveCount(18);
  for (let n = 1; n <= 18; n++) {
    await expect(page.locator(`a.essay-fn[href="#footnote-${n}"]`), `mark ${n}`).toHaveCount(1);
    await expect(page.locator(`#footnote-${n} a.essay-fn-back`)).toHaveAttribute("href", `#footnote-${n}-from`);
    await expect(page.locator(`#footnote-${n}-from`)).toHaveCount(1);
  }
  const marks = await page.locator("a.essay-fn").evaluateAll((as) => as.map((a) => a.textContent));
  expect(marks, "the marks in order").toEqual(Array.from({ length: 18 }, (_, i) => String(i + 1)));
  await page.locator('a.essay-fn[href="#footnote-13"]').click();
  await expect(page).toHaveURL(/#footnote-13$/);
  await expect(page.locator("#footnote-13")).toBeInViewport();

  // THE SOURCES, in MLA 8: seven works (one the owner listed twice),
  // alphabetical, hanging, the container in italics, a web page dated by
  // when it was read.
  const sources = page.locator("ul.essay-sources > li");
  await expect(sources).toHaveCount(7);
  const firsts = await sources.evaluateAll((ls) => ls.map((l) => l.textContent.replace(/^[“"]/, "").trim()));
  expect([...firsts].sort((a, b) => a.localeCompare(b, "en"))).toEqual(firsts);
  for (const li of await sources.all()) {
    await expect(li.locator("cite"), "the container in italics").toHaveCount(1);
    expect(await li.locator("cite").evaluate((c) => getComputedStyle(c).fontStyle)).toBe("italic");
    const t = await li.textContent();
    expect(t.trim().endsWith("."), "an entry ends with a full stop").toBe(true);
    if (!/vol\. \d+/.test(t)) expect(t, "a web page dated by when it was read").toMatch(/Accessed \d{1,2} [A-Z][a-z]{2,4}\. \d{4}\./);
  }
  const hang = await sources.first().evaluate((l) => [parseFloat(getComputedStyle(l).paddingLeft), parseFloat(getComputedStyle(l).textIndent)]);
  expect(hang[0], "a hanging indent").toBeGreaterThan(10);
  expect(hang[1]).toBeCloseTo(-hang[0], 0);
  expect(await sources.nth(0).textContent()).toContain("Behan, J. M., et al. “Insight into How Skin Changes Perfume.”");
  expect(await page.locator("#source-havlicek").textContent()).toContain("Havlíček, Jan, and Pavlína Lenochová.");
  await expect(page.locator("#footnote-13 a[href='#source-havlicek']")).toHaveCount(1);
  expect(errors).toEqual([]);
});

/* SKIN'S DIAGRAMS, NUMBERED AND REDRAWN (2026-09-29). The owner: every
   diagram labelled "Diagram 1; showing …", in page order (the strip in
   the Introduction is 1, the pH scale 2); the pH scale's band saying only
   "your skin", with the ×10s, their arcs and the line under them gone;
   bergamot's caption in their words; the bacteria diagram split in two,
   after the first and the second paragraph of Bacteria — a compound
   (linalool in small script under it) + the enzymes as a Pac-Man with a
   pentagon for a mouth → compound changed (oxidized in small script under
   it); and no S. hominis drawn, its compounds (thioalcohols in small
   script) drawn as before + the perfume = the perfume with them in the
   middle; every compound on moisturized skin a tiny square, and only
   there; and the cycle's lettering not so compact. No lettering in any
   diagram runs into any other, at a desktop's width or a phone's. */
test("Skin's diagrams are numbered, and drawn as the owner asked", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/works/skin.html");

  // NUMBERED, in page order, in the owner's format.
  const captions = await page.locator(".essay-figure figcaption").evaluateAll((cs) => cs.map((c) => c.textContent.trim()));
  expect(captions).toHaveLength(9);
  captions.forEach((c, i) => expect(c, `diagram ${i + 1}`).toMatch(new RegExp(`^Diagram ${i + 1}; showing \\S`)));
  await expect(page.locator(".essay-figure figcaption .essay-figure-no")).toHaveText(
    Array.from({ length: 9 }, (_, i) => `Diagram ${i + 1}`));
  expect(await page.locator("#section-01 .essay-figure figcaption").textContent(), "the Introduction's is 1").toMatch(/^Diagram 1;/);
  await expect(page.locator(".ed-ph figcaption")).toHaveText("Diagram 2; showing the pH scale and where your skin lies on it.");
  await expect(page.locator(".ed-curves figcaption")).toHaveText(
    "Diagram 3; showing the brightness per unit time of bergamot on high and low acidity levels.");

  // THE pH SCALE: "your skin", and nothing of the ×10s.
  const ph = page.locator(".ed-ph");
  await expect(ph.locator("text.ed-accent")).toHaveText("your skin");
  const phText = await ph.locator("svg").textContent();
  for (const gone of ["×10", "4.5", "6.5", "each step down", "hydrogen"]) expect(phText, "not: " + gone).not.toContain(gone);
  await expect(ph.locator(".ed-hop")).toHaveCount(0);

  // BACTERIA: two diagrams, after its first and its second paragraph.
  const after = await page.locator("#section-03 > p").evaluateAll((ps) => ps.map((p) => {
    const n = p.nextElementSibling;
    return n && n.matches("figure.essay-figure") ? n.className : "";
  }));
  expect(after[0], "the enzyme's after the first paragraph").toContain("ed-enzymes");
  expect(after[1], "the added compounds' after the second").toContain("ed-added");
  // What stands under what: a name, and its small script under it.
  const under = (fig, name, small) => fig.evaluate((f, [name, small]) => {
    const t = [...f.querySelectorAll("text")];
    const a = t.find((e) => e.textContent === name), b = t.find((e) => e.textContent === small);
    if (!a || !b) return "missing";
    const A = a.getBBox(), B = b.getBBox();
    return B.y > A.y && Math.abs((A.x + A.width / 2) - (B.x + B.width / 2)) < 3 && b.classList.contains("ed-tiny") ? "under" : "not under";
  }, [name, small]);
  const enzymes = page.locator(".ed-enzymes");
  expect(await under(enzymes, "compound", "(linalool)")).toBe("under");
  // "(oxidized)" in brackets, as "(linalool)" is (2026-09-29, later).
  expect(await under(enzymes, "compound changed", "(oxidized)")).toBe("under");
  const enzText = await enzymes.locator("svg").textContent();
  expect(enzText).not.toContain("oxidised");
  expect(enzText).toContain("its enzymes");
  // The enzymes: a Pac-Man facing the compound, its mouth a pentagon's
  // corners rather than a plain wedge.
  const pac = await enzymes.locator("path.ed-pacman").evaluate((p) => {
    const b = p.getBBox(), cx = b.x + b.width - b.height / 2, cy = b.y + b.height / 2, r = b.height / 2;
    const at = (x, y) => p.isPointInFill(new DOMPoint(x, y));
    return { round: Math.abs(b.height - b.width) < b.height * 0.2, mouthOpen: !at(cx - r * 0.75, cy), body: at(cx + r * 0.6, cy),
      corners: p.getAttribute("d").match(/L([^A-Za-z]*)/)[1].trim().split(/[\s,]+/).length / 2 };
  });
  expect(pac.round, "round").toBe(true);
  expect(pac.mouthOpen, "a mouth open towards the compound").toBe(true);
  expect(pac.body, "and solid behind it").toBe(true);
  expect(pac.corners, "a pentagon's corners in the mouth").toBeGreaterThanOrEqual(3);
  await expect(page.locator(".ed-bug, .ed-enzyme, .ed-coccus"), "the capsule, its dots and the bacterium are gone").toHaveCount(0);

  const added = page.locator(".ed-added");
  const addText = await added.locator("svg").textContent();
  expect(addText, "no bacterium named on its own").not.toMatch(/S\. hominis/);
  expect(addText).toContain("compounds made");
  expect(addText).toContain("by S. Hominis");
  expect(await under(added, "by S. Hominis", "(thioalcohols)")).toBe("under");
  expect(addText).not.toMatch(/(^|[^(])thioalcohols/);
  expect(addText).toContain("the perfume");
  // The compound drawn exactly as it was, and the same again in the
  // middle of a copy of the perfume after the equals sign.
  const drawn = await added.evaluate((f) => {
    const shape = (g) => [...g.querySelectorAll("circle")].map((c) => +c.getAttribute("r"));
    const thiols = [...f.querySelectorAll(".ed-thiol")], notes = [...f.querySelectorAll(".ed-notes")];
    const x = (g) => { const b = g.getBBox(); return [b.x, b.x + b.width]; };
    const eq = [...f.querySelectorAll("text")].find((t) => t.textContent === "=").getBBox().x;
    return { thiol: shape(thiols[0]), inner: shape(thiols[1]), perfume: shape(notes[0]), copy: shape(notes[1]),
      innerX: x(thiols[1]), copyX: x(notes[1]), afterEq: x(thiols[1])[0] > eq && x(notes[1])[0] > eq };
  });
  expect(drawn.thiol, "the compound as it was drawn").toEqual([6, 9]);
  expect(drawn.inner, "the same compound in the result").toEqual(drawn.thiol);
  expect(drawn.copy, "a copy of the perfume").toEqual(drawn.perfume);
  expect(drawn.afterEq).toBe(true);
  expect(drawn.innerX[0], "the compound in the middle of it").toBeGreaterThan(drawn.copyX[0]);
  expect(drawn.innerX[1]).toBeLessThan(drawn.copyX[1]);

  // MOISTURIZED: every compound a tiny square — and only there.
  const cols = await page.locator(".ed-skins").evaluate((f) => ["ed-dry", "ed-moist", "ed-oily"].map((k) => {
    const g = f.querySelector("." + k);
    const rects = [...g.querySelectorAll("rect")];
    return { circles: g.querySelectorAll("circle").length, squares: rects.length,
      tinySquares: rects.every((r) => r.width.baseVal.value === r.height.baseVal.value && r.width.baseVal.value <= 8) };
  }));
  expect(cols[1], "moisturized").toEqual({ circles: 0, squares: 5, tinySquares: true });
  expect(cols[0].squares, "dry").toBe(0);
  expect(cols[2].squares, "oily").toBe(0);
  expect(cols[0].circles).toBeGreaterThan(0);
  expect(cols[2].circles).toBeGreaterThan(0);

  // THE CYCLE, not so compact: its lines well apart.
  const gaps = await page.locator(".ed-cycle").evaluate((f) => {
    const lines = (cls) => [...f.querySelectorAll("text." + cls)].map((t) => +t.getAttribute("y"));
    const size = (cls) => parseFloat(getComputedStyle(f.querySelector("text." + cls)).fontSize);
    const step = (ys) => Math.min(...ys.slice(1).map((y, i) => y - ys[i]));
    return { say: step(lines("ed-say")) / size("ed-say"), accent: step(lines("ed-accent").filter((y) => y < 250)) / size("ed-accent") };
  });
  expect(gaps.say, "the three lines of writing").toBeGreaterThanOrEqual(1.7);
  expect(gaps.accent, "the two lines under RIGHT AROUND OVULATION").toBeGreaterThanOrEqual(1.7);
  // ITS LINE STRAIGHT AND LEVEL ("straighten that line in diagram 8"):
  // no curve in it, flat, out from the end of the lit arc to just short of
  // the writing, level with the first line of what it says.
  const lead = await page.locator(".ed-cycle").evaluate((f) => {
    const p = f.querySelector("path.ed-lead"), b = p.getBBox();
    const first = [...f.querySelectorAll("text.ed-accent")].find((t) => t.textContent.startsWith("musks")).getBBox();
    const arc = f.querySelector(".ed-ring-lit").getBBox();
    return { d: p.getAttribute("d"), height: b.height, from: b.x, to: b.x + b.width, arcEnd: arc.x + arc.width,
      textAt: first.x, level: b.y > first.y && b.y < first.y + first.height };
  });
  expect(lead.d, "a straight line, not a curve").not.toMatch(/[qQcCsStTaA]/);
  expect(lead.height, "level").toBeLessThan(0.5);
  expect(lead.from - lead.arcEnd, "out from the lit arc").toBeGreaterThanOrEqual(0);
  expect(lead.from - lead.arcEnd).toBeLessThan(12);
  expect(lead.textAt - lead.to, "to just short of the writing").toBeGreaterThan(0);
  expect(lead.textAt - lead.to).toBeLessThan(12);
  expect(lead.level, "level with its first line").toBe(true);

  // THE ARM ATTACHED ("make the human arm attached rather than not in
  // diagram 9"): one open outline starting where the shoulder ends and
  // ending where the body's side begins — no capsule closed at the
  // shoulder.
  const arm = await page.locator(".ed-body").evaluate((f) => {
    const a = f.querySelector("path.ed-arm");
    const ends = (d) => { const n = d.match(/-?\d+(\.\d+)?/g).map(Number); return [[n[0], n[1]], [n[n.length - 2], n[n.length - 1]]]; };
    const paths = [...f.querySelectorAll(".ed-figure path")].map((p) => p.getAttribute("d"));
    // The right shoulder, M160 118 and a curve 50 across and 18 down: it
    // ends at 210 136. The body's right side goes down from 190 150.
    const shoulderEnd = paths.some((x) => x.includes("M160 118q34 4 50 18")) ? [210, 136] : null;
    const side = paths.find((x) => x.includes("M190 150v"));
    return { there: !!a, ends: a ? ends(a.getAttribute("d")) : null, shoulderEnd, side: !!side, capsule: f.querySelectorAll(".ed-limb, .ed-limb-in").length,
      closed: a ? /z\s*$/i.test(a.getAttribute("d")) : null };
  });
  expect(arm.there, "the arm").toBe(true);
  expect(arm.capsule, "no capsule of its own").toBe(0);
  expect(arm.closed, "open at the body").toBe(false);
  expect(arm.ends[0], "out of the shoulder").toEqual(arm.shoulderEnd);
  expect(arm.side, "the body's side").toBe(true);
  expect(arm.ends[1], "and into the armpit, where the side begins").toEqual([190, 150]);

  // THE TABLES NAMED as the diagrams are, counted apart: "Table 1; showing
  // …" under the first ("add a picture/table name for image 5"), "Table 2"
  // under the second.
  const named = await page.locator(".essay-table-figure").evaluateAll((fs) => fs.map((f) => ({
    table: !!f.querySelector("table.essay-table"), caption: f.querySelector("figcaption").textContent.trim(),
    under: f.querySelector("figcaption").getBoundingClientRect().top >= f.querySelector("table").getBoundingClientRect().bottom,
    no: f.querySelector("figcaption .essay-figure-no").textContent })));
  expect(named).toHaveLength(2);
  named.forEach((t, i) => {
    expect(t.table).toBe(true);
    expect(t.no).toBe(`Table ${i + 1}`);
    expect(t.caption).toMatch(new RegExp(`^Table ${i + 1}; showing \\S`));
    expect(t.under, "under the table").toBe(true);
  });
  expect(named[0].caption).toBe("Table 1; showing how different parts of a fragrance are likely to be affected by skin pH.");
  await expect(page.locator("#section-02 .essay-table-figure")).toHaveCount(1);
  await expect(page.locator("#section-07 .essay-table-figure")).toHaveCount(1);

  // NO LETTERING RUNS INTO ANY OTHER, at a desktop's width and a phone's.
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const hits = await page.$$eval(".essay-figure svg", (svgs) => svgs.flatMap((svg, i) => {
      const boxes = [...svg.querySelectorAll("text")].map((t) => ({ t: t.textContent, b: t.getBBox() }));
      const out = [];
      for (let a = 0; a < boxes.length; a++) for (let c = a + 1; c < boxes.length; c++) {
        const A = boxes[a].b, C = boxes[c].b;
        if (A.x < C.x + C.width && C.x < A.x + A.width && A.y < C.y + C.height && C.y < A.y + A.height) {
          out.push(`${svg.closest("figure").querySelector(".essay-figure-no").textContent}: ${boxes[a].t} / ${boxes[c].t}`);
        }
      }
      return out;
    }));
    expect(hits, `at ${width}px`).toEqual([]);
  }
  expect(errors).toEqual([]);
});

/* COLD VS WARM INCENSE, TAKEN DOWN (2026-09-28): "remove the page for
   cold vs warm incenses, and make the text lighter gray (since the page
   wont exist)". The row stays, at 005, drawn quieter and no link; the
   page is gone and nothing on the site points at it. */
test("Cold vs Warm Incense has no page: its row stays, lighter and not a link", async ({ page, request }) => {
  await page.goto("/explorations-and-researches/");
  const row = page.locator('.index-table tbody tr[data-name="Cold vs Warm Incense"]');
  await expect(row).toHaveAttribute("data-open", "no");
  await expect(row.locator(".index-no")).toHaveText("005");
  await expect(row.locator("a")).toHaveCount(0);
  const shade = (loc) => loc.evaluate((e) => {
    const [r, g, b] = getComputedStyle(e).color.match(/\d+(\.\d+)?/g).map(Number);
    return (r + g + b) * +(getComputedStyle(e.closest("tr")).opacity);
  });
  const written = page.locator('.index-table tbody tr[data-no="3"] .index-what');
  expect(await shade(row.locator(".index-what")), "lighter than a written row").not.toBe(await shade(written));
  expect((await request.get("/works/cold-vs-warm-incense.html")).status(), "the page is gone").toBe(404);
});

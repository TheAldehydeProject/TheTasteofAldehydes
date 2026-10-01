// ============================================================
// THE INDEX PAGES
//
// Two places are laid out as an index rather than as a drawing: the
// Researches category, and the Fragrances view of the
// contact sheet page. They share a stylesheet block and a script, so
// these check both — and above all the three things the owner asked
// for, which are the things a plain table does not do on its own:
// the headings stay stuck to the top while the rows scroll under
// them, every heading sorts by its own column, and the field above
// searches.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const RESEARCHES = "/explorations-and-researches/";
const SHEET = "/scent-descriptions/";

/** The rows showing right now, read off what each row SAYS it is
 *  rather than off its lettering — the same thing the sorting reads. */
const showing = (page) =>
  page.$$eval(".index-table tbody tr:not([hidden])", (rows) =>
    rows.map((row) => ({
      no: Number(row.dataset.no),
      name: row.dataset.name,
      house: row.dataset.house || "",
      date: row.dataset.date || "",
    }))
  );

/** Switch the contact sheet page over to the fragrances view and wait
 *  for the sheet to have finished first — the buttons are not there
 *  until the page has drawn itself. */
async function toFragrances(page) {
  await page.waitForFunction(
    () => {
      const sheet = document.getElementById("sheet");
      return sheet && sheet.classList.contains("drawn");
    },
    null,
    { timeout: 20000 }
  );
  await page.click('.sheet-filter[data-view="fragrances"]');
  await page.waitForTimeout(600);
}

/* THE OLD FRAGRANCES VIEW. Since 2026-09-25 the Fragrances view is a
   line of files (fragrance-line.js, tests/fragrance-line.spec.js), and
   the table these check is kept in the page underneath it, unchanged, at
   the owner's word. Blocking the line's script is how the page is the
   old view again — the table, its sorting and search, and the fade and
   the swipe between the views — so that is what these run against. */
test.beforeEach(async ({ page }) => {
  await page.route("**/fragrance-line.js", (route) => route.abort());
  await serveDependenciesLocally(page);
});

test("the researches are a numbered, dated table, and the first one opens",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto(RESEARCHES);

  const rows = await showing(page);
  expect(rows.length, "the table should have rows").toBeGreaterThan(1);
  // 000 STANDS FIRST, at the owner's word — "make it 000. It should be
  // the first result." It was Resins in Perfumery until 2026-09-23.
  expect(rows[0].name, "000 is the first result").toBe("My Personal Introduction to Perfume");
  expect(rows[0].no, "and it is numbered nought").toBe(0);
  // 001 is Dupes, Designers and Niches since 2026-09-27 ("the first
  // should be 001 (move everything down)"); Resins in Perfumery was 001
  // until then, 003 after it, and 004 since Skin came in at 003
  // (2026-09-28: "add this into RE, where this should be 003").
  expect(rows[1].name, "001 is the owner's Dupes, Designers and Niches").toBe("Dupes, Designers and Niches");
  expect(rows[3].name, "003 is the owner's research on skin").toBe("Skin");
  expect(rows[4].name, "and the resins research after it").toBe("Resins in Perfumery");

  // Four columns, in the order asked for: the number, the work, which
  // KIND of work it is, and the date it was made. The third was added
  // when Researches became Works and the page started carrying
  // explorations beside the researches.
  await expect(page.locator(".index-table thead th")).toHaveText([
    "No.", "Work", "Research/Exploration", "Date",
  ]);

  // And the kind is on the row rather than only in the lettering, so
  // the column sorts on it like every other.
  const kinds = await page.$$eval(".index-table tbody tr",
    (all) => all.map((row) => row.dataset.kind));
  expect(kinds.filter((k) => k === "Research").length,
    "Resins in Perfumery is a research").toBeGreaterThan(0);
  // ASKED AS "AT LEAST", not as a count. This used to be `.toBe(2)`
  // and broke the moment the owner added a third exploration, which is
  // a thing they will keep doing — what the test is really about is
  // that the KIND is on the row so the column can sort on it, not how
  // many of each there happen to be today.
  expect(kinds.filter((k) => k === "Exploration").length,
    "the explorations are marked as explorations").toBeGreaterThanOrEqual(2);
  // And nothing carries a kind that is not one of the two, or empty
  // for a piece that is neither yet.
  const allowed = ["Research", "Exploration", ""];
  expect(kinds.filter((k) => !allowed.includes(k)),
    "a row's kind is Research, Exploration, or not decided yet").toEqual([]);

  // And the first one is a link to a page that is really there.
  const href = await page.locator(".index-table tbody tr a").first().getAttribute("href");
  expect(href).toContain("my-personal-introduction-to-perfume.html");
  const opened = await page.request.get(new URL(href, page.url()).toString());
  expect(opened.status(), "the research it points at should be served").toBe(200);

  expect(errors, "no console errors").toEqual([]);
});

test("the headings sort the table, and pressing one again turns it round",
  async ({ page }) => {
  await page.goto(SHEET);
  await toFragrances(page);

  // As written: by number.
  const written = await showing(page);
  // ENOUGH ROWS TO SORT, rather than a count of the site's fragrances.
  // This asked for more than twenty until the Fragrances view stopped
  // being an index of every fragrance on the site and became its own
  // review page — what the test is about is the sorting, not how many
  // perfumes the owner has written about.
  expect(written.length, "enough rows to sort").toBeGreaterThan(4);
  expect(written.map((r) => r.no)).toEqual(written.map((r, i) => i + 1));

  // By name, both ways.
  await page.click('.index-sort[data-key="name"]');
  const byName = (await showing(page)).map((r) => r.name.toLowerCase());
  expect(byName, "sorted by what a fragrance is called")
    .toEqual(byName.slice().sort());
  await page.click('.index-sort[data-key="name"]');
  const back = (await showing(page)).map((r) => r.name.toLowerCase());
  expect(back, "and the other way round the second time")
    .toEqual(byName.slice().reverse());

  // By house, alphabetically.
  await page.click('.index-sort[data-key="house"]');
  const byHouse = (await showing(page)).map((r) => r.house.toLowerCase());
  expect(byHouse).toEqual(byHouse.slice().sort());

  // By date, which is a date and not the lettering it is printed as:
  // "10.05.2025" sorts before "04.06.2025" although it reads larger.
  await page.click('.index-sort[data-key="date"]');
  const byDate = (await showing(page)).map((r) => r.date);
  expect(byDate).toEqual(byDate.slice().sort());

  // A row's NUMBER is its own and does not change when the table is
  // sorted: sorting says where things stand, not what they are called.
  const numbered = await page.$$eval(".index-table tbody tr:not([hidden])", (rows) =>
    rows.map((row) => [row.dataset.no, row.querySelector(".index-no").textContent.trim()]));
  numbered.forEach(([carried, printed]) => {
    expect(printed, "a row keeps its own number").toBe(String(carried).padStart(3, "0"));
  });
});

test("the field above the table searches it", async ({ page }) => {
  await page.goto(SHEET);
  await toFragrances(page);

  const all = (await showing(page)).length;
  await page.fill(".index-search-field", "haxan");
  await page.waitForTimeout(150);
  const found = await showing(page);
  expect(found.length, "one fragrance is called that").toBe(1);
  expect(found[0].name).toBe("Haxan");
  await expect(page.locator(".index-count")).toContainText("001");

  // And it gives the rest back.
  await page.fill(".index-search-field", "");
  await page.waitForTimeout(150);
  expect((await showing(page)).length).toBe(all);
});

test("the headings stay where they are while the rows scroll under them",
  async ({ page }) => {
  // THE TABLE IS MADE LONG HERE RATHER THAN FOUND LONG. Until the
  // Fragrances view became its own review page it carried sixty-three
  // rows and overflowed its box on its own; it carries eight now, and
  // neither index on the site is long enough to scroll. What is being
  // checked is the LAYOUT — that a heading stays put while rows go
  // under it — and that has to hold whatever the table happens to
  // hold, so the rows are cloned until there are enough of them.
  await page.goto(SHEET);
  await toFragrances(page);

  const stayed = await page.evaluate(() => {
    const body = document.querySelector(".index-table tbody");
    const seed = [...body.querySelectorAll("tr")];
    while (body.querySelectorAll("tr").length < 60) {
      seed.forEach((row) => body.appendChild(row.cloneNode(true)));
    }
    const box = document.querySelector(".index-scroll");
    const head = document.querySelector(".index-table thead th");
    const before = head.getBoundingClientRect().top;
    const firstBefore = document.querySelector(".index-table tbody tr").getBoundingClientRect().top;
    box.scrollTop = box.scrollHeight;
    const after = head.getBoundingClientRect().top;
    const firstAfter = document.querySelector(".index-table tbody tr").getBoundingClientRect().top;
    return { before, after, moved: firstBefore - firstAfter };
  });
  expect(stayed.moved, "the rows should have scrolled").toBeGreaterThan(10);
  expect(Math.abs(stayed.after - stayed.before), "and the heading should not have")
    .toBeLessThan(2);
});

test("the whole index comes out on one screen, whatever is in the table",
  async ({ page }) => {
  // The table has its own box to scroll inside precisely so that the
  // page around it does not grow: the owner has a great many more
  // fragrances to add to it.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(SHEET);
  await toFragrances(page);

  // As above: the rows are cloned until there are far more than would
  // ever fit, because "whatever is in the table" is the whole claim and
  // the real table is eight rows long today.
  const fits = await page.evaluate(() => {
    const body = document.querySelector(".index-table tbody");
    const seed = [...body.querySelectorAll("tr")];
    while (body.querySelectorAll("tr").length < 80) {
      seed.forEach((row) => body.appendChild(row.cloneNode(true)));
    }
    return {
      page: document.documentElement.scrollHeight,
      window: window.innerHeight,
      rows: body.querySelectorAll("tr").length,
    };
  });
  expect(fits.rows, "there are more rows than would ever fit").toBeGreaterThan(30);
  expect(fits.page, "and the page is still one screen").toBeLessThanOrEqual(fits.window + 2);
});

test("the first switch swaps the views over; after that the page swipes",
  async ({ page }) => {
  await page.goto(SHEET);
  await page.waitForFunction(
    () => {
      const sheet = document.getElementById("sheet");
      return sheet && sheet.classList.contains("drawn");
    },
    null,
    { timeout: 20000 }
  );

  // Watched every frame through each switch. TWO THINGS ARE BEING
  // GUARDED, and they are different things:
  //   `both`    — frames with both views showing at once.
  //   `overlap` — frames where those two actually stood on top of one
  //               another. Fading through each other in the same place
  //               is the thing this must never look like; travelling
  //               side by side is what the owner asked for.
  await page.evaluate(() => {
    window.__both = 0;
    window.__overlap = 0;
    window.__watching = true;
    window.__reset = () => { window.__both = 0; window.__overlap = 0; };
    const watch = () => {
      const on = [...document.querySelectorAll(".view")].filter((v) => {
        if (v.hidden) return false;
        const style = getComputedStyle(v);
        return style.display !== "none" && parseFloat(style.opacity) > 0.05;
      });
      if (on.length > 1) {
        window.__both++;
        const a = on[0].getBoundingClientRect();
        const b = on[1].getBoundingClientRect();
        // How much of the window they share. Travelling side by side
        // this is zero: one's right edge is the other's left edge.
        const shared = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        if (shared > 1) window.__overlap++;
      }
      if (window.__watching) requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  });

  // THE FIRST TIME a view is opened there is no swipe: the one being
  // left goes, and the other arrives after it has gone.
  await page.click('.sheet-filter[data-view="fragrances"]');
  await page.waitForTimeout(1200);
  const first = await page.evaluate(() => ({ both: window.__both, overlap: window.__overlap }));
  expect(first.both, "the first switch swaps them over, one at a time").toBe(0);

  // AND AFTER THAT IT SWIPES, because both have now been opened: the
  // two travel across the window together, side by side, never one over
  // the other.
  await page.evaluate(() => window.__reset());
  await page.click('.sheet-filter[data-view="houses"]');
  await page.waitForTimeout(1400);
  const back = await page.evaluate(() => {
    window.__watching = false;
    return { both: window.__both, overlap: window.__overlap };
  });
  expect(back.both, "the second switch swipes, so both are on the page")
    .toBeGreaterThan(0);
  expect(back.overlap, "but never in the same place as each other").toBe(0);

  // The chrome does not travel with them: the category's name and the
  // Menu are outside the box that slides.
  const held = await page.evaluate(() => ({
    where: Math.round(document.querySelector(".sheet-where").getBoundingClientRect().left),
    menu: Math.round(document.querySelector(".menu-trigger").getBoundingClientRect().left),
  }));
  expect(held.menu, "the Menu stays where it is").toBeLessThan(80);
  expect(held.where, "and so does the category's name").toBeLessThan(200);

  // And the sheet is still the sheet when you come back to it.
  await expect(page.locator('.view[data-view="houses"]')).toBeVisible();
  await expect(page.locator(".sheet-frame").first()).toBeVisible();

  // Nothing is left lying across the page afterwards.
  const after = await page.evaluate(() => ({
    sliding: document.querySelectorAll(".view.sliding").length,
    swiping: document.querySelector(".views").classList.contains("swiping"),
    height: document.querySelector(".views").style.height,
  }));
  expect(after.sliding, "the views are put back in the flow").toBe(0);
  expect(after.swiping).toBe(false);
  expect(after.height, "and the box's held height is let go of").toBe("");
});

test("without the script the table is still the table", async ({ page }) => {
  // index-page.js only sorts and searches. Everything it works on is
  // written in the page, so a blocked script costs the sorting and
  // nothing else.
  await page.route("**/index-page.js", (route) => route.abort());
  const errors = collectPageErrors(page, ["ERR_FAILED", "Failed to load resource"]);
  await page.goto(RESEARCHES);

  const rows = await showing(page);
  expect(rows.length, "the rows are the page's own").toBeGreaterThan(1);
  // As written in the page: 000 first, since 2026-09-23.
  expect(rows[0].name).toBe("My Personal Introduction to Perfume");
  await expect(page.locator(".index-table tbody tr a").first()).toBeVisible();
  expect(errors, "no errors beyond the blocked file").toEqual([]);
});

/* A VIEW'S OWN LAYOUT BELONGS TO THE VIEW, NOT TO THE PAGE IT STANDS
   ON. The fragrances index lays itself out one way as this page's
   view — one centred column, the table given the room — and another
   as the Researches page, with readings across the top and a plates
   column down the right. That used to be asked of
   `body.view-fragrances`, which is toggled the moment a swipe starts:
   going from this view back to the sheet took its layout away while it
   was still on screen travelling off, so for half a second it was
   drawn in the Researches layout instead, with a plate the size of the
   window. The owner photographed it. */
test("the fragrances view keeps its own layout all the way through a swipe",
  async ({ page }) => {
  await page.goto("/scent-descriptions/");
  await page.waitForFunction(() => document.querySelector(".sheet.settled"),
    null, { timeout: 20000 });

  const go = async (which) => {
    await page.locator(".sheet-filter", { hasText: which }).click();
  };
  // The swipe waits for both views to have been opened at least once.
  await go("Fragrances");
  await page.waitForTimeout(1200);
  await go("Houses");
  await page.waitForTimeout(1800);
  await go("Fragrances");
  await page.waitForTimeout(1400);

  // The plates column is the tell: it is the one thing this view hides
  // and the Researches layout shows, and it is what carried the plate
  // the size of the window.
  const plates = () => page.evaluate(() => {
    const view = document.querySelector('.view[data-view="fragrances"]');
    const right = view ? view.querySelector(".index-right") : null;
    return right ? getComputedStyle(right).display : "gone";
  });
  expect(await plates(), "hidden while the view is simply showing").toBe("none");

  // And now the swipe back, watched while it runs.
  await go("Houses");
  for (let n = 0; n < 4; n++) {
    await page.waitForTimeout(110);
    expect(await plates(), "and hidden all the way through the swipe").toBe("none");
  }
});

/* ============================================================
   EXPLORATIONS & RESEARCHES, LAID OUT AGAIN (2026-09-26). The owner:
   "put this paragraph ... under the title RE, not under introduction.
   the introductiont hing delete it. Delete the right side of the page,
   and move the table upwards, so that it takes up abour 3/5ths of the
   page on the left ... On the right side, I want you to make something
   extravagant with the particles that reacts ot the thing being hovered
   on the left (in the table). Make it reactive and on theme."
   ============================================================ */

/** What the field's canvas has drawn, as how its ink is spread over a
 *  grid — enough to tell one form from another. */
const fieldInk = (page) => page.evaluate(() => {
  const c = document.querySelector(".re-canvas");
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  const G = 24, cells = new Array(G * G).fill(0);
  let ink = 0;
  for (let y = 0; y < c.height; y += 2) for (let x = 0; x < c.width; x += 2) {
    if (d[(y * c.width + x) * 4 + 3] > 40) {
      ink++;
      cells[Math.floor((y / c.height) * G) * G + Math.floor((x / c.width) * G)]++;
    }
  }
  return { ink, cells: cells.map((n) => n / Math.max(1, ink)) };
});
/** How differently two drawings spread their ink, 0 (the same) to 100
 *  (nothing in common). */
const apart = (a, b) => Math.round(a.cells.reduce((n, v, i) => n + Math.abs(v - b.cells[i]), 0) * 50);

test("Explorations & Researches: the paragraph under the name, the table on the left three fifths, the field on the right",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(RESEARCHES);
  await page.waitForTimeout(800);
  const out = await page.evaluate(() => {
    const box = (sel) => { const el = document.querySelector(sel); return el ? el.getBoundingClientRect() : null; };
    return {
      gone: [".index-col", ".index-right", ".index-plate", ".index-line"].filter((s) => document.querySelector(s)),
      name: box(".index-name"), say: box(".index-say"), board: box(".index-board"), field: box(".re-field"),
      lede: document.querySelector(".index-say-lede").textContent.replace(/\s+/g, " ").trim(),
      width: innerWidth, height: innerHeight,
      sideways: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(out.gone, "the Information heading, the line and the plates are gone").toEqual([]);
  expect(out.lede).toBe("Here you will find my researches and my explorations. Researches are where I look into stuff " +
    "from primary or secondary sources. Explorations are pieces of work where I myself am the primary source.");
  // The paragraph stands under the name, in the same column.
  expect(out.say.top, "the paragraph under the name").toBeGreaterThanOrEqual(out.name.bottom - 1);
  expect(Math.abs(out.say.left - out.name.left), "and lined up with it").toBeLessThan(2);
  // The table, moved up, the left three fifths or so.
  expect(out.board.top, "the table moved up, under the paragraph").toBeLessThan(out.height * 0.45);
  expect(out.board.top).toBeGreaterThan(out.say.bottom);
  // And then a little lower again: "in RE, lower the left side table a
  // little" (2026-09-26). It stood 45px under the paragraph; 85px now.
  expect(out.board.top - out.say.bottom, "a little way below the paragraph").toBeGreaterThan(70);
  const share = out.board.width / out.width;
  expect(share, `the table takes about three fifths of the page (${share.toFixed(2)})`).toBeGreaterThan(0.5);
  expect(share).toBeLessThan(0.66);
  // The field on the right, the height of the page.
  expect(out.field.left, "the field stands to the right of the table").toBeGreaterThan(out.board.right);
  expect(out.field.height, "most of the window's height").toBeGreaterThan(out.height * 0.7);
  expect(out.sideways).toBe(false);

  // On a phone: one column, the field a band above the table.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  const phone = await page.evaluate(() => ({
    field: document.querySelector(".re-field").getBoundingClientRect().toJSON(),
    board: document.querySelector(".index-board").getBoundingClientRect().toJSON(),
    sideways: document.documentElement.scrollWidth > innerWidth,
  }));
  expect(phone.field.bottom, "the field above the table on a phone").toBeLessThanOrEqual(phone.board.top);
  expect(phone.field.height).toBeGreaterThan(200);
  expect(phone.sideways).toBe(false);
  expect(errors).toEqual([]);
});

/* THE FIELD KEEPS ITS OWN TIME. It drew a figure for each work, then an
   abstract form for the row pointed at; the owner (2026-09-26): "I want
   the shapes to not change based on which research you hover, but rather
   to transform from one to another" — and last, choosing seventeen forms,
   "make it now last 8 seconds transforming to 8 seocnds holding", and
   then (2026-09-27) "make it 6 transforming and 12 holding". Run on
   the page's own clock, sped up: the geodesic sphere first, gathered and
   held; then, from 13.6s, 6s turning into the Borromean rings — its name
   taken up half way through, when there is more of the new form than the
   old; the rings held 12s; then on to the Rössler attractor, and to
   Aizawa's after it. Pointing at a row changes nothing,
   and nothing is written into the drawing but the angles of its spans. */
const CYCLE = ["geodesic", "borromean", "rossler", "aizawa", "lissajous", "gyre", "ripple",
  "tesseract", "cell24", "spirograph", "dini", "sierpinski", "hilbert", "thomas", "chladni", "eight", "helix"];
const FORM_NAMES = {
  geodesic: "Geodesic sphere", borromean: "Borromean rings", rossler: "Rössler attractor",
  aizawa: "Aizawa attractor", lissajous: "Lissajous knot", gyre: "Armillary", ripple: "Ripple",
  tesseract: "Tesseract", cell24: "24-cell", spirograph: "Spirograph", dini: "Dini’s surface",
  sierpinski: "Sierpiński tetrahedron", hilbert: "Hilbert curve", thomas: "Thomas attractor",
  chladni: "Chladni figure", eight: "Figure-eight knot", helix: "Helix",
};
/* THE TESSERACT, CLASSIC (2026-09-28: "fix the tesseract, i want it to look
   a little more classic", with the picture everyone knows): a cube square
   inside a cube and centred in it, each inner corner joined to the outer
   corner beside it — seen straight along the fourth dimension, not turned
   through it first (which skewed the inner cube off to a corner) — and in
   gentler perspective than the other forms. Read off the form's own code:
   its sixteen corners come out as eight at the outer cube's and eight at
   0.55 of them, and its perspective is its own. */
test("the tesseract is the classic one: a cube square inside a cube, corners joined", () => {
  const fs = require("fs");
  const path = require("path");
  const src = fs.readFileSync(path.join(__dirname, "..", "explorations.js"), "utf8");
  const block = src.slice(src.indexOf("    tesseract: {"), src.indexOf("    cell24: {"));
  expect(block.length).toBeGreaterThan(100);
  expect(block, "not turned through the fourth dimension").not.toMatch(/Math\.(sin|cos)/);
  expect(block, "a perspective of its own").toMatch(/focal: \d/);
  const see = new Function("return " + block.match(/const see = (\(\[x, y, z, w\]\) => \{[\s\S]*?\n        \});/)[1])();
  const corners = [];
  for (let k = 0; k < 16; k++) corners.push(see([0, 1, 2, 3].map((b) => ((k >> b) & 1 ? 1 : -1))));
  const reach = corners.map((p) => Math.max(...p.map(Math.abs)));
  expect(reach.filter((r) => r === 1).length, "eight corners on the outer cube").toBe(8);
  expect(reach.filter((r) => Math.abs(r - 0.55) < 1e-9).length, "and eight on the inner one").toBe(8);
  corners.forEach((p) => expect(Math.abs(Math.abs(p[0]) - Math.abs(p[1])) + Math.abs(Math.abs(p[1]) - Math.abs(p[2])), "square to each other, centred").toBeLessThan(1e-9));
});

test("the field holds each form twelve seconds and turns into the next over six, whatever is pointed at",
  async ({ page }) => {
  test.setTimeout(120000);
  const errors = collectPageErrors(page);
  await page.addInitScript(() => {
    window.__words = [];
    const fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (t) {
      if (this.canvas.classList.contains("re-canvas")) window.__words.push(String(t));
      return fillText.apply(this, arguments);
    };
  });
  // Paused before the page arrives: an installed clock otherwise goes on
  // flowing at the real rate between the steps, and on a busy machine that
  // drift ate the margin between "still holding" and the turn (it failed so
  // once, in a full run). Paused, only `runFor` moves it.
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(RESEARCHES);
  const field = page.locator(".re-field");
  const name = page.locator(".re-caption-name");
  const state = () => field.evaluate((f) => ({ figure: f.dataset.figure, phase: f.dataset.phase, shown: f.dataset.shown,
    run: parseFloat(f.querySelector(".re-run").style.getPropertyValue("--run")) }));
  await expect(field).toHaveAttribute("data-cycle", CYCLE.join(","));
  await page.clock.runFor(2500);
  expect(await state()).toMatchObject({ figure: "geodesic", phase: "hold" });
  await expect(name).toHaveText("Geodesic sphere");
  await expect(page.locator(".re-caption-no")).toHaveText("01 / 17");
  const first = await fieldInk(page);
  expect(first.ink, "the geodesic sphere is drawn").toBeGreaterThan(400);

  // Pointing at a row does nothing to it.
  await page.locator('.index-table tbody tr[data-no="1"]').hover();
  await page.clock.runFor(600);
  expect((await state()).figure, "pointing at a row changes nothing").toBe("geodesic");
  expect(await page.locator(".index-table tbody tr.is-shown").count()).toBe(0);
  expect(await page.locator(".index-table tbody tr[data-figure]").count(), "no row names a form").toBe(0);
  await page.mouse.move(200, 100);

  // Held until 13.6s (1.6 to gather, 12 standing), then turning over six
  // — "make it 6 transforming and 12 holding" (2026-09-27; it was 8 and 8).
  await page.clock.runFor(10200);       // 13.3s
  expect((await state()).phase, "still holding at thirteen seconds").toBe("hold");
  await page.clock.runFor(700);         // 14.0s
  expect(await state(), "then turning into the Borromean rings").toMatchObject({ figure: "borromean", phase: "morph" });
  await expect(name, "and still showing the sphere, early in it").toHaveText("Geodesic sphere");
  await page.clock.runFor(2400);        // 16.4s: a little short of half way
  expect((await state()).shown).toBe("geodesic");
  await page.clock.runFor(600);         // 17.0s: a little past it
  const past = await state();
  expect(past.shown, "the new name taken up half way through").toBe("borromean");
  expect(past.run).toBeGreaterThan(0.5);
  expect(past.run).toBeLessThan(0.65);
  await expect(name).toHaveText("Borromean rings");
  await expect(page.locator(".re-caption-no")).toHaveText("02 / 17");
  await page.clock.runFor(2400);        // 19.4s
  expect((await state()).phase, "six seconds of it").toBe("morph");
  await page.clock.runFor(600);         // 20.0s
  expect(await state()).toMatchObject({ figure: "borromean", phase: "hold" });
  const rings = await fieldInk(page);
  expect(apart(rings, first), "and it is a different drawing").toBeGreaterThan(30);
  await page.clock.runFor(11800);       // 31.8s: the rings held twelve seconds
  expect(await state(), "on to the Rössler attractor").toMatchObject({ figure: "rossler", phase: "morph" });
  // And so on, eighteen seconds a form: the attractor held from 37.6s, and
  // turning into Aizawa's from 49.6s. (Round the end of the cycle back to
  // the start is the arrows' test's; a whole lap here is a long run.)
  await page.clock.runFor(6000);        // 37.8s
  expect(await state()).toMatchObject({ figure: "rossler", phase: "hold" });
  await page.clock.runFor(12000);       // 49.8s
  expect(await state(), "on to the Aizawa attractor").toMatchObject({ figure: "aizawa", phase: "morph" });
  const words = await page.evaluate(() => window.__words);
  expect(words.filter((w) => !/^\d+°$/.test(w)), "nothing written into the drawing but angles").toEqual([]);
  expect(errors).toEqual([]);
});

/* THE ARROWS: "go to the next one or back with two arrows that are small
   and subtle near the bottom". Each starts a quicker transformation at
   once (2.6s); one pressed while another is under way lands it first; and
   the field's own clock carries on from wherever the arrows leave it. */
test("the arrows at the field's foot go on to the next form, or back, at once", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.clock.install();
  await page.clock.pauseAt(Date.now() + 1000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(RESEARCHES);
  const field = page.locator(".re-field");
  const state = () => field.evaluate((f) => ({ figure: f.dataset.figure, phase: f.dataset.phase, shown: f.dataset.shown }));
  await page.clock.runFor(3000);
  const next = page.locator(".re-next"), prev = page.locator(".re-prev");
  await expect(next).toBeVisible();
  await expect(prev).toBeVisible();
  // Small: well under the size of the caption's own line.
  const box = await next.boundingBox();
  expect(box.width).toBeLessThanOrEqual(24);
  expect(box.y, "near the bottom of the field").toBeGreaterThan((await field.boundingBox()).y + (await field.boundingBox()).height - 60);

  await next.click();
  expect(await state(), "on to the next at once").toMatchObject({ figure: "borromean", phase: "morph" });
  await page.clock.runFor(1500);
  expect((await state()).shown, "past half way in a second and a half").toBe("borromean");
  await page.clock.runFor(1300);
  expect(await state(), "and there in 2.6 seconds").toMatchObject({ figure: "borromean", phase: "hold" });
  await expect(page.locator(".re-caption-name")).toHaveText("Borromean rings");

  // Back, twice, the second while the first is under way: the sphere
  // lands, and from it back again round to the helix, the last.
  await prev.click();
  await page.clock.runFor(600);
  await prev.click();
  expect(await state(), "back past the start, round to the last").toMatchObject({ figure: "helix", phase: "morph" });
  await page.clock.runFor(2800);
  expect(await state()).toMatchObject({ figure: "helix", phase: "hold" });
  await expect(page.locator(".re-caption-no")).toHaveText("17 / 17");
  // Its own clock carries on: twelve seconds held, then round to the sphere.
  await page.clock.runFor(12300);
  expect(await state(), "and the cycle goes on from there").toMatchObject({ figure: "geodesic", phase: "morph" });
  expect(errors).toEqual([]);
});

/* THE LOCI, THE SPANS AND THE FRAME: "some loci where you have geometric
   elements (such as triangles from the connected dots)" — and then "add
   triangles and a little geometry". Read off what the field's canvas is
   asked to draw once a form has gathered: triangles filled, and lines;
   the spans' angles marked with arcs and written in degrees; and the
   frame's dashed equator. */
test("here and there on the field, specks are joined into triangles, with a little geometry", async ({ page }) => {
  await page.addInitScript(() => {
    window.__drawn = { fills: 0, strokes: 0, arcs: 0, dashes: 0, angles: 0 };
    const P = CanvasRenderingContext2D.prototype, fill = P.fill, stroke = P.stroke, arc = P.arc, dash = P.setLineDash, text = P.fillText;
    const ours = (c) => c.canvas.classList.contains("re-canvas");
    P.fill = function () { if (ours(this)) window.__drawn.fills++; return fill.apply(this, arguments); };
    P.stroke = function () { if (ours(this)) window.__drawn.strokes++; return stroke.apply(this, arguments); };
    P.arc = function () { if (ours(this)) window.__drawn.arcs++; return arc.apply(this, arguments); };
    P.setLineDash = function (d) { if (ours(this) && d && d.length) window.__drawn.dashes++; return dash.apply(this, arguments); };
    P.fillText = function (t) { if (ours(this) && /^\d+°$/.test(String(t))) window.__drawn.angles++; return text.apply(this, arguments); };
  });
  await page.clock.install();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(RESEARCHES);
  await page.clock.runFor(6000);
  const before = await page.evaluate(() => ({ ...window.__drawn }));
  await page.clock.runFor(1000);
  const after = await page.evaluate(() => ({ ...window.__drawn }));
  expect(after.fills - before.fills, "triangles filled").toBeGreaterThan(20);
  expect(after.strokes - before.strokes, "and their lines drawn").toBeGreaterThan(100);
  expect(after.arcs - before.arcs, "a span's angles marked").toBeGreaterThan(10);
  expect(after.angles - before.angles, "and one written in degrees").toBeGreaterThan(10);
  expect(after.dashes - before.dashes, "the equator drawn dashed").toBeGreaterThan(10);
});

/* EVERY FORM IN THE CYCLE can be held on the page (`?form=`), is named in
   the caption, and is drawn — a shape whose numbers came out wrong draws
   only its haze. Held, there are no arrows. The forms not chosen — the
   galaxy, the sphere, the gas cloud and the rest — are gone. */
test("every form in the cycle can be held, and draws itself; the ones not chosen are gone", async ({ page }) => {
  test.slow();
  const errors = collectPageErrors(page);
  await page.clock.install();
  await page.setViewportSize({ width: 1440, height: 900 });
  const ink = () => page.evaluate(() => {
    const c = document.querySelector(".re-canvas"), d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 40) n++;
    return n;
  });
  const inks = {};
  for (const form of CYCLE) {
    await page.goto(RESEARCHES + "?form=" + form);
    await page.clock.runFor(3000);
    await expect(page.locator(".re-field")).toHaveAttribute("data-cycle", form);
    await expect(page.locator(".re-caption-name")).toHaveText(FORM_NAMES[form]);
    await expect(page.locator(".re-next"), "held, no arrows").toBeHidden();
    inks[form] = await ink();
  }
  const most = Math.max(...Object.values(inks));
  for (const form of CYCLE) expect(inks[form], form + " is drawn, not only its haze").toBeGreaterThan(most * 0.3);
  for (const gone of ["galaxy", "sphere", "cloud", "knot", "torus", "spiral", "lattice", "hyperboloid", "buckyball"]) {
    await page.goto(RESEARCHES + "?form=" + gone);
    await expect(page.locator(".re-field"), gone + " is not a form: the page runs its cycle").toHaveAttribute("data-cycle", CYCLE.join(","));
  }
  expect(errors).toEqual([]);
});

test("the field answers the pointer over it",
  async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(RESEARCHES);
  await page.waitForTimeout(2200);
  // THE POINTER PARTS THE SPECKS: the inkiest patch of the form near its
  // middle, with the pointer held on it, has less ink under the pointer
  // than it had.
  const inkAt = ({ x, y }) => {
    const c = document.querySelector(".re-canvas"), r = c.getBoundingClientRect(), k = c.width / r.width;
    const d = c.getContext("2d").getImageData(Math.round((x - r.left - 18) * k), Math.round((y - r.top - 18) * k), Math.round(36 * k), Math.round(36 * k)).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 40) n++;
    return n;
  };
  const spot = await page.evaluate((inkAtSrc) => {
    const inkAt = eval("(" + inkAtSrc + ")");
    const r = document.querySelector(".re-canvas").getBoundingClientRect();
    let best = null;
    for (let gy = -3; gy <= 3; gy++) for (let gx = -3; gx <= 3; gx++) {
      const p = { x: r.left + r.width / 2 + gx * 36, y: r.top + r.height * 0.47 + gy * 36 }, n = inkAt(p);
      if (!best || n > best.n) best = { ...p, n };
    }
    return best;
  }, inkAt.toString());
  const under = () => page.evaluate(inkAt, spot);
  const before = await under();
  await page.mouse.move(spot.x, spot.y);
  await page.mouse.move(spot.x + 1, spot.y, { steps: 2 });
  await page.waitForTimeout(900);
  const parted = await under();
  expect(before, "the form has ink where the pointer goes").toBeGreaterThan(10);
  expect(parted, "and the pointer parts it").toBeLessThan(before * 0.6);
  expect(errors).toEqual([]);
});

test.describe("the field with animation turned off", () => {
  test("the first form is simply there, nothing moves, and the arrows change it without moving", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = collectPageErrors(page);
    await page.clock.install();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(RESEARCHES);
    await page.clock.runFor(500);
    const a = await fieldInk(page);
    expect(a.ink, "the geodesic sphere is drawn at once").toBeGreaterThan(400);
    await expect(page.locator(".re-field")).toHaveAttribute("data-figure", "geodesic");
    // Long past when it would have turned into the rings, it has not.
    await page.clock.runFor(25000);
    const b = await fieldInk(page);
    expect(apart(a, b), "and stands still").toBe(0);
    await expect(page.locator(".re-field")).toHaveAttribute("data-figure", "geodesic");
    // An arrow: the next form, drawn at once, and still.
    await page.locator(".re-next").click();
    await expect(page.locator(".re-field")).toHaveAttribute("data-figure", "borromean");
    await expect(page.locator(".re-field")).toHaveAttribute("data-phase", "hold");
    await expect(page.locator(".re-caption-name")).toHaveText("Borromean rings");
    const c = await fieldInk(page);
    expect(apart(c, a), "a different drawing").toBeGreaterThan(30);
    await page.clock.runFor(3000);
    expect(apart(await fieldInk(page), c), "standing still").toBe(0);
    expect(errors).toEqual([]);
  });
});

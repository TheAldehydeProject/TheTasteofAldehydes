// ============================================================
// THE NEWER HOUSES, AND THE SHAPE THEY SHARE
//
// Ataraxia (04), Grande Parfums (05) and Les Abstraits (06) arrived
// together, and together they are the reason house.js exists: the
// older three each carry their own copy of the part-opening and the
// rank, and three more copies would have been six places to fix one
// bug. These check the shared shape works on all three, and then the
// things that are true of one house only.
//
// WHAT IS NOT CHECKED HERE is what the drawings look like. The suite
// checks that things work, not that they look right.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const ATARAXIA = "/houses/ataraxia.html";
const GRANDE = "/houses/grande-parfums.html";
const ABSTRAITS = "/houses/les-abstraits.html";
const TALE = "/houses/tale-parfums.html";
const TOMBSTONE = "/houses/tombstone.html";
const QIMU = "/houses/qimu-and-musicians.html";
const SHEET = "/scent-descriptions/";

test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
});

/* NINE HOUSES, IN THE ORDER THEY ARE NUMBERED. Tale Parfums is the
   seventh, Tombstone the eighth and Qimu & Musicians the ninth — and the
   chain stops at nine for now, at the owner's word. The sheet is the way in
   to all of them, and a house that is not on it cannot be reached from
   the category at all. The ORDER matters as much as the names: the
   contact sheet's report says the pictures run in order down the page,
   and every house's own kicker says which number it is. */
test("all nine houses stand on the contact sheet, in their own order",
  async ({ page }) => {
  await page.goto(SHEET);

  const names = await page.$$eval(".sheet-name", (all) =>
    all.map((n) => n.textContent.trim()));
  expect(names).toEqual([
    "Pineward", "ADAR", "Almost Human", "Ataraxia", "Grande Parfums", "Les Abstraits",
    "Tale Parfums", "Tombstone", "Qimu & Musicians",
  ]);

  // And every one of them is a link to a page that opens.
  const hrefs = await page.$$eval(".sheet-frame:not([data-open='no'])", (all) =>
    all.map((a) => a.getAttribute("href")));
  expect(hrefs).toEqual([
    "../houses/pineward.html",
    "../houses/adar.html",
    "../houses/almost-human.html",
    "../houses/ataraxia.html",
    "../houses/grande-parfums.html",
    "../houses/les-abstraits.html",
    "../houses/tale-parfums.html",
    "../houses/tombstone.html",
    "../houses/qimu-and-musicians.html",
  ]);
});

/* UNDER A HOUSE'S NAME, ONLY ITS SUBTITLE — AND THE SUBTITLE IN TITLE
   CASE. The owner: "remove the lines that are below the subtitle in the
   houses, so that lines such as 'Replace this line with your own
   standing first paragraph ...' should be removed from all of the
   houses", and "the subtitles like 'The house that smells like trees'
   should have every other word capitalized (like the titles of books in
   the real world)". So no house carries a standfirst, and every
   subtitle — on the house's page and under its picture on the Houses
   view — capitalises every word but the short joining ones. */
const HOUSE_PAGES = ["pineward", "adar", "almost-human", "ataraxia", "grande-parfums",
  "les-abstraits", "tale-parfums", "tombstone", "qimu-and-musicians"];
const SMALL = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "at", "by", "in", "of", "on", "to", "as", "up"]);
const notTitled = (line) => line.split(/\s+/).filter((word, i) => {
  const first = word.replace(/^[^\p{L}\d]+/u, "").charAt(0);
  if (!first || !/\p{L}/u.test(first)) return false;
  if (i > 0 && SMALL.has(word.toLowerCase())) return false;
  return first !== first.toUpperCase();
});
test("no house has a line under its subtitle, and every subtitle is in title case", async ({ page }) => {
  for (const house of HOUSE_PAGES) {
    await page.goto(`/houses/${house}.html`);
    await expect(page.locator(".human-standfirst, .adar-standfirst, .pine-standfirst"), `${house}: a standfirst`).toHaveCount(0);
    const subtitle = await page.locator("h1 em").allTextContents();
    subtitle.forEach((line) => expect(notTitled(line), `${house}: "${line}"`).toEqual([]));
  }
  await page.goto(SHEET);
  const says = await page.locator(".sheet-say").allTextContents();
  expect(says.length).toBe(9);
  says.forEach((line) => expect(notTitled(line), `"${line}"`).toEqual([]));
});

/* THE ORDER THE OWNER ASKED FOR, in as many words: "Ill ask that you
   arrange them alphabetically, as I will input them non-
   alphabetically". They sent fifteen write-ups in no order at all, so
   this is the one thing about this house that could quietly be wrong
   and look fine.

   Compared with the list SORTED, rather than against a list written
   out again here: a list written out again is the same mistake twice
   if it was made once. */
test("Grande Parfums is in alphabetical order, and numbered in its markup",
  async ({ page }) => {
  await page.goto(GRANDE);

  await expect(page.locator(".human-part")).toHaveCount(15);

  const names = await page.$$eval(".human-part .human-title", (all) =>
    all.map((n) => n.textContent.trim()));
  const sorted = [...names].sort((a, b) =>
    a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  expect(names).toEqual(sorted);
  // A number sorts before a letter, so the anniversary is first.
  expect(names[0]).toMatch(/^5 Years Anniversary/);

  const numbers = await page.$$eval(".human-part .human-no", (all) =>
    all.map((n) => n.textContent.trim()));
  expect(numbers).toEqual(names.map((_, i) => String(i + 1).padStart(2, "0")));

  // The ids are what the Fragrances table links at, so they have to
  // match the numbers that are read. repository.spec.js checks the
  // table's end of that; this is the house's end.
  const ids = await page.$$eval(".human-part", (all) => all.map((one) => one.id));
  expect(ids).toEqual(numbers.map((n) => "part-" + n));
});

/* AND THE TWO THAT HAVE NOT BEEN SMELLED are names at the foot with
   nothing behind them, the way Pineward's eight are — NOT parts with
   empty writing. A fragrance nobody has smelled has nothing to open. */
test("the two unsmelled Grande fragrances are names at the foot, not parts",
  async ({ page }) => {
  await page.goto(GRANDE);

  const waiting = await page.$$eval(".house-waiting-name", (all) =>
    all.map((n) => n.textContent.trim()));
  expect(waiting).toEqual(["Genesys", "Lounge Leather"]);

  // Neither of them is also a part, which would be the house counting
  // itself twice.
  const parts = await page.$$eval(".human-part .human-title", (all) =>
    all.map((n) => n.textContent.trim()));
  waiting.forEach((name) => expect(parts).not.toContain(name));
});

/* THE STANDOUT MARK IS DRAWN, NOT TYPED. The owner asked for "a
   handdrawn star", which a typed star character is not — and a typed
   one would be indistinguishable from this in a screenshot while being
   exactly the thing they did not ask for. So: an SVG path, on Vintage
   Memoir and on nothing else.

   The path is checked for CURVES. A star drawn with straight lines is
   a star a computer worked out; the bowed edges are the whole of what
   makes it look drawn. */
test("the standout star is a drawn path, and only Vintage Memoir has one",
  async ({ page }) => {
  await page.goto(GRANDE);

  await expect(page.locator(".human-part .human-star")).toHaveCount(1);

  const on = await page.$eval(".human-star", (star) =>
    star.closest(".human-part").querySelector(".human-title").textContent.trim());
  expect(on).toBe("Vintage Memoir");

  const d = await page.$eval(".human-star svg path", (p) => p.getAttribute("d"));
  // Quadratic curves, one per edge of a five-pointed star.
  expect((d.match(/Q/g) || []).length).toBeGreaterThanOrEqual(10);
  // And nothing in it is a straight line.
  expect(d).not.toContain("L");
});

/* THE SHARED SHAPE, ON ALL THREE. house.js gives each of them the same
   two things the older houses have their own copies of: a part that
   opens on a measured height, and the rank down the side. Run over
   every new house rather than over one, because the whole point of a
   shared script is that it is the same everywhere. */
for (const [name, url, parts] of [
  ["Ataraxia", ATARAXIA, 5],
  ["Grande Parfums", GRANDE, 15],
  ["Les Abstraits", ABSTRAITS, 4],
  ["Tale Parfums", TALE, 4],
  ["Tombstone", TOMBSTONE, 5],
  ["Qimu & Musicians", QIMU, 4],
]) {
  test(`${name} opens a fragrance and carries a rank of ${parts}`, async ({ page }) => {
    // NOT ONE OF THESE HOUSES HAS ITS PHOTOGRAPHS YET, and every part
    // asks for the file it wants by name so it shows the moment that
    // file is there — so a 404 per picture is what a working page
    // looks like today. The same allowance Almost Human's spec makes.
    const errors = collectPageErrors(page, ["Failed to load resource"]);
    await page.goto(url);
    await page.waitForTimeout(500);

    await expect(page.locator(".human-part")).toHaveCount(parts);
    // One tick per fragrance, built by house.js rather than written in
    // the markup.
    await expect(page.locator(".human-tick")).toHaveCount(parts);
    await expect(page.locator(".human-rank")).toHaveCount(1);

    const first = page.locator(".human-part").first();
    await expect(first).not.toHaveAttribute("open", /.*/);
    await first.locator("summary").click();
    // It opens on a measured height, so it is not open in the same
    // frame it was clicked in — waited out rather than asserted at once.
    await page.waitForTimeout(1100);
    await expect(first).toHaveAttribute("open", /.*/);
    const tall = await first.locator(".human-body").evaluate(
      (el) => el.getBoundingClientRect().height);
    expect(tall, "an opened fragrance should have a height").toBeGreaterThan(40);

    expect(errors, `${name} should throw nothing`).toEqual([]);
  });
}

/* THE RANK READS THE PAGE FROM ITS VERY FIRST PIXEL, which is the one
   thing about it the owner reported as wrong on the older houses: it
   used to start at the first fragrance, so the whole introduction
   scrolled past an empty line. And it FINISHES FULL at the foot. */
test("the rank fills from the first pixel of scroll, and finishes full",
  async ({ page }) => {
  await page.goto(GRANDE);
  await page.waitForTimeout(400);

  const filled = () => page.$eval(".human-rank-fill", (el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return m.d;
  });

  expect(await filled()).toBeLessThan(0.02);

  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  const part = await filled();
  expect(part, "it should have moved off nought well before the first fragrance")
    .toBeGreaterThan(0.01);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  expect(await filled()).toBeGreaterThan(0.98);
});

/* ATARAXIA'S BANDS ARE DRAWN, AND THEY CROSS THE WHOLE WINDOW.

   This replaced a churchyard of angel statues and crosses standing
   down the two margins, and the invariant has turned over with it. The
   churchyard's rule was that NO INK may land where the reading is —
   a statue with half of it in the quiet band read as a smear rather
   than as a figure, which is the fault that test existed for.

   THE BANDS ARE THE OPPOSITE, and the owner asked for it in as many
   words: "I want them to go behind the text. Idk how but make it so
   that the readability is good." A band that stopped at the column and
   started again on the other side would not be a band. So there MUST
   be ink over the writing — and it must be much fainter there than in
   the margins, which is the whole of how the reading is kept.

   SO THIS MEASURES BOTH, and the second is the one that matters. It
   samples down the whole page rather than the first screen: which
   bands happen to be on screen at any one moment is the seed's
   business, and the quiet is a property of every one of them. */
test("the bands cross the whole window, and go quiet over the writing",
  async ({ page }) => {
  const errors = collectPageErrors(page, ["Failed to load resource"]);
  await page.goto(ATARAXIA);
  await page.waitForTimeout(1400);

  // THREE ZONES, and the middle one is thrown away. The quieting eases
  // in over SOFT pixels either side of the column, so the band between
  // `edge - SOFT` and `edge` is neither full strength nor quiet and
  // says nothing either way. What is measured is the CLEAR MARGIN
  // outside it and the COLUMN PROPER inside it — where the reading
  // actually is, and where `quiet()` is at exactly its floor.
  const sample = () => page.evaluate(() => {
    const el = document.querySelector(".human-field");
    const g = el.getContext("2d", { willReadFrequently: true });
    const im = g.getImageData(0, 0, el.width, el.height).data;
    const ratio = el.width / window.innerWidth;
    const edge = (window.innerWidth - 940) / 2;   // COLUMN in ataraxia.js
    const soft = 96;                              // SOFT in ataraxia.js
    let clearInk = 0, clearOn = 0, quietInk = 0, quietOn = 0;
    for (let i = 0; i < im.length; i += 4) {
      const a = im[i + 3];
      if (a <= 4) continue;
      const x = ((i / 4) % el.width) / ratio;
      if (x > edge && x < window.innerWidth - edge) { quietInk += a; quietOn += 1; }
      else if (x < edge - soft || x > window.innerWidth - edge + soft) {
        clearInk += a; clearOn += 1;
      }
    }
    return { clearInk, clearOn, quietInk, quietOn };
  });

  let clearInk = 0, clearOn = 0, quietInk = 0, quietOn = 0;
  for (let n = 0; n < 8; n++) {
    await page.evaluate((y) => window.scrollTo(0, y), n * 640);
    await page.waitForTimeout(320);
    const got = await sample();
    clearInk += got.clearInk; clearOn += got.clearOn;
    quietInk += got.quietInk; quietOn += got.quietOn;
  }

  expect(clearOn, "there should be bands at all").toBeGreaterThan(4000);
  // THEY GO BEHIND THE WRITING. A drawing kept out of the middle of
  // the page is the thing that was asked NOT to happen.
  expect(quietOn, "the bands should pass behind the writing, not round it")
    .toBeGreaterThan(400);

  // AND THIS IS THE READING'S OWN GUARANTEE: what is over the writing
  // is far fainter than what is beside it. Measured as the average
  // weight of a lit pixel rather than as a count, because a count says
  // how many and this has to say how loud.
  const clear = clearInk / clearOn;
  const quiet = quietInk / quietOn;
  expect(quiet, `over the writing ${quiet.toFixed(1)}, beside it ${clear.toFixed(1)}`)
    .toBeLessThan(clear * 0.6);

  expect(errors).toEqual([]);
});

/* AND THE PAGE IS DARK GRAY, with the writing light on it. The owner
   asked for dark gray specifically, which is not ADAR's near-black
   next door, and the bands are white and additive — they need a ground
   dark enough to read as light.

   THE CONTRAST IS THE POINT of measuring it rather than the hex: a
   page turned over by redefining its five tokens can be turned
   halfway over by mistake, and light-on-light is what that looks
   like. */
test("Ataraxia is dark gray, and its writing is light on it", async ({ page }) => {
  await page.goto(ATARAXIA);
  await page.waitForTimeout(900);

  const seen = await page.evaluate(() => {
    const lum = (css) => {
      const n = css.match(/[\d.]+/g).map(Number);
      return 0.2126 * n[0] + 0.7152 * n[1] + 0.0722 * n[2];
    };
    return {
      ground: lum(getComputedStyle(document.body).backgroundColor),
      heading: lum(getComputedStyle(document.querySelector("h1")).color),
      reading: lum(getComputedStyle(document.querySelector(".human-text p")).color),
      dark: document.body.classList.contains("dark-surface"),
    };
  });

  // Dark, and gray rather than black: ADAR's ground is about 7.
  expect(seen.ground, `the ground reads ${seen.ground.toFixed(1)}`)
    .toBeGreaterThan(20);
  expect(seen.ground).toBeLessThan(70);
  expect(seen.heading, "the heading has to be light on it")
    .toBeGreaterThan(seen.ground + 120);
  expect(seen.reading, "and so has the reading")
    .toBeGreaterThan(seen.ground + 90);
  // A dark page has to say so, or the cursor cannot be seen on it.
  expect(seen.dark, "a dark page carries dark-surface").toBe(true);
});

/* THE KINDLE — the one thing on that page that answers the hand. The
   specks within reach of the pointer burn brighter, so what this
   measures is the ink going UP where the pointer arrives, STAYING up a
   moment after it leaves, and then coming back down.

   IT COUNTS ONE CORNER rather than the whole canvas, because the crest
   travelling along each band changes the total on its own and would
   swamp the reading. */
test("the specks kindle under the pointer, linger a moment, and go out again",
  async ({ page }) => {
  await page.goto(ATARAXIA);
  await page.waitForTimeout(1500);

  const ink = () => page.evaluate(() => {
    const el = document.querySelector(".human-field");
    const g = el.getContext("2d", { willReadFrequently: true });
    const ratio = el.width / window.innerWidth;
    // A box round where the pointer will be put, in canvas pixels.
    const x0 = Math.round(40 * ratio), y0 = Math.round(220 * ratio);
    const w = Math.round(320 * ratio), h = Math.round(320 * ratio);
    const im = g.getImageData(x0, y0, w, h).data;
    let n = 0;
    for (let i = 3; i < im.length; i += 4) n += im[i];
    return n;
  });

  await page.mouse.move(900, 700);
  await page.waitForTimeout(700);
  const away = await ink();
  await page.mouse.move(200, 380);
  await page.waitForTimeout(700);
  const near = await ink();
  await page.mouse.move(900, 700);
  // AND THEY LINGER: "a delay of the particles turning off after you
  // hover them". A moment after the pointer has gone they are still
  // burning; they go out over the next second or two. They used to go
  // out the instant it moved on.
  await page.waitForTimeout(150);
  const after = await ink();
  await page.waitForTimeout(2600);
  const gone = await ink();

  expect(near, `away ${away}, near ${near}`).toBeGreaterThan(away * 1.15);
  expect(after, `a moment after the pointer left: ${after}, against ${away} away`).toBeGreaterThan(away * 1.15);
  expect(gone, `after ${after}, gone ${gone}`).toBeLessThan(after);
  expect(gone, `and back about where it was: away ${away}, gone ${gone}`).toBeLessThan(near * 0.95);
});

/* GRANDE PARFUMS HAS A GROUND, and since the night of 2026-09-25 it is as
   strong as its hover on the Houses view — "Intensify the particles in
   grande parfums particle page (make it like the hover in SD)". It was
   the quietest ground on the site ("subtle designs please"): at
   1280 × 720, a second and a half in, about 280 lit pixels in the
   margins weighing 4,700 of alpha between them, where the new one has
   about 1,200 weighing over 40,000. So what is checked now is that it
   is THERE, that it carries several times the old ink, and that it
   still keeps off the writing — a drift that fights the words is still
   wrong. (The mean of a lit pixel is no gauge: a small soft speck is
   mostly edge, and its edges are partly lit.) */
test("Grande Parfums has a drift as strong as its hover, quiet over the writing", async ({ page }) => {
  const errors = collectPageErrors(page, ["Failed to load resource"]);
  await page.goto(GRANDE);
  await page.waitForTimeout(1600);

  const seen = await page.evaluate(() => {
    const el = document.querySelector(".human-field");
    if (!el) return null;
    const g = el.getContext("2d", { willReadFrequently: true });
    const im = g.getImageData(0, 0, el.width, el.height).data;
    const ratio = el.width / window.innerWidth;
    let on = 0, weight = 0, top = 0, bottom = 0, over = 0, overOn = 0;
    const edge = (window.innerWidth - 940) / 2;
    for (let i = 0; i < im.length; i += 4) {
      const a = im[i + 3];
      if (a <= 4) continue;
      const x = ((i / 4) % el.width) / ratio;
      const y = Math.floor((i / 4) / el.width) / ratio;
      if (x > edge + 120 && x < window.innerWidth - edge - 120) { over += a; overOn++; continue; }
      on += 1;
      weight += a;
      if (y < window.innerHeight / 2) top += 1; else bottom += 1;
    }
    return { on, weight, mean: on ? weight / on : 0, top, bottom, overMean: overOn ? over / overOn : 0 };
  });

  expect(seen, "the page should have a canvas").toBeTruthy();
  expect(seen.on, "there should be a drift at all").toBeGreaterThan(600);

  // AS STRONG AS THE HOVER: the margins carry several times the ink the
  // quiet drift did — and over the writing a lit pixel weighs less.
  expect(seen.weight, `the margins carry ${seen.weight} of alpha`).toBeGreaterThan(20000);
  expect(seen.overMean, `over the writing ${seen.overMean.toFixed(1)}, in the margins ${seen.mean.toFixed(1)}`)
    .toBeLessThan(seen.mean);

  // AND IT IS SPREAD OVER THE PAGE. The first version rolled each
  // speck's lifetime apart from its speed, so a slow one lived and
  // died in thirty-six pixels and the whole drift was a smudge along
  // the bottom edge. A lifetime is worked out from the speed now.
  expect(seen.top, `${seen.top} specks in the top half, ${seen.bottom} in the bottom`)
    .toBeGreaterThan(seen.on * 0.2);

  expect(errors).toEqual([]);
});

/* GRANDE'S PARTICLES BURST. "a particle effect of bubbling (i dont want
   it to seem comical or drawn up like with tale), but particles that
   rise up and pop more or less into a bunch of other smaller
   particles". Read off what the page's canvas is asked to draw over a
   few seconds: the specks themselves, the finer specks of the bursts
   among them, and nothing stroked — no ring, no outline, no bubble. */
test("Grande Parfums' particles rise and burst into finer ones, with no bubble drawn", async ({ page }) => {
  await page.addInitScript(() => {
    window.__grande = { whole: 0, fine: 0, strokes: 0 };
    const P = CanvasRenderingContext2D.prototype;
    const fillRect = P.fillRect, stroke = P.stroke;
    P.fillRect = function (x, y, w) {
      if (this.canvas.classList.contains("human-field")) { if (w < 1) window.__grande.fine++; else window.__grande.whole++; }
      return fillRect.apply(this, arguments);
    };
    P.stroke = function () {
      if (this.canvas.classList.contains("human-field")) window.__grande.strokes++;
      return stroke.apply(this, arguments);
    };
  });
  await page.goto(GRANDE);
  await page.waitForTimeout(3000);
  const seen = await page.evaluate(() => window.__grande);
  expect(seen.whole, "the rising specks").toBeGreaterThan(5000);
  expect(seen.fine, "and the finer ones they burst into").toBeGreaterThan(200);
  expect(seen.strokes, "nothing drawn round them").toBe(0);
});

/* FOUR HOUSES ON PAPER OF THEIR OWN. "feel free to give them some
   colour in the background, the same way you have in the case of
   pineward (green) and tale (some muted orange) ... Qimu should be blue
   though; semi light blue." None of the four is white any more; Qimu's
   is blue — its blue channel well above its red — and still light. */
test("Grande, Les Abstraits, Tombstone and Qimu each have a paper of their own, and Qimu's is blue",
  async ({ page }) => {
  const papers = {};
  for (const url of [GRANDE, ABSTRAITS, TOMBSTONE, QIMU]) {
    await page.goto(url);
    papers[url] = await page.evaluate(() => {
      const m = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g).map(Number);
      return { r: m[0], g: m[1], b: m[2] };
    });
  }
  Object.entries(papers).forEach(([url, c]) =>
    expect(c.r === 255 && c.g === 255 && c.b === 255, `${url} is still white`).toBe(false));
  const q = papers[QIMU];
  expect(q.b - q.r, `Qimu's paper ${JSON.stringify(q)}`).toBeGreaterThan(12);
  expect(q.r + q.g + q.b, "and light").toBeGreaterThan(600);
  expect(new Set(Object.values(papers).map((c) => `${c.r},${c.g},${c.b}`)).size, "four different papers").toBe(4);
});

/* TOMBSTONE: STONES, AND THEIR REFLECTION. "very dead and funerary ...
   a reflection in the design ... ephermeral". Read off the page's
   canvas: stones in the margins above the horizon, and under it the
   same margins holding their reflection — there, and fainter than
   what it reflects. EPHEMERAL: a stone does not stay — over a long
   wait what stands in the margins comes and goes. */
test("Tombstone's stones stand in the margins with their reflections under them", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto(TOMBSTONE);
  const read = () => page.evaluate(() => {
    const el = document.querySelector(".human-field");
    const g = el.getContext("2d", { willReadFrequently: true });
    const r = el.width / innerWidth;
    const d = g.getImageData(0, 0, el.width, el.height).data;
    const horizon = Math.round(innerHeight * 0.76);
    const edge = (innerWidth - 940) / 2 - 40;
    let above = 0, aboveInk = 0, below = 0, belowInk = 0;
    for (let y = 0; y < el.height; y += 2) {
      for (let x = 0; x < el.width; x += 2) {
        const cx = x / r, cy = y / r;
        if (cx > edge && cx < innerWidth - edge) continue;
        const a = d[(y * el.width + x) * 4 + 3];
        if (a <= 8) continue;
        if (cy < horizon - 3) { above++; aboveInk += a; }
        else if (cy > horizon + 3) { below++; belowInk += a; }
      }
    }
    return { above, below, aboveMean: aboveInk / Math.max(1, above), belowMean: belowInk / Math.max(1, below) };
  });
  await page.waitForTimeout(9000);
  const now = await read();
  expect(now.above, "stones stand in the margins").toBeGreaterThan(400);
  expect(now.below, "and their reflection lies under them").toBeGreaterThan(now.above * 0.2);
  expect(now.belowMean, `the reflection is fainter: ${now.belowMean.toFixed(0)} under, ${now.aboveMean.toFixed(0)} over`)
    .toBeLessThan(now.aboveMean * 0.8);
  // A stone gathers, stands and goes, and the next is a while coming:
  // over half a minute what stands in the margins waxes and wanes.
  const seen = [];
  for (let i = 0; i < 22; i++) {
    await page.waitForTimeout(1000);
    seen.push((await read()).above);
  }
  expect(Math.min(...seen), `nothing here stays: ${seen.join(" ")}`).toBeLessThan(Math.max(...seen) * 0.7);
});

/* LES ABSTRAITS: THE ARMOIRE, THE DRIP AND THE BEAKER. "an old armoire
   on one of the sides ... has some iris notes in it ... like the perfume
   belle ame ... On the other side ... a dripping effect from the top of
   the page to the bottom" — and then: "the dropping thing ... should go
   all the way down, and should note the scrolling. additionally, I want
   the puddle to be more realistic ... I want it to fall into a beaker,
   once the beaker starts overflowing, let it drip from that too". Read off
   the page's canvas: the armoire in the left margin with the iris's violet
   drawn in it; the drop gathering at the very top of the right margin —
   and gone from there once the page is scrolled, because it is the top of
   the PAGE it hangs from; nothing at the foot of the window while the page
   is at its top; and at the page's own foot a beaker, which fills with the
   drops and then overflows, dropping from its spout. */
test("Les Abstraits has its armoire with iris on one side and a drip down the whole page into a beaker on the other",
  async ({ page }) => {
  test.setTimeout(240000);
  await page.addInitScript(() => {
    window.__iris = false;
    window.__clothes = new Set();
    window.__words = new Set();
    const P = CanvasRenderingContext2D.prototype;
    // WHAT IS WRITTEN on the page's canvas: the beaker's graduations and
    // nothing else — the pointer and its running number ("◀ 258") were
    // taken off at the owner's word (2026-09-25).
    const fillText = P.fillText;
    P.fillText = function (t) {
      if (this.canvas.classList.contains("human-field")) window.__words.add(String(t));
      return fillText.apply(this, arguments);
    };
    const d = Object.getOwnPropertyDescriptor(P, "strokeStyle");
    Object.defineProperty(P, "strokeStyle", {
      get() { return d.get.call(this); },
      set(v) { if (/^rgba\(112,\s*94,\s*156/.test(String(v))) window.__iris = true; d.set.call(this, v); },
    });
    // THE CLOTHES in it — a coat, a dress and a shirt — read off the
    // colours its specks are drawn in.
    const f = Object.getOwnPropertyDescriptor(P, "fillStyle");
    const CLOTHES = { "118, 104, 92": "coat", "154, 132, 168": "dress", "140, 156, 180": "shirt" };
    Object.defineProperty(P, "fillStyle", {
      get() { return f.get.call(this); },
      set(v) {
        const m = /^rgba\((\d+, \d+, \d+),/.exec(String(v));
        if (m && CLOTHES[m[1]]) window.__clothes.add(CLOTHES[m[1]]);
        f.set.call(this, v);
      },
    });
  });
  // ON A CLOCK OF THE TEST'S OWN: the drip is slow now ("make the
  // dripping slower, less filling") — a drop every two or three seconds
  // and thirty-two to the brim since it was halved again ("half the
  // filling speed") — so the minute and a half it takes to fill is run
  // through rather than waited out.
  await page.clock.install();
  await page.goto(ABSTRAITS);
  const read = () => page.evaluate(() => {
    const el = document.querySelector(".human-field");
    const g = el.getContext("2d", { willReadFrequently: true });
    const r = el.width / innerWidth;
    const margin = (innerWidth - 940) / 2;
    const count = (x1, x2, y1, y2) => {
      const d = g.getImageData(Math.round(x1 * r), Math.round(y1 * r), Math.round((x2 - x1) * r), Math.round((y2 - y1) * r)).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 10) n++;
      return n;
    };
    return { armoire: count(0, margin, innerHeight * 0.3, innerHeight),
      top: count(innerWidth - margin, innerWidth, 0, 16),
      foot: count(innerWidth - margin, innerWidth, innerHeight - 160, innerHeight),
      drops: +(el.dataset.drops || 0), spilled: +(el.dataset.spilled || 0) };
  });
  await page.clock.runFor(2600);
  const atTop = await read();
  expect(atTop.armoire, "the armoire in the left margin").toBeGreaterThan(1500);
  expect(await page.evaluate(() => window.__iris), "with iris in it").toBe(true);
  expect(await page.evaluate(() => [...window.__clothes].sort()), "and a coat, a dress and a shirt hung in it")
    .toEqual(["coat", "dress", "shirt"]);
  expect(atTop.top, "the drop gathering at the very top of the page").toBeGreaterThan(10);
  expect(atTop.foot, "and nothing at the foot of the window while the page is at its top").toBeLessThan(20);
  // CARRIED WITH THE PAGE: scrolled, the top of the page — and the bead
  // hanging from it — has gone up off the window.
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.clock.runFor(300);
  expect((await read()).top, "the bead goes up with the page").toBeLessThan(3);
  // THE BEAKER, at the page's own foot: there, filling, and in time
  // overflowing and dropping from its spout.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.clock.runFor(600);
  const early = await read();
  expect(early.foot, "a beaker at the foot of the page").toBeGreaterThan(200);
  await page.clock.runFor(160000);
  const late = await read();
  expect(late.drops, "the drops land in it").toBeGreaterThan(early.drops + 5);
  expect(late.spilled, "and once it is full, it drips over").toBeGreaterThan(0);
  expect(late.foot, `and it fills: ${early.foot} then ${late.foot}`).toBeGreaterThan(early.foot * 1.3 + 30);
  const words = await page.evaluate(() => [...window.__words].sort());
  expect(words.every((w) => /^(50|100|150|200|ml)$/.test(w)), `only its graduations are written: ${words.join(" ")}`)
    .toBe(true);
});

/* QIMU & MUSICIANS: A SCORE IN THE MARGINS. "add some complex notes;
   and some 5 lines in which they will exist ... nicely animated ...
   dont make them always 4/4 ... make it random (as long as its an
   actual used notation) ... Overall ... subtle". Read off what the
   page's canvas is asked to draw: noteheads, times other than 4/4,
   nothing written but numbers (no dynamics, no ornaments — and, while
   nothing is pointed at, no names), nothing stronger than a little over
   half — and the staves CARRIED WITH THE PAGE: scroll it and every stave
   is drawn that much higher. */
test("Qimu & Musicians keeps a quiet score in its margins, carried with the page", async ({ page }) => {
  await page.addInitScript(() => {
    window.__q = { heads: 0, texts: new Set(), strongest: 0, tops: [] };
    const P = CanvasRenderingContext2D.prototype;
    const on = (c) => c.canvas.classList.contains("human-field");
    const ellipse = P.ellipse, fillText = P.fillText, translate = P.translate;
    P.ellipse = function () { if (on(this)) window.__q.heads++; return ellipse.apply(this, arguments); };
    P.fillText = function (t) { if (on(this)) window.__q.texts.add(String(t)); return fillText.apply(this, arguments); };
    P.translate = function (x, y) { if (on(this)) window.__q.tops.push(Math.round(y)); return translate.apply(this, arguments); };
    const d = Object.getOwnPropertyDescriptor(P, "fillStyle");
    Object.defineProperty(P, "fillStyle", {
      get() { return d.get.call(this); },
      set(v) {
        if (on(this)) { const m = /,\s*([\d.]+)\)$/.exec(String(v)); if (m) window.__q.strongest = Math.max(window.__q.strongest, +m[1]); }
        d.set.call(this, v);
      },
    });
  });
  await page.goto(QIMU);
  await page.waitForTimeout(3500);
  const seen = await page.evaluate(() => ({ heads: window.__q.heads, texts: [...window.__q.texts], strongest: window.__q.strongest }));
  expect(seen.heads, "notes written").toBeGreaterThan(100);
  const numbers = seen.texts.filter((t) => /^\d+$/.test(t));
  expect(numbers.some((t) => t !== "4"), `times other than 4/4: ${numbers.join(" ")}`).toBe(true);
  expect(seen.texts.filter((t) => !/^\d+$/.test(t)), "nothing written but numbers").toEqual([]);
  expect(seen.strongest, "subtle").toBeLessThanOrEqual(0.6);
  // Carried with the page.
  const before = await page.evaluate(async () => {
    window.__q.tops = [];
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return [...new Set(window.__q.tops)];
  });
  await page.evaluate(() => window.scrollBy(0, 200));
  const after = await page.evaluate(async () => {
    window.__q.tops = [];
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return [...new Set(window.__q.tops)];
  });
  expect(before.length, "staves on the window").toBeGreaterThan(0);
  expect(before.filter((y) => after.includes(y - 200)).length, `before ${before}, after ${after}`).toBeGreaterThan(0);
});

/* AND IT IS REAL MUSIC: "actually find sheet music from some obscure
   piano pieces and display that" (2026-09-28). Every stave, at three
   sizes of window, is the opening of one of the eighteen pieces in
   qimu-pieces.js — the piece's own bars, from its first, in order, their
   pitches exactly the score's, both hands on a braced pair and the right
   hand alone otherwise; every bar lasts what the piece's time signature
   says (an upbeat less), in every voice of every hand; the time signature
   written is the piece's own. And every piece comes round before any
   comes round again. (Until then this checked a key, an octave's reach and
   a range, because the music was made up here.) */
test("Qimu & Musicians' staves are the openings of real piano pieces, note for note", async ({ page }) => {
  const LENGTH = { "4/4": 16, "3/4": 12, "2/4": 8, "6/8": 12, "12/8": 24, "3/8": 6 };
  const SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const midi = (d, a) => 60 + 12 * Math.floor(d / 7) + SEMIS[((d % 7) + 7) % 7] + a;
  let bars = 0;
  const meters = new Set(), titles = new Set();
  for (const [w, h] of [[1440, 900], [1920, 1080], [390, 844]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(QIMU);
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
    await page.waitForTimeout(700);
    const { staves, pieces } = await page.evaluate(() => ({ staves: window.QimuScore.staves(), pieces: window.QIMU_PIECES }));
    expect(pieces.length, "eighteen pieces").toBe(18);
    expect(staves.length, "staves down the page").toBeGreaterThan(2);
    // Every piece before any comes round again.
    const firsts = staves.slice(0, Math.min(staves.length, pieces.length)).map((s) => s.title);
    expect(new Set(firsts).size, `no piece twice before all have come: ${firsts.join(" | ")}`).toBe(firsts.length);
    staves.forEach((s, i) => {
      const piece = pieces.find((p) => p.title === s.title && p.composer === s.composer);
      expect(piece, `stave ${i} is one of the pieces: ${s.title}`).toBeTruthy();
      titles.add(s.title);
      expect(s.written, `stave ${i}: the piece's own time signature`).toEqual([piece.meter.join("/")]);
      expect(s.bars.map((b) => b.n), `stave ${i}: the piece's opening bars, in order`).toEqual(s.bars.map((b, j) => j));
      s.bars.forEach((b, j) => {
        bars++; meters.add(b.meter);
        const src = piece.bars[b.n];
        if (src.pickup) expect(b.units, `stave ${i} bar ${j}, an upbeat`).toBeLessThan(LENGTH[b.meter]);
        else expect(b.units, `stave ${i} bar ${j} is a whole ${b.meter}`).toBe(LENGTH[b.meter]);
        b.right.forEach((v, k) => expect(v, `stave ${i} bar ${j}, right hand voice ${k} fills its bar`).toBeCloseTo(b.units, 4));
        if (s.grand) b.left.forEach((v, k) => expect(v, `stave ${i} bar ${j}, left hand voice ${k} fills its bar`).toBeCloseTo(b.units, 4));
        else expect(b.left, `stave ${i}: a single stave carries the right hand alone`).toBeNull();
        // The pitches, exactly the score's.
        const hands = s.grand ? [...src.right, ...src.left] : src.right;
        const want = hands.flat().filter((e) => !e.rest).map((e) => e.ds.map((d, q) => midi(d, e.al[q])));
        expect(b.pitches, `stave ${i} bar ${j}: the score's own notes`).toEqual(want);
      });
    });
  }
  expect(bars, "bars written").toBeGreaterThan(20);
  expect(titles.size, "many pieces").toBeGreaterThan(8);
  expect(meters.size, "in several metres, not always 4/4").toBeGreaterThan(3);
});

/* ITS NAME: "give their name when hovering that piece in a light font
   underneath the sheet music". Nothing is named until a stave is pointed
   at; then its piece and its composer are set under everything written
   on it, in a light face (weight 300 — the page asks for Archivo's), and
   taken away again once the hand has gone. */
test("pointing at a stave names its piece under it, in a light face", async ({ page }) => {
  await page.addInitScript(() => {
    window.__named = [];
    const P = CanvasRenderingContext2D.prototype;
    const fillText = P.fillText;
    P.fillText = function (t, x, y) {
      if (this.canvas.classList.contains("human-field") && !/^\d+$/.test(String(t))) window.__named.push({ t: String(t), font: this.font, x, y });
      return fillText.apply(this, arguments);
    };
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(QIMU);
  await page.waitForTimeout(3000);
  expect(await page.evaluate(() => window.__named.length), "nothing named unpointed").toBe(0);
  const boxes = (await page.evaluate(() => window.QimuScore.boxes())).filter((b) => b.written && b.y > 70 && b.y + b.deep + 60 < 880);
  expect(boxes.length, "a stave on the window").toBeGreaterThan(0);
  const one = boxes[0];
  const info = (await page.evaluate(() => window.QimuScore.staves()))[one.i];
  await page.mouse.move(one.x + one.w / 2, one.y + one.h / 2, { steps: 3 });
  await expect.poll(() => page.evaluate((i) => window.QimuScore.boxes()[i].named, one.i)).toBeGreaterThan(0.9);
  const named = await page.evaluate(() => window.__named.slice(-40));
  const said = [...new Set(named.map((n) => n.t))].join(" ");
  expect(said, "the piece").toContain(info.title.split(" ").slice(0, 2).join(" "));
  expect(said, "and its composer").toContain(info.composer.split(" ").pop());
  named.forEach((n) => {
    expect(n.font, "a light face").toMatch(/^300 /);
    expect(n.y, "under the stave").toBeGreaterThan(one.y + one.h);
    expect(n.x, "at its left edge").toBeCloseTo(one.x, 0);
  });
  // Off it, the name goes.
  await page.mouse.move(720, 20, { steps: 3 });
  await expect.poll(() => page.evaluate((i) => window.QimuScore.boxes()[i].named, one.i)).toBe(0);
});

/* THE SOUND: "a button on top that allows you to mute and unmute. it
   should be a square and relatively obvious" (2026-09-26) — and then
   (2026-09-27): "the music playing in Qimu & musicians sounds aweful ...
   make it also sound like the actual notes on screen ... I want it to
   sound like an actual composition. Additionally, I want it to make the
   sound only if you hover that particlar set of lines."

   The button is a square at the top of the window, starting silent (a
   browser lets no page sound until it is pressed). With the sound off, a
   stave pointed at plays nothing. Turned on, the recorded piano arrives
   (all seventeen of its notes), and a stave pointed at plays THAT STAVE,
   from its first note, every note exactly as it is written — its pitches,
   in its order, at its times — on the recorded piano. Off its lines it
   stops; another stave plays from its own start; and off again, silence. */
test("Qimu & Musicians has a square sound button, and a stave pointed at plays exactly its own music", async ({ page }) => {
  test.setTimeout(60000);
  const errors = collectPageErrors(page);
  await page.addInitScript(() => {
    window.__recorded = 0;
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function () { if (this.buffer && this.buffer.duration > 5) window.__recorded++; return start.apply(this, arguments); };
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(QIMU);
  await page.waitForTimeout(3200);
  const button = page.locator(".qimu-sound");
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect(button).toContainText("Sound off");
  const box = await page.locator(".qimu-sound-box").boundingBox();
  expect(Math.abs(box.width - box.height), "a square").toBeLessThan(1);
  expect(box.width, "and big enough to see").toBeGreaterThanOrEqual(36);
  expect(box.y, "at the top").toBeLessThan(40);

  const staves = async () => (await page.evaluate(() => window.QimuScore.boxes()))
    .filter((b) => b.written && b.y > 70 && b.y + b.h < 860);
  const heard = () => page.evaluate(() => window.QimuScore.heard());
  const onto = async (b) => { await page.mouse.move(b.x + b.w * 0.5, b.y + b.h * 0.5, { steps: 4 }); };

  // Silent while it is off.
  let seen = await staves();
  expect(seen.length, "staves on the window to point at").toBeGreaterThan(1);
  await onto(seen[0]);
  await page.waitForTimeout(600);
  expect(await heard(), "nothing plays while it is off").toEqual([]);
  await page.mouse.move(700, 20);

  // On: the recorded piano arrives, all of it.
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(button).toContainText("Sound on");
  await expect.poll(() => page.evaluate(() => window.QimuScore.samples().length), { timeout: 10000 }).toBe(17);

  // A stave pointed at plays itself, note for note, from the start.
  seen = await staves();
  const one = seen[0];
  await onto(one);
  await expect(page.locator("html")).toHaveAttribute("data-qimu-playing", String(one.i));
  await page.waitForTimeout(2500);
  const music = await page.evaluate((i) => window.QimuScore.music(i), one.i);
  let played = (await heard()).filter((h) => h.stave === one.i && h.lap === 0);
  expect(played.length, "notes played").toBeGreaterThan(0);
  expect(played.map((h) => h.pitches), "exactly the notes written, in order")
    .toEqual(music.slice(0, played.length).map((n) => n.pitches));
  played.forEach((h, k) => expect(h.at, `note ${k} at its written time`).toBeCloseTo(music[k].at, 5));
  expect(await page.evaluate(() => window.__recorded), "on the recorded piano").toBeGreaterThan(0);
  // Every pitch it plays is one drawn on that stave.
  const drawn = await page.evaluate((i) => window.QimuScore.music(i).flatMap((n) => n.pitches), one.i);
  played.forEach((h) => h.pitches.forEach((m) => expect(drawn).toContain(m)));

  // Off its lines, it stops.
  await page.mouse.move(700, 20, { steps: 3 });
  await expect(page.locator("html")).not.toHaveAttribute("data-qimu-playing", /./);
  await page.waitForTimeout(300);
  const stopped = (await heard()).length;
  await page.waitForTimeout(1500);
  expect((await heard()).length, "nothing more once the hand is off its lines").toBe(stopped);

  // Another stave plays from its own start.
  const two = seen[1];
  await onto(two);
  await expect(page.locator("html")).toHaveAttribute("data-qimu-playing", String(two.i));
  await page.waitForTimeout(800);
  const other = (await heard()).filter((h) => h.stave === two.i);
  const second = await page.evaluate((i) => window.QimuScore.music(i), two.i);
  expect(other.length).toBeGreaterThan(0);
  expect(other[0].at, "from its first note").toBe(second[0].at);
  expect(other[0].pitches).toEqual(second[0].pitches);

  // Off again: silence, even on the lines.
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).not.toHaveAttribute("data-qimu-playing", /./);
  const before = (await heard()).length;
  await onto(seen[0]);
  await page.waitForTimeout(800);
  expect((await heard()).length, "silent once it is off again").toBe(before);
  expect(errors).toEqual([]);
});

/* ON A PHONE (2026-09-28): "make sure the music works in qimu and musicians
   for the phone too". There is no hovering on a phone, so a TAP on a stave
   plays it through, and a tap on it again stops it; a scroll plays nothing.
   An iPhone mutes a page's sound with its silent switch unless the page
   says it is music (`navigator.audioSession`, which this browser does not
   have and which is put in for the test), and that has to be said before
   the sound is first made. With the sound on, the staves across the
   window come up a little, so there is something to tap. */
test.describe("Qimu & Musicians on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("a stave tapped plays through, tapped again stops, and a scroll plays nothing", async ({ page }) => {
    test.setTimeout(60000);
    const errors = collectPageErrors(page);
    await page.addInitScript(() => {
      const session = { type: "auto" };
      Object.defineProperty(navigator, "audioSession", { value: session, configurable: true });
      window.__asked = [];
      const Real = window.AudioContext;
      window.AudioContext = function () { window.__asked.push(session.type); return new Real(...arguments); };
      window.AudioContext.prototype = Real.prototype;
    });
    await page.goto(QIMU);
    await page.waitForTimeout(3200);
    const button = page.locator(".qimu-sound");
    await expect(button).toBeVisible();
    const box = await page.locator(".qimu-sound-box").boundingBox();
    expect(box.x + box.width, "on the window").toBeLessThanOrEqual(390);

    const onWindow = async () => (await page.evaluate(() => window.QimuScore.boxes()))
      .filter((b) => b.written && b.y > 80 && b.y + b.h < 780);
    const heard = () => page.evaluate(() => window.QimuScore.heard());
    const playing = page.locator("html");

    // Quiet behind the writing while the sound is off.
    let seen = await onWindow();
    expect(seen.length, "a stave on the window to tap").toBeGreaterThan(0);
    expect(seen[0].strength, "quiet").toBeLessThan(0.3);

    // A tap with the sound off plays nothing.
    const mid = (b) => [Math.round(b.x + b.w / 2), Math.round(b.y + b.h / 2)];
    await page.touchscreen.tap(...mid(seen[0]));
    await page.waitForTimeout(500);
    expect(await heard(), "nothing while it is off").toEqual([]);

    // On — said to be music before the sound is first made.
    await button.tap();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => window.__asked), "music, before the sound began").toEqual(["playback"]);
    await expect.poll(() => page.evaluate(() => window.QimuScore.samples().length), { timeout: 10000 }).toBe(17);
    await expect.poll(async () => (await onWindow())[0].strength, { timeout: 5000 }).toBeGreaterThan(0.45);

    // A TAP ON A STAVE plays it through, note for note, from its start,
    // with its name under it.
    seen = await onWindow();
    const one = seen[0];
    await page.touchscreen.tap(...mid(one));
    await expect(playing).toHaveAttribute("data-qimu-playing", String(one.i));
    await page.waitForTimeout(1500);
    const music = await page.evaluate((i) => window.QimuScore.music(i), one.i);
    const played = (await heard()).filter((h) => h.stave === one.i && h.lap === 0);
    expect(played.length, "notes played").toBeGreaterThan(0);
    expect(played.map((h) => h.pitches), "exactly the notes written, in order").toEqual(music.slice(0, played.length).map((n) => n.pitches));
    expect((await page.evaluate(() => window.QimuScore.boxes()))[one.i].named, "its name under it").toBeGreaterThan(0.5);

    // A finger's width: a tap just off its lines still plays it.
    await page.touchscreen.tap(mid(one)[0], Math.round(one.y + one.h + 22));
    await expect(playing, "tapped again: it stops").not.toHaveAttribute("data-qimu-playing", /./);
    await page.touchscreen.tap(mid(one)[0], Math.round(one.y - 22));
    await expect(playing, "just above its lines").toHaveAttribute("data-qimu-playing", String(one.i));
    // A tap anywhere else stops it.
    const clear = await page.evaluate(() => {
      const bs = window.QimuScore.boxes();
      for (let y = 100; y < 780; y += 10) if (!bs.some((b) => y > b.y - 60 && y < b.y + b.h + 60) && !document.elementFromPoint(12, y).closest("a, button, summary")) return y;
      return null;
    });
    expect(clear, "somewhere with no stave").not.toBeNull();
    await page.touchscreen.tap(12, clear);
    await expect(playing).not.toHaveAttribute("data-qimu-playing", /./);

    // A SCROLL plays nothing, even when a stave comes under the finger.
    const before = (await heard()).length;
    for (let k = 0; k < 6; k++) {
      await page.evaluate(() => window.scrollBy(0, 70));
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(400);
    await expect(playing).not.toHaveAttribute("data-qimu-playing", /./);
    expect((await heard()).length, "nothing played on the way").toBe(before);

    // Off: quiet again.
    await button.tap();
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect.poll(async () => (await onWindow())[0].strength, { timeout: 5000 }).toBeLessThan(0.3);
    expect(errors).toEqual([]);
  });
});

/* WITH MOTION TURNED OFF each of the four still draws its ground, and
   draws it still. */
test("with motion turned off the four new grounds are drawn and stand still", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await serveDependenciesLocally(page);
  for (const url of [GRANDE, ABSTRAITS, TOMBSTONE, QIMU]) {
    await page.goto(url);
    await page.waitForTimeout(500);
    const shot = () => page.evaluate(() => {
      const el = document.querySelector(".human-field");
      const d = el.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, el.width, el.height).data;
      let n = 0, sum = 0;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 6) { n++; sum += d[i] * (i % 997); }
      return n + ":" + sum;
    });
    const a = await shot();
    await page.waitForTimeout(700);
    const b = await shot();
    expect(Number(a.split(":")[0]), `${url} draws its ground`).toBeGreaterThan(100);
    expect(b, `${url} stands still`).toBe(a);
  }
  await context.close();
});

/* WITHOUT THE SCRIPTS the writing is still all there and still opens.
   Every drawn page on this site has this test, and it is the one that
   says the drawing is decoration rather than the page. */
test("without the scripts the new houses are all of their writing",
  async ({ page }) => {
  await page.route("**/house.js", (route) => route.abort());
  await page.route("**/ataraxia.js", (route) => route.abort());
  await page.route("**/tale.js", (route) => route.abort());
  for (const ground of ["grande", "abstraits", "tombstone", "qimu"]) {
    await page.route(`**/${ground}.js`, (route) => route.abort());
  }

  for (const [url, parts] of [[ATARAXIA, 5], [GRANDE, 15], [ABSTRAITS, 4], [TALE, 4], [TOMBSTONE, 5], [QIMU, 4]]) {
    await page.goto(url);
    await expect(page.locator(".human-part")).toHaveCount(parts);
    // Nothing is hidden: the class that holds the parts back is put on
    // by house.js, and a blocked script never puts it on.
    await expect(page.locator(".human-page.human-ready")).toHaveCount(0);
    const first = page.locator(".human-part").first();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", /.*/);
  }
});

/* A FRAGRANCE THAT IS NOT WRITTEN YET SAYS SO, in a dashed box, rather
   than standing in as prose. Two houses arrived with no writing at all
   and the temptation was to invent some; this is the guard on not
   having. */
test("an unwritten fragrance says it is unwritten", async ({ page }) => {
  // NAMED IS NOT WRITTEN, and the two came apart on 2026-09-22: the
  // owner gave Ataraxia and Les Abstraits their fragrances' names and
  // their notes, and kept the WRITING. Les Abstraits' writing arrived
  // on 2026-09-23, Tombstone's and four of Ataraxia's on 2026-09-24 —
  // see their own tests. What is left waiting says so: My Doll's Makeup,
  // on Ataraxia, and only it.
  for (const [url, parts] of [[ATARAXIA, 5]]) {
    await page.goto(url);
    await expect(page.locator(".human-waiting")).toHaveCount(1);
    await expect(page.locator("#part-03 .human-waiting")).toContainText("My Doll");
    await expect(page.locator(".human-part .human-untitled"),
      "these are named now").toHaveCount(0);
    // And every one of them is named with something that is not the
    // word the placeholder used.
    const names = await page.locator(".human-part .human-title").allTextContents();
    expect(names.length).toBe(parts);
    names.forEach((name) => {
      expect(name.trim().length, `"${name}" is not a name`).toBeGreaterThan(2);
      expect(name.trim()).not.toBe("Untitled");
    });
  }

  // And the written houses have neither.
  for (const url of [GRANDE, ABSTRAITS]) {
    await page.goto(url);
    await expect(page.locator(".human-waiting"), url).toHaveCount(0);
    await expect(page.locator(".human-untitled"), url).toHaveCount(0);
  }
});

// ============================================================
// LES ABSTRAITS, WRITTEN — 2026-09-23
// ============================================================

/* THE LAST WORD OPENS A NEW WINDOW. The owner asked for it in capitals:
   "CLAUDE MAKE THIS OPEN A NEW WINDOW". So the link to Antoine Lie's
   own paragraph is checked for the thing that makes that true — a
   target of its own — and for the `noopener` a link into a new window
   should always carry. */
test("Les Abstraits ends with Antoine Lie's paragraph, in a new window",
  async ({ page }) => {
  await page.goto(ABSTRAITS);
  const link = page.locator(".human-after a");
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", "https://lesabstraits.com/pages/about");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  // It is the LAST thing written on the page: after every fragrance.
  const after = await page.evaluate(() => {
    const parts = document.querySelectorAll(".human-part");
    const last = parts[parts.length - 1];
    return !!(last.compareDocumentPosition(document.querySelector(".human-after"))
      & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(after, "the paragraph should come after the fragrances").toBe(true);
});

/* THE SENTENCE THAT STOPPED HALF WAY is gone. "The vibe I get from Les
   Abstraits is that it is stuff" stood unfinished in the introduction,
   left so because the owner left it so, until they asked for it out
   (2026-09-25). */
test("Les Abstraits' introduction no longer carries the unfinished sentence", async ({ page }) => {
  await page.goto(ABSTRAITS);
  await expect(page.locator("body")).not.toContainText("The vibe I get from Les Abstraits");
  await expect(page.locator("#introduction-name + .human-text p").first()).toBeVisible();
});

/* THE DRAWING IN DES CENDRES. The owner wrote "(claude, maybe try to
   generate a picture of this)" in the middle of the writing. That was a
   note to whoever built the page, not something for the reader — so it
   must NOT be printed, and the drawing must stand where it was, and have
   actually loaded. */
test("Des Cendres carries its drawing, and not the note that asked for it",
  async ({ page }) => {
  await page.goto(ABSTRAITS + "#part-02");
  await page.waitForTimeout(600);
  const text = await page.locator("#part-02").textContent();
  expect(text.toLowerCase()).not.toContain("claude");
  const scene = page.locator("#part-02 .human-scene img");
  await expect(scene).toHaveCount(1);
  const loaded = await scene.evaluate((img) => img.complete && img.naturalWidth > 0);
  expect(loaded, "the drawing should load").toBe(true);
  // Straight after the scenario it draws, and before the notes of it.
  const before = await page.evaluate(() => {
    const fig = document.querySelector("#part-02 .human-scene");
    return fig.previousElementSibling.textContent.trim().endsWith("That is what this smells like.");
  });
  expect(before, "it should stand after the paragraph it pictures").toBe(true);
});

// ============================================================
// TALE PARFUMS — 2026-09-23
// ============================================================

/* ALPHABETICAL, which the owner asked for: "Order them alphabetically."
   Compared with the list SORTED rather than a list written out again,
   for the reason Grande Parfums' test gives. And the four the owner
   named, no more and no fewer. */
test("Tale Parfums carries its four, in alphabetical order", async ({ page }) => {
  await page.goto(TALE);
  const names = await page.$$eval(".human-part .human-title",
    (all) => all.map((n) => n.textContent.trim()));
  expect([...names].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" })))
    .toEqual(names);
  expect([...names].sort()).toEqual(["Bad Lily", "Fleurt", "Rouse", "Water Me"]);
  const numbers = await page.$$eval(".human-part .human-no", (all) => all.map((n) => n.textContent.trim()));
  expect(numbers).toEqual(["01", "02", "03", "04"]);
  // Bad Lily's dry down is a heading with nothing under it yet, and it
  // says so rather than being left blank or being filled in.
  await expect(page.locator("#part-01 .human-waiting")).toHaveCount(1);
  await expect(page.locator(".human-part .human-waiting")).toHaveCount(1);
});

/* EVERY PICTURE IS THERE: three to a fragrance, the house's own, and
   the drawing on the label as the small square in the list. And NOT the
   one the owner marked "dont use". */
test("Tale Parfums shows all twelve of its pictures, and not the one marked don't use",
  async ({ page }) => {
  await page.goto(TALE);
  await page.waitForTimeout(600);
  const plates = await page.$$eval(".human-plate img", (all) =>
    all.map((img) => ({ src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0 })));
  expect(plates.length).toBe(12);
  plates.forEach((one) => expect(one.ok, `${one.src} should load`).toBe(true));
  const thumbs = await page.$$eval(".human-thumb img", (all) => all.map((img) => img.getAttribute("src")));
  thumbs.forEach((src) => expect(src, "the list shows each label's drawing").toMatch(/ 2\.webp$/));
  const every = await page.$$eval("img", (all) => all.map((img) => img.getAttribute("src")));
  every.forEach((src) => expect(src).not.toContain("dont use"));
});

/* THE PAGE IS DRAWN BY HAND. "simple and very 'drawn by hand' ...
   almost childish", after the label drawings.

   What is checked is what can be: that the doodles are THERE, that all
   four emblems are among them, that each one is drawn with curves and
   not with straight lines (a straight line is a line a computer drew),
   and that NONE OF THEM STANDS OVER THE WRITING — they are in the
   margins, where a person doodles. */
test("the doodles are in the margins, curved, and all four emblems are there",
  async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors = collectPageErrors(page);
  await page.goto(TALE);
  await page.waitForTimeout(800);

  const seen = await page.evaluate(() => {
    const column = document.querySelector(".human-parts").getBoundingClientRect();
    const textLeft = column.left + 64, textRight = column.right - 64;
    const all = [...document.querySelectorAll(".tale-doodles .tale-doodle")];
    return {
      // The lily is the house's mark and stands at the head, so the
      // four are counted across the head and the margins together.
      kinds: [...new Set([...document.querySelectorAll(".tale-doodle")].map((svg) => svg.dataset.kind))],
      count: all.length,
      over: all.filter((svg) => {
        const b = svg.getBoundingClientRect();
        return b.right > textLeft && b.left < textRight;
      }).length,
      straight: all.filter((svg) =>
        [...svg.querySelectorAll("path")].some((p) => /L/.test(p.getAttribute("d")))).length,
      head: document.querySelectorAll(".tale-head-doodle .tale-doodle[data-kind='lily']").length,
    };
  });
  expect(seen.count, "there should be doodles down the margins").toBeGreaterThan(6);
  ["sweet", "rose", "sprout", "lily"].forEach((k) =>
    expect(seen.kinds, `the ${k} should be among them`).toContain(k));
  expect(seen.over, "no doodle may stand over the writing").toBe(0);
  expect(seen.straight, "every line is drawn curved").toBe(0);
  expect(seen.head, "the house's lily stands at the head").toBe(1);
  expect(errors).toEqual([]);
});

/* THEY DRAW THEMSELVES IN, and they BOIL under the hand: a doodle near
   the pointer is redrawn a few times a second, each time a little
   differently, and holds still again once the pointer has gone. */
test("a doodle draws itself in, and boils under the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(TALE);
  await page.waitForTimeout(2600);

  const mark = page.locator(".tale-mark");
  await expect(mark).toHaveClass(/tale-drawn/);
  const dash = await mark.locator("path").first().evaluate((p) => getComputedStyle(p).strokeDashoffset);
  expect(parseFloat(dash), "drawn all the way in").toBeLessThan(0.01);

  const box = await mark.boundingBox();
  const shape = () => mark.locator("path").nth(1).getAttribute("d");
  await page.mouse.move(40, 880);
  await page.waitForTimeout(400);
  const still = await shape();
  await page.waitForTimeout(400);
  expect(await shape(), "away from the pointer it holds still").toBe(still);

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const seen = new Set();
  for (let i = 0; i < 8; i++) { seen.add(await shape()); await page.waitForTimeout(90); }
  expect(seen.size, "near the pointer it is drawn again and again").toBeGreaterThan(1);

  await page.mouse.move(40, 880);
  await page.waitForTimeout(500);
  const settled = await shape();
  await page.waitForTimeout(500);
  expect(await shape(), "and holds still once the pointer has gone").toBe(settled);
});

/* ON A PHONE there are no margins, so there are no margin doodles —
   and the house's lily still stands at the head, clear of the name. */
test("on a phone Tale keeps its lily and nothing stands over the writing",
  async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(TALE);
  await page.waitForTimeout(900);
  await expect(page.locator(".tale-doodles .tale-doodle")).toHaveCount(0);
  const clear = await page.evaluate(() => {
    const lily = document.querySelector(".tale-mark").getBoundingClientRect();
    const name = document.querySelector(".human-head h1").getBoundingClientRect();
    const kicker = document.querySelector(".human-kicker").getBoundingClientRect();
    const apart = (a, b) => a.bottom <= b.top || a.top >= b.bottom || a.right <= b.left || a.left >= b.right;
    return { name: apart(lily, name), kicker: apart(lily, kicker), wide: document.documentElement.scrollWidth - innerWidth };
  });
  expect(clear.name, "the lily should not stand over the name").toBe(true);
  expect(clear.kicker, "nor over the line above it").toBe(true);
  expect(clear.wide, "and the page should not scroll sideways").toBe(0);
});

/* THE LINES ARE STRAIGHT. The owner, on the first version: "not make it
   as hand drawn as you did it ... make the lines straight and keep the
   images as they are." Every rule on the page was a drawn wave; none
   may be now. The pictures keep their uneven corners and their tape. */
test("Tale's rules are straight, and its pictures are still pinned on", async ({ page }) => {
  await page.goto(TALE);
  const seen = await page.evaluate(() => {
    const wavy = [...document.querySelectorAll(".tale-page *")].filter((el) => {
      const cs = getComputedStyle(el);
      return /svg\+xml/.test(cs.backgroundImage) && !el.matches(".human-no, .human-section-mark");
    }).map((el) => el.className);
    const part = getComputedStyle(document.querySelector(".human-part"));
    const img = getComputedStyle(document.querySelector(".human-plate > img"));
    const tape = getComputedStyle(document.querySelector(".human-plate"), "::before");
    return { wavy, rule: part.borderBottomStyle, tilt: img.transform, tape: tape.content };
  });
  expect(seen.wavy, "no drawn waves left").toEqual([]);
  expect(seen.rule, "each fragrance is ruled off with a straight line").toBe("solid");
  expect(seen.tilt, "the pictures keep their tilt").not.toBe("none");
  expect(seen.tape, "and their tape").toBe('""');
});

/* IT COMES IN, IT DOES NOT FLICK. "fix the page so that it doesnt just
   randomly flick into the handwritten ... page; I want it to be animated
   in." It used to be drawn in the site's own face and then jump when the
   handwriting arrived. So: the name is not visible at all until the
   page's script has brought it in, and it fades rather than appearing. */
test("Tale comes in rather than flicking into being", async ({ page }) => {
  await page.addInitScript(() => {
    window.__seen = [];
    const t0 = performance.now();
    (function tick() {
      const h1 = document.querySelector(".human-head h1");
      if (h1) {
        let o = 1;
        for (let el = h1; el && el.nodeType === 1; el = el.parentElement) {
          o *= parseFloat(getComputedStyle(el).opacity);
        }
        window.__seen.push({ o, held: document.documentElement.classList.contains("tale-coming") });
      }
      if (performance.now() - t0 < 3500) requestAnimationFrame(tick);
    })();
  });
  await page.goto(TALE);
  await page.waitForTimeout(3800);
  const seen = await page.evaluate(() => window.__seen);
  expect(seen.filter((s) => s.held && s.o > 0.01).length,
    "nothing is shown while the page is held back").toBe(0);
  const between = seen.filter((s) => s.o > 0.05 && s.o < 0.95).length;
  expect(between, "it fades in over several frames rather than appearing").toBeGreaterThan(3);
  expect(seen[seen.length - 1].o, "and ends fully there").toBeGreaterThan(0.99);
});

// ============================================================
// TALE, IN THE SITE'S OWN FACE — 2026-09-23, later
// ============================================================

/* "for the tale parfums, make the font the same as normal please. the
   other stuff keep." Every line of type on the page is set exactly as
   on Les Abstraits, the page no longer asks for either handwriting
   face — and the doodles, the tape and the loops are all still there. */
test("Tale is set in the site's own face, and keeps its drawings", async ({ page }) => {
  const faces = async (url) => {
    await page.goto(url);
    await page.waitForTimeout(2600);
    return page.evaluate(() => {
      const of = (sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).fontFamily + " " + getComputedStyle(el).fontSize : null;
      };
      return {
        h1: of(".human-head h1"), title: of(".human-title"), text: of(".human-intro .human-text p"),
        no: of(".human-no"), kicker: of(".human-kicker"),
        asked: [...document.querySelectorAll('link[href*="fonts.googleapis"]')].map((l) => l.href).join(" "),
      };
    });
  };
  const normal = await faces(ABSTRAITS);
  const tale = await faces(TALE);
  expect(tale.asked, "no handwriting face is loaded").not.toMatch(/Gochi|Patrick/);
  for (const key of ["h1", "title", "text", "no", "kicker"]) {
    expect(tale[key], `Tale's ${key} should be set as it is everywhere else`).toBe(normal[key]);
  }
  await expect(page.locator(".tale-doodle").first()).toBeAttached();
  const kept = await page.evaluate(() => ({
    tape: getComputedStyle(document.querySelector(".human-plate"), "::before").content,
    loop: getComputedStyle(document.querySelector(".human-no")).backgroundImage,
  }));
  expect(kept.tape, "the tape stays").toBe('""');
  expect(kept.loop, "and the loop round each number").toMatch(/svg/);
});

// ============================================================
// TOMBSTONE AND QIMU & MUSICIANS — 2026-09-23
// ============================================================

/* TOMBSTONE: five, in alphabetical order, each with the owner's two
   pictures — the bottle, and the house's card for it — every one of
   which loads. */
test("Tombstone carries its five, in alphabetical order, with both pictures each",
  async ({ page }) => {
  await page.goto(TOMBSTONE);
  await page.waitForTimeout(700);
  const names = await page.locator(".human-part .human-title").allTextContents();
  expect(names).toEqual(["3 Feet 5", "Evergrow", "No Need to Come By", "Sing at My Funeral", "Sweet Coffin"]);
  const plates = await page.$$eval(".human-plate img", (all) =>
    all.map((img) => ({ src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0 })));
  expect(plates.length, "two pictures to a fragrance").toBe(10);
  plates.forEach((one) => expect(one.ok, `${one.src} should load`).toBe(true));
  await expect(page.locator(".human-kicker")).toHaveText("Scent descriptions · 08");
});

/* QIMU & MUSICIANS: four, in the order the owner numbered them. Guitarist and
   Vocal were written on 2026-09-24 in three stages each; Drummer still
   says exactly what the owner asked it to, and Bassist is theirs to
   write. The introduction says, in the owner's words, that it will be
   written later. */
test("Qimu & Musicians carries its four: two written, one coming soon, one waiting",
  async ({ page }) => {
  await page.goto(QIMU);
  await page.waitForTimeout(700);
  const names = await page.locator(".human-part .human-title").allTextContents();
  expect(names).toEqual(["Guitarist", "Vocal", "Bassist", "Drummer"]);
  const plates = await page.$$eval(".human-plate img", (all) =>
    all.map((img) => ({ src: img.getAttribute("src"), ok: img.complete && img.naturalWidth > 0 })));
  expect(plates.length).toBe(4);
  plates.forEach((one) => expect(one.ok, `${one.src} should load`).toBe(true));
  for (const n of [0, 1]) {
    const stages = await page.locator(".human-part").nth(n).locator(".human-stage").allTextContents();
    expect(stages, names[n]).toEqual(["Top", "Mid", "Dry Down"]);
  }
  await expect(page.locator(".human-part").nth(0).locator(".human-text")).toContainText("my top fig leaf fragrance");
  await expect(page.locator(".human-part").nth(1).locator(".human-text")).toContainText("the scene after a concert");
  const bassist = (await page.locator(".human-part").nth(2).locator(".human-text p").first().textContent()).trim();
  expect(bassist, "Bassist is the owner's to write").toMatch(/has not arrived yet/);
  const drummer = (await page.locator(".human-part").nth(3).locator(".human-text p").first().textContent()).trim();
  expect(drummer).toBe("Description coming soon.");
  await expect(page.locator("#introduction-name + .human-text")).toHaveText("I will write it later.");
  await expect(page.locator(".human-head h1 em")).toHaveText("A House of Music and Fragrance");
  await expect(page.locator(".human-kicker")).toHaveText("Scent descriptions · 09");
});

/* TOMBSTONE, WRITTEN — 2026-09-24. Three things the owner asked for in
   so many words: "selectively linear" in bold, the house's own site
   linked, and "exclusion zone" given its definition when it is pointed
   at. And 3 Feet 5 says the rest of it will be filled in later. */
/* ATARAXIA, WRITTEN — 2026-09-24. The subtitle, the introduction and
   four of its five in the owner's words, and Spinal Fluid's spoiler:
   "a dropdown paragraph with the button saying 'spoiler alert'. And even
   when you click it, the paragraph should be blurry, covered with the
   words 'are you sure?', which if you click yes, then it will unblur it,
   and if you click no, then it will collapse it". */
test("Ataraxia is written, and Spinal Fluid's spoiler asks before it shows", async ({ page }) => {
  await page.goto(ATARAXIA);
  await expect(page.locator(".human-head h1 em")).toHaveText("A Gothic Avante Garde House");
  await expect(page.locator("#introduction-name + .human-text")).toContainText("this house has no DNA");
  for (const [id, stages, words] of [
    ["#part-01", ["Top", "Middle", "Base"], "jazz bar"],
    ["#part-02", ["Top 1", "Top 2", "Mid", "Dry Down"], "dying god"],
    ["#part-04", ["Top", "Mid", "Dry down"], "0/10, would smell again."],
    ["#part-05", ["Top", "Middle", "Base"], "Басейн Лазурний"],
  ]) {
    expect(await page.locator(id + " .human-stage").allTextContents(), id).toEqual(stages);
    await expect(page.locator(id + " .human-text")).toContainText(words);
  }
  // The request itself was not printed, nor the invisible marks the
  // writing arrived with.
  const text = await page.locator("body").textContent();
  expect(text).not.toContain("dropdown paragraph");
  expect(text).not.toContain("\u200e");

  // THE SPOILER.
  await page.locator("#part-04 > summary").click();
  await page.waitForTimeout(900);
  const spoiler = page.locator("#part-04 .human-spoiler");
  const words = spoiler.locator(".human-spoiler-text");
  await expect(spoiler.locator("summary")).toHaveText(/Spoiler alert/i);
  await expect(words).toBeHidden();
  await spoiler.locator("summary").click();
  await expect(spoiler.locator(".human-spoiler-ask")).toBeVisible();
  await expect(spoiler.locator(".human-spoiler-ask")).toContainText("Are you sure?");
  const blurred = () => words.evaluate((el) => getComputedStyle(el).filter);
  expect(await blurred(), "opened, it is blurred").toMatch(/blur/);
  // No shuts it again.
  await spoiler.locator('button[data-answer="no"]').click();
  await expect(spoiler).not.toHaveAttribute("open", /.*/);
  // Opened again, it asks again; Yes clears it.
  await spoiler.locator("summary").click();
  await expect(spoiler.locator(".human-spoiler-ask")).toBeVisible();
  await spoiler.locator('button[data-answer="yes"]').click();
  await expect(spoiler.locator(".human-spoiler-ask")).toBeHidden();
  await expect.poll(blurred).toBe("none");
  await expect(words).toContainText("Spinal fluid captures the universe really well");
});

/* VESTIBULE'S NOTES, as the owner corrected them. */
test("Vestibule carries the notes the owner corrected", async ({ page }) => {
  await page.goto(ATARAXIA);
  const also = await page.evaluate(() => window.FRAGRANCE_NOTES["ataraxia:05"].also);
  expect(also.top).toEqual(["Chocolate Bar", "Carolina Reaper"]);
  expect(also.mid).toEqual(["Chocolate Cake (Amandină)", "Red Hot Chilli", "Wasabi", "Pollen", "Antique Shop", "Turmeric", "Root Beer"]);
  expect(also.base).toEqual(["Cocoa Pod", "Edamame", "Pistachio", "Old Book", "Halva", "Potato"]);
});

test("Tombstone is written, with its bold, its link and a definition on hover",
  async ({ page }) => {
  await page.goto(TOMBSTONE);
  await expect(page.locator(".human-head h1 em")).toHaveText("A House That Expanded on Death");
  await expect(page.locator(".human-intro strong, #introduction-name ~ .human-text strong").first())
    .toHaveText("selectively linear");
  const site = page.locator("a[href='https://tombstonefragrances.shop']");
  await expect(site).toHaveCount(1);
  await expect(site).toHaveAttribute("target", "_blank");
  await expect(site).toHaveAttribute("rel", /noopener/);

  // Only 3 Feet 5 still waits, and it says what for.
  await expect(page.locator(".human-part .human-waiting")).toHaveCount(1);
  await expect(page.locator("#part-01 .human-waiting")).toContainText("filled in later");
  for (const id of ["#part-02", "#part-03", "#part-04", "#part-05"]) {
    expect((await page.locator(id + " .human-text").textContent()).trim().length, id).toBeGreaterThan(400);
  }

  // The definition: there when pointed at, and not before.
  const part = page.locator("#part-02");
  await part.locator("summary").click();
  const term = part.locator(".human-define");
  await expect(term).toHaveText("exclusion zone");
  await expect(term).toHaveAttribute("data-define", /closed off/);
  const shown = () => term.evaluate((el) => +getComputedStyle(el, "::after").opacity);
  await page.mouse.move(5, 5);
  expect(await shown()).toBeLessThan(0.05);
  await term.scrollIntoViewIfNeeded();
  await term.hover();
  await expect.poll(shown).toBeGreaterThan(0.95);
  // The request itself was not printed.
  expect(await page.locator("body").textContent()).not.toContain("give the definition");
});

/* THE WAY ON, FROM HOUSE TO HOUSE: every house's last link points at the
   next one, and the ninth wraps round to the first. */
test("the houses are chained one to the next, and the last wraps round", async ({ page }) => {
  const order = ["pineward", "adar", "almost-human", "ataraxia", "grande-parfums",
    "les-abstraits", "tale-parfums", "tombstone", "qimu-and-musicians"];
  for (let i = 0; i < order.length; i++) {
    await page.goto(`/houses/${order[i]}.html`);
    const on = page.locator(".human-on, .pine-on, .adar-on").last();
    const href = await on.getAttribute("href");
    expect(href, `${order[i]} leads on`).toBe(`${order[(i + 1) % order.length]}.html`);
  }
});

// ============================================================
// THE WAY IN — every house, 2026-09-23
// ============================================================

/* "It just kinda blinks on the screen and then thats it." Every house
   now eases in: its contents come up over several frames, from nothing
   to whole — and its GROUND is there from the first frame, so the dark
   houses never flash white on the way. */
test("every house eases in rather than blinking on", async ({ page }) => {
  test.setTimeout(90000);
  await page.addInitScript(() => {
    window.__seen = [];
    const t0 = performance.now();
    (function tick() {
      if (document.body) window.__seen.push(parseFloat(getComputedStyle(document.body).opacity));
      if (performance.now() - t0 < 1800) requestAnimationFrame(tick);
    })();
  });
  for (const url of ["/houses/pineward.html", "/houses/adar.html", "/houses/almost-human.html",
    ATARAXIA, GRANDE, ABSTRAITS, TOMBSTONE, QIMU, "/individual-fragrances/individual-fragrances.html"]) {
    await page.goto(url);
    await page.waitForTimeout(2000);
    const seen = await page.evaluate(() => window.__seen);
    expect(Math.min(...seen), `${url} should start faint`).toBeLessThan(0.3);
    expect(seen.filter((o) => o > 0.1 && o < 0.9).length,
      `${url} should come up over several frames`).toBeGreaterThan(3);
    expect(seen[seen.length - 1], `${url} should end whole`).toBe(1);
  }
});

test("a dark house keeps its dark ground while it eases in", async ({ page }) => {
  // The fade is slowed right down so the test can look at it: the body
  // is all but invisible, and what shows is the ground.
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const style = document.createElement("style");
      style.textContent = "body { animation-duration: 60s !important; }";
      document.head.appendChild(style);
    });
  });
  await page.goto("/houses/adar.html");
  await page.waitForTimeout(800);
  const shot = await page.screenshot();
  const light = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = "data:image/png;base64," + data;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
    return sum / (d.length / 4);
  }, shot.toString("base64"));
  expect(light, "the window should be ADAR's dark, not white").toBeLessThan(40);
});

/* WITH ANIMATION TURNED OFF, a house is simply there. */
test("with animation turned off a house does not fade in", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(TOMBSTONE);
  const o = await page.evaluate(() => getComputedStyle(document.body).opacity);
  expect(o).toBe("1");
});

/* ADDED LATER, 2026-09-24: Des Cendres' dry down at the end of it, and
   Water Me's middle split from a dry down of its own — the owner's words,
   verbatim, "the unchanged" and all. */
test("Des Cendres ends on its dry down, and Water Me has a Mid and a Dry Down", async ({ page }) => {
  await page.goto(ABSTRAITS);
  const last = page.locator(".human-part", { hasText: "Des Cendres" }).first().locator(".human-text > p").last();
  await expect(last).toHaveText("On the dry down, it is quite smoky, with traces of galbanum remaining, The scent profile is more or less the unchanged.");
  await page.goto(TALE);
  const water = page.locator(".human-part", { hasText: "Water Me" }).first();
  expect(await water.locator(".human-stage").allTextContents()).toEqual(["Top", "Mid", "Dry Down"]);
  // The dry down, and the line the owner added after it on 2026-09-25.
  const paras = water.locator(".human-text > p");
  const n = await paras.count();
  await expect(paras.nth(n - 2)).toHaveText(
    "As it settles it starts smelling a little like a drowned plant; a flower dying because it was watered too much. It still resembles the middle quite well though.");
  await expect(paras.nth(n - 1)).toHaveText("Or a chlorinated swimming pool.");
});

/* GUITARIST'S DRY DOWN ENDS where the owner changed it on 2026-09-25 — the
   "airy ... summer scent" line replaced with the fig leaf merging away. */
test("Guitarist's dry down ends on the fig leaf merging into the rest", async ({ page }) => {
  await page.goto(QIMU);
  const guitarist = page.locator(".human-part", { hasText: "Guitarist" }).first();
  await expect(guitarist.locator(".human-text > p").last()).toHaveText(
    "It eventually turns quite abrasive as all the notes merge together. The fig leaf is there, but it would not have been recognized had you not smelled it in the top and/or mid.");
  await expect(guitarist).not.toContainText("summer scent");
});

/* AND BACK AGAIN: "in SD when you open a house, i want you to have the
   option to go back a house as well as forward a house" (2026-09-26).
   Every house carries a way back to the one before it beside its way on,
   the first wrapping round to the ninth — and the two are the same chain
   read either way. */
test("every house leads back to the one before it, and the first wraps round to the last", async ({ page }) => {
  const order = ["pineward", "adar", "almost-human", "ataraxia", "grande-parfums",
    "les-abstraits", "tale-parfums", "tombstone", "qimu-and-musicians"];
  for (let i = 0; i < order.length; i++) {
    await page.goto(`/houses/${order[i]}.html`);
    const back = page.locator(".house-prev");
    await expect(back, `${order[i]} has one way back a house`).toHaveCount(1);
    await expect(back).toBeVisible();
    expect(await back.getAttribute("href"), `${order[i]} leads back`).toBe(`${order[(i + order.length - 1) % order.length]}.html`);
    await expect(back).toContainText(String((i + order.length - 1) % order.length + 1).padStart(2, "0"));
    // Beside the way on, in the same foot.
    const foot = page.locator("footer").last();
    await expect(foot.locator(".house-prev")).toHaveCount(1);
    await expect(foot.locator(".human-on, .pine-on, .adar-on")).toHaveCount(1);
  }
});

/* ADAR'S CREDIT CAN BE READ on its black page: "the sentence Pictures
   The photograph standing with each fragrance is ADAR's own, from
   adarperfumes.com. is not entirely visibile on the black background"
   (2026-09-26). It was drawn in the paper pages' ink. */
test("ADAR's picture credit stands out plainly from its black page", async ({ page }) => {
  await page.goto("/houses/adar.html");
  const read = await page.evaluate(() => {
    const lum = (c) => {
      const [r, g, b] = c.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
        v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ground = lum(getComputedStyle(document.body).backgroundColor);
    const contrast = (el) => { const l = lum(getComputedStyle(el).color); return (Math.max(l, ground) + 0.05) / (Math.min(l, ground) + 0.05); };
    const credit = document.querySelector(".house-credit");
    return { text: contrast(credit), say: contrast(credit.querySelector(".house-credit-say")), link: contrast(credit.querySelector("a")) };
  });
  expect(read.text, "the sentence").toBeGreaterThan(7);
  expect(read.say, "the word Pictures").toBeGreaterThan(7);
  expect(read.link, "and the link").toBeGreaterThan(7);
});

/* A RETURN BUTTON AT THE TOP OF EVERY HOUSE — the owner, 2026-09-29: "For
   every house in houses ... ON THE TOP OF THE PAGE a return button in case
   they pressed the button by accident." Above the house's name, back to
   the Houses view with that house at the front; and the name has not
   moved for it. */
test("every house has a return button at the top, back to the houses at that house", async ({ page }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const HOUSE_PAGES = [
    ["pineward", "01"], ["adar", "02"], ["almost-human", "03"], ["ataraxia", "04"], ["grande-parfums", "05"],
    ["les-abstraits", "06"], ["tale-parfums", "07"], ["tombstone", "08"], ["qimu-and-musicians", "09"],
  ];
  for (const [house, no] of HOUSE_PAGES) {
    await page.goto("/houses/" + house + ".html");
    const back = page.locator(".house-return");
    await expect(back, house).toHaveCount(1);
    await expect(back).toHaveAttribute("href", "../scent-descriptions/#house-" + no);
    await expect(back).toHaveText(/Back to the houses/i);
    const b = await back.boundingBox(), h = await page.locator("h1").boundingBox();
    expect(b.y + b.height, house + ": above the name").toBeLessThan(h.y);
    expect(b.y, house + ": at the top of the page").toBeLessThan(400);
    // The kicker over the name stands where it stood (26vh down at 900
    // tall), the button taken back out of the head.
    // (Read once the house's way in has brought the head up into place.)
    await expect.poll(async () => Math.abs((await page.locator("header p").first().boundingBox()).y - 234),
      { timeout: 5000, message: house + ": the name has not moved" }).toBeLessThan(3);
  }
  // Pressed, it lands on that house.
  await page.goto("/houses/tombstone.html");
  await page.locator(".house-return").click();
  await page.waitForURL("**/scent-descriptions/#house-08");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await expect(page.locator("#sheet")).toHaveAttribute("data-front", "8");
});

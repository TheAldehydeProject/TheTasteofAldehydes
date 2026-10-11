// ============================================================
// SCENT DESCRIPTIONS AT THE SIZE IT IS MEANT TO GROW TO — the owner
// (2026-10-11): ""Houses" is going to house approximately 300 houses and
// 1000 fragrances in the individual fragrances section. it needs to run
// smoothly. make sure it does please."
//
// These serve the two pages at that size — the Houses view with three
// hundred houses, the Fragrances table with a thousand rows, and the
// individual fragrances page with a thousand parts, every picture its own
// request — made out of the pages as they are, and check what made them
// smooth stays so:
//
//   THE HOUSES    only the houses near the front are laid out (the rest
//                 `.away`, out of the page's layout), only their pictures
//                 fetched, and travelling all the way to the last keeps
//                 its frames.
//   THE TABLE     a thousand items, the pictures fetched only as they come
//                 near — none at all for the list, which shows none — and
//                 the crossing, the scrolling and the search quick.
//   THE PAGE      a thousand parts, their pictures fetched as they are
//                 scrolled to, the scale down the side still counting.
//
// The numbers asked for are well under what was measured (in the comments),
// so a busy machine does not fail them; what they catch is a change that
// lays out, fetches or draws everything again.
// ============================================================
const fs = require("fs");
const path = require("path");
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const HOUSES = 300;
const FRAGRANCES = 1000;

/** Scent Descriptions with `houses` frames (the twelve, copied round, each
    copy's picture its own address) and `frags` rows in its table. */
function bigSheet(houses, frags) {
  let html = read("scent-descriptions/index.html");
  const frames = html.match(/  <a class="sheet-frame"[\s\S]*?<\/a>\n/g);
  const out = [];
  for (let i = 0; i < houses; i++) {
    let f = frames[i % frames.length];
    if (i >= frames.length) {
      f = f.replace(/<span class="sheet-name">([^<]*)<\/span>/, `<span class="sheet-name">House ${String(i + 1).padStart(3, "0")}</span>`)
        .replace(/(<img [^>]*?src="[^"?]+)"/, `$1?n=${i}"`);
    }
    out.push(f);
  }
  const first = html.indexOf(frames[0]);
  const end = html.indexOf(frames[frames.length - 1]) + frames[frames.length - 1].length;
  html = html.slice(0, first) + out.join("\n") + html.slice(end);
  const a = html.indexOf("<tbody>") + "<tbody>".length, b = html.indexOf("</tbody>");
  const of = ["Lussur", "Serge Lutens", "Prissana", "Dior", "Ramon Monegal", "Mancera", "Casa Goa", "Matca"];
  const rows = [];
  for (let i = 1; i <= frags; i++) {
    const no = String(i).padStart(3, "0");
    const iso = new Date(Date.UTC(2026, 0, 1) + ((i * 7919) % 280) * 864e5).toISOString().slice(0, 10);
    const name = `Fragrance ${no}`;
    rows.push(`<tr data-no="${i}" data-name="${name}" data-house="${of[i % of.length]}" data-date="${iso}">` +
      `<td class="index-no">${no}</td><td class="index-what"><a href="../individual-fragrances/individual-fragrances.html#part-${no}">${name}</a></td>` +
      `<td class="index-of">${of[i % of.length]}</td><td class="index-date">${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}</td></tr>`);
  }
  return html.slice(0, a) + "\n" + rows.join("\n") + "\n" + html.slice(b);
}
/** The individual fragrances page with `frags` parts, copied round. */
function bigIndividual(frags) {
  const html = read("individual-fragrances/individual-fragrances.html");
  const parts = html.match(/  <details class="human-part" id="part-\d+">[\s\S]*?\n  <\/details>\n/g);
  const out = [];
  for (let i = 1; i <= frags; i++) {
    const no = String(i).padStart(3, "0");
    out.push(parts[(i - 1) % parts.length].replace(/id="part-\d+"/, `id="part-${no}"`)
      .replace(/<span class="human-no">\d+<\/span>/, `<span class="human-no">${no}</span>`)
      .replace(/(<img [^>]*?src="[^"?]+)"/g, `$1?n=${i}"`));
  }
  const first = html.indexOf(parts[0]);
  const end = html.indexOf(parts[parts.length - 1]) + parts[parts.length - 1].length;
  return html.slice(0, first) + out.join("\n") + html.slice(end);
}

// Playwright's trace off, as for the heavier house pages: recording it
// photographs the whole page at every step, and a page of a thousand parts
// stalls under it.
test.use({ trace: "off" });

let SHEET_BIG, INDIVIDUAL_BIG;
test.beforeAll(() => {
  SHEET_BIG = bigSheet(HOUSES, FRAGRANCES);
  INDIVIDUAL_BIG = bigIndividual(FRAGRANCES);
});
test.beforeEach(async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.route(/\/scent-descriptions\/(index\.html)?(\?[^#]*)?$/, (r) => r.fulfill({ body: SHEET_BIG, contentType: "text/html" }));
  await page.route(/\/individual-fragrances\/individual-fragrances\.html(\?.*)?$/, (r) => r.fulfill({ body: INDIVIDUAL_BIG, contentType: "text/html" }));
  await page.setViewportSize({ width: 1440, height: 900 });
});

/** Frames a second while the page does `act` itself, counted in the page
    over `ms`: nothing the test does in the middle of it — each of the test's
    own actions has the page photographed whole for its trace, and on a page
    of a thousand parts that, not the page, was what was measured. */
function framesWhile(page, act, ms) {
  return page.evaluate(async ([src, ms]) => {
    const act = new Function("return (" + src + ")")();
    let n = 0, going = true;
    const t0 = performance.now();
    (function f() { if (!going) return; n++; requestAnimationFrame(f); })();
    act();
    await new Promise((done) => setTimeout(done, ms));
    going = false;
    return n / ((performance.now() - t0) / 1000);
  }, [act.toString(), ms]);
}
/** Every copy's picture asked for, from now on. */
function picturesAsked(page) {
  const asked = new Set();
  page.on("request", (r) => { if (/\/images\/[^?]*\?n=\d+/.test(r.url())) asked.add(r.url()); });
  return asked;
}
const waitForSheet = (page) => page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 45000 });

/* THE HOUSES. Every house is in the markup, but only those within reach of
   the front are laid out — the rest stand out of the page's layout
   (`.away`) — and only their pictures are fetched (`loading="lazy"`). It is
   drawn in a few seconds (measured: 3.4 at three hundred, 3.0 with today's
   twelve; it was 29), and travels at its frames (measured: 42 to 84 a
   second; it was 22). */
test("the Houses view at three hundred houses lays out and fetches only those near the front, and travels smoothly", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  const asked = picturesAsked(page);
  const t0 = Date.now();
  await page.goto("/scent-descriptions/");
  await waitForSheet(page);
  const drawnIn = Date.now() - t0;
  expect(await page.locator(".sheet-frame").count()).toBe(HOUSES);
  expect(drawnIn, "drawn in a few seconds").toBeLessThan(20000);
  const laid = await page.locator(".sheet-frame:not(.away)").count();
  expect(laid, "only the houses near the front laid out").toBeLessThan(40);
  expect(await page.locator(".sheet-frame.away").count()).toBeGreaterThan(HOUSES - 40);
  expect(asked.size, "only their pictures fetched").toBeLessThan(40);
  // All the way to the last house, smoothly; and there, the first is away.
  const fps = await framesWhile(page, () => document.querySelector('.sheet-nav-step[data-to="last"]').click(), 3000);
  expect(fps, "frames a second, travelling to the last").toBeGreaterThan(18);
  await expect(page.locator(".sheet-frame").nth(HOUSES - 1)).toHaveClass(/front/, { timeout: 15000 });
  await expect(page.locator(".sheet-frame").nth(0)).toHaveClass(/away/);
  expect(await page.locator(".sheet-frame:not(.away)").count()).toBeLessThan(40);
  expect(errors).toEqual([]);
});

/* THE TABLE. A thousand items, in boxes to begin with: the pictures fetched
   as they come near (measured: the crossing at 82 frames a second; the
   boxes scrolled at 60, where they were 24), and none at all while it is a
   list, which shows none; and the search answering as it is typed. */
test("the Fragrances table at a thousand fragrances crosses, scrolls and searches quickly, fetching pictures only as they come near", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  await page.goto("/scent-descriptions/");
  await waitForSheet(page);
  const asked = picturesAsked(page);
  const crossing = await framesWhile(page, () => document.querySelector('.sheet-filter[data-view="fragrances"]').click(), 1500);
  await expect(page.locator(".frag-item")).toHaveCount(FRAGRANCES, { timeout: 20000 });
  expect(crossing, "frames a second, crossing to the table").toBeGreaterThan(18);
  await page.waitForTimeout(1500);
  expect(asked.size, "only the pictures near the top fetched").toBeLessThan(150);
  expect(await page.locator(".frag-item.in-sight").count(), "only those in sight fading").toBeLessThan(200);
  // Scrolled, smoothly: a screen's height every second and a half.
  const scrollTable = () => {
    const box = document.querySelector(".frag-list-scroll");
    let k = 0;
    (function step() { if (k++ < 90) { box.scrollTop += 8; requestAnimationFrame(step); } })();
  };
  const scrolling = await framesWhile(page, scrollTable, 1500);
  expect(scrolling, "frames a second, scrolling the boxes").toBeGreaterThan(18);
  // As a list: nothing more fetched, however far it is scrolled.
  await page.click('.frag-mode[data-mode="list"]');
  // (The pictures asked for before the list was chosen are still being
  // made, a few at a time, and arrive after it: what is counted is from
  // when they have all come.)
  let still = -1;
  await expect.poll(async () => { const n = asked.size; const same = n === still; still = n; return same; },
    { timeout: 20000, intervals: [1200] }).toBe(true);
  const before = asked.size;
  await page.evaluate(() => { const box = document.querySelector(".frag-list-scroll"); box.scrollTop = box.scrollHeight / 2; });
  await page.waitForTimeout(400);
  await page.evaluate(() => { const box = document.querySelector(".frag-list-scroll"); box.scrollTop = box.scrollHeight; });
  await page.waitForTimeout(800);
  expect(asked.size, "a list fetches no pictures").toBe(before);
  // The search, as it is typed.
  await page.locator(".frag-list-field").click();
  await page.keyboard.type("fragrance 12", { delay: 20 });
  const t0 = Date.now();
  // (A 12 in a number or a date is found too: about fifty of the thousand.)
  await expect.poll(() => page.locator(".frag-item:not([hidden])").count(), { timeout: 5000 }).toBeLessThan(100);
  expect(Date.now() - t0, "answered at once").toBeLessThan(2500);
  expect(await page.locator(".frag-item:not([hidden])").count()).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

/* THE PAGE. The individual fragrances page with a thousand parts loads in
   under a second or so (measured: 0.9; it was 4.1), fetching only the
   pictures near where it is read, and its scale still counts them. */
test("the individual fragrances page at a thousand parts loads quickly and fetches pictures as they are reached", async ({ page }) => {
  test.setTimeout(150000);
  const errors = collectPageErrors(page);
  const asked = picturesAsked(page);
  const t0 = Date.now();
  await page.goto("/individual-fragrances/individual-fragrances.html");
  const loaded = Date.now() - t0;
  await page.waitForTimeout(1200);
  expect(await page.locator(".human-part").count()).toBe(FRAGRANCES);
  expect(loaded, "loaded in a few seconds").toBeLessThan(15000);
  expect(asked.size, "only the pictures near the top fetched").toBeLessThan(80);
  // Scrolled smoothly, and the scale keeps up.
  const fps = await framesWhile(page, () => {
    let k = 0;
    (function step() { if (k++ < 90) { window.scrollBy(0, 24); requestAnimationFrame(step); } })();
  }, 1500);
  expect(fps, "frames a second, scrolling").toBeGreaterThan(18);
  // At the foot, the reading counts the last of the thousand.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator(".human-readout-no")).toHaveText(String(FRAGRANCES), { timeout: 5000 });
  expect(errors).toEqual([]);
});

/* WHAT MAKES IT SO, in the markup: every house's picture on the Houses view
   and every individual fragrance's picture is fetched only as it comes near
   (`loading="lazy"`) — a new house or fragrance copied from one carries it,
   and its page's comment says to keep it. */
test("every house's picture and every individual fragrance's picture is lazy", () => {
  const sheet = read("scent-descriptions/index.html");
  const frames = sheet.match(/<a class="sheet-frame"[\s\S]*?<\/a>/g);
  expect(frames.length).toBeGreaterThanOrEqual(12);
  frames.forEach((f) => {
    const img = f.match(/<img [^>]*>/);
    if (img) expect(img[0], "a house's picture").toContain('loading="lazy"');
  });
  const individual = read("individual-fragrances/individual-fragrances.html");
  const parts = individual.match(/<details class="human-part"[\s\S]*?<\/details>/g);
  expect(parts.length).toBeGreaterThanOrEqual(8);
  parts.forEach((p) => (p.match(/<img [^>]*>/g) || []).forEach((img) => expect(img, "a fragrance's picture").toContain('loading="lazy"')));
});

// ============================================================
// THE SITE ON A PHONE
//
// These belong to no one feature, the way repository.spec.js doesn't:
// they are about the whole site at a phone's size. The owner asked for
// it to work on a phone "without changing its desktop version", which
// is the standing rule here — anything that would move a wide window
// is out of bounds, and every one of these was measured both ways.
//
// What they cover:
//   1. NO PAGE SCROLLS SIDEWAYS. A page a finger can drag off the edge
//      of is the plainest thing that can be wrong on a phone, and it
//      is caused by one element sticking out, which is easy to do and
//      invisible on a desktop.
//   2. THE DRAWINGS ARE ACTUALLY THERE. Almost Human's crowd was drawn
//      at a twentieth of its ink on any window narrower than the
//      writing's own column — the whole ground of that page was
//      present and invisible.
//   3. A TAP COUNTS AS THE HAND ARRIVING. There is no hovering on a
//      phone: a drag sent `pointermove` and worked, a tap sent
//      `pointerdown` and did nothing.
// ============================================================
const { test, expect, devices } = require("@playwright/test");
const { serveDependenciesLocally } = require("./helpers");

const PHONE = { width: 390, height: 844 };

const PAGES = [
  "/index.html",
  "/scent-descriptions/",
  "/theories/",
  "/favourites/",
  "/explorations-and-researches/",
  "/photography/",
  "/note-library/",
  "/houses/pineward.html",
  "/houses/adar.html",
  "/houses/almost-human.html",
  "/houses/ataraxia.html",
  "/houses/grande-parfums.html",
  "/houses/les-abstraits.html",
  "/houses/tale-parfums.html",
  "/houses/om-parfums.html",
  "/houses/outsider-parfums.html",
  "/houses/lost-tribe.html",
  "/houses/apoteker-tepe.html",
  "/works/theory-03.html",
  "/works/skin.html",
  "/works/buying-a-perfume.html",
  "/works/dupes-designers-and-niches.html",
  "/works/my-personal-introduction-to-perfume.html",
  "/search/",
  "/contact/",
];

test.describe("on a phone", () => {
  test.use({ viewport: PHONE, hasTouch: true });

  /* THE SEARCH ON SCENT DESCRIPTIONS CAN BE SEEN WHEN IT IS OPENED — the
     owner, 2026-10-10: "on the phone, when you open the search bar in the
     SD page, then you cannot quite see the search bar". It opened under the
     Houses and Fragrances buttons, which covered what was typed. It has a
     row of its own under them now, the width of the window, at a size an
     iPhone does not zoom into; the answers stand under it. */
  test("Scent Descriptions' search, opened, stands clear of the buttons", async ({ page }) => {
    await serveDependenciesLocally(page);
    await page.goto("/scent-descriptions/");
    await page.waitForFunction(() => document.querySelector(".sheet.settled"), null, { timeout: 20000 });
    await page.locator(".sheet-search-trigger").tap();
    const field = page.locator(".sheet-search-field");
    await expect(field).toBeFocused();
    await page.waitForTimeout(700);
    const f = await field.boundingBox();
    const buttons = await page.locator(".sheet-filter").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().toJSON()));
    buttons.forEach((b) => expect(f.y, "under the buttons").toBeGreaterThanOrEqual(b.bottom));
    // From the left gutter to under the mark it was opened by — the width of
    // the page, which a scrollbar can make less than the window's.
    const mark = await page.locator(".sheet-search-trigger").boundingBox();
    expect(f.x, "from the left gutter").toBeGreaterThanOrEqual(0);
    expect(f.x, "from the left gutter").toBeLessThan(24);
    expect(f.x + f.width, "to under the mark").toBeGreaterThanOrEqual(mark.x + mark.width - 2);
    expect(f.x + f.width).toBeLessThanOrEqual(PHONE.width);
    expect(await field.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)), "large enough not to be zoomed into").toBeGreaterThanOrEqual(16);
    // Nothing stands over it: the middle of the field is the field.
    expect(await page.evaluate(([x, y]) => document.elementFromPoint(x, y).classList.contains("sheet-search-field"),
      [f.x + f.width / 2, f.y + f.height / 2])).toBe(true);
    await field.pressSequentially("pine", { delay: 30 });
    const found = await page.locator(".sheet-found").boundingBox();
    expect(found.y, "the answers under the field").toBeGreaterThanOrEqual(f.y + f.height - 1);
  });

  /* THE SEARCH'S SQUARE IN THE MIDDLE OF ITS BOX — the owner, 2026-10-14:
     "on the phone, i want you to center the search bar square in scent
     description, its slightly offset. Look for this problem elsewhere too".
     The field, shut, stood in the row beside the mark — no width, but the
     row's gap and its own height — so the mark stood 4px right of the middle
     of its ground, in a box 37px tall. The box is the mark's alone now,
     square and as tall as the Menu's beside it. (Theories' and Favourites'
     marks carry the same 4px inside a box that is never drawn: nothing to be
     seen off-centre there.) */
  test("Scent Descriptions' search square stands in the middle of its box, as tall as the Menu's", async ({ page }) => {
    await serveDependenciesLocally(page);
    await page.goto("/scent-descriptions/");
    await page.waitForFunction(() => document.querySelector(".sheet.settled"), null, { timeout: 20000 });
    const box = await page.locator(".sheet-search").boundingBox();
    const mark = await page.locator(".sheet-search-mark").boundingBox();
    const menu = await page.locator(".menu-trigger").boundingBox();
    expect(Math.abs(mark.x + mark.width / 2 - (box.x + box.width / 2)), "in the middle across").toBeLessThan(0.6);
    expect(Math.abs(mark.y + mark.height / 2 - (box.y + box.height / 2)), "and up and down").toBeLessThan(0.6);
    expect(Math.abs(box.width - box.height), "square").toBeLessThan(1);
    expect(Math.abs(box.height - menu.height), "as tall as the Menu's").toBeLessThan(1);
    expect(Math.abs(box.y - menu.y), "and level with it").toBeLessThan(1);
    expect(await page.locator(".sheet-search").evaluate((el) => getComputedStyle(el).backgroundColor), "on a ground of its own").not.toBe("rgba(0, 0, 0, 0)");
  });

  /* SCENT DESCRIPTIONS LESS CLUTTERED ON A PHONE — the owner, 2026-10-12:
     "I want the images to be smaller; i want the effects to be smaller ...
     the distance between the central line and the houses to be less ...
     make all the pqrticles smaller on the page". Below 700px the front house
     is under three tenths of the window's height (it was two fifths of the
     room), the houses either side stand nearer the axis (a fifth of the
     width round it, where they stood a third) and are under three fifths of
     the front, the line under a house is no wider than its picture, and the
     motifs are drawn at three fifths of their size. A wide window has none
     of it (below). */
  test("Scent Descriptions' houses are smaller and nearer the axis, and the motifs smaller", async ({ page }) => {
    await page.goto("/scent-descriptions/?rest=hand#house-02");
    await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
    await page.waitForTimeout(600);
    const g = await page.evaluate(() => {
      const sheet = document.getElementById("sheet");
      const f = [...sheet.querySelectorAll(".sheet-frame")];
      const b = (el) => el.getBoundingClientRect();
      const mid = (r) => r.left + r.width / 2;
      const axis = sheet.getBoundingClientRect().left + sheet.clientWidth / 2;
      return {
        H: innerHeight, W: innerWidth, front: b(f[1]), next: b(f[2]), before: b(f[0]),
        axisOff: [Math.abs(mid(b(f[0])) - axis), Math.abs(mid(b(f[2])) - axis)],
        say: b(f[1].querySelector(".sheet-say")).width, small: window.HouseMotifs.drawnAt(),
      };
    });
    expect(g.front.height, "the front house").toBeLessThan(g.H * 0.3);
    for (const off of g.axisOff) expect(off, "a house either side, from the axis").toBeLessThan(g.W * 0.22);
    expect(g.next.height / g.front.height, "the next house, against the front").toBeLessThan(0.6);
    expect(g.say, "the line under the house").toBeLessThanOrEqual(g.front.width + 1);
    expect(g.small, "the motifs' scale").toBe(0.6);
  });

  test("no page can be dragged sideways", async ({ page }) => {
    // THIS ONE GROWS WITH THE SITE. It opens every page in turn and
    // waits out each one's arrival, so the default thirty seconds ran
    // out the moment three houses and an exploration were added — as a
    // TIMEOUT, which reads like a broken page rather than like a test
    // that needs longer. Raise this, don't trim the list.
    test.setTimeout(120000);
    await serveDependenciesLocally(page);
    const wide = [];
    for (const path of PAGES) {
      await page.goto(path);
      // The contact sheet lays itself out only once it has settled.
      if (path.indexOf("scent-descriptions") >= 0) {
        await page.waitForFunction(() => document.querySelector(".sheet.settled"),
          null, { timeout: 20000 });
      }
      await page.waitForTimeout(1800);
      const over = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
      }));
      // A pixel of slack for rounding; anything real is tens of pixels.
      if (over.doc > over.win + 1) wide.push(`${path}: ${over.doc} > ${over.win}`);
    }
    expect(wide, `these pages scroll sideways on a phone: ${wide.join(", ")}`).toEqual([]);
  });

  /* THE GROUND OF THAT PAGE WAS INVISIBLE ON A PHONE. `lit()` takes the
     writing's own column out of the drawing, and it worked that out as
     the room left either side of a 940px column — which on a 390px
     window is none, so the quiet band covered the whole page and every
     figure, every drop of rain and every ray was drawn at a twentieth.
     Below the column it is a quarter of each side now, and above it
     nothing has changed at all. */
  test("Almost Human's crowd is drawn on a phone", async ({ page }) => {
    await page.goto("/houses/almost-human.html");
    await page.waitForTimeout(2500);
    const ink = await page.evaluate(() => {
      const el = document.querySelector(".human-field");
      const g = el.getContext("2d", { willReadFrequently: true });
      const im = g.getImageData(0, 0, el.width, el.height).data;
      let n = 0;
      for (let i = 3; i < im.length; i += 4) if (im[i] > 10) n += 1;
      return n;
    });
    // With the column rule it read about 250 pixels of ink on a whole
    // phone screen; it is thousands.
    expect(ink, `the crowd should be drawn — ${ink} pixels of ink`).toBeGreaterThan(2500);
  });

  /* A TAP IS THE ONLY HOVER A PHONE HAS.

     THE FIGURE IS LOOKED FOR OVER THE WHOLE WINDOW, not down the left
     margin, AND IN A BOX WIDER THAN IT IS. Both follow from the same
     change: a phone has no margins, so the crowd stands in the
     clearing the page makes for it instead — anywhere across the
     width, and at its full ink rather than faded towards the reading.
     A box narrower than the cloud reads its own width whatever the
     figure does (150 wide gave 141 -> 138 with the figure plainly
     coming home in it), so the box has to hold the whole cloud.
     See WHERE A FIGURE MAY STAND in almost-human.js.

     What is being claimed has not changed: a tap draws a figure
     together. Measured both ways — with the tap it reads 185 -> 153,
     and with no tap at all, waiting exactly as long, 185 -> 187. */
  test("a tap brings a figure home", async ({ page }) => {
    await page.goto("/houses/almost-human.html");
    await page.waitForTimeout(2500);

    /** The width of the ink in a box, between its fourth and
        ninety-sixth percentile. The figure is narrow, so its stray is
        most of what decides this. */
    const wide = (box) => page.evaluate((b) => {
      const el = document.querySelector(".human-field");
      const g = el.getContext("2d", { willReadFrequently: true });
      const r = el.width / parseFloat(el.style.width);
      const W = Math.round(b.w * r), H = Math.round(b.h * r);
      const d = g.getImageData(Math.round(b.x * r), Math.round(b.y * r), W, H).data;
      const cols = new Array(W).fill(0);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 10) cols[x] += 1;
      }
      const tot = cols.reduce((a, c) => a + c, 0);
      if (!tot) return 0;
      let run = 0, lo = 0, hi = W - 1;
      for (let i = 0; i < W; i++) { run += cols[i]; if (run >= tot * 0.04) { lo = i; break; } }
      run = 0;
      for (let i = W - 1; i >= 0; i--) { run += cols[i]; if (run >= tot * 0.04) { hi = i; break; } }
      return Math.round((hi - lo) / r);
    }, box);

    // Found rather than assumed: whichever box of the window has the
    // most ink in it has a figure in it.
    const box = await page.evaluate(() => {
      const el = document.querySelector(".human-field");
      const g = el.getContext("2d", { willReadFrequently: true });
      const r = el.width / parseFloat(el.style.width);
      const im = g.getImageData(0, 0, el.width, el.height).data;
      const W = Math.round(300 * r), H = Math.round(240 * r);
      const step = Math.max(1, Math.round(20 * r));
      let best = 0, at = null;
      for (let y = 0; y + H < el.height; y += step) {
        for (let x = 0; x + W < el.width; x += step) {
          let n = 0;
          for (let yy = y; yy < y + H; yy += 4) {
            for (let xx = x; xx < x + W; xx += 3) {
              if (im[(yy * el.width + xx) * 4 + 3] > 10) n += 1;
            }
          }
          if (n > best) { best = n; at = { x: x / r, y: y / r, w: 300, h: 240 }; }
        }
      }
      return at;
    });
    expect(box, "there should be a figure somewhere on the page").toBeTruthy();

    const apart = await wide(box);
    expect(apart, "the figure should be drawn before the tap").toBeGreaterThan(30);
    await page.touchscreen.tap(Math.round(box.x + box.w / 2), Math.round(box.y + box.h / 2));
    await page.waitForTimeout(1400);
    const home = await wide(box);
    expect(home, `a tap should draw it together — ${apart} to ${home}`)
      .toBeLessThan(apart * 0.9);
  });
});

/* EVERY 3D DRAWING AS SHARP AS THE SCREEN, up to two device pixels a point
   — a phone too (2026-10-01: "sometimes the note library looks really not
   HD on the phone ... check every other 3D render to see if that applies
   too"). Each was drawn at 1.5 on a phone, which on a screen at three is
   half its sharpness each way. (The Note Library has its own test, with
   what it does on a slow machine.) The flat drawings — a house's ground, a
   title's specks — keep the phone's 1.5. */
test.describe("on a phone's sharp screen", () => {
  test.use({ viewport: PHONE, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  test("every 3D drawing is drawn at two device pixels a point", async ({ page }) => {
    test.setTimeout(120000);
    await serveDependenciesLocally(page);
    const DRAWINGS = [
      ["/index.html", ".molecule-canvas", "the home page's aldehyde"],
      ["/theories/", "canvas.structure-field", "the structure"],
      ["/explorations-and-researches/", "canvas.re-canvas", "the field"],
      ["/scent-descriptions/", "canvas.sheet-field", "the houses' helix"],
      ["/favourites/", "canvas.chamber-field", "the chamber"],
      ["/houses/apoteker-tepe.html", "canvas.human-field", "Apoteker Tepe's mountain"],
    ];
    for (const [url, pick, what] of DRAWINGS) {
      await page.goto(url);
      const canvas = page.locator(pick).first();
      await expect.poll(() => canvas.evaluate((c) => c.clientWidth > 0 ? c.width / c.clientWidth : 0), { timeout: 20000, message: what })
        .toBeCloseTo(2, 1);
    }
  });
  // …and as sharp as the machine can keep smooth: nav.js's `Sharpness`,
  // which the heavy ones ask, lets a slow machine down a step at a time to
  // 1.5 and no further, and takes it back up once it is quick.
  test("a slow machine is let down to one and a half and no further, and taken back up", async ({ page }) => {
    await page.goto("/contact/");
    const r = await page.evaluate(() => {
      let resized = 0;
      const sharp = window.Sharpness(() => { resized++; });
      return { start: sharp.ratio, slow: sharp.judge(40, 8), quick: sharp.judge(16, 6), resized };
    });
    expect(r.start).toBe(2);
    expect(r.slow).toBe(1.5);
    expect(r.quick).toBe(2);
  });
});
// ...AND NOT ON A WINDOW OF 700PX OR WIDER: the Houses view's front house its
// old size there, the side houses as far round, the motifs at their own.
test("Scent Descriptions at 700px wide is laid out as it was", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 });
  await page.goto("/scent-descriptions/?rest=hand#house-02");
  await page.waitForFunction(() => document.getElementById("sheet").classList.contains("drawn"), null, { timeout: 20000 });
  await page.waitForTimeout(600);
  const g = await page.evaluate(() => {
    const sheet = document.getElementById("sheet");
    const f = [...sheet.querySelectorAll(".sheet-frame")];
    const next = f[2].getBoundingClientRect();
    return { H: innerHeight, W: innerWidth, front: f[1].getBoundingClientRect().height,
      off: Math.abs(next.left + next.width / 2 - (sheet.getBoundingClientRect().left + sheet.clientWidth / 2)),
      small: window.HouseMotifs.drawnAt() };
  });
  expect(g.front).toBeGreaterThan(g.H * 0.33);
  expect(g.off).toBeGreaterThan(g.W * 0.28);
  expect(g.small).toBe(1);
});
test("on a plain screen a slow machine is never drawn below its own pixel", async ({ page }) => {
  await page.goto("/contact/");
  const r = await page.evaluate(() => { const sharp = window.Sharpness(() => {}); return [sharp.ratio, sharp.judge(40, 8)]; });
  expect(r).toEqual([1, 1]);
});

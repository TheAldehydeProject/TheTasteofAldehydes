// ============================================================
// THE DRAWINGS FAINT BEHIND THE WORDS (2026-10-12)
//
// The owner, shown where each house's drawing crosses its writing, chose
// "Fade them under the words" — on a phone for every house where it
// happens, and on a computer for ADAR's void and Outsider's light — and
// to put the picture credit in front of the drawing like the rest of the
// writing. nav.js says where the writing is (`window.Writing`); each
// drawing goes faint there (`hush` for a drawing of lines, `under` for
// one of specks) and stays as it was in the gaps.
//
// What these check, and why each way:
//   1. The writing is found where the words are.
//   2. ADAR's void and Outsider's light are FAINTER BEHIND THE WORDS than
//      clear of them — measured on the drawing itself, the same moment
//      with the fade and without, so it is the fade that is measured and
//      not the drawing's own shape.
//   3. Les Abstraits, Qimu, Ataraxia, Tombstone and Lost Tribe ask on a
//      phone, and never on a window 700px or wider: there the owner kept
//      them as they were.
//   4. The credit stands in front of the drawing on all twelve houses.
// See docs/features/2026-10-12-drawings-faint-behind-the-words.md.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally, collectPageErrors } = require("./helpers");

const PHONE = { width: 390, height: 844 };
const WIDE = { width: 1440, height: 900 };
const HOUSES = ["pineward", "adar", "almost-human", "ataraxia", "grande-parfums", "les-abstraits",
  "tale-parfums", "tombstone", "qimu-and-musicians", "om-parfums", "outsider-parfums", "lost-tribe", "apoteker-tepe"];

/** Open every fragrance, scroll to `at` of the page, and let it settle. */
async function openAt(page, path, at) {
  await serveDependenciesLocally(page);
  await page.goto(path);
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelectorAll("details.human-part, details.adar-part").forEach((d) => (d.open = true)));
  await page.waitForTimeout(1200);
  await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), at);
  await page.waitForTimeout(1800);
}

/** How much of the drawing on `selector`'s canvas is drawn plainly — its
    lines and specks, not a soft glow under them (alpha over STRONG) —
    behind the writing, against clear of it, within `box` (a function of the
    window run in the page): with the fade on, and the same moment with it
    taken off. */
async function behindAgainstClear(page, selector, box, STRONG = 60) {
  return page.evaluate(async ([sel, boxSrc, STRONG]) => {
    const canvas = document.querySelector(sel);
    const g = canvas.getContext("2d");
    const k = canvas.width / innerWidth;
    const b = new Function("return (" + boxSrc + ")")()();
    const frame = () => new Promise((d) => requestAnimationFrame(() => requestAnimationFrame(d)));
    const measure = () => {
      const data = g.getImageData(0, 0, canvas.width, canvas.height).data;
      let inS = 0, inN = 0, outS = 0, outN = 0, inInk = 0, outInk = 0, farInk = 0;
      // Well clear of the writing: nothing within 30px either way either.
      const far = (x, y) => [[30, 0], [-30, 0], [0, 30], [0, -30]].every(([dx, dy]) => window.Writing.at(x + dx, y + dy) === 0);
      for (let y = Math.max(0, b.t); y < Math.min(innerHeight, b.b); y += 2) {
        for (let x = Math.max(0, b.l); x < Math.min(innerWidth, b.r); x += 2) {
          const w = window.Writing.at(x, y);
          if (w > 0 && w < 1) continue;
          const a = data[(Math.floor(y * k) * canvas.width + Math.floor(x * k)) * 4 + 3];
          if (w === 1) { inS += a > STRONG ? 1 : 0; inN++; inInk += a; } else { outS += a > STRONG ? 1 : 0; outN++; outInk += a; if (far(x, y)) farInk += a; }
        }
      }
      return { behind: inN ? inS / inN : 0, clear: outN ? outS / outN : 0, inN, outN, inInk, outInk, farInk };
    };
    await frame();
    const on = measure();
    const hush = window.Writing.hush, under = window.Writing.under;
    window.Writing.hush = () => {};
    window.Writing.under = () => 1;
    await frame();
    const off = measure();
    window.Writing.hush = hush; window.Writing.under = under;
    return { on, off };
  }, [selector, box, STRONG]);
}

test("the writing is found where the words are", async ({ page }) => {
  await page.setViewportSize(PHONE);
  await openAt(page, "/houses/adar.html", 0);
  const r = await page.evaluate(() => {
    const boxes = window.Writing.boxes();
    const p = document.querySelector(".adar-text p").getBoundingClientRect();
    const mid = [(p.left + p.right) / 2, (p.top + p.bottom) / 2];
    return {
      n: boxes.length,
      inside: boxes.every((b) => b.l >= -1 && b.r <= innerWidth + 1),
      covers: boxes.some((b) => b.l <= mid[0] && b.r >= mid[0] && b.t <= mid[1] && b.b >= mid[1]),
      at: window.Writing.at(mid[0], mid[1]),
    };
  });
  expect(r.n, "runs of writing on the page").toBeGreaterThan(20);
  expect(r.inside, "every box within the window's width").toBe(true);
  expect(r.covers, "the introduction's first paragraph is writing").toBe(true);
  expect(r.at).toBe(1);
});

/* WHAT A SHUT PART HOLDS IS NOT WRITING (2026-10-20): the browser still
   measures a closed fragrance's paragraphs where they would stand, and every
   house's drawing went quiet over a column of nothing on the right. Only its
   summary is writing until it is opened. */
test("the writing inside a shut part is not counted until it is opened", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.setViewportSize(WIDE);
  await page.goto("/houses/lost-tribe.html");
  await page.waitForTimeout(800);
  const probe = () => page.evaluate(() => {
    const part = document.querySelectorAll(".human-part")[1];
    part.scrollIntoView({ block: "center" });
    const p = part.querySelector(".human-text p"), r = p.getBoundingClientRect();
    const s = part.querySelector("summary .human-title").getBoundingClientRect();
    return new Promise((done) => requestAnimationFrame(() => done({
      shut: !part.open,
      measured: r.height > 2,
      words: window.Writing.at((r.left + r.right) / 2, r.top + Math.min(20, r.height / 2)),
      summary: window.Writing.at((s.left + s.right) / 2, (s.top + s.bottom) / 2),
    })));
  });
  const shut = await probe();
  expect(shut.shut).toBe(true);
  expect(shut.summary, "its summary is writing").toBe(1);
  if (shut.measured) expect(shut.words, "what it holds, shut, is not").toBe(0);
  await page.locator(".human-part > summary").nth(1).click();
  // (Measured again as it opens and once it is open — on a busy machine a
  // little later.)
  await expect.poll(() => page.evaluate(() => {
    const p = document.querySelectorAll(".human-part")[1].querySelector(".human-text p"), r = p.getBoundingClientRect();
    return window.Writing.at((r.left + r.right) / 2, r.top + Math.min(20, r.height / 2));
  }), { timeout: 8000, message: "opened, it is" }).toBe(1);
});

for (const [size, view] of [["a phone", PHONE], ["a computer", WIDE]]) {
  test(`ADAR's void goes faint behind the words on ${size}`, async ({ page }) => {
    const errors = collectPageErrors(page);
    await page.setViewportSize(view);
    await openAt(page, "/houses/adar.html", 0.3);
    // The void's own room: it stands at 0.8 across and 0.46 down.
    const r = await behindAgainstClear(page, ".adar-void",
      "() => { const s = Math.min(innerWidth, innerHeight), cx = innerWidth * 0.8, cy = innerHeight * 0.46, out = s * 0.9; return { l: cx - out, t: cy - out, r: cx + out, b: cy + out }; }");
    expect(r.on.inN, "some of the void stands behind writing").toBeGreaterThan(200);
    expect(r.on.outN, "and some clear of it").toBeGreaterThan(200);
    const on = r.on.behind / Math.max(1e-6, r.on.clear), off = r.off.behind / Math.max(1e-6, r.off.clear);
    expect(off, "without the fade the void is drawn plainly behind the words").toBeGreaterThan(0.1);
    expect(on, `behind against clear: ${on.toFixed(2)} with the fade, ${off.toFixed(2)} without`).toBeLessThan(off * 0.5);
    expect(errors).toEqual([]);
  });
}

// The door on a phone is small and quiet, so what is weighed is all of its
// ink: behind the writing about a third of it is left, and clear of the
// writing all of it. At the foot of the page, where it stands behind the
// credit and the ways on and back.
test("Outsider's door and its light go faint behind the words on a phone", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.setViewportSize(PHONE);
  await openAt(page, "/houses/outsider-parfums.html", 1);
  const r = await behindAgainstClear(page, "canvas.human-field",
    "() => ({ l: 0, t: innerHeight * 0.4, r: innerWidth * 0.7, b: innerHeight })");
  const say = JSON.stringify({ on: r.on, off: r.off });
  expect(r.off.inInk, "the door stands behind some writing there " + say).toBeGreaterThan(2000);
  expect(r.on.inInk / r.off.inInk, "what is left of it behind the words " + say).toBeLessThan(0.6);
  expect(r.on.farInk / Math.max(1, r.off.farInk), "and well clear of them " + say).toBeGreaterThan(0.85);
  expect(errors).toEqual([]);
});

// The rest fade on a phone only; on a window 700px or wider they are as
// they were, and do not even ask.
const ASKERS = [["les-abstraits", "hush"], ["qimu-and-musicians", "hush"], ["ataraxia", "at"], ["tombstone", "at"], ["lost-tribe", "at"]];
for (const [house, how] of ASKERS) {
  test(`${house} goes faint behind the words on a phone, and is as it was on a wide window`, async ({ page }) => {
    const errors = collectPageErrors(page);
    const count = async (view) => {
      await page.setViewportSize(view);
      await openAt(page, `/houses/${house}.html`, 0.3);
      return page.evaluate((how) => new Promise((done) => {
        let n = 0;
        const was = window.Writing[how];
        window.Writing[how] = function (...a) { n++; return was.apply(this, a); };
        setTimeout(() => { window.Writing[how] = was; done(n); }, 1200);
      }), how);
    };
    expect(await count(PHONE), "asked on a phone").toBeGreaterThan(0);
    expect(await count(WIDE), "never asked on a wide window").toBe(0);
    expect(errors).toEqual([]);
  });
}

test("the picture credit stands in front of the drawing on every house", async ({ page }) => {
  await serveDependenciesLocally(page);
  for (const house of HOUSES) {
    await page.goto(`/houses/${house}.html?om=whole`);
    const s = await page.evaluate(() => {
      const c = document.querySelector(".house-credit");
      if (!c) return null;
      const cs = getComputedStyle(c);
      return [cs.position, cs.zIndex];
    });
    expect(s, house).toEqual(["relative", "1"]);
  }
});

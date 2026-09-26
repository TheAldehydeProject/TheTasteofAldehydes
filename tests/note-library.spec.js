// ============================================================
// THE NOTE LIBRARY — categories/note-library.html, note-library.js
//
// Every note named in a fragrance on the site, filed by accord (the
// page's word; the markup still says shelf), each with a line on what
// it is. The page's markup is the catalogue; the script sets every
// record out as an ELEMENT in a PERIODIC TABLE OF NOTES, its accord a
// group — since 2026-09-26. What these hold:
//
//   - every note the site uses HAS a record (the owner asked for "all
//     the notes that I have used so far"), and none is shelved twice;
//   - the elements stand in their groups without running into each other;
//   - the terminal and its ×, the accord tabs, the order, the key and the
//     element card all work,
//     and the card's fragrances link to where they stand;
//   - the site's own search finds a note, by any of its spellings;
//   - and without the script the catalogue is still there to read.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally } = require("./helpers");

const LIBRARY = "/categories/note-library.html";

async function arrive(page, url) {
  await serveDependenciesLocally(page);
  await page.goto(url || LIBRARY);
  await page.waitForFunction(() => document.body.classList.contains("lib-built"));
}

/* EVERY NOTE HAS A RECORD. Read the other way round from the page: the
   page puts anything notes-data.js names and no record carries on a
   returns cart, so the cart must not exist — and every spelling is
   checked against the records directly as well, in case the cart ever
   stops being built. */
test("every note named in a fragrance has a record, and none is shelved twice", async ({ page }) => {
  await arrive(page);
  await expect(page.locator(".lib-returns"), "the returns cart should be empty").toHaveCount(0);
  const out = await page.evaluate(() => {
    const names = new Map();
    const twice = [];
    const bare = [];
    document.querySelectorAll(".lib-record").forEach((el) => {
      const say = el.querySelector(".lib-say").textContent.trim();
      const all = [el.querySelector(".lib-name").textContent.trim()]
        .concat((el.dataset.aka || "").split("|").filter(Boolean));
      if (say.length < 16) bare.push(all[0]);
      all.forEach((n) => {
        const k = n.toLowerCase();
        if (names.has(k)) twice.push(n);
        names.set(k, el.id);
      });
    });
    const missing = [];
    const notes = new Set();
    const N = window.FRAGRANCE_NOTES;
    Object.keys(N).forEach((key) => {
      const e = N[key];
      const lists = [e.top, e.mid, e.base, e.flat];
      if (e.also) lists.push(e.also.top, e.also.mid, e.also.base, e.also.flat);
      lists.filter(Boolean).flat().forEach((n) => {
        if (!names.has(n.toLowerCase())) missing.push(key + " " + n);
        notes.add(n.toLowerCase());
      });
    });
    // ALMOST HUMAN'S OLFACTORY LANDSCAPES ARE NOT NOTES, and the owner
    // asked for them to be reconsidered: nothing that is only ever named
    // in a landscape may stand in the library, as a record or a spelling.
    const landscaped = [];
    Object.keys(N).forEach((key) => {
      const e = N[key];
      if (!e.landscape) return;
      e.landscape.flat.forEach((n) => {
        if (!notes.has(n.toLowerCase()) && names.has(n.toLowerCase())) landscaped.push(n);
      });
    });
    return { missing: missing, twice: twice, bare: bare, landscaped: landscaped,
      records: document.querySelectorAll(".lib-record").length };
  });
  expect(out.missing, "notes with no record").toEqual([]);
  expect(out.landscaped, "landscape impressions shelved as notes").toEqual([]);
  expect(out.twice, "spellings shelved in two records").toEqual([]);
  expect(out.bare, "records with no real explanation").toEqual([]);
  expect(out.records).toBeGreaterThan(300);
});

/* EVERY HOUSE THE NOTES COME FROM HAS A PAGE THE CARD CAN LINK TO. The
   script keeps a small table of where each house's fragrances live; a
   new house in notes-data.js without a line in it would leave its
   fragrances linking nowhere. */
test("every fragrance a card lists links to where it stands in its house", async ({ page }) => {
  await arrive(page);
  // Cedarwood: many houses at once.
  await page.locator("#note-cedarwood").click();
  const card = page.locator(".lib-card");
  await expect(card).toBeVisible();
  await expect(card.locator(".lib-card-name")).toHaveText("Cedarwood");
  await expect(card.locator(".lib-card-call")).toHaveText(/^[A-Z][a-z]{1,2} · WOO \d{3}$/);
  const hrefs = await card.locator(".lib-card-list a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs.length).toBeGreaterThan(10);
  hrefs.forEach((h) => expect(h, "a fragrance link").toMatch(/^\.\.\/(houses\/[a-z-]+|individual-fragrances\/individual-fragrances)\.html#part-\d\d$/));
  // And every house key in the notes has a page to go to.
  const keys = await page.evaluate(() => [...new Set(Object.keys(window.FRAGRANCE_NOTES).map((k) => k.split(":")[0]))]);
  for (const key of keys) {
    const one = await page.evaluate((house) => {
      const k = Object.keys(window.FRAGRANCE_NOTES).find((x) => x.startsWith(house + ":") &&
        (window.FRAGRANCE_NOTES[x].flat || window.FRAGRANCE_NOTES[x].top || window.FRAGRANCE_NOTES[x].also));
      if (!k) return null;
      const e = window.FRAGRANCE_NOTES[k];
      return (e.flat || e.top || e.also.flat || e.also.top)[0];
    }, key);
    if (!one) continue;
    const id = await page.evaluate((note) => {
      const low = note.toLowerCase();
      const el = [...document.querySelectorAll(".lib-record")].find((r) =>
        [r.querySelector(".lib-name").textContent.trim()].concat((r.dataset.aka || "").split("|"))
          .some((n) => n.toLowerCase() === low));
      return el && el.id;
    }, one);
    await page.locator("#" + id).evaluate((el) => el.click());
    const links = await card.locator(".lib-card-list a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    expect(links.some((h) => h !== "#"), `${key}'s fragrances link somewhere`).toBe(true);
    expect(links.filter((h) => h === "#"), `${key} has no page in HOUSES`).toEqual([]);
  }
});

/* THE FRAGRANCES' NAMES ARE READ OFF THEIR HOUSES' OWN PAGES, so a card
   lists "Holy Bread" under Ataraxia's own name for its first fragrance
   rather than a number alone. */
test("a card names the fragrances that use its note, read off their houses' pages", async ({ page }) => {
  await arrive(page, LIBRARY + "#note-holy-bread");
  const card = page.locator(".lib-card");
  await expect(card, "arriving with a note in the address opens it").toBeVisible();
  await expect(card.locator(".lib-card-name")).toHaveText("Holy Bread");
  const link = card.locator(".lib-card-list a");
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", "../houses/ataraxia.html#part-01");
  const title = await page.evaluate(async () => {
    const text = await (await fetch("../houses/ataraxia.html")).text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.querySelector("#part-01 .human-title").textContent.trim();
  });
  await expect(link.locator(".lib-found-name")).toHaveText(title);
  // The explanation is printed out in full.
  const say = await page.locator("#note-holy-bread .lib-say").textContent();
  await expect(card.locator(".lib-card-say")).toHaveText(say.trim(), { timeout: 3000 });
  // Put back with Escape, and the address forgets it.
  await page.keyboard.press("Escape");
  await expect(card).toBeHidden();
  expect(await page.evaluate(() => window.location.hash)).toBe("");
});

/* THE CARD'S LIST IS SET OUT AS THE OWNER DREW IT: the individual
   fragrances first, by name; then HOUSES, and under it each house named
   and only then its fragrances. There are no bars above it any more. */
test("a card lists the individual fragrances first, then the houses, each house named", async ({ page }) => {
  await arrive(page);
  // A note used both by an individual fragrance and in a house.
  const id = await page.evaluate(() => {
    const N = window.FRAGRANCE_NOTES;
    const houses = new Map();
    Object.keys(N).forEach((k) => {
      const e = N[k];
      [e.top, e.mid, e.base, e.flat, e.also && e.also.top, e.also && e.also.mid, e.also && e.also.base, e.also && e.also.flat]
        .filter(Boolean).flat().forEach((n) => {
          const key = n.toLowerCase();
          if (!houses.has(key)) houses.set(key, new Set());
          houses.get(key).add(k.split(":")[0]);
        });
    });
    const el = [...document.querySelectorAll(".lib-record")].find((r) => {
      const all = new Set();
      [r.querySelector(".lib-name").textContent].concat((r.dataset.aka || "").split("|")).forEach((n) =>
        (houses.get(n.toLowerCase()) || []).forEach((h) => all.add(h)));
      return all.has("individual") && all.size > 2;
    });
    return el.id;
  });
  await page.locator("#" + id).evaluate((el) => el.click());
  const card = page.locator(".lib-card");
  await expect(card).toBeVisible();
  await expect(card.locator(".lib-card-circ, .lib-circ")).toHaveCount(0);
  const heads = await card.locator(".lib-found-head").allTextContents();
  expect(heads).toEqual(["Individual fragrances", "Houses"]);
  // The individual fragrances stand before the houses, and every
  // fragrance under Houses stands under its house's name.
  const order = await card.locator(".lib-card-list").evaluate((list) =>
    [...list.querySelectorAll(".lib-found-head, .lib-found-housename, a")].map((el) =>
      el.matches("a") ? "frag:" + el.dataset.key.split(":")[0] : el.textContent));
  expect(order[0]).toBe("Individual fragrances");
  const housesAt = order.indexOf("Houses");
  order.slice(1, housesAt).forEach((x) => expect(x).toBe("frag:individual"));
  expect(order.slice(housesAt + 1).filter((x) => x === "frag:individual")).toEqual([]);
  expect(order[housesAt + 1].startsWith("frag:"), "a house is named before its fragrances").toBe(false);
});


/* EVERYTHING ON THE CARD IS A DROPDOWN: "I want you to be able to do a
   dropdown list of houses, then of pineward and then only see the
   individual fragrances. I think that way it would be a lot less
   chaotic." The card opens with only the groups showing and every one
   of them shut; Houses opens onto the houses, not their fragrances; a
   house opens onto its own; and what was left open stays open when the
   card turns over to another note. */
test("the card's lists are dropdowns: houses, then a house, then its fragrances", async ({ page }) => {
  await arrive(page);
  await page.locator("#note-cedarwood").click();
  const card = page.locator(".lib-card");
  await expect(card).toBeVisible();
  const shown = () => card.locator(".lib-card-list a:visible").count();
  expect(await card.locator("details.lib-drop[open]").count(), "everything starts shut").toBe(0);
  expect(await shown(), "no fragrance is showing").toBe(0);
  await expect(card.locator(".lib-card-aka li").first()).toBeHidden();

  await card.locator(".lib-found-houses > summary").click();
  await expect(card.locator(".lib-found-houses .lib-found-housename").first()).toBeVisible();
  expect(await shown(), "the houses, and not yet their fragrances").toBe(0);

  const pineward = card.locator(".lib-found-house", { has: page.locator(".lib-found-housename", { hasText: "Pineward" }) });
  await pineward.locator("> summary").click();
  const inPineward = await pineward.locator("a").count();
  expect(inPineward).toBeGreaterThan(3);
  expect(await shown(), "only Pineward's fragrances").toBe(inPineward);
  await expect(pineward.locator(".lib-found-count")).toHaveText(String(inPineward));
  (await pineward.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href"))))
    .forEach((h) => expect(h).toMatch(/pineward\.html#part-\d\d$/));

  // Turned over to another note used by Pineward, the same stay open.
  await page.locator("#note-vetiver").evaluate((el) => el.click());
  await expect(card.locator(".lib-card-name")).toHaveText("Vetiver");
  await expect(card.locator(".lib-found-houses")).toHaveAttribute("open", "");
  await expect(card.locator(".lib-found-house", { has: page.locator(".lib-found-housename", { hasText: "Pineward" }) }))
    .toHaveAttribute("open", "");
});

/* ACCORDS, NOT SHELVES, AND NO "NAMES AS WRITTEN". The owner: "Replace
   the word shelves with accords. removes names as written. If you want
   give me other statistics". So the readout counts records, accords
   and fragrances, and names the note the site uses most — which is
   worked out, so it is checked against the books themselves — and
   the word "shelf" is nowhere a reader sees it: not in the readout, not
   on the index's labels, not on the card. */
test("the page says accords rather than shelves, and no longer counts names as written", async ({ page }) => {
  await arrive(page);
  const out = await page.evaluate(() => {
    const most = [...document.querySelectorAll(".lib-record")].reduce((a, b) => (+b.dataset.uses > +a.dataset.uses ? b : a));
    return {
      terms: [...document.querySelectorAll(".lib-readout dt")].map((dt) => dt.textContent),
      most: document.querySelector(".lib-readout-word").firstChild.textContent,
      mostUses: document.querySelector(".lib-readout-word small").textContent,
      expected: most.querySelector(".lib-name").textContent, expectedUses: most.dataset.uses,
      said: [document.querySelector(".lib-head").innerText, document.querySelector(".lib-readout").innerText,
        document.querySelector(".lib-index").getAttribute("aria-label"),
        document.querySelector(".lib-order").getAttribute("aria-label"),
        ...[...document.querySelectorAll(".lib-tab")].map((t) => t.title)].join(" | "),
    };
  });
  expect(out.terms).toEqual(["Elements", "Accords", "Fragrances", "Most used"]);
  expect(out.most, "the note used most").toBe(out.expected);
  expect(out.mostUses).toBe("in " + out.expectedUses + " fragrances");
  expect(out.said, "no shelves where a reader sees them").not.toMatch(/shel/i);
  expect(out.said, "and no names as written").not.toMatch(/names as written/i);
  await page.locator("#note-cedarwood").click();
  await expect(page.locator(".lib-card-shelf")).toHaveText(/^Accord WOO/);
});



/* THE NOTES ARE A PERIODIC TABLE. The owner (2026-09-26): "i also want you
   to redisgn the note library. I am running out of ideas so redisgn it
   somehow and we will change it keep the colours and the search". Read off
   the page: nothing of the books or the files is left; every element
   carries its number (its place down the whole table, 1 to the last), a
   symbol of its own — a capital and a small letter or two, no two notes
   the same — and how many fragrances use it; and every element is faintly
   its accord's colour, each accord its own. */
test("the notes are a periodic table: every element numbered, with a symbol of its own, in its accord's colour", async ({ page }) => {
  await arrive(page);
  const out = await page.evaluate(() => {
    const chroma = (v) => Math.max(0, ...(String(v).match(/rgba?\([^)]*\)/g) || []).map((c) => {
      const n = c.match(/[\d.]+/g).slice(0, 3).map(Number);
      return Math.max(...n) - Math.min(...n);
    }));
    const gone = ["canvas.lib-spine", "canvas.lib-boards", ".lib-leans", ".lib-slip", ".lib-case", ".lib-call",
      ".lib-marks", ".lib-box-no", ".lib-card-stamp", ".lib-card-exhibit", ".lib-glyph", ".lib-scan"]
      .filter((sel) => document.querySelector(sel));
    const all = [...document.querySelectorAll(".lib-record")];
    const faults = [];
    const syms = new Set();
    const byShelf = {};
    all.forEach((el, i) => {
      const no = el.querySelector(".lib-el-no"), sym = el.querySelector(".lib-el-sym"), uses = el.querySelector(".lib-el-uses");
      if (!no || !sym || !uses) return faults.push(el.id + " is not an element");
      if (no.textContent !== String(i + 1)) faults.push(el.id + " numbered " + no.textContent + ", not " + (i + 1));
      if (!/^[A-Z][a-z]{1,2}$/.test(sym.textContent)) faults.push(el.id + " symbol " + sym.textContent);
      if (syms.has(sym.textContent)) faults.push(el.id + " shares its symbol " + sym.textContent);
      syms.add(sym.textContent);
      if (uses.textContent !== el.dataset.uses) faults.push(el.id + " says " + uses.textContent + " fragrances, not " + el.dataset.uses);
      const code = el.closest(".lib-shelf").dataset.shelf;
      if (code === "RET") return;
      const bg = getComputedStyle(el).backgroundColor;
      if (chroma(bg) < 3) faults.push(el.id + " not in its accord's colour: " + bg);
      (byShelf[code] = byShelf[code] || new Set()).add(getComputedStyle(el).borderTopColor);
    });
    const colours = Object.values(byShelf).map((set) => [...set]);
    return { gone, faults, n: all.length, oneEach: colours.every((c) => c.length === 1),
      distinct: new Set(colours.map((c) => c[0])).size, accords: colours.length };
  });
  expect(out.gone, "nothing of the books or the files is left").toEqual([]);
  expect(out.n).toBeGreaterThan(300);
  expect(out.faults).toEqual([]);
  expect(out.oneEach, "one colour to an accord").toBe(true);
  expect(out.distinct, "and each accord its own").toBe(out.accords);
});

/* THE PAGE IS BLACK AND WHITE. "change the theme of the bage from that
   turqoise to black/white (to match the rest of the website" (2026-09-26).
   Every piece of the page that carried the turquoise — the kicker, the
   terminal, its prompt, the order that is on, the tab that is on, a book
   answering the terminal, the card's headings — is read back as a grey
   (no colour in it at all), and so is the ground. The accords keep
   theirs. */
test("the page is black and white, with colour left only on the accords", async ({ page }) => {
  await arrive(page);
  await page.locator(".lib-query").fill("cedar");
  await page.waitForTimeout(500);
  await page.locator("#note-cedarwood").click();
  await expect(page.locator(".lib-card")).toBeVisible();
  const out = await page.evaluate(() => {
    const colours = [];
    const take = (sel, prop, pseudo) => {
      const el = document.querySelector(sel);
      if (!el) return colours.push([sel, "missing"]);
      colours.push([sel + " " + prop, getComputedStyle(el, pseudo || null)[prop]]);
    };
    take("body", "backgroundColor");
    take(".lib-kicker", "color");
    take(".lib-terminal", "borderTopColor");
    take(".lib-prompt", "color");
    take(".lib-order-by.is-on", "backgroundColor");
    take(".lib-tab.is-on", "borderTopColor");
    take(".lib-record.is-hit", "boxShadow");
    take(".lib-record.is-hit", "backgroundColor", "::before");
    take(".lib-found-head", "color");
    take(".lib-card", "backgroundColor");
    const chroma = (v) => {
      const all = (String(v).match(/rgba?\([^)]*\)/g) || []);
      return Math.max(0, ...all.map((c) => {
        const n = c.match(/[\d.]+/g).slice(0, 3).map(Number);
        return Math.max(...n) - Math.min(...n);
      }));
    };
    return {
      coloured: colours.filter(([, v]) => v === "missing" || chroma(v) > 6).map(([k, v]) => k + ": " + v),
      accord: chroma(getComputedStyle(document.querySelector(".lib-shelf-code")).color),
      body: getComputedStyle(document.body).backgroundColor,
    };
  });
  expect(out.coloured, "no turquoise, and no other colour, on the page's own parts").toEqual([]);
  expect(Math.max(...out.body.match(/\d+/g).slice(0, 3).map(Number)), `on a black ground (${out.body})`).toBeLessThan(24);
  expect(out.accord, "while the accords keep their colours").toBeGreaterThan(40);
});

/* THE CARD AND THE SLIP ARE DRAWN AS THE REST OF THE SITE IS. "The popup
   windows ... feel too futuristic. fix that, make it like the rest of
   the site: themed with particles and geometry." Read off the card as
   drawn: no blur behind it, no glow inside it, no coloured bar along
   its top — and at its head the mark, a canvas with a ring of specks on
   it. (The slip went with the books: a file carries its name on its face.) */
test("the card is hairlines and specks rather than glass", async ({ page }) => {
  await arrive(page);
  await page.locator("#note-cedarwood").click();
  const card = page.locator(".lib-card");
  await expect(card).toBeVisible();
  await page.waitForTimeout(700);
  const out = await card.evaluate((el) => {
    const cs = getComputedStyle(el);
    const mark = el.querySelector("canvas.lib-card-mark");
    let ink = 0;
    if (mark && mark.width) {
      const d = mark.getContext("2d").getImageData(0, 0, mark.width, mark.height).data;
      for (let i = 3; i < d.length; i += 4) if (d[i] > 30) ink++;
    }
    return { blur: cs.backdropFilter || cs.webkitBackdropFilter || "none", shadow: cs.boxShadow,
      top: cs.borderTopWidth, ink, glow: getComputedStyle(el.querySelector(".lib-card-call")).textShadow };
  });
  expect(out.blur, "no glass blur behind it").toBe("none");
  expect(out.shadow, "no glow inside it").not.toMatch(/inset/);
  expect(parseFloat(out.top), "no lit bar along its top").toBeLessThanOrEqual(1);
  expect(out.glow, "and its call number does not glow").toBe("none");
  expect(out.ink, "the mark at its head is drawn").toBeGreaterThan(80);
});

/* THE ELEMENT CARD. Pressing an element outlines it and opens its card:
   ELEMENT with its symbol and call number across its head, its tile large,
   its ATOM — an electron for every fragrance using it — with a caption
   saying so, its name and accord, what it is, its ISOTOPES (the other
   spellings) and its COMPOUNDS (the fragrances using it). Its close
   closes it. */
test("pressing an element opens its card, with an electron for every fragrance using it", async ({ page }) => {
  await page.addInitScript(() => {
    window.__electrons = 0;
    const P = CanvasRenderingContext2D.prototype, fillRect = P.fillRect;
    P.fillRect = function (x, y, w, h) {
      if (this.canvas.classList.contains("lib-card-mark") && Math.abs(w - 2.8) < 0.01) window.__electrons++;
      return fillRect.apply(this, arguments);
    };
  });
  await arrive(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#note-cedarwood").click();
  const card = page.locator(".lib-card");
  await expect(card).toBeVisible();
  await expect(page.locator("#note-cedarwood")).toHaveClass(/is-out/);
  const el = page.locator("#note-cedarwood");
  const uses = +(await el.getAttribute("data-uses"));
  const sym = await el.getAttribute("data-sym");
  await expect(card.locator(".lib-card-kind")).toHaveText("Element");
  await expect(card.locator(".lib-card-call")).toHaveText(sym + " · " + (await el.getAttribute("data-call")));
  await expect(card.locator(".lib-card-tile .lib-key-sym")).toHaveText(sym);
  await expect(card.locator(".lib-card-tile .lib-key-no")).toHaveText(await el.getAttribute("data-no"));
  await expect(card.locator(".lib-card-tile .lib-key-uses")).toHaveText(String(uses));
  await expect(card.locator(".lib-card-caption")).toHaveText(uses + " electrons — one for every fragrance using it");
  await expect(card.locator(".lib-card-name")).toHaveText("Cedarwood");
  await expect(card.locator(".lib-card-aka .lib-drop-name")).toHaveText("Isotopes");
  await expect(card.locator(".lib-card-found h3")).toHaveText("Compounds · " + String(uses).padStart(2, "0"));
  // The atom: one electron drawn for every fragrance, each time it is drawn.
  await page.waitForTimeout(300);
  const drawn = await page.evaluate(() => window.__electrons);
  expect(drawn % uses, "a whole number of atoms drawn").toBe(0);
  expect(drawn, "and at least one").toBeGreaterThanOrEqual(uses);
  await card.locator(".lib-card-close").click();
  await expect(card).toBeHidden();
  await expect(page.locator("#note-cedarwood")).not.toHaveClass(/is-out/);
});

/* THE KEY at the head of the page says what each part of a tile is, and
   shows the element the hand is on — the one used most until then. */
test("the key at the head of the page shows the element under the hand", async ({ page }) => {
  await arrive(page);
  const key = page.locator(".lib-key");
  await expect(key).toBeVisible();
  await expect(key.locator(".lib-key-say")).toHaveText(["Number", "Fragrances using it", "Symbol", "Note"]);
  await expect(key.locator(".lib-key-name")).toHaveText("Cedarwood");
  await page.locator("#note-bergamot").hover();
  await expect(key.locator(".lib-key-name")).toHaveText("Bergamot");
  await expect(key.locator(".lib-key-sym")).toHaveText(await page.locator("#note-bergamot").getAttribute("data-sym"));
  await expect(key.locator(".lib-key-uses")).toHaveText(await page.locator("#note-bergamot").getAttribute("data-uses"));
});

/* MORE AIR: "the library feels crowded, I want you to stylistically make
   it more breathable". Kept in the table: the groups stand apart from each
   other, across and down, and the elements a hair apart inside them. */
test("the groups breathe", async ({ page }) => {
  await arrive(page);
  const out = await page.evaluate(() => {
    const stacks = getComputedStyle(document.querySelector(".lib-stacks"));
    const cs = getComputedStyle(document.querySelector(".lib-records"));
    return { across: parseFloat(stacks.columnGap), down: parseFloat(stacks.rowGap), inside: parseFloat(cs.columnGap) };
  });
  expect(out.across, "between one group and the next").toBeGreaterThanOrEqual(16);
  expect(out.down, "and between one band of groups and the next").toBeGreaterThanOrEqual(24);
  expect(out.inside, "the elements a hair apart").toBeGreaterThanOrEqual(3);
});

/* EVERY ACCORD IS A GROUP. Its head carries its number (in the order the
   accords stand on the page), its code in its colour, its name and how
   many elements it holds, over a rule in its colour; and its elements
   stand down in columns SEVEN DEEP — the periods — as many columns across
   as it needs. */
test("every accord is a group, seven deep, under a head saying what is in it", async ({ page }) => {
  await arrive(page);
  const out = await page.evaluate(() => {
    const faults = [];
    const shelves = [...document.querySelectorAll(".lib-shelf")];
    shelves.forEach((g, i) => {
      const code = g.dataset.shelf;
      const head = g.querySelector(".lib-plate");
      const n = g.querySelectorAll(".lib-record").length;
      const no = head.querySelector(".lib-group-no");
      if (!no || no.textContent !== String(i + 1).padStart(2, "0")) faults.push(code + " numbered " + (no && no.textContent));
      if (head.querySelector(".lib-shelf-code").textContent !== code) faults.push(code + " code");
      if (head.querySelector(".lib-shelf-count").textContent !== String(n)) faults.push(code + " count");
      // Seven deep, and as many across as it needs — read off where each
      // stands in the layout, which the tiles' arrival does not move.
      const tops = new Set([...g.querySelectorAll(".lib-record")].map((el) => el.offsetTop));
      const lefts = new Set([...g.querySelectorAll(".lib-record")].map((el) => el.offsetLeft));
      if (tops.size !== Math.min(7, n)) faults.push(code + " stands " + tops.size + " deep");
      if (lefts.size !== Math.ceil(n / 7)) faults.push(code + " is " + lefts.size + " across for " + n);
      // Read down each column first, in order.
      const els = [...g.querySelectorAll(".lib-record")];
      if (n > 7 && els[1].offsetLeft !== els[0].offsetLeft)
        faults.push(code + " does not read down first");
    });
    return { faults, groups: shelves.length };
  });
  expect(out.groups).toBeGreaterThan(10);
  expect(out.faults).toEqual([]);
});

/* THE LAMP RUNS A BEAT BEHIND THE HAND, like the cursor's square: "make
   the light that follows the cursor have a slight delay ... so that it
   is smoother and not so mechanical." Moved in one jump, the lamp is
   still on its way a frame later, and has arrived within a second. */
test("the lamp follows the pointer a beat behind it", async ({ page }) => {
  await arrive(page);
  await page.mouse.move(200, 300);
  await page.waitForTimeout(900);
  const at = () => page.evaluate(() => {
    const lamp = document.querySelector(".lib-lamp");
    return [parseFloat(lamp.style.getPropertyValue("--lx")), parseFloat(lamp.style.getPropertyValue("--ly"))];
  });
  expect((await at())[0]).toBeCloseTo(200, 0);
  await page.mouse.move(900, 600);
  const soon = await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => {
    const lamp = document.querySelector(".lib-lamp");
    done(parseFloat(lamp.style.getPropertyValue("--lx")));
  }))));
  expect(soon, "a frame or two on, the lamp is still on its way").toBeLessThan(820);
  expect(soon, "but it has set off").toBeGreaterThan(200);
  // And it arrives. Waited for rather than read at a fixed moment: on a
  // busy machine fewer frames are drawn, and it was half a pixel short
  // at one second.
  await expect.poll(async () => {
    const [x, y] = await at();
    return Math.max(Math.abs(x - 900), Math.abs(y - 600));
  }, { timeout: 3000 }).toBeLessThan(1);
});

/* THE ELEMENTS STAND IN THEIR GROUPS: each within its group's width, none
   on top of another, no group on another; at a phone's width too (where a
   group is the page's width and reads across), and never a sideways
   scroll. */
test("the elements stand in their groups without running into each other", async ({ page }) => {
  for (const size of [{ width: 1440, height: 900 }, { width: 900, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(size);
    await arrive(page);
    // The table fills in over about a second and a half; measured after.
    await expect(page.locator("body")).not.toHaveClass(/lib-arriving/, { timeout: 5000 });
    const out = await page.evaluate(() => {
      const faults = [];
      const groups = [...document.querySelectorAll(".lib-shelf")].map((g) => ({ g, r: g.getBoundingClientRect() }));
      const hits = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
      groups.forEach(({ g, r }, i) => {
        for (let j = i + 1; j < groups.length; j++) if (hits(r, groups[j].r)) faults.push(g.id + " on " + groups[j].g.id);
        const els = [...g.querySelectorAll(".lib-record")].map((el) => ({ el, r: el.getBoundingClientRect() }));
        els.forEach(({ el, r: e }, k) => {
          if (e.left < r.left - 1 || e.right > r.right + 1) faults.push(el.id + " out of its group");
          for (let m = k + 1; m < els.length; m++) if (hits(e, els[m].r)) faults.push(el.id + " on " + els[m].el.id);
        });
      });
      return { faults, wide: document.documentElement.scrollWidth - window.innerWidth };
    });
    expect(out.faults, `at ${size.width}px`).toEqual([]);
    expect(out.wide, `the page scrolls sideways at ${size.width}px`).toBeLessThanOrEqual(1);
  }
});

/* THE × AT THE RIGHT OF THE BAR: "let the search bar stay the same (just
   make there a little X to reset the search on the right side of the
   bar)". Faint and not pressable while the bar is empty; with something
   typed, it stands at the bar's right end, and pressing it empties the
   bar, lights nothing, dims nothing, brings every group back and leaves the
   typing in the bar. The browser's own clearing mark is not shown too. */
test("the × at the right of the search bar clears it", async ({ page }) => {
  await arrive(page);
  const query = page.locator(".lib-query");
  const clear = page.locator(".lib-clear");
  await expect(clear).toBeVisible();
  await expect(clear).toBeDisabled();
  await query.fill("cedar");
  await expect(clear).toBeEnabled();
  await expect(page.locator("#shelf-cit"), "a group with nothing answering goes dim").toHaveClass(/is-away/);
  const at = await page.evaluate(() => {
    const bar = document.querySelector(".lib-terminal").getBoundingClientRect();
    const x = document.querySelector(".lib-clear").getBoundingClientRect();
    const count = document.querySelector(".lib-count").getBoundingClientRect();
    return { right: bar.right - x.right, afterCount: x.left >= count.right, inBar: x.top >= bar.top && x.bottom <= bar.bottom,
      // The browser's own mark cannot be read off the element, so it is
      // read off the stylesheet: a rule taking it off this field.
      native: [...document.styleSheets].some((sheet) => {
        try {
          return [...sheet.cssRules].some((rule) => rule.selectorText && rule.selectorText.includes(".lib-query::-webkit-search-cancel-button") &&
            rule.style.display === "none");
        } catch (e) { return false; }
      }) ? "none" : "shown" };
  });
  expect(at.right, "at the right end of the bar").toBeLessThan(30);
  expect(at.right).toBeGreaterThanOrEqual(0);
  expect(at.afterCount, "after the count").toBe(true);
  expect(at.inBar, "inside the bar").toBe(true);
  expect(at.native, "and the browser's own mark is not shown as well").toBe("none");
  await clear.click();
  await expect(query).toHaveValue("");
  await expect(query).toBeFocused();
  await expect(clear).toBeDisabled();
  await expect(page.locator(".lib-record.is-hit")).toHaveCount(0);
  await expect(page.locator(".lib-record.is-dim")).toHaveCount(0);
  await expect(page.locator("#shelf-cit")).not.toHaveClass(/is-away/);
  // Typed from the keyboard, and cleared the same way.
  await query.pressSequentially("tonka");
  await expect(page.locator(".lib-record.is-hit").first()).toBeVisible();
  await clear.click();
  await expect(query).toHaveValue("");
  await expect(page.locator(".lib-shelf.is-away")).toHaveCount(0);
});

/* THE TERMINAL: elements that answer light up, the rest go dim, and so
   does a group with nothing in it — dimmed rather than folded away, so the
   table keeps its shape. It reads other spellings — and DIRECT
   WORDS ONLY, at the owner's word: nothing is found by what a note is
   said to be, and no near miss counts. */
test("the terminal lights the elements that answer and dims the rest", async ({ page }) => {
  await arrive(page);
  const query = page.locator(".lib-query");

  // Another spelling: Blood Cedar is shelved as Cedarwood, and is not
  // in its name or its explanation — only in the spellings folded in.
  await query.fill("blood cedar");
  await expect(page.locator("#note-cedarwood")).toHaveClass(/is-hit/);
  expect(await page.locator("#note-cedarwood .lib-say").textContent()).not.toMatch(/blood/i);
  await expect(page.locator("#note-bergamot")).not.toHaveClass(/is-hit/);
  await expect(page.locator("#shelf-cit"), "a group with nothing answering goes dim, and stays where it is").toHaveClass(/is-away/);
  await expect(page.locator("#shelf-cit")).toBeVisible();
  await expect(page.locator(".lib-count")).toHaveText(/^\d+ \/ \d+$/);

  // A word only in the explanations lights nothing that is not called
  // it: "smoky" is said of a dozen notes and names only a couple.
  await query.fill("smoky");
  const lit = await page.locator(".lib-record.is-hit").evaluateAll((all) =>
    all.map((el) => el.querySelector(".lib-name").textContent + " | " + (el.dataset.aka || "")));
  lit.forEach((names) => expect(names, "lit by a name, not a description").toMatch(/\bsmoky/i));
  const saidSmoky = await page.locator(".lib-say").evaluateAll((all) =>
    all.filter((el) => /smoky/i.test(el.textContent)).length);
  expect(saidSmoky, "there are notes only said to be smoky").toBeGreaterThan(lit.length);

  // A word typed must BE a word in a name: "cedar" finds the cedars and
  // nothing else, half a word finds nothing, and "iris" finds Orris and
  // not Seaweed, whose Irish Sea Moss it used to light.
  await query.fill("cedar");
  const cedars = await page.locator(".lib-record.is-hit .lib-name").allTextContents();
  expect(cedars.length).toBeGreaterThan(2);
  cedars.forEach((n) => expect(n).toMatch(/cedar/i));
  await query.fill("iris");
  await expect(page.locator("#note-orris")).toHaveClass(/is-hit/);
  await expect(page.locator("#note-seaweed")).not.toHaveClass(/is-hit/);
  await query.fill("vetiv");
  await expect(page.locator(".lib-record.is-hit")).toHaveCount(0);
  await query.fill("vetivr");
  await expect(page.locator(".lib-record.is-hit")).toHaveCount(0);

  // Enter opens the best answer.
  await query.fill("vetiver");
  await query.press("Enter");
  await expect(page.locator(".lib-card-name")).toHaveText("Vetiver");

  // And nothing at all hands over to the whole site's search.
  await query.fill("qqqzzzxx");
  await expect(page.locator(".lib-nothing")).toBeVisible();
  await expect(page.locator(".lib-elsewhere")).toHaveAttribute("href", "../search.html?q=qqqzzzxx");
  await query.fill("");
  await expect(page.locator(".lib-record.is-dim")).toHaveCount(0);
});

/* THE INDEX: one tab per accord, and a tab lights its group — every
   other goes dim where it stands, as a periodic table's key does. */
test("an accord tab lights that group and dims the rest", async ({ page }) => {
  await arrive(page);
  await expect(page.locator(".lib-tab")).toHaveCount(await page.locator(".lib-shelf").count() + 1);
  await page.locator(".lib-tab[data-shelf='WOO']").click();
  await expect(page.locator("#shelf-woo")).not.toHaveClass(/is-away/);
  await expect(page.locator("#shelf-cit")).toHaveClass(/is-away/);
  await expect(page.locator(".lib-shelf:not(.is-away)")).toHaveCount(1);
  await page.locator(".lib-tab[data-shelf='']").click();
  await expect(page.locator(".lib-shelf.is-away")).toHaveCount(0);
});

/* MOST USED reorders a group by use, and the call numbers — where an
   element belongs — stay where they were. */
test("ordering by use moves the elements and keeps their numbers", async ({ page }) => {
  await arrive(page);
  const callBefore = await page.locator("#note-cedarwood").getAttribute("data-call");
  await page.locator(".lib-order-by[data-order='uses']").click();
  const order = await page.$$eval("#shelf-woo .lib-record", (all) => all.map((el) => +el.dataset.uses));
  expect(order).toEqual([...order].sort((a, b) => b - a));
  expect(await page.locator("#note-cedarwood").getAttribute("data-call")).toBe(callBefore);
  await page.locator(".lib-order-by[data-order='alpha']").click();
  const names = await page.$$eval("#shelf-woo .lib-name", (all) => all.map((el) => el.textContent.toLowerCase()));
  expect(names).toEqual([...names].sort());
});

/* THE KEYBOARD: one element takes the tab, the arrows walk the table, and
   Enter opens its card. */
test("the elements can be walked and opened with the keyboard", async ({ page }) => {
  await arrive(page);
  await expect(page.locator(".lib-record[tabindex='0']")).toHaveCount(1);
  await page.locator(".lib-record[tabindex='0']").focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const id = await page.evaluate(() => document.activeElement.id);
  const third = await page.evaluate(() => document.querySelectorAll(".lib-record")[2].id);
  expect(id).toBe(third);
  await page.keyboard.press("Enter");
  await expect(page.locator(".lib-card")).toBeVisible();
  await expect(page.locator("#" + id)).toHaveClass(/is-out/);
});

/* THE SITE'S OWN SEARCH reads the library off the page like everything
   else, and finds a note by another of its spellings. */
test("the site's search finds a note, by any of its spellings", async ({ page }) => {
  await serveDependenciesLocally(page);
  await page.goto("/search.html?q=iris%20butter");
  const row = page.locator(".find-results a", { hasText: "Orris" }).first();
  await expect(row).toBeVisible({ timeout: 15000 });
  await expect(row).toHaveAttribute("href", /note-library\.html#note-orris$/);
  await expect(page.locator(".find-filter[data-kind='Note']")).toBeVisible();
});

/* WITH ANIMATION TURNED OFF the table is simply there, and the
   readout is already at its figures. */
test.describe("with reduced motion", () => {
  test("the library is there at once", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await arrive(page);
    await expect(page.locator("body")).not.toHaveClass(/lib-arriving/);
    await expect(page.locator(".lib-scan")).toHaveCount(0);
    const records = await page.locator(".lib-record").count();
    await expect(page.locator(".lib-readout dd").first()).toHaveText(String(records));
  });
});

/* WITHOUT THE SCRIPT the catalogue is the page: every record, readable. */
test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the catalogue is a plain list", async ({ page }) => {
    await page.goto(LIBRARY);
    await expect(page.locator(".lib-record").first()).toBeVisible();
    await expect(page.locator("#note-bergamot .lib-say")).toBeVisible();
    expect(await page.locator(".lib-record").count()).toBeGreaterThan(300);
  });
});

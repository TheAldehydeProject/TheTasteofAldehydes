// ============================================================
// THE RULEBOOK (2026-10-13)
//
// The owner: "I want you to create a rulebook for every new note ... Make
// this rulebook physical, add it to the code so that all of the above steps
// occur when adding a new perfume." The rulebook is
// tools/note-library/RULEBOOK.md; its checker is
// tools/note-library/rulebook.js. These run it with the rest of the suite,
// so a perfume added without its steps done fails until they are:
//
//   1. the checker finds nothing undone — every fragrance's notes filed
//      (rule 1), every note in a record (3), researched with two sources
//      (4), drawn (5), its distribution as its source gives it (6), every
//      house's fragrances listable (7), everything cited (10), no source
//      twice (11);
//   2. and in the library itself, the newest fragrance on every page is in
//      the window of every note it names, at the tier its source gives it,
//      listed by its own title, with the combinations and the statistics
//      under it (rules 2, 7, 8 and 9 — the library's own counting, done as
//      it opens).
// Rule 12 — ask the owner, decide nothing — is the person's to keep; the
// checker prints the questions it can see.
// See docs/features/2026-10-13-the-rulebook-for-a-new-perfume.md.
// ============================================================
const { test, expect } = require("@playwright/test");
const { serveDependenciesLocally } = require("./helpers");
const rulebook = require("../tools/note-library/rulebook.js");

test("the rulebook's checker finds every rule kept", () => {
  test.setTimeout(60000);
  const { problems, questions } = rulebook.check();
  const say = problems.map(([r, t]) => `rule ${r}: ${t}`).concat(questions.map((q) => "rule 12, ask the owner: " + q));
  expect(say, say.join("\n")).toEqual([]);
});

test("the rulebook is on paper, all twelve rules, the twelfth over the rest", () => {
  const fs = require("fs"), path = require("path");
  const text = fs.readFileSync(path.join(__dirname, "..", "tools", "note-library", "RULEBOOK.md"), "utf8");
  for (let k = 1; k <= 12; k++) expect(text, "rule " + k).toMatch(new RegExp("^### " + k + "\\. ", "m"));
  expect(text).toContain("run any ambiguities by me and do not decide anything by yourself");
  expect(text).toContain("node tools/note-library/rulebook.js --check");
  // and CLAUDE.md sends whoever adds a perfume to it
  const claude = fs.readFileSync(path.join(__dirname, "..", "CLAUDE.md"), "utf8");
  expect(claude).toContain("tools/note-library/RULEBOOK.md");
});

test("the newest fragrance on every page is in the window of every note it names", async ({ page }) => {
  test.setTimeout(420000);
  await serveDependenciesLocally(page);
  const N = rulebook.notesData();
  const recs = rulebook.records();
  const recordOf = new Map();
  recs.forEach((r) => [r.name].concat(r.aka).forEach((s) => recordOf.set(s.toLowerCase(), r.name)));
  // the newest on each page: its highest-numbered fragrance with notes
  const newest = new Map();
  rulebook.fragrances().forEach((f) => {
    const e = N[f.key];
    if (!e || !rulebook.namesIn(e).length) return;
    const was = newest.get(f.page);
    if (!was || +f.key.split(":")[1] > +was.key.split(":")[1]) newest.set(f.page, f);
  });
  expect(newest.size, "a fragrance on every page").toBeGreaterThan(10);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/note-library/");
  await expect(page.locator(".net-stage")).toHaveClass(/is-drawn/, { timeout: 15000 });
  await expect.poll(() => page.evaluate(() => window.NetScene.state().loaded), { timeout: 30000 }).toBe(true);

  const TIER = ["top", "mid", "base", "flat"];
  const opened = [];
  for (const f of newest.values()) {
    const e = N[f.key];
    const lists = [e.top, e.mid, e.base, e.flat].concat(e.also ? [e.also.top, e.also.mid, e.also.base, e.also.flat] : []);
    const want = new Map();   // record name → tiers it stands at in this fragrance
    lists.forEach((l, j) => (l || []).forEach((n) => {
      const r = recordOf.get(n.toLowerCase());
      expect(r, `${f.key}: "${n}" is in a record`).toBeTruthy();
      if (!want.has(r)) want.set(r, new Set());
      want.get(r).add(TIER[j % 4]);
    }));
    for (const [r, tiers] of want) {
      const about = await page.evaluate((name) => window.NetScene.about(name), r);
      expect(about, r).toBeTruthy();
      expect(about.keys, `${r} counts ${f.key}`).toContain(f.key);
      tiers.forEach((t) => expect(about.tiers[t], `${r}: ${f.key} at its ${t}`).toContain(f.key));
    }
    // its window, for every note of the newest individual fragrance and the
    // first of each other page's newest
    const look = f.page.startsWith("individual") ? [...want.keys()] : [...want.keys()].slice(0, 1);
    look.forEach((r) => opened.push([f, r]));
  }
  for (const [f, r] of opened) {
    // pressed as a note is pressed — chosen, and its window opened — and read
    // in the page itself, where the drawing does not keep the test browser
    // waiting on a still frame; then closed by its ×
    const got = await page.evaluate(async ([name, title]) => {
      if (!window.NetScene.open(name)) return { opened: false };
      const win = document.querySelector(".net-note");
      const lists = () => (win.querySelector(".net-note-tier-lists") || {}).textContent || "";
      const t0 = performance.now();
      while (!lists().includes(title) && performance.now() - t0 < 10000) await new Promise((d) => setTimeout(d, 100));
      const out = {
        opened: !win.hidden, name: win.querySelector(".net-note-name").textContent.trim(), listed: lists().includes(title),
        combos: !!win.querySelector(".net-note-with h3"), stats: (win.querySelector(".net-note-stats .net-note-facts") || {}).children.length || 0,
      };
      win.querySelector(".net-note-close").click();
      const t1 = performance.now();
      while (!win.hidden && performance.now() - t1 < 5000) await new Promise((d) => setTimeout(d, 50));
      out.closed = win.hidden;
      return out;
    }, [r, f.title]);
    expect(got.opened, `${r}'s window`).toBe(true);
    expect(got.name).toBe(r);
    expect(got.listed, `${r}'s dropdowns list ${f.title} (${f.key})`).toBe(true);
    expect(got.combos, `${r}: its combinations`).toBe(true);
    expect(got.stats, `${r}: its statistics`).toBeGreaterThan(0);
    expect(got.closed, `${r}: closed by its ×`).toBe(true);
  }
});

#!/usr/bin/env node
// ============================================================
// THE RULEBOOK'S CHECKER — run by hand, and by the tests
//
// The owner, 2026-10-13: "I want you to create a rulebook for every new
// note ... Make this rulebook physical, add it to the code so that all of
// the above steps occur when adding a new perfume." The rulebook is
// RULEBOOK.md beside this file; this is the part of it the computer can
// hold anyone to. It reads the site as it stands — every house, the
// individual fragrances, the favourites, notes-data.js, the Note Library's
// catalogue and its figures — and says, rule by rule, what is not done.
//
//   node tools/note-library/rulebook.js            # the report
//   node tools/note-library/rulebook.js --check    # the same, failing if anything is not done
//
// tests/rulebook.spec.js runs it, so a perfume added without its notes
// filed, a note with no record, a record with one source, a figure
// missing or a source cited twice fails the suite until it is done.
// What it cannot hold anyone to — researching well, asking the owner —
// RULEBOOK.md says, and this prints the questions it can see (rule 12).
// ============================================================
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");

const REPO = path.join(__dirname, "..", "..");
const read = (p) => fs.readFileSync(path.join(REPO, p), "utf8");
const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

// RULE 1's ONE ALLOWANCE: a fragrance looked up and no list of its notes
// found anywhere has no entry, and its window says the notes have not been
// found yet. Each is named here with why, so that a fragrance added with
// no entry at all is not mistaken for one of them.
const NO_LIST_FOUND = {
  "tale:01": "Tale's own site could not be read to take its notes from (2026-09-23)",
  "tale:02": "Tale's own site could not be read to take its notes from (2026-09-23)",
  "tale:03": "Tale's own site could not be read to take its notes from (2026-09-23)",
  "tale:04": "Tale's own site could not be read to take its notes from (2026-09-23)",
  "om:01": "Nymphaea Caerulea: no list found anywhere (2026-10-10)",
  "om:04": "Cannabis Café: no list found anywhere (2026-10-10)",
  "om:09": "Smoke Oud: the house sells it as attars; the extrait's page was not found (2026-10-10)",
  "lost-tribe:01": "Kong: no list found anywhere (2026-10-10)",
};

/** Every fragrance on the site: its key, page, title. */
function fragrances() {
  const pages = fs.readdirSync(path.join(REPO, "houses")).filter((f) => f.endsWith(".html")).map((f) => "houses/" + f)
    .concat(["individual-fragrances/individual-fragrances.html"]);
  const out = [];
  pages.forEach((p) => {
    const html = read(p);
    const m = html.match(/window\.HOUSE_NOTES = "([^"]+)"/);
    if (!m) return;
    for (const part of html.matchAll(/<details class="(?:human|pine|adar)-part"[^>]*id="part-(\d+)"[^>]*>([\s\S]*?)<\/summary>/g)) {
      const t = part[2].match(/class="(?:human|pine|adar)-title[^"]*"[^>]*>([\s\S]*?)<\/span>/);
      out.push({ key: m[1] + ":" + part[1], page: p, house: m[1], title: t ? unescape(t[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim() : "" });
    }
  });
  return out;
}

function notesData() {
  const box = { window: {} };
  vm.runInNewContext(read("notes-data.js"), box);
  return box.window.FRAGRANCE_NOTES;
}

/** Every note-name a fragrance's entry names, the way the library counts
    them (network.js `counted`): the pyramid or the flat list, and the
    second list's. A landscape is impressions, not notes. */
function namesIn(e) {
  const lists = [e.top, e.mid, e.base, e.flat];
  if (e.also) lists.push(e.also.top, e.also.mid, e.also.base, e.also.flat);
  return lists.filter(Boolean).flat();
}

/** The Note Library's records, off its own catalogue. */
function records() {
  const html = read("note-library/index.html");
  const out = [];
  for (const m of html.matchAll(/<article class="lib-record" id="([^"]+)"( data-aka="([^"]*)")?>\s*<h3 class="lib-name">([^<]*)<\/h3>/g)) {
    const name = unescape(m[4]);
    out.push({ id: m[1], name, aka: (m[3] ? unescape(m[3]).split("|") : []).filter(Boolean) });
  }
  return out;
}

const WORD_SKIP = new Set("note notes accord the of and de la le absolute oil essence extract co2 tincture flower flowers wood woods resin resins leaf leaves".split(" "));
const wordsOf = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !WORD_SKIP.has(w));

function check() {
  const problems = [];   // [rule, text]
  const questions = [];  // rule 12: what only the owner can decide
  const say = [];        // what is right, for the report
  const N = notesData();
  const all = fragrances();
  const keys = new Set(all.map((f) => f.key));

  // RULE 1 — every fragrance on a house, the individual fragrances or a
  // favourite has its notes filed (or is named above as found nowhere).
  all.forEach((f) => {
    if (!N[f.key] && !NO_LIST_FOUND[f.key]) problems.push([1, `${f.key} (${f.title || "no title"}, ${f.page}) has no entry in notes-data.js: look its notes up (the house's own page first, Fragrantica second) and file them`]);
    if (N[f.key] && NO_LIST_FOUND[f.key]) problems.push([1, `${f.key} has notes now: take it out of NO_LIST_FOUND in rulebook.js`]);
  });
  Object.keys(N).forEach((k) => { if (!keys.has(k)) problems.push([1, `notes-data.js files ${k}, and there is no such fragrance on its page`]); });
  const fav = read("favourites/index.html");
  for (const m of fav.matchAll(/data-notes="([^"]+)"/g)) if (!N[m[1]]) problems.push([1, `a favourite names notes ${m[1]}, and there are none`]);
  say.push(`${all.length} fragrances, ${Object.keys(N).length} with notes filed, ${Object.keys(NO_LIST_FOUND).length} found nowhere`);

  // RULE 6 — the fragrance's own distribution, as its source gives it:
  // a pyramid only where the source divides one, otherwise one list;
  // every list a list of names; every source named and linked.
  Object.entries(N).forEach(([k, e]) => {
    const shape = (x, where) => {
      const pyr = ["top", "mid", "base"].some((t) => x[t]);
      if (pyr && x.flat) problems.push([6, `${k}${where}: both a pyramid and a flat list`]);
      ["top", "mid", "base", "flat"].forEach((t) => {
        if (x[t] && (!Array.isArray(x[t]) || !x[t].length || x[t].some((n) => typeof n !== "string" || !n.trim()))) problems.push([6, `${k}${where}: its ${t} is not a list of names`]);
      });
      if (!x.missing && !pyr && !x.flat) problems.push([6, `${k}${where}: no notes and no word that none were found`]);
    };
    shape(e, "");
    if (e.also) shape(e.also, " (second list)");
    // RULE 10 — cited
    [[e.source, ""], [e.also && e.also.source, " (second list)"]].forEach(([s, where]) => {
      if (where && !e.also) return;
      if (!s && e.missing && !where) return;          // found nowhere at all: no page to point at
      if (!s || !s.name || !/^https:\/\//.test(s.url || "")) problems.push([10, `${k}${where}: its source is not named and linked`]);
    });
  });

  // RULES 2 AND 3 — every note a fragrance names is in the library, by
  // its name or as one of its spellings; a new one added, a variation
  // added as a variation. (Rule 2's counting is the library's own, done as
  // it opens: nothing to write by hand.)
  const recs = records();
  const spelled = new Map();
  recs.forEach((r) => [r.name].concat(r.aka).forEach((s) => spelled.set(s.toLowerCase(), r)));
  const named = new Map();
  Object.entries(N).forEach(([k, e]) => namesIn(e).forEach((n) => {
    if (!named.has(n)) named.set(n, new Set());
    named.get(n).add(k);
  }));
  named.forEach((ks, n) => {
    if (spelled.has(n.toLowerCase())) return;
    problems.push([3, `"${n}" (${[...ks].join(", ")}) is in no record of the Note Library`]);
    const mine = wordsOf(n);
    const near = recs.filter((r) => [r.name].concat(r.aka).some((s) => wordsOf(s).some((w) => mine.some((m) => m === w || m === w + "s" || w === m + "s"))));
    questions.push(near.length
      ? `Is "${n}" a variation of ${near.slice(0, 4).map((r) => '"' + r.name + '"').join(" or ")}, or a new note?`
      : `"${n}" is new to the library: which accord is it in?`);
  });
  say.push(`${named.size} notes named across the fragrances, ${recs.length} records in the library`);

  // RULE 5 — every record has a figure of its own.
  const figures = read("note-figures.js");
  const block = figures.slice(figures.indexOf("const FIGURES = {"), figures.indexOf("const BY_ACCORD"));
  const drawn = new Set([...block.matchAll(/^\s+"((?:[^"\\]|\\.)+)":/gm)].map((m) => m[1].replace(/\\(.)/g, "$1")));
  recs.forEach((r) => { if (!drawn.has(r.name)) problems.push([5, `${r.name} has no figure in FIGURES (note-figures.js)`]); });

  // RULE 7 — what the window's dropdowns name: every house has its line
  // in network.js, every fragrance a title to be listed by.
  const net = read("network.js");
  const table = (net.match(/const HOUSES = \{([\s\S]*?)\};/) || [, ""])[1];
  new Set(Object.keys(N).map((k) => k.split(":")[0])).forEach((h) => {
    if (!new RegExp("(^|[\\s{,\"])" + h.replace(/-/g, "\\-") + "\"?:").test(table)) problems.push([7, `the house "${h}" has no line in HOUSES (network.js), so its fragrances cannot be listed in a note's window`]);
  });
  all.forEach((f) => { if (N[f.key] && !f.title) problems.push([7, `${f.key} has no title for a note's window to list it by`]); });

  // RULES 4, 10 AND 11 — every note researched with two sources at
  // least, every variation written, every source in the list in MLA 8 and
  // none in it twice, and the page as the research says: the catalogue's
  // own check.
  const cat = spawnSync("python3", [path.join(__dirname, "catalogue.py"), "--check"], { encoding: "utf8" });
  if (cat.error) problems.push([4, "could not run catalogue.py: " + cat.error.message]);
  else {
    (cat.stdout || "").split("\n").filter((l) => l.startsWith("  ! ")).forEach((l) => {
      const t = l.slice(4);
      problems.push([/twice\?/.test(t) ? 11 : /not what the research says/.test(t) ? 10 : 4, t]);
    });
    const head = (cat.stdout || "").split("\n")[0];
    if (/not researched yet/.test(cat.stdout || "")) problems.push([4, (cat.stdout.match(/not researched yet[^\n]*/) || [""])[0]]);
    if (head) say.push(head.trim());
    if (cat.status !== 0 && !problems.some(([r]) => r === 4 || r === 10 || r === 11)) problems.push([4, "catalogue.py --check failed: " + (cat.stderr || cat.stdout).trim()]);
  }
  return { problems, questions, say };
}

module.exports = { check, fragrances, notesData, records, namesIn, NO_LIST_FOUND };

if (require.main === module) {
  const { problems, questions, say } = check();
  say.forEach((s) => console.log(s));
  if (!problems.length) console.log("Every rule that can be checked is kept.");
  problems.sort((a, b) => a[0] - b[0]).forEach(([r, t]) => console.log(`  rule ${r}: ${t}`));
  if (questions.length) {
    console.log("\nRULE 12 — ask the owner, and decide nothing:");
    questions.forEach((q) => console.log("  ? " + q));
  }
  if (process.argv.includes("--check")) process.exit(problems.length ? 1 : 0);
}

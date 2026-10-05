// ============================================================
// CHECKS ON THE FILES THEMSELVES
//
// These don't open a browser. They read the site's files the way
// you would if you were checking them by hand: does every link
// point at something that exists, and has anything that looks
// like a password or key been committed by accident.
// ============================================================
const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/** Every .html file in the site, ignoring installed packages. */
function htmlFiles(dir = ROOT, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" ||
        entry.name === "test-results" || entry.name === "playwright-report") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, found);
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

/** Strip HTML comments, so example markup inside them isn't treated as real. */
function withoutComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

test("every link between pages points at a file that exists", async () => {
  const problems = [];

  for (const file of htmlFiles()) {
    const html = withoutComments(fs.readFileSync(file, "utf8"));
    const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

    for (const href of hrefs) {
      // Skip anything that isn't a file in this repo.
      if (/^(https?:)?\/\//.test(href)) continue;
      if (href.startsWith("mailto:") || href.startsWith("#") || href.startsWith("data:")) continue;

      const target = path.resolve(path.dirname(file), href.split("#")[0].split("?")[0]);
      // (a link to a folder — every Menu page is one since 2026-10-01 — is
      // a link to its index.html, which has to be there)
      if (fs.existsSync(target) && (!fs.statSync(target).isDirectory() || fs.existsSync(path.join(target, "index.html")))) continue;

      // A PICTURE THAT IS NOT THERE YET IS NOT A BROKEN LINK. The
      // pages name the photograph they want for each piece — ADAR's
      // eleven are listed in images/README.txt — and show it the
      // moment the file is added, taking the <img> off the page until
      // then. The owner adds those one at a time. Everything else
      // pointing at something missing is still a fault: a page, a
      // script, a stylesheet, or a picture anywhere but in images/.
      const missingPicture = /^\.{0,2}\/?(\.\.\/)?images\//.test(href) &&
        /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(href);
      if (missingPicture) continue;

      problems.push(`${path.relative(ROOT, file)} -> ${href}`);
    }
  }

  expect(problems, "links pointing at files that don't exist").toEqual([]);
});

test("the links defined in JavaScript point at pages that exist", async () => {
  // The menu (SITE_LINKS in nav.js) and the map (REAL_NODES in
  // node-scene.js) define their links in code rather than in HTML, so
  // the check above can't see them.
  const problems = [];
  const sources = ["nav.js", "node-scene.js"];

  for (const name of sources) {
    const src = fs.readFileSync(path.join(ROOT, name), "utf8");
    const hrefs = [...src.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs.length, `${name} should define some links`).toBeGreaterThan(0);

    for (const href of hrefs) {
      // These are written relative to the site root; a folder is its index.html.
      if (!fs.existsSync(path.join(ROOT, href, href === "" || href.endsWith("/") ? "index.html" : ""))) problems.push(`${name} -> ${href}`);
    }
  }

  expect(problems, "links in code pointing at pages that don't exist").toEqual([]);
});

test("no passwords, keys or tokens have been committed", async () => {
  // The site has no accounts, no forms and talks to no services, so
  // there should never be a credential anywhere in it. This is a guard
  // against one being pasted in later and quietly published — every
  // file here is public the moment it's pushed.
  const patterns = [
    /AKIA[0-9A-Z]{16}/,                   // AWS access key
    /ghp_[0-9A-Za-z]{20,}/,               // GitHub token
    /xox[baprs]-[0-9A-Za-z-]{10,}/,       // Slack token
    /AIza[0-9A-Za-z_-]{20,}/,             // Google API key
    /sk-[A-Za-z0-9]{20,}/,                // OpenAI-style key
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/, // private key file
    /(?:password|passwd|secret|api[_-]?key)\s*[:=]\s*["'][^"'\s]{6,}["']/i,
  ];

  const checked = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", ".git", "test-results", "playwright-report", "images"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js|css|json|md|txt)$/.test(entry.name)) checked.push(full);
    }
  }
  walk(ROOT);

  const findings = [];
  for (const file of checked) {
    const text = fs.readFileSync(file, "utf8");
    for (const pattern of patterns) {
      const hit = pattern.exec(text);
      if (hit) findings.push(`${path.relative(ROOT, file)}: ${hit[0].slice(0, 24)}...`);
    }
  }

  expect(checked.length, "should have files to check").toBeGreaterThan(5);
  expect(findings, "possible credentials committed to the repository").toEqual([]);
});

test("the site needs no build step to publish", async () => {
  // GitHub Pages serves these files exactly as they are. If index.html
  // ever starts pointing at files that only exist after a build, the
  // published site breaks — so it must only reference files in the repo.
  const html = withoutComments(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"));
  const localScripts = [...html.matchAll(/<script src="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((src) => !/^https?:\/\//.test(src));

  expect(localScripts.length).toBeGreaterThan(0);
  for (const src of localScripts) {
    expect(fs.existsSync(path.join(ROOT, src)), `${src} should exist in the repo`).toBe(true);
  }
});

test("every link into a fragrance lands on that fragrance", async () => {
  // THE INDEX AND THE HOUSES ARE TWO WAYS INTO THE SAME WRITING, which
  // means the Fragrances table links at a part of a house's own page by
  // its anchor: ../houses/pineward.html#part-37. Nothing checks those.
  // The link test above only asks whether pineward.html exists — it
  // cannot see the "#part-37" on the end of it.
  //
  // THIS IS A REGRESSION, and for a real one. Two fragrances were
  // removed from Pineward and the remaining fifty-two renumbered
  // straight through behind them; the part numbers are in the markup
  // rather than counted, deliberately, because they are the owner's.
  // Every anchor in the index went on pointing at the number the
  // fragrance USED to have, so following "Murkwood" from the search
  // opened Noki. Only one test caught it, and only by accident.
  //
  // What this checks is the thing that actually has to be true: the
  // part an anchor points at is the part whose title the link is
  // written with.
  const plain = (html) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const houses = ["houses/pineward.html", "houses/adar.html"];
  const parts = {};      // "houses/pineward.html" -> { "part-37": "Murkwood" }

  for (const house of houses) {
    const src = fs.readFileSync(path.join(ROOT, house), "utf8");
    parts[house] = {};
    const block = /<details class="(?:pine|adar)-part" id="(part-\d+)">((?:(?!<details ).)*?)<\/details>/gs;
    for (const found of src.matchAll(block)) {
      // ADAR's titles carry a second name inside them
      // (<span class="adar-sub">), so the tags come out and the
      // whitespace is collapsed before anything is compared.
      const title = /<span class="(?:pine|adar)-title">([\s\S]*?)<\/span>\s*(?:<span class="(?:pine|adar)-cue")/.exec(found[2])
        || /<span class="(?:pine|adar)-title">([\s\S]*?)<\/span>/.exec(found[2]);
      if (title) parts[house][found[1]] = plain(title[1]);
    }
    expect(Object.keys(parts[house]).length,
      `${house} should have parts to point at`).toBeGreaterThan(5);
  }

  const wrong = [];
  let looked = 0;
  for (const page of htmlFiles()) {
    const src = withoutComments(fs.readFileSync(page, "utf8"));
    const link = /<a href="[^"]*?(houses\/(?:pineward|adar)\.html)#(part-\d+)"[^>]*>([^<]*)<\/a>/g;
    for (const found of src.matchAll(link)) {
      looked += 1;
      const [, house, anchor, words] = found;
      const title = parts[house][anchor];
      const from = path.relative(ROOT, page);
      const said = plain(words);
      if (!title) wrong.push(`${from}: #${anchor} is not a part of ${house}`);
      // EITHER MAY BE THE LONGER, and both happen here:
      //   the link is SHORTER when it carries the first of a
      //   fragrance's two names and the part carries both;
      //   the link is LONGER when it names the house as well, which is
      //   how a link reads inside a sentence — theory-03 says "Amber
      //   Zero by ADAR" of a part titled "Amber Zero".
      // Only the shorter being a prefix of the longer is required, so a
      // link saying "Murkwood" that lands on "Noki" still fails, which
      // is the fault this whole test exists for.
      else if (!title.startsWith(said) && !said.startsWith(title)) {
        wrong.push(`${from}: "${said}" points at #${anchor}, which is "${title}"`);
      }
    }
  }

  expect(wrong, "links pointing at the wrong fragrance").toEqual([]);
  // AND IT MUST ACTUALLY HAVE LOOKED AT SOMETHING. This regex names the
  // house pages by path, and when they moved out of `works/` into
  // `houses/` it went on matching nothing at all — passing while
  // checking nothing, which is worse than failing outright. A test that
  // can quietly stop testing should say so.
  //
  // GREATER THAN NOTHING, and not a count: that is precisely the
  // failure being guarded against, and a number would fail the day the
  // owner rewrites a sentence. For the record there are three today,
  // all of them ADAR fragrances named in theory-03's prose. The
  // Fragrances table used to be the bulk of these and stopped pointing
  // into the houses on 2026-09-21, when it became the way in to the
  // individual fragrances instead.
  expect(looked, "no links into a fragrance were found to check at all")
    .toBeGreaterThan(0);
});

/* THE SEVEN FORWARDING PAGES.
   The houses moved out of `works/` into `houses/` on 2026-09-22, and
   the individual fragrances into a folder of their own, so that the
   repository sorts by what a thing IS. That changed their public web
   addresses, and anything already linked or bookmarked at an old one
   still has to work — so a signpost was left at each.

   What this pins is the part that is easy to get wrong: a signpost must
   carry THE ANCHOR across. The Fragrances table links at a part of a
   house by its anchor, and a plain <meta refresh> drops everything
   after the `#`. So each one has to forward with a script as well, and
   that script has to append `location.hash`. */
test("every old address still forwards, and carries its anchor", () => {
  const moved = {
    "works/pineward.html": "../houses/pineward.html",
    "works/adar.html": "../houses/adar.html",
    "works/almost-human.html": "../houses/almost-human.html",
    "works/ataraxia.html": "../houses/ataraxia.html",
    "works/grande-parfums.html": "../houses/grande-parfums.html",
    "works/les-abstraits.html": "../houses/les-abstraits.html",
    "works/individual-fragrances.html":
      "../individual-fragrances/individual-fragrances.html",
    "works/test-page.html": "../note-library/",
    // THE MENU'S PAGES AT ADDRESSES OF THEIR OWN NAMES (2026-10-01: "I want
    // the page to be thetasteofaldehydes.com/x where x is the name of the
    // thing on the menu"), and their old addresses kept, forwarding — the
    // query too (a search's ?q=) — and /home to the home page.
    "categories/scent-descriptions.html": "../scent-descriptions/",
    "categories/theories.html": "../theories/",
    "categories/researches.html": "../explorations-and-researches/",
    "categories/favorites.html": "../favourites/",
    "categories/note-library.html": "../note-library/",
    "categories/other-2.html": "../photography/",
    "search.html": "search/",
    "contact.html": "contact/",
    "home/index.html": "../",
  };

  const wrong = [];
  for (const [from, to] of Object.entries(moved)) {
    const at = path.join(ROOT, from);
    if (!fs.existsSync(at)) { wrong.push(`${from} is missing entirely`); continue; }
    const html = fs.readFileSync(at, "utf8");

    // The page it points at has to be a real file (a folder's index.html).
    const lands = path.join(path.dirname(at), to, to.endsWith("/") ? "index.html" : "");
    if (!fs.existsSync(lands)) wrong.push(`${from} forwards to ${to}, which does not exist`);
    if (from.startsWith("categories/") || from === "search.html" || from === "contact.html") {
      if (!/location\.search\s*\+\s*location\.hash/.test(html)) wrong.push(`${from} does not carry the query across`);
    }

    // The script, carrying the anchor. This is the one that matters.
    if (!/location\.replace\(\s*"([^"]+)"\s*\+\s*(location\.search\s*\+\s*)?location\.hash\s*\)/.test(html)) {
      wrong.push(`${from} does not forward by script with the anchor kept`);
    } else {
      const said = /location\.replace\(\s*"([^"]+)"\s*\+/.exec(html)[1];
      if (said !== to) wrong.push(`${from} forwards by script to ${said}, not ${to}`);
    }

    // And the no-JavaScript fallback.
    if (!new RegExp(`http-equiv="refresh"[^>]*url=${to.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`)
      .test(html)) {
      wrong.push(`${from} has no <meta refresh> fallback to ${to}`);
    }
  }
  expect(wrong, "forwarding pages that do not forward").toEqual([]);
});

/* AND NOTHING INSIDE THE SITE LINKS AT ONE.
   A signpost is for links that already exist out in the world. Every
   link the site writes for itself should go straight to the real page —
   a signpost in the middle of a journey is a redirect nobody asked
   for, and it would quietly hide a path that had gone stale. */
test("nothing inside the site links at a forwarding page", () => {
  const stale = [
    "works/pineward.html", "works/adar.html", "works/almost-human.html",
    "works/ataraxia.html", "works/grande-parfums.html", "works/les-abstraits.html",
    "works/individual-fragrances.html", "works/test-page.html",
    "categories/scent-descriptions.html", "categories/theories.html", "categories/researches.html",
    "categories/favorites.html", "categories/note-library.html", "categories/other-2.html",
    "search.html", "contact.html",
  ];
  const signposts = [...stale, "home/index.html"];
  const found = [];
  for (const page of htmlFiles()) {
    const from = path.relative(ROOT, page).split(path.sep).join("/");
    if (signposts.includes(from) || from.startsWith("archive/")) continue;   // the signposts themselves
    const src = withoutComments(fs.readFileSync(page, "utf8"));
    const dir = path.dirname(page);
    for (const [, href] of src.matchAll(/(?:href|src)="([^"#?]+)/g)) {
      if (/^([a-z]+:|\/\/)/.test(href)) continue;
      const to = path.relative(ROOT, path.resolve(dir, href)).split(path.sep).join("/");
      if (stale.includes(to) || to === "home" || to === "home/index.html") found.push(`${from} links at ${to}`);
    }
  }
  // and the links written in the scripts, from the site's root
  for (const name of ["nav.js", "node-scene.js", "search.js", "search-page.js"]) {
    const src = fs.readFileSync(path.join(ROOT, name), "utf8");
    for (const old of stale) if (src.includes(`"${old}`)) found.push(`${name} links at ${old}`);
  }
  expect(found, "links pointing at a forwarding page instead of the real one").toEqual([]);
});

/* A PICTURE IS CREDITED WHERE IT IS USED.
   The owner asked for it in as many words: "I also want you to give
   credits when pictures are used." So a house that shows photographs
   carries one line at its foot saying where they came from.

   It is worth a test rather than a habit because the credit is the
   easiest thing on the page to forget when a house gains its pictures,
   and because it is not decoration — Grande Parfums' photographs came
   from two retailers rather than from the house, which is precisely the
   kind of thing that stops being recorded anywhere once the line is
   missing. */
test("a house that shows photographs says where they came from", () => {
  const wrong = [];
  let credited = 0;
  for (const page of htmlFiles()) {
    const from = path.relative(ROOT, page).split(path.sep).join("/");
    if (!from.startsWith("houses/")) continue;
    const src = withoutComments(fs.readFileSync(page, "utf8"));

    // Only the pictures that are really there count: a house whose
    // <img> tags all point at files that have not arrived yet is not
    // yet using anything to credit.
    const real = [...src.matchAll(/<img[^>]*src="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((s) => !s.startsWith("http"))
      .filter((s) => fs.existsSync(path.join(ROOT, "houses", decodeURIComponent(s))));
    if (!real.length) continue;

    const credit = /<p class="house-credit">([\s\S]*?)<\/p>/.exec(src);
    if (!credit) {
      wrong.push(`${from} shows ${real.length} pictures and credits none of them`);
      continue;
    }
    const said = credit[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    // A credit has to name something. "Pictures" on its own is a label,
    // not a source.
    if (said.replace(/^Pictures\s*/i, "").length < 20) {
      wrong.push(`${from}: the credit names no source — "${said}"`);
    }
    credited += 1;
  }
  expect(wrong, "houses using pictures without crediting them").toEqual([]);
  expect(credited, "no house was found using pictures at all").toBeGreaterThan(0);
});

/* WHAT A SEARCH ENGINE SEES, and a shared link: "can you also do search
   engine optimisation so that when you google this or look it up with any
   search engine, then it would look good?" (2026-09-26). Written by
   tools/seo.py into every page, on the site's own address — the one in
   CNAME, thetasteofaldehydes.com, since the owner moved it there. Every
   page has exactly one description and one canonical address on that
   domain, and an icon; a page for the world carries the title, line and
   picture a shared link shows, and is in the sitemap; what is not the
   site itself says noindex and is not. The sitemap names only pages that
   exist, and robots.txt names the sitemap. */
test("every page tells search engines what it is, on the site's own address", () => {
  const domain = fs.readFileSync(path.join(ROOT, "CNAME"), "utf8").trim();
  expect(domain).toBe("thetasteofaldehydes.com");
  const base = "https://" + domain + "/";
  const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  listed.forEach((loc) => {
    expect(loc.startsWith(base), loc).toBe(true);
    const file = loc === base ? "index.html" : loc.slice(base.length).replace(/\/$/, "/index.html");
    expect(fs.existsSync(path.join(ROOT, file)), `${loc} is a page that exists`).toBe(true);
  });
  expect(fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8")).toContain("Sitemap: " + base + "sitemap.xml");
  for (const f of ["favicon.svg", "apple-touch-icon.png", "images/social-card.png"]) {
    expect(fs.existsSync(path.join(ROOT, f)), f).toBe(true);
  }
  const pages = htmlFiles().filter((f) => !path.relative(ROOT, f).startsWith("archive"));
  expect(pages.length).toBeGreaterThan(30);
  for (const file of pages) {
    const name = path.relative(ROOT, file).split(path.sep).join("/");
    const head = fs.readFileSync(file, "utf8").split("</head>")[0];
    const count = (re) => (head.match(re) || []).length;
    expect(count(/<meta name="description" content="[^"]{20,170}">/g), `${name}: one description of a sensible length`).toBe(1);
    expect(count(/<link rel="canonical"/g), `${name}: one canonical address`).toBe(1);
    expect(count(/<link rel="icon"/g), `${name}: an icon`).toBe(1);
    expect(count(/<meta name="theme-color" content="#[0-9a-f]{6}">/g), `${name}: its own colour for a phone's browser bar`).toBe(1);
    const hidden = /<meta name="robots" content="noindex/.test(head);
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)[1];
    if (hidden) {
      expect(listed.some((loc) => loc === base + name.replace(/(^|\/)index\.html$/, "$1")), `${name} is left out of the sitemap`).toBe(false);
      continue;
    }
    // (a folder's index.html is known by the folder: thetasteofaldehydes.com/theories/)
    expect(canonical, `${name}: its address on the site's own domain`).toBe(name === "index.html" ? base : base + name.replace(/(^|\/)index\.html$/, "$1"));
    expect(listed, `${name} is in the sitemap`).toContain(canonical);
    for (const property of ["og:title", "og:description", "og:url", "og:image", "og:site_name"]) {
      expect(count(new RegExp(`<meta property="${property}" content="[^"]+">`, "g")), `${name}: ${property}`).toBe(1);
    }
    expect(head, `${name}: a large card when shared`).toContain('<meta name="twitter:card" content="summary_large_image">');
    // The card says its title, line and picture itself (2026-09-27),
    // rather than leaving X to fall back on Open Graph's.
    for (const name_ of ["twitter:title", "twitter:description", "twitter:image"]) {
      expect(count(new RegExp(`<meta name="${name_}" content="[^"]+">`, "g")), `${name}: ${name_}`).toBe(1);
    }
    // Structured data is written as JSON, and must read as JSON.
    [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach((m) => {
      const data = JSON.parse(m[1]);
      expect(data["@context"]).toBe("https://schema.org");
    });
  }
  // What is not the site itself is kept out.
  for (const hidden of ["search/index.html", "search.html", "categories/theories.html", "home/index.html", "works/test-page.html", "works/test-node-a.html", "works/example-article-work.html", "works/pineward.html"]) {
    expect(fs.readFileSync(path.join(ROOT, hidden), "utf8"), hidden).toContain('<meta name="robots" content="noindex, follow">');
  }
  // And the home page carries the site's name for a search engine to show.
  expect(fs.readFileSync(path.join(ROOT, "index.html"), "utf8")).toMatch(/"@type": "WebSite", "name": "The Taste of Aldehydes"/);
});

/* THE TAB'S ICON IS THE OWNER'S OWN DRAWING, IN RED (2026-10-05, last:
   "use these for the favicon; but if possible make them red"): their
   viewBox and their two colours turned red — the light browser's and,
   asked for by prefers-color-scheme, the dark one's — and the four letters
   as outlines, never typed, so no computer draws them in a face of its own;
   with nothing behind it, at a versioned address. */
test("the tab's icon is the owner's drawing, in red, its letters outlines", () => {
  const svg = fs.readFileSync(path.join(ROOT, "favicon.svg"), "utf8");
  expect(svg).toContain('viewBox="-0.85 -1.2 2.2 2.4"');
  expect(svg).toMatch(/\.ink \{ stroke: #eb252f; fill: #eb252f; \}/);
  expect(svg).toMatch(/@media \(prefers-color-scheme: dark\) \{ \.ink \{ stroke: #ff9398; fill: #ff9398; \} \}/);
  expect(svg, "no typed letters").not.toMatch(/<text[\s>]/);
  expect(svg.match(/<path d="M/g) || [], "the O, the C and the two H as outlines").toHaveLength(4);
  expect(svg.replace(/<!--[\s\S]*?-->/g, ""), "nothing blue drawn").not.toMatch(/#2563eb|#93b4ff/);
  // NOTHING BEHIND IT (2026-10-05, last: "give it transparent background
  // please; not black background"): no square, no rect, and the page asks
  // for it at an address a browser has not kept the black one under.
  expect(svg, "nothing behind it").not.toMatch(/<rect[\s>]/);
  const v = fs.readFileSync(path.join(ROOT, "tools", "seo.py"), "utf8").match(/ICON_V = "([^"]+)"/)[1];
  expect(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), "asked for by its version").toContain(`href="favicon.svg?v=${v}"`);
});

/* EVERY PAGE IS BUILT TO BE READ BY MORE THAN EYES (2026-09-27: "make
   sure there's exactly one <h1> per page, heading levels are logical, all
   images have descriptive alt text, and semantic tags are used where
   appropriate"). Read off each page as it is written — the forwarding
   pages too, which carry a line and a link of their own; the archived
   copy of an old view is left as it was: exactly one <h1>;
   one <main>, the page's own content; a <title> and a viewport; no
   heading more than one level deeper than the one before it; and every
   picture with an alt — empty only on a thumbnail that repeats a picture
   described beside it, and so hidden from a screen reader. */
test("every page has one h1, a main, headings in order, and every picture described", () => {
  const wrong = [];
  for (const file of htmlFiles()) {
    const name = path.relative(ROOT, file).split(path.sep).join("/");
    if (name.startsWith("archive/")) continue;
    const src = fs.readFileSync(file, "utf8");
    const html = withoutComments(src);
    const h1 = (html.match(/<h1\b/g) || []).length;
    if (h1 !== 1) wrong.push(`${name}: ${h1} <h1>`);
    const main = (html.match(/<main\b/g) || []).length;
    if (main !== 1) wrong.push(`${name}: ${main} <main>`);
    if (!/<title>[^<]{10,}<\/title>/.test(html)) wrong.push(`${name}: no title`);
    if (!/<meta name="viewport" content="width=device-width/.test(html)) wrong.push(`${name}: no viewport`);
    if (!/<html lang="en">/.test(html)) wrong.push(`${name}: no language`);
    let last = 0;
    for (const m of html.matchAll(/<h([1-6])\b/g)) {
      const level = +m[1];
      if (last && level > last + 1) wrong.push(`${name}: an <h${level}> straight after an <h${last}>`);
      last = level;
    }
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      const alt = /\salt="([^"]*)"/.exec(tag);
      if (!alt) { wrong.push(`${name}: a picture with no alt — ${tag.slice(0, 80)}`); continue; }
      if (alt[1].trim()) continue;
      // Empty is right only where the picture is hidden, as a duplicate.
      const before = html.slice(Math.max(0, m.index - 200), m.index);
      const hidden = /aria-hidden="true"[^<]*>\s*$/.test(before) || /aria-hidden="true"/.test(tag);
      if (!hidden) wrong.push(`${name}: a picture with an empty alt that is not hidden — ${tag.slice(0, 80)}`);
    }
  }
  expect(wrong).toEqual([]);
});

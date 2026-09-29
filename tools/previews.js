// ============================================================
// THE MAP'S PICTURES — run by hand, never by the site
//
// The owner, 2026-09-29: "add a picture representing each page that
// you will go to when you click on the main note". Each node on the
// home page's map opens a window with a picture of the page it leads
// to; this takes those pictures, one of each page as a visitor first
// sees it, into images/Previews/.
//
// Run it again whenever a page has changed enough that its picture no
// longer looks like it:
//
//     npm install          (once — it borrows the tests' browser)
//     node tools/previews.js
//     node tools/previews.js theories contact     (only those)
//
// It starts a server of its own on port 8765, so nothing needs to be
// running first. The pictures are 4 : 3, 960 × 720, JPEG — the shape of
// the window's picture, twice its size for a sharp screen.
// ============================================================
const path = require("path");
const { spawn } = require("child_process");
const { chromium } = require("@playwright/test");
const { serveDependenciesLocally } = require("../tests/helpers");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "images", "Previews");
const PORT = 8765;

// Each page, the name its picture is saved under, and how long it is
// given to draw itself before it is taken. `then` is anything done
// first — a word typed into the search — and `after` anything done once
// it has drawn: a key pressed, so the Note Library's "Open menu here"
// goes away.
const PAGES = [
  { name: "scent-descriptions", url: "categories/scent-descriptions.html", wait: 5200 },
  { name: "theories", url: "categories/theories.html", wait: 5600 },
  { name: "researches", url: "categories/researches.html", wait: 3200 },
  { name: "favourites", url: "categories/favorites.html", wait: 4200 },
  {
    name: "note-library", url: "categories/note-library.html", wait: 5000,
    after: async (page) => { await page.keyboard.press("Shift"); await page.waitForTimeout(1400); },
  },
  { name: "photography", url: "categories/other-2.html", wait: 1800 },
  {
    name: "search", url: "search.html", wait: 2600,
    then: async (page) => { await page.locator("input").first().fill("pine"); },
  },
  { name: "contact", url: "contact.html", wait: 2600 },
];

(async () => {
  const only = process.argv.slice(2);
  const server = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    cwd: ROOT, stdio: "ignore",
  });
  await new Promise((r) => setTimeout(r, 900));
  const browser = await chromium.launch();
  try {
    for (const one of PAGES) {
      if (only.length && !only.includes(one.name)) continue;
      // 1200 × 900 drawn at 0.8 is 960 × 720: laid out as a desktop sees
      // it, and saved at the size the window needs.
      const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 0.8 });
      await serveDependenciesLocally(page);
      await page.goto(`http://127.0.0.1:${PORT}/${one.url}`, { waitUntil: "load" });
      if (one.then) { await page.waitForTimeout(800); await one.then(page); }
      await page.waitForTimeout(one.wait);
      if (one.after) await one.after(page);
      // The site's own cursor is wherever the pointer was left; it is
      // not part of the page.
      await page.addStyleTag({ content: ".cursor-ring, .cursor-dot { display: none !important; }" });
      const file = path.join(OUT, one.name + ".jpg");
      await page.screenshot({ path: file, type: "jpeg", quality: 82 });
      console.log("  " + path.relative(ROOT, file));
      await page.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
})();

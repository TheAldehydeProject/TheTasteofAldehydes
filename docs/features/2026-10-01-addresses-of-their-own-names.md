# Every Menu page at an address of its own name
Date: 2026-10-01
Files touched: `scent-descriptions/index.html`, `theories/index.html`,
`explorations-and-researches/index.html`, `favourites/index.html`, `note-library/index.html`,
`photography/index.html`, `search/index.html`, `contact/index.html` (all moved, with their
history, from `categories/*.html`, `search.html` and `contact.html`); `home/index.html` (new);
the eight signposts left at the old addresses (`categories/scent-descriptions.html`,
`categories/theories.html`, `categories/researches.html`, `categories/favorites.html`,
`categories/note-library.html`, `categories/other-2.html`, `search.html`, `contact.html`);
every page that links to one (`index.html`, the nine houses, the individual fragrances, the
essays, `works/test-page.html`); `nav.js`, `node-scene.js`, `search.js`, `search-page.js`,
`tools/seo.py`, `tools/previews.js`, `sitemap.xml`, the tests, `CLAUDE.md`

What changed: The owner, 2026-10-01:

> another thing I want you to do; is if possible; fix the links. I want the page to be
> thetasteofaldehydes.com/x where x is the name of the thing on the menu. so Home, theories,
> fragrances, etc.

Every page in the Menu now has the address of its name: **thetasteofaldehydes.com/theories/**,
**/scent-descriptions/**, **/explorations-and-researches/**, **/favourites/**,
**/note-library/**, **/photography/**, **/search/** and **/contact/**. **Home is the site's
own address**, thetasteofaldehydes.com, and **/home/** is a signpost to it. Typed without the
last slash — thetasteofaldehydes.com/theories — the address is sent on to the one with it, by
GitHub Pages itself (and by `python3 -m http.server`, locally). Every old address still works,
anchor and query and all.

## Why / key decisions

- **A folder of the page's name, with the page as its `index.html`.** The site is served
  straight from the files, with no server to rewrite an address and no build step to write
  one, so an address *is* a file: the only ways to get `/theories` are a file at
  `theories.html` (which GitHub Pages serves without its `.html`, but `python3 -m http.server`
  does not, so nothing could be tried or tested locally) or a folder `theories/` with an
  `index.html` in it, which both serve. The folder it is.
- **The category pages left `categories/`**, which the owner's folder split had named, because
  the folder *is* the address. Every category page was already a folder deep, so moving each to
  its own folder at the root left every `../` path inside it exactly as it was — the only two
  pages whose paths changed are Search and Contact, which were at the root and are a folder deep
  now (`SITE_ROOT = "../"`).
- **The names are the Menu's**, as the owner said, written for an address: lower case, words
  joined by a hyphen, the ampersand said as *and* — `explorations-and-researches`, and
  `favourites` with the Menu's own spelling. The owner's example said **fragrances**, which is
  not a name on the Menu (Scent descriptions is, and the Fragrances view is inside it); the
  Menu's name was taken, and the owner is asked at the end of the round.
- **A link to one of them is the folder** (`theories/`, `../favourites/`), never its
  `index.html`, so the address bar shows the short address.
- **Old addresses forward** — a signpost at each, in the same three ways as the houses' since
  2026-09-22 (a script, a meta refresh, a link) — and the script carries **the query as well
  as the anchor**: a house's way back is `#house-08`, a page's own search hands over to
  `search.html?q=…` in anything bookmarked. `repository.spec.js` names every signpost and that
  nothing inside the site links at one.
- **The Menu's current page** was marked by comparing the last part of the address — the
  file's name — which every one of the new addresses ends without; it compares whole addresses
  now, `/x/` and `/x/index.html` the same page.
- **The search page reads the site's pages from the root** (`SITE_ROOT` before each address in
  `PAGES`), since it stands a folder in now.
- **Search engines**: `tools/seo.py` writes each page's canonical address as its folder
  (`https://thetasteofaldehydes.com/theories/`), the sitemap lists those, and the signposts and
  `/home/` say `noindex`.

## How to test it

`npx playwright test tests/repository.spec.js` — every link lands on a file that exists (a
link to a folder needs its `index.html`), every signpost forwards with the anchor (and the
query), nothing links at a signpost, and every page's canonical address is its folder.
`tests/menu.spec.js` — the page you are on is marked, at `/`, `/index.html`, `/theories/`,
`/contact/` and `/note-library/index.html`, and nothing on a house. Every other spec opens the
pages at their new addresses. By hand: `python3 -m http.server`, then
`/categories/scent-descriptions.html#house-08` (lands on Tombstone at `/scent-descriptions/`),
`/search.html?q=murkwood`, `/home`, `/theories`.

## Known issues / TODO

- The houses, the essays and the individual fragrances keep their addresses
  (`/houses/pineward.html`): the owner asked for the Menu's pages.
- `archive/fragrances-view-2026-09-24.html` is left exactly as it was, at the owner's word,
  and its links reach the moved pages through their signposts.
- Older reports name the category pages where they stood (`categories/theories.html`); the
  pages are the same pages at their new addresses.

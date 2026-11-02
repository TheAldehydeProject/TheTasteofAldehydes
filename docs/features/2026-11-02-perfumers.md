# Perfumers
Date: 2026-11-02
Files touched: `perfumers/index.html`, `perfumers.js`, `perfumers-data.js` (written), `tools/perfumers/LEDGER.md`, `tools/perfumers/build.py`, `style.css` (the PERFUMERS section; `.pf-card` out of the Menu's dimming; the page in the dark `--chrome-ground` list), `nav.js` (`SITE_LINKS`), `index.html` (the formula slide's link), `node-scene.js` (`REAL_NODES`), `search-page.js` (`PAGES`), `tools/seo.py`, `tools/previews.js`, `photography/index.html` and `categories/other-2.html` (signposts now), `photography.js` (removed), and the tests that named Photography (`menu`, `node-map`, `mobile`, `pages`, `repository`, `formula`).

## What changed

A new page, **Perfumers**, at `/perfumers/`, in Photography's place in the Menu. The owner: "add
a new page called Perfumers. It should replace photographs ... I want it to look like picture 1
and when you click on somewhere then it zooms in on somewhere ... design it quite close to the
images". Picture 1 was a radial calendar poster (*Leaps in Space 2020*): a globe in the middle, a
haze of gold round it, a spoke for every day, the months in spaced capitals round the rim, every
day numbered, its events written out past the rim, notes at the corners. Picture 2 was the same
poster photographed close up, tipped back, the near part sharp and the rest out of focus.

The page is that poster made of **perfumer → house → perfume**: every perfume a spoke, every
perfumer a segment of the rim, their houses smaller under their names, every perfume's name
written out past the rim with its house. **A click flies in** to the point clicked, tipped back,
and once settled the rest goes out of focus. Once zoomed in, a click on a name opens **its
window** — a perfumer, a house or a perfume — with what is known about it and its sources.

## Why / key decisions

- **The owner's answers** (asked before building): the hierarchy is perfumer, then house, then
  perfume, **alphabetical, with a switch at the top right to put it by date**; a **ledger** —
  "a separate text document for yourself as an information storage ... the perfume, its
  perfumer(s) and the year of creation, and the house" — and the page built from it; a window
  for each perfumer, **sourced** ("as reliable as possible. Wikipedia is considered reliable");
  and only **the perfumers and perfumes of this site, and Prin Lomros' houses** (Strangers
  Parfumerie, PRIN, Parfum Prissana).
- **The ledger is the only copy** (`tools/perfumers/LEDGER.md`). `build.py` reads it, checks
  it (every "on site" anchor is a real part on its page, every source cited exists, every
  perfumer and house has a block) and writes `perfumers-data.js`, the index at the foot of the
  page and the page's sources. Never write `perfumers-data.js` or the page's index by hand.
- **Nothing invented.** A perfume whose perfumer no source names is credited **none** and filed
  under *Perfumer not found*; one a source credits only to its house (the house's founder is its
  perfumer, but nothing names him or her for that one) is credited **house**; only a perfume a
  source names is **named**. A perfume no source dates goes on its own dashed ring, *no year
  found*. The line of a spoke says which (solid, dashed, dotted), as the legend says.
- **The rings are years.** A spoke's dot is at its perfume's year, 2009 nearest the globe and
  2026 furthest out — the poster's rings stood for nothing, and this was the one honest thing
  for them to stand for. The colour of the dot is what it is: gold, an individual fragrance on
  this site; blue-white, a house perfume on this site; rose, one of Prin Lomros' not written
  about here.
- **One camera, in perspective** (`proj`, `unproj` in `perfumers.js`): a focus point, a zoom, a
  turn and a tilt. At rest it is the flat poster; zoomed, the chart is turned so the place
  clicked reads across the window and tipped back by `TILT`, as in picture 2. Text is set
  letter-true in perspective by giving each piece the camera's own local stretch as its
  transform (`textAt`), and text too small to read is drawn as a faint line instead.
- **The out-of-focus copy is drawn once**, after the camera has stood still for a moment
  (`renderDof`): a blurred copy of the drawing with the part in focus cut back out of it, faded
  in, and taken off the moment anything moves. Never a mask over the window every frame.
- **The switch** re-sorts the perfumes and sweeps every spoke round to its new place
  (`arrange`, `SORT_MS`); it is remembered in the browser. By year, the rim's names are the
  years, and every perfume's label carries its perfumer too.
- **Three canvases**: the chart (redrawn only when something changed), the out-of-focus copy,
  and a live layer for the turning globe and what the hand is on.
- **No page search mark** in the top right: that is where the switch is.
- **Photography's page is a signpost now** to `/perfumers/`, as is its older address in
  `categories/`; `photography.js` went with it. Its emptied page is in the history.

## How to test it

`python3 tools/perfumers/build.py --check` checks the ledger. The page: serve the site and open
`/perfumers/`. Click anywhere to fly in; drag to move; the wheel zooms; a name opens its window;
Esc, a double click or *The whole chart* goes back. The switch at the top right sorts by year.

The tests that named Photography were changed to name Perfumers (the Menu, the formula slide's
names, the node map's names, the pages and the phone checks, the signposts). None of it has been
run: the owner asked to see it first. The page has no tests of its own yet.

## Known issues / TODO

- **Its picture on the node map** is not taken yet: `node tools/previews.js` takes it, and then
  `image: "images/Previews/perfumers.jpg"` goes on its node in `node-scene.js`. Until then
  `tests/node-map.spec.js`' "every node shows a picture" fails.
- **Brother Night** is dated **2016, its first version** (the owner: "find the soonest earliest iteration of the perfume rather than reformulations"): Basenotes' page dates it 2016, and Pineward's own announcement on Basenotes says it was made in 2016 as a boutique-only release, sold only at the Neon Heart shop in New Orleans. Parfumo's 2022 is the year Pineward brought it back. **The Apoteker Tepe page itself still says *2022, after 2018***, the owner's own line; it was left alone, and is theirs to change.
- **The page's introduction and disclaimer** at the corners are written for the page, not by
  the owner; theirs to rewrite.
- **Prin Lomros' houses are 138 of the 280 perfumes**; trimming them is the owner's call.

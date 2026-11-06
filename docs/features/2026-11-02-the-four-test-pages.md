# The test pages, and the unseen squares on Contact
Date: 2026-11-02 (four; a fifth on 2026-11-06)
Files touched: `test-pages/1/` to `test-pages/5/` (each an `index.html` and a `page.js`, new), `contact/index.html`, `contact.js`, `style.css` (the CONTACT section), `tools/seo.py`, `tests/test-pages.spec.js` (new); every page's script versions, by `tools/versions.py`

## What changed

The owner, 2026-11-02, with four pictures:

> I want you to now create two buttons on the very bottom of the contact page. They should be
> white and not visible at all on the bottom right these buttons should take you to separate
> pages which are going to be test pages. I'm going to be using these as pages when I get to
> create something without having it to be implemented on the life sit. The one on the right
> should be test page 2 the one on the left should be test page one ... Please actually; edit
> the above and make them four; not 2. First one should be modelled after image 1; second after
> image 2; third afyer image 3. And 4 should be modelled after image 4. Please make sure that
> they are excluded from any other part of the website that they are coded separately and are
> not involved in any way shape or form with the search engines or the Perfumes on any of the
> main pages or anything else. I want you to make each of them fully functional animated
> smooth. And I also want you to make them own theme with the website in general despite not
> partaking in the website function in any capacity feel free to use information from the
> website to fill in the text for these four pages.

**Four squares at the foot of Contact, on its right** — 1, 2, 3, 4 from the left — in the page's
own colour, so there is nothing to see, each opening a page of its own in `test-pages/`. Each
page is after one of the owner's pictures, and is filled from the site:

| page | after the owner's picture of | made of the site's |
|---|---|---|
| **1 · Skin, scanned** | a spine drawn as a plexus of points, two red rings marking places on it, a glitched numeral, a column of readings | **Skin** (`works/skin.html`), its Table 2: a skeleton — skull, spine, ribs, one arm — in points joined to their nearest neighbours, turning slowly, shards drifting off it; the four body sites (behind the ear, the neck, the inner elbow, the inner wrist) marked two at a time by red rings with a hairline in, a new pair every seven seconds; their temperature, sebum and character beside them, the numeral glitching as it changes. Drag to turn it; press a site to mark it. |
| **2 · Accord Spectrums 2026** | a poster, *Sunlight Spectrums 2024* — a great arc of bands from night to white, the months round it, a column of small domes with the sun's path over each | the houses and **the Note Library's sixteen accords**: a dome for each house down the arc (turning, a path over it as high as its fragrances are many, a light travelling it), every note the site's fragrances name a tick in its accord's stretch of the arc (the poster's days in their months), longer the more name it, the accords round the outside, and a line from each house to every accord its notes are in, as bright as that accord's share. Point at a dome, an accord or an accord in the list, and the rest steps back. |
| **3 · Material Origin System** | a dashboard — a globe with places raised in columns, totals and a ranking down the left, trends down the right, a slider through the days, three buttons along the top | **where the materials the site's fragrances name are traditionally grown** — bergamot in Calabria, vanilla in Madagascar, oud in Assam — on a globe of 16,000 dots (4,604 on land, from Natural Earth's public-domain map), each place raised in columns as tall and as red as the number of fragrances naming something from it; the totals and their change, the places ranked (pressed, the globe turns to one), three trends by year, a legend, a small flat map; **a slider through the years the fragrances were made** (with play); **Configuration** (what is drawn), **New Scenario** (one fragrance at random, and only its places), **Comparison Mode** (Prin Lomros' houses beside the site's). |
| **4 · The Network Map** | a whiteboard — a dense, many-coloured network of lines and labelled circles, a square frame through it, a few bees, a toolbar along the foot | **every house, perfumer, perfume and note on the site**, joined as the Perfumers ledger and the notes join them (682 of them, 1,935 lines): houses as white discs in a colour of their own with their line of writing pinned beside them on a coloured note, perfumers as rings, perfumes as dots in their house's colour, notes as specks in their accord's, the accords as faint rings; the frame with a box at each corner counting them; lights running along the lines; bees about the honey and the flowers. **Every tool on the toolbar works**: undo, redo, delete, duplicate, more (fit, every name, save as a picture, rub out everything drawn, reset); select (move anything, a box round several, a corner to resize), hand (and space), pen, eraser (it rubs out the network too), arrow, text, note, picture (from the computer), circle, and box, triangle, star, diamond; seven colours; the keys V H P E A T N I O, Delete, ⌘Z, ⇧⌘Z, ⌘D, Escape; the wheel or a pinch to zoom; a node pointed at says what it is. **What is drawn is kept** in that browser. |

## Why / key decisions

- **The squares are the page's own colour, not white.** Contact stands on the site's paper,
  `#fafaf9`, not on white; a white square there is faintly visible, and the owner asked for
  "not visible at all". They are `var(--bg)`, with no border and no text.
- **Nothing gives them away.** The site's cursor closes in on anything that can be pressed, so
  `contact.js` stops the hand's passing over them reaching it; they are out of the keyboard's
  way (`tabindex="-1"`) and a screen reader's (`aria-hidden`), with no tap highlight on a phone,
  and `rel="nofollow"`. They stand **at the very foot of the page**, however long it is: the
  body is at least the window's height (`body.contact-body`), and they are placed against it.
  Each is 22px square, so a finger finds it.
- **The pages are their own.** None of the site's scripts or its stylesheet: each is an
  `index.html` with its styles in it and one `page.js`. Its only link into the site is the way
  back to Contact; the fonts are the site's two, from Google Fonts. **What they know of the
  site is a snapshot written into their own `page.js`** on the day — the notes, the accords,
  the ledger, Skin's table — so nothing on the site reads them, and they read nothing on the
  site: changing a house, a note or the ledger changes nothing here. (The snapshots were made
  by a script in the session's scratchpad from `notes-data.js`, `perfumers-data.js`,
  `tools/note-library/base.json` and `works/skin.html`; page 4's network was laid out once
  with d3-force, page 3's land read from world-atlas. None of that is in the repository.)
- **Out of the search engines' way.** `tools/seo.py` gives each page `noindex, nofollow` — the
  only pages that say nofollow — its description, its icon and its theme colour, and keeps
  them out of the sitemap. They are **not** in `robots.txt`: a page a crawler is barred from
  is a page whose `noindex` it never reads. They are in no menu, not in the search's `PAGES`,
  not on the map, and `tools/seo.py`'s check for pages without an entry now looks two folders
  deep, so it sees them.
- **Their own theme within the site's.** Each takes the site's faces (Archivo and IBM Plex
  Mono), its red (`#ff3a44` on page 1, close to it on 3 and 4) and its habit of drawing in specks and hairlines, on a
  dark ground of its own.
- **Kept smooth**, each in the site's ways: what does not move is drawn once into a picture
  of its own and laid down each frame (page 2's bands, ticks and words; page 4's whole
  network and everything drawn on it, drawn again only when something changes); colours set
  once with `globalAlpha` varied; lines batched into one path per colour; grain as a CSS layer
  moved by its transform; nothing drawn while the tab is hidden. With motion reduced, each is
  still: drawn once, nothing turning, no glitch.
- **On a phone** each is laid out for it: page 1's rings and readings inside the window, page
  2 the arc above the writing with its first and last domes just inside the left edge, page 3
  the panels under the globe and the year's label kept inside its track, page 4 framed on the
  square and the names that would cover another left for the zoom.
- **Page 3's places are general knowledge** — where each material is traditionally grown or
  gathered — and the page says so at its foot: not where any one perfume's oil came from.

## How to test it

- `npm test -- tests/test-pages.spec.js` — fifteen tests: the four squares stand unseen at the
  foot of Contact on its right, 1 to 4 from the left, the page's own colour, no text, out of
  the keyboard's and a screen reader's way, nofollow; the cursor does not close in on them and
  each opens its page; the pages are their own (their own script alone, not the stylesheet,
  only the way back to Contact, noindex and nofollow) and nothing of the site points at them
  but Contact (not the menu, the search, the sitemap, robots.txt or the map); each draws,
  moves and has no errors, on a laptop and on a phone, with no sideways scroll; page 1 marks a
  site pressed and turns; page 2's accord pointed at in the list is in focus; page 3's years,
  scenario and comparison work, and its globe turns; page 4 draws, writes a note, undoes,
  redoes, rubs out, zooms, and keeps what is drawn after a reload.
- `tests/repository.spec.js` checks them as every page: one `<h1>`, a `<main>`, a description,
  a canonical, an icon, a theme colour, `noindex` and out of the sitemap, scripts by version.
- By hand: open Contact, move to the very bottom right and press the first of the four
  places there; each page's ← Back returns to Contact.

## Known issues / TODO

- **The pages are snapshots**: a house, a note or a perfumer added to the site does not appear
  on them until the snapshot is made again. That is on purpose — they partake in nothing — and
  the owner said they will build their own things on them.
- On a touch screen the squares are found by touch alone, as they are meant to be; there is
  nothing to see there.

## 2026-11-03 — test page 2 zoomable, and saying what it shows

The owner: "make test page 2 zoomable, and functional for information".

### What changed

- **Zoomable.** The wheel (about a quarter closer a notch, towards the hand), a pinch, a
  double-click (2.4×), the **− 100% + Fit** box at the foot on the right, and the keys `+`
  `−` `0` (and the arrows to move, closer in) bring the poster closer, from the whole to ten
  times; a drag moves about once closer, and Fit shows the whole again. The view eases to
  where it is sent. **Hairlines stay hairlines** at every zoom (`lw`), **words grow only by a
  root of it** (`fs`), so closer in there is room for more: the notes are named in order of
  how many fragrances name them, each only where there is room on the screen, every one of
  them from about three times as close, **each with that number beside it**. On a phone a
  finger scrolls the page past the whole poster and moves the poster once it is closer in
  (`touch-action` turns from `pan-y` to `none`); the + and − stand at the poster's foot.
- **The panel** (`.t2-info`, over the words on the left; a sheet at the window's foot on a
  phone): pressed, a **house** opens its numbers (fragrances, notes named, different notes,
  the accord most in), **its accords** as bars, **its most named notes** and **its
  fragrances**, each a fold opening onto its notes; an **accord** its houses as bars and
  **all its notes** by how many name them; and — **closer in than a little over twice**
  (`NOTE_FROM`), where the ticks are far enough apart to be pressed one by one — a **note**:
  how many of the 142 fragrances name it, its place in its accord and among all 351, **the
  houses naming it** (so many of so many), **the fragrances**, and **what it is most often
  with**. Every name in it opens its own; **Back** goes back; **Show on the poster** flies
  there, framed in what the panel leaves of the window; ×, Escape or a press on nothing put
  it away. A note chosen draws **a line from every house that names it**, as heavy as how many
  of its fragrances do, and lights the notes it is most often with; a house chosen lights the
  notes it names. The list of the sixteen accords down the left opens each accord too.
- **The search** under the title finds any house, accord or note by its name as it is typed
  (accents ignored, a name beginning with what is typed first); Enter or a press opens it and
  flies there.
- **The data**: the snapshot now carries every fragrance on the site with its group, year and
  notes (`DATA.frags`, from the same `site.json` the first snapshot was made from); the notes'
  counts made from it agree with the old ones, every one.

### How to test it

`npm test -- tests/test-pages.spec.js` — four more: the wheel, the +, a double-click and the
keys come closer, a drag chooses nothing, Fit and − go back to the whole and no further, and
no closer than ten times; a house pressed opens its 48 fragrances, a fragrance's note opens the
note, Back goes back, an accord's 29 notes, Show on the poster, a note pressed closer in (its 35
fragrances), a press on nothing and Escape put it away; the search finds Bergamot and flies there,
on the screen beside the panel; on a phone a tap opens the sheet at the foot, under three fifths of
the window, and the + comes closer.

## 2026-11-03, later — pages 1, 3 and 4 made again

The owner, with seven more pictures: "Recreate test page 1 with images 3 and 4. Recreate test page
4 with the remaining images. If youre unsure what to do, create a variation of it on test page 3.
Test Page 3 should be about top mid bottom stratification, and page 4 surprise me." Page 2 is as it
was. **Skin, scanned, the Material Origin System and the Network Map are gone**, each page made
again whole; each is still its own (its own `page.js` with a snapshot of the site in it, none of
the site's scripts or its stylesheet, `noindex, nofollow`, only the way back to Contact).

| page | after the owner's pictures of | made of the site's |
|---|---|---|
| **1 · Worlds** | a planet glowing in a gradient with its readings down the left (surface pressure, escape velocity, an atmosphere gauge) and a ring of nodes round it; a pale poster — a title and date over a heavy rule, dark spheres out of focus with coloured edges, a thin double circle, three lines of text | **every fragrance on the site with notes (129) as a world**: its surface the colours of the accords its notes are in, wrapped round a sphere a strip at a time so it turns as one does, a warm glow and a lit limb; **its ring** its notes (a top note an open ring, a middle one a dot, a base one a ring round a dot; pointed at, what the note is, in the Note Library's words); its moons its accords, as large as their share; the readings — its notes, its pyramid, its year, **its atmosphere** as a gauge (its two largest accords); the mark on its surface the note the site names most of its; **its three lines** its top, middle and base (or its notes in three); the worlds before and after it **out of focus round it**, dark with coloured edges, and the double circle finding one under the hand — pressed, it comes into focus. ‹ › and the arrow keys, every world by house in a list, Any. |
| **3 · Top, middle and base** | skin taken apart into its layers (a film, glass spheres, sheets, a thick slab, wire meshes between); a mountain in exploded layers ruled down to its height map; a city as a stack of map layers, named on the right | **the site's pyramids (the 43 fragrances whose source divides their notes) taken apart**: the top a field of glass spheres, the middle a layer of hex cells coloured by how many name a note there, the base a slab coloured as a height map is — every note at the same place on all three, in its accord's corner, so a note named at more than one tier is **threaded straight down** through them; wire meshes between; each tier named on the left **in the primer's own words** (*"what you smell 20–30 minutes into spraying the perfume"*); a fragrance chosen is drawn through its three layers, its notes named; **Spray** brings the film down and plays the pyramid as the primer tells it — the top rising away, then the heart, the dry down left; the accords as a legend, pointed at to light their corner; drag to turn it. |
| **4 · The Scent Landscape** | a block of terrain in isometric under a floating plane of gold contour lines; a site drawn as an architect draws one — a lettered and numbered grid, dashed circles, a survey tower, the ground again below in wireframe | **every note named on the site a hill** in its accord's corner, as high as how many of the site's fragrances name it; **its contours in gold** on a plane over it, ruled down to its corners — lowered (Plane), the hills it cuts through are drawn on the land and **whatever stands above it is named**; under it the grid, lettered A–T and numbered 1–20, dashed circles and axes, and the land again in wireframe. **The surprise: it grows** — Grow raises it year by year, from the first fragrance on the site to the last (and those with no year) — and **a survey tower** walks to wherever the land is pressed and says what is underfoot: the cell, its accord, the tallest note there, every note near and how many name it, and who names the tallest. Drag or ↺ ↻ to turn it. |

### Why / key decisions

- **Each snapshot is made from the same files as before** (`notes-data.js`, `perfumers-data.js`,
  `tools/note-library/base.json`, and the Note Library's own words for what each note is, from its
  catalogue), by a script in the session's scratchpad; page 1 and page 3 carry a note's first
  sentences from the Note Library, page 4 only its accord. None of that script is in the repository.
- **Page 1's worlds are drawn whole before they fade**: a sphere wrapped in strips shows the strips'
  seams through each other at part strength, so each world is drawn on a canvas of its own and laid
  down at its strength. Its texture is made once a world (a few tens of milliseconds as it comes).
- **Page 3 lays its two flat layers down by one transform each** (a flat square in this projection
  is an affine picture of itself), drawn once and again only when what is lit changes; only the
  spheres, the meshes and the film are drawn each frame.
- **Page 4's land is drawn into a picture of its own** and drawn again only while it turns or grows;
  the plane, the grid, the wire, the tower and the names are drawn each frame.
- **Page 4's tower is the surprise the owner asked for**, after the second picture's tower: a survey
  station, which is what that kind of drawing records.

### How to test it

`npm test -- tests/test-pages.spec.js` — the tests for the three pages are new: page 1's worlds go
on and back by the arrow and the keys and one chosen from the list is in focus, with its three
lines; page 3's fragrance chosen is drawn through its three tiers, All lets it go, Spray goes top,
heart, dry down, and a drag turns it; page 4 grows from the first year to the last, the tower goes
where it is sent and where the land is pressed and says which cell, and the plane comes down. The
four pages still draw, move, fit a phone and have no errors; `repository.spec.js` checks their
heads and headings.

### Known issues / TODO

- ~~What test page 2 should become~~ — chosen: **Every fragrance** (below).

## 2026-11-03, last — test page 2 holds everything ("Every fragrance")

The owner had asked for suggestions to make test page 2 hold the whole site; of those put to them
they chose **Every fragrance**: *keep the poster as it is, but one dome for every house plus one for
the individual fragrances, and the arc carrying every note named anywhere on the site, so nothing is
left out.*

### What changed

- **The domes** were already one for every house and one for the individual fragrances (fourteen),
  and every one of the site's 142 fragrances was already in them. What was missing was **notes**:
  the first snapshot counted only a fragrance's **first** list, so the notes named only in a
  **second** list — Ataraxia's Fragrantica halves (Spinal Fluid, Lipstick, Porcelain …), Haxan's,
  Vestibule's and the rest — were not on the arc. **Twenty-eight notes** were left out, and
  thirty-seven others were counted short (Cedarwood 38 where the Note Library says 41).
- **The snapshot is made again** the way the Note Library counts a note's fragrances
  (`counted()` in `network.js`: the lists and the second list, every spelling folded into its note
  by the library's own `base.json`): **all 379 notes**, each with at least one fragrance, every
  count agreeing with the library's. Woods has 30 notes now (Papyrus), Gourmand 50, Impressions 26;
  a house's figures (its different notes, its accords) are made from the same fragrances — Ataraxia
  names 80 different notes, where the poster said 43.
- **The words on the left say so**: thirteen domes and a fourteenth for the individual fragrances,
  all 379 notes, all 142 fragrances, nothing left out; the sources name the second list; the
  disclaimer dates the snapshot.
- **Test page 4 had the same gap** — it says "every note named on The Taste of Aldehydes is a hill"
  and carried 359 — and counted a note twice where one fragrance names it at two tiers (Vanilla 35,
  where the library says 34). Its snapshot now carries each fragrance's second list too (`x`) and
  counts a note once a fragrance: **379 hills, every height the library's**, and the same numbers as
  page 2's, note for note. Pages 1 and 3 are as they were — they draw a fragrance's own list by its
  tiers, and say so.

### How to test it

`npm test -- tests/test-pages.spec.js` — the page-2 tests count what the new snapshot carries: Woods'
notes are **30** (it was 29) and Sandalwood's fragrances **36** (35). By hand: search *spinal* on
page 2 — Spinal Fluid is on the arc, named by one fragrance, Ataraxia's.

## 2026-11-06 — pages 1, 3 and 4 made again for the perfumers, and page 2 carrying them

(Later the same day page 1's Earth and its ring of perfumes went, page 3 was turned the other way up
and page 4 made dense — see **2026-11-06, last**, below; and a fifth page came, **2026-11-06, later**.)

The owner, with six pictures: "change test page 1 to make it more into a perfumer oriented page ...
replace TP3 with another iterations of the perfumers page, which should look like image 3 ... replace
tp4 with another iteration of the perfumers page, and this one should be something like images 5 and
6 ... Also please edit the TESTPAGE2 TO Also accommodate the information of perfumers. All pages
should be functional and working, and should be smooth and not laggy." **Worlds, Top, middle and base
and The Scent Landscape are gone**, each page made again whole; page 2 is as it was, with the
perfumers added. Each is still its own (its own `page.js`, a snapshot of the site in it — now the
Perfumers ledger's — none of the site's scripts or its stylesheet, `noindex, nofollow`, only the way
back to Contact).

| page | after the owner's pictures of | made of the site's |
|---|---|---|
| **1 · Perfumer Worlds** | image 2: on black, dots in blocks down both sides, a fine ray from every one to a point low in the middle; image 4 (the poster page 1 was already after): dark spheres out of focus with a blue edge above and a gold below, a thin double circle, three lines, grain | **The rays first**: every perfume a dot, each perfumer's a block of its own, the blocks in lanes down the two sides A to Z, every dot a ray to the point; a perfumer's rays and dots light under the hand, and its name; lights run in along the rays. **A dot pressed opens its perfumer's world**, a circle opening out of the dot onto the pale poster: **the perfumer in the middle** — a dark sphere in image 4's layers (a white glow, the blue edge, the gold edge, the dark core), drawn soft — small and laid down large, twice, which is its blur — its edge frayed (the outline wavers, and specks come off it and go), **the Earth turning inside it** (Natural Earth's coastlines, coarse) and turned to the perfumer's country; round it its perfumes on a ring (a dot in a ring where a source names the perfumer, a ring round a dot the house's perfumer, an open ring not found; gold beside one written about as an individual fragrance) and **its houses as spheres out of focus, each in three layers that part as the hand moves**, named under them. **A house pressed** comes into the middle, its ring **the perfumes the perfumer made for it**, the perfumer itself round it to go back to. The readings on the left: the perfumer (or the house), its perfumes, its houses (or the year it was founded), its years, and a gauge of how many the sources name it for, the house's perfumer, or nobody; the three lines are what the ledger says of it. **↩ Return** under the head goes back a level — the house, the perfumer, the rays — and so does Esc; ‹ › and the list go through the perfumers. A perfume on the ring pointed at says who made it; pressed, its sources too. |
| **3 · A Portrait of the Perfumers** | image 3, *Portrait ethnique du Canada*: on charcoal, the countries of origin along the top as bars named upright, red to white; fine threads falling to the provinces, each a row of squares and its name; a legend along the foot | **The perfumers along the top**, each a bar as wide as their perfumes, A to Z, red through orange and gold to white, named upright over it; **a thread for every perfume** falling from its perfumer's bar to **its house**; every house a node of squares — the first as big as its perfumes, then one for each of its perfumers in their colours — standing **as high as the middle year of its perfumes** (the years ruled down the left, *year not found* along the foot) and across where its perfumers stand. Lights run down the threads. Pointed at, a perfumer's, a house's or one perfume's threads light and the rest steps back; **pressed, its panel** on the right — a perfumer's about and its perfumes, a house's and its perfumers, a perfume's perfumer, house, year, what it is and sources — every name in it a way on. A search over all of them, and a switch to lay each bar's threads **by house** or **by year**. A legend along the foot, as the poster's. |
| **4 · The Perfumers' Graph** | image 5: a network of dark specks on pale grey in a camera's corners, OBJECT and its name at the top, a word spelled down the left letter by letter with where each stands, STAGE 5: LETTERS, TOTAL, a dashed ring turning; image 6: a graph view, a round field of nodes, the busiest with fans | **Every perfumer a node, each of its houses a node joined to it, every perfume a speck in a fan round its house** — a full ring round a big house — the perfumers packed in a round field by how many they made; a house more than one perfumer made for is joined across to its others, dashed. **The table** on the right — number, perfumer, houses, perfumes, years; sortable, searchable — **a row pressed takes the camera to the perfumer's node**, its houses named, and lists them under the table; **a house** pressed (there or on the field) closes in on it and lists its perfumes; **a perfume** pressed is **spelled down the left letter by letter**, `{perfumer; house; perfume; letter}` beside each, as image 5's word is, with who made it. **The stages**: 1 PERFUMERS, 2 HOUSES, 3 PERFUMES, 4 LETTERS, and TOTAL the perfumes in view. The wheel, a drag and + − move about; ↑ Up and Esc go back a level, Fit the whole; **the ground** image 5's grey or image 6's dark, remembered. Signals run along the links. |

**Page 2** keeps its poster and carries the perfumers too: who made its fragrances stands over every
dome (the perfumer, or how many); **The Perfumers** listed down the left after the accords, A to Z with
their houses — pointed at, a perfumer lights their houses and the notes and accords their fragrances
name; pressed, **their panel**: where they are from, what the ledger says, their fragrances, houses,
notes named and the accord most in, how many the sources name them for, their houses as bars (each a
way to it), the accords and the notes of their fragrances, and their fragrances, each a fold onto its
notes. A house's panel now opens with **its perfumers**; every fragrance in a panel says who made it;
**the search** finds perfumers; Show on the poster frames all their houses.

### Why / key decisions

- **One snapshot for the four**: the Perfumers ledger (`perfumers-data.js`) written into each page,
  every perfume with its perfumers, credit, year, house, kind and its sources' names, by a script in the
  session's scratchpad (as the snapshots before); page 1 carries Natural Earth's coastlines as well,
  coarser than the Perfumers page's (1,200 points). Page 2's fragrances were matched to the ledger by
  name — all 142 found — and its perfumers are the 24 behind them.
- **Page 1's two views on one canvas**: the rays drawn once into a picture of their own (drawn out from
  the point as the page opens), the world drawn each frame; the change from one to the other a circle
  opening out of the dot pressed (and closing on its block on the way back), the world drawn inside it
  over the rays for that second only.
- **Page 1's sphere is soft by being drawn small** — at about a quarter of its size, then twice larger —
  rather than with a blur filter every frame; the grain is the page's CSS layer, as before.
- **Page 3 draws every thread every frame** — 282 curves of 22 segments, cheap — which is what lets
  pointing at anything light exactly its threads; its houses are placed once, pushed apart until no
  house covers another's name.
- **Page 4's layout is worked out once** as it opens (the perfumers packed in a round field, their
  houses round them, the perfumes in fans), not simulated as it runs.

### How to test it

`npm test -- tests/test-pages.spec.js` — page 1: the rays first, 282 dots and 24 perfumers, a dot
pressed opening Aichi Liu's world (14 perfumes, 2 houses), the Earth turning in it, Om Parfums pressed
(9), Return to the perfumer and to the rays, the list opening Prin Lomros (139), Esc back. Page 2: the 24
perfumers listed, Aichi Liu pointed at and pressed (her panel, her two houses), a house's panel naming
its perfumers and leading back, the search finding Prin Lomros. Page 3: 282 threads, 24 perfumers, 27
houses, Slumberhouse (2009) above Almost Human (2026) and Lussur (no year) below, a perfumer pressed on
its bar (14 perfumes in the panel), Om Parfums (9), the search finding Haxan with Prin Lomros. Page 4:
24, 35 and 282 nodes, the table taking you to Prin Lomros (stage 2, total 139, 3 houses, closer), Parfum
Prissana (stage 3, 32 perfumes), Haxan (stage 4, five letters), Esc up, Fit, a node pressed on the
field, the dark ground. The four still draw, move, fit a phone and have no errors.

### Known issues / TODO

- The snapshots are as the ledger stood on 2026-11-06: a perfumer or a perfume added to the site does
  not appear on them until they are made again, on purpose.
- Page 3 on a phone is dense: 24 perfumers' names upright across 360px.

## 2026-11-06, later — test page 5, the perfumers in section, and a fifth square

(The section of houses described here went the same day, for **a flacon for every perfumer** — see
**2026-11-06, the very last**, at the foot. The fifth square stays.)

The owner, with a picture of an architect's section sketch — *First Iteration Feedback: Elasticating
The Landscape*: a long section through a building on black in white pencil and chalk, its roofline
traced over heavily, an elastic form hanging under the ground with its levels marked (−0.05, −0.10 …),
construction lines crossing it, notes in a hand down the left, plans in a corner, details boxed at the
foot, a title in a box — "please also generate a 5th test page (by moving all the other ones a little to
the left on the contacts page), modelled like the image attached (architecture sketch) that is going to
be another page that attempts to house the perfumer information."

- **A fifth square** at the foot of Contact, `test-pages/5/`, on the right of the other four, which move
  a square's width to the left to make room (`.contact-tests`, 1 to 5 from the left).
- **5 · The Perfumers in Section** (`test-pages/5/`): a section through every house as built. **Above
  ground** every house is a bay — **a bay for each perfumer a house was made by**, as wide as what they
  made for it — with **a stud for every perfume, as tall as its year** (a stub, dashed, where none is
  found), its mark at its top (a dot named by a source, a ring the house's perfumer, a cross not
  found), floors and a brace in fine lines, **the roof as steep as the bay is full**, and **the one
  roofline traced over in chalk** across all of them; a house made by more than one perfumer is joined
  over its roofs, dashed. **Below ground** every perfumer is **the elastic form** hanging under their
  bays, hatched, **as deep as what they made**, piles down to it from each bay, **its level marked as the
  picture's** (−0.139: a hundred and thirty-nine perfumes) and its name. Construction lines cross it all;
  the years are ruled up its left; *ELASTIC HOUSING STRATEGY.* under it in the hand. **The notes** down
  the left say how to read it, in the hand (Caveat); **the title** is in a box at the top left;
  **the plan** at the top right is what is chosen, seen from above — its perfumes as radial lines as
  long as their years, turning slowly; **the detail** boxed at the foot on the left is what is chosen:
  a perfumer's houses, a house's perfumes, a perfume's perfumer, credit and sources, every name in it a
  way on; and at the foot on the right, the picture's note in the hand — *above ground, the houses,
  solid state; below ground, the perfumers, liquid latex form*. Pointed at, a bay, a stud's top or a
  form is traced again, **its lines boiling** as a sketch's do; pressed, it is chosen; the list at the
  top right chooses a perfumer; Esc lets go. **The section draws itself** as the page opens, a pencil's
  edge running across it, and **a point of chalk goes on retracing the roofline**. On a phone the section
  keeps its width and is swiped sideways, the plan staying in the corner.

### Why / key decisions

- **A bay a perfumer and a house** (35 of them), rather than a bay a house, so that every bay stands on
  one perfumer's form and nothing is double counted; the houses made by several are joined over the
  roofs instead.
- **Drawn once, laid down each frame**: the whole sheet — the pencil's doubled, overshooting strokes and
  the chalk's specks, seeded so it is the same drawing every time — is a picture of its own; each frame
  lays it down (a part of it while it draws itself), and draws only the chalk's point, what is pointed
  at or chosen, and the plan.
- **The hand** is Google Fonts' Caveat, the page's own as the other test pages' faces are theirs; the
  title is a serif in a box, as the picture's.

### How to test it

`npm test -- tests/test-pages.spec.js` — the squares are five now, 1 to 5 from the left; and page 5: 35
bays, 24 perfumers, 282 perfumes; Bindebole's stud (2021) taller than Ore's (2009) and Amber Zero's
(no year) a stub; Strangers Parfumerie's bay more than five times Les Abstraits'; Prin Lomros' form
deeper than Antoine Lie's; a bay pressed (its 67 perfumes in the detail), a form pressed (Aichi Liu, two
houses), a house from the detail (Om Parfums, 9), a perfume from it, a stud's top pressed (Haxan), the
list (Nicholas Nilsson), Esc. It draws, moves, fits a phone and has no errors, as the others do.

## 2026-11-06, last — page 1 abstract and blobby, page 3 the other way up, page 4 dense

The owner, with the screenshots of page 1 and its picture again (image 4): "remove the earth actually,
make it way more abstract and blobby like in the image i referenced ... Add feathered borders, chromatic
abberation and some other effects to actually try and recreate it as best as possible. No need to make
139 tiny nodes for prin lomoros. I want you to make the page look good." Of page 3, with a screenshot:
"reverse it: i want the bottom parts to be the perfumers, and then that leads into houses and perfumes
at the top." Of page 4: "that looks ugly, try to make it as close to the reference i have given you
earlier as possible, not just a few lines."

- **Page 1's world** has **no Earth and no ring of perfumes**. **The perfumer is one dark, abstract
  blob** — **a lobe for every one of its houses**, as big as what it made for it, each with a bud or two
  off it and a body under the head, so it is never round — drifting slowly and melting into itself, as
  image 4's figure is: its core near-black going violet at its edge, **every edge feathered**, **a thin
  blue fringe on its upper left and a gold one on its lower right, a breath of cyan and rose past them**
  (the chromatic aberration), **a lavender haze** where it fades, a bloom behind it, the poster's grain
  over all. Its lobes are **numbered as a drawing numbers its parts** — a hairline out from each to
  *01*, *02* … — the numbers of **the list** now on the right: **its houses**, each with where it is from,
  when it was founded, how many it made for it and a bar; a row pressed, or the house's sphere, brings the
  house into the middle — **a lobe for every year its perfumes were made in**, named (*2019*, *no year*)
  — and the list is **the perfumes the perfumer made for it**, by year, each saying how sure the sources
  are; pointed at, its tip; pressed, its sources too. **The houses round it are spheres out of focus**,
  the further the smaller and softer, with the same fringes and a soft light on their upper left, moving
  with the hand by how near they are. The double circle and its cross stand over the middle, and on a
  sphere under the hand. The rays, the readings, the three lines, Return, Esc and the way through the
  perfumers are as they were. On a phone the world is at the top, the list under it, the readings at the
  foot.
- **Page 3 the other way up**: the perfumers' bars **along the foot**, their names upright under them;
  **the threads rising** from them to the houses; every house's name and count **over** its squares, on
  a little of the ground so the threads behind never cross the letters; **the years rising**, the newest
  highest, *year not found* along the top; the lights running up. On a phone the page is taller, the
  houses pushed apart up and down rather than sideways, and the years named over their rules.
- **Page 4 dense, as its two pictures are**: about **four thousand nodes and five thousand lines**, every
  one the ledger's or the Note Library's — every perfumer, every one of its houses, every perfume, **every
  letter of every perfume's name** (as image 5's book is its words and their letters) and **every note
  the Note Library files for the perfumes on the site** (all 379; a note a node in every perfumer's cloud
  that names it, joined to the perfumes carrying it, and **the same note in two clouds joined across by
  one faint line** — the long lines between image 5's clouds). **A cloud for every perfumer**, packed
  round the middle, the busiest the darkest (Prin Lomros' about 1,600 nodes, Nicholas Nilsson's about
  700); a house a cloud of its perfumes in it, a perfume its letters round it. **In three dimensions**,
  turning slowly, in perspective — the nearer specks larger and darker — and a drag turns it. **Choosing
  flies into it**: a perfumer's cloud (its houses named), a house (its perfumes named, the rest of the
  field out of focus round it), a perfume (its letters named on the field, its notes named where its
  lines reach them, the letters spelled down the left with `{perfumer; house; perfume; letter}` and its
  notes listed under who made it). TOTAL is the nodes in view (4 044 of the whole). The table is lighter:
  a hairline down its left over a frosted ground, its numbers in mono. Image 5's grey or image 6's dark,
  as before.

### Why / key decisions

- **Page 1's blob is worked out a pixel at a time, small, and laid down large**: a field of lobes, each
  `e^(1 − d²/r²)` — high in its middle, 1 at its edge, gone a little past twice its radius, so lobes join
  with soft necks and stay lumps (the first try, `r²/d²`, merged everything into one round mass and
  reached the picture's edge, which showed as a square of haze). The field is worked out once a picture
  (156 pixels square, 120 on a phone) and the fringes read off it a few pixels to either side, which is
  what makes them thin and offset as a lens's are; nothing reaches the picture's edge (a round window
  takes it away). The middle blob is worked out again 24 times a second as its lobes drift; the spheres
  round it once each. Laying the picture down six times its size is the feathering.
- **Page 1's lobe numbers stand outside the blob**: each is walked out from its lobe until the field
  falls below the edge, and the numbers on one side are kept a line apart, or they were lost in the dark
  core and fell on each other.
- **Page 4's notes are copied into every cloud that names them**: a note at one place joined to every
  perfume naming it (the first try) strung 1,500 lines across the field into one grey hairball; a copy in
  each cloud keeps the clouds clouds, and one line between the copies says it is the same note.
- **Page 4 is drawn as image 5 is, cheaply**: every node turned and put in perspective each frame, the
  lines in a handful of strokes and the specks in four fills (three by how near, one out of focus);
  what is nearly behind the eye, once it flies in, is not drawn. About 16 ms a frame in the test
  browser, which draws without a graphics card.

### How to test it

`npm test -- tests/test-pages.spec.js` — page 1: no `spin` any more; Aichi Liu's blob has a lobe for Om
Parfums and Outsider Parfums, two spheres and two rows; Om Parfums pressed lists its 9 perfumes and its
lobes are its years (2023, 2024, no year); a perfume in the list pressed says Aichi Liu made it; Prin
Lomros has three lobes, and PRIN pressed in the list lists its 40. Page 3: Slumberhouse (2009) under
Almost Human (2026), Lussur (no year) over it, the perfumers' bars under all of them. Page 4: 24, 35 and
282 nodes as before, more than 2,500 letters, the 379 notes, more than 4,000 lines; TOTAL for Prin Lomros
the nodes in that cloud. By hand: open page 4 and leave it turning; press Prin Lomros, then Parfum
Prissana, then Haxan.

## 2026-11-06, the very last — page 5 made again: a flacon for every perfumer

The owner, seeing the section of houses: "Completly rework the archetecture one. It doesnt look like
archetecture at all. I want you to make designs of perfume bottles that look like sketches and then
from there design something around the idea of perfumers. Make it thematic, not random houses that look
weird." **The section, its bays, studs, roofs and elastic forms are gone.** Page 5 is **A Flacon for
Every Perfumer**: a designer's sheet in the same pencil and chalk on black, the title in its box, the
notes in the hand down the left, the note and its tag at the foot on the right.

- **Every perfumer a flacon**, drawn as a sketch — the outline twice, a centre line, the ellipses of
  its foot and shoulder, chalked over — and **every part of it saying something of them**:
  - **the height**: a millilitre a perfume, measured beside it (*139 ml*, Prin Lomros, the tallest);
  - **the body**: its perfumes by year, the earliest at the foot and the newest at the shoulder — it
    swells where most were made (Nicholas Nilsson's at 2021 and 2023, narrowing to his one of 2026);
  - **the graduations** up its wall, as a measuring flask's: one for every perfume, the earliest lowest
    — long where a source names its perfumer, short where it is the house's perfumer, dotted where none
    is found;
  - **the juice**, the right half cut away as a section is: **a layer for every house**, as deep as
    what was made for it, the house they made for first at the bottom, each hatched the other way;
  - **the cap**: a tier for every house (five at most, the rest written *+4*);
  - **the label**: how sure the sources are, mostly — framed named, dashed the house's perfumer,
    crossed not found;
  - **the family**: where its perfumes are, mostly — **a round flask** for the individual fragrances,
    written about one by one, **a square flacon** for a house's perfumes on the site, **a faceted one**
    for Prin Lomros' houses, not on it — which is also what gives a flacon of one perfume its shape.
- **On one shelf, as a shop window sets them out**: the most in the middle, the rest falling away
  either side; the shelf a hatched slab in section, chalked; **under it each one's plan** from above,
  its houses as sectors round its neck; its name upright under its plan, in the hand; *A FLACON FOR
  EVERY PERFUMER.* under it all. The sheet draws itself left to right as the page opens, and **a point
  of chalk goes on retracing the flacons**, up each, over its cap and down.
- **The design sheet**, top right (across the top on a phone): **the key** until one is chosen — a
  flacon of a made-up perfumer with every part named, *how to read a flacon* — and then **the chosen
  flacon drawn large**, half in section, every part named for it: each tier its house, each layer its
  millilitres and house, the shoulder's and the foot's years, its graduations counted by credit, its
  label, its family, its plan; drawn in from the top each time.
- **Choosing**: a flacon pressed is its perfumer; **pressed again, a layer (or a tier of the cap) is its
  house and a graduation its perfume** — the first press never goes past the flacon; the list at the
  top chooses one; Esc goes back a level at a time. **The detail** at the foot lists a flacon's houses
  as its juice, from the bottom, and a house's perfumes, each pressed saying who made it and where it is
  from. On a phone the shelf is swiped sideways and opens on its middle.

### Why / key decisions

- **Every part from the ledger, nothing for show**: a shape that only looked like a bottle would have
  been the "random houses" again. The height, the profile (its years, smoothed), the graduations, the
  layers, the tiers, the label and the family are each one thing a perfumer's entry says, and the key
  says which.
- **A flacon of one perfume, or of one year, has no profile to give it**, so its family shapes it: a
  round belly, square shoulders, or a chamfer and facets — which is why the thirteen perfumers of one
  perfume stand as three kinds of flacon, not thirteen of one.
- **Drawn once, laid down each frame**, as the section was: the sheet is a picture of its own; each
  frame lays it down and draws only the chalk's point, the flacon pointed at or chosen (traced again,
  boiling), and — only when the choice changes — the design sheet, on a canvas of its own.

### How to test it

`npm test -- tests/test-pages.spec.js` — page 5: 24 flacons, 282 perfumes, 35 layers; Prin Lomros taller
than Nicholas Nilsson, taller than Josh Lobb; caps of 3, 1, 1 and 2 tiers (Prin Lomros, Nicholas Nilsson,
Josh Lobb, Aichi Liu); Prin Lomros faceted, Josh Lobb round, Michael Nordstrand square; Nilsson's body
wider at 2021 than at 2026; Strangers Parfumerie's layer near twice as deep as Parfum Prissana's;
Dragon's Breath's graduation (named) longer than Lust's (the house's); Aichi Liu pressed (two houses),
Om Parfums' layer pressed (nine perfumes), a perfume, Esc twice; Haxan's graduation pressed twice (Prin
Lomros, then Haxan); the list (Nicholas Nilsson); Esc. It draws, moves, fits a phone and has no errors.

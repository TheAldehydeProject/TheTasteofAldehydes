# The four test pages, and the unseen squares on Contact
Date: 2026-11-02
Files touched: `test-pages/1/` to `test-pages/4/` (each an `index.html` and a `page.js`, new), `contact/index.html`, `contact.js`, `style.css` (the CONTACT section), `tools/seo.py`, `tests/test-pages.spec.js` (new); every page's script versions, by `tools/versions.py`

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

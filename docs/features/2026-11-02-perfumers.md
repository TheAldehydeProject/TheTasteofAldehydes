# Perfumers
Date: 2026-11-02
Files touched: `perfumers/index.html`, `perfumers.js`, `perfumers-data.js` (written), `tools/perfumers/LEDGER.md`, `tools/perfumers/build.py`, `style.css` (the PERFUMERS section; `.pf-card` out of the Menu's dimming; the page in the dark `--chrome-ground` list), `nav.js` (`SITE_LINKS`), `index.html` (the formula slide's link), `node-scene.js` (`REAL_NODES`), `search-page.js` (`PAGES`), `tools/seo.py`, `tools/previews.js`, `photography/index.html` and `categories/other-2.html` (signposts now), `photography.js` (removed), and the tests that named Photography (`menu`, `node-map`, `mobile`, `pages`, `repository`, `formula`).

(The second round, the same day — turning, idle animations, the list of perfumers, choosing
perfumer → house → perfume, staying put close in, the index behind a button, and the whole of it
drawn in layers — is [its own section below](#2026-11-02-later--turning-the-list-choosing-and-drawn-in-layers);
what it changed of the first is said there. **Since 2026-11-06 the middle is the Earth, drawn as an
architect draws it, with three rings in series round it — perfumer, house, perfume — the zoom fixed
and the wheel going through the perfumes of what is chosen:** [its section](#2026-11-06--the-earth-three-rings-in-series-a-fixed-zoom-and-the-wheel-through-the-perfumes),
at the foot; the globe of specks, its gold haze and the spokes' dashes described below are gone.)

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
- **Fitted between the columns.** On a wide window (1180px and over) the Intro, Disclaimer and Legend
  stand over the stage, and the chart is sized to the room between them (`resize`), never under them.
- **Its picture on the node map** is `images/Previews/perfumers.jpg` (`node tools/previews.js perfumers`);
  Photography's was taken out.
- **Photography's page is a signpost now** to `/perfumers/`, as is its older address in
  `categories/`; `photography.js` went with it. Its emptied page is in the history.

## How to test it

`python3 tools/perfumers/build.py --check` checks the ledger. The page: serve the site and open
`/perfumers/` — and see the second round's section below for what it does now (the drag, the wheel's
zoom and the double click went in it). `tests/perfumers.spec.js` is the page's own (since the second
round).

The tests that named Photography were changed to name Perfumers (the Menu, the formula slide's
names, the node map's names, the pages and the phone checks, the signposts). The page has no tests of its
own yet; it was looked at by eye at a laptop's and a phone's size before it went live (the overview,
flying in, the switch, the windows, a tap on a phone), which found three faults, fixed: the gold
haze round the globe read four numbers at a time as two and drew a gold square; the name lit under
the hand stood a few pixels off the one under it (its layer's text was not centred on its line); and
the legend's words broke into columns.

The full suite was run before it went live, on a machine with two processors and no graphics card:
578 of 582 passed. The four that did not are all speed or timing checks on Om's and the Note
Library's drawings (`om-and-the-tribe.spec.js:748`, `note-library.spec.js:1417` and `:1521`,
`rulebook.spec.js:47`) — pages this change touched only in their scripts' versions; the first two
failed the same way on the commit before it, and `:1521` passed run alone.

## Known issues / TODO

- **Brother Night** is dated **2016, its first version** (the owner: "find the soonest earliest iteration of the perfume rather than reformulations"): Basenotes' page dates it 2016, and Pineward's own announcement on Basenotes says it was made in 2016 as a boutique-only release, sold only at the Neon Heart shop in New Orleans. Parfumo's 2022 is the year Pineward brought it back. **The Apoteker Tepe page itself still says *2022, after 2018***, the owner's own line; it was left alone, and is theirs to change.
- **The page's introduction and disclaimer** at the corners are written for the page, not by
  the owner; theirs to rewrite.
- **Prin Lomros' houses are 138 of the 280 perfumes**; trimming them is the owner's call.

## 2026-11-02, later — turning, the list, choosing, and drawn in layers

Files touched: `perfumers.js` (rebuilt), `perfumers/index.html` (the stage's layers, the caption, the
list, the index behind a button, the legend to the foot, the Intro's last sentence), `style.css` (the
PERFUMERS section), `tests/perfumers.spec.js` (new), `CLAUDE.md`, every page's versions
(`tools/versions.py`, because the stylesheet changed).

### What changed

The owner, the round after the page went live: "move the index down a few, and make it a big button
that you can press to open the actual index. For the main thing, I want it to turn slowly; and have idle
animations. this is true for zoomed in. When you click and zoom in, i want you to be in a fixed place,
where you cannot use the scrollwheel. instead of the legend, I want you to add a fixed list of perfumers
that you can scroll. alphabetical. I want you to make it more navigatable, so that when you select
something, you select the perfumer then the houses appear, all the information doesnt have to be there
from the zoomed out view. next, i want you to optimize tf out of it. it needs to run smoothly. keep the
animations and smooth them out. OPTIMIZE!!!"

- **It turns, slowly** — once every 260 seconds at rest (`TURN_S`) — and **idles**: a light runs out
  along a spoke now and then and its dot flares (`pulses`), a glint goes round the band, the dust past
  the rim drifts and twinkles, the far field turns a little on its own, the globe turns and its night
  lights twinkle. **Close in it sways** — a slow roll of a degree or two about the point looked at, a
  breath of scale, a drift of a few pixels (`SWAY`) — and the same idle things go on there, faded out of
  the part in focus as the blurred copy is.
- **Less on the whole chart.** The perfumes' names, their numbers and years on the rim are written out
  **only for what is chosen**; the rest are the poster's faint lines where the words would be. No
  houses on the rim until a perfumer is chosen.
- **The list of perfumers** (`.pf-nav`) stands where the legend stood, down the right: every perfumer
  A to Z by surname (the chart's own order), scrolling in its own box, *Perfumer not found* last. On a
  phone it is **a drawer** at the foot — its bar always there saying where you are; pressed, the list
  comes up over the lower half and the chart looks closer above it. The legend went to the foot of the
  page, beside the terms.
- **Choosing, a level at a time** ("you select the perfumer then the houses appear"): a perfumer —
  pressed on the circle, or in the list — flies the camera to it, **its houses appear** in its name's
  place on the rim and under it in the list, and its perfumes are written out; a house (on the rim, by
  pressing inside the perfumer's arc, or in the list) closes in on it and its perfumes appear in the
  list; a perfume (its name, its spoke, or the list) opens its window, the camera going to it beneath.
  What is chosen is said in the title's place (`.pf-here`) with a button to its window. By year the
  circle's groups are years: a year is chosen on the circle, a perfumer still in the list. A choice too
  wide to frame — Prin Lomros' 139, a perfumer's perfumes scattered by year — stays on the whole chart
  with what is chosen lit and the rest dimmed. Pressed inside a chosen house too big to read whole
  (Strangers Parfumerie's 67), **a closer look** there (`look`). **Esc goes back a level at a time**,
  *The whole chart* all the way, and a perfumer or house pressed again in the list too.
- **A fixed place.** While anything is chosen, the wheel and the keys that scroll do nothing over the
  chart and the page is held at its top (only the list and an open window scroll); the drag that moved
  the camera and the wheel that zoomed it are gone. The camera moves only when something is chosen.
- **The index behind one big button**, a way down from the chart (`.pf-index`, a `<details>`): INDEX
  in large capitals, the counts, a ring with a plus that turns to a minus; pressed, the index opens
  under it. It opens without the script too, and an address into it (`#perfumer-…`) opens it.

### Why / key decisions

- **Drawn in layers so that moving costs nothing.** The whole chart at rest is drawn once into a square
  canvas (**the rotor**) that the browser turns by its transform — the turning is the compositor's, so a
  frame at rest draws only the small live layer. Close in, the chart is drawn once (with its
  out-of-focus copy, in the same box) and **the sway is a transform** too. Only a flight, the switch's
  sweep and the emphasis fading draw the chart every frame (`data-view` on the stage: `turn`, `live`,
  `still`). The rotor also carries any move that stays flat and centred — a turn, a slide, a scale —
  which is all the phone's drawer asks of the whole chart.
- **The names on the rim are drawn live while the chart turns**, never in the rotor: drawn there they
  would come round upside down. Each turns over as it crosses the sides of the circle by a crossfade
  (`FLIP`), never a jump.
- **The camera is two springs, one behind the other** (`stepCam`): a flight sets off gently and lands
  gently, and turns smoothly if it is sent somewhere else on the way — the eased tween before it started
  again from standing. It is at rest once nothing is left to move by more than a third of a pixel
  (`REST_PX`), so the out-of-focus copy comes in as soon as the eye can tell it has stopped.
- **The rest of the measures**: only the part of each ring that is on the window is walked
  (`visibleArc`); every perfume's label widths measured once (and again when the fonts arrive); specks
  in one colour at a varied `globalAlpha`, lines and dots batched by emphasis into a few paths; the
  globe's specks without a colour string each; the blurred copy at half size; nothing drawn while the
  chart is off the screen (an `IntersectionObserver`), the tab is hidden or a window is open over it;
  the wheel listened for only while something is chosen, so the page's own scrolling never waits on it;
  the resize gathered into one a frame; and `window.Sharpness` lets it down a step on a machine that
  cannot keep up.
- **Measured** (the same browser, no graphics card, a laptop's window and a phone's, the main thread's
  time in a frame, the old page against the new): on the whole chart at rest, 46 ms of work a second
  against 40 — the new one turning and idling, the old one only turning its globe — its worst frame 3.4 ms
  against 1.9; **flying in, 86 frames in a second and a half against 162** (the old flight dropped every
  other frame), a 95th-percentile frame of 10 ms against 4.5; flying out, 78 frames against 136; on a
  phone, the flights' work a second nearly halved (205 ms against 117). Close in at rest the new page
  spends 9 to 16 ms a second (the old spent 2, standing still) — the sway and the idle things.
- **The list is the chart's A–Z**, by surname as the rim is, so the two read the same way round.
- **Wide choices stay on the whole chart** because framing 147 degrees of circle close in leaves nothing
  readable; lit there, with their houses on the rim, the next step is a house.
- **The Intro's last sentence** was changed to say how to choose (it was written for the page, not by
  the owner, and said where a perfume's number and name stood).

### How to test it

`npm test -- tests/perfumers.spec.js`: the chart turns at rest without being drawn again (the rotor's
transform) and the idle layer goes on; with motion reduced nothing turns and nothing is drawn at rest;
the list stands in the legend's place, A to Z, and the legend is at the foot; a perfumer chosen in the
list shows its houses, a house its perfumes, a perfume its window, and the chart settles out of focus;
a perfumer pressed on the circle is chosen, then a house on its rim; close in the wheel neither zooms nor
scrolls the page and the sway is a transform with no drawing; Esc goes back a level at a time and *The
whole chart* all the way, and with nothing chosen the page scrolls; by year a year is chosen on the
circle; the index is one big button, shut until pressed, a way down from the chart, opening without the
script and from an address; on a phone the list is a drawer and the chart looks closer above it.
`window.PerfumersChart` has `choose`, `up`, `state`, `stats` and `pointOf` for them.

By hand: open `/perfumers/` — watch it turn and the lights run; choose Aichi Liu in the list, then Om
Parfums, then a perfume; Esc twice; choose Prin Lomros, then Strangers Parfumerie, and click inside it to
look closer; try the wheel close in; *By year*; on a phone, the drawer.

The full suite, on a machine with two processors and no graphics card: 593 of 594 passed. The one that
did not is Om's speed check (`om-and-the-tribe.spec.js:748`, "frames a second, coming together", 20
against more than 24) under the whole suite's load; run alone it passed, twice, as it did on the commit
before.

### Known issues / TODO

- **The sway is a transform of the drawn chart**, not a true move of the camera: close in, it rolls
  the picture a degree or two about the point looked at. It reads as the view turning slowly; a true
  orbit would mean drawing the chart every frame.
- **The labels are small on a phone at a whole house** — Pineward's 48, Strangers' 67 framed whole;
  a press inside looks closer.
- **The index's perfumers still open their window**, rather than choosing them on the chart.


## 2026-11-03 — the sources behind a button, and the Menu kept clear

The owner: "make the perfumers page sources also collapsible. Make suure the menu remains clear
when you scroll".

### What changed

- **The sources are a `<details>` of their own** (`.pf-sources`, with the index both `.pf-fold`),
  behind **the index's button a size down** — the word SOURCES, *where every perfumer, house and
  year on the chart comes from, in MLA 8*, the count (written by the script from the data:
  `[data-source-count]`), Open / Close — shut until it is pressed, opening and shutting as the
  index does (one handler for both in `perfumers.js`, *THE INDEX AND THE SOURCES AT THE FOOT*), an
  address into it (`#source-s05`) opening it, and open without the script too. `build.py` writes
  only between its SOURCES markers, inside the list, so it is untouched.
- **The Menu kept clear.** This is the one page whose writing — the notes, the legend, the terms,
  the sources — runs the width of the window, under the Menu and the page's name beside it, and it
  was printed straight through them as the page scrolled. Both stand on the page's ground at every
  width now: the ground laid twice (about nine tenths), let out past their edges in a feather of
  the same ground, the word where it was (the box's padding taken back out of `left`), none of it
  while the Menu is open. Over the chart's own dark it is not seen at all. The phone's Menu
  everywhere on the site was made the same at the same time — see the phone report.

### How to test it

`npm test -- tests/perfumers.spec.js`: the sources are shut until pressed, every source in them,
the count right, the index not opened with them; an address into them opens them, and without the
script they still open; and on a wide window, scrolled to the foot, the Menu and the page's name
stand on the page's dark ground, feathered, the word at 22px as it was, and none of it while the
Menu is open. (The index's tests now find its button inside `.pf-index`, the sources' button
sharing its classes.)

## 2026-11-03, later — every choice zooms, a perfume's own window, the list's search, smoother

The owner, with a picture of a perfumer chosen on an iPad and one of the head of the page on a
short wide window: "The legend, and the terms should be drop downs too, and should be subtle. Also
change "142 written about here" to "142 written about on The Taste of Aldehydes" ... make the
zooming consistent; such that it zooms once a user selects a house or perfumer. Also let the popup
window be animated with the chart, and the animation would start from the perspective provided in
image 1; such that the specific perfume being viewed would be highlighted, then the popup would
appear. Please make the popups simple; perfumer, perfume, year, and source. Make the animation
smoother please. Put a search button on the top right of the perfumers list on the right. Make the
disclaimers thing on the left at the bottom; when you scroll. It should be drop down, like the terms
and legend, and should be demarcated by an asterisk that is also present on the title of perfumers.
Otherwise fix the text (view image 2)." And, later the same day: "remove the text a guide to the
noses whatevr…".

### What changed

- **The foot's three dropdowns** (`.pf-drops`, `<details class="pf-drop">`): **Legend**, **Terms**
  and **Disclaimer**, each a quiet hairline row — its name in spaced capitals, a few words of what
  it holds, a plus that turns to a minus — shut until pressed. **The disclaimer** came down from
  the left of the chart to the foot, marked with **an asterisk** that also stands on the title
  (`.pf-star`, a link to `#disclaimer`, which opens it and brings it into view). The counts read
  *142 written about on The Taste of Aldehydes*. **The line under the title** (*A guide to the
  noses behind the perfumes on this site …*, `.pf-title-say`) is gone.
- **The writing on the left no longer runs into the title on a short wide window** (image 2): the
  notes stand over the chart only from 1180px wide **and** 700px tall; on a shorter window they
  flow under the chart.
- **Every choice zooms** (`poseOf`, `densest`): a choice too wide to frame whole — Prin Lomros, a
  perfumer by year — was shown on the whole chart; it is now looked at close in, on where most of it
  is (the window of the circle holding the most of it), at the closest look's widest (`zLo`).
- **A perfume chosen is lit where its house is seen, and then its window comes out of its dot**
  (`choosePerfume`, `callFor`, `openCall`): the chart stays (or goes) where the house — or the
  year — is seen, moved only as far as it takes to bring the perfume's dot onto the window
  (`screenUnder`); the perfume is lit there — its spoke and name, a ring breathing round its dot and
  two rings going out from it as it is lit (`markLit`), the rest of its house stepped back
  (`AROUND`, 0.46); and once the chart has settled (`CALL_AFTER`, 560ms, at most `CALL_WAIT`) a
  line is drawn out of the dot (`drawCallLine`) and **the window opens from the end of it** (a
  clip-path circle from where the line meets it, `--ox`/`--oy`), standing beside the dot on
  whichever side covers least (`placeCallFirst`: the room, the chrome, the names written out to the
  right of the rim) and **carried with the chart** as it sways (`placeCall`, every frame). **No
  veil**: the chart goes on behind it. Its × (`dismissCall`), Esc or a press elsewhere on the chart
  put it away and go back to the house, keeping a closer look if there was one.
- **The windows are simple** (`renderCall`, `renderPerfumer`, `renderHouse`): a perfume's says
  **Perfumer, Perfume, Year, Source** and nothing else — the perfumer a way to them on the chart,
  *as the house's perfumer* under them where that is the credit, the perfume's name the way to it on
  the site where it is written about, each source where it is and what it is called there; a
  perfumer's and a house's (still the centred window) are a name, a line, what the ledger says of
  them, and **their perfumes as a plain table** — perfume, house or perfumer, year — each perfume
  pressed shown on the chart, lit, with its own window.
- **The list's search** (`.pf-nav-find`, top right of its head): pressed, a field under the head;
  what is typed finds a perfumer, a house (with its perfumer) or a perfume, as it is typed (a name
  beginning with it first, accents ignored); Enter or a press chooses it on the chart as from the
  list, and the list comes back to it; Esc shuts it.
- **Smoother** ("make the animation smoother please"): the camera's springs gentler (`SPRING` 5.8;
  it was 7.2); **while it flies, the chart is drawn at a lower resolution** on a canvas of its own
  (`.pf-fly`, `FLY_K`: 0.6 of a sharp screen's, never below 1) and sharp again the frame it lands —
  measured at a sharp screen's resolution, a fifth quicker a frame and the long frames gone; **no
  blur behind the Menu, the page's name and the switch** on this page (a blur over the moving chart
  is the browser blurring that corner again every frame); and **the stage can no longer be scrolled
  within itself** (`overflow: clip`, and a guard in `perfumers.js`) — a focus inside it could shift
  the whole chart and its list sideways.

### How to test it

`npm test -- tests/perfumers.spec.js` — seven more: every choice zooms (Prin Lomros, and a
perfumer by year); a perfume is lit with no window, then its window comes beside its dot, the
chart where the house was seen, saying Perfumer, Perfume, Year and Sources; its close, another
perfume and a press elsewhere put it away; a perfumer's window is a plain table and a perfume in it
is shown on the chart; the list's search finds a perfumer, a house and a perfume, Enter chooses,
Esc shuts it; the legend, the terms and the disclaimer are shut dropdowns at the foot and the
title's asterisk opens the disclaimer; and while the chart flies it is drawn on the lower
resolution canvas, and sharp once it lands.

### Known issues / TODO

- A window's side is chosen once, as it opens; if the chart moves a long way while it is open (the
  switch between A–Z and by year), it follows its dot on that side, kept inside the window.

## 2026-11-06 — the Earth, three rings in series, a fixed zoom, and the wheel through the perfumes

Files touched: `perfumers.js` (the Earth, the three rings, the camera's fixed zoom and the scroll, the
scrubber, the pins and their lines), `perfumers-earth.js` (new, written), `tools/perfumers/earth.py`
(new), `perfumers/index.html` (the script, the legend, the Intro's last sentence), `style.css` (the
Earth's canvas, the scrubber, the legend's new keys), `tests/perfumers.spec.js`, every page's versions.

### What changed

The owner, with a picture of a poster — *Crossbreedings: Brazilian architects abroad*: the Earth drawn
as an architect draws it, grey relief and fine lines, a band of cells and a ring of bars standing out
from it, lines from its cities out to the rim, cross-hairs and the degrees round it — "change the
perfumers page. I want it to be more or less the same theme, but remodel it after image 1. It should
look like the earth, with then three layers of information in series protruding from it, which is
going to be the perfumer, the house and then the perfume. It should look like an architect's sketch of
the earth. I want this to occupy the majority of the page and then when you click on a perfumer it does
the exact same as it does now; however: the zoom length should be fixed, and the scrolling while
hovering on the image will cause you to scroll through the perfumes of that house/perfumer. This is
especially important for big perfumers like prin lomoros."

- **The Earth in the middle** (where the globe of specks was), in the page's own dark — the theme kept —
  as an architect's sketch: Natural Earth's coastlines (1:110m, public domain) in a hairline with **a
  waterline** off them, the land **hatched**, the graticule every fifteen degrees (the equator and the
  prime meridian a little brighter, *Greenwich* named), the latitudes named inside its rim on the left
  and the longitudes along its equator as they come round, the night side shaded, **a cross through its
  middle** run out across the whole chart to **a cross-hair** at each end, and a double circle round it.
  **It turns** on its own axis at rest (once in six minutes, `EARTH_SPIN`), seen from a little above its
  equator (`EARTH_TILT`), and **turns to the country of what is chosen** (`turnEarthTo`, 2.2s) — then
  stands still while anything is.
- **The pins** are the ledger's countries and nothing nearer: **a square** for every country a house
  is from, **a ring** for every country a perfumer is from (`COUNTRY`, the middle of each country — a
  house or a perfumer the ledger gives no country has no pin; seventeen of the twenty-seven houses do).
  From each house's country **a line runs to every one of its perfumes' places on the rings**, as the
  picture's lines run from its cities, fading as the country turns away. Pointed at on the whole chart,
  a pin names its country, its houses and its perfumers, and rings its lines.
- **Three rings in series**, a cell in each for every perfume: **1, the perfumer** — filled where a
  source names the perfumer, half filled where it is the house's perfumer, empty where none is found
  (what the spokes' dashes said until now), the perfumers' names along it; **2, the house** — in the
  colour of where the perfume is (gold, blue-white, rose, as the dots were), a chosen perfumer's houses
  named along it; **3, the perfume** — a bar out to its year, 2009 shortest to 2026 longest, the years'
  rings behind them, its dot at the end (hollow on the dashed ring where no year is found). The rings,
  the years and THE EARTH are named up the gap at the top, which is wider now (`TOPGAP`); two houses of
  one perfumer have a small gap between them (`HGAP`). The lights run from a house's country across
  the Earth to its place, and out through the three rings to its dot.
- **It takes up most of the page**: fitted to its rim rather than past its labels (`R.fit` 890; it was
  1180 against a smaller globe), as big as the stage's height lets it be, and moved right only as far as
  it takes to keep its rings clear of the title and the Intro (`measure`), its faint outer parts passing
  under them. On a laptop the Earth is about 430px across; the rings to about 700.
- **The zoom is fixed** (`Z_FIX` 1.8, `Z_FIX_PHONE` 1.2): a perfumer of one perfume and Prin Lomros' 139
  are looked at from exactly as close. What does not fit is **gone through by the wheel** — over the
  chart, while anything is chosen, the wheel (a perfume every 42 px of it), a swipe on a touch screen,
  the arrow keys, Page Up and Down, Home and End move **the scroll** (`scrollS`, counted in the chosen
  set's perfumes) along what is chosen, the camera following on its springs, the chart turning under it
  as a wheel does. It starts at the middle of a set the window holds, and at the beginning of one it
  does not, its first perfume near the top. The perfume it stands at is bracketed in gold on the rim.
  **The scrubber** (`.pf-scrub`) stands beside the chart while something is chosen: a tick for every
  perfume, a thumb as long as the window holds, the perfume the scroll is at named over it with its
  place (*013 / 139*); pressed or dragged, the chart goes there. A perfume's window is put away by the
  first turn of the wheel, back to its house, and the scroll goes on from there. Going back up from a
  house to its perfumer keeps the perfume it stood at.
- Everything else does what it did: the list, the search, choosing a perfumer, a house, a perfume and
  its window, the sway, the out-of-focus copy, Esc, *By year*, the index, the sources.

### Why / key decisions

- **"More or less the same theme"** was read as the page's own dark and its colours, with the picture's
  drawing: the architect's sketch is drawn in light lines on the dark, as a drawing in white ink.
- **The Earth stands upright** while the rings turn round it (it is drawn turned back by the camera's
  own turn, `earthUpright`), so north is always up; it turns on its own axis instead.
- **Drawn so that turning costs little** — the first version took ten times the old page's work at rest:
  the Earth's still parts (the sea, the parallels, the shade, the rim, the latitudes) are drawn once
  for its size; its land and meridians are drawn again only when it has turned by about half a pixel,
  about six times a second; and the whole is **a canvas of its own on the page** (`.pf-earth`), laid
  down by the browser every frame, never copied onto the live layer. On the turning Earth the waterline
  is a single soft edge (two wide strokes cost two thirds of a redraw); close in, where the chart is
  drawn once, it is the full waterline. Measured on this machine (no graphics card, a laptop's window):
  35 ms of script a second at rest, against the old page's 37; the main thread's whole time 240 against
  200.
- **The land is clipped at the Earth's rim** properly (`clipFace`): a coastline ring is cut into the
  pieces on the face, and each piece's end is joined round the rim — the way the ring runs, so its land
  stays on its own side — to the start of the next piece there. Laying a point behind the Earth onto
  its rim, as the first version did, ran straight cuts across the face, and joining a piece to the next
  crossing *along the ring* rather than round the rim filled the whole disc for Antarctica.
- **A pin is a country** because that is all the ledger says; pinning a house in a town would be
  inventing where it is.

### How to test it

`npm test -- tests/perfumers.spec.js`: the earlier tests, and two that are new — **close in, the zoom is
fixed, and the wheel goes through the perfumes of what is chosen** (Prin Lomros: the wheel moves the
scroll on by more than eight perfumes, the zoom the same, the page not scrolled, the scrubber naming
where it is, End going to the 139th; Antoine Lie looked at from exactly as close; and at rest it sways
without being drawn again) — which replaced *the wheel does nothing*, deliberately; and **the Earth is
drawn in the middle, turns on its own, and turns to what is chosen** (its rings and its pins there, it
turns and its picture is drawn again for it but the rings are not, Prin Lomros lights Thailand and
turns it to about 101° E, and close in it stands still). `PerfumersChart.earth()`, `.scrollBy()` and
`.scrollTo()` are for them; `state()` carries `scroll`, `count`, `at` and `viewN`.

The coastlines: `npm pack world-atlas@2.0.2`, unpack it, `python3 tools/perfumers/earth.py
package/land-110m.json`, then `python3 tools/versions.py`.

By hand: open `/perfumers/` — watch the Earth turn and the lights cross it; point at a pin; choose Prin
Lomros, scroll through all 139, drag the scrubber; choose Aichi Liu and see the Earth turn to Taiwan;
*By year*; on a phone, swipe.

### Known issues / TODO

- **Ten houses and twelve perfumers have no country in the ledger**, so no pin and no lines; adding
  `from` to their blocks in the ledger draws them.
- The Earth's coast is Natural Earth's coarsest; small islands under about a square degree are left
  out.

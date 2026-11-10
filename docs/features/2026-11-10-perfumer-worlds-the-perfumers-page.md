# Perfumer Worlds, the Perfumers page — and the radial poster, test page 1
Date: 2026-11-10
Files touched: `perfumers/index.html` (Perfumer Worlds now), `perfumer-worlds.js` (new — what was
`test-pages/1/page.js`), `style.css` (the poster's styles out, Perfumer Worlds' in, under
`.worlds-page`), `perfumers-data.js` and `tools/perfumers/build.py` (the biographies carried in the
live data), `test-pages/1/index.html` and `test-pages/1/page.js` (the radial poster now, with its
plane), `perfumers.js` and `perfumers-earth.js` (taken out of the site's root — test page 1 carries
them), `tools/perfumers/earth.py`, `tools/seo.py`, `tests/perfumers.spec.js` (new, Perfumer Worlds'),
`tests/poster.spec.js` (was `perfumers.spec.js`), `tests/test-pages.spec.js`.

## What changed

The owner, in one message: "for the test page 1: i want you to make the animation smoother when you
click on the nodes and then it takes you to the blob pages. I want you to actually make that
chromatically abberate as in lag a little ... change the tension physics to be more realistic, and
only make it when hovered, not with a delay. in the blobs page i want you to actually remove the
circle that goes around the things, and instead make it something more thematic; something more
particulate. I also want you to remove the ability of the person to hover over the middle blob ... i
want the top left return button to always point you to the nodes page ... when you click on learn
more abou [house], i want that to scroll smoother, slightly slower, and all the way up ... change the
text "back to the world" to simple "back up" ... make the noise softer in the blobs page, and ...
animate it better when you change the settings using the functions shown in image 1 [‹ › and the list
of every perfumer]. replace the node which says perfumer not found with a hexagon, which says
perfumers not found. it should be a list, not the same as the blobs ... the second picture [the line
under the Strings' title] should be ommited. finally, please do eveyrthing you can to optimize the
page of perfumers. It does not work smoothly, especially when you open up prin lomoros and scroll. it
is also low quality ... also replace perfumers apge with test page 1, and vice versa." Asked what the
swap meant, they chose **the two pages swapped whole**.

**The swap.** `perfumers/` — Perfumers in the Menu — is **Perfumer Worlds** now: the Strings and the
World, with the site's Menu and the page's name in the top left, reading **the live ledger**
(`perfumers-data.js`, all 35 perfumers) instead of a pasted copy, and every perfumer's **biography**
from `tools/perfumers/BIOS.md` (which `build.py` writes into the data under `bio` since this round).
Perfume names in Learn More link to where they are written about on the site; its sources are the
ledger's own, in MLA 8. **Test page 1 is the radial poster** that was the Perfumers page — its markup,
its styles taken out of `style.css`, its script with a copy of today's ledger and its Earth in one
`page.js`, linking nowhere but back to Contact as every test page does (its index names perfumes
without links, its sources are written out, its asterisk is a button).

**The strings, as strings are.** Each string is worked out as a real one: a line of 24 pieces under a
tension, pulled down by its own weight and slowed by the air — the wave equation, stepped as finely as
its tension needs (`GRAV`, `TAUT`, `RAMP`, `AIR` in the script). Slack, it hangs in the curve its
weight and tension give it and sways a breath; **pointed at, its tension rises at once** to fourteen
times as much and it snaps straight with one short twang — quicker the shorter and tauter it is — and
**let go, its tension falls at once** and it drops back with a small bounce. **Nothing holds it taut
but the hand**: a pluck pulls it out where the hand crossed it, the two kinks run to its ends and back
and die away, and it stays slack (it was held taut 650 ms after a pluck until now).

**The opening, a beat apart.** The three discs a world opens through are now **a beat apart in time**
as well as a little apart in place: blue sets off first and red last (`LAG`), on one gentle curve at
rest at both ends (`discCurve`), so the edge of the world comes in blue, then cyan, then whole; and
closes the same way round. The middle blob is worked out at a steady thirty times a second, its
aberration too — it was worked out every frame of an opening, which was what stuttered.

**The World.** **The swarm** replaces the double circle: fine specks turning round the last sphere the
hand was on, each at its own distance, streaming across on springs of their own to the next, drawn
through the lens (each colour takes its speck a little apart, so a speck is fringed blue above and
gold below). **The middle has no emphasis**: the hand on it takes nothing. **Return goes to the Strings
from anywhere** — from the middle of an opening (the discs close back from where they had got to), of
a change between worlds, or of nothing. **Learn More glides** the sheet's top to the window's top,
on a curve, over 1.35 s; **Back up** (it said *Back to the world*) glides back. **‹ › and the list of
every perfumer slide**: the next world comes in from that side, the last goes out the other, its
spheres with it. **The grain is softer**: a narrower, lighter noise, fainter, jumping more slowly.
**The line under the Strings' title is gone.**

**Perfumers not found.** The block of the perfumes no source credits is **one hexagon** high in the
middle, between the two sides, with one string straight down to the point, named *PERFUMERS NOT
FOUND*, drawn through the lens. Its world is **a list, not a blob**: no blob and no spheres, the
perfumes in a table in the middle (the perfume, its house, its year) in a hexagon drawn through the
lens, the letters thrown a hair apart blue and gold; its readings and its houses either side, as in
every world. Round a house, the same hexagon stands for it among the house's perfumers.

**The poster's plane.** Close in on what is chosen, the poster's camera only ever turns about the
chart's middle at one height and tilt — going through Prin Lomros' perfumes is the chart turning
under it. So close in the chart is drawn **once, flat, onto tiles of its own plane** (150 units
square, finer near the eye, `LEVELS`), and every frame the browser lays each tile down tipped and
turned in perspective by a CSS transform (`perspective() rotateX() rotate() scale()`, the very
projection `proj()` works out), at no cost. Scrolling Prin Lomros went from about 21 ms of drawing a
frame to about 5, and stays at the screen's full sharpness instead of the lower one it moved at. The
Earth, upright while the rings turn, has a picture of its own close in. Until every tile is drawn,
and through every flight, the chart is drawn as it was; `?plane=off` draws it that way for comparing.

## Why / key decisions

- **The swap is the pages whole, not their links** — the owner's choice. So the new Perfumers page is
  a page of the site (the Menu, the cursor, search tags, the live ledger) and the poster a test page
  by all the test pages' rules (`tests/test-pages.spec.js`): its own `page.js` alone, no link into the
  site, no site stylesheet, `noindex, nofollow`. A test page is a snapshot, so the poster carries the
  ledger as it stood on 2026-11-10 and does not change with it.
- **Perfumer Worlds' styles are its test page's, scoped**, not rewritten: every rule prefixed with
  `.worlds-page` (its tokens on its body), the class names `t1-` become `pw-`, its API `TestPage1`
  became `PerfumerWorlds`. The heads moved a line lower, clear of the Menu.
- **Real physics, tuned to read**: a string's slack tension is set so it hangs 7% of its length
  whatever its angle (a slack string's sag is its extra length, not its angle), the hexagon's straight
  one barely. The twang is one swing: the tension takes 0.12 s to rise, so the slack is taken up
  rather than slung, and a taut string's air is thicker (`AIR_TAUT`) so it settles in half a second.
  Measured in a simulation first (L = 250, 500, 900 px).
- **"Lag a little"**: a lag of 0.14 of the discs' time read as a flood of blue and cyan at the
  fastest moment (a small delay times a fast edge is a wide ring); 0.055 still too wide; 0.024 is a
  fringe.
- **The plane, not a cheaper drawing**: the drawing's cost was mostly its writing — hundreds of names
  set at a slant, which a graphics card draws as shapes — so a cheaper drawing was still a drawing a
  frame. The plane draws the writing once. Tiles near the eye are drawn finer (0.6, 0.85 or 1.2 of the
  screen's pixel by how much the eye magnifies them there), and drawn again finer as the turning
  brings them nearer; 70 kept at most. The out-of-focus copy is made from the tiles.
- **Without the script**, the page is its index and its sources, written by `build.py` between the
  same markers as on the poster, so the site's search and a reader without the drawing still find
  every perfumer — held back while the drawing comes (`js-coming`), put away once it has (`pw-drawn`).

## How to test it

`npm test -- tests/perfumers.spec.js` — the strings and worlds with the live ledger and the Menu; a
string taut within a fifth of a second of being pointed at, slack at once when let go, and a pluck
leaving it slack; the hexagon and its list (no blob, no spheres); the swarm staying on the last sphere,
never the middle, nothing written; blue ahead of the rest as a world opens, and Return or Esc from the
middle of an opening or a change; Learn More gliding, not jumping, to exactly the top, *Back up*, the
perfumes linked; › sliding; the lens and the softer grain; the search; the index without the script;
a phone. `npm test -- tests/poster.spec.js` — the poster at `/test-pages/1/`, and its plane: close in
on Prin Lomros it stands on tiles in perspective, and the wheel draws nothing of the chart again.

## Known issues / TODO

- **Four perfumers have no biography yet** — Marius Pana, Lorenzo Orlandi Berti, Alexandru Marian and
  Georgiana Ștefănoaei, added from the owner's word on 2026-11-08 — so Learn More shows the ledger's
  line about them and no more; `build.py` says so each time it runs.
- The headless browser the tests run in has no graphics card, so it cannot say how many frames a
  second the plane makes on a real screen; what it can say is that the page's own work a frame of
  scrolling fell from about 21 ms to about 5.

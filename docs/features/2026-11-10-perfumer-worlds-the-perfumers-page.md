# Perfumer Worlds, the Perfumers page — and the radial poster, test page 1
Date: 2026-11-10
Files touched: `perfumers/index.html` (Perfumer Worlds now), `perfumer-worlds.js` (new — what was
`test-pages/1/page.js`), `style.css` (the poster's styles out, Perfumer Worlds' in, under
`.worlds-page`), `perfumers-data.js` and `tools/perfumers/build.py` (the biographies carried in the
live data), `test-pages/1/index.html` and `test-pages/1/page.js` (the radial poster now, with its
plane), `perfumers.js` and `perfumers-earth.js` (taken out of the site's root — test page 1 carries
them), `tools/perfumers/earth.py`, `tools/seo.py`, `tests/perfumers.spec.js` (new, Perfumer Worlds'),
`tests/poster.spec.js` (was `perfumers.spec.js`), `tests/test-pages.spec.js`; and on 2026-11-11
`perfumer-worlds.js` (its blobs drawn on the graphics card, the noise over them), `style.css`,
`perfumers/index.html`, `test-pages/1/index.html` and `test-pages/1/page.js` (the poster re-dressed),
`tools/seo.py`.

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

**Perfumers not found.** The block of the perfumes no source credits is **one hexagon at the bottom
right** of the Strings, level with the point, with one string in to it, named *PERFUMERS NOT FOUND*,
drawn through the lens. Its world is **a plain list**: no blob, no spheres and nothing drawn, the
perfumes in a table in the middle (the perfume, its house, its year) ruled as the list beside it is;
its readings and its houses either side, as in every world. Round a house, the same small hexagon
stands for it among the house's perfumers. (For the first hour of the round it stood high in the
middle, its string straight down, and its list was framed in a large hexagon with its letters thrown
a hair apart blue and gold — the owner then: "make the perfumers not found note on the botton right.
in page, i dont want it to be a hexagon, rather make it just a list. a normal list.")

**The poster's plane.** Close in on what is chosen, the poster's camera only ever turns about the
chart's middle at one height and tilt — going through Prin Lomros' perfumes is the chart turning
under it. So close in the chart is drawn **once, flat, onto tiles of its own plane** (150 units
square, finer near the eye, `LEVELS`), and every frame the browser lays each tile down tipped and
turned in perspective by a CSS transform (`perspective() rotateX() rotate() scale()`, the very
projection `proj()` works out), at no cost. Scrolling Prin Lomros went from about 21 ms of drawing a
frame to about 5, and stays at the screen's full sharpness instead of the lower one it moved at. The
Earth, upright while the rings turn, has a picture of its own close in. Until every tile is drawn,
and through every flight, the chart is drawn as it was; `?plane=off` draws it that way for comparing.

## 2026-11-11 — the blobs on the graphics card, the noise over them; the poster re-dressed

The owner: "optimize the new TP one even further; it sometimes lag when going from overview into
deep view ... when you scroll in the detailed view, you have a highlighting function where one of
the perfumes is highlighted. it shouldnt be, it should just be a scrolling of the disc object
(orbit). i want you to also improve the button on the bottom that says return. please also change
the font top left. i also want you to just rework every part of this page that is not on theme, and
make it on theme. but, return the lines that connect the perfumers to the countries, instead of the
particles. that was better. Also play with the colour scheme a little, it can be different too.
from the current perfumers webpage, i want you to change the chromattic abberation to be a little
more dynamic, and not so strong (as in the edges are too big). i also want you to optimize hovering
the houses. I also want you to remove the phrase perfumer world or whatever is on the top left. also
return the noise, which should be strongest around the objects and the chromatic abberation, and
also make the objects feel more fluid and HD!!!!" — and, on the noise, over four messages: "make it
via a mask of noise that is feathered around the object; and it should not be of a different
colour, it should be an effect of the page (background and foreground)"; "nononono ... i want the
object to have an overlay of noise, not for it to be noisy itself"; "too strong too regular, make it
involved with the page too please ... When you actually hover with the noise, make the page change
its noise overlay levels"; "better. I also want you to include a character of the noise that means
it is inherenty moving (n ot spacially but rather intrinsically) ... blinking and flickering".

**Perfumer Worlds — the blobs on the graphics card.** Every blob — the middle one, the spheres
round it, a traveller between worlds — is worked out by the graphics card for every pixel of the
screen, every frame, in a small shader of the page's own (`GLB` in the script, `?gl=off` the
processor's way as it was): as sharp as the screen, and moving as smoothly as it does, its lobes'
space warped a breath so the edges flow. On a machine that only pretends to have a card (the
tests' browser) it is the processor's way, unless `?gl=on`; and if laying the card's picture in is
ever slow, the processor's way from then on. **The aberration is alive and thinner**: three fifths
of what it was at rest, thrown along a line from the lens's own middle — which drifts a third of
the way towards the hand — through the blob, breathing a little, widening along the way a blob
moves while it moves. **The houses' hover is smooth**, the spheres drawn by the card.

**The noise, an overlay.** The blob is drawn clean, and a second picture draws only the noise —
grey, a few grains lighter or darker, most hardly at all — through a mask feathered round each
blob, most at its edge and where its colours part, a little less over it, going out into the page;
laid over the drawing as an *overlay*, so it lightens and darkens what is there, the blob and the
page alike, and brings no colour of its own. It gathers in slow clumps carried with the blob;
**every grain blinks on a beat of its own**, seven to seventeen times a second, bright or barely,
and the whole flickers a little as a projector's light does — none of it moving across the page.
**It answers**: the hand in it (the blobs' own field worked out where the hand is, `noiseAt`)
swells and quickens it round the hand, a fast hand stirs it, a world opening or changing lifts
it — and **the page's own grain** (`.pw-grain`) **rises with it**, to about twice its strength
while the hand is in the noise (`--grain-lift`), settling slowly once it leaves; that grain jumps
eight times a second now and flickers too (`--grain-flick`, a registered property animated).
(For a few hours it was light and dark specks laid over the edge, then the edge itself let go into
noise — both "bad".) **The title top left is gone** — the page's heading is there for a screen
reader alone; a world's head names it plainly.

**Test page 1, the radial poster.** **Into the deep view without a stall**: the plane's tiles for
where the camera is going are drawn during the flight, a few milliseconds a frame (`planeAhead`);
the close Earth's picture over four frames while it is still hidden (`EARTH_STEPS`); the
out-of-focus copy made from a picture a third of the size; names set round their arcs at most two a
frame while flying; and a fast flight drawn on a canvas of half the sharpness (`cvFast`). The worst
frame of the flight into Prin Lomros went from 51 ms of the page's own work to 28. **The scroll only
turns the disc**: nothing is marked where it stands (`markAt` is out of the code), and the scrubber
says which perfumes are in the window, *009–038 of 139*. **The lines from the countries are back**
(`drawFans`), the sillage's specks out of the code. **On theme**: the title in **Bodoni Moda**, a
Didone as a perfume's label is set, the years in its italic in brass, a hairline after them; the
chosen name, the list's name, the windows' names and the foot's headings in it too; every button
framed by **registration marks** at its corners, drawn out and turned brass under the hand, not
boxes; the A–Z / By year switch two words in one frame with a brass lozenge by the one on; a
perfumer marked by a ring and a house by a square, in the list, over what is chosen and in the
windows, as their countries are pinned on the Earth; the hint set as a caption under an engraved
plate. **Return** (it said *The whole chart*): the chart drawn small — its rings round the Earth,
the outer turning under the hand — *Return* in the Didone's italic, *to the whole chart* under it,
and Esc. Two older rules gave it and the hint a top and a bottom both, stretching each down the
stage — unseen while they were plain words; they are placed by the window now. **The colours, the
night atlas**: a warm black, parchment, brass for the individual fragrances, verdigris for the
house perfumes on the site, madder for Prin Lomros', the Earth warmed with them — the old ones (the
aldehyde's gold and violet, rose, a cold black) at `?colours=was`.

## 2026-11-12 — the sheet of glass, the cursor over the blobs, the poster's flight into a house

The owner: "when you scroll, i want the background to appear when you scroll to the lower parts, i
want it to be visible. let the page with information about the perfumers be like a semi-translucent
page; and it blurs out everything in the background. also make sure the cursor is white when
hovering black things in this page too. also for the TP1, i want you to actually optimize the
movement when clickinga house from the general view. I want you to make it go as smooth as possible.
optimize optimize optimize."

**The sheet, frosted glass.** Learn More's sheet is the World's paper at three fifths and a blur of
26 pixels over whatever is behind it (`backdrop-filter`), so the World — drawn on a canvas fixed to
the window, and never stopped while the sheet is up — goes on moving behind it, out of focus,
however far down it is read.

**The cursor over the blobs.** The site's cursor reads the colour under it — a background, a
picture — and a canvas has neither, so over the World's dark blobs on its pale paper it stayed
black. Since this round **a canvas can say where it is dark**: `canvas.darkAt(x, y)`, true, false or
null, asked by `nav.js`'s `isDarkAt` like a picture is read. The World records every blob it draws
each frame and answers from their own field (`seen`, `seenBlob`, `darkAt` in the script): inside one,
dark; elsewhere, nothing to say, and the paper answers.

**The poster's flight, smoother.** Measured, the page's own scripts were a seventh of the browser's
work in a flight; the rest was laying down large pictures. Three things:

- **One picture a frame while it flies**: the live layer — the dust, the lights, what the hand is on —
  is drawn into the flight's own picture at its sharpness, and the live layer's own canvas (the
  window's whole size at the screen's full sharpness) stands empty and hidden until the camera
  lands (`drawLive(into)`, `liveEmpty`). Half of all frames of the flight from the whole chart into
  Nicholas Nilsson now come in a sixtieth of a second (they took a thirtieth).
- **The lighter picture for more of it**: the half-sharp flight canvas from a tenth of the window a
  second (a fifth until now), and for the first frames of every flight, while the chart turns from
  the rotor's picture into its drawing (`flightT0`).
- **A house close in is a crossfade** (`beginXfade`, `XF_MS`): the camera does not move when a house of
  the perfumer it looks at is chosen — the chart only changes its colours — and those colours were
  faded by drawing the whole chart again, at its full sharpness, every frame for two thirds of a
  second (seventeen drawings of seven million pixels). Now the chart takes its new colours at once,
  drawn once, and what stood on the window — the plane's tiles, the Earth's picture, the out-of-focus
  copy, or the chart's last picture — is moved into a box over it (`.pf-xfade`) and fades out as the
  new one fades in: a picture's opacity a frame. Any choice close in that leaves the camera where it
  is fades so — a perfume, a house, going back up.

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
- **Its styles were moved with a scoping pass that, where a rule's comment held a comma, put the
  page's name inside the comment** — harmless for a rule starting with a class, but a rule starting
  with `body` then matched nothing: the World's words fading in with the opening (`is-revealing`)
  did not, for an hour. Repaired the same round, and the comments cleaned.
- **Without the script**, the page is its index and its sources, written by `build.py` between the
  same markers as on the poster, so the site's search and a reader without the drawing still find
  every perfumer — held back while the drawing comes (`js-coming`), put away once it has (`pw-drawn`).

## How to test it

`npm test -- tests/perfumers.spec.js` — the strings and worlds with the live ledger and the Menu; a
string taut within a fifth of a second of being pointed at, slack at once when let go, and a pluck
leaving it slack; the hexagon at the bottom right and its plain list (no blob, no spheres, nothing drawn round it, no
fringe on its letters); the swarm staying on the last sphere,
never the middle, nothing written; blue ahead of the rest as a world opens, and Return or Esc from the
middle of an opening or a change; Learn More gliding, not jumping, to exactly the top, *Back up*, the
perfumes linked; › sliding; the lens and the softer grain; the search; the index without the script;
a phone; and with `?gl=on`, the noise an overlay round the blobs, the hand in it lifting the page's
grain and its flicker; the sheet frosted glass; the cursor light over a blob and dark over the paper. `npm test -- tests/poster.spec.js` — the poster at `/test-pages/1/`, and its plane: close in
on Prin Lomros it stands on tiles in perspective, and the wheel draws nothing of the chart again;
the scrubber naming a span, not a perfume; the lines from the countries and no sillage; the night
atlas's colours, the old at `?colours=was`; the title in the Didone; Return placed above the hint
and going all the way back; a house chosen close in a crossfade, the chart drawn once; the live
layer drawn into the flight's picture, its canvas hidden while the chart flies.

## Known issues / TODO

- **The four perfumers added from the owner's word on 2026-11-08 have biographies since 2026-11-11**
  (the owner, asked: "Research what I can"): Marius Pana (Jinkoh Store, which he founded in 2019,
  and Kinamic's Qiyun series), Lorenzo Orlandi Berti (Atelier Fragranze Milano), Alexandru Marian
  (Grande Parfums, which he founded and runs alone) and Georgiana Ștefănoaei (Matca, in Sibiu) —
  each from up to six sources read, the three that say most kept, nothing written that a source does
  not say. Two hosts, Parfinity and Scent Verdict, could not be opened from the machine they were
  written on, so what those pages say was read through the search engine's reading of them.
- **The noise lives on the graphics card alone**: on the processor's way (a machine with no card,
  or `?gl=off`) the blobs are drawn as they were, with the page's grain only. The tests reach the
  card's way with `?gl=on`, drawn in software, slowly — they say it works, not how it looks.
- **The tests' browser cannot say how smooth it is on a real screen**: it has no graphics card, so
  laying down the close look's forty tiles in perspective takes it about 66 ms a frame even at rest.
  What it can say is what the page asks of the browser — one picture drawn for a house chosen close
  in instead of seventeen, one large picture a frame in flight instead of two.
- The headless browser the tests run in has no graphics card, so it cannot say how many frames a
  second the plane makes on a real screen; what it can say is that the page's own work a frame of
  scrolling fell from about 21 ms to about 5.

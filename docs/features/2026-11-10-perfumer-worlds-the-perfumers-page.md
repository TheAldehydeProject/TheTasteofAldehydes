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

## 2026-11-23 — the opening smoothed, the World's parts coming as it opens

The owner: "I WANT YOU to look into the perfumrs page, to smooth out the transition from thegrid
page into the blob page, and i want you to make sure that when you actually click it the elements
of the blob page develop gradually and not just pop in after the transition finishes loading."

What the opening did, frame by frame (side by side with the live version, frames taken on the
page's own clock):

- **The World's words came in as one block**, late — at 45% of green's disc and on its own curve —
  and the readings, the list and the head all at once.
- **Return, Learn More, the ‹ › bar's colours, the Menu's, the page's name's and the search's were
  changed only once the opening had ended** (`setBody`, at `opened()`): for the second half of it the
  Menu and the search stood white on the World's pale paper, unreadable, and then Return and Learn
  More appeared, the search jumped 120 pixels to the left, and the grain changed from a light speck
  to a dark one.
- **The World was drawn at a smaller size while it opened** (1.25 pixels a point; the screen's own
  is 2 on most laptops) **and came sharp with a jump** when it had.
- **It was heavy**: every frame took the World apart into its three colours and laid each back
  through two clips, drawing the strings six times (twice a colour) — 40 to 60 milliseconds a frame
  in the test browser, and its first frame 150 to 190, most of it the World's paper being made then.

Now:

- **The discs drawn through a mask** (`drawDiscs`, `MASK_AT`): where each colour's disc has reached is
  one small picture at half the size — it is all soft edges — black in that colour inside its disc and
  whole outside, feathered at its edge; the strings, drawn once, are multiplied by it, the World by its
  opposite (`difference` against white), and the two added. Every colour of the page is the World's
  inside its own disc and the strings' outside, and the two always make the whole of one, so the
  three colours a beat apart are kept — **softer** at their edge than the hard bands they were. The
  World is drawn **at the screen's own sharpness** the whole way. Three passes over the box the discs
  reach, where there were about two dozen: 21 to 43 milliseconds a frame in the test browser, the
  last, largest ones up to 70 to 96, and the first 43. Once every corner is inside every disc, the World
  alone. Its paper is made ahead, while the page is idle (`layLater`, and after a resize).
- **The World's parts come as the discs reach them** (`revealParts`, `revealTo`, `RV` in the script):
  each reading, the head, each row of the list, Return and Learn More is on the page from the first
  frame, unseen, and begins to come up — rising eight pixels — once green's disc has passed over its
  middle, over two thirds of a second (`RV_DUR`); the readings and the rows of the list one after
  another (`lag`), the nearer the point the sooner. So Learn More, under the World, comes first, then
  the readings, the list row by row, the head and Return; and on a phone, where the strings meet low
  down, the search and the readings first and the head last.
- **The chrome the two views share turns as the disc passes it**: the Menu (and on a phone its
  ground), the page's name, the search (its colours, and moving over to where the World has it) and
  ‹ › go from the strings' colours to the World's by `--k`, set by the script on each and read by the
  stylesheet with `color-mix` (THE OPENING, in `style.css`) — at `--k` 1 exactly the World's, so
  nothing changes when the opening ends. The grain goes out and comes back as the World's half way
  (`--gfade`, `.is-dawn`).
- **The last of them finish over the World** (`RV.tail`): the parts in the far corners are reached
  near the end, and take their two thirds of a second after the discs have landed, rather than
  jumping to whole. Anything begun meanwhile — Return, ‹ ›, a row — finishes them at once
  (`revealFinish`).
- **The spheres come as the disc reaches them too**: each begins to come in once green's disc has
  got to it (`openEdge` in `drawWorldView`).
- **Closing** (Return, or Esc from the middle of an opening), each part goes as the disc closes back
  over it, never coming back up on the way; the shared chrome turns back the same way.
- **The cursor** knows during either: dark where the strings still are, the World's answer inside
  green's disc (`darkAt`) — it changed when the opening ended.
- **Learn More pressed while it opens** opens the sheet once it has (`TR.thenMore`).

Tried and not kept: **the square inside all three discs laid down as it is**, the strings clipped
round it and the mask worked only in the four bands round it — measured slower (141 to 173
milliseconds against 76 to 96, twice each), more, smaller pieces costing more than the one box; and
the mask's box drawn exactly to its edge, which left a faint rectangle on the strings where the
small mask was read against what lay outside it as it was enlarged — it is made a little past the
box now.

### Later the same day — smoother, twice over, with diagnostics between

The owner: "better with the graduality of the elements, but i want you you make it smoother. try to
smooth it out as best as you can, then run diagnostics, and then smooth it out more then
diagnostis again".

**The diagnostics** (kept in the session's scratch folder, not in the repository — they drive the
page from outside):

- *Performance*, on the real clock, with Chrome's own trace: every frame's interval while a world
  opens, the slowest, the longest task and what it was made of, and the main thread's time on
  script, style, layout and paint — at 1440 × 900, twice the screen's pixels, for Prin Lomros and
  Aichi Liu, twice each.
- *Smoothness*, on the page's own clock — `performance.now` and the frames' time replaced, moved on
  16 milliseconds once a frame however many loops the page runs, and held for a look at each frame:
  how far the edge moved and how much its speed changed, every part's opacity and place, the Menu's,
  the page name's and ‹ ›'s colours, the search's place, the grain, and how much of the picture
  changed since the frame before (a pop is a frame that changes far more than those either side).
  Two traps found on the way: a clock moved on 16 milliseconds a *callback* ran three times fast in
  uneven jumps; and the grain's strength is kept in 255 steps, each shifting the whole screen a
  fraction of a level as it fades, so the picture is measured with the grain hidden and the grain
  read on its own.

**Round 1.**

- **The mixing only where the ring is** (`TILE`): the screen looked at in squares — inside all three
  discs, the world as it is; outside all three, the strings as they are; only the squares the ring
  crosses mixed. The mixing had been nine tenths of a frame, done over the whole box the discs
  reach. Each draw is clipped to its squares, never cut into them (cut, the soft mask reads
  differently either side and the squares show), and the world's picture is changed before it is
  drawn from, never between (each change between copies it whole). Pixel for pixel the same as
  before, compared frame by frame.
- **The discs' curve** leaves rest as it arrives at it (`discCurve`, x²(6 − 8x + 3x²)): the one
  before set off at a third of its speed at once — the edge went 0, 1.1, 4.4 pixels a frame.
  **The opening a little longer**, 2.1 → 2.4 seconds.
- **Each part** over 0.9 of a second on a curve still at both ends (`soft`), rising on one that slows
  as it arrives; the rows and readings a little further apart.
- **The chrome** over 0.7 of a second, setting off a little before the edge reaches it
  (`RV_EARLY`), half way as the ring passes under it; **the search slides by a transform**, not laid
  out again every frame.
- **The grain** lifted by a world opening eased in and out (`NZ.mv`) — it rose by a third at once and
  dropped as suddenly when it ended (the graphics card's way only).

**Round 2.**

- **The first frame after the press**: every other perfumer's strings stood back up to their rest
  brightness for a frame before fading, and the block pressed let go of its light in a sixtieth of a
  second; now the rest stay as dim as they were and the one pressed keeps its light, and both go with
  the strings.
- **The hand's label fades out** over a quarter of a second as a world opens (`showTip(null, true)`,
  `.pw-tip.is-going`); it was gone the frame the block was pressed.
- **The point swells as the dots come**, by how far each has come, not how many have (three dots,
  three steps).
- Each part over 1.1 seconds, the chrome over 0.85; the squares 32 pixels (64 and 24 measured the
  same or slower); the grain's half-way change back to straight with the disc (it measured gentler).

**What the diagnostics said** (Prin Lomros; before → round 1 → round 2):

| | before | round 1 | round 2 |
|---|---|---|---|
| the edge's biggest change of speed in one frame | 3.3 px | 0.9 px | 0.9 px |
| a part's biggest change in one frame | 0.037 | 0.034 | 0.028 |
| the Menu's colour, biggest change in one frame (of 255) | 10.4 | 8.9 | 7.5 |
| the search, biggest move in one frame | 6.0 px | 5.2 px | 4.3 px |
| the worst frame against its neighbours (grain hidden) | — | 1.2 × (the first frame) | 1.2 × (none stands out) |
| the slowest frame (test browser) | 183–217 ms | 141–150 ms | 117–125 ms |
| the longest task | 170–197 ms | 110–125 ms | 105–115 ms |
| full layouts while it opens | 11 | 7 | 8 |

The test browser draws in software, so its frames are far slower than a laptop's — half of every
frame there is the canvas being copied out to the screen, which a graphics card does not do; the
numbers are for comparing one round with the next, not for what is seen.

## 2026-11-24 — sharp on an iPad: the blobs kept on the graphics card

The owner, with a picture from an iPad: *"Its very low definition. Can you fix that?"* The picture
was the World drawn **the processor's way**: the middle blob painted 176 pixels across and laid down
about five times as large, soft all over. The graphics card's way is sharp at any size — but the page
gave it up for the processor's on three counts, any of which an iPad can meet. Each is now met
rather than given in to (`perfumer-worlds.js`; the part in the scratch build is `gl.js`):

- **A card that holds fewer numbers** (uniforms — the values a drawing on the card reads) than the
  108 that thirty-two lobes want was refused outright. The drawing is now made for **as many lobes as
  the device holds** (`NL`, from `MAX_FRAGMENT_UNIFORM_VECTORS`; 13 on a card holding 64, the least an
  older device gives), the largest lobes kept; it is refused only under 8.
- **A card slow to lay its picture into the page** — Safari copies a card's picture back out to lay
  it into a canvas, and a full iPad screen is five million pixels, twice a frame (the blobs and the
  noise) — was given up for good once laying it in averaged 28 milliseconds over 24 frames. Two
  things instead: **the card's picture is only the box the blobs stand in** (`glBox`: every sphere and
  the middle, with room for their drift; the whole screen only during a change, when they travel) —
  about a third of the screen in a perfumer's world; and when it is still slow — 22 ms or more on
  average over 24 frames — it is drawn **a step less sharp** (four fifths each time, `glSharp`),
  **never below the screen's own point** (`1 / DPR`, a plain screen's sharpness, still far sharper
  than the 176-pixel picture), and a step back up once it is quick. It never goes to the processor
  for slowness. The noise is laid by the screen's pixels (`uOff`), so it stands still however the box
  moves.
- **A card taken away** (the browser does this to a page when the device is short of memory — an
  iPad with many tabs open) kept the processor's way until the page was opened again. The drawing is
  now **made again when the browser gives the card back** (`webglcontextrestored`, `setup()`), and
  the page goes back to it (`glBack`).

**`?gl=why`** on the address puts a small line at the foot saying which way the blobs are drawn and,
if the processor's, why — the lobes, the device's uniforms, its pixel ratio, how sharp the card's
picture is, what laying it in costs, the box, and the card's name. If the iPad is still soft, that
line says which of the three it is (or a fourth).

**Checked:** with `?gl=on` the World drawn by the old script and the new is **the same picture,
pixel for pixel**, at rest and frame for frame through an opening on a held clock (one frame differs
by one level of 255 in places); a card faked to hold 64 draws 13 lobes, 30 is refused and says so; a
card made slow to lay in steps 1 → 0.8 → 0.64 → 0.51 → 0.5 and stays on the card; a card taken away
goes to the processor saying *lost*, and comes back when given back.

### The same day — other devices compared, and the processor's way made sharp

Asked whether to put it live, the owner: *"Can you compare to other devices, see if they have the
same provlems. If yes, fix them too."* No real devices can be reached from here, so each kind was
worked through from how its browser draws, and the failing ones faked in the test browser (the
card's numbers, its slowness, its loss; no card at all is what the test browser is). The owner's
picture, looked at again, was **the processor's way** — the thick cyan and gold bands are its own —
on a landscape iPad, where the middle blob is several hundred points across.

| device | how the blobs were drawn | the same problem? | now |
|---|---|---|---|
| iPad, iPhone (Safari) | the card, given up when its picture was slow to lay in (Safari copies it out of the card) or the card taken away (short of memory) | **yes** — the owner's | kept on the card (above) |
| Mac (Safari), and most of all a large Retina screen (5K is 15 million pixels) | the same copy as an iPad | **yes**, the likeliest after the iPad | kept on the card (above) |
| Firefox | on some machines its canvas copies the card's picture too | **likely** | kept on the card (above) |
| Chrome and Edge (Windows, Mac, Android) | the card's picture laid in on the card, no copy | no | as it was |
| no card it will use — an iPhone or iPad in Lockdown Mode, a browser with WebGL off, a machine whose card the browser does not trust (old drivers, Windows' basic display driver, a virtual machine) | the processor's way: the middle 176 pixels across (132 on a phone) laid down 2½ to 7 times as large, its colours laid apart the whole way | **yes** | sharp at rest, and its colours as the card's (below) |
| a phone with a screen of 3 (most iPhones, many Androids) | drawn at 2, the site's own rule for its 3D drawings (`window.Sharpness`, 2026-10-01) | a little, by the rule | as it was — the rule's |
| an old card holding few numbers | refused | rare | fewer lobes (above) |

**The processor's way, sharp** (`sharpCur`, `HI`, `SHARP_*` in `perfumer-worlds.js`; `world.js` in
the build): while the middle blob stands still — its aberration its own, no world opening or
changing — it is painted again **as sharp as the screen's pixels it covers** (up to 560 across), a
few rows a frame (**3 milliseconds of each**: `fieldOf` and `lensRows` take a range of rows now),
into a picture of its own, and **mixed into the last** over a quarter of a second once whole, then
again a moment later where its lobes have drifted to (a few pixels a second). Painted whole it takes
12 to 40 ms, more than a frame. The two pictures are mixed in a picture of their own and laid down
once: laid one over the other — the first try — the blob, being see-through, went darker in its
middle while they crossed, which a frame-by-frame reading of its colour caught. With reduced motion
it is painted whole at once (no frame comes after). Measured in the test browser at rest, laptop
(2×), iPad and a plain screen: the frames as quick as before or quicker (the small picture is no
longer painted thirty times a second at rest), the middle's colour steady to the level, the same as
before.

**Its colours as the card's** (`paintAny`): the processor's way laid the blob's red, green and blue
apart the whole way (`shift`), the card only `CA_K` (0.6) of it since 2026-11-11, when its
aberration was made thinner — the processor's was never thinned with it. Now both are, so a device
without a card looks as one with a card does, less the card's noise.

**Left as they were:** the spheres round the middle on the processor's way (painted once each at
three fifths of the screen, out of focus by design, one a frame as a world opens — sharper would
slow the opening); a phone at 2 of its 3 (the site's rule); and a page zoomed in with two fingers,
which enlarges the drawing as it is, on the card or not.

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
grain and its flicker; the sheet frosted glass; the cursor light over a blob and dark over the paper;
and the opening (2026-11-23): Return on the page, unseen, from its first frame, the World's parts
arriving at different moments while it opens, the World in the discs at the screen's own sharpness,
and nothing of the opening left on the page once it has (`PerfumerWorlds.opening()`). And (2026-11-24) the blobs staying on the card on a card faked to hold
64 uniforms (13 lobes), taken away and given back, and made slow to lay in (less sharp, never below
the screen's point, never off the card) — `PerfumerWorlds.gl()`; on a device, `?gl=why`; and without
a card, the middle painted as sharp as the screen at rest and its middle's colour steady as the
pictures change (`PerfumerWorlds.middleSharp()`). To see it frame
by frame, hold the page's clock — replace `performance.now` and the frames' time with your own and
move it on 16 milliseconds a frame — and take a picture at each moment. `npm test -- tests/poster.spec.js` — the poster at `/test-pages/1/`, and its plane: close in
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

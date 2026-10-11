# Om Parfums, Outsider Parfums and Lost Tribe — houses ten to twelve
Date: 2026-10-10
Files touched: `houses/om-parfums.html`, `houses/outsider-parfums.html`, `houses/lost-tribe.html`,
`om.js`, `om-glyph.js`, `tools/om/glyph.py`, `outsider.js` (2026-10-11), `lost-tribe.js`,
`house.js` (folds), `motifs.js`, `contact-sheet.js` (a press is not a drag, 2026-10-11),
`fragrance-line.js` and `chamber.js` (a see-through picture read on white, 2026-10-11),
`scent-descriptions/index.html`, `style.css`, `notes-data.js`, `network.js` (`HOUSES`),
`search-page.js`, `tools/seo.py`, `sitemap.xml`, `images/Om Parfums/`, `images/Outsider/`,
`images/Lost Tribe/` (and their `house-web/` copies and READMEs), the footer chain on
`houses/qimu-and-musicians.html` and `houses/pineward.html`; with the same round: Qimu's
Bassist and Drummer, Pumpkivus, three individual fragrances, Aetherialism as the eleventh
favourite, 37 new notes in the Note Library, and the phone's search on Scent Descriptions —
each in its own report, linked at the foot of this one.
Tests: `tests/om-and-the-tribe.spec.js` (new), and the house lists in `houses.spec.js`,
`contact-sheet.spec.js`, `notes.spec.js`, `fragrance-line.spec.js`, `mobile.spec.js`.

## What changed

Three houses, the tenth, eleventh and twelfth, each with the owner's writing, its pictures,
its notes (the house's own page first, Fragrantica under it, as Ataraxia's are split), a frame
on the Houses view with hover animations of its own, and a drawing of its own behind it:

- **Om Parfums** opens **behind cracked glass** — since the last round of 2026-10-11 fine cracks,
  as a pane cracks, the page's writing in each piece a pixel or few off its place, round **โอम**,
  the Thai spelling of Om — and **is read through it**: it scrolls under the glass, and **the
  hexagon at the hand shows it whole**, the glass about it mending as it comes and cracking again
  as it goes. **Opening a fragrance mends it for good.** (It was the page thrown far apart for its
  first day, and a few large shards mended for good by the hand that afternoon.) **On a phone it
  comes together by itself**, a moment after the page opens. Behind the whole page a vast
  armillary of gold hairlines turns slowly as you read — **drawn about three and a half times as
  quickly** as it was, and the cracked page as quickly as the whole one.
- **Outsider Parfums**, Om's sister house: since 2026-10-11 **a door standing slightly ajar** in
  the left margin, drawn in hairlines up from the floor as Les Abstraits' armoire is, **a small
  green light** coming through the gap and laid across the floor, dust drifting in it, the door
  giving a little under the hand and **opening further as the page is read** (`outsider.js`). For its first day it was Om's drawing in ivory
  and green with a reflected **twin** and an **echo** on its name; both are gone.
- **Lost Tribe**: a naturalist's **field notes** in the margins — the house's own stag and the
  creatures and ingredients of its six fragrances, in specks, each named as a field guide names
  it — pollen drawn to the hand, **leaves falling** (quiet behind the writing, since 2026-10-11),
  and **flocks crossing often**, scattering from the hand.
- At the foot of all three, **the fragrances not smelled yet**, in one sentence (2026-10-11) —
  Lost Tribe's long one **in a dropdown** since the last round of that day.
- On the Houses view (the last round of 2026-10-11): Om's motif is **rings converging in three
  dimensions**, several at once and each drawn its own way; Outsider's **door stands in a dark
  room**, swinging on its hinge, its light coming through as light; and Lost Tribe's **birds fly
  as they do on its page** and no longer vanish when the page is pressed.

## Why / key decisions

### The owner's words, and what was asked first

The owner asked for the ambiguous things to be put to them first, and four were: how the Om
page breaks (**"Whole page, one click"** — the whole page in pieces, writing and all, one click
anywhere bringing it together and it staying whole), the three subtitles (*The Olfaction of Om*,
*The Sister House of Om*, *A House of Notable Quality*), how far to touch the writing (**"Fix
clear misspellings"** — fragance, bana, elaf, plans for plants, vein for vain, honorably for
honorable, peaks for peeks, desert for dessert, "to completely separate things" for two,
abraisive, Rein for Resin, "have no had"; the voice left alone), and Xocolate Crotch, whose
*Mid* repeated the first half of its *Mid-Dry Down 1* word for word (**"drop the repeat"**).
They also sent each house's picture, said whose they were — Fragrantica's for Om and Outsider,
Lost Tribe's own — and asked for **"a sylized vbersion of this symbol "โอม" ... in the house
shattering thing"**.

The titles are the houses' own spellings, as Tombstone's are: *Nymphaea Caerulea* (the owner
wrote Nymphea Cerulea), *Dark Night of the Soul* (Dark night at the soul), *When the Linden
Blooms*, *Oud de Pasión* (Oud in Passion), *Pan’s Labyrinth*, *Watch King*. The houses' names
are the owner's: **Om Parfums** and **Outsider Parfums** (the house writes both singular, *OM
Parfum*), **Lost Tribe**. The fragrances stand in the order the owner gave them.

### The shatter (Om)

*(What follows is the shatter as it was first made, on 2026-10-10. It is gentler, mended by the
hand and quicker since 2026-10-11 — see [that section](#2026-10-11--om-gentler-and-quicker-outsiders-door-lost-tribes-leaves-the-fragrances-not-smelled).
What still holds: the pieces are copies of the page in a closed shadow root, the page is there
underneath all along, and when it is never in pieces.)*

**The pieces are the page itself.** A clone of the page's flow — its `<main>`, credit and foot —
is laid in each shard at exactly the place the page is, cut to the shard with a `clip-path`, and
the shards hang in 3D under one perspective: pushed out from the point the pane broke from (a
little above the window's middle), the middle ones fallen far back into a tunnel, one in five
turned over so its writing reads backwards, all drifting, the whole tilting a little towards the
hand. Through the gaps, the void: **โอม** large in specks, rings throwing sparks off as a sling
ring does in the Doctor Strange films the owner named. **The shards are clear glass** carrying
only the writing — a first go had them opaque, and the page read as a pile of dark tiles.

**Brought together**, each shard turns home on a clock of its own, the deepest last, over about
two seconds; its seam flashes gold as it lands and fades. Because every clone stands exactly where
the page does, the page under them is then simply shown — nothing of its own fading in
(`om-landing`) — and the pieces are faded off it, so there is no jump.

**The page is there all along, underneath.** While in pieces it is laid out exactly as it will
be, only held back (`om-shattered` on `<html>`: its children at opacity 0, the window not
scrolling, the scrollbar's room kept with `scrollbar-gutter: stable`). So the search, a screen
reader and the tests read the page, never the copies: the copies live in a **closed shadow root**,
`inert`, with no ids and no tab stops, and the overlay is removed once it is whole. The class is
put on in the page's own `<head>`, so the page is never seen whole first, and taken off at `load`
if `om.js` never arrives.

**When it is never in pieces**: with reduced motion; when the address points at one fragrance (a
`#` — the Note Library's way to a fragrance lands on it whole); with `?om=whole`. A window that
changes size while in pieces is made whole at once (the pieces' geometry is the window's).

**On a phone** (`hover: none`) it comes together by itself after 1.5 seconds (`AUTO_MS`); on a
desktop a small *Click anywhere to bring it together* comes up after 2.4 seconds if nothing has
been done.

### โอม

It is drawn from a real Thai typeface, so that it reads as the word it is: `tools/om/glyph.py`
reads the three letters' outlines out of **Loma** (the TLWG fonts) with fontTools, lays them out
as the font does, and writes `om-glyph.js` — every contour as evenly spaced points, in units of
the letters' x-height, and each letter's **head** (the small loop a Thai letter begins with) as a
circle. The stylisation is `om.js`'s: the outlines as specks with a brightness travelling along
each stroke, the heads made perfect circles with their centres crossed, on the hairlines a type
designer rules (baseline, x-height, the top of the tall letter).

### The armillary (Om — and Outsider, for its first day)

What the void is made of and what stands behind the whole page: rings tilted in three dimensions,
each turning on an axis of its own and ticked, specks travelling them; interlocking triangles after
the Sri Yantra (drawn with Om at its middle), two rings of lotus petals, a twelve-pointed star, dust
far off in depth. The outer rings reach past the window — "expansive". It turns a little as the page
is scrolled. **The lens**: a hexagonal shard of glass follows the hand a beat behind it, the drawing
inside it turned and brought nearer. It is drawn at **QUIET** over the column of writing — by a soft
mask laid over each finished frame (`hushColumn`) on its first day, and since 2026-10-11 by
**the pen** (below), so the reading stays clear.

**Outsider** was the same file for its first day (`om.js` read `.outsider-page` off the body;
it has a door of its own since 2026-10-11, below) — "elements from Om
parfums, but different and not as extreme ... not fragmented, but rather emphasizing the
similarity ... the same on this page minus the fragmentation (and a little change)": fewer rings,
its own mark (the inverted triangle and the smaller one under it, with their incircles) where Om
has โอม and the yantra, ivory with the green of the light in the house's photographs, and in
place of the shatter **the twin** — the drawing again, reflected, drifting apart and back into
register every sixteen seconds, and in register under the hand. Its name arrives with an **echo**
(a shadow of itself sliding into place, `outsider-echo` in `style.css`).

### The field notes (Lost Tribe)

The owner: "minimalist wildlife and ingredients ... emphasize nature through ingredients and
wildlife ... minimalist and with parrticles too; and make it reactive. Idk what exactly it is that I
want so make something and we will adapt later". `lost-tribe.js`, on linen paper:

- **The specimens**, down both margins in turn, carried with the page: **the stag** read off the
  house's own mark wherever it is copper (the cropped picture, so the stag the page draws is the
  stag the Houses view shows), and drawn by the script — balsam fir and lavender (Equatorial), lime
  and cassia (Dirty Soda), the banana leaf (Kong), sandalwood (Santal Absolu), the rose (Pan's
  Labyrinth), vanilla (Watch King), pink pepper, a swallowtail, a raven's feather, a sword fern —
  each named under it, its Latin in italic and what it is in small capitals. Creatures in the
  mark's slate, ingredients in its copper. Each **draws itself in** the first time it is seen.
- **The stray**: at rest a specimen's specks stand a few pixels off their places; the hand
  brings them home and the drawing sharpens.
- **The pollen** rises and sways, drawn to the hand; **the flock** crosses the window every nine to
  eighteen seconds, and scatters from the hand (more often since 2026-10-11, and **leaves** fall —
  below).
- On a window with no margins the specimens stand at its edges, half off it and faint.

The owner's list of the house's other fragrances is one paragraph, "separated by a comma in a
single line", under their last word: the names as the house writes them on losttribeperfumes.com,
each once (a v2 or v3 folded into its name), read through search summaries — the house's own
pages could not be opened from here — so a few may be missing. (Ten more were found on
2026-10-11; see below.)

### The pictures

Om's and Outsider's bottles are the house's own (one site sells both), Lost Tribe's too, two to a
fragrance; each house's foot credits them, and Om's and Outsider's credit Fragrantica for the house
picture. **Lost Tribe's house picture is cropped** round the stag to the Houses view's frame (0.86
wide for its height) — "MAKE SURE THE IMAGE IS CROPPED ACCORDINGLY" — in `house-web/`; **Om's**,
a square, is padded with its own black to the frame's shape, so the frame cuts nothing of the mark.
Equatorial came without a picture, and its plate is the hatch.

### The notes

The hierarchy as ever: the house's page first, Fragrantica under it. **Everything was read through
search summaries**: the houses' sites and Fragrantica would not open from this container (its
network policy refuses them). Where a page could not be found or read whole, the entry says so
rather than standing on a guess: Dark Night of the Soul's house page names over a hundred
materials and could not be read whole (Fragrantica's list under it); This Too Shall Pass and Draco
are Fragrantica's alone; Oud de Pasión's are the materials the house's page names, its own order
and wording unconfirmed; **Nymphaea Caerulea, Cannabis Café, Smoke Oud and Kong have no entry** —
no list was found for them anywhere (Smoke Oud's house sells a *Smoke Oud I* and *II* as attars;
the bottle in the picture is an extrait, whose page was not found) — so their windows say the notes
have not been found yet. Pan's Labyrinth names its version (the original of 2025; a v2 is said to
keep the formula).

### The hover animations on the Houses view

*(Om's and Outsider's are new since 2026-10-11 — see below.)* "related to the animations on the
pages": **Om** — shards of glass drifting and turning, a glint
running round each edge, rings throwing sparks, and โอम tracing itself in (the Houses view loads
`om-glyph.js` for it); **Outsider** — its mark with its reflected twin sliding into register, and
rings doubled the same way; **Lost Tribe** — a flock crossing, leaves falling and turning, pollen
rising. In darker inks than the pages' (the Houses view is white paper). `motifs.js`, `HOUSES`.

### A fold, a list, a rule

The owner's dropdown on Om ("make the following a collapse-able text that if you click it, then
you reveal it", with "a sub-drop down window" inside it) is **`<details class="human-fold">`**,
which **`house.js` opens on a measured height exactly as a part** (the part's opening was made one
function, `measured`, for both); a fold inside a fold stands in on a hairline. Its numbered points
are `<ol class="human-list">` (the fifth carries on with `start="5"`), and the line they asked to
have drawn is `<hr class="human-rule">`. Any house can use all three.

## 2026-10-11 — Om gentler and quicker, Outsider's door, Lost Tribe's leaves, the fragrances not smelled

The owner: "for the page of om parfums, i want the fracturing to not be scroll dependent, and i
want it to be soemthing that is less severe. when hovered, the fracturing returns to normal
permanently. also please smooth the om parfums page out, it slows down the laptop A LOT!
additionally, i want less random polygons forming with it, and rather more of the idea of grand
stuff and merging in the animation on SD houses. for outsider, remove the merginig motifs and I
want you to add a door that is slightly ajar, with a small ught coming from that door. that is to
be the main motif; similarly to les abstraits closet. follow the same theme when you enter the
house part too pleas. lost tribe is quite good; but i want the falling leaves to exist on the
actual page too. when they fall behind the text, let them be de-emphasized; similarly to
ataraxia's beams of light. make the birds more frequent in lost tribes page too (not the SD
animation) also, at the bottom of each of these three houses (in their respective pages), i want
you to find the fragrances NOT smelled, and then add them in a sentence".

### Om: cracked, not thrown apart — and mended by the hand

- **Less severe.** The page opens **cracked** as a pane is: about seventeen large shards (eight on a
  phone) radiating from a point a little above the window's middle (`SHARD_RINGS_WIDE`,
  `SHARD_RINGS_NARROW`), each standing a few pixels off its place, a degree or two out of true and
  a little smaller, drifting slightly, its edges gold. None is turned over and none falls back into
  a tunnel; on a phone the offsets are half again. Through the cracks, the void — โอม in specks,
  fainter than it was, and a ring throwing sparks.
- **Not scroll dependent.** Nothing listens to the wheel or a finger's scroll any more: the page is
  held while it is cracked (it was "one click, a key or **the wheel**"), and a test turns the wheel
  and finds the page still cracked and unscrolled.
- **Hovered, it mends for good.** The hand moving over the page (four pixels of real movement, not
  the single event a browser sends when a page opens under a still pointer — `MOVE_PX`) brings the
  shards home **in a wave from where the hand is**, the nearest first (`MEND_SPREAD`), each seam
  flashing gold as it meets. A click, a tap or a key mends it too; a phone mends by itself after
  `AUTO_MS`, as before. The hint says *Hover to bring it together*.

### Om: quicker

Measured at 1440 × 900, at a screen's two pixels to a point, frames a second on the test machine:

| | before | now |
|---|---|---|
| whole, the armillary behind the writing | 16 | 55 |
| cracked | 8 | 26 |

- **The mask was the cost.** Every frame painted a soft mask over the whole window to quiet the
  drawing over the column (`destination-in`), which reads and writes every pixel; without it the
  same drawing ran at 58. A mask in the stylesheet was tried and cost about forty frames of the
  sixty; a gradient on each stroke cost about thirty-six.
- **THE PEN** is what does it now: every hairline is cut into pieces no wider than 36px, each piece
  sorted by where it stands across the window into one of six levels of quiet (`LEVELS`, `PIECE`),
  and each level stroked once, in a plain colour; every speck is drawn at the quiet of where it
  stands (`quietAt`). The quiet is worked out again only when it changes (`quietStops`).
- **The shards.** Each copy of the page is **cut down to what the window shows** (`trim`: whatever
  of the page starts below the window is taken out of the copy) — it was the whole page, forty times
  over; **fewer shards**; **flat** movement (`translate`, `rotate`, `scale`) in place of turning in
  three dimensions, which a browser composites far more cheaply; and a shard's strength written only
  when it changes. The cracked page's 26 is a machine with no graphics card drawing in software; a
  laptop's own graphics card composites the shards far faster.

### Om on the Houses view: grand things merging

"less random polygons ... more of the idea of grand stuff and merging": the drifting shards are
gone (`shard`). **A grand figure merging** (`omMerge`) — a mandala of circles, ticks, twelve lotus
petals, interlocking triangles and a point at its middle, broken into six to eight wedges round a
middle piece; each wedge slides home along its own middle line, turning into place, its broken
edges flashing gold as it meets the next, and once whole a glint goes round it and specks orbit it,
for ten seconds or so. **Two rings merging into one** (`omRing`), throwing sparks as they meet. And
**โอม tracing itself in**, as before (`omWord`). `motifs.js`, `HOUSES.om`.

### Outsider: the door ajar

`outsider.js`, its own file now (`om.js` draws Om alone). **A door standing slightly ajar**, in the
left margin on the floor of the window, as Les Abstraits' armoire stands: plain geometry in ivory
hairlines with a speck at each joint — the architrave, its head moulding, a block at the foot of
each jamb, the threshold, the floor line run out either side — **drawn up from the floor** as the
page opens (`BUILD`, 2.2 s), every line growing from its lower end. The door is hinged on the left
and swung a little way into the room behind (`AJAR`), so it is seen narrowed, its four panels
with it, its knob near the open edge. **The light** comes up once it stands (`LIGHT_IN`): a sliver
of pale light the height of the opening through the gap, glowing in the house's green — the light
in its own photographs — a thin line of it under the door and a wedge of it across the floor in
front, breathing a little as a lamp in another room does; **dust** drifts in it (`MOTES`). The hand
near it opens it a few degrees more, and the light with it (`AJAR_HAND`).

It stands **clear of the scale** down the side, beside it or under it, measured as the armoire's
is; on a window with no margins it stands small and faint at the left edge. Over the writing what
reaches into it is drawn quiet, piece by piece — never a mask over the window (`quiet`). With
reduced motion it simply stands, ajar, the light steady.

**Removed**, at the owner's word ("remove the merginig motifs"): the reflected **twin** drifting
into register, the **echo** on the name (`outsider-echo` in `style.css`), and Outsider's motifs on
the Houses view (`outsiderMark`, `outsiderRing`). On the Houses view its motif is **the same door**
(`door`), drawn up on the left in darker inks, its light coming up after it, standing until the
house is left.

### Lost Tribe: leaves on the page, and more birds

- **The leaves** (`LEAVES`, fourteen; `fallingLeaf`): falling the height of the window, turning
  over and swaying as the Houses view's do, pushed aside and turned by the hand — and **quiet over
  the writing, as Ataraxia's bands are** (`LEAF_QUIET`): they pass behind the words and do not
  show strongly while they do, eased in at the column's edges.
- **The flock** crosses every three and a half to seven seconds (`FLOCK_EVERY`; it was nine to
  eighteen), and up to two at once (`FLOCKS`). The Houses view's flock is as it was, as asked.

### The fragrances not smelled yet

At the foot of each house, a sentence of the house's other fragrances, as Lost Tribe's list already
was (`.human-unsmelled`, its sources under it in `.human-unsmelled-from`):

- **Om Parfums** — twenty-six, from the house's own site and Parfumo: *Not smelled yet: Aftermath,
  Babylon, … and Wrath.* **Smoke Oud's attars are left out**, because which Smoke Oud was smelled is
  not known; and so are names that came up once in a search and could not be placed as Om's
  (Golden Wings, Kingpin, Sauron, Taiwan Oud, Pink Moods, Patchouli).
- **Outsider Parfums** — Parfumo counts seven, the five on the page and **Bananaccino and Sweet
  Tooth**.
- **Lost Tribe** — its list gained ten (Blu, Dubai, Easter Egg, Electric Bloom, Lola's Lemonana,
  Parc Florale, Prince of Persia, Red YaYo (Rose Edition), Sunny Nights, The Hamptons), eighty-eight
  in all, with Parfumo named beside the house. Left out as uncertain: Rose & Musk, Santal & Musk,
  Presidential Papua Oud, Yuan Yang.

All of it was read through searches: the houses' sites and Fragrantica cannot be opened from this
container (its network policy refuses them), so a list may be missing a name or two.

## 2026-10-11, last — Om read through cracked glass, the rings, the door in the dark, the birds

The owner: "lets focus on the two circles that converge together while rotating in 3D; i want you
to make copies of those and focus on that. make the circles unique every time thet generate. fix
the door; the door graphics are really weird. give it physics, make the light actual light, and
darken the screen accordingly please. Make this minimalistically realistic (with particles and
geometry again. why when you click the birds they disappear and restart? dont do that? animate
them the same way as inside the page please. ... i like the hexagon cursor, but i want the breaking
apart of the page to be reversible when you hover away. I also want the hexagon to be the thing
that affects everything behind it; i want it to be larger, and everything unbreaks in the hexagon.
make the breaks different and less huge. i want them to be like fractured glass unfracturing when
hovered within the hexagon. the door in outsider parfums is perfect; i just want you to make it so
that it is less open and opens more when you scroll (but not entirely). ... make image 1 a dropdown
list ... i added the file for equatorial. Quintessentially amber in the fragrances SD page should
have a different colour." Asked how Om's page is to be read while it is cracked — whether reading
it mends it, or it is read cracked — they chose **cracked while reading**: the page scrolls with the
cracks over it, readable but slightly broken outside the hexagon, whole inside it, and opening a
fragrance mends it for good.

### Om: read through cracked glass

- **The glass** is fixed to the window, and the page scrolls under it. It is broken by **two blows**
  (`GLASS_BLOWS_WIDE`: one up and left of the middle, a smaller one low on the right; one in the
  middle on a phone), each a ring of pieces round where it struck, small near it and larger
  farther out — about fifty pieces, Voronoi cells (`cellOf`), where there were seventeen large
  shards. Each piece holds a copy of the **whole** page, moved as the page is scrolled, a pixel or
  few off its place (`GLASS_SHIFT`) and a fraction of a degree out of true (`GLASS_TURN`); its crack
  is a gold hairline, and **a glint** runs round one crack in four (`GLINT_*`). The page under it is
  the real one, held back (`opacity: 0`) and **pressed through the glass** (`.om-shards` takes no
  pointer); the scale down the side and its reading stand over the glass.
- **The hexagon** (`LENS`, 168px across where it was 92) shows the page **whole**: inside it the page
  itself, unbroken, on its own ground, with the drawing behind it as the whole page has it, and a
  gold rim round it (`.rim`). The pieces within a little over two of its radii **come home as it
  comes** (`GLASS_NEAR`), the nearer the more, and go back to their cracks as it goes — "reversible
  when you hover away". Nothing is mended for good by the hand.
- **Mended for good** by opening a fragrance or a dropdown: the press is **held** while the pieces
  come home, quickly, in a wave from it (`MEND_QUICK_MS`, `MEND_QUICK_SPREAD`), and **given back to
  the page once it is whole**, so the fragrance opens on the page made whole. (Let through at once,
  the fragrance opened under copies of the page as it was, and a ghost of the shut list faded over
  it.) A key reaching into the page mends it too (a keyboard cannot hover); a phone mends by itself
  after `AUTO_MS`, as before. The hint says *Hover: the hexagon mends the glass*.
- **The copies are laid out at the page's own width** — the window's less its scrollbar
  (`page.clientWidth`); the root reported the whole window, since its scrollbar's room is held open,
  and the copies stood 8px right of the page until they were.

**As quick as the whole page.** Frames a second at 1440 × 900, two pixels to a point, on the test
machine (no graphics card), the page still / the hand moving / scrolling:

| | still | hand | scrolling |
|---|---|---|---|
| whole | 38–40 | 27–32 | 22 |
| cracked, the first way it was built | 11 | 10 | 9 |
| cracked, now | 39 | 26 | 13–15 |

What held it at eleven was not the drawing or the copies but **layers**: a piece cut to its shape
on a layer of its own is a mask the browser lays again every frame, and every piece was one — by
`will-change` and by being moved in three dimensions (`translate3d`). Nothing in the glass is a
layer of its own now but the glints, which are small; the cracks are drawn in each piece once, and
the glints moved over them (`placeGlints`). Scrolling is the one thing still dearer cracked, since
every piece is painted again as the page moves under it; on a laptop's graphics card that is far
quicker than here.

### Om on the Houses view: the rings, several and each its own

`omMerge` (the grand figure) is gone; **`omRing`** is the motif, **up to four at once**
(`most: 4`, two to begin with), and each is **two or three circles in three dimensions** — each on
its own tilted plane, turning about its own axis — **closing in on one another and becoming one**
(their planes turned together by `slerp`, their sizes and centres eased to one over
`RING_MEET_MS`), seen in perspective (`RING_FOCAL`), the far half of each fainter. **Every circle is
drawn its own way** (`ringStyle`): its line solid, dashed, dotted or none; ticked or not, and how
finely; beads round it or not; a second line just inside it or not; marks at its quarters or
thirds or not; a gold of its own (`OM_GOLDS`), its own thickness and its own turn — and each motif
its own size, number of circles and speed; sparks as they meet. `HouseMotifs.rings()`
says what each is, for the test.

### Outsider on the Houses view: the door in the dark

"give it physics, make the light actual light, and darken the screen accordingly": the room goes
dark as the door comes (`NIGHT`, 0.93, over `NIGHT_MS`), done through the canvas's own background
rather than a fill over the window; the view's words turn light while it is (`sheet-night` on the
body, `dark-surface` on the stage, for the cursor). The door is drawn up from the floor
(`DOOR_BUILD`), then **pushed open** and swings on its hinge on **a damped spring** (`DOOR_SPRING`,
`DOOR_DAMP`) to rest a little open (`DOOR_REST`), stirred by drafts and opening to the hand at its
edge (`DOOR_HAND`), in perspective (`DOOR_FOCAL`). **The light** is a lamp in the room behind: rays
through the gap that widen and narrow with it, a pool thrown on the floor from the lamp's place, a
line under the door, the wall beside the gap lit, and **dust lit only where it is inside the beam**
(`BEAM_DUST`, `inBeam`). `HouseMotifs.doors()` for the test. It costs the view a little: about 31
frames a second on the test machine with it, against 41–43 without.

### Lost Tribe: the birds, and a press that let the house go

"why when you click the birds they disappear and restart?": a press on the view, anywhere off a
house, counted as **a drag** for the moment it was held, which let the house at the front go — and
its motifs, the birds among them, faded and came again. A press is not a drag now
(`contact-sheet.js`: `!(dragging && dragged)`). And the birds are **the page's**: a flock flying on
its own, each bird turning from the hand within `FLEE` and flapping faster as it does, as on
`houses/lost-tribe.html` (`flock` in `motifs.js`; `HouseMotifs.flocks()`).

### Outsider's page, Lost Tribe's list, Equatorial, Quintessentially Amber

- **Outsider's door** stands **less open** at the head of the page (`AJAR`, 0.16 radians) and swings
  further as the page is read, following the scroll (`AJAR_EASE`), to `AJAR_MOST` (0.64) at the foot
  — never all the way; the hand still opens it a little more. `data-open` on its canvas says how
  far.
- **Lost Tribe's fragrances not smelled** are a dropdown (`.human-unsmelled-fold`, a
  `.human-fold` with the count beside its name, its mark in the house's copper).
- **Equatorial** has its picture (`images/Lost Tribe/Equatorial.webp`), so every fragrance of the
  twelve houses has one.
- **Quintessentially Amber** was framed in black in the Fragrances view's boxes and cards: its
  picture is see-through, and see-through reads as black to the reading that finds a clean ground.
  A see-through picture is read **on white paper** now, in `fragrance-line.js` and `chamber.js`
  alike, so its frame is white.

## How to test it

`npm test -- tests/om-and-the-tribe.spec.js`: Om **behind fine cracked glass and read through it**
(more than thirty pieces, a press going through to the page, the page scrolling and the glass
staying), **the hexagon showing it whole** and the glass cracking again when it leaves, **opening a
fragrance mending it** with the fragrance opening only once it is whole, the copies laid out at the
page's own width and landing on it exactly, a key mending it and the hand or a click on nothing
not, **Om quick to draw** (no mask over the window, no piece on a layer of its own, over 24 frames a
second cracked and 30 whole), a phone's coming together by itself, never with reduced motion, at one fragrance, with `?om=whole` or without its script; โอม
from the three letters; the two dropdowns and the line; the owner's words with the agreed
corrections and Xocolate Crotch's stages; **Outsider's door** (outsider.js and not om.js, no echo,
light on the left and nothing on the right, some of it green) **and its opening with the scroll**
(a little at the top, wider down the page, never past 0.66); Lost Tribe's field notes, its one
line of names **in a dropdown** and the ten new ones, **Equatorial's picture**, **its leaves and flocks** (quiet over the column); **the
fragrances not smelled** on Om and Outsider; the cropped picture; **the shards and Outsider's
merging motifs gone** (and `omMerge` with them); **Om's rings** on the Houses view (several at
once, each drawn its own way), **Outsider's door in the dark** (the room darkened and its words
light, the door swinging, its light through the gap), **Lost Tribe's birds** staying when the view
is pressed and turning from the hand; and each new house's motifs at the front of the Houses view
(Om's `omRing`, Outsider's `door`). Quintessentially Amber's white frame is in
`fragrance-line.spec.js`. The spec turns Playwright's trace off: recording it stalls the
heavier pages. The house lists (twelve frames, the chain both ways, the return buttons, the subtitles in
title case, the rank on every newer house) are in `houses.spec.js` and `contact-sheet.spec.js`;
the phone's no-sideways-scroll list in `mobile.spec.js` carries the three. By eye: open
`/houses/om-parfums.html`, move the hand, scroll, and open a fragrance; `/houses/outsider-parfums.html`, the hand near the door; `/houses/lost-tribe.html`,
moving the hand over a specimen; `/scent-descriptions/#house-10`, `#house-11`, `#house-12`.

## Known issues / TODO

- **The notes could not be checked against the pages themselves** (see above). If the owner turns
  the container's network access on for omparfumfragrances.com, losttribeperfumes.com and
  fragrantica.com, the lists can be read whole and checked.
- **Smoke Oud**: which Smoke Oud the owner smelled (the extrait in the picture, or an attar) would
  let its notes be found.
- **Lost Tribe's list of other fragrances** may be missing a few the house sells (see above).
- **Outsider's door** is a first answer, after Les Abstraits' armoire.
- **Om's glass while scrolling** draws at about two thirds of the whole page's frames on the test
  machine (every piece is painted again as the page moves under it); still, it is as quick as the
  whole page. If it stutters on a laptop, fewer rings in `GLASS_BLOWS_WIDE` is the knob.
- **Outsider's door in the dark on the Houses view** costs the view about a quarter of its frames on
  the test machine (31 against 41–43); `BEAM_DUST` and the rays are the knobs.
- **The lists of fragrances not smelled** (2026-10-11) were read through searches and may miss a
  name; the names left out as uncertain are listed above. **Smoke Oud** decides whether its attars
  belong in Om's sentence.
- ~~Les Abstraits' page draws at about 35 frames a second~~ — the same kind of full-window mask
  Om's was; smoothed the same day at the owner's word, 51–59 now (see [the newer houses](2026-09-21-the-newer-houses.md#2026-10-11--les-abstraits-quieted-only-where-the-armoire-stands)).
- Lost Tribe's design is a first answer, as the owner said it would be ("we will adapt later").

## Same round, other reports

- [The newer houses — Qimu's Bassist and Drummer written](2026-09-21-the-newer-houses.md#2026-10-10--bassist-and-drummer-written-and-a-fold-in-housejs)
- [Pineward — Pumpkivus smelled](2026-09-16-pineward.md#2026-10-10--pumpkivus-smelled-moved-into-the-numbered-parts)
- [The notes — three individual fragrances](2026-09-21-the-notes.md#2026-10-10--three-more-individual-fragrances-and-the-three-new-houses)
- [The chamber — Aetherialism, the eleventh favourite](2026-09-15-the-chamber.md#2026-10-10--aetherialism-the-eleventh-favourite)
- [The Note Library — 37 new notes](2026-09-26-the-test-page.md#2026-10-10--thirty-seven-new-notes-and-the-catalogues-address)
- [The site on a phone — Scent Descriptions' search on a row of its own](2026-09-21-the-site-on-a-phone.md#2026-10-10--scent-descriptions-search-on-a-row-of-its-own)

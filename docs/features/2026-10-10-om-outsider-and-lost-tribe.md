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

## 2026-10-11, the very last — Om's broken glass (a trial), a button to mend it, and Outsider's door on white

The owner: "ignore the making the darkening of the page for outsider, make it white and agree with
the theme in general. ... additionally, just as a test (so keep the code from the curernt version
in case i wanna revert it) but make the fractures differnet/ like broken glass more. Additionally,
put a button on the top right to fix the page." (And in the same message, Scent Descriptions at
three hundred houses and a thousand fragrances — [its own report](2026-10-11-scent-descriptions-at-scale.md).)

### Om: broken as glass breaks — a trial, the fine glass kept

- **`GLASS_STYLE`** says which glass the page is cracked with: **`"broken"`**, the trial, and what
  the page opens with; **`"fine"`** is the glass before it, kept whole. **`?glass=fine`** (or
  `?glass=broken`) on the address shows the other without changing anything, and `data-glass` on
  `<html>` says which is showing. To go back for good, `GLASS_STYLE = "fine"`; to keep the trial, the
  fine glass's blows (`GLASS_BLOWS_*`) and its branch in `buildShards` are what come out.
- **The broken pane** (`brokenPanes`, `BREAK_*`) is a web, as a struck pane breaks: from each blow,
  **radial cracks** (`spokes`: fifteen from the main blow, eight from the one low on the right,
  eleven on a phone), each wandering a little as it goes (`BREAK_WANDER`), and **concentric cracks**
  across them, straight from one radial crack to the next, closer together near the blow (`rings`);
  a stretch of a ring is not always cracked (`BREAK_RING_GAP`), which leaves the longest shards. So
  the pieces are **long wedges pointing at the blow**, and at the blow itself the glass is
  **crushed** into small pieces, two of them fallen out (`BREAK_HOLE`), the void showing through.
  Each blow's pieces are kept to its own side of a line between the two (`toward`, clipped by
  `clipBy`), and to the window. About sixty pieces at 1440 × 900 (the fine glass has about
  forty-five).
- **Each piece stands further out of true** (`BREAK_SHIFT`, `BREAK_TURN`; the crushed ones pushed in
  most), **catches the light its own way** (its sheen dim on most, bright on about one in six), and
  its crack is **a bright edge with a soft one beside it** — the glass's thickness — where the fine
  glass's is one gold hairline. A glint runs round one crack in three.
- **The blows stand clear of the title**: right of it on a wide window (`x: 0.63, y: 0.25`), in the
  gap under the subtitle on a phone. Struck on the title, the crushed glass took a letter out.
- **The hexagon eases a piece home by its nearest edge** (`distTo`, `BREAK_NEAR`), not by its middle
  as the fine glass's small pieces are: a long wedge's middle can stand far from the hand while the
  wedge runs right under it. `OmGlass.homeAt` reads the pieces a point is in (`inside`), and
  `OmGlass.style()` and `OmGlass.outlines()` say which glass and what shape, for the tests.
- **As quick to draw as the fine glass**: 40.7 frames a second still against the fine glass's 35.7
  on the test machine, and the same while scrolling.

### Om: a button to mend it

**Mend the glass**, boxed as the way back to the houses is, in the house's gold, at the **top right**
— where nothing else on the page stands — level with the Menu (`.om-mend`, made by `om.js` with the
glass). The glass takes no press, so the button stands on the page over it (z-index 20, under the
Menu's overlay). Pressed, the page mends **for good**, in a wave from the button across the window
(`mend`, at the ordinary pace), and the button goes. Reached with the keyboard it **waits to be
pressed** — the key that reaches anything else in the page mends it, but this one says what it does
(the `focusin` rule skips it); the focus goes to the page's heading once it has gone. On a phone it
is there for the moment before the glass comes together by itself. Never with `?om=whole`, reduced
motion or at a `#`, where there is no glass.

### Outsider on the Houses view: the door on white

**Nothing is darkened**: `NIGHT`, `NIGHT_MS`, the canvas's ground, `sheet-night` on the body and
`dark-surface` on the stage are gone from `motifs.js`, and the rules for `sheet-night` from
`style.css`. The door is the same door — in perspective, on its spring, pushed open, stirred by
drafts and opening to the hand, the lamp behind it — **drawn as the view draws everything**: the
frame in ink hairlines with a speck at each joint, as the armoire is; the leaf on the paper, in a
faint shade, its panels and knob in ink, its edge catching the light; and **the light in the house's
green laid on the paper** (`OUT_GREEN`, `OUT_PALE`, no `lighter`): the gap washed with it, palest at
its middle, a few fine rays, a pool across the floor towards you (a little shorter than it was), a
line under the door, the jamb and the lines near the gap tinged green, and the dust lit green only
in the beam. A motif darkening the whole view is no longer something a motif does.

**Found on the way**: the stylesheet's rules for the dark view had been written **into the middle
of** the rule that steps the Houses view back when a house is pressed, which stopped working for
that round. With the dark view gone it is whole again; see [Scent Descriptions at
scale](2026-10-11-scent-descriptions-at-scale.md#found-on-the-way-the-page-stopped-stepping-back).

## 2026-10-12 — Outsider's door calmer, a window beside it, one light through both

The owner, of the Houses view: "please make the door less animated, more sobtle and do something
similar maybe with a window on the right side of the page. ake sure that the light sources agree
with one another. (in the hover animation in SD)".

- **One light** (`LIGHT` in `motifs.js`): a light outside, beyond the wall, high and to the
  **right**, far enough off that its rays are parallel — so the light through the door and through
  the window falls at one slant, in one green (`OUT_GREEN`, `OUT_PALE`), at one strength
  (`LIGHT_A`). It was a lamp close behind the door, its rays fanning from it. From the right,
  because a door hinged on the left and opened away leaves its gap on the right: from the left, the
  leaf stood between the light and the gap and none came through (worked out, and seen, before it
  was turned round). The gap the light finds runs from **the leaf's shadow** across the doorway
  (`shadowAt`) to the jamb, so it widens and narrows with the door.
- **The door, calmer**: shut, and then **let open slowly** — over `DOOR_OPEN_MS` (3.2 s) from
  `DOOR_OPEN_AT` — to rest a little ajar (`DOOR_REST`, 0.46 radians; it was 0.58), on a spring
  **damped just enough that it never swings past** (`DOOR_DAMP` = 2√`DOOR_SPRING`); it was pushed
  open past where it settled and swung back. A breath of a draft every nine to fifteen seconds; the
  hand near its edge gives it a touch more (`DOOR_HAND`, 0.08), and it settles back; its rays no
  longer flicker, its dust is fewer and slower, and all of it a little fainter.
- **A window on the right**, high in the same wall, clear of the way round (read off the page, its
  right edge before `.sheet-nav`'s left): a sash window in the frame's ink — its casing, the
  opening, the sill proud of it, two sashes meeting at the middle rail, two by two panes in each —
  drawn up from its sill as the door's frame is from the floor; its panes washed with the light,
  palest at the middle; **a shaft** of it thrown along the light into the room, fading as it comes,
  with a few fine rays in it; and dust lit only in it. None on a window narrower than 700px, where
  the door has the room to itself.
- **Seen from one place each, the same way**: each opening is drawn in perspective from an eye of
  its own, and the window's stands to it as the door's stands to the door's gap, so the two lights
  are seen falling at the same slant on the window — 96.0° and 96.2° at 1100, 1440 and 1920 wide
  (they were 74° and 65° while the window's eye stood in the middle of the room).
- **Drawn in front of the door where it crosses it**: the pool on the floor and the rays, which
  come out of the wall towards us, are drawn over the leaf, which stands beyond it.

`HouseMotifs.doors()` says, for the tests, the door's angle, where it rests and the most it is let
open to, the window's box, and the slant each opening's light falls at on the window (`slant`).

## How to test it

`npm test -- tests/om-and-the-tribe.spec.js`: Om **behind cracked glass and read through it**
(more than thirty pieces, a press going through to the page, the page scrolling and the glass
staying), **the hexagon showing it whole** and the glass cracking again when it leaves, **opening a
fragrance mending it** with the fragrance opening only once it is whole, the copies laid out at the
page's own width and landing on it exactly, a key mending it and the hand or a click on nothing
not, **the broken pane** (a web: its longer pieces more drawn out than the fine glass's, a dozen
or more meeting where it was struck — and `?glass=fine` the fine glass, its cells meeting nowhere
so), **the button in the top right** (there, pressable over the glass, waiting when the keyboard
reaches it, mending the page for good when pressed, and gone; on a phone clear of the Menu and gone
once the page comes together; none with `?om=whole`), **Om quick to draw** (no mask over the window, no piece on a layer of its own, over 24 frames a
second cracked and 30 whole), a phone's coming together by itself, never with reduced motion, at one fragrance, with `?om=whole` or without its script; โอม
from the three letters; the two dropdowns and the line; the owner's words with the agreed
corrections and Xocolate Crotch's stages; **Outsider's door** (outsider.js and not om.js, no echo,
light on the left and nothing on the right, some of it green) **and its opening with the scroll**
(a little at the top, wider down the page, never past 0.66); Lost Tribe's field notes, its one
line of names **in a dropdown** and the ten new ones, **Equatorial's picture**, **its leaves and flocks** (quiet over the column); **the
fragrances not smelled** on Om and Outsider; the cropped picture; **the shards and Outsider's
merging motifs gone** (and `omMerge` with them); **Om's rings** on the Houses view (several at
once, each drawn its own way), **Outsider's door and window on white** (no ground on the motifs, the
Menu in ink, nothing marked dark; the door let open to rest, never past it nor back; a window high on
the right, clear of the way round; the two lights at one slant, within four degrees; green through the
door and through the window, none across the middle of the room, the frames in ink), **Lost Tribe's birds** staying when the view
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
- ~~Outsider's door in the dark on the Houses view costs the view about a quarter of its frames~~ —
  the dark is gone (2026-10-11, the very last); the door on white draws without the lamp's light
  added to a darkened window.
- **Om's broken pane is a trial.** The owner chooses between it and the fine glass; whichever is
  not chosen comes out of `om.js` (its constants, its branch in `buildShards`, its part of the
  shard styles), and `?glass=` with it.
- **The lists of fragrances not smelled** (2026-10-11) were read through searches and may miss a
  name; the names left out as uncertain are listed above. **Smoke Oud** decides whether its attars
  belong in Om's sentence.
- ~~Les Abstraits' page draws at about 35 frames a second~~ — the same kind of full-window mask
  Om's was; smoothed the same day at the owner's word, 51–59 now (see [the newer houses](2026-09-21-the-newer-houses.md#2026-10-11--les-abstraits-quieted-only-where-the-armoire-stands)).
- Lost Tribe's design is a first answer, as the owner said it would be ("we will adapt later").

## 2026-10-12 — Outsider's door and Lost Tribe's field notes faint behind the words

**Outsider's door and its light** go faint behind the words on a phone and on a computer alike
(`Writing.hush` from nav.js, at the end of its frame, only round the door and its light, over a
wide soft edge, `feather: 48`, so the glow shows no seam), and **Lost Tribe's specimens, pollen,
leaves and birds** on a phone, speck by speck (`Writing.under`) — a third of what they were behind
writing, as they were in the gaps. Written up in [the house drawings faint behind the
words](2026-10-12-drawings-faint-behind-the-words.md).

## 2026-10-13 — Om broken in rings, nothing pressed mending it, a bigger hexagon

> okay then listen, for om parfums, whenever you click on anything, the glass gets fixed and it is
> buggy. fix that. Then i want you to actually make it less like glass and more so like just a very
> abstract break. Find a way to be on theme. When you click on the perfumes, the break should not be
> fixed. also make the hexagon a little bigger.

**Nothing pressed mends it.** Opening a fragrance mended the page for good until now — the press was
held while the pieces came home and given back once the page was whole — and a fold, any `toggle`,
and a key reaching into the page mended it too. That was needed because **each piece holds a copy of
the page**, and a fragrance opening on the page would have gone on showing shut in the pieces. Now
**the copies follow the page** (`followPage` in `om.js`): a `MutationObserver` on the page's own
`main`, credit and foot, and every change made to the page made to each copy as it happens — an
attribute (a fragrance's `open`, the measured height, fade and move `house.js` opens it with, a class)
set on the same element of each copy, found by where it stands (the same child of the same child,
`pathOf`, `inCopy`), so the opening runs in the pieces in step with the page; anything added or taken
away, or a text changed, copied over whole (`scrub`, no ids or tab stops). So a fragrance, a fold, the
notes' window, a link or a key does what it does at once, and **the page stays broken**. What mends it
is the button, **Mend the break** (it said *Mend the glass*), first in the page's order now so the
keyboard comes to it first; and the hexagon, while it is there. A phone still mends by itself after a
moment, and a window changing size still mends it at once.

**Not glass: the rings** (`GLASS_STYLE = "rings"`, `ringPanes`, `RING_*`). On theme: Om is the sound
the house is named for, the first vibration, and the page is broken as a mandala is drawn round
**โอม** at the middle of the window, as that sound would ring out — a disc round the word and bands
out to past the corners (`RING_RADII`, shares of half the window's diagonal), each band cut into
petals (`RING_PARTS`: 6, 8, 12, 12, 16 — the lotus's and the star's numbers; fewer on a phone), every
other band's cuts a half step round from the band inside it. **Each band is turned a little out of
true about the middle**, every piece of it by the same angle and the next band the other way, as the
armillary's rings turn — the page out of tune with itself, `RING_SHIFT` (1.5px, up to a third more) at
the band's middle — and each petal stands a pixel in or out of its band (`RING_LIFT`). The seams are
the house's gold hairlines and nothing else: **no sheen, no glints, no thick edge**, only every other
band a faint warmth of gold (`.rings .sheen`), so they read as rings. It was tried at 3.4px first, and
a word across two bands jumped nine pixels; at 1.5 the writing reads across every seam. The hint says
*Hover: the hexagon makes it whole*. The broken pane is kept behind `?glass=broken` and the fine glass
behind `?glass=fine`.

**The hexagon a little bigger**: `LENS` 196px from its middle to a corner (168).

Tested in `tests/om-and-the-tribe.spec.js`:

- **`a fragrance opened under Om's break opens at once, in the pieces too, and the page stays
  broken`** replaces *opening a fragrance under Om's glass mends it*: shut in every copy to begin with
  (`OmGlass.openIn`), opened at once on the page and in every copy, shut again in every copy, and
  `data-om` never changing from `pieces` — no gathering, no mending.
- **`Om's break is mended only by its button: not by a key, the hand or a click`** replaces *mended by
  a key*: the keyboard's first stop is the button, and Tab after Tab mends nothing.
- **`Om opens broken in rings round its middle, each band turned a little out of true`** (new): the
  style is `rings`; every corner not on the window's edge stands on one of a few circles round the
  middle; every piece of a band turned by the same angle (`OmGlass.turns`), each band the other way
  from the last, by under three and a half pixels at its middle; no glints.
- **`the broken pane is a web from where it was struck, and the fine glass is kept, behind the
  address`** reads the broken pane at `?glass=broken`. **`Om's pieces are laid out as the page is, and
  land on it exactly`** mends by the button. **`Om's button in the top right mends the break for
  good`** reads *Mend the break*.

**Still open**: the rings are a first answer to "find a way to be on theme"; the broken pane and the
fine glass stay behind `?glass=` until the owner says which (if any) to keep.

## 2026-10-13, later — Om split in two, and OM brings it together (a trial)

> yk what actually; i want you to change the breaking thing entirely (at least as a test). i want us
> to make it so that when you load the page, the page itself is split into two (i mean that not in a
> template way, rather if you take the page as it is now (minus the fracturing) and run a line down
> the center, then take everything on the left and push it further left, and everything on the right
> of the line and push it further right, creating an empty space in the middle, then that is waht I
> want). I then want you to make it so that in this middle awkward ine, there is a button (instead of
> top left), saying "OM", which if clicked, will with a shaky animation converge the two sides of the
> page into one. the middle should be themed of breaks. They should be random polygons of broken
> stuff. and then when you converge the two sides with the buttons, the breaks will kind of disappear
> behind it. as faded behind text.

**The split** (`GLASS_STYLE = "split"`, `SPLIT_*`, `gapOf`, `drawGap` in `om.js`) is the page opening
now, as a trial; **the rings, the broken pane and the fine glass are kept whole** behind
`?glass=rings`, `?glass=broken` and `?glass=fine`, and `data-glass` on `<html>` says which is showing.
It is built the way the rings and the glass are: **two pieces, each holding a copy of the whole page**,
cut down the middle of the window — the left half pushed further left and the right half further
right, each by `SPLIT_PUSH` of the page's width (7%: about 100px on a laptop, a gap of 200; 24px at
the least and 120 at the most, so 27px on a phone), so nothing is cut out of the page: what stood
either side of the middle line stands either side of the gap, and only the outer margins go off the
window's edges. The page scrolls under it as before, and the copies follow every change to the page
(`followPage`), so a fragrance or a fold opens in both halves.

**The gap is themed of breaks**: **random polygons of broken stuff** (`GAP_SHARDS`, about one to every
1,300 square pixels — 138 on a laptop, 35 on a phone), three- to six-cornered, most small and a few
large, some filled faintly, a few brighter, each turning very slowly, and **two cracks** wandering
down the gap — in the house's gold on its own ground, drawn on the page's canvas behind the writing.
Each half's cut edge is a gold hairline.

**OM** (`.om-join`, in place of *Mend the break* at the top right) is a hexagon in the house's gold
with OM in it, fixed **in the middle of the gap**, half way down the window, first in the page's order
so the keyboard comes to it first. Pressed, **the halves come together over `SPLIT_MS` (1.7s),
shaking** as they come — a quick tremor across and a little up and down and round (`SHAKE`, 9px at its
hardest, `SHAKE_HZ`), hardest a little after they set off and dying away as they meet — their cut
edges flashing gold as they land, and then the page is whole. **The broken pieces do not go**: as the
halves close they are drawn in towards the seam, a little smaller, and **stay faint behind the
writing** (`GAP_FAINT`, 16% of themselves) — "the breaks will kind of disappear behind it. as faded
behind text".

**A press lands on what is seen.** Each half shows the page up to 100px off where the page really is,
and a press goes through the pieces to the page underneath — so a press on a fragrance would have
reached whatever stands under that point on the real page: the wrong line, or nothing. While the page
is split, a press on the page is taken to what is seen there (a `click` listener on the window, before
anything else): on a half, the page that half shows at that point (`elementFromPoint` a push the other
way, and that pressed); in the gap, nothing. The chrome over it — OM, the Menu, the scale, a notes
window and its veil — is pressed as it is, and a press from the keyboard, which has no point, is left
be. Once whole, nothing is changed.

**No hexagon while it is split**, and no word about one: the hexagon showed the page whole through the
pieces, and the split is brought together by OM alone. **On a phone it waits for OM** too — the rings
and the glass mend by themselves after a moment there, and the split does not, since OM is the whole
of it; it fits the phone's 55px gap, and nothing scrolls sideways. A window changing size, reduced
motion, an address at one fragrance and `?om=whole` are as before: whole at once.

Tested in `tests/om-and-the-tribe.spec.js`:

- **`Om opens split in two, OM in the gap; a fragrance opens where it is seen, and OM brings it
  together, shaking`** (new): the style is `split`; two halves at minus and plus the push, over 60px;
  over forty broken pieces in the gap, drawn whole; OM there, its text *OM*, in the middle and inside
  the gap; a press in the gap opens nothing; a press on the first fragrance where its half shows it
  opens it, in both halves, and the page stays split; OM pressed, the left half turns back and forth on
  its way (two turns at least, read frame by frame), the page whole, OM gone, the fragrance still open,
  and the broken pieces drawn at under 30% and over nothing.
- **`Om's split waits for OM on a phone, OM clear of the Menu, nothing scrolling sideways`** (new):
  still split well past the moment the rings mend by themselves; OM clear of the Menu; the page 390px
  wide; a tap on OM, and whole.
- The rings' and the glass's own tests read them at `?glass=rings` (the hexagon, a fragrance opened
  under the break, the rings themselves, *Mend the break*, a phone mending by itself); *Om opens
  broken and is read through it* asks for two pieces at least rather than thirty.

**Still open**: a trial. Whichever of the split, the rings, the broken pane and the fine glass the
owner keeps, the others come out of the code.

## 2026-10-13, last — the split widened, the drawing split with it, gliding together and shaking as it meets

> okay, good but i wnt you to widen the gap by a lot; i want it to be the majority. also pressing
> keyboard buttons stops the split; so remove that. on the phone it acts weird so fix that. make the
> shaking at the end of the transition rather at the end; and make the transition involve the
> background. I want it as smooth as possible.

**The gap the most of the page.** Each half is pushed out `SPLIT_PUSH` = 30% of the page's width
(it was 7%, at most 120px), so the gap is three fifths of it — 864px on a laptop, 234 on a phone —
and each half shows a fifth of the window at its edge, the page's own writing cut by the line down
its middle. The broken pieces are as dense as before for the wider gap (`GAP_SHARDS`, about 450 on a
laptop, 160 on a phone), the largest larger the wider it is, with three cracks.

**What brought it together that was not OM.** Tried key by key: the keyboard's first stop was OM, so
Tab and then Enter or Space pressed it; and **a window changing size brought it together at once** —
a page zoomed with Ctrl or ⌘ and + or −, and on a phone the address bar sliding away as the page is
scrolled, which changes the window's height. Now OM is no stop of the keyboard's (`tabIndex = -1`),
a press on it with no point to it — a key — is let go (`e.detail`), and a change of size lays the
halves out again at the new width (`layoutSplit`); a change of height alone moves nothing, the broken
pieces scattered down the whole of the screen's height to begin with. Only a press on OM brings it
together. (Tab still goes through the page's own links, as it should; Enter on one follows it.)

**On a phone.** Besides its bar bringing it together, the halves were laid over the window and moved
by the script every frame, a frame behind the finger, so the writing trembled as it was scrolled. The
halves are now **in the page** — `.om-split`, laid at the top of the document, each half a copy of
the whole page cut to its half (twice the half's width, the right one drawn back by a half) — so they
scroll as the page does, at once, nothing moved by hand. A tap is taken to what is seen there, as a
click is, and no grey box flashes where a tap really lands (`-webkit-tap-highlight-color`). The
copies ask for the page's stylesheet by its version (`sheetHref`; they asked for it plain, which a
browser could answer with an older one it kept), and are hidden until it is in.

**The background in the transition.** The drawing behind — the armillary, the yantra, the large
**โอม** — is **split with the page**: drawn whole on the left half's canvas and the right half's laid
from it every frame (one copy of half the window), the two canvases fixed to the window in
`.om-split-sky` and pushed apart exactly as the writing is, so the โอม stands in two halves either side
of the gap and comes together with the page, shrinking to its quiet size as it comes. The drawing's
halves carry **the page's own ground**, so the halves read as the page and the gap between them as
the void; they reach `SKY_BLEED` past the window's edges, so the shake never shows the void at one.
The broken pieces lie whole in the gap, on the void; the halves close over them, and they come in
faint in the drawing behind the writing as the halves meet (`GAP_FAINT`), where they stay.

**As smooth as possible.** OM pressed, the way is worked out at sixty steps a second and handed to
the browser whole (`joinSplit`, an animation of each half's transform, all four on one start time),
so a busy frame cannot stutter it, and the drawing's halves and the writing's move together —
measured within a hundredth of a pixel of each other every frame, at sixty frames a second. They
glide together over `SPLIT_MS` (1.9s), gently at both ends (a quintic, at rest where it sets off and
where it arrives).

**The shake at the end.** It comes up only over the last fifth of the way (`SHAKE_FROM`), is hardest
as the halves meet, and dies away after (`SHAKE_TAU`), still by `SHAKE_TAIL` (0.7s): the whole page
shaking as one — the halves and the drawing alike — a little across and less up and down, a damped
tremor rather than noise (`SHAKE` 9px, two thirds on a phone; `SHAKE_HZ` 7.5). The seams flash gold
as they meet and go. It shook hardest just after the halves set off until now. Then the page is
shown, the drawing is the page's own canvas's again from that frame, and the halves' copies fade off
it.

**No hexagon at the hand while split**: it drew the drawing whole in the middle of the gap. It is
there once the page is whole, as before.

The split's own code is apart from the glass and the rings' now (`buildSplit`, `layoutSplit`,
`splitAt`, `placeSplit`, `joinSplit`); `buildShards` is the rings' and the glass's alone.

Tested in `tests/om-and-the-tribe.spec.js`:

- **`Om opens split in two, the gap the most of it, OM in it; a fragrance opens where it is seen, and
  OM brings it together, shaking as it meets`** (replacing the split's test): the gap more than half
  the page; nothing widening it; the drawing's halves pushed exactly as the page's; OM in the middle
  of the gap; a press in the gap opens nothing and a press where the first fragrance is seen opens it,
  in both halves; OM pressed, the drawing in step with the writing within a pixel and a half every
  frame, the left half turning back and forth at least twice — and not before 1.2s, so it glides
  until then — whole, the drawing's canvases gone, the fragrance still open, the pieces faint.
- **`Om's split is brought together by nothing but a press on OM: no key, no change of size`** (new):
  Tab does not come to OM; Space, the arrows, Page Down, Home, Escape, a letter, and Enter and Space
  on OM itself leave it split; two changes of size leave it split, laid out again at 30% of the new
  width, OM in the middle again.
- **`Om's split on a phone: it scrolls with the page, waits for OM through the bar coming and going,
  and nothing scrolls sideways`** (replacing the phone's split test): the halves move with the page at
  once when it is scrolled; the window's height changed twice and it is still split.
- *Om's break is mended only by its button* reads the rings now (`?glass=rings`), the split's own keys
  being the test above; the tests that the page is whole at once (reduced motion, an address at one
  fragrance, `?om=whole`) look for the split's halves too.

**Still open**: a trial, as before — whichever of the split, the rings, the broken pane and the fine
glass the owner keeps, the others come out of the code. A keyboard alone cannot bring the split
together now, at the owner's word; the page is read and its fragrances opened as it is.

## 2026-10-13, the very last — the gap as it was, its edges broken, answering the scroll and the hand; an opening, and a smoother closing with a wave

> okay, so the space is not bad but the earlier version was better. I want it to react to scrolling,
> and not be so regular; where the lines on either side can be slightly corrugated. I want the
> particles in the back of the split to move and react. ADDitionally!! please add an animation to
> when you open the page for OM parfum! make the closing animation smoother; and make it flash
> (subtly, like the wave in the note library combinations). the shaking should actually also start
> from the beggining of the animation too.

**The gap as it was the first time.** `SPLIT_PUSH` is 7% of the page's width again, each way, between
`PUSH_LEAST` (24px) and `PUSH_MOST` (120px): 100px on a laptop, a gap of 200; 27px on a phone. The
drawing behind stays split with the page, as the round before made it.

**Its edges broken, not straight** (`THE EDGES`, `edgesFor`, `growEdges`): the page broke along one
line, and **both halves are cut along it**, so they fit back together exactly, as broken things do —
the left keeps what is left of the line, the right what is right of it. The line wanders a little
either way (`EDGE_WANDER`, 6px, three slow waves and a random walk), and is **corrugated**: a tooth
one way and then the other every 6 to 20px (`EDGE_PITCH`), up to 3px deep (`EDGE_TOOTH`), one in
eight two or three times as deep (`EDGE_JOG`); all of it less on a phone's narrower gap. Its points
are laid down the whole page and on as the page grows (a fragrance opened at its foot). A first try
gave each half its own edge, the gap wider and narrower along its length — and where the halves met,
the writing stood twice over in the strip between the two edges and read bolder there; one line for
both put that right.
- **The writing** is cut along the line by a `clip-path` on each half's copy of the page (`clipOf`,
  `setClips`) — **on the copy, not on the half that moves**: on the moving half it was a mask laid
  again every frame it moved, and held the closing at 27 to 38 frames a second on the test machine;
  painted into the copy once, it moves with it for nothing (55 to 59). Each half's box is only as
  wide as its side and its edge's reach (`sizeHalves`), so neither is drawn, or laid over the
  other, where it is not seen — full width, they were twice the area to draw.
- **The drawing's halves** carry the page's ground in a solid block (`.om-sky-ground`) but for the
  strip the edge stands in, which their canvases carry, cut along the line where the page now stands
  each frame (`cutEdge`); the cut and the gold along it are drawn once, a band of the page at a time
  (`edgeBand`, `EDGE_BAND` 1024px), and laid down as copies. (Without the solid block, the window
  behind was drawn for nothing under the drawing and the frames fell by a third while the page was
  scrolled — on the test machine, which draws everything without a graphics card; drawn as a
  graphics card draws, the new page is as quick as the round before's.)

**The scroll** (`THE SCROLL`) — the owner, asked whether the gap should open as the page is scrolled
or as it is read down: "Neither; the width should remain the same, rather the geometry inside should
react" (2026-10-14). **The gap keeps its width**; what is in it answers the scroll, through one
reading of how fast the page is going (`stir`, 0 to 1, most of the way at `SCROLL_FULL`, 900px a
second; up quickly and settling slowly): the pieces and specks **trail behind the scroll and catch it
up**, the nearer ones the further (`SCROLL_LAG`, up to `SCROLL_LAG_MOST` 46px), and the faster it goes
the more they **tumble** (`SCROLL_TUMBLE`), **spread apart** (`SCROLL_SPREAD`) and **brighten**
(`SCROLL_LIT`), the cracks **bow** (`SCROLL_FLEX`) and the specks streak — all of it settling as the
page comes to rest. (For the first try of this round the gap itself opened as the page was scrolled,
up to 60% wider, with `?gap=read` opening it as the page was read down instead; both came out at the
owner's word.)

**The pieces in the gap move and react** (`gapOf`, `drifter`, `moveGap`, `drawGap`): the broken pieces
(`GAP_SHARDS`, about 150 on a laptop) and, new, **specks** (`GAP_MOTES`, about 330) each lie at a depth
of their own — how much of the scroll carries them — so the gap's contents slide past at different
speeds as the page is scrolled, wrapping round a span a little taller than the screen; each drifts,
sways and turns on a clock of its own, the pieces tumbling faster while the page is scrolled and the
specks drawn out into short streaks along the way it is going (and see **the scroll**, above). **The hand pushes them off it** within
`GAP_REACH` (120px), lighting them as it passes, and they spring back after; a finger's touch does it
for a moment on a phone. The three cracks are carried at a depth of their own too. They reach as far
as the gap does and, once it has closed, a little either side of the seam, where they stay faint
behind the writing.

**The opening** (`THE OPENING`, `openPath`, `openSplit`, `finishOpen`): the page comes in whole — the
halves together, the drawing whole and quiet — and `OPEN_HOLD` (650ms) after its copies are in, **a
crack runs down it** along the line, bright, a light at its tip (`OPEN_CRACK`, 560ms); as it nears the
foot the halves **break apart**, gently at both ends (`OPEN_PART`, 1.5s), shaking from the crack's
first moment and settling as they come to rest (`OPEN_SHAKE`), each half on its own; the broken
pieces spread out into the gap with them and the large โอม grows in the drawing; **OM comes up last**,
and cannot be pressed until it has (`pointer-events` on `.om-mend` until `.shown`). Its way is handed
to the browser whole, as the closing's is (`runPath`).

**The closing, smoother** (`THE CLOSING`, `joinPath`): from wherever the scroll has left the halves,
over `SPLIT_MS` (2.3s; it was 1.9), gently at both ends — over 100px rather than 432, so far slower
and softer than the round before. **The shake from the first moment** (`SHAKE_ON_WAY`, a third of it
on the way, growing): each half trembling on its own on the way and the two as one as they meet,
hardest then (`SHAKE`, 8px), dying away (`SHAKE_TAU`) and still by `SHAKE_TAIL` (0.8s) — a rumble at
`SHAKE_HZ` 6 rather than the buzz of 7.5. Measured frame by frame, the drawing's halves stood within a
hundredth of a pixel of the writing's every frame.

**The flash — the wave** (`THE WAVE`, `waveAt`, `waveLit`, `washOver`): as the halves meet, a band of
light runs out from the seam to both edges of the window over `WAVE_MS` (1.15s), quick at first and
slowing, as the Note Library's pulse runs out through the network when combinations begin: every
speck of the drawing it passes is lit (`WAVE_LIT`), and the faintest gold (7.5%) washes over the
writing with it — two bands on the window moved by the browser's own clock (`.om-wave`). The seam's
gold flashes as they meet and goes, as before.

**Then whole**, as before: the page shown under the copies exactly where they stand — measured, every
bright pixel of the writing afterwards was lit just before — the drawing the page's own canvas's from
that frame, and the copies faded off it.

The split's code: `buildSplit`, `layoutSplit`, `sizeHalves`, `setClips`, `cutEdge`, `edgeBand`,
`openSplit`, `finishOpen`, `runPath`, `joinSplit`, `splitState` (with `restAt`, `openPath`,
`joinPath`, `tremble`), `placeSplit`, `splitOffsets`, `sideAt`; `splitAt` is gone into those.

Tested in `tests/om-and-the-tribe.spec.js`:

- **`Om opens whole and breaks apart; the gap a fourteenth of the page, its edges corrugated, its
  pieces moving and giving way, its geometry answering the scroll; OM brings it together, shaking from
  the start, with a wave`** (replacing the split's test): every frame from the first read — whole at
  first, coming apart (seen part way) and shaking; then each half 7% of the page out; over forty
  pieces and a hundred specks; both halves cut along one line, not straight, corrugated (its teeth
  turning eighty times in 2,700px) and only slightly; the drawing's halves where the page's are; OM in
  the middle of the gap; the specks and pieces drifting by themselves, given way to the hand and
  coming back; scrolled, the gap the same width to half a pixel and its geometry stirred, the
  pieces trailing, settling again after; a press in the gap opening nothing and a
  press where the first fragrance is seen opening it in both halves; OM pressed: the drawing in step,
  shaking within the first 0.9s, the wave there, whole, the pieces faint.
- *Om's split is brought together by nothing but a press on OM* waits for the page to break apart and
  reads the 7%; the phone's split test waits for OM to come up.

**Still open**: a trial, as before — whichever of the split, the rings, the broken pane and the fine
glass the owner keeps, the others come out of the code.

## 2026-10-14 — Om's gap wider and deep, the drawing behind waiting for OM, โอม a thing of its own, the closing smoother

> In SD, OM parfums, I want you to smooth out the animation as much as possible when it comes to the
> closing of the two sides. It should also be a little wider; especially on the phone. The background
> was a little buggy; so fix that too and smooth it over. I want you to make it so that the thing in
> the middle has dimension; and so when you scroll, some parts of it react slowly while the "farther"
> parts of it will move slower. Make the background icon of "Om" written in sanskrit separate from the
> background and the page too, i want it to be involved with both but as a separate entity; so that it
> exists in the background, but is overwritten by another iteration of the logo when the thing closes.
>
> Also look at the picture: there is SOOO MUCH going on in the background on the right and left. I
> want that all to not exist there, ONLY UNTIL YOU CLOSE THE THING IN THE MIDDLE, so that youll only
> see a feint calligraphy of om, and then when you press the center om, the stuff in the background
> fades into existence

(With a picture of the split page on a phone. "Om written in sanskrit" is the large **โอม** — Om in
Thai script, drawn from the Loma typeface since 2026-10-10; the page has no other.)

**A little wider, most on a phone.** Each half is pushed out 8.5% of the page's width, at least 42px
and at most 140 (`SPLIT_PUSH`, `PUSH_LEAST`, `PUSH_MOST`; it was 7%, 24 and 120): a gap of 244px on a
laptop where it was 200, and **84 on a phone where it was 55** — OM's hexagon (52px there) now stands
inside it rather than over its edges. The edges' wander and teeth grow with it as before.

**The background, fixed: the halves' ground is in the page.** Until now the drawing behind was cut
with the page on two canvases fixed to the window, the page's own ground painted in them, and their
edges cut along the line *where the page stood* every frame. A phone scrolls the page a little ahead
of what a script can draw (and a computer now and then), so the ground's edge trailed the writing's —
the void showing through a cut edge of writing, the gold seam a few pixels off it, which is most
likely what looked buggy; the canvases were also laid out again, the drawing jumping, each time a
phone's bar came or went — and the
drawing's halves were drawn twice and cut again every frame, which is what made the closing heavy on
a phone. Now each half of the page lies over **a ground of its own**, laid in the page as the writing
is: the page's colour, cut along the same line by a clip painted once (`.om-ground-fill`, a hair past
the line so two grounds together leave no hairline of the void between them), and **the gold seam**
along it in a picture of its own (`.om-ground-seam`, two strokes as before, its gold the only thing
that changes — by its opacity). Each ground is moved by the same transform as its writing, on the same
clock, so **the two cannot stand apart** wherever the page is scrolled: measured every frame of the
closing, 0px apart (the old canvases stood within a hundredth of a pixel of the writing only in the
test browser, which scrolls nothing ahead). The ground reaches 40px above the page (`GROUND_TOP`) so a
shake never shows the void at its top, and never past its foot, or the page would scroll on past its
end. The canvases fixed to the window are now sized to **the tallest the window gets** (`100lvh`), so
a phone's bar coming and going no longer lays them out again and moves the drawing up and down.

**Nothing behind but a faint calligraphy of โอม — until OM.** While the page is split nothing of the
armillary, the yantra, the lotus, the star or the dust is drawn (`worldIn`, 0). Only **โอม**, as a
calligraphy (`drawCalli`, `calliFor`): the three letters filled faintly in the house's gold, fuller high
on the left as a brush's load is, **dragged through with the hairs of a dry brush** (streaks of every
width taken out of the ink along the way the brush went — a plain fill read as a font, not a hand), a
soft light round them and a fine outline; **a sheen** crossing it left to right every nine seconds
(`SHEEN_*`); and lit a little about the hand (`CALLI_HAND`). It comes up over a second and a half as
the page comes in (`CALLI_IN_MS`). It is drawn once into a picture at the size it stands at, at no more
than 1.25 device pixels a point, and laid down each frame. **OM pressed, the drawing fades in** over
2.7s from the press (`WORLD_IN_*`) — over the halves, and **never into the gap**: the gap's shape is
taken out of it once a frame (`eraseGap`) until the halves meet.

**โอม, a thing of its own.** The word is no longer part of the drawing behind, nor split with the page:
it stands **whole across both halves and the gap**, centred on the gap, on the page's own canvas, which
lies over the halves' grounds and under their writing while the page is split (`z-index: 2` there, back
to 0 once whole) — in the background, and involved with the page and the gap both. **OM pressed, it is
overwritten**: the calligraphy draws in to the size the page keeps the word at once whole and goes
(`CALLI_OUT`, `SHRINK_TO`), and **the โอม of specks** the page has always kept once whole is written
over it — its construction lines run out, each head's circle drawn round from the top, each letter's
outline traced by **a pen of light**, the specks it has just set down brighter and larger (`WRITE`,
`drawWord`'s `drawn`). By the time the page is whole it is the โอม it was before, small and quiet
behind the column, and it goes on being drawn exactly as it was.

**The gap with dimension** (`THE DEPTH`): everything in it lies at a depth of its own under the page,
from just under it to far down — the broken pieces, the specks and three cracks. **The farther, the
smaller** (`DEPTH`: the farthest a third of its size), **the fainter** (`FOG`), the nearer the gap's
middle (`WIDE_*`: the nearest reach a little under the page's edges, the farthest stay in the middle),
**the less of the scroll it is carried by** (`RATE_*`, 0.9 to 0.1) **and the more lazily it catches the
scroll up** (`FOLLOW_*`, 0.06 to 0.9 seconds, through two stages so it sets off smoothly). Measured on a
laptop, scrolled 400px: the nearest moved 233px within 0.15s and 341 once settled; the middle 35 and
208; the farthest 6 and 75. The broken pieces are **flakes turning in three dimensions** — each turned
about three axes on clocks of its own, drawn foreshortened as it faces the window, brighter the more it
faces the light (`LIGHT`) and **glinting** as it comes round to face it squarely (`GLINT`); drawn
farthest first. The cracks are far down and **broken into runs** (whole, they read as two rails down a
phone's gap). **The walls throw a shade** down into the gap (`WALL_*`), so what lies near an edge seems
to go in under the page, and **far down there is a faint light** (`DEEP_GLOW`) — both drawn as
pictures a pixel at a time, each pixel a little off at random (`backdropFor`): as gradients, so faint a
light on so dark a ground came out in steps, stripes down the gap. The gap is on **a canvas of its own**
under the grounds (`.om-gap`), so nothing needs keeping to it. What the scroll stirred before still
stirs (tumbling, spreading, brightening, the cracks bowing, the specks streaking) — the nearer, the
more; the hand pushes the nearer ones further. The gap keeps its width as ever.

**The closing, smoother.** Nothing drawn by a script moves with the halves any more: the writing and
its ground are moved by the browser alone, on its own clock, and the drawing behind is not split, so
it has nothing to keep up with. The glide is longer (`SPLIT_MS` 2.7s; it was 2.3), gently at both ends
as before; **the shake is gentler and smoother** — 5px at its hardest as the halves meet (it was 8), a
tremor at 4.4 a second (it was 6), **coming up out of nothing over the first 0.65s** (`SHAKE_RISE`; it
was there at a third of its strength in 0.28s), dying away a little more slowly (`SHAKE_TAU` 300ms,
still by `SHAKE_TAIL` 0.95s). The seams flash gold as the halves meet and fade over 0.6s; the wave runs
out as before; the broken pieces come in faint as before. On the test machine, which draws without a
graphics card, the closing ran at about 50 frames a second, as the round before's did; **keeping the
drawing out of the gap with a clip instead held it at 29** — a clip makes every line and speck drawn
under it a mask — which is why the gap is taken out of it once instead.

**The opening** is the round before's: the page whole (its grounds together, their seams hidden, the
calligraphy coming up), a crack running down the line on the page's canvas with a light at its tip,
the halves breaking apart, shaking; as the crack reaches the foot **the seams' own gold takes over from
it** (`crackA`, and the seams' opacity in the same path), and OM comes up last.

The split's code now: `buildSplit` (the halves, their grounds and seams, the gap's canvas),
`layoutSplit`, `sizeHalves`, `fitGround`, `setClips` (the writing's cuts, the grounds' cuts, the seams'
line), `clipOf`, `seamLine`, `openPath`/`joinPath`/`restAt` (each with `seam` and `crackA`), `runPath`
(six animations on one start time), `placeSplit`, `edgeOnWindow`, `eraseGap`, `drawCrack`; the gap's
`gapOf`, `drifter`, `moveGap`, `drawGap`, `backdropFor`, `laidDown`; the word's `calliFor`, `drawCalli`,
`blit`, `drawOm`. **Gone**: `.om-split-sky` and its halves, `edgeBand`, `cutEdge`, `EDGE_BAND`,
`SKY_BLEED`, `SCROLL_LAG` and `SCROLL_LAG_MOST` (every piece trailed the scroll by the same few
hundredths of a second; the depth does it now).

Tested in `tests/om-and-the-tribe.spec.js`:

- **`Om opens whole and breaks apart; the gap a little wider, its edges corrugated, its grounds moving
  with it, only the calligraphy of โอม behind it, its pieces deep, moving and giving way, its geometry
  answering the scroll; OM brings it together, shaking from the start, with a wave, the drawing fading
  in and the โอม written over`** (replacing the split's test): each half 8.5% of the page out; each
  ground exactly where its writing is, its seam gold; nothing split from the drawing; the drawing not
  there at all while split, and the word a calligraphy, come up, at the middle of the gap; **scrolled
  400px, the near pieces drawn larger than the far (by 1.8 times at least), going with the page at once
  (over 150px in 0.15s) while the far ones barely move (under 40), and once settled carried by most of
  it (over 280) and the far ones by a little (20 to 140)**; OM pressed, the ground within half a pixel of
  the writing every frame, shaking within the first 0.9s, the wave, the drawing seen part way in, the
  word seen being written; whole, the grounds and the gap's canvas gone, the drawing all there and the
  word of specks.
- *Om's split is brought together by nothing but a press on OM* reads the new width.
- *Om's split on a phone* — 42px each way, **OM inside the gap**.
- *Om is quick to draw*: and **coming together**, over 24 frames a second, with no clip on the drawing.

**Still open**: a trial, as before — whichever of the split, the rings, the broken pane and the fine
glass the owner keeps, the others come out of the code. The canvases are as tall as the window gets,
so on a phone with its bar showing the drawing's middle (and โอม's) stands about 40px below the middle
of what is seen — steady, where it moved every time the bar came or went.

## 2026-10-14, later — the gap wider, the writing fading as it closes, a smaller hexagon, the pieces spread out once whole

> currently; the om page is better than anything before. I want to just widen the gap, and fade the
> text after you press the OM button during the transition. Also maybe just slightly smooth out the
> animation of the background of the gap. I want you to also make the hexagon smaller (around half the
> size). When the curtains (ill call the thing a curtain) collapse, I want the particles in the
> background that react to the scrolling to be wider and not just in a bright band in the center. I
> want them spread out, and less dense, and also less reactive (especially when compared to the
> particles with the curtains open)

and, having seen the gap at 11%:

> it should still be wider than your screenshots. it should be a little more than 2/5ths

**The curtains** are the owner's word for the two halves of the page (not the landing page's
**curtain**, which is the paper's wipe; see the glossary).

**The gap a little more than two fifths of the page.** Each half is pushed out 21% of the page's
width, at least 60px and at most 520 (`SPLIT_PUSH`, `PUSH_LEAST`, `PUSH_MOST`; it was 8.5%, 42 and
140), so the gap is 42% of it: **about 600px on a laptop** where it was 244, and **164 on a phone**
where it was 84. (It was 11% for a first look — 316 and 108 — and "it should still be wider than your
screenshots".) The writing either side is pushed that much further off the window, on a phone most of
a line. The gap holds as many pieces for its width as before, so there are more of them (572 pieces
and 1,175 specks on a laptop) — still 60 frames a second split on the test machine and about 50 as it
closes. The gap's light and shade are made as wide as the gap opens (`backdropFor`), rather than
240px wide and stretched.

**The writing fades as the curtains close.** OM pressed, the halves' writing goes over 0.7s
(`WRITING_OUT`) — so nothing to read is seen sliding and shaking on the way, only the page's ground
closing, the drawing fading in and the โอม of specks written over the calligraphy — and comes back from
0.88 of the glide to 1.24 of it (`WRITING_BACK`: 2.4s to 3.3s from the press), as the halves meet and
the wave runs, so it is all there again a third of a second before the page is whole. It is the
writing's opacity in the same closing path as its place (`write`, in `joinPath`), handed to the browser
on the same clock (`runPath`); the grounds and their seams do not fade. Read as the writing dipping out
and back, because the page has to be read once whole; the OM button went as it always has.

**The hexagon half the size**: the lens at the hand once the page is whole is 98px from its middle to a
corner (`LENS`; it was 196). It is the same lens the rings and the glasses show their page whole in,
behind `?glass=`, so it is smaller there too. (OM's own hexagon, in the gap, is unchanged — the owner
names it "the OM button".)

**The gap's movement a little smoother.** The scroll's speed and the stir it raises are eased over time
(`SCROLL_EASE` 0.1s; `STIR_UP` 0.16s up, `STIR_DOWN` 0.5s settling) rather than by a share of every
frame (0.22, and 0.25 up and 0.06 down) — which jerked on an uneven frame and ran quicker on a quicker
screen, and threw the pieces across the gap as the stir jumped. The specks are drawn out into streaks
**by degrees** as the page is scrolled faster — each a dot drawn longer — rather than all becoming
lines at once past a speed, in four strengths. And every piece is a little lazier to catch the scroll
up (`FOLLOW_NEAR` 0.1s, `FOLLOW_FAR` 1.1; they were 0.06 and 0.9), so a wheel's step is a glide rather
than a jump. Measured on a laptop through a scroll down and back with the wheel, frame by frame: the
pieces' mean jolt down the window went from 0.48–0.63px to 0.34–0.40, its worst from about 10px to
4–6.5, and the worst across from 2.3px to 0.5.

**Once the curtains have closed, the pieces spread out, fewer and calmer** (`CALM_*`). Until now they
were left faint where the gap had been — a band about 125px wide down the middle of the page, lit
further as the page was scrolled. Now, from 0.3 of the closing (`CALM_FROM`) and over 3.6s
(`CALM_MS`), they **spread out from the gap across the whole page** (`CALM_WIDE`, 97% of half the page
either way) — under the halves and faint over them as they close, so a piece going under a curtain is
seen going under it; **fewer of them are drawn** — as many to the page however wide the gap was, one
piece to every 12,500 square px of it and one speck to every 6,000 (`CALM_SHARDS`, `CALM_MOTES`), an
even share by order, the rest fading as they go; the cracks far down go; and **they react far less**: each is carried by far less
of the scroll (`CALM_RATE`, 0.3 for the nearest down to 0.04 for the farthest, where it was 0.9 to
0.1), the stir — the tumbling, spreading, brightening and streaking — is a fifth of what it is with the
curtains open (`CALM_STIR`), and the hand pushes them half as hard (`CALM_HAND`). Measured on a laptop,
scrolled 400px: with the curtains open the nearest move 188px within 0.15s and 345 once settled, the
middle 25 and 207, the farthest 4 and 75; closed, 60 and 125, 8 and 76, 2 and 30 — 386 of the 1,747
drawn, from 20px to 1402 across a 1440 window. How far each has been carried is gathered as it goes now
(`c`, in `drifter`), so its share of the scroll can change without it jumping. They are as faint as
they were (`GAP_FAINT`).

Tested in `tests/om-and-the-tribe.spec.js`, the split's test (renamed *…; OM brings it together, the
writing fading as it does, … the pieces then spread across the page, fewer and calmer*): each half 21%
out; **the writing** under 0.05 on the way, seen part way between, and back over 0.95 before the page is
whole; **once whole and calm**, under half the pieces drawn, spread across over 85% of the page's width,
over a third of them more than a quarter of the page from its middle, none carried by more than 0.31 of
the scroll, and scrolled 400px the nearest moving under 0.45 of what they did with the curtains open
(and more than 20px). The near pieces "go with the page soon" now (over 110px in 0.15s, where it was 150
— they are lazier on purpose). *Om's split on a phone*: 82px each way. *Om's hexagon shows the page
whole* passes at the smaller size.

**Still open**: a trial, as before — whichever of the split, the rings, the broken pane and the fine
glass the owner keeps, the others come out of the code.

## Same round, other reports

- [The newer houses — Qimu's Bassist and Drummer written](2026-09-21-the-newer-houses.md#2026-10-10--bassist-and-drummer-written-and-a-fold-in-housejs)
- [Pineward — Pumpkivus smelled](2026-09-16-pineward.md#2026-10-10--pumpkivus-smelled-moved-into-the-numbered-parts)
- [The notes — three individual fragrances](2026-09-21-the-notes.md#2026-10-10--three-more-individual-fragrances-and-the-three-new-houses)
- [The chamber — Aetherialism, the eleventh favourite](2026-09-15-the-chamber.md#2026-10-10--aetherialism-the-eleventh-favourite)
- [The Note Library — 37 new notes](2026-09-26-the-test-page.md#2026-10-10--thirty-seven-new-notes-and-the-catalogues-address)
- [The site on a phone — Scent Descriptions' search on a row of its own](2026-09-21-the-site-on-a-phone.md#2026-10-10--scent-descriptions-search-on-a-row-of-its-own)

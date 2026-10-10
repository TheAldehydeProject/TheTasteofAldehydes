# Om Parfums, Outsider Parfums and Lost Tribe — houses ten to twelve
Date: 2026-10-10
Files touched: `houses/om-parfums.html`, `houses/outsider-parfums.html`, `houses/lost-tribe.html`,
`om.js`, `om-glyph.js`, `tools/om/glyph.py`, `lost-tribe.js`, `house.js` (folds), `motifs.js`,
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

- **Om Parfums** opens **in pieces** — the page broken into floating shards of glass round
  **โอม**, the Thai spelling of Om — and **one click anywhere** (a key, the wheel) brings them
  together; it stays whole. **On a phone they come together by themselves**, a moment after the
  page opens. Behind the whole page a vast armillary of gold hairlines turns slowly as you read.
- **Outsider Parfums**, Om's sister house: the same drawing in ivory and a deep green, **not in
  pieces** — a **twin** of it, reflected, drifting out of register and back — and its name
  arrives with an **echo** sliding into place.
- **Lost Tribe**: a naturalist's **field notes** in the margins — the house's own stag and the
  creatures and ingredients of its six fragrances, in specks, each named as a field guide names
  it — pollen drawn to the hand, and a small flock that scatters from it.

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

### The armillary (Om, and Outsider)

What the void is made of and what stands behind the whole page: rings tilted in three dimensions,
each turning on an axis of its own and ticked, specks travelling them; interlocking triangles after
the Sri Yantra (drawn with Om at its middle), two rings of lotus petals, a twelve-pointed star, dust
far off in depth. The outer rings reach past the window — "expansive". It turns a little as the page
is scrolled. **The lens**: a hexagonal shard of glass follows the hand a beat behind it, the drawing
inside it turned and brought nearer. It is drawn at **QUIET** over the column of writing by a soft
mask laid over each finished frame (`hushColumn`), so the reading stays clear.

**Outsider** is the same file (`om.js` reads `.outsider-page` off the body) — "elements from Om
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
  eighteen seconds, and scatters from the hand.
- On a window with no margins the specimens stand at its edges, half off it and faint.

The owner's list of the house's other fragrances is one paragraph, "separated by a comma in a
single line", under their last word: the names as the house writes them on losttribeperfumes.com,
each once (a v2 or v3 folded into its name), read through search summaries — the house's own
pages could not be opened from here — so a few may be missing.

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

"related to the animations on the pages": **Om** — shards of glass drifting and turning, a glint
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

## How to test it

`npm test -- tests/om-and-the-tribe.spec.js`: Om in pieces, one click (a key, the wheel) bringing
it together for good, the pieces landing where the page is, a phone's coming together by itself,
never with reduced motion, at one fragrance, with `?om=whole` or without its script; โอम from the
three letters; the two dropdowns and the line; the owner's words with the agreed corrections and
Xocolate Crotch's stages; Outsider with no pieces and its echo; Lost Tribe's field notes and its
one line of names; the cropped picture; and each new house's motifs at the front of the Houses
view. The house lists (twelve frames, the chain both ways, the return buttons, the subtitles in
title case, the rank on every newer house) are in `houses.spec.js` and `contact-sheet.spec.js`;
the phone's no-sideways-scroll list in `mobile.spec.js` carries the three. By eye: open
`/houses/om-parfums.html` and click; `/houses/outsider-parfums.html`; `/houses/lost-tribe.html`,
moving the hand over a specimen; `/scent-descriptions/#house-10`, `#house-11`, `#house-12`.

## Known issues / TODO

- **The notes could not be checked against the pages themselves** (see above). If the owner turns
  the container's network access on for omparfumfragrances.com, losttribeperfumes.com and
  fragrantica.com, the lists can be read whole and checked.
- **Smoke Oud**: which Smoke Oud the owner smelled (the extrait in the picture, or an attar) would
  let its notes be found.
- **Lost Tribe's list of other fragrances** may be missing a few the house sells (see above).
- **The Om shatter on a slow machine**: about forty shards each carry a copy of the page; on a phone
  there are fewer (`SHARD_RINGS_NARROW`). If it stutters on an old phone, fewer rings is the knob.
- Lost Tribe's design is a first answer, as the owner said it would be ("we will adapt later").

## Same round, other reports

- [The newer houses — Qimu's Bassist and Drummer written](2026-09-21-the-newer-houses.md#2026-10-10--bassist-and-drummer-written-and-a-fold-in-housejs)
- [Pineward — Pumpkivus smelled](2026-09-16-pineward.md#2026-10-10--pumpkivus-smelled-moved-into-the-numbered-parts)
- [The notes — three individual fragrances](2026-09-21-the-notes.md#2026-10-10--three-more-individual-fragrances-and-the-three-new-houses)
- [The chamber — Aetherialism, the eleventh favourite](2026-09-15-the-chamber.md#2026-10-10--aetherialism-the-eleventh-favourite)
- [The Note Library — 37 new notes](2026-09-26-the-test-page.md#2026-10-10--thirty-seven-new-notes-and-the-catalogues-address)
- [The site on a phone — Scent Descriptions' search on a row of its own](2026-09-21-the-site-on-a-phone.md#2026-10-10--scent-descriptions-search-on-a-row-of-its-own)

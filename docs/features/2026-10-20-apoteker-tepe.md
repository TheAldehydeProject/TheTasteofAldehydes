# Apoteker Tepe, the thirteenth house, and its mountain
Date: 2026-10-20
Files touched: `houses/apoteker-tepe.html` (new), `tepe.js` (new), `tepe-data.js` (new, written by the tool), `tools/apoteker/mountain.mjs` (new), `images/Apoteker Tepe/` (the owner's uploads, with `web/`, `house-web/` and a README), `style.css`, `notes-data.js`, `tools/note-library/base.json`, `tools/note-library/research/NEW5.py` (new), `note-library/index.html` (its catalogue, written by `catalogue.py`), `note-figures.js`, `network.js` (`HOUSES`), `motifs.js` (`ridge`), `scent-descriptions/index.html` (the thirteenth frame, and `tepe-data.js`), `houses/lost-tribe.html` and `houses/pineward.html` (the chain), `search-page.js`, `tools/seo.py`, `nav.js` (`Writing`, a closed part's writing), `package.json` (image-js, for the tool), `tests/apoteker-tepe.spec.js` (new), and the house lists in `tests/houses.spec.js`, `mobile.spec.js`, `notes.spec.js`, `writing.spec.js`

## What changed

**A thirteenth house, Apoteker Tepe** — *The Apothecary on the Hill* (the owner's choice of
subtitle) — with the owner's introduction and eight fragrances in their order: Kogen, The Holy
Mountain, Brother Night, Karasu, The Peradam, Pale Fire, Anabasis, After the Flood. Each says
**when it was made**, after its name, in the owner's format: *2015, before 2018*, *2022, after
2018*. Each has its notes in two halves, the house's own list above and Fragrantica's below
(Brother Night has no Fragrantica page). The cut-out bottles are the main pictures, and the
scenes stand under them. The house's picture on the Houses view is Scentorium's, credited.

**Behind the writing, a whole mountain in three dimensions**: **Mount Athos**, the Holy
Mountain of northern Greece, built from its real heights. A tool (`tools/apoteker/mountain.mjs`,
using **image-js**) reads the heights and makes an **aged photograph** of the mountain from them:
lit by the sun, softened, faded, grained, darker at its corners. The page raises that photograph
into three dimensions in **green specks**, closer together where the photograph is darker. The
mountain **turns as the page is scrolled**, most of a turn from the head of the page to its foot.
Over it are **trails**: dashed lines in a faded pencil red-brown, the dashes walking along them.
Each trail is numbered at its foot and **blazed with the house's sign**, the way a path is marked
on a tree; the summit carries its height and where it stands. The specks near the pointer lift a
little and lighten, and the trail nearest the pointer is drawn a little more plainly. Everything
goes faint behind the words, on every width, and the mountain is named in the credit at the foot.

**On the Houses view**, rested on, Apoteker Tepe brings up **fragments of the same mountain**:
torn-edged pieces of its slopes, each round a stretch of trail, turning a little, the dashes going
along the trail and a small walker going its length. Up to four at a time, apart from each other.

## Why / key decisions

### The owner's words

> "I would like you to add a new house to the page called apoteker Tepe. Please confirm all my
> spelling using their website ... source their notes from there, and also then from fragrantica.
> I want you to add anything new to the note library and then run the 12 lines of command for each
> of the notes. The house page should be themed like a mountain. I want there to be a whole
> mountain constructed in 3d in the background, I want you to do that using
> https://github.com/image-js/image-js. I want you to make this mountain green, and granular, and
> make it feel like a really vintage photograph, made digital and then made into a 3d render.
> Following this, I want you to add lines to this mountain, as if tracks or trails that are just
> random indications. Feel free to use an actual mountain that exists in the world for this, but
> if you do then make sure to actually put its name down in the credits below. For the random lines
> and such, feel free to incorporate the logo of apoteker tepe there, I want this to be reactive,
> and rotate when you scroll. I want the text in front of the mountain to be legible. I also want
> you to add a note to every fragrance that was made before and after the period of 2014-2018 ...
> in the format of 0000, before/after 0000. The animation for hovering the house in the houses page
> in SD should be where fragments of the mountains and the lines in the actual page will appear,
> and the lines will move as if along the path. Make it not too flashy, but make it pretty."

### What was asked, and what the owner answered

Put to the owner before anything was written, by the rulebook's rule 12:

- **Kogen's year**: 2024 (Parfumo's), so *2024, after 2018*.
- **The founder's name**: "make sure from the page of the house itself" — the house's About page
  names **Holladay Penick Saltz**, so the triple name stands.
- **The sentence about 2018**: changed at their word to *In 2018, the whole project was
  relinquished by Holladay, and in 2022 it was taken over by the creative behind Pineward.*
- **The line drawn at 2018.** The owner asked for "before/after the period of 2014-2018". The
  house's own story puts its break at 2018, when Holladay let it go; Pineward took it over in
  2022. So every fragrance is *before 2018* or *after 2018*: six from 2015–2016, and Brother Night
  (2022) and Kogen (2024) after.
- **Spelling**: the six clear misspellings put right (it's, applied, honestly, comes off, thing,
  little), and *The Perdam* is **The Peradam**, as the house and its pictures have it. The voice is
  left as it is.
- **Each note** — new note or variation of one already there, and which accord. The answers are
  under *The Note Library* below.

### Mount Athos

The owner left the mountain open ("Feel free to use an actual mountain"). Athos is the Holy
Mountain, and Apoteker Tepe's own *The Holy Mountain* is named for it. It rises alone out of the
sea at the end of its peninsula, which reads as one whole mountain from every side as it turns.
Its heights are **Mapzen's terrain tiles** on AWS Open Data (the "terrarium" encoding, zoom 12,
about 29 metres a pixel): 15.5 km square round the summit, which come out at 1,982 m at the
tiles' own resolution and 1,956 m at the 160 by 160 grid the page draws. The page labels the
summit with its surveyed height, 2,033 m. The tiles' own terms ask for the credit that stands at
the foot of the page (EU-DEM/Copernicus, SRTM and GMTED2010/USGS, ETOPO1/NOAA, Mapzen).

### Made with image-js, once, by a tool

**image-js works in Node, on files**, so it runs by hand in `tools/apoteker/mountain.mjs`, as the
site's other tools do, and writes `tepe-data.js`; the site itself still needs nothing installed
(image-js is a devDependency, like Playwright). The tool:

1. fetches the tiles (once, into the system's temporary folder) and decodes them with `read`;
2. crops the square, and with `resize` and `gaussianBlur` makes the 160 by 160 heights;
3. makes **the photograph**: a hillshade lit **from the north-west**, as a map is lit — along the
   peninsula's crest, so both its long slopes are lit alike and their gullies shaded. It was
   first lit from the south-west, square across the crest: one whole side of the mountain came
   out pale and the other dark, and from half the turns it looked half erased, cut down a
   straight line. On top of the hillshade: the forest darker low down, the marble above the
   trees paler, the trees' own texture, the sea a flat pale grey;
4. **ages it**: `blur`, `level` (faded: no true black, no true white), grain and a vignette;
5. walks **the trails** up its slopes from the shore, switchbacking, smoothed (Chaikin) and
   thinned. They are invented, "random indications" as the owner put it: they follow the ground
   but are not real paths.

`--preview` writes the heights and the photograph as pictures into the temporary folder.

### Drawn quickly

The mountain is about 28,000 specks on a laptop and 14,000 on a phone, fewer and a little
stronger there. What was measured, and what each step bought:

- **Into the picture's own pixels.** Drawn as tens of thousands of `fillRect`s, one redraw took a
  tenth of a second. Now every speck is laid into an `ImageData` by hand (a pixel laid over what
  is there, or a small square) and put down in one call: 5–7 ms.
- **Only when something has moved** — the turn, the pointer, the page under the window. The trails
  are the one thing drawn every frame (about 1 ms), on a canvas of their own over the specks.
- **The wash** (one speck in three, laid soft into a picture a sixth the size, so the print reads
  as tone and not only as dots) is **its own canvas, stretched over the window by the
  stylesheet** (`.tepe-wash`). Drawn enlarged into the specks' canvas every redraw, it cost a sixth
  of every frame: scrolling went from 45 frames a second on the test machine to 54, and a phone
  holds 61.
- **The quiet behind the words** is `Writing.hush`, over the mountain's own box only, on both
  canvases. Never a mask over the window.
- **The trails are hidden where the mountain stands in front of them**, read off a coarse record
  of how near the mountain is in each 6px square of the window, made as the specks are drawn.
- **Sharpness** is `window.Sharpness`, as every 3D drawing's is.

### Legible

The owner: "I want the text in front of the mountain to be legible." Every speck, line and label
goes to a fifth of itself (`KEEP`) behind the words, on every width — the mountain stands behind
the column even on a wide window. A label (a spot height, the summit's name) is as quiet as the
most writing anywhere along it. It was measured at its point alone, and *ATHOS 2,033 m* stood
over a date on a phone.

### The words behind the parts were never there

Measuring how faint the mountain went showed a straight, hard edge down it on every turn. It was
not the mountain. `window.Writing` was counting the paragraphs **inside closed fragrances** as
writing. The browser still measures them where they would stand, so every house's drawing had
been going quiet over an empty column on the right since 2026-10-12. Inside a closed `<details>`,
only its summary is writing now (`nav.js`), and a test says so. This touches every house that asks
`Writing`, on a phone mostly, and only ever where nothing could be read.

### When each was made

`.human-made`, in each fragrance's summary between its name and *Open*. On a phone it wraps under
the name, and a long name (*The Holy Mountain*) wraps in its own room rather than pushing *Open*
off its line. The years come from the house and Parfumo, read through search summaries: After the
Flood, Anabasis, The Holy Mountain and The Peradam 2015; Karasu and Pale Fire 2016; Brother Night
2022; Kogen 2024.

### The notes

The house's own list first, Fragrantica's second as *Interpreted notes*, the source hierarchy
as ever. The pages themselves would not open from here (the environment's network policy denies
`apotekertepe.net`, `fragrantica.com` and `parfumo.com`). **Every list was read through search
summaries** of those pages and their addresses, as in earlier rounds. Brother Night has no
Fragrantica page, and says so.

### The Note Library

Filed by the rulebook, every choice the owner's:

- **Five new notes**: **Pine Smoke** (Smoke & Char), **Copal** (Resins & Balsams; *Copal
  Incense* its variation), **Hiba** (Conifers; *Hiba Cedar*), **Siam Wood** (Woods) and
  **Kuromoji** (Aromatic & Herbal; *Kuromoji (Spicebush)*, as the house writes it). Each is
  researched from at least two sources and has a figure of its own: a pine cone in its smoke, a
  censer of copal, a hiba beside its log, two logs of Siam wood, a kuromoji twig with its
  toothpicks.
- **Nine variations** of notes already there, each explained from its own sources: Green
  Oakmoss, Orris Butter, Madonna Lily, Jasmine Grandiflorum, Smoldering Paper, Sweet Birch
  (wintergreen, not tar), Wet Earth, Boletus Edulis (porcini) and Wood Smoke.
- **Three spellings only**: Guaiacwood, Sandalwood Mysore — and **Water Lily**. The owner was asked
  where a new *Water Lily* should go and answered *Floral*. It then turned out the library already
  had **Waterlily** in Floral, so *Water Lily* is filed as that note written with a space, not as a
  second note. That makes five new notes, not six: **379** in the library.

`research/NEW5.py` holds all of it; `catalogue.py` wrote the page. Sources reused from other files
are declared again without a date, so the day they were first read stands. The house's own pages
are cited for Pine Smoke and Copal Incense.

### The fragments on the Houses view

The owner asked for them "not too flashy, but ... pretty". Each fragment (`ridge` in `motifs.js`)
takes the same `tepe-data.js`, loaded on Scent Descriptions too. Of six stretches of trail tried,
it keeps the one that climbs most, so the piece is of a slope, not a flat. It cuts a torn-edged
round of ground about it and raises that **2.4 times taller than the page's mountain**, so a
piece of slope reads as one. Then it draws the piece as the page draws the whole mountain, in the
same greens, turning a little as it stands. The trail across it is dashed in the same pencil, the
dashes going along it, its number in a ring at its foot, and **a walker** (a small ring) goes its
length over the fragment's life of eight to ten seconds. Each one keeps off the chrome, the
window's edges and the others.

### Finer specks, one side on a phone, the trails stronger (the same day, later)

> from the images you have sent me, i would like you to make the particles way smaller on the phone, so
> that there will be less overlap, and the density is not going to come from relatively larger
> particles, but rather more particles. do the same for the non phone version, but to a lesser extent.
>
> Additionally, for the phone version, I do not want you to actually make the whole mountain appearl,
> its okay if you do just a single side of it while keeping it as organized as possible.
>
> emphasize the red pathing please. just a little more

- **Smaller and more of them.** On a phone each speck is **0.42 of its size** (`SPECK_NARROW`; it was
  1.15 — a speck there is one or two of the screen's own pixels now, where it was three or four) and
  there are **40,000** where there were 14,000 (`SPECKS_NARROW`), each a little stronger
  (`STRONGER_NARROW`, 1.3) so the tone comes from how many there are. On a laptop, less so: **0.8 of
  their size** and **34,000** where there were 28,000 (`SPECK_WIDE`, `SPECKS_WIDE`). The soft wash
  under them is fainter where there are more specks to each of its pixels (`WASH_WIDE`,
  `WASH_NARROW`) — with as many specks as a phone has now it came up as blotches.
- **One side of it on a phone.** The mountain is drawn nearly twice as large there, its summit
  towards the right edge (`frameOf`: the window's width, centred at 78% across), so one flank runs
  across the window and the rest stands off it — whichever side it has turned to. **Three of the six
  trails** on a phone (`TRAILS_NARROW`), every other one, so the summit, where they all arrive, stays
  clear, and no spot heights; the summit's name written to its left where there is no room to its
  right.
- **The trails a little stronger**: at 0.8 where they were 0.62, their lines 1.45px wide (1.3 on a
  phone; they were 1.2 and 1.1), a touch redder (`[128, 60, 42]`), the rings at their feet and the
  blazes a little firmer too. Behind the words they are as quiet as ever, in proportion.

Measured on the test machine: a redraw of the specks 6–7 ms on a laptop and 6 on a phone; scrolling
45–55 frames a second on a laptop (it varies run to run there) and 54–61 on a phone.

### Om's opening, in two beats

The same round, on Om Parfums. It is written in [Om's
report](2026-10-10-om-outsider-and-lost-tribe.md#2026-10-20--the-opening-in-two-beats).

## How to test it

- `npm test -- tests/apoteker-tepe.spec.js`:
  - every fragrance says when it was made, in the format, and its pictures arrive;
  - the credit names the mountain and Scentorium;
  - the mountain is drawn from its data in green and turns most of the way round as the page is
    scrolled;
  - **it goes faint behind the words** on a laptop and a phone (drawn with `Writing` and
    without, a fifth or so of it left behind a paragraph);
  - **it is quick to draw and to scroll** on a laptop and a phone (a redraw under 24 ms; scrolling
    over 24 and 30 frames a second, read over 30 and 40, under a loaded suite);
  - it is still with reduced motion, and the page is its writing without the script;
  - the Houses view's fragments are whole on the window and apart;
  - the data is the tool's, with image-js.
- `tests/writing.spec.js`: *the writing inside a shut part is not counted until it is opened*.
- The house is in every house list: `houses.spec.js` (the chain both ways, the return button at
  `#house-13`, the rank of eight, the subtitle in title case), `mobile.spec.js`, `notes.spec.js`,
  `writing.spec.js`.
- `node tools/note-library/rulebook.js --check` and `python3 tools/note-library/catalogue.py
  --check` are clean; `tests/rulebook.spec.js` finds every note After the Flood names (the page's
  newest) in the library, counted for it at its tier, and opens the first one's window.
- By eye: `houses/apoteker-tepe.html` at a laptop's and a phone's size, scrolled slowly from head
  to foot, the pointer over the mountain; `scent-descriptions/#house-13`.

## Known issues / TODO

- **The pages were not read directly.** The house's site, Fragrantica and Parfumo are denied by the
  environment's network policy, so the spellings, the lists and the years come from search
  summaries of those pages. Allowing those hosts in the environment's network settings would let a
  later round read them straight.
- **The trails are invented** — the owner's "random indications": they climb the real ground, but
  no real path on Athos is drawn.
- The summit's label says the surveyed 2,033 m. The ground drawn reaches 1,956 m at the page's
  grid, because a 29-metre pixel averages the peak away.

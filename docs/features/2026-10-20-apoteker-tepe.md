# Apoteker Tepe, the thirteenth house, and its mountain (in 3D until 2026-10-22; photographed behind frosted glass since 2026-10-27, a trial)
Date: 2026-10-20
Files touched: `houses/apoteker-tepe.html` (new), `tepe.js` (new), `tepe-gl.js` (new, the mountain drawn, for the page and the Houses view), `tepe-data.js` (new, written by the tool), `tools/apoteker/mountain.mjs` (new), `images/Apoteker Tepe/` (the owner's uploads, with `web/`, `house-web/`, `mountain/athos.jpg` and `mountain/heights.png` (written by the tool) and a README), `style.css`, `notes-data.js`, `tools/note-library/base.json`, `tools/note-library/research/NEW5.py` (new), `note-library/index.html` (its catalogue, written by `catalogue.py`), `note-figures.js`, `network.js` (`HOUSES`), `motifs.js` (`ridge`), `scent-descriptions/index.html` (the thirteenth frame, and `tepe-data.js` and `tepe-gl.js`), `houses/lost-tribe.html` and `houses/pineward.html` (the chain), `search-page.js`, `tools/seo.py`, `nav.js` (`Writing`, a closed part's writing), `package.json` (image-js and geotiff, for the tool), `tests/apoteker-tepe.spec.js` (new), and the house lists in `tests/houses.spec.js`, `mobile.spec.js`, `notes.spec.js`, `writing.spec.js`; and, for **the resolution trials** (2026-10-21), `tepe-gl.js` and `tepe.js` again (`?res=`), `tools/apoteker/trials.mjs` (new), `tools/apoteker/upscale.py` (new), `images/Apoteker Tepe/mountain/trials/` (new, written by those two) and `tests/tepe-resolution.spec.js` (new); and, for **the realism trials** (the same day, later), `tepe-gl.js`, `tepe.js`, `trials.mjs` and its test again, `tools/apoteker/osm.py` (new), and in the trials' folder `ndvi.png`, `athos-delit.jpg`, `canopy.jpg` and `athos-osm.json`; and, for **the looks** (the same day, last), `tepe-gl.js`, `tepe.js`, `style.css` and `tests/tepe-resolution.spec.js` again; and, for **the page's own look** (the same day, the very last), `tepe-gl.js`, `tepe.js`, `style.css`, `houses/apoteker-tepe.html` (the credit), `tools/apoteker/fine.mjs` (was `trials.mjs`), `tools/apoteker/osm.py`, `images/Apoteker Tepe/mountain/fine/` (new; `trials/` and `upscale.py` gone), `images/Apoteker Tepe/README.txt`, `.gitignore`, `tests/tepe-look.spec.js` (was `tepe-resolution.spec.js`) and `tests/apoteker-tepe.spec.js; and, for **the mountain taken out** (2026-10-22), `tepe.js`, `tepe-gl.js`, `tepe-data.js`, `tools/apoteker/` (all three tools), `images/Apoteker Tepe/mountain/` and `tests/tepe-look.spec.js` deleted, and `houses/apoteker-tepe.html` (its drawing, its mountain's credit and the three scripts), `scent-descriptions/index.html` (the two scripts), `motifs.js` (`ridge`), `style.css`, `package.json` and `package-lock.json` (image-js and geotiff), `images/Apoteker Tepe/README.txt`, `tests/apoteker-tepe.spec.js`, `tests/contact-sheet.spec.js` (`NO_MOTIF_YET`) and `tests/mobile.spec.js`; and, for **the mountain photographed, behind frosted glass** (2026-10-27, a trial), `tepe.js` (new, a different script under the old name), `houses/apoteker-tepe.html` (its canvas, the script, the credit), `style.css`, `images/Apoteker Tepe/AT MOUNTAIN 1.webp` to `5` (the owner's upload), `images/Apoteker Tepe/mountain-thumbs/` (new), `images/Apoteker Tepe/README.txt` and `tests/apoteker-tepe.spec.js`

## What changed

**The mountain is photographed now, behind frosted glass — a trial (2026-10-27).** The 3D mountain
was taken out on 2026-10-22 — "yk what, just remove it for now, i will redesign the whole thing.
remove the mountain": Mount Athos behind the writing, its land, mist and trails, Free view, its
fragments on the Houses view, and every look of it the sections below describe went, with all their
code, pictures and tools (see *The mountain taken out*). Five days later the owner sent five
photographs of their own (*AT MOUNTAIN 1* to *5*) and the Musica 2011 poster — a horse behind
frosted glass — and the page is now **the photograph blurred out and misted towards the house's paper
but for a window on the right-ish middle where it is sharp**, with **a panel at the top right** to go
between the five and turn on colours and filters (see *The mountain photographed, behind frosted
glass*, the last section). Everything written here about the 3D mountain is its history, kept for the
reasoning.

**A thirteenth house, Apoteker Tepe** — *The Apothecary on the Hill* (the owner's choice of
subtitle) — with the owner's introduction and eight fragrances in their order: Kogen, The Holy
Mountain, Brother Night, Karasu, The Peradam, Pale Fire, Anabasis, After the Flood. Each says
**when it was made**, after its name, in the owner's format: *2015, before 2018*, *2022, after
2018*. Each has its notes in two halves, the house's own list above and Fragrantica's below
(Brother Night has no Fragrantica page). The cut-out bottles are the main pictures, and the
scenes stand under them. The house's picture on the Houses view is Scentorium's, credited.

**Behind the writing, a whole mountain in three dimensions**: **Mount Athos**, the Holy
Mountain of northern Greece, built from its real heights and — since the last round of the same
day — **coloured as it really is**, by the Copernicus Sentinel-2 satellite's picture of it. A tool
(`tools/apoteker/mountain.mjs`, using **image-js**) makes the heights and the colour; the page
(`tepe-gl.js`, in WebGL) draws them as **a solid surface with small specks over it, many to the
pixel**, lit by a low sun from the south-west, with **the house's sign laid on a slope** as a
figure is cut into a hillside, the shallows and a line of foam round its shore. It **turns slowly
as the page is scrolled** — a little over a quarter of a turn from head to foot — and nothing
answers the hand. Round it is **an environment**: a pale sky, the Aegean, hazy to the horizon, and
on the horizon the real islands and peninsulas Athos sees, faint, passing as it turns; a cloud
drifting off its summit and a mist along its foot. Over it are **trails**: dashed lines in a pencil
red-brown, the dashes walking along them, each numbered at its foot and **blazed with the house's
sign**, the way a path is marked on a tree; the summit carries its height and where it stands.
Over the column of writing all of it goes **quiet as Ataraxia's bands do**. **Free view**, a button
at the top right, takes the writing away and leaves the mountain to be turned, brought nearer and
moved by hand, with **a node for each of the eight fragrances** on it. The mountain, its heights
and its colour are named in the credit at the foot.

(For its first two rounds that day it was **an aged photograph raised in green specks**, lifting
under the hand, turning most of a turn as the page was scrolled, faint behind the words alone —
see *Finer specks* and *Solid, coloured, slower* below for what changed and why.)

**On the Houses view**, rested on, Apoteker Tepe brings up **fragments of the same mountain**,
drawn as the page draws it: torn-edged pieces of its slopes, each round a stretch of trail,
turning slowly, the dashes going along the trail and a small walker going its length, one of
them the piece the house's sign is on. Up to four at a time, apart from each other. Its picture
there is the whole of Scentorium's, at the frame's own shape.

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
2. crops the square, and with `resize` and `gaussianBlur` makes the heights (160 by 160 at first,
   200 by 200 and 16 bits since);
3. made, until the last round of the day, **the photograph**: a hillshade lit **from the north-west**, as a map is lit — along the
   peninsula's crest, so both its long slopes are lit alike and their gullies shaded. It was
   first lit from the south-west, square across the crest: one whole side of the mountain came
   out pale and the other dark, and from half the turns it looked half erased, cut down a
   straight line. On top of the hillshade: the forest darker low down, the marble above the
   trees paler, the trees' own texture, the sea a flat pale grey;
4. **aged it**: `blur`, `level` (faded: no true black, no true white), grain and a vignette —
   both replaced by **the colour**, the satellite's picture printed (see below);
5. walks **the trails** up its slopes from the shore, switchbacking, smoothed (Chaikin) and
   thinned. They are invented, "random indications" as the owner put it: they follow the ground
   but are not real paths.

`--preview` writes the heights and the photograph as pictures into the temporary folder.

### Drawn quickly (its first round — see *Solid, coloured, slower* for now)

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

### Legible (its first round — Ataraxia's quiet since)

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

### The fragments on the Houses view (as first made — solid and coloured since)

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

### Solid, coloured, slower; an environment, Ataraxia's quiet, and the free view (the same day, last)

> so for the exact same page I want you to make the particles smaller and way more dense. I want
> you to smooth out the textures and decrease the emphasis on the colour green. I also want you to
> deminish everything that is in front of the writing in a similar way to ataraxia's page. I want
> the actual logo of the house to appear somewhere on this mountain. I do not want the mountain to
> be translucent, i want it to be visible exactly the same as any other mountain; and i want there
> to be colours, not just green. it should be well coloured - like an actual mountain. The rotation
> is too fast, and I would prefer it it was slower. The reactivity too, I would actually suggest
> removeing that entirely. On the top right, add a button saying "free view" where you can look at
> the mountain in a free view, sort of a sandbox way. In this mode, i want there to be nodes on the
> mountain, which when hovered, will correspodn to different perfumes from the house.
> For the background of the page, please add an environment. I want something that is subtle but
> accomodates the mountain nicely. also please zoom out the images a little; they are out of frame.
> this is also true for the house image for apoteker tepe. Please also apply the above changes to
> be true for the house in SD, not only in page.

**Coloured as the mountain is.** "Like an actual mountain" is best answered by the mountain itself:
the tool now reads the **Copernicus Sentinel-2** satellite's true-colour picture of grid square
35TKE on 14 July 2023 (a cloudless morning: 0.002% cloud), straight out of the open archive on AWS
(`sentinel-cogs`), a window at a time with **geotiff** (a devDependency, beside image-js). It turns
the satellite's own grid (UTM zone 35) into the square the heights are on, pixel by pixel, and
**prints** it: the land's light stretched from its 1st to its 99.5th hundredth, its mid-tones
lifted (`GAMMA`), **its greens quieted towards olive and grey** (`GREEN_QUIET`, 0.8 of the way to
their own grey where they are greenest — "decrease the emphasis on the colour green"), a little
warmth, and **softened** with image-js (`gaussianBlur`) so the forest's own grain is not a texture.
It writes `images/Apoteker Tepe/mountain/athos.jpg`, 1,024 pixels square (15 m to a pixel). On it
are the real forest, the bare marble of the summit, the scree, the tracks and the shallows. Two
satellite tile services were tried first (EOX's Sentinel-2 cloudless, and its WMTS); both are
denied by the environment's network policy, and the raw archive is not. The aged grey photograph
(and its grain) are gone from the tool and the page.

**Solid.** The specks alone were always going to look translucent: a few tens of thousands of them
over half a million pixels let the paper through. The mountain is now **a surface** — the heights
as a mesh of triangles (the grid is 200 by 200 now, and 16 bits, where it was 160 and 8: at 8 bits
its slopes came out in terraces) — opaque, hiding what stands behind it, and **over it the specks**,
**300,000** on a laptop and **260,000** on a phone (34,000 and 40,000 before), **0.62 and 0.42 of a
css pixel** (one device pixel or so), each the ground's own colour where it stands, lit as it is, a
shade lighter or darker. The surface is drawn a shade darker (`SURFACE`, 0.86), so the mountain
reads as made of fine particles and is a mountain all the same. `TepeMountain.sample()` draws it
over black and over white and compares: its body is the same over both, every pixel.

**WebGL, in `tepe-gl.js`.** A canvas of hand-laid pixels could not draw a solid surface and a third
of a million specks fast enough, let alone turn it by hand; the graphics card can. `tepe-gl.js`
holds one small program for the surface, one for the specks and one that lays the sky under them.
Each is checked once compiled, and if any fails (or there is no WebGL) the page goes on without its
mountain and without Free view, as its writing on the aged paper — never blank. **Drawn the right
way round**: the old projection had east on the right looking south, a mirror image nobody could
see until a photograph and a sign were laid on it; `project` and `matrix` turn the window's x the
other way.

**The sign on the mountain.** `TEPE.figure`, chosen by the tool: a broad, even slope a third to two
thirds of the way up, lit by the afternoon, clear of the trails and the places, with the house's
sign laid on it **1,900 m tall**, its head towards the summit, in pale stone with a dark edge
downhill — as a figure is cut into a hillside. It is drawn into the colour itself (`ground()` in
`tepe-gl.js`), so it turns, hides and goes quiet with the ground. It is on the north face, which the
page shows at its head (`TURN_FROM`). The blazes along the trails are still the sign too.

**Slower, and nothing answering the hand.** `TURN` is **0.55π** (99°) from the head of the page to
its foot, where it was 1.55π, and the turn glides after the scroll over 0.6 s (`TURN_EASE`, 0.42 s
before). The specks lifting under the hand (`HAND_*`) and the nearest trail drawn plainer are out of
the code.

**The environment.** Subtle, and true to the place. The camera looks down a little less steeply
(`PITCH` 0.235, `EYE` 3: it was 0.36 and 4.2) so the horizon comes into the window near its top. On
a canvas of its own, laid under the mountain inside its own drawing: **the sky**, pale blue-grey
warming to the paper at the horizon, the sun's light low in the south-west and its path on the
water; **the sea**, hazy at the horizon, a muted grey-green nearer; **the horizon's land**, at its
real bearings and distances from the summit, raised as the mountain is and fainter the further it
is — Sithonia, Kassandra, Olympus, Holomontas, the Athos peninsula itself, Thasos, Samothrace,
Lemnos — so they pass along the horizon as the mountain turns; a haze along it. Round the mountain:
**a cloud cap** drifting off its summit on the wind from the north-east, as Athos's so often does,
and **a mist** along its shore. The land the mountain stands on runs on past the square, so where
it fades out round the mountain's foot it **sinks into the sea** (`sink`) — cut off and faded, it
hung under the mountain like a curtain.

**Ataraxia's quiet.** Ataraxia keeps its bands quiet over the whole column (`QUIET` 0.26, eased in
over `SOFT` 96px either side), and on a phone, where the column is the window, at QUIET everywhere
and quieter again behind the words (`Writing.under`). The page does the same, with Ataraxia's own
numbers (a test reads both files), by **a veil of the page's own paper** laid over the drawing —
the sky, the sea, the mountain, the trails, the clouds, all of it. On a wide window it is **one
gradient the stylesheet draws** (`.tepe-veil-band`); as a stretched picture it cost the browser a
fifth of its frames. On a phone it is a small picture of where the words are, made again from
`Writing.boxes()` as the page scrolls (asking `Writing.under` for each of its cells took 28 ms a
frame). It was the words alone, at a fifth (`KEEP`), on every width before.

**Free view.** `.tepe-free`, boxed at the top right level with the Menu, as Om's buttons are; on a
phone on the chrome's own ground, since the page scrolls under it. Pressed, the writing, the credit,
the foot and the rank fade out (`tepe-free-on` on `<html>`), the veil lifts, the page stops
scrolling, and the mountain goes to stand whole in the window. **A drag turns it** (and tips it,
`FREE_PITCH` to start); **a right-drag, shift, or two fingers move it**; **the wheel or a pinch
brings it nearer**, about the pointer (`FREE_ZOOM`); the arrows, + and −, and 0 to put it back; a
hint along the foot says so until the hand has moved it. **A node for each fragrance** stands where
its name says it does (`TEPE.places`, chosen by the tool): The Holy Mountain at the summit; The
Peradam high on the summit's own slopes, where Daumal's climbers find the stone; Anabasis half way
up the first trail (the going up); After the Flood at the water's edge; Kogen (高原, highland) on
the flattest high ground; Karasu (烏, crow) on the steepest crag; Brother Night on the darkest slope;
Pale Fire on the one most lit by the low western sun. Each is a button. Pointed at (or focused from
the keyboard) it fills, and **a card** says which — its picture, its name, when it was made, *Read
about it →*; pressed, Free view closes and the page goes to that fragrance, opened. On a phone the
first tap says, and a tap on the card goes. A node the mountain stands in front of is faint and not
pressable. Escape, or the button (*Back to the page*), comes back; the turn comes round to the
scroll's the shorter way.

**The pictures a little further off.** The cut-out bottles filled their pictures to the edges, so
in a frame they stood against its sides: they stand in it with room round them now
(`img[src*="-cut."]`, padded, `contain`), the thumbnails too. The scenes under them were cut to an
upright 2 : 3, which took the ends off a bottle lying on its side; they are shown whole at their
own shape. The house's picture on the Houses view (`house-web/apoteker-tepe-house.webp`) is made
again at the frame's own shape (0.86 : 1): the whole square picture, a little smaller than the
frame is wide, on a soft, darkened copy of itself, its edges eased into it — the frame cut the
bottles at its sides off before.

**On the Houses view, the same.** `ridge` draws each fragment with `tepe-gl.js`: solid, coloured,
in **9,000** specks where it was 1,300, turning at 0.018 to 0.036 radians a second (it was 0.06 to
0.12), nothing answering the hand. While no fragment carries the sign, the next is **the piece the
sign is on**, with the trail that passes nearest it. Solid, a slope raised 2.4 times stood up as a
wall, so a fragment is raised **1.3 times** the page's and seen from a little higher (0.55 to 0.75
radians). A fragment is drawn in WebGL into a picture of its own **only every 70 ms**, and that
picture is laid down every frame; its trail is drawn over it each frame. The environment stays on
the house's page: the Houses view keeps its own white, as the owner asked of Outsider's door.

**Drawn quickly.** Measured on the test machine, which draws without a graphics card:

- **The mountain, its sky and where the trails can be seen are drawn again only when the camera
  has moved** by a third of a pixel anywhere; the dashes and the clouds every other frame, together,
  on one canvas (`.tepe-trails`), the clouds made at a quarter of the window's pixels and laid on it.
- **The sky inside the mountain's drawing**, which is then opaque: one full-window layer the less
  for the browser to put together every frame (scrolling 28 → 36 frames a second).
- **Without a graphics card** (`soft` in `tepe-gl.js`, as the home page's aldehyde has it): a tenth
  of the specks, every other place of the grid, no smoothing of edges, at most a picture every 300
  ms (`SOFT_EVERY`), and on a wide window at 0.6 of the screen's pixels (`SOFT_WIDE`) — at the
  screen's own the page fell to 16 frames a second there with another drawing's test beside it.
  A phone is drawn at full sharpness even then, as `mobile.spec.js` asks. `?tepe=full` draws it all
  there, for a picture.
- With all of that: scrolling at 45 frames a second on a laptop and 52 on a phone here, read at 50
  and 53. A machine with a graphics card draws the surface and its third of a million specks in a
  millisecond or two.

### Denser and digital, the sign cut in, a land round it, mist, the quiet in the drawing, and the free view held (the last round of the day)

> for SD Apoteker Tepe: okay, so this is way better; but i would like you to make the graphics way
> denser and make it a little nicer. After you do that, i want you to actually make it a little
> digitalized by driving it. IDK if that is the true word to describe it, but give it noise. most
> importantly, make it look good and graphically dense. i also want you to remove the logo being
> plastered on the mountain; rather it should be a part of it. The paths are good, but there is
> unneccessary coordinates on it which i think should be removed. I also want you to make it seem
> less like an island; i want there to be an abstract biome/environment/background all around this
> one mountain, as not to make it feel so isolate. I also want you to fix the text, so that it feels
> less so that the mountain loses opacity instead of putting a whole object in front of it on medium
> opacity. the rotation should be slower in the main page too please (as in less sensitive)
>
> NOW ABOUT THE FREE VIEW: most importantly, i do not want the environment to feel so bland; so
> expand on what i said above. Then, I want the text not to be registered on the page unless you
> hover on something, that way you wont highlight something by accident by trying to move the
> mountain around. I will also ask that here (and in the page in general), you cannot turn the
> mountain all the way, but rather to a certain point: i want you to set degree thresholds on eithers
> side of it (left right up down), so that you can only turn it a little. I want you to accordingly
> redistribute the waypoints indicating the perfumes. I want the mountain to have some motion even
> when not interacted with; and I want the same to be true for the environment it is in. this motion
> should also include temporary popups of the fragrances within the house itself. you should not be
> able to zoom in or out by the way. AT THE TOP OF THE MOUNTAIN, I WANT THE POPUP TO BE THE LOGO
>
> something you could do in general is simulate mist that moves in and around this mountain; but I
> would ask that this be really high quality. you can look for various sources on github if you need
> to for a way to do that. please change the SD apoteker tepe hovering mechanism accordingly.

`tepe-gl.js` and `tepe.js` were written again; the tool runs again.

- **Denser.** The heights are **384 by 384, 40 m apart** (they were 200, 78 m), read off a picture of
  them the tool writes (`images/Apoteker Tepe/mountain/heights.png`, sixteen bits, red the high byte
  and green the low, as the terrain tiles themselves are — `TEPE.heights` names it; the base64 of the
  heights in `tepe-data.js` went, and the file is 13 kB). **460,000 specks on the mountain and 80,000
  on the land round it** on a laptop, 320,000 and 50,000 on a phone, each 0.52 and 0.4 of a css
  pixel near; **the ground a grid of 520 by 520** (420 on a phone), finest over the mountain and
  coarser out to the haze (a warped grid: linear across the square, its cells growing beyond it, its
  slope kept where they meet). The satellite's picture is softened a little less (σ 0.7).
- **Digital — "driving it" read as *dithering* it, with the noise the owner named.** Every colour
  drawn — the sky, the ground, the specks, the mist — is put in **steps of an ordered (Bayer 8×8)
  dither, a css pixel to a step**, 34 steps of light (`DITHER`), with **a fine grain** from a noise
  picture — so the light comes in steps as a screen of few colours shows it, plainest in the sky and
  the mist. `TepeMountain.dither()` reads it off the sky.
- **The sign cut in, not laid on.** It is no longer pale stone painted over the photograph. The sign
  is **cut into the ground**: in its shape the ground is lowered a little (its edges catching the
  light on one side and in shade on the other, the mask's own slope tilting the light), **bared to the
  red earth** a limestone mountain has under its scrub (*terra rossa*, `EARTH`, 72% of the ground's
  own colour, its grain kept), and **most of its specks taken out** (`SIGN_KEPT`, 30% left) — on a
  broad slope the tool now chooses **turned squarely to the page's view** (`facing`), 2,200 m tall.
  *Tried first and wrong:* a pale cut, as a chalk figure is made — lost on Athos's own pale limestone
  (measured: 8 points of light against the ground round it); then **a dark wood** in its shape —
  lost on its own dark woods. A red debug colour showed the shape was there all along, whole and
  legible; it was the contrast.
- **No coordinates.** The summit's *ATHOS 2,033 m* and *40°09′ N 24°19′ E* and the spot heights on the
  trails are gone; the trails, their numbers at their feet and their blazes stay. The trails to the
  summit stop just short of it, under the house's node, where three came together in a knot of
  dashes, and no blaze stands in the last eighth of a trail.
- **A land all round it, not an island** (`proc` in `tepe-gl.js`, made up — the credit says so):
  **the peninsula's ridge runs on out of the square** (its edge carried outwards, falling away,
  `CARRY`), **water lies in the gulfs either side** as the sea does there (the mountain's own sea
  goes under the water), and **beyond the water the land rises on every side** to rolling hills cut by
  valleys — meadow, scrub, a patchwork of fields in the lowland, woods (more on the slopes turned from
  the sun), rock where it is steep — and to **far ranges going into the haze**, out to 9½ half-widths;
  **faint contours on it** now and then, as on a map; the water's edge worked out between its corners
  (its depth is signed, less than nothing on land), so it does not follow the grid in steps.
- **The sun moved** to the south-south-east (165°, 32° up; it was from the south-west, 225°): from the
  south-west it stood behind the eye, and the land lay flat under it. The places of Pale Fire and
  Brother Night follow it (the tool's `SUN`).
- **Mist, moving in and around the mountain** — two kinds, worked out in the programs:
  - **lying low in the air**, an exponential mist thickest in the valleys and over the water, its
    whole way from the eye integrated in closed form (no stepping through it — the textbook height
    fog, as Íñigo Quílez sets it out), lying in **wisps that drift** (two layers of noise moving
    different ways), lit brighter towards the sun;
  - **banks of it** (`mist`, `MIST`: 34 along the mountain's foot over the water and the shore, 26
    wisps hanging just off its slopes and **going round it**, 9 in a **cap streaming off the summit**
    on the wind, 10 over the far valleys) — each a soft volume, its body eroded by three layers of
    drifting noise, **lit as a ball is** from the sun's side, hazed with distance, and **sinking into
    the ground where it meets it** (a soft edge read off a picture of the world's heights), hidden by
    the mountain where it stands in front.
  No library was taken from GitHub: the two are short enough to write here and keep in WebGL 1.
- **The shadows of clouds** pass over the land, slowly, and **high cloud** drifts in the sky.
- **Behind the writing the mountain loses its opacity.** The veil of paper laid over the column
  (`.tepe-veil`, `.tepe-veil-band`) is gone. The page works out **where the words are**
  (`Writing.boxes()`, on every width now) as a small picture of how much of the drawing is left at
  each place of the window — Ataraxia's QUIET behind the words, coming on over Ataraxia's SOFT round
  them, the whole of itself clear of them; on a phone QUIET everywhere and the words' own KEEP of that
  behind them — and hands it to the drawing, which draws the ground, its specks and its mist **that
  much of the way to the sky behind them** (`mix(sky, col, quietHere())`). So the mountain fades into
  its own sky and haze behind a paragraph, and the sky itself is never veiled: no edge of a pane on
  it. (Blending the ground at that opacity over the sky was the first way, and needed the ground laid
  down twice, once for its depth; drawing it solid at the sky's colour is the same picture, once.)
  *A fault found on the way:* `Writing.boxes()` already gives the boxes on the window; the phone's
  veil had taken the scroll off them a second time, which put the quiet off the words once the page
  was scrolled.
- **Slower and only so far.** The view is the data's (`TEPE.view`, from the west-south-west, the
  sun's side). The page turns **PAGE either way of it, 0.3 radians (17°)**, from one end at the head
  of the page to the other at its foot — **34° in all** (it was 99°, and 279° before that). The free
  view turns **FREE either way, 0.45 (26°)**, and looks down between **0.17 and 0.42**: a drag past
  either gives a little (`GIVE`, a third as far) and **springs back** once let go. **Nothing brings
  it nearer or moves it**: the wheel, a pinch and a right-drag do nothing (`zoom` and the pan are out
  of the code).
- **The places redistributed.** The tool chooses every place, and the sign, **where the view sees it**
  — from the view and from both ends of the page's turn, nothing of the mountain in front of it, the
  slope turned to the eye — so all of them face the window wherever it is turned (a test turns it to
  both ends of the free view and finds all of them, or all but one). The summit is **the house's
  own**; *The Holy Mountain* stands just under it on the face seen.
- **The house's sign at the summit.** A ninth node, the house's, stands at the top: its card is **the
  house's sign itself**, large, with its name and line under it, and pressed it goes to the head of
  the page.
- **Never quite still.** Left alone the mountain **breathes** — the view swaying 1.6° and a half a
  degree, on breaths of 41 and 29 seconds (`SWAY`) — while the mist drifts, the wisps go round, the
  cap streams off the summit, the clouds' shadows cross and high cloud moves; and in the free view,
  left alone for four seconds, **the nodes say what they are of their own accord**, one after another,
  each for three seconds, the house's first (`POP_*`). The hand on a node, or a drag, stops them; they
  start again once it has gone.
- **Nothing written until it is pointed at.** A node's number shows only while it is pointed at or
  saying what it is; the hint goes after six seconds; and **nothing in the free view can be
  selected** (`user-select: none` on the whole page while it is open), so a drag never highlights
  anything.
- **Drawn every frame** while anything moves, **every other** while only the mist does. Without a
  graphics card the programs are their LITE versions (no grain, fields, contours, ripples, wisps or
  high cloud; a simpler sky; a tenth of the specks and a coarser ground), at most a picture every 300
  ms — every 750 while the page is being scrolled, and one a second while nothing but the mist moves.
- **On the Houses view** the fragments follow: **16,000 specks**, smaller, **dithered**, the sign cut
  in on the one that carries it, **dissolving at their edge in the dither's own steps** rather than
  torn off, turning half as fast again (`RIDGE_SPIN` 0.009 to 0.018), white haze and no mist — and,
  like every house there since that day, **only while Apoteker Tepe is the house at the front**
  ([the axis](2026-09-24-the-axis.md#2026-10-20--only-the-house-at-the-front-the-hand-sets-nothing-off)).
- Measured here, without a graphics card (as every test runs): a picture of the whole in 70 ms on a
  laptop's window and 106 on a phone's sharp screen alone, and the page keeping its frames, scrolling
  and read, under the suite. With `?tepe=full` (the whole of it, drawn on the processor) a picture
  takes two seconds here, which a graphics card does in a few milliseconds.

### The resolution trials (2026-10-21)

*(Gone since the last round of the day, with the switch and all its code, but for what the owner kept — see* ***The page's own look*** *below. Kept here for the reasoning.)*

The owner, the next day: *"listen; its ugly, and the main reason is the resolution. I want you to
now look for as many possible ways for you to up the resolution. I want you to give me a list of
ways to make the resolution better, including demonstrations of each way separately (a trial
render). the list should include new ways to render it, as well as alterations to the existing model
to improve quality. I want you to do this systemiatically, searching for ways to do it first, as many
as possible, and then executing it ... The theme in general should be the mountain, with the paths
and the points."*

**Every way is a switch on the page's address**: `?res=` and a word, several with commas
(`houses/apoteker-tepe.html?res=photo,dem`), `?res=best` the best of them together and
`?res=ceiling` the same with the two dearest on top. Without it the page draws exactly as it did —
nothing of any trial runs unless it is asked for (`RES` and `res()` in `tepe-gl.js`, read by
`tepe.js` too). **Whichever the owner does not keep comes out of the code**, with its pictures.

**Without a trial, none of the trials' code is in the programs** (`TRIALS` in `tepe-gl.js`: `#ifdef
TRIALS` round every line of it in the shaders, and the specks lit on the processor once, as they
always were, rather than in the program). The first build of the trials kept their code in the
programs behind switches that were off, and **the page with every trial off drew half as slowly
again** without a graphics card (about 100 ms a picture on a laptop where it had been 70, 175 on a
phone where it had been 110) — a graphics card runs a switched-off branch too. Behind `TRIALS` the
page draws **the very same picture as before, pixel for pixel**, laptop and phone, at its old speed;
`TepeMountain.trials().code` says whether the trials' code is in, and a test keeps it out.

**What made it look low-resolution**, found by photographing the page as it was at a laptop's 2×
screen and looking at it a device pixel at a time:

- **The colour**: the satellite picture was 1024 px for 15.5 km, 15 m a pixel, and blurred on
  purpose (`printed`, σ 0.7) — while at this view one screen pixel covers about 5 m of the ground.
  Every colour was smeared over three pixels or more, and on the steep slopes, which the page raises
  1.6 times, stretched further down them. This is most of it.
- **The heights**: 40 m apart and softened (σ 0.6), out of Mapzen's tiles, which in Greece are
  EU-DEM (about 30 m, itself SRTM and ASTER blended); the triangles over the mountain were every 60
  m. Ridges came out rounded and **the coast a saw-tooth**, the water's edge running along the
  triangles.
- **The dither**: its steps were a css pixel each — a 2 × 2 block of device pixels on a laptop, 3 × 3
  on a phone — in Bayer's fixed cross-hatch, which reads as a coarse screen laid over everything.
- **The air**: the haze and the mist lower the contrast, and low contrast reads as soft.
- **On a phone**, the drawing was capped at two device pixels a point when the screen has three,
  and on a slow machine `window.Sharpness` lets it down further.

**The search** (the web, and a second agent sent to check every open source for this exact square):
nothing open is finer than **Sentinel-2's 10 m** for the colour — the Greek Cadastre's half-metre
orthophotos and Copernicus's 2 m mosaic are not licensed to be baked into a public page, and Esri,
Google, Bing and Mapbox forbid it outright — and nothing open is finer than **Copernicus's GLO-30**
for the heights (1 arc-second, about 24 × 31 m here; measured, it carries about twice the fine relief
of the old tiles; the 10 m EEA-10 and the Cadastre's 5 m are not open). Both are on AWS and read with
geotiff. Past those, detail can only be **invented**: by rain (erosion), by noise, or by an AI
upscaler — and the trials say which is which.

**The trials**, each built to stand on its own (`?res=` and the word):

| word | what it does | file |
|---|---|---|
| `photo` | the satellite picture at its own 10 m, 2048 px, sharpened a little (unsharp mask 0.55) instead of blurred | `trials/athos-10m.jpg` (trials.mjs) |
| `median` | each pixel the middle of seven cloud-free summer passes (2023-07-14 to 2025-07-08, each checked for cloud over this very square) | `trials/athos-median.jpg` |
| `superres` | the 10 m picture enlarged four times by Real-ESRGAN (x4plus, run on the processor with ncnn) to 4096 px — invented detail, and says so | `trials/athos-sr.jpg` (upscale.py) |
| `dem` | the heights from Copernicus GLO-30, laid on the square at 1536 (10 m, Catmull-Rom), the triangles every 20 m over the mountain (`fineMesh`) | `trials/heights-dem.png` |
| `erosion` | the same, with 1.3 million raindrops run over it (Beyer's droplets, as Sebastian Lague wrote them) carving gullies finer than the survey, never more than 14 m | `trials/heights-eroded.png` |
| `mesh` | the old heights, the triangles every 20 m and smooth between the heights (Catmull-Rom, not straight facets) | — |
| `normals` | the light worked out at every pixel off a 2048 px map of the ground's slope, made in the browser | — |
| `shore` | land or sea decided at every pixel off the heights near the sea (the slope map's fourth channel), not at the triangles' corners | — |
| `raymarch` | the ground found by a ray marched from the eye through a 2048 px map of the heights, for every pixel over the mountain's square — exact at any size, its edge against the sky as fine as the window (`RAY_FS`, a box drawn round the square, `EXT_frag_depth`) | — |
| `detail` | fine relief invented from two scales of noise, rougher on rock, faded out before it would flicker | — |
| `shadows`, `ao` | the light baked by the tool for the page's own sun and exaggeration: how much of the sun each place sees (soft shadows), and how much of the sky (hollows darker) | `trials/light-*.png` |
| `relief` | a second, softer light from the window's upper left, as a relief map is shaded | — |
| `aniso` | anisotropic filtering of the colour, the slope map and the light: a slope seen at a slant sampled along it | — |
| `native` | the screen's every pixel, three a point on a phone, never let down | — |
| `accum` | while the view barely moves, every frame shifted a part of a pixel (Halton's sequence) and laid over the ones before, up to 16 deep (`begin`, `end`, half floats) | — |
| `ss2` | drawn at twice the pixels each way and brought down by a tent | — |
| `fxaa`, `cas` | a pass that smooths jagged edges (FXAA), and one that sharpens by contrast (AMD's CAS) | — |
| `ditherfine`, `bluenoise`, `levels`, `nodither` | the dither a device pixel to a step; a blue noise instead of Bayer's (void and cluster, made in the browser); 128 steps, not 34; none | — |
| `finespecks`, `nospecks` | the specks round, soft-edged and half as many again; none | — |
| `trailsgl` | the trails drawn into the ground itself, off a 2048 px map of how far each place is from a trail and where along it — on the slopes exactly, a pixel and a half wide however far off, hidden by the ground in front pixel by pixel, dashed and walking | — |
| `contours` | lines of equal height on the mountain every 50 m, every 250 m firmer, a pixel wide at any distance | — |
| `lines` | a new way to draw it: the ground as an engraved map — the paper, the photograph washed in, contours every 20 m and every 100 m firmer | — |
| `clear` | clearer air: a third of the haze and the mist, half the banks | — |
| `closer` | the mountain a third larger in the window | — |

**The specks are lit in the program now**, as the ground is (`speckLight`): each carries its ground's
own colour, hollow and slope, so every trial that changes the light changes theirs too — lit on the
processor, they stood as pepper over the shadows and the relief. For the page as it was this is the
same light, the same arithmetic in another place.

**What they showed** (the gallery published for the owner has every one beside the page as it was,
a slider between them, at the summit, the sign, a trail and the shore): the gains are in **the colour
at 10 m** (most of all), **the Copernicus heights with the finer triangles**, **the dither a device
pixel**, **the coast a pixel at a time**, **the trails drawn into the ground**, and **the pictures laid
over each other**; on a phone, **the screen's every pixel**. The light and shade trials (`normals`,
`shadows`, `ao`, `relief`, `detail`) are slight on their own — the satellite's picture carries most of
what is seen — and add up in the combination. `ss2` is `accum` at four times the cost; `fxaa` softens
as much as it smooths; `cas` sharpens but rings white along the crest. `best` is `native`, `accum`,
`ditherfine`, `dem`, `normals`, `shore`, `aniso`, `photo`, `shadows`, `ao`, `trailsgl` and
`finespecks`.

**What each would cost, kept**: `photo` is 1.4 MB to download where the colour was 0.2; `dem` 2.4 MB of
heights where they were 0.16 (at 20 m, all the survey holds, it would be about 0.6) and four times the
triangles; the light 2 MB (1024 px would do, at half a megabyte); `accum` almost nothing but a slight
smear while it turns fast; `raymarch` heavy for a phone's graphics chip; `native` 2.25 times the pixels
on a phone. Here, without a graphics card, `?tepe=full` draws a picture in two to four seconds and
`raymarch` in eleven.

### The realism trials (2026-10-21, later)

*(Gone since the last round of the day, with the switch and all its code, but for what the owner kept — see* ***The page's own look*** *below. Kept here for the reasoning.)*

The owner, on the resolution trials: *"okay, so those were pretty fine, but i still want it better;
I want it to feel as realistic as possible. I then want you to research ways to add effects that
hide it being lower quality. Can you do that? Be as comprehensive as you can, and search as much as
you can"* — and *"Don't push yet"*.

**Four searches**, each by an agent of its own, the web and the open archives: **the camera and its
film** (tone curves, grain, bloom, lens effects: what hides a lack of detail and what gives it away),
**the light and the air** (sun and sky in light's own units, aerial perspective, haze measured over
Athos, the sea), **detail that is not in the data** (crowns, rock, detail textures, super-resolution),
and **every open source of real data for this square** (paths, buildings, land cover, canopy heights,
the sea's depth, the sun). What they found that matters most:

- **The colours are the screen's, not light's.** The page lit its ground by multiplying the screen's
  own values; a real slope's light is warm from the sun and blue from the sky in its shade, and only
  adds up to white on level ground.
- **The haze was one colour at one thickness**, taken from 2.3 half-widths off the eye. Real air takes
  the blue first (the far land goes blue and pale), lies thickest low down (the foot in haze, the
  summit clear), and is brighter towards the sun. Over Athos it is measured: at Ouranoupolis, the
  peninsula's neck, the aerosols' optical depth is 0.3 to 0.5 in summer (Formenti and Balis, ACP 2003).
- **ESA's own picture is already corrected for the slopes' light — a little too far.** Sentinel-2's
  L2A colour has the terrain's shading taken out by Sen2Cor, and over Athos it overshoots: fitted over
  the dense forest, the slopes turned to the satellite's sun come out *darker* (brightness 54.6 − 14.0 ×
  how much a slope faced its sun). Sen2Cor's over-correction is reported on ESA's own forum.
- **Real tree crowns exist, open, at a metre**: Meta and the World Resources Institute's **Canopy
  Height Map v2** (CC BY 4.0, on AWS), the height of the trees everywhere, made by a model from very fine
  satellite pictures. From this view, forest is mostly its crowns: each lit on its sunny side, shaded
  on the other, and throwing its shadow on the next.
- **Real paths and buildings**: OpenStreetMap's, through the Overture Maps Foundation's open release
  (GeoParquet on AWS, no account); OpenStreetMap's own servers are not reachable from here.
- **A picture taken from straight above has few pixels for a cliff**, and smears it down the slope: the
  summit's steep faces were streaked. Athos's top is white marble, which breaks in joints and gullies,
  never in layers (Springer 2011).
- **The 1-css-pixel Bayer dither** shows most in the smooth sky and haze, where realism lives; a film's
  grain hides banding without a pattern. The digital look was the owner's ask (2026-10-20), so the
  grain is a trial and the choice theirs.
- **What would give it away and was left out**: depth of field (a mountain this far off blurred reads
  as a model — the tilt-shift look), a lens flare and god rays (the sun is out of the frame), motion
  blur, a lens's distortion, a strong vignette.

**The trials**, the same switches on the address as the resolution's (`?res=` and the word):

| word | what it does | file |
|---|---|---|
| `tonemap` | the finished picture through a film's curve, Khronos's PBR Neutral (it keeps the colours' hues), drawn first with light to spare in half floats where the machine has them; 12% more exposure, the curve taking 4% off the dark as a lens's flare would add | — |
| `agx` | the same through AgX (Troy Sobotka's, Blender's) with its "punchy" look, 60% more exposure | — |
| `bloom` | a few per cent of all the light spread by the lens, no threshold (Jimenez's down-and-up blur, Karis's weighting on the first step), and its widest laid over all as the lens's veil of glare | — |
| `halation` | a film's red-orange round its brightest edges | — |
| `vignette` | the lens darkening its corners, the cosine to the fourth, 15% at most | — |
| `aberration` | the lens parting its colours towards the corners, a third of a css pixel | — |
| `clarity` | the broad shapes' contrast lifted against the glow's blur, never the pixels' | — |
| `grade` | the blacks lifted a little, the shadows cooler and the light warmer, the greens a little quieter | — |
| `grain` | a film's grain — soft-edged, a cell a little under a css pixel, strongest in the middle tones — **in place of the dither's steps**, with one invisible step of the screen's own at random under it | — |
| `sensor` | a digital camera's noise in place of the dither: as much as its light, and a little always | — |
| `light` | the sun and the sky in light's own units (the photograph's colours undone from the screen's curve): a warm sun, a blue sky in the shade, a little light thrown up off the ground, adding up to the page's own white on level ground; a cloud's shadow takes 40% of the sun, not 12%; with `shadows` and `ao`, their maps each on its own light (`SUN_LIGHT`, `sunLit`) | — |
| `haze` | the air worked out in kilometres, from the eye, per colour (Rayleigh's and the aerosols', the blue lost 1.3 times as fast), thinning upward (the sea's haze under 750 m, the rest to 2.4 km), lit by the horizon and brighter towards the sun (`AIR_KM` 0.035 per km, `airOf`); the low mist 40% thinner and the banks 30% fainter, since the air does part of their work | — |
| `sky` | a summer sky a little over a right angle from the sun: blue overhead, paling to near white at the horizon, the haze taking its colours, in place of the page's paper-coloured one (`SKY_REAL`) | — |
| `delit` | the 10 m picture with Sen2Cor's over-correction undone: the fit above inverted over the land, so only the page's sun lights the slopes | `trials/athos-delit.jpg` (trials.mjs, with `ndvi.png`) |
| `sea` | the sea as sea is: mostly the sky in it this low (2% given back straight down, Schlick's form of Fresnel's), over deep water's dark; rougher in lanes of wind and glassy in slicks between them, the glassy giving back the sky the more sharply. No shallows wider than a few metres — the sea floor drops to 500 m within 4 km (GEBCO) | — |
| `canopy` | **the trees' own crowns**, out of Canopy Height Map v2 at 1.83 m, lit by the page's sun: each crown's sunny side, shaded side and the shadow it throws (marched towards the sun, the ground's own slope counted: a shadow falls longer down a slope turned from the sun; only the sky lights the crowns of a slope turned from it), and how deep a gap lies in the canopy — written as **a share of the light round it within the satellite's own 10 m pixel**, so the colour is kept exactly as it is on average (0.988) and only what lies inside its pixels is added. 4096 px, 3.8 m; stored as itself, not its logarithm, so a picture made smaller for the distance averages to the satellite's colour | `trials/canopy.jpg` (trials.mjs) |
| `rock` | **the marble**: on the steep, bare faces (pale, not green), fine gullies cut down the fall line — a few metres apart across the slope, long down it — lighter on their ribs and darker in their grooves, their slopes lit, gone where they would be finer than a pixel | — |
| `osmtrails` | OpenStreetMap's real footpaths to the summit in place of the page's invented trails: the shortest way by its paths and tracks (a footpath preferred) from the sketes of Agia Anna (6.8 km), Kafsokalyvia (9.0) and Prodromou (12.6), and the Great Lavra (15.1), with the page's numbers and blazes | `trials/athos-osm.json` (`tools/apoteker/osm.py`) |
| `buildings` | its monasteries, sketes and chapels: the 95 largest of OpenStreetMap's buildings in the square, raised from their footprints — pale stone walls, roofs half the colour the satellite saw them and half lead and slate — lit and hazed as the ground is | `trials/athos-osm.json` |
| `real` | as realistic as it can be made: `best`, and `delit`, `light`, `haze`, `sky`, `sea`, `canopy`, `rock`, `osmtrails`, `buildings`, `tonemap`, `bloom`, `vignette` and `grain` | — |
| `realdither` | the same keeping the page's digital dither, not the film's grain | — |

**Fewer than a hundred of OpenStreetMap's features** — four paths and 95 buildings — which the
OpenStreetMap Foundation's guideline counts as an insubstantial extract, so the file in this public
repository needs no licence of its own; the page credits them (**© OpenStreetMap contributors**, ODbL)
in the mountain's credit while either trial is on, and the trees' crowns (Meta and WRI, CC BY 4.0)
while `canopy` is (`tepe.js`). A test says so.

**A fault found on the way, in the resolution trials**: `shore` counted the whole of the sea inside
the mountain's square as its shore (its depth there was held at a hair, `0.0008`), so the foam line's
pale was laid over all of it, and the square's edge showed as a straight line across the sea once the
sea was darker. The sea's depth now grows away from the land, read off the land's heights near it
blurred (`nearL`).

**What they showed** (a second gallery, *The Athos Realism Trials*, every one beside the page as it
was): **`real` reads as a photograph** — a long lens's view of a mountain in summer air, the foot in
haze and the summit clear, the far land blue and pale, the sea dark and giving back the sky, the ridges
and the marble crisp — where the page as it was reads as a drawing. Most of that is **`haze`**,
**`light`**, **`sea`** and the resolution's `best` under them; **`grain`** in place of the dither takes
away the last of the pattern laid over it. `canopy` and `rock` are fine detail, seen close (a crown's
texture inside the forest's colour, gullies on the summit's faces) more than from the whole window.
`tonemap` deepens and enriches; `agx` brightens and greys the sky; `bloom`, `vignette` and `clarity` are
slight, as they should be; `halation` and `aberration` all but invisible. `sky` and `delit` change the
look more than the detail. `buildings` are a few pixels across from here — the monasteries are there,
small; `osmtrails` puts the real paths on, the zig-zags near the top the real switchbacks up the south
face, which at this size read as short red smudges. Without a graphics card, and with other work
running beside it, `real` took 30 to 60 seconds here from the page opening to its first settled
picture, as `best` did; apart from the canopy's 4096 px picture, what it adds to `best` is arithmetic
in the programs, but none of it was timed on a graphics card.

**A fault in the photographs, not the page**: the first pictures of `real` carried pale vertical
veils. They were the frames laid over each other (`accum`) still holding the ones drawn before the
photograph hid the writing — the writing's columns quiet — because the photographing script waited
one frame for `real` (it waited twenty-four only for words with *best* or *accum* in them). Settled,
they are gone.

### The looks (2026-10-21, last)

*(Gone since the last round of the day, with the switch and all its code, but for what the owner kept — see* ***The page's own look*** *below. Kept here for the reasoning.)*

The owner, with a picture of Athos in false colour — a magenta sky, an indigo sea, cyan and teal at
the coast, green land and peach on the ridges, a glowing rim along the shore, a fine halftone over it
all, and white line drawings over that (dashed trails, an eye at the summit, an arc ending in a ring,
steps, an arch, a seal of lettering round a sign): *"i want you to add effects to it too, so that it
looks unique, and not entirely lifelike. i have uploaded an image which should not be 1:1 but rather
inspiration. I want it to have effects that make it look cool. Before you run your tests and all
that, give me some options about what to do."*

**The options put to them**, four questions: a colour (*a sunset gradient*, *infrared film*, *a
two-ink print*, *the real colours*), a texture (*halftone dots*, *the digital dither*, *engraved
lines*, *film grain*), line art (*an icon per fragrance*, *abstract shapes*, *a turning seal*, *none*)
and extras (*a glowing coastline*, *colour haze to the horizon*, *glowing contour lines*, *a slow
colour drift*). **Their answer, to all four**: *"I want you to create a temporary setting on the
bottom right of the page where i can cycle through them"* — *"Also allow a setting on the bottom right
to toggle these and see them in practice"*. So every one of them is built, and **a panel** chooses.

**`?res=style` on the address** puts the panel at the bottom right of the page and the looks in the
drawing; `?res=real,style` lays them over the realistic one. Everything the panel changes is a uniform
of the programs (`uStyle`, `uStyle2`, `uStyle3`, `uPal`, `uHalf`), so a press changes the picture at
once and nothing is made again; it is kept in the address as `fx=` (`fx=sunset,halftone,icons`),
so a reload or a link shows the same. Opened without `fx=`, it shows **the sunset gradient in halftone
dots, the icons, the glowing coastline and the colour haze** — what was closest to the picture.

| row | the choices | how |
|---|---|---|
| Colour (gone round by its arrows) | **Real colours** — the drawing's own · **Sunset gradient** — the light and the height turned into a gradient: in shade and low a deep blue-teal, then teal and green, then a pale yellow, and peach where it is sunlit and high; the sea cyan by the coast to indigo and violet in the deep, the gradient's sky in it towards the horizon; the sky peach at the horizon to pink, magenta and violet over it · **Infrared film** — as Kodak's Aerochrome saw: the near-infrared printed red, the red green and the green blue, so what grows comes out crimson and the rock pale, the sky a deep blue and the sea near black; over the mountain its near-infrared is the satellite's own (its NDVI, `trials/ndvi.png`), round it guessed off the colour · **Two-ink print** — a deep blue and an orange on paper: the shade blue, the sunlit ridges orange, the lightest the paper, in four terraces of tone | `PALETTES` in `tepe-gl.js`, each three ramps of five (`styleLand`, `styleSea`, `paletteSky`, `terraced`); infrared its own arithmetic |
| Texture (each on or off) | **Halftone** — four inks, cyan, magenta, yellow and black, each on its own screen turned to its own angle (15°, 75°, 0°, 45°), a dot 2.7 css px apart as large as the ink's share; the three colours each a part of a pixel out of register, as a risograph prints; the black only for the darkest (`k = 0.7 K^2.2`), so the dark stays coloured · **Dither** — the page's own Bayer steps · **Engraved** — the tone in fine lines a little over 3 css px apart, each as thick as the place is dark: on the ground along its heights, on the sea along its depths (a chart's), the sky in level rows; two scales of the lines faded into each other, so as many to the window wherever they are; no specks over them · **Grain** — the film's, as the realism trials have it | the halftone, dither and grain done to the finished picture (`POST_FS`, `halftone`, `screenOf`); the engraving in the ground's own program (`engravedAt`) |
| Line art (each on or off) | **Icons** — at each fragrance's place, on a short stem, a white line drawing of what it is: an eye in a triangle (The Holy Mountain), a plateau under the sun (Kogen — the high plain), a crescent and a star (Brother Night), a crow in flight (Karasu — the crow), a cut crystal (The Peradam), a flame (Pale Fire), steps going up (Anabasis — the going up), waves under a rainbow (After the Flood); and the trails white, dashed, their numbers and blazes white · **Shapes** — geometry in the mountain's air, meaning nothing in particular: an arc from over the summit to a ring on a slope, a stair of six steps up a trail, an arch standing on the ground, three dashed rings round a trail's foot, sights on three places, a plumb line ticked up from the summit — all of it in the ground's own space, turning with it · **Seal** — fixed to the window, the house's sign in a ring of the picture's own words, *CAUSA LATET VIS EST NOTISSIMA FONTIS* (Ovid, *Metamorphoses* IV: the cause is hidden, the power of the spring well known), turning once in 150 s; at the bottom left of a wide window, under the button at the top right of a phone's | `tepe.js` (`artAgain`, `iconPath`, `drawArt`, `drawSeal`), on the trails' canvas |
| Extras (each on or off) | **Coastline** — a line of light a few pixels wide where the land meets the sea, and a fainter glow round it, in the gradient's peach (a magenta for infrared, the orange for the print) · **Colour haze** — the air, the haze and the mist in the gradient's colours (the sunset's, with the real colours), so the far land melts into the sky · **Contours** — glowing lines every 100 m and every 500 m brighter · **Drift** — the gradient's hue turned a little and back, and its ramps shifted, every 80 s (with the real colours, the day's light warmer and cooler) | the coastline and contours a second pass of the ground over its specks, adding only light (`GLOW_FS`); the haze by the sky's own colours; the drift off the clock (`DRIFT_EVERY`) |
| Base | **As it is** — the page's drawing · **Realistic** — `?res=real` under the looks; a reload, keeping the looks | links |

**What does not change**: the page without `?res=` is **the same to the pixel** as before — compared
on a laptop's and a phone's window against the last commit, not one pixel differs — and none of the
looks' code is in its programs (`#ifdef STYLE`, inside the trials' own `#ifdef TRIALS`).

**Behind the writing** the looks go quiet with the mountain: it goes the way to **the gradient's own
sky** where that is drawn (`behind`), not to the page's paper-coloured one, which would have stood
behind the words as a pale band; **the halftone's dots fade with it** to an eighth of their contrast
where the drawing is quiet (`0.12 + 0.88 × quiet`) — the first pictures had the words over a busy field
of dots, on a phone everywhere; the glowing lines and the line art lose their opacity as the trails do.

**What they showed**, by eye, here: **the sunset gradient with the halftone and the colour haze** reads
most as the picture did — a print of a mountain at dusk, the coast a rim of light; without the colour
haze the far land goes to a pale grey, which reads as washed out against the magenta. **Infrared** is
the most striking: a crimson mountain in a blue world. **The two-ink print** is the most graphic,
blue and orange. **Engraved** reads as an old engraved map, the far land in swirls of contours, the
peak in close level lines. **The line art** is small at a laptop's size; the shapes and the seal are
decoration, the icons the most use (they say where each fragrance is). On a phone the panel takes the
lower quarter of the window; **Hide** folds it to its head.

**Without a graphics card** (`soft`) the looks' colours, the line art and the seal are drawn, but not
the halftone, the dither and grain of the finished picture, the engraving or the glowing lines: the
picture is not laid down again there, and the glowing lines need a second pass of the ground. Nothing
of it was timed on a graphics chip; it costs the finished picture's pass while `style` is on, and a
second pass of the ground while the coastline or the contours are.

### The page's own look (2026-10-21, last)

The owner, having gone round the panel: *"okay, then i want you to to remove the mnu, make it
realistic, give it grain, two ink print, colour haze, drift, but make the colours slightly lighter and
less contrasted. I also want you to make it easier to look at; and the text easier to read. Make it
look appealing. Also please make sure that the reaslitic version doesnt kill the CPU or RAM"*.

**What was kept, and is now simply how the page draws** — no switch on the address, on every visit
(`PAGE` in `tepe-gl.js`: the house's own page only; the Houses view's fragments are drawn exactly as
they were — the programs it compiles were compared, as the graphics card reads them, against the
last commit, and are the same):

- **The realistic drawing** (`REAL`, with a graphics card): what `?res=real` was — the ground at 10 m
  (Copernicus GLO-30, its slopes and its coast worked out a pixel at a time), the light baked and in
  light's own units, the air as air is, the satellite's colour at 10 m with its morning taken out,
  the trees' own crowns, the marble's gullies, the sea as sea is, **OpenStreetMap's four real paths
  drawn into the ground** (Agia Anna, Kafsokalyvia, Prodromou, the Great Lavra — in place of the six
  invented ones, which the Houses view keeps) and its monasteries raised — through **the camera**:
  the pictures laid over each other while it stands still, a little glow, the corners darkened, a
  film's curve.
- **The two-ink print** over all of it: a soft blue and an apricot on warm paper (`PAPER_INK`,
  `INK_A`, `INK_B`, `inks()`), the sky from the horizon up, the sea from the coast to the deep, the
  land from shade and low to sunlit and high (`PRINT`, `printSky`, `printSea`, `printLand`).
- **Grain**: the film's, as the realism trials had it (`CAMERA.grain`), in place of the dither's
  steps — and **a third as strong behind the writing** (`grainQuiet`), so the words stand on a calm
  ground.
- **Colour haze**: the haze, the air and the mist in the print's own colours (`PRINT_AIR`).
- **The drift**: the inks' hue turned a little and back every 80 s, and their ramps shifted
  (`DRIFT_*`) — gentler than the trial's (0.26 radians and 0.06, where it turned 0.34 and 0.07). It
  is still with reduced motion.
- **Without a graphics card** (`LITE`, this machine and a test's): the lighter drawing it always had,
  in the print's colours, dithered as it was, the real paths drawn over it on the trails' canvas.

**Slightly lighter and less contrasted.** Every ramp of the print was brought half way nearer the
paper and nearer to itself: the sky's horizon a third of the apricot where it was nearly half
(`inks(0, 0.34)` against `0.45`), its top 48% of the blue against 55%; the sea's deep 81% blue against
90%; the land's darkest 88% blue and 35% apricot against the whole of the blue and 40%, its sunlit 64%
apricot against 70%; **the terraces softer** (`TERRACES` 0.24, it was 0.3); and the realistic sea's own
light moves the print's less (0.86 + 0.28 of it, against 0.82 + 0.36). **Tried and not kept**, both
measured on the same picture against the trial's: the whole of that step (the sky's horizon a quarter of
the apricot, the land's darkest 78% blue) — a fifth lighter and half the contrast, calm but more than
"slightly"; and lighter still (the horizon nearly the paper, the land's darkest 70% blue) — foggy, the
far land washed into the haze and the two inks lost.

**Easier to read.** Besides the lighter print behind it and the grain quieter there: **a soft halo
of the print's paper round every letter** of the writing, the credit and the foot (`text-shadow`,
7px and 2px, only while the mountain is drawn), as a map's names have — the words stand off the
drawing behind them with nothing laid over it (the veil the owner did not want stays gone); and the
page's quieter ink a little darker (`--muted` #4f5745, it was #5f6652), for the subtitle and the
readings. A halo in ems was tried first, and round the title it was a 50px glow; it is in pixels now.
The quiet behind the writing is still Ataraxia's (`QUIET`, 0.26).

**Gone, with all their code** (the owner's rule: what is not kept comes out): the switch `?res=` and
every trial not kept — the resolution's (the 10 m picture as it was, a median, the AI's enlargement,
erosion, the ray through the heights, twice the pixels, FXAA, CAS, the screen's every pixel, the
dither's kinds, contours, an engraved map, clearer air, closer), the realism's not kept (AgX,
halation, aberration, clarity, the grade, a camera's noise, a blue sky), and **the looks** but the
print, the grain, the haze and the drift (the sunset gradient, infrared, halftone, engraved lines,
the dither as a look, the icons, the shapes, the seal, the glowing coastline and contours) — and **the
panel**. Their pictures (`mountain/trials/`) went too, but for the five the page now draws from,
which moved to **`mountain/fine/`**: `heights-10m.png`, `colour-10m.jpg` (the de-lit picture),
`light.png`, `canopy.jpg` and `athos-osm.json`; the light and the canopy made again at half their size
(1024 and 2048 — the mean of each square of four, so the light and the trees' share keep their
averages). `tools/apoteker/trials.mjs` is **`fine.mjs`**, writing only those; `upscale.py` is gone.
Old addresses with `?res=` and `fx=` simply draw the page's own look. **The credit names every source
the page now draws from, always**: GLO-30 (© DLR and Airbus, under Copernicus), the Sentinel-2 scene,
Meta and WRI's Canopy Height Map v2 (CC BY 4.0) and OpenStreetMap's contributors (ODbL), beside
Mapzen's tiles, which the lighter drawing and the Houses view still use.

**Within its means.** Measured here before and after — the browser and every process under it, on
this machine's processor (no graphics card: the realistic drawing forced with `?tepe=full`, which
shows what it asks of a machine rather than how fast a graphics card would be), a laptop's window
(1440 × 900, two pixels a point) and a phone's (390 × 844, three):

| | memory | at most | a picture takes | ready in |
|---|---|---|---|---|
| laptop, before | 1,575 MB | 1,828 MB | 13.4 s | 95 s |
| laptop, now | **1,225 MB** | **1,344 MB** | **7.8 s** | 69 s |
| phone, before | 1,280 MB | 1,513 MB | 6.5 s | — |
| phone, now | **749 MB** | **755 MB** | **1.9 s** | 6.5 s |

(The page as it was before the trials, without the realistic drawing: 1,019 MB and 3.9 s on the
laptop, 643 MB and 1.0 s on the phone.) What made the difference:

- **never more than two pixels to a point** — the trials' `native` drew a phone at three, more than
  twice the pixels; the drawing takes `window.Sharpness`'s, which also lets it down on a slow machine;
- **no smoothing of the window's own** (`antialias` off with the page's own look): the pictures laid
  over each other smooth its edges already, and a smoothed window is four times its memory;
- **one picture of the history, not two** — the blending lays each new picture over it
  (`CONSTANT_ALPHA`), where a program read one and wrote the other — and **the picture drawn into in
  bytes**, not half floats (its colours are the print's, within the screen's); the history keeps its
  half floats, so many pictures add up smoothly;
- **the mesh 900 across, 640 on a phone** (it was 1100 — 1.2 million corners, now 810,000 and
  410,000), its triangles' corners written straight into the numbers the graphics card takes (they
  were a list of numbers first, five times the memory);
- **the maps smaller on a phone** (`MAP_PX` 1024, a quarter of the memory) and the colour picture
  read at 1024 there; the light at 1024 and the trees at 2048 for everyone (they were 2048 and 4096);
  **the processor's copy of each map let go** once the graphics card has it; the trails' map made in
  a third of the memory;
- **the specks a fifth more on a laptop, as many as ever on a phone** (the trials' were half as many
  again everywhere);
- **drawn at the pace it needs** (`tepe.js`): up to 60 pictures a second while the page is scrolled,
  the free view turned or the camera on its way (`FRAME_BUSY`; a screen at 120 gets 60, not 120),
  **30 while only the mist, the clouds and its breathing move** (`FRAME_IDLE`), 12 while the window is
  not in front (`FRAME_AWAY`, so it still moves when clicked off, as every page does), and **none
  while it cannot be seen**. `TepeMountain.drawing()` says which.

**Without a graphics card** the print's colour arithmetic, done for every pixel, first made the
lighter drawing **twice as slow** (a picture 200 ms on a phone's window where it was 96, 98 on a
laptop's where it was 54). Now **its three ramps are read off a little picture of them** (`paletteTex`,
`skyInk`, `seaInk`, `landInk` — on the processor a picture read is a third of the arithmetic), **made
again turned by the drift's hue whenever it turns** (768 colours, not every pixel; with a graphics card
the turn is a matrix, `uHue`, worked out once a picture), **each pixel looks up only the land's ramp or
the sea's**, the coast a clean switch, **the specks are put in the inks once, as they are laid**
(`printLandAt`), the sea's reflection of the sky is left out, and the quiet's colour is worked out
everywhere rather than behind a test, which on the processor costs more than it saves (with a graphics
card it is worked out only where the drawing is quiet at all): **109 ms on a phone's window and 65 on a
laptop's**, a tenth over the plain page's (100 and 57, measured beside it), which is the print itself.
(Tried and slower: the land's colour and the sea's each worked out behind a test, only where it shows —
the processor pays for both sides of a test.) **And the little picture is read nearest, not blended**
(`gl.NEAREST`): a blended read on the processor is four reads, and the print's reads were most of that
tenth — the sky 13 ms where it was 10, the ground and its specks 87 where they were 73. Read nearest, the
sky is 10 again and the phone's picture **106 ms against the plain page's 101**, and its frames while
being read **43 to 46 a second against 42 to 48** (three times each, beside each other); a picture taken
both ways differs nowhere by more than one of the dither's steps — 256 steps in the picture are finer
than the dither's 34. (The phone's speed test failed once in the full suite at 36 frames a second
while read, beside another file's heavy page, before this.)

It was not measured on a graphics card or a real phone here; there the drawing runs on the card, the
processor only sending it the frames, and the memory above is mostly the card's, which this machine
holds in its own.

### The mountain taken out (2026-10-22)

The owner, the morning after the page's own look went live: "yk what, just remove it for now, i will
redesign the whole thing. remove the mountain" — and, asked whether its fragments on the Houses view
should go too, *remove those too*. So, as every removal on this site is, **it came out of the code,
not switched off**:

- **The page** (`houses/apoteker-tepe.html`): its drawing (`canvas.human-field`), the mountain's
  credit under the pictures' (`.house-credit-ground`, which named Mount Athos, GLO-30, Mapzen,
  Sentinel-2, the Canopy Height Map and OpenStreetMap), and its three scripts. It is the house's shape
  (`house.js`), its notes, and the owner's writing and pictures on **the house's aged paper**, the
  paper the mountain was drawn over — its tokens, its corner shading, its green and its pencil kept.
- **Its scripts**: `tepe.js` (the turn, the quiet, the trails, Free view and its nodes, the pace),
  `tepe-gl.js` (every program the mountain was drawn with, for the page and for the Houses view) and
  `tepe-data.js` (the heights' picture's address, the trails, the places, the sign) — deleted.
- **Its pictures**, `images/Apoteker Tepe/mountain/` (the heights at 40 m and 10 m, the satellite's
  colour, the baked light, the trees' crowns, OpenStreetMap's paths and buildings), and **its tools**,
  `tools/apoteker/` (`mountain.mjs`, `fine.mjs`, `osm.py`) — deleted, and **image-js and geotiff**,
  which only those tools used, out of `package.json`. The house's sign (`Apoteker Tepe Logo.webp`)
  is kept: the owner's upload, used nowhere now, for the redesign.
- **The Houses view**: Apoteker Tepe's line in `HOUSES` in `motifs.js` (`ridge`, its fragments of the
  mountain and their trails) and `HouseMotifs.ridges()` — so the house at the front brings nothing up
  until it has motifs of its own again; its frame keeps `data-motif="apoteker-tepe"`, which names
  nothing for now; the page no longer loads `tepe-data.js` or `tepe-gl.js`.
- **The stylesheet**: everything the mountain and Free view had — the halo round the writing that
  kept it read over the drawing, the trails' canvas, the drawing's coming up, Free view's button,
  stage, hint, nodes and cards, the cue's ground "so the mountain never stands over its word", the
  mountain credit's spacing. The pictures standing a little further off, *when it was made* and the
  page's colours stay.
- **The tests**: the mountain's (solid, dithered, turning, quiet, quick, Free view, reduced motion,
  the motif, the tools, and the whole of `tepe-look.spec.js`) went with it; the house's own stay, and
  new ones say it is gone. The Houses view's "every house has motifs of its own" test makes
  Apoteker Tepe its one exception (`NO_MOTIF_YET`) until it has its own again; the phone's "every 3D
  drawing at two device pixels" no longer lists it.

Everything above this section is what the mountain was and why, kept for the redesign; it is in the
repository's history, whole, at the commit before this one.

### The mountain photographed, behind frosted glass (2026-10-27, a trial)

The owner, with five photographs uploaded as `images/Apoteker Tepe/AT MOUNTAIN 1.webp` to `5` and the
Musica 2011 poster (a horse behind frosted glass, seen sharp through a clear rectangle in it): "For apoteker tepe, remove the mointain as it is currently, and i want you to
replace it with one of the files from AT MOINTAIN 1-5. I want you to replace it with all pf ghe, and
then let me see how its goimg yo look with each of them do this with a top right setting which allows
you to switch between the pictures. Add optional filters too so that i can have fun with it before
settling kn a final version. The mountain should be blurred out, except for a mask on the right-ish
middle of yhe screen, inspired by the image provided in this message."

**The pictures are the owner's own**: each carries the site's own mark (H₂C=O, the icon's drawing)
in its lower right corner, so they are credited as theirs at the foot of the page — *The mountain
behind the page is my own photograph.* — on that reading (the question is put to the owner).

**What it is** (`tepe.js`, a new script under the old name; `canvas.human-field.tepe-photo`):

- **The frost**: the photograph laid over the whole window — placed so its peak stands in the window
  (`PICTURES`: a `focus` and a `zoom` for each, chosen by eye) — blurred out (`blur`, 8 + 1 css px a
  step) and **misted towards the house's paper** (`mist`, `PAPER`), as the poster's glass is pale.
- **The window**: **a sharp upright rectangle** of clear glass on the right-ish middle, as the
  poster's is — later the same day, before any of it went up: "I want the mask to be a sharp
  rctangle, as it was with the horse picture." (`windowRect`): 2 : 3 (`TALL` 1.5), round
  `CLEAR_AT` — 0.775 across and half way down on a wide window (to the right of the paragraphs, under
  the parts' rows; 316 by 476 css px on a laptop), 0.68 on a phone (137 by 205) — never more than
  0.86 of the window high. Inside it the mountain sharp and clear (the mist cleared, `GLASS` 0.9);
  outside it the frost, **misted right up to its edge**, and **the edge cut on whole pixels of the
  screen**, so there is a step from the one to the other and nothing between. **Window** is its size;
  **Edge**, which starts at 0, softens it for a look (`EDGE_MOST`: at 100 eased over 0.45 of its
  narrower side, a ring a little less blurred round it, `LIGHT_BLUR`). Across and down are worked out
  apart and multiplied (`along`), a rectangle being the one shape that can be, so it costs nothing.
  **On a phone** a picture is brought no nearer than 1.15 (`PHONE_ZOOM`): laid over a tall window by
  its height it is far nearer already, and the third showed only grass.
  (**For its first round it was an irregular upright shape** — its outline three slow waves of its
  own, sharp at its heart, a ring a little soft round it, then the frost, the poster read wrongly as
  the horse sharp only where it touched the glass — on small masks blurred out at their edges. It came out with
  the rectangle: no `windowMask`, no masks at all.)
- **The panel** (`.tepe-try`): a boxed button at the top right, level with the Menu — *Mountain 1 /
  5* — opening under it: **the five pictures** as thumbnails (`mountain-thumbs/`, 192 by 128), four
  sliders (**Blur**, **Mist**, **Window**, **Edge**), **a colour** (Natural, Black & white, Sepia,
  Duotone in the house's green and paper, Frost in the poster's grey-green, Warm) and **filters**
  (Faded, Contrast, Vignette, Grain, Posterise, Negative), **Reset** and **Close**. What is chosen is
  kept **in the address** (`?mountain=3&colour=sepia&fx=grain,vignette&blur=80` — nothing there for a
  default) and in the browser for the next visit (`localStorage`, wrapped so it is never needed). It
  opens shut; Escape, Close or a press on the page put it away. On a phone the button stands on the
  chrome's ground and the panel is the window's width. **It is temporary**: once the owner settles on
  one, the rest comes out of the code.
- **Easier to read**: round every letter a soft halo of the paper (`text-shadow`, only once the
  photograph is drawn), so the words read where they cross the window.

**Drawn once, not every frame.** The page scrolls over a still picture on a canvas fixed to the
window, made again only when something in the panel changes, or the window's width does (never as a
phone's bar comes and goes: it is drawn to the tallest the window has been, `tallest`). Blurring is
done on small copies, laid down large — **the frost a quarter of the pixels each way**, being blurred,
and **only the window at the whole of the window's sharpness**, in a box of its own; the
colour, filters and mist a pixel at a time on those two only; the vignette and the grain laid over the
whole as a gradient and a square of noise (`overlay`), never a filter over the window. A slider being
dragged draws it at half the pixels, and the whole on letting go. At the flat drawing's sharpness: two
to a css px at most on a wide window, 1.5 on a phone, and never more than 3.6 million pixels in all.
Measured here, without a graphics card: **a laptop's plain screen 0.05 to 0.09 s a picture, its sharp
screen 0.12 s, a phone's under 0.08 s, and scrolling 60 frames a second on both** (the irregular
window, on its masks, took 0.25 to 0.45 s on the sharp screen). (Drawn first whole at the window's
size, every layer full size, it took 0.8 s on a plain laptop screen and 1.7 on a sharp one: that is
why.)

Without the script the page is its writing on the aged paper (the canvas never comes up) and there is
no panel; with reduced motion nothing moves anyway. The Houses view still brings nothing up for the
house.

### Om's opening, in two beats

The same round, on Om Parfums. It is written in [Om's
report](2026-10-10-om-outsider-and-lost-tribe.md#2026-10-20--the-opening-in-two-beats).

## How to test it

- `npm test -- tests/apoteker-tepe.spec.js`:
  - every fragrance says when it was made, in the format, and its pictures arrive;
  - **the pictures stand a little further off**: a cut-out padded in its frame, a scene at its own
    shape, the house's picture at the Houses view's frame's;
  - **the credit** names apotekertepe.net and Scentorium, and the mountain as the owner's own photograph
    (and nothing of Mount Athos);
  - **behind frosted glass**, on a laptop and on a phone: the photograph drawn, the window right of the
    middle and half way down, **sharp there** (three times as busy as the frost at least) and **pale in
    the frost**, nothing sharp in it; **the window a sharp upright rectangle**, 2 : 3, round that
    middle, cut clean to begin with — all round it a step from the last pixel of frost to the first of
    the mountain (over 40, the three colours summed; measured 150 to 250) and the frost even right up
    to it (under 1 between its last two pixels; measured 0.01 to 0.1); drawn at 2 (1.5 on a phone) at
    most; not drawn again by a scroll;
    none of the 3D mountain's scripts asked for; nothing wider than the window;
  - **the panel** at the top right: *1 / 5*; the five pictures, each pressed and drawn, its thumbnail
    pressed, the button saying which, the address keeping it (nothing for the first); the thumbnails
    arrive; Escape puts it away;
  - **the colours and filters**: Black & white takes the colour out of the window; Vignette and Grain kept
    in the address with the colour; the Window slider moved; **the Edge slider softens the rectangle**,
    its edge stepping no more than the frost does; a reload brings it all back; Reset puts it back
    (the edge clean again) and clears the address;
  - **on a phone** the panel fits the window; **without the script** the eight fragrances open, no
    panel, the canvas never shown;
  - **the Houses view** at Apoteker Tepe brings nothing up and asks for none of the 3D mountain's
    scripts;
  - **none of the 3D mountain is left in the code**: `tepe-gl.js`, `tepe-data.js`, the tools, the
    pictures and `tepe-look.spec.js` gone, no page asking for them, the new `tepe.js` in no WebGL,
    nothing of the mountain or Free view in `style.css` or of the fragments in `motifs.js`, image-js and
    geotiff out of `package.json`.
- `tests/contact-sheet.spec.js`: *every house on the wall has motifs of its own* — Apoteker Tepe the
  one without, until it has its own (`NO_MOTIF_YET`).
- `tests/writing.spec.js`: *the writing inside a shut part is not counted until it is opened*, and the
  credit in front on every house.
- The house is in every house list: `houses.spec.js` (the chain both ways, the return button at
  `#house-13`, the rank of eight, the subtitle in title case), `mobile.spec.js`, `notes.spec.js`,
  `writing.spec.js`.
- `node tools/note-library/rulebook.js --check` and `python3 tools/note-library/catalogue.py
  --check` are clean; `tests/rulebook.spec.js` finds every note After the Flood names (the page's
  newest) in the library, counted for it at its tier, and opens the first one's window.
- By eye: `houses/apoteker-tepe.html` at a laptop's and a phone's size, each of the five pictures and
  a few colours and filters from the panel, scrolled from head to foot; `scent-descriptions/#house-13`,
  nothing coming up round the house.

## Known issues / TODO

- **The photographed mountain is a trial**: the owner is to choose a picture, and what of the panel to
  keep; then the panel and everything not chosen come out of the code, as always. Until then **the
  panel is on the live page for every visitor** (shut, a small boxed button).
- **The five pictures are credited as the owner's own** because each carries the site's own mark; the
  owner was asked to say if that is wrong.
- **The Houses view brings nothing up for Apoteker Tepe** (its fragments of the 3D mountain went on
  2026-10-22). Its frame still names a motif (`data-motif="apoteker-tepe"`) for whatever comes next.
- **Measured without a graphics card only**: on one, the canvas's drawing is quicker and reading its
  pixels back a little slower; it is drawn once a change either way.
- **The pages were not read directly.** The house's site, Fragrantica and Parfumo are denied by the
  environment's network policy, so the spellings, the lists and the years come from search
  summaries of those pages. Allowing those hosts in the environment's network settings would let a
  later round read them straight.
- The 3D mountain, its data and its tools are in the repository's history (the commit before the one
  that took them out) if any of it is wanted again.

# Apoteker Tepe, the thirteenth house, and its mountain
Date: 2026-10-20
Files touched: `houses/apoteker-tepe.html` (new), `tepe.js` (new), `tepe-gl.js` (new, the mountain drawn, for the page and the Houses view), `tepe-data.js` (new, written by the tool), `tools/apoteker/mountain.mjs` (new), `images/Apoteker Tepe/` (the owner's uploads, with `web/`, `house-web/`, `mountain/athos.jpg` (written by the tool) and a README), `style.css`, `notes-data.js`, `tools/note-library/base.json`, `tools/note-library/research/NEW5.py` (new), `note-library/index.html` (its catalogue, written by `catalogue.py`), `note-figures.js`, `network.js` (`HOUSES`), `motifs.js` (`ridge`), `scent-descriptions/index.html` (the thirteenth frame, and `tepe-data.js` and `tepe-gl.js`), `houses/lost-tribe.html` and `houses/pineward.html` (the chain), `search-page.js`, `tools/seo.py`, `nav.js` (`Writing`, a closed part's writing), `package.json` (image-js and geotiff, for the tool), `tests/apoteker-tepe.spec.js` (new), and the house lists in `tests/houses.spec.js`, `mobile.spec.js`, `notes.spec.js`, `writing.spec.js`

## What changed

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

### Om's opening, in two beats

The same round, on Om Parfums. It is written in [Om's
report](2026-10-10-om-outsider-and-lost-tribe.md#2026-10-20--the-opening-in-two-beats).

## How to test it

- `npm test -- tests/apoteker-tepe.spec.js`:
  - every fragrance says when it was made, in the format, and its pictures arrive;
  - **the pictures stand a little further off**: a cut-out padded in its frame, a scene at its own
    shape, the house's picture at the Houses view's frame's;
  - the credit names the mountain, Scentorium and the Sentinel-2 data;
  - **the mountain is solid** (its body the same drawn over black and over white), **coloured as a
    mountain is** (under two thirds of it green; greys and warm colours), in many specks, out of
    16-bit heights, **the house's sign** laid in pale stone where the tool put it;
  - **it turns slowly** (more than 1.6 and less than ⅔π radians head to foot) and **nothing answers
    the hand** (the camera unmoved by the pointer, no `HAND_*` left);
  - **it is quiet behind the writing as Ataraxia's is**, with Ataraxia's numbers: over the column
    and between its paragraphs on a laptop, the whole of itself in the margin; on a phone at QUIET
    everywhere and quieter behind the words; the veil laid over it;
  - **it is quick to draw and to scroll** on a laptop and a phone (a redraw under 110 ms without a
    graphics card, 24 with one; scrolling over 24 and 30 frames a second, read over 30 and 40, under
    a loaded suite);
  - **Free view**: at the top right; the writing goes; eight nodes in the house's order; a drag
    turns it, the wheel brings it nearer; the summit's node pointed at says *The Holy Mountain* and
    *2015, before 2018*, and pressed goes to part 02, opened; Escape comes back. On a phone a tap
    says which and a second, on the card, goes;
  - still with reduced motion, and the page is its writing (and no Free view) without the scripts;
  - the Houses view's fragments are whole on the window and apart, one and only one with the sign,
    drawn by `TepeGL`;
  - the data is the tool's, with image-js and geotiff, and the colour it wrote is there.
- `tests/writing.spec.js`: *the writing inside a shut part is not counted until it is opened*.
- `tests/mobile.spec.js`: the mountain's canvas is drawn at twice the css pixels on a phone.
- The house is in every house list: `houses.spec.js` (the chain both ways, the return button at
  `#house-13`, the rank of eight, the subtitle in title case), `mobile.spec.js`, `notes.spec.js`,
  `writing.spec.js`.
- `node tools/note-library/rulebook.js --check` and `python3 tools/note-library/catalogue.py
  --check` are clean; `tests/rulebook.spec.js` finds every note After the Flood names (the page's
  newest) in the library, counted for it at its tier, and opens the first one's window.
- By eye: `houses/apoteker-tepe.html?tepe=full` at a laptop's and a phone's size, scrolled slowly
  from head to foot; Free view, turned, brought near the sign, a node pointed at;
  `scent-descriptions/?tepe=full#house-13`.

## Known issues / TODO

- **The pages were not read directly.** The house's site, Fragrantica and Parfumo are denied by the
  environment's network policy, so the spellings, the lists and the years come from search
  summaries of those pages. Allowing those hosts in the environment's network settings would let a
  later round read them straight.
- **The trails are invented** — the owner's "random indications": they climb the real ground, but
  no real path on Athos is drawn. The satellite's picture under them shows the real tracks, pale.
- **The places of the eight are read off their names**, chosen by the tool; they are not where
  anything of the house's is on Athos.
- **Without WebGL there is no mountain** (and no Free view): the page is its writing on the aged
  paper. Without a graphics card it is drawn lighter, as above.
- The satellite's picture is of one summer morning (14 July 2023): its light is in it, a little,
  under the page's own low south-western sun.
- The summit's label says the surveyed 2,033 m. The ground drawn reaches 1,956 m at the page's
  grid, because a 29-metre pixel averages the peak away.

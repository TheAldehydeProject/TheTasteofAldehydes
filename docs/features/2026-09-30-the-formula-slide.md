# The formula slide
Date: 2026-09-30
Files touched: `index.html`, `molecule.js`, `landing.js`, `paper.js`, `thread.js`, `style.css`,
`tests/formula.spec.js` (new), `tests/landing.spec.js`, `tests/menu.spec.js`

What changed: The home page has **four slides** now. Between the title and the sentence stands
**the formula slide**: as the page leaves the title, **the title fades where it stands**, and once
it has gone **the aldehyde comes together as its formula** — it turns to face you, flat, **the O at
the top and the two H below it either side**, draws in close round its bonds, and the formula comes
up in it: the bonds drawn out of the C in bright specks (the C=O as two lines) and the atoms named
as a chemistry book names them. Then **a stream of specks runs out of it to each of the eight pages
of the Menu, four down each side**; the specks gather into each page's name, **the name comes up
over them as the title does** (in the title's italic), and they let go into **a cloud of its own
round the word**, glowing and coloured as the aldehyde's is. The names are real links. On the way
back up the names go back in first, the formula lets go, and the title comes back. Also: **the title
is white with a dark edge** (it was inverted for a round).

## What the owner asked

> okay, that is actually perfect. let us tweak a few things: I want you to make the main text be
> inverse of the colours behind it (or make it visible with a mask). when you scroll, I want us to
> introduce a 4th page, between the first and second, in the home page. to transition to this pge
> from the title page, I want the title and text to fade away; 3d model of the aldehyde to become
> more concrete and I want you to add in the element backbone (so it isnt JUST the quantum
> waveform, but rather also the aldehyde formula. I want it to be displayed horizontally, where the
> O is facing upwards. This rearranging should be done after the title fadeds away. When it is
> rearranged, I want a part of the particles to flow in very slim lines and fill 4 areas on each
> sides. This should be symmetrical, and the areas should be equally spaced from each other. These
> 8 ares should be texts that are made up of the particles (but not taking from them by number or
> volume) and they should be the contents of the menu. what we are doing here is essentially adding
> another test page for the CURRENT home page page 3. finally, make sure everything is running very
> smoothly

"Another test page for the current page 3" is read as: a trial of another way into the site than
the map. **The map is untouched** and still the last slide; the formula slide stands before the
sentence.

## Why / key decisions

### The title: white, with a dark edge (`style.css`)

- **For one round it was inverted** — "make the main text be inverse of the colours behind it", done
  literally: white, taken away from what is behind it (`mix-blend-mode: difference`), which read
  everywhere but turned it deep blue over the gold and dark green over the violet. The owner then:
  "i would want to change the mask thing, i would like to make it nt opposite colour, but rather
  white with an added layer that makes it more visible. play around with masks and make it work".
  Nothing of the inversion is left.
- **Five ways were tried** and photographed side by side — plain white; **white with a close dark
  edge**; the cloud masked by the letters (drawn through a blurred picture of them, so it thinned
  away round every letter); masked with the edge; a wider mask with the edge — and the owner chose
  **the second**: "of the masks, I want it to be the second one". So the title is **white, with a
  close dark edge round every letter** (`--lettering-edge`, three tight shadows of the dark ground),
  over the aldehyde as it is. The mask (`mask()`, a picture of the letters the cloud was drawn
  through) was built for the third to the fifth, and **is not in the code**.

### The stage (`index.html`, `style.css`)

- **The title slide and the formula slide stand on one dark ground**, `.aldehyde-stage`, which
  carries the dark tokens for both (and each slide carries them too, for the tests and a page
  without the stage). **The aldehyde is pinned** to the window for as long as either slide is under
  it: `.molecule` is the stage's first child, `position: sticky`, standing no room of its own (a
  negative margin as tall as itself). When the page goes on to the sentence it goes up with the
  formula slide, names and all.
- **The stage is not positioned** on purpose: the slides' `offsetTop`, which `landing.js`, the
  paper, the thread and the tests all read, stays measured from the scroll container.
- **The slides are found by name, not by place**, everywhere that mattered: the map is
  `#slide-3` and the sentence `#slide-2` wherever they stand, so `landing.js`'s long move and the
  way out of the map, `paper.js`'s leg and `thread.js`'s centre all moved nothing when a slide was
  put in before them. The ids stayed (`slide-2` is still the sentence, `slide-3` the map); the new
  one is **`slide-formula`**.
- **The thread** leaves from **the foot of the stage** now, not from under the title: the title
  fades where it stands, and the line would have run down through the formula.
- **The Menu is light** while either dark slide is under it (`first-slide-dark` covers both).

### The title fades where it stands (`landing.js`)

- `fadeOnLeavingSlideOne` takes the title as well as the corners, later and **pinned**: it is
  moved down by exactly as far as the page has gone up, so it fades where it stands over the
  aldehyde, which is pinned too, rather than being carried off; it lifts 26px as it goes and is
  **gone by 0.45 of the way**.

### The rearranging (`molecule.js`)

- **Two clocks of its own** (`u`, the rearranging, and `f`, the flow), not the scroll's: the page
  moves in 1.1s, which is too short for the title to go and then the molecule to come together
  and then the names to be written, and a clock of its own can be turned round at any point. **It
  begins once the page is past half way** (`AT`, 0.5 — the title is gone by 0.45), which is the
  owner's "after the title fades away". `molecule.js` reads where the page is for itself.
- **The turn** is one rotation, eased, from the cloud's side (the private page's) to the formula
  facing you (`FORM_BODY`: the O up, the H either side below, the double bond's lobes towards you),
  swaying a little either side of facing you after (`FORM_SWAY`).
- **"More concrete"**: every speck is drawn in towards the nearest point of the skeleton (C=O and
  the two C–H), the rest of the electrons most (`TIGHT` 0.5), the double bond and the lone pair
  least (0.88, 0.84) so their shapes stay; the swirl calms to a third; the strengths are set again
  (`FORM_PEAK`). The nearest points are worked out once, as the specks are made (`aCore`).
- **The backbone** is the formula as a book prints it: **the bonds** in bright specks strung
  along them (`BOND_STEP`), stopping short of each atom (`BOND_GAP`), the C=O as two lines either
  side of its axis in the molecule's plane (`BOND_PAIR`), drawn out of the C as the formula comes;
  **the atoms' names** — O, C, H, H — on the page over the drawing (`.formula-atom`), in Arial as
  the icon's letters are (ChemDraw's style), inverted over the cloud as the title is, placed where
  the atoms are every frame. **A clear space round each name** (`CLEAR`): the specks within it
  fade as the formula comes, as a book leaves the paper bare round a letter — without it the C was
  lost in the brightest part of the cloud.
- **As large as the room between the names leaves it** (`FORM_EXTENT`, never larger than the
  cloud): the space between the columns on a wide window, the band between the rows on a narrow one.

### The names gather as the title does, and a cloud round each (the last round of the day)

The owner, of the first version of this slide: "I want the eight subcategories to have a stream of
particles leave the aldehyde molecule and go towards them (each), and then I wanat the text itself
to be the same as the title in the way it appears. then make some particles, similar to that of the
aldehyde molecule around each of the word. feel free to play around with the spcimg." So:

- **The stream is plainer**: once the names have been written, 96 specks a name keep running out of
  the aldehyde along its curve (`COURIERS`), brighter than before, and **pour into the name's cloud**
  at its end rather than stopping there.
- **The names are real lettering, set as the title is** — its italic, its weight, white, its dark
  edge — and **come up as the title does**: the specks gather into the letters from the stream, the
  letters come up over them (`r`, a third clock, `LETGO_MS`; the link's own opacity), and then the
  specks **let go**, each on its own beat, drifting out into the name's cloud.
- **A proper cloud round each word**, "like in the title" (the owner, of the first try — a thin
  border of specks round each word, which read as a ring round a button): each name has **a cloud of
  its own**, as the aldehyde's is a cloud — **a few lobes strung along the word** (one for about
  every one and seven tenths of its height in width), each thickest at its middle and thinning
  outwards in every direction, **towards you and away as well** (each speck has a depth,
  `aDepth`), over a thin haze; **each lobe gold or violet or a light grey**, taking turns along the
  name by the stream that feeds it (`LOBE_TONES`: the lone pair's names violet first, the double
  bond's gold first, the C–H bond's and the H's light grey with gold and with violet), and **every
  speck lit by how thick the cloud is where it stands**, as the aldehyde's two brought forward are,
  so it **glows at its heart**. `CLOUD_DENSITY` specks for every square pixel of the name (fewer on
  a phone, a third without a graphics card), poured out of the stream's end once the name is up;
  every speck of the name's letters has a place in it too (`aCloud`). **It turns slowly** a little
  either way about its upright (the depth makes it read as a volume, as the aldehyde's sway does),
  **swirls** (`uSwirl`) and twinkles; its nearer specks are drawn a little larger and brighter.
  Pointed at, it stirs and brightens with its stream. Tried first and replaced the same evening:
  a Gaussian cloud centred on the word, drawn through a mask of the name (it lost its middle to the
  mask), and **the border** — specks round the word's edge in a few swells.
- **The spacing**: the rows further apart (`row-gap` up to 140px) and the middle a little wider, for
  the clouds; the names larger (up to 30px).
- The state after `written` is **`named`**.

### The flow and the names (`molecule.js`)

- **The names are the page's own links** (`#slide-formula .formula-link`), laid out by the
  stylesheet — so the layout is CSS and the drawing reads it. Each link's words are drawn where the
  page lays them out (a name that wraps on a phone is written as it wraps) and the inked pixels
  taken as places for specks; the links' own letters are then held back
  (`.aldehyde-stage.formula-written`) until the specks have gathered, the links still there to be
  pointed at, pressed and tabbed to. **The same eight as the Menu**, in its order, without Home; a
  test says so.
- **"Not taking from them by number or volume"**: the names' specks are their own, as many as the
  letters need; the cloud loses none. They leave from **four places down each side of the formula**
  (`LEAVE_FLANK`) — oxygen's lone pair (in violet), the double bond (in gold), the C–H bond and the H
  — each carrying the colour of what it left and settling in the page's light ink.
- **"Very slim lines"**: every speck of one name runs along the same curve (`uS`, `uA`, `uB`,
  `uE`), held within a pixel of it, one after another, so the thread is a line a speck or two wide;
  at the near end of the name it runs along its middle and each speck drops into its letter. They
  set off nearest-first, so a name fills in from its near end outwards. **Couriers** (`COURIERS`)
  keep running along each thread afterwards, faintly, so the names stay tied to the molecule.
- **Symmetrical and equally spaced**: four down the left ending on one line, four down the right
  beginning on one, mirrored about the middle, every row the same distance from the next
  (`.formula-menu`, a grid). On a narrow window (**band**, under 900px) the two columns stay but
  two rows stand above the formula and two below, mirrored up and down too, and the threads run up
  and down the channel between the columns and turn in to their names (`LEAVE_BAND`).
- **Pointed at** (or tabbed to), a name and its thread brighten, whiten a little and stir.
- **Everything the flow draws is one set of points** drawn straight onto the window in its own
  pixels, the curves worked out as each speck is drawn: a few thousand specks and eight curves.

### The way back up (`landing.js`, `molecule.js`)

- The owner described the way down; the way up is the same backwards. **The names go back in
  before the page moves**: `molecule.js` puts **`formula-shown`** on the body while the names are
  out, and `landing.js`, leaving the formula slide upwards while it is there, puts
  **`formula-leaving`** on the body and holds the page until the names are in (or
  `FORMULA_HOLD_MS`, 1.5s, at most), then scrolls, the formula letting go on the way, the title
  coming back over the cloud. Those two classes are the whole of what the two scripts know of each
  other — the same kind of message as `about-shown` — and none of the landing page's five `window`
  globals is touched.
- A swipe on a phone is the browser's own scroll and is not held: the names are drawn back in as
  the page goes.

### Smoothness

- The flow's shader works a speck's place in its cloud out only once it is in the cloud or on its
  way there; a speck not yet set off is put off the screen at once. The aldehyde's shader gains one
  mix and a check against the four atoms. The names are written once, on load, when the page's face has come, and
  on a resize (after it has settled). The atoms' names are moved by `transform` alone. Nothing is
  read off the page's layout while it draws.
- **It draws only while one of the two dark slides is on the screen** (and not under the Menu or
  About me); a test counts its frames once the map is showing: none.
- A slow frame moves the clocks on by a quarter of a second at most, so a machine without a
  graphics card (the tests' browser) gets through it, choppily, rather than slowing it to a crawl.
- **With reduced motion** it simply is the formula with its names, still, the threads shown as
  dotted lines; and changes at once. **Without the drawing** the formula slide is the eight links,
  plainly, in the same places.

## How to test it

`tests/formula.spec.js`:
- **`the formula slide carries the Menu's eight pages, in its order, four down each side,
  symmetrical and equally spaced`** — against `SITE_LINKS` in `nav.js`.
- **`the title fades where it stands as the page leaves it, and only then does the aldehyde come
  together`** — a quarter of the way down: going, held where it stands, the aldehyde still a cloud;
  past half way: gone, and the aldehyde turning.
- **`the aldehyde comes together as its formula — flat, the O at the top, the H either side below —
  and the Menu's pages gather out of its streams`** — the states in order (cloud, turning, formula,
  flowing, written, named, off `data-state` on `#molecule`), a name's letters coming up only once
  its specks have gathered, the atoms' places, every name up in the title's face, and specks above
  and below every name.
- **`a name pointed at brightens its cloud, and is the page's own link`**.
- **`going back up, the names go back into the aldehyde before the page moves, and the title comes
  back`**.
- **`with motion turned off the formula and its names are simply there, still`**.
- **`without the 3D library the formula slide is the eight links, plainly`**.
- **`on a phone the names stand two above and two below the formula each side, and nothing
  scrolls sideways`**.
- **`the aldehyde stops drawing once its slides are off the screen`**.

`tests/landing.spec.js` counts four slides in order, and its "next slide" tests go to the formula;
the title's test checks it is white, not inverted, with its edge, and that nothing is masked. By eye: go down from the title slowly and
quickly, point at the names, go back up; on a phone, swipe.

## Known issues / TODO

- The timings are numbers at the top of `molecule.js` (`REARRANGE_MS`, `FLOW_MS`, `LETGO_MS` and
  their ways back, `AT`), the look of the formula (`TIGHT`, `FORM_PEAK`, `BOND_*`, `ATOM_SIZE`,
  `CLEAR`) and of the names' clouds (`CLOUD_DENSITY`, `LOBE_TONES`, `uSwirl`).
- It is a trial beside the map, at the owner's word; which of the two stays is theirs.
- The names are the Menu's by a test, not by being read from `nav.js`: a page added to the Menu is
  added to the formula slide's markup too (the test fails until it is).

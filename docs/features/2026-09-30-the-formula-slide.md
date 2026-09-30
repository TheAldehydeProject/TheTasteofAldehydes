# The formula slide
Date: 2026-09-30
Files touched: `index.html`, `molecule.js`, `landing.js`, `paper.js`, `thread.js`, `style.css`,
`tests/formula.spec.js` (new), `tests/landing.spec.js`, `tests/menu.spec.js`

What changed: The home page has **four slides** now. Between the title and the sentence stands
**the formula slide**, and **the scroll wheel runs it**: as the page leaves the title, **the title
fades where it stands**; on the formula slide **the aldehyde comes together as its formula** — it
turns to face you, flat, **the O at the top and the two H below it either side**, draws in close
round its bonds, and the formula comes up in it: the bonds drawn out of the C in bright specks (the
C=O as two lines) and the atoms named as a chemistry book names them. Then **a cloud of specks
gathers round each of the eight pages of the Menu, four down each side**, the specks of its letters
condense out of it, **the name comes up over them as the title does** (in the title's italic), and
they let go back into the cloud. The names are real links. All of it goes as far as the wheel is
turned, and back; the keys play it through. Also: **the title is white with a dark edge** (it was
inverted for a round).

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

### The wheel runs it (`landing.js`)

- "make the whole second page reactive to the scroll wheel" — asked which way, the owner chose
  **the wheel drives it**. So the title slide and the formula slide are **one stage** with **one
  number** for where it is, `q`: 0 the title, 1 the page arrived at the formula slide (between, the
  page part of the way down, the title fading as it goes), 1 to 2 the formula's sequence with the
  page held there. **The wheel moves where it is going** (`qTo`) by as much as it is turned —
  `WHEEL_LEG1` of the window's height for the first leg, `WHEEL_LEG2` (1,500px) through the
  sequence — and `q` follows **on a spring** (`SPRING`), never faster than its leg allows
  (`RATE_LEG1`, `RATE_LEG2`, `RATE_BACK`), so a notch and a flick both move it smoothly. Turned
  back, it all goes back: the names go, the formula lets go, and only then the page moves and the
  title comes back. **Stopped between the two slides**, it settles on the nearer after a third of a
  second (`SETTLE_MS`). **Complete**, a further turn down goes on to the sentence (after
  `LEAVE_AFTER_MS`, so the end of the flick that completed it does not also leave).
- The sequence is told to `molecule.js` as **a sixth `window` global, `__formula`** (0 to 1) — the
  landing page's scripts talk through `window` numbers and nothing else, and this is one more.
- **The keys and the Scroll button** play it through: down from the title to the end of the
  sequence (the page's move in about a second, the sequence in about four), up from the formula all
  the way back to the title; down from the formula on to the sentence. **A finger** (a phone), the
  scrollbar or a jump moves the page itself, and the stage follows where it is — arriving at the
  formula slide that way plays the sequence through.
- **The hold on the way back**, with its two body classes (`formula-shown`, `formula-leaving`), is
  gone: going back up now runs back through the sequence before it runs back up the page.

### The title fades where it stands (`landing.js`)

- `fadeOnLeavingSlideOne` takes the title as well as the corners, later and **pinned**: it is
  moved down by exactly as far as the page has gone up, so it fades where it stands over the
  aldehyde, which is pinned too, rather than being carried off; it lifts 26px as it goes and is
  **gone by 0.45 of the way**.

### The rearranging (`molecule.js`)

- **One number, `S`**, following the wheel's `__formula` (at `FOLLOW` a second at most, so a jump
  is still a movement): its first `TURN` (0.3) is the aldehyde turning into its formula (`u`), the
  next `GATHER` (0.45) the names' clouds and letters (`f`), the rest the names coming up (`r`). It
  begins only once the page has arrived at the formula slide, long after the title has gone — the
  owner's "after the title fades away". (For two rounds it ran on clocks of its own, set off half
  way down; the wheel replaced them.)
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

### The names (`molecule.js`, `style.css`)

- **The names are the page's own links** (`#slide-formula .formula-link`), laid out by the
  stylesheet — so the layout is CSS and the drawing reads it. Each link's words are drawn where the
  page lays them out (a name that wraps on a phone is written as it wraps) and the inked pixels
  taken as places for specks; the links' own letters are held back (`.aldehyde-stage.formula-written`)
  until the specks have gathered, the links still there to be pointed at, pressed and tabbed to.
  **The same eight as the Menu**, in its order, without Home; a test says so.
- **Symmetrical and equally spaced**: four down the left ending on one line, four down the right
  beginning on one, mirrored about the middle, every row the same distance from the next
  (`.formula-menu`, a grid). On a narrow window (**band**, under 900px) the two columns stay but two
  rows stand above the formula and two below, mirrored up and down too.
- **Set as the title is**, and **come up as the title does** (the owner: "the text itself to be the
  same as the title in the way it appears"): italic, the title's dark edge, and — "a little
  minimalist and neat (especially the words)" — a lighter weight (400), a little smaller (up to
  26px), opened out a hair. The specks gather into the letters, the letters come up over them (the
  link's own opacity), and the specks **let go**, each on its own beat, back into the name's cloud.
- **A cloud of its own round each name** ("a proper cloud like in the title"), kept plain: **one
  soft oval of specks** round the word, thickest at its middle and thinning outwards in every
  direction, **towards you and away as well** (each speck has a depth, `aDepth`), a few further out
  in a haze; **the same on every name** — mostly the aldehyde's warm grey with a little of its gold
  and its violet — and **every speck lit by how thick the cloud is where it stands**, as the
  aldehyde's two brought forward are, so it glows at its heart. `CLOUD_DENSITY` specks for every
  square pixel of the name (fewer on a phone, a third without a graphics card). It turns slowly a
  little either way about its upright, swirls (`uSwirl`) and twinkles; its nearer specks are drawn
  a little larger and brighter. **Pointed at** (or tabbed to), it brightens and stirs.
- **"Not taking from them by number or volume"**: the names' specks are their own, as many as the
  letters and clouds need; the aldehyde loses none.
- **Nothing runs between the aldehyde and the names** (the owner: "remove the lines connecting the
  aldehyde to the words", and, asked, all of them). The letters' specks come up in the name's cloud,
  nearest the formula first, and condense into the letters there.
- **Replaced, the same evening, and none of it in the code**: **the streams** — each name's specks
  running out of the aldehyde along one slim curve from four places down its side (the lone pair in
  violet, the double bond in gold, the C–H bond, the H), into the name, and **couriers** running
  along each afterwards, into its cloud; **the border** — specks round each word's edge, which read
  as a ring round a button; **the lobed clouds** — a few lobes along each word, gold, violet and
  light grey by turns (`LOBE_TONES`), which were busy; and a Gaussian cloud drawn through **a mask**
  of the name, which lost its middle to the mask.

### Smoothness

- The names' shader works a speck's place in its cloud out only once it has come up; one not yet
  come is put off the screen at once. The aldehyde's shader gains one mix and a check against the
  four atoms. The names are written once, on load, when the page's face has come, and on a resize
  (after it has settled). The atoms' names are moved by `transform` alone. Nothing is read off the
  page's layout while it draws; the wheel only moves a number.
- **It draws only while one of the two dark slides is on the screen** (and not under the Menu or
  About me); a test counts its frames once the map is showing: none.
- A slow frame moves the gathering-in at load on by a quarter of a second at most, so a machine
  without a graphics card (the tests' browser) gets through it, choppily, rather than crawling.
- **With reduced motion** the wheel and the keys move the stage at once, and the drawing is simply
  there, still, drawn again only when something has changed. **Without the drawing** the formula
  slide is the eight links, plainly, in the same places.

## How to test it

`tests/formula.spec.js`:
- **`the formula slide carries the Menu's eight pages, in its order, four down each side,
  symmetrical and equally spaced`** — against `SITE_LINKS` in `nav.js`.
- **`the title fades where it stands as the page leaves it, and the aldehyde comes together only
  on the formula slide`** — a quarter of the way down: going, held where it stands, the aldehyde
  still a cloud; past half way: gone, the aldehyde still waiting; arrived: it plays through.
- **`the aldehyde comes together as its formula — flat, the O at the top, the H either side below —
  and the Menu's pages condense out of clouds of their own`** — the states in order (cloud,
  turning, formula, gathering, written, named, off `data-state` on `#molecule`), a name's letters
  coming up only once its specks have gathered, the atoms' places, every name up in the title's
  face, and specks above and below every name.
- **`a name pointed at brightens its cloud, and is the page's own link`**.
- **`going back up, the names go before the page moves, and the title comes back`**.
- **`the wheel runs the stage, as far as it is turned and back again`** — a notch, and it settles
  back on the title; more than half the way, and on to the formula slide, the sequence waiting;
  part of the way through it, and it stays there, the page held; back all the way; all the way
  down, and a further turn goes on to the sentence.
- **`with motion turned off the formula and its names are simply there, still`**.
- **`without the 3D library the formula slide is the eight links, plainly`**.
- **`on a phone the names stand two above and two below the formula each side, and nothing
  scrolls sideways`**.
- **`the aldehyde stops drawing once its slides are off the screen`**.

`tests/landing.spec.js` counts four slides in order, and its "next slide" tests go to the formula;
the title's test checks it is white, not inverted, with its edge, and that nothing is masked. By eye: go down from the title slowly and
quickly, point at the names, go back up; on a phone, swipe.

## Known issues / TODO

- How much wheel each part takes and how fast it may go are numbers in `landing.js`'s stage
  (`WHEEL_LEG1`, `WHEEL_LEG2`, `RATE_*`, `SPRING`, `SETTLE_MS`, `LEAVE_AFTER_MS`); how the sequence
  is shared out, the look of the formula and of the names' clouds are numbers at the top of
  `molecule.js` (`TURN`, `GATHER`, `FOLLOW`, `TIGHT`, `FORM_PEAK`, `BOND_*`, `ATOM_SIZE`, `CLEAR`,
  `TRAVEL`, `CLOUD_DENSITY`, `uSwirl`).
- It is a trial beside the map, at the owner's word; which of the two stays is theirs.
- The names are the Menu's by a test, not by being read from `nav.js`: a page added to the Menu is
  added to the formula slide's markup too (the test fails until it is).

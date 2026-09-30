# The aldehyde on the home page
Date: 2026-09-30
Files touched: `molecule.js` (new), `aldehyde-data.js` (new, written by the tool),
`tools/aldehyde/cloud.py` (new), `index.html`, `style.css`, `tests/landing.spec.js`

What changed: The home page's first slide has **a big aldehyde in the middle of it**:
formaldehyde, H₂C=O, the smallest aldehyde there is, drawn as its **electron cloud** as
Schrödinger's equation has it. Tens of thousands of specks, each a place an electron may be
found, **swirl slowly about their places like smoke** (curl noise), and are drawn **through a
lens**: sharp where the focus is, soft wide discs in front of it and behind, the focus drifting
through the molecule. **The double bond is gold, oxygen's lone pair violet, and every other
electron faint ink.** The title is its caption now, low on the slide under it; a small key in
the top right corner says what the colours are.

## What the owner asked

It came out of three messages in a row. First a question, and then a demonstration kept off the
site:

> If you were to use the shrodinger's equations for the model of the atom, could you
> graphically make a 3D model of an aldehyde? dont do anything on the page yet, just asking for now

> can you try and show me what you would do? make it as easy as possible for now

Then, of formaldehyde (a private page, *The Aldehyde Cloud*, that stays off the site):

> make it so that the normal electrons are insignificant, but the lone pair and the double bond
> each have an assigned emphasized parameter to them, which makes them stand out in the all
> electrons view

And they asked what was on pmndrs' *GPGPU Curl Noise DOF* example (a sphere of white particles
swirling in curl noise, drawn with a fake depth of field, under a camera that orbits and shakes a
little). Then:

> can you redesign the front page of home. I want a big aldehyde molecule int he very middle of
> it, with the electron cloud being done as colour coded exactly as described in my previous
> message, and have the electron cloud made with the curl noise page elements. can you try that?

## Why / key decisions

### The cloud (`tools/aldehyde/cloud.py` → `aldehyde-data.js`)

- **Solved once, by hand, not by the site.** The tool solves formaldehyde approximately
  (density-functional theory, B3LYP in a cc-pVDZ basis, with PySCF). Schrödinger's equation can
  only be solved exactly for hydrogen, so a molecule is always an approximation, and this is the
  standard one. It then scatters specks through the cloud as often as the equation says an
  electron is there (|ψ|²). It needs `numpy` and `pyscf` (`pip install numpy pyscf`) and takes
  under a minute; nothing the site needs.
- **Three parts that add up exactly to the whole.** The occupied orbitals are gathered into the
  ones a chemist draws (*intrinsic bond orbitals*: the same sixteen electrons, the same whole
  cloud). The **double bond** is the C=O's pi pair (2 electrons), the **lone pair** is oxygen's p
  lone pair in the molecule's plane (2), and **every other electron** is the rest (12: the
  innermost pairs, the single bonds and oxygen's second, deeper lone pair). The tool checks the
  cloud holds sixteen electrons (16.09 on its grid).
- **The lone pair is the chemist's, not the loosest-held solution.** The demonstration used the
  highest occupied orbital, which is nearly the lone pair but spills along the C–H bonds. On the
  home page, with no caption beside it, violet at the hydrogens read as the lone pair belonging to
  them. That was the first version. The gathered one sits 92% on oxygen's p function.
- **As a chemistry book draws an orbital**, only the part of each cloud holding nine tenths of it
  is kept (nineteen twentieths for the rest).
- **Small enough for the home page.** 52,000 specks at a byte a coordinate (0.03 Å steps from
  the cloud's middle, a hair of jitter added back in the browser so no lattice shows) and a byte
  of shade each (how dense the cloud is where the speck stands). 271 KB, and the site still needs
  no build step. **Never edit it by hand**: run the tool.

### The emphasis ("colour coded exactly as described")

- `EMPHASIS` in `molecule.js` is the owner's "assigned emphasized parameter": **×1 is a part's
  true share of the specks** (2 electrons in 16 for the double bond and for the lone pair, 12 in
  16 for the rest; `SHARE` is sixteen electrons as 40,000 specks). ×3 draws a part as if it held
  three times its electrons. It is **×3, ×3 and ×0.3**, as on the demonstration. The data holds
  enough specks for up to ×4 of the two and ×0.4 of the rest.
- **The colours, on white**: the demonstration was on a dark ground in lighter gold and violet;
  here they are deepened to read on the page's paper (`COLOUR`), the rest in the page's own ink
  at low strength. The two brought forward are also **lit by their shade**, full where their
  cloud is dense and faint at its fringe, so their lobes read as shapes rather than haze (the
  demonstration found that). The double bond is drawn over the lone pair, over the rest.
- **Seen three-quarters on** (`SIDE`, the isometric angle), as a textbook draws a solid. The
  double bond's lobes and the lone pair's both stand at right angles to the C=O, so seen from the
  side they always lie on one another; three-quarters on, the C=O, the double bond and the lone
  pair point three ways, a third of a turn apart. **It sways** about that side (`SWAY`, ±0.26 rad
  over 34 s) rather than turning all the way round, and **leans** a little to the pointer
  (`LEAN`). A wider sway (±0.45) showed the lone pair covering the double bond at its ends. That
  was the first version.

### The curl noise page's elements (`molecule.js`)

- **Curl noise.** Every speck is carried off its place by a smooth swirling flow that neither
  bunches nor thins the specks (a curl field has no sources or sinks), two swirls at two sizes,
  0.3 Å at most (`FLOW`, `FREQ`). The orbitals keep their shape while the whole of it moves like
  smoke in a slow current. The noise is Ashima Arts' simplex noise (MIT), as the pmndrs example
  uses it, and its curl.
- **Worked out as it is drawn, not in a separate picture.** The pmndrs example works the flow out
  in one pass into a picture of positions (the "GPGPU" in its name) and reads it back in the next.
  But each speck's place there is a function of where it started and the time, not of where it
  was a frame before, so working it out in the same pass that draws it is the same arithmetic
  with one step fewer, and needs nothing a phone's graphics chip may not have (drawing into a
  picture of numbers).
- **The lens.** Each speck grows into a soft disc the further it stands from the focus
  (`BLUR`), fainter as it grows (the same light spread over more of the page), with a faint rim as
  a lens draws one. The focus drifts through the molecule, front to back and back, over 16 s
  (`FOCUS_SWING`). This is the example's cheap depth of field, not a blur of the picture: nothing
  is drawn twice. (The Note Library's real depth blur, removed on 2026-09-28, is a different
  thing.)
- **The camera held in the hand**: the smallest wander and roll, as the example's camera shakes.
- **The gathering.** On the way in the specks come from a wide shell round the molecule (the
  example's sphere) to their places, each on its own delay, over 2.6 s, in step with the title
  gathering out of specks under it. The skeleton and the atoms' names come up at the end.

### The slide

- **The molecule in the middle, the title its caption.** The canvas covers the whole slide; the
  molecule stands in the middle of the room the slide leaves above the title, as large as that
  room lets it (`FIT`, 1.8 Å of reach framed; on a phone the width decides). The title, its line
  and the square for About me stand low on the slide (`.title-slide:has(.molecule)`), still in the
  middle across, and **the thread still leaves from under the title** (it reads where the title
  is). Nothing on the drawing takes the pointer.
- **The key** in the top right corner (*H₂C=O, formaldehyde; the double bond; oxygen's lone
  pair; every other electron*, with the colours) comes up only once the molecule has drawn, so a
  page without it never names colours that are not there. The atoms are named C, O, H, H beside
  them in the mono. The drawing and the key are kept from a screen reader: the title is what the
  slide says.
- **It draws only while the first slide is on the screen**, and not under the Menu or About me.
- **A machine drawing without a graphics card** (the tests' browser, an old laptop) works the
  flow out on its processor, which the rest of the page shares: there it gets a fifth of the
  specks, one swirl rather than two, and a new frame a twelfth of a second at most. Without that
  the page's own timing slowed (the About me square had not come in 4.5 s after load); with it,
  the tests' browser holds about 48 frames a second against 60 without the molecule.
- **On a phone** it draws at a ratio of 1.5, three fifths of the specks and one swirl.
- **With reduced motion** it is simply there, still: no gathering, no flow, no sway, no shake, the
  focus where it rests. **Without the 3D library, or if its shader will not compile**, it is not
  there at all, and the slide is the title alone (it checks after compiling, and steps aside).
- **It talks to no other script and sets no global**: the landing page's other scripts and their
  five `window` globals are untouched.

## How to test it

`tests/landing.spec.js`:
- **`the aldehyde stands big in the middle of the first slide, the double bond gold and the lone
  pair violet, the title its caption under it`**: drawn; over the whole slide, taking no pointer;
  the title low on the slide and in the middle across; gold and violet read off a screenshot, in
  the middle across, above the title and under the key; the key up and naming both; the atoms C,
  O, H, H named; the square at the title still coming up; no errors.
- **`the aldehyde's cloud is Schrodinger's, in three parts that add up to sixteen electrons, and
  the two brought forward are emphasised`**: the data's molecule, atoms and 12 + 2 + 2 electrons,
  every part whole; `EMPHASIS` above ×1 for the two and under it for the rest; the shares 2 to 12;
  enough specks for the emphasis.
- **`with motion turned off the aldehyde is simply there, still`**: two screenshots 0.9 s apart
  are the same, and it is drawn.
- **`without the 3D library the first slide is the title alone, and nothing breaks`**.
- **`on a phone the aldehyde fits across the screen, above the title`**.

By eye: open the home page and watch the first three seconds; move the pointer across the window.
To change the molecule's data, `python3 tools/aldehyde/cloud.py`.

## Known issues / TODO

- **A first try**, as the owner asked ("can you try that?"). The sizes, the colours, the flow's
  strength, the lens and the sway are all single numbers at the top of `molecule.js`.
- The key's words are the page's, not the owner's.
- The molecule is formaldehyde, the smallest aldehyde; the private page showed lauric aldehyde
  (C-12) the same way, and the tool could be pointed at it (its chain would need the framing
  rethought: it is fifteen ångström long).

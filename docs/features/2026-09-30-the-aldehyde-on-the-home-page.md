# The aldehyde on the home page
Date: 2026-09-30
Files touched: `molecule.js` (new), `aldehyde-data.js` (new, written by the tool),
`tools/aldehyde/cloud.py` (new), `index.html`, `style.css`, `landing.js`, `title.js`,
`tools/seo.py`, `tests/landing.spec.js`

What changed: The home page's first slide is **dark** now, the dark grey of the private page the
molecule was first drawn on, and **a big aldehyde glows in the middle of it**: formaldehyde,
H₂C=O, the smallest aldehyde there is, drawn as its **electron cloud** as Schrödinger's equation
has it. Tens of thousands of specks, each a place an electron may be found, add up to light where
they crowd. **The double bond is gold, oxygen's lone pair violet, and every other electron a faint
warm grey**, and the specks swirl a little about their places (curl noise). **The title stands in
front of it, in the middle**, in light ink, with its line and the square for About me under it.

## What the owner asked

It came out of messages in a row. First a question, and then a demonstration kept off the site:

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

That first try (below, **the first try**) was not put live. Of it:

> no, i want you to remove the stuff in the top right; and i want the taste of aldehydes to be
> in front of the aldehyde. I want them both to be centered. Also, ill ask that you make the actual
> aldehyde look a little smoother, and isntead of the way it looks, i actually want it to look
> like the thing i see on the right; as close as possible to it. (on the right, i have the H2C=O
> that you have generated earlier)

The thing on the right was the private page, which glows on a dark ground; the home page's white
paper cannot glow, so they were asked, and chose **a dark first slide**.

## Why / key decisions

### The cloud (`tools/aldehyde/cloud.py` → `aldehyde-data.js`)

- **Solved once, by hand, not by the site.** The tool solves formaldehyde approximately
  (density-functional theory, B3LYP in a cc-pVDZ basis, with PySCF). Schrödinger's equation can
  only be solved exactly for hydrogen, so a molecule is always an approximation, and this is the
  standard one. It then scatters specks through the cloud as often as the equation says an
  electron is there (|ψ|²). It needs `numpy` and `pyscf` (`pip install numpy pyscf`) and takes
  under a minute; nothing the site needs.
- **Three parts that add up exactly to the whole**, as the private page takes them: the
  **double bond** is the C=O's pi pair (2 electrons), the **lone pair** is oxygen's loosest-held
  pair (the highest occupied orbital, 2), lying in the molecule's plane and spilling a little
  along the C–H bonds, and **every other electron** is the whole cloud less those two (12: the
  innermost pairs, the single bonds and oxygen's second, deeper lone pair). The tool checks the
  cloud holds sixteen electrons (16.09 on its grid).
- **For the first try the lone pair was gathered wholly onto the oxygen** (an intrinsic bond
  orbital): on white, with no caption beside it, violet at the hydrogens read as the lone pair
  belonging to them. The owner then asked for the private page's look as close as possible, and
  this is the private page's cloud again.
- **As a chemistry book draws an orbital**, only the part of each cloud holding nine tenths of it
  is kept (nineteen twentieths for the rest).
- **Small enough for the home page.** 60,000 specks at a byte a coordinate (0.03 Å steps from
  the cloud's middle, a hair of jitter added back in the browser so no lattice shows) and a byte
  of shade each (how dense the cloud is where the speck stands). 313 KB, and the site still needs
  no build step. **Never edit it by hand**: run the tool.

### The emphasis ("colour coded exactly as described")

- `EMPHASIS` in `molecule.js` is the owner's "assigned emphasized parameter": **×1 is a part's
  true share of the specks** (2 electrons in 16 for the double bond and for the lone pair, 12 in
  16 for the rest; `SHARE` is sixteen electrons as 60,000 specks, as on the private page). ×3
  draws a part as if it held three times its electrons. It is **×3, ×3 and ×0.3**, the private
  page's own. The data holds enough for the two to go a little over ×3 and the rest a little over
  ×0.3.

### Drawn as the private page draws it (`molecule.js`)

- **Light added to light** (additive blending) on the dark ground, so where specks crowd the
  cloud glows; each speck a soft round dot, full in the middle and nothing at its edge.
- **The same colours** (gold `#e0b252`, violet `#a98ad8`, a warm grey `#9a948c`), the same
  strengths (the two at full, the rest at 0.4), the two brought forward **lit by their shade** —
  full where their cloud is dense, faint at its fringe — so their lobes read as shapes, and a
  speck of theirs half as large again. Every speck a little brighter or darker than the next.
- **The same size and framing**: 1.5 px specks (1.25 on a phone), the cloud 2.3 Å either side of
  its middle up and down, 2.2 across, whichever the window is shorter in; a smaller cloud packing
  them closer, drawn fainter.
- **The same side and sway**: seen from the private page's own angle (`SIDE`), swaying 0.4 rad
  either side over 26 s; it leans a little to the pointer (`LEAN`).
- **The curl noise stays, gentler**: every speck swirls about its own place by at most 0.12 Å
  (`FLOW`), slowly (`PACE`), two swirls at two sizes (one on a phone), worked out in the same
  pass that draws it. The noise is Ashima Arts' simplex noise (MIT), as the pmndrs example uses
  it, and its curl. In the pmndrs example the flow is worked out in one pass into a picture of
  positions (the "GPGPU" in its name) and read back in the next; each speck's place there is a
  function of where it started and the time, so working it out as it is drawn is the same
  arithmetic with one step fewer, and needs nothing a phone's graphics chip may not have.
- **The gathering.** On the way in the specks come from a wide shell round the molecule (the
  example's sphere) to their places, each on its own delay, over 2.6 s, in step with the title
  gathering out of specks in front of it.
- **The atoms' names and the hairline bonds are left off**, though the private page shows them.
  With the title in front of the molecule they ran under its letters, the H–C bond an underline
  to *Taste*; the title is the lettering on this slide. That was the second round's first
  version.

### The slide

- **The dark first slide.** `.title-slide` turns the page's five tokens over to the private
  page's (the Note Library's) dark grey, as a dark page's body class does, so the title, its line,
  the square, the scroll cue and the corner block all follow; it carries `dark-surface`, and the
  cursor reads its colour anyway. The slides after it are white as they were. The browser's own
  bar on a phone is the same grey (`THEME` in `tools/seo.py`).
- **The title in front, in the middle.** It stands where it always stood, above the drawing
  (`z-index`), the molecule's middle at the slide's middle. **A soft shadow of the ground round
  its letters** keeps it read over the glow, and its line and the square's words are in a lighter
  grey with a stronger one (they were lost over the gold).
- **The Menu**, fixed over whatever slide is under it, is **light while the first slide is under
  it**: `landing.js` puts `first-slide-dark` on the body while the page has not left it, and the
  stylesheet turns the Menu's ink and its phone ground over.
- **The title's gathering specks are drawn in the title's own ink** (`title.js` reads it), light
  here; they were a fixed near-black.
- **About me** opens over the dark slide with a veil of the ground, the sheet the paper it always
  was.
- **It draws only while the first slide is on the screen**, and not under the Menu or About me.
- **A machine drawing without a graphics card** (the tests' browser, an old laptop) works the
  flow out on its processor, which the rest of the page shares: there it gets a fifth of the
  specks, one swirl, and a new frame a twelfth of a second at most. **`?molecule=full`** on the
  address draws it whole there too, for a picture of it.
- **With reduced motion** it is simply there, still: no gathering, flow or sway. **Without the 3D
  library, or if its shader will not compile**, it is not there at all, and the slide is the title
  alone on its dark ground (it checks after compiling, and steps aside).
- **It talks to no other script and sets no global**: the landing page's five `window` globals are
  untouched.

## The first try (the morning of 2026-09-30) — replaced

For one round the slide stayed **white**: the molecule stood in the middle of the room above the
title, which was its **caption, low on the slide**; the cloud was drawn in deepened gold and violet
over the page's ink, **seen three-quarters on** (the isometric angle, so the bond, the double bond
and the lone pair pointed three ways), and made with more of the curl noise page: a stronger flow
(0.3 Å), **a lens** — each speck growing into a soft disc out of focus, the focus drifting through
the molecule — and **a camera held in the hand**, the smallest wander and roll. **A key** in the
top right corner named the colours (*H₂C=O, formaldehyde; the double bond; oxygen's lone pair;
every other electron*), and the atoms were named beside them with the bonds in hairlines. The owner
asked for the key gone, the title in front and both centred, and the look of the private page;
the lens and the shake were the grain in it ("a little smoother"). None of the lens, the shake,
the key or the caption layout is in the code (no `uFocus`, `uBlur`, `.molecule-key`,
`.molecule-atom`).

## How to test it

`tests/landing.spec.js`:
- **`the aldehyde glows big in the middle of the dark first slide, the double bond gold and the
  lone pair violet, the title in front of it`**: drawn; the slide's ground the private page's
  grey and the title in its light ink; over the whole slide, taking no pointer, under the title;
  the title in the middle both ways; gold and violet read off a screenshot round the same middle;
  no key and no atoms' names; the square at the title still coming up; no errors.
- **`the Menu is light over the dark first slide, and dark again on the second`**.
- **`the aldehyde's cloud is Schrodinger's, in three parts that add up to sixteen electrons, and
  the two brought forward are emphasised`**: the data's molecule, atoms and 12 + 2 + 2 electrons,
  every part whole; `EMPHASIS` above ×1 for the two and under it for the rest; the shares 2 to 12;
  enough specks for the emphasis; drawn additively, and no lens.
- **`with motion turned off the aldehyde is simply there, still`**.
- **`without the 3D library the first slide is the title alone on its dark ground, and nothing
  breaks`**.
- **`on a phone the aldehyde and the title stand in the middle together`**.

By eye: open the home page and watch the first three seconds; move the pointer across the window;
put it beside the private page. To change the molecule's data, `python3 tools/aldehyde/cloud.py`.

## Known issues / TODO

- The strengths, colours, size, sway and swirl are all single numbers at the top of `molecule.js`.
- The molecule is formaldehyde, the smallest aldehyde; the private page showed lauric aldehyde
  (C-12) the same way, and the tool could be pointed at it (its chain would need the framing
  rethought: it is fifteen ångström long).

# Explorations & Researches, laid out again, and the field

(The figures below — one for each work — were **replaced the same day** by abstract forms; see
*2026-09-26, later — abstract forms, not figures*; and the table stopped conducting the field
that evening, when it took its own clock — see *2026-09-26, last* at the foot. The layout stands
as written.)

Date: 2026-09-26

Files touched: `categories/researches.html`, `explorations.js` (new; ~820 lines by the last
section), the `EXPLORATIONS & RESEARCHES` block in `style.css` (all of it under
`.researches-page`), `tests/index-pages.spec.js`

## What changed

The owner:

> in the Researches and Explorations (RE for short), i want you to put this paragraph "Here
> you will find my researches and my explorations. ..." under the title RE, not under
> introduction. the introductiont hing delete it. Delete the right side of the page, and move
> the table upwards, so that it takes up abour 3/5ths of the page on the left (an estimate, but
> make it look good). On the right side, I want you to make something extravagant with the
> particles that reacts ot the thing being hovered on the left (in the table). Make it reactive
> and on theme.

The page is two columns now, three fifths and two. On the left, the name — set as a heading, in
ink, where it was a small grey label — the owner's paragraph directly under it, and the table
directly under that, filling the window to its foot and scrolling in its own box. The
**Information** heading the paragraph stood under, the line *Currently reading round and writing
these up one at a time.*, and the two plates (the drawn ring and a hatched placeholder) are gone
from the page. On the right, **the field**: one drawing in specks the full height of the window,
bracketed at its corners and captioned at its foot, which the table conducts.

## The field

With nothing pointed at, the specks turn in **the ring** — a tilted orbit with dust inside it, the
drawn plate this page used to carry, made large. Point at a row and every speck is thrown out
from the middle (`KICK`) and gathers into **that work's figure**, each on a clock of its own
(`SPREAD`, 520ms), so the change sweeps through the field rather than snapping; the figure's
hairlines — its outline, its tiers, its labels — come up once the specks have gathered
(`LINES_IN`) and the last figure's go as they leave. Under it the **caption**: the number, the
name, and the kind (or *not written yet*).

| row | `data-figure` | the figure |
|---|---|---|
| 000 My Personal Introduction to Perfume | `pyramid` | the primer's own pyramid, a triangle cut into TOP, HEART and BASE, labelled; the top lifting off and thinning as a top note does, the heart swaying, the base still |
| 001 Resins in Perfumery | `resin` | a tear of resin, full, turning slowly inside, with four bubbles caught in it |
| 002 Buying A Perfume | `bottle` | a bottle, its label panel, the liquid in it moving, a mist rising from its cap |
| 003 Cold vs Warm Incense | `smoke` | two sticks, COLD and WARM: a plume that stands straight and thin, and one that billows |
| 004 Exploring the smell of a forest | `forest` | three firs, in tiers, filled |
| 005 Exploring the smell of rain | `rain` | rain falling in strokes, ringing where it lands |
| 006–009 Untitled | (none) | the **cloud**: specks with nowhere to be yet |

**A row that names no figure is given one by its kind**, so a new row needs nothing: a Research
is a **molecule** — two to four six-sided rings fused in a chain and a side chain or two, its
atoms gathered specks and its bonds hairlines, some doubled — and an Exploration a **terrain** —
two or three rises in rings of contour, and a dashed route across them from a tick to a cross.
Both are worked out from the row's own name (seeded), so no two are alike and each is the same
every visit. A row that is neither yet is the cloud. A row with nothing behind it
(`data-open="no"`) is drawn at half strength.

**The pointer answers over the field as well**: the specks within `PART` (74px) of it are pushed
aside and drawn darker.

**Leaving the table** brings the ring back `IDLE_AFTER` (650ms) later, so passing from one row
to the next never does. **From the keyboard**, a row's link focused is pointed at, and the row
carries `is-shown` so it reads as the one being shown. **Without hovering** (a phone), the
written works take turns every `TURNS` (5.2s); a tap on a row shows that one, and a lifted
finger is not taken for the pointer leaving. **With reduced motion** there is no flight and
nothing moves: each figure is simply there, drawn once, always at the same moment of itself.

It draws only while it is on the window (`IntersectionObserver`), at 2400 specks (1300 below
700px), at a ratio of 2 (1.5 below 700px); each speck's place is asked of its figure once a
frame and kept (`A`, `Z`, `K`) for the drawing.

## Why / key decisions

- **Scoped to the page.** `.index-page` and its whole block are shared with the old Fragrances
  index kept underneath the Fragrances view of Scent descriptions, which still has its plates
  and the drawn mark (`index-page.js` still draws `.index-mark` there). Everything new is under
  `.researches-page`, and nothing of the shared block was removed.
- **Figures named in the page, not in the script.** The owner adds rows; a row says which figure
  it wants (`data-figure`), and one that says nothing still gets one of its own, by its kind and
  its name. The seven named figures are the ones this page's works actually are.
- **On theme** is the works themselves: the primer's pyramid, the resin's tear, the bottle a
  purchase is about, the incense's two smokes, the forest and the rain the two unwritten
  explorations are after — and for what comes later, a material's molecule and an
  exploration's map.
- **The ring when idle** keeps the page's old drawn plate — the chamber's orbit printed small —
  as the thing the field returns to.

## How to test it

In `tests/index-pages.spec.js`:

- **`Explorations & Researches: the paragraph under the name, the table on the left three fifths,
  the field on the right`** — no Information heading, line or plates; the owner's paragraph,
  exactly, under the name and lined up with it; the table below it and in the top 45% of the
  window, between half and two thirds of its width; the field to its right and most of the
  window's height; no sideways scroll; and at 390px the field a band above the table.
- **`pointing at a row gathers the field into that work's figure, and leaving the table brings
  the ring back`** — the ring drawn with its caption; pointing at 000–003 gives the pyramid, the
  resin, the bottle and the smoke, each captioned with its row's name and each a different
  drawing from every one before it (read as a coarse grid of where the ink is); off the table the
  ring comes back, not at once but within three seconds; a row's link focused shows its figure
  and marks the row; and a row with no `data-figure` whose kind is Research is a molecule.
- **`the field answers the pointer over it`** — with the pointer held on the ring's band, the ink
  under it drops by more than 40%.
- **`the field with animation turned off › each figure is simply there, and nothing moves`** —
  the ring drawn at once and identical 0.7s later; a row pointed at is drawn at once.

`mobile.spec.js` already lists the page (no sideways scroll at 390px).

## Known issues / TODO

- The figures for 004 and 005 stand for explorations not written yet; when they are, nothing
  needs changing, but the owner may want other figures for them.
- On a phone the field takes turns only among the written works; the unwritten ones show only
  when tapped.

## 2026-09-26, later — abstract forms, not figures

> REmove the research specific stuff; and make it more so a general abstract geometric
> particulate thing. The closest thing to waht i like is the cloud when you hover the untitled
> researches/Explorations (and when you hover nothing). re-interpret it and do that please.

**The figures are gone** — the pyramid, the tear of resin, the bottle, the smokes, the firs, the
rain, the molecule and the terrain — and with them their hairline outlines, the words drawn into
the field (TOP, HEART, BASE, COLD, WARM) and every `data-figure` on the rows. Nothing on a row
says what the field draws for it any more.

**Everything the field draws is a cloud now**, the thing the owner liked, re-interpreted: a soft
haze of specks gathered round a **geometric form**, standing in **three dimensions** and turning
slowly about an axis leaning towards you (`SPIN`, `TILT`) — seen in perspective (`FOCAL`), the
nearer specks larger and darker, the further ones fainter. Every place in a form is blurred a
little (`fuzz`) and an eighth of every form's specks (`HAZE`) are left loose round it as a wider
cloud, so no form is ever a hard figure. A faint **web** of hairlines is strung between ninety
specks picked at random from the whole cloud (`WEB`, `WEB_REACH`) wherever two of them come near
each other — picked at random because a form places its specks in order, and the first ninety of
a sphere all stood at one pole, which drew a dark knot there.

- **Nothing pointed at: the ring**, a band of specks round the middle with dust inside it, as
  before but in depth, drifting a little about their places.
- **An Untitled row: the cloud**, the one form with no shape in it, drifting.
- **Every other row: a form by its number**, round a list of ten, so every row keeps its own and
  the rows next to each other differ: `sphere`, `knot` (a trefoil), `torus` (tipped at an angle,
  so it is neither the ring lying down nor, turned edge on, a band like the helix), `helix` (two
  strands, with rungs now and then), `disc` (a spiral of three arms round a core), `lattice` (the
  edges of a cube), `gyre` (three rings crossed), `saddle`, `shells` (three, nested) and
  `hourglass` (two cones, point to point). So 000 is the sphere, 001 the knot, 002 the torus, 003
  the helix, 004 the disc and 005 the lattice; a row added as 010 comes round to the sphere again.

A form's places are worked out once, the first time it is asked for, and kept (`formOf`). The
change between two is as it was: thrown out from the middle and gathered, each speck on a clock
of its own. The caption, the pointer parting the specks, the keyboard, the turns on a phone and
the layout are unchanged. With reduced motion every form is drawn once, turned to the same angle.

### What was tried and was wrong

- **A figure for each work** — see above. The owner found the literal figures wrong and liked
  only the cloud and the ring; the forms are those two, re-interpreted.
- **The torus standing upright**, like a wheel: turned edge on it was a tall band of specks, and
  the test found it hard to tell from the helix — as a person would. Tipped, it never is.
- **The web between the first ninety specks**: on the sphere those all stand at one pole.

### How to test it

In `tests/index-pages.spec.js`, **`pointing at a row gathers the field into an abstract form,
and leaving the table brings the ring back`** (replaces *…into that work's figure…*): no row
carries `data-figure`; the ring and its caption; rows 000–005 give the sphere, the knot, the
torus, the helix, the disc and the lattice, each captioned, and the first four each a different
drawing from every one before it; an Untitled row gives the cloud; off the table the ring comes
back, not at once; a row's link focused shows its form; a row renumbered 010 comes round to the
sphere; and **nothing is written into the drawing** (no `fillText` on the field's canvas).

*A different drawing* is now read as how differently the two spread their ink over a 24-by-24
grid, 0 to 100: measured, one form against itself a moment later, turned, is 14–25, and one form
against another 37 and up; the test asks for more than 30. (It was a count of cells with any ink
in them, which two tall forms of the same size could not be told apart by.) The other three tests
of the field are unchanged.


## 2026-09-26, last — its own clock, and a catalogue of shapes to choose from

> for the researches, I want the shapes to not change based on which research you hover, but
> rather to transform from one to another in the span of 12.5 seconds, then stay in their form
> for 5 and then start transforming again into the next one. I want you to come up with a list
> of shapes that you can put there, and we will decide. for example, the cube can go, i want you
> to keep the galaxy looking one (default), keep the gas cloud but make it bigger and cooler (the
> one when you hover the researches/explorations that have not been filled in yet), Keep the
> sphere from 000, and keep the 001, and 002 and 003 and 004. give me a big list, and with the
> list i want screenshots of how it would look. I want these eto look mathematical and abstract,
> as well as made from particles with some loci where you have geometric elements (such as
> triangles from the connected dots)

**The table does not conduct the field any more.** Pointing at a row, focusing its link or
tapping it does nothing to it; no row is marked `is-shown`, and the turns on a phone are gone
with it. The field keeps **its own time**: a form **holds** for `HOLD` (5s) and then
**transforms** into the next over `MORPH` (12.5s), round **the cycle** (`CYCLE`) and back to the
start. The first form gathers out of specks scattered over the field for `ARRIVE` (1.6s) before
its first hold.

**The cycle is the forms the owner kept**, in this order: the **galaxy** (the old ring with dust
inside it — the default, and first), the **sphere** (000), the **trefoil knot** (001), the
**torus** (002), the **helix** (003), the **spiral** (004, the disc) and the **gas cloud**, which
turns back into the galaxy. The cube (`lattice`) is gone.

**The gas cloud is bigger and churns**: four overlapping lobes of gas, two wisps curling out of
the middle and thickening as they go, two long filaments, a few dense knots and a wide faint halo,
filling most of the field; the inner part turns faster than the outer (`drift: "churn"`).

**A transformation** takes every speck from its place in the one form to its place in the next.
The two forms' places are **paired by rank** — from the top down in 24 bands, and round each band
in order (`perm`, `rank`) — so the top of one form goes to the top of the next and the whole
turns rather than tangling. The specks **set off in turn**: the top first, over the first half of
the transformation (`SWEEP`), with a little of each speck's own; and each **swings out of its
straight way**, most at half way (`ARC`). The field keeps turning throughout. Which place in the
form each speck holds is kept (`SLOT`) and carried from one form to the next, however many
transformations a hidden window has missed (`keepUp`).

**The loci**: here and there on the form, a few specks **joined each to its nearest three** by
hairlines, the triangles those lines close **faintly filled** and the specks at their corners
drawn a little larger — five standing at once, each coming up over 1.4s, standing about 7.6s and
going (`LOCI`, `LOCUS_*`). A locus gathers specks round one picked at random **on the shape
itself, never in its haze**, no two nearer than `LOCUS_GAP` (17px) so its triangles are open
rather than a knot, and it works out its lines once, when it comes — so it turns with the form as
one piece; a line pulled longer than `LOCUS_REACH` in a transformation is let go. The web between
ninety random specks is gone; the loci replaced it.

**The caption** says which form, and where it is: `03 / 07`, the form's name (*Trefoil knot*, or
*Sphere → Trefoil knot* while it turns), and *Holding* or *Transforming* — with a hairline over it
filling as the hold or the transformation goes (`.re-run`, `--run`).

**With reduced motion** the galaxy is drawn once, with its loci, and nothing ever turns into
anything.

### The catalogue

**`?form=<name>` holds any one form still on the page**, captioned *Held*: how the candidates
were photographed for the owner, and the way to look at one again. Every candidate is in
`SHAPES`; the ones the owner does not choose come out of the code.

The candidates, as they were shown (numbered for choosing):

| no. | name | `?form=` | what it is |
|---|---|---|---|
| 1 | Armillary | `gyre` | three rings crossed |
| 2 | Saddle | `saddle` | a surface curving up one way and down the other |
| 3 | Nested shells | `shells` | three spheres, one inside the next |
| 4 | Double cone | `hourglass` | two cones, point to point |
| 5 | Lorenz attractor | `lorenz` | where a point goes under Lorenz's three equations: the butterfly |
| 6 | Aizawa attractor | `aizawa` | a sphere with a tube drawn down through it |
| 7 | Rössler attractor | `rossler` | a flat spiral that folds over at its edge |
| 8 | Möbius strip | `mobius` | its straight rulings and its one edge |
| 9 | Klein bottle | `klein` | the bottle, as a wireframe |
| 10 | Hopf fibration | `hopf` | circles on a torus, every one linked through every other |
| 11 | Lissajous knot | `lissajous` | a curve of three sines |
| 12 | Torus knot (7, 3) | `torusknot` | a line wound seven times round and three times through |
| 13 | Seashell | `seashell` | a conch's spiral, as a wireframe |
| 14 | Hyperboloid | `hyperboloid` | two families of straight lines crossing into a waist |
| 15 | Geodesic sphere | `geodesic` | an icosahedron cut in two and pushed out: triangles |
| 16 | Phyllotaxis | `phyllotaxis` | a sunflower's seeds on a dome, each turned the golden angle |
| 17 | Spherical harmonic | `harmonic` | a sphere swollen into twelve lobes |
| 18 | Enneper surface | `enneper` | a minimal surface folding over itself |
| 19 | Ripple | `ripple` | rings on still water |
| 20 | Borromean rings | `borromean` | three rings, no two linked, all three held |
| 21 | Supershape | `supershape` | the superformula in three dimensions, as a wireframe |
| 22 | Vortex | `vortex` | a funnel of specks whirling, faster nearer the middle |
| 23 | Gyroid | `gyroid` | a minimal surface of labyrinths, cut to a ball |
| 24 | Helicoid | `helicoid` | a spiral staircase of a surface |

A form marked `fit` (the attractors, the Möbius strip, the Klein bottle, the seashell, Enneper's
surface, the supershape) is recentred on its own middle and scaled so all but its furthest few
specks fill the same reach as every other form, whatever its own numbers are; `turn` stands one
at an angle. The attractors are traced once and sampled **in order along the path**, so their
loops read as lines; the surfaces that would otherwise read as a fog are drawn as their
**wireframe** (`wire`).

### What was tried and was wrong

- **Sixteen specks packed round a locus's anchor**: in a dense form they stood within a few
  pixels of each other, and the locus read as a dark blot. They are kept 17px apart.
- **Loci in the haze**: a locus that caught loose specks drew a triangle hanging off the shape.
- **The Lorenz attractor sampled at random** along a long path was a smudge; turned to face you
  and sampled in order along a shorter one, it is the butterfly.
- **The Hopf fibration by stereographic projection**: the circles came out at wildly different
  sizes and the whole was a blot at the middle. It is one torus's linked circles now.

### How to test it

In `tests/index-pages.spec.js` (run on the page's own clock, sped up with Playwright's):

- **`the field holds each form five seconds and turns into the next over twelve and a half,
  whatever is pointed at`** (replaces *pointing at a row gathers the field into an abstract
  form…*) — the cycle as listed; the galaxy held and captioned `01 / 07`; a row pointed at changes
  nothing and no row is marked; still holding at 6.3s, turning into the sphere at 7s (captioned
  *Galaxy → Sphere*), half way through at 12.9s, still turning at 18.6s and the sphere held at
  20.1s, a different drawing from the galaxy; on to the knot after its five seconds; and round the
  whole cycle back to the galaxy. Nothing written into the drawing. **Its clock is paused before
  the page arrives** (`pauseAt`), since 2026-09-26: an installed clock goes on flowing at the real
  rate between the steps, and on a busy machine that drift ate the 0.3s between *still holding*
  and the turn, failing a full run. Paused, it showed its last step had been aimed at the very
  edge of the galaxy's return (124.1s) and passed only on drift; it is aimed at 126.6s, the
  middle of that hold.
- **`here and there on the field, specks are joined into triangles`** (new) — in a second, more
  than twenty triangles filled and a hundred lines drawn on the field's canvas.
- **`a form can be held on the page, and the cube is gone`** (new) — `?form=knot` holds the knot,
  captioned; `?form=lattice` is not a form, and the page runs its cycle.
- **`the field with animation turned off › the galaxy is simply there, and nothing moves`** —
  drawn at once, and the same drawing twenty-five seconds later.

## 2026-09-26, later still — twenty more to choose from

Shown the ten best of the first list, the owner asked for more before choosing: *"I want you to
generate about 20 more of these and show me the exact same way you have now, and then we will
choose."* Twenty more stand in `SHAPES` now, numbered on from the first list and **in the order
they were ranked for the owner, the best-looking first** — so the table is also the ranking. Each
is photographed held (`?form=`), as the first were, on two sheets of ten.

| no. | name | `?form=` | what it is |
|---|---|---|---|
| 25 | Buckyball | `buckyball` | the truncated icosahedron — a football, and the carbon-sixty molecule |
| 26 | Star tetrahedron | `stella` | two tetrahedra through each other, one point up and one down |
| 27 | Tesseract | `tesseract` | the four-dimensional cube, turned a little through the fourth dimension and seen from along it |
| 28 | Stellated dodecahedron | `stellated` | the small stellated dodecahedron: twelve points, pentagrams all round |
| 29 | Five tetrahedra | `fivetet` | five tetrahedra in a dodecahedron's twenty corners, each corner used once |
| 30 | 24-cell | `cell24` | a four-dimensional solid with no match in three, seen as the tesseract is |
| 31 | Loxodromes | `loxodrome` | six rhumb lines spiralling across a sphere into its poles |
| 32 | Spirograph | `spirograph` | the toy's curve — a wheel rolled inside a wheel — lifted and let down as it goes |
| 33 | Toroidal coil | `coil` | two wires wound round a ring |
| 34 | Dipole field | `dipole` | a magnet's field lines, from pole to pole all round the axis |
| 35 | Dini's surface | `dini` | a funnel twisted into a spiral |
| 36 | Sierpiński tetrahedron | `sierpinski` | a tetrahedron of four half-size ones, three levels down, as edges |
| 37 | Hilbert curve | `hilbert` | one line visiting every cell of a four-by-four-by-four cube at right angles |
| 38 | Thomas attractor | `thomas` | a point wandering a lattice of loops |
| 39 | Chladni figure | `chladni` | sand on a sounded plate, gathered on the lines that stand still |
| 40 | Chua's double scroll | `chua` | two scrolls, the point going round one and jumping to the other |
| 41 | Halvorsen attractor | `halvorsen` | three lobes round one axis, a propeller |
| 42 | Figure-eight knot | `eight` | the knot with four crossings |
| 43 | Dupin cyclide | `cyclide` | a torus pinched on one side, every line on it a circle |
| 44 | Egg crate | `eggcrate` | sin x sin z, as its grid |

**The polytopes are drawn as their edges** (`onEdge`, the geodesic's way made shared): the
edges worked out once from the corners — every pair standing a set distance apart (`edgesAt`,
which works in four dimensions as in three) — and a few specks standing on the corners. The
two four-dimensional ones are turned a little through the fourth dimension and then seen in
perspective along it, which is what makes the tesseract a cube inside a cube. **The Hilbert
curve** is Skilling's construction (`hilbert`); a check at the time found its 63 steps each one
cell long and its 64 cells all different. **Halvorsen's and Thomas's attractors** are symmetric
about the (1, 1, 1) diagonal and are stood on it (`diag`); Halvorsen's is leant towards you so
its three lobes show.

### What was tried and was wrong

- **A Calabi–Yau manifold** (the quintic's cross-section, as twenty-five patches): in 2400 specks
  it was a box of dust, whichever way it was seen. Out.
- **Boy's surface** (Bryant and Kusner's): a ball with a crown, too many lines crossing to read.
  Fewer lines did not save it. Out, for the Hilbert curve.
- **A breather surface** was a needle through a ball; **Kuen's surface** an unreadable blob; **an
  electron orbital** (hydrogen's 3d, sampled as a cloud of chances) a fuzz; **the Riemann surface
  of the square root** a sheet seen edge on. All out, for the 24-cell, the coil, the spirograph
  and the egg crate.
- **The cinquefoil knot as a tube**, rings along it and then five strands twisting round it: a
  tangle either way. Out, for the five tetrahedra.
- **The egg crate tipped towards you**: a jumble. Lying flat, it reads as a wave.

### How to test it

- **`every candidate on the second list can be held, and draws itself`** (new, in
  `tests/index-pages.spec.js`) — each of the twenty held by `?form=`, named in the caption, and
  drawn with at least half the ink the sphere has: a shape whose numbers came out wrong draws only
  its haze. No page errors.

### Known issues / TODO

- ~~The owner is to choose from both lists~~ — they did; see the next section.

## 2026-09-26, night — the seventeen chosen, eight and eight, the arrows, and more geometry

The owner chose: *"from these the best are going to be 2,3,4,5,6,7,9, 27,30,32, 35,36,37,38,39,42
and helix ... i want you to put these on the page instead of what there is right now, and make it
now last 8 seconds transforming to 8 seocnds holding. i also want you to be able to on command go to
the next one or back with two arrows that are small and subtle near the bottom, and i want it to
display the name (in tiny script) of what is actually being shown in the particle thing. Also, to
the shapes and stuff, i want you to add triangles and a little geometry."*

**Which 2 to 9** was asked, because two sheets carried those numbers — the first catalogue (1–24)
and the ten best (1–10) sent after it. The owner meant **the ten best**. So the cycle is, in the
order the owner gave it (`CYCLE`): the geodesic sphere, the Borromean rings, the Rössler attractor,
the Aizawa attractor, the Lissajous knot, the armillary, the ripple, the tesseract, the 24-cell, the
spirograph, Dini's surface, the Sierpiński tetrahedron, the Hilbert curve, the Thomas attractor, the
Chladni figure, the figure-eight knot — and the helix, from the old cycle, last.

**Everything else came out of the code**, the owner having said "instead of what there is right
now": the galaxy, the sphere, the trefoil knot, the torus, the spiral and the gas cloud (the old
cycle but the helix), and every candidate not chosen, from both lists — with their helpers where
nothing else used one (`fib`, `superformula`, the complex numbers, Boy's and the rest) and **the
drift** the galaxy, the gas cloud and the vortex had (`float`, `churn`, `whirl`), which no form
left uses. `?form=<name>` still holds any one form of the cycle still on the page; a name no longer
a form runs the cycle.

**The clock is a small machine now** rather than a sum of the time: it is showing form `cur`,
holding it or on its way to form `to`, since `since`, for `dur` (`tick`, `setOut`, `land`), and
brought up to the time however long the window was away. That is what lets an arrow start a
transformation at any moment. `HOLD` and `MORPH` are both 8000; the first form gathers for 1.6s
(`ARRIVE`) before its eight.

**The arrows** (`.re-step`, a hairline chevron in a 22px button either side of the name, at a third
of the ink, darker under the hand) go on to the next form or back **at once**, in a quicker
transformation (`QUICK`, 2.6s); one pressed while another is under way **lands** it first — the
specks are sprung, so they carry on rather than jump — and then sets out from there. The clock
carries on from wherever they leave it. Held (`?form=`), there are none. With reduced motion an arrow
simply shows the other form, drawn once and still.

**The name**, *"in tiny script"*: the caption is 10px mono, centred at the field's foot between the
arrows — its number (`03 / 17`) and the form's name, and nothing else (*Holding* and *Transforming*
are gone, and so is the arrow between two names). It is **the name of what the field is actually
showing**: a transformation's new name is taken up half way through it, when there is more of the
new form than the old, with a short fade (`is-new`). The name keeps one width (23 characters), so
the arrows never move. The hairline over it fills as the hold or the transformation goes, between
the arrows.

**Triangles and a little geometry**:

- **More loci** (`LOCI` 7, from 5), their triangles a little darker (`LOCUS_FILL`).
- **The spans** (`SPANS`, two at a time): a large triangle across the whole form, its corners specks
  on the shape 110 to 250px apart and none of its angles under 31° (`SPAN_ANGLE`), faintly filled,
  a small arc in each corner, a small open square on each corner as the site marks a point, and one
  of its angles **written in degrees** (`58°`), in 9px mono. A span stands nine seconds; it goes as
  a transformation starts (it is drawn across one form) and none comes while one is under way.
- **The frame** the form turns in: **the equator** it turns round, a dashed ellipse just outside
  every form (`EQUATOR`, 1.02), ticked every thirty degrees — the ticks turning with the form, the
  nearer ones plainer — and **the axis** through it, dashed, with a short bar at each end. All of it
  at 13% ink (`FRAME_INK`), behind the specks.

### How to test it

In `tests/index-pages.spec.js`:

- **`the field holds each form eight seconds and turns into the next over eight, whatever is
  pointed at`** (replaces the five-and-twelve-and-a-half test) — on a paused clock: the geodesic
  sphere held and captioned `01 / 17`; a row pointed at changes nothing; still holding at 9.3s,
  turning into the rings at 10s with the sphere's name still up, its name still the sphere's at
  13.2s and the rings' at 14.2s (`02 / 17`); still turning at 17.4s, the rings held at 18.2s and a
  different drawing; on to the Rössler attractor at 26s, held at 37s, and on to Aizawa's at 42s.
  Nothing written into the drawing **but angles** (`58°`). It ran a whole lap once; seventeen forms
  at sixteen seconds is 272 seconds of frames, too long a run — the wrap round from the last to
  the first is the arrows' test's.
- **`the arrows at the field's foot go on to the next form, or back, at once`** (new) — both there,
  small and near the foot; next starts the rings at once, past half way in 1.5s and there in 2.6s;
  back twice, the second while the first is under way, lands the sphere and goes on round to the
  helix (`17 / 17`); and eight seconds later the cycle carries on round to the sphere.
- **`here and there on the field, specks are joined into triangles, with a little geometry`**
  (replaces the loci test) — in a second: triangles filled and lines drawn, as before, and now arcs
  (the spans' angles), angles written in degrees, and dashed lines (the equator).
- **`every form in the cycle can be held, and draws itself; the ones not chosen are gone`**
  (replaces the second list's test and `a form can be held…`) — each of the seventeen held, named,
  with no arrows, and drawn with at least three tenths of the inkiest form's ink; the galaxy, the
  sphere, the gas cloud, the knot, the torus, the spiral, the cube, the hyperboloid and the
  buckyball are not forms, and the page runs its cycle.
- **`the field answers the pointer over it`** — now reads the inkiest patch near the form's middle
  rather than a place on the galaxy's ring.
- **`the field with animation turned off › the first form is simply there, nothing moves, and the
  arrows change it without moving`** (replaces *the galaxy is simply there…*).

### Known issues / TODO

- The arrows ask for a 2.6-second transformation; the owner may want it as slow as the field's own
  eight, or quicker still. One number (`QUICK`).


## 2026-09-26, last — the table a little lower

> in RE, lower the left side table a little

The table on the left stands a little lower under the owner's paragraph — `margin-top` on
`.researches-page .index-board` is `clamp(44px, 9.5vh, 100px)` (it was `clamp(26px, 5vh, 54px)`):
40px lower at 1440 × 900, 32 at 1280 × 720, 46 at 1920 × 1080. All ten rows still fit without the
table scrolling; a phone is unchanged. Tested in `tests/index-pages.spec.js`, in the layout test:
the table more than 70px below the paragraph (it was 45).

## 2026-09-27 — twelve and six, the bar across the foot, the arrows plainer

> make the loading bar stretch out a little bit in the bottom right of the RE (image 1). i want it
> to be longer (as it was before). I also wanna make it 6 transforming and 12 holding. make the
> arrows a little more obvious please.

- **Twelve seconds held, six turning** — `HOLD` 12000 and `MORPH` 6000 in `explorations.js` (they
  were eight and eight). The first form still takes `ARRIVE` (1.6s) to gather before its hold, so
  the first transformation starts at 13.6s. `SWEEP` is unchanged: over the first half of a
  transformation the specks set off in turn, which at six seconds is three.
- **The bar is as long as it was before the arrows**: it had been cut down to the room between
  them (`left`/`right` 28px of the caption) when they arrived; it is a child of the field now, not
  of the caption, and runs across the field's foot 18px in from each side, 46px up (42px on a
  phone), over the caption — which is where it stood when it spanned the old caption's whole
  width. "Image 1", which the owner mentions, did not reach this session; "the bottom right of the
  RE" is the field, which is where this bar is, and nothing else on the page loads.
- **The arrows plainer** — each in a hairline square (`border: 1px` at 0.3 of the ink), the
  chevron at 11px and 1.5 wide (it was 9 and 1.2) and at 0.66 of the ink (it was 0.34); pointed
  at, the square and the chevron go to the full ink. Still 24px, so still "small and subtle near
  the bottom".

Tested in `tests/index-pages.spec.js`: **`the field holds each form twelve seconds and turns into
the next over six, whatever is pointed at`** (the clock at 13.3s, 14.0s, half way at 16.6s,
landed at 20.0s, on to Rössler at 31.8s and Aizawa at 49.8s); **`the arrows at the field's foot go
on to the next form, or back, at once`** (twelve seconds held after them now).

## 2026-09-27, later — more particles on the shapes

> add a few more particles to the 3d shapes on the RE page, so the shapes look more complete.

`COUNT` is **3600** (2000 on a phone) — it was 2400 (1300) — and every one of the new specks is on
the shape: `HAZE` goes from a tenth to about a fifteenth, so the loose cloud round a form keeps the
240 specks it had. Measured in a browser, the field still draws at 60 frames a second.

## 2026-09-28 — back from away

At the owner's "make the animations in RE ... animate even when you click off of the page": the
field's forms and its turn already keep the clock's time, and the page's frames are kept coming
when a browser holds them back ([the page shell](2026-09-11-the-page-shell-and-menu.md#2026-09-28--the-page-keeps-its-own-time));
coming back to the page after more than 0.8s away, **its specks are put straight where they belong**
(`settle`, on `visibilitychange` in `explorations.js`) rather than springing there from where they
were left. Tested in `tests/keep-time.spec.js`.

## 2026-09-28 — the tesseract, classic

> also sorry, but fix the tesseract, i want it to look a little more classic, like in the picture
> attached

The picture is the one everyone knows: **a cube inside a cube**, square to it and centred in it,
each inner corner joined to the outer corner beside it. The field's tesseract was turned a little
through the fourth dimension first (0.34 radians in two planes) before being seen along it, which
threw the inner cube off towards a corner and bent the whole into something less recognisable. It is
seen **straight along the fourth dimension** now — the eight corners on one side of it at the outer
cube, the eight on the other at **0.55** of it, as in the picture — and **in gentler perspective**
than the other forms (`focal: 7` on the form, against the field's `FOCAL` of 3.2; `focalAt`, and a
transformation eases from one form's perspective to the next's), because with the field's own the
outer cube read as a roof from some sides of its turn. The fuzz a hair less (0.005), so its edges
stand cleaner.

Tested: **`the tesseract is the classic one: a cube square inside a cube, corners joined`** in
`tests/index-pages.spec.js` — read off the form's own code: no turn through the fourth dimension, a
perspective of its own, and its sixteen corners eight on the outer cube and eight at 0.55, all square
and centred.

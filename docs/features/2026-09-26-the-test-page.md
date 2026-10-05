# The test page, and the network on it — the Note Library since 2026-09-29
Date: 2026-09-26
Files touched: `works/test-page.html` (new), `network.js` (new), `note-figures.js` (new,
2026-09-28), `notes-data.js` (loaded, since 2026-09-27), `style.css` (`.network-page`,
`.net-*`, and the dark `--chrome-ground` list), `nav.js` (`SITE_LINKS`), `search-page.js`
(`PAGES`), `tests/test-page.spec.js` (new), `tests/menu.spec.js`, `tests/pages.spec.js`,
`tests/mobile.spec.js`, `CLAUDE.md`. Since 2026-09-29, when it became the Note Library: `categories/note-library.html` (the drawing and the catalogue), `works/test-page.html` (a forwarding page), `tools/note-library/` (new: `catalogue.py`, `base.json`, `research/`), `tests/note-library.spec.js` (its tests, moved from `tests/test-page.spec.js`), `tools/seo.py`, `sitemap.xml`, `.gitignore`; `note-library.js` deleted. For two rounds the same night: `tree.js`,
`tools/tree-cloud.mjs`, `images/Test-Page/` and `image-js` in `package.json` — all taken out
again.

**Since 2026-09-29 this is the Note Library** — at `categories/note-library.html`, the periodic table gone, the old address forwarding, **the Sources** at its centre and every note written again from two sources: see [that section](#2026-09-29-later--the-note-library-itself-the-sources-at-its-centre-and-every-note-written-again). Then, [last](#2026-09-29-last--the-middle-nodes-the-way-in-journeys-that-fade-the-air-and-a-search-that-touches-nothing): seeing every accord, only their **middle nodes** answer; journeys **fade**; **the air** behind it moves; and the search **answers as it is typed and touches nothing**. And [very last](#2026-09-29-very-last--combinations-by-fragrance-and-galaxies-far-away): combinations keep on **only what is in a fragrance with every chosen note**, and **galaxies** stand far away in place of the random lines.

**Since the night of 2026-09-27 the page carries the Note Library as networks** — see
[that section](#2026-09-27-night--the-note-library-as-networks), which replaced [the Note
Library in three dimensions](#2026-09-27-later--the-note-library-in-three-dimensions) (galaxies)
the same night — and **since 2026-09-28 it is its own version of the library**, with a window for
every note, two arrows on the left, and an opening: see [that
section](#2026-09-28--its-own-note-library-two-arrows-an-opening-and-shine) — **and since the evening
of 2026-09-28 its note window has nothing of chemistry in it and a figure of every note in
particles, and it has COMBINATIONS**: see [that section](#2026-09-28-evening--a-glow-of-its-own-the-flash-on-a-journey-a-window-without-chemistry-and-combinations) — and **since the last round of 2026-09-28 there is no blur anywhere on it, a note's window lists the fragrances in each tier of its pyramid, and two notes in combinations keep only the middle of their Venn diagram**: see [the last section](#2026-09-28-last--no-blur-the-fragrances-in-each-tier-and-the-middle-of-the-venn-diagram) — and **since the very last round of 2026-09-28, two notes or more in combinations are lit alone and joined only to each other**: see [that section](#2026-09-28-the-very-last--two-notes-or-more-lit-alone). The one network, then the five, then the galaxies, described first below, are
gone from the code; they are kept here for the reasoning, as the site's reports keep what was
replaced.

What changed: A new page, **Test page**, last in the Menu, designed for a laptop: blank but for
**the network** — a dense map of solid red nodes of every size, a few pale and amber among them,
joined by thousands of hair-thin lines, on a dark ground, after a picture the owner sent. It
stands in three dimensions and turns slowly on its own; a drag turns it, the wheel brings it
closer, and a node under the pointer lights up its own links. Small black **tags** stand beside
some of the nodes, and two are **marked** yellow, as the picture's are.

The owner, 2026-09-26, first:

> add a new page to the whole site, and make it completly blank. this will be a test page.

and then, after two trees (below):

> okay nevermind, remove that tree entirely, and i want to try soemthing else. I want you to make
> a dense map of red nodes that are interconnected. these nodes should be solid and resemble a
> network. do this on the test page. Addiyionally, let it resemble the attached picture

The picture: a dark grey ground; a dense cluster of glossy red spheres of many sizes, some white
and amber ones among them, specks of grey; thousands of thin lines, most short and dense in the
middle, some long ones running out to outlying nodes; small black tags in a mono face beside some
nodes (*TOUK TARK*, *EDELIDAT*, …) and two yellow ones (*FME*, *FHIX.*), each joined to its
neighbours by yellow lines. Asked whether the nodes should stand for something on the site, the
owner chose **"abstract, like the picture"** — so nothing in it means anything, and the tags'
words are made up in the picture's manner. Laptop only, at the owner's earlier word ("for now
leave the phone be").

## How it is built — `network.js`

Three.js r128, from the same address as the home page's map (so the tests' local copy answers it
too), with the library's own lit spheres, lines and points — **no shader of its own**. The
network is **seeded**, so it is the same network on every visit.

- **The nodes** (`COUNT`, 540): half in a dense **core** a little above the middle, about a third
  in a looser **body** round it, the rest **outliers** far out, more of them below and to the
  sides. Two thirds red (`RED`, five reds), then pale, a few amber, and small grey specks. A
  node's size comes from how many links it has (`0.018 + 0.0065·√degree`), with a few large ones
  anyway. They are **one** `InstancedMesh` of lit spheres (`MeshStandardMaterial`, a little
  glossy), so 540 spheres cost one draw.
- **The links**: every node joined to its nearest two to five (`NEAREST`) — the mesh; 26
  **hubs** (`HUBS`) each sending ten to thirty-four lines out all over, the further the likelier
  (`HUB_LINKS`); every outlier tied back in by two to five long ones (`OUTLIER_LINKS`). About
  2,100 in all, as one `LineSegments`, each in the colour of what it joins, one in sixteen
  **teal** (as the picture has), and **faded towards the ground by its length**, as thin lines
  at a distance are.
- **The marked two**: two nodes low in the network, each joined to its four nearest by **yellow**
  lines (`MARK`), with the yellow tags beside them.
- **The ground**: the page's own `--bg`, `#1f1f20`, with a soft darker shadow under the network
  (in the stylesheet), and fog to the same colour so the far side sinks back into it. Ninety
  grey specks in the air round it.
- **Light**: a key from above and to the left, as the picture's, a warm rim from behind, a
  hemisphere and an ambient so no sphere goes black.

## Seeing it

It opens a little turned (`yaw` 0.35) and **turns on its own**, very slowly (`TURN_RATE`). A
**drag** turns it and tips it (`DRAG`, within `PITCH`); it starts turning on its own again
`TURN_AFTER` (2.6s) after being let go. The **wheel** brings it closer or further (0.45 to 1.6
times). Pointing at a node **lights its links** — a pale line over each — makes the node a
third larger and dims the rest of the lines; the turning holds while it does. The pointer is
matched to a node from each sphere's middle and size (`ray.distanceSqToPoint`), not triangle by
triangle, so it stays quick. A hint at the foot of the window — *Drag to turn it · scroll to
come closer · point at a node* — goes once it has been turned.

How far away it is seen from is worked out from the window (`size()`), so the whole network fits
its height and width.

## The tags

The words are in the page — one `<li class="net-label">` each, a name and sometimes a small
`<span>` after it (*FSTR 04 (01.44.7)*) — and the two yellow ones carry `is-marked`. The script
gives the plain ones to the first six hubs and then the outliers with the most links, and the
yellow ones to the two marked nodes. Every frame each is placed **beside its node, on the side
away from the middle**, fainter the further back its node stands (the yellow ones never), and of
any two that would touch the fainter steps aside — so none is ever over another. They come up
one after another once the page has drawn.

## Why / key decisions

- **Abstract**, at the owner's choice: the nodes are not the site's pages or fragrances.
- **Solid, lit spheres** rather than flat discs: the picture's are glossy, and the owner said
  "solid".
- **Instanced spheres and one set of lines**: three thousand-odd objects drawn as three.
- **Seeded**: the same network every time, so what the owner sees is what they are commenting on.
- **Laptop only**: the page is not designed for a phone yet; it does not scroll sideways there.

## What was tried and was wrong

Two trees stood on this page the same night, each taken out when the owner asked. Nothing of
either is in the code: no `tree.js`, no `tools/tree-cloud.mjs`, no `images/Test-Page/`, no
`image-js`, no `.tree-*`.

- **The machine**, first: asked for "this tree: picture 1 … a 3D render … made mechanical, but
  … areas of green and brown … labels that come out of it", and then "translucent. render the
  ground with it, but not all of the background". It **built** a tree: a faceted trunk in eight
  flanged sections with six green sap conduits seen through it, jointed roots with collars
  ending in anchors (one arching on a strut), nine tiers of needled boughs and a leader, all
  translucent with their edges drawn, on a painted patch of ground, with labels such as *Crown
  array* and *Sap conduits*. The owner: "take the image as is and make it into a 3d one, not
  recreate it".
- **The photograph made three-dimensional**, second: the owner's picture turned into a cloud of
  about 213,000 of its own coloured specks, each pixel stood at the depth it had in a model of
  the scene traced off the picture (a camera, a floor rising behind the trunk, the trunk a
  column, the roots tubes, the stones domes, the unseen soil filled in), made once by a tool
  with `image-js`, opening as the photograph and turning all the way round, with ten labels on
  leader lines. The owner: "remove that tree entirely, and i want to try soemthing else".

The lessons that still hold for anything on this page: a picture seen along +z comes out
mirrored in three.js unless z is turned round; and a heavy WebGL frame on the tests' software
renderer is slow enough that a test on a paused clock can time out — the tests here run on real
time, with a longer allowance.

## How to test it

`tests/test-page.spec.js`:

- **`a dense network of red nodes is drawn on the dark page, and nothing else`** — over 400
  nodes and 1,500 links; read off a screenshot, thousands of red pixels, the corners and edges
  the page's own dark ground (`#1f1f20`), no heading or writing.
- **`tags stand beside the nodes, two of them yellow, none over another`** — more than eight
  showing; the yellow ones exactly *FHIX.* and *FME* on `#f2b418`, the rest on black; no two
  overlapping.
- **`a drag turns the network, and its tags go with it`** — turning on its own, turned further by
  a drag, the hint gone, and the tags moved with it.
- **`pointing at a node lights up its links`** — a node found under the pointer, its links lit,
  and let go when the pointer leaves.
- **`without its 3D library the page says so, and is otherwise blank`**.
- **`the test page with animation turned off › the network stands still, its tags simply there,
  and still turns by hand`**.

It is also in `pages.spec.js`, `mobile.spec.js` (nothing wider than a phone) and `menu.spec.js`
(last in the Menu).

## Known issues / TODO

- **Not designed for a phone yet**, at the owner's word.
- **The tags' words are made up**, in the manner of the picture's; they are the owner's to
  change, in the page.
- **A first answer**: how dense, how red, how it turns and what it does under the hand are each a
  number at the top of `network.js`.

## 2026-09-27 — a title that is read and not drawn

For the site-wide pass on headings ("exactly one `<h1>` per page" — see [search
engines](2026-09-26-search-engines-and-the-address.md)) the page carries `<h1
class="visually-hidden">Test page</h1>` inside its `<main>`: a screen reader and a search engine
read it, and nothing is drawn — the page is as blank as the owner asked. Tested in
`tests/test-page.spec.js`: **`a dense network of red nodes is drawn on the dark page, and nothing
else`** still finds no heading or writing drawn, and the one `<h1>` a single pixel, clipped away.

## 2026-09-27 — five systems, glowing, that stand for something and can be travelled between

> for the test page, I want you to make more spaced out, the balls should be red and glowy, i want
> them to be more techy and geometric, i also want there to be more effects. i like it spinning, i
> like it being a netweork. I want the balls to correspond to something, for now make it
> arbitrary.
>
> I want when you select a sphere, the rest turn translucent (opacity change), make it a part of a
> several part system going in 5 directions where you would have a system in the middle and then 4
> more such systems, one on each "corner" of this system. you should have a line attaching them
> and clicking on it will take you from one to another.

`network.js` was rewritten round **five systems** (`SYSTEMS`): **NEXUS** in the middle (150 nodes)
and **ARGO**, **HALCYON**, **KESTREL** and **VANTA** at its top left, top right, bottom right and
bottom left (110 each), standing further back, so that from the middle they sit in the window's
four corners — a quincunx. "Corner" was read as the corners of the window's square round the middle
system, which is the likelier reading of "one on each corner"; the corner systems are the same
kind of network as the middle one ("4 more such systems").

- **Spaced out**: no two nodes in a system nearer each other than `GAP` (0.33 — they were a dense
  cluster), fewer in the core, and each joined to its nearest two to four, with seven **hubs** a
  system sending lines further.
- **Red and glowing, techy and geometric**: every node a **faceted** red sphere (an icosahedron,
  flat-shaded, lit, glowing from within) with a soft **halo** added to what is behind it (`SPOT`,
  one soft spot drawn once, as `Points`); the six busiest in each system in a turning **wire
  octahedron** with a dashed ring; each system turning inside a **frame** — a ticked, dashed ring
  round its middle, another across it turning the other way, and its axis. The pale, amber and
  grey nodes of the picture are gone; every node is red.
- **More effects**: **pulses** of light running along the links (46 a system), and along the
  bridges both ways; a **ping** — a ring going out from the middle of the system you are at every
  four seconds; the halos; the cages turning; specks in the air.
- **Spinning**: every system turns slowly about its own upright (`SPIN`), each at its own rate;
  slower while a node is pointed at or selected. A drag still turns the view (round the system you
  are at), the wheel still brings it closer.
- **Every node stands for something — arbitrarily, for now**: a code (`NXS-042`), a **role**
  (`ROLES`: relay, archive, sensor, beacon, vault …), a load, a latency, its system and how many
  links it has. The tagged nodes of the middle system are **named** by their tags (the page's
  `.net-label` words). Pointed at, a node says its code and role in a small label (`.net-hover`).
- **Selecting**: pressing a node **selects** it — it grows and goes white-hot, its own links light
  up, a **card** beside it (`.net-card`) says what it stands for — and **every other sphere, in
  every system, turns translucent** (13% opacity, over half a second), the other lines and pulses
  faint, the other cages dim. Pressing it again, pressing empty space, or Escape lets it go and
  they come back. It is done with two sets of spheres per system — solid, and a translucent
  **ghost** of each — only one of which is ever at its size; the ghosts' opacity is what fades.
- **The bridges**: a line from the middle system to each corner one — a lit core between two faint
  rails, three wire diamonds along it, pulses running both ways. Pointed at, it lights up and says
  where it goes (*Travel to 03 · HALCYON →*); **pressed, the view flies along it** (1.9s, eased,
  pulling back a little half way) to that system. From a corner, the same bridge leads back to
  the middle; a bridge that does not touch where you are takes you to its far end. Arriving at a
  corner, the view **turns part of the way round** (`poseAt`) so that you look back across that
  system towards the middle, which stands in the distance with its other bridges; the middle
  system is seen square on.
- **The map** (`.net-map`, bottom right): the five systems as a quincunx of diamonds joined as the
  bridges join them, the one you are at lit, with its number, name and counts over it; its
  diamonds are buttons that travel there too (and what a keyboard can use).
- **The tags** stay beside the middle system's nodes and fade while you are at another; the two
  yellow ones never give way, and if they meet the second stands under the first.

With **reduced motion**: nothing spins, runs or pings on its own; a selection changes at once; a
journey is made at once. Without the library the page still says so.

For the tests, `window.NetScene` says where a system's nodes and bridges stand on the window, the
state (where you are, what is selected, how translucent the rest are), and the smallest gap in a
system.

Tested in `tests/test-page.spec.js`: **`five networks of glowing red nodes are drawn on the dark
page, and nothing else`** (five systems, four bridges, the ground between them dark, read as the
mean of a small block so a passing speck does not count); **`the nodes of every system are spaced
out`**; **`pressing a node selects it: the rest turn translucent, and it says what it stands
for`** (its code when pointed at; pressed, the rest under a fifth of their opacity, its links lit,
the card with its code, system, role and latency; Escape, and whole again); **`pressing a line
between two systems takes you along it, and back`** (the label, the flight, the map saying
HALCYON, the same bridge back to the middle, and a map diamond to VANTA); and the earlier tags,
drag, pointing and reduced-motion tests, the last now also making a journey at once.

## 2026-09-27, later — the Note Library in three dimensions

> additionally, I want you to do something with the test page. I want you to model the note library
> according to that. I want each galaxy to be an accord, and then the dots on it should be the
> individual notes that belong to that accord group. I want this all to be 3d (as it is), and
> navigtable freely with rotation. I want you to have a window on the right that contains the option
> to make the search bar available. On this right side window should also be the selection of the
> accords manually (as it is currently below the search bar in the note library page).
> for my idea to work, there would be one central red library, with all the notes and accords within
> that central galaxy. Then, if you press a button to expand it (bottom middle of the screen, then
> each of the accords' galaxies will separate and go into a separate direction. This will allow you
> to explore each accord individually. You can select the accord you want to go to in a drop down
> menu on the bottom of the page (it appears after the expansion of the galaxy).
> The nodes should remain red and glowing, until they expand, where they will then turn their
> individual colours as they are now. They should remain aglow. WHile they transition from the red to
> their respective colours, I want them to turn white and have changing geometrical links between
> them too.
> I want all transitions to be smooth and run at 60FPS.
> when the nodes diverge from the central galaxy in the expansion to form their own individual accord
> galaxies, I want there to be a central node which is connected to all thje galaxies. This will be
> used as a navigation point so you can go from one accord to another interchanagably, which I want
> you to make quite easy.
>
> While youre at it, I want you to make sure all the transitions can run at 60FPS on the entire
> page.

`network.js` was written again round the Note Library. Nothing of the five systems is in it: no
`SYSTEMS`, no `ROLES`, no tags from the page, no `.net-map`, no `NetScene.busiest` or `gap`.
"The entire page" was read as the whole of the test page — every transition on it — and not the
whole site, which is the likelier reading of "the entire page".

### The library, read off the Note Library

The page writes none of it down. As it opens it **fetches `categories/note-library.html`** and reads
the catalogue out of it — every accord (`.lib-shelf`: code, name, line), every note in it
(`.lib-record`: id, name, other spellings, what it is) — as the fragrance reader fetches the
individual fragrances, so there is one catalogue on the site and not two. It loads `notes-data.js`
and counts **how many fragrances use each note exactly as the library counts them**, and gives every
note **the library's own number and symbol** (the same `symbolFor`, run down the notes in the same
order). The accords' colours are the library's `HUE`s, a little more saturated (`SAT`, `LIGHT`) so
that each glows as its colour rather than as white; the chrome uses the library's own, exactly.
Four small things are copied from `note-library.js` and `search.js` for this — `HUE`, `symbolFor`,
the direct-words matching and `norm` — and the tests hold the two pages to the same answers. The
returns cart is left out (it is empty, and a test keeps it so). If the library's page cannot be
read, the page says so and links to it.

### One red galaxy

All 332 notes in **one spiral galaxy**: a bulge and four arms winding out (`ARMS`, `TWIST`), no two
notes nearer than `GAP`, every node **red and glowing** as the network's were — a faceted sphere lit
and glowing from within, a soft halo — joined to its nearest two by red links with pulses running
along them, turning slowly (`SPIN`) inside a ticked ring, and a **haze** of fine specks strewn along
the arms so it reads as a galaxy and not only as a network. **Every accord is a slice of it**, round
in order, its most used notes nearest the core. A note's size is how many fragrances use it. The
most used ten are named beside their nodes in small black tags.

### Coming apart — through white, with changing links

**The button at the foot, in the middle** (*Expand the library*) runs one clock (`u`, 0 to 1 over
`EXPAND_MS`, 3.4s) that everything reads (`phase()`):

- **red → white** over its first quarter, **white → the accord's colour** over its last third, the
  glow brighter while white;
- while white, **the changing links**: every pair of notes of one accord nearer than `LINK_REACH`
  joined by a white line, brighter the nearer — worked out again every frame from where they stand,
  so as the notes move the lines come and go and the triangles change (`changing` in the tests);
- **each accord flies out** from its slice on a curve that carries on the way the galaxy was turning
  (`swirl`), to **its own direction** — its slice's own heading, above, level or below in turn
  (`LIFTS`; where the ring of them closes, the last is kept off both its neighbours' heights) — and
  its notes **reform as a small spiral galaxy of its own**, its most used at the core, turning on
  its own, in a ring of its own colour with its haze;
- **the centre** comes up where the library was — a white node in a turning cage with two rings —
  and **a bridge** runs out from it to every galaxy's core (a small wire diamond), white at the
  centre and the accord's colour at the galaxy, pulses running along it;
- the one galaxy's links, ring and haze go as it starts; each galaxy's links, ring and haze come as
  it forms; the view draws back and comes down a little (`APART_PITCH`) so the galaxies above and
  below stand clear of each other, fitted to where they actually stand (`fitApart`).

*Collapse into one* runs the same clock backwards — colour, white and its links, red — and goes back
to the centre from wherever you are. Pressed half way, either way turns round where it is.

### Going between accords — easy, and through the centre

Once apart, **the dropdown at the foot** (over the button) lists the centre and every accord, with
**an arrow either side of it** for the one before and after; **the keyboard's arrows** do the same,
and Home goes back to the centre. **The name beside every galaxy** is a button that goes there; so is
**a bridge** (pointed at, it says *Go to 06 · Spice →*); so is **a note** in another galaxy (it goes
there and selects it); so are the accords in the window on the right. Pressing **the centre** goes
back to seeing them all.

**Every journey from one galaxy to another bends in towards the centre and out again** — the way
bends through it (`via`), and draws back a little half way so you see where you are going — which is
what makes the centre the navigation point the owner asked for. **Arriving**, a galaxy is seen from
the centre's side of it, a little above, as if having come out along its bridge, so that it stands
alone against the stars, its disc facing you, its most used six notes named. (Seen from outside it,
as the five systems were, the centre and its sixteen bridges stood behind every galaxy and cluttered
it — that was tried first and looked worse.)

### The window on the right

`.net-panel`: the library's name and counts; **the switch that makes the search bar available** —
off, there is no bar; on, **the library's own `query>`** comes down at the top in the middle, with
its count and its ×, reading names and other spellings by **direct words** (the same answers as the
library: a test types *cedar* into both), matches lit and the rest translucent, the first eight
listed under it to go to; and **the accords, chosen by hand**, as the library's tabs are: every
accord a row with its colour, number, code, name and count, and *All* — one lights and the rest go
translucent, and once apart it also goes there. The window **folds away** by the button at its head
to that button alone, and the drawing takes the room it gave; on a phone it starts folded, and the
switch folds it to use the bar.

### Freely, with rotation

A drag turns it round without limit and tips it **nearly straight up or down** (`PITCH_MAX`, 83°),
round whatever is being looked at, and **carries on turning a moment after it is let go**, slowing;
the wheel and a pinch bring it closer or further. The view is kept in the middle of the room the
window on the right and the foot leave (`setViewOffset`), and fitted to it.

### Selecting

Pressing a note **selects it**: it grows and goes white-hot, its links light, and **every other node
turns translucent** (its neighbours less so) — each note's own opacity eased on its own, so a
selection, a search and an accord chosen by hand can change together and never jump. **The card on
the left** says what it is — its symbol and name, its accord, its element number and call number, how
many fragrances use it, what it is, and *Open it in the Note Library →* (`#note-…`, which opens its
card there) — with a dotted line from the card to the note. Escape, its ×, the note again or empty
space lets it go.

### Sixty frames a second

- **Nothing is made or thrown away while it runs.** Every node, glow, link, pulse and bridge is one
  of a handful of buffers written in place each frame (the links' upload limited to what is drawn);
  the notes are two instanced meshes, the haze turns as a whole; about forty draw calls in all.
- **Each note's own opacity** is the one addition to the library's shader (`perNode`): a note going
  translucent is drawn in a second pass that does not hide what is behind it, so solid and
  translucent notes are sorted right without re-sorting anything.
- **Every program compiled before it is first shown** (`renderer.compile` with everything visible
  once): the centre, the bridges and the rings used to be compiled the moment the library came apart,
  which was one 74ms frame just as the movement began.
- **The page's chrome is moved by transform and faded by opacity only** — the names, the tags, the
  labels, the window folding, the bar coming down, the dropdown opening, the card — and **every size
  is read at once, before anything is written**, and a style is written only when it changes. A trace
  of the expansion shows no layout at all while it runs.
- **Re-fitting is not re-sizing**: the view is re-fitted when the window folds or the library comes
  apart, and the drawing surface is only made again when the window itself changes size.
- **If the frames still come too slowly** — a sharp, large screen on a weak graphics card — it draws
  at a lower resolution (`quality`) rather than dropping frames.

Measured in the browser the tests use (no graphics card, drawing in software): **a frame's own work
is 1–2ms on average and at most about 8ms**, through the expansion, journeys, selection, the search,
folding the window, a drag and the collapse — against the 16.7ms a frame has at sixty a second. What
that machine then spends is almost all waiting for its software drawing to finish (a trace: 3.4s of
3.6s), which a graphics card does in a moment. The test for it holds the page's own work to that.

With **reduced motion** nothing turns on its own, and expanding, collapsing and every journey are made
at once; a drag still turns it.

### How to test it

`tests/test-page.spec.js`, rewritten:

- **`the Note Library is drawn as one red galaxy, every note a node`** — as many nodes as the library
  has records and as many accords as it has, red on the dark ground, the button at the foot in the
  middle, the window on the right, no dropdown yet.
- **`every note is the Note Library's own, with its number, symbol and uses`** — every note's name,
  number, symbol, fragrance count and accord the same as the library page gives it, and every accord's
  hue.
- **`the page's copy of the library's colours is the library's`** — `HUE` the same in both files.
- **`the window on the right makes the search bar available and chooses the accords`** — no bar
  until the switch; *cedar* answered as the library answers it, the rest translucent; the switch off
  clears it; an accord chosen by hand lights alone; folded, the drawing takes its room.
- **`pressing a note selects it: the rest turn translucent, and its card says what it is`**.
- **`expanding: through white, with changing links, into a galaxy for each accord in its own
  colour`** — white half way, linked, the links changing as they move; apart, every note in its
  accord's colour, every accord in its own galaxy and no two galaxies' reaches meeting; the centre
  white; the dropdown there, and the galaxies named.
- **`the centre joins every galaxy, and going from one accord to another is easy`** — the dropdown,
  both arrows, the keyboard, Home, a bridge, the centre from the dropdown and a galaxy's name; the way
  from one galaxy to the next passing near the centre.
- **`collapsing brings every note back into the one red galaxy`**.
- **`a drag turns it freely, any way`** — round, and tipped past 1.3 radians.
- **`every frame of every transition is quick enough for sixty a second`** — through the expansion,
  two journeys and the collapse: a frame's own work under 4ms on average, under 10ms for nearly all,
  and no stall.
- **`without its 3D library the page says so`**, **`without the Note Library's page it says so, and
  points at the library`**, and **`the test page with animation turned off › it stands still, comes
  apart and travels at once, and still turns by hand`**.

It is also in `pages.spec.js`, `mobile.spec.js` (nothing wider than a phone) and `menu.spec.js`.

### Known issues / TODO

- **A first answer**, as every drawing here is: how far apart the galaxies stand, how fast it comes
  apart, how they are seen on arrival — each a number at the top of `network.js`.
- **On a phone** it works — the window folds, the foot and the card take the width — but it was
  designed for a laptop, and the galaxies are small on a narrow screen.
- **The frame rate was measured on a machine without a graphics card**, where only the page's own
  share of each frame can be measured; on a real screen it should be checked by eye.

## 2026-09-27, night — the Note Library as networks

> additionally, I want you to make it red regardless, screw the colouring (test page). I also want
> them to be less of galaxies and more true to their original form: like complex networks of nodes
> and connections. I want it to look more like before you made it into a galaxy. I have added a
> picture, but i want it more red and glowing. I want nothing to be selectable in the main galaxy
> before the expansion. once the expansion occurs, I want there to be several galaxies for the
> accords, as there are now; and I would want each to have main nodes which are the notes
> (labeleld), and some other arbitraty spheres or nodes that lead to nothing and cannot be clicked.
> They are there purely aeshtetically. If you want make the two distinct in some way- give
> importance to the clickable ones.
> I like the way you have made each of the galaxies have a center and a central node; keep that, but
> truly make it a node. I also want the galaxies not to be equidistant from the central galaxy after
> expansion. ADDITIONALLY, KEEP IN MIND, I AM ONLY SAYING GALAXIES BECAUSE YOU MADE THEM INTO
> GALAXIES. IN REALITY I WANT THEM TO BE COMPLEX NETWORKS WITH CONNECTIONS AND GEOMETRICS AND
> WHATNOT - as mentionedprior. I have added a pictuer 1 which is to show you what it should look
> like (each accord saparetly AND all combined). I also added picture 2, which is a view I am a fan
> of, so keep that. I also want there to be a signal travelling to all the connections from the
> central node to the differnet netweorks when expanded. I also want them all tobe slightly
> different than one another structurally. But most importantly, i want them to be quite dense in
> nodes and connections.
> I also like that when you hover the accord on the right, it lights up in isolation. keep that. but
> make the window on the right less techy, and make it more in accordance with the rest of the
> website: minimalist, geometric and simple (with particles!).
> I also want you to keep the transition COLOURS from the expansion. Otherwise, i want you to make it
> a little more chaotic. Additionally, feel free to create additional nodes to make up for the loss
> of density per cluster during the expansion. When theyu are transitioning, you can reate
> additiona nodes and connections for each of the clusters so that they will appear dense when
> inspected. Additionally, I want you to move the bar on the right hand side to the left. And make
> the search. push it without permission.

Picture 1 was the dense red network the page first carried; picture 2, the centre in its cage.
`network.js` was written again. What stayed from the galaxies: the library read off its own page
(and counted, numbered and named as it is there), the button at the foot, the white and the
changing links on the way, the centre and its bridges, the dropdown with its arrows, the keyboard,
journeys bending through the centre, the card, a drag, and everything done for sixty frames a
second. What went: every galaxy (`ARMS`, `TWIST`, the haze, the rings of colour), **the accords'
colours** — so `HUE`, `SAT` and `LIGHT` are no longer in `network.js`, and nothing of the library's
colours is copied any more — and the window on the right. "Make the search" was read as the
search going into the window, which is where the window's switch now opens it.

### One red network, and nothing in it answers

What it opens on is the picture again: **every note a glowing red node**, and among them **the
fillers** — smaller dark-red nodes, a few pale ones and grey specks, standing for nothing — each
joined to its nearest two or three, the busiest notes sending lines out all over it, a few nodes far
out tied back in by long ones, turning in a ticked ring. Each accord is **a knot** of it round a
home of its own, the homes spread through one body so the knots run together. About a thousand
nodes and two thousand links. **Nothing in it answers the hand** — no name under the pointer, no
selection, no bridge — until it has come apart (`answering()`); the accords in the window and the
search still light what they find.

### Coming apart — white, chaotic, and made denser on the way

The same one clock (`u`, `EXPAND_MS` 3.8s) and the same colours: **red → white → red**, the changing
links while white. What is new:

- **each node goes its own way** — setting off at a moment of its own (`delay`), on a curve bent its
  own way (`bend`), **shaken** as it goes (`amp`, `f`, `ph`) — which is the "little more chaotic";
- **more nodes are made on the way.** Three quarters of every accord's fillers are not in the one
  network at all: they are **thrown in** from somewhere near (`scatter`) to their places in the
  accord's network while it travels, each at a moment of its own (`born`), with **their own links
  showing as they come** (`netMade`, drawn from `form` rather than waiting for the end), white while
  everything is white — so each cluster is dense on the way and not only at the end;
- the changing links shorten as they fade, so fewer are looked for as the networks close up.

### Each accord a network of its own

Apart, **every accord is a network**, red again — its notes and **four or so fillers to every
note, and eighty more** (`FILL_PER_NOTE`, `FILL_MORE`): 120 to 310 nodes each, about three
thousand in all, and over two links to a node. **No two are built alike** (`TYPES`): a knot, a long
one, twins, a shell with a core, a flat one, a ring — round again for the sixteen — each tilted and
turning its own way. **Its notes are spread through it from the middle out, the most used nearest
the middle**, the fillers between. **It stands at a distance of its own** from the centre (`REACH`,
11 to 24), out the way its knot lay, pushed apart until no two reach each other.

**The notes are the nodes that matter**: larger (by how many fragrances use them), brighter, with a
glow the fillers hardly have — and at the network you are at, **every note is named** beside its
node. They are **the only nodes that answer**: pointed at, a note says its symbol and name;
pressed, it is chosen and the card says what it is. **A filler never answers** — it is not even
looked for.

**Its middle is a true node** — a red sphere, glowing, in a turning cage, with a dashed ring round
the network — joined by links to the nodes nearest the middle and to its busiest notes. **The centre
is picture 2**: the white node in its turning cage with its two rings, **joined to every network's
middle node by a bridge**.

### The signal

Every few seconds (`SIGNAL_EVERY`) **a signal leaves the centre along every bridge** — a bright
point travelling out at one speed, so it reaches the nearer networks first — and, arriving, **lights
the network's middle node and runs through the whole network from it, link by link** (`depth`: how
many links from the middle each node is; `HOP`, `SIGNAL_WIDTH`): the nodes it passes go towards
white and a little larger, and their links light, and it goes out behind itself.

### The window on the left

On the left now, and plain: **the library's name**, its counts and what it is showing (*one network*
/ *16 networks*); **a ring of specks** — one for every note, round in its accords with a gap
between, larger for the more used, lit where the hand, the search or the accord you are at is,
turning slowly (`drawMark`); **a square switch** that opens **the search in the window itself** —
an underlined field with its count and its ×, the library's own direct words, the first eight found
listed to go to; and **the accords**, each a row with a small diamond, its number, name and count.
**Under the hand an accord lights up alone**, for as long as the hand is there (`previewing`), and
pressed it stays lit and, once apart, is gone to. A hairline box with a registration tick at each
corner, folding to its button. **The card** a note is chosen into stands on the right now, opposite.

### Two faults found and fixed on the way

- **Black lines and black specks.** The canvas is see-through over the page's own ground, and the
  glows were added with the library's additive blending, which also adds to the canvas's own
  opacity: a glow or a link gone dark (a filler not made yet, the links while a note was chosen)
  printed **black** over the page. Everything added is now added to the colour only, never to the
  opacity (`additive()`).
- **A network in front of the lens.** Arriving at one network, a neighbour could stand between you
  and it, a few enormous spheres over the window and the window on the left. **Anything within a
  few units of the lens is let go** (`NEAR_IN`, `NEAR_OUT`, `vis`), its links with it.

### Sixty frames a second, twice as many nodes

About three thousand nodes instead of the galaxies' three hundred and thirty-two, so the frame was made cheaper: every node's
place and colour worked out by plain arithmetic (its network's turn as a matrix once a frame), its
matrix written straight into the buffer, a node not made yet written empty once and then left
alone, the translucent set drawn only while something is translucent, the search read once a frame
rather than once a node, the changing links sorted once as they begin, and the ring in the window
drawn a dozen times a second rather than every frame. Measured in the tests' browser, drawing in
software: **about 2–3ms a frame at rest and apart, and about 4.6ms on average while it comes apart**
— against 16.7ms at sixty a second. The worst frames there (13–25ms) fall on no one part of the work
and move from run to run: that machine's software drawing taking the processor, not the page.

### How to test it

`tests/test-page.spec.js`, rewritten again:

- **`the Note Library is drawn as one red network, and nothing in it answers the hand`** — as many
  notes and accords as the library, many more nodes, more links than nodes, red on the dark ground;
  a note pointed at and pressed does nothing; the window on the left, the button in the middle of
  what it leaves.
- **`every note is the Note Library's own, with its number, symbol and uses`**.
- **`the window on the left holds the search and the accords, each lighting up alone under the
  hand`** — the ring of specks drawn; the search inside the window, answering *cedar* as the library
  does, its × and its switch clearing it; an accord under the hand lit alone and only while it is
  there, pressed and kept; folded, the drawing where it stood.
- **`expanding: through white, with changing links and nodes made on the way, into a dense red network
  for each accord`** — white and linked half way, nothing answering; hundreds of nodes made on the
  way, with links; apart, red again, every accord's network dense in nodes and links with a node at
  its middle, at least five ways of building them, distances from the centre differing by more than
  five, no two meeting; the centre white.
- **`a signal goes out from the centre to every network, and through it`** — nodes lit as it passes,
  and then not.
- **`once apart, pressing a note selects it and its card says what it is; a filler never answers`**
  — the notes of the network named; the card on the right; a filler pointed at and pressed, nothing.
- **`the centre joins every network, and going from one accord to another is easy`** — as before,
  and an accord pressed in the window; the journey asked for its bend (`NetScene.bend()`) rather than
  watched, since the tests' machine draws too few frames to be seen passing the centre.
- **`collapsing brings every note back into the one red network`** — the made nodes gone again.
- **`every frame of every transition is quick enough for sixty a second`** — under 7ms on average,
  under 16.7ms for nearly all, no stall.
- the drag, the two fallbacks, and **reduced motion** (no signal, too).

`HUE`'s test went with `HUE`.

### Known issues / TODO

- **A first answer again**: how dense, how far apart, how chaotic, how often the signal goes — each
  a number at the top of `network.js`.
- **On a phone** it works, as before, and is small.
- **The frame rate on a real screen** should still be checked by eye; the tests can only measure the
  page's own share.

## 2026-09-28 — its own Note Library: two arrows, an opening, and shine

> another thing i want you to do is in the test page, not have it refer to the note library but
> make it into another version of the note library. I want each of the nodes to have a window pop
> up that tells you about the note. the information should be the same as in the note library but
> it should be a little more. I also want it to somehow get into focus, so if its a popup window or
> something, then let it blur the rest of the page or make it out of focus.Maybe make it
> translucent. if that looks better do that.
>
> I want you to add another arrow up above the one that pulls out the menu (image 1), and have it
> pull up te search bar (with the "query") in it. I want you to move the existing arrow down, and
> have the seaerch arrow be in place of this one.
>
> Stylistically, i want the balls to shine more than be solid red objects. The clusters look great,
> so keep them please. Im just think that i want a less rigid transition between collapsing and
> expanding. I also want you to add a short and brief but thematic animation to when you first
> load the page.
>
> isntead of starting with the left window out, I want it to be hidden, and I want a temporary
> text to pop up (while the entire page is blurred) that point to that arrow, saying open menu
> here. whenever you stop controlling it for a while, i want the arrows on the left to start
> glowing or have this glowy effect to them for emphasis (I want this to be on par with the text
> in thetop right that tells you what you can do.)
>
> make the animation smoother.

Image 1 was the folded window's button, a chevron in a square. The networks, the clusters, the
centre, the signal and the journeys are as they were.

### The note window

A note pressed (once apart) opens **its own window** — `.net-note`, a dialog — and the card on the
right that said *Open it in the Note Library →* is gone, with its dotted line: nothing on the page
sends you to the library now ("not have it refer to the note library"). The page still **reads**
the library's own page for what the notes are; that is where they are written, and a note added
there is here at once.

- **The rest of the page goes out of focus** behind it: **the veil** (`.net-veil`) covers the whole
  stage — the networks, the arrows, the menu, the foot — blurred and a little darkened, and the
  window stands over it, **translucent**, blurring what is behind it again. The owner offered
  both; both are used. A press on the veil, its ×, or Escape puts it away, and the node it was about
  and every other come back.
- **What the library's card says**: *Element* and its call number across its head; its **tile** as
  it stands in the library's table (number, uses, symbol, name) beside **its atom** — an electron
  for every fragrance using it in shells of 2, 8, 18 and 32, turning, in this page's red; what it
  is; its accord; its other spellings (**isotopes**); and every fragrance naming it
  (**compounds**) — the individual fragrances first, then the houses, each a dropdown, each
  fragrance a link to where it stands, its name read off its house's page the first time.
- **And a little more**: how many of the site's fragrances use it, and what share; **where it
  ranks** by use, in the library and in its accord; **where it stands** in those fragrances — top,
  heart, base, or in a list the source did not divide — as a bar and as numbers, and beside each
  fragrance in its list; the notes it is **most often found with** (sharing the most fragrances
  with it), each a way to that note; and the note before and after it in its accord. The arrow
  keys go through its accord.

So the test page now copies **`HOUSES`** from `note-library.js` too (where each house's fragrances
live) — four things copied, and a test holds each.

### The two arrows, the search bar and the menu

**Two arrows** stand on the left (`.net-rail`), under the site's Menu: **the search's on top**, in
the place the window's button stood, and **the menu's under it** — "move the existing arrow down".
Each is a hairline square with a chevron pointing the way what it pulls out will go (the search's
carries a small ring, a lens), and says its word beside it under the hand.

- The upper pulls out **the search bar** beside it (`.net-find`): the library's own `query>`, its
  count and its ×, what it finds listed under it. It is out of the menu now; the menu's switch is
  gone. Escape empties it, and then puts it away.
- The lower pulls out **the menu** (the window, `.net-panel`): the library's name, the ring of
  specks and the accords, **each still lighting up alone under the hand**. It starts **put away**
  — "instead of starting with the left window out, I want it to be hidden".

### As it opens

**The opening** (`loadFront`, `LOAD_MS` 1.9s): a spark at the centre, and the one network **wired
in from it outwards** — each node coming up as a front from the centre reaches it, swelling a
little past its size and settling, each link drawn out from its nearer end to its farther and
bright while it grows, the ticked ring widening with it — while the lens eases in. It runs on the
frames' own time, never more than 50ms a frame, so a slow first second cannot skip it. The arrows,
the foot and the line at the top right come in once it is done.

Then **the word** (`.net-coach`): the page out of focus but for the two arrows, and a line
pointing at the menu's — **Open menu here** — its arrow glowing, for a few seconds (`COACH_MS`) or
until the hand does anything. It asks nothing of the hand: the press goes through (pressing the
arrow opens the menu and puts the word away together).

**Left alone** (`IDLE_MS`, 7s, and never while it is moving), **the two arrows glow**, breathing a
red light — and the line at the top right saying what can be done **comes back**, which is how
"on par with the text in the top right" was read: as quiet as it, and back when it is. Any
movement of the hand puts both away.

### Shine

**Replaced the same day** — see [faceted again, in rouge](#2026-09-28-later--faceted-again-in-rouge-glowing).
"I want the balls to shine more than be solid red objects": the spheres were **smooth and glossy**
now — a little metallic, catching **a studio of soft lights** as highlights (`STUDIO`: a softbox
above, a strip to the right, a red glow from below and a small bright light in front, made once
into the lights' reflections), **a rim of their own colour glowing** round every edge (the one
addition to the library's shader, `perNode`, carries it), and their glow round them, **shimmering
a little** on the notes. The notes are drawn finer than the fillers — two sets of spheres, the
notes first (nodes 0 to 331). The clusters are exactly as they were.

### Less rigid, smoother

- **The clock is no longer rigid**: coming apart (or together) gathers speed over `ACCEL_MS`, comes
  to rest over the last `BRAKE` of the way, and **turned round half way it slows, stops and goes
  back** rather than jumping.
- **The accords leave one after another** (`lag`), the nearest the centre first, and each node's
  way starts sooner and is spread over more of it.
- **Every node drifts a little, always** (`FLOAT`), so a network at rest is never quite still.

### How to test it

`tests/test-page.spec.js`:

- **`the Note Library is drawn as one red network, the menu put away, and nothing in it answers the
  hand`** — and the two arrows on the left, the search's over the menu's.
- **`as it opens it wires itself in, and then points at the menu's arrow over the page out of
  focus`** — not yet opened at first, the chrome not in; then the word, level with the menu's arrow,
  the page blurred under it and the arrows over it; a press on the arrow puts it away and opens the
  menu.
- **`left alone a while, the arrows on the left glow, and the line saying what can be done comes
  back`** (`NetScene.leave`).
- **`the arrows on the left pull out the search bar and the menu, whose accords light up alone under
  the hand`** — the search bar beside its arrow, *cedar* answered as the library answers it, the ×,
  Escape twice; the menu beside its arrow, the ring, an accord lit alone under the hand, pressed.
- **`once apart, a note pressed opens its own window over the page out of focus; a filler never
  answers`** — the veil and the translucent window over everything; Vanilla's symbol, number, uses,
  call number and accord; **its other spellings and every fragrance naming it, the same as the
  library's own card**; its share, rank and tiers (`NetScene.about`); the notes it is most often
  with; no link to the library; the arrow keys and a chip going to other notes; Escape and a press
  on the veil putting it away.
- the rest as before, the journeys test opening the menu before pressing an accord in it.

### Known issues / TODO

- **The word shows every time the page opens.** It could be once a visit; it was left every time,
  because the owner asked for it "when you first load the page".
- **The blur behind the window** is the browser's own, over a drawing that keeps moving; on a weak
  graphics card it is the most expensive thing on the page, and it is only there while a window is.

## 2026-09-28, later — faceted again, in rouge, glowing

> I would like you to revert to the non perfectly spherical nodes, but add a glow to them. I want it
> to be more red ike rouge, rather than just a solid sphere of red. A darker red.

- **Faceted again**: every node is the icosahedron divided once and drawn in **flat facets**, as
  it was before the morning's smooth spheres — notes and fillers alike (still two sets, the notes
  first). **The studio is gone** (`STUDIO`, its reflections and the metal with it); nothing of it is
  in `network.js`.
- **Rouge, darker**: the notes are a deep crimson (`REDS`, `#a8102a` and round it) where they were
  a bright coral red (`#ff3a44`), the fillers a burgundy (`DARKS`), the few pale ones a dusty rose
  (`PALES`).
- **Glowing**: each node is **lit from within in its own red** (the emissive, taken in its own
  colour by `perNode`) with **a rim of it burning round every facet's edge**, the lights on them
  turned down so they read as glowing rather than lit, and **the glow round them** larger and
  stronger (`size` 1.0, the notes' `kindGlow` about half as much again), still shimmering on the
  notes. Rouge added to rouge: where they crowd, the red deepens rather than whitening.

The links, the white of the transition, the chrome and the button are as they were.

Tested: the tests' red is the deep red now — **`red()`** in `tests/test-page.spec.js` asks for a
red channel between a half and four fifths and far above the green and blue (the old coral would
fail it), and **`look()`** counts pixels whose red stands well above their green and blue.

### A little glowier and darker

> A little glowier and darker please!

The same afternoon, one step further each way, and nothing else touched:

- **Darker**: the notes' crimson taken down about a fifth (`REDS`, `#8c0a20` and round it, the
  darkest `#72061a`), the fillers' burgundy nearer a wine (`DARKS`, `#5e0813` and round it, the
  darkest `#48050d`), and the light falling on them less (the ambient 0.2, the sky 0.3, the key
  0.6), so a facet turned to the light is not what makes a node bright.
- **Glowier**: the rim burning round every facet's edge stronger (1.6 where it was 1.15), the
  glow round every node larger (`size` 1.5 where it was 1.0) and stronger — the notes' `kindGlow`
  `2.3 + size × 6` (it was `1.3 + size × 3.6`), the fillers' 1.2 (0.7), the pale ones' 0.44 — so
  where the network crowds, its heart is a haze of red rather than a pile of red balls.

The owner, seeing it: "This is good actually! Just a TAD bit glowier" — which is the second half of
those numbers (the rim 1.45 → 1.6, the glow's `size` 1.35 → 1.5, the notes' `kindGlow` from
`2 + size × 5.2`, the fillers' from 1.05, the pale ones' from 0.4). The darkness was left as it was.

`red()` in the tests asks for a red channel above two fifths now, not a half: the darkest note sits
at 0.45.

## 2026-09-28, evening — a glow of its own, the flash on a journey, a window without chemistry, and combinations

> too much glow, especially in the center of the clusters. Make it less so. I want the glow to be
> very local to every node. The colour is better. the dark red is good. also, there is something
> in the background that occurs when the page opens i attached a screenshot. recreate it and make
> sure that it is just the cluster that forms.
>
> Additionally, allign the text with the center of the arrow. picture 2
>
> I want the expanded version, that if you click back from the citrus accord, you would go back to
> the center - every accord, not to 16.
>
> I also want the flashing effect (picture 3) that occurs to happen only when you go to a different
> node.
>
> also bring the clusters a little farther from one another. additionally, make sure that when
> they are being selected, nothing is obstructing the view of that cluster. [...] i want it to be
> clearer.
>
> Finally, please make the transition less bubbly. I want it to be dimensional, where it is lclear
> what is going on. Keep the smoothness of it though. that i like.
>
> remove the word into one from collapse into one. let it just be collapse.
>
> the popup, move image 5 to the very vrey very bottom of it, and make it seem less important. also
> in it, change the word "element" to "note"
>
> remove any chemistry related themes too. tf you mean isotopes, just put variations there. Also,
> "compounds" should be "fragrances". I would also like you to make a pyramid distribution [...]
> add a number next to the pyramid stating "non-pyramidal". emphasize the main description of the
> fragrance, remove the chemical symbol up top. However, I also want you to add a particle diagram
> in red particles that are show what it is that the note is of. if there is grapefruit, make a
> grapefruit from particles. Do this for all notes. make it minimalist and geometric.
>
> THE ORDER OF STUFF IN THIS POPUP SHOULD BE: NAME OF THE NOTE, AND THEN THE DESCRIPTION, THEN THE
> 3D DIAGRAM, THEN FRAGRANCES, THEN VARIATIONS, THEN PYRAMIDAL DISTRIBUTION (which i want to be
> numerical, not as a percentage [...]), AND AFTER THE PYRAMID THE MOST FREQUENT COMBINATIONS, AND
> THEN THE STATISTICS BUT THOSE ARE REALLY AT THE VERY END.
>
> i also want you to make the expand button a little to the left, and on its right there should be
> a new button called combinations. [...] black on white or whatever. It should feel skeletal [...]
> it will cause the otherwise red cluster to pulse and then turn a slightly yellow; it should also
> expand in the sense that it will not be as dense. It will still be only one big cluster though.
> The button of expanding will disappear (instead there will be a button to go back somewhere on
> the page) afterwards a search bar pops up and you will be able to select any note. [...] it will
> be added to this search as a "tag". you will then be able to see all the connections on the big
> middle cluster. [...] there will be an openable list of fragrances [...] that have the thing that
> you have selected (or things).
>
> additionally, clicking on the expand button removes the other button, and will center the
> expand/collapse button. a "back" or return feature will appear somewhere.
>
> i also want the viewing selection of an accord on the left to be overwritten in priority if you
> are in the expanded view viewing a specific accord; i want that one to be in focus.

One question was asked first, because it could honestly go two ways: *when* the flash should
happen — on travelling to an accord, or on pressing a note. The owner chose **travelling**.

### The glow, its own and near

- **Each glow is its node's own size** — `glowSize`, a second small addition to the library's
  shaders (the points' own `gl_PointSize = size` made `size * glowSize`), set every frame from the
  node's size and how large it is drawn — and its light (`NEAR_SPOT`) is gone within about one and
  a half times the node's radius: `GLOW_NOTE` 26 and `GLOW_FILL` 22 across. **A point is sized
  against half the window's height and a sphere against the lens**, which is why the numbers are
  so much larger than the node's: the first attempt, 7.2, made glows barely wider than their nodes.
- **What was piling up in the middle** was two things: glows as wide as a node's neighbours, added
  together, and the lines, added together where the network is densest. The glows are local now,
  a little quieter (`kindGlow` 0.74 + size × 2 for the notes), and the lines are drawn quieter
  (the one network's 0.32 of full, each accord's 0.34).
- **THE THING IN THE BACKGROUND AS IT OPENED** was the fog. The library's fog mixes what is far
  towards the page's grey, and the glows and lines are *added* to the page — so a glow that should
  have added nothing, round a node not yet come up, added grey: a halo round the page wherever a
  node was waiting. **Nothing added is fogged any more** (`fog: false` in `additive()`), and what
  is far is faded by hand to nothing instead (`fogOf`, in `segment()` for every line and per glow
  and pulse). A node not come up has no glow at all, and the ring the network turns in comes in
  only once it has formed — **so as it opens, only the cluster forms**. There is a test that no
  glow is drawn without its node while it opens.
- **A bug on the way, worth knowing:** `aim()` had a local called `cp` (the cosine of the pitch),
  which hid the combinations clock of the same name, so the fog's far edge came out as *not a
  number* — and every line and glow past its near edge was drawn with no colour at all. It showed
  as the tag lines missing and the far networks bare. It is `cosPitch` now.

### "Open menu here", level with the arrow

The words are their own element (`.net-coach-word`), trimmed to their capitals and their baseline
(`text-box: trim-both cap alphabetic`), so it is the middle of the letters, and not of the line
they sit on, that stands level with the arrow's middle — whatever the face's own spacing. The test
holds the line to a pixel and a half of the arrow's middle and the words to two and a half.

### Going between accords

- **The centre is in the arrows' round**: ‹ and › (and the keyboard's arrows) go centre, 01, 02
  … 16, centre — so back from Citrus is the centre, and on from Impressions is the centre too.
- **THE FLASH ONLY ON A JOURNEY** (`A.signalAt`, one clock for each accord, and no
  `SIGNAL_EVERY`): going to an accord it leaves the centre along that accord's bridge, timed to
  reach it as you do, and runs through that network alone; going to the centre (coming apart
  included) it goes out to every one. Left alone, nothing flashes.
- **Farther apart**: the networks stand 15 to 32 from the centre (it was 11 to 24), and no two
  nearer than 1.9 times their reaches and 3 more (1.45 and 1.4).
- **At an accord nothing stands in its way**: the centre, every other network and every other
  bridge step back to a twentieth (`AWAY`, eased — `A.seen`, `hubSeen`), the accord's own bridge
  to an eighth, and no other accord's name is printed within it.
- **The accord you are at keeps the page** — the menu's hand lights a row in the menu but no longer
  takes the page from it (`onlyNow` is empty at an accord); the menu marks where you are, and
  pressing an accord there goes to it. At the centre the hand lights one alone, as it did.

### Coming apart, dimensional

`place()` is written again. **Each accord leaves as one body**: its middle goes *straight* out from
its knot along its bridge to where its network stands (`C`, from the knot, loosened in
combinations, to `A.G`), the bridge drawn out behind it from the centre as it goes; its nodes go
from where they stood in the knot to their places in the network *around that middle*, the rim a
little after the rest (`grain`, `delay` × 0.12). The nodes made for it come up **from its middle
outwards** as it unfolds. The lens swings round the library by `SWEEP` (0.62 radians) as it comes
apart, and part of the way back as it closes, so the depth it comes apart in is seen. **Gone**: the
shake (`ph.shake`), each node's own bent path (`bend`, `swirl`), the made nodes thrown in from
somewhere near (`scatter`), and the white lines that changed as they moved (`LINK_REACH`, the
sorted orders, `changing`) — the network's own links are drawn from the start instead, moving with
it. Kept: red through white and back, and the clock's softness (`ACCEL_MS`, `BRAKE`). The test
checks every accord's middle on the straight line from where it set off to where it ends, its
nodes kept round it, and the lens swung.

### The foot, and the way back

- **Expand** a little to the left, and **COMBINATIONS** on its right — two columns of one width, so
  that the gap between them is the middle (the pair centred put the wider Expand across it).
  Combinations is skeletal: a hairline frame with its corners run out past it like a drawing's
  registration marks, two rings over one another for its mark — and black on white under the hand
  and while it is on.
- **Expanded**, Combinations goes and **Collapse** (no "into one") stands alone in the middle; **in
  combinations**, Expand goes. The one that stays slides to its new place (`layoutFoot`, a
  measured slide by transform).
- **BACK** stands beside whichever is left: from an accord to the centre; from the centre into one
  again; out of combinations. On a phone it stands in the row.

### The note window, without chemistry

In the owner's order: **its name**; **what it is**, set larger and brighter with a red rule down
its left; **its figure**; **Fragrances · NN** (every fragrance naming it, the individual ones and
then the houses, all dropdowns, each a way to it); **Variations · NN** (the other ways the site
writes it — they were *Isotopes*); **Pyramidal distribution** — one triangle cut in three, each
tier as dark as it is used, the count beside each (*Top*, *Middle*, *Base*: how many of its
fragrances have it there) and beside the pyramid the count of **non-pyramidal** (in a list the
source did not divide); **Most frequent combinations**; and **Statistics** at the very end, small
and quiet (*Note* No. … · its call number, *Fragrances* … of the site's …, *Most used*). Across its
head: *NOTE*, its accord, the note before and after it in its accord (‹ ›, and the keyboard's
arrows), and the ×. **Gone**: the tile and its symbol, the atom and its electrons, *Element*,
*Isotopes*, *Compounds*, and `symbolFor` from `network.js` altogether (the search's results and the
hover say the name alone).

### The figures (`note-figures.js`)

**Every one of the 332 notes has a figure of its own**, written out by name in `FIGURES` — what the
note is of, in red specks over faint hairlines, turning slowly on a dashed ring, the nearer specks
larger and brighter. Built from a few geometric parts: `lathe` (an outline turned round an upright
— a pear, a bottle, a cup, a candle, a mushroom, a bell), `ball` (a sphere of specks, pressed,
dimpled, grooved, roughened, drawn to points, or cut open), `path`, `leaf` and `petal`, `box`,
`disc`, `sheet`, `wave`, and things made of those: a **citrus** and a slice of it, an **apple**, a
**rose**, **bells**, a **trumpet**, a **daisy**, a **sprig** (its pairs of leaves each a
quarter-turn from the last, as mint and basil grow), an **ear** of grain, a **pod**, a **quill** of
bark, **roots**, **strands**, a **tree**, a **log**, **drops**, **tears**, **smoke**, a **flame**, a
**candle**, **hexes**, an **ingot**… Grapefruit is a grapefruit and a half of it open; Old Books a
stack of books; Spinal Fluid a column of vertebrae; Instant Film a print in its frame. Each is built
once, from a seed of its own name, stood in the middle and sized to a radius of one, and never has
fewer than 150 specks nor more than 1,500 (`FEWEST`, `MOST`). A note added to the library later
gets its accord's figure (`BY_ACCORD`) until it is given its own — and a test fails until it is.

### Combinations

`combine()`, only from the one network: the network **pulses** (a front of light from its middle
out, `cmbPulse`), **turns gold** — "a slightly yellow": `GOLDS`, `GOLD_DARKS`, `GOLD_PALES`, its
lines `GOLD_LINE` — over its own clock (`cmb`, `COMBINE_MS` 2.2s) and **loosens** by `SPREAD`
(0.62) while the lens stands back only part of that, so it opens out on the window as well as
thinning; the fillers go half faint. Still one network. Then **the bar** comes up over the foot
(`combine>`), and a note typed (by the start of any word of its name or another spelling) and
chosen — or pressed on the network — is taken as **a tag**. A tag is joined by a bright line to
**every note found with it in a fragrance**; with more than one, to every note found with **all**
of them, in the fragrances that have every tag (`recompute`: `matched`, `partners`); everything
else goes faint and the tags and what is found with them most are named. Once there is a tag the
bar offers only notes found with it. **The list** — *N fragrances have it / both / all 3* — opens
over the bar, each fragrance a way to it (its name read off its house's page, as the note window
reads it). A tag's × or Backspace in the empty bar takes one away; Back leaves combinations, red
and together again.

### How to test it

`tests/test-page.spec.js`, as well as what it had:

- **`the Note Library is drawn as one red network ...`** — the pair at the foot: Expand to the left
  of the middle, Combinations on its right, the gap between them the middle; no Back.
- **`as it opens it wires itself in ...`** — no glow drawn without its node while it opens; the
  line and the words of "Open menu here" level with the arrow's middle.
- **`every note is the Note Library's own, with its number and uses`** — and no symbol.
- **`expanding: through white, each accord leaving as one body along its bridge ...`** — every
  accord's middle on the straight line from where it set off to where it ends, its nodes kept round
  it, the lens swung; farther apart; *Collapse* alone in the middle, Back beside it, no
  Combinations.
- **`the flash goes only on a journey ...`** — one as it comes apart, out to every network; none
  for five seconds; going to an accord, one through that accord alone; back to the centre, out to
  every one. **Counted as the page sends them** (`flashes`, `flashTo`), not caught as they pass:
  this machine draws about a frame a second at its busiest, and a flash through a network is over
  in under one — it missed them. The flash as it comes apart fires **as it lands**, not on a timer
  from the press, for the same reason: a slow machine landed after the flash had been spent.
- **`once apart, a note pressed opens its own window ...`** — the parts in the owner's order, the
  statistics last and quiet; nothing of chemistry in the window's own words; the figure drawn in
  red; *Fragrances · NN* and *Variations · NN*, the library's; the pyramid's counts
  (`NetScene.about`) and non-pyramidal.
- **`the centre joins every network ...`** — and ‹ from Citrus is the centre, ‹ again Impressions,
  › the centre.
- **`at an accord nothing stands in its way ...`** — the centre and the other networks stepped
  back, no other name over it, the menu's hand not taking it away, Back to the centre and into one.
- **`combinations: ...`** — the pulse, gold, loosened, still one; the bar; a tag and its lines,
  one to every note found with it (`NetScene.combined`, `NetScene.tagLines`); the list; a second
  tag offered only from what is found with the first; Backspace, ×, a press on the network; Back.
- **`every note in the library has a figure of its own, in particles`**.
- With animation turned off, combinations at once too.

### Known issues / TODO

- The figures are a first set of 332; some are necessarily abstract (*Animal Notes* a paw, *Musk*
  a cloud round a core, *Oriental Notes* a lantern) and the owner may want particular ones redrawn —
  each is one line in `FIGURES`.
- The combinations picker matches the start of a word, where the library's own terminal matches
  whole words only; a picker has to answer as it is typed.

## 2026-09-28, night — far less glow, the counts out of how many, a depth blur, and combinations clearer

> WAY too glowy. make it less. same for the yellow version, but red is way worse in screenshot 5
> you can barely see anything other than the red glow.
>
> add an "/4" in the clary sage window. do th same for all other windows in the oyrammidal section,
> but out of the total number of fragrances containin that ingredient there are.
>
> remove the back button from the screenshot (when expanded)
>
> and make this (image 2) more obvious. [*3 fragrances have all 5*]
>
> rewrite this as "Unfortunately nothing like that exists on this page yet."
>
> add a reset button in the combinations
>
> stop with this obvious gradient whenever you do a collapse (image 4). you can see several black
> to gray lines on the page that make it quite unappealing. this exists also when you are in the
> collapsed/
>
> otherwise, create a short animation of blurring the cluster and connecting the notes towith other
> ones whenever you input a new note in hte connections part of the page.
>
> center both, the combination adn the back button in the combinations view.
>
> finally, I want us to try to add a depth blur in when using the exanded view. can you do that?
> make it reversivle in case wwe dont like it.

Nothing was asked: each note says one thing.

### Far less glow

Every node's glow is a third of what it was in red and a little over half in gold
(`GLOW_RED` 0.34, `GLOW_GOLD` 0.55, multiplying what each kind of node gives off), a little
smaller (`GLOW_NOTE` 22, `GLOW_FILL` 18; they were 26 and 22), and whitening on the way apart
adds less to it (`0.3 * wh`, was `0.5`). The nodes read as nodes again, with the red of their own
facets and rims; the middle of the one network is no longer a haze.

### The ground, one grey

The rings were **the page's own background**: `.network-page` laid a radial gradient from
`rgba(0,0,0,0.3)` to nothing over `#1f1f20`, and a gradient that shallow has only nine or ten
steps of 8-bit grey to be drawn in — ellipses of black to grey round the network, worst while it
moved. It is gone: `background: var(--bg)`, one grey. (The soft layer below dithers what it lays
down, for the same reason.)

### Out of how many

In the note window each count in **Pyramidal distribution** — top, middle, base and non-pyramidal
— is followed by **/N**, smaller and quieter: N is the number of fragrances on the site naming the
note (the same N as *Fragrances · NN* above it). Clary Sage: 0/4, 2/4, 0/4, and 2/4
non-pyramidal. (A fragrance can list a note in two tiers, so the four need not add up to N.)

### The foot and the bar

- **No Back once expanded**: the dropdown and its arrows go to the centre and between accords,
  and Collapse into one. Back is **only in combinations**, where it stands **before
  Combinations, the two together in the middle** (`.net-foot.is-back`: each as wide as it is,
  rather than two equal columns whose gap is the middle).
- **The list's button made plain** (*3 fragrances have all 5*): a gold frame round the count,
  and **SHOW** (**HIDE** once open) in a filled gold tab at its end with its caret, and a ring
  going out from it whenever the count changes (`is-new`). While there is nothing to list it is
  only its words.
- **"Unfortunately nothing like that exists on this page yet."** — what the bar says to anything
  that answers nothing, with or without tags (it said *Nothing found with all of them answers
  that.* and *No note answers that.*). While it is saying so, or suggesting notes, the list
  steps aside for it (the two stood on top of each other).
- **RESET** at the bar's right end: every tag taken away and the field emptied at once. Faint and
  not pressable while there is nothing to take away.

### The depth blur

**Removed** the next round, with the soft moment after a tag is added — "remove the blur;
entirely scratch that idea" — and nothing of it is in the code: see [the last
section](#2026-09-28-last--no-blur-the-fragrances-in-each-tier-and-the-middle-of-the-venn-diagram).
Kept here for the reasoning.

Once expanded, whatever stands nearer or farther than what is looked at is drawn **soft**, as a
lens would: at the centre, the centre and the networks level with it sharp, the others softer the
farther in front or behind (`BLUR_BAND` 4 either side sharp, wholly soft `BLUR_RAMP` 22 beyond);
at an accord, **the whole of it** sharp (its reach and a little) and the rest of the library soft.
It comes in over the last part of coming apart and goes with collapsing (`smooth(0.55, 1, u)`).

**How** — the one part of this that is not obvious from the result: a lens blur usually reads each
pixel's depth back off the depth buffer, but almost everything here is **added light** — lines,
glows — which writes no depth, so a pixel of line over empty ground would read as the far
distance and be blurred as if it were. Instead every node, link, glow and bridge knows its own
depth, so each is **shared between two layers by how soft it is**: the sharp as it always was, and
**the soft layer** — its own copies of the node sets, the glows, the links and the bridges
(`set.soft`, `softGlow`, `softLinks`, `softBridges`, on layer `SOFT`), with the centre, the middle
nodes, their frames and the ring drawn into both by their own softness. The soft layer is drawn
apart at half the window's size, blurred twice with a Gaussian of thirteen taps each way
(`BLUR_STEPS`), and laid down first, with a grain of noise where there is anything so its soft
edges are never drawn in steps; everything sharp is drawn over it. Nothing is drawn stronger than
it was — except that a node gone soft keeps none of its own glow (`SOFT_GLOW` 0) and the soft
layer is a little quieter (`SOFT_DIM` 0.72): a network out of focus, blurred at full strength with
its glows, was a red haze, which is the one thing this round asked to be rid of. The specks in
the far air stay sharp; blurred, they mottled the whole ground. With nothing soft, nothing of it is
drawn.

**Reversible**: `DEPTH_BLUR` at the top of `network.js` — false, and it is gone. **`?blur=off`**
on the address shows the page without it, and `?blur=on` with it, without changing anything.

**Not on a machine drawing in software** unless `?blur=on` asks: a browser with no graphics card
to hand the drawing to (it says so — *SwiftShader*, *llvmpipe* — in `WEBGL_debug_renderer_info`)
draws every see-through sphere on the processor, and there the soft layer halved the frames
(3.8 a second to 2), so slowly that coming apart took longer than the tests wait. A graphics card
does the same work in a moment. The machine the tests run on is one of these, so the depth blur's
own test asks for it with `?blur=on`, and the rest run without it as such a machine would.

This is the second WebGL program of the site's own (after the home page's map): two small
`ShaderMaterial`s drawn on a square over the window (`blurMaterial`, `layMaterial`). A fault in
either would leave the soft layer black or blank rather than the page — the sharp layer is drawn
by the library's own materials, as before.

### A note added: the network soft, its lines drawn out

(The network going soft went the next round with the depth blur; the lines are still drawn out.)

When a note is added in combinations (typed, chosen or pressed), for 1.6 seconds (`TAG_MS`) **the
rest of the network goes soft** — the same soft layer — while **the note's lines are drawn out**
from it, the nearest first, one after another, brighter at their ends while they are still coming
(`lineAt`, `LINE_GROW`); each note it is found with **comes back into focus as its line reaches
it**, and then the whole network. Taking a tag away or Reset ends it at once. None of it with
reduced motion: the lines are simply there.

### Costs

The soft layer is a second drawing of the scene at a quarter of the pixels and four passes of the
blur; a frame's own work (the page's, not the drawing's) went from 3.4ms to 4.0ms on average
through the expansion, a journey and the collapse (the test's bound is 7ms). The translucent set
and the soft set are **packed** (`packed`, `pack`, `packDone`): each draws only the nodes it has
this frame, one after another, with its own colours and opacities, where they used to draw every
node of their set and hide the rest — with the depth blur some node is nearly always part-soft,
and so part-translucent, and the translucent set was otherwise drawn whole every frame. What was
tried and did not help on software drawing: the blur's targets in 8 bits, at a quarter of the
window, and a plainer sphere for the soft copies; it is the see-through spheres themselves.

### How to test it

`tests/test-page.spec.js`:

- **`the Note Library is drawn as one red network ...`** — and the ground one grey
  (`background-image: none`).
- **`expanding: ...`** — *Collapse* alone in the middle, **no Back**.
- **`once apart, a note pressed opens its own window ...`** — the pyramid's counts read **n/N**,
  N the fragrances naming the note.
- **`at an accord nothing stands in its way, the menu's hand does not take it away, and there is no
  Back while expanded`** — was *... and Back goes the way you came*; the dropdown goes to the
  centre and Collapse into one, Back hidden throughout.
- **`expanded, what is nearer or farther than what is looked at goes soft, and ?blur=off takes it
  away`** (new) — on as it stands unless drawn in software; then with `?blur=on`: nothing soft in
  the one network; apart, some notes soft and not all, their links
  with them; at Woods every one of its notes sharp and the notes nearer or farther soft (not all the rest: a network level with Woods stays sharp, as through a lens); collapsed, nothing soft; and
  with `?blur=off`, no soft layer at all.
- **`combinations: ...`** — Back and Combinations together in the middle; Reset not pressable,
  then taking two tags away at once; the network soft a moment after a tag is added
  (`NetScene.state().softest`) and sharp again after; *Show* / *Hide*; the owner's sentence for
  what answers nothing.
- With animation turned off, a note added in combinations: no soft moment, every line at once.

To look at it: `?blur=off` against the page as it is.

### Known issues / TODO

- The depth blur is an experiment the owner asked to be able to take back: **`DEPTH_BLUR = false`**
  does it for good, and the soft layer is still used for the moment after a note is added.
- A soft network in front of what is looked at is laid **under** what is sharp rather than over
  it; where the two cross, the soft one is behind. Lines and glows are added light and do not
  care; the spheres would, and at an accord everything in front is let go anyway.
- On a slow machine the moment after a tag is added may be seen in only a few frames.

## 2026-09-28, last — no blur, the fragrances in each tier, and the middle of the Venn diagram

> remove the blur; entirely scratch that idea.
>
> picture 1: I want you to change the text in variations to "No records of variations exist as of
> now"
> i also want you to add a list of fragrances in which ingredient n is listed as a top note. do the
> same for middle and base and non-pyramidal.
>
> image 2: make this text disappear if you move the thing, (i want you to make it an idle thing)
>
> I want you to change the way that the connections represent a perfume with all selected notes in
> combinations, such that instead of all the notes you select showing their links to all the other
> notes they are connected to, i want the selection of the second (and third and soone) note to
> eliminate the connections that do not connect BOTH (or all) selected notes.

Two things were asked. Whether "the blur" was the depth blur alone or the soft moment after a tag
is added too — **both, all blur gone**; the tag's lines still draw out one by one. And what "only
the connections that connect both" should be — the owner: *"i want each note to be a network, but
upon selecting more than one note, only the lines that satisfy both networks are going to be
included (like the middle area in a venn diagram)"*.

### No blur

Out of the code, not switched off: `DEPTH_BLUR` and `?blur=`, the soft layer and everything drawn
into it (`SOFT`, `set.sp` / `set.soft`, `softGlow`, `softLinks`, `softBridges`, `SOFT_GLOW`,
`SOFT_DIM`), the two render targets and the page's own two shaders (`blurMaterial`,
`layMaterial`), the depth of field (`dofOf`, `blurOf`), the soft moment after a tag is added
(`softest`, `bump`) and the check for a machine drawing in software. The frame ends with
`renderer.render(scene, camera)` as it did before the blur. What the blur round left that is worth
keeping stays: the translucent set **packed** (`packed`, `pack`, `packDone` — only the nodes it
has this frame), the tag's lines drawn out (`TAG_MS`, `lineAt`, `LINE_GROW`), the flat grey ground
and everything else in the section above. The test page is back to the library's own shaders and
the two small additions to them (`perNode`, `glowSize`); it writes none of its own.

### Variations, when there are none

*No records of variations exist as of now* — the owner's words, where a note is written only one
way (it said *Written only this way on the site.*).

### The fragrances in each tier

Under the pyramid, **four dropdowns** — *Top*, *Middle*, *Base*, *Non-pyramidal*, each with how
many — and in each the fragrances naming the note there, by number, name and house (*Individual*
for the individual fragrances), every one a way to it where it stands, in the site's house order.
A fragrance can stand in two (a note named in the heart and the base). A tier with none says *None
as of now.* and is greyed. They open and shut as the window's other dropdowns do and stay as they
were left for the next note (`drop`, `dropsOpen`, `tier:top` …). `.net-note-tier-lists`,
`.net-note-fhouse` in `style.css`.

### "Choose a note …" only when left alone

The line where the list's button stands, while no note is chosen, is **only there when the page
is left alone** — it fades in with the arrows' glow once the hand has been still for `IDLE_MS`
(`is-idle` on the stage), and out at the first movement (`.net-combine-toggle.is-hint`). With a
note chosen it is the button to the list, as before, and always there.

### The middle of the Venn diagram

**One tag**: it is its own network — joined to every note found with it in any fragrance, as
before. **Two or more**: each is still its own network, and only **the notes in every one of
them** keep lines — the middle of their Venn diagram (`nets`, `networkOf`, in `recompute`). Every
tag is joined to every one of those, **each line as bright as that tag is found with it** in its
own network, and the tags to each other where they are found together. Everything else goes faint
— a note of Yuzu's network and not the other's loses its lines — and **none of the network's own
lines are drawn while a note is chosen** (they read as more connections). **The list** is still
the fragrances that have every tag (*N fragrances have both*), which is a different, narrower
thing: a note in the middle may be found with Yuzu in one fragrance and with the other in another.
The bar's suggestions, once there is a tag, are the middle's. `NetScene.combined(names)` gives
the same answer the page draws.

### How to test it

`tests/test-page.spec.js`:

- **`once apart, a note pressed opens its own window ...`** — under the pyramid, each tier's
  dropdown holds exactly the fragrances naming the note there, as many as the pyramid counts,
  each a link into a house; a note written only one way (opened with `NetScene.open`) says *No
  records of variations exist as of now*.
- **`combinations: ...`** — "Choose a note …" gone while the hand moves, there once the page is
  left to itself (`NetScene.leave`), gone again at a move; a tag's lines drawn out and done
  (`tagging` false); two tags: only the middle of the two networks (every note of it in Yuzu's,
  fewer than Yuzu's), `2 × middle + 1` lines, and a note of Yuzu's alone gone faint.
- **`the depth blur is gone from the test page, not switched off`** (new, replacing the depth
  blur's own) — none of `DEPTH_BLUR`, `WebGLRenderTarget`, `blurMaterial`, `SOFT_GLOW`, `softOp`
  or `blur=off` in `network.js`.
- With animation turned off, a tag's lines all at once.

### Known issues / TODO

- The lines and the list answer two different questions — what is found with each tag, and
  which fragrances have them all — and the owner has only asked about the lines. If they meant the
  lines to come from the fragrances with every tag alone, that is `recompute` reading `matched`
  instead of `nets`.

## 2026-09-28, last of all — turning by the clock

"make the animations in RE and in the test site clusters animate even when you click off of the
page": the one network's turn and each accord's are measured **by the clock** (`wall` in `frame`),
not by the frame, so a page given few frames or none has still turned as far as it would have;
everything else still takes at most 50ms a frame. Coming back to the tab no longer forgets the last
frame's time (`lastT`), which is what lets the turn catch up, and a frame the page drew for itself
while clicked off (`KeepTime.standIn`, from `nav.js`) is not counted when the page judges how
quickly the machine draws. See [the page shell](2026-09-11-the-page-shell-and-menu.md#2026-09-28--the-page-keeps-its-own-time);
tested in `tests/keep-time.spec.js`.

## 2026-09-28, the very last — two notes or more, lit alone

> There are so many nodes lit up that do not belong in the venn diagram. I want ONLY the ones
> that are relevant to be lit up. You can have the notes that are relevant be lit up but be
> blurred like the ones that are not being used; however please make sure that you only have
> connections lit up between cedarwood myrrh vanilla and fir (in the image) and i want you to
> apply the same logic in general.

The picture was four tags — Cedarwood, Myrrh, Fir, Vanilla — with the middle of their four
networks lit and joined to all four: fifty-four notes, every one found with each of the four in
some fragrance or other, and to the owner most of them "do not belong".

**One tag** is as it was: its own network, every note found with it lit and joined to it, the
most found brightest, and the names of the tag and what it is found with most.

**Two or more are lit alone.** The tags are the only notes at full strength, and **the only lines
are between them** — each two joined where some fragrance names them both, as bright as how many
do (`pairs`, `pairMost`, worked out in `recompute`), the line from a tag just added drawn out to
the others one after another, the nearest first. Everything else is **as faint as what is not
being used** — the owner allowed the relevant notes to stay "lit up but ... like the ones that are
not being used", and that is what the middle of the Venn diagram is now: worked out still
(`partners`), for **the bar's suggestions** (what can be added and still be found with them all)
and for **the hand** (*· with them ×3* on a faint note pointed at), but drawn exactly as faint as
the rest and joined to nothing. Only the tags are named. Two tags never found together have no
line between them. The Cedarwood, Myrrh, Fir, Vanilla of the picture comes to six lines — every
two of the four are found together, Cedarwood and Vanilla most (nine fragrances) — over one
fragrance with all four, Grande Parfums' 06.

"Blurred" is read as faint: the owner had every blur taken off the page the round before.

### How to test it

`tests/test-page.spec.js`, **`combinations: ...`** — two tags: `NetScene.combined` gives each two
found together (`together`), and the page draws exactly those (`pairs`): **one line**, from Yuzu
to the other, lit; a note of the middle of their Venn diagram and a note of Yuzu's network alone
both gone faint; both tags at full strength; and every name standing is one of the two. (It
expected a line from each tag to every note of the middle, the round before.)

### Known issues / TODO

- "The same logic in general" is read as every combination of two or more. One tag keeps its
  network, because with the same logic it would have no lines at all.

## 2026-09-29 — the possibilities shown, and the line between the chosen emphasized

> On this page; it should Show dont blur out yhe nodes which can be connected to these two. I want
> only these two to be lit up, and connected with a bright and emphasized line; BUT I WANT THE
> POSSIBILITIES TO ALSO BE SHOWN. In the venn diagram, so far its correct; those are the ones that
> should be lit up; but anything that could be added to the venn diagram should be at least
> available for selection visually.

The picture was a phone in combinations with **Cedarwood** and **Musk** chosen: the two lit and
named, a hair-thin line between them, and everything else as faint as what is not used — the round
before's "two or more, lit alone".

**What "the possibilities" are** is read in the page's own terms: the notes that could be added to
the Venn diagram are **the middle of it** — every note found with each chosen note in some fragrance
(`partners`, worked out in `recompute`), which is exactly what **the bar suggests** once there are
tags. Nothing else is one.

- **The possibilities are shown.** With two tags or more, each carries its share of the most found
  (`possibleOf`, 0 to 1, the least it is found with any one tag over the most any possibility is),
  and stands at **`POSSIBLE`, 0.56 to 0.82** of its strength, the more often found the stronger:
  plainly there, gold, its own size and its own glow — and **not lit**: not whitened, not
  enlarged, not named, and **joined to nothing**. The tags stay the only notes at full strength,
  whitened, half as large again and named. What is found with fewer than all the tags goes as
  faint as before (0.1).
- **Available for selection.** A note chosen from the network has to be at half its strength or
  more to answer the hand while tags are chosen (`nodeAt`) — which is why, the round before, the
  middle of the Venn diagram could not be pressed at all, only typed. At 0.56 and up it answers:
  pointed at, it says *· with them ×N*; pressed, it is added as a tag. A note that is not a
  possibility still does not answer.
- **The line between the chosen is emphasized — the bond.** Every line between two tags (each two
  found together, `pairs`) is drawn as before and, over it, **a fine bright rod** — the library's
  own cylinder, instanced (`bondRod`, `BOND_R` 0.026, about three pixels wide at the network's
  distance), additive, warm white, as bright as the pair is found together — with **a soft glow
  laid along it** (`bondGlow`: a point of the site's `SPOT` every `BOND_STEP`) and **a bead of
  light running its length and back** every `BEAD_MS` (2.6s), each bond on a phase of its own. It
  grows out with the line when a tag is added, and the bead only runs once it has arrived. No shader
  of the page's own: a cylinder and points, as everything else.

With motion turned off the bond is drawn still, without its bead.

### How to test it

`tests/test-page.spec.js`, **`combinations: ...`** — two tags: one line and **one rod** along it,
tag to tag, wider than a line (more than 1.5px) and brighter than the line, with a glow along it
(`NetScene.bonds()`, `state().bondPoints`); **the possibilities are exactly the middle of the Venn
diagram** (`state().possible` against `NetScene.combined`'s `withs`), **every one above half
strength and below the tags'**; a note of Yuzu's network alone still faint; both tags at full
strength; a possibility pointed at answering the hand; and only the two named. (It expected the
middle of the Venn diagram as faint as the rest, the round before.)

### Known issues / TODO

- Many tags make many bonds: each two found together has one, up to `BOND_MAX` (64) — eleven tags'
  worth — and the glow's points are capped at `BOND_POINTS` (4000); past either, the plain line is
  still drawn.


## 2026-09-29, later — the Note Library itself: the Sources at its centre, and every note written again

> For the expanded notes on the test page, i want you to remove the fragrances part, and add it
> after the pyramidal distribution chart. I want you to give that part the same structure as
> "fragrances" has now … divisible by the houses and individual fragrnces and then in houses also
> you can drop down based on house.
>
> replace the note library page with the test page. Remove all content from the previous note
> library. Remove the test page from the menu … effecitvely make the test page the new note library
> page.
>
> revise the symbols that you used in the test page … I want it to be representative … like holy
> bread should be a cross.
>
> make the subtitles in the popup note windows slightly more visible. Remove numbering from
> fragrances in this window too.
>
> be able to click on the dofferent vatiations of a certain note, and it gives you a line or two
> describing how taht is different … madagascar vanilla …
>
> you are not limited with wrods when it comes to describing a scent. I want you to be holistic and
> simple, but not hold back. … search up the notes … have at least two sources for each
> description of a note.
>
> the middle node of the expanded view of the nnl to be called sources … The very first source
> should be: the first source is me. The latter whould be a popup window, differnt from all the
> others. … a hover thing … expand slightly, turn redder and habe the text appear.

Asked, the owner chose: each tier split the same way; **the notes and their variations** both
researched and written again, all 332; the centre becomes the Sources; and for the variations:
"If it is aspelling difrence only, then say that there was no change, but if it is a difference
such as bourbon and madagascar vanilla, then no, give an explanation. I want you to look first at
whether there is a difference at all. If yes, research it."

### It is the Note Library now

- **`categories/note-library.html` carries the drawing.** The periodic table of notes is gone —
  `note-library.js` deleted, its `lib-*` rules out of `style.css` (about a thousand lines), and its
  tests replaced by this page's, moved from `tests/test-page.spec.js` into
  `tests/note-library.spec.js`. The page loads `nav.js`, Three.js, `notes-data.js`,
  `note-figures.js` and `network.js`, on `body.network-page dark-surface`.
- **`works/test-page.html` forwards** — the script at once, carrying the anchor; a meta refresh
  without JavaScript; a link for anyone with neither — as the houses' old addresses do, and is
  `noindex`. The test page is out of the Menu (`SITE_LINKS`), out of the search's `PAGES`, and out
  of the sitemap (`tools/seo.py`).
- **The catalogue is the page's own markup, and the one copy of the library.** Every accord
  (`section.lib-shelf`), every note (`article.lib-record`: its name, what it is in `.lib-say` with
  `data-sources`, its other spellings in `data-aka`, and what each means in `dl.lib-variations`),
  and the sources (`section.lib-sources`, an `<ol>` whose first item is *Me.*). `network.js` reads
  it off the page as it opens — it fetched the library's page while it was the test page — and the
  site's search reads the notes off it as before, a note's link (`#note-orris`) opening that note's
  window. While the drawing is made the catalogue is hidden by **`lib-drawing`** on `<html>` (set
  in the page's head, cleared at `load` if `network.js` never ran), and without the drawing it is
  the page: a plain list, every note by accord, and the sources.
- **It is written by `tools/note-library/catalogue.py`**, never by hand, because the sources are
  numbered alphabetically and one added renumbers every one after it: from `base.json` (every
  accord and note, its spellings and the old library's one line) and `research/*.py` (what each
  note is, what each variation means, and the sources each was written from — one file an accord).
  Its README says how. It reports what is missing (`--check`).

### The note window

- **The Fragrances list is gone from the top**, and each tier after the pyramid — *Top*, *Middle*,
  *Base*, *Non-pyramidal* — is split as it was: **Individual fragrances**, then **Houses**, and in
  Houses **a dropdown for each house** (`splitByHouse`). Every one a dropdown, shut when the window
  opens; what was left open stays open for the next note.
- **No numbers** on the fragrances: each is its name, a way to it.
- **The subtitles brighter** — the small capitals over each part, from the muted grey (137) to
  about 190.
- **What it is carries its sources**: small numbers under the description (`.net-note-cites`), each
  opening **the sources** at that one.
- **Every variation is a button** (`.net-note-var`): pressed, a panel under the row says what it
  is against the note (`AGAINST VANILLA`) and its sources — or, where it is only another spelling,
  **no change** and why (`is-same`); pressed again it closes, another pressed changes it. A
  variation not written yet says so (*Not written yet.*).

### The centre is the Sources

- **Found by the hand.** Nothing says so until it is pointed at; then the centre **swells a little**
  (`HUB_SWELL`, a quarter), its ball, cage, rings and glow **turn red**, and **Sources** comes up
  under it, eased over about a fifth of a second (`HUB_HOVER_RATE`, `.net-centre-name`).
- **Pressed, it opens the sources** — no longer going back to seeing every accord (the dropdown,
  the arrows and Home still do). **A sheet of paper**, unlike every other window on the page, which
  are dark glass: warm white, dark ink, the page's red only in its numbers, a double rule under
  *References*, unfolding out of wherever it was opened from (`--from-x`, `--from-y`). **1 is *Me.***,
  with *The author of this site* under it; then every source in MLA 8, alphabetical, each a link
  that opens in a new window. Opened from a number, it scrolls to that source and marks it
  (`is-asked`). Escape, its ×, or the page round it close it; a note's window under it stays.

### The symbols

The figures revised for what a note **is**, not what it is made of — "like holy bread should be a
cross": Holy Bread a cross; a note best known by an outline — a paw print for Animal Notes, a
bolt for Ozone, a fingerprint for Skin, a hide for Leather (and, after the owner's answers below, a
swatch for Suede, a stinking steak for Rotten Flesh, a musk deer and its pod for Musk) — drawn as **a flat shape** facing you with a little thickness and specks inside it;
flowers turned to face you rather than the sky; and **fifty-odd others redrawn** (a hop cone of
spiral scales, eucalyptus leaves hanging from an arched stem, a mortar and pestle for Herbal
Notes, a cacao pod and its beans, tonka's wrinkled beans, a pine cone, a tapped trunk for
Balsam, a thorny branch with tears for Myrrh, a box of tears for Benzoin, a blackberry of
drupelets, cranberries on water …; eleven of them were redrawn again at the owner's answer, below). **Every figure
sways** about its upright, a little left of straight on, once every fourteen seconds or so, rather
than turning all the way round: an outline turned edge on says nothing.

### Every note written again

Every note was looked up, and what it is written again in plain words — what it is, how it smells,
how it behaves in a perfume — from **at least two sources**, which are named under it: Fragrantica's
notes and articles, The Perfume Society, Wikipedia, Scentspiracy, The Good Scents Company, ScenTree,
Osmoz, Fraterworks, Perfumer & Flavorist and others, and the houses' own pages where the note is
theirs. Nothing is said that a source does not say; where a house has named a note of its own
(*Electric Bergamot*, *Icy Ginger*, *Mineral Ambers*, *Sawn Resin*), the window says so and
reads it through the house's own page and a general source, and says when no material of that
name could be found. Every **variation** was first looked at for whether it differs at all: a
spelling, a plural, a word saying how it is made (*Olibanum*, *Resin*, *Goat Hair Tincture*) says
*No change* and why; a real difference (*Siam Benzoin*, *Spanish Labdanum*, *Olibanum Absolute*)
is explained, from two sources.

**All 332 are researched, with 953 sources** (the owner among them). The first session's web
searches — two hundred — ran out part way through Musk, Skin & Animalic with 267 done; a second
session wrote **the last 65**: **Leather, Musk, Skin and Suede** (`research/ANI2.py`), every note
of **Earth, Moss & Mineral** (`EAR.py`), **Water & Air** (`AIR.py`) and **Smoke & Char**
(`SMK.py`), and every note of **Impressions** but CO2 Extracts (`IMP2.py`). Many of those are
impressions rather than materials — *Clear Skies*, *Dusty Sofa*, *Spinal Fluid*, *Eye Pencil* — and
each says so: what the house or the fragrance's list names, and how perfumers build that kind of
smell, from a general source beside it; where a house page is the only thing naming a note, the
wording says it is the house's picture. The house pages themselves could not be opened from the
session (its network does not reach them), so they are named as the source of the name, never
quoted. **African CO2**, the last variation, says honestly that White Label's list names only the
place, not the plant. The eleven spelling-only variations waiting in `research/SPELL.py` moved into
their notes' own files, and `SPELL.py` is empty — kept, for a spelling added to a note not yet
researched.

### How to test it

`tests/note-library.spec.js` — all of the test page's tests, on the library's own address, and:

- **`once apart, a note pressed opens its own window …`** — no Fragrances list; the subtitles
  brighter than the muted grey; every variation a button saying what the catalogue says it means;
  each tier split into the individual fragrances and the houses, a dropdown for each house, and
  every fragrance naming the note somewhere in the tiers, **by name only**.
- **`the catalogue: the owner first, the rest in order, two sources to every description
  written`** — browserless: source 1 is *Me.*; the rest numbered in order and alphabetical, each
  an MLA entry ending with the day it was read; every number a description names is in the list;
  every researched note names **two sources at least**, and every one of its variations is written —
  *No change …* for a spelling, two sources for a real difference — but for anything in **`WAITING`**
  (empty since every variation was written), which must stay unwritten until it is taken off the
  list; and a note not researched names no source and leaves its real variations unwritten.
- **`the centre is the Sources …`** — its name not there until the hand is on it; pointed at, it
  swells red (`state().centreHover`) and says *Sources*; pressed, the sources open where the page
  is (it goes nowhere), every source in the catalogue there, *Me.* first, light where the note
  window is dark; Escape closes them; a description's number opens them at that source, marked and
  in view, the note's window still under them.
- **`the test page is the Note Library now …`** — out of the Menu and the search's pages,
  `note-library.js` gone, and `works/test-page.html#note-vanilla` landing on Vanilla's window.
- **`the site's search finds a note, by any of its spellings …`** — *iris butter* finds Orris,
  and its link opens Orris's window.
- **`without JavaScript`** and **`without its 3D library`** — the catalogue is the page, every
  note listed, and the sources.

And `python3 tools/note-library/catalogue.py --check` — *notes 332, researched 332*, and nothing
listed as missing.

### Known issues / TODO

- **Nothing is waiting to be researched** (2026-09-29, later): all 332 notes and every variation
  are written. A new note needs its research in its accord's file before `--check` is clean.
- The house pages (ADAR, Ataraxia, Tombstone, Pineward and the rest) could not be opened from the
  session that wrote the last 65, so where a note rests on one, the description leans on what the
  site's own `notes-data.js` already records it naming, and on a general source.
- None of the symbols is waiting: the twelve the owner was asked about were redrawn but Civet,
  and five of those again at the owner's word (below).

### Twelve symbols asked about, eleven redrawn

Asked which of the twelve symbols I was unsure of should be redrawn, the owner answered "All except
civet". So Civet stays the animal, and the other eleven say what they are differently:

- **Musk** — a **musk deer**, where musk was first taken from: no antlers, the back higher at the
  rump, big ears and the long tusk (it was a cotton boll, for white musk's softness).
- **Botanical Musk** — the **musk mallow's seed pod**, pointed and ribbed, its seeds falling from
  its tip and gathered below (it was a leaf and a cloud).
- **Lanolin** — **a pot of balm**, its lid leant against it, a swirl on top and a tuft of wool
  beside it (it was a sheep).
- **Suede** — **a suede boot**, a chukka laced through three eyelets, its nap brushed one way (it
  was a glove).
- **Rotten Flesh** — **a fly** from above: eyes, a striped body, veined wings, six jointed legs (it
  was a bone).
- **Mousse de Saxe** — **Saxony's arms**, for "moss of Saxony": a shield barred across with the
  crown-wreath on the bend, and moss at its foot (it was an old atomiser).
- **CO2 Extracts** — **a pressure gauge**, since carbon dioxide takes the smell out only under
  pressure, a drop falling from its pipe (it was a bottle and a drop).
- **Malt** — **malted milk balls**, one whole and one bitten through to its crumb (it was grains).
- **Sandalwood** — **a sandalwood fan**, pleated, pierced, with its tassel (it was logs and shavings).
- **Opoponax** — **a censer** on three chains, smoking (it was a tree with a drop).
- **Amber Oud** — **a mabkhara**, the burner oud and amber are smoked on, chips of the wood on it (it
  was a ball and a gem).

### Five redrawn again

> i want you to change sandalwood icon please; change suede, rotten flesh should also be changed,
> make musk deer musk specifically; also change mousse de saxe

- **Sandalwood** — **a mala**: prayer beads of the wood, sacred in India, on their loop, with the
  larger guru bead and the tassel (the fan went).
- **Suede** — **a swatch** of it, stitched round its edge, its nap lying one way and **a finger's
  trail** across it where the nap lies the other way — suede's own look (the boot went).
- **Rotten Flesh** — **a steak that stinks**, at the owner's next word ("the rotton flesh, make it
  look like steak thats stinks"): a T-bone, wider than it is tall, the T of bone between its large
  and its small side of meat, the rim of fat round it, marbled, gone off in spots, and the stench
  rising off it in three wavy lines (the fly went, and for a moment meat on the bone).
- **Musk** — "musk deer musk specifically", read both ways it can be: **the musk deer**, no antlers,
  its back arched high at the rump, big ears, the long tusk, the pod marked under its belly — and
  **the musk itself** beside it, the furred pod its opening spilling a heap of the dark grains.
- **Mousse de Saxe** — **a base tied in a bundle**, as it is made: sticks of licorice root, a
  vanilla pod and a round geranium leaf bound with a leather thong — its geranium, licorice,
  vanilla and leather (Saxony's arms went).

## 2026-09-29, last — the middle nodes the way in, journeys that fade, the air, and a search that touches nothing

> I want you not to be able to click the lines to take you to those clusters. I want you to be
> unable to click on individual notes in the expanded view in the "every accord" view. I want you
> to be able to click on the cluster centers however, and go to that cluster by clicking on it that
> way. also please smoothen out the animation of going cluster to cluster. (with fading, and with
> the flashing and make it so that the clusters fit on the screen properly) I would also like the
> background to be a litttttle dynamic, not just dots in 3d space on a gray background. add
> something there. also make the search dynamic. also when you search something, i dont want
> anything to happen in the background, is simpy want the note description to go up and show
> itself without anything going on withthe clusters or notes and all else.

### Seeing every accord, only the middle nodes answer

- **A bridge is only a line.** Pointed at, it says nothing; pressed, nothing. `bridgeAt` is gone.
- **A note, seen from the centre, answers nothing** — not named under the hand, not chosen when
  pressed (`nodeAt` returns nothing while `focus` is the centre, unless combining). Notes answer
  once you are at their accord, as before; combinations still take any note as a tag.
- **An accord's middle node is the way in** (`middleAt`): pointed at, it swells, glows more, its
  bridge lights, and the tag beside it says *Go to 06 · Spice →*; pressed, the view goes there.
  It is found within a radius that grows with how near it stands (never under 15px), and not while
  that accord is stepped back.
- The dropdown, its arrows, the keys, the accords' names and the menu still go anywhere.

### Journeys that fade

Going from one place to another used to cut: the network left stepped back at once and the one
arrived at came up at once. Now each journey's fades follow the journey itself (`journeyAt`):

- **From one accord to another**: the one being left fades back over the first half; the centre
  and the other networks come up a little as the way passes the middle (a quarter of their
  strength at most) and go back again; the one gone to comes up over the last two thirds.
- **From the centre to an accord**: the others fade back over most of the way, the centre a little
  later, and the one gone to stays whole.
- **Back to the centre**: everything comes up together.
- Every fade starts from where things stood when the journey set off, so a journey turned round
  half way does not jump.
- The way is **slower and eased on a sine**, slowest at each end (`FLY_MS` 2.9s between accords,
  `FLY_NEAR_MS` 2s to or from the centre). **The flash** still goes only on a journey, timed to
  reach the network as it comes up.
- **Every accord fits the window**: the view stands back from it by the farthest of its own nodes,
  made or not (`A.ext`), with a third again to spare (`fit(max(R, ext) × 1.32)`), where it stood
  back by the accord's radius with a fifth to spare and the farthest nodes of the larger ones could
  run off the edges.

### The air

The specks behind everything were still. Now they are **the air** (`DUST` 900):

- each drifts on a slow orbit of its own and twinkles;
- the whole of it turns, slower than anything else;
- now and then two near specks are joined by a **hairline** that comes and goes (`THREADS`, up to
  fourteen at once, four to eight seconds each), a constellation found and lost;
- once in every seven to fifteen seconds a faint **streak** crosses far behind.

The grey behind it is untouched (a gradient there drew rings, 2026-09-28). With reduced motion the
specks stand still and nothing crosses.

### A search that answers as it is typed, and touches nothing

- **It answers as it is typed.** The library's rule still holds for every finished word (that
  word, or its plural), but **the word still being typed may be the beginning of one**: *ceda* finds
  the cedars and Cedarwood already. A space after it, and it is a whole word again. A whole word
  ranks before a beginning.
- **The answers come up in turn**, each rising a little, and only the new ones (`is-new`); the part
  of each name typed so far is **marked** with a red underline.
- **Nothing happens behind it.** No note is lit or dimmed, the menu's ring does not change, nothing
  is chosen and nothing moves. The dimming, the lit answers and `hitSet` are out of the code.
- **An answer pressed (or Enter) only brings its note's window up**, rising from below
  (`is-rising`), over the page out of focus. Nothing is chosen on the drawing and nothing is gone to
  (`showNote`, `quiet`). The window's own arrows and the notes it is combined with carry on the same
  way, window to window. Escape or a press round it puts it away.

### How to test it

`tests/note-library.spec.js`:

- **`the arrows on the left pull out the search bar and the menu …`** — *ceda* already finds every
  cedar; *cedar* followed by a space is the library's own answers again; the typed part marked;
  **nothing dimmed, nothing translucent, nothing chosen, nothing moved**; an answer pressed opens
  its window, rising, with nothing chosen or gone to.
- **`the centre joins every network, and going from one accord to another is easy`** — a
  bridge pointed at and pressed does nothing; a note in view at the centre is not named and not
  chosen; Spice's middle node pointed at says *Spice* and pressed goes there; there Spice is whole,
  every other network stepped back, and **every note of Spice on the window**.
- **`the flash goes only on a journey …`** — unchanged, and still passing with the slower journeys.
- **`once apart, a note pressed opens its own window …`** and **`the centre joins every network …`**
  have four minutes rather than two and a half: each makes a dozen journeys, and every journey is
  slower now.

### Known issues / TODO

- A middle node can stand behind another accord's nodes from some angles; they do not answer from
  the centre, so the press still reaches the middle node, but it can be hard to see which it is
  until the tag comes up.
- **`every frame of every transition is quick enough for sixty a second`** fails about one run in
  three on the test machine, on its last line: one frame of 45–55ms against the 40 it allows, while
  the average (about 2.5ms) and nearly every frame stay well inside. **It does the same on the
  version before this round** — run three times against it, it failed once, at 54.5ms — and
  measured outside the test runner, before and after, the slowest frames are the same 23–33ms, at
  the moment the library finishes coming apart. So the air and the fading did not make it; the
  test's own machine, recording as it runs, does. Left as it is rather than loosened.

## 2026-09-29, very last — combinations by fragrance, and galaxies far away

> Okay, for the combinations page; i want you to make it so that if you select note X, then all the
> notes that note X connects to will be available. any other notes which do not combine IN MY
> LIBRARY with note X should be turned off. they should also be connected by a feeble line, and not
> highighted in any way. If you then select note Y, then both of these shoyuld be emphasized, and an
> emphasized line should connect them both. The other notes should stay turned on and be connected to
> both notes X and Y, BUT ONLY NOTES THAT ARE PRESENT IN PERFUMES THAT CONTAIN NOTES X AND Y (NOT X
> OR Y)! then if you add note Z, then leave only notes that are characterizing perfumes that have
> notes of X, Y and Z plus the other notes (that should stay lit up), and keep them connected too.
>
> also remove these random lines please; i want something more akin to galaxies or some
> constallations far far away.

With the owner's two pictures: two notes chosen and a crowd of gold notes still shown as possible,
and six chosen with *no fragrance has all of them* under the bar and notes still shown as available.
Both came from the rule before this one — the middle of the chosen notes' networks' Venn diagram:
every note found with each chosen note **in some fragrance or other**, not in one fragrance with all
of them.

### Combinations: what is available is what is in a fragrance with them all

- **One rule for any number of notes** (`recompute`): the fragrances that have every chosen note are
  the list, and **what is available is every other note those fragrances name** (`partners`, with in
  how many). With one note that is everything it is ever found with; with two, only what is in a
  fragrance with both; with three, with all three; and so on.
- **Available notes stay on as they are** — their gold, their size, **not lit and not named** — each
  joined to **every chosen note by a feeble line**, the same for every one (`FEEBLE`). **Everything
  else is off** (`OFF`, 0.06, fillers too), cannot be pressed, and is not offered by the bar.
- **The chosen are emphasized** — whiter, larger, glowing, named — and two or more are joined to each
  other by **the emphasized line** (the bond), as before.
- **Only what is available can be taken**: the bar offers only those notes, a press on the network
  finds only those, and `addTag` refuses anything else. So there is always at least one fragrance
  with them all, and the six-with-nothing of the owner's picture cannot happen. Typing a note that is
  off says so: *Nothing in the library has that with* Yuzu (or *with all of these*). Typing a note
  that does not exist still says the owner's *Unfortunately nothing like that exists on this page
  yet.*
- The list, the count (*N fragrances have all 3*), Reset, Back and the idle hint are as they were.
  `possibleOf`, `partnerOf`, `POSSIBLE` and `partnerMost` are gone; `availOf` is in their place, and
  `state().possible` is `state().available`.

### The air: no lines — galaxies far away

- **The hairlines** that came and went between near specks (`THREADS`) and **the streak** that
  crossed now and then — the owner's "random lines" — **are gone** from the code.
- In their place, **galaxies**, far out beyond the specks (118 to 158 from the middle, where the
  specks are 45 to 105): **36** of them spread round the sky — **spirals**, two or three arms wound out
  of a warm core, bluer and fainter as they go, a pinkish knot here and there; **ellipticals**, a warm
  haze thickest in its middle; and **clusters**, tight balls of pale stars. Each is turned towards the
  middle and tilted its own way (never so far that it is only seen edge on), and **turns slowly about
  itself**; the whole sky turns with the specks. A handful are in view at any time, a few tens of
  pixels across — far away, as asked. With reduced motion nothing turns.
- They are made once from **a sequence of their own** (`gRnd`), so the rest of the drawing is laid
  out exactly as it was. Each is one `THREE.Points` in a tilted holder; only its turn changes a frame.
- First tries, seen and changed before this was published: ten galaxies, too few (one in view) and
  too large and bright to read as far; then thirty-six too small (specks and dashes, some edge on).

### How to test it

`tests/note-library.spec.js`, **`combinations: …`**, rewritten for the rule:
- with Yuzu, `available` is exactly what it is found with; every line from Yuzu **feeble**; an
  available note **its own gold** (the colour it had before anything was chosen), a note not found
  with it **off**; only Yuzu named;
- with a second note, what is available is **worked out in the test from each note's own
  fragrances** — only notes in a fragrance with both — and matches `available`; a note found with
  each but never with both in one fragrance (the old Venn middle) is **off**; the lines are one
  emphasized between the two and a feeble one from **each** of them to everything available
  (2 × available + 1); the two whiter than their gold;
- a note that is off, typed, is **not offered**, the bar says *Nothing in the library has that with
  all of these.*, and Enter takes nothing.

The galaxies have no test of their own (the page's frame-speed test covers what they cost); look at
the page.

## 2026-09-29, the last round — one galaxy of each kind, the way out asked first, the Sources dark

> please put some variation into this. I want only one galaxy of its kind to be visible in the whole
> 3D thing. Also make it slightly more abstract and particulate; i dont want it to be as emphasized
> ... i like their colour though!

> when you find a perfume that matches the search, bring up a confirmation window that you want to
> go to that page before you go, so it isnt a sudden click and then go.

> flip the colours of the references popup

> remove the small arrows from the text in image 3 (and all texts of the sort)

### One galaxy of each kind

The thirty-six were mostly two- and three-armed spirals, much alike. There are **twelve** now,
**no two the same kind** (`GALAXY_KINDS`): a **grand design** spiral (two long arms wound tight), a
**barred** spiral (a straight bar through the core, an arm from each end), a **ring** (a core and,
clear of it, one ring), one seen **edge-on** (a long thin line with a bulge), an **elliptical** (a warm
haze drawn out one way), a **lenticular** (a bright bulge in a smooth faint disc, no arms), a
**flocculent** spiral (many short broken arm segments), an **irregular** one (a few clumps strung
loosely), a **globular** cluster (a tight ball of pale stars), an **open cluster** (a loose scatter of
a few), a **pair** (two small spirals meeting, a faint bridge of specks between) and **tails** (two
cores throwing long tails off in opposite ways). **More particulate and more abstract**: fewer, finer
specks, set out *along* their shapes rather than heaped up — an arm a dotted run, a ring a string of
beads — at **0.55** of their strength where they were 0.75, and a hair smaller. **The colours are the
ones the owner liked**: a warm core, arms going bluer and fainter, a pale blue-white for clusters, the
odd pink knot. Still far out, spread round the sky, each turning slowly about itself, from their own
sequence (`gRnd`), so nothing else in the drawing moved. `NetScene.galaxies()` says what each is.

### The way out, asked first

Every fragrance the library names is a link to its part — in **the combinations' list** and in **a
note's window** (the fragrances in each tier). A press on one no longer leaves at once: **a small
window** comes up over the page, shaded (not blurred — the note's window may be under it and should
still read as there): *Leave the library*, the fragrance's name, its house, *This goes to its page,
where it is written up.*, and **Stay** and **Go to its page** (the red one, which has the keys). Stay,
Escape or a press round it leaves everything as it was — the tags, the list, the note's window; Go
goes. Opened with a key held (a new tab or window) a link goes without asking, since nothing is left.
Go carries the link as the page wrote it (`../houses/adar.html#part-07`), not the whole address.
`.net-leave` in `network.js` (`askLeave`, `stay`); `state().leaving` is the fragrance being asked
about.

**Orange, and calmer** (2026-09-30: "also make this orange and less urgent", and "maybe change the
text to 'This will take you to the information page of this perfume'"): the window is no longer in
the page's red. Its kicker, its two corner ticks and its way on are a soft orange (`--leave`,
`#e3935a`, on `.net-leave`), the kicker a little quieter; **Go to its page** is a hairline box in
that orange, faintly filled, filling a little more under the hand — not a solid red block — and the
shade behind is lighter (0.34, it was 0.46), the window coming up and going more slowly (420ms; it
was 260ms, and the script waits 460ms, not 320, before hiding it). Its line is the owner's: *This
will take you to the information page of this perfume.* (it was *This goes to its page, where it is
written up.*). A test checks the orange hairline and its faint fill.

### The Sources, dark

The sheet of references (**the sources**) is still paper where every other window is glass, but its
**colours are flipped**: a warm near-black sheet (`--paper`, `#171513`), warm white ink, the page's red
lightened so it reads on the dark (`--paper-red`), and a fine light edge to hold it off the dark page.
The variables keep their names.

### No arrow in the tags

*Go to 06 · Spice →*, the tag a middle node shows under the hand, is **Go to 06 · Spice** now. It was
the only text of its sort left in the library (the old card's *Open it in the Note Library →* went
with the card).

### How to test it

`tests/note-library.spec.js`:
- **`a fragrance pressed asks before the library is left`** — from the combinations' list: it asks,
  names the fragrance, points Go at its part, gives Go the keys; Escape and Stay leave everything as it
  was (the tag, the list); from a note's window's tiers it asks the same, and Go goes;
- **`the galaxies far out are twelve, no two of a kind, and quiet`**;
- the Sources test reads the sheet **dark with light ink**, solid, where the note window is glass;
- the middle-node test reads the tag as *Go to NN · Spice*, with nothing after it.

## 2026-10-01 — turning behind every window, and the way out red but in combinations

The owner:

> in the notes library, when you open anything any popup, i want the thing in the back to keep
> moving. regardless of what you open.
>
> for the notes library, when youre in the expanded view, the window colour should be red-ish, it
> should only be kept yellow in the combinations part of the note library.

- **Whatever is opened, the drawing goes on turning behind it at its own pace.** A note chosen
  slowed the whole — the one network's turn and every accord's own — to a quarter (`slow`, 0.25,
  while `selected`), which under its window read as stopped. Now no window slows it: a note's, the
  Sources, the way out (`windowOpen` in `frame()`). A node under the hand still slows it to a little
  over a third so it can be pressed — but never while a window is open. The test hooks say how far
  it has turned (`turn`, and each accord's `spins`).
- **The way out is red, calmly, but in combinations.** It was a soft orange everywhere since
  2026-09-30 ("make this orange and less urgent"), which against the red network read as the yellow
  the owner names. Its colour is the network's now: **a calm rouge** (`--leave`, `#e2737a`, the
  library's red quietened) out of combinations — the one network and the expanded view — with the
  sheet faintly washed in it and its edge and its two ticks in it; and **the combinations' gold**
  (`#e6b44a`) while combining, when the network is gold (`.net-stage.is-combining .net-leave`). It is
  as calm as it was: its way on a hairline box, faintly filled, filling a little more under the hand.
  `--leave-rgb` and `--leave-ink` carry the same colour for its washes and its words.

How to test it: **`whatever window is opened, the drawing behind goes on turning at its own pace`**
— the turning measured over a second and a half with nothing open, under a note's window and under
the Sources over it (at least 80% of the free pace), and apart, an accord's own turning under a
note's window. **`a fragrance pressed asks before the library is left`** reads the way out gold from
the combinations' list and rouge from a note's window afterwards.

On a phone, also this day (part of the round's smoothness pass): **the fillers are the icosahedron
undivided** — twenty facets, not eighty (`FILLER_FACETS`), a few pixels across there, and most of
the 900,000 vertices a frame the library asked of a phone's graphics chip; the notes keep theirs,
and a desktop both. And since the drawing now goes on turning behind its windows, **a note's window
and the way out stand on the veil's blur alone** on a phone, in a glass a little more opaque, with
no blur of their own. See [the site on a phone](2026-09-21-the-site-on-a-phone.md#2026-10-01--every-page-measured-on-a-phone-and-made-smoother) for how it was measured.

**Two tests made steady, not changed** (2026-10-01): **`as it opens it wires itself in …`** failed
now and then when two library pages were drawing at once in the suite — the old code exactly as
often (run against the commit before this round: two in four) — because the word stays **4.2
seconds of the clock** (`COACH_MS`) and a machine that busy can spend them between the page opening
and the test looking. The test now holds that one timer off (`unCoach`, found by its name) so it
reads the word at its leisure; the press that puts it away is still tested. And **the two tests
that arrive at a note's own address** (`works/test-page.html#note-vanilla`, and the site's search's
link to Orris) read the open note through `noteNow`, which answers nothing rather than failing
while the arriving page has not run its script yet.

**The way out no longer shows a note's window through it as it comes** (2026-10-01, seen in this
round's pictures, and the code before it the same): the way out faded in as a whole, and a layer
part-faded hides from the box's blur whatever stands behind it — so for the length of its fade a
note's window read through the box, sharp (*Deity*, *5 Year* beside *Grande Parfums*), until the blur
snapped on at the end. Its darkening and its box fade apart now (`.net-leave`'s background,
`.net-leave-box`'s opacity), and the box blurs what is behind it from the first frame.


## 2026-10-01, last — a magnifying glass, a word at it, and drawn as sharp as the screen

The owner:

> make the search button in the note library above the menu have a logo of a magnifying glass,
> and when you load the page in, put some text pointint to it too please. Finally sometimes the
> note library looks really not HD on the phone and a little on the pc too. Can you fix that?

- **The search's arrow is a magnifying glass** (`.net-glass`, a small SVG: a lens and its
  handle in the arrows' hairline), turned a quarter towards the search bar while that is out.
  It was a chevron with a small ring under it. The menu's arrow keeps its chevron.
- **The word as it opens points at both**: *Search* at the search's arrow and *Open menu* at the
  menu's, each line level with its arrow's middle (`.net-coach-say[data-for]`), and both arrows
  glowing while it is up. Anything the hand does puts it away, as before. They said *Search
  here* and *Open menu here* for an hour, until the owner: "remove the words here from the text
  Open menu and Search".
- **As sharp as the screen.** The drawing was made at 1.5 device pixels a point on a phone, and
  a machine whose frames came slowly (the middle of ninety over 21ms) was taken down to **0.6 of
  that** — a plain screen too, below its own pixel — **and never back up**: one slow stretch,
  most often the opening, which builds the network as it goes, left the whole visit soft. That
  was the "not HD" on the phone (down to 0.9 a point on a screen at three) and "a little on the
  pc" (0.6 on a plain screen). Now: **the screen's own pixels up to two, a phone too** (`SHARP`);
  the frames **judged only once it has opened**; a slow machine let down **an eighth at a time to
  `SHARP_LEAST`, three quarters, and never below the screen's own pixel** (`sharpness()`) — so a
  plain screen is never let down at all, and a sharp one no lower than 1.5; and **taken back up**
  an eighth at a time once its frames are quick again (the middle under 17.5ms, four seconds
  after it was let down) — unless going up has just brought the slowness back, when it stays
  (`holdLow`), so it never goes up and down. The note window's figure is drawn as sharp
  (`SHARP()`); it was 1.5 on a phone.

How to test it: **`as it opens it wires itself in …`** now also checks both lines — *Search* and
*Open menu*, neither saying "here" — each level with its arrow, and the glass (a circle and a
stroke, no chevron); **`the library is drawn as sharp
as a plain screen, however slowly it draws`** (1, and 1 still after it is told of a machine forty
milliseconds a frame — `NetScene.judge(ms, times)`, which feeds the judgement as its own frames
would); **`on a phone's screen … drawn at two device pixels a point, let down no further than one
and a half, and taken back up`**. The other 3D drawings on the site are in
[the phone report](2026-09-21-the-site-on-a-phone.md).

## 2026-10-01, later — the names pressable, the page named, the pyramid said, a quarter of the turn

> make the words also clickable in Note descriptions, expanded view in each of the accord views ...
> add the word "Note library" next to the menu in note library ... Add a description in the
> pyrammidal distribution of every note window: "This refers to the perfume distribution in which
> you can find this note on either the top, mid or base (or none of the above)." ... also please
> make the movement in note library less responsibe, by a factor of 4 ... in note descriptions,
> instead of "against" note x, then it should be "when compared to"

- **The names are ways in.** At an accord, once expanded, the black names beside the nodes (**the
  tags**, `.net-label`) open their note's window when pressed, as pressing the node does
  (`select`), and show it under the hand (a red edge). Only there: not on the one network, not seeing
  every accord, not on a journey, not in combinations (`pressable` in `chrome()`; a name is
  `is-on` while it is). The list stays `aria-hidden` — the search is the way to a note by the keys.
- **The page is named beside the Menu**, as every other page is: *Note Library*, in the chrome's
  mono with a rule before it (`.page-where`, in the page's own markup; the dark page's own `--line`
  and `--muted` make it light).
- **The pyramid is said** under its heading in every note's window, in the owner's words
  (`.net-note-explain`), with a note on the site or without.
- **A drag turns it a quarter as far** (`DRAG`, 0.0056 → 0.0014 radians a pixel), and its fling with
  it, since the fling is measured from the drag. **The wheel's zoom is unchanged**: "the movement" is
  read as the turning, the thing a hand moves; a pinch is the fingers' own distance and also as it was.
- **A variation's line says *when compared to*** where it said *against* (*Bourbon vanilla* … *WHEN
  COMPARED TO VANILLA*, in the window's mono capitals; `tellVariation`).

### How to test it

`tests/note-library.spec.js`: **`a drag turns it freely, any way, a quarter as far as it did`** (a
300px drag turns it 0.3 to 0.7 of a radian, longer drags still turn it round and tip it over — it was
`a drag turns it freely, any way`, and needed only 300px); **`at an accord, a note's name pressed
opens its window`** (none pressable as one network or seeing every accord; at Floral, a name pressed
is that note's window — pressed where it is, since a name drifts as its network turns); **`every
note's window says what its pyramidal distribution is`**; **`the Note Library is named beside the
Menu`**. With motion turned off, a drag of 160px still turns it (now more than 0.15 of a radian). And
**`NetScene.filler`**, which finds a filler to press and find that nothing answers, keeps clear of the
names as well as the notes now: in the full run one stood under *Caramel*'s name, and the press opened
Caramel — the name doing what it should.

## 2026-10-03 — the filler read again before it is pressed

Nothing on the page changed. In the full run of 2026-10-03 (forty-five minutes, the machine under
load) **`once apart, a note pressed opens its own window …; a filler never answers`** pressed a
filler it had found 600ms before, and by then the network had turned enough to bring *Pistachio*
onto that spot, which opened. On its own it passed twice. The test now asks `NetScene.filler` again
just before the press, so the spot is the one the filler is standing on at that moment.

## 2026-10-05 — the bond and a note pointed at, read off the moment

Nothing on the page changed. On 2026-10-05 the machine the suite runs on drew the library slowly
enough that **`combinations: …`** failed every time, alone and on the version then live, in the
same way as the filler above — the network turning between two readings:

- **The bond** was compared with the two tags it joins, read three calls apart, and the network had
  turned 3 to 4 pixels between them (the test allows 3). The tags, their lines and the bond are now
  read in **one** call, off one frame.
- **A note pointed at**: read, then the pointer sent to it, and by its arrival the note had gone 15
  to 20 pixels on — it answers within 7. Read again and pointed at again, it was always gone. The
  pointer's move is now made **in the same moment** the note is read — the `pointermove` the page
  itself listens for, at the note's place then — tried again for up to twelve seconds.
- It and **`the arrows on the left pull out …`** took three minutes and more on that machine, their
  limit; they have five now.

Both passed twice, alone and together.

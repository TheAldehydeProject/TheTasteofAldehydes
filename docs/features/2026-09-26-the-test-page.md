# The test page, and the network on it
Date: 2026-09-26
Files touched: `works/test-page.html` (new), `network.js` (new), `notes-data.js` (loaded, since
2026-09-27), `style.css` (`.network-page`,
`.net-*`, and the dark `--chrome-ground` list), `nav.js` (`SITE_LINKS`), `search-page.js`
(`PAGES`), `tests/test-page.spec.js` (new), `tests/menu.spec.js`, `tests/pages.spec.js`,
`tests/mobile.spec.js`, `CLAUDE.md`. For two rounds the same night: `tree.js`,
`tools/tree-cloud.mjs`, `images/Test-Page/` and `image-js` in `package.json` — all taken out
again.

**Since the evening of 2026-09-27 the page carries the Note Library in three dimensions** — see
[the last section](#2026-09-27-later--the-note-library-in-three-dimensions). The one network, and
then the five, described first below are gone from the code; they are kept here for the
reasoning, as the site's reports keep what was replaced.

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

# The test page, and the tree made from its photograph
Date: 2026-09-26
Files touched: `works/test-page.html` (new), `tree.js` (new), `tools/tree-cloud.mjs` (new),
`images/Test-Page/` (new: `tree.jpg`, `tree-cloud.bin`, `tree-cloud.json`, `README.txt`),
`style.css` (`.tree-*`), `nav.js` (`SITE_LINKS`), `search-page.js` (`PAGES`), `package.json`
(`image-js`), `tests/test-page.spec.js` (new), `tests/menu.spec.js`, `tests/pages.spec.js`,
`tests/mobile.spec.js`, `CLAUDE.md`

What changed: A new page, **Test page**, last in the Menu, designed for a laptop: blank but for
the owner's photograph of a tree **made into three dimensions** — a cloud of the photograph's own
coloured specks, every one a pixel of the picture stood at the depth it has in the scene, the
ground round the tree kept and the background left out. It **opens as the photograph**, from
exactly where it was taken; draws back; and turns all the way round, slowly on its own or by a drag
(the wheel brings it closer). Ten **labels** come out of it on leader lines.

The owner, 2026-09-26:

> add a new page to the whole site, and make it completly blank. this will be a test page. On this
> test page, I want you to take this tree: picture 1; and make it into a 3D render, I want it to be
> made mechanical, but i want it to keep some of its coours, so you would have areas of green and
> brown. I want it to be fully made 3d so you can rotate it. From this tree in different areas, i
> want there to be labels that come out of it.

> additionally, make the tree translucent. render the ground with it, but not all of the background

and then, of the first version, built as a machine:

> for now leave the phone be, just design the test page for the laptop. The tree, i want you to take
> the image as is and make it into a 3d one, not recreate it. i want the tree as is to be made into
> a 3d tree.

Asked how: **a cloud of coloured specks** (rather than a solid photo surface), turning **all the
way round** (rather than part way), keeping **the labels** — and neither the translucency nor the
mechanical touch. Asked to use `image-js` (`npm install image-js`) for the work on the picture.

## The tree is the photograph

`images/Test-Page/tree.jpg` is the owner's photograph as they sent it. `tools/tree-cloud.mjs` reads
it with image-js and writes **one speck for every 1.6 pixels each way** — about 213,000 — into
`tree-cloud.bin`: for each, where it stands (three whole numbers, in thousandths of a metre) and its
colour (three bytes, the pixel's own). `tree-cloud.json` says how many, where the photograph was
taken from, and where each label comes out of the tree. `tree.js` only reads the two and draws them
as points. **The site never runs the tool**; it was run once, and is run again only to change the
tree.

A photograph does not say how far away anything in it is, so the tool works it out from **a model
of the scene, traced off the picture itself**:

- **The camera** that took it: the picture's middle, how wide it sees (`F`, 760px), how far it
  looks down (`PITCH`, 30°), how high it stood (`EYE`, 1.6). Every pixel is a ray out of it.
- **The ground**: a floor, level in front of the trunk and **rising behind it** (`SLOPE`), as the
  photograph's slope does. A pixel of the ground is where its ray meets it; anything green on it
  stands a little off it, as leaves do.
- **The trunk**: an upright **column** as wide as the picture shows it at each height, round a
  straight axis (`AXIS_U`), standing behind the front of its flare (`TRUNK_FOOT`). Its **far
  side**, which the photograph cannot show, is given the same pixels a little darker — so it can
  be turned all the way round and still be a trunk. At its foot the column is kept to the width of
  a flare (`FLARE`); what the outline holds beyond that is **the flare** running out into the
  roots, a surface sloping from the trunk down to the ground. It thins out towards the top of the
  picture, where the photograph stops.
- **The roots** (`ROOTS`): **tubes** along lines traced down each one, every point of the line
  with how wide the root is there (px) and how high its middle runs off the ground — the great one
  **arching** over its hollow. A pixel of a root is where its ray meets the tube; the far side of
  the tube, where it stands clear of the ground, is given the same pixels a little darker.
- **The stones** (`STONES`): low domes.
- **The soil the photograph never shows** — under the roots and the stones, and behind the foot
  of the trunk — is filled in with colours taken from the open soil in front (`SOIL`), so turning
  it does not open white holes in the ground.
- **What is not kept**: the foliage above the ground and the second tree behind (`SKY`), and the
  ground further from the trunk than a patch round it (`KEEP`) or near the photograph's own sides
  and foot (`EDGE`) — each thinning out rather than cut, so the ground is a patch with a soft edge
  and the rest of the background is gone.

`TREE_DEBUG=1 node tools/tree-cloud.mjs` colours every speck by what it was taken for (ground,
root, trunk, flare, stone, filled-in soil) instead of by the photograph, which is how the model was
checked; run it again without to put the colours back.

## Seeing it

It **opens exactly where the photograph was taken from** — the camera's own place, looking the same
way down (`camera` in the JSON) — so at first it is the photograph, in specks. Then it **draws
back** (`BACK`, to 1.6 times as far, between 0.7 and 2.1s: `DRAW_BACK`) to leave the labels room,
and after 2.6s (`REVEAL`) it begins to **turn round the trunk**, slowly (`TURN_RATE`), all the way
round. A drag turns it and tips it (`PITCH`); it carries on turning on its own a little after it is
let go; the wheel brings it closer. Seen from behind it shows the front again, mirrored — which is
what the owner chose, knowing a photograph has no back.

## The labels

The words are in the page — one `<li class="tree-label">` each, its number, its name and a small
line under it — and **where on the tree each comes out of** is named by its `data-part`: `trunk`,
`flare`, `arch`, `hollow`, `leg`, `upper`, `cut`, `stone`, `fern`, `floor`, points worked out by the
tool from a pixel of the photograph each (`LABELS`) and kept in the JSON. The words are mine,
plainly naming what is there, and are the owner's to rewrite.

Each frame, every point is found on the window; its label stands to the side of the tree it is on,
in a column clear of it (`Math.min(W * 0.34, 470)` from the middle), kept at least 38px from the
next and on the window; a leader line runs from a small open square on the point, slanting to an
elbow and then level to the name. A label whose point has turned away goes faint — the trunk's
facing out from its axis, everything lying on the ground facing up. On arrival the lines draw out
one after another.

## Why / key decisions

- **Specks, not a surface**: the owner's choice, and the site's own language. It also forgives
  what a single photograph cannot know better than a surface would.
- **Traced, not estimated by a machine-learning model**: a depth model needs downloading and a
  library the site does not otherwise use; the owner asked for image-js instead. Tracing is also
  something the owner can correct: every line of the model is a few numbers in the tool.
- **Made once, read by the page**: the page stays plain JavaScript with no build step; the
  1.9 MB cloud is a file like a photograph. `image-js` is in `package.json` only for the tool.
- **Three.js r128** from the same address as the home page's map, so the tests' local copy
  answers it too. It draws points, and writes no shader of its own.

## What was tried and was wrong

- **The machine** (the first version, the same night): the tree **built** rather than taken from
  the photograph — a faceted trunk in eight flanged sections with six green sap conduits seen
  through it, jointed roots with collars ending in anchors (one arching on a strut), nine tiers of
  needled boughs and a leader, all translucent with their edges drawn, on a painted patch of ground
  ruled round as a specimen, with labels such as *Crown array* and *Sap conduits*. The owner:
  "take the image as is and make it into a 3d one, not recreate it". None of it is in `tree.js`.
- **The picture came out mirrored** at first: looking along +z, three.js's right is −x. The tool
  turns z round.
- **The ground flat all the way back** stretched the far roots into planks and put the slope
  behind the trunk far away; it rises behind the trunk now.
- **Roots as raised strips** (each pixel lifted by the root's thickness) were round seen from the
  front and flat planks seen from the side, the ones up the slope worst; they are tubes now.
- **The trunk as wide as its outline all the way down** made a great bowl of its foot, the roots'
  first spread included; the column is kept to a flare's width there.
- **Nothing where the photograph could not see**: turned, the ground had a white hole behind every
  root and the trunk. The soil is filled in.

## How to test it

`tests/test-page.spec.js`:

- **`the tree is drawn in the photograph's green and brown, on its ground and nothing else`** —
  read off a screenshot: thousands of green pixels and thousands of brown, the window's corners
  and edges the page's own paper, no heading or writing.
- **`labels come out of the tree to its parts`** — the ten, in order, each with a leader line drawn
  all the way out, most plainly there, every one on the window and none over another.
- **`it opens from where the photograph was taken`** — a cloud of over 100,000 specks; at first
  looking exactly the way the photograph's camera did; turning once it has been the photograph a
  while.
- **`a drag turns the tree, and its labels go with it`**.
- **`without its cloud the page says so, and is otherwise blank`** and **`without its 3D library
  …`**.
- **`the test page with animation turned off › the tree stands still, its labels simply there, and
  still turns by hand`**.

It is also in `pages.spec.js`, `mobile.spec.js` (nothing wider than a phone — the page is not
designed for one yet, at the owner's word) and `menu.spec.js` (last in the Menu).

## Known issues / TODO

- **Not designed for a phone yet**, at the owner's word ("for now leave the phone be").
- **The photograph is not credited**: where it came from is not known. The site credits pictures
  where they are used; a line can go at the foot once the owner says whose it is.
- **The model is a first answer**: the owner will have notes on how it turns, how deep things
  stand, and what the labels say. Each is a number or a traced line in the tool.

# The test page, and the network on it
Date: 2026-09-26
Files touched: `works/test-page.html` (new), `network.js` (new), `style.css` (`.network-page`,
`.net-*`, and the dark `--chrome-ground` list), `nav.js` (`SITE_LINKS`), `search-page.js`
(`PAGES`), `tests/test-page.spec.js` (new), `tests/menu.spec.js`, `tests/pages.spec.js`,
`tests/mobile.spec.js`, `CLAUDE.md`. For two rounds the same night: `tree.js`,
`tools/tree-cloud.mjs`, `images/Test-Page/` and `image-js` in `package.json` — all taken out
again.

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

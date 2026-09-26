# The test page, and the mechanical tree
Date: 2026-09-26
Files touched: `works/test-page.html` (new), `tree.js` (new), `style.css` (`.tree-*`), `nav.js`
(`SITE_LINKS`), `search-page.js` (`PAGES`), `tests/test-page.spec.js` (new), `tests/menu.spec.js`,
`tests/pages.spec.js`, `tests/mobile.spec.js`, `CLAUDE.md`

What changed: A new page, **Test page**, last in the Menu: blank but for a tree drawn in three
dimensions from the owner's photograph — a conifer on its great roots over a forest floor — **built
as a machine is**, translucent, in the photograph's browns and greens, standing on a patch of its
own ground that fades out into the page. It turns slowly on its own and by a drag (the wheel, or a
trackpad's pinch, brings it closer). Ten **labels** come out of it, each a leader line from a point on the tree
to its name.

The owner, 2026-09-26:

> add a new page to the whole site, and make it completly blank. this will be a test page. On this
> test page, I want you to take this tree: picture 1; and make it into a 3D render, I want it to be
> made mechanical, but i want it to keep some of its coours, so you would have areas of green and
> brown. I want it to be fully made 3d so you can rotate it. From this tree in different areas, i
> want there to be labels that come out of it.

and, straight after:

> additionally, make the tree translucent. render the ground with it, but not all of the background

## The tree

Everything is built in `tree.js`, out of the photograph's parts, and **seeded**, so it is the same
tree every time.

- **The trunk**: a faceted column (ten facets, a lathe of `PROFILE`) widening into **the root
  flare** at its foot, in eight sections with a **flange** between each, bolted. Inside it, seen
  through it, **the core** and six green **sap conduits** winding up it from the roots — the
  translucency is what lets the machine be seen working.
- **The roots** (`ROOTS`): nine, sprawling over the ground as the photograph's do, each **jointed
  like an arm** — eleven pipes tapering along a curve, a collar at every other joint — and each
  ending in an **anchor**, a spike driven down with a plate on the soil round it. The front-left
  one **arches** over a hollow on a **strut**, as the photograph's great root does; the one to the
  front-right has a **knuckle**; two put out a lesser root. Which way each leaves is in degrees
  round the trunk, 90 towards you and 180 to your left.
- **The crown**: nine tiers of **boughs**, fewer and shorter up the tree, each a drooping rib
  carrying a tapered green blade with needles hanging off both sides — a spruce drawn bough by
  bough — and **the leader** standing out of the top with a green tip.
- **The ground**: a patch of the forest floor, painted on a canvas — soil, needle litter, moss
  towards its edge, darker round the trunk's foot — heaved up round the trunk and rising gently
  behind, and **faded out at its edge** into the page, so the ground is drawn and the rest of the
  background is not. A ruled ring round it, ticked every ten degrees, measures it as a specimen.
- **The stones** and **the ferns** off the photograph: six stones, and seven ferns of arching
  fronds with their leaflets in pairs.

**Translucent**: every part is a material at a third to three quarters opacity, both its sides
drawn, with **its edges drawn over it** in a darker line — which is most of what makes it read as
machined. The pieces are merged by what they are made of (`bins`), so a few hundred pieces are a
dozen things drawn.

**The colours**, off the photograph: the reddish bark (`BARK`), the greyer root tops (`ROOT`), a
darker metal for the flanges, collars, anchors and boughs, the spruce's two greens, the ferns'
lighter one, the grey stone and the soil.

## The labels

The words are in the page — one `<li class="tree-label">` each, its number, its name and a small
line under it — and **where on the tree each comes out of** is named by its `data-part` and kept in
`tree.js` (`ANCHOR`): `leader`, `crown`, `trunk`, `sap`, `flare`, `arch`, `anchor`, `stone`,
`fern`, `ground`. The owner can change the words, or take a label off by deleting its line, without
touching the script. The words are mine, not the owner's — part names in the manner of a drawing's
callouts — and are theirs to rewrite.

Every frame, each point is found on the window; its label stands to the side of the tree it is on,
in a column clear of the tree on a wide window, kept at least 38px from the next (`LABEL_GAP`) and
on the window; a leader line runs from a small open square on the point, slanting to an elbow and
then level to the name. A label whose point has turned away from you goes faint (to 0.28), which
is how the tree's far side reads as behind it. On arrival the lines **draw out** from the tree one
after another (`LABEL_IN`, `LABEL_STEP`, `LABEL_DRAW`), the names coming up as each arrives. On a
phone the names are smaller, lose their second line, and stand at the window's edges.

## Why / key decisions

- **Three.js r128, from the same address as the home page's map**, so the tests' local copy
  answers it too. The tree writes no shader of its own — it uses the library's standard materials —
  so the warning about `node-scene.js`'s shader does not apply; a WebGL failure here leaves the
  page blank rather than wrong, and without the library at all the page says so in one line.
- **Built rather than modelled**: there is no model file. Every part is made from the library's
  own shapes, which keeps the site free of a build step and of binary files, and keeps the tree
  seeded and the same.
- **Mechanical, not robotic**: flanges, collars, bolts, anchors, conduits and a ruled plate — the
  language of a technical drawing, as the rest of the site speaks — rather than gears or lights.
- **The page is blank**: no heading, no writing; the Menu, the tree, its labels, and a small hint
  at the foot (*Drag to turn it · scroll to come closer*) that goes once it has been turned.
- **In the Menu, not on the map**: the owner asked for it on the site; the map's pages are theirs
  to choose.
- **It is in the search's manifest**, as every page is; there is nothing in it for the search to
  find but its name.

## How to test it

`tests/test-page.spec.js`:

- **`the tree is drawn in green and brown, on its ground and nothing else`** — read off a
  screenshot: thousands of green pixels and thousands of brown ones, and the window's corners and
  edges the page's own paper; no heading or writing on the page.
- **`labels come out of the tree to its parts`** — the ten, in order, each with a leader line drawn
  all the way out, most plainly there, every one on the window and none over another.
- **`a drag turns the tree, and its labels go with it`** — turning slowly on its own; a drag turns
  it more than a radian, the hint goes, and the points the labels come out of move with it.
- **`without its 3D library the page says so, and is otherwise blank`**.
- **`the test page with animation turned off › the tree stands still, its labels simply there, and
  still turns by hand`**.

It is also in `pages.spec.js` (loads cleanly, with the Menu), `mobile.spec.js` (nothing wider than
a phone), and `menu.spec.js` (last in the Menu).

## Known issues / TODO

- **A first answer.** The owner will have notes: how mechanical, how translucent, which parts, what
  the labels say.
- The photograph's second tree, behind on the right, is left out: it is background, and the owner
  asked for the ground and not the background.

# The thread, and the seamless handover on the way back up

Date: 2026-09-11 (the repository's first commit), last worked on in `6530c5e` the same
day. Migrated from CLAUDE.md on 2026-09-17.

Files: `thread.js` (~290 lines), `index.html`, `style.css`,
`tests/leaving-the-map.spec.js`

## What it is

`thread.js` draws the single line running down all three slides of the landing page.
`TRANSITION` at the top selects between two finished treatments of its final leg
(`"dissolve"` / `"fork"`) — **both are maintained, so keep both working.** The harder half
of this file is the handover coming back up: the line that `landing.js` reforms during the
collapse and the thread's own leg below the slide-2 sentence are the same line in the same
place, and the whole point is that you cannot see one become the other.

## Why / key decisions

Three things make that handover invisible, and each was a visible seam before:

- **Never set `style.opacity` on a leg of the thread — it does nothing.** Every leg carries
  the `thread-in` arrival animation, whose fill is `both`, so it keeps hold of `opacity` for
  the life of the element and outranks anything set on the element directly. Fade a leg
  through `stroke-opacity` (`legFade`) instead. This is why the dissolving leg used to stay
  on screen right through the collapse, reading as a dotted line competing with the solid
  one being drawn out.
- **The reforming line comes back to the thread's own weight and column as the page
  travels**, keyed off how much of the map is still on screen. It is drawn heavier
  (`REFORM_INK`) and anchored to the sphere while it is alone on the page, and is already
  `THREAD_INK` in the thread's own column by the time the two swap — so the swap itself is
  not something you can see.
- **It stops at `top0`**, the same point below the slide-2 sentence that the downward leg
  starts from, rather than running to the top of the window the whole way. And the leg
  *above* the sentence is left alone entirely: it is off screen for the whole collapse, so
  fading it bought nothing and only made it snap back on arrival.

`thread.js` reads `__p23`, `__mapReadout` (for `collapse` and the hub to draw the reforming
line from) and `__exit`. It does **not** write `__p23` — `paper.js` does, whatever
`README.md` says.

## How to test it

```bash
npm test -- tests/leaving-the-map.spec.js
```

Two of its tests are regressions for this exact seam: the reforming line running across the
slide-2 sentence, and the line being visibly swapped out for the thread. Both must keep
passing.

By hand: on slide 3, scroll up out of the map and watch the point just below the slide-2
sentence as the page arrives — there should be no change of weight, no jump in position and
no second line. Then flip `TRANSITION` to the other value and check that treatment still
works.

## Known issues / TODO

None outstanding. Keep both `TRANSITION` treatments working; neither has been retired.

## 2026-09-30 — out of the foot of the dark slides

The formula slide stands between the title and the sentence since 2026-09-30, and the title fades
where it stands. So the first leg **leaves from the foot of the dark stage** the first two slides
stand on (`#aldehyde-stage`), not from under the title: from under the title it would have run
down through the formula. The sentence and the map are read by name (`#slide-2`, `#slide-3`), not
as the second and third slides. See [the formula slide](2026-09-30-the-formula-slide.md).

## 2026-09-30, last — switched off, and kept

The owner (2026-09-30): "PRESERVE PAGES 3 AND 4 IN THE CODE, BUT EXCLUDE THEM FROM THE WORKING VERSION OF THE PROJECT ... I WANT THIS CHANGE TO BE REVERSIBLE". The sentence and the map are **switched off and kept whole**: their markup (and the paper's) in `<template id="map-slides">` in `index.html`, and `node-scene.js`, `paper.js`, `thread.js` and `extras.js` not loaded on the page. **`MAP_SLIDES`** at the top of `landing.js` brings them all back after the home page's stage, exactly as they were; **`?map=on`** on the address shows them without changing anything, and every test of them runs that way (`HOME_WITH_MAP` in `tests/helpers.js`). See [the stage alone](2026-09-11-the-landing-slides-and-exit.md#2026-09-30-last--the-stage-alone-five-stages-and-pages-3-and-4-kept-switched-off).

It is loaded by `landing.js` then, perhaps after the page has finished loading, so it measures itself at once if it has (`document.readyState`), rather than waiting for a `load` that has come and gone. It still leaves from the foot of the stage, which is the foot of the dark now at the stage's end.

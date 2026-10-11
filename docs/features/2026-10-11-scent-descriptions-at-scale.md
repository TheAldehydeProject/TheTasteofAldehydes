# Scent Descriptions at three hundred houses and a thousand fragrances
Date: 2026-10-11
Files touched: `contact-sheet.js`, `fragrance-line.js`, `chamber.js` (one comment and one argument, to
stay word for word the reading `fragrance-line.js` has), `house.js`, `style.css`,
`scent-descriptions/index.html`, `individual-fragrances/individual-fragrances.html`,
`tests/scale.spec.js` (new), `tests/contact-sheet.spec.js`

What changed: Scent Descriptions is built to stay smooth at the size the owner expects it to grow
to — about three hundred houses on the Houses view and a thousand individual fragrances. The Houses
view lays out only the houses near the front and fetches only their pictures; the Fragrances table
lays out, fades and fetches only what is near the screen, and shows each picture from a small copy
made on a thread of its own; the individual fragrances page fetches its pictures as they are
reached and works out where the reader is without measuring every part. Nothing looks different.

## Why / key decisions

### What the owner asked

"I also want you to make this page run smoother. "Houses" is going to house approximately 300
houses and 1000 fragrances in the individual fragrances section. it needs to run smoothly. make
sure it does please."

### How it was measured

The pages as they are, made bigger: the twelve houses copied round to three hundred (each copy's
picture its own address, `?n=` on it, so the browser fetches and decodes each as a picture of its
own), a thousand rows in the Fragrances table, and the individual fragrances copied round to a
thousand parts. The same builder is in `tests/scale.spec.js` (`bigSheet`, `bigIndividual`), which
serves them in place of the real pages. Measured at 1440 × 900, two pixels to a point, on the test
machine — four cores and no graphics card, so everything a laptop's graphics card would paint is
painted by the processor here: these are a floor.

### The Houses view (`contact-sheet.js`)

- **Only the houses near the front are laid out** (`LIVE_MARGIN`, `reach()`, `place()`,
  `placeOne()`, `putAway()`): each frame works out which houses are within a window's height of
  the front, places those, and puts every other one **out of the page's layout** (`.away`,
  `display: none` — in `style.css` next to `.sheet-frame.behind`). It placed all of them on every
  frame, three hundred transforms and labels, and laid the page out again each time. **A view of
  a few dozen houses or fewer** (`ALL_UNDER`, 24) lays every one out as it always did — today's
  twelve among them, so every number stands on the axis the whole way down it, as a test of the
  axis asks — and only past that are those out of reach put away.
- **A style is written only when it changes** (`put`, with what was last written kept for each
  house, `was`, `markWas`). Every number on the axis that is laid out is placed whether or not it can
  be seen, as it always was (written only once it had been seen, those further down stood unplaced
  in the window's corner, and a test of the axis said so).
- **A house's spoke is made when it is first needed** (`spokeOf`), with its seed off its number so
  it is the same spoke whenever it is made; the **flow specks** down the axis wrap round where you
  are (`FLOW_REACH`) rather than running the length of three hundred houses; **the arrival** brings
  out the houses within `EMERGE_FAR` of the one it opens at in turn, and the rest at once.
- **Every house's picture is `loading="lazy"`** (the comment at the head of the page says to keep
  it on a new house), so only those near the front are fetched. And **while the script is on its
  way only the first twelve houses are laid out** (`html.js-coming .sheet > .sheet-frame:nth-of-type(n + 13)`):
  the plain grid of every house was laid out under the hidden page in that moment, and the
  browser had begun on a hundred and twenty pictures before the script put them away. Without the
  script the class is taken off at `load` and the grid is every house again.

### The Fragrances table (`fragrance-line.js`, `style.css`)

- **Each item is found by a map** (`byItem`), the search's words are made once (`f.text`), and
  the search **writes `hidden` only where it changes**.
- **What the table measures waits for the next frame** (`settleSoon`), so sorting or searching
  never writes the page and then reads it in the same moment.
- **The scale's ticks are watched, not measured** (`watch`, an IntersectionObserver on the table's
  own box), and **only the items in sight fade** (`sight`, `in-sight`): an item off the screen
  comes and goes at once, so arriving or changing the layout fades a screenful rather than a
  thousand items and five thousand labels.
- **Only what can be seen is laid out** — `content-visibility: auto` on every item, standing
  meanwhile at about its own size (`contain-intrinsic-size`: a row's 34px, a box's 236, a card's
  380, and each one's own once it has been seen). This took the pause on the way in from the houses
  from about half a second to under a fifth, and changing to cards from a freeze of a second and a
  half to nothing to notice.
- **Pictures are asked for as their items come near** (`near`, 900px either side of the screen),
  and **never while the table is a list**, which shows none — they are asked for when boxes or
  cards are chosen (`askNear`).
- **A picture is made ready off the page altogether** (`MAKER`, `ready`, `makerOf`): a worker — a
  thread of its own, written into the script and started from it — fetches the file, decodes it,
  makes the small copy the reading reads (72px), and, where the picture is larger than a box or a
  card ever shows it, **a copy `SHOW_SHORT` (900) device pixels on its shorter side**, which is what
  the box shows. A box was showing the photograph it was made from, up to two thousand across,
  decoded and scaled down every time it was painted. Three are made at once (`READY_AT_ONCE`); a
  picture already small enough is shown from its own file. **Where there is no worker** (or it
  fails, or `OffscreenCanvas` is missing), the picture is shown and read as it was, through
  `shrink`, which decodes from the file off the page's thread rather than from the picture on it.
- **The pictures that arrive together are placed a few a frame** (`readSoon`, `READ_EACH`).

### The individual fragrances page (`house.js`, `individual-fragrances.html`)

- **Every picture is `loading="lazy"`** and decoded off the page's own thread (`decoding="async"`
  where `house.js` makes one). The comment at the head of the page says to keep it on a new
  fragrance.
- **Where the reader is** is found by halving (`firstWhere`): the scale's reckoning measured every
  part on every scroll; it measures about ten now, and inks in only the ticks between where it was
  and where it is.
- **A part's measurements for opening it are taken when it is first opened** (`pads()` inside
  `measured()`), not for every part as the page loads.
- **The parts' arrival** is worked out from the scroll (`arriveInView`, `lookSoon`), the same 8%
  rule and stagger as before, rather than an observer on each of a thousand parts.

### Found on the way: the page stopped stepping back

A rule written for Outsider's dark view on the Houses view (the round before this) had been put
**in the middle** of the rule that steps the page back when a house is pressed (`body.sheet-leaving
…`), and for that round the page did not step back at all — the test looked only at the house beside
the pressed one, which is faint anyway. The dark view is gone this round, and the rule is whole
again; the test now looks at the house beside it, the page's name, the Menu and the way round.

### What was tried and not kept

- **`content-visibility` on the individual fragrances page's parts**: it halved the page's load
  (1.8 → 0.8s at a thousand parts) and made scrolling no quicker, and an address at one fragrance
  (`#part-500`) landed 36px from where it does now, the parts above it standing at a guessed height.
  Left as it was.
- **Making the small copy from the picture on the page** (`createImageBitmap(img)`): it decodes on
  the page's own thread — 2.9s of a thousand pictures — where made from the file it is done on
  another (84ms).
- **Answering the search a frame later**: it broke the search's answering as it is typed; the
  search answers at once, and only its measuring waits.

### Measured

The version before this round against this one, the same machine, the same session — at three
hundred houses and a thousand fragrances unless it says otherwise:

| | before | now |
|---|---|---|
| the Houses view drawn | 29 s | 3.2 s |
| travelling to the last house | 26 frames a second | 40 |
| crossing to the table, its longest frame | 0.48 s | 0.18 s |
| changing the boxes to cards | a freeze of 1.5 s (2.5 frames a second) | 43 frames a second |
| scrolling the boxes with the wheel | 27–28 frames a second | 30–32 |
| the individual fragrances page, at a thousand parts, loaded | 3.7 s | 1.0 s |
| scrolling it | 51 frames a second, its longest 83ms | 48, its longest 33ms |
| today's twelve houses, the Houses view drawn (its arrival is most of it) | 3.4 s | 2.9 s |

Measured earlier the same day, on the way: the blocking time over a whole visit — arriving,
crossing, scrolling, searching — from about 15 seconds to about 3.4; twelve characters typed into
the table's search, 1.7 → 1.07 seconds; a keystroke in the Houses view's search, 23 to 92ms.

## How to test it

`npm test -- tests/scale.spec.js` (about forty seconds): **the Houses view at three hundred
houses** — drawn in under twenty seconds, fewer than forty houses laid out and fewer than forty of
their pictures fetched, travelling to the last at more than eighteen frames a second and, there,
the first house away; **the Fragrances table at a thousand** — crossing and scrolling at more than
eighteen, fewer than a hundred and fifty pictures fetched near the top and fewer than two hundred
items fading, **a list fetching no pictures however far it is scrolled**, and the search answering
within two and a half seconds; **the individual fragrances page at a thousand parts** — loaded in
under fifteen seconds, fewer than eighty pictures fetched, scrolled at more than eighteen, and its
reading at the foot counting the thousandth; and **every house's and every individual fragrance's
picture `loading="lazy"`**, read off the markup. The numbers asked for are well under what was
measured, so a busy machine does not fail them; what they catch is a change that lays out, fetches
or draws everything again.

Two things about how they measure. **The frames are counted in the page**, the page doing the
scrolling or the pressing itself (`framesWhile`): every action the test takes has the page
photographed whole for Playwright's trace, and on a page of a thousand parts that, not the page, is
what was measured (eight frames a second against thirty-two). And the spec turns the trace off, as
`om-and-the-tribe.spec.js` does.

`npm test -- tests/contact-sheet.spec.js --grep "steps the page back"` is the stepping back.

By eye: `/scent-descriptions/`, the way round's double arrow down, the Fragrances, the three ways of
showing them; the page at its real size is checked by every other test of it.

## Known issues / TODO

- **Measured on a machine with no graphics card.** On a laptop the painting is the graphics card's
  and all of it is quicker; on a phone the pictures cost more. If the boxes stutter on a phone,
  `SHOW_SHORT` smaller is the knob.
- **Scrolling the boxes with the wheel is only a little quicker**: what is left is the browser
  painting the boxes as they come in, and each new picture arriving.
- **The individual fragrances page's own lazy pictures** cost the browser a check on every frame
  for every picture not yet fetched (two thousand at a thousand parts); it is the browser's, and it
  scrolls at 48 frames a second.
- **The small copies are kept for the visit** (a blob each, tens of kilobytes); a thousand looked at
  is a few tens of megabytes. They are let go with the page.

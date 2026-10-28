# The house drawings faint behind the words
Date: 2026-10-12
Files touched: `nav.js` (`window.Writing`), `adar.js`, `abstraits.js`, `qimu.js`, `outsider.js`,
`ataraxia.js`, `tombstone.js`, `lost-tribe.js`, `style.css` (`.house-credit`), `tests/writing.spec.js`
(new)

What changed: Where a house's drawing used to stand behind the writing, it now goes faint behind
the words — about a third of itself — and stays as it was in the gaps between paragraphs. On a
phone that is ADAR's void, Les Abstraits' armoire, drip and beaker, Qimu's staves, Outsider's door
and its light, Ataraxia's bands, Tombstone's stones and Lost Tribe's specimens, pollen, leaves and
birds. On a computer it is only ADAR's void and Outsider's light, the two that reached the writing
there. And the picture credit at the foot of every house now stands in front of the drawing, as the
rest of the writing always did.

## Why / key decisions

### What the owner asked

"flag any overlap with tect for in-house page in SD, and return to me with options as what to do.
Do that with all houses." Every house was measured (see [the phone
report](2026-09-21-the-site-on-a-phone.md#2026-10-12--scent-descriptions-less-cluttered-on-a-phone))
and four options were put to the owner: fade the drawings under the words, move them out of the way,
turn them off on a phone, or leave them. They chose **"Fade them under the words"** for the phone,
**the same for ADAR and Outsider on a computer**, and **"Yes, in front"** for the credit.

### Why the quiet that was there was not enough

Every one of these drawings already went quiet over the writing — but it asked only *how far across
the window* a thing stood: over the column, or in the margins (`quiet(x)` in each script). On a
phone the writing runs from 24px to 366px of a 390px window, so the whole drawing stood at its
quiet everywhere, and that quiet, behind every line, was still plainly there — a quarter of the
lines ADAR's void passed, half a line's width under Les Abstraits' armoire.

### Where the writing is: `window.Writing` (nav.js)

What was needed was to know where the **words** are, not the column. `nav.js` (which every page
loads before anything that draws) measures every run of words on the page — a Range round each
text node, its box in the page's own coordinates, the runs of one paragraph made one box — and
measures again when the page changes (a resize, a part or fold opening, the fonts, the pictures,
the parts rising into place, a `ResizeObserver` on the body). **Nothing fixed to the window is
writing** (the Menu, a scale's reading, a button in a corner), nor anything hidden or
`aria-hidden`. It measures nothing until a drawing first asks.

A drawing asks one of two ways:

- **`Writing.under(x, y)`** — for a drawing of specks (Ataraxia, Tombstone, Lost Tribe): what is
  left of a speck there, 1 clear of the writing and `KEEP` (0.3) behind it, easing over `FEATHER`
  (24px) at its edge. Read off a grid of 6px squares made again only when the page has moved under
  the window.
- **`Writing.hush(ctx, { regions, keep, feather })`** — for a drawing of lines (ADAR's rings and
  ticks, the armoire, the staves, the door): at the end of its frame, what it has drawn behind the
  writing is taken back to `keep` of itself, in soft steps out to `feather`. **Only inside
  `regions`**, the boxes the drawing actually stands in — the void and its reach, the armoire and
  the drip's strip, the staves drawn that frame, the door and its light — never over the whole
  window, which is the thing CLAUDE.md says never to do. Measured, frames a second with it and
  without on the test machine: ADAR 59 and 60 on a phone, 60 and 61 on a computer; Les Abstraits,
  Ataraxia and Qimu 60 either way.

### Kept as they were, deliberately

- **In the gaps between the writing every drawing is exactly as it was.** Nothing anywhere is
  brighter than before; only what stood behind words is quieter.
- **On a window 700px or wider, Les Abstraits, Qimu, Ataraxia, Tombstone and Lost Tribe do not even
  ask** (`width < 700` in each) — the owner kept them as they were, and there they stand in the
  margins. A test says so.
- **ADAR's haze is left out of the fade**: it is laid *under* everything else at the end of the
  frame (`destination-over`, the hole already cut out of the stamp), which is the same picture as
  drawing it first. Faded with the rest, the edge of the writing showed through the soft glow as a
  straight seam on a computer. It is a tenth of the ink and reads as the room's light.
- **Outsider's light fades over a wider edge** (`feather: 48`): it is a glow, and a narrow edge
  drew the writing's edge through it as a line.
- **Qimu's staves keep more of themselves while the sound is on** (`keep` rising with `heardUp`
  to about two thirds), when they are there to be found and tapped.

### The credit in front

`.house-credit` is `position: relative; z-index: 1`, as the head, the introduction, the parts and
the foot already were. It was the one block of writing on every house that a drawing reaching it
was painted over rather than under — measured on Qimu's, Les Abstraits', ADAR's and Tombstone's on a
phone, and faintly Outsider's on a computer.

### Measured

Lines of writing the drawing still changes (the same measurement as the first audit: more than 3%
of a line's box changed by more than 30 of 765), every part opened, before → after:

| | phone | computer |
|---|---|---|
| ADAR | 93 → 23 | 84 → 24 |
| Les Abstraits | 72 → 11 | 0 → 0 |
| Qimu & Musicians | 63 → 4 | 0 → 0 |
| Outsider | 24 → 12 | 8 → 2 |
| Ataraxia | 23 → 5 | 1 (unchanged) |
| Tombstone | 13 → 3 | 0 |
| Lost Tribe | 4 → 0 | 2 (unchanged) |

What is left is the drawing at a third of itself, faintly behind the letters, which is what was
asked for — "very faint wherever it passes behind writing".

## How to test it

`npm test -- tests/writing.spec.js` (about a minute and a half):

- the writing is found where the words are (ADAR's introduction is writing, every box within the
  window);
- **ADAR's void on a phone and on a computer**: of its plainly drawn pixels (lines and specks, alpha
  over 60), the share behind the writing against clear of it is under half what it is the same
  moment with the fade taken off;
- **Outsider's door on a phone**, at the foot of the page: behind the words under 0.6 of its ink is
  left, and well clear of them (30px from any writing) over 0.85;
- **Les Abstraits, Qimu, Ataraxia, Tombstone and Lost Tribe** ask where the writing is on a phone,
  and never at 1440px;
- the credit stands in front (`position: relative`, `z-index: 1`) on all twelve houses.

By eye: any of the seven houses at 390px wide, a part opened — the drawing faint behind the
paragraphs, whole in the gaps; ADAR and Outsider at 1440.

## Known issues / TODO

- **Grande Parfums' rising specks and Almost Human's rain** cross the writing one speck at a time on
  a phone and were not part of the owner's choice; they were measured under 3% of any line.
- **On a phone the reading in the bottom-right corner** (*03 / 11*, the fragrance's name) stands
  over the last lines of writing on every house — fixed chrome on its own ground, noticed in the
  same audit, and not a drawing.
- **The writing is measured, not watched every frame**: a part rising into place is measured as it
  arrives and again after, so for a moment while it moves the drawing's quiet can sit a few pixels
  off it.

## 2026-10-20 — a shut part's writing is not writing

Found while making Apoteker Tepe's mountain legible: a straight, hard edge ran down the mountain on
every turn, dark on its left and pale on its right. `Writing.measure` reads every run of words with
a Range, and **the browser still measures the paragraphs inside a closed `<details>` where they would
stand** — on a house, a column to the right of each fragrance's picture, as tall as its writing, under
a summary one line high. So since 2026-10-12 every drawing that asks `Writing` had gone quiet over
those columns, where nothing could be read: on a phone mostly, on a computer ADAR's void and Outsider's
light.

`nav.js` now leaves out any text inside a closed `<details>` but its own summary (a fold shut inside an
open part too; a closed part with an open fold inside it is still closed). Opening a part was already
measured, on the `toggle` event, as it opens and once it is open. Nothing is quieter than it was where
words stand; only the empty columns come back.

`tests/writing.spec.js`, *the writing inside a shut part is not counted until it is opened*, on Lost
Tribe: a shut part's summary is writing, its first paragraph — measured where it would stand — is not,
and once opened it is. The other tests open every part first, so they are as they were.
(2026-10-28: on a busy machine the page could still stand at its head when the opened paragraph was
measured, the paragraph under the window and so no writing — it failed under the full suite, the
page's code as it was before and after. The paragraph is brought onto the screen before it is
measured, as the shut one already was.)

## 2026-10-20, last — Apoteker Tepe quiet as Ataraxia is

Apoteker Tepe's mountain asked `Writing` on every width (`KEEP`, a fifth, behind the words). The
owner then asked for it diminished "in a similar way to ataraxia's page", and a solid, coloured
mountain went quiet in paragraph-shaped patches: it is now Ataraxia's own rule, with Ataraxia's own
numbers — the whole column at `QUIET` on a wide window, and on a phone `QUIET` everywhere and
`Writing.under` behind the words — by a veil of the page's paper laid over the whole drawing. On a
phone the veil is made from `Writing.boxes()` once a frame (asking `Writing.under` cell by cell took
28 ms a frame). See [Apoteker Tepe's report](2026-10-20-apoteker-tepe.md). (Since 2026-10-22 there is no 3D mountain on Apoteker Tepe — it was taken out, to be redesigned — and
since 2026-10-27 its ground is a still photograph behind frosted glass, pale everywhere but a window on
the right-ish middle; the words carry a soft halo of the paper there instead of the drawing going
quiet behind them.)

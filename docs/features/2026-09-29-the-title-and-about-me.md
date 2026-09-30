# The title gathering, and About me
Date: 2026-09-29
Files touched: `title.js` (new), `index.html`, `style.css`, `landing.js`, `tools/seo.py`,
`tests/landing.spec.js`, `tests/pages.spec.js`

What changed: The title on the home page's first slide now **gathers** as the page loads — specks
drift in from all over the slide and settle into the letters of *The Taste of Aldehydes*, the
letters come up over them, the specks let go — and then the line under it, **a square** beside it
and the block in the corner come up in turn. **The square opens About me**: the page goes out of
focus behind a sheet carrying the owner's two paragraphs, *About me* and *How the name came to
be*, which come up one after the other.

## What the owner asked

> a square at the title which will blur out the page and bring up a "about me" page (on the same
> page more or less)

> add an animation to the title page for when you load it in; and i want the About me to be
> slightly animated too.

And the two paragraphs, which are on the page **word for word** (`index.html`, `#about`) — the
first under *About me*, the second under *How the name came to be*.

## Why / key decisions

### The gathering (`title.js`, first half)

- **The letters are read where the page lays them out**, word by word, through the browser's own
  measure of each word (`Range.getBoundingClientRect`), drawn onto a canvas off the page, and their
  inked pixels taken as places for specks to land (up to 2,600 on a desktop, 1,300 on a phone). So a
  title that wraps on a phone is gathered as it wraps, and the specks land exactly on the letters.
- **They set off a beat after the one to their left**, so the title fills in the way it is read;
  most come from far off. At 1.29s the letters come up over them (the `title-here` class), and by
  about 2.5s the specks have let go, drifting a little as they fade, and the canvas is gone.
- **Nothing is flashed first and nothing is kept waiting.** The page's `<head>` puts `title-coming`
  on `<html>` (only when motion is allowed), which holds the title, its line and the square back;
  `title.js` takes it off. If the script never runs, or has not got going in time, the stylesheet
  brings them up by itself after three seconds (`title-late`), and the script's own safety does the
  same at 2.6s.
- **The title does not rise while it is gathered.** The old rise on `.title-content` (10px up over
  0.9s) now runs only on a page without `title.js`: a title still moving while the specks read where
  it was set them all ten pixels low, a shadow under the letters. That was the first version.
- **The block in the corner comes last** (`animation-delay: 1.9s`; it was 0.15s), once the title has
  gathered.
- **`?title-at=900`** on the address holds the gathering at that moment, for a picture of it. The
  page is otherwise untouched by it.
- **With motion turned off** there are no specks: the title is simply there.

### About me (`title.js`, second half; `.about` in `style.css`)

- **The square** is a registration mark — a 20px box with a small breathing dot — beside the title,
  its words (*About me*) coming out beside it under the hand. On a phone it stands **under** the title,
  in the middle, with its words always shown (nothing hovers on a phone).
- **The sheet** stands over the page, which goes out of focus behind a pale veil (`backdrop-filter:
  blur(10px)` over the paper, softly); it has a registration tick at two corners, *The Taste of
  Aldehydes* at its head, and the two parts numbered 01 and 02, each coming up a little after the one
  before, its rule drawing out under its heading.
- **Escape, its close, or a press on the page round it** put it away, and the focus goes back to the
  square. The keys stay inside it while it is open (Tab goes round its own close), and **a wheel
  inside it never changes slides** — it scrolls the sheet when the sheet is taller than the window
  (on a phone), and stops there.
- **`landing.js` reads one class on the body, `about-shown`**, so the wheel and the arrow keys do
  not move the slides while it is open — the same guard the Menu and the map's preview have. The
  body's class is `about-shown` and not `about-open`, on purpose: `about-open` is the square's own
  class, and on the body it gave the whole page the square's hover (an ink background) — the page
  turned grey behind the sheet. That was the first version.
- **It is on the body, and so in the Menu's trap**: every child of `<body>` is dimmed by
  `body.menu-open > *:not(...)` and given its transition. `.about` is excluded there, as the notes
  window and the primer's footnote are (see the glossary's *the glitch on the way out*).
- **`[hidden]` needs a rule that outranks the sheet's own `display`**: `.about[hidden] { display:
  none }` is there for it.
- **Centred by the sheet's own `margin: auto`**, not by `place-items: center`: centred that way, a
  sheet taller than a short phone (667px) ran off the top as well as the foot, and its top could not
  be scrolled to. That was the first version.

### The line on slide 2

The owner took *even* out of *even ideas* in the same round: *… will act as a library for
information, interpretations, theories and ideas.* The description written for search engines
(`tools/seo.py`, run again) says the same.

## How to test it

`tests/landing.spec.js`:
- **`the title gathers out of specks as the page loads, and is there within three seconds`** — the
  specks' canvas on the slide at once; the title at full strength within 3.5s, `title-here` on and
  `title-coming` off; the canvas gone; the square up;
- **`with motion turned off the title is simply there`** — no canvas, the title at full strength;
- **`the square at the title opens About me over the page, out of focus`** — the sheet opens as a
  dialog with the owner's words, the square says it is open, the body carries `about-shown`, the
  sheet blurs what is behind it, a wheel over it moves no slide, and Escape, its close and a press
  on the page round it each put it away;
- **`on a phone the square stands under the title, named, and About me fits the screen`**;
- and the corner block's fade test now **waits for the block to arrive, and for `landing.js` to
  hand it to the scroll** (its animation cleared), rather than for a fixed 1.6s, since it arrives
  last — waiting only for it to be seen, the test parked the page while the animation still held the
  block's opacity, and read it unmoved.

`tests/pages.spec.js`, **`the line on slide 2 names the site as its title does`**, reads the line
without *even*.

By eye: open the home page and watch the first two seconds; `index.html?title-at=400`, `…=900`,
`…=1300` hold the gathering still.

## Known issues / TODO

- The sheet's words are the owner's; its heading (*The Taste of Aldehydes*) and its numbering are
  the page's.

## 2026-09-30 — the title in front of the aldehyde, on a dark ground

The owner asked for "a big aldehyde molecule in the very middle" of the first slide (see [the
aldehyde on the home page](2026-09-30-the-aldehyde-on-the-home-page.md)). For one round the
title, its line and the square were **its caption, low on the slide**; the owner then asked for
"the taste of aldehydes to be in front of the aldehyde ... both ... centered", and for the slide
to be the dark ground of the private page the molecule was first drawn on. So now:

- **The title stands where it always stood, in the middle**, in front of the molecule (`z-index`
  over the drawing), **in light ink** — the first slide turns the page's tokens over to the dark
  grey (`.title-slide`) — with **a soft shadow of the ground round its letters** so the glow
  behind never takes them; its line and the square's words are a lighter grey with a stronger
  shadow. The caption layout (`.title-slide:has(.molecule)`) is gone.
- **The gathering specks are drawn in the title's own ink** (`title.js` reads the title's
  colour), so they are light here; they were a fixed near-black, and would have gathered unseen.
- **About me** opens with a veil of the dark ground over the slide (`body.first-slide-dark
  .about.is-open`); the sheet is the paper it always was.
- The title still gathers, the square still opens About me, and the thread still leaves from
  under the title (over the dark slide it is not seen until the second).

# The pages opening quickly, and asking for their scripts by version
Date: 2026-10-13
Files touched: `network.js`, `contact-sheet.js`, `style.css`, `tools/versions.py` (new), every page
(its scripts and stylesheet asked for by version), `tests/repository.spec.js`,
`tests/om-and-the-tribe.spec.js`, `CLAUDE.md`

What changed: The Note Library and Scent Descriptions open far sooner. The Note Library shows its
ground and Menu at once and draws itself after, and its arrows and buttons come in about two
seconds after it opens on any machine — on a slow phone they waited ten seconds or more.
Scent Descriptions draws its first house in about a second and hands over its Menu and buttons
with it — they waited four to five seconds. And every page now asks for its scripts and its
stylesheet by their version, so a browser can never put a new page together with old scripts in
the minutes after the site changes.

## What the owner asked

> also, please make sure that everything runs smoothly. I feel that there are several pages that
> are having issues opening; mainly, the note library and the SD

## What was found

Every page was opened, as a computer and as a phone four times slower, and timed: when its Menu
could be read, how long its script held the page, what it reported as an error. **No page reported
an error.** Three things stood out, all in the two pages named:

- **Scent Descriptions** gave nothing to press for four seconds (nearly five on a slow phone). It
  waited for the page's fonts — up to 1.2 s — before drawing anything; then the axis (0.7 s), the
  helix (0.9 s), the houses one after another; and the Menu, the two buttons and the search came
  in only once the last house was out, fading over another second. Each step was what the owner
  asked for ("first the central line, then the spiral of particles and only then the images ...
  chronologically yet relatively quickly", 2026-09-24); together they read as a page that would
  not open.
- **The Note Library's arrows, its foot and its hint** come in once the network has wired itself
  in (the opening, `LOAD_MS`, 1.9 s) — but that clock was the frames' time, never more than 50ms
  a frame. A machine drawing a few frames a second, as a phone does while it is still compiling and
  uploading the drawing, took ten seconds or more to finish it, and all that while there was
  nothing to press. On the test machine, drawing in software at three frames a second, it took
  thirteen.
- **The Note Library held the page blank** — no ground, no Menu — while it set itself up, which
  it did before the page was first shown: half a second on a computer, a second and a half and
  more on a slow phone. The largest parts were linking every node to its nearest (a million pairs,
  each a call and a lookup), and writing out the twelve hundred sources of the sheet that only
  opens when the centre is pressed.

And one that would make any page fail to open for a while after the site changed: **GitHub Pages
lets a browser keep every file for ten minutes.** In those minutes a browser can take a new page
from the site and the scripts it kept from before — a page the scripts no longer know, or a script
looking for what the page no longer has — and the page stands half drawn, or held hidden (the
`js-coming` hold), until it is reloaded later. That is exactly when the owner looks, just after a
change.

## What was done

### The Note Library (`network.js`)

- **The opening's clock is the wall's** (`LOAD_STEP`, 250ms): a slow frame counts for what it took,
  up to a quarter of a second, so the opening is done in about `LOAD_MS` on any machine; a longer
  gap (a tab put away) is still not a jump. The opening looks the same at any frame rate it was
  already drawn at.
- **It is begun once the page has been shown** (`begin`, after the first frame): the dark ground and
  the Menu are on the screen at once and the network comes up a moment later.
- **The links are worked out on plain numbers** (`linkUp`): every node's place read once into
  arrays, the same sums in the same order — checked to give exactly the same links — at about half
  the cost.
- **The sources' sheet is written when it is first opened** (`writeSources`), and a source's plain
  words read off it when first wanted (a number's title in a note's window).

The network, its opening, every window and every journey are as they were.

### Scent Descriptions (`contact-sheet.js`, `style.css`)

- **The same order, a little over half the time**: the axis 450ms, the helix 550ms, a house 460ms
  coming out, the next 60ms after (700, 900, 560, 85 until now). The first house is out at about a
  second; the last that can be seen at under two.
- **The axis does not wait for the page's fonts**; only the houses do, so their labels do not change
  size under them on the way out — and only until `FONTS_MS` from the start (`housesFrom`). The
  page is laid out again when the fonts arrive.
- **The Menu, the two buttons, the name and the search come in with the houses** (`sheet-named` as
  the first house sets out), over 0.8s (1.1s, after a longer wait, until now).

### Every page: its scripts asked for by version (`tools/versions.py`)

Every `<script src>` and stylesheet a page asks for of its own carries the first ten characters of
the file's fingerprint — `../network.js?v=3f9a1c02b7`. A file changed is a new address, which no
browser has kept, so a page always comes with the scripts written for it. The server ignores what
comes after the `?`. **Run `python3 tools/versions.py` after changing any script or `style.css`**, or
adding a page; running it twice changes nothing the second time. What a script fetches for itself
(Qimu's `qimu-whole.js`, the home page's map scripts with `?map=on`) and `archive/` are left as
they were.

## Measured

On the test machine (a 2.8GHz server core, drawing 3D in software), as a computer (1440 × 900) and
as a phone four times slower (390 × 844):

| | before | after |
|---|---|---|
| Scent Descriptions: the Menu readable, computer | 3.9 s | 1.6 s |
| Scent Descriptions: the Menu readable, phone | 4.9 s | 2.0 s |
| Scent Descriptions: the first house out, phone | 3.5 s | 1.0 s |
| Note Library: the page first shown, computer | 2.9 s | 1.0 s |
| Note Library: the page first shown, phone | 3.0 s | 0.8 s |
| Note Library: its own setting up, computer | 0.48 s | 0.33 s |
| Note Library: its arrows and foot in, at three frames a second | about 13 s | 5.6 s |

On a phone that draws the library with its own graphics chip, the last is about two seconds.

## How to test it

- `npm test -- tests/repository.spec.js` — **`every page asks for each of its scripts and its
  stylesheet by the version it is now`**: every page's own scripts and stylesheet, each asked for by
  the fingerprint of the file as it is; fails until `tools/versions.py` is run after a change.
  *The site needs no build step* now reads an address without its version.
- `npm test -- tests/contact-sheet.spec.js` — **`first the axis, then the helix, and only then the
  houses, in order`** still holds the order; the chrome's tests still find it hidden as the page
  arrives and shown once it has.
- `npm test -- tests/note-library.spec.js` — the opening still wires itself in before the arrows
  come, the sources' sheet still lists every source with *Me.* first.
- By hand: open Scent Descriptions and the Note Library on a phone. Something to press within about
  two seconds.

## Known issues / TODO

- The test machine has no graphics chip, so how quickly a real phone draws the Note Library once it
  is open could not be measured here, only what the script does each frame (3ms).
- **Om Parfums** is the next slowest to open on a slow phone (a second of setting up its glass: fifty
  copies of the page); it was left as the owner's trial stands.
- A page itself may still be kept ten minutes after a change; the versions only make sure that what
  it is shown with matches it.

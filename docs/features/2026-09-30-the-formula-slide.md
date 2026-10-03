# The formula slide, and the home page's five stages
Date: 2026-09-30
Files touched: `index.html`, `molecule.js`, `landing.js`, `thread.js`, `paper.js`, `style.css`,
(2026-10-01: `landing.js`, `molecule.js`, `style.css`, `tests/helpers.js`, `tests/formula.spec.js`, `tests/landing.spec.js`)
`tests/formula.spec.js` (new), `tests/helpers.js`, `tests/landing.spec.js`, `tests/menu.spec.js`,
`tests/leaving-the-map.spec.js`, `tests/node-map.spec.js`, `tests/background-and-cursor.spec.js`,
`tests/pages.spec.js`

What changed: **The home page is one stage, scrolled smoothly through five stages**, and nothing
else: (1) the aldehyde as it is first seen, with the title in front of it; (2) the same, the title
gone; (3) the aldehyde **turned upright**, the O at the top; (4) the same, **its formula drawn in
it** — the bonds in bright specks, the atoms named; (5) **two lines of specks come down the window,
top to bottom, either side of it**, falling slowly and swirling as the aldehyde's specks do, and **the
Menu's eight pages stand on the outside of them, quiet** — faint — until the hand comes to one, and
then come up gradually to the whole of themselves. The page **glides** as far as it is turned, and
every stage blends into the next, each change spread over the whole of its leg. **The hand is
electronegative**: the specks near the pointer are drawn to it, and brighten, and a small δ− stands
beside it — only a little at the title; a name pointed at is lit and the specks of its line drawn out
towards it; **a name pressed asks first**, in a dark sheet in the stage's colours. **Pages 3 and 4 —
the sentence and the node map — are switched off, and kept whole**, one switch away. The title is
white with a dark edge, **in front of** the specks (it was drawn behind them for a day).

## What the owner asked

The formula, first (the page before this one):

> okay, that is actually perfect. let us tweak a few things: I want you to make the main text be
> inverse of the colours behind it (or make it visible with a mask). when you scroll, I want us to
> introduce a 4th page, between the first and second, in the home page. to transition to this pge
> from the title page, I want the title and text to fade away; 3d model of the aldehyde to become
> more concrete and I want you to add in the element backbone (so it isnt JUST the quantum
> waveform, but rather also the aldehyde formula. I want it to be displayed horizontally, where the
> O is facing upwards. This rearranging should be done after the title fadeds away. When it is
> rearranged, I want a part of the particles to flow in very slim lines and fill 4 areas on each
> sides. This should be symmetrical, and the areas should be equally spaced from each other. These
> 8 ares should be texts that are made up of the particles (but not taking from them by number or
> volume) and they should be the contents of the menu. what we are doing here is essentially adding
> another test page for the CURRENT home page page 3. finally, make sure everything is running very
> smoothly

Then, the same evening, what the page is now:

> okay, so lets do something else, I want you to make it a smooth scrolling instead of incremental;
> I want you to make sure tha tthere are 5 increments of text that are gradual (not sudden like
> now). these five increments should be: horizental projection of the aldehyde with title (exactly
> as now when you load in the page), second should be the same without the title page; third should
> be the now vertically rotated aldehyde; fourth should be the vertically rotated aldehyde with the
> formula visible; and fifth should be when the 8 pieces of text appear.
>
> The way want the text to appear is from particles that appear in straight lines from the left and
> right, and on the outer perimeter, you will have the words. the particles should go from top to
> bottom, and should have some movement - exactly like in the aldehyde molecule. I want the words to
> be half concealed, and when you hover them, then because of the electronegative character of the
> cursor, the whole thing will be illuminated and you can click it. Additionally, when you click it,
> I want a confirmation message to pop up to go to that thing. it should be on theme.
>
> additionally; PLEASE PRESERVE PAGES 3 AND 4 IN THE CODE, BUT EXCLUDE THEM FROM THE WORKING VERSION
> OF THE PROJECT. I WANT JUST PAGES 1 AND 2 WHICH ARE DIVIDED INTO 5 AS ABOVE. NOTHING ELSE. I WANT
> THIS CHANGE TO BE REVERSIBLE JUST IN CASE, BUT DO AS I TOLD YOU NOW.
>
> i want the cursor to have an electronegative character, sot he "electrons would be attracted to it"

Then the room in the middle:

> please move the lines and words a little to the side. feel free to put Reseach and eplorations as
> two lines like research enter explorations. I want it to be nicely divided and to give the middle
> aldehyde some space.

And last, the same night:

> okay, fix the text, i dont want it to be literally half of it gone; i meant like opacity be low and
> then when you hover it it will gradually increase to 100% also please make the scrolling a little
> smoother, and also when youre still at the title, make it way less reactive to the cursor. I want
> you to change the subtitle to "A Perfume Portfolio" and also make the about me window way more
> aesthetic and agree with the page theme. I need you to make it smoother. when you scroll it feels
> very very incremental. EVERYTHING should be smooth and gradual; and not incremental. remove the "a
> portfolio 2026 edition text"
>
> also make the title a little more visible; i feel the word aldehydes is not very visible.
>
> i also want you to make the title more readable, but not at the expense of the particles behind
> it. make sure of that

## Why / key decisions

### 2026-10-01 — the turn upright prolonged, and the names pressable as soon as they show

The owner:

> next, I want you to make the text clickable even when it isnt fully apparent on the home page.
> Next, i would like you to just prolongue the horizontal to vertical transformation of the
> aldehyde. thats the only part that looks fast. I want you to smooth it out.

- **The names take the hand as soon as they are there at all** (`NAMES_PRESSABLE`, 0.03 of
  themselves, in `landing.js`): quiet at rest, or still coming up as the last stage comes. They
  waited until they were over half way up (`names > 0.6`), so a name already to be seen could not
  be pressed.
- **The turn upright has the longest leg of the page.** The legs are no longer all one length:
  `LEGS` in `landing.js`, `[1, 1.7, 1, 1]` of `--stage-leg` — the second, the turning, 1.7 — and
  the run is laid to their sum (4.7 legs; `style.css` says the same before the script runs). The
  page says them on the stage (`data-legs`), where the tests read where a stage is; `__formula` is
  still 0 to 4, a stage a whole number, however long its leg.
- **And the turn follows the page on a spring of its own** (`TURN_W`, 2.6 a second, critically
  damped, in `molecule.js`): where the page says it should be is eased in and out, so however
  quickly the page goes — a flick of the wheel, a key, the Scroll button — it turns over about two
  and a half seconds and never faster than about seventy degrees a second. Measured, from stage 2:
  a key press turned it in **1.0s, peaking at 159° a second; now 2.4s, peaking at 72°**; a quick
  flick of the wheel **1.4s at up to 103° a second; now 3.0s at up to 68°**. The turn starts at
  `TURN_FROM` 0.95 (it was 0.85, which left stage 2 turned a few degrees already). The formula
  waits for it — the cloud drawing in, the bonds and the atoms' names come only once it is nearly
  upright (`upright`) — and the drawing says `turning` until it is (`data-state`).
- **The drawing's own clock** runs only while it is drawn: under the Menu or About me it stopped
  and the swirl and the sway, reckoned by the wall clock, leapt on by however long it had been
  covered the moment it came back. Now it carries on from where it was. (On a machine drawing
  without a graphics card, where it draws every fifth frame, the clock still counts the frames
  between.)
- **Its box is read when the page moves, not as it draws**: read straight after `landing.js` had set
  the page for the frame, it made the browser lay the page out again every frame of a scroll.

### Pages 3 and 4, switched off and kept (`index.html`, `landing.js`)

- **Kept whole, where nothing draws it**: the sentence (`#slide-2`), the map (`#slide-3`) and the
  paper under the map (`.paper`) stand in `<template id="map-slides">` in `index.html`, exactly as
  they were. Nothing in a template is drawn, read by the page's own search or by a search engine,
  and the four scripts that drew them — `node-scene.js`, `paper.js`, `thread.js`, `extras.js` — are
  **not loaded** (their `<script>` tags are gone from the page).
- **One switch brings them back**: `MAP_SLIDES` at the top of `landing.js`. Set to `true`, the
  template's slides go after the stage, the paper where it stood (before the page), and the four
  scripts are loaded in their old order (`async = false`), after `landing.js`, whose frame loop has
  to run first. **`?map=on`** on the address does the same without changing anything, and **every
  test of pages 3 and 4 runs that way** (`HOME_WITH_MAP` in `tests/helpers.js`), so what is kept
  keeps working. (`thread.js` measures itself at once if it is loaded after the page has finished
  loading — the one line it needed.)
- With them on, the page moves as it did after the stage: at the stage's end a further turn of the
  wheel (after `LEAVE_AFTER_MS`, 450ms, at the end) goes on to the sentence, a slide at a time after
  it, the long move to the map, and the collapse on the way back up — all in the second half of
  `landing.js`, which runs only then. A wheel's run carried past the stage's end is held at it.
- With them off, the body carries **`stage-only`**: its ground is the stage's dark (a bounce at
  either end shows no white) and the scrollbar is dark; the Menu is light all the way down.

### The five stages (`index.html`, `style.css`, `landing.js`)

- **The page held still while it scrolls**: the title slide, the formula slide and the aldehyde
  (`.molecule`) are all `position: sticky` at the top of the stage, one over the other, and the
  stage ends in **the stage run** (`.stage-run`): four legs of `--stage-leg` (80% of the window's
  height), one from each stage to the next. The page scrolls down the run while nothing on it moves;
  **how far down it is, is how far through the five stages it is**. Nothing snaps (the owner:
  "smooth scrolling instead of incremental"): a wheel stopped between two stages stays where it
  stopped.
- **The glide** (`landing.js`, `glideToY`, `glidePhase`): a mouse wheel moves the page a notch at a
  time, and a browser's own smooth scrolling still reads as a notch at a time — "when you scroll it
  feels very very incremental". So **the wheel is taken** on the whole page and every notch moves
  **a target**; the page **glides** to it on a spring that is critically damped (it arrives without
  overshooting), at `GLIDE_W` (4.2 a second), a notch sending it `WHEEL_SCALE` (0.5) of its own
  size — slower and less sensitive since the last round of the night ("make the scrolling smoother
  - as if making the scrolling less sensitive/slower"; they were 6.5 and 0.85). Notches that come quickly add to the target while the page is still on its way, so a turn
  of the wheel is one long glide, not steps; a trackpad's many small deltas are glided the same way.
  **A finger, the scrollbar and reduced motion are left to the browser**: the page scrolls natively,
  and anything that scrolls the page other than the glide makes it let go (`glideWrote`).
- **Followed a very little behind** (`FOLLOW_S`, 0.07s, a time constant; it was 0.16 with the
  browser's own scrolling, and the two together read as a lag). The stage is told to the drawing as
  **`window.__formula`, 0 to 4** — the sixth landing-page global, which was 0 to 1 over the formula's
  sequence alone.
- **The keys and the Scroll button go a stage at a time**, on the same glide: down and up, Page Down
  and Page Up, Space and Shift+Space, Home to the first, End to the last; pressed again on the way,
  the next stage on from where it is going. The page is in a scrolling box of its own, which the keys
  would not otherwise reach. (Space is left to a button or a link it is on.)
- **Both slides let the hand through** but for the eight names (`pointer-events`), and neither has
  a ground of its own: the stage's dark is under both, so the formula slide, over the title slide,
  hides nothing of it. The slides are see-through (`rgba(0,0,0,0)`); the stage is `#1f1f20`.
- **A pinned slide reports where the page is**, not where it stands (`offsetTop`), so the tests jump
  to the title and the formula through `jumpToSlide`, which knows the title is the stage's start and
  the formula its end, and to any stage through `toStage`.

### Stage 1 to 2 — the title fades where it stands (`landing.js`)

- As the first leg goes, the title (with its line and its square) fades and lifts 26px over **the
  whole of the leg** (`TITLE_GONE`, 1; it was gone by 0.8), taking no click once gone; the Scroll
  button a little sooner (`CORNERS_GONE`, 0.7). **The corner block** (*A portfolio · 2026 edition*)
  **is gone**, at the owner's word ("remove the "a portfolio 2026 edition text"").

### Stages 2 to 4 — upright, then the formula (`molecule.js`)

- **Every change is spread over the whole of its leg and a little into the one before**, on a gentle
  curve (`smooth`), so something is always on its way and nothing waits for the one before it to
  stop ("EVERYTHING should be smooth and gradual"): the turning from `TURN_FROM` (0.85) to 2, the
  formula from `FORM_FROM` (1.95) to 3, the bonds from 2 over 0.85 of a stage, the atoms' names from
  2.3 over 0.65, the lines from 3 over `LINES_OVER` (0.85), the names from 3.25 over 0.75. Each ran
  over its own leg alone on a steeper curve before, and started when the one before had stopped.
- **`S`** is `window.__formula`. From **S 1 to 2 the aldehyde turns upright** (`turned`): one
  rotation, eased, from the cloud's side (the private page's) to facing you (`FORM_BODY`: the O up,
  the H either side below, the double bond's lobes towards you), swaying a little either side of
  facing you after (`FORM_SWAY`), and framed for the room between the lines. It is still the cloud:
  nothing drawn in, nothing named.
- From **S 2 to 3 its formula** (`formed`): every speck drawn in towards the nearest point of the
  skeleton (`TIGHT`; the nearest points worked out once, `aCore`) — "more concrete" — the swirl
  calmed (`FORM_FLOW`), the strengths set again (`FORM_PEAK`); **the bonds** drawn out of the C in
  bright specks (`BOND_*`, the C=O as two lines either side of its axis); **the atoms named** as a
  chemistry book names them (`.formula-atom`, in Arial as the icon's letters), each in **a clear
  space** (`CLEAR`) where the specks fade.

### Stage 5 — the lines and the names (`molecule.js`, `style.css`)

- **"Particles that appear in straight lines from the left and right, and on the outer perimeter,
  you will have the words. the particles should go from top to bottom"**: two lines of specks, each
  standing on the edge of the grid's middle column (`.formula-menu`; `molecule.js` reads the
  columns), **the length of the window**, and the names **on the outside of them**, `--line-inset`
  (30px) off — four down the left ending by its line, four down the right beginning by its, mirrored.
  The lines **come down the window from the top** as the stage comes (`LINES_OVER`, 0.85 of the
  leg, a soft head), and then **fall**, every speck its own speed (`FALL`, 11 to 30px a second —
  "make the lines slightly slower the way go down"; it was 16 to 44),
  round and round, **swirling a little about its way as the aldehyde's specks do** (`LINE_SWIRL`,
  the same simplex noise) — "some movement - exactly like in the aldehyde molecule". Most specks on
  the line, some a little off it, a few in a haze (`LINE_SPREAD`), `LINE_DENSITY` to a pixel of its
  length, in the aldehyde's warm grey with some of its gold and violet, lit by how near the line they
  stand. Their own specks: the aldehyde loses none.
- **The middle is the aldehyde's room** ("move the lines and words a little to the side ... nicely
  divided and to give the middle aldehyde some space"): the middle column is `--formula-gap`,
  `clamp(460px, 54vw, 900px)` (it was 44vw), and the formula is framed to three quarters of the
  room between the lines (`halfW` in `layLines`), so the width goes to space round it rather than to
  a larger formula. **Every row has room for a name on two lines** (`--formula-row`), each name in
  the middle of its row, so **Explorations & Researches**, set on two lines in its own order
  ("feel free to put Reseach and eplorations as two lines"; its second line a `.formula-line`),
  keeps the rows evenly spaced.
- **On a narrow window** (the **band**, under 900px) the two columns stay but two rows stand above
  the formula and two below each side, and the lines run down **the narrow channel between the
  columns** — still inside the names — **broken where the formula stands** (`uGap`).
- **The names are the page's own links**, the same eight as the Menu in its order (a test says so),
  set as the title is — italic, white, the dark edge — lighter (400), and they come up with the last
  stage (`--names`, 0 to 1, set by `landing.js` from `NAMES_FROM` 3.25 over `NAMES_OVER` 0.75 of a
  stage, so they come even without the drawing), taking the hand only once there (`names-here`). A
  name **tabbed to** before then takes the page to the last stage.
- **Quiet until the hand comes** ("i dont want it to be literally half of it gone; i meant like
  opacity be low and then when you hover it it will gradually increase to 100%"): at rest a name is
  drawn at **36%** of itself (`filter: opacity(0.36)`, on top of the `--names` the stage sets, so the
  two never fight); **pointed at or tabbed to it comes up to the whole of itself over 0.9s**, eased,
  and is lit — white, with a soft light round the letters — and goes back as gradually when the hand
  leaves. Nothing of it is hidden. (For one round it was **half concealed**: the lower half of every
  line of a name sunk in **a veil**, a mask drawn down off it under the hand — the owner's words
  taken literally. None of it, `--veil-top` or the mask, is in the code.)
- **A backdrop of specks under the hand** ("for the main titles, i want you to make them slightly
  particular when hovered. give them a slight backdrop of particles, same colours as the aldehyde"):
  a name pointed at or tabbed to comes up over **a soft oval of specks** behind its lettering — the
  aldehyde's warm grey, gold and violet, about a third each — gathering in to it from half as far
  again as it comes up, turning a little about their places, swirling as the aldehyde's do, drawn
  a part of the way to the hand, and going as gradually when the hand leaves (`HAZE_*` in
  `molecule.js`: the specks to a name, how far out they stand of the name's own half-size, how
  quickly they come and go, how bright). Drawn in the window's own pixels like the lines, round the
  name's lettering (the link less its padding), on the last stage only.

### The electronegative hand (`molecule.js`)

- "i want the cursor to have an electronegative character, sot he 'electrons would be attracted to
  it'": wherever the pointer (a mouse or a pen) is over the stage, **the specks near it are drawn
  towards it**, the nearer the more, and brighten — the aldehyde's (`HAND_REACH`, `HAND_PULL`,
  worked out in its shader after the speck is placed on the window) and the lines' (`LINE_REACH`,
  `LINE_PULL`) — eased in and out (`pull`) and following the pointer a little behind. **A small δ−**
  stands beside the pointer while it does (`.molecule-charge`), in the title's italic.
- **"The whole thing will be illuminated"**: a name pointed at is lit (above), and so are the specks
  of its line beside it (`uHot`, at the name's height), which the hand, over the name, draws out
  towards it.
- **The formula keeps its shape**: once it is drawn the pull is gentler, and none at all round an
  atom's name — the first try dragged the clear spaces off their letters, and the O, which stands
  over the cloud inverted, went dark on the bright specks that took its place.
- **Calm at the title** ("when youre still at the title, make it way less reactive to the cursor"):
  the pull and the lean after the pointer are `REACT_TITLE` (12%) of themselves while the title
  stands, coming up to the whole of themselves over the first leg and a little (`react`), and the δ−
  stands only once they are strong enough to be felt.
- None under reduced motion, and none on a finger (there is no hovering).

### The way out, asked first (`index.html`, `landing.js`, `style.css`)

- "when you click it, I want a confirmation message to pop up to go to that thing. it should be on
  theme": a name pressed brings up **`#formula-ask`** over the page veiled and a little out of focus:
  a dark sheet in the stage's own colours, the aldehyde's gold in its two corners and its way on; the
  page's name set as the names are; **what the page is**; **Stay** and **Go to the page** (a real
  link).
- **What the page is, in the map's words** ("use the text from what would have been the popup
  windows on page 4 for the same text in the home page now"): each name carries its node's
  `preview.description` from the node map as its **`data-say`**, and Photography its
  `preview.note` as **`data-note`**, which the sheet sets apart under the description as the map's
  window did (a gold hairline down its left, in the mono). The map is switched off, so its words are
  kept on the names **word for word**, and a test says the two copies agree — change one and change
  the other. It said *This goes to its page.* for everyone before.
- **No kicker** ("I also want you to remove the text 'leave the aldehyde'"): the line *Leave the
  aldehyde*, and the registration mark before it, are gone; the sheet opens on the name.
- **The page behind goes on moving** ("When the popup window happens, I also want the page in the
  back to keep moving"): the drawing is no longer paused under it — the aldehyde swirls, the lines
  fall — only the hand lets go of it; the veil is a little lighter (0.38, blurred 4px; it was 0.46
  and 5px) so the movement reads through it. **The veil is a layer of its own, blurred at its one
  size and faded in** (`.formula-ask::before`, 2026-10-01) — it was the blur itself growing from
  nothing to 4px, which has the browser work the whole window out again at every size on the way,
  the lag About me had; the same cure as About me's.
- **Specks in it** ("I want the popup window to have some particles too"): a small canvas behind the
  sheet's words (`.formula-ask-specks`, drawn by `landing.js`, *THE SHEET'S SPECKS*): 180 specks in
  the aldehyde's grey, gold and violet, gathering in from all round as it opens, then turning slowly
  about their places and swirling a little; thickest towards its right and its foot and faint where
  the words stand. Only while it asks; still with motion turned off. Escape, Stay or the veil put it away and the name has the keys again; the keys stay in it
  while it asks; the name stays lit (`is-lit`). **Pressed with a key held** (a new tab, a new
  window) a name goes where it goes without asking. It is the Note Library's way out
  (`.net-leave`), in this page's colours. The drawing waits under it (`ask-shown`); the Menu's
  dimming leaves it alone, as it does About me.

### The title: white, with a dark edge (`style.css`)

- **For one round it was inverted** (`mix-blend-mode: difference`), which read everywhere but turned
  it blue over the gold and green over the violet. Of **five treatments tried** — plain white;
  **white with a close dark edge**; the cloud masked by the letters; masked with the edge; a wider
  mask with the edge — the owner chose **the second** ("of the masks, I want it to be the second
  one"): tight shadows of the dark ground round every letter (`--lettering-edge`). Neither the
  inversion nor the mask is in the code.
- **In front of the specks** ("i feel the word aldehydes is not very visible ... but not at the
  expense of the particles behind it"). The title was being drawn **behind** the aldehyde: a sticky
  element makes a layer of its own, and the two slides, at no z-index, stood under the aldehyde's
  canvas (z-index 1), so the brightest specks were drawn over the letters — which is why
  *Aldehydes*, over the middle of the cloud, read speckled and washed out. The slides stand at
  z-index 2 now (`.aldehyde-stage > .slide`), and the title's edge is **tighter** — four shadows of
  the ground within 8px of the letters rather than the wider edge the names keep — so it reads
  without a shade behind it: nothing dims, blurs or thins the specks, and they are as bright as ever
  between and round the letters. Its weight is the site's own (500).

### Smoothness

- The glide moves the page and the stage is one number following it, both frame phases in
  `landing.js`'s one loop at the head of every frame, each stopping once it has arrived. The fades are three inline styles and one custom property, written only when they
  change. The lines' shader puts a speck not yet reached off the screen at once. Nothing is read off
  the page's layout while it draws — the drawing's own box is read when the page scrolls (since
  2026-10-01) — and the lines and the names are laid out once, on load, when the page's face has
  come, and on a resize.
- **It draws only while the stage is on the screen** (with the map on, a test counts none once the
  map is showing), and not under the Menu or About me once either has come all the way up
  (`COVER_MS`, 650ms; it stopped the moment they were pressed, which read as the page catching) —
  but under the way out it goes on.
- **With reduced motion** the wheel is the browser's own, the stages follow the page at once, and the drawing is simply there,
  still — no flow, no fall, no swirl, no pull — drawn again only when something has changed.
  **Without the drawing** the last stage is the eight names, plainly, quiet and lit as ever, and a
  name still asks first.

### Before the five stages (the same evening; none of it in the code)

- **A slide of its own**: the formula stood on a fourth slide between the title and the sentence,
  which the page moved to; then **the wheel ran it** (a spring, two legs, settling on the nearer
  slide, a further turn going on) — "make the whole second page reactive to the scroll wheel". The
  body classes of a hold on the way back up (`formula-shown`, `formula-leaving`) went with that.
- **The names out of specks**: first written in specks that ran out of the aldehyde along **streams**
  from four places down its side (with **couriers** after), then condensing out of **a cloud of their
  own** round each name — a border of specks, lobes in gold, violet and grey (`LOBE_TONES`), a mask of
  the name, and last one soft oval — the links' own letters held back meanwhile (`formula-written`).
  All replaced by the lines and the names.
- **The browser's own scrolling** (the first try at five stages): the page left to scroll as any page
  does, the stage following it 0.16s behind — a mouse wheel still went a notch at a time. Replaced
  by the glide.

### 2026-10-01 — the lines half as fast, and the specks coming many and small

The owner: "in the home page, i want you to slow downt he particles in the lines by about half.
Then, when you open one of the 8 tabs, i want the window to pop up not to have such a sudden burst
of large particles, rather the gradual appearance of many small ones. the same applies when you
hover one of the 8 titles."

- **The lines fall half as fast** — 5.5 to 15 pixels a second (`FALL`; 11 to 30 before) — and
  their swirl turns over half as fast (`LINE_STIR`, 0.06; 0.12 before), so the whole of their
  movement is halved, not only the fall.
- **A name's backdrop**: 1,000 specks a name (`HAZE_PER_NAME`; 420), about two thirds the size
  (`uSize` 1.6, 1.4 on a phone; 2.6 and 2.2), and **each at a moment of its own**: as the
  backdrop comes up, the specks show one after another across three quarters of its coming
  (`HAZE_STAGGER`, each its own share by its seed), each settling the last little way into its
  place (from 1.12 times as far; the whole was drawn in from 1.55 at once) — and as it goes,
  they go one by one the other way. It comes up and goes a little slower (`HAZE_EASE` 650ms; 420).
- **The way out's specks**: 560 on a laptop and 360 on a phone (180 before), a third to half the
  size, and **each fading in where it stands at a moment of its own** over the first second and a
  half (`APPEAR_MS`, `FADE_MS`), settling the last six pixels into its place — they all flew in
  together from all round over 0.9s. Drawn with the pen's colour set three times a frame and its
  strength as its alpha, so many more cost little more; drawn as sharp as the screen up to two.

### 2026-10-01, later — the lines half as reactive to the hand

"make the line particles on either side of the aldehyde on the home page less reactive to the
curosr. by a factor of 2 (or half). i want them half as reactive." The lines' specks are drawn
**half as far** to the hand (`LINE_PULL` 0.25; 0.5) and **brighten half as much** near it
(`LINE_LIGHT`, half of `HAND_LIGHT`); how far the hand reaches is unchanged, and so are the
aldehyde's own specks. A name's backdrop, which took its pull off the lines' until now, keeps the
pull it had (`HAZE_PULL`, 0.175).

### 2026-10-01, later — the Scroll button in the middle; Scent descriptions said anew

> move the scroll button in the home page to the center middle.

**The Scroll button** stands **in the middle of the window, at its foot** (`left: 50%`, drawn back by
half its width), on a desktop and on a phone; it stood in the bottom left corner. What it does, and
its fading, are unchanged. And **Scent descriptions' line** in its window — the way out asked first —
is the owner's new one, *Here I describe perfumes and perfume houses.*, word for word the node map's
`preview` for it in `node-scene.js` as well (a test holds the two together). `tests/landing.spec.js`,
**`the Scroll button stands in the middle at the foot`**.

### 2026-10-03 — the page plays itself; no flash on a reload; the lines gone, the names scattered in a drift

> something flashes when you reset the page, can you recreate that? i think it is the scrolled version
> of the page
>
> I actually want you to change the scrolling feature for it to be automatic. it should be still as
> slow as it is now.
>
> I would also like to rework the home page; i would like you to remove the two parallel particle
> lines; and then change it so that in the space on the left and right is occupied by the 8
> categories being shown, i want them to be slightly haphazardly arranged. and have VERY LIGHT AND
> FLOWY PARTICLES; very similar to the adar page. i dont want the scrolling thing adar has

Asked which, the owner chose to have the flash fixed, and the home page (not Scent descriptions) to
play itself.

**The flash, found.** Reloading the page showed, for a moment after it was drawn and before its
scripts had run, **the eight names of the last stage** over the dark, and then the title gathering —
recorded frame by frame (the old page marked, so its frames could be told from the new one's): the
stylesheet set the names at `opacity: var(--names, 1)`, so until `landing.js` had said `--names: 0`
they stood whole. It was not the browser remembering where the page was — the stage's own scroller
was back at the top from the first frame. **They are held back by the page's own head now**
(`stage-coming` on `<html>`, `html.stage-coming .formula-link { opacity: 0 }`), let go by `landing.js`
the first time it places them, or by the page's `load` if it never comes; and the page **opens at the
title on a reload** whatever is remembered (`history.scrollRestoration = "manual"`, the scroller at 0).

**The page plays itself** (`landing.js`, THE PAGE PLAYS ITSELF). Once the title has gathered and been
read (`AUTO_FIRST`, 4.2s from the page opening), it goes on **a stage at a time on the glide** — the
very spring a key or the Scroll button moves it on, so it is exactly as slow as it was — and **rests
at each stage** (`AUTO_REST`: 1.6s with the title gone, 2.6s upright, for the turn to finish on its
own spring, 2.4s at the formula), and ends on the names, about nineteen seconds in, and stays.
**It waits** while the Menu, About me or the way out is open, or the tab is hidden. **The hand takes
over**: a wheel, a finger moving the page, a key that moves it (the arrows, Page Up and Down, Home,
End, Space, Tab), the Scroll button, or the page moved by anything but the glide (the scrollbar) —
and it stops for the rest of the visit, the page the visitor's as it always was. Not with motion
turned off, nor with the map slides on. `data-auto` on the stage says on, off or done; **`?auto=off`**
on the address keeps it still without changing anything (the tests that hold a stage).

**The lines are gone, out of the code** (`LINE_VERTEX`, `lineGeo`, `layLines`, `uLineX`, `uGap`,
`uHot`, `FALL`, `LINE_DENSITY`, `LINE_SPREAD`, `LINE_STIR` — none of it is left), and with them the
names lit beside a line. In their place **the drift** (`molecule.js`, `DRIFT_*`): **ADAR's dust on the
stage's dark** — specks in the room either side of the formula, from the window's edge to the edge of
the grid's middle column, the whole height of the window, falling slowly (3 to 11 pixels a second,
ADAR's own), swaying a few pixels from side to side as ADAR's do (`DRIFT_SWAY`), carried a little by a
slow flow under them (`DRIFT_FLOW`, `DRIFT_STIR`), twinkling, most a pale warm grey and some the
aldehyde's gold and violet; **thinning out towards the formula**; coming up as the last stage comes
(`DRIFT_OVER`); drawn to the electronegative hand as the lines were (`LINE_PULL`, `LINE_REACH`). On a
narrow window it is across the whole of it, thinner. **None of ADAR's log** — the scale it falls
through there, which the owner did not want. `data-state`'s last two are **drifting** and **drift**
(they were lining and lined).

**The names, scattered** (`style.css`): still four on each side of the formula in the Menu's order,
each now a share of its column further out (`--k`) and a share of its row up or down (`--j`), its own,
so no side lines up on one edge, no two rows are level, and the two sides do not mirror; scattered
less on a narrow window (`--col`, `--scatter-row` there). The backdrop of specks a name stands on
under the hand is as it was. **Scent Descriptions** is set with its capital D, as the Menu is now.

### 2026-10-03, later — less organized, and no edge to the drift

> You know what i dont like the home page, it feels too organized. Can you make it a little less
> organized, and make the border between thebstart and wnd of the particles more subtle? I want it to
> resemble more the adar left side.

**The drift has no edge** (`molecule.js`, `DRIFT_FULL`, `DRIFT_REACH`, `DRIFT_PATCH`). It filled the
room either side evenly from the window's edge to 70px short of the names' inner edge, and stopped
there — a plain line down each side of the aldehyde, which is the border the owner saw. Now each
side's specks are spread from the window's edge on into the aldehyde's room: as many as anywhere out
to **0.45** of the way to the names' inner edge, and from there fewer and fainter (laid fewer, drawn
fainter) to none at **1.4** of it — so it thins out into the aldehyde's own cloud instead of
stopping. **And it lies in slow patches**: a speck's light is taken down by up to three quarters
where a slow noise says thin, so the field is thicker here and thinner there, and the patches drift.
**More like ADAR's left side**, which is very few specks, small and faint: about half as many as
before (`DRIFT_DENSITY` 0.0018, was 0.0028, over the larger spread), smaller (`uSize` 2.1, was 2.4,
most specks 0.7 to 1.05 of that) and fainter (`DRIFT_INK` 0.8, was 1). It falls, sways and answers the
hand as before. (A shader word: the patches' strength was first named `patch`, which is a reserved
word in the graphics card's language, and the whole drawing went blank — renamed `thin`, and the
page checked for shader errors before anything else.)

**The names, scattered further** (`style.css`, `--k`, `--j`): a short name up to about two thirds of
its column out (Theories, Search), a long one less (it has less room), **two stepping a little in
towards the formula** (Explorations & Researches on the left, Photography on the right — never more
than a few tens of pixels, still well clear of it), and up to half a row up or down, so the four on a
side no longer read as a column of four. On a narrow window (two above the formula and two below) none
steps inwards: the other side's names are just across a narrow channel.

### How it was tested (2026-10-03)

`tests/formula.spec.js`: **`a reload opens at the title, the names never shown before the page has
placed them`** (new — with `landing.js` held back, every name at nothing; scrolled to the last stage
and reloaded, the page at the first); **`the page plays itself through the five stages, on its own
glide, to the names; a wheel takes over`** (new — the title read first, then every stage, gliding
between them and resting at each, ending `done` at the fifth; a wheel early on and it stops where the
wheel left it); **`the last stage carries the Menu's eight pages, in its order, four either side of
the formula, scattered a little`**; **`the drift comes up in the rooms either side of the formula as
the last stage comes, and nothing of the lines is left`**; **`the electronegative hand draws the
drift's specks to it`**; and the five stages, the quiet names, the backdrop, motion off and the phone
read for the drift where they read for the lines.

## How to test it

`tests/formula.spec.js`:
- **`the last stage carries the Menu's eight pages, in its order, four either side of the formula,
  scattered`** — against `SITE_LINKS` in `nav.js`; each side's edges spread over 120px, no rows level
  within 20px, the gaps down a side differing by over 60px; a name may step into the formula's room
  by no more than 8% of it, and every name stands 60px clear of the formula's atoms (2026-10-03,
  later: it was 30px, 6px and 12px, and no step in).
- **`a reload opens at the title, the names never shown before the page has placed them`**.
- **`the page plays itself through the five stages, on its own glide, to the names; a wheel takes
  over`**.
- **`five stages, smoothly: the title, the title gone, the aldehyde upright, its formula, and the
  names`** — each stage in turn (`data-stage`, `data-state`: cloud, turned, formula, drift): the
  title gone; the lone pair's violet moved to the top; the atoms named only at the fourth, O above
  C, the H either side below; the names only at the fifth, in the drift (counted with the names
  hidden, a few specks in every box down both rooms); and back.
- **`the turn upright is prolonged and smooth: its leg the longest, and never quick`** — the
  second of `data-legs` the longest by half again; from a key, the turn takes over 1.8s and never
  goes faster than 100° a second (2026-10-01).
- **`the wheel scrolls it smoothly, as far as it is turned and back, and nothing snaps`** — three
  notches, the stage followed frame by frame: never a jump, never back, a glide to exactly as far as
  they send it, and it stays where it stopped.
- **`the drift comes up in the rooms either side of the formula as the last stage comes, and
  nothing of the lines is left`** — read over the whole height of the left room with the names
  hidden; and **no edge**: just past the names' inner edge there are still a few specks, fewer than
  in the room (2026-10-03, later).
- **`a name is quiet until the hand comes to it: then it comes up gradually to the whole of
  itself`** — under 45% at rest, part way after a quarter of a second, whole after; no mask; the δ−.
- **`the electronegative hand draws the drift's specks to it`** — with `?molecule=full`, every
  speck drawn (a browser without a graphics card draws three in ten, and the drift is sparse now),
  the names hidden.
- **`the electronegative hand draws the aldehyde's own specks to it`** — and at the title, far less
  (no δ−, the specks less stirred).
- **`a name pressed asks first, on the stage's own dark: Stay, Escape and the veil keep the page, Go
  goes, and a key held goes at once`** — with the map's words for the page, no kicker, specks drawn
  in it, the page behind still moving, and Photography's note set apart.
- **`what each name says when it asks is its page's window on the map, word for word`** — read
  against `REAL_NODES` in `node-scene.js`.
- **`a name pointed at stands on a slight backdrop of specks, which goes when the hand does`**.
- **`the names wait for the last stage, and a name tabbed to takes the page there`**.
- **`with motion turned off the stages are simply there, still`**.
- **`without the 3D library the last stage is the eight names, plainly, and a name still asks
  first`**.
- **`on a phone the names stand two above and two below the formula each side, scattered a little,
  in the drift, and nothing scrolls sideways`**.
- **`the aldehyde stops drawing once the stage is off the screen`** (with the map on).

`tests/landing.spec.js`: **the home page is the stage alone** (two slides, the sentence and the map
kept whole in the template, none of their scripts loaded, the switch off) and **with the switch on
they come back after the stage, as they were**; the Scroll button and the keys go a stage at a time;
the Scroll button fades over the first leg; **the corner block is gone** and the line under the
title reads *A Perfume Portfolio*; both slides stand in front of the aldehyde; the long move and its
frames with the map on. The map's, the
paper's, the way out of the map's and the sentence's own tests all run with `?map=on`. By eye: scroll
down slowly and quickly with a wheel and a trackpad, stop between stages, point at the names and at
the aldehyde, press a name; on a phone, swipe and tap.

## Known issues / TODO

- The numbers: `--stage-leg` (how much scrolling a stage takes) in `style.css` and `LEGS` (how many
  of them each leg is) in `landing.js`; `TURN_W` (how quickly the turn upright follows) in
  `molecule.js`; `GLIDE_W`,
  `WHEEL_SCALE`, `FOLLOW_S`, `TITLE_GONE`, `CORNERS_GONE`, `NAMES_FROM`, `NAMES_OVER` in
  `landing.js`; `TURN_FROM`, `FORM_FROM`, `DRIFT_OVER`, `REACT_TITLE`, `TIGHT`, `FORM_PEAK`,
  `BOND_*`, `ATOM_SIZE`, `CLEAR`, `DRIFT_*`, `HAZE_*`, `HAND_*` at the top of `molecule.js`;
  how quiet a name is at rest, and how long it takes to come up, in `.formula-link`; the sheet's
  specks (`COUNT`, `GATHER_MS`) in `askSpecks` in `landing.js`.
- The glide is for a mouse wheel and a trackpad. A trackpad already scrolls smoothly on its own, and
  is glided anyway so the two feel the same; if it ever feels heavy there, `WHEEL_SCALE` is the
  number.
- Pages 3 and 4 are the owner's to bring back (`MAP_SLIDES`), or to let go of for good.
- The names are the Menu's by a test, not by being read from `nav.js`: a page added to the Menu is
  added to the stage's markup too (the test fails until it is); a ninth needs a row more in the grid.

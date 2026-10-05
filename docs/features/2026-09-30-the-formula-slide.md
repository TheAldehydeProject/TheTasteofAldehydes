# The formula slide, and the home page's five stages
Date: 2026-09-30
Files touched: `index.html`, `molecule.js`, `landing.js`, `thread.js`, `paper.js`, `style.css`,
(2026-10-01: `landing.js`, `molecule.js`, `style.css`, `tests/helpers.js`, `tests/formula.spec.js`, `tests/landing.spec.js`)
(2026-10-03, last: `landing.js`, `molecule.js`, `index.html`, `style.css`, `tests/formula.spec.js`, `tests/landing.spec.js`)
(2026-10-04: `landing.js`, `molecule.js`, `index.html`, `style.css`, `tests/formula.spec.js`, `tests/landing.spec.js`)
(2026-10-04, later: `landing.js`, `molecule.js`, `style.css`, `tests/formula.spec.js`)
(2026-10-05: `molecule.js`, `style.css`, `index.html`, `tools/seo.py`, `tests/formula.spec.js`, `tests/landing.spec.js`)
`tests/formula.spec.js` (new), `tests/helpers.js`, `tests/landing.spec.js`, `tests/menu.spec.js`,
`tests/leaving-the-map.spec.js`, `tests/node-map.spec.js`, `tests/background-and-cursor.spec.js`,
`tests/pages.spec.js`

What changed: **The home page is one stage, scrolled smoothly through five stages**, and nothing
else: (1) the aldehyde as it is first seen, with the title in front of it; (2) the same, the title
gone; (3) the aldehyde **turned upright**, the O at the top; (4) the same, **its formula drawn in
it** — the bonds in bright specks, the atoms named; (5) **the Menu's eight pages on an orbit round
it** (since 2026-10-04) — a tilted ring, one fine still hairline since later that day, as wide as the
window lets it so the aldehyde has centre stage, each page (set smaller) beside an electron of its own
on it, a small still point of light — in **the aldehyde's sillage**, its specks afloat in the room (since
2026-10-05; they spread out of the aldehyde before that), on a stage a little darker since the same day (two
lines of specks, then a drift, then for a day each name the R of an aldehyde with the aldehydes of
perfumery in the gaps, stood there before), **quiet** — faint — until the hand comes to one, and then
coming up gradually to the whole of themselves, its electron and the ring by it lit gold. **One scroll
glides it all the way** (2026-10-04): it stands at the title until it is scrolled, then goes to the
names **in one continuous, gradual movement of about four seconds**; one scroll up, all the way back.
Every stage blends into the next, each change spread over the whole of its leg. **The hand is
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

### 2026-10-03, last — one scroll, all the way; every page an aldehyde; the sillage; the aldehydes of perfumery in the gaps

> okay claude, i want you to make the scrolling automatic as in when you scroll once, it will go all
> the way down, not it will scroll by itself after a second or so. fix that. Additionally, in the title
> page, I want you to rework the words and the particles surrounding the main aldehyde molecule. that
> styaus 100% as it is, but the rest i need changed. I want you to fill in the gaps and make it all
> thematic.

"The title page" was read as the home page's stage, and "the words and the particles surrounding the
main aldehyde molecule" as the last stage's — the eight names and the drift round the formula, the only
words and specks that stand round it; the title stage is unchanged. **The aldehyde itself is untouched**:
its cloud, its turn, its formula, its framing (the room the names leave it is the same grid as before).

**One scroll, all the way** (`landing.js`, ONE SCROLL, ALL THE WAY). Nothing moves by itself any more
(`AUTO_FIRST` is gone): the page stands at the title until it is scrolled, and then **one scroll plays it
the whole way** — on through the five stages a stage at a time on the glide, resting at each exactly as it
did when it played itself (`AUTO_REST`), to the names, in about seventeen seconds (measured). Scrolled
up, it plays all the way back to the title the same way. A scroll is:
- **a turn of the wheel or a trackpad** — its deltas gathered into one scroll (`wheelPlay`): from rest
  `PLAY_FROM` (8px) of it sets the page going, so a trackpad's tremble does not; the rest of the same
  turn — a wheel's further notches, a trackpad's run-on — is the same scroll and changes nothing; a turn
  **the other way**, `PLAY_TURN` (40px) of it, turns the page round from where it is; after `PLAY_GAP`
  (420ms) without any, the next is a new scroll;
- **a swipe of a finger** (`SWIPE`, 12px along the page): the page's own scrolling is held off on the
  stage (its `touchmove` is not passive), so a swipe up plays it down and a swipe down plays it up; two
  fingers are a pinch, and the browser's;
- **a key** — down, Page Down, Space or End plays it down; up, Page Up, Shift+Space or Home, up;
- **the Scroll button**.

It **waits** while the Menu, About me or the way out is open, or the tab is hidden; the page moved by
**the scrollbar** while it rests and it lets go, where it was put (the next scroll sets it going from
there). A name tabbed to still takes the page straight to the names. `data-auto` on the stage says
**ready**, **down**, **up** or **off** (it said on, off, done). Not with motion turned off (the page's own
scrolling there, as before), nor with the map slides on (their own wheel); **`?auto=off`** keeps the
hand-driven page — a wheel's notches gliding as far as they are turned, the keys and the Scroll button a
stage at a time — which is what the tests that hold a stage, or drive it a notch at a time, open.

**Every page an aldehyde** (`landing.js`, `style.css`, `index.html`). Each of the eight names is **the R of
an aldehyde, R–CHO**, as the Menu's own aldehyde is drawn: after its last letter, towards the formula, a
short zig-zag of bonds — **`data-chain`** on the name, how many before the aldehyde's carbon, 1 to 3, so the
names do not all match (Theories and Search 3, Explorations & Researches and Photography 1 — the two that
step in towards the formula — the rest 2) — and **the C=O**, two lines **in the aldehyde's gold**, its
**O** an outline **with a haze of the lone pair's violet**, as a chemistry book draws a chain: the carbons
are the corners, only the O named. On the right the group stands before the name, mirrored. It is quiet
with its name (inside the link, under its quiet) and lit with it: the gold brighter, the violet haze
coming up round the O over 0.9s. It is drawn **in shapes only** (`.formula-tail`, an SVG built by
`landing.js`), so the link's words — what the way out names, what a screen reader reads — are its name
alone; it takes no pointer, so a name is pressed where it always was. **None on a narrow window**, where
the names stand two by two across a 30px channel and a group would cross into the other column.

**The sillage** (`molecule.js`, `SILL_*`, in place of the drift). ADAR's dust was ADAR's, not this page's.
In its place, the aldehyde's own scent leaving it — a perfumer's *sillage* is the trail a scent leaves in
the air: specks come off the edge of its cloud (`SILL_FROM`, of the formula's half-size) and go out into
the room **on every side**, out past the window's corners (`SILL_REACH`), each in its own direction over
its own life (55 to 120 seconds, round and round); a little slower as they go, so **thinning as they
spread** (`SILL_EASE`: how far out is how far through its life to this power — at 0.6, the first try,
they lingered at the edges and were thicker there than by the cloud); curling a little (`SILL_CURL`) and
carried on a slow current, further the further out (`SILL_WANDER`, `SILL_STIR`); fading in as they leave
the cloud and out towards the edge; **reaching further out as the stage comes** (`uOut`) — the scent
spreading into the room; in the aldehyde's warm grey with some gold and violet; drawn to the
electronegative hand as the drift was. On a phone 0.6 as many; without a graphics card 0.15 (below).

**The aldehydes of perfumery, in the gaps** (`molecule.js`, `AIR_*`, `AIR_LIST`, `layAir`, `drawAir`). The
gaps the names leave are filled with **the aldehydes a perfumer reaches for**, drawn as a chemistry book
draws them — skeletal formulas, a bond one long, the carbons the corners, only the oxygens named: C-8
octanal, C-9 nonanal, C-10 decanal, C-11 undecylenic (10-undecenal), C-12 lauric (dodecanal), C-12 MNA
(2-methylundecanal), vanillin, cinnamal (E-cinnamaldehyde), benzaldehyde, citral (geranial, the E one),
hydroxycitronellal, anisaldehyde, melonal, safranal, phenylacetaldehyde and cuminaldehyde. Each is drawn
once, in fine lines of specks, **its C=O in the aldehyde's gold with a little gold cloud along it, and a
faint violet haze round each O for its lone pair** — the big one's colours, at the size of a footnote —
a ring's double bonds as inner lines; its O (and an OH's H) upright however it turns; **its name small
under it**, in the site's readings face, spaced. **Where**: each in turn is given 140 places and turns at
random and put at the one furthest from everything already there that keeps clear of the window's edges,
the Menu, the names and their aldehyde groups (16px), the formula and its cloud (an oval 1.1 of its
half-size) and the others (26px) — and from the window's edges, counted as if they were others, so they
stand in the gaps rather than lined up along the edges (where the first try put them); one that finds
nowhere is left out. About fifteen find room on a laptop, eight or so at 1024, three or four on a phone;
the same places every time for one size of window. They **come up one by one** as the last stage comes,
from a little further out; **drift** a few pixels and **turn** a little about their places; are drawn a
little to the hand and brightened by it; at two depths, the farther smaller and fainter.

**How they are drawn, and what was measured.** At first they were laid down every frame on a 2D canvas of
their own over the aldehyde, and the last stage drew at **half the frames** of the rest in the tests'
browser (33ms a frame where it had been 16.7); laid down only ten times a second, still half — the cost
was a second full-window picture over the drawing at all. So each is **a flat picture in the aldehyde's
own WebGL drawing** — drawn once into a texture, then only moved and turned — in a scene of their own,
measured in the window's pixels, drawn after the aldehyde by the same renderer; there is no picture of
the whole window. With the sillage, whose specks each worked out noise twice, that was still a frame over
budget there: **one noise to a speck now** (turned into a way and how far), and **0.15 of the specks
without a graphics card** (the cloud draws a fifth there). Measured, the last stage draws at 16.7ms a
frame again, as the first does.

**How it was tested**: `tests/formula.spec.js` — **`the page waits at the title until it is scrolled, and
one turn of the wheel plays it all the way to the names, resting at each stage; one turn up, all the way
back`**, **`the rest of a turn is the same scroll, and a turn the other way turns it round; the scrollbar
lets go`**, **`on a phone one swipe plays it all the way, and the page's own scrolling is held off`**
(a finger through the browser's own touch events), **`the sillage comes up as the last stage comes …`**
(in place of the drift's), **`the aldehydes of perfumery stand in the gaps …`** (at three sizes: as many
as find room, each known, clear of the names and their groups, the formula and each other, none before
the last stage, each drawn, each C=O gold), **`every name is the R of an aldehyde …`**; and the
hand-driven tests (the turn upright from the keys, the wheel's notches) open `?auto=off`.
`tests/landing.spec.js` — **`the Scroll button plays the page all the way to the names, resting at each
stage`**, **`an arrow key is a scroll too …`**, and the keys a stage at a time **`with the page driven by
hand`**. Two older checks were made to wait rather than race: the wheel's notches' **`nothing snaps`**
failed on this machine on the code before the round as after (its 160 frames can end a pixel before
the glide comes to rest), and now waits for the page to come to rest before checking that it stays; and
the way out's veil is waited for rather than read the moment it is pressed.

### 2026-10-04 — one glide of four seconds; the chemicals gone; the orbit

> The auto scroll thing is too really, bad. I want it to be a continuous auto scroll upon detecting a
> scrolling motion from the user rthat will smoothly in the span of about 4 seconds go all the way to
> the bottom, it beeds to be gradual. For the menu in the second page, i dont like it. I want you ti
> remove the chemicals and redesign it again. KEEP THE MIDDLE ALDEHYDE AS IT IS. DO NOT TOUCH IT
> NEITHER IN ANIMATION NOR IN REACTION NOR IN ANY WAY.

"The menu in the second page" was read as the last stage's eight names and what stood round them (the
stage the page scrolls on to from the title), and "the chemicals" as the round before's two
additions: each name's aldehyde group, and the sixteen aldehydes of perfumery drawn in the gaps. **The
aldehyde is untouched** — its cloud, its colours, its swirl, its turn upright, its formula, how the hand
moves it and where it stands: `git diff` shows no line of its drawing changed, and its four atoms were
measured standing on exactly the same pixels before and after at seven window sizes (1440 × 900,
1920 × 1080, 1280 × 800, 1024 × 768, 960 × 700, 820 × 1180 and a phone, 390 × 844). The room the
names leave it — the grid's middle column on a wide window, the two rows above and below it on a narrow
one — frames it, so neither was changed.

**One glide, all the way** (`landing.js`, ONE SCROLL, ONE GLIDE, ALL THE WAY). The round before went a
stage at a time and rested over a second at each, and the whole took about seventeen seconds — the
owner's "really bad". Now **one scroll carries the page from the title to the names in one movement of
`AUTO_MS`, four seconds** (measured: 4.1s from the turn of the wheel to the names standing), and one
scroll up all the way back the same. It is a **curve laid on the clock** (`curve`), not the spring the
hand-driven page glides on: a quintic from where the page is to where it is going, at rest at both ends
with no jerk — so it **sets off gently, gathers, and comes to rest as gently**, and stops nowhere on the
way (the stages come and go as it passes, each blended into the next as before). A shorter way — a
scroll from part of the way down — takes its share of the four seconds, never under `AUTO_LEAST`
(1.2s). **Turned round on the way** (`PLAY_TURN` of a turn the other way), the curve is laid again from
where the page is *and how fast it is going*, so it eases out of the way it was going rather than
jolting. Each frame moves it by the clock's own time — so it takes its four seconds on a slow machine
too — with only a stall of over a quarter of a second not counted. What counts as a scroll is as it
was (a turn of the wheel or a trackpad, its run-on the same scroll; a swipe, the page's own scrolling
held off; a key; the Scroll button); it waits while the Menu, About me or the way out is open, or the
tab is hidden; the scrollbar moved on the way and it lets go where it was put. `AUTO_REST` and the
stage-by-stage stepping are gone; `?auto=off` still keeps the hand-driven page for the tests that hold a
stage.

**The chemicals, gone** — no `.formula-tail`, `data-chain`, `TAIL_BOND`, `AIR_*`, `AIR_LIST`, `layAir`
or `drawAir` anywhere (a test says so); the 2D pictures they were drawn from went with them.

**The orbit** (`landing.js` THE ORBIT, `molecule.js` `ORBIT_*`, `style.css` `.orbit-laid`). The eight
names stand **on an orbit round the aldehyde**, as electrons stand round a nucleus — a **ring** of fine
specks, an ellipse wider than the aldehyde's room (`ORBIT_PAST`, 1.08 of its half-width) and most of the
window high (`ORBIT_TALL`, 0.43 of it each way), **turned a little** (`ORBIT_TILT`, rising to the right),
its specks going slowly round (`ORBIT_TURN`, a few the other way, `ORBIT_BACK`) and standing a few pixels
off its line (`ORBIT_OFF`), in the aldehyde's warm grey with some gold and violet (`ORBIT_TONES`). On it,
**an electron for each page** — a small knot of brighter specks (`ELECTRON`) — at its own place round the
ring (`ORBIT_AT`, in degrees: the first four of the Menu's order down the left, the next four down the
right, a little off a mirror so the two sides differ and no rows line up), and **each name beside its
electron**, level with it, written away from the aldehyde: the left four's letters ending 14px short of
theirs, the right four's starting 14px past. The names keep their quiet, their coming up under the hand, their backdrop
of specks, and asking first. **A name lit — by the hand, the keys, or while it is being asked for — lights
its electron and the ring either side of it (`ORBIT_LIT`) in the aldehyde's gold**, coming up and going
with the name. The ring is **traced round from the top, both ways**, as the last stage comes; it is quiet
under the names' letters; the electronegative hand draws it as it draws the sillage. It stands well
outside the aldehyde's cloud and nothing of it is drawn into it.

How it is built: `landing.js` works out where the ring stands from the grid's own middle column
(`--orbit-cx`, `--orbit-cy`, `--orbit-rx`, `--orbit-ry`, `--orbit-tilt` on the names' nav) and where each
electron is (`--ox`, `--oy` and its angle `--oa` on each name), and puts `orbit-laid` on the nav, which
the stylesheet places the names by (`position: absolute` at their electrons); `molecule.js` reads the
same numbers off the page — as it reads where the names stand — and draws the ring and the electrons in
its own WebGL drawing, one more set of specks in the window's pixels (`ORBIT_VERTEX`), so there is no
second picture of the window over it. Laid again whenever the window changes size. **On a narrow window
(the band, under 900px) there is no orbit**: the names stand two above and two below the formula each
side as they did, because the aldehyde is framed between those rows there and is not to move; widen the
window and the orbit is laid again. Without the script, or without the 3D library, the names stand in the
grid as they always did.

**How it was tested**: `tests/formula.spec.js` — **`the last stage carries the Menu's eight pages, in its
order, on an orbit round the aldehyde, each beside its electron`** (every electron on the ring, each name
level with its electron and 6 to 24px from it on the far side from the aldehyde, the Menu's order down
each side, the two sides not mirrored, every name clear of the aldehyde's cloud, Explorations &
Researches on two lines, and nothing of the chemicals in the page or the code); **`the orbit is drawn
round the aldehyde, and a name under the hand lights its electron and the ring round it, in gold`**
(with `?molecule=full`: each electron drawn, the ring lit along its length far more than just off it;
a name under the hand turns the ring either side of its electron gold — read along the ring itself,
clear of the name and its backdrop, which has gold in it too: about 820 at rest, 2,100 to 2,300 lit — and
it goes back when the hand goes); **`on a narrow window there is no orbit, and
the names stand two by two as they did`**; **`the page waits at the title until it is scrolled, and one
turn of the wheel glides it to the names in one gradual movement of about four seconds; one turn up, all
the way back`** (where the page is, frame by frame: between 3.2 and 5.2 seconds, never back, standing
still nowhere for 150ms on the way, at under half its middle's speed in its first and last 15%);
**`the rest of a turn is the same scroll, and a turn the other way turns it round without a jolt; the
scrollbar lets go`** (the jolt read as a speed between frames, never over 3,200 pixels a second, so a
slow machine's frames coming further apart do not read as one); the swipe's, unchanged; and the sillage and the hand's tests with the ring and the
electrons left out of what they count. `tests/landing.spec.js` — **`the Scroll button glides the page all
the way to the names, in one movement`**, and an arrow key. By eye, screenshots at 1440, 1920, 1280 ×
680, 1024, 960 and a phone, the last stage at rest and with a name under the hand.

### 2026-10-05 — the sillage afloat, not out of the aldehyde; the ground a little darker

> this is better. I want you to make the particles not come from the aldehyde itself. the current
> glowing ring is good, i like it. Also maybe make the background gray a little darker (make tha last
> change reversible just in case)

The ring, the electrons and the aldehyde are as they were (its atoms measured again on the same pixels
at the seven sizes).

**Afloat** (`molecule.js`, `AFLOAT_*`, `MOVE_GLSL.afloat`). The sillage drawn until now (`diffuse`) left
the edge of the aldehyde's cloud and went out on every side, thickest round the aldehyde — it read as the
aldehyde giving the specks off. Now the specks are **in the room already**: each, over and over, comes up
at a place of its own anywhere in the window (worked out from its seed and which of its lives it is in),
drifts the way **the room's air** goes there for its life — a slow field of currents (`AFLOAT_CURRENT`,
turning over slowly, `AFLOAT_TURN`), so neighbours drift together, 3.5 to 9 pixels a second
(`AFLOAT_PACE`), with a pixel or three of sway — and goes, half of its old life long (`AFLOAT_LIFE`). It
comes up **everywhere at once** as the last stage comes (no reaching out from the aldehyde), is never
over the aldehyde's cloud, and is only a little fainter at the window's edge (`AFLOAT_EDGE`, 0.55), so
the room is about as full at its edges as by the aldehyde. Colours, sizes and numbers are the sillage's
own, unchanged. Two things were tried and were wrong on the way, seen in a long exposure of a clip made
frame by frame: the air's way read **as it turned** swung each speck's whole journey round in an arc (a
speck a few hundred pixels out sweeping across the room); it is read **where and when the speck came
up**, and kept for its life. And the air turned too sharply from place to place (its way was the noise
times 7.5), so the streaks went every way and read as a jitter; at 3.2, regions drift together, as air
does. `diffuse`, what the page drew, is one of the options on the address now (`?sillage=diffuse`), with
rise, swirl, still and breeze; the drawing says which it is drawing (`data-sillage` on `#molecule`).

**The ground a little darker, reversibly** (`style.css`, `index.html`, `tools/seo.py`). The stage's ground
is **#171718**, where it was #1f1f20 — a token of its own now, `--stage-ground` (and `--stage-ground-rgb`
for the Menu's ground on a phone, which is the same colour at 0.78), which the stage's `--bg`, the page
under it (`body.stage-only`) and the Menu's ground all take; a phone's bar (`theme-color`, from THEME in
`tools/seo.py`) is the same. **To go back**: the two values beside it in `style.css`, and THEME's line for
the home page in `tools/seo.py`, run (the comment over them says so). **Only to look**, `?ground=was` on
the address puts the old grey back for the visit — `ground-was` on the page, set in its head before
anything is drawn, and the bar's colour with it. Nothing else on the stage was changed (its raised
surfaces and hairlines, `--bg-2` and `--line`, are as they were).

**How it was tested**: `tests/formula.spec.js` — **`the sillage comes up as the last stage comes: specks
afloat in the room on every side, nearly as many at its edges as by the aldehyde, nothing streaming out
of it …`** (in place of *spreading into the room … thinning as they go*: the drawing says afloat; at the
window's very edge as soon as anywhere as the stage comes; on every side; at its edges at least half as
many to a pixel as just outside the cloud — measured, more; and `?sillage=diffuse` says diffuse);
**`the sillage's movements to choose from: the page's own, and each asked for by the address, draws in
the room and moves`** (afloat, then diffuse and the four, each saying which it is). `tests/landing.spec.js`
— **`the stage's ground is a little darker, and the address can put the old grey back`** (new: the stage,
the page under it, the bar and the Menu's ground the old grey with `?ground=was` and the new without; and
the way back written in the stylesheet), and the two tests that read the ground read #171718. By eye: a
clip of afloat and its long exposure; the last stage and the title on the new ground and the old, side by
side.

### 2026-10-04, later — the aldehyde at centre stage; the ring a line; the sillage's movements to choose from

> I want the aldehyde molecule to have center stage more. also the spinning ring of particles look
> sketchy. rewrork it keeping the aldehyde the same (again). additionally, i want to say the colour and
> size are very good. idk about the movement. if you want give me suggestions what would be
> stylistically possible

Asked which "colour and size" meant, the owner answered: "the particles outside of the ring and
outside of the aldehyde. I WANT TOE MPHASIZE, THE ALDEHYDE IN THE MIDDLE STYAS THE SAME!q!!!" — the
sillage. So: the sillage's colours and sizes kept, and its movement given options; **the aldehyde
untouched** — none of its drawing changed, and its four atoms measured on exactly the same pixels as
before the day's work at seven window sizes (1440 × 900, 1920 × 1080, 1280 × 800, 1024 × 768,
960 × 700, 820 × 1180 and a phone, 390 × 844).

**Centre stage** (`landing.js`, THE ORBIT; `style.css`). The aldehyde is made the centre by what is
round it giving way, not by changing it: **the ring stands as wide as the window lets it** —
`ORBIT_WIDE`, 0.36 of the window's width either side, at most — with every name still inside the window
by `ORBIT_MARGIN` (36px), the ring drawn in a few pixels at a time until they all are (`fits`), and never
narrower than it stood before, just past the aldehyde's room (`ORBIT_PAST`, now its least); and **the
names are smaller** on the orbit — `--orbit-size`, `clamp(15px, 1.2vw, 20px)`, about three quarters of
what the grid sets them at (`--formula-size`, which is left alone, because the grid's rows are reckoned
from it), their letters a hair more open (0.03em). At 1440 × 900 the ring's half-width went from about
445px to 518. The names are
laid on the orbit before they are measured (`orbit-laid` first), so the fit is worked out at the size
they stand at. The room itself — the grid's middle column, which frames the aldehyde — is not changed;
nor is anything on a narrow window, where the names still stand two by two.

**The ring, a line** (`molecule.js`, `ORBIT_*`, `ORBIT_VERTEX`, `layOrbit`). What made it sketchy: its
specks each went round at a speed of their own (`ORBIT_TURN`), one in eight the other way
(`ORBIT_BACK`), a fifth of them off the line (`ORBIT_OFF`), every one trembling a pixel and twinkling —
a broken pencil line that crawled. All of that is gone. The ring is **one even, still hairline**: its
specks laid evenly round it, 2.4 to a pixel (`ORBIT_DENSITY`), each faint (`ORBIT_INK`), so together
they read as a line, as the formula's bonds are drawn; in one warm grey (`ORBIT_TONE`); **the far half,
the top, at 45% of the near half** (`ORBIT_FAR`), so it reads as an orbit seen at a slant. **An
electron** is a small, still point of light — a warm white heart (8 specks within half a pixel) in a
soft gold glow (30 within 3px, `ELECTRON`), breathing slowly, each on its own beat. A name lit lights
its electron and the ring either side of it in the aldehyde's gold, as before (`ORBIT_LIT`). **The hand
no longer draws the ring to it** — it only brightens it a little: tried, the pull bent the line off its
own electrons (a name under the hand has the hand by its electron), and drew the electron into the
name's first letter, where it was quietened and lost; an electron is not quietened under its name now
either. With no graphics card the ring has half the specks, each twice as strong.

**The sillage's movements, to choose from** (`molecule.js`, `SILL_MOVES`, `MOVE_GLSL`, `MOVE_TAIL`). Its
colours, sizes and numbers are the same in every one; only how the specks go differs, and every one
but the first is kept off the aldehyde's cloud (faded inside `uFrom`), shows only as far out as the
scent has reached (`uOut`), and — where it fills the room evenly — is fainter the further from the
aldehyde, so it still thins as it spreads. **The page draws `diffuse`, as it was** (the shader's text
for it is the old one, word for word); the others are shown by the address alone:
- `diffuse` — out from the aldehyde on every side, slowing as it spreads (the sillage as it is);
- `?sillage=rise` — rising up the window like vapour off warm skin, swaying, passing behind the aldehyde;
- `?sillage=swirl` — circling the aldehyde slowly, the near specks the quicker in their turning, a slow
  vortex that keeps the eye on the middle;
- `?sillage=still` — still air: each speck wandering a few pixels about its place (Brownian, as a
  molecule in still air goes), coming and going slowly;
- `?sillage=breeze` — carried across the room left to right on a slow, wavy air, passing behind the
  aldehyde.
Each was looked at as a clip made frame by frame (the page's clock driven by hand, a picture every
thirtieth of a second) and as a long exposure of six seconds of it, which shows which way the specks
go. Once the owner chooses, the others come out of the code.

**How it was tested**: `tests/formula.spec.js` — **`the last stage carries the Menu's eight pages … on an
orbit round the aldehyde, each beside its electron`** now also asks the ring be over a third of the
window wide either side, every name smaller than the grid sets it, and every name well clear of the
aldehyde's cloud (outside its oval by more than a third as far again; it was outside it at all);
**`the orbit's ring is one even, still line, its far half fainter than its near half`** (new — read at
up to seventy-two places round it, clear of the names and their electrons: lit all the way round, the same a
second later, the near half over a quarter brighter than the far, and even along it; and none of
`ORBIT_TURN`, `ORBIT_OFF`, `ORBIT_BACK` or `ORBIT_TONES` in the code); **`the sillage's movements to
choose from: each, asked for by the address, draws in the room and moves`** (new — each of the four
with no error, its specks between the ring and the aldehyde as thick as the sillage as it is near
enough — measured between 0.6 and 1.05 of it — and the room a different picture a second and a half
later); **`the orbit is drawn …`** reads each electron close round it (it is a point now); and **`the
electronegative hand draws the sillage's specks to it`** holds the hand out in the room beyond the ring,
which stands further out than it did. By eye, screenshots at 1440, 1920, 1280 × 800, 1280 × 680,
1024 and 960 wide, at rest and under the hand, close in at twice the pixels.

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
- **`the page waits at the title until it is scrolled, and one turn of the wheel glides it to the names
  in one gradual movement of about four seconds; one turn up, all the way back`**, **`the rest of a turn
  is the same scroll, and a turn the other way turns it round without a jolt; the scrollbar lets go`**
  and **`on a phone one swipe plays it all the way, and the page's own scrolling is held off`**
  (2026-10-04; a stage at a time on 2026-10-03, last).
- **`the last stage carries the Menu's eight pages, in its order, on an orbit round the aldehyde, each
  beside its electron`** — against `SITE_LINKS` in `nav.js`; and nothing of the chemicals left
  (2026-10-04; four either side, scattered, until then).
- **`the orbit is drawn round the aldehyde, and a name under the hand lights its electron and the ring
  round it, in gold`** and **`on a narrow window there is no orbit, and the names stand two by two as
  they did`** (2026-10-04).
- **`the orbit's ring is one even, still line, its far half fainter than its near half`** (2026-10-04,
  later) and **`the sillage's movements to choose from: the page's own, and each asked for by the
  address, draws in the room and moves`** (2026-10-05).
- **`a reload opens at the title, the names never shown before the page has placed them`**.
- **`five stages, smoothly: the title, the title gone, the aldehyde upright, its formula, and the
  names`** — each stage in turn (`data-stage`, `data-state`: cloud, turned, formula, drift): the
  title gone; the lone pair's violet moved to the top; the atoms named only at the fourth, O above
  C, the H either side below; the names only at the fifth, in the sillage (counted with the names
  hidden, a few specks in every box down both rooms); and back.
- **`the turn upright is prolonged and smooth: its leg the longest, and never quick`** — the
  second of `data-legs` the longest by half again; from a key, the turn takes over 1.8s and never
  goes faster than 100° a second (2026-10-01).
- **`the wheel scrolls it smoothly, as far as it is turned and back, and nothing snaps`** — on the
  hand-driven page (`?auto=off`): three notches, the stage followed frame by frame: never a jump, never
  back, a glide to exactly as far as they send it, and, once at rest, it stays where it stopped.
- **`the sillage comes up as the last stage comes: specks afloat in the room on every side, nearly as
  many at its edges as by the aldehyde, nothing streaming out of it, and nothing of the drift or the lines
  left`** — read still, the names hidden and the orbit's ring and electrons left out of what is counted:
  none before the last stage, some as it comes, at the window's edge as soon as anywhere, more once it
  is; specks above and below the formula and in all four corners; at the edges at least half as many to a
  pixel as just outside the cloud (2026-10-05; until then it read more just outside the cloud than at the
  edges, the sillage spreading out of the aldehyde).
- **`a name is quiet until the hand comes to it: then it comes up gradually to the whole of
  itself`** — under 45% at rest, part way after a quarter of a second, whole after; no mask; the δ−.
- **`the electronegative hand draws the sillage's specks to it`** — with `?molecule=full`, every
  speck drawn, the names hidden, the hand well off the orbit's ring.
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
- `tests/landing.spec.js`: **`the stage's ground is a little darker, and the address can put the old grey
  back`** (2026-10-05).
- **What the tests count as lit** (`litPer` in `tests/formula.spec.js`) is a pixel 19 above the
  stage's ground, read off `--stage-ground-rgb` (2026-10-05). It was a fixed 50, which was 19 above
  the old grey; the ring and the specks are added to the ground, so the darker ground darkened them
  by as much, and the ring — a faint hairline — fell under 50 and its test failed with the ring
  plainly drawn.
- **`without the 3D library the last stage is the eight names, plainly, and a name still asks
  first`**.
- **`on a phone the names stand two above and two below the formula each side, scattered a little,
  in the sillage, and nothing scrolls sideways`**.
- **`the aldehyde stops drawing once the stage is off the screen`** (with the map on).

`tests/landing.spec.js`: **the home page is the stage alone** (two slides, the sentence and the map
kept whole in the template, none of their scripts loaded, the switch off) and **with the switch on
they come back after the stage, as they were**; the Scroll button and an arrow key glide it all the way
in one movement, and on the hand-driven page the keys go a stage at a time;
the Scroll button fades over the first leg; **the corner block is gone** and the line under the
title reads *A Perfume Portfolio*; both slides stand in front of the aldehyde; the long move and its
frames with the map on. The map's, the
paper's, the way out of the map's and the sentence's own tests all run with `?map=on`. By eye: one turn of a
wheel, and a trackpad's flick, from the title (it glides to the names in about four seconds, without
stopping) and one back up; turn the other way part of the way down; point at the names (each electron
and the ring by it light gold) and at the aldehyde, press a name; look at the orbit at a few window
sizes, and narrow the window past 900px (the orbit goes, the names stand two by two); on a phone, swipe
and tap. The sillage's movements: the home page with `?sillage=diffuse`, `rise`, `swirl`, `still` or
`breeze` on its address, scrolled to the names; the old grey with `?ground=was`.

## Known issues / TODO

- The numbers: `--stage-leg` (how much scrolling a stage takes) in `style.css` and `LEGS` (how many
  of them each leg is) in `landing.js`; how long one scroll takes the whole way (`AUTO_MS`, four
  seconds) and a short way at least (`AUTO_LEAST`), and how much of a turn sets it going or turns it
  round (`PLAY_FROM`, `PLAY_TURN`, `PLAY_GAP`, `SWIPE`) in `landing.js`; the orbit's shape and where
  each electron stands (`ORBIT_TILT`, `ORBIT_TALL`, `ORBIT_PAST`, `ORBIT_WIDE`, `ORBIT_MARGIN`,
  `ORBIT_GAP`, `ORBIT_AT`) in `landing.js`, the names' size on it (`--orbit-size` in `style.css`), and
  how it is drawn (`ORBIT_DENSITY`, `ORBIT_INK`, `ORBIT_FAR`, `ELECTRON`, `ORBIT_LIT`, `ORBIT_TONE`) in
  `molecule.js`; the sillage (`SILL_*`) in `molecule.js`; `TURN_W` (how quickly the turn upright follows) in
  `molecule.js`; `GLIDE_W`,
  `WHEEL_SCALE`, `FOLLOW_S`, `TITLE_GONE`, `CORNERS_GONE`, `NAMES_FROM`, `NAMES_OVER` in
  `landing.js`; `TURN_FROM`, `FORM_FROM`, `DRIFT_OVER`, `REACT_TITLE`, `TIGHT`, `FORM_PEAK`,
  `BOND_*`, `ATOM_SIZE`, `CLEAR`, `HAZE_*`, `HAND_*` at the top of `molecule.js`;
  how quiet a name is at rest, and how long it takes to come up, in `.formula-link`; the sheet's
  specks (`COUNT`, `GATHER_MS`) in `askSpecks` in `landing.js`.
- The glide is for a mouse wheel and a trackpad. A trackpad already scrolls smoothly on its own, and
  is glided anyway so the two feel the same; if it ever feels heavy there, `WHEEL_SCALE` is the
  number.
- Pages 3 and 4 are the owner's to bring back (`MAP_SLIDES`), or to let go of for good.
- The names are the Menu's by a test, not by being read from `nav.js`: a page added to the Menu is
  added to the stage's markup too (the test fails until it is); a ninth needs a row more in the grid
  **and a ninth angle in `ORBIT_AT`** — until it has one, the orbit is not laid and the names stand in
  the grid.
- On a narrow window (under 900px) there is no orbit — the names stand two by two as before, because
  the aldehyde is framed between their rows there. A ring there would mean moving the names, and so the
  aldehyde; it is open, if the owner wants one.
- **The sillage's movement is the owner's to choose** (2026-10-04, later): `afloat` is drawn since
  2026-10-05 (`AFLOAT_*` its numbers); `diffuse`, `rise`, `swirl`, `still` and `breeze` are there to be
  looked at on the address (`?sillage=`). Once one is kept for good the rest come out of `MOVE_GLSL`,
  with `SILL_MOVES` and the address switch, and the test of the others with them.
- **The ground is the owner's to keep or take back** (2026-10-05): `--stage-ground` in `style.css`
  (#171718; it was #1f1f20) and THEME in `tools/seo.py`; `?ground=was` shows the old. Once they are
  sure, the address switch (`ground-was`, in `index.html`'s head and `style.css`) can come out.
- The ring is still; a slow light travelling round it, or the electrons stirring a little on it, are
  possible and were left out, so that nothing at the edge of the window draws the eye from the middle.
- The glide is laid on the clock, so a machine that draws slowly shows it in fewer, larger steps rather
  than taking longer; a stall of over a quarter of a second is not counted (it waits instead).

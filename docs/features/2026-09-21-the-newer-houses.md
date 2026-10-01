# Ataraxia, Grande Parfums and Les Abstraits — and the shape they share

Date: 2026-09-21

Files: `house.js` (~313 lines, new), `ataraxia.js` (~385 lines, rewritten 2026-09-22),
`grande.js` (~265 lines, new 2026-09-22),
`houses/ataraxia.html`, `houses/grande-parfums.html`, `houses/les-abstraits.html` (all new),
the `house-*` and `human-star` rules in `style.css`, `tests/houses.spec.js` (new),
`images/Ataraxia/`, `images/Grande/`, `images/Les-Abstraits/`; and the four places a new
house has to be added — the frame and the Fragrances rows in
`categories/scent-descriptions.html`, the `PAGES` lines in `search-page.js`, and the
footer chain through `houses/almost-human.html`.

## What it is

Three houses arrived in one round, and the site went from three to **six**. The owner
asked for them in one message and gave three quite different amounts to go on, which is
why the three pages are three different states of finished:

| | what was given | what was built |
|---|---|---|
| **04 Ataraxia** | a theme, then the bands that replaced it, then on 2026-09-22 the five fragrances' **names** | the drawing, whole and rebuilt once; five named fragrances with two-part notes. The writing is still the owner's. |
| **05 Grande Parfums** | an introduction, fifteen write-ups, a list of the house's fragrances, and *"Idk the theme to be honest"* — then, a round later, *"subtle designs please"* | the writing, whole, and a ground that claims no theme. |
| **06 Les Abstraits** | *"make the page for four fragrances for now"*, then on 2026-09-22 the four **names**, then on 2026-09-23 the **writing** | four named fragrances, all four with notes off the house's own page, and the owner's writing for the house and every one of them. |

## The shared shape, and why house.js exists at all

Pineward, ADAR and Almost Human each carry **their own copy** of the same two hundred
lines: the part-opening on a measured height, the rank down the side, and taking a
photograph off the page when its file is not there. That was the honest price of keeping
page scripts standalone while there were three of them, and it is written up as such in
Almost Human's report — *"the obvious candidate if a shared module is ever wanted"*.

Three more copies would have made **six**, and six places to fix one bug is not a
convention, it is a liability. So `house.js` is that module. The three new pages load it;
the three older pages were **left alone**, because refactoring three working pages and
their tests in the same round as adding three houses is how you break all six at once.

**It uses the `human-*` class names.** They were written for Almost Human and are the
house shape's names now — `.human-page`, `.human-part`, `.human-body`, `.human-rank`. The
prefix is where they were born, not what they mean, and renaming them would touch three
working pages and their tests to no end.

`house.js` draws nothing. A house's ground is its own script and its own canvas, and the
two never speak to each other — they simply stand on the same page.

## Ataraxia: the bands

**The page is dark gray, and bands of glowing white particles cross it at their own
angles.** The owner asked for exactly that, and for one thing more that decided how the
whole drawing is built: *"I want them to go behind the text. Idk how but make it so that
the readability is good."*

| | |
|---|---|
| **a band** | a spine crossing the window at its own angle, with specks scattered about it — heaped along the middle and thinning to nothing either side, so a band has a bright core and no edge you can point at. |
| **the crest** | a swell of brightness travelling along a band's own length on its own slow clock, eleven to twenty-three seconds a pass. **The specks never move**; what moves is where the light is. That is the whole of the glow. |
| **the kindle** | what answers the hand: the specks within reach of the pointer burn brighter, eased in and out so it arrives rather than switching on. |

Each band leans six to twenty-six degrees off flat, and the sign is rolled with a memory
of the last one, so two can lean the same way but three cannot — rolled freely, a run of
four leaning the same way reads as a pattern rather than as weather.

### What replaced a churchyard

Angels and crosses stood down both margins here for one round, cut out of specks and
perfectly still — *ataraxia* said as a behaviour. The owner asked for them gone: *"Remove
the ataraxia crosses and angels."* Nothing of it is in `ataraxia.js` now: no angel, no
cross, no plinth, no lean, no halo, and no light crossing the window. The glossary keeps
the words, because they are still what the owner will call the thing they remember.

The bug that page was built with, and the two rounds of fixing it, went with it — a
standing that had to be sized to fit the clear part of its margin is not a problem a band
crossing the whole window can have. It is written up in the git history and is not
repeated here, because nothing in the file it was about survives.

### How the reading is kept, which is the whole design

The bands are **not** kept out of the middle of the page. A band that stopped at the
column and started again on the other side would not be a band, and going behind the text
is what was asked for. Two things keep the reading instead:

- **The quiet.** A speck standing over the column is drawn at **`QUIET`** — 0.26 — of its
  strength, easing in over 96px either side so there is no line down the page where it
  begins.
- **The bloom stops before the column.** A speck's core is a pixel or two and costs a
  paragraph almost nothing even at full strength; what would wash out a line of text is
  the **bloom** around it, which is soft and fourteen times as wide. So the bloom is
  scaled by `hush³` and is gone long before the writing.

**The bloom was a hard cutoff first and that was wrong.** Refusing to draw one anywhere
`hush` was under 1 stops it dead at a line you cannot see but can absolutely tell is
there — and on a 1440 window that line is only 154px in from each edge, so the bands
glowed in two narrow strips and were a grey dust everywhere else. Cubed, the glow falls
away as it comes in towards the column.

### How the glow is drawn

Every speck is a core: one `fillRect`, and cheap. Only a speck brighter than `GLOW_FROM`
is **also** given a bloom, which is one pre-drawn sprite scaled to size. That is
deliberate twice over — it keeps the count of expensive draws in the hundreds rather than
the thousands, and because it is the **crest** that pushes a speck over that line, the
bloom travels along the band with it. The whole frame is composited with `lighter`, so
where two bands cross, the crossing is brighter than either.

### The page's colour is five tokens

`.ataraxia-page` redefines `--bg`, `--bg-2`, `--line`, `--ink` and `--muted` on its own
body class, the way the search page and the contact sheet do. Every `human-*` rule
already draws in those, so setting them turns the whole page over at once and touches no
other page.

**Dark gray, not black.** ADAR next door is `#07070a` and means it; this is `#1b1d21`
(it was `#212328` until the owner asked for it *slightly* darker on 2026-09-24), which is
dark enough for white additive specks to read as light and light enough not to be a hole.

**One shared token had to be added for it.** A handful of rules spend the ink *at an
alpha* — the hatched placeholder, the dotted leader in a fragrance's row, the rank down
the side — and `rgba()` cannot take a hex, so they were written out as
`rgba(23, 23, 15, …)` by hand. They were the one thing on a house page that did **not**
follow a page turning its tokens over, which is how the rank came out black on dark gray.
`--ink-rgb` on `:root` is the same colour said as three numbers, and `.ataraxia-page`
redefines it with the rest.

**It still spends no accent colour at all**, like Almost Human. The bands are white and
the page is gray.

## Grande Parfums: fifteen written, two waiting

All of this house is the owner's writing, from an expo. **Seventeen fragrances**: fifteen
written up, and **Genesys** and **Lounge Leather**, which they have not smelled, as names
at the foot with nothing behind them — the arrangement Pineward's eight have.

**The order is alphabetical, which they asked for in as many words**: *"Ill ask that you
arrange them alphabetically, as I will input them non-alphabetically"*. They sent the
fifteen in no order at all, so this is the one thing about the house that could quietly
be wrong and look completely fine. There is a test, and it compares the list against
**itself sorted** rather than against a list written out again — a list written out again
is the same mistake twice if it was made once. A number sorts before a letter, so
*5 Years Anniversary* is 01.

**Four names are spelled as the house spells them, not as the owner typed them.** They
sent a screenshot of the house's own list precisely so the names would be right, so:
*Dreaming Maldives* (they wrote Maldieves), *Giardino di Sorrento* (Di), *Karak & Shisha*
(Shisha and Karak), *5 Years Anniversary* (5 Year). That is the sanctioned kind of
correction — it turns a word into *the same word*. **Their prose is untouched**: `coffe`,
`wont`, `cant`, `IMO`, and `Cookie something (?)`, which is a title because they flagged
their own uncertainty about the name and that is theirs to resolve.

### The star

*"make a handdrawn star next to this one"* — on Vintage Memoir, which they called their
favourite from the house. It is an **SVG path with every point nudged off true and every
edge bowed**, so it is a star somebody drew rather than one a computer worked out, and it
is stroked rather than filled for the same reason.

The test asks that it is a drawn path with curves in it and no straight lines. That looks
pedantic and is not: a typed `☆` is indistinguishable from this in a screenshot and is
exactly the thing the owner did not ask for. Proved by typing one — the test fails.

### It has a ground now, and it says nothing about the house

The owner asked for *"some particles and effects for grande parfums. subtle designs
please"*, and the second half of that is the brief. `grande.js` rises a field of fine
specks slowly up the window — a **drift** — each on a clock of its own, fading in as it
starts and out as it goes, so nothing on this page ever appears or disappears. About one
in fourteen is a **mote**: a little larger and a little plainer, so the drift has
something to catch the eye without anything in it being bright. Bring the pointer near
and the specks around it **lean** towards it and draw a shade more plainly — they do not
rush it and they do not stop; they lean.

**It is deliberately not this house said as a behaviour**, which every other drawing on
the site is. Pineward is a wood, ADAR a void, Almost Human a crowd, Ataraxia bands of
light. The owner has still not said what this house is — *"Idk the theme to be honest"* —
and drawing a theme for them would be putting words in their mouth. So this is paper with
something in the air over it. **When they say what the house is, `grande.js` is the file
to replace**, not to extend.

It lives on the **window**, not down the document, which is the opposite of the wood on
Pineward and the bands on Ataraxia and is right for the same reason Almost Human's rain
is: a thing that is rising reads as weather in the room you are in. Anchored to the
document it would slide down as you scrolled and up as it rose, and the two would fight.

#### The one thing that was wrong

**A speck's lifetime is worked out from its speed, not rolled apart from it.** The first
version rolled a speed of 4–17 pixels a second and a life of 9–23 seconds independently,
which meant a slow speck lived and died in **thirty-six pixels**. Every one of them is
born at the foot of the window, so the whole drift was a smudge along the bottom edge of
the page and the other nine-tenths of it was empty. That is exactly what the first
screenshot looked like. A speck now lives exactly as long as it takes to rise the height
of the window, and there is a test that counts how many are in the top half.

### The count is seventeen, not sixteen

The owner said sixteen. Counting what they actually sent gives seventeen: the fifteen in
the screenshot, plus **White Label**, which they wrote up and which is not in the visible
part of that list, plus **Cookie something (?)**, which is in neither. The screenshot
looks cut off after *Vintage Memoir* — alphabetically that is exactly where White Label
would be. **Left at seventeen and raised with the owner**, rather than quietly dropping
one to make the number they said.

## Les Abstraits: four, and nothing else

*"make the page for four fragrances for now"*. Four parts, no names, no writing, no
ground.

**One name is known and is deliberately not used.** The owner mentions *"Belle Ame by Les
Abstraits"* in Grande Parfums' Vintage Memoir. Which of these four it is, and how they
want it spelled, is theirs to say.

## Nothing here was guessed at

Two houses arrived with no writing at all, and the standing temptation was to invent some.
Nothing was. No fragrance has a made-up name, no house has an invented theme, and every
unwritten paragraph says it is unwritten in a dashed box (`p.human-waiting`) rather than
standing in as prose. An unnamed fragrance is *Untitled*, set in italic muted type
(`.human-untitled`) so a list of them reads as work still to come rather than as a house
full of things called Untitled. There is a test that the two unwritten houses say so and
that the written one does not.

## How to test it

```bash
npm test -- tests/houses.spec.js
```

Fourteen tests. **Six of them were proved against the real fault** before being
trusted, which is the rule here — and the first one was proved twice, once in each
direction:

- **`the bands cross the whole window, and go quiet over the writing`** — the owner's
  readability ask, measured rather than assumed, and it has two halves that fail in
  opposite directions. Sampling three zones down eight screens — the clear margin, the
  column proper, and the easing band in between thrown away — it asks that there **is**
  ink over the writing (bands kept out of the middle: with `QUIET` at 0, it fails) and
  that a lit pixel there is far fainter than one beside it (no damping at all: with
  `QUIET` at 1 it reads **88.1 over the writing against 64.1 beside it**, and fails).
  **The middle zone matters.** Measured against the outer edge of the easing instead, the
  first half passed with the bands kept out of the column entirely, because the easing
  band alone satisfied it.
- **`Ataraxia is dark gray, and its writing is light on it`** — luminance rather than
  hex, because a page turned over by redefining its tokens can be turned **half** over,
  and light-on-light is what that looks like. With the token block cut back to `--bg`
  alone, it fails on the heading.
- **`the specks kindle under the pointer, linger a moment, and go out again`** (it was
  *…and go out again* until they lingered — see the foot) — it counts one corner
  rather than the whole canvas, because the crest travelling along each band moves the
  total on its own and would swamp the reading. With `HAND_LIFT` at 1 it fails.
- **`Grande Parfums has a drift, and it is a quiet one`** — three failures in one, and
  they pull against each other: there has to **be** a drift, the average speck has to
  weigh under 90 of 255 (subtle was the whole brief), and a fifth of it has to be in the
  top half of the window. With the lifetime rolled apart from the speed it reads
  **28 specks in the top half against 191 in the bottom**, and fails.
- **`Grande Parfums is in alphabetical order`** — with one fragrance moved out of order,
  it fails.
- **`the standout star is a drawn path`** — with a typed `☆` in place of the SVG, it
  fails.

The rest: all six houses on the sheet in their own order; the two unsmelled fragrances
being names at the foot rather than parts; the shared shape working on **all three**
houses (a part opens on a measured height, and the rank has one tick per fragrance);
the rank filling from the first pixel of scroll and finishing full; the pages being all
of their writing with the scripts blocked; and an unwritten fragrance saying so.

The missing-photograph 404s are allowed for, the way Almost Human's spec allows them:
not one of these houses has its pictures yet, and every part asks for the file it wants
by name so it shows the moment that file is there.

By hand:

```bash
npm run serve    # then http://localhost:8123/houses/ataraxia.html
```

Put the pointer on a band and watch the specks under it come up, then leave it alone and
watch the crest travel. Then read a paragraph with a band crossing behind it — that is
the thing the whole drawing is arranged around.

```bash
npm run serve    # then http://localhost:8123/houses/grande-parfums.html
```

And this one is meant to be nearly invisible. If you can see it without looking for it,
it is too strong.

## Known issues / TODO

- **Les Abstraits is written now** (2026-09-23) — see the section at the foot. **Ataraxia
  is named and still unwritten.** The owner gave both
  houses their fragrances' names and their notes on 2026-09-22 and kept the writing, which
  is a state this site had not had before: a house that reads as researched and unwritten
  rather than unstarted. Neither page has an *Untitled* on it any more; both still say on
  every part that the writing has not arrived. The notes are in
  [the notes' report](2026-09-21-the-notes.md).
- **Ataraxia's drawing no longer matches the house's stated subject.** The owner said the
  house's theme is angel statues and crosses, and then asked for the churchyard that drew
  it to be replaced by the bands. The standfirst still says the subject is statuary,
  because that is their statement about the house rather than about the page; the two are
  deliberately allowed to differ and are theirs to reconcile.
- **Grande Parfums' ground claims no theme.** It is a drift of specks and deliberately
  says nothing about the house, because the owner still has not said what the house is.
  It is a holding answer to *"subtle designs please"*, not the house drawn — replace it
  when they say.
- **No photographs anywhere.** All three folders in `images/` hold only a README naming
  the files their page is already asking for.
- **Neither Ataraxia nor Les Abstraits is in the Fragrances table**, and that is correct
  rather than outstanding: that table is the **individual** fragrances — the ones with no
  house — and every one of these has a house. They are reached through the contact sheet,
  like the other four.
- **Seventeen against the owner's sixteen** on Grande Parfums — see above.
- **The three older houses still carry their own copies** of what `house.js` now does.
  Moving them over is a clean follow-up and was deliberately not done in the same round
  as adding three houses.

## 2026-09-23 — Les Abstraits, written

The owner sent the whole house: a tagline under the name (*Eugen’s ideas and Antoine
Lie’s execution*, which is also its line on the contact sheet now), an introduction, all
four fragrances, and a paragraph for the very end of the page.

- **The writing is theirs, verbatim.** The only thing taken out was the invisible
  left-to-right marks the paste carried, which are formatting, not writing. Their spellings
  stay in the prose — *Bella Âme*, *La Doulour excuise*, *oppoponax*, *Antoine lee* — and
  the **titles** stay as the house spells them, which is the one correction this site
  makes.
- **One sentence stops half way** — *The vibe I get from Les Abstraits is that it is
  stuff* — and is printed that way on purpose. It is theirs to finish. (**Taken out** at their
  word on 2026-09-25 — see the last section.)
- **Stages** where they wrote them (Belle Âme and La Douleur Exquise: Top, Mid, Dry Down);
  plain paragraphs where they did not (Des Cendres, Philosopher's Walk).
- **La Douleur Exquise quotes Fragrantica** on where its materials come from. It is set as a
  quotation (`.human-quote`), set in and muted, with the source under it as a link.
- **The last word opens a new window**, as asked in capitals — *"CLAUDE MAKE THIS OPEN A
  NEW WINDOW"*. It is `.human-after`, after the fragrances and before the credit, linking
  to lesabstraits.com/pages/about with `target="_blank"` and `rel="noopener noreferrer"`.
- **The drawing in Des Cendres.** In the middle of the writing the owner left a note:
  *"(claude, maybe try to generate a picture of this)"*. That was addressed to whoever
  built the page, so it is not printed; a drawing stands where it was
  (`images/Les-Abstraits/des-cendres-road.svg`, `.human-scene`). It is an ink drawing in
  the site's own manner, of their scenario exactly: a two-lane road running away to the
  horizon, a pine forest of Scots pines and ponderosas on the left with weeds and small
  white flowers along the verge, gated front yards with houses on the right, a fire of
  logs lit in the nearest yard, and its smoke billowing across the road into the pines,
  under a low summer-evening sun. It was generated from a seeded script and is about 90KB
  as served. The credit line at the foot says it was drawn for the page.
- **Links inside the writing** are styled on this page only (`.abstraits-page .human-text
  a`): Almost Human already has links in its writing, and a site-wide rule would have
  restyled them.

Tested in `tests/houses.spec.js`: *Les Abstraits ends with Antoine Lie's paragraph, in a
new window* and *Des Cendres carries its drawing, and not the note that asked for it*; and
the *an unwritten fragrance says it is unwritten* test now holds Les Abstraits to having
**no** dashed boxes, beside Grande Parfums.

**Left alone, and worth the owner knowing:** Des Cendres' card on the Favourites page still
says its own description has not been written. That card's writing is a separate thing
(a description and a commentary, matched by name), and copying this into it would be two
copies of the same words.

## 2026-09-23, later — Tombstone and Qimu & Musicians

Two more houses on the same shape (`house.js`), the eighth and the ninth, and the chain on
the Houses view stops at nine for now at the owner's word ("Keep houses only up to 9").

> make house 8 Tombstone. Tombstone has 5 fragrances. I want you to look them up, add
> them and add their notes. Ive added some pictures so you can add them too. Make house 9
> Qimu & Musicians. they have 4 fragrances I want you to look them up, add them and add
> their notes. […] to the two fragrances called Drummer and Guitarist, I want you to
> write: Description coming soon. in the description

- **`houses/tombstone.html`** — five, in alphabetical order: 3 Feet 5, Evergrow, No Need
  to Come By, Sing at My Funeral, Sweet Coffin. **3 Feet 5** is the house's own name (the
  owner's picture is called *3 Foot 5*). Each carries the owner's two pictures, the bottle
  and the house's card for it. **None is written**, so every part and the introduction say
  so in the dashed box, as Ataraxia's do.
- **`houses/qimu-and-musicians.html`** — four, in the order the owner numbered their
  pictures: Guitarist, Vocal, Bassist, Drummer, one picture each. **Guitarist and Drummer
  say "Description coming soon."** — the owner's words, as a paragraph of their writing,
  not as a placeholder box. Vocal and Bassist say in the dashed box that they are the
  owner's to write.
- **Nothing was written for either house.** The owner asked for the fragrances looked up
  and added, and for their notes; the writing on this site is theirs, so the standfirsts
  say only what the house is ("Five fragrances. The writing is still to come."; "Four
  fragrances, one to a player in a band, to be worn alone or together.") and neither page
  has a subtitle under its name.
- **The notes** are in `notes-data.js` under `tombstone:` and `qimu:`, by the rules in
  [the notes' report](2026-09-21-the-notes.md):
  - Tombstone's own site gave **Sweet Coffin** and **No Need to Come By** a divided list.
  - For **Sing at My Funeral** it names the top and heart and only *describes* the base
    ("earthy and woody elements"), so the house's two tiers stand above and Fragrantica's
    full list below — the two halves Haxan and Ataraxia use.
  - **3 Feet 5** and **Evergrow** have no page on the house's site that could be found,
    so theirs are Fragrantica's.
  - Qimu's own page gives **Vocal**. **Guitarist, Bassist and Drummer have none that could
    be checked**, and say *No information as of yet.* while naming the house's page. One
    search came back with a confident list for Drummer, said to be Parfumo's; asked again
    without leading it, the same search said that page carries no notes at all. That is
    the near miss the notes' report warns about — a list nobody can check — so it is not
    in the file.
- **Neither house has a ground of its own on its own page.** The owner has not said what
  either is. Each has **motifs** on the Houses view, though (stones in mist and petals;
  notes, a record and a line of sound) — see [the chain](2026-09-23-the-chain-and-its-motifs.md).
- **The credits** name the houses' own sites, **as an assumption**, as Tale's does: the
  owner left no note of where the pictures came from, and they look like the houses' own.
- **The footer chain** runs Tale → Tombstone → Qimu & Musicians → back to Pineward.
- `images/Tombstone/README.txt` and `images/Qimu and Musicians/README.txt` say what each
  file is. The owner's own names are kept, spaces and all, and none is big enough to need a
  web copy.

Tested in `tests/houses.spec.js`: `all nine houses stand on the contact sheet, in their
own order`, the shared-shape test run on both, the no-script test, the unwritten test on
Tombstone, `Tombstone carries its five, in alphabetical order, with both pictures each`,
`Qimu & Musicians carries its four, and Guitarist and Drummer say description coming
soon`, and `the houses are chained one to the next, and the last wraps round`.

> **Since written** — see the section below. The two houses' writing arrived on 2026-09-24,
> and the tests on it changed with it.

## 2026-09-24 — Tombstone and Qimu & Musicians, written

The owner sent the writing for both houses. It is theirs **verbatim** — including the
double space in Vocal's "Base  Dry down is still sweeter." — with only the invisible
left-to-right marks that came with the paste taken out.

- **Tombstone** has its subtitle, *A house that expanded on death*, its introduction, and
  four of its five fragrances written: Evergrow, No Need to Come By, Sing at My Funeral and
  Sweet Coffin, each in the stages the owner used. Three things were asked for in so many
  words:
  - **selectively linear** in bold (`<strong>`);
  - the house's own site linked — `https://tombstonefragrances.shop`, opening in a new
    window like every other link off the site;
  - "exclusion zone (give the definition if hovered)" in Evergrow. The words in brackets
    are an instruction, not writing, so they are **not printed**; the term is a
    `<span class="human-define">` whose `data-define` is shown in a small ink box above
    it when it is pointed at or focused (a phone gets it by tapping, which focuses it).
    The definition is written here, not the owner's: *An area closed off to people,
    usually after a disaster — the zone round Chernobyl is the best-known — where nobody
    may live and whatever was left behind is taken back by nature.* `.human-define` is in
    `style.css` beside `.human-quote`, and can be used on any house.
- **3 Feet 5** has the owner's one paragraph, and under it the dashed box saying *The rest
  of 3 Feet 5 will be filled in later.* — "add that the rest of the fragrance will be
  filled in later".
- **Qimu & Musicians** has its subtitle, *A house of music and fragrance*, an introduction
  that reads *I will write it later.* (the owner's words, as a paragraph rather than a
  placeholder box, because that is what they asked to be written there), and **Guitarist**
  and **Vocal** written in Top / Mid / Dry Down. Drummer still says *Description coming
  soon.*, and Bassist is still waiting.
- Both subtitles are also the house's **say** on the Houses view, which had none for
  either until now.

Tested in `tests/houses.spec.js`: `Tombstone is written, with its bold, its link and a
definition on hover` — which fails with the definition never shown and with it always
shown — and `Qimu & Musicians carries its four: two written, one coming soon, one
waiting`. The unwritten test now runs on Ataraxia alone.

## 2026-09-24, later — Ataraxia, written

The owner sent Ataraxia's writing: its subtitle, *A gothic avante garde house* (in place of
*light, crossing*, which was never theirs), the introduction, and four of the five —
Amaretto Jazz in the Melting Room, Vestibule, Deity and Spinal Fluid — each in the stages
they used (*Top / Middle / Base*; Deity's *Top 1 / Top 2 / Mid / Dry Down*; Spinal Fluid's
*Top / Mid / Dry down*). It is theirs **verbatim**, *avante*, *oppoponax*, *im*, *0/10,
would smell again.* and the Cyrillic *Басейн Лазурний* included, with only the invisible
left-to-right marks that came with the paste taken out; the colons after the stage names
are the stage labels' own. Amaretto Jazz's closing paragraph, the short of it, stands after
its Base as a paragraph of its own. **My Doll's Makeup** is still theirs to write and says
so in the dashed box. The standfirst is now just *Five fragrances.*, as Tombstone's is.

### The spoiler

> (the following paragraph will be a dropdown paragraph with the button saying "spoiler
> alert". And even when you click it, the paragraph should be blurry, covered with the
> words "are you sure?", which if you click yes, then it will unblur it, and if you click
> no, then it will collapse it)

Spinal Fluid's Attack on Titan paragraphs are a `<details class="human-spoiler">` with
**Spoiler alert** on it. The owner's instruction is not printed. `house.js` makes it ask:
opened, the paragraphs are there but **blurred**, under **Are you sure?** with **Yes** and
**No**; Yes clears them, No shuts it again, and **every time it is opened it asks again**.
While blurred the words are also hidden from anything reading the page aloud and cannot
be tabbed into (`aria-hidden`, `inert`). It is drawn in the page's own tokens, so it
follows the dark ground. **Without JavaScript** it is a plain dropdown that opens onto the
paragraphs, never stuck blurred. Any house can use it: copy the block.

### Vestibule's notes, corrected

The owner gave Vestibule's divided list as it actually stands on the page — *Chocolate Bar,
Carolina Reaper / Chocolate Cake (Amandină), Red Hot Chilli, Wasabi, Pollen, Antique Shop,
Turmeric, Root Beer / Cocoa Pod, Edamame, Pistachio, Old Book, Halva, Potato* — and it
replaces the lower half of its window, which had read *Chocolate*, *Chocolate Truffle* and
*Cake*, *Beer*, *Old House*, *Soybean*. The house's own half is unchanged. The Note Library
gained records for the names it had never seen (Chocolate Cake, Cocoa Pod, Edamame, Root
Beer) and folded the rest into the notes they are.

Tested in `tests/houses.spec.js`: `Ataraxia is written, and Spinal Fluid's spoiler asks
before it shows` (fails with the paragraphs never blurred, and with No not shutting it) and
`Vestibule carries the notes the owner corrected`. The unwritten test now expects exactly
one waiting box on Ataraxia, in My Doll's Makeup.

## 2026-09-24, last — Des Cendres' dry down

The owner added a closing paragraph to Des Cendres on Les Abstraits, verbatim: *On the dry
down, it is quite smoky, with traces of galbanum remaining, The scent profile is more or
less the unchanged.* It stands after "this is a masterpiece" as a paragraph of its own;
Des Cendres has no stage labels, so it was not given one. Tested with Tale's Water Me in
`tests/houses.spec.js`: `Des Cendres ends on its dry down, and Water Me has a Mid and a
Dry Down`.

## 2026-09-24, last — nothing under the subtitle, and the subtitles in title case

> remove the lines that are below the subtitle in the houses, so that lines such as
> 'Replace this line with your own standing first paragraph — the one that says what the
> house is before the introduction begins.' should be removed from all of the houses. and
> the subtitles like 'The house that smells like trees' should have every other word
> capitalized (like the titles of books in the real world)

- **Every house's standfirst is gone** — the line under the name and subtitle — from all
  nine that had one, taken out of the markup rather than hidden. Two were placeholders
  (Pineward's and ADAR's, the "Replace this line…" the owner quoted), but the rest were
  words on the page: **Almost Human's was the owner's own** (*Almost Human is a house
  launched in 2026 …*), Grande Parfums' said the two still to smell would be revisited,
  Tale's repeated its line from the Houses view, Qimu's said *to be worn alone or
  together*, and Ataraxia's and Tombstone's said *Five fragrances.* The owner said all of
  the houses, so all went. `.pine-standfirst` and `.adar-standfirst` went from the
  stylesheet with them; `.human-standfirst` stays, because the individual fragrances'
  page — which is not a house — still carries one.
- **Title case**, as a book's title is set: every word capitalised but the short joining
  ones (a, an, the, and, of, on, at, to, …) after the first — *The House That Smells Like
  Trees*, *A House That Very Deservedly Won the Art and Olfaction Awards in 2025*, *A
  Gothic Avante Garde House*. On each house's page under its name, on the Houses view
  under each picture, and in Pineward's and ADAR's `<title>`s, which carry theirs.
  Grande's page subtitle, *Art Niche Expo 2026*, was already so. The owner's own words
  otherwise unchanged — *avante* stays.

Tested in `tests/houses.spec.js`: `no house has a line under its subtitle, and every
subtitle is in title case` — every house page and every say on the Houses view. Fails with
a subtitle put back in sentence case, and with a standfirst put back.


## 2026-09-24, night — Ataraxia slightly darker, and its kindle lingers

> Make the ataraxia gray background SLIGHtly darker. also make there to be a delay of the
> particles turning off after you hover them.

- **The ground is `#1b1d21`**, from `#212328`, and `--bg-2` and `--line` came down with it
  (`#24262b`, `#373a42`). Its luminance is about 29 against ADAR's 7: still gray.
- **The kindle lingers.** A speck the pointer has passed over stays lit for `LINGER_HOLD`
  (0.5s) after the pointer has gone and then goes out over `LINGER_FADE` (1.5s). Each speck
  keeps how hot it was last made and when (`warm`, `warmAt`), so the glow stays with the
  speck itself — it does not smear across the page when it is scrolled — and the hand
  making it hotter than it is keeping starts its clock again. With reduced motion it is as
  it was. The owner did not say which particles; this and the Houses view's are the two
  that light under the hand on the pages that note was about (see [the
  axis](2026-09-24-the-axis.md)).

Tested in `tests/houses.spec.js`: `the specks kindle under the pointer, linger a moment, and
go out again` — the same corner as before, now also read 150ms after the pointer has left
(still over 1.15 times the ink with the pointer away; it fails there against the old code)
and 2.6 seconds after, by when it has gone back down. `Ataraxia is dark gray` still holds
at the darker ground.

## 2026-09-25 — grounds for four houses, and paper of their own

> to the SD page, houses tab, give Tombstone some animations. I want it to feel very dead
> and funerary. I want there to be a reflection in the design, and I want it to feel
> ephermeral. I will think of the particulars later. For the house grande, give it a
> particle effect of bubbling (i dont want it to seem comical or drawn up like with tale),
> but particles that rise up and pop more or less into a bunch of other smaller particles.
> Les abstraits should also have an animation; i want there to be an old armoire on one of
> the sides, which feels old, and has some iris notes in it. I want it to feel like the
> perfume belle ame. ... On the other side, i want there to be a dripping effect from the
> top of the page to the bottom, where there will be a puddle. This puddle should start off
> as nonexistent and as the thing drips from the top of the page, then the puddle becomes
> larger and larger (capping at a specific size) For Qimu and Misicians, I want you to add
> some complex notes; and some 5 lines in which they will exist. I dont wan tit to be
> sloppy or out of place, and I want them to be nicely animated. When there are 5 lines,
> dont make them always 4/4 ... I want it to look complex. Overall the Qimu and musicians
> effect should be subtle though ... feel free to give them some colour in the background,
> the same way you have in the case of pineward (green) and tale (some muted orange) ...
> Qimu should be blue though; semi light blue.

"On the SD page, houses tab" is read as **the houses' own pages** — the Houses view's hover
motifs were asked for separately in the same message ([the
motifs](2026-09-23-the-chain-and-its-motifs.md)), and "the same way you have in the case of
pineward and tale" names pages. Each of the four now has a `<canvas class="human-field">`
and a script of its own, loaded after `house.js`, and each lives on the window except
Qimu's, which is carried down the page.

- **Tombstone — `tombstone.js`.** A still grey floor across the lower part of the window
  (`HORIZON`), and on it in the margins **stones** made of specks — a round-topped
  headstone, a pointed one, a cross, an obelisk — their edges kept whole and their faces
  only in part, so each reads as a cut shape, with two short lines left out of the face
  where an inscription would be. Under every one its **reflection**: the same specks
  turned over below the horizon, fainter, broken into streaks as still water breaks a
  thing, trembling more the deeper it lies (`RIPPLE_*`). **Ephemeral**: a stone gathers out
  of the mist along the floor, foot first (`STONE_GATHER`), stands (`STONE_STAND`), goes
  as smoke goes, top first (`STONE_GO`), and a different one gathers in its place a little
  later. Mist drifts along the horizon; ash falls and is gone before it lands. **The
  hand** rings the reflection where it touches it. Two stones a side on a wide window,
  one a side on a narrower one; on a phone, one at each edge and everything at
  `PHONE_QUIET`, because the writing runs almost to the edge there. These are a first
  answer — the owner said they would think of the particulars later.
- **Grande Parfums — `grande.js`, the drift made to bubble.** About half its rising specks
  (and every mote) now **burst** somewhere between a third and nine tenths of the way up,
  into four to seven finer specks (seven to eleven for a mote) that fly out, slow and fade
  (`BURST_*`). No rings, nothing drawn: a particle becoming several smaller ones. A shade
  more of them and a shade stronger than the drift was (`PER`, `ALPHA`). **"It says
  nothing about the house"** still stands — the owner has still not said what the house
  is, and the bubbling is what they asked for, not a theme.
- **Les Abstraits — `abstraits.js`.** **The armoire** in the left margin, sized to it and
  standing on the floor of the window, drawn in walnut specks — the same armoire as the
  Houses view's motif, with its door ajar on three irises and orris powder drifting out of
  the gap, faster while the pointer is near. It **builds up from the floor** as the page
  opens. **The drip** in the right margin: a bead gathers at the very top of the window,
  swells, falls the whole height and lands in **the puddle** at the window's foot, which
  is nothing when the page opens and grows with every drop to `PUDDLE_MOST` (or less than
  half the margin, whichever is smaller) and stops. Belle Âme, in the owner's own writing,
  is iris and iris butter, calm, "belongs in a museum", powdery at the end — the violet,
  the powder and the old walnut are that.
- **Qimu & Musicians — `qimu.js`.** Short **staves** down both margins, one under another
  the whole length of the page and **carried with it** — a score kept in the margins —
  engraved as the Houses view's are: a clef (a bass on the lower of a braced pair), a key
  signature, a **time signature** from fourteen real ones (4/4 one of them) and a change
  of time at a bar now and then, beamed runs, tuplets, chords with their accidentals,
  clusters, rests, slurs, and no dynamics or ornaments. **Animated**: a stave is written
  in left to right the first time it is reached, and then **played** — a faint playhead
  runs along it bar by bar, the staves taking turns, and each note lifts a little as it
  is reached and dies away (`PLAYED`, `RING`); notes near the pointer stand a shade
  stronger. Faint throughout (`LINE`, `NOTE`); on a window without margins the staves run
  across it further apart and at `QUIET`.
- **The paper.** Each page's tokens turned, Tale's way, with a few soft pools of the colour
  fixed to the window, Pineward's way — `body.grande-page` champagne (`#f6f2e8`),
  `body.abstraits-page` iris (`#f3f0f5`), `body.tombstone-page` ash grey (`#ecebe8`,
  lighter above the horizon and darker at the foot), and `body.qimu-page` **semi-light
  blue** (`#e2ebf6`), the only one you would call a colour. Plain hex and `rgba()`, never
  `color-mix()` — see Pineward's report for why. Each carries its own `--chrome-ground`.

Tested in `tests/houses.spec.js`:

- **`Grande Parfums' particles rise and burst into finer ones, with no bubble drawn`** —
  over three seconds, thousands of whole specks, hundreds of finer ones, nothing stroked.
  `Grande Parfums has a drift, and it is a quiet one` still holds.
- **`Grande, Les Abstraits, Tombstone and Qimu each have a paper of their own, and Qimu's
  is blue`** — none white, four different, Qimu's blue channel well above its red and
  still light.
- **`Tombstone's stones stand in the margins with their reflections under them`** — ink in
  the margins above the horizon; ink below it, and fainter; and over twenty-two seconds
  what stands in the margins waxing and waning (a stone does not stay).
- **`Les Abstraits has its armoire with iris on one side and a drip filling a puddle on
  the other`** — no puddle when the page opens; the armoire in the left margin; the iris's
  violet stroked; the drop at the very top of the right margin; the puddle growing.
- **`Qimu & Musicians keeps a quiet score in its margins, carried with the page`** —
  noteheads, times other than 4/4, nothing written but numbers, nothing over 0.6, and
  after a scroll of 200px every stave drawn 200px higher.
- **`with motion turned off the four new grounds are drawn and stand still`**.
- `without the scripts the new houses are all of their writing` now blocks the four new
  scripts too.

**Known issues.** Tombstone's stones are the owner's particulars-to-come. On Les Abstraits
the puddle lies under the rank's reading in the bottom right corner of a wide window; it
is kept at the very foot of the window so that the reading stays clear of it.

## 2026-09-25, night — Les Abstraits' drip down the whole page, into a beaker

> the dropping thing in des cendres should go all the way down, and should note the
> scrolling. additionally, I want the puddle to be more realistic, not just a circle of
> water. I want it to fall into a beaker, once the beaker starts overflowing, let it drip
> from that too.

"The dropping thing in des cendres" is read as Les Abstraits' drip — Des Cendres is one of
the house's four, and the drip is the only thing on its page that drops. `abstraits.js`:

- **The drip lives on the page now, not the window.** The bead gathers at the very top of the
  **page**; a drop lets go, quickens (`DRIP_PULL`) to the speed a drop falls at
  (`DRIP_MOST`, 820px a second) and falls **the whole length of the page**, past the writing
  as it is read. Everything is placed in the page's own length (`pageH`, measured on load, on
  resize, and whenever the body changes size — a part opening makes the page longer) and drawn
  where the page has been scrolled to, so scrolling carries the drops with the words. **It
  notes the scrolling**: a drop is drawn out by how fast it crosses the window — its own fall
  less the page's scroll (`scrollV`) — so scrolling against it streaks it, and the trail of
  specks flips to the other side when the page overtakes it. The armoire still lives on the
  window, as it did.
- **The puddle is a beaker.** At the page's own foot, in the right margin, a laboratory beaker
  drawn in glass hairlines (`GLASS`): the back and front of its rim with a lip, straight sides
  rounding at the base, a **pouring spout** on the side away from the writing, the glass's own
  thickness a hair inside one wall, and **graduations** — ticks up the front, 100 and 200
  marked, and *ml*. Every drop that reaches it fills it a little more (`FILL_DROPS`, ten, to
  its brim), the liquid tinted with the drip's own violet-grey, its surface an ellipse seen a
  little from above with a highlight for the meniscus, a ring spreading on it and a few
  splashes where each drop lands.
- **Full, it overflows.** Every drop after that comes over the spout: a wet run down the outside
  of the glass, and **a bead gathering at the spout and dropping** to the bench beside it,
  where **the spill** spreads — not a circle: an outline of several waves laid over one another
  (`spillShape`, fixed for the page), with a light on it and a ring when each drop lands, larger
  with every drop to `SPILL_MOST` (or what the window leaves on the spout's side).
- **The bench.** The beaker and the spill stand on a short ruled line with a tick at each end,
  `FOOT` (104px) above the page's foot — at the very foot the beaker stood under the rank's
  "04 / 04" reading in the corner of a wide window. The drip's column moved in a little
  (`dripX`, 58% of the margin from the window's edge) so the spill has room.
- **With motion turned off** there are no drops; the bead stands at the top of the page and the
  beaker at its foot, half full, and it is drawn again whenever the page is scrolled.
- **Nothing on the Houses view is carried by a page**, so there the drip still falls the height
  of the window — into the same beaker, which overflows the same way (see the motifs' report).
  The canvas carries `data-drops` and `data-spilled` for the test to read.

Tested in `tests/houses.spec.js`:

- **`Les Abstraits has its armoire with iris on one side and a drip down the whole page into a
  beaker on the other`** (it replaces the puddle's test) — the armoire and the iris's violet;
  the bead at the very top of the page, and gone from the window once the page is scrolled
  400px; nothing at the foot of the window while the page is at its top; at the page's foot a
  beaker, the drops landing in it, and within about twenty seconds it has overflowed
  (`data-spilled`) and filled.

**Known issues.** The spill's width is capped by what the window leaves beside the spout; on a
narrow desktop window it stays small.

### Later that night — slower, filling less, and a diagram of a beaker

> make the dripping slower, less filling, and then fix it so the beaker looks more put
> together. I want it to look more like a diargram than a sketch.

- **Slower**: a drop every 2.2–3.4 seconds (`DRIP_EVERY`, it was about half that), gathering
  for longer at the top (`DRIP_HANG`), and falling no faster than 520px a second (`DRIP_MOST`,
  it was 820). **Less filling**: sixteen drops to the brim (`FILL_DROPS`, it was ten), so the
  beaker takes the best part of a minute to overflow, and the spill grows more slowly and less
  far (`SPILL_MOST`).
- **The beaker is drawn by `beaker.js`**, new, which the house's page and the Houses view's hover
  both load — so they are one beaker. It is **a diagram** where it was a sketch: straight glass
  walls in even hairlines with a rounded foot, a flared lip and a spout; the glass's thickness a
  faint second line inside the wall; graduations every 25 ml, the longer every 50 and numbered,
  to 250 (`CAPACITY`), and *ml*; the liquid a flat tint with a meniscus and **a pointer** at its
  surface giving its reading; a hatched **bench** with a tick at each end; and **the spill** a
  flat lens with rings in it, where `spillShape` was a blot of several waves (it is gone). The
  falling drop is a clean teardrop (`Beaker.drop`). `abstraits.js` keeps only the drip and hands
  the beaker to `Beaker.make()`; `les-abstraits.html` loads `beaker.js` before it.

Tested: the page's drip test now runs **on a clock of the test's own** (`page.clock`): the
minute and more the slower beaker takes to fill is run through rather than waited out — two
and a half seconds at the top, then eighty at the foot, after which the drops have landed, the
beaker has filled and it has spilled.

### Clothes in the page's armoire too

Asked for the hover's armoire (*"put folded clothes and hangers with something on it in the
armoire"*) and then, asked which, for **both**. On the page the armoire is drawn in specks, so the
clothes are too (`dressUp()`, a third list `clothes` beside `wood` and `inside`, every speck
carrying its own colour): **a rail** across the top of the open half on a bracket at either end,
and on it **a coat** (lapels, its front edge, a belt), **a dress** (a waist seam and pleats) and **a
shirt** in a soft slate blue (its placket and buttons — white disappeared on the iris paper), each
on a wire hanger with its hook over the rail, their outlines in specks and their cloth in thinner
specks inside; **a shelf** six tenths of the way down with **folded clothes** stacked on it in two
piles, each fold its own width and colour with its folded edge rounded. **The irises stay**, under
the shelf now (their flowers lower, `top` at 28–34% of the door's height where they were 52–66%).
The clothes build up from the floor with the rest of it.

Tested: the page's armoire test also reads the colours its specks are drawn in, and finds the
coat's, the dress's and the shirt's.

## 2026-09-25, last — Guitarist's dry down

At the owner's word, the last paragraph of Guitarist's dry down (Qimu & Musicians) — *It is
also very airy on the dry down. This would be a wonderful and unique summer scent.* — is
replaced, in their words: *It eventually turns quite abrasive as all the notes merge together.
The fig leaf is there, but it would not have been recognized had you not smelled it in the top
and/or mid.* Tested in `tests/houses.spec.js`: `Guitarist's dry down ends on the fig leaf
merging into the rest`. (The same round, Water Me gained a line — see [Tale
Parfums](2026-09-23-tale-parfums.md).)


## 2026-09-25, last — Grande's drift as strong as its hover; Les Abstraits' half sentence out

Files touched: `grande.js` (the drift rebuilt), `houses/les-abstraits.html`, `abstraits.js`
(the beaker's fill), `tests/houses.spec.js`.

> Intensify the particles in grande parfums particle page (make it like the hover in SD)
> Remove the sentence "The vibe I get from Les Abstraits is that it is stuff" from les abstraits

**Grande Parfums' drift is drawn as its hover is.** The page's ground was the quietest thing on
the site — up to 420 fine specks, most of them barely there, rising the whole height of the
window over half a minute and about half bursting on the way. The Houses view's hover for the
same house (`rise` in `motifs.js`) is much stronger, and "like the hover" is taken literally:
`grande.js` now draws the hover's particle on the page.

- **More of them, and heavier**: a speck every 2,000 square pixels (it was 3,400), up to 640
  (it was 420), each at `ALPHA` 0.5 (it was 0.12–0.3) and 1.1–2.1px (it was 1.3), one in ten a
  mote of 2.3–3.2px.
- **Every one bursts.** Each is **born** somewhere in the lower four fifths of the window,
  fades in over 0.9s, rises 18–42px a second with a quick small sway, and after 4.2–8.2 seconds
  (`LIVE`) **bursts** into three to five finer specks (seven to ten for a mote) that fly out
  7–16px and fade over 0.9s — and is born again somewhere else. Where it is born each round comes
  off a hash of its number and the round (`born()`), so there is no list of positions to keep
  and nothing is rolled while drawing.
- **Kept**: it leans towards the pointer (`HAND`, `HAND_LEAN`); over the writing's column it is
  still drawn at `QUIET` of its strength, so the words are never fought; it stands still, drawn
  once, with reduced motion; below 700px it draws at the lower ratio.

It is still the ground that **says nothing about the house** — the owner has still not said what
Grande Parfums is. It is simply as loud as the hover now.

**Les Abstraits' half sentence is out.** *The vibe I get from Les Abstraits is that it is stuff*
was a paragraph of its own in the introduction, left standing because the owner left it; they
asked for it gone, and it is. The comment at the top of the page says so.

**And its beaker fills half as fast** (`FILL_DROPS` 16 → 32), with no pointer or number at its
surface — the same change as the hover's, in the same `beaker.js`; see [the
motifs](2026-09-23-the-chain-and-its-motifs.md).

### How to test it

- **`Grande Parfums has a drift as strong as its hover, quiet over the writing`** (replaces *…has
  a drift, and it is a quiet one*) — at 1280 × 720, a second and a half in: over 600 lit pixels in the
  margins carrying over 20,000 of alpha between them — the old drift carried about 4,700 on 280
  — a lit pixel over the writing weighing less than one in the margins, and a fifth of them or
  more in the top half of the window. (The mean weight of a lit pixel was tried first and is no
  gauge: a small soft speck is mostly edge.)
- **`Les Abstraits' introduction no longer carries the unfinished sentence`**.
- The page's drip test runs its clock for 160 seconds and checks nothing is written on its canvas
  but the graduations.

## 2026-09-26, last — back a house as well as on; ADAR's credit readable; Qimu plays

> in SD when you open a houise, i want you to have the option to go back a house as well as
> forward a house.

**Every house's foot carries the way back a house** beside the way on — `<a class="house-prev">`
inside a `<span class="house-steps">` with the existing `human-on` / `pine-on` / `adar-on` link —
*← Back to 08 · Tombstone* and *Continue to 01 · Pineward →* on Qimu & Musicians, *← Back to 09 ·
Qimu & Musicians* on Pineward, and so round: the same chain read either way, the first wrapping
to the ninth. The way back to Scent descriptions keeps the left. On a phone the two stand under
it, one to a side. Qimu's way on said *Back to 01 · Pineward →*, which read wrong beside a way
back; it says *Continue to*, as the others do.

> in adar in the SD, the sentecne Pictures The photograph standing with each fragrance is ADAR's
> own, from adarperfumes.com. is not entirely visibile ont he black background, so make it
> visible.

**ADAR's credit** was drawn in the paper pages' ink and grey on black: ADAR's page sets none of
the five colour tokens (it paints its own colours onto its rules), so `.house-credit` fell back to
the site's. It is in ADAR's own greys now (`.adar-page .house-credit`), the word *Pictures* and the
link in its near-white.

> in Qimu and Musicians, i want there to be a button on top that allows you to mute and unmute. it
> should be a square and relatively obvious. I also want you whn you hover the notes in qimu and
> musicians, it plays them as piano notes. Also make sure that whatever generated is logical and
> can be played.

**The score is real music now** (`qimu.js`, rewritten under the same drawing). It was a texture:
runs, chords and clusters set at random along bars whose lengths said nothing about their time
signatures. Now each stave has:

- **a key** — up to four sharps or flats, major or minor, its signature at the head and every
  note in it; in a minor key the leading note is raised in the dominant's bars, carrying its sharp
  or natural the first time it appears on its line in the bar, as an engraver writes it;
- **a metre** from the fourteen music uses (`METERS`), changing now and then at a bar line — and
  **every bar lasts exactly what its time signature says**, in each hand: its notes and rests are
  chosen beat by beat (crotchets, quavers, semiquavers, dotted rhythms, triplets; in 6/8 and the
  other compound times, dotted crotchet beats), beamed within the beat, with flags on a lone
  quaver, second beams and stubs for semiquavers, dots, rests of the right values;
- **harmony** — a progression a bar at a time (I–IV–V–I, ii–V–I, i–VI–III–VII and so on), the tune
  on the chord's own notes at the beat and stepping between them, now and then harmonised by the
  chord closed up under it; on a braced pair the left hand holds the root and fifth, breaks the
  chord in quavers, or plays the root in octaves — **nothing a hand plays at once spans more than
  an octave** — and a stave of more than one bar ends on the key's own chord, its last note the
  key's own note;
- the playhead passes along it **at its own tempo** (a crotchet at 58 to 88 a minute), each note
  lifting as its time comes rather than as a line passes it.

The time signature at a stave's head was, for a stave that changed metre, being drawn with the
last metre rather than the first (the drawing read a variable that moved on after it was set) —
found in a close-up, fixed, and tested.

**Pointing at a note plays it**, as a piano: the nearest notehead within 9px of the pointer is
struck at its own pitch, a chord as a chord, once for as long as the hand stays on it; a tap does
the same on a phone. **The piano is made here**, not sampled: two strings to a note a hair apart,
a piano's overtones, a quick strike and a long fall (longer the lower the note) through a filter
that closes as it fades, a tick of the hammer, and a little of a room after it.

**The button** (`.qimu-sound`) is a square at the top right — a speaker drawn in it, crossed out
while the notes are silent, filled in the score's blue and sounding once they play — with *Sound
off* / *Sound on* beside it (only the square on a phone). **It starts silent**: a browser lets no
page make a sound until it has been pressed, so the first press is what turns the sound on, and it
answers with the key's chord, softly, so the press is heard to have worked. It is made by the
script, so without it there is no button and nothing to play.

Tested in `tests/houses.spec.js`: **`Qimu & Musicians' score is real music: bars that add up, in
key, within a hand`** (at three window sizes: every bar the length of its time signature in each
hand; the time signatures written on a stave the ones its bars are in, in order; every note in the
key, a minor key's raised leading note allowed; no chord wider than an octave; everything between
E1 and C6; more than three metres) and **`Qimu & Musicians has a square sound button, and a note
pointed at plays its own pitch`** (a square at the top; silent while off; turned on, a note
pointed at is struck at exactly its own frequencies — read off what the page asks the browser's
audio to play — and not again while the hand stays; silent once off again). The earlier score test
still holds: notes written, times other than 4/4, nothing written but numbers, never stronger than
a little over half, carried with the page.

**Asked, and done (2026-09-27)**: the Houses view's hover for Qimu (`motifs.js`) now writes real
music with this page's own composer, copied there word for word — and, at the owner's word
("Real music, silent"), plays nothing. See [the motifs](2026-09-23-the-chain-and-its-motifs.md).

## 2026-09-27 — Qimu plays the stave, on a real piano; the partition between the two ways

> the music playing in Qimu & musicians sounds aweful. please fix that, make it sound good. make it
> also sound like the actual notes on screen, i dont think it was adherenet. I want it to sound like
> an actual composition. Additionally, I want it to make the sound only if you hover that
> particlar set of lines.

**The piano is a recording now.** What sounded "aweful" was the piano made in `qimu.js` — a fixed
waveform with a piano's overtones through a closing filter, with a click of noise for the hammer:
an organ with a click. It is the **Salamander Grand Piano** (Alexander Holm's recording of a
Yamaha C5, CC BY 3.0): seventeen of its notes, a minor third apart from C2 to C6, in
`audio/piano/` (1.3MB, with a README saying where they came from and under what licence), each
checked to be the pitch its name says. A note between two recordings is the nearer one played a
semitone or so higher or lower (`nearest`, `playbackRate`), as a sampled piano always is. They are
fetched only when the sound is turned on. Until they have arrived — or if they cannot be — a
softer voice made of five pure partials, the higher dying sooner (`synth`), stands in, so a note is
never silent where it should sound. A short hall of the page's own making (`hall`) gives the dry
recording somewhere to ring. **The credit** is at the foot of the page, a second line under
*Pictures*: *Piano — The Salamander Grand Piano, recorded by Alexander Holm, under CC BY 3.0*.

**What is played is the stave, as it is written** — which is "an actual composition", "the actual
notes on screen" and "only if you hover that particular set of lines" at once. The pointer on a
stave's lines (or within 2.5 line-gaps of them, `PAD`) plays **that stave from its first note**:
every note and chord of it, both hands of a braced pair, each at its place in its bar and **held
for its written length**, at the stave's own tempo — read off the very marks that are drawn
(`music`, built in `compose`), so what is heard is note for note what is written. The tune is a
little louder than what is under it, the notes on the beat louder than those between, the left
hand softest; a chord's notes a hair apart from the bottom up; each note let go a hair after the
next begins (`OVERLAP`), and **damped** when its length is up rather than cut. It is scheduled on
the sound's own clock a moment ahead (`pump`, `LOOK`), so its timing is the sound card's and not
the page's. **Its playhead is the piano's**: the hairline along the stave that is heard stands at
the piano's own time, a little stronger than the silent ones, and its notes lift as they sound. At
its end it breathes for a beat and plays again, for as long as the hand is on it. **Off the lines,
it stops** — the notes sounding are damped over a fraction of a second and those not yet begun are
never begun; another stave starts from its own first note; scrolling a stave out from under a still
pointer counts as leaving it; a hidden tab stops it. On a phone a tap on a stave plays it through
once. The single note struck as the hand passed over it — the old behaviour, which played whatever
notes the pointer happened to cross, in the order it crossed them — is gone (`noteUnder`, `strike`,
`REACH`, the struck note's lift).

Nothing about what the score *is* changed: the composer (`keyOf`, `composeBar`, `layBar`) is
untouched, and still the same word for word as the Houses view's copy in `motifs.js`.

> put a "ll" partition between the go back and go forward between the houses buttons.

**The partition** — two upright hairlines, 13px tall, in the foot's quiet colour
(`.house-steps-bar`, `aria-hidden`) — stands between *← Back to …* and *Continue to … →* at the foot
of all nine houses, with 18px either side of it (the two links were 30px apart). ADAR's in its own
grey. **On a phone** the two links stand side by side now, each taking half and wrapping its own
words, with the partition between them — they stood one under the other, where a partition would
have had nothing to part.

Tested in `tests/houses.spec.js`: **`Qimu & Musicians has a square sound button, and a stave
pointed at plays exactly its own music`** — silent while off; turned on, all seventeen recordings
arrive; a stave pointed at plays exactly its written notes, in order, at their written times, on
the recording, every pitch one drawn on it; off its lines it stops and nothing more is played;
another stave starts from its own first note; off again, silence even on the lines. The partition
is in the markup of every house, which **`every page has one h1, a main, headings in order, and
every picture described`** and the house tests read.

## 2026-09-28 — Qimu's staves are real pieces, named under them

> For the qimu and musicians, i want you to actually find sheet music from some obscure piano
> pieces and display that. I also want you to give their name when hovering that piece in a light
> font underneath the sheet music.

Files: `qimu.js` (its music and engraving rewritten; the page's staves, playhead and piano as
they were), `qimu-pieces.js` and `tools/qimu-pieces.py` (both new), `motifs.js` (the Houses
view, same engraver), `houses/qimu-and-musicians.html` (the pieces loaded, Archivo's 300, the
credit), `categories/scent-descriptions.html` (the pieces loaded), `tests/houses.spec.js`,
`tests/contact-sheet.spec.js`.

**Every stave is now the opening of a real piano piece**, note for note as its score has it — and
the composer that made the music up (`keyOf`, `composeBar`, `METERS`, the progressions) is gone
from `qimu.js` and from `motifs.js`.

**Where the music comes from.** *Polish Music Heritage in Open Access* (polishscores.org): the
Fryderyk Chopin Institute's digital editions of Polish music, as **kern files (a plain-text way of
writing a score, one column a staff, one line a moment), under CC BY 4.0 — which may be used with
credit, and the page credits it. From its hundred and thirty-odd solo piano pieces, eighteen by
composers of the first half of the nineteenth century whom hardly anyone plays now:

- **Maria Szymanowska** — seven of the *Vingt exercices et préludes* (1819), Nos. 6, 8, 9, 13, 14,
  15 and 18, and the *Caprice sur la romance de Joconde*;
- **Władysław Żeleński** — the *Praeludium* and *Promenade* of the *Sechs Charakterstücke* Op. 17
  (1872), and the *Adagio* and *Allegro con moto* of the Sonata Op. 20;
- **Józef Krogulski** — a *Mazur*; **Józef Elsner** — the *Mazur* from the opera *Łokietek*;
- **Franciszek Mirecki** — Krakowiaks Nos. 6 and 19 of the *Krakowiaki ofiarowane Polkom*;
- **Wojciech Sowiński** — *Les Charmes de la campagne* Op. 11 No. 2;
- **Kasper Napoleon Wysocki** — the *Walc rewolucyjny* (1831).

Szymanowska's preludes are named by their number in the collection rather than by key: the
archive's titles for several of them disagree with their own key signatures.

**How it gets onto the page.** `tools/qimu-pieces.py`, run by hand and never by the site (it needs
nothing installed; the header says how to fetch the scores), reads the first four bars of each
(and an upbeat before them) and writes **`qimu-pieces.js`** — `window.QIMU_PIECES`, 57KB: each
piece's composer, title, metre, key signature, a tempo, and its bars, each hand one or two voices,
each a list of events filling the bar exactly — a note or chord as **steps** (letters above middle
C, as the score before it used) and **alters**, the accidental an engraver writes before each
(worked out bar by bar and staff by staff, as a score is read), which way its stem goes, which beam
it is under, its ties and its slurs, triplets, rests, and the unseen rests of a voice that stops. A
piece is taken only where its opening is plain enough for a margin: a treble and a bass staff, no
change of clef, key or metre, no grace notes, at most two voices a hand, nothing shorter than a
demisemiquaver. The tempo is chosen by hand for each (the scores give only words: *Allegro*,
*Tempo di Mazurka*).

**How it is drawn: THE ENGRAVER** — one block of `qimu.js`, from *THE ENGRAVER* to *THE ENGRAVER
ENDS*, which is word for word the same in `motifs.js` (the Houses view draws the same pieces, and a
test holds the two together; they used to share the composer the same way). What it does that the
made-up music never needed: **chords under beams** (the stem from the far head, the beam from the
near one, pushed out until every stem is long enough for its beams and reaching the middle line off
notes far from the stave); **two voices on one stave**, the upper's stems up and the lower's down,
their rests lifted and lowered; **seconds** in a chord, the upper head on the far side of an up
stem and the lower on the far side of a down one; **accidentals** — sharps, flats and naturals —
stacked in columns where a chord's would touch; **ties** between heads and **slurs** bowed clear of
every note under them, running across bar lines; **demisemiquavers**, dotted semiquavers, triplet
quavers and semiquavers (a *3* on the beam, a *6* over six); **a whole bar's rest** in the middle
of its bar; stems reaching the middle line; an **upbeat** bar. A stave holds as many of its piece's
opening bars as fit at their own width (one too wide for it alone drawn closer), ends on a **plain
bar line** — the piece goes on — and carries **both hands** on a braced pair about half the time
(`GRAND`), always when the right hand is silent at first or written low (more than a ledger line
under the treble stave). The pieces come in a shuffled order, every one before any comes round
again.

**What is played is still exactly what is drawn**: the `music` a stave plays is read off its marks;
a note tied on is **held through** the note it is tied to (`hold`) and that note is not struck
again (`struck`); the playhead moves at the piece's own tempo.

**Its name, under it, while the hand is on it**: the piece on one line and its composer under it,
a little fainter (`NAME`, 0.56 and 0.72 of it), broken where it would run past the stave's end, set
under everything written on it (`deep`, the lowest ink the engraver has put down) at the stave's
left edge, in **Archivo at 300** — the page's own face, light, which its fonts link now asks for
(`0,300`); the canvas asks for it before first use, as a canvas fetches no font on its own. It
comes up over a few frames as the hand arrives and goes as it leaves (`NAME_IN`); at once with
reduced motion. A tap names it on a phone. Behind the writing (no margins) it is as quiet as the
stave.

**The credit** is a third line in the foot: *Scores — The openings of eighteen piano pieces by …,
from Polish Music Heritage in Open Access, © The Fryderyk Chopin Institute, under CC BY 4.0.*

Tested in `tests/houses.spec.js`:

- **`Qimu & Musicians' staves are the openings of real piano pieces, note for note`** (replacing
  *… real music: bars that add up, in key, within a hand*) — at three window sizes, every stave one
  of the eighteen; its bars the piece's own from the first, in order, with exactly the score's
  pitches; every bar the length of the piece's time signature (an upbeat shorter) in every voice of
  every hand; the right hand alone on a single stave; the piece's own time signature written; no
  piece twice before every piece has come; more than eight pieces and three metres seen.
- **`pointing at a stave names its piece under it, in a light face`** (new) — nothing named
  unpointed; pointed at, the piece and its composer drawn under the stave at its left edge, in a
  300 face; gone once the hand leaves.
- **`… keeps a quiet score in its margins`** and **`… a stave pointed at plays exactly its own
  music`** unchanged and still passing.

In `tests/contact-sheet.spec.js`, **`the Houses view engraves Qimu's music with the house page's
own code`** (was *… composes …*) compares the whole engraver in the two files, and finds no
composer left in either.

## 2026-09-28, the very last — Qimu's music on a phone

> Finally, make sure the mysic works in qimu and musicians for the phone too.

It was written to work on a phone — a tap on a stave played it — and on an iPhone it would most
likely have been silent all the same, for three reasons that a desktop never meets. All three are
in `qimu.js`, and the desktop is unchanged by them:

- **The silent switch.** An iPhone puts a page's sound in with the ringer and mutes it with the
  switch at its side, unless the page says it is **music**. Safari has the words for that
  (`navigator.audioSession.type = "playback"`, which has to be said before the sound is first
  made), and the button says them on its first press (`asMusic`). An iPhone too old to have them
  is told the only way it understands: a quarter of a second of silence, made on the page as a WAV,
  played on a loop while the sound is on (`keepOpen`), and let go when it goes off or the page goes
  behind another (`letGo`).
- **A sound started inside the press.** A phone lets a page's sound out only once one has actually
  been started inside a press, so the button starts a single silent sample at once (`unlock`).
- **Put to sleep.** A phone puts a page's sound to sleep when the page goes behind another — on an
  iPhone the sound is then *interrupted*, which is not the *suspended* the page used to look for.
  Anything not running is woken now (`wake`), and every tap wakes it, since a tap is a press the
  phone will allow it in.

And **the tap itself** is a tap now: a finger that went down and came up within 12px and 0.7s
of where it went down (`TAP_MOVE`, `TAP_MS`) — **never the start of a scroll**, which the phone
takes over — played on the finger coming up rather than going down, and **never on something that
does something else** (a link, a button, a part's name). A tap on a stave **plays it through once**
with its name under it; **a tap on it again stops it**, and so does a tap anywhere else. A finger
is wider than a pointer, so a tap within `TOUCH_PAD` (30px) of a stave's lines counts, the nearest
stave if two are in reach. **A scroll plays nothing**: before, a stave scrolling under the place a
finger had last touched started playing on a loop, as if it were a pointer resting there.

**With the sound on, the staves come up a little** on a window without margins — from `QUIET`
(0.24) to `HEARD_QUIET` (0.5), eased — because behind the writing they were too faint to find and
tap. Off, they go back. A desktop's staves stand in the margins at full strength and do not change.

### How to test it

`tests/houses.spec.js`, **`Qimu & Musicians on a phone › a stave tapped plays through, tapped again
stops, and a scroll plays nothing`** (new), on a 390 × 844 touch screen: the button on the window;
a tap with the sound off plays nothing; turned on, the page has said it is music **before** the
sound was made (`navigator.audioSession`, put in for the test, since Chromium has none); the staves
come up (`strength`, a new reading in `QimuScore.boxes`) and go back down when it is turned off; a
tap on a stave plays exactly its notes from its start, with its name under it; a tap just off its
lines stops it, and one just above them plays it again; a tap with no stave near stops it; and six
scrolls with a finger last down plays nothing.

### Known issues / TODO

- **Not heard on a real iPhone from here.** Chromium, which the tests drive, has none of the three
  things above; the test checks that the page asks for them, and a real phone is the only proof.
  If it is still silent, the volume buttons are the next thing to look at: once the page is music,
  it follows the media volume, not the ringer's.

## 2026-09-29 — a return button at the top of every house

> For every house in houses, ... ON THE TOP OF THE PAGE a return button in case they pressed the
> button by accident.

**All nine houses** (these six and Pineward, ADAR and Almost Human, which keep their own shapes) have
**a boxed button at the top of the page**, above the kicker over the house's name: a small drawn
chevron and **Back to the houses**, in the page's own colour (`currentColor`, its box at 42% of it), so
it is right on the dark pages and the light. It goes to the Houses view **with this house at the
front** — `../categories/scent-descriptions.html#house-08` — which the view reads (see [the
axis](2026-09-24-the-axis.md)). It is set **as far above the name as it is tall** (`margin: -62px 0
28px`), so the name and everything under it stand exactly where they stood; it rises with the head in
the house's way in. One `<a class="house-return">` as the first thing in each head (`.human-head`,
`.pine-head`, `.adar-head`); a new house copies it with its own number.

`tests/houses.spec.js`, **`every house has a return button at the top, back to the houses at that
house`** — on all nine: one button, to its own `#house-NN`, above the name, at the top of the page,
the kicker exactly where it stood (234px at 900 tall); and Tombstone's, pressed, lands on the Houses
view with Tombstone at the front.

## 2026-10-01 — Les Abstraits and Tombstone lighter to draw

Part of the round's smoothness pass, nothing to see. **Les Abstraits' armoire, once it stands, is
a picture**: built and in bloom it never moves again, but it was drawn speck by speck — thousands,
each its own colour — every frame; now it is drawn once into a picture the size of the window
(`still` in `abstraits.js`, made again on a resize) and laid down each frame, the powder and the
drip over it as before. **Tombstone** sets each shade once and how much of it a speck or its
reflection shows as `globalAlpha` (`tint` in `tombstone.js`), where it wrote a colour as words
twice a speck. Script a second on a phone: Les Abstraits 455 → 51 ms, Tombstone 346 → 91. Both
compare pixel for pixel with what they were. See [the site on a phone](2026-09-21-the-site-on-a-phone.md#2026-10-01--every-page-measured-on-a-phone-and-made-smoother) for how it was measured.

## 2026-10-01, later — Qimu plays whole pieces; Les Abstraits' clothes their real size; Ataraxia's bands move a little

> if you can, for the Qimu and Musicians SD; I want you to actually try and find chinese piano
> compositions. additionally, when you hover it, i want them to play the entre composition and the
> notes change visually too as it plays. keep the site as it is

### Chinese piano pieces: looked for, not found in a form that could be used

**Not done, and why.** What was wanted is a Chinese piano piece **free to use** and **written down
as data** (a score a program can read note by note — what the Polish pieces are), because the staves
engrave and play whatever they are given note for note and nothing may be invented. What was found:

- **Out of copyright, and real Chinese piano music** — Huang Zi's *Prelude* and his fugues and
  inventions (he died in 1938), Xiao Youmei's nocturnes (1940), Zhao Yuanren's *Peace March* (1915,
  the first Chinese piano piece usually named) — exist **only as scanned pages** on IMSLP, and this
  session's network reaches GitHub and nothing of IMSLP, Wikipedia, MuseScore or archive.org.
- **The well-known Chinese piano pieces** — He Luting's *Buffalo Boy's Flute* (1934), the piano
  *Colourful Clouds Chasing the Moon* and *Flute and Drum at Sunset* — are **under copyright**.
- **No collection of Chinese piano music as data** turned up on GitHub; the nearest are folk-song
  melodies (the Essen collection) and guqin pieces in staff notation, neither of which is a piano
  piece.

So the staves still carry the eighteen Polish pieces. Two ways on, for the owner to choose: send
pictures of a free score's pages (Huang Zi's *Prelude* on IMSLP, say) and they can be read and
written in by hand; or traditional Chinese melodies, free to use, with a piano part written for them
here — which would no longer be a real piano composition.

### The whole of a piece, and the stave turning over as it plays

**Pointed at with the sound on, a stave plays its piece to its last note** — every bar of it, in the
order it is played, its repeats and its first and second endings as the score has them — and **the
stave turns over** as the piano reaches the end of what is on it: the next of the piece's bars are
**written on left to right** (`TURN`, 0.42 s) as the bars it was played past **fade off it**
(`TURN_FADE`), its lines staying where they are. Where the key or the metre changes, the stave starts
a new line with the new ones at its head, as an engraver does. **Let go, it goes back to its
opening**, written on again. At the end of the piece it breathes for a beat and begins again, while
the hand is on it; on a phone a tap plays the piece through once. Nothing else about the page
changed: the staves, the silent playheads and the names are as they were.

**Where the bars come from.** `tools/qimu-pieces.py` now writes **two files** from the same scores:
`qimu-pieces.js` as before (the openings, which the staves show and the Houses view draws — byte for
byte the same file) and **`qimu-whole.js`**, every bar of each piece once (`bars`, as a bar of
`qimu-pieces.js` is, with `k` and `m` where its key or metre differs from its first) and the
**order** they are played in (`order`, runs of bars). The order is read off the score's own list of
its sections where it has one (`*>[A,A,B,…]` — one is written without commas and is read greedily),
and otherwise off its repeat signs, first endings taken the first time and second the second
(`order_of`). A whole piece has things its opening did not, and the tool takes them as an engraver
of a margin must: **grace notes** left out; a **change of clef** kept to the hand's own staff, with
ledger lines; a **third voice** folded into the other two as chord notes where it sounds with them
(20 times) and otherwise left out (6 notes in the whole set); a **double sharp or flat** written as
the note it sounds (52); a voice that **does not fill its bar** filled with a hidden rest (8). The
tool prints all of it per piece. **The openings it reads are exactly the ones on the page** — checked
bar for bar against `qimu-pieces.js` for all eighteen.

**Fetched only when the sound is turned on** (`fetchWhole`, a script tag): 1.3 MB written out, about
74 KB as the site sends it. Until it has arrived a stave plays its opening on a loop, as it always
did. 2,027 bars are played across the eighteen pieces, from 12 (the two krakowiaks, about half a
minute each) to 346 (the Walc rewolucyjny with its repeats).

**In `qimu.js`**: `compose()` says how many bars it took (`count`); a stave keeps its opening
(`home`) and the width it was given (`room`); `pageFrom()` lays out the next page from a place in the
piece's order, up to a change of key or metre; the player holds **pages**, each at its `offset` in
seconds from the first note, and lays the next one out only when its notes are within `LOOK` of
being heard (`nextPage`); `show()` puts a page on the stave, keeping the last one to fade off. With
motion turned off, a stave is simply drawn again as it turns over. `heardLog` entries carry the page
(`page`, and `from`, where in the order it begins).

### Les Abstraits' clothes, their real size, the hangers inside them

> For the les abstraits, I want you to make the clothes hanger disappear behind the clothes (the
> same way they would in real life) make the clothes also realistic sizes. i want there to be pants,
> a dress and some blazer.

Both armoires — the house's own page (`abstraits.js`, in specks) and the Houses view's motif
(`motifs.js`, in hairlines). The coat, the dress and the shirt are gone; there are **a blazer, a
dress and a pair of trousers**, laid out **in centimetres against a two-metre armoire** (`cm` =
the armoire's height ÷ 210): the blazer 44 cm across the shoulders and 74 long with its lapels, two
buttons, flap pockets and a breast pocket; the dress 75 long with short sleeves, a scooped neck, a
waist and a full skirt; the trousers **folded over the hanger's bar at the knee**, the two legs side
by side with their creases and turned-up hems, the waistband half behind. Real sizes need room to
hang, so **the shelf moved up** to near the top of the inside, with the folded stacks on it, and
the rail under it; a folded stack stands on the floor of it too. A door ajar shows only half a metre
of the inside, so the clothes **hang a little turned** (`TURNED`, three quarters of their width
seen), as clothes on a rail do, **back to front**: the blazer behind on the left, half behind the
shut door, the dress in front of it, the trousers in front on the right — what stands behind
another is hidden by it, and what is past the edges of the opening is hidden by the doors (clipped
to the opening on the Houses view; on the page, its specks are not laid there).

**The hangers are inside the clothes**, as they are in life: each hanger is drawn **first**, and its
garment over it — so only its **hook** shows over the rail, and **the triangle over the trousers**,
which hang over its bar; through the dress's scooped neck is the back of the dress, higher, not the
hanger. On the page, where everything is specks and nothing covers anything, a hanger's specks are
simply not laid where its garment is, and nor are a garment's where one in front of it is, nor the
inside's faint dark specks behind any of them (`hidden`). The irises on the page stand in front of
the clothes, on the floor of the armoire.

### Ataraxia's bands move, slightly

> in ataraxia, introduce SLIGHT movement to the streaks that go across the page.

Until now **the specks never moved** — only the light (the crest) travelled. Now they move a little
(`ataraxia.js`, THE DRIFT): each band's specks **flow along it** 3 to 8 px a second, its own way
(`FLOW`, taken from its crest's clock, so no new number is rolled and the bands stand where they
stood), round and on again past its faded ends; each speck **wanders** a pixel or two about its place
(`WANDER`, on its twinkle's clock); and a slow **swell** runs along the band (`SWELL`, 2.6 px, a pass
every 9 s). None of it with motion turned off. The kindle, the quiet over the writing and the bloom
are as they were.

### How to test it

- `tests/houses.spec.js`, **`Qimu & Musicians plays a stave's whole piece, turning it over as it
  goes`** (new): the whole of the pieces is not fetched until the sound is on; every stave's piece,
  page after page, begins at its opening, takes up each page where the last left off and ends at its
  last bar played (`QimuScore.pages`, `QimuScore.whole`, new); pointed at, a stave turns over, and
  what is heard then is exactly the notes now written on it; let go, it is silent and showing its
  opening again. The sound test and the phone test now read the opening's notes off page 0.
- `tests/houses.spec.js`, **`Les Abstraits has its armoire …`**: a blazer, a dress and trousers hung
  in it (read off their colours). `tests/contact-sheet.spec.js`, **`Les Abstraits' armoire has
  clothes on hangers and folded on its shelf`**: the clothes solid most of the way down the inside
  now, and folded on the shelf near the top and on the floor.
- By eye: the armoire on the Houses view with Les Abstraits rested on, and on the house's page;
  Ataraxia's bands drifting.

### Known issues / TODO

- **No Chinese pieces yet** — above; the owner's to choose how.
- **A long piece is long.** The longest — Żeleński's Allegro con moto, the Walc rewolucyjny, Les
  Charmes de la campagne — take seven to nine minutes with the hand held on them; that is what "the
  entire composition" is. Taking the hand off stops it, and it starts from the top next time.
- **Ledger lines where a hand changes clef.** A stave keeps a hand to its own staff, so a left hand
  that goes up into the treble (and the other way round) is written with ledger lines; nothing else
  about the notes is changed.

## 2026-10-01, later — the words: a capital I, ADAR's "of", Dear Future's MID

> for ADAR house, make the "of" not capitalized in the subtitle. in SD, make sure that any "I" are
> capitalized. (such as dear future in almost human "Maaaaaaaybe i ") additionally, put more space
> after the mid in dear future

At the owner's word, the one kind of correction the writing gets: **every lowercase *i* standing for
the owner is a capital** across the houses and the individual fragrances — fourteen in all: nine in
ADAR, two in Almost Human (*Maaaaaaaybe I*), and *im* → *Im* once each in Ataraxia, Les Abstraits
and Tombstone (the missing apostrophe is the owner's, and kept). ADAR's subtitle is **The House That
You Have Never Heard of**, on its page, in its title and what a shared link shows, and on the Houses
view. **Dear Future's MID** stood hard under the last item of the list above it (a list had no space
after it before a stage label, where a paragraph has 26px); it has the same 26px now
(`.human-list + .human-stage`), and so would any stage after a list.

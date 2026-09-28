# The essay pages

Date: 2026-09-17 (`d7092b2`, the round that added four page kinds at once; migrated
from CLAUDE.md on 2026-09-17)

Files: `essay.js` (~380 lines), `works/theory-01.html`, `works/theory-02.html`,
`works/theory-03.html`, `works/resins-in-perfumery.html`, `works/skin.html` (2026-09-28), `works/cold-vs-warm-incense.html` (deleted 2026-09-28),
`works/buying-a-perfume.html`, the `essay-*` block in
`style.css`, `tests/essay.spec.js`

## What it is

A page for a long piece of writing, drawn in [the structure](2026-09-14-the-structure.md)'s
language rather than [the contact sheet](2026-09-13-the-contact-sheet.md)'s: near-white
on gray-black, a fine swarm of particles standing in the air behind the writing
(`SPECKS`, 220), and sights at the corners (`SIGHT`, `SIGHT_IN`).

Opening a theory from that category should read as going further into the same
instrument rather than as arriving somewhere else, and that is the whole reason for the
ground.

## The rule down the left

- **It is built from the page's own sections** — every `<section class="essay-section">`
  with an `<h2>` in it, in the order they stand. Adding a section to the page adds a tick
  to the rule with no other change.
- A heading carries its number in a `<span class="essay-no">` of its own and **the number
  is not part of the name**: read whole, every tick came out as "01PREMISE".
- **Every tick is a link to its own section**, so the rule is a way of getting about and
  not only a readout.
- **It does not move when the name under it changes.** The rule is a fixed column centred
  on its *own* height, and the name under it (`.essay-here`) wraps to a second line when a
  section is called something long — so going from a one-line name to a two-line one used
  to shift the whole ladder, hairline and all, half a line up the window, and back down
  again at the next section. The owner found it on The Architecture of Sweat, between
  *Applying the Framework* and *Every Combination*: a jump of exactly 8px, measured.
  `holdName()` now reserves the room **the tallest name this page actually has** needs,
  measured off the page rather than guessed at, so no heading is ever clipped and the rule
  never moves whatever the piece is called. It is measured again on resize (width is what
  changes the wrapping) and again on `document.fonts.ready`, since the page's own face
  arrives after the page does and wraps differently from the one the browser starts with.

## Which section the rule says you are in

Three rules in order (`readingAt`), and the order is the point:

1. **One you have just pressed names itself** until you scroll away from where it took
   you (`PIN_FREE`, 60px). Pressing "Myrrh" and being told you are in Camphor because
   Camphor is longer is a readout arguing with you — the owner asked for exactly this.
2. **One you have just reached names itself** while its heading is in the top
   `ARRIVED_BAND` (0.45) of the window. That is what gives a short section a window of
   its own in which it is the subject, rather than never being named at all.
3. **Otherwise the one filling the most of the window wins** — which is the honest
   answer while you are reading through something long.

And at the very bottom of the page the last section wins outright: there is nowhere
further to go, so that is what you are looking at.

## The reading is the scroll

Nothing on the page adds itself up: the drift is written from the clock and the travel
from `scrollY`, so a page left alone reads the same a second later and travelling back
gives exactly the drawing you left. A test checks both — the same two things
[the structure](2026-09-14-the-structure.md) got wrong first.

## The web is short and capped

`WEB_REACH` (58px), `WEB_EACH` (2). At a longer reach the field came out as long lines
striking across the page and closing into triangles: a net thrown over the writing
rather than air standing behind it. [Pineward](2026-09-16-pineward.md)'s canopy made
exactly the same mistake first, which is why the numbers here are small.

## What is written on them

The three theory pages are **templates** — placeholder writing, real structure — and the
resins research is the owner's own writing (sixteen sections against the theory pages'
six). The theories category's first three rows point at the three theory pages.

### The explorations use the same shape

**Since 2026-09-23 one of them has a look of its own**: *My Personal Introduction to
Perfume* (Explorations 000) keeps the rule but replaces the swarm with a mist of its own
and the steel blue with gold, all scoped to `.primer-page` — see [its
report](2026-09-23-my-personal-introduction-to-perfume.md). `essay.js` runs without its
canvas and simply draws no swarm.


`works/cold-vs-warm-incense.html` (2026-09-21; **deleted 2026-09-28**, never written — see [the last section](#2026-09-28-last--researches-003-skin-cold-vs-warm-incense-taken-down)) was the first **exploration** on this
ground, and it is an essay page like any other — the swarm behind it, the sights at the
corners, the rule down the left. An exploration goes out after a smell and writes down
what is there; a research takes a material at a time. The row on
`categories/researches.html` says which in its `data-kind`.

**It is not written yet.** Its four sections are the shape of the question and nothing
more — what is being compared, each of the two, and where the line between them is — and
each says it is waiting in a dashed box (`p.essay-waiting`, the house pages' box in these
pages' colours) rather than standing in as prose. No fragrance is named in it and no
conclusion is drawn: that is the owner's to write, and two things already on the site
point at the question when they come to it — Mystical Incense on Grande Parfums (*"a cold
incense, which starts off very un-incense-y"*) and the frankincense, myrrh, elemi and
olibanum entries in the resins research.

## How to test it

```bash
npm test -- tests/essay.spec.js
```

The rule being built from the piece's own sections and naming them without their numbers;
every tick being a link to its own section; the reading being the scroll and not drifting
while nothing is touched; travelling back giving exactly the drawing you left; the field
standing still under `prefers-reduced-motion`; all of the writing being there without the
script; and the theories and the researches reaching their own pieces.

One of them is a regression, and it was **proved against the real fault** before being
trusted: **`the rule stands still all the way down a piece, whatever a section is
called`** walks The Architecture of Sweat from top to bottom and fails if the hairline's
own top ever changes. With `holdName`'s last line taken out it reads two positions, 133
and 125 — the 8px jump the owner reported, exactly.

## The sweat theory's combination table

Three lists of three, three and two make **eighteen** combinations, and the owner asked
for every one of them written out with a blank beside it to fill in later. So the table on
`works/theory-02.html` is a **form**, not a finding: eighteen rows in the order every
combination is counted off — first letter changing slowest, last fastest — each carrying
its code, the three words that code stands for, and an empty cell.

**The blank is the point of it.** A row with nothing in it draws a dashed **rule** rather
than nothing at all (`.sweat-who:empty::after`), because a rule reads as *waiting* where a
gap reads as broken; the moment anything is typed between the tags the rule goes and the
name stands on its own. And a combination that stays empty is itself worth something — it
says nobody has made that.

**Filling one in is one edit**: find the row by its code and put the name between its
`<td class="sweat-who">` tags. The markup carries that instruction above the table, along
with the one warning that matters — the rows must not be renumbered or reordered, because
the codes are the framework's own and the order is the counting.

On a narrow window the three spelled-out columns are dropped and the code is kept: the
code carries the same information and the page has just finished explaining how to read
it.

Adding this section pushed Notes to 05 and Footnotes to 06, ids and all. The rule down the
left is built from the sections themselves, so it picked the new one up with nothing else
changed — which is the whole reason it is built that way.

## The resin list links into the page

The fourteen resins the research is going to cover are an ordered list at the top of it,
and each is now a link to that resin's own section. The links are **matched to the
headings at build time, not typed**: the section ids are read off the page and each name
is matched against them, falling back to the head of a compound name (`Frankincense` for
`Frankincense/Olibanum`, `Benzoin` for `Benzoin (Resinoid)`). All fourteen found their
section. If a resin is ever added to the list before its section is written, it renders as
plain text rather than as a link to nowhere.

## The third theory has a report of its own

`works/theory-03.html` outgrew this one. It is the longest piece on the site and it
argues in **diagrams** as much as in writing — twenty-two of them, all inline SVG — and it
is the only place on the site set in a serif. See
[The Note Dissemination Framework](2026-09-20-the-note-dissemination-framework.md).

## Known issues / TODO

- **None of the theory pages is a template any more.** `works/theory-01.html`,
  `works/theory-02.html`, `works/theory-03.html` and `works/resins-in-perfumery.html` all
  carry the owner's own writing. The two `example-*` files in `works/` are still the
  templates a new piece is copied from.
- **Only two of the four carry a standfirst** — the resins research and theory-03. The
  first two theories have none at all, which is the owner's to write or to leave.
- **Every plate on all four is still a hatched placeholder**, with its `<img>` commented
  out waiting for a file.
- The rule is built from the sections in the markup, so a page whose writing arrives
  with a different number of sections needs nothing done to it.

## 2026-09-23 — past the last section

`readingAt` had no answer for a window with **no section on it at all** — reading what
stands after the last one, as the perfume primer's motto, footnotes and sources do — and
fell through to the first section, so the rule said "Introduction" a few screens from the
end. It now names the last section whose top has been passed. Nothing changes while any
section is in view. Tested in `tests/primer.spec.js`.

## 2026-09-25 — no picture at the head of a theory

> Remove the picture from the Note dissemination framework, and all other theories.

Each theory opened on a **plate**: `theory-01.html` and `theory-02.html` on an empty one (the
`<img>` inside it commented out, waiting for a picture, and *What the picture shows.* under it),
and `theory-03.html` on its summary sheet. All three `<figure class="essay-plate">` blocks are
gone, and the comment at the top of `theory-01.html` (the template for a long essay) no longer
tells whoever copies it to point the plate at a picture. The `.essay-plate` rules stay in
`style.css`, because the resins research still carries one. The framework's inline diagrams are
not pictures and stay.

Tested: **`no theory carries a picture`** in `tests/essay.spec.js`.

## 2026-09-26 — Explorations 002, waiting for its writing

> Also add another exploration on "Buying A Perfume - A Philosophical Exploration" Make it be
> 002. make the page too, I will want to just add text later on.

`works/buying-a-perfume.html` is an essay page exactly as Cold vs Warm Incense was when it
arrived: the swarm, the sights, the rule, the kicker *Explorations · 002*, the title with *A
Philosophical Exploration* under it, and three sections — *Introduction*, *The exploration*,
*Conclusion* — which are a plain scaffold to be renamed, each saying *Waiting for the owner.* in
a dashed box. **Nothing in it was guessed at.** The comment at its head says how to write it in:
replace each box with paragraphs, rename the headings, copy a section to add one (the rule grows
a tick on its own; the *Sections* count in the head is the one number to change by hand). It is
in the search's `PAGES` and in `mobile.spec.js`'s list of pages. The row is in [index and
views](2026-09-17-the-index-pages-and-views.md).

Tested: **`Explorations 002 is Buying A Perfume, and its page stands ready for the owner's
writing`** in `tests/essay.spec.js` — the row, its number, kind and link; the numbers still
000 to 009; the page's head, its rule, and no paragraph that is not a waiting box.


## 2026-09-27 — Explorations 001, Dupes, Designers and Niches; 002 called Buying a Perfume

> Add two explorations in the RE tab: the first should be 001 (move everything down), and called
> Dupes, Designers and Niches. The second should be 002, and called "Buying a Perfume"

and then the whole of the writing for 001, with *"Dupes Designers and Niches\* / and Private lines
and ultra niches (this should only exist on the page of the exploration itself)"* at its head.

- **`works/dupes-designers-and-niches.html`** is a new essay page, **written**: seven sections —
  01 Introduction (the paragraph under the title, which had no heading of its own; the primer
  calls its own first section that too), 02 Dupes, 03 Designers, 04 Designer Private Line,
  05 Niches, 06 Ultra Niches, 07 Conclusion — every word the owner's, as sent. Four things were
  done to it and nothing else: the invisible left-to-right marks a word processor leaves were
  taken out; "E" after a price is **€**, as the owner asked ("25E(euro sign)") — and "80-150",
  which they sent with no currency, is "80-150€" too, at their word when asked ("add the euro sign
  yes"); the "too" they marked "(underline)" is
  **underlined** (`<u>`, a hairline under it, `.essay-section u`); and four **links** were added
  where the writing mentions a page on the site — Tobacolor, Favourites, ADAR and Scent
  descriptions — without changing a word. Two things in it read like slips and **were left**,
  because the words are the owner's: *"Lattafa, Armaf Afnan, and Zara. The first three…"* (a
  comma between Armaf and Afnan, which are two houses) and *"Luis Vuitton"*.
- **The subtitle is the page's alone**: the title is *Dupes, Designers and Niches\** and under it,
  in the head's italic, *\*and Private lines and ultra niches*. The row on the table says only
  *Dupes, Designers and Niches*.
- **002 is "Buying a Perfume"**. It was already there, at 002, as *Buying A Perfume - A
  Philosophical Exploration*, with its page waiting for its writing — so this is that row renamed,
  not a second one: the table says *Buying a Perfume*, and its page keeps *A Philosophical
  Exploration* under the title as its subtitle, the way 001 keeps its own. Its `<title>` says
  *Buying a Perfume* too.
- **Everything after moved down**: Resins in Perfumery is **003** and Cold vs Warm Incense
  **004** — and their pages' kickers say so now (*Researches · 003*, *Explorations · 004*; they
  said *01* and *01*, which was stale even before, since the explorations are numbered by the
  table). The table still runs 000 to 009: the last *Untitled* went to make room.
- **Everywhere a page has to be named**: a line in `PAGES` in `search-page.js`, in
  `tools/seo.py` (and the tool run), in `tests/mobile.spec.js` and `tests/pages.spec.js`.

Tested in `tests/essay.spec.js`: **`Explorations 001 is Dupes, Designers and Niches, written, with
its subtitle on its own page only`** (the row, the order of 000–004, the subtitle nowhere on the
table, the seven headings, nothing waiting, the € and the underline); **`Explorations 002 is
Buying a Perfume, and its page stands ready for the owner's writing`**; and **`the theories and the
researches reach their own pieces`**, which finds the research at the fourth row now.

## 2026-09-27, night — Buying a Perfume, written

The owner sent the whole of the writing — *"Buying a perfume / Simplifying the thought process"*,
an introduction, *What is the fragrance going to be used for?* with four pairs under it, *Special
Cases*, a conclusion and one footnote — with *"ADD THAT TO THE EXPLORATION OF HOW TO BUY A
PERFUME"*.

- **`works/buying-a-perfume.html` is written**: five sections — 01 Introduction, 02 What is the
  fragrance going to be used for?, 03 Special Cases, 04 Conclusion, 05 Footnotes — the owner's own
  headings, and under 02 and 03 their own smaller ones (*Night/Day*, *Inside/Outside*,
  *Summer/Winter*, *Safe/Divisive*; *All-Rounder*, *Club*, *Romantic*, *Formal*) as
  **`h3.essay-sub`**, the same subheading the primer uses. Every word is theirs, as sent — *Youre
  welcome.*, *Montblac*, *Ganneymede*, *Rodriquez*, *they you will remember* and all — with only
  the colons after the headings and the invisible marks a word processor leaves taken out.
- **Its subtitle is its own**: *Simplifying the thought process* stands under the title in the
  head's italic, in place of *A Philosophical Exploration*, and on this page only; the row on
  Explorations &amp; Researches still says *Buying a Perfume*, now dated 27.09.2026 (it was
  26.09).
- ***HOWEVER***, a line of its own in the owner's text, is set apart as one — spaced capitals in
  the mono (`p.essay-however`).
- **The footnote** the owner marked on *Romantic* (*"Romantic:footnote1"*) is a small raised
  number after that heading, down to **05 Footnotes** and back (`a.essay-fn`,
  `ol.essay-footnotes`, `a.essay-fn-back` — the primer's), so it stands on the rule too.
- **Three links** where the writing names something on the site, without changing a word:
  *dupes and designers* to Explorations 001, *Guitarist* to Qimu &amp; Musicians, *Tobacolor* to
  the individual fragrances.
- Its description for search engines says what it covers now (`tools/seo.py`, run).

Tested: **`Explorations 002 is Buying a Perfume, written in the owner's words, its subtitle on its
own page only`** in `tests/essay.spec.js` (it was *…stands ready for the owner's writing*) — the
row, the head and its subtitle, the five headings and eight subheadings, no waiting box, the
owner's words as written, the footnote there and back, and the two fragrances' links.

## 2026-09-28 — a thin line beside two paragraphs

> i want you to add a vertical line on the left of the paragraphs "In my opinion, a fragrance is
> an extension of the person using it. ..." [and] "The way you choose to present yourself ..." to
> emphasize them a little. just a thin line

On Buying a Perfume, the two paragraphs after *HOWEVER* stand in a `<div class="essay-set">`:
**one hairline down their left** in the essays' steel blue at a little over half strength, the
writing moved in from it (22px; 14px on a phone), and nothing else changed — no ground, no other
rule, the words exactly as they were. `.essay-set` can set apart any run of paragraphs on an essay
page the same way. Tested in the 002 test in `tests/essay.spec.js`: the two paragraphs in it, and a
1px line on the left only.

## 2026-09-28, last — Researches 003, Skin; Cold vs Warm Incense taken down

> also please add this into RE, where this should be 003. I also want you to remove the page for
> cold vs warm incenses, and make the text lighter gray (since the page wont exist)
> additionally, for the following RESEARCH, there are two tables which I want you to make. i have
> added them as images 1 and 2.
>
> also, if you can, add diagrams here and there, to make it more palpable.

Files: `works/skin.html` (new), `categories/researches.html`, `works/resins-in-perfumery.html`
(its kicker), `works/cold-vs-warm-incense.html` (deleted), `essay.js` (`nameOf`), `style.css`
(`.essay-figure`, `ed-*`, `.essay-table`, `.essay-sources`, `.essay-eq`), `search-page.js`,
`tools/seo.py` and `sitemap.xml`, `tests/essay.spec.js`, `tests/mobile.spec.js`,
`tests/pages.spec.js`.

**Skin — And how it affects the perfume you wear** is **Researches 003**, a research on the
essay ground like the others: ten sections — Introduction, pH, Bacteria, Oily, Dry and Moisturized
Skin, Diet, Hormones and Medications, The Geography of Skin, Conclusion, and then **Sources** and
**Footnotes**, in the owner's order, so both stand on the rule. **The writing is the owner's, word
for word** — "no one whom I ever asked was really explain it", "The opposite is applies as well",
their capitals and hyphens — with only their notes to me acted on and taken out: the pH equation
drawn as an equation, *pH = −log₁₀[H⁺]*, in the page's face for maths (`.essay-eq`, `--math`);
**test it on your skin!** in bold; the sources in MLA 8.

- **The two tables** the owner sent as pictures are tables (`.essay-table`): *Skin pH* against the
  effect on top notes, on base notes and on longevity, in pH; and *Body site* against average
  temperature, sebum and fragrance character, in The Geography of Skin — cell for cell, headed in
  the mono in the essays' steel blue, the row's name in the first column, the numbers in the mono.
  On a phone they scroll sideways rather than squeeze.
- **Eight diagrams, "here and there"** (`.essay-figure`, drawn in the page in SVG and a little
  HTML, hairlines, the steel blue only on what each is about), each saying only what the writing
  beside it says: **the strip and the skin** (lightest first, in order, on paper; on skin later,
  and one changed, over *pH · bacteria · sebum · warmth · hormones · diet*); **the pH scale**, 0 to
  14, neutral at 7, the skin's 4.5–6.5 marked, ×10 a step; **bergamot on two skins** — a tall,
  short curve at pH 4.5 and a lower, longer one at 6.5; **two ways bacteria change a perfume** — an
  enzyme turning linalool into an oxidised molecule, and *S. hominis*'s thioalcohols joining the
  perfume as one note more; **three skins** — dry (nothing held, 2–4 hours), moisturised (water
  holding what is drawn to water, longer than dry) and oily (sebum holding musks, resins and woods,
  8–12 hours); **what is eaten, given off and smelled** — fenugreek, sotolon, maple syrup; garlic
  and onion, allyl methyl sulfide, pungent; cumin, cuminaldehyde, warm, spicy curry (out of the
  owner's sixteenth footnote); **the cycle**, a ring with the time around ovulation lit; and **the
  body**, a figure in hairlines with the four places from the second table, the warmest drawn the
  brightest. Every one carries an `aria-label` saying what it shows.
- **Eighteen footnotes**, each a raised number leading down and a way back (the primer's and
  Buying a Perfume's). Two stand side by side twice (3 and 4, 11 and 12), a comma between them. Two
  sit in headings, and **the rule now leaves a footnote's number out of a section's name**
  (`nameOf` in `essay.js`), or it read *Diet13*.
- **The sources, in MLA 8** (`.essay-sources`): alphabetical by what each begins with, a hanging
  indent, the journal or site in italics, a DOI where there is one and the address where there is
  not, and for a web page with no date the day it was read (*Accessed 28 Sept. 2026.*). The owner
  listed Behan et al. twice; it is one work and stands once. The details were found for each (the
  articles on PubMed and in *Nutrients*, *Frontiers in Human Neuroscience* and *Chemical Senses*);
  the three blogs give no author and no date, so none is given.

**The row** is 003, a Research, dated 28.09.2026, and **everything after it moved down one**, as
when 001 and 002 were added: Resins in Perfumery is **004** — and its own page says *Researches ·
004* — Cold vs Warm Incense 005, the forest 006, the rain 007, and the last of the Untitled rows
went, so the table still runs 000 to 009.

**Cold vs Warm Incense has no page now.** It was never written — four sections each waiting in a
dashed box — and it is deleted, with its line in the search's manifest, in `tools/seo.py` and in the
sitemap. **Its row stays**, at 005, marked `data-open="no"` as the unwritten rows are: drawn lighter
and not a link — "make the text lighter gray (since the page wont exist)".

Tested in `tests/essay.spec.js`: **`Researches 003 is Skin: the owner's research with its two
tables, its diagrams, its footnotes and its sources`** — the row and the one after it, the resins
page's 004, the head, the ten headings (and the rule's names without footnote numbers), the owner's
words, none of the notes left to me, the bold, the equation with its 10 and its +, both tables cell
for cell and in their sections, at least seven diagrams in at least six sections each labelled and
drawn, eighteen marks in order each to its note and back, the thirteenth's link to its source, and
seven sources in alphabetical order with a hanging indent, the container in italics and a date read
where there is no volume; and **`Cold vs Warm Incense has no page: its row stays, lighter and not a
link`**. `the theories and the researches reach their own pieces` reads the resins research at the
fifth link now.

**Five slips in the footnotes, put right at the owner's word** ("yeah go for it", asked at the end of
the round): footnote 1's "powder of Hydrogen" is *power*, and its pH change "of 6 to 7" a tenfold
*decrease* in hydrogen (it said increase); footnote 3's "6.5 to 2.5" for a factor of 100 is *6.5 to
4.5*; footnote 4's "turpenes" is *terpenes*; and footnote 12 points at *footnote 10* for
*lipophilic*, where it said 8. Nothing else in the writing was touched.

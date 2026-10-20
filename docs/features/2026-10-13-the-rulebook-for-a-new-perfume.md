# The rulebook for a new perfume, and the first two it filed
Date: 2026-10-13
Files touched: `tools/note-library/RULEBOOK.md` (new), `tools/note-library/rulebook.js` (new),
`tools/note-library/catalogue.py`, `tools/note-library/base.json`, `tools/note-library/research/NEW4.py`
(new), `note-library/index.html` (its catalogue, written by the tool), `note-figures.js`,
`notes-data.js`, `individual-fragrances/individual-fragrances.html`, `scent-descriptions/index.html`,
`tests/rulebook.spec.js` (new), `tests/notes.spec.js`, `tests/fragrance-line.spec.js`, `CLAUDE.md`

What changed: The owner's twelve rules for adding a perfume — to a house, to the individual
fragrances or to the favourites — and every note it brings are written down in
`tools/note-library/RULEBOOK.md`, and a checker (`rulebook.js`) and a test hold whoever adds one to
them: a perfume added without its notes filed, a note missing from the Note Library, a description
with one source, a figure missing, or a source cited twice fails the suite until it is done. The
Note Library's list of sources now has every page in it once (Wikipedia's benzoin page was there
twice). And the first two perfumes were added by it: **Forbidden Flower** by Areej Le Doré and
**Ore** by Slumberhouse, individual fragrances 12 and 13, in the owner's words, with their pictures,
their notes, and five new notes and six new variations in the library.

## Why / key decisions

### What the owner asked

> afterwards, please make sure that all the notes used in areej le dore and ore have been accounted
> for in the note library. appropriately describe the new ones; and then do everything that you would
> do for any note in the note library. As a matter of fact, I want you to create a rulebook for every
> new note: [eleven steps] … Make this rulebook physical, add it to the code so that all of the above
> steps occur when adding a new perfume.

And, while it was being made: "please add 12) run any ambiguities by me and do not decide anything by
yourself to the rules of the additions of perfume."

### The rulebook is three things

- **On paper**: `RULEBOOK.md`, the twelve rules in the owner's words, and under each how it is done on
  this site, and whether the computer does it (the library counts a note's fragrances, its pyramid,
  its combinations and its statistics itself, from `notes-data.js`, each time it opens — rules 2, 7, 8
  and 9 need nothing written by hand), checks it, or only a person can (researching well, asking).
  CLAUDE.md sends anyone adding a perfume to it.
- **A checker**: `node tools/note-library/rulebook.js` reads the site as it stands — every part on
  every house and the individual fragrances, every favourite's `data-notes`, `notes-data.js`, the
  library's catalogue, `note-figures.js`, `network.js`'s `HOUSES` — and runs `catalogue.py --check`
  for the research. It says, rule by rule, what is not done, and **under rule 12 the questions it can
  see**: a name in no record, with the records it is near (a variation of one of them, or a new
  note?), or with none (which accord is it in?). `--check` exits with a failure while anything is
  undone.
- **A test**: `tests/rulebook.spec.js` runs the checker, checks the rulebook is on paper with all
  twelve rules and that CLAUDE.md names it, and opens the Note Library: for the newest fragrance on
  every page, every note it names counts it, at the tier its source gives (`NetScene.about`); and for
  every note of the newest individual fragrance, and one of each other page's newest, its window
  lists the fragrance by its own title under its tier, with *Most frequent combinations* and
  *Statistics* under them. (Read inside the page: pressed through the test browser's own pointer, the
  library's drawing kept it waiting on a still frame for five seconds a window.)

**Rule 1's one allowance** is `NO_LIST_FOUND` in `rulebook.js`: the eight fragrances looked up and
found nowhere (Tale's four, whose site could not be read; Om's Nymphaea Caerulea, Cannabis Café and
Smoke Oud; Lost Tribe's Kong), each with why — so a fragrance added with no entry at all is not
mistaken for one of them.

### Rule 11: one source, one entry (`catalogue.py`)

The sources were keyed by their address exactly, so the same page written two ways was two entries.
Now an address is keyed **as a page**: http and https, with `www.` and without, a slash or an anchor
at its end, are one. And `SAME_PAGE` folds an address that only leads to another — a redirect, a
second spelling of the same article — into it, so it has one entry and one number everywhere it is
cited; an entry's displayed address is its own first one. Any two entries left with **the same title
at the same site** fail `--check` until they are folded, or named in `NOT_SAME` as two pages.

The whole list was checked (1,190 sources): **one duplicate** — Wikipedia's *Benzoin resin*
(source 119) and *Benzoin (resin)* (120), the same article, the first a redirect to the second. 120
is folded into 119 as the owner said ("remove the second entry and apply the number of the first
instead of the second everywhere the second was used"), so every source after it is one number
lower. The Ensar Oud, Hermitage Oils and Fragrantica-forum entries that share an address up to its
`?` are different pages (different products, different threads), and stay.

`--check` also fails now when **the page is not what the research says** — a research file changed
and the tool not run since.

### Forbidden Flower and Ore

Every choice was the owner's (rule 12), asked:

- **Pictures**: Forbidden Flower's three are from Areej Le Doré's own shop (*Pictures: Areej Le Doré*,
  linked to its page), the bottle alone the large one, the two with its box under it; Ore's one from
  **Fumerie**, Slumberhouse's stockist. They were small already (the largest 1400px, 97KB), so the
  page loads them as uploaded.
- **The house is written *Areej Le Doré***, its own spelling (the owner had written it without the
  accent).
- **Their writing is the owner's, word for word**, its stages as `.human-stage` labels as they wrote
  them (*Top 1: immediately upon spraying*, *Top2: 5 minutes in* …); only the invisible marks the
  pasted text carried at the end of every line were taken out. **Note2 stopped mid-sentence**
  ("…it feels that this leans more into") and the owner gave its ending: "…leans more into being more
  dark and deep. The difference is huge."
- **Forbidden Flower's notes**: the house's own list, which it divides into top, heart and base, and
  Fragrantica's under it (the same notes in its own names, without the skunk). The house's own shop
  draws its pages in a way that could not be read from here, so the house's words were read as its
  stockists and Fragrantica copy them out; the entry says so.
- **Ore's notes**: three versions exist (2009, 2013, 2022); the owner smelled **the 2022 edition**, the
  red 30ml bottle in the picture. Its list is only on Fumerie (the brand's own text; its exact wording
  not confirmed), and Slumberhouse's own page still shows **the 2013 extrait's** list — so, at the
  owner's word, Fumerie's list first under *The 2022 edition's notes* with `version: "2022 edition"`,
  and the house's own under it. "Balsams of Peru and Tolu" is filed as the two notes it names.
- **The new notes**, filed as the owner chose: **Skunk Oil** (Musk, Skin & Animalic), **Night Blooming
  Jasmine** (Floral — it is not a true jasmine — with **Raani Flower**, its name in India, as its
  variation), **Dittany of Crete** (Aromatic & Herbal), **Muhuhu** (Woods) and **Bushman Candle
  Resin** (Resins & Balsams); and as variations, **Hemp Flower Oil** of Cannabis, **Indonesian Lime**
  of Lime, **Fossil Amber** of Amber (beside *Amber Fossil*, and the same thing), **Whiskey Lactone** of
  Whiskey and **Peru Resin** of Peru Balsam. Each described from three or four sources (two for none
  of them, as the owner's floor asks), in `research/NEW4.py`; 25 new sources. Their figures, in
  `FIGURES`: a skunk with its plume of a tail and its stripe, and a little of its spray; a cluster of
  small tubes of flowers under a crescent moon; a sprig of round woolly leaves with three hop-like
  heads hanging from it; a log with smoke off its cut end; three stems burning at their tips over
  tears of resin.
- **Everything was read through search summaries**: neither house's pages, nor Fragrantica, nor most
  of the sources would open from this container. Where a source's own words could not be confirmed
  (the order of Fragrantica's tiers, Ore 2022's wording) the entry says so.

The library is **374 notes** now (369), and its sources **1,214** (1,189 after the fold). The rulebook
found the eleven names before they were filed, and asked the same questions the owner answered.

## How to test it

- `node tools/note-library/rulebook.js` — *Every rule that can be checked is kept.*
- `python3 tools/note-library/catalogue.py --check` — exits 0.
- `npm test -- tests/rulebook.spec.js` (about four minutes): the checker finds nothing undone; the
  rulebook is on paper, twelve rules, the twelfth's words, and CLAUDE.md names it; the newest
  fragrance on every page is in the window of every note it names.
- `npm test -- tests/notes.spec.js tests/fragrance-line.spec.js`: the individual fragrances run 01 to
  13, every picture credited under itself (Forbidden Flower's as *Pictures*), the table thirteen
  rows.
- By eye: the individual fragrances page, 12 and 13 opened, and their View notes; the Fragrances view
  on Scent Descriptions; the Note Library, Skunk Oil, Night Blooming Jasmine, Dittany of Crete,
  Muhuhu and Bushman Candle Resin opened (their figures), and Cannabis, Lime, Amber, Whiskey and Peru
  Balsam for their new variations.

## Known issues / TODO

- **Rule 12 and rule 4 are a person's to keep.** The checker can say a note has two sources; it
  cannot say they are good ones, nor that the owner was asked. RULEBOOK.md says so.
- Skunk Oil's sources describe the skunk's spray, and the one that names it in Forbidden Flower is the
  perfumer's own word on Basenotes; no reference describes "skunk oil" as a perfumery material.
- The checker's near matches (rule 12's questions) are by shared words, so they can suggest an
  unlikely record; they are questions, not answers.

## 2026-10-20 — the thirteenth house filed by it

Apoteker Tepe's eight fragrances went through the rulebook: every spelling, every new note and
variation, its accord, the founder's name, the house's sentence about 2018 and Kogen's year were put to
the owner (rule 12), and the house's own lists come first and Fragrantica's second (rules 1–2). The
library is **379 notes**. The checker is clean, and `rulebook.spec.js` finds the newest on the page
(After the Flood) in the library. One thing the checker could not see: *Water Lily* was asked about as a
new note, and turned out to be the library's *Waterlily* written with a space — filed as a spelling. See
[Apoteker Tepe's report](2026-10-20-apoteker-tepe.md#the-note-library).

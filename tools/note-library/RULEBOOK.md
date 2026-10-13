# The rulebook: adding a perfume, and its notes

The owner's rules (2026-10-13), for **every perfume added to the site** — to a house, to the
individual fragrances, or to the favourites — and every note it brings with it. They are the
owner's words, numbered as they gave them; under each is how it is done here, and whether the
computer does it, checks it, or only a person can.

**Run the checker after adding a perfume, and before saying it is done:**

```bash
node tools/note-library/rulebook.js            # the report: what is not done, and what to ask
node tools/note-library/rulebook.js --check    # the same, failing if anything is not done
```

`tests/rulebook.spec.js` runs it with the rest of the suite, so a perfume added without these
steps fails the tests until they are done.

**Rule 12 governs all the others: run every ambiguity by the owner, and decide nothing alone.**

---

### 1. "check the newly added entries in houses or fragrances or favorites."

Every fragrance is a part on its page (`<details class="…-part" id="part-NN">`), and a favourite
names its notes by `data-notes`. Each has an entry in `notes-data.js` under its page's
`window.HOUSE_NOTES` and its number — `"individual:12"` — read from **the house's own page for that
perfume first, and Fragrantica only where the house publishes nothing**, as a second list beside it
where both exist (see CLAUDE.md, *the source hierarchy*).

*Checked*: every part and every favourite has an entry, and every entry a part. A fragrance looked
up and found nowhere is named in `NO_LIST_FOUND` in `rulebook.js`, with why.

### 2. "if there are existing notes; simply update the note library in terms of pyrammidal distribution, the numbers, and the combination page in the note library"

*Done by the library itself*: `network.js` counts every note's fragrances, its pyramid, its
combinations and its statistics from `notes-data.js` each time it opens. Nothing is written by
hand; an entry filed under rule 1 is counted at once.

*Checked* in the browser by `tests/rulebook.spec.js`: the newest fragrance on each page is in the
window of every note it names, at the tier its source gives.

### 3. "if there are new notes; add them to the note library. if they are variations of already existing notes then add them as such"

A new note is a line in `tools/note-library/base.json` in its accord — `id`, `name`, `aka`; a
variation is a spelling in an existing note's `aka`. Matching is exact (case aside): a name is the
note's only if it is its name or one of its spellings.

*Checked*: every note any fragrance names is in a record. **Whether a name is a new note or a
variation of one, and which accord a new note belongs to, is the owner's to say** (rule 12) — the
checker lists the near ones it sees as questions.

### 4. "Look them up with appropriate sources (at least 2) and write down their descriptions (either as new notes or as variations"

In a file in `tools/note-library/research/` (`research/acc.py` says how one is laid out): what the
note is, in the library's way — "holistic and simple, but not hold back" — from **two sources at
least**; a variation that is only another spelling says so (`same=`), a real difference is
explained with its own two. Then `python3 tools/note-library/catalogue.py` writes the page.

*Checked*: by `catalogue.py --check` — every note researched, two sources to every description,
every variation written.

### 5. "create a diagram for the notes in the red minimalist design already being used"

One line in `FIGURES` in `note-figures.js`, by the note's name: what the note is *of*, built from
the file's few geometric parts, in red particles — and, for a note best known by an outline, the
thing that stands for it, flat and facing you (see the test page's report, *the figure*).

*Checked*: every record has a figure.

### 6. "look up and do the pyrammidal distribution of the new notes and log it in, representing it appropriately."

The perfume's entry is `{ top, mid, base }` **only when its source divides them**, `{ flat: […] }`
when it gives one list, and never a pyramid made out of a review's prose. Where the house gives one
list and Fragrantica divides one, both stand, the house's first (*the two halves*).

*Checked*: no entry is both, every list is a list of names, and every entry has notes or says none
were found.

### 7. "make them easy to look up within the drop down menus below the pyrammidal distribution"

*Done by the library itself*: a note's window lists its fragrances under each tier — the individual
fragrances, then the houses, house by house — by the titles on their own pages, each a way to it.
A new house needs its line in `HOUSES` in `network.js`.

*Checked*: every house has its line, and every fragrance a title.

### 8. "create the most frequently used notes window below the pyramidal distribution"

*Done by the library itself*: *Most frequent combinations*, worked out from the same entries.

### 9. "add statistics (as with other notes)"

*Done by the library itself*: *Statistics*, the same. (8 and 9 are checked in the browser with 2.)

### 10. "Make sure to cite anything done, and to appropriately add the sources that have been used to the popup window of the note library, as well as the master list of citations."

Every perfume's notes name their source and link it (`source: { name, url }`), and every source a
note's description is written from is in the research file that describes it — and so in the
library's list of sources, in MLA 8, which is both **the popup** (the Sources, at the centre) and
**the list at the foot of the page**: one list, written by `catalogue.py`. A source read on another
day than the default carries the day.

*Checked*: every entry's source is named and linked; and the page is what the research says (the
catalogue written since the research last changed).

### 11. "check existing citations, and make sure there are no duplicates. if something was used twice, remove the second entry and apply the number of the first instead of the second everywhere the second was used."

`catalogue.py` gives a page one entry however its address is written (http or https, with `www.` or
without, a slash or an anchor at its end), and folds every address in `SAME_PAGE` — one that only
leads to another — into the one it leads to, so it has one number wherever it is cited. The first
fold was Wikipedia's *Benzoin (resin)* into its *Benzoin resin* (sources 120 and 119, 2026-10-13).

*Checked*: any two entries left with the same title at the same site fail the check until they are
folded, or named in `NOT_SAME` as two different pages.

### 12. "run any ambiguities by me and do not decide anything by yourself"

**The rule over all the others.** Ask the owner — with the multiple-choice question tool, the
choices laid out, batched — whenever anything could honestly go two ways: whether a name is a new
note or a variation, which accord a note is in, which of a fragrance's pictures comes first, where a
picture came from, how a house is spelled, what to do with writing that stops mid-sentence, which
version's notes to give. Never guess at a credit, a name or a note. The owner's words are never
changed.

*The checker prints the questions it can see* (`RULE 12 — ask the owner`); the rest is for whoever
is adding the perfume to notice.

---

See [the report](../../docs/features/2026-10-13-the-rulebook-for-a-new-perfume.md) for why it is
built this way.

# The Note Library's catalogue

What `categories/note-library.html` says of every note — what it is, what each of its
variations means, and the sources each was written from — is written into that page by
`catalogue.py`, from the files here. **Run by hand, never by the site**, like `tools/seo.py`.

```bash
python3 tools/note-library/catalogue.py          # write the page's catalogue
python3 tools/note-library/catalogue.py --check  # only report what is missing
```

- `base.json` — every accord and every note: its id, its name, its other spellings (`aka`, the
  variations) and the one line the old library gave it (`old`), which the page shows until the
  note is researched. **A new note or a new spelling goes here** (and a new note needs a figure
  in `note-figures.js`).
- `research/` — one file per accord (or part of one): `S`, its sources, and `N`, what each note
  is and what each variation means, naming its sources by key. `research/acc.py` says how a
  file is laid out. At least **two sources** to every description, at the owner's word; a
  variation that is only another spelling says so (`same=`) and needs none. `SPELL.py` holds
  those for notes not researched yet.

Sources are numbered as the page shows them — 1 is the owner, *Me.*, then every other source
in alphabetical order of its MLA 8 entry — so adding one renumbers those after it; that is why
the tool writes the whole catalogue rather than a note at a time. Each is dated *Accessed 29
Sept. 2026.* unless its entry in `S` gives the day it was read (a fifth item, `"2 Oct. 2026"`).

See [the test page's report](../../docs/features/2026-09-26-the-test-page.md) (the page it is
now) for the rest.

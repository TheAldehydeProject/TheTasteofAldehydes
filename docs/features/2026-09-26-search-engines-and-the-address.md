# Search engines, shared links, and the site's own address
Date: 2026-09-26
Files touched: every page's `<head>` (between its two `SEARCH ENGINES` comments), `tools/seo.py`
(new), `sitemap.xml` (new), `robots.txt` (new), `favicon.svg` (new), `apple-touch-icon.png` (new),
`images/social-card.png` (new), `CNAME` (the owner's, merged in from `main`),
`tests/repository.spec.js`, `CLAUDE.md`

What changed: Every page now tells a search engine what it is: a one-line **description**, the one
address it is known by (its **canonical**, on `thetasteofaldehydes.com`), an **icon**, and — for
the pages that are the site itself — what a **shared link** shows (its title, its line and a
picture of the title slide) and the **trail** it stands in. There is a **sitemap** listing every
page worth finding, and a `robots.txt` naming it. What is not the site itself — its search page,
the test and sandbox pages, the templates and the old forwarding pages — asks not to be listed.

The owner, 2026-09-26:

> can you also do search engine optimisation so that when you google this or look it up with any
> search engine, then it would look good?

and, part way through:

> the adress changed to thetasteofaldehydes.com, and the repo changed too. make sure youre doing
> the right thing please

## The address, and the repository

The site moved to its own domain, **thetasteofaldehydes.com**: the owner added a `CNAME` file to
`main` (commit `8d9758b`, "Create CNAME"), which is how GitHub Pages is told the domain. That
commit was merged into the working branch — an ordinary merge, nothing rewritten — so the domain
goes live with everything else rather than being undone by it. **Every link inside the site is
relative**, so nothing in the pages had to change for the new address; only what is written for
search engines names it.

The repository moved too: it is **TheAldehydeProject/TheTasteofAldehydes** now (GitHub still
forwards the old `danielyeet/whatdoesatreesmelllike` address). The working copy's `origin` was
pointed at the new one.

## What is in every page's head

Written by `tools/seo.py`, between `<!-- SEARCH ENGINES: begin … -->` and `<!-- SEARCH
ENGINES: end -->`, straight after the `<title>`:

- **`description`** — the line under the title in a search result. Written for each page in
  `tools/seo.py` and kept under about 155 characters, which is where a search engine cuts it. They
  are plain descriptions of what is on the page — the houses and categories name what is in them,
  the fragrances by name, because those are what people search for — and where the page already
  says what it is in the owner's own words, those words are used: the home page's is slide 2's
  sentence, the theories' *Some frameworks that I came up with myself*, Explorations &
  Researches' *Here you will find my researches and my explorations*, each essay's own opening.
- **`canonical`** — the page's one address, `https://thetasteofaldehydes.com/…`. The forwarding
  pages keep the one they already had (pointing at the house's new address), as one of their three
  ways of forwarding; they are not given a second.
- **The icons** — `favicon.svg`, an aldehyde drawn as a structural formula, set as a chemistry
  book sets one since 2026-09-27 (see the foot of this report), and
  `apple-touch-icon.png`, the same at 180px for a phone's home screen.
- **Open Graph and a Twitter card** — the title (the page's own, without the site's name after
  it), the line, and `images/social-card.png`: the title slide redrawn at 1200 × 630 on the squared
  paper, with the thread under it, *A portfolio / 2026 edition*, and the address at its foot.
  This is what a link shows when it is pasted into a message.
- **Structured data** — on the home page, the site's name (`WebSite`), which is how a search
  engine knows to call the result *The Taste of Aldehydes*; on every other page, the trail it
  stands in (`BreadcrumbList`: Home › Scent descriptions › ADAR), which a search engine may show
  in place of the address.

**Kept out** (`noindex, follow`, and not in the sitemap): `search.html`, the test page, the two
sandbox pages, the two templates, and the seven forwarding pages in `works/`. **`archive/`** is
kept out by `robots.txt` instead, because its one file is the old Fragrances view kept exactly as
it was, at the owner's word, and is not to be edited.

## The sitemap and robots.txt

`sitemap.xml` lists the twenty-five pages that are the site, the home page first, each with the
date it was written and a rough priority (the home page, then the categories and houses, then
the writing). `robots.txt` lets everything in but `archive/` and names the sitemap.

## Why / key decisions

- **Written into the pages, not added by a script at load**: a search engine reads the page as
  it arrives, and the site has no build step. `tools/seo.py` is run by hand, the way the tree's
  tool was; the site never runs it. Running it again changes nothing.
- **On the domain, not the old github.io address** — the owner's correction, and the reason the
  address is taken from `CNAME` by the test rather than written into it.
- **No author's name anywhere.** The site has never named its author, and naming the site was not
  naming the author.
- **Descriptions in plain words, and the owner's where they exist.** Nothing is written in the
  owner's voice that they did not write.

## How to test it

`tests/repository.spec.js`, **`every page tells search engines what it is, on the site's own
address`**: `CNAME` says `thetasteofaldehydes.com`; every page has exactly one description of a
sensible length, one canonical and an icon; every page for the world has its canonical on that
domain, is in the sitemap, and carries the Open Graph tags and a large Twitter card; every block of
structured data reads as JSON; the pages kept out say so and are not in the sitemap; the sitemap
names only pages that exist; `robots.txt` names the sitemap.

By hand, once it is live: paste a page's address into a message to see its card, and — the one
step that is the owner's to take — add the site to **Google Search Console** and submit
`https://thetasteofaldehydes.com/sitemap.xml`, which is how a new site gets found quickly.

## Known issues / TODO

- **A new page needs a line in `P` in `tools/seo.py`**, and the tool run again; the test fails
  until it has one.
- **Google Search Console** is the owner's to set up (it asks the owner of the domain to prove it
  is theirs).
- The picture a shared link shows is the same for every page.

## Later the same night — the icon is an aldehyde

> for the icon of the website (favicon), I want you to generate a handdrawn aldehyde formula (o
> double bodned to a C bonded to an H and an R group. make it simple and with the O facing up. make
> it black on a white background.

`favicon.svg` is **R–C(=O)–H drawn by hand**: the O on top, its double bond down to the C, the R
bonded on the left and the H on the right — every letter a pen stroke, a little uneven, in black
on a white square with softly rounded corners. `apple-touch-icon.png` is the same drawn at 180px.
It replaced the registration mark that stood there for part of the evening.

## Last — the aldehyde drawn as a chemist draws it

> favicon, i want you to make it less bold, and make the symbols not connect. also redesign it, i
> dont want it to be handdrawn, more so chemical and very technical.

`favicon.svg` is the same molecule, **drawn the way a structural formula is drawn** in a chemistry
program rather than by hand:

- **The geometry is the molecule's.** The C in the middle; the O straight above it on a double
  bond (two parallel lines); R and H below it either side, each at **120°** — the angles a carbonyl
  carbon actually makes. Every bond is the same length (18 units of the icon's 48).
- **The symbols do not connect.** Every bond stops short of the letters at both ends — a clear gap
  round each letter, worked out from the letter's box and the bond's angle — which is how a
  formula is set.
- **Less bold.** Bonds a little over 1 unit wide and the letters a little under (1.05 and 0.95; the
  hand-drawn one was 2.5), with square ends.
- **Technical letters**: O an ellipse, C the same ellipse opened on the right, H two stems and a
  bar, R a stem, a round bowl and a straight leg — geometric shapes in the one thin line, not type
  (an icon cannot rely on a font being there) and not a pen.
- Black on white, on a square with barely rounded corners. `apple-touch-icon.png` is the same at
  180px, rendered from the SVG.

The numbers were computed rather than placed by eye, which is what makes it read as technical: the
script that worked them out is not kept, because the file is the whole of it and its comment says
what it is.

## 2026-09-27 — a check against the whole list, and what was missing

The owner sent a list — *a descriptive `<title>`, a `<meta name="description">`, a viewport tag;
Open Graph and Twitter Card tags so the site looks good shared as a link; a `sitemap.xml` and a
`robots.txt`; exactly one `<h1>` per page, heading levels in order, a descriptive alt on every
image, semantic tags where appropriate; and that the site works on a phone* — with "I have no
programming background so please handle this yourself".

**Most of it was already here**, from the night before: every page had its title, description,
viewport, canonical, icons, Open Graph tags and a large Twitter card; the sitemap and `robots.txt`
were written. So the whole site was **audited** — every page loaded in a browser and read, as
written and as drawn — and what was actually missing was put right:

- **The Twitter card says everything itself** — `twitter:title`, `twitter:description`,
  `twitter:image` and `twitter:image:alt` — rather than leaving X to fall back on Open Graph's
  (which it mostly does, but not everywhere a link is shown).
- **A theme colour for every page** (`<meta name="theme-color">`): the page's own ground, read off
  each page as it is drawn — near-black on the essays, ADAR, Ataraxia, the Note Library, the
  search and the test page, the house's paper on the others — which a phone's browser paints its
  bar in. `THEME` in `tools/seo.py`; a page not named there is on the white paper.
- **A piece of writing says it is an article** (`Article` in the structured data, with its
  headline, line, address and picture, as part of the site) as well as the trail it stands in.
- **Two descriptions that were too short** — Contact's (*Contact The Taste of Aldehydes.*) and
  Buying a Perfume's — were written out to a sensible length. The sandbox pages' short ones were
  left: they are kept out of search engines anyway.
- **One `<h1>` on every page.** Explorations & Researches had none — its name was a paragraph; it
  is its `<h1>` now, looking the same. The search page and the test page are drawn with no title
  on them at all, and carry one that is read and not drawn (`.visually-hidden`, a new rule
  beside the site's headings). The Note Dissemination Framework had **two**: the calculator's own
  title is an `<h2>` now.
- **A `<main>` on every page** — the page's own content, which is what a screen reader jumps to
  and what a search engine weighs — and **a `<nav>`** round the Menu's links (`nav.js`). Where one
  box already held the whole page (the category pages, Contact, the search page, the sandboxes,
  the article template) that box **is** the `<main>` now, with its class unchanged; on the houses,
  the individual fragrances and the essays, a `<main class="page-main">` is **put round** the head
  and the writing, from the title to the last part, leaving the drawing, the credit and the foot
  outside it. Two things had to follow: the houses' way in lifted the head as **the body's own
  child** (`body.human-page > .human-head`), which it is not now, so those rules read any
  descendant; and the calculator is put in the `<main>` with the piece it stands in for. Nothing
  moves: the rule that dims the page behind the Menu reads the body's children, and `<main>` is
  one of them, so everything in it dims with it as before.
- **Every picture described.** Most already were. Ataraxia's five and Les Abstraits' four full
  pictures were not, nor were the twenty-eight in Pineward's gallery — which also left each of the
  gallery's links without a name. Each was **looked at** and described (*Deity, the bottle: amber
  under a gold cap, in firelight and smoke*; *Blue spruce branches*). The small thumbnail beside
  each fragrance's name keeps an empty description on purpose: it is hidden from a screen reader
  already (`aria-hidden`), because it repeats the picture described inside, and a reader would
  otherwise hear every name twice. A theory's card no longer leaves an empty picture in the page
  when it has none; the Photography page's waiting frames, which link to nowhere (`#`) and have
  nothing to name them by, are kept out of the way of the keyboard until their pictures arrive.
- **Headings in order**: none skips a level (an `<h3>` straight after an `<h1>` was the
  calculator's, and went with its `<h1>`).
- **On a phone** it already worked — every page is checked at 390px wide for sideways scrolling,
  and the new page is added to that check.

### The tab and the icon

> also make it so that when you click off of the tab, then the tab should be called "The Taste of
> Aldehydes" also make the aldehyde on the favicon a little more visible.

- **A tab looked away from says *The Taste of Aldehydes*** — gone to another tab, every page's
  title becomes the site's name, and coming back brings the page's own back (`nav.js`, on the
  browser's `visibilitychange`, so it is on every page that has the Menu).
- **The icon is heavier**: the same drawing a tenth larger on its square, its bonds 1.6 units wide
  and its letters 1.45 (they were 1.05 and 0.95 — a third of a pixel in a browser's tab, which is
  why it could barely be seen), and the double bond's two lines a little further apart so they
  stay two. `apple-touch-icon.png` rendered again from it.
- **And bolder again, later the same day** ("also please make the aldehyde in the favicon more
  visible"): what vanished in a tab was the **letters**, about two pixels tall, so they are half as
  large again (9.6 units tall, from 6.4), the lines about twice as heavy (bonds 2.8, letters 2.3),
  in pure black, and the formula fills the square to within three units of its edges. The bigger
  letters would have squeezed the C=O double bond down to two dots, so the O stands further up and
  the bonds are cut back from every letter by one small, even gap (1.2 units). The geometry is
  worked out rather than placed: the same arrangement — O above on its double bond, R and H at
  120° below — only larger. Three weights were drawn at 16, 32 and 48 pixels, on a normal and a
  sharp screen, before this one was chosen. `apple-touch-icon.png` rendered again from it.

Tested in `tests/repository.spec.js`: **`every page tells search engines what it is`** now also
asks for a theme colour on every page and the Twitter card's own title, line and picture on every
page for the world; **`every page has one h1, a main, headings in order, and every picture
described`** (new) reads every page as written — one `<h1>`, one `<main>`, a title, a viewport, a
language, no heading more than one level deeper than the one before, and every picture with an
alt, empty only where it is hidden as a duplicate. In `tests/pages.spec.js`, **`a tab looked away
from is called The Taste of Aldehydes, and gets its own title back`**.

**Still the owner's**: submitting the sitemap in **Google Search Console** (see above) — it asks
whoever owns the domain to prove it, which no one else can do.

## 2026-09-27, later — the icon from scratch, as a chemistry book sets it

> okay, i want you to do the favicon from scratch and make it look like a proper chemistry thing:
> something you would find in a nice and neat chemistry book

`favicon.svg` was drawn again from nothing, as the figures in a modern chemistry textbook are set —
the style ChemDraw calls **ACS** (the American Chemical Society's), which is what most books'
structures are drawn in:

- **Real letters.** The O, C, R and H are **Arial's** own letters (from Liberation Sans, which has
  Arial's shapes and widths) — the typeface textbook structures use — rather than shapes made up of
  ellipses and lines, which is what made the last one look home-made. They are turned into outlines
  inside the file, so every computer draws them the same without needing the font.
- **Each letter centred on its atom**, the middle of the letter's height on the atom's point.
- **Bonds as thick as the letters' strokes**, and every bond stopping the **same small margin**
  short of the letter at each end (9% of a bond's length), as a book's do.
- **The double bond** two even lines either side of the C=O axis, a fifth of a bond's length apart.
- **The shape of the molecule**: the O straight above the C, R and H at **120°** below it —
  trigonal, as a carbonyl carbon is. The letters stand at a little under half a bond's length
  tall, so the bonds read as bonds and not as dashes (the book's own proportion, tried first, left
  them stubby at this size).
- **One liberty**, said in the file: letters and bonds are drawn a little heavier than a book's
  (0.6 of a unit added to both, so they stay equal), because a book's weight is a third of a pixel
  in a browser's tab — the owner asked twice for the icon to be more visible, and that still holds.

Black on a white square, the figure filling it to two units of its edges. Five versions were drawn
and compared at 16, 32, 64 and 180 pixels, in a light and a dark tab, before this one. It was
worked out by a script from the font (kept out of the repository, like the last one — the file is
the whole of it). **`apple-touch-icon.png`** is the same figure on a plain white square with more
room round it, because a phone rounds the corners of a home-screen icon itself.

## 2026-09-29 — the home page's description

The home page's description in `tools/seo.py` follows slide 2, which lost its *even* at the owner's
word: *… theories and ideas.* The tool was run again; nothing else changed.

## 2026-10-01 — every Menu page at an address of its own name

The Menu's pages moved into folders of their names (thetasteofaldehydes.com/theories/ and so on —
see [their report](2026-10-01-addresses-of-their-own-names.md)), and `tools/seo.py` follows: its
keys are the new files (`theories/index.html`), **a folder's `index.html` is known by the folder**
(`addr()`: its canonical, its `og:url`, its place in a trail and in the sitemap are
`https://thetasteofaldehydes.com/theories/`), the eight old addresses and `/home/` are signposts with
`noindex` and their own canonical, and the pages without an entry are looked for in every folder.
The sitemap lists 26 pages. The tests read a folder's address the same way.

## 2026-10-03 — the icon white on black

> Inverse the colours of the icon please, where its not black on white but white on blakck.

`favicon.svg` is **white on black**: its square black, its letters and bonds white; nothing else of it
changed — the letters, the bonds and their weights are the chemistry book's as they were.
`apple-touch-icon.png`, a phone's copy, is made again from it at 180 × 180 on black (drawn by the
tests' browser from the SVG itself). `tests/repository.spec.js` still finds both where every page
points at them.

## 2026-10-05 — the icon red, glowing, skeletal, on its side

> also change the picture on the tab window. I want it to be a skeletal version of an aldehyde, maybe
> make it red, glowy, and sideways, where the hydrogens are on the side and the oxyugen is on the right.

`favicon.svg` is **formaldehyde, H₂C=O, as a skeletal formula, lying on its side**: lines only — the
carbon is the corner where the bonds meet, the two hydrogens the two bonds going off to the left, up
and down, 120° apart as a carbonyl carbon's bonds are, and the oxygen on the right at the end of the
double bond, its O drawn as a ring (not a font's letter, so it is the same everywhere). **Red, glowing**:
the site's red (`#ff3a44`, the Note Library's), a soft halo of it round every line (two blurs, in the
SVG itself), and a paler line down the middle of each, as a lit filament is; on the black square it has
stood on since 2026-10-03. **Drawn as a chemistry book's software draws one** — the owner, of the
first try: "No, i want it nicer and less compressed please": every bond the same length (13 of the
square's 48), 120° apart; the double bond's two lines either side of its axis, **each running into its
hydrogen's bond**, so each side is one clean bent line and nothing crosses between them (the first try
let the hydrogens' bonds meet at a point between the double bond's lines); the O a round letter (5.4 by
5.9), a small even gap past the bond's end; and the whole in the middle of the square with **room all
round it**, about 7 of its 48 on every side (the first try filled the square, its O a narrow oval
squeezed against the edge, its lines heavy). At a tab's 16 pixels it is soft; at 32, as most screens
draw a tab's icon now, the bent lines, the double bond and the open O are all plain. `apple-touch-icon.png`, a phone's copy, is made again from it at 180 × 180 on black, drawn by the
tests' browser from the SVG itself. Until now it was R–C(=O)–H in Arial's own letters, as a chemistry
book sets it, white on black — that drawing is in `favicon.svg`'s history. The picture a shared link
shows (`images/social-card.png`) is its own and was not changed.

How to test it: `tests/repository.spec.js` still finds both where every page points at them; by eye,
the icon at 16, 32 and 64 pixels and the phone's copy.


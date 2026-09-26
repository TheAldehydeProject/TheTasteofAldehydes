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
- **The icons** — `favicon.svg`, the site's own registration mark (a hollow square with a small
  one in it), and `apple-touch-icon.png`, the same at 180px for a phone's home screen.
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

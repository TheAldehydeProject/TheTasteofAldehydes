# The smell of aldehydes, in the menu
Date: 2026-09-29
Files touched: `nav.js`, `style.css`, `tests/menu.spec.js`

What changed: The menu — the same dark overlay on every page — carries **typography about the
smell of aldehydes on its right**, beside the list of pages. There are **three versions**, one of
which is shown (`MENU_TYPE` in `nav.js`, **the molecule** for now); the owner is to choose, and the
other two will then come out of the code.

## What the owner asked

> add some typography in the menu for the smell of aldehydes on the right side. use different fonts;
> or make it dynamic with particles (ill leave the creative freedom up to you but make sure its on
> theme (minimalist, particulate and/or geometric). if you want, code several variations, send me
> screenshots and then ill decide.

## The three

- **`"particles"` — the word in specks, fizzing.** *Aldehydes*, in a large italic (Instrument
  Serif), held in specks that tremble a hair and part from the hand; now and then a speck leaves the
  word and **rises like a bubble in a glass**, swaying and growing a little, and **bursts** into
  three. Under it, **what it smells of**, one word at a time: *smells metallic*, *cold*, *fizzing*,
  *soapy*, *waxy*, *clean linen*, *snuffed candle*, *orange peel*. A canvas, drawn only while the
  menu is open.
- **`"specimen"` — a type specimen.** *The smell of* and *Specimen · 01* across its head, the word in
  a large italic, and what it smells of **set in five faces and five sizes** on a faint squared ground
  between two rules — METALLIC in a wide geometric face (Unbounded), *cold* in a geometric mono (Major
  Mono Display), *soapy* in a serif italic, **waxy** in the site's own sans, heavy, *fizzing* in the
  italic's upright, CLEAN LINEN in the site's mono — and at its foot the three aldehydes perfumery
  leans on most, by formula: C₁₀H₂₀O decanal, C₁₁H₂₀O undecylenic, C₁₂H₂₄O lauric. The words come in
  one after another.
- **`"molecule"` — the aldehyde itself.** R–C(=O)–H drawn in hairlines as a chemistry book draws it
  (the same molecule as the site's icon), inside two rings; round it **a ring of what it smells of,
  turning slowly** (a full turn in ninety seconds); a **vapour of specks rising off the oxygen**; and
  under it *R–CHO* and *The smell of aldehydes*. SVG and CSS alone.

**`?menu-type=particles`** (or `specimen`, `molecule`) on any page's address shows that one without
changing anything.

## Why / key decisions

- **Beside the list, only where there is room.** The list is about 660px wide at its full size, so
  the typography stands in the room right of it from **1160px** up (`width: min(520px, 100vw −
  850px)`), and **under the list on a phone** that is tall enough (740px and more; the particles and
  the specimen across the foot, the molecule small in the corner). Between the two there is no room,
  and it is not there — the links are what the menu is for.
- **Its faces are asked for the first time the menu is opened** (or the hand comes onto the button,
  a beat sooner), never before: three families from Google Fonts — Instrument Serif, Major Mono
  Display and Unbounded — on top of the site's own two, on every page, would be paid for by every
  visit whether the menu is opened or not. The particles wait for the italic to arrive and draw the
  word again in it.
- **Ornament, kept from a screen reader** (`aria-hidden`); nothing in it is a link.
- **It draws only while the menu is open**, and stops a moment after it shuts.
- **It comes up a beat after the links** (0.45s), so the list is still what arrives first.
- **With motion turned off** it stands still: no fizz, no turning ring, no rising vapour, nothing
  coming in.
- It is inside the overlay, not on the body, so the Menu's dimming trap (`body > *:not(...)`) does
  not touch it. The test that no layer is drawn over the menu (`the menu opens the same way on every
  slide`) counts SVG outside it.

## How to test it

`tests/menu.spec.js`, **`the menu carries the smell of aldehydes on its right, in three versions`**:
one version shown, kept from a screen reader; no faces asked for before the menu opens, asked for
once it does; standing right of the list and clear of it at 1440px; gone when the menu shuts; each
of the three by `?menu-type=`; not there at 1024px.

By eye: open the Menu; add `?menu-type=particles` or `?menu-type=specimen` to the address to see
the others.

## Known issues / TODO

- **The owner chooses one.** The other two then come out of `nav.js` and `style.css`, and
  `MENU_TYPE` and `?menu-type=` with them.
- The words are the common ones for the fatty aldehydes' smell, not the owner's own; they are theirs
  to change.

# The smell of aldehydes, in the menu
Date: 2026-09-29
Files touched: `nav.js`, `style.css`, `tests/menu.spec.js`

What changed: The menu — the same dark overlay on every page — carries **typography about the
smell of aldehydes on its right**, beside the list of pages: **the molecule**, R–C(=O)–H in
hairlines with a ring of what it smells of turning round it. Three versions were made and shown;
the owner chose the molecule, and **the particles and the specimen were taken out of the code**.

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

**The owner chose the molecule** (2026-09-29, at the end of the round). The particles and the
specimen, `MENU_TYPE`, `?menu-type=` and the three faces only they used (Instrument Serif, Major
Mono Display, Unbounded, fetched when the menu first opened) are **gone from `nav.js` and
`style.css`**; the molecule is drawn in the site's own two faces and fetches nothing. The two
above are kept here for the reasoning, as the site keeps what it removed.

## Why / key decisions

- **Beside the list, only where there is room.** The list is about 660px wide at its full size, so
  the typography stands in the room right of it from **1160px** up (`width: min(520px, 100vw −
  850px)`), and **under the list on a phone** that is tall enough (740px and more; the particles and
  the specimen across the foot, the molecule small in the corner). Between the two there is no room,
  and it is not there — the links are what the menu is for.
- **It asks for nothing** — no faces of its own, no canvas, no frame loop: an SVG and the
  stylesheet's own animations. (While there were three, their faces were fetched the first time the
  menu opened, so as not to be paid for by every visit.)
- **Ornament, kept from a screen reader** (`aria-hidden`); nothing in it is a link.
- **Its movement is the stylesheet's**: the ring turns once in ninety seconds and the vapour rises,
  and neither costs anything while the menu is shut.
- **It comes up a beat after the links** (0.45s), so the list is still what arrives first.
- **With motion turned off** it stands still: no turning ring, no rising vapour, nothing coming in.
  On a phone it stays in its corner then too (the first version nudged it out of place there).
- It is inside the overlay, not on the body, so the Menu's dimming trap (`body > *:not(...)`) does
  not touch it. The test that no layer is drawn over the menu (`the menu opens the same way on every
  slide`) counts SVG outside it.

## How to test it

`tests/menu.spec.js`, **`the menu carries the smell of aldehydes on its right: the molecule, and
only it`**: kept from a screen reader; its four atoms and four bonds, and its ring of words; nothing
of the other two and none of their faces; right of the list and clear of it at 1440px; gone when the
menu shuts; `?menu-type=particles` still shows the molecule; not there at 1024px; on a 390 × 844
phone, small in the corner under the last link, on the screen.

By eye: open the Menu.

## Known issues / TODO

- The words are the common ones for the fatty aldehydes' smell, not the owner's own; they are theirs
  to change.

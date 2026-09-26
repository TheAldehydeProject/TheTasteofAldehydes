# The contact details, behind a captcha
Date: 2026-09-26
Files touched: `contact.html`, `contact.js` (new), `style.css` (`.contact-lock` and the rest),
`tests/contact.spec.js` (new), `CLAUDE.md`

What changed: Under the Contact page's one sentence — *Get in touch, send a carrier pigeon.*,
the owner's, which stays at its head — there is now a **captcha**: six characters drawn in specks
on a small canvas, a box to type them into, and, once they are typed, the **contact details**.
The details are **filler**, at the owner's word, and they are not written in the page in the
clear.

The owner, 2026-09-26:

> in contact, add a captcha that hides the contact information (let it be filer contact
> information)

## What it is

- **The characters**: six, from letters and numbers that cannot be read as one another (no O and
  0, no I, 1 and l, no S and 5, no B and 8, no G, Q or Z). Each is drawn in the site's face on a
  card of its own, turned a little and set a little off its line, and read back as the places a
  speck may stand — so it is drawn the way everything on this site is drawn, in specks — over a
  scatter of stray specks and two hairlines crossing it.
- **Typing them**: either case does, and spaces are ignored. Wrong, it says *Not quite — here are
  new characters.* and draws a new set. **New characters** draws a new set on request, for one
  that cannot be read.
- **The details**, once typed: a ruled list — *Email* `hello@example.com` (a mail link) and
  *Instagram* `@your.handle`. Both are filler; `example.com` is the address set aside for exactly
  that.

## Where the details are

In `data-sealed` on the page's `.contact-lock`: the list of details as JSON, each character
XORed with the word *aldehydes* in turn, then base64. `contact.js` undoes it (`unseal`) only once
the characters are typed. **To put real details in**, they are written the same way — the steps
are in the comment in `contact.html` — or asked for.

## Why / key decisions

- **Made here rather than a captcha service.** A captcha a server checks (reCAPTCHA, Cloudflare
  Turnstile) needs a server to check it, and this site has none: it is files. This check is made in
  the browser. It keeps out the programs that read pages for addresses — the details are not in
  the page for them to find — which is what hiding contact details is for; a program that runs
  the page's own script could still get past it, and that is said plainly in `contact.js`.
- **In specks**, because that is how the site draws, and because a speckled letter is harder for a
  program to read than a clean one.
- **Without the script**, the page is its sentence and a line saying the details need JavaScript;
  nothing about the details is on the page at all.

## How to test it

`tests/contact.spec.js`:

- **`the details are not in the page's source to be harvested`** — no `example.com`, no handle,
  no mail link in `contact.html` as it is served; the owner's sentence still its heading.
- **`the details stay hidden until the characters are typed, and a wrong answer draws new
  ones`** — the canvas carries hundreds of specks; a wrong answer says so, draws a new set, and
  still shows nothing.
- **`typed right, the details are shown, in either case`** — every random number the page asks
  for is fixed, so the characters are known (six D's), and typed in lower case they open the
  details.
- **`without its script the page says the details need JavaScript`**.

## Known issues / TODO

- **The details are filler** until the owner gives real ones.
- There is no spoken version of the characters for someone who cannot see them; *New characters*
  is the only way round a set that cannot be read.

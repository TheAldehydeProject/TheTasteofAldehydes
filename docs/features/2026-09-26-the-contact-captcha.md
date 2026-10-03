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
- **The details**, once typed: a ruled line — *Email* `hello@example.com` (a mail link). Filler;
  `example.com` is the address set aside for exactly that. (An *Instagram* `@your.handle` stood
  under it for the first round; see the foot of this report for why it went.)

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
  details: the email, and only the email.
- **`under the sentence, the owner's 'or just send an email:', and the check under that`** — the
  line in the owner's words, close under the sentence, the check under the line, and the check
  named by it.
- **`without its script the page says the details need JavaScript`** — the sentence and the
  owner's line are still there.

And in `tests/pages.spec.js`, the older **`the contact page says only to send a carrier pigeon`**
(from when the sentence was the whole page) is now **`the contact page says to send a carrier
pigeon, or an email behind a check`**: the sentence still the heading, the owner's line under it
and no other words but the check's own, nothing to follow and no address on the page.

## Known issues / TODO

- **The details are filler** until the owner gives real ones.
- There is no spoken version of the characters for someone who cannot see them; *New characters*
  is the only way round a set that cannot be read.

## Later the same night — "or just send an email:"

> for the contact information, keep this: Get in touch, send a carrier pigeon.
> Below it add :or just send an email: and there add the stuff that i told you to in our previous
> command.

- **The sentence stays** the page's heading, exactly as it was.
- **Under it, the owner's own line**, *or just send an email:* — lower case and with its colon, as
  they wrote it — in the reading's face, a size down from the heading and in its ink, so it reads
  as the sentence carried on (`.contact-or`). It is the head of the check now (the check is
  `aria-labelledby` it) and took the place of the small *Contact details* label that stood there.
- **And under that, the check**, as it was, whose button says *Show the email*; typed right, it
  shows **the email alone**. The filler *Instagram* line was taken out of the sealed details,
  because the line over them says what they are: an email. The characters, the specks and the
  sealing are unchanged.

## 2026-09-29 — "... or an email:"

> rewrite "or just send an email:" to "... or an email:"

The line under the sentence is the owner's **… or an email:** now (`.contact-or`, three full stops as
they typed them), and nothing else on the page changed. The test is **`under the sentence, the
owner's '... or an email:', and the check under that`**, and `tests/pages.spec.js` reads the page's
text with it.

## 2026-10-03 — checked against crawlers

> can youcheck that the email and the recaptcha will protect against web crawlers.

Checked, as a crawler would see it:
- **A program that reads the page** — what nearly every address harvester is — finds **no address**:
  the page's source has no address in it at all (searched for anything shaped like one), only the
  sealed details, which are the JSON XORed with *aldehydes* and then base64, and contain no `@`.
  Every other page of the site, its `sitemap.xml` and its `robots.txt` have none either.
- **A program that runs the page's script** (a browser driven by a program) still finds none: the
  address is only put on the page once the characters drawn in specks are typed back — and reading
  those is reading a picture.
- **What it does not stop**: someone who sets out to get the address from this page in particular.
  The check is made in the browser (the site has no server to make the other kind), so the way to
  unseal the details is in `contact.js`, and anyone reading it can undo it by hand. That is the trade
  every site without a server makes; a free mail service's own spam filtering is the second line.
- **The repository is public**: an address written in plain in it is an address in the clear, however
  well the page hides it. The tests wrote the filler address out (`hello@example.com`), so a real one
  put in the same way would have been in plain in `tests/contact.spec.js`. **The tests now unseal the
  page's own details** (`sealedDetails()`) and check the address shown against that, and look for
  anything shaped like an address rather than for `example.com` — so when the real address goes in,
  it need be written only sealed, in `data-sealed`, and nowhere else. (This report and `CLAUDE.md` name
  the filler, which is not anyone's.)

To seal the real details: the same JSON, `[["Email","name@domain","mailto:name@domain"]]`, each
character XORed with the next letter of *aldehydes* in turn, then base64 — `unseal` in `contact.js`
run backwards. `tests/contact.spec.js`, **`the details are not in the page's source to be harvested`**
and **`typed right, the details are shown, in either case`**, read whatever is sealed.

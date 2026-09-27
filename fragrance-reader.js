// ============================================================
// THE FRAGRANCE READER — the Fragrances view of
// categories/scent-descriptions.html
//
// Pressing a fragrance in that table used to LEAVE THE PAGE for
// individual-fragrances/individual-fragrances.html. The owner asked for it not to:
// "i dont want the page for the fragrances in SD to take you to a new
// page when you click a new fragrance. I want the fragrances to open
// in page and one by one."
//
// So it opens in place. The table and everything round it fades away,
// the page goes blank, and that one fragrance comes up on it: its
// PICTURE, its WRITING, and its NOTES, with an arrow at the foot to
// go back.
//
// WHERE THE WRITING COMES FROM, AND WHY IT IS FETCHED. It is not
// copied into this page. `individual-fragrances/individual-fragrances.html` is where a
// fragrance's writing lives, and this view FETCHES that page and lifts
// the part out of it. Two copies of the owner's own words is the one
// thing this site has a standing rule against — the index and the
// houses are "two ways into the same writing rather than two copies of
// it" — and a copy here would go stale the first time they edited the
// other one.
//
// THE NOTES ARE notes.js's, not this file's: `NOTE_PANEL` hands out the
// same renderer AND the same VIEW NOTES button and window every house
// page uses, so a fragrance's notes open on a click here too. One renderer, or the two
// drift apart and a reader is told different things about the same
// fragrance depending on which door they came in by.
//
// ============================================================
// THE WAY BACK IS A FADE
//
// The owner, 2026-09-27: "remove the transitions from the fragrances in
// fragrances SD to the fragrances SD page. Just make it fade away
// smoothly." So going back, the fragrance simply fades away, and the
// list is already standing behind it — exactly where it was left — so
// what you see is the one turning into the other, and nothing else.
//
// IT WAS A DRAWING OF ITS OWN until then, and none of it is here now:
// the writing went first, each picture was lifted out onto the window,
// squared up and sent in a straight line into one square of the page's
// grid, somewhere right of centre (`HOME`), and then they all faded
// together — the owner's own description, refined over several rounds
// (in a straight line, not turning; shorter; the wheel held still). If
// the owner says "the flier" or "into the grid", that is what they mean.
//
// TWO THINGS FROM IT STAND, because they are about the fade as much:
// SCROLLING IS HELD for the length of it ("when you scroll the whole
// page glitches out" — the wheel scrolled the fading reader about), and
// the list comes back EXACTLY WHERE IT WAS LEFT, the window's scroll and
// the table's both.
//
// THE READER IS RULED INTO THE PAGE'S OWN SQUARES — `--grid-cell`, 46px,
// set on :root and spent in `.sheet-page` — by the same declaration, and
// shifted by however far the page was scrolled into a square, so the
// ground does not jump as the one fades into the other.
//
// WITHOUT THIS SCRIPT every row is still a link to the fragrance on
// its own page, exactly as before. Nothing here is required to read
// anything.
// ============================================================
(function () {
  const view = document.querySelector('.view[data-view="fragrances"]');
  if (!view) return;
  const page = view.querySelector(".index-page");
  if (!page) return;

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const BLANK_MS = 560;         // the page going blank when one is opened
  const COME_MS = 700;          // and the fragrance arriving on it

  // THE WAY BACK: the fragrance fading away over the list, smoothly —
  // "Just make it fade away smoothly" (2026-09-27). The same length as
  // the table's own fade in under it (`.frag-stage`, 0.45s) and a little
  // more, so the two cross rather than one waiting on the other.
  const FADE_MS = 620;

  const WHERE = "../individual-fragrances/individual-fragrances.html";

  let sheet = null;             // that page, once it has been fetched
  let fetching = null;
  let open = false;
  let busy = false;

  /** The page's own writing for one fragrance, fetched once and kept.
      One request for the whole document, not one per fragrance: it is
      a single page and asking for it seven times would be seven times
      the same answer. */
  function theSheet() {
    if (sheet) return Promise.resolve(sheet);
    if (fetching) return fetching;
    fetching = fetch(WHERE)
      .then((answer) => {
        if (!answer.ok) throw new Error("individual-fragrances.html: " + answer.status);
        return answer.text();
      })
      .then((text) => {
        sheet = new DOMParser().parseFromString(text, "text/html");
        return sheet;
      });
    return fetching;
  }

  // ============================================================
  // THE READER, BUILT ONCE
  // ============================================================
  const reader = document.createElement("div");
  reader.className = "frag-reader";
  reader.hidden = true;
  reader.setAttribute("aria-live", "polite");
  reader.innerHTML =
    '<article class="frag-in">' +
      '<p class="frag-kicker"><span class="frag-no"></span><span class="frag-house"></span></p>' +
      '<h2 class="frag-name"></h2>' +
      '<div class="frag-body">' +
        '<figure class="frag-plate"><div aria-hidden="true"></div></figure>' +
        '<div class="frag-side">' +
          '<div class="frag-text"></div>' +
          '<div class="frag-notes"></div>' +
        "</div>" +
      "</div>" +
      '<button class="frag-back" type="button">' +
        '<span class="frag-arrow" aria-hidden="true">←</span>' +
        '<span>Back to the fragrances</span>' +
      "</button>" +
    "</article>";
  view.appendChild(reader);

  const inside = reader.querySelector(".frag-in");
  const plate = reader.querySelector(".frag-plate");
  // The table's own scrolling box. Taking the page off the screen
  // loses where it had been scrolled to, so it is written down first.
  const scroller = page.querySelector(".index-scroll");

  /** WHERE THE PAGE WAS when a fragrance was opened: the window's own
      scroll and the table's. Hiding the list shortens the page, and the
      browser pulls the window back to the top to fit — so without this
      the list came back somewhere other than where it was left, which
      is one of the ways "the whole page glitches out" on a phone. */
  let left = { y: 0, list: 0 };

  function cellSize() {
    const said = getComputedStyle(document.documentElement)
      .getPropertyValue("--grid-cell");
    return parseFloat(said) || 46;
  }

  /** How far the page stands into one of its squares, so the reader's
      grid — pinned to the window — lines up with the page's, which
      scrolls with it. */
  let shift = 0;

  // ============================================================
  // SCROLLING IS HELD WHILE ANYTHING IS MOVING
  //
  // The owner: "Make it so that this happens independently of
  // scrolling please, because when you scroll the whole page glitches
  // out." What the wheel did during the way back was scroll the reader
  // — still standing over the page, invisible — so the fading article
  // slid about under the pictures, and once the list was back it
  // scrolled the table under them too. For the few seconds a
  // transition takes, the wheel, a drag and the scrolling keys do
  // nothing at all, and everything is let go again the moment it ends.
  // ============================================================
  const SCROLL_KEYS = new Set([" ", "Spacebar", "PageUp", "PageDown", "Home", "End",
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
  const still = (event) => { if (event.cancelable) event.preventDefault(); };
  const stillKeys = (event) => {
    if (SCROLL_KEYS.has(event.key) && event.cancelable) event.preventDefault();
  };
  let held = false;
  function hold(on) {
    if (on === held) return;
    held = on;
    const how = on ? "addEventListener" : "removeEventListener";
    window[how]("wheel", still, { passive: false, capture: true });
    window[how]("touchmove", still, { passive: false, capture: true });
    window[how]("keydown", stillKeys, { capture: true });
    document.documentElement.classList.toggle("frag-still", on);
  }

  // ============================================================
  // OPENING ONE
  // ============================================================
  /** The notes windows standing for the fragrance that is open. */
  let windows = [];
  function notesOff() {
    windows.forEach((w) => w.remove());
    windows = [];
  }

  function show(no, row) {
    if (busy) return;
    busy = true;
    hold(true);
    const named = row.querySelector(".index-what");
    const house = row.querySelector("td:nth-child(3)");
    reader.querySelector(".frag-no").textContent = no;
    reader.querySelector(".frag-house").textContent = house ? house.textContent.trim() : "";
    reader.querySelector(".frag-name").textContent = named ? named.textContent.trim() : "";

    // The picture and the writing, out of the page they live in.
    const text = reader.querySelector(".frag-text");
    text.innerHTML = '<p class="frag-waiting">Fetching the writing…</p>';
    plate.querySelectorAll("img, .frag-plate-more, .frag-plate-credit").forEach((el) => el.remove());

    theSheet().then((doc) => {
      const part = doc.getElementById("part-" + no);
      if (!part) {
        text.innerHTML = '<p class="frag-waiting">This one has nothing written yet.</p>';
        return;
      }
      const writing = part.querySelector(".human-text");
      text.innerHTML = writing ? writing.innerHTML : "";
      // The View notes button belongs to that page, not to this one —
      // the notes are already printed below here.
      text.querySelectorAll(".note-open").forEach((b) => b.remove());

      // EVERY PICTURE THE PART HAS, not only the first. Haxan carries
      // three. The first stands full width; the rest stand in a row
      // under it, the way they do on the page they came from.
      const shots = [...part.querySelectorAll(".human-plate img")]
        .filter((shot) => shot.getAttribute("src"));
      let more = null;
      shots.forEach((shot, n) => {
        const img = document.createElement("img");
        // The fetched page's paths are relative to its own folder, and
        // this page stands in categories/ — the same depth, so they
        // resolve the same way. Taken off the attribute rather than off
        // `.src`, which the parser has already made absolute against
        // THIS page's address and would have been right by luck.
        img.src = shot.getAttribute("src");
        img.alt = shot.getAttribute("alt") || "";
        // A PICTURE THAT IS NOT THERE YET LEAVES THE HATCHING SHOWING,
        // which is what house.js does on every other page.
        img.addEventListener("error", () => img.remove());
        if (n === 0) { plate.insertBefore(img, plate.children[1] || null); return; }
        if (!more) {
          more = document.createElement("span");
          more.className = "frag-plate-more";
          plate.appendChild(more);
        }
        more.appendChild(img);
      });
      // AND WHERE IT CAME FROM, under it, as on the page it came from:
      // a picture is credited wherever it is used.
      const credit = part.querySelector(".human-plate-credit");
      if (credit) {
        const cap = document.createElement("figcaption");
        cap.className = "frag-plate-credit";
        cap.innerHTML = credit.innerHTML;
        plate.appendChild(cap);
      }
    }).catch(() => {
      text.innerHTML = '<p class="frag-waiting">The writing could not be fetched. ' +
        'It is on <a href="' + WHERE + '#part-' + no + '">its own page</a>.</p>';
    });

    // THE NOTES, BEHIND A BUTTON — the same VIEW NOTES and the same
    // window every house page has, by the same script. They used to be
    // printed out in full under the writing; the owner asked for them
    // to be "also click to open", like everywhere else on the site.
    notesOff();
    const notes = reader.querySelector(".frag-notes");
    const all = window.FRAGRANCE_NOTES || {};
    const panel = window.NOTE_PANEL;
    if (panel && panel.button) {
      const entry = all["individual:" + no];
      const id = "frag-notes-" + no;
      const name = named ? named.textContent.trim() : "";
      if (entry && entry.landscape) {
        windows.push(panel.button({
          text: notes, id: id + "-landscape", extra: "note-open-landscape",
          calls: "Olfactory landscape", titled: "Landscape", name: name,
          body: panel.landscape(entry.landscape, id + "-landscape"),
        }));
      }
      windows.push(panel.button({
        text: notes, id: id, calls: "View notes", titled: "Notes", name: name,
        body: panel.html(entry, id),
      }));
    }

    left = {
      y: window.scrollY || window.pageYOffset || 0,
      list: scroller ? scroller.scrollTop : 0,
    };
    const cell = cellSize();
    shift = left.y % cell;
    reader.style.backgroundPosition = shift ? "0 " + (-shift) + "px" : "";

    reader.hidden = false;
    reader.classList.remove("is-leaving");
    open = true;
    page.classList.add("is-going");
    document.body.classList.add("frag-open");

    window.setTimeout(() => {
      page.hidden = true;
      page.classList.remove("is-going");
      reader.classList.add("is-here");
      reader.scrollTop = 0;
      const back = reader.querySelector(".frag-back");
      if (back) back.focus({ preventScroll: true });
      busy = false;
      hold(false);
    }, REDUCE_MOTION ? 0 : BLANK_MS);
  }

  /** The list, back exactly where it was left. */
  function restore() {
    page.hidden = false;
    window.scrollTo(0, left.y);
    if (scroller) scroller.scrollTop = left.list;
  }

  // ============================================================
  // THE WAY BACK
  // ============================================================

  function hide() {
    if (busy || !open) return;
    busy = true;
    hold(true);
    // A notes window left up would stand over the way back.
    windows.forEach((w) => w.close(true));

    const done = () => {
      reader.hidden = true;
      reader.classList.remove("is-here", "is-leaving");
      reader.style.backgroundPosition = "";
      notesOff();
      open = false;
      busy = false;
      document.body.classList.remove("frag-open");
      hold(false);
      const first = page.querySelector(".index-search-field");
      if (first) first.focus({ preventScroll: true });
    };

    if (REDUCE_MOTION) { restore(); done(); return; }

    // THE LIST IS BACK BEHIND IT FIRST, exactly where it was left, and
    // coming up as the fragrance goes (the table's own fade in, when
    // `frag-open` comes off the page).
    restore();
    document.body.classList.remove("frag-open");
    // AND THE FRAGRANCE FADES AWAY over it, the whole of it at once.
    reader.classList.add("is-leaving");
    reader.classList.remove("is-here");
    let over = false;
    const end = () => { if (over) return; over = true; reader.removeEventListener("transitionend", ended); done(); };
    const ended = (event) => { if (event.target === reader && event.propertyName === "opacity") end(); };
    reader.addEventListener("transitionend", ended);
    // In case the browser never says it has finished.
    window.setTimeout(end, FADE_MS + 200);
  }

  // ============================================================
  // KEEPING UP
  // ============================================================
  // THE ROW IS STILL A LINK, and that is deliberate: with this script
  // blocked every fragrance still opens on its own page. What changes
  // is only what a PRESS does.
  page.addEventListener("click", (event) => {
    const link = event.target.closest(".index-what a");
    if (!link) return;
    const at = (link.getAttribute("href") || "").match(/#part-(\d+)/);
    if (!at) return;
    const row = link.closest("tr");
    if (!row) return;
    event.preventDefault();
    show(at[1], row);
  });

  reader.addEventListener("click", (event) => {
    if (event.target.closest(".frag-back")) hide();
  });

  // Whether a notes window was up when the key went down, read in the
  // capturing phase — before notes.js has had the chance to shut it.
  let notesUp = false;
  document.addEventListener("keydown", () => {
    notesUp = !!document.querySelector(".note-panel:not([hidden])");
  }, true);
  document.addEventListener("keydown", (event) => {
    if (!open) return;
    if (event.key !== "Escape" && event.key !== "Esc") return;
    // Escape shuts a notes window first; only with none up does it take
    // you back to the list.
    if (notesUp) return;
    hide();
  });

  // Leaving the Fragrances view by its own button closes whatever is
  // open — the two views are one page and the reader belongs to one of
  // them.
  document.addEventListener("click", (event) => {
    if (!open) return;
    if (event.target.closest(".sheet-filter")) {
      page.hidden = false;
      reader.hidden = true;
      reader.classList.remove("is-here", "is-leaving");
      reader.style.backgroundPosition = "";
      notesOff();
      document.body.classList.remove("frag-open");
      open = false;
      busy = false;
      hold(false);
    }
  }, true);
})();

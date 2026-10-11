// ============================================================
// THE HOUSE SHAPE — the behaviour every house page shares
//
// Pineward, ADAR and Almost Human each carry their own copy of this,
// because each of those pages was built on its own and the copy was
// the honest price of keeping page scripts standalone. By the fourth
// house it was not: Ataraxia, Grande Parfums and Les Abstraits arrived
// together, and three more copies of the same two hundred lines would
// have been four to fix every time one of them was wrong.
//
// SO THIS IS THE SHAPE WITHOUT THE GROUND. What it does:
//
//   THE PARTS      Each fragrance is a real <details>. This gives it a
//                  measured open and close so the page does not jump
//                  under what is being read, and brings each one up as
//                  it is reached.
//   THE RANK       The scale down the side: the fill is how far down
//                  the page you are, the ticks are how many fragrances
//                  you have been past. Two readings, said separately,
//                  the same as the three older houses.
//   THE PICTURES   A photograph that is not there yet is taken off the
//                  page, so the hatched placeholder shows instead of a
//                  broken-image mark.
//
// WHAT IT DOES NOT DO is draw anything. A house's ground is its own
// script and its own canvas — Ataraxia has ataraxia.js and the other
// two have nothing yet — and the two never speak to each other. They
// simply stand on the same page.
//
// IT USES THE `human-` CLASS NAMES. They were written for Almost Human
// and are the house shape's names now: `.human-page`, `.human-part`,
// `.human-body`, `.human-rank` and the rest. Renaming them would touch
// three working pages and their tests to no end; the prefix is where
// they were born, not what they mean.
//
// WITHOUT THIS SCRIPT a house page is all of its writing: every part
// is a real <details> that opens, and nothing is hidden.
// ============================================================
(function () {
  const page = document.querySelector(".human-page");
  if (!page) return;
  const parts = [...document.querySelectorAll(".human-part")];
  if (!parts.length) return;

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const RISE_STEP = 90;      // how far apart two parts arrive, in ms
  const OPEN_MS = 760;
  const SHUT_MS = 620;
  const PART_EASE = "cubic-bezier(0.42, 0.02, 0.24, 1)";

  // ============================================================
  // A PHOTOGRAPH THAT IS NOT THERE YET
  //
  // Taken off the page rather than left to fail, so what shows is the
  // hatched placeholder every unfinished plate on this site shows. A
  // broken-image mark reads as a fault rather than as work still to
  // come, and a house should be publishable one photograph at a time.
  // ============================================================
  document.querySelectorAll(".human-part img, .human-hero img").forEach((picture) => {
    picture.addEventListener("error", () => picture.remove());
    // Decoded off the page's own thread, so a page of a thousand pictures
    // arriving as it is scrolled does not stop to decode each (2026-10-11).
    picture.decoding = "async";
    // AND THE ONES THAT HAVE ALREADY FAILED BY NOW. A picture whose
    // file is missing usually errors before this script has run at all,
    // and an `error` listener added afterwards never hears about it —
    // so on a house with no photographs yet every placeholder stayed
    // hidden behind a broken picture. `complete` with no width is a
    // picture the browser has finished with and got nothing from.
    if (picture.complete && !picture.naturalWidth) picture.remove();
  });

  // ============================================================
  // THE RANK — the scale down the side, and the reading
  // ============================================================
  const rank = document.createElement("div");
  rank.className = "human-rank";
  rank.setAttribute("aria-hidden", "true");
  rank.innerHTML =
    '<span class="human-rank-line"><span class="human-rank-fill"></span></span>';
  const ticks = document.createElement("div");
  ticks.className = "human-ticks";
  parts.forEach(() => {
    const tick = document.createElement("span");
    tick.className = "human-tick";
    ticks.appendChild(tick);
  });
  rank.appendChild(ticks);
  page.appendChild(rank);

  const readout = document.createElement("p");
  readout.className = "human-readout";
  readout.innerHTML =
    '<span class="human-readout-no">00</span>' +
    '<span class="human-readout-of"> / ' +
      String(parts.length).padStart(2, "0") + "</span>" +
    '<span class="human-readout-where">Introduction</span>';
  page.appendChild(readout);

  const tickAt = Array.from(ticks.children);
  const rankFill = rank.querySelector(".human-rank-fill");
  const readNo = readout.querySelector(".human-readout-no");
  const readWhere = readout.querySelector(".human-readout-where");

  /** How much of the WINDOW this thing is filling, in pixels. */
  function filling(el) {
    const box = el.getBoundingClientRect();
    return Math.max(0, Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0));
  }

  const NAMES_IT = 0.45;

  function nameOf(part) {
    const title = part.querySelector(".human-title");
    return title ? title.textContent.trim() : "";
  }

  // A THOUSAND FRAGRANCES (2026-10-11 — the owner expects about that many
  // on the individual fragrances page): where you are is found by halving
  // (`firstWhere`) rather than by measuring every fragrance from the first
  // on every scroll, and only the ticks that change are touched.
  /** The first part `test` is true of, the parts being in page order. */
  function firstWhere(test) {
    let lo = 0, hi = parts.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (test(parts[mid].getBoundingClientRect())) hi = mid; else lo = mid + 1; }
    return lo;
  }
  let said = "", passedTo = -1;
  function reckon() {
    const line = window.innerHeight * 0.34;
    let at = firstWhere((r) => r.top > line) - 1;
    const down = window.scrollY || window.pageYOffset || 0;
    const room = Math.max(0,
      document.documentElement.scrollHeight - window.innerHeight);
    // AT THE FOOT OF THE PAGE, EVERYTHING HAS BEEN PASSED. The last
    // fragrances never reach a line a third of the way down the window,
    // because the page runs out before they can. All three older houses
    // had that fault and all three have this rule.
    if (room > 0 && down >= room - 2) at = parts.length - 1;
    for (let n = Math.min(at, passedTo) + 1; n <= Math.max(at, passedTo); n++) {
      if (tickAt[n]) tickAt[n].classList.toggle("passed", n <= at);
    }
    passedTo = at;

    if (rankFill) {
      const filled = room > 0 ? Math.max(0, Math.min(1, down / room)) : 0;
      rankFill.style.transform = "scaleY(" + filled.toFixed(4) + ")";
    }

    // The one filling most of the window is among those on it.
    let most = 0, biggest = null;
    for (let n = firstWhere((r) => r.bottom > 0); n < parts.length; n++) {
      if (parts[n].getBoundingClientRect().top >= window.innerHeight) break;
      const got = filling(parts[n]);
      if (got > most) { most = got; biggest = parts[n]; }
    }
    // WHAT YOU ARE LOOKING AT. An open fragrance filling enough of the
    // window names itself; otherwise the answer is the introduction
    // until you have passed the first fragrance, and the house after
    // that. Asked of the COUNT rather than of what is filling the
    // window, because a short house still has its introduction on
    // screen at the foot of the page.
    const names = biggest && biggest.open && most >= window.innerHeight * NAMES_IT;
    const where = names ? nameOf(biggest) : (at < 0 ? "Introduction" : "The house");
    const now = String(at + 1) + "|" + where;
    if (now === said) return;
    said = now;
    readNo.textContent = String(Math.max(0, at + 1)).padStart(2, "0");
    readWhere.textContent = where;
  }

  // ============================================================
  // THE PARTS — coming up as they are reached, and opening on a
  // measured height so the page does not jump under what is being
  // read. The owner's words for it, on the first house: "smooth and
  // gradual, not so sudden".
  // ============================================================
  if (!REDUCE_MOTION && "IntersectionObserver" in window) {
    // PUT ON BEFORE ANYTHING IS WATCHED, because this is the class that
    // holds the parts back. Nothing is hidden until the script says it
    // is watching, so a blocked script leaves every one of them on the
    // page — and putting it on late would show them and then take them
    // away again.
    page.classList.add("human-ready");
    let due = 0;
    const watcher = new IntersectionObserver(
      (seen) => {
        const now = performance.now();
        if (now > due) due = now;
        seen.forEach((one) => {
          if (!one.isIntersecting) return;
          const wait = Math.max(0, due - now);
          due += RISE_STEP;
          setTimeout(() => one.target.classList.add("arrived"), wait);
          watcher.unobserve(one.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    // THE PARTS THEMSELVES are found in view by halving, a scroll at a time
    // (2026-10-11): watched by the browser one by one, a thousand of them
    // were a thousand intersections worked out every frame of a scroll.
    // A part comes up once at least a twelfth of it is in the window, above
    // its foot's last twelfth — as the watcher had it.
    const up = new Set();
    let looking = 0;
    const arriveInView = () => {
      looking = 0;
      if (up.size === parts.length) return;
      const h = window.innerHeight, now = performance.now();
      if (now > due) due = now;
      for (let n = firstWhere((r) => r.bottom > 0); n < parts.length; n++) {
        const part = parts[n], r = part.getBoundingClientRect();
        if (r.top >= h * 0.92) break;
        if (up.has(part)) continue;
        const need = r.height * 0.08;
        if (r.bottom < need || r.top > h * 0.92 - need) continue;
        up.add(part);
        const wait = Math.max(0, due - now);
        due += RISE_STEP;
        setTimeout(() => part.classList.add("arrived"), wait);
      }
    };
    const lookSoon = () => { if (!looking) looking = requestAnimationFrame(arriveInView); };
    window.addEventListener("scroll", lookSoon, { passive: true });
    window.addEventListener("resize", lookSoon);
    window.addEventListener("load", lookSoon);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lookSoon);
    lookSoon();
    document.querySelectorAll(".human-intro").forEach((one) => {
      one.classList.add("human-rises");
      watcher.observe(one);
    });
  } else {
    parts.forEach((part) => part.classList.add("arrived"));
  }

  parts.forEach((part) => measured(part, part.querySelector(".human-body"), part.querySelector(".human-cue")));
  // A FOLD — <details class="human-fold">, a dropdown in a house's writing
  // (2026-10-10, Om Parfums: "make the following a collapse-able text that
  // if you click it, then you reveal it", with "a sub-drop down window"
  // inside it). It opens and shuts on a measured height exactly as a part
  // does, a fold inside a fold too; without this script it is a plain
  // dropdown.
  document.querySelectorAll(".human-fold").forEach((fold) =>
    measured(fold, fold.querySelector(":scope > .human-fold-text"), null));

  function measured(part, body, cue) {
    const summary = part.querySelector(":scope > summary");
    if (!body || !summary) return;
    let moving = false;
    let pending = false;

    const say = () => { if (cue) cue.textContent = part.open ? "Close" : "Open"; };
    part.addEventListener("toggle", say);

    // Read off the stylesheet rather than written here, so the two
    // cannot disagree: the padding has to travel with the height, or
    // the last frame of closing is an empty box that then disappears.
    // Read the first time the part opens or shuts, not as the page opens:
    // read of a thousand shut parts (2026-10-11), it held the page up for
    // half a second — the browser has to work out the style of writing it
    // is not showing, one part at a time.
    let padTop = null, padBottom = null;
    const pads = () => {
      if (padTop !== null) return;
      const cs = getComputedStyle(body);
      padTop = cs.paddingTop;
      padBottom = cs.paddingBottom;
    };

    const settle = () => {
      body.style.transition = "";
      body.style.height = "";
      body.style.opacity = "";
      body.style.transform = "";
      body.style.overflow = "";
      body.style.paddingTop = "";
      body.style.paddingBottom = "";
      moving = false;
    };

    const drain = () => {
      if (!pending) return;
      pending = false;
      act();
    };

    function act() {
      moving = true;

      if (!part.open) {
        // Opened at once, because its contents have to be on the page
        // to be measured, and then run from nothing to the height they
        // want.
        part.open = true;
        pads();
        const to = body.scrollHeight;
        body.style.overflow = "hidden";
        body.style.height = "0px";
        body.style.paddingTop = "0px";
        body.style.paddingBottom = "0px";
        body.style.opacity = "0";
        body.style.transform = "translateY(8px)";
        requestAnimationFrame(() => {
          body.style.transition =
            "height " + OPEN_MS + "ms " + PART_EASE + ", " +
            "opacity " + Math.round(OPEN_MS * 0.7) + "ms " + PART_EASE + " " +
              Math.round(OPEN_MS * 0.3) + "ms, " +
            "transform " + Math.round(OPEN_MS * 0.8) + "ms " + PART_EASE + " " +
              Math.round(OPEN_MS * 0.25) + "ms, " +
            "padding " + OPEN_MS + "ms " + PART_EASE;
          body.style.height = to + "px";
          body.style.paddingTop = padTop;
          body.style.paddingBottom = padBottom;
          body.style.opacity = "1";
          body.style.transform = "none";
        });
        window.setTimeout(() => { settle(); reckon(); drain(); }, OPEN_MS + 60);
        return;
      }

      // Closing, the writing goes first and the box follows it down —
      // shut the element first and the browser takes the contents off
      // the page in that frame, which is the cut this exists to avoid.
      pads();
      const from = body.getBoundingClientRect().height;
      body.style.overflow = "hidden";
      body.style.height = from + "px";
      body.style.paddingTop = padTop;
      body.style.paddingBottom = padBottom;
      body.style.opacity = "1";
      requestAnimationFrame(() => {
        body.style.transition =
          "height " + SHUT_MS + "ms " + PART_EASE + ", " +
          "opacity " + Math.round(SHUT_MS * 0.55) + "ms " + PART_EASE + ", " +
          "transform " + Math.round(SHUT_MS * 0.6) + "ms " + PART_EASE + ", " +
          "padding " + SHUT_MS + "ms " + PART_EASE;
        body.style.height = "0px";
        body.style.paddingTop = "0px";
        body.style.paddingBottom = "0px";
        body.style.opacity = "0";
        body.style.transform = "translateY(6px)";
      });
      window.setTimeout(() => {
        part.open = false;
        settle();
        say();
        reckon();
        drain();
      }, SHUT_MS + 40);
    }

    summary.addEventListener("click", (event) => {
      if (REDUCE_MOTION) return;
      event.preventDefault();
      // A click that lands while the box is still moving is REMEMBERED,
      // not dropped — and only one is kept, so hammering the summary
      // does at most one more thing rather than queueing up a pile.
      if (moving) { pending = true; return; }
      act();
    });
  }

  // ============================================================
  // A SPOILER — <details class="human-spoiler">, the owner's for Spinal
  // Fluid: "a dropdown paragraph with the button saying 'spoiler
  // alert'. And even when you click it, the paragraph should be blurry,
  // covered with the words 'are you sure?', which if you click yes,
  // then it will unblur it, and if you click no, then it will collapse
  // it". Every time it is opened it asks again. Without this script it
  // is a plain dropdown that opens onto the paragraphs.
  // ============================================================
  document.querySelectorAll(".human-spoiler").forEach((spoiler) => {
    const text = spoiler.querySelector(".human-spoiler-text");
    const ask = spoiler.querySelector(".human-spoiler-ask");
    if (!text || !ask) return;
    spoiler.classList.add("is-asking");
    const hide = () => {
      spoiler.classList.remove("is-sure");
      ask.hidden = false;
      text.setAttribute("aria-hidden", "true");
      text.inert = true;
    };
    hide();
    spoiler.addEventListener("toggle", () => { if (spoiler.open) hide(); });
    ask.addEventListener("click", (event) => {
      const answer = event.target.closest("button");
      if (!answer) return;
      if (answer.dataset.answer === "yes") {
        spoiler.classList.add("is-sure");
        ask.hidden = true;
        text.removeAttribute("aria-hidden");
        text.inert = false;
      } else {
        spoiler.open = false;
        spoiler.querySelector("summary").focus();
      }
    });
  });

  // A result on the search page links straight at one fragrance, and
  // being shown a closed list with it somewhere inside is not an
  // answer. `SiteSearch` is only on the pages that load it; without it
  // this does nothing and the link still lands on the right part of the
  // page.
  if (window.SiteSearch) window.SiteSearch.openFromHash(".human-part");

  window.addEventListener("resize", reckon);
  window.addEventListener("scroll", reckon, { passive: true });
  reckon();
})();

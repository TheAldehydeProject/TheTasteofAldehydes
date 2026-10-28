// ============================================================
// APOTEKER TEPE — houses/apoteker-tepe.html
//
// The thirteenth house, and at its head since 2026-10-27 THE HILL — the
// owner, "try something new with the apoteker tepe page. I want you to use
// the image numbver 5 from the mountains. make it look cool, make it
// minimalist, use wahtever you need": their photograph AT MOUNTAIN 5, its
// sky cut away so the mountain stands on the house's own paper, printed in
// the house's green, contour lines echoing the ridge above it, and split
// along a fault three quarters of the way across, the house's eight juices
// in the split. All of that is the page's own markup and stylesheet
// (written by tools/apoteker/hill.py; `.tepe-hill` in style.css), opening
// by itself, and it stands whole without this script.
//
// THE SCROLL ("animate it on scrolling and opening"; then "when scrolling
// it is slow and laggy", 2026-10-28): as the page is scrolled down off the
// hill, the split opens further — the right block moved off the fault by as
// much again (`WIDE`) — and the contour lines lift off the ridge and thin,
// as mist does (`RISE`, `THIN`). The stylesheet does that itself, off the
// page's own scroll, wherever the browser can (`animation-timeline`), and
// then this does nothing but answer the tests. Where it cannot (Firefox,
// for now), this does it, straight off where the page is, each frame the
// page has moved — never a moment behind it, as it was for its first day.
// Nothing with reduced motion.
//
// (Until 2026-10-27, last, this was the frosted glass — the owner's five
// photographs blurred out but for a window, drawn on a canvas, with a
// panel of pictures, filters and the text's blending. All of it gave way
// to the hill.)
// ============================================================
(function () {
  const hill = document.querySelector(".tepe-hill");
  const box = document.querySelector(".tepe-hill-box");
  const right = document.querySelector(".tepe-hill-right");
  const lines = [...document.querySelectorAll(".tepe-hill-lines")];   // the two blocks' copies
  const marks = [document.querySelector(".tepe-section"), document.querySelector(".tepe-section-end")];
  if (!hill || !box || !right || !lines.length) return;

  // THE HOUSE'S SIGN over the summit's square comes up under the hand (the
  // stylesheet's :hover); a finger has no hover, so a tap shows it and a tap
  // again, or anywhere else, puts it away.
  const summit = document.querySelector(".tepe-summit"), sign = summit && summit.querySelector(".tepe-sign");
  if (sign) {
    sign.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") summit.classList.toggle("is-signed"); });
    document.addEventListener("pointerdown", (e) => { if (!sign.contains(e.target)) summit.classList.remove("is-signed"); }, { passive: true });
  }
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const SHIFT = [0.02562, -0.00854];   // the right block's shift, in the box's widths (hill.py's SHIFT)
  const RISE = 0.3;               // of the scroll, the lines lift by, on top of the page's own
  const THIN = 0.75;              // the lines gone once this share of the hill has been scrolled past
  const WIDE = 1;                 // the split opened by as much again (hill.py draws it that wide)
  const WIDE_BY = 0.8;            // ... once this share of the hill has been scrolled past

  // For the tests: how far the lines have lifted, in css px, how strong they
  // are, and how much further than its own the split is open — read off the
  // page, whichever of the two moved them.
  const moved = (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform === "none" ? undefined : getComputedStyle(el).transform);
  window.TepeHill = {
    lift: () => Math.round(-moved(lines[0]).m42 * 10) / 10 || 0,
    strength: () => +getComputedStyle(lines[0]).opacity,
    wide: () => Math.round((moved(right).m41 / (box.clientWidth * SHIFT[0])) * 1e4) / 1e4 || 0,
    byStylesheet: () => byStylesheet,
  };

  const byStylesheet = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()"));
  if (byStylesheet) return;

  const smooth = (t) => t * t * (3 - 2 * t);
  let queued = false, last = -1;
  function place() {
    queued = false;
    const reach = hill.offsetHeight || 1;
    const at = Math.min(Math.max(0, window.scrollY || 0), reach);   // past the hill, nothing left to move
    if (at === last) return;
    last = at;
    const u = at / reach;
    const w = WIDE * smooth(Math.min(1, u / WIDE_BY)), width = box.clientWidth;
    const x = SHIFT[0] * width * w, y = SHIFT[1] * width * w;
    right.style.transform = w ? "translate3d(" + x.toFixed(1) + "px, " + y.toFixed(1) + "px, 0)" : "";
    marks[0].style.transform = "translate3d(" + (x / 2).toFixed(1) + "px, " + (y / 2).toFixed(1) + "px, 0) rotate(21.8deg)";
    marks[1].style.transform = w ? "translate3d(" + (x / 2).toFixed(1) + "px, " + (y / 2).toFixed(1) + "px, 0)" : "";
    const lift = at ? "translate3d(0, " + (-at * RISE).toFixed(1) + "px, 0)" : "";
    const strength = at ? Math.max(0, 1 - u / THIN).toFixed(3) : "";
    for (const l of lines) { l.style.transform = lift; l.style.opacity = strength; }
  }
  addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(place); } }, { passive: true });
  addEventListener("resize", () => { last = -1; place(); });
  place();
})();

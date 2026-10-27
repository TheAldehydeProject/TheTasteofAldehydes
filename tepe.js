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
// WHAT THIS DOES is the scroll ("animate it on scrolling and opening"): as
// the page is scrolled down off the hill, the split opens further — the
// right block moved off the fault by as much again (`WIDE`, the box's
// `--wide`) — and the contour lines lift off the ridge and thin, as mist
// does (`RISE`, `THIN`). It follows the page a little behind it
// (`FOLLOW`), so a wheel's steps come out as one glide; the mountain itself
// scrolls with the page, so its foot is always let go into the paper and
// nothing of it ever slides under the writing. Only while the hill can be
// seen, and nothing with reduced motion.
//
// (Until the same day this was the frosted glass — the owner's five
// photographs blurred out but for a window, drawn on a canvas, with a
// panel of pictures, filters and the text's blending. All of it gave way
// to the hill.)
// ============================================================
(function () {
  const hill = document.querySelector(".tepe-hill");
  const box = document.querySelector(".tepe-hill-box");
  const lines = [...document.querySelectorAll(".tepe-hill-lines")];   // the two blocks' copies
  if (!hill || !box || !lines.length) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const RISE = 0.3;               // of the scroll, the lines lift by, on top of the page's own
  const THIN = 0.75;              // the lines gone once this share of the hill has been scrolled past
  const WIDE = 1;                 // the split opened by as much again (hill.py draws it that wide)
  const WIDE_BY = 0.8;            // ... once this share of the hill has been scrolled past
  const FOLLOW = 0.14;            // s: how far behind the page it follows

  const smooth = (t) => t * t * (3 - 2 * t);
  let now = 0, last = 0, frame = 0;   // how far down the hill it is drawn, in px

  function draw(at) {
    const u = Math.min(1, at / (hill.offsetHeight || 1));
    const lift = at > 0.05 ? "translate3d(0, " + (-at * RISE).toFixed(1) + "px, 0)" : "";
    const strength = at > 0.05 ? Math.max(0, 1 - u / THIN).toFixed(3) : "";
    for (const l of lines) { l.style.transform = lift; l.style.opacity = strength; }
    box.style.setProperty("--wide", (WIDE * smooth(Math.min(1, u / WIDE_BY))).toFixed(4));
  }
  function target() {
    return Math.min(Math.max(0, window.scrollY || 0), hill.offsetHeight);   // past the hill, nothing left to move
  }
  function step(t) {
    frame = 0;
    const dt = Math.min(0.1, Math.max(0, (t - last) / 1000));
    last = t;
    const to = target();
    now += (to - now) * (1 - Math.exp(-dt / FOLLOW));
    if (Math.abs(to - now) < 0.25) now = to;
    draw(now);
    if (now !== to) frame = requestAnimationFrame(step);
  }
  function wake() {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(step);
  }
  addEventListener("scroll", wake, { passive: true });
  addEventListener("resize", () => { now = target(); draw(now); });
  now = target();                 // a page opened part way down starts where it is
  draw(now);

  // For the tests: how far the lines have lifted, in css px, how strong they
  // are, and how much further than its own the split is open.
  window.TepeHill = {
    lift: () => { const t = lines[0].style.transform.match(/,\s*(-?[\d.]+)px/); return t ? -t[1] : 0; },
    strength: () => (lines[0].style.opacity === "" ? 1 : +lines[0].style.opacity),
    wide: () => +(box.style.getPropertyValue("--wide") || 0),
  };
})();

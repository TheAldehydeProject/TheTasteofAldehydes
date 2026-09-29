// ============================================================
// THE TITLE, AND ABOUT ME — index.html only
//
// Two things on the title slide, at the owner's word (2026-09-29):
//
//   THE TITLE GATHERS as the page loads ("add an animation to the title
//     page for when you load it in"): specks drift in from all over the
//     slide and settle into the letters of "The Taste of Aldehydes", the
//     letters themselves come up over them as they land, and the specks
//     let go. Then the line under it, the square, and the block in the
//     corner, in that order.
//
//   ABOUT ME, behind a square at the title ("a square at the title which
//     will blur out the page and bring up an 'about me' page (on the same
//     page more or less)"): the page goes out of focus behind a sheet
//     carrying the owner's two paragraphs, which come up one after the
//     other ("i want the About me to be slightly animated too"). Escape,
//     its close, or the page round it put it away.
//
// The About me's words are the page's own markup (#about), so they are
// there without this script; only the opening is this script's. It
// knows nothing of the other scripts on the page but one class on the
// body, `about-shown`, which landing.js reads so that the wheel and the
// keys do not change slides while it is open.
//
// With motion turned off the title is simply there and the sheet simply
// opens.
// ============================================================
(function () {
  const root = document.documentElement;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ------------------------------------------------------------
  // THE TITLE GATHERING
  // ------------------------------------------------------------
  const slide = document.getElementById("slide-1");
  const title = slide && slide.querySelector(".title-content h1");
  const reveal = () => {
    root.classList.remove("title-coming");
    root.classList.add("title-here");
  };
  // `?title-at=800` holds the gathering at that moment (for a picture of
  // it); the page is otherwise untouched by it.
  const HOLD = +new URLSearchParams(location.search).get("title-at") || -1;
  if (!slide || !title || REDUCE) reveal();
  else gather();

  function gather() {
    // Never kept waiting: if anything below has not got going in time,
    // the title comes up anyway (the stylesheet does the same by itself
    // after three seconds, for a page without this script).
    let done = false;
    const safety = window.setTimeout(() => { if (!done) { done = true; reveal(); } }, 2600);

    const canvas = document.createElement("canvas");
    canvas.className = "title-specks";
    canvas.setAttribute("aria-hidden", "true");
    slide.appendChild(canvas);
    const g = canvas.getContext("2d");
    const phone = window.innerWidth < 700;
    const dpr = Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2);

    const font = getComputedStyle(title).font;
    const ready = document.fonts && document.fonts.load ? document.fonts.load(font) : Promise.resolve();
    Promise.race([ready, new Promise((r) => window.setTimeout(r, 700))]).then(start, start);

    function start() {
      if (done) return;
      const box = slide.getBoundingClientRect();
      const W = box.width, H = box.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";

      // WHERE THE LETTERS ARE: every word of the title drawn where the
      // page lays it out (so a title that wraps on a phone is gathered
      // as it wraps), and the inked pixels taken as places to land.
      const ink = document.createElement("canvas");
      ink.width = Math.ceil(W);
      ink.height = Math.ceil(H);
      const ig = ink.getContext("2d");
      ig.font = font;
      ig.fillStyle = "#000";
      ig.textBaseline = "alphabetic";
      const text = title.firstChild && title.firstChild.nodeType === 3 ? title.firstChild : null;
      if (!text) { done = true; window.clearTimeout(safety); reveal(); canvas.remove(); return; }
      const re = /\S+/g;
      let m;
      while ((m = re.exec(text.data))) {
        const range = document.createRange();
        range.setStart(text, m.index);
        range.setEnd(text, m.index + m[0].length);
        const r = range.getBoundingClientRect();
        const mt = ig.measureText(m[0]);
        const asc = mt.fontBoundingBoxAscent || r.height * 0.78;
        const desc = mt.fontBoundingBoxDescent || r.height * 0.22;
        const y = r.top - box.top + (r.height - (asc + desc)) / 2 + asc;
        ig.fillText(m[0], r.left - box.left, y);
      }
      const data = ig.getImageData(0, 0, ink.width, ink.height).data;
      const size = parseFloat(getComputedStyle(title).fontSize) || 48;
      const WANT = phone ? 1300 : 2600;
      let step = Math.max(1.5, size / 26);
      let targets = [];
      for (let tries = 0; tries < 6; tries++) {
        targets = [];
        for (let y = 0; y < ink.height; y += step) {
          for (let x = 0; x < ink.width; x += step) {
            if (data[(Math.floor(y) * ink.width + Math.floor(x)) * 4 + 3] > 128) targets.push(x, y);
          }
        }
        if (targets.length / 2 <= WANT * 1.25) break;
        step *= 1.25;
      }
      const N = targets.length / 2;
      if (!N) { done = true; window.clearTimeout(safety); reveal(); canvas.remove(); return; }

      // WHERE THEY COME FROM: anywhere on the slide, more of them from
      // far off, each setting out a beat after the one to its left, so
      // the title fills in the way it is read.
      const titleBox = title.getBoundingClientRect();
      const left = titleBox.left - box.left, span = Math.max(1, titleBox.width);
      const cx = W / 2, cy = H / 2;
      const P = new Float32Array(N * 7);  // sx, sy, tx, ty, delay, dur, size
      for (let i = 0; i < N; i++) {
        const tx = targets[i * 2], ty = targets[i * 2 + 1];
        const a = Math.random() * Math.PI * 2, far = 0.35 + Math.pow(Math.random(), 0.6) * 0.75;
        const o = i * 7;
        P[o] = cx + Math.cos(a) * W * 0.62 * far;
        P[o + 1] = cy + Math.sin(a) * H * 0.62 * far;
        P[o + 2] = tx; P[o + 3] = ty;
        P[o + 4] = 120 + ((tx - left) / span) * 520 + Math.random() * 180;
        P[o + 5] = 700 + Math.random() * 380;
        P[o + 6] = Math.random() < 0.12 ? 1.9 : 1.2;
      }
      const LAND = 1550, LET_GO = 900;
      const ease = (x) => 1 - Math.pow(1 - x, 3);
      const t0 = performance.now();
      let revealed = false;
      const frame = (now) => {
        const t = HOLD >= 0 ? HOLD : now - t0;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, W, H);
        // Once they have landed, the letters come up and the specks let
        // go, drifting a little as they fade.
        const out = t < LAND ? 1 : Math.max(0, 1 - (t - LAND) / LET_GO);
        if (!revealed && t >= LAND - 260) { revealed = true; done = true; window.clearTimeout(safety); reveal(); }
        g.fillStyle = "#16161a";
        for (let i = 0; i < N; i++) {
          const o = i * 7;
          const x = Math.max(0, Math.min(1, (t - P[o + 4]) / P[o + 5]));
          if (x <= 0) {
            g.globalAlpha = 0.25 * out;
            g.fillRect(P[o], P[o + 1], P[o + 6], P[o + 6]);
            continue;
          }
          const e = ease(x);
          let px = P[o] + (P[o + 2] - P[o]) * e, py = P[o + 1] + (P[o + 3] - P[o + 1]) * e;
          if (t > LAND) { const d = (t - LAND) / LET_GO; px += Math.sin(i * 12.9898) * 6 * d; py -= 4 * d; }
          g.globalAlpha = (0.25 + 0.6 * e) * out;
          g.fillRect(px, py, P[o + 6], P[o + 6]);
        }
        g.globalAlpha = 1;
        if (HOLD >= 0) return;
        if (t < LAND + LET_GO) requestAnimationFrame(frame);
        else canvas.remove();
      };
      requestAnimationFrame(frame);
    }
  }

  // ------------------------------------------------------------
  // ABOUT ME
  // ------------------------------------------------------------
  const opener = document.querySelector(".about-open");
  const about = document.getElementById("about");
  if (!opener || !about) return;
  const sheet = about.querySelector(".about-sheet");
  const closer = about.querySelector(".about-close");
  let back = null;

  function open() {
    if (!about.hidden && about.classList.contains("is-open")) return;
    back = document.activeElement;
    about.hidden = false;
    document.body.classList.add("about-shown");
    opener.setAttribute("aria-expanded", "true");
    // One frame shown before it is opened, so that it comes up rather
    // than simply being there.
    void about.offsetWidth;
    about.classList.add("is-open");
    window.setTimeout(() => sheet.focus({ preventScroll: true }), REDUCE ? 0 : 120);
  }
  function close() {
    if (!about.classList.contains("is-open")) return;
    about.classList.remove("is-open");
    document.body.classList.remove("about-shown");
    opener.setAttribute("aria-expanded", "false");
    const gone = () => { if (!about.classList.contains("is-open")) about.hidden = true; };
    if (REDUCE) gone();
    else window.setTimeout(gone, 520);
    if (back && back.focus) back.focus({ preventScroll: true });
  }
  opener.addEventListener("click", open);
  closer.addEventListener("click", close);
  // The page round it puts it away.
  about.addEventListener("click", (e) => { if (e.target === about) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && about.classList.contains("is-open")) { e.preventDefault(); close(); }
    // The keys stay in it while it is open.
    if (e.key === "Tab" && about.classList.contains("is-open")) {
      const f = [...about.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")].filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Scrolling inside it scrolls it, and never the slides.
  about.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  window.AboutMe = { open, close, isOpen: () => about.classList.contains("is-open") };
})();

// ============================================================
// SHARED SITE NAVIGATION
// Builds the "Menu" button and overlay that appears the same
// way on every page. Include it like this, near the top of
// <body>, on every page you create:
//
//   <script>window.SITE_ROOT = "../";</script>
//   <script src="../nav.js"></script>
//
// SITE_ROOT tells this script how many folders deep the current
// page is, so links work correctly wherever the page lives:
//   - on index.html (at the root itself), use ""
//   - on a page inside /categories/ or /works/, use "../"
//
// To add or rename a page in the menu, edit the SITE_LINKS list
// below — that's the only place it needs to change.
// ============================================================

// ============================================================
// THE PAGE KEEPS ITS OWN TIME — "please make the animations in RE and in
// the test site clusters animate even when you click off of the page. as
// a matter of fact do that with all animations on the page please"
// (2026-09-28).
//
// Every drawing on the site moves a frame at a time, asking the browser
// for the next one (`requestAnimationFrame`) — and a browser holds those
// back from a page it thinks is not being looked at: in a tab behind
// another one, in a window gone to the background, and in some browsers
// in a window that is simply not the one in front. So a page clicked off
// stood still where it was, and picked up from there when it was looked
// at again.
//
// So this stands in for the browser when it will not give a frame. While
// the window is not the one in front, or the page is hidden, every frame
// asked for is also promised by a timer (`STAND_IN_MS`); whichever comes
// first draws it and the other is let go. In front and looked at, nothing
// changes: the browser's own frames, and no timer at all. A hidden page's
// timers are run at most about once a second by the browser, so what is
// drawn meanwhile moves slowly there — and the drawings that move by the
// clock rather than by the frame (the Explorations field, the test page's
// turning, the house pages' bands and crests) are exactly where they would
// have been when the page is looked at again.
//
// It is here because every page loads nav.js before anything that draws.
// `window.KeepTime.standIn` is true while a timer's frame is being drawn,
// for a drawing that measures its own frames (the test page's).
// ============================================================
(function () {
  const native = window.requestAnimationFrame && window.requestAnimationFrame.bind(window);
  const cancelNative = window.cancelAnimationFrame && window.cancelAnimationFrame.bind(window);
  if (!native || !cancelNative) return;
  const STAND_IN_MS = 40;              // a frame promised this soon, while not in front
  const KeepTime = (window.KeepTime = { standIn: false, frames: 0 });
  const waiting = new Map();           // id → { raf, timer }
  let next = 1;
  const inFront = () => !document.hidden && (typeof document.hasFocus !== "function" || document.hasFocus());

  window.requestAnimationFrame = function (callback) {
    const id = next++;
    const one = { raf: 0, timer: 0 };
    const run = (t, standIn) => {
      if (!waiting.has(id)) return;
      waiting.delete(id);
      if (one.raf) cancelNative(one.raf);
      if (one.timer) window.clearTimeout(one.timer);
      if (standIn) { KeepTime.standIn = true; KeepTime.frames++; }
      try { callback(t); } finally { KeepTime.standIn = false; }
    };
    one.promise = () => { if (!one.timer) one.timer = window.setTimeout(() => run(performance.now(), true), STAND_IN_MS); };
    waiting.set(id, one);
    // Handed on under the drawing's own name, so anything that tells the
    // drawings' frames apart by it (the landing page's tests do) still can.
    const given = (t) => run(t, false);
    try { Object.defineProperty(given, "name", { value: callback.name || "" }); } catch (e) { /* a name is only a courtesy */ }
    one.raf = native(given);
    if (!inFront()) one.promise();
    return id;
  };
  // A frame asked for while the page was in front, and not yet given when
  // it is clicked off, is promised then.
  const promiseAll = () => { if (!inFront()) waiting.forEach((one) => one.promise()); };
  window.addEventListener("blur", promiseAll);
  document.addEventListener("visibilitychange", promiseAll);
  window.cancelAnimationFrame = function (id) {
    const one = waiting.get(id);
    if (!one) return;
    waiting.delete(id);
    if (one.raf) cancelNative(one.raf);
    if (one.timer) window.clearTimeout(one.timer);
  };
})();

const SITE_LINKS = [
  { label: "Home", href: "index.html" },
  { label: "Scent descriptions", href: "categories/scent-descriptions.html" },
  { label: "Theories", href: "categories/theories.html" },
  { label: "Explorations & Researches", href: "categories/researches.html" },
  { label: "Favourites", href: "categories/favorites.html" },
  { label: "Note Library", href: "categories/note-library.html" },
  { label: "Photography", href: "categories/other-2.html" },
  { label: "Search", href: "search.html" },
  { label: "Contact", href: "contact.html" },
];

// ============================================================
// THE TAB, WHILE IT IS NOT BEING LOOKED AT — "when you click off of the
// tab, then the tab should be called 'The Taste of Aldehydes'"
// (2026-09-27). Gone to another tab, every page's tab says the site's
// name; come back, and it says the page's own title again.
// ============================================================
(function () {
  const SITE_NAME = "The Taste of Aldehydes";
  let own = document.title;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (document.title !== SITE_NAME) own = document.title;
      document.title = SITE_NAME;
    } else if (document.title === SITE_NAME) {
      document.title = own;
    }
  });
})();

(function () {
  const root = typeof window.SITE_ROOT === "string" ? window.SITE_ROOT : "";
  // A URL ending in "/" — which is how the site root is normally visited —
  // has no filename on the end of it, and the server quietly serves
  // index.html for it. Without treating that empty case as index.html, the
  // Home link never gets marked as the page you're currently on.
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const trigger = document.createElement("button");
  trigger.className = "menu-trigger";
  trigger.type = "button";
  trigger.textContent = "Menu";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "site-menu-overlay");

  const overlay = document.createElement("div");
  overlay.className = "menu-overlay dark-surface";
  overlay.id = "site-menu-overlay";

  const list = document.createElement("ul");
  list.className = "menu-list";

  SITE_LINKS.forEach((link) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = root + link.href;
    a.textContent = link.label;
    const linkFile = link.href.split("/").pop();
    if (linkFile === currentPath) a.classList.add("menu-current");
    li.appendChild(a);
    list.appendChild(li);
  });

  // THE SITE'S NAVIGATION, said as such to a screen reader: the links
  // stand in a <nav> (2026-09-27; they stood in a plain box).
  const nav = document.createElement("nav");
  nav.className = "menu-nav";
  nav.setAttribute("aria-label", "Site");
  nav.appendChild(list);
  overlay.appendChild(nav);
  document.body.appendChild(trigger);
  document.body.appendChild(overlay);

  // The trigger's word changes mid-transition rather than the instant
  // you click, and fades out and back in as it does — swapping the text
  // instantly is the one thing that still read as abrupt.
  let labelTimer = null;
  function setLabel(text) {
    clearTimeout(labelTimer);
    trigger.classList.add("label-swap");
    labelTimer = setTimeout(function () {
      trigger.textContent = text;
      trigger.classList.remove("label-swap");
    }, 200);
  }

  function setOpen(open) {
    overlay.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    setLabel(open ? "Close" : "Menu");
    trigger.setAttribute("aria-expanded", String(open));
  }

  trigger.addEventListener("click", () => setOpen(!overlay.classList.contains("open")));
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  list.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
})();

// ============================================================
// THE SMELL OF ALDEHYDES, on the right of the menu (2026-09-29 — the
// owner: "add some typography in the menu for the smell of aldehydes on
// the right side ... on theme (minimalist, particulate and/or geometric).
// if you want, code several variations, send me screenshots and then ill
// decide"). Three were made — the word in fizzing specks, a type specimen
// in five faces, and this — and the owner chose THE MOLECULE; the other
// two were taken out.
//
// The aldehyde itself, R–C(=O)–H, drawn in hairlines as a chemistry book
// draws it (the site's own icon's molecule), in a cloud of specks in the
// home page's colours, and a vapour of specks rising off the oxygen; under
// it, three words for what it smells of. SVG, one small canvas and the
// stylesheet, in the site's own two faces.
//
// THE CLOUD (2026-09-30: "i dont want the circuling text around it; i want
// it to have particles similar in colour to that in the home page. not
// identical, but in general. if you want to keep text then keep metallic
// cold and soapy"): specks in the home page's warm grey, gold and violet —
// the gold round the double bond, the violet in two lobes off the oxygen,
// the grey a loose haze round the whole — each turning slowly about its
// place and twinkling, drawn only while the menu is open. It is not the
// home page's cloud (that is the real one, solved): it only says the same
// thing in the same colours. The ring of words that turned round it —
// metallic, cold, fizzing, soapy, waxy, clean linen, snuffed candle,
// orange peel — is gone; METALLIC, COLD and SOAPY stand still under it.
//
// It is ornament, and is kept from a screen reader. It stands only where
// there is room for it — beside the list on a wide window, in the corner
// under it on a tall phone. With motion turned off it stands still.
// ============================================================
(function () {
  const overlay = document.getElementById("site-menu-overlay");
  if (!overlay) return;

  // What an aldehyde smells of, as a perfumer says it: the three the owner kept.
  const WORDS = ["metallic", "cold", "soapy"];

  const aside = document.createElement("div");
  aside.className = "menu-aldehydes";
  aside.setAttribute("aria-hidden", "true");
  aside.innerHTML =
    '<canvas class="ma-cloud"></canvas>' +
    '<svg class="ma-mol" viewBox="0 0 400 400">' +
      '<circle class="ma-orbit" cx="200" cy="200" r="150"/>' +
      '<circle class="ma-orbit ma-orbit-2" cx="200" cy="200" r="186"/>' +
      // The bonds: C to O twice (a double bond), C to R and C to H at 120
      // degrees below, stopping short of every letter.
      '<g class="ma-bonds">' +
        '<line x1="194" y1="176" x2="194" y2="120"/><line x1="206" y1="176" x2="206" y2="120"/>' +
        '<line x1="188" y1="214" x2="140" y2="242"/><line x1="212" y1="214" x2="260" y2="242"/>' +
      "</g>" +
      '<g class="ma-atoms">' +
        '<text x="200" y="203">C</text><text x="200" y="111">O</text>' +
        '<text x="126" y="259">R</text><text x="274" y="259">H</text>' +
      "</g>" +
      '<g class="ma-vapour"></g>' +
    "</svg>" +
    '<p class="ma-words">' + WORDS.map((w) => "<span>" + w + "</span>").join("") + "</p>" +
    '<p class="ma-caption"><span>R–CHO</span><span>The smell of aldehydes</span></p>';
  // The vapour: specks rising off the oxygen, each on a clock of its own.
  const vapour = aside.querySelector(".ma-vapour");
  for (let i = 0; i < 18; i++) {
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", String(200 + (Math.random() - 0.5) * 16));
    c.setAttribute("cy", "92");
    c.setAttribute("r", String(0.8 + Math.random() * 1.4));
    // (in the lone pair's violet and the double bond's gold, by turns)
    c.setAttribute("class", i % 3 === 0 ? "ma-gold" : "ma-violet");
    c.style.setProperty("--drift", ((Math.random() - 0.5) * 60).toFixed(1) + "px");
    c.style.setProperty("--rise", (-50 - Math.random() * 60).toFixed(1) + "px");
    c.style.animationDelay = (-Math.random() * 4.8).toFixed(2) + "s";
    c.style.animationDuration = (3.6 + Math.random() * 2.4).toFixed(2) + "s";
    vapour.appendChild(c);
  }
  overlay.appendChild(aside);

  // THE CLOUD, on its canvas under the drawing, in the drawing's own 400 ×
  // 400: where each speck belongs, in which colour, and its own clock.
  const canvas = aside.querySelector(".ma-cloud");
  const ctx = canvas.getContext && canvas.getContext("2d");
  if (!ctx) return;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const GREY = "186,178,167", GOLD = "224,178,82", VIOLET = "169,138,216";
  let s = 17;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd() * 0.999)) * Math.cos(2 * Math.PI * rnd());
  const specks = [];
  const add = (n, tone, at, sx, sy, alpha) => {
    for (let i = 0; i < n; i++) {
      specks.push({
        x: at[0] + gauss() * sx, y: at[1] + gauss() * sy, tone,
        r: 0.5 + rnd() * 1.1, a: alpha * (0.45 + rnd() * 0.55),
        turn: (rnd() < 0.5 ? -1 : 1) * (0.1 + rnd() * 0.3), orbit: 1.5 + rnd() * 5, ph: rnd() * 6.283,
      });
    }
  };
  // the double bond: two lobes either side of C=O, in gold
  add(150, GOLD, [176, 146], 13, 22, 0.8);
  add(150, GOLD, [224, 146], 13, 22, 0.8);
  // the lone pair: two lobes off the oxygen, up and out, in violet
  add(110, VIOLET, [164, 86], 17, 13, 0.8);
  add(110, VIOLET, [236, 86], 17, 13, 0.8);
  // everything else: a loose haze round the whole, in the warm grey
  add(260, GREY, [200, 196], 72, 70, 0.5);
  add(60, GREY, [140, 246], 22, 18, 0.55);
  add(60, GREY, [260, 246], 22, 18, 0.55);

  let raf = 0, born = 0, size = 0, ratio = 1;
  function frame(now) {
    raf = 0;
    const open = overlay.classList.contains("open");
    const box = canvas.getBoundingClientRect();
    if (!open || box.width < 2) return;          // shut, or no room for it
    if (Math.round(box.width) !== size) {
      size = Math.round(box.width);
      ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
      canvas.width = Math.round(size * ratio);
      canvas.height = Math.round(size * ratio);
    }
    const k = (size / 400) * ratio;
    const t = still.matches ? 0 : (now - born) / 1000;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, 400, 400);
    ctx.globalCompositeOperation = "lighter";
    for (const p of specks) {
      const a = p.ph + t * p.turn;
      const x = p.x + Math.cos(a) * p.orbit + (still.matches ? 0 : Math.sin(p.y * 0.05 + t * 0.5) * 1.6);
      const y = p.y + Math.sin(a) * p.orbit * 0.8;
      const twinkle = still.matches ? 1 : 0.7 + 0.3 * Math.sin(t * 1.5 + p.ph * 7);
      ctx.fillStyle = "rgba(" + p.tone + "," + (p.a * twinkle).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, 6.283);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    if (!still.matches) raf = requestAnimationFrame(frame);
  }
  const wake = () => { if (!raf && overlay.classList.contains("open")) { born = born || performance.now(); raf = requestAnimationFrame(frame); } };
  new MutationObserver(wake).observe(overlay, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", () => { size = 0; wake(); });
})();

// ============================================================
// THE CURSOR
// Lives here rather than in its own file purely so it reaches
// every page without a script tag on each one — nav.js is
// already the shared site chrome.
//
// A hollow square with a dot in the middle. The dot is exactly
// where the pointer is; the square follows a beat behind, which
// is what makes it stretch when you move quickly and settle
// square when you stop. Over anything clickable it closes in and
// the dot opens up.
// ============================================================
(function () {
  // Nothing to replace on a touch screen, and no way to track it.
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

  const LAG = 0.16;        // how far behind the square runs
  const STRETCH = 0.055;   // how much speed pulls it out of square

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(ring);
  document.body.appendChild(dot);
  document.documentElement.classList.add("has-cursor");

  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let rx = tx, ry = ty;
  let awake = false;
  let lastUnder = null;

  // Rather than trusting a .dark-surface class to have been put on
  // everything dark, this reads the actual colour underneath: walk up
  // from whatever is under the pointer until something is painting an
  // opaque background, and go light if that colour is dark. The class
  // is still honoured, as a shortcut for panels whose own background
  // is transparent. Only re-checked when the element underneath
  // changes, so getComputedStyle isn't called on every mouse move.
  /** A computed background colour as three 0-255 numbers and an alpha,
      or null if there is no colour there.

      IT HAS TO READ `color()` AS WELL AS `rgb()`, and that is not
      fussiness. A background written with `color-mix()` — which is how
      Pineward's ground is mixed — computes to `color(srgb 0.96 0.97
      0.96)`, whose components run 0 to 1 rather than 0 to 255. Pulling
      the numbers out and treating them as 0-255 reads a white page as
      very nearly black, so the cursor went WHITE ON WHITE and could not
      be seen at all. That shipped; this is the fix. */
  function colourOf(computed) {
    const parts = computed && computed.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return null;
    const nums = parts.map(Number);
    const scale = /^color\(/.test(computed.trim()) ? 255 : 1;
    return {
      r: nums[0] * scale, g: nums[1] * scale, b: nums[2] * scale,
      a: nums.length > 3 ? nums[3] : 1,
    };
  }

  /* WHAT A PICTURE IS, UNDER THE POINTER. A background colour is not
     the whole of what can be dark: a photograph paints no background at
     all, so over a dark bottle on the contact sheet, or over Haxan's
     pictures, the walk above went straight through the picture to the
     white page behind it and the cursor stayed black ON black. This
     reads the picture itself — a small patch of it round the point, at
     the picture's own resolution, honouring `object-fit` — and returns
     its lightness, or null if it cannot be read (not loaded yet, or from
     another site, which the browser will not let a page read). */
  const probe = document.createElement("canvas");
  probe.width = probe.height = 5;
  const probeCtx = probe.getContext("2d", { willReadFrequently: true });
  function lightOfImage(img, x, y) {
    if (!img.complete || !img.naturalWidth) return null;
    const box = img.getBoundingClientRect();
    if (!box.width || !box.height) return null;
    const nw = img.naturalWidth, nh = img.naturalHeight;
    const fit = getComputedStyle(img).objectFit;
    let sx = nw / box.width, sy = nh / box.height, ox = 0, oy = 0;
    if (fit === "cover" || fit === "contain") {
      const s = fit === "cover"
        ? Math.min(nw / box.width, nh / box.height)
        : Math.max(nw / box.width, nh / box.height);
      sx = sy = s;
      ox = (nw - box.width * s) / 2;
      oy = (nh - box.height * s) / 2;
    }
    const px = ox + (x - box.left) * sx, py = oy + (y - box.top) * sy;
    if (px < 0 || py < 0 || px >= nw || py >= nh) return null;
    const half = Math.max(2, 3 * sx);
    try {
      probeCtx.clearRect(0, 0, 5, 5);
      probeCtx.drawImage(img, px - half, py - half, half * 2, half * 2, 0, 0, 5, 5);
      const d = probeCtx.getImageData(0, 0, 5, 5).data;
      let sum = 0, weight = 0;
      for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3] / 255;
        sum += (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) * a;
        weight += a;
      }
      // A transparent patch (a logo on nothing) says nothing about the
      // colour; let whatever is behind it answer instead.
      if (weight < 12) return null;
      return sum / weight;
    } catch (err) {
      return null;
    }
  }

  // Everything under the point, from the top down — rather than the
  // top element and its parents — so a picture that stands BEHIND a
  // transparent link or caption is still found and read.
  function isDarkAt(x, y) {
    const stack = document.elementsFromPoint(x, y);
    for (const node of stack) {
      if (node === ring || node === dot) continue;
      if (node.classList && node.classList.contains("dark-surface")) return true;
      if (node.tagName === "IMG") {
        const light = lightOfImage(node, x, y);
        if (light !== null) return light < 115;
      }
      const found = colourOf(getComputedStyle(node).backgroundColor);
      if (found && found.a > 0.5) {
        return 0.2126 * found.r + 0.7152 * found.g + 0.0722 * found.b < 115;
      }
    }
    return false;
  }

  // Re-read when what is underneath changes, or when the pointer has
  // moved far enough to be over a different part of a picture, whose
  // colour changes from one point to the next.
  let readAt = { x: -99, y: -99 };
  function reread(force) {
    const under = document.elementFromPoint(tx, ty);
    const moved = Math.abs(tx - readAt.x) + Math.abs(ty - readAt.y);
    if (!force && under === lastUnder && moved <= 6) return;
    lastUnder = under;
    readAt = { x: tx, y: ty };
    const onDark = isDarkAt(tx, ty);
    ring.classList.toggle("on-dark", onDark);
    dot.classList.toggle("on-dark", onDark);
  }

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    tx = e.clientX;
    ty = e.clientY;
    if (!awake) {
      awake = true;
      rx = tx; ry = ty;
      document.documentElement.classList.add("cursor-awake");
    }
    dot.style.transform = "translate(" + tx + "px," + ty + "px) translate(-50%,-50%)";
    // pointer-events:none on the ring/dot means elementFromPoint sees
    // straight through them to whatever's actually underneath.
    reread(false);
  }, { passive: true });

  // A page that moves under a still pointer — scrolling, a picture
  // arriving, a drawing opening over the page — changes what is under
  // it without a pointermove, so it is read again every so often too.
  setInterval(() => { if (awake) reread(true); }, 400);

  document.addEventListener("mouseleave", () => document.documentElement.classList.remove("cursor-awake"));
  document.addEventListener("mouseenter", () => { if (awake) document.documentElement.classList.add("cursor-awake"); });

  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest && e.target.closest("a, button, [role='button'], input, textarea, select");
    ring.classList.toggle("near", !!target);
    dot.classList.toggle("near", !!target);
  });

  // Held rather than reset to 0 below the speed threshold: the ring is
  // still visibly stretched at that point (pull isn't quite zero yet),
  // so snapping the angle back to 0 there showed as a little flick
  // right as the cursor settled. Holding the last real direction lets
  // the stretch relax away to nothing before its angle stops mattering.
  let ringAngle = 0;

  function follow() {
    requestAnimationFrame(follow);
    const dx = tx - rx;
    const dy = ty - ry;
    rx += dx * LAG;
    ry += dy * LAG;

    // Pulled along its own direction of travel, by however far it is
    // currently behind.
    const speed = Math.min(60, Math.hypot(dx, dy));
    if (speed > 1) ringAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const pull = speed * STRETCH;
    ring.style.transform =
      "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px) translate(-50%,-50%)" +
      " rotate(" + ringAngle.toFixed(1) + "deg) scale(" + (1 + pull * 0.16).toFixed(3) + "," + (1 - pull * 0.1).toFixed(3) + ")";
  }
  requestAnimationFrame(follow);
})();

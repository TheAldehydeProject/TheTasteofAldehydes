// ============================================================
// Behaviour for index.html: THE STAGE, scrolled smoothly through its
// five stages — and, when they are switched on, the two slides that
// used to follow it (the sentence and the node map).
//
// THE STAGE (2026-09-30, the owner: "make it a smooth scrolling instead
// of incremental; I want you to make sure that there are 5 increments ...
// gradual (not sudden like now)"). The title, the formula and the
// aldehyde behind them stand pinned to the window (style.css) while the
// page is scrolled down the stage's run, and how far down it is, is how far
// through the five stages the page is:
//
//   1  the aldehyde as it is first seen, the title in front of it
//   2  the same, the title gone
//   3  the aldehyde turned upright
//   4  the same, its formula drawn in it
//   5  the Menu's eight pages, beside two lines of specks
//
// The page scrolls as any page does — the wheel, a trackpad, a finger, the
// scrollbar — and nothing here holds it; the keys and the Scroll button go
// on (or back) a whole stage, smoothly. Where it is, is followed a little
// behind (FOLLOW_S), so a notch of a wheel is a glide rather than a step,
// and told to the drawing as one number, the sixth window global:
//
//   window.__formula   0 to 4, the stage (0 the first, 4 the fifth), and
//                      how far between two it is
//
// The title fades as the page leaves the first stage, and the eight names
// come up with the last (`--names` on the stage, 0 to 1). A name pressed
// asks first (THE WAY OUT, below).
//
// PAGES 3 AND 4 — the sentence and the node map — are SWITCHED OFF
// (2026-09-30: "PRESERVE PAGES 3 AND 4 IN THE CODE, BUT EXCLUDE THEM FROM
// THE WORKING VERSION ... I WANT THIS CHANGE TO BE REVERSIBLE"). They are
// kept whole in index.html's <template id="map-slides">, with the four
// scripts that draw them; MAP_SLIDES below brings them back, after the
// stage, as they were — and ?map=on on the address shows them without
// changing anything. Everything from THE MAP SLIDES down is theirs.
//
// Everything here is wrapped in a function that runs itself, so
// none of these names (slides, container, goTo, ease...) escape
// into the page's shared namespace where another script could
// collide with them — every other file on this site does the
// same. Two scripts declaring the same top-level name is not a
// quiet problem: the browser refuses to run the second one at
// all, and whatever it was responsible for silently disappears.
// ============================================================
(function () {
  const container = document.getElementById("scroll-container");
  const stage = document.getElementById("aldehyde-stage");
  if (!container || !stage) return; // not the landing page

  // THE SWITCH. false: the stage alone, as the owner asked. true: the
  // sentence and the node map after it again, as they were.
  const MAP_SLIDES = false;
  const mapOn = MAP_SLIDES || /[?&]map=on\b/.test(location.search);

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (mapOn) {
    // The kept slides after the stage, the paper under them where it stood
    // (before the page), and the four scripts that draw them, in the order
    // they always ran (after this one, whose frame loop has to run first).
    const kept = document.getElementById("map-slides");
    if (kept) {
      const parts = kept.content.cloneNode(true);
      const paper = parts.querySelector(".paper");
      if (paper) container.parentNode.insertBefore(paper, container);
      container.appendChild(parts);
    }
    document.body.classList.add("map-on");
    ["node-scene.js", "paper.js", "thread.js", "extras.js"].forEach((src) => {
      const script = document.createElement("script");
      script.src = (window.SITE_ROOT || "") + src;
      script.async = false;
      document.body.appendChild(script);
    });
  } else {
    document.body.classList.add("stage-only");
  }

  const run = stage.querySelector(".stage-run");
  const intro = document.getElementById("slide-2");
  const map = document.getElementById("slide-3");

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  // THE LONG MOVE, between the sentence and the map, eases on a sine
  // rather than a cube (2026-09-26, the owner's "make the home page
  // smoother when going from 2 to 3 and vice versa"). Over 2.4 seconds
  // the cube all but stood still for the first third of a second — a
  // key pressed and nothing seeming to happen — and then had to make up
  // for it; the sine sets off at once and gathers and settles evenly,
  // so the curtain, the grid and the map, all of which are keyed to how
  // far down the page is, come in as evenly as it moves.
  function easeLong(t) { return (1 - Math.cos(Math.PI * t)) / 2; }
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const smooth = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };

  // True while the menu, a node's preview window, About me or the way out
  // is open over the top of the page. The keys belong to whatever is in
  // front at that point — scrolling the page around behind it just looks
  // broken.
  function overlayOpen() {
    return document.body.classList.contains("menu-open") ||
           document.body.classList.contains("preview-open") ||
           document.body.classList.contains("about-shown") ||   // About me (title.js)
           document.body.classList.contains("ask-shown");       // the way out (below)
  }

  // THE PAGE IS MOVED FIRST ON EVERY FRAME. Everything else on this
  // page draws from where the page is — the aldehyde (through __formula)
  // and, with the map slides on, the paper's curtain and grid, the map's
  // arrival (through __p23), the thread — each in a frame loop of its own.
  // So this file keeps ONE loop, started now — before any of theirs, since
  // it is loaded before them — which runs every step of every move at the
  // head of the frame. With nothing moving it does nothing.
  const phases = new Set();
  function tick(now) {
    requestAnimationFrame(tick);
    phases.forEach((phase) => phase(now));
  }
  requestAnimationFrame(tick);

  function runPhase(duration, onProgress, onDone) {
    let started = -1;
    const phase = (now) => {
      if (started < 0) started = now;
      const t = Math.min(1, (now - started) / duration);
      onProgress(t);
      if (t >= 1) {
        phases.delete(phase);
        // The next phase, if this one hands over to one, starts on this
        // same frame rather than a frame late.
        onDone();
      }
    };
    phases.add(phase);
  }

  // ============================================================
  // THE STAGE
  // ============================================================
  const STAGES = 5;
  const LAST = STAGES - 1;
  const FOLLOW_S = 0.16;       // how far behind the page the stage follows, in seconds (a time constant)
  // The title (with its line and its square) fades over the first leg,
  // lifting a little as it goes; the corner block and the Scroll button a
  // little sooner. The names come up over the last leg, once its lines are
  // on their way down (molecule.js).
  const TITLE_GONE = 0.8, CORNERS_GONE = 0.5, TITLE_LIFT = 26;
  const NAMES_FROM = 3.3, NAMES_OVER = 0.62;

  const leg = () => Math.max(1, (run ? run.offsetHeight : window.innerHeight * 3.2) / LAST);
  const stageTop = () => stage.offsetTop;
  const stageEnd = () => stageTop() + LAST * leg();   // the page at the fifth stage
  // Where the page is, in stages.
  const reading = () => Math.max(0, Math.min(LAST, (container.scrollTop - stageTop()) / leg()));

  let shown = reading(), followOn = false, followLast = 0;
  window.__formula = shown;
  const title = document.querySelector(".title-content");
  const corners = [document.querySelector(".title-block"), document.querySelector(".scroll-cue")];
  let wrote = "";

  // The page as the stage says: the title fading, the names coming up.
  function place() {
    window.__formula = shown;
    const titleShown = 1 - smooth(shown / TITLE_GONE);
    const cornersShown = 1 - smooth(shown / CORNERS_GONE);
    const names = smooth((shown - NAMES_FROM) / NAMES_OVER);
    // which stage it is at, 1 to 5, for anything that wants to know
    const at = String(Math.min(STAGES, Math.floor(shown + 0.5) + 1));
    if (stage.dataset.stage !== at) stage.dataset.stage = at;
    const key = titleShown.toFixed(3) + "|" + cornersShown.toFixed(3) + "|" + names.toFixed(3);
    if (key === wrote) return;
    wrote = key;
    if (title) {
      title.style.opacity = titleShown.toFixed(3);
      title.style.transform = "translateY(" + (-(1 - titleShown) * TITLE_LIFT).toFixed(1) + "px)";
      // nothing invisible should still take a click (the square, About me)
      title.style.pointerEvents = titleShown < 0.02 ? "none" : "";
    }
    corners.forEach((el) => {
      if (!el) return;
      el.style.opacity = cornersShown.toFixed(3);
      el.style.pointerEvents = cornersShown < 0.02 ? "none" : "";
    });
    stage.style.setProperty("--names", names.toFixed(3));
    stage.classList.toggle("names-here", names > 0.6);
  }

  function follow(now) {
    const dt = followLast ? Math.min(0.1, (now - followLast) / 1000) : 1 / 60;
    followLast = now;
    const to = reading();
    shown = REDUCE_MOTION ? to : shown + (to - shown) * (1 - Math.exp(-dt / FOLLOW_S));
    if (Math.abs(to - shown) < 0.0004) shown = to;
    place();
    if (shown === to) { phases.delete(follow); followOn = false; followLast = 0; }
  }
  function moved() {
    if (REDUCE_MOTION) { shown = reading(); place(); return; }
    if (!followOn) { followOn = true; followLast = 0; phases.add(follow); }
  }
  container.addEventListener("scroll", moved, { passive: true });
  window.addEventListener("resize", moved);

  // The corner block arrives with a "rise" keyframe animation whose fill is
  // "both", which keeps hold of opacity for the life of the element — and
  // an animation outranks the plain styles set above, so until it is
  // cleared nothing here has any effect on it. Handing over once it has
  // finished playing keeps the entrance and lets the stage take it from
  // there (it comes up last, at 1.9s, once the title has gathered).
  corners.forEach((el) => {
    if (!el) return;
    const takeOver = () => { el.style.animation = "none"; wrote = ""; place(); };
    el.addEventListener("animationend", takeOver, { once: true });
    setTimeout(takeOver, 3000);
  });
  place();

  // A stage on, or back, smoothly: the keys and the Scroll button.
  function toStage(k) {
    k = Math.max(0, Math.min(LAST, k));
    container.scrollTo({ top: Math.round(stageTop() + k * leg()), behavior: REDUCE_MOTION ? "auto" : "smooth" });
  }
  function stepStage(dir) {
    const at = reading();
    toStage(dir > 0 ? Math.floor(at + 0.05) + 1 : Math.ceil(at - 0.05) - 1);
  }

  // ============================================================
  // THE WAY OUT, ASKED FIRST (2026-09-30: "when you click it, I want a
  // confirmation message to pop up to go to that thing. it should be on
  // theme"). A name on the formula pressed brings up a dark sheet with the
  // page's name, Stay and Go, over the page veiled; Escape, Stay or the
  // veil put it away. Pressed with a key held (a new tab, a new window) a
  // name goes where it goes without asking, since nothing is being left.
  // A name tabbed to before the names are up takes the page to them.
  // ============================================================
  const ask = document.getElementById("formula-ask");
  if (ask) {
    const askName = ask.querySelector(".formula-ask-name");
    const askStay = ask.querySelector(".formula-ask-stay");
    const askGo = ask.querySelector(".formula-ask-go");
    let askFrom = null, askTimer = 0, asking = false;
    const openAsk = (a) => {
      askName.textContent = a.textContent.trim();
      askGo.setAttribute("href", a.getAttribute("href"));
      askFrom = a;
      asking = true;
      window.clearTimeout(askTimer);
      ask.hidden = false;
      void ask.offsetWidth;
      ask.classList.add("is-on");
      document.body.classList.add("ask-shown");
      a.classList.add("is-lit");
      window.setTimeout(() => { if (asking) askGo.focus({ preventScroll: true }); }, REDUCE_MOTION ? 0 : 60);
    };
    const stay = () => {
      if (!asking) return;
      asking = false;
      ask.classList.remove("is-on");
      document.body.classList.remove("ask-shown");
      askTimer = window.setTimeout(() => { if (!asking) ask.hidden = true; }, REDUCE_MOTION ? 0 : 420);
      if (askFrom) {
        askFrom.classList.remove("is-lit");
        if (askFrom.isConnected) askFrom.focus({ preventScroll: true });
      }
      askFrom = null;
    };
    askStay.addEventListener("click", stay);
    ask.addEventListener("click", (e) => { if (e.target === ask) stay(); });
    // (on the whole page while it asks: the keys may not be in it yet, in
    // the moment before Go takes them)
    window.addEventListener("keydown", (e) => {
      if (!asking) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); stay(); }
      else if (e.key === "Tab") {
        // the keys stay in it while it asks
        const f = [askStay, askGo];
        const at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
      }
    });
    stage.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest(".formula-link");
      if (!a || !stage.contains(a)) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      openAsk(a);
    });
    stage.querySelectorAll(".formula-link").forEach((a) => {
      a.addEventListener("focus", () => {
        if (a.matches(":focus-visible") && reading() < LAST - 0.05) toStage(LAST);
      });
    });
  }

  // THE STAGE IS DARK. The Menu stands fixed over whatever is under it, so
  // while the stage is still under it the body says so (`first-slide-dark`),
  // and the stylesheet turns the Menu light — which, with the map slides
  // off, is always.
  const MENU_FOOT = 48;   // the Menu's own foot, from the top of the window
  const underMenu = () =>
    document.body.classList.toggle("first-slide-dark",
      container.scrollTop < stage.offsetTop + stage.offsetHeight - MENU_FOOT);
  container.addEventListener("scroll", underMenu, { passive: true });
  window.addEventListener("resize", underMenu);
  underMenu();

  // ============================================================
  // THE MAP SLIDES (switched off; everything below is theirs)
  //
  // With them on, the page has three places to stand, and moves between
  // them as it always did — the stage (at its fifth stage), the sentence,
  // and the map: gently, a whole slide at a time, by the wheel, the keys
  // or a finger; the move onto the map long; and going back up off the
  // map, the map falling into its own centre first. Within the stage, the
  // page scrolls as above.
  // ============================================================
  if (!mapOn || !intro || !map) {
    // --- the keys: a stage at a time, and the Scroll button the same
    window.addEventListener("keydown", (e) => {
      if (overlayOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      // (Space presses a button or a link it is on, as it always does)
      if (e.key === " " && e.target && e.target.closest && e.target.closest("button, a, summary")) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) { e.preventDefault(); stepStage(1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) { e.preventDefault(); stepStage(-1); }
      else if (e.key === "Home") { e.preventDefault(); toStage(0); }
      else if (e.key === "End") { e.preventDefault(); toStage(LAST); }
    });
    const cue = document.getElementById("scroll-cue");
    if (cue) cue.addEventListener("click", () => stepStage(1));
    return;
  }

  const MAP = 2;
  const places = () => [stageEnd(), intro.offsetTop, map.offsetTop];
  let activeIndex = 0;
  let animating = false;

  // Which of the three the page is at, read off where it is.
  function whereIs() {
    const y = container.scrollTop, [a, b, c] = places();
    return y < (a + b) / 2 ? 0 : y < (b + c) / 2 ? 1 : 2;
  }

  // ============================================================
  // LEAVING THE MAP
  //
  // Going back up from the node map is not a plain scroll. The page is
  // held still while the map falls into its own centre, then while a
  // line draws itself from that centre up to the top of the screen, and
  // only then does it move. Two numbers on window carry the state, so
  // the four files that have to take part can each read it without
  // knowing about the others:
  //
  //   window.__exit    0 to 1, the collapse    (node-scene.js, paper.js,
  //                                             extras.js, thread.js)
  //   window.__reform  0 to 1, the line        (thread.js)
  //
  // Both sit at 0 the rest of the time, so nothing else in the site has
  // to care that any of this exists.
  // ============================================================
  const EXIT_MS = 820;     // how long the map takes to fall inwards
  const REFORM_MS = 520;   // and the line to draw itself back out

  /** The plain scroll, used on its own and as the last step of the exit. */
  function scrollToPlace(index, onDone) {
    const startY = container.scrollTop;
    const endY = places()[index];
    const distance = endY - startY;

    if (distance === 0) {
      activeIndex = index;
      onDone();
      return;
    }

    // IMPORTANT: CSS scroll-snap fights with a hand-animated scrollTop —
    // the browser tries to immediately snap back while we're mid-animation,
    // which is what made this look broken/not-smooth before. Turning snap
    // off for the duration of the animation, then back on once we land
    // on one of the slides, fixes that. (On the stage there is none.)
    container.style.scrollSnapType = "none";

    // The move onto the node map slide is much longer than the others:
    // the curtain, the grid, the static and the constellation leaving
    // the centre all happen during it, and rushing them turns a sequence
    // into a flicker. This is the number to change if it drags.
    const long = index === MAP || activeIndex === MAP;
    const duration = long ? 2400 : 1100;
    const curve = long ? easeLong : ease;

    runPhase(
      duration,
      (t) => { container.scrollTop = startY + distance * curve(t); },
      () => {
        activeIndex = index;
        container.style.scrollSnapType = index === 0 ? "none" : "y mandatory";
        onDone();
      }
    );
  }

  function goTo(index) {
    index = Math.max(0, Math.min(MAP, index));
    const endY = places()[index];

    if (REDUCE_MOTION) {
      container.scrollTop = endY;
      activeIndex = index;
      container.style.scrollSnapType = index === 0 ? "none" : "y mandatory";
      return;
    }
    if (container.scrollTop === endY) return;

    animating = true;

    // Leaving the map upwards: collapse, reform, and only then scroll.
    if (activeIndex === MAP && index < MAP) {
      runPhase(EXIT_MS, (t) => { window.__exit = t; }, () => {
        runPhase(REFORM_MS, (t) => { window.__reform = t; }, () => {
          scrollToPlace(index, () => {
            // Released only once the page has arrived, so nothing springs
            // back into place while any of it is still on screen.
            window.__exit = 0;
            window.__reform = 0;
            animating = false;
          });
        });
      });
      return;
    }

    scrollToPlace(index, () => { animating = false; });
  }

  // Keep activeIndex correct if the page is moved by some other means
  // (the scrollbar, a finger); on the stage, no snapping, and a wheel's
  // run carried past the stage's end is held at it, so the page goes on
  // from there only by a turn of its own.
  let wheelAt = 0, endSince = 0;
  container.addEventListener("scroll", () => {
    if (animating) return;
    const y = container.scrollTop, end = stageEnd();
    if (activeIndex === 0 && y > end + 1 && performance.now() - wheelAt < 260) {
      container.scrollTop = end;
      return;
    }
    activeIndex = whereIs();
    // no snapping on the stage (it is turned on only on arriving at a
    // slide after it, as it always was: a page held part of the way between
    // the sentence and the map stays where it is held)
    if (activeIndex === 0) container.style.scrollSnapType = "none";
    if (activeIndex === 0 && y >= end - 1) { if (!endSince) endSince = performance.now(); } else endSince = 0;
  }, { passive: true });

  // --- Wheel / trackpad: within the stage the page scrolls itself; past it,
  // one gentle gesture moves exactly one slide.
  let wheelLock = false;
  const LEAVE_AFTER_MS = 450;  // how long at the stage's end before a turn goes on to the sentence
  container.addEventListener(
    "wheel",
    (e) => {
      if (overlayOpen()) { e.preventDefault(); return; }
      if (animating) { e.preventDefault(); return; }
      const y = container.scrollTop, end = stageEnd();
      if (activeIndex === 0 && (e.deltaY < 0 || y < end - 1)) { wheelAt = performance.now(); return; }
      e.preventDefault();
      if (activeIndex === 0 && (!endSince || performance.now() - endSince < LEAVE_AFTER_MS)) {
        if (!endSince) endSince = performance.now();
        return;
      }
      if (wheelLock) return;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 1000);
      if (e.deltaY > 0) goTo(activeIndex + 1);
      else if (e.deltaY < 0) goTo(activeIndex - 1);
    },
    { passive: false }
  );

  // A step by the keys or the Scroll button: a stage at a time on the
  // stage, and on from its end to the sentence; a slide at a time after it.
  function step(dir) {
    if (animating) return;
    if (activeIndex === 0 && (dir < 0 || reading() < LAST - 0.02)) { stepStage(dir); return; }
    goTo(activeIndex + dir);
  }

  // --- Keyboard
  window.addEventListener("keydown", (e) => {
    if (overlayOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
  });

  // --- "Scroll" button on the title
  const scrollCue = document.getElementById("scroll-cue");
  if (scrollCue) scrollCue.addEventListener("click", () => step(1));
})();

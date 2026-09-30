// ============================================================
// Behavior for index.html's four locked slides: gentle
// scrolling between them (by wheel, keys, or the "Scroll"
// button on the title slide). They are the title, the formula
// (2026-09-30), the sentence and the map, and the ones that matter
// here are found by name rather than by place, so a slide added in
// between moves nothing: the map is #slide-3 wherever it stands.
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
  const slides = Array.from(document.querySelectorAll(".slide"));
  const container = document.getElementById("scroll-container");
  if (!container || !slides.length) return; // not the landing page
  // The map, which the long move and the way out of it belong to; and the
  // formula slide, which with the title is THE STAGE (below).
  const MAP = Math.max(0, slides.indexOf(document.getElementById("slide-3")));
  const FORMULA = slides.indexOf(document.getElementById("slide-formula"));

  let activeIndex = 0;
  let animating = false;

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // True while the menu or a node's preview window is open over the top
  // of the slides. The arrow keys belong to whatever is in front at that
  // point — scrolling the page around behind it just looks broken.
  function overlayOpen() {
    return document.body.classList.contains("menu-open") ||
           document.body.classList.contains("preview-open") ||
           document.body.classList.contains("about-shown");   // About me (title.js)
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

  // THE PAGE IS MOVED FIRST ON EVERY FRAME. Everything else on this
  // page draws from where the page is — the paper's curtain and grid,
  // the map's arrival (through __p23), the thread — each in a frame loop
  // of its own. This one used to start a fresh request for every step
  // of a move, which put it LAST in each frame: every drawing read where
  // the page had been a frame before (the map two, since it reads what
  // the paper wrote), so at full speed they trailed the page by ten
  // pixels or so and caught up in lurches whenever a frame ran long.
  // So this file keeps ONE loop, started now — before node-scene.js,
  // paper.js, thread.js and extras.js start theirs, since it is loaded
  // before them — which runs every step of every move at the head of
  // the frame. With nothing moving it does nothing.
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

  /** The plain scroll, used on its own and as the last step of the exit. */
  function scrollToSlide(index, onDone) {
    const startY = container.scrollTop;
    const endY = slides[index].offsetTop;
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
    // exactly on the target slide, fixes that.
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
        container.style.scrollSnapType = "y mandatory";
        onDone();
      }
    );
  }

  function goTo(index) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    const endY = slides[index].offsetTop;

    if (REDUCE_MOTION) {
      container.scrollTop = endY;
      activeIndex = index;
      return;
    }
    if (container.scrollTop === endY) return;

    animating = true;

    // Leaving the map upwards: collapse, reform, and only then scroll.
    if (activeIndex === MAP && index < MAP) {
      runPhase(EXIT_MS, (t) => { window.__exit = t; }, () => {
        runPhase(REFORM_MS, (t) => { window.__reform = t; }, () => {
          scrollToSlide(index, () => {
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

    scrollToSlide(index, () => {
      animating = false;
      // back up on to the formula from below: whatever of it is not there
      // yet comes (it is all there if it was when the page left it)
      if (index === FORMULA) stageTo(2);
    });
  }

  // ============================================================
  // THE STAGE — the title and the formula, run by the wheel
  // (2026-09-30: "make the whole second page reactive to the scroll
  // wheel", and asked, "the wheel drives it")
  //
  // One number, `q`, is where the stage is: 0 the title, 1 the page arrived
  // at the formula slide (between the two, the page part of the way down,
  // the title fading as it goes), and from 1 to 2 the formula's own
  // sequence while the page is held there — the aldehyde turning into its
  // formula, the clouds gathering round the names, the names coming up.
  // The wheel moves where it is going (`qTo`) by as much as it is turned,
  // and `q` follows on a spring, never faster than its leg allows, so a
  // notch and a flick both move it smoothly; turned back, it all goes
  // back. The sequence is told to molecule.js as one number, a sixth
  // window global:
  //
  //   window.__formula  0 to 1, how far the formula's sequence is
  //
  // Keys and the Scroll button play it through (down from the title to
  // the end, up from the formula to the title); a turn of the wheel once
  // it is complete goes on to the sentence. A finger, a scrollbar or a
  // jump moves the page itself, and the stage follows: arriving at the
  // formula slide that way plays the sequence through.
  // ============================================================
  const WHEEL_LEG1 = 0.8;      // of the window's height, the wheel's turn from the title to the formula slide
  const WHEEL_LEG2 = 1500;     // px of the wheel's turn through the formula's sequence
  const RATE_LEG1 = 1 / 0.95;  // q per second at most: the page's move
  const RATE_LEG2 = 1 / 4.2;   // the sequence, played through
  const RATE_BACK = 1 / 1.4;   // and back
  const SPRING = 90;           // how tightly q follows where it is going
  const SETTLE_MS = 320;       // a wheel stopped between the two slides settles on the nearer
  const LEAVE_AFTER_MS = 450;  // how long complete before a further turn leaves for the sentence
  let q = 0, qTo = 0, qv = 0, placed = 0, stageLast = 0, stageOn = false, written = -1, settleTimer = 0, fullSince = 0;
  window.__formula = 0;
  const onStage = () => FORMULA >= 0 && (activeIndex === 0 || activeIndex === FORMULA);
  function stageTop(x) {
    const a = slides[0].offsetTop, b = slides[FORMULA].offsetTop;
    return a + Math.max(0, Math.min(1, x)) * (b - a);
  }
  function placeStage() {
    // the page is moved only between the two slides (and on to the formula
    // slide exactly): past it, it is somebody else's to move
    if (q < 1 || placed < 1) {
      const y = Math.round(stageTop(q));
      if (Math.abs(container.scrollTop - y) >= 1) { container.scrollTop = y; written = container.scrollTop; }
    }
    // which slide it is on, while it is the stage that moves the page (once
    // the page has gone on past the formula, the sequence may still be
    // finishing, and the page is not on the stage any more)
    if (q < 1 || placed < 1) activeIndex = q >= 0.5 ? FORMULA : 0;
    placed = q;
    window.__formula = Math.max(0, Math.min(1, q - 1));
    if (q >= 2 - 1e-4) { if (!fullSince) fullSince = performance.now(); } else fullSince = 0;
  }
  function stagePhase(now) {
    const dt = stageLast ? Math.min(0.1, (now - stageLast) / 1000) : 1 / 60;
    stageLast = now;
    const rate = q < 1 || (q === 1 && qTo < 1) ? RATE_LEG1 : qTo > q ? RATE_LEG2 : RATE_BACK;
    qv += (SPRING * (qTo - q) - 2 * Math.sqrt(SPRING) * qv) * dt;
    qv = Math.max(-rate, Math.min(rate, qv));
    q += qv * dt;
    if ((qTo - q) * Math.sign(qv) < 0 || Math.abs(qTo - q) < 0.0008) { q = qTo; qv = 0; }
    placeStage();
    if (q === qTo) {
      phases.delete(stagePhase);
      stageOn = false;
      stageLast = 0;
      if (q <= 0 || q >= 1) container.style.scrollSnapType = "y mandatory";
    }
  }
  function stageTo(x) {
    if (FORMULA < 0) return;
    qTo = Math.max(0, Math.min(2, x));
    if (REDUCE_MOTION) { q = qTo; qv = 0; placeStage(); container.style.scrollSnapType = "y mandatory"; return; }
    if (q === qTo) return;
    container.style.scrollSnapType = "none";
    if (!stageOn) { stageOn = true; stageLast = 0; phases.add(stagePhase); }
  }
  function stageWheel(delta) {
    window.clearTimeout(settleTimer);
    const h = Math.max(1, slides[FORMULA].offsetTop - slides[0].offsetTop);
    // the wheel's turn in the stage's own measure, leg by leg
    let d = delta, x = qTo;
    for (let legs = 0; legs < 2 && d !== 0; legs++) {
      const per = x < 1 || (x === 1 && d < 0) ? h * WHEEL_LEG1 : WHEEL_LEG2;
      const end = d > 0 ? (x < 1 ? 1 : 2) : (x > 1 ? 1 : 0);   // the end of this leg, the way it is turned
      const room = Math.abs(end - x), want = Math.abs(d) / per;
      if (want < room) { x += Math.sign(d) * want; break; }
      x = end;
      d -= Math.sign(d) * room * per;
      if (end === 0 || end === 2) break;
    }
    stageTo(x);
    // stopped part of the way between the two slides: settle on the nearer
    settleTimer = window.setTimeout(() => {
      if (qTo > 0 && qTo < 1) stageTo(qTo < 0.5 ? 0 : 1);
    }, SETTLE_MS);
  }
  // The page moved by something else — a finger, the scrollbar, a jump —
  // and the stage follows where it is.
  container.addEventListener("scroll", () => {
    if (FORMULA < 0 || animating || Math.abs(container.scrollTop - written) <= 1) return;
    const y = container.scrollTop, a = slides[0].offsetTop, b = slides[FORMULA].offsetTop;
    if (y < b - 1) {
      q = qTo = placed = Math.max(0, (y - a) / Math.max(1, b - a)); qv = 0;
      window.__formula = 0;
    } else if (y <= b + 1 && q < 1) {
      // arrived at the formula slide under a finger: play it through
      q = placed = 1; qv = 0; written = y;
      stageTo(2);
    } else if (y > b + 1 && q < 2) {
      q = qTo = placed = 2; qv = 0; window.__formula = 1;   // gone on past it: it is all there when the page comes back
    }
  }, { passive: true });

  // Keep activeIndex correct if the user scrolls by some other means
  // (scrollbar drag, touch) rather than through goTo().
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animating) {
          activeIndex = slides.indexOf(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  slides.forEach((slide) => observer.observe(slide));

  // --- Wheel / trackpad: on the stage it runs the stage (above); anywhere
  // else one gentle gesture moves exactly one slide.
  let wheelLock = false;
  container.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (overlayOpen()) return;
      if (!animating && !wheelLock && onStage()) {
        const px = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
        const d = Math.max(-240, Math.min(240, px));
        // complete, a further turn down goes on to the sentence
        if (d > 0 && qTo >= 2 && q >= 2 - 1e-4 && performance.now() - fullSince > LEAVE_AFTER_MS) {
          wheelLock = true;
          setTimeout(() => { wheelLock = false; }, 1000);
          goTo(FORMULA + 1);
          return;
        }
        if (d !== 0) stageWheel(d);
        return;
      }
      if (wheelLock || animating) return;
      wheelLock = true;
      setTimeout(() => { wheelLock = false; }, 1000);
      if (e.deltaY > 0) goTo(activeIndex + 1);
      else if (e.deltaY < 0) goTo(activeIndex - 1);
    },
    { passive: false }
  );

  // A step by the keys or the Scroll button: through the whole stage at
  // once (down from the title to the end of the formula; up from the
  // formula to the title), and on from the formula to the sentence.
  function step(dir) {
    if (!animating && onStage()) {
      if (dir > 0 && activeIndex === 0) { stageTo(2); return; }
      if (dir < 0) { stageTo(0); return; }
      // still on its way to the formula slide: arrive first
      if (q < 1) { stageTo(2); return; }
      stageTo(2);   // on to the sentence, finishing on the way
    }
    goTo(activeIndex + dir);
  }

  // --- Keyboard
  window.addEventListener("keydown", (e) => {
    if (overlayOpen()) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); step(-1); }
  });

  // --- "Scroll" button on the title slide
  const scrollCue = document.getElementById("scroll-cue");
  if (scrollCue) scrollCue.addEventListener("click", () => step(1));

  // ============================================================
  // THE CORNERS OF THE TITLE SLIDE
  //
  //   the title block ("A portfolio / 2026 edition"), bottom right
  //   the "Scroll" button, bottom left
  //
  // Each fades out on its own as you leave the first slide and back in
  // as you return, tied to how far down the page actually is rather
  // than to any animation — so it tracks a slow drag or a flicked
  // wheel equally, and reverses the moment you turn around.
  //
  // Driven from the scroll event rather than a frame loop: they have
  // nothing to say while the page is still, and a listener that only
  // runs when something moved costs nothing the rest of the time.
  // ============================================================
  // THE TITLE ITSELF goes the same way since 2026-09-30, but later and in
  // place: the owner's "to transition to this page from the title page, I
  // want the title and text to fade away". The aldehyde behind it stands
  // still while the page moves, so the title is held where it stands too
  // (`pinned`: moved down by exactly as far as the page has gone up) and
  // only lifts a little as it fades, gone by `by` of the way (0.45). The
  // aldehyde comes together as its formula once it has gone — molecule.js
  // starts that at half way, reading where the page is for itself.
  function fadeOnLeavingSlideOne(element, by = 1 / 3, lift = 18, pinned = false) {
    if (!element) return;

    const update = () => {
      const from = slides[0].offsetTop;
      const to = slides[1].offsetTop;
      const leg = to - from || 1;
      const gone = Math.max(0, container.scrollTop - from);
      const progress = Math.min(1, gone / leg);
      // Gone by a third of the way down, so it leaves early and isn't
      // still hanging about over the second slide.
      const shown = Math.max(0, 1 - progress / by);
      element.style.opacity = shown.toFixed(3);
      // Lifted very slightly as it goes, so it reads as leaving rather
      // than simply dimming in place.
      const y = (pinned ? Math.min(gone, leg) : 0) - Math.min(1, progress / by) * lift;
      element.style.transform = "translateY(" + y.toFixed(1) + "px)";
      // Nothing invisible should still be clickable — the Scroll button
      // is a button, and this is the whole of what stops it catching a
      // click it can no longer be seen to deserve.
      element.style.pointerEvents = shown < 0.02 ? "none" : "";
    };

    // The title block arrives with a "rise" keyframe animation whose
    // fill is "both", which keeps hold of opacity and transform for the
    // life of the element — and an animation outranks the plain styles
    // set above, so until it is cleared nothing here has any effect.
    // Handing over once it has finished playing keeps the entrance and
    // lets the scroll take it from there. (The Scroll button has no
    // such animation and simply works from the start; under reduced
    // motion neither does, so the timer below covers that too.)
    const takeOver = () => {
      element.style.animation = "none";
      update();
    };
    element.addEventListener("animationend", takeOver, { once: true });
    // (After the title has gathered, since 2026-09-29: the block comes up
    // last, at 1.9s, so it is handed over after that.)
    setTimeout(takeOver, 3000);

    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  fadeOnLeavingSlideOne(document.querySelector(".title-block"));
  fadeOnLeavingSlideOne(document.querySelector(".scroll-cue"));
  fadeOnLeavingSlideOne(document.querySelector(".title-content"), 0.45, 26, true);

  // THE FIRST SLIDES ARE DARK (2026-09-30: the aldehyde's own dark ground,
  // the title and the formula after it). The Menu stands fixed over
  // whatever slide is under it, so while a dark one is still under it the
  // body says so (`first-slide-dark`), and the stylesheet turns the Menu
  // light.
  const first = document.getElementById("slide-formula") || document.getElementById("slide-1");
  if (first) {
    const MENU_FOOT = 48;   // the Menu's own foot, from the top of the window
    const underMenu = () =>
      document.body.classList.toggle("first-slide-dark",
        container.scrollTop < first.offsetTop + first.offsetHeight - MENU_FOOT);
    container.addEventListener("scroll", underMenu, { passive: true });
    window.addEventListener("resize", underMenu);
    underMenu();
  }
})();

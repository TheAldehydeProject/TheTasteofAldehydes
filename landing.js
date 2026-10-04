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
//   5  the Menu's eight pages — each the R of an aldehyde, R–CHO (EVERY
//      PAGE AN ALDEHYDE, below) — in the aldehyde's sillage, the aldehydes
//      of perfumery in the gaps (molecule.js)
//
// ONE SCROLL, ALL THE WAY (2026-10-03, later: "make the scrolling automatic
// as in when you scroll once, it will go all the way down, not it will
// scroll by itself after a second or so"): the page stands at the title
// until it is scrolled, and then one scroll — a wheel, a finger, a key, the
// Scroll button — plays it through the five stages to the names, on the
// glide below, resting at each; scrolled up, all the way back (below). It
// played itself once the title had been read, for a day.
//
// The page GLIDES down the stage (THE GLIDE, below): it follows where it is
// going on a spring, so every move is one gradual movement rather than a
// step at a time; with `?auto=off` (and the map slides on) a wheel's notches
// move only where it is going, the keys and the Scroll button a whole stage;
// the scrollbar moves it itself. Where it is, is told to the drawing as one
// number, the sixth window global:
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
  const FOLLOW_S = 0.07;       // how far behind the page the stage follows, in seconds (a time constant)
  // The title (with its line and its square) fades over the whole of the
  // first leg, lifting a little as it goes; the Scroll button a little
  // sooner. The names come up over the last leg, once its lines are on
  // their way down (molecule.js).
  const TITLE_GONE = 1, CORNERS_GONE = 0.7, TITLE_LIFT = 26;
  const NAMES_FROM = 3.25, NAMES_OVER = 0.75, NAMES_PRESSABLE = 0.03;

  // THE LEGS, each as long as `--stage-leg` (style.css) times its number
  // here. The second — the aldehyde turning upright — is the longest
  // (2026-10-01: "prolongue the horizontal to vertical transformation of the
  // aldehyde. thats the only part that looks fast"): the page goes further
  // for it, so a turn of the wheel turns it less. The run is laid to their
  // sum, and says them on the stage (`data-legs`) for anything that wants to
  // know where a stage is (the tests).
  const LEGS = [1, 1.7, 1, 1];
  const LEGS_SUM = LEGS.reduce((a, b) => a + b, 0);
  if (run) run.style.height = "calc(var(--stage-leg) * " + LEGS_SUM + ")";
  stage.dataset.legs = LEGS.join(" ");
  const leg = () => Math.max(1, (run ? run.offsetHeight : window.innerHeight * 3.2) / LEGS_SUM);   // one --stage-leg
  const stageTop = () => stage.offsetTop;
  // How far down the stage a stage is (0 to 4, and part of the way between two)…
  const legsTo = (k) => {
    k = Math.max(0, Math.min(LAST, k));
    let y = 0;
    for (let i = 0; i < LAST && k > i; i++) y += LEGS[i] * Math.min(1, k - i);
    return y * leg();
  };
  // …and which stage a place down it is.
  const stageOf = (y) => {
    let left = y / leg();
    for (let i = 0; i < LAST; i++) {
      if (left <= LEGS[i]) return i + Math.max(0, left) / LEGS[i];
      left -= LEGS[i];
    }
    return LAST;
  };
  const stageEnd = () => stageTop() + legsTo(LAST);   // the page at the fifth stage
  // Where the page is, in stages.
  const reading = () => Math.max(0, Math.min(LAST, stageOf(container.scrollTop - stageTop())));

  // A RELOAD STARTS AT THE TITLE (2026-10-03, the owner's "something flashes
  // when you reset the page"): whatever the browser remembers of where the
  // page was, it opens at the first stage, as it plays itself from there.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  container.scrollTop = 0;
  let shown = reading(), followOn = false, followLast = 0;
  window.__formula = shown;
  const title = document.querySelector(".title-content");
  const corners = [document.querySelector(".scroll-cue")];
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
    // A name takes the hand as soon as it is there at all, however faint —
    // quiet at rest, or still coming up (2026-10-01: "make the text
    // clickable even when it isnt fully apparent"; it waited until the names
    // were over half way up).
    stage.classList.toggle("names-here", names > NAMES_PRESSABLE);
    // (held back by the page's head until now: index.html, `stage-coming`)
    document.documentElement.classList.remove("stage-coming");
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

  // (Anything here arriving with a "rise" animation of its own — whose fill
  // is "both", which keeps hold of opacity for the life of the element, and
  // outranks the plain styles set above — is handed over once it has
  // played, or at 3s. The corner block, "A portfolio, 2026 edition", which
  // came up that way, was taken off at the owner's word, 2026-09-30.)
  corners.forEach((el) => {
    if (!el) return;
    const takeOver = () => { el.style.animation = "none"; wrote = ""; place(); };
    el.addEventListener("animationend", takeOver, { once: true });
    setTimeout(takeOver, 3000);
  });
  place();

  // ============================================================
  // EVERY PAGE AN ALDEHYDE (2026-10-03, last — the owner: "rework the words
  // and the particles surrounding the main aldehyde molecule ... fill in the
  // gaps and make it all thematic"). Each of the eight names on the last
  // stage is the R of an aldehyde, R–CHO, as the Menu's own aldehyde is drawn
  // (nav.js): after its last letter, towards the formula, a short zig-zag of
  // bonds — `data-chain` on the name, how many before the aldehyde's carbon,
  // 1 to 3, so no two sides match — and the C=O, its double bond in the
  // aldehyde's gold and its O in a haze of the lone pair's violet, as a
  // chemistry book draws a chain: the carbons the corners, only the O named.
  // Quiet with its name, and lit with it (style.css, `.formula-tail`). Drawn
  // in shapes alone, so the name's own words are all the link says. Not on a
  // narrow window, where the names stand two by two across a narrow channel.
  // ============================================================
  const TAIL_BOND = 104, TAIL_PAIR = 8, TAIL_O = [24, 28], TAIL_SHORT = 38;   // in hundredths of the name's em
  const SVG_NS = "http://www.w3.org/2000/svg";
  stage.querySelectorAll(".formula-link").forEach((a) => {
    if (a.querySelector(".formula-tail")) return;
    const n = Math.max(1, Math.min(3, Math.round(+a.dataset.chain || 1)));
    // the corners: the name's end, the chain, the aldehyde's carbon, the O —
    // each bond a sixth of a turn off level, up and down in turn, the =O up
    const pts = [[0, 0]];
    for (let i = 0; i <= n; i++) {
      const [x, y] = pts[pts.length - 1];
      pts.push([x + TAIL_BOND * 0.866, y + ((n - i) % 2 === 0 ? -0.5 : 0.5) * TAIL_BOND]);
    }
    const c = pts[n], o = pts[n + 1];
    const ux = (o[0] - c[0]) / TAIL_BOND, uy = (o[1] - c[1]) / TAIL_BOND;
    const end = [o[0] - ux * TAIL_SHORT, o[1] - uy * TAIL_SHORT];
    const pair = (k) => "M" + (c[0] - uy * k).toFixed(1) + " " + (c[1] + ux * k).toFixed(1) +
      "L" + (end[0] - uy * k).toFixed(1) + " " + (end[1] + ux * k).toFixed(1);
    const minY = Math.min(...pts.map((p) => p[1])) - TAIL_O[1] - 6, maxY = Math.max(...pts.map((p) => p[1])) + 6;
    const maxX = o[0] + TAIL_O[0] + 8;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "formula-tail");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("viewBox", "0 " + minY.toFixed(1) + " " + maxX.toFixed(1) + " " + (maxY - minY).toFixed(1));
    svg.style.width = (maxX / 100).toFixed(3) + "em";
    svg.style.height = ((maxY - minY) / 100).toFixed(3) + "em";
    // (the name's end at the middle of its height)
    svg.style.top = "calc(50% - " + (-minY / 100).toFixed(3) + "em)";
    const el = (tag, attrs) => {
      const e = document.createElementNS(SVG_NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      svg.appendChild(e);
      return e;
    };
    el("circle", { class: "ft-lone", cx: o[0].toFixed(1), cy: o[1].toFixed(1), r: "42" });
    el("path", { class: "ft-bond", d: "M" + pts.slice(0, n + 1).map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") });
    el("path", { class: "ft-pi", d: pair(TAIL_PAIR) + pair(-TAIL_PAIR) });
    el("ellipse", { class: "ft-o", cx: o[0].toFixed(1), cy: o[1].toFixed(1), rx: TAIL_O[0], ry: TAIL_O[1] });
    a.appendChild(svg);
  });

  // ============================================================
  // THE GLIDE (2026-09-30, later: "make the scrolling a little smoother
  // ... when you scroll it feels very very incremental. EVERYTHING should be
  // smooth and gradual; and not incremental"). A mouse wheel moves a page a
  // notch at a time, and everything drawn from where the page is moved in
  // steps with it. So on the stage the wheel is taken: a notch moves only
  // where the page is GOING (`glideTo`), by WHEEL_SCALE of itself, and the
  // page follows on a spring, critically damped (GLIDE_W) — setting off
  // gently, never overshooting, settling softly — so a run of notches is one
  // movement, and a trackpad's own stream of small turns runs on as smoothly.
  // The keys and the Scroll button go a stage on the same way. (Since one
  // scroll plays the page all the way — ONE SCROLL, ALL THE WAY, below — the
  // notches and the stages are the hand-driven page's, `?auto=off`, and the
  // map slides'.) The scrollbar moves the page itself, and the glide lets
  // go. With reduced motion the page's own scrolling, at once.
  // ============================================================
  // (Slower and less sensitive since the night of 2026-09-30: "make the
  // scrolling smoother - as if making the scrolling less sensitive/slower".
  // They were 6.5 and 0.85.)
  const GLIDE_W = 4.2;        // the spring's pace, per second (higher, quicker)
  const WHEEL_SCALE = 0.5;    // how far a notch sends it, of its own size
  let glideAt = container.scrollTop, glideTo = glideAt, glideV = 0, gliding = false, glideLast = 0, glideWrote = -1;
  // as far down as it may glide: the stage's end, when the map slides follow it
  const glideMost = () => (mapOn && intro ? stageEnd() : container.scrollHeight - container.clientHeight);
  function glidePhase(now) {
    const dt = glideLast ? Math.min(0.05, (now - glideLast) / 1000) : 1 / 60;
    glideLast = now;
    const pull = GLIDE_W * GLIDE_W * (glideTo - glideAt) - 2 * GLIDE_W * glideV;
    glideV += pull * dt;
    glideAt += glideV * dt;
    if (Math.abs(glideTo - glideAt) < 0.4 && Math.abs(glideV) < 4) { glideAt = glideTo; glideV = 0; }
    container.scrollTop = glideAt;
    glideWrote = container.scrollTop;
    if (glideAt === glideTo) stopGlide();
  }
  function stopGlide() { phases.delete(glidePhase); gliding = false; glideLast = 0; glideV = 0; }
  function glideToY(y) {
    y = Math.max(0, Math.min(glideMost(), y));
    if (REDUCE_MOTION) { container.scrollTop = y; return; }
    if (!gliding) { glideAt = container.scrollTop; glideV = 0; glideLast = 0; gliding = true; phases.add(glidePhase); }
    glideTo = y;
  }
  // the page moved by something else while it glides: let go
  container.addEventListener("scroll", () => {
    if (gliding && Math.abs(container.scrollTop - glideWrote) > 2) { stopGlide(); stopPlay(); }
  }, { passive: true });
  // The wheel, on the stage. (With the map slides on, they have their say
  // first: `slideWheel`, below, takes a turn past the stage's end.)
  let slideWheel = null;
  container.addEventListener("wheel", (e) => {
    if (e.ctrlKey) return;                          // a pinch: the browser's own zoom
    if (REDUCE_MOTION && !slideWheel) return;       // the page's own scrolling
    e.preventDefault();
    if (overlayOpen()) return;
    const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
    if (slideWheel && slideWheel(e, d)) return;
    // one turn plays it all the way (ONE SCROLL, ALL THE WAY, below)
    if (playable) { wheelPlay(d); return; }
    glideToY((gliding ? glideTo : container.scrollTop) + d * WHEEL_SCALE);
  }, { passive: false });

  // A stage on, or back, gliding: the keys and the Scroll button.
  function toStage(k) {
    k = Math.max(0, Math.min(LAST, k));
    glideToY(Math.round(stageTop() + legsTo(k)));
  }
  function stepStage(dir) {
    // (from where it is going, if it is on its way somewhere)
    const at = Math.max(0, Math.min(LAST, stageOf((gliding ? glideTo : container.scrollTop) - stageTop())));
    toStage(dir > 0 ? Math.floor(at + 0.05) + 1 : Math.ceil(at - 0.05) - 1);
  }

  // ============================================================
  // ONE SCROLL, ALL THE WAY (2026-10-03, later: "make the scrolling
  // automatic as in when you scroll once, it will go all the way down, not
  // it will scroll by itself after a second or so"). The page stands at the
  // title until it is scrolled — and then ONE scroll, of any kind, plays it
  // the whole way: on through the five stages, a stage at a time on THE
  // GLIDE (the very spring it always moved on, so exactly as slowly as it
  // played itself), resting at each (AUTO_REST: the title gone, the turn
  // upright — the longest, for the turn to finish on its own spring,
  // molecule.js — the formula), to the names, where it stops. Scrolled up,
  // it plays back up to the title the same way.
  //
  // A scroll is a turn of the wheel or a trackpad, a swipe of a finger, a
  // key that moves a page (the arrows, Page Up and Down, Space, Home, End)
  // or the Scroll button. The rest of the same turn — a wheel's further
  // notches, a trackpad's own run-on — is the same scroll, and changes
  // nothing; a turn the OTHER way (PLAY_TURN of it, so a trackpad's
  // tremble is not one) turns the page round from where it is. While the
  // Menu, About me or the way out is open over it, it waits; the page moved
  // by anything else (the scrollbar) and it lets go, where it was put.
  // Until 2026-10-03, later, it set off by itself once the title had been
  // read (AUTO_FIRST, 4.2s) and the hand took over from it — gone.
  //
  // Not with motion turned off (the page's own scrolling there, the stages
  // following it at once), nor with the map slides on (their own wheel);
  // and `?auto=off` on the address keeps the old hand-driven page — a
  // wheel's notches gliding as far as they are turned, the keys a stage at
  // a time — for the tests that hold a stage. `data-auto` on the stage
  // says which: ready, down, up, or off.
  // ============================================================
  const AUTO_REST = [0, 1600, 2600, 2400];   // ms resting at stages 2, 3 and 4 (index: the stage arrived at), either way
  const PLAY_FROM = 8;     // px of a wheel turned that is a scroll (a trackpad's tremble is not)
  const PLAY_TURN = 40;    // and of a turn the other way, while it plays, that turns it round
  const PLAY_GAP = 420;    // ms without a turn, and the next one is a new scroll
  const SWIPE = 12;        // px a finger moves along the page before it is a swipe
  const playable = !REDUCE_MOTION && !mapOn && !/[?&]auto=off\b/.test(location.search);
  let playDir = 0, playTo = 0, playSince = 0;
  stage.dataset.auto = playable ? "ready" : "off";
  function stopPlay() {
    if (!playDir) return;
    playDir = 0;
    phases.delete(playPhase);
    stage.dataset.auto = "ready";
  }
  // The next stage on, from where the page is (not where it was going: a
  // turn round goes back from the very place it is).
  function nextFrom(dir) {
    const at = Math.max(0, Math.min(LAST, stageOf(container.scrollTop - stageTop())));
    return dir > 0 ? Math.floor(at + 0.02) + 1 : Math.ceil(at - 0.02) - 1;
  }
  // Set it going, one way: true if the scroll was taken (it always is, on
  // the stage: one already on its way that way is the same scroll).
  function play(dir) {
    if (!playable || !dir) return false;
    if (playDir === dir) return true;
    const next = nextFrom(dir);
    if (next < 0 || next > LAST) { stopPlay(); return true; }   // at the end it goes: nowhere further
    playDir = dir;
    playTo = next;
    playSince = performance.now();
    stage.dataset.auto = dir > 0 ? "down" : "up";
    toStage(next);
    phases.add(playPhase);
    return true;
  }
  function playPhase(now) {
    // (waiting behind anything open over the page, and while it glides)
    if (overlayOpen() || document.hidden || gliding) { playSince = now; return; }
    if (playTo <= 0 || playTo >= LAST) { stopPlay(); return; }   // there
    if (now - playSince < (AUTO_REST[playTo] || 0)) return;
    playTo += playDir;
    toStage(playTo);
    playSince = now;
  }
  // A wheel or a trackpad: its deltas gathered into one scroll — a new one
  // after PLAY_GAP without any.
  let turned = 0, turnedLast = 0;
  function wheelPlay(d) {
    const now = performance.now();
    if (now - turnedLast > PLAY_GAP) turned = 0;
    turnedLast = now;
    if (playDir && Math.sign(d) === playDir) { turned = 0; return; }   // the same scroll, run on
    turned += d;
    if (Math.abs(turned) >= (playDir ? PLAY_TURN : PLAY_FROM)) { play(Math.sign(turned)); turned = 0; }
  }
  // A finger: a swipe up the page is a scroll down it. The page's own
  // scrolling is held off, so a swipe is a scroll and nothing else (two
  // fingers are a pinch, and are the browser's).
  let touchY = null, swiped = false;
  container.addEventListener("touchstart", (e) => {
    touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
    swiped = false;
  }, { passive: true });
  container.addEventListener("touchmove", (e) => {
    if (!playable || touchY === null || e.touches.length !== 1) return;
    if (e.cancelable) e.preventDefault();
    const dy = touchY - e.touches[0].clientY;
    if (!swiped && !overlayOpen() && Math.abs(dy) >= SWIPE) { swiped = true; play(Math.sign(dy)); }
  }, { passive: false });
  container.addEventListener("touchend", () => { touchY = null; }, { passive: true });
  // the page moved by anything but the glide — the scrollbar — while it
  // rests between stages: let go, where it was put
  container.addEventListener("scroll", () => {
    if (playDir && !gliding && Math.abs(container.scrollTop - glideWrote) > 2) stopPlay();
  }, { passive: true });

  // ============================================================
  // THE WAY OUT, ASKED FIRST (2026-09-30: "when you click it, I want a
  // confirmation message to pop up to go to that thing. it should be on
  // theme"). A name on the formula pressed brings up a dark sheet with the
  // page's name and what the page is — the name's own `data-say`, the words
  // its window said on the node map, and its `data-note` set apart ("use
  // the text from what would have been the popup windows on page 4") —
  // Stay and Go, over the page veiled, which goes on moving behind it
  // (molecule.js), and specks of the aldehyde's colours drifting in the
  // sheet (THE SHEET'S SPECKS, below); Escape, Stay or the veil put it
  // away. Pressed with a key held (a new tab, a new window) a name goes
  // where it goes without asking, since nothing is being left. A name
  // tabbed to before the names are up takes the page to them.
  // ============================================================
  const ask = document.getElementById("formula-ask");
  if (ask) {
    const askName = ask.querySelector(".formula-ask-name");
    const askSay = ask.querySelector(".formula-ask-say");
    const askNote = ask.querySelector(".formula-ask-note");
    const askStay = ask.querySelector(".formula-ask-stay");
    const askGo = ask.querySelector(".formula-ask-go");
    const specks = askSpecks(ask.querySelector(".formula-ask-specks"));
    let askFrom = null, askTimer = 0, asking = false;
    const openAsk = (a) => {
      askName.textContent = a.textContent.trim();
      if (a.dataset.say) askSay.textContent = a.dataset.say;
      if (askNote) {
        askNote.textContent = a.dataset.note || "";
        askNote.hidden = !a.dataset.note;
      }
      askGo.setAttribute("href", a.getAttribute("href"));
      askFrom = a;
      asking = true;
      window.clearTimeout(askTimer);
      ask.hidden = false;
      void ask.offsetWidth;
      ask.classList.add("is-on");
      document.body.classList.add("ask-shown");
      a.classList.add("is-lit");
      specks.start();
      window.setTimeout(() => { if (asking) askGo.focus({ preventScroll: true }); }, REDUCE_MOTION ? 0 : 60);
    };
    const stay = () => {
      if (!asking) return;
      asking = false;
      ask.classList.remove("is-on");
      document.body.classList.remove("ask-shown");
      askTimer = window.setTimeout(() => { if (!asking) { ask.hidden = true; specks.stop(); } }, REDUCE_MOTION ? 0 : 420);
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
        // (straight there, not played: the keys are on a name already)
        if (a.matches(":focus-visible") && reading() < LAST - 0.05) { stopPlay(); toStage(LAST); }
      });
    });
  }

  // THE SHEET'S SPECKS (2026-09-30: "I want the popup window to have some
  // particles too"): a drift of specks in the aldehyde's own colours — its
  // warm grey, the double bond's gold, the lone pair's violet — across the
  // way out's sheet, behind its words: gathering in from all round as it
  // opens, then turning slowly about their places and swirling a little as
  // the aldehyde's do; thickest towards the sheet's right and foot, faint
  // where the words stand. Drawn only while it asks; still with motion
  // turned off.
  function askSpecks(canvas) {
    const none = { start() {}, stop() {} };
    if (!canvas || !canvas.getContext) return none;
    const ctx = canvas.getContext("2d");
    if (!ctx) return none;
    const TONES = [[0.5, "179,171,161"], [0.3, "224,178,82"], [0.2, "169,138,216"]];
    // MANY SMALL ONES, COMING ONE BY ONE (2026-10-01: "not to have such a
    // sudden burst of large particles, rather the gradual appearance of
    // many small ones"): each shows at a moment of its own over the first
    // `APPEAR_MS`, fading in over `FADE_MS` where it stands and settling
    // the last few pixels into its place — it was 180 twice the size, all
    // flying in together from all round over 0.9s.
    const COUNT = window.innerWidth < 700 ? 360 : 560;
    const APPEAR_MS = 1500, FADE_MS = 600, SETTLE = 6;
    let specks = [], w = 0, h = 0, ratio = 1, raf = 0, born = 0;
    let s = 91;
    const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    function lay() {
      const r = canvas.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
      s = 91;
      specks = [];
      for (let i = 0; i < COUNT; i++) {
        // thickest towards the right and the foot, where the words are not
        const x = Math.pow(rnd(), 0.55), y = Math.pow(rnd(), 0.7);
        let t = rnd(), tone = TONES[0][1];
        for (const [share, c] of TONES) { if (t < share) { tone = c; break; } t -= share; }
        const a = rnd() * Math.PI * 2;
        specks.push({
          x: x * w, y: y * h, tone,
          size: 0.3 + rnd() * 0.5,
          alpha: 0.3 + rnd() * 0.55,
          turn: 0.15 + rnd() * 0.35, orbit: 1.5 + rnd() * 4, phase: rnd() * 6.283,
          at: rnd() * APPEAR_MS,
          fromX: Math.cos(a) * SETTLE, fromY: Math.sin(a) * SETTLE,
        });
      }
      // by colour, so the pen is changed three times a frame, not hundreds
      specks.sort((p, q) => (p.tone < q.tone ? -1 : p.tone > q.tone ? 1 : 0));
    }
    function frame(now) {
      const t = (now - born) / 1000;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      let pen = "";
      for (const p of specks) {
        const come = REDUCE_MOTION ? 1 : smooth((now - born - p.at) / FADE_MS);
        if (come <= 0) continue;
        const a = REDUCE_MOTION ? p.phase : p.phase + t * p.turn;
        let x = p.x + Math.cos(a) * p.orbit + (1 - come) * p.fromX;
        let y = p.y + Math.sin(a * 1.3) * p.orbit * 0.7 + (1 - come) * p.fromY;
        if (!REDUCE_MOTION) {
          x += Math.sin(y * 0.021 + t * 0.4 + p.phase) * 2.2;
          y += Math.cos(x * 0.019 - t * 0.35) * 1.8;
        }
        // faint where the words stand: the upper left
        const quiet = 0.35 + 0.65 * smooth(Math.max(x / w - 0.45, 0) * 2.2 + Math.max(y / h - 0.62, 0) * 2.6);
        const twinkle = REDUCE_MOTION ? 1 : 0.7 + 0.3 * Math.sin(t * 1.7 + p.phase * 9);
        if (p.tone !== pen) { ctx.fillStyle = "rgb(" + p.tone + ")"; pen = p.tone; }
        ctx.globalAlpha = Math.min(1, p.alpha * quiet * twinkle * come);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = REDUCE_MOTION ? 0 : requestAnimationFrame(frame);
    }
    return {
      start() {
        cancelAnimationFrame(raf);
        lay();
        born = performance.now();
        raf = requestAnimationFrame(frame);
      },
      stop() { cancelAnimationFrame(raf); raf = 0; },
    };
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
    // --- the keys and the Scroll button: a scroll, played all the way (ONE
    // SCROLL, ALL THE WAY, above); with `?auto=off`, a stage at a time
    window.addEventListener("keydown", (e) => {
      if (overlayOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target && e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      // (Space presses a button or a link it is on, as it always does)
      if (e.key === " " && e.target && e.target.closest && e.target.closest("button, a, summary")) return;
      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "End" || (e.key === " " && !e.shiftKey)) dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home" || (e.key === " " && e.shiftKey)) dir = -1;
      if (!dir) return;
      e.preventDefault();
      if (play(dir)) return;
      if (e.key === "Home") toStage(0);
      else if (e.key === "End") toStage(LAST);
      else stepStage(dir);
    });
    const cue = document.getElementById("scroll-cue");
    if (cue) cue.addEventListener("click", () => { if (!play(1)) stepStage(1); });
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
    stopGlide();

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
  // (the scrollbar, a finger); on the stage, no snapping.
  let endSince = 0;
  container.addEventListener("scroll", () => {
    if (animating) return;
    const y = container.scrollTop, end = stageEnd();
    activeIndex = whereIs();
    // no snapping on the stage (it is turned on only on arriving at a
    // slide after it, as it always was: a page held part of the way between
    // the sentence and the map stays where it is held)
    if (activeIndex === 0) container.style.scrollSnapType = "none";
    if (activeIndex === 0 && y >= end - 1) { if (!endSince) endSince = performance.now(); } else endSince = 0;
  }, { passive: true });

  // --- Wheel / trackpad: on the stage it glides (above), held at the stage's
  // end; past it, one gentle gesture moves exactly one slide.
  let wheelLock = false;
  const LEAVE_AFTER_MS = 450;  // how long at the stage's end before a turn goes on to the sentence
  slideWheel = (e, d) => {
    if (animating) return true;
    const y = gliding ? glideTo : container.scrollTop, end = stageEnd();
    if (activeIndex === 0 && (d < 0 || y < end - 1)) return false;   // the stage's own
    if (activeIndex === 0 && (!endSince || performance.now() - endSince < LEAVE_AFTER_MS)) {
      if (!endSince && container.scrollTop >= end - 1) endSince = performance.now();
      return true;
    }
    if (wheelLock) return true;
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 1000);
    if (d > 0) goTo(activeIndex + 1);
    else if (d < 0) goTo(activeIndex - 1);
    return true;
  };

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

// ============================================================
// QIMU & MUSICIANS — houses/qimu-and-musicians.html
//
// The ninth house, a house of music, and until 2026-09-25 it had no
// ground of its own. The owner: "add some complex notes; and some 5
// lines in which they will exist. I dont wan tit to be sloppy or out of
// place, and I want them to be nicely animated. When there are 5
// lines, dont make them always 4/4, i want that to vary, make it random
// (as long as its an actual used notation). I want it to look complex.
// Overall the Qimu and musicians effect should be subtle though, I dont
// want it to take over the page." And the page is blue: "semi light
// blue" (`.qimu-page` in style.css).
//
// And then, 2026-09-26: "i want there to be a button on top that allows
// you to mute and unmute. it should be a square and relatively obvious.
// I also want you whn you hover the notes in qimu and musicians, it plays
// them as piano notes. Also make sure that whatever generated is logical
// and can be played."
//
// WHAT IT IS: short STAVES standing in the margins either side of the
// writing, one under another down the whole length of the page — a
// score kept in the margins — and now REAL MUSIC, every bar of it:
//
//   A KEY        one of the eighteen with up to four sharps or flats,
//                major or minor, its signature at the head of the stave
//                and every note in it; in a minor key the leading note is
//                raised in the bars whose chord is the dominant, and
//                carries its sharp or natural the first time it appears
//                in the bar, as it would be engraved.
//   A METRE      from the ones music uses (`METERS` — 4/4 is one of
//                fourteen), changing now and then at a bar line, and
//                EVERY BAR ADDS UP to it exactly: its notes and rests,
//                grouped by the beat and beamed within it — quavers,
//                semiquavers, dotted rhythms, triplets.
//   HARMONY      a progression a bar at a time (I–IV–V–I, i–VI–III–VII
//                and the like), the melody on the chord's own notes at
//                the beat and stepping between them; on a braced pair
//                the left hand holds the root or breaks the chord under
//                it, never further than a hand can reach. The last bar
//                comes home to the key's own chord.
//
// So every note has a pitch, and POINTING AT A STAVE PLAYS IT — that
// stave, from its first note, as it is written, both hands, in time, on
// a recorded grand piano (`key`, `play`), and only while the hand is on
// its lines (2026-09-27; until then a single note sounded as the hand
// passed over it, on a piano made up here, which the owner found
// "aweful"). A tap plays a stave through once on a phone. It starts
// silent: a browser will not let a page make a sound until it has been
// pressed, so the square button at the top of the page (`.qimu-sound`)
// is how the sound is turned on, and off again.
//
// NICELY ANIMATED, and quietly:
//   WRITTEN IN  a stave is written left to right, as a pen would, the
//               first time it comes into the window;
//   PLAYED      then a faint playhead passes along it at its own tempo,
//               and each note it reaches LIFTS — a little stronger, for a
//               moment — as a note sounds and dies away (in silence,
//               unless it is the stave under the hand with the sound on,
//               whose playhead is where the piano is). The staves play
//               one after another rather than all at once;
//   THE HAND    and the notes near the pointer stand a shade stronger.
//
// IT LIVES DOWN THE DOCUMENT, not on the window: a score is read down
// the page, and staves that stayed put while the writing scrolled past
// them would read as a screen rather than as music. So the canvas is
// fixed and the staves are carried in the page's own coordinates, as
// Pineward's wood is. On a window without margins the staves are drawn
// across it at QUIET, behind the writing.
//
// WITHOUT THIS SCRIPT the page is exactly what it was before it, with no
// button: there is nothing to play.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
  if (!ink) return;

  const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // TUNING
  // ============================================================
  const BLUE = "44, 62, 99";
  const LINE = 0.2;                // how strong a stave's lines are
  const NOTE = 0.34;               // and what is written on it
  const PLAYED = 0.2;              // how much a note lifts as it is played
  const HANDED = 0.14;             // and near the pointer
  const STRONGEST = 0.58;          // and never more than this: it is a ground
  const COLUMN = 940;
  const QUIET = 0.24;              // what is left over the writing, where there are no margins

  const GAP = 6;                   // between one line of a stave and the next
  const EVERY = 210;               // px down the page from one stave to the next
  const WRITE = 1.8;               // seconds, a stave written end to end
  const TEMPO = [58, 88];          // crotchets a minute, a stave's own
  const RING = 0.9;                // seconds a played note takes to die away
  const HAND = 90;

  let seed = 77013;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const between = (a, b) => a + (b - a) * random();
  const pick = (list) => list[Math.floor(random() * list.length)];
  const weighted = (list) => {
    let total = 0;
    list.forEach((one) => { total += one[0]; });
    let r = random() * total;
    for (const one of list) { r -= one[0]; if (r <= 0) return one[1]; }
    return list[list.length - 1][1];
  };
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  // ============================================================
  // THE ENGRAVER'S STROKES — the same as the Houses view's, kept here
  // because no page script knows about another.
  // ============================================================
  const RX = GAP * 0.6, RY = GAP * 0.42;
  const yAt = (top, p) => top + 4 * GAP - p * GAP / 2;
  const line = (x1, y1, x2, y2, w) => { ink.lineWidth = w || 0.9; ink.beginPath(); ink.moveTo(x1, y1); ink.lineTo(x2, y2); ink.stroke(); };
  function head(x, y, open) {
    ink.beginPath();
    ink.ellipse(x, y, RX, RY, -0.35, 0, Math.PI * 2);
    if (open) { ink.lineWidth = 0.9; ink.stroke(); } else ink.fill();
  }
  function whole(x, y) {
    ink.lineWidth = 1.1;
    ink.beginPath();
    ink.ellipse(x, y, RX * 1.15, RY * 1.05, 0, 0, Math.PI * 2);
    ink.stroke();
  }
  function beamLine(x1, y1, x2, y2) {
    ink.beginPath();
    ink.moveTo(x1, y1 - 1); ink.lineTo(x2, y2 - 1); ink.lineTo(x2, y2 + 1); ink.lineTo(x1, y1 + 1);
    ink.closePath();
    ink.fill();
  }
  function flag(x, y, up, n) {
    ink.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const d = (up ? 1 : -1) * i * GAP * 0.62;
      ink.beginPath();
      ink.moveTo(x, y + d);
      if (up) ink.bezierCurveTo(x + GAP * 0.2, y + d + GAP * 0.9, x + GAP * 1.3, y + d + GAP * 1.1, x + GAP * 0.8, y + d + GAP * 2.4);
      else ink.bezierCurveTo(x + GAP * 0.2, y + d - GAP * 0.9, x + GAP * 1.3, y + d - GAP * 1.1, x + GAP * 0.8, y + d - GAP * 2.4);
      ink.stroke();
    }
  }
  function dot(x, y) {
    ink.beginPath(); ink.arc(x, y, 1, 0, Math.PI * 2); ink.fill();
  }
  function sharp(x, y) {
    line(x - 1.2, y - GAP * 1.2, x - 1.2, y + GAP * 1.3, 0.7);
    line(x + 1.2, y - GAP * 1.35, x + 1.2, y + GAP * 1.15, 0.7);
    line(x - 2.4, y - GAP * 0.35 + 0.8, x + 2.4, y - GAP * 0.35 - 0.8, 1.4);
    line(x - 2.4, y + GAP * 0.4 + 0.8, x + 2.4, y + GAP * 0.4 - 0.8, 1.4);
  }
  function flat(x, y) {
    line(x - 1.4, y - GAP * 1.8, x - 1.4, y + GAP * 0.5, 0.8);
    ink.lineWidth = 1.1;
    ink.beginPath();
    ink.moveTo(x - 1.4, y + GAP * 0.5);
    ink.bezierCurveTo(x + 3.6, y - GAP * 0.1, x + 2, y - GAP * 0.9, x - 1.4, y - GAP * 0.1);
    ink.stroke();
  }
  function natural(x, y) {
    line(x - 1.2, y - GAP * 1.3, x - 1.2, y + GAP * 0.5, 0.7);
    line(x + 1.2, y - GAP * 0.5, x + 1.2, y + GAP * 1.3, 0.7);
    line(x - 1.2, y - GAP * 0.3 + 0.6, x + 1.2, y - GAP * 0.3 - 0.6, 1.3);
    line(x - 1.2, y + GAP * 0.35 + 0.6, x + 1.2, y + GAP * 0.35 - 0.6, 1.3);
  }
  /** A rest of `units` semiquavers, standing where rests stand. */
  function rest(x, top, units) {
    const y = top + GAP * 2;
    const eighth = (ex, ey, tails) => {
      for (let i = 0; i < tails; i++) {
        const dy = i * GAP;
        ink.beginPath(); ink.arc(ex - 1.4 - i * 0.9, ey - GAP * 0.55 + dy, 1.2, 0, Math.PI * 2); ink.fill();
        ink.lineWidth = 0.9;
        ink.beginPath(); ink.moveTo(ex - 1.4 - i * 0.9, ey - GAP * 0.55 + dy); ink.quadraticCurveTo(ex, ey - GAP * 0.35 + dy, ex + 1.6 - i * 0.9, ey - GAP * 0.8 + dy); ink.stroke();
      }
      line(ex + 1.6, ey - GAP * 0.8, ex - 0.9 - (tails - 1) * 0.9, ey + GAP * (0.9 + (tails - 1) * 0.8), 0.9);
    };
    if (units >= 16) ink.fillRect(x - 3.5, top + GAP, 7, GAP * 0.5);
    else if (units >= 8) ink.fillRect(x - 3.5, y - GAP * 0.5, 7, GAP * 0.5);
    else if (units >= 4) {
      ink.lineWidth = 1.2;
      ink.beginPath();
      ink.moveTo(x - 1.2, y - GAP * 1.5); ink.lineTo(x + 1.7, y - GAP * 0.7); ink.lineTo(x - 1.2, y + GAP * 0.1);
      ink.lineTo(x + 1.7, y + GAP * 0.8); ink.quadraticCurveTo(x - 2.3, y + GAP * 0.9, x, y + GAP * 1.6);
      ink.stroke();
    } else if (units >= 2) eighth(x, y, 1);
    else eighth(x, y, 2);
    if (units === 6 || units === 3) dot(x + 5, y - GAP * 0.5);
  }
  function slur(x1, y1, x2, y2, below) {
    const lift = (below ? 1 : -1) * Math.min(GAP * 1.6, 4 + (x2 - x1) * 0.12);
    ink.lineWidth = 0.8;
    ink.beginPath();
    ink.moveTo(x1, y1);
    ink.bezierCurveTo(x1 + (x2 - x1) * 0.25, y1 + lift, x1 + (x2 - x1) * 0.75, y2 + lift, x2, y2);
    ink.stroke();
  }
  function text(t, x, y, px, style) {
    ink.font = (style || "bold") + " " + px + "px Georgia, 'Times New Roman', serif";
    ink.textAlign = "center";
    ink.textBaseline = "middle";
    ink.fillText(t, x, y);
  }
  function tuplet(x1, x2, y, label, up) {
    const d = up ? 3 : -3, mid = (x1 + x2) / 2;
    ink.lineWidth = 0.6;
    ink.beginPath();
    ink.moveTo(x1, y + d); ink.lineTo(x1, y); ink.lineTo(mid - 4, y);
    ink.moveTo(mid + 4, y); ink.lineTo(x2, y); ink.lineTo(x2, y + d);
    ink.stroke();
    text(label, mid, y, 8, "italic");
  }
  function time(t, x, top) {
    text(t[0], x, top + GAP, GAP * 2.1);
    text(t[1], x, top + GAP * 3, GAP * 2.1);
  }
  function treble(x, top) {
    const G = GAP;
    ink.lineWidth = 1;
    ink.beginPath();
    ink.moveTo(x - 0.35 * G, top + 5.4 * G);
    ink.quadraticCurveTo(x + 0.4 * G, top + 5.8 * G, x + 0.2 * G, top + 4.6 * G);
    ink.lineTo(x - 0.05 * G, top - 1.2 * G);
    ink.bezierCurveTo(x + 0.1 * G, top - 2.2 * G, x + 0.9 * G, top - 1.4 * G, x + 0.3 * G, top - 0.2 * G);
    ink.bezierCurveTo(x - 0.4 * G, top + 1.0 * G, x - 1.0 * G, top + 1.9 * G, x - 0.9 * G, top + 2.9 * G);
    ink.bezierCurveTo(x - 0.8 * G, top + 4.0 * G, x + 0.9 * G, top + 4.0 * G, x + 0.9 * G, top + 3.0 * G);
    ink.bezierCurveTo(x + 0.9 * G, top + 2.1 * G, x - 0.3 * G, top + 2.0 * G, x - 0.25 * G, top + 2.9 * G);
    ink.stroke();
    ink.beginPath(); ink.arc(x - 0.35 * G, top + 5.3 * G, 0.3 * G, 0, Math.PI * 2); ink.fill();
  }
  function bass(x, top) {
    const G = GAP;
    ink.lineWidth = 1.2;
    ink.beginPath();
    ink.moveTo(x - 0.5 * G, top + 1.0 * G);
    ink.bezierCurveTo(x - 0.5 * G, top - 0.1 * G, x + 1.1 * G, top - 0.2 * G, x + 1.0 * G, top + 1.2 * G);
    ink.bezierCurveTo(x + 0.9 * G, top + 2.4 * G, x, top + 3.2 * G, x - 0.7 * G, top + 3.6 * G);
    ink.stroke();
    ink.beginPath(); ink.arc(x - 0.45 * G, top + 1.0 * G, 0.32 * G, 0, Math.PI * 2); ink.fill();
    ink.beginPath(); ink.arc(x + 1.5 * G, top + 0.5 * G, 0.9, 0, Math.PI * 2); ink.fill();
    ink.beginPath(); ink.arc(x + 1.5 * G, top + 1.5 * G, 0.9, 0, Math.PI * 2); ink.fill();
  }

  // ============================================================
  // THE MUSIC: keys, metres, chords
  //
  // A pitch is written as a STEP — how many letters above middle C (C4
  // is 0, D4 1, C5 7, B3 −1) — and sounds as that letter in its octave,
  // raised or lowered by the key signature, or by an accidental earlier
  // in the same bar.
  // ============================================================
  const SEMIS = [0, 2, 4, 5, 7, 9, 11];            // C D E F G A B
  const SHARPS = [3, 0, 4, 1, 5];                   // F C G D A, in the order they are written
  const FLATS = [6, 2, 5, 1, 4];                    // B E A D G
  const MAJOR_SHARP = [0, 4, 1, 5, 2];              // C G D A E
  const MAJOR_FLAT = [0, 3, 6, 2, 5];               // C F B♭ E♭ A♭
  const letterOf = (d) => ((d % 7) + 7) % 7;
  const midiOf = (d, alter) => 60 + 12 * Math.floor(d / 7) + SEMIS[letterOf(d)] + alter;
  // Where a step stands on its stave: the treble's bottom line is E4,
  // the bass's is G2.
  const posOf = (d, low) => (low ? d + 10 : d - 2);

  // THE METRES, each as its beats — a crotchet beat is 4 semiquavers, a
  // dotted crotchet 6 — in the spans a long note may fill.
  const METERS = [
    { t: ["4", "4"], spans: [[4, 4], [4, 4]] },
    { t: ["3", "4"], spans: [[4, 4, 4]] },
    { t: ["2", "4"], spans: [[4, 4]] },
    { t: ["5", "4"], spans: [[4, 4, 4], [4, 4]] },
    { t: ["7", "4"], spans: [[4, 4], [4, 4], [4, 4, 4]] },
    { t: ["6", "4"], spans: [[4, 4, 4], [4, 4, 4]] },
    { t: ["2", "2"], spans: [[4, 4], [4, 4]] },
    { t: ["3", "2"], spans: [[4, 4], [4, 4], [4, 4]] },
    { t: ["6", "8"], spans: [[6], [6]] },
    { t: ["9", "8"], spans: [[6], [6], [6]] },
    { t: ["12", "8"], spans: [[6], [6], [6], [6]] },
    { t: ["3", "8"], spans: [[6]] },
    { t: ["5", "8"], spans: [[6], [4]] },
    { t: ["7", "8"], spans: [[4], [4], [6]] },
  ];
  const unitsOf = (meter) => meter.spans.reduce((n, s) => n + s.reduce((a, b) => a + b, 0), 0);
  // The note values a whole span can be held for.
  const HELD = { 16: true, 12: true, 8: true, 6: true, 4: true };

  // WHAT A BEAT CAN BE: in semiquavers ("R" is a rest; "T" a triplet of
  // quavers in the time of two).
  const SIMPLE = [
    [2, [4]], [4, [2, 2]], [2.6, [1, 1, 1, 1]], [2.2, [2, 1, 1]], [2.2, [1, 1, 2]],
    [1.6, [3, 1]], [1.5, "T"], [0.4, ["R4"]], [0.6, ["R2", 2]],
  ];
  const COMPOUND = [
    [3, [6]], [4, [2, 2, 2]], [2.5, [4, 2]], [1.2, [2, 4]], [1.2, [1, 1, 1, 1, 1, 1]],
    [1.5, [2, 1, 1, 2]], [1.2, [3, 1, 2]], [0.5, ["R6"]],
  ];
  const PAIR = [[3, [2, 2]], [2, [4]], [1.5, [1, 1, 2]], [1, [1, 1, 1, 1]]];

  // PROGRESSIONS, a chord a bar, as scale degrees from 0. In a minor key
  // the dominant (4) carries the raised leading note.
  const MAJOR_WAYS = [[0, 3, 4, 0], [0, 5, 3, 4], [1, 4, 0, 0], [0, 4, 5, 3], [3, 0, 4, 0], [0, 3, 1, 4], [5, 1, 4, 0]];
  const MINOR_WAYS = [[0, 3, 4, 0], [0, 5, 2, 6], [0, 3, 6, 2], [0, 5, 3, 4], [3, 4, 0, 0], [0, 6, 5, 4]];

  function keyOf() {
    const count = Math.floor(random() * 5), sharps = random() < 0.5;
    const minor = random() < 0.4;
    const major = (sharps ? MAJOR_SHARP : MAJOR_FLAT)[count];
    const sig = [0, 0, 0, 0, 0, 0, 0];
    (sharps ? SHARPS : FLATS).slice(0, count).forEach((l) => { sig[l] = sharps ? 1 : -1; });
    return { count, sharps, minor, sig, tonic: minor ? (major + 5) % 7 : major };
  }

  // ============================================================
  // THE COMPOSER. One stave at a time, a bar at a time.
  //
  // A bar is a list of EVENTS on each of its staves — a note, a chord or
  // a rest, with where in the bar it starts (`t`, in semiquavers) and how
  // long it lasts — and every one of them lasts exactly what the metre
  // leaves it.
  // ============================================================
  function composeBar(key, meter, chord, grand, last, from) {
    const units = unitsOf(meter);
    const tones = [0, 2, 4].map((k) => (key.tonic + chord + k) % 7);
    // The leading note, raised in the dominant's bars of a minor key.
    const lead = (key.tonic + 6) % 7;
    const raise = key.minor && chord === 4 ? lead : -1;
    const nearestTone = (d, lo, hi) => {
      let best = d, far = 99;
      for (let q = lo; q <= hi; q++) {
        if (!tones.includes(letterOf(q))) continue;
        const f = Math.abs(q - d) + (q === d ? 0.5 : 0) * random();
        if (f < far) { far = f; best = q; }
      }
      return best;
    };

    // THE RIGHT HAND: the tune, and now and then a chord under it.
    const melody = [];
    let cur = from;
    let t = 0;
    const lastSpan = meter.spans.length - 1;
    meter.spans.forEach((span, si) => {
      const spanUnits = span.reduce((a, b) => a + b, 0);
      // THE LAST BAR comes home: the key's own chord, held.
      if (last && si === lastSpan && HELD[spanUnits]) {
        let home = cur, far = 99;
        for (let q = 0; q <= 11; q++) if (letterOf(q) === key.tonic && Math.abs(q - cur) < far) { far = Math.abs(q - cur); home = q; }
        melody.push({ t, dur: spanUnits, ds: [home], strong: true });
        cur = home; t += spanUnits;
        return;
      }
      if (!last && HELD[spanUnits] && span.length > 1 && random() < 0.2) {
        cur = nearestTone(cur + pick([-2, -1, 1, 2]), 0, 11);
        melody.push({ t, dur: spanUnits, ds: [cur], strong: true });
        t += spanUnits;
        return;
      }
      span.forEach((beat, bi) => {
        // A span of one crotchet in a quaver metre (5/8, 7/8) is two
        // quavers' worth, beamed as quavers.
        const quaverTime = meter.t[1] === "8";
        let cell = weighted(beat === 6 ? COMPOUND : quaverTime ? PAIR : SIMPLE);
        if (last) cell = beat === 6 ? [6] : [4];
        const trip = cell === "T";
        const values = trip ? [4 / 3, 4 / 3, 4 / 3] : cell;
        values.forEach((v, k) => {
          if (typeof v === "string") {
            const r = Number(v.slice(1));
            melody.push({ t, dur: r, rest: true });
            t += r;
            return;
          }
          const strong = k === 0;
          let d;
          if (strong) d = nearestTone(cur + pick([-2, -1, 0, 1, 2, 3, -3]), 0, 11);
          else d = cur + pick([-1, 1, 1, -1, 2, -2]);
          if (d < 0) d = 1;
          if (d > 11) d = 10;
          cur = d;
          melody.push({ t, dur: v, ds: [d], strong, trip, beatGroup: si * 10 + bi });
          t += v;
        });
      });
    });
    // Now and then the tune is harmonised: a crotchet or longer on the
    // beat becomes the chord, closed up under its top note.
    melody.forEach((e) => {
      if (e.rest || e.dur < 4 || random() > 0.22) return;
      const top = e.ds[0];
      const under = [];
      for (let q = top - 1; q >= top - 7 && under.length < 2; q--) if (tones.includes(letterOf(q))) under.push(q);
      if (under.length === 2 && under[1] >= -2) e.ds = [under[1], under[0], top];
    });

    // THE LEFT HAND, on a braced pair: the root held, or the chord broken
    // under the tune — always within an octave.
    const low = [];
    if (grand) {
      // The root between E2 and D3, so the fifth over it and the octave
      // stay on or just over the bass stave, and the hand never stretches
      // past an octave.
      let root = tones[0];
      while (root > -6) root -= 7;
      while (root < -12) root += 7;
      const fifth = root + 4, third = root + 2, octave = root + 7;
      const style = last ? "held" : weighted([[3, "held"], [3, "broken"], [1.5, "pulse"]]);
      let lt = 0;
      meter.spans.forEach((span, si) => {
        const spanUnits = span.reduce((a, b) => a + b, 0);
        if (style === "held" && HELD[spanUnits]) {
          low.push({ t: lt, dur: spanUnits, ds: si === 0 || last ? [root, fifth] : [fifth] });
          lt += spanUnits;
          return;
        }
        span.forEach((beat) => {
          if (style === "pulse") {
            low.push({ t: lt, dur: beat, ds: [root, octave] });
            lt += beat;
            return;
          }
          // The chord broken in quavers: root and fifth to a crotchet,
          // root, third and fifth to a dotted crotchet.
          const run = beat === 6 ? [root, third, fifth] : [root, fifth];
          const group = 100 + lt;
          run.forEach((q) => { low.push({ t: lt, dur: 2, ds: [q], beatGroup: group }); lt += 2; });
        });
      });
    }

    // THE ACCIDENTALS, as an engraver writes them: the raised leading note
    // carries its sign the first time it appears on its line in the bar,
    // and holds to the bar line.
    const spell = (events, isLow) => {
      const marked = new Set();
      events.forEach((e) => {
        if (e.rest) return;
        e.alter = []; e.acc = [];
        e.ds.forEach((d) => {
          const l = letterOf(d);
          let alter = key.sig[l];
          let acc = null;
          if (l === raise) {
            alter = key.sig[l] + 1;
            if (!marked.has(d)) { acc = key.sig[l] < 0 ? "natural" : "sharp"; marked.add(d); }
          }
          e.alter.push(alter);
          e.acc.push(acc);
        });
        e.low = isLow;
      });
    };
    spell(melody, false);
    spell(low, true);
    return { units, melody, low, end: cur };
  }

  // ============================================================
  // THE LAYOUT of a bar: where each event stands across it. The two
  // staves of a braced pair share their onsets, so what sounds together
  // stands together.
  // ============================================================
  const spacing = (g) => GAP * (0.82 + 0.62 * Math.sqrt(g));
  function layBar(bar) {
    const all = bar.melody.concat(bar.low);
    const onsets = [...new Set(all.map((e) => Math.round(e.t * 3) / 3))].sort((a, b) => a - b);
    const xs = new Map();
    let x = 8;
    onsets.forEach((t, i) => {
      const here = all.filter((e) => Math.abs(e.t - t) < 0.01);
      const accs = here.some((e) => e.acc && e.acc.some(Boolean));
      if (accs) x += 6;
      xs.set(t, x);
      const next = i + 1 < onsets.length ? onsets[i + 1] : bar.units;
      const dotted = here.some((e) => e.dur === 3 || e.dur === 6 || e.dur === 12);
      x += spacing(next - t) + (dotted ? 3 : 0);
    });
    all.forEach((e) => { e.x = xs.get(Math.round(e.t * 3) / 3); });
    bar.width = x + 4;
  }

  // ============================================================
  // ENGRAVING one bar's events into marks. A MARK is a thing drawn at an
  // x relative to its stave's own left edge and top; a NOTE is a mark
  // that sounds, and carries its pitches and where its heads are.
  // ============================================================
  function engrave(bar, ox, tops, grand, put) {
    const draw = (events, top, isLow) => {
      // Grouped for beaming: quavers and shorter within one beat.
      const groups = [];
      let cur = null;
      events.forEach((e) => {
        const beamable = !e.rest && e.dur < 4 && e.ds.length === 1;
        if (beamable && cur && cur.key === e.beatGroup) cur.list.push(e);
        else {
          cur = beamable ? { key: e.beatGroup, list: [e] } : null;
          if (cur) groups.push(cur);
          else groups.push({ key: null, list: [e] });
        }
      });
      groups.forEach((g) => {
        const list = g.list;
        if (list.length === 1) { single(list[0], top, isLow); return; }
        beamed(list, top, isLow);
      });
    };
    const posList = (e) => e.ds.map((d) => posOf(d, e.low));
    const ledgers = (x, ps, top) => {
      const lo = Math.min(...ps), hi = Math.max(...ps);
      for (let q = -2; q >= lo; q -= 2) { const y = yAt(top, q); put(x, () => line(x - RX * 1.7, y, x + RX * 1.7, y, 0.7)); }
      for (let q = 10; q <= hi; q += 2) { const y = yAt(top, q); put(x, () => line(x - RX * 1.7, y, x + RX * 1.7, y, 0.7)); }
    };
    const accidentals = (e, hx, top) => {
      e.acc.forEach((a, i) => {
        if (!a) return;
        const ax = hx - RX - 4.5, ay = yAt(top, posOf(e.ds[i], e.low));
        put(ax, () => (a === "sharp" ? sharp(ax, ay) : natural(ax, ay)));
      });
    };
    const heads = (e, hx, top, up, open) => {
      const ps = posList(e);
      const ys = ps.map((p) => yAt(top, p));
      const at = [];
      ps.forEach((p, i) => {
        const second = i && p - ps[i - 1] === 1;
        const nx = second ? hx + (up ? RX * 1.85 : -RX * 1.85) : hx;
        at.push([nx, ys[i]]);
      });
      return { ps, ys, at };
    };
    const sounds = (e, hx, top, hs, draw) => {
      put(hx, draw, {
        pitches: e.ds.map((d, i) => midiOf(d, e.alter[i])),
        heads: hs.at.map(([nx, y]) => [ox + nx, y]),
        at: e.at,
        dur: e.dur,
        // Which hand, and whether it falls on the beat: how hard the
        // piano plays it (`play`).
        low: !!e.low,
        strong: !!e.strong,
      });
    };
    function single(e, top, isLow) {
      const hx = ox + e.x;
      if (e.rest) {
        put(hx, () => rest(hx, top, e.dur));
        return;
      }
      const ps = posList(e);
      const mid = ps.reduce((a, b) => a + b, 0) / ps.length;
      const up = mid < 4;
      const open = e.dur >= 8;
      const hs = heads(e, e.x, top, up, open);
      accidentals(e, hx, top);
      ledgers(hx, ps, top);
      const lo = Math.max(...hs.ys), hi = Math.min(...hs.ys);
      const vx = hx + (up ? RX * 0.92 : -RX * 0.92);
      const tip = up ? hi - GAP * 3.4 : lo + GAP * 3.4;
      const dotted = e.dur === 3 || e.dur === 6 || e.dur === 12;
      const tails = e.dur === 1 ? 2 : e.dur < 4 ? 1 : 0;
      sounds(e, hx, top, hs, () => {
        hs.at.forEach(([nx, y]) => (e.dur >= 16 ? whole(ox + nx, y) : head(ox + nx, y, open)));
        if (e.dur < 16) line(vx, up ? lo : hi, vx, tip, 0.8);
        if (tails) flag(vx, tip, up, tails);
        if (dotted) hs.ps.forEach((p, i) => dot(hx + RX + 3, hs.ys[i] - (p % 2 === 0 ? GAP / 2 : 0)));
      });
    }
    function beamed(list, top, isLow) {
      const ps = list.map((e) => posOf(e.ds[0], e.low));
      const up = ps.reduce((a, b) => a + b, 0) / ps.length < 4;
      const xs = list.map((e) => ox + e.x);
      const ys = ps.map((p) => yAt(top, p));
      const L = GAP * 3.3;
      const sx = xs.map((hx) => hx + (up ? RX * 0.92 : -RX * 0.92));
      let b1 = up ? ys[0] - L : ys[0] + L, b2 = up ? ys[ys.length - 1] - L : ys[ys.length - 1] + L;
      if (Math.abs(b2 - b1) > GAP) b2 = b1 + Math.sign(b2 - b1) * GAP;
      const beamY = (vx) => b1 + (b2 - b1) * (vx - sx[0]) / Math.max(1, sx[sx.length - 1] - sx[0]);
      let shift = 0;
      sx.forEach((vx, i) => { const room = up ? beamY(vx) - (ys[i] - L * 0.8) : (ys[i] + L * 0.8) - beamY(vx); if (room > shift) shift = room; });
      b1 += up ? -shift : shift; b2 += up ? -shift : shift;
      const second = (up ? 1 : -1) * GAP * 0.62;
      list.forEach((e, i) => {
        const hx = xs[i], hy = ys[i], vx = sx[i];
        accidentals(e, hx, top);
        ledgers(hx, [ps[i]], top);
        const dotted = e.dur === 3;
        sounds(e, hx, top, { at: [[e.x, hy]], ys: [hy], ps: [ps[i]] }, () => {
          head(hx, hy, false);
          line(vx, hy, vx, beamY(vx), 0.8);
          if (dotted) dot(hx + RX + 3, hy - (ps[i] % 2 === 0 ? GAP / 2 : 0));
        });
      });
      const last = xs[xs.length - 1];
      put(last, () => {
        beamLine(sx[0], beamY(sx[0]), sx[sx.length - 1], beamY(sx[sx.length - 1]));
        // Semiquavers carry a second beam: between two of them, or as a
        // stub towards the note beside a lone one.
        list.forEach((e, i) => {
          if (e.dur !== 1) return;
          const next = list[i + 1], prev = list[i - 1];
          if (next && next.dur === 1) {
            beamLine(sx[i], beamY(sx[i]) + second, sx[i + 1], beamY(sx[i + 1]) + second);
          } else if (!(prev && prev.dur === 1)) {
            const toward = prev ? -1 : 1;
            const x2 = sx[i] + toward * RX * 2.2;
            beamLine(Math.min(sx[i], x2), beamY(Math.min(sx[i], x2)) + second, Math.max(sx[i], x2), beamY(Math.max(sx[i], x2)) + second);
          }
        });
      });
      if (list[0].trip) {
        const ty = beamY((sx[0] + sx[sx.length - 1]) / 2) + (up ? -GAP * 1.6 : GAP * 1.6);
        put(last, () => tuplet(sx[0], sx[sx.length - 1], ty, "3", up));
      }
      if (list.length >= 3 && random() < 0.35) {
        const sy = Math.max(...ys) + GAP * 1.5, uy = Math.min(...ys) - GAP * 1.5;
        put(last, () => slur(xs[0], up ? sy : uy, last, up ? sy : uy, up));
      }
    }
    draw(bar.melody, tops[0], false);
    if (grand) draw(bar.low, tops[1], true);
  }

  // ============================================================
  // A STAVE: its head (clef, key, time), then as many bars as it holds,
  // justified so the last bar line stands at its end.
  // ============================================================
  function compose(long, grand) {
    const marks = [];
    const tops = grand ? [0, GAP * 10] : [0];
    const put = (x, fn, note) => marks.push(note ? { x, fn, note: true, ...note } : { x, fn, note: false });
    const heads = [];           // every time signature written on it, in order
    const key = keyOf();
    let meter = pick(METERS);
    const ways = pick(key.minor ? MINOR_WAYS : MAJOR_WAYS);
    const tempo = between(TEMPO[0], TEMPO[1]);
    const perUnit = 60 / tempo / 4;           // seconds a semiquaver

    tops.forEach((top, i) => {
      const low = grand && i === 1;
      put(6, () => (low ? bass(8, top) : treble(9, top)));
      const order = key.sharps ? [8, 5, 9, 6, 3] : [4, 7, 3, 6, 2];
      for (let k = 0; k < key.count; k++) {
        const kx = 22 + k * 5, ky = yAt(top, order[k] - (low ? 2 : 0));
        put(kx, () => (key.sharps ? sharp(kx, ky) : flat(kx, ky)));
      }
      // The metre it OPENS in, kept: `meter` itself moves on with every
      // change of time, and read when the mark is drawn it put the last
      // metre at the head of the stave.
      const tx = 26 + key.count * 5, opening = meter.t;
      if (i === 0) heads.push(opening.join("/"));
      put(tx, () => time(opening, tx, top));
    });
    const start = 36 + key.count * 5;
    const room = long - 8 - start;

    // As many bars as fit at their own width, give or take a little.
    const bars = [];
    let used = 0, from = 4;
    for (let m = 0; m < 12; m++) {
      const change = m && random() < 0.22 ? pick(METERS.filter((one) => one !== meter)) : null;
      const theMeter = change || meter;
      const bar = composeBar(key, theMeter, ways[m % ways.length], grand, false, from);
      bar.meter = theMeter;
      bar.change = !!change;
      layBar(bar);
      const w = bar.width + (change ? 14 : 0);
      if (used + w > room / 0.9 && bars.length) break;
      bars.push(bar);
      used += w;
      from = bar.end;
      meter = theMeter;
      if (used > room) break;
    }
    // The last bar comes home, where there is more than one: written
    // again on the key's own chord. A stave of one bar is a bar of the
    // music going on, not a close.
    if (bars.length > 1) {
      const ending = bars[bars.length - 1];
      const home = composeBar(key, ending.meter, 0, grand, true, bars[bars.length - 2].end);
      home.meter = ending.meter;
      home.change = ending.change;
      layBar(home);
      bars[bars.length - 1] = home;
    }
    used = bars.reduce((n, b) => n + b.width + (b.change ? 14 : 0), 0);
    const stretch = Math.max(0.8, Math.min(1.9, room / used));

    // Laid out along the stave, and timed.
    const edges = [start];
    const times = [];
    let x = start, clock = 0;
    bars.forEach((bar) => {
      if (bar.change) {
        heads.push(bar.meter.t.join("/"));
        const tx = x + 8;
        tops.forEach((top) => put(tx, () => time(bar.meter.t, tx, top)));
        x += 14;
      }
      bar.melody.concat(bar.low).forEach((e) => {
        e.x = e.x * stretch;
        e.at = clock + e.t * perUnit;
      });
      const ox = x;
      engrave(bar, ox, tops, grand, put);
      const seconds = bar.units * perUnit;
      // Where the playhead is, through the bar: onset by onset.
      const onsets = [...new Set(bar.melody.concat(bar.low).map((e) => e.t))].sort((a, b) => a - b);
      const map = [[clock, x]].concat(onsets.map((t) => {
        const e = bar.melody.concat(bar.low).find((one) => one.t === t);
        return [clock + t * perUnit, ox + e.x];
      }));
      x += bar.width * stretch;
      map.push([clock + seconds, x]);
      times.push(map);
      clock += seconds;
      edges.push(x);
    });
    const sum = (list) => Math.round(list.reduce((n, e) => n + e.dur, 0) * 1000) / 1000;
    const info = {
      key: { sig: key.sig.slice(), minor: key.minor, tonic: key.tonic },
      written: heads.slice(),
      bars: bars.map((bar) => ({
        meter: bar.meter.t.join("/"), units: bar.units,
        right: sum(bar.melody), left: grand ? sum(bar.low) : null,
        pitches: bar.melody.concat(bar.low).filter((e) => !e.rest).map((e) => e.ds.map((d, i) => midiOf(d, e.alter[i]))),
      })),
    };
    // WHAT IT SOUNDS LIKE: every note on it, in the order it sounds, with
    // how long it is held — read off the very marks that are drawn, so
    // what is heard is what is written, note for note.
    const music = marks.filter((m) => m.note)
      .map((m) => ({ at: m.at, secs: m.dur * perUnit, pitches: m.pitches, low: m.low, strong: m.strong, mark: m }))
      .sort((p, q) => p.at - q.at || (p.low ? 1 : 0) - (q.low ? 1 : 0));
    return { marks, tops, bars: edges.slice(1, -1), edges, times, length: clock, end: x, info, music,
      beat: 60 / tempo, tall: grand ? GAP * 14 : GAP * 4 };
  }

  // ============================================================
  // THE SCORE: staves down the page, in the page's own coordinates,
  // made as far down as the page reaches.
  // ============================================================
  let width = 0, height = 0;
  let staves = [];
  let madeTo = 0;
  let order = 0;

  const margin = () => Math.max(0, (width - COLUMN) / 2);

  function more(to) {
    const room = margin();
    const wide = room > 150;
    while (madeTo < to) {
      const y = madeTo + between(-20, 20);
      // Further apart where they stand behind the writing.
      madeTo += wide ? EVERY : EVERY * 1.7;
      // In the margins, left and right in turn; across the window,
      // quietly, where there are none.
      const side = order % 2;
      const long = wide ? Math.min(room - 40, 300) : Math.min(width - 32, 420);
      const x0 = wide ? (side ? width - room + (room - long) / 2 : (room - long) / 2) : (width - long) / 2;
      const grand = random() < 0.28;
      const score = compose(long, grand);
      staves.push({ x0, y, long: score.end + 8, ...score, seen: null,
        quiet: wide ? 1 : QUIET, turn: order });
      order++;
    }
  }

  function build() {
    seed = 77013;
    staves = [];
    madeTo = 260;
    order = 0;
    more(document.documentElement.scrollHeight + EVERY);
  }

  function size() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = Math.min(window.innerWidth < 700 ? 1.5 : 2, window.devicePixelRatio || 1);
    const same = w === width;
    width = w; height = h;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ink.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!same) build();
  }

  let handX = -99999, handY = -99999;

  /** Where the playhead stands, on the stave, at `t` seconds into it. */
  function headAt(s, t) {
    for (const map of s.times) {
      if (t > map[map.length - 1][0]) continue;
      for (let i = 1; i < map.length; i++) {
        if (t <= map[i][0]) {
          const a = map[i - 1], b = map[i];
          return a[1] + (b[1] - a[1]) * ((t - a[0]) / Math.max(1e-6, b[0] - a[0]));
        }
      }
    }
    return -1;
  }

  function draw(clock) {
    if (!width) return;
    ink.clearRect(0, 0, width, height);
    const scroll = window.scrollY;
    // The page grows as parts are opened; the score keeps up.
    if (document.documentElement.scrollHeight + EVERY > madeTo) more(document.documentElement.scrollHeight + EVERY);
    staves.forEach((s) => {
      const top = s.y - scroll;
      if (top > height + 40 || top + s.tall < -60) return;
      if (s.seen === null) s.seen = REDUCE_MOTION ? -99 : clock;
      const since = clock - s.seen;
      const reach = REDUCE_MOTION ? s.long : s.long * ease(since / WRITE);
      // THE PLAYHEAD: once written, along the stave at its own tempo, the
      // staves taking turns so only a few are playing at once — in
      // silence. The stave under the hand, with the sound on, is the one
      // that is HEARD, and its playhead is where the piano is, read off
      // the sound's own clock (`heardAt`).
      let head = -1, now = -1;
      const heard = player && player.s === s ? heardAt() : null;
      if (heard !== null) {
        if (heard >= 0 && heard < s.length) { now = heard; head = headAt(s, heard); }
      } else {
        const silent = since - WRITE - (s.turn % 3) * 1.4;
        if (!REDUCE_MOTION && silent > 0) {
          const t = silent % (s.length + 3);
          if (t < s.length) { now = t; head = headAt(s, t); }
        }
      }
      const q = s.quiet;
      ink.strokeStyle = "rgba(" + BLUE + "," + (LINE * q).toFixed(3) + ")";
      s.tops.forEach((t) => {
        for (let k = 0; k < 5; k++) line(s.x0, top + t + k * GAP, s.x0 + reach, top + t + k * GAP, 0.7);
      });
      const foot = top + s.tops[s.tops.length - 1] + 4 * GAP;
      s.bars.forEach((bx) => { if (bx <= reach) line(s.x0 + bx, top, s.x0 + bx, foot, 0.7); });
      if (s.tops.length > 1 && reach > 8) {
        line(s.x0, top, s.x0, foot, 0.7);
        ink.lineWidth = 1.2;
        ink.beginPath();
        const bx = s.x0 - 5, mid = (top + foot) / 2;
        ink.moveTo(bx + 3, top);
        ink.bezierCurveTo(bx - 3, top + 8, bx + 3, mid - 10, bx - 3, mid);
        ink.bezierCurveTo(bx + 3, mid + 10, bx - 3, foot - 8, bx + 3, foot);
        ink.stroke();
      }
      if (reach >= s.long - 8) {
        line(s.x0 + s.end - 3, top, s.x0 + s.end - 3, foot, 0.7);
        line(s.x0 + s.end, top, s.x0 + s.end, foot, 2);
      }
      // The playhead itself, a hairline.
      if (head >= 0) {
        ink.strokeStyle = "rgba(" + BLUE + "," + ((heard !== null ? 0.34 : 0.12) * q).toFixed(3) + ")";
        line(s.x0 + head, top - GAP * 2, s.x0 + head, foot + GAP * 2, 0.8);
      }
      ink.save();
      ink.translate(s.x0, top);
      s.marks.forEach((m) => {
        if (m.x > reach) return;
        let a = NOTE;
        if (m.note && now >= 0 && m.at <= now) {
          // Played: a lift that dies away after it sounds.
          const ago = now - m.at;
          if (ago < RING) a += PLAYED * (1 - ago / RING);
        }
        if (m.note && handX > -9000) {
          const d = Math.hypot(handX - (s.x0 + m.x), handY - (top + s.tall / 2));
          if (d < HAND) a += HANDED * (1 - d / HAND);
        }
        ink.fillStyle = ink.strokeStyle = "rgba(" + BLUE + "," + Math.min(STRONGEST, a * q).toFixed(3) + ")";
        m.fn();
      });
      ink.restore();
    });
  }

  // ============================================================
  // THE PIANO — A REAL ONE. The owner, 2026-09-27: "the music playing in
  // Qimu & musicians sounds aweful. please fix that, make it sound good.
  // make it also sound like the actual notes on screen ... I want it to
  // sound like an actual composition. Additionally, I want it to make the
  // sound only if you hover that particlar set of lines."
  //
  // THE SOUND IS A RECORDED GRAND PIANO, not one made up here: seventeen
  // notes of the Salamander Grand Piano (Alexander Holm's recording of a
  // Yamaha C5, CC BY 3.0 — credited at the foot of the page), a minor
  // third apart from C2 to C6, in audio/piano/. A note between two of
  // them is the nearest one played a semitone or so higher or lower,
  // which is how a sampled piano is always made. They are fetched only
  // once the sound is turned on. (The piano before this was a waveform
  // with a piano's overtones, struck through a filter — an organ with a
  // click, which is what "aweful" was about.) Until they have arrived —
  // or if they cannot be — a softer made-up voice (`synth`) stands in, so
  // there is never silence where there should be a note.
  //
  // WHAT IS PLAYED IS THE STAVE, AS IT IS WRITTEN. Pointing at one set of
  // lines plays THAT stave from its first note — every note and chord of
  // it, both hands of a braced pair, each at its own place in the bar and
  // held for its own length, at the stave's own tempo — with its playhead
  // going along it at the piano's own time, and the notes lifting as they
  // sound. The tune is played a little louder than what is under it, the
  // notes on the beat a little louder than the ones between, and the
  // left hand softest, as a pianist would. At the end it breathes for a
  // beat and plays it again, for as long as the hand is on it. Take the
  // hand off the lines and the piano stops, its notes damped rather than
  // cut. On a phone a tap on a stave plays it through once.
  //
  // It starts silent: a browser will not let a page make a sound until it
  // has been pressed, so the square button at the top of the page is how
  // the sound is turned on, and off again.
  // ============================================================
  const PIANO = [["C2", 36], ["Ds2", 39], ["Fs2", 42], ["A2", 45], ["C3", 48], ["Ds3", 51], ["Fs3", 54],
    ["A3", 57], ["C4", 60], ["Ds4", 63], ["Fs4", 66], ["A4", 69], ["C5", 72], ["Ds5", 75], ["Fs5", 78],
    ["A5", 81], ["C6", 84]];
  const LOOK = 0.2;                // seconds of music scheduled ahead of the sound's clock
  const LEAD = 0.08;               // seconds between the hand arriving and the first note
  const OVERLAP = 0.03;            // legato: a note let go a hair after the next is struck
  const LOUD = { tune: 0.82, between: 0.62, under: 0.4, left: 0.34 };
  const PAD = GAP * 2.5;           // px round a stave's lines that count as on it

  let sound = false;
  let audio = null;
  let loading = null;
  const bank = new Map();          // midi → decoded recording

  /** The room: a short, soft hall of the page's own making — two
      channels of noise, each smoothed and falling away over two
      seconds, so the dry recording has somewhere to ring. */
  function hall(ctx) {
    const long = Math.round(ctx.sampleRate * 2.2);
    const tail = ctx.createBuffer(2, long, ctx.sampleRate);
    const gap = Math.round(ctx.sampleRate * 0.012);
    for (let ch = 0; ch < 2; ch++) {
      const data = tail.getChannelData(ch);
      let smooth = 0;
      for (let i = gap; i < long; i++) {
        const k = (i - gap) / (long - gap);
        // Darker as it dies away, as a room's air takes the top off it.
        const soft = 0.35 + 0.5 * k;
        smooth += (Math.random() * 2 - 1 - smooth) * (1 - soft);
        data[i] = smooth * Math.pow(1 - k, 2.6) * 1.6;
      }
    }
    return tail;
  }

  function wake() {
    if (!audio) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const out = ctx.createGain();
      out.gain.value = 1.25;
      const squeeze = ctx.createDynamicsCompressor();
      squeeze.threshold.value = -14;
      squeeze.knee.value = 12;
      squeeze.ratio.value = 2.5;
      squeeze.attack.value = 0.01;
      squeeze.release.value = 0.25;
      out.connect(squeeze).connect(ctx.destination);
      const room = ctx.createConvolver();
      room.buffer = hall(ctx);
      const wet = ctx.createGain();
      wet.gain.value = 0.16;
      room.connect(wet).connect(out);
      audio = { ctx, out, room };
    }
    if (audio.ctx.state === "suspended") audio.ctx.resume();
    return audio;
  }

  /** The seventeen recordings, fetched once, the first time the sound is
      turned on. What fails to arrive is simply not in the bank. */
  function load() {
    if (loading) return loading;
    const a = wake();
    if (!a || !window.fetch) return (loading = Promise.resolve());
    const root = window.SITE_ROOT || "../";
    loading = Promise.all(PIANO.map(([name, midi]) =>
      fetch(root + "audio/piano/" + name + ".mp3")
        .then((answer) => { if (!answer.ok) throw new Error(name); return answer.arrayBuffer(); })
        .then((bytes) => new Promise((done, fail) => a.ctx.decodeAudioData(bytes, done, fail)))
        .then((recording) => { bank.set(midi, recording); })
        .catch(() => {})));
    return loading;
  }

  /** The recording nearest a note, and how far it has to be moved. */
  function nearest(midi) {
    let best = null, far = 99;
    bank.forEach((recording, at) => {
      const d = Math.abs(midi - at);
      if (d < far || (d === far && at > best.at)) { far = d; best = { recording, at }; }
    });
    return far <= 3 ? best : null;
  }

  /** A made-up voice, for a note whose recording is not there: a few
      pure partials, the higher ones dying sooner, as a string's do. */
  function synth(midi, when, secs, loud, voices) {
    const { ctx, out, room } = audio;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const ring = Math.max(0.8, Math.min(3.5, 2 * Math.pow(2, (60 - midi) / 18)));
    const voice = ctx.createGain();
    voice.gain.value = 0;
    const off = when + Math.max(0.12, secs) + OVERLAP;
    [[1, 1], [2, 0.42], [3, 0.2], [4, 0.1], [5, 0.05]].forEach(([n, part]) => {
      const tone = ctx.createOscillator();
      tone.type = "sine";
      tone.frequency.value = f * n * (1 + 0.0004 * n * n);
      const level = ctx.createGain();
      level.gain.setValueAtTime(0, when);
      level.gain.linearRampToValueAtTime(loud * part * 0.5, when + 0.004);
      level.gain.setTargetAtTime(0, when + 0.004, ring / (n * 1.6));
      tone.connect(level).connect(voice);
      tone.start(when);
      tone.stop(off + 0.6);
    });
    voice.gain.setValueAtTime(1, when);
    voice.gain.setValueAtTime(1, off);
    voice.gain.setTargetAtTime(0, off, 0.08);
    voice.connect(out);
    voice.connect(room);
    voices.push({ gain: voice.gain, stop: (t) => {}, off });
  }

  /** ONE NOTE of the score, from `when` for `secs`, at `loud`. */
  function key(midi, when, secs, loud, voices) {
    const near = nearest(midi);
    if (!near) { synth(midi, when, secs, loud, voices); return; }
    const { ctx, out, room } = audio;
    const string = ctx.createBufferSource();
    string.buffer = near.recording;
    string.playbackRate.value = Math.pow(2, (midi - near.at) / 12);
    const damper = ctx.createGain();
    // Held for as long as it is written, then the damper comes down —
    // faster up the keyboard, where the strings are short, than down it.
    const off = when + Math.max(0.12, secs) + OVERLAP;
    const fall = midi < 52 ? 0.16 : midi < 64 ? 0.11 : 0.08;
    damper.gain.setValueAtTime(loud, when);
    damper.gain.setValueAtTime(loud, off);
    damper.gain.setTargetAtTime(0, off, fall);
    string.connect(damper);
    damper.connect(out);
    damper.connect(room);
    string.start(when);
    string.stop(off + fall * 8);
    voices.push({ gain: damper.gain, stop: (t) => string.stop(t), off });
  }

  // ============================================================
  // THE PLAYER: one stave at a time, the one under the hand.
  // ============================================================
  let player = null;               // { s, start, lap, next, once, voices }
  const heardLog = [];             // for the tests: what the piano was asked to play
  const period = (s) => s.length + s.beat;

  /** Where the piano is on the playing stave, in seconds from its start
      (below nought before the first note; past its length in the breath). */
  function heardAt() {
    if (!player || !audio) return null;
    const t = audio.ctx.currentTime - player.start;
    if (t < 0) return -1;
    return player.once ? t : t % period(player.s);
  }

  /** Everything due in the next moment, handed to the sound's own clock,
      so the timing is the sound card's and not the page's. */
  function pump() {
    if (!player || !audio) return;
    const now = audio.ctx.currentTime;
    const p = player, list = p.s.music;
    if (!list.length) return;
    for (let n = 0; n < 400; n++) {
      if (p.next >= list.length) {
        if (p.once) {
          if (now > p.start + p.s.length + 1) stop();
          return;
        }
        p.lap++; p.next = 0;
      }
      const note = list[p.next];
      const when = p.start + p.lap * period(p.s) + note.at;
      if (when > now + LOOK) break;
      p.next++;
      if (when < now - 0.02) continue;
      // A little of a hand in it: the notes of a chord a hair apart from
      // the bottom up, and each a shade louder or softer than the last.
      const base = note.low ? LOUD.left
        : note.pitches.length > 1 ? LOUD.under
        : note.strong ? LOUD.tune : LOUD.between;
      const chord = note.pitches.slice().sort((x, y) => x - y);
      chord.forEach((midi, i) => {
        const top = !note.low && i === chord.length - 1;
        const loud = (top && chord.length > 1 ? LOUD.tune : base) * (0.94 + Math.random() * 0.1);
        key(midi, when + i * 0.009, note.secs, loud, p.voices);
      });
      heardLog.push({ stave: staves.indexOf(p.s), at: note.at, pitches: note.pitches.slice(), lap: p.lap });
    }
    // What has been let go of for good is forgotten.
    if (p.voices.length > 200) p.voices = p.voices.filter((v) => v.off > now - 2);
  }

  function play(s, once) {
    if (!sound || !s || !s.music.length) return;
    if (player && player.s === s) { if (!once) player.once = false; return; }
    stop();
    const a = wake();
    if (!a) return;
    load();
    player = { s, start: a.ctx.currentTime + LEAD, lap: 0, next: 0, once: !!once, voices: [] };
    document.documentElement.dataset.qimuPlaying = String(staves.indexOf(s));
    pump();
  }

  /** The hand is off the lines: every note still sounding is damped, and
      every note not yet begun is never begun. */
  function stop() {
    if (!player) return;
    const now = audio ? audio.ctx.currentTime : 0;
    player.voices.forEach((v) => {
      try {
        v.gain.cancelScheduledValues(now);
        v.gain.setValueAtTime(v.gain.value, now);
        v.gain.setTargetAtTime(0, now, 0.07);
        v.stop(now + 0.6);
      } catch (e) { /* already stopped */ }
    });
    player = null;
    delete document.documentElement.dataset.qimuPlaying;
  }
  window.setInterval(pump, 50);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });

  /** The stave whose lines the hand is on, if any. */
  function staveUnder(x, y) {
    const scroll = window.scrollY;
    for (const s of staves) {
      const top = s.y - scroll;
      if (y < top - PAD || y > top + s.tall + PAD) continue;
      if (x < s.x0 - 8 || x > s.x0 + s.long + 8) continue;
      if (s.seen === null) continue;
      return s;
    }
    return null;
  }

  // THE BUTTON, at the top of the page: a square, plainly marked, saying
  // whether the staves sound.
  const button = document.createElement("button");
  button.type = "button";
  button.className = "qimu-sound";
  button.setAttribute("aria-pressed", "false");
  button.innerHTML =
    '<span class="qimu-sound-say">Sound off</span>' +
    '<span class="qimu-sound-box" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="22" height="22">' +
        '<path class="qimu-sound-horn" d="M4 9.5h3.6L12 5.6v12.8l-4.4-3.9H4z"/>' +
        '<path class="qimu-sound-waves" d="M15.2 9.2a4 4 0 0 1 0 5.6M17.6 6.8a7.4 7.4 0 0 1 0 10.4"/>' +
        '<path class="qimu-sound-cross" d="M15.4 9.4l5.2 5.2M20.6 9.4l-5.2 5.2"/>' +
      "</svg>" +
    "</span>";
  document.body.appendChild(button);
  const say = button.querySelector(".qimu-sound-say");
  function setSound(on) {
    sound = on;
    if (!on) stop();
    button.classList.toggle("is-on", on);
    button.setAttribute("aria-pressed", String(on));
    say.textContent = on ? "Sound on" : "Sound off";
    button.setAttribute("aria-label", on ? "Sound on: press to mute the music" : "Sound off: press to hear a stave played when you point at it");
    document.documentElement.dataset.qimuSound = on ? "on" : "off";
  }
  button.addEventListener("click", () => {
    setSound(!sound);
    // Turned on, it answers: once the piano has arrived, a soft chord —
    // so the press is heard to have worked.
    if (sound) {
      const a = wake();
      if (!a) return;
      load().then(() => {
        if (!sound || player) return;
        const t = a.ctx.currentTime + 0.03, v = [];
        [48, 55, 64, 67].forEach((m, i) => key(m, t + i * 0.012, 1.4, 0.26, v));
      });
    }
  });
  setSound(false);

  // ============================================================
  // KEEPING UP
  // ============================================================
  function follow(x, y, tap) {
    if (!sound) return;
    const s = staveUnder(x, y);
    if (s) play(s, tap);
    else if (!tap || player) stop();
  }
  window.addEventListener("pointermove", (event) => {
    handX = event.clientX; handY = event.clientY;
    if (event.pointerType !== "touch") follow(handX, handY, false);
    if (REDUCE_MOTION) draw(0);
  }, { passive: true });
  window.addEventListener("pointerdown", (event) => {
    handX = event.clientX; handY = event.clientY;
    if (event.target.closest && event.target.closest(".qimu-sound")) return;
    follow(handX, handY, event.pointerType === "touch");
  }, { passive: true });
  // The page scrolled under a hand that did not move: the lines under it
  // are other lines.
  window.addEventListener("scroll", () => {
    if (handX > -9000 && sound && !(player && player.once)) follow(handX, handY, false);
    if (REDUCE_MOTION) draw(0);
  }, { passive: true });
  document.addEventListener("pointerleave", () => { handX = -99999; handY = -99999; if (!(player && player.once)) stop(); });
  window.addEventListener("resize", () => { size(); if (REDUCE_MOTION) draw(0); });

  size();

  // FOR THE TESTS, like the Houses view's `census`: every stave's bars —
  // its metre, and how long what is written in each of its staves lasts —
  // where its notes stand on the window, with their pitches; where each
  // stave stands on the window; the music each one plays, in order; and
  // what the piano has been asked to play.
  window.QimuScore = {
    staves: () => staves.map((s) => ({ grand: s.tops.length > 1, ...s.info })),
    boxes: () => staves.map((s, i) => ({ i, x: s.x0, y: s.y - window.scrollY, w: s.long, h: s.tall, written: s.seen !== null })),
    music: (i) => staves[i].music.map((n) => ({ at: n.at, secs: n.secs, pitches: n.pitches.slice(), low: n.low })),
    heard: () => heardLog.slice(),
    samples: () => [...bank.keys()],
    notes: () => {
      const scroll = window.scrollY;
      const out = [];
      staves.forEach((s) => s.marks.forEach((m) => {
        if (!m.note || m.x > s.long) return;
        const [hx, hy] = m.heads[0];
        out.push({ x: s.x0 + hx, y: s.y - scroll + hy, pitches: m.pitches });
      }));
      return out;
    },
  };

  if (REDUCE_MOTION) {
    draw(0);
  } else {
    const began = performance.now();
    (function frame(now) {
      pump();
      draw((now - began) / 1000);
      requestAnimationFrame(frame);
    })(performance.now());
  }
})();

// ============================================================
// QIMU & MUSICIANS — houses/qimu-and-musicians.html
//
// The ninth house, a house of music, and until 2026-09-25 it had no
// ground of its own. The owner: "add some complex notes; and some 5
// lines in which they will exist. I dont wan tit to be sloppy or out of
// place, and I want them to be nicely animated ... Overall the Qimu and
// musicians effect should be subtle though, I dont want it to take over
// the page." And the page is blue: "semi light blue" (`.qimu-page` in
// style.css).
//
// Then, 2026-09-26: "i want there to be a button on top that allows you
// to mute and unmute. it should be a square and relatively obvious. I
// also want you whn you hover the notes in qimu and musicians, it plays
// them as piano notes."
//
// And then, 2026-09-28: "actually find sheet music from some obscure
// piano pieces and display that. I also want you to give their name when
// hovering that piece in a light font underneath the sheet music."
//
// WHAT IT IS: short STAVES standing in the margins either side of the
// writing, one under another down the whole length of the page — a
// score kept in the margins — and each of them THE OPENING OF A REAL
// PIECE, note for note as its score has it: eighteen piano pieces by
// Polish composers of the first half of the nineteenth century whom
// hardly anyone plays now — Maria Szymanowska's preludes and a caprice,
// Władysław Żeleński, Józef Krogulski, Józef Elsner, Franciszek Mirecki's
// krakowiaks, Wojciech Sowiński, Kasper Napoleon Wysocki — out of Polish
// Music Heritage in Open Access (polishscores.org, © The Fryderyk Chopin
// Institute, CC BY 4.0, credited at the foot of the page). They are in
// qimu-pieces.js, written by tools/qimu-pieces.py from the scores
// themselves. A stave carries the piece's key and time signatures and as
// many of its opening bars as it has room for — the right hand alone, or
// both hands on a braced pair — with every accidental, beam, tie and
// slur the score has. (Until then the music was made up here, a bar at a
// time, in a key and a metre; that composer is gone.)
//
// ITS NAME, when the hand is on it: the piece and its composer, under
// the stave, in a light face (`NAME_*`), coming up and going again.
//
// POINTING AT A STAVE PLAYS IT — that stave, from its first note, as it
// is written, both hands, in time, on a recorded grand piano (`key`,
// `play`), and only while the hand is on its lines. A tap plays a stave
// through once on a phone. It starts silent: a browser will not let a
// page make a sound until it has been pressed, so the square button at
// the top of the page (`.qimu-sound`) is how the sound is turned on, and
// off again.
//
// NICELY ANIMATED, and quietly:
//   WRITTEN IN  a stave is written left to right, as a pen would, the
//               first time it comes into the window;
//   PLAYED      then a faint playhead passes along it at the piece's own
//               tempo, and each note it reaches LIFTS — a little
//               stronger, for a moment — as a note sounds and dies away
//               (in silence, unless it is the stave under the hand with
//               the sound on, whose playhead is where the piano is). The
//               staves play one after another rather than all at once;
//   THE HAND    and the notes near the pointer stand a shade stronger.
//
// IT LIVES DOWN THE DOCUMENT, not on the window: a score is read down
// the page, and staves that stayed put while the writing scrolled past
// them would read as a screen rather than as music. So the canvas is
// fixed and the staves are carried in the page's own coordinates, as
// Pineward's wood is. On a window without margins the staves are drawn
// across it at QUIET, behind the writing.
//
// WITHOUT THIS SCRIPT (or without qimu-pieces.js) the page is exactly
// what it was before it, with no button: there is nothing to play.
// ============================================================
(function () {
  const canvas = document.querySelector(".human-field");
  if (!canvas) return;
  const ink = canvas.getContext("2d");
  if (!ink) return;
  const PIECES = window.QIMU_PIECES || [];
  if (!PIECES.length) return;

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
  const RING = 0.9;                // seconds a played note takes to die away
  const HAND = 90;
  const GRAND = 0.55;              // how many staves are a braced pair, both hands

  // A STAVE'S NAME, under it while the hand is on it.
  const NAME = 0.56;               // how strong: the title, and the composer a little less
  const NAME_PX = 10.5;
  const NAME_FONT = "300 " + NAME_PX + "px Archivo, 'Helvetica Neue', Arial, sans-serif";
  const NAME_IN = 0.12;            // how much of the way it comes up a frame

  let seed = 77013;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  // ============================================================
  // THE ENGRAVER — from here to "THE ENGRAVER ENDS", word for word the
  // same in qimu.js and motifs.js. The two pages engrave the same music
  // and no page script knows about another, so it is written twice, and a
  // test keeps the two the same: a fix to one is a fix to both. What is
  // outside it is each page's own — the size of a stave (`GAP`), where the
  // staves stand, and how they are drawn and played.
  //
  // THE MUSIC is `QIMU_PIECES` (qimu-pieces.js): the openings of eighteen
  // piano pieces hardly anyone plays now, note for note as their scores
  // have them. A PITCH is a STEP — how many letters above middle C (C4 is
  // 0, D4 1, C5 7, B3 −1) — and an ALTER (−1 a flat, 1 a sharp), printed
  // where the step stands on its stave with whatever sign the score puts
  // before it. Everything is drawn in paths, because a music font cannot
  // be counted on.
  // ============================================================
  const RX = GAP * 0.6, RY = GAP * 0.42;
  const yAt = (top, p) => top + 4 * GAP - p * GAP / 2;   // p: 0 the bottom line, 8 the top
  const mLine = (c, x1, y1, x2, y2, w) => { c.lineWidth = w || 1; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); };
  function mHead(c, x, y, open) {
    c.beginPath();
    c.ellipse(x, y, RX, RY, -0.35, 0, Math.PI * 2);
    if (open) { c.lineWidth = 1; c.stroke(); } else c.fill();
  }
  function mWhole(c, x, y) {
    c.lineWidth = 1.2;
    c.beginPath();
    c.ellipse(x, y, RX * 1.15, RY * 1.05, 0, 0, Math.PI * 2);
    c.stroke();
  }
  function mBeamLine(c, x1, y1, x2, y2) {
    c.beginPath();
    c.moveTo(x1, y1 - 1.1); c.lineTo(x2, y2 - 1.1); c.lineTo(x2, y2 + 1.1); c.lineTo(x1, y1 + 1.1);
    c.closePath();
    c.fill();
  }
  function mFlag(c, x, y, up, n) {
    c.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const y0 = y + (up ? 1 : -1) * i * GAP * 0.6;
      c.beginPath();
      c.moveTo(x, y0);
      c.bezierCurveTo(x + GAP * 0.9, y0 + (up ? 1 : -1) * GAP * 0.8, x + GAP * 0.9, y0 + (up ? 1 : -1) * GAP * 1.6, x + GAP * 0.5, y0 + (up ? 1 : -1) * GAP * 2.2);
      c.stroke();
    }
  }
  function mDot(c, x, y) {
    c.beginPath(); c.arc(x, y, 1.1, 0, Math.PI * 2); c.fill();
  }
  function mSharp(c, x, y) {
    mLine(c, x - 1.3, y - GAP * 1.2, x - 1.3, y + GAP * 1.3, 0.8);
    mLine(c, x + 1.3, y - GAP * 1.35, x + 1.3, y + GAP * 1.15, 0.8);
    mLine(c, x - 2.6, y - GAP * 0.35 + 0.9, x + 2.6, y - GAP * 0.35 - 0.9, 1.6);
    mLine(c, x - 2.6, y + GAP * 0.4 + 0.9, x + 2.6, y + GAP * 0.4 - 0.9, 1.6);
  }
  function mFlat(c, x, y) {
    mLine(c, x - 1.6, y - GAP * 1.8, x - 1.6, y + GAP * 0.5, 0.9);
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(x - 1.6, y + GAP * 0.5);
    c.bezierCurveTo(x + 4, y - GAP * 0.1, x + 2.2, y - GAP * 0.9, x - 1.6, y - GAP * 0.1);
    c.stroke();
  }
  function mNatural(c, x, y) {
    mLine(c, x - 1.4, y - GAP * 1.3, x - 1.4, y + GAP * 0.5, 0.8);
    mLine(c, x + 1.4, y - GAP * 0.5, x + 1.4, y + GAP * 1.3, 0.8);
    mLine(c, x - 1.4, y - GAP * 0.3 + 0.7, x + 1.4, y - GAP * 0.3 - 0.7, 1.5);
    mLine(c, x - 1.4, y + GAP * 0.35 + 0.7, x + 1.4, y + GAP * 0.35 - 0.7, 1.5);
  }
  /** A rest worth `value` semiquavers, standing where rests stand; a
      whole bar's rest is a semibreve's, whatever the bar. */
  function mRest(c, x, top, value, dotted) {
    const y = top + GAP * 2;
    const eighth = (ex, ey, tails) => {
      for (let i = 0; i < tails; i++) {
        const dy = i * GAP;
        c.beginPath(); c.arc(ex - 1.4 - i * 0.9, ey - GAP * 0.55 + dy, 1.3, 0, Math.PI * 2); c.fill();
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(ex - 1.4 - i * 0.9, ey - GAP * 0.55 + dy); c.quadraticCurveTo(ex, ey - GAP * 0.35 + dy, ex + 1.6 - i * 0.9, ey - GAP * 0.8 + dy); c.stroke();
      }
      mLine(c, ex + 1.6, ey - GAP * 0.8, ex - 0.9 - (tails - 1) * 0.9, ey + GAP * (0.9 + (tails - 1) * 0.8), 1);
    };
    if (value >= 16) c.fillRect(x - 3.5, top + GAP, 7, GAP * 0.5);
    else if (value >= 8) c.fillRect(x - 3.5, y - GAP * 0.5, 7, GAP * 0.5);
    else if (value >= 4) {
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(x - 1.3, y - GAP * 1.5); c.lineTo(x + 1.9, y - GAP * 0.7); c.lineTo(x - 1.3, y + GAP * 0.1);
      c.lineTo(x + 1.9, y + GAP * 0.8); c.quadraticCurveTo(x - 2.6, y + GAP * 0.9, x, y + GAP * 1.6);
      c.stroke();
    } else if (value >= 2) eighth(x, y, 1);
    else if (value >= 1) eighth(x, y, 2);
    else eighth(x, y, 3);
    if (dotted) mDot(c, x + 5, y - GAP * 0.5);
  }
  /** A slur from one note to another, bowed clear of every note between
      them: its middle at least as far out as `clear`. */
  function mSlur(c, x1, y1, x2, y2, below, clear) {
    const lift = (below ? 1 : -1) * Math.min(GAP * 1.6, 4 + (x2 - x1) * 0.12);
    let a = y1 + lift, b = y2 + lift;
    if (clear !== undefined) {
      const k = (8 * clear - y1 - y2) / 6, now = (a + b) / 2;
      if (below ? k > now : k < now) { a += k - now; b += k - now; }
    }
    c.lineWidth = 0.9;
    c.beginPath();
    c.moveTo(x1, y1);
    c.bezierCurveTo(x1 + (x2 - x1) * 0.25, a, x1 + (x2 - x1) * 0.75, b, x2, y2);
    c.stroke();
  }
  /** A tie: a short, flat bow from one head to the same note after it. */
  function mTie(c, x1, x2, y, below) {
    const lift = (below ? 1 : -1) * Math.min(GAP * 0.9, 2 + (x2 - x1) * 0.1);
    c.lineWidth = 0.9;
    c.beginPath();
    c.moveTo(x1, y);
    c.bezierCurveTo(x1 + (x2 - x1) * 0.2, y + lift, x1 + (x2 - x1) * 0.8, y + lift, x2, y);
    c.stroke();
  }
  function mText(c, t, x, y, px, style) {
    c.font = (style || "bold") + " " + px + "px Georgia, 'Times New Roman', serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(t, x, y);
  }
  function mTime(c, t, x, top) {
    mText(c, t[0], x, top + GAP, GAP * 2.1);
    mText(c, t[1], x, top + GAP * 3, GAP * 2.1);
  }
  function mTreble(c, x, top) {
    const G = GAP;
    c.lineWidth = 1.1;
    c.beginPath();
    c.moveTo(x - 0.35 * G, top + 5.4 * G);
    c.quadraticCurveTo(x + 0.4 * G, top + 5.8 * G, x + 0.2 * G, top + 4.6 * G);
    c.lineTo(x - 0.05 * G, top - 1.2 * G);
    c.bezierCurveTo(x + 0.1 * G, top - 2.2 * G, x + 0.9 * G, top - 1.4 * G, x + 0.3 * G, top - 0.2 * G);
    c.bezierCurveTo(x - 0.4 * G, top + 1.0 * G, x - 1.0 * G, top + 1.9 * G, x - 0.9 * G, top + 2.9 * G);
    c.bezierCurveTo(x - 0.8 * G, top + 4.0 * G, x + 0.9 * G, top + 4.0 * G, x + 0.9 * G, top + 3.0 * G);
    c.bezierCurveTo(x + 0.9 * G, top + 2.1 * G, x - 0.3 * G, top + 2.0 * G, x - 0.25 * G, top + 2.9 * G);
    c.stroke();
    c.beginPath(); c.arc(x - 0.35 * G, top + 5.3 * G, 0.3 * G, 0, Math.PI * 2); c.fill();
  }
  function mBass(c, x, top) {
    const G = GAP;
    c.lineWidth = 1.3;
    c.beginPath();
    c.moveTo(x - 0.5 * G, top + 1.0 * G);
    c.bezierCurveTo(x - 0.5 * G, top - 0.1 * G, x + 1.1 * G, top - 0.2 * G, x + 1.0 * G, top + 1.2 * G);
    c.bezierCurveTo(x + 0.9 * G, top + 2.4 * G, x, top + 3.2 * G, x - 0.7 * G, top + 3.6 * G);
    c.stroke();
    c.beginPath(); c.arc(x - 0.45 * G, top + 1.0 * G, 0.32 * G, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(x + 1.5 * G, top + 0.5 * G, 1, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(x + 1.5 * G, top + 1.5 * G, 1, 0, Math.PI * 2); c.fill();
  }

  // THE NOTES, and what a written note is worth.
  const SEMIS = [0, 2, 4, 5, 7, 9, 11];            // C D E F G A B
  const letterOf = (d) => ((d % 7) + 7) % 7;
  const midiOf = (d, alter) => 60 + 12 * Math.floor(d / 7) + SEMIS[letterOf(d)] + alter;
  // Where a step stands on its stave: the treble's bottom line is E4,
  // the bass's is G2.
  const posOf = (d, low) => (low ? d + 10 : d - 2);
  // Every length here is a whole number of 48ths of a semiquaver — a
  // triplet's third and a demisemiquaver's half both are — so a length
  // read off the file is put back exactly on that grid.
  const exact = (v) => Math.round(v * 48) / 48;
  const DOTTED = [0.75, 1.5, 3, 6, 12, 24];
  const isDotted = (e) => !e.trip && DOTTED.includes(e.dur);
  // What a note is written as: a triplet quaver is a quaver, a dotted
  // crotchet a crotchet with a dot.
  const valueOf = (e) => exact(e.trip ? e.dur * 1.5 : isDotted(e) ? e.dur / 1.5 : e.dur);
  const tailsOf = (e) => { const v = valueOf(e); return v >= 4 ? 0 : v >= 2 ? 1 : v >= 1 ? 2 : 3; };

  /** Bar `n` of a piece as EVENTS to lay out and engrave: each hand one
      or two VOICES — the right hand alone on a single stave, both on a
      braced pair. */
  function barOf(piece, n, grand) {
    const src = piece.bars[n];
    const num = Number(piece.meter[0]), den = Number(piece.meter[1]);
    // The beat: a dotted crotchet in 3/8, 6/8, 9/8 and 12/8; the lower
    // number otherwise.
    const beat = den === 8 && num % 3 === 0 ? 6 : 16 / den;
    const voices = [];
    (grand ? ["right", "left"] : ["right"]).forEach((hand) => {
      const low = hand === "left", two = src[hand].length > 1;
      src[hand].forEach((list, vi) => voices.push({ low, vi, two, list: list.map((e) => ({
        t: exact(e.t), dur: exact(e.dur), ds: e.ds || [], alter: e.al || [], acc: e.acc || [],
        rest: !!e.rest, hidden: !!e.hidden, trip: !!e.trip,
        // Two voices on one stave: the upper's stems up, the lower's down.
        up: two ? vi === 0 : e.up === undefined ? null : !!e.up,
        beam: e.beam ? hand + vi + ":" + e.beam : null,
        tie: !!e.tie, tied: !!e.tied, slur: !!e.slur, slurEnd: !!e.slurEnd,
        low, vi, strong: exact(e.t / beat) % 1 === 0,
      })) }));
    });
    return { n, units: src.units, pickup: !!src.pickup, meter: piece.meter, voices };
  }

  // A chord's accidentals, side by side where they would touch: which
  // column each stands in, counted out from the heads.
  function signCols(e) {
    const cols = [], col = new Map();
    e.ds.map((d, i) => [posOf(d, e.low), i]).filter(([, i]) => e.acc[i]).sort((p, q) => q[0] - p[0]).forEach(([p, i]) => {
      let k = 0;
      while (cols[k] && cols[k].some((q) => Math.abs(q - p) < 6)) k++;
      (cols[k] = cols[k] || []).push(p);
      col.set(i, k);
    });
    return { n: cols.length, col };
  }
  const hasSecond = (e) => {
    const ps = e.ds.map((d) => posOf(d, e.low)).sort((a, b) => a - b);
    return ps.some((p, i) => i && p - ps[i - 1] === 1);
  };

  // ============================================================
  // THE LAYOUT of a bar: where each event stands across it. Both hands
  // and all their voices share their onsets, so what sounds together
  // stands together.
  // ============================================================
  const spacing = (g) => GAP * (0.82 + 0.62 * Math.sqrt(g));
  function layBar(bar) {
    const all = bar.voices.flatMap((v) => v.list).filter((e) => !e.hidden);
    const onsets = [...new Set(all.map((e) => e.t))].sort((a, b) => a - b);
    const xs = new Map();
    let x = 8;
    onsets.forEach((t, i) => {
      const here = all.filter((e) => e.t === t);
      const signs = Math.max(0, ...here.filter((e) => !e.rest).map((e) => signCols(e).n));
      x += signs * 5.5;
      xs.set(t, x);
      const next = i + 1 < onsets.length ? onsets[i + 1] : bar.units;
      const dotted = here.some(isDotted), seconds = here.some((e) => !e.rest && hasSecond(e));
      x += spacing(next - t) + (dotted ? 3 : 0) + (seconds ? RX * 1.4 : 0);
    });
    bar.width = x + 4;
    // A whole bar's rest stands in the middle of the bar.
    bar.voices.forEach((v) => v.list.forEach((e) => {
      e.x = e.rest && !bar.pickup && e.t === 0 && e.dur === bar.units ? bar.width / 2 : xs.get(e.t);
    }));
  }

  // ============================================================
  // ENGRAVING one bar's events into MARKS — each a thing drawn, `put` at
  // the x it stands at so a stave can be written out left to right, and
  // for a note, what it sounds (`put`'s third argument; a page that does
  // not sound takes no notice of it). `staff` false is loose music, which
  // has no lines to stand on and so no ledger lines either.
  // ============================================================
  function engrave(bar, ox, tops, put, staff) {
    let deep = tops[tops.length - 1] + 4 * GAP;
    // Which way a note's or a group's stems go: the score's own say where
    // it has one, and otherwise away from the note furthest from the
    // middle line, as an engraver's rule has it.
    const dirOf = (list, v) => {
      const said = list.find((e) => e.up !== null);
      if (said) return said.up;
      const ps = list.flatMap((e) => e.ds.map((d) => posOf(d, e.low)));
      return ps.reduce((a, p) => (Math.abs(p - 4) > Math.abs(a - 4) ? p : a), 4) < 4;
    };
    // The heads of a note or chord, from the lowest: the upper of a
    // second stands on the far side of its stem, as it is engraved.
    const headsOf = (e, hx, top, up) => {
      const order = e.ds.map((d, i) => i).sort((i, j) => e.ds[i] - e.ds[j]);
      const ps = order.map((i) => posOf(e.ds[i], e.low));
      const off = ps.map(() => 0);
      if (up) { for (let k = 1; k < ps.length; k++) if (ps[k] - ps[k - 1] === 1 && !off[k - 1]) off[k] = 1; }
      else { for (let k = ps.length - 2; k >= 0; k--) if (ps[k + 1] - ps[k] === 1 && !off[k + 1]) off[k] = -1; }
      return ps.map((p, k) => ({ p, i: order[k], off: off[k], x: hx + off[k] * RX * 1.85, y: yAt(top, p) }));
    };
    const signs = (e, hs, hx) => {
      const { col } = signCols(e);
      const left = hs.some((h) => h.off < 0) ? RX * 1.85 : 0;
      hs.forEach((h) => {
        const a = e.acc[h.i];
        if (!a) return;
        const ax = hx - RX - 4.5 - left - col.get(h.i) * 5.5, ay = h.y;
        put(ax, (c) => (a === "sharp" ? mSharp(c, ax, ay) : a === "flat" ? mFlat(c, ax, ay) : mNatural(c, ax, ay)));
      });
    };
    const ledgers = (hs, hx, top) => {
      if (!staff) return;
      const lo = Math.min(...hs.map((h) => h.p)), hi = Math.max(...hs.map((h) => h.p));
      const x1 = Math.min(...hs.map((h) => h.x)) - RX * 1.7, x2 = Math.max(...hs.map((h) => h.x)) + RX * 1.7;
      for (let q = -2; q >= lo; q -= 2) { const y = yAt(top, q); put(hx, (c) => mLine(c, x1, y, x2, y, 0.8)); }
      for (let q = 10; q <= hi; q += 2) { const y = yAt(top, q); put(hx, (c) => mLine(c, x1, y, x2, y, 0.8)); }
    };
    const dots = (c, e, hs) => {
      if (!isDotted(e)) return;
      const dx = Math.max(...hs.map((h) => h.x)) + RX + 3;
      hs.forEach((h) => mDot(c, dx, h.y - (h.p % 2 === 0 ? GAP / 2 : 0)));
    };
    const sounds = (e, hs, hx, draw) => put(hx, draw, {
      pitches: hs.map((h) => midiOf(e.ds[h.i], e.alter[h.i])),
      heads: hs.map((h) => [h.x, h.y]),
      at: e.at, dur: e.dur, hold: e.hold || 0, struck: e.struck !== false, low: e.low, strong: e.strong,
    });
    function rest(e, top, v) {
      const hx = ox + e.x;
      const whole = !bar.pickup && e.t === 0 && e.dur === bar.units;
      // Two voices on a stave: the upper's rests stand higher, the lower's lower.
      const lift = v.two ? (v.vi === 0 ? -GAP * 1.5 : GAP * 1.5) : 0;
      put(hx, (c) => mRest(c, hx, top + lift, whole ? 16 : valueOf(e), !whole && isDotted(e)));
    }
    function single(e, top, v) {
      const hx = ox + e.x;
      const up = dirOf([e], v);
      const hs = headsOf(e, hx, top, up);
      const value = valueOf(e), tails = tailsOf(e), open = value >= 8, stem = value < 16;
      signs(e, hs, hx);
      ledgers(hs, hx, top);
      const ys = hs.map((h) => h.y), lo = Math.max(...ys), hi = Math.min(...ys);
      const vx = hx + (up ? RX * 0.92 : -RX * 0.92), mid = yAt(top, 4);
      // A stem an octave long, and at least to the middle line off a
      // note far from its stave.
      const tip = up ? Math.min(hi - GAP * 3.4, mid) : Math.max(lo + GAP * 3.4, mid);
      e.hs = hs; e.stemUp = up;
      deep = Math.max(deep, lo + RY, stem && !up ? tip : 0);
      sounds(e, hs, hx, (c) => {
        hs.forEach((h) => (value >= 16 ? mWhole(c, h.x, h.y) : mHead(c, h.x, h.y, open)));
        if (stem) mLine(c, vx, up ? lo : hi, vx, tip, 0.9);
        if (tails) mFlag(c, vx, tip, up, tails);
        dots(c, e, hs);
      });
    }
    function beamed(list, top, v) {
      const up = dirOf(list, v);
      const xs = list.map((e) => ox + e.x);
      const hss = list.map((e, i) => headsOf(e, xs[i], top, up));
      const sx = xs.map((hx) => hx + (up ? RX * 0.92 : -RX * 0.92));
      // The head nearest the beam, and the one its stem leaves from.
      const near = hss.map((hs) => (up ? Math.min : Math.max)(...hs.map((h) => h.y)));
      const far = hss.map((hs) => (up ? Math.max : Math.min)(...hs.map((h) => h.y)));
      const tails = list.map(tailsOf);
      const L = GAP * 3.3, need = L * 0.8 + (Math.max(...tails) - 1) * GAP * 0.6;
      let b1 = near[0] + (up ? -L : L), b2 = near[near.length - 1] + (up ? -L : L);
      if (Math.abs(b2 - b1) > GAP) b2 = b1 + Math.sign(b2 - b1) * GAP;
      const beamY = (x) => b1 + (b2 - b1) * (x - sx[0]) / Math.max(1, sx[sx.length - 1] - sx[0]);
      // Every stem long enough for its beams, the beam moved out to allow
      // it; and a beam off notes far from the stave reaches its middle line.
      let shift = 0;
      sx.forEach((x, i) => { const room = up ? beamY(x) - (near[i] - need) : (near[i] + need) - beamY(x); if (room > shift) shift = room; });
      b1 += up ? -shift : shift; b2 += up ? -shift : shift;
      const mid = yAt(top, 4);
      const past = up ? Math.max(b1, b2) - mid : mid - Math.min(b1, b2);
      if (past > 0) { b1 += up ? -past : past; b2 += up ? -past : past; }
      const step = (up ? 1 : -1) * GAP * 0.6;          // from one beam to the next, in towards the heads
      list.forEach((e, i) => {
        const hs = hss[i];
        e.hs = hs; e.stemUp = up;
        signs(e, hs, xs[i]);
        ledgers(hs, xs[i], top);
        deep = Math.max(deep, far[i] + RY, up ? 0 : beamY(sx[i]));
        sounds(e, hs, xs[i], (c) => {
          hs.forEach((h) => mHead(c, h.x, h.y, false));
          mLine(c, sx[i], far[i], sx[i], beamY(sx[i]), 0.9);
          dots(c, e, hs);
        });
      });
      const last = xs[xs.length - 1];
      put(last, (c) => {
        mBeamLine(c, sx[0], beamY(sx[0]), sx[sx.length - 1], beamY(sx[sx.length - 1]));
        // A semiquaver's second beam and a demisemiquaver's third: between
        // two notes that both carry it, or as a stub towards the note
        // beside a lone one.
        for (let k = 2; k <= 3; k++) {
          const dy = step * (k - 1);
          list.forEach((e, i) => {
            if (tails[i] < k) return;
            if (i + 1 < list.length && tails[i + 1] >= k) { mBeamLine(c, sx[i], beamY(sx[i]) + dy, sx[i + 1], beamY(sx[i + 1]) + dy); return; }
            if (i && tails[i - 1] >= k) return;
            const x2 = sx[i] + (i ? -1 : 1) * RX * 2.2;
            const a = Math.min(sx[i], x2), b = Math.max(sx[i], x2);
            mBeamLine(c, a, beamY(a) + dy, b, beamY(b) + dy);
          });
        }
      });
      // A triplet's number on the beam's side: 3, or 6 over six of them.
      const runs = [];
      list.forEach((e, i) => {
        if (!e.trip) return;
        const run = runs[runs.length - 1];
        if (run && run.to === i - 1) run.to = i; else runs.push({ from: i, to: i });
      });
      runs.forEach((r) => {
        const x = (sx[r.from] + sx[r.to]) / 2, y = beamY(x) + (up ? -GAP * 1.3 : GAP * 1.3);
        const label = r.to - r.from === 5 ? "6" : "3";
        if (!up) deep = Math.max(deep, y + GAP);
        put(xs[r.to], (c) => mText(c, label, x, y, GAP * 1.3, "italic"));
      });
    }
    bar.voices.forEach((v) => {
      const top = v.low ? tops[1] : tops[0];
      const list = v.list.filter((e) => !e.hidden);
      const done = new Set();
      list.forEach((e) => {
        if (done.has(e)) return;
        if (e.rest) { rest(e, top, v); return; }
        // The notes under one beam in the score, beamed together.
        const group = e.beam && tailsOf(e) ? list.filter((o) => o.beam === e.beam && !o.rest && tailsOf(o)) : [e];
        group.forEach((o) => done.add(o));
        if (group.length > 1) beamed(group, top, v); else single(e, top, v);
      });
    });
    bar.deep = deep;
  }

  /** A stave's head — its clef or clefs, the key signature and the time
      signature — and where its first bar begins. */
  function heading(piece, tops, put) {
    const order = piece.sharps ? [8, 5, 9, 6, 3] : [4, 7, 3, 6, 2];
    const tx = GAP * 4.6 + piece.count * GAP * 0.85;
    tops.forEach((top, i) => {
      const low = i === 1;
      put(GAP * 1.4, (c) => (low ? mBass(c, GAP * 1.5, top) : mTreble(c, GAP * 1.7, top)));
      for (let k = 0; k < piece.count; k++) {
        const kx = GAP * 4 + k * GAP * 0.85, ky = yAt(top, order[k] - (low ? 2 : 0));
        put(kx, (c) => (piece.sharps ? mSharp(c, kx, ky) : mFlat(c, kx, ky)));
      }
      put(tx, (c) => mTime(c, piece.meter, tx, top));
    });
    return tx + GAP * (piece.meter[0].length > 1 ? 2.3 : 1.7);
  }

  /** Each voice of each hand, its notes in order across a run of bars. */
  function threadsOf(bars) {
    const lines = new Map();
    bars.forEach((bar) => bar.voices.forEach((v) => {
      const k = (v.low ? "L" : "R") + v.vi;
      if (!lines.has(k)) lines.set(k, []);
      v.list.forEach((e) => { if (!e.rest && !e.hidden) lines.get(k).push(e); });
    }));
    return [...lines.values()];
  }

  /** THE TIES AND SLURS of a run of engraved bars: from a note to the one
      it is tied or slurred to in the same voice — or, where that is past
      the last bar written, a little way on, as a score continues. */
  function curves(bars, put) {
    threadsOf(bars).forEach((list) => list.forEach((e, i) => {
      if (!e.hs) return;
      const below = e.stemUp;
      if (e.tie) {
        const next = list[i + 1];
        const x1 = Math.max(...e.hs.map((h) => h.x)) + RX + 1;
        const x2 = next && next.tied && next.hs ? Math.min(...next.hs.map((h) => h.x)) - RX - 1 : x1 + GAP * 2.2;
        e.hs.forEach((h) => {
          const y = h.y + (below ? GAP * 0.7 : -GAP * 0.7);
          put(x2, (c) => mTie(c, x1, x2, y, below));
        });
      }
      if (e.slur) {
        let j = i + 1;
        while (j < list.length - 1 && !list[j].slurEnd) j++;
        const end = list[j];
        if (!end || !end.hs) return;
        const edge = (o) => (below ? Math.max(...o.hs.map((h) => h.y)) + GAP * 1.1 : Math.min(...o.hs.map((h) => h.y)) - GAP * 1.1);
        const span = list.slice(i, j + 1).filter((o) => o.hs).map(edge);
        const clear = below ? Math.max(...span) + GAP * 0.4 : Math.min(...span) - GAP * 0.4;
        const x1 = e.hs[0].x, x2 = end.hs[0].x, y1 = edge(e), y2 = edge(end);
        put(x2, (c) => mSlur(c, x1, y1, x2, y2, below, clear));
      }
    }));
  }

  /** What a stave of it is, for the tests: the piece, the time signature
      written on it, and every bar — which of the piece's it is, its
      length, how long each voice of each hand lasts in it, and its
      pitches. */
  function scoreOf(piece, bars) {
    const sum = (list) => Math.round(list.reduce((n, e) => n + e.dur, 0) * 1000) / 1000;
    const hand = (bar, low) => bar.voices.filter((v) => v.low === low).map((v) => sum(v.list));
    return {
      composer: piece.composer, title: piece.title, file: piece.file,
      written: [piece.meter.join("/")],
      bars: bars.map((bar) => ({
        n: bar.n, meter: bar.meter.join("/"), units: bar.units, pickup: bar.pickup,
        right: hand(bar, false), left: bar.voices.some((v) => v.low) ? hand(bar, true) : null,
        pitches: bar.voices.flatMap((v) => v.list).filter((e) => !e.rest).map((e) => e.ds.map((d, i) => midiOf(d, e.alter[i]))),
      })),
    };
  }
  // ============================================================
  // THE ENGRAVER ENDS
  // ============================================================

  // ============================================================
  // A STAVE: its head (clef, key, time), then as many of the piece's
  // opening bars as it holds, justified so its last bar line stands at
  // its end — and timed, at the piece's own tempo.
  // ============================================================
  function compose(long, grand, piece) {
    const marks = [];
    const tops = grand ? [0, GAP * 10] : [0];
    const put = (x, fn, note) => marks.push(note ? { x, fn, note: true, ...note } : { x, fn, note: false });
    const start = heading(piece, tops, put);
    const room = long - 8 - start;
    const perUnit = 60 / piece.tempo / 4;           // seconds a semiquaver

    // As many bars as fit at their own width, give or take a little; one
    // too wide for the stave on its own is drawn closer.
    const bars = [];
    let used = 0;
    for (let n = 0; n < piece.bars.length; n++) {
      const bar = barOf(piece, n, grand);
      layBar(bar);
      if (used + bar.width > room / 0.85 && bars.length) break;
      bars.push(bar);
      used += bar.width;
      if (used > room) break;
    }
    const stretch = Math.min(1.9, room / used);

    // A note tied on is held through the note it is tied to, which is not
    // struck again.
    threadsOf(bars).forEach((list) => list.forEach((e, i) => {
      if (e.tied && i && list[i - 1].tie) { e.struck = false; return; }
      let hold = 0;
      for (let j = i; list[j].tie && list[j + 1] && list[j + 1].tied; j++) hold += list[j + 1].dur;
      e.hold = hold;
    }));

    // Laid out along the stave, and timed.
    const edges = [start];
    const times = [];
    let x = start, clock = 0;
    bars.forEach((bar) => {
      const all = bar.voices.flatMap((v) => v.list);
      all.forEach((e) => {
        if (e.x !== undefined) e.x *= stretch;
        e.at = clock + e.t * perUnit;
      });
      const ox = x;
      engrave(bar, ox, tops, put, true);
      const seconds = bar.units * perUnit;
      // Where the playhead is, through the bar: onset by onset (a whole
      // bar's rest, in the middle of it, is not one).
      const shown = all.filter((e) => !e.hidden && !(e.rest && e.dur === bar.units));
      const onsets = [...new Set(shown.map((e) => e.t))].sort((a, b) => a - b);
      const map = [[clock, x]].concat(onsets.map((t) =>
        [clock + t * perUnit, ox + Math.min(...shown.filter((e) => e.t === t).map((e) => e.x))]));
      x += bar.width * stretch;
      map.push([clock + seconds, x]);
      times.push(map);
      clock += seconds;
      edges.push(x);
    });
    curves(bars, put);
    // WHAT IT SOUNDS LIKE: every note struck on it, in the order it
    // sounds, with how long it is held — read off the very marks that are
    // drawn, so what is heard is what is written, note for note.
    const music = marks.filter((m) => m.note && m.struck)
      .map((m) => ({ at: m.at, secs: (m.dur + m.hold) * perUnit, pitches: m.pitches, low: m.low, strong: m.strong, mark: m }))
      .sort((p, q) => p.at - q.at || (p.low ? 1 : 0) - (q.low ? 1 : 0));
    return { marks, tops, bars: edges.slice(1), times, length: clock, end: x, stretch, piece,
      info: scoreOf(piece, bars), music, beat: 60 / piece.tempo,
      tall: grand ? GAP * 14 : GAP * 4, deep: Math.max(...bars.map((b) => b.deep)) };
  }

  // ============================================================
  // THE SCORE: staves down the page, in the page's own coordinates,
  // made as far down as the page reaches — the pieces in a shuffled
  // order, every one of them before any comes round again.
  // ============================================================
  let width = 0, height = 0;
  let staves = [];
  let madeTo = 0;
  let order = 0;
  let deck = [];

  const margin = () => Math.max(0, (width - COLUMN) / 2);
  const plays = (piece, hand) => piece.bars[0][hand].some((v) => v.some((e) => !e.rest));
  // Whether the right hand keeps to the treble stave, never more than a
  // ledger line under it — a right hand written low reads as a thicket of
  // ledger lines on a stave of its own, and is given both hands instead.
  const alone = (piece) => piece.bars.every((b) => b.right.every((v) => v.every((e) => e.rest || Math.min(...e.ds) >= -1)));

  function nextPiece() {
    if (!deck.length) {
      deck = PIECES.slice();
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    return deck.shift();
  }

  function more(to) {
    const room = margin();
    const wide = room > 150;
    while (madeTo < to) {
      const y = madeTo + (random() - 0.5) * 40;
      // Further apart where they stand behind the writing.
      madeTo += wide ? EVERY : EVERY * 1.7;
      // In the margins, left and right in turn; across the window,
      // quietly, where there are none.
      const side = order % 2;
      const long = wide ? Math.min(room - 40, 300) : Math.min(width - 32, 420);
      const x0 = wide ? (side ? width - room + (room - long) / 2 : (room - long) / 2) : (width - long) / 2;
      // The next piece whose first bar goes into this stave without being
      // crowded — a piece passed over waits for the next stave. A piece
      // whose right hand is silent at first, or written low, is always
      // given both hands.
      let score = null;
      for (let tries = 0; tries < PIECES.length && !score; tries++) {
        const piece = nextPiece();
        const grand = random() < GRAND || !plays(piece, "right") || !alone(piece);
        const one = compose(long, grand, piece);
        if (one.stretch >= 0.8 || tries === PIECES.length - 1) score = one;
        else deck.push(piece);
      }
      staves.push({ x0, y, long: score.end + 8, ...score, seen: null, named: 0,
        quiet: wide ? 1 : QUIET, turn: order });
      order++;
    }
  }

  function build() {
    seed = 77013;
    staves = [];
    deck = [];
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

  /** A stave's name as it is set under it: the piece, then its composer,
      each broken where it would run past the stave's end. */
  function nameOf(s) {
    ink.font = NAME_FONT;
    const wrap = (words) => {
      const lines = [];
      let line = "";
      words.split(" ").forEach((w) => {
        const next = line ? line + " " + w : w;
        if (line && ink.measureText(next).width > Math.max(s.long, 150)) { lines.push(line); line = w; } else line = next;
      });
      if (line) lines.push(line);
      return lines;
    };
    return { title: wrap(s.piece.title), composer: wrap(s.piece.composer) };
  }

  function draw(clock) {
    if (!width) return;
    ink.clearRect(0, 0, width, height);
    const scroll = window.scrollY;
    // The page grows as parts are opened; the score keeps up.
    if (document.documentElement.scrollHeight + EVERY > madeTo) more(document.documentElement.scrollHeight + EVERY);
    const pointed = handX > -9000 ? staveUnder(handX, handY) : null;
    staves.forEach((s) => {
      const top = s.y - scroll;
      // Its name comes up while the hand is on it, and goes when it leaves.
      const want = s === pointed ? 1 : 0;
      s.named = REDUCE_MOTION ? want : s.named + (want - s.named) * NAME_IN;
      if (s.named < 0.004) s.named = 0;
      if (top > height + 40 || top + s.deep + 60 < -60) return;
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
        for (let k = 0; k < 5; k++) mLine(ink, s.x0, top + t + k * GAP, s.x0 + reach, top + t + k * GAP, 0.7);
      });
      // The bar lines, through both staves of a braced pair, and the
      // brace that holds the two together. It ends on a plain bar line:
      // the piece goes on past it.
      const foot = top + s.tops[s.tops.length - 1] + 4 * GAP;
      s.bars.forEach((bx) => { if (bx <= reach) mLine(ink, s.x0 + bx, top, s.x0 + bx, foot, 0.7); });
      if (s.tops.length > 1 && reach > 8) {
        mLine(ink, s.x0, top, s.x0, foot, 0.7);
        ink.lineWidth = 1.2;
        ink.beginPath();
        const bx = s.x0 - 5, mid = (top + foot) / 2;
        ink.moveTo(bx + 3, top);
        ink.bezierCurveTo(bx - 3, top + 8, bx + 3, mid - 10, bx - 3, mid);
        ink.bezierCurveTo(bx + 3, mid + 10, bx - 3, foot - 8, bx + 3, foot);
        ink.stroke();
      }
      // The playhead itself, a hairline.
      if (head >= 0) {
        ink.strokeStyle = "rgba(" + BLUE + "," + ((heard !== null ? 0.34 : 0.12) * q).toFixed(3) + ")";
        mLine(ink, s.x0 + head, top - GAP * 2, s.x0 + head, foot + GAP * 2, 0.8);
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
        m.fn(ink);
      });
      ink.restore();
      // ITS NAME, under everything written on it, in a light face.
      if (s.named > 0) {
        const name = nameOf(s);
        const shade = Math.sqrt(q) * s.named;
        ink.textAlign = "left";
        ink.textBaseline = "top";
        let y = top + s.deep + GAP * 1.6 + (1 - ease(s.named)) * 3;
        name.title.forEach((t) => {
          ink.fillStyle = "rgba(" + BLUE + "," + (NAME * shade).toFixed(3) + ")";
          ink.fillText(t, s.x0, y);
          y += NAME_PX + 3;
        });
        name.composer.forEach((t) => {
          ink.fillStyle = "rgba(" + BLUE + "," + (NAME * 0.72 * shade).toFixed(3) + ")";
          ink.fillText(t, s.x0, y);
          y += NAME_PX + 3;
        });
      }
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

  // The light face the names are set in, asked for before it is first
  // needed: a canvas does not fetch a font on its own.
  if (document.fonts && document.fonts.load) document.fonts.load(NAME_FONT).catch(() => {});

  // FOR THE TESTS, like the Houses view's `census`: every stave's piece
  // and bars — which of the piece's they are, their metre, how long each
  // voice of each hand lasts in them, and their pitches — where its notes
  // stand on the window, with their pitches; where each stave stands on
  // the window and how far its name has come up; the music each one
  // plays, in order; and what the piano has been asked to play.
  window.QimuScore = {
    staves: () => staves.map((s) => ({ grand: s.tops.length > 1, ...s.info })),
    boxes: () => staves.map((s, i) => ({ i, x: s.x0, y: s.y - window.scrollY, w: s.long, h: s.tall, deep: s.deep,
      written: s.seen !== null, named: s.named })),
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

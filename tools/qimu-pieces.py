#!/usr/bin/env python3
# ============================================================
# QIMU & MUSICIANS' SCORE, FROM REAL SCORES — run by hand, never by the site
#
# The owner, 2026-09-28: "For the qimu and musicians, i want you to
# actually find sheet music from some obscure piano pieces and display
# that. I also want you to give their name when hovering that piece in a
# light font underneath the sheet music."
#
# The owner again, 2026-10-01: "make it so that not all of them are
# polish. I want you to search online and find some stuff from all over
# the world ... the more complex, the better. One can be piano, another
# can be a drum version, a third can be a guitar version."
#
# This reads the pieces listed in PIECES below, from three kinds of source,
# and writes them into qimu-pieces.js (each piece's opening) and
# qimu-whole.js (every bar, and the order they are played in) as the house
# page's score (qimu.js) and the Houses view (motifs.js) write music: bars
# of events, each hand in one or two voices, every note a STEP (letters
# above middle C) and an ALTER, with the accidentals an engraver writes,
# which way its stem goes, which beam it is under, its ties and its slurs.
#
#   **kern    the digital scores of Polish Music Heritage in Open Access
#             (https://polishscores.org, (c) The Fryderyk Chopin Institute,
#             CC BY 4.0), read here directly;
#   LilyPond  the Mutopia Project's editions (https://www.mutopiaproject.org,
#             public domain or Creative Commons as each says) and Xiao
#             Youmei's march, transcribed by hand into tools/xiao-youmei/ —
#             read by LilyPond itself, with tools/qimu-events.ly writing
#             down what it hears (see read_ly);
#   MIDI      drummers' performances in the Groove MIDI Dataset (Google
#             Magenta, CC BY 4.0), written down as a drum part (read_groove).
#
# It needs LilyPond (`pip install lilypond==2.24.3`) and mido (`pip install
# mido`), and the sources cloned and unzipped (only the files it reads are
# fetched):
#
#   git clone --filter=blob:none https://github.com/pl-wnifc/humdrum-polish-scores /tmp/polish
#   git clone --filter=blob:none https://github.com/MutopiaProject/MutopiaProject /tmp/mutopia
#   curl -LO https://storage.googleapis.com/magentadata/datasets/groove/groove-v1.0.0-midionly.zip
#   unzip groove-v1.0.0-midionly.zip -d /tmp            # makes /tmp/groove
#   python3 tools/qimu-pieces.py /tmp/polish /tmp/mutopia/ftp /tmp/groove
#
# A **kern piece's opening is taken only where it is plain enough to
# engrave in a margin: a treble and a bass staff, no change of clef, key or
# metre, no grace notes, at most two voices a hand, nothing shorter than a
# thirty-second, and every voice filling every bar. Up to four bars of
# each (and an upbeat before them); a stave shows as many as it has room
# for. Any other piece's opening is its first bars as the whole of it has
# them (`opening_of`).
# ============================================================
import sys, os, re, json, glob
from fractions import Fraction as Fr

LETTERS = "cdefgab"

def dur_of(tok):
    m = re.search(r"(\d+)(%(\d+))?(\.*)", tok)
    if not m:
        return None
    n = int(m.group(1))
    if m.group(3):
        base = Fr(int(m.group(3)), n) * 16  # rational 3%2 etc: whole * m3/n
    else:
        if n == 0:
            base = Fr(32)  # breve
        else:
            base = Fr(16, n)
    dots = len(m.group(4))
    total = base
    add = base
    for _ in range(dots):
        add /= 2
        total += add
    return total

def pitch_of(tok):
    m = re.search(r"([a-gA-G])\1*", tok)
    if not m:
        return None
    s = m.group(0)
    letter = LETTERS.index(s[0].lower())
    if s[0].islower():
        octave = 4 + len(s) - 1
    else:
        octave = 3 - (len(s) - 1)
    rest = tok[m.end():]
    alter = 0
    am = re.match(r"(#+|-+|n)?", rest)
    a = am.group(1) or ""
    if a.startswith("#"):
        alter = len(a)
    elif a.startswith("-"):
        alter = -len(a)
    step = (octave - 4) * 7 + letter
    return step, alter, ("n" in a)

def parse(path):
    text = open(path, encoding="utf-8").read()
    meta = {}
    for line in text.split("\n"):
        if line.startswith("!!!"):
            k, _, v = line[3:].partition(":")
            meta.setdefault(k.strip(), v.strip())
    spines = []   # each: dict(kind, staff, clef, time, voice)
    events = []   # dict(staff, voice, t, dur, notes[(step,alter,nat)], rest, hidden, grace, tie, trip)
    bars = []     # (number, time) at each barline
    meter = None; keysig = None; clef = {}; issues = set(); tempo = None
    first_bar_time = None
    graces = []; clefs_at = []; meters_at = []
    keys_at = []; closes = []; sections = []; expansion = None
    for raw in text.split("\n"):
        if not raw or raw.startswith("!!"):
            continue
        fields = raw.split("\t")
        if raw.startswith("**"):
            spines = [{"kind": f, "staff": None, "time": Fr(0), "voice": 0} for f in fields]
            continue
        if raw.startswith("*"):
            new = []
            i = 0
            while i < len(fields):
                f = fields[i]; sp = spines[i]
                if f == "*^":
                    a = dict(sp); b = dict(sp); b["voice"] = sp["voice"] + 1
                    new += [a, b]; i += 1; continue
                if f == "*v":
                    j = i
                    while j < len(fields) and fields[j] == "*v":
                        j += 1
                    grp = spines[i:j]
                    m = dict(grp[0]); m["time"] = max(g["time"] for g in grp); m["voice"] = min(g["voice"] for g in grp)
                    new.append(m); i = j; continue
                if f == "*-":
                    i += 1; continue
                mm = re.match(r"\*staff(\d+)", f)
                if mm: sp["staff"] = int(mm.group(1))
                if f.startswith("*clef"):
                    if sp["kind"] == "**kern":
                        if sp["staff"] in clef and clef[sp["staff"]] != f and first_bar_time is not None:
                            issues.add("clef-change")
                        clef[sp["staff"]] = f
                        clefs_at.append((sp["staff"], sp["time"], f))
                if f.startswith("*M") and re.match(r"\*M\d+/\d+", f):
                    meters_at.append((sp["time"], f[2:]))
                    if meter and meter != f[2:] and first_bar_time is not None:
                        issues.add("meter-change:" + f[2:])
                    if meter is None or first_bar_time is None: meter = f[2:]
                if f.startswith("*k[") and sp["kind"] == "**kern":
                    keys_at.append((sp["time"], f[3:-1]))
                if re.match(r"\*>\[", f) and expansion is None:
                    expansion = f[3:-1]
                elif re.match(r"\*>[^\[\]]+$", f) and sp["kind"] == "**kern" and not any(x[1] == sp["time"] and x[0] == f[2:] for x in sections):
                    sections.append((f[2:], sp["time"]))
                if f.startswith("*k["):
                    if keysig is None or first_bar_time is None: keysig = f[3:-1]
                    elif keysig != f[3:-1]: issues.add("key-change")
                if f.startswith("*MM") and tempo is None:
                    try: tempo = float(f[3:])
                    except ValueError: pass
                new.append(sp); i += 1
            spines = new
            continue
        if raw.startswith("="):
            m = re.match(r"=+(\d+)", fields[0])
            t = max(sp["time"] for sp in spines if sp["kind"] == "**kern")
            num = int(m.group(1)) if m else None
            bars.append((num, t))
            closes.append(fields[0])
            if first_bar_time is None: first_bar_time = t
            continue
        if raw.startswith("!"):
            continue
        for i, f in enumerate(fields):
            sp = spines[i]
            if sp["kind"] != "**kern" or f == ".":
                continue
            toks = f.split(" ")
            d0 = None; notes = []; rest = False; hidden = False; grace = False; tie = ""; trip = False
            first = toks[0]
            stem = "up" if "/" in first else "down" if "\\" in first else None
            beamL = first.count("L"); beamJ = first.count("J")
            slurOpen = first.count("("); slurClose = first.count(")")
            for tk in toks:
                if "q" in tk or "Q" in tk:
                    grace = True
                d = dur_of(tk)
                if d is None:
                    grace = True; continue
                if d0 is None: d0 = d
                if "r" in tk:
                    rest = True
                    if "yy" in tk: hidden = True
                    continue
                p = pitch_of(tk)
                if p: notes.append(p)
                if "[" in tk: tie += "["
                if "]" in tk: tie += "]"
                if "_" in tk: tie += "_"
                n = int(re.search(r"(\d+)", tk).group(1))
                if n in (3, 6, 12, 24, 48): trip = True
            if grace or d0 is None:
                graces.append((sp["staff"], sp["time"]))
                continue
            events.append({"staff": sp["staff"], "voice": sp["voice"], "t": sp["time"], "dur": d0,
                           "notes": notes, "rest": rest, "hidden": hidden, "tie": tie, "trip": trip,
                           "stem": stem, "L": beamL, "J": beamJ, "so": slurOpen, "sc": slurClose, "raw": f})
            sp["time"] += d0
    return {"meta": meta, "meter": meter, "key": keysig, "clef": clef, "bars": bars, "events": events,
            "issues": issues, "tempo": tempo, "graces": graces, "clefs_at": clefs_at, "meters_at": meters_at,
            "keys_at": keys_at, "closes": closes, "sections": sections, "expansion": expansion}

# ============================================================
# A SCORE OF THE MUTOPIA PROJECT'S (https://www.mutopiaproject.org) is
# written for LilyPond rather than as **kern, and is read by LilyPond
# itself: `qimu-events.ly`, handed to it as its settings, writes down
# every note and rest it hears (its repeats unfolded, so in the order they
# are played), with each staff's clef and key and the bar number, metre
# and place in the bar as they change. That is read here into the same
# shape `parse` reads a **kern file into, so the rest is the same for
# both. LilyPond comes from PyPI (`pip install lilypond==2.24.3`) or the
# path in $LILYPOND; an older score is brought up to date with its own
# convert-ly first.
#
# What a LilyPond score does not say and **kern does — which notes a beam
# joins — is worked out as an engraver would: a beat's quavers and
# shorter notes beamed together (a manual beam in the score kept).
# ============================================================
import shutil, subprocess, tempfile, bisect

def lilypond_bin(name="lilypond"):
    if os.environ.get("LILYPOND"):
        return os.path.join(os.path.dirname(os.environ["LILYPOND"]), name)
    try:
        import lilypond as lp
        return os.path.join(os.path.dirname(lp.executable()), name)
    except ImportError:
        return shutil.which(name) or name

def ly_events(path):
    """Every note LilyPond hears in `path`, as the lines of its .events."""
    here = os.path.dirname(os.path.abspath(__file__))
    work = tempfile.mkdtemp(prefix="qimu-ly-")
    src = os.path.dirname(os.path.abspath(path))
    for f in os.listdir(src):
        if os.path.isfile(os.path.join(src, f)):
            shutil.copy(os.path.join(src, f), work)
    name = os.path.basename(path)
    for f in os.listdir(work):
        if f.endswith((".ly", ".ily")):
            subprocess.run([lilypond_bin("convert-ly"), "-e", f], cwd=work, capture_output=True)
            # A music function written the old way — its first two
            # arguments the parser and the place — which convert-ly leaves.
            text = open(os.path.join(work, f), encoding="utf-8", errors="replace").read()
            def older(m):
                args, preds = m.group(2).split(), re.findall(r"[\w:?!-]+\?", m.group(3))
                return m.group(1) + "(" + " ".join(args[2:] if len(args) == len(preds) + 2 else args) + ") (" + m.group(3) + ")"
            fixed = re.sub(r"(define-(?:music|scheme|void)-function\s*)\(([^()]*)\)\s*\(([^()]*)\)", older, text)
            # A Scheme number run into the command after it (`#1\tuplet`).
            fixed = re.sub(r"(#-?\d+)(\\[a-zA-Z])", r"\1 \2", fixed)
            if fixed != text:
                open(os.path.join(work, f), "w", encoding="utf-8").write(fixed)
    subprocess.run([lilypond_bin(), "-dinclude-settings=" + os.path.join(here, "qimu-events.ly"),
                    "-dno-print-pages", "--loglevel=ERROR", "-o", "out", name], cwd=work, capture_output=True)
    out = os.path.join(work, "out.events")
    if not os.path.exists(out):
        return []
    lines = open(out, encoding="utf-8").read().split("\n")
    shutil.rmtree(work, ignore_errors=True)
    return [l.split("\t") for l in lines if l]

def _fr(s):
    s = s.strip()
    if "/" in s:
        a, b = s.split("/")
        return Fr(int(a), int(b))
    return Fr(int(s))

KEYS_OF = "cdefgab"

def read_ly(path, guitar=False):
    rows = ly_events(path)
    if not rows:
        return None
    staves = []                 # the staves, top to bottom, in the order LilyPond first meets them
    clefs_at, keys_at, meters_at, graces = [], [], [], []
    starts, numbers = {}, {}
    notes = {}                  # (voice, t) -> the chord being gathered
    ties, slurs, beams = set(), {}, {}
    end = Fr(0)
    repeats = set()             # (kind, t, numbers, count, direction)
    latest = Fr(0)
    def staff_of(addr):
        if addr not in staves: staves.append(addr)
        return staves.index(addr)
    for r in rows:
        kind = r[0]
        # A second score in the same file starts again from nought: only
        # the first is read.
        if kind in "KMNR" and len(r) > 1:
            now = _fr(r[1])
            if now == 0 and latest > 0: break
            latest = max(latest, now)
        if kind == "V":
            nums = tuple(int(x) for x in re.findall(r"\d+", r[3]))
            repeats.add((r[2], _fr(r[1]) * 16, nums, int(r[4]), int(r[6])))
            continue
        if kind == "K":
            t = _fr(r[1]) * 16; st = staff_of(r[3])
            glyph, trans, _, keyal = r[4].split("|", 3)
            clef = {"clefs.G": "G", "clefs.F": "F", "clefs.C": "C", "clefs.percussion": "X"}.get(glyph, "?")
            if clef == "G" and trans == "-7": clef = "g"
            clefs_at.append((st, t, clef))
            key = "".join(KEYS_OF[int(m.group(1))] + ("#" if _fr(m.group(2)) > 0 else "-")
                          for m in re.finditer(r"\((\d) \. (-?[\d/]+)\)", keyal) if _fr(m.group(2)) != 0)
            keys_at.append((t, key))
        elif kind == "M":
            t = _fr(r[1]) * 16
            num, pos, frac, which = r[3].split("|", 3)
            # A repeat sign written as a bar line rather than as \repeat.
            which = which.rsplit("|", 1)[0] if which.endswith(")") else which
            if ":" in which and pos == "0/1":
                if re.search(r":\|", which.replace(":..:", ":|.|:")) or which.startswith(":"): repeats.add(("end", t, (), 2, 0))
                if re.search(r"\|:", which.replace(":..:", ":|.|:")) or which.endswith(":"): repeats.add(("start", t, (), 2, 0))
            pos = _fr(pos) * 16
            m = re.match(r"\((\d+) \. (\d+)\)", frac)
            meter = "%s/%s" % (m.group(1), m.group(2))
            if not meters_at or meters_at[-1][1] != meter: meters_at.append((t, meter))
            start = t - pos
            if start >= 0 and start not in starts:
                starts[start] = int(num)
        elif kind in ("N", "R"):
            t = _fr(r[1]) * 16; grace = r[2] == "g"; voice = r[3]; st = staff_of(r[5])
            lg, dots, scale = r[7].split(" ")
            base = Fr(16) / (2 ** int(lg)) if int(lg) >= 0 else Fr(16) * 2
            dur = base * (2 - Fr(1, 2 ** int(dots))) * _fr(scale)
            if grace:
                graces.append((st, t)); continue
            end = max(end, t + dur)
            ev = notes.get((voice, t))
            if not ev:
                ev = notes[(voice, t)] = {"staff": st, "vaddr": voice, "t": t, "dur": dur, "notes": [], "rest": False,
                                          "hidden": False, "tie": "", "trip": _fr(scale) == Fr(2, 3), "odd": _fr(scale) not in (1, Fr(2, 3)),
                                          "tu": (_fr(scale).denominator, _fr(scale).numerator) if _fr(scale) not in (1, Fr(2, 3)) else None,
                                          "stem": None, "L": 0, "J": 0, "so": 0, "sc": 0, "raw": "", "ties": set(), "beam": 0}
            if kind == "R":
                ev["rest"] = True
                continue
            if r[6].startswith("drum"):
                continue
            octv, name, alt = r[6].split(" ")
            step = int(octv) * 7 + int(name)
            alter = int(_fr(alt) * 2)
            ev["notes"].append((step, alter, False))
            arts = r[8].split(",") if len(r) > 8 and r[8] else []
            if "tie" in arts: ev["ties"].add((step, alter))
            if "slur(" in arts: ev["so"] = 1
            if "slur)" in arts: ev["sc"] = 1
            if "beam[" in arts: ev["beam"] = -1
            if "beam]" in arts: ev["beam"] = 1
        elif kind == "T":
            ties.add((r[3], _fr(r[1]) * 16))
        elif kind == "S":
            slurs[(r[3], _fr(r[1]) * 16)] = int(r[6])
        elif kind == "B":
            beams[(r[3], _fr(r[1]) * 16)] = int(r[6])
    evs = sorted(notes.values(), key=lambda e: (e["t"], e["staff"]))
    for e in evs:
        k = (e["vaddr"], e["t"])
        if k in ties: e["ties"] |= {(s, a) for s, a, _ in e["notes"]}
        if slurs.get(k) == -1: e["so"] = 1
        if slurs.get(k) == 1: e["sc"] = 1
        if k in beams: e["beam"] = beams[k]
        if e["rest"] and e["notes"]: e["rest"] = False
    # Ties: from a note to the same note next in its voice.
    by_voice = {}
    for e in evs: by_voice.setdefault(e["vaddr"], []).append(e)
    for lst in by_voice.values():
        for i, e in enumerate(lst):
            if e["ties"] and i + 1 < len(lst):
                nxt = lst[i + 1]
                if nxt["t"] == e["t"] + e["dur"] and any((s, a) in e["ties"] for s, a, _ in nxt["notes"]):
                    e["tie"] += "["
                    nxt["tie"] += "]"
    bar_starts = sorted(t for t in starts if t < end)
    if not bar_starts or bar_starts[-1] < end: bar_starts.append(end)
    bars = [(starts.get(t), t) for t in bar_starts]
    play = _play(bar_starts, repeats)
    # The voices of each staff in each bar, numbered from the highest.
    for (st, b), group in _groups(evs, bar_starts).items():
        vs = {}
        for e in group:
            vs.setdefault(e["vaddr"], []).extend(n[0] for n in e["notes"])
        order = sorted(vs, key=lambda v: -(sum(vs[v]) / len(vs[v])) if vs[v] else 99)
        for e in group: e["voice"] = order.index(e["vaddr"])
    _beam(evs, bar_starts, meters_at)
    issues = set()
    if any(e["odd"] for e in evs): issues.add("tuplet")
    # A guitar's music is kept as it is written — on the treble staff an
    # octave above where it sounds.
    if guitar:
        for e in evs:
            st_clef = [c for s, t, c in clefs_at if s == e["staff"]]
            if st_clef and st_clef[0] == "g":
                e["notes"] = [(s + 7, a, n) for s, a, n in e["notes"]]
        clefs_at = [(s, t, "g") for s, t, c in clefs_at]
    for e in evs:
        e.pop("ties", None)
    return {"meta": {}, "meter": meters_at[0][1] if meters_at else "4/4", "key": keys_at[0][1] if keys_at else "",
            "clef": {}, "bars": bars, "events": evs, "issues": issues, "tempo": None, "graces": graces,
            "clefs_at": [(s, t, c) for s, t, c in clefs_at], "meters_at": meters_at, "keys_at": keys_at,
            "closes": ["="] * len(bars), "sections": [], "expansion": None, "order": list(range(len(staves))),
            "ly": True, "play": play}

def _play(bar_starts, repeats):
    """The bars in the order they are played, from the score's repeat
    signs and its first and second endings (volta brackets) as LilyPond
    reported them: a repeated passage played `count` times, a bar under
    a bracket played only on the time round its numbers say."""
    spans = list(zip(bar_starts[:-1], bar_starts[1:]))
    n = len(spans)
    if bar_starts and bar_starts[0] > 0:
        spans.insert(0, (Fr(0), bar_starts[0])); n += 1
    def bar_at(t):
        for k, (a, b) in enumerate(spans):
            if a <= t < b: return k
        return n
    starts = {}
    ends = set()
    voltas = []
    for kind, t, nums, count, d in repeats:
        if kind == "start": starts[bar_at(t)] = max(count, 2)
        elif kind == "end": ends.add(bar_at(t) - 1)
    opened = {}
    for kind, t, nums, count, d in sorted(repeats, key=lambda r: r[1]):
        if kind == "volta" and d == -1: opened[nums] = bar_at(t)
        elif kind == "volta" and d == 1 and nums in opened: voltas.append((opened.pop(nums), bar_at(t), nums))
    for nums, a in opened.items(): voltas.append((a, a + 1, nums))
    def under(k):
        return [v for v in voltas if v[0] <= k < v[1]]
    order, i, home, times, lap, guard = [], 0, 0, 2, 1, 0
    while i < n and guard < 50 * n + 50:
        guard += 1
        if i in starts and (lap == 1 or i != home):
            home, times, lap = i, starts[i], 1
        brackets = under(i)
        if brackets and not any(lap in v[2] for v in brackets):
            i += 1; continue
        if not brackets and lap > 1 and i > max(ends | {-1}) and i not in ends:
            lap = 1
        order.append(i)
        if i in ends and lap < times:
            lap += 1; i = home; continue
        i += 1
    return order

def _groups(evs, bar_starts):
    out = {}
    for e in evs:
        b = bisect.bisect_right(bar_starts, e["t"]) - 1
        out.setdefault((e["staff"], b), []).append(e)
    return out

def _beam(evs, bar_starts, meters_at):
    """Beams as an engraver draws them where the score does not say: the
    quavers and shorter notes of one beat together (a dotted crotchet's
    in 6/8, 9/8 and 12/8), a rest breaking them."""
    def meter_at(t):
        m = meters_at[0][1] if meters_at else "4/4"
        for when, v in meters_at:
            if when <= t: m = v
        return m
    def value(e):
        if e.get("tu"): return e["dur"] * Fr(e["tu"][0], e["tu"][1])
        return e["dur"] * (Fr(3, 2) if e["trip"] else 1)
    lanes = {}
    for e in evs: lanes.setdefault((e["vaddr"], e["staff"]), []).append(e)
    group = 0
    for lst in lanes.values():
        lst.sort(key=lambda e: e["t"])
        run, manual = [], False
        def close():
            nonlocal run, group
            if len(run) > 1:
                group += 1
                run[0]["L"] = 1; run[-1]["J"] = 1
            run = []
        for e in lst:
            if manual:
                run.append(e)
                if e["beam"] == 1: manual = False; close()
                continue
            if e["beam"] == -1 and not e["rest"]:
                close(); manual = True; run = [e]; continue
            short = not e["rest"] and value(e) < 4
            b = bisect.bisect_right(bar_starts, e["t"]) - 1
            bar0 = bar_starts[b] if b >= 0 else 0
            n, d = map(int, meter_at(e["t"]).split("/"))
            beat = Fr(6) if d == 8 and n % 3 == 0 else Fr(16, d) if d <= 4 else Fr(4)
            if d == 2: beat = Fr(4)
            here = (e["t"] - bar0) // beat
            if run:
                last = run[-1]
                lb = bisect.bisect_right(bar_starts, last["t"]) - 1
                if not short or lb != b or (last["t"] - (bar_starts[lb] if lb >= 0 else 0)) // beat != here or last["t"] + last["dur"] != e["t"]:
                    close()
            if short: run.append(e)
        close()

# ============================================================
# THE DRUMS — the owner, 2026-10-01: "One can be piano, another can be a
# drum version, a third can be a guitar version". A drum part is not a
# score anyone wrote down: these are real drummers playing grooves from
# all over the world — afrobeat, highlife, samba, joropo, chacarera, a
# merengue in five — recorded on an electronic kit as they played, in
# Google Magenta's Groove MIDI Dataset (Gillick, Roberts, Engel, Norouzi
# and Bamman, 2019; CC BY 4.0 — https://magenta.tensorflow.org/datasets/groove).
# Their playing is written down here as a drummer would read it: every
# beat set on the finest of a semiquaver, quaver-triplet or semiquaver-
# triplet grid that fits it, the hands (stems up) over the feet (stems
# down), cymbals as crosses, a ghost note on the snare in brackets — and
# how hard each was struck kept, so it is played back as it was played.
# It needs `pip install mido`, and the dataset downloaded and unzipped:
#
#   curl -LO https://storage.googleapis.com/magentadata/datasets/groove/groove-v1.0.0-midionly.zip
#   unzip groove-v1.0.0-midionly.zip -d /tmp      # makes /tmp/groove
# ============================================================
# The Roland TD-11's notes, as the dataset records them, and what each is.
KIT_OF = {36: "kick", 38: "snare", 40: "snare", 37: "side", 48: "tom1", 50: "tom1", 45: "tom2", 47: "tom2",
          43: "tom3", 58: "tom3", 42: "hh", 22: "hh", 46: "hho", 26: "hho", 44: "hhp",
          49: "crash", 55: "crash", 57: "crash", 52: "crash", 51: "ride", 59: "ride", 53: "bell"}
# Where each stands on a drum stave, as a step above middle C (as a note
# would on the treble staff): the bass drum in the bottom space, the snare
# in the third, the toms above it and the floor tom below, the cymbals
# over the stave and the hi-hat's pedal under it.
KIT_AT = {"kick": 3, "snare": 7, "side": 7, "tom1": 9, "tom2": 8, "tom3": 5, "hh": 11, "hho": 11, "hhp": 1,
          "crash": 12, "ride": 10, "bell": 10}
FEET = ("kick", "hhp")

def read_groove(path, bpm):
    import mido
    m = mido.MidiFile(path)
    hits, meter = [], (4, 4)
    for tr in m.tracks:
        t = 0
        for msg in tr:
            t += msg.time
            if msg.type == "time_signature": meter = (msg.numerator, msg.denominator)
            if msg.type == "note_on" and msg.velocity > 0 and msg.note in KIT_OF:
                hits.append((Fr(t, m.ticks_per_beat), KIT_OF[msg.note], msg.velocity))
    hits.sort(key=lambda h: h[0])
    # A drummer plays a hair ahead of or behind the click: that lean,
    # taken off first.
    lean = sorted(float(b * 4 - round(b * 4)) / 4 for b, _, _ in hits)
    lean = Fr(lean[len(lean) // 2]).limit_denominator(480)
    n, d = meter
    unit = Fr(1) if d == 4 else Fr(1, 2)            # what a grid is laid over: a crotchet, or a quaver in x/8
    grids = (4, 3, 6, 2) if d == 4 else (2, 3, 1)
    per_bar = Fr(n * 4, d)                           # crotchets in a bar
    hits = [(b - lean, k, v) for b, k, v in hits]
    last = max(b for b, _, _ in hits)
    bars_n = int(last // per_bar) + 1
    units_n = int(per_bar / unit)
    slots = {}                                       # (bar, unit) -> {(position, voice): {kit: velocity}}
    by_unit = {}
    for b, k, v in hits:
        u = int((b + unit / 8) // unit)
        by_unit.setdefault(u, []).append((b - u * unit, k, v))
    def fit(g, items):
        return sum(abs(float(p / unit * g - round(p / unit * g))) / g * v for p, _, v in items)
    out_bars = []
    for bi in range(bars_n):
        bar = {"units": num(per_bar * 4), "right": [[], []]}
        group = 0
        for ui in range(units_n):
            u = bi * units_n + ui
            items = by_unit.get(u, [])
            # The grid: plain semiquavers unless a triplet grid fits it
            # clearly better.
            best, err = grids[0], fit(grids[0], items)
            for g in grids[1:]:
                e = fit(g, items)
                if e < err * 0.6: best, err = g, e
            at = {}
            for p, k, v in items:
                q = Fr(round(p / unit * best), best)
                if q >= 1: continue                   # belongs to the next beat (taken there)
                q = max(Fr(0), q)
                voice = 1 if k in FEET else 0
                cell = at.setdefault((q, voice), {})
                cell[k] = max(cell.get(k, 0), v)
            trip = best in (3, 6)
            for voice in (0, 1):
                onsets = sorted(q for (q, vv) in at if vv == voice)
                lst = bar["right"][voice]
                start = ui * unit * 4                 # semiquavers into the bar
                length = unit * 4
                if not onsets:
                    lst.append({"t": num(start), "dur": num(length), "rest": 1})
                    continue
                if onsets[0] > 0:
                    r = {"t": num(start), "dur": num(onsets[0] * length), "rest": 1}
                    if trip and (onsets[0] * best) % 1 == 0 and (onsets[0] * length) not in (1, 2, 3): r["trip"] = 1
                    lst.append(r)
                beamed = [q for q in onsets]
                if len(beamed) > 1: group += 1
                for i, q in enumerate(onsets):
                    nxt = onsets[i + 1] if i + 1 < len(onsets) else Fr(1)
                    cell = at[(q, voice)]
                    kits = sorted(cell, key=lambda k: KIT_AT[k])
                    o = {"t": num(start + q * length), "dur": num((nxt - q) * length), "ds": [KIT_AT[k] for k in kits],
                         "dr": kits, "vl": [cell[k] for k in kits]}
                    gh = [1 if k == "snare" and cell[k] < 45 else 0 for k in kits]
                    if any(gh): o["gh"] = gh
                    if trip: o["trip"] = 1
                    if voice == 0 and len(onsets) > 1 and (nxt - q) * length < 4: o["beam"] = group
                    if voice == 1 and len(onsets) > 1 and (nxt - q) * length < 4: o["beam"] = 100 + group
                    lst.append(o)
        # Silent beats of a voice read as one rest: a whole bar's, or two
        # crotchets' as a minim on either half of a bar of four.
        for v, lst in enumerate(bar["right"]):
            if all(e.get("rest") for e in lst):
                bar["right"][v] = [{"t": 0, "dur": bar["units"], "rest": 1}]
                continue
            if (n, d) == (4, 4):
                merged = []
                for e in lst:
                    last = merged[-1] if merged else None
                    if (e.get("rest") and last and last.get("rest") and last["dur"] == 4 and e["dur"] == 4
                            and last["t"] in (0, 8) and not e.get("trip") and not last.get("trip")):
                        last["dur"] = 8
                    else:
                        merged.append(dict(e))
                bar["right"][v] = merged
        out_bars.append(bar)
    # The count-in — a bar or two before the groove starts, a stroke here
    # and there — is left out: the stave starts where the playing does.
    while len(out_bars) > 4 and sum(1 for v in out_bars[0]["right"] for e in v if not e.get("rest")) < 6:
        out_bars.pop(0)
    return {"meter": [str(n), str(d)], "bars": out_bars, "tempo": bpm}

def excerpt(score, count):
    """The first `count` bars (and a pickup before them, if any)."""
    bars = score["bars"]
    starts = [t for _, t in bars]
    out = []
    # a pickup: music before the first barline
    if starts and starts[0] > 0:
        out.append({"number": 0, "start": Fr(0), "end": starts[0]})
    for k in range(len(starts) - 1):
        if len([b for b in out if b["number"] != 0]) >= count: break
        out.append({"number": bars[k][0], "start": starts[k], "end": starts[k + 1]})
    return out


def sig_of(k):
    sig = [0] * 7
    for m in re.finditer(r"([a-g])(#|-)", k or ""):
        sig[LETTERS.index(m.group(1))] = 1 if m.group(2) == "#" else -1
    return sig

def num(x):
    x = Fr(x)
    return int(x) if x.denominator == 1 else round(float(x), 6)

def hands_of(s, t):
    """Which staff is which hand: for a LilyPond score, the upper and the
    lower; for **kern, the treble at the start is the right hand. A
    guitar's one staff is its right hand alone."""
    if s.get("ly"):
        order = s["order"]
        if len(order) > 2:
            # An ossia or an introduction on a staff of its own: the two
            # staves that carry the most of the music are the hands.
            count = {k: sum(1 for e in s["events"] if e["staff"] == k) for k in order}
            order = sorted(sorted(order, key=lambda k: -count[k])[:2])
        if len(order) == 1: return order[0], None
        if len(order) == 2: return order[0], order[1]
        return None, None
    at = {}
    for staff, when, f in s["clefs_at"]:
        if when <= t or staff not in at: at[staff] = f
    right = [k for k in at if at[k] == "*clefG2"]
    left = [k for k in at if at[k] == "*clefF4"]
    guitar = [k for k in at if at[k] == "*clefGv2"]
    if len(at) == 1 and guitar: return guitar[0], None
    if len(right) == 1 and len(left) == 1 and len(at) == 2: return right[0], left[0]
    return None, None

CLEF_LETTER = {"*clefG2": "G", "*clefF4": "F", "*clefGv2": "g", "*clefX": "X"}

def clef_at(s, staff, t):
    """The clef a staff is in at `t` (a letter: G treble, F bass, g a
    guitar's treble an octave down, X percussion)."""
    now = None
    for st, when, f in s["clefs_at"]:
        if st == staff and (when <= t or now is None): now = CLEF_LETTER.get(f, f)
    return now or "G"

def convert(s, nbars, skip=0):
    bars = excerpt(s, nbars + skip)
    if skip:
        bars = [b for b in bars if b["number"] != 0][skip:]
    if not bars:
        return None, "no bars"
    t0 = bars[0]["start"]
    why = []
    right, left = hands_of(s, t0)
    if right is None:
        return None, "staves"
    hands = [("right", right)] + ([("left", left)] if left is not None else [])
    # The opening goes as far as its clefs stay as they began.
    first = "".join(clef_at(s, st, t0) for _, st in hands)
    keep = []
    for bar in bars:
        if "".join(clef_at(s, st, bar["start"]) for _, st in hands) != first: break
        if any(st == k and bar["start"] < t < bar["end"] for _, k in hands for st, t, f in s["clefs_at"]) and keep: break
        keep.append(bar)
    bars = keep
    if not bars or (len(bars) == 1 and bars[0]["number"] == 0):
        return None, "clefs"
    t1 = bars[-1]["end"]
    if any(t0 <= t < t1 for _, t in s["graces"]): why.append("grace")
    meters = [m for t, m in s["meters_at"] if t <= t0]
    meter = meters[-1] if meters else s["meter"]
    if any(t0 < t < t1 for t, m in s["meters_at"]): why.append("meter change")
    n, d = map(int, meter.split("/"))
    units = Fr(n * 16, d)
    sig = sig_of(s["key"])
    count = sum(1 for v in sig if v)
    sharps = any(v > 0 for v in sig)
    if why:
        return None, ", ".join(why)
    out_bars = []
    for bar in bars:
        b = {"units": num(bar["end"] - bar["start"])}
        if bar["end"] - bar["start"] != units:
            if bar["number"] == 0: b["pickup"] = 1
            else: return None, "bar %s is %s not %s" % (bar["number"], bar["end"] - bar["start"], units)
        for hand, staff in hands:
            ev = sorted([e for e in s["events"] if e["staff"] == staff and bar["start"] <= e["t"] < bar["end"]], key=lambda e: (e["t"], e["voice"]))
            vids = sorted({e["voice"] for e in ev})
            if len(vids) > 2: return None, "%d voices" % len(vids)
            # Accidentals as an engraver writes them, across the staff's voices.
            state = {}
            voices = []
            for v in vids:
                voices.append([])
            beam = {v: [0, 0] for v in vids}  # depth, id
            for e in ev:
                vi = vids.index(e["voice"])
                o = {"t": num(e["t"] - bar["start"]), "dur": num(e["dur"])}
                if e["dur"] < Fr(1, 2): return None, "too short"
                if e["rest"]:
                    o["rest"] = 1
                    if e["hidden"]: o["hidden"] = 1
                else:
                    ds, al, acc = [], [], []
                    for step, alter, nat in sorted(e["notes"]):
                        if abs(alter) > 1: return None, "double accidental"
                        ds.append(step); al.append(alter)
                        was = state.get(step, sig[step % 7])
                        tied_in = "]" in e["tie"] or "_" in e["tie"]
                        if alter != was and not tied_in:
                            acc.append("sharp" if alter > 0 else "flat" if alter < 0 else "natural")
                        else:
                            acc.append(None)
                        state[step] = alter
                    o["ds"] = ds; o["al"] = al
                    if any(acc): o["acc"] = acc
                    if "[" in e["tie"] or "_" in e["tie"]: o["tie"] = 1
                    if "]" in e["tie"] or "_" in e["tie"]: o["tied"] = 1
                if e["stem"]: o["up"] = 1 if e["stem"] == "up" else 0
                if e["trip"]: o["trip"] = 1
                if e.get("tu"): o["tu"] = list(e["tu"])
                bm = beam[e["voice"]]
                if e["L"] and bm[0] == 0:
                    bm[1] += 1
                bm[0] += e["L"]
                if bm[0] > 0 or e["J"]:
                    o["beam"] = bm[1]
                bm[0] = max(0, bm[0] - e["J"])
                if e["so"]: o["slur"] = 1
                if e["sc"]: o["slurEnd"] = 1
                voices[vi].append(o)
            # Each voice fills its bar.
            for vi, vv in enumerate(voices):
                total = sum(Fr(x["dur"]).limit_denominator(48) for x in vv)
                if abs(float(total) - float(bar["end"] - bar["start"])) > 1e-6:
                    return None, "%s voice %d of bar %s adds to %s" % (hand, vi, bar["number"], total)
            b[hand] = voices
        out_bars.append(b)
    out = {"meter": [str(n), str(d)], "sig": sig, "count": count, "sharps": sharps, "bars": out_bars,
           "composer": s["meta"].get("COM", ""), "title": s["meta"].get("OTL", "")}
    if first != "GF": out["clef"] = first
    return out, None



# ============================================================
# THE WHOLE OF A PIECE — the owner, 2026-10-01: "when you hover it, i
# want them to play the entire composition and the notes change visually
# too as it plays". Every bar of it, as written once, and the ORDER it is
# played in, its repeats and first and second endings taken as the score
# has them. Looser than the opening, because a whole piece has whatever
# its score has in it:
#   grace notes        left out (a margin's stave has no room for them);
#   a change of clef   kept to the hand's own staff, with ledger lines;
#   a change of key    or of metre, carried on the bar (`k`, `m`, into the
#                      piece's `keys` and `meters`), and a stave starts a
#                      new line there, as an engraver would;
#   a third voice      folded into the other two as chord notes where it
#                      sounds with them, and otherwise left out;
#   a double sharp     or flat, written as the note it sounds;
#   a voice that does  not fill its bar, filled with hidden rests.
# ============================================================
def respell(step, alter):
    """A double sharp or flat as the plain note it sounds."""
    while alter > 1 or alter < -1:
        d = 1 if alter > 0 else -1
        here = SEMI[step % 7] + 12 * (step // 7)
        step += d
        there = SEMI[step % 7] + 12 * (step // 7)
        alter -= (there - here)
    return step, alter

SEMI = [0, 2, 4, 5, 7, 9, 11]

def order_of(s, spans):
    """The bars in the order they are played: by the score's own list of
    its sections where it has one, and otherwise by its repeat signs, a
    first ending taken the first time round and a second the second. A
    span is (start, end, pickup, the bar line before it, the bar line
    after it)."""
    n = len(spans)
    secs = s["sections"]
    def first_bar(t):
        for k, sp in enumerate(spans):
            if sp[0] >= t: return k
        return n
    ranges = {}
    if secs:
        ts = [first_bar(t) for _, t in secs] + [n]
        for i, (label, _) in enumerate(secs):
            if label not in ranges and ts[i + 1] > ts[i]:
                ranges[label] = (ts[i], ts[i + 1])
    exp = s["expansion"]
    if exp and ranges:
        names = exp.split(",") if "," in exp else None
        if not names:
            # Written without commas: read greedily, the longest label first.
            names, rest = [], exp
            known = sorted(ranges, key=len, reverse=True)
            while rest:
                hit = next((k for k in known if rest.startswith(k)), None)
                if not hit: names = None; break
                names.append(hit); rest = rest[len(hit):]
        if names and all(x in ranges for x in names):
            return runs_of([k for x in names for k in range(*ranges[x])])
    # By the repeat signs. Which bars are a first or a second ending:
    ending = [0] * n
    for label, (a, b) in ranges.items():
        m = re.match(r".*?(\d+)$", label)
        if m and label[:-len(m.group(1))] in ranges:
            for k in range(a, b): ending[k] = int(m.group(1))
    order, i, start, second, done, guard = [], 0, 0, False, set(), 0
    while i < n and guard < 20 * n:
        guard += 1
        if "|:" in spans[i][3] and i != start:
            start, second = i, False
        if second and ending[i] == 1:
            i += 1; continue
        order.append(i)
        if ":|" in spans[i][4] and (start, i) not in done:
            done.add((start, i)); second = True; i = start; continue
        if ":|" in spans[i][4] or (ending[i] == 2 and (i + 1 >= n or ending[i + 1] != 2)):
            # A repeat played twice: the next one starts after it, unless
            # it says otherwise.
            second = False; start = i + 1
        i += 1
    return runs_of(order)

def runs_of(order):
    runs = []
    for k in order:
        if runs and runs[-1][1] == k: runs[-1][1] = k + 1
        else: runs.append([k, k + 1])
    return runs

def whole(s):
    marks = s["bars"]
    starts = [t for _, t in marks]
    close = s["closes"]
    spans = []
    if starts and starts[0] > 0:
        spans.append((Fr(0), starts[0], True, "", close[0]))
    for k in range(len(starts) - 1):
        if starts[k + 1] > starts[k]:
            spans.append((starts[k], starts[k + 1], False, close[k], close[k + 1]))
    right, left = hands_of(s, Fr(0))
    if right is None:
        return None, "staves"
    hands = [("right", right)] + ([("left", left)] if left is not None else [])
    keys, meters, clefs = [], [], []
    def at(changes, t, first):
        now = first
        for when, v in changes:
            if when <= t: now = v
        return now
    report = {"dropped": 0, "folded": 0, "respelt": 0, "filled": 0}
    out_bars = []
    for (a, b, pickup, _, _) in spans:
        key = at(s["keys_at"], a, s["key"] or "")
        meter = at(s["meters_at"], a, s["meter"])
        if key not in keys: keys.append(key)
        if meter not in meters: meters.append(meter)
        sig = sig_of(key)
        bar = {"units": num(b - a)}
        nn, dd = map(int, meter.split("/"))
        if b - a != Fr(nn * 16, dd) and pickup: bar["pickup"] = 1
        if keys.index(key): bar["k"] = keys.index(key)
        if meters.index(meter): bar["m"] = meters.index(meter)
        # Each hand in the clef it is in as the bar begins.
        clef = "".join(clef_at(s, st, a) for _, st in hands)
        if clef not in clefs: clefs.append(clef)
        if clefs.index(clef): bar["c"] = clefs.index(clef)
        for hand, staff in hands:
            ev = [e for e in s["events"] if e["staff"] == staff and a <= e["t"] < b]
            byv = {}
            for e in sorted(ev, key=lambda e: (e["t"], e["voice"])):
                byv.setdefault(e["voice"], []).append(dict(e, notes=list(e["notes"])))
            # A voice only of hidden rests is no voice at all.
            vids = [v for v in sorted(byv) if any(not x["hidden"] for x in byv[v])] or sorted(byv)[:1]
            lists = [byv[v] for v in vids] if vids else [[]]
            # A third voice, folded in.
            while len(lists) > 2:
                extra = lists.pop()
                for e in extra:
                    if e["rest"]: continue
                    host = next((h for l in lists for h in l if not h["rest"] and h["t"] == e["t"] and h["dur"] == e["dur"]), None) \
                        or next((h for l in lists for h in l if not h["rest"] and h["t"] == e["t"]), None)
                    if host:
                        host["notes"] += [n for n in e["notes"] if n[:2] not in [m[:2] for m in host["notes"]]]
                        report["folded"] += 1
                    else:
                        report["dropped"] += 1
            state = {}
            voices = []
            for vi, lst in enumerate(lists):
                vv = []
                beam = [0, 0]
                clock = a
                def hole(upto):
                    if upto > clock:
                        vv.append({"t": num(clock - a), "dur": num(upto - clock), "rest": 1, "hidden": 1})
                        report["filled"] += 1
                for e in lst:
                    if e["t"] < clock: continue        # overlaps what is already there
                    hole(e["t"])
                    o = {"t": num(e["t"] - a), "dur": num(min(e["dur"], b - e["t"]))}
                    clock = e["t"] + Fr(o["dur"]).limit_denominator(4800)
                    if e["rest"]:
                        o["rest"] = 1
                        if e["hidden"]: o["hidden"] = 1
                    else:
                        ds, al, acc = [], [], []
                        seen = set()
                        for step, alter, nat in sorted(e["notes"]):
                            if abs(alter) > 1:
                                step, alter = respell(step, alter); report["respelt"] += 1
                            if step in seen: continue
                            seen.add(step)
                            ds.append(step); al.append(alter)
                            was = state.get(step, sig[step % 7])
                            tied_in = "]" in e["tie"] or "_" in e["tie"]
                            acc.append(("sharp" if alter > 0 else "flat" if alter < 0 else "natural") if alter != was and not tied_in else None)
                            state[step] = alter
                        o["ds"] = ds; o["al"] = al
                        if any(acc): o["acc"] = acc
                        if "[" in e["tie"] or "_" in e["tie"]: o["tie"] = 1
                        if "]" in e["tie"] or "_" in e["tie"]: o["tied"] = 1
                    if e["stem"]: o["up"] = 1 if e["stem"] == "up" else 0
                    if e["trip"]: o["trip"] = 1
                    if e.get("tu"): o["tu"] = list(e["tu"])
                    if e["L"] and beam[0] == 0: beam[1] += 1
                    beam[0] += e["L"]
                    if beam[0] > 0 or e["J"]: o["beam"] = beam[1]
                    beam[0] = max(0, beam[0] - e["J"])
                    if e["so"]: o["slur"] = 1
                    if e["sc"]: o["slurEnd"] = 1
                    vv.append(o)
                hole(b)
                voices.append(vv)
            bar[hand] = voices
        out_bars.append(bar)
    order = runs_of(s["play"]) if s.get("play") else order_of(s, spans)
    out = {"keys": [sig_of(k) for k in keys], "meters": [m.split("/") for m in meters], "bars": out_bars, "order": order}
    if clefs != ["GF"]: out["clefs"] = clefs
    return out, report


def opening_of(w, count=4):
    """A piece's opening, from the whole of it: its first bars in the
    order they are played — an upbeat and up to `count` more — as far as
    its key, metre and clefs stay as they began. (For a LilyPond score,
    whose voices come and go mid-bar where **kern's always fill it.)"""
    seq = [k for a, b in w["order"] for k in range(a, b)]
    first = w["bars"][seq[0]]
    k, m, c = first.get("k", 0), first.get("m", 0), first.get("c", 0)
    bars = []
    for i in seq:
        bar = w["bars"][i]
        if (bar.get("k", 0), bar.get("m", 0), bar.get("c", 0)) != (k, m, c): break
        if bar.get("pickup") and bars: break
        bars.append({x: v for x, v in bar.items() if x not in ("k", "m", "c")})
        if len([b for b in bars if not b.get("pickup")]) >= count: break
    sig = w["keys"][k]
    out = {"meter": w["meters"][m], "sig": sig, "count": sum(1 for v in sig if v), "sharps": any(v > 0 for v in sig), "bars": bars}
    clef = (w.get("clefs") or ["GF"])[c]
    if clef != "GF": out["clef"] = clef
    return out


# THE PIECES — the owner, 2026-10-01: "make it so that not all of them
# are polish. I want you to search online and find some stuff from all
# over the world ... the more complex, the better. One can be piano,
# another can be a drum version, a third can be a guitar version."
#
# Each is one line: where it is (`kern`, a part of a **kern file's name
# in Polish Music Heritage, with `must`, something more to tell it from
# its neighbours; `ly`, a Mutopia score's path; `groove`, a drum
# performance's path in the Groove MIDI Dataset), its composer — and
# where they were from — and title as the page shows them, a tempo in
# crotchets a minute read off the score's own marking, and whether it is
# for a guitar (`inst`). A score from anywhere else needs its own credit
# at the foot of houses/qimu-and-musicians.html.
PIECES = [
    # POLAND — Polish Music Heritage in Open Access, CC BY 4.0.
    {"kern": "szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-d-moll", "must": "001-014", "composer": "Maria Szymanowska · Poland", "title": "Prélude No. 14, Vingt exercices et préludes (1819)", "tempo": 90},
    {"kern": "szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-c-moll", "must": "001-015", "composer": "Maria Szymanowska · Poland", "title": "Prélude No. 15, Vingt exercices et préludes (1819)", "tempo": 80},
    {"kern": "szymanowska-maria--caprice-sur-la-romance-de-joconde", "must": "mzk-m-124", "composer": "Maria Szymanowska · Poland", "title": "Caprice sur la romance de Joconde", "tempo": 88},
    {"kern": "zelenski-wladyslaw--sechs-charakterstucke-op-17-no-1", "must": "", "composer": "Władysław Żeleński · Poland", "title": "Praeludium, Sechs Charakterstücke Op. 17 No. 1 (1872)", "tempo": 56},
    {"kern": "zelenski-wladyslaw--sonate-op-20-allegro-con-moto", "must": "", "composer": "Władysław Żeleński · Poland", "title": "Allegro con moto, Sonata Op. 20", "tempo": 120},
    {"kern": "krogulski-jozef-wladyslaw--mazur", "must": "--007_", "composer": "Józef Krogulski · Poland", "title": "Mazur", "tempo": 84},
    {"kern": "sowinski-wojciech--les-charmes-de-la-campagne-op-11-no-2", "must": "", "composer": "Wojciech Sowiński · Poland", "title": "Les Charmes de la campagne Op. 11 No. 2", "tempo": 104},
    {"kern": "wysocki-kasper-napoleon--walc-rewolucyjny", "must": "", "composer": "Kasper Napoleon Wysocki · Poland", "title": "Walc rewolucyjny (1831)", "tempo": 138},
    # THE REST OF THE WORLD, held in Polish archives — the same collection.
    {"kern": "isouard-nicolas--ariette", "must": "", "composer": "Nicolas Isouard · Malta", "title": "Ariette", "tempo": 76},
    {"kern": "schall-claus-nielsen--andante", "must": "", "composer": "Claus Schall · Denmark", "title": "Andante", "tempo": 66},
    {"kern": "rossini-gioachino--polonaise-de-l-opera-tancred", "must": "", "composer": "Gioachino Rossini · Italy", "title": "Polonaise from the opera Tancredi", "tempo": 96},
    # And from the Mutopia Project's editions, public domain unless said.
    {"ly": "DebussyC/L66/debussy_Arabesque_1/debussy_Arabesque_1.ly", "composer": "Claude Debussy · France", "title": "Première Arabesque (1891)", "tempo": 76},
    {"ly": "LisztF/ballade/ballade.ly", "composer": "Franz Liszt · Hungary", "title": "Ballade No. 2 in B minor (1853)", "tempo": 96},
    {"ly": "RachmaninoffS/O23/rach-prelude23-05/rach-prelude23-05.ly", "composer": "Sergei Rachmaninoff · Russia", "title": "Prelude in G minor, Op. 23 No. 5 (1901)", "tempo": 100, "licence": "BY-SA"},
    {"ly": "ScriabinA/O11/Scriabin_prelude_op11no1/Scriabin_prelude_op11no1.ly", "composer": "Alexander Scriabin · Russia", "title": "Prelude in C major, Op. 11 No. 1 (1895)", "tempo": 70},
    {"ly": "TchaikovskyPI/O59/dumka/dumka.ly", "composer": "Pyotr Ilyich Tchaikovsky · Russia", "title": "Dumka, Op. 59 (1886)", "tempo": 72},
    {"ly": "AlbenizIMF/O71/Rumores_de_la-caleta/Rumores_de_la-caleta.ly", "composer": "Isaac Albéniz · Spain", "title": "Rumores de la Caleta, Op. 71 No. 6 (1887)", "tempo": 132},
    {"ly": "AlkanCV/O75/toccatina/toccatina-lys/toccatina.ly", "composer": "Charles-Valentin Alkan · France", "title": "Toccatina, Op. 75", "tempo": 132, "licence": "BY-SA"},
    {"ly": "JoplinS/EliteSyncopations/EliteSyncopations.ly", "composer": "Scott Joplin · United States", "title": "Elite Syncopations (1902)", "tempo": 76},
    {"ly": "PejacsevichD/O4/Gondellied/Gondellied.ly", "composer": "Dora Pejačević · Croatia", "title": "Gondellied, Op. 4", "tempo": 72},
    {"ly": "BartokB/rom_folk_dance_1_bartok/rom_folk_dance_1_bartok.ly", "composer": "Béla Bartók · Hungary", "title": "Romanian Folk Dance No. 1, Jocul cu bâtă (1915)", "tempo": 80},
    {"ly": "ScarlattiD/ds_sonate_c/ds_sonate_c.ly", "composer": "Domenico Scarlatti · Italy and Spain", "title": "Sonata in C major", "tempo": 120},
    {"ly": "GriegE/O12/No03_Albumblatt/No03_Albumblatt.ly", "composer": "Edvard Grieg · Norway", "title": "Albumblad, Lyric Pieces Op. 12 No. 7", "tempo": 92, "licence": "BY-SA"},
    {"ly": "IlievGK/A_Childs_Wish/A_Childs_Wish.ly", "composer": "Grigor Iliev · Bulgaria", "title": "A Child's Wish (2006)", "tempo": 81, "licence": "BY"},
    # CHINA — transcribed here by hand from photographs of the composer's
    # manuscript the owner found (its notes are in the file itself).
    {"ly": "xiao-youmei/vorwaerts-marsch.ly", "here": True, "composer": "Xiao Youmei 蕭友梅 · China", "title": "Vorwärts Marsch im Schneesturm, Op. 23", "tempo": 112},
    # THE GUITAR.
    {"ly": "TarregaF/recuerdos/recuerdos-lys/recuerdos-a4.ly", "inst": "guitar", "composer": "Francisco Tárrega · Spain", "title": "Recuerdos de la Alhambra (1896)", "tempo": 72, "licence": "BY-SA"},
    {"ly": "TarregaF/capricho-arabe/capricho-arabe.ly", "inst": "guitar", "composer": "Francisco Tárrega · Spain", "title": "Capricho Árabe (1892)", "tempo": 60, "licence": "BY-SA"},
    {"ly": "MatiegkaWT/Matiegka5/Matiegka5.ly", "inst": "guitar", "composer": "Wenzel Thomas Matiegka · Bohemia", "title": "Sonata, Op. 31 No. 5", "tempo": 72},
    {"ly": "HoretzkyF/horetzky60/horetzky60.ly", "inst": "guitar", "composer": "Feliks Horetzky · Ukraine", "title": "Study No. 60", "tempo": 80},
    {"ly": "SanzG/sanz-1/sanz-1.ly", "inst": "guitar", "composer": "Gaspar Sanz · Spain", "title": "Preludio", "tempo": 120},
    {"ly": "Traditional/Greensleaves/Greensleaves.ly", "inst": "guitar", "composer": "Traditional · England", "title": "Greensleaves", "tempo": 160},
    # THE DRUMS — Groove MIDI Dataset, CC BY 4.0: drummers playing.
    {"groove": "drummer8/session2/31_afrobeat_98_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Afrobeat · Nigeria", "tempo": 98},
    {"groove": "drummer8/session2/42_highlife_126_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Highlife · Ghana", "tempo": 126},
    {"groove": "drummer1/session1/183_afrocuban_105_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Afro-Cuban · Cuba", "tempo": 105},
    {"groove": "drummer5/session2/17_latin-brazilian-samba_110_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Samba · Brazil", "tempo": 110},
    {"groove": "drummer5/session2/15_latin-venezuelan-joropo_80_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Joropo · Venezuela", "tempo": 80},
    {"groove": "drummer5/session1/8_latin-venezuelan-merengue_162_beat_5-8.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Merengue in five · Venezuela", "tempo": 162},
    {"groove": "drummer1/session2/1_latin-chacarera_157_beat_3-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Chacarera · Argentina", "tempo": 157},
    {"groove": "drummer5/session1/19_middleeastern_126_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Middle Eastern", "tempo": 126},
    {"groove": "drummer1/session1/184_reggae_78_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Reggae · Jamaica", "tempo": 78},
    {"groove": "drummer5/session2/7_neworleans-secondline_124_beat_4-4.mid", "composer": "A groove played by a drummer · Groove MIDI Dataset", "title": "Second line · New Orleans", "tempo": 124},
]


def main(polish, mutopia, groove, out_path):
    out = []
    wholes = []
    for one in PIECES:
        meta = {"composer": one["composer"], "title": one["title"], "tempo": one["tempo"]}
        if one.get("inst"): meta["inst"] = one["inst"]
        if "groove" in one:
            path = os.path.join(groove, one["groove"])
            if not os.path.exists(path):
                print("not found:", one["groove"]); continue
            g = read_groove(path, one["tempo"])
            w = {"keys": [[0] * 7], "meters": [g["meter"]], "bars": g["bars"], "order": [[0, len(g["bars"])]], "clefs": ["X"]}
            best = opening_of(w)
            meta["inst"] = "drums"
            best.update(meta)
            best["file"] = w["file"] = os.path.basename(path)
            out.append(best); wholes.append(w)
            print("ok", one["title"], "·", len(w["bars"]), "bars")
            continue
        if "kern" in one:
            files = [f for f in glob.glob(os.path.join(polish, "*", "kern", "*.krn")) if one["kern"] in f and one["must"] in f]
            if len(files) != 1:
                print("not found:", one["kern"], one["must"]); continue
            s = parse(files[0])
        else:
            files = [os.path.join(os.path.dirname(os.path.abspath(__file__)) if one.get("here") else mutopia, one["ly"])]
            s = read_ly(files[0], guitar=one.get("inst") == "guitar")
            if not s:
                print("not read:", one["ly"]); continue
        w, report = whole(s)
        best = None
        if not s.get("ly"):
            for n in (4, 3, 2):
                best, why = convert(s, n)
                if best: break
        if not best and w:
            best = opening_of(w)
        if not best:
            print("left out:", one.get("kern") or one.get("ly")); continue
        best.update(meta)
        best["file"] = os.path.basename(files[0])
        out.append(best)
        if w:
            w["file"] = best["file"]
            wholes.append(w)
            print("ok", one["composer"], "-", one["title"], "·", len(w["bars"]), "bars,", sum(b - a for a, b in w["order"]), "played", report)
        else:
            print("ok", one["composer"], "-", one["title"], "· its opening only:", report)
    def lines(items, key):
        body = json.dumps(items, ensure_ascii=False, separators=(",", ":"))
        return body.replace('},{"' + key + '"', '},\n  {"' + key + '"').replace('[{"' + key + '"', '[\n  {"' + key + '"', 1)
    for piece in out:
        piece.pop("dates", None)
    ordered = [{"meter": p["meter"], **{k: v for k, v in p.items() if k != "meter"}} for p in out]
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(JS_HEAD + "window.QIMU_PIECES = " + lines(ordered, "meter")[:-1] + "\n];\n")
    ordered = [{"file": w["file"], **{k: v for k, v in w.items() if k != "file"}} for w in wholes]
    with open(os.path.join(os.path.dirname(out_path), "qimu-whole.js"), "w", encoding="utf-8") as f:
        f.write(WHOLE_HEAD + "window.QIMU_WHOLE = " + lines(ordered, "file")[:-1] + "\n];\n")


JS_HEAD = """// ============================================================
// QIMU & MUSICIANS' SCORE: the openings of pieces from all over the world
// — for the piano, from Poland, Malta, Denmark, Italy, France, Hungary,
// Russia, Spain, the United States, Croatia, Norway, Bulgaria and China;
// for the guitar, from Spain, Bohemia, Ukraine and England; and grooves
// for the drums, played by real drummers, from Nigeria, Ghana, Cuba,
// Brazil, Venezuela, Argentina, the Middle East, Jamaica and New Orleans
// — as the house page's staves (qimu.js) and the Houses view's
// (motifs.js) draw and play them. The owner, 2026-10-01: "make it so
// that not all of them are polish ... find some stuff from all over the
// world ... One can be piano, another can be a drum version, a third can
// be a guitar version."
//
// FROM Polish Music Heritage in Open Access (polishscores.org, (c) The
// Fryderyk Chopin Institute, CC BY 4.0); the Mutopia Project
// (mutopiaproject.org: public domain, or CC BY-SA / CC BY as each score
// says — what is made here of the CC BY-SA ones is CC BY-SA too); the
// Groove MIDI Dataset (Google Magenta, CC BY 4.0); and Xiao Youmei's
// march, transcribed by hand from his manuscript (tools/xiao-youmei/).
// All credited at the foot of houses/qimu-and-musicians.html. WRITTEN BY
// tools/qimu-pieces.py; change that and run it again rather than
// changing this by hand.
//
// A PIECE: its composer and title, its metre, its key signature (`sig`,
// one alteration a letter, C to B; `count` of them, sharps or flats), a
// tempo in crotchets a minute, what it is played on (`inst`: none for the
// piano, "guitar", "drums"), the clef of each hand where it is not the
// piano's treble and bass (`clef`: G treble, F bass, g a guitar's
// treble, X a drum stave), and its opening BARS. A bar lasts `units`
// semiquavers (an upbeat is marked `pickup`), and each hand — `right`,
// and a piano's `left` — is one or two VOICES, each a list of events
// filling the bar:
//   t, dur   where in the bar it starts and how long it lasts, in
//            semiquavers (a triplet quaver is 4/3)
//   ds, al   its notes as STEPS (letters above middle C: C4 is 0, C5 7,
//            B3 -1) and ALTERS (-1 flat, 0, 1 sharp) — or `rest`
//            (`hidden`: a voice resting unseen)
//   acc      the accidental an engraver writes before each, if any
//   up       which way its stem goes, as the score has it
//   beam     which beam it is under, counted in its voice
//   tie/tied tied to the next / from the last; trip: a triplet; tu: any
//            other tuplet, [how many, in the time of]
//   slur/slurEnd where a slur begins and ends
//   dr, vl   a drum's notes: which drum each is (kick, snare, side, tom1,
//            tom2, tom3, hh, hho, hhp, crash, ride, bell) and how hard it
//            was struck (1 to 127); gh, a ghost note
// ============================================================
"""

WHOLE_HEAD = """// ============================================================
// QIMU & MUSICIANS' SCORE, WHOLE: every bar of the same pieces as
// qimu-pieces.js, and the order they are played in — so that a stave
// pointed at with the sound on plays its piece through to its last note,
// turning over to the next of its bars as it goes. The owner, 2026-10-01:
// "when you hover it, i want them to play the entire composition and the
// notes change visually too as it plays". Fetched by qimu.js only once
// the sound is turned on.
//
// FROM the same sources as qimu-pieces.js, credited at the foot of
// houses/qimu-and-musicians.html (what is made of the Mutopia Project's
// CC BY-SA scores is CC BY-SA too). WRITTEN BY tools/qimu-pieces.py;
// change that and run it again rather than changing this by hand.
//
// A PIECE: its `file` (as in qimu-pieces.js), the key signatures, metres
// and clefs it has (`keys`, `meters`, `clefs`), its BARS — each written
// once, as a bar of qimu-pieces.js is, with `k`, `m` and `c` where its
// key, metre or clefs are not the first — and its ORDER: runs of bars,
// [from, to), in the order they are played, its repeats and first and
// second endings as the score has them.
// ============================================================
"""

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    args = sys.argv[1:] + ["/tmp/polish", "/tmp/mutopia/ftp", "/tmp/groove"][len(sys.argv) - 1:]
    main(args[0], args[1], args[2], os.path.join(here, "..", "qimu-pieces.js"))

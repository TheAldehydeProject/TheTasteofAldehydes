#!/usr/bin/env python3
# ============================================================
# QIMU & MUSICIANS' SCORE, FROM REAL SCORES — run by hand, never by the site
#
# The owner, 2026-09-28: "For the qimu and musicians, i want you to
# actually find sheet music from some obscure piano pieces and display
# that. I also want you to give their name when hovering that piece in a
# light font underneath the sheet music."
#
# This reads the opening bars of the pieces listed in PIECES below out of
# their **kern files — the digital scores of Polish Music Heritage in Open
# Access (https://polishscores.org), (c) The Fryderyk Chopin Institute,
# CC BY 4.0 (https://github.com/pl-wnifc/humdrum-polish-scores) — and
# writes them into qimu-pieces.js as the house page's score (qimu.js) and
# the Houses view (motifs.js) write music: bars of events, each hand in
# one or two voices, every note a STEP (letters above middle C) and an
# ALTER, with the accidentals an engraver writes, which way its stem goes,
# which beam it is under, its ties and its slurs — as the score has them.
#
# It needs no packages. Clone the scores first (only the files it reads
# are fetched):
#
#   git clone --filter=blob:none https://github.com/pl-wnifc/humdrum-polish-scores /tmp/polish
#   python3 tools/qimu-pieces.py /tmp/polish
#
# A piece is taken only where its opening is plain enough to engrave in a
# margin: a treble and a bass staff, no change of clef, key or metre, no
# grace notes, at most two voices a hand, nothing shorter than a
# thirty-second, and every voice filling every bar. Up to four bars of
# each (and an upbeat before them); a stave shows as many as it has room
# for.
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

def convert(path, nbars, skip=0):
    s = parse(path)
    bars = excerpt(s, nbars + skip)
    if skip:
        bars = [b for b in bars if b["number"] != 0][skip:]
    if not bars:
        return None, "no bars"
    t0, t1 = bars[0]["start"], bars[-1]["end"]
    why = []
    # Which staff is which: the treble at the start is the right hand.
    clef_at_start = {}
    for staff, t, f in s["clefs_at"]:
        if t <= t0: clef_at_start[staff] = f
        elif t < t1: why.append("clef change")
    staves = sorted(clef_at_start)
    right = [k for k in staves if clef_at_start[k] == "*clefG2"]
    left = [k for k in staves if clef_at_start[k] == "*clefF4"]
    if len(right) != 1 or len(left) != 1 or len(staves) != 2:
        why.append("clefs %s" % clef_at_start)
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
        for hand, staff in (("right", right[0]), ("left", left[0])):
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
    return {"meter": [str(n), str(d)], "sig": sig, "count": count, "sharps": sharps, "bars": out_bars,
            "composer": s["meta"].get("COM", ""), "title": s["meta"].get("OTL", ""), "dates": s["meta"].get("CDT", ""),
            "file": os.path.basename(path)}, None



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

def whole(path):
    s = parse(path)
    marks = s["bars"]
    starts = [t for _, t in marks]
    close = s["closes"]
    spans = []
    if starts and starts[0] > 0:
        spans.append((Fr(0), starts[0], True, "", close[0]))
    for k in range(len(starts) - 1):
        if starts[k + 1] > starts[k]:
            spans.append((starts[k], starts[k + 1], False, close[k], close[k + 1]))
    staffs = {}
    for staff, t, f in s["clefs_at"]:
        if staff not in staffs: staffs[staff] = f
    right = [k for k in staffs if staffs[k] == "*clefG2"]
    left = [k for k in staffs if staffs[k] == "*clefF4"]
    if len(right) != 1 or len(left) != 1:
        return None, "clefs %s" % staffs
    keys, meters = [], []
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
        for hand, staff in (("right", right[0]), ("left", left[0])):
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
    order = order_of(s, spans)
    return {"file": os.path.basename(path), "keys": [sig_of(k) for k in keys], "meters": [m.split("/") for m in meters],
            "bars": out_bars, "order": order}, report


# The pieces: a part of the file's name (and something more to tell it
# from its neighbours), the composer and title as the page shows them, and
# a tempo in crotchets a minute, read off the score's own marking.
PIECES = [
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-c-dur", "001-006", "Maria Szymanowska", "Prélude No. 6, Vingt exercices et préludes (1819)", 84),
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-es-dur", "001-008", "Maria Szymanowska", "Prélude No. 8, Vingt exercices et préludes (1819)", 76),
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-b-dur", "001-009", "Maria Szymanowska", "Prélude No. 9, Vingt exercices et préludes (1819)", 96),
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-b-dur", "001-013", "Maria Szymanowska", "Prélude No. 13, Vingt exercices et préludes (1819)", 72),
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-d-moll", "001-014", "Maria Szymanowska", "Prélude No. 14, Vingt exercices et préludes (1819)", 90),
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-c-moll", "001-015", "Maria Szymanowska", "Prélude No. 15, Vingt exercices et préludes (1819)", 80),
    ("szymanowska-maria--vingt-exercices-et-preludes-pour-le-pianoforte-preludium-e-dur", "001-018", "Maria Szymanowska", "Prélude No. 18, Vingt exercices et préludes (1819)", 84),
    ("szymanowska-maria--caprice-sur-la-romance-de-joconde", "mzk-m-124", "Maria Szymanowska", "Caprice sur la romance de Joconde", 88),
    ("zelenski-wladyslaw--sechs-charakterstucke-op-17-no-1", "", "Władysław Żeleński", "Praeludium, Sechs Charakterstücke Op. 17 No. 1 (1872)", 56),
    ("zelenski-wladyslaw--sechs-charakterstucke-op-17-no-2", "", "Władysław Żeleński", "Promenade, Sechs Charakterstücke Op. 17 No. 2 (1872)", 66),
    ("zelenski-wladyslaw--sonate-op-20-adagio", "", "Władysław Żeleński", "Adagio, Sonata Op. 20", 40),
    ("zelenski-wladyslaw--sonate-op-20-allegro-con-moto", "", "Władysław Żeleński", "Allegro con moto, Sonata Op. 20", 120),
    ("krogulski-jozef-wladyslaw--mazur", "--007_", "Józef Krogulski", "Mazur", 84),
    ("elsner-jozef--mazur-z-opery-lokietka", "", "Józef Elsner", "Mazur from the opera Łokietek", 88),
    ("mirecki-franciszek--krakowiaki-ofiarowane-polkom-no-6", "", "Franciszek Mirecki", "Krakowiak No. 6, Krakowiaki ofiarowane Polkom", 100),
    ("mirecki-franciszek--krakowiaki-ofiarowane-polkom-no-19", "", "Franciszek Mirecki", "Krakowiak No. 19, Krakowiaki ofiarowane Polkom", 100),
    ("sowinski-wojciech--les-charmes-de-la-campagne-op-11-no-2", "", "Wojciech Sowiński", "Les Charmes de la campagne Op. 11 No. 2", 104),
    ("wysocki-kasper-napoleon--walc-rewolucyjny", "", "Kasper Napoleon Wysocki", "Walc rewolucyjny (1831)", 138),
]


def main(root, out_path):
    out = []
    wholes = []
    for part, must, com, title, tempo in PIECES:
        files = [f for f in glob.glob(os.path.join(root, "*", "kern", "*.krn")) if part in f and must in f]
        if len(files) != 1:
            print("not found:", part, must)
            continue
        best = None
        for n in (4, 3, 2):
            best, why = convert(files[0], n)
            if best:
                break
        if not best:
            print("left out:", part, why)
            continue
        best.update({"composer": com, "title": title, "tempo": tempo})
        del best["dates"]
        out.append(best)
        w, report = whole(files[0])
        if w:
            wholes.append(w)
            print("ok", com, "-", title, "·", len(w["bars"]), "bars,", sum(b - a for a, b in w["order"]), "played", report)
        else:
            print("ok", com, "-", title, "· its opening only:", report)
    body = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    body = body.replace('},{"meter"', '},\n  {"meter"').replace('[{"meter"', '[\n  {"meter"', 1)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(JS_HEAD + "window.QIMU_PIECES = " + body[:-1] + "\n];\n")
    body = json.dumps(wholes, ensure_ascii=False, separators=(",", ":"))
    body = body.replace('},{"file"', '},\n  {"file"').replace('[{"file"', '[\n  {"file"', 1)
    with open(os.path.join(os.path.dirname(out_path), "qimu-whole.js"), "w", encoding="utf-8") as f:
        f.write(WHOLE_HEAD + "window.QIMU_WHOLE = " + body[:-1] + "\n];\n")


JS_HEAD = """// ============================================================
// QIMU & MUSICIANS' SCORE: the openings of eighteen piano pieces by
// composers hardly played now — Maria Szymanowska, Władysław Żeleński,
// Józef Krogulski, Józef Elsner, Franciszek Mirecki, Wojciech Sowiński
// and Kasper Napoleon Wysocki — as the house page's staves (qimu.js) and
// the Houses view's (motifs.js) draw and play them. The owner,
// 2026-09-28: "find sheet music from some obscure piano pieces and
// display that".
//
// FROM Polish Music Heritage in Open Access (https://polishscores.org):
// digital scores (c) The Fryderyk Chopin Institute, CC BY 4.0 — credited
// at the foot of houses/qimu-and-musicians.html. WRITTEN BY
// tools/qimu-pieces.py; change that and run it again rather than
// changing this by hand.
//
// A PIECE: its composer and title, its metre, its key signature (`sig`,
// one alteration a letter, C to B; `count` of them, sharps or flats), a
// tempo in crotchets a minute, and its opening BARS. A bar lasts `units`
// semiquavers (an upbeat is marked `pickup`), and each hand — `right`,
// `left` — is one or two VOICES, each a list of events filling the bar:
//   t, dur   where in the bar it starts and how long it lasts, in
//            semiquavers (a triplet quaver is 4/3)
//   ds, al   its notes as STEPS (letters above middle C: C4 is 0, C5 7,
//            B3 -1) and ALTERS (-1 flat, 0, 1 sharp) — or `rest`
//            (`hidden`: a voice resting unseen)
//   acc      the accidental an engraver writes before each, if any
//   up       which way its stem goes, as the score has it
//   beam     which beam it is under, counted in its voice
//   tie/tied tied to the next / from the last; trip: a triplet;
//   slur/slurEnd where a slur begins and ends
// ============================================================
"""

WHOLE_HEAD = """// ============================================================
// QIMU & MUSICIANS' SCORE, WHOLE: every bar of the same eighteen pieces as
// qimu-pieces.js, and the order they are played in — so that a stave
// pointed at with the sound on plays its piece through to its last note,
// turning over to the next of its bars as it goes. The owner, 2026-10-01:
// "when you hover it, i want them to play the entire composition and the
// notes change visually too as it plays". Fetched by qimu.js only once
// the sound is turned on.
//
// FROM Polish Music Heritage in Open Access (https://polishscores.org),
// (c) The Fryderyk Chopin Institute, CC BY 4.0 — credited at the foot of
// houses/qimu-and-musicians.html. WRITTEN BY tools/qimu-pieces.py; change
// that and run it again rather than changing this by hand.
//
// A PIECE: its `file` (as in qimu-pieces.js), the key signatures and
// metres it has (`keys`, `meters`), its BARS — each written once, as a bar
// of qimu-pieces.js is, with `k` and `m` where its key or metre is not
// the first — and its ORDER: runs of bars, [from, to), in the order they
// are played, its repeats and first and second endings as the score has
// them.
// ============================================================
"""

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/polish", os.path.join(here, "..", "qimu-pieces.js"))

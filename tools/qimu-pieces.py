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
            "issues": issues, "tempo": tempo, "graces": graces, "clefs_at": clefs_at, "meters_at": meters_at}

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
        print("ok", com, "-", title)
    body = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    body = body.replace('},{"meter"', '},\n  {"meter"').replace('[{"meter"', '[\n  {"meter"', 1)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(JS_HEAD + "window.QIMU_PIECES = " + body[:-1] + "\n];\n")


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

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    main(sys.argv[1] if len(sys.argv) > 1 else "/tmp/polish", os.path.join(here, "..", "qimu-pieces.js"))

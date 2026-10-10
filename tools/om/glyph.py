#!/usr/bin/env python3
# ============================================================
# THE OM, AS LETTERS — run by hand, never by the site
#
# The owner, 2026-10-10: "For om, I would like you to make a sylized
# vbersion of this symbol "โอม" and use it in the house shattering thing
# for the design". The Om Parfums page (om.js) draws โอม — the Thai
# spelling of Om — in specks and hairlines. So that it reads as the
# word it is rather than as three shapes somebody guessed at, its
# letters are taken from a real Thai typeface, Loma (the TLWG fonts,
# GPL with the font exception — only the outlines' coordinates are
# used, never the font itself), and laid out as the font lays them out.
#
# What is written is om-glyph.js: every contour of the three letters as
# a flat list of points, evenly spaced along it, in units of the
# letters' own x-height (0 the top of it, 1 the baseline), and every
# letter's HEAD — the little loop each Thai letter begins with — as a
# circle, which om.js draws as a perfect circle with its centre marked.
# That is the stylisation: the letters' own strokes as an outline of
# specks, their heads made geometric.
#
#   python3 tools/om/glyph.py        # needs fontTools (pip install fonttools)
#                                    # and the Loma font (fonts-tlwg-loma)
# ============================================================
import json, math, os, sys
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
FONT = "/usr/share/fonts/opentype/tlwg/Loma.otf"
WORD = "โอม"
STEP = 0.022          # how far apart the points along a contour stand, in x-heights

font = TTFont(FONT)
cmap, glyphs, hmtx = font.getBestCmap(), font.getGlyphSet(), font["hmtx"]
xh = font["OS/2"].sxHeight

def flatten(rec):
    """A glyph's contours as lists of (x, y) points, its curves sampled finely."""
    out, cur, at = [], [], (0, 0)
    for op, args in rec:
        if op == "moveTo":
            cur = [args[0]]; at = args[0]
        elif op == "lineTo":
            cur.append(args[0]); at = args[0]
        elif op == "curveTo":
            p0 = at; (p1, p2, p3) = args
            for k in range(1, 25):
                t = k / 24; u = 1 - t
                cur.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                            u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
            at = p3
        elif op == "qCurveTo":
            pts = [at] + list(args)
            for a, b in zip(pts[1:-1], pts[2:]):
                pass
            cur.extend(args); at = args[-1]
        elif op in ("closePath", "endPath"):
            if cur: out.append(cur)
            cur = []
    return out

def resample(pts, step):
    """Points evenly spaced along a closed contour."""
    ring = pts + [pts[0]]
    segs = [math.dist(a, b) for a, b in zip(ring, ring[1:])]
    total = sum(segs)
    n = max(8, round(total / step))
    out, k, run = [], 0, 0.0
    for i in range(n):
        want = total * i / n
        while k < len(segs) - 1 and run + segs[k] < want:
            run += segs[k]; k += 1
        t = (want - run) / segs[k] if segs[k] else 0
        a, b = ring[k], ring[k + 1]
        out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out

def area(pts):
    return 0.5 * sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1]))

letters, pen_x = [], 0
for ch in WORD:
    name = cmap[ord(ch)]
    rec = RecordingPen(); glyphs[name].draw(rec)
    contours = []
    for c in flatten(rec.value):
        # Font units to x-heights, y downward from the top of the x-height.
        contours.append([((x + pen_x) / xh, (xh - y) / xh) for x, y in c])
    letters.append({"ch": ch, "contours": contours})
    pen_x += hmtx[name][0]

# THE HEADS: a letter's small inner contours, each the hole in a loop.
# The biggest contour of a letter is its body; one well under a tenth of
# its area, wound the other way, is a head.
for L in letters:
    body = max(abs(area(c)) for c in L["contours"])
    L["heads"] = []
    for c in L["contours"]:
        a = abs(area(c))
        if a < body * 0.12:
            cx = sum(p[0] for p in c) / len(c); cy = sum(p[1] for p in c) / len(c)
            # The largest circle that fits inside the hole, not the mean:
            # one head is an oval, and a circle round it would overhang.
            r = min(math.dist((cx, cy), p) for p in c)
            L["heads"].append([round(cx, 4), round(cy, 4), round(r, 4)])

xs = [p[0] for L in letters for c in L["contours"] for p in c]
ys = [p[1] for L in letters for c in L["contours"] for p in c]
x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
mid = (x0 + x1) / 2
data = {
    "word": WORD,
    "box": [round(x0 - mid, 4), round(y0, 4), round(x1 - mid, 4), round(y1, 4)],
    "letters": [{
        "ch": L["ch"],
        "contours": [[round(v, 4) for p in resample(c, STEP) for v in (p[0] - mid, p[1])] for c in L["contours"]],
        "heads": [[round(h[0] - mid, 4), h[1], h[2]] for h in L["heads"]],
    } for L in letters],
}
head = ("// THE OM, AS LETTERS — โอม, the Thai spelling of Om, for the Om Parfums\n"
        "// page (om.js). Written by tools/om/glyph.py from the Loma typeface's own\n"
        "// outlines; never by hand. Units are the letters' x-height: y = 0 at its\n"
        "// top, 1 on the baseline; x centred on the word.\n")
open(os.path.join(REPO, "om-glyph.js"), "w", encoding="utf-8").write(
    head + "window.OM_GLYPH = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
print("om-glyph.js:", sum(len(c) // 2 for L in data["letters"] for c in L["contours"]), "points,",
      sum(len(L["heads"]) for L in data["letters"]), "heads, box", data["box"])

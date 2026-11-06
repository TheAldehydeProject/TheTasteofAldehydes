#!/usr/bin/env python3
"""THE EARTH ON THE PERFUMERS PAGE — writes perfumers-earth.js.

The Perfumers page draws the Earth in its middle as an architect's sketch
(2026-11-06 — "It should look like the earth, with then three layers of
information in series protruding from it ... like an architect's sketch of
the earth"). Its coastlines come from Natural Earth's land at 1:110m, which
is in the public domain, through the `world-atlas` package (2.0.2), which
carries it as TopoJSON.

Run by hand, never by the site:

    npm pack world-atlas@2.0.2 && tar xzf world-atlas-2.0.2.tgz
    python3 tools/perfumers/earth.py package/land-110m.json

It decodes the TopoJSON, simplifies every ring a little (Douglas-Peucker,
to a tenth of a degree), drops the islands too small to be drawn at the
page's size, rounds every point to a tenth of a degree and writes the rings
as flat lists of longitude, latitude into perfumers-earth.js. Then run
tools/versions.py. Nothing in it needs installing.
"""
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "perfumers-earth.js")

TOLERANCE = 0.18      # degrees: how far a simplified ring may stray
SMALLEST = 0.9        # square degrees: a ring smaller than this is left out


def decode(topo):
    tr = topo.get("transform")
    sx, sy = (tr["scale"] if tr else (1, 1))
    tx, ty = (tr["translate"] if tr else (0, 0))
    arcs = []
    for arc in topo["arcs"]:
        x = y = 0
        pts = []
        for p in arc:
            if tr:
                x += p[0]
                y += p[1]
                pts.append((x * sx + tx, y * sy + ty))
            else:
                pts.append((p[0], p[1]))
        arcs.append(pts)
    return arcs


def ring_of(arcs, idx):
    out = []
    for i in idx:
        a = arcs[i] if i >= 0 else list(reversed(arcs[~i]))
        if out:
            a = a[1:]
        out.extend(a)
    return out


def area(r):
    s = 0.0
    for i in range(len(r)):
        x0, y0 = r[i]
        x1, y1 = r[(i + 1) % len(r)]
        s += x0 * y1 - x1 * y0
    return abs(s) / 2


def dp(pts, tol):
    if len(pts) < 3:
        return pts
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = pts[a]
        bx, by = pts[b]
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1e-12
        best, at = -1, -1
        for i in range(a + 1, b):
            px, py = pts[i]
            d = abs(dy * (px - ax) - dx * (py - ay)) / L
            if d > best:
                best, at = d, i
        if best > tol:
            keep[at] = True
            stack.append((a, at))
            stack.append((at, b))
    return [p for p, k in zip(pts, keep) if k]


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: earth.py path/to/land-110m.json")
    topo = json.load(open(sys.argv[1]))
    arcs = decode(topo)
    rings = []
    for geom in topo["objects"]["land"]["geometries"]:
        polys = geom["arcs"] if geom["type"] == "MultiPolygon" else [geom["arcs"]]
        for poly in polys:
            for k, idx in enumerate(poly):
                r = ring_of(arcs, idx)
                if area(r) < SMALLEST:
                    continue
                # a ring closes on itself, so it is simplified as two runs,
                # from its first point to the point farthest from it and back
                x0, y0 = r[0]
                far = max(range(len(r)), key=lambda i: (r[i][0] - x0) ** 2 + (r[i][1] - y0) ** 2)
                s = dp(r[:far + 1], TOLERANCE)[:-1] + dp(r[far:], TOLERANCE)
                if len(s) < 4:
                    continue
                flat = []
                for x, y in s:
                    flat.append(round(x, 1))
                    flat.append(round(y, 1))
                rings.append(flat)
    pts = sum(len(r) // 2 for r in rings)
    body = json.dumps(rings, separators=(",", ":"))
    with open(OUT, "w") as f:
        f.write("// THE EARTH ON THE PERFUMERS PAGE — written by tools/perfumers/earth.py from\n")
        f.write("// Natural Earth's land at 1:110m (public domain), through world-atlas 2.0.2.\n")
        f.write("// Every ring a flat list of longitude, latitude, in degrees. Never edit\n")
        f.write("// this by hand: run the tool (then tools/versions.py).\n")
        f.write("window.PERFUMERS_EARTH = " + body + ";\n")
    print("%d rings, %d points, %d bytes -> %s" % (len(rings), pts, len(body), os.path.relpath(OUT, ROOT)))


if __name__ == "__main__":
    main()

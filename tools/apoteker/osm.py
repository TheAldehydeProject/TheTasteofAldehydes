# ============================================================
# THE MOUNTAIN'S REAL PATHS AND BUILDINGS — tools/apoteker/osm.py, run by
# hand, never by the site.
#
# For the realism trials on Apoteker Tepe's page (2026-10-21 — "I want it to
# feel as realistic as possible"): `osmtrails`, the real footpaths up Athos in
# place of the trails the page invents, and `buildings`, its monasteries,
# sketes and chapels standing on it. Both are OpenStreetMap's, read out of the
# Overture Maps Foundation's open release on AWS (GeoParquet, no account),
# within the page's own square:
#
#   the paths      the shortest way by OpenStreetMap's footpaths and tracks
#                  from each of four places the pilgrims set out from — the
#                  sketes of Agia Anna, Kafsokalyvia and Prodromou, and the
#                  Great Lavra — to the summit (networkx over the network);
#   the buildings  the largest of them in the square, BUILDINGS at most —
#                  fewer than a hundred features, which the OpenStreetMap
#                  Foundation counts as an insubstantial extract — each its
#                  footprint and how tall it is (OpenStreetMap's, or guessed
#                  from its floors or its size).
#
# Written as cells of the page's own grid (u, v: 0 to n, as tepe-data.js's
# trails are), into images/Apoteker Tepe/mountain/trials/athos-osm.json.
#
#   pip install pyarrow shapely networkx
#   python3 tools/apoteker/osm.py          (HTTPS_PROXY is used if it is set)
#
# Credit: © OpenStreetMap contributors (ODbL 1.0), via the Overture Maps
# Foundation (release RELEASE).
# ============================================================
import json, math, os, re, sys, time
import pyarrow.dataset as ds, pyarrow.compute as pc
from pyarrow import fs
import networkx as nx
from shapely import wkb
from shapely.geometry import LineString, Polygon

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "images", "Apoteker Tepe", "mountain", "trials", "athos-osm.json")
RELEASE = "2026-09-23.0"
BUILDINGS = 95                       # with the four paths, fewer than a hundred features
SUMMIT = (40.1572, 24.3264)          # mountain.mjs's SUMMIT, the square's middle
PEAK = (40.1584, 24.3273)            # the summit itself (OpenStreetMap's natural=peak, 2,033 m)
STARTS = {                           # where the pilgrims' ways begin (OpenStreetMap)
    "Agia Anna": (40.1403, 24.2968),
    "Kafsokalyvia": (40.1295, 24.3407),
    "Prodromou": (40.1436, 24.3840),
    "Great Lavra": (40.1711, 24.3828),
}
SIMPLIFY_M = 6                       # a path's points kept to within so many metres of it

data = open(os.path.join(ROOT, "tepe-data.js"), encoding="utf-8").read()
N = int(re.search(r'"n":(\d+)', data).group(1))
KM = float(re.search(r'"km":([\d.]+)', data).group(1))

# THE SQUARE, exactly as mountain.mjs lays it (Web Mercator, zoom 12).
ZOOM = 12
def tile_of(lat, lon):
    n, r = 2 ** ZOOM, math.radians(lat)
    return ((lon + 180) / 360 * n, (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n)
def lat_lon_of(tx, ty):
    n = 2 ** ZOOM
    return (math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * ty / n)))), tx / n * 360 - 180)
ax, ay = tile_of(*SUMMIT)
m_per_px = 40075016.686 * math.cos(math.radians(SUMMIT[0])) / 2 ** ZOOM / 256
side = round(KM * 1000 / m_per_px); half = side / 2
x0, y0 = math.floor(ax - half / 256), math.floor(ay - half / 256)
cx, cy = round((ax - x0) * 256), round((ay - y0) * 256)
left, top = cx - round(half), cy - round(half)
def cell(lat, lon):
    """(lat, lon) as the page's cells, u across and v down, 0 to N."""
    tx, ty = tile_of(lat, lon)
    s, t = ((tx - x0) * 256 - left) / side, ((ty - y0) * 256 - top) / side
    return (s * N - 0.5, t * N - 0.5)
corners = [lat_lon_of(x0 + (left + s * side) / 256, y0 + (top + t * side) / 256) for s, t in [(0, 0), (1, 1)]]
(lat1, lon0), (lat0, lon1) = corners
inside = lambda lat, lon: lat0 <= lat <= lat1 and lon0 <= lon <= lon1
print(f"the square: {lat0:.4f}–{lat1:.4f} N, {lon0:.4f}–{lon1:.4f} E", file=sys.stderr)

proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
s3 = fs.S3FileSystem(anonymous=True, region="us-west-2", **({"proxy_options": proxy} if proxy else {}))
def overture(theme, kind):
    t0 = time.time()
    d = ds.dataset(f"overturemaps-us-west-2/release/{RELEASE}/theme={theme}/type={kind}/", filesystem=s3, format="parquet")
    f = (pc.field("bbox", "xmin") < lon1) & (pc.field("bbox", "xmax") > lon0) & (pc.field("bbox", "ymin") < lat1) & (pc.field("bbox", "ymax") > lat0)
    rows = d.to_table(filter=f).to_pylist()
    print(f"{theme}/{kind}: {len(rows)} in {time.time() - t0:.0f} s", file=sys.stderr)
    return rows
metres = lambda a, b: math.hypot((a[0] - b[0]) * 111320 * math.cos(math.radians(40.157)), (a[1] - b[1]) * 110950)   # (lon, lat) pairs

# THE PATHS ----------------------------------------------------------------
G = nx.Graph()
for r in overture("transportation", "segment"):
    if r["subtype"] != "road" or r["class"] not in ("path", "footway", "steps", "track", "unclassified", "service"):
        continue
    cs = [(round(x, 6), round(y, 6)) for x, y in wkb.loads(r["geometry"]).coords]
    for a, b in zip(cs, cs[1:]):
        # (a footpath preferred to a track, as a pilgrim on foot would)
        G.add_edge(a, b, w=metres(a, b) * (1 if r["class"] in ("path", "footway", "steps") else 1.25), m=metres(a, b))
nodes = list(G.nodes)
near = lambda lat, lon: min(nodes, key=lambda n: metres(n, (lon, lat)))
peak = near(*PEAK)
trails = []
for name, (lat, lon) in STARTS.items():
    path = nx.shortest_path(G, near(lat, lon), peak, weight="w")
    km = sum(G[a][b]["m"] for a, b in zip(path, path[1:])) / 1000
    # simplified to within SIMPLIFY_M metres (in degrees, near enough here)
    line = LineString(path).simplify(SIMPLIFY_M / 100000, preserve_topology=False)
    pts = [[round(u, 2), round(v, 2)] for u, v in (cell(y, x) for x, y in line.coords)]
    trails.append({"name": name, "km": round(km, 2), "pts": pts})
    print(f"  {name} to the summit: {km:.1f} km, {len(pts)} points", file=sys.stderr)

# THE BUILDINGS ------------------------------------------------------------
found = []
for r in overture("buildings", "building"):
    g = wkb.loads(r["geometry"])
    if g.geom_type == "MultiPolygon":
        g = max(g.geoms, key=lambda p: p.area)
    c = g.centroid
    if not inside(c.y, c.x):
        continue
    ring = list(g.exterior.coords)[:-1]
    area = Polygon([(x * 111320 * math.cos(math.radians(40.157)), y * 110950) for x, y in ring]).area
    tall = r["height"] or (r["num_floors"] * 3.2 if r["num_floors"] else None)
    kind = r["class"] or r["subtype"] or ""
    if not tall:
        tall = 14 if kind in ("monastery", "religious") else 10 if area > 600 else 7 if area > 150 else 5
    name = (r["names"] or {}).get("primary") if r["names"] else None
    found.append({"area": area, "tall": tall, "kind": kind, "name": name, "ring": ring})
found.sort(key=lambda b: -b["area"])
buildings = []
for b in found[:BUILDINGS]:
    ring = [[round(u, 3), round(v, 3)] for u, v in (cell(y, x) for x, y in b["ring"])]
    buildings.append({"tall": round(b["tall"], 1), "kind": b["kind"], **({"name": b["name"]} if b["name"] else {}), "ring": ring})
print(f"  {len(buildings)} buildings of {len(found)} in the square, {buildings[-1] and round(found[min(len(found), BUILDINGS) - 1]['area'])} m² the smallest kept", file=sys.stderr)

json.dump({
    "credit": f"© OpenStreetMap contributors (ODbL 1.0), via the Overture Maps Foundation (release {RELEASE})",
    "n": N,
    "trails": trails,
    "buildings": buildings,
}, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(f"written {os.path.relpath(OUT, ROOT)}, {os.path.getsize(OUT) // 1024} KB", file=sys.stderr)

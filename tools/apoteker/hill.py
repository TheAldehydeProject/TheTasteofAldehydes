#!/usr/bin/env python3
# ============================================================
# THE HILL — Apoteker Tepe's head (houses/apoteker-tepe.html), run by hand,
# never by the site. Needs numpy and Pillow.
#
# The owner, 2026-10-27: "Please try something new with the apoteker tepe
# page. I want you to use the image numbver 5 from the mountains. make it
# look cool, make it minimalist, use wahtever you need."
#
# Their photograph AT MOUNTAIN 5 is cut along its skyline — the sky taken
# out, so the mountain stands on the house's own paper and the page's sky
# is the paper the title is written on — printed in two inks, the house's
# green and its paper, a little of the photograph's own colour let back in
# (`ORIGINAL`), and let go into the paper at its foot. Over it, a few
# contour lines echo the ridge upward, each a little further off and a
# little gentler than the last.
#
# And the same day — "split the montain somewhere on the right so like 3/4
# of the way to the right in a semi-diagonal line and insert something in
# the split" — THE FAULT: the mountain cut along a leaning line (`FAULT`,
# `LEAN`) a little short of three quarters of the way across, its right
# block, lines, summit and all, moved off it (`SHIFT`), and in the split
# the mountain's inside, the house's eight juices running down it, numbered
# as the page numbers them (`.tepe-seam` in style.css), with a section line
# up out of it as a technical drawing marks a cut. This writes where the
# cut runs: the two blocks' outlines, the split, its shading and its
# numbers, and the section line. The split opens as the page opens and a
# little more as it is scrolled (style.css, tepe.js); the split is drawn
# here at its widest (`WIDE`), the right block covering what is not open.
#
# EVERYTHING IS CUT HERE, NOTHING IN THE BROWSER ("when scrolling it is
# slow and laggy", 2026-10-28): the two blocks are two pictures, each its
# own side of the fault in its own pixels, and the contour lines are cut
# where they cross it, so nothing in the hill is masked by the browser as
# the page moves — a mask held on the lines cost a fifth of every frame.
#
#   python3 tools/apoteker/hill.py
#
# writes
#   images/Apoteker Tepe/hill/the-hill-left.webp, the-hill-right.webp
#                                             the mountain, cut and printed,
#                                             in its two blocks
#   images/Apoteker Tepe/hill/margin-left.svg, margin-right.svg
#                                             the contour lines that run on
#                                             down the page's margins
#   houses/apoteker-tepe.html                 the hill's markup — the two
#                                             blocks, the contour lines, the
#                                             split — between its THE HILL
#                                             markers
# Running it twice changes nothing the second time.
#
# THE RIDGE (`RIDGE`) is traced by hand, point by point, off the photograph
# at its own size (2108 by 1405): clouds stand against the rock on the
# right and the pale limestone on the left is the grey of a cloud's shadow,
# so no reading of the colours alone found it. Change a point, run the tool.
# ============================================================
import os, re
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
SRC = os.path.join(ROOT, "images", "Apoteker Tepe", "AT MOUNTAIN 5.webp")
OUT = os.path.join(ROOT, "images", "Apoteker Tepe", "hill")
LEFT_OUT, RIGHT_OUT = "the-hill-left.webp", "the-hill-right.webp"
PAGE = os.path.join(ROOT, "houses", "apoteker-tepe.html")

RIDGE = [
    (0, 752), (50, 750), (100, 754), (130, 760), (150, 770), (165, 772), (200, 759), (250, 740),
    (300, 720), (350, 710), (400, 697), (450, 685), (500, 664), (550, 645), (600, 626), (615, 624),
    (622, 628), (628, 645), (635, 650), (645, 640), (660, 625), (675, 615), (700, 605), (715, 597),
    (720, 596), (730, 603), (735, 620), (737, 660), (740, 675), (750, 685), (760, 694), (780, 692),
    (800, 682), (825, 679), (850, 670), (875, 665), (900, 675), (925, 685), (950, 700), (975, 715),
    (1000, 722), (1050, 724), (1100, 724), (1140, 722), (1150, 720), (1175, 714), (1200, 707),
    (1225, 699), (1250, 689), (1280, 687), (1300, 692), (1325, 689), (1350, 682), (1375, 675),
    (1400, 669), (1425, 654), (1450, 645), (1475, 637), (1490, 625), (1500, 612), (1525, 605),
    (1550, 600), (1585, 597), (1600, 582), (1625, 575), (1640, 570), (1660, 545), (1665, 525),
    (1680, 514), (1700, 509), (1710, 507), (1725, 511), (1750, 520), (1775, 530), (1800, 537),
    (1820, 545), (1850, 539), (1875, 536), (1890, 532), (1895, 515), (1900, 496), (1925, 494),
    (1950, 500), (2000, 475), (2050, 445), (2108, 405),
]
SUMMIT = (1710, 507)          # the peak the eye goes to (the page stands it in the window)

# THE TWO INKS: the house's green (--tepe-green) in the shadows, and its
# paper (--bg) in the lights, so the mountain's lights are the page itself.
DARK = np.array([30, 48, 32.0])
GREEN = np.array([62, 92, 60.0])
PAPER = np.array([236, 229, 210.0])
ORIGINAL = 0.2               # how much of the photograph's own colour is let back into the print
FADE_FROM = 1060              # the mountain let go into the paper from here down
CUT_INTO = 1.5                # px the cut stands inside the ridge, so no sky is left on its edge

# THE FAULT: the point on the ridge it leaves from, how far it leans (px
# across for every px down, to the left), and how far the right block is
# moved off it (right, and up).
FAULT = (1585, 597)
LEAN = 0.4
SHIFT = (54, 18)
WIDE = 1.0                    # scrolled, the split opens by as much again (tepe.js's WIDE)
OVERLAP = 1.5                 # px the left block runs under the right, so no crack shows while shut
SECTION_TO = 250              # the section line runs up out of the split to this height
SEAM_TO = 1250                # the juices run down the split to here (past it, the last)

# THE CONTOURS: how far above the ridge (px of the photograph), how gentle
# (a running mean over this many px across), and how strong.
CONTOURS = [(16, 18, 0.5), (36, 60, 0.32), (62, 120, 0.19), (94, 210, 0.1)]


def cut_and_print():
    # The photograph printed, cut out of its sky, let go at its foot, and cut
    # in two along the fault: the left block to OVERLAP past it, the right
    # from it, each antialiased by drawing its edge at four times the size,
    # and each cropped to what it holds.
    im = Image.open(SRC).convert("RGB")
    W, H = im.size
    S = 4
    def coverage(poly):
        m = Image.new("L", (W * S, H * S), 0)
        ImageDraw.Draw(m).polygon([(x * S, y * S) for x, y in poly], fill=255)
        return np.asarray(m.resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
    land = coverage([(x, y + CUT_INTO) for x, y in RIDGE] + [(W, H), (0, H)])
    top, foot = -H, 2 * H
    left = coverage([(-W, top), (at(top) + OVERLAP, top), (at(foot) + OVERLAP, foot), (-W, foot)])
    right = coverage([(at(top), top), (2 * W, top), (2 * W, foot), (at(foot), foot)])
    ys = np.arange(H, dtype=np.float32)[:, None]
    fade = np.clip((H - ys) / (H - FADE_FROM), 0, 1)
    fade = fade * fade * (3 - 2 * fade)
    a = np.asarray(im).astype(np.float32)
    L = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])[..., None] / 255
    t = np.clip((L - 0.06) / 0.78, 0, 1) ** 0.9
    lo = np.clip(t * 2, 0, 1)                                  # dark to green over the shadows,
    hi = np.clip(t * 2 - 1, 0, 1)                              # green to paper over the lights
    rgb = np.where(t < 0.5, DARK + (GREEN - DARK) * lo, GREEN + (PAPER - GREEN) * hi)
    rgb = rgb * (1 - ORIGINAL) + a * ORIGINAL                  # and a little of the photograph's own
    rgb = np.clip(rgb, 0, 255)
    os.makedirs(OUT, exist_ok=True)
    boxes = []
    for side, name in ((left, LEFT_OUT), (right, RIGHT_OUT)):
        alpha = land * fade * side
        cols = np.where(alpha.max(axis=0) > 0.002)[0]
        x0, x1 = int(cols[0]), int(cols[-1]) + 1
        rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)[:, x0:x1]
        Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, name), quality=84, method=6)
        boxes.append((x0, x1))
    return W, H, boxes


def contours(W):
    # Each line is the ridge's upper envelope (the highest of it within a
    # stretch either way) rounded off by a running mean over the same
    # stretch, lifted by its offset — gentle domes over the peaks, never
    # touching the ridge. Each is cut where it crosses the fault, into the
    # piece on the left block and the piece on the right.
    step = 6
    xs = np.arange(0, W + step, step, dtype=np.float32)
    xs[-1] = W
    px, py = zip(*RIDGE)
    ridge = np.interp(xs, px, py)
    out = []
    for off, wide, ink in CONTOURS:
        k = max(1, int(wide / step))
        pad = np.pad(ridge, k, mode="edge")
        env = np.array([pad[i:i + 2 * k + 1].min() for i in range(len(ridge))])
        pad = np.pad(env, k, mode="edge")
        soft = np.convolve(pad, np.ones(2 * k + 1) / (2 * k + 1), mode="valid")
        y = np.minimum(soft - off, ridge - off * 0.6)
        pts = list(zip(xs.tolist(), y.tolist()))
        side = [x - at(v) for x, v in pts]                      # below nought, left of the fault
        i = next(j for j in range(1, len(pts)) if side[j - 1] < 0 <= side[j])
        (xa, ya), (xb, yb) = pts[i - 1], pts[i]
        f = side[i - 1] / (side[i - 1] - side[i])
        cross = (xa + (xb - xa) * f, ya + (yb - ya) * f)
        path = lambda seg: "M" + " L".join(f"{x:.0f} {v:.0f}" if (x, v) != cross else f"{x:.1f} {v:.1f}" for x, v in seg)
        out.append((ink, path(pts[:i] + [cross]), path([cross] + pts[i:])))
    return out


def at(y):
    # The cut, across, at a height: it leaves the ridge at FAULT and leans
    # LEAN to the left going down.
    fx, fy = FAULT
    return fx - LEAN * (y - fy)


def let_go(H, opacity_of="stop-opacity"):
    # The mountain's own fade at its foot (cut_and_print's), as gradient
    # stops, so whatever is drawn in the split goes into the paper with it.
    stops = []
    for k in range(9):
        u = 1 - k / 8
        a = u * u * (3 - 2 * u)
        stops.append(f'<stop offset="{k / 8:.3f}" stop-color="#fff" {opacity_of}="{a:.3f}"/>')
    return (f'gradientUnits="userSpaceOnUse" x1="0" y1="{FADE_FROM}" x2="0" y2="{H}">' + "".join(stops))


def fault(W, H):
    # Where the section line stands — its foot at the middle of the split's
    # mouth, its head SECTION_TO down — in percentages of the picture's own
    # box, and the shift in the box's own widths (`cqw`), so anything in
    # the hill can be moved by it.
    fx, fy = FAULT
    dx, dy = SHIFT
    mx, my = fx + dx / 2, fy - dy / 2                        # the middle of the split's mouth
    length = (my - SECTION_TO) * (1 + LEAN * LEAN) ** 0.5
    section = f"--x:{mx / W * 100:.3f}%; --y:{my / H * 100:.3f}%; --len:{length / H * 100:.3f}%"
    end = f"--x:{(mx + LEAN * (my - SECTION_TO)) / W * 100:.3f}%; --y:{SECTION_TO / H * 100:.3f}%"
    shift = f"--shift-x:{dx / W * 100:.3f}cqw; --shift-y:{-dy / W * 100:.3f}cqw"
    return section, end, shift


def seam(W, H):
    # The mountain's inside, drawn at the split's widest: the house's eight
    # juices running down it one into the next (`--j1` to `--j8` in
    # style.css), a hairline stratum between each, dipping a little; the left
    # wall's shade in it; let go at the
    # foot with the mountain. Its mouth is the line from the left block's
    # ridge along the way the right block moves, so the right block's ridge
    # stays on it however far it is open.
    fx, fy = FAULT
    dx, dy = SHIFT
    k = 1 + WIDE
    ty = fy + CUT_INTO                                          # the land's own edge at the cut
    mx, my = fx + dx / 2, fy - dy / 2
    juice = "".join(
        f'<stop offset="{(i + 0.5) / 8:.4f}" style="stop-color:rgb(var(--j{i + 1}))"/>' for i in range(8))
    n = (1 + LEAN * LEAN) ** 0.5
    nx, ny = 1 / n, LEAN / n                                    # across the split, at right angles to it
    ay = (fy + SEAM_TO) / 2
    ax = at(ay)
    reach = 26                                                  # the shade's reach from the wall
    strata = []
    for i in range(1, 8):
        yy = fy + (SEAM_TO - fy) * i / 8
        x0, x1 = at(yy) - 6, at(yy) + dx * k + 6
        dip = 7 + 3 * (i % 3)                                   # each a little its own
        strata.append(f'<path class="tepe-stratum" d="M{x0:.1f} {yy - dip:.1f} '
                      f'Q{(x0 + x1) / 2:.1f} {yy + dip * 0.4:.1f} {x1:.1f} {yy + dip:.1f}"/>')
    split = " ".join(f"{x:.1f},{y:.1f}" for x, y in
                     [(fx, ty), (fx + dx * k, ty - dy * k), (at(H + dy * k) + dx * k, H), (at(H), H)])
    return (
        f'   <svg class="tepe-seam" viewBox="0 0 {W} {H}" preserveAspectRatio="none" focusable="false">\n'
        "    <defs>\n"
        f'     <clipPath id="tepe-split"><polygon points="{split}"/></clipPath>\n'
        f'     <linearGradient id="tepe-juice" gradientUnits="userSpaceOnUse" x1="{mx:.1f}" y1="{my:.1f}" '
        f'x2="{at(SEAM_TO) + dx / 2:.1f}" y2="{SEAM_TO}">{juice}</linearGradient>\n'
        f'     <linearGradient id="tepe-wall" gradientUnits="userSpaceOnUse" x1="{ax:.1f}" y1="{ay:.1f}" '
        f'x2="{ax + reach * nx:.1f}" y2="{ay + reach * ny:.1f}">'
        '<stop offset="0" style="stop-color:#141c14;stop-opacity:0.42"/>'
        '<stop offset="1" style="stop-color:#141c14;stop-opacity:0"/></linearGradient>\n'
        f'     <linearGradient id="tepe-foot" {let_go(H)}</linearGradient>\n'
        f'     <mask id="tepe-let-go" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}">'
        f'<rect width="{W}" height="{H}" fill="url(#tepe-foot)"/></mask>\n'
        "    </defs>\n"
        '    <g clip-path="url(#tepe-split)" mask="url(#tepe-let-go)">\n'
        f'     <rect width="{W}" height="{H}" fill="url(#tepe-juice)"/>\n'
        + "".join(f"     {p}\n" for p in strata) +
        f'     <rect width="{W}" height="{H}" fill="url(#tepe-wall)"/>\n'
        "    </g>\n"
        "   </svg>\n"
    )


def wall(W, H):
    # The right wall's shade, in the right block and moved with it: a strip
    # off its face into the split, dark at the face, under the mouth's line
    # and let go at the foot. It lies over the left block while the split is
    # shut, so the stylesheet shows it only as the split opens.
    fx, fy = FAULT
    dx, dy = SHIFT
    ty = fy + CUT_INTO
    w = 22                                                      # how far into the split, level
    t = w / (1 - LEAN * dy / dx)                                # where the mouth's line meets it
    n = (1 + LEAN * LEAN) ** 0.5
    nx, ny = 1 / n, LEAN / n
    ay = (fy + SEAM_TO) / 2
    ax = at(ay)
    strip = " ".join(f"{x:.1f},{y:.1f}" for x, y in
                     [(fx, ty), (fx - t, ty + t * dy / dx), (at(H) - w, H), (at(H), H)])
    return (
        f'    <svg class="tepe-wall" viewBox="0 0 {W} {H}" preserveAspectRatio="none" focusable="false">\n'
        "     <defs>\n"
        f'      <linearGradient id="tepe-wall-shade" gradientUnits="userSpaceOnUse" x1="{ax:.1f}" y1="{ay:.1f}" '
        f'x2="{ax - w * nx * nx:.1f}" y2="{ay - w * nx * ny:.1f}">'
        '<stop offset="0" style="stop-color:#141c14;stop-opacity:0.34"/>'
        '<stop offset="1" style="stop-color:#141c14;stop-opacity:0"/></linearGradient>\n'
        f'      <linearGradient id="tepe-wall-foot" {let_go(H)}</linearGradient>\n'
        f'      <mask id="tepe-wall-let-go" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}">'
        f'<rect width="{W}" height="{H}" fill="url(#tepe-wall-foot)"/></mask>\n'
        "     </defs>\n"
        f'     <polygon points="{strip}" fill="url(#tepe-wall-shade)" mask="url(#tepe-wall-let-go)"/>\n'
        "    </svg>\n"
    )


def numbers(W, H):
    # Beside the split, on the right block and moved with it, each juice's
    # number — the page's own part numbers, 01 to 08 — level with the middle
    # of its stratum, a short tick back to the face; as strong as the land
    # under it is (`--a`), so they go into the paper with it.
    fx, fy = FAULT
    dx, dy = SHIFT
    mx, my = fx + dx / 2, fy - dy / 2
    out = []
    for i in range(8):
        y = my + (SEAM_TO - my) * (i + 0.5) / 8
        u = min(1, max(0, (H - y) / (H - FADE_FROM)))
        a = u * u * (3 - 2 * u)
        out.append(f'    <span class="tepe-stratum-no" style="--x:{at(y) / W * 100:.3f}%; --y:{y / H * 100:.3f}%; '
                   f'--n:{i}; --a:{a:.2f}">{i + 1:02d}</span>\n')
    return "".join(out)


# THE MARGINS (2026-10-28 — "design elements of this mountain ... going
# down the page too. nothing too fancy"): the ridge turned on its side and
# run down the page, a few contour lines each side of the writing, as the
# hill's are over it — each a tile the stylesheet repeats down the margin.
MARGIN = (160, 960)           # a tile, css px: as wide as a margin, and repeated down it
MARGIN_LINES = [(34, 26, 0.3), (66, 60, 0.22), (98, 110, 0.15), (128, 180, 0.09)]   # across, how gentle, how strong
MARGIN_SWAY = 26              # how far the ridge sways across, css px


def margins():
    # The ridge's profile, its rise and fall taken out so a tile's foot
    # meets the next tile's head, made the sway down a line; each line the
    # profile rounded off over its own stretch, as the hill's contours are.
    tw, th = MARGIN
    px, py = zip(*RIDGE)
    n = th // 4 + 1
    t = np.linspace(0, 1, n)
    f = np.interp(t * px[-1], px, py)
    f = f - (f[0] + (f[-1] - f[0]) * t)                       # the ends meet
    f = (f - f.mean()) / (np.abs(f).max() or 1)
    out = []
    for flip in (False, True):
        rows = []
        for across, wide, ink in MARGIN_LINES:
            k = max(1, int(wide / 4))
            loop = np.concatenate([f[-k - 1:-1], f, f[1:k + 1]])   # round the tile's join, too
            soft = np.convolve(loop, np.ones(2 * k + 1) / (2 * k + 1), mode="valid")
            soft = soft / (np.abs(soft).max() or 1)
            if flip:
                soft = np.roll(soft[:-1], (n - 1) // 2)
                soft = np.append(soft, soft[0])
            xs = across + soft * MARGIN_SWAY * (0.55 + 0.45 * across / tw)
            if flip:
                xs = tw - xs
            d = "M" + " L".join(f"{x:.1f} {y:.0f}" for x, y in zip(xs, t * th))
            rows.append(f'<path d="{d}" stroke-opacity="{ink}"/>')
        out.append(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{tw}" height="{th}" viewBox="0 0 {tw} {th}">'
            f'<g fill="none" stroke="rgb(31,42,32)" stroke-width="1" stroke-linejoin="round">{"".join(rows)}</g></svg>\n')
    for name, svg in zip(("margin-left.svg", "margin-right.svg"), out):
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
            fh.write(svg)


def write_page(W, H, boxes, lines):
    sx, sy = SUMMIT
    section, end, shift = fault(W, H)
    ink = lambda side: (
        f'    <svg class="tepe-hill-lines" viewBox="0 0 {W} {H}" preserveAspectRatio="none" focusable="false">\n'
        + "\n".join(f'     <path class="tepe-contour" style="--k:{i}; --ink:{c[0]}" pathLength="1" d="{c[side]}"/>'
                    for i, c in enumerate(lines))
        + "\n    </svg>\n")
    def land(name, box, alt):
        x0, x1 = box
        return (f'    <img class="tepe-hill-land" src="../images/Apoteker Tepe/hill/{name}" alt="{alt}" '
                + ("" if alt else 'aria-hidden="true" ')            # the right block: the same picture's other half
                + f'width="{x1 - x0}" height="{H}" decoding="async" '
                f'style="left:{x0 / W * 100:.3f}%; width:{(x1 - x0) / W * 100:.3f}%">\n')
    block = (
        "<!-- THE HILL: begin — written by tools/apoteker/hill.py, never by hand. -->\n"
        '<div class="tepe-hill" aria-hidden="true">\n'
        f'  <div class="tepe-hill-box" style="{shift}">\n'
        '   <div class="tepe-hill-part tepe-hill-left">\n'
        + land(LEFT_OUT, boxes[0], "The mountain, my own photograph, its sky cut away, printed in the house's green")
        + ink(1) +
        "   </div>\n"
        + seam(W, H) +
        '   <div class="tepe-hill-part tepe-hill-right">\n'
        + wall(W, H)
        + land(RIGHT_OUT, boxes[1], "")
        + f'    <span class="tepe-summit" style="--x:{sx / W * 100:.3f}%; --y:{sy / H * 100:.3f}%"><i class="tepe-sign"></i></span>\n'
        + ink(2)
        + numbers(W, H) +
        "   </div>\n"
        f'   <span class="tepe-section" style="{section}"></span>\n'
        f'   <span class="tepe-section-end" style="{end}"><i></i><b>A</b></span>\n'
        "  </div>\n"
        "</div>\n"
        "<!-- THE HILL: end -->"
    )
    with open(PAGE, encoding="utf-8") as f:
        page = f.read()
    new, n = re.subn(r"<!-- THE HILL: begin.*?<!-- THE HILL: end -->", block.replace("\\", "\\\\"), page, flags=re.S)
    if not n:
        raise SystemExit("houses/apoteker-tepe.html has no THE HILL markers")
    if new != page:
        with open(PAGE, "w", encoding="utf-8") as f:
            f.write(new)


if __name__ == "__main__":
    W, H, boxes = cut_and_print()
    margins()
    write_page(W, H, boxes, contours(W))
    print("the hill:", os.path.relpath(OUT, ROOT), "(two blocks) and its markup in", os.path.relpath(PAGE, ROOT))

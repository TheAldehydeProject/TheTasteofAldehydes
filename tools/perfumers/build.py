#!/usr/bin/env python3
"""
THE PERFUMERS PAGE, BUILT FROM ITS LEDGER.

    python3 tools/perfumers/build.py          # write everything
    python3 tools/perfumers/build.py --check  # say what is wrong, write nothing

`tools/perfumers/LEDGER.md` is the only place the page's facts are written by
hand: every perfume, its perfumer(s), its year and its house; what is known of
each perfumer and each house; and the sources. This reads it and writes

  perfumers-data.js          what perfumers.js draws (window.PERFUMERS_DATA);
  perfumers/index.html       the index and the sources at the foot of the page,
                             between its INDEX and SOURCES markers — what a
                             reader without the drawing reads, and what the
                             site's search finds.

It checks as it goes, and stops rather than writing something wrong:
  - every `On site` address points at a part that is really on that page;
  - every source a line names is in the sources;
  - every perfumer a perfume names has a block under Perfumers;
  - every house a perfume names has a block under Houses.

Needs nothing installed. Run `python3 tools/versions.py` after it, because the
data file it writes is asked for by its version.
"""
import html
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
LEDGER = os.path.join(ROOT, "tools", "perfumers", "LEDGER.md")
DATA = os.path.join(ROOT, "perfumers-data.js")
PAGE = os.path.join(ROOT, "perfumers", "index.html")
NONE_ID = "not-found"


def slug(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-") or "x"


def sections(text):
    """Split the ledger into its ## sections."""
    out, name = {}, None
    for line in text.splitlines():
        m = re.match(r"^## (.+)$", line)
        if m:
            name = m.group(1).strip()
            out[name] = []
        elif name:
            out[name].append(line)
    return out


def blocks(lines):
    """### Name, then `- key: value` lines (a key may repeat)."""
    out, cur = [], None
    for line in lines:
        m = re.match(r"^### (.+)$", line)
        if m:
            cur = {"name": m.group(1).strip(), "items": []}
            out.append(cur)
            continue
        m = re.match(r"^- (\w+): (.*)$", line)
        if m and cur is not None:
            cur["items"].append((m.group(1), m.group(2).strip()))
    return out


def refs(text):
    """'Something. [S01, S04]' -> ('Something.', ['S01', 'S04'])"""
    m = re.search(r"\s*\[((?:S\d+)(?:,\s*S\d+)*)\]\s*$", text)
    if not m:
        return text.strip(), []
    return text[:m.start()].strip(), [s.strip() for s in m.group(1).split(",")]


def parts_of(page):
    """The part ids on a house page and the titles they show."""
    s = open(os.path.join(ROOT, page), encoding="utf-8").read()
    found = {}
    for m in re.finditer(r'<details class="(?:human|pine|adar)-part[^"]*" id="(part-\d+)"(.*?)</summary>', s, re.S):
        t = re.search(r'class="(?:human|pine|adar)-title[^"]*">(.*?)</span>', m.group(2), re.S)
        found[m.group(1)] = " ".join(html.unescape(re.sub("<.*?>", "", t.group(1))).split()) if t else ""
    return found


def main():
    check_only = "--check" in sys.argv
    text = open(LEDGER, encoding="utf-8").read()
    sec = sections(text)
    problems = []

    # ---- sources -------------------------------------------------------
    sources = []
    for line in sec.get("Sources", []):
        m = re.match(r"^- (S\d+): (.*?) \| (\S+)\s*$", line)
        if m:
            sources.append({"id": m.group(1), "cite": m.group(2).strip(), "url": m.group(3)})
    source_ids = {s["id"] for s in sources}

    # ---- perfumers -----------------------------------------------------
    perfumers = []
    by_name = {}
    for b in blocks(sec.get("Perfumers", [])):
        p = {"id": slug(b["name"]), "name": b["name"], "sort": b["name"], "about": []}
        for k, v in b["items"]:
            if k == "about":
                t, s = refs(v)
                p["about"].append({"t": t, "s": s})
                problems += ["%s: source %s is not in the sources" % (b["name"], x) for x in s if x not in source_ids]
            elif k in ("sort", "born", "from"):
                p[k] = v
        perfumers.append(p)
        by_name[b["name"]] = p
    perfumers.append({"id": NONE_ID, "name": "Perfumer not found", "sort": "￿", "about": [
        {"t": "These perfumes are written about on this site, but no source found names who made them. "
              "When one is found, the perfume moves to its perfumer.", "s": []}]})

    # ---- houses --------------------------------------------------------
    houses = []
    house_by_name = {}
    for b in blocks(sec.get("Houses", [])):
        h = {"id": slug(b["name"]), "name": b["name"]}
        for k, v in b["items"]:
            if k == "about":
                h["about"], h["s"] = refs(v)
                problems += ["%s: source %s is not in the sources" % (b["name"], x) for x in h["s"] if x not in source_ids]
            elif k in ("page", "founded", "from"):
                h[k] = v
        houses.append(h)
        house_by_name[b["name"]] = h

    # ---- perfumes ------------------------------------------------------
    perfumes = []
    page_parts = {}
    rows = [l for l in sec.get("Perfumes", []) if l.startswith("| ") and not l.startswith("| Perfume ")]
    for line in rows:
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) != 8:
            problems.append("a row has %d cells, not 8: %s" % (len(cells), line[:60]))
            continue
        name, who, credit, year, house, onsite, srcs, note = cells
        ids = []
        for w in [x.strip() for x in who.split(";") if x.strip()]:
            if w not in by_name:
                problems.append("%s: perfumer %r has no block under Perfumers" % (name, w))
            else:
                ids.append(by_name[w]["id"])
        if not ids:
            ids = [NONE_ID]
        if credit not in ("named", "house", "none"):
            problems.append("%s: credit %r is not named, house or none" % (name, credit))
        if house not in house_by_name:
            problems.append("%s: house %r has no block under Houses" % (name, house))
        s = [x.strip() for x in srcs.split(",") if x.strip()]
        problems += ["%s: source %s is not in the sources" % (name, x) for x in s if x not in source_ids]
        at = None if onsite in ("", "—", "-") else onsite
        if at:
            page, _, part = at.partition("#")
            if page not in page_parts:
                page_parts[page] = parts_of(page) if os.path.exists(os.path.join(ROOT, page)) else {}
            if part not in page_parts[page]:
                problems.append("%s: %s is not a part on that page" % (name, at))
        kind = None
        if at:
            kind = "individual" if at.startswith("individual-fragrances/") else "house"
        perfumes.append({
            "n": name, "p": ids, "c": credit,
            "y": int(year) if year.isdigit() else None,
            "h": house_by_name[house]["id"] if house in house_by_name else slug(house),
            "at": at, "k": kind, "s": s, "note": note,
        })

    # every perfumer and house a perfume names, and nothing left over unused
    used = {pid for p in perfumes for pid in p["p"]}
    for p in perfumers:
        if p["id"] not in used:
            problems.append("perfumer %s has no perfume" % p["name"])

    if problems:
        print("The ledger has %d problem(s):" % len(problems))
        for p in problems:
            print("  - " + p)
        sys.exit(1)

    counts = {
        "perfumes": len(perfumes),
        "onSite": sum(1 for p in perfumes if p["at"]),
        "perfumers": len(perfumers) - 1,
        "houses": len(houses),
        "dated": sum(1 for p in perfumes if p["y"]),
    }
    print("Ledger: %(perfumes)d perfumes (%(onSite)d on the site, %(dated)d dated), "
          "%(perfumers)d perfumers, %(houses)d houses." % counts)
    if check_only:
        return

    data = {"perfumers": perfumers, "houses": houses, "perfumes": perfumes,
            "sources": sources, "counts": counts}
    with open(DATA, "w", encoding="utf-8") as f:
        f.write("// THE PERFUMERS' DATA — written by tools/perfumers/build.py from\n")
        f.write("// tools/perfumers/LEDGER.md. Never edit this by hand: edit the ledger and\n")
        f.write("// run the tool (then tools/versions.py).\n")
        f.write("window.PERFUMERS_DATA = ")
        f.write(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
        f.write(";\n")
    print("wrote perfumers-data.js")

    write_page(perfumers, houses, perfumes, sources)


def link(at):
    return "../" + at


def source_href(url):
    return "../" + url[5:] if url.startswith("SITE:") else url


def write_page(perfumers, houses, perfumes, sources):
    if not os.path.exists(PAGE):
        print("no perfumers/index.html yet; the index was not written")
        return
    hid = {h["id"]: h for h in houses}
    order = sorted(perfumers, key=lambda p: (p["id"] == NONE_ID, slug(p.get("sort", p["name"]))))
    out = []
    w = out.append
    for p in order:
        mine = [x for x in perfumes if p["id"] in x["p"]]
        w('      <article class="pf-entry" id="perfumer-%s">' % p["id"])
        w('        <h3 class="pf-entry-name">%s <span class="pf-entry-count">%d</span></h3>' % (html.escape(p["name"]), len(mine)))
        groups = {}
        for x in mine:
            groups.setdefault(x["h"], []).append(x)
        for h_id in sorted(groups, key=lambda k: slug(hid[k]["name"])):
            w('        <p class="pf-entry-house">%s</p>' % html.escape(hid[h_id]["name"]))
            w('        <ul class="pf-entry-list">')
            for x in sorted(groups[h_id], key=lambda x: slug(x["n"])):
                name = html.escape(x["n"])
                if x["at"]:
                    name = '<a href="%s">%s</a>' % (link(x["at"]), name)
                yr = str(x["y"]) if x["y"] else "year not found"
                w('          <li><span class="pf-entry-perfume">%s</span> <span class="pf-entry-year">%s</span></li>' % (name, yr))
            w('        </ul>')
        w('      </article>')
    index = "\n".join(out)

    src = []
    for s in sources:
        href = source_href(s["url"])
        cite = s["cite"]
        cite = re.sub(r"\*(.+?)\*", r"<cite>\1</cite>", html.escape(cite, quote=False))
        src.append('        <li id="source-%s"><span class="pf-source-no">%s</span> %s <a href="%s">%s</a></li>'
                   % (s["id"].lower(), s["id"][1:], cite, html.escape(href), html.escape(href.replace("https://", "").replace("../", "thetasteofaldehydes.com/"))))
    sources_html = "\n".join(src)

    page = open(PAGE, encoding="utf-8").read()
    for marker, body in (("INDEX", index), ("SOURCES", sources_html)):
        a = "<!-- THE %s: begin" % marker
        b = "<!-- THE %s: end -->" % marker
        i, j = page.find(a), page.find(b)
        if i < 0 or j < 0:
            print("perfumers/index.html has no %s markers; not written" % marker)
            return
        i = page.index("-->", i) + 3
        page = page[:i] + "\n" + body + "\n      " + page[j:]
    # the counts the page says before its script has run (the script says
    # them again from the data): the index's, the legend's and the sources'
    c = {"perfumes": len(perfumes), "onSite": sum(1 for p in perfumes if p["at"]),
         "perfumers": len(perfumers) - 1, "houses": len(houses)}
    page = re.sub(r"(data-index-counts>)[^<]*(<)",
                  r"\g<1>%(perfumers)d perfumers · %(houses)d houses · %(perfumes)d perfumes\g<2>" % c, page)
    page = re.sub(r"(data-counts>)[^<]*(<)",
                  r"\g<1>%(perfumes)d perfumes · %(onSite)d written about on The Taste of Aldehydes · "
                  r"%(perfumers)d perfumers · %(houses)d houses\g<2>" % c, page)
    page = re.sub(r"(data-source-count>)[^<]*(<)", r"\g<1>%d sources\g<2>" % len(sources), page)
    open(PAGE, "w", encoding="utf-8").write(page)
    print("wrote the index, the sources and the counts into perfumers/index.html")


if __name__ == "__main__":
    main()

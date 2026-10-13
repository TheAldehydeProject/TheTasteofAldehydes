#!/usr/bin/env python3
# ============================================================
# THE NOTE LIBRARY'S CATALOGUE — run by hand, never by the site
#
# The owner, 2026-09-29: "you are not limited with words when it comes to
# describing a scent. I want you to be holistic and simple, but not hold
# back ... search up the notes ... have at least two sources for each
# description of a note." And: "the middle node ... to be called sources,
# which should house all the sources ... the first source is me."
#
# note-library/index.html carries the library as its own markup —
# every accord, every note, what it is, its variations and its sources —
# and network.js reads it from there. This writes that markup, between the
# page's CATALOGUE markers, from:
#
#   base.json        every accord and note: its id, name, other spellings
#                    (aka) and the one line the old library gave it (old),
#                    which stands until the note is researched;
#   research/*.py    what each note is, what each variation means, and the
#                    sources each was written from (research/acc.py says
#                    how a file is laid out).
#
# Sources are numbered as the page shows them: 1 is the owner ("Me."), and
# the rest in alphabetical order of their MLA 8 entry, from 2 — so a source
# added renumbers those after it, which is why this writes them all.
#
#   python3 tools/note-library/catalogue.py          # write the page
#   python3 tools/note-library/catalogue.py --check  # only report
#
# It reports every note with fewer than two sources, every variation not
# written, every note not researched yet, any source cited twice (SAME_PAGE,
# below), and — with --check — a page not written since the research
# changed. tools/note-library/RULEBOOK.md is what it is one part of.
# ============================================================
import html, importlib.util, json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
PAGE = os.path.join(REPO, "note-library", "index.html")   # its own address since 2026-10-01; categories/note-library.html is a signpost now
ACCESSED = "29 Sept. 2026"      # the day a source was read, unless it says otherwise

# ---------- the library, and what research says of it ----------
base = json.load(open(os.path.join(HERE, "base.json"), encoding="utf-8"))
byid = {n["id"]: n for A in base["accords"] for n in A["notes"]}
sys.path.insert(0, os.path.join(HERE, "research"))
import acc  # noqa: E402  (the registry every research file writes into)
for f in sorted(os.listdir(os.path.join(HERE, "research"))):
    if f.endswith(".py") and f != "acc.py":
        spec = importlib.util.spec_from_file_location(f[:-3], os.path.join(HERE, "research", f))
        spec.loader.exec_module(importlib.util.module_from_spec(spec))

# ---------- ONE SOURCE, ONE ENTRY (the rulebook's rule 11, 2026-10-13) ----------
# "check existing citations, and make sure there are no duplicates. if
# something was used twice, remove the second entry and apply the number of
# the first instead of the second everywhere the second was used." A page
# is the same page however its address is written — http or https, with
# www. or without, a slash at its end or not, an #anchor — and SAME_PAGE
# names the addresses that only lead to another (a redirect, a second
# spelling of the same article): each is folded into the one it leads to,
# so it has one entry and one number wherever it is cited. Two entries left
# with the same title at the same site are reported (`--check`), to be
# folded here or named in NOT_SAME as two different pages.
SAME_PAGE = {
    # Wikipedia's "Benzoin resin" is its "Benzoin (resin)" (sources 119 and
    # 120 until 2026-10-13; 120 folded into 119)
    "https://en.wikipedia.org/wiki/Benzoin_(resin)": "https://en.wikipedia.org/wiki/Benzoin_resin",
}
NOT_SAME = set()   # pairs of addresses checked and found to be two pages: frozenset({a, b})
def canonical(url):
    u = url.strip()
    u = re.sub(r"^http://", "https://", u)
    u = re.sub(r"^https://www\.", "https://", u)
    u = u.split("#")[0]
    if u.count("/") > 2: u = u.rstrip("/")
    return u
SAME = {canonical(a): canonical(b) for a, b in SAME_PAGE.items()}

sources, problems = {}, []
def take(S, keys):
    urls = []
    for k in keys:
        s = S[k]
        own = canonical(s[0])
        url = SAME.get(own, own)
        e = sources.setdefault(url, {"title": s[1], "href": s[0], "folded": own != url})
        if own == url and e["folded"]:
            # (the page it was folded into, cited in its own right: its own words)
            e.update(title=s[1], href=s[0], folded=False)
        if own == url:
            if len(s) > 2 and s[2]: e["site"] = s[2]
            if len(s) > 3 and s[3]: e["author"] = s[3]
            if len(s) > 4 and s[4]: e["accessed"] = s[4]
        urls.append(url)
    return urls
for code, S, N in acc.REGISTRY:
    for nid, e in N.items():
        n = byid.get(nid)
        if not n: problems.append("%s: no such note %s" % (code, nid)); continue
        if e.get("say"):
            if n.get("say"): problems.append("%s: %s is written twice" % (code, nid))
            n["say"], n["src"] = e["say"], take(S, e["src"])
            if len(set(n["src"])) < 2: problems.append("fewer than two sources: " + nid)
        n.setdefault("vars", {})
        for name, v in e.get("vars", {}).items():
            if name not in n["aka"]: problems.append("%s: not a variation of %s: %s" % (code, nid, name)); continue
            if name in n["vars"]: problems.append("%s: %s / %s is written twice" % (code, nid, name))
            if "same" in v:
                n["vars"][name] = {"same": True, "say": v["same"] if isinstance(v["same"], str) else ""}
            else:
                n["vars"][name] = {"say": v["say"], "src": take(S, v["src"])}
                if len(set(n["vars"][name]["src"])) < 2: problems.append("variation with fewer than two sources: %s / %s" % (nid, name))
waiting = [n["id"] for n in byid.values() if not n.get("say")]
for n in byid.values():
    if n.get("say"):
        for a in n["aka"]:
            if a not in n.get("vars", {}): problems.append("variation not written: %s / %s" % (n["id"], a))

# ---------- MLA 8 ----------
esc = lambda s: html.escape(s, quote=True)
SITES = {"fragrantica.com": "Fragrantica", "fragrantica.fr": "Fragrantica", "perfumesociety.org": "The Perfume Society", "osmoz.com": "Osmoz",
         "en.wikipedia.org": "Wikipedia", "scentspiracy.com": "Scentspiracy", "thegoodscentscompany.com": "The Good Scents Company",
         "scentree.co": "ScenTree", "britannica.com": "Encyclopædia Britannica", "perfumerflavorist.com": "Perfumer &amp; Flavorist",
         "fraterworks.com": "Fraterworks", "basenotes.com": "Basenotes"}
MINOR = set("a an the and but or for nor of on in to at by as with from vs via per into over".split())
def title_case(t):
    out = []
    for i, w in enumerate(t.split(" ")):
        if not w: continue
        if i and w.lower().rstrip(".") in MINOR and not out[-1].endswith(":"): out.append(w.lower())
        elif any(c.isupper() for c in w[1:]) or w[:1].isupper(): out.append(w)
        else: out.append(w[:1].upper() + w[1:])
    return " ".join(out)
def mla_of(url, raw, site=None, author=None, accessed=None):
    host = re.sub(r"^https?://", "", url).split("/")[0]
    bare = host[4:] if host.startswith("www.") else host
    site = site or SITES.get(bare) or SITES.get(".".join(bare.split(".")[-2:])) or bare
    t = raw.strip()
    if " ~ " in t: t = t.split(" ~ ")[0]
    t = re.sub(r"^ScenTree - ", "", t)
    for sep in (" - ", " | ", " – ", " — "):
        if sep in t:
            head, tail = t.rsplit(sep, 1)
            if tail.strip().lower().replace("the ", "") in (html.unescape(site).lower().replace("the ", ""), bare.lower()) or "wikipedia" in tail.lower():
                t = head
    t = title_case(t).rstrip(".")
    shown = re.sub(r"^https?://", "", url)
    extra = ", Wikimedia Foundation" if site == "Wikipedia" else ""
    who = (author.rstrip(".") + ". ") if author else ""
    stop = "" if t.endswith(("?", "!")) else "."
    return '%s“%s%s” <cite>%s</cite>%s, <a href="%s" target="_blank" rel="noopener noreferrer">%s</a>. Accessed %s.' % (
        who, esc(t), stop, site, extra, esc(url), esc(shown), accessed or ACCESSED)
def sort_key(mla):
    text = html.unescape(re.sub(r"<[^>]+>", "", mla)).lstrip("“\"'‘ ")
    return re.sub(r"[^a-z0-9 ]", "", unicodedata.normalize("NFD", text).lower())
for url, v in sources.items():
    v["mla"] = mla_of(v["href"], v["title"], v.get("site"), v.get("author"), v.get("accessed"))
# the same source twice, not yet folded: the same title at the same site
twice = {}
for url, v in sources.items():
    m = re.search(r"“(.*?)” <cite>(.*?)</cite>", v["mla"])
    said = (sort_key(m.group(1)).replace(" ", ""), m.group(2)) if m else (url, "")
    twice.setdefault(said, []).append(url)
for title, urls in twice.items():
    for i, a in enumerate(urls):
        for b in urls[i + 1:]:
            if frozenset((a, b)) not in NOT_SAME:
                problems.append("the same source twice? %s and %s — fold one into the other in SAME_PAGE, or name the pair in NOT_SAME" % (a, b))
order = sorted(sources, key=lambda u: sort_key(sources[u]["mla"]))
number = {u: i + 2 for i, u in enumerate(order)}
def cite(urls):
    nums = sorted({number[u] for u in urls})
    return ' data-sources="%s"' % " ".join(map(str, nums)) if nums else ""

# ---------- the catalogue ----------
out = ['<section class="lib-catalogue" aria-label="Every note in the library, by accord">',
       '  <h2 class="lib-catalogue-title">Every note, by accord</h2>']
for A in base["accords"]:
    out.append('  <section class="lib-shelf" id="shelf-%s" data-shelf="%s">' % (A["code"].lower(), A["code"]))
    out.append('    <h2 class="lib-shelf-name"><span class="lib-shelf-code">%s</span> %s</h2>' % (A["code"], esc(A["name"])))
    if A.get("say"): out.append('    <p class="lib-shelf-say">%s</p>' % esc(A["say"]))
    for n in A["notes"]:
        aka = n.get("aka", [])
        out.append('    <article class="lib-record" id="%s"%s>' % (n["id"], ' data-aka="%s"' % esc("|".join(aka)) if aka else ""))
        out.append('      <h3 class="lib-name">%s</h3>' % esc(n["name"]))
        out.append('      <p class="lib-say"%s>%s</p>' % (cite(n.get("src", [])), esc(n.get("say") or n.get("old", ""))))
        if aka:
            out.append('      <dl class="lib-variations">')
            for a in aka:
                v = n.get("vars", {}).get(a, {})
                out.append('        <dt>%s</dt>' % esc(a))
                if v.get("same"): out.append('        <dd class="lib-same">%s</dd>' % esc(v.get("say") or acc.SAME))
                else: out.append('        <dd%s>%s</dd>' % (cite(v.get("src", [])), esc(v.get("say", ""))))
            out.append('      </dl>')
        out.append('    </article>')
    out.append('  </section>')
out += ['  <section class="lib-sources" id="sources">', '    <h2>Sources</h2>', '    <ol>',
        '      <li id="source-1" class="lib-source-me">Me.</li>']
out += ['      <li id="source-%d">%s</li>' % (number[u], sources[u]["mla"]) for u in order]
out += ['    </ol>', '  </section>', '</section>']

print("notes %d, researched %d, sources %d (and the owner)" % (len(byid), len(byid) - len(waiting), len(order)))
if waiting: print("not researched yet (%d): %s" % (len(waiting), ", ".join(w[5:] for w in waiting)))
for p in problems: print("  ! " + p)
page = open(PAGE, encoding="utf-8").read()
new, count = re.subn(r"(<!-- CATALOGUE: begin -->).*?(\s*<!-- CATALOGUE: end -->)",
                     lambda m: m.group(1) + "\n  " + "\n  ".join(out) + m.group(2), page, flags=re.S)
if count != 1: sys.exit("the page's CATALOGUE markers were not found")
if "--check" in sys.argv:
    # (and the page as this would write it: a research file changed and the
    # tool not run since is a page saying what the research does not)
    if new != page: problems.append("the page is not what the research says: run python3 tools/note-library/catalogue.py")
    for p in problems[len(problems) - (new != page):]: print("  ! " + p)
    sys.exit(1 if problems else 0)
open(PAGE, "w", encoding="utf-8").write(new)
print("written: " + os.path.relpath(PAGE, REPO))

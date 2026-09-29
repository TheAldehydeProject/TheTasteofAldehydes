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
# categories/note-library.html carries the library as its own markup —
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
# written, and every note not researched yet.
# ============================================================
import html, importlib.util, json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
PAGE = os.path.join(REPO, "categories", "note-library.html")
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

sources, problems = {}, []
def take(S, keys):
    urls = []
    for k in keys:
        s = S[k]
        e = sources.setdefault(s[0], {"title": s[1]})
        if len(s) > 2 and s[2]: e["site"] = s[2]
        if len(s) > 3 and s[3]: e["author"] = s[3]
        if len(s) > 4 and s[4]: e["accessed"] = s[4]
        urls.append(s[0])
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
    v["mla"] = mla_of(url, v["title"], v.get("site"), v.get("author"), v.get("accessed"))
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
if "--check" in sys.argv: sys.exit(1 if problems else 0)
page = open(PAGE, encoding="utf-8").read()
new, count = re.subn(r"(<!-- CATALOGUE: begin -->).*?(\s*<!-- CATALOGUE: end -->)",
                     lambda m: m.group(1) + "\n  " + "\n  ".join(out) + m.group(2), page, flags=re.S)
if count != 1: sys.exit("the page's CATALOGUE markers were not found")
open(PAGE, "w", encoding="utf-8").write(new)
print("written: " + os.path.relpath(PAGE, REPO))

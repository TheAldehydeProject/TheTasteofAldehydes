"""What every research file here imports. A file is one accord (or part of
one): S, its sources — {key: (url, title[, site[, author[, accessed]]])}, accessed as MLA
dates it ("2 Oct. 2026"), 29 Sept. 2026 if not given — and N, its
notes — {note id: dict(say=..., src=[keys], vars={spelling: dict(same="...")
| dict(say=..., src=[keys])})} — handed to out(). catalogue.py collects them."""
SAME = "No change: the same note, written another way."
REGISTRY = []
def out(code, S, N):
    for nid, e in N.items():
        for k in list(e.get("src", [])) + [k for v in e.get("vars", {}).values() for k in v.get("src", [])]:
            if k not in S: raise SystemExit("%s: %s names a source it does not list: %s" % (code, nid, k))
    REGISTRY.append((code, S, N))

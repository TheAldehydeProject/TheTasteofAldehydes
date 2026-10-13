#!/usr/bin/env python3
# ============================================================
# EVERY SCRIPT AND STYLESHEET ASKED FOR BY ITS VERSION — run by hand, never by the site
#
# The owner, 2026-10-13: "please make sure that everything runs smoothly.
# I feel that there are several pages that are having issues opening;
# mainly, the note library and the SD". One way a page fails to open is
# this: GitHub Pages tells a browser it may keep every file for ten
# minutes, so for ten minutes after the site changes a browser can put a
# new page together with the scripts it kept from before — a page the
# scripts no longer know, a script looking for what the page no longer
# has — and the page stands half drawn, or held hidden, until it is
# reloaded later.
#
# So every page asks for its scripts and its stylesheet by their version:
# `../network.js?v=3f9a1c02b7`, the first ten characters of a fingerprint
# of the file as it is. A file changed is a new address, which no browser
# has kept, so a new page always comes with its own scripts. (The server
# ignores what comes after the `?`; the file is the same file.)
#
# RUN IT AFTER CHANGING ANY SCRIPT OR style.css (and after adding a page):
#   python3 tools/versions.py
# Running it twice changes nothing the second time. A test in
# tests/repository.spec.js fails until every page asks for every script by
# the version it is now.
#
# Not versioned: what a script fetches for itself (qimu-whole.js, the map's
# scripts the home page loads with `?map=on`), and archive/, which is kept
# as it was.
# ============================================================
import hashlib, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.chdir(ROOT)

def version(path):
    with open(path, "rb") as f:
        return hashlib.sha1(f.read()).hexdigest()[:10]

# <script src="…js">, <link … href="…css"> — a local address, with or
# without a version already on it.
ASKED = re.compile(r'(<script\b[^>]*?\bsrc="|<link\b[^>]*?\bhref=")([^"#?]+\.(?:js|css))(\?v=[0-9a-f]+)?(")')

def pages():
    out = subprocess.run(["git", "ls-files", "*.html"], capture_output=True, text=True, check=True).stdout.split()
    # and any page not committed yet
    for d, _, fs in os.walk("."):
        if d.startswith(("./node_modules", "./.git", "./archive", "./test-results", "./playwright-report")): continue
        for f in fs:
            if f.endswith(".html"):
                p = os.path.relpath(os.path.join(d, f))
                if p not in out: out.append(p)
    return [p for p in out if not p.startswith("archive/") and os.path.exists(p)]

def rewrite(page, html):
    missing = []
    def one(m):
        lead, addr, _, tail = m.groups()
        if re.match(r"^([a-z]+:)?//", addr): return m.group(0)
        file = os.path.normpath(os.path.join(os.path.dirname(page), addr))
        if not os.path.isfile(file):
            missing.append(addr)
            return m.group(0)
        return lead + addr + "?v=" + version(file) + tail
    # Only outside comments: a template's commented-out example is left alone.
    parts = re.split(r"(<!--[\s\S]*?-->)", html)
    return "".join(p if p.startswith("<!--") else ASKED.sub(one, p) for p in parts), missing

changed, missing = 0, []
for page in pages():
    with open(page, encoding="utf8") as f: html = f.read()
    new, gone = rewrite(page, html)
    missing += [page + " -> " + g for g in gone]
    if new != html:
        with open(page, "w", encoding="utf8") as f: f.write(new)
        changed += 1
print(changed, "pages written")
if missing:
    print("asked for and not there:", *missing, sep="\n  ")
    sys.exit(1)

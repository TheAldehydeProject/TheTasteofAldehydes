#!/usr/bin/env python3
# ============================================================
# WHAT SEARCH ENGINES AND SHARED LINKS SEE — run by hand, never by the site
#
# The owner, 2026-09-26: "can you also do search engine optimisation so
# that when you google this or look it up with any search engine, then it
# would look good?" This writes, into the <head> of every page, between
# its two SEARCH ENGINES comments:
#
#   a DESCRIPTION   the line a search engine shows under the title;
#   a CANONICAL     the one address the page is known by, on the site's
#                   own domain (CNAME: thetasteofaldehydes.com);
#   the ICONS       favicon.svg, and apple-touch-icon.png for a phone;
#   OPEN GRAPH      and a Twitter card: the title, the line and the
#                   picture (images/social-card.png) a shared link shows —
#                   the Twitter card says all of them itself as well
#                   (2026-09-27), rather than leaving X to fall back on
#                   Open Graph's;
#   A THEME COLOUR  the page's own ground, which a phone's browser paints
#                   its bar in (`THEME`, below);
#   STRUCTURED DATA the site's name for the home page, the trail each
#                   page stands in (Home › Scent descriptions › ADAR),
#                   which a search engine may show in place of the address,
#                   and, for a piece of writing, that it is an article of
#                   the site's;
#
# and NOINDEX on what is not the site itself — its search page, the
# sandbox pages, the templates, and the pages left forwarding from
# where the houses and the test page used to be. It writes sitemap.xml (every page that is
# indexed) and robots.txt (which names the sitemap, and keeps out the
# archived copy of an old view in archive/, which is left untouched).
#
# A NEW PAGE needs a line in P below, and this run again:
#   python3 tools/seo.py
# Running it twice changes nothing the second time. There is a test for
# all of it in tests/repository.spec.js.
# ============================================================
import re, json, html as H, os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
BASE = "https://thetasteofaldehydes.com/"
SITE = "The Taste of Aldehydes"
HOME = ("Home", "")
SD = ("Scent descriptions", "categories/scent-descriptions.html")
TH = ("Theories", "categories/theories.html")
RE_ = ("Explorations & Researches", "categories/researches.html")

P = {
 "index.html": dict(type="website", desc="A personal project of perfume exploration. “The Taste of Aldehydes” will act as a library for information, interpretations, theories and even ideas.", crumbs=None),
 "categories/scent-descriptions.html": dict(desc="Scent descriptions: nine perfume houses, from Pineward and ADAR to Tombstone and Qimu & Musicians, and individual fragrances, each described.", crumbs=[HOME]),
 "categories/theories.html": dict(desc="Theories — some frameworks that I came up with myself: The Architecture of Sunscreen, The Architecture of Sweat and The Note Dissemination Framework.", crumbs=[HOME]),
 "categories/favorites.html": dict(desc="Favourites — things I like, no other criteria than that: fragrances in chapters, among them Des Cendres, Haxan and De Profundis.", crumbs=[HOME]),
 "categories/researches.html": dict(desc="Explorations & Researches. Here you will find my researches and my explorations: a guide to perfume, dupes, designers and niches, resins in perfumery, and more.", crumbs=[HOME]),
 "categories/note-library.html": dict(desc="The Note Library: every note named in a fragrance on this site as a network in three dimensions, filed by accord — what each is, its variations, where it stands in the fragrances, and its sources.", crumbs=[HOME]),
 "categories/other-2.html": dict(desc="Photography: pictures taken alongside the writing — mostly of the things being described, sometimes of the places they brought to mind.", crumbs=[HOME]),
 "houses/pineward.html": dict(type="article", desc="Pineward, the house that smells like trees: forty-seven fragrances described with their notes and photographs — Murkwood, Snoqualmie, White Fir and more.", crumbs=[HOME, SD]),
 "houses/adar.html": dict(type="article", desc="ADAR, the house that you have never heard of: eleven fragrances described with their notes — Amber Zero, Aetherialism, Incantu, Lignum Dei, Tyrian and more.", crumbs=[HOME, SD]),
 "houses/almost-human.html": dict(type="article", desc="Almost Human, abstraction done quite well: Burning Bridges, Dear Future, Desert Hope, Ritual Code and Silent Rain, described with their olfactory landscapes.", crumbs=[HOME, SD]),
 "houses/ataraxia.html": dict(type="article", desc="Ataraxia: Amaretto Jazz in the Melting Room, Deity, My Doll’s Makeup, Spinal Fluid and Vestibule, described with their notes.", crumbs=[HOME, SD]),
 "houses/grande-parfums.html": dict(type="article", desc="Grande Parfums, smelled at Art Niche Expo 2026: Vintage Memoir, Ambresso, Ancient Oud, Vanilla Ash, Karak & Shisha and more, described with their notes.", crumbs=[HOME, SD]),
 "houses/les-abstraits.html": dict(type="article", desc="Les Abstraits, Eugen’s ideas and Antoine Lie’s execution: Belle Âme, Des Cendres, La Douleur Exquise and Philosopher’s Walk, described with their notes.", crumbs=[HOME, SD]),
 "houses/tale-parfums.html": dict(type="article", desc="Tale Parfums: Bad Lily, Fleurt, Rouse and Water Me, described with their pictures, on a page drawn by hand.", crumbs=[HOME, SD]),
 "houses/tombstone.html": dict(type="article", desc="Tombstone, a house that expanded on death: 3 Feet 5, Evergrow, No Need to Come By, Sing at My Funeral and Sweet Coffin, described with their notes.", crumbs=[HOME, SD]),
 "houses/qimu-and-musicians.html": dict(type="article", desc="Qimu & Musicians, a house of music and fragrance: Guitarist, Vocal, Bassist and Drummer — a fragrance for each player in a band.", crumbs=[HOME, SD]),
 "individual-fragrances/individual-fragrances.html": dict(type="article", desc="Individual fragrances: CV99, De Profundis, Haxan, Tobacolor, Flamenco, French Riviera, Velvet Fog and House of Ellixirz, each described with its notes.", crumbs=[HOME, SD]),
 "works/theory-01.html": dict(type="article", desc="While smelling perfumes, I realized that there are many fragrances that attempt to achieve the olfactory profile equivalent to sunscreen with their formulation.", crumbs=[HOME, TH]),
 "works/theory-02.html": dict(type="article", desc="Sweat is a facet in fragrances that I feel does not receive much thought. A way of telling the fragrances that use it apart.", crumbs=[HOME, TH]),
 "works/theory-03.html": dict(type="article", desc="This is a theory that tries to explain the evolution of fragrance in terms of how distinguishable notes are — with a calculator for it.", crumbs=[HOME, TH]),
 "works/my-personal-introduction-to-perfume.html": dict(type="article", desc="My personal introduction to perfume: this article is intended to clarify everything a person might need to understand perfume.", crumbs=[HOME, RE_]),
 "works/dupes-designers-and-niches.html": dict(type="article", desc="Dupes, designers and niches — and private lines and ultra niches: the categories of fragrances based on the market itself, their prices, their goals and their smell.", crumbs=[HOME, RE_]),
 "works/resins-in-perfumery.html": dict(type="article", desc="Resins in perfumery: what a resin is, and then examples of the most frequently used ones, as well as what makes them unique.", crumbs=[HOME, RE_]),
 "works/skin.html": dict(type="article", desc="Skin, and how it affects the perfume you wear: pH, bacteria, oily, dry and moisturized skin, diet, hormones and medications, and the geography of the skin.", crumbs=[HOME, RE_]),
 "works/buying-a-perfume.html": dict(type="article", desc="Buying a Perfume, simplifying the thought process: night or day, inside or out, summer or winter, safe or divisive, and the special cases.", crumbs=[HOME, RE_]),
 "contact.html": dict(desc="Get in touch with The Taste of Aldehydes, a personal project of perfume exploration: send a carrier pigeon, or an email.", crumbs=[HOME]),
 # Not for search engines: the site's own search, the sandbox and the
 # templates, and the pages left standing where the houses used to be.
 "search.html": dict(desc="Search The Taste of Aldehydes: every house, fragrance, note and piece of writing on the site.", noindex=True),
  "works/test-node-a.html": dict(desc="A sandbox page, not a part of the site.", noindex=True),
 "works/test-node-b.html": dict(desc="A sandbox page, not a part of the site.", noindex=True),
 "works/example-article-work.html": dict(desc="A template for a piece of writing, not a part of the site.", noindex=True),
 "works/example-gallery-work.html": dict(desc="A template for a gallery of pictures, not a part of the site.", noindex=True),
}
# The forwarding pages: canonical to where the house lives now.
for slug in ["adar", "almost-human", "ataraxia", "grande-parfums", "les-abstraits", "pineward"]:
    P["works/%s.html" % slug] = dict(desc=P["houses/%s.html" % slug]["desc"], noindex=True, canonical="houses/%s.html" % slug)
P["works/individual-fragrances.html"] = dict(desc=P["individual-fragrances/individual-fragrances.html"]["desc"], noindex=True, canonical="individual-fragrances/individual-fragrances.html")
# The test page became the Note Library (2026-09-29), and forwards there.
P["works/test-page.html"] = dict(desc=P["categories/note-library.html"]["desc"], noindex=True, canonical="categories/note-library.html")

# THE THEME COLOUR: each page's own ground, read off the page as it is
# drawn. A page not named here is on the site's white paper.
PAPER = "#fafaf9"
THEME = {
 "categories/scent-descriptions.html": "#ffffff",
 "categories/note-library.html": "#1f1f20", "works/test-page.html": "#1f1f20",
 "categories/theories.html": "#15171d",
 "houses/adar.html": "#07070a", "works/adar.html": "#07070a",
 "houses/ataraxia.html": "#1b1d21", "works/ataraxia.html": "#1b1d21",
 "houses/grande-parfums.html": "#f6f2e8", "works/grande-parfums.html": "#f6f2e8",
 "houses/les-abstraits.html": "#f3f0f5", "works/les-abstraits.html": "#f3f0f5",
 "houses/pineward.html": "#eef1ea", "works/pineward.html": "#eef1ea",
 "houses/qimu-and-musicians.html": "#e2ebf6",
 "houses/tale-parfums.html": "#fbf8f0",
 "houses/tombstone.html": "#ecebe8",
 "search.html": "#191c21",
}
for essay in ["theory-01", "theory-02", "theory-03", "resins-in-perfumery", "skin",
              "buying-a-perfume", "dupes-designers-and-niches", "my-personal-introduction-to-perfume"]:
    THEME["works/%s.html" % essay] = "#0a0b0e"

def esc(t): return H.escape(t, quote=True)

done = []
for path, meta in P.items():
    s = open(path, encoding="utf-8").read()
    # Out with anything this wrote before, and the old description.
    s = re.sub(r"\n?<!-- SEARCH ENGINES: begin.*?<!-- SEARCH ENGINES: end -->", "", s, flags=re.S)
    s = re.sub(r'\n?<meta name="description" content="[^"]*">', "", s)
    title = H.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1)).strip()
    short = title.replace(" — " + SITE, "").strip() or SITE
    depth = path.count("/")
    root = "../" * depth
    canon = BASE + (meta.get("canonical", path) if path != "index.html" else "")
    lines = ["<!-- SEARCH ENGINES: begin — what a search engine and a shared link show of this page. -->",
             '<meta name="description" content="%s">' % esc(meta["desc"])]
    # A forwarding page names the house's own address already, as one of
    # its three ways of forwarding; it is not given a second.
    if "canonical" not in meta:
        lines.append('<link rel="canonical" href="%s">' % canon)
    if meta.get("noindex"):
        lines.append('<meta name="robots" content="noindex, follow">')
    lines += ['<link rel="icon" href="%sfavicon.svg" type="image/svg+xml">' % root,
              '<link rel="apple-touch-icon" href="%sapple-touch-icon.png">' % root,
              '<meta name="theme-color" content="%s">' % THEME.get(path, PAPER)]
    if not meta.get("noindex"):
        lines += ['<meta property="og:site_name" content="%s">' % SITE,
                  '<meta property="og:type" content="%s">' % meta.get("type", "website"),
                  '<meta property="og:title" content="%s">' % esc(short),
                  '<meta property="og:description" content="%s">' % esc(meta["desc"]),
                  '<meta property="og:url" content="%s">' % canon,
                  '<meta property="og:image" content="%simages/social-card.png">' % BASE,
                  '<meta property="og:image:width" content="1200">',
                  '<meta property="og:image:height" content="630">',
                  '<meta property="og:image:alt" content="The Taste of Aldehydes — perfumes and my notes about them">',
                  '<meta property="og:locale" content="en_GB">',
                  '<meta name="twitter:card" content="summary_large_image">',
                  '<meta name="twitter:title" content="%s">' % esc(short),
                  '<meta name="twitter:description" content="%s">' % esc(meta["desc"]),
                  '<meta name="twitter:image" content="%simages/social-card.png">' % BASE,
                  '<meta name="twitter:image:alt" content="The Taste of Aldehydes — perfumes and my notes about them">']
        data = []
        if path == "index.html":
            data.append({"@context": "https://schema.org", "@type": "WebSite", "name": SITE,
                         "alternateName": "Taste of Aldehydes", "url": BASE,
                         "description": meta["desc"], "inLanguage": "en"})
        if meta.get("type") == "article":
            data.append({"@context": "https://schema.org", "@type": "Article", "headline": short,
                         "description": meta["desc"], "url": canon, "image": BASE + "images/social-card.png",
                         "inLanguage": "en", "isPartOf": {"@type": "WebSite", "name": SITE, "url": BASE}})
        if meta.get("crumbs"):
            items = [{"@type": "ListItem", "position": i + 1, "name": n, "item": BASE + u}
                     for i, (n, u) in enumerate(meta["crumbs"] + [(short, path)])]
            data.append({"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items})
        for d in data:
            lines.append('<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + "</script>")
    lines.append("<!-- SEARCH ENGINES: end -->")
    block = "\n".join(lines)
    s = re.sub(r"(<title>.*?</title>)", lambda m: m.group(1) + "\n" + block, s, count=1, flags=re.S)
    open(path, "w", encoding="utf-8").write(s)
    done.append(path)

# THE SITEMAP: every page a search engine should know about.
import datetime
today = datetime.date.today().isoformat()
urls = [p for p, m in P.items() if not m.get("noindex")]
order = {"index.html": 0}
urls.sort(key=lambda p: (order.get(p, 1), p))
xml = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p in urls:
    loc = BASE + ("" if p == "index.html" else p)
    pri = "1.0" if p == "index.html" else "0.8" if p.startswith(("categories/", "houses/")) else "0.6"
    xml.append("  <url><loc>%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>" % (esc(loc), today, pri))
xml.append("</urlset>")
open("sitemap.xml", "w").write("\n".join(xml) + "\n")
open("robots.txt", "w").write("User-agent: *\nAllow: /\n# A copy of an earlier view, kept as it was; not a page of the site.\nDisallow: /archive/\n\nSitemap: %ssitemap.xml\n" % BASE)
print(len(done), "pages;", len(urls), "in the sitemap")
missing = [f for f in os.popen("ls *.html categories/*.html houses/*.html individual-fragrances/*.html works/*.html").read().split() if f not in P]
print("pages without an entry:", missing)

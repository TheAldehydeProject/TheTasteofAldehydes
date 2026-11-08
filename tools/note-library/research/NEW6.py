from acc import out
# THE NOTES OF COOKIE (Grande Parfums), 2026-11-08, filed by the rulebook
# (tools/note-library/RULEBOOK.md) with the owner's word on each: Blackcurrant
# a new note of its own beside Cassis (the bud); Cake a new note, Chocolate
# Cake (and its Amandină and Lava Cake) its variations; Ceylon Cinnamon the
# Ceylon variation of Cinnamon written the other way round (SPI.py). Read
# through search summaries: the pages themselves would not open from here.
A = "8 Nov. 2026"
S = {
 # blackcurrant
 "pp_blackcurrant": ("https://premierepeau.com/pages/glossary-terms/black-currant", "Black Currant", "Premiere Peau", None, A),
 "psh_blackcurrant": ("https://perfumeshrine.blogspot.com/search/label/black%20currant", "Black Currant", "Perfume Shrine", None, A),
 "ed_blackcurrant": ("https://edenbotanicals.com/black-currant-bud-absolute.html", "Black Currant Bud Absolute", "Eden Botanicals", None, A),
 # cake
 "sv_cake": ("https://scentverdict.com/note/cake", "Cake", "Scent Verdict", None, A),
 "ca_cupcake": ("https://caperfume.com/pages/discover-ingredient/cupcake", "Ingredient Guide: Sweets and Gourmand Smells", "CA Perfume", None, A),
 "sd_gourmand": ("https://www.sylvaine-delacourte.com/en/guide/the-gourmet-facet", "The Gourmand Facet", "Sylvaine Delacourte", None, A),
}
N = {
 "note-blackcurrant": dict(
  say="The berry of the blackcurrant bush, Ribes nigrum, as a fruit rather than a bud: dark, tart and jammy, purple and a little sharp. As a note it is mostly built, from fruity esters and berry bases (the sweet, jammy cassis of the 1980s), where the natural bud absolute, Cassis here, is greener, lighter and catty, and is used only in traces.",
  src=["psh_blackcurrant", "pp_blackcurrant", "ed_blackcurrant"]),
 "note-cake": dict(
  say="Freshly baked sponge or pound cake: vanilla, butter, sugar and a hint of egg, sweet, creamy and a little toasted. Nothing is extracted from a cake: it is an accord, made of vanillin and ethylvanillin, caramelised sugar and buttery, baked notes, and it sits in the heart or the base of a gourmand perfume.",
  src=["sv_cake", "ca_cupcake", "sd_gourmand"]),
}
out("NEW6", S, N)

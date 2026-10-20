from acc import out, SAME
# THE NOTES OF APOTEKER TEPE (the thirteenth house), 2026-10-20, filed by
# the rulebook (tools/note-library/RULEBOOK.md) with the owner's word on
# each: Pine Smoke, Copal (Copal Incense its variation), Hiba (Hiba Cedar),
# Siam Wood and Kuromoji new; Green Oakmoss, Orris Butter, Madonna Lily,
# Jasmine Grandiflorum, Smoldering Paper, Sweet Birch, Wet Earth, Boletus
# Edulis and Wood Smoke variations of notes already here; Guaiacwood,
# Sandalwood Mysore and Water Lily only other spellings. Read through search
# summaries: the pages themselves would not open from here.
A = "20 Oct. 2026"
S = {
 # pine smoke
 "wp_lapsang": ("https://en.wikipedia.org/wiki/Lapsang_souchong", "Lapsang souchong - Wikipedia", None, None, A),
 "wp_syringol": ("https://en.wikipedia.org/wiki/Syringol", "Syringol - Wikipedia", None, None, A),
 "bn_smokenote": ("https://basenotes.com/threads/the-smoke-note.531285/", "The Smoke Note", "Basenotes", None, A),
 "at_holymountain": ("https://www.apotekertepe.net/product/the-holy-mountain", "The Holy Mountain", "Apoteker Tepe", None, A),
 # copal
 "pp_copal": ("https://premierepeau.com/pages/glossary-terms/copal", "Copal", "Premiere Peau", None, A),
 "pn_copal": ("https://uses.plantnet-project.org/en/Copal_(Stross)", "Copal (Stross)", "Pl@ntUse", None, A),
 "wp_copal": ("https://en.wikipedia.org/wiki/Copal", "Copal - Wikipedia", None, None, A),
 "at_brothernight": ("https://www.apotekertepe.net/product/brother-night", "Brother Night", "Apoteker Tepe", None, A),
 # hiba
 "eb_hiba": ("https://www.edenbotanicals.com/hiba-wood-oil.html", "Hiba Wood Oil", "Eden Botanicals", None, A),
 "pp_hiba": ("https://premierepeau.com/pages/glossary-terms/hiba", "Hiba", "Premiere Peau", None, A),
 "wp_thujopsis": ("https://en.wikipedia.org/wiki/Thujopsis", "Thujopsis - Wikipedia", None, None, A),
 # siam wood
 "eb_siam": ("https://www.edenbotanicals.com/siam-wood.html", "Siam Wood EO", "Eden Botanicals", None, A),
 "pp_siam": ("https://premierepeau.com/pages/glossary-terms/siam-wood", "Siam Wood", "Premiere Peau", None, A),
 "tg_siam": ("https://www.thegoodscentscompany.com/data/es1050351.html", "Siam Wood Oil", None, None, A),
 # kuromoji
 "tso_lindera": ("https://www.treesandshrubsonline.org/articles/lindera/lindera-umbellata/", "Lindera umbellata", "Trees and Shrubs Online", None, A),
 "sk_kuromoji": ("https://sikito.com/en/blogs/magazine/kuromoji", "Branch Encyclopedia, Winter: Kuromoji (Japanese Spicebush)", "Sikito", None, A),
 "tol_kuromoji": ("https://onlineshop.treeoflife.co.jp/en/products/084712540", "Kuromoji Essential Oil", "Tree of Life", None, A),
 # madonna lily
 "oz_candidum": ("https://www.osmoz.com/encyclopedia/raw-materials/floral/16/lily-lilium-candidum", "Lily (Lilium Candidum)", None, None, A),
 "rhs_candidum": ("https://www.rhs.org.uk/plants/10162/i-lilium-candidum-i/details", "Lilium candidum", "Royal Horticultural Society", None, A),
 # sweet birch
 "wp_betulalenta": ("https://en.wikipedia.org/wiki/Betula_lenta", "Betula lenta - Wikipedia", None, None, A),
 "wp_methylsal": ("https://en.wikipedia.org/wiki/Methyl_salicylate", "Methyl salicylate - Wikipedia", None, None, A),
 "pp_birch": ("https://premierepeau.com/pages/glossary-terms/birch", "Birch", "Premiere Peau", None, A),
 # boletus edulis
 "wp_boletus": ("https://en.wikipedia.org/wiki/Boletus_edulis", "Boletus edulis - Wikipedia", None, None, A),
 "pp_cepes": ("https://premierepeau.com/pages/glossary-terms/cepes", "Cepes", "Premiere Peau", None, A),
 # wood smoke, smoldering paper
 "pp_smoke": ("https://premierepeau.com/pages/glossary-terms/smoke", "Smoke", "Premiere Peau", None, A),
 # (already cited elsewhere in the library; the same entries)
 "fr_smoke": ("https://www.fragrantica.com/notes/Smoke-735.html", "Smoke perfume ingredient, Smoke fragrance and essential oils"),
 "ps_paper": ("https://perfumesociety.org/paper-trail/", "Paper Trail: why we love paper's smell (& perfumes evoking it) - The Perfume Society"),
 "fw_pallidabutter": ("https://fraterworks.com/products/orris-pallida-butter-aged", "Orris Pallida Butter – Fraterworks"),
 "wp_orris": ("https://en.wikipedia.org/wiki/Orris_root", "Orris root - Wikipedia"),
 "fw_irisprimer": ("https://fraterworks.com/blogs/information/iris-naturals-a-primer", "Iris Naturals, A Primer – Fraterworks"),
 "fr_lily": ("https://www.fragrantica.com/notes/Lily-157.html", "Lily perfume ingredient, Lily fragrance and essential oils Lilium (Liliaceae)"),
 "fr_jasgs": ("https://www.fragrantica.com/news/Jasmine-Grandiflorum-vs-Sambac-20384.html", "Jasmine: Grandiflorum vs Sambac ~ Raw Materials ~ Fragrantica"),
 "ps_jas": ("https://perfumesociety.org/ingredients-post/jasmine-2/", "Jasmine - The Perfume Society"),
 "fr_birch": ("https://www.fragrantica.com/notes/Birch-31.html", "Birch perfume ingredient, Birch fragrance and essential oils Betula, family Betulaceae"),
 "wp_petrichor": ("https://en.wikipedia.org/wiki/Petrichor", "Petrichor - Wikipedia"),
 "fw_geosmin": ("https://fraterworks.com/products/geosmin", "Geosmin – Fraterworks"),
 "ps_petrichor": ("https://perfumesociety.org/petrichor-perfumes-capturing-the-scent-of-rain/", "Petrichor Perfumes - Capturing the Scent of Rain - The Perfume Society"),
 "fr_mushroom": ("https://www.fragrantica.com/notes/Mushroom-839.html", "Mushroom perfume ingredient, Mushroom fragrance and essential oils Agaricus Bisporus"),
 "wp_santalum": ("https://en.wikipedia.org/wiki/Santalum_album", "Santalum album - Wikipedia"),
 "fr_sandal": ("https://www.fragrantica.com/notes/Sandalwood-33.html", "Sandalwood perfume ingredient, Sandalwood fragrance and essential oils Santalum Album"),
 "pf_indiansandal": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21856083/indian-sandalwood-returns-to-the-perfumers-palette", "Indian Sandalwood Returns to the Perfumer's Palette | Perfumer & Flavorist"),
}
N = {
 "note-pine-smoke": dict(
  say="The smoke of burning pine, rather than of smoke in general. Pine is a softwood, and the lignin of a softwood breaks down in the fire mostly into guaiacol, which smells sweet, warm and a little like cloves and vanilla, where the hardwoods give more of the drier, sharper syringol; the resin in the wood burns too. So pine smoke is resinous, sweet and phenolic, with the sap and the needles still in it: the smoke that dries Lapsang souchong over pinewood fires, which perfumers reach for when they want a smoke of the forest. Apoteker Tepe sets it at the head of The Holy Mountain, over incense and fir.",
  src=["wp_syringol", "wp_lapsang", "bn_smokenote", "at_holymountain"]),
 "note-copal": dict(
  say="The resin of tropical American trees, Protium copal and several Bursera, burned as incense in Mexico and Central America since the Maya, who called it pom; the word itself is the Nahuatl copalli, incense. The name also covers other young, unfossilised resins traded for varnish. As a perfume note it is bright and clean, piney and lemony from its terpenes, pinene and limonene, lighter and less sweet than frankincense and less bitter than myrrh, settling into a warm, slightly sweet resin, with a faint turpentine freshness at first.",
  src=["pp_copal", "pn_copal", "wp_copal"],
  vars={"Copal Incense": dict(say="Copal as it is burned, on charcoal, as it is still burned in ceremonies in Mexico and Central America: its smoke rather than the cold resin, darker, smokier and more balsamic, the lemon and pine of the resin turned to a sweet, white incense. Apoteker Tepe names it in Brother Night.", src=["pn_copal", "wp_copal", "at_brothernight"])}),
 "note-hiba": dict(
  say="The wood of Thujopsis dolabrata, a Japanese conifer of the cypress family, the hinoki's cousin, most of it from the forests of Aomori in the far north of Honshu. Its oil is distilled from the wood and sawdust: dry, woody and resinous, earthy and softly balsamic, with a smokiness perfumers prize, a faint fresh citrus at first and a camphorous, bitter bite from hinokitiol, a molecule it is rich in. It is darker and smokier than hinoki's clean, lemony wood.",
  src=["eb_hiba", "pp_hiba", "wp_thujopsis"],
  vars={"Hiba Cedar": dict(same="No change: hiba is often called hiba cedar, or Japanese cedar, though it is a cypress and not a true cedar.")}),
 "note-siam-wood": dict(
  say="The wood of Fokienia hodginsii, a cypress of the mountains of Vietnam, Laos and southern China. It is no sandalwood, though it plays a like part: warm, creamy and soft, sweet and balsamic, with something of cedar and opopanax and a little nutty, drying down sweet and woody, like rosewood. Perfumers use it in the base, to widen the woods, beside sandalwood, cedar and agarwood.",
  src=["eb_siam", "pp_siam", "tg_siam"]),
 "note-kuromoji": dict(
  say="Lindera umbellata, a deciduous shrub of the Japanese mountains of the laurel family, one of the spicebushes. Its dark-barked twigs are so fragrant that Japan makes toothpicks of them, for eating sweets, and the toothpicks themselves are called kuromoji; the oil is distilled from its leaves and branches. It is fresh and woody with a soft sweetness, mostly linalool, the molecule of lavender and bergamot, with cineole's coolness and a gentle, green-woody side. Apoteker Tepe gives it to Kogen.",
  src=["tso_lindera", "sk_kuromoji", "tol_kuromoji"],
  vars={"Kuromoji (Spicebush)": dict(same="No change: Apoteker Tepe's name for kuromoji, with the English name of its kind, the spicebushes, beside it.")}),
 "note-oakmoss": dict(vars={
  "Green Oakmoss": dict(same="No change: oakmoss, named by its colour; the house says nothing of a different material."),
 }),
 "note-orris": dict(vars={
  "Orris Butter": dict(say="Orris as its butter, which is Iris Butter by its other name: the dried, powdered root steam-distilled, the oil setting into a pale, waxy solid. It is the most natural and complete orris, creamy and powdery, violet and suede, and its worth is counted by how much irone, the violet-like molecule, it holds.", src=["fw_pallidabutter", "wp_orris", "fw_irisprimer"]),
 }),
 "note-lily": dict(vars={
  "Madonna Lily": dict(say="The white lily of the Mediterranean and the Levant, Lilium candidum, the oldest lily in gardens and the lily of paintings of the Virgin. It is softer and more serene than the big lilies of the florist, creamy and white with a green freshness and a faint clove-like warmth, and powerful at evening. Like every lily it yields no oil, so its scent is built, from white-floral molecules, a little spice and soft powder.", src=["oz_candidum", "rhs_candidum", "fr_lily"]),
 }),
 "note-jasmine": dict(vars={
  "Jasmine Grandiflorum": dict(say="The jasmine of perfumery at its most classic, Jasminum grandiflorum, the Spanish or royal jasmine grown for Grasse, in Egypt and in India, rather than the greener, sharper sambac of jasmine tea. It is the sweeter, fruitier and rounder of the two, rich and honeyed, with less indole's bite; when a perfume says only jasmine, it is most often this one.", src=["fr_jasgs", "ps_jas"]),
 }),
 "note-paper": dict(vars={
  "Smoldering Paper": dict(say="Paper burning slowly, without a flame, rather than the clean smell of the page: the lignin in it, the part of the wood that is close to vanillin, breaking down in the heat into the phenols of smoke, so it smells toasted and smoky with a faint vanilla sweetness, dry and papery, with ash at its edge. It is built by the perfumer, from smoky phenols and dry woods.", src=["ps_paper", "wp_syringol", "pp_smoke"]),
 }),
 "note-birch": dict(vars={
  "Sweet Birch": dict(say="Not the birch of tar and Russian leather but another tree, Betula lenta, the black or cherry birch of the eastern United States, whose bark, soaked and distilled, gives an oil that is almost wholly methyl salicylate, the molecule of wintergreen. So it smells sweet, minty and medicinal, like wintergreen and old-fashioned chewing gum, with a faint green bark under it, and nothing of the smoke of birch tar.", src=["wp_betulalenta", "wp_methylsal", "pp_birch", "fr_birch"]),
 }),
 "note-soil": dict(vars={
  "Wet Earth": dict(say="Earth with the rain on it, Wet Soil by another name: the geosmin, the petrichor side of the ground, the smell rain throws up from dry soil, cooler, fresher and more mineral than dry dirt.", src=["wp_petrichor", "fw_geosmin", "ps_petrichor"]),
 }),
 "note-mushroom": dict(vars={
  "Boletus Edulis": dict(say="The porcini, or cep, Boletus edulis, the great wild mushroom of the woods of Europe, which cannot be farmed and is gathered by hand. Its smell is richer than a button mushroom's: earthy, fungal and nutty, from 1-octen-3-ol, the mushroom alcohol, and dried it turns rounder, brothier and roasted, almost like cocoa, from the pyrazines the drying makes. In perfume it is built, as every mushroom is.", src=["wp_boletus", "pp_cepes", "fr_mushroom"]),
 }),
 "note-smoke": dict(vars={
  "Wood Smoke": dict(say="Smoke from a wood fire in particular, rather than incense or tobacco: the lignin of the wood broken down by the heat into phenols, guaiacol, sweet and clove-like, and syringol, sharper and drier, the hardwoods giving more of the second. It is dry, charred and warm, the smell of a campfire or a smokehouse, built in perfume from tars, guaiac and smoky molecules.", src=["wp_syringol", "pp_smoke", "fr_smoke"]),
 }),
 "note-guaiac-wood": dict(vars={
  "Guaiacwood": dict(same=SAME),
 }),
 "note-sandalwood": dict(vars={
  "Sandalwood Mysore": dict(say="Mysore Sandalwood, written the other way round: Indian sandalwood from Mysore, Santalum album, the legendary one, the creamiest, milkiest and richest, now almost gone from perfumery because the trees ran out.", src=["wp_santalum", "fr_sandal", "pf_indiansandal"]),
 }),
 "note-waterlily": dict(vars={
  "Water Lily": dict(same=SAME),
 }),
}
out("NEW5", S, N)

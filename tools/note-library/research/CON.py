from acc import out, SAME
S = {
 "pp_hemlock": ("https://premierepeau.com/pages/glossary-terms/black-hemlock-or-tsuga", "Black Hemlock or Tsuga", "Premiere Peau"),
 "bn_hemlock": ("https://basenotes.com/threads/hemlock-tsuga-oil.313524/", "Hemlock (Tsuga) Oil", "Basenotes"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "st_cedarleaf": ("https://www.scentree.co/en/Cedar_leaf_oil.html", "ScenTree - Cedar leaf oil (CAS N° 8007-20-3)"),
 "fr_thuja": ("https://www.fragrantica.com/notes/Thuja-394.html", "Thuja perfume ingredient, Thuja fragrance and essential oils"),
 "tg_thuja": ("https://www.thegoodscentscompany.com/data/es1002892.html", "thuja occidentalis leaf oil, 8007-20-3", "The Good Scents Company"),
 "fr_cypress": ("https://www.fragrantica.com/notes/Cypress-186.html", "Cypress perfume ingredient, Cypress fragrance and essential oils Cupressus (Cupressaceae)"),
 "sc_cypress": ("https://www.scentspiracy.com/fragrance-ingredients/p/cypress-oil", "Cypress Wood Oil (86696-07-1) – Natural Woody Natural Ingredient for Perfumery — Scentspiracy"),
 "fw_cypress": ("https://fraterworks.com/products/cypress-oil", "Cypress Oil – Fraterworks"),
 "fr_fir": ("https://www.fragrantica.com/notes/Fir-205.html", "Fir perfume ingredient, Fir fragrance and essential oils Genus Abies, family Pinaceae"),
 "fw_firbalsam": ("https://fraterworks.com/products/fir-balsam-absolute", "Fir Balsam Absolute 50% TEC – Fraterworks"),
 "tg_firbalsamabs": ("https://www.thegoodscentscompany.com/data/ab1029171.html", "fir balsam absolute, 8007-47-4", "The Good Scents Company"),
 "pf_silverfir": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21856240/progress-in-essential-oils-silver-fir-or-abies-alba-oil", "Progress in Essential Oils: Silver Fir or Abies alba oil | Perfumer & Flavorist"),
 "tg_silverfir": ("https://www.thegoodscentscompany.com/data/es1026931.html", "abies alba needle oil, 8021-27-0", "The Good Scents Company"),
 "tg_balsamfir": ("https://www.thegoodscentscompany.com/data/es1006561.html", "balsam fir needle oil america, 8024-15-5", "The Good Scents Company"),
 "wp_noblefir": ("https://en.wikipedia.org/wiki/Abies_procera", "Abies procera - Wikipedia"),
 "sd_subalpine": ("https://www.sunday.de/en/fir-oil-subalpine-fir-abies-lasiocarpa-wild-iceland.html", "Fir Oil Subalpine Fir Abies Lasiocarpa Wild Iceland", "Sunday Natural"),
 "co_subalpine": ("https://conifers.org/pi/Abies_lasiocarpa.php", "Abies lasiocarpa", "The Gymnosperm Database"),
 "rhs_momi": ("https://www.rhs.org.uk/plants/34/abies-firma/details", "Abies firma", "Royal Horticultural Society"),
 "tol_momi": ("https://onlineshop.treeoflife.co.jp/en/products/084732440", "Fir Essential Oil / Momi", "Tree of Life"),
 "fr_juniper": ("https://www.fragrantica.com/notes/Juniper-142.html", "Juniper perfume ingredient, Juniper fragrance and essential oils Juniperus Virginiana"),
 "ps_juniper": ("https://perfumesociety.org/ingredients-post/juniper/", "Juniper - The Perfume Society"),
 "tg_junipneedle": ("https://www.thegoodscentscompany.com/data/es1096791.html", "juniper needle oil, 84603-69-0", "The Good Scents Company"),
 "fl_larch": ("https://floem.ca/en/blogs/blogue/meleze-tamarack", "Larch (Larix laricina): Its Benefits, Uses and Natural Habitat", "Floem"),
 "ns_tamarack": ("https://novascotia.ca/natr/Education/woodlot/modules/module1/2tamarack.asp", "Silvics of Tamarack", "Nova Scotia Department of Natural Resources"),
 "ak_tamarack": ("https://aliksir.com/en/plant-extracts/du-quebec-aliksir/larch-tamarack-larix-laricina-essential-oil.html", "Tamarack (Larix laricina) Essential Oil", "Aliksir"),
 "pp_nootka": ("https://premierepeau.com/pages/glossary-terms/nootka", "Nootka", "Premiere Peau"),
 "wpl_nootka": ("https://www.worldplants.ca/display.php?id=1839", "Callitropsis nootkatensis (Yellow Cedar, Alaska Cypress, Nootka Cypress)", "World Plants"),
 "fr_icefall": ("https://www.fragrantica.com/perfume/Pineward-Perfumes/Icefall-83388.html", "Icefall Pineward Perfumes perfume - a fragrance for women and men"),
 "fr_pinetree": ("https://www.fragrantica.com/notes/Pine-Tree-204.html", "Pine Tree perfume ingredient, Pine Tree fragrance and essential oils Genus Pinus, family Pinaceae"),
 "ps_pine": ("https://perfumesociety.org/ingredients-post/pine/", "Pine - The Perfume Society"),
 "tg_scotchpine": ("https://www.thegoodscentscompany.com/data/es1019031.html", "scotch pine needle oil, 8023-99-2", "The Good Scents Company"),
 "st_scotchpine": ("https://www.scentree.co/en/Scotch_pine_oil.html", "ScenTree - Scotch pine oil (CAS N° 8023-99-2)"),
 "sd_mugo": ("https://www.sunday.de/en/mountain-pine-oil-pinus-mugo-organic-wild-south-tyrol.html", "Mountain Pine Oil Pinus Mugo Organic Wild South Tyrol", "Sunday Natural"),
 "alt_mugo": ("https://www.altmeyers.org/en/cosmetology/pinus-pumilio-oil-inci-148897", "Pinus Pumilio Oil (INCI)", "Altmeyers Encyclopedia"),
 "fr_pineneedles": ("https://www.fragrantica.com/board/viewtopic.php?id=29438", "The smell of pine needles (Page 1) — Perfume Selection Tips for Women — Fragrantica Club", "Fragrantica Club"),
 "tg_pineneedleabs": ("https://www.thegoodscentscompany.com/data/ab1049381.html", "pine needle absolute, 8000-26-8", "The Good Scents Company"),
 "fr_drypine": ("https://www.fragrantica.com/board/viewtopic.php?id=297436", "Dry summer pine needle scent? (Page 1) — Perfume Selection Tips for Women — Fragrantica Club", "Fragrantica Club"),
 "adar_root": ("https://adarperfumes.com/products/root-code", "Root Code", "ADAR Perfumes"),
 "nps_ponderosa": ("https://www.nps.gov/brca/learn/nature/ponderosapine.htm", "Ponderosa Pine", "National Park Service"),
 "mn_ponderosa": ("https://www.montananaturalist.org/blog-post/ponderosa-pine-bark-rocky-mountain-aromatherapy/", "Ponderosa Pine Bark: Rocky Mountain Aromatherapy", "Montana Natural History Center"),
 "nps_conifers": ("https://www.nps.gov/mora/learn/nature/conifer-trees.htm", "Conifer Trees", "National Park Service"),
 "fr_spruce": ("https://www.fragrantica.com/notes/Spruce-481.html", "Spruce perfume ingredient, Spruce fragrance and essential oils Picea abies"),
 "fr_blackspruce": ("https://www.fragrantica.com/notes/Black-Spruce-478.html", "Black Spruce perfume ingredient, Black Spruce fragrance and essential oils Picea Mariana"),
 "fr_sprucenews": ("https://www.fragrantica.com/news/Christmas-Scents-Part-I-Spruce-7281.html", "Christmas Scents: Part I, Spruce ~ Raw Materials ~ Fragrantica"),
}
N = {
 "note-black-hemlock": dict(
  say="Not the poisonous herb but the hemlock tree, a tall conifer of old, damp forests. Its needles smell green and resinous, like pine, fir and spruce at once but gentler: cooler and darker than spruce, less sweet than fir, a little fruity like apple, with a mossy, damp undertone, the understory of an old forest in the early morning.",
  src=["pp_hemlock", "bn_hemlock", "pw_list"],
  vars={"Black Hemlock Needles": dict(same="No change: the hemlock's smell is its needles.")}),
 "note-cedar-leaf": dict(
  say="Not true cedar but the leaves of thuja, the white cedar of North America. Its oil is sharp, fresh and green, camphorous and herbal, with a woody, slightly medicinal edge from thujone; it is strong and used in small amounts to freshen woody notes.",
  src=["st_cedarleaf", "fr_thuja", "tg_thuja"],
  vars={
   "Cedar Leaf (Thuja)": dict(say="Naming the tree it really comes from: cedar leaf oil is distilled from thuja, a cypress-family tree, not from a true cedar, so it is green and camphorous rather than dry and pencil-like.", src=["st_cedarleaf", "fr_thuja"]),
  }),
 "note-cypress": dict(
  say="The tall, dark, candle-shaped tree of Mediterranean hills and cemeteries. Its oil is fresh and resinous, dry and green, a little camphorous and piney, turning clean and woody, like clear forest air. It adds lift and structure to colognes, fougères and chypres.",
  src=["fr_cypress", "sc_cypress", "fw_cypress"],
  vars={
   "Coastal Cypress": dict(say="Pineward's picture of cypress growing by the sea: the same fresh, resinous tree with salty coastal air around it.", src=["pw_list", "fr_cypress"]),
   "Emerald Cypress": dict(say="Pineward's name for a greener, brighter cypress: its fresh, leafy side put forward over the dry wood.", src=["pw_list", "fr_cypress"]),
  }),
 "note-fir": dict(
  say="The Christmas tree of Europe and North America: soft needles and sticky resin. Fir smells sweet and balsamic, green and resinous, a little spicy, softer and sweeter than pine, and its balsam absolute is one of the warmest, deepest forest materials a perfumer has.",
  src=["fr_fir", "fw_firbalsam", "pf_silverfir"],
  vars={
   "Noble Fir": dict(say="Abies procera, a large fir of the Pacific Northwest, a favourite Christmas tree: fresh, clean and resinous-green.", src=["wp_noblefir", "pw_list"]),
   "Silver Fir": dict(say="Abies alba, the fir of the European mountains: its needle oil is balsamic and resinous, a clean, classic forest smell.", src=["pf_silverfir", "tg_silverfir"]),
   "Subalpine Fir": dict(say="Abies lasiocarpa, which grows high in the Rocky Mountains: fresh, sweet and balsamic, a little spicy and citrusy, with a camphorous edge in its crushed needles.", src=["sd_subalpine", "co_subalpine"]),
   "Balsam Fir": dict(say="Abies balsamea, the North American fir named for its sweet balsam: softer and sweeter than other firs, balsamic and resinous.", src=["tg_balsamfir", "fr_fir"]),
   "Fir Balsam": dict(say="Not the needles but the resin of the balsam fir, taken as an absolute: rich, sweet and balsamic, deep and forest-like, warmer and heavier than needle oil.", src=["fw_firbalsam", "tg_firbalsamabs"]),
   "Momi": dict(say="Abies firma, the momi fir of Japan: a gentle forest smell with a citrusy green freshness and a soft resin.", src=["rhs_momi", "tol_momi"]),
  }),
 "note-juniper": dict(
  say="The shrubby conifer, its wood and needles as well as its berries: fresh, balsamic and piney, sappy and a little bitter, with a gin-like brightness and a dry woody side. Some junipers, like the red cedar of Virginia, give a dry, pencil-like wood.",
  src=["fr_juniper", "ps_juniper", "tg_junipneedle"],
  vars={
   "Juniper Needles": dict(say="Juniper's needles and twigs rather than its berries: greener, drier and more piney, with less of the berries' gin-like sweetness.", src=["tg_junipneedle", "fr_juniper"]),
   "Juniper Scales": dict(say="The flat, scale-like leaves some junipers have instead of needles, like cypress foliage: drier and more cedar-like, less sharp and green than juniper needles.", src=["pw_list", "fr_juniper"]),
  }),
 "note-larch-cones": dict(
  say="The small, egg-shaped cones of the larch, a conifer that turns gold and drops its needles in autumn. The tree smells fresh and fruity-resinous, and its cones add a dry, woody, slightly sweet resin to Pineward's picture of the forest.",
  src=["fl_larch", "ns_tamarack", "pw_list"]),
 "note-nootka": dict(
  say="The Nootka cypress, or yellow cedar, of the Pacific Northwest. Its wood smells powerfully of cedar and cypress, warm and spicy, with a surprising grapefruit brightness: nootkatone, the molecule behind grapefruit's bitterness, was named after this tree.",
  src=["pp_nootka", "wpl_nootka", "fr_icefall"]),
 "note-pine": dict(
  say="The classic evergreen: pine needles smell fresh and icy, a little like menthol, herbal and balmy, bright and green, the smell of Christmas and of cleaning products. It gives woody and masculine perfumes a fresh, outdoors lift.",
  src=["fr_pinetree", "ps_pine", "tg_scotchpine"],
  vars={
   "Pine Tree": dict(same="No change: pine, named as the tree."),
   "Scotch Pine": dict(say="Pinus sylvestris, the Scots pine of northern Europe: its needle oil is zesty, fresh and almost lime-like, with an earthy side.", src=["tg_scotchpine", "st_scotchpine"]),
   "Mugo Pine": dict(say="The dwarf mountain pine of the Alps: its oil, from wild needles picked high up, is fresh, clear, herbal and woody.", src=["sd_mugo", "alt_mugo"]),
  }),
 "note-pine-needles": dict(
  say="The needles rather than the wood: green, sharp and fresh, resinous and a little citrusy, like needles crushed on a forest path. It is the brightest, most outdoor side of the pine.",
  src=["fr_pineneedles", "tg_pineneedleabs", "ps_pine"],
  vars={
   "Pine Needle": dict(same="No change: pine needle in the singular."),
   "Dried Needles": dict(say="Pine needles dried on the forest floor in the sun: warmer, sweeter and dustier, a little like hay, less sharp and green than fresh ones.", src=["fr_drypine", "pw_list"]),
   "Frozen Pine Needles": dict(say="ADAR's picture of pine needles in the frost: the cold, sharp, menthol-like side of pine made icy.", src=["adar_root", "fr_pinetree"]),
   "Ponderosa Needles": dict(say="Needles of the ponderosa pine of the American West, a tree whose sun-warmed bark famously smells of vanilla and butterscotch: pine with a warm, sweet side.", src=["nps_ponderosa", "mn_ponderosa", "pw_list"]),
   "Ponderosa Pine Needles": dict(say="Needles of the ponderosa pine, the western pine whose bark smells of vanilla and butterscotch in the sun: resinous pine with a sweet warmth.", src=["nps_ponderosa", "mn_ponderosa", "pw_list"]),
  }),
 "note-snoqualmie-forest-evergreens": dict(
  say="Pineward's picture of the evergreen forests around Snoqualmie, in the Cascade mountains of Washington, where Douglas fir, western hemlock and western red cedar grow thick and wet. It smells of all of them together: resinous fir, damp hemlock and cedar in the rain.",
  src=["pw_list", "nps_conifers"]),
 "note-spruce": dict(
  say="The tall, sharp-needled Christmas tree of the north. Spruce smells green, woody and balsamic, with a sweetish undertone; black spruce is darker, fir-like and coniferous. It is used less often than pine or fir, which makes it quietly distinctive.",
  src=["fr_spruce", "fr_blackspruce", "fr_sprucenews"]),
 "note-tamarack": dict(
  say="The American larch, a conifer of northern bogs that turns gold and loses its needles each autumn. Its needle oil smells fresh and fruity, green and resinous.",
  src=["ak_tamarack", "ns_tamarack", "pw_list"]),
}
out("CON", S, N)

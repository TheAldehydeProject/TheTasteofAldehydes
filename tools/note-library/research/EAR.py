from acc import out, SAME
S = {
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "la_walk": ("https://lesabstraits.com/products/philosophers-walk", "Philosopher's Walk", "Les Abstraits"),
 "adar_lignum": ("https://adarperfumes.com/products/lignum-dei-the-wood-of-god-essence-of-hope-micro-batch-77-pieces", "Lignum Dei: The Wood of God", "ADAR Perfumes"),
 "adar_root": ("https://adarperfumes.com/products/root-code", "Root Code", "ADAR Perfumes"),
 "adar_amber": ("https://adarperfumes.com/products/amber-zero-essence-of-dephts", "Amber Zero: Essence of Depths", "ADAR Perfumes"),
 "hm_cedarmoss": ("https://hermitageoils.com/?p=24938", "Cedarmoss Absolute 20%", "Hermitage Oils"),
 "tg_treemoss": ("https://www.thegoodscentscompany.com/data/ab1051131.html", "treemoss absolute, 68648-41-9", "The Good Scents Company"),
 "wp_treemoss": ("https://en.wikipedia.org/wiki/Pseudevernia_furfuracea", "Pseudevernia furfuracea - Wikipedia"),
 "sc_mousse": ("https://www.scentspiracy.com/fragrance-ingredients/p/mousse-arbre-abs", "Mousse Arbre Absolute (CAS 90028-67-4) – Premium Natural Moss Extract for Perfumery — Scentspiracy"),
 "fr_oaktree": ("https://www.fragrantica.com/news/Oakmoss-and-Tree-Moss-in-Fragrance-11516.html", "Oakmoss and Tree Moss in Fragrance ~ Raw Materials ~ Fragrantica"),
 "fr_concrete": ("https://www.fragrantica.com/notes/Concrete-936.html", "Concrete perfume ingredient, Concrete fragrance and essential oils"),
 "fr_cdgconcrete": ("https://www.fragrantica.com/news/Fluorescent-Grey-Concrete-by-Comme-des-Garcons-20577.html", "Fluorescent Grey: Concrete by Comme des Garçons ~ Fragrance Reviews ~ Fragrantica"),
 "fr_mineral": ("https://www.fragrantica.com/notes/Mineral-Notes-820.html", "Mineral Notes perfume ingredient, Mineral Notes fragrance and essential oils"),
 "fr_swamp": ("https://www.fragrantica.com/news/Scary-Tales-Swamp-Scents-and-Spirits-18309.html", "Scary Tales: Swamp Scents and Spirits ~ Columns ~ Fragrantica"),
 "fr_moors": ("https://www.fragrantica.com/news/Scary-Tales-and-Wonderful-Fragrances-Moors-and-Mires-12912.html", "Scary Tales and Wonderful Fragrances: Moors and Mires ~ Columns ~ Fragrantica"),
 "fr_dust": ("https://www.fragrantica.com/notes/Dust-1519.html", "Dust perfume ingredient, Dust fragrance and essential oils"),
 "fr_powder": ("https://www.fragrantica.com/news/How-to-Choose-the-Right-Powder-Powdery-Notes-in-Perfumery-17630.html", "How to Choose the Right Powder: Powdery Notes in Perfumery ~ Raw Materials ~ Fragrantica"),
 "fr_lichen": ("https://www.fragrantica.com/notes/Lichen-667.html", "Lichen perfume ingredient, Lichen fragrance and essential oils"),
 "wp_oakmoss": ("https://en.wikipedia.org/wiki/Evernia_prunastri", "Oakmoss - Wikipedia"),
 "ps_oakmoss": ("https://perfumesociety.org/ingredients-post/oakmoss/", "Oakmoss - The Perfume Society"),
 "ps_oakgift": ("https://perfumesociety.org/oakmoss-the-perfumers-gift/", "Oakmoss: The Perfumer’s Gift - The Perfume Society"),
 "fr_oakmoss": ("https://www.fragrantica.com/notes/Oakmoss-39.html", "Oakmoss perfume ingredient, Oakmoss fragrance and essential oils"),
 "fr_oaknews": ("https://www.fragrantica.com/news/Oakmoss-in-Fragrances-2981.html", "Oakmoss in Fragrances ~ Raw Materials ~ Fragrantica"),
 "fw_oak43": ("https://fraterworks.com/products/oakmoss-ifra-43-abs", "Oakmoss “IFRA 43” Absolute – Fraterworks"),
 "oz_oakmoss": ("https://www.osmoz.com/encyclopedia/raw-materials/moss/177/oakmoss-evernia-prunastri", "Oakmoss (Evernia Prunastri) Perfumes raw material - Oakmoss (Evernia Prunastri) Scent", "Osmoz"),
 "sc_veramoss": ("https://www.scentspiracy.com/fragrance-ingredients/p/veramoss-iff", "Veramoss (4707-47-5): Dry Oakmoss Synthetic Fragrance Ingredient — Scentspiracy"),
 "fr_mushroom": ("https://www.fragrantica.com/notes/Mushroom-839.html", "Mushroom perfume ingredient, Mushroom fragrance and essential oils Agaricus Bisporus"),
 "fr_mushnews": ("https://www.fragrantica.com/news/Mushrooms-Ordinary-and-Magical-23124.html", "Mushrooms, Ordinary and Magical ~ Columns ~ Fragrantica"),
 "fr_morelmap": ("https://www.fragrantica.com/perfume/Clue-Perfumery/Morel-Map-88205.html", "Morel Map Clue Perfumery perfume - a fragrance for women and men 2023"),
 "fr_matsu": ("https://www.fragrantica.com/perfume/Agar-Olfactory/Matsu-Musk-100680.html", "Matsu Musk Agar Olfactory perfume - a fragrance for women and men 2023"),
 "prin_haxan": ("https://prinlomros.com/product/haxan/", "Haxan", "Prin Lomros"),
 "fr_peat": ("https://www.fragrantica.com/notes/Peat-479.html", "Peat perfume ingredient, Peat fragrance and essential oils"),
 "wp_islay": ("https://en.wikipedia.org/wiki/Islay_single_malts", "Islay single malts - Wikipedia"),
 "wp_petrichor": ("https://en.wikipedia.org/wiki/Petrichor", "Petrichor - Wikipedia"),
 "wp_geosmin": ("https://en.wikipedia.org/wiki/Geosmin", "Geosmin - Wikipedia"),
 "ps_petrichor": ("https://perfumesociety.org/petrichor-perfumes-capturing-the-scent-of-rain/", "Petrichor Perfumes - Capturing the Scent of Rain - The Perfume Society"),
 "fr_rainscent": ("https://www.fragrantica.com/news/Scent-of-Rain-10211.html", "Scent of Rain ~ Columns ~ Fragrantica"),
 "fr_sand": ("https://www.fragrantica.com/notes/Sand-325.html", "Sand perfume ingredient, Sand fragrance and essential oils"),
 "oz_beach": ("https://www.osmoz.com/inspiration/osmoz-magazine/362/beach-smelling-perfume", "Are you looking for a beach smelling perfume ? Our best picks", "Osmoz"),
 "fw_geosmin": ("https://fraterworks.com/products/geosmin", "Geosmin – Fraterworks"),
 "fr_earthtinc": ("https://www.fragrantica.com/notes/Earth-Tincture-415.html", "Earth Tincture perfume ingredient, Earth Tincture fragrance and essential oils"),
 "fr_m2": ("https://www.fragrantica.com/perfume/CB-I-Hate-Perfume/M2-Black-March-8642.html", "M2 Black March CB I Hate Perfume perfume - a fragrance for women and men 2006"),
 "fr_spikenard": ("https://www.fragrantica.com/notes/Jatamansi-or-Spikenard-108.html", "Jatamansi or Spikenard perfume ingredient, Jatamansi or Spikenard fragrance and essential oils"),
 "wp_spikenard": ("https://en.wikipedia.org/wiki/Spikenard", "Spikenard - Wikipedia"),
 "ps_jatamansi": ("https://perfumesociety.org/ingredients-post/jatamansi/", "Jatamansi - The Perfume Society"),
 "fw_spikenard": ("https://fraterworks.com/products/spikenard-oil", "Spikenard Oil – Fraterworks"),
 "fr_wetstone": ("https://www.fragrantica.com/notes/Wet-Stone-1390.html", "Wet Stone perfume ingredient, Wet Stone fragrance and essential oils"),
 "fr_amouroud": ("https://www.fragrantica.com/perfume/Amouroud/Wet-Stone-54986.html", "Wet Stone Amouroud perfume - a fragrance for women and men 2019"),
}
N = {
 "note-cedarmoss": dict(
  say="Lichen gathered from cedar trees, mostly tree moss with some beard lichen, and sold as an absolute from Morocco. It is oakmoss's wilder cousin: earthy and damp, with a seaweed-like, vegetable wetness, and underneath it charred wood, ash, leather, hay and tobacco, like a park on a cold October afternoon. It anchors a perfume and makes it last.",
  src=["hm_cedarmoss", "tg_treemoss", "pw_list"],
  vars={
   "Cedar Moss Absolute (Morocco)": dict(say="The same lichen taken as an absolute, with solvents, which gives the fullest and most concentrated form of it; Morocco is where cedarmoss absolute comes from. Les Abstraits names both to say which material it used.", src=["la_walk", "hm_cedarmoss", "tg_treemoss"]),
  }),
 "note-concrete": dict(
  say="The smell of the city's ground: grey, cool and chalky, and at its best like pavement just after the rain has hit it, moist, a little oily and oddly sweet. Nothing is taken from real concrete; it is built from mineral notes, and cashmeran at the right dose can smell of wet concrete on its own.",
  src=["fr_concrete", "fr_cdgconcrete", "fr_mineral"]),
 "note-damp-vegetation": dict(
  say="Pineward's picture of leaves, stems and moss lying wet on a forest or bog floor, going soft: green, earthy, heavy with water and just starting to rot. Perfumers build it from soil notes, dark vetiver, oakmoss and galbanum, the materials that make a perfume smell of wetland.",
  src=["pw_list", "fr_swamp", "fr_moors"]),
 "note-dust": dict(
  say="The dry smell of dust in a closed room or an old house, built rather than taken: mostly powdery materials, iris, musk and benzoin, kept dry so that they read as dust and paper rather than face powder. It is soft, a little stale and quietly nostalgic.",
  src=["fr_dust", "fr_powder"]),
 "note-lichen": dict(
  say="The crusty, leafy growths on bark and stone, half fungus and half alga. In perfume lichen smells the same as oakmoss, which is itself a lichen: earthy, woody, sharp and a little sweet, like damp bark in shade. Like oakmoss it is heavily restricted, so many perfumes use substitutes.",
  src=["fr_lichen", "wp_oakmoss", "ps_oakmoss", "pw_list"]),
 "note-mineral-accord": dict(
  say="The smell of stone, an impression built from several materials rather than from rock: flint struck against steel, wet slate, sea salt, hot rocks, chalk. It feels cool, clean and a little metallic, and makes a perfume seem clear. Mineral notes only became a tool of their own recently; Terre d'Hermès' flint made them famous.",
  src=["fr_mineral", "adar_amber", "adar_root"],
  vars={
   "Mineral Accords": dict(same="No change: mineral accord in the plural."),
  }),
 "note-moss": dict(
  say="Moss as the forest floor smells of it: damp, green, earthy and inky-bitter, cool under old trees after rain. In perfume the moss is almost always a lichen, oakmoss or tree moss, or a synthetic mossy note, which also gives a perfume its depth and holds it on the skin.",
  src=["pw_list", "fr_oakmoss", "ps_oakmoss", "ps_oakgift"],
  vars={
   "Dry Moss": dict(say="Moss without the wet: the dusty, phenolic dryness of oakmoss rather than its green dampness, the way the synthetic oakmosses smell. ADAR names it to keep its moss dry.", src=["adar_lignum", "sc_veramoss", "fr_oakmoss"]),
  }),
 "note-mushroom": dict(
  say="The smell of mushrooms: earthy and musty, fresh and a little sharp, sometimes like mushrooms with the dirt still on them. There is no mushroom oil to use, so perfumers build it, with earthy, damp and green materials and molecules like the one that gives mushrooms their smell. It brings the forest floor into a perfume.",
  src=["fr_mushroom", "fr_mushnews", "prin_haxan"],
  vars={
   "Morel Mushroom": dict(say="The honeycombed, veined morel, the prize of the spring mushroom hunt: moist, earthen and a little nutty rather than the button mushroom's plain mustiness.", src=["pw_list", "fr_morelmap"]),
   "Oyster Mushroom": dict(say="The pale, fan-shaped oyster mushroom that grows on dead wood: softer and sweeter than a common mushroom, with a faint musky freshness.", src=["pw_list", "fr_matsu"]),
  }),
 "note-oakmoss": dict(
  say="Not a moss but a lichen, Evernia prunastri, that grows on oaks in the mountain forests of Europe and North Africa. It smells earthy, woody and sharp, damp and inky, like a walk through a forest after rain, with a leathery, sweet depth underneath. It is the foundation of chypre and fougère perfumes and holds everything to the skin. Because it can irritate skin, IFRA now limits it to a trace, and most perfumes use a version with the irritants taken out, or a synthetic.",
  src=["fr_oakmoss", "wp_oakmoss", "ps_oakmoss", "fr_oaknews", "oz_oakmoss"],
  vars={
   "Oakmoss Absolute": dict(say="Oakmoss taken as an absolute, with solvents: the most concentrated form, green, earthy and sweet, now usually treated to take out the irritant atranol so that it can be used at all.", src=["fw_oak43", "oz_oakmoss", "adar_root"]),
  }),
 "note-peat": dict(
  say="The dark, half-rotted plant matter of bogs, cut and burned for fuel, most famously to dry the barley of Islay whiskies. As a note it is dry, bitter and malty with a hint of smoke, and it brings with it the iodine, seaweed and salt of those whiskies and the moors they come from.",
  src=["fr_peat", "wp_islay", "fr_moors"]),
 "note-petrichor": dict(
  say="The smell of rain on dry ground, named in 1964 from the Greek for stone and the blood of the gods. Much of it is geosmin, made by soil microbes, which the nose can find at under a part per billion; raindrops throw it into the air. Perfumers build it from vetiver, patchouli, mosses, mineral accords and damp woods, and the result is earthy, cool and oddly comforting.",
  src=["wp_petrichor", "wp_geosmin", "ps_petrichor", "fr_rainscent", "adar_root"],
  vars={
   "Petrichor Accord": dict(same="No change: petrichor, with the word accord saying it is built."),
  }),
 "note-sand": dict(
  say="The smell of warm, dry sand, built as an impression: a soft mineral note, often with a woody, sandalwood-like warmth and a little salt. It feels granular, dry and sunny, the beach or the desert rather than the sea.",
  src=["fr_sand", "oz_beach"]),
 "note-soil": dict(
  say="Earth as it smells when turned over or rained on: damp, dark, a little like beetroot. That smell is mostly geosmin, one of the most powerful smells in nature, and perfumers use it, and earth tinctures, in tiny amounts. It grounds a perfume and makes it smell of outdoors.",
  src=["fw_geosmin", "wp_geosmin", "fr_earthtinc", "pw_list"],
  vars={
   "Wet Soil": dict(say="Soil with the rain on it: the geosmin, the petrichor side of earth, cooler and fresher than dry dirt.", src=["pw_list", "fw_geosmin", "wp_petrichor"]),
   "Earthy Notes": dict(same="No change: earth, named as a kind of note."),
   "Soil Tincture": dict(say="Earth made into a tincture, steeped in alcohol for perfume, rather than an accord built from molecules; Fragrantica files a synthetic earth tincture beside it, inspired by the smell of earth. It is soil at its most literal.", src=["fr_earthtinc", "fr_m2"]),
  }),
 "note-spikenard": dict(
  say="The root of Nardostachys jatamansi, a small plant of the high Himalayas, and the nard of the ancient world. Its oil smells of deep, sweet earth: damp forest floor, rooty and warm, woody and herbal, with a musky, almost animal depth. It fixes a perfume and suits chypres and ambers. It is endangered from overharvesting.",
  src=["fr_spikenard", "wp_spikenard", "ps_jatamansi", "fw_spikenard"],
  vars={
   "Himalayan Nard (Jatamansi)": dict(same="No change: jatamansi is spikenard's Indian name, and it grows in the Himalayas."),
  }),
 "note-swamp-water": dict(
  say="Pineward's picture of still, dark water in a bog: green and dusty, fruity and stuffy all at once, with sedge and pond-lilies, decaying wood and wet moss. Perfumers build it from soil notes, dark vetiver, oakmoss and galbanum.",
  src=["pw_list", "fr_swamp", "fr_moors"]),
 "note-treemoss": dict(
  say="Pseudevernia furfuracea, a lichen that grows on the bark of firs and pines and is gathered in quantity for French perfumery. It is darker, rougher and more powerful than oakmoss: woody, earthy and leathery, the forest floor with the pine bark still on it. It fixes a perfume, and like oakmoss it is now restricted.",
  src=["wp_treemoss", "sc_mousse", "fr_oaktree", "pw_list"]),
 "note-wet-stone": dict(
  say="Stone after rain: cool, clean and mineral, a little metallic, watery and earthy at once. It is built from mineral notes, often with a touch of vetiver for a smoky, flinty edge.",
  src=["fr_wetstone", "fr_amouroud", "fr_mineral"]),
}
out("EAR", S, N)

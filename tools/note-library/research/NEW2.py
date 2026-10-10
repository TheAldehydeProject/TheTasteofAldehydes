from acc import out, SAME
A = "10 Oct. 2026"
S = {
 # coconut milk
 "wp_coconutmilk": ("https://en.wikipedia.org/wiki/Coconut_milk", "Coconut milk", None, None, A),
 "fr_coconut": ("https://www.fragrantica.com/notes/Coconut-138.html", "Coconut perfume ingredient, Coconut fragrance and essential oils Cocos nucifera (Arecaceae)", None, None, A),
 "fr_lactmilk": ("https://www.fragrantica.com/news/Theme-of-the-Month-Lactones-vs-Milk-23305.html", "Theme of the Month: Lactones vs. Milk ~ Raw Materials ~ Fragrantica", None, None, A),
 "ps_milky": ("https://perfumesociety.org/the-milky-way/", "The Milky Way - The Perfume Society", None, None, A),
 "ph_coconutmilk": ("https://phlur.com/blogs/perfumery-dictionary/coconut-milk-scent-in-perfume", "coconut milk in perfume", "Phlur", None, A),
 # lilac
 "fr_lilac": ("https://www.fragrantica.com/notes/Lilac-152.html", "Lilac perfume ingredient, Lilac fragrance and essential oils Syringa vulgaris (Oleaceae)", None, None, A),
 "ps_lilac": ("https://perfumesociety.org/ingredients-post/lilac/", "Lilac - The Perfume Society", None, None, A),
 "oz_lilac": ("https://www.osmoz.com/encyclopedia/raw-materials/floral/15/lilac-syringa-vulgaris", "Lilac (Syringa Vulgaris) perfumes", None, None, A),
 "pp_lilac": ("https://premierepeau.com/pages/glossary-terms/lilac", "lilac", "Premiere Peau", None, A),
 # buddhawood
 "fw_buddha": ("https://fraterworks.com/products/mulacro-oil", "Buddhawood “Mulacro” Oil", None, None, A),
 "fr_buddha": ("https://www.fragrantica.com/news/Buddha-Wood-or-Fake-Sandalwood-20832.html", "Buddha Wood or Fake Sandalwood ~ Raw Materials ~ Fragrantica", None, None, A),
 "tg_buddha": ("https://www.thegoodscentscompany.com/data/es1545511.html", "eremophila mitchelli wood oil australia, 1429902-59-9", None, None, A),
 "pp_buddha": ("https://premierepeau.com/pages/glossary-terms/buddha-wood", "buddha wood", "Premiere Peau", None, A),
 # iso e super
 "fr_isoe": ("https://www.fragrantica.com/notes/Iso-E-Super-422.html", "Iso E Super perfume ingredient, Iso E Super fragrance and essential oils", None, None, A),
 "fr_isoenews": ("https://www.fragrantica.com/news/Iso-E-Super-A-Very-Popular-Synthetic-2837.html", "Iso E Super: A Very Popular Synthetic ~ Raw Materials ~ Fragrantica", None, None, A),
 "st_isoe": ("https://www.scentree.co/en/Iso_E_Super%C2%AE.html", "ScenTree - Iso E Super® (CAS N° 54464-57-2)", None, None, A),
 "wp_isoe": ("https://en.wikipedia.org/wiki/Tetramethyl_acetyloctahydronaphthalenes", "Tetramethyl acetyloctahydronaphthalenes", None, None, A),
 # cannabis
 "wp_cannabisoil": ("https://en.wikipedia.org/wiki/Cannabis_flower_essential_oil", "Cannabis flower essential oil", None, None, A),
 "pmc_hemp": ("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7466297/", "Volatile Composition and Sensory Properties as Quality Attributes of Fresh and Dried Hemp Flowers (Cannabis sativa L.)", "PubMed Central", None, A),
 "bn_cannabis": ("https://basenotes.com/community/threads/cannabis-accord-formula-recipe-help-critique.461574/", "Cannabis Accord formula / recipe help / critique", None, None, A),
 "fr_coze": ("https://www.fragrantica.com/perfume/Pierre-Guillaume/PG02-Coze-3730.html", "Coze 02 Pierre Guillaume Paris perfume - a fragrance for women and men 2002", None, None, A),
 # lava
 "fr_lava": ("https://www.fragrantica.com/notes/Lava-833.html", "Lava perfume ingredient, Lava fragrance and essential oils", None, None, A),
 "bn_lava": ("https://basenotes.com/notes/lava-accord.26181598", "lava accord", None, None, A),
 "pp_lava": ("https://premierepeau.com/pages/glossary-terms/lava", "lava", "Premiere Peau", None, A),
 "he_terre": ("https://www.hermes.com/us/en/product/terre-d-hermes-eau-de-parfum-intense-V111231V0/", "Terre d'Hermès Eau de parfum intense - 3.38 fl.oz", "Hermès", None, A),
 "op_dragon": ("https://omparfumfragrances.com/products/dragons-breath-%E9%BE%8D%E4%B9%8B%E6%81%AF", "Dragon's Breath 龍之息", "Outsider Parfum", None, A),
 # shiso
 "tg_perilla": ("https://www.thegoodscentscompany.com/data/es1581891.html", "perilla leaf oil, 68132-21-8", None, None, A),
 "oz_shiso": ("https://www.osmoz.com/encyclopedia/raw-materials/various/1744/shiso-leaf", "Shiso Leaf Perfumes raw material - Shiso Leaf Scent", None, None, A),
 "fr_shiso": ("https://www.fragrantica.com/news/-Nomenclature-shi-s--9429.html", "Nomenclature shi-sõ ~ Fragrance Reviews ~ Fragrantica", None, None, A),
 # metallic
 "fr_metal": ("https://www.fragrantica.com/news/Metallic-Scent-In-Perfumery-8361.html", "Metallic Scent In Perfumery ~ Raw Materials ~ Fragrantica", None, None, A),
 "fr_metalboard": ("https://www.fragrantica.com/board/viewtopic.php?id=248644", "What ingredient(s) make a perfume smell metallic? (Page 1) — General Perfume Talk — Fragrantica Club", "Fragrantica Club", None, A),
 "bn_metal": ("https://basenotes.com/community/threads/metallic-notes.523044/", "Metallic notes", None, None, A),
 # pea
 "fr_pea": ("https://www.fragrantica.com/news/Esxence-2023-The-Pea-by-Bel-Rebel-18170.html", "Esxence 2023: ...& The Pea by Bel Rebel ~ Fragrance News", None, None, A),
 "tg_pea": ("http://www.thegoodscentscompany.com/odor/pea-green-pea.html", "The Good Scents Company -Odor Descriptor Listing for pea green pea", None, None, A),
 "st_pyrazine": ("https://www.scentree.co/en/2-methoxy-3-isopropyl_pyrazine.html", "ScenTree - 2-methoxy-3-isopropyl pyrazine (CAS N° 25773-40-4)", None, None, A),
 # evernyl
 "st_evernyl": ("https://www.scentree.co/en/Evernyl%C2%AE.html", "ScenTree - Evernyl® (CAS N° 4707-47-5)", None, None, A),
 "sp_evernyl": ("https://www.scentspiracy.com/fragrance-ingredients/p/evernyl", "Evernyl (4707-47-5)", None, None, A),
 "fr_oakmoss": ("https://www.fragrantica.com/news/Oakmoss-and-Tree-Moss-in-Fragrance-11516.html", "Oakmoss and Tree Moss in Fragrance ~ Raw Materials ~ Fragrantica", None, None, A),
 # dulce de leche, cream
 "wp_dulce": ("https://en.wikipedia.org/wiki/Dulce_de_leche", "Dulce de leche", None, None, A),
 "fr_dulceobv": ("https://www.fragrantica.com/perfume/Obvious/Dulce-de-Leche-108058.html", "Dulce de Leche Obvious perfume - a new fragrance for women and men 2025", None, None, A),
 "op_crotch": ("https://omparfumfragrances.com/products/chocolate-crotch-coming-12-7", "Xocolate Crotch", "Outsider Parfum", None, A),
 "fr_cream": ("https://www.fragrantica.com/notes/Cream-454.html", "Cream perfume ingredient, Cream fragrance and essential oils", None, None, A),
 "fr_creamy": ("https://www.fragrantica.com/notes/Creamy-notes-1806.html", "Creamy notes perfume ingredient, Creamy notes fragrance and essential oils", None, None, A),
 "fr_lactonic": ("https://www.fragrantica.com/news/A-Scented-Dive-into-the-World-of-Lactonic-Perfumes-23437.html", "A Scented Dive into the World of Lactonic Perfumes ~ Columns ~ Fragrantica", None, None, A),
 "bn_creamy": ("https://basenotes.com/threads/what-do-people-mean-when-they-refer-to-a-fragrance-as-creamy-milky.220588/", "What do people mean when they refer to a fragrance as creamy/milky?", None, None, A),
 # angelica
 "fw_angelica": ("https://fraterworks.com/products/angelica-root-oil", "Angelica Root Oil", None, None, A),
 "tg_angelica": ("https://www.thegoodscentscompany.com/data/es1022792.html", "angelica root oil, 8015-64-3", None, None, A),
 "fr_angelica": ("https://www.fragrantica.com/notes/Angelica-44.html", "Angelica perfume ingredient, Angelica fragrance and essential oils Archangelica officinalis", None, None, A),
 # popcorn
 "fr_popcorn": ("https://www.fragrantica.com/news/Popcorn-in-Perfumery-Laurent-Mazzone-Parfums-Lineam-and-Others-24578.html", "Popcorn in Perfumery: Laurent Mazzone Parfums Lineam and Others ~ Raw Materials ~ Fragrantica", None, None, A),
 "wp_2ap": ("https://en.wikipedia.org/wiki/2-Acetyl-1-pyrroline", "2-Acetyl-1-pyrroline", None, None, A),
 "tg_popcorn": ("https://www.thegoodscentscompany.com/odor/popcorn.html", "The Good Scents Company -Odor Descriptor Listing for popcorn", None, None, A),
 # powder
 "fr_powdery": ("https://www.fragrantica.com/notes/Powdery-Notes-482.html", "Powdery Notes perfume ingredient, Powdery Notes fragrance and essential oils", None, None, A),
 "fr_powdernews": ("https://www.fragrantica.com/news/Let-s-Talk-About-Powder-17401.html", "Let's Talk About Powder! ~ Columns ~ Fragrantica", None, None, A),
 "bn_powdery": ("https://basenotes.com/threads/what-creates-the-powdery-accord.374481/", "What creates the Powdery accord?", None, None, A),
 # bakhoor
 "fr_bakhoornews": ("https://www.fragrantica.com/news/The-Enveloping-Scent-of-Smokeless-Bakhoor-16681.html", "The Enveloping Scent of Smokeless Bakhoor ~ Scented Home & Garden", None, None, A),
 "fr_bakhoorboard": ("https://www.fragrantica.com/board/viewtopic.php?id=50595", "bakhour...(perfumed smoke/incense....) (Page 1) — Layering Perfumes — Fragrantica Club", "Fragrantica Club", None, A),
 "wp_incense": ("https://en.wikipedia.org/wiki/Incense", "Incense", None, None, A),
 "fr_popcornnote": ("https://www.fragrantica.com/notes/Popcorn-250.html", "Popcorn perfume ingredient, Popcorn fragrance and essential oils", None, None, A),
 "fr_dulcedem": ("https://www.fragrantica.com/perfume/Demeter-Fragrance/Dulce-de-Leche-19886.html", "Dulce de Leche Demeter Fragrance perfume - a fragrance for women and men", None, None, A),
 "wp_perilla": ("https://en.wikipedia.org/?title=Perilla_frutescens", "Perilla frutescens", None, None, A),
 # cocktail
 "om_passion": ("https://omparfumfragrances.com/products/passion-oud", "Oud de Pasión", "OM Parfum", None, A),
 "fr_alcohol": ("https://www.fragrantica.com/news/Alcohol-in-Fragrance-For-Those-Who-Like-it-Stronger-11994.html", "Alcohol in Fragrance: For Those Who Like it Stronger ~ Columns ~ Fragrantica", None, None, A),
 "fr_cocktails": ("https://www.fragrantica.com/news/COCKTAILS-Cheers-to-Summer-20571.html", "COCKTAILS: Cheers to Summer ~ Columns ~ Fragrantica", None, None, A),
 "bn_boozy": ("https://basenotes.com/community/threads/boozy-gourmand-accord-for-oud-perfume.562211/", "Boozy-gourmand accord for Oud perfume", None, None, A),
 "bn_liquor": ("https://basenotes.com/community/threads/liquor-note.449221/", "Liquor note", None, None, A),
 # Lost Tribe, powder and bakhoor
 "lt_pan": ("https://losttribeperfumes.com/products/pan-s-labyrinth", "Pan’s Labyrinth", "Lost Tribe", None, A),
 "ls_pan": ("https://www.luckyscent.com/products/pans-labyrinth-by-lost-tribe", "Pan's Labyrinth by Lost Tribe", "Luckyscent", None, A),
 "lt_equatorial": ("https://losttribeperfumes.com/products/equatorial", "Equatorial", "Lost Tribe", None, A),
 "pp_bakhoor": ("https://premierepeau.com/blogs/news/bakhoor-the-ancient-scenting-ritual-the-west-forgot-pp", "Bakhoor: The Ancient Scenting Ritual The West Forgot", "Premiere Peau", None, A),
 "ng_oman": ("https://www.nationalgeographic.com/travel/article/discover-oman-through-its-perfumes-and-ancient-aromas", "Discover Oman through its perfumes and ancient aromas", "National Geographic", None, A),
 "wp_perfume": ("https://en.wikipedia.org/wiki/Perfume_Industry", "Perfume", None, None, A),
 "sp_tincture": ("https://www.scentspiracy.com/blog/tinctures-in-perfumery-definition-and-overview", "Tinctures in Perfumery: The Art of Vanilla Extraction — Scentspiracy", None, None, A),
 "ou_sq": ("https://www.ouddict.com/threads/sq-bakhoor-absolute-lana-hadi-parfums.10725/", "Attar - SQ Bakhoor Absolute - Lana & Hadi Parfums", "Ouddict", None, A),
 "wp_qaboos": ("https://en.wikipedia.org/wiki/Qaboos_bin_Said", "Qaboos bin Said", None, None, A),
 # mint-sandalwood
 "wp_attar": ("https://en.wikipedia.org/wiki/Attar", "Attar", None, None, A),
 "fw_motia": ("https://fraterworks.com/products/motia-attar", "Motia Attar", None, None, A),
 "fw_mysore": ("https://fraterworks.com/products/sandalwood-mysore", "Sandalwood Mysore “Signature” Oil", None, None, A),
 "bn_attar": ("https://basenotes.com/community/threads/what-is-an-attar.519272/", "What is an Attar", None, None, A),
 "fr_mint": ("https://www.fragrantica.com/notes/Mint-160.html", "Mint perfume ingredient, Mint fragrance and essential oils Mentha spicata, piperita, aquatica (Labiatae)", None, None, A),
 "fr_sandal": ("https://www.fragrantica.com/notes/Sandalwood-33.html", "Sandalwood perfume ingredient, Sandalwood fragrance and essential oils Santalum Album", None, None, A),
}
N = {
 "note-coconut-milk": dict(
  say="The rich white milk pressed from the grated flesh of ripe coconuts, not the clear water inside the nut. No oil for perfume can be drawn from it, so it is built from lactones, molecules with a soft, creamy, coconut-like smell. It smells sweet, milky and a little nutty, smoother and creamier than plain coconut, and gives a perfume a warm, comforting softness.",
  src=["wp_coconutmilk", "fr_coconut", "fr_lactmilk", "ps_milky", "ph_coconutmilk"]),
 "note-lilac": dict(
  say="The spring blossom of the lilac bush, a relative of the olive from south-eastern Europe. Its flowers give no usable oil, by distillation or by solvents, so the lilac of perfume is always rebuilt from other materials, chiefly terpineol, hydroxycitronellal and anisaldehyde, with a touch of heliotropin. It smells sweet, soft and powdery, delicate and fresh, with a green, almost watery edge, like an armful of cut lilac in a cool room.",
  src=["fr_lilac", "ps_lilac", "oz_lilac", "pp_lilac"],
  vars={"White Lilac": dict(same="No change: white lilac is the white-flowered lilac, whose blossom has the same smell, often more faintly, and in perfume both are rebuilt from the same materials, so the name gives the colour of the flower rather than a different note.")}),
 "note-buddhawood": dict(
  say="The oil steam-distilled from the heartwood of Eremophila mitchellii, a small tree of the dry inland scrub of Queensland and New South Wales, also called false sandalwood or desert rosewood. It is thick and dark, and smells dry, smoky and woody, like parched oak, with sweet, leathery, spicy and balsamic touches; it is often likened to sandalwood, though it is drier and smokier. Perfumers use it in the base, where it lasts long and makes synthetic woods smell more natural.",
  src=["fw_buddha", "fr_buddha", "pp_buddha", "tg_buddha"]),
 "note-iso-e-super": dict(
  say="A synthetic molecule made by the fragrance company IFF in 1973, and now one of the most used materials in perfumery. It smells of smooth, dry wood with the tone of cedar, warm, ambery and a little musky, with a velvety, cocooning feel. It is so transparent that some people can hardly smell it at all, but it gives fullness and radiance to everything round it: Molecule 01 is little else, and Dior's Fahrenheit is about a quarter of it.",
  src=["fr_isoe", "fr_isoenews", "st_isoe", "wp_isoe"]),
 "note-cannabis": dict(
  say="The hemp plant, Cannabis sativa. Its flowers can be distilled into a costly oil, mostly the same molecules that smell of pine and citrus, but most cannabis notes in perfume are accords built from other materials, often patchouli and vetiver. It smells green, herbal and resinous, piney and a little peppery, with the skunky, musky funk of the dried flowers: the leaf and flower rather than the smoke.",
  src=["wp_cannabisoil", "pmc_hemp", "bn_cannabis", "fr_coze"]),
 "note-cocktail-accord": dict(
  say="No one drink named: an accord of a mixed drink, a spirit with fruit, sugar and something sharp. Real spirits are too watery to work in a perfume, so it is built from materials that suggest them: fruity esters of the kind that give rum and fruit their smell, cognac oil, and whisky lactone, the smell of spirits aged in oak. It smells boozy, sweet and fruity, bright and a little sharp, the glass rather than the bottle.",
  src=["fr_alcohol", "fr_cocktails", "bn_boozy", "bn_liquor", "om_passion"]),
 "note-lava": dict(
  say="An accord of molten rock, which has no smell anyone could bottle: a fantasy of hot stone, ash and volcanic air. Perfumers build it from mineral and metallic notes, smoky woods and resins and the faintest touch of something sulphurous, like a struck match. It smells dark, dry, ashy and mineral, like warm black stone.",
  src=["fr_lava", "bn_lava", "pp_lava", "he_terre", "op_dragon"]),
 "note-shiso": dict(
  say="The leaf of perilla, a herb of the mint family grown and eaten across East Asia, distilled for its oil. Its smell sits between mint, basil and cumin: green and fresh, sharp and spicy, with hints of cinnamon, citrus, caraway and apple pip and a cool, almost metallic flash. Most of it is perilla aldehyde, a molecule few other plants have.",
  src=["tg_perilla", "oz_shiso", "fr_shiso", "wp_perilla"],
  vars={"Shiso Leaf": dict(same="No change: the shiso note is the leaf's own oil.")}),
 "note-metallic-notes": dict(
  say="The smell of metal: coins, steel, a cold key, a hint of blood. Metal is suggested in perfume by materials with a cold, sharp edge, most of all rose oxide, which is in rose and geranium, and some aldehydes and watery, ozonic molecules. It smells cold, clean and sharp, mineral and a little bloody, and different noses find it in very different perfumes.",
  src=["fr_metal", "fr_metalboard", "bn_metal", "op_dragon"]),
 "note-pea": dict(
  say="Fresh green peas: young pods torn open, green, a little sweet, starchy and earthy, like a vegetable garden in early summer, sometimes with the faintly lily-like smell of the pea's flower. The smell of raw peas comes largely from pyrazines, very powerful molecules perfumers use in tiny amounts. It is rare in perfume, and adds a fresh, vegetal strangeness to a green or floral one. It is not sweet pea, the flower.",
  src=["fr_pea", "tg_pea", "st_pyrazine"]),
 "note-evernyl": dict(
  say="A synthetic molecule, sold by Givaudan, that stands in for oakmoss, the lichen whose extract has been strictly limited because it can irritate the skin. It is one of the molecules that give oakmoss its own smell, made without the parts that cause the trouble. It smells mossy, earthy and woody, dry and a little powdery, like lichen, forest dust and old paper, and it holds up most modern chypres.",
  src=["st_evernyl", "sp_evernyl", "fr_oakmoss"]),
 "note-dulce-de-leche": dict(
  say="The caramel of South America: milk and sugar simmered slowly until they thicken and turn a deep golden brown. Its name means 'sweet of milk'. As a note it is an accord of caramel and warm, cooked milk, sweet, creamy, buttery and a little toasted, a warm dessert of a gourmand.",
  src=["wp_dulce", "fr_dulcedem", "fr_dulceobv", "op_crotch"]),
 "note-cream": dict(
  say="Fresh dairy cream as a note. There is no extract of cream, so it is built from lactones and milky materials, often with vanilla, to give a smooth, rich, slightly sweet and buttery softness. It smells soft, milky and a little fatty, the cream of a dessert, where a perfume's 'creaminess' can come from sandalwood or tuberose as well.",
  src=["fr_cream", "fr_creamy", "fr_lactonic", "ps_milky", "bn_creamy"],
  vars={"Creamy Cream": dict(same=SAME)}),
 "note-angelica-root": dict(
  say="The root of angelica, a tall herb of northern Europe, dried and distilled for its oil. It smells dark, earthy and musky, with the same musk molecules as ambrette seed, over a soft peppery top, and sweet, ambery, herbal and celery-like sides. Perfumers prize it as a fixative that holds a perfume together and adds a strange depth, but it is powerful and used sparingly.",
  src=["fw_angelica", "tg_angelica", "fr_angelica"]),
 "note-popcorn": dict(
  say="Freshly popped corn: warm, buttery, toasty and nutty, a little salty and sweet, the smell of a cinema foyer. Most of it is one molecule, 2-acetyl-1-pyrroline, which forms when grain is heated and is also the smell of basmati rice, pandan and bread crust. In perfume it is an accord, used in gourmands with caramel, vanilla and butter, and it can easily take over.",
  src=["fr_popcorn", "fr_popcornnote", "wp_2ap", "tg_popcorn"]),
 "note-powder-accord": dict(
  say="An accord of cosmetic powder, the face powder and talc of a dressing table. Powder itself has no smell, only the perfume it was always scented with, so the accord is built from iris and violet, heliotrope, musks and a little vanilla or rose. It smells soft, dry, sweet and velvety, clean and old-fashioned at once, like the inside of a compact. Lost Tribe spent two months on its own for Pan's Labyrinth.",
  src=["fr_powdery", "fr_powdernews", "bn_powdery", "lt_pan", "ls_pan"]),
 "note-bakhoor": dict(
  say="Arabic for incense: chips of agarwood or sandalwood soaked in fragrant oils and resins, often rose, bound with honey or sugar syrup and left to cure for weeks, then heated on charcoal in a burner, the mabkhara, so that the perfumed smoke can be passed through clothes, hair and the rooms of a home. Across the Gulf it is how guests are welcomed. It smells smoky and woody, resinous and sweet: oud, rose and amber in warm smoke.",
  src=["wp_incense", "pp_bakhoor", "fr_bakhoornews", "fr_bakhoorboard", "ng_oman"],
  vars={
   "Bakhoor Tincture": dict(say="Bakhoor steeped in perfumer's alcohol for weeks or months, a tincture, rather than burned: the alcohol draws out its oils, resins and wood, so the perfume carries the smell of the bakhoor itself, sweet, woody and resinous, with only a faint smoke of incense.", src=["sp_tincture", "wp_perfume", "lt_pan", "ls_pan"]),
   "Sultan Qaboos Bakhoor Tincture": dict(say="A tincture of a bakhoor named for Qaboos bin Said, Sultan of Oman from 1970 to 2020, who commissioned the perfume house Amouage. Bakhoor from the late Sultan's own collection has passed to perfumers, and an attar made from it is bright with rose and flowers over a darker smoke of incense and oud, as Omani bakhoor leans on rose, frankincense and oud. Steeped in alcohol, it lays that rosy, resinous warmth into the perfume.", src=["lt_equatorial", "ou_sq", "ng_oman", "wp_qaboos", "sp_tincture"]),
  }),
 "note-mint-sandalwood": dict(
  say="Mint and sandalwood distilled together rather than apart, the way the attars of India are made: plants are distilled in a copper still, and their vapour is caught in sandalwood oil, which takes up their smell and holds it. What comes out is one material rather than a blend of two oils: the cool, green bite of mint softened and held by the creamy, milky warmth of the wood.",
  src=["wp_attar", "fw_motia", "fw_mysore", "bn_attar", "fr_mint", "fr_sandal", "lt_equatorial"]),
}
out("NEW2", S, N)

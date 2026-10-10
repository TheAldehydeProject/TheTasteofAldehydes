from acc import out, SAME
A = "10 Oct. 2026"
S = {
 # oud
 "fr_oudterroir": ("https://www.fragrantica.com/news/OUD-SERIES-The-Smell-of-Oud-by-Terroir-5253.html", "OUD SERIES: The Smell of Oud by Terroir ~ Raw Materials ~ Fragrantica"),
 "pp_indianoud": ("https://premierepeau.com/pages/glossary-terms/indian-oud", "Indian Oud", "Premiere Peau", None, A),
 "sv_indianoud": ("https://scentverdict.com/note/indian-oud", "Indian Oud", "Scent Verdict", None, A),
 "pp_thaioud": ("https://premierepeau.com/pages/glossary-terms/thailand-oud", "Thailand Oud", "Premiere Peau", None, A),
 "sv_thaioud": ("https://scentverdict.com/note/thailand-oud", "Thailand Oud", "Scent Verdict", None, A),
 "pp_laooud": ("https://premierepeau.com/pages/glossary-terms/laotian-oud", "Laotian Oud", "Premiere Peau", None, A),
 "pp_malayoud": ("https://premierepeau.com/pages/glossary-terms/malaysian-oud", "Malaysian Oud", "Premiere Peau", None, A),
 "pp_indooud": ("https://premierepeau.com/pages/glossary-terms/indonesian-oud", "Indonesian Oud", "Premiere Peau", None, A),
 "ag_borneo": ("https://agoratopia.com/notes/oud-agarwood-borneo", "Oud/Agarwood (Borneo)", "Agoratopia", None, A),
 "bb_brunei": ("https://www.bizbrunei.com/2017/02/a-gift-from-above-oudh-al-aswad/", "‘A gift from above’", "BizBrunei", None, A),
 "eo_brunei": ("https://www.ensaroud.com/?p=95863", "Brunei Kynam: Blu", "Ensar Oud", None, A),
 "od_brunei": ("https://www.ouddict.com/threads/oud-of-the-day.8/page-1408", "Brunei oud, over a decade old. I don’t have much experience with Brunei but this Oud amazed me", "Ouddict", None, A),
 "wp_siliguri": ("https://en.wikipedia.org/wiki/Siliguri", "Siliguri - Wikipedia", None, None, A),
 "ho_prachin": ("https://hermitageoils.com/product/oud-thai-e-o/", "Oud Thailand E.O (PRACHIN)", "Hermitage Oils", None, A),
 "aab_silani": ("https://aabcollection.com/blogs/journal/aab-bakahoor", "Introducing Aab Bakhoor", "Aab", None, A),
 "ho_silani": ("https://hermitageoils.com/product/sri-lankan-oud-e-o/", "Wild Silani Oud E.O (11 YEARS AGED)", "Hermitage Oils", None, A),
 "lt_dirtysoda": ("https://losttribeperfumes.com/products/dirty-soda", "Dirty Soda", "Lost Tribe", None, A),
 "zgo_dirtysoda": ("https://zgoperfumery.com/collections/lost-tribe/products/lost-tribe-dirty-soda-parfum", "Lost Tribe Dirty Soda Parfum", "ZGO Perfumery", None, A),
 "eo_eo4": ("https://www.ensaroud.com/?p=91597", "EO 4: Purple K", "Ensar Oud", None, A),
 "sc_oudsynth": ("https://scentspiracy.com/bases/p/oud-synth-10760e", "Oud Synth 10760E", "Scentspiracy", None, A),
 "pp_oudguide": ("https://premierepeau.com/blogs/news/oud-perfume-guide", "Oud Perfume Guide", "Premiere Peau", None, A),
 # musk, ambergris
 "wp_deermusk": ("https://en.wikipedia.org/wiki/Deer_musk", "Deer musk - Wikipedia", None, None, A),
 "wp_musk": ("https://en.wikipedia.org/wiki/Musk", "Musk - Wikipedia"),
 "wp_sibdeer": ("https://en.wikipedia.org/wiki/Siberian_musk_deer", "Siberian musk deer - Wikipedia", None, None, A),
 "bri_muskdeer": ("https://www.britannica.com/animal/musk-deer", "Musk deer", "Britannica", None, A),
 "sv_losttribe": ("https://scentverdict.com/brand/lost-tribe", "Lost Tribe", "Scent Verdict", None, A),
 "bn_ensarmusks": ("https://basenotes.com/threads/ensar-oud-musks.570263/", "Ensar Oud Musks", "Basenotes", None, A),
 "pm_mongolian": ("https://www.parfumo.com/Fragrance_Note/mongolian-musk", "Mongolian musk", "Parfumo", None, A),
 "sv_cleanmusk": ("https://scentverdict.com/note/clean-musk", "Clean Musk", "Scent Verdict", None, A),
 "pp_whitemusk": ("https://premierepeau.com/pages/glossary-terms/white-musk", "White Musk", "Premiere Peau", None, A),
 "wp_ambergris": ("https://en.wikipedia.org/wiki/Ambergris", "Ambergris - Wikipedia"),
 "cl_ambergris": ("https://contractlaboratory.com/ambergris-testing/", "What Is Ambergris?", "Contract Laboratory", None, A),
 "ho_whiteamb": ("https://hermitageoils.com/?p=50596", "White Ambergris 10% Tincture (3 YEAR AGED)", "Hermitage Oils", None, A),
 "ho_heartstone": ("https://hermitageoils.com/product/ambergris-heart-stone-tincture-3/", "Ambergris Heart Stone Tincture 3% (5 Years Aged)", "Hermitage Oils", None, A),
 # vetiver, patchouli
 "fr_vetivernews": ("https://www.fragrantica.com/news/Different-Kinds-of-Vetiver-in-Perfumery-16912.html", "Different Kinds of Vetiver in Perfumery ~ Raw Materials ~ Fragrantica"),
 "fw_vetjava": ("https://fraterworks.com/products/vetiver-oil-java", "Vetiver Oil Java", "Fraterworks", None, A),
 "eb_vetjava": ("https://edenbotanicals.com/vetiver-java.html", "Vetiver, Java EO", "Eden Botanicals", None, A),
 "in_vetiver": ("https://www.indesso.com/en/our-business/botanical-detail/vetiver-vetiveria-zizanioides", "Vetiver (Vetiveria zizanioides)", "Indesso", None, A),
 "wp_patch": ("https://en.wikipedia.org/wiki/Patchouli", "Patchouli - Wikipedia"),
 "in_patch": ("https://www.indesso.com/en/our-business/botanical-detail/patchouli-pogostemon-cablin", "Patchouli (Pogostemon cablin)", "Indesso", None, A),
 "pr_pogostemon": ("https://uses.plantnet-project.org/en/Pogostemon_(PROSEA)", "Pogostemon (PROSEA)", "Pl@ntUse", None, A),
 "sc_patchheart": ("https://www.scentspiracy.com/fragrance-ingredients/p/patchouli-coeur-3", "Patchouli Heart (coeur) N.3", "Scentspiracy", None, A),
 "fw_patchheart": ("https://fraterworks.com/products/patchouli-heart-md-pa50", "Patchouli Heart MD PA50", "Fraterworks", None, A),
 # cedarwood, sandalwood
 "fr_cedarboard": ("https://www.fragrantica.com/board/viewtopic.php?id=305020", "Virginia vs Atlas vs Himalaya Cedar - how do you tell them apart? (Page 1) — Perfume Selection Tips for Men — Fragrantica Club", "Fragrantica Club"),
 "eb_cedvirginia": ("https://edenbotanicals.com/cedarwood-virginia-sample.html", "Cedarwood, Virginia EO", "Eden Botanicals", None, A),
 "pp_cedarwood": ("https://premierepeau.com/pages/glossary-terms/cedarwood", "Cedarwood", "Premiere Peau", None, A),
 "aw_texascedar": ("https://www.aromaweb.com/essential-oils/texas-cedarwood-essential-oil.php", "Texas Cedarwood Essential Oil", "AromaWeb", None, A),
 "fw_texascedar": ("https://fraterworks.com/products/cedarwood-oil-rect-texas", "Cedarwood Oil Rect. Texas", "Fraterworks", None, A),
 "osu_juniper": ("https://juniper.oregonstate.edu/node/48", "Investigation of Juniperus Species of the United States for New Sources of Cedarwood Oil", "Oregon State University", None, A),
 "eb_atlasabs": ("https://edenbotanicals.com/cedarwood-absolute-atlas.html", "Cedarwood Absolute, Atlas", "Eden Botanicals", None, A),
 "tg_atlas": ("https://www.thegoodscentscompany.com/data/es1028531.html", "atlas cedarwood oil, 8023-85-6", "The Good Scents Company"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "cu_srisandal": ("https://espace.curtin.edu.au/handle/20.500.11937/32154", "Essential oil content and composition of Indian Sandalwood (Santalaum album) in Sri Lanka", "Curtin University", None, A),
 "ag_ceylonsandal": ("https://agoratopia.com/notes/sandalwood-ceylon", "Sandalwood (Ceylon)", "Agoratopia", None, A),
 "sn_srisandal": ("https://sunday.de/en/sandalwood-oil-santalum-album-bio-sri-lanka.html", "Sandalwood Oil Santalum Album Bio Sri Lanka", "Sunday Natural", None, A),
 # resins, civet, conifers
 "fw_sumatra": ("https://fraterworks.com/products/benzoin-sumatra-resinoid-50-tec", "Benzoin Sumatra Resinoid 50% TEC – Fraterworks"),
 "wp_benzoinresin": ("https://en.wikipedia.org/wiki/Benzoin_resin", "Benzoin resin - Wikipedia", None, None, A),
 "pn_benzoin": ("https://uses.plantnet-project.org/en/Benzoin_(FAO,_NWFP_6)", "Benzoin (FAO, NWFP 6)", "Pl@ntUse", None, A),
 "tg_civetabs": ("https://thegoodscentscompany.com/data/ab1019061.html", "civet absolute", "The Good Scents Company", None, A),
 "fw_civetgold": ("https://fraterworks.com/products/civet-gold-absolute-p-n", "Civet Gold Absolute P.N.", "Fraterworks", None, A),
 "pp_civetabs": ("https://premierepeau.com/pages/glossary-terms/civet-absolute", "Civet Absolute", "Premiere Peau", None, A),
 "bl_blackspruce": ("https://biolandes.com/en/product/black-spruce/", "Black Spruce", "Biolandes", None, A),
 "pp_blackspruce": ("https://premierepeau.com/pages/glossary-terms/black-spruce", "Black Spruce", "Premiere Peau", None, A),
 "fr_blackspruce": ("https://www.fragrantica.com/notes/Black-Spruce-478.html", "Black Spruce perfume ingredient, Black Spruce fragrance and essential oils Picea Mariana"),
 "fw_olibvulcain": ("https://fraterworks.com/products/olibanum-resinoid-vulcain", "Olibanum Resinoid Vulcain", "Fraterworks", None, A),
 "dsm_olibvulcain": ("https://www.firmenich.com/product/olibanum-res-vulcain-pe-939912-0", "Olibanum Res Vulcain PE 939912", "dsm-firmenich", None, A),
 "eb_amberfossil": ("https://www.edenbotanicals.com/amber-oil-fossilized.html", "Amber Oil, Fossilized EO", "Eden Botanicals", None, A),
 "om_burnana": ("https://omparfumfragrances.com/products/burnana", "Burnana", "OM Parfum", None, A),
 "hh_amberoil": ("https://henriettes-herb.com/eclectic/kings/ambra-flav.html", "Oleum Succini (Oil of Amber)", "Henriette's Herbal Homepage", None, A),
 # absolutes, gourmands, the rest
 "fw_claryabs": ("https://fraterworks.com/products/clary-sage-absolute-france", "Clary Sage Absolute – Fraterworks"),
 "eb_claryabs": ("https://edenbotanicals.com/clary-sage-absolute.html", "Clary Sage Absolute", "Eden Botanicals"),
 "dsm_mateabs": ("https://www.firmenich.com/product/mate-abs-ctx-pe-957218-0", "Mate Abs CTX PE 957218", "dsm-firmenich", None, A),
 "fw_mateabs": ("https://fraterworks.com/products/yerba-mate-absolute", "Yerba Mate Absolute", "Fraterworks", None, A),
 "bl_mate": ("https://biolandes.com/en/mate-extracts-for-perfumery-and-cosmetics/", "Natural extracts of mate for perfumery", "Biolandes", None, A),
 "ho_tomato": ("https://hermitageoils.com/product/tomato-leaf-absolute-50/", "Tomato Leaf Absolute", "Hermitage Oils", None, A),
 "pp_tomato": ("https://premierepeau.com/pages/glossary-terms/tomato-leaf", "Tomato Leaf", "Premiere Peau", None, A),
 "bp_tomato": ("https://bonparfumeur.com/blogs/journal/tomato-leaf-in-perfumery", "Tomato Leaf Perfume", "Bon Parfumeur", None, A),
 "rob_osmanthus": ("https://matieres-premieres.robertet.com/osmanthus-absolute", "Osmanthus Absolute", "Robertet", None, A),
 "pp_osmanthus": ("https://premierepeau.com/pages/glossary-terms/osmanthus-absolute", "Osmanthus Absolute", "Premiere Peau", None, A),
 "dsm_osmanthus": ("https://www.firmenich.com/product/osmanthus-abs-pe-969340-0", "Osmanthus Abs PE 969340", "dsm-firmenich", None, A),
 "eb_obabs": ("https://www.edenbotanicals.com/orange-blossom-absolute.html", "Orange Blossom Absolute", "Eden Botanicals", None, A),
 "cp_orangeflower": ("https://caperfume.com/pages/discover-ingredient/african-orange-flower", "Ingredient Guide · White Floral", "Caper Perfume", None, A),
 "pp_neroli": ("https://premierepeau.com/pages/glossary-terms/neroli", "Neroli", "Premiere Peau", None, A),
 "pp_roseotto": ("https://premierepeau.com/blogs/news/rose-otto-vs-rose-absolute", "Rose Otto vs Rose Absolute", "Premiere Peau", None, A),
 "wp_roseoil": ("https://en.wikipedia.org/wiki/Rose_oil", "Rose oil - Wikipedia"),
 "ps_rose": ("https://perfumesociety.org/ingredients-post/rose/", "Rose - The Perfume Society"),
 "sv_burntsugar": ("https://scentverdict.com/note/burnt-sugar", "Burnt Sugar", "Scent Verdict", None, A),
 "ag_carsugar": ("https://www.agoratopia.com/notes/caramelized-sugar", "Caramelized Sugar", "Agoratopia", None, A),
 "pp_caramel": ("https://premierepeau.com/pages/glossary-terms/caramel", "Caramel", "Premiere Peau", None, A),
 "wp_moltencake": ("https://en.wikipedia.org/wiki/Molten_chocolate_cake", "Molten chocolate cake - Wikipedia", None, None, A),
 "pm_chococake": ("https://www.parfumo.com/Fragrance_Note/Chocolate_cake", "Chocolate cake", "Parfumo", None, A),
 "pp_goatsmilk": ("https://premierepeau.com/pages/glossary-terms/goats-milk", "Goat's Milk", "Premiere Peau", None, A),
 "sb_goatsmilk": ("https://thescentbase.com/notes/goat-s-milk", "Perfumes containing the Goat S Milk note", "The Scent Base", None, A),
 "fw_caprylic": ("https://fraterworks.com/products/caprylic-acid", "Caprylic Acid", "Fraterworks", None, A),
 "pp_cocoaabs": ("https://premierepeau.com/pages/glossary-terms/cocoa-absolute", "Cocoa Absolute", "Premiere Peau", None, A),
 "fw_cocoa": ("https://fraterworks.com/products/cocoa-absolute-5-ipm", "Cocoa Absolute 5% IPM – Fraterworks"),
 "fw_cocoares": ("https://fraterworks.com/products/cocoa-resinoid-20-pct-tec", "Cocoa Resinoid 20% TEC", "Fraterworks", None, A),
 "pp_lexicon": ("https://premierepeau.com/blogs/news/absolue-concrete-resinoide-lexique-fr", "Absolute, Concrete, Resinoid: The Lexicon No One Gets Right", "Premiere Peau", None, A),
 "eb_bitteralmond": ("https://edenbotanicals.com/almond-bitter.html", "Almond, Bitter EO", "Eden Botanicals", None, A),
 "pp_benzaldehyde": ("https://premierepeau.com/pages/glossary-terms/benzaldehyde", "Benzaldehyde", "Premiere Peau", None, A),
 "pf_benzald": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21860816/benzaldehyde", "Benzaldehyde | Perfumer & Flavorist"),
 "pp_bbq": ("https://premierepeau.com/pages/glossary-terms/bbq", "BBQ", "Premiere Peau", None, A),
 "sb_bbq": ("https://thescentbase.com/notes/bbq", "What does BBQ Smell like? BBQ Scent Profile, Guide and Fragrances. | thescentbase.com", "The Scent Base", None, A),
 "fz_bbq": ("https://www.fragrenza.com/collections/bbq-fragrances", "Collection: BBQ Fragrances", "Fragrenza", None, A),
 "us_juice": ("https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8440248", "Reduced sugar citrus juice beverage", "United States Patent and Trademark Office", None, A),
 "tum_oj": ("https://portal.fis.leibniz-lsb.tum.de/en/publications/the-importance-of-aldehydes-to-the-fresh-aroma-of-orange-juice/", "The Importance of Aldehydes to the Fresh Aroma of Orange Juice", "Leibniz-LSB@TUM", None, A),
 "ps_orange": ("https://perfumesociety.org/ingredients-post/orange/", "Orange - The Perfume Society"),
}
N = {
 "note-orange": dict(vars={
   "Orange Juice": dict(say="Orange as its juice rather than its peel. The peel's oil is nearly all limonene, but the juice holds the fruit's own esters, alcohols and aldehydes, so it smells sweeter, fruitier and wetter, pulpy and a little sour, like a freshly squeezed glass, where peel oil is bright, zesty and dry.", src=["us_juice", "tum_oj", "ps_orange"]),
   "Orange Peel": dict(same="No change: an orange's oil is pressed from its peel."),
   "Sweet Orange": dict(same="No change: the orange of perfumery is the sweet orange."),
  }),
 "note-mate": dict(vars={
   "Mate Absolute": dict(say="The real extract of maté leaves, taken with solvents and purified into an absolute, rather than a tea accord: dark, dense and lasting for days. It is warm green tea over dry hay and tobacco leaf, with honeyed, fruity and leathery sides and a smoky, phenolic edge from the smoke-drying of the leaves, turning towards black tea as it dries down.", src=["dsm_mateabs", "fw_mateabs", "bl_mate"]),
   "Mate": dict(same=SAME),
  }),
 "note-coriander": dict(vars={
   "Coriander Seed": dict(same="No change: coriander's oil in perfumery is the seed's."),
  }),
 "note-pink-pepper": dict(vars={
   "Pink Peppercorn": dict(same=SAME),
  }),
 "note-jasmine": dict(vars={
   "Jasmine Flower": dict(same=SAME),
  }),
 "note-osmanthus": dict(vars={
   "Osmanthus Absolute": dict(say="The flower itself, extracted with solvents and purified in alcohol, which is how osmanthus is taken: it takes about a thousand kilos of flowers, picked in China in autumn, for one kilo of absolute. It is the note at its fullest and most natural: dried apricot and white flowers over a leathery, suede-like warmth, honeyed and a little like tea.", src=["rob_osmanthus", "dsm_osmanthus", "pp_osmanthus"]),
   "Osmanthus Flower": dict(same=SAME),
  }),
 "note-orange-blossom": dict(vars={
   "Orange Flower Absolute": dict(say="Orange blossom as the absolute itself, extracted with solvents, here from Egyptian flowers: the note at its most concentrated, thick and powerful, rich in indole, which gives it a sultry, animal warmth, with a faint bitter-green note behind the honeyed flower. It is far heavier than neroli, the light, green, citrusy oil steam-distilled from the same blossoms.", src=["eb_obabs", "cp_orangeflower", "pp_neroli"]),
   "Orange Flower": dict(same=SAME),
  }),
 "note-lily-of-the-valley": dict(vars={
   "Muguet": dict(same="No change: muguet is the French name for lily of the valley."),
  }),
 "note-aquatic-notes": dict(vars={
   "Water Notes": dict(same=SAME),
  }),
 "note-banana": dict(vars={
   "Epic Banana": dict(same="No change: OM Parfum's own name for its banana."),
  }),
 "note-apple": dict(vars={
   "Fresh Apple": dict(same=SAME),
  }),
 "note-passionfruit": dict(vars={
   "Passion Fruit": dict(same=SAME),
  }),
 "note-chocolate": dict(vars={
   "Dirty Chocolate": dict(same="No change: Outsider Parfum's own name for its chocolate."),
  }),
 "note-tea": dict(vars={
   "Dry Tea Leaves": dict(same=SAME),
  }),
 "note-cedarwood": dict(vars={
   "Cedar Wood": dict(same=SAME),
   "Virginia Cedar": dict(say="Not a true cedar but a juniper, the eastern red cedar of North America, Juniperus virginiana. It is the classic 'pencil' cedar: dry, clean and sharp, like fresh pencil shavings, lighter and less sweet than the balsamic cedar of the Atlas.", src=["eb_cedvirginia", "pp_cedarwood", "fr_cedarboard"]),
   "Texas Cedar": dict(say="Another American juniper, the cedar of central Texas, Juniperus ashei or mexicana. Its oil is sweeter and rounder than Virginia cedar, dry and woody with a soft, balsamic, resinous undertone and a distinct smell of pencil shavings.", src=["aw_texascedar", "fw_texascedar", "osu_juniper"]),
   "Texas Cedarwood": dict(say="The oil of the Texas cedar, a juniper of central Texas rather than a true cedar: sweeter and softer than Virginia cedarwood, a dry, pencil-shaving wood with a gentle, balsamic warmth under it.", src=["fw_texascedar", "pp_cedarwood", "osu_juniper"]),
   "Atlas Cedarwood Absolute": dict(say="Atlas cedar extracted with solvents rather than distilled: the absolute is deeper and rounder than the oil, and lasts longer, sweet, balsamic and resinous, warm and dry, with a hint of apricot liqueur over the wood.", src=["eb_atlasabs", "tg_atlas", "wp_absolute"]),
  }),
 "note-sandalwood": dict(vars={
   "Sri Lankan Sandalwood": dict(say="Sandalwood from Sri Lanka, of the same tree as the famous sandalwood of Mysore, Santalum album, rather than the rawer Australian kind. Its oil is rich in santalols, the molecules that make sandalwood smell as it does, so it is the true sandalwood: creamy, smooth and velvety. It too has been overharvested and is scarce.", src=["cu_srisandal", "ag_ceylonsandal", "sn_srisandal"]),
  }),
 "note-treemoss": dict(vars={
   "Pine Tree Moss": dict(same="No change: treemoss is the lichen that grows on pines and firs."),
  }),
 "note-spruce": dict(vars={
   "Black Spruce": dict(say="The spruce of the northern bogs and forests of Canada, Picea mariana, its needles and twigs steam-distilled. It is darker and more balsamic than the everyday spruce: fresh and resinous, with a sweet, slightly fruity, oily undertone and a camphor-like edge that settles into a deep forest dry-down, and it is loved in fougères.", src=["bl_blackspruce", "pp_blackspruce", "fr_blackspruce"]),
  }),
 "note-cypress": dict(vars={
   "Intrepid Cypress": dict(same="No change: Lost Tribe's own name for the cypress in Equatorial; nothing it has published says it is a different material from cypress."),
  }),
 "note-benzoin": dict(vars={
   "Benzoin Sumatra": dict(say="Benzoin from Sumatra, from the tree Styrax benzoin, rather than the Siam benzoin of Laos and Thailand. It carries cinnamic acid as well as benzoic, so it is harsher, spicier and more balsamic, closer to storax, with less of the round vanilla sweetness of Siam benzoin.", src=["wp_benzoinresin", "pn_benzoin", "fw_sumatra"]),
  }),
 "note-frankincense": dict(vars={
   "Olibanum Vulcain": dict(say="Frankincense resinoid that has been heated, which dsm-firmenich calls Vulcain, after the god of fire: the heating, pyrogenation, makes new smoky molecules in it. Where ordinary olibanum is sweet, woody and balsamic with a lemony, peppery lift, this is incense, smoke and warm leather, with a radiant dry-down.", src=["dsm_olibvulcain", "fw_olibvulcain"]),
  }),
 "note-amber": dict(vars={
   "Amber Fossil": dict(say="Not the amber accord but the real fossil: oil of amber, made by heating fossilised tree resin, here from the Himalayas and some 35 million years old, until an oil runs from it. It is dark and thick, smoky, leathery and tar-like, dry and woody with a hint of pine, and not sweet at all, quite unlike the warm, vanilla glow of an amber accord.", src=["eb_amberfossil", "om_burnana", "hh_amberoil"]),
  }),
 "note-oakmoss": dict(vars={
   "French Oakmoss": dict(same=SAME),
  }),
 "note-styrax": dict(vars={
   "Styrax Resinoid": dict(same=SAME),
   "Storax Resin": dict(same="No change: storax and styrax are the same resin."),
  }),
 "note-civet": dict(vars={
   "Civette": dict(same="No change: civette is the French spelling of civet."),
   "Civet Absolute": dict(say="Civet as an absolute: the paste extracted with solvents into a thick, dark brown liquid, its most concentrated form. At full strength it is harsh, faecal and urinous, with honey and fat in it; diluted to a trace it turns warm, musky and radiant, almost floral, with a soft, leathery, powdery side.", src=["tg_civetabs", "fw_civetgold", "pp_civetabs"]),
  }),
 "note-costus": dict(vars={
   "Costus Root": dict(same="No change: costus oil is distilled from the root."),
  }),
 "note-soil": dict(vars={
   "Black Soil": dict(same=SAME),
  }),
 "note-airy-note": dict(vars={
   "Clean Fresh Air": dict(same=SAME),
  }),
 "note-oud": dict(vars={
   "Indian Oud": dict(say="Oud from India, mostly from Assam and the hills of the North-East: the wildest and most animal of the ouds, barnyard and leather with a fermented edge at first, softening into a leathery, medicinal sweetness and a smoky, balsamic dry-down.", src=["pp_indianoud", "sv_indianoud", "fr_oudterroir"]),
   "Thai Oud": dict(say="Oud from Thailand, mostly from the Aquilaria crassna tree and now often from plantations: softer and sweeter than Indian oud, honeyed and almost berry-like, warm and woody with smoky, leathery undertones and far less of the barnyard.", src=["pp_thaioud", "sv_thaioud"]),
   "Laos Oud": dict(say="Oud from Laos, from the same tree as Thai and Cambodian oud: pungent and animal at first, leather and fermented fruit, then a smoky-sweet wood with dried apricot and honey, warmer and more resinous than Cambodian oud, ending in incense and old wood.", src=["pp_laooud", "fr_oudterroir"]),
   "Brunei Oud": dict(say="Oud from Brunei, on the north coast of Borneo, where agarwood has been traded from the shore for centuries. It is rare and very costly, and described as resinous and sweet: a cool, camphor-like, medicinal opening, then honey, plum and red fruit over smoky wood.", src=["bb_brunei", "eo_brunei", "od_brunei"]),
   "Oud Siliguri": dict(say="Most likely oud named after Siliguri, the trading city of northern West Bengal that is the gateway to Assam and the North-East, where India's agarwood grows. So it is Indian oud: deep and animal, leathery and smoky, with the barnyard funk India's oud is known for.", src=["wp_siliguri", "pp_indianoud", "fr_oudterroir"]),
   "Brachin Oud": dict(say="Most likely Prachin oud, from Prachin Buri in eastern Thailand, where agarwood of the Aquilaria crassna tree is grown. It is a Thai oud, sweeter and softer than Indian oud, but Prachin's is known for a thick richness like maple syrup, with tobacco, a little leather and a touch of sour berries.", src=["ho_prachin", "pp_thaioud"]),
   "Selani Safi Oud": dict(say="Most likely Silani oud, the old trade name for the oud of Sri Lanka, once Ceylon, by which Middle Eastern traders knew it. It comes from Gyrinops walla, the island's own agarwood tree, wild and now scarce, and its oil is animal at first, then a soft, rounded smoke with dried tobacco and a faint clove.", src=["aab_silani", "ho_silani"]),
   "Pontianak Oud": dict(say="Oud from Pontianak, in West Kalimantan on the island of Borneo. Borneo's ouds are usually lighter and cleaner than India's: drier and greener, a little herbal and medicinal, with camphor and mint at the top over clear wood, a hint of damp forest soil and a faint incense.", src=["pp_indooud", "ag_borneo"]),
   "Malaysian Cola Oud": dict(say="Lost Tribe's own name for the Malaysian oud in Dirty Soda, its perfume of an ice-cold cola. The oud itself is Malaysian, sweeter and fruitier than Indian oud, plum and honey over a soft smoke, set against the cola's vanilla and spice, as Ensar Oud set a Malaysian oud against the cola of its own EO 4.", src=["lt_dirtysoda", "zgo_dirtysoda", "pp_malayoud", "eo_eo4"]),
   "Thai Cola Oud": dict(say="Lost Tribe's own name for the Thai oud in Dirty Soda, its perfume of an ice-cold cola. The oud itself is Thai, honeyed and almost berry-like, softer and sweeter than Indian oud, and its sweet, smoky warmth sits with the cola's vanilla, spice and citrus.", src=["lt_dirtysoda", "zgo_dirtysoda", "pp_thaioud"]),
   "Oud Accord": dict(say="Not agarwood but an impression of it, built by the perfumer from a blend of aroma molecules, since real oud is rare, costly and tightly controlled. It is smoother, cleaner and steadier than the real thing, dark and resinous without the barnyard, and most of the oud in perfumes today is this.", src=["sc_oudsynth", "pp_oudguide"]),
  }),
 "note-musk": dict(vars={
   "Natural Musk": dict(say="Musk from the musk deer itself rather than the laboratory: warm, dark, animal and powerful, unpleasant until it is diluted and then rich and radiant, far rounder than any clean synthetic musk. Hunting the deer is banned, so what little is used now comes from deer farmed in China, whose musk is taken without killing them, or from old stocks.", src=["wp_deermusk", "wp_musk", "sv_losttribe"]),
   "Siberian Musk": dict(say="Natural deer musk from the Siberian musk deer, a small, tusked deer of the mountain forests from Siberia to the Himalayas, which carries its musk in a pod on its belly. Of the grades of deer musk, Siberian is held to be the most animal, sweaty and dark, the benchmark the others are measured by.", src=["bri_muskdeer", "wp_sibdeer", "bn_ensarmusks"]),
   "Mongolian Musk": dict(say="Natural deer musk named for Mongolia, where the Siberian musk deer also lives. It is said to be the sweetest and softest of the deer musks: almost chocolatey, with honey and a dark, slightly dirty animal warmth, less fierce than the Siberian.", src=["wp_sibdeer", "bn_ensarmusks", "pm_mongolian"]),
   "Clean Musk": dict(say="Not the deer's musk but the laundry-fresh musk of the laboratory, built from modern synthetic musks: soft and airy, like freshly washed linen and clean skin, a little powdery, soapy and sweet. It is close to white musk, with the fresh laundry put forward.", src=["sv_cleanmusk", "pp_whitemusk"]),
  }),
 "note-ambergris": dict(vars={
   "White Ambergris": dict(say="Ambergris that has floated longest at sea, bleached by sun and salt water to pale grey or white: the rarest and most costly grade, and the cleanest-smelling, soft and sweet, a little salty, earthy and marine, with only a gentle animal warmth left in it.", src=["ho_whiteamb", "cl_ambergris", "wp_ambergris"]),
   "Black Ambergris": dict(say="Ambergris at its freshest, dark and soft, not long out of the whale: the cheapest and roughest grade but the strongest-smelling, with a harsh, faecal, animal edge that years on the sea would have mellowed into sweetness.", src=["cl_ambergris", "ho_heartstone", "wp_ambergris"]),
  }),
 "note-vetiver": dict(vars={
   "Java Vetiver": dict(say="Vetiver from Java, in Indonesia: the smoky vetiver, earthier and darker than the clean, bright vetiver of Haiti, with a burnt, sometimes tar-like edge over sweet wood, and a hint of butterscotch underneath.", src=["fr_vetivernews", "fw_vetjava", "eb_vetjava"]),
   "Java Vetiver Oil": dict(say="The distilled oil of Java vetiver's roots: smoky, earthy and woody, sweeter and darker than Haitian vetiver. How it is distilled decides how much smoke it carries, from soft to heavy and tarry.", src=["fw_vetjava", "eb_vetjava", "fr_vetivernews"]),
   "Vetiver Indonesia": dict(say="Vetiver from Indonesia, most of it grown on Java: earthy, woody and smoky, with a sweet, caramel-like depth, more smoke and less of the bright green of Haitian vetiver, though a gently distilled one can be smooth and soft.", src=["in_vetiver", "eb_vetjava", "fr_vetivernews"]),
  }),
 "note-patchouli": dict(vars={
   "Patchouli Sumatra": dict(say="Patchouli from Sumatra: Indonesia grows most of the world's patchouli, much of it on Sumatra, where it has been grown for its oil for over a century. It is the classic oil: deep, earthy and woody, a little sweet and camphorous.", src=["wp_patch", "in_patch", "pr_pogostemon"]),
   "Patchouli Coeur": dict(say="The heart of patchouli: the oil distilled a second time and only its middle cut kept, so the musty, camphor-like and smoky edges at either end are left behind. It is cleaner, smoother and woodier than ordinary patchouli, richer in its main scented molecule, patchouli alcohol, and less of the damp forest floor.", src=["sc_patchheart", "fw_patchheart"]),
  }),
 "note-clary-sage": dict(vars={
   "Clary Sage Absolute": dict(say="Clary sage taken with solvents rather than distilled with steam: a darker, denser absolute that lasts far longer than the oil. It has less of the fresh, lavender-like herb and more of the warm depth beneath it, sweet, wine-like hay and tobacco with a mossy, tea-like, balsamic edge.", src=["fw_claryabs", "eb_claryabs", "wp_absolute"]),
  }),
 "note-tomato-leaf": dict(vars={
   "Tomato Leaf Absolute": dict(say="Tomato leaf as a real extract, taken from the plant with solvents, rather than the usual tomato leaf accord built from green and sulphurous molecules. It is rare, and rougher and earthier than the accord: vegetal, musty and soil-like, green and a little woody and weedy, with grassy touches.", src=["ho_tomato", "pp_tomato", "bp_tomato"]),
  }),
 "note-rose": dict(vars={
   "Rose Otto": dict(say="Rose distilled with steam rather than extracted with solvents: rose otto, the oil of the damask rose, most of it from Bulgaria and Turkey. It is lighter, fresher and brighter than rose absolute, delicate and a little green and herbal, with a lemony, spicy sparkle, where the absolute is deeper, heavier and more honeyed.", src=["pp_roseotto", "wp_roseoil", "ps_rose"]),
   "Rose Oil": dict(say="Rose oil, in perfumery, is the oil steam-distilled from the petals, which is to say rose otto by its plainer name. Like otto it is the fresher, brighter rose, delicate, a little green and spicy, lighter than the deep, honeyed absolute; it takes thousands of flowers for a little of it.", src=["wp_roseoil", "pp_roseotto"]),
  }),
 "note-caramel": dict(vars={
   "Burnt Sugar": dict(say="Caramel taken a step too far: sugar heated until it starts to char. It is sweet but darker and more bitter than caramel, toasted and a little smoky, deepening into molasses as it dries down. Like caramel it is built by the perfumer, from maltol and its relatives.", src=["sv_burntsugar", "ag_carsugar", "pp_caramel"]),
  }),
 "note-chocolate-cake": dict(vars={
   "Lava Cake": dict(say="A particular chocolate cake: the molten chocolate cake, or lava cake, a small French cake baked so that its middle stays liquid. So it is chocolate cake at its richest and least cakey: warm, melting dark chocolate more than sponge, with a little butter and sugar around it.", src=["wp_moltencake", "pm_chococake"]),
  }),
 "note-milk": dict(vars={
   "Goat’s Milk": dict(say="Milk with the goat in it: thicker, fattier and a little sour, warmer and more animal than cow's milk, with a tangy, faintly cheesy edge from the fatty acids that give goat's milk its smell, which turns towards the farmyard if it is pushed. Like any milk in perfume it is built, from creamy lactones and a trace of those acids.", src=["pp_goatsmilk", "sb_goatsmilk", "fw_caprylic"]),
  }),
 "note-cacao": dict(vars={
   "Cacao Absolute": dict(say="The real extract of the cacao bean, taken with solvents and purified twice into an absolute: dark, dense and hard to work with, and far from a chocolate bar. It is rich, bitter dark cocoa with roasted coffee and a liqueur-like creaminess, and to some it smells more like tobacco leaf and old leather, with a deep, animal side.", src=["pp_cocoaabs", "fw_cocoa", "pp_lexicon"]),
   "Cacao Resinoid": dict(say="Cacao extracted with solvents from the dry beans and used more or less as it comes, without the absolute's second purification. It is cleaner and more powdery than the absolute: a rich, slightly bitter dark chocolate, closer to cocoa powder than to the denser, leathery absolute.", src=["fw_cocoares", "pp_lexicon"]),
  }),
 "note-almond": dict(vars={
   "Bitter Almond": dict(say="The oil of the bitter almond itself, distilled from the kernels and then cleaned of the poisonous hydrogen cyanide they carry. It is nearly pure benzaldehyde, so it is the almond note at its sharpest and most direct: marzipan and cherry stones, bitter-sweet and piercing, without the milky, toasty softness of a sweet almond accord.", src=["eb_bitteralmond", "pp_benzaldehyde", "pf_benzald"]),
  }),
 "note-smoke": dict(vars={
   "Barbecue Smoke": dict(say="Smoke from the grill rather than from incense or a fire in the woods: charcoal and wood smoke with something savoury in it, char, a hint of grilled meat and the sweetness of caramelised sauce, settling into a dark, resinous warmth. It is an accord built by the perfumer.", src=["pp_bbq", "sb_bbq", "fz_bbq"]),
  }),
}
out("NEW3", S, N)

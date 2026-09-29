from acc import out, SAME
S = {
 "ps_amber": ("https://perfumesociety.org/ingredients-post/amber/", "Amber - The Perfume Society"),
 "fr_amber": ("https://www.fragrantica.com/notes/Amber-54.html", "Amber perfume ingredient, Amber fragrance and essential oils"),
 "fr_whatisamber": ("https://www.fragrantica.com/news/What-Is-Amber-Anyway--1704.html", "What Is Amber Anyway? ~ Fragrance Facts ~ Fragrantica"),
 "fr_amberambergris": ("https://www.fragrantica.com/news/Amber-and-Ambergris-are-Two-Different-Notes-2929.html", "Amber and Ambergris are Two Different Notes ~ Fragrance Facts ~ Fragrantica"),
 "fw_whiteamber": ("https://fraterworks.com/products/white-amber", "White Amber – Fraterworks"),
 "adar_amber": ("https://adarperfumes.com/products/amber-zero-essence-of-dephts", "Amber Zero: Essence of Depths", "ADAR Perfumes"),
 "adar_root": ("https://adarperfumes.com/products/root-code", "Root Code", "ADAR Perfumes"),
 "adar_lignum": ("https://adarperfumes.com/products/lignum-dei-the-wood-of-god-essence-of-hope-micro-batch-77-pieces", "Lignum Dei: The Wood of God", "ADAR Perfumes"),
 "fr_balsamicnotes": ("https://www.fragrantica.com/notes/Balsamic-Notes-1229.html", "Balsamic Notes perfume ingredient, Balsamic Notes fragrance and essential oils"),
 "tg_balsamic": ("https://www.thegoodscentscompany.com/odor/balsamic.html", "balsamic odor type", "The Good Scents Company"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "pw_velvetine": ("https://pinewardperfume.com/products/velvetine", "Velvetine", "Pineward"),
 "sc_siam": ("https://www.scentspiracy.com/fragrance-ingredients/p/benzoin-siam", "Benzoin Siam – Natural Balsamic Ingredient for Perfumery — Scentspiracy"),
 "fw_sumatra": ("https://fraterworks.com/products/benzoin-sumatra-resinoid-50-tec", "Benzoin Sumatra Resinoid 50% TEC – Fraterworks"),
 "wp_benzoin": ("https://en.wikipedia.org/wiki/Benzoin_(resin)", "Benzoin (resin) - Wikipedia"),
 "oz_benzoin": ("https://www.osmoz.com/encyclopedia/raw-materials/balsamic/75/benzoin-styrax-tonkiniensis", "Benzoin (Styrax tonkiniensis)", "Osmoz"),
 "fr_dragon": ("https://www.fragrantica.com/notes/Dragon-Blood-Resin-850.html", "Dragon Blood Resin perfume ingredient, Dragon Blood Resin fragrance and essential oils"),
 "fr_dragonnews": ("https://www.fragrantica.com/news/Mythical-Dragon-Blood-Red-and-Fragrant-15530.html", "Mythical Dragon Blood: Red and Fragrant ~ Raw Materials ~ Fragrantica"),
 "ps_elemi": ("https://perfumesociety.org/ingredients-post/elemi/", "Elemi - The Perfume Society"),
 "fr_elemi": ("https://www.fragrantica.com/notes/Elemi-390.html", "Elemi perfume ingredient, Elemi fragrance and essential oils Canarium luzonicum"),
 "fr_eleminews": ("https://www.fragrantica.com/news/Elemi-The-Lemony-Peppery-Hint-of-the-Sarcophagus-and-More-3868.html", "Elemi: The Lemony-Peppery Hint of the Sarcophagus and More ~ Raw Materials ~ Fragrantica"),
 "fr_olibanum": ("https://www.fragrantica.com/notes/Olibanum-Frankincense-95.html", "Olibanum (Frankincense) perfume ingredient, Olibanum fragrance and essential oils Boswellia"),
 "wp_frank": ("https://en.wikipedia.org/wiki/Frankincense", "Frankincense - Wikipedia"),
 "fw_olibabs": ("https://fraterworks.com/products/olibanum-absolute", "Olibanum Absolute – Fraterworks"),
 "oz_frank": ("https://www.osmoz.com/inspiration/questions-selections/757/what-frankincense-smell-like", "What Does Frankincense Smell Like?", "Osmoz"),
 "at_deity": ("https://ataraxiaperfumery.com/products/deity", "Deity", "Ataraxia Perfumery"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "fr_orthodoxincense": ("https://www.fragrantica.com/news/Eastern-Orthodox-Incense-Reminiscent-Fragrances-21446.html", "Eastern Orthodox Incense Reminiscent Fragrances ~ Fragrance Lists ~ Fragrantica"),
 "fr_churchboard": ("https://www.fragrantica.com/board/viewtopic.php?id=55457", "Catholic Church Incense (Page 1)", "Fragrantica"),
 "fr_labdanum": ("https://www.fragrantica.com/notes/Labdanum-15.html", "Labdanum perfume ingredient, Labdanum fragrance and essential oils Cistus ladanifer"),
 "ps_labdanum": ("https://perfumesociety.org/ingredients-post/labdanum/", "Labdanum - The Perfume Society"),
 "wp_labdanum": ("https://en.wikipedia.org/wiki/Labdanum", "Labdanum - Wikipedia"),
 "sc_labdanumabs": ("https://www.scentspiracy.com/fragrance-ingredients/p/labdanum-absolute-50", "Labdanum Absolute – Natural Ambery Ingredient for Perfumery — Scentspiracy"),
 "la_douleur": ("https://lesabstraits.com/products/la-douleur-exquise", "La Douleur Exquise", "Les Abstraits"),
 "fr_myrrh": ("https://www.fragrantica.com/notes/Myrrh-98.html", "Myrrh perfume ingredient, Myrrh fragrance and essential oils Commiphora myrrha"),
 "fr_myrrhbitter": ("https://www.fragrantica.com/news/Myrrh-Bitter-and-Sweet-Vanilla-and-Mushroom-17460.html", "Myrrh: Bitter and Sweet, Vanilla and Mushroom ~ Raw Materials ~ Fragrantica"),
 "fr_myrrhallure": ("https://www.fragrantica.com/news/The-Mysterious-Allure-of-Myrrh-21896.html", "The Mysterious Allure of Myrrh ~ Raw Materials ~ Fragrantica"),
 "fr_opop": ("https://www.fragrantica.com/notes/Opoponax-37.html", "Opoponax perfume ingredient, Opoponax fragrance and essential oils Commiphora erythraea"),
 "fr_opopnews": ("https://www.fragrantica.com/news/Opoponax-Sweet-Myrrh-2577.html", "Opoponax: Sweet Myrrh ~ Raw Materials ~ Fragrantica"),
 "ps_opop": ("https://perfumesociety.org/ingredients-post/opoponax/", "Opoponax - The Perfume Society"),
 "wp_opop": ("https://en.wikipedia.org/wiki/Opopanax_(perfumery)", "Opopanax (perfumery) - Wikipedia"),
 "fr_peru": ("https://www.fragrantica.com/notes/Peru-Balsam-72.html", "Peru Balsam perfume ingredient, Peru Balsam fragrance and essential oils Myroxylon pereirae"),
 "ps_peru": ("https://perfumesociety.org/ingredients-post/balsam-of-peru/", "Balsam of Peru - The Perfume Society"),
 "wp_peru": ("https://en.wikipedia.org/wiki/Balsam_of_Peru", "Balsam of Peru - Wikipedia"),
 "fr_tolu": ("https://www.fragrantica.com/notes/Tolu-Balsam-71.html", "Tolu Balsam perfume ingredient, Tolu Balsam fragrance and essential oils Myroxylon toluiferum"),
 "ps_tolu": ("https://perfumesociety.org/ingredients-post/balsam-of-tolu/", "Balsam of Tolu - The Perfume Society"),
 "fr_toluperu": ("https://www.fragrantica.com/news/Tolu-Balsam-Peru-Balsam-Plush-Warm-3725.html", "Tolu Balsam & Peru Balsam: Plush & Warm ~ Raw Materials ~ Fragrantica"),
 "nps_ponderosa": ("https://www.nps.gov/brca/learn/nature/ponderosapine.htm", "Ponderosa Pine", "National Park Service"),
 "mn_ponderosa": ("https://www.montananaturalist.org/blog-post/ponderosa-pine-bark-rocky-mountain-aromatherapy/", "Ponderosa Pine Bark: Rocky Mountain Aromatherapy", "Montana Natural History Center"),
 "wp_propolis": ("https://en.wikipedia.org/wiki/Propolis", "Propolis - Wikipedia"),
 "fr_propolis": ("https://www.fragrantica.com/notes/Propolis-1116.html", "Propolis perfume ingredient, Propolis fragrance and essential oils"),
 "fr_beeswaxnews": ("https://www.fragrantica.com/news/Beeswax-in-Perfumes-2737.html", "Beeswax in Perfumes ~ Raw Materials ~ Fragrantica"),
 "fr_resins": ("https://www.fragrantica.com/notes/Resins-317.html", "Resins perfume ingredient, Resins fragrance and essential oils"),
 "wp_resinoid": ("https://en.wikipedia.org/wiki/Resinoid_(perfumery)", "Resinoid (perfumery) - Wikipedia"),
 "tg_resinous": ("https://www.thegoodscentscompany.com/odor/resinous.html", "resinous odor type", "The Good Scents Company"),
 "fr_rum": ("https://www.fragrantica.com/notes/Rum-201.html", "Rum perfume ingredient, Rum fragrance and essential oils"),
 "wp_sandarac": ("https://en.wikipedia.org/wiki/Sandarac", "Sandarac - Wikipedia"),
 "brit_sandarac": ("https://www.britannica.com/topic/sandarac", "Sandarac", "Encyclopedia Britannica"),
 "fr_styraxnews": ("https://www.fragrantica.com/news/Styrax-storax-and-benzoin-17788.html", "Styrax, Storax and Benzoin ~ Raw Materials ~ Fragrantica"),
 "ps_styrax": ("https://perfumesociety.org/ingredients-post/styrax/", "Styrax - The Perfume Society"),
 "wp_storax": ("https://en.wikipedia.org/wiki/Storax_balsam", "Storax balsam - Wikipedia"),
 "fw_styrax": ("https://fraterworks.com/products/styrax-resin-absolute", "Styrax Resin Absolute – Fraterworks"),
 "wp_turp": ("https://en.wikipedia.org/wiki/Turpentine", "Turpentine - Wikipedia"),
 "st_turp": ("https://www.scentree.co/en/Turpentine_oil.html", "ScenTree - Turpentine oil (CAS N° 8006-64-2)"),
 "fr_terpentine": ("https://www.fragrantica.com/notes/Terpentine-1932.html", "Terpentine perfume ingredient, Terpentine fragrance and essential oils"),
 "tb_noneed": ("https://tombstonefragrances.shop/products/no-need-to-come-by-1", "No Need to Come By", "TOMBSTONE"),
}
N = {
 "note-amber": dict(
  say="Not the fossil stone and not ambergris, though it borrows the name. Amber in perfume is an idea built by hand: labdanum, benzoin and vanilla melted together, sometimes with other resins and balsams. It smells warm, sweet and golden, resinous and powdery, soft and a little like caramel, the glow at the base of a whole family of perfumes called ambers or orientals.",
  src=["ps_amber", "fr_whatisamber", "fr_amberambergris", "fr_amber"],
  vars={
   "White Amber": dict(say="A paler amber: the warm accord made lighter and cleaner, with musks and a drier, airier ambery side in place of the full, sticky sweetness of labdanum and vanilla.", src=["fw_whiteamber", "fr_whatisamber", "adar_root"]),
   "Mineral Ambers": dict(say="ADAR's word for the ambers in Amber Zero: not the sweet, resinous amber but a drier, stony, saltier kind, nearer to the ambergris side of the name than to vanilla and labdanum.", src=["adar_amber", "fr_amberambergris"]),
  }),
 "note-balsam": dict(
  say="The sweet, sticky, fragrant resins some trees give when cut: Peru and Tolu balsams, benzoin and styrax among them. Balsamic notes smell warm, soft and sweet, a little like vanilla and cinnamon, resinous and slightly smoky; they sit low in a perfume, round off its edges and make it last.",
  src=["fr_balsamicnotes", "tg_balsamic", "pw_list"]),
 "note-benzoin": dict(
  say="A resin that hardens in tears on the bark of styrax trees in Southeast Asia, from Laos and Thailand to Sumatra. It smells sweet, warm and vanilla-like, balsamic and powdery, with a touch of caramel and a faint cinnamon; it is one of the three pillars of an amber accord, a classic fixative, and is burned in church incense.",
  src=["wp_benzoin", "oz_benzoin", "sc_siam", "fw_sumatra"],
  vars={
   "Siam Benzoin": dict(say="Benzoin from Styrax tonkiniensis of Laos, Thailand and Vietnam, once called Siam. It is the finer, softer kind, rich in vanillin: sweeter and more vanilla-like, less smoky and harsh than benzoin from Sumatra, which carries more cinnamic warmth.", src=["sc_siam", "oz_benzoin", "fw_sumatra"]),
   "Siam": dict(say="Short for Siam benzoin, the benzoin of Laos and Thailand: the softest and most vanilla-like benzoin, less smoky than the Sumatran.", src=["sc_siam", "wp_benzoin"]),
  }),
 "note-dragon-s-blood": dict(
  say="A deep red resin from the fruit of rattan palms and from dragon trees, used for centuries as a dye, a varnish and a medicine. The resin itself smells of very little, so perfumers build it: warm, sweet and resinous, amber-like and a little spicy, with a dark, leathery, smoky edge to match the colour.",
  src=["fr_dragon", "fr_dragonnews", "pw_velvetine"],
  vars={"Dragon’s Blood Resin": dict(same="No change: dragon's blood is a resin; the word only says so.")}),
 "note-elemi": dict(
  say="A soft resin from Canarium trees of the Philippines, used by the Egyptians in embalming. It smells bright and fresh: lemony and peppery at first, then balsamic, a little like frankincense but lighter and greener. It lifts the top of a perfume and bridges citrus into resins.",
  src=["ps_elemi", "fr_elemi", "fr_eleminews"]),
 "note-frankincense": dict(
  say="The gum of Boswellia trees in Somalia, Oman and Ethiopia, burned in temples and churches for thousands of years. Its oil smells fresh and lemony, a little pine-like and peppery, over a dry, balsamic resin; burned, it becomes the cool, smoky, silvery smell of a church. It is the backbone of most incense notes in perfume.",
  src=["fr_olibanum", "wp_frank", "oz_frank"],
  vars={
   "Olibanum": dict(same="No change: olibanum is frankincense's other name, from the Latin."),
   "Olibanum Absolute": dict(say="Frankincense taken with solvents instead of distilled: the absolute keeps the resin's heavier parts, so it is sweeter, deeper and more balsamic, and less sharp and lemony than the oil.", src=["fw_olibabs", "wp_absolute", "at_deity"]),
  }),
 "note-incense": dict(
  say="The smoke of resins and woods burned for their smell, and in a perfume the idea of it. Church incense is mostly frankincense, with myrrh, benzoin and sometimes sandalwood, smouldering on charcoal: dry, smoky and resinous, cool and a little lemony and peppery, stony, like the air in an old church after a service.",
  src=["fr_orthodoxincense", "fr_churchboard", "fr_olibanum"]),
 "note-labdanum": dict(
  say="The sticky resin of the rockrose, a shrub of the dry Mediterranean hills; it was once combed from the beards of goats that had grazed on it. Labdanum smells deep, warm and sweet, ambery and leathery, a little honeyed and animal, like warm skin. It is the heart of amber accords and of the chypre.",
  src=["fr_labdanum", "ps_labdanum", "wp_labdanum"],
  vars={
   "Labdanum Absolute": dict(say="Labdanum taken from its gum with solvents: an absolute, thicker and darker, more amber and caramel-like and more balsamic than the oil distilled from the leaves.", src=["sc_labdanumabs", "wp_absolute", "at_deity"]),
   "Spanish Labdanum": dict(say="Labdanum from Spain, where most of the world's rockrose is now gathered: the classic warm, deep, amber-and-leather labdanum, named for where it comes from.", src=["wp_labdanum", "la_douleur", "sc_labdanumabs"]),
  }),
 "note-myrrh": dict(
  say="The gum of the Commiphora tree of Somalia, Ethiopia and Yemen, one of the three gifts of the Magi, used in incense and embalming. Myrrh is bitter and warm, balsamic and slightly medicinal, with a strange, cool, mushroom-like dampness and a soft sweetness underneath; darker and earthier than frankincense.",
  src=["fr_myrrh", "fr_myrrhbitter", "fr_myrrhallure"],
  vars={
   "Bitter Myrrh": dict(say="True myrrh, named bitter to set it apart from sweet myrrh, which is opoponax: the bitter, medicinal, mushroomy myrrh rather than the sweet, warm one.", src=["fr_myrrhbitter", "fr_opopnews"]),
  }),
 "note-opoponax": dict(
  say="Sweet myrrh: the resin of a myrrh tree of Somalia. It smells warmer, sweeter and softer than myrrh, balsamic and powdery, a little honeyed and slightly animal, round and cosy where myrrh is bitter and cool. It deepens ambers and orientals.",
  src=["fr_opop", "fr_opopnews", "ps_opop", "wp_opop"],
  vars={"Sweet Myrrh": dict(same="No change: sweet myrrh is opoponax's other name.")}),
 "note-peru-balsam": dict(
  say="A thick, dark balsam from a tree of Central America, mostly El Salvador, despite the name. It smells sweet, warm and rich, like vanilla and cinnamon, soft and balsamic; it gives ambers and gourmands a creamy warmth. It is also a well-known allergen, so perfumers use it carefully.",
  src=["fr_peru", "ps_peru", "wp_peru"],
  vars={"Balsam of Peru": dict(same="No change: Peru balsam, written the other way round.")}),
 "note-ponderosa-resin": dict(
  say="The resin of the ponderosa pine of the American West, a tree whose bark smells of vanilla or butterscotch when the sun warms it. Its resin is piney and resinous, with that sweet, vanilla warmth running under it.",
  src=["nps_ponderosa", "mn_ponderosa", "pw_list"]),
 "note-propolis": dict(
  say="Bee glue: the resin bees gather from tree buds and bark and use to seal their hive. It smells resinous and balsamic, warm and a little honeyed and waxy, with the green, sticky smell of poplar buds, the smell of the inside of a hive.",
  src=["wp_propolis", "fr_propolis", "fr_beeswaxnews"]),
 "note-resins": dict(
  say="The whole family of hardened tree saps: frankincense, myrrh, benzoin, labdanum and more. Perfumers extract them with solvents into resinoids. Together they smell warm, sweet and balsamic, a little smoky and sticky; they sit at the base of a perfume, hold it together and make it last.",
  src=["fr_resins", "wp_resinoid", "tg_resinous"],
  vars={
   "Resin": dict(same="No change: resin in the singular."),
   "Smoky Resins": dict(say="ADAR's words for resins with smoke in them, as they smell when burned: drier and darker, closer to incense than to the sweet, balsamic resin.", src=["adar_amber", "fr_resins"]),
  }),
 "note-rum-resin": dict(
  say="Pineward's pairing of rum and resin: rum's sweet, boozy warmth, like molasses and dark sugar, poured over warm, balsamic tree resin, so the resin smells syrupy and a little spirited.",
  src=["pw_list", "fr_rum", "fr_resins"]),
 "note-sandarac": dict(
  say="A pale resin from the sandarac tree, a cypress of Morocco and North Africa, used for centuries in varnish and as incense. It comes in small, pale yellow, dusty tears and is only faintly aromatic: a quiet resin whose smell is compared to balsam.",
  src=["wp_sandarac", "brit_sandarac", "pw_list"],
  vars={"Sandarac Resin": dict(same="No change: sandarac is a resin; the word only says so.")}),
 "note-sawn-resin": dict(
  say="ADAR's picture of resin laid bare when resinous wood is cut: the fresh, sharp, sappy smell of the saw going through, resin and sawdust together.",
  src=["adar_lignum", "fr_resins"]),
 "note-styrax": dict(
  say="The balsam of the sweetgum tree, from Turkey and Central America; not to be confused with benzoin, whose trees share the name. Styrax smells balsamic and sweet, with a smoky, leathery, spicy side and a sharp edge like rubber or cinnamon; it deepens leathers and ambers.",
  src=["fr_styraxnews", "ps_styrax", "wp_storax", "fw_styrax"]),
 "note-tolu-balsam": dict(
  say="A balsam from a tree of Colombia, named after the town of Tolú. It smells sweet and warm, of vanilla and cinnamon, soft, gentler and lighter than its cousin Peru balsam; it rounds out ambers and gourmands.",
  src=["fr_tolu", "ps_tolu", "fr_toluperu"]),
 "note-turpentine": dict(
  say="The oil distilled from pine resin, the painter's solvent. It smells sharp and piney, resinous and bright, cold and a little like a solvent: the smell of an artist's studio or a freshly tapped pine. In perfume it gives a raw, resinous freshness.",
  src=["wp_turp", "st_turp", "fr_terpentine", "tb_noneed"]),
}
out("RES", S, N)

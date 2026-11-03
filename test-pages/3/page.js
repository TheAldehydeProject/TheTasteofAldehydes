/* The site, as it stood on 2026-11-03: every fragrance on it whose source
   divides its notes into top, middle and base, and the Note Library's first
   words on every note they name. A snapshot — see the comment below. */
const DATA = {"accords":[{"c":"CIT","n":"Citrus"},{"c":"ARO","n":"Aromatic & Herbal"},{"c":"GRN","n":"Green"},{"c":"FLO","n":"Floral"},{"c":"FRU","n":"Fruit"},{"c":"SPI","n":"Spice"},{"c":"GOU","n":"Gourmand"},{"c":"BRW","n":"Brews & Spirits"},{"c":"WOO","n":"Woods"},{"c":"CON","n":"Conifers"},{"c":"RES","n":"Resins & Balsams"},{"c":"ANI","n":"Musk, Skin & Animalic"},{"c":"EAR","n":"Earth, Moss & Mineral"},{"c":"AIR","n":"Water & Air"},{"c":"SMK","n":"Smoke & Char"},{"c":"IMP","n":"Impressions"}],"houses":{"adar":"ADAR","ataraxia":"Ataraxia","grande-parfums":"Grande Parfums","les-abstraits":"Les Abstraits","lost-tribe":"Lost Tribe","qimu-musicians":"Qimu & Musicians","tombstone":"Tombstone","lussur":"Lussur","ramon-monegal":"Ramón Monegal","mancera":"Mancera","casa-goa":"Casa Goa","matca":"Matca","jmp-artisan-perfumes":"JMP Artisan Perfumes","areej-le-dore":"Areej Le Doré"},"frags":[{"n":"Amber Zero","h":"adar","t":["Fig Leaf","Ginger","Ozone"],"m":["Saffron","Osmanthus","Mineral Accord"],"b":["Amber","Vetiver","Resins","Ambergris"]},{"n":"Aetherialism","h":"adar","t":["Galbanum","Lime","Violet Leaf","Marine Accord"],"m":["Ylang Ylang","Neroli","Myrrh","Clary Sage"],"b":["Vetiver","Cedarwood","Tonka","Leather"]},{"n":"Incantu","h":"adar","t":["Honeysuckle","Carob Pods","Sea Salt"],"m":["Honey","Tobacco","Candle Wax"],"b":["Amber Oud","Almond","Petrified Driftwood"]},{"n":"α11 Alpha11","h":"adar","t":["Banana","Mint","Saffron"],"m":["Tuberose","Jasmine","Ylang Ylang"],"b":["Tobacco","Incense","Tonka","Civet"]},{"n":"ADHD","h":"adar","t":["Pink Pepper","Yuzu","Quince","Absinthe"],"m":["Saffron","Green Tea Flowers","Cherry","Murumuru Butter","Myrrh"],"b":["Tonka","Maninka"]},{"n":"Root Code","h":"adar","t":["Bergamot","Black Pepper","Pine Needles"],"m":["Petrichor","Clear Orchid","Mineral Accord"],"b":["Patchouli","Rose","Amber","Palo Santo","Oakmoss"]},{"n":"Lignum Dei","h":"adar","t":["Cold Night Air","Frankincense"],"m":["Cedarwood","Sawn Resin","Moss","Rose","Oud"],"b":["Myrrh","Aged Parchment","Skin"]},{"n":"Amaretto Jazz in the Melting Room","h":"ataraxia","t":["Amaretto","Holy Bread"],"m":["Liquor","Amaretto","Honey","Candle Wax"],"b":["Chocolate","Cognac","Almond","Dusty Sofa","Passionflower","Cocoa Butter","Honeycomb","Vanilla","Tobacco"]},{"n":"Deity","h":"ataraxia","t":["Honey","Japanese Plum","Cherry","Chantilly Cream","Goldenberry"],"m":["Condensed Milk","Tobacco","Cocoa Butter","Beeswax","Snowdrops"],"b":["Frankincense","Labdanum","Cacao","Vanilla","Tonka","Amber","Benzoin","Elemi","Myrrh","Gold","Patchouli","Dates","Nectar"]},{"n":"My Doll’s Makeup","h":"ataraxia","t":["Porcelain","Lipstick","Orris","Raspberry","Soda Bubbles"],"m":["Blush","Velvet","Orris","Candle Wax","Chocolate"],"b":["Makeup Palette","Lip Gloss","Eye Pencil","Instant Film","Myrrh"]},{"n":"5 Years Anniversary","h":"grande-parfums","t":["Raspberry","Pink Pepper","Sugar Cane","Cinnamon","Saffron","Clove"],"m":["Chocolate","Ylang Ylang","Cognac","Suede","Honey","Oud","Oak"],"b":["Leather","Musk","Peru Balsam","Tonka","Cedarwood","Labdanum","Vanilla","Benzoin","Tobacco","Honey","Oud","Sandalwood","Vetiver"]},{"n":"Ambresso","h":"grande-parfums","t":["Coffee","Allspice","Myrrh"],"m":["Coffee","Rum","Cognac","Tobacco","Beeswax","Dried Fruits","Myrtle","Rose","Nutmeg","Lily of the Valley","Cedarwood"],"b":["Labdanum","Resins","Benzoin","Amber","Castoreum","Vanilla","Tolu Balsam","Peru Balsam","Patchouli","Guaiac Wood","Tonka","Ambergris","Opoponax","Sandalwood","Musk"]},{"n":"Ancient Oud","h":"grande-parfums","t":["Oud"],"m":["Oud","Benzoin"],"b":["Oud","Musk","CO2 Extracts"]},{"n":"Choco Powder","h":"grande-parfums","t":["Saffron","Cherry","Cacao"],"m":["Chocolate","Osmanthus","Jasmine","Rose"],"b":["Sandalwood","Vanilla","Amberwood"]},{"n":"Cuore","h":"grande-parfums","t":["Incense","Spices","Orris","Red Berries","Clementine","Saffron","Orange"],"m":["Blackberry","Dried Fruits","Blueberry","Liquor","Plum","Plum Blossom","Sugar Cane","Toffee","Lily of the Valley","Strawberry","Myrrh","Fig","Tiare Flower","Cinnamon","Rose","Jasmine","Fir"],"b":["Amber","Tonka","Vanilla","Guaiac Wood","Opoponax","Castoreum","Labdanum","Benzoin","Teak Wood","Cedarwood","Musk","Patchouli"]},{"n":"Dreaming Maldives","h":"grande-parfums","t":["Lemon","Pear","Peach","Pink Pepper"],"m":["Yellow Flowers","Freesia","Caramel","Lily of the Valley"],"b":["Vanilla","Musk","Cedarwood","Myrrh"]},{"n":"Giardino di Sorrento","h":"grande-parfums","t":["Blood Orange","Grapefruit","Lemon"],"m":["Lily of the Valley","Raspberry Leaf","Neroli","Tuberose","Magnolia","Jasmine","Rose"],"b":["Tuberose","Cashmeran","Amber","Patchouli","Tonka","Vanilla","Musk"]},{"n":"Hot Stuff","h":"grande-parfums","t":["Scorched Pineapple","Tobacco"],"m":["Baked Apple"],"b":["Tonka","Vetiver","Oakmoss","Beeswax"]},{"n":"Intimate Spell","h":"grande-parfums","t":["Bergamot","Orange Blossom","Rosemary"],"m":["Clove","Cypriol","Geranium","Cedarwood"],"b":["Patchouli","Vetiver","Musk","Labdanum","Benzoin","Guaiac Wood","Amyris"]},{"n":"Mystical Incense","h":"grande-parfums","t":["Frankincense","CO2 Extracts","Litchi","Sparkling Water"],"m":["Frankincense","Dates","Rose"],"b":["Frankincense","Amber","Musk"]},{"n":"Vanilla Ash","h":"grande-parfums","t":["Brown Sugar","Raspberry Leaf","Spices","Rum"],"m":["Vanilla","Guaiac Wood","Heliotrope","Lily of the Valley"],"b":["Castoreum","Tonka","Vanilla","Fenugreek","Musk","Frankincense"]},{"n":"Vintage Memoir","h":"grande-parfums","t":["Jasmine Tea","Peach","Lemon","Bergamot"],"m":["Orris","Violet Leaf","Jasmine","Ylang Ylang","Geranium","Tuberose","Rose","Carnation","Gardenia"],"b":["Musk","Ambergris","Sandalwood","Clove","Vetiver","Vanilla","Oakmoss","Benzoin","Civet","Patchouli","Tolu Balsam","Tonka","Cedarwood","Labdanum"]},{"n":"White Label","h":"grande-parfums","t":["Orange Blossom","Green Mandarin","Pear","Guava","Ginger","CO2 Extracts"],"m":["Mango","Moroccan Tea","Lily of the Valley","Woody Notes","Raspberry","Orange"],"b":["Musk"]},{"n":"Belle Âme","h":"les-abstraits","t":["Orris","Ginger"],"m":["Cacao","Frankincense","Cardamom"],"b":["Tonka","Musk","Sandalwood"]},{"n":"Des Cendres","h":"les-abstraits","t":["Pine Tar","Galbanum","Birch Tar","Mint","Clove"],"m":["Leather","Violet Leaf","Tuberose"],"b":["Oakmoss","Hyrax","Vetiver","Patchouli"]},{"n":"La Douleur Exquise","h":"les-abstraits","t":["Rose","Orris","Frankincense"],"m":["Clove","Cumin","Saffron"],"b":["Castoreum","Patchouli","Cedarwood","Labdanum","Opoponax","Myrrh"]},{"n":"Philosopher’s Walk","h":"les-abstraits","t":["Bergamot","Lemon","Neroli","Orange Blossom","Pink Pepper","Cardamom","Clove","Cinnamon","Artemisia","Juniper"],"m":["Geranium","Clary Sage","Carnation","Violet","Lavender"],"b":["Cedarmoss","Vetiver","Patchouli","Costus","Musk","Benzoin","Tonka","Vanilla"]},{"n":"Dirty Soda","h":"lost-tribe","t":["Lime","Orange","Bergamot","Pink Pepper"],"m":["Cassia","Coriander","Neroli","Clove"],"b":["Oud","Vanilla","Tonka","Benzoin","Patchouli","Sandalwood","Cedarwood"]},{"n":"Pan’s Labyrinth","h":"lost-tribe","t":["Bergamot","Rose","Powder Accord","Almond","Ambergris"],"m":["Lavender","Coumarin","Rose","Ylang Ylang","Patchouli"],"b":["Sandalwood","Musk","Oud","Oakmoss","Treemoss","Fir","Labdanum","Bakhoor"]},{"n":"Vocal","h":"qimu-musicians","t":["Mint","Lily of the Valley"],"m":["Saffron","Violet"],"b":["Orris","Musk"]},{"n":"3 Feet 5","h":"tombstone","t":["Heliotrope"],"m":["Jasmine","Mimosa"],"b":["Orris","Smoke"]},{"n":"Evergrow","h":"tombstone","t":["Galbanum","Bergamot"],"m":["Rose","Labdanum","Orris"],"b":["Oakmoss","Patchouli","Musk"]},{"n":"No Need to Come By","h":"tombstone","t":["Mint","Thyme","Black Pepper","Turpentine"],"m":["Myrrh","Frankincense","Jasmine"],"b":["Patchouli","Tonka","Sandalwood"]},{"n":"Sing at My Funeral","h":"tombstone","t":["Mint","Honey","Neroli"],"m":["Jasmine","Lily of the Valley","Orris"],"b":[]},{"n":"Sweet Coffin","h":"tombstone","t":["Willow Bark","Apricot"],"m":["Moldy Cedarwood","Nutmeg"],"b":["Dead Water"]},{"n":"CV99","h":"lussur","t":["Balsamic Vinegar","Cherry","Citrus","Milk"],"m":["Cinnamon","Clove","Black Pepper"],"b":["Woody Notes","Caramel","Smoke","Oak"]},{"n":"Flamenco EDP","h":"ramon-monegal","t":["Raspberry","Apple","Violet","Orange Blossom"],"m":["Rose","Jasmine","Orris"],"b":["Cedarwood","Cypress","Amber","Pine"]},{"n":"French Riviera","h":"mancera","t":["Lemon","Orange","Tangerine","Ginger","Black Pepper"],"m":["Marine Accord","Tiare Flower","Pine","Mimosa","Vetiver"],"b":["Sea Salt","Musk","Amber"]},{"n":"Velvet Fog","h":"casa-goa","t":["Neroli"],"m":["Lavender","Ylang Ylang"],"b":["Orris","Vetiver","Sandalwood","Honey"]},{"n":"House of Ellixirz","h":"matca","t":["Lemon","Petitgrain"],"m":["Cassia","Rose"],"b":["Cypriol","Tobacco","Leather","Birch Tar","Vanilla","Caramel"]},{"n":"Fir of the Light","h":"jmp-artisan-perfumes","t":["Spruce","Incense","Orange","Lemon","Black Pepper"],"m":["Cedarwood","Papyrus","Cashmeran","Nutmeg","Sage"],"b":["Fir","Incense","Woody Notes","Oakmoss","Ambergris"]},{"n":"Fir of the Dark","h":"jmp-artisan-perfumes","t":["Incense","Spruce","Black Pepper","Cypress","Galbanum"],"m":["Incense","Cedarwood","Leather","Sage"],"b":["Fir","Cade Oil","Vetiver","Oakmoss"]},{"n":"Forbidden Flower","h":"areej-le-dore","t":["Skunk Oil","Grapefruit","Cannabis"],"m":["Jasmine","Night Blooming Jasmine","Sandalwood"],"b":["Patchouli","Cedarwood","Benzoin","Vetiver","Turmeric","Vanilla","Ginger","Coriander","Lime"]}],"notes":{"Fig Leaf":["GRN","Not the fruit but the tree: the big, rough leaves and their milky sap. It smells green and a little bitter at first, then soft and creamy, almost coconut-like and gently sweet, with a faint woodiness from the sun-warmed branches."],"Ginger":["SPI","The knobbly root: warm but fresh, spicy and bracing, almost nose-tingling, with a lemony brightness at the top and a sweet, woody, almost balsamic depth."],"Ozone":["AIR","The smell of the air after a storm, or of washing dried in the wind: fresh, sharp, clean and a little metallic."],"Saffron":["SPI","The red threads of the crocus, the costliest spice in the world."],"Osmanthus":["FLO","A tiny apricot-coloured flower from China, where it scents tea. Its absolute is fruity and leathery at once: ripe apricot and peach skin, honeyed petals and a suggestion of suede, with a tea-like softness and a violet sweetness."],"Mineral Accord":["EAR","The smell of stone, an impression built from several materials rather than from rock: flint struck against steel, wet slate, sea salt, hot rocks, chalk. It feels cool, clean and a little metallic, and makes a perfume seem clear."],"Amber":["RES","Not the fossil stone and not ambergris, though it borrows the name. Amber in perfume is an idea built by hand: labdanum, benzoin and vanilla melted together, sometimes with other resins and balsams."],"Vetiver":["WOO","The long, tangled roots of an Indian grass, distilled into one of perfumery's great materials: earthy and woody, smoky and a little green, like damp soil and roots, cool and deep."],"Resins":["RES","The whole family of hardened tree saps: frankincense, myrrh, benzoin, labdanum and more. Perfumers extract them with solvents into resinoids."],"Ambergris":["ANI","A waxy lump made in the gut of the sperm whale, around the beaks of the squid it eats, then cast out to float on the sea for years before it washes up on a beach."],"Galbanum":["GRN","A sticky gum from a giant fennel-like plant of Iran, and the greenest material in perfumery."],"Lime":["CIT","Greener, sharper and more bitter than lemon, with a sherbet fizz."],"Violet Leaf":["GRN","The heart-shaped leaves of the violet, not its flowers, and they smell completely different: intensely green, cool and watery, strikingly like cucumber, with a slightly metallic edge and a faint flower underneath."],"Marine Accord":["AIR","The sea as a perfume: salt spray, wind, seaweed, wet rocks and driftwood, built from marine molecules like Calone with salt, mineral and algae notes."],"Ylang Ylang":["FLO","The drooping, star-shaped yellow flower of a tree from the Philippines and Indonesia, distilled in stages into different grades, the first and finest the fruitiest."],"Neroli":["FLO","The white blossom of the bitter orange, distilled with steam. It is fresh, green and a little bitter, citrusy and honeyed at once, clean and faintly soapy, with a touch of something metallic."],"Myrrh":["RES","The gum of the Commiphora tree of Somalia, Ethiopia and Yemen, one of the three gifts of the Magi, used in incense and embalming."],"Clary Sage":["ARO","A tall sage with pale purple flowers, and softer and sweeter than kitchen sage: herbal and a little like lavender, but with a warm, musky, amber-like depth and a wine-like, hay-and-tobacco richness underneath."],"Cedarwood":["WOO","The wood of pencils and cedar chests: dry, clean and woody, like pencil shavings, with a resinous, slightly smoky warmth."],"Tonka":["GOU","A black, wrinkled bean from South America, almost nine tenths of whose absolute is coumarin."],"Leather":["ANI","There is no leather oil to take: a leather note is always built, from materials that smell of tanned hide."],"Honeysuckle":["FLO","The climbing hedgerow flower whose smell pours out on summer evenings: sweet and nectar-like, heady, a little like jasmine tinged with vanilla and honey, with a green freshness and a hint of pollen."],"Carob Pods":["GOU","The long brown pods of the carob tree, sweet enough to be used as a chocolate substitute. They smell cocoa-like and date-like, sweet and a little dusty, fruity and faintly earthy. It is a rare note in perfume."],"Sea Salt":["AIR","Salt itself has no smell; in perfume it is an effect, built to give the feel of salt on warm skin or in the sea air. It makes the notes near it brighter, as salt does sweetness, and often sits with ambrette and seaweed."],"Honey":["GOU","Sweet, thick and golden, and more complicated than it seems: floral and waxy, with warm tobacco and even a little chocolate, and underneath an animal, almost urine-like edge that some noses catch more than others."],"Tobacco":["GOU","Dried, cured tobacco leaf, not smoke. In a perfume it is warm, sweet and honeyed, like hay, dried fruit and tea, with a little leather, cocoa and flowers: more like a humidor or a pouch of pipe tobacco than an ashtray."],"Candle Wax":["IMP","The smell of a candle, lit or just blown out: warm, soft and waxy, a little sweet, with a thread of smoke. Beeswax brings honey, hay and a golden amber warmth; paraffin, a plainer, dustier melted wax."],"Amber Oud":["WOO","Oud wrapped in amber: the dark, woody, sometimes animal smell of agarwood made sweeter and warmer by an ambery, resinous, vanilla-soft base."],"Almond":["GOU","Sweet and bitter at once, soft and nutty: the smell of marzipan, amaretto and cherry stones. Most of it is benzaldehyde, a molecule that is nearly all of bitter almond oil and that almonds share with cherries and peach kernels."],"Petrified Driftwood":["WOO","Wood washed by the sea until it is bleached and hard as stone: a dry, woody note with a salty, mineral, seaside edge, the smell of a beach where the wind carries salt, with none of the tropics in it."],"Banana":["FRU","Ripe banana, sweet and creamy, and a note that swings between fruit and sweets."],"Mint":["ARO","Cool, sharp and green: a crushed sprig from the garden. It can lean towards peppermint's icy bite, spearmint's softer sweetness, or a darker, more herbal wild mint."],"Tuberose":["FLO","The most voluptuous white flower of all: a few stems can fill a room for days."],"Jasmine":["FLO","The great white flower of perfumery, picked by hand at dawn."],"Incense":["RES","The smoke of resins and woods burned for their smell, and in a perfume the idea of it."],"Civet":["ANI","A secretion of the civet cat, once gathered for perfume and now replaced by civetone, the molecule that gives it most of its smell."],"Pink Pepper":["SPI","Not a true pepper but the pink berries of a South American tree. It is sparkling rather than hot: fresh and fruity, a little citrusy, with a rosy, woody sweetness, quite different from the tingle of black pepper."],"Yuzu":["CIT","A Japanese citrus used for its peel, and it smells like several citruses at once: the bitter side of grapefruit, lime, bergamot and a little mandarin."],"Quince":["FRU","A hard, golden fruit, a cousin of apple and pear. Its smell sits between apple and pear, aromatic, a little sour and dry, with pineapple and a faint rose in it."],"Absinthe":["BRW","The green spirit of fin-de-siècle Paris, made from wormwood, anise, fennel and other herbs."],"Green Tea Flowers":["FLO","The small white flowers of the tea plant itself, a camellia."],"Cherry":["FRU","Sweet and tart at once, with a bitter-almond edge, because cherry and almond are cousins and share benzaldehyde, the molecule of marzipan. As a note it can be fresh and juicy, or dark, syrupy and liqueur-like."],"Murumuru Butter":["GOU","A butter pressed from the seeds of a spiny Amazonian palm, used in skin care. Refined, it smells of almost nothing; the virgin butter is gently nutty, a little like coconut oil. As a note it is soft, creamy and skin-like."],"Maninka":["FRU","The fruit of a wild tree of the West African savannah, also called tallow plum or sweet detar, eaten fresh or dried across the Sahel."],"Bergamot":["CIT","A small, knobbly citrus, somewhere between a lemon and a bitter orange, grown almost entirely on the coast of Calabria, the toe of Italy."],"Black Pepper":["SPI","Freshly cracked peppercorns: hot and fresh, dry and woody, almost tingling to sniff, with a citrusy lift."],"Pine Needles":["CON","The needles rather than the wood: green, sharp and fresh, resinous and a little citrusy, like needles crushed on a forest path. It is the brightest, most outdoor side of the pine."],"Petrichor":["EAR","The smell of rain on dry ground, named in 1964 from the Greek for stone and the blood of the gods."],"Clear Orchid":["FLO","ADAR's own name for an orchid made sheer."],"Patchouli":["WOO","The leaves of a bushy mint-family plant from Southeast Asia, dried and distilled. Patchouli is earthy and woody, dark and damp like a forest floor, sweet and balsamic, a little camphorous and chocolatey, and very long-lasting."],"Rose":["FLO","The queen of perfumery and, with jasmine, one of its two pillars. Rose is a whole world: fresh petals at dawn, cool and dewy and a little lemony, or a heavy bouquet in a warm room, honeyed, jammy and spicy."],"Palo Santo":["SMK","The wood of Bursera graveolens, a tree of South America's dry coasts, whose name means holy wood, burned to clear a room."],"Oakmoss":["EAR","Not a moss but a lichen, Evernia prunastri, that grows on oaks in the mountain forests of Europe and North Africa."],"Cold Night Air":["AIR","ADAR's picture of stepping outside on a cold night: the air sharp, clean and almost without smell."],"Frankincense":["RES","The gum of Boswellia trees in Somalia, Oman and Ethiopia, burned in temples and churches for thousands of years."],"Sawn Resin":["RES","ADAR's picture of resin laid bare when resinous wood is cut: the fresh, sharp, sappy smell of the saw going through, resin and sawdust together."],"Moss":["EAR","Moss as the forest floor smells of it: damp, green, earthy and inky-bitter, cool under old trees after rain."],"Oud":["WOO","Agarwood: the dark, resin-soaked heartwood of the aquilaria tree of South and Southeast Asia, formed only when the tree is infected and defends itself."],"Aged Parchment":["IMP","The smell of old writing skin and old paper, as in an archive: dry, dusty and faintly sweet, with a leathery edge."],"Skin":["ANI","The smell of clean, warm skin, built rather than taken from anywhere: soft musks above all, sometimes with ambergris, a trace of powder, and a little sweetness like a lotion."],"Amaretto":["BRW","The Italian liqueur, bitter by name but sweet in fact, made with apricot kernels for their almond taste."],"Holy Bread":["GOU","Prosphora, the bread of the Orthodox communion: a small leavened loaf of just white flour, water, yeast and salt, made in two layers and stamped with a cross before it is baked, with prayer."],"Liquor":["BRW","The general idea of a spirit or liqueur: the warm, aromatic sting of alcohol, sometimes dark and mellow like aged spirits in oak, sometimes sharp and sweet like a fruit liqueur."],"Chocolate":["GOU","Chocolate is built in perfume more often than extracted, since cocoa absolute is costly and subtle."],"Cognac":["BRW","The French brandy, aged in oak: warm, golden and smooth, with a honeyed sweetness, dried fruit like prunes and raisins, a touch of candied orange peel, and the dry, tannic wood of the barrel."],"Dusty Sofa":["IMP","Ataraxia's picture, in Amaretto Jazz in the Melting Room, of an old upholstered sofa: worn fabric, dust, and the warmth of the room around it. It is an impression, built from dusty and powdery notes, soft, stale and comfortable."],"Passionflower":["FLO","The extraordinary purple flower of the passion-fruit vine. Its smell is delicate, sweet and fruity, tropical and a little like grapes, with a green, dewy freshness of cut stems."],"Cocoa Butter":["GOU","The pale fat pressed from cocoa beans, the base of white chocolate and of many skin creams."],"Honeycomb":["GOU","Honey still in its wax cells. It smells of honey and beeswax together: sweet and golden, waxy, with hay, a little pollen and a softly animal warmth, a whole hive rather than a jar."],"Vanilla":["GOU","The cured pod of a climbing orchid, and the most loved note in perfumery. Real vanilla absolute is dark and rich: sweet and creamy, but also smoky, woody, boozy and a little animal, opening dark and settling powdery and soft."],"Japanese Plum":["FRU","Here the loquat, the small orange fruit also called Japanese plum, grown in Japan for over a thousand years."],"Chantilly Cream":["GOU","Crème Chantilly: cream whipped with sugar and vanilla. As a note it is creamy, sweet and vanilla-soft, a little powdery, and above all airy: dessert that feels light rather than heavy."],"Goldenberry":["FRU","The small orange fruit in a papery husk, also called cape gooseberry or physalis. It tastes and smells sweet and tart together, tangy and tropical, like cherry tomato crossed with pineapple, mango and a touch of vanilla."],"Condensed Milk":["GOU","Milk cooked down with sugar until thick: sweet, gooey and warm, creamy and syrupy, with a caramelised edge."],"Beeswax":["GOU","The wax of the honeycomb, extracted: honeyed and sweet, warm and softly animal, with hay, tobacco and a little pollen in it, like a candle of real beeswax."],"Snowdrops":["FLO","The small, nodding white flowers that come up through the snow at the very end of winter. Up close, and especially in a large drift, they give off a faint, sweet honey smell, the nectar they make for the first bees."],"Labdanum":["RES","The sticky resin of the rockrose, a shrub of the dry Mediterranean hills; it was once combed from the beards of goats that had grazed on it."],"Cacao":["GOU","The bean chocolate is made from, roasted and ground."],"Benzoin":["RES","A resin that hardens in tears on the bark of styrax trees in Southeast Asia, from Laos and Thailand to Sumatra."],"Elemi":["RES","A soft resin from Canarium trees of the Philippines, used by the Egyptians in embalming. It smells bright and fresh: lemony and peppery at first, then balsamic, a little like frankincense but lighter and greener."],"Gold":["IMP","Gold has no smell; it is an idea perfumers chase. They give the feeling of it with yellow flowers, benzoin, white or pink pepper, rose and bergamot, and with metallic materials that seem smooth, shiny and cool."],"Dates":["FRU","The fruit of the date palm, from the Middle East, sweet as candy. As a note it is a fantasy, rich and fruity-sweet, with caramel, honey and a buttery softness, like a date split open."],"Nectar":["FLO","The sugary liquid flowers make to draw in bees, imagined as a smell: sweet, thick and a little sticky, like runny honey or syrup, with a jammy richness and a floral softness around it."],"Porcelain":["IMP","The smell of cold white china, which in perfume is a mineral, clay-like note: cool, clean and faintly like damp plaster, sometimes powdery."],"Lipstick":["IMP","The smell of old-fashioned lipstick, which was scented with rose, violet and iris: in perfume an undefined, powdery, red-purple floral in which you cannot quite pick out the rose or the violet, with something waxy and creamy under it."],"Orris":["FLO","The root of the iris, not its flower: dug up, dried and stored for three years or more while its scent slowly develops, then ground and distilled."],"Raspberry":["FRU","A raspberry crushed: sweet, tart and jammy, with a soft, powdery, slightly woody side."],"Soda Bubbles":["BRW","Fizz rather than a flavour: the prickle of bubbles rising from a glass of soda. Perfumers make it with sparkling aldehydes and airy musks, and it makes the top of a perfume feel effervescent and tingly."],"Blush":["IMP","No house page says what goes into it; it is one of the cosmetic notes Fragrantica lists for Ataraxia's My Doll's Makeup, named for the pressed powder brushed on the cheeks."],"Velvet":["IMP","A texture rather than a smell: the soft, heavy, plush feel of velvet, given by soft musks, powdery flowers and warm woods, like cashmeran, a molecule said to smell of cashmere wool."],"Makeup Palette":["IMP","No house page says what goes into it; it is one of the cosmetic notes Fragrantica lists for Ataraxia's My Doll's Makeup, named for an open palette of powders and colours."],"Lip Gloss":["IMP","The smell of lip gloss: sweet and sugary, candyfloss, cherry, peach or vanilla, over something waxy and slick."],"Eye Pencil":["IMP","No house page says what goes into it; it is one of the cosmetic notes Fragrantica lists for Ataraxia's My Doll's Makeup, named for the kohl or eyeliner pencil: the dry, woody smell of a cedar pencil being sharpened, with the waxy, powdery softness of the makeup inside it."],"Instant Film":["IMP","The smell of a Polaroid as it comes out of the camera and the picture appears: a fantasy note, chemical and a little metallic from the developing paste, with a plastic note from the frame and a faint, almost vanilla sweetness."],"Sugar Cane":["GRN","The tall grass sugar comes from."],"Cinnamon":["SPI","The rolled bark of the cinnamon tree: warm, sweet and spicy, with a hot red bite and a soft, woody sweetness, the smell of baking and mulled wine."],"Clove":["SPI","The dried flower buds of the clove tree: intensely warm and spicy, sweet and woody, a little medicinal, one of the most powerful natural materials a perfumer has."],"Suede":["ANI","Leather made soft: an accord built by perfumers to smell of the brushed, velvety underside of hide rather than a polished or smoky one."],"Oak":["WOO","The great hardwood of forests and barrels: dry, woody and grounding, a little sharp and sour, with a soft hint of vanilla and dried fruit from its aged wood."],"Musk":["ANI","Once the dried gland of the male musk deer, the most precious raw material perfumery had, and banned since the deer was protected in 1979; now almost always made in the laboratory."],"Peru Balsam":["RES","A thick, dark balsam from a tree of Central America, mostly El Salvador, despite the name. It smells sweet, warm and rich, like vanilla and cinnamon, soft and balsamic; it gives ambers and gourmands a creamy warmth."],"Sandalwood":["WOO","The heartwood of a slow-growing tree, sacred in India. Its oil is creamy, milky and soft, sweet and warm, rich and smooth, the smoothest wood there is."],"Coffee":["BRW","Freshly roasted, freshly ground coffee: dark, roasted and bitter, nutty and a little chocolatey, oily and rich, like opening a bag of beans."],"Allspice":["SPI","The dried berry of a Jamaican tree, named because it smells like several spices at once: cinnamon, clove and nutmeg together, sweet and dry, warm and a little peppery."],"Rum":["BRW","The spirit of the sugar cane: warm cane sugar and dark molasses, oak barrels and a sweet heat, sometimes with vanilla, clove, ginger or ripe fruit in it."],"Dried Fruits":["FRU","Fruit dried in the sun until it is dark and sticky: dates, figs, prunes, apricots and raisins. It smells sweet, deep and chewy, a little like liquorice and brandy, less fresh and more concentrated than fresh fruit."],"Myrtle":["ARO","A Mediterranean shrub with glossy, fragrant leaves, sacred to Venus. Its oil is fresh and bright: green, camphorous and a little like eucalyptus, with a lemony, piney sharpness and a faint floral, fruity sweetness underneath."],"Nutmeg":["SPI","The seed of a tropical tree, grated over custard and eggnog. Its oil is fresh and warm at once: a light, piney top, then a sweet-spicy, woody heart, a little nutty and lemony."],"Lily of the Valley":["FLO","The tiny white bells of May, lucky charms in France. Their smell is fresh, green and dewy, clean and delicate: cool morning air, snapped green stems, a wet garden on a warm spring morning, with a faint sweetness."],"Castoreum":["ANI","A secretion of the beaver, which it uses to mark its territory, once taken for perfume and now nearly always rebuilt from other materials."],"Tolu Balsam":["RES","A balsam from a tree of Colombia, named after the town of Tolú. It smells sweet and warm, of vanilla and cinnamon, soft, gentler and lighter than its cousin Peru balsam; it rounds out ambers and gourmands."],"Guaiac Wood":["WOO","The wood of a South American tree, distilled into a thick oil: smoky and woody, like a campfire or incense, but mellow, round and sweet, with balsamic, rosy, vanilla and tobacco facets and a tarry, leathery edge."],"Opoponax":["RES","Sweet myrrh: the resin of a myrrh tree of Somalia. It smells warmer, sweeter and softer than myrrh, balsamic and powdery, a little honeyed and slightly animal, round and cosy where myrrh is bitter and cool."],"CO2 Extracts":["IMP","Not a smell but a way of taking one: carbon dioxide, pressed until it behaves like a liquid, washes the smell out of a plant at low temperature and then simply evaporates, leaving no solvent behind."],"Amberwood":["WOO","Not a tree but a family of modern synthetic woody-ambers, the best known sold as Amberwood or Boisambrene."],"Spices":["SPI","No single spice: a blend of them, which can be warm, like cinnamon, clove, nutmeg and pepper, or fresh, like ginger, coriander and cardamom. Warm spices make a perfume cosy and rich; fresh ones make it bright and tingling."],"Red Berries":["FRU","No single berry: strawberries, raspberries, cherries and cranberries together, tangy and sweet, bright and fruity. It is a general red-fruit note, and depending on the perfume it can be fresh and crisp or syrupy."],"Clementine":["CIT","A small, seedless mandarin, the Christmas mandarin, and its note smells like peeling one: sweet, juicy and soft, hardly bitter at all."],"Orange":["CIT","Sweet orange: the peel of the everyday orange, pressed. It smells sweet, juicy, fresh and tangy, exactly like an orange being peeled: cheerful and round, less bitter than bitter orange and warmer than lemon."],"Blackberry":["FRU","The bramble fruit of late summer hedgerows: tangy and sweet at once, juicy, a little sour when not quite ripe, with a faint floral and musky side."],"Blueberry":["FRU","Small blue berries, and a note that can be refreshing and gently sweet or thick and jammy: tart and fruity with a creamy, almost vanilla softness, sometimes smelling more of blueberry muffins and pie than of the fruit."],"Plum":["FRU","The dark stone fruit, and one of perfumery's old secrets, part of the classic bases of the early twentieth century."],"Plum Blossom":["FLO","The pale blossom of the Asian plum, ume, which flowers in late winter and announces spring in Japan and China."],"Toffee":["GOU","Sugar and butter boiled until hard and glossy: sweet and buttery, with burnt sugar and a slightly smoky edge, rich and chewy, between caramel and condensed milk. It is gourmand comfort, like caramel popcorn."],"Strawberry":["FRU","Sweet, jammy, a little green and a little creamy: the strawberry is built from a handful of molecules, above all furaneol, which smells of strawberry when dilute and of caramel when strong."],"Fig":["FRU","The ripe fruit rather than the leaf: golden skin warmed by the sun, a honeyed, jammy lushness, between fruity and green. The fig tree's milky sap gives it a soft, creamy, coconut-like side, rebuilt by perfumers with lactones."],"Tiare Flower":["FLO","The Tahitian gardenia, symbol of Tahiti, soaked in coconut oil to make monoi. It is heady and intensely sweet, creamy and tropical, close to gardenia and tuberose but greener and more watery-fresh."],"Fir":["CON","The Christmas tree of Europe and North America: soft needles and sticky resin."],"Teak Wood":["WOO","The dense tropical wood of boat decks and garden furniture. As a note it is a 'blond' woody fantasy, warm and a little smoky, with an old-leather side from the wood's resin. It is built by the perfumer."],"Lemon":["CIT","Pressed cold from the peel, so it smells like the fruit's fresh zest: sharp, sour, clean and sparkling, with a sweet, almost sherbet brightness."],"Pear":["FRU","Juicy, sweet and watery, like apple but softer and less crisp."],"Peach":["FRU","A ripe peach warmed by the sun: sweet, juicy and velvety, creamy, with a touch of coconut."],"Yellow Flowers":["FLO","Flowers that are literally yellow, ylang-ylang, mimosa, narcissus, frangipani, used together: sweet, waxy and a little heady, with a powdery, pollen-like softness and a sunny, optimistic brightness."],"Freesia":["FLO","A florist's favourite, and a flower whose real smell has never been caught in a bottle: every freesia in perfume is a reconstruction."],"Caramel":["GOU","Sugar heated until it turns golden and brown: warm, sweet and a little burnt, toffee-like and comforting."],"Blood Orange":["CIT","A sweet orange whose flesh has turned red. It smells like orange made deeper and sweeter and less sharp, with a juicy, berry-like tartness that people often call a hint of raspberry."],"Grapefruit":["CIT","Tart, bitter and juicy, like the fruit cut open."],"Raspberry Leaf":["GRN","Nothing like the berry: the leaf smells of the forest floor rather than of sweets."],"Magnolia":["FLO","The big, creamy flowers of the magnolia tree. They smell softly floral and creamy-sweet, a little like jasmine but lighter, with a bright, fresh lemony edge, a hint of honey and sometimes something faintly salty."],"Cashmeran":["WOO","A synthetic molecule named for the feel of cashmere: musky and woody at once, dry and 'woolly' like a new jumper, powdery and a little spicy and piney, with a clean, sun-warmed, skin-like saltiness."],"Scorched Pineapple":["FRU","Pineapple roasted until its sugars catch and darken: still juicy and tangy, but deeper, caramelised and a little smoky, fruit on the edge of burning."],"Baked Apple":["GOU","Apple warmed in an oven until it softens and its sugars caramelise, usually with cinnamon, clove or vanilla beside it. It smells cosy and dessert-like, sweet and juicy with a buttery, spiced warmth: autumn and a festive kitchen."],"Orange Blossom":["FLO","The same white blossom as neroli, but taken with solvents rather than steam, so it smells richer, sweeter, warmer and headier: honeyed and heady, with a jasmine-like, slightly animal depth."],"Rosemary":["ARO","The needle-leaved Mediterranean herb: aromatic, pungent and camphorous, a little minty and lavender-like, clean and sharp."],"Cypriol":["WOO","The root of an Indian sedge, nagarmotha, and a chameleon: spicy at first, like cinnamon, then earthy and green like vetiver, then woody like cedar, with a smoky breath of frankincense and campfire."],"Geranium":["FLO","Not the red balcony plant but the rose geranium, whose leaves are distilled. It smells like rose with a green, minty, lemony twist and none of the powder: fresh, fruity and a little sharp."],"Amyris":["WOO","The oil of a small Caribbean tree, often called West Indian sandalwood though it is no sandalwood at all."],"Litchi":["FRU","Lychee: under a rough pink shell, white, juicy flesh that smells like a very juicy grape with a delicate rose note."],"Sparkling Water":["BRW","Water with bubbles in it: clean, cold and fizzy, with a faint mineral sharpness. As a note it is an effect, made with aldehydes and musks, and it gives a perfume a bright, prickling, effervescent freshness."],"Brown Sugar":["GOU","Sugar with some of its molasses left in: rich, soft and caramel-like, a little boozy and treacly, sweeter and deeper than white sugar. It can read as caramel, maple syrup or breakfast pancakes, and it warms gourmand perfumes."],"Heliotrope":["FLO","A small purple flower whose smell is sweet and powdery, like almond, vanilla and a little cherry: marzipan, meringue, a soft cloud."],"Fenugreek":["SPI","Small golden seeds used in curries, and a smell that changes with strength: strong it is savoury, like curry; diluted it turns sweet, nutty and like maple syrup and burnt sugar. Both come from one molecule, sotolon."],"Jasmine Tea":["BRW","Green tea scented with jasmine flowers, usually jasmine sambac. It smells of green, slightly bitter, astringent tea with a sweet, fresh jasmine floating over it, delicate and comforting, like steam from a cup."],"Carnation":["FLO","The frilly pink of buttonholes, and a floral that smells of spice: clove above all, peppery and warm, over a soft rosy flower. That clove is literal, since carnation and clove share their main molecule, eugenol."],"Gardenia":["FLO","A creamy white flower with glossy leaves, and one of the most intoxicating smells in a garden: rich and buttery, but also green, dewy and almost cool, with strange mushroomy and even cheesy facets up close."],"Green Mandarin":["CIT","Mandarin pressed while the fruit is still green and unripe: sharper, tarter and leafier than the sweet, candied smell of ripe mandarin, with a floral hint. It is the smell left on your hands after peeling one."],"Guava":["FRU","The pink-fleshed tropical fruit. As a note it is lush, sweet and juicy, with a bittersweet, lemony tang and sometimes the dry, slightly musky smell of its thick skin."],"Mango":["FRU","The tropical fruit: juicy and sweet, with hints of peach and plum and a lush, green, slightly peppery edge from the skin. It gives fruity florals an exotic, sunny ripeness."],"Moroccan Tea":["BRW","North African mint tea: gunpowder green tea brewed with spearmint and plenty of sugar. It smells fresh, green and minty, sweet and a little tannic, clean and refreshing."],"Woody Notes":["WOO","No single wood: the whole family of them, from cedar and sandalwood to vetiver, patchouli and oud."],"Cardamom":["SPI","The green pods of chai and Scandinavian buns. Its oil opens cool and fresh, a little like eucalyptus and mint, then turns warm, sweet and aromatic, spicy with a soft balsamic and floral finish."],"Pine Tar":["SMK","Tar made from pine wood, dark and sticky, once painted on boats and ropes to keep the water out. It smells resinous, smoky and balsamic, like hot pine resin and burnt wood, sweeter and more piney than birch tar's leather."],"Birch Tar":["SMK","A thick, black tar made by heating birch bark without air, used for thousands of years as a glue and to cure leather."],"Hyrax":["ANI","Africa stone: the droppings of the rock hyrax, a small animal of Africa, hardened and aged into stone, and collected without harm."],"Cumin":["SPI","The earthy spice of curries, and perfumery's most divisive one. It is sharp, green and pungent at first, then warm and resinous, and then unmistakably like skin and sweat: an intimate, animal warmth."],"Artemisia":["ARO","The wormwood family of silvery, bitter herbs, and in perfumery most often armoise, the oil of a wild Mediterranean artemisia."],"Juniper":["CON","The shrubby conifer, its wood and needles as well as its berries: fresh, balsamic and piney, sappy and a little bitter, with a gin-like brightness and a dry woody side."],"Violet":["FLO","The small purple flower of spring, and the sweetest, most powdery floral there is: soft and romantic, airy and dewy, like old-fashioned sweets and face powder, a little like iris."],"Lavender":["ARO","The purple flower of Provence, and the backbone of fougères and barbershop perfumes."],"Cedarmoss":["EAR","Lichen gathered from cedar trees, mostly tree moss with some beard lichen, and sold as an absolute from Morocco."],"Costus":["ANI","A root whose oil smells like unwashed hair: a scalp warmed by the sun, a cat's fur, a wet dog, a goat. Under that animal warmth it is soft and powdery like orris root, creamy and fatty, even a little like violets at first."],"Cassia":["SPI","Chinese cinnamon, the bark most 'cinnamon' in shops really is."],"Coriander":["SPI","The seed, not the leaf: coriander seed oil is mostly linalool, so it smells clean, soft and elegant, peppery and woody at first, then warmly floral, almost sweet like a sweet shop."],"Powder Accord":["IMP","An accord of cosmetic powder, the face powder and talc of a dressing table."],"Coumarin":["GOU","The molecule that smells of fresh hay and tonka beans, first found in tonka and first made in a lab in 1868. It is sweet and warm, like hay drying in the sun and like almond and vanilla, and its character shifts with the dose."],"Treemoss":["EAR","Pseudevernia furfuracea, a lichen that grows on the bark of firs and pines and is gathered in quantity for French perfumery."],"Bakhoor":["RES","Arabic for incense: chips of agarwood or sandalwood soaked in fragrant oils and resins, often rose, bound with honey or sugar syrup and left to cure for weeks, then heated on charcoal in a burner, the mabkhara, so that the perfumed smoke can be passed through clothes, hair and the rooms of a home."],"Mimosa":["FLO","The fluffy yellow pompom flowers of the silver wattle, a sign of the end of winter in the south of France."],"Smoke":["SMK","Smoke is not one thing: wood smoke, incense, tobacco and tar all smell different, and perfumers build each from smoky materials, birch and cade tars made by heating wood, guaiacol, syringol and other phenols, vetiver and guaiac wood."],"Thyme":["ARO","The small-leaved herb of Mediterranean hillsides. Its smell is strong and rich: herbal and spicy, sharply medicinal, warm, and in a perfume surprisingly leathery."],"Turpentine":["RES","The oil distilled from pine resin, the painter's solvent. It smells sharp and piney, resinous and bright, cold and a little like a solvent: the smell of an artist's studio or a freshly tapped pine."],"Willow Bark":["WOO","The bark of the riverbank willow, which holds salicin, the forerunner of aspirin. It smells like peeling a twig by the water: wet wood and cool green sap, a little bitter, with a sharp, medicinal, almost wintergreen edge."],"Apricot":["FRU","The velvety orange stone fruit. As a note it is soft and fuzzy, sweet and juicy, a little creamy and even faintly animal, like skin warm in the sun."],"Moldy Cedarwood":["WOO","Cedar gone damp and mildewed: the dry, clean pencil wood turned musty, earthy and a little mushroomy, like an old chest in a wet cellar or a coffin in the ground. It is Tombstone's picture of decay."],"Dead Water":["AIR","Tombstone's name for still, stagnant water, the water of a grave or a mire that nothing moves through: murky, green, a little rotten and cold."],"Balsamic Vinegar":["GOU","Aged Italian vinegar made from cooked grape juice and left for years in wooden barrels: dark, thick, sweet and sour at once, fruity and winey, with a sharp tang and a woody depth."],"Citrus":["CIT","No single fruit: the whole family of citrus peels, lemon, orange, bergamot, mandarin, grapefruit and lime, used together for a bright, sparkling, clean opening."],"Milk":["GOU","Milk is never in the bottle: the note is an illusion, built from lactones, soft musks and a little sweetness, sometimes with vanilla or sandalwood."],"Apple":["FRU","The first bite of an apple: the skin breaks and the smell rises at once, watery and bright, sweet and tart together."],"Cypress":["CON","The tall, dark, candle-shaped tree of Mediterranean hills and cemeteries. Its oil is fresh and resinous, dry and green, a little camphorous and piney, turning clean and woody, like clear forest air."],"Pine":["CON","The classic evergreen: pine needles smell fresh and icy, a little like menthol, herbal and balmy, bright and green, the smell of Christmas and of cleaning products. It gives woody and masculine perfumes a fresh, outdoors lift."],"Tangerine":["CIT","Almost the same fruit as mandarin, named after Tangier in Morocco, where it was shipped from, and it smells almost the same: sweet, fruity and zesty, with a touch of honey and a hint of neroli."],"Petitgrain":["CIT","Not from the fruit but from the leaves and green twigs of the bitter orange tree, distilled with steam."],"Spruce":["CON","The tall, sharp-needled Christmas tree of the north. Spruce smells green, woody and balsamic, with a sweetish undertone; black spruce is darker, fir-like and coniferous."],"Papyrus":["WOO","The tall reed of the Nile, whose pith the Egyptians pressed into paper. Perfumers draw it dry and woody, earthy and a little smoky, like snapped reeds and the pages of an old, dusty book, close to vetiver but drier."],"Sage":["ARO","Kitchen sage, the grey-green herb of stuffing and smoke-cleansing. Its oil is powerful: herbal, camphorous and slightly medicinal, with a savoury, softly peppery warmth and a resinous, cedar-like dryness."],"Cade Oil":["SMK","A dark tar oil made from the wood of the prickly juniper, a shrub of the Mediterranean, by heating the wood without air until it breaks down, much as charcoal is made, rather than by gently distilling it."],"Skunk Oil":["ANI","The skunk's own defence: the oily spray it shoots from two glands under its tail when it is threatened, which can be smelled from far off and lingers for days."],"Cannabis":["GRN","The hemp plant, Cannabis sativa."],"Night Blooming Jasmine":["FLO","Not a jasmine at all but Cestrum nocturnum, a shrub of the nightshade family, kin to tomatoes and potatoes, from the tropical Americas and grown all over the warm world."],"Turmeric":["SPI","The golden root of curries. Its smell is warm and earthy, woody and a little like carrot, with a peppery ginger zing at the back."]}};
/* ============================================================
   TEST PAGE 3 — TOP, MIDDLE, BASE (2026-11-03, in place of the Material
   Origin System).

   The owner: "Test Page 3 should be about top mid bottom stratification",
   with three pictures: skin taken apart into its layers (a film, a field
   of glass spheres, sheets, a thick slab, wire meshes between), a mountain
   in exploded layers ruled down to its height map, and a city as a stack
   of map layers, each named on the right.

   Here it is the site's pyramids taken apart: every fragrance on the site
   whose source divides its notes into top, middle and base (43), as three
   layers — the top a field of glass spheres, the middle a layer of hex
   cells, the base a slab coloured as a height map is — each note standing
   at the same place on all three (its accord's corner of the square), so
   a note named at more than one tier is threaded straight down through
   them. A fragrance chosen is drawn through its three layers; Spray plays
   the pyramid as the primer tells it, the top going first. A snapshot of
   the site, written in above: nothing on the site reads this page.
   ============================================================ */
(function () {
  "use strict";
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const el = (s) => document.querySelector(s);

  // ---- THE DATA ---------------------------------------------------------
  const D = DATA;
  const ACC = {}; D.accords.forEach((a) => (ACC[a.c] = a.n));
  const FR = D.frags;                 // the 43 with a pyramid
  const TIERS = ["t", "m", "b"];
  const TIER_SAY = { t: "Top", m: "Middle", b: "Base" };
  // how many name each note at each tier
  const count = { t: {}, m: {}, b: {} }, total = {};
  FR.forEach((f) => TIERS.forEach((k) => f[k].forEach((n) => { count[k][n] = (count[k][n] || 0) + 1; total[n] = (total[n] || 0) + 1; })));
  const NOTES = Object.keys(total);
  // every accord a corner of the square, the families beside each other
  const ZONES = [["CIT", "ARO", "GRN", "AIR"], ["FRU", "FLO", "IMP", "CON"], ["SPI", "GOU", "BRW", "WOO"], ["RES", "SMK", "EAR", "ANI"]];
  const ZONE_AT = {};
  ZONES.forEach((row, j) => row.forEach((a, i) => (ZONE_AT[a] = { i, j })));
  const TINT = {
    CIT: "242,190,80", ARO: "110,190,170", GRN: "130,200,110", AIR: "120,170,240", FRU: "240,120,100", FLO: "236,120,170",
    IMP: "160,140,240", CON: "90,170,140", SPI: "230,90,70", GOU: "220,160,100", BRW: "200,110,80", WOO: "190,140,110",
    RES: "230,130,60", SMK: "150,150,170", EAR: "160,170,130", ANI: "210,120,150",
  };
  // a note's place: in its accord's corner, the most named nearest its middle
  const POS = {};
  const byZone = {};
  NOTES.forEach((n) => { const a = (D.notes[n] || [""])[0] || "IMP"; (byZone[a] = byZone[a] || []).push(n); });
  Object.keys(byZone).forEach((a) => {
    const z = ZONE_AT[a] || { i: 0, j: 0 };
    const list = byZone[a].sort((x, y) => total[y] - total[x] || (x < y ? -1 : 1));
    const cx = -0.75 + z.i * 0.5, cz = -0.75 + z.j * 0.5;
    list.forEach((n, k) => {
      const r = 0.205 * Math.sqrt((k + 0.5) / Math.max(list.length, 6)), th = k * 2.39996323 + z.i * 1.3 + z.j * 0.7;
      POS[n] = { x: cx + Math.cos(th) * r, z: cz + Math.sin(th) * r, a };
    });
  });

  // ---- THE PAGE ---------------------------------------------------------
  const cv = el(".t3-scene");
  const ctx = cv.getContext("2d");
  const tip = el(".t3-tip");
  let W = 0, H = 0, DPR = 1, phone = false;
  let K = 200, CX = 0, CY = 0, GAP = 1;       // the stack's size, centre and spread
  const LIFT = 0.62;                          // how far up a unit of height goes, of K
  const LAYER_Y = { film: 3.15, t: 2.35, m1: 1.6, m: 0.95, m2: 0.42, b: -0.55 };
  let yaw = -0.18, yawGoal = -0.18, yawV = 0;

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    phone = W < 760;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    // the stack fitted between the head and what stands under it: from the
    // top's far corner (a corner and the top's height up) to the slab's near
    // one (a corner and the slab's depth down)
    GAP = phone ? 1.25 : 1;
    const up = 1 + 2.62 * LIFT * GAP, down = 1 + 0.9 * LIFT * GAP;
    const head = el(".t3-head").getBoundingClientRect().bottom + (phone ? 16 : 22);
    const foot = phone ? el(".t3-side").getBoundingClientRect().top - 14 : H - 64;
    K = Math.max(50, Math.min((foot - head) / (up + down), phone ? W * 0.215 : W * 0.155));
    CX = phone ? W * 0.5 : W * 0.46;
    CY = head + up * K;
  }

  // world -> window: turned about the upright by `yaw`, then seen from the
  // isometric 30° above
  const c30 = Math.cos(Math.PI / 6), s30 = 0.5;
  function P(x, y, z, o) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const xr = x * c - z * s, zr = x * s + z * c;
    o = o || {};
    o.x = CX + (xr - zr) * K * c30;
    o.y = CY + (xr + zr) * K * s30 - y * GAP * K * LIFT;
    o.d = xr + zr;
    return o;
  }
  // the affine map laying a square picture (side T) flat at height y
  function planeTransform(y, T) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const a = (K * c30 * (2 * c - 2 * s)) / T, b = (K * s30 * (2 * c + 2 * s)) / T;
    const cc = (K * c30 * (-2 * s - 2 * c)) / T, d = (K * s30 * (2 * c - 2 * s)) / T;
    const e = CX + K * c30 * (2 * s), f = CY - K * c - y * GAP * K * LIFT;
    return [a, b, cc, d, e, f];
  }
  // the window -> a place on the plane at height y, in -1..1
  function unplane(X, Y, y) {
    const [a, b, c, d, e, f] = planeTransform(y, 2);
    const det = a * d - b * c, x = X - e, yy = Y - f;
    const u = (d * x - c * yy) / det, v = (-b * x + a * yy) / det;
    return { x: u - 1, z: v - 1 };
  }

  // ---- THE LAYERS' PICTURES, drawn once ------------------------------------
  const T = 720;
  function square() { const c = document.createElement("canvas"); c.width = c.height = T; return c; }
  const toPx = (v) => ((v + 1) / 2) * T;
  // the middle: a layer of hex cells, those a middle note stands in coloured
  // by how many name it there, the rest only outlined — the map's own layer
  function middlePicture(only) {
    const c = square(), x = c.getContext("2d");
    const s = T / 34, hw = s * Math.sqrt(3);
    const cells = [];
    for (let row = -1; row < T / (s * 1.5) + 1; row++) {
      for (let col = -1; col < T / hw + 1; col++) cells.push({ x: col * hw + (row % 2 ? hw / 2 : 0), y: row * s * 1.5, n: null, c: 0 });
    }
    NOTES.forEach((n) => {
      const k = count.m[n];
      if (!k) return;
      const px = toPx(POS[n].x), py = toPx(POS[n].z);
      let best = null, bd = Infinity;
      for (const ce of cells) { if (ce.n) continue; const d = (ce.x - px) ** 2 + (ce.y - py) ** 2; if (d < bd) { bd = d; best = ce; } }
      if (best) { best.n = n; best.c = k; POS[n].hx = best.x / T * 2 - 1; POS[n].hz = best.y / T * 2 - 1; }
    });
    const hex = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * TAU) / 6; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); };
    x.fillStyle = "rgba(20,28,60,0.34)";
    x.fillRect(0, 0, T, T);
    const max = Math.max(...Object.values(count.m));
    for (const ce of cells) {
      hex(ce.x, ce.y, s * 0.98);
      if (ce.n) {
        const on = !only || only.has(ce.n);
        const k = Math.pow(ce.c / max, 0.6);
        // the map's own ramp: deep blue, through slate, to a pale gold
        const r = Math.round(lerp(42, 252, k)), g = Math.round(lerp(60, 228, k)), b = Math.round(lerp(130, 120, k));
        x.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (on ? 0.95 : 0.18) + ")";
        x.fill();
      }
      x.strokeStyle = "rgba(200,210,235,0.16)";
      x.lineWidth = 1.2;
      x.stroke();
    }
    x.strokeStyle = "rgba(220,226,240,0.5)"; x.lineWidth = 3;
    x.strokeRect(1.5, 1.5, T - 3, T - 3);
    return c;
  }
  // the base: a height map, every base note a rise as high as how many name
  // it there, coloured as the terrain layer is — pale straw to deep red
  function basePicture(only) {
    const c = square(), x = c.getContext("2d");
    const G = 120, img = x.createImageData(G, G), h = new Float32Array(G * G);
    const pts = NOTES.filter((n) => count.b[n] && (!only || only.has(n))).map((n) => [toPx(POS[n].x) / T * G, toPx(POS[n].z) / T * G, count.b[n]]);
    const R = rng(11);
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      let v = 0;
      for (const [px, py, k] of pts) { const d2 = (i - px) ** 2 + (j - py) ** 2; v += k * Math.exp(-d2 / (2 * (3.2 + k * 0.6) ** 2)); }
      h[j * G + i] = v + R() * 0.03;
    }
    let mx = 0; for (const v of h) if (v > mx) mx = v;
    for (let p = 0; p < G * G; p++) {
      const t = Math.pow(h[p] / (mx || 1), 0.55);
      // straw -> ochre -> rust -> deep red
      const stops = [[214, 207, 150], [222, 170, 92], [196, 96, 50], [150, 22, 26]];
      const u = t * 3, k = Math.min(2, Math.floor(u)), f = u - k;
      const A = stops[k], B = stops[k + 1];
      img.data[p * 4] = A[0] + (B[0] - A[0]) * f;
      img.data[p * 4 + 1] = A[1] + (B[1] - A[1]) * f;
      img.data[p * 4 + 2] = A[2] + (B[2] - A[2]) * f;
      img.data[p * 4 + 3] = 255;
    }
    const tmp = document.createElement("canvas"); tmp.width = tmp.height = G;
    tmp.getContext("2d").putImageData(img, 0, 0);
    x.imageSmoothingQuality = "high";
    x.drawImage(tmp, 0, 0, T, T);
    // its contours, faint
    x.strokeStyle = "rgba(80,20,10,0.22)"; x.lineWidth = 1.4;
    for (const lv of [0.2, 0.4, 0.6, 0.8]) {
      x.beginPath();
      for (let j = 0; j < G - 1; j++) for (let i = 0; i < G - 1; i++) {
        const a = h[j * G + i] / mx, b = h[j * G + i + 1] / mx, d = h[(j + 1) * G + i] / mx;
        if ((a - lv) * (b - lv) < 0) { const u = (lv - a) / (b - a); x.moveTo((i + u) / G * T, j / G * T); x.lineTo((i + u) / G * T, (j + 1) / G * T); }
        if ((a - lv) * (d - lv) < 0) { const u = (lv - a) / (d - a); x.moveTo(i / G * T, (j + u) / G * T); x.lineTo((i + 1) / G * T, (j + u) / G * T); }
      }
      x.stroke();
    }
    return c;
  }
  // the glass spheres of the top, drawn once a size and laid down
  const sphereMemo = new Map();
  function sphere(r, tint) {
    const key = Math.round(r * DPR) + tint;
    let c = sphereMemo.get(key);
    if (c) return c;
    const s = Math.ceil(r * 2 * DPR) + 4;
    c = document.createElement("canvas"); c.width = c.height = s;
    const x = c.getContext("2d"), m = s / 2, rr = r * DPR;
    let g = x.createRadialGradient(m - rr * 0.35, m - rr * 0.4, rr * 0.05, m, m, rr);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.25, "rgba(" + tint + ",0.38)");
    g.addColorStop(0.8, "rgba(" + tint + ",0.22)");
    g.addColorStop(1, "rgba(220,230,255,0.75)");
    x.fillStyle = g; x.beginPath(); x.arc(m, m, rr, 0, TAU); x.fill();
    g = x.createRadialGradient(m + rr * 0.35, m + rr * 0.45, 0, m + rr * 0.35, m + rr * 0.45, rr * 0.55);
    g.addColorStop(0, "rgba(255,255,255,0.35)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.beginPath(); x.arc(m, m, rr, 0, TAU); x.fill();
    sphereMemo.set(key, c);
    return c;
  }

  // ---- WHAT IS CHOSEN ------------------------------------------------------
  let chosen = null;         // a fragrance
  let lit = null;            // an accord pointed at in the legend
  let hot = null;            // what the hand is on
  let pics = { m: null, b: null };
  function repaint() {
    const only = chosen ? new Set([].concat(chosen.t, chosen.m, chosen.b)) : lit ? new Set(NOTES.filter((n) => POS[n].a === lit)) : null;
    pics.m = middlePicture(only);
    pics.b = basePicture(only);
  }
  const inFocus = (n) => (chosen ? chosen.t.includes(n) || chosen.m.includes(n) || chosen.b.includes(n) : lit ? POS[n].a === lit : true);
  function choose(f) {
    chosen = f;
    repaint();
    el(".t3-pick").value = f ? String(FR.indexOf(f)) : "";
    const box = el(".t3-chosen");
    if (!f) { box.hidden = true; return; }
    box.hidden = false;
    box.querySelector("h3").textContent = f.n;
    box.querySelector("[data-v=house]").textContent = D.houses[f.h] || f.h;
    box.querySelector("dl").innerHTML = TIERS.map((k) => "<dt>" + TIER_SAY[k] + "</dt><dd>" + esc(f[k].join(", ")) + "</dd>").join("");
  }

  // ---- SPRAYING IT: the pyramid as the primer tells it ----------------------
  // "The top is what you smell when you initially spray a perfume; the mid
  // (also called heart) is what you smell 20–30 minutes into spraying the
  // perfume; and the base (also called the dry down) is what you smell hours
  // after you have sprayed it."
  let sprayT0 = -1;
  const SPRAY = 12;          // seconds the whole of it takes
  const sprayAt = () => (sprayT0 < 0 ? -1 : (performance.now() - sprayT0) / 1000);
  // how present each layer is, the film coming down and the layers going
  function presence(t) {
    if (t < 0) return { film: 0, t: 1, m: 1, b: 1, stage: "" };
    const film = t < 1.4 ? smooth(t / 1.4) : t < 2.6 ? 1 : 1 - smooth((t - 2.6) / 0.9);
    const top = t < 3 ? 1 : 1 - smooth((t - 3) / 2.2);
    const mid = t < 6 ? 1 : 1 - smooth((t - 6) / 2.2);
    const back = t > SPRAY - 1.6 ? smooth((t - (SPRAY - 1.6)) / 1.6) : 0;
    const stage = t < 3 ? "t" : t < 6 ? "m" : t < SPRAY - 1.6 ? "b" : "";
    return { film, t: Math.max(top, back), m: Math.max(mid, back), b: 1, stage };
  }

  // ---- DRAWING ---------------------------------------------------------------
  const O = {}, O2 = {};
  function drawMesh(y, amp, ph, t, dots) {
    const n = 22, step = 2 / n;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(220,226,236,0.32)";
    const yAt = (x, z) => y + amp * Math.sin(x * 2.4 + ph + t * 0.35) * Math.cos(z * 2.1 - ph * 0.7 + t * 0.25);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) { const x = -1.05 + i * step * 1.05, z = -1.05 + j * step * 1.05; P(x, yAt(x, z), z, O); if (j) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); }
      for (let j = 0; j <= n; j++) { const z = -1.05 + i * step * 1.05, x = -1.05 + j * step * 1.05; P(x, yAt(x, z), z, O); if (j) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); }
    }
    ctx.stroke();
    if (dots) {
      ctx.fillStyle = "rgba(230,236,245,0.55)";
      const R = rng(5);
      for (let k = 0; k < 420; k++) {
        const x = R() * 1.6 - 0.8, z = R() * 1.6 - 0.8;
        if (Math.abs(x) + Math.abs(z) * 0.6 > 1.15 * R() + 0.55) continue;
        P(x, yAt(x, z) + 0.02, z, O);
        const s = 1 + R() * 1.4;
        ctx.fillRect(O.x - s / 2, O.y - s / 2, s, s);
      }
    }
  }
  function drawPlane(pic, y, alpha) {
    if (!pic || alpha <= 0.01) return;
    const m = planeTransform(y, T);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.setTransform(m[0] * DPR, m[1] * DPR, m[2] * DPR, m[3] * DPR, m[4] * DPR, m[5] * DPR);
    ctx.drawImage(pic, 0, 0);
    ctx.restore();
  }
  // the slab under the base: the faces of its sides that are seen
  function drawSlab(y, depth, alpha) {
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let i = 0; i < 4; i++) {
      const [x0, z0] = corners[i], [x1, z1] = corners[(i + 1) % 4];
      const nx = z1 - z0, nz = -(x1 - x0);        // outward
      const c = Math.cos(yaw), s = Math.sin(yaw);
      const nxr = nx * c - nz * s, nzr = nx * s + nz * c;
      if (nxr + nzr <= 0) continue;
      const a = P(x0, y, z0, {}), b = P(x1, y, z1, {}), b2 = P(x1, y - depth, z1, {}), a2 = P(x0, y - depth, z0, {});
      const g = ctx.createLinearGradient(0, a.y, 0, a2.y);
      g.addColorStop(0, "rgba(232,214,190,0.95)");
      g.addColorStop(0.45, "rgba(214,150,120,0.9)");
      g.addColorStop(0.55, "rgba(190,190,210,0.85)");
      g.addColorStop(1, "rgba(120,140,170,0.8)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b2.x, b2.y); ctx.lineTo(a2.x, a2.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();
  }
  function drawFilm(y, alpha, t) {
    if (alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    for (let k = 0; k < 3; k++) {
      const yy = y - k * 0.06;
      const edge = [];
      const n = 28;
      const wave = (x, z) => 0.07 * Math.sin(x * 3.1 + t * 0.6 + k * 0.3) + 0.05 * Math.cos(z * 3.7 - t * 0.4);
      for (let i = 0; i <= n; i++) edge.push(P(-0.92 + (1.84 * i) / n, yy + wave(-0.92 + (1.84 * i) / n, -0.92), -0.92, {}));
      for (let i = 0; i <= n; i++) edge.push(P(0.92, yy + wave(0.92, -0.92 + (1.84 * i) / n), -0.92 + (1.84 * i) / n, {}));
      for (let i = n; i >= 0; i--) edge.push(P(-0.92 + (1.84 * i) / n, yy + wave(-0.92 + (1.84 * i) / n, 0.92), 0.92, {}));
      for (let i = n; i >= 0; i--) edge.push(P(-0.92, yy + wave(-0.92, -0.92 + (1.84 * i) / n), -0.92 + (1.84 * i) / n, {}));
      ctx.beginPath(); edge.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath();
      if (k === 0) { ctx.fillStyle = "rgba(170,190,235,0.28)"; ctx.fill(); }
      ctx.strokeStyle = k === 0 ? "rgba(220,232,255,0.8)" : "rgba(150,175,230,0.55)";
      ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();
  }
  let clock = 0, last = 0, raf = 0;
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (!STILL) clock += dt;
    const t = clock;
    // the stack turns a little on its own, and as far as it is turned
    if (!drag) {
      if (!STILL) yawGoal += Math.sin(t * 0.21) * 0.0009;
      yawV += (yawGoal - yaw) * (STILL ? 1 : 1 - Math.exp(-dt * 5));
      yaw += (yawGoal - yaw) * (STILL ? 1 : 1 - Math.exp(-dt * 5));
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#050506";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const st = sprayAt();
    if (st > SPRAY) { sprayT0 = -1; el(".t3-spray").classList.remove("is-on"); }
    const pr = presence(st > SPRAY ? -1 : st);
    el(".t3-stage").dataset.at = pr.stage;

    // the base, the slab under it, and its rule
    drawSlab(LAYER_Y.b, 0.32, 1);
    drawPlane(pics.b, LAYER_Y.b, 1);
    // the threads: a note named at more than one tier runs straight down
    // through them, as the picture's verticals do
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(230,232,240,0.16)";
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    for (const n of NOTES) {
      const tiers = TIERS.filter((k) => count[k][n]);
      if (tiers.length < 2 || !inFocus(n)) continue;
      const top = tiers[0] === "t" ? LAYER_Y.t : LAYER_Y.m, bot = tiers[tiers.length - 1] === "b" ? LAYER_Y.b : LAYER_Y.m;
      P(POS[n].x, top, POS[n].z, O); P(POS[n].x, bot, POS[n].z, O2);
      ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    drawMesh(LAYER_Y.m2, 0.06, 0.4, t, true);
    // the middle
    drawPlane(pics.m, LAYER_Y.m + (1 - pr.m) * 0.9, pr.m);
    drawMesh(LAYER_Y.m1, 0.08, 1.7, t, false);
    // the top: glass spheres, the furthest first; they rise as they go
    const tops = NOTES.filter((n) => count.t[n]).map((n) => {
      const rise = (1 - pr.t) * (0.9 + ((n.length * 7) % 10) / 10);
      const bob = STILL ? 0 : 0.035 * Math.sin(t * 0.9 + n.length);
      const p = P(POS[n].x, LAYER_Y.t + 0.12 + bob + rise, POS[n].z, {});
      return { n, p };
    }).sort((a, b) => a.p.d - b.p.d);
    for (const { n, p } of tops) {
      const r = (phone ? 3 : 4.2) * Math.sqrt(count.t[n]) * (K / 200) + 2.2;
      const on = inFocus(n);
      ctx.globalAlpha = pr.t * (on ? 1 : 0.16) * (hot && hot.n === n ? 1 : 0.94);
      const img = sphere(r, TINT[POS[n].a] || "200,210,240");
      ctx.drawImage(img, p.x - img.width / DPR / 2, p.y - img.height / DPR / 2, img.width / DPR, img.height / DPR);
    }
    ctx.globalAlpha = 1;
    // the spray coming down onto the top
    drawFilm(LAYER_Y.film + (1 - pr.film) * 0.8, pr.film, t);

    // a fragrance chosen: its notes joined on each layer, and a line down
    // through the three from the middle of its top to the middle of its base
    if (chosen) drawChosen();
    if (hot) drawHot();
    // the labels' leader lines follow the stack's edge
    placeLabels();
    if (!STILL && !document.hidden) raf = requestAnimationFrame(frame); else last = 0;
  }
  function centroid(list, y, key) {
    let x = 0, z = 0;
    list.forEach((n) => { x += key ? POS[n].hx ?? POS[n].x : POS[n].x; z += key ? POS[n].hz ?? POS[n].z : POS[n].z; });
    return P(x / list.length, y, z / list.length, {});
  }
  function drawChosen() {
    const f = chosen;
    ctx.lineWidth = 1;
    const ys = { t: LAYER_Y.t + 0.12, m: LAYER_Y.m, b: LAYER_Y.b };
    const ring = (list, y, mid) => {
      const pts = list.map((n) => P(mid ? POS[n].hx ?? POS[n].x : POS[n].x, y, mid ? POS[n].hz ?? POS[n].z : POS[n].z, {}));
      const c = centroid(list, y, mid);
      pts.sort((a, b) => Math.atan2(a.y - c.y, a.x - c.x) - Math.atan2(b.y - c.y, b.x - c.x));
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.stroke();
      ctx.fillStyle = "#fff";
      pts.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, TAU); ctx.fill(); });
      return c;
    };
    const ct = ring(f.t, ys.t, false), cm = ring(f.m, ys.m, true), cb = ring(f.b, ys.b, false);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath(); ctx.moveTo(ct.x, ct.y); ctx.lineTo(cm.x, cm.y); ctx.lineTo(cb.x, cb.y); ctx.stroke();
    ctx.setLineDash([]);
    // their names, small, beside them
    ctx.font = (phone ? "500 9px " : "500 10.5px ") + '"IBM Plex Mono", monospace';
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.textBaseline = "middle";
    const seen = [];
    TIERS.forEach((k) => f[k].forEach((n) => {
      const p = P(k === "m" ? POS[n].hx ?? POS[n].x : POS[n].x, ys[k], k === "m" ? POS[n].hz ?? POS[n].z : POS[n].z, {});
      if (seen.some((q) => Math.abs(q.x - p.x) < 60 && Math.abs(q.y - p.y) < 11)) return;
      seen.push(p);
      ctx.fillText(n, p.x + 6, p.y - 7);
    }));
  }
  function drawHot() {
    const p = hot.p;
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, TAU); ctx.stroke();
  }

  // ---- THE LABELS, left and right, with their leaders -----------------------
  // all on the left, each led to its layer's leftmost corner, as the skin's
  // poster leads its names in
  const LABELS = [{ key: "t", y: LAYER_Y.t }, { key: "m", y: LAYER_Y.m }, { key: "b", y: LAYER_Y.b }];
  const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  function placeLabels() {
    LABELS.forEach((L) => {
      const box = el('.t3-label[data-tier="' + L.key + '"]');
      if (!box) return;
      let p = null;
      CORNERS.forEach(([x, z]) => { const q = P(x * 0.98, L.y, z * 0.98, {}); if (!p || q.x < p.x) p = q; });
      const w = box.offsetWidth;
      const bx = phone ? 12 + w : Math.min(p.x - 40, CX - K * 2.15);
      const by = phone ? p.y - 26 : p.y - 26;
      const t = "translate(" + Math.round(bx - w) + "px," + Math.round(by - 6) + "px)";
      if (box.dataset.t !== t) { box.style.transform = t; box.dataset.t = t; }
      if (phone) return;
      // the leader: along under the name, then down to the corner
      ctx.strokeStyle = "rgba(230,232,238,0.7)"; ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(bx + 6, by);
      ctx.lineTo(lerp(bx + 6, p.x, 0.6), by);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.fillStyle = "rgba(236,235,231,0.9)";
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    });
  }

  // ---- THE HAND --------------------------------------------------------------
  let drag = null;
  function noteAt(X, Y) {
    // the top's spheres first, then a hex of the middle, then the base
    let best = null, bd = phone ? 16 : 11;
    for (const n of NOTES) {
      if (!count.t[n]) continue;
      const p = P(POS[n].x, LAYER_Y.t + 0.12, POS[n].z, {});
      const d = Math.hypot(X - p.x, Y - p.y);
      if (d < bd) { bd = d; best = { n, k: "t", p }; }
    }
    if (best) return best;
    for (const [k, y] of [["m", LAYER_Y.m], ["b", LAYER_Y.b]]) {
      const q = unplane(X, Y, y);
      if (Math.abs(q.x) > 1 || Math.abs(q.z) > 1) continue;
      let bn = null, bq = k === "m" ? 0.05 : 0.07;
      for (const n of NOTES) {
        if (!count[k][n]) continue;
        const px = k === "m" ? POS[n].hx ?? POS[n].x : POS[n].x, pz = k === "m" ? POS[n].hz ?? POS[n].z : POS[n].z;
        const d = Math.hypot(q.x - px, q.z - pz);
        if (d < bq) { bq = d; bn = n; }
      }
      if (bn) return { n: bn, k, p: P(k === "m" ? POS[bn].hx ?? POS[bn].x : POS[bn].x, y, k === "m" ? POS[bn].hz ?? POS[bn].z : POS[bn].z, {}) };
    }
    return null;
  }
  function showTip(h, X, Y) {
    if (!h) { tip.hidden = true; return; }
    const nd = D.notes[h.n] || ["", ""];
    const where = TIERS.filter((k) => count[k][h.n]).map((k) => TIER_SAY[k] + " " + count[k][h.n]).join(" · ");
    const who = FR.filter((f) => f[h.k].includes(h.n)).map((f) => f.n);
    tip.innerHTML = "<b>" + esc(h.n) + "</b><span>" + esc(ACC[nd[0]] || "") + " · " + where + "</span>" +
      (nd[1] ? "<em>" + esc(nd[1]) + "</em>" : "") +
      "<i>" + TIER_SAY[h.k] + " in " + esc(who.slice(0, 6).join(", ")) + (who.length > 6 ? " and " + (who.length - 6) + " more" : "") + "</i>";
    tip.hidden = false;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = X + 16, y = Y + 16;
    if (x + tw > W - 10) x = X - tw - 16;
    if (y + th > H - 10) y = Y - th - 16;
    tip.style.transform = "translate(" + Math.round(Math.max(8, x)) + "px," + Math.round(Math.max(8, y)) + "px)";
  }
  cv.addEventListener("pointerdown", (ev) => {
    drag = { x: ev.clientX, y0: yaw, moved: false };
    cv.setPointerCapture(ev.pointerId);
  });
  cv.addEventListener("pointermove", (ev) => {
    if (drag) {
      const dx = ev.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (drag.moved) { yaw = yawGoal = drag.y0 + dx * 0.006; tip.hidden = true; hot = null; kickStill(); return; }
    }
    if (ev.pointerType === "touch") return;
    const h = noteAt(ev.clientX, ev.clientY);
    hot = h;
    cv.style.cursor = h ? "pointer" : "grab";
    showTip(h, ev.clientX, ev.clientY);
    kickStill();
  });
  const end = (ev) => {
    if (!drag) return;
    const was = drag; drag = null;
    if (was.moved) return;
    // a press: a note says what it is; pressed again, the first fragrance
    // naming it at that tier is drawn through
    const h = noteAt(ev.clientX, ev.clientY);
    if (h) {
      if (hot && hot.n === h.n && !tip.hidden) {
        const f = FR.find((x) => x[h.k].includes(h.n) && x !== chosen) || FR.find((x) => x[h.k].includes(h.n));
        if (f) choose(f);
      }
      hot = h; showTip(h, ev.clientX, ev.clientY);
    } else { hot = null; tip.hidden = true; }
    kickStill();
  };
  cv.addEventListener("pointerup", end);
  cv.addEventListener("pointercancel", () => { drag = null; });
  cv.addEventListener("pointerleave", () => { if (!drag) { hot = null; tip.hidden = true; kickStill(); } });

  // the fragrances, the legend, the spray
  const pick = el(".t3-pick");
  pick.innerHTML = '<option value="">Every pyramid on the site</option>' + FR.map((f, i) => '<option value="' + i + '">' + esc(f.n) + " — " + esc(D.houses[f.h] || f.h) + "</option>").join("");
  pick.addEventListener("change", () => { choose(pick.value === "" ? null : FR[+pick.value]); kickStill(); });
  el(".t3-clear").addEventListener("click", () => { choose(null); kickStill(); });
  el(".t3-next").addEventListener("click", () => { const i = chosen ? FR.indexOf(chosen) : -1; choose(FR[(i + 1) % FR.length]); kickStill(); });
  el(".t3-spray").addEventListener("click", () => {
    if (STILL) return;
    sprayT0 = performance.now();
    el(".t3-spray").classList.add("is-on");
  });
  const legend = el(".t3-legend");
  legend.innerHTML = ZONES.flat().map((a) => '<li><button type="button" data-acc="' + a + '"><i style="background:rgb(' + TINT[a] + ')"></i>' + esc(ACC[a]) + "</button></li>").join("");
  legend.addEventListener("pointerover", (ev) => {
    const b = ev.target.closest("[data-acc]");
    if (!b || chosen || lit === b.dataset.acc) return;
    lit = b.dataset.acc; repaint(); kickStill();
  });
  legend.addEventListener("pointerleave", () => { if (lit) { lit = null; repaint(); kickStill(); } });
  legend.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-acc]");
    if (!b) return;
    if (chosen) choose(null);
    lit = lit === b.dataset.acc ? null : b.dataset.acc; repaint(); kickStill();
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.target && ev.target.matches && ev.target.matches("select, input")) return;
    if (ev.key === "ArrowLeft") { yawGoal -= 0.2; kickStill(); }
    else if (ev.key === "ArrowRight") { yawGoal += 0.2; kickStill(); }
    else if (ev.key === "Escape") { choose(null); lit = null; repaint(); hot = null; tip.hidden = true; kickStill(); }
  });
  // the counts the page says
  const uniq = (k) => NOTES.filter((n) => count[k][n]).length;
  const named = (k) => FR.reduce((s, f) => s + f[k].length, 0);
  TIERS.forEach((k) => {
    const e = el('[data-count="' + k + '"]');
    if (e) e.textContent = named(k) + " named · " + uniq(k) + " different";
  });
  el("[data-v=pyramids]").textContent = String(FR.length);

  // ---- BEGIN -------------------------------------------------------------------
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function kickStill() { kick(); }
  resize();
  repaint();
  window.addEventListener("resize", () => { resize(); kick(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { last = 0; kick(); } });
  kick();
  window.TestPage3 = {
    choose: (name) => { const f = FR.find((x) => x.n === name); choose(f || null); kick(); return !!f; },
    chosen: () => (chosen ? chosen.n : null),
    spray: () => el(".t3-spray").click(),
    stage: () => el(".t3-stage").dataset.at,
    yaw: () => yaw,
    pointOf: (name, k) => { const y = { t: LAYER_Y.t + 0.12, m: LAYER_Y.m, b: LAYER_Y.b }[k]; const n = POS[name]; return n ? P(k === "m" ? n.hx ?? n.x : n.x, y, k === "m" ? n.hz ?? n.z : n.z, {}) : null; },
    count: FR.length,
  };
})();

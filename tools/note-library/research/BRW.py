from acc import out, SAME
S = {
 "fr_absinthe": ("https://www.fragrantica.com/notes/Absinthe-717.html", "Absinthe perfume ingredient, Absinthe fragrance and essential oils"),
 "ps_allure": ("https://perfumesociety.org/the-allure-of-artemisia-wormwood-and-absinthe/", "The Allure of Artemisia, Wormwood and Absinthe - The Perfume Society"),
 "fr_wormwood": ("https://www.fragrantica.com/notes/Wormwood-369.html", "Wormwood perfume ingredient, Wormwood fragrance and essential oils Artemisia Absinthium"),
 "fr_amaretto": ("https://www.fragrantica.com/notes/Amaretto-267.html", "Amaretto perfume ingredient, Amaretto fragrance and essential oils"),
 "ps_amaretto": ("https://perfumesociety.org/ingredients-post/amaretto/", "Amaretto - The Perfume Society"),
 "fw_amaretto": ("https://fraterworks.com/products/amaretto", "Amaretto Saronno – Fraterworks"),
 "fr_coffee": ("https://www.fragrantica.com/notes/Coffee-139.html", "Coffee perfume ingredient, Coffee fragrance and essential oils Coffea arabica (Rubiaceae)"),
 "fr_coffeeco2": ("https://www.fragrantica.com/notes/Coffee-CO2-1304.html", "Coffee CO2 perfume ingredient, Coffee CO2 fragrance and essential oils Coffea arabica (Rubiaceae)"),
 "fw_coffeeco2": ("https://fraterworks.com/products/coffee-arabica-p-jungle-essence", "Coffee Arabica CO2 – Fraterworks"),
 "fr_co2": ("https://www.fragrantica.com/notes/CO2-Extracts-783.html", "CO2 Extracts perfume ingredient, CO2 Extracts fragrance and essential oils CO2"),
 "tg_coffee": ("https://www.thegoodscentscompany.com/odor/coffee.html", "The Good Scents Company -Odor Descriptor Listing for coffee", "The Good Scents Company"),
 "fr_cognac": ("https://www.fragrantica.com/notes/Cognac-280.html", "Cognac perfume ingredient, Cognac fragrance and essential oils"),
 "tg_cognac": ("https://www.thegoodscentscompany.com/odor/cognac.html", "The Good Scents Company -Odor Descriptor Listing for cognac", "The Good Scents Company"),
 "fr_brandy": ("https://www.fragrantica.com/notes/Cognac-523.html", "Brandy perfume ingredient, Brandy fragrance and essential oils"),
 "fr_cocacola": ("https://www.fragrantica.com/notes/Coca-Cola-362.html", "Coca-Cola perfume ingredient, Coca-Cola fragrance and essential oils"),
 "fr_colanews": ("https://www.fragrantica.com/news/Coca-Cola-Notes-in-Perfumery-2847.html", "Coca-Cola Notes in Perfumery ~ Raw Materials ~ Fragrantica"),
 "sc_cola": ("https://www.scentspiracy.com/bases/p/kola-flavor", "Cola Base – Sweet and Spicy Citrus Base for Perfumery — Scentspiracy"),
 "oz_greentea": ("https://www.osmoz.com/encyclopedia/raw-materials/green/198/green-tea-camelia-sinensis", "Green Tea (Camelia Sinensis) Perfumes raw material - Green Tea (Camelia Sinensis) Scent"),
 "fr_tea": ("https://www.fragrantica.com/notes/Tea-106.html", "Tea perfume ingredient, Tea fragrance and essential oils"),
 "fr_bvlgari": ("https://www.fragrantica.com/perfume/Bvlgari/Eau-Parfumee-au-The-Vert-144.html", "Eau Parfumee au The Vert Bvlgari perfume - a fragrance for women and men 1992"),
 "fr_comforttea": ("https://www.fragrantica.com/news/Best-in-Show-Comforting-Tea-Scents-2023-19365.html", "Best in Show: Comforting Tea Scents (2023) ~ Best in Show ~ Fragrantica"),
 "ps_timefortea": ("https://perfumesociety.org/time-for-tea/", "Time for Tea? - The Perfume Society"),
 "fr_jasminetea": ("https://www.fragrantica.com/notes/Jasmine-Tea-772.html", "Jasmine Tea perfume ingredient, Jasmine Tea fragrance and essential oils"),
 "fr_jasgs": ("https://www.fragrantica.com/news/Jasmine-Grandiflorum-vs-Sambac-20384.html", "Jasmine: Grandiflorum vs Sambac ~ Raw Materials ~ Fragrantica"),
 "fr_jasteaboard": ("https://www.fragrantica.com/board/viewtopic.php?id=275463", "Perfume that smells like jasmine tea? (Page 1) — Perfume Selection Tips for Women — Fragrantica Club", "Fragrantica Club"),
 "fr_lapsang": ("https://www.fragrantica.com/notes/Lapsang-Souchong-Tea-1071.html", "Lapsang Souchong Tea perfume ingredient, Lapsang Souchong Tea fragrance and essential oils"),
 "wp_lapsang": ("https://en.wikipedia.org/wiki/Lapsang_souchong", "Lapsang souchong - Wikipedia"),
 "fr_treacle": ("https://www.fragrantica.com/perfume/Pineward-Perfumes/Treacle-71217.html", "Treacle Pineward Perfumes perfume - a fragrance for women and men 2021"),
 "fr_liquor": ("https://www.fragrantica.com/notes/Liquor-727.html", "Liquor perfume ingredient, Liquor fragrance and essential oils"),
 "fr_bottle": ("https://www.fragrantica.com/news/A-Bottle-of-This-Top-Shelf-Boozy-Scents-You-Never-Would-ve-Guessed-23343.html", "A Bottle of This: Top Shelf Boozy Scents You Never Would've Guessed ~ Columns ~ Fragrantica"),
 "fr_boozytrio": ("https://www.fragrantica.com/news/The-Allure-of-Boozy-Perfumes-A-Trio-of-Perfume-Drinks-13318.html", "The Allure of Boozy Perfumes: A Trio of Perfume 'Drinks' ~ Columns ~ Fragrantica"),
 "at_amaretto": ("https://ataraxiaperfumery.com/products/amaretto-jazz-in-the-melting-room", "Amaretto Jazz in the Melting Room", "Ataraxia Perfumery"),
 "fr_blackcherry": ("https://www.fragrantica.com/notes/Black-Cherry-1376.html", "Black Cherry perfume ingredient, Black Cherry fragrance and essential oils Eugenia Candolleana"),
 "fr_chai": ("https://www.fragrantica.com/notes/Masala-Chai-214.html", "Masala Chai perfume ingredient, Masala Chai fragrance and essential oils"),
 "ps_chai": ("https://perfumesociety.org/chai-spice-everything-nice-thats-what-these-scents-are-made-of/", "Chai Spice & Everything Nice (that's what these scents are made of) - The Perfume Society"),
 "fr_mate": ("https://www.fragrantica.com/notes/Mate-48.html", "Mate perfume ingredient, Mate fragrance and essential oils"),
 "st_mate": ("https://www.scentree.co/en/Mate_absolute.html", "ScenTree - Mate absolute (CAS N° 68916-96-1)"),
 "oz_mate": ("https://www.osmoz.com/encyclopedia/raw-materials/tobacco/187/mate-ilex-paraguayensis", "Mate (Ilex Paraguayensis) Perfumes raw material - Mate (Ilex Paraguayensis) Scent"),
 "wp_maghrebi": ("https://en.wikipedia.org/wiki/Maghrebi_mint_tea", "Maghrebi mint tea - Wikipedia"),
 "fr_alkemia": ("https://www.fragrantica.com/perfume/Alkemia-Perfumes/Moroccan-Tea-54264.html", "Moroccan Tea Alkemia Perfumes perfume - a fragrance for women and men"),
 "fr_whitelabel": ("https://www.fragrantica.com/perfume/Grande/White-Label-117529.html", "White Label Grande perfume - a fragrance for women and men"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "fr_oolong": ("https://www.fragrantica.com/notes/Oolong-Tea-713.html", "Oolong Tea perfume ingredient, Oolong Tea fragrance and essential oils"),
 "fr_pomelooolong": ("https://www.fragrantica.com/news/POMELO-OOLONG-d-Annam-The-Silent-Glow-of-Oolong-Tea-24748.html", "POMELO OOLONG d'Annam: The Silent Glow of Oolong Tea ~ Fragrance Reviews ~ Fragrantica"),
 "fr_rootbeer": ("https://www.fragrantica.com/notes/Root-Beer-1742.html", "Root Beer perfume ingredient, Root Beer fragrance and essential oils"),
 "tg_rootbeer": ("https://www.thegoodscentscompany.com/odor/root-beer.html", "The Good Scents Company -Odor Descriptor Listing for root beer", "The Good Scents Company"),
 "fr_rum": ("https://www.fragrantica.com/notes/Rum-201.html", "Rum perfume ingredient, Rum fragrance and essential oils"),
 "ps_rum": ("https://perfumesociety.org/ingredients-post/rum/", "Rum - The Perfume Society"),
 "fr_rhumagricole": ("https://www.fragrantica.com/notes/Rhum-Agricole-1102.html", "Rhum Agricole perfume ingredient, Rhum Agricole fragrance and essential oils"),
 "fr_sodabubbles": ("https://www.fragrantica.com/notes/Soda-Bubbles-1861.html", "Soda Bubbles perfume ingredient, Soda Bubbles fragrance and essential oils"),
 "fr_fizzy": ("https://www.fragrantica.com/news/The-Pause-that-Refreshes-Fizzy-and-Sparkly-from-Beverage-Inspired-Gourmands-21302.html", "The Pause that Refreshes: Fizzy and Sparkly from Beverage Inspired Gourmands ~ Fragrance Reviews ~ Fragrantica"),
 "fr_sparkling": ("https://www.fragrantica.com/notes/Sparkling-Water-1314.html", "Sparkling Water perfume ingredient, Sparkling Water fragrance and essential oils"),
 "wp_carbonated": ("https://en.wikipedia.org/wiki/Carbonated_water", "Carbonated water - Wikipedia"),
 "fr_tourtea": ("https://www.fragrantica.com/news/Tour-de-Tea-Exploring-a-Fickle-Fragrance-Note-17297.html", "Tour de Tea: Exploring a Fickle Fragrance Note ~ Raw Materials ~ Fragrantica"),
 "ps_blacktea": ("https://perfumesociety.org/steeped-in-scent-exploring-the-world-of-black-tea-in-fragrances/", "Steeped in Scent – exploring the world of black tea in fragrances - The Perfume Society"),
}
N = {
 "note-absinthe": dict(
  say="The green spirit of fin-de-siècle Paris, made from wormwood, anise, fennel and other herbs. As a note it is cool, aromatic and faintly intoxicating: liquorice and anise over the bitter, green, camphorous bite of wormwood, like gin with liquorice in it. It adds a green haze and a slightly dangerous, poetic mood.",
  src=["fr_absinthe", "ps_allure", "fr_wormwood"]),
 "note-amaretto": dict(
  say="The Italian liqueur, bitter by name but sweet in fact, made with apricot kernels for their almond taste. As a note it is sweet, nutty and boozy, marzipan with a slightly bitter edge and a burnt-sugar roundness; the alcohol fades after a while, leaving a soft almond sweetness.",
  src=["fr_amaretto", "ps_amaretto", "fw_amaretto"]),
 "note-coffee": dict(
  say="Freshly roasted, freshly ground coffee: dark, roasted and bitter, nutty and a little chocolatey, oily and rich, like opening a bag of beans. It wakes up a gourmand and deepens woods, and it tends to fade sooner than you would think.",
  src=["fr_coffee", "fw_coffeeco2", "tg_coffee"],
  vars={
   "Coffee CO2": dict(say="Coffee extracted with carbon dioxide under pressure rather than distilled with steam: no heat, so the extract keeps the true smell of the roasted bean, dense, oily and very realistic, with chocolatey and nutty facets.", src=["fr_coffeeco2", "fw_coffeeco2", "fr_co2"]),
  }),
 "note-cognac": dict(
  say="The French brandy, aged in oak: warm, golden and smooth, with a honeyed sweetness, dried fruit like prunes and raisins, a touch of candied orange peel, and the dry, tannic wood of the barrel. It gives a perfume a slow, glowing, boozy warmth, softer than whisky.",
  src=["fr_cognac", "tg_cognac", "fr_brandy"],
  vars={
   "Brandy": dict(say="Brandy is the whole family of spirits distilled from wine; cognac is one brandy, from the Cognac region, double-distilled and aged in oak. As a note brandy is broader and a little rougher and fruitier, where cognac is smoother and more polished.", src=["fr_brandy", "fr_cognac"]),
  }),
 "note-cola": dict(
  say="The soft drink, and a note built the way the drink is flavoured: citrus peel, lime and orange, cinnamon and a touch of nutmeg and coriander, over vanilla and caramel. It smells sweet, tangy and a little spicy, nose-tickling and nostalgic.",
  src=["fr_cocacola", "fr_colanews", "sc_cola"]),
 "note-green-tea": dict(
  say="Unoxidised tea leaves: fresh, green and softly bitter, clean and calm, with a faint sweetness. The note is mostly built, often with citrus and a little jasmine around it; Bulgari's green tea perfume of 1992 made it a perfumery classic, fresh and airy.",
  src=["oz_greentea", "fr_tea", "fr_bvlgari"]),
 "note-herbal-tea": dict(
  say="An infusion of herbs and flowers rather than of the tea plant: chamomile, mint, linden, mountain herbs. It smells soft, green and slightly sweet, herbal and a little floral, like the steam rising from a cup, soothing and quiet.",
  src=["fr_comforttea", "ps_timefortea", "fr_tea"]),
 "note-jasmine-tea": dict(
  say="Green tea scented with jasmine flowers, usually jasmine sambac. It smells of green, slightly bitter, astringent tea with a sweet, fresh jasmine floating over it, delicate and comforting, like steam from a cup.",
  src=["fr_jasminetea", "fr_jasgs", "fr_jasteaboard"]),
 "note-lapsang-souchong": dict(
  say="A Chinese black tea whose leaves are dried over a pinewood fire. It smells intensely smoky, woody and resinous, almost like bacon or a campfire, with the dark tea underneath. In a perfume it brings smoke and warmth, and it pairs with leather, honey and woods.",
  src=["fr_lapsang", "wp_lapsang", "fr_treacle"],
  vars={"Lapsang Souchong Tea": dict(same="No change: lapsang souchong is a tea already.")}),
 "note-liquor": dict(
  say="The general idea of a spirit or liqueur: the warm, aromatic sting of alcohol, sometimes dark and mellow like aged spirits in oak, sometimes sharp and sweet like a fruit liqueur. It sits naturally with amber, woods and tobacco, and makes a perfume feel intoxicating.",
  src=["fr_liquor", "fr_bottle", "fr_boozytrio"],
  vars={
   "Black Cherry Liquor": dict(say="A particular liqueur: dark cherries steeped in spirit, sweet, syrupy and boozy, with cherry's almond edge, rather than spirit in general.", src=["at_amaretto", "fr_blackcherry", "fr_liquor"]),
  }),
 "note-masala-chai": dict(
  say="Indian spiced tea: black tea brewed with milk, sugar and spices like cardamom, cinnamon, ginger, clove and black pepper. As a note it is sweet, spicy and milky, warm and deeply comforting.",
  src=["fr_chai", "ps_chai"]),
 "note-mate": dict(
  say="The South American tea of yerba maté leaves, sipped from a gourd. Its absolute smells like dried, slightly roasted green tea, with hay, herbs and a sun-baked, tobacco-like warmth. It is used in fougères, chypres and tea and tobacco perfumes.",
  src=["fr_mate", "st_mate", "oz_mate"],
  vars={"Maté Tea": dict(same="No change: maté is a tea already.")}),
 "note-moroccan-tea": dict(
  say="North African mint tea: gunpowder green tea brewed with spearmint and plenty of sugar. It smells fresh, green and minty, sweet and a little tannic, clean and refreshing.",
  src=["wp_maghrebi", "fr_alkemia", "fr_whitelabel"],
  vars={
   "Moroccan Tea Absolute": dict(say="Moroccan tea as a real extract, taken with solvents, rather than an accord of tea and mint: denser and more natural, with more of the dry tea leaf and hay under the mint.", src=["fr_whitelabel", "wp_absolute"]),
  }),
 "note-oolong-tea": dict(
  say="The half-oxidised tea between green and black. As a note it is warm and toasted, earthy and sometimes smoky, with a soft, creamy, almost milky smoothness and a gentle herbal side, like the steam from a freshly poured cup.",
  src=["fr_oolong", "fr_pomelooolong"]),
 "note-root-beer": dict(
  say="The North American soft drink once made from sassafras and sarsaparilla roots. Its smell is spicy, creamy, earthy and sweet: wintergreen and a little mint, vanilla, liquorice and anise, with warm spices.",
  src=["fr_rootbeer", "tg_rootbeer"]),
 "note-rum": dict(
  say="The spirit of the sugar cane: warm cane sugar and dark molasses, oak barrels and a sweet heat, sometimes with vanilla, clove, ginger or ripe fruit in it. It gives a perfume an amber, slightly wicked glow and smooths the notes around it.",
  src=["fr_rum", "ps_rum", "fr_rhumagricole"],
  vars={
   "Rhum Agricole": dict(say="Rum from the French Caribbean made from fresh sugar-cane juice rather than molasses: grassier, fresher and more vegetal, less dark and treacly than ordinary rum.", src=["fr_rhumagricole", "fr_rum"]),
  }),
 "note-soda-bubbles": dict(
  say="Fizz rather than a flavour: the prickle of bubbles rising from a glass of soda. Perfumers make it with sparkling aldehydes and airy musks, and it makes the top of a perfume feel effervescent and tingly.",
  src=["fr_sodabubbles", "fr_fizzy"]),
 "note-sparkling-water": dict(
  say="Water with bubbles in it: clean, cold and fizzy, with a faint mineral sharpness. As a note it is an effect, made with aldehydes and musks, and it gives a perfume a bright, prickling, effervescent freshness.",
  src=["fr_sparkling", "fr_fizzy", "wp_carbonated"]),
 "note-tea": dict(
  say="Tea leaves, dry or steeped: slightly tannic and bitter, fresh or dark, a little like hay and dried leaves, calm and grounding. It is mostly built by the perfumer from a handful of materials, and it balances sweetness and powder with its dry, astringent edge.",
  src=["fr_tea", "fr_tourtea", "ps_blacktea"],
  vars={
   "Black Tea": dict(say="Fully oxidised tea, the everyday black tea: darker, maltier and more tannic than green tea, with a dried-leaf, slightly smoky depth.", src=["ps_blacktea", "fr_tourtea"]),
  }),
}
out("BRW", S, N)

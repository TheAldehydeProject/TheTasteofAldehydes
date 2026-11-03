/* The site, as it stood on 2026-11-03: every fragrance on it with notes,
   its year, and every note's accord. A snapshot — see the comment below. */
const DATA = {"accords":[{"c":"CIT","n":"Citrus"},{"c":"ARO","n":"Aromatic & Herbal"},{"c":"GRN","n":"Green"},{"c":"FLO","n":"Floral"},{"c":"FRU","n":"Fruit"},{"c":"SPI","n":"Spice"},{"c":"GOU","n":"Gourmand"},{"c":"BRW","n":"Brews & Spirits"},{"c":"WOO","n":"Woods"},{"c":"CON","n":"Conifers"},{"c":"RES","n":"Resins & Balsams"},{"c":"ANI","n":"Musk, Skin & Animalic"},{"c":"EAR","n":"Earth, Moss & Mineral"},{"c":"AIR","n":"Water & Air"},{"c":"SMK","n":"Smoke & Char"},{"c":"IMP","n":"Impressions"}],"frags":[{"n":"Bindebole","h":"pineward","y":2021,"f":["Poplar Bud","Citrus","Pine Needles","Ambrette","Crushed Leaves","Cedarwood"]},{"n":"Boreal","h":"pineward","y":2020,"f":["Pine Needles","Mint","Cedarwood","Resins","Moss"]},{"n":"Brokilän","h":"pineward","y":2021,"f":["Black Hemlock","Larch Cones","Sandarac","Fir","Sandalwood","Oud"]},{"n":"Cotswold","h":"pineward","y":2021,"f":["Cedarwood","Smoke","Oak","Pine Needles","Vanilla"]},{"n":"Eldritch","h":"pineward","y":2021,"f":["Leather","Myrrh","Patchouli","Fir","Oolong Tea","Opoponax","Smoke","Pine Needles","Sage","Oakmoss"]},{"n":"Fanghorn II","h":"pineward","y":2021,"f":["Fir","Moss","Lichen","Pine Needles","Soil","Damp Vegetation"]},{"n":"Funerie","h":"pineward","y":2022,"f":["Mushroom","Decayed Rose","Leather","Tobacco","Smoke","Pineboard","Incense","Opoponax","Cedarwood","Pine Needles","Oud"]},{"n":"Juniperus","h":"pineward","y":2024,"f":["Lemon","Juniper","Rosemary","Lavender","Juniper Berry","Sandalwood","Patchouli"]},{"n":"Murkwood","h":"pineward","y":2020,"f":["Fir","Black Hemlock","Lapsang Souchong","Moss","Incense","Myrrh"]},{"n":"Nocturnis","h":"pineward","y":2022,"f":["Pine","Juniper","Bergamot","Carnation","Geranium","Chamomile","Hay","Tobacco","Fir","Lavender","Amber","Vetiver","Sandalwood","Oakmoss","Patchouli"]},{"n":"Oxylus","h":"pineward","y":2021,"f":["Pine Needles","Juniper","Vetiver","Myrtle","Soil","Swamp Water"]},{"n":"Snoqualmie","h":"pineward","y":2024,"f":["Sandarac","Tamarack","Balsam","Snoqualmie Forest Evergreens"]},{"n":"Sturbridge","h":"pineward","y":2023,"f":["Baked Apple","Pine","Frankincense","Fir","Spices","Resins","Myrrh","Cedarwood","Amber","Spikenard","Ambergris","Poplar Bud"]},{"n":"White Fir","h":"pineward","y":2022,"f":["Orange","Fir","Pine","Ginger","Clove","Musk","Oakmoss","Anise","Vetiver"]},{"n":"Bucolic","h":"pineward","y":2024,"f":["Sheep Wool","Lanolin","Raspberry","Lavender","Honey","Brown Sugar","Amber","Beeswax","Sweetgrass"]},{"n":"Hayloft","h":"pineward","y":2022,"f":["Hay","Honey","Oat","Wheat","Hazelnut","Almond","Lavender","Grass","Saffron"]},{"n":"Hayride","h":"pineward","y":2022,"f":["Hay","Cacao","Vanilla","Sweet Vernalgrass","Sweetgrass","Bread","Nutmeg","Cardamom","Spikenard","Dried Fruits","Tonka","Oakmoss"]},{"n":"Pastoral","h":"pineward","y":2022,"f":["Apricot","Blackberry","Honey","Propolis","Beeswax","Sweetgrass","Hay","Wheat","Oat","Vetiver","Maté","Oakmoss"]},{"n":"Shire","h":"pineward","y":2024,"f":["Hay","Oat","Hazelnut","Bergamot","Lavender","Herbal Tea","Westfarthing Leaf","Seed Cake","Jasmine","Orris","Honey"]},{"n":"Steading","h":"pineward","y":2020,"f":["Beeswax","Tobacco","Hay","Maple","Barley","Hops","Peat","Pine Needles","Poplar Bud"]},{"n":"Christmas Wine","h":"pineward","y":2020,"f":["Cranberry","Nutmeg","Fir","Plum","Clove","Blood Orange"]},{"n":"Gingerbread","h":"pineward","y":2023,"f":["Ginger","Cinnamon","Clove","Nutmeg","Wheat","Molasses","Brown Sugar","Black Walnut","Milk","Butter","Vanilla","Icing"]},{"n":"Glühwein","h":"pineward","y":2021,"f":["Cranberry","Champaca","Cherry","Raspberry","Fir","Chocolate","Davana","Oakmoss","Tolu Balsam","Rose","Sandalwood","Frankincense"]},{"n":"Revelries","h":"pineward","y":2021,"f":["Clove","Rum","Cinnamon","Oud","Hazelnut"]},{"n":"Acadian","h":"pineward","y":2023,"f":["Yuzu","Bergamot","Juniper Berry","Ivy","Eucalyptus","Waterlily","Goldenrod","Heliotrope","Seaweed","Cedarwood","Oakmoss"]},{"n":"Coastal Veil","h":"pineward","y":2023,"f":["Juniper Berry","Juniper","Sea Water","Seaweed","Cypress","Mushroom","Water Pepper","Eucalyptus","Ambergris","Sandalwood"]},{"n":"Gingermoss","h":"pineward","y":2023,"f":["Ginger","Neroli","Bergamot","Blood Orange","Cedarwood","Rosemary","Leather","Oakmoss"]},{"n":"Subalpine","h":"pineward","y":2025,"f":["Fir","Bergamot","Black Pepper","Cedar Leaf","Sandalwood","Vetiver","Ambrette","Moss"]},{"n":"Akero","h":"pineward","y":2023,"f":["Green Apple","Benzoin","Patchouli","Sandalwood","Cedarwood"]},{"n":"Apple Tabac","h":"pineward","y":2020,"f":["Apple","Tobacco","Fir","Rum Resin","Dried Fruits"]},{"n":"Caravansary","h":"pineward","y":2023,"f":["Fir","Spruce","Tea","Smoke","Chamomile","Incense","Musk","Lavender","Vanilla","Oakmoss"]},{"n":"Clemenpine","h":"pineward","y":2023,"f":["Suede","Leather","Clementine","Tobacco","Ambergris","Pine","Saffron","Passionfruit","Blood Orange","Fir","Sandalwood","Cedarwood","Jasmine","White Lotus"]},{"n":"Coffee Tabac","h":"pineward","y":2024,"f":["Coffee","Tobacco","Cedarwood","Patchouli","Resins","Spices","Frankincense","Guaiac Wood","Vanilla"]},{"n":"Delfiño","h":"pineward","y":2022,"f":["Clementine","Juniper","Tomato Leaf","Vetiver","Sandalwood","Ambergris"]},{"n":"Greymist","h":"pineward","y":2023,"f":["Fir","Pine","Citron","Tobacco","Botanical Musk","Vetiver"]},{"n":"Gristmill","h":"pineward","y":2022,"f":["Cedarwood","Sawdust","Smouldering Logs","Edelwood Oil","Amber","Black Walnut","Mahogany","Labdanum"]},{"n":"Holy Cross","h":"pineward","y":2026,"f":["Juniper","Wet Stone","Musk","Ambrette","Bluebell","Lichen","Watercress","Yarrow","Pine"]},{"n":"Icefall","h":"pineward","y":2021,"f":["Cypress","Grapefruit","Juniper","Nootka","Seaweed","Pine","Cedarwood","Sandalwood"]},{"n":"Ivymoss","h":"pineward","y":2023,"f":["Ivy","Green Tea","Mint","Lime","Lemon Verbena","Waterlily","Cypress","Pine","Cedarwood","Oakmoss","Treemoss","Cedarmoss"]},{"n":"Lime Cola","h":"pineward","y":2025,"f":["Lime","Cherry","Ginger","Rum","Cola","Neroli","Bitter Orange","Sugar","Vanilla","Nutmeg","Coriander","Cinnamon"]},{"n":"Meadowmoss","h":"pineward","y":2023,"f":["Oakmoss","Alpine Sandwort","Grass","Green Wheat","Orange Blossom","Fir","Tomato Leaf","Azure Bluet","Mountain Wildflowers"]},{"n":"Mint Cocoa","h":"pineward","y":2024,"f":["Chocolate","Mint","Patchouli","Vanilla","Spices","Resins","Malt","Cedarwood"]},{"n":"Noki","h":"pineward","y":2022,"f":["Mint","Mango","Litchi","Ambergris","Cassis","Rhubarb","Sandalwood"]},{"n":"Ponderosa","h":"pineward","y":2022,"f":["Ponderosa Resin","Pine Needles","Cedarwood","Vanilla","Strawberry","Cinnamon","Butterscotch","Beeswax","Raisin Cookies"]},{"n":"Pumpkivus","h":"pineward","y":2025,"f":["Pumpkin","Brown Sugar","Vetiver","Osmanthus","Cedarwood","Sandalwood","Patchouli","Hay","Soil","Corn Silk","Corn Silage","Oud"]},{"n":"Tome","h":"pineward","y":2025,"f":["Aged Parchment","Paper","Leather","Tobacco","Tea","Sandalwood","Cedarwood","Orris","Rice","Ambrette","Coffee","Oakmoss","Cypriol"]},{"n":"Treacle","h":"pineward","y":2021,"f":["Tobacco","Lapsang Souchong","Molasses","Honey","Dried Fruits"]},{"n":"Velvetine","h":"pineward","y":2021,"f":["Ambergris","Cypress","Vanilla","Clove","Labdanum","Fir","Dragon's Blood","Sandalwood","Musk","Mousse de Saxe"]},{"n":"Amber Zero","h":"adar","y":0,"t":["Fig Leaf","Ginger","Ozone"],"m":["Saffron","Osmanthus","Mineral Accord"],"b":["Amber","Vetiver","Resins","Ambergris"]},{"n":"Aetherialism","h":"adar","y":0,"t":["Galbanum","Lime","Violet Leaf","Marine Accord"],"m":["Ylang Ylang","Neroli","Myrrh","Clary Sage"],"b":["Vetiver","Cedarwood","Tonka","Leather"]},{"n":"Incantu","h":"adar","y":0,"t":["Honeysuckle","Carob Pods","Sea Salt"],"m":["Honey","Tobacco","Candle Wax"],"b":["Amber Oud","Almond","Petrified Driftwood"]},{"n":"Against All Odds","h":"adar","y":2025,"f":["Oud","Jasmine","Bitter Orange","Sandalwood","Ambergris"]},{"n":"α11 Alpha11","h":"adar","y":0,"t":["Banana","Mint","Saffron"],"m":["Tuberose","Jasmine","Ylang Ylang"],"b":["Tobacco","Incense","Tonka","Civet"]},{"n":"Alta Luna","h":"adar","y":2025,"f":["Musk","Aquatic Notes","Coumarin","Vanilla","Heliotrope","Citrus","Orange Blossom"]},{"n":"ADHD","h":"adar","y":0,"t":["Pink Pepper","Yuzu","Quince","Absinthe"],"m":["Saffron","Green Tea Flowers","Cherry","Murumuru Butter","Myrrh"],"b":["Tonka","Maninka"]},{"n":"Root Code","h":"adar","y":0,"t":["Bergamot","Black Pepper","Pine Needles"],"m":["Petrichor","Clear Orchid","Mineral Accord"],"b":["Patchouli","Rose","Amber","Palo Santo","Oakmoss"]},{"n":"Lignum Dei","h":"adar","y":0,"t":["Cold Night Air","Frankincense"],"m":["Cedarwood","Sawn Resin","Moss","Rose","Oud"],"b":["Myrrh","Aged Parchment","Skin"]},{"n":"Tyrian","h":"adar","y":2026,"f":["Chocolate","Birch Tar","Clary Sage","Honey","Ambergris"]},{"n":"Burning Bridges","h":"almost-human","y":2026,"f":["Woody Notes","Smoke","Spices","Citrus"]},{"n":"Dear Future","h":"almost-human","y":2026,"f":["Ozone","Skin","Amber"]},{"n":"Desert Hope","h":"almost-human","y":2026,"f":["Sand","Resins","Solar Notes","Dust","Woody Notes","Rose"]},{"n":"Ritual Code","h":"almost-human","y":2026,"f":["Resins","Ash","Smoke","Animal Notes","Herbal Notes","Soil"]},{"n":"Silent Rain","h":"almost-human","y":2026,"f":["Soil","Rain Notes","Concrete","Green Notes","Airy Note","Solar Notes"]},{"n":"Amaretto Jazz in the Melting Room","h":"ataraxia","y":2024,"t":["Amaretto","Holy Bread"],"m":["Liquor","Amaretto","Honey","Candle Wax"],"b":["Chocolate","Cognac","Almond","Dusty Sofa","Passionflower","Cocoa Butter","Honeycomb","Vanilla","Tobacco"]},{"n":"Deity","h":"ataraxia","y":2025,"t":["Honey","Japanese Plum","Cherry","Chantilly Cream","Goldenberry"],"m":["Condensed Milk","Tobacco","Cocoa Butter","Beeswax","Snowdrops"],"b":["Frankincense","Labdanum","Cacao","Vanilla","Tonka","Amber","Benzoin","Elemi","Myrrh","Gold","Patchouli","Dates","Nectar"]},{"n":"My Doll’s Makeup","h":"ataraxia","y":0,"t":["Porcelain","Lipstick","Orris","Raspberry","Soda Bubbles"],"m":["Blush","Velvet","Orris","Candle Wax","Chocolate"],"b":["Makeup Palette","Lip Gloss","Eye Pencil","Instant Film","Myrrh"]},{"n":"Spinal Fluid","h":"ataraxia","y":2025,"f":["Myrrh","Marigold","Rose","Cypriol","Hay","Birch Tar","Seaweed","Cumin","Tuberose"]},{"n":"Vestibule","h":"ataraxia","y":2024,"f":["Chocolate","Spices","Dusty Antiques"]},{"n":"5 Years Anniversary","h":"grande-parfums","y":0,"t":["Raspberry","Pink Pepper","Sugar Cane","Cinnamon","Saffron","Clove"],"m":["Chocolate","Ylang Ylang","Cognac","Suede","Honey","Oud","Oak"],"b":["Leather","Musk","Peru Balsam","Tonka","Cedarwood","Labdanum","Vanilla","Benzoin","Tobacco","Honey","Oud","Sandalwood","Vetiver"]},{"n":"Ambresso","h":"grande-parfums","y":0,"t":["Coffee","Allspice","Myrrh"],"m":["Coffee","Rum","Cognac","Tobacco","Beeswax","Dried Fruits","Myrtle","Rose","Nutmeg","Lily of the Valley","Cedarwood"],"b":["Labdanum","Resins","Benzoin","Amber","Castoreum","Vanilla","Tolu Balsam","Peru Balsam","Patchouli","Guaiac Wood","Tonka","Ambergris","Opoponax","Sandalwood","Musk"]},{"n":"Ancient Oud","h":"grande-parfums","y":0,"t":["Oud"],"m":["Oud","Benzoin"],"b":["Oud","Musk","CO2 Extracts"]},{"n":"Choco Powder","h":"grande-parfums","y":0,"t":["Saffron","Cherry","Cacao"],"m":["Chocolate","Osmanthus","Jasmine","Rose"],"b":["Sandalwood","Vanilla","Amberwood"]},{"n":"Cuore","h":"grande-parfums","y":2024,"t":["Incense","Spices","Orris","Red Berries","Clementine","Saffron","Orange"],"m":["Blackberry","Dried Fruits","Blueberry","Liquor","Plum","Plum Blossom","Sugar Cane","Toffee","Lily of the Valley","Strawberry","Myrrh","Fig","Tiare Flower","Cinnamon","Rose","Jasmine","Fir"],"b":["Amber","Tonka","Vanilla","Guaiac Wood","Opoponax","Castoreum","Labdanum","Benzoin","Teak Wood","Cedarwood","Musk","Patchouli"]},{"n":"Dreaming Maldives","h":"grande-parfums","y":0,"t":["Lemon","Pear","Peach","Pink Pepper"],"m":["Yellow Flowers","Freesia","Caramel","Lily of the Valley"],"b":["Vanilla","Musk","Cedarwood","Myrrh"]},{"n":"Giardino di Sorrento","h":"grande-parfums","y":0,"t":["Blood Orange","Grapefruit","Lemon"],"m":["Lily of the Valley","Raspberry Leaf","Neroli","Tuberose","Magnolia","Jasmine","Rose"],"b":["Tuberose","Cashmeran","Amber","Patchouli","Tonka","Vanilla","Musk"]},{"n":"Hot Stuff","h":"grande-parfums","y":0,"t":["Scorched Pineapple","Tobacco"],"m":["Baked Apple"],"b":["Tonka","Vetiver","Oakmoss","Beeswax"]},{"n":"Intimate Spell","h":"grande-parfums","y":0,"t":["Bergamot","Orange Blossom","Rosemary"],"m":["Clove","Cypriol","Geranium","Cedarwood"],"b":["Patchouli","Vetiver","Musk","Labdanum","Benzoin","Guaiac Wood","Amyris"]},{"n":"Karak & Shisha","h":"grande-parfums","y":0,"f":["Peru Balsam","Strawberry","Raspberry","Tea","Cinnamon","Tobacco","Apple","Clove","Bark","Rose","Cardamom","Dried Fruits","Saffron","Ambergris","Labdanum","Masala Chai","Musk","Castoreum","Oud","Beeswax","Vanilla","Tonka","Amber","Tobacco Flower"]},{"n":"Mystical Incense","h":"grande-parfums","y":0,"t":["Frankincense","CO2 Extracts","Litchi","Sparkling Water"],"m":["Frankincense","Dates","Rose"],"b":["Frankincense","Amber","Musk"]},{"n":"Vanilla Ash","h":"grande-parfums","y":0,"t":["Brown Sugar","Raspberry Leaf","Spices","Rum"],"m":["Vanilla","Guaiac Wood","Heliotrope","Lily of the Valley"],"b":["Castoreum","Tonka","Vanilla","Fenugreek","Musk","Frankincense"]},{"n":"Vintage Memoir","h":"grande-parfums","y":0,"t":["Jasmine Tea","Peach","Lemon","Bergamot"],"m":["Orris","Violet Leaf","Jasmine","Ylang Ylang","Geranium","Tuberose","Rose","Carnation","Gardenia"],"b":["Musk","Ambergris","Sandalwood","Clove","Vetiver","Vanilla","Oakmoss","Benzoin","Civet","Patchouli","Tolu Balsam","Tonka","Cedarwood","Labdanum"]},{"n":"White Label","h":"grande-parfums","y":0,"t":["Orange Blossom","Green Mandarin","Pear","Guava","Ginger","CO2 Extracts"],"m":["Mango","Moroccan Tea","Lily of the Valley","Woody Notes","Raspberry","Orange"],"b":["Musk"]},{"n":"Belle Âme","h":"les-abstraits","y":2022,"t":["Orris","Ginger"],"m":["Cacao","Frankincense","Cardamom"],"b":["Tonka","Musk","Sandalwood"]},{"n":"Des Cendres","h":"les-abstraits","y":2023,"t":["Pine Tar","Galbanum","Birch Tar","Mint","Clove"],"m":["Leather","Violet Leaf","Tuberose"],"b":["Oakmoss","Hyrax","Vetiver","Patchouli"]},{"n":"La Douleur Exquise","h":"les-abstraits","y":2022,"t":["Rose","Orris","Frankincense"],"m":["Clove","Cumin","Saffron"],"b":["Castoreum","Patchouli","Cedarwood","Labdanum","Opoponax","Myrrh"]},{"n":"Philosopher’s Walk","h":"les-abstraits","y":2025,"t":["Bergamot","Lemon","Neroli","Orange Blossom","Pink Pepper","Cardamom","Clove","Cinnamon","Artemisia","Juniper"],"m":["Geranium","Clary Sage","Carnation","Violet","Lavender"],"b":["Cedarmoss","Vetiver","Patchouli","Costus","Musk","Benzoin","Tonka","Vanilla"]},{"n":"Watch King","h":"lost-tribe","y":0,"f":["Oud","Incense","Benzoin","Vanilla","Amber","Leather","Rose"]},{"n":"Dirty Soda","h":"lost-tribe","y":0,"t":["Lime","Orange","Bergamot","Pink Pepper"],"m":["Cassia","Coriander","Neroli","Clove"],"b":["Oud","Vanilla","Tonka","Benzoin","Patchouli","Sandalwood","Cedarwood"]},{"n":"Equatorial","h":"lost-tribe","y":0,"f":["Frankincense","Lavender","Bergamot","Petitgrain","Pink Pepper","Ambergris","Fir","Cypress","Patchouli","Spruce","Juniper","Clary Sage","Mint-Sandalwood Co-Distillation","Musk","Oud","Oakmoss","Cedarwood","Vetiver","Thyme","Bakhoor"]},{"n":"Santal Absolu","h":"lost-tribe","y":0,"f":["Sandalwood","Costus","Lavender","Orris","Rose","Ylang Ylang","Benzoin","Vanilla"]},{"n":"Pan’s Labyrinth","h":"lost-tribe","y":0,"t":["Bergamot","Rose","Powder Accord","Almond","Ambergris"],"m":["Lavender","Coumarin","Rose","Ylang Ylang","Patchouli"],"b":["Sandalwood","Musk","Oud","Oakmoss","Treemoss","Fir","Labdanum","Bakhoor"]},{"n":"Lust","h":"om-parfums","y":2023,"f":["Rum","Cherry","Whiskey","Anise","Tobacco","Patchouli","Cedarwood","Benzoin","Tolu Balsam","Oakmoss","Cashmeran","Cabreuva","Labdanum","Caramel","Suede","Animal Notes","Oak Barrel"]},{"n":"Burnana","h":"om-parfums","y":2024,"f":["Banana","Apple","Smoke","Frankincense","Styrax","Cade Oil","Copaiba Balsam","Underground Tunnel","Tomato Leaf","Fruity Notes","Amber","Guaiac Wood","Vetiver","Woody Notes","Benzoin","Osmanthus","Huang Qi","Oud","Beeswax","Oakmoss","Civet","Castoreum"]},{"n":"Dark Night of the Soul","h":"om-parfums","y":2024,"f":["Cacao","Oud","Castoreum","Paprika","Milk","Civet","Hinoki","Amyris","Plum","Jasmine","Butter","Orris","Guaiac Wood","Oak","Sichuan Pepper","Sandalwood","Patchouli","Cheese","Vanilla","Oakmoss","Jonquil","Amber","Lemon","Cedarwood"]},{"n":"This Too Shall Pass","h":"om-parfums","y":0,"f":["Benzoin","Apricot","Peach","Butterscotch","Mint","Cacao","Oud","Vetiver","Linden Blossom","Gardenia","Champaca","Coconut Milk","Sandalwood","Patchouli","Tobacco"]},{"n":"When the Linden Blooms","h":"om-parfums","y":2024,"f":["Bergamot","Linden Blossom","Jasmine","Apricot","Lilac","Green Tea","Osmanthus","Buddhawood","Sandalwood","Clary Sage","Maté","Iso E Super","Amberwood","Cannabis","Benzoin","Vanilla","Oud","Musk"]},{"n":"Oud de Pasión","h":"om-parfums","y":0,"f":["Passionfruit","Gardenia","Chocolate Cake","Orange Blossom","Cocktail Accord","Patchouli","Sandalwood","Civet","Tobacco","Cacao","Vanilla","Benzoin","Musk","Oud"]},{"n":"Dragon’s Breath","h":"outsider-parfums","y":2026,"f":["Lava","Shiso","Geranium","Turmeric","Birch Tar","Cacao","Vetiver","Styrax","Metallic Notes","Tea","Maté","Vanilla","Oud","Oakmoss"]},{"n":"Draco","h":"outsider-parfums","y":0,"f":["Frankincense","Green Apple","Aquatic Notes","Patchouli","Castoreum","Lavender","Geranium","Leather","Tobacco","Civet","Musk","Pea","Oud","Cedarwood","Cade Oil","Evernyl"]},{"n":"Xocolate Crotch","h":"outsider-parfums","y":0,"f":["Clove","Gardenia","Orange","Chocolate","Sandalwood","Smoke","Leather","Dulce de Leche","Civet","Tobacco","Cream","Woody Notes","Patchouli","Whiskey","Cashmeran"]},{"n":"Guilty as Charged","h":"outsider-parfums","y":0,"f":["Airy Note","Bergamot","Lime","Orange","Neroli","Lily of the Valley","Angelica Root","Leather","Orange Blossom","Cedarwood","Patchouli","Saffron","Pine","Soil","Vetiver","Cashmeran","Musk","Oakmoss"]},{"n":"Amaretto Coffee","h":"outsider-parfums","y":0,"f":["Amaretto","Vanilla","Coffee","Cedarwood","Sandalwood","Jasmine","Popcorn","Musk","Chocolate"]},{"n":"Vocal","h":"qimu-musicians","y":0,"t":["Mint","Lily of the Valley"],"m":["Saffron","Violet"],"b":["Orris","Musk"]},{"n":"3 Feet 5","h":"tombstone","y":2024,"t":["Heliotrope"],"m":["Jasmine","Mimosa"],"b":["Orris","Smoke"]},{"n":"Evergrow","h":"tombstone","y":2025,"t":["Galbanum","Bergamot"],"m":["Rose","Labdanum","Orris"],"b":["Oakmoss","Patchouli","Musk"]},{"n":"No Need to Come By","h":"tombstone","y":0,"t":["Mint","Thyme","Black Pepper","Turpentine"],"m":["Myrrh","Frankincense","Jasmine"],"b":["Patchouli","Tonka","Sandalwood"]},{"n":"Sing at My Funeral","h":"tombstone","y":0,"t":["Mint","Honey","Neroli"],"m":["Jasmine","Lily of the Valley","Orris"],"b":[]},{"n":"Sweet Coffin","h":"tombstone","y":2024,"t":["Willow Bark","Apricot"],"m":["Moldy Cedarwood","Nutmeg"],"b":["Dead Water"]},{"n":"Kogen","h":"apoteker-tepe","y":2024,"f":["Yuzu","Pear","Ginger","Birch","Hinoki","Peat","Vetiver","Incense","Smoke","Hiba","Pine Needles","Oakmoss","Kuromoji"]},{"n":"The Holy Mountain","h":"apoteker-tepe","y":2015,"f":["Pine Smoke","Incense","Fir","Labdanum","Guaiac Wood"]},{"n":"Karasu","h":"apoteker-tepe","y":2016,"f":["Costus","Siam Wood","Hinoki","Paper","Cardamom"]},{"n":"The Peradam","h":"apoteker-tepe","y":2015,"f":["Lily","Jasmine","Orris","Sandalwood"]},{"n":"Pale Fire","h":"apoteker-tepe","y":2016,"f":["Amber","Frankincense","Oakmoss","Whiskey","Cacao"]},{"n":"Anabasis","h":"apoteker-tepe","y":2015,"f":["Citrus","Shiso","Birch","Mint","Pine","Cedarwood","Musk"]},{"n":"After the Flood","h":"apoteker-tepe","y":2015,"f":["Violet Leaf","Waterlily","Mushroom","Patchouli","Soil"]},{"n":"Brother Night","h":"apoteker-tepe","y":2016,"f":["Copal","Marigold","Frankincense","Smoke"]},{"n":"CV99","h":"lussur","y":0,"t":["Balsamic Vinegar","Cherry","Citrus","Milk"],"m":["Cinnamon","Clove","Black Pepper"],"b":["Woody Notes","Caramel","Smoke","Oak"]},{"n":"De Profundis","h":"serge-lutens","y":2011,"f":["Chrysanthemum","Green Notes","Violet","Soil","Incense","Plum"]},{"n":"Haxan","h":"parfum-prissana","y":2018,"f":["Lavender","Birch","Cedarwood","Fir","Guaiac Wood","Cypriol","Sandalwood","Wormwood","Styrax","Pine Needles","Saffron","Thyme","Rosemary","Black Pepper","Nutmeg","Caraway","Cinnamon","Violet Leaf","Tobacco","Mushroom","Basil","Marjoram","Vetiver","Goat Hair","Seaweed"]},{"n":"Tobacolor","h":"dior","y":2021,"f":["Tobacco","Honey","Smoke","Plum","Amber","Oriental Notes","Peach","Citrus"]},{"n":"Flamenco EDP","h":"ramon-monegal","y":2017,"t":["Raspberry","Apple","Violet","Orange Blossom"],"m":["Rose","Jasmine","Orris"],"b":["Cedarwood","Cypress","Amber","Pine"]},{"n":"French Riviera","h":"mancera","y":2022,"t":["Lemon","Orange","Tangerine","Ginger","Black Pepper"],"m":["Marine Accord","Tiare Flower","Pine","Mimosa","Vetiver"],"b":["Sea Salt","Musk","Amber"]},{"n":"Velvet Fog","h":"casa-goa","y":0,"t":["Neroli"],"m":["Lavender","Ylang Ylang"],"b":["Orris","Vetiver","Sandalwood","Honey"]},{"n":"House of Ellixirz","h":"matca","y":2021,"t":["Lemon","Petitgrain"],"m":["Cassia","Rose"],"b":["Cypriol","Tobacco","Leather","Birch Tar","Vanilla","Caramel"]},{"n":"Fir of the Light","h":"jmp-artisan-perfumes","y":0,"t":["Spruce","Incense","Orange","Lemon","Black Pepper"],"m":["Cedarwood","Papyrus","Cashmeran","Nutmeg","Sage"],"b":["Fir","Incense","Woody Notes","Oakmoss","Ambergris"]},{"n":"Fir of the Dark","h":"jmp-artisan-perfumes","y":2024,"t":["Incense","Spruce","Black Pepper","Cypress","Galbanum"],"m":["Incense","Cedarwood","Leather","Sage"],"b":["Fir","Cade Oil","Vetiver","Oakmoss"]},{"n":"Quintessentially Amber","h":"sultan-pasha-perfumes","y":2025,"f":["Citrus","Aldehydes","Spices","Rose","Amber","Labdanum","Benzoin","Styrax","Musk","Patchouli","Vetiver","Sandalwood","Vanilla","Ambergris"]},{"n":"Forbidden Flower","h":"areej-le-dore","y":2024,"t":["Skunk Oil","Grapefruit","Cannabis"],"m":["Jasmine","Night Blooming Jasmine","Sandalwood"],"b":["Patchouli","Cedarwood","Benzoin","Vetiver","Turmeric","Vanilla","Ginger","Coriander","Lime"]},{"n":"Ore","h":"slumberhouse","y":2009,"f":["Oak","Vanilla","Guaiac Wood","Peru Balsam","Tolu Balsam","Amber","Muhuhu","Benzoin","Cacao","Patchouli","Milk","Bushman Candle Resin"]}],"notes":{"Poplar Bud":["GRN"],"Citrus":["CIT"],"Pine Needles":["CON"],"Ambrette":["ANI"],"Crushed Leaves":["GRN"],"Cedarwood":["WOO"],"Mint":["ARO"],"Resins":["RES"],"Moss":["EAR"],"Black Hemlock":["CON"],"Larch Cones":["CON"],"Sandarac":["RES"],"Fir":["CON"],"Sandalwood":["WOO"],"Oud":["WOO"],"Smoke":["SMK"],"Oak":["WOO"],"Vanilla":["GOU"],"Leather":["ANI"],"Myrrh":["RES"],"Patchouli":["WOO"],"Oolong Tea":["BRW"],"Opoponax":["RES"],"Sage":["ARO"],"Oakmoss":["EAR"],"Lichen":["EAR"],"Soil":["EAR"],"Damp Vegetation":["EAR"],"Mushroom":["EAR"],"Decayed Rose":["IMP"],"Tobacco":["GOU"],"Pineboard":["WOO"],"Incense":["RES"],"Lemon":["CIT"],"Juniper":["CON"],"Rosemary":["ARO"],"Lavender":["ARO"],"Juniper Berry":["ARO"],"Lapsang Souchong":["BRW"],"Pine":["CON"],"Bergamot":["CIT"],"Carnation":["FLO"],"Geranium":["FLO"],"Chamomile":["ARO"],"Hay":["GRN"],"Amber":["RES"],"Vetiver":["WOO"],"Myrtle":["ARO"],"Swamp Water":["EAR"],"Tamarack":["CON"],"Balsam":["RES"],"Snoqualmie Forest Evergreens":["CON"],"Baked Apple":["GOU"],"Frankincense":["RES"],"Spices":["SPI"],"Spikenard":["EAR"],"Ambergris":["ANI"],"Orange":["CIT"],"Ginger":["SPI"],"Clove":["SPI"],"Musk":["ANI"],"Anise":["SPI"],"Sheep Wool":["ANI"],"Lanolin":["ANI"],"Raspberry":["FRU"],"Honey":["GOU"],"Brown Sugar":["GOU"],"Beeswax":["GOU"],"Sweetgrass":["GRN"],"Oat":["GOU"],"Wheat":["GOU"],"Hazelnut":["GOU"],"Almond":["GOU"],"Grass":["GRN"],"Saffron":["SPI"],"Cacao":["GOU"],"Sweet Vernalgrass":["GRN"],"Bread":["GOU"],"Nutmeg":["SPI"],"Cardamom":["SPI"],"Dried Fruits":["FRU"],"Tonka":["GOU"],"Apricot":["FRU"],"Blackberry":["FRU"],"Propolis":["RES"],"Maté":["BRW"],"Herbal Tea":["BRW"],"Westfarthing Leaf":["IMP"],"Seed Cake":["GOU"],"Jasmine":["FLO"],"Orris":["FLO"],"Maple":["GOU"],"Barley":["GOU"],"Hops":["ARO"],"Peat":["EAR"],"Cranberry":["FRU"],"Plum":["FRU"],"Blood Orange":["CIT"],"Cinnamon":["SPI"],"Molasses":["GOU"],"Black Walnut":["GOU"],"Milk":["GOU"],"Butter":["GOU"],"Icing":["GOU"],"Champaca":["FLO"],"Cherry":["FRU"],"Chocolate":["GOU"],"Davana":["ARO"],"Tolu Balsam":["RES"],"Rose":["FLO"],"Rum":["BRW"],"Yuzu":["CIT"],"Ivy":["GRN"],"Eucalyptus":["ARO"],"Waterlily":["FLO"],"Goldenrod":["FLO"],"Heliotrope":["FLO"],"Seaweed":["AIR"],"Sea Water":["AIR"],"Cypress":["CON"],"Water Pepper":["SPI"],"Neroli":["FLO"],"Black Pepper":["SPI"],"Cedar Leaf":["CON"],"Green Apple":["FRU"],"Benzoin":["RES"],"Apple":["FRU"],"Rum Resin":["RES"],"Spruce":["CON"],"Tea":["BRW"],"Suede":["ANI"],"Clementine":["CIT"],"Passionfruit":["FRU"],"White Lotus":["FLO"],"Coffee":["BRW"],"Guaiac Wood":["WOO"],"Tomato Leaf":["GRN"],"Citron":["CIT"],"Botanical Musk":["ANI"],"Sawdust":["WOO"],"Smouldering Logs":["SMK"],"Edelwood Oil":["WOO"],"Mahogany":["WOO"],"Labdanum":["RES"],"Wet Stone":["EAR"],"Bluebell":["FLO"],"Watercress":["GRN"],"Yarrow":["ARO"],"Grapefruit":["CIT"],"Nootka":["CON"],"Green Tea":["BRW"],"Lime":["CIT"],"Lemon Verbena":["ARO"],"Treemoss":["EAR"],"Cedarmoss":["EAR"],"Cola":["BRW"],"Bitter Orange":["CIT"],"Sugar":["GOU"],"Coriander":["SPI"],"Alpine Sandwort":["FLO"],"Green Wheat":["GRN"],"Orange Blossom":["FLO"],"Azure Bluet":["FLO"],"Mountain Wildflowers":["FLO"],"Malt":["GOU"],"Mango":["FRU"],"Litchi":["FRU"],"Cassis":["FRU"],"Rhubarb":["GRN"],"Ponderosa Resin":["RES"],"Strawberry":["FRU"],"Butterscotch":["GOU"],"Raisin Cookies":["GOU"],"Pumpkin":["GOU"],"Osmanthus":["FLO"],"Corn Silk":["GRN"],"Corn Silage":["GRN"],"Aged Parchment":["IMP"],"Paper":["IMP"],"Rice":["GOU"],"Cypriol":["WOO"],"Dragon's Blood":["RES"],"Mousse de Saxe":["IMP"],"Fig Leaf":["GRN"],"Ozone":["AIR"],"Mineral Accord":["EAR"],"Galbanum":["GRN"],"Violet Leaf":["GRN"],"Marine Accord":["AIR"],"Ylang Ylang":["FLO"],"Clary Sage":["ARO"],"Honeysuckle":["FLO"],"Carob Pods":["GOU"],"Sea Salt":["AIR"],"Candle Wax":["IMP"],"Amber Oud":["WOO"],"Petrified Driftwood":["WOO"],"Banana":["FRU"],"Tuberose":["FLO"],"Civet":["ANI"],"Aquatic Notes":["AIR"],"Coumarin":["GOU"],"Pink Pepper":["SPI"],"Quince":["FRU"],"Absinthe":["BRW"],"Green Tea Flowers":["FLO"],"Murumuru Butter":["GOU"],"Maninka":["FRU"],"Petrichor":["EAR"],"Clear Orchid":["FLO"],"Palo Santo":["SMK"],"Cold Night Air":["AIR"],"Sawn Resin":["RES"],"Skin":["ANI"],"Birch Tar":["SMK"],"Woody Notes":["WOO"],"Sand":["EAR"],"Solar Notes":["AIR"],"Dust":["EAR"],"Ash":["SMK"],"Animal Notes":["ANI"],"Herbal Notes":["ARO"],"Rain Notes":["AIR"],"Concrete":["EAR"],"Green Notes":["GRN"],"Airy Note":["AIR"],"Amaretto":["BRW"],"Holy Bread":["GOU"],"Liquor":["BRW"],"Cognac":["BRW"],"Dusty Sofa":["IMP"],"Passionflower":["FLO"],"Cocoa Butter":["GOU"],"Honeycomb":["GOU"],"Japanese Plum":["FRU"],"Chantilly Cream":["GOU"],"Goldenberry":["FRU"],"Condensed Milk":["GOU"],"Snowdrops":["FLO"],"Elemi":["RES"],"Gold":["IMP"],"Dates":["FRU"],"Nectar":["FLO"],"Porcelain":["IMP"],"Lipstick":["IMP"],"Soda Bubbles":["BRW"],"Blush":["IMP"],"Velvet":["IMP"],"Makeup Palette":["IMP"],"Lip Gloss":["IMP"],"Eye Pencil":["IMP"],"Instant Film":["IMP"],"Marigold":["FLO"],"Cumin":["SPI"],"Dusty Antiques":["IMP"],"Sugar Cane":["GRN"],"Peru Balsam":["RES"],"Allspice":["SPI"],"Lily of the Valley":["FLO"],"Castoreum":["ANI"],"CO2 Extracts":["IMP"],"Amberwood":["WOO"],"Red Berries":["FRU"],"Blueberry":["FRU"],"Plum Blossom":["FLO"],"Toffee":["GOU"],"Fig":["FRU"],"Tiare Flower":["FLO"],"Teak Wood":["WOO"],"Pear":["FRU"],"Peach":["FRU"],"Yellow Flowers":["FLO"],"Freesia":["FLO"],"Caramel":["GOU"],"Raspberry Leaf":["GRN"],"Magnolia":["FLO"],"Cashmeran":["WOO"],"Scorched Pineapple":["FRU"],"Amyris":["WOO"],"Bark":["WOO"],"Masala Chai":["BRW"],"Tobacco Flower":["FLO"],"Sparkling Water":["BRW"],"Fenugreek":["SPI"],"Jasmine Tea":["BRW"],"Gardenia":["FLO"],"Green Mandarin":["CIT"],"Guava":["FRU"],"Moroccan Tea":["BRW"],"Pine Tar":["SMK"],"Hyrax":["ANI"],"Artemisia":["ARO"],"Violet":["FLO"],"Costus":["ANI"],"Cassia":["SPI"],"Petitgrain":["CIT"],"Mint-Sandalwood Co-Distillation":["ARO"],"Thyme":["ARO"],"Bakhoor":["RES"],"Powder Accord":["IMP"],"Whiskey":["BRW"],"Cabreuva":["WOO"],"Oak Barrel":["WOO"],"Styrax":["RES"],"Cade Oil":["SMK"],"Copaiba Balsam":["RES"],"Underground Tunnel":["IMP"],"Fruity Notes":["FRU"],"Huang Qi":["ARO"],"Paprika":["SPI"],"Hinoki":["CON"],"Sichuan Pepper":["SPI"],"Cheese":["GOU"],"Jonquil":["FLO"],"Linden Blossom":["FLO"],"Coconut Milk":["GOU"],"Lilac":["FLO"],"Buddhawood":["WOO"],"Iso E Super":["WOO"],"Cannabis":["GRN"],"Chocolate Cake":["GOU"],"Cocktail Accord":["BRW"],"Lava":["EAR"],"Shiso":["ARO"],"Turmeric":["SPI"],"Metallic Notes":["EAR"],"Pea":["GRN"],"Evernyl":["EAR"],"Dulce de Leche":["GOU"],"Cream":["GOU"],"Angelica Root":["ARO"],"Popcorn":["GOU"],"Mimosa":["FLO"],"Turpentine":["RES"],"Willow Bark":["WOO"],"Moldy Cedarwood":["WOO"],"Dead Water":["AIR"],"Birch":["WOO"],"Hiba":["CON"],"Kuromoji":["ARO"],"Pine Smoke":["SMK"],"Siam Wood":["WOO"],"Lily":["FLO"],"Copal":["RES"],"Balsamic Vinegar":["GOU"],"Chrysanthemum":["FLO"],"Wormwood":["ARO"],"Caraway":["SPI"],"Basil":["ARO"],"Marjoram":["ARO"],"Goat Hair":["ANI"],"Oriental Notes":["IMP"],"Tangerine":["CIT"],"Papyrus":["WOO"],"Aldehydes":["AIR"],"Skunk Oil":["ANI"],"Night Blooming Jasmine":["FLO"],"Muhuhu":["WOO"],"Bushman Candle Resin":["RES"]}};
/* ============================================================
   TEST PAGE 4 — THE SCENT LANDSCAPE (2026-11-03, in place of the Network
   Map).

   The owner: "Recreate test page 4 with the remaining images ... page 4
   surprise me." The remaining pictures: a block of terrain in isometric
   with a plane of gold contour lines floating over it, ruled down to its
   corners; and a site drawn as an architect draws one — a coordinate grid
   lettered and numbered along its edges, dashed circles, a survey tower on
   a slab of ground, and the ground again below in wireframe.

   Here every note named on the site is a hill: the land is the Note
   Library's sixteen accords, each a corner of the square, and every note a
   rise in its accord's corner as high as how many of the site's fragrances
   name it. Over it, its contours in gold; under it, its wireframe and the
   grid. The surprise: the land GROWS — press Grow and it rises year by
   year, from the first fragrance on the site to the last — and a survey
   tower stands on it: press anywhere and it walks there and says what is
   underfoot. The gold plane can be lowered until it cuts the hills, and
   whatever stands above it is named. Drag to turn it. A snapshot of the
   site, written in above: nothing on the site reads this page.
   ============================================================ */
(function () {
  "use strict";
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const el = (s) => document.querySelector(s);

  // ---- THE DATA -----------------------------------------------------------
  const D = DATA;
  const ACC = {}; D.accords.forEach((a) => (ACC[a.c] = a.n));
  const notesOf = (f) => (f.f ? f.f : [].concat(f.t || [], f.m || [], f.b || []));
  const FR = D.frags;
  const YEARS = Array.from(new Set(FR.map((f) => f.y).filter(Boolean))).sort((a, b) => a - b);
  const Y0 = YEARS[0], Y1 = YEARS[YEARS.length - 1];
  const NONE = Y1 + 1;                          // "no year found", counted last
  const yearOf = (f) => f.y || NONE;
  const NOTES = Object.keys(D.notes);
  const uses = {};                              // a note's fragrances' years
  FR.forEach((f) => notesOf(f).forEach((n) => (uses[n] = uses[n] || []).push(yearOf(f))));
  const ZONES = [["CIT", "ARO", "GRN", "AIR"], ["FRU", "FLO", "IMP", "CON"], ["SPI", "GOU", "BRW", "WOO"], ["RES", "SMK", "EAR", "ANI"]];
  const POS = {};
  const byZone = {};
  NOTES.forEach((n) => { if (!uses[n]) return; const a = D.notes[n][0] || "IMP"; (byZone[a] = byZone[a] || []).push(n); });
  ZONES.forEach((row, j) => row.forEach((a, i) => {
    const list = (byZone[a] || []).sort((x, y) => uses[y].length - uses[x].length || (x < y ? -1 : 1));
    const cx = -0.75 + i * 0.5, cz = -0.75 + j * 0.5;
    list.forEach((n, k) => {
      const r = 0.2 * Math.sqrt((k + 0.4) / Math.max(list.length, 6)), th = k * 2.39996323 + i + j * 0.6;
      POS[n] = { x: cx + Math.cos(th) * r, z: cz + Math.sin(th) * r, a };
    });
  }));
  const PLACED = Object.keys(POS);
  const MOST = Math.max(...PLACED.map((n) => uses[n].length));

  // ---- THE PAGE -------------------------------------------------------------
  const cv = el(".t4-scene");
  const ctx = cv.getContext("2d");
  const tip = el(".t4-tip");
  let W = 0, H = 0, DPR = 1, phone = false;
  let K = 200, CX = 0, CY = 0;
  const LIFT = 0.62;
  let yaw = -0.62, yawGoal = -0.62;
  let G = 56;                                   // the land's grid, a side
  const Y = { plane: 1.75, land: 0, grid: -0.42, wire: -1.25 };
  const HMAX = 1.2;                             // the highest hill, in heights

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    phone = W < 760;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + "px"; cv.style.height = H + "px";
    const g = phone ? 40 : 56;
    if (g !== G || GROUND.length === 1) {
      G = g;
      groundOf();
      const full = heights(NONE);
      hFull = 0; for (const v of full) if (v > hFull) hFull = v;
      if (h.length > 1) h = heights(year);
      contours = null;
    }
    const head = el(".t4-head").getBoundingClientRect().bottom + 10;
    const foot = (phone ? el(".t4-controls").getBoundingClientRect().top : H - 70) - 10;
    const up = 1 + (Y.plane + 0.1) * LIFT, down = 1 + (-Y.wire + 0.1) * LIFT;
    K = Math.max(60, Math.min((foot - head) / (up + down), phone ? W * 0.23 : W * 0.15));
    CX = phone ? W * 0.5 : W * 0.53;
    // (the room left over, shared above and below)
    CY = head + up * K + Math.max(0, (foot - head) - (up + down) * K) / 2;
    landDirty = true;
  }
  const c30 = Math.cos(Math.PI / 6);
  function P(x, y, z, o) {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const xr = x * c - z * s, zr = x * s + z * c;
    o = o || {};
    o.x = CX + (xr - zr) * K * c30;
    o.y = CY + (xr + zr) * K * 0.5 - y * K * LIFT;
    o.d = xr + zr;
    return o;
  }
  function unground(X, Yw, y) {
    // the window -> the plane at height y
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const u = (X - CX) / (K * c30), v = (Yw - CY + y * K * LIFT) / (K * 0.5);
    const xr = (u + v) / 2, zr = (v - u) / 2;
    return { x: xr * c + zr * s, z: -xr * s + zr * c };
  }

  // ---- THE LAND: heights as the year has it ---------------------------------
  let year = NONE, yearShown = NONE;            // every fragrance, to begin with
  let h = new Float32Array(1), hMax = 1, landDirty = true;
  function heights(atYear) {
    const n = G + 1, out = new Float32Array(n * n);
    const pts = [];
    for (const nm of PLACED) {
      let k = 0;
      for (const y of uses[nm]) if (y <= Math.floor(atYear)) k++;
      // the year being grown into, in part
      const frac = atYear - Math.floor(atYear);
      if (frac > 0) for (const y of uses[nm]) if (y === Math.floor(atYear) + 1) k += frac;
      if (k > 0) pts.push([POS[nm].x, POS[nm].z, k]);
    }
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = -1 + (2 * i) / G, z = -1 + (2 * j) / G;
      let v = 0;
      for (const [px, pz, k] of pts) {
        // a hill as broad as it is high, and the most named not so far
        // above the rest that the rest are lost
        const s = 0.07 + Math.sqrt(k) * 0.011;
        const d2 = (x - px) * (x - px) + (z - pz) * (z - pz);
        if (d2 < s * s * 16) v += Math.pow(k, 0.72) * Math.exp(-d2 / (2 * s * s));
      }
      out[j * n + i] = v + GROUND[j * n + i];
    }
    return out;
  }
  // a little ground of its own, so the land is never quite flat: a few
  // waves of their own lengths and turns, crossing
  let GROUND = new Float32Array(1);
  function groundOf() {
    const n = G + 1, R = rng(9), waves = Array.from({ length: 7 }, () => [R() * TAU, 3 + R() * 9, R() * TAU, 0.08 + R() * 0.14]);
    GROUND = new Float32Array(n * n);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = -1 + (2 * i) / G, z = -1 + (2 * j) / G;
      let v = 0;
      for (const [a, f, p, amp] of waves) v += amp * (1 + Math.sin((x * Math.cos(a) + z * Math.sin(a)) * f + p));
      GROUND[j * n + i] = v * 0.55 + R() * 0.05;
    }
  }
  let hFull = 1;
  function setYear(y) {
    const turned = Math.floor(y) !== Math.floor(year);
    year = y;
    h = heights(y);
    hMax = hFull;
    contours = null;
    landDirty = true;
    el(".t4-year").value = String(Math.min(y, NONE));
    el("[data-v=year]").textContent = y >= NONE ? "every year, and none" : Math.floor(y) <= Y0 - 1 ? "—" : String(Math.floor(y));
    const n = FR.filter((f) => yearOf(f) <= Math.floor(y)).length;
    el("[data-v=count]").textContent = String(n);
    if (turned && survey) surveyAt(tower.tx, tower.tz);
  }
  const hAt = (i, j) => h[j * (G + 1) + i] / hMax * HMAX;
  function heightAtXZ(x, z) {
    const fi = clamp((x + 1) / 2 * G, 0, G), fj = clamp((z + 1) / 2 * G, 0, G);
    const i = Math.min(G - 1, Math.floor(fi)), j = Math.min(G - 1, Math.floor(fj)), u = fi - i, v = fj - j;
    return lerp(lerp(hAt(i, j), hAt(i + 1, j), u), lerp(hAt(i, j + 1), hAt(i + 1, j + 1), u), v);
  }

  // the land drawn into a picture of its own when it changes: every cell a
  // little face, shaded as the light from the upper left finds it, the
  // nearest last; its two seen sides; drawn while it turns or grows, laid
  // down as it is otherwise
  const landPic = document.createElement("canvas");
  const lctx = landPic.getContext("2d");
  function drawLand() {
    landDirty = false;
    landPic.width = cv.width; landPic.height = cv.height;
    const c = lctx;
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = G + 1, step = 2 / G;
    const cells = [];
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      const x = -1 + (i + 0.5) * step, z = -1 + (j + 0.5) * step;
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      cells.push([i, j, (x * cy - z * sy) + (x * sy + z * cy)]);
    }
    cells.sort((a, b) => a[2] - b[2]);
    // the light: from the upper left and above, turned with the land
    const lx = -0.55, ly = 0.75, lz = -0.38;
    const O = [{}, {}, {}, {}];
    for (const [i, j] of cells) {
      const h00 = hAt(i, j), h10 = hAt(i + 1, j), h01 = hAt(i, j + 1), h11 = hAt(i + 1, j + 1);
      const x0 = -1 + i * step, z0 = -1 + j * step;
      P(x0, h00, z0, O[0]); P(x0 + step, h10, z0, O[1]); P(x0 + step, h11, z0 + step, O[2]); P(x0, h01, z0 + step, O[3]);
      // the face's normal, from its slopes
      const dx = ((h10 - h00) + (h11 - h01)) / 2 / step, dz = ((h01 - h00) + (h11 - h10)) / 2 / step;
      const nl = Math.hypot(dx * LIFT, 1, dz * LIFT);
      let lit = (-dx * LIFT * lx + ly - dz * LIFT * lz) / nl;
      lit = clamp(lit, 0, 1);
      const hh = (h00 + h11) / 2 / HMAX;
      // rock to snow: the higher, the paler
      const base = 52 + hh * 110, v = clamp(base * 0.35 + lit * (120 + hh * 120), 20, 238);
      const r = Math.round(v + 4), g = Math.round(v + 2), b = Math.round(v - 2 + (1 - lit) * 10);
      c.fillStyle = c.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
      c.beginPath(); c.moveTo(O[0].x, O[0].y); c.lineTo(O[1].x, O[1].y); c.lineTo(O[2].x, O[2].y); c.lineTo(O[3].x, O[3].y); c.closePath();
      c.fill(); c.lineWidth = 0.6; c.stroke();
    }
    // the slab's two seen sides, down to its foot
    const foot = -0.16;
    const edges = [[[-1, -1], [1, -1]], [[1, -1], [1, 1]], [[1, 1], [-1, 1]], [[-1, 1], [-1, -1]]];
    for (const [[ax, az], [bx, bz]] of edges) {
      const nx = bz - az, nz = -(bx - ax);
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      if ((nx * cy - nz * sy) + (nx * sy + nz * cy) <= 0) continue;
      c.beginPath();
      for (let k = 0; k <= G; k++) {
        const t = k / G, x = lerp(ax, bx, t), z = lerp(az, bz, t);
        P(x, heightAtXZ(x, z), z, O[0]);
        if (k) c.lineTo(O[0].x, O[0].y); else c.moveTo(O[0].x, O[0].y);
      }
      P(bx, foot, bz, O[1]); c.lineTo(O[1].x, O[1].y);
      P(ax, foot, az, O[2]); c.lineTo(O[2].x, O[2].y);
      c.closePath();
      c.fillStyle = "rgb(58,60,66)"; c.fill();
      c.strokeStyle = "rgba(200,205,214,0.35)"; c.lineWidth = 0.8; c.stroke();
    }
  }

  // ---- ITS CONTOURS, in gold, for the plane over it --------------------------
  let contours = null;
  const LEVELS = 9;
  function makeContours() {
    contours = [];
    const n = G + 1, step = 2 / G;
    for (let k = 1; k <= LEVELS; k++) {
      const lv = (k / (LEVELS + 1)) * HMAX * 0.95;
      const segs = [];
      for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
        const a = hAt(i, j), b = hAt(i + 1, j), c = hAt(i + 1, j + 1), d = hAt(i, j + 1);
        const x0 = -1 + i * step, z0 = -1 + j * step;
        const pts = [];
        const cut = (p, q, xa, za, xb, zb) => { if ((p - lv) * (q - lv) < 0) { const t = (lv - p) / (q - p); pts.push([lerp(xa, xb, t), lerp(za, zb, t)]); } };
        cut(a, b, x0, z0, x0 + step, z0); cut(b, c, x0 + step, z0, x0 + step, z0 + step);
        cut(c, d, x0 + step, z0 + step, x0, z0 + step); cut(d, a, x0, z0 + step, x0, z0);
        if (pts.length >= 2) segs.push(pts[0], pts[1]);
        if (pts.length === 4) segs.push(pts[2], pts[3]);
      }
      contours.push({ lv, segs });
    }
  }

  // ---- THE SURVEY TOWER: walks to where it is sent ------------------------------
  const tower = { x: 0.3, z: -0.2, tx: 0.3, tz: -0.2 };
  let survey = null;
  function surveyAt(x, z) {
    const near = PLACED.map((n) => ({ n, d: Math.hypot(POS[n].x - x, POS[n].z - z) })).filter((o) => o.d < 0.13)
      .sort((a, b) => a.d - b.d).slice(0, 7);
    const col = Math.round((x + 1) / 2 * 19), row = Math.round((z + 1) / 2 * 19);
    const label = String.fromCharCode(65 + clamp(row, 0, 19)) + " · " + (clamp(col, 0, 19) + 1);
    const atY = Math.floor(year);
    const count = (n) => uses[n].filter((y) => y <= atY).length;
    const top = near.slice().sort((a, b) => count(b.n) - count(a.n))[0];
    const frags = top ? FR.filter((f) => yearOf(f) <= atY && notesOf(f).includes(top.n)).map((f) => f.n) : [];
    survey = { label, near, top, frags };
    const box = el(".t4-survey");
    box.querySelector("[data-v=cell]").textContent = label;
    box.querySelector("[data-v=zone]").textContent = ACC[(near[0] && POS[near[0].n].a) || ZONES[clamp(row >> 2, 0, 3)][clamp(col >> 2, 0, 3)]] || "";
    box.querySelector("[data-v=elev]").textContent = top ? top.n + ", " + count(top.n) : "—";
    box.querySelector("ul").innerHTML = near.length
      ? near.map((o) => "<li><b>" + esc(o.n) + "</b><i>" + count(o.n) + "</i></li>").join("")
      : '<li class="t4-none">No note stands here — open ground.</li>';
    box.querySelector("[data-v=frags]").textContent = top && frags.length
      ? esc(top.n) + " is named by " + frags.slice(0, 5).join(", ") + (frags.length > 5 ? " and " + (frags.length - 5) + " more" : "") + "."
      : "";
  }
  function sendTower(x, z) {
    tower.tx = clamp(x, -0.95, 0.95); tower.tz = clamp(z, -0.95, 0.95);
    if (STILL) { tower.x = tower.tx; tower.z = tower.tz; }
    surveyAt(tower.tx, tower.tz);
  }
  function drawTower(t) {
    const gy = heightAtXZ(tower.x, tower.z), top = gy + 1.05, s = 0.045;
    const O = {}, O2 = {};
    const legs = [[-s, -s], [s, -s], [s, s], [-s, s]];
    ctx.strokeStyle = "rgba(238,238,240,0.92)"; ctx.lineWidth = 1;
    ctx.beginPath();
    // the legs, splayed a little at the foot
    legs.forEach(([a, b]) => { P(tower.x + a * 1.5, gy, tower.z + b * 1.5, O); P(tower.x + a, top, tower.z + b, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y); });
    // its stages and cross-bracing
    for (let k = 0; k <= 4; k++) {
      const y = lerp(gy, top, k / 4), sp = lerp(1.5, 1, k / 4);
      legs.forEach(([a, b], i) => { const [c2, d2] = legs[(i + 1) % 4]; P(tower.x + a * sp, y, tower.z + b * sp, O); P(tower.x + c2 * sp, y, tower.z + d2 * sp, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y); });
      if (k < 4) {
        const y2 = lerp(gy, top, (k + 1) / 4), sp2 = lerp(1.5, 1, (k + 1) / 4);
        legs.forEach(([a, b], i) => { const [c2, d2] = legs[(i + 1) % 4]; P(tower.x + a * sp, y, tower.z + b * sp, O); P(tower.x + c2 * sp2, y2, tower.z + d2 * sp2, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y); });
      }
    }
    ctx.stroke();
    // the cabin on top, its railing, a dish turning slowly
    ctx.fillStyle = "rgba(210,212,216,0.9)";
    const cab = [[-s * 1.6, -s * 1.6], [s * 1.6, -s * 1.6], [s * 1.6, s * 1.6], [-s * 1.6, s * 1.6]];
    ctx.beginPath(); cab.forEach(([a, b], i) => { P(tower.x + a, top + 0.12, tower.z + b, O); if (i) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); }); ctx.closePath();
    ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    ctx.beginPath();
    cab.forEach(([a, b], i) => {
      const [c2, d2] = cab[(i + 1) % 4];
      P(tower.x + a, top, tower.z + b, O); P(tower.x + c2, top, tower.z + d2, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
      P(tower.x + a, top + 0.12, tower.z + b, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
    });
    ctx.stroke();
    const da = STILL ? 0.6 : t * 0.5;
    P(tower.x + Math.cos(da) * s * 1.2, top + 0.24, tower.z + Math.sin(da) * s * 1.2, O);
    P(tower.x, top + 0.12, tower.z, O2);
    ctx.beginPath(); ctx.moveTo(O2.x, O2.y); ctx.lineTo(O.x, O.y); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(O.x, O.y, K * 0.028, K * 0.016, -0.5 + Math.sin(da) * 0.4, 0, TAU); ctx.stroke();
    // its sounding: a ring going out on the ground from its foot
    if (!STILL) {
      const u = (t * 0.45) % 1;
      ctx.strokeStyle = "rgba(240,200,120," + (0.6 * (1 - u)).toFixed(3) + ")";
      ctx.beginPath();
      for (let k = 0; k <= 40; k++) {
        const a = (k / 40) * TAU, r = 0.04 + u * 0.16;
        const x = tower.x + Math.cos(a) * r, z = tower.z + Math.sin(a) * r;
        P(x, heightAtXZ(x, z) + 0.01, z, O);
        if (k) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y);
      }
      ctx.stroke();
    }
  }

  // ---- THE PLANE, THE GRID, THE WIRE ------------------------------------------
  let planeY = Y.plane;                 // where the gold plane stands, in heights
  let planeGoal = Y.plane;
  function drawPlane(t) {
    if (!contours) makeContours();
    const bob = STILL ? 0 : Math.sin(t * 0.6) * 0.02;
    const y = planeY + bob;
    const O = {}, O2 = {};
    // its edge, and the dashed lines down to the land's corners
    ctx.strokeStyle = "rgba(214,164,78,0.85)"; ctx.lineWidth = 1;
    ctx.beginPath();
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([x, z], i) => { P(x, y, z, O); if (i) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); });
    ctx.closePath(); ctx.stroke();
    ctx.setLineDash([3, 5]); ctx.strokeStyle = "rgba(200,200,205,0.4)";
    ctx.beginPath();
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([x, z]) => { P(x, y, z, O); P(x, Y.grid, z, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y); });
    ctx.stroke(); ctx.setLineDash([]);
    // the contours: those of hills the plane has come down through are
    // drawn where they are, on the land; the rest on the plane
    contours.forEach((L, k) => {
      const onLand = L.lv >= y;
      const yy = onLand ? L.lv + 0.012 : y;
      ctx.strokeStyle = onLand ? "rgba(240,196,110," + (0.55 + 0.4 * (k / LEVELS)).toFixed(3) + ")" : "rgba(214,164,78," + (0.35 + 0.5 * (k / LEVELS)).toFixed(3) + ")";
      ctx.lineWidth = onLand ? 1.1 : 0.9;
      ctx.beginPath();
      for (let i = 0; i < L.segs.length; i += 2) {
        P(L.segs[i][0], yy, L.segs[i][1], O); P(L.segs[i + 1][0], yy, L.segs[i + 1][1], O2);
        ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
      }
      ctx.stroke();
    });
  }
  function drawGrid() {
    const O = {}, O2 = {};
    const n = 20, y = Y.grid;
    ctx.strokeStyle = "rgba(225,228,234,0.28)"; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let k = 0; k <= n; k++) {
      const v = -1.2 + (2.4 * k) / n;
      P(v, y, -1.2, O); P(v, y, 1.2, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
      P(-1.2, y, v, O); P(1.2, y, v, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
    }
    ctx.stroke();
    // the long dashed axes across, and the dashed circles round
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(225,228,234,0.38)";
    ctx.beginPath();
    P(0, y, -2.2, O); P(0, y, 2.2, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
    P(-2.2, y, 0, O); P(2.2, y, 0, O2); ctx.moveTo(O.x, O.y); ctx.lineTo(O2.x, O2.y);
    ctx.stroke();
    [1.55, 2.15].forEach((r, i) => {
      ctx.strokeStyle = "rgba(225,228,234," + (0.3 - i * 0.08) + ")";
      ctx.beginPath();
      for (let k = 0; k <= 96; k++) { const a = (k / 96) * TAU; P(Math.cos(a) * r, y, Math.sin(a) * r, O); if (k) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); }
      ctx.stroke();
    });
    ctx.setLineDash([]);
    // its letters and numbers along two edges, as the plan's are
    ctx.font = (phone ? "400 8px " : "400 9.5px ") + '"IBM Plex Mono", monospace';
    ctx.fillStyle = "rgba(225,228,234,0.6)";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let k = 0; k < n; k++) {
      const v = -1.2 + (2.4 * (k + 0.5)) / n;
      P(v, y, -1.32, O); ctx.fillText(String(k + 1), O.x, O.y);
      P(-1.32, y, v, O); ctx.fillText(String.fromCharCode(65 + k), O.x, O.y);
    }
  }
  function drawWire() {
    const O = {};
    const step = 2;
    ctx.strokeStyle = "rgba(220,226,236,0.2)"; ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let j = 0; j <= G; j += step) {
      for (let i = 0; i <= G; i++) { const x = -1 + (2 * i) / G, z = -1 + (2 * j) / G; P(x, Y.wire + hAt(i, j) * 0.7, z, O); if (i) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); }
    }
    for (let i = 0; i <= G; i += step) {
      for (let j = 0; j <= G; j++) { const x = -1 + (2 * i) / G, z = -1 + (2 * j) / G; P(x, Y.wire + hAt(i, j) * 0.7, z, O); if (j) ctx.lineTo(O.x, O.y); else ctx.moveTo(O.x, O.y); }
    }
    ctx.stroke();
  }
  // the hills that stand above the plane, named
  function drawNames() {
    const O = {};
    const atY = Math.floor(year);
    const tall = PLACED.map((n) => ({ n, k: uses[n].filter((y) => y <= atY).length })).filter((o) => o.k > 0)
      .map((o) => ({ ...o, hy: heightAtXZ(POS[o.n].x, POS[o.n].z) })).sort((a, b) => b.hy - a.hy);
    const above = tall.filter((o) => o.hy > planeY - 0.02);
    const show = (above.length ? above : tall.slice(0, phone ? 5 : 9)).slice(0, phone ? 8 : 18);
    ctx.font = (phone ? "500 9px " : "500 10.5px ") + '"IBM Plex Mono", monospace';
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    const placed = [];
    for (const o of show) {
      P(POS[o.n].x, o.hy, POS[o.n].z, O);
      const x = O.x, y = O.y;
      const lx = x + 10, ly = y - 26;
      if (placed.some((q) => Math.abs(q.x - lx) < 90 && Math.abs(q.y - ly) < 13)) continue;
      placed.push({ x: lx, y: ly });
      ctx.strokeStyle = "rgba(240,240,242,0.7)"; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, ly + 4); ctx.lineTo(lx - 3, ly + 4); ctx.stroke();
      ctx.fillStyle = "rgba(244,244,246,0.95)";
      ctx.fillText(o.n + " " + o.k, lx, ly + 2);
    }
  }

  // ---- THE CLOCK --------------------------------------------------------------
  let clock = 0, last = 0, raf = 0, growT0 = -1;
  const GROW_S = 9;                     // the land grown from nothing in so long
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    if (!STILL) clock += dt;
    const t = clock;
    // growing: the year rises, and the land with it
    if (growT0 >= 0) {
      const u = clamp((now - growT0) / (GROW_S * 1000), 0, 1);
      setYear(lerp(Y0 - 1, NONE, u));
      if (u >= 1) { growT0 = -1; el(".t4-grow").classList.remove("is-on"); surveyAt(tower.tx, tower.tz); }
    }
    // turning, and the plane coming down or going up
    const k = STILL ? 1 : 1 - Math.exp(-dt * 6);
    if (Math.abs(yawGoal - yaw) > 1e-4) { yaw += (yawGoal - yaw) * k; landDirty = true; }
    planeY += (planeGoal - planeY) * k;
    tower.x += (tower.tx - tower.x) * (STILL ? 1 : 1 - Math.exp(-dt * 3));
    tower.z += (tower.tz - tower.z) * (STILL ? 1 : 1 - Math.exp(-dt * 3));
    if (landDirty) drawLand();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#1b1c20";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawWire();
    drawGrid();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(landPic, 0, 0);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawPlane(t);
    drawTower(t);
    drawNames();
    if (!STILL && !document.hidden) raf = requestAnimationFrame(frame); else last = 0;
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  // ---- THE HAND -----------------------------------------------------------------
  let drag = null;
  cv.addEventListener("pointerdown", (ev) => { drag = { x: ev.clientX, y0: yawGoal, moved: false }; cv.setPointerCapture(ev.pointerId); });
  cv.addEventListener("pointermove", (ev) => {
    if (drag) {
      const dx = ev.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (drag.moved) { yawGoal = drag.y0 + dx * 0.006; tip.hidden = true; kick(); return; }
    }
    if (ev.pointerType === "touch") return;
    const q = unground(ev.clientX, ev.clientY, 0.35);
    if (Math.abs(q.x) > 1 || Math.abs(q.z) > 1) { tip.hidden = true; cv.style.cursor = "grab"; return; }
    cv.style.cursor = "crosshair";
    const near = PLACED.map((n) => ({ n, d: Math.hypot(POS[n].x - q.x, POS[n].z - q.z) })).sort((a, b) => a.d - b.d)[0];
    const col = Math.round((q.x + 1) / 2 * 19), row = Math.round((q.z + 1) / 2 * 19);
    tip.innerHTML = "<b>" + String.fromCharCode(65 + clamp(row, 0, 19)) + " · " + (clamp(col, 0, 19) + 1) + "</b>" +
      (near && near.d < 0.08 ? "<span>" + esc(near.n) + " · " + esc(ACC[POS[near.n].a]) + "</span>" : "<span>" + esc(ACC[ZONES[clamp(row >> 2, 0, 3)][clamp(col >> 2, 0, 3)]]) + "</span>") +
      "<i>Press to send the tower</i>";
    tip.hidden = false;
    const tw = tip.offsetWidth;
    tip.style.transform = "translate(" + Math.round(Math.min(W - tw - 8, ev.clientX + 14)) + "px," + Math.round(ev.clientY + 14) + "px)";
  });
  cv.addEventListener("pointerup", (ev) => {
    if (!drag) return;
    const was = drag; drag = null;
    if (was.moved) return;
    const q = unground(ev.clientX, ev.clientY, 0.35);
    if (Math.abs(q.x) <= 1.02 && Math.abs(q.z) <= 1.02) { sendTower(q.x, q.z); kick(); }
  });
  cv.addEventListener("pointercancel", () => { drag = null; });
  cv.addEventListener("pointerleave", () => { tip.hidden = true; });

  // the controls
  const yr = el(".t4-year");
  yr.min = String(Y0 - 1); yr.max = String(NONE); yr.step = "1";
  yr.addEventListener("input", () => { growT0 = -1; el(".t4-grow").classList.remove("is-on"); setYear(+yr.value); surveyAt(tower.tx, tower.tz); kick(); });
  el(".t4-grow").addEventListener("click", () => {
    if (STILL) { setYear(NONE); kick(); return; }
    growT0 = performance.now();
    el(".t4-grow").classList.add("is-on");
    kick();
  });
  const lv = el(".t4-level");
  lv.addEventListener("input", () => { planeGoal = lerp(0.12, Y.plane, +lv.value / 100); kick(); });
  el(".t4-turn-l").addEventListener("click", () => { yawGoal -= Math.PI / 2; kick(); });
  el(".t4-turn-r").addEventListener("click", () => { yawGoal += Math.PI / 2; kick(); });
  document.addEventListener("keydown", (ev) => {
    if (ev.target && ev.target.matches && ev.target.matches("input, select")) return;
    if (ev.key === "ArrowLeft") { yawGoal -= 0.3; kick(); }
    else if (ev.key === "ArrowRight") { yawGoal += 0.3; kick(); }
  });
  el("[data-v=notes]").textContent = String(PLACED.length);
  el("[data-v=total]").textContent = String(FR.length);
  el("[data-v=span]").textContent = Y0 + " — " + Y1;

  // ---- BEGIN ---------------------------------------------------------------------
  resize();
  setYear(NONE);
  const first = PLACED.slice().sort((a, b) => uses[b].length - uses[a].length)[0];
  sendTower(POS[first].x + 0.02, POS[first].z + 0.02);
  tower.x = tower.tx; tower.z = tower.tz;
  window.addEventListener("resize", () => { resize(); kick(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { last = 0; kick(); } });
  if (STILL) ["input", "click", "pointerup", "keydown"].forEach((e) => document.addEventListener(e, () => requestAnimationFrame(frame)));
  kick();
  window.TestPage4 = {
    year: () => year, grow: () => el(".t4-grow").click(), survey: () => survey && { cell: survey.label, notes: survey.near.map((o) => o.n) },
    send: (x, z) => { sendTower(x, z); kick(); }, tower: () => ({ x: tower.x, z: tower.z }), plane: () => planeY, yaw: () => yaw,
    pointOf: (name) => { const p = POS[name]; return p ? P(p.x, heightAtXZ(p.x, p.z), p.z, {}) : null; },
  };
})();

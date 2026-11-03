// ============================================================
// TEST PAGE 2 — "Accord Spectrums" (test-pages/2/). Not a page of the
// site: it loads nothing of the site's and nothing of the site loads it.
//
// The owner's image 2 — the Sunlight Spectrums poster — made of the
// site's houses and the Note Library's accords:
//   THE BANDS   a great arc out from a centre far off to the left, from
//               night by the domes to near white past the right edge.
//   THE DOMES   one for each house down the arc: a wire half-sphere seen
//               from a little above, turning, a path over it as high as
//               the house has fragrances, a light travelling the path.
//   THE TICKS   every note the site's fragrances name, in its accord's
//               stretch of the arc (the poster's days in their months),
//               longer the more fragrances name it; the accords' names
//               round the outside, as the months are.
//   THE LINES   from each house to each accord its notes are in, as
//               bright as that accord's share; a light runs out along each.
//
// ZOOMABLE (2026-11-03 — the owner: "make test page 2 zoomable, and
// functional for information"): the wheel, a pinch, a double-click, the
// + and − at the foot, or the keys + − 0 come closer to any part of it,
// and a drag moves about once closer; the hairlines stay hairlines, the
// words grow a little and no more, and the closer you come the more of
// the notes are named, every one of them with how many fragrances name it
// from about three times as close.
//
// AND IT SAYS WHAT IT SHOWS: pressed, a house, an accord or — closer in —
// a single note opens THE PANEL: a house's accords, its most named notes
// and its fragrances, each opening onto its notes; an accord's houses and
// all its notes; a note's houses, the fragrances that name it and what it
// is most often with — every name in it a way on to its own, Back the way
// back, and "Show on the poster" flying there. A note chosen draws a line
// from every house that names it. THE SEARCH finds any house, accord or
// note by its name. The fragrances and their notes are a snapshot of the
// site's (notes-data.js through the Note Library's names), 2026-11-02.
//
// KEPT SMOOTH: the bands, the ticks and every word are drawn once into a
// picture of their own (`still`), again only when the window, the view or
// what is pointed at changes; a frame lays that down and draws the domes
// and the lights over it. With motion reduced: drawn once, nothing turning,
// and the view goes where it is sent at once.
// ============================================================
(function () {
  "use strict";

  // a snapshot of the site's houses, the Note Library's accords and every
  // fragrance on the site with its notes (2026-11-02)
  const DATA = {"houses":[{"id":"pineward","name":"Pineward","from":"United States","founded":"2020","sub":"The House That Smells Like Trees","n":48,"notes":183,"share":{"GRN":26,"CIT":19,"CON":52,"ANI":23,"WOO":57,"ARO":25,"RES":30,"EAR":31,"SMK":5,"GOU":62,"BRW":13,"IMP":5,"FLO":21,"SPI":27,"FRU":19,"AIR":4},"top":"Gourmand"},{"id":"grande-parfums","name":"Grande Parfums","from":"Romania","founded":"2021","sub":"Art Niche Expo 2026","n":15,"notes":111,"share":{"FRU":24,"SPI":20,"GRN":5,"GOU":32,"FLO":38,"BRW":11,"ANI":22,"WOO":34,"RES":31,"ARO":2,"IMP":3,"CIT":11,"CON":1,"EAR":2},"top":"Floral"},{"id":"individual","name":"Individual fragrances","from":"","founded":"","sub":"","n":13,"notes":101,"share":{"GOU":16,"FRU":6,"CIT":10,"SPI":16,"WOO":27,"SMK":3,"FLO":17,"GRN":4,"EAR":2,"RES":19,"ARO":12,"CON":7,"ANI":9,"AIR":4,"IMP":1,"BRW":1},"top":"Woods"},{"id":"adar","name":"ADAR","from":"Romania","founded":"","sub":"The House That You Have Never Heard of","n":11,"notes":71,"share":{"GRN":3,"SPI":6,"AIR":5,"FLO":14,"EAR":5,"RES":9,"WOO":10,"ANI":7,"CIT":5,"ARO":3,"GOU":13,"IMP":2,"FRU":4,"BRW":1,"CON":1,"SMK":2},"top":"Floral"},{"id":"om-parfums","name":"Om Parfums","from":"Taiwan","founded":"2021","sub":"The Olfaction of Om","n":9,"notes":75,"share":{"BRW":5,"FRU":9,"SPI":3,"GOU":17,"WOO":29,"RES":12,"EAR":3,"ANI":9,"SMK":2,"IMP":1,"GRN":2,"FLO":13,"ARO":3,"CON":1,"CIT":2},"top":"Woods"},{"id":"apoteker-tepe","name":"Apoteker Tepe","from":"United States","founded":"2014","sub":"The Apothecary on the Hill","n":8,"notes":43,"share":{"CIT":2,"FRU":1,"SPI":2,"WOO":10,"CON":8,"EAR":5,"RES":7,"SMK":3,"ARO":3,"ANI":2,"IMP":1,"FLO":5,"BRW":1,"GOU":1,"GRN":1},"top":"Woods"},{"id":"lost-tribe","name":"Lost Tribe","from":"United States","founded":"2022","sub":"A House of Notable Quality","n":6,"notes":44,"share":{"WOO":13,"RES":10,"GOU":7,"ANI":6,"FLO":7,"SPI":6,"CIT":6,"ARO":6,"CON":5,"EAR":3,"IMP":1},"top":"Woods"},{"id":"almost-human","name":"Almost Human","from":"Romania","founded":"2025","sub":"Abstraction Done Quite Well","n":5,"notes":20,"share":{"WOO":2,"SMK":3,"SPI":1,"CIT":1,"AIR":5,"ANI":2,"RES":3,"EAR":5,"FLO":1,"ARO":1,"GRN":1},"top":"Water & Air"},{"id":"ataraxia","name":"Ataraxia","from":"","founded":"","sub":"A Gothic Avante Garde House","n":5,"notes":43,"share":{"BRW":3,"GOU":18,"IMP":4,"FLO":6,"FRU":4,"RES":7,"WOO":2,"GRN":1,"SMK":1,"AIR":1,"SPI":2},"top":"Gourmand"},{"id":"outsider-parfums","name":"Outsider Parfums","from":"","founded":"","sub":"The Sister House of Om","n":5,"notes":53,"share":{"EAR":6,"ARO":3,"FLO":7,"SPI":3,"SMK":3,"GOU":10,"WOO":15,"RES":2,"BRW":5,"FRU":1,"AIR":2,"ANI":9,"GRN":1,"CIT":4,"CON":1},"top":"Woods"},{"id":"tombstone","name":"Tombstone","from":"","founded":"","sub":"A House That Expanded on Death","n":5,"notes":28,"share":{"FLO":11,"SMK":1,"GRN":1,"CIT":1,"RES":4,"EAR":1,"WOO":5,"ANI":1,"ARO":3,"SPI":2,"GOU":2,"FRU":1,"AIR":1},"top":"Floral"},{"id":"les-abstraits","name":"Les Abstraits","from":"","founded":"","sub":"Eugen’s Ideas and Antoine Lie’s Execution","n":4,"notes":45,"share":{"FLO":9,"SPI":10,"GOU":4,"RES":6,"ANI":6,"WOO":7,"SMK":2,"GRN":2,"ARO":4,"EAR":2,"CIT":2,"CON":1},"top":"Spice"},{"id":"qimu-musicians","name":"Qimu & Musicians","from":"","founded":"","sub":"A House of Music and Fragrance","n":4,"notes":6,"share":{"ARO":1,"FLO":3,"SPI":1,"ANI":1},"top":"Floral"},{"id":"tale-parfums","name":"Tale Parfums","from":"United States","founded":"","sub":"","n":4,"notes":0,"share":{},"top":""}],"accords":[{"code":"CIT","name":"Citrus","say":"Peel oils: the brightest, quickest notes, gone first.","notes":[["Bergamot",15],["Lemon",8],["Citrus",7],["Orange",7],["Lime",6],["Blood Orange",4],["Yuzu",3],["Clementine",3],["Grapefruit",3],["Bitter Orange",2],["Petitgrain",2],["Citron",1],["Green Mandarin",1],["Tangerine",1]]},{"code":"ARO","name":"Aromatic & Herbal","say":"Kitchen and hillside herbs: clean, camphorous, bitter-green.","notes":[["Lavender",13],["Mint",11],["Clary Sage",6],["Rosemary",4],["Juniper Berry",3],["Chamomile",3],["Thyme",3],["Sage",2],["Myrtle",2],["Eucalyptus",2],["Shiso",2],["Hops",1],["Davana",1],["Yarrow",1],["Lemon Verbena",1],["Herbal Notes",1],["Artemisia",1],["Mint-Sandalwood Co-Distillation",1],["Huang Qi",1],["Angelica Root",1],["Kuromoji",1],["Wormwood",1],["Basil",1],["Marjoram",1],["Oregano",1],["Dittany of Crete",1]]},{"code":"GRN","name":"Green","say":"Leaves, stems, grass and hay: the smell of plants rather than flowers.","notes":[["Hay",8],["Violet Leaf",5],["Galbanum",4],["Poplar Bud",3],["Sweetgrass",3],["Tomato Leaf",3],["Grass",2],["Ivy",2],["Green Notes",2],["Sugar Cane",2],["Raspberry Leaf",2],["Cannabis",2],["Crushed Leaves",1],["Sweet Vernalgrass",1],["Watercress",1],["Green Wheat",1],["Rhubarb",1],["Corn Silk",1],["Corn Silage",1],["Fig Leaf",1],["Pea",1]]},{"code":"FLO","name":"Floral","say":"Petals and blossoms, real and reconstructed.","notes":[["Rose",20],["Jasmine",18],["Orris",15],["Neroli",9],["Lily of the Valley",9],["Orange Blossom",8],["Ylang Ylang",7],["Geranium",6],["Osmanthus",5],["Tuberose",5],["Heliotrope",4],["Gardenia",4],["Violet",4],["Carnation",3],["Waterlily",3],["Champaca",2],["Marigold",2],["Tiare Flower",2],["Linden Blossom",2],["Mimosa",2],["Goldenrod",1],["White Lotus",1],["Bluebell",1],["Alpine Sandwort",1],["Azure Bluet",1],["Mountain Wildflowers",1],["Honeysuckle",1],["Green Tea Flowers",1],["Clear Orchid",1],["Passionflower",1],["Snowdrops",1],["Nectar",1],["Plum Blossom",1],["Yellow Flowers",1],["Freesia",1],["Magnolia",1],["Tobacco Flower",1],["Jonquil",1],["Lilac",1],["Lily",1],["Chrysanthemum",1],["Night Blooming Jasmine",1]]},{"code":"FRU","name":"Fruit","say":"Flesh, juice and jam.","notes":[["Cherry",7],["Raspberry",6],["Dried Fruits",6],["Plum",5],["Apricot",4],["Apple",4],["Peach",4],["Strawberry",3],["Pear",3],["Blackberry",2],["Cranberry",2],["Green Apple",2],["Passionfruit",2],["Mango",2],["Litchi",2],["Banana",2],["Dates",2],["Cassis",1],["Quince",1],["Maninka",1],["Japanese Plum",1],["Goldenberry",1],["Red Berries",1],["Blueberry",1],["Fig",1],["Scorched Pineapple",1],["Guava",1],["Fruity Notes",1]]},{"code":"SPI","name":"Spice","say":"Seeds, barks, roots and peppers: heat, warmth and bite.","notes":[["Clove",16],["Saffron",13],["Ginger",10],["Cinnamon",10],["Spices",8],["Nutmeg",7],["Black Pepper",6],["Pink Pepper",6],["Cardamom",5],["Coriander",3],["Anise",2],["Cumin",2],["Allspice",2],["Cassia",2],["Turmeric",2],["Water Pepper",1],["Fenugreek",1],["Paprika",1],["Sichuan Pepper",1],["Caraway",1]]},{"code":"GOU","name":"Gourmand","say":"Things you could eat: sweets, grains, nuts, pastry.","notes":[["Vanilla",34],["Tobacco",25],["Tonka",18],["Honey",13],["Beeswax",10],["Cacao",10],["Chocolate",9],["Brown Sugar",4],["Almond",4],["Milk",4],["Caramel",4],["Oat",3],["Wheat",3],["Hazelnut",3],["Baked Apple",2],["Molasses",2],["Black Walnut",2],["Butter",2],["Butterscotch",2],["Coumarin",2],["Cocoa Butter",2],["Bread",1],["Seed Cake",1],["Maple",1],["Barley",1],["Icing",1],["Sugar",1],["Malt",1],["Raisin Cookies",1],["Pumpkin",1],["Rice",1],["Carob Pods",1],["Murumuru Butter",1],["Holy Bread",1],["Honeycomb",1],["Chantilly Cream",1],["Condensed Milk",1],["Toffee",1],["Cheese",1],["Coconut Milk",1],["Chocolate Cake",1],["Dulce de Leche",1],["Cream",1],["Popcorn",1],["Balsamic Vinegar",1]]},{"code":"BRW","name":"Brews & Spirits","say":"Teas, coffee and what is poured from a bottle.","notes":[["Rum",5],["Tea",4],["Coffee",4],["Whiskey",4],["Maté",3],["Cognac",3],["Lapsang Souchong",2],["Green Tea",2],["Amaretto",2],["Liquor",2],["Oolong Tea",1],["Herbal Tea",1],["Cola",1],["Absinthe",1],["Masala Chai",1],["Sparkling Water",1],["Jasmine Tea",1],["Moroccan Tea",1],["Cocktail Accord",1]]},{"code":"WOO","name":"Woods","say":"Heartwood, bark and sawdust.","notes":[["Cedarwood",38],["Sandalwood",35],["Patchouli",34],["Vetiver",27],["Oud",20],["Guaiac Wood",10],["Woody Notes",7],["Oak",6],["Cypriol",5],["Cashmeran",5],["Birch",3],["Mahogany",2],["Amberwood",2],["Amyris",2],["Pineboard",1],["Sawdust",1],["Edelwood Oil",1],["Amber Oud",1],["Petrified Driftwood",1],["Teak Wood",1],["Bark",1],["Cabreuva",1],["Oak Barrel",1],["Buddhawood",1],["Iso E Super",1],["Willow Bark",1],["Moldy Cedarwood",1],["Siam Wood",1],["Muhuhu",1]]},{"code":"CON","name":"Conifers","say":"Needles, cones and the trees that carry them.","notes":[["Fir",21],["Pine",14],["Pine Needles",12],["Juniper",9],["Cypress",7],["Spruce",3],["Hinoki",3],["Black Hemlock",2],["Larch Cones",1],["Tamarack",1],["Snoqualmie Forest Evergreens",1],["Cedar Leaf",1],["Nootka",1],["Hiba",1]]},{"code":"RES","name":"Resins & Balsams","say":"What trees weep: incense, amber and balm.","notes":[["Amber",22],["Benzoin",20],["Labdanum",16],["Frankincense",15],["Myrrh",13],["Incense",10],["Resins",8],["Opoponax",6],["Tolu Balsam",5],["Peru Balsam",5],["Styrax",4],["Sandarac",2],["Elemi",2],["Bakhoor",2],["Balsam",1],["Propolis",1],["Rum Resin",1],["Ponderosa Resin",1],["Dragon's Blood",1],["Sawn Resin",1],["Copaiba Balsam",1],["Turpentine",1],["Copal",1],["Bushman Candle Resin",1]]},{"code":"ANI","name":"Musk, Skin & Animalic","say":"Musks, leathers and the warmth of bodies.","notes":[["Musk",32],["Ambergris",15],["Leather",13],["Castoreum",9],["Civet",7],["Ambrette",4],["Costus",4],["Suede",3],["Skin",2],["Animal Notes",2],["Sheep Wool",1],["Lanolin",1],["Botanical Musk",1],["Hyrax",1],["Goat Hair",1],["Skunk Oil",1]]},{"code":"EAR","name":"Earth, Moss & Mineral","say":"Soil, moss, fungus and stone.","notes":[["Oakmoss",26],["Soil",8],["Moss",5],["Mushroom",4],["Lichen",2],["Spikenard",2],["Peat",2],["Treemoss",2],["Cedarmoss",2],["Mineral Accord",2],["Damp Vegetation",1],["Swamp Water",1],["Wet Stone",1],["Petrichor",1],["Sand",1],["Dust",1],["Concrete",1],["Lava",1],["Metallic Notes",1],["Evernyl",1]]},{"code":"AIR","name":"Water & Air","say":"Sea, rain, steam and open sky.","notes":[["Seaweed",5],["Ozone",2],["Marine Accord",2],["Sea Salt",2],["Aquatic Notes",2],["Solar Notes",2],["Airy Note",2],["Sea Water",1],["Cold Night Air",1],["Rain Notes",1],["Dead Water",1],["Aldehydes",1]]},{"code":"SMK","name":"Smoke & Char","say":"Fire, tar and what burning leaves behind.","notes":[["Smoke",13],["Birch Tar",5],["Cade Oil",2],["Smouldering Logs",1],["Palo Santo",1],["Ash",1],["Pine Tar",1],["Pine Smoke",1]]},{"code":"IMP","name":"Impressions","say":"Notes that are not materials: objects, places, feelings, named by a house.","notes":[["CO2 Extracts",3],["Aged Parchment",2],["Paper",2],["Candle Wax",2],["Decayed Rose",1],["Westfarthing Leaf",1],["Mousse de Saxe",1],["Dusty Sofa",1],["Gold",1],["Dusty Antiques",1],["Powder Accord",1],["Underground Tunnel",1],["Oriental Notes",1]]}],"frags":[["Bindebole",0,2021,[43,2,246,287,52,215],""],["Boreal",0,2020,[246,15,215,264,300],""],["Brokilän",0,2021,[251,252,269,244,216,219],""],["Cotswold",0,2021,[215,330,222,246,151],""],["Eldritch",0,2021,[284,262,217,244,206,265,330,246,21,298],""],["Fanghorn II",0,2021,[244,300,302,246,299,308],""],["Funerie",0,2022,[301,342,284,152,330,229,263,265,215,246,219],""],["Juniperus",0,2024,[1,247,17,14,18,216,217],""],["Murkwood",0,2020,[244,251,202,300,263,262],""],["Nocturnis",0,2022,[245,247,0,74,68,19,40,152,244,14,258,218,216,298,217],""],["Oxylus",0,2021,[246,247,218,22,299,309],""],["Snoqualmie",0,2024,[269,253,272,254],""],["Sturbridge",0,2023,[165,245,261,244,135,264,262,215,258,303,283,43],""],["White Fir",0,2022,[3,244,245,133,131,282,298,141,218],""],["Bucolic",0,2024,[292,293,104,14,154,158,258,155,44],""],["Hayloft",0,2022,[40,154,162,163,164,159,14,46,132],""],["Hayride",0,2022,[40,156,151,53,44,172,136,139,303,105,153,298],""],["Pastoral",0,2022,[107,112,154,273,155,44,40,163,162,218,200,298],""],["Shire",0,2024,[40,162,164,0,14,207,343,173,62,63,154],""],["Steading",0,2020,[155,152,40,174,175,25,304,246,43],""],["Christmas Wine",0,2020,[113,136,244,106,131,5],""],["Gingerbread",0,2023,[133,134,131,136,163,166,158,167,160,168,151,176],""],["Glühwein",0,2021,[113,76,103,104,244,157,26,298,266,61,216,261],""],["Revelries",0,2021,[131,196,134,219,164],""],["Acadian",0,2023,[6,0,18,47,23,75,81,71,318,215,298],""],["Coastal Veil",0,2023,[18,247,325,318,248,301,146,23,283,216],""],["Gingermoss",0,2023,[133,64,0,5,215,17,284,298],""],["Subalpine",0,2025,[244,0,137,255,216,218,287,300],""],["Akero",0,2023,[114,259,217,216,215],""],["Apple Tabac",0,2020,[108,152,244,274,105],""],["Caravansary",0,2023,[244,249,197,330,19,263,282,14,151,298],""],["Clemenpine",0,2023,[289,284,7,152,283,245,132,115,5,244,216,215,62,82],""],["Coffee Tabac",0,2024,[198,152,215,217,264,135,261,220,151],""],["Delfiño",0,2022,[7,247,45,218,216,283],""],["Greymist",0,2023,[244,245,11,152,294,218],""],["Gristmill",0,2022,[215,230,333,231,258,167,226,260],""],["Holy Cross",0,2026,[247,310,282,287,83,302,54,27,245],""],["Icefall",0,2021,[248,8,247,256,318,245,215,216],""],["Ivymoss",0,2023,[47,203,15,4,28,75,248,245,215,298,305,306],""],["Lime Cola",0,2025,[4,103,133,196,208,64,9,177,151,136,140,134],""],["Meadowmoss",0,2023,[298,84,46,55,66,244,45,85,86],""],["Mint Cocoa",0,2024,[157,15,217,151,135,264,178,215],""],["Noki",0,2022,[15,116,117,283,120,56,216],""],["Ponderosa",0,2022,[275,246,215,151,110,134,169,155,179],""],["Pumpkivus",0,2025,[180,158,218,69,215,216,217,40,299,57,58,219],""],["Tome",0,2025,[339,340,284,152,197,216,215,63,181,287,198,298,223],""],["Treacle",0,2021,[152,202,166,154,105],""],["Velvetine",0,2021,[283,248,151,131,260,244,276,216,282,344],""],["Amber Zero",3,0,[59,133,319,132,69,307,258,218,264,283],""],["Aetherialism",3,0,[42,4,41,320,67,64,262,16,218,215,153,284],""],["Incantu",3,0,[87,182,321,154,152,341,232,159,233],""],["Against All Odds",3,2025,[219,62,9,216,283],""],["α11 Alpha11",3,0,[118,15,132,70,62,67,152,263,153,286],""],["Alta Luna",3,2025,[282,322,170,151,71,2,66],""],["ADHD",3,0,[138,6,121,209,132,88,103,183,262,153,122],""],["Root Code",3,0,[0,137,246,311,89,307,217,61,258,334,298],""],["Lignum Dei",3,0,[326,261,215,277,300,61,219,262,339,290],""],["Lithos Diaphanes Λίθος Διαφανές",3,0,[],""],["Tyrian",3,2026,[157,331,16,154,283],""],["Burning Bridges",7,2026,[221,330,135,2],""],["Dear Future",7,2026,[319,290,258],""],["Desert Hope",7,2026,[312,264,323,313,221,61],""],["Ritual Code",7,2026,[264,335,330,291,29,299],""],["Silent Rain",7,2026,[299,327,314,48,324,323],""],["Amaretto Jazz in the Melting Room",8,2024,[204,184,205,154,341,157,201,159,345,90,171,185,151,152],""],["Deity",8,2025,[154,123,103,186,124,187,152,171,155,91,261,260,156,151,153,258,259,270,262,346,217,119,92],""],["My Doll’s Makeup",8,0,[],""],["Spinal Fluid",8,2025,[262,77,61,223,40,331,318,142,70],""],["Vestibule",8,2024,[157,135,347],""],["5 Years Anniversary",1,0,[104,138,49,134,132,131,157,67,201,289,154,219,222,284,282,267,153,215,260,151,259,152,216,218],""],["Ambresso",1,0,[198,143,262,196,201,152,155,105,22,61,136,65,215,260,264,259,258,285,151,266,267,217,220,153,283,265,216,282],""],["Ancient Oud",1,0,[219,259,282,338],""],["Choco Powder",1,0,[132,103,156,157,69,62,61,216,151,227],""],["Cookie something (?)",1,0,[],""],["Cuore",1,2024,[263,135,63,125,7,132,3,112,105,126,205,106,93,49,188,65,110,262,127,78,134,61,62,244,258,153,151,220,265,285,260,259,234,215,282,217],""],["Dreaming Maldives",1,0,[1,111,109,138,94,95,161,65,151,282,215,262],""],["Giardino di Sorrento",1,0,[5,8,1,65,50,64,70,96,62,61,224,258,217,153,151,282],""],["Hot Stuff",1,0,[128,152,165,153,218,298,155],""],["Intimate Spell",1,0,[0,66,17,131,223,68,215,217,218,282,260,259,220,228],""],["Karak & Shisha",1,0,[267,110,104,197,134,152,108,131,235,61,139,105,132,283,260,210,282,285,219,155,151,153,258,97],""],["Mystical Incense",1,0,[261,338,117,211,119,61,258,282],""],["Vanilla Ash",1,0,[158,50,135,196,151,220,71,65,285,153,147,282,261],""],["Vintage Memoir",1,0,[212,109,1,0,63,41,62,67,68,70,61,74,72,282,283,216,131,218,151,298,259,286,217,266,153,215,260],""],["White Label",1,0,[66,12,111,129,133,338,116,213,65,221,104,3,282],""],["Belle Âme",11,2022,[63,133,156,261,139,153,282,216],""],["Des Cendres",11,2023,[336,42,331,15,131,284,41,70,298,295,218,217],""],["La Douleur Exquise",11,2022,[61,63,261,131,142,132,285,217,215,260,265,262],""],["Philosopher’s Walk",11,2025,[0,1,64,66,138,139,131,134,30,247,68,16,74,73,14,306,218,217,288,282,259,153,151],""],["Kong",6,0,[],""],["Watch King",6,0,[219,263,259,151,258,284,61,143,267,153],""],["Dirty Soda",6,0,[4,3,0,138,144,140,64,131,219,151,153,259,217,216,215],""],["Equatorial",6,0,[261,14,0,10,138,283,244,248,217,249,247,16,31,282,219,298,215,218,20,271],""],["Santal Absolu",6,0,[216,288,14,63,61,67,259,151],""],["Pan’s Labyrinth",6,0,[0,61,348,159,283,14,170,67,217,216,282,219,298,305,244,260,271],""],["Nymphaea Caerulea",4,0,[],""],["Lust",4,2023,[196,103,199,141,152,217,215,259,266,298,224,236,260,161,289,291,237,222],""],["Burnana",4,2024,[118,108,330,261,268,332,278,349,45,130,258,220,218,221,259,69,32,219,155,298,286,285],""],["Cannabis Café",4,0,[],""],["Dark Night of the Soul",4,2024,[156,219,285,148,160,286,250,228,106,62,168,63,220,222,149,216,217,189,151,298,98,258,1,215],""],["This Too Shall Pass",4,0,[259,107,109,169,15,156,219,218,79,72,76,190,216,217,152],""],["When the Linden Blooms",4,2024,[0,79,62,107,99,203,69,238,216,16,200,239,227,51,259,151,219,282],""],["Oud de Pasión",4,0,[115,72,191,66,214,217,216,286,152,156,151,259,282,219],""],["Smoke Oud",4,0,[],""],["Dragon’s Breath",9,2026,[315,24,68,145,331,156,218,268,316,197,200,151,219,298],""],["Draco",9,0,[261,114,322,217,285,14,68,284,152,286,282,60,219,215,332,317],""],["Xocolate Crotch",9,0,[131,72,3,157,216,330,284,192,286,152,193,221,217,199,224],""],["Guilty as Charged",9,0,[324,0,4,3,64,65,33,284,66,215,217,132,245,299,218,224,282,298],""],["Amaretto Coffee",9,0,[204,151,198,215,216,62,194,282,157],""],["Guitarist",12,0,[],""],["Vocal",12,0,[15,65,132,73,63,282],""],["Bassist",12,0,[],""],["Drummer",12,0,[],""],["Bad Lily",13,2024,[],""],["Fleurt",13,0,[],""],["Rouse",13,0,[],""],["Water Me",13,0,[],""],["3 Feet 5",10,2024,[71,62,80,63,330],""],["Evergrow",10,2025,[42,0,61,260,63,298,217,282],""],["No Need to Come By",10,0,[15,20,137,279,262,261,62,217,153,216],""],["Sing at My Funeral",10,0,[15,154,64,62,65,63],""],["Sweet Coffin",10,2024,[240,107,241,136,328],""],["Kogen",5,2024,[6,111,133,225,250,304,218,263,330,257,246,298,34,245,215],""],["The Holy Mountain",5,2015,[337,263,244,260,220,245],""],["Karasu",5,2016,[288,242,250,340,139,221],""],["The Peradam",5,2015,[100,62,63,216],""],["Pale Fire",5,2016,[258,261,298,199,156],""],["Anabasis",5,2015,[2,24,225,15,245,215,282],""],["After the Flood",5,2015,[41,75,301,217,299],""],["Brother Night",5,2016,[280,77,261,330],""],["CV99",2,0,[195,103,2,160,134,131,137,221,161,330,222],"Lussur"],["De Profundis",2,2011,[101,48,73,299,263,106],"Serge Lutens"],["Haxan",2,2018,[14,225,215,244,220,223,216,35,268,246,132,20,17,137,136,150,134,41,152,301,36,37,218,296,318,19,249,248,42,155,288,285,16,21,282,38,224,263,260,217,270,131,62,265],"Parfum Prissana"],["Tobacolor",2,2021,[152,154,330,106,258,350,109,2],"Dior"],["Flamenco EDP",2,2017,[104,108,73,66,61,62,63,215,248,258,245],"Ramón Monegal"],["French Riviera",2,2022,[1,3,13,133,137,320,78,245,80,218,321,282,258],"Mancera"],["Velvet Fog",2,0,[64,14,67,63,218,216,154],"Casa Goa"],["House of Ellixirz",2,2021,[1,10,144,61,223,152,284,331,151,161],"Matca"],["Fir of the Light",2,0,[],"JMP Artisan Perfumes"],["Fir of the Dark",2,2024,[],"JMP Artisan Perfumes"],["Quintessentially Amber",2,2025,[2,329,135,61,258,260,259,268,282,217,218,216,151,283],"Sultan Pasha Perfumes"],["Forbidden Flower",2,2024,[297,8,51,62,102,216,217,215,259,218,145,151,133,140,4],"Areej Le Doré"],["Ore",2,2009,[222,151,220,267,266,258,243,259,156,217,160,281,226,39,199],"Slumberhouse"]]};

  const host = document.querySelector(".t2");
  const canvas = document.querySelector(".t2-arc");
  const ctx = canvas.getContext("2d");
  const tip = document.querySelector(".t2-tip");
  const info = document.querySelector(".t2-info");
  const infoBody = info.querySelector(".t2-info-body");
  const infoBack = info.querySelector(".t2-info-back");
  const infoShow = info.querySelector(".t2-info-show");
  const infoClose = info.querySelector(".t2-info-close");
  const findIn = document.querySelector(".t2-find input");
  const found = document.querySelector(".t2-found");
  const zoomSay = document.querySelector(".t2-zoom-say");
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  const clampV = (v, a, b) => Math.max(a, Math.min(b, v));
  const ACC = {}; DATA.accords.forEach((a, i) => { a.i = i; ACC[a.code] = a; });
  const houses = DATA.houses;
  houses.forEach((h, i) => { h.i = i; h.frags = []; h.noteUse = new Map(); });
  const totalNotes = DATA.accords.reduce((s, a) => s + a.notes.length, 0);
  const groupName = (h) => (h.id === "individual" ? "Individual fragrances" : h.name);

  // ---- THE NOTES AND THE FRAGRANCES --------------------------------------
  const NOTES = [];
  DATA.accords.forEach((a, ai) => {
    a.refs = a.notes.map(([name, uses], ni) => { const n = { id: NOTES.length, name, uses, ai, ni, frags: [], with: null }; NOTES.push(n); return n; });
    a.mentions = a.notes.reduce((s, x) => s + x[1], 0);
  });
  const FRAGS = DATA.frags.map(([name, gi, year, ids, from], i) => {
    const f = { i, name, house: houses[gi], year, notes: ids.map((id) => NOTES[id]), from };
    f.house.frags.push(f);
    f.notes.forEach((n) => { n.frags.push(f); f.house.noteUse.set(n, (f.house.noteUse.get(n) || 0) + 1); });
    return f;
  });
  // what a note is most often named with, in the same fragrance
  function withOf(n) {
    if (n.with) return n.with;
    const m = new Map();
    n.frags.forEach((f) => f.notes.forEach((o) => { if (o !== n) m.set(o, (m.get(o) || 0) + 1); }));
    n.with = [...m].sort((a, b) => b[1] - a[1] || a[0].name.localeCompare(b[0].name));
    return n.with;
  }
  const housesOf = (n) => {
    const m = new Map();
    n.frags.forEach((f) => m.set(f.house, (m.get(f.house) || 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1] || a[0].i - b[0].i);
  };

  // the glossary down the left, from the accords themselves — pressed, an accord's panel
  const gloss = document.querySelector(".t2-gloss");
  DATA.accords.forEach((a) => {
    const li = document.createElement("li");
    li.dataset.code = a.code;
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.innerHTML = "<b>" + a.code + "</b><i>" + esc(a.name) + "</i> — " + esc(a.say) + " <span>(" + a.notes.length + ")</span>";
    gloss.appendChild(li);
  });

  // ---- THE LAYOUT -------------------------------------------------------
  let W = 0, H = 0, DPR = 1, narrow = false;
  const G = { cx: 0, cy: 0, rd: 0, rb0: 0, rb1: 0, rt: 0, ra: 0, th: 0, ta: 0, dome: 20, left: 0 };
  const still = document.createElement("canvas");
  const sctx = still.getContext("2d");
  function layout() {
    const b = canvas.getBoundingClientRect();
    const changed = Math.round(b.width) !== Math.round(W) || Math.round(b.height) !== Math.round(H);
    W = b.width; H = b.height;
    narrow = innerWidth <= 900;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = still.width = Math.round(W * DPR);
    canvas.height = still.height = Math.round(H * DPR);
    G.left = narrow ? 0 : 300;
    const room = W - G.left;
    // the centre far off to the left; the domes' ring passes a third of the
    // way into the room at the middle, the bands go on past the right edge
    G.rd = narrow ? Math.max(W * 1.15, H * 1.05) : Math.max(room * 1.05, H * 0.9);
    G.cy = H / 2;
    G.th = Math.asin(Math.min(0.98, (H * 0.43) / G.rd));
    // on a narrow window the first and last domes stand just inside the left edge
    G.cx = narrow ? 30 - G.rd * Math.cos(G.th) : G.left + 0.26 * room - G.rd;
    const spare = narrow ? W * 0.5 : room * 0.6;
    G.rb0 = G.rd + 42;
    G.rb1 = G.rd + spare * 1.45;
    G.rt = G.rd + spare * 0.5;
    G.ra = G.rt + spare * 0.36;
    // the accords' stretch of the arc, as tall as the window lets it
    G.ta = Math.asin(Math.min(0.98, (H * 0.455) / G.ra));
    G.dome = Math.max(12, Math.min(34, (G.th * 2 * G.rd) / houses.length * 0.36));
    // a new size of window: the whole poster again
    if (changed) { Object.assign(cam, { x: W / 2, y: H / 2, z: 1 }); Object.assign(goal, cam); sayZoom(); }
    stillDirty = true;
  }
  // the angle of each house and each note round the arc
  const angleOfHouse = (i) => -G.th + (i + 0.5) * (2 * G.th) / houses.length;
  const span = () => 2 * G.ta;
  const GAPS = 0.6;   // slots of gap between accords
  const slots = () => totalNotes + DATA.accords.length * GAPS;
  function noteAngle(ai, ni) {
    let k = 0;
    for (let i = 0; i < ai; i++) k += DATA.accords[i].notes.length + GAPS;
    k += GAPS / 2 + ni + 0.5;
    return -span() / 2 + (k / slots()) * span();
  }
  const accordMid = (ai) => {
    const a = DATA.accords[ai];
    return (noteAngle(ai, 0) + noteAngle(ai, a.notes.length - 1)) / 2;
  };
  const tickLen = (n) => 6 + Math.min(34, n.uses * 1.6);
  const at = (r, a) => [G.cx + Math.cos(a) * r, G.cy + Math.sin(a) * r];
  // where each accord's name stands: at its stretch's middle, pushed apart
  // until no two are nearer than a line of type (on the screen, so closer in
  // they stand nearer their own stretches)
  function placeNames() {
    const want = DATA.accords.map((a, i) => accordMid(i));
    const got = want.slice(), gap = ((narrow ? 13 : 17) * Math.pow(cam.z, 0.35)) / (G.ra * cam.z);
    for (let it = 0; it < 80; it++) {
      for (let i = 1; i < got.length; i++) {
        const d = got[i] - got[i - 1];
        if (d < gap) { const push = (gap - d) / 2; got[i] += push; got[i - 1] -= push; }
      }
      for (let i = 0; i < got.length; i++) got[i] += (want[i] - got[i]) * 0.02;
    }
    return got;
  }

  // ---- THE VIEW: how close, and where ----------------------------------------
  // The poster is drawn in its own units (the window's pixels at the whole
  // view) and the view is a centre and a zoom over them: a hairline is a
  // hairline at every zoom (`lw`), and a word grows only by a root of it
  // (`fs`), so closer in there is room to name what was too small to.
  const cam = { x: 0, y: 0, z: 1 }, goal = { x: 0, y: 0, z: 1 };
  const ZMAX = 10;
  let moving = false;
  function hold(o) {
    o.z = clampV(o.z, 1, ZMAX);
    const hw = W / (2 * o.z), hh = H / (2 * o.z);
    o.x = clampV(o.x, hw, W - hw); o.y = clampV(o.y, hh, H - hh);
  }
  const toScreen = (x, y) => [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2];
  const toWorld = (sx, sy, o = cam) => [(sx - W / 2) / o.z + o.x, (sy - H / 2) / o.z + o.y];
  const view = (c) => c.setTransform(DPR * cam.z, 0, 0, DPR * cam.z, DPR * (W / 2 - cam.x * cam.z), DPR * (H / 2 - cam.y * cam.z));
  const lw = (w) => w * Math.pow(cam.z, -0.78);
  const fs = (s, k = 0.5) => (s * Math.pow(cam.z, k)) / cam.z;
  function go(o, now) {
    Object.assign(goal, o); hold(goal);
    if (STILL || now) { Object.assign(cam, goal); stillDirty = true; }
    moving = true; sayZoom(); kick();
  }
  function zoomAt(sx, sy, f) {
    const [wx, wy] = toWorld(sx, sy, goal);
    const z = clampV(goal.z * f, 1, ZMAX);
    go({ z, x: wx - (sx - W / 2) / z, y: wy - (sy - H / 2) / z });
  }
  function sayZoom() {
    if (zoomSay) zoomSay.textContent = Math.round(goal.z * 100) + "%";
    canvas.style.touchAction = goal.z > 1.01 ? "none" : "pan-y";
    host.classList.toggle("is-zoomed", goal.z > 1.01);
  }

  // ---- THE STILL PICTURE: bands, ticks, words ----------------------------
  let stillDirty = true, focus = null, pinned = null;   // focus: { house } or { accord } or { note }
  const BANDS = [
    [0.0, [16, 15, 34]], [0.12, [27, 25, 58]], [0.3, [52, 44, 92]], [0.48, [96, 78, 140]],
    [0.66, [150, 126, 182]], [0.82, [204, 186, 222]], [1.0, [246, 242, 250]],
  ];
  const bandColour = (t) => {
    for (let i = 1; i < BANDS.length; i++) if (t <= BANDS[i][0]) {
      const [t0, c0] = BANDS[i - 1], [t1, c1] = BANDS[i], k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
    }
    return BANDS[BANDS.length - 1][1];
  };
  // what is lit by what is in focus
  function litNote(n) {
    if (!focus) return 0;
    if (focus.note) return n === focus.note ? 2 : withOf(focus.note).slice(0, 12).some(([o]) => o === n) ? 1 : 0;
    if (focus.house) return focus.house.noteUse.has(n) ? 2 : 0;
    if (focus.accord != null) return n.ai === focus.accord ? 2 : 0;
    return 0;
  }
  function litAccord(ai) {
    if (!focus) return false;
    if (focus.accord != null) return focus.accord === ai;
    if (focus.house) return !!focus.house.share[DATA.accords[ai].code];
    if (focus.note) return focus.note.ai === ai;
    return false;
  }
  function litHouse(h) {
    if (!focus) return true;
    if (focus.house) return focus.house === h;
    if (focus.accord != null) return !!h.share[DATA.accords[focus.accord].code];
    if (focus.note) return h.frags.some((f) => f.notes.includes(focus.note));
    return true;
  }
  function drawStill() {
    stillDirty = false;
    const c = sctx, z = cam.z;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#0b0b16";
    c.fillRect(0, 0, still.width, still.height);
    view(c);
    const [vx0, vy0] = toWorld(-40, -40), [vx1, vy1] = toWorld(W + 40, H + 40);
    const inView = (x, y) => x > vx0 && x < vx1 && y > vy0 && y < vy1;
    // the bands, outermost first, each a ring
    const n = 34;
    for (let i = n - 1; i >= 0; i--) {
      const t = i / (n - 1);
      const r = G.rb0 + (G.rb1 - G.rb0) * Math.pow(t, 0.85);
      const col = bandColour(t);
      c.fillStyle = "rgb(" + col.join(",") + ")";
      c.beginPath(); c.arc(G.cx, G.cy, r, -Math.PI / 2, Math.PI / 2); c.lineTo(G.cx, G.cy); c.closePath(); c.fill();
    }
    // the night inside the domes' ring
    c.fillStyle = "#0b0b16";
    c.beginPath(); c.arc(G.cx, G.cy, G.rb0 - 1, -Math.PI / 2, Math.PI / 2); c.lineTo(G.cx, G.cy); c.closePath(); c.fill();
    // hairline rings, as the poster's day-lines
    c.lineWidth = lw(0.6);
    for (let i = 1; i < 12; i++) {
      const r = G.rb0 + (G.rt - G.rb0) * (i / 12);
      c.strokeStyle = "rgba(236,233,244," + (0.05 + 0.03 * (i % 3 === 0)) + ")";
      c.beginPath(); c.arc(G.cx, G.cy, r, -G.th * 1.12, G.th * 1.12); c.stroke();
    }
    // the ticks, a note each
    DATA.accords.forEach((a, ai) => {
      a.refs.forEach((nn) => {
        const lit = litNote(nn);
        const ang = noteAngle(ai, nn.ni), len = tickLen(nn);
        const [x0, y0] = at(G.rt - len, ang), [x1, y1] = at(G.rt, ang);
        c.globalAlpha = focus && !lit ? 0.25 : 1;
        c.strokeStyle = lit === 2 ? "rgba(255,226,170,0.95)" : lit === 1 ? "rgba(255,226,170,0.6)" : "rgba(236,232,255,0.42)";
        c.lineWidth = lw(lit === 2 ? 1.1 : 0.8);
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        if (focus && focus.note === nn) {
          c.fillStyle = "#ffe2aa";
          const [px, py] = at(G.rt - len - fs(4), ang);
          c.beginPath(); c.arc(px, py, fs(2.4), 0, TAU); c.fill();
        }
      });
    });
    c.globalAlpha = 1;
    // the notes' names past their ticks: what is lit first, then the most
    // named, each only where there is room on the screen for it — so the
    // closer in, the more are named, and from about three times as close all
    // of them, each with how many fragrances name it
    const tickPx = 5.2 * Math.pow(z, 0.55), tickFont = tickPx / z;
    const want = NOTES.map((nn) => ({ nn, lit: litNote(nn), ang: noteAngle(nn.ai, nn.ni) }))
      .filter((o) => o.lit === 2 || o.nn.uses >= Math.max(1, 12 / Math.pow(z, 1.6)) || (o.lit === 1 && z > 1.5))
      .sort((p, q) => (q.nn === (focus && focus.note) ? 1 : 0) - (p.nn === (focus && focus.note) ? 1 : 0) || q.lit - p.lit || q.nn.uses - p.nn.uses);
    const taken = [], gapA = (tickPx + 1.2) / (G.rt * z);
    c.textBaseline = "middle";
    for (const o of want) {
      if (!(focus && focus.note === o.nn) && taken.some((a2) => Math.abs(a2 - o.ang) < gapA)) continue;
      const [tx, ty] = at(G.rt + fs(4), o.ang);
      if (!inView(tx, ty)) continue;
      taken.push(o.ang);
      c.save();
      c.translate(tx, ty); c.rotate(o.ang);
      const big = focus && focus.note === o.nn;
      c.font = (big ? "600 " : "400 ") + (big ? tickFont * 1.5 : tickFont) + 'px "IBM Plex Mono", monospace';
      c.fillStyle = o.lit ? "rgba(255,236,200," + (o.lit === 2 ? 0.95 : 0.7) + ")" : "rgba(236,232,255," + (focus ? 0.3 : 0.55) + ")";
      c.fillText(o.nn.name, 0, 0);
      if (z >= 2.6 || big) {
        const w = c.measureText(o.nn.name).width;
        c.globalAlpha = 0.6;
        c.fillText(" " + o.nn.uses, w, 0);
        c.globalAlpha = 1;
      }
      c.restore();
    }
    // the accords' names round the outside, and a bracket over each stretch
    const names = placeNames();
    DATA.accords.forEach((a, ai) => {
      const lit = litAccord(ai);
      const a0 = noteAngle(ai, 0) - 0.003, a1 = noteAngle(ai, a.notes.length - 1) + 0.003;
      const br = G.ra - fs(22, 0.35);
      c.strokeStyle = lit ? "rgba(40,20,60,0.9)" : "rgba(40,32,70,0.45)";
      c.lineWidth = lw(0.8);
      c.beginPath(); c.arc(G.cx, G.cy, br, a0, a1); c.stroke();
      const mid = accordMid(ai), la = names[ai];
      const [m0x, m0y] = at(br, mid), [m1x, m1y] = at(G.ra, la);
      c.strokeStyle = "rgba(36,24,58,0.35)"; c.lineWidth = lw(0.6);
      c.beginPath(); c.moveTo(m0x, m0y); c.lineTo(m1x, m1y); c.stroke();
      const [mx, my] = at(G.ra + fs(4, 0.35), la);
      c.save();
      c.translate(mx, my); c.rotate(la);
      c.textBaseline = "middle";
      c.font = (lit ? "700 " : "600 ") + fs(narrow ? 8.5 : 11, 0.35) + 'px Archivo, sans-serif';
      c.fillStyle = lit ? "#24123a" : "rgba(36,24,58," + (focus ? 0.4 : 0.85) + ")";
      c.fillText(a.name, 0, 0);
      const w = c.measureText(a.name).width;
      c.font = '500 ' + fs(7, 0.35) + 'px "IBM Plex Mono", monospace';
      c.fillStyle = "rgba(36,24,58,0.55)";
      c.fillText(a.code + " · " + a.notes.length, w + fs(6, 0.35), fs(0.5, 0.35));
      c.restore();
      // a small mark where it begins
      const [px, py] = at(br, a0), s = fs(3, 0.35);
      c.fillStyle = "rgba(36,24,58,0.8)";
      c.fillRect(px - s / 2, py - s / 2, s, s);
    });
    // the houses' words, beside their domes
    const u = fs(1, 0.5);
    houses.forEach((h, i) => {
      const ang = angleOfHouse(i);
      const [x, y] = at(G.rd, ang);
      c.globalAlpha = litHouse(h) ? 1 : 0.3;
      c.textAlign = "right";
      c.font = '400 ' + 7 * u + 'px "IBM Plex Mono", monospace';
      c.fillStyle = "#8f8aa6";
      const tx = x - G.dome * 1.35 - 8 * u;
      if (!narrow || W > 600 || z > 1.6) {
        const where = [h.from, h.founded].filter(Boolean).join(" · ");
        if (where) c.fillText(where.toUpperCase(), tx, y - 20 * u);
        c.font = '700 ' + 9.5 * u + 'px Archivo, sans-serif'; c.fillStyle = "#ece9f4";
        c.fillText(groupName(h).toUpperCase(), tx, y - 9 * u);
        c.font = '400 ' + 7 * u + 'px "IBM Plex Mono", monospace'; c.fillStyle = "#8f8aa6";
        const rows = [["Fragrances", h.n], ["Notes", h.notes || "—"], ["Top accord", h.top || "—"]];
        if (focus && focus.note && litHouse(h)) rows.push(["Names " + focus.note.name, h.noteUse.get(focus.note) || 0]);
        rows.forEach(([k, v], r) => {
          c.fillText(k, tx - 54 * u, y + (3 + r * 9) * u);
          c.fillStyle = r === 3 ? "#ffe2aa" : "#ece9f4"; c.fillText(String(v), tx, y + (3 + r * 9) * u); c.fillStyle = "#8f8aa6";
        });
      }
      c.globalAlpha = 1;
    });
    c.textAlign = "left";
    // the year's name, faint, along the domes' ring
    c.save();
    const [yx, yy] = at(G.rd + G.dome * 1.6, G.th + 0.02);
    c.translate(yx, yy); c.rotate(G.th + 0.02 + Math.PI / 2);
    c.font = '500 ' + 7 * u + 'px "IBM Plex Mono", monospace'; c.fillStyle = "#5b5772";
    c.fillText("HOUSES · " + houses.length, 0, 0);
    c.restore();
  }

  // ---- A DOME, live -------------------------------------------------------
  const TILT = 0.42;    // how far we look down on it
  function dome(c, x, y, r, h, t, alpha, hi) {
    const ct = Math.cos(TILT), st = Math.sin(TILT);
    const P = (px, py, pz) => [x + px * r, y - (py * ct - pz * st) * r];   // y up, z toward us
    c.globalAlpha = alpha;
    // the ground ring and its shadow
    c.strokeStyle = hi ? "#f5efff" : "rgba(220,212,246,0.75)";
    c.lineWidth = lw(0.8);
    c.beginPath(); c.ellipse(x, y, r, r * st, 0, 0, TAU); c.stroke();
    c.fillStyle = "rgba(140,120,200,0.08)"; c.fill();
    // latitude rings
    for (let k = 1; k <= 3; k++) {
      const el = (k / 4) * (Math.PI / 2), rr = Math.cos(el), yy = Math.sin(el);
      const [cx2, cy2] = P(0, yy, 0);
      c.strokeStyle = "rgba(200,190,240,0.35)";
      c.beginPath(); c.ellipse(cx2, cy2, rr * r, rr * r * st, 0, 0, TAU); c.stroke();
    }
    // meridians, turning
    c.strokeStyle = "rgba(210,200,248,0.32)";
    for (let m = 0; m < 6; m++) {
      const az = t + (m / 6) * Math.PI;
      c.beginPath();
      for (let k = 0; k <= 12; k++) {
        const el = (k / 12) * Math.PI;
        const px = Math.cos(el) * Math.cos(az), pz = Math.cos(el) * Math.sin(az), py = Math.sin(el);
        const [sx, sy] = P(px, py, pz);
        k ? c.lineTo(sx, sy) : c.moveTo(sx, sy);
      }
      c.stroke();
    }
    // the path over it, as high as the house has fragrances, and a light on it
    const peak = 0.25 + 0.7 * h;
    c.strokeStyle = hi ? "#fff" : "rgba(255,250,240,0.85)";
    c.lineWidth = lw(hi ? 1.3 : 1);
    c.beginPath();
    for (let k = 0; k <= 24; k++) {
      const s = k / 24, az = -Math.PI * 0.85 + s * Math.PI * 1.7;
      const el = Math.sin(s * Math.PI) * peak * (Math.PI / 2);
      const [sx, sy] = P(Math.cos(el) * Math.cos(az) * 0.98, Math.sin(el), Math.cos(el) * Math.sin(az) * 0.98);
      k ? c.lineTo(sx, sy) : c.moveTo(sx, sy);
    }
    c.stroke();
    const s = (t * 0.25) % 1, az = -Math.PI * 0.85 + s * Math.PI * 1.7, el = Math.sin(s * Math.PI) * peak * (Math.PI / 2);
    const [lx, ly] = P(Math.cos(el) * Math.cos(az) * 0.98, Math.sin(el), Math.cos(el) * Math.sin(az) * 0.98);
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(lx, ly, fs(2.2, 0.3), 0, TAU); c.fill();
    c.fillStyle = "rgba(255,255,255,0.18)";
    c.beginPath(); c.arc(lx, ly, fs(6, 0.3), 0, TAU); c.fill();
    // the pin at its heart
    c.fillStyle = hi ? "#eba33f" : "rgba(236,233,244,0.9)";
    c.beginPath(); c.moveTo(x, y - 2 / cam.z); c.arc(x, y - r * 0.32, r * 0.11, Math.PI * 0.75, Math.PI * 2.25); c.closePath(); c.fill();
    c.globalAlpha = 1;
  }

  // ---- THE FRAME -------------------------------------------------------
  const maxN = Math.max(...houses.map((h) => h.n));
  const born = performance.now();
  let last = 0;
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    // the view eases to where it was sent
    if (moving) {
      const k = STILL ? 1 : 1 - Math.exp(-dt * 11);
      cam.z = Math.exp(Math.log(cam.z) + (Math.log(goal.z) - Math.log(cam.z)) * k);
      cam.x += (goal.x - cam.x) * k; cam.y += (goal.y - cam.y) * k;
      if (Math.abs(goal.z / cam.z - 1) < 0.002 && Math.hypot(goal.x - cam.x, goal.y - cam.y) * cam.z < 0.4) { Object.assign(cam, goal); moving = false; }
      stillDirty = true;
    }
    if (stillDirty) drawStill();
    const t = STILL ? 0 : (now - born) / 1000;
    const intro = STILL ? 1 : Math.min(1, (now - born) / 1800);
    const c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(still, 0, 0);
    view(c);

    // the bands breathe: a soft light travelling round them
    if (!STILL) {
      const a = -G.th + ((t * 0.04) % 1) * 2 * G.th * 1.3 - 0.15 * G.th;
      const g = c.createRadialGradient(...at(G.rb0 + (G.rt - G.rb0) * 0.5, a), 0, ...at(G.rb0 + (G.rt - G.rb0) * 0.5, a), H * 0.35);
      g.addColorStop(0, "rgba(255,240,255,0.10)"); g.addColorStop(1, "rgba(255,240,255,0)");
      c.fillStyle = g;
      c.beginPath(); c.arc(G.cx, G.cy, G.rt + 4, -Math.PI / 2, Math.PI / 2); c.arc(G.cx, G.cy, G.rb0, Math.PI / 2, -Math.PI / 2, true); c.fill();
    }

    const dot = fs(2.4, 0.3);
    if (focus && focus.note) {
      // a note chosen: a line from every house that names it, as heavy as how many of its fragrances do
      const nn = focus.note, ang2 = noteAngle(nn.ai, nn.ni);
      const [ex, ey] = at(G.rt - tickLen(nn) - fs(4), ang2);
      houses.forEach((h, i) => {
        const cnt = h.noteUse.get(nn) || 0;
        if (!cnt) return;
        const [x, y] = at(G.rd + G.dome * 1.05, angleOfHouse(i));
        const mx = x + (ex - x) * 0.55, my = y + (ey - y) * 0.15;
        c.strokeStyle = "rgba(255,214,150,0.95)";
        c.globalAlpha = Math.min(1, 0.35 + cnt * 0.12);
        c.lineWidth = lw(0.9 + Math.min(6, cnt * 0.9));
        c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, ex, ey); c.stroke();
        if (!STILL) {
          const s = (t * 0.35 + i * 0.13) % 1;
          const qx = (1 - s) * (1 - s) * x + 2 * (1 - s) * s * mx + s * s * ex, qy = (1 - s) * (1 - s) * y + 2 * (1 - s) * s * my + s * s * ey;
          c.globalAlpha = Math.sin(s * Math.PI);
          c.fillStyle = "#fff";
          c.fillRect(qx - dot / 2, qy - dot / 2, dot, dot);
        }
      });
      c.globalAlpha = 1;
    } else {
      // the lines from the houses out to the accords
      houses.forEach((h, i) => {
        const k = Math.max(0, Math.min(1, intro * 2.2 - i * 0.07));
        if (k <= 0) return;
        const ang = angleOfHouse(i);
        const [x, y] = at(G.rd + G.dome * 1.05, ang);
        const total = Object.values(h.share).reduce((s, v) => s + v, 0) || 1;
        const hiH = focus && focus.house === h;
        for (const code in h.share) {
          const a = ACC[code], share = h.share[code] / total;
          const lit = !focus || hiH || (focus.accord === a.i);
          const ang2 = accordMid(a.i);
          const [ex, ey] = at(G.rt - 44, ang2);
          const mx = x + (ex - x) * 0.55, my = y + (ey - y) * 0.15;
          c.strokeStyle = hiH || focus && focus.accord === a.i ? "rgba(255,214,150,0.9)" : "rgba(236,230,255,1)";
          c.globalAlpha = (hiH || (focus && focus.accord === a.i) ? 0.3 + share * 2.4 : lit ? 0.035 + share * 1.1 : 0.02) * k;
          c.lineWidth = lw(hiH ? 0.9 + share * 6 : 0.5 + share * 2.4);
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, x + (ex - x) * k, y + (ey - y) * k); c.stroke();
          // a light running out along it
          if (!STILL && lit && k >= 1) {
            const s = (t * (0.18 + share) + i * 0.13 + a.i * 0.07) % 1;
            const qx = (1 - s) * (1 - s) * x + 2 * (1 - s) * s * mx + s * s * ex, qy = (1 - s) * (1 - s) * y + 2 * (1 - s) * s * my + s * s * ey;
            c.globalAlpha = Math.min(1, 0.15 + share * 3) * Math.sin(s * Math.PI) * (focus ? 1 : 0.7);
            c.fillStyle = "#fff";
            c.fillRect(qx - dot / 2, qy - dot / 2, dot, dot);
          }
          // the pill where it lands, for what is pointed at
          if (hiH) {
            c.globalAlpha = 1;
            c.fillStyle = "rgba(255,250,244,0.95)";
            const pw = fs(26, 0.4), ph = fs(9, 0.4);
            c.save(); c.translate(ex, ey); c.rotate(ang2);
            c.beginPath(); c.roundRect ? c.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2) : c.rect(-pw / 2, -ph / 2, pw, ph); c.fill();
            c.fillStyle = "#24123a"; c.font = '500 ' + fs(6, 0.4) + 'px "IBM Plex Mono", monospace'; c.textAlign = "center"; c.textBaseline = "middle";
            c.fillText(code + " " + h.share[code], 0, fs(0.5, 0.4));
            c.restore(); c.textAlign = "left";
          }
        }
      });
      c.globalAlpha = 1;
    }

    // the domes
    houses.forEach((h, i) => {
      const k = Math.max(0, Math.min(1, intro * 2 - i * 0.06));
      if (k <= 0) return;
      const ang = angleOfHouse(i);
      const [x, y] = at(G.rd, ang);
      const hi = focus && focus.house === h;
      const dim = focus && !litHouse(h);
      const e = 1 - Math.pow(1 - k, 3);
      dome(c, x, y + 6, G.dome * (0.6 + 0.4 * e) * (hi ? 1.12 : 1), h.n / maxN, t * (0.25 + 0.04 * i) + i, (dim ? 0.3 : 1) * e, hi);
    });
    if ((!STILL && !document.hidden) || moving) kick();
  }
  let raf = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  // ---- WHAT IS UNDER THE HAND ---------------------------------------------
  // in the poster's own units; closer than a little over twice, a press in
  // an accord's stretch is a press on the note under it
  const NOTE_FROM = 2.2;
  function pick(sx, sy) {
    const [mx, my] = toWorld(sx, sy), u = fs(1, 0.5);
    for (let i = 0; i < houses.length; i++) {
      const [x, y] = at(G.rd, angleOfHouse(i));
      if (Math.hypot(mx - x, my - y - 4) < G.dome * 1.4 || (mx < x && mx > x - G.dome * 1.4 - 150 * u && Math.abs(my - y) < 22 * u)) return { house: houses[i] };
    }
    const r = Math.hypot(mx - G.cx, my - G.cy), ang = Math.atan2(my - G.cy, mx - G.cx);
    const onName = r > G.ra - fs(10, 0.35);
    if (r > G.rt - 46 && r < G.ra + fs(120, 0.35)) {
      const names = placeNames();
      for (let ai = 0; ai < DATA.accords.length; ai++) {
        if (onName && Math.abs(ang - names[ai]) < fs(narrow ? 6 : 8, 0.35) / G.ra) return { accord: ai };
      }
      if (onName) return null;
      // the note nearest the hand, by its angle; within a slot and a half of it
      const slot = span() / slots();
      let best = null, bd = Infinity;
      for (const nn of NOTES) { const d = Math.abs(noteAngle(nn.ai, nn.ni) - ang); if (d < bd) { bd = d; best = nn; } }
      if (!best || bd > slot * 1.5) return null;
      const nearTicks = r < G.rt + fs(70);
      if (cam.z >= NOTE_FROM && nearTicks) return { note: best };
      return { accord: best.ai, near: nearTicks ? best : null };
    }
    return null;
  }
  function same(a, b) { return (!a && !b) || (a && b && a.house === b.house && a.accord === b.accord && a.note === b.note); }
  function setFocus(f) {
    if (same(f, focus)) return;
    focus = f; stillDirty = true; kick();
    gloss.querySelectorAll("li").forEach((li) => li.classList.toggle("is-lit", !!f && litAccord(ACC[li.dataset.code].i)));
  }
  const focusOf = (f) => f && (f.house ? { house: f.house } : f.note ? { note: f.note } : { accord: f.accord });

  // ---- THE PANEL: what it is, every name in it a way on to its own -----------
  const hist = [];
  let current = null;
  const row = (go, label, n, of, extra) =>
    '<button type="button" class="t2-row" data-go="' + go + '"><span class="t2-row-name">' + label + '</span><span class="t2-row-bar"><i style="width:' + Math.max(2, Math.round((n / (of || 1)) * 100)) + '%"></i></span><span class="t2-row-n">' + n + (extra || "") + "</span></button>";
  const chip = (nn, n) => '<button type="button" class="t2-chip" data-go="note:' + nn.id + '">' + esc(nn.name) + (n != null ? " <span>" + n + "</span>" : "") + "</button>";
  const stat = (k, v) => "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>";
  const RENDER = {
    house(h) {
      const named = h.frags.reduce((s, f) => s + f.notes.length, 0);
      const codes = Object.keys(h.share).sort((a, b) => h.share[b] - h.share[a]);
      const top = [...h.noteUse].sort((a, b) => b[1] - a[1] || a[0].name.localeCompare(b[0].name)).slice(0, 14);
      const maxS = codes.length ? h.share[codes[0]] : 1;
      let s = '<p class="t2-k">' + (h.id === "individual" ? "A group · no house of its own here" : "House") + "</p>";
      s += '<h2 class="t2-n">' + esc(groupName(h)) + "</h2>";
      if (h.sub) s += '<p class="t2-s">' + esc(h.sub) + "</p>";
      const where = [h.from, h.founded && "founded " + h.founded].filter(Boolean).join(" · ");
      if (where) s += '<p class="t2-where">' + esc(where) + "</p>";
      s += '<dl class="t2-stats">' + stat("Fragrances", h.n) + stat("Notes named", named || "—") + stat("Different notes", h.notes || "—") + stat("Most in", h.top ? esc(h.top) : "—") + "</dl>";
      if (!named) s += '<p class="t2-none">No notes have been found for its fragrances yet.</p>';
      if (codes.length) {
        s += "<h3>Its accords <span>notes named in each</span></h3><div class=\"t2-rows\">";
        codes.forEach((code) => { s += row("accord:" + code, '<b class="t2-code">' + code + "</b>" + esc(ACC[code].name), h.share[code], maxS); });
        s += "</div>";
      }
      if (top.length) {
        s += "<h3>Its most named notes <span>in how many of its " + h.n + "</span></h3><div class=\"t2-rows\">";
        top.forEach(([nn, n]) => { s += row("note:" + nn.id, esc(nn.name), n, h.n); });
        s += "</div>";
      }
      s += "<h3>Its fragrances <span>" + h.frags.length + "</span></h3><div class=\"t2-frags\">";
      h.frags.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((f) => {
        const meta = [f.from && "from " + f.from, f.year || null, f.notes.length ? f.notes.length + " notes" : "no notes found"].filter(Boolean).join(" · ");
        s += '<details class="t2-frag"><summary><span>' + esc(f.name) + '</span><small>' + esc(meta) + "</small></summary>";
        s += f.notes.length ? '<div class="t2-chips">' + f.notes.map((nn) => chip(nn)).join("") + "</div>" : '<p class="t2-none">No notes found for it yet.</p>';
        s += "</details>";
      });
      return s + "</div>";
    },
    accord(ai) {
      const a = DATA.accords[ai];
      const hs = houses.filter((h) => h.share[a.code]).sort((p, q) => q.share[a.code] - p.share[a.code]);
      const notes = a.refs.slice().sort((p, q) => q.uses - p.uses || p.name.localeCompare(q.name));
      let s = '<p class="t2-k">Accord · ' + a.code + "</p>";
      s += '<h2 class="t2-n">' + esc(a.name) + "</h2>";
      s += '<p class="t2-s">' + esc(a.say) + "</p>";
      s += '<dl class="t2-stats">' + stat("Notes", a.notes.length) + stat("Times named", a.mentions) + stat("Houses", hs.length) + stat("Most named", esc(notes[0].name)) + "</dl>";
      s += "<h3>In the houses <span>notes named from it</span></h3><div class=\"t2-rows\">";
      hs.forEach((h) => { s += row("house:" + h.i, esc(groupName(h)), h.share[a.code], hs[0].share[a.code]); });
      s += "</div><h3>Its notes <span>fragrances naming each</span></h3><div class=\"t2-rows\">";
      notes.forEach((nn) => { s += row("note:" + nn.id, esc(nn.name), nn.uses, notes[0].uses); });
      return s + "</div>";
    },
    note(nn) {
      const a = DATA.accords[nn.ai];
      const hs = housesOf(nn), w = withOf(nn).slice(0, 12);
      const rank = a.refs.slice().sort((p, q) => q.uses - p.uses).indexOf(nn) + 1;
      let s = '<p class="t2-k">Note · <button type="button" class="t2-link" data-go="accord:' + a.code + '">' + esc(a.name) + "</button></p>";
      s += '<h2 class="t2-n">' + esc(nn.name) + "</h2>";
      s += '<p class="t2-s">Named by ' + nn.uses + " of the " + FRAGS.length + " fragrances on the site.</p>";
      s += '<dl class="t2-stats">' + stat("Fragrances", nn.uses) + stat("Houses", hs.length) + stat("In its accord", "#" + rank + " of " + a.notes.length) + stat("Of all notes", "#" + (NOTES.slice().sort((p, q) => q.uses - p.uses).indexOf(nn) + 1) + " of " + NOTES.length) + "</dl>";
      s += "<h3>In the houses <span>fragrances naming it</span></h3><div class=\"t2-rows\">";
      hs.forEach(([h, n]) => { s += row("house:" + h.i, esc(groupName(h)), n, h.n, '<small> of ' + h.n + "</small>"); });
      s += "</div><h3>The fragrances <span>" + nn.frags.length + "</span></h3><ul class=\"t2-list\">";
      nn.frags.slice().sort((p, q) => p.name.localeCompare(q.name)).forEach((f) => {
        s += '<li><button type="button" class="t2-link" data-go="house:' + f.house.i + '">' + esc(f.name) + "</button><small>" + esc([f.house.id === "individual" ? "from " + f.from : f.house.name, f.year || null].filter(Boolean).join(" · ")) + "</small></li>";
      });
      s += "</ul>";
      if (w.length) s += '<h3>Most often with <span>in the same fragrance</span></h3><div class="t2-chips">' + w.map(([o, n]) => chip(o, n)).join("") + "</div>";
      return s;
    },
  };
  function openInfo(kind, obj, push = true) {
    if (push && current && !(current.kind === kind && current.obj === obj)) hist.push(current);
    current = { kind, obj };
    infoBody.innerHTML = RENDER[kind](obj);
    info.hidden = false;
    info.dataset.kind = kind;
    infoBody.scrollTop = 0; info.scrollTop = 0;
    infoBack.hidden = !hist.length;
    pinned = kind === "house" ? { house: obj } : kind === "note" ? { note: obj } : { accord: obj };
    setFocus(pinned);
    tip.hidden = true;
  }
  function closeInfo() {
    info.hidden = true; hist.length = 0; current = null; pinned = null;
    setFocus(null);
  }
  function goTo(spec) {
    const [kind, id] = spec.split(":");
    if (kind === "house") openInfo("house", houses[+id]);
    else if (kind === "accord") openInfo("accord", ACC[id].i);
    else if (kind === "note") openInfo("note", NOTES[+id]);
  }
  // where a thing stands on the poster: a box round it in the poster's own
  // units, framed in what the panel leaves of the window (beside it on a wide
  // one, above it on a phone), no closer than it is worth
  function boxOf(kind, obj) {
    const pts = [];
    if (kind === "house") {
      const [x, y] = at(G.rd, angleOfHouse(obj.i));
      pts.push([x - G.dome * 1.4 - 160, y - 50], [x + G.dome * 2.5, y + 50]);
      return { pts, most: 3 };
    }
    if (kind === "accord") {
      const a0 = noteAngle(obj, 0), a1 = noteAngle(obj, DATA.accords[obj].notes.length - 1);
      for (let k = 0; k <= 6; k++) { const ang = a0 + ((a1 - a0) * k) / 6; pts.push(at(G.rt - 46, ang), at(G.ra + 90, ang)); }
      return { pts, most: 6 };
    }
    const ang = noteAngle(obj.ai, obj.ni);
    pts.push(at(G.rt - tickLen(obj) - 8, ang - 0.004), at(G.rt + 90, ang + 0.004));
    return { pts, most: 5 };
  }
  function showOn(kind, obj) {
    if (narrow) canvas.scrollIntoView({ behavior: "auto", block: "start" });
    const { pts, most } = boxOf(kind, obj);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const open = !info.hidden;
    const left = open && !narrow ? 330 : 0;
    const tall = open && narrow ? Math.min(H, innerHeight * 0.42) : H;
    const z = clampV(Math.min((W - left - 60) / Math.max(1, x1 - x0), (tall - 50) / Math.max(1, y1 - y0)), 1.2, most);
    const sx = left + (W - left) / 2, sy = tall / 2;
    go({ z, x: (x0 + x1) / 2 - (sx - W / 2) / z, y: (y0 + y1) / 2 - (sy - H / 2) / z });
  }
  infoBody.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) { e.preventDefault(); goTo(b.dataset.go); }
  });
  infoBack.addEventListener("click", () => { const prev = hist.pop(); if (prev) openInfo(prev.kind, prev.obj, false); infoBack.hidden = !hist.length; });
  infoClose.addEventListener("click", closeInfo);
  infoShow.addEventListener("click", () => { if (current) showOn(current.kind, current.obj); });

  // ---- THE SEARCH ------------------------------------------------------------
  const plain = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const ITEMS = [
    ...houses.map((h) => ({ kind: "house", obj: h, name: groupName(h), say: h.id === "individual" ? "Group · " + h.n + " fragrances" : "House · " + h.n + " fragrances" })),
    ...DATA.accords.map((a) => ({ kind: "accord", obj: a.i, name: a.name, say: "Accord · " + a.code + " · " + a.notes.length + " notes" })),
    ...NOTES.map((nn) => ({ kind: "note", obj: nn, name: nn.name, say: "Note · " + DATA.accords[nn.ai].name + " · in " + nn.uses })),
  ].map((it) => Object.assign(it, { key: plain(it.name) }));
  let results = [];
  function search() {
    const q = plain(findIn.value.trim());
    if (!q) { found.hidden = true; results = []; return; }
    results = ITEMS.filter((it) => it.key.includes(q) || (it.kind === "accord" && plain(DATA.accords[it.obj].code) === q))
      .sort((p, q2) => (q2.key.startsWith(q) ? 1 : 0) - (p.key.startsWith(q) ? 1 : 0) || ["house", "accord", "note"].indexOf(p.kind) - ["house", "accord", "note"].indexOf(q2.kind) || (q2.obj.uses || 0) - (p.obj.uses || 0))
      .slice(0, 8);
    found.innerHTML = results.length
      ? results.map((it, i) => '<li><button type="button" data-r="' + i + '"><span>' + esc(it.name) + "</span><small>" + esc(it.say) + "</small></button></li>").join("")
      : '<li class="t2-found-none">Nothing on the poster by that name.</li>';
    found.hidden = false;
  }
  function choose(it) {
    findIn.value = ""; found.hidden = true; results = [];
    hist.length = 0; current = null;
    openInfo(it.kind, it.obj);
    showOn(it.kind, it.obj);
  }
  findIn.addEventListener("input", search);
  findIn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && results[0]) { e.preventDefault(); choose(results[0]); }
    if (e.key === "Escape") { findIn.value = ""; found.hidden = true; }
  });
  found.addEventListener("click", (e) => { const b = e.target.closest("[data-r]"); if (b) choose(results[+b.dataset.r]); });
  document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".t2-find")) found.hidden = true; });

  // ---- THE HAND: pointing, pressing, dragging, pinching, the wheel ---------
  const pts = new Map();
  let press = null, pinch = null;
  const local = (e) => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  function hoverAt(e) {
    const [sx, sy] = local(e);
    const f = pick(sx, sy);
    if (!pinned) setFocus(focusOf(f));
    canvas.style.cursor = f ? "pointer" : goal.z > 1.01 ? "grab" : "default";
    if (!f || e.pointerType === "touch") { tip.hidden = true; return; }
    let html;
    if (f.house) {
      const h = f.house;
      html = "<b>" + esc(groupName(h)) + "</b>" + (h.sub ? esc(h.sub) + "<br>" : "") + h.n + " fragrances · " + (h.notes ? h.notes + " notes" : "no notes found yet") + (h.top ? "<br>most in " + esc(h.top) : "");
    } else if (f.note) {
      const nn = f.note;
      html = "<b>" + esc(nn.name) + "</b>" + esc(DATA.accords[nn.ai].name) + " · named by " + nn.uses + "<br>in " + housesOf(nn).length + " houses";
    } else {
      const a = DATA.accords[f.accord];
      const users = houses.filter((h) => h.share[a.code]).length;
      html = "<b>" + esc(a.name) + "</b>" + esc(a.say) + "<br>" + a.notes.length + " notes · in " + users + " houses" + (f.near ? "<br>" + esc(f.near.name) + " · named by " + f.near.uses : "") + (f.near ? "<br><i>closer in, each note can be pressed</i>" : "");
    }
    tip.innerHTML = html + "<em>Press for more</em>";
    tip.hidden = false;
    const hb = host.getBoundingClientRect();
    let x = e.clientX - hb.left + 14, y = e.clientY - hb.top + 14;
    if (x + 250 > hb.width) x -= 270;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  canvas.addEventListener("pointerdown", (e) => {
    pts.set(e.pointerId, local(e));
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, z: cam.z, w: toWorld(mid[0], mid[1]) };
      press = null;
      return;
    }
    press = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, id: e.pointerId, type: e.pointerType };
    if (goal.z > 1.01 || e.pointerType !== "touch") { try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* none */ } }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, local(e));
    if (pinch && pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]), mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const z = clampV(pinch.z * (d / pinch.d), 1, ZMAX);
      go({ z, x: pinch.w[0] - (mid[0] - W / 2) / z, y: pinch.w[1] - (mid[1] - H / 2) / z }, true);
      return;
    }
    if (press && press.id === e.pointerId) {
      const dx = e.clientX - press.x, dy = e.clientY - press.y;
      if (!press.moved && Math.hypot(dx, dy) > 5) { press.moved = true; tip.hidden = true; }
      if (press.moved && goal.z > 1.01) {
        canvas.style.cursor = "grabbing";
        go({ x: press.cx - dx / cam.z, y: press.cy - dy / cam.z, z: goal.z }, true);
      }
      return;
    }
    if (e.pointerType !== "touch") hoverAt(e);
  });
  function lift(e) {
    pts.delete(e.pointerId);
    if (pinch) { if (pts.size < 2) pinch = null; press = null; return; }
    if (!press || press.id !== e.pointerId) return;
    const moved = press.moved;
    press = null;
    if (moved || e.type === "pointercancel") { canvas.style.cursor = goal.z > 1.01 ? "grab" : "default"; return; }
    const [sx, sy] = local(e);
    const f = pick(sx, sy);
    if (!f) { closeInfo(); return; }
    hist.length = 0; current = null;
    if (f.house) openInfo("house", f.house);
    else if (f.note) openInfo("note", f.note);
    else openInfo("accord", f.accord);
  }
  canvas.addEventListener("pointerup", lift);
  canvas.addEventListener("pointercancel", lift);
  canvas.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") { if (!pinned) setFocus(null); tip.hidden = true; } });
  canvas.addEventListener("dblclick", (e) => { const [sx, sy] = local(e); zoomAt(sx, sy, 2.4); });
  canvas.addEventListener("wheel", (e) => {
    // on a narrow window the page scrolls under a plain wheel until the poster is closer in
    if (narrow && !e.ctrlKey && goal.z <= 1.01) return;
    e.preventDefault();
    const [sx, sy] = local(e);
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    zoomAt(sx, sy, Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0022)));
    tip.hidden = true;
  }, { passive: false });
  document.querySelectorAll(".t2-zoom [data-z]").forEach((b) => b.addEventListener("click", () => {
    const k = +b.dataset.z;
    if (!k) go({ x: W / 2, y: H / 2, z: 1 });
    else zoomAt(narrow ? W / 2 : G.left + (W - G.left) / 2, H / 2, k > 0 ? 1.8 : 1 / 1.8);
  }));
  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    if (e.key === "+" || e.key === "=") zoomAt(narrow ? W / 2 : G.left + (W - G.left) / 2, H / 2, 1.5);
    else if (e.key === "-" || e.key === "_") zoomAt(narrow ? W / 2 : G.left + (W - G.left) / 2, H / 2, 1 / 1.5);
    else if (e.key === "0") go({ x: W / 2, y: H / 2, z: 1 });
    else if (e.key === "Escape" && !info.hidden) closeInfo();
    else if (e.key.startsWith("Arrow") && goal.z > 1.01) {
      const s = 80 / goal.z;
      go({ x: goal.x + (e.key === "ArrowRight" ? s : e.key === "ArrowLeft" ? -s : 0), y: goal.y + (e.key === "ArrowDown" ? s : e.key === "ArrowUp" ? -s : 0), z: goal.z });
      e.preventDefault();
    }
  });
  gloss.addEventListener("pointerover", (e) => {
    const li = e.target.closest("li"); if (!li || pinned) return;
    setFocus({ accord: ACC[li.dataset.code].i });
  });
  gloss.addEventListener("pointerleave", () => { if (!pinned) setFocus(null); });
  gloss.addEventListener("click", (e) => {
    const li = e.target.closest("li"); if (!li) return;
    hist.length = 0; current = null;
    const ai = ACC[li.dataset.code].i;
    openInfo("accord", ai);
    showOn("accord", ai);
  });
  gloss.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.closest("li")) { e.preventDefault(); e.target.click(); } });

  addEventListener("resize", () => { layout(); kick(); });
  document.addEventListener("visibilitychange", kick);
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { stillDirty = true; kick(); });
  kick();

  // for the tests: where a thing stands on the screen, and what is shown
  window.TestPage2 = {
    focus: () => focus && (focus.house ? focus.house.id : focus.note ? "note:" + focus.note.name : DATA.accords[focus.accord].code),
    houses: houses.length, accords: DATA.accords.length, notes: NOTES.length, fragrances: FRAGS.length,
    zoom: () => cam.z, goal: () => goal.z, moving: () => moving,
    info: () => (current ? { kind: current.kind, name: current.kind === "accord" ? DATA.accords[current.obj].name : current.kind === "house" ? groupName(current.obj) : current.obj.name } : null),
    at(kind, name) {
      const b = canvas.getBoundingClientRect();
      let w;
      if (kind === "house") { const h = houses.find((x) => groupName(x) === name || x.name === name); w = at(G.rd, angleOfHouse(h.i)); }
      else if (kind === "note") { const nn = NOTES.find((x) => x.name === name); w = at(G.rt - 3, noteAngle(nn.ai, nn.ni)); }
      else { const a = DATA.accords.find((x) => x.name === name); w = at(G.ra + fs(14, 0.35), placeNames()[a.i]); }
      const [sx, sy] = toScreen(w[0], w[1]);
      return [b.left + sx, b.top + sy];
    },
  };
})();

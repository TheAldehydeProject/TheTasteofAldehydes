// ============================================================
// TEST PAGE 4 — "The Network Map" (test-pages/4/). Not a page of the
// site: it loads nothing of the site's and nothing of the site loads it.
//
// The owner's image 4 — a whiteboard, a dense network in many colours, a
// square frame through it, bees, a toolbar — made of the whole site: every
// house (white discs, their lines in a colour of their own, their line of
// writing pinned beside them on a coloured note), perfumer (rings with
// their names in dark boxes), perfume (small dots in their house's colour)
// and note (specks in their accord's colour, the accords as faint rings),
// joined as the Perfumers ledger and the notes join them. The network was
// laid out once, ahead of time (d3-force), and is written below.
//
// THE BOARD: everything on the toolbar works —
//   undo, redo, delete, duplicate, and more (fit, every name, a picture,
//   reset); select (move anything, a box round several, a corner to
//   resize), hand (pan; space too), pen, eraser, arrow, text, note,
//   picture (from your computer), circle, and more shapes (box,
//   triangle, star, diamond). The keys: V H P E A T N I O, Delete, ⌘Z,
//   ⇧⌘Z, ⌘D, Escape. Wheel or pinch to zoom. What is drawn is kept in
//   this browser (localStorage).
//
// KEPT SMOOTH: the network and everything drawn on it are one picture,
// drawn again only when something changes; a frame lays that down and
// draws over it only what moves — the lights along the lines, the bees,
// what the hand is on, what is being drawn.
// ============================================================
(function () {
  "use strict";

  const NET = {"nodes":[["h","Pineward",-785,702,48,"The House That Smells Like Trees"],["h","Apoteker Tepe",-35,-583,8,"The Apothecary on the Hill"],["h","ADAR",-477,-417,11,"The House That You Have Never Heard of"],["h","Almost Human",449,1135,5,"Abstraction Done Quite Well"],["h","Ataraxia",-22,703,5,"A Gothic Avante Garde House"],["h","Grande Parfums",-121,-157,15,"Art Niche Expo 2026"],["h","Les Abstraits",-486,66,4,"Eugen’s Ideas and Antoine Lie’s Execution"],["h","Tale Parfums",-858,-208,4,""],["h","Tombstone",155,-159,5,"A House That Expanded on Death"],["h","Qimu & Musicians",229,325,4,"A House of Music and Fragrance"],["h","Om Parfums",602,-234,9,"The Olfaction of Om"],["h","Outsider Parfums",379,-224,5,"The Sister House of Om"],["h","Lost Tribe",287,661,6,"A House of Notable Quality"],["h","Serge Lutens",948,547,1,""],["h","Dior",226,-505,1,""],["h","Ramón Monegal",-162,516,1,""],["h","Mancera",-786,-403,1,""],["h","Casa Goa",330,164,1,""],["h","Matca",-10,46,1,""],["h","Lussur",-135,200,1,""],["h","JMP Artisan Perfumes",545,-1443,2,""],["h","Sultan Pasha Perfumes",-590,327,1,""],["h","Areej Le Doré",604,78,1,""],["h","Slumberhouse",-353,531,1,""],["h","Strangers Parfumerie",20,-1294,67,""],["h","Parfum Prissana",-382,-1002,32,""],["h","PRIN",-350,-1392,40,""],["p","Nicholas Nilsson",-804,822,0,""],["p","Dan & Roxana Adar",-397,-508,0,""],["p","Goran Bajazetov",515,1237,0,""],["p","David-Lev Jipa-Slivinschi",-32,1104,0,""],["p","Sy Truong",-73,896,0,""],["p","Antoine Lie",-603,96,0,""],["p","Michael Nordstrand",-1273,-231,0,""],["p","Chad Hodge",-1245,-329,0,""],["p","Qimu",197,927,0,""],["p","Aichi Liu",488,-275,0,""],["p","Mathew Schmuelian",407,678,0,""],["p","Rajesh Balkrishnan",549,654,0,""],["p","Holladay Penick Saltz",0,-717,0,""],["p","Christopher Sheldrake",983,698,0,""],["p","François Demachy",423,-593,0,""],["p","Ramón Monegal",-249,730,0,""],["p","Pierre Montale",-920,-500,0,""],["p","Jakub Pietrynka",652,-1264,0,""],["p","Sultan Pasha",-771,319,0,""],["p","Christian Carbonnel",-761,237,0,""],["p","Russian Adam",791,26,0,""],["p","Josh Lobb",-380,727,0,""],["p","Prin Lomros",-198,-1144,0,""],["p","Perfumer not found",-31,-75,0,""],["f","Bindebole",-912,692,0,"pineward"],["f","Boreal",-712,790,0,"pineward"],["f","Brokilän",-884,720,0,"pineward"],["f","Cotswold",-877,662,0,"pineward"],["f","Eldritch",-818,590,0,"pineward"],["f","Fanghorn II",-906,747,0,"pineward"],["f","Funerie",-665,671,0,"pineward"],["f","Juniperus",-683,666,0,"pineward"],["f","Murkwood",-906,673,0,"pineward"],["f","Nocturnis",-653,671,0,"pineward"],["f","Oxylus",-890,778,0,"pineward"],["f","Snoqualmie",-894,793,0,"pineward"],["f","Sturbridge",-859,634,0,"pineward"],["f","White Fir",-788,578,0,"pineward"],["f","Bucolic",-887,708,0,"pineward"],["f","Hayloft",-703,807,0,"pineward"],["f","Hayride",-659,776,0,"pineward"],["f","Pastoral",-683,716,0,"pineward"],["f","Shire",-661,762,0,"pineward"],["f","Steading",-911,709,0,"pineward"],["f","Christmas Wine",-724,816,0,"pineward"],["f","Gingerbread",-872,764,0,"pineward"],["f","Glühwein",-774,592,0,"pineward"],["f","Revelries",-884,747,0,"pineward"],["f","Acadian",-758,595,0,"pineward"],["f","Coastal Veil",-855,623,0,"pineward"],["f","Gingermoss",-881,731,0,"pineward"],["f","Subalpine",-768,603,0,"pineward"],["f","Akero",-653,712,0,"pineward"],["f","Apple Tabac",-703,829,0,"pineward"],["f","Caravansary",-721,596,0,"pineward"],["f","Clemenpine",-689,628,0,"pineward"],["f","Coffee Tabac",-643,704,0,"pineward"],["f","Delfiño",-746,609,0,"pineward"],["f","Greymist",-899,710,0,"pineward"],["f","Gristmill",-886,643,0,"pineward"],["f","Holy Cross",-687,736,0,"pineward"],["f","Icefall",-877,635,0,"pineward"],["f","Ivymoss",-810,599,0,"pineward"],["f","Lime Cola",-875,650,0,"pineward"],["f","Meadowmoss",-662,746,0,"pineward"],["f","Mint Cocoa",-671,755,0,"pineward"],["f","Noki",-867,624,0,"pineward"],["f","Ponderosa",-836,610,0,"pineward"],["f","Pumpkivus",-823,796,0,"pineward"],["f","Tome",-673,646,0,"pineward"],["f","Treacle",-716,826,0,"pineward"],["f","Velvetine",-706,613,0,"pineward"],["f","Amber Zero",-535,-501,0,"adar"],["f","Aetherialism",-391,-305,0,"adar"],["f","Incantu",-515,-302,0,"adar"],["f","Against All Odds",-471,-532,0,"adar"],["f","α11 Alpha11",-376,-340,0,"adar"],["f","Alta Luna",-333,-394,0,"adar"],["f","ADHD",-573,-501,0,"adar"],["f","Root Code",-462,-290,0,"adar"],["f","Lignum Dei",-512,-525,0,"adar"],["f","Lithos Diaphanes Λίθος Διαφανές",-526,-563,0,"adar"],["f","Tyrian",-474,-303,0,"adar"],["f","Burning Bridges",363,1023,0,"almost-human"],["f","Dear Future",301,1160,0,"almost-human"],["f","Desert Hope",545,1020,0,"almost-human"],["f","Ritual Code",306,1204,0,"almost-human"],["f","Silent Rain",608,1099,0,"almost-human"],["f","Amaretto Jazz in the Melting Room",-33,938,0,"ataraxia"],["f","Deity",1,586,0,"ataraxia"],["f","My Doll’s Makeup",18,455,0,"ataraxia"],["f","Spinal Fluid",-66,363,0,"ataraxia"],["f","Vestibule",-19,899,0,"ataraxia"],["f","5 Years Anniversary",-161,-16,0,"grande-parfums"],["f","Ambresso",-186,-24,0,"grande-parfums"],["f","Ancient Oud",14,-227,0,"grande-parfums"],["f","Choco Powder",7,-196,0,"grande-parfums"],["f","Cookie something (?)",-36,-258,0,"grande-parfums"],["f","Cuore",-240,-139,0,"grande-parfums"],["f","Dreaming Maldives",-5,-220,0,"grande-parfums"],["f","Giardino di Sorrento",-211,-92,0,"grande-parfums"],["f","Hot Stuff",-95,-267,0,"grande-parfums"],["f","Intimate Spell",-161,-53,0,"grande-parfums"],["f","Karak & Shisha",-208,-58,0,"grande-parfums"],["f","Mystical Incense",-5,-241,0,"grande-parfums"],["f","Vanilla Ash",-231,-131,0,"grande-parfums"],["f","Vintage Memoir",-75,-249,0,"grande-parfums"],["f","White Label",13,-240,0,"grande-parfums"],["f","Belle Âme",-441,178,0,"les-abstraits"],["f","Des Cendres",-577,-69,0,"les-abstraits"],["f","La Douleur Exquise",-535,-87,0,"les-abstraits"],["f","Philosopher’s Walk",-340,243,0,"les-abstraits"],["f","Kong",436,787,0,"lost-tribe"],["f","Watch King",221,752,0,"lost-tribe"],["f","Dirty Soda",303,527,0,"lost-tribe"],["f","Equatorial",138,567,0,"lost-tribe"],["f","Santal Absolu",354,764,0,"lost-tribe"],["f","Pan’s Labyrinth",232,532,0,"lost-tribe"],["f","Nymphaea Caerulea",724,-327,0,"om-parfums"],["f","Lust",451,-319,0,"om-parfums"],["f","Burnana",514,-105,0,"om-parfums"],["f","Cannabis Café",715,-337,0,"om-parfums"],["f","Dark Night of the Soul",444,-341,0,"om-parfums"],["f","This Too Shall Pass",564,-103,0,"om-parfums"],["f","When the Linden Blooms",708,-177,0,"om-parfums"],["f","Oud de Pasión",594,-103,0,"om-parfums"],["f","Smoke Oud",728,-315,0,"om-parfums"],["f","Dragon’s Breath",376,-354,0,"outsider-parfums"],["f","Draco",413,-66,0,"outsider-parfums"],["f","Xocolate Crotch",296,-320,0,"outsider-parfums"],["f","Guilty as Charged",232,-247,0,"outsider-parfums"],["f","Amaretto Coffee",421,-86,0,"outsider-parfums"],["f","Guitarist",161,192,0,"qimu-musicians"],["f","Vocal",147,151,0,"qimu-musicians"],["f","Bassist",171,182,0,"qimu-musicians"],["f","Drummer",275,524,0,"qimu-musicians"],["f","Bad Lily",-1046,-222,0,"tale-parfums"],["f","Fleurt",-576,-178,0,"tale-parfums"],["f","Rouse",-564,-182,0,"tale-parfums"],["f","Water Me",-1040,-246,0,"tale-parfums"],["f","3 Feet 5",122,-267,0,"tombstone"],["f","Evergrow",59,-225,0,"tombstone"],["f","No Need to Come By",63,-71,0,"tombstone"],["f","Sing at My Funeral",80,-227,0,"tombstone"],["f","Sweet Coffin",216,-28,0,"tombstone"],["f","Kogen",-92,-364,0,"apoteker-tepe"],["f","The Holy Mountain",-162,-627,0,"apoteker-tepe"],["f","Karasu",130,-660,0,"apoteker-tepe"],["f","The Peradam",98,-682,0,"apoteker-tepe"],["f","Pale Fire",78,-553,0,"apoteker-tepe"],["f","Anabasis",-187,-561,0,"apoteker-tepe"],["f","After the Flood",-32,-465,0,"apoteker-tepe"],["f","Brother Night",-121,-665,0,"apoteker-tepe"],["f","CV99",-57,136,0,"lussur"],["f","De Profundis",805,483,0,"serge-lutens"],["f","Haxan",-333,-775,0,"parfum-prissana"],["f","Tobacolor",108,-373,0,"dior"],["f","Flamenco EDP",-164,384,0,"ramon-monegal"],["f","French Riviera",-673,-285,0,"mancera"],["f","Velvet Fog",145,124,0,"casa-goa"],["f","House of Ellixirz",-129,3,0,"matca"],["f","Fir of the Light",502,-1330,0,"jmp-artisan-perfumes"],["f","Fir of the Dark",567,-1328,0,"jmp-artisan-perfumes"],["f","Quintessentially Amber",-446,272,0,"sultan-pasha-perfumes"],["f","Forbidden Flower",424,61,0,"areej-le-dore"],["f","Ore",-256,404,0,"slumberhouse"],["f","Salted Green Mango",43,-1192,0,"strangers-parfumerie"],["f","Oliver",-58,-1230,0,"strangers-parfumerie"],["f","Cigar Rum",32,-1188,0,"strangers-parfumerie"],["f","SM Café",-74,-1258,0,"strangers-parfumerie"],["f","Burning Ben",45,-1168,0,"strangers-parfumerie"],["f","Sweet Farewell",7,-1192,0,"strangers-parfumerie"],["f","Gheorghe",55,-1192,0,"strangers-parfumerie"],["f","Sweet Celestials",21,-1191,0,"strangers-parfumerie"],["f","Muscat Jasmine Tea",-82,-1281,0,"strangers-parfumerie"],["f","Scotch Peat",-24,-1203,0,"strangers-parfumerie"],["f","Sangre Dulce",36,-1176,0,"strangers-parfumerie"],["f","Aroon Sawat",-86,-1315,0,"strangers-parfumerie"],["f","Red Lime Soda",21,-1161,0,"strangers-parfumerie"],["f","Sombre",33,-1164,0,"strangers-parfumerie"],["f","Cherry Amaretto",-70,-1247,0,"strangers-parfumerie"],["f","Kira Kira",-2,-1161,0,"strangers-parfumerie"],["f","Les Mauvais Garçons",-80,-1304,0,"strangers-parfumerie"],["f","Comme un Carrousel",-41,-1214,0,"strangers-parfumerie"],["f","Caffeine Honey",24,-1176,0,"strangers-parfumerie"],["f","Spring Ambience",-92,-1327,0,"strangers-parfumerie"],["f","A Sorta Fairytale in Hyde Park",13,-1170,0,"strangers-parfumerie"],["f","Roasted Coffee Cigarette Whisky Come and Get Your Suede Honey Baby",-86,-1258,0,"strangers-parfumerie"],["f","Wicked John",-84,-1293,0,"strangers-parfumerie"],["f","Yuzu Soda",12,-1182,0,"strangers-parfumerie"],["f","Yue Tu 月兔",-7,-1196,0,"strangers-parfumerie"],["f","Limonsitano",10,-1158,0,"strangers-parfumerie"],["f","Tokiwa",2,-1174,0,"strangers-parfumerie"],["f","Ember",-93,-1271,0,"strangers-parfumerie"],["f","Autumn Tea and Yuzu Vanilla",-14,-1160,0,"strangers-parfumerie"],["f","Fume Ma Peau",-5,-1184,0,"strangers-parfumerie"],["f","Magenta Pop",-18,-1180,0,"strangers-parfumerie"],["f","Euphories",-18,-1192,0,"strangers-parfumerie"],["f","Summer Peaches by the Tea Room",-93,-1305,0,"strangers-parfumerie"],["f","Concrete Forest",66,-1188,0,"strangers-parfumerie"],["f","Iridescent Sky",-69,-1234,0,"strangers-parfumerie"],["f","Lumberjack Cologne",47,-1180,0,"strangers-parfumerie"],["f","Rêve du Matin",-10,-1171,0,"strangers-parfumerie"],["f","Eternal Summer",-74,-1335,0,"strangers-parfumerie"],["f","Pink Clouds",-45,-1179,0,"strangers-parfumerie"],["f","Sweet Tani",-30,-1193,0,"strangers-parfumerie"],["f","Fleur de Lune",-86,-1338,0,"strangers-parfumerie"],["f","Sweet Muskmelon",-24,-1168,0,"strangers-parfumerie"],["f","Virginia",-80,-1240,0,"strangers-parfumerie"],["f","Chokedee",-53,-1216,0,"strangers-parfumerie"],["f","Cigar Rum Intense",-38,-1202,0,"strangers-parfumerie"],["f","San Clemente",-81,-1269,0,"strangers-parfumerie"],["f","À la folie",-67,-1353,0,"strangers-parfumerie"],["f","Cachouli",-52,-1204,0,"strangers-parfumerie"],["f","Cigar Rum (2024)",71,-1199,0,"strangers-parfumerie"],["f","Guido",-36,-1170,0,"strangers-parfumerie"],["f","Rosa Raimunda",-64,-1220,0,"strangers-parfumerie"],["f","So Fetch!",59,-1178,0,"strangers-parfumerie"],["f","Plunge",-30,-1181,0,"strangers-parfumerie"],["f","Soleil de Thé",-102,-1279,0,"strangers-parfumerie"],["f","Green Lunar",-55,-1190,0,"strangers-parfumerie"],["f","Lights upon Orange Tree",-76,-1219,0,"strangers-parfumerie"],["f","Lava Rose",-78,-1324,0,"strangers-parfumerie"],["f","Câlin d'Été",-43,-1191,0,"strangers-parfumerie"],["f","Cornwall Rose",-95,-1288,0,"strangers-parfumerie"],["f","Punk #2077",-98,-1259,0,"strangers-parfumerie"],["f","Rosso Amaretto",-90,-1246,0,"strangers-parfumerie"],["f","Garden of Eden",-103,-1297,0,"strangers-parfumerie"],["f","Maia",-63,-1199,0,"strangers-parfumerie"],["f","La Malila",-84,-1229,0,"strangers-parfumerie"],["f","Lom Hom Khao Hom",-78,-1347,0,"strangers-parfumerie"],["f","Nobles '17",-70,-1209,0,"strangers-parfumerie"],["f","La Porte",-99,-1316,0,"strangers-parfumerie"],["f","Ma Nishtana",-330,-1094,0,"parfum-prissana"],["f","Nimitr",-346,-1102,0,"parfum-prissana"],["f","Nesnás Qareen",-381,-1108,0,"parfum-prissana"],["f","Natsumeku",-267,-1017,0,"parfum-prissana"],["f","Sahar",-398,-1107,0,"parfum-prissana"],["f","Mohragot",-312,-1087,0,"parfum-prissana"],["f","Dunhuang",-432,-1098,0,"parfum-prissana"],["f","Chetyre",-423,-1106,0,"parfum-prissana"],["f","Tom Yum",-290,-1062,0,"parfum-prissana"],["f","Mandarava",-411,-1107,0,"parfum-prissana"],["f","Thichila",-443,-1101,0,"parfum-prissana"],["f","Akhetaten",-331,-1107,0,"parfum-prissana"],["f","Lágrima Sagrada",-356,-1111,0,"parfum-prissana"],["f","Ayutthaya",-302,-1077,0,"parfum-prissana"],["f","Maruyama 丸山",-368,-1108,0,"parfum-prissana"],["f","Nefer",-435,-1111,0,"parfum-prissana"],["f","Le Cirque Bleu",-275,-1039,0,"parfum-prissana"],["f","Savitri สาวิตรี",-319,-1099,0,"parfum-prissana"],["f","Karuna",-281,-1050,0,"parfum-prissana"],["f","Tirtha",-390,-1116,0,"parfum-prissana"],["f","Hayra",-404,-1117,0,"parfum-prissana"],["f","Hirun",-341,-1114,0,"parfum-prissana"],["f","Ronda",-374,-1118,0,"parfum-prissana"],["f","Emerald Curry",-402,-1129,0,"parfum-prissana"],["f","Vallée des Roses",-425,-1118,0,"parfum-prissana"],["f","L'Ombre d'Hier",-389,-1128,0,"parfum-prissana"],["f","Gularb Matana",-269,-1029,0,"parfum-prissana"],["f","Keerati",-351,-1122,0,"parfum-prissana"],["f","Apsarah",-415,-1124,0,"parfum-prissana"],["f","Narasimha Attar",-363,-1125,0,"parfum-prissana"],["f","Narasimha Extrait de Parfum",-377,-1129,0,"parfum-prissana"],["f","Mriga มฤค",-249,-1357,0,"prin"],["f","Saringkarn ศฤงคาร",-277,-1317,0,"prin"],["f","Mandodari มณโฑ",-295,-1302,0,"prin"],["f","Varuek วฤค",-257,-1344,0,"prin"],["f","Nocturnal Poetry",-233,-1377,0,"prin"],["f","Mongolian Mriga",-239,-1351,0,"prin"],["f","Homa",-260,-1330,0,"prin"],["f","Indigo Night",-236,-1339,0,"prin"],["f","Aran",-241,-1367,0,"prin"],["f","Anatolia Anatolia",-265,-1319,0,"prin"],["f","Arsalan",-320,-1291,0,"prin"],["f","Ganja Kasturi",-231,-1360,0,"prin"],["f","Eshu",-306,-1296,0,"prin"],["f","Oqachol",-253,-1318,0,"prin"],["f","Onthamara",-386,-1290,0,"prin"],["f","Rahassanai",-284,-1307,0,"prin"],["f","Burmite Honey",-247,-1337,0,"prin"],["f","Anatolia",-309,-1284,0,"prin"],["f","Mandodari Mandodari",-290,-1291,0,"prin"],["f","Nilmalee",-351,-1286,0,"prin"],["f","Krissana",-272,-1304,0,"prin"],["f","Rattikarn รัตติกาล",-244,-1325,0,"prin"],["f","Fantôme de la Nuit",-370,-1288,0,"prin"],["f","Kheerin คีรินทร์",-337,-1289,0,"prin"],["f","Nisatiruk นิศาทิรุกข์",-340,-1277,0,"prin"],["f","Naruemit",-326,-1281,0,"prin"],["f","Hürrem Sultan",-297,-1282,0,"prin"],["f","0125",-399,-1294,0,"prin"],["f","Saringkarn Saringkarn",-316,-1274,0,"prin"],["f","Loup",-260,-1307,0,"prin"],["f","Ahuizotl",-361,-1280,0,"prin"],["f","Pathavi",-361,-1268,0,"prin"],["f","Nilubol",-410,-1289,0,"prin"],["f","Sgàil",-349,-1270,0,"prin"],["f","Persephone",-278,-1294,0,"prin"],["f","0225 ๐๒๒๕",-398,-1282,0,"prin"],["f","Prajñā",-390,-1273,0,"prin"],["f","Moha",-380,-1280,0,"prin"],["f","Dveṣa",-373,-1270,0,"prin"],["f","Rāga",-331,-1270,0,"prin"],["n","Cedarwood",-358,182,38,"WOO"],["n","Sandalwood",-279,59,35,"WOO"],["n","Vanilla",-27,338,34,"GOU"],["n","Patchouli",-12,229,34,"WOO"],["n","Musk",-185,-289,32,"ANI"],["n","Vetiver",-328,63,27,"WOO"],["n","Oakmoss",-315,64,26,"EAR"],["n","Tobacco",-213,300,25,"GOU"],["n","Amber",-323,186,22,"RES"],["n","Fir",-611,486,21,"CON"],["n","Oud",193,186,20,"WOO"],["n","Rose",-316,-11,20,"FLO"],["n","Benzoin",388,321,20,"RES"],["n","Tonka",-323,212,18,"GOU"],["n","Jasmine",17,-367,18,"FLO"],["n","Clove",-338,280,16,"SPI"],["n","Labdanum",-351,-185,16,"RES"],["n","Bergamot",-11,378,15,"CIT"],["n","Frankincense",-281,257,15,"RES"],["n","Ambergris",-519,230,15,"ANI"],["n","Orris",216,89,15,"FLO"],["n","Pine",-878,230,14,"CON"],["n","Smoke",-297,-33,13,"SMK"],["n","Leather",-122,376,13,"ANI"],["n","Myrrh",-688,100,13,"RES"],["n","Lavender",-43,535,13,"ARO"],["n","Honey",-464,733,13,"GOU"],["n","Saffron",-301,-328,13,"SPI"],["n","Pine Needles",-882,360,12,"CON"],["n","Mint",-419,267,11,"ARO"],["n","Incense",-162,-297,10,"RES"],["n","Ginger",-496,266,10,"SPI"],["n","Beeswax",-653,27,10,"GOU"],["n","Cacao",564,332,10,"GOU"],["n","Cinnamon",-768,76,10,"SPI"],["n","Guaiac Wood",40,-385,10,"WOO"],["n","Juniper",-545,1001,9,"CON"],["n","Chocolate",-351,343,9,"GOU"],["n","Neroli",202,134,9,"FLO"],["n","Lily of the Valley",27,262,9,"FLO"],["n","Castoreum",-113,-457,9,"ANI"],["n","Resins",-283,948,8,"RES"],["n","Soil",-273,970,8,"EAR"],["n","Lemon",35,-428,8,"CIT"],["n","Hay",-670,1076,8,"GRN"],["n","Spices",-493,421,8,"SPI"],["n","Orange Blossom",540,307,8,"FLO"],["n","Citrus",-853,189,7,"CIT"],["n","Orange",-216,-401,7,"CIT"],["n","Nutmeg",-434,810,7,"SPI"],["n","Cherry",-514,430,7,"FRU"],["n","Cypress",-688,18,7,"CON"],["n","Ylang Ylang",120,490,7,"FLO"],["n","Civet",570,-663,7,"ANI"],["n","Woody Notes",882,141,7,"WOO"],["n","Oak",-350,218,6,"WOO"],["n","Opoponax",-346,-394,6,"RES"],["n","Geranium",162,532,6,"FLO"],["n","Raspberry",-845,349,6,"FRU"],["n","Dried Fruits",61,596,6,"FRU"],["n","Black Pepper",-939,-53,6,"SPI"],["n","Lime",-328,-130,6,"CIT"],["n","Clary Sage",573,205,6,"ARO"],["n","Pink Pepper",-328,328,6,"SPI"],["n","Moss",-841,45,5,"EAR"],["n","Cardamom",-529,459,5,"SPI"],["n","Plum",-124,-399,5,"FRU"],["n","Tolu Balsam",544,401,5,"RES"],["n","Rum",-912,233,5,"BRW"],["n","Seaweed",-822,-5,5,"AIR"],["n","Osmanthus",718,250,5,"FLO"],["n","Cypriol",-887,62,5,"WOO"],["n","Violet Leaf",294,-808,5,"GRN"],["n","Tuberose",-501,375,5,"FLO"],["n","Birch Tar",-259,-581,5,"SMK"],["n","Peru Balsam",505,656,5,"RES"],["n","Cashmeran",-180,-643,5,"WOO"],["n","Ambrette",-787,53,4,"ANI"],["n","Mushroom",-141,831,4,"EAR"],["n","Rosemary",-1044,20,4,"ARO"],["n","Brown Sugar",-278,1064,4,"GOU"],["n","Almond",-594,973,4,"GOU"],["n","Apricot",658,-578,4,"FRU"],["n","Blood Orange",-457,1070,4,"CIT"],["n","Milk",-900,332,4,"GOU"],["n","Heliotrope",177,-755,4,"FLO"],["n","Apple",87,915,4,"FRU"],["n","Tea",-966,290,4,"BRW"],["n","Coffee",513,574,4,"BRW"],["n","Galbanum",-1021,-180,4,"GRN"],["n","Peach",798,-568,4,"FRU"],["n","Caramel",642,584,4,"GOU"],["n","Gardenia",87,-783,4,"FLO"],["n","Violet",829,345,4,"FLO"],["n","Costus",-751,2,4,"ANI"],["n","Whiskey",-84,-748,4,"BRW"],["n","Styrax",862,-102,4,"RES"],["n","Poplar Bud",-1288,660,3,"GRN"],["n","Juniper Berry",-512,-134,3,"ARO"],["n","Carnation",-53,977,3,"FLO"],["n","Chamomile",-1137,-53,3,"ARO"],["n","Sweetgrass",-146,1183,3,"GRN"],["n","Oat",-1036,987,3,"GOU"],["n","Wheat",-1061,253,3,"GOU"],["n","Hazelnut",-546,1223,3,"GOU"],["n","Maté",-821,120,3,"BRW"],["n","Yuzu",553,-587,3,"CIT"],["n","Waterlily",-734,985,3,"FLO"],["n","Spruce",-648,-569,3,"CON"],["n","Suede",792,285,3,"ANI"],["n","Clementine",-1122,431,3,"CIT"],["n","Tomato Leaf",427,-624,3,"GRN"],["n","Grapefruit",130,915,3,"CIT"],["n","Coriander",-877,182,3,"SPI"],["n","Strawberry",778,-245,3,"FRU"],["n","Cognac",-318,1020,3,"BRW"],["n","CO2 Extracts",760,-701,3,"IMP"],["n","Pear",959,-133,3,"FRU"],["n","Thyme",-885,11,3,"ARO"],["n","Hinoki",856,-701,3,"CON"],["n","Birch",-701,-164,3,"WOO"],["n","Black Hemlock",-1364,170,2,"CON"],["n","Sandarac",340,994,2,"RES"],["n","Sage",-1217,55,2,"ARO"],["n","Lichen",-416,-558,2,"EAR"],["n","Lapsang Souchong",-443,1306,2,"BRW"],["n","Myrtle",-1193,325,2,"ARO"],["n","Baked Apple",908,-88,2,"GOU"],["n","Spikenard",-874,1155,2,"EAR"],["n","Anise",-689,-689,2,"SPI"],["n","Grass",526,927,2,"GRN"],["n","Blackberry",-1156,343,2,"FRU"],["n","Peat",507,-721,2,"EAR"],["n","Cranberry",-539,1275,2,"FRU"],["n","Molasses",-1311,366,2,"GOU"],["n","Black Walnut",437,916,2,"GOU"],["n","Butter",-1043,529,2,"GOU"],["n","Champaca",616,-698,2,"FLO"],["n","Ivy",-399,1235,2,"GRN"],["n","Eucalyptus",-1293,528,2,"ARO"],["n","Green Apple",1025,-105,2,"FRU"],["n","Passionfruit",-107,1140,2,"FRU"],["n","Mahogany",-1239,130,2,"WOO"],["n","Green Tea",1018,194,2,"BRW"],["n","Treemoss",-903,968,2,"EAR"],["n","Cedarmoss",228,-728,2,"EAR"],["n","Bitter Orange",-511,1064,2,"CIT"],["n","Mango",-1150,68,2,"FRU"],["n","Litchi",950,37,2,"FRU"],["n","Butterscotch",-427,1054,2,"GOU"],["n","Aged Parchment",-980,-683,2,"IMP"],["n","Paper",760,397,2,"IMP"],["n","Ozone",-1067,394,2,"AIR"],["n","Mineral Accord",343,-956,2,"EAR"],["n","Marine Accord",-884,839,2,"AIR"],["n","Sea Salt",-1106,-767,2,"AIR"],["n","Candle Wax",898,294,2,"IMP"],["n","Banana",-989,137,2,"FRU"],["n","Aquatic Notes",707,-820,2,"AIR"],["n","Coumarin",722,823,2,"GOU"],["n","Skin",-1080,300,2,"ANI"],["n","Solar Notes",1259,606,2,"AIR"],["n","Animal Notes",43,1207,2,"ANI"],["n","Green Notes",384,-335,2,"GRN"],["n","Airy Note",1191,440,2,"AIR"],["n","Amaretto",-682,983,2,"BRW"],["n","Liquor",935,-207,2,"BRW"],["n","Cocoa Butter",2,1350,2,"GOU"],["n","Elemi",-1075,-365,2,"RES"],["n","Dates",1033,241,2,"FRU"],["n","Marigold",-899,842,2,"FLO"],["n","Cumin",-383,-679,2,"SPI"],["n","Sugar Cane",972,110,2,"GRN"],["n","Allspice",-975,545,2,"SPI"],["n","Amberwood",1079,-527,2,"WOO"],["n","Tiare Flower",-265,961,2,"FLO"],["n","Raspberry Leaf",-1073,-458,2,"GRN"],["n","Amyris",1115,-110,2,"WOO"],["n","Cassia",-967,698,2,"SPI"],["n","Petitgrain",892,-435,2,"CIT"],["n","Bakhoor",703,1162,2,"RES"],["n","Cade Oil",-764,-16,2,"SMK"],["n","Linden Blossom",1227,-370,2,"FLO"],["n","Cannabis",398,917,2,"GRN"],["n","Shiso",-639,-924,2,"ARO"],["n","Turmeric",1197,20,2,"SPI"],["n","Mimosa",-1165,-59,2,"FLO"],["n","Crushed Leaves",757,-584,1,"GRN"],["n","Larch Cones",-459,1385,1,"CON"],["n","Oolong Tea",-1412,-195,1,"BRW"],["n","Damp Vegetation",1015,396,1,"EAR"],["n","Decayed Rose",-1158,919,1,"IMP"],["n","Pineboard",462,-807,1,"WOO"],["n","Swamp Water",-116,1416,1,"EAR"],["n","Tamarack",-1441,350,1,"CON"],["n","Balsam",1012,-170,1,"RES"],["n","Snoqualmie Forest Evergreens",-755,1293,1,"CON"],["n","Sheep Wool",-1312,-448,1,"ANI"],["n","Lanolin",998,808,1,"ANI"],["n","Sweet Vernalgrass",-1284,731,1,"GRN"],["n","Bread",702,-669,1,"GOU"],["n","Propolis",-217,1396,1,"RES"],["n","Herbal Tea",-1405,190,1,"BRW"],["n","Westfarthing Leaf",1082,310,1,"IMP"],["n","Seed Cake",-994,1120,1,"GOU"],["n","Maple",-1181,-629,1,"GOU"],["n","Barley",690,1078,1,"GOU"],["n","Hops",-1420,458,1,"ARO"],["n","Icing",905,-365,1,"GOU"],["n","Davana",-575,1323,1,"ARO"],["n","Goldenrod",-1360,-349,1,"FLO"],["n","Sea Water",1062,416,1,"AIR"],["n","Water Pepper",-1245,835,1,"SPI"],["n","Cedar Leaf",532,-826,1,"CON"],["n","Rum Resin",-148,1427,1,"RES"],["n","White Lotus",-1411,237,1,"FLO"],["n","Citron",1039,-24,1,"CIT"],["n","Botanical Musk",-865,1232,1,"ANI"],["n","Sawdust",-1250,-563,1,"WOO"],["n","Smouldering Logs",772,990,1,"SMK"],["n","Edelwood Oil",-1390,549,1,"WOO"],["n","Wet Stone",805,-600,1,"EAR"],["n","Bluebell",-313,1402,1,"FLO"],["n","Watercress",-1403,-22,1,"GRN"],["n","Yarrow",1083,359,1,"ARO"],["n","Nootka",-1183,962,1,"CON"],["n","Lemon Verbena",366,-853,1,"ARO"],["n","Cola",-57,1401,1,"BRW"],["n","Sugar",-1420,394,1,"GOU"],["n","Alpine Sandwort",991,-287,1,"FLO"],["n","Green Wheat",-614,1331,1,"GRN"],["n","Azure Bluet",-1034,-722,1,"FLO"],["n","Mountain Wildflowers",1122,539,1,"FLO"],["n","Malt",-1257,793,1,"GOU"],["n","Cassis",486,-819,1,"FRU"],["n","Rhubarb",-288,1378,1,"GRN"],["n","Ponderosa Resin",-1452,91,1,"RES"],["n","Raisin Cookies",1046,46,1,"GOU"],["n","Pumpkin",-956,1189,1,"GOU"],["n","Corn Silk",-1224,-508,1,"GRN"],["n","Corn Silage",656,1158,1,"GRN"],["n","Rice",-1348,492,1,"GOU"],["n","Dragon's Blood",870,-537,1,"RES"],["n","Mousse de Saxe",-485,1352,1,"IMP"],["n","Fig Leaf",-1105,-896,1,"GRN"],["n","Honeysuckle",1065,-348,1,"FLO"],["n","Carob Pods",-1335,232,1,"GOU"],["n","Amber Oud",465,-1031,1,"WOO"],["n","Petrified Driftwood",-115,1197,1,"WOO"],["n","Quince",-1419,-249,1,"FRU"],["n","Absinthe",910,-721,1,"BRW"],["n","Green Tea Flowers",-1110,748,1,"FLO"],["n","Murumuru Butter",-1022,-977,1,"GOU"],["n","Maninka",1096,-9,1,"FRU"],["n","Petrichor",-1334,125,1,"EAR"],["n","Clear Orchid",625,-964,1,"FLO"],["n","Palo Santo",-323,1162,1,"SMK"],["n","Cold Night Air",-1204,-770,1,"AIR"],["n","Sawn Resin",990,-625,1,"RES"],["n","Sand",-319,1389,1,"EAR"],["n","Dust",161,-787,1,"EAR"],["n","Ash",826,1271,1,"SMK"],["n","Herbal Notes",-883,1115,1,"ARO"],["n","Rain Notes",1304,38,1,"AIR"],["n","Concrete",67,1492,1,"EAR"],["n","Holy Bread",-1167,-239,1,"GOU"],["n","Dusty Sofa",1183,737,1,"IMP"],["n","Passionflower",-824,1162,1,"FLO"],["n","Honeycomb",1020,-380,1,"GOU"],["n","Japanese Plum",89,1392,1,"FRU"],["n","Chantilly Cream",-1225,392,1,"GOU"],["n","Goldenberry",1197,230,1,"FRU"],["n","Condensed Milk",-586,1250,1,"GOU"],["n","Snowdrops",-1012,-626,1,"FLO"],["n","Gold",882,1054,1,"IMP"],["n","Nectar",-1131,758,1,"FLO"],["n","Dusty Antiques",1094,-355,1,"IMP"],["n","Red Berries",90,1213,1,"FRU"],["n","Blueberry",-1039,-782,1,"FRU"],["n","Plum Blossom",1170,-211,1,"FLO"],["n","Toffee",-1149,558,1,"GOU"],["n","Fig",714,-930,1,"FRU"],["n","Teak Wood",779,919,1,"WOO"],["n","Yellow Flowers",-1219,-18,1,"FLO"],["n","Freesia",1136,-537,1,"FLO"],["n","Magnolia",-181,1241,1,"FLO"],["n","Scorched Pineapple",-816,-1003,1,"FRU"],["n","Bark",1200,180,1,"WOO"],["n","Masala Chai",-1206,414,1,"BRW"],["n","Tobacco Flower",825,-816,1,"FLO"],["n","Sparkling Water",320,1293,1,"BRW"],["n","Fenugreek",-1245,-461,1,"SPI"],["n","Jasmine Tea",1155,-376,1,"BRW"],["n","Green Mandarin",-583,1071,1,"CIT"],["n","Guava",-726,-1040,1,"FRU"],["n","Moroccan Tea",1243,329,1,"BRW"],["n","Pine Tar",-1381,106,1,"SMK"],["n","Hyrax",832,-752,1,"ANI"],["n","Artemisia",-295,1283,1,"ARO"],["n","Mint-Sandalwood Co-Distillation",-1137,-342,1,"ARO"],["n","Powder Accord",1315,285,1,"IMP"],["n","Cabreuva",-1049,397,1,"WOO"],["n","Oak Barrel",927,-925,1,"WOO"],["n","Copaiba Balsam",1065,845,1,"RES"],["n","Underground Tunnel",-1091,-69,1,"IMP"],["n","Fruity Notes",1293,-380,1,"FRU"],["n","Huang Qi",-122,1207,1,"ARO"],["n","Paprika",-645,-1094,1,"SPI"],["n","Sichuan Pepper",1334,39,1,"SPI"],["n","Cheese",-1086,60,1,"GOU"],["n","Jonquil",1063,-790,1,"FLO"],["n","Coconut Milk",661,1235,1,"GOU"],["n","Lilac",-677,-874,1,"FLO"],["n","Buddhawood",1361,-311,1,"WOO"],["n","Iso E Super",-639,965,1,"WOO"],["n","Chocolate Cake",994,-847,1,"GOU"],["n","Cocktail Accord",1032,888,1,"BRW"],["n","Lava",-1165,-126,1,"EAR"],["n","Metallic Notes",1145,-660,1,"EAR"],["n","Pea",144,1262,1,"GRN"],["n","Evernyl",-1025,-643,1,"EAR"],["n","Dulce de Leche",1305,-38,1,"GOU"],["n","Cream",-1114,323,1,"GOU"],["n","Angelica Root",957,-822,1,"ARO"],["n","Popcorn",692,1220,1,"GOU"],["n","Turpentine",-1249,-72,1,"RES"],["n","Willow Bark",1301,-94,1,"WOO"],["n","Moldy Cedarwood",-425,1182,1,"WOO"],["n","Dead Water",-743,-921,1,"AIR"],["n","Hiba",1235,161,1,"CON"],["n","Kuromoji",-1254,15,1,"ARO"],["n","Pine Smoke",946,-916,1,"SMK"],["n","Siam Wood",109,1139,1,"WOO"],["n","Lily",-868,-1015,1,"FLO"],["n","Copal",1221,-299,1,"RES"],["n","Balsamic Vinegar",-1152,633,1,"GOU"],["n","Chrysanthemum",1255,-440,1,"FLO"],["n","Wormwood",112,1025,1,"ARO"],["n","Caraway",-1257,-641,1,"SPI"],["n","Basil",843,-907,1,"ARO"],["n","Marjoram",-1288,18,1,"ARO"],["n","Goat Hair",-914,-1099,1,"ANI"],["n","Oregano",1108,-331,1,"ARO"],["n","Oriental Notes",-1171,92,1,"IMP"],["n","Tangerine",494,-1008,1,"CIT"],["n","Aldehydes",-503,1239,1,"AIR"],["n","Skunk Oil",-950,-668,1,"ANI"],["n","Night Blooming Jasmine",1334,-149,1,"FLO"],["n","Muhuhu",-821,1107,1,"WOO"],["n","Bushman Candle Resin",-1001,-710,1,"RES"],["n","Dittany of Crete",157,1372,1,"ARO"]],"links":[[51,0,"h"],[51,27,"p"],[51,428,"n"],[51,378,"n"],[51,359,"n"],[51,408,"n"],[51,518,"n"],[51,331,"n"],[52,0,"h"],[52,27,"p"],[52,359,"n"],[52,360,"n"],[52,331,"n"],[52,372,"n"],[52,395,"n"],[53,0,"h"],[53,27,"p"],[53,452,"n"],[53,519,"n"],[53,453,"n"],[53,340,"n"],[53,332,"n"],[53,341,"n"],[54,0,"h"],[54,27,"p"],[54,331,"n"],[54,353,"n"],[54,386,"n"],[54,359,"n"],[54,333,"n"],[55,0,"h"],[55,27,"p"],[55,354,"n"],[55,355,"n"],[55,334,"n"],[55,340,"n"],[55,520,"n"],[55,387,"n"],[55,353,"n"],[55,359,"n"],[55,454,"n"],[55,337,"n"],[56,0,"h"],[56,27,"p"],[56,340,"n"],[56,395,"n"],[56,455,"n"],[56,359,"n"],[56,373,"n"],[56,521,"n"],[57,0,"h"],[57,27,"p"],[57,409,"n"],[57,522,"n"],[57,354,"n"],[57,338,"n"],[57,353,"n"],[57,523,"n"],[57,361,"n"],[57,387,"n"],[57,331,"n"],[57,359,"n"],[57,341,"n"],[58,0,"h"],[58,27,"p"],[58,374,"n"],[58,367,"n"],[58,410,"n"],[58,356,"n"],[58,429,"n"],[58,332,"n"],[58,334,"n"],[59,0,"h"],[59,27,"p"],[59,340,"n"],[59,452,"n"],[59,456,"n"],[59,395,"n"],[59,361,"n"],[59,355,"n"],[60,0,"h"],[60,27,"p"],[60,352,"n"],[60,367,"n"],[60,348,"n"],[60,430,"n"],[60,388,"n"],[60,431,"n"],[60,375,"n"],[60,338,"n"],[60,340,"n"],[60,356,"n"],[60,339,"n"],[60,336,"n"],[60,332,"n"],[60,337,"n"],[60,334,"n"],[61,0,"h"],[61,27,"p"],[61,359,"n"],[61,367,"n"],[61,336,"n"],[61,457,"n"],[61,373,"n"],[61,524,"n"],[62,0,"h"],[62,27,"p"],[62,453,"n"],[62,525,"n"],[62,526,"n"],[62,527,"n"],[63,0,"h"],[63,27,"p"],[63,458,"n"],[63,352,"n"],[63,349,"n"],[63,340,"n"],[63,376,"n"],[63,372,"n"],[63,355,"n"],[63,331,"n"],[63,339,"n"],[63,459,"n"],[63,350,"n"],[63,428,"n"],[64,0,"h"],[64,27,"p"],[64,379,"n"],[64,340,"n"],[64,352,"n"],[64,362,"n"],[64,346,"n"],[64,335,"n"],[64,337,"n"],[64,460,"n"],[64,336,"n"],[65,0,"h"],[65,27,"p"],[65,528,"n"],[65,529,"n"],[65,389,"n"],[65,356,"n"],[65,357,"n"],[65,411,"n"],[65,339,"n"],[65,363,"n"],[65,432,"n"],[66,0,"h"],[66,27,"p"],[66,375,"n"],[66,357,"n"],[66,433,"n"],[66,434,"n"],[66,435,"n"],[66,412,"n"],[66,356,"n"],[66,461,"n"],[66,358,"n"],[67,0,"h"],[67,27,"p"],[67,375,"n"],[67,364,"n"],[67,333,"n"],[67,530,"n"],[67,432,"n"],[67,531,"n"],[67,380,"n"],[67,396,"n"],[67,459,"n"],[67,390,"n"],[67,344,"n"],[67,337,"n"],[68,0,"h"],[68,27,"p"],[68,413,"n"],[68,462,"n"],[68,357,"n"],[68,532,"n"],[68,363,"n"],[68,432,"n"],[68,375,"n"],[68,434,"n"],[68,433,"n"],[68,336,"n"],[68,436,"n"],[68,337,"n"],[69,0,"h"],[69,27,"p"],[69,375,"n"],[69,433,"n"],[69,435,"n"],[69,348,"n"],[69,356,"n"],[69,533,"n"],[69,534,"n"],[69,535,"n"],[69,345,"n"],[69,351,"n"],[69,357,"n"],[70,0,"h"],[70,27,"p"],[70,363,"n"],[70,338,"n"],[70,375,"n"],[70,536,"n"],[70,537,"n"],[70,538,"n"],[70,463,"n"],[70,359,"n"],[70,428,"n"],[71,0,"h"],[71,27,"p"],[71,464,"n"],[71,380,"n"],[71,340,"n"],[71,397,"n"],[71,346,"n"],[71,414,"n"],[72,0,"h"],[72,27,"p"],[72,362,"n"],[72,365,"n"],[72,346,"n"],[72,380,"n"],[72,434,"n"],[72,465,"n"],[72,411,"n"],[72,466,"n"],[72,415,"n"],[72,467,"n"],[72,333,"n"],[72,539,"n"],[73,0,"h"],[73,27,"p"],[73,464,"n"],[73,468,"n"],[73,381,"n"],[73,389,"n"],[73,340,"n"],[73,368,"n"],[73,540,"n"],[73,337,"n"],[73,398,"n"],[73,342,"n"],[73,332,"n"],[73,349,"n"],[74,0,"h"],[74,27,"p"],[74,346,"n"],[74,399,"n"],[74,365,"n"],[74,341,"n"],[74,435,"n"],[75,0,"h"],[75,27,"p"],[75,437,"n"],[75,348,"n"],[75,429,"n"],[75,469,"n"],[75,470,"n"],[75,438,"n"],[75,541,"n"],[75,416,"n"],[75,400,"n"],[75,331,"n"],[75,337,"n"],[76,0,"h"],[76,27,"p"],[76,429,"n"],[76,367,"n"],[76,542,"n"],[76,400,"n"],[76,382,"n"],[76,409,"n"],[76,543,"n"],[76,470,"n"],[76,350,"n"],[76,332,"n"],[77,0,"h"],[77,27,"p"],[77,362,"n"],[77,369,"n"],[77,348,"n"],[77,414,"n"],[77,331,"n"],[77,410,"n"],[77,354,"n"],[77,337,"n"],[78,0,"h"],[78,27,"p"],[78,340,"n"],[78,348,"n"],[78,391,"n"],[78,544,"n"],[78,332,"n"],[78,336,"n"],[78,408,"n"],[78,395,"n"],[79,0,"h"],[79,27,"p"],[79,471,"n"],[79,343,"n"],[79,334,"n"],[79,332,"n"],[79,331,"n"],[80,0,"h"],[80,27,"p"],[80,417,"n"],[80,338,"n"],[80,340,"n"],[80,545,"n"],[80,390,"n"],[81,0,"h"],[81,27,"p"],[81,340,"n"],[81,439,"n"],[81,418,"n"],[81,353,"n"],[81,431,"n"],[81,361,"n"],[81,335,"n"],[81,356,"n"],[81,333,"n"],[81,337,"n"],[82,0,"h"],[82,27,"p"],[82,440,"n"],[82,354,"n"],[82,441,"n"],[82,338,"n"],[82,350,"n"],[82,352,"n"],[82,358,"n"],[82,472,"n"],[82,414,"n"],[82,340,"n"],[82,332,"n"],[82,331,"n"],[82,345,"n"],[82,546,"n"],[83,0,"h"],[83,27,"p"],[83,419,"n"],[83,338,"n"],[83,331,"n"],[83,334,"n"],[83,372,"n"],[83,376,"n"],[83,349,"n"],[83,366,"n"],[83,333,"n"],[84,0,"h"],[84,27,"p"],[84,441,"n"],[84,367,"n"],[84,442,"n"],[84,336,"n"],[84,332,"n"],[84,350,"n"],[85,0,"h"],[85,27,"p"],[85,340,"n"],[85,352,"n"],[85,547,"n"],[85,338,"n"],[85,548,"n"],[85,336,"n"],[86,0,"h"],[86,27,"p"],[86,331,"n"],[86,549,"n"],[86,550,"n"],[86,551,"n"],[86,339,"n"],[86,466,"n"],[86,473,"n"],[86,347,"n"],[87,0,"h"],[87,27,"p"],[87,367,"n"],[87,552,"n"],[87,335,"n"],[87,408,"n"],[87,553,"n"],[87,455,"n"],[87,554,"n"],[87,555,"n"],[87,352,"n"],[88,0,"h"],[88,27,"p"],[88,382,"n"],[88,443,"n"],[88,367,"n"],[88,556,"n"],[88,400,"n"],[88,352,"n"],[88,331,"n"],[88,332,"n"],[89,0,"h"],[89,27,"p"],[89,469,"n"],[89,474,"n"],[89,360,"n"],[89,392,"n"],[89,557,"n"],[89,438,"n"],[89,382,"n"],[89,352,"n"],[89,331,"n"],[89,337,"n"],[89,475,"n"],[89,476,"n"],[90,0,"h"],[90,27,"p"],[90,392,"n"],[90,381,"n"],[90,362,"n"],[90,399,"n"],[90,558,"n"],[90,369,"n"],[90,477,"n"],[90,559,"n"],[90,333,"n"],[90,380,"n"],[90,444,"n"],[90,365,"n"],[91,0,"h"],[91,27,"p"],[91,337,"n"],[91,560,"n"],[91,461,"n"],[91,561,"n"],[91,377,"n"],[91,340,"n"],[91,442,"n"],[91,562,"n"],[91,563,"n"],[92,0,"h"],[92,27,"p"],[92,368,"n"],[92,360,"n"],[92,334,"n"],[92,333,"n"],[92,376,"n"],[92,372,"n"],[92,564,"n"],[92,331,"n"],[93,0,"h"],[93,27,"p"],[93,360,"n"],[93,478,"n"],[93,479,"n"],[93,350,"n"],[93,565,"n"],[93,566,"n"],[93,332,"n"],[94,0,"h"],[94,27,"p"],[94,567,"n"],[94,359,"n"],[94,331,"n"],[94,333,"n"],[94,445,"n"],[94,365,"n"],[94,480,"n"],[94,363,"n"],[94,568,"n"],[95,0,"h"],[95,27,"p"],[95,569,"n"],[95,411,"n"],[95,336,"n"],[95,401,"n"],[95,331,"n"],[95,332,"n"],[95,334,"n"],[95,375,"n"],[95,373,"n"],[95,570,"n"],[95,571,"n"],[95,341,"n"],[96,0,"h"],[96,27,"p"],[96,481,"n"],[96,482,"n"],[96,354,"n"],[96,338,"n"],[96,418,"n"],[96,332,"n"],[96,331,"n"],[96,351,"n"],[96,572,"n"],[96,408,"n"],[96,419,"n"],[96,337,"n"],[96,402,"n"],[97,0,"h"],[97,27,"p"],[97,338,"n"],[97,456,"n"],[97,465,"n"],[97,357,"n"],[97,390,"n"],[98,0,"h"],[98,27,"p"],[98,350,"n"],[98,382,"n"],[98,333,"n"],[98,346,"n"],[98,347,"n"],[98,340,"n"],[98,573,"n"],[98,332,"n"],[98,335,"n"],[98,574,"n"],[99,2,"h"],[99,28,"p"],[99,575,"n"],[99,362,"n"],[99,483,"n"],[99,358,"n"],[99,401,"n"],[99,484,"n"],[99,339,"n"],[99,336,"n"],[99,372,"n"],[99,350,"n"],[100,2,"h"],[100,28,"p"],[100,420,"n"],[100,392,"n"],[100,403,"n"],[100,485,"n"],[100,383,"n"],[100,369,"n"],[100,355,"n"],[100,393,"n"],[100,336,"n"],[100,331,"n"],[100,344,"n"],[100,354,"n"],[101,2,"h"],[101,28,"p"],[101,576,"n"],[101,577,"n"],[101,486,"n"],[101,357,"n"],[101,338,"n"],[101,487,"n"],[101,578,"n"],[101,412,"n"],[101,579,"n"],[102,2,"h"],[102,28,"p"],[102,341,"n"],[102,345,"n"],[102,477,"n"],[102,332,"n"],[102,350,"n"],[103,2,"h"],[103,28,"p"],[103,488,"n"],[103,360,"n"],[103,358,"n"],[103,404,"n"],[103,345,"n"],[103,383,"n"],[103,338,"n"],[103,361,"n"],[103,344,"n"],[103,384,"n"],[104,2,"h"],[104,28,"p"],[104,335,"n"],[104,489,"n"],[104,490,"n"],[104,333,"n"],[104,416,"n"],[104,378,"n"],[104,377,"n"],[105,2,"h"],[105,28,"p"],[105,394,"n"],[105,437,"n"],[105,580,"n"],[105,581,"n"],[105,358,"n"],[105,582,"n"],[105,381,"n"],[105,583,"n"],[105,355,"n"],[105,344,"n"],[105,584,"n"],[106,2,"h"],[106,28,"p"],[106,348,"n"],[106,391,"n"],[106,359,"n"],[106,585,"n"],[106,586,"n"],[106,484,"n"],[106,334,"n"],[106,342,"n"],[106,339,"n"],[106,587,"n"],[106,337,"n"],[107,2,"h"],[107,28,"p"],[107,588,"n"],[107,349,"n"],[107,331,"n"],[107,589,"n"],[107,395,"n"],[107,342,"n"],[107,341,"n"],[107,355,"n"],[107,481,"n"],[107,491,"n"],[108,2,"h"],[108,28,"p"],[109,2,"h"],[109,28,"p"],[109,368,"n"],[109,405,"n"],[109,393,"n"],[109,357,"n"],[109,350,"n"],[110,3,"h"],[110,29,"p"],[110,385,"n"],[110,353,"n"],[110,376,"n"],[110,378,"n"],[111,3,"h"],[111,29,"p"],[111,483,"n"],[111,491,"n"],[111,339,"n"],[112,3,"h"],[112,29,"p"],[112,590,"n"],[112,372,"n"],[112,492,"n"],[112,591,"n"],[112,385,"n"],[112,342,"n"],[113,3,"h"],[113,29,"p"],[113,372,"n"],[113,592,"n"],[113,353,"n"],[113,493,"n"],[113,593,"n"],[113,373,"n"],[114,3,"h"],[114,29,"p"],[114,373,"n"],[114,594,"n"],[114,595,"n"],[114,494,"n"],[114,495,"n"],[114,492,"n"],[115,4,"h"],[115,30,"p"],[115,496,"n"],[115,596,"n"],[115,497,"n"],[115,357,"n"],[115,487,"n"],[115,368,"n"],[115,446,"n"],[115,412,"n"],[115,597,"n"],[115,598,"n"],[115,498,"n"],[115,599,"n"],[115,333,"n"],[115,338,"n"],[116,4,"h"],[116,31,"p"],[116,357,"n"],[116,600,"n"],[116,381,"n"],[116,601,"n"],[116,602,"n"],[116,603,"n"],[116,338,"n"],[116,498,"n"],[116,363,"n"],[116,604,"n"],[116,349,"n"],[116,347,"n"],[116,364,"n"],[116,333,"n"],[116,344,"n"],[116,339,"n"],[116,343,"n"],[116,499,"n"],[116,355,"n"],[116,605,"n"],[116,334,"n"],[116,500,"n"],[116,606,"n"],[117,4,"h"],[117,50,"p"],[118,4,"h"],[118,50,"p"],[118,355,"n"],[118,501,"n"],[118,342,"n"],[118,402,"n"],[118,375,"n"],[118,405,"n"],[118,400,"n"],[118,502,"n"],[118,404,"n"],[119,4,"h"],[119,30,"p"],[119,368,"n"],[119,376,"n"],[119,607,"n"],[120,5,"h"],[120,50,"p"],[120,389,"n"],[120,394,"n"],[120,503,"n"],[120,365,"n"],[120,358,"n"],[120,346,"n"],[120,368,"n"],[120,383,"n"],[120,446,"n"],[120,440,"n"],[120,357,"n"],[120,341,"n"],[120,386,"n"],[120,354,"n"],[120,335,"n"],[120,406,"n"],[120,344,"n"],[120,331,"n"],[120,347,"n"],[120,333,"n"],[120,343,"n"],[120,338,"n"],[120,332,"n"],[120,336,"n"],[121,5,"h"],[121,50,"p"],[121,419,"n"],[121,504,"n"],[121,355,"n"],[121,399,"n"],[121,446,"n"],[121,338,"n"],[121,363,"n"],[121,390,"n"],[121,457,"n"],[121,342,"n"],[121,380,"n"],[121,370,"n"],[121,331,"n"],[121,347,"n"],[121,372,"n"],[121,343,"n"],[121,339,"n"],[121,371,"n"],[121,333,"n"],[121,398,"n"],[121,406,"n"],[121,334,"n"],[121,366,"n"],[121,344,"n"],[121,350,"n"],[121,387,"n"],[121,332,"n"],[121,335,"n"],[122,5,"h"],[122,50,"p"],[122,341,"n"],[122,343,"n"],[122,335,"n"],[122,447,"n"],[123,5,"h"],[123,50,"p"],[123,358,"n"],[123,381,"n"],[123,364,"n"],[123,368,"n"],[123,401,"n"],[123,345,"n"],[123,342,"n"],[123,332,"n"],[123,333,"n"],[123,505,"n"],[124,5,"h"],[124,50,"p"],[125,5,"h"],[125,50,"p"],[125,361,"n"],[125,376,"n"],[125,351,"n"],[125,608,"n"],[125,441,"n"],[125,358,"n"],[125,379,"n"],[125,462,"n"],[125,390,"n"],[125,609,"n"],[125,497,"n"],[125,397,"n"],[125,610,"n"],[125,503,"n"],[125,611,"n"],[125,370,"n"],[125,445,"n"],[125,355,"n"],[125,612,"n"],[125,506,"n"],[125,365,"n"],[125,342,"n"],[125,345,"n"],[125,340,"n"],[125,339,"n"],[125,344,"n"],[125,333,"n"],[125,366,"n"],[125,387,"n"],[125,371,"n"],[125,347,"n"],[125,343,"n"],[125,613,"n"],[125,331,"n"],[125,335,"n"],[125,334,"n"],[126,5,"h"],[126,50,"p"],[126,374,"n"],[126,448,"n"],[126,421,"n"],[126,394,"n"],[126,614,"n"],[126,615,"n"],[126,422,"n"],[126,370,"n"],[126,333,"n"],[126,335,"n"],[126,331,"n"],[126,355,"n"],[127,5,"h"],[127,50,"p"],[127,414,"n"],[127,443,"n"],[127,374,"n"],[127,370,"n"],[127,507,"n"],[127,369,"n"],[127,404,"n"],[127,616,"n"],[127,345,"n"],[127,342,"n"],[127,407,"n"],[127,339,"n"],[127,334,"n"],[127,344,"n"],[127,333,"n"],[127,335,"n"],[128,5,"h"],[128,50,"p"],[128,617,"n"],[128,338,"n"],[128,458,"n"],[128,344,"n"],[128,336,"n"],[128,337,"n"],[128,363,"n"],[129,5,"h"],[129,50,"p"],[129,348,"n"],[129,377,"n"],[129,410,"n"],[129,346,"n"],[129,402,"n"],[129,388,"n"],[129,331,"n"],[129,334,"n"],[129,336,"n"],[129,335,"n"],[129,347,"n"],[129,343,"n"],[129,366,"n"],[129,508,"n"],[130,5,"h"],[130,50,"p"],[130,406,"n"],[130,445,"n"],[130,389,"n"],[130,418,"n"],[130,365,"n"],[130,338,"n"],[130,417,"n"],[130,346,"n"],[130,618,"n"],[130,342,"n"],[130,396,"n"],[130,390,"n"],[130,358,"n"],[130,350,"n"],[130,347,"n"],[130,619,"n"],[130,335,"n"],[130,371,"n"],[130,341,"n"],[130,363,"n"],[130,333,"n"],[130,344,"n"],[130,339,"n"],[130,620,"n"],[131,5,"h"],[131,50,"p"],[131,349,"n"],[131,447,"n"],[131,479,"n"],[131,621,"n"],[131,500,"n"],[131,342,"n"],[131,339,"n"],[131,335,"n"],[132,5,"h"],[132,50,"p"],[132,411,"n"],[132,507,"n"],[132,376,"n"],[132,399,"n"],[132,333,"n"],[132,366,"n"],[132,416,"n"],[132,370,"n"],[132,371,"n"],[132,344,"n"],[132,622,"n"],[132,335,"n"],[132,349,"n"],[133,5,"h"],[133,50,"p"],[133,623,"n"],[133,421,"n"],[133,374,"n"],[133,348,"n"],[133,351,"n"],[133,403,"n"],[133,345,"n"],[133,383,"n"],[133,388,"n"],[133,404,"n"],[133,342,"n"],[133,430,"n"],[133,423,"n"],[133,335,"n"],[133,350,"n"],[133,332,"n"],[133,346,"n"],[133,336,"n"],[133,333,"n"],[133,337,"n"],[133,343,"n"],[133,384,"n"],[133,334,"n"],[133,398,"n"],[133,344,"n"],[133,331,"n"],[133,347,"n"],[134,5,"h"],[134,50,"p"],[134,377,"n"],[134,624,"n"],[134,448,"n"],[134,625,"n"],[134,362,"n"],[134,447,"n"],[134,478,"n"],[134,626,"n"],[134,370,"n"],[134,385,"n"],[134,389,"n"],[134,379,"n"],[134,335,"n"],[135,6,"h"],[135,32,"p"],[135,351,"n"],[135,362,"n"],[135,364,"n"],[135,349,"n"],[135,396,"n"],[135,344,"n"],[135,335,"n"],[135,332,"n"],[136,6,"h"],[136,32,"p"],[136,627,"n"],[136,420,"n"],[136,405,"n"],[136,360,"n"],[136,346,"n"],[136,354,"n"],[136,403,"n"],[136,404,"n"],[136,337,"n"],[136,628,"n"],[136,336,"n"],[136,334,"n"],[137,6,"h"],[137,32,"p"],[137,342,"n"],[137,351,"n"],[137,349,"n"],[137,346,"n"],[137,502,"n"],[137,358,"n"],[137,371,"n"],[137,334,"n"],[137,331,"n"],[137,347,"n"],[137,387,"n"],[137,355,"n"],[138,6,"h"],[138,32,"p"],[138,348,"n"],[138,374,"n"],[138,369,"n"],[138,377,"n"],[138,394,"n"],[138,396,"n"],[138,346,"n"],[138,365,"n"],[138,629,"n"],[138,367,"n"],[138,388,"n"],[138,393,"n"],[138,430,"n"],[138,424,"n"],[138,356,"n"],[138,476,"n"],[138,336,"n"],[138,334,"n"],[138,425,"n"],[138,335,"n"],[138,343,"n"],[138,344,"n"],[138,333,"n"],[139,12,"h"],[139,37,"p"],[140,12,"h"],[140,37,"p"],[140,341,"n"],[140,361,"n"],[140,343,"n"],[140,333,"n"],[140,339,"n"],[140,354,"n"],[140,342,"n"],[140,504,"n"],[140,406,"n"],[140,344,"n"],[141,12,"h"],[141,37,"p"],[141,392,"n"],[141,379,"n"],[141,348,"n"],[141,394,"n"],[141,509,"n"],[141,444,"n"],[141,369,"n"],[141,346,"n"],[141,341,"n"],[141,333,"n"],[141,344,"n"],[141,343,"n"],[141,334,"n"],[141,332,"n"],[141,331,"n"],[142,12,"h"],[142,37,"p"],[142,349,"n"],[142,356,"n"],[142,348,"n"],[142,510,"n"],[142,394,"n"],[142,350,"n"],[142,340,"n"],[142,382,"n"],[142,334,"n"],[142,439,"n"],[142,367,"n"],[142,393,"n"],[142,630,"n"],[142,335,"n"],[142,341,"n"],[142,337,"n"],[142,331,"n"],[142,336,"n"],[142,449,"n"],[142,511,"n"],[143,12,"h"],[143,37,"p"],[143,332,"n"],[143,425,"n"],[143,356,"n"],[143,351,"n"],[143,342,"n"],[143,383,"n"],[143,343,"n"],[143,333,"n"],[144,12,"h"],[144,37,"p"],[144,38,"p"],[144,348,"n"],[144,342,"n"],[144,631,"n"],[144,412,"n"],[144,350,"n"],[144,356,"n"],[144,490,"n"],[144,383,"n"],[144,334,"n"],[144,332,"n"],[144,335,"n"],[144,341,"n"],[144,337,"n"],[144,475,"n"],[144,340,"n"],[144,347,"n"],[144,511,"n"],[145,10,"h"],[145,36,"p"],[146,10,"h"],[146,36,"p"],[146,399,"n"],[146,381,"n"],[146,426,"n"],[146,460,"n"],[146,338,"n"],[146,334,"n"],[146,331,"n"],[146,343,"n"],[146,398,"n"],[146,337,"n"],[146,407,"n"],[146,632,"n"],[146,347,"n"],[146,422,"n"],[146,440,"n"],[146,493,"n"],[146,633,"n"],[146,386,"n"],[147,10,"h"],[147,36,"p"],[147,488,"n"],[147,417,"n"],[147,353,"n"],[147,349,"n"],[147,427,"n"],[147,512,"n"],[147,634,"n"],[147,635,"n"],[147,442,"n"],[147,636,"n"],[147,339,"n"],[147,366,"n"],[147,336,"n"],[147,385,"n"],[147,343,"n"],[147,401,"n"],[147,637,"n"],[147,341,"n"],[147,363,"n"],[147,337,"n"],[147,384,"n"],[147,371,"n"],[148,10,"h"],[148,36,"p"],[149,10,"h"],[149,36,"p"],[149,364,"n"],[149,341,"n"],[149,371,"n"],[149,638,"n"],[149,415,"n"],[149,384,"n"],[149,450,"n"],[149,508,"n"],[149,397,"n"],[149,345,"n"],[149,467,"n"],[149,351,"n"],[149,366,"n"],[149,386,"n"],[149,639,"n"],[149,332,"n"],[149,334,"n"],[149,640,"n"],[149,333,"n"],[149,337,"n"],[149,641,"n"],[149,339,"n"],[149,374,"n"],[149,331,"n"],[150,10,"h"],[150,36,"p"],[150,343,"n"],[150,413,"n"],[150,421,"n"],[150,480,"n"],[150,360,"n"],[150,364,"n"],[150,341,"n"],[150,336,"n"],[150,513,"n"],[150,423,"n"],[150,468,"n"],[150,642,"n"],[150,332,"n"],[150,334,"n"],[150,338,"n"],[151,10,"h"],[151,36,"p"],[151,348,"n"],[151,513,"n"],[151,345,"n"],[151,413,"n"],[151,643,"n"],[151,474,"n"],[151,401,"n"],[151,644,"n"],[151,332,"n"],[151,393,"n"],[151,436,"n"],[151,645,"n"],[151,505,"n"],[151,514,"n"],[151,343,"n"],[151,333,"n"],[151,341,"n"],[151,335,"n"],[152,10,"h"],[152,36,"p"],[152,472,"n"],[152,423,"n"],[152,646,"n"],[152,377,"n"],[152,647,"n"],[152,334,"n"],[152,332,"n"],[152,384,"n"],[152,338,"n"],[152,364,"n"],[152,333,"n"],[152,343,"n"],[152,335,"n"],[152,341,"n"],[153,10,"h"],[153,36,"p"],[154,11,"h"],[154,36,"p"],[154,648,"n"],[154,515,"n"],[154,388,"n"],[154,516,"n"],[154,405,"n"],[154,364,"n"],[154,336,"n"],[154,427,"n"],[154,649,"n"],[154,418,"n"],[154,436,"n"],[154,333,"n"],[154,341,"n"],[154,337,"n"],[155,11,"h"],[155,36,"p"],[155,349,"n"],[155,471,"n"],[155,489,"n"],[155,334,"n"],[155,371,"n"],[155,356,"n"],[155,388,"n"],[155,354,"n"],[155,338,"n"],[155,384,"n"],[155,335,"n"],[155,650,"n"],[155,341,"n"],[155,331,"n"],[155,512,"n"],[155,651,"n"],[156,11,"h"],[156,36,"p"],[156,346,"n"],[156,423,"n"],[156,379,"n"],[156,368,"n"],[156,332,"n"],[156,353,"n"],[156,354,"n"],[156,652,"n"],[156,384,"n"],[156,338,"n"],[156,653,"n"],[156,385,"n"],[156,334,"n"],[156,426,"n"],[156,407,"n"],[157,11,"h"],[157,36,"p"],[157,495,"n"],[157,348,"n"],[157,392,"n"],[157,379,"n"],[157,369,"n"],[157,370,"n"],[157,654,"n"],[157,354,"n"],[157,377,"n"],[157,331,"n"],[157,334,"n"],[157,358,"n"],[157,352,"n"],[157,373,"n"],[157,336,"n"],[157,407,"n"],[157,335,"n"],[157,337,"n"],[158,11,"h"],[158,36,"p"],[158,496,"n"],[158,333,"n"],[158,419,"n"],[158,331,"n"],[158,332,"n"],[158,345,"n"],[158,655,"n"],[158,335,"n"],[158,368,"n"],[159,9,"h"],[159,50,"p"],[160,9,"h"],[160,50,"p"],[160,360,"n"],[160,370,"n"],[160,358,"n"],[160,424,"n"],[160,351,"n"],[160,335,"n"],[161,9,"h"],[161,50,"p"],[162,9,"h"],[162,35,"p"],[163,7,"h"],[163,33,"p"],[164,7,"h"],[164,50,"p"],[165,7,"h"],[165,50,"p"],[166,7,"h"],[166,34,"p"],[167,8,"h"],[167,50,"p"],[167,416,"n"],[167,345,"n"],[167,517,"n"],[167,351,"n"],[167,353,"n"],[168,8,"h"],[168,50,"p"],[168,420,"n"],[168,348,"n"],[168,342,"n"],[168,347,"n"],[168,351,"n"],[168,337,"n"],[168,334,"n"],[168,335,"n"],[169,8,"h"],[169,50,"p"],[169,360,"n"],[169,449,"n"],[169,391,"n"],[169,656,"n"],[169,355,"n"],[169,349,"n"],[169,345,"n"],[169,334,"n"],[169,344,"n"],[169,332,"n"],[170,8,"h"],[170,50,"p"],[170,360,"n"],[170,357,"n"],[170,369,"n"],[170,345,"n"],[170,370,"n"],[170,351,"n"],[171,8,"h"],[171,50,"p"],[171,657,"n"],[171,413,"n"],[171,658,"n"],[171,380,"n"],[171,659,"n"],[172,1,"h"],[172,50,"p"],[172,437,"n"],[172,448,"n"],[172,362,"n"],[172,451,"n"],[172,450,"n"],[172,463,"n"],[172,336,"n"],[172,361,"n"],[172,353,"n"],[172,660,"n"],[172,359,"n"],[172,337,"n"],[172,661,"n"],[172,352,"n"],[172,331,"n"],[173,1,"h"],[173,39,"p"],[173,662,"n"],[173,361,"n"],[173,340,"n"],[173,347,"n"],[173,366,"n"],[173,352,"n"],[174,1,"h"],[174,39,"p"],[174,425,"n"],[174,663,"n"],[174,450,"n"],[174,482,"n"],[174,396,"n"],[174,385,"n"],[175,1,"h"],[175,39,"p"],[175,664,"n"],[175,345,"n"],[175,351,"n"],[175,332,"n"],[176,1,"h"],[176,39,"p"],[176,339,"n"],[176,349,"n"],[176,337,"n"],[176,426,"n"],[176,364,"n"],[177,1,"h"],[177,39,"p"],[177,378,"n"],[177,515,"n"],[177,451,"n"],[177,360,"n"],[177,352,"n"],[177,331,"n"],[177,335,"n"],[178,1,"h"],[178,39,"p"],[178,403,"n"],[178,438,"n"],[178,409,"n"],[178,334,"n"],[178,373,"n"],[179,1,"h"],[179,39,"p"],[179,665,"n"],[179,501,"n"],[179,349,"n"],[179,353,"n"],[180,19,"h"],[180,50,"p"],[180,666,"n"],[180,381,"n"],[180,378,"n"],[180,415,"n"],[180,365,"n"],[180,346,"n"],[180,391,"n"],[180,385,"n"],[180,422,"n"],[180,353,"n"],[180,386,"n"],[181,13,"h"],[181,40,"p"],[181,667,"n"],[181,494,"n"],[181,424,"n"],[181,373,"n"],[181,361,"n"],[181,397,"n"],[182,25,"h"],[182,49,"p"],[182,356,"n"],[182,451,"n"],[182,331,"n"],[182,340,"n"],[182,366,"n"],[182,402,"n"],[182,332,"n"],[182,668,"n"],[182,427,"n"],[182,359,"n"],[182,358,"n"],[182,449,"n"],[182,410,"n"],[182,391,"n"],[182,380,"n"],[182,669,"n"],[182,365,"n"],[182,403,"n"],[182,338,"n"],[182,409,"n"],[182,670,"n"],[182,671,"n"],[182,336,"n"],[182,672,"n"],[182,400,"n"],[182,431,"n"],[182,439,"n"],[182,382,"n"],[182,420,"n"],[182,363,"n"],[182,425,"n"],[182,371,"n"],[182,393,"n"],[182,454,"n"],[182,335,"n"],[182,673,"n"],[182,407,"n"],[182,361,"n"],[182,347,"n"],[182,334,"n"],[182,499,"n"],[182,346,"n"],[182,345,"n"],[182,387,"n"],[183,14,"h"],[183,41,"p"],[183,338,"n"],[183,357,"n"],[183,353,"n"],[183,397,"n"],[183,339,"n"],[183,674,"n"],[183,421,"n"],[183,378,"n"],[184,15,"h"],[184,42,"p"],[184,389,"n"],[184,417,"n"],[184,424,"n"],[184,377,"n"],[184,342,"n"],[184,345,"n"],[184,351,"n"],[184,331,"n"],[184,382,"n"],[184,339,"n"],[184,352,"n"],[185,16,"h"],[185,43,"p"],[185,374,"n"],[185,379,"n"],[185,675,"n"],[185,362,"n"],[185,391,"n"],[185,485,"n"],[185,506,"n"],[185,352,"n"],[185,517,"n"],[185,336,"n"],[185,486,"n"],[185,335,"n"],[185,339,"n"],[186,17,"h"],[186,50,"p"],[186,369,"n"],[186,356,"n"],[186,383,"n"],[186,351,"n"],[186,336,"n"],[186,332,"n"],[186,357,"n"],[187,18,"h"],[187,50,"p"],[187,374,"n"],[187,510,"n"],[187,509,"n"],[187,342,"n"],[187,402,"n"],[187,338,"n"],[187,354,"n"],[187,405,"n"],[187,333,"n"],[187,422,"n"],[188,20,"h"],[188,44,"p"],[189,20,"h"],[189,44,"p"],[190,21,"h"],[190,45,"p"],[190,46,"p"],[190,378,"n"],[190,676,"n"],[190,376,"n"],[190,342,"n"],[190,339,"n"],[190,347,"n"],[190,343,"n"],[190,427,"n"],[190,335,"n"],[190,334,"n"],[190,336,"n"],[190,332,"n"],[190,333,"n"],[190,350,"n"],[191,22,"h"],[191,47,"p"],[191,677,"n"],[191,443,"n"],[191,514,"n"],[191,345,"n"],[191,678,"n"],[191,332,"n"],[191,334,"n"],[191,331,"n"],[191,343,"n"],[191,336,"n"],[191,516,"n"],[191,333,"n"],[191,362,"n"],[191,444,"n"],[191,392,"n"],[192,23,"h"],[192,48,"p"],[192,386,"n"],[192,333,"n"],[192,366,"n"],[192,406,"n"],[192,398,"n"],[192,339,"n"],[192,679,"n"],[192,343,"n"],[192,364,"n"],[192,334,"n"],[192,415,"n"],[192,680,"n"],[192,473,"n"],[192,681,"n"],[192,426,"n"],[193,24,"h"],[193,49,"p"],[194,24,"h"],[194,49,"p"],[195,24,"h"],[195,49,"p"],[196,24,"h"],[196,49,"p"],[197,24,"h"],[197,49,"p"],[198,24,"h"],[198,49,"p"],[199,24,"h"],[199,49,"p"],[200,24,"h"],[200,49,"p"],[201,24,"h"],[201,49,"p"],[202,24,"h"],[202,49,"p"],[203,24,"h"],[203,49,"p"],[204,24,"h"],[204,49,"p"],[205,24,"h"],[205,49,"p"],[206,24,"h"],[206,49,"p"],[207,24,"h"],[207,49,"p"],[208,24,"h"],[208,49,"p"],[209,24,"h"],[209,49,"p"],[210,24,"h"],[210,49,"p"],[211,24,"h"],[211,49,"p"],[212,24,"h"],[212,49,"p"],[213,24,"h"],[213,49,"p"],[214,24,"h"],[214,49,"p"],[215,24,"h"],[215,49,"p"],[216,24,"h"],[216,49,"p"],[217,24,"h"],[217,49,"p"],[218,24,"h"],[218,49,"p"],[219,24,"h"],[219,49,"p"],[220,24,"h"],[220,49,"p"],[221,24,"h"],[221,49,"p"],[222,24,"h"],[222,49,"p"],[223,24,"h"],[223,49,"p"],[224,24,"h"],[224,49,"p"],[225,24,"h"],[225,49,"p"],[226,24,"h"],[226,49,"p"],[227,24,"h"],[227,49,"p"],[228,24,"h"],[228,49,"p"],[229,24,"h"],[229,49,"p"],[230,24,"h"],[230,49,"p"],[231,24,"h"],[231,49,"p"],[232,24,"h"],[232,49,"p"],[233,24,"h"],[233,49,"p"],[234,24,"h"],[234,49,"p"],[235,24,"h"],[235,49,"p"],[236,24,"h"],[236,49,"p"],[237,24,"h"],[237,49,"p"],[238,24,"h"],[238,49,"p"],[239,24,"h"],[239,49,"p"],[240,24,"h"],[240,49,"p"],[241,24,"h"],[241,49,"p"],[242,24,"h"],[242,49,"p"],[243,24,"h"],[243,49,"p"],[244,24,"h"],[244,49,"p"],[245,24,"h"],[245,49,"p"],[246,24,"h"],[246,49,"p"],[247,24,"h"],[247,49,"p"],[248,24,"h"],[248,49,"p"],[249,24,"h"],[249,49,"p"],[250,24,"h"],[250,49,"p"],[251,24,"h"],[251,49,"p"],[252,24,"h"],[252,49,"p"],[253,24,"h"],[253,49,"p"],[254,24,"h"],[254,49,"p"],[255,24,"h"],[255,49,"p"],[256,24,"h"],[256,49,"p"],[257,24,"h"],[257,49,"p"],[258,24,"h"],[258,49,"p"],[259,24,"h"],[259,49,"p"],[260,25,"h"],[260,49,"p"],[261,25,"h"],[261,49,"p"],[262,25,"h"],[262,49,"p"],[263,25,"h"],[263,49,"p"],[264,25,"h"],[264,49,"p"],[265,25,"h"],[265,49,"p"],[266,25,"h"],[266,49,"p"],[267,25,"h"],[267,49,"p"],[268,25,"h"],[268,49,"p"],[269,25,"h"],[269,49,"p"],[270,25,"h"],[270,49,"p"],[271,25,"h"],[271,49,"p"],[272,25,"h"],[272,49,"p"],[273,25,"h"],[273,49,"p"],[274,25,"h"],[274,49,"p"],[275,25,"h"],[275,49,"p"],[276,25,"h"],[276,49,"p"],[277,25,"h"],[277,49,"p"],[278,25,"h"],[278,49,"p"],[279,25,"h"],[279,49,"p"],[280,25,"h"],[280,49,"p"],[281,25,"h"],[281,49,"p"],[282,25,"h"],[282,49,"p"],[283,25,"h"],[283,49,"p"],[284,25,"h"],[284,49,"p"],[285,25,"h"],[285,49,"p"],[286,25,"h"],[286,49,"p"],[287,25,"h"],[287,49,"p"],[288,25,"h"],[288,49,"p"],[289,25,"h"],[289,49,"p"],[290,25,"h"],[290,49,"p"],[291,26,"h"],[291,49,"p"],[292,26,"h"],[292,49,"p"],[293,26,"h"],[293,49,"p"],[294,26,"h"],[294,49,"p"],[295,26,"h"],[295,49,"p"],[296,26,"h"],[296,49,"p"],[297,26,"h"],[297,49,"p"],[298,26,"h"],[298,49,"p"],[299,26,"h"],[299,49,"p"],[300,26,"h"],[300,49,"p"],[301,26,"h"],[301,49,"p"],[302,26,"h"],[302,49,"p"],[303,26,"h"],[303,49,"p"],[304,26,"h"],[304,49,"p"],[305,26,"h"],[305,49,"p"],[306,26,"h"],[306,49,"p"],[307,26,"h"],[307,49,"p"],[308,26,"h"],[308,49,"p"],[309,26,"h"],[309,49,"p"],[310,26,"h"],[310,49,"p"],[311,26,"h"],[311,49,"p"],[312,26,"h"],[312,49,"p"],[313,26,"h"],[313,49,"p"],[314,26,"h"],[314,49,"p"],[315,26,"h"],[315,49,"p"],[316,26,"h"],[316,49,"p"],[317,26,"h"],[317,49,"p"],[318,26,"h"],[318,49,"p"],[319,26,"h"],[319,49,"p"],[320,26,"h"],[320,49,"p"],[321,26,"h"],[321,49,"p"],[322,26,"h"],[322,49,"p"],[323,26,"h"],[323,49,"p"],[324,26,"h"],[324,49,"p"],[325,26,"h"],[325,49,"p"],[326,26,"h"],[326,49,"p"],[327,26,"h"],[327,49,"p"],[328,26,"h"],[328,49,"p"],[329,26,"h"],[329,49,"p"],[330,26,"h"],[330,49,"p"]],"accords":[["CIT","Citrus"],["ARO","Aromatic & Herbal"],["GRN","Green"],["FLO","Floral"],["FRU","Fruit"],["SPI","Spice"],["GOU","Gourmand"],["BRW","Brews & Spirits"],["WOO","Woods"],["CON","Conifers"],["RES","Resins & Balsams"],["ANI","Musk, Skin & Animalic"],["EAR","Earth, Moss & Mineral"],["AIR","Water & Air"],["SMK","Smoke & Char"],["IMP","Impressions"]]};

  const canvas = document.querySelector(".t4-board");
  const ctx = canvas.getContext("2d");
  const tip = document.querySelector(".t4-tip");
  const editor = document.querySelector(".t4-edit");
  const fileIn = document.querySelector(".t4-file");
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const KEY = "test-page-4-board";

  // ---- THE NETWORK ------------------------------------------------------
  const HUES = ["#f2f2f2", "#ee8a3c", "#9b6cf2", "#42b883", "#e5484d", "#b08a5a", "#5b8def", "#e86fb0", "#2fb5c4", "#d9c24a", "#8aa0b6", "#c0587e", "#6fbf4a", "#f0a3a3"];
  const ACC_HUE = {
    CIT: "#e9d24a", ARO: "#6fbf4a", GRN: "#42b883", FLO: "#e86fb0", FRU: "#ee6a5c", SPI: "#ee8a3c", GOU: "#c9944a", BRW: "#b08a5a",
    WOO: "#a0785a", CON: "#3f9e6b", RES: "#d9a441", ANI: "#c0587e", EAR: "#7b8b5a", AIR: "#5b8def", SMK: "#8b8b93", IMP: "#9b6cf2",
  };
  const NOTE_COLS = ["#c94a4a", "#3f8f5f", "#7a4fc4", "#8a6234", "#d9d9de"];
  const nodes = NET.nodes.map((n, i) => ({
    i, k: n[0], label: n[1], x: n[2], y: n[3], hx: n[2], hy: n[3], w: n[4], extra: n[5], gone: false, deg: 0,
  }));
  const houseIndex = {};
  let hi = 0;
  nodes.forEach((n) => { if (n.k === "h") { n.col = HUES[hi++ % HUES.length]; houseIndex[n.label] = n; } });
  // a house node is known to its perfumes by its id; the ledger's ids are the house's names lower-cased
  const houseById = {};
  nodes.forEach((n) => { if (n.k === "h") houseById[n.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")] = n; });
  const links = NET.links.map(([a, b, k]) => ({ a, b, k }));
  links.forEach((l) => { nodes[l.a].deg++; nodes[l.b].deg++; if (l.k === "h") nodes[l.a].house = nodes[l.b]; });
  nodes.forEach((n) => {
    if (n.k === "f") n.col = n.house ? n.house.col : "#ccc";
    else if (n.k === "n") n.col = ACC_HUE[n.extra] || "#999";
    else if (n.k === "p") n.col = "#ececee";
    n.r = n.k === "h" ? 13 + Math.sqrt(n.w) * 4.2 : n.k === "p" ? 7 + Math.sqrt(n.deg) * 0.9 : n.k === "f" ? 3.2 : 1.6 + Math.sqrt(n.w) * 0.7;
  });
  const neighbours = nodes.map(() => []);
  links.forEach((l) => { neighbours[l.a].push(l.b); neighbours[l.b].push(l.a); });
  // the accords, as faint rings round their notes
  const accords = NET.accords.map(([code, name]) => {
    const own = nodes.filter((n) => n.k === "n" && n.extra === code);
    const cx = own.reduce((s, n) => s + n.hx, 0) / (own.length || 1), cy = own.reduce((s, n) => s + n.hy, 0) / (own.length || 1);
    const r = Math.sqrt(own.reduce((s, n) => s + (n.hx - cx) ** 2 + (n.hy - cy) ** 2, 0) / (own.length || 1)) * 0.75 + 30;
    return { code, name, x: cx, y: cy, r, col: ACC_HUE[code] };
  });
  // the frame, square through the network, a box at each corner
  const xs = nodes.map((n) => n.hx), ys = nodes.map((n) => n.hy);
  const B = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  const side = Math.max(B.x1 - B.x0, B.y1 - B.y0) * 0.72, fcx = (B.x0 + B.x1) / 2, fcy = (B.y0 + B.y1) / 2;
  const count = (k) => nodes.filter((n) => n.k === k).length;
  const CORNERS = [
    [fcx - side / 2, fcy - side / 2, "MAP 01 · HOUSES (" + count("h") + ")"],
    [fcx + side / 2, fcy - side / 2, "MAP 02 · PERFUMERS (" + count("p") + ")"],
    [fcx + side / 2, fcy + side / 2, "MAP 03 · PERFUMES (" + count("f") + ")"],
    [fcx - side / 2, fcy + side / 2, "MAP 04 · NOTES (" + count("n") + ")"],
  ];
  // the houses' own lines of writing, pinned beside them on coloured notes
  const pins = nodes.filter((n) => n.k === "h" && n.extra).map((n, i) => ({ n, col: NOTE_COLS[i % NOTE_COLS.length], dx: n.r + 18, dy: -n.r - 30 - (i % 3) * 10 }));

  // ---- WHAT IS DRAWN ON IT: the user's things --------------------------
  let items = [];       // stroke, arrow, ellipse, rect, tri, star, diamond, text, note, image
  let nid = 1;
  const images = new Map();
  const SWATCHES = ["#ececee", "#e5484d", "#ee8a3c", "#e9d24a", "#42b883", "#5b8def", "#9b6cf2"];
  let colour = SWATCHES[1];

  // ---- THE CAMERA -------------------------------------------------------
  let W = 0, H = 0, DPR = 1;
  const cam = { x: 0, y: 0, z: 0.3 };
  const goal = { x: 0, y: 0, z: 0.3, on: false };
  const toScreen = (x, y) => [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2];
  const toWorld = (sx, sy) => [(sx - W / 2) / cam.z + cam.x, (sy - H / 2) / cam.z + cam.y];
  const layer = document.createElement("canvas");
  const lctx = layer.getContext("2d");
  function resize() {
    W = innerWidth; H = innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = layer.width = Math.round(W * DPR);
    canvas.height = layer.height = Math.round(H * DPR);
    dirty = true; kick();
  }
  function fit(animate) {
    const vis = nodes.filter((n) => !n.gone);
    let x0 = Math.min(...vis.map((n) => n.x)), x1 = Math.max(...vis.map((n) => n.x)), y0 = Math.min(...vis.map((n) => n.y)), y1 = Math.max(...vis.map((n) => n.y));
    items.forEach((it) => { const b = bboxOf(it); x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); });
    // on a narrow window, the frame across it rather than the whole network small
    if (W < 700 && !items.length) { x0 = fcx - side / 2 - 40; x1 = fcx + side / 2 + 40; y0 = fcy - side / 2; y1 = fcy + side / 2; }
    const z = Math.min((W - (W < 700 ? 20 : 80)) / (x1 - x0 + 1), (H - 190) / (y1 - y0 + 1));
    const t = { x: (x0 + x1) / 2, y: (y0 + y1) / 2 + 30 / z, z: Math.max(0.08, Math.min(4, z)) };
    if (animate && !STILL) Object.assign(goal, t, { on: true }); else Object.assign(cam, t);
    dirty = true; kick();
  }

  // ---- DRAWING THE BOARD (into `layer`, again only when something changed) --
  let dirty = true, showAll = false;
  let intro = STILL ? 1 : 0, introT0 = 0;
  const introAt = (n) => {
    if (intro >= 1) return 1;
    const d = Math.hypot(n.hx - fcx, n.hy - fcy) / (side * 0.9);
    const t = Math.max(0, Math.min(1, intro * 1.7 - d * 0.7));
    return 1 - Math.pow(1 - t, 3);
  };
  function nodePos(n) {
    if (intro >= 1) return [n.x, n.y];
    const k = introAt(n);
    return [fcx + (n.x - fcx) * k, fcy + (n.y - fcy) * k];
  }
  function drawBoard() {
    dirty = false;
    const c = lctx, z = cam.z;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, layer.width, layer.height);
    c.setTransform(DPR * z, 0, 0, DPR * z, DPR * (W / 2 - cam.x * z), DPR * (H / 2 - cam.y * z));
    const px = 1 / z;   // a pixel, in the board's units
    const vx0 = cam.x - W / 2 / z - 60, vx1 = cam.x + W / 2 / z + 60, vy0 = cam.y - H / 2 / z - 60, vy1 = cam.y + H / 2 / z + 60;
    const seen = (x, y, r) => x + r > vx0 && x - r < vx1 && y + r > vy0 && y - r < vy1;

    // the frame and the long lines across it
    c.lineWidth = 1.2 * px;
    c.strokeStyle = "rgba(176,128,72,0.55)";
    c.beginPath();
    CORNERS.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath(); c.stroke();
    c.strokeStyle = "rgba(255,255,255,0.06)";
    c.beginPath();
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + 0.3; c.moveTo(fcx, fcy); c.lineTo(fcx + Math.cos(a) * side * 0.95, fcy + Math.sin(a) * side * 0.95); }
    c.stroke();
    // the accords' rings
    c.lineWidth = 1 * px;
    accords.forEach((a) => {
      c.strokeStyle = a.col; c.globalAlpha = 0.22 * intro;
      c.beginPath(); c.arc(a.x, a.y, a.r, 0, TAU); c.stroke();
    });
    c.globalAlpha = 1;

    // the lines, batched by colour
    const groups = new Map();
    const pos = nodes.map(nodePos);
    for (const l of links) {
      const A = nodes[l.a], Bn = nodes[l.b];
      if (A.gone || Bn.gone) continue;
      const [ax, ay] = pos[l.a], [bx, by] = pos[l.b];
      if (!seen((ax + bx) / 2, (ay + by) / 2, Math.hypot(ax - bx, ay - by) / 2)) continue;
      const key = l.k === "h" ? A.col + "|0.38" : l.k === "p" ? "#ffffff|0.16" : Bn.col + "|0.13";
      let p = groups.get(key);
      if (!p) { p = new Path2D(); groups.set(key, p); }
      p.moveTo(ax, ay); p.lineTo(bx, by);
    }
    c.lineWidth = 0.8 * px;
    groups.forEach((p, key) => { const [col, al] = key.split("|"); c.strokeStyle = col; c.globalAlpha = +al * intro; c.stroke(p); });
    c.globalAlpha = 1;

    // the nodes
    for (const n of nodes) {
      if (n.gone) continue;
      const [x, y] = pos[n.i];
      if (!seen(x, y, n.r + 40)) continue;
      const k = introAt(n);
      c.globalAlpha = k;
      if (n.k === "h") {
        c.fillStyle = "#f4f4f6";
        c.beginPath(); c.arc(x, y, n.r, 0, TAU); c.fill();
        c.strokeStyle = n.col; c.lineWidth = 3 * px;
        c.beginPath(); c.arc(x, y, n.r + 5 * px, 0, TAU); c.stroke();
      } else if (n.k === "p") {
        c.strokeStyle = "#ececee"; c.lineWidth = 1.4 * px; c.fillStyle = "#101012";
        c.beginPath(); c.arc(x, y, n.r, 0, TAU); c.fill(); c.stroke();
        c.fillStyle = "#ececee"; c.beginPath(); c.arc(x, y, 2.2 * px + 1, 0, TAU); c.fill();
      } else {
        c.fillStyle = n.col;
        c.beginPath(); c.arc(x, y, Math.max(n.r, 1.2 * px), 0, TAU); c.fill();
      }
    }
    c.globalAlpha = 1;

    // the houses' notes pinned beside them
    c.textBaseline = "top";
    for (const p of pins) {
      if (p.n.gone) continue;
      const [x, y] = pos[p.n.i];
      const nx = x + p.dx, ny = y + p.dy;
      if (!seen(nx, ny, 120)) continue;
      c.globalAlpha = introAt(p.n);
      c.font = "500 7px 'IBM Plex Mono', monospace";
      const lines = wrap(c, p.n.extra.toUpperCase(), 70);
      const w = 84, h = 10 + lines.length * 9;
      c.fillStyle = p.col; c.fillRect(nx, ny, w, h);
      c.fillStyle = p.col === "#d9d9de" ? "#202024" : "#fff";
      lines.forEach((t, i) => c.fillText(t, nx + 6, ny + 5 + i * 9));
      c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = px;
      c.beginPath(); c.moveTo(x, y); c.lineTo(nx, ny + h / 2); c.stroke();
    }
    c.globalAlpha = 1;

    // the names, at a size of their own whatever the zoom — each box tried
    // above, below, right and left of its node, and put where it covers no
    // other (a house is always named, at the place it covers least)
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.textBaseline = "middle";
    const taken = [];
    const over = (b) => taken.reduce((s, t) => s + Math.max(0, Math.min(b[2], t[2]) - Math.max(b[0], t[0])) * Math.max(0, Math.min(b[3], t[3]) - Math.max(b[1], t[1])), 0);
    // the corner boxes first, at the frame's corners
    c.font = "600 9px Archivo, sans-serif";
    CORNERS.forEach(([wx, wy, t]) => {
      const w = c.measureText(t).width + 16;
      let [x, y] = toScreen(wx, wy);
      x = Math.max(6 + w / 2, Math.min(W - 6 - w / 2, x));
      c.fillStyle = "#16161a"; c.strokeStyle = "rgba(176,128,72,0.8)"; c.lineWidth = 1;
      c.fillRect(x - w / 2, y - 10, w, 20); c.strokeRect(x - w / 2 + 0.5, y - 9.5, w - 1, 19);
      c.fillStyle = "#ececee"; c.textAlign = "center"; c.fillText(t, x, y + 0.5);
      taken.push([x - w / 2, y - 10, x + w / 2, y + 10]);
    });
    const named = nodes.filter((n) => n.k === "h" || n.k === "p").sort((a, b) => (a.k === b.k ? b.r - a.r : a.k === "h" ? -1 : 1));
    for (const n of named) {
      if (n.gone || introAt(n) < 0.9) continue;
      if (n.k === "p" && !(z > 0.32 || showAll)) continue;
      const [x, y] = toScreen(...pos[n.i]);
      if (x < -100 || x > W + 100 || y < -40 || y > H + 40) continue;
      c.font = n.k === "h" ? "600 10px Archivo, sans-serif" : "500 8.5px 'IBM Plex Mono', monospace";
      const t = n.k === "h" ? n.label.toUpperCase() : n.label;
      const w = c.measureText(t).width + 10, off = n.r * z + 4;
      const tries = [[x - w / 2, y - off - 16], [x - w / 2, y + off + 1], [x + off + 2, y - 7.5], [x - off - 2 - w, y - 7.5]];
      let best = null, least = Infinity;
      for (const [tx, by] of tries) { const bx = Math.max(4, Math.min(W - 4 - w, tx)), b = [bx, by, bx + w, by + 15]; const o = over(b); if (o < least) { least = o; best = b; } if (!o) break; }
      if (least > 0 && (n.k === "p" || (W < 700 && least > w * 15 * 0.25))) continue;
      taken.push(best);
      c.fillStyle = n.k === "h" ? "rgba(20,20,24,0.92)" : "#24242a";
      c.fillRect(best[0], best[1], w, 15);
      if (n.k === "h") { c.fillStyle = n.col; c.fillRect(best[0], best[1], 2, 15); }
      c.fillStyle = "#ececee"; c.textAlign = "center"; c.fillText(t, best[0] + w / 2, best[1] + 8);
    }
    c.textAlign = "left";
    c.font = "400 8px 'IBM Plex Mono', monospace";
    for (const n of nodes) {
      if (n.gone || (n.k !== "n" && n.k !== "f")) continue;
      const show = (n.k === "n" && (z > 1.25 || (showAll && z > 0.5))) || (n.k === "f" && (z > 1.7 || (showAll && z > 0.7)));
      if (!show) continue;
      const [x, y] = toScreen(...pos[n.i]);
      if (x < -100 || x > W + 100 || y < -40 || y > H + 40) continue;
      c.fillStyle = n.k === "n" ? n.col : "rgba(236,236,238,0.75)";
      c.fillText(n.label, x + n.r * z + 3, y);
    }

    // what is drawn on it
    c.setTransform(DPR * z, 0, 0, DPR * z, DPR * (W / 2 - cam.x * z), DPR * (H / 2 - cam.y * z));
    for (const it of items) if (!editing || editing.it !== it) drawItem(c, it, px);
  }
  function wrap(c, text, width) {
    const words = text.split(" "), out = [];
    let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (c.measureText(t).width > width && line) { out.push(line); line = w; } else line = t; }
    if (line) out.push(line);
    return out;
  }
  function drawItem(c, it, px) {
    c.save();
    c.strokeStyle = it.col; c.fillStyle = it.col; c.lineWidth = (it.lw || 2.2) * px; c.lineCap = "round"; c.lineJoin = "round";
    const [x0, y0, x1, y1] = bboxOf(it);
    switch (it.type) {
      case "stroke": {
        const p = it.pts;
        c.beginPath(); c.moveTo(p[0], p[1]);
        for (let i = 2; i < p.length - 2; i += 2) c.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2);
        c.lineTo(p[p.length - 2], p[p.length - 1]); c.stroke();
        break;
      }
      case "arrow": {
        c.beginPath(); c.moveTo(it.x0, it.y0); c.lineTo(it.x1, it.y1); c.stroke();
        const a = Math.atan2(it.y1 - it.y0, it.x1 - it.x0), s = 12 * px + 6;
        c.beginPath(); c.moveTo(it.x1, it.y1); c.lineTo(it.x1 - Math.cos(a - 0.45) * s, it.y1 - Math.sin(a - 0.45) * s);
        c.moveTo(it.x1, it.y1); c.lineTo(it.x1 - Math.cos(a + 0.45) * s, it.y1 - Math.sin(a + 0.45) * s); c.stroke();
        break;
      }
      case "ellipse": c.beginPath(); c.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.max(1, (x1 - x0) / 2), Math.max(1, (y1 - y0) / 2), 0, 0, TAU); c.stroke(); break;
      case "rect": c.strokeRect(x0, y0, x1 - x0, y1 - y0); break;
      case "tri": c.beginPath(); c.moveTo((x0 + x1) / 2, y0); c.lineTo(x1, y1); c.lineTo(x0, y1); c.closePath(); c.stroke(); break;
      case "diamond": c.beginPath(); c.moveTo((x0 + x1) / 2, y0); c.lineTo(x1, (y0 + y1) / 2); c.lineTo((x0 + x1) / 2, y1); c.lineTo(x0, (y0 + y1) / 2); c.closePath(); c.stroke(); break;
      case "star": {
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2, ry = (y1 - y0) / 2;
        c.beginPath();
        for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? 0.42 : 1; c.lineTo(cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r); }
        c.closePath(); c.stroke(); break;
      }
      case "text":
        c.font = "500 " + it.size + "px Archivo, sans-serif"; c.textBaseline = "top";
        String(it.text).split("\n").forEach((t, i) => c.fillText(t, it.x, it.y + i * it.size * 1.2));
        break;
      case "note": {
        c.shadowColor = "rgba(0,0,0,0.4)"; c.shadowBlur = 10; c.shadowOffsetY = 4;
        c.fillRect(it.x, it.y, it.w, it.h);
        c.shadowColor = "transparent";
        c.fillStyle = it.col === "#ececee" || it.col === "#e9d24a" ? "#1b1b1f" : "#fff";
        c.font = "500 13px Archivo, sans-serif"; c.textBaseline = "top";
        let ty = it.y + 10;
        String(it.text || "").split("\n").forEach((para) => wrap(c, para, it.w - 20).forEach((t) => { if (ty < it.y + it.h - 14) c.fillText(t, it.x + 10, ty); ty += 16; }));
        break;
      }
      case "image": {
        const img = images.get(it.id);
        if (img && img.complete) c.drawImage(img, it.x, it.y, it.w, it.h);
        else { c.strokeStyle = "rgba(255,255,255,0.3)"; c.strokeRect(it.x, it.y, it.w, it.h); }
        break;
      }
    }
    c.restore();
  }
  function bboxOf(it) {
    switch (it.type) {
      case "stroke": { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (let i = 0; i < it.pts.length; i += 2) { x0 = Math.min(x0, it.pts[i]); x1 = Math.max(x1, it.pts[i]); y0 = Math.min(y0, it.pts[i + 1]); y1 = Math.max(y1, it.pts[i + 1]); } return [x0, y0, x1, y1]; }
      case "arrow": return [Math.min(it.x0, it.x1), Math.min(it.y0, it.y1), Math.max(it.x0, it.x1), Math.max(it.y0, it.y1)];
      case "text": { lctx.font = "500 " + it.size + "px Archivo, sans-serif"; const ls = String(it.text).split("\n"); const w = Math.max(...ls.map((t) => lctx.measureText(t).width), 10); return [it.x, it.y, it.x + w, it.y + ls.length * it.size * 1.2]; }
      default: return [Math.min(it.x, it.x + it.w), Math.min(it.y, it.y + it.h), Math.max(it.x, it.x + it.w), Math.max(it.y, it.y + it.h)];
    }
  }

  // ---- WHAT MOVES: the lights along the lines, the bees ---------------------
  const pulses = [];
  for (let i = 0; i < (STILL ? 0 : 42); i++) pulses.push({ l: links[Math.floor(Math.random() * links.length)], t: Math.random(), v: 0.15 + Math.random() * 0.35 });
  const flowers = nodes.filter((n) => n.k === "n" && /honey|beeswax|flower|nectar|pollen|lavender|jasmine|rose/i.test(n.label));
  const bees = (STILL ? [] : [0, 1, 2, 3, 4]).map((i) => ({ home: flowers[(i * 7) % flowers.length] || nodes[0], a: Math.random() * TAU, r: 60 + Math.random() * 60, s: 0.5 + Math.random() * 0.5, ph: Math.random() * 10, x: 0, y: 0 }));
  function drawBee(c, x, y, s, t, dir) {
    c.save(); c.translate(x, y); c.scale(dir < 0 ? -s : s, s);
    // wings, beating
    const f = Math.sin(t * 40) * 0.35;
    c.fillStyle = "rgba(220,235,255,0.55)"; c.strokeStyle = "#101012"; c.lineWidth = 0.8;
    c.beginPath(); c.ellipse(-1, -6, 5, 3, -0.6 + f, 0, TAU); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(3, -6, 4, 2.6, 0.4 - f, 0, TAU); c.fill(); c.stroke();
    // the body, striped
    c.fillStyle = "#f4f4f6"; c.lineWidth = 1;
    c.beginPath(); c.ellipse(0, 0, 7, 4.6, 0, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = "#101012";
    c.fillRect(-2.6, -4.3, 1.8, 8.6); c.fillRect(1.2, -4.3, 1.8, 8.6);
    c.beginPath(); c.arc(7.2, -0.6, 2.6, 0, TAU); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(7.9, -1.2, 0.8, 0, TAU); c.fill();
    c.strokeStyle = "#101012"; c.beginPath(); c.moveTo(-7, 0); c.lineTo(-9.5, 0); c.stroke();
    c.restore();
  }

  // ---- THE FRAME --------------------------------------------------------
  let raf = 0, last = 0, hover = null;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    if (intro < 1) { if (!introT0) introT0 = now; intro = Math.min(1, (now - introT0) / 1900); dirty = true; }
    if (goal.on) {
      const k = Math.min(1, dt * 6);
      cam.x += (goal.x - cam.x) * k; cam.y += (goal.y - cam.y) * k; cam.z *= Math.pow(goal.z / cam.z, k);
      if (Math.abs(goal.z / cam.z - 1) < 0.002 && Math.hypot(goal.x - cam.x, goal.y - cam.y) * cam.z < 0.5) { Object.assign(cam, { x: goal.x, y: goal.y, z: goal.z }); goal.on = false; }
      dirty = true;
    }
    if (dirty) { drawBoard(); zoomSay.textContent = Math.round(cam.z * 100) + "%"; }
    const c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(layer, 0, 0);
    const z = cam.z;
    c.setTransform(DPR * z, 0, 0, DPR * z, DPR * (W / 2 - cam.x * z), DPR * (H / 2 - cam.y * z));
    const px = 1 / z;
    // the neighbourhood of what the hand is on
    if (hover && hover.node) {
      const n = hover.node;
      c.lineWidth = 1.4 * px; c.strokeStyle = "#fff"; c.globalAlpha = 0.85;
      c.beginPath();
      for (const m of neighbours[n.i]) { if (nodes[m].gone) continue; c.moveTo(n.x, n.y); c.lineTo(nodes[m].x, nodes[m].y); }
      c.stroke();
      c.globalAlpha = 1;
      c.strokeStyle = "#4f7ff0"; c.lineWidth = 2 * px;
      c.beginPath(); c.arc(n.x, n.y, n.r + 5 * px, 0, TAU); c.stroke();
    }
    // the lights along the lines
    if (intro >= 1) {
      for (const p of pulses) {
        p.t += p.v * dt;
        if (p.t > 1) { p.t = 0; p.l = links[Math.floor(Math.random() * links.length)]; }
        const A = nodes[p.l.a], Bn = nodes[p.l.b];
        if (A.gone || Bn.gone) continue;
        const x = A.x + (Bn.x - A.x) * p.t, y = A.y + (Bn.y - A.y) * p.t;
        c.globalAlpha = Math.sin(p.t * Math.PI) * 0.9;
        c.fillStyle = p.l.k === "h" ? A.col : "#fff";
        c.beginPath(); c.arc(x, y, Math.max(1.6 * px, 2), 0, TAU); c.fill();
      }
      c.globalAlpha = 1;
      // the bees, about their flowers
      const t = now / 1000;
      for (const b of bees) {
        const h = b.home;
        const nx = h.x + Math.cos(t * b.s + b.ph) * b.r + Math.sin(t * 2.3 * b.s + b.ph) * 18;
        const ny = h.y + Math.sin(t * b.s * 1.3 + b.ph) * b.r * 0.6 + Math.sin(t * 7 + b.ph) * 4;
        const dir = nx - b.x;
        b.x = nx; b.y = ny;
        drawBee(c, nx, ny, Math.max(1.4, 1.1 / Math.sqrt(z)), t + b.ph, dir);
      }
    }
    // the selection
    if (selected.size) {
      c.lineWidth = px * 1.2; c.strokeStyle = "#4f7ff0"; c.setLineDash([5 * px, 4 * px]);
      for (const s of selected) {
        if (s.node) { c.beginPath(); c.arc(s.node.x, s.node.y, s.node.r + 7 * px, 0, TAU); c.stroke(); continue; }
        const [x0, y0, x1, y1] = bboxOf(s.it);
        c.strokeRect(x0 - 6 * px, y0 - 6 * px, x1 - x0 + 12 * px, y1 - y0 + 12 * px);
      }
      c.setLineDash([]);
      const one = soleItem();
      if (one) { const [, , x1, y1] = bboxOf(one); c.fillStyle = "#fff"; c.fillRect(x1 + 6 * px - 5 * px, y1 + 6 * px - 5 * px, 10 * px, 10 * px); c.strokeRect(x1 + px, y1 + px, 10 * px, 10 * px); }
    }
    // what is being drawn
    if (action && action.preview) drawItem(c, action.preview, px);
    if (action && action.type === "marquee") {
      c.strokeStyle = "#4f7ff0"; c.fillStyle = "rgba(79,127,240,0.1)"; c.lineWidth = px;
      const [x0, y0] = action.from, [x1, y1] = action.to;
      c.fillRect(x0, y0, x1 - x0, y1 - y0); c.strokeRect(x0, y0, x1 - x0, y1 - y0);
    }
    if (action && action.type === "erase") {
      c.strokeStyle = "rgba(255,255,255,0.6)"; c.lineWidth = px;
      c.beginPath(); c.arc(action.at[0], action.at[1], ERASE / z, 0, TAU); c.stroke();
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
    if (!document.hidden && (!STILL || intro < 1 || goal.on)) kick();
  }

  // ---- WHAT IS UNDER THE HAND ------------------------------------------------
  function distToSeg(px, py, x0, y0, x1, y1) {
    const dx = x1 - x0, dy = y1 - y0, l = dx * dx + dy * dy;
    const t = l ? Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / l)) : 0;
    return Math.hypot(px - (x0 + t * dx), py - (y0 + t * dy));
  }
  function hitItem(it, x, y, tol) {
    if (it.type === "stroke") { for (let i = 0; i + 3 < it.pts.length; i += 2) if (distToSeg(x, y, it.pts[i], it.pts[i + 1], it.pts[i + 2], it.pts[i + 3]) < tol) return true; return it.pts.length === 2 && Math.hypot(x - it.pts[0], y - it.pts[1]) < tol; }
    if (it.type === "arrow") return distToSeg(x, y, it.x0, it.y0, it.x1, it.y1) < tol;
    const [x0, y0, x1, y1] = bboxOf(it);
    return x > x0 - tol && x < x1 + tol && y > y0 - tol && y < y1 + tol;
  }
  function hit(x, y) {
    const tol = 6 / cam.z;
    for (let i = items.length - 1; i >= 0; i--) if (hitItem(items[i], x, y, tol)) return { it: items[i] };
    let best = null, bd = Infinity;
    for (const n of nodes) {
      if (n.gone) continue;
      const d = Math.hypot(n.x - x, n.y - y) - n.r;
      if (d < bd) { bd = d; best = n; }
    }
    return best && bd < Math.max(4, 8 / cam.z) ? { node: best } : null;
  }

  // ---- UNDO, REDO, AND KEEPING IT ---------------------------------------------
  const undoStack = [], redoStack = [];
  function snapshot() {
    return JSON.stringify({ items, nodes: nodes.map((n) => [Math.round(n.x * 10) / 10, Math.round(n.y * 10) / 10, n.gone ? 1 : 0]), nid });
  }
  function restore(s) {
    const d = JSON.parse(s);
    items = d.items; nid = d.nid || nid;
    d.nodes.forEach((v, i) => { if (nodes[i]) { nodes[i].x = v[0]; nodes[i].y = v[1]; nodes[i].gone = !!v[2]; } });
    items.forEach(loadImage);
    selected.clear(); dirty = true; kick();
  }
  function record() { undoStack.push(snapshot()); if (undoStack.length > 80) undoStack.shift(); redoStack.length = 0; buttonsState(); }
  function changed() { dirty = true; kick(); buttonsState(); saveSoon(); }
  function undo() { if (!undoStack.length) return; redoStack.push(snapshot()); restore(undoStack.pop()); changed(); }
  function redo() { if (!redoStack.length) return; undoStack.push(snapshot()); restore(redoStack.pop()); changed(); }
  let saveT = 0;
  function saveSoon() {
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try {
        let s = snapshot();
        if (s.length > 4.5e6) s = JSON.stringify(Object.assign(JSON.parse(s), { items: items.filter((it) => it.type !== "image") }));
        localStorage.setItem(KEY, s);
      } catch (e) { /* no room, or no storage: the board is simply not kept */ }
    }, 400);
  }
  function loadImage(it) {
    if (it.type !== "image" || images.has(it.id)) return;
    const img = new Image();
    img.onload = () => { dirty = true; kick(); };
    img.src = it.src;
    images.set(it.id, img);
  }

  // ---- THE TOOLS ----------------------------------------------------------
  const ICON = {
    undo: '<path d="M9 7 5 11l4 4"/><path d="M5 11h9a5 5 0 0 1 0 10h-2"/>',
    redo: '<path d="m15 7 4 4-4 4"/><path d="M19 11h-9a5 5 0 0 0 0 10h2"/>',
    del: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    dup: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    more: '<circle cx="12" cy="6" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="18" r="1"/>',
    select: '<path d="m6 3 13 9-6 1.2L10 20z"/>',
    hand: '<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-3l-2.4-4a1.5 1.5 0 0 1 2.6-1.5L8 13"/>',
    pen: '<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="m14 6 4 4"/>',
    eraser: '<path d="M8 20h12M5 15l9-9 5 5-8 8H8z"/><path d="m10 10 5 5"/>',
    arrow: '<path d="M5 19 19 5M10 5h9v9"/>',
    text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    note: '<path d="M5 4h14v10l-6 6H5z"/><path d="M13 20v-6h6"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-5 4 4 2.5-2.5L20 17"/>',
    ellipse: '<circle cx="12" cy="12" r="8"/>',
    shapes: '<path d="m6 15 6-6 6 6"/>',
    rect: '<rect x="5" y="6" width="14" height="12" rx="1"/>',
    tri: '<path d="M12 5 20 19H4z"/>',
    star: '<path d="m12 4 2.4 5 5.4.6-4 3.8 1.1 5.4L12 16.1 7.1 18.8l1.1-5.4-4-3.8 5.4-.6z"/>',
    diamond: '<path d="M12 3 21 12 12 21 3 12z"/>',
  };
  const svg = (k) => '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + "</svg>";
  const TOOLS = [
    ["select", "Select", "V"], ["hand", "Hand", "H"], ["pen", "Pen", "P"], ["eraser", "Eraser", "E"], ["arrow", "Arrow", "A"],
    ["text", "Text", "T"], ["note", "Note", "N"], ["image", "Picture", "I"], ["ellipse", "Circle", "O"], ["shapes", "More shapes", ""],
  ];
  const SHAPES = [["rect", "Box", "R"], ["tri", "Triangle", ""], ["star", "Star", ""], ["diamond", "Diamond", ""]];
  const EDITS = [["undo", "Undo"], ["redo", "Redo"], ["del", "Delete"], ["dup", "Duplicate"], ["more", "More"]];
  const btn = (k, say, key) => '<button type="button" class="t4-btn" data-k="' + k + '" title="' + say + (key ? " — " + key : "") + '" aria-label="' + say + '">' + svg(k) + (key ? "<kbd>" + key + "</kbd>" : "") + "</button>";
  const toolRow = document.querySelector(".t4-row-tools"), editRow = document.querySelector(".t4-row-small");
  toolRow.innerHTML = TOOLS.map((t) => btn(...t)).join("");
  editRow.innerHTML = EDITS.map((t) => btn(t[0], t[1], "")).join("");
  const shapesPop = document.querySelector(".t4-shapes"), menu = document.querySelector(".t4-menu");
  shapesPop.innerHTML = SHAPES.map((t) => btn(...t)).join("");
  menu.innerHTML = '<button type="button" data-m="fit">Fit everything on the screen</button><button type="button" data-m="names">Every name</button><button type="button" data-m="png">Save as a picture</button><button type="button" data-m="clear">Rub out everything drawn</button><button type="button" data-m="reset">Reset the board</button>';
  const colours = document.querySelector(".t4-colors");
  colours.innerHTML = SWATCHES.map((col) => '<button type="button" style="background:' + col + '" data-c="' + col + '" aria-label="Colour ' + col + '"></button>').join("");
  const zoomSay = document.querySelector(".t4-zoom span");

  let tool = "select", shapeTool = "rect";
  function setTool(t) {
    if (t === "image") { fileIn.click(); return; }
    if (t === "shapes") { shapesPop.hidden = !shapesPop.hidden; menu.hidden = true; return; }
    if (SHAPES.some((s) => s[0] === t)) { shapeTool = t; shapesPop.hidden = true; }
    tool = t;
    toolRow.querySelectorAll(".t4-btn").forEach((b) => b.classList.toggle("is-on", b.dataset.k === t || (b.dataset.k === "shapes" && SHAPES.some((s) => s[0] === t))));
    shapesPop.querySelectorAll(".t4-btn").forEach((b) => b.classList.toggle("is-on", b.dataset.k === t));
    colours.hidden = !["pen", "arrow", "text", "note", "ellipse", "rect", "tri", "star", "diamond"].includes(t);
    canvas.style.cursor = t === "hand" ? "grab" : t === "select" ? "default" : t === "eraser" ? "cell" : t === "text" ? "text" : "crosshair";
    if (t !== "select") { selected.clear(); kick(); buttonsState(); }
  }
  function setColour(col) {
    colour = col;
    colours.querySelectorAll("button").forEach((b) => b.classList.toggle("is-on", b.dataset.c === col));
    const one = soleItem();
    if (one && one.type !== "image") { record(); one.col = col; changed(); }
  }
  toolRow.addEventListener("click", (e) => { const b = e.target.closest(".t4-btn"); if (b) setTool(b.dataset.k); });
  shapesPop.addEventListener("click", (e) => { const b = e.target.closest(".t4-btn"); if (b) setTool(b.dataset.k); });
  colours.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setColour(b.dataset.c); });
  editRow.addEventListener("click", (e) => {
    const b = e.target.closest(".t4-btn"); if (!b) return;
    const k = b.dataset.k;
    if (k === "undo") undo(); else if (k === "redo") redo(); else if (k === "del") removeSelected(); else if (k === "dup") duplicate();
    else if (k === "more") { menu.hidden = !menu.hidden; shapesPop.hidden = true; }
  });
  menu.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    menu.hidden = true;
    const m = b.dataset.m;
    if (m === "fit") fit(true);
    else if (m === "names") { showAll = !showAll; b.textContent = showAll ? "Fewer names" : "Every name"; dirty = true; kick(); }
    else if (m === "png") canvas.toBlob((blob) => { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "the-network-map.png"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); });
    else if (m === "clear") { record(); items = []; selected.clear(); changed(); }
    else if (m === "reset") { record(); items = []; nodes.forEach((n) => { n.x = n.hx; n.y = n.hy; n.gone = false; }); selected.clear(); changed(); fit(true); }
  });
  fileIn.addEventListener("change", () => {
    const f = fileIn.files && fileIn.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        // kept small enough to keep: drawn down to 900px at most
        const s = Math.min(1, 900 / Math.max(img.width, img.height));
        const cv = document.createElement("canvas"); cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        const src = cv.toDataURL("image/jpeg", 0.85);
        const w = Math.min(cv.width, (W * 0.4) / cam.z), h = (w * cv.height) / cv.width;
        record();
        const it = { id: nid++, type: "image", x: cam.x - w / 2, y: cam.y - h / 2, w, h, src };
        items.push(it); loadImage(it);
        selected.clear(); selected.add({ it }); setTool("select"); changed();
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
    fileIn.value = "";
  });

  // ---- SELECTION ------------------------------------------------------------
  const selected = new Set();
  const soleItem = () => (selected.size === 1 ? [...selected][0].it || null : null);
  function selectedHas(h) { for (const s of selected) if ((h.it && s.it === h.it) || (h.node && s.node === h.node)) return true; return false; }
  function removeSelected() {
    if (!selected.size) return;
    record();
    for (const s of selected) { if (s.it) items = items.filter((x) => x !== s.it); else s.node.gone = true; }
    selected.clear(); changed();
  }
  function duplicate() {
    const its = [...selected].filter((s) => s.it).map((s) => s.it);
    if (!its.length) return;
    record();
    selected.clear();
    const d = 24 / cam.z;
    its.forEach((it) => {
      const c = JSON.parse(JSON.stringify(it)); c.id = nid++;
      moveItem(c, d, d);
      if (c.type === "image") { c.src = it.src; loadImage(c); }
      items.push(c); selected.add({ it: c });
    });
    changed();
  }
  function moveItem(it, dx, dy) {
    if (it.type === "stroke") for (let i = 0; i < it.pts.length; i += 2) { it.pts[i] += dx; it.pts[i + 1] += dy; }
    else if (it.type === "arrow") { it.x0 += dx; it.x1 += dx; it.y0 += dy; it.y1 += dy; }
    else { it.x += dx; it.y += dy; }
  }
  function scaleItem(it, ox, oy, sx, sy, from) {
    // from: a copy of the item as it was when the corner was taken
    if (it.type === "stroke") for (let i = 0; i < it.pts.length; i += 2) { it.pts[i] = ox + (from.pts[i] - ox) * sx; it.pts[i + 1] = oy + (from.pts[i + 1] - oy) * sy; }
    else if (it.type === "arrow") { it.x0 = ox + (from.x0 - ox) * sx; it.x1 = ox + (from.x1 - ox) * sx; it.y0 = oy + (from.y0 - oy) * sy; it.y1 = oy + (from.y1 - oy) * sy; }
    else if (it.type === "text") it.size = Math.max(6, from.size * Math.max(sx, sy));
    else { it.w = Math.max(8, from.w * sx); it.h = Math.max(8, from.h * sy); }
  }

  // ---- THE HAND ON THE BOARD -----------------------------------------------
  let action = null, spaceDown = false;
  const ERASE = 12;
  const pointers = new Map();
  const local = (e) => [e.clientX, e.clientY];
  canvas.addEventListener("pointerdown", (e) => {
    closePops();
    if (editing) commitEdit();
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, local(e));
    if (pointers.size === 2) {   // two fingers: pinch and pan
      const [a, b] = [...pointers.values()];
      action = { type: "pinch", d: Math.hypot(a[0] - b[0], a[1] - b[1]), m: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], z: cam.z, cx: cam.x, cy: cam.y };
      return;
    }
    const [sx, sy] = local(e), [wx, wy] = toWorld(sx, sy);
    goal.on = false;
    if (spaceDown || tool === "hand" || e.button === 1) { action = { type: "pan", sx, sy, cx: cam.x, cy: cam.y }; canvas.style.cursor = "grabbing"; return; }
    if (tool === "select") {
      // the corner of the one thing chosen: resize it
      const one = soleItem();
      if (one) {
        const [x0, y0, x1, y1] = bboxOf(one), px = 1 / cam.z;
        if (Math.abs(wx - (x1 + 6 * px)) < 9 * px && Math.abs(wy - (y1 + 6 * px)) < 9 * px) {
          record();
          action = { type: "resize", it: one, ox: x0, oy: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0), from: JSON.parse(JSON.stringify(one)) };
          return;
        }
      }
      const h = hit(wx, wy);
      if (h) {
        if (!selectedHas(h)) { if (!e.shiftKey) selected.clear(); selected.add(h); }
        action = { type: "move", last: [wx, wy], moved: false };
      } else {
        if (!e.shiftKey) selected.clear();
        action = { type: "marquee", from: [wx, wy], to: [wx, wy] };
      }
      buttonsState(); kick(); return;
    }
    if (tool === "pen") { action = { type: "draw", preview: { type: "stroke", col: colour, lw: 2.4, pts: [wx, wy] } }; return; }
    if (tool === "eraser") { record(); action = { type: "erase", at: [wx, wy], any: false }; eraseAt(wx, wy); return; }
    if (tool === "arrow") { action = { type: "shape", preview: { type: "arrow", col: colour, x0: wx, y0: wy, x1: wx, y1: wy } }; return; }
    if (["ellipse", "rect", "tri", "star", "diamond"].includes(tool)) { action = { type: "shape", from: [wx, wy], preview: { type: tool, col: colour, x: wx, y: wy, w: 0, h: 0 } }; return; }
    if (tool === "text") { startEdit({ id: nid++, type: "text", col: colour, x: wx, y: wy - 10, size: Math.round(16 / cam.z), text: "" }, true); return; }
    if (tool === "note") { const w = 170 / Math.max(0.5, Math.min(2, cam.z)), h = w * 0.7; startEdit({ id: nid++, type: "note", col: colour, x: wx - w / 2, y: wy - h / 2, w, h, text: "" }, true); }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, local(e));
    const [sx, sy] = local(e), [wx, wy] = toWorld(sx, sy);
    if (!action) { hoverAt(sx, sy, wx, wy); return; }
    tip.hidden = true;
    switch (action.type) {
      case "pinch": {
        if (pointers.size < 2) return;
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a[0] - b[0], a[1] - b[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        cam.z = Math.max(0.06, Math.min(6, action.z * (d / action.d)));
        cam.x = action.cx - (m[0] - action.m[0]) / cam.z; cam.y = action.cy - (m[1] - action.m[1]) / cam.z;
        dirty = true; kick(); return;
      }
      case "pan": cam.x = action.cx - (sx - action.sx) / cam.z; cam.y = action.cy - (sy - action.sy) / cam.z; dirty = true; kick(); return;
      case "move": {
        const dx = wx - action.last[0], dy = wy - action.last[1];
        if (!action.moved) { record(); action.moved = true; }
        action.last = [wx, wy];
        for (const s of selected) { if (s.it) moveItem(s.it, dx, dy); else { s.node.x += dx; s.node.y += dy; } }
        dirty = true; kick(); return;
      }
      case "resize": {
        const sxk = Math.max(0.05, (wx - action.ox) / action.w), syk = Math.max(0.05, (wy - action.oy) / action.h);
        const k = e.shiftKey ? Math.max(sxk, syk) : null;
        scaleItem(action.it, action.ox, action.oy, k || sxk, k || syk, action.from);
        dirty = true; kick(); return;
      }
      case "marquee": action.to = [wx, wy]; kick(); return;
      case "draw": { const p = action.preview.pts; const l = p.length; if (Math.hypot(wx - p[l - 2], wy - p[l - 1]) * cam.z > 2) p.push(wx, wy); kick(); return; }
      case "erase": action.at = [wx, wy]; eraseAt(wx, wy); kick(); return;
      case "shape": {
        const it = action.preview;
        if (it.type === "arrow") { it.x1 = wx; it.y1 = wy; }
        else {
          let w = wx - action.from[0], h = wy - action.from[1];
          if (e.shiftKey) { const m = Math.max(Math.abs(w), Math.abs(h)); w = Math.sign(w || 1) * m; h = Math.sign(h || 1) * m; }
          it.x = action.from[0]; it.y = action.from[1]; it.w = w; it.h = h;
        }
        kick(); return;
      }
    }
  });
  function finish(e) {
    pointers.delete(e.pointerId);
    if (!action) return;
    const a = action;
    if (a.type === "pinch") { if (pointers.size < 2) action = null; return; }
    action = null;
    if (a.type === "pan") canvas.style.cursor = tool === "hand" ? "grab" : "default";
    if (a.type === "move" && a.moved) changed();
    if (a.type === "resize") changed();
    if (a.type === "marquee") {
      const [x0, y0] = a.from, [x1, y1] = a.to;
      const lx = Math.min(x0, x1), hx = Math.max(x0, x1), ly = Math.min(y0, y1), hy = Math.max(y0, y1);
      if (hx - lx > 2 / cam.z || hy - ly > 2 / cam.z) {
        items.forEach((it) => { const b = bboxOf(it); if (b[0] >= lx && b[2] <= hx && b[1] >= ly && b[3] <= hy) selected.add({ it }); });
        nodes.forEach((n) => { if (!n.gone && n.x >= lx && n.x <= hx && n.y >= ly && n.y <= hy) selected.add({ node: n }); });
      }
      buttonsState(); kick();
    }
    if (a.type === "draw" || a.type === "shape") {
      const it = a.preview;
      const tiny = it.type === "stroke" ? false : it.type === "arrow" ? Math.hypot(it.x1 - it.x0, it.y1 - it.y0) * cam.z < 4 : Math.abs(it.w) * cam.z < 4 && Math.abs(it.h) * cam.z < 4;
      if (!tiny) {
        if (it.w < 0) { it.x += it.w; it.w = -it.w; }
        if (it.h < 0) { it.y += it.h; it.h = -it.h; }
        record(); it.id = nid++; items.push(it); changed();
      }
      kick();
    }
    if (a.type === "erase") { if (!a.any) undoStack.pop(); buttonsState(); kick(); }
  }
  canvas.addEventListener("pointerup", finish);
  canvas.addEventListener("pointercancel", finish);
  canvas.addEventListener("pointerleave", () => { if (!action) { hover = null; tip.hidden = true; kick(); } });
  function eraseAt(x, y) {
    const tol = ERASE / cam.z;
    const before = items.length;
    items = items.filter((it) => !hitItem(it, x, y, tol));
    let any = items.length !== before;
    for (const n of nodes) if (!n.gone && Math.hypot(n.x - x, n.y - y) < n.r + tol) { n.gone = true; any = true; }
    if (any) { action.any = true; selected.clear(); dirty = true; buttonsState(); saveSoon(); }
  }
  canvas.addEventListener("dblclick", (e) => {
    const [wx, wy] = toWorld(e.clientX, e.clientY);
    const h = hit(wx, wy);
    if (h && h.it && (h.it.type === "text" || h.it.type === "note")) startEdit(h.it, false);
    else if (h && h.node) { Object.assign(goal, { x: h.node.x, y: h.node.y, z: Math.max(cam.z, 1.6), on: true }); kick(); }
  });
  function hoverAt(sx, sy, wx, wy) {
    const h = tool === "select" || tool === "hand" ? hit(wx, wy) : null;
    const same = (h && hover && h.node === hover.node && h.it === hover.it) || (!h && !hover);
    if (!same) { hover = h; kick(); }
    if (!h || !h.node) { tip.hidden = true; return; }
    const n = h.node;
    const kind = { h: "House", p: "Perfumer", f: "Perfume", n: "Note" }[n.k];
    const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
    const of = (k) => neighbours[n.i].filter((m) => nodes[m].k === k);
    let more = "";
    if (n.k === "h") more = (n.extra ? esc(n.extra) + "<br>" : "") + n.w + " perfumes";
    else if (n.k === "p") more = of("f").length + " perfumes";
    else if (n.k === "f") {
      const by = of("p").map((m) => nodes[m].label), notes = of("n").length;
      more = esc(n.house ? n.house.label : "") + (by.length ? "<br>by " + esc(by.join(", ")) : "") + (notes ? "<br>" + notes + " notes" : "");
    } else more = esc((accords.find((a) => a.code === n.extra) || {}).name) + " · in " + of("f").length + " perfumes";
    tip.innerHTML = "<b>" + esc(n.label) + "</b>" + kind + " · " + more;
    tip.hidden = false;
    tip.style.left = Math.min(W - 270, sx + 14) + "px"; tip.style.top = sy + 16 + "px";
  }

  // the wheel zooms where it is; a trackpad's two fingers pan
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    goal.on = false;
    const mouse = !e.ctrlKey && Math.abs(e.deltaX) < 1 && Math.abs(e.deltaY) >= 40 && Number.isInteger(e.deltaY);
    if (e.ctrlKey || mouse) {
      const [wx, wy] = toWorld(e.clientX, e.clientY);
      cam.z = Math.max(0.06, Math.min(6, cam.z * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018))));
      cam.x = wx - (e.clientX - W / 2) / cam.z; cam.y = wy - (e.clientY - H / 2) / cam.z;
    } else { cam.x += e.deltaX / cam.z; cam.y += e.deltaY / cam.z; }
    dirty = true; kick();
  }, { passive: false });
  document.querySelector(".t4-zoom").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    Object.assign(goal, { x: cam.x, y: cam.y, z: Math.max(0.06, Math.min(6, cam.z * (b.dataset.zoom > 0 ? 1.4 : 1 / 1.4))), on: true }); kick();
  });

  // ---- WRITING ON IT ----------------------------------------------------------
  let editing = null;
  function startEdit(it, isNew) {
    if (editing) commitEdit();
    editing = { it, isNew };
    const [sx, sy] = toScreen(it.x, it.y);
    editor.hidden = false;
    editor.textContent = it.text || "";
    editor.style.left = sx + "px"; editor.style.top = sy + "px";
    if (it.type === "note") {
      Object.assign(editor.style, { width: it.w * cam.z + "px", minHeight: it.h * cam.z + "px", padding: 10 * cam.z + "px", background: it.col, color: it.col === "#ececee" || it.col === "#e9d24a" ? "#1b1b1f" : "#fff", fontSize: 13 * cam.z + "px", lineHeight: 16 * cam.z + "px" });
    } else {
      Object.assign(editor.style, { width: "auto", minHeight: "0", padding: "2px 3px", background: "rgba(16,16,18,0.6)", color: it.col, fontSize: it.size * cam.z + "px", lineHeight: "1.2" });
    }
    dirty = true; kick();
    setTimeout(() => { editor.focus(); const r = document.createRange(); r.selectNodeContents(editor); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }, 0);
  }
  function commitEdit() {
    if (!editing) return;
    const { it, isNew } = editing;
    editing = null;
    const text = editor.innerText.replace(/\n$/, "");
    editor.hidden = true;
    if (isNew) {
      if (it.type === "text" && !text.trim()) { dirty = true; kick(); return; }
      record(); it.text = text; items.push(it);
    } else if (text !== it.text) { record(); it.text = text; }
    selected.clear(); selected.add({ it });
    changed();
  }
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey && editing && editing.it.type === "text")) { e.preventDefault(); commitEdit(); }
    e.stopPropagation();
  });
  editor.addEventListener("blur", () => setTimeout(commitEdit, 0));

  // ---- THE KEYS ---------------------------------------------------------------
  function closePops() { shapesPop.hidden = true; menu.hidden = true; }
  addEventListener("keydown", (e) => {
    if (editing || e.target.closest && e.target.closest("input, textarea, [contenteditable]")) return;
    const k = e.key.toLowerCase(), mod = e.metaKey || e.ctrlKey;
    if (mod && k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === "y") { e.preventDefault(); redo(); return; }
    if (mod && k === "d") { e.preventDefault(); duplicate(); return; }
    if (mod) return;
    if (k === " ") { spaceDown = true; canvas.style.cursor = "grab"; e.preventDefault(); return; }
    if (k === "delete" || k === "backspace") { removeSelected(); return; }
    if (k === "escape") { selected.clear(); closePops(); setTool("select"); return; }
    const map = { v: "select", h: "hand", p: "pen", d: "pen", e: "eraser", a: "arrow", t: "text", n: "note", i: "image", o: "ellipse", r: "rect" };
    if (map[k]) setTool(map[k]);
  });
  addEventListener("keyup", (e) => { if (e.key === " ") { spaceDown = false; setTool(tool); } });

  function buttonsState() {
    editRow.querySelector('[data-k="undo"]').disabled = !undoStack.length;
    editRow.querySelector('[data-k="redo"]').disabled = !redoStack.length;
    editRow.querySelector('[data-k="del"]').disabled = !selected.size;
    editRow.querySelector('[data-k="dup"]').disabled = ![...selected].some((s) => s.it);
  }

  // ---- BEGIN --------------------------------------------------------------
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => { last = 0; kick(); });
  resize();
  try { const kept = localStorage.getItem(KEY); if (kept) restore(kept); } catch (e) { /* nothing kept */ }
  fit(false);
  setTool("select");
  setColour(SWATCHES[1]);
  buttonsState();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { dirty = true; kick(); });
  kick();

  window.TestPage4 = {
    items: () => items.map((it) => it.type),
    texts: () => items.map((it) => it.text || ""),
    selected: () => selected.size,
    zoom: () => cam.z,
    gone: () => nodes.filter((n) => n.gone).length,
    tool: () => tool,
    toScreen: (x, y) => toScreen(x, y),
    node: (label) => { const n = nodes.find((m) => m.label === label); return n && { x: n.x, y: n.y }; },
  };
})();

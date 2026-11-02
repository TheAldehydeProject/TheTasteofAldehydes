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
// Point at a dome or an accord and everything else steps back.
//
// KEPT SMOOTH: the bands, the ticks and every word are drawn once into a
// picture of their own (`still`), again only when the window or what is
// pointed at changes; a frame lays that down and draws the domes and the
// lights over it. With motion reduced: drawn once, nothing turning.
// ============================================================
(function () {
  "use strict";

  // a snapshot of the site's houses and the Note Library's accords, 2026-11-02
  const DATA = {"houses": [{"id": "pineward", "name": "Pineward", "from": "United States", "founded": "2020", "sub": "The House That Smells Like Trees", "n": 48, "notes": 183, "share": {"GRN": 26, "CIT": 19, "CON": 52, "ANI": 23, "WOO": 57, "ARO": 25, "RES": 30, "EAR": 31, "SMK": 5, "GOU": 62, "BRW": 13, "IMP": 5, "FLO": 21, "SPI": 27, "FRU": 19, "AIR": 4}, "top": "Gourmand"}, {"id": "grande-parfums", "name": "Grande Parfums", "from": "Romania", "founded": "2021", "sub": "Art Niche Expo 2026", "n": 15, "notes": 111, "share": {"FRU": 24, "SPI": 20, "GRN": 5, "GOU": 32, "FLO": 38, "BRW": 11, "ANI": 22, "WOO": 34, "RES": 31, "ARO": 2, "IMP": 3, "CIT": 11, "CON": 1, "EAR": 2}, "top": "Floral"}, {"id": "individual", "name": "Individual fragrances", "from": "", "founded": "", "sub": "", "n": 13, "notes": 101, "share": {"GOU": 16, "FRU": 6, "CIT": 10, "SPI": 16, "WOO": 27, "SMK": 3, "FLO": 17, "GRN": 4, "EAR": 2, "RES": 19, "ARO": 12, "CON": 7, "ANI": 9, "AIR": 4, "IMP": 1, "BRW": 1}, "top": "Woods"}, {"id": "adar", "name": "ADAR", "from": "Romania", "founded": "", "sub": "The House That You Have Never Heard of", "n": 11, "notes": 71, "share": {"GRN": 3, "SPI": 6, "AIR": 5, "FLO": 14, "EAR": 5, "RES": 9, "WOO": 10, "ANI": 7, "CIT": 5, "ARO": 3, "GOU": 13, "IMP": 2, "FRU": 4, "BRW": 1, "CON": 1, "SMK": 2}, "top": "Floral"}, {"id": "om-parfums", "name": "Om Parfums", "from": "Taiwan", "founded": "2021", "sub": "The Olfaction of Om", "n": 9, "notes": 75, "share": {"BRW": 5, "FRU": 9, "SPI": 3, "GOU": 17, "WOO": 29, "RES": 12, "EAR": 3, "ANI": 9, "SMK": 2, "IMP": 1, "GRN": 2, "FLO": 13, "ARO": 3, "CON": 1, "CIT": 2}, "top": "Woods"}, {"id": "apoteker-tepe", "name": "Apoteker Tepe", "from": "United States", "founded": "2014", "sub": "The Apothecary on the Hill", "n": 8, "notes": 43, "share": {"CIT": 2, "FRU": 1, "SPI": 2, "WOO": 10, "CON": 8, "EAR": 5, "RES": 7, "SMK": 3, "ARO": 3, "ANI": 2, "IMP": 1, "FLO": 5, "BRW": 1, "GOU": 1, "GRN": 1}, "top": "Woods"}, {"id": "lost-tribe", "name": "Lost Tribe", "from": "United States", "founded": "2022", "sub": "A House of Notable Quality", "n": 6, "notes": 44, "share": {"WOO": 13, "RES": 10, "GOU": 7, "ANI": 6, "FLO": 7, "SPI": 6, "CIT": 6, "ARO": 6, "CON": 5, "EAR": 3, "IMP": 1}, "top": "Woods"}, {"id": "almost-human", "name": "Almost Human", "from": "Romania", "founded": "2025", "sub": "Abstraction Done Quite Well", "n": 5, "notes": 20, "share": {"WOO": 2, "SMK": 3, "SPI": 1, "CIT": 1, "AIR": 5, "ANI": 2, "RES": 3, "EAR": 5, "FLO": 1, "ARO": 1, "GRN": 1}, "top": "Water & Air"}, {"id": "ataraxia", "name": "Ataraxia", "from": "", "founded": "", "sub": "A Gothic Avante Garde House", "n": 5, "notes": 43, "share": {"BRW": 3, "GOU": 18, "IMP": 4, "FLO": 6, "FRU": 4, "RES": 7, "WOO": 2, "GRN": 1, "SMK": 1, "AIR": 1, "SPI": 2}, "top": "Gourmand"}, {"id": "outsider-parfums", "name": "Outsider Parfums", "from": "", "founded": "", "sub": "The Sister House of Om", "n": 5, "notes": 53, "share": {"EAR": 6, "ARO": 3, "FLO": 7, "SPI": 3, "SMK": 3, "GOU": 10, "WOO": 15, "RES": 2, "BRW": 5, "FRU": 1, "AIR": 2, "ANI": 9, "GRN": 1, "CIT": 4, "CON": 1}, "top": "Woods"}, {"id": "tombstone", "name": "Tombstone", "from": "", "founded": "", "sub": "A House That Expanded on Death", "n": 5, "notes": 28, "share": {"FLO": 11, "SMK": 1, "GRN": 1, "CIT": 1, "RES": 4, "EAR": 1, "WOO": 5, "ANI": 1, "ARO": 3, "SPI": 2, "GOU": 2, "FRU": 1, "AIR": 1}, "top": "Floral"}, {"id": "les-abstraits", "name": "Les Abstraits", "from": "", "founded": "", "sub": "Eugen’s Ideas and Antoine Lie’s Execution", "n": 4, "notes": 45, "share": {"FLO": 9, "SPI": 10, "GOU": 4, "RES": 6, "ANI": 6, "WOO": 7, "SMK": 2, "GRN": 2, "ARO": 4, "EAR": 2, "CIT": 2, "CON": 1}, "top": "Spice"}, {"id": "qimu-musicians", "name": "Qimu & Musicians", "from": "", "founded": "", "sub": "A House of Music and Fragrance", "n": 4, "notes": 6, "share": {"ARO": 1, "FLO": 3, "SPI": 1, "ANI": 1}, "top": "Floral"}, {"id": "tale-parfums", "name": "Tale Parfums", "from": "United States", "founded": "", "sub": "", "n": 4, "notes": 0, "share": {}, "top": ""}], "accords": [{"code": "CIT", "name": "Citrus", "say": "Peel oils: the brightest, quickest notes, gone first.", "notes": [["Bergamot", 15], ["Lemon", 8], ["Citrus", 7], ["Orange", 7], ["Lime", 6], ["Blood Orange", 4], ["Yuzu", 3], ["Clementine", 3], ["Grapefruit", 3], ["Bitter Orange", 2], ["Petitgrain", 2], ["Citron", 1], ["Green Mandarin", 1], ["Tangerine", 1]]}, {"code": "ARO", "name": "Aromatic & Herbal", "say": "Kitchen and hillside herbs: clean, camphorous, bitter-green.", "notes": [["Lavender", 13], ["Mint", 11], ["Clary Sage", 6], ["Rosemary", 4], ["Juniper Berry", 3], ["Chamomile", 3], ["Thyme", 3], ["Sage", 2], ["Myrtle", 2], ["Eucalyptus", 2], ["Shiso", 2], ["Hops", 1], ["Davana", 1], ["Yarrow", 1], ["Lemon Verbena", 1], ["Herbal Notes", 1], ["Artemisia", 1], ["Mint-Sandalwood Co-Distillation", 1], ["Huang Qi", 1], ["Angelica Root", 1], ["Kuromoji", 1], ["Wormwood", 1], ["Basil", 1], ["Marjoram", 1], ["Oregano", 1], ["Dittany of Crete", 1]]}, {"code": "GRN", "name": "Green", "say": "Leaves, stems, grass and hay: the smell of plants rather than flowers.", "notes": [["Hay", 8], ["Violet Leaf", 5], ["Galbanum", 4], ["Poplar Bud", 3], ["Sweetgrass", 3], ["Tomato Leaf", 3], ["Grass", 2], ["Ivy", 2], ["Green Notes", 2], ["Sugar Cane", 2], ["Raspberry Leaf", 2], ["Cannabis", 2], ["Crushed Leaves", 1], ["Sweet Vernalgrass", 1], ["Watercress", 1], ["Green Wheat", 1], ["Rhubarb", 1], ["Corn Silk", 1], ["Corn Silage", 1], ["Fig Leaf", 1], ["Pea", 1]]}, {"code": "FLO", "name": "Floral", "say": "Petals and blossoms, real and reconstructed.", "notes": [["Rose", 20], ["Jasmine", 18], ["Orris", 15], ["Neroli", 9], ["Lily of the Valley", 9], ["Orange Blossom", 8], ["Ylang Ylang", 7], ["Geranium", 6], ["Osmanthus", 5], ["Tuberose", 5], ["Heliotrope", 4], ["Gardenia", 4], ["Violet", 4], ["Carnation", 3], ["Waterlily", 3], ["Champaca", 2], ["Marigold", 2], ["Tiare Flower", 2], ["Linden Blossom", 2], ["Mimosa", 2], ["Goldenrod", 1], ["White Lotus", 1], ["Bluebell", 1], ["Alpine Sandwort", 1], ["Azure Bluet", 1], ["Mountain Wildflowers", 1], ["Honeysuckle", 1], ["Green Tea Flowers", 1], ["Clear Orchid", 1], ["Passionflower", 1], ["Snowdrops", 1], ["Nectar", 1], ["Plum Blossom", 1], ["Yellow Flowers", 1], ["Freesia", 1], ["Magnolia", 1], ["Tobacco Flower", 1], ["Jonquil", 1], ["Lilac", 1], ["Lily", 1], ["Chrysanthemum", 1], ["Night Blooming Jasmine", 1]]}, {"code": "FRU", "name": "Fruit", "say": "Flesh, juice and jam.", "notes": [["Cherry", 7], ["Raspberry", 6], ["Dried Fruits", 6], ["Plum", 5], ["Apricot", 4], ["Apple", 4], ["Peach", 4], ["Strawberry", 3], ["Pear", 3], ["Blackberry", 2], ["Cranberry", 2], ["Green Apple", 2], ["Passionfruit", 2], ["Mango", 2], ["Litchi", 2], ["Banana", 2], ["Dates", 2], ["Cassis", 1], ["Quince", 1], ["Maninka", 1], ["Japanese Plum", 1], ["Goldenberry", 1], ["Red Berries", 1], ["Blueberry", 1], ["Fig", 1], ["Scorched Pineapple", 1], ["Guava", 1], ["Fruity Notes", 1]]}, {"code": "SPI", "name": "Spice", "say": "Seeds, barks, roots and peppers: heat, warmth and bite.", "notes": [["Clove", 16], ["Saffron", 13], ["Ginger", 10], ["Cinnamon", 10], ["Spices", 8], ["Nutmeg", 7], ["Black Pepper", 6], ["Pink Pepper", 6], ["Cardamom", 5], ["Coriander", 3], ["Anise", 2], ["Cumin", 2], ["Allspice", 2], ["Cassia", 2], ["Turmeric", 2], ["Water Pepper", 1], ["Fenugreek", 1], ["Paprika", 1], ["Sichuan Pepper", 1], ["Caraway", 1]]}, {"code": "GOU", "name": "Gourmand", "say": "Things you could eat: sweets, grains, nuts, pastry.", "notes": [["Vanilla", 34], ["Tobacco", 25], ["Tonka", 18], ["Honey", 13], ["Beeswax", 10], ["Cacao", 10], ["Chocolate", 9], ["Brown Sugar", 4], ["Almond", 4], ["Milk", 4], ["Caramel", 4], ["Oat", 3], ["Wheat", 3], ["Hazelnut", 3], ["Baked Apple", 2], ["Molasses", 2], ["Black Walnut", 2], ["Butter", 2], ["Butterscotch", 2], ["Coumarin", 2], ["Cocoa Butter", 2], ["Bread", 1], ["Seed Cake", 1], ["Maple", 1], ["Barley", 1], ["Icing", 1], ["Sugar", 1], ["Malt", 1], ["Raisin Cookies", 1], ["Pumpkin", 1], ["Rice", 1], ["Carob Pods", 1], ["Murumuru Butter", 1], ["Holy Bread", 1], ["Honeycomb", 1], ["Chantilly Cream", 1], ["Condensed Milk", 1], ["Toffee", 1], ["Cheese", 1], ["Coconut Milk", 1], ["Chocolate Cake", 1], ["Dulce de Leche", 1], ["Cream", 1], ["Popcorn", 1], ["Balsamic Vinegar", 1]]}, {"code": "BRW", "name": "Brews & Spirits", "say": "Teas, coffee and what is poured from a bottle.", "notes": [["Rum", 5], ["Tea", 4], ["Coffee", 4], ["Whiskey", 4], ["Maté", 3], ["Cognac", 3], ["Lapsang Souchong", 2], ["Green Tea", 2], ["Amaretto", 2], ["Liquor", 2], ["Oolong Tea", 1], ["Herbal Tea", 1], ["Cola", 1], ["Absinthe", 1], ["Masala Chai", 1], ["Sparkling Water", 1], ["Jasmine Tea", 1], ["Moroccan Tea", 1], ["Cocktail Accord", 1]]}, {"code": "WOO", "name": "Woods", "say": "Heartwood, bark and sawdust.", "notes": [["Cedarwood", 38], ["Sandalwood", 35], ["Patchouli", 34], ["Vetiver", 27], ["Oud", 20], ["Guaiac Wood", 10], ["Woody Notes", 7], ["Oak", 6], ["Cypriol", 5], ["Cashmeran", 5], ["Birch", 3], ["Mahogany", 2], ["Amberwood", 2], ["Amyris", 2], ["Pineboard", 1], ["Sawdust", 1], ["Edelwood Oil", 1], ["Amber Oud", 1], ["Petrified Driftwood", 1], ["Teak Wood", 1], ["Bark", 1], ["Cabreuva", 1], ["Oak Barrel", 1], ["Buddhawood", 1], ["Iso E Super", 1], ["Willow Bark", 1], ["Moldy Cedarwood", 1], ["Siam Wood", 1], ["Muhuhu", 1]]}, {"code": "CON", "name": "Conifers", "say": "Needles, cones and the trees that carry them.", "notes": [["Fir", 21], ["Pine", 14], ["Pine Needles", 12], ["Juniper", 9], ["Cypress", 7], ["Spruce", 3], ["Hinoki", 3], ["Black Hemlock", 2], ["Larch Cones", 1], ["Tamarack", 1], ["Snoqualmie Forest Evergreens", 1], ["Cedar Leaf", 1], ["Nootka", 1], ["Hiba", 1]]}, {"code": "RES", "name": "Resins & Balsams", "say": "What trees weep: incense, amber and balm.", "notes": [["Amber", 22], ["Benzoin", 20], ["Labdanum", 16], ["Frankincense", 15], ["Myrrh", 13], ["Incense", 10], ["Resins", 8], ["Opoponax", 6], ["Tolu Balsam", 5], ["Peru Balsam", 5], ["Styrax", 4], ["Sandarac", 2], ["Elemi", 2], ["Bakhoor", 2], ["Balsam", 1], ["Propolis", 1], ["Rum Resin", 1], ["Ponderosa Resin", 1], ["Dragon's Blood", 1], ["Sawn Resin", 1], ["Copaiba Balsam", 1], ["Turpentine", 1], ["Copal", 1], ["Bushman Candle Resin", 1]]}, {"code": "ANI", "name": "Musk, Skin & Animalic", "say": "Musks, leathers and the warmth of bodies.", "notes": [["Musk", 32], ["Ambergris", 15], ["Leather", 13], ["Castoreum", 9], ["Civet", 7], ["Ambrette", 4], ["Costus", 4], ["Suede", 3], ["Skin", 2], ["Animal Notes", 2], ["Sheep Wool", 1], ["Lanolin", 1], ["Botanical Musk", 1], ["Hyrax", 1], ["Goat Hair", 1], ["Skunk Oil", 1]]}, {"code": "EAR", "name": "Earth, Moss & Mineral", "say": "Soil, moss, fungus and stone.", "notes": [["Oakmoss", 26], ["Soil", 8], ["Moss", 5], ["Mushroom", 4], ["Lichen", 2], ["Spikenard", 2], ["Peat", 2], ["Treemoss", 2], ["Cedarmoss", 2], ["Mineral Accord", 2], ["Damp Vegetation", 1], ["Swamp Water", 1], ["Wet Stone", 1], ["Petrichor", 1], ["Sand", 1], ["Dust", 1], ["Concrete", 1], ["Lava", 1], ["Metallic Notes", 1], ["Evernyl", 1]]}, {"code": "AIR", "name": "Water & Air", "say": "Sea, rain, steam and open sky.", "notes": [["Seaweed", 5], ["Ozone", 2], ["Marine Accord", 2], ["Sea Salt", 2], ["Aquatic Notes", 2], ["Solar Notes", 2], ["Airy Note", 2], ["Sea Water", 1], ["Cold Night Air", 1], ["Rain Notes", 1], ["Dead Water", 1], ["Aldehydes", 1]]}, {"code": "SMK", "name": "Smoke & Char", "say": "Fire, tar and what burning leaves behind.", "notes": [["Smoke", 13], ["Birch Tar", 5], ["Cade Oil", 2], ["Smouldering Logs", 1], ["Palo Santo", 1], ["Ash", 1], ["Pine Tar", 1], ["Pine Smoke", 1]]}, {"code": "IMP", "name": "Impressions", "say": "Notes that are not materials: objects, places, feelings, named by a house.", "notes": [["CO2 Extracts", 3], ["Aged Parchment", 2], ["Paper", 2], ["Candle Wax", 2], ["Decayed Rose", 1], ["Westfarthing Leaf", 1], ["Mousse de Saxe", 1], ["Dusty Sofa", 1], ["Gold", 1], ["Dusty Antiques", 1], ["Powder Accord", 1], ["Underground Tunnel", 1], ["Oriental Notes", 1]]}]};

  const host = document.querySelector(".t2");
  const canvas = document.querySelector(".t2-arc");
  const ctx = canvas.getContext("2d");
  const tip = document.querySelector(".t2-tip");
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const ACC = {}; DATA.accords.forEach((a, i) => { a.i = i; ACC[a.code] = a; });
  const houses = DATA.houses;
  const totalNotes = DATA.accords.reduce((s, a) => s + a.notes.length, 0);

  // the glossary down the left, from the accords themselves
  const gloss = document.querySelector(".t2-gloss");
  DATA.accords.forEach((a) => {
    const li = document.createElement("li");
    li.dataset.code = a.code;
    li.innerHTML = "<b>" + a.code + "</b><i>" + a.name + "</i> — " + a.say + " <span>(" + a.notes.length + ")</span>";
    gloss.appendChild(li);
  });

  // ---- THE LAYOUT -------------------------------------------------------
  let W = 0, H = 0, DPR = 1, narrow = false;
  const G = { cx: 0, cy: 0, rd: 0, rb0: 0, rb1: 0, rt: 0, ra: 0, th: 0, dome: 20, left: 0 };
  const still = document.createElement("canvas");
  const sctx = still.getContext("2d");
  function layout() {
    const b = canvas.getBoundingClientRect();
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
  const at = (r, a) => [G.cx + Math.cos(a) * r, G.cy + Math.sin(a) * r];
  // where each accord's name stands: at its stretch's middle, pushed apart
  // until no two are nearer than a line of type
  function placeNames() {
    const want = DATA.accords.map((a, i) => accordMid(i));
    const got = want.slice(), gap = (narrow ? 13 : 17) / G.ra;
    for (let it = 0; it < 80; it++) {
      for (let i = 1; i < got.length; i++) {
        const d = got[i] - got[i - 1];
        if (d < gap) { const push = (gap - d) / 2; got[i] += push; got[i - 1] -= push; }
      }
      for (let i = 0; i < got.length; i++) got[i] += (want[i] - got[i]) * 0.02;
    }
    return got;
  }

  // ---- THE STILL PICTURE: bands, ticks, words ----------------------------
  let stillDirty = true, focus = null;    // focus: { house } or { accord }
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
  function drawStill() {
    stillDirty = false;
    const c = sctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#0b0b16";
    c.fillRect(0, 0, still.width, still.height);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
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
    c.lineWidth = 0.6;
    for (let i = 1; i < 12; i++) {
      const r = G.rb0 + (G.rt - G.rb0) * (i / 12);
      c.strokeStyle = "rgba(236,233,244," + (0.05 + 0.03 * (i % 3 === 0)) + ")";
      c.beginPath(); c.arc(G.cx, G.cy, r, -G.th * 1.12, G.th * 1.12); c.stroke();
    }
    // the ticks, a note each, and its name tiny past it
    const hot = focus && focus.house ? focus.house.share : null;
    const fa = focus && focus.accord != null ? focus.accord : -1;
    c.font = '400 5.2px "IBM Plex Mono", monospace';
    c.textBaseline = "middle";
    let lastNamed = -10;
    const names = placeNames();
    DATA.accords.forEach((a, ai) => {
      const lit = fa === ai || (hot && hot[a.code]);
      const dim = (focus && !lit) ? 0.25 : 1;
      a.notes.forEach(([name, u], ni) => {
        const ang = noteAngle(ai, ni);
        const len = 6 + Math.min(34, u * 1.6);
        const [x0, y0] = at(G.rt - len, ang), [x1, y1] = at(G.rt, ang);
        c.strokeStyle = lit ? "rgba(255,226,170,0.95)" : "rgba(236,232,255,0.42)";
        c.globalAlpha = dim;
        c.lineWidth = lit ? 1 : 0.8;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        const named = lit && focus ? true : u >= 12;
        const minGap = 6.5 / G.rt;
        if (named && (lit && focus ? true : ang - lastNamed > minGap)) {
          lastNamed = ang;
          c.save();
          const [tx, ty] = at(G.rt + 4, ang);
          c.translate(tx, ty); c.rotate(ang);
          c.fillStyle = lit ? "rgba(255,236,200,0.95)" : "rgba(236,232,255,0.5)";
          c.fillText(name, 0, 0);
          c.restore();
        }
      });
      c.globalAlpha = 1;
      // the accord's name round the outside, and a bracket over its stretch
      const a0 = noteAngle(ai, 0) - 0.003, a1 = noteAngle(ai, a.notes.length - 1) + 0.003;
      c.strokeStyle = lit ? "rgba(40,20,60,0.9)" : "rgba(40,32,70,0.45)";
      c.lineWidth = 0.8;
      c.beginPath(); c.arc(G.cx, G.cy, G.ra - 22, a0, a1); c.stroke();
      const mid = accordMid(ai), la = names[ai];
      const [m0x, m0y] = at(G.ra - 22, mid), [m1x, m1y] = at(G.ra, la);
      c.strokeStyle = "rgba(36,24,58,0.35)"; c.lineWidth = 0.6;
      c.beginPath(); c.moveTo(m0x, m0y); c.lineTo(m1x, m1y); c.stroke();
      const [mx, my] = at(G.ra + 4, la);
      c.save();
      c.translate(mx, my); c.rotate(la);
      c.textBaseline = "middle";
      c.font = (lit ? "700 " : "600 ") + (narrow ? 8.5 : 11) + 'px Archivo, sans-serif';
      c.fillStyle = lit ? "#24123a" : "rgba(36,24,58," + (focus ? 0.4 : 0.85) + ")";
      c.fillText(a.name, 0, 0);
      const w = c.measureText(a.name).width;
      c.font = '500 7px "IBM Plex Mono", monospace';
      c.fillStyle = "rgba(36,24,58,0.55)";
      c.fillText(a.code + " · " + a.notes.length, w + 6, 0.5);
      c.restore();
      // a small mark where it begins
      const [px, py] = at(G.ra - 22, a0);
      c.fillStyle = "rgba(36,24,58,0.8)";
      c.fillRect(px - 1.5, py - 1.5, 3, 3);
    });
    // the houses' words, beside their domes
    houses.forEach((h, i) => {
      const ang = angleOfHouse(i);
      const [x, y] = at(G.rd, ang);
      const lit = !focus || focus.house === h || (focus.accord != null && h.share[DATA.accords[focus.accord].code]);
      c.globalAlpha = lit ? 1 : 0.3;
      c.textAlign = "right";
      c.font = '400 7px "IBM Plex Mono", monospace';
      c.fillStyle = "#8f8aa6";
      const tx = x - G.dome * 1.35 - 8;
      if (!narrow || W > 600) {
        const where = [h.from, h.founded].filter(Boolean).join(" · ");
        if (where) c.fillText(where.toUpperCase(), tx, y - 20);
        c.font = '700 9.5px Archivo, sans-serif'; c.fillStyle = "#ece9f4";
        c.fillText(h.name.toUpperCase(), tx, y - 9);
        c.font = '400 7px "IBM Plex Mono", monospace'; c.fillStyle = "#8f8aa6";
        const rows = [["Fragrances", h.n], ["Notes", h.notes || "—"], ["Top accord", h.top || "—"]];
        rows.forEach(([k, v], r) => {
          c.fillText(k, tx - 54, y + 3 + r * 9);
          c.fillStyle = "#ece9f4"; c.fillText(String(v), tx, y + 3 + r * 9); c.fillStyle = "#8f8aa6";
        });
      }
      c.globalAlpha = 1;
    });
    c.textAlign = "left";
    // the year's name, faint, along the domes' ring
    c.save();
    const [yx, yy] = at(G.rd + G.dome * 1.6, G.th + 0.02);
    c.translate(yx, yy); c.rotate(G.th + 0.02 + Math.PI / 2);
    c.font = '500 7px "IBM Plex Mono", monospace'; c.fillStyle = "#5b5772";
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
    c.lineWidth = 0.8;
    c.beginPath(); c.ellipse(x, y, r, r * st, 0, 0, TAU); c.stroke();
    c.fillStyle = "rgba(140,120,200,0.08)"; c.fill();
    // latitude rings (front halves brighter)
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
        const el = (k / 12) * Math.PI;   // over the top, side to side
        const px = Math.cos(el) * Math.cos(az), pz = Math.cos(el) * Math.sin(az), py = Math.sin(el);
        const [sx, sy] = P(px, py, pz);
        k ? c.lineTo(sx, sy) : c.moveTo(sx, sy);
      }
      c.stroke();
    }
    // the path over it, as high as the house has fragrances, and a light on it
    const peak = 0.25 + 0.7 * h;
    c.strokeStyle = hi ? "#fff" : "rgba(255,250,240,0.85)";
    c.lineWidth = hi ? 1.3 : 1;
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
    c.beginPath(); c.arc(lx, ly, 2.2, 0, TAU); c.fill();
    c.fillStyle = "rgba(255,255,255,0.18)";
    c.beginPath(); c.arc(lx, ly, 6, 0, TAU); c.fill();
    // the pin at its heart
    c.fillStyle = hi ? "#eba33f" : "rgba(236,233,244,0.9)";
    c.beginPath(); c.moveTo(x, y - 2); c.arc(x, y - r * 0.32, r * 0.11, Math.PI * 0.75, Math.PI * 2.25); c.closePath(); c.fill();
    c.globalAlpha = 1;
  }

  // ---- THE FRAME -------------------------------------------------------
  const maxN = Math.max(...houses.map((h) => h.n));
  let born = performance.now();
  function frame(now) {
    raf = 0;
    if (stillDirty) drawStill();
    const t = STILL ? 0 : (now - born) / 1000;
    const intro = STILL ? 1 : Math.min(1, (now - born) / 1800);
    const c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(still, 0, 0);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);

    // the bands breathe: a soft light travelling round them
    if (!STILL) {
      const a = -G.th + ((t * 0.04) % 1) * 2 * G.th * 1.3 - 0.15 * G.th;
      const g = c.createRadialGradient(...at(G.rb0 + (G.rt - G.rb0) * 0.5, a), 0, ...at(G.rb0 + (G.rt - G.rb0) * 0.5, a), H * 0.35);
      g.addColorStop(0, "rgba(255,240,255,0.10)"); g.addColorStop(1, "rgba(255,240,255,0)");
      c.fillStyle = g;
      c.beginPath(); c.arc(G.cx, G.cy, G.rt + 4, -Math.PI / 2, Math.PI / 2); c.arc(G.cx, G.cy, G.rb0, Math.PI / 2, -Math.PI / 2, true); c.fill();
    }

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
        c.lineWidth = hiH ? 0.9 + share * 6 : 0.5 + share * 2.4;
        c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, x + (ex - x) * k, y + (ey - y) * k); c.stroke();
        // a light running out along it
        if (!STILL && lit && k >= 1) {
          const s = (t * (0.18 + share) + i * 0.13 + a.i * 0.07) % 1;
          const qx = (1 - s) * (1 - s) * x + 2 * (1 - s) * s * mx + s * s * ex, qy = (1 - s) * (1 - s) * y + 2 * (1 - s) * s * my + s * s * ey;
          c.globalAlpha = Math.min(1, 0.15 + share * 3) * Math.sin(s * Math.PI) * (focus ? 1 : 0.7);
          c.fillStyle = "#fff";
          c.fillRect(qx - 1.2, qy - 1.2, 2.4, 2.4);
        }
        // the pill where it lands, for what is pointed at
        if (hiH) {
          c.globalAlpha = 1;
          c.fillStyle = "rgba(255,250,244,0.95)";
          const pw = 26, ph = 9;
          c.save(); c.translate(ex, ey); c.rotate(ang2);
          c.beginPath(); c.roundRect ? c.roundRect(-pw / 2, -ph / 2, pw, ph, 4) : c.rect(-pw / 2, -ph / 2, pw, ph); c.fill();
          c.fillStyle = "#24123a"; c.font = '500 6px "IBM Plex Mono", monospace'; c.textAlign = "center"; c.textBaseline = "middle";
          c.fillText(code + " " + h.share[code], 0, 0.5);
          c.restore(); c.textAlign = "left";
        }
      }
    });
    c.globalAlpha = 1;

    // the domes
    houses.forEach((h, i) => {
      const k = Math.max(0, Math.min(1, intro * 2 - i * 0.06));
      if (k <= 0) return;
      const ang = angleOfHouse(i);
      const [x, y] = at(G.rd, ang);
      const hi = focus && focus.house === h;
      const dim = focus && !hi && !(focus.accord != null && h.share[DATA.accords[focus.accord].code]);
      const e = 1 - Math.pow(1 - k, 3);
      dome(c, x, y + 6, G.dome * (0.6 + 0.4 * e) * (hi ? 1.12 : 1), h.n / maxN, t * (0.25 + 0.04 * i) + i, (dim ? 0.3 : 1) * e, hi);
    });
    if (!STILL && !document.hidden) kick();
  }
  let raf = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  // ---- WHAT IS POINTED AT -------------------------------------------------
  function pick(mx, my) {
    for (let i = 0; i < houses.length; i++) {
      const [x, y] = at(G.rd, angleOfHouse(i));
      if (Math.hypot(mx - x, my - y - 4) < G.dome * 1.4 || (mx < x && mx > x - G.dome * 1.4 - 150 && Math.abs(my - y) < 22)) return { house: houses[i] };
    }
    const r = Math.hypot(mx - G.cx, my - G.cy), ang = Math.atan2(my - G.cy, mx - G.cx);
    if (r > G.rt - 46 && r < G.ra + 120) {
      const names = placeNames(), onName = r > G.ra - 10;
      for (let ai = 0; ai < DATA.accords.length; ai++) {
        const a0 = noteAngle(ai, 0) - 0.01, a1 = noteAngle(ai, DATA.accords[ai].notes.length - 1) + 0.01;
        const nameHit = onName && Math.abs(ang - names[ai]) < (narrow ? 6 : 8) / G.ra;
        if ((!onName && ang >= a0 && ang <= a1) || nameHit) {
          // the note under it, for the tip
          const a = DATA.accords[ai];
          let best = 0, bd = 1;
          a.notes.forEach((nn, ni) => { const d = Math.abs(noteAngle(ai, ni) - ang); if (d < bd) { bd = d; best = ni; } });
          return { accord: ai, note: r > G.rt - 46 && r < G.rt + 60 ? a.notes[best] : null };
        }
      }
    }
    return null;
  }
  function same(a, b) { return (!a && !b) || (a && b && a.house === b.house && a.accord === b.accord); }
  function setFocus(f) {
    if (same(f, focus)) return;
    focus = f; stillDirty = true; kick();
    gloss.querySelectorAll("li").forEach((li) => {
      const code = li.dataset.code;
      li.classList.toggle("is-lit", !!f && ((f.accord != null && DATA.accords[f.accord].code === code) || (f.house && f.house.share[code])));
    });
  }
  canvas.addEventListener("pointermove", (e) => {
    const b = canvas.getBoundingClientRect(), mx = e.clientX - b.left, my = e.clientY - b.top;
    const f = pick(mx, my);
    setFocus(f && { house: f.house, accord: f.accord });
    canvas.style.cursor = f ? "pointer" : "default";
    if (!f) { tip.hidden = true; return; }
    let html;
    if (f.house) {
      const h = f.house;
      html = "<b>" + h.name + "</b>" + (h.sub ? h.sub + "<br>" : "") + h.n + " fragrances · " + (h.notes ? h.notes + " notes" : "no notes found yet") + (h.top ? "<br>most in " + h.top : "");
    } else {
      const a = DATA.accords[f.accord];
      const users = houses.filter((h) => h.share[a.code]).length;
      html = "<b>" + a.name + "</b>" + a.say + "<br>" + a.notes.length + " notes · in " + users + " houses" + (f.note ? "<br>" + f.note[0] + " · named by " + f.note[1] : "");
    }
    tip.innerHTML = html;
    tip.hidden = false;
    const hb = host.getBoundingClientRect();
    let x = e.clientX - hb.left + 14, y = e.clientY - hb.top + 14;
    if (x + 250 > hb.width) x -= 270;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  });
  canvas.addEventListener("pointerleave", () => { setFocus(null); tip.hidden = true; });
  // pressed, it stays; pressed again, it goes
  canvas.addEventListener("click", (e) => {
    const b = canvas.getBoundingClientRect();
    const f = pick(e.clientX - b.left, e.clientY - b.top);
    setFocus(f ? { house: f.house, accord: f.accord } : null);
  });
  gloss.addEventListener("pointerover", (e) => {
    const li = e.target.closest("li"); if (!li) return;
    setFocus({ accord: ACC[li.dataset.code].i });
  });
  gloss.addEventListener("pointerleave", () => setFocus(null));

  addEventListener("resize", () => { layout(); kick(); });
  document.addEventListener("visibilitychange", kick);
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { stillDirty = true; kick(); });
  kick();

  window.TestPage2 = { focus: () => focus && (focus.house ? focus.house.id : DATA.accords[focus.accord].code), houses: houses.length, accords: DATA.accords.length };
})();

// ============================================================
// TEST PAGE 3 — "Material Origin System" (test-pages/3/). Not a page of
// the site: it loads nothing of the site's and nothing of the site loads it.
//
// The owner's image 3 — a dashboard round a globe whose places are raised
// in columns — made of where the materials the site's fragrances name are
// traditionally grown:
//   THE GLOBE    16,000 points spread evenly over a sphere, the 4,604 on
//                land drawn (a mask written from Natural Earth's land, the
//                public-domain map, through world-atlas); turning slowly,
//                dragged to turn, an atmosphere round it.
//   THE COLUMNS  at each place a patch of columns as tall, and as red, as
//                the number of the site's fragrances naming something from
//                there — up to the year on the slider.
//   THE PANELS   the totals with their change since the year before, the
//                places ranked (pressed, the globe turns to one), three
//                trends by year, the legend, a small flat map.
//   THE BUTTONS  Configuration (what is drawn), New Scenario (one of the
//                site's fragrances at random, and only its places),
//                Comparison Mode (Prin Lomros' houses beside the site's).
//
// KEPT SMOOTH: the points are rotated in one pass and drawn as small
// squares in one colour at a varied alpha; the ocean and the atmosphere are
// pictures made once for the globe's size; columns ease to their heights;
// the charts are SVG, written again only when the year changes. Nothing is
// drawn while the tab is hidden. With motion reduced: no turning by itself.
// ============================================================
(function () {
  "use strict";

  // a snapshot of the site's fragrances with notes, and the places their materials are
  // traditionally grown, 2026-11-02 (perfumes: [name, house, year])
  const DATA = {"origins": [{"region": "Calabria", "country": "Italy", "lat": 38.9, "lon": 16.6, "notes": ["Bergamot"], "users": [9, 18, 24, 26, 27, 55, 75, 79, 84, 86, 87, 89, 94, 99, 103]}, {"region": "Sicily", "country": "Italy", "lat": 37.5, "lon": 14, "notes": ["Lemon", "Blood Orange"], "users": [7, 20, 26, 31, 72, 73, 79, 84, 92, 120, 122]}, {"region": "Nabeul", "country": "Tunisia", "lat": 36.45, "lon": 10.73, "notes": ["Neroli", "Orange Blossom", "Petitgrain", "Bitter Orange"], "users": [26, 39, 40, 49, 51, 53, 73, 75, 80, 84, 86, 87, 95, 99, 105, 119, 121, 122]}, {"region": "Grasse", "country": "France", "lat": 43.66, "lon": 6.92, "notes": ["Jasmine", "Tuberose", "Mimosa"], "users": [18, 31, 51, 52, 65, 70, 71, 73, 79, 82, 92, 94, 100, 102, 104, 105, 110, 117, 119, 120, 124]}, {"region": "Provence", "country": "France", "lat": 44, "lon": 5.2, "notes": ["Lavender", "Clary Sage", "Thyme", "Rosemary"], "users": [7, 9, 14, 15, 18, 26, 30, 49, 57, 75, 84, 87, 88, 89, 94, 97, 104, 117, 121]}, {"region": "Kazanlak", "country": "Bulgaria", "lat": 42.62, "lon": 25.39, "notes": ["Rose"], "users": [22, 55, 56, 60, 65, 68, 70, 71, 73, 76, 77, 79, 83, 85, 88, 89, 103, 119, 122, 123]}, {"region": "Isparta", "country": "Turkey", "lat": 37.76, "lon": 30.55, "notes": ["Rose"], "users": [22, 55, 56, 60, 65, 68, 70, 71, 73, 76, 77, 79, 83, 85, 88, 89, 103, 119, 122, 123]}, {"region": "Tuscany", "country": "Italy", "lat": 43.4, "lon": 11.1, "notes": ["Orris"], "users": [18, 45, 71, 79, 81, 83, 88, 92, 101, 102, 103, 105, 110, 119, 121]}, {"region": "Comoros", "country": "Comoros", "lat": -11.7, "lon": 43.3, "notes": ["Ylang Ylang"], "users": [49, 52, 67, 79, 88, 89, 121]}, {"region": "SAVA", "country": "Madagascar", "lat": -14.3, "lon": 50, "notes": ["Vanilla", "Pink Pepper"], "users": [3, 16, 21, 30, 32, 39, 41, 43, 47, 53, 54, 63, 64, 67, 68, 70, 71, 72, 73, 76, 78, 79, 84, 85, 86, 87, 88, 92, 94, 95, 96, 100, 122, 123, 124, 125]}, {"region": "Zanzibar", "country": "Tanzania", "lat": -6.1, "lon": 39.3, "notes": ["Clove"], "users": [13, 20, 21, 23, 47, 67, 75, 76, 79, 82, 83, 84, 86, 98, 115, 117]}, {"region": "Orinoco", "country": "Venezuela", "lat": 7, "lon": -64, "notes": ["Tonka"], "users": [16, 49, 52, 54, 64, 67, 68, 71, 73, 74, 76, 78, 79, 81, 84, 85, 86, 104]}, {"region": "Middle Atlas", "country": "Morocco", "lat": 33, "lon": -5, "notes": ["Cedarwood"], "users": [0, 1, 3, 6, 12, 24, 26, 28, 31, 32, 35, 37, 38, 41, 43, 44, 45, 49, 56, 67, 68, 71, 72, 75, 79, 83, 86, 87, 90, 92, 97, 99, 100, 107, 112, 117, 119, 124]}, {"region": "Mysore", "country": "India", "lat": 12.3, "lon": 76.6, "notes": ["Sandalwood"], "users": [2, 7, 9, 22, 25, 27, 28, 31, 33, 37, 42, 44, 45, 47, 51, 67, 68, 70, 79, 81, 86, 88, 89, 92, 93, 94, 95, 98, 100, 104, 110, 117, 121, 123, 124]}, {"region": "Sulawesi", "country": "Indonesia", "lat": -2, "lon": 121, "notes": ["Patchouli"], "users": [4, 7, 9, 28, 32, 41, 44, 55, 64, 68, 71, 73, 75, 79, 82, 83, 84, 86, 87, 89, 90, 92, 93, 95, 97, 98, 99, 103, 104, 113, 117, 123, 124, 125]}, {"region": "Haiti", "country": "Haiti", "lat": 18.5, "lon": -72.3, "notes": ["Vetiver"], "users": [9, 10, 13, 17, 27, 33, 34, 44, 48, 49, 67, 74, 75, 79, 82, 84, 87, 91, 93, 96, 99, 107, 117, 120, 121, 123, 124]}, {"region": "Assam", "country": "India", "lat": 26.2, "lon": 92.9, "notes": ["Oud"], "users": [2, 6, 23, 44, 51, 56, 67, 69, 76, 85, 86, 87, 89, 91, 92, 93, 94, 95, 96, 97]}, {"region": "Dhofar", "country": "Oman", "lat": 17, "lon": 54, "notes": ["Frankincense"], "users": [12, 22, 32, 56, 64, 77, 78, 81, 83, 87, 91, 97, 104, 111, 114]}, {"region": "Somaliland", "country": "Somalia", "lat": 9.5, "lon": 45, "notes": ["Myrrh", "Opoponax"], "users": [4, 6, 8, 12, 49, 54, 56, 64, 65, 68, 71, 72, 83, 104, 117]}, {"region": "Luang Prabang", "country": "Laos", "lat": 19.9, "lon": 102.1, "notes": ["Benzoin"], "users": [28, 64, 67, 68, 69, 71, 75, 79, 84, 85, 86, 88, 90, 91, 93, 94, 95, 123, 124, 125]}, {"region": "Andalusia", "country": "Spain", "lat": 37.4, "lon": -5.9, "notes": ["Labdanum"], "users": [35, 47, 64, 67, 68, 71, 75, 76, 79, 83, 89, 90, 103, 108, 117, 123]}, {"region": "Balkans", "country": "North Macedonia", "lat": 41.6, "lon": 21.7, "notes": ["Oakmoss", "Juniper", "Juniper Berry"], "users": [4, 7, 9, 10, 13, 16, 17, 22, 24, 25, 26, 30, 33, 36, 37, 38, 40, 45, 55, 74, 79, 82, 84, 87, 89, 90, 91, 92, 96, 99, 103, 107, 111]}, {"region": "Quebec", "country": "Canada", "lat": 47, "lon": -71, "notes": ["Fir", "Spruce"], "users": [2, 4, 5, 8, 9, 12, 13, 20, 22, 27, 29, 30, 31, 34, 40, 47, 71, 87, 89, 108, 117]}, {"region": "Siberia", "country": "Russia", "lat": 60, "lon": 100, "notes": ["Pine", "Pine Needles"], "users": [0, 1, 3, 4, 5, 6, 9, 10, 12, 13, 19, 31, 34, 36, 37, 38, 43, 55, 99, 107, 108, 112, 117, 119, 120]}, {"region": "Alta Verapaz", "country": "Guatemala", "lat": 15.5, "lon": -90.3, "notes": ["Cardamom"], "users": [16, 76, 81, 84, 109]}, {"region": "Sri Lanka", "country": "Sri Lanka", "lat": 7.9, "lon": 80.7, "notes": ["Cinnamon"], "users": [21, 23, 39, 43, 67, 71, 76, 84, 115, 117]}, {"region": "Khorasan", "country": "Iran", "lat": 34.3, "lon": 59, "notes": ["Saffron"], "users": [15, 31, 48, 52, 54, 67, 70, 71, 76, 83, 99, 101, 117]}, {"region": "Kerala", "country": "India", "lat": 10, "lon": 76.3, "notes": ["Black Pepper"], "users": [27, 55, 104, 115, 117, 120]}, {"region": "Virginia", "country": "United States", "lat": 37.5, "lon": -78.5, "notes": ["Tobacco"], "users": [6, 9, 19, 29, 31, 32, 34, 45, 46, 50, 52, 63, 64, 67, 68, 74, 76, 90, 93, 95, 97, 98, 117, 118, 122]}, {"region": "Yirgacheffe", "country": "Ethiopia", "lat": 6.2, "lon": 38.2, "notes": ["Coffee"], "users": [32, 45, 68, 100]}, {"region": "Ashanti", "country": "Ghana", "lat": 6.7, "lon": -1.6, "notes": ["Cacao", "Chocolate"], "users": [16, 22, 41, 57, 63, 64, 66, 67, 70, 81, 92, 93, 95, 96, 98, 100, 111, 125]}, {"region": "Fujian", "country": "China", "lat": 26, "lon": 118, "notes": ["Tea", "Green Tea"], "users": [30, 38, 45, 76, 94, 96]}, {"region": "Réunion", "country": "France", "lat": -21.1, "lon": 55.5, "notes": ["Geranium"], "users": [9, 75, 79, 84, 96, 97]}, {"region": "Luzon", "country": "Philippines", "lat": 13.4, "lon": 123.4, "notes": ["Elemi"], "users": [64, 117]}, {"region": "Chaco", "country": "Paraguay", "lat": -23, "lon": -60, "notes": ["Guaiac Wood"], "users": [32, 68, 71, 75, 78, 91, 92, 108, 117, 125]}, {"region": "Jamaica", "country": "Jamaica", "lat": 18.1, "lon": -77.3, "notes": ["Rum"], "users": [23, 39, 68, 78, 90]}, {"region": "Islay", "country": "Scotland", "lat": 55.8, "lon": -6.2, "notes": ["Whiskey"], "users": [90, 98, 111, 125]}, {"region": "Rajasthan", "country": "India", "lat": 26.9, "lon": 73, "notes": ["Cumin"], "users": [65, 83]}, {"region": "Florida", "country": "United States", "lat": 27.8, "lon": -81.7, "notes": ["Grapefruit", "Orange"], "users": [13, 37, 71, 73, 80, 86, 98, 99, 120, 124]}, {"region": "Manabí", "country": "Ecuador", "lat": -1, "lon": -80.3, "notes": ["Palo Santo"], "users": [55]}, {"region": "Hokkaido", "country": "Japan", "lat": 43, "lon": 142.5, "notes": ["Hinoki"], "users": [92, 107, 109]}, {"region": "Banda Islands", "country": "Indonesia", "lat": -4.5, "lon": 129.9, "notes": ["Nutmeg"], "users": [16, 20, 21, 39, 68, 106, 117]}, {"region": "Gilan", "country": "Iran", "lat": 37.3, "lon": 49.6, "notes": ["Galbanum"], "users": [49, 82, 103, 117]}, {"region": "Muğla", "country": "Turkey", "lat": 37.2, "lon": 28.4, "notes": ["Styrax"], "users": [91, 96, 117, 123]}, {"region": "Tolú", "country": "Colombia", "lat": 9.5, "lon": -75.6, "notes": ["Tolu Balsam"], "users": [22, 68, 79, 90, 125]}, {"region": "Sonsonate", "country": "El Salvador", "lat": 13.7, "lon": -89.7, "notes": ["Peru Balsam"], "users": [67, 68, 76, 85, 125]}, {"region": "Madhya Pradesh", "country": "India", "lat": 23.3, "lon": 77.4, "notes": ["Cypriol"], "users": [45, 65, 75, 117, 122]}, {"region": "Kashmir", "country": "India", "lat": 34.1, "lon": 74.8, "notes": ["Costus"], "users": [84, 88, 109, 117]}, {"region": "Guilin", "country": "China", "lat": 25.3, "lon": 110.3, "notes": ["Osmanthus"], "users": [44, 48, 70, 91, 94]}, {"region": "Kōchi", "country": "Japan", "lat": 33.6, "lon": 133.5, "notes": ["Yuzu"], "users": [24, 54, 107]}, {"region": "Paraná", "country": "Paraguay", "lat": -25.5, "lon": -54.6, "notes": ["Maté"], "users": [17, 94, 96]}, {"region": "Colima", "country": "Mexico", "lat": 19.2, "lon": -103.7, "notes": ["Lime"], "users": [38, 39, 49, 86, 99, 124]}, {"region": "Tver", "country": "Russia", "lat": 56.9, "lon": 35.9, "notes": ["Birch Tar", "Birch"], "users": [57, 65, 82, 96, 107, 112, 117, 122]}, {"region": "Cochin", "country": "India", "lat": 9.9, "lon": 76.3, "notes": ["Ginger"], "users": [13, 21, 26, 39, 48, 80, 81, 107, 120, 124]}], "perfumes": [["Bindebole", "Pineward", 2021], ["Boreal", "Pineward", 2020], ["Brokilän", "Pineward", 2021], ["Cotswold", "Pineward", 2021], ["Eldritch", "Pineward", 2021], ["Fanghorn II", "Pineward", 2021], ["Funerie", "Pineward", 2022], ["Juniperus", "Pineward", 2024], ["Murkwood", "Pineward", 2020], ["Nocturnis", "Pineward", 2022], ["Oxylus", "Pineward", 2021], ["Snoqualmie", "Pineward", 2024], ["Sturbridge", "Pineward", 2023], ["White Fir", "Pineward", 2022], ["Bucolic", "Pineward", 2024], ["Hayloft", "Pineward", 2022], ["Hayride", "Pineward", 2022], ["Pastoral", "Pineward", 2022], ["Shire", "Pineward", 2024], ["Steading", "Pineward", 2020], ["Christmas Wine", "Pineward", 2020], ["Gingerbread", "Pineward", 2023], ["Glühwein", "Pineward", 2021], ["Revelries", "Pineward", 2021], ["Acadian", "Pineward", 2023], ["Coastal Veil", "Pineward", 2023], ["Gingermoss", "Pineward", 2023], ["Subalpine", "Pineward", 2025], ["Akero", "Pineward", 2023], ["Apple Tabac", "Pineward", 2020], ["Caravansary", "Pineward", 2023], ["Clemenpine", "Pineward", 2023], ["Coffee Tabac", "Pineward", 2024], ["Delfiño", "Pineward", 2022], ["Greymist", "Pineward", 2023], ["Gristmill", "Pineward", 2022], ["Holy Cross", "Pineward", 2026], ["Icefall", "Pineward", 2021], ["Ivymoss", "Pineward", 2023], ["Lime Cola", "Pineward", 2025], ["Meadowmoss", "Pineward", 2023], ["Mint Cocoa", "Pineward", 2024], ["Noki", "Pineward", 2022], ["Ponderosa", "Pineward", 2022], ["Pumpkivus", "Pineward", 2025], ["Tome", "Pineward", 2025], ["Treacle", "Pineward", 2021], ["Velvetine", "Pineward", 2021], ["Amber Zero", "ADAR", 0], ["Aetherialism", "ADAR", 0], ["Incantu", "ADAR", 0], ["Against All Odds", "ADAR", 2025], ["α11 Alpha11", "ADAR", 0], ["Alta Luna", "ADAR", 2025], ["ADHD", "ADAR", 0], ["Root Code", "ADAR", 0], ["Lignum Dei", "ADAR", 0], ["Tyrian", "ADAR", 2026], ["Burning Bridges", "Almost Human", 2026], ["Dear Future", "Almost Human", 2026], ["Desert Hope", "Almost Human", 2026], ["Ritual Code", "Almost Human", 2026], ["Silent Rain", "Almost Human", 2026], ["Amaretto Jazz in the Melting Room", "Ataraxia", 2024], ["Deity", "Ataraxia", 2025], ["Spinal Fluid", "Ataraxia", 2025], ["Vestibule", "Ataraxia", 2024], ["5 Years Anniversary", "Grande Parfums", 0], ["Ambresso", "Grande Parfums", 0], ["Ancient Oud", "Grande Parfums", 0], ["Choco Powder", "Grande Parfums", 0], ["Cuore", "Grande Parfums", 2024], ["Dreaming Maldives", "Grande Parfums", 0], ["Giardino di Sorrento", "Grande Parfums", 0], ["Hot Stuff", "Grande Parfums", 0], ["Intimate Spell", "Grande Parfums", 0], ["Karak & Shisha", "Grande Parfums", 0], ["Mystical Incense", "Grande Parfums", 0], ["Vanilla Ash", "Grande Parfums", 0], ["Vintage Memoir", "Grande Parfums", 0], ["White Label", "Grande Parfums", 0], ["Belle Âme", "Les Abstraits", 2022], ["Des Cendres", "Les Abstraits", 2023], ["La Douleur Exquise", "Les Abstraits", 2022], ["Philosopher’s Walk", "Les Abstraits", 2025], ["Watch King", "Lost Tribe", 0], ["Dirty Soda", "Lost Tribe", 0], ["Equatorial", "Lost Tribe", 0], ["Santal Absolu", "Lost Tribe", 0], ["Pan’s Labyrinth", "Lost Tribe", 0], ["Lust", "Om Parfums", 2023], ["Burnana", "Om Parfums", 2024], ["Dark Night of the Soul", "Om Parfums", 2024], ["This Too Shall Pass", "Om Parfums", 0], ["When the Linden Blooms", "Om Parfums", 2024], ["Oud de Pasión", "Om Parfums", 0], ["Dragon’s Breath", "Outsider Parfums", 2026], ["Draco", "Outsider Parfums", 0], ["Xocolate Crotch", "Outsider Parfums", 0], ["Guilty as Charged", "Outsider Parfums", 0], ["Amaretto Coffee", "Outsider Parfums", 0], ["Vocal", "Qimu & Musicians", 0], ["3 Feet 5", "Tombstone", 2024], ["Evergrow", "Tombstone", 2025], ["No Need to Come By", "Tombstone", 0], ["Sing at My Funeral", "Tombstone", 0], ["Sweet Coffin", "Tombstone", 2024], ["Kogen", "Apoteker Tepe", 2024], ["The Holy Mountain", "Apoteker Tepe", 2015], ["Karasu", "Apoteker Tepe", 2016], ["The Peradam", "Apoteker Tepe", 2015], ["Pale Fire", "Apoteker Tepe", 2016], ["Anabasis", "Apoteker Tepe", 2015], ["After the Flood", "Apoteker Tepe", 2015], ["Brother Night", "Apoteker Tepe", 2016], ["CV99", "Lussur", 0], ["De Profundis", "Serge Lutens", 2011], ["Haxan", "Parfum Prissana", 2018], ["Tobacolor", "Dior", 2021], ["Flamenco EDP", "Ramón Monegal", 2017], ["French Riviera", "Mancera", 2022], ["Velvet Fog", "Casa Goa", 0], ["House of Ellixirz", "Matca", 2021], ["Quintessentially Amber", "Sultan Pasha Perfumes", 2025], ["Forbidden Flower", "Areej Le Doré", 2024], ["Ore", "Slumberhouse", 2009]], "years": [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026], "byYear": [1, 0, 1, 0, 0, 0, 4, 3, 1, 1, 0, 5, 13, 13, 13, 18, 11, 8], "prinYear": [0, 0, 0, 0, 0, 0, 0, 0, 6, 7, 24, 13, 13, 10, 22, 15, 17, 4], "notesYear": [15, 0, 6, 0, 0, 0, 22, 15, 11, 44, 0, 31, 97, 131, 139, 205, 134, 53], "notes": 351, "accords": 16, "houses": 13, "withNotes": 126, "onSite": 142, "undated": 36};
  // 16,000 points on a sphere, a bit set for each on land — from Natural Earth's land
  // (public domain), 1:50m, through world-atlas, tested with d3-geo
  const MASK = "AAAAAAAAABAAQkJIAAhLIQMkJIWEhIAEEBJCAkDAAZk6IQNgYAAMhJAjMjJADsTYgRk5MkNi7sjMGplpMfEtZv3Mpr3WNvf6Sttf+ztff+Xt//2Vt7/+9t732tv5/ztvf+ft/P+dt/v2Vv7+ylv5eztv9++tvN21s/L3Vsbu31t5Oysn5e+snJ2Xk3J3VmbOzUm5OSMr5+ak7JyR03JzRn7OzUmZOSMv5+aE7Jy70zNzQn7OzInZOTG3Z+bE/Jyb03NzRm7Pzen5OTU35+bk3J6b03NzSm7Ozcm5OTW35+bU3Jybk3Nzak7Ozek5OTWn5+b0nJyb03Nzam7Pyak5OTW35+bUnJybU3Nyam7Ozam5OTWn4+bUnJybUXNyakbGzak5OTGj5ubUnIybUXNyakbNzeg5OTOj5uTEjIqRkXN6akbFyYgZNSOj5+TEjIqREXNqTk7FyYkZNScmZtSEnIqTE3NqRkzMyYk5FSMmZtSEmIiRE3NqRkzOiQk5FSMmZtSUmJyTE3NqRk7MqAk5ESOmZtSEjJ6RUzJiRkzNiAkZPSOmZuSEmJoREzJqRkzN6AkZNSOmZNSEmJoREzJqRkzJ6Ak5NSOmZNSEmJLRUzJqTkzJqAk5JaemZNSEmJJRU3JqTkzJqSkxJaem5NSUmJJTUnJqSk3JKSkxJaem5JSUmJJTUGJKSknJKSkxJaek9NSUkpJTUGJKSknJKSklJaekxFSckpJTUGpKSknJKCglJaekxBSUkpJTUEoKSkmJKCklBaek1BSckgJTUEoKSkmpKCklBaeklBSckgJTUkoKSkmpKCklBaamlBSUkkJTUkoKSEmpoSElBaaklBSQmkJBUkoKTEmhKSA1BYaElFSQkkJBQEoqDAkpISA1hYaklBSQkkJBQGoqDAmpKSAlhYaA1BQQklJBQGoKCgGpKSAkhYaA1BQQglJBQEoKCwGpISAEhYKA1BQUglJCQGgKCQGpKSAUhYCA0BQWglpCQCgKCQGpKSAEpYCAUBQWAlJCQCgKSQEhICAEpYCAUBQSAlJQQAgKCQEhICQEpICAUBQSAkJAQQgKCQUhISQEpISCUBQSAkJCQQhoCQUhoCwEhISCUFASCkJCQShICQUhqCwEpISCUFASCkJAUQgICQUhoCwUpISCEFASCkJAUQgICQUhoCQUhICCEFASCkJAUSgoSQUBoCQUlYCCEFASigJAQSgoQAUBoCQVFYCCAFAQCgJAQSgqQAUBoCAVFICCUFQACgJAQSgqAAUBqAAVBICCQFQACgJAQagqAAWBqAAVBICiUFQACgJRASgoAAWBqAAVBKACUFQACgJRASoqAEWgqAAVBKICUFAACgJRESooAAWgqAAVFKICUFAACoBRASooBAWgoAgVFKIiVFCECkhRESooBgWkoAgUEIICUFQMCkhBESooBgXkqAgUEIICUFQMCkhBESogBkWkoAgUEIICUFAMCkhBESogBkWkoAgUEIICUECMCkhBESogBAWgoAgVkIIiUECICkhBESggRAWgoBAUkIICUEAMCkBBASggBAWggBAUkKICUEAICkBBASggBAWggBAUgIICUEAICkBBASggBQWggBAUgIIiUEAICkABASgCBQWggBAUgYICUAQKCkABISgKBUWgiBAUgIICUAQKCkARISgABUWgiBQUgCICUBQKCkARISgCBUWgKBQUgCIDUAQKikBRCSgCRUSgKBQUgCICcASKiEBRCCgCRQSgKBQQgaICUASKiEBRKCgCRQSgCBQRgaIQUASKiEBRKCICRUSgCBQRgaIQVASKiEARKCICRQGoCBQRgaJQRASKiFARKCICRQGoCBQRoSJQRASKglARKCICRaGoCBQBoSJQRASKglARKAICReCICBQBoSJQBASKgBARKAJCRaAICBQBoSJQBASKgBERKAJCRaAICBQBISJQBASKQBERKAJCRaAICBQBIyJQBASKQBEQKAJCRKAICBQBIyBQBISKQBEQKAJGQKAICBQBIiBQBISIQBEQKAJGQKAICBABIiBQAISAQAEQIABEQKAACBGBIiAQAIiAQAEQIAAEQIAACAGAAiAAAAiAAAEQAAAEQIAAEAAAAiAAAAiAAAEQAAAEQIAAEAAAAiAAAAiEAAEgAAAEQgAAEAAAAgAAAAgEAAAgAAAEAAAAEAAAAEAAAAgAAAAgAAAEAAAAEAgAAEAAAACAAAAgEAAAgAAAEAAAAEAgAACAAAAgAAAAgEAAAAAAAEAAAAAAgQAgAAAAgAAAAAAAAEAAAAAAgQAAAAAAgAAAAAAAAEAAAAAAAQAAAAAAgAAAAAACAAAAAAAAAQAAAAAAgAAAAAACAAAAAAAAAQAAAAQAAAAAAAACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAIASkRICCghISUgpISUgJASUlJCSkZJCSk9paWntLSWntPSWlpKS+9pKT0/p6f1/JSf3/N7fl7P7/v5Pb//9/X8vN6f//N7fn/v7/v9//////8=";
  const NPTS = 16000;

  const canvas = document.querySelector(".t3-globe");
  const ctx = canvas.getContext("2d");
  const tip = document.querySelector(".t3-tip");
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2, RAD = Math.PI / 180;

  // ---- THE LAND: a Fibonacci sphere, a bit for each point on land --------
  const bits = Uint8Array.from(atob(MASK), (c) => c.charCodeAt(0));
  const land = [];
  const GA = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NPTS; i++) {
    if (!(bits[i >> 3] & (1 << (i & 7)))) continue;
    const y = 1 - (2 * (i + 0.5)) / NPTS;
    const lat = Math.asin(y);
    const lon = (((((i * GA) * 180) / Math.PI) % 360) + 540) % 360 - 180;
    land.push(lat, lon * RAD);
  }
  const NL = land.length / 2;
  const LAND = new Float32Array(NL * 3);   // x, y, z on the unit sphere (y up, lon 0 facing +z)
  for (let i = 0; i < NL; i++) {
    const lat = land[i * 2], lon = land[i * 2 + 1];
    LAND[i * 3] = Math.cos(lat) * Math.sin(lon);
    LAND[i * 3 + 1] = Math.sin(lat);
    LAND[i * 3 + 2] = Math.cos(lat) * Math.cos(lon);
  }
  const unit = (lat, lon) => [Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD)];

  // ---- THE PLACES and their columns ---------------------------------------
  let seed = 7;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const places = DATA.origins.map((o) => {
    const cols = [];
    const n = 5 + Math.min(16, Math.round(Math.sqrt(o.users.length) * 3));
    for (let k = 0; k < n; k++) {
      const a = k * 2.39996, r = Math.sqrt(k + 0.5) * 0.85;   // a small sunflower patch of columns
      cols.push({ p: unit(o.lat + Math.sin(a) * r, o.lon + (Math.cos(a) * r) / Math.max(0.35, Math.cos(o.lat * RAD))), h: 0.55 + 0.45 * rand() * (1 - k / n) + 0.25 * (1 - k / n) });
    }
    return Object.assign({}, o, { cols, v: 0, shown: 0 });
  });
  const LEGEND = [[0, "#eef1f4", "0"], [1, "#f7d9d3", "1 – 2"], [3, "#f2b3a8", "3 – 5"], [6, "#ea8577", "6 – 10"], [11, "#de5a55", "11 – 20"], [21, "#c43540", "21 – 30"], [31, "#8f1c2b", "> 30"]];
  const colourOf = (v) => { let c = LEGEND[0][1]; for (const [min, col] of LEGEND) if (v >= min) c = col; return c; };
  const legend = document.querySelector(".t3-legend");
  LEGEND.forEach(([, col, say]) => { const li = document.createElement("li"); li.innerHTML = '<i style="background:' + col + '"></i>' + say; legend.appendChild(li); });

  // ---- WHAT IS COUNTED: up to a year, or one fragrance ----------------------
  const YEARS = DATA.years;          // 2009 … 2026; the slider's 18 is every year, the undated too
  let yi = 18, scenario = -1, compare = false;
  const OPT = { spin: !STILL, labels: true, bars: true, air: true, grid: false };
  function inYear(i, at) {
    const y = DATA.perfumes[i][2];
    if (at >= 18) return true;
    return y && y <= YEARS[at];
  }
  function counts(at) {
    const per = places.map((p) => p.users.filter((i) => (scenario >= 0 ? i === scenario : inYear(i, at))).length);
    const frag = new Set();
    places.forEach((p) => p.users.forEach((i) => { if (scenario >= 0 ? i === scenario : inYear(i, at)) frag.add(i); }));
    return { per, total: per.reduce((s, v) => s + v, 0), frag: frag.size, places: per.filter((v) => v > 0).length };
  }
  const els = {}; document.querySelectorAll("[data-n]").forEach((e) => (els[e.dataset.n] = e));
  const shownNum = {};
  function countTo(key, v) {
    const el = els[key]; if (!el) return;
    const from = shownNum[key] || 0; shownNum[key] = v;
    if (STILL) { el.textContent = v.toLocaleString("en"); return; }
    const t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (v - from) * e).toLocaleString("en"); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function badge(key, d) {
    const el = els[key]; if (!el) return;
    el.textContent = (d >= 0 ? "+" + d + " ↑" : d + " ↓");
    el.classList.toggle("is-down", d < 0);
  }
  const rankBody = document.querySelector(".t3-rank tbody");
  let ranked = [];
  function refresh() {
    const now = counts(yi), before = counts(Math.max(0, yi - 1));
    places.forEach((p, i) => (p.v = now.per[i]));
    countTo("total", now.total); badge("delta", yi === 0 || scenario >= 0 ? 0 : now.total - before.total);
    countTo("frag", now.frag); badge("fragd", yi === 0 || scenario >= 0 ? 0 : now.frag - before.frag);
    countTo("places", now.places); badge("placesd", yi === 0 || scenario >= 0 ? 0 : now.places - before.places);
    countTo("notes", scenario >= 0 ? new Set(places.filter((p) => p.v).flatMap((p) => p.notes)).size : DATA.notes);
    countTo("undated", DATA.undated);
    ranked = places.map((p, i) => [p, now.per[i]]).filter((r) => r[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 9);
    rankBody.innerHTML = ranked.map(([p, v], r) => '<tr data-i="' + places.indexOf(p) + '"><td>' + String(r + 1).padStart(2, "0") + "</td><td>" + p.region + "</td><td>" + v + "</td></tr>").join("") ||
      '<tr><td></td><td>Nothing yet</td><td>0</td></tr>';
    drawCharts();
    kick();
  }

  // ---- THE TRENDS, in SVG ---------------------------------------------------
  const svgs = {}; document.querySelectorAll("[data-chart]").forEach((s) => (svgs[s.dataset.chart] = s));
  const cumPlaces = YEARS.map((y, k) => counts(k).places);
  function chart(svg, series, cols) {
    const w = svg.clientWidth || 268, h = 118, l = 22, b = 16, t = 6;
    const max = Math.max(4, ...series.flat());
    const top = Math.ceil(max / 4) * 4;
    const X = (i) => l + (i / (YEARS.length - 1)) * (w - l - 4), Y = (v) => t + (1 - v / top) * (h - t - b);
    let g = "";
    for (let k = 0; k <= 4; k++) { const v = (top / 4) * k; g += '<line x1="' + l + '" x2="' + (w - 4) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="rgba(160,190,220,0.08)"/><text x="' + (l - 5) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + Math.round(v) + "</text>"; }
    [0, 5, 11, 17].forEach((i) => (g += '<text x="' + X(i) + '" y="' + (h - 3) + '" text-anchor="middle">' + YEARS[i] + "</text>"));
    const at = Math.min(17, yi);
    g += '<line x1="' + X(at) + '" x2="' + X(at) + '" y1="' + t + '" y2="' + (h - b) + '" stroke="rgba(230,237,243,0.35)" stroke-dasharray="2 3"/>';
    series.forEach((s, n) => {
      const col = cols[n];
      // a smooth line through the points, and its ground under it
      let d = "M" + X(0) + "," + Y(s[0]);
      for (let i = 1; i < s.length; i++) { const x0 = X(i - 1), x1 = X(i), xm = (x0 + x1) / 2; d += " C" + xm + "," + Y(s[i - 1]) + " " + xm + "," + Y(s[i]) + " " + x1 + "," + Y(s[i]); }
      const id = svg.dataset.chart + n;
      g += '<defs><linearGradient id="' + id + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + col + '" stop-opacity="0.35"/><stop offset="1" stop-color="' + col + '" stop-opacity="0"/></linearGradient></defs>';
      g += '<path d="' + d + " L" + X(s.length - 1) + "," + Y(0) + " L" + X(0) + "," + Y(0) + ' Z" fill="url(#' + id + ')"/>';
      g += '<path class="t3-line" d="' + d + '" fill="none" stroke="' + col + '" stroke-width="1.6"/>';
      g += '<circle cx="' + X(at) + '" cy="' + Y(s[at]) + '" r="3" fill="' + col + '" stroke="#0b1018" stroke-width="1.5"/>';
    });
    svg.innerHTML = g;
  }
  function drawCharts() {
    chart(svgs.made, compare ? [DATA.byYear, DATA.prinYear] : [DATA.byYear], ["#e2464f", "#6aa8d8"]);
    chart(svgs.notes, [DATA.notesYear], ["#e2464f"]);
    chart(svgs.places, [cumPlaces], ["#6aa8d8"]);
    document.querySelector(".t3-key .b").hidden = !compare;
  }

  // ---- THE VIEW ---------------------------------------------------------
  let W = 0, H = 0, DPR = 1, R = 200, CX = 0, CY = 0;
  let ocean = null, air = null;
  function resize() {
    W = innerWidth; H = innerHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    const phone = W < 760;
    R = phone ? Math.min(W * 0.42, H * 0.3) : Math.min(H * 0.36, W * 0.24);
    CX = W * 0.5; CY = phone ? H * 0.42 : H * 0.5;
    // the ocean and the atmosphere, made once for this size
    const s = Math.ceil(R * 2.6 * DPR);
    ocean = document.createElement("canvas"); ocean.width = ocean.height = s;
    let c = ocean.getContext("2d"), m = s / 2;
    let g = c.createRadialGradient(m - R * DPR * 0.35, m - R * DPR * 0.4, R * DPR * 0.1, m, m, R * DPR);
    g.addColorStop(0, "#1b3346"); g.addColorStop(0.6, "#0c1a26"); g.addColorStop(1, "#050a10");
    c.fillStyle = g; c.beginPath(); c.arc(m, m, R * DPR, 0, TAU); c.fill();
    air = document.createElement("canvas"); air.width = air.height = s;
    c = air.getContext("2d");
    g = c.createRadialGradient(m, m, R * DPR * 0.94, m, m, R * DPR * 1.28);
    g.addColorStop(0, "rgba(140,200,255,0.0)"); g.addColorStop(0.08, "rgba(140,200,255,0.42)"); g.addColorStop(0.3, "rgba(80,150,220,0.12)"); g.addColorStop(1, "rgba(60,120,200,0)");
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    drawMini();
    placePill();
    kick();
  }
  const pill = document.querySelector(".t3-pill");
  function placePill() { pill.style.left = CX - R * 0.78 + "px"; pill.style.top = CY - R * 0.92 + "px"; }

  // ---- THE CAMERA: a turn round the pole and a tilt, eased ------------------
  let lon0 = -20, lat0 = 18, vLon = 0, goalLon = null, goalLat = null;
  let spinFrom = 0, dragging = null;
  function rot(p, out) {
    // turn the point so that (lat0, lon0) faces us
    const cl = Math.cos(-lon0 * RAD), sl = Math.sin(-lon0 * RAD);
    const x = p[0] * cl + p[2] * sl, z = -p[0] * sl + p[2] * cl;
    const ct = Math.cos(lat0 * RAD), st = Math.sin(lat0 * RAD);
    out[0] = x; out[1] = p[1] * ct - z * st; out[2] = p[1] * st + z * ct;
    return out;
  }
  const v3 = [0, 0, 0], v4 = [0, 0, 0];

  // ---- THE FRAME --------------------------------------------------------
  let raf = 0, last = 0, hover = -1;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    let moving = false;
    if (goalLon != null) {
      let d = ((goalLon - lon0 + 540) % 360) - 180;
      lon0 += d * Math.min(1, dt * 3.2); lat0 += (goalLat - lat0) * Math.min(1, dt * 3.2);
      if (Math.abs(d) < 0.05 && Math.abs(goalLat - lat0) < 0.05) goalLon = null;
      moving = true;
    } else if (!dragging) {
      if (Math.abs(vLon) > 0.01) { lon0 += vLon * dt; vLon *= Math.pow(0.08, dt); moving = true; }
      if (OPT.spin && !STILL && now - spinFrom > 2500) { lon0 += dt * 6; moving = true; }
    }
    // the columns ease to their heights
    for (const p of places) {
      const d = p.v - p.shown;
      if (Math.abs(d) > 0.01) { p.shown += STILL ? d : d * Math.min(1, dt * 4); moving = true; } else p.shown = p.v;
    }

    const c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (OPT.air) c.drawImage(air, CX - (air.width / DPR) / 2, CY - (air.height / DPR) / 2, air.width / DPR, air.height / DPR);
    c.drawImage(ocean, CX - (ocean.width / DPR) / 2, CY - (ocean.height / DPR) / 2, ocean.width / DPR, ocean.height / DPR);

    // the graticule
    if (OPT.grid) {
      c.strokeStyle = "rgba(140,180,220,0.12)"; c.lineWidth = 0.6;
      for (let la = -60; la <= 60; la += 30) { line((t) => unit(la, t * 360 - 180)); }
      for (let lo = -180; lo < 180; lo += 30) { line((t) => unit(t * 180 - 90, lo)); }
    }
    // the land, its points facing us drawn, brighter towards the light
    c.fillStyle = "rgb(178,206,228)";
    const sz = Math.max(1, R * 0.0085);
    const cl = Math.cos(-lon0 * RAD), sl = Math.sin(-lon0 * RAD), ct = Math.cos(lat0 * RAD), st = Math.sin(lat0 * RAD);
    for (let i = 0; i < NL; i++) {
      const o = i * 3, px = LAND[o], py = LAND[o + 1], pz = LAND[o + 2];
      const x = px * cl + pz * sl, z0 = -px * sl + pz * cl;
      const y = py * ct - z0 * st, z = py * st + z0 * ct;
      if (z < 0.02) continue;
      c.globalAlpha = 0.18 + 0.7 * z * (0.6 + 0.4 * (-x * 0.4 + y * 0.6 + 0.6));
      c.fillRect(CX + x * R - sz / 2, CY - y * R - sz / 2, sz, sz);
    }
    c.globalAlpha = 1;

    // the columns, back to front
    const cols = [];
    if (OPT.bars) {
      places.forEach((p, pi) => {
        if (p.shown < 0.02) return;
        const k = Math.min(1, Math.log2(1 + p.shown) / 5.2);
        for (const col of p.cols) {
          rot(col.p, v3);
          if (v3[2] < 0.05) continue;
          cols.push([v3[2], pi, v3[0], v3[1], col.h * (0.25 + 0.75 * k)]);
        }
      });
      cols.sort((a, b) => a[0] - b[0]);
      const lw = Math.max(1.6, R * 0.0105);
      c.lineCap = "butt";
      for (const [z, pi, x, y, h] of cols) {
        const p = places[pi];
        const len = 1 + h * 0.13;
        const x0 = CX + x * R, y0 = CY - y * R, x1 = CX + x * R * len, y1 = CY - y * R * len;
        c.strokeStyle = colourOf(p.shown);
        c.globalAlpha = (0.55 + 0.45 * z) * (hover < 0 || hover === pi ? 1 : 0.35);
        c.lineWidth = lw * (0.6 + 0.4 * z);
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.fillStyle = "#fff"; c.globalAlpha *= 0.55;
        c.fillRect(x1 - lw * 0.4, y1 - lw * 0.4, lw * 0.8, lw * 0.8);
      }
      c.globalAlpha = 1;
    }
    // the names of the places, at the tops of their tallest columns
    if (OPT.labels) {
      c.font = '500 10px Archivo, sans-serif';
      c.textAlign = "center";
      // the busiest first; a name that would touch one already written is left out
      const taken = [];
      places.map((p, pi) => [p, pi]).sort((a, b) => (b[1] === hover) - (a[1] === hover) || b[0].shown - a[0].shown).forEach(([p, pi]) => {
        if (p.shown < 0.5) return;
        rot(unit(p.lat, p.lon), v3);
        if (v3[2] < 0.35) return;
        const k = Math.min(1, Math.log2(1 + p.shown) / 5.2);
        const len = 1 + 0.15 * k;
        const x = CX + v3[0] * R * len, y = CY - v3[1] * R * len - 8;
        const w = c.measureText(p.region).width;
        if (taken.some(([tx, ty, tw]) => Math.abs(tx - x) < (tw + w) / 2 + 6 && Math.abs(ty - y) < 13)) return;
        taken.push([x, y, w]);
        c.globalAlpha = Math.min(1, (v3[2] - 0.35) * 3) * (hover < 0 || hover === pi ? 0.95 : 0.3);
        c.fillStyle = "#0a0e14"; c.fillText(p.region, x + 1, y + 1);
        c.fillStyle = hover === pi ? "#f0a6a0" : "#e6edf3"; c.fillText(p.region, x, y);
      });
      c.globalAlpha = 1; c.textAlign = "left";
    }
    // the minimap's frame, where the globe is looking
    drawMiniFrame();
    if ((moving || (OPT.spin && !STILL)) && !document.hidden) kick();
  }
  function line(f) {
    const c = ctx;
    c.beginPath();
    let pen = false;
    for (let k = 0; k <= 72; k++) {
      rot(f(k / 72), v4);
      if (v4[2] < 0) { pen = false; continue; }
      const x = CX + v4[0] * R, y = CY - v4[1] * R;
      pen ? c.lineTo(x, y) : c.moveTo(x, y); pen = true;
    }
    c.stroke();
  }

  // ---- THE SMALL FLAT MAP -------------------------------------------------
  const mini = document.querySelector(".t3-mini"), mctx = mini.getContext("2d");
  const miniBase = document.createElement("canvas");
  function drawMini() {
    const w = mini.clientWidth, h = mini.clientHeight; if (!w) return;
    mini.width = miniBase.width = Math.round(w * DPR); mini.height = miniBase.height = Math.round(h * DPR);
    const c = miniBase.getContext("2d");
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.fillStyle = "rgba(178,206,228,0.55)";
    for (let i = 0; i < NL; i++) {
      const lat = land[i * 2], lon = land[i * 2 + 1];
      c.fillRect(((lon / Math.PI + 1) / 2) * w, ((0.5 - lat / Math.PI)) * h, 1, 1);
    }
    c.fillStyle = "#e2464f";
    places.forEach((p) => c.fillRect(((p.lon / 180 + 1) / 2) * w - 1, (0.5 - p.lat / 180) * h - 1, 2, 2));
  }
  let lastFrame = "";
  function drawMiniFrame() {
    const w = mini.clientWidth, h = mini.clientHeight; if (!w) return;
    const key = Math.round(lon0) + ":" + Math.round(lat0);
    if (key === lastFrame) return;
    lastFrame = key;
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.clearRect(0, 0, mini.width, mini.height);
    mctx.drawImage(miniBase, 0, 0);
    mctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const lo = ((((lon0 + 540) % 360) - 180) / 180 + 1) / 2 * w, la = (0.5 - lat0 / 180) * h;
    mctx.strokeStyle = "#6aa8d8"; mctx.lineWidth = 1;
    mctx.strokeRect(lo - w / 4, la - h / 3, w / 2, (h * 2) / 3);
    if (lo - w / 4 < 0) mctx.strokeRect(lo - w / 4 + w, la - h / 3, w / 2, (h * 2) / 3);
    if (lo + w / 4 > w) mctx.strokeRect(lo - w / 4 - w, la - h / 3, w / 2, (h * 2) / 3);
  }

  // ---- THE HAND -------------------------------------------------------------
  function placeAt(mx, my) {
    let best = -1, bd = 18 * 18;
    places.forEach((p, pi) => {
      if (p.shown < 0.02) return;
      rot(unit(p.lat, p.lon), v3);
      if (v3[2] < 0.1) return;
      const k = Math.min(1, Math.log2(1 + p.shown) / 5.2);
      for (const len of [1, 1 + 0.07 * k, 1 + 0.13 * k]) {
        const dx = CX + v3[0] * R * len - mx, dy = CY - v3[1] * R * len - my, d = dx * dx + dy * dy;
        if (d < bd) { bd = d; best = pi; }
      }
    });
    return best;
  }
  canvas.addEventListener("pointerdown", (e) => {
    dragging = { x: e.clientX, y: e.clientY, lon: lon0, lat: lat0, t: performance.now(), moved: false };
    canvas.setPointerCapture(e.pointerId); canvas.classList.add("is-dragging");
    goalLon = null; vLon = 0;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) dragging.moved = true;
      const k = 90 / R;
      const was = lon0;
      lon0 = dragging.lon - dx * k; lat0 = Math.max(-70, Math.min(70, dragging.lat + dy * k));
      vLon = (lon0 - was) / 0.016;
      tip.hidden = true; kick(); return;
    }
    const pi = placeAt(e.clientX, e.clientY);
    if (pi !== hover) { hover = pi; kick(); }
    canvas.style.cursor = pi >= 0 ? "pointer" : "grab";
    if (pi < 0) { tip.hidden = true; return; }
    const p = places[pi];
    tip.innerHTML = "<b>" + p.region + " · " + p.country + "</b>" + p.notes.join(", ") + "<br>" + p.v + (p.v === 1 ? " fragrance" : " fragrances") + " on the site";
    tip.hidden = false;
    tip.style.left = Math.min(W - 270, e.clientX + 16) + "px"; tip.style.top = e.clientY + 16 + "px";
  });
  const release = (e) => {
    if (!dragging) return;
    const was = dragging; dragging = null; canvas.classList.remove("is-dragging");
    spinFrom = performance.now();
    vLon = Math.max(-120, Math.min(120, vLon));
    if (!was.moved) { const pi = placeAt(e.clientX, e.clientY); if (pi >= 0) lookAt(pi); }
    kick();
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("pointerleave", () => { if (hover >= 0) { hover = -1; kick(); } tip.hidden = true; });
  function lookAt(pi) {
    goalLon = places[pi].lon; goalLat = Math.max(-40, Math.min(50, places[pi].lat * 0.8));
    hover = pi; spinFrom = performance.now() + 4000;
    rankBody.querySelectorAll("tr").forEach((tr) => tr.classList.toggle("is-on", +tr.dataset.i === pi));
    kick();
  }
  rankBody.addEventListener("click", (e) => { const tr = e.target.closest("tr[data-i]"); if (tr) lookAt(+tr.dataset.i); });

  // ---- THE YEARS ------------------------------------------------------------
  const range = document.querySelector(".t3-track input"), knob = document.querySelector(".t3-knob"), fill = document.querySelector(".t3-fill"), when = document.querySelector(".t3-when");
  function setYear(i) {
    yi = i; range.value = i;
    const f = (i / 18) * 100;
    knob.style.left = f + "%"; fill.style.width = f + "%"; when.style.left = f + "%";
    when.style.transform = "translateX(-" + f + "%)";   // kept inside the track at both ends
    when.textContent = i >= 18 ? "All years" : "Up to " + YEARS[i];
    refresh();
  }
  range.addEventListener("input", () => { stopPlay(); setYear(+range.value); });
  const play = document.querySelector(".t3-play");
  let playing = 0;
  function stopPlay() { clearInterval(playing); playing = 0; play.textContent = "▶"; }
  play.addEventListener("click", () => {
    if (playing) { stopPlay(); return; }
    if (scenario >= 0) clearScenario();
    play.textContent = "❚❚";
    let i = yi >= 18 ? 0 : yi;
    setYear(i);
    playing = setInterval(() => { i++; if (i > 18) { stopPlay(); return; } setYear(i); }, STILL ? 300 : 900);
  });

  // ---- THE BUTTONS ------------------------------------------------------------
  const config = document.querySelector(".t3-config");
  const acts = {}; document.querySelectorAll(".t3-act").forEach((b) => (acts[b.dataset.act] = b));
  acts.config.addEventListener("click", () => { config.hidden = !config.hidden; acts.config.setAttribute("aria-pressed", String(!config.hidden)); });
  config.addEventListener("change", (e) => { const k = e.target.dataset.opt; if (k) { OPT[k] = e.target.checked; spinFrom = 0; kick(); } });
  document.addEventListener("pointerdown", (e) => { if (!config.hidden && !config.contains(e.target) && !acts.config.contains(e.target)) { config.hidden = true; acts.config.setAttribute("aria-pressed", "false"); } });
  if (STILL) config.querySelector('[data-opt="spin"]').checked = false;
  const chip = document.querySelector(".t3-scenario");
  acts.scenario.addEventListener("click", () => {
    stopPlay();
    let i;
    do { i = Math.floor(Math.random() * DATA.perfumes.length); } while (i === scenario || !places.some((p) => p.users.includes(i)));
    scenario = i;
    const [name, house, year] = DATA.perfumes[i];
    chip.querySelector("span").textContent = "Scenario · " + name + " · " + house + (year ? " · " + year : "");
    chip.classList.add("is-on");
    refresh();
    const top = places.map((p, pi) => [pi, p.v]).filter((r) => r[1]).sort((a, b) => b[1] - a[1])[0];
    if (top) lookAt(top[0]);
  });
  function clearScenario() { scenario = -1; chip.classList.remove("is-on"); refresh(); }
  chip.querySelector("button").addEventListener("click", clearScenario);
  acts.compare.addEventListener("click", () => { compare = !compare; acts.compare.setAttribute("aria-pressed", String(compare)); drawCharts(); });

  addEventListener("resize", () => { resize(); drawCharts(); });
  document.addEventListener("visibilitychange", () => { last = 0; kick(); });
  resize();
  setYear(18);

  window.TestPage3 = {
    places: () => places.filter((p) => p.v > 0).length,
    year: () => yi, scenario: () => scenario, lon: () => lon0,
    shown: () => places.reduce((s, p) => s + p.shown, 0),
  };
})();

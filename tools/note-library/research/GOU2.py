from acc import out, SAME
S = {
 "fr_cacaobutter": ("https://www.fragrantica.com/notes/Cacao-Butter-1346.html", "Cacao Butter perfume ingredient, Cacao Butter fragrance and essential oils Theobroma Cacao"),
 "fr_cacaopod": ("https://www.fragrantica.com/notes/Cacao-Pod-135.html", "Cacao Pod perfume ingredient, Cacao Pod fragrance and essential oils Theobroma cacao (Sterculiaceae)"),
 "at_amaretto": ("https://ataraxiaperfumery.com/products/amaretto-jazz-in-the-melting-room", "Amaretto Jazz in the Melting Room", "Ataraxia Perfumery"),
 "fr_vestibule": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Vestibule-100362.html", "Vestibule Ataraxia Perfumery perfume - a fragrance for women and men"),
 "fr_condmilk": ("https://www.fragrantica.com/notes/Condensed-Milk-1166.html", "Condensed Milk perfume ingredient, Condensed Milk fragrance and essential oils"),
 "sc_milkbase": ("https://www.scentspiracy.com/bases/p/milk-flavor", "Milk Fragrance Base – Premium Base Ingredient for Perfumery — Scentspiracy"),
 "fr_milknews": ("https://www.fragrantica.com/news/Milk-Notes-in-Perfumes-2748.html", "Milk Notes in Perfumes ~ Raw Materials ~ Fragrantica"),
 "fr_coumarin": ("https://www.fragrantica.com/notes/Coumarin-259.html", "Coumarin perfume ingredient, Coumarin fragrance and essential oils Benzopyrone"),
 "fr_tonkacoum": ("https://www.fragrantica.com/news/Tonka-Beans-and-Coumarin-8140.html", "Tonka Beans and Coumarin ~ Raw Materials ~ Fragrantica"),
 "fr_coumnews": ("https://www.fragrantica.com/news/Coumarin-Sweet-Smell-of-Hay-Cut-Grass-Vanillic-Notes-2965.html", "Coumarin: Sweet Smell of Hay, Cut Grass & Vanillic Notes ~ Raw Materials ~ Fragrantica"),
 "vt_edamame": ("https://vtechworks.lib.vt.edu/items/14f81746-ec74-4cf7-ba9b-b7aee46c8fbb", "Determining Aroma Compounds and Their Relation to Consumer Acceptability in United States Edamame", "VTechWorks, Virginia Tech"),
 "na_soy": ("https://newatlas.com/science/soybeans-improve-taste", "Soybeans Improve Taste", "New Atlas"),
 "fr_halvah": ("https://www.fragrantica.com/news/The-Taste-for-Halvah-and-Its-Rich-Semolina-Flavors-21846.html", "The Taste for Halvah and Its Rich Semolina Flavors ~ Flavour Fusions ~ Fragrantica"),
 "wp_halva": ("https://en.wikipedia.org/wiki/Halva", "Halva - Wikipedia"),
 "fr_sesame": ("https://www.fragrantica.com/notes/Sesame-290.html", "Sesame perfume ingredient, Sesame fragrance and essential oils Sesamum indicum"),
 "fr_hazelnut": ("https://www.fragrantica.com/notes/Hazelnut-141.html", "Hazelnut perfume ingredient, Hazelnut fragrance and essential oils Corylus avellana i Corylus maxima (Betulaceae)"),
 "ps_nuts": ("https://perfumesociety.org/nuts-about-perfume-join-us-in-adoring-these-nutty-scents/", "Nuts about perfume? Join us in adoring THESE nutty scents! - The Perfume Society"),
 "tg_hazelnut": ("https://www.thegoodscentscompany.com/odor/hazelnut.html", "The Good Scents Company -Odor Descriptor Listing for hazelnut", "The Good Scents Company"),
 "wp_prosphora": ("https://en.wikipedia.org/wiki/Prosphora", "Prosphora - Wikipedia"),
 "oc_holybread": ("https://orthochristian.com/69314.html", "Holy Bread", "OrthoChristian.com"),
 "fr_honeynews": ("https://www.fragrantica.com/news/Honey-Notes-in-Perfumery-17145.html", "Honey Notes in Perfumery ~ Raw Materials ~ Fragrantica"),
 "fr_honey": ("https://www.fragrantica.com/notes/Honey-181.html", "Honey perfume ingredient, Honey fragrance and essential oils"),
 "sc_methylpa": ("https://www.scentspiracy.com/fragrance-ingredients/p/methyl-phenylacetate", "Methyl Phenylacetate (101-41-7) – Premium Honey-FLoral Synthetic Ingredient for Perfumery — Scentspiracy"),
 "tg_honeyabs": ("https://www.thegoodscentscompany.com/data/ab1028361.html", "honey absolute, 91052-92-5", "The Good Scents Company"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "adar_incantu": ("https://adarperfumes.com/products/incantu-drops-of-styx", "Incantu: Drops of Styx", "ADAR Perfumes"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "fr_beeswax": ("https://www.fragrantica.com/notes/Beeswax-53.html", "Beeswax perfume ingredient, Beeswax fragrance and essential oils"),
 "fr_frosting": ("https://www.fragrantica.com/notes/Frosting-Glace-745.html", "Frosting [Glacé] perfume ingredient, Frosting [Glacé] fragrance and essential oils"),
 "fr_sugar": ("https://www.fragrantica.com/notes/Sugar-200.html", "Sugar perfume ingredient, Sugar fragrance and essential oils Saccharum Officinarum"),
 "pw_gingerbread": ("https://www.pinewardperfume.com/shop/p/gingerbread", "Gingerbread", "Pineward"),
 "fr_malt": ("https://www.fragrantica.com/notes/Malt-480.html", "Malt perfume ingredient, Malt fragrance and essential oils"),
 "tg_malty": ("https://www.thegoodscentscompany.com/odor/malty.html", "The Good Scents Company -Odor Descriptor Listing for malty", "The Good Scents Company"),
 "fr_maplesyrup": ("https://www.fragrantica.com/notes/Maple-Syrup-447.html", "Maple Syrup perfume ingredient, Maple Syrup fragrance and essential oils"),
 "wp_sotolon": ("https://en.wikipedia.org/wiki/Sotolon", "Sotolon - Wikipedia"),
 "fw_sotolone": ("https://fraterworks.com/products/sotolone", "Sotolone – Fraterworks"),
 "fr_milk": ("https://www.fragrantica.com/notes/Milk-199.html", "Milk perfume ingredient, Milk fragrance and essential oils"),
 "fr_lactmilk": ("https://www.fragrantica.com/news/Theme-of-the-Month-Lactones-vs-Milk-23305.html", "Theme of the Month: Lactones vs. Milk ~ Raw Materials ~ Fragrantica"),
 "fr_molasses": ("https://www.fragrantica.com/notes/Molasses-768.html", "Molasses perfume ingredient, Molasses fragrance and essential oils"),
 "wp_molasses": ("https://en.wikipedia.org/wiki/Molasses", "Molasses - Wikipedia"),
 "fr_treacle": ("https://www.fragrantica.com/perfume/Pineward-Perfumes/Treacle-71217.html", "Treacle Pineward Perfumes perfume - a fragrance for women and men 2021"),
 "lush_murumuru": ("https://www.lush.com/ie/en/i/murumuru-butter", "Murumuru Butter", "Lush"),
 "bno_murumuru": ("https://bulknaturaloils.com/murumuru-butter-virgin-b3075.html", "Murumuru Butter - Virgin", "Bulk Natural Oils"),
 "adar_adhd": ("https://adarperfumes.com/products/adhd-neuro-elixir", "ADHD Neuro Elixir", "ADAR Perfumes"),
 "fr_oat": ("https://www.fragrantica.com/notes/Oat-848.html", "Oat perfume ingredient, Oat fragrance and essential oils"),
 "fr_oatboard": ("https://www.fragrantica.com/board/viewtopic.php?id=53048", "Oat / Oatmeal scent.. (Page 1) — Perfume Selection Tips for Women — Fragrantica Club", "Fragrantica Club"),
 "fr_jmoat": ("https://www.fragrantica.com/perfume/Jo-Malone-London/Oat-Cornflower-48318.html", "Oat & Cornflower Jo Malone London perfume - a fragrance for women and men 2018"),
 "fr_pistachio": ("https://www.fragrantica.com/notes/Pistachio-221.html", "Pistachio perfume ingredient, Pistachio fragrance and essential oils Pistacia vera"),
 "fr_pistachionews": ("https://www.fragrantica.com/news/Pistachio-Notes-in-Perfumes-16941.html", "Pistachio Notes in Perfumes ~ Raw Materials ~ Fragrantica"),
 "fr_potato": ("https://www.fragrantica.com/notes/Potato-1150.html", "Potato perfume ingredient, Potato fragrance and essential oils Solanum Tuberosum"),
 "fw_potato": ("https://fraterworks.com/products/potato-pyrazine", "Potato Pyrazine – Fraterworks"),
 "fr_polishpotato": ("https://www.fragrantica.com/perfume/Bohoboco/Polish-Potatoes-98104.html", "Polish Potatoes Bohoboco perfume - a new fragrance for women and men 2024"),
}
N = {
 "note-cocoa-butter": dict(
  say="The pale fat pressed from cocoa beans, the base of white chocolate and of many skin creams. It smells nothing like dark chocolate: soft, creamy and milky, faintly sweet and a little nutty, the warm, comforting smell of a cocoa-butter body lotion.",
  src=["fr_cacaobutter", "fr_cacaopod", "at_amaretto"],
  vars={"Cacao Butter": dict(same=SAME)}),
 "note-cocoa-pod": dict(
  say="Not the roasted bean but the fresh fruit it grows in: a freshly split husk and the wet, pale pulp around the beans. It smells green and slightly bitter, with a faint tropical sweetness, creamy yet dry, sometimes with a hint of banana leaf or fig skin: more botanical than chocolatey.",
  src=["fr_cacaopod", "fr_vestibule"]),
 "note-condensed-milk": dict(
  say="Milk cooked down with sugar until thick: sweet, gooey and warm, creamy and syrupy, with a caramelised edge. There is no milk in a perfume; it is built from lactones, soft musks and sweet molecules, and it makes a gourmand feel comforting, like childhood.",
  src=["fr_condmilk", "sc_milkbase", "fr_milknews"]),
 "note-coumarin": dict(
  say="The molecule that smells of fresh hay and tonka beans, first found in tonka and first made in a lab in 1868. It is sweet and warm, like hay drying in the sun and like almond and vanilla, and its character shifts with the dose. Fougère Royale in 1884 built a whole family of perfumes, the fougères, on it, and it is still one of the most used materials in perfumery.",
  src=["fr_coumarin", "fr_tonkacoum", "fr_coumnews"]),
 "note-edamame": dict(
  say="Young green soybeans, steamed in the pod. Their smell is green, grassy and beany, a little nutty, with a mushroom-like earthiness, from hexanal and a few similar molecules. As a note it is savoury and green, an odd, fresh, vegetal touch in a sweet perfume.",
  src=["vt_edamame", "na_soy", "fr_vestibule"]),
 "note-halva": dict(
  say="The sweet made in the Middle East, the Balkans and beyond, most often from sesame paste (tahini) and sugar or honey. It smells nutty and sweet, like roasted sesame and tahini, earthy, bready and soft, dense and a little oily. It gives a gourmand a nutty, Eastern warmth.",
  src=["fr_halvah", "wp_halva", "fr_sesame"]),
 "note-hazelnut": dict(
  say="The small round nut of praline and chocolate spreads: savoury, nutty and woody, and when roasted warm, toasty and sweet, like chestnuts sold in winter streets. Fresh, it is greener. It rounds out chocolate, coffee and milky gourmands.",
  src=["fr_hazelnut", "ps_nuts", "tg_hazelnut"]),
 "note-holy-bread": dict(
  say="Prosphora, the bread of the Orthodox communion: a small leavened loaf of just white flour, water, yeast and salt, made in two layers and stamped with a cross before it is baked, with prayer. It smells of plain, pale, freshly baked bread, soft and warm, and in a perfume it carries the quiet of a church with it.",
  src=["wp_prosphora", "oc_holybread", "at_amaretto"]),
 "note-honey": dict(
  say="Sweet, thick and golden, and more complicated than it seems: floral and waxy, with warm tobacco and even a little chocolate, and underneath an animal, almost urine-like edge that some noses catch more than others. That doubleness comes from phenylacetic acid, the molecule behind most honey notes.",
  src=["fr_honeynews", "fr_honey", "sc_methylpa"],
  vars={
   "Black Honey": dict(say="A dark honey: deeper and more bitter, less floral, heavier and closer to molasses, with the honey's animal side stronger.", src=["adar_incantu", "fr_honeynews"]),
   "Honey Absolute": dict(say="Honey as a real natural extract, taken from the honeycomb with solvents, rather than a honey accord built from molecules: thick, waxy and warm, with beeswax and hay in it.", src=["tg_honeyabs", "wp_absolute", "fr_honeynews"]),
   "Raw Honey": dict(say="Pineward's word for honey at its most natural, unheated and unfiltered: the comb's waxy, floral side still in it rather than a clean, sugary sweetness.", src=["pw_list", "fr_honeynews"]),
  }),
 "note-honeycomb": dict(
  say="Honey still in its wax cells. It smells of honey and beeswax together: sweet and golden, waxy, with hay, a little pollen and a softly animal warmth, a whole hive rather than a jar.",
  src=["fr_honeynews", "fr_beeswax", "at_amaretto"]),
 "note-icing": dict(
  say="Sugar and liquid beaten into a sweet glaze for cakes: very sweet and a little powdery, smooth, often with vanilla or lemon. It is built from sugary molecules and makes a gourmand feel like a bakery counter.",
  src=["fr_frosting", "fr_sugar", "pw_gingerbread"]),
 "note-malt": dict(
  say="Grain, usually barley, sprouted and dried with hot air: the heart of beer, whisky and malted milk. It smells savoury-sweet, toasty and bready, like roasted barley, with a soft milky, honeyed side.",
  src=["fr_malt", "tg_malty"]),
 "note-maple": dict(
  say="Maple syrup: sweet, warm and caramel-like, like burnt sugar and pancakes. Much of it comes from sotolon, a molecule that smells of maple syrup when faint and of fenugreek and curry when strong. It is cosy and breakfast-sweet.",
  src=["fr_maplesyrup", "wp_sotolon", "fw_sotolone"]),
 "note-milk": dict(
  say="Milk is never in the bottle: the note is an illusion, built from lactones, soft musks and a little sweetness, sometimes with vanilla or sandalwood. It is creamy, gently sweet and a little powdery, cosy and comforting, soft skin more than a glass of milk.",
  src=["fr_milk", "fr_milknews", "fr_lactmilk"],
  vars={"Milk Accord": dict(same="No change: milk in perfume is always an accord, built from other materials.")}),
 "note-molasses": dict(
  say="The dark syrup left when sugar is refined from cane: sweet but earthy, thick and burnt, like treacle and dark caramel, with a slight bitterness. It is what rum is made from, and it brings a deep, Christmassy sweetness.",
  src=["fr_molasses", "wp_molasses", "fr_treacle"],
  vars={
   "Molasses Distillate": dict(say="Molasses distilled: its volatile, aromatic part without the sticky sugar, drier, lighter and more rum-like than the syrup itself.", src=["pw_gingerbread", "wp_molasses"]),
  }),
 "note-murumuru-butter": dict(
  say="A butter pressed from the seeds of a spiny Amazonian palm, used in skin care. Refined, it smells of almost nothing; the virgin butter is gently nutty, a little like coconut oil. As a note it is soft, creamy and skin-like.",
  src=["lush_murumuru", "bno_murumuru", "adar_adhd"]),
 "note-oat": dict(
  say="Oats: warm, soft and a little nutty, dry like the grain and creamy like porridge or oat milk. It is a quiet, comforting, not very sweet gourmand, the smell of oat biscuits from the oven.",
  src=["fr_oat", "fr_oatboard", "fr_jmoat"],
  vars={
   "Oat Grains": dict(same="No change: oats, named as the grain."),
   "Oatmeal": dict(say="Oats cooked into porridge: warmer, creamier and milkier than the dry grain, a little sweet, like a bowl of oatmeal with milk.", src=["fr_oatboard", "fr_oat"]),
  }),
 "note-pistachio": dict(
  say="The green nut: savoury, nutty and green, with less milky creaminess than almond. In gourmands it often becomes pistachio ice cream, sweet and creamy; lighter versions stay airy and fresh.",
  src=["fr_pistachio", "fr_pistachionews"]),
 "note-potato": dict(
  say="The humble potato: earthy and starchy, damp soil when raw, and roasted and nutty when baked. Perfumers can use a pyrazine that smells of baked potato and roasted nuts. It is an odd, earthy, very real note.",
  src=["fr_potato", "fw_potato", "fr_polishpotato"]),
}
out("GOU2", S, N)

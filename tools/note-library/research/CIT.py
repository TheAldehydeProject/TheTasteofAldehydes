from acc import out, SAME
S = {
 "fr_berg": ("https://www.fragrantica.com/notes/Bergamot-75.html", "Bergamot perfume ingredient, Bergamot fragrance and essential oils Citrus bergamia"),
 "ps_berg": ("https://perfumesociety.org/ingredients-post/bergamot/", "Bergamot - The Perfume Society"),
 "wp_berg": ("https://en.wikipedia.org/wiki/Bergamot_essential_oil", "Bergamot essential oil - Wikipedia"),
 "oz_berg": ("https://www.osmoz.com/inspiration/questions-selections/760/what-bergamot-smell-like", "What does bergamot smell like? Learn more about this scent"),
 "mab_berg": ("https://marcantoinebarrois.com/blogs/guide/bergamot-perfume", "Bergamot Perfume and the Radiant Soul of Calabria", "Marc-Antoine Barrois"),
 "la_walk": ("https://lesabstraits.com/products/philosophers-walk", "Philosopher's Walk", "Les Abstraits"),
 "adar_root": ("https://adarperfumes.com/products/root-code", "Root Code", "ADAR Perfumes"),
 "fr_bitter": ("https://www.fragrantica.com/notes/Bitter-Orange-79.html", "Bitter Orange perfume ingredient, Bitter Orange fragrance and essential oils Citrus bigaradia"),
 "fw_bitter": ("https://fraterworks.com/products/bitter-orange-oil", "Bitter Orange Oil – Fraterworks"),
 "ps_bitter": ("https://perfumesociety.org/ingredients-post/bitter-orange/", "Bitter orange - The Perfume Society"),
 "ps_solar": ("https://perfumesociety.org/the-solar-quartet-decoding-the-bitter-orange-trees-gifts-to-perfumery/", "The Solar Quartet: decoding the Bitter Orange tree's gifts to perfumery - The Perfume Society"),
 "fr_blood": ("https://www.fragrantica.com/notes/Blood-Orange-286.html", "Blood Orange perfume ingredient, Blood Orange fragrance and essential oils Citrus sinensis"),
 "ps_blood": ("https://perfumesociety.org/ingredients-post/blood-orange/", "Blood orange - The Perfume Society"),
 "ps_scarlet": ("https://perfumesociety.org/scarlet-segments-joyously-juicy-blood-orange/", "Scarlet Segments – Joyously Juicy Blood Orange - The Perfume Society"),
 "wp_citron": ("https://en.wikipedia.org/wiki/Citron", "Citron - Wikipedia"),
 "fr_citron": ("https://www.fragrantica.com/notes/Citron-373.html", "Citron perfume ingredient, Citron fragrance and essential oils Citrus medica"),
 "ps_citron": ("https://perfumesociety.org/ingredients-post/citron/", "Citron - The Perfume Society"),
 "fw_cedrat": ("https://fraterworks.com/products/cedrat-oil-italy", "Cedrat Oil, Italy – Fraterworks"),
 "wp_extract": ("https://en.wikipedia.org/wiki/Fragrance_extraction", "Fragrance extraction - Wikipedia"),
 "fr_extract": ("https://www.fragrantica.com/news/From-Tincture-To-Supercritical-Extraction-Methods-Of-Natural-Aroma-Extraction-8724.html", "From Tincture To Supercritical Extraction — Methods Of Natural Aroma Extraction ~ Raw Materials ~ Fragrantica"),
 "fr_citruses": ("https://www.fragrantica.com/notes/Citruses-313.html", "Citruses perfume ingredient, Citruses fragrance and essential oils Citrus"),
 "pf_citrus": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21858179/formulating-with-citrus-new-developments-in-citrus-fragrance-ingredients", "Formulating with Citrus: New Developments in Citrus Fragrance Ingredients | Perfumer & Flavorist"),
 "fr_clem": ("https://www.fragrantica.com/notes/Clementine-84.html", "Clementine perfume ingredient, Clementine fragrance and essential oils Citrus clementina"),
 "fr_myclem": ("https://www.fragrantica.com/news/My-Clementine-from-Aphorismes-by-Dominique-Ropion-A-Monument-to-Citrus-22200.html", "My Clémentine from Aphôrismes by Dominique Ropion: A Monument to Citrus ~ Fragrance Reviews ~ Fragrantica"),
 "fr_grape": ("https://www.fragrantica.com/notes/Grapefruit-76.html", "Grapefruit perfume ingredient, Grapefruit fragrance and essential oils Citrus Aurantium"),
 "pf_noot": ("https://www.perfumerflavorist.com/flavor/ingredients/article/21858930/molecule-of-the-month-nootkatone", "Molecule of the Month: Nootkatone | Perfumer & Flavorist"),
 "sc_grape": ("https://www.scentspiracy.com/fragrance-ingredients/p/grapefruit-white-oil", "Grapefruit Oil (CAS 8016-20-4) – Natural Citrus Essential Oil for Fine Perfumery — Scentspiracy"),
 "fw_pinkgrape": ("https://fraterworks.com/products/grapefruit-oil-pink", "Grapefruit Oil, Pink – Fraterworks"),
 "am_grape": ("https://www.amrita.net/blog/this-or-that-pink-grapefruit-vs-white-grapefruit/", "This or That: Pink Grapefruit vs. White Grapefruit", "Amrita Aromatherapy"),
 "fw_greenmand": ("https://fraterworks.com/products/mandarin-oil-green", "Mandarin Oil, Green – Fraterworks"),
 "st_greenmand": ("https://www.scentree.co/en/Mandarin_oil_(green).html", "ScenTree - Mandarin oil (green) (CAS N° 8008-31-10)"),
 "ps_mand": ("https://perfumesociety.org/ingredients-post/mandarin/", "Mandarin - The Perfume Society"),
 "fr_lemon": ("https://www.fragrantica.com/notes/Lemon-77.html", "Lemon perfume ingredient, Lemon fragrance and essential oils Citrus limon"),
 "fr_lemonnews": ("https://www.fragrantica.com/news/Lemon-in-Perfumes-3143.html", "Lemon in Perfumes ~ Raw Materials ~ Fragrantica"),
 "fw_lemon": ("https://fraterworks.com/products/lemon-oil-terpeneless", "Lemon Oil FCF, Terpeneless – Fraterworks"),
 "lo_lemon": ("https://www.loacker.com/arabia/en/about-us/quality-from-nature/lemon-oil", "Lemon Oil", "Loacker"),
 "vda_lemon": ("https://www.ventdesaromes.com/gb/essential-oils-from-abroad/205-organic-lemon-essential-oil-origin-sicily.html", "Organic Lemon essential oil origin Sicily", "Vent des Arômes"),
 "fw_perslime": ("https://fraterworks.com/products/persian-lime-oil-fcf", "Persian Lime Oil, FCF – Fraterworks"),
 "fw_limedist": ("https://fraterworks.com/products/lime-oil-distilled", "Lime Oil, Distilled – Fraterworks"),
 "pf_lime": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21861449/comparative-study-of-the-essential-oils-of-key-and-persian-limes", "Comparative Study of the Essential Oils of Key and Persian Limes | Perfumer & Flavorist"),
 "fr_orange": ("https://www.fragrantica.com/notes/Orange-80.html", "Orange perfume ingredient, Orange fragrance and essential oils Citrus sinensis"),
 "ps_orange": ("https://perfumesociety.org/ingredients-post/orange/", "Orange - The Perfume Society"),
 "gv_pera": ("https://www.givaudan.com/fragrance-beauty/fragrance-ingredients-business/natural-ingredients/orange-pera-oil-brazil", "Orange Pera Oil Brazil", "Givaudan"),
 "lush_orange": ("https://www.lush.com/uk/en/i/brazilian-orange-oil", "Brazilian Orange Oil", "Lush"),
 "ps_petit": ("https://perfumesociety.org/ingredients-post/petitgrain/", "Petitgrain - The Perfume Society"),
 "wp_petit": ("https://en.wikipedia.org/wiki/Petitgrain", "Petitgrain - Wikipedia"),
 "pf_petit": ("https://www.perfumerflavorist.com/flavor/ingredients/article/22888503/berj-inc-paraguays-green-gold-the-aromatic-power-of-petitgrain-oil", "Paraguay's Green Gold – The Aromatic Power of Petitgrain Oil | Perfumer & Flavorist"),
 "fr_tang": ("https://www.fragrantica.com/notes/Tangerine-85.html", "Tangerine perfume ingredient, Tangerine fragrance and essential oils Citrus Reticulata"),
 "ps_tang": ("https://perfumesociety.org/ingredients-post/tangerine/", "Tangerine - The Perfume Society"),
 "fr_yuzu": ("https://www.fragrantica.com/notes/Yuzu-83.html", "Yuzu perfume ingredient, Yuzu fragrance and essential oils Citrus junos"),
 "ps_yuzu": ("https://perfumesociety.org/ingredients-post/yuzu/", "Yuzu - The Perfume Society"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
}
N = {
 "note-bergamot": dict(
  say="A small, knobbly citrus, somewhere between a lemon and a bitter orange, grown almost entirely on the coast of Calabria, the toe of Italy. Its peel is pressed into an oil that smells bright, tart and a little bitter, like lemon and mandarin at once, with something floral, gently spicy and tea-like underneath: it is the smell of Earl Grey. It is more elegant and more complex than the other citruses, and it opens more perfumes than any other note, above all colognes, chypres and fougères, giving the first minutes their lift and their air.",
  src=["fr_berg", "ps_berg", "wp_berg", "oz_berg"],
  vars={
   "Bergamot (Ionian Coast)": dict(say="Bergamot from the Ionian coast of Calabria, the strip of land between the Aspromonte mountains and the sea where nearly all the world's bergamot is grown. The house is naming where it comes from, the region whose oil every other bergamot is measured against: bright, green and floral, and full.", src=["la_walk", "mab_berg", "wp_berg"]),
   "Bergamot Peel": dict(same="No change: bergamot oil is pressed from the peel anyway; this only names the part it comes from."),
   "Electric Bergamot": dict(say="Not another kind of bergamot but ADAR's own word for the one in Root Code: the peel's sharp, sparkling side, the fizz of its first minute, put forward.", src=["adar_root", "fr_berg"]),
  }),
 "note-bitter-orange": dict(
  say="The Seville orange, too sour to eat, and the most generous tree in perfumery: its peel gives this oil, its blossom gives neroli and orange flower, and its leaves and twigs give petitgrain. The peel smells fresher and drier than sweet orange: tart, bitter like the pith, with a green and faintly floral undertone and a sweetness that stays longer than you would expect of a citrus. It is one of the classic openings of eau de cologne.",
  src=["fr_bitter", "fw_bitter", "ps_bitter", "ps_solar"]),
 "note-blood-orange": dict(
  say="A sweet orange whose flesh has turned red. It smells like orange made deeper and sweeter and less sharp, with a juicy, berry-like tartness that people often call a hint of raspberry. The name is only its colour: there is nothing metallic or bloody about it. Because it is rounder than lemon or bergamot, it slides easily into leather, tobacco, woods, spices and resins.",
  src=["fr_blood", "ps_blood", "ps_scarlet"]),
 "note-citron": dict(
  say="The ancient citrus, cédrat in French, and one of the few wild fruits most other citruses descend from: big, knobbly and almost all thick rind. Pressed, the rind gives a dry, zesty oil, lemony but less sweet, with an elegant bitterness and a soft floral edge, and it lasts a little longer than most citrus. It has been used in colognes for centuries.",
  src=["wp_citron", "fr_citron", "ps_citron", "fw_cedrat"],
  vars={
   "Expressed Citron": dict(say="Citron oil pressed cold from the rind rather than distilled with steam. Pressing uses no heat, so the oil keeps the fresh, natural smell of the fruit itself; it is how nearly all citrus oils are made, and the name is saying this is the fresh kind.", src=["wp_extract", "fr_extract"]),
  }),
 "note-citrus": dict(
  say="No single fruit: the whole family of citrus peels, lemon, orange, bergamot, mandarin, grapefruit and lime, used together for a bright, sparkling, clean opening. Perfumers call them hesperidic, after the Hesperides, the nymphs who kept a garden of golden fruit. They are nearly all pressed cold from the peel to keep them fresh; they make the first minutes of a perfume feel sunny and awake, and they are the first thing to go.",
  src=["fr_citruses", "pf_citrus", "wp_extract"],
  vars={"Citruses": dict(same=SAME)}),
 "note-clementine": dict(
  say="A small, seedless mandarin, the Christmas mandarin, and its note smells like peeling one: sweet, juicy and soft, hardly bitter at all. Some clementine oils carry a little tartness from the twigs and unripe fruit, and a faint orange-blossom sweetness. It is the friendliest of the citruses: an opening that smiles rather than sparkles.",
  src=["fr_clem", "fr_myclem"]),
 "note-grapefruit": dict(
  say="Tart, bitter and juicy, like the fruit cut open. Most of what makes it smell of grapefruit is one molecule, nootkatone, present in the peel in tiny amounts, and nootkatone also smells faintly of wood and vetiver, so grapefruit lasts longer than most citrus and leans towards the woods as it fades. It is bright and energising, a favourite of fresh, sporty and masculine perfumes.",
  src=["fr_grape", "pf_noot", "sc_grape"],
  vars={
   "White Grapefruit": dict(say="Oil from white, pale-fleshed grapefruit rather than pink: drier, sharper and more bitter, with an edge almost like tonic water's quinine, where pink grapefruit is sweeter, juicier and a little berry-like.", src=["fw_pinkgrape", "am_grape"]),
  }),
 "note-green-mandarin": dict(
  say="Mandarin pressed while the fruit is still green and unripe: sharper, tarter and leafier than the sweet, candied smell of ripe mandarin, with a floral hint. It is the smell left on your hands after peeling one. Perfumers prefer it to the ripe kinds, and use it in fresh colognes and to brighten woody men's perfumes.",
  src=["fw_greenmand", "st_greenmand", "ps_mand"]),
 "note-lemon": dict(
  say="Pressed cold from the peel, so it smells like the fruit's fresh zest: sharp, sour, clean and sparkling, with a sweet, almost sherbet brightness. It is one of the lightest notes there is, opening a perfume brilliantly and among the first things to fade. Lemon is the heart of the classic cologne, and in almost any perfume it reads as clean and cheerful.",
  src=["fr_lemon", "fr_lemonnews", "fw_lemon"],
  vars={
   "Lemon (Italy)": dict(say="Lemon from Italy, where nine in ten lemon groves are in Sicily and Calabria, on rich volcanic soil. Italian, and above all Sicilian, lemon oil is the classic one, the bright, clean standard other citrus oils are measured against.", src=["lo_lemon", "vda_lemon"]),
   "Lemon Peel": dict(same="No change: lemon oil is pressed from the peel anyway; this only names the part it comes from."),
   "Sicilian Lemon": dict(say="Lemon from Sicily, the island most of Italy's lemons grow on, whose oil is thought the finest there is: the bright, clean standard other citrus oils are measured against.", src=["lo_lemon", "vda_lemon", "fr_lemon"]),
  }),
 "note-lime": dict(
  say="Greener, sharper and more bitter than lemon, with a sherbet fizz. How it is made changes it more than for any other citrus: pressed cold from the peel it is fresh, zesty and true to the fruit; distilled with steam it turns greener and denser, with a sweet, hay-like side. Either way it sits at the very top of a perfume, bright and quick.",
  src=["fw_perslime", "fw_limedist", "pf_lime"],
  vars={
   "Cold-Pressed Lime": dict(say="Lime pressed cold from the peel rather than distilled: truer to the fruit, fresher, zestier and more complex, where distilled lime is greener and denser.", src=["fw_perslime", "fw_limedist", "wp_extract"]),
   "Lime Rind": dict(same="No change: the rind is the peel, which is where lime oil comes from anyway."),
  }),
 "note-orange": dict(
  say="Sweet orange: the peel of the everyday orange, pressed. It smells sweet, juicy, fresh and tangy, exactly like an orange being peeled: cheerful and round, less bitter than bitter orange and warmer than lemon. It is one of the most used materials in perfumery and one of the most fleeting, opening colognes and fruity florals and warming ambers.",
  src=["fr_orange", "ps_orange"],
  vars={
   "Brazilian Orange": dict(say="Sweet orange oil from Brazil, the world's largest grower of oranges, where the oil is collected as the fruit is pressed for juice. It is the everyday orange oil at its most typical: fresh and sweet, like squeezed peel.", src=["gv_pera", "lush_orange"]),
  }),
 "note-petitgrain": dict(
  say="Not from the fruit but from the leaves and green twigs of the bitter orange tree, distilled with steam. It has something of neroli's sweetness but is woodier, greener and more bitter: the smell of a leaf crushed between your fingers in a shaded orange grove. It is fresh with a slightly masculine edge, a staple of colognes, and most of it now comes from Paraguay.",
  src=["ps_petit", "wp_petit", "pf_petit"]),
 "note-tangerine": dict(
  say="Almost the same fruit as mandarin, named after Tangier in Morocco, where it was shipped from, and it smells almost the same: sweet, fruity and zesty, with a touch of honey and a hint of neroli. It is light and quick, an opening that cheers you up and then flits off.",
  src=["fr_tang", "ps_tang", "ps_mand"]),
 "note-yuzu": dict(
  say="A Japanese citrus used for its peel, and it smells like several citruses at once: the bitter side of grapefruit, lime, bergamot and a little mandarin. It is tart and zesty rather than juicy, green, with a sharp, almost aldehydic sparkle and a faint resinous edge. Perfumers like it because it is more complex than lemon and helps other citrus notes last longer.",
  src=["fr_yuzu", "ps_yuzu"],
  vars={
   "Sweet Yuzu": dict(say="Not another fruit but Pineward's word for its yuzu: the sweeter, mandarin-and-orange side of the peel put forward, over its sharp and sour side.", src=["pw_list", "fr_yuzu"]),
  }),
}
out("CIT", S, N)

from acc import out, SAME
S = {
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "tg_raisin": ("https://www.thegoodscentscompany.com/odor/raisin.html", "Odor Descriptor Listing for raisin - The Good Scents Company", "The Good Scents Company"),
 "fr_brownsugar": ("https://www.fragrantica.com/notes/Brown-Sugar-521.html", "Brown Sugar perfume ingredient, Brown Sugar fragrance and essential oils"),
 "fr_rice": ("https://www.fragrantica.com/notes/Rice-208.html", "Rice perfume ingredient, Rice fragrance and essential oils Oryza family Poaceae"),
 "fr_ricenews": ("https://www.fragrantica.com/news/Rice-Notes-in-Perfumes-16559.html", "Rice Notes in Perfumes ~ Raw Materials ~ Fragrantica"),
 "fr_ricestand": ("https://www.fragrantica.com/news/Rice-Perfumes-That-Stand-Out-From-the-Crowd-13855.html", "Rice Perfumes That Stand Out From the Crowd ~ Columns ~ Fragrantica"),
 "wp_seedcake": ("https://en.wikipedia.org/wiki/Caraway_seed_cake", "Caraway seed cake - Wikipedia"),
 "fr_caraway": ("https://www.fragrantica.com/notes/Caraway-121.html", "Caraway perfume ingredient, Caraway fragrance and essential oils Carum carvi"),
 "fr_sugar": ("https://www.fragrantica.com/notes/Sugar-200.html", "Sugar perfume ingredient, Sugar fragrance and essential oils Saccharum Officinarum"),
 "ps_sugar": ("https://perfumesociety.org/ingredients-post/sugar/", "Sugar - The Perfume Society"),
 "sc_maltol": ("https://www.scentspiracy.com/blog/ethyl-maltol-vs-maltol-which-works-better-in-perfumery", "Maltol vs Ethyl Maltol: Technical & Sensory Comparison for Modern Gourmand Perfumery — Scentspiracy"),
 "fr_tobacco": ("https://www.fragrantica.com/notes/Tobacco-96.html", "Tobacco perfume ingredient, Tobacco fragrance and essential oils Nicotiana tabacum (Solanaceae)"),
 "ps_tobacco": ("https://perfumesociety.org/ingredients-post/tobacco/", "Tobacco - The Perfume Society"),
 "sc_tobabs": ("https://www.scentspiracy.com/fragrance-ingredients/p/tobacco-absolute", "Tobacco Absolute (84961-66-0): Leathery & Sweet Hay Profile – Fragrance Ingredient — Scentspiracy"),
 "fr_tobnews": ("https://www.fragrantica.com/news/Tobacco-in-Perfumery-History-Chemistry-11589.html", "Tobacco in Perfumery: History & Chemistry ~ Raw Materials ~ Fragrantica"),
 "fw_tobabs": ("https://fraterworks.com/products/tobacco-signature-absolute", "Tobacco “Signature” Absolute – Fraterworks"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "wp_brightleaf": ("https://en.wikipedia.org/wiki/Types_of_tobacco", "Types of tobacco - Wikipedia"),
 "fr_whitetob": ("https://www.fragrantica.com/notes/White-Tobacco-345.html", "White Tobacco perfume ingredient, White Tobacco fragrance and essential oils Nicotiana Suaveolens"),
 "fr_tobacolor": ("https://www.fragrantica.com/perfume/Dior/Tobacolor-65551.html", "Tobacolor Dior perfume - a fragrance for women and men"),
 "fr_hotstuff": ("https://www.fragrantica.com/perfume/Grande/Hot-Stuff-114957.html", "Hot Stuff Grande perfume - a fragrance for women and men"),
 "fr_toffee": ("https://www.fragrantica.com/notes/Toffee-434.html", "Toffee perfume ingredient, Toffee fragrance and essential oils"),
 "fr_caramel": ("https://www.fragrantica.com/notes/Caramel-183.html", "Caramel perfume ingredient, Caramel fragrance and essential oils"),
 "wp_toffee": ("https://en.wikipedia.org/wiki/Toffee", "Toffee - Wikipedia"),
 "fr_tonka": ("https://www.fragrantica.com/notes/Tonka-Bean-73.html", "Tonka Bean perfume ingredient, Tonka Bean fragrance and essential oils Dipterix Odorata"),
 "ps_tonka": ("https://perfumesociety.org/ingredients-post/tonka/", "Tonka - The Perfume Society"),
 "fw_tonka": ("https://fraterworks.com/products/tonka-bean-absolute", "Tonka Bean “Signature\" Absolute – Fraterworks"),
 "st_tonka": ("https://www.scentree.co/en/Tonka_bean_absolute.html", "ScenTree - Tonka bean absolute (CAS N° 8024-04-2)"),
 "fr_vanilla": ("https://www.fragrantica.com/notes/Vanilla-74.html", "Vanilla perfume ingredient, Vanilla fragrance and essential oils"),
 "fw_vanbourbon": ("https://fraterworks.com/products/vanilla-bourbon-absolute", "Vanilla Bourbon Absolute – Fraterworks"),
 "tg_vanabs": ("https://www.thegoodscentscompany.com/data/ab1101871.html", "vanilla bean absolute (vanilla planifolia), 8024-06-4", "The Good Scents Company"),
 "wp_vanilla": ("https://en.wikipedia.org/wiki/Vanilla", "Vanilla - Wikipedia"),
 "fr_nestbourbon": ("https://www.fragrantica.com/news/NEST-New-York-Vanilla-Bourbon-20740.html", "NEST New York Vanilla Bourbon ~ Fragrance News ~ Fragrantica"),
 "ch_caviar": ("https://www.chowhound.com/1766892/what-is-vanilla-caviar/", "Vanilla Caviar Is The Secret To Deeper, Richer Desserts (Without Any Fish Necessary)", "Chowhound"),
 "vb_caviar": ("https://vanillabazaar.com/madagascan-vanilla-caviar-20g-156.html", "Organic Madagascan Vanilla Caviar", "Vanilla Bazaar"),
 "at_amaretto": ("https://ataraxiaperfumery.com/products/amaretto-jazz-in-the-melting-room", "Amaretto Jazz in the Melting Room", "Ataraxia Perfumery"),
 "wp_anglaise": ("https://en.wikipedia.org/wiki/Cr%C3%A8me_anglaise", "Crème anglaise - Wikipedia"),
 "fr_vanillaash": ("https://www.fragrantica.com/perfume/Grande/Vanilla-Ash-133544.html", "Vanilla Ash Grande perfume - a fragrance for women and men"),
 "fr_wheat": ("https://www.fragrantica.com/notes/Wheat-387.html", "Wheat perfume ingredient, Wheat fragrance and essential oils Triticum"),
 "ps_wheat": ("https://perfumesociety.org/ingredients-post/wheat/", "Wheat - The Perfume Society"),
 "ps_wheatbarley": ("https://perfumesociety.org/softly-gathered-the-scents-of-wheat-barley/", "Softly Gathered: The Scents of Wheat & Barley - The Perfume Society"),
 "pw_gingerbread": ("https://www.pinewardperfume.com/shop/p/gingerbread", "Gingerbread", "Pineward"),
 "wp_bran": ("https://en.wikipedia.org/wiki/Bran", "Bran - Wikipedia"),
 "fr_wheatboard": ("https://www.fragrantica.com/board/viewtopic.php?id=290333", "Scent that smells like wheat, barley, bran, cereal JM Poppy & Barley? (Page 1) — Perfume Selection Tips for Women — Fragrantica Club", "Fragrantica Club"),
}
BLOND = "Blond tobacco, the bright, golden leaf cured with heat, as for Virginia cigarettes, rather than dark tobacco: lighter, sweeter and more honeyed, like hay and dried fruit, with none of a dark cigar's smoke and weight."
N = {
 "note-raisin-cookies": dict(
  say="Biscuits baked with raisins: buttery, brown-sugary dough, warm from the oven, with the dark, sticky, winey sweetness of the raisins in it. It is Pineward's picture of a kitchen, homely and sweet.",
  src=["pw_list", "tg_raisin", "fr_brownsugar"]),
 "note-rice": dict(
  say="Steamed rice, and above all basmati: warm and cosy, starchy and a little nutty, grassy and faintly earthy, with a soft, milky sweetness. Its steamed-basmati smell comes largely from a single molecule. Rice powder, another take, is powdery and soft, built with iris. It is a homely, feel-good note.",
  src=["fr_rice", "fr_ricenews", "fr_ricestand"]),
 "note-seed-cake": dict(
  say="An old British teacake of flour, butter, sugar and eggs, flavoured with caraway seeds, loved since the sixteenth century and in the Victorian era. It smells buttery and sweet like a pound cake, with the warm, slightly minty, rye-bread spice of caraway through it.",
  src=["wp_seedcake", "pw_list", "fr_caraway"]),
 "note-sugar": dict(
  say="Sugar itself has no smell, so perfumers build its idea: sweet, warm and faintly burnt, from molecules like maltol and ethyl maltol that smell of caramel, candyfloss and jam. It can be airy like spun sugar or dark like caramel, and it makes a perfume sweeter and more edible.",
  src=["fr_sugar", "ps_sugar", "sc_maltol"]),
 "note-tobacco": dict(
  say="Dried, cured tobacco leaf, not smoke. In a perfume it is warm, sweet and honeyed, like hay, dried fruit and tea, with a little leather, cocoa and flowers: more like a humidor or a pouch of pipe tobacco than an ashtray. Strong, the absolute is dark and almost unpleasant; diluted, it becomes one of the richest notes there is.",
  src=["fr_tobacco", "ps_tobacco", "sc_tobabs", "fr_tobnews"],
  vars={
   "Tobacco Absolute": dict(say="Tobacco as the real natural extract, taken from cured leaves with solvents, rather than a tobacco accord built from other materials: denser and more complex, honeyed, hay-like, fruity and leathery.", src=["fw_tobabs", "sc_tobabs", "wp_absolute"]),
   "Tobacco Blonde": dict(say=BLOND, src=["wp_brightleaf", "fr_tobnews"]),
   "Blonde Tobacco": dict(say=BLOND, src=["wp_brightleaf", "fr_tobnews"]),
   "Blond Tobacco": dict(say=BLOND, src=["wp_brightleaf", "fr_tobnews", "pw_list"]),
   "White Tobacco": dict(say="Not smoke or leaf but a flower: the white blossom of a tobacco plant, sweet and opulently floral, with only a hint of hay.", src=["fr_whitetob", "fr_tobacolor"]),
   "Tobacco Leaf": dict(same="No change: tobacco in perfume is the dried leaf already."),
   "Soft Tobacco Leaf": dict(say="Tobacco leaf made gentle: its sweet, hay-like, honeyed side put forward and its dark, leathery edge softened.", src=["fr_hotstuff", "fr_tobacco"]),
  }),
 "note-toffee": dict(
  say="Sugar and butter boiled until hard and glossy: sweet and buttery, with burnt sugar and a slightly smoky edge, rich and chewy, between caramel and condensed milk. It is gourmand comfort, like caramel popcorn.",
  src=["fr_toffee", "fr_caramel", "wp_toffee"]),
 "note-tonka": dict(
  say="A black, wrinkled bean from South America, almost nine tenths of whose absolute is coumarin. It smells warm and sweet like vanilla, but also like hay, almond, cinnamon, praline and a little tobacco: bigger, drier and more sensual than vanilla. It is one of the great base notes of gourmands, ambers and fougères.",
  src=["fr_tonka", "ps_tonka", "fw_tonka", "st_tonka"],
  vars={
   "Tonka Bean": dict(same="No change: tonka is the bean."),
   "Tonka Beans": dict(same="No change: tonka beans, in the plural."),
  }),
 "note-vanilla": dict(
  say="The cured pod of a climbing orchid, and the most loved note in perfumery. Real vanilla absolute is dark and rich: sweet and creamy, but also smoky, woody, boozy and a little animal, opening dark and settling powdery and soft. Most vanilla in perfume is vanillin, its main molecule, sweeter and simpler. It warms and softens everything it touches.",
  src=["fr_vanilla", "fw_vanbourbon", "tg_vanabs", "wp_vanilla"],
  vars={
   "Bourbon Vanilla": dict(say="Vanilla of the Bourbon type, grown on Madagascar, the Comoros and Réunion (once Île Bourbon): the classic, rich vanilla, creamy, sweet and hay-like, smoky and deep. The name is the islands, not the whiskey.", src=["fw_vanbourbon", "fr_nestbourbon", "wp_vanilla"]),
   "Madagascar Vanilla": dict(say="Vanilla from Madagascar, the world's largest grower and the heart of the Bourbon type: rich, creamy and sweet, more concentrated than the floral vanilla of Tahiti.", src=["fr_nestbourbon", "vb_caviar", "wp_vanilla"]),
   "Vanilla Absolute": dict(say="Vanilla as the real extract from cured pods, rather than vanillin: darker and far more complex, sweet and creamy but also smoky, woody, boozy and a little animal.", src=["tg_vanabs", "fw_vanbourbon", "wp_absolute"]),
   "Vanilla Caviar": dict(say="The tiny black seeds scraped by hand from inside the vanilla pod, the richest part of it: vanilla at its most concentrated, sweet and deep.", src=["ch_caviar", "vb_caviar", "at_amaretto"]),
   "Vanilla Sauce": dict(say="Vanilla as custard sauce, crème anglaise: milk, sugar and egg yolks cooked slowly with vanilla. So it is creamier, eggier and more milky-sweet than vanilla alone, a pudding rather than a pod.", src=["wp_anglaise", "fr_vanillaash"]),
  }),
 "note-wheat": dict(
  say="The grain of bread: soft, warm and nutty, cereal-like and almost skin-like, like flour-dusted hands and warm loaves. It sits in gourmands and ambers, where it adds a quiet, snuggly warmth.",
  src=["fr_wheat", "ps_wheat", "ps_wheatbarley"],
  vars={
   "Wheat Absolute": dict(say="Wheat as a real natural extract, taken with solvents: denser and warmer than a wheat accord, toasty, bready and faintly sweet, like the inside of a mill.", src=["wp_absolute", "pw_gingerbread", "fr_wheat"]),
   "Bran Wheat": dict(say="Wheat bran, the hard outer layer of the grain: drier, rougher and toastier than the flour, like bran cereal and husks rather than soft bread.", src=["wp_bran", "fr_wheatboard", "pw_list"]),
  }),
}
out("GOU3", S, N)

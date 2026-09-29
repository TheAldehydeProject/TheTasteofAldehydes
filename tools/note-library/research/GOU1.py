from acc import out, SAME
S = {
 "fr_almond": ("https://www.fragrantica.com/notes/Almond-130.html", "Almond perfume ingredient, Almond fragrance and essential oils Prunus amygdalis var. amara (Rosaceae)"),
 "sc_benzald": ("https://www.scentspiracy.com/fragrance-ingredients/p/benzoic-aldehyde", "Benzoic Aldehyde (100-52-7) - Almondy Synthetic Igredient for Perfumery — Scentspiracy"),
 "pf_benzald": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21860816/benzaldehyde", "Benzaldehyde | Perfumer & Flavorist"),
 "adar_incantu": ("https://adarperfumes.com/products/incantu-drops-of-styx", "Incantu: Drops of Styx", "ADAR Perfumes"),
 "fr_bakedapple": ("https://www.fragrantica.com/notes/Baked-Apple-1509.html", "Baked Apple perfume ingredient, Baked Apple fragrance and essential oils"),
 "ps_appleday": ("https://perfumesociety.org/an-apple-fragrance-a-day/", "An apple (fragrance) a day... - The Perfume Society"),
 "fr_apple": ("https://www.fragrantica.com/notes/Apple-146.html", "Apple perfume ingredient, Apple fragrance and essential oils Malus domestica"),
 "fr_hotstuff": ("https://www.fragrantica.com/perfume/Grande/Hot-Stuff-114957.html", "Hot Stuff Grande perfume - a fragrance for women and men"),
 "wp_tatin": ("https://en.wikipedia.org/wiki/Tarte_Tatin", "Tarte Tatin - Wikipedia"),
 "fr_balsvin": ("https://www.fragrantica.com/notes/Balsamic-Vinegar-622.html", "Balsamic Vinegar perfume ingredient, Balsamic Vinegar fragrance and essential oils"),
 "wp_balsvin": ("https://en.wikipedia.org/wiki/Balsamic_vinegar", "Balsamic vinegar - Wikipedia"),
 "fr_cv99": ("https://www.fragrantica.com/perfume/Lussur/CV99-128462.html", "CV99 Lussur perfume - a fragrance for women and men"),
 "fr_barley": ("https://www.fragrantica.com/notes/Barley-569.html", "Barley perfume ingredient, Barley fragrance and essential oils Hordeum vulgare"),
 "ps_wheatbarley": ("https://perfumesociety.org/softly-gathered-the-scents-of-wheat-barley/", "Softly Gathered: The Scents of Wheat & Barley - The Perfume Society"),
 "fr_malt": ("https://www.fragrantica.com/notes/Malt-480.html", "Malt perfume ingredient, Malt fragrance and essential oils"),
 "fr_beeswax": ("https://www.fragrantica.com/notes/Beeswax-53.html", "Beeswax perfume ingredient, Beeswax fragrance and essential oils"),
 "fr_beeswaxnews": ("https://www.fragrantica.com/news/Beeswax-in-Perfumes-2737.html", "Beeswax in Perfumes ~ Raw Materials ~ Fragrantica"),
 "ps_beeswax": ("https://perfumesociety.org/ingredients-post/beeswax/", "Beeswax - The Perfume Society"),
 "fw_beeswax": ("https://fraterworks.com/products/beeswax-signature-absolute", "Beeswax Absolute, Glacé – Fraterworks"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "at_deity": ("https://ataraxiaperfumery.com/products/deity", "Deity", "Ataraxia Perfumery"),
 "fr_blackwalnut": ("https://www.fragrantica.com/notes/Black-Walnut-1343.html", "Black Walnut perfume ingredient, Black Walnut fragrance and essential oils Juglans Nigra"),
 "fr_walnut": ("https://www.fragrantica.com/notes/Walnut-336.html", "Walnut perfume ingredient, Walnut fragrance and essential oils Genus: Juglans"),
 "fr_amperfwalnut": ("https://www.fragrantica.com/perfume/American-Perfumer/Black-Walnut-77266.html", "Black Walnut American Perfumer perfume - a fragrance for women and men 2022"),
 "fr_bread": ("https://www.fragrantica.com/notes/Bread-623.html", "Bread perfume ingredient, Bread fragrance and essential oils"),
 "fr_breadnews": ("https://www.fragrantica.com/news/ESXENCE-2024-The-Smell-of-Bread-20108.html", "ESXENCE 2024: The Smell of Bread ~ Fragrance Reviews ~ Fragrantica"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "wp_acorn": ("https://en.wikipedia.org/wiki/Acorn", "Acorn - Wikipedia"),
 "fr_brownsugar": ("https://www.fragrantica.com/notes/Brown-Sugar-521.html", "Brown Sugar perfume ingredient, Brown Sugar fragrance and essential oils"),
 "ps_brownsugar": ("https://perfumesociety.org/ingredients-post/brown-sugar/", "Brown sugar - The Perfume Society"),
 "fr_butter": ("https://www.fragrantica.com/notes/Butter-580.html", "Butter perfume ingredient, Butter fragrance and essential oils"),
 "fw_diacetyl": ("https://fraterworks.com/products/diacetyl", "Diacetyl – Fraterworks"),
 "wp_diacetyl": ("https://en.wikipedia.org/wiki/Diacetyl", "Diacetyl - Wikipedia"),
 "fr_butterscotch": ("https://www.fragrantica.com/notes/Butterscotch-832.html", "Butterscotch perfume ingredient, Butterscotch fragrance and essential oils"),
 "tg_butterscotch": ("https://www.thegoodscentscompany.com/odor/butterscotch.html", "The Good Scents Company -Odor Descriptor Listing for butterscotch", "The Good Scents Company"),
 "wp_butterscotch": ("https://en.wikipedia.org/wiki/Butterscotch", "Butterscotch - Wikipedia"),
 "tg_cocoa": ("https://www.thegoodscentscompany.com/data/ab1092811.html", "cocoa absolute theobroma cacao seed butter", "The Good Scents Company"),
 "fw_cocoa": ("https://fraterworks.com/products/cocoa-absolute-5-ipm", "Cocoa Absolute 5% IPM – Fraterworks"),
 "fr_cacaopod": ("https://www.fragrantica.com/notes/Cacao-Pod-135.html", "Cacao Pod perfume ingredient, Cacao Pod fragrance and essential oils Theobroma cacao (Sterculiaceae)"),
 "fr_darkchoc": ("https://www.fragrantica.com/notes/Dark-Chocolate-136.html", "Dark Chocolate perfume ingredient, Dark Chocolate fragrance and essential oils"),
 "fr_caramel": ("https://www.fragrantica.com/notes/Caramel-183.html", "Caramel perfume ingredient, Caramel fragrance and essential oils"),
 "ps_caramel": ("https://perfumesociety.org/ingredients-post/caramel/", "Caramel - The Perfume Society"),
 "sc_maltol": ("https://www.scentspiracy.com/blog/ethyl-maltol-vs-maltol-which-works-better-in-perfumery", "Maltol vs Ethyl Maltol: Technical & Sensory Comparison for Modern Gourmand Perfumery — Scentspiracy"),
 "fr_carob": ("https://www.fragrantica.com/notes/Carob-Tree-430.html", "Carob Tree perfume ingredient, Carob Tree fragrance and essential oils Ceratonia Siliqua"),
 "fr_carobnews": ("https://www.fragrantica.com/news/Carob-Tree-3357.html", "Carob Tree ~ Raw Materials ~ Fragrantica"),
 "wp_carob": ("https://en.wikipedia.org/wiki/Carob", "Carob - Wikipedia"),
 "fr_chantilly": ("https://www.fragrantica.com/notes/Chantilly-Cream-1645.html", "Chantilly Cream perfume ingredient, Chantilly Cream fragrance and essential oils"),
 "fr_cream": ("https://www.fragrantica.com/notes/Cream-454.html", "Cream perfume ingredient, Cream fragrance and essential oils"),
 "fr_tutti": ("https://www.fragrantica.com/news/Tutti-Delices-Vanille-Chantilly-15856.html", "Tutti Délices Vanille Chantilly ~ New Fragrances ~ Fragrantica"),
 "fr_whitechoc": ("https://www.fragrantica.com/notes/White-Chocolate-168.html", "White Chocolate perfume ingredient, White Chocolate fragrance and essential oils"),
 "ps_choc": ("https://perfumesociety.org/indulgent-chocolate-scents-for-every-taste/", "Indulgent chocolate scents for EVERY taste - The Perfume Society"),
 "oz_darkchoc": ("https://www.osmoz.com/inspiration/osmoz-magazine/643/dark-chocolate-perfume", "Dark chocolate perfume - 8 best scents that smell like cacao"),
 "at_amaretto": ("https://ataraxiaperfumery.com/products/amaretto-jazz-in-the-melting-room", "Amaretto Jazz in the Melting Room", "Ataraxia Perfumery"),
 "wp_gianduja": ("https://en.wikipedia.org/wiki/Gianduja_(chocolate)", "Gianduja (chocolate) - Wikipedia"),
 "fr_vestibule": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Vestibule-100362.html", "Vestibule Ataraxia Perfumery perfume - a fragrance for women and men"),
 "wp_amandine": ("https://en.wikipedia.org/wiki/Amandine_(dessert)", "Amandine (dessert) - Wikipedia"),
}
N = {
 "note-almond": dict(
  say="Sweet and bitter at once, soft and nutty: the smell of marzipan, amaretto and cherry stones. Most of it is benzaldehyde, a molecule that is nearly all of bitter almond oil and that almonds share with cherries and peach kernels. It makes a perfume feel comforting and edible, and it runs through gourmands and powdery orientals.",
  src=["fr_almond", "sc_benzald", "pf_benzald"],
  vars={
   "Burnt Almond": dict(say="Almonds roasted until they catch: darker, toastier and smokier, more like praline and caramelised nuts than marzipan, with the sweet bitterness pushed towards the burnt.", src=["adar_incantu", "fr_almond"]),
  }),
 "note-baked-apple": dict(
  say="Apple warmed in an oven until it softens and its sugars caramelise, usually with cinnamon, clove or vanilla beside it. It smells cosy and dessert-like, sweet and juicy with a buttery, spiced warmth: autumn and a festive kitchen.",
  src=["fr_bakedapple", "ps_appleday", "fr_apple"],
  vars={
   "Apple Tarte Tatin Accord": dict(say="An accord of a whole dessert: the French upside-down apple tart, apples caramelised in butter and sugar under a pastry lid. So it is baked apple with more caramel and buttery pastry around it, richer and darker than plain baked apple.", src=["wp_tatin", "fr_hotstuff", "fr_bakedapple"]),
  }),
 "note-balsamic-vinegar": dict(
  say="Aged Italian vinegar made from cooked grape juice and left for years in wooden barrels: dark, thick, sweet and sour at once, fruity and winey, with a sharp tang and a woody depth. As a note it brings a strange, appetising acidity to a sweet perfume. It is not the same as a 'balsamic' note, which in perfumery means soft and resinous.",
  src=["fr_balsvin", "wp_balsvin", "fr_cv99"]),
 "note-barley": dict(
  say="The grain of beer and whisky. As a note it is warm, toasty and cereal-like, like sun-warmed straw and husks, and when it has been malted it turns sweeter and savoury, reminiscent of beer, whisky and a little milky honey. It gives a perfume a comforting, rustic warmth.",
  src=["fr_barley", "ps_wheatbarley", "fr_malt"]),
 "note-beeswax": dict(
  say="The wax of the honeycomb, extracted: honeyed and sweet, warm and softly animal, with hay, tobacco and a little pollen in it, like a candle of real beeswax. It is one of the few animal notes that harms no animal, and it gives a golden, intimate warmth and helps a perfume last.",
  src=["fr_beeswax", "fr_beeswaxnews", "ps_beeswax"],
  vars={
   "Beeswax Absolute": dict(say="Beeswax as the real natural extract, taken from the wax with solvents, rather than a beeswax accord built from other materials: richer and more complex, honey, hay and tobacco together.", src=["fw_beeswax", "wp_absolute", "at_deity"]),
  }),
 "note-black-walnut": dict(
  say="The American walnut, whose nut hides inside a green husk that stains your hands brown. The husk smells green, earthy, citrusy and a little piney; the nut is woody, rich and slightly bitter, with a milky softness. As a note it is nutty, woody and a bit wild.",
  src=["fr_blackwalnut", "fr_walnut", "fr_amperfwalnut"]),
 "note-bread": dict(
  say="The smell of a bakery in the morning: warm crust, yeast and flour, toasty and faintly sweet. It is built from roasted, bready molecules, and it gives a perfume an intensely comforting, homely warmth.",
  src=["fr_bread", "fr_breadnews"],
  vars={
   "Acorn Nut Bread": dict(say="Bread made with acorn flour, an old food of hard times and foraging: nuttier, earthier and a little bitter from the acorn's tannins, darker and more woodland than wheat bread.", src=["pw_list", "wp_acorn"]),
  }),
 "note-brown-sugar": dict(
  say="Sugar with some of its molasses left in: rich, soft and caramel-like, a little boozy and treacly, sweeter and deeper than white sugar. It can read as caramel, maple syrup or breakfast pancakes, and it warms gourmand perfumes.",
  src=["fr_brownsugar", "ps_brownsugar"]),
 "note-butter": dict(
  say="Melted butter: rich, creamy and sweet, a dairy warmth. Its smell is mostly diacetyl, the molecule of butter and buttered popcorn, which also brings caramel. In a perfume it makes vanilla and caramel feel richer and more edible.",
  src=["fr_butter", "fw_diacetyl", "wp_diacetyl"]),
 "note-butterscotch": dict(
  say="The sweet of brown sugar and butter cooked together, with cream and a little salt: rich, sweet and buttery, toasty and caramel-like, like a boiled sweet or a pudding sauce. It is intensely gourmand and very long-lasting.",
  src=["fr_butterscotch", "tg_butterscotch", "wp_butterscotch"]),
 "note-cacao": dict(
  say="The bean chocolate is made from, roasted and ground. As an absolute it smells rich, deep and dark: cocoa powder and hot chocolate, a little bitter and roasted, with coffee, vanilla and even boozy or slightly meaty facets, settling into a soft, powdery chocolate close to the skin.",
  src=["tg_cocoa", "fw_cocoa", "fr_cacaopod"],
  vars={
   "Cocoa": dict(same="No change: cacao and cocoa are the same bean; in perfume the two words mean the same note."),
   "Dark Cocoa": dict(say="Cocoa at its darkest and most roasted: more bitter, dry and smoky, less sweet, like unsweetened powder rather than a sugared drink.", src=["fr_darkchoc", "at_deity"]),
   "Hot Cocoa": dict(say="Cocoa as the warm drink: sweeter, milkier and softer, sugared cocoa powder in hot milk rather than the bare roasted bean.", src=["fw_cocoa", "pw_list"]),
  }),
 "note-caramel": dict(
  say="Sugar heated until it turns golden and brown: warm, sweet and a little burnt, toffee-like and comforting. In perfume it is built mostly from maltol and ethyl maltol, which smell of caramel, candyfloss and jam; ethyl maltol became famous with Thierry Mugler's Angel in 1992.",
  src=["fr_caramel", "ps_caramel", "sc_maltol"]),
 "note-carob-pods": dict(
  say="The long brown pods of the carob tree, sweet enough to be used as a chocolate substitute. They smell cocoa-like and date-like, sweet and a little dusty, fruity and faintly earthy. It is a rare note in perfume.",
  src=["fr_carob", "fr_carobnews", "wp_carob"]),
 "note-chantilly-cream": dict(
  say="Crème Chantilly: cream whipped with sugar and vanilla. As a note it is creamy, sweet and vanilla-soft, a little powdery, and above all airy: dessert that feels light rather than heavy.",
  src=["fr_chantilly", "fr_cream", "fr_tutti"]),
 "note-chocolate": dict(
  say="Chocolate is built in perfume more often than extracted, since cocoa absolute is costly and subtle. It can be dark, bitter and roasted, like cocoa dust and toasted beans with a hint of espresso, or milky and sweet, like a melting bar. Either way it is comforting, rich and a little indulgent.",
  src=["fr_darkchoc", "fr_whitechoc", "ps_choc"],
  vars={
   "Dark Chocolate": dict(say="Chocolate at its most serious: bitter, roasted and dry, with smoke from the toasted beans and a hint of coffee, velvety and restrained rather than sugary.", src=["fr_darkchoc", "oz_darkchoc"]),
   "Hazelnut Chocolate": dict(say="Chocolate blended with roasted hazelnut, like gianduja or a hazelnut spread: creamier, nuttier and sweeter than plain chocolate, with a toasty, buttery warmth.", src=["wp_gianduja", "at_amaretto"]),
   "White Chocolate": dict(say="Hardly cocoa at all: milk, vanilla and cocoa butter, pale, creamy and soft, like condensed milk and custard, sometimes with a nutty or coconut halo, where dark chocolate is roasted and bitter.", src=["fr_whitechoc", "ps_choc"]),
   "Chocolate Bar": dict(same="No change: chocolate, as a bar."),
  }),
 "note-chocolate-cake": dict(
  say="A baked chocolate cake: cocoa and chocolate with the warm, buttery, flour-and-sugar smell of sponge, sometimes with cream or icing. It is gourmand at its most homely.",
  src=["ps_choc", "fr_vestibule"],
  vars={
   "Chocolate Cake (Amandină)": dict(say="A particular cake: the Romanian amandină, layers of chocolate sponge soaked in rum-flavoured caramel syrup, filled with chocolate buttercream and glazed with chocolate fondant. So it is chocolate cake with rum, caramel and a hint of almond.", src=["wp_amandine", "fr_vestibule"]),
  }),
}
out("GOU1", S, N)

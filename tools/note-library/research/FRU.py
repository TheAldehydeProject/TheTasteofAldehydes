from acc import out, SAME
S = {
 "fr_apple": ("https://www.fragrantica.com/notes/Apple-146.html", "Apple perfume ingredient, Apple fragrance and essential oils Malus domestica"),
 "fr_redapple": ("https://www.fragrantica.com/notes/Red-Apple-144.html", "Red Apple perfume ingredient, Red Apple fragrance and essential oils Malus Domestica"),
 "ps_appleday": ("https://perfumesociety.org/an-apple-fragrance-a-day/", "An apple (fragrance) a day... - The Perfume Society"),
 "ps_apple": ("https://perfumesociety.org/ingredients-post/apple/", "Apple - The Perfume Society"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "fr_apricot": ("https://www.fragrantica.com/notes/Apricot-175.html", "Apricot perfume ingredient, Apricot fragrance and essential oils Prunus armeniaca"),
 "fw_lactones": ("https://fraterworks.com/blogs/information/understanding-lactones", "Understanding Lactones – Fraterworks"),
 "fr_lactones": ("https://www.fragrantica.com/news/Peaches-Coconuts-and-Cream-Lactones-in-Fragrance-11529.html", "Peaches, Coconuts and Cream: Lactones in Fragrance ~ Raw Materials ~ Fragrantica"),
 "wp_preserves": ("https://en.wikipedia.org/wiki/Fruit_preserves", "Fruit preserves - Wikipedia"),
 "fr_jammy": ("https://www.fragrantica.com/board/viewtopic.php?id=157882", "\"Jammy\" and \"screechy\" . . . defining fragrance descriptives. (Page 1) — General Perfume Talk — Fragrantica Club", "Fragrantica Club"),
 "fw_dulcinyl": ("https://fraterworks.com/products/dulcinyl", "Dulcinyl – Fraterworks"),
 "sc_banana": ("https://www.scentspiracy.com/blog/the-chemistry-of-banana-smell-and-flavor", "The chemistry of Banana, smell and flavor - Blog — Scentspiracy"),
 "wp_isoamyl": ("https://en.wikipedia.org/wiki/Isoamyl_acetate", "Isoamyl acetate - Wikipedia"),
 "fr_banana": ("https://www.fragrantica.com/news/Banana-Perfumes-The-Tension-Between-Old-And-New-13597.html", "Banana Perfumes: The Tension Between Old And New ~ Columns ~ Fragrantica"),
 "fr_blackberry": ("https://www.fragrantica.com/notes/Blackberry-169.html", "Blackberry perfume ingredient, Blackberry fragrance and essential oils (Genus Rubus, Family Rosaceae)"),
 "ps_blackberry": ("https://perfumesociety.org/ingredients-post/blackberry/", "Blackberry - The Perfume Society"),
 "ps_brambles": ("https://perfumesociety.org/wrapped-in-brambles-blackberry-scents-to-welcome-autumns-arrival/", "Wrapped in Brambles – Blackberry Scents to Welcome Autumn's Arrival - The Perfume Society"),
 "fr_blueberry": ("https://www.fragrantica.com/notes/Blueberry-225.html", "Blueberry perfume ingredient, Blueberry fragrance and essential oils Vaccinium myrtillus"),
 "ps_blueberry": ("https://perfumesociety.org/ingredients-post/blueberry/", "Blueberry - The Perfume Society"),
 "ps_blackcurrant": ("https://perfumesociety.org/ingredients-post/blackcurrant/", "Blackcurrant - The Perfume Society"),
 "fr_blackcurrant": ("https://www.fragrantica.com/notes/Black-Currant-132.html", "Black Currant perfume ingredient, Black Currant fragrance and essential oils Ribes nigrum"),
 "fw_cassisbud": ("https://fraterworks.com/products/blackcurrant-absolute-burgundy", "Blackcurrant Bud Absolute – Fraterworks"),
 "st_cassisbud": ("https://www.scentree.co/en/Cassis_bud_absolute.html", "ScenTree - Cassis bud absolute (CAS N° 97676-19-2)"),
 "fr_cherry": ("https://www.fragrantica.com/notes/Cherry-297.html", "Cherry perfume ingredient, Cherry fragrance and essential oils family Rosaceae, genus Prunus"),
 "sc_cherry": ("https://www.scentspiracy.com/blog/the-chemistry-of-cherry-smell-and-flavor", "The chemistry of Cherry, smell and flavor - Blog — Scentspiracy"),
 "ps_cherry": ("https://perfumesociety.org/cherry-picking-perfumes/", "Cherry Picking Perfumes... - The Perfume Society"),
 "fr_blackcherry": ("https://www.fragrantica.com/notes/Black-Cherry-1376.html", "Black Cherry perfume ingredient, Black Cherry fragrance and essential oils Eugenia Candolleana"),
 "fr_cran": ("https://www.fragrantica.com/notes/Cranberry-274.html", "Cranberry perfume ingredient, Cranberry fragrance and essential oils Vaccinium"),
 "fr_crannews": ("https://www.fragrantica.com/news/Cranberry-Commonly-Uncommon-in-Perfume-21738.html", "Cranberry: Commonly Uncommon in Perfume ~ Columns ~ Fragrantica"),
 "fr_datesnews": ("https://www.fragrantica.com/news/Date-Notes-in-Perfumes-16639.html", "Date Notes in Perfumes ~ Raw Materials ~ Fragrantica"),
 "fr_dates": ("https://www.fragrantica.com/notes/Dates-355.html", "Dates perfume ingredient, Dates fragrance and essential oils Phoenix dactylifera"),
 "ps_dates": ("https://perfumesociety.org/ingredients-post/dates/", "Dates - The Perfume Society"),
 "fr_dried": ("https://www.fragrantica.com/notes/Dried-Fruits-230.html", "Dried Fruits perfume ingredient, Dried Fruits fragrance and essential oils"),
 "ps_dried": ("https://perfumesociety.org/ingredients-post/dried-fruits/", "Dried fruits - The Perfume Society"),
 "tg_raisin": ("https://www.thegoodscentscompany.com/odor/raisin.html", "Odor Descriptor Listing for raisin - The Good Scents Company", "The Good Scents Company"),
 "fr_fig": ("https://www.fragrantica.com/notes/Fig-247.html", "Fig perfume ingredient, Fig fragrance and essential oils Ficus"),
 "ps_fig": ("https://perfumesociety.org/ingredients-post/fig/", "Fig - The Perfume Society"),
 "fr_fignews": ("https://www.fragrantica.com/news/A-Fig-for-You-The-Scent-of-Fig-in-Perfumery-24802.html", "A Fig for You: The Scent of Fig in Perfumery ~ Raw Materials ~ Fragrantica"),
 "wp_physalis": ("https://en.wikipedia.org/wiki/Physalis_peruviana", "Physalis peruviana - Wikipedia"),
 "sp_golden": ("https://specialtyproduce.com/produce/berries/golden_16310.php", "Golden Berries", "Specialty Produce"),
 "at_deity": ("https://ataraxiaperfumery.com/products/deity", "Deity", "Ataraxia Perfumery"),
 "tg_greenapple": ("https://www.thegoodscentscompany.com/odor/apple-green-apple.html", "The Good Scents Company -Odor Descriptor Listing for apple green apple", "The Good Scents Company"),
 "fr_guava": ("https://www.fragrantica.com/notes/Guava-177.html", "Guava perfume ingredient, Guava fragrance and essential oils family Myrtaceae genus Psidium"),
 "ps_guava": ("https://perfumesociety.org/ingredients-post/guava/", "Guava - The Perfume Society"),
 "rhs_loquat": ("https://www.rhs.org.uk/plants/6735/eriobotrya-japonica-f/details", "Eriobotrya japonica (F)", "Royal Horticultural Society"),
 "sx_loquat": ("https://stuartxchange.org/Loquat", "Loquat", "StuartXchange"),
 "fr_deity": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Deity-119626.html", "Deity Ataraxia Perfumery perfume - a fragrance for women and men"),
 "fr_lycheenews": ("https://www.fragrantica.com/news/Examining-Lychee-as-a-Smell-3380.html", "Examining Lychee as a Smell ~ Raw Materials ~ Fragrantica"),
 "fr_litchi": ("https://www.fragrantica.com/notes/Litchi-194.html", "Litchi perfume ingredient, Litchi fragrance and essential oils Litchi chinensis"),
 "fr_lycheelife": ("https://www.fragrantica.com/news/Lychee-In-Life-and-Perfume-18694.html", "Lychee: In Life and Perfume ~ Raw Materials ~ Fragrantica"),
 "fr_mango": ("https://www.fragrantica.com/notes/Mango-179.html", "Mango perfume ingredient, Mango fragrance and essential oils genus Mangifera"),
 "ps_mango": ("https://perfumesociety.org/ingredients-post/mango/", "Mango - The Perfume Society"),
 "fr_greenmango": ("https://www.fragrantica.com/perfume/Strangers-Parfumerie/Salted-Green-Mango-55610.html", "Salted Green Mango Strangers Parfumerie perfume - a fragrance for women and men 2019"),
 "fr_whitelabel": ("https://www.fragrantica.com/perfume/Grande/White-Label-117529.html", "White Label Grande perfume - a fragrance for women and men"),
 "pm_maninka": ("https://www.parfumo.com/Fragrance_Note/Maninka_fruit", "Maninka fruit", "Parfumo"),
 "pp_maninka": ("https://premierepeau.com/it/pages/glossary-terms/maninka", "Maninka", "Premiere Peau"),
 "adar_adhd": ("https://adarperfumes.com/products/adhd-neuro-elixir", "ADHD Neuro Elixir", "ADAR Perfumes"),
 "ps_passion": ("https://perfumesociety.org/ingredients-post/passion-fruit/", "Passion fruit - The Perfume Society"),
 "fr_passion": ("https://www.fragrantica.com/notes/Passionfruit-161.html", "Passionfruit perfume ingredient, Passionfruit fragrance and essential oils Passiflora Edulis (Passifloraceae)"),
 "fr_passionarmani": ("https://www.fragrantica.com/news/Armani-Power-Of-You-Passion-Fruit-Goes-Commercial-24827.html", "Armani Power Of You: Passion Fruit Goes Commercial ~ Fragrance Reviews ~ Fragrantica"),
 "ps_peach": ("https://perfumesociety.org/ingredients-post/peach/", "Peach - The Perfume Society"),
 "st_c14": ("https://www.scentree.co/en/Aldehyde_C-14.html", "ScenTree - Aldehyde C-14 (CAS N° 104-67-6)"),
 "sc_peach": ("https://www.scentspiracy.com/blog/the-chemistry-of-peach", "The chemistry of Peach - Blog — Scentspiracy"),
 "fr_pear": ("https://www.fragrantica.com/notes/Pear-182.html", "Pear perfume ingredient, Pear fragrance and essential oils Pyrus Communis Rosaceae"),
 "ps_pear": ("https://perfumesociety.org/perfectly-picked-pear-perfumes/", "Perfectly Picked Pear Perfumes... - The Perfume Society"),
 "fr_pearnews": ("https://www.fragrantica.com/news/On-the-structure-of-the-perfume-pear-note-18705.html", "On the Structure of the Perfume Pear Note ~ Raw Materials ~ Fragrantica"),
 "fr_plum": ("https://www.fragrantica.com/notes/Plum-171.html", "Plum perfume ingredient, Plum fragrance and essential oils Prunus"),
 "fr_plumnews": ("https://www.fragrantica.com/news/Plum-23276.html", "Plum ~ Columns ~ Fragrantica"),
 "fr_boozyplum": ("https://www.fragrantica.com/news/Boozy-and-Sweet-Plums-in-Perfumes-23591.html", "Boozy and Sweet Plums in Perfumes ~ Columns ~ Fragrantica"),
 "fr_plumtree": ("https://www.fragrantica.com/notes/Plum-Tree-306.html", "Plum Tree perfume ingredient, Plum Tree fragrance and essential oils Prunus domestica"),
 "fr_quince": ("https://www.fragrantica.com/notes/Quince-223.html", "Quince perfume ingredient, Quince fragrance and essential oils Cydonia oblonga"),
 "ps_quince": ("https://perfumesociety.org/ingredients-post/quince/", "Quince - The Perfume Society"),
 "ps_rasp": ("https://perfumesociety.org/ingredients-post/raspberry/", "Raspberry - The Perfume Society"),
 "sc_raspketone": ("https://www.scentspiracy.com/fragrance-ingredients/p/raspberry-ketone", "Raspberry Ketone (CAS 5471-51-2): Fruity Powdery Berry – Premium Synthetic Fragrance Ingredient — Scentspiracy"),
 "fr_rasp": ("https://www.fragrantica.com/notes/Raspberry-174.html", "Raspberry perfume ingredient, Raspberry fragrance and essential oils Rubus idaeus"),
 "fr_redberries": ("https://www.fragrantica.com/notes/Red-Berries-184.html", "Red Berries perfume ingredient, Red Berries fragrance and essential oils"),
 "oz_redberries": ("https://www.osmoz.com/encyclopedia/raw-materials/notes/771/red-berry-notes", "Red Berry Notes Perfumes raw material - Red Berry Notes Scent"),
 "fr_redberriesshow": ("https://www.fragrantica.com/news/Best-in-Show-Red-Berries-2018--11318.html", "Best in Show: Red Berries (2018) ~ Best in Show ~ Fragrantica"),
 "fr_pineapple": ("https://www.fragrantica.com/notes/Pineapple-170.html", "Pineapple perfume ingredient, Pineapple fragrance and essential oils Ananas comosus"),
 "fr_hotstuff": ("https://www.fragrantica.com/perfume/Grande/Hot-Stuff-114957.html", "Hot Stuff Grande perfume - a fragrance for women and men"),
 "wp_furaneol": ("https://en.wikipedia.org/wiki/Furaneol", "Furaneol - Wikipedia"),
 "fr_strawnews": ("https://www.fragrantica.com/news/Strawberry-in-Life-and-Perfume-18501.html", "Strawberry in Life and Perfume ~ Raw Materials ~ Fragrantica"),
 "fr_straw": ("https://www.fragrantica.com/notes/Strawberry-261.html", "Strawberry perfume ingredient, Strawberry fragrance and essential oils Fragaria"),
 "st_furaneol": ("https://www.scentree.co/en/Furaneol%C2%AE.html", "ScenTree - Furaneol® (CAS N° 3658-77-3)"),
 "sp_plumtree": ("https://www.fragrantica.com/perfume/Serge-Lutens/De-Profundis-13274.html", "De Profundis Serge Lutens perfume - a fragrance for women and men 2011"),
}
N = {
 "note-apple": dict(
  say="The first bite of an apple: the skin breaks and the smell rises at once, watery and bright, sweet and tart together. As a note it can be crisp and green, sweet and red, or soft and warm like a baked apple with cinnamon and caramel. It is almost always built from fruity molecules, since the fruit gives no oil, and it makes a perfume mouthwatering and easy to like.",
  src=["fr_apple", "ps_apple", "ps_appleday"],
  vars={
   "Fresh Red Apple": dict(say="Red apple, freshly cut: sweeter and rounder than green apple, juicy rather than sour, with the fruit's cool freshness still in it rather than the warmth of a baked one.", src=["fr_redapple", "pw_list", "fr_apple"]),
  }),
 "note-apricot": dict(
  say="The velvety orange stone fruit. As a note it is soft and fuzzy, sweet and juicy, a little creamy and even faintly animal, like skin warm in the sun. Most of that comes from lactones, molecules that smell of peach, apricot and coconut cream, and perfumers build it from them.",
  src=["fr_apricot", "fw_lactones", "fr_lactones"],
  vars={
   "Apricot Preserve": dict(say="Apricot cooked down with sugar into jam rather than the fresh fruit: thicker, sweeter and deeper, sticky and caramel-edged, with less of the juicy freshness and more of the concentrated fruit.", src=["wp_preserves", "fr_jammy", "fw_dulcinyl"]),
  }),
 "note-banana": dict(
  say="Ripe banana, sweet and creamy, and a note that swings between fruit and sweets. Much of its smell is one molecule, isoamyl acetate, which smells of banana and pear drops and is also made when beer and cognac ferment; used heavily it turns artificial. In a perfume banana can be tropical and creamy, or boozy and dark, like banana cooked with rum.",
  src=["sc_banana", "wp_isoamyl", "fr_banana"]),
 "note-blackberry": dict(
  say="The bramble fruit of late summer hedgerows: tangy and sweet at once, juicy, a little sour when not quite ripe, with a faint floral and musky side. It is always built, never extracted, and perfumers can pick its moment, fresh off the bush or dark and jammy. It brings bright, fun fruit and cuts the sweetness of gourmands.",
  src=["fr_blackberry", "ps_blackberry", "ps_brambles"],
  vars={
   "Blackberry Jam": dict(say="Blackberries cooked down with sugar: syrupy and dark, sweeter and deeper than the fresh fruit, the tartness softened and caramelised, sticky rather than juicy.", src=["wp_preserves", "fr_jammy", "ps_brambles"]),
  }),
 "note-blueberry": dict(
  say="Small blue berries, and a note that can be refreshing and gently sweet or thick and jammy: tart and fruity with a creamy, almost vanilla softness, sometimes smelling more of blueberry muffins and pie than of the fruit. It is built by the perfumer, and it tends to make a perfume playful and edible.",
  src=["fr_blueberry", "ps_blueberry"]),
 "note-cassis": dict(
  say="Blackcurrant, in French. The note often comes from the buds and leaves as well as the fruit: tangy, sharp and green, dark-fruited and a little woody, with a strange sulphurous edge that people honestly compare to cat's pee, which in a finished perfume becomes a bracing, lifelike tartness. It is a classic of fruity chypres.",
  src=["ps_blackcurrant", "fr_blackcurrant", "fw_cassisbud", "st_cassisbud"]),
 "note-cherry": dict(
  say="Sweet and tart at once, with a bitter-almond edge, because cherry and almond are cousins and share benzaldehyde, the molecule of marzipan. As a note it can be fresh and juicy, or dark, syrupy and liqueur-like. It is built rather than extracted, and it gives a perfume a red, playful, sometimes seductive sweetness.",
  src=["fr_cherry", "sc_cherry", "ps_cherry"],
  vars={
   "Black Cherry": dict(say="The darkest, ripest cherry: syrupy, deeper and sweeter, with more of the almond, almost like cherry liqueur, where plain cherry is brighter and tarter.", src=["fr_blackcherry", "sc_cherry"]),
   "Cherry Compote": dict(say="Cherries stewed with sugar, still in pieces: warm, soft and syrupy, cooked rather than fresh, sweeter and rounder than the raw fruit but less sticky than jam.", src=["wp_preserves", "fr_cherry", "fr_jammy"]),
   "Cherry Jam": dict(say="Cherries cooked down with sugar into jam: thick, dark and very sweet, with a caramelised, almost candied edge, where fresh cherry is juicy and tart.", src=["wp_preserves", "fr_jammy", "fr_cherry"]),
  }),
 "note-cranberry": dict(
  say="The small, hard, glossy red berry, and famously sour: tart, sharp and a little bitter, with only a hint of sweetness and a faint forest greenness. A good cranberry note keeps that bite rather than sugaring it, and it brings a crisp, wintry brightness.",
  src=["fr_cran", "fr_crannews"]),
 "note-dates": dict(
  say="The fruit of the date palm, from the Middle East, sweet as candy. As a note it is a fantasy, rich and fruity-sweet, with caramel, honey and a buttery softness, like a date split open. It is rare and warm, and it sits naturally with incense, woods and spice.",
  src=["fr_datesnews", "fr_dates", "ps_dates"]),
 "note-dried-fruits": dict(
  say="Fruit dried in the sun until it is dark and sticky: dates, figs, prunes, apricots and raisins. It smells sweet, deep and chewy, a little like liquorice and brandy, less fresh and more concentrated than fresh fruit. It belongs to gourmand and boozy perfumes, where it adds a warm, Christmassy richness.",
  src=["fr_dried", "ps_dried", "tg_raisin"],
  vars={
   "Raisin": dict(say="One dried fruit in particular: the dried grape, sweet, dark and chewy, a little winey and boozy, with a creamy softness. Dried fruits is the whole family; raisin is its best-known member.", src=["tg_raisin", "fr_dried"]),
   "Raisins": dict(same="No change: raisin in the plural."),
  }),
 "note-fig": dict(
  say="The ripe fruit rather than the leaf: golden skin warmed by the sun, a honeyed, jammy lushness, between fruity and green. The fig tree's milky sap gives it a soft, creamy, coconut-like side, rebuilt by perfumers with lactones. It is fresh and indulgent at once, and very Mediterranean.",
  src=["fr_fig", "ps_fig", "fr_fignews"]),
 "note-goldenberry": dict(
  say="The small orange fruit in a papery husk, also called cape gooseberry or physalis. It tastes and smells sweet and tart together, tangy and tropical, like cherry tomato crossed with pineapple, mango and a touch of vanilla. In a perfume it is a bright, unusual fruit.",
  src=["wp_physalis", "sp_golden", "at_deity"],
  vars={"Golden Berry": dict(same=SAME)}),
 "note-green-apple": dict(
  say="The crisp, sour green apple: tart, sharp and juicy, clean and very fresh, less sweet than red apple. Perfumers build it from fruity esters that catch its bite, and it gives a perfume an easy, bright, orchard-in-the-morning energy.",
  src=["fr_apple", "tg_greenapple", "ps_appleday"]),
 "note-guava": dict(
  say="The pink-fleshed tropical fruit. As a note it is lush, sweet and juicy, with a bittersweet, lemony tang and sometimes the dry, slightly musky smell of its thick skin. Perfumers like it because that bitterness keeps a fruity perfume from getting too sweet.",
  src=["fr_guava", "ps_guava"]),
 "note-japanese-plum": dict(
  say="Here the loquat, the small orange fruit also called Japanese plum, grown in Japan for over a thousand years. It smells and tastes slightly tangy and sweet, like apricot and pineapple with a peach-like softness: a gentle, sunny fruit.",
  src=["rhs_loquat", "sx_loquat", "at_deity"],
  vars={
   "Japanese Loquat": dict(say="The same fruit named properly: the loquat, which is often called Japanese plum though it is no plum at all. Its smell is apricot, pineapple and peach rather than a plum's darkness.", src=["sx_loquat", "rhs_loquat", "fr_deity"]),
  }),
 "note-litchi": dict(
  say="Lychee: under a rough pink shell, white, juicy flesh that smells like a very juicy grape with a delicate rose note. The rose is real chemistry, since lychee holds the same rose oxide as the flower, which is why lychee and rose are so often paired. It is watery, sweet and fresh, and it lightens a floral.",
  src=["fr_lycheenews", "fr_litchi", "fr_lycheelife"]),
 "note-mango": dict(
  say="The tropical fruit: juicy and sweet, with hints of peach and plum and a lush, green, slightly peppery edge from the skin. It gives fruity florals an exotic, sunny ripeness.",
  src=["fr_mango", "ps_mango"],
  vars={
   "Baby Green Mango": dict(say="Mango picked young and unripe: not sweet and juicy but crunchy, sour and green, with the bitterness of its skin and leaves, fresh and tangy rather than tropical and lush.", src=["fr_greenmango", "fr_whitelabel", "fr_mango"]),
  }),
 "note-maninka": dict(
  say="The fruit of a wild tree of the West African savannah, also called tallow plum or sweet detar, eaten fresh or dried across the Sahel. Its smell is warm and richly sweet, caramel-like, with dried fruit, brown sugar and a hint of smoke and dry wood, almost like a date: sweet, slightly resinous and ancient-feeling.",
  src=["pm_maninka", "pp_maninka", "adar_adhd"]),
 "note-passionfruit": dict(
  say="The wrinkled purple fruit full of seeds and pulp. Its smell is intense and tropical: tangy and sharp, a little like grapefruit, with a jammy sweetness and a faint sulphurous burn from the real fruit. It adds a tart, exotic bite to a perfume.",
  src=["ps_passion", "fr_passion", "fr_passionarmani"]),
 "note-peach": dict(
  say="A ripe peach warmed by the sun: sweet, juicy and velvety, creamy, with a touch of coconut. Its classic molecule, a lactone still sold as aldehyde C-14 although it is no aldehyde, has been in perfumes since 1908, and made Guerlain's Mitsouko. It is soft, round and a little sensual.",
  src=["ps_peach", "st_c14", "sc_peach"]),
 "note-pear": dict(
  say="Juicy, sweet and watery, like apple but softer and less crisp. The fruit gives almost no oil, so pear is built from fruity, green molecules, and it can smell like the dewy bite of a ripe pear or something lighter and more transparent. It brings lightness and an appetising freshness.",
  src=["fr_pear", "ps_pear", "fr_pearnews"]),
 "note-plum": dict(
  say="The dark stone fruit, and one of perfumery's old secrets, part of the classic bases of the early twentieth century. As a note it can be tart and fresh like the skin of a plum just picked, or sweet, juicy and boozy, soaked in cognac, down to sticky, smoky prune.",
  src=["fr_plum", "fr_plumnews", "fr_boozyplum"],
  vars={
   "Plum Tree": dict(say="The plum tree rather than just its fruit: plum with some of the tree around it, a greener, woodier, less sugary plum, in the spirit of an orchard rather than a jar.", src=["fr_plumtree", "sp_plumtree"]),
  }),
 "note-quince": dict(
  say="A hard, golden fruit, a cousin of apple and pear. Its smell sits between apple and pear, aromatic, a little sour and dry, with pineapple and a faint rose in it.",
  src=["fr_quince", "ps_quince", "adar_adhd"]),
 "note-raspberry": dict(
  say="A raspberry crushed: sweet, tart and jammy, with a soft, powdery, slightly woody side. It comes mostly from raspberry ketone, a molecule the real fruit has only in traces, and it gives a perfume a bright red fruitiness and helps florals feel juicier.",
  src=["ps_rasp", "sc_raspketone", "fr_rasp"]),
 "note-red-berries": dict(
  say="No single berry: strawberries, raspberries, cherries and cranberries together, tangy and sweet, bright and fruity. It is a general red-fruit note, and depending on the perfume it can be fresh and crisp or syrupy.",
  src=["fr_redberries", "oz_redberries", "fr_redberriesshow"]),
 "note-scorched-pineapple": dict(
  say="Pineapple roasted until its sugars catch and darken: still juicy and tangy, but deeper, caramelised and a little smoky, fruit on the edge of burning. Pineapple's own smell already holds furaneol, a molecule that smells of caramel when concentrated, which is what the scorching brings forward.",
  src=["fr_pineapple", "fr_hotstuff", "wp_furaneol"]),
 "note-strawberry": dict(
  say="Sweet, jammy, a little green and a little creamy: the strawberry is built from a handful of molecules, above all furaneol, which smells of strawberry when dilute and of caramel when strong. As a note it can be fresh and juicy, or a candied, milkshake strawberry.",
  src=["fr_strawnews", "fr_straw", "st_furaneol"]),
}
out("FRU", S, N)

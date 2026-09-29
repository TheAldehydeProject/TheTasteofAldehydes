from acc import out, SAME
S = {
 "fr_art": ("https://www.fragrantica.com/notes/Artemisia-47.html", "Artemisia perfume ingredient, Artemisia fragrance and essential oils Artemisia absinthium"),
 "ps_art": ("https://perfumesociety.org/ingredients-post/artemisia/", "Artemisia - The Perfume Society"),
 "ps_allure": ("https://perfumesociety.org/the-allure-of-artemisia-wormwood-and-absinthe/", "The Allure of Artemisia, Wormwood and Absinthe - The Perfume Society"),
 "sc_armoise": ("https://www.scentspiracy.com/fragrance-ingredients/p/armoise-maroc", "Armoise Oil (CAS 8022-37-5) – Premium Natural Herbaceous Ingredient for Perfumery — Scentspiracy"),
 "fr_basil": ("https://www.fragrantica.com/notes/Basil-119.html", "Basil perfume ingredient, Basil fragrance and essential oils Ocimum basilicum"),
 "ps_basil": ("https://perfumesociety.org/ingredients-post/basil/", "Basil - The Perfume Society"),
 "fr_basilnews": ("https://www.fragrantica.com/news/Basil-in-Legends-Cooking-and-Perfume-19236.html", "Basil in Legends, Cooking, and Perfume ~ Raw Materials ~ Fragrantica"),
 "fw_chamo": ("https://fraterworks.com/products/roman-chamomile-oil", "Roman Chamomile Oil – Fraterworks"),
 "fr_chamo": ("https://www.fragrantica.com/notes/Chamomile-289.html", "Chamomile perfume ingredient, Chamomile fragrance and essential oils Matricaria chamomilla"),
 "ps_chamo": ("https://perfumesociety.org/ingredients-post/chamomile/", "Chamomile - The Perfume Society"),
 "fr_chamonews": ("https://www.fragrantica.com/news/What-Kind-Of-Chamomile-Is-Used-In-Perfumery--13658.html", "What Kind Of Chamomile Is Used In Perfumery? ~ Raw Materials ~ Fragrantica"),
 "fr_clary": ("https://www.fragrantica.com/notes/Clary-Sage-164.html", "Clary Sage perfume ingredient, Clary Sage fragrance and essential oils Salvia sclarea (Labiatae)"),
 "fw_claryabs": ("https://fraterworks.com/products/clary-sage-absolute-france", "Clary Sage Absolute – Fraterworks"),
 "ps_ambergris": ("https://perfumesociety.org/the-alchemy-of-ambergris/", "The alchemy of ambergris – perfume's most peculiar treasure - The Perfume Society"),
 "tg_clary": ("https://www.thegoodscentscompany.com/odor/sage-clary-sage.html", "The Good Scents Company -Odor Descriptor Listing for sage clary sage", "The Good Scents Company"),
 "eb_claryabs": ("https://edenbotanicals.com/clary-sage-absolute.html", "Clary Sage Absolute", "Eden Botanicals"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "fr_davana": ("https://www.fragrantica.com/notes/Davana-907.html", "Davana perfume ingredient, Davana fragrance and essential oils Artemisia pallens"),
 "ps_davana": ("https://perfumesociety.org/ingredients-post/davana/", "Davana - The Perfume Society"),
 "sc_davana": ("https://www.scentspiracy.com/fragrance-ingredients/p/davana-oil", "Davana Oil (8016-03-3) – Premium Natural Ingredient for Perfumery — Scentspiracy"),
 "wp_attar": ("https://en.wikipedia.org/wiki/Attar", "Attar - Wikipedia"),
 "fw_attars": ("https://fraterworks.com/a/library/oils-and-attars-of-oriental-and-indian-perfumery", "Oils and Attars of Oriental and Indian Perfumery – Fraterworks"),
 "pw_gluh": ("https://pinewardperfume.com/products/gluhwein", "Glühwein", "Pineward"),
 "fr_euc": ("https://www.fragrantica.com/notes/Eucalyptus-149.html", "Eucalyptus perfume ingredient, Eucalyptus fragrance and essential oils Eucalyptus globulus (Myrtaceae)"),
 "wp_eucoil": ("https://en.wikipedia.org/wiki/Eucalyptus_oil", "Eucalyptus oil - Wikipedia"),
 "wp_euglob": ("https://en.wikipedia.org/wiki/Eucalyptus_globulus", "Eucalyptus globulus - Wikipedia"),
 "fw_euc": ("https://fraterworks.com/products/eucalyptus-oil", "Eucalyptus Oil, Globulus – Fraterworks"),
 "fr_aromatics": ("https://www.fragrantica.com/news/Aromatics-The-Confusion-22605.html", "Aromatics: The Confusion ~ Columns ~ Fragrantica"),
 "wp_fougere": ("https://en.wikipedia.org/wiki/Foug%C3%A8re", "Fougère - Wikipedia"),
 "ps_fougere": ("https://perfumesociety.org/the-unfurling-mystery-of-fougere-a-fragrant-journey-through-time/", "The Unfurling Mystery of Fougère: A Fragrant Journey Through Time - The Perfume Society"),
 "fr_hops": ("https://www.fragrantica.com/notes/Hops-572.html", "Hops perfume ingredient, Hops fragrance and essential oils Humulus lupulus"),
 "tg_hop": ("https://www.thegoodscentscompany.com/data/es1006151.html", "hop oil, 8007-04-3", "The Good Scents Company"),
 "wp_hops": ("https://en.wikipedia.org/wiki/Hops", "Hops - Wikipedia"),
 "sc_juniper": ("https://www.scentspiracy.com/fragrance-ingredients/p/juniperberriesoil", "Juniper Berry Oil (84603-69-0) – Premium Natural Ingredient for Perfumery — Scentspiracy"),
 "ps_juniper": ("https://perfumesociety.org/ingredients-post/juniper/", "Juniper - The Perfume Society"),
 "fw_juniper": ("https://fraterworks.com/products/juniper-berry", "Juniper Berry Oil, Rectified – Fraterworks"),
 "fr_lav": ("https://www.fragrantica.com/notes/Lavender-1.html", "Lavender perfume ingredient, Lavender fragrance and essential oils"),
 "ps_lav": ("https://perfumesociety.org/ingredients-post/lavender/", "Lavender - The Perfume Society"),
 "ps_lavweek": ("https://perfumesociety.org/fragrance-ingredient-of-the-week-lavender/", "Fragrance ingredient of the week: Lavender - The Perfume Society"),
 "prin_haxan": ("https://prinlomros.com/product/haxan/", "Haxan", "PRIN"),
 "la_walk": ("https://lesabstraits.com/products/philosophers-walk", "Philosopher's Walk", "Les Abstraits"),
 "fr_verb": ("https://www.fragrantica.com/notes/Lemon-Verbena-120.html", "Lemon Verbena perfume ingredient, Lemon Verbena fragrance and essential oils Aloysia citrodora"),
 "ps_verb": ("https://perfumesociety.org/ingredients-post/lemon-verbena/", "Lemon verbena - The Perfume Society"),
 "ps_verbcharm": ("https://perfumesociety.org/the-zesty-charm-of-verbena-in-perfumery/", "The Zesty Charm of Verbena in Perfumery - The Perfume Society"),
 "fr_marj": ("https://www.fragrantica.com/notes/Marjoram-260.html", "Marjoram perfume ingredient, Marjoram fragrance and essential oils Marjorana hortensis, Origanum Marjorana"),
 "fw_sweetmarj": ("https://fraterworks.com/products/sweet-marjoram-oil", "Sweet Marjoram Oil – Fraterworks"),
 "fr_oregmarj": ("https://www.fragrantica.com/news/Oregano-and-Marjoram-in-Perfume-18361.html", "Oregano and Marjoram in Perfume ~ Raw Materials ~ Fragrantica"),
 "fr_mint": ("https://www.fragrantica.com/notes/Mint-160.html", "Mint perfume ingredient, Mint fragrance and essential oils Mentha spicata, piperita, aquatica (Labiatae)"),
 "ps_mint": ("https://perfumesociety.org/ingredients-post/mint/", "Mint - The Perfume Society"),
 "fr_mintcond": ("https://www.fragrantica.com/news/Mint-Condition-The-Growing-Popularity-of-Mint-in-Fragrance-9106.html", "Mint Condition: The Growing Popularity of Mint in Fragrance ~ Raw Materials ~ Fragrantica"),
 "sc_spear": ("https://www.scentspiracy.com/fragrance-ingredients/p/spearmint-oil", "Spearmint Oil Natural (8006-90-4) – Premium Natural Ingredient for Perfumery — Scentspiracy"),
 "wp_carvone": ("https://en.wikipedia.org/wiki/Carvone", "Carvone - Wikipedia"),
 "fr_mintnote": ("https://www.fragrantica.com/news/Mint-as-a-Perfume-Note-3604.html", "Mint as a Perfume Note ~ Raw Materials ~ Fragrantica"),
 "sc_myrtle": ("https://www.scentspiracy.com/fragrance-ingredients/p/myrtle", "Myrtle Oil (84082-67-7 / 8008-46-6) – Premium Natural Ingredient for Perfumery — Scentspiracy"),
 "fr_myrtle": ("https://www.fragrantica.com/notes/Myrtle-328.html", "Myrtle perfume ingredient, Myrtle fragrance and essential oils Myrtus"),
 "fr_myrtlenews": ("https://www.fragrantica.com/news/Myrtle-on-Earth-in-Paradise-and-in-Perfume-21280.html", "Myrtle on Earth, in Paradise, and in Perfume ~ Raw Materials ~ Fragrantica"),
 "fr_oreg": ("https://www.fragrantica.com/notes/Oregano-386.html", "Oregano perfume ingredient, Oregano fragrance and essential oils Origanum"),
 "st_oreg": ("https://www.scentree.co/en/Origanum_oil.html", "ScenTree - Origanum oil (CAS N° 8007-11-2)"),
 "fr_rosem": ("https://www.fragrantica.com/notes/Rosemary-49.html", "Rosemary perfume ingredient, Rosemary fragrance and essential oils"),
 "ps_rosem": ("https://perfumesociety.org/ingredients-post/rosemary/", "Rosemary - The Perfume Society"),
 "ps_rosemweek": ("https://perfumesociety.org/ingredient-of-the-week-rosemary/", "Perfume ingredient of the week: rosemary - The Perfume Society"),
 "fr_sage": ("https://www.fragrantica.com/notes/Sage-52.html", "Sage perfume ingredient, Sage fragrance and essential oils Salvia Officinalis"),
 "sc_sage": ("https://www.scentspiracy.com/fragrance-ingredients/p/salvia-officinalis-oil", "Salvia Officinalis Oil", "Scentspiracy"),
 "ps_sage": ("https://perfumesociety.org/ingredients-post/sage/", "Sage - The Perfume Society"),
 "wp_sageoil": ("https://en.wikipedia.org/wiki/Sage_oil", "Sage oil - Wikipedia"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "fr_thymenews": ("https://www.fragrantica.com/news/Thyme-in-Perfume-18355.html", "Thyme in Perfume ~ Raw Materials ~ Fragrantica"),
 "fr_thyme": ("https://www.fragrantica.com/notes/Thyme-97.html", "Thyme perfume ingredient, Thyme fragrance and essential oils Thymus vulgaris (Labiatae)"),
 "ps_thyme": ("https://perfumesociety.org/ingredients-post/thyme/", "Thyme - The Perfume Society"),
 "sc_thymol": ("https://www.scentspiracy.com/fragrance-ingredients/p/thymol", "Thymol (89-83-8) – Spicy-Herbaceous Phenolic Fragrance Ingredient — Scentspiracy"),
 "fr_worm": ("https://www.fragrantica.com/notes/Wormwood-369.html", "Wormwood perfume ingredient, Wormwood fragrance and essential oils Artemisia Absinthium"),
 "fr_starworm": ("https://www.fragrantica.com/news/The-Star-Wormwood-About-the-Bitterest-Herb-of-All-18738.html", "The Star Wormwood: About the Bitterest Herb of All ~ Raw Materials ~ Fragrantica"),
 "fr_yarrownews": ("https://www.fragrantica.com/news/Yarrow-in-the-Forest-and-in-Perfume-20614.html", "Yarrow in the Forest and in Perfume ~ Raw Materials ~ Fragrantica"),
 "wp_yarrowoil": ("https://en.wikipedia.org/wiki/Yarrow_oil", "Yarrow oil - Wikipedia"),
 "fr_yarrow": ("https://www.fragrantica.com/notes/Yarrow-681.html", "Yarrow perfume ingredient, Yarrow fragrance and essential oils Achillea millefolium"),
}
N = {
 "note-artemisia": dict(
  say="The wormwood family of silvery, bitter herbs, and in perfumery most often armoise, the oil of a wild Mediterranean artemisia. It is intensely green, dry and a little camphorous, bitter and herbal, with a hint of hay and something faintly smoky. It adds edge and a slightly dark, poetic mood rather than sweetness: a little of it sharpens a citrus opening or an aromatic fougère, and it is most often found in men's perfumes, where it balances the florals.",
  src=["fr_art", "ps_art", "ps_allure", "sc_armoise"]),
 "note-basil": dict(
  say="The kitchen herb, and it smells like a leaf rubbed between your fingers: green, sharp and a little spicy, with a touch of clove, since it shares clove's molecule, eugenol. Different basils lean different ways, some lemony, some like tarragon or aniseed, some simply basil. In perfume it gives a fresh kitchen-garden feel, bright and easy, and it sits beautifully with citrus.",
  src=["fr_basil", "ps_basil", "fr_basilnews"]),
 "note-chamomile": dict(
  say="The small daisy of chamomile tea. Its oil, usually from Roman chamomile, is sweet, warm and herbal, with a surprising fruitiness of green apple and pear, a touch of honey and hay, and the soft, soothing smell of a cup of chamomile tea. It is very diffusive but fragile, and it is used quietly in the heart of floral and herbal perfumes to add warmth.",
  src=["fw_chamo", "fr_chamo", "ps_chamo", "fr_chamonews"]),
 "note-clary-sage": dict(
  say="A tall sage with pale purple flowers, and softer and sweeter than kitchen sage: herbal and a little like lavender, but with a warm, musky, amber-like depth and a wine-like, hay-and-tobacco richness underneath. It matters to perfumery beyond its own smell: a waxy part of it, sclareol, is the starting point for ambroxan, the modern stand-in for ambergris.",
  src=["fr_clary", "tg_clary", "fw_claryabs", "ps_ambergris"],
  vars={
   "Clary Sage Absolute (France)": dict(say="Clary sage extracted with solvents rather than distilled, from French plants. The absolute is darker, denser and longer-lasting than the oil: less of the fresh herb and more of the sweet, wine-like, hay and tobacco side, with a balsamic edge.", src=["fw_claryabs", "eb_claryabs", "wp_absolute"]),
  }),
 "note-davana": dict(
  say="An Indian herb, a cousin of wormwood, whose oil smells nothing like a herb at all: sweet, fruity and boozy, like dried apricots and prunes soaked in rum or bourbon, with a tea-like softness and a hint of blackcurrant. Natural perfumers treasure it because real fruit notes are so hard to get from plants, and it rounds out florals and warms the heart of a perfume.",
  src=["fr_davana", "ps_davana", "sc_davana"],
  vars={
   "Davana Attar": dict(say="Davana made the old Indian way, as an attar: the herb is distilled with water in a copper still, and its vapour is caught in a vessel of sandalwood oil, then left to age. So it smells of davana's boozy dried fruit carried on a soft, creamy, woody base, and it lasts much longer than the plain oil.", src=["wp_attar", "fw_attars", "pw_gluh"]),
  }),
 "note-eucalyptus": dict(
  say="The leaves of the Australian gum tree, and the smell of a cough sweet or a sauna: icy, camphor-sharp and medicinal at first, cooling the nose, then greener and more herbal, like crushed leaves, with a faint sweet woodiness at the end. It brings a sharp, clean freshness to aromatic and fougère perfumes.",
  src=["fr_euc", "wp_eucoil", "fw_euc"],
  vars={
   "Blue Gum Eucalyptus": dict(say="The blue gum, Eucalyptus globulus, the tree most eucalyptus oil comes from: the classic cooling, camphor-sharp eucalyptus. Other species smell quite different, some of lemon and some of peppermint, so naming it says this is the familiar one.", src=["wp_euglob", "wp_eucoil"]),
  }),
 "note-herbal-notes": dict(
  say="No one herb: the green, aromatic smell of a bundle of them, rosemary, thyme, sage, mint, lavender and the like, which perfumers call aromatic notes. They smell fresh, sharp and a little bitter or camphorous, like a herb garden in the sun, and they are the backbone of fougères and colognes, especially men's.",
  src=["fr_aromatics", "wp_fougere", "ps_fougere"]),
 "note-hops": dict(
  say="The papery green cones of the hop plant, the flower that gives beer its bitterness and much of its smell. In perfume it is herbal, green and bitter, a little resinous and yeasty, and it can bring a whole brewery with it: fresh beer, malt and a slightly boozy, fermented air.",
  src=["fr_hops", "tg_hop", "wp_hops"]),
 "note-juniper-berry": dict(
  say="The small blue berries of the juniper bush, the flavour of gin, whose name comes from the Dutch and French words for juniper. The oil is fresh, piney and resinous, a little sappy and bitter, bracing and clean. It is strong, so it is used in small doses to give colognes, fougères and woody perfumes a crisp, piquant start.",
  src=["sc_juniper", "ps_juniper", "fw_juniper"],
  vars={"Juniper Berries": dict(same="No change: the plural of the same note.")}),
 "note-lavender": dict(
  say="The purple flower of Provence, and the backbone of fougères and barbershop perfumes. Its smell is floral and herbal at once: clean, fresh and slightly camphorous, sweet like hay, and depending on the oil it can lean cool and minty or warm and almost spicy. The finest grows high in the mountains; lavandin, a cheaper hybrid, is sharper and more camphorous and ends up mostly in candles and soap.",
  src=["fr_lav", "ps_lav", "ps_lavweek"],
  vars={
   "Lavender (three natural oils)": dict(say="Not one lavender but three natural lavender oils blended, the way PRIN lists it for Haxan: different lavenders smell different, some cool and minty, some sweet and floral, some warm and hay-like, and layering them gives a fuller, rounder lavender than any one alone.", src=["prin_haxan", "ps_lav"]),
   "Lavender de Provence": dict(say="Lavender from Provence, in the south of France, grown high in the hills, where the finest true lavender comes from. It is sweeter, softer and more floral than the camphor-sharp lavandin grown in the lowlands, and it is what a perfumer means by a fine lavender.", src=["la_walk", "ps_lav", "fr_lav"]),
  }),
 "note-lemon-verbena": dict(
  say="A South American shrub with long, narrow leaves that smell more of lemon than lemons do. Crushed, they are bright, sweet and zesty, lemon-fresh and clean with a green, herbal, almost tea-like softness underneath. It is uplifting and calm at once, a favourite of colognes and summer perfumes, and it lasts a little longer than true citrus.",
  src=["fr_verb", "ps_verb", "ps_verbcharm"]),
 "note-marjoram": dict(
  say="Oregano's gentler cousin. Sweet marjoram oil is warm and sweet-spicy rather than green: more like nutmeg and cardamom than a leafy herb, with a soft woody, faintly medicinal warmth underneath. It is used quietly, to add warmth and herbal lift to fougères and spicy or masculine perfumes.",
  src=["fr_marj", "fw_sweetmarj", "fr_oregmarj"]),
 "note-mint": dict(
  say="Cool, sharp and green: a crushed sprig from the garden. It can lean towards peppermint's icy bite, spearmint's softer sweetness, or a darker, more herbal wild mint. Perfumers long avoided it because it smells of toothpaste and mouthwash; used well, it is fresh, bright and reviving, and it is now the heart of many summer perfumes.",
  src=["fr_mint", "ps_mint", "fr_mintcond"],
  vars={
   "Peppermint": dict(say="The sharp, icy mint of sweets and toothpaste: most of its oil is menthol, which smells cold and feels cold, piercing and clean.", src=["fr_mintcond", "sc_spear", "fr_mintnote"]),
   "Spearmint": dict(say="The softer, sweeter mint of chewing gum: its smell comes from carvone rather than menthol, so it is greener, rounder and more herbal, and it does not cool the way peppermint does.", src=["sc_spear", "wp_carvone"]),
  }),
 "note-myrtle": dict(
  say="A Mediterranean shrub with glossy, fragrant leaves, sacred to Venus. Its oil is fresh and bright: green, camphorous and a little like eucalyptus, with a lemony, piney sharpness and a faint floral, fruity sweetness underneath. It is mostly a top note, and it sits in colognes and men's perfumes the way rosemary and sage do.",
  src=["sc_myrtle", "fr_myrtle", "fr_myrtlenews"]),
 "note-oregano": dict(
  say="The pizza herb, and in perfume stranger than you would expect: intensely herbal and resinous, green and camphorous at first, then dry, woody and a little smoky and medicinal, even leathery, because of its main molecule, carvacrol. It is rare in perfume; where it appears it gives a wild, sun-baked Mediterranean edge.",
  src=["fr_oreg", "fr_oregmarj", "st_oreg"]),
 "note-rosemary": dict(
  say="The needle-leaved Mediterranean herb: aromatic, pungent and camphorous, a little minty and lavender-like, clean and sharp. It was one of the first oils distilled for perfume, the heart of Hungary Water in the fourteenth and fifteenth centuries, and it still gives colognes and men's perfumes a fresh, sunlit, herb-garden feel.",
  src=["fr_rosem", "ps_rosem", "ps_rosemweek"]),
 "note-sage": dict(
  say="Kitchen sage, the grey-green herb of stuffing and smoke-cleansing. Its oil is powerful: herbal, camphorous and slightly medicinal, with a savoury, softly peppery warmth and a resinous, cedar-like dryness. It gives energy and bite to fougères and colognes, mostly men's. It is not clary sage, which is softer, sweeter and more amber.",
  src=["fr_sage", "sc_sage", "ps_sage", "wp_sageoil"],
  vars={
   "Salvia Absolute": dict(say="Salvia is simply sage's Latin name; the difference is the absolute, sage extracted with solvents rather than distilled with steam. An absolute keeps the plant's heavier, sweeter parts that steam leaves behind, so it is richer, rounder and longer-lasting than the sharp, camphorous oil.", src=["wp_absolute", "fr_sage", "pw_list"]),
  }),
 "note-thyme": dict(
  say="The small-leaved herb of Mediterranean hillsides. Its smell is strong and rich: herbal and spicy, sharply medicinal, warm, and in a perfume surprisingly leathery. Almost all of that comes from thymol, a molecule that smells exactly of thyme and clings for days. It brings a sunbaked, rugged character to aromatic perfumes.",
  src=["fr_thymenews", "fr_thyme", "ps_thyme", "sc_thymol"]),
 "note-wormwood": dict(
  say="Artemisia absinthium, the bitterest herb there is, and the one that flavours absinthe and vermouth. Its smell is sharp, bitter and intensely green, herbal and a little camphorous, with a dry hint of hay and smoke. It brings a dark, rebellious edge to a perfume, and it goes well with the absinthe and anise notes it belongs with.",
  src=["fr_worm", "ps_allure", "fr_starworm"]),
 "note-yarrow": dict(
  say="A common meadow flower whose oil comes out a startling deep blue, from azulene formed as it is distilled. It smells sharp, herbal and piney-camphorous at first, then softer: sweet, tea-like and woody, a little like chamomile, with a faint caramel sweetness. It is rare in perfume, which makes it quietly distinctive where it appears.",
  src=["fr_yarrownews", "wp_yarrowoil", "fr_yarrow"]),
}
out("ARO", S, N)

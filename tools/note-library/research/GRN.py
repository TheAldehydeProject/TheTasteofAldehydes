from acc import out, SAME
S = {
 "fw_hexenol": ("https://fraterworks.com/products/cis-3-hexenol", "Cis-3-Hexenol – Fraterworks"),
 "sc_hexenol": ("https://www.scentspiracy.com/fragrance-ingredients/p/cis-3-hexenol", "Cis-3-Hexenol (CAS 928-96-1) – Premium Synthetic Green Leaf Ingredient for Perfumery — Scentspiracy"),
 "fw_broken": ("https://fraterworks.com/blogs/information/scent-of-broken-leaves", "The Scent of Broken Leaves – Fraterworks"),
 "fr_greennews": ("https://www.fragrantica.com/news/Green-Notes-in-Perfumery-13990.html", "Green Notes in Perfumery ~ Raw Materials ~ Fragrantica"),
 "ps_fig": ("https://perfumesociety.org/fig-for-thought/", "Fig For Thought - The Perfume Society"),
 "fr_figleaf": ("https://www.fragrantica.com/notes/Fig-Leaf-150.html", "Fig Leaf perfume ingredient, Fig Leaf fragrance and essential oils Ficus carica (Moraceae)"),
 "fr_fignews": ("https://www.fragrantica.com/news/A-Fig-for-You-The-Scent-of-Fig-in-Perfumery-24802.html", "A Fig for You: The Scent of Fig in Perfumery ~ Raw Materials ~ Fragrantica"),
 "ps_galb": ("https://perfumesociety.org/ingredients-post/galbanum/", "Galbanum - The Perfume Society"),
 "fr_galb": ("https://www.fragrantica.com/notes/Galbanum-45.html", "Galbanum perfume ingredient, Galbanum fragrance and essential oils Ferula gummosa, syn. galbaniflua"),
 "wp_galb": ("https://en.wikipedia.org/wiki/Galbanum", "Galbanum - Wikipedia"),
 "fr_galbnews": ("https://www.fragrantica.com/news/Galbanum-Green-Acrid-Bitterness-4468.html", "Galbanum: Green, Acrid Bitterness ~ Raw Materials ~ Fragrantica"),
 "fr_grass": ("https://www.fragrantica.com/notes/Grass-277.html", "Grass perfume ingredient, Grass fragrance and essential oils Gramineae (Poaceae)"),
 "wp_cutgrass": ("https://en.wikipedia.org/wiki/Smell_of_freshly_cut_grass", "Smell of freshly cut grass - Wikipedia"),
 "ps_grass": ("https://perfumesociety.org/fragrance-ingredient-of-the-week-grass/", "Fragrance ingredient of the week: Grass - The Perfume Society"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "fr_green": ("https://www.fragrantica.com/notes/Green-Notes-318.html", "Green Notes perfume ingredient, Green Notes fragrance and essential oils"),
 "pf_green": ("https://www.perfumerflavorist.com/fragrance/ingredients/article/21855677/green-notes", "Green notes | Perfumer & Flavorist"),
 "ps_greenfloral": ("https://perfumesociety.org/fragrance-families/floral/green/", "Green floral - The Perfume Society"),
 "fr_wheat": ("https://www.fragrantica.com/notes/Wheat-387.html", "Wheat perfume ingredient, Wheat fragrance and essential oils Triticum"),
 "ps_wheatbarley": ("https://perfumesociety.org/softly-gathered-the-scents-of-wheat-barley/", "Softly Gathered: The Scents of Wheat & Barley - The Perfume Society"),
 "fr_jmwheat": ("https://www.fragrantica.com/perfume/Jo-Malone-London/Green-Wheat-Meadowsweet-48320.html", "Green Wheat & Meadowsweet Jo Malone London perfume - a fragrance for women and men 2018"),
 "fw_hay": ("https://fraterworks.com/products/hay-signature-absolute", "Hay “Signature” Absolute – Fraterworks"),
 "fr_coumnews": ("https://www.fragrantica.com/news/Coumarin-Sweet-Smell-of-Hay-Cut-Grass-Vanillic-Notes-2965.html", "Coumarin: Sweet Smell of Hay, Cut Grass & Vanillic Notes ~ Raw Materials ~ Fragrantica"),
 "wp_vernal": ("https://en.wikipedia.org/wiki/Anthoxanthum_odoratum", "Anthoxanthum odoratum - Wikipedia"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "ps_ivy": ("https://perfumesociety.org/ingredients-post/ivy/", "Ivy - The Perfume Society"),
 "fr_ivy": ("https://www.fragrantica.com/notes/Ivy-192.html", "Ivy perfume ingredient, Ivy fragrance and essential oils Araliaceae"),
 "fr_ivynews": ("https://www.fragrantica.com/news/Scents-of-New-England-Ivy-Apple-Blossom-and-The-Sea-20511.html", "Scents of New England: Ivy, Apple Blossom, and The Sea ~ Fragrances and Cultures ~ Fragrantica"),
 "fw_poplar": ("https://fraterworks.com/products/poplar-bud-absolute", "Poplar Bud Absolute 50% TEC – Fraterworks"),
 "fr_poplar": ("https://www.fragrantica.com/notes/Poplar-Populus-buds-540.html", "Poplar (Populus) Buds perfume ingredient, Poplar (Populus) Buds fragrance and essential oils Populus"),
 "wp_balsampoplar": ("https://en.wikipedia.org/wiki/Populus_sect._Tacamahaca", "Populus sect. Tacamahaca - Wikipedia"),
 "fr_raspleaf": ("https://www.fragrantica.com/notes/Raspberry-leaf-1650.html", "Raspberry leaf perfume ingredient, Raspberry leaf fragrance and essential oils"),
 "fw_raspleaf": ("https://fraterworks.com/products/raspberry-leaf-absolute", "Raspberry Leaf Absolute – Fraterworks"),
 "fr_rhubarb": ("https://www.fragrantica.com/notes/Rhubarb-188.html", "Rhubarb perfume ingredient, Rhubarb fragrance and essential oils gen. Rheum, fam. Polygonaceae"),
 "fr_rhubarbnews": ("https://www.fragrantica.com/news/Exploring-rhubarb-scents-18586.html", "Exploring rhubarb scents ~ Columns ~ Fragrantica"),
 "ps_rhubarb": ("https://perfumesociety.org/ingredients-post/rhubarb/", "Rhubarb - The Perfume Society"),
 "fr_sugar": ("https://www.fragrantica.com/notes/Sugar-200.html", "Sugar perfume ingredient, Sugar fragrance and essential oils Saccharum Officinarum"),
 "ps_sugar": ("https://perfumesociety.org/ingredients-post/sugar/", "Sugar - The Perfume Society"),
 "fr_demcane": ("https://www.fragrantica.com/perfume/Demeter-Fragrance/Sugar-Cane-17911.html", "Sugar Cane Demeter Fragrance perfume - a fragrance for women and men"),
 "cs_vernal": ("https://www.cotswoldseeds.com/species/173/sweet-vernal-grass", "Sweet Vernal Grass", "Cotswold Seeds"),
 "wp_sweetgrass": ("https://en.wikipedia.org/wiki/Hierochloe_odorata", "Hierochloe odorata - Wikipedia"),
 "fr_tomleaf": ("https://www.fragrantica.com/notes/Tomato-Leaf-253.html", "Tomato Leaf perfume ingredient, Tomato Leaf fragrance and essential oils Solanum lycopersicum"),
 "ps_tomleaf": ("https://perfumesociety.org/ingredients-post/tomato-leaf/", "Tomato leaf - The Perfume Society"),
 "fr_tomnews": ("https://www.fragrantica.com/news/Does-Tomato-Work-in-Fragrances-14723.html", "Does Tomato Work in Fragrances? ~ Columns ~ Fragrantica"),
 "fr_vleaf": ("https://www.fragrantica.com/notes/Violet-Leaf-127.html", "Violet Leaf perfume ingredient, Violet Leaf fragrance and essential oils Viola odorata"),
 "fw_vleaf": ("https://fraterworks.com/products/violet-leaf-absolute-france", "Violet Leaf Absolute, France – Fraterworks"),
 "ps_vleaf": ("https://perfumesociety.org/ingredients-post/violet-leaves/", "Violet leaves - The Perfume Society"),
 "st_vleaf": ("https://www.scentree.co/en/Violet_leaf_absolute.html", "ScenTree - Violet leaf absolute (CAS N° 8024-08-6)"),
 "tg_watercress": ("https://www.thegoodscentscompany.com/odor/watercress.html", "The Good Scents Company -Odor Descriptor Listing for watercress", "The Good Scents Company"),
 "ps_veg": ("https://perfumesociety.org/vegetable-patch-perfumes/", "A bumper crop of vegetable patch perfumes to spray your five a day! - The Perfume Society"),
 "wp_watercress": ("https://en.wikipedia.org/wiki/Watercress", "Watercress - Wikipedia"),
}
N = {
 "note-crushed-leaves": dict(
  say="The sharp green smell of a leaf torn or a stem snapped. Plants give it off the moment they are hurt, and it comes mostly from leaf alcohol, a molecule perfumers can buy on its own: intensely fresh and green, with a juicy, sappy, slightly vegetable edge. A touch of it makes flowers and fruits in a perfume smell freshly picked rather than polished.",
  src=["fw_hexenol", "sc_hexenol", "fw_broken", "fr_greennews"]),
 "note-fig-leaf": dict(
  say="Not the fruit but the tree: the big, rough leaves and their milky sap. It smells green and a little bitter at first, then soft and creamy, almost coconut-like and gently sweet, with a faint woodiness from the sun-warmed branches. Lightly done it is cool shade on a hot Mediterranean day; richly done it is almost edible.",
  src=["ps_fig", "fr_figleaf", "fr_fignews"]),
 "note-galbanum": dict(
  say="A sticky gum from a giant fennel-like plant of Iran, and the greenest material in perfumery. It is sharp, bitter and piercing at first, like snapped stems, green peppers and pea pods, with a touch of turpentine, then softer, balsamic and woody. A few drops make a whole perfume green; it is thought to have started the whole family of green perfumes, with Balmain's Vent Vert in 1945.",
  src=["ps_galb", "fr_galb", "wp_galb", "fr_galbnews"]),
 "note-grass": dict(
  say="The burst of smell that rises from a lawn just after mowing: torn blades and crushed stems, bright, green and sappy. Grass gives it off as a defence when it is cut, and perfumers rebuild it from those same molecules. In a perfume it can feel cool and airy, or a little bitter, metallic or earthy, and it makes an opening feel alive.",
  src=["fr_grass", "wp_cutgrass", "ps_grass"],
  vars={
   "Wild Grass": dict(same="No change: grass, as Pineward names it; wild only says it grows long and uncut."),
  }),
 "note-green-notes": dict(
  say="No one plant but the family of green smells: leaves, stems, cut grass, sap, a little galbanum or violet leaf. They are crisp, sharp and alive, and even a trace of them makes a perfume feel fresher and more natural. Perfumers have leaned on them far more since the 1960s, especially in sporty and summer perfumes.",
  src=["fr_green", "pf_green", "fr_greennews", "ps_greenfloral"],
  vars={
   "Green Accord": dict(same="No change: an accord is only a smell built from several materials, and green notes are always built that way."),
  }),
 "note-green-wheat": dict(
  say="Wheat still growing in the field, before it turns gold. It smells fresh, green and a little sweet, with the soft, nutty, cereal warmth of the grain underneath, and a hint of flour and bread. It sits between a green note and a gourmand one, a summer field rather than a bakery.",
  src=["fr_wheat", "ps_wheatbarley", "fr_jmwheat"]),
 "note-hay": dict(
  say="Cut grass dried in the sun, and it smells sweet rather than green: warm, herbal and faintly like vanilla and almonds, with a honey and tobacco softness. That sweetness is coumarin, which meadow grasses such as sweet vernal grass are full of. It is the heart of the fougère, and it brings summer, farms and old barns with it.",
  src=["fw_hay", "fr_coumnews", "wp_vernal"],
  vars={
   "Hay Absolute": dict(say="Hay extracted with solvents rather than built from molecules: a thick, dark, natural extract, warmer, sweeter and more complex than a hay accord, with honey and tobacco in it, and long-lasting.", src=["fw_hay", "wp_absolute"]),
   "Hay Bales": dict(same="No change: hay, as Pineward names it, gathered into bales."),
  }),
 "note-ivy": dict(
  say="The dark evergreen climber, and its smell is quiet: cool, dark green and leafy, with a dash of spice, a minty lift at the top and an earthy side like loam or bean sprouts. It gives a perfume a shaded, overgrown freshness rather than a bright one.",
  src=["ps_ivy", "fr_ivy", "fr_ivynews"],
  vars={"Climbing Ivy": dict(same="No change: ivy, named by the way it grows.")}),
 "note-poplar-bud": dict(
  say="The sticky, resin-coated leaf buds of the balsam poplar, which fill the air with a sweet smell as they open in spring. Extracted, they are balsamic and green, bittersweet and honeyed, with a surprising dried-fruit side of apricot and prune, a touch of propolis and soft leather. They give a forest a sweet, sunlit warmth and help a perfume last.",
  src=["fw_poplar", "fr_poplar", "wp_balsampoplar"],
  vars={
   "Poplar Buds": dict(same="No change: the plural of the same note."),
   "Poplar": dict(same="No change: in perfume the poplar's smell is its sticky spring buds."),
  }),
 "note-raspberry-leaf": dict(
  say="Nothing like the berry: the leaf smells of the forest floor rather than of sweets. It is green and leafy, like tea, with a soft, jammy fruitiness underneath, a little resinous and balsamic, even a touch leathery, like mulled wine and dried fruit. It adds a natural, shaded depth to fruity and green perfumes.",
  src=["fr_raspleaf", "fw_raspleaf"]),
 "note-rhubarb": dict(
  say="The pink stalks of spring, tart and green: sour and juicy, vegetal and a little earthy, with a red-berry sweetness. The perfumer's rhubarb is usually tidier than the real thing, less sour and more fruity, but still unmistakable. It is one of perfumery's happiest notes, bright and zippy, and it sits beautifully with rose, violet and raspberry.",
  src=["fr_rhubarb", "fr_rhubarbnews", "ps_rhubarb"]),
 "note-sugar-cane": dict(
  say="The tall grass sugar comes from. There is no oil of sugar cane; perfumers build it from sweet molecules, so it smells of sugar with a green, grassy freshness to it, sometimes airy like spun sugar and sometimes darker, like cane just starting to caramelise, often with a hint of almond or rum. It is a gourmand note with some sun and air in it.",
  src=["fr_sugar", "ps_sugar", "fr_demcane"]),
 "note-sweet-vernalgrass": dict(
  say="A small meadow grass that flowers early in spring, and the plant that gives hay its sweet smell. It is full of coumarin, so dried it smells of fresh hay with a hint of vanilla and almond, sweet and soft. In a perfume it is hay and meadow, warm rather than green.",
  src=["wp_vernal", "cs_vernal", "fr_coumnews"]),
 "note-sweetgrass": dict(
  say="A sacred grass for many Indigenous peoples of North America, braided and burned as incense, and full of coumarin: it smells of fresh-mown hay and spring flowers, sweet like vanilla and almonds, with a hint of thyme and lavender. It is soft, warm and calming, hay with something holy about it.",
  src=["wp_sweetgrass", "fr_coumnews"],
  vars={
   "Bison Grass": dict(same="No change: bison grass is the same plant, under the name it has in Poland, where a blade of it flavours Żubrówka vodka."),
  }),
 "note-tomato-leaf": dict(
  say="The smell left on your fingers after brushing a tomato plant: intensely green, sharp and bitter, astringent and a little spicy, vegetal and clean. It is loud, always the greenest thing in a blend, and it gives colognes and summer perfumes a bittersweet, garden-fresh shock.",
  src=["fr_tomleaf", "ps_tomleaf", "fr_tomnews"]),
 "note-violet-leaf": dict(
  say="The heart-shaped leaves of the violet, not its flowers, and they smell completely different: intensely green, cool and watery, strikingly like cucumber, with a slightly metallic edge and a faint flower underneath. The cucumber is real chemistry, the same molecules as the vegetable. It is the classic green of fresh, aquatic and fougère perfumes.",
  src=["fr_vleaf", "fw_vleaf", "ps_vleaf", "st_vleaf"]),
 "note-watercress": dict(
  say="The small leaves of a stream-grown salad, and they smell as they taste: bright, crisp and peppery-green, juicy and a little mustardy. In a perfume it adds a fresh, vegetal bite, like a garden rinsed with cold water.",
  src=["tg_watercress", "ps_veg", "wp_watercress"]),
}
out("GRN", S, N)

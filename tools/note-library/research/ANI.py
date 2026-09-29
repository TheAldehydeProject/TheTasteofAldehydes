from acc import out, SAME
S = {
 "fr_ambergris": ("https://www.fragrantica.com/notes/Ambergris-524.html", "Ambergris perfume ingredient, Ambergris fragrance and essential oils"),
 "ps_ambergris": ("https://perfumesociety.org/ingredients-post/ambergris/", "Ambergris - The Perfume Society"),
 "ps_ambergrisalchemy": ("https://perfumesociety.org/the-alchemy-of-ambergris/", "The Alchemy of Ambergris – Perfume’s Most Peculiar Treasure - The Perfume Society"),
 "wp_ambergris": ("https://en.wikipedia.org/wiki/Ambergris", "Ambergris - Wikipedia"),
 "fr_ambergrisnews": ("https://www.fragrantica.com/news/Ambergris-Know-The-Raw-Material-Better-3010.html", "Ambergris - Know The Raw Material Better ~ Raw Materials ~ Fragrantica"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "fr_ambrette": ("https://www.fragrantica.com/notes/Ambrette-Musk-Mallow-107.html", "Ambrette (Musk Mallow) perfume ingredient, Ambrette (Musk Mallow) fragrance and essential oils Abelmoschus moschatus"),
 "ps_ambrette": ("https://perfumesociety.org/ingredients-post/ambrette/", "Ambrette - The Perfume Society"),
 "fr_ambrettenews": ("https://www.fragrantica.com/news/Ambrette-Suave-Vegetal-Musk-7219.html", "Ambrette: Suave Vegetal Musk ~ Raw Materials ~ Fragrantica"),
 "fw_ambretteseed": ("https://fraterworks.com/products/ambrette-seed-oil", "Ambrette Seed Oil – Fraterworks"),
 "fr_animal": ("https://www.fragrantica.com/notes/Animal-Notes-794.html", "Animal Notes perfume ingredient, Animal Notes fragrance and essential oils"),
 "fr_animalics": ("https://www.fragrantica.com/news/Rise-of-the-Animalics-The-New-Dirty-Trend-Part-I-of-III-7272.html", "Rise of the Animalics: The New Dirty Trend Part I of III ~ Fragrance Reviews ~ Fragrantica"),
 "fr_castoreum": ("https://www.fragrantica.com/notes/Castoreum-102.html", "Castoreum perfume ingredient, Castoreum fragrance and essential oils Castor fiber (Castoridae)"),
 "ps_castoreum": ("https://perfumesociety.org/ingredients-post/castoreum/", "Castoreum - The Perfume Society"),
 "wp_castoreum": ("https://en.wikipedia.org/wiki/Castoreum", "Castoreum - Wikipedia"),
 "fr_castoreumnews": ("https://www.fragrantica.com/news/Castoreum-2229.html", "Castoreum ~ Raw Materials ~ Fragrantica"),
 "wp_absolute": ("https://en.wikipedia.org/wiki/Absolute_(perfumery)", "Absolute (perfumery) - Wikipedia"),
 "la_douleur": ("https://lesabstraits.com/products/la-douleur-exquise", "La Douleur Exquise", "Les Abstraits"),
 "fr_civet": ("https://www.fragrantica.com/notes/Civet-104.html", "Civet perfume ingredient, Civet fragrance and essential oils Paradoxurus Hermaphroditus"),
 "ps_civet": ("https://perfumesociety.org/ingredients-post/civet/", "Civet - The Perfume Society"),
 "wp_civet": ("https://en.wikipedia.org/wiki/Civet_(perfumery)", "Civet (perfumery) - Wikipedia"),
 "sc_civetone": ("https://www.scentspiracy.com/fragrance-ingredients/p/civetone", "Civetone (CAS 542-46-1): Animalic Musk – Premium Synthetic Fragrance Ingredient — Scentspiracy"),
 "fr_costusnews": ("https://www.fragrantica.com/news/Costus-The-Opposite-of-Clean-15052.html", "Costus: The Opposite of Clean ~ Raw Materials ~ Fragrantica"),
 "fr_costus": ("https://www.fragrantica.com/notes/Costus-439.html", "Costus perfume ingredient, Costus fragrance and essential oils Costus"),
 "fw_costustinc": ("https://fraterworks.com/products/costus-root-tincture-20", "Costus Root Tincture 20% – Fraterworks"),
 "fr_goathair": ("https://www.fragrantica.com/notes/Goat-hair-tincture-412.html", "Goat Hair perfume ingredient, Goat Hair fragrance and essential oils"),
 "prin_haxan": ("https://prinlomros.com/product/haxan/", "Haxan", "Prin Lomros"),
 "fr_hyraceum": ("https://www.fragrantica.com/notes/Hyraceum-411.html", "Hyraceum perfume ingredient, Hyraceum fragrance and essential oils Hyraceum"),
 "wp_hyraceum": ("https://en.wikipedia.org/wiki/Hyraceum", "Hyraceum - Wikipedia"),
 "fw_hyraceumtinc": ("https://fraterworks.com/products/hyraceum-tincture-10", "Hyraceum Tincture 10% – Fraterworks"),
 "fr_hyraxnews": ("https://www.fragrantica.com/news/Hyrax-2275.html", "Hyrax ~ Raw Materials ~ Fragrantica"),
 "la_cendres": ("https://lesabstraits.com/products/des-cendres", "Des Cendres", "Les Abstraits"),
 "wp_lanolin": ("https://en.wikipedia.org/wiki/Lanolin", "Lanolin - Wikipedia"),
 "tg_lanolin": ("https://www.thegoodscentscompany.com/data/rw1254311.html", "lanolin, 8006-54-0", "The Good Scents Company"),
}
N = {
 "note-ambergris": dict(
  say="A waxy lump made in the gut of the sperm whale, around the beaks of the squid it eats, then cast out to float on the sea for years before it washes up on a beach. Fresh, it smells faecal; aged by sun and salt water, it turns into one of the most prized smells there is: sweet, earthy and marine, like seaweed, tobacco and sandalwood, musky and radiant, and to some like the wood of an old church. It makes a perfume glow and last. The trade is banned in many countries, so the note is almost always built from molecules now.",
  src=["ps_ambergris", "ps_ambergrisalchemy", "wp_ambergris", "fr_ambergris"],
  vars={
   "Pacific Ambergris": dict(say="Pineward names its ambergris after the Pacific, the ocean it floats on before it reaches a shore: the same sweet, salty, marine material, with the sea around it put forward.", src=["pw_list", "ps_ambergris"]),
  }),
 "note-ambrette": dict(
  say="The seeds of the musk mallow, a relative of hibiscus from India. They smell of musk without any animal: sweet, soft and floral, somewhere between amber and musk, a little nutty and green at first, with a pear-like fruitiness and a powdery, iris-like warmth underneath. It has long stood in for animal musk.",
  src=["fr_ambrette", "ps_ambrette", "fr_ambrettenews", "fw_ambretteseed"]),
 "note-animal-notes": dict(
  say="The smells of animals, and of the animal in us: once taken from the musk deer, the beaver, the civet and the sperm whale, now almost always made in the laboratory, or taken without harm from things like hyrax stone and goat hair. They smell warm, dirty and close: skin, fur, leather, the barnyard. In a trace they give a perfume depth and a sensual pull; what one person finds natural, another finds unbearable.",
  src=["fr_animal", "fr_animalics"]),
 "note-botanical-musk": dict(
  say="Musk from plants rather than animals or the laboratory: seeds and roots that happen to make musky molecules of their own, above all ambrette, the musk mallow seed, and angelica root. It smells soft, warm and skin-like, cleaner and greener than animal musk.",
  src=["fr_animal", "fr_ambrettenews", "pw_list"]),
 "note-castoreum": dict(
  say="A secretion of the beaver, which it uses to mark its territory, once taken for perfume and now nearly always rebuilt from other materials. Undiluted it is sharp and tarry, like birch tar and Russian leather; diluted it becomes warm and sweet, leathery and musky, a little fruity. Its smell depends on what the beaver ate, birch, willow and poplar among it, and it sits at the heart of leather and chypre perfumes.",
  src=["fr_castoreum", "ps_castoreum", "wp_castoreum", "fr_castoreumnews"],
  vars={
   "Castoreum Absolute": dict(say="Castoreum taken as an absolute, with solvents: more concentrated and longer-lasting than a tincture, its leathery, tarry warmth at its fullest.", src=["wp_absolute", "fr_castoreum", "la_douleur"]),
  }),
 "note-civet": dict(
  say="A secretion of the civet cat, once gathered for perfume and now replaced by civetone, the molecule that gives it most of its smell. On its own it is pungent and faecal, like urine and fat; in a trace, diluted, it turns sweet, warm and radiant, and makes the flowers around it deeper, richer and more alive. Vintage perfumes used the real thing; the civet in a perfume today is synthetic.",
  src=["fr_civet", "ps_civet", "wp_civet", "sc_civetone"]),
 "note-costus": dict(
  say="A root whose oil smells like unwashed hair: a scalp warmed by the sun, a cat's fur, a wet dog, a goat. Under that animal warmth it is soft and powdery like orris root, creamy and fatty, even a little like violets at first. Natural costus is now banned in perfume, as the plant has become endangered, so perfumers rebuild it.",
  src=["fr_costusnews", "fr_costus", "fw_costustinc"]),
 "note-goat-hair": dict(
  say="The hair of a billy goat in rut, steeped in alcohol as a tincture: an animal note natural perfumers can take without harming the animal. It smells warm and musky, of fur and animal, and next to castoreum it turns into the smell of a farmyard. Haxan uses it.",
  src=["fr_goathair", "fr_animal", "prin_haxan"],
  vars={"Goat Hair Tincture": dict(same="No change: goat hair is used in perfume as a tincture, the hair steeped in alcohol; the word only says how.")}),
 "note-hyrax": dict(
  say="Africa stone: the droppings of the rock hyrax, a small animal of Africa, hardened and aged into stone, and collected without harm. It smells deep, fermented and animal, like musk, civet, castoreum, tobacco and agarwood at once, with a tarry, leathery, barnyard edge. It is used for the depth it gives, and it divides people.",
  src=["fr_hyraceum", "wp_hyraceum", "fw_hyraceumtinc", "fr_hyraxnews", "la_cendres"]),
 "note-lanolin": dict(
  say="The wax sheep secrete into their wool, washed out of it and used in creams and balms. It smells of raw wool: soft, waxy and dense, warm and faintly animal.",
  src=["wp_lanolin", "tg_lanolin", "pw_list"]),
 "note-sheep-wool": dict(
  say="A sheep's fleece, before it is washed: its smell is mostly lanolin, the wax sheep secrete into their wool. Warm, soft and waxy, faintly animal, the smell of a wool jumper just come in from the rain.",
  src=["wp_lanolin", "pw_list"]),
}
out("ANI", S, N)

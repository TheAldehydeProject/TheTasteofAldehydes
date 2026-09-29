from acc import out, SAME
S = {
 "fr_leather": ("https://www.fragrantica.com/notes/Leather-156.html", "Leather perfume ingredient, Leather fragrance and essential oils"),
 "ps_leather": ("https://perfumesociety.org/ingredients-post/leather/", "Leather - The Perfume Society"),
 "wp_birchtar": ("https://en.wikipedia.org/wiki/Birch-tar", "Birch bark tar - Wikipedia"),
 "fr_ibq": ("https://www.fragrantica.com/news/Isobutyl-Quinoline-From-Coty-Chypre-to-Tom-Ford-Ombre-Leather-16-9248.html", "Isobutyl Quinoline: From Coty Chypre to Tom Ford Ombré Leather 16 ~ Raw Materials ~ Fragrantica"),
 "sc_ibq": ("https://www.scentspiracy.com/fragrance-ingredients/p/6-isobutyl-quinoline", "6-Isobutyl Quinoline (CAS 68198-80-1) – Premium Synthetic Ingredient for Perfumery — Scentspiracy"),
 "fr_musk": ("https://www.fragrantica.com/notes/Musk-4.html", "Musk perfume ingredient, Musk fragrance and essential oils Moschus Moschiferus"),
 "wp_musk": ("https://en.wikipedia.org/wiki/Musk", "Musk - Wikipedia"),
 "ps_musk": ("https://perfumesociety.org/ingredients-post/musk/", "Musk - The Perfume Society"),
 "wp_synmusk": ("https://en.wikipedia.org/wiki/Synthetic_musk", "Synthetic musk - Wikipedia"),
 "sc_musks": ("https://www.scentspiracy.com/blog/the-musks-an-insight", "The Musks, an insight - Blog — Scentspiracy"),
 "fr_musknat": ("https://www.fragrantica.com/news/Natural-and-Synthetic-Musk-5243.html", "Natural and Synthetic Musk ~ Raw Materials ~ Fragrantica"),
 "fr_whitemusk": ("https://www.fragrantica.com/news/Best-in-Show-White-Musk-2019-11861.html", "Best in Show: White Musk (2019) ~ Best in Show ~ Fragrantica"),
 "pw_velvetine": ("https://pinewardperfume.com/products/velvetine", "Velvetine", "Pineward"),
 "fr_skin": ("https://www.fragrantica.com/notes/Skin-882.html", "Skin perfume ingredient, Skin fragrance and essential oils"),
 "fr_skinmusk": ("https://www.fragrantica.com/notes/Skin-musk-1809.html", "Skin musk perfume ingredient, Skin musk fragrance and essential oils"),
 "fr_skinabove": ("https://www.fragrantica.com/news/A-Skin-Above-16344.html", "A Skin Above ~ Columns ~ Fragrantica"),
 "adar_lignum": ("https://adarperfumes.com/products/lignum-dei-the-wood-of-god-essence-of-hope-micro-batch-77-pieces", "Lignum Dei: The Wood of God", "ADAR Perfumes"),
 "fr_suede": ("https://www.fragrantica.com/notes/Suede-196.html", "Suede perfume ingredient, Suede fragrance and essential oils"),
 "ps_suede": ("https://perfumesociety.org/ingredients-post/suede/", "Suede - The Perfume Society"),
 "oz_suede": ("https://www.osmoz.com/encyclopedia/raw-materials/leather/110/suede", "Suede Perfumes raw material - Suede Scent", "Osmoz"),
}
N = {
 "note-leather": dict(
  say="There is no leather oil to take: a leather note is always built, from materials that smell of tanned hide. Birch tar gives it smoke and tar, castoreum an animal warmth, isobutyl quinoline a bitter, inky, green-leather bite, and labdanum and saffron-like molecules a softer, warmer skin. The result can be anything from a new car seat or a riding boot, dark and smoky like the old Russian leather, to a worn, supple glove. It sits in the base and lasts.",
  src=["fr_leather", "ps_leather", "wp_birchtar", "fr_ibq", "sc_ibq"],
  vars={
   "Leather Accord": dict(same="No change: leather, with the word accord saying it is built, which every leather note is."),
  }),
 "note-musk": dict(
  say="Once the dried gland of the male musk deer, the most precious raw material perfumery had, and banned since the deer was protected in 1979; now almost always made in the laboratory. Musk smells soft, warm and close: clean skin, a little powdery, sweet, sometimes animal. The synthetic musks come in three families, nitro, polycyclic and macrocyclic, the last the nearest to the real thing. Musk is how most perfumes end, holding the rest to the skin long after the top has gone.",
  src=["fr_musk", "wp_musk", "ps_musk", "wp_synmusk", "sc_musks"],
  vars={
   "White Musk": dict(say="Not the deer's musk but the clean, laundry-soft musk of the laboratory: synthetic, lighter, sweeter and more like fresh cotton and skin than anything animal. It is one of the commonest notes in perfume today.", src=["wp_musk", "fr_whitemusk", "wp_synmusk"]),
   "Deer Musk": dict(say="Musk named for where it once came from, the gland of the musk deer: warm, animal, dark and a little dirty, far rounder than white musk. The real thing has been banned for decades, so in a modern perfume it is rebuilt to smell like it.", src=["fr_musk", "wp_musk", "ps_musk"]),
   "Tonkin Musk": dict(say="Tonkin, or Tonquin, was the most prized grade of deer musk, from Tibet and China, ahead of Assam and Nepal musk. Pineward names it for that old, deep, animal musk, which today can only be reconstructed.", src=["fr_musknat", "fr_musk", "pw_velvetine"]),
  }),
 "note-skin": dict(
  say="The smell of clean, warm skin, built rather than taken from anywhere: soft musks above all, sometimes with ambergris, a trace of powder, and a little sweetness like a lotion. Fragrantica calls it a comfortable, warm, powdery-musky scent. A perfume with it wears close, as though it were your own skin smelling a little better.",
  src=["fr_skin", "fr_skinmusk", "fr_skinabove", "adar_lignum"]),
 "note-suede": dict(
  say="Leather made soft: an accord built by perfumers to smell of the brushed, velvety underside of hide rather than a polished or smoky one. Where leather is tarry, suede is powdery, musky and gentle, a little sweet, sometimes like a new pair of gloves. It sits in the base and warms whatever is with it.",
  src=["fr_suede", "ps_suede", "oz_suede"]),
}
out("ANI2", S, N)

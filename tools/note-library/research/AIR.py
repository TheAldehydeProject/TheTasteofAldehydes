from acc import out, SAME
S = {
 "fr_airy": ("https://www.fragrantica.com/notes/Airy-Note-1772.html", "Airy Note perfume ingredient, Airy Note fragrance and essential oils"),
 "fr_ozonic": ("https://www.fragrantica.com/notes/Ozonic-Notes-669.html", "Ozonic Notes perfume ingredient, Ozonic Notes fragrance and essential oils"),
 "fr_silentrain": ("https://www.fragrantica.com/perfume/Almost-Human/Silent-Rain-122263.html", "Silent Rain Almost Human perfume - a fragrance for women and men"),
 "ps_aquatic": ("https://perfumesociety.org/dive-into-aquatic-fragrances/", "Dive Into Aquatic Fragrances - The Perfume Society"),
 "wp_calone": ("https://en.wikipedia.org/wiki/Calone", "Calone - Wikipedia"),
 "fr_calone": ("https://www.fragrantica.com/news/Calone-The-Air-of-the-1990s-8150.html", "Calone: The Air of the 1990s ~ Raw Materials ~ Fragrantica"),
 "sc_calone": ("https://www.scentspiracy.com/fragrance-ingredients/p/calone", "Calone (28940-11-6) — Premium Marine Synthetic Ingredient for Perfumery — Scentspiracy"),
 "at_spinal": ("https://ataraxiaperfumery.com/products/spinal-fluid", "Spinal Fluid", "Ataraxia Perfumery"),
 "fr_spinal": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Spinal-Fluid-115343.html", "Spinal Fluid Ataraxia Perfumery perfume - a fragrance for women and men"),
 "pa_spinal": ("https://www.parfumo.com/Perfumes/ataraxia/spinal-fluid", "Spinal Fluid by Ataraxia", "Parfumo"),
 "adar_lignum": ("https://adarperfumes.com/products/lignum-dei-the-wood-of-god-essence-of-hope-micro-batch-77-pieces", "Lignum Dei: The Wood of God", "ADAR Perfumes"),
 "adar_aeth": ("https://adarperfumes.com/products/aetherialism-storm-breath", "Aetherialism: Storm Breath", "ADAR Perfumes"),
 "adar_amber": ("https://adarperfumes.com/products/amber-zero-essence-of-dephts", "Amber Zero: Essence of Depths", "ADAR Perfumes"),
 "adar_incantu": ("https://adarperfumes.com/products/incantu-drops-of-styx", "Incantu: Drops of Styx", "ADAR Perfumes"),
 "fr_winter": ("https://www.fragrantica.com/news/Winter-Wonders-10-Fragrances-for-the-Cold-Season-21700.html", "Winter Wonders: 10 Fragrances for the Cold Season ~ Fragrance Reviews ~ Fragrantica"),
 "tb_coffin": ("https://tombstonefragrances.shop/products/product_96dfccf6-9558-1964-5d89-1505be7abf53", "Sweet Coffin", "TOMBSTONE"),
 "fr_swamp": ("https://www.fragrantica.com/news/Scary-Tales-Swamp-Scents-and-Spirits-18309.html", "Scary Tales: Swamp Scents and Spirits ~ Columns ~ Fragrantica"),
 "fr_moors": ("https://www.fragrantica.com/news/Scary-Tales-and-Wonderful-Fragrances-Moors-and-Mires-12912.html", "Scary Tales and Wonderful Fragrances: Moors and Mires ~ Columns ~ Fragrantica"),
 "ps_marine": ("https://perfumesociety.org/marine-dreams-the-blue-mind-why-theres-a-new-wave-of-aquatic-scents/", "Marine dreams & 'the blue mind' – why there's a new wave of aquatic scents - The Perfume Society"),
 "fr_rain": ("https://www.fragrantica.com/notes/Rain-Notes-800.html", "Rain Notes perfume ingredient, Rain Notes fragrance and essential oils Rain Notes"),
 "fr_rainscent": ("https://www.fragrantica.com/news/Scent-of-Rain-10211.html", "Scent of Rain ~ Columns ~ Fragrantica"),
 "fr_rainydays": ("https://www.fragrantica.com/news/Perfumes-for-Rainy-Days-24603.html", "Perfumes for Rainy Days ~ Columns ~ Fragrantica"),
 "fr_salt": ("https://www.fragrantica.com/notes/Salt-231.html", "Salt perfume ingredient, Salt fragrance and essential oils Sodium Chloride (NaCl)"),
 "fr_salthist": ("https://www.fragrantica.com/news/The-History-of-Salty-Scents-Plus-5-Quirky-Salty-Fragrances-23178.html", "The History of Salty Scents, Plus 5 Quirky Salty Fragrances ~ 1001 Past Tales ~ Fragrantica"),
 "ps_salt": ("https://perfumesociety.org/salt-is-in-the-air-a-latest-trend-perhaps/", "Salt is in the air: a latest trend...? - The Perfume Society"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "fw_fucus": ("https://fraterworks.com/products/seaweed-fucus-absolute", "Seaweed Fucus Absolute – Fraterworks"),
 "fw_laminaria": ("https://fraterworks.com/products/seaweed-laminaria-absolute", "Seaweed Laminaria Absolute – Fraterworks"),
 "tg_seaweed": ("https://www.thegoodscentscompany.com/data/ab1050301.html", "seaweed absolute (fucus vesiculosus et serratus)", "The Good Scents Company"),
 "wp_fucus": ("https://en.wikipedia.org/wiki/Fucus_vesiculosus", "Fucus vesiculosus - Wikipedia"),
 "wp_chondrus": ("https://en.wikipedia.org/wiki/Chondrus_crispus", "Chondrus crispus - Wikipedia"),
 "br_irishmoss": ("https://www.britannica.com/science/Irish-moss", "Irish moss", "Encyclopedia Britannica"),
 "fr_solar": ("https://www.fragrantica.com/notes/Solar-Notes-672.html", "Solar Notes perfume ingredient, Solar Notes fragrance and essential oils"),
 "fr_solarnews": ("https://www.fragrantica.com/news/Solar-Notes-Warmth-and-Luminosity-5317.html", "Solar Notes: Warmth and Luminosity ~ Columns ~ Fragrantica"),
 "ps_solar": ("https://perfumesociety.org/solar-scents-how-perfumers-capture-sunlight/", "Solar Scents: How Perfumers Capture Sunlight - The Perfume Society"),
 "fr_steam": ("https://www.fragrantica.com/notes/Steam-accord-1356.html", "Steam accord perfume ingredient, Steam accord fragrance and essential oils"),
 "fr_onsen": ("https://www.fragrantica.com/perfume/Cult-of-Kaori/Onsen-Minerale-122073.html", "Onsen Minerale Cult of Kaori perfume - a fragrance for women and men"),
}
N = {
 "note-airy-note": dict(
  say="Not a material but a quality: something in a perfume that makes it feel light, open and full of air, as if you could breathe it in deeply. It is usually built from transparent, fresh materials, ozonic and aldehydic ones, soft musks, a touch of mint or green, and it is felt more as space than as a smell of its own.",
  src=["fr_airy", "fr_ozonic", "fr_silentrain"]),
 "note-aquatic-notes": dict(
  say="The smell of water, built in the laboratory: fresh, cool, a little salty and green, like sea spray or wet air. It mostly goes back to one molecule, Calone, found by chance by Pfizer chemists in 1966, which smells of the seashore, oysters and watermelon rind; from the early 1990s it made a whole family of perfumes. Newer molecules make it softer and less metallic.",
  src=["ps_aquatic", "wp_calone", "fr_calone", "sc_calone"]),
 "note-clear-skies": dict(
  say="An impression rather than a material: the open, bright, empty feeling of a cloudless blue sky. Ataraxia's list for Spinal Fluid calls it a blue sky accord; it is built, like other airy notes, from transparent, ozonic and clean musky materials, and it gives the perfume a cold, clean lightness above its darker notes.",
  src=["pa_spinal", "fr_spinal", "fr_airy", "fr_ozonic"]),
 "note-cold-night-air": dict(
  say="ADAR's picture of stepping outside on a cold night: the air sharp, clean and almost without smell. There is no one material for it; cold is built from mentholated and aromatic notes, peppermint, eucalyptus, juniper, with ozonic and mineral touches that make a perfume smell like a deep breath of winter air.",
  src=["adar_lignum", "fr_winter", "fr_ozonic"]),
 "note-dead-water": dict(
  say="Tombstone's name for still, stagnant water, the water of a grave or a mire that nothing moves through: murky, green, a little rotten and cold. Perfumers make it from soil and water notes, dark vetiver, moss and decaying greenery; it is the opposite of a fresh aquatic.",
  src=["tb_coffin", "fr_swamp", "fr_moors"]),
 "note-marine-accord": dict(
  say="The sea as a perfume: salt spray, wind, seaweed, wet rocks and driftwood, built from marine molecules like Calone with salt, mineral and algae notes. It can be bright and blue or salty and grey; either way it feels cool and wide open.",
  src=["ps_marine", "ps_aquatic", "wp_calone", "adar_aeth"],
  vars={
   "Sea Notes": dict(same="No change: the sea, named as a kind of note."),
  }),
 "note-ozone": dict(
  say="The smell of the air after a storm, or of washing dried in the wind: fresh, sharp, clean and a little metallic. Ozonic notes are built from synthetic molecules such as Calone, with its hint of oysters and watermelon, and Helional, watery and green like cut grass and melon. They make a perfume feel cold and airy.",
  src=["fr_ozonic", "fr_rainscent", "wp_calone", "adar_amber"],
  vars={
   "Ozonic Notes": dict(same="No change: ozone, named as a kind of note."),
  }),
 "note-rain-notes": dict(
  say="The smell of rain, built rather than bottled: the fresh, watery lift of ozonic and aquatic molecules like Calone and Helional, and the earthy side of petrichor, vetiver, mosses, mineral notes and damp wood. Depending on which side leads, it smells like rain on hot concrete, or like a wet forest.",
  src=["fr_rain", "fr_rainscent", "fr_rainydays"]),
 "note-sea-salt": dict(
  say="Salt itself has no smell; in perfume it is an effect, built to give the feel of salt on warm skin or in the sea air. It makes the notes near it brighter, as salt does sweetness, and often sits with ambrette and seaweed. It first appeared in a perfume in 1989 and is a whole trend now.",
  src=["fr_salt", "fr_salthist", "ps_salt", "adar_incantu"]),
 "note-sea-water": dict(
  say="Pineward's picture of the water itself, at the shore: salty, cool and a little green with algae, rather than the bright blue of a sport perfume. It is built from marine molecules with salt and seaweed notes.",
  src=["pw_list", "ps_aquatic", "wp_calone"]),
 "note-seaweed": dict(
  say="The weeds of the shore and the sea, taken as absolutes from brown algae like kelp and wrack. They smell raw and salty, of iodine, dark and phenolic, like seaweed drying on rocks after a storm, with a smoky, leathery depth; some are greener and softer. They give a marine perfume a real bite, and suit dark chypres and leathers.",
  src=["fw_fucus", "fw_laminaria", "tg_seaweed", "pw_list"],
  vars={
   "Bladderwrack": dict(say="One seaweed in particular, Fucus vesiculosus, the brown wrack with air bladders along it, the first source of iodine. As an absolute it is the roughest and most animal of the seaweeds: salty, phenolic, like leather on a harbour wall.", src=["wp_fucus", "fw_fucus", "pw_list"]),
   "Irish Sea Moss": dict(say="Not a moss but a red seaweed, Chondrus crispus, from the rocky Atlantic coasts, better known for thickening food. Soaked, it has a plain sea-like smell, softer than the brown wracks.", src=["wp_chondrus", "br_irishmoss", "pw_list"]),
  }),
 "note-solar-notes": dict(
  say="The feeling of sunshine on skin: warm, radiant, a little creamy, like sun cream on a beach. Much of it comes from salicylates, molecules used first in sunscreens and found naturally in tiare, frangipani and ylang-ylang, with coconut, vanilla, white flowers and citrus around them.",
  src=["fr_solar", "fr_solarnews", "ps_solar"]),
 "note-steam": dict(
  say="The smell of hot water turning to vapour, as in a bathhouse or over a hot spring: humid, clean, faintly mineral, and warm against the cold. It is built from mineral, watery and airy notes; one wearer of Ataraxia's Spinal Fluid pictured it as steam pushed from vents into a dark alley.",
  src=["fr_steam", "fr_onsen", "pa_spinal"]),
}
out("AIR", S, N)

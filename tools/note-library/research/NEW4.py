from acc import out, SAME
# THE NOTES OF FORBIDDEN FLOWER (Areej Le Doré) AND ORE (Slumberhouse),
# 2026-10-13, filed by the rulebook (tools/note-library/RULEBOOK.md) with
# the owner's word on each: Skunk Oil, Night Blooming Jasmine (Raani Flower
# its variation), Dittany of Crete, Muhuhu and Bushman Candle Resin new;
# Hemp Flower Oil, Indonesian Lime, Fossil Amber, Whiskey Lactone and Peru
# Resin variations of notes already here. Read through search summaries:
# the pages themselves would not open from here.
A = "13 Oct. 2026"
S = {
 # skunk
 "bri_skunk": ("https://www.britannica.com/animal/skunk", "Skunk", "Britannica", None, A),
 "wp_skunk": ("https://en.wikipedia.org/wiki/Skunk", "Skunk - Wikipedia", None, None, A),
 "wp_hoodedskunk": ("https://en.wikipedia.org/wiki/Hooded_skunk", "Hooded skunk - Wikipedia", None, None, A),
 "bn_areej": ("https://basenotes.com/threads/areej-le-dore-the-official-discussion-thread.439956/page-1031", "Areej Le Doré: The Official Discussion Thread", "Basenotes", None, A),
 # night blooming jasmine, raat ki rani
 "powo_cestrum": ("https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:316386-2", "Cestrum nocturnum L.", "Plants of the World Online", "Royal Botanic Gardens, Kew", A),
 "rhs_cestrum": ("https://www.rhs.org.uk/plants/3457/wd/details", "Cestrum nocturnum", "Royal Horticultural Society", None, A),
 "pp_nbj": ("https://premierepeau.com/pages/glossary-terms/night-blooming-jasmine", "Night Blooming Jasmine", "Premiere Peau", None, A),
 "efi_cestrum": ("https://efloraofindia.com/efi/cestrum-nocturnum/", "Cestrum nocturnum", "eFlora of India", None, A),
 "fi_nbj": ("https://flowersofindia.net/catalog/slides/Night%20Blooming%20Jasmine.html", "Night Blooming Jasmine", "Flowers of India", None, A),
 # dittany of crete
 "bri_dittany": ("https://www.britannica.com/plant/Crete-dittany", "Crete dittany", "Britannica", None, A),
 "powo_dittany": ("https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:453239-1", "Origanum dictamnus L.", "Plants of the World Online", "Royal Botanic Gardens, Kew", A),
 "sp_dittany": ("https://specialtyproduce.com/produce/Cretan_Dittany_25358.php", "Cretan Dittany", "Specialty Produce", None, A),
 # muhuhu
 "aw_muhuhu": ("https://www.aromaweb.com/essential-oils/muhuhu-essential-oil.php", "Muhuhu Essential Oil", "AromaWeb", None, A),
 "pp_muhuhu": ("https://premierepeau.com/pages/glossary-terms/muhuhu", "Muhuhu", "Premiere Peau", None, A),
 "sv_muhuhu": ("https://scentverdict.com/note/muhuhu", "Muhuhu", "Scent Verdict", None, A),
 # bushman candle
 "af_bushman": ("https://aftelier.com/Bushman-s-Candle-p/bot-eo-bushmanscandle.htm", "Bushman's Candle", "Aftelier Perfumes", None, A),
 "pp_bushman": ("https://premierepeau.com/pages/glossary-terms/bushman-candle", "Bushman Candle", "Premiere Peau", None, A),
 "dsae_bushman": ("https://dsae.co.za/entry/bushmans-candle/e01394", "Bushman's candle", "A Dictionary of South African English", None, A),
 # hemp flower oil (two of them already cited for cannabis, NEW2.py)
 "wp_cannabisoil": ("https://en.wikipedia.org/wiki/Cannabis_flower_essential_oil", "Cannabis flower essential oil"),
 "pmc_hemp": ("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7466297/", "Volatile Composition and Sensory Properties as Quality Attributes of Fresh and Dried Hemp Flowers (Cannabis sativa L.)", "PubMed Central"),
 "fao_hemp": ("https://agris.fao.org/search/en/records/64746b6879cbb2c2c1afb0af", "Possibility of Fiber Hemp Essential Oil Utilization as an Aroma and Fragrance Additive", "AGRIS, FAO", None, A),
 # indonesian lime
 "bri_lime": ("https://www.britannica.com/plant/lime", "Lime", "Britannica", None, A),
 "bri_kaffir": ("https://www.britannica.com/plant/Kaffir-lime", "Kaffir lime", "Britannica", None, A),
 "pp_kaffir": ("https://premierepeau.com/pages/glossary-terms/kaffir-lime", "Kaffir Lime", "Premiere Peau", None, A),
 # fossil amber (the three already cited for Amber Fossil, NEW3.py)
 "eb_amberfossil": ("https://www.edenbotanicals.com/amber-oil-fossilized.html", "Amber Oil, Fossilized EO", "Eden Botanicals"),
 "om_burnana": ("https://omparfumfragrances.com/products/burnana", "Burnana", "OM Parfum"),
 "hh_amberoil": ("https://henriettes-herb.com/eclectic/kings/ambra-flav.html", "Oleum Succini (Oil of Amber)", "Henriette's Herbal Homepage"),
 # whiskey lactone
 "wp_glactone": ("https://en.wikipedia.org/wiki/%CE%93-Lactone", "γ-Lactone - Wikipedia", None, None, A),
 "ch_coconut": ("https://charlois.com/en/coconut", "Coconut", "Charlois", None, A),
 "wws_oaklactone": ("https://www.winewithseth.com/winewiki/oak-lactones-whisky-lactones/", "Oak Lactones (Whisky Lactones)", "Wine With Seth", None, A),
}
N = {
 "note-skunk-oil": dict(
  say="The skunk's own defence: the oily spray it shoots from two glands under its tail when it is threatened, which can be smelled from far off and lingers for days. Nearly all of it is a handful of sulphur molecules, thiols and their thioacetates, the same family as the smell of rotten eggs and burnt rubber, and the thioacetates break down slowly on damp skin and cloth into more thiols, which is why the smell comes back when it is wet. In perfumery it is very rare: in a trace, under flowers and resins, it reads as a dark, rank, musky warmth, the skunky funk that cannabis and some animalics are named after. Areej Le Doré's Russian Adam named skunk among the main players of Forbidden Flower.",
  src=["bri_skunk", "wp_skunk", "wp_hoodedskunk", "bn_areej"]),
 "note-night-blooming-jasmine": dict(
  say="Not a jasmine at all but Cestrum nocturnum, a shrub of the nightshade family, kin to tomatoes and potatoes, from the tropical Americas and grown all over the warm world. Its small, greenish-white tubes of flowers stay shut by day and open after dark, and then the scent carries far: heavy, sweet and narcotic, a lush white floral with a green, indolic edge, sweeter and denser than true jasmine. It is seldom extracted, the flowers being too delicate, so in perfume it is mostly a reconstruction from jasmine absolutes and synthetics, set in the heart.",
  src=["powo_cestrum", "rhs_cestrum", "pp_nbj"],
  vars={"Raani Flower": dict(say="The same shrub under its name in India: raat ki rani, \"queen of the night\", planted by windows and terraces for its evening scent and made, rarely, into an attar. Nothing in the flower changes; only the name is the one it goes by there.", src=["efi_cestrum", "fi_nbj", "pp_nbj"])}),
 "note-dittany-of-crete": dict(
  say="Origanum dictamnus, a small oregano that grows wild only in the mountains and gorges of Crete, its round leaves felted in soft white wool. It has been prized since antiquity, gathered in flower in summer for medicine, perfumery and the flavour of vermouth and absinthe, and the wild plant is rare enough now to be protected. It smells of Mediterranean oregano, warm, spicy and pungent, a little bitter and sweeter than the kitchen herb, from carvacrol, the molecule of oregano and thyme.",
  src=["bri_dittany", "powo_dittany", "sp_dittany"]),
 "note-muhuhu": dict(
  say="The wood of Brachylaena huillensis, an East African tree of the daisy family, distilled into an oil and often sold as African sandalwood, though it smells little like real sandalwood. It is dry, smoky and woody, with a cedar-like frame, a faintly camphorous edge and a soft balsamic sweetness as it dries, without sandalwood's creaminess. Perfumers use it in the base for depth and length, with vetiver, frankincense and dry spice; the trees have been heavily cut, and Kenya now controls their export.",
  src=["aw_muhuhu", "pp_muhuhu", "sv_muhuhu"]),
 "note-bushman-candle-resin": dict(
  say="The resin of Sarcocaulon, a small succulent shrub of the dry Namaqualand, Karoo and Namibian desert, whose waxy bark is so full of resin that its stems burn like candles, which is where its name comes from. Gathered by hand, sometimes from the wax a dead plant leaves on the ground, it is a rare, small-batch natural: a warm, balsamic, sweet resin, drier and more camphorous than frankincense, with amber, honey and incense in it and a faint smoke and leather, used in the base.",
  src=["af_bushman", "pp_bushman", "dsae_bushman"]),
 "note-cannabis": dict(vars={
  "Hemp Flower Oil": dict(say="Not an accord but the real oil: steam-distilled from the flowering tops of hemp, Cannabis sativa, with only traces of the plant's cannabinoids in it. It is mostly terpenes, myrcene above all, herbal and green, with caryophyllene's peppery spice and a little limonene, so it smells earthier, greener and more peppery-woody than the sweeter, smokier cannabis accords, the living plant rather than its smoke.", src=["wp_cannabisoil", "pmc_hemp", "fao_hemp"]),
 }),
 "note-lime": dict(vars={
  "Indonesian Lime": dict(say="Lime from Indonesia, where the house does not say which: the island's own is the makrut, Citrus hystrix (jeruk purut in Javanese), whose leaves and knobbled rind are sharp, green and almost aldehydic, lemony and floral like lemongrass rather than juicy like the Persian lime — but a key lime grown there would be the ordinary bright, sour lime.", src=["bri_lime", "bri_kaffir", "pp_kaffir"]),
 }),
 "note-amber": dict(vars={
  "Fossil Amber": dict(say="Amber Fossil the other way round, and the same thing: not the warm amber accord but the real fossil, oil of amber, made by heating fossilised tree resin until an oil runs from it — dark, smoky, leathery and tar-like, dry and woody, and not sweet.", src=["eb_amberfossil", "om_burnana", "hh_amberoil"]),
 }),
 "note-whiskey": dict(vars={
  "Whiskey Lactone": dict(say="Not the drink but one molecule of it: β-methyl-γ-octalactone, which comes out of the oak of the barrel into the spirit as it ages. It smells of coconut and fresh wood, creamy and a little nutty and toasted, the barrel's own part of a whisky's smell without the alcohol, the malt or the fruit.", src=["wp_glactone", "ch_coconut", "wws_oaklactone"]),
 }),
 "note-peru-balsam": dict(vars={
  "Peru Resin": dict(same="No change: Peru balsam by another name, the balsam being the resin the tree gives."),
 }),
}
out("NEW4", S, N)

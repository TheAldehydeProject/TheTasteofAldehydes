from acc import out, SAME
S = {
 "fr_co2": ("https://www.fragrantica.com/notes/CO2-Extracts-783.html", "CO2 Extracts perfume ingredient, CO2 Extracts fragrance and essential oils CO2"),
 "fw_sfe": ("https://fraterworks.com/collections/sfe-co2-extracts", "SFE & CO2 Extracts – Fraterworks"),
 "fr_whitelabel": ("https://www.fragrantica.com/perfume/Grande/White-Label-117529.html", "White Label Grande perfume - a fragrance for women and men"),
 "fr_extract": ("https://www.fragrantica.com/news/From-Tincture-To-Supercritical-Extraction-Methods-Of-Natural-Aroma-Extraction-8724.html", "From Tincture To Supercritical Extraction — Methods Of Natural Aroma Extraction ~ Raw Materials ~ Fragrantica"),
}
N = {
 "note-co2-extracts": dict(
  say="Not a smell but a way of taking one: carbon dioxide, pressed until it behaves like a liquid, washes the smell out of a plant at low temperature and then simply evaporates, leaving no solvent behind. Nothing is cooked, so a CO2 extract smells very close to the raw material: a vanilla pod, a ginger root, roasted coffee as they really are. Named as a note, it says the perfume uses them.",
  src=["fr_extract", "fr_co2", "fw_sfe"],
  vars={
   "African CO2": dict(say="A CO2 extract of something grown in Africa. The list for Grande's White Label names only the place, not the plant, so what it smells of cannot be said; it tells you the material was taken the same clean way, close to the raw plant.", src=["fr_whitelabel", "fr_extract", "fr_co2"]),
  }),
}
out("IMP1", S, N)

from acc import out, SAME
S = {
 "fr_ash": ("https://www.fragrantica.com/notes/Ash-627.html", "Ash perfume ingredient, Ash fragrance and essential oils"),
 "fr_ashes": ("https://www.fragrantica.com/perfume/Clandestine-Laboratories/Ashes-75519.html", "Ashes Clandestine Laboratories perfume - a fragrance for women and men"),
 "fr_smoke": ("https://www.fragrantica.com/notes/Smoke-735.html", "Smoke perfume ingredient, Smoke fragrance and essential oils"),
 "fr_smokebottle": ("https://www.fragrantica.com/news/Smoke-In-Your-Bottle-Ancient-and-Not-What-You-Think-14108.html", "Smoke In Your Bottle: Ancient, and Not What You Think ~ Columns ~ Fragrantica"),
 "sc_cade": ("https://www.scentspiracy.com/fragrance-ingredients/p/cade-rectified-eo", "Cade Oil Rectified (8013-10-3) – Smoky-Leathery Natural Ingredient for Perfumery — Scentspiracy"),
 "sc_syringol": ("https://www.scentspiracy.com/fragrance-ingredients/p/syringol", "Syringol (91-10-1): Smoky Phenolic Profile – Fragrance Ingredient — Scentspiracy"),
 "fr_birchtar": ("https://www.fragrantica.com/notes/Birch-Tar-862.html", "Birch Tar perfume ingredient, Birch Tar fragrance and essential oils"),
 "wp_birchtar": ("https://en.wikipedia.org/wiki/Birch-tar", "Birch bark tar - Wikipedia"),
 "fw_birchtar": ("https://fraterworks.com/products/birch-tar-oil-purified", "Birch Tar Oil, Purified – Fraterworks"),
 "tg_birchtar": ("https://www.thegoodscentscompany.com/data/es1001911.html", "birch tar oil, 8001-88-5", "The Good Scents Company"),
 "at_spinal": ("https://ataraxiaperfumery.com/products/spinal-fluid", "Spinal Fluid", "Ataraxia Perfumery"),
 "fr_spinal": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Spinal-Fluid-115343.html", "Spinal Fluid Ataraxia Perfumery perfume - a fragrance for women and men"),
 "pa_spinal": ("https://www.parfumo.com/Perfumes/ataraxia/spinal-fluid", "Spinal Fluid by Ataraxia", "Parfumo"),
 "lt_spinal": ("https://lucaturin.substack.com/p/spinal-fluid", "Spinal Fluid", "Substack", "Turin, Luca"),
 "fr_fire": ("https://www.fragrantica.com/notes/Fire-960.html", "Fire perfume ingredient, Fire fragrance and essential oils"),
 "fr_fireplace": ("https://www.fragrantica.com/perfume/Maison-Martin-Margiela/By-the-Fireplace-31623.html", "By the Fireplace Maison Martin Margiela perfume - a fragrance for women and men 2015"),
 "fr_gasoline": ("https://www.fragrantica.com/notes/Gasoline-845.html", "Gasoline perfume ingredient, Gasoline fragrance and essential oils"),
 "fr_ageinnocence": ("https://www.fragrantica.com/perfume/Toskovat/Age-of-Innocence-75417.html", "Age of Innocence Toskovat' perfume - a fragrance for women and men 2022"),
 "fr_palosanto": ("https://www.fragrantica.com/notes/Palo-Santo-597.html", "Palo Santo perfume ingredient, Palo Santo fragrance and essential oils Bursera graveolens"),
 "fr_palonews": ("https://www.fragrantica.com/news/Palo-Santo-The-Fragrant-Wood-of-America-That-Purifies-Soothes-and-Relaxes-15568.html", "Palo Santo: The Fragrant Wood of America That Purifies, Soothes, and Relaxes ~ Raw Materials ~ Fragrantica"),
 "wp_bursera": ("https://en.wikipedia.org/wiki/Bursera_graveolens", "Bursera graveolens - Wikipedia"),
 "adar_root": ("https://adarperfumes.com/products/root-code", "Root Code", "ADAR Perfumes"),
 "fr_pinetar": ("https://www.fragrantica.com/notes/Pine-Tar-1111.html", "Pine Tar perfume ingredient, Pine Tar fragrance and essential oils"),
 "tg_pinetar": ("https://www.thegoodscentscompany.com/data/rs1033761.html", "pinus palustris tar, 8011-48-1", "The Good Scents Company"),
 "fr_storapine": ("https://www.fragrantica.com/perfume/Stora-Skuggan/Pine-99383.html", "Pine Stora Skuggan perfume - a new fragrance for women and men 2024"),
 "la_cendres": ("https://lesabstraits.com/products/des-cendres", "Des Cendres", "Les Abstraits"),
 "pw_gristmill": ("https://pinewardperfume.com/products/gristmill", "Gristmill", "Pineward"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
}
N = {
 "note-ash": dict(
  say="What is left when the fire is out: the dry, grey, mineral smell of wood ash, or at its darker end a cold ashtray. It is built from smoky and powdery materials rather than real ash, and it can be clean and earthy, or dusty and sad; perfumers often use it for loss and renewal.",
  src=["fr_ash", "fr_ashes", "fr_smoke"]),
 "note-birch-tar": dict(
  say="A thick, black tar made by heating birch bark without air, used for thousands of years as a glue and to cure leather. It smells intensely smoky, tarry and leathery, like a campfire and a tannery at once, and it is the heart of the old Russian leather perfumes, usually with castoreum and isobutyl quinoline. In perfume it is purified first, to take out what is harmful.",
  src=["fr_birchtar", "wp_birchtar", "fw_birchtar", "tg_birchtar"],
  vars={
   "Natural Birch Tar": dict(say="Ataraxia stresses that its tar is the real one, from birch bark, rather than a smoky leather built from molecules; purified, it keeps the full, raw smoke and bitterness of the material.", src=["at_spinal", "fw_birchtar", "wp_birchtar"]),
  }),
 "note-fire": dict(
  say="The smell of something burning right now, rather than the smoke or the ash after it: hot, dry, crackling wood and char, sometimes a flash of fuel. It is built from smoky phenols, birch tar, cade and guaiac wood, sometimes with something sweet, like chestnuts by a fireplace, to make it warm rather than harsh.",
  src=["fr_fire", "fr_fireplace", "sc_cade"]),
 "note-gasoline": dict(
  say="The sharp, volatile, oily smell of fuel, built by perfumers and much argued over: some wearers love it, as some people love a petrol station. It turns up with rubber and metallic notes, and dries down into leather or smoke. In Spinal Fluid it is the loud, heating-oil opening.",
  src=["fr_gasoline", "fr_ageinnocence", "lt_spinal", "pa_spinal"]),
 "note-palo-santo": dict(
  say="The wood of Bursera graveolens, a tree of South America's dry coasts, whose name means holy wood, burned to clear a room. It smells woody and aromatic, with a fresh, citrusy, almost minty lift, something oily like olive oil, and a smoke that seems built into the wood itself. In perfume it gives a soft, sweet woody trail.",
  src=["fr_palosanto", "fr_palonews", "wp_bursera"],
  vars={
   "Smoked Palo Santo": dict(say="Palo santo as it smells when it is lit, as it is in a ritual: its smoky side put first, over its fresh and minty one.", src=["adar_root", "fr_palonews", "fr_palosanto"]),
  }),
 "note-pine-tar": dict(
  say="Tar made from pine wood, dark and sticky, once painted on boats and ropes to keep the water out. It smells resinous, smoky and balsamic, like hot pine resin and burnt wood, sweeter and more piney than birch tar's leather.",
  src=["fr_pinetar", "tg_pinetar", "fr_storapine", "la_cendres"]),
 "note-smoke": dict(
  say="Smoke is not one thing: wood smoke, incense, tobacco and tar all smell different, and perfumers build each from smoky materials, birch and cade tars made by heating wood, guaiacol, syringol and other phenols, vetiver and guaiac wood. They smell charred, dry and sometimes medicinal, and make a perfume dark, warm and deep.",
  src=["fr_smoke", "fr_smokebottle", "sc_cade", "sc_syringol"]),
 "note-smouldering-logs": dict(
  say="Pineward's picture of logs burned down and still glowing, after the flames: warm, charred and smoky, softer than a blaze, with a little ash. It is built from smoky wood materials, tars and phenols.",
  src=["pw_gristmill", "fr_fire", "sc_cade"]),
}
out("SMK", S, N)

from acc import out, SAME
S = {
 "adar_lignum": ("https://adarperfumes.com/products/lignum-dei-the-wood-of-god-essence-of-hope-micro-batch-77-pieces", "Lignum Dei: The Wood of God", "ADAR Perfumes"),
 "adar_incantu": ("https://adarperfumes.com/products/incantu-drops-of-styx", "Incantu: Drops of Styx", "ADAR Perfumes"),
 "at_amaretto": ("https://ataraxiaperfumery.com/products/amaretto-jazz-in-the-melting-room", "Amaretto Jazz in the Melting Room", "Ataraxia Perfumery"),
 "at_deity": ("https://ataraxiaperfumery.com/products/deity", "Deity", "Ataraxia Perfumery"),
 "at_spinal": ("https://ataraxiaperfumery.com/products/spinal-fluid", "Spinal Fluid", "Ataraxia Perfumery"),
 "at_vestibule": ("https://ataraxiaperfumery.com/products/vestibule", "Vestibule", "Ataraxia Perfumery"),
 "fr_amaretto": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Amaretto-Jazz-in-the-Melting-Room-100361.html", "Amaretto Jazz in the Melting Room Ataraxia Perfumery perfume - a fragrance for women and men"),
 "fr_vestibule": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Vestibule-100362.html", "Vestibule Ataraxia Perfumery perfume - a fragrance for women and men"),
 "fr_mdm": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/My-Doll-s-Makeup-142160.html", "My Doll's Makeup Ataraxia Perfumery perfume - a fragrance for women and men"),
 "fr_spinal": ("https://www.fragrantica.com/perfume/Ataraxia-Perfumery/Spinal-Fluid-115343.html", "Spinal Fluid Ataraxia Perfumery perfume - a fragrance for women and men"),
 "pa_spinal": ("https://www.parfumo.com/Perfumes/ataraxia/spinal-fluid", "Spinal Fluid by Ataraxia", "Parfumo"),
 "lt_spinal": ("https://lucaturin.substack.com/p/spinal-fluid", "Spinal Fluid", "Substack", "Turin, Luca"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "pw_velvetine": ("https://pinewardperfume.com/products/velvetine", "Velvetine", "Pineward"),
 "ps_paper": ("https://perfumesociety.org/paper-trail/", "Paper Trail: why we love paper's smell (& perfumes evoking it) - The Perfume Society"),
 "ps_vellichor": ("https://perfumesociety.org/vellichor-capturing-the-scent-memories-of-old-books/", "Vellichor: capturing the scent memories of old books - The Perfume Society"),
 "fr_tome": ("https://www.fragrantica.com/perfume/Pineward-Perfumes/Tome-115784.html", "Tome Pineward Perfumes perfume - a new fragrance for women and men 2025"),
 "fr_paperback": ("https://www.fragrantica.com/perfume/Demeter-Fragrance/Paperback-19913.html", "Paperback Demeter Fragrance perfume - a fragrance for women and men"),
 "fr_cosmhist": ("https://www.fragrantica.com/news/The-History-of-Cosmetics-Smelling-Fragrances-24962.html", "The History of Cosmetics-Smelling Fragrances ~ 1001 Past Tales ~ Fragrantica"),
 "fr_powder": ("https://www.fragrantica.com/news/How-to-Choose-the-Right-Powder-Powdery-Notes-in-Perfumery-17630.html", "How to Choose the Right Powder: Powdery Notes in Perfumery ~ Raw Materials ~ Fragrantica"),
 "fr_lipsticky": ("https://www.fragrantica.com/news/Who-Is-the-Creamiest-the-Waxiest-the-Most-Lipsticky-of-Them-All-12550.html", "Who Is the Creamiest, the Waxiest, the Most Lipsticky of Them All? ~ Columns ~ Fragrantica"),
 "fr_lipstick": ("https://www.fragrantica.com/notes/Lipstick-883.html", "Lipstick perfume ingredient, Lipstick fragrance and essential oils"),
 "fr_lipgloss": ("https://www.fragrantica.com/notes/Lip-Gloss-999.html", "Lip Gloss perfume ingredient, Lip Gloss fragrance and essential oils"),
 "fr_pencil": ("https://www.fragrantica.com/notes/Pencil-1228.html", "Pencil perfume ingredient, Pencil fragrance and essential oils"),
 "fr_candlewax": ("https://www.fragrantica.com/notes/Candle-Wax-1397.html", "Candle Wax perfume ingredient, Candle Wax fragrance and essential oils"),
 "fr_beeswax": ("https://www.fragrantica.com/notes/Beeswax-53.html", "Beeswax perfume ingredient, Beeswax fragrance and essential oils"),
 "fr_orthodox": ("https://www.fragrantica.com/news/Eastern-Orthodox-Incense-Reminiscent-Fragrances-21446.html", "Eastern Orthodox Incense Reminiscent Fragrances ~ 1001 Past Tales ~ Fragrantica"),
 "fr_driedrose": ("https://www.fragrantica.com/notes/Dried-Rose-971.html", "Dried Rose perfume ingredient, Dried Rose fragrance and essential oils"),
 "fr_funerie": ("https://www.fragrantica.com/perfume/Pineward-Perfumes/Funerie-83384.html", "Funerie Pineward Perfumes perfume - a fragrance for women and men"),
 "fr_blood": ("https://www.fragrantica.com/notes/Blood-1038.html", "Blood perfume ingredient, Blood fragrance and essential oils"),
 "fr_metallic": ("https://www.fragrantica.com/news/Metallic-Scent-In-Perfumery-8361.html", "Metallic Scent In Perfumery ~ Raw Materials ~ Fragrantica"),
 "fr_dust": ("https://www.fragrantica.com/notes/Dust-1519.html", "Dust perfume ingredient, Dust fragrance and essential oils"),
 "fr_gold": ("https://www.fragrantica.com/news/Gold-as-a-Parfumistic-Concept-9887.html", "Gold as a Parfumistic Concept ~ Columns ~ Fragrantica"),
 "fr_metallicnotes": ("https://www.fragrantica.com/notes/Metallic-Notes-458.html", "Metallic Notes perfume ingredient, Metallic Notes fragrance and essential oils"),
 "fr_instantfilm": ("https://www.fragrantica.com/notes/Instant-film-accord-828.html", "Instant Film Accord perfume ingredient, Instant Film Accord fragrance and essential oils"),
 "pp_instantfilm": ("https://premierepeau.com/pages/glossary-terms/instant-film-accord", "Instant Film Accord", "Première Peau"),
 "fr_delaire": ("https://www.fragrantica.com/news/The-New-Face-of-the-Legendary-de-Laire-Company-9590.html", "The New Face of the Legendary de Laire Company ~ Interviews ~ Fragrantica"),
 "wp_daltroff": ("https://en.wikipedia.org/wiki/Ernest_Daltroff", "Ernest Daltroff - Wikipedia"),
 "ps_ambree": ("https://perfumesociety.org/fragrance-families/ambree/", "Ambrée - The Perfume Society"),
 "ps_ambreefri": ("https://perfumesociety.org/fragrance-family-friday-oriental/", "Fragrance Family Friday: ambrée - The Perfume Society"),
 "fr_oriental": ("https://www.fragrantica.com/notes/Oriental-Notes-483.html", "Oriental Notes perfume ingredient, Oriental Notes fragrance and essential oils"),
 "fr_porcelain": ("https://www.fragrantica.com/notes/Porcelain-1578.html", "Porcelain perfume ingredient, Porcelain fragrance and essential oils"),
 "fr_tears": ("https://www.fragrantica.com/news/Tears-by-Regime-des-Fleurs-Feelings-Become-Liquid-16709.html", "Tears by Regime des Fleurs: Feelings Become Liquid ~ Fragrance Reviews ~ Fragrantica"),
 "fr_salt": ("https://www.fragrantica.com/notes/Salt-231.html", "Salt perfume ingredient, Salt fragrance and essential oils Sodium Chloride (NaCl)"),
 "fr_velvet": ("https://www.fragrantica.com/notes/Velvet-779.html", "Velvet perfume ingredient, Velvet fragrance and essential oils Velvet"),
 "fr_cashmeran": ("https://www.fragrantica.com/notes/Cashmeran-348.html", "Cashmeran perfume ingredient, Cashmeran fragrance and essential oils"),
 "fr_tobacco": ("https://www.fragrantica.com/notes/Tobacco-96.html", "Tobacco perfume ingredient, Tobacco fragrance and essential oils Nicotiana tabacum (Solanaceae)"),
 "tg_pipeweed": ("https://tolkiengateway.net/wiki/Pipe-weed", "Pipe-weed", "Tolkien Gateway"),
 "wp_shire": ("https://en.wikipedia.org/wiki/Westfarthing", "The Shire - Wikipedia"),
}
MAKEUP = "No house page says what goes into it; it is one of the cosmetic notes Fragrantica lists for Ataraxia's My Doll's Makeup, "
N = {
 "note-aged-parchment": dict(
  say="The smell of old writing skin and old paper, as in an archive: dry, dusty and faintly sweet, with a leathery edge. As paper ages the lignin in it breaks down into something very like vanillin, which is why old pages smell a little of vanilla; perfumers build the rest from dry, dusty and leathery notes, and find it hard, because printed paper smells dry and fatty.",
  src=["adar_lignum", "ps_paper", "ps_vellichor", "fr_tome"],
  vars={
   "Aged Parchment Accord": dict(same="No change: aged parchment, with the word accord saying it is built rather than taken from real parchment."),
   "Parchment": dict(same="No change: parchment, without the word aged; the same dry, old-paper smell."),
  }),
 "note-blush": dict(
  say=MAKEUP + "named for the pressed powder brushed on the cheeks. Cosmetic smells in perfume are powdery above all: iris, violet and their ionones, rose, musks and a soft sweetness, the smell of an old makeup compact.",
  src=["fr_mdm", "fr_cosmhist", "fr_powder"]),
 "note-candle-wax": dict(
  say="The smell of a candle, lit or just blown out: warm, soft and waxy, a little sweet, with a thread of smoke. Beeswax brings honey, hay and a golden amber warmth; paraffin, a plainer, dustier melted wax. With incense it is the smell of a church.",
  src=["fr_candlewax", "fr_beeswax", "fr_orthodox", "at_amaretto", "adar_incantu"]),
 "note-decayed-rose": dict(
  say="Pineward's rose at the end of its life, the petals gone brown and soft: still rosy, but jammy, musty and a little sour, sweetness turning to rot. It belongs with dried-rose notes and the wilted, funerary flowers of dark perfumes.",
  src=["pw_list", "fr_driedrose", "fr_funerie"]),
 "note-dried-blood": dict(
  say="Blood smells of metal, from the iron in it, and the molecules behind a metallic smell are earthy, mushroom-like and a little fishy. Perfumers build a blood accord from salty and metallic notes; dried, it is duller and darker, rust more than red. In Spinal Fluid it sits at the heart, beside meat.",
  src=["fr_blood", "fr_metallic", "pa_spinal", "fr_spinal"]),
 "note-dusty-antiques": dict(
  say="Ataraxia's picture of a room full of old things, in Vestibule, a vampire's lair: old wood and polish, faded fabric and paper, and dust over all of it. It is built from dusty, powdery and woody notes, and it smells close, dry and nostalgic.",
  src=["at_vestibule", "fr_vestibule", "fr_dust"],
  vars={
   "Antique Shop": dict(same="No change: the same picture, named by the place."),
  }),
 "note-dusty-sofa": dict(
  say="Ataraxia's picture, in Amaretto Jazz in the Melting Room, of an old upholstered sofa: worn fabric, dust, and the warmth of the room around it. It is an impression, built from dusty and powdery notes, soft, stale and comfortable.",
  src=["at_amaretto", "fr_amaretto", "fr_dust"]),
 "note-eye-pencil": dict(
  say=MAKEUP + "named for the kohl or eyeliner pencil: the dry, woody smell of a cedar pencil being sharpened, with the waxy, powdery softness of the makeup inside it.",
  src=["fr_mdm", "fr_pencil", "fr_cosmhist"]),
 "note-gold": dict(
  say="Gold has no smell; it is an idea perfumers chase. They give the feeling of it with yellow flowers, benzoin, white or pink pepper, rose and bergamot, and with metallic materials that seem smooth, shiny and cool. Ataraxia names it in Deity.",
  src=["fr_gold", "fr_metallicnotes", "at_deity"]),
 "note-instant-film": dict(
  say="The smell of a Polaroid as it comes out of the camera and the picture appears: a fantasy note, chemical and a little metallic from the developing paste, with a plastic note from the frame and a faint, almost vanilla sweetness. It is neither pleasant nor unpleasant, only very specific, and it brings back the memory of shaking a photograph.",
  src=["fr_instantfilm", "pp_instantfilm", "fr_mdm"],
  vars={
   "Instant Film Accord": dict(same="No change: instant film, with the word accord saying it is built."),
  }),
 "note-lip-gloss": dict(
  say="The smell of lip gloss: sweet and sugary, candyfloss, cherry, peach or vanilla, over something waxy and slick. It is a fantasy note, sweeter and more childish than lipstick, and one of the cosmetic notes of Ataraxia's My Doll's Makeup.",
  src=["fr_lipgloss", "fr_lipsticky", "fr_mdm"]),
 "note-lipstick": dict(
  say="The smell of old-fashioned lipstick, which was scented with rose, violet and iris: in perfume an undefined, powdery, red-purple floral in which you cannot quite pick out the rose or the violet, with something waxy and creamy under it. It is the most recognisable of the cosmetic notes.",
  src=["fr_lipstick", "fr_cosmhist", "fr_lipsticky", "fr_mdm"]),
 "note-makeup-palette": dict(
  say=MAKEUP + "named for an open palette of powders and colours. Makeup smells mostly of powder: iris and violet, their ionones, rose, musk and a soft sweetness, dry rather than creamy.",
  src=["fr_mdm", "fr_cosmhist", "fr_powder"]),
 "note-mousse-de-saxe": dict(
  say="Saxon moss: one of the famous old perfume bases made by the de Laire company, which from the late 1800s mixed the new synthetic molecules with natural oils into ready accords. It combines geranium, anise, isobutyl quinoline for a leathery bite, heliotropin, vetiver and vanillin, and it is mossy, leathery, herbal and sweet at once, almost a perfume on its own. Ernest Daltroff made it a signature of Caron.",
  src=["fr_delaire", "wp_daltroff", "pw_velvetine"],
  vars={
   "Vintage Mousse de Saxe": dict(say="Pineward names the vintage kind, pointing to the base as it was used in the old perfumes, Caron's among them, rather than to a modern reconstruction of it.", src=["pw_velvetine", "fr_delaire", "wp_daltroff"]),
  }),
 "note-old-books": dict(
  say="The smell of a second-hand bookshop: sweet, dusty and a little musty. As old paper breaks down, its lignin turns into something very like vanillin, so old books smell faintly of vanilla; perfumers add dust, must, leather and wood for a library.",
  src=["ps_vellichor", "ps_paper", "fr_vestibule"],
  vars={
   "Old Book": dict(same="No change: old books in the singular."),
  }),
 "note-oriental-notes": dict(
  say="Not one material but an old name for a whole family: the warm, rich, sweet perfumes of amber, vanilla, resins, spices, sandalwood and coumarin. The name is now widely seen as outdated and offensive, and much of the industry calls the family ambrée, or amber, instead.",
  src=["ps_ambree", "ps_ambreefri", "fr_oriental"]),
 "note-paper": dict(
  say="The smell of paper: clean and dry with a faint woody sweetness from the lignin in it, which is close to vanillin. New paper smells dry and fatty, old paper sweeter and dustier; perfumers find it hard to build, because those are not notes they often use.",
  src=["ps_paper", "ps_vellichor", "fr_paperback"]),
 "note-porcelain": dict(
  say="The smell of cold white china, which in perfume is a mineral, clay-like note: cool, clean and faintly like damp plaster, sometimes powdery.",
  src=["fr_porcelain", "fr_mdm"]),
 "note-rotten-flesh": dict(
  say="The smell of meat gone off, as Ataraxia's Spinal Fluid puts it, next to raw meat and blood. It is built with indole, which in a trace makes white flowers bloom and in quantity smells of decay, or, as Luca Turin put it, of rotten teeth. It is there to disturb.",
  src=["lt_spinal", "pa_spinal", "fr_spinal"]),
 "note-salty-tears": dict(
  say="Tears smell of almost nothing but salt and skin; a tear accord gives that faint salinity, watery and close, a little like skin after crying. Salt has no smell of its own, so it is an effect, built to make a perfume feel wet and human.",
  src=["fr_tears", "fr_salt", "pa_spinal"]),
 "note-spinal-fluid": dict(
  say="A note that is the name of the perfume itself: Ataraxia's Spinal Fluid, which Fragrantica lists among its own notes. No one wears the real thing; the house builds the idea from fire, fuel, steam and a tear accord, blood and meat, ash, a blue sky accord and bluebell, and the whole smells clinical, bodily and synthetic, gasoline over indole.",
  src=["at_spinal", "fr_spinal", "pa_spinal", "lt_spinal"]),
 "note-velvet": dict(
  say="A texture rather than a smell: the soft, heavy, plush feel of velvet, given by soft musks, powdery flowers and warm woods, like cashmeran, a molecule said to smell of cashmere wool.",
  src=["fr_velvet", "fr_cashmeran", "fr_mdm"]),
 "note-westfarthing-leaf": dict(
  say="Pineward's tobacco, named for the Westfarthing, the part of Tolkien's Shire where Bag End stands; the Shire's hobbits smoked pipe-weed, their tobacco. Tobacco leaf in perfume smells sweet, dry and herbal, of hay, honey, tea and dried fruit, a little woody and mossy.",
  src=["pw_list", "tg_pipeweed", "wp_shire", "fr_tobacco"],
  vars={
   "Westfarthing Leaf (Tobacco)": dict(same="No change: the same leaf, with what it is written beside it."),
  }),
}
out("IMP2", S, N)

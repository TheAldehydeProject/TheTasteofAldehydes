from acc import out, SAME
S = {
 "fn_sandwort": ("https://www.first-nature.com/flowers/minuartia-obtusiloba.php", "Minuartia obtusiloba - Alpine Sandwort", "First Nature"),
 "cwb_sandwort": ("https://coloradowildbuds.com/minuartia-obtusiloba.html", "Minuartia obtusiloba (Alpine Sandwort)", "Colorado Wildbuds"),
 "pw_list": ("https://pinewardperfume.com/pages/master-scent-list", "Master Scent List", "Pineward"),
 "wp_bluet": ("https://en.wikipedia.org/wiki/Houstonia_caerulea", "Houstonia caerulea - Wikipedia"),
 "fr_bluebell": ("https://www.fragrantica.com/notes/Bluebell-1563.html", "Bluebell perfume ingredient, Bluebell fragrance and essential oils Hyacinthoides Non-Scripta"),
 "ps_bluebell": ("https://perfumesociety.org/ingredients-post/bluebells/", "Bluebell - The Perfume Society"),
 "fr_bluebellnews": ("https://www.fragrantica.com/news/Scents-of-England-Bluebells-20264.html", "Scents of England: Bluebells ~ Columns ~ Fragrantica"),
 "fr_carn": ("https://www.fragrantica.com/notes/Carnation-7.html", "Carnation perfume ingredient, Carnation fragrance and essential oils"),
 "ps_carn": ("https://perfumesociety.org/ingredients-post/carnation/", "Carnation - The Perfume Society"),
 "fr_carnclove": ("https://www.fragrantica.com/news/Carnation-and-Clove-13400.html", "Carnation and Clove ~ Raw Materials ~ Fragrantica"),
 "fr_champ": ("https://www.fragrantica.com/notes/Champaca-243.html", "Champaca perfume ingredient, Champaca fragrance and essential oils Michelia champaca"),
 "tg_champ": ("https://www.thegoodscentscompany.com/data/ab1040551.html", "champaca absolute, 94333-99-0", "The Good Scents Company"),
 "fr_champmol": ("https://www.fragrantica.com/news/Molecule-01-Champaca-by-Escentric-Molecules-Sticky-Animalic-Floral-25107.html", "Molecule 01 + Champaca by Escentric Molecules: Sticky Animalic Floral ~ Fragrance Reviews ~ Fragrantica"),
 "fr_chrys": ("https://www.fragrantica.com/notes/Chrysanthemum-211.html", "Chrysanthemum perfume ingredient, Chrysanthemum fragrance and essential oils Genus: Chrysanthemum"),
 "tg_chrys": ("https://www.thegoodscentscompany.com/odor/chrysanthemum.html", "The Good Scents Company -Odor Descriptor Listing for chrysanthemum", "The Good Scents Company"),
 "fr_chrysboard": ("https://www.fragrantica.com/board/viewtopic.php?id=278898", "Chrysanthemums: Niche perfumes GAP (Page 1) — Niche Perfumes — Fragrantica Club", "Fragrantica Club"),
 "adar_root": ("https://adarperfumes.com/products/root-code", "Root Code", "ADAR Perfumes"),
 "fr_orchid": ("https://www.fragrantica.com/notes/Orchid-154.html", "Orchid perfume ingredient, Orchid fragrance and essential oils (Orchidaceae)"),
 "ps_orchid": ("https://perfumesociety.org/ingredients-post/orchid/", "Orchid - The Perfume Society"),
 "fr_orchidnews": ("https://www.fragrantica.com/news/Orchids-in-Perfumery-Olympic-Orchids-Artisan-Perfume-House-2706.html", "Orchids in Perfumery: Olympic Orchids Artisan Perfume House ~ Niche Perfumery ~ Fragrantica"),
 "fr_free": ("https://www.fragrantica.com/notes/Freesia-94.html", "Freesia perfume ingredient, Freesia fragrance and essential oils Freesia Refracta (Iridaceae)"),
 "ps_free": ("https://perfumesociety.org/ingredients-post/freesia/", "Freesia - The Perfume Society"),
 "fr_freenews": ("https://www.fragrantica.com/news/Freesia-Flower-of-Electric-Freshness-3032.html", "Freesia, Flower of Electric Freshness ~ Raw Materials ~ Fragrantica"),
 "fr_gard": ("https://www.fragrantica.com/notes/Gardenia-19.html", "Gardenia perfume ingredient, Gardenia fragrance and essential oils Gardenia"),
 "ps_gard": ("https://perfumesociety.org/ingredients-post/gardenia/", "Gardenia - The Perfume Society"),
 "oz_gard": ("https://www.osmoz.com/inspiration/osmoz-magazine/623/best-gardenia-perfume", "Best gardenia perfume - 10 best smelling scents with this floral note"),
 "fr_ger": ("https://www.fragrantica.com/notes/Geranium-21.html", "Geranium perfume ingredient, Geranium fragrance and essential oils Pelargonium Graveolens"),
 "ps_ger": ("https://perfumesociety.org/ingredients-post/geranium/", "Geranium - The Perfume Society"),
 "fr_gernews": ("https://www.fragrantica.com/news/Geranium-and-Pelargonium-in-Perfume-20616.html", "Geranium and Pelargonium in Perfume ~ Raw Materials ~ Fragrantica"),
 "st_gerbourbon": ("https://www.scentree.co/en/Geranium_oil_(bourbon).html", "ScenTree - Geranium oil (bourbon) (CAS N° 8000-46-2)"),
 "la_walk": ("https://lesabstraits.com/products/philosophers-walk", "Philosopher's Walk", "Les Abstraits"),
 "men_goldenrod": ("https://store.motherearthnews.com/products/goldenrod-sweet-solidago-odora", "Goldenrod, Sweet (Solidago odora)", "Mother Earth News Store"),
 "wp_solidago": ("https://en.wikipedia.org/wiki/Solidago", "Solidago - Wikipedia"),
 "adar_adhd": ("https://adarperfumes.com/products/adhd-neuro-elixir", "ADHD Neuro Elixir", "ADAR Perfumes"),
 "oz_greentea": ("https://www.osmoz.com/encyclopedia/raw-materials/green/198/green-tea-camelia-sinensis", "Green Tea (Camelia Sinensis) Perfumes raw material - Green Tea (Camelia Sinensis) Scent"),
 "ps_camellia": ("https://perfumesociety.org/ingredients-post/camellia/", "Camellia - The Perfume Society"),
 "fr_helio": ("https://www.fragrantica.com/notes/Heliotrope-99.html", "Heliotrope perfume ingredient, Heliotrope fragrance and essential oils Heliotropium arborescens (Boraginaceae)"),
 "ps_helio": ("https://perfumesociety.org/ingredients-post/heliotrope/", "Heliotrope - The Perfume Society"),
 "fr_helionews": ("https://www.fragrantica.com/news/Heliotrope-in-Perfumes-2755.html", "Heliotrope in Perfumes ~ Raw Materials ~ Fragrantica"),
 "ps_heliocomfort": ("https://perfumesociety.org/heliotrope-evoking-nostalgia-and-comfort/", "Heliotrope: Evoking Nostalgia and Comfort - The Perfume Society"),
 "ps_honey": ("https://perfumesociety.org/ingredients-post/honeysuckle/", "Honeysuckle - The Perfume Society"),
 "fr_honeynews": ("https://www.fragrantica.com/news/Honeysuckle-In-Perfumery-9689.html", "Honeysuckle In Perfumery ~ Raw Materials ~ Fragrantica"),
 "wp_lonicera": ("https://en.wikipedia.org/wiki/Lonicera_japonica", "Lonicera japonica - Wikipedia"),
 "fr_honeyfloral": ("https://www.fragrantica.com/news/Honeysuckle-the-Honeyed-Floralcy-3225.html", "Honeysuckle, the Honeyed Floralcy ~ Raw Materials ~ Fragrantica"),
 "ps_jas": ("https://perfumesociety.org/ingredients-post/jasmine-2/", "Jasmine - The Perfume Society"),
 "fr_jas": ("https://www.fragrantica.com/notes/Jasmine-14.html", "Jasmine perfume ingredient, Jasmine fragrance and essential oils Jasminum Grandiflorum (Oleaceae)"),
 "fr_jasgs": ("https://www.fragrantica.com/news/Jasmine-Grandiflorum-vs-Sambac-20384.html", "Jasmine: Grandiflorum vs Sambac ~ Raw Materials ~ Fragrantica"),
 "fw_sambac": ("https://fraterworks.com/products/jasmine-sambac-absolute", "Jasmine Sambac “Signature” Absolute – Fraterworks"),
 "fr_lily": ("https://www.fragrantica.com/notes/Lily-157.html", "Lily perfume ingredient, Lily fragrance and essential oils Lilium (Liliaceae)"),
 "fr_lilyshow": ("https://www.fragrantica.com/news/Best-in-Show-Lily-2018--10719.html", "Best in Show: Lily (2018) ~ Best in Show ~ Fragrantica"),
 "fr_lilyboard": ("https://www.fragrantica.com/board/viewtopic.php?id=121687", "what do lilies smell like? (Page 1) — Aromatherapy and Scents of Nature — Fragrantica Club", "Fragrantica Club"),
}
N = {
 "note-alpine-sandwort": dict(
  say="A tiny white flower of the high Rocky Mountains, with five notched petals, growing in cracks of rock and stony ground where little else will. No perfume material is made from it; in Pineward's list it is part of a picture of a high mountain meadow: thin cold air, warm stone and the faint green sweetness of small white flowers.",
  src=["fn_sandwort", "cwb_sandwort", "pw_list"]),
 "note-azure-bluet": dict(
  say="A tiny sky-blue flower with a yellow eye, also called Quaker ladies, that carpets meadows in the eastern United States in spring. It is delicate and only faintly fragrant, and no perfume material is made from it; in Pineward's list it is one of the flowers of a mountain meadow, a soft, fresh, barely-there sweetness.",
  src=["wp_bluet", "pw_list"]),
 "note-bluebell": dict(
  say="The wild English bluebell of spring woods. Its scent is clear, sweet, green and delicate, with a hint of honey: standing in a bluebell wood you are wrapped in a soft green-floral haze. No oil is made from it, so perfumers rebuild it, usually from hyacinth softened with other flowers and something fresh and dewy.",
  src=["fr_bluebell", "ps_bluebell", "fr_bluebellnews"],
  vars={"Bluebell Flowers": dict(same=SAME)}),
 "note-carnation": dict(
  say="The frilly pink of buttonholes, and a floral that smells of spice: clove above all, peppery and warm, over a soft rosy flower. That clove is literal, since carnation and clove share their main molecule, eugenol. Real carnation extract is rare and costly, and eugenol is now restricted, so it is mostly built by the perfumer. It is an old-fashioned, dandyish note, very much of the classic perfumes.",
  src=["fr_carn", "ps_carn", "fr_carnclove"]),
 "note-champaca": dict(
  say="The golden-orange flower of a magnolia tree from India and Southeast Asia, offered in temples and worn in the hair. Its absolute is one of the richest florals there is: warm, heady and honeyed, buttery and waxy, with tea, apricot and a touch of spice, a creamy, slightly animal sweetness like jasmine and orange blossom together. A narcotic, luxurious white-floral note.",
  src=["fr_champ", "tg_champ", "fr_champmol"]),
 "note-chrysanthemum": dict(
  say="The big autumn flower, and one that smells more of leaves than of flowers: sharp, green, bitter and herbal, cool and a little camphorous, with a hint of pine and the chilly smell of a florist's fridge. It is hard to capture, so a perfume's chrysanthemum is often greener and creamier than the real thing.",
  src=["fr_chrys", "tg_chrys", "fr_chrysboard"]),
 "note-clear-orchid": dict(
  say="ADAR's own name for an orchid made sheer. Orchids themselves smell of almost anything, and many of the ones in shops smell of nothing, so a perfume's orchid is always an invention: usually a clean, sweet, softly powdery floral, sometimes with the vanilla of the vanilla orchid. Clear here means that made transparent and light rather than creamy.",
  src=["adar_root", "fr_orchid", "ps_orchid", "fr_orchidnews"]),
 "note-freesia": dict(
  say="A florist's favourite, and a flower whose real smell has never been caught in a bottle: every freesia in perfume is a reconstruction. It smells radiantly sweet and airy, clean and a little soapy, with a peppery, nose-tingling freshness, a hint of citrus and something like tea. It rarely leads a perfume; it brightens lily of the valley, peony and magnolia around it.",
  src=["fr_free", "ps_free", "fr_freenews"]),
 "note-gardenia": dict(
  say="A creamy white flower with glossy leaves, and one of the most intoxicating smells in a garden: rich and buttery, but also green, dewy and almost cool, with strange mushroomy and even cheesy facets up close. No usable oil can be taken from it, so perfumers build it, mostly from tuberose and other white flowers. It reads as lush, fresh and a little old-Hollywood.",
  src=["fr_gard", "ps_gard", "oz_gard"]),
 "note-geranium": dict(
  say="Not the red balcony plant but the rose geranium, whose leaves are distilled. It smells like rose with a green, minty, lemony twist and none of the powder: fresh, fruity and a little sharp. It is often used in place of the far costlier rose, and it gives fougères and men's perfumes a clean, rosy lift.",
  src=["fr_ger", "ps_ger", "fr_gernews", "st_gerbourbon"],
  vars={
   "Geranium (Morocco)": dict(say="Geranium oil from Morocco. Each origin smells a little different: the famous Bourbon oil is rich and minty-rosy, the Egyptian sharper and more citrus, and Moroccan oil carries a molecule the others lack that adds a woody note like vetiver and grapefruit.", src=["st_gerbourbon", "la_walk", "fr_gernews"]),
  }),
 "note-goldenrod": dict(
  say="The tall golden plumes of late-summer meadows in North America, and a major honey plant for bees. Its smell is warm and hay-like, honeyed and softly floral, with a green, herbal edge; the sweet goldenrod even smells of anise when its leaves are crushed. It is not a perfume material; in Pineward's list it paints a sunlit field at the end of summer.",
  src=["men_goldenrod", "wp_solidago", "pw_list"]),
 "note-green-tea-flowers": dict(
  say="The small white flowers of the tea plant itself, a camellia. They have little smell of their own and no oil is made from them, so the note is an impression: delicate and softly sweet, a little honeyed, with the calm green freshness of green tea around it.",
  src=["adar_adhd", "oz_greentea", "ps_camellia"]),
 "note-heliotrope": dict(
  say="A small purple flower whose smell is sweet and powdery, like almond, vanilla and a little cherry: marzipan, meringue, a soft cloud. The flower cannot be extracted, so perfumers use heliotropin, a molecule with the same sweet almond softness. It is a nostalgic, comforting note, full of old face powder and the classic perfumes of the twentieth century.",
  src=["fr_helio", "ps_helio", "fr_helionews", "ps_heliocomfort"]),
 "note-honeysuckle": dict(
  say="The climbing hedgerow flower whose smell pours out on summer evenings: sweet and nectar-like, heady, a little like jasmine tinged with vanilla and honey, with a green freshness and a hint of pollen. It gives almost no oil, so in perfume it is nearly always rebuilt.",
  src=["ps_honey", "fr_honeynews", "fr_honeyfloral"],
  vars={
   "Japanese Honeysuckle": dict(say="The species Lonicera japonica, the most widespread honeysuckle: sweetly vanilla-scented and more indolic, heavier and headier than the European hedgerow kind, strongest in the evening, when it calls the moths.", src=["wp_lonicera", "fr_honeynews"]),
  }),
 "note-jasmine": dict(
  say="The great white flower of perfumery, picked by hand at dawn. It is sweet, rich and heady, fruity like banana or apricot, and with an animal warmth underneath from indole, a molecule that in large amounts smells of anything but flowers. It is one of the two pillars of perfume with rose, and almost every floral perfume holds some.",
  src=["ps_jas", "fr_jas", "fr_jasgs"],
  vars={
   "Jasmine Sambac": dict(say="A different jasmine from the classic grandiflorum: Arabian jasmine, the flower of jasmine tea. It is greener, sharper and more animal, with more indole and less of the sweet fruit, and it recalls Chinese tea.", src=["fr_jasgs", "fw_sambac"]),
  }),
 "note-lily": dict(
  say="The big white lily of bouquets and funerals. It smells sweet, creamy and waxy, with a spicy warmth of clove, cinnamon and saffron, and in full bloom something almost meaty. No oil is made from it, so a perfume's lily is built, and it tends to be tidier than the flower in a vase.",
  src=["fr_lily", "fr_lilyshow", "fr_lilyboard"]),
}
out("FLO1", S, N)

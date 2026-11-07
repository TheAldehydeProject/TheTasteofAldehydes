// ============================================================
// TEST PAGE 2 — "Perfumer Spectrums 2026" (test-pages/2/). Not a page of the
// site: it loads nothing of the site's and nothing of the site loads it.
//
// REDESIGNED ROUND THE PERFUMERS (2026-11-07 — the owner: "for test page 2,
// i want you to completly redesign the hierarchy of the information, and
// focus on it being a perfumers page. not an accords page"). Still the
// owner's image 2, the Sunlight Spectrums poster, but what stands where is
// the other way about:
//   THE DOMES   one for each perfumer down the arc, A to Z by surname, and
//               one for the perfumes no source credits: a wire half-sphere
//               turning, a path over it as high as the perfumer has perfumes.
//   THE HOUSES  round the outside, as the poster's months: a stretch of the
//               arc for each house, as long as it has perfumes, its name, its
//               country and its count over it.
//   THE TICKS   every perfume in the site's Perfumers ledger, all 280, in its
//               house's stretch by year — longer the newer, dashed with no
//               year found — in the Perfumers page's colours: gold an
//               individual fragrance on the site, blue-white a house's,
//               rose Prin Lomros' houses, not on the site; strong where a
//               source names the perfumer, fainter where it is the house's,
//               faint where none is found.
//   THE LINES   from each perfumer to each house they made perfumes for, as
//               heavy as how many; a light runs out along each.
// ZOOMABLE as it was (the wheel, a pinch, a double-click, the + and − at the
// foot, the keys + − 0, a drag once closer), and the closer you come the more
// of the perfumes are named, with their years from about three times as
// close. PRESSED, a perfumer, a house or — closer in — a perfume opens THE
// PANEL: a perfumer's biography (the site's tools/perfumers/BIOS.md) and its
// three sources, their houses and every perfume for each; a house's
// perfumers and perfumes; a perfume's perfumer, year, credit, notes and
// sources — every name in it a way on, Back the way back, "Show on the
// poster" flying there. THE SEARCH finds a perfumer, a house or a perfume.
// The accords are gone from the poster; a perfume's notes, where the Note
// Library files them, carry their accord's code in its panel.
// KEPT SMOOTH as it was: the bands, the ticks and the words drawn once into
// a picture of their own, again only when the view or what is lit changes.
// With motion reduced: drawn once, nothing turning, and a move made at once.
// ============================================================
/* The site's Perfumers ledger as it stood on 2026-11-07, with the perfumers'
   biographies, and the notes the Note Library filed for the perfumes on the
   site on 2026-11-06. A snapshot: nothing on the site reads this page, and it
   reads nothing of the site. */
const DATA = {"perfumers":[{"id":"nicholas-nilsson","name":"Nicholas Nilsson","sort":"Nilsson","from":"United States","born":"1995","about":["An American perfumer who grew up among the forests of the Rocky Mountains; Parfumo gives 1995 as the year he was born.","Self-taught, he founded Pineward in Colorado in 2020, at twenty-five, meaning it to be a line of pine and fir perfumes.","The money to start it came from donating plasma after he recovered from COVID-19 in June 2020.","In 2022 he acquired Apoteker Tepe and brought its perfumes back, working with its founder, Holladay Saltz.","Parfumo knows sixty-two perfumes by him, every one of them for Pineward."],"bio":{"t":["Nicholas Nilsson is an American perfumer, born in 1995, who grew up among the forests of the Rocky Mountains. He founded Pineward in 2020, at twenty-five, meaning it to be a line of perfumes of pine and fir.","He taught himself, and every perfume he is known for is Pineward's own. Parfumo knows sixty-two by him, rated 7.3 out of ten on average, and WhatScent, too, files him as his house's one perfumer."],"s":[["“Nicholas Nilsson.” *Parfumo*, parfumo.com. Accessed 7 Nov. 2026.","https://www.parfumo.com/Perfumers/nicholas-nilsson"],["“Pineward: Info and Facts.” *Parfumo*, parfumo.net. Accessed 7 Nov. 2026.","https://www.parfumo.net/PerfumeBrand/pineward"],["“Nicholas Nilsson.” *WhatScent*, whatscent.app. Accessed 7 Nov. 2026.","https://whatscent.app/perfumers/nicholas-nilsson"]]}},{"id":"dan-roxana-adar","name":"Dan & Roxana Adar","sort":"Adar","from":"Romania","about":["The in-house perfumers of ADAR, a European house with Romanian roots.","ADAR made its perfumes only on private commission until a public collection came out in 2025.","The house also works with outside perfumers — Antoine Lie, Miguel Matos and Manuel Attardi — and does not say which of them made which perfume; here every ADAR perfume is credited to the house's own pair unless a source names its nose.","Where the house names the nose — Dan Adar, Rox (Roxana) Adar or Miguel Matos — the perfume is credited to that perfumer instead; what is left here is the house's pair."],"bio":{"t":["Dan and Roxana Adar are the two in-house perfumers of ADAR, a European house with Romanian roots. The house says it came out of a long dialogue between two creators who work as The Light and The Dark — one drawn to the luminous and ethereal, the other to depth, shadow and intensity.","For many years its perfumes went only to a small circle of private collectors, as commissions; it has been public since 2025. Every core formula is developed in-house by the two of them, each bottle is made by hand from marble, stone, wood, resin or metal, and each perfume is made in numbered micro-batches with one note left undisclosed. The house also works with a few outside perfumers, Antoine Lie, Miguel Matos and Manuel Attardi among them."],"s":[["“The House.” *ADAR*, adarperfumes.com. Accessed 7 Nov. 2026.","https://adarperfumes.com/pages/about"],["“Adar.” *Scent Split*, scentsplit.com. Accessed 7 Nov. 2026.","https://www.scentsplit.com/collections/adar"],["“Adar – Tyrian.” *The Perfumery Barcelona*, theperfumerybarcelona.com. Accessed 2 Nov. 2026.","https://www.theperfumerybarcelona.com/en/?p=27314"]]}},{"id":"goran-bajazetov","name":"Goran Bajazetov","sort":"Bajazetov","about":["The founder and perfumer of Almost Human.","Before perfume he spent more than twenty years in design, visual design, storytelling and the development of technology products; Parfumo lists the house as a Romanian brand he founded in 2025.","Its first collection, First Signal, came out in 2026: five perfumes that do without a pyramid of notes and are described instead by how they change on the skin."],"bio":{"t":["Goran Bajazetov is the founder, perfumer and creative director of Almost Human. Before perfume he spent more than twenty years in design, visual design, storytelling and the making of technology products.","He founded the house in 2025. Its perfumes draw on science fiction, on esoteric ideas and on work across disciplines, and they are told not by a pyramid of notes but by how they change on the skin. The first collection, First Signal, came out in 2026: Burning Bridges, Dear Future, Desert Hope, Ritual Code and Silent Rain. Parfumo and Pitti Immagine give the house as Romanian; Scent Verdict places it in Novi Sad, in Serbia."],"s":[["“Almost Human.” *Pitti Immagine Fragranze*, fragranze.pittimmagine.com. Accessed 7 Nov. 2026.","https://fragranze.pittimmagine.com/en/exhibitors/A/almost-human"],["“Almost Human: All Perfumes & Information.” *Parfumo*, parfumo.com. Accessed 7 Nov. 2026.","https://www.parfumo.com/Perfumes/almost-human?o=y_desc"],["“Goran Bajazetov.” *Scent Verdict*, scentverdict.com. Accessed 7 Nov. 2026.","https://scentverdict.com/perfumer/goran-bajazetov"]]}},{"id":"david-lev-jipa-slivinschi","name":"David-Lev Jipa-Slivinschi","sort":"Jipa-Slivinschi","from":"Romania","about":["Born in Bucharest, of Russian and Ukrainian heritage, he studied film and screenwriting and turned to perfume during the pandemic.","Self-taught, he founded his own house, Toskovat', in Bucharest in 2022.","For Ataraxia he is credited with Vestibule and Amaretto Jazz in the Melting Room, both from 2024."],"bio":{"t":["David-Lev Jipa-Slivinschi was born in Bucharest, of Russian and Ukrainian heritage. He studied film and screenwriting, and came to perfume during the pandemic.","Self-taught, he founded his own house, Toskovat', in Bucharest in 2022. He calls its perfumes extraits de mémoire, each meant to set off one feeling or one memory, and he has said that the story side of a perfume is what matters most to him. For Ataraxia he made Vestibule and Amaretto Jazz in the Melting Room."],"s":[["“Toskovat.” *Parfinity*, parfinity.com. Accessed 2 Nov. 2026.","https://www.parfinity.com/en/brand/toskovat"],["“Toskovat'.” *Scento*, scento.com. Accessed 2 Nov. 2026.","https://www.scento.com/brand/toskovat"],["“The Cult Brand Making Perfume That Smells Like Gasoline, Holy Water and Money.” *Vogue Philippines*, vogue.ph. Accessed 7 Nov. 2026.","https://vogue.ph/beauty/the-cult-brand-making-perfume-that-smells-like-gasoline-holy-water-and-money/"]]}},{"id":"sy-truong","name":"Sy Truong","sort":"Truong","about":["Named by Ça Fleure Bon as the perfumer of Ataraxia's Deity (2025), made with the house's creative director, Tudor Ristea.","Deity was a finalist in the Art and Olfaction Awards."],"bio":{"t":["Sy Truong, also written Sy Trong (Trương Chiêu Sỹ), is an independent perfumer in Vietnam, who founded Sylhouette Parfums with Nhan Ngoc Bao Tran. He began studying perfume, teaching himself, in 2018, after a book on perfume changed his life.","His perfumes are dark and romantic — Poème Noir, Desir Noir and La Lune Errante among them — and Sylhouette's Molotov Cocktail won an Art and Olfaction Award in 2024. For Ataraxia he made Deity, with the house's creative director, Tudor Ristea."],"s":[["“Three Sylhouette Parfums You Should Be Wearing (Sy Trong / Truong Chieu Sy).” *Ça Fleure Bon*, cafleurebon.com. Accessed 7 Nov. 2026.","https://cafleurebon.com/three-sylhouette-parfums-you-should-be-wearing-sy-trong-truong-chieu-sy-plus-desir-noir-giveaway/"],["“Sylhouette Parfums.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/brand/1000/sylhouette-parfums"],["Vernon, Emma, host. “198. Sy Truong [Sylhouette] ~ The Man With the Paracresol Tattoo.” *Perfume Room*, Pocket Casts. Accessed 7 Nov. 2026.","https://pocketcasts.com/podcast/perfume-room/5ea88330-89c8-0139-34e7-0acc26574db2/198-sy-truong-sylhouette-the-man-with-the-paracresol-tattoo/9c686769-393a-487b-879b-5e921b04685e"]]}},{"id":"antoine-lie","name":"Antoine Lie","sort":"Lie","from":"France","born":"1966","about":["Born in Strasbourg in 1966.","He studied chemistry before moving to Grasse to train as a perfumer.","He has made perfumes for ERIS Parfums, État Libre d'Orange, Comme des Garçons, Houbigant and Les Indémodables.","Every Les Abstraits perfume is his, made with the house's founder, the fragrance critic and YouTuber Eugen Nizic."],"bio":{"t":["Antoine Lie is a French perfumer, raised in Strasbourg, who studied chemistry before moving to Grasse to study perfume, and was apprenticed to the teacher Jean Guichard. He worked in France and in the United States, where he took part in Armani Code, Versace Crystal Noir and Ralph Lauren Romance for Men, at Givaudan, at IFF and, from 2011, at Takasago.","Wanting more freedom, he left the large companies for niche houses, and since 2018 has been independent, with a studio of his own in Paris, ALOE — Antoine Lie Olfactive Experience. He calls himself an abstract perfumer. He has made perfumes for ERIS, Houbigant, Les Indémodables and Zoologist, Trudon's Absolu, Comme des Garçons' Wonderwood and État Libre d'Orange's Rien — and every perfume of Les Abstraits, with its founder, Eugen Nizic."],"s":[["“Antoine Lie.” *Nose Paris*, noseparis.com. Accessed 7 Nov. 2026.","https://noseparis.com/fr/nez/antoine-lie-nez/"],["“Antoine Lie.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/antoine-lie"],["“Antoine Lie.” *The Fragrance Foundation UK*, fragrancefoundation.org.uk. Accessed 7 Nov. 2026.","https://fragrancefoundation.org.uk/antoine-lie"]]}},{"id":"michael-nordstrand","name":"Michael Nordstrand","sort":"Nordstrand","about":["Named by Parfumo and by Ça Fleure Bon as the perfumer of Tale Parfum's Bad Lily (2024).","Nothing more about him has been filed here yet."],"bio":{"t":["Michael Nordstrand is an independent perfumer, teacher and artist, with a small studio of his own, Mythologist Studio. He trained at Givaudan, ISIPCA, the Grasse Institute of Perfumery and Cinquième Sens.","For the Getty Villa he made, in 2025, a perfume in two scents after ancient Pylos. He has worked with Epichron, Future Society and House of Mammoth, and for Tale Parfum he made Bad Lily."],"s":[["“Dab a Little 3,000-Year-Old Greek Civilization on Your Wrist.” *Getty News*, getty.edu. Accessed 7 Nov. 2026.","https://www.getty.edu/news/pylos-perfume-michael-nordstrand-q-and-a"],["“Michael Nordstrand.” *Scent Verdict*, scentverdict.com. Accessed 7 Nov. 2026.","https://scentverdict.com/perfumer/michael-nordstrand"],["“Michael Nordstrand.” *WhatScent*, whatscent.app. Accessed 7 Nov. 2026.","https://whatscent.app/perfumers/michael-nordstrand"]]}},{"id":"chad-hodge","name":"Chad Hodge","sort":"Hodge","from":"United States","about":["A screenwriter, and co-founder of Tale Parfum with its creative director, Diandra Barsalou.","Ça Fleure Bon credits Water Me to him.","Tale Parfum was founded in Los Angeles."],"bio":{"t":["Chad Hodge is an American writer and producer, born in 1977 in Kansas City, Missouri, and raised in Highland Park, Illinois; he studied at Northwestern University. He created the television series Runaway, The Playboy Club, Wayward Pines and Good Behavior, and wrote the Broadway Holiday Inn and the film The Darkest Minds.","With the creative director Diandra Barsalou he founded Tale Parfum, a house with, in Sainte Cellier's words, a cinematic instinct for character and transformation, which composes each perfume as a chapter in an evolving story. Ça Fleure Bon credits Water Me to him."],"s":[["“Chad Hodge.” *Wikipedia*, en.wikipedia.org. Accessed 7 Nov. 2026.","https://en.wikipedia.org/wiki/Chad_Hodge"],["“Tale Parfum.” *Sainte Cellier*, saintecellier.com. Accessed 7 Nov. 2026.","https://saintecellier.com/collections/tale-parfum"],["“Tale Parfum Bad Lily (Michael Nordstrand) 2024.” *Ça Fleure Bon*, cafleurebon.com. Accessed 2 Nov. 2026.","https://cafleurebon.com/tale-parfum-bad-lily-michael-nordstrand-2024-plus-surreal-muget-giveaway/"]]}},{"id":"qimu","name":"Qimu","sort":"Qimu","about":["WhatScent names Qimu as the perfumer of Drummer, by the house that carries the name, Qimu & Musicians.","No source found says who made Guitarist, Vocal or Bassist, so those stand under Perfumer not found."],"bio":{"t":["Qimu is the name WhatScent gives as the perfumer of Drummer, by the house that carries the name, Qimu & Musicians. Essencional reports that Lan, the founder of Tombstone, shows Qimu and Musicians at Esxence beside Tombstone, with Bu Feng and Scented Vision.","No source found says who Qimu is, or who made Guitarist, Vocal or Bassist."],"s":[["“Qimu & Musicians Drummer.” *WhatScent*, whatscent.app. Accessed 2 Nov. 2026.","https://whatscent.app/perfume/drummer-1783425703668"],["“Fragrance Creators from China Softly Whisper and Steadily Conquer.” *Essencional*, essencional.com. Accessed 7 Nov. 2026.","https://essencional.com/en/posts/fragrance-creators-from-china-softly-whisper-and-steadily-conquer/"]]}},{"id":"aichi-liu","name":"Aichi Liu","sort":"Liu","from":"Taiwan","about":["She founded OM Parfum in 2021 and is based in Taiwan; her perfumes draw on films, places, her own experiences and moods.","Parfumo names her as the house's only perfumer.","She also makes the perfumes of Outsider Parfum, which OM Parfum markets."],"bio":{"t":["Aichi Liu, called Archie by her friends, is a perfumer in Taiwan who founded OM Parfum in 2021. She came to it as a collector: it struck her one day that the many perfumes she had smelled and collected all seemed to be the same.","Her perfumes draw on films, places, her own experiences and moods. Parfumo names her as the only perfumer of OM Parfum and knows about fifty perfumes by her, rated 7.8 out of ten on average. She also makes the perfumes of Outsider Parfum, which OM Parfum markets."],"s":[["“From Taiwan to the World: Aichi Liu's Scented Journey with OM Parfum.” *Parfumo*, parfumo.com, June 2024. Accessed 7 Nov. 2026.","https://www.parfumo.com/Users/Chizza/Blog/Article/from-taiwan-to-the-world-aichi-liu-s-scented-journey-with-om-parfum"],["“Aichi Liu.” *Parfumo*, parfumo.com. Accessed 7 Nov. 2026.","https://www.parfumo.com/Perfumers/aichi-liu"],["“Dragon's Breath.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026.","https://www.parfumo.com/Perfumes/outsider-parfum/dragon-s-breath"]]}},{"id":"mathew-schmuelian","name":"Mathew Schmuelian","sort":"Schmuelian","from":"United States","about":["He founded Lost Tribe in New York City in 2022, after years of collecting all-natural, artisanal perfumes, and went on to source his own raw materials.","Lost Tribe works almost entirely with natural materials, and names him as its perfumer.","Pan's Labyrinth he composed with the perfumer Rajesh Balkrishnan."],"bio":{"t":["Mathew Schmuelian is the perfumer and founder of Lost Tribe, a house of natural perfume he started in New York City in 2022. Before it he spent several years collecting artisanal natural perfumes, which led him to source his own raw materials and to macerate animalic ones himself.","Lost Tribe is all natural and handmade in New York. Its perfumes are dense, with prominent animalic notes — musk, oud and ambergris — and an unapologetically intense style; he has described its aim as drawing attention to a niche corner of perfumery and teaching people about all-natural perfume. Pan's Labyrinth he made with the perfumer Rajesh Balkrishnan."],"s":[["“Lost Tribe.” *Scent Verdict*, scentverdict.com. Accessed 2 Nov. 2026.","https://scentverdict.com/brand/lost-tribe"],["“Lost Tribe.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/brands/lost-tribe"],["“Lost Tribe Pan's Labyrinth v2 Extrait.” *Venba Fragrance*, venbafragrance.com. Accessed 2 Nov. 2026.","https://www.venbafragrance.com/products/lost-tribe-pans-labyrinth-v2-extrait"]]}},{"id":"rajesh-balkrishnan","name":"Rajesh Balkrishnan","sort":"Balkrishnan","about":["Named as co-perfumer, with Mathew Schmuelian, of Lost Tribe's Pan's Labyrinth.","Nothing more about him has been filed here yet."],"bio":{"t":["Rajesh Balkrishnan is an independent perfumer who is also an academic, a professor of public health at the University of Virginia School of Medicine, in Charlottesville. He came to perfume from medical research, and learned it mostly by himself and by working with others.","His perfumes are dense and woody, often animalic, and often drawn from Indian culture and nature. Among them are Sayat Nova, made with Dmitry Bortnikoff after the eighteenth-century Armenian poet, and Aranyaka, made with Prin Lomros. Parfumo knows twenty-two perfumes by him; for Lost Tribe he made Pan's Labyrinth, with Mathew Schmuelian."],"s":[["“Rajesh Balkrishnan: Academic Turned Fragrance Visionary.” *Parfinity*, parfinity.com. Accessed 7 Nov. 2026.","https://next.parfinity.com/en/perfumer/rajesh-balkrishnan"],["“Rajesh Balkrishnan.” *Parfumo*, parfumo.com. Accessed 7 Nov. 2026.","https://www.parfumo.com/Perfumers/rajesh-balkrishnan"],["“Lost Tribe Pan's Labyrinth v2 Extrait.” *Venba Fragrance*, venbafragrance.com. Accessed 2 Nov. 2026.","https://www.venbafragrance.com/products/lost-tribe-pans-labyrinth-v2-extrait"]]}},{"id":"holladay-penick-saltz","name":"Holladay Penick Saltz","sort":"Saltz","from":"United States","about":["From the Jackson, Mississippi area, she graduated from the Rhode Island School of Design and specialised in fashion and material culture at Parsons and The New School.","After studying fragrance formulation and production at Le Labo in New York, she founded Apoteker Tepe in 2014, and ran it until 2018.","In 2022 Nicholas Nilsson of Pineward acquired the line and brought it back with her help."],"bio":{"t":["Holladay Penick Saltz is from the area of Jackson, Mississippi. She graduated from the Rhode Island School of Design and studied fashion and material culture at Parsons and The New School, then studied the formulation and making of perfume at Le Labo in New York.","She founded Apoteker Tepe in 2014 and ran it as a one-woman house, making and batching the line herself in her studio. Ça Fleure Bon wrote of her understanding of perfume as a symbol, and of the weight she gives to history. In 2022 Nicholas Nilsson of Pineward took the line over and brought it back with her help."],"s":[["“Holladay Saltz.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026.","https://www.parfumo.com/Perfumers/Holladay_Saltz"],["“In the Studio with Apoteker Tepe.” *Catbird*, catbirdnyc.blogspot.com, July 2015. Accessed 7 Nov. 2026.","https://catbirdnyc.blogspot.com/2015/07/in-studio-with-apoteker-tepe.html"],["“ÇaFleureBon Profiles in American Perfumery: Holladay Saltz of Apoteker Tepe.” *Ça Fleure Bon*, cafleurebon.com. Accessed 7 Nov. 2026.","https://cafleurebon.com/cafleurebon-profiles-in-american-perfumery-holladay-saltz-of-apoteker-tepe-transcendence-through-art-draw/"]]}},{"id":"christopher-sheldrake","name":"Christopher Sheldrake","sort":"Sheldrake","from":"United Kingdom","born":"1955","about":["Born on 11 April 1955 in Madras, India.","The perfumer Georges Cœur took him on as an apprentice in 1974; he worked at Robertet and at Chanel before meeting Serge Lutens in 1989.","He went on to make Féminité du Bois (1992), Ambre Sultan (1993) and nearly all of the Serge Lutens line.","In 2005 he returned to Chanel as perfumer and director of research and development, beside Jacques and later Olivier Polge."],"bio":{"t":["Christopher Sheldrake is a British perfumer, born on 11 April 1955 in Madras, India. Training as an architect, he went to France to improve his French and found himself in Grasse, and in perfume; the perfumer Georges Cœur took him on as an apprentice in 1974, and he worked at Chanel and for many years at Quest International.","In 1989 he met Serge Lutens, then Shiseido's artistic director. The Salons du Palais-Royal line opened in 1992 with his Féminité du Bois, and nearly the whole of the Serge Lutens line is his, Ambre Sultan and Chergui among it. In 2005 he returned to Chanel as perfumer and director of research and development, where Coco Noir is his; he has made perfumes for Rochas, Avon and Space NK as well."],"s":[["“Christopher Sheldrake.” *The Fragrance Foundation UK*, fragrancefoundation.org.uk. Accessed 2 Nov. 2026.","https://www.fragrancefoundation.org.uk/christopher-sheldrake"],["“Christopher Sheldrake.” *Wikipedia*, en.wikipedia.org. Accessed 7 Nov. 2026.","https://en.wikipedia.org/wiki/Christopher_Sheldrake"],["“Christopher Sheldrake.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/christopher-sheldrake"]]}},{"id":"francois-demachy","name":"François Demachy","sort":"Demachy","from":"France","about":["Born in Cannes and raised in Grasse, where his father ran a pharmacy; he studied dentistry before perfume.","He was Dior's perfumer-creator from 2006.","Francis Kurkdjian succeeded him as Dior's chief perfumer in October 2021."],"bio":{"t":["François Demachy is a French perfumer, born in Cannes and raised in Grasse, where his father ran a pharmacy. He studied dentistry and physiotherapy, worked at Mane, and then trained for five years at the perfumery school of Charabot.","At Chanel he became director of research and development, working at the same time on the perfumes of Chanel, Ungaro, Bourjois and Tiffany. In 2006 Dior made him its perfumer-creator and director of development for the perfumes and cosmetics of LVMH, where he also worked for Fendi and Acqua di Parma, and remade Miss Dior and the Eau Sauvage and Dior Homme lines. Francis Kurkdjian succeeded him at Dior in 2021, and he stayed on as a perfumer within LVMH."],"s":[["“François Demachy.” *Wikipedia*, en.wikipedia.org. Accessed 7 Nov. 2026.","https://en.wikipedia.org/wiki/Fran%C3%A7ois_Demachy"],["“Lifetime Achievement Perfumer: François Demachy.” *The Fragrance Foundation*, fragrance.org. Accessed 7 Nov. 2026.","https://fragrance.org/honoree/lifetime-achievement-perfumer-6/"],["“François Demachy.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026.","https://www.parfumo.com/Perfumers/Franois_Demachy"]]}},{"id":"ramon-monegal","name":"Ramón Monegal","sort":"Monegal","from":"Spain","born":"1951","about":["Born in 1951, of the family behind the Spanish house Myrurgia.","When Puig stopped producing Myrurgia's perfumes in 2008 he left, and after a year off, in which he wrote a book on perfume, founded the house under his own name in 2009."],"bio":{"t":["Ramón Monegal, born in Barcelona in 1951, is the fourth generation of a family of perfumers: his great-grandfather, Esteve Monegal i Prat, opened the drugstore that became Myrurgia in 1916, the house that supplied the Spanish royal family.","He studied architecture first, and began training as a perfumer in 1972 at the family company, and then in Geneva with Artur Jordi Pey, in Grasse with Marcel Carles and in Paris with Pierre Bourdon. For more than thirty years he made perfumes at Myrurgia, many of them best-sellers in Spain, and colognes for Adolfo Domínguez, Antonio Miró and Massimo Dutti. After Puig took Myrurgia over he stepped away, and in 2009 he founded his own house, Monegal, in Barcelona; his book La Perfumista came out in 2012."],"s":[["“Ramon Monegal.” *Wikipedia*, en.wikipedia.org. Accessed 7 Nov. 2026.","https://en.wikipedia.org/wiki/Ramon_Monegal"],["“Ramon Monegal.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/ramon-monegal"],["“Myrurgia.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026.","https://www.parfumo.com/PerfumeBrand/Myrurgia"]]}},{"id":"pierre-montale","name":"Pierre Montale","sort":"Montale","from":"France","about":["A self-taught perfumer, trained in materials by a perfumer in Grasse; in 1975 he and his sister founded Comptoir Sud Pacifique, and he later founded Montale Parfums.","He founded Mancera in 2008; his daughter Amélie became its artistic director in 2017."],"bio":{"t":["Pierre Montale is a French perfumer of whom, in Luckyscent's words, there are no photographs, no interviews and no profiles. He spent several decades as the in-house perfumer of a Middle Eastern royal family that has never been named, and helped to begin Comptoir Sud Pacifique.","He then launched the line under his own name, Montale, whose perfumes carry the tastes of Middle Eastern perfumery — oud, spice, rose, plum and coffee. In 2008 he founded Mancera with his daughter, Amélie, who became its artistic director in 2017; he is still its perfumer."],"s":[["“Pierre Montale.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/pierre-montale"],["“History.” *Mancera*, manceraparfums.com. Accessed 7 Nov. 2026.","https://manceraparfums.com/en/history"],["“Mancera.” *Pamco*, pamcogrp.com. Accessed 2 Nov. 2026.","https://www.pamcogrp.com/catalogues/perfume/MANCERA.pdf"]]}},{"id":"jakub-pietrynka","name":"Jakub Pietrynka","sort":"Pietrynka","from":"Poland","about":["The Polish independent perfumer behind JMP Artisan Perfumes.","Parfumo knows fifty-five perfumes by him."],"bio":{"t":["Jakub Pietrynka is an independent Polish perfumer, self-taught, who has been drawn to smells since he was a child. He comes from Zamość and has lived for more than a decade in Kraków, where he makes his perfumes; he left a career in tourism to do it.","He founded JMP Artisan Perfumes in 2019, its compositions minimal and classic and treated as art in a bottle. The line was soon known in Poland and across Europe, and Delusion and Eccentricity were also acclaimed in the United States. Parfumo knows fifty-five perfumes by him, rated 8.1 out of ten on average, Kraków (2023) among them."],"s":[["“JMP Artisan Perfumes.” *Fragrances & Art*, fragrancesandart.com. Accessed 7 Nov. 2026.","https://fragrancesandart.com/en/brands/jmp-artisan-perfumes/"],["“JMP Artisan Perfumes.” *Luckyscent*, luckyscent.com. Accessed 2 Nov. 2026.","https://www.luckyscent.com/brand/871/jmp-artisan-perfumes?section=1"],["“Jakub Pietrynka.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026.","https://www.parfumo.com/Perfumers/jakub-pietrynka"]]}},{"id":"sultan-pasha","name":"Sultan Pasha","sort":"Pasha","about":["WhatScent credits Quintessentially Amber (2025) to him, with Christian Carbonnel.","His house describes it as an amber meant to use every facet of the genre together."],"bio":{"t":["Sultan Pasha is an independent perfumer and maker of attars in London, who grew up between Dhaka and London and has a background in chemistry. Before making perfume he collected and sold rare vintage perfumes.","His paternal grandparents, who settled in Britain in the 1950s, travelled the Middle East to its holy shrines and brought back many attars, and it was to attars that he turned, as the truest way, he has said, to convey what is in him; his first, Shadee, is from 2012. His style draws on French perfumery before the 1960s, with heavy use of rare natural materials. For Zoologist he made Sacred Scarab (2023), and with Christian Carbonnel, Quintessentially Amber (2025)."],"s":[["“An Interview with Sultan Pasha, the Perfumer of Zoologist Sacred Scarab.” *Zoologist Perfumes*, zoologistperfumes.com. Accessed 7 Nov. 2026.","https://www.zoologistperfumes.com/blogs/news/an-interview-with-sultan-pasha-the-perfumer-of-zoologist-sacred-scarab"],["Turin, Luca. “Sultan Pasha Attars.” *Luca Turin*, lucaturin.substack.com. Accessed 7 Nov. 2026.","https://lucaturin.substack.com/p/sultan-pasha-attars"],["“Quintessentially Amber.” *WhatScent*, whatscent.app. Accessed 2 Nov. 2026.","https://whatscent.app/perfume/quintessentially-amber-1784060250942"]]}},{"id":"christian-carbonnel","name":"Christian Carbonnel","sort":"Carbonnel","about":["Credited by WhatScent, with Sultan Pasha, for Quintessentially Amber (2025).","Nothing more about him has been filed here yet."],"bio":{"t":["Christian Carbonnel, called Chris Maurice by some of the houses he works for — both are his real names, his full name being Christian Maurice Carbonnel — is the third generation of a Spanish family of perfumers. His grandfather, the French perfumer Maurice Carbonnel, founded Carbonnel S.A. in Spain in 1925.","He is a perfumer of the family company and its ambassador, and he has made perfumes for houses across Europe and the Middle East, Xerjoff, Amouage, Sospiro and Arabian Oud among them; he founded C De La Niche. He was the mentor of Miguel Matos, taking him into his laboratory. With Sultan Pasha he made Quintessentially Amber (2025)."],"s":[["“Christian Carbonnel a.k.a. Chris Maurice.” *Parfinity*, parfinity.com. Accessed 7 Nov. 2026.","https://www.parfinity.com/en/perfumer/christian-carbonnel-a-k-a-chris-maurice"],["“Chris Maurice.” *La Parfumerie*, laparfumerie.org. Accessed 7 Nov. 2026.","https://www.laparfumerie.org/parfumedia/article/39336-chris-maurice"],["“Miguel Matos: From Art Critic to Perfumer.” *Parfinity*, parfinity.com. Accessed 7 Nov. 2026.","https://www.parfinity.com/en/perfumer/miguel-matos"]]}},{"id":"russian-adam","name":"Russian Adam","sort":"Adam","about":["Ivan Inkin, called Russian Adam: a distiller who founded Areej Le Doré in Thailand in 2017; the house is now based in Indonesia.","Areej Le Doré specialises in natural oud and sandalwood oils it distils itself.","Forbidden Flower is from 2024."],"bio":{"t":["Ivan Inkin, known as Russian Adam, is a distiller and perfumer who founded Areej Le Doré in Thailand in 2017; the house is now based in Indonesia, and it specialises in natural oud and sandalwood oils it distils itself.","He makes his own distillations so that he has full control of the oils he puts into his perfumes — the Mysore sandalwood in Koh-i-Noor among them — and the Choco Borai oud at the head of his Russian Oud is Thai agarwood he co-distilled himself."],"s":[["“Areej Le Doré: Interesting Facts.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026.","https://www.parfumo.com/Perfumes/Areej_Le_Dore?col_id=2278"],["“Areej Le Dore – Koh-i-Noor.” *Luckyscent Videos*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/videos/detail/249/areej-le-dore-koh-i-noor"],["“Areej Le Doré Russian Oud: Willy Wonka's Oud.” *Kafkaesque*, kafkaesqueblog.com, 11 Feb. 2018. Accessed 7 Nov. 2026.","https://kafkaesqueblog.com/2018/02/11/areej-le-dore-russian-oud-willy-wonkas-oud/"]]}},{"id":"josh-lobb","name":"Josh Lobb","sort":"Lobb","from":"United States","about":["An entirely self-taught perfumer in Portland, Oregon; Slumberhouse began as a collective of artist friends and became his own.","Ore was one of his first perfumes, in 2009; he remade it as an extrait, and again in 2022."],"bio":{"t":["Josh Lobb is an entirely self-taught perfumer in Portland, Oregon. Slumberhouse began there as a collective among artist friends, he making the perfumes and they the art, clothing and the rest; his perfumes, sold one at a time on Etsy, took off, and it became his own house.","Though some take him for a natural perfumer, he rejects the name, and works with whatever material fits the idea, synthetic or natural. Slumberhouse's heavy, often difficult style and its sporadic production have given it a cult following. Ore was one of his first perfumes, in 2009, and he has remade it since."],"s":[["“Josh Lobb.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/49/josh-lobb"],["“The Best Perfumes in Portland.” *Portland Monthly*, pdxmonthly.com. Accessed 7 Nov. 2026.","https://www.pdxmonthly.com/articles/best-perfumes-portland"],["“Niche Fragrance Review: slumberhouse Ore.” *Ça Fleure Bon*, cafleurebon.com. Accessed 2 Nov. 2026.","https://cafleurebon.com/niche-fragrance-review-slumberhouse-ore-better-the-second-time-draw/"]]}},{"id":"prin-lomros","name":"Prin Lomros","sort":"Lomros","from":"Thailand","about":["A Thai perfumer who first studied film, then began his career at PerfumersWorld, a large Thai fragrance company, before founding Pryn Parfum in 2016 as a self-taught perfumer.","Three lines came of it: Strangers Parfumerie (2017), the one closest to his own life; Parfum Prissana (2018), named after his sister, joining classic structures with an East Asian style; and PRIN (2019), the most personal of the three.","Several of his perfumes were finalists in the Art and Olfaction Awards — Rosuerrier in 2017, Cigar Rum and Morah in 2018 — and he has made perfumes for Zoologist.","He also teaches filmmaking at a university in Bangkok."],"bio":{"t":["Prin Lomros is a Thai perfumer and filmmaker from the south of Thailand. He studied film; a visit to Grasse woke the wish to make perfume, and he trained at The Perfumer's World in Bangkok, otherwise teaching himself.","He founded Pryn Parfum, and from it three lines — Strangers Parfumerie (2017), Parfum Prissana and PRIN — since brought together under the one name, PRIN. His perfumes were recognised by the Art and Olfaction Awards in 2017 and 2018, and for Zoologist he made Bat and Sloth. He also teaches filmmaking at a university in Bangkok."],"s":[["“Prin Lomros.” *Parfinity*, parfinity.com. Accessed 7 Nov. 2026.","https://parfinity.com/en/perfumer/prin-lomros"],["“Prin Lomros.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/prin-lomros"],["“Strangers Parfumerie.” *Bloom Perfumery*, bloomperfume.com. Accessed 7 Nov. 2026.","https://bloomperfume.com/collections/strangers-parfumerie"]]}},{"id":"dan-adar","name":"Dan Adar","sort":"Adar, Dan","from":"Romania","about":["One of the two in-house perfumers of ADAR, a European house with Romanian roots.","The house's own pages give him as the nose of Amber Zero, Root Code and Lignum Dei, with Rox Adar as their artistic vision."],"bio":{"t":["Dan Adar is one of the two in-house perfumers of ADAR, a European house with Romanian roots, which he and Roxana Adar work in as two creators called The Light and The Dark. Every core formula of the house is developed by the two of them; for many years its perfumes went only to private collectors, and it has been public since 2025.","The house's own pages give him as the nose of Amber Zero, with Rox Adar as its artistic vision."],"s":[["“The House.” *ADAR*, adarperfumes.com. Accessed 7 Nov. 2026.","https://adarperfumes.com/pages/about"],["“Amber Zero – Essence of Depths.” *ADAR*, adarperfumes.com. Accessed 7 Nov. 2026.","https://adarperfumes.com/products/amber-zero-essence-of-dephts"],["“Adar.” *Scent Split*, scentsplit.com. Accessed 7 Nov. 2026.","https://www.scentsplit.com/collections/adar"]]}},{"id":"roxana-adar","name":"Roxana Adar","sort":"Adar, Roxana","from":"Romania","about":["One of the two in-house perfumers of ADAR, written Rox Adar on the house's own pages.","The house gives her as the nose of Tyrian, Aetherialism, Incantu and ADHD."],"bio":{"t":["Roxana Adar — Rox Adar on the house's own pages — is one of the two in-house perfumers of ADAR, a European house with Romanian roots, which she and Dan Adar work in as two creators called The Light and The Dark. Every core formula of the house is developed by the two of them; for many years its perfumes went only to private collectors, and it has been public since 2025.","The house gives her as the nose of Tyrian."],"s":[["“The House.” *ADAR*, adarperfumes.com. Accessed 7 Nov. 2026.","https://adarperfumes.com/pages/about"],["“Adar – Tyrian.” *The Perfumery Barcelona*, theperfumerybarcelona.com. Accessed 2 Nov. 2026.","https://www.theperfumerybarcelona.com/en/?p=27314"],["“Adar.” *Scent Split*, scentsplit.com. Accessed 7 Nov. 2026.","https://www.scentsplit.com/collections/adar"]]}},{"id":"miguel-matos","name":"Miguel Matos","sort":"Matos","about":["One of the outside perfumers ADAR works with.","The house's own pages give him as the nose of Alta Luna and Alpha 11, two of its Elixirs Absolus, with ADAR as their artistic vision."],"bio":{"t":["Miguel Matos is a Portuguese perfumer who works from a small laboratory and showroom of his own in Almada, near Lisbon. For about twenty years he was a journalist of the arts — an editor at Time Out Portugal, a co-founder of the culture magazine Umbigo, a writer for Vogue Portugal — and he is a scent critic and a curator of scent art as well.","He taught himself perfumery from books until the perfumer Christian Carbonnel took him into his laboratory and became his mentor. His own label, Miguel Matos Perfumes, began in 2018. He has made perfumes for Nishane, Sarah Baker (Jungle Jezebel), Astrophil & Stella (Sweet Pulp), CALAJ and Ricardo Ramos, and he is creative director and in-house perfumer of Bruno Acampora. The Fragrance Foundation, the Perfumed Plume Awards and the Art and Olfaction Awards have all recognised his work."],"s":[["“Miguel Matos: From Art Critic to Perfumer.” *Parfinity*, parfinity.com. Accessed 7 Nov. 2026.","https://www.parfinity.com/en/perfumer/miguel-matos"],["“Miguel Matos.” *Luckyscent*, luckyscent.com. Accessed 7 Nov. 2026.","https://www.luckyscent.com/perfumers/miguel-matos"],["“Miguel Matos.” *WhatScent*, whatscent.app. Accessed 7 Nov. 2026.","https://whatscent.app/perfumers/miguel-matos"]]}},{"id":"lan-xiao","name":"Lan Xiao","sort":"Xiao","about":["An independent perfumer and the founder of Tombstone, who, in Scentissime's words, explores the beauty of life through the awareness of death.","Her perfumes for the house are earthy, smoky and gourmand; Tombstone gives her Sweet Coffin, which she meant as the sweet coffin she wishes to return to, and Scentissime 3 Feet 5."],"bio":{"t":["Lan Xiao is a Chinese-American perfumer, trained in the United States and at the Grasse Institute of Perfumery, who founded Tombstone in 2024. The house breaks the taboos and fears that surround death, making the putting on of perfume a philosophical and artistic gesture; its perfumes are made by independent perfumers given complete freedom.","In Scentissime's words, she explores the beauty of life through the awareness of death. At Esxence, Tombstone's stand was one of the most popular of the fair, and beside it she showed her other brands, Bu Feng, Scented Vision and Qimu and Musicians. For Tombstone she made Sweet Coffin, which she meant as the sweet coffin she wishes to return to."],"s":[["“Fragrance Creators from China Softly Whisper and Steadily Conquer.” *Essencional*, essencional.com. Accessed 7 Nov. 2026.","https://essencional.com/en/posts/fragrance-creators-from-china-softly-whisper-and-steadily-conquer/"],["“Tombstone.” *Pitti Immagine Fragranze*, fragranze.pittimmagine.com. Accessed 7 Nov. 2026.","https://fragranze.pittimmagine.com/en/exhibitors/T/tombstone"],["“Sweet Coffin, TOMBSTONE Extrait de Parfum.” *Scentissime*, scentissime.com. Accessed 7 Nov. 2026.","https://www.scentissime.com/en/1223-sweet-coffin-3760302981212.html"]]}},{"id":"tan-shuai","name":"Tan Shuai","sort":"Tan","about":["Named by Tombstone as the perfumer of No Need to Come by, a gourmand-leather perfume he made of soft, warm notes set against hard, cool ones."],"bio":{"t":["Tan Shuai is named by Tombstone as the perfumer of No Need to Come By. Tan Shuai sees death, the house says, as a one-way adventure with no return, embracing solitude without the need for visits or tributes, and he composed the perfume, a gourmand leather, by setting soft, warm notes against hard, cool ones — mint, thyme, pepper and turpentine over myrrh, frankincense and jasmine, on patchouli, tonka and sandalwood.","Nothing more about him was found in the sources read."],"s":[["“No Need to Come by.” *Tombstone*, tombstonefragrances.shop. Accessed 7 Nov. 2026.","https://tombstonefragrances.shop/products/no-need-to-come-by-1"],["“No Need to Come By (2024), Tombstone.” *ScentAdvice*, scentadvice.com. Accessed 7 Nov. 2026.","https://scentadvice.com/no-need-to-come-by-2024-tombstone/"]]}},{"id":"yenchi-lin","name":"Yenchi Lin","sort":"Lin","from":"Taiwan","about":["A Taiwanese perfumer trained in Grasse, who composes perfumes as one writes intimate narratives, drawing on her childhood in Kaohsiung.","Tombstone gives her Sing at My Funeral, a funeral pictured with a light spirit."],"bio":{"t":["Yenchi Lin is a Taiwanese perfumer trained in Grasse, who composes perfumes as one writes intimate narratives, drawing on her childhood in Kaohsiung. Her The Hometown in Me, after the house she grew up in there, won the mAPA award for artistic perfume in 2023.","For Tombstone she made Sing at My Funeral: in her imagination, the house says, her funeral has a light spirit and a joyful air."],"s":[["“Sing at My Funeral, TOMBSTONE Extrait de Parfum.” *Scentissime*, scentissime.com. Accessed 7 Nov. 2026.","https://www.scentissime.com/en/1225-sing-at-my-funeral-3760302981229.html"],["“Sing at My Funeral.” *Tombstone*, tombstonefragrances.shop. Accessed 7 Nov. 2026.","https://tombstonefragrances.shop/products/sing-at-my-funeral-1"],["“The Hometown in Me.” *Fraganty*, fraganty.ai. Accessed 7 Nov. 2026.","https://fraganty.ai/perfume/the-hometown-in-me"]]}},{"id":"diandra-barsalou","name":"Diandra Barsalou","sort":"Barsalou","from":"United States","about":["Creative director and co-founder of Tale Parfum.","Named by Sainte Cellier as the perfumer of Rouse."],"bio":{"t":["Diandra Barsalou is the creative director of Tale Parfum, which she founded with the screenwriter and perfumer Chad Hodge. The house composes each perfume as a chapter in an evolving story.","Sainte Cellier names her as the perfumer of Rouse. Nothing more about her was found in the sources read."],"s":[["“Tale Parfum.” *Sainte Cellier*, saintecellier.com. Accessed 7 Nov. 2026.","https://saintecellier.com/collections/tale-parfum"],["“Rouse.” *Sainte Cellier*, saintecellier.com. Accessed 7 Nov. 2026.","https://saintecellier.com/products/rouse"],["“Tale Parfum Bad Lily (Michael Nordstrand) 2024.” *Ça Fleure Bon*, cafleurebon.com. Accessed 2 Nov. 2026.","https://cafleurebon.com/tale-parfum-bad-lily-michael-nordstrand-2024-plus-surreal-muget-giveaway/"]]}},{"id":"vera-nicchia","name":"Vera Nicchia","sort":"Nicchia","about":["Named by Profumix as the nose of Casa Goa's Velvet Fog."],"bio":{"t":["Vera Nicchia is named by Profumix as the nose of Casa Goa's Velvet Fog, which the retailer calls the perfume that paved the way for the house's others.","Nothing more about her was found in the sources read."],"s":[["“Home Goa Velvet Fog 50ml Eau de Parfum.” *Profumix Luxury Brands*, profumixluxurybrands.it. Accessed 7 Nov. 2026.","https://www.profumixluxurybrands.it/en/?p=103693"],["“Velvet Fog – 50ml.” *Spezieri*, spezieri.com. Accessed 2 Nov. 2026.","https://spezieri.com/en/velvet-fog-50-ml-casa-goa"]]}},{"id":"not-found","name":"Perfumer not found","sort":"￿","about":["These perfumes are written about on this site, but no source found names who made them. When one is found, the perfume moves to its perfumer."]}],"houses":[{"id":"pineward","name":"Pineward","from":"United States","founded":"2020","about":"Founded in Colorado in 2020 by the self-taught perfumer Nicholas Nilsson.","site":1},{"id":"apoteker-tepe","name":"Apoteker Tepe","from":"United States","founded":"2014","about":"Founded in 2014 by Holladay Penick Saltz, who ran it until 2018; acquired in 2022 by Nicholas Nilsson of Pineward, who revived it.","site":1},{"id":"adar","name":"ADAR","from":"Romania","about":"A European house with Romanian roots whose own perfumers are Dan and Roxana Adar; its first public collection came out in 2025.","site":1},{"id":"almost-human","name":"Almost Human","from":"Romania","founded":"2025","about":"Founded in 2025 by its perfumer and creative director, Goran Bajazetov; its first collection came out in 2026.","site":1},{"id":"ataraxia","name":"Ataraxia","about":"A house of gothic, avant-garde scents; Tudor Ristea is its creative director.","site":1},{"id":"grande-parfums","name":"Grande Parfums","from":"Romania","founded":"2021","about":"Grande Perfumes, of Bucharest, created in 2021 by Alex Marian. No source found names the perfumer of its perfumes.","site":1},{"id":"les-abstraits","name":"Les Abstraits","about":"Founded by the fragrance critic and YouTuber Eugen Nizic; every one of its perfumes is made with Antoine Lie.","site":1},{"id":"tale-parfums","name":"Tale Parfums","from":"United States","about":"Founded in Los Angeles by the screenwriter Chad Hodge and the creative director Diandra Barsalou.","site":1},{"id":"tombstone","name":"Tombstone","about":"A house about death and living, each bottle shaped as a tombstone; marketed by Wonder Senses. No source found names its perfumer.","site":1},{"id":"qimu-musicians","name":"Qimu & Musicians","about":"A perfume for each player in a band. WhatScent names Qimu as the perfumer of Drummer.","site":1},{"id":"om-parfums","name":"Om Parfums","from":"Taiwan","founded":"2021","about":"OM Parfum, founded in 2021 by Aichi Liu, its only perfumer.","site":1},{"id":"outsider-parfums","name":"Outsider Parfums","about":"Outsider Parfum, made by Aichi Liu and marketed by OM Parfum.","site":1},{"id":"lost-tribe","name":"Lost Tribe","from":"United States","founded":"2022","about":"Founded in New York City in 2022 by Mathew Schmuelian; all-natural perfumes, made by hand.","site":1},{"id":"serge-lutens","name":"Serge Lutens","from":"France","founded":"2000","about":"Parfums-Beauté Serge Lutens, his own house since 2000, its perfumes made with Christopher Sheldrake.","site":0},{"id":"dior","name":"Dior","from":"France","founded":"1947","about":"Christian Dior's first perfume, Miss Dior, came out with his first collection in 1947.","site":0},{"id":"ramon-monegal","name":"Ramón Monegal","from":"Spain","founded":"2009","about":"Founded in 2009 by Ramón Monegal, under his own name.","site":0},{"id":"mancera","name":"Mancera","from":"France","founded":"2008","about":"Founded in 2008 by Pierre Montale, with his daughter Amélie as its artistic director since 2017.","site":0},{"id":"casa-goa","name":"Casa Goa","about":"No source found names who makes its perfumes.","site":0},{"id":"matca","name":"Matca","about":"No source found names who makes its perfumes.","site":0},{"id":"lussur","name":"Lussur","from":"Italy","about":"An Italian house from Modena, founded by Lucas Chemelli. No source found names the perfumer of CV99.","site":0},{"id":"jmp-artisan-perfumes","name":"JMP Artisan Perfumes","from":"Poland","about":"The house of the Polish independent perfumer Jakub Pietrynka.","site":0},{"id":"sultan-pasha-perfumes","name":"Sultan Pasha Perfumes","about":"The house of the perfumer Sultan Pasha.","site":0},{"id":"areej-le-dore","name":"Areej Le Doré","from":"Indonesia","founded":"2017","about":"Founded in Thailand in 2017 by the distiller Russian Adam; now based in Indonesia.","site":0},{"id":"slumberhouse","name":"Slumberhouse","from":"United States","about":"Josh Lobb's house, in Portland, Oregon.","site":0},{"id":"strangers-parfumerie","name":"Strangers Parfumerie","from":"Thailand","founded":"2017","about":"Founded in 2017 by Prin Lomros; the line closest to his own life.","site":0},{"id":"parfum-prissana","name":"Parfum Prissana","from":"Thailand","founded":"2018","about":"Founded in 2018 by Prin Lomros and named after his sister; Asian history, cuisine and myth in classic structures.","site":0},{"id":"prin","name":"PRIN","from":"Thailand","founded":"2019","about":"Founded in 2019 by Prin Lomros; his signature line.","site":0}],"perfumes":[["Bindebole",[0],0,2021,0,1,[0]],["Boreal",[0],0,2020,0,1,[0]],["Brokilän",[0],0,2021,0,1,[0]],["Cotswold",[0],0,2021,0,1,[0]],["Eldritch",[0],0,2021,0,1,[0]],["Fanghorn II",[0],0,2021,0,1,[0]],["Funerie",[0],0,2022,0,1,[0]],["Juniperus",[0],0,2024,0,1,[0]],["Murkwood",[0],0,2020,0,1,[0]],["Nocturnis",[0],0,2022,0,1,[0]],["Oxylus",[0],0,2021,0,1,[0]],["Snoqualmie",[0],0,2024,0,1,[0]],["Sturbridge",[0],0,2023,0,1,[0]],["White Fir",[0],0,2022,0,1,[0]],["Bucolic",[0],0,2024,0,1,[0]],["Hayloft",[0],0,2022,0,1,[0]],["Hayride",[0],0,2022,0,1,[0]],["Pastoral",[0],0,2022,0,1,[0]],["Shire",[0],0,2024,0,1,[0]],["Steading",[0],0,2020,0,1,[0]],["Christmas Wine",[0],0,2020,0,1,[0]],["Gingerbread",[0],0,2023,0,1,[0]],["Glühwein",[0],0,2021,0,1,[0]],["Revelries",[0],0,2021,0,1,[0]],["Acadian",[0],0,2023,0,1,[0]],["Coastal Veil",[0],0,2023,0,1,[0]],["Gingermoss",[0],0,2023,0,1,[0]],["Subalpine",[0],0,2025,0,1,[0]],["Akero",[0],0,2023,0,1,[0]],["Apple Tabac",[0],0,2020,0,1,[0]],["Caravansary",[0],0,2023,0,1,[0]],["Clemenpine",[0],0,2023,0,1,[0]],["Coffee Tabac",[0],0,2024,0,1,[0]],["Delfiño",[0],0,2022,0,1,[0]],["Greymist",[0],0,2023,0,1,[0]],["Gristmill",[0],0,2022,0,1,[0]],["Holy Cross",[0],0,2026,0,1,[0]],["Icefall",[0],0,2021,0,1,[0]],["Ivymoss",[0],0,2023,0,1,[0]],["Lime Cola",[0],0,2025,0,1,[0]],["Meadowmoss",[0],0,2023,0,1,[0]],["Mint Cocoa",[0],0,2024,0,1,[0]],["Noki",[0],0,2022,0,1,[0]],["Ponderosa",[0],0,2022,0,1,[0]],["Pumpkivus",[0],0,2025,0,1,[0]],["Tome",[0],0,2025,0,1,[0]],["Treacle",[0],0,2021,0,1,[0]],["Velvetine",[0],0,2021,0,1,[0]],["Amber Zero",[23],0,0,2,1,[1,2,2]],["Aetherialism",[24],0,0,2,1,[1,2,2]],["Incantu",[24],0,0,2,1,[1,2,2]],["Against All Odds",[1],1,2025,2,1,[1,2,2,0]],["α11 Alpha11",[25],0,0,2,1,[1,2,2]],["Alta Luna",[25],0,2025,2,1,[1,2,2,2]],["ADHD",[24],0,0,2,1,[1,2,2]],["Root Code",[23],0,0,2,1,[1,2,2]],["Lignum Dei",[23],0,0,2,1,[1,2,2]],["Lithos Diaphanes Λίθος Διαφανές",[1],1,0,2,1,[1,2,2]],["Tyrian",[24],0,2026,2,1,[3,2]],["Burning Bridges",[2],0,2026,3,1,[0]],["Dear Future",[2],0,2026,3,1,[0]],["Desert Hope",[2],0,2026,3,1,[0]],["Ritual Code",[2],0,2026,3,1,[0,3]],["Silent Rain",[2],0,2026,3,1,[0]],["Amaretto Jazz in the Melting Room",[3],0,2024,4,1,[4]],["Deity",[4],0,2025,4,1,[5]],["My Doll’s Makeup",[4],0,0,4,1,[6,7]],["Spinal Fluid",[4],0,2025,4,1,[6,0,8]],["Vestibule",[3],0,2024,4,1,[9]],["5 Years Anniversary",[31],2,0,5,1,[10]],["Ambresso",[31],2,0,5,1,[10]],["Ancient Oud",[31],2,0,5,1,[10]],["Choco Powder",[31],2,0,5,1,[10]],["Cookie something (?)",[31],2,0,5,1,[10]],["Cuore",[31],2,2024,5,1,[0,10]],["Dreaming Maldives",[31],2,0,5,1,[10]],["Giardino di Sorrento",[31],2,0,5,1,[10]],["Hot Stuff",[31],2,0,5,1,[10]],["Intimate Spell",[31],2,0,5,1,[10]],["Karak & Shisha",[31],2,0,5,1,[10]],["Mystical Incense",[31],2,0,5,1,[10]],["Vanilla Ash",[31],2,0,5,1,[10]],["Vintage Memoir",[31],2,0,5,1,[10]],["White Label",[31],2,0,5,1,[10]],["Belle Âme",[5],0,2022,6,1,[11,11]],["Des Cendres",[5],0,2023,6,1,[11,11]],["La Douleur Exquise",[5],0,2022,6,1,[12,11]],["Philosopher’s Walk",[5],0,2025,6,1,[11,11]],["Kong",[10],1,0,12,1,[13,14]],["Watch King",[10],1,0,12,1,[13,14]],["Dirty Soda",[10],1,0,12,1,[13,14]],["Equatorial",[10],1,0,12,1,[13,14]],["Santal Absolu",[10],1,0,12,1,[13,14]],["Pan’s Labyrinth",[10,11],0,0,12,1,[15]],["Nymphaea Caerulea",[9],1,0,10,1,[0,0]],["Lust",[9],0,2023,10,1,[16,0,0,0]],["Burnana",[9],0,2024,10,1,[16,0,0,0]],["Cannabis Café",[9],1,0,10,1,[0,0]],["Dark Night of the Soul",[9],0,2024,10,1,[16,0,0,0]],["This Too Shall Pass",[9],0,0,10,1,[16,0,0]],["When the Linden Blooms",[9],0,2024,10,1,[16,0,0,0]],["Oud de Pasión",[9],1,0,10,1,[0,0]],["Smoke Oud",[9],1,0,10,1,[0,0]],["Dragon’s Breath",[9],0,2026,11,1,[0]],["Draco",[9],1,0,11,1,[0,0]],["Xocolate Crotch",[9],1,0,11,1,[0,0]],["Guilty as Charged",[9],1,0,11,1,[0,0]],["Amaretto Coffee",[9],0,0,11,1,[0]],["Guitarist",[31],2,0,9,1,[9]],["Vocal",[31],2,0,9,1,[9]],["Bassist",[31],2,0,9,1,[9]],["Drummer",[8],0,0,9,1,[9]],["Bad Lily",[6],0,2024,7,1,[0,5]],["Fleurt",[7],0,2024,7,1,[11,14]],["Rouse",[29],0,0,7,1,[11,14]],["Water Me",[7],0,0,7,1,[5]],["3 Feet 5",[26],0,2024,8,1,[17,0]],["Evergrow",[31],2,2025,8,1,[18,0]],["No Need to Come By",[27],0,0,8,1,[18,19]],["Sing at My Funeral",[28],0,0,8,1,[17,18,19]],["Sweet Coffin",[26],0,2024,8,1,[17,18,0]],["Kogen",[31],2,2024,1,1,[0,0]],["The Holy Mountain",[12],0,2015,1,1,[0,20]],["Karasu",[12],0,2016,1,1,[0,20]],["The Peradam",[12],0,2015,1,1,[0,20]],["Pale Fire",[12],0,2016,1,1,[0,20]],["Anabasis",[12],0,2015,1,1,[0,20]],["After the Flood",[12],0,2015,1,1,[0,20]],["Brother Night",[12],0,2016,1,1,[0,21,21,0]],["CV99",[31],2,0,19,0,[21]],["De Profundis",[13],0,2011,13,0,[22]],["Haxan",[22],0,2018,25,0,[0]],["Tobacolor",[14],0,2021,14,0,[23]],["Flamenco EDP",[15],0,2017,15,0,[24]],["French Riviera",[16],0,2022,16,0,[13]],["Velvet Fog",[30],0,0,17,0,[25,26]],["House of Ellixirz",[31],2,2021,18,0,[27]],["Fir of the Light",[17],0,0,20,0,[0]],["Fir of the Dark",[17],0,2024,20,0,[0]],["Quintessentially Amber",[18,19],0,2025,21,0,[9]],["Forbidden Flower",[20],0,2024,22,0,[28]],["Ore",[21],0,2009,23,0,[5,29]],["Salted Green Mango",[22],0,2019,24,2,[0]],["Oliver",[22],0,2018,24,2,[0]],["Cigar Rum",[22],0,2017,24,2,[0]],["SM Café",[22],0,2019,24,2,[0]],["Burning Ben",[22],0,2018,24,2,[0]],["Sweet Farewell",[22],0,2022,24,2,[0]],["Gheorghe",[22],0,2018,24,2,[0]],["Sweet Celestials",[22],0,2023,24,2,[0]],["Muscat Jasmine Tea",[22],0,2024,24,2,[0]],["Scotch Peat",[22],0,2019,24,2,[0]],["Sangre Dulce",[22],0,2019,24,2,[0]],["Aroon Sawat",[22],0,2019,24,2,[0]],["Red Lime Soda",[22],0,2024,24,2,[0]],["Sombre",[22],0,2019,24,2,[0]],["Cherry Amaretto",[22],0,2023,24,2,[0]],["Kira Kira",[22],0,2020,24,2,[0]],["Les Mauvais Garçons",[22],0,2019,24,2,[0]],["Comme un Carrousel",[22],0,2020,24,2,[0]],["Caffeine Honey",[22],0,2020,24,2,[0]],["Spring Ambience",[22],0,2023,24,2,[0]],["A Sorta Fairytale in Hyde Park",[22],0,2021,24,2,[0]],["Roasted Coffee Cigarette Whisky Come and Get Your Suede Honey Baby",[22],0,2020,24,2,[0]],["Wicked John",[22],0,2019,24,2,[0]],["Yuzu Soda",[22],0,2021,24,2,[0]],["Yue Tu 月兔",[22],0,2023,24,2,[0]],["Limonsitano",[22],0,2022,24,2,[0]],["Tokiwa",[22],0,2025,24,2,[0]],["Ember",[22],0,2017,24,2,[0]],["Autumn Tea and Yuzu Vanilla",[22],0,2021,24,2,[0]],["Fume Ma Peau",[22],0,2017,24,2,[0]],["Magenta Pop",[22],0,2020,24,2,[0]],["Euphories",[22],0,2021,24,2,[0]],["Summer Peaches by the Tea Room",[22],0,2021,24,2,[0]],["Concrete Forest",[22],0,2023,24,2,[0]],["Iridescent Sky",[22],0,2020,24,2,[0]],["Lumberjack Cologne",[22],0,2019,24,2,[0]],["Rêve du Matin",[22],0,2023,24,2,[0]],["Eternal Summer",[22],0,2020,24,2,[0]],["Pink Clouds",[22],0,2025,24,2,[0]],["Sweet Tani",[22],0,2025,24,2,[0]],["Fleur de Lune",[22],0,2020,24,2,[0]],["Sweet Muskmelon",[22],0,2023,24,2,[0]],["Virginia",[22],0,2018,24,2,[0]],["Chokedee",[22],0,2021,24,2,[0]],["Cigar Rum Intense",[22],0,2019,24,2,[0]],["San Clemente",[22],0,2018,24,2,[0]],["À la folie",[22],0,2023,24,2,[0]],["Cachouli",[22],0,2022,24,2,[0]],["Cigar Rum (2024)",[22],0,2024,24,2,[0]],["Guido",[22],0,2024,24,2,[0]],["Rosa Raimunda",[22],0,2024,24,2,[0]],["So Fetch!",[22],0,2019,24,2,[0]],["Plunge",[22],0,2021,24,2,[0]],["Soleil de Thé",[22],0,2024,24,2,[0]],["Green Lunar",[22],0,2023,24,2,[0]],["Lights upon Orange Tree",[22],0,2021,24,2,[0]],["Lava Rose",[22],0,2019,24,2,[0]],["Câlin d'Été",[22],0,2025,24,2,[0]],["Cornwall Rose",[22],0,2025,24,2,[0]],["Punk #2077",[22],0,2021,24,2,[0]],["Rosso Amaretto",[22],0,2023,24,2,[0]],["Garden of Eden",[22],0,2023,24,2,[0]],["Maia",[22],0,2017,24,2,[0]],["La Malila",[22],0,2017,24,2,[0]],["Lom Hom Khao Hom",[22],0,2023,24,2,[0]],["Nobles '17",[22],0,2021,24,2,[0]],["La Porte",[22],0,2023,24,2,[0]],["Ma Nishtana",[22],0,2019,25,2,[0]],["Nimitr",[22],0,2018,25,2,[0]],["Nesnás Qareen",[22],0,2019,25,2,[0]],["Natsumeku",[22],0,2019,25,2,[0]],["Sahar",[22],0,2024,25,2,[0]],["Mohragot",[22],0,2019,25,2,[0]],["Dunhuang",[22],0,2022,25,2,[0]],["Chetyre",[22],0,0,25,2,[0]],["Tom Yum",[22],0,2019,25,2,[0]],["Mandarava",[22],0,2019,25,2,[0]],["Thichila",[22],0,2019,25,2,[0]],["Akhetaten",[22],0,2024,25,2,[0]],["Lágrima Sagrada",[22],0,2025,25,2,[0]],["Ayutthaya",[22],0,2022,25,2,[0]],["Maruyama 丸山",[22],0,2019,25,2,[0]],["Nefer",[22],0,0,25,2,[0]],["Le Cirque Bleu",[22],0,2017,25,2,[0]],["Savitri สาวิตรี",[22],0,0,25,2,[0]],["Karuna",[22],0,2022,25,2,[0]],["Tirtha",[22],0,2024,25,2,[0]],["Hayra",[22],0,0,25,2,[0]],["Hirun",[22],0,2024,25,2,[0]],["Ronda",[22],0,2024,25,2,[0]],["Emerald Curry",[22],0,2025,25,2,[0]],["Vallée des Roses",[22],0,0,25,2,[0]],["L'Ombre d'Hier",[22],0,2025,25,2,[0]],["Gularb Matana",[22],0,2024,25,2,[0]],["Keerati",[22],0,2025,25,2,[0]],["Apsarah",[22],0,2018,25,2,[0]],["Narasimha Attar",[22],0,2019,25,2,[0]],["Narasimha Extrait de Parfum",[22],0,0,25,2,[0]],["Mriga มฤค",[22],0,0,26,2,[0]],["Saringkarn ศฤงคาร",[22],0,2020,26,2,[0]],["Mandodari มณโฑ",[22],0,2019,26,2,[0]],["Varuek วฤค",[22],0,2021,26,2,[0]],["Nocturnal Poetry",[22],0,2020,26,2,[0]],["Mongolian Mriga",[22],0,2023,26,2,[0]],["Homa",[22],0,2020,26,2,[0]],["Indigo Night",[22],0,2024,26,2,[0]],["Aran",[22],0,2019,26,2,[0]],["Anatolia Anatolia",[22],0,2021,26,2,[0]],["Arsalan",[22],0,2020,26,2,[0]],["Ganja Kasturi",[22],0,2021,26,2,[0]],["Eshu",[22],0,2020,26,2,[0]],["Oqachol",[22],0,2022,26,2,[0]],["Onthamara",[22],0,2022,26,2,[0]],["Rahassanai",[22],0,2022,26,2,[0]],["Burmite Honey",[22],0,2023,26,2,[0]],["Anatolia",[22],0,2019,26,2,[0]],["Mandodari Mandodari",[22],0,2023,26,2,[0]],["Nilmalee",[22],0,2023,26,2,[0]],["Krissana",[22],0,2023,26,2,[0]],["Rattikarn รัตติกาล",[22],0,2023,26,2,[0]],["Fantôme de la Nuit",[22],0,2024,26,2,[0]],["Kheerin คีรินทร์",[22],0,2025,26,2,[0]],["Nisatiruk นิศาทิรุกข์",[22],0,2025,26,2,[0]],["Naruemit",[22],0,2023,26,2,[0]],["Hürrem Sultan",[22],0,2024,26,2,[0]],["0125",[22],0,2025,26,2,[0]],["Saringkarn Saringkarn",[22],0,2025,26,2,[0]],["Loup",[22],0,2023,26,2,[0]],["Ahuizotl",[22],0,2022,26,2,[0]],["Pathavi",[22],0,2025,26,2,[0]],["Nilubol",[22],0,2023,26,2,[0]],["Sgàil",[22],0,2025,26,2,[0]],["Persephone",[22],0,2025,26,2,[0]],["0225 ๐๒๒๕",[22],0,2025,26,2,[0]],["Prajñā",[22],0,2026,26,2,[0]],["Moha",[22],0,2026,26,2,[0]],["Dveṣa",[22],0,2026,26,2,[0]],["Rāga",[22],0,2026,26,2,[0]]],"sources":["Parfumo","ADAR","Scent Split","The Perfumery Barcelona","ScentAdvice","Ça Fleure Bon","Ataraxia Perfumery","Thingtesting","Turin, Luca","WhatScent","OnCosmetics","Sainte Cellier","Noah","Scent Verdict","Stéle","Venba Fragrance","The Scent Base","Scentissime","Tombstone","Pitti Fragranze","The Taste of Aldehydes","Basenotes","Surrender to Chance","Scento","Now Smell This","Profumix Luxury Brands","Spezieri","Fragplace","Fragrance Samples UK","Luckyscent"]};
const NOTES = {"names":["Bergamot","Lemon","Orange","Citrus","Lime","Blood Orange","Clementine","Grapefruit","Yuzu","Bitter Orange","Petitgrain","Citron","Green Mandarin","Tangerine","Lavender","Mint","Clary Sage","Rosemary","Sage","Chamomile","Juniper Berry","Thyme","Eucalyptus","Myrtle","Shiso","Angelica Root","Artemisia","Basil","Davana","Dittany of Crete","Herbal Notes","Hops","Huang Qi","Kuromoji","Lemon Verbena","Marjoram","Mint-Sandalwood Co-Distillation","Oregano","Wormwood","Yarrow","Hay","Galbanum","Violet Leaf","Poplar Bud","Sweetgrass","Tomato Leaf","Cannabis","Grass","Green Notes","Ivy","Raspberry Leaf","Sugar Cane","Corn Silage","Corn Silk","Crushed Leaves","Fig Leaf","Green Wheat","Pea","Rhubarb","Sweet Vernalgrass","Watercress","Rose","Jasmine","Orris","Lily of the Valley","Neroli","Orange Blossom","Ylang Ylang","Geranium","Osmanthus","Tuberose","Gardenia","Heliotrope","Violet","Carnation","Waterlily","Bluebell","Champaca","Lily","Linden Blossom","Marigold","Mimosa","Tiare Flower","Alpine Sandwort","Azure Bluet","Chrysanthemum","Clear Orchid","Freesia","Goldenrod","Green Tea Flowers","Honeysuckle","Jonquil","Lilac","Magnolia","Mountain Wildflowers","Nectar","Night Blooming Jasmine","Passionflower","Plum Blossom","Pollen","Snowdrops","Tobacco Flower","White Lotus","Yellow Flowers","Cherry","Raspberry","Dried Fruits","Plum","Apple","Apricot","Peach","Pear","Strawberry","Banana","Blackberry","Cranberry","Dates","Green Apple","Litchi","Mango","Passionfruit","Blueberry","Cassis","Fig","Fruity Notes","Goldenberry","Guava","Japanese Plum","Maninka","Quince","Red Berries","Scorched Pineapple","Clove","Saffron","Cinnamon","Ginger","Black Pepper","Nutmeg","Spices","Pink Pepper","Cardamom","Coriander","Turmeric","Allspice","Anise","Cassia","Cumin","Caraway","Chilli","Fenugreek","Paprika","Sichuan Pepper","Wasabi","Water Pepper","Vanilla","Tobacco","Tonka","Honey","Cacao","Chocolate","Beeswax","Almond","Brown Sugar","Caramel","Hazelnut","Milk","Butter","Oat","Wheat","Baked Apple","Black Walnut","Bread","Butterscotch","Chocolate Cake","Cocoa Butter","Coumarin","Molasses","Balsamic Vinegar","Barley","Carob Pods","Chantilly Cream","Cheese","Cocoa Pod","Coconut Milk","Condensed Milk","Cream","Dulce de Leche","Edamame","Halva","Holy Bread","Honeycomb","Icing","Malt","Maple","Murumuru Butter","Pistachio","Popcorn","Potato","Pumpkin","Raisin Cookies","Rice","Seed Cake","Sugar","Toffee","Rum","Coffee","Tea","Whiskey","Cognac","Maté","Amaretto","Green Tea","Lapsang Souchong","Liquor","Absinthe","Cocktail Accord","Cola","Herbal Tea","Jasmine Tea","Masala Chai","Moroccan Tea","Oolong Tea","Root Beer","Soda Bubbles","Sparkling Water","Cedarwood","Sandalwood","Patchouli","Vetiver","Oud","Guaiac Wood","Woody Notes","Cashmeran","Oak","Cypriol","Birch","Amberwood","Amyris","Mahogany","Amber Oud","Bark","Buddhawood","Cabreuva","Edelwood Oil","Iso E Super","Moldy Cedarwood","Muhuhu","Oak Barrel","Papyrus","Petrified Driftwood","Pineboard","Sawdust","Siam Wood","Teak Wood","Willow Bark","Fir","Pine","Pine Needles","Juniper","Cypress","Spruce","Hinoki","Black Hemlock","Cedar Leaf","Hiba","Larch Cones","Nootka","Snoqualmie Forest Evergreens","Tamarack","Amber","Benzoin","Labdanum","Frankincense","Myrrh","Incense","Resins","Opoponax","Peru Balsam","Tolu Balsam","Styrax","Bakhoor","Elemi","Sandarac","Balsam","Bushman Candle Resin","Copaiba Balsam","Copal","Dragon's Blood","Ponderosa Resin","Propolis","Rum Resin","Sawn Resin","Turpentine","Musk","Ambergris","Leather","Castoreum","Civet","Ambrette","Costus","Suede","Animal Notes","Skin","Botanical Musk","Goat Hair","Hyrax","Lanolin","Sheep Wool","Skunk Oil","Oakmoss","Soil","Moss","Mushroom","Cedarmoss","Dust","Lichen","Mineral Accord","Peat","Spikenard","Treemoss","Concrete","Damp Vegetation","Evernyl","Lava","Metallic Notes","Petrichor","Sand","Swamp Water","Wet Stone","Seaweed","Airy Note","Aquatic Notes","Marine Accord","Ozone","Sea Salt","Solar Notes","Aldehydes","Clear Skies","Cold Night Air","Dead Water","Rain Notes","Sea Water","Steam","Smoke","Birch Tar","Cade Oil","Ash","Fire","Gasoline","Palo Santo","Pine Smoke","Pine Tar","Smouldering Logs","Candle Wax","CO2 Extracts","Aged Parchment","Paper","Blush","Decayed Rose","Dried Blood","Dusty Antiques","Dusty Sofa","Eye Pencil","Gold","Instant Film","Lip Gloss","Lipstick","Makeup Palette","Mousse de Saxe","Old Books","Oriental Notes","Porcelain","Powder Accord","Rotten Flesh","Salty Tears","Spinal Fluid","Underground Tunnel","Velvet","Westfarthing Leaf"],"accord":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],"accords":[["CIT","Citrus"],["ARO","Aromatic & Herbal"],["GRN","Green"],["FLO","Floral"],["FRU","Fruit"],["SPI","Spice"],["GOU","Gourmand"],["BRW","Brews & Spirits"],["WOO","Woods"],["CON","Conifers"],["RES","Resins & Balsams"],["ANI","Musk, Skin & Animalic"],["EAR","Earth, Moss & Mineral"],["AIR","Water & Air"],["SMK","Smoke & Char"],["IMP","Impressions"]],"of":{"0":[43,3,257,298,54,225],"1":[257,15,225,275,311],"2":[262,265,282,255,226,229],"3":[225,343,233,257,154],"4":[295,273,227,255,221,276,343,257,18,309],"5":[255,311,315,257,310,321],"6":[312,358,295,155,343,250,274,276,225,257,229],"7":[1,258,17,14,20,226,227],"8":[255,262,212,311,274,273],"9":[256,258,0,74,68,19,40,155,255,14,269,228,226,309,227],"10":[257,258,228,23,310,327],"11":[282,268,283,267],"12":[169,256,272,255,138,275,273,225,269,318,294,43],"13":[2,255,256,135,132,293,309,144,228],"14":[307,306,105,14,157,162,269,160,44],"15":[40,157,167,168,164,161,14,47,133],"16":[40,158,154,59,44,171,137,140,318,106,156,309],"17":[109,114,157,289,160,44,40,168,167,228,209,309],"18":[40,167,164,0,14,217,378,201,62,63,157],"19":[160,155,40,193,178,31,317,257,43],"20":[115,137,255,107,132,5],"21":[135,134,132,137,168,176,162,170,165,166,154,191],"22":[115,77,104,105,255,159,28,309,278,61,226,272],"23":[132,204,134,229,164],"24":[8,0,20,49,22,75,88,72,329,225,309],"25":[20,258,341,329,259,312,153,22,294,226],"26":[135,65,0,5,225,17,295,309],"27":[255,0,136,263,226,228,298,311],"28":[117,270,227,226,225],"29":[108,155,255,290,106],"30":[255,260,206,343,19,274,293,14,154,309],"31":[300,295,6,155,294,256,133,120,5,255,226,225,62,102],"32":[205,155,225,227,275,138,272,230,154],"33":[6,258,45,228,226,294],"34":[255,256,11,155,303,228],"35":[225,251,352,243,269,170,238,271],"36":[258,328,293,298,76,315,60,39,256],"37":[259,7,258,266,329,256,225,226],"38":[49,211,15,4,34,75,259,256,225,309,319,313],"39":[4,104,135,204,216,65,9,202,154,137,141,134],"40":[309,83,47,56,66,255,45,84,94],"41":[159,15,227,154,138,275,192,225],"42":[15,119,118,294,122,58,226],"43":[288,257,225,154,112,134,172,160,199],"44":[198,162,228,69,225,226,227,40,310,53,52,229],"45":[355,356,295,155,206,226,225,63,200,298,205,309,234],"46":[155,212,176,157,106],"47":[294,259,154,132,271,255,287,226,293,368],"48":[55,135,333,133,69,316,269,228,275,294],"49":[41,4,42,332,67,65,273,16,228,225,156,295],"50":[90,179,334,157,155,353,239,161,249],"51":[229,62,9,226,294],"52":[113,15,133,70,62,67,155,274,156,297],"53":[293,331,175,154,72,3,66],"54":[139,8,129,214,133,89,104,194,273,156,128],"55":[0,136,257,325,86,316,227,61,269,349,309],"56":[338,272,225,291,311,61,229,273,355,302],"58":[159,344,16,157,294],"59":[231,343,138,3],"60":[333,302,269],"61":[326,275,335,314,231,61],"62":[275,346,343,301,30,310],"63":[310,340,320,48,330,335],"64":[210,189,213,157,353,159,208,161,361,97,174,190,154,155,171,104,314,158,164,166],"65":[157,127,104,180,125,184,155,174,160,100,272,271,158,154,156,269,270,281,273,363,227,116,95,159],"66":[371,366,63,105,223,357,377,353,159,367,365,362,364,273],"67":[273,80,61,234,40,344,329,146,70,342,347,374,348,373,359,375,346,337,76],"68":[159,138,360,148,173,152,99,142,222,182,187,195,369,188,197],"69":[105,139,51,134,133,132,159,67,208,300,157,229,233,295,293,277,156,225,271,154,270,155,226,228],"70":[205,143,273,204,208,155,160,106,23,61,137,64,225,271,275,270,269,296,154,278,277,227,230,156,294,276,226,293],"71":[229,270,293,354],"72":[133,104,158,159,69,62,61,226,154,236],"74":[274,138,63,130,6,133,2,114,106,121,213,107,98,51,203,64,112,273,123,82,134,61,62,255,269,156,154,230,276,296,271,270,253,225,293,227],"75":[1,111,110,139,103,87,163,64,154,293,225,273],"76":[5,7,1,64,50,65,70,93,62,61,232,269,227,156,154,293],"77":[131,155,169,156,228,309,160],"78":[0,66,17,132,234,68,225,227,228,293,271,270,230,237],"79":[277,112,105,206,134,155,108,132,240,61,140,106,133,294,271,219,293,296,229,160,154,156,269,101],"80":[272,354,118,224,116,61,269,293],"81":[162,50,138,204,154,230,72,64,296,156,149,293,272],"82":[218,110,1,0,63,42,62,67,68,70,61,74,71,293,294,226,132,228,154,309,270,297,227,278,156,225,271],"83":[66,12,111,126,135,354,119,220,64,231,105,2,293],"84":[63,135,158,272,140,156,293,226],"85":[351,41,344,15,132,295,42,70,309,305,228,227],"86":[61,63,272,132,146,133,296,227,225,271,276,273],"87":[0,1,65,66,139,140,132,134,26,258,68,16,74,73,14,313,228,227,299,293,270,156,154],"89":[229,274,270,154,269,295,61,143,277,156],"90":[4,2,0,139,145,141,65,132,229,154,156,270,227,226,225],"91":[272,14,0,10,139,294,255,259,227,260,258,16,36,293,229,309,225,228,21,280,15,226,274],"92":[226,299,14,63,61,67,270,154],"93":[0,61,372,161,294,14,175,67,227,226,293,229,309,319,255,271,280],"95":[204,104,207,144,155,227,225,270,278,309,232,242,271,163,300,301,247,233],"96":[113,108,343,272,279,345,285,376,45,124,269,230,228,231,270,69,32,229,160,309,297,296],"98":[158,229,296,150,165,297,261,237,107,62,166,63,230,233,151,226,227,181,154,309,91,269,1,225],"99":[270,109,110,172,15,158,229,228,79,71,77,183,226,227,155],"100":[0,79,62,109,92,211,69,241,226,16,209,244,236,46,270,154,229,293],"101":[120,71,173,66,215,227,226,297,155,158,154,270,293,229],"103":[323,24,68,142,344,158,228,279,324,206,209,154,229,309],"104":[272,117,331,227,296,14,68,295,155,297,293,57,229,225,345,322],"105":[132,71,2,159,226,343,295,186,297,155,185,231,227,207,232],"106":[330,0,4,2,65,64,25,295,66,225,227,133,256,310,228,232,293,309],"107":[210,154,205,225,226,62,196,293,159],"109":[15,64,133,73,63,293],"116":[72,62,81,63,343],"117":[41,0,61,271,63,309,227,293],"118":[15,21,136,292,273,272,62,227,156,226],"119":[15,157,65,62,64,63,78,269,225,228],"120":[254,109,245,137,339],"121":[8,111,135,235,261,317,228,274,343,264,257,309,33,256,225],"122":[350,274,255,271,230,256],"123":[299,252,261,356,140,231],"124":[78,62,63,226],"125":[269,272,309,207,158],"126":[3,24,235,15,256,225,293],"127":[42,75,312,227,310],"128":[286,80,272,343],"129":[177,104,3,165,134,132,136,231,163,343,233],"130":[85,48,73,310,274,107],"131":[14,235,225,255,230,234,226,38,279,257,133,21,17,136,137,147,134,42,155,312,27,35,228,304,329,19,260,259,41,160,299,296,16,18,293,37,232,274,271,227,281,132,62,276],"132":[155,157,343,107,269,370,110,3],"133":[105,108,73,66,61,62,63,225,259,269,256],"134":[1,2,13,135,136,332,82,256,81,228,334,293,269],"135":[65,14,67,63,228,226,157],"136":[1,10,145,61,234,155,295,344,154,163],"137":[260,274,2,1,136,225,248,232,137,18,255,231,309,294],"138":[274,260,136,259,41,225,295,18,255,345,228,309],"139":[3,336,138,61,269,271,270,279,293,227,228,226,154,294],"140":[308,7,46,62,96,226,227,225,270,228,142,154,135,141,4],"141":[233,154,230,277,278,269,246,270,158,227,165,284,238,29,207]}};
(function () {
  "use strict";
  const host = document.querySelector(".t2");
  const canvas = document.querySelector(".t2-arc");
  const ctx = canvas.getContext("2d");
  const tip = document.querySelector(".t2-tip");
  const info = document.querySelector(".t2-info");
  const infoBody = info.querySelector(".t2-info-body");
  const infoBack = info.querySelector(".t2-info-back");
  const infoShow = info.querySelector(".t2-info-show");
  const infoClose = info.querySelector(".t2-info-close");
  const findIn = document.querySelector(".t2-find input");
  const found = document.querySelector(".t2-found");
  const zoomSay = document.querySelector(".t2-zoom-say");
  const STILL = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const esc = (t) => String(t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  const clampV = (v, a, b) => Math.max(a, Math.min(b, v));
  const cmp = (a, b) => String(a).localeCompare(String(b), "en", { sensitivity: "base" });

  // ---- THE PERFUMERS, THEIR HOUSES AND THEIR PERFUMES --------------------
  const CREDIT = ["named by a source", "the house's perfumer", "perfumer not found"];
  const KIND = ["an individual fragrance written about on the site", "a house perfume written about on the site", "one of Prin Lomros' houses, not written about on the site"];
  const TONE = [[235, 163, 63], [188, 211, 234], [226, 88, 126]];   // the Perfumers page's gold, blue-white and rose
  const HOU = DATA.houses.map((h, i) => Object.assign({}, h, { i, list: [], pers: new Map() }));
  const PER = DATA.perfumers.map((p, i) => Object.assign({}, p, { i, list: [], houses: new Map(), none: p.id === "not-found" }));
  const PERF = DATA.perfumes.map(([n, who, c, y, h, k, s], i) => {
    const e = { i, n, who: who.map((q) => PER[q]), c, y, h: HOU[h], k, s, notes: (NOTES.of[i] || []).map((id) => ({ id, name: NOTES.names[id], acc: NOTES.accord[id] })) };
    e.h.list.push(e);
    e.who.forEach((p) => { p.list.push(e); p.houses.set(e.h, (p.houses.get(e.h) || 0) + 1); e.h.pers.set(p, (e.h.pers.get(p) || 0) + 1); });
    return e;
  });
  const byYear = (a, b) => (a.y || 9999) - (b.y || 9999) || cmp(a.n, b.n);
  // the perfumers down the arc, A to Z by surname, Perfumer not found last
  const ORDER = PER.slice().sort((a, b) => (a.none - b.none) || cmp(a.sort, b.sort));
  ORDER.forEach((p, k) => (p.k = k));
  // the houses round the outside, A to Z, each perfume in its house by year
  const HORDER = HOU.slice().sort((a, b) => cmp(a.name, b.name));
  HORDER.forEach((h, k) => { h.k = k; h.list.sort(byYear); h.list.forEach((e, j) => (e.j = j)); });
  const NP = ORDER.length, NH = HORDER.length;
  const maxN = Math.max(...PER.map((p) => p.list.length));
  const perName = (p) => (p.none ? "Perfumer not found" : p.name);
  const whoOf = (e) => e.who.map(perName).join(" & ");
  const yearsOf = (list) => {
    const ys = list.map((e) => e.y).filter(Boolean);
    if (!ys.length) return "—";
    const a = Math.min(...ys), b = Math.max(...ys);
    return a === b ? String(a) : a + "–" + String(b).slice(2);
  };

  // the perfumers and the houses down the left, A to Z — pointed at, lit;
  // pressed, their panel
  const persList = document.querySelector(".t2-pers"), housesList = document.querySelector(".t2-houses");
  ORDER.forEach((p) => {
    const li = document.createElement("li");
    li.dataset.per = String(p.i); li.tabIndex = 0; li.setAttribute("role", "button");
    li.innerHTML = "<i>" + esc(perName(p)) + "</i> — " + esc([p.from, [...p.houses.keys()].map((h) => h.name).join(", ")].filter(Boolean).join(" · ")) + " <span>(" + p.list.length + ")</span>";
    persList.appendChild(li);
  });
  HORDER.forEach((h) => {
    const li = document.createElement("li");
    li.dataset.house = String(h.i); li.tabIndex = 0; li.setAttribute("role", "button");
    li.innerHTML = "<i>" + esc(h.name) + "</i> — " + esc([h.from, h.founded && "founded " + h.founded].filter(Boolean).join(" · ") || "—") + " <span>(" + h.list.length + ")</span>";
    housesList.appendChild(li);
  });

  // ---- THE LAYOUT -------------------------------------------------------
  let W = 0, H = 0, DPR = 1, narrow = false;
  const G = { cx: 0, cy: 0, rd: 0, rb0: 0, rb1: 0, rt: 0, ra: 0, th: 0, ta: 0, dome: 20, left: 0 };
  const still = document.createElement("canvas");
  const sctx = still.getContext("2d");
  function layout() {
    const b = canvas.getBoundingClientRect();
    const changed = Math.round(b.width) !== Math.round(W) || Math.round(b.height) !== Math.round(H);
    W = b.width; H = b.height;
    narrow = innerWidth <= 900;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = still.width = Math.round(W * DPR);
    canvas.height = still.height = Math.round(H * DPR);
    G.left = narrow ? 0 : 300;
    const room = W - G.left;
    G.rd = narrow ? Math.max(W * 1.15, H * 1.05) : Math.max(room * 1.05, H * 0.9);
    G.cy = H / 2;
    G.th = Math.asin(Math.min(0.98, (H * 0.45) / G.rd));
    // on a narrow window the first and last domes stand far enough in for
    // the perfumers' names to be read beside them, and the rings close up
    G.cx = narrow ? Math.min(150, W * 0.38) - G.rd * Math.cos(G.th) : G.left + 0.28 * room - G.rd;
    const spare = narrow ? W * 0.34 : room * 0.58;
    G.rb0 = G.rd + 42;
    G.rb1 = G.rd + spare * 1.45;
    G.rt = G.rd + spare * 0.52;
    G.ra = G.rt + spare * 0.3;
    G.ta = Math.asin(Math.min(0.98, (H * 0.46) / G.ra));
    G.dome = Math.max(6, Math.min(22, ((G.th * 2 * G.rd) / NP) * 0.3));
    if (changed) { Object.assign(cam, { x: W / 2, y: H / 2, z: 1 }); Object.assign(goal, cam); sayZoom(); }
    stillDirty = true;
  }
  const angleOfPer = (p) => -G.th + (p.k + 0.5) * (2 * G.th) / NP;
  const span = () => 2 * G.ta;
  // every house a stretch as long as its perfumes, but never shorter than
  // MIN_W, so that a house of one or two has room for its name
  const GAPS = 2.2, MIN_W = 7;
  const widthOf = (h) => Math.max(MIN_W, h.list.length);
  const HSTART = []; let SLOTS = 0;
  HORDER.forEach((h) => { HSTART[h.k] = SLOTS; SLOTS += widthOf(h) + GAPS; });
  const slots = () => SLOTS;
  const perfAngle = (e) => -span() / 2 + ((HSTART[e.h.k] + GAPS / 2 + (e.j + 0.5) * (widthOf(e.h) / e.h.list.length)) / slots()) * span();
  const houseFrom = (h) => -span() / 2 + ((HSTART[h.k] + GAPS / 2) / slots()) * span();
  const houseTo = (h) => -span() / 2 + ((HSTART[h.k] + GAPS / 2 + widthOf(h)) / slots()) * span();
  const houseMid = (h) => (houseFrom(h) + houseTo(h)) / 2;
  // a perfume's tick: longer the newer it is (as the Perfumers page's bars)
  const tickLen = (e) => (e.y ? 8 + ((e.y - 2008) / 18) * 30 : 5);
  const at = (r, a) => [G.cx + Math.cos(a) * r, G.cy + Math.sin(a) * r];
  function placeNames() {
    const want = HORDER.map(houseMid);
    const got = want.slice(), gap = ((narrow ? 12 : 15) * Math.pow(cam.z, 0.35)) / (G.ra * cam.z);
    for (let it = 0; it < 90; it++) {
      for (let i = 1; i < got.length; i++) {
        const d = got[i] - got[i - 1];
        if (d < gap) { const push = (gap - d) / 2; got[i] += push; got[i - 1] -= push; }
      }
      for (let i = 0; i < got.length; i++) got[i] += (want[i] - got[i]) * 0.02;
    }
    return got;
  }

  // ---- THE VIEW: how close, and where ----------------------------------------
  const cam = { x: 0, y: 0, z: 1 }, goal = { x: 0, y: 0, z: 1 };
  const ZMAX = 10;
  let moving = false;
  function hold(o) {
    o.z = clampV(o.z, 1, ZMAX);
    const hw = W / (2 * o.z), hh = H / (2 * o.z);
    o.x = clampV(o.x, hw, W - hw); o.y = clampV(o.y, hh, H - hh);
  }
  const toScreen = (x, y) => [(x - cam.x) * cam.z + W / 2, (y - cam.y) * cam.z + H / 2];
  const toWorld = (sx, sy, o = cam) => [(sx - W / 2) / o.z + o.x, (sy - H / 2) / o.z + o.y];
  const view = (c) => c.setTransform(DPR * cam.z, 0, 0, DPR * cam.z, DPR * (W / 2 - cam.x * cam.z), DPR * (H / 2 - cam.y * cam.z));
  const lw = (w) => w * Math.pow(cam.z, -0.78);
  const fs = (s, k = 0.5) => (s * Math.pow(cam.z, k)) / cam.z;
  function go(o, now) {
    Object.assign(goal, o); hold(goal);
    if (STILL || now) { Object.assign(cam, goal); stillDirty = true; }
    moving = true; sayZoom(); kick();
  }
  function zoomAt(sx, sy, f) {
    const [wx, wy] = toWorld(sx, sy, goal);
    const z = clampV(goal.z * f, 1, ZMAX);
    go({ z, x: wx - (sx - W / 2) / z, y: wy - (sy - H / 2) / z });
  }
  function sayZoom() {
    if (zoomSay) zoomSay.textContent = Math.round(goal.z * 100) + "%";
    canvas.style.touchAction = goal.z > 1.01 ? "none" : "pan-y";
    host.classList.toggle("is-zoomed", goal.z > 1.01);
  }

  // ---- WHAT IS LIT -----------------------------------------------------------
  let stillDirty = true, focus = null, pinned = null;   // { perfumer } or { house } or { perfume }
  const BANDS = [
    [0.0, [16, 15, 34]], [0.12, [27, 25, 58]], [0.3, [52, 44, 92]], [0.48, [96, 78, 140]],
    [0.66, [150, 126, 182]], [0.82, [204, 186, 222]], [1.0, [246, 242, 250]],
  ];
  const bandColour = (t) => {
    for (let i = 1; i < BANDS.length; i++) if (t <= BANDS[i][0]) {
      const [t0, c0] = BANDS[i - 1], [t1, c1] = BANDS[i], k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
    }
    return BANDS[BANDS.length - 1][1];
  };
  function litPerfume(e) {
    if (!focus) return 0;
    if (focus.perfume) return e === focus.perfume ? 2 : e.h === focus.perfume.h && e.who.some((p) => focus.perfume.who.includes(p)) ? 1 : 0;
    if (focus.perfumer) return e.who.includes(focus.perfumer) ? 2 : 0;
    if (focus.house) return e.h === focus.house ? 2 : 0;
    return 0;
  }
  function litHouse(h) {
    if (!focus) return false;
    if (focus.house) return focus.house === h;
    if (focus.perfumer) return focus.perfumer.houses.has(h);
    if (focus.perfume) return focus.perfume.h === h;
    return false;
  }
  function litPer(p) {
    if (!focus) return true;
    if (focus.perfumer) return focus.perfumer === p;
    if (focus.house) return focus.house.pers.has(p);
    if (focus.perfume) return focus.perfume.who.includes(p);
    return true;
  }

  // ---- THE STILL PICTURE: bands, ticks, words ----------------------------
  function drawStill() {
    stillDirty = false;
    const c = sctx, z = cam.z;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#0b0b16";
    c.fillRect(0, 0, still.width, still.height);
    view(c);
    const [vx0, vy0] = toWorld(-40, -40), [vx1, vy1] = toWorld(W + 40, H + 40);
    const inView = (x, y) => x > vx0 && x < vx1 && y > vy0 && y < vy1;
    // the bands, outermost first
    const n = 34;
    for (let i = n - 1; i >= 0; i--) {
      const t = i / (n - 1);
      const r = G.rb0 + (G.rb1 - G.rb0) * Math.pow(t, 0.85);
      c.fillStyle = "rgb(" + bandColour(t).join(",") + ")";
      c.beginPath(); c.arc(G.cx, G.cy, r, -Math.PI / 2, Math.PI / 2); c.lineTo(G.cx, G.cy); c.closePath(); c.fill();
    }
    c.fillStyle = "#0b0b16";
    c.beginPath(); c.arc(G.cx, G.cy, G.rb0 - 1, -Math.PI / 2, Math.PI / 2); c.lineTo(G.cx, G.cy); c.closePath(); c.fill();
    // the years' rings the ticks reach to, faint, every fifth a little stronger
    c.lineWidth = lw(0.6);
    for (let y = 2010; y <= 2026; y += 2) {
      const r = G.rt - (8 + ((y - 2008) / 18) * 30);
      c.strokeStyle = "rgba(236,233,244," + (y % 10 === 0 ? 0.12 : 0.05) + ")";
      c.beginPath(); c.arc(G.cx, G.cy, r, -G.ta * 1.02, G.ta * 1.02); c.stroke();
    }
    c.strokeStyle = "rgba(236,233,244,0.08)";
    c.beginPath(); c.arc(G.cx, G.cy, G.rt, -G.ta * 1.02, G.ta * 1.02); c.stroke();
    // the ticks, a perfume each, in the colour of where it is
    for (const e of PERF) {
      const lit = litPerfume(e), ang = perfAngle(e), len = tickLen(e);
      const [x0, y0] = at(G.rt - len, ang), [x1, y1] = at(G.rt, ang);
      const tone = TONE[e.k];
      c.globalAlpha = focus && !lit ? 0.22 : 1;
      c.strokeStyle = lit === 2 ? "rgba(255,226,170,0.97)" : lit === 1 ? "rgba(255,226,170,0.6)"
        : "rgba(" + tone.join(",") + "," + (e.c === 0 ? 0.75 : e.c === 1 ? 0.5 : 0.3) + ")";
      c.lineWidth = lw(lit === 2 ? 1.2 : 0.85);
      if (!e.y) c.setLineDash([lw(1.5), lw(1.5)]);
      c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
      if (!e.y) c.setLineDash([]);
      if (focus && focus.perfume === e) {
        c.fillStyle = "#ffe2aa";
        const [px, py] = at(G.rt - len - fs(4), ang);
        c.beginPath(); c.arc(px, py, fs(2.4), 0, TAU); c.fill();
      }
    }
    c.globalAlpha = 1;
    // the perfumes' names past their ticks: what is lit first, then the
    // newest, each only where there is room — so the closer in, the more are
    // named, and from about three times as close nearly all, with their year
    const tickPx = 5.2 * Math.pow(z, 0.55), tickFont = tickPx / z;
    const want = PERF.map((e) => ({ e, lit: litPerfume(e), ang: perfAngle(e) }))
      .filter((o) => o.lit === 2 || z >= 1.7 || (o.lit === 1 && z > 1.4) || (o.e.k !== 2 && z >= 1.25))
      .sort((p, q) => (q.e === (focus && focus.perfume) ? 1 : 0) - (p.e === (focus && focus.perfume) ? 1 : 0) || q.lit - p.lit || (p.e.k === 2) - (q.e.k === 2) || (q.e.y || 0) - (p.e.y || 0));
    const taken = [], gapA = (tickPx + 1.2) / (G.rt * z);
    c.textBaseline = "middle";
    for (const o of want) {
      if (!(focus && focus.perfume === o.e) && taken.some((a2) => Math.abs(a2 - o.ang) < gapA)) continue;
      const [tx, ty] = at(G.rt + fs(4), o.ang);
      if (!inView(tx, ty)) continue;
      taken.push(o.ang);
      c.save();
      c.translate(tx, ty); c.rotate(o.ang);
      const big = focus && focus.perfume === o.e;
      c.font = (big ? "600 " : "400 ") + (big ? tickFont * 1.5 : tickFont) + 'px "IBM Plex Mono", monospace';
      c.fillStyle = o.lit ? "rgba(255,236,200," + (o.lit === 2 ? 0.95 : 0.7) + ")" : "rgba(36,24,58," + (focus ? 0.3 : 0.62) + ")";
      c.fillText(o.e.n, 0, 0);
      if (z >= 2.6 || big) {
        const w = c.measureText(o.e.n).width;
        c.globalAlpha = 0.6;
        c.fillText(" " + (o.e.y || "—"), w, 0);
        c.globalAlpha = 1;
      }
      c.restore();
    }
    // the houses' names round the outside, and a bracket over each stretch
    const names = placeNames();
    HORDER.forEach((h, k) => {
      const lit = litHouse(h);
      const a0 = houseFrom(h) - 0.002, a1 = houseTo(h) + 0.002;
      const br = G.ra - fs(22, 0.35);
      c.strokeStyle = lit ? "rgba(40,20,60,0.9)" : "rgba(40,32,70,0.45)";
      c.lineWidth = lw(lit ? 1.2 : 0.8);
      c.beginPath(); c.arc(G.cx, G.cy, br, a0, a1); c.stroke();
      const mid = houseMid(h), la = names[k];
      const [m0x, m0y] = at(br, mid), [m1x, m1y] = at(G.ra, la);
      c.strokeStyle = "rgba(36,24,58,0.35)"; c.lineWidth = lw(0.6);
      c.beginPath(); c.moveTo(m0x, m0y); c.lineTo(m1x, m1y); c.stroke();
      const [mx, my] = at(G.ra + fs(4, 0.35), la);
      c.save();
      c.translate(mx, my); c.rotate(la);
      c.textBaseline = "middle";
      c.font = (lit ? "700 " : "600 ") + fs(narrow ? 8 : 10.5, 0.35) + "px Archivo, sans-serif";
      c.fillStyle = lit ? "#24123a" : "rgba(36,24,58," + (focus ? 0.4 : 0.85) + ")";
      c.fillText(h.name, 0, 0);
      const w = c.measureText(h.name).width;
      c.font = "500 " + fs(7, 0.35) + 'px "IBM Plex Mono", monospace';
      c.fillStyle = "rgba(36,24,58,0.55)";
      c.fillText((h.from ? h.from.toUpperCase() + " · " : "") + h.list.length, w + fs(6, 0.35), fs(0.5, 0.35));
      c.restore();
      const [px, py] = at(br, a0), s = fs(3, 0.35);
      c.fillStyle = "rgba(36,24,58,0.8)";
      c.fillRect(px - s / 2, py - s / 2, s, s);
    });
    // the perfumers' words, beside their domes: as many lines as there is
    // room for between one dome and the next
    const u = fs(1, 0.5), gapPx = ((2 * G.th * G.rd) / NP) * z;
    ORDER.forEach((p) => {
      const [x, y] = at(G.rd, angleOfPer(p));
      c.globalAlpha = litPer(p) ? 1 : 0.28;
      c.textAlign = "right";
      const tx = x - G.dome * 1.45 - 6 * u;
      c.font = "700 " + 9.5 * u + "px Archivo, sans-serif"; c.fillStyle = focus && focus.perfumer === p ? "#ffe2aa" : "#ece9f4";
      c.fillText(perName(p).toUpperCase(), tx, y + (gapPx >= 30 ? -3 : 3) * u);
      c.font = "400 " + 7 * u + 'px "IBM Plex Mono", monospace'; c.fillStyle = "#8f8aa6";
      if (gapPx >= 30) {
        const where = [p.from, p.houses.size + (p.houses.size === 1 ? " house" : " houses"), p.list.length + (p.list.length === 1 ? " perfume" : " perfumes")].filter(Boolean).join(" · ");
        c.fillText(where.toUpperCase(), tx, y + 8 * u);
      } else {
        c.textAlign = "left";
        c.fillText(String(p.list.length), x + G.dome * 1.25 + 3 * u, y + 3 * u);
      }
      c.globalAlpha = 1;
    });
    c.textAlign = "left";
    c.save();
    const [yx, yy] = at(G.rd + G.dome * 1.8, G.th + 0.02);
    c.translate(yx, yy); c.rotate(G.th + 0.02 + Math.PI / 2);
    c.font = "500 " + 7 * u + 'px "IBM Plex Mono", monospace'; c.fillStyle = "#5b5772";
    c.fillText("PERFUMERS · " + (NP - 1) + " · AND THE PERFUMES NO SOURCE CREDITS", 0, 0);
    c.restore();
  }

  // ---- A DOME, live: a perfumer -------------------------------------------
  const TILT = 0.42;
  function dome(c, x, y, r, h, t, alpha, hi) {
    const ct = Math.cos(TILT), st = Math.sin(TILT);
    const P = (px, py, pz) => [x + px * r, y - (py * ct - pz * st) * r];
    c.globalAlpha = alpha;
    c.strokeStyle = hi ? "#f5efff" : "rgba(220,212,246,0.75)";
    c.lineWidth = lw(0.8);
    c.beginPath(); c.ellipse(x, y, r, r * st, 0, 0, TAU); c.stroke();
    c.fillStyle = "rgba(140,120,200,0.08)"; c.fill();
    for (let k = 1; k <= 2; k++) {
      const el = (k / 3) * (Math.PI / 2), rr = Math.cos(el), yy = Math.sin(el);
      const [cx2, cy2] = P(0, yy, 0);
      c.strokeStyle = "rgba(200,190,240,0.35)";
      c.beginPath(); c.ellipse(cx2, cy2, rr * r, rr * r * st, 0, 0, TAU); c.stroke();
    }
    c.strokeStyle = "rgba(210,200,248,0.32)";
    for (let m = 0; m < 4; m++) {
      const az = t + (m / 4) * Math.PI;
      c.beginPath();
      for (let k = 0; k <= 10; k++) {
        const el = (k / 10) * Math.PI;
        const [sx, sy] = P(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az));
        k ? c.lineTo(sx, sy) : c.moveTo(sx, sy);
      }
      c.stroke();
    }
    // the path over it, as high as the perfumer has perfumes, and a light on it
    const peak = 0.25 + 0.7 * h;
    c.strokeStyle = hi ? "#fff" : "rgba(255,250,240,0.85)";
    c.lineWidth = lw(hi ? 1.3 : 1);
    c.beginPath();
    for (let k = 0; k <= 20; k++) {
      const s = k / 20, az = -Math.PI * 0.85 + s * Math.PI * 1.7;
      const el = Math.sin(s * Math.PI) * peak * (Math.PI / 2);
      const [sx, sy] = P(Math.cos(el) * Math.cos(az) * 0.98, Math.sin(el), Math.cos(el) * Math.sin(az) * 0.98);
      k ? c.lineTo(sx, sy) : c.moveTo(sx, sy);
    }
    c.stroke();
    const s = (t * 0.25) % 1, az = -Math.PI * 0.85 + s * Math.PI * 1.7, el = Math.sin(s * Math.PI) * peak * (Math.PI / 2);
    const [lx, ly] = P(Math.cos(el) * Math.cos(az) * 0.98, Math.sin(el), Math.cos(el) * Math.sin(az) * 0.98);
    c.fillStyle = "#fff";
    c.beginPath(); c.arc(lx, ly, fs(1.8, 0.3), 0, TAU); c.fill();
    c.fillStyle = hi ? "#eba33f" : "rgba(236,233,244,0.9)";
    c.beginPath(); c.arc(x, y - r * 0.3, Math.max(r * 0.12, 0.8 / cam.z), 0, TAU); c.fill();
    c.globalAlpha = 1;
  }

  // ---- THE FRAME -------------------------------------------------------
  const born = performance.now();
  let last = 0;
  // the curve a line takes from a perfumer's dome out to a tick or a house
  const curve = (x, y, ex, ey) => [x + (ex - x) * 0.55, y + (ey - y) * 0.15];
  const along = (x, y, mx, my, ex, ey, s) => [(1 - s) * (1 - s) * x + 2 * (1 - s) * s * mx + s * s * ex, (1 - s) * (1 - s) * y + 2 * (1 - s) * s * my + s * s * ey];
  function frame(now) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    if (moving) {
      const k = STILL ? 1 : 1 - Math.exp(-dt * 11);
      cam.z = Math.exp(Math.log(cam.z) + (Math.log(goal.z) - Math.log(cam.z)) * k);
      cam.x += (goal.x - cam.x) * k; cam.y += (goal.y - cam.y) * k;
      if (Math.abs(goal.z / cam.z - 1) < 0.002 && Math.hypot(goal.x - cam.x, goal.y - cam.y) * cam.z < 0.4) { Object.assign(cam, goal); moving = false; }
      stillDirty = true;
    }
    if (stillDirty) drawStill();
    const t = STILL ? 0 : (now - born) / 1000;
    const intro = STILL ? 1 : Math.min(1, (now - born) / 1800);
    const c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.drawImage(still, 0, 0);
    view(c);
    if (!STILL) {
      const a = -G.th + ((t * 0.04) % 1) * 2 * G.th * 1.3 - 0.15 * G.th;
      const g = c.createRadialGradient(...at(G.rb0 + (G.rt - G.rb0) * 0.5, a), 0, ...at(G.rb0 + (G.rt - G.rb0) * 0.5, a), H * 0.35);
      g.addColorStop(0, "rgba(255,240,255,0.10)"); g.addColorStop(1, "rgba(255,240,255,0)");
      c.fillStyle = g;
      c.beginPath(); c.arc(G.cx, G.cy, G.rt + 4, -Math.PI / 2, Math.PI / 2); c.arc(G.cx, G.cy, G.rb0, Math.PI / 2, -Math.PI / 2, true); c.fill();
    }
    const dot = fs(2.4, 0.3);
    if (focus && focus.perfume) {
      // a perfume chosen: a line from its perfumer (or each of them) to its tick
      const e = focus.perfume, ang2 = perfAngle(e);
      const [ex, ey] = at(G.rt - tickLen(e) - fs(4), ang2);
      e.who.forEach((p, i) => {
        const [x, y] = at(G.rd + G.dome * 1.05, angleOfPer(p));
        const [mx, my] = curve(x, y, ex, ey);
        c.strokeStyle = "rgba(255,214,150,0.95)"; c.globalAlpha = 0.9; c.lineWidth = lw(1.6);
        c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, ex, ey); c.stroke();
        if (!STILL) {
          const s = (t * 0.35 + i * 0.3) % 1, [qx, qy] = along(x, y, mx, my, ex, ey, s);
          c.globalAlpha = Math.sin(s * Math.PI); c.fillStyle = "#fff";
          c.fillRect(qx - dot / 2, qy - dot / 2, dot, dot);
        }
      });
      c.globalAlpha = 1;
    } else {
      // the lines from the perfumers out to the houses they made perfumes for
      ORDER.forEach((p) => {
        const k = Math.max(0, Math.min(1, intro * 2.2 - p.k * 0.035));
        if (k <= 0) return;
        const [x, y] = at(G.rd + G.dome * 1.05, angleOfPer(p));
        const hiP = focus && focus.perfumer === p;
        p.houses.forEach((cnt, h) => {
          const share = cnt / p.list.length, big = cnt / maxN;
          const hiH = focus && focus.house === h;
          const lit = !focus || hiP || hiH;
          const ang2 = houseMid(h);
          const [ex, ey] = at(G.rt - 44, ang2);
          const [mx, my] = curve(x, y, ex, ey);
          c.strokeStyle = hiP || hiH ? "rgba(255,214,150,0.9)" : "rgba(236,230,255,1)";
          c.globalAlpha = (hiP || hiH ? 0.45 + share * 0.5 : lit ? 0.06 + share * 0.22 : 0.025) * k;
          c.lineWidth = lw(hiP || hiH ? 1 + Math.sqrt(big) * 7 : 0.5 + Math.sqrt(big) * 3);
          c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, x + (ex - x) * k, y + (ey - y) * k); c.stroke();
          if (!STILL && lit && k >= 1) {
            const s = (t * (0.16 + share * 0.3) + p.k * 0.13 + h.k * 0.07) % 1, [qx, qy] = along(x, y, mx, my, ex, ey, s);
            c.globalAlpha = Math.min(1, 0.25 + share) * Math.sin(s * Math.PI) * (focus ? 1 : 0.7);
            c.fillStyle = "#fff";
            c.fillRect(qx - dot / 2, qy - dot / 2, dot, dot);
          }
          if (hiP || hiH) {
            c.globalAlpha = 1;
            c.fillStyle = "rgba(255,250,244,0.95)";
            const pw = fs(20, 0.4), ph = fs(9, 0.4);
            c.save(); c.translate(ex, ey); c.rotate(ang2);
            c.beginPath(); c.roundRect ? c.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2) : c.rect(-pw / 2, -ph / 2, pw, ph); c.fill();
            c.fillStyle = "#24123a"; c.font = "500 " + fs(6, 0.4) + 'px "IBM Plex Mono", monospace'; c.textAlign = "center"; c.textBaseline = "middle";
            c.fillText(String(cnt), 0, fs(0.5, 0.4));
            c.restore(); c.textAlign = "left";
          }
        });
      });
      c.globalAlpha = 1;
    }
    // the domes, a perfumer each
    ORDER.forEach((p) => {
      const k = Math.max(0, Math.min(1, intro * 2 - p.k * 0.03));
      if (k <= 0) return;
      const [x, y] = at(G.rd, angleOfPer(p));
      const hi = focus && focus.perfumer === p;
      const e = 1 - Math.pow(1 - k, 3);
      dome(c, x, y + 3, G.dome * (0.6 + 0.4 * e) * (hi ? 1.15 : 1), p.list.length / maxN, t * (0.25 + 0.03 * p.k) + p.k, (litPer(p) ? 1 : 0.28) * e, hi);
    });
    if ((!STILL && !document.hidden) || moving) kick();
  }
  let raf = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  // ---- WHAT IS UNDER THE HAND ---------------------------------------------
  // closer than a little under twice, a press in a house's stretch is a
  // press on the perfume under it
  const PERF_FROM = 1.8;
  function pick(sx, sy) {
    const [mx, my] = toWorld(sx, sy), u = fs(1, 0.5);
    const step = (2 * G.th * G.rd) / NP;
    for (const p of ORDER) {
      const [x, y] = at(G.rd, angleOfPer(p));
      if (Math.abs(my - y) > Math.max(step * 0.5, 4 / cam.z)) continue;
      if (Math.hypot(mx - x, my - y - 3) < G.dome * 1.5 || (mx < x && mx > x - G.dome * 1.5 - 170 * u)) return { perfumer: p };
    }
    const r = Math.hypot(mx - G.cx, my - G.cy), ang = Math.atan2(my - G.cy, mx - G.cx);
    const onName = r > G.ra - fs(10, 0.35);
    if (r > G.rt - 46 && r < G.ra + fs(160, 0.35)) {
      const names = placeNames();
      for (let k = 0; k < NH; k++) {
        if (onName && Math.abs(ang - names[k]) < fs(narrow ? 6 : 7.5, 0.35) / G.ra) return { house: HORDER[k] };
      }
      if (onName) return null;
      const slot = span() / slots();
      let best = null, bd = Infinity;
      for (const e of PERF) { const d = Math.abs(perfAngle(e) - ang); if (d < bd) { bd = d; best = e; } }
      if (!best || bd > slot * 1.5) return null;
      const nearTicks = r < G.rt + fs(70);
      if (cam.z >= PERF_FROM && nearTicks) return { perfume: best };
      return { house: best.h, near: nearTicks ? best : null };
    }
    return null;
  }
  function same(a, b) { return (!a && !b) || (a && b && a.house === b.house && a.perfume === b.perfume && a.perfumer === b.perfumer); }
  function setFocus(f) {
    if (same(f, focus)) return;
    focus = f; stillDirty = true; kick();
    persList.querySelectorAll("li").forEach((li) => { const p = PER[+li.dataset.per]; li.classList.toggle("is-lit", !!f && litPer(p)); });
    housesList.querySelectorAll("li").forEach((li) => li.classList.toggle("is-lit", !!f && litHouse(HOU[+li.dataset.house])));
  }
  const focusOf = (f) => f && (f.perfumer ? { perfumer: f.perfumer } : f.perfume ? { perfume: f.perfume } : { house: f.house });

  // ---- THE PANEL: who, for whom, what — every name in it a way on --------------
  const hist = [];
  let current = null;
  const row = (go, label, n, of, extra) =>
    '<button type="button" class="t2-row" data-go="' + go + '"><span class="t2-row-name">' + label + '</span><span class="t2-row-bar"><i style="width:' + Math.max(2, Math.round((n / (of || 1)) * 100)) + '%"></i></span><span class="t2-row-n">' + n + (extra || "") + "</span></button>";
  const stat = (k, v) => "<div><dt>" + k + "</dt><dd>" + v + "</dd></div>";
  const perfRow = (e, say) => '<li><button type="button" class="t2-link" data-go="perfume:' + e.i + '">' + esc(e.n) + "</button><small>" + esc(say) + "</small></li>";
  const sources = (s) => '<ol class="t2-bio-src">' + s.map(([c2, u2]) => "<li>" + esc(c2).replace(/\*(.+?)\*/g, "<cite>$1</cite>") + ' <a href="' + esc(u2) + '" target="_blank" rel="noopener">' + esc(u2.replace(/^https?:\/\//, "").replace(/\/$/, "")) + "</a></li>").join("") + "</ol>";
  const RENDER = {
    perfumer(p) {
      const hs = [...p.houses].sort((a, b) => b[1] - a[1] || cmp(a[0].name, b[0].name));
      const by = [0, 0, 0]; p.list.forEach((e) => by[e.c]++);
      let s = '<p class="t2-k">Perfumer</p>';
      s += '<h2 class="t2-n">' + esc(perName(p)) + "</h2>";
      const where = [p.from, p.born && "born " + p.born].filter(Boolean).join(" · ");
      if (where) s += '<p class="t2-where">' + esc(where) + "</p>";
      s += '<dl class="t2-stats">' + stat("Perfumes", p.list.length) + stat("Houses", hs.length) + stat("Years", yearsOf(p.list)) + stat("Named by a source", by[0] + " of " + p.list.length) + "</dl>";
      if (p.bio) {
        s += '<div class="t2-bio">' + p.bio.t.map((t2, i) => (i === 0 ? "<p>" + esc(t2) + "</p>" : "")).join("") + "</div>";
        if (p.bio.t.length > 1) s += '<details class="t2-bio-more"><summary>More about ' + esc(p.name) + "</summary>" + p.bio.t.slice(1).map((t2) => "<p>" + esc(t2) + "</p>").join("") + "</details>";
        s += '<h3>Sources <span>for what is said of them</span></h3>' + sources(p.bio.s);
      } else if (p.none) s += '<p class="t2-s">The perfumes on the site no source credits to anyone, gathered here rather than guessed at.</p>';
      s += "<h3>Their houses <span>perfumes made for each</span></h3><div class=\"t2-rows\">";
      hs.forEach(([h, n]) => { s += row("house:" + h.i, esc(h.name), n, Math.max(...hs.map((x) => x[1])), "<small> of " + h.list.length + "</small>"); });
      s += "</div>";
      hs.forEach(([h]) => {
        const mine = p.list.filter((e) => e.h === h).sort(byYear);
        s += "<h3>For " + esc(h.name) + " <span>" + mine.length + "</span></h3><ul class=\"t2-list\">" + mine.map((e) => perfRow(e, [e.y || "year not found", CREDIT[e.c]].join(" · "))).join("") + "</ul>";
      });
      return s;
    },
    house(h) {
      const ps = [...h.pers].sort((a, b) => b[1] - a[1] || cmp(a[0].sort, b[0].sort));
      let s = '<p class="t2-k">House</p>';
      s += '<h2 class="t2-n">' + esc(h.name) + "</h2>";
      const where = [h.from, h.founded && "founded " + h.founded].filter(Boolean).join(" · ");
      if (where) s += '<p class="t2-where">' + esc(where) + "</p>";
      if (h.about) s += '<p class="t2-s">' + esc(h.about) + "</p>";
      s += '<dl class="t2-stats">' + stat("Perfumes", h.list.length) + stat("Perfumers", ps.filter(([p]) => !p.none).length) + stat("Years", yearsOf(h.list)) + stat("On the site", h.site ? "yes" : "no") + "</dl>";
      s += "<h3>Its perfumers <span>perfumes by each</span></h3><div class=\"t2-rows\">";
      ps.forEach(([p, n]) => { s += row("perfumer:" + p.i, esc(perName(p)), n, h.list.length, "<small> of " + h.list.length + "</small>"); });
      s += "</div><h3>Its perfumes <span>by year · " + h.list.length + "</span></h3><ul class=\"t2-list\">";
      h.list.forEach((e) => { s += perfRow(e, [e.y || "year not found", whoOf(e)].join(" · ")); });
      return s + "</ul>";
    },
    perfume(e) {
      let s = '<p class="t2-k">Perfume · <button type="button" class="t2-link" data-go="house:' + e.h.i + '">' + esc(e.h.name) + "</button></p>";
      s += '<h2 class="t2-n">' + esc(e.n) + "</h2>";
      s += '<p class="t2-where">' + esc(KIND[e.k]) + "</p>";
      s += '<dl class="t2-stats">' + stat("Year", e.y || "not found") + stat("Credit", CREDIT[e.c]) + stat("Perfumers", e.who.length) + stat("Notes", e.notes.length || "—") + "</dl>";
      s += "<h3>Made by <span>as the sources say</span></h3><div class=\"t2-rows\">";
      e.who.forEach((p) => { s += row("perfumer:" + p.i, esc(perName(p)), p.list.length, maxN, " <small>perfumes</small>"); });
      s += "</div>";
      if (e.notes.length) {
        s += '<h3>Its notes <span>as the Note Library files them</span></h3><div class="t2-chips">' + e.notes.map((nn) => '<span class="t2-chip"><b class="t2-code">' + NOTES.accords[nn.acc][0] + "</b>" + esc(nn.name) + "</span>").join("") + "</div>";
      } else if (e.k !== 2) s += '<p class="t2-none">No notes have been found for it yet.</p>';
      const sib = e.h.list.filter((x) => x !== e && x.who.some((p) => e.who.includes(p)));
      if (sib.length) s += "<h3>By the same hand, for " + esc(e.h.name) + " <span>" + sib.length + "</span></h3><ul class=\"t2-list\">" + sib.map((x) => perfRow(x, String(x.y || "year not found"))).join("") + "</ul>";
      if (e.s.length) s += '<h3>Sources</h3><p class="t2-where">' + [...new Set(e.s.map((i) => DATA.sources[i]))].map(esc).join(" · ") + "</p>";
      return s;
    },
  };
  function openInfo(kind, obj, push = true) {
    if (push && current && !(current.kind === kind && current.obj === obj)) hist.push(current);
    current = { kind, obj };
    infoBody.innerHTML = RENDER[kind](obj);
    info.hidden = false;
    info.dataset.kind = kind;
    infoBody.scrollTop = 0; info.scrollTop = 0;
    infoBack.hidden = !hist.length;
    pinned = kind === "house" ? { house: obj } : kind === "perfumer" ? { perfumer: obj } : { perfume: obj };
    setFocus(pinned);
    tip.hidden = true;
  }
  function closeInfo() {
    info.hidden = true; hist.length = 0; current = null; pinned = null;
    setFocus(null);
  }
  function goTo(spec) {
    const [kind, id] = spec.split(":");
    if (kind === "house") openInfo("house", HOU[+id]);
    else if (kind === "perfumer") openInfo("perfumer", PER[+id]);
    else if (kind === "perfume") openInfo("perfume", PERF[+id]);
  }
  // where a thing stands on the poster, framed in what the panel leaves
  function boxOf(kind, obj) {
    const pts = [];
    const domeBox = (p) => { const [x, y] = at(G.rd, angleOfPer(p)); pts.push([x - G.dome * 1.5 - 170, y - 30], [x + G.dome * 2.5, y + 30]); };
    if (kind === "perfumer") {
      domeBox(obj);
      obj.houses.forEach((n, h) => { pts.push(at(G.rt - 46, houseMid(h)), at(G.ra + 60, houseMid(h))); });
      return { pts, most: 3 };
    }
    if (kind === "house") {
      const a0 = houseFrom(obj), a1 = houseTo(obj);
      for (let k = 0; k <= 6; k++) { const ang = a0 + ((a1 - a0) * k) / 6; pts.push(at(G.rt - 46, ang), at(G.ra + 90, ang)); }
      return { pts, most: 6 };
    }
    const ang = perfAngle(obj);
    pts.push(at(G.rt - tickLen(obj) - 8, ang - 0.004), at(G.rt + 110, ang + 0.004));
    return { pts, most: 5 };
  }
  function showOn(kind, obj) {
    if (narrow) canvas.scrollIntoView({ behavior: "auto", block: "start" });
    const { pts, most } = boxOf(kind, obj);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const open = !info.hidden;
    const left = open && !narrow ? 330 : 0;
    const tall = open && narrow ? Math.min(H, innerHeight * 0.42) : H;
    const z = clampV(Math.min((W - left - 60) / Math.max(1, x1 - x0), (tall - 50) / Math.max(1, y1 - y0)), 1.2, most);
    const sx = left + (W - left) / 2, sy = tall / 2;
    go({ z, x: (x0 + x1) / 2 - (sx - W / 2) / z, y: (y0 + y1) / 2 - (sy - H / 2) / z });
  }
  infoBody.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) { e.preventDefault(); goTo(b.dataset.go); }
  });
  infoBack.addEventListener("click", () => { const prev = hist.pop(); if (prev) openInfo(prev.kind, prev.obj, false); infoBack.hidden = !hist.length; });
  infoClose.addEventListener("click", closeInfo);
  infoShow.addEventListener("click", () => { if (current) showOn(current.kind, current.obj); });

  // ---- THE SEARCH: a perfumer, a house or a perfume -----------------------------
  const plain = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const ITEMS = [
    ...ORDER.map((p) => ({ kind: "perfumer", obj: p, name: perName(p), say: "Perfumer · " + p.list.length + (p.list.length === 1 ? " perfume · " : " perfumes · ") + [...p.houses.keys()].map((h) => h.name).join(", ") })),
    ...HORDER.map((h) => ({ kind: "house", obj: h, name: h.name, say: "House · " + h.list.length + " perfumes" + (h.from ? " · " + h.from : "") })),
    ...PERF.map((e) => ({ kind: "perfume", obj: e, name: e.n, say: "Perfume · " + e.h.name + " · " + whoOf(e) + (e.y ? " · " + e.y : "") })),
  ].map((it) => Object.assign(it, { key: plain(it.name) }));
  const KORDER = ["perfumer", "house", "perfume"];
  let results = [];
  function search() {
    const q = plain(findIn.value.trim());
    if (!q) { found.hidden = true; results = []; return; }
    results = ITEMS.filter((it) => it.key.includes(q))
      .sort((p, q2) => (q2.key.startsWith(q) ? 1 : 0) - (p.key.startsWith(q) ? 1 : 0) || KORDER.indexOf(p.kind) - KORDER.indexOf(q2.kind) || cmp(p.name, q2.name))
      .slice(0, 8);
    found.innerHTML = results.length
      ? results.map((it, i) => '<li><button type="button" data-r="' + i + '"><span>' + esc(it.name) + "</span><small>" + esc(it.say) + "</small></button></li>").join("")
      : '<li class="t2-found-none">Nothing on the poster by that name.</li>';
    found.hidden = false;
  }
  function choose(it) {
    findIn.value = ""; found.hidden = true; results = [];
    hist.length = 0; current = null;
    openInfo(it.kind, it.obj);
    showOn(it.kind, it.obj);
  }
  findIn.addEventListener("input", search);
  findIn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && results[0]) { e.preventDefault(); choose(results[0]); }
    if (e.key === "Escape") { findIn.value = ""; found.hidden = true; }
  });
  found.addEventListener("click", (e) => { const b = e.target.closest("[data-r]"); if (b) choose(results[+b.dataset.r]); });
  document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".t2-find")) found.hidden = true; });

  // ---- THE HAND: pointing, pressing, dragging, pinching, the wheel ---------
  const pts = new Map();
  let press = null, pinch = null;
  const local = (e) => { const b = canvas.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  function hoverAt(e) {
    const [sx, sy] = local(e);
    const f = pick(sx, sy);
    if (!pinned) setFocus(focusOf(f));
    canvas.style.cursor = f ? "pointer" : goal.z > 1.01 ? "grab" : "default";
    if (!f || e.pointerType === "touch") { tip.hidden = true; return; }
    let html;
    if (f.perfumer) {
      const p = f.perfumer;
      html = "<b>" + esc(perName(p)) + "</b>" + esc([p.from, p.born && "born " + p.born].filter(Boolean).join(" · ")) + (p.from || p.born ? "<br>" : "") + p.list.length + (p.list.length === 1 ? " perfume" : " perfumes") + " · " + p.houses.size + (p.houses.size === 1 ? " house" : " houses");
    } else if (f.perfume) {
      const x = f.perfume;
      html = "<b>" + esc(x.n) + "</b>" + esc(x.h.name) + " · " + (x.y || "year not found") + "<br>" + esc(whoOf(x)) + " — " + CREDIT[x.c];
    } else {
      const h = f.house;
      html = "<b>" + esc(h.name) + "</b>" + esc([h.from, h.founded && "founded " + h.founded].filter(Boolean).join(" · ")) + "<br>" + h.list.length + " perfumes · " + [...h.pers.keys()].map(perName).join(", ") + (f.near ? "<br>" + esc(f.near.n) + " · " + (f.near.y || "year not found") + "<br><i>closer in, each perfume can be pressed</i>" : "");
    }
    tip.innerHTML = html + "<em>Press for more</em>";
    tip.hidden = false;
    const hb = host.getBoundingClientRect();
    let x = e.clientX - hb.left + 14, y = e.clientY - hb.top + 14;
    if (x + 250 > hb.width) x -= 270;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  }
  canvas.addEventListener("pointerdown", (e) => {
    pts.set(e.pointerId, local(e));
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, z: cam.z, w: toWorld(mid[0], mid[1]) };
      press = null;
      return;
    }
    press = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, id: e.pointerId, type: e.pointerType };
    if (goal.z > 1.01 || e.pointerType !== "touch") { try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* none */ } }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (pts.has(e.pointerId)) pts.set(e.pointerId, local(e));
    if (pinch && pts.size >= 2) {
      const [a, b] = [...pts.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]), mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const z = clampV(pinch.z * (d / pinch.d), 1, ZMAX);
      go({ z, x: pinch.w[0] - (mid[0] - W / 2) / z, y: pinch.w[1] - (mid[1] - H / 2) / z }, true);
      return;
    }
    if (press && press.id === e.pointerId) {
      const dx = e.clientX - press.x, dy = e.clientY - press.y;
      if (!press.moved && Math.hypot(dx, dy) > 5) { press.moved = true; tip.hidden = true; }
      if (press.moved && goal.z > 1.01) {
        canvas.style.cursor = "grabbing";
        go({ x: press.cx - dx / cam.z, y: press.cy - dy / cam.z, z: goal.z }, true);
      }
      return;
    }
    if (e.pointerType !== "touch") hoverAt(e);
  });
  function lift(e) {
    pts.delete(e.pointerId);
    if (pinch) { if (pts.size < 2) pinch = null; press = null; return; }
    if (!press || press.id !== e.pointerId) return;
    const moved = press.moved;
    press = null;
    if (moved || e.type === "pointercancel") { canvas.style.cursor = goal.z > 1.01 ? "grab" : "default"; return; }
    const [sx, sy] = local(e);
    const f = pick(sx, sy);
    if (!f) { closeInfo(); return; }
    hist.length = 0; current = null;
    if (f.perfumer) openInfo("perfumer", f.perfumer);
    else if (f.perfume) openInfo("perfume", f.perfume);
    else openInfo("house", f.house);
  }
  canvas.addEventListener("pointerup", lift);
  canvas.addEventListener("pointercancel", lift);
  canvas.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") { if (!pinned) setFocus(null); tip.hidden = true; } });
  canvas.addEventListener("dblclick", (e) => { const [sx, sy] = local(e); zoomAt(sx, sy, 2.4); });
  canvas.addEventListener("wheel", (e) => {
    if (narrow && !e.ctrlKey && goal.z <= 1.01) return;
    e.preventDefault();
    const [sx, sy] = local(e);
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    zoomAt(sx, sy, Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0022)));
    tip.hidden = true;
  }, { passive: false });
  document.querySelectorAll(".t2-zoom [data-z]").forEach((b) => b.addEventListener("click", () => {
    const k = +b.dataset.z;
    if (!k) go({ x: W / 2, y: H / 2, z: 1 });
    else zoomAt(narrow ? W / 2 : G.left + (W - G.left) / 2, H / 2, k > 0 ? 1.8 : 1 / 1.8);
  }));
  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    if (e.key === "+" || e.key === "=") zoomAt(narrow ? W / 2 : G.left + (W - G.left) / 2, H / 2, 1.5);
    else if (e.key === "-" || e.key === "_") zoomAt(narrow ? W / 2 : G.left + (W - G.left) / 2, H / 2, 1 / 1.5);
    else if (e.key === "0") go({ x: W / 2, y: H / 2, z: 1 });
    else if (e.key === "Escape" && !info.hidden) closeInfo();
    else if (e.key.startsWith("Arrow") && goal.z > 1.01) {
      const s = 80 / goal.z;
      go({ x: goal.x + (e.key === "ArrowRight" ? s : e.key === "ArrowLeft" ? -s : 0), y: goal.y + (e.key === "ArrowDown" ? s : e.key === "ArrowUp" ? -s : 0), z: goal.z });
      e.preventDefault();
    }
  });
  // the two lists down the left
  [[persList, (li) => ["perfumer", PER[+li.dataset.per]]], [housesList, (li) => ["house", HOU[+li.dataset.house]]]].forEach(([list, of]) => {
    list.addEventListener("pointerover", (e) => {
      const li = e.target.closest("li"); if (!li || pinned) return;
      const [kind, obj] = of(li);
      setFocus(kind === "perfumer" ? { perfumer: obj } : { house: obj });
    });
    list.addEventListener("pointerleave", () => { if (!pinned) setFocus(null); });
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li"); if (!li) return;
      hist.length = 0; current = null;
      const [kind, obj] = of(li);
      openInfo(kind, obj);
      showOn(kind, obj);
    });
    list.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.closest("li")) { e.preventDefault(); e.target.click(); } });
  });

  addEventListener("resize", () => { layout(); kick(); });
  document.addEventListener("visibilitychange", kick);
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { stillDirty = true; kick(); });
  kick();

  // for the tests: where a thing stands on the screen, and what is shown
  window.TestPage2 = {
    focus: () => focus && (focus.perfumer ? "perfumer:" + focus.perfumer.id : focus.house ? "house:" + focus.house.id : "perfume:" + focus.perfume.n),
    perfumers: NP, houses: NH, perfumes: PERF.length,
    zoom: () => cam.z, goal: () => goal.z, moving: () => moving,
    info: () => (current ? { kind: current.kind, name: current.kind === "perfumer" ? perName(current.obj) : current.kind === "house" ? current.obj.name : current.obj.n } : null),
    at(kind, name) {
      const b = canvas.getBoundingClientRect();
      let w;
      if (kind === "perfumer") { const p = PER.find((x) => perName(x) === name || x.id === name); w = at(G.rd, angleOfPer(p)); }
      else if (kind === "perfume") { const e = PERF.find((x) => x.n === name); w = at(G.rt - 3, perfAngle(e)); }
      else { const h = HOU.find((x) => x.name === name || x.id === name); w = at(G.ra + fs(14, 0.35), placeNames()[h.k]); }
      const [sx, sy] = toScreen(w[0], w[1]);
      return [b.left + sx, b.top + sy];
    },
  };
})();

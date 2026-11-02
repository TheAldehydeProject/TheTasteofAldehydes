# The Perfumers' Ledger

The store of facts the Perfumers page is built from: every perfume on the site,
and every perfume of Prin Lomros' three houses (Strangers Parfumerie, Parfum
Prissana and PRIN), each with its perfumer(s), the year it was made and its house —
and, under them, what is known of each perfumer and each house, and the sources.

**This file is the only place any of it is written by hand.** `tools/perfumers/build.py`
reads it and writes `perfumers-data.js` (what the drawing reads) and the index at the foot
of `perfumers/index.html` (what a reader without the drawing, and the site's search, read).
Change something here, then run `python3 tools/perfumers/build.py` and `python3 tools/versions.py`.

## How to read and edit it

- **Perfumer(s)**: as the source names them; two or more are separated by `;`. Empty when no
  source found names one — the page files those under *Perfumer not found*.
- **Credit** says how sure the line is:
  - `named` — a source names this perfumer for *this* perfume;
  - `house` — a source names this person as the house's own (or only) perfumer, but none names
    the nose of this particular perfume;
  - `none` — no source found names a perfumer.
- **Year**: the year the source gives for its first release. Empty when no source gave one.
- **On site**: where the perfume is written about on this site (`page#part-NN`), or `—`.
  The build checks every one of these against the page.
- **Sources**: the numbers of the sources at the foot of this file.
- Nothing here is guessed. Where a source could not be found the cell is left empty and the
  page says *not found* — never a year or a name that was not read somewhere.

## Perfumes

| Perfume | Perfumer(s) | Credit | Year | House | On site | Sources | Note |
|---|---|---|---|---|---|---|---|
| Bindebole | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-01 | S01 |  |
| Boreal | Nicholas Nilsson | named | 2020 | Pineward | houses/pineward.html#part-02 | S01 |  |
| Brokilän | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-03 | S01 |  |
| Cotswold | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-04 | S01 | A 2025 version also exists. |
| Eldritch | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-05 | S01 | A 2026 version also exists. |
| Fanghorn II | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-06 | S01 |  |
| Funerie | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-07 | S01 |  |
| Juniperus | Nicholas Nilsson | named | 2024 | Pineward | houses/pineward.html#part-08 | S01 |  |
| Murkwood | Nicholas Nilsson | named | 2020 | Pineward | houses/pineward.html#part-09 | S01 |  |
| Nocturnis | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-10 | S01 |  |
| Oxylus | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-11 | S01 |  |
| Snoqualmie | Nicholas Nilsson | named | 2024 | Pineward | houses/pineward.html#part-12 | S01 |  |
| Sturbridge | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-13 | S01 |  |
| White Fir | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-14 | S01 | A 2025 version also exists. |
| Bucolic | Nicholas Nilsson | named | 2024 | Pineward | houses/pineward.html#part-15 | S01 |  |
| Hayloft | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-16 | S01 |  |
| Hayride | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-17 | S01 |  |
| Pastoral | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-18 | S01 |  |
| Shire | Nicholas Nilsson | named | 2024 | Pineward | houses/pineward.html#part-19 | S01 |  |
| Steading | Nicholas Nilsson | named | 2020 | Pineward | houses/pineward.html#part-20 | S01 |  |
| Christmas Wine | Nicholas Nilsson | named | 2020 | Pineward | houses/pineward.html#part-21 | S01 | A 2025 version also exists. |
| Gingerbread | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-22 | S01 | A 2025 version also exists. |
| Glühwein | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-23 | S01 | A 2025 version also exists. |
| Revelries | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-24 | S01 |  |
| Acadian | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-25 | S01 |  |
| Coastal Veil | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-26 | S01 |  |
| Gingermoss | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-27 | S01 |  |
| Subalpine | Nicholas Nilsson | named | 2025 | Pineward | houses/pineward.html#part-28 | S01 |  |
| Akero | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-29 | S01 |  |
| Apple Tabac | Nicholas Nilsson | named | 2020 | Pineward | houses/pineward.html#part-30 | S01 |  |
| Caravansary | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-31 | S01 |  |
| Clemenpine | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-32 | S01 |  |
| Coffee Tabac | Nicholas Nilsson | named | 2024 | Pineward | houses/pineward.html#part-33 | S01 |  |
| Delfiño | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-34 | S01 |  |
| Greymist | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-35 | S01 |  |
| Gristmill | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-36 | S01 |  |
| Holy Cross | Nicholas Nilsson | named | 2026 | Pineward | houses/pineward.html#part-37 | S01 |  |
| Icefall | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-38 | S01 |  |
| Ivymoss | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-39 | S01 |  |
| Lime Cola | Nicholas Nilsson | named | 2025 | Pineward | houses/pineward.html#part-40 | S01 |  |
| Meadowmoss | Nicholas Nilsson | named | 2023 | Pineward | houses/pineward.html#part-41 | S01 |  |
| Mint Cocoa | Nicholas Nilsson | named | 2024 | Pineward | houses/pineward.html#part-42 | S01 |  |
| Noki | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-43 | S01 |  |
| Ponderosa | Nicholas Nilsson | named | 2022 | Pineward | houses/pineward.html#part-44 | S01 |  |
| Pumpkivus | Nicholas Nilsson | named | 2025 | Pineward | houses/pineward.html#part-45 | S01 |  |
| Tome | Nicholas Nilsson | named | 2025 | Pineward | houses/pineward.html#part-46 | S01 |  |
| Treacle | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-47 | S01 |  |
| Velvetine | Nicholas Nilsson | named | 2021 | Pineward | houses/pineward.html#part-48 | S01 | A 2025 version also exists. |
| Amber Zero | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-01 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Aetherialism | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-02 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Incantu | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-03 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Against All Odds | Dan & Roxana Adar | house | 2025 | ADAR | houses/adar.html#part-04 | S10, S11, S13 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| α11 Alpha11 | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-05 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Alta Luna | Dan & Roxana Adar | house | 2025 | ADAR | houses/adar.html#part-06 | S10, S11, S14 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| ADHD | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-07 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Root Code | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-08 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Lignum Dei | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-09 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Lithos Diaphanes Λίθος Διαφανές | Dan & Roxana Adar | house |  | ADAR | houses/adar.html#part-10 | S10, S11 | Credited to the house's own perfumers; ADAR does not name a nose for it. |
| Tyrian | Dan & Roxana Adar | named | 2026 | ADAR | houses/adar.html#part-11 | S12, S10 | The nose named is Rox (Roxana) Adar. |
| Burning Bridges | Goran Bajazetov | named | 2026 | Almost Human | houses/almost-human.html#part-01 | S15 |  |
| Dear Future | Goran Bajazetov | named | 2026 | Almost Human | houses/almost-human.html#part-02 | S15 |  |
| Desert Hope | Goran Bajazetov | named | 2026 | Almost Human | houses/almost-human.html#part-03 | S15 |  |
| Ritual Code | Goran Bajazetov | named | 2026 | Almost Human | houses/almost-human.html#part-04 | S15, S17 |  |
| Silent Rain | Goran Bajazetov | named | 2026 | Almost Human | houses/almost-human.html#part-05 | S15 |  |
| Amaretto Jazz in the Melting Room | David-Lev Jipa-Slivinschi | named | 2024 | Ataraxia | houses/ataraxia.html#part-01 | S18 |  |
| Deity | Sy Truong | named | 2025 | Ataraxia | houses/ataraxia.html#part-02 | S20 | Made with the house's creative director, Tudor Ristea. |
| My Doll’s Makeup |  | none |  | Ataraxia | houses/ataraxia.html#part-03 | S78 |  |
| Spinal Fluid |  | none | 2025 | Ataraxia | houses/ataraxia.html#part-04 | S21, S22 |  |
| Vestibule | David-Lev Jipa-Slivinschi | named | 2024 | Ataraxia | houses/ataraxia.html#part-05 | S19 |  |
| 5 Years Anniversary |  | none |  | Grande Parfums | houses/grande-parfums.html#part-01 | S25 |  |
| Ambresso |  | none |  | Grande Parfums | houses/grande-parfums.html#part-02 | S25 |  |
| Ancient Oud |  | none |  | Grande Parfums | houses/grande-parfums.html#part-03 | S25 |  |
| Choco Powder |  | none |  | Grande Parfums | houses/grande-parfums.html#part-04 | S25 |  |
| Cookie something (?) |  | none |  | Grande Parfums | houses/grande-parfums.html#part-05 | S25 |  |
| Cuore |  | none | 2024 | Grande Parfums | houses/grande-parfums.html#part-06 | S26, S25 |  |
| Dreaming Maldives |  | none |  | Grande Parfums | houses/grande-parfums.html#part-07 | S25 |  |
| Giardino di Sorrento |  | none |  | Grande Parfums | houses/grande-parfums.html#part-08 | S25 |  |
| Hot Stuff |  | none |  | Grande Parfums | houses/grande-parfums.html#part-09 | S25 |  |
| Intimate Spell |  | none |  | Grande Parfums | houses/grande-parfums.html#part-10 | S25 |  |
| Karak & Shisha |  | none |  | Grande Parfums | houses/grande-parfums.html#part-11 | S25 |  |
| Mystical Incense |  | none |  | Grande Parfums | houses/grande-parfums.html#part-12 | S25 |  |
| Vanilla Ash |  | none |  | Grande Parfums | houses/grande-parfums.html#part-13 | S25 |  |
| Vintage Memoir |  | none |  | Grande Parfums | houses/grande-parfums.html#part-14 | S25 |  |
| White Label |  | none |  | Grande Parfums | houses/grande-parfums.html#part-15 | S25 |  |
| Belle Âme | Antoine Lie | named | 2022 | Les Abstraits | houses/les-abstraits.html#part-01 | S28, S27 |  |
| Des Cendres | Antoine Lie | named | 2023 | Les Abstraits | houses/les-abstraits.html#part-02 | S29, S27 |  |
| La Douleur Exquise | Antoine Lie | named | 2022 | Les Abstraits | houses/les-abstraits.html#part-03 | S31, S27 |  |
| Philosopher’s Walk | Antoine Lie | named | 2025 | Les Abstraits | houses/les-abstraits.html#part-04 | S30, S27 |  |
| Kong | Mathew Schmuelian | house |  | Lost Tribe | houses/lost-tribe.html#part-01 | S46, S48 | Credited to the house's founder and perfumer; no source names a nose for this one. |
| Watch King | Mathew Schmuelian | house |  | Lost Tribe | houses/lost-tribe.html#part-02 | S46, S48 | Credited to the house's founder and perfumer; no source names a nose for this one. |
| Dirty Soda | Mathew Schmuelian | house |  | Lost Tribe | houses/lost-tribe.html#part-04 | S46, S48 | Credited to the house's founder and perfumer; no source names a nose for this one. |
| Equatorial | Mathew Schmuelian | house |  | Lost Tribe | houses/lost-tribe.html#part-05 | S46, S48 | Credited to the house's founder and perfumer; no source names a nose for this one. |
| Santal Absolu | Mathew Schmuelian | house |  | Lost Tribe | houses/lost-tribe.html#part-06 | S46, S48 | Credited to the house's founder and perfumer; no source names a nose for this one. |
| Pan’s Labyrinth | Mathew Schmuelian; Rajesh Balkrishnan | named |  | Lost Tribe | houses/lost-tribe.html#part-03 | S47 |  |
| Nymphaea Caerulea | Aichi Liu | house |  | Om Parfums | houses/om-parfums.html#part-01 | S42, S43 | Credited to the house's only perfumer. |
| Lust | Aichi Liu | house | 2023 | Om Parfums | houses/om-parfums.html#part-02 | S42, S43 | Credited to the house's only perfumer. |
| Burnana | Aichi Liu | house | 2024 | Om Parfums | houses/om-parfums.html#part-03 | S42, S43 | Credited to the house's only perfumer. |
| Cannabis Café | Aichi Liu | house |  | Om Parfums | houses/om-parfums.html#part-04 | S42, S43 | Credited to the house's only perfumer. |
| Dark Night of the Soul | Aichi Liu | house | 2024 | Om Parfums | houses/om-parfums.html#part-05 | S42, S43 | Credited to the house's only perfumer. |
| This Too Shall Pass | Aichi Liu | house |  | Om Parfums | houses/om-parfums.html#part-06 | S42, S43 | Credited to the house's only perfumer. |
| When the Linden Blooms | Aichi Liu | house | 2024 | Om Parfums | houses/om-parfums.html#part-07 | S42, S43 | Credited to the house's only perfumer. |
| Oud de Pasión | Aichi Liu | house |  | Om Parfums | houses/om-parfums.html#part-08 | S42, S43 | Credited to the house's only perfumer. |
| Smoke Oud | Aichi Liu | house |  | Om Parfums | houses/om-parfums.html#part-09 | S42, S43 | Credited to the house's only perfumer. |
| Dragon’s Breath | Aichi Liu | named | 2026 | Outsider Parfums | houses/outsider-parfums.html#part-01 | S44 |  |
| Draco | Aichi Liu | house |  | Outsider Parfums | houses/outsider-parfums.html#part-02 | S44, S43 | Credited to the perfumer of Om Parfums, which makes and sells Outsider. |
| Xocolate Crotch | Aichi Liu | house |  | Outsider Parfums | houses/outsider-parfums.html#part-03 | S44, S43 | Credited to the perfumer of Om Parfums, which makes and sells Outsider. |
| Guilty as Charged | Aichi Liu | house |  | Outsider Parfums | houses/outsider-parfums.html#part-04 | S44, S43 | Credited to the perfumer of Om Parfums, which makes and sells Outsider. |
| Amaretto Coffee | Aichi Liu | named |  | Outsider Parfums | houses/outsider-parfums.html#part-05 | S45 |  |
| Guitarist |  | none |  | Qimu & Musicians | houses/qimu-and-musicians.html#part-01 | S41 |  |
| Vocal |  | none |  | Qimu & Musicians | houses/qimu-and-musicians.html#part-02 | S41 |  |
| Bassist |  | none |  | Qimu & Musicians | houses/qimu-and-musicians.html#part-03 | S41 |  |
| Drummer | Qimu | named |  | Qimu & Musicians | houses/qimu-and-musicians.html#part-04 | S41 |  |
| Bad Lily | Michael Nordstrand | named | 2024 | Tale Parfums | houses/tale-parfums.html#part-01 | S35, S34 |  |
| Fleurt |  | none |  | Tale Parfums | houses/tale-parfums.html#part-02 | S36 |  |
| Rouse |  | none |  | Tale Parfums | houses/tale-parfums.html#part-03 | S36 |  |
| Water Me | Chad Hodge | named |  | Tale Parfums | houses/tale-parfums.html#part-04 | S34 |  |
| 3 Feet 5 |  | none | 2024 | Tombstone | houses/tombstone.html#part-01 | S38 |  |
| Evergrow |  | none | 2025 | Tombstone | houses/tombstone.html#part-02 | S39 | A reworking of His Lordship's Backyard Roses, released under this name in 2025. |
| No Need to Come By |  | none |  | Tombstone | houses/tombstone.html#part-03 | S40 |  |
| Sing at My Funeral |  | none |  | Tombstone | houses/tombstone.html#part-04 | S40 |  |
| Sweet Coffin |  | none | 2024 | Tombstone | houses/tombstone.html#part-05 | S37 |  |
| Kogen |  | none | 2024 | Apoteker Tepe | houses/apoteker-tepe.html#part-01 | S07, S05 | Made after Pineward took over the line; no perfumer is named for it. |
| The Holy Mountain | Holladay Penick Saltz | named | 2015 | Apoteker Tepe | houses/apoteker-tepe.html#part-02 | S06, S09 |  |
| Karasu | Holladay Penick Saltz | named | 2016 | Apoteker Tepe | houses/apoteker-tepe.html#part-04 | S06, S09 |  |
| The Peradam | Holladay Penick Saltz | named | 2015 | Apoteker Tepe | houses/apoteker-tepe.html#part-05 | S06, S09 |  |
| Pale Fire | Holladay Penick Saltz | named | 2016 | Apoteker Tepe | houses/apoteker-tepe.html#part-06 | S06, S09 |  |
| Anabasis | Holladay Penick Saltz | named | 2015 | Apoteker Tepe | houses/apoteker-tepe.html#part-07 | S06, S09 |  |
| After the Flood | Holladay Penick Saltz | named | 2015 | Apoteker Tepe | houses/apoteker-tepe.html#part-08 | S06, S09 |  |
| Brother Night | Holladay Penick Saltz | named | 2016 | Apoteker Tepe | houses/apoteker-tepe.html#part-03 | S06, S08, S82, S83 | Its first version: made in 2016 as a boutique-only release, sold only at the Neon Heart shop in New Orleans; Pineward brought it back in 2022, the year Parfumo and this site's own page give. |
| CV99 |  | none |  | Lussur | individual-fragrances/individual-fragrances.html#part-01 | S61 |  |
| De Profundis | Christopher Sheldrake | named | 2011 | Serge Lutens | individual-fragrances/individual-fragrances.html#part-02 | S49 |  |
| Haxan | Prin Lomros | named | 2018 | Parfum Prissana | individual-fragrances/individual-fragrances.html#part-03 | S72 |  |
| Tobacolor | François Demachy | named | 2021 | Dior | individual-fragrances/individual-fragrances.html#part-04 | S52 |  |
| Flamenco EDP | Ramón Monegal | named | 2017 | Ramón Monegal | individual-fragrances/individual-fragrances.html#part-05 | S55 |  |
| French Riviera | Pierre Montale | named | 2022 | Mancera | individual-fragrances/individual-fragrances.html#part-06 | S58 |  |
| Velvet Fog |  | none |  | Casa Goa | individual-fragrances/individual-fragrances.html#part-07 | S62 |  |
| House of Ellixirz |  | none | 2021 | Matca | individual-fragrances/individual-fragrances.html#part-08 | S63 |  |
| Fir of the Light | Jakub Pietrynka | named |  | JMP Artisan Perfumes | individual-fragrances/individual-fragrances.html#part-09 | S64 |  |
| Fir of the Dark | Jakub Pietrynka | named | 2024 | JMP Artisan Perfumes | individual-fragrances/individual-fragrances.html#part-10 | S64 |  |
| Quintessentially Amber | Sultan Pasha; Christian Carbonnel | named | 2025 | Sultan Pasha Perfumes | individual-fragrances/individual-fragrances.html#part-11 | S66 |  |
| Forbidden Flower | Russian Adam | named | 2024 | Areej Le Doré | individual-fragrances/individual-fragrances.html#part-12 | S68 |  |
| Ore | Josh Lobb | named | 2009 | Slumberhouse | individual-fragrances/individual-fragrances.html#part-13 | S70, S71 | First made in 2009; remade as an extrait, and again in 2022. |
| Salted Green Mango | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Oliver | Prin Lomros | named | 2018 | Strangers Parfumerie | — | S72 |  |
| Cigar Rum | Prin Lomros | named | 2017 | Strangers Parfumerie | — | S72 |  |
| SM Café | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Burning Ben | Prin Lomros | named | 2018 | Strangers Parfumerie | — | S72 |  |
| Sweet Farewell | Prin Lomros | named | 2022 | Strangers Parfumerie | — | S72 |  |
| Gheorghe | Prin Lomros | named | 2018 | Strangers Parfumerie | — | S72 |  |
| Sweet Celestials | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Muscat Jasmine Tea | Prin Lomros | named | 2024 | Strangers Parfumerie | — | S72 |  |
| Scotch Peat | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Sangre Dulce | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Aroon Sawat | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Red Lime Soda | Prin Lomros | named | 2024 | Strangers Parfumerie | — | S72 |  |
| Sombre | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Cherry Amaretto | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Kira Kira | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Les Mauvais Garçons | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Comme un Carrousel | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Caffeine Honey | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Spring Ambience | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| A Sorta Fairytale in Hyde Park | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Roasted Coffee Cigarette Whisky Come and Get Your Suede Honey Baby | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Wicked John | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Yuzu Soda | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Yue Tu 月兔 | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Limonsitano | Prin Lomros | named | 2022 | Strangers Parfumerie | — | S72 |  |
| Tokiwa | Prin Lomros | named | 2025 | Strangers Parfumerie | — | S72 |  |
| Ember | Prin Lomros | named | 2017 | Strangers Parfumerie | — | S72 |  |
| Autumn Tea and Yuzu Vanilla | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Fume Ma Peau | Prin Lomros | named | 2017 | Strangers Parfumerie | — | S72 |  |
| Magenta Pop | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Euphories | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Summer Peaches by the Tea Room | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Concrete Forest | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Iridescent Sky | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Lumberjack Cologne | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Rêve du Matin | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Eternal Summer | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Pink Clouds | Prin Lomros | named | 2025 | Strangers Parfumerie | — | S72 |  |
| Sweet Tani | Prin Lomros | named | 2025 | Strangers Parfumerie | — | S72 |  |
| Fleur de Lune | Prin Lomros | named | 2020 | Strangers Parfumerie | — | S72 |  |
| Sweet Muskmelon | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Virginia | Prin Lomros | named | 2018 | Strangers Parfumerie | — | S72 |  |
| Chokedee | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Cigar Rum Intense | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| San Clemente | Prin Lomros | named | 2018 | Strangers Parfumerie | — | S72 |  |
| À la folie | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Cachouli | Prin Lomros | named | 2022 | Strangers Parfumerie | — | S72 |  |
| Cigar Rum (2024) | Prin Lomros | named | 2024 | Strangers Parfumerie | — | S72 |  |
| Guido | Prin Lomros | named | 2024 | Strangers Parfumerie | — | S72 |  |
| Rosa Raimunda | Prin Lomros | named | 2024 | Strangers Parfumerie | — | S72 |  |
| So Fetch! | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Plunge | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Soleil de Thé | Prin Lomros | named | 2024 | Strangers Parfumerie | — | S72 |  |
| Green Lunar | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Lights upon Orange Tree | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Lava Rose | Prin Lomros | named | 2019 | Strangers Parfumerie | — | S72 |  |
| Câlin d'Été | Prin Lomros | named | 2025 | Strangers Parfumerie | — | S72 |  |
| Cornwall Rose | Prin Lomros | named | 2025 | Strangers Parfumerie | — | S72 |  |
| Punk #2077 | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| Rosso Amaretto | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Garden of Eden | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Maia | Prin Lomros | named | 2017 | Strangers Parfumerie | — | S72 |  |
| La Malila | Prin Lomros | named | 2017 | Strangers Parfumerie | — | S72 |  |
| Lom Hom Khao Hom | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Nobles '17 | Prin Lomros | named | 2021 | Strangers Parfumerie | — | S72 |  |
| La Porte | Prin Lomros | named | 2023 | Strangers Parfumerie | — | S72 |  |
| Ma Nishtana | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Nimitr | Prin Lomros | named | 2018 | Parfum Prissana | — | S72 |  |
| Nesnás Qareen | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Natsumeku | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Sahar | Prin Lomros | named | 2024 | Parfum Prissana | — | S72 |  |
| Mohragot | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Dunhuang | Prin Lomros | named | 2022 | Parfum Prissana | — | S72 |  |
| Chetyre | Prin Lomros | named |  | Parfum Prissana | — | S72 |  |
| Tom Yum | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Mandarava | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Thichila | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Akhetaten | Prin Lomros | named | 2024 | Parfum Prissana | — | S72 |  |
| Lágrima Sagrada | Prin Lomros | named | 2025 | Parfum Prissana | — | S72 |  |
| Ayutthaya | Prin Lomros | named | 2022 | Parfum Prissana | — | S72 |  |
| Maruyama 丸山 | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Nefer | Prin Lomros | named |  | Parfum Prissana | — | S72 |  |
| Le Cirque Bleu | Prin Lomros | named | 2017 | Parfum Prissana | — | S72 |  |
| Savitri สาวิตรี | Prin Lomros | named |  | Parfum Prissana | — | S72 |  |
| Karuna | Prin Lomros | named | 2022 | Parfum Prissana | — | S72 |  |
| Tirtha | Prin Lomros | named | 2024 | Parfum Prissana | — | S72 |  |
| Hayra | Prin Lomros | named |  | Parfum Prissana | — | S72 |  |
| Hirun | Prin Lomros | named | 2024 | Parfum Prissana | — | S72 |  |
| Ronda | Prin Lomros | named | 2024 | Parfum Prissana | — | S72 |  |
| Emerald Curry | Prin Lomros | named | 2025 | Parfum Prissana | — | S72 |  |
| Vallée des Roses | Prin Lomros | named |  | Parfum Prissana | — | S72 |  |
| L'Ombre d'Hier | Prin Lomros | named | 2025 | Parfum Prissana | — | S72 |  |
| Gularb Matana | Prin Lomros | named | 2024 | Parfum Prissana | — | S72 |  |
| Keerati | Prin Lomros | named | 2025 | Parfum Prissana | — | S72 |  |
| Apsarah | Prin Lomros | named | 2018 | Parfum Prissana | — | S72 |  |
| Narasimha Attar | Prin Lomros | named | 2019 | Parfum Prissana | — | S72 |  |
| Narasimha Extrait de Parfum | Prin Lomros | named |  | Parfum Prissana | — | S72 |  |
| Mriga มฤค | Prin Lomros | named |  | PRIN | — | S72 |  |
| Saringkarn ศฤงคาร | Prin Lomros | named | 2020 | PRIN | — | S72 |  |
| Mandodari มณโฑ | Prin Lomros | named | 2019 | PRIN | — | S72 |  |
| Varuek วฤค | Prin Lomros | named | 2021 | PRIN | — | S72 |  |
| Nocturnal Poetry | Prin Lomros | named | 2020 | PRIN | — | S72 |  |
| Mongolian Mriga | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Homa | Prin Lomros | named | 2020 | PRIN | — | S72 |  |
| Indigo Night | Prin Lomros | named | 2024 | PRIN | — | S72 |  |
| Aran | Prin Lomros | named | 2019 | PRIN | — | S72 |  |
| Anatolia Anatolia | Prin Lomros | named | 2021 | PRIN | — | S72 |  |
| Arsalan | Prin Lomros | named | 2020 | PRIN | — | S72 |  |
| Ganja Kasturi | Prin Lomros | named | 2021 | PRIN | — | S72 |  |
| Eshu | Prin Lomros | named | 2020 | PRIN | — | S72 |  |
| Oqachol | Prin Lomros | named | 2022 | PRIN | — | S72 |  |
| Onthamara | Prin Lomros | named | 2022 | PRIN | — | S72 |  |
| Rahassanai | Prin Lomros | named | 2022 | PRIN | — | S72 |  |
| Burmite Honey | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Anatolia | Prin Lomros | named | 2019 | PRIN | — | S72 |  |
| Mandodari Mandodari | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Nilmalee | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Krissana | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Rattikarn รัตติกาล | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Fantôme de la Nuit | Prin Lomros | named | 2024 | PRIN | — | S72 |  |
| Kheerin คีรินทร์ | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Nisatiruk นิศาทิรุกข์ | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Naruemit | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Hürrem Sultan | Prin Lomros | named | 2024 | PRIN | — | S72 |  |
| 0125 | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Saringkarn Saringkarn | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Loup | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Ahuizotl | Prin Lomros | named | 2022 | PRIN | — | S72 |  |
| Pathavi | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Nilubol | Prin Lomros | named | 2023 | PRIN | — | S72 |  |
| Sgàil | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Persephone | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| 0225 ๐๒๒๕ | Prin Lomros | named | 2025 | PRIN | — | S72 |  |
| Prajñā | Prin Lomros | named | 2026 | PRIN | — | S72 |  |
| Moha | Prin Lomros | named | 2026 | PRIN | — | S72 |  |
| Dveṣa | Prin Lomros | named | 2026 | PRIN | — | S72 |  |
| Rāga | Prin Lomros | named | 2026 | PRIN | — | S72 |  |

## Perfumers

One block each: the name as the chart shows it, then `sort:` (what A–Z sorts by), `born:`,
`from:`, and one `about:` line per sentence, its sources in square brackets.

### Nicholas Nilsson
- sort: Nilsson
- born: 1995
- from: United States
- about: An American perfumer who grew up among the forests of the Rocky Mountains; Parfumo gives 1995 as the year he was born. [S02]
- about: Self-taught, he founded Pineward in Colorado in 2020, at twenty-five, meaning it to be a line of pine and fir perfumes. [S03, S77]
- about: The money to start it came from donating plasma after he recovered from COVID-19 in June 2020. [S04]
- about: In 2022 he acquired Apoteker Tepe and brought its perfumes back, working with its founder, Holladay Saltz. [S05]
- about: Parfumo knows sixty-two perfumes by him, every one of them for Pineward. [S01]

### Dan & Roxana Adar
- sort: Adar
- from: Romania
- about: The in-house perfumers of ADAR, a European house with Romanian roots. [S10]
- about: ADAR made its perfumes only on private commission until a public collection came out in 2025. [S10]
- about: The house also works with outside perfumers — Antoine Lie, Miguel Matos and Manuel Attardi — and does not say which of them made which perfume; here every ADAR perfume is credited to the house's own pair unless a source names its nose. [S11]
- about: The one that is named is Tyrian (2026), whose nose is given as Rox Adar. [S12]

### Goran Bajazetov
- sort: Bajazetov
- about: The founder and perfumer of Almost Human. [S16]
- about: Before perfume he spent more than twenty years in design, visual design, storytelling and the development of technology products; Parfumo lists the house as a Romanian brand he founded in 2025. [S15]
- about: Its first collection, First Signal, came out in 2026: five perfumes that do without a pyramid of notes and are described instead by how they change on the skin. [S15]

### David-Lev Jipa-Slivinschi
- sort: Jipa-Slivinschi
- from: Romania
- about: Born in Bucharest, of Russian and Ukrainian heritage, he studied film and screenwriting and turned to perfume during the pandemic. [S24]
- about: Self-taught, he founded his own house, Toskovat', in Bucharest in 2022. [S23]
- about: For Ataraxia he is credited with Vestibule and Amaretto Jazz in the Melting Room, both from 2024. [S19, S18]

### Sy Truong
- sort: Truong
- about: Named by Ça Fleure Bon as the perfumer of Ataraxia's Deity (2025), made with the house's creative director, Tudor Ristea. [S20]
- about: Deity was a finalist in the Art and Olfaction Awards. [S22]

### Antoine Lie
- sort: Lie
- born: 1966
- from: France
- about: Born in Strasbourg in 1966. [S32]
- about: He studied chemistry before moving to Grasse to train as a perfumer. [S33]
- about: He has made perfumes for ERIS Parfums, État Libre d'Orange, Comme des Garçons, Houbigant and Les Indémodables. [S27]
- about: Every Les Abstraits perfume is his, made with the house's founder, the fragrance critic and YouTuber Eugen Nizic. [S27]

### Michael Nordstrand
- sort: Nordstrand
- about: Named by Parfumo and by Ça Fleure Bon as the perfumer of Tale Parfum's Bad Lily (2024). [S35, S34]
- about: Nothing more about him has been filed here yet.

### Chad Hodge
- sort: Hodge
- from: United States
- about: A screenwriter, and co-founder of Tale Parfum with its creative director, Diandra Barsalou. [S34]
- about: Ça Fleure Bon credits Water Me to him. [S34]
- about: Tale Parfum was founded in Los Angeles. [S36]

### Qimu
- sort: Qimu
- about: WhatScent names Qimu as the perfumer of Drummer, by the house that carries the name, Qimu & Musicians. [S41]
- about: No source found says who made Guitarist, Vocal or Bassist, so those stand under Perfumer not found.

### Aichi Liu
- sort: Liu
- from: Taiwan
- about: She founded OM Parfum in 2021 and is based in Taiwan; her perfumes draw on films, places, her own experiences and moods. [S42]
- about: Parfumo names her as the house's only perfumer. [S43]
- about: She also makes the perfumes of Outsider Parfum, which OM Parfum markets. [S44, S45]

### Mathew Schmuelian
- sort: Schmuelian
- from: United States
- about: He founded Lost Tribe in New York City in 2022, after years of collecting all-natural, artisanal perfumes, and went on to source his own raw materials. [S46]
- about: Lost Tribe works almost entirely with natural materials, and names him as its perfumer. [S48, S47]
- about: Pan's Labyrinth he composed with the perfumer Rajesh Balkrishnan. [S47]

### Rajesh Balkrishnan
- sort: Balkrishnan
- about: Named as co-perfumer, with Mathew Schmuelian, of Lost Tribe's Pan's Labyrinth. [S47]
- about: Nothing more about him has been filed here yet.

### Holladay Penick Saltz
- sort: Saltz
- from: United States
- about: From the Jackson, Mississippi area, she graduated from the Rhode Island School of Design and specialised in fashion and material culture at Parsons and The New School. [S06]
- about: After studying fragrance formulation and production at Le Labo in New York, she founded Apoteker Tepe in 2014, and ran it until 2018. [S06]
- about: In 2022 Nicholas Nilsson of Pineward acquired the line and brought it back with her help. [S05]

### Christopher Sheldrake
- sort: Sheldrake
- born: 1955
- from: United Kingdom
- about: Born on 11 April 1955 in Madras, India. [S50]
- about: The perfumer Georges Cœur took him on as an apprentice in 1974; he worked at Robertet and at Chanel before meeting Serge Lutens in 1989. [S51]
- about: He went on to make Féminité du Bois (1992), Ambre Sultan (1993) and nearly all of the Serge Lutens line. [S51]
- about: In 2005 he returned to Chanel as perfumer and director of research and development, beside Jacques and later Olivier Polge. [S51, S50]

### François Demachy
- sort: Demachy
- from: France
- about: Born in Cannes and raised in Grasse, where his father ran a pharmacy; he studied dentistry before perfume. [S53]
- about: He was Dior's perfumer-creator from 2006. [S81]
- about: Francis Kurkdjian succeeded him as Dior's chief perfumer in October 2021. [S54]

### Ramón Monegal
- sort: Monegal
- born: 1951
- from: Spain
- about: Born in 1951, of the family behind the Spanish house Myrurgia. [S56, S57]
- about: When Puig stopped producing Myrurgia's perfumes in 2008 he left, and after a year off, in which he wrote a book on perfume, founded the house under his own name in 2009. [S57]

### Pierre Montale
- sort: Montale
- from: France
- about: A self-taught perfumer, trained in materials by a perfumer in Grasse; in 1975 he and his sister founded Comptoir Sud Pacifique, and he later founded Montale Parfums. [S60]
- about: He founded Mancera in 2008; his daughter Amélie became its artistic director in 2017. [S59]

### Jakub Pietrynka
- sort: Pietrynka
- from: Poland
- about: The Polish independent perfumer behind JMP Artisan Perfumes. [S65]
- about: Parfumo knows fifty-five perfumes by him. [S64]

### Sultan Pasha
- sort: Pasha
- about: WhatScent credits Quintessentially Amber (2025) to him, with Christian Carbonnel. [S66]
- about: His house describes it as an amber meant to use every facet of the genre together. [S67]

### Christian Carbonnel
- sort: Carbonnel
- about: Credited by WhatScent, with Sultan Pasha, for Quintessentially Amber (2025). [S66]
- about: Nothing more about him has been filed here yet.

### Russian Adam
- sort: Adam
- about: Ivan Inkin, called Russian Adam: a distiller who founded Areej Le Doré in Thailand in 2017; the house is now based in Indonesia. [S69]
- about: Areej Le Doré specialises in natural oud and sandalwood oils it distils itself. [S69]
- about: Forbidden Flower is from 2024. [S68]

### Josh Lobb
- sort: Lobb
- from: United States
- about: An entirely self-taught perfumer in Portland, Oregon; Slumberhouse began as a collective of artist friends and became his own. [S71]
- about: Ore was one of his first perfumes, in 2009; he remade it as an extrait, and again in 2022. [S70, S71]

### Prin Lomros
- sort: Lomros
- from: Thailand
- about: A Thai perfumer who first studied film, then began his career at PerfumersWorld, a large Thai fragrance company, before founding Pryn Parfum in 2016 as a self-taught perfumer. [S72]
- about: Three lines came of it: Strangers Parfumerie (2017), the one closest to his own life; Parfum Prissana (2018), named after his sister, joining classic structures with an East Asian style; and PRIN (2019), the most personal of the three. [S72]
- about: Several of his perfumes were finalists in the Art and Olfaction Awards — Rosuerrier in 2017, Cigar Rum and Morah in 2018 — and he has made perfumes for Zoologist. [S72]
- about: He also teaches filmmaking at a university in Bangkok. [S74]

## Houses

One block each: `page:` (where it lives on the site, if it does), `founded:`, `from:`, `about:`.

### Pineward
- page: houses/pineward.html
- founded: 2020
- from: United States
- about: Founded in Colorado in 2020 by the self-taught perfumer Nicholas Nilsson. [S03]

### Apoteker Tepe
- page: houses/apoteker-tepe.html
- founded: 2014
- from: United States
- about: Founded in 2014 by Holladay Penick Saltz, who ran it until 2018; acquired in 2022 by Nicholas Nilsson of Pineward, who revived it. [S05, S06]

### ADAR
- page: houses/adar.html
- from: Romania
- about: A European house with Romanian roots whose own perfumers are Dan and Roxana Adar; its first public collection came out in 2025. [S10]

### Almost Human
- page: houses/almost-human.html
- founded: 2025
- from: Romania
- about: Founded in 2025 by its perfumer and creative director, Goran Bajazetov; its first collection came out in 2026. [S15, S16]

### Ataraxia
- page: houses/ataraxia.html
- about: A house of gothic, avant-garde scents; Tudor Ristea is its creative director. [S78, S22]

### Grande Parfums
- page: houses/grande-parfums.html
- founded: 2021
- from: Romania
- about: Grande Perfumes, of Bucharest, created in 2021 by Alex Marian. No source found names the perfumer of its perfumes. [S25]

### Les Abstraits
- page: houses/les-abstraits.html
- about: Founded by the fragrance critic and YouTuber Eugen Nizic; every one of its perfumes is made with Antoine Lie. [S27]

### Tale Parfums
- page: houses/tale-parfums.html
- from: United States
- about: Founded in Los Angeles by the screenwriter Chad Hodge and the creative director Diandra Barsalou. [S36, S34]

### Tombstone
- page: houses/tombstone.html
- about: A house about death and living, each bottle shaped as a tombstone; marketed by Wonder Senses. No source found names its perfumer. [S40, S37]

### Qimu & Musicians
- page: houses/qimu-and-musicians.html
- about: A perfume for each player in a band. WhatScent names Qimu as the perfumer of Drummer. [S41]

### Om Parfums
- page: houses/om-parfums.html
- founded: 2021
- from: Taiwan
- about: OM Parfum, founded in 2021 by Aichi Liu, its only perfumer. [S42, S43]

### Outsider Parfums
- page: houses/outsider-parfums.html
- about: Outsider Parfum, made by Aichi Liu and marketed by OM Parfum. [S44]

### Lost Tribe
- page: houses/lost-tribe.html
- founded: 2022
- from: United States
- about: Founded in New York City in 2022 by Mathew Schmuelian; all-natural perfumes, made by hand. [S46]

### Serge Lutens
- founded: 2000
- from: France
- about: Parfums-Beauté Serge Lutens, his own house since 2000, its perfumes made with Christopher Sheldrake. [S79]

### Dior
- founded: 1947
- from: France
- about: Christian Dior's first perfume, Miss Dior, came out with his first collection in 1947. [S80]

### Ramón Monegal
- founded: 2009
- from: Spain
- about: Founded in 2009 by Ramón Monegal, under his own name. [S57]

### Mancera
- founded: 2008
- from: France
- about: Founded in 2008 by Pierre Montale, with his daughter Amélie as its artistic director since 2017. [S59]

### Casa Goa
- about: No source found names who makes its perfumes. [S62]

### Matca
- about: No source found names who makes its perfumes. [S63]

### Lussur
- from: Italy
- about: An Italian house from Modena, founded by Lucas Chemelli. No source found names the perfumer of CV99. [S61]

### JMP Artisan Perfumes
- from: Poland
- about: The house of the Polish independent perfumer Jakub Pietrynka. [S65]

### Sultan Pasha Perfumes
- about: The house of the perfumer Sultan Pasha. [S67]

### Areej Le Doré
- founded: 2017
- from: Indonesia
- about: Founded in Thailand in 2017 by the distiller Russian Adam; now based in Indonesia. [S69]

### Slumberhouse
- from: United States
- about: Josh Lobb's house, in Portland, Oregon. [S71]

### Strangers Parfumerie
- founded: 2017
- from: Thailand
- about: Founded in 2017 by Prin Lomros; the line closest to his own life. [S73, S72]

### Parfum Prissana
- founded: 2018
- from: Thailand
- about: Founded in 2018 by Prin Lomros and named after his sister; Asian history, cuisine and myth in classic structures. [S72, S75]

### PRIN
- founded: 2019
- from: Thailand
- about: Founded in 2019 by Prin Lomros; his signature line. [S72, S76]

## Sources

MLA 8, the site's format. One line each: its number, then the citation, then `|` and the address.

- S01: “Nicholas Nilsson.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumers/nicholas-nilsson
- S02: “Pineward: Interesting Facts.” *Parfumo*, parfumo.net. Accessed 2 Nov. 2026. | https://www.parfumo.net/PerfumeBrand/pineward
- S03: “Pineward Perfumes.” *Scent Verdict*, scentverdict.com. Accessed 2 Nov. 2026. | https://scentverdict.com/brand/pineward-perfumes
- S04: “Pineward Perfumes.” *Perfume Posse*, perfumeposse.com. Accessed 2 Nov. 2026. | https://perfumeposse.com/2021/08/03/pineward-perfumes
- S05: “Apoteker Tepe: All Perfumes & Information.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/Apoteker_Tepe
- S06: “Holladay Saltz.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumers/Holladay_Saltz
- S07: “Kogen.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/Apoteker_Tepe/kogen
- S08: “Apoteker Tepe returns!.” *Basenotes*, basenotes.com. Accessed 2 Nov. 2026. | https://basenotes.com/community/threads/apoteker-tepe-returns.524188/
- S09: The Taste of Aldehydes. “Apoteker Tepe (the years each was made, as the owner wrote them).” *The Taste of Aldehydes*. | SITE:houses/apoteker-tepe.html
- S10: “Adar.” *Scent Split*, scentsplit.com. Accessed 2 Nov. 2026. | https://www.scentsplit.com/collections/adar
- S11: “Adar (Spanish edition of the house page).” *Scent Split*, scentsplit.com. Accessed 2 Nov. 2026. | https://www.scentsplit.com/es/collections/adar
- S12: “Adar – Tyrian.” *The Perfumery Barcelona*, theperfumerybarcelona.com. Accessed 2 Nov. 2026. | https://www.theperfumerybarcelona.com/en/?p=27314
- S13: “Against all Odds.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/adar/against-all-odds
- S14: “Alta Luna.” *Scent Split*, scentsplit.com. Accessed 2 Nov. 2026. | https://www.scentsplit.com/es/products/adar-alta-luna
- S15: “Almost Human: All Perfumes & Information.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/almost-human
- S16: “Almost Human: Brand Profile.” *Pitti Fragranze*, fragranze.pittimmagine.com. Accessed 2 Nov. 2026. | https://fragranze.pittimmagine.com/en/exhibitors/A/almost-human
- S17: “Almost Human – Ritual Code.” *The Perfumery Barcelona*, theperfumerybarcelona.com. Accessed 2 Nov. 2026. | https://www.theperfumerybarcelona.com/en/producto/almost-human-ritual-code/
- S18: “Amaretto Jazz in the Melting Room (2024).” *ScentAdvice*, scentadvice.com. Accessed 2 Nov. 2026. | https://scentadvice.com/amaretto-jazz-in-the-melting-room-2024-toskovat/
- S19: “Ataraxia Vestibule.” *WhatScent*, whatscent.app. Accessed 2 Nov. 2026. | https://whatscent.app/nl/perfume/vestibule-by-ataraxia-1789572525295?hl=nl
- S20: “Ataraxia Perfumery DEITY (Sy Truong) 2025.” *Ça Fleure Bon*, cafleurebon.com. Accessed 2 Nov. 2026. | https://cafleurebon.com/ataraxia-perfumery-deity-sy-truong-2025-plus-divine-honey-giveaway/
- S21: “Spinal Fluid.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/ataraxia/spinal-fluid
- S22: “Spinal Fluid.” *Turin, Luca*, lucaturin.substack.com. Accessed 2 Nov. 2026. | https://lucaturin.substack.com/p/spinal-fluid
- S23: “Toskovat'.” *Scento*, scento.com. Accessed 2 Nov. 2026. | https://www.scento.com/brand/toskovat
- S24: “Toskovat.” *Parfinity*, parfinity.com. Accessed 2 Nov. 2026. | https://www.parfinity.com/en/brand/toskovat
- S25: “Grande Perfumes S.R.L..” *OnCosmetics*, oncosmetics.com. Accessed 2 Nov. 2026. | https://oncosmetics.com/company/grande-perfumes-s-r-l/
- S26: “Cuore Grande.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Parfums/grande/cuore-grande
- S27: “Les Abstraits.” *Sainte Cellier*, saintecellier.com. Accessed 2 Nov. 2026. | https://saintecellier.com/collections/les-abstraits
- S28: “Belle Âme.” *Sainte Cellier*, saintecellier.com. Accessed 2 Nov. 2026. | https://saintecellier.com/products/belle-ame
- S29: “Des Cendres.” *Sainte Cellier*, saintecellier.com. Accessed 2 Nov. 2026. | https://saintecellier.com/en-my/products/des-cendres
- S30: “Philosopher's Walk.” *Sainte Cellier*, saintecellier.com. Accessed 2 Nov. 2026. | https://saintecellier.com/products/philosophers-walk
- S31: “Les Abstraits La Douleur Exquise.” *Noah*, noah.com.au. Accessed 2 Nov. 2026. | https://noah.com.au/products/les-abstraits-la-douleur-exquise
- S32: “Antoine Lie: The Abstract Perfumer Redefining Modern Fragrance.” *Parfinity*, next.parfinity.com. Accessed 2 Nov. 2026. | https://next.parfinity.com/en/perfumer/antoine-lie
- S33: “Antoine Lie.” *Luckyscent*, luckyscent.com. Accessed 2 Nov. 2026. | https://www.luckyscent.com/perfumers/antoine-lie
- S34: “Tale Parfum Bad Lily (Michael Nordstrand) 2024.” *Ça Fleure Bon*, cafleurebon.com. Accessed 2 Nov. 2026. | https://cafleurebon.com/tale-parfum-bad-lily-michael-nordstrand-2024-plus-surreal-muget-giveaway/
- S35: “Bad Lily.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/tale-parfum/bad-lily
- S36: “TALE Parfum Bad Lily Eau de Parfum.” *Stéle*, stele.nyc. Accessed 2 Nov. 2026. | https://stele.nyc/products/tale-bad-lily-eau-de-parfum
- S37: “Sweet Coffin.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/tombstone/sweet-coffin
- S38: “3 Feet 5.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/tombstone/3-feet-5
- S39: “Evergrow.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/tombstone/evergrow
- S40: “Tombstone: Brand Profile.” *Pitti Fragranze*, fragranze.pittimmagine.com. Accessed 2 Nov. 2026. | https://fragranze.pittimmagine.com/en/exhibitors/T/tombstone
- S41: “Qimu & Musicians Drummer.” *WhatScent*, whatscent.app. Accessed 2 Nov. 2026. | https://whatscent.app/perfume/drummer-1783425703668
- S42: “OM Parfum: All Perfumes & Information.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/om-parfum
- S43: “OM Parfum: Info and Facts.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/PerfumeBrand/om-parfum
- S44: “Dragon's Breath.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/outsider-parfum/dragon-s-breath
- S45: “Amaretto Coffee.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/outsider-parfum/amaretto-coffee
- S46: “Lost Tribe.” *Scent Verdict*, scentverdict.com. Accessed 2 Nov. 2026. | https://scentverdict.com/brand/lost-tribe
- S47: “Lost Tribe Pan's Labyrinth v2 Extrait.” *Venba Fragrance*, venbafragrance.com. Accessed 2 Nov. 2026. | https://www.venbafragrance.com/products/lost-tribe-pans-labyrinth-v2-extrait
- S48: “Lost Tribe Fougère Rouge Elixir de Parfum.” *Stéle*, stele.nyc. Accessed 2 Nov. 2026. | https://stele.nyc/products/lost-tribe-fougere-rouge-elixir-de-parfum
- S49: “Serge Lutens de Profundis.” *Surrender to Chance*, surrendertochance.com. Accessed 2 Nov. 2026. | https://surrendertochance.com/serge-lutens-de-profundis/?revpage=2
- S50: “Christopher Sheldrake.” *Wikipedia*, en.wikipedia.org. Accessed 2 Nov. 2026. | https://en.wikipedia.org/wiki/Christopher_Sheldrake
- S51: “Christopher Sheldrake.” *The Fragrance Foundation UK*, fragrancefoundation.org.uk. Accessed 2 Nov. 2026. | https://www.fragrancefoundation.org.uk/christopher-sheldrake
- S52: “Tobacolor by Dior.” *Scento*, scento.com. Accessed 2 Nov. 2026. | https://www.scento.com/perfumes/tobacolor-dior
- S53: “François Demachy.” *Wikipedia*, en.wikipedia.org. Accessed 2 Nov. 2026. | https://en.wikipedia.org/wiki/Fran%C3%A7ois_Demachy
- S54: “François Demachy.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumers/Franois_Demachy
- S55: “Ramon Monegal Flamenco ~ new perfume.” *Now Smell This*, nstperfume.com. Accessed 2 Nov. 2026. | https://nstperfume.com/2017/04/29/ramon-monegal-flamenco-new-perfume/
- S56: “Ramón Monegal: Interesting Facts.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/PerfumeBrand/Ramon_Monegal
- S57: “Myrurgia.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/PerfumeBrand/Myrurgia
- S58: “Mancera French Riviera.” *Scent Verdict*, scentverdict.com. Accessed 2 Nov. 2026. | https://scentverdict.com/perfume/mancera-french-riviera-eau-de-parfum
- S59: “Mancera Catalogue.” *Mancera*, manceraparfums.com. Accessed 2 Nov. 2026. | https://manceraparfums.com/us/upload/Mancera_Catalogue.pdf
- S60: “Mancera.” *Pamco*, pamcogrp.com. Accessed 2 Nov. 2026. | https://www.pamcogrp.com/catalogues/perfume/MANCERA.pdf
- S61: “Introducing Lussur – Italian niche perfumery.” *Basenotes*, basenotes.com. Accessed 2 Nov. 2026. | https://basenotes.com/goto/post?id=6402949
- S62: “Velvet Fog – 50ml.” *Spezieri*, spezieri.com. Accessed 2 Nov. 2026. | https://spezieri.com/en/velvet-fog-50-ml-casa-goa
- S63: “MATCA.” *Fragplace*, fragplace.com. Accessed 2 Nov. 2026. | https://fragplace.com/ja-US/brands/1172/matca.md
- S64: “Jakub Pietrynka.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumers/jakub-pietrynka
- S65: “JMP Artisan Perfumes.” *Luckyscent*, luckyscent.com. Accessed 2 Nov. 2026. | https://www.luckyscent.com/brand/871/jmp-artisan-perfumes?section=1
- S66: “Quintessentially Amber.” *WhatScent*, whatscent.app. Accessed 2 Nov. 2026. | https://whatscent.app/perfume/quintessentially-amber-1784060250942
- S67: “Quintessentially Amber by Sultan Pasha Perfumes.” *Luckyscent*, luckyscent.com. Accessed 2 Nov. 2026. | https://www.luckyscent.com/products/quintessentially-amber-by-sultan-pasha-perfumes
- S68: “Areej Le Dore Forbidden Flower.” *Fragrance Samples UK*, fragrancesamplesuk.com. Accessed 2 Nov. 2026. | https://www.fragrancesamplesuk.com/products/areej-le-dore-fordbidden-flower
- S69: “Areej Le Doré: Interesting Facts.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/Areej_Le_Dore?col_id=2278
- S70: “Niche Fragrance Review: slumberhouse Ore.” *Ça Fleure Bon*, cafleurebon.com. Accessed 2 Nov. 2026. | https://cafleurebon.com/niche-fragrance-review-slumberhouse-ore-better-the-second-time-draw/
- S71: “Josh Lobb.” *Luckyscent*, checkout.luckyscent.com. Accessed 2 Nov. 2026. | https://checkout.luckyscent.com/collections/perfumer-josh-lobb.oembed
- S72: “Prin Lomros.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumers/Prin_Lomros
- S73: “Strangers Parfumerie: All Perfumes & Information.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/Strangers_Parfumerie
- S74: “Strangers Parfumerie.” *Bloom Perfumery*, bloomperfume.com. Accessed 2 Nov. 2026. | https://bloomperfume.com/collections/strangers-parfumerie/tag-sexy
- S75: “Parfum Prissana.” *Luckyscent*, luckyscent.com. Accessed 2 Nov. 2026. | https://www.luckyscent.com/brand/843/parfum-prissana?f=keyword%3D124
- S76: “PRIN.” *Luckyscent*, luckyscent.com. Accessed 2 Nov. 2026. | https://www.luckyscent.com/brand/847/prin
- S77: “Pineward: All Perfumes & Information.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/pineward?o=y_desc
- S78: “Ataraxia Perfumery.” *Thingtesting*, thingtesting.com. Accessed 2 Nov. 2026. | https://thingtesting.com/brands/ataraxia-perfumery
- S79: “Serge Lutens.” *Jarrold*, jarrold.co.uk. Accessed 2 Nov. 2026. | https://jarrold.co.uk/brands/serge-lutens
- S80: “Dior Women's Perfume.” *Harrods*, harrods.com. Accessed 2 Nov. 2026. | https://www.harrods.com/en-tz/designers/dior/perfume/womens-perfume
- S81: “François Demachy.” *The Fragrance Foundation UK*, fragrancefoundation.org.uk. Accessed 2 Nov. 2026. | https://fragrancefoundation.org.uk/francois-demanchy
- S82: “Brother Night by Apoteker Tepe.” *Basenotes*, basenotes.com. Accessed 2 Nov. 2026. | https://basenotes.com/fragrances/brother-night-by-apoteker-tepe.26191067
- S83: “Brother Night by Apoteker Tepe.” *Parfumo*, parfumo.com. Accessed 2 Nov. 2026. | https://www.parfumo.com/Perfumes/Apoteker_Tepe/brother-night

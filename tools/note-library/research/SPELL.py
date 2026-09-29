# Variations of notes not yet researched that are only another way of
# writing the same note — the owner's rule, 2026-09-29: "If it is a
# spelling difference only, then say that there was no change, but if it
# is a difference such as bourbon and madagascar vanilla, then no, give an
# explanation." Real differences wait for research. When one of these
# notes is researched, its file's variations join these (a spelling
# written in both is an error).
from acc import out, SAME
V = {
 "note-mineral-accord": {"Mineral Accords": "No change: mineral accord in the plural."},
 "note-ozone": {"Ozonic Notes": "No change: ozone, named as a kind of note."},
 "note-old-books": {"Old Book": "No change: old books in the singular."},
 "note-westfarthing-leaf": {"Westfarthing Leaf (Tobacco)": "No change: the same leaf, with what it is written beside it."},
 "note-aged-parchment": {"Aged Parchment Accord": "No change: aged parchment, with the word accord saying it is built rather than taken from real parchment."},
 "note-instant-film": {"Instant Film Accord": "No change: instant film, with the word accord saying it is built."},
 "note-petrichor": {"Petrichor Accord": "No change: petrichor, with the word accord saying it is built."},
 "note-dusty-antiques": {"Antique Shop": "No change: the same picture, named by the place."},
 "note-marine-accord": {"Sea Notes": "No change: the sea, named as a kind of note."},
 "note-soil": {"Earthy Notes": "No change: earth, named as a kind of note."},
 "note-spikenard": {"Himalayan Nard (Jatamansi)": "No change: jatamansi is spikenard's Indian name, and it grows in the Himalayas."},
}
out("SPELL", {}, {nid: dict(vars={k: dict(same=t) for k, t in v.items()}) for nid, v in V.items()})

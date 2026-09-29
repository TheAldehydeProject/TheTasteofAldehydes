# Variations of notes not yet researched that are only another way of
# writing the same note — the owner's rule, 2026-09-29: "If it is a
# spelling difference only, then say that there was no change, but if it
# is a difference such as bourbon and madagascar vanilla, then no, give an
# explanation." Real differences wait for research. When one of these
# notes is researched, its file's variations join these (a spelling
# written in both is an error).
from acc import out, SAME
V = {
 # empty since 2026-09-29: every note is researched, so each of these
 # moved into its own accord's file.
}
out("SPELL", {}, {nid: dict(vars={k: dict(same=t) for k, t in v.items()}) for nid, v in V.items()})

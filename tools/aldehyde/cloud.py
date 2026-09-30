#!/usr/bin/env python3
# ============================================================
# THE ALDEHYDE ON THE HOME PAGE — run by hand, never by the site
#
# The owner, 2026-09-30: "If you were to use the shrodinger's equations for
# the model of the atom, could you graphically make a 3D model of an
# aldehyde?" — then, of formaldehyde, "make it so that the normal electrons
# are insignificant, but the lone pair and the double bond each have an
# assigned emphasized parameter to them" — and then, "a big aldehyde
# molecule in the very middle of [the home page's first slide], with the
# electron cloud being done as colour coded exactly as described" — and then,
# of the private page that first drew it, "i actually want it to look like
# the thing i see on the right; as close as possible to it".
#
# This solves formaldehyde, H2C=O (the smallest aldehyde there is),
# approximately: density-functional theory, B3LYP in a cc-pVDZ basis, with
# PySCF. It then takes the molecule's sixteen electrons apart into three
# clouds that add up exactly to the whole —
#
#   pi    the C=O double bond's second pair (its pi orbital), 2 electrons
#   lone  oxygen's lone pair, the loosest held (the highest occupied
#         orbital), lying in the molecule's plane and spilling a little along
#         the C-H bonds, 2 — as the private page drew it. (For one round the
#         home page drew the pair gathered wholly onto the oxygen instead,
#         an intrinsic bond orbital; the owner then asked for the private
#         page's look as close as possible, and this is its cloud.)
#   rest  every other electron, 12 (the innermost pairs, the single bonds
#         and oxygen's second, deeper lone pair)
#
# — and scatters specks through each, as often as the equation says an
# electron is there (|psi|^2), keeping the part of each cloud that holds nine
# tenths of it (nineteen twentieths for the rest), as a chemistry book draws
# an orbital. It writes them into aldehyde-data.js, which molecule.js draws.
#
# It needs numpy and pyscf (pip install numpy pyscf); it takes under a
# minute:
#
#   python3 tools/aldehyde/cloud.py
#
# How strongly each part is drawn is NOT decided here but in molecule.js
# (EMPHASIS); this writes enough specks for each part to be drawn up to four
# times its share.
# ============================================================
import os, json, base64
import numpy as np
from pyscf import gto, dft
from pyscf.dft import numint

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.join(ROOT, "aldehyde-data.js")
BOHR = 0.529177
STEP = 0.03          # a speck's place is kept to 0.03 angstrom (a byte a coordinate)
COUNTS = {"rest": 14000, "pi": 23000, "lone": 23000}

# Formaldehyde as measured, in angstrom: in the yz plane, C=O along z, so
# the pi orbitals stand along x.
ATOMS = [("C", 0, 0, 0), ("O", 0, 0, 1.205), ("H", 0, 0.943, -0.587), ("H", 0, -0.943, -0.587)]
MID = np.array([0, 0, 0.32])   # the middle of the cloud; every place is kept from here

mol = gto.M(atom="\n".join(f"{a} {x} {y} {z}" for a, x, y, z in ATOMS), basis="cc-pvdz", unit="Angstrom", verbose=0)
mf = dft.RKS(mol); mf.xc = "b3lyp"; mf.kernel()
C = mf.mo_coeff; nocc = mol.nelectron // 2

# Which orbital is which: the pi bond is the occupied one made of p
# functions along x alone; the lone pair is the highest occupied, and is
# mostly oxygen's p function along y.
labels = mol.ao_labels(fmt=False)
S = mol.intor("int1e_ovlp")
L = C[:, :nocc]
px = np.array([l[2].endswith("p") and l[3] == "x" for l in labels])
oy = np.array([l[0] == 1 and l[2].endswith("p") and l[3] == "y" for l in labels])
share = lambda c, m: float((c * (S @ c))[m].sum())
PI = max(range(nocc), key=lambda i: share(L[:, i], px))
LONE = nocc - 1
assert share(L[:, PI], px) > 0.95 and share(L[:, LONE], oy) > 0.4 and PI != LONE

h = 0.05
xs, ys, zs = np.arange(-3.2, 3.2, h), np.arange(-3.6, 3.6, h), np.arange(-3.4, 4.4, h)
G = np.stack(np.meshgrid(xs, ys, zs, indexing="ij"), -1).reshape(-1, 3)
dens = np.zeros(len(G)); pi = np.zeros(len(G)); lone = np.zeros(len(G))
for s in range(0, len(G), 250000):
    ao = numint.eval_ao(mol, G[s:s + 250000] / BOHR)
    psi = ao @ L
    dens[s:s + 250000] = 2 * (psi ** 2).sum(1)
    pi[s:s + 250000] = psi[:, PI]; lone[s:s + 250000] = psi[:, LONE]
electrons = dens.sum() * (h / BOHR) ** 3
assert abs(electrons - 16) < 0.3, electrons
rest = np.clip(dens - 2 * pi ** 2 - 2 * lone ** 2, 0, None)

rng = np.random.default_rng(7)
def sample(p, n, keep):
    p = p / p.sum()
    order = np.argsort(p)[::-1]
    p = p.copy(); p[order[np.searchsorted(np.cumsum(p[order]), keep):]] = 0; p /= p.sum()
    idx = rng.choice(len(p), size=n, p=p)
    pts = G[idx] + (rng.random((n, 3)) - 0.5) * h - MID
    q = np.clip(np.round(pts / STEP), -127, 127).astype(np.int8)
    shade = np.round(255 * np.sqrt(p[idx] / p.max())).astype(np.uint8)   # how dense, where it stands
    return {"n": n, "xyz": base64.b64encode(q.tobytes()).decode(), "shade": base64.b64encode(shade.tobytes()).decode()}

parts = {
    "rest": dict(electrons=12, **sample(rest, COUNTS["rest"], 0.95)),
    "pi": dict(electrons=2, **sample(pi ** 2, COUNTS["pi"], 0.9)),
    "lone": dict(electrons=2, **sample(lone ** 2, COUNTS["lone"], 0.9)),
}
data = {
    "molecule": "H2C=O", "method": "B3LYP/cc-pVDZ (PySCF)", "step": STEP,
    "atoms": [[a, round(x - MID[0], 3), round(y - MID[1], 3), round(z - MID[2], 3)] for a, x, y, z in ATOMS],
    "parts": parts,
}
with open(OUT, "w") as f:
    f.write("// THE ALDEHYDE ON THE HOME PAGE: formaldehyde's electrons as specks.\n"
            "// Written by tools/aldehyde/cloud.py; never edit it by hand. Drawn by molecule.js.\n"
            "// Each part's xyz is a byte a coordinate (x, y, z in turn), in steps of `step`\n"
            "// angstrom from the middle of the cloud; its shade is how dense the cloud is\n"
            "// where the speck stands, 0-255.\n"
            "window.ALDEHYDE = " + json.dumps(data, separators=(",", ":")) + ";\n")
print(f"{os.path.relpath(OUT)}: {os.path.getsize(OUT) // 1024} KB; electrons on the grid {electrons:.2f}; "
      f"pi bond on the C=O {share(L[:, PI], px):.2f}, lone pair on oxygen {share(L[:, LONE], oy):.2f}")

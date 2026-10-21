# ============================================================
# THE COLOUR ENLARGED — tools/apoteker/upscale.py, run by hand, never by
# the site: the trial `superres` (tepe-gl.js), 2026-10-21.
#
# Nothing open is finer than the Sentinel-2 satellite's 10 m over Athos, so
# this is the one way past it: Real-ESRGAN (Xintao Wang et al., BSD 3-Clause;
# its x4plus weights, run on the processor by Tencent's ncnn) enlarges the
# 10 m picture four times, inventing the detail between its pixels as it
# was taught to on photographs — it is NOT more of the real ground, and the
# page says so if it is kept. Written to
# images/Apoteker Tepe/mountain/trials/athos-sr.jpg at OUT px.
#
#   pip install ncnn pillow numpy
#   (the model: realesrgan-x4plus.param and .bin, from the release zip
#   realesrgan-ncnn-vulkan-20220424-ubuntu.zip of xinntao/Real-ESRGAN)
#   python3 tools/apoteker/upscale.py <folder holding the model>
# ============================================================
import os, sys, time
import numpy as np
import ncnn
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TRIAL = os.path.join(ROOT, "images", "Apoteker Tepe", "mountain", "trials")
MODEL = sys.argv[1] if len(sys.argv) > 1 else "."
TILE, PAD, OUT = 192, 12, 4096

net = ncnn.Net()
net.opt.use_vulkan_compute = False
net.opt.num_threads = os.cpu_count() or 4
net.load_param(os.path.join(MODEL, "realesrgan-x4plus.param"))
net.load_model(os.path.join(MODEL, "realesrgan-x4plus.bin"))

src = np.asarray(Image.open(os.path.join(TRIAL, "athos-10m-native.png")).convert("RGB"), dtype=np.float32) / 255.0
h, w, _ = src.shape
out = np.zeros((h * 4, w * 4, 3), dtype=np.float32)
t0 = time.time()
for y in range(0, h, TILE):
    for x in range(0, w, TILE):
        # each tile with a margin round it, so its edges are made from what is beside them
        y0, x0, y1, x1 = max(0, y - PAD), max(0, x - PAD), min(h, y + TILE + PAD), min(w, x + TILE + PAD)
        tile = np.ascontiguousarray(src[y0:y1, x0:x1].transpose(2, 0, 1))
        ex = net.create_extractor()
        ex.input("data", ncnn.Mat(tile))
        _, m = ex.extract("output")
        big = np.array(m).transpose(1, 2, 0)
        oy, ox = (y - y0) * 4, (x - x0) * 4
        th, tw = min(TILE, h - y) * 4, min(TILE, w - x) * 4
        out[y * 4:y * 4 + th, x * 4:x * 4 + tw] = big[oy:oy + th, ox:ox + tw]
    print(f"  row {y // TILE + 1} of {(h + TILE - 1) // TILE}, {time.time() - t0:.0f} s", flush=True)
img = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)).resize((OUT, OUT), Image.LANCZOS)
img.save(os.path.join(TRIAL, "athos-sr.jpg"), quality=86)
print(f"athos-sr.jpg: {w}px to {OUT}px in {time.time() - t0:.0f} s")

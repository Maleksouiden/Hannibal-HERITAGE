#!/usr/bin/env python3
"""Pre-download rembg model (run on Hostinger)."""
import os

for k, v in (
    ("OMP_NUM_THREADS", "1"),
    ("OPENBLAS_NUM_THREADS", "1"),
    ("MKL_NUM_THREADS", "1"),
    ("NUMEXPR_NUM_THREADS", "1"),
    ("ORT_NUM_THREADS", "1"),
):
    os.environ.setdefault(k, v)

from PIL import Image
from rembg import new_session, remove

p = "/tmp/hh-warm.png"
Image.new("RGB", (64, 64), (0, 128, 0)).save(p)
s = new_session("isnet-general-use")
open("/tmp/hh-warm-out.png", "wb").write(remove(open(p, "rb").read(), session=s))
print("WARM_OK")

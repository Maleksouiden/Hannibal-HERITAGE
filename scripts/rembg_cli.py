#!/usr/bin/env python3
"""CLI for admin background removal via rembg (u2net / isnet).

Reads an image from --input (or stdin), writes a transparent PNG to --output
(or stdout). Designed to be spawned by the Next.js API route.

Optional --refine-fabric drops low-saturation fabric leftovers that rembg often
keeps between product items on wrinkled cloth backdrops.
"""

from __future__ import annotations

import argparse
import io
import sys
from pathlib import Path


def refine_fabric_leftovers(png_bytes: bytes) -> bytes:
    """Keep product-like pixels; punch out gray/silver cloth rembg left behind."""
    import numpy as np
    from PIL import Image, ImageFilter

    im = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3]
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = mx - mn
    mean = rgb.mean(axis=2)

    greenish = (
        (alpha > 10)
        & (rgb[:, :, 1] > rgb[:, :, 0] + 8)
        & (rgb[:, :, 1] > rgb[:, :, 2] + 4)
    )
    green_mask = Image.fromarray((greenish.astype(np.uint8) * 255), "L")
    near_green = np.array(green_mask.filter(ImageFilter.MaxFilter(31))) > 0

    # Bowl interiors / shadows that sit inside the product silhouette.
    dark_interior = (alpha > 10) & near_green & (mean < 95)
    # Light stitching / highlights on coiled products.
    stitch = (alpha > 10) & near_green & (mean > 160) & (sat < 50)
    colorful = (alpha > 10) & (sat >= 45)

    keep = greenish | dark_interior | stitch | colorful
    out = arr.copy()
    out[(alpha > 10) & ~keep, 3] = 0

    buf = io.BytesIO()
    Image.fromarray(out).save(buf, format="PNG")
    return buf.getvalue()


def main() -> int:
    parser = argparse.ArgumentParser(description="Remove image background with rembg")
    parser.add_argument(
        "-i",
        "--input",
        help="Input image path (default: stdin)",
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Output PNG path (default: stdout)",
    )
    parser.add_argument(
        "-m",
        "--model",
        default="isnet-general-use",
        help="rembg model name (default: isnet-general-use)",
    )
    parser.add_argument(
        "--refine-fabric",
        dest="refine_fabric",
        action="store_true",
        default=True,
        help="Drop gray/silver fabric leftovers (default: on)",
    )
    parser.add_argument(
        "--no-refine-fabric",
        dest="refine_fabric",
        action="store_false",
        help="Keep raw rembg alpha mask",
    )
    args = parser.parse_args()

    try:
        from rembg import new_session, remove
    except ImportError as err:
        print(
            "rembg is not installed. Run: python -m pip install -r requirements-rembg.txt",
            file=sys.stderr,
        )
        print(str(err), file=sys.stderr)
        return 2

    if args.input:
        data = Path(args.input).read_bytes()
    else:
        data = sys.stdin.buffer.read()

    if not data:
        print("empty input image", file=sys.stderr)
        return 1

    session = new_session(args.model)
    result = remove(data, session=session, post_process_mask=True)

    if args.refine_fabric:
        try:
            result = refine_fabric_leftovers(result)
        except Exception as err:  # noqa: BLE001 — fall back to raw rembg
            print(f"refine-fabric skipped: {err}", file=sys.stderr)

    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(result)
    else:
        sys.stdout.buffer.write(result)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

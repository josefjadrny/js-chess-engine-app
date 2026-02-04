#!/usr/bin/env python3
"""Recolor chess piece PNGs while preserving transparency and silhouette.

- Keeps original size and alpha.
- Uses original pixel luminance as a shading mask.
- Maps shading into a warm, low-glare palette suitable for dark themes.
- Optionally removes faint white halos (very low alpha + high luminance).

Writes in-place, after copying originals to src/img/original/.
"""

from __future__ import annotations

import shutil
from dataclasses import dataclass
from pathlib import Path

from PIL import Image


@dataclass(frozen=True)
class Palette:
    shadow: tuple[int, int, int]
    highlight: tuple[int, int, int]
    gamma: float = 0.9


WHITE_PIECE = Palette(
    # Warm ivory with gentle shadows (no pure white)
    shadow=(172, 145, 105),      # #AC9169
    highlight=(242, 234, 220),   # #F2EADC
    gamma=0.85,
)

BLACK_PIECE = Palette(
    # Dark walnut with subtle warm highlights
    shadow=(24, 16, 12),         # #18100C
    highlight=(122, 88, 54),     # #7A5836
    gamma=0.95,
)


def _luminance(r: int, g: int, b: int) -> float:
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0


def _mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = 0.0 if t < 0.0 else 1.0 if t > 1.0 else t
    return (
        int(round(a[0] + (b[0] - a[0]) * t)),
        int(round(a[1] + (b[1] - a[1]) * t)),
        int(round(a[2] + (b[2] - a[2]) * t)),
    )


def recolor_image(path: Path, palette: Palette) -> None:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    src = im.load()

    out = Image.new("RGBA", (w, h))
    dst = out.load()

    # Halo removal: if a pixel is almost transparent but bright, drop it.
    # This targets the common "white glow" edge artifact.
    HALO_ALPHA_MAX = 55
    HALO_LUM_MIN = 0.80

    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if a == 0:
                dst[x, y] = (0, 0, 0, 0)
                continue

            lum = _luminance(r, g, b)
            if a <= HALO_ALPHA_MAX and lum >= HALO_LUM_MIN:
                dst[x, y] = (0, 0, 0, 0)
                continue

            # Use luminance as the shading mask; clamp highlights to avoid glare.
            t = lum ** palette.gamma
            nr, ng, nb = _mix(palette.shadow, palette.highlight, t)
            dst[x, y] = (nr, ng, nb, a)

    out.save(path, format="PNG")


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    img_dir = repo_root / "src" / "img"
    backup_dir = img_dir / "original"

    if not img_dir.exists():
        raise SystemExit(f"Missing folder: {img_dir}")

    pngs = sorted(p for p in img_dir.glob("*.png") if p.is_file())
    if not pngs:
        print(f"No PNGs found in {img_dir}")
        return 0

    backup_dir.mkdir(exist_ok=True)

    # Copy originals once (don’t overwrite if already backed up)
    for p in pngs:
        dst = backup_dir / p.name
        if not dst.exists():
            shutil.copy2(p, dst)

    changed = 0
    for p in pngs:
        name = p.name.lower()
        if "_white" in name:
            recolor_image(p, WHITE_PIECE)
            changed += 1
        elif "_black" in name:
            recolor_image(p, BLACK_PIECE)
            changed += 1
        else:
            # Skip unknown naming
            continue

    print(f"Recolored {changed} piece images. Originals in {backup_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

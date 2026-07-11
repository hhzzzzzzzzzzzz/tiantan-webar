from __future__ import annotations

import os
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
PAGE_SOURCE = Path(os.environ["AR_PAGE_SOURCE"])


def save_target(page: int, destination: str) -> Image.Image:
    image = Image.open(PAGE_SOURCE / f"page-{page:02d}.png").convert("RGB")
    image.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
    image.save(ASSETS / destination, quality=91, optimize=True)
    return image


def crop_page(image: Image.Image, name: str, box: tuple[float, float, float, float]) -> None:
    width, height = image.size
    pixels = tuple(round(value * bound) for value, bound in zip(box, (width, height, width, height)))
    crop = image.crop(pixels)
    crop.thumbnail((1400, 1000), Image.Resampling.LANCZOS)
    crop.save(ASSETS / name, quality=91, optimize=True)


def crop_transparent(source: Image.Image, name: str, box: tuple[float, float, float, float]) -> None:
    width, height = source.size
    pixels = tuple(round(value * bound) for value, bound in zip(box, (width, height, width, height)))
    crop = source.crop(pixels)
    alpha = crop.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        crop = crop.crop(bbox)
    crop.thumbnail((1100, 800), Image.Resampling.LANCZOS)
    crop.save(ASSETS / name, optimize=True)


def main() -> None:
    save_target(6, "target-01.jpg")
    page22 = save_target(22, "target-02.jpg")
    save_target(27, "target-03.jpg")

    crop_page(page22, "poster-forest.jpg", (0.00, 0.02, 0.53, 0.82))
    crop_page(page22, "poster-portrait.jpg", (0.57, 0.00, 1.00, 0.74))
    crop_page(page22, "poster-village.jpg", (0.18, 0.47, 0.88, 1.00))
    crop_page(page22, "poster-map.jpg", (0.00, 0.54, 0.55, 1.00))

    people = Image.open(ASSETS / "people-source.png").convert("RGBA")
    crops = {
        "city-kiosk.png": (0.00, 0.02, 0.17, 0.31),
        "city-class.png": (0.00, 0.40, 0.20, 0.62),
        "city-stall.png": (0.25, 0.30, 0.41, 0.48),
        "city-photo.png": (0.38, 0.17, 0.57, 0.37),
        "city-tea.png": (0.45, 0.55, 0.58, 0.72),
        "city-fruit.png": (0.57, 0.28, 0.68, 0.40),
        "city-children.png": (0.64, 0.40, 0.74, 0.55),
        "city-magic.png": (0.75, 0.39, 0.85, 0.55),
        "city-market.png": (0.86, 0.56, 1.00, 0.80),
        "city-walkers.png": (0.36, 0.71, 0.56, 0.90),
        "city-rickshaw.png": (0.00, 0.80, 0.16, 1.00),
    }
    for name, box in crops.items():
        crop_transparent(people, name, box)

    print("Prepared page 6, 22, and 27 AR assets.")


if __name__ == "__main__":
    main()

from pathlib import Path

from PIL import Image

src = Path(r"f:\teambase tax\teambase-tax\public\logo-source.png")
img = Image.open(src).convert("RGBA")
pixels = img.load()
w, h = img.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        brightness = (r + g + b) / 3
        if brightness < 28 and abs(r - g) < 12 and abs(g - b) < 12:
            pixels[x, y] = (0, 0, 0, 0)

bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

out_dark = Path(r"f:\teambase tax\teambase-tax\public\logo-light.png")
out_light = Path(r"f:\teambase tax\teambase-tax\public\logo.png")

img.save(out_dark, "PNG")

light = img.copy()
px = light.load()
lw, lh = light.size
for y in range(lh):
    for x in range(lw):
        r, g, b, a = px[x, y]
        if a < 20:
            continue
        if r > 210 and g > 210 and b > 210:
            px[x, y] = (11, 29, 54, a)
light.save(out_light, "PNG")

emblem = img.crop((0, 0, min(img.width, int(img.height * 1.15)), img.height))
emblem.save(Path(r"f:\teambase tax\teambase-tax\public\logo-mark.png"), "PNG")

print("sizes:", img.size, light.size, emblem.size)
print("saved logo.png, logo-light.png, logo-mark.png")

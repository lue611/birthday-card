# -*- coding: utf-8 -*-
"""Generate a demo 'memory photo' (sunset bokeh style) for marketing screenshots."""
from PIL import Image, ImageDraw, ImageFilter
import random

random.seed(7)
W, H = 1200, 900
img = Image.new('RGB', (W, H))
d = ImageDraw.Draw(img)

top = (255, 166, 86)
mid = (214, 108, 92)
bot = (64, 52, 110)
for y in range(H):
    t = y / H
    if t < 0.55:
        c = tuple(int(a + (b - a) * (t / 0.55)) for a, b in zip(top, mid))
    else:
        c = tuple(int(a + (b - a) * ((t - 0.55) / 0.45)) for a, b in zip(mid, bot))
    d.line([(0, y), (W, y)], fill=c)

# sun glow
glow = Image.new('L', (W, H), 0)
g = ImageDraw.Draw(glow)
g.ellipse([W * 0.52, H * 0.18, W * 0.52 + 300, H * 0.18 + 300], fill=235)
glow = glow.filter(ImageFilter.GaussianBlur(150))
white = Image.new('RGB', (W, H), (255, 236, 190))
img = Image.composite(white, img, glow)

# bokeh dots
for _ in range(90):
    x = random.uniform(0, W)
    y = random.uniform(H * 0.1, H * 0.95)
    r = random.uniform(4, 26)
    a = random.randint(26, 90)
    col = (255, random.randint(200, 240), random.randint(150, 220))
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    o = ImageDraw.Draw(ov)
    o.ellipse([x - r, y - r, x + r, y + r], fill=col + (a,))
    img = Image.alpha_composite(img.convert('RGBA'), ov).convert('RGB')

# horizon sparkles
d = ImageDraw.Draw(img)
for _ in range(40):
    x = random.uniform(0, W)
    y = random.uniform(H * 0.72, H * 0.88)
    r = random.uniform(2, 7)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 224, 170))

img = img.filter(ImageFilter.GaussianBlur(1.2))

# vignette
vig = Image.new('L', (W, H), 0)
v = ImageDraw.Draw(vig)
v.ellipse([-W * 0.25, -H * 0.25, W * 1.25, H * 1.25], fill=255)
vig = vig.filter(ImageFilter.GaussianBlur(120)).point(lambda p: 255 - p)
img = Image.composite(Image.new('RGB', (W, H), (30, 20, 45)), img, vig)

img.save(r'D:\Code\birthdaycard\marketing\shoot\photo-demo.jpg', quality=88)
print('saved demo photo')

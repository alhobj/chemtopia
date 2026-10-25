"""Read-only PNG alpha measurements for stable runtime sprite registration."""
import json
from pathlib import Path
from statistics import median
from PIL import Image
root = Path(__file__).resolve().parents[1]
atlases = {}
for number in range(1, 7):
    file = f'walk-c01-{number}.png'
    image = Image.open(root / 'prototype/assets/world' / file)
    rows = []
    for row in range(3):
        frames = []
        for column in range(4):
            x, y = column * image.width // 4, row * image.height // 3
            w, h = image.width // 4, image.height // 3
            alpha = image.crop((x,y,x+w,y+h)).getchannel('A').point(lambda a: 255 if a > 128 else 0)
            # Ignore isolated antialiasing specks: retain the largest connected body.
            pixels = set((px,py) for py in range(h) for px in range(w) if alpha.getpixel((px,py)))
            largest = set()
            while pixels:
                seed = pixels.pop(); component = {seed}; queue = [seed]
                for px,py in queue:
                    for point in ((px-1,py),(px+1,py),(px,py-1),(px,py+1)):
                        if point in pixels:
                            pixels.remove(point); component.add(point); queue.append(point)
                if len(component)>len(largest): largest=component
            left=min(p[0] for p in largest); right=max(p[0] for p in largest)
            top=min(p[1] for p in largest); bottom=max(p[1] for p in largest)
            # Anchor to torso, avoiding the alternating arms/extended shoes.
            centres=[]
            for py in range(int(top+(bottom-top)*.4),int(top+(bottom-top)*.6)):
                xs=[px for px in range(left,right+1) if (px,py) in largest]
                if xs: centres.append((min(xs)+max(xs))/2)
            frames.append(dict(x=x,y=y,w=w,h=h,cx=round(median(centres),2),top=top,bottom=bottom,height=bottom-top+1))
        rows.append(frames)
    atlases[f'c01-{number}']=dict(file=file,width=image.width,height=image.height,rows=rows)
(root/'prototype/walking-atlases.js').write_text('// Read-only alpha measurements; regenerate with python scripts/measure-walking.py.\nexport const WALK_ATLASES='+json.dumps(atlases,separators=(',',':'))+';\n')

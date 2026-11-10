from pathlib import Path
from fontTools import subset
root=Path(__file__).resolve().parents[1]
text=''.join(p.read_text(encoding='utf-8') for glob in ['*.html','*.mjs','data/*.json'] for p in (root/'ganzhi').glob(glob))
options=subset.Options();options.flavor='woff2'
font=subset.load_font(str(root/'.cache/ganzhi/font.woff2'),options)
s=subset.Subsetter(options=options);s.populate(text=text);s.subset(font)
target=root/'ganzhi/fonts/noto-serif-sc.woff2';subset.save_font(font,str(target),options)
print(target.stat().st_size,'bytes')

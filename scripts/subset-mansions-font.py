"""Subset the OFL Fontsource Noto Serif SC font to all current site text.

Download source from https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-sc@5.3.1/files/noto-serif-sc-chinese-simplified-400-normal.woff2
Then run with fonttools[brotli] available, passing the downloaded file path.
"""
import pathlib, sys
from fontTools import subset
root = pathlib.Path(__file__).resolve().parents[1]
text = ''.join(p.read_text(encoding='utf-8') for pattern in ('*.html','*.mjs','data/content.json') for p in (root/'mansions').glob(pattern))
text += '龍武虎雀角亢氐房心尾箕斗牛女虚危室壁奎娄胃昴毕觜参井鬼柳星张翼轸'
options = subset.Options()
options.flavor = 'woff2'
font = subset.load_font(sys.argv[1], options)
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
target = root/'mansions/fonts/noto-serif-sc-display.woff2'
subset.save_font(font, str(target), options)
print(f'Wrote {target.stat().st_size} bytes')

"""Build the website as a single offline-capable HTML file, without network I/O."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
src=root/'src/atlas'
html=(src/'template.html').read_text(encoding='utf-8')
for marker,name in [('CSS','style.css'),('V2_CSS','cycles.css'),('STUDIO_CSS','studio.css'),('DATA','data.json'),('MODEL','cycle-model.js'),('JS','app.js'),('V2','cycles-ui.js')]:
    html=html.replace('/*INLINE_'+marker+'*/',(src/name).read_text(encoding='utf-8').rstrip())
assert '/*INLINE_' not in html
(root/'index.html').write_text(html,encoding='utf-8')
print(f'Built index.html: {len(html.encode("utf-8")):,} bytes')

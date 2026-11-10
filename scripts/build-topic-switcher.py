"""Generate the same visible topic switcher in all three static site shells."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
icons={
 'atlas':'<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4v24M7 8l18 16M7 24 25 8"/><circle cx="16" cy="16" r="6"/>',
 'mansions':'<path d="m5 23 5-15 10 4 7-7-3 21-14-3 10-11"/><circle cx="10" cy="8" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="24" cy="26" r="2"/><circle cx="5" cy="23" r="2"/>',
 'ganzhi':'<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="7"/><path d="M16 1v7m0 16v7M1 16h7m16 0h7M16 16l6-7"/>',
 'plants':'<path d="M16 29V13M16 21C5 21 3 16 4 7c9 0 12 5 12 14Zm0-6C16 6 22 2 29 3c0 9-4 13-13 12Z"/>',
 'body':'<circle cx="16" cy="6" r="4"/><path d="M9 12h14l5 11M9 12 4 23m9-10v8l-3 10m9-18v8l3 10M13 20h6"/>'}
icons.update(herbs='<path d="M5 17h22c-1 8-5 11-11 11S6 25 5 17Zm4 12h14M18 17 27 5q2-3 4 0L23 17M9 12C4 12 4 7 5 4c6 0 8 4 4 8Zm0 0 3 5"/>',physiognomy='<path d="M16 3C7 3 5 10 7 18s5 12 9 12 7-4 9-12S25 3 16 3ZM10 12h3m6 0h3m-7 2-1 5h4m-6 5h8"/>')
icons['acupuncture']='<path d="M10 4 22 28M8 5l5-2M19 28l5-2M7 24 25 6M5 22l4 4M23 4l4 4"/><circle cx="16" cy="16" r="6"/>'
icons['fengshui']='<path d="m3 15 13-11 13 11M7 13v15h18V13M13 28V18h6v10"/>'
icons['yinfengshui']='<path d="m2 23 8-15 7 11 5-15 9 19M2 28q8-6 15 0t14 0"/>'
labels=[('atlas','中国周期图谱','时间与周期'),('mansions','二十八宿','星空与文献'),('ganzhi','天干地支','入门与百科'),('plants','植物五行','草木与出处'),('body','身体与干支','部位与症状'),('herbs','中药','药材与药证'),('physiognomy','相术','名词与文献'),('acupuncture','针灸','经络与穴位'),('fengshui','风水（阳宅）','方位与居住'),('yinfengshui','阴宅风水','山水与文献')]
for file,site,prefix in [('src/atlas/template.html','atlas',''),('index.html','atlas',''),('mansions/index.html','mansions','../'),('ganzhi/index.html','ganzhi','../')]:
 p=root/file;s=p.read_text(encoding='utf-8')
 paths={'atlas':prefix or './','mansions':prefix+'mansions/','ganzhi':prefix+'ganzhi/','plants':prefix+'ganzhi/#plants','body':prefix+'ganzhi/#body'}
 paths['fengshui']=prefix+'ganzhi/#fengshui'
 paths['yinfengshui']=prefix+'ganzhi/#yinfengshui'
 paths['acupuncture']=prefix+'ganzhi/#acupuncture'
 paths.update(herbs=prefix+'ganzhi/#herbs',physiognomy=prefix+'ganzhi/#physiognomy')
 if site=='ganzhi':paths.update(fengshui='#fengshui',yinfengshui='#yinfengshui',acupuncture='#acupuncture',ganzhi='#home',plants='#plants',body='#body',herbs='#herbs',physiognomy='#physiognomy')
 if site=='mansions':paths['mansions']='#home'
 links=''.join(f'<a href="{paths[id]}" data-topic="{id}"><svg viewBox="0 0 32 32" aria-hidden="true">{icons[id]}</svg><span><strong>{label}</strong><small>{desc}</small></span></a>' for id,label,desc in labels)
 nav=f'<!-- topic-switcher:start --><nav class="topic-switcher" aria-label="专题切换" data-topic-site="{site}"><p>探索专题<span>10 个专题 · <span class="topic-scroll-hint">左右滑动，</span>点击切换</span></p><div>{links}</div></nav><!-- topic-switcher:end -->'
 if '<!-- topic-switcher:start -->' in s:
  a=s.index('<!-- topic-switcher:start -->');b=s.index('<!-- topic-switcher:end -->',a)+len('<!-- topic-switcher:end -->');s=s[:a]+nav+s[b:]
 else:s=s.replace('</header>','</header>\n'+nav,1)
 css=f'<link rel="stylesheet" href="{prefix}shared/topics.css">'
 js=f'<script type="module" src="{prefix}shared/topics.mjs"></script>'
 if css not in s:s=s.replace('</head>',css+'</head>',1)
 if js not in s:s=s.replace('</body>',js+'</body>',1)
 p.write_text(s,encoding='utf-8')
print('Updated shared topic navigation in all three sites')

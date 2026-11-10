"""Parse independently downloaded HKO plaintext/XML references, never the lunar library."""
import json,re,xml.etree.ElementTree as ET
from pathlib import Path
root=Path(__file__).resolve().parents[1]
days='初一 初二 初三 初四 初五 初六 初七 初八 初九 初十 十一 十二 十三 十四 十五 十六 十七 十八 十九 二十 廿一 廿二 廿三 廿四 廿五 廿六 廿七 廿八 廿九 三十'.split()
months='正 二 三 四 五 六 七 八 九 十 十一 十二'.split()
dates=[]
for year in [1901,2024,2033,2034,2100]:
    txt=(root/f'.cache/ganzhi/hko{year}.txt').read_text(encoding='utf-8-sig')
    for n,line in enumerate(txt.splitlines(),1):
        m=re.match(r'(\d+)年(\d+)月(\d+)日\s+(\S+)',line)
        if not m:continue
        y,mo,d,label=m.groups(); month=None
        if label.endswith('月'):
            month=months.index(label.replace('閏','')[:-1])+1
            if label.startswith('閏'):month=-month
            day=1
        else:day=days.index(label)+1
        dates.append(dict(date=f'{int(y):04d}-{int(mo):02d}-{int(d):02d}',day=day,month=month,sourceUrl=f'https://www.hko.gov.hk/tc/gts/time/calendar/text/files/T{year}c.txt',line=n))
names='小寒 大寒 立春 雨水 惊蛰 春分 清明 谷雨 立夏 小满 芒种 夏至 小暑 大暑 立秋 处暑 白露 秋分 寒露 霜降 立冬 小雪 大雪 冬至'.split()
terms=[]
for name,el in zip(names,ET.parse(root/'.cache/ganzhi/terms2024.xml').getroot().findall('Data')):
    terms.append(dict(name=name,time=f"2024-{el.findtext('M')}-{el.findtext('D')}T{el.findtext('hm')}:00"))
result=dict(retrieved='2026-11-10',timezone='UTC+08:00',dates=dates,terms=terms,termSource='https://www.hko.gov.hk/tc/gts/astronomy/data/files/24SolarTerms_2024.xml',termPrecision='minute',toleranceSeconds=90,dayAnchor=dict(date='2019-01-27',pillar='甲子',julianNoon=2458511,source='https://ytliu0.github.io/ChineseCalendar/sexagenary.html'))
(root/'evidence/ganzhi-calendar-reference.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(len(dates),'HKO date rows;',len(terms),'solar terms')

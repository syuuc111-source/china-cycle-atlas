from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
c=json.loads((root/'ganzhi/data/content.json').read_text(encoding='utf-8'))
s=json.loads((root/'ganzhi/data/sources.json').read_text(encoding='utf-8'))
p=c['plants']; rows=['# 植物五行与气：资料整理','', '整理日期：2026-11-10。原文件未确认。','',f"收录 {len(p['records'])} 条来源记录、4篇讲解、10个新来源。数量是分类记录数，不是植物物种数；并非全网穷尽。",'','## 查找原文件的候选','', '优先对照《植物的五行》（气感与花叶取象）与《七大类·常见植物的阴阳五行及其应用（全）》（逐种精气与五行）。正式PDF线索为专利CN103537006A，目前仅核对书目信息。相关链接见文末。','', '## 概念与分类边界','', '四气五味、园艺取象和民间隔空气感分开整理。传统理论介绍不是现代疗效验证。颜色使用木绿、火红、土橙、金金色、水蓝，属于网页辨识方案。','', '《辅行诀》按辛木、咸火、甘土、酸金、苦水分外层，再按木火土金水分组内位置。不能替换成《素问》的另一套味行对应。茯苓为真菌材料、硝石为矿物药名、豉为加工品。','', '园艺来源里的富贵竹主条列木，另注水培水、白条金、黄条土，开运竹又按造型列水。本站保存条件，不创建脱离来源的万能植物属性表。','', '## 记录索引','']
for key,system in p['systems'].items():
 rows.extend(['### '+system['name'],'',system['description'],''])
 for r in p['records']:
  if r['system']!=key:continue
  rows.extend(['#### '+r['name'],'',r['classification']+'。'+r['explanation'],'',r['identity'],'',r['note'],'','来源：'+ '；'.join('['+next(x['title'] for x in s if x['id']==id)+']('+next(x['url'] for x in s if x['id']==id)+')' for id in r['sourceIds']),''])
rows.extend(['## 来源与读取状态',''])
for source in s:
 if not source['id'].startswith('plant-'):continue
 rows.extend(['- ['+source['title']+']('+source['url']+') — '+source['author']+'。'+('相关正文已读取' if source['status']=='verified' else '仅书目信息核对')+'。'+source['note']])
rows.extend(['','## 检索限制','', '检索工具：AnySearch；Agent Reach搜索工作流。检索围绕植物五行、植物之气／炁、精气、采气、本草性味及具体题名。搜索部分返回无关法律或学术记录，未采纳；知乎条目未提取成功，PMC页面遇访问验证，未据这些页面正文立论。官方中医说明用于传统概念释义，民间文仅用于记录其观点。未取得《李氏绿色兵法》，未完整读取专利说明书。','', '本文为原创整理与简短出处标注，不转载现代原文全文。网站索引： https://syuuc111-source.github.io/china-cycle-atlas/ganzhi/#plants',''])
(root/'ganzhi/data/plants-research.md').write_text('\n'.join(rows),encoding='utf-8')
print('Exported research notes with all source-specific records')

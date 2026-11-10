const {test}=require('node:test'),assert=require('node:assert/strict');
const {acupuncture:a}=require('../ganzhi/data/content.json'),sources=require('../ganzhi/data/sources.json');
test('acupuncture covers fourteen channels, twenty-four distinct points and five transparent source editions',()=>{
 assert.equal(a.channels.length,14);assert.equal(a.points.length,24);assert.equal(a.books.length,5);assert.equal(a.guides.length,6);
 assert.equal(a.books.reduce((n,b)=>n+b.files.length,0),6);assert.equal(new Set(a.points.map(p=>p.id)).size,24);
 for(const p of a.points){assert.ok(a.channels.some(c=>c.id===p.channel));assert.equal(p.id,p.code.toLowerCase());for(const k of ['location','uses','distinction','caution'])assert.ok(p[k].length>=(k==='location'?10:20),`${p.name}: ${k}`);assert.ok(p.citations.length);}
 for(const x of [...a.channels,...a.points,...a.guides]){for(const c of [...x.citations,...(x.categoryCitations||[])]){const b=a.books.find(b=>b.id===c.book);assert.ok(b);assert.ok(c.start>=1&&c.end>=c.start&&c.end<=b.pages);}for(const id of x.sourceIds||[])assert.ok(sources.some(s=>s.id===id));}
 const text=JSON.stringify(a);assert.doesNotMatch(text,/[A-Z]:[\\/]/);assert.doesNotMatch(text,/(?:进针|刺入|针深|留针)\s*[一二三四五六七八九十\d]+(?:寸|分|分钟)/);
 assert.match(a.books.find(b=>b.id==='acu-notes').note,/版次与年份未核实/);assert.match(a.books.find(b=>b.id==='acu-jiaoshi').scope,/尚未逐页/);
 assert.match(a.guides.find(g=>g.id==='safe').paragraphs.join(''),/心肌梗塞.*不作为可靠急救/);
 assert.equal(a.channels.find(c=>c.id==='cv').phase,'—');assert.equal(a.channels.find(c=>c.id==='gv').phase,'—');
});
test('point search supports codes and combined filters while preserving category distinctions',async()=>{
 const {filterPoints}=await import('../ganzhi/acupuncture.mjs');
 assert.deepEqual(filterPoints(a.points,{query:' pC 6 '}).map(p=>p.name),['内关']);
 assert.deepEqual(filterPoints(a.points,{query:'内关',channel:'pc',region:'上肢'}).map(p=>p.name),['内关']);
 assert.equal(filterPoints(a.points,{query:'内关',region:'下肢'}).length,0);
 assert.equal(filterPoints(a.points,{channel:'cv'}).length,4);
 assert.ok(filterPoints(a.points,{query:'八会'}).some(p=>p.name==='膻中'));
 assert.match(a.guides.find(g=>g.id==='categories').paragraphs.join(''),/八会.*八脉交会.*两套系统/);
});

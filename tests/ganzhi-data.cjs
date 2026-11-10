const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('complete referenced knowledge base',()=>{
 const c=JSON.parse(fs.readFileSync('ganzhi/data/content.json','utf8'));
 const s=JSON.parse(fs.readFileSync('ganzhi/data/sources.json','utf8'));
 assert.equal(c.entries.filter(x=>x.kind==='stem').length,10);
 assert.equal(c.entries.filter(x=>x.kind==='branch').length,12);
 assert.ok(c.articles.length>=38);assert.equal(c.guides.length,6);
 const all=[...c.entries,...c.articles], ids=new Set(all.map(x=>x.id));
 assert.equal(ids.size,all.length);const sources=new Map(s.map(x=>[x.id,x]));
 for(const x of all){assert.ok(x.summary.length>10,x.id);assert.ok(x.sections.length>=2,x.id);
  assert.ok(x.sourceIds.length,x.id);
  for(const id of x.sourceIds)assert.ok(sources.has(id),x.id+':'+id);
  for(const id of x.related)assert.ok(ids.has(id),x.id+':'+id);
  for(const section of x.sections){assert.ok(section.paragraphs.length);for(const p of section.paragraphs)assert.ok(p.length>10);}
 }
 for(const g of c.guides)for(const id of g.articleIds)assert.ok(ids.has(id));
});

const {test}=require('node:test');
const assert=require('node:assert/strict');
const c=require('../ganzhi/data/content.json');
const sources=require('../ganzhi/data/sources.json');
test('book topics have complete reading entries and bounded, traceable citations',()=>{
 assert.equal(c.herbs.entries.length,50);assert.equal(c.books.length,5);
 assert.equal(c.books.reduce((n,b)=>n+b.files.length,0),6);
 assert.equal(c.books.find(b=>b.id==='face').files.length,2);
 for(const rows of [c.herbs.entries,c.herbs.guides,c.physiognomy.entries]){
  assert.equal(new Set(rows.map(x=>x.id)).size,rows.length);
  for(const row of rows){assert.ok(row.summary.length>5,row.id);assert.ok(row.citations.length,row.id);
   for(const cite of [...row.citations,...(row.parallel||[])]){const b=c.books.find(b=>b.id===cite.book);assert.ok(b,row.id);assert.ok(cite.start>=1&&cite.end>=cite.start&&cite.end<=b.pages,JSON.stringify(cite));}
  }
 }
 for(const e of c.herbs.entries){assert.ok(e.identity.trim(),e.id);assert.ok(e.distinction.length>20);assert.ok(e.risk.length>30);for(const id of e.medicalSourceIds)assert.ok(sources.some(s=>s.id===id),id);}
 const text=JSON.stringify({books:c.books,herbs:c.herbs,physiognomy:c.physiognomy});
 assert.doesNotMatch(text,/[A-Z]:[\\/]/); // Never publish private absolute source paths.
 assert.doesNotMatch(text,/\d+\s*(克|毫升|mg|两)\b/); // Reading notes are not dosing instructions.
 assert.equal(c.herbs.entries[48].name,'䗪虫');assert.match(c.herbs.entries[48].aliases,/土鳖虫/);
 assert.equal(c.herbs.entries[48].citations[0].start,208);
 for(const id of ['face','taiqing','xiangshu'])assert.match(c.books.find(b=>b.id===id).author,/待考|冲突/);
});
test('herb aliases, combined filters, empty states and historical term search',async()=>{
 const {filterHerbs,filterTerms}=await import('../ganzhi/books.mjs');
 assert.deepEqual(filterHerbs(c.herbs.entries,{query:'土鳖虫'}).map(x=>x.name),['䗪虫']);
 assert.deepEqual(filterHerbs(c.herbs.entries,{query:' 天花粉 ',material:'根及根茎'}).map(x=>x.name),['栝蒌根']);
 assert.equal(filterHerbs(c.herbs.entries,{query:'天花粉',material:'菌类'}).length,0);
 assert.equal(filterHerbs(c.herbs.entries,{material:'菌类'}).length,2);
 assert.ok(filterTerms(c.physiognomy.entries,{query:'山根',group:'面部'}).some(e=>e.id==='nose'));
 assert.equal(filterTerms(c.physiognomy.entries,{query:'nomatch'}).length,0);
});

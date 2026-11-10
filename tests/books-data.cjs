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
test('all 50 herb profiles have distinct applications, usage guidance and resolvable references',()=>{
 const ids=new Set(sources.map(s=>s.id));assert.equal(ids.size,sources.length);
 for(const e of c.herbs.entries){const p=e.profile;assert.ok(p,e.name);
  for(const k of ['overview','effects','form','method','caution','evidence'])assert.ok(p[k].length>=25,`${e.name}: ${k}`);
  assert.ok(p.applications.length>=2,e.name);assert.equal(new Set(p.applications).size,p.applications.length);
  for(const k of ['traditionalSourceIds','usageSourceIds','safetySourceIds','evidenceSourceIds'])for(const id of p[k])assert.ok(ids.has(id),`${e.name}: ${id}`);
  if(p.requiresSupervision)assert.doesNotMatch(JSON.stringify(p),/\d+\s*(?:克|毫克|毫升|分钟|小时)|[一二三四五六七八九十半]+\s*(?:克|毫克|毫升|分钟|小时)/,e.name);
 }
 const byName=n=>c.herbs.entries.find(e=>e.name===n).profile;
 assert.match(byName('芍药').effects,/白芍.*赤芍/);assert.match(byName('阿胶').method,/烊化/);
 assert.match(byName('五味子').caution,/他克莫司/);assert.match(byName('防己').overview,/广防己.*马兜铃酸/);
 assert.deepEqual(byName('龙骨').traditionalSourceIds,[]);
 assert.match(sources.find(s=>s.id==='herb-hkbu-b00404').locator,/只核对身份/);
});
test('herb profile search finds preparation, constituent distinctions and interaction topics',async()=>{
 const {filterHerbs}=await import('../ganzhi/books.mjs');
 for(const [query,name] of [['烊化','阿胶'],['生地黄','地黄'],['他克莫司','五味子'],['先煎','石膏']])assert.ok(filterHerbs(c.herbs.entries,{query}).some(e=>e.name===name),query);
 assert.equal(filterHerbs(c.herbs.entries,{query:'烊化',material:'菌类'}).length,0);
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

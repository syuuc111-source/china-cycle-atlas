const {test}=require('node:test');
const assert=require('node:assert/strict');
const content=require('../ganzhi/data/content.json');
test('element filters keep stem, branch and nayin meanings separate',async()=>{
 const {searchResults}=await import('../ganzhi/render.mjs');
 for(const mode of ['stem','branch','nayin']){
  const rows=searchResults(content,'','all','木',mode);
  assert.ok(rows.length>0);
  assert.ok(rows.every(x=>x.type==='cycle'||x.type===mode));
 }
 assert.equal(searchResults(content,'','stem','木','nayin').length,0);
});
test('numeric searches use displayed one-based cycle positions',async()=>{
 const {searchResults}=await import('../ganzhi/render.mjs');
 for(let i=1;i<=60;i++)assert.deepEqual(searchResults(content,String(i),'cycle','','stem').map(x=>x.index),[i-1]);
});
test('table terms are searchable and exact entry names rank first',async()=>{
 const {searchResults}=await import('../ganzhi/render.mjs');
 for(const [name,id] of [['辛','xin'],['午','wu']])assert.equal(searchResults(content,name,'all','','stem')[0].id,id);
 const wenchang=searchResults(content,'文昌','all','','stem').map(x=>x.id);
 assert.ok(wenchang.includes('bing'));assert.ok(wenchang.includes('xin'));
 const wuqu=searchResults(content,'武曲','all','','stem').map(x=>x.id);
 for(const id of ['jia','geng','ren'])assert.ok(wuqu.includes(id),id);
});

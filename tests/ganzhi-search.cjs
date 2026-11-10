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

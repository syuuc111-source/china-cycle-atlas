const {test}=require('node:test');const assert=require('node:assert/strict');
const c=require('../ganzhi/data/content.json');const sources=require('../ganzhi/data/sources.json');
test('each of the 22 entries has a sourced cross-tradition explanation',()=>{
 const ids=new Set(sources.map(s=>s.id));
 for(const e of c.entries){
  for(const key of ['bazi','ziwei','qimen','liuren','taiyi','najia','selection','fengshui','yunqi']){
   const sections=e.sections.filter(s=>s.school===key);
   assert.ok(sections.length,e.id+': missing '+key);
   assert.ok(sections.some(s=>s.paragraphs.join('').length>=150),e.id+': insufficient '+key);
  }
  for(const s of e.sections)for(const id of s.sourceIds)assert.ok(ids.has(id),id);
  assert.ok(e.sections.some(s=>s.table?.rows.length),e.id+': no reference table');
 }
});
test('concrete examples distinguish ten-gods, palace coordinates and source variants',()=>{
 const text=id=>JSON.stringify(c.entries.find(e=>e.id===id));
 assert.ok(text('jia').includes('正印'));assert.ok(text('jia').includes('廉贞'));
 assert.ok(text('ren').includes('天府'));assert.ok(text('ren').includes('左辅'));
 assert.ok(text('wu-stem').includes('二十四山'));assert.ok(text('wu-stem').includes('不'));
 for(const id of ['ziwei-basics','ziwei-traditions','bazi-methods','school-comparison'])assert.ok(c.articles.find(a=>a.id===id));
});
test('reference tables match concrete traditional examples',()=>{
 const tables=id=>c.entries.find(e=>e.id===id).sections.filter(s=>s.table).map(s=>s.table);
 assert.deepEqual(tables('jia')[0].rows.map(row=>row[1]),['比肩','劫财','食神','伤官','偏财','正财','七杀','正官','偏印','正印']);
 assert.deepEqual(tables('geng')[0].rows.map(row=>row[1]),['偏财','正财','七杀','正官','偏印','正印','比肩','劫财','食神','伤官']);
 assert.deepEqual(tables('zi')[0].rows,[['癸','水','正印','伤官']]);
 assert.deepEqual(tables('zi')[1].rows,[['本宫','子'],['三方会照之一','辰'],['三方会照之二','申'],['对宫','午']]);
 assert.deepEqual(tables('ren')[1].rows,[['化禄','天梁'],['化权','紫微'],['化科','左辅'],['化忌','武曲']]);
 for(const entry of c.entries)for(const table of tables(entry.id))for(const row of table.rows)assert.equal(row.length,table.columns.length);
});

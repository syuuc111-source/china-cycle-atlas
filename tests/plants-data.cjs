const {test}=require('node:test');const assert=require('node:assert/strict');
const c=require('../ganzhi/data/content.json');const sources=require('../ganzhi/data/sources.json');
test('plant claims retain source, system, identification and evidence boundaries',()=>{
 const p=c.plants;assert.ok(p);assert.ok(p.records.length>=50);assert.equal(new Set(p.records.map(r=>r.id)).size,p.records.length);
 const known=new Set(sources.map(s=>s.id));
 for(const row of p.records){assert.ok(p.systems[row.system]);assert.ok(row.identity.length>10);assert.ok(row.explanation.length>20);assert.ok(row.sourceIds.length);for(const id of row.sourceIds)assert.ok(known.has(id));for(const e of [...row.elements,...row.secondaryElements])assert.ok('木火土金水'.includes(e));}
 assert.equal(p.matrix.length,5);assert.ok(p.matrix.every(row=>row.cells.length===5));
 assert.ok(p.records.find(r=>r.name==='茯苓').kind==='fungus');assert.ok(p.records.find(r=>r.name==='硝石').kind==='mineral');
 assert.ok(p.records.find(r=>r.name==='附子').note.includes('毒'));
 assert.equal(p.targetFileStatus,'unconfirmed');
});
test('specific-source outer and inner phases are not flattened',()=>{
 const r=c.plants.records;
 assert.deepEqual(r.find(x=>x.name==='桂').elements,['木']);assert.deepEqual(r.find(x=>x.name==='桂').secondaryElements,['木']);
 assert.deepEqual(r.find(x=>x.name==='姜').elements,['木']);assert.deepEqual(r.find(x=>x.name==='姜').secondaryElements,['土']);
 assert.deepEqual(r.find(x=>x.name==='五味子').elements,['金']);assert.deepEqual(r.find(x=>x.name==='五味子').secondaryElements,['金']);
 assert.deepEqual(r.find(x=>x.name==='富贵竹').elements,['木']);assert.deepEqual(r.find(x=>x.name==='开运竹').elements,['水']);
 assert.ok(r.filter(x=>x.system==='bencao').every(x=>x.elements.length===0));
});
test('source conditions and food identities survive content generation',()=>{
 const r=c.plants.records;
 assert.ok(r.find(x=>x.name==='富贵竹').identity.includes('水培属水、白色条纹属金、黄色条纹属土'));
 assert.ok(r.find(x=>x.name==='鸭脚木').identity.includes('白花属木带金'));
 assert.ok(r.filter(x=>x.system==='field').every(x=>x.explanation.includes('隔空对准')));
 assert.ok(r.filter(x=>x.id.startsWith('food-')).every(x=>x.kind==='food'));
});

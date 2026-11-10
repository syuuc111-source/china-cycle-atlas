const {test}=require('node:test');const assert=require('node:assert/strict');const c=require('../ganzhi/data/content.json');const sources=require('../ganzhi/data/sources.json');
test('body topic separates 22 historical correspondences, meridian hours and clinical causes',()=>{
 const b=c.body;assert.ok(b);assert.equal(b.entries.length,22);assert.equal(b.regions.length,12);
 const ids=new Set(sources.map(s=>s.id));for(const r of [...b.entries,...b.regions]){assert.ok(r.sourceIds.length);for(const id of r.sourceIds)assert.ok(ids.has(id),id)}
 assert.equal(b.entries.find(r=>r.name==='甲').organ,'胆');assert.equal(b.entries.find(r=>r.name==='甲').body,'头');
 const zi=b.entries.find(r=>r.name==='子');assert.equal(zi.body,'阴部');assert.equal(zi.meridian,'足少阳胆经');assert.ok(zi.variant.includes('膀胱'));
 const yin=b.entries.find(r=>r.name==='寅');assert.equal(yin.body,'腿');assert.equal(yin.meridian,'手太阴肺经');
 assert.ok(b.entries.find(r=>r.name==='壬').note.includes('三焦'));assert.ok(b.entries.find(r=>r.name==='癸').note.includes('包络'));
 for(const region of b.regions){assert.ok(region.causes.length>=2);assert.ok(region.traditional.length>35);assert.ok(region.care.length>20);assert.ok(region.observe.length>10);for(const id of region.entryIds)assert.ok(b.entries.some(e=>e.id===id));}
});
test('important symptom actions remain concrete and source referenced',()=>{
 const regions=c.body.regions;assert.ok(regions.find(r=>r.id==='chest').urgent.includes('120'));
 assert.ok(regions.find(r=>r.id==='head').urgent.includes('突然'));
 assert.ok(regions.find(r=>r.id==='eye').urgent.includes('视力'));
 assert.ok(regions.find(r=>r.id==='back').urgent.includes('大小便'));
 assert.ok(regions.every(r=>r.medicalSourceIds.every(id=>sources.some(s=>s.id===id))));
});
test('emergency guidance preserves independent triggers from cited sources',()=>{
 assert.ok(c.body.regions.find(r=>r.id==='head').urgent.includes('近三个月头部受伤'));
 assert.ok(c.body.regions.find(r=>r.id==='limbs').urgent.includes('或关节痛伴'));
 assert.ok(!c.body.regions.find(r=>r.id==='abdomen').causes.some(x=>x.title.includes('腹腔以外')));
});

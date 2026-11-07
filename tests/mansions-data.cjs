const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'../mansions');
(async()=>{
 const d=JSON.parse(fs.readFileSync(path.join(root,'data/content.json'),'utf8'));
 assert.equal(d.mansions.length,28);assert.equal(new Set(d.mansions.map(m=>m.id)).size,28);
 for(const g of d.groups)assert.equal(d.mansions.filter(m=>m.group===g.id).length,7);
 const ids=new Set(d.sources.map(s=>s.id));
 for(const m of d.mansions){assert.ok(m.summary.length>20);assert.ok(m.astronomy.length>30);assert.ok(m.culture.length>20);assert.ok(m.sourceIds.length>=2);for(const s of m.sourceIds)assert.ok(ids.has(s),`${m.name}: ${s}`);}
 const sky=JSON.parse(fs.readFileSync(path.join(root,'data/sky.json'),'utf8'));
 assert.equal(sky.asterisms.length,28);
 const stars=new Set(sky.stars.map(s=>s[0]));
 for(const m of d.mansions)assert.equal(m.anchor.label.split(' · ')[0],sky.names[String(m.anchor.hip)],`anchor ${m.name}`);
 for(const c of sky.asterisms)for(const line of c.lines)for(const hip of line)assert.ok(stars.has(hip),`Missing HIP ${hip}`);
 const {parseRoute,searchMansions}=await import('../mansions/model.mjs');
 for(const m of d.mansions)assert.equal(parseRoute('#mansion/'+m.id).id,m.id,`route ${m.name}`);
 assert.deepEqual(parseRoute('#mansion/shen'),{view:'mansion',id:'shen'});
 assert.equal(parseRoute('#nonsense').view,'home');assert.equal(parseRoute('#guide/999').chapter,0);
 assert.equal(searchMansions(d.mansions,'參','all')[0].id,'shen');
 assert.equal(searchMansions(d.mansions,'shen','all')[0]?.id,'shen');
 assert.equal(searchMansions(d.mansions,'jiao','all')[0]?.id,'jiao');
 assert.equal(searchMansions(d.mansions,'nv','all')[0]?.id,'nv');
 assert.equal(searchMansions(d.mansions,'zzzz','all').length,0);
 assert.equal(searchMansions(d.mansions,'','dragon').length,7);
 assert.equal(searchMansions(d.mansions,'角','tiger').length,0);
 console.log('PASS: 28 mansion content, 4 groups, citations, star-line integrity, routes and search');
})().catch(e=>{console.error(e);process.exit(1)});

const {test}=require('node:test');const assert=require('node:assert/strict');const data=require('../ganzhi/data/content.json').plants;
test('filter searches identity but never confuses inner or secondary phases with primary',async()=>{
 const {filterPlants}=await import('../ganzhi/plants.mjs');
 assert.ok(filterPlants(data,{query:'富贵竹'}).some(r=>r.name==='开运竹'));
 assert.deepEqual(filterPlants(data,{system:'fuxing',element:'土'}).map(r=>r.name),['甘草','大枣','人参','麦冬','茯苓']);
 assert.ok(!filterPlants(data,{system:'garden',element:'火'}).some(r=>r.name==='朱砂桔'));
 assert.equal(filterPlants(data,{system:'bencao',element:'木'}).length,0);
 assert.equal(filterPlants(data,{query:'zznomatch'}).length,0);
 assert.equal(filterPlants(data,{query:'  茉莉  '})[0].name,'茉莉');
});
test('matrix coordinates preserve the actual source ordering',()=>{
 const expected=[['桂','椒','姜','细辛','附子'],['大黄','旋覆花','泽泻','厚朴','硝石'],['甘草','大枣','人参','麦冬','茯苓'],['枳实','豉','芍药','五味子','薯蓣'],['黄芩','黄连','白术','竹叶','地黄']];
 assert.deepEqual(data.matrix.map(row=>row.cells.map(id=>data.records.find(r=>r.id===id).name)),expected);
});

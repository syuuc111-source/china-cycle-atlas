const {test}=require('node:test');const assert=require('node:assert/strict');
test('60 legal combinations, parity, wrap, nayin and six xun',async()=>{
 const {cycleAt,STEMS,BRANCHES}=await import('../ganzhi/model.mjs');
 const all=Array.from({length:60},(_,i)=>cycleAt(i));assert.equal(new Set(all.map(x=>x.name)).size,60);
 assert.equal(all[0].name,'甲子');assert.equal(all[59].name,'癸亥');assert.deepEqual(cycleAt(60),all[0]);assert.deepEqual(cycleAt(-1),all[59]);
 for(const x of all)assert.equal(STEMS.indexOf(x.stem)%2,BRANCHES.indexOf(x.branch)%2);
 assert.deepEqual([all[0].stemElement,all[0].branchElement,all[0].nayin],['木','水','海中金']);
 assert.deepEqual([0,10,20,30,40,50].map(i=>cycleAt(i).voidBranches.join('')),['戌亥','申酉','午未','辰巳','寅卯','子丑']);
 for(let i=0;i<60;i+=2)assert.equal(all[i].nayin,all[i+1].nayin);
 for(const v of [NaN,Infinity,1.2,'0'])assert.throws(()=>cycleAt(v));
});
test('hour stem follows selected day stem',async()=>{
 const {hourPillar}=await import('../ganzhi/model.mjs');
 assert.equal(hourPillar(0,0),'甲子');assert.equal(hourPillar(0,23),'甲子');assert.equal(hourPillar(1,23),'丙子');assert.equal(hourPillar(0,12),'庚午');
 assert.throws(()=>hourPillar(10,12));assert.throws(()=>hourPillar(0,24));
});
test('wheel motion advances through wrap without unwinding',async()=>{
 const {cycleDelta}=await import('../ganzhi/model.mjs');
 assert.equal(cycleDelta(59,0),1);assert.equal(cycleDelta(0,59),-1);assert.equal(cycleDelta(3,8),5);
});

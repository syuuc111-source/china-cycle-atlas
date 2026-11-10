const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');
const {Solar}=require('../ganzhi/vendor/lunar.js');
globalThis.Solar=Solar;
const q=async(input)=> (await import('../ganzhi/calendar.mjs')).queryCalendar({hour:12,minute:0,dayBoundary:'midnight',...input});
test('civil vs solar year and independent day anchor',async()=>{
 let x=await q({year:2024,month:2,day:9});assert.equal(x.civil.yearPillar,'癸卯');assert.equal(x.solar.year,'甲辰');assert.equal(x.solar.month,'丙寅');
 x=await q({year:2019,month:1,day:27});assert.equal(x.solar.day,'甲子');
});
test('invalid input never normalizes silently',async()=>{
 for(const input of [{year:2023,month:2,day:29},{year:1900,month:12,day:31},{year:2101,month:1,day:1},{year:2024,month:0,day:1},{year:2024,month:1,day:1,hour:24},{year:2024,month:1,day:1,minute:60},{year:2024,month:1,day:1,dayBoundary:'unknown'},{year:2024.5,month:1,day:1}])assert.equal((await q(input)).ok,false);
});
test('midnight and zi boundaries use coherent hour stems',async()=>{
 const x=await q({year:2019,month:1,day:27,hour:23,minute:30});assert.equal(x.solar.day,'甲子');assert.equal(x.solar.hour,'甲子');
 const y=await q({year:2019,month:1,day:27,hour:23,minute:30,dayBoundary:'zi'});assert.equal(y.solar.day,'乙丑');assert.equal(y.solar.hour,'丙子');
 for(const [day,hour,minute,expected] of [[27,22,59,'甲子'],[27,23,0,'甲子'],[27,23,59,'甲子'],[28,0,0,'乙丑'],[28,0,1,'乙丑']])assert.equal((await q({year:2019,month:1,day,hour,minute})).solar.day,expected);
 assert.equal((await q({year:2100,month:12,day:31,hour:23,dayBoundary:'zi'})).ok,true);
});
test('independent HKO lunar dates, five years including 2033 and endpoints',async()=>{
 const fixture=JSON.parse(fs.readFileSync('evidence/ganzhi-calendar-reference.json','utf8'));
 for(const row of fixture.dates){const [year,month,day]=row.date.split('-').map(Number);const x=await q({year,month,day});assert.equal(x.ok,true,row.date);assert.equal(x.civil.lunarDay,row.day,row.date);if(row.month!==null)assert.equal(x.civil.lunarMonth,row.month,row.date);}
});
test('24 independently published solar term times agree within 90 seconds',()=>{
 const fixture=JSON.parse(fs.readFileSync('evidence/ganzhi-calendar-reference.json','utf8'));
 const table=Solar.fromYmd(2024,6,1).getLunar().getJieQiTable();
 for(const row of fixture.terms){const actual=table[row.name==='冬至'?'DONG_ZHI':row.name].toYmdHms();const delta=Math.abs(Date.parse(actual.replace(' ','T')+'+08:00')-Date.parse(row.time+'+08:00'))/1000;assert.ok(delta<=90,`${row.name} ${delta}s`);}
});
test('all 12 jie change month; zhongqi do not',async()=>{
 const fixture=JSON.parse(fs.readFileSync('evidence/ganzhi-calendar-reference.json','utf8'));
 for(const [i,row] of fixture.terms.entries()){
  const t=Date.parse(row.time+'Z');const input=ms=>{const d=new Date(ms);return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate(),hour:d.getUTCHours(),minute:d.getUTCMinutes()}};
  const a=await q(input(t-120000)),b=await q(input(t+120000));assert.equal(a.solar.month!==b.solar.month,i%2===0,row.name);
 }
});
test('date results independent of host timezone',()=>{
 const {execFileSync}=require('node:child_process');
 const script="globalThis.Solar=require('./ganzhi/vendor/lunar.js').Solar;import('./ganzhi/calendar.mjs').then(m=>console.log(JSON.stringify(m.queryCalendar({year:1988,month:7,day:1,hour:23,minute:30,dayBoundary:'midnight'}))))";
 const outputs=['UTC','Asia/Shanghai','America/New_York'].map(TZ=>execFileSync(process.execPath,['-e',script],{env:{...process.env,TZ},encoding:'utf8'}));assert.equal(new Set(outputs).size,1);
});
test('all supported civil dates remain valid and day cycle agrees independently',async()=>{
 const {queryCalendar}=await import('../ganzhi/calendar.mjs');let count=0;
 for(let ms=Date.UTC(1901,0,1);ms<Date.UTC(2101,0,1);ms+=86400000){const d=new Date(ms),year=d.getUTCFullYear(),month=d.getUTCMonth()+1,day=d.getUTCDate();const out=queryCalendar({year,month,day,hour:12,minute:0,dayBoundary:'midnight'});assert.equal(out.ok,true,`${year}-${month}-${day}`);assert.equal(out.solar.day,Solar.fromYmd(year,month,day).getLunar().getDayInGanZhi());count++;}
 assert.equal(count,73049);
});

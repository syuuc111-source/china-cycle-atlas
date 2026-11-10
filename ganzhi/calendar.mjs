import {STEMS,cycleAt,hourPillar,mod} from './model.mjs';
const leap=y=>y%4===0&&(y%100!==0||y%400===0);
export function queryCalendar(input){
 const {year:y,month:m,day:d,hour:h,minute:min,dayBoundary}=input||{};
 const fail=(code,message)=>({ok:false,code,message});
 if(![y,m,d,h,min].every(Number.isInteger))return fail('integer','请输入完整的公历日期和时间。');
 if(y<1901||y>2100)return fail('range','查询支持1901—2100年，请调整年份。');
 if(m<1||m>12||d<1||d>[31,leap(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1])return fail('date','这个公历日期不存在，请检查月份、日期和闰年。');
 if(h<0||h>23||min<0||min>59)return fail('time','小时须为0—23，分钟须为0—59。');
 if(!['midnight','zi'].includes(dayBoundary))return fail('boundary','请选择00:00或23:00换日。');
 if(!globalThis.Solar)return fail('dependency','历算资料没有载入，请刷新页面重试。');
 try{
  const sol=globalThis.Solar.fromYmdHms(y,m,d,h,min,0),l=sol.getLunar();
  // Continuous civil days from independently documented 2019-01-27 甲子.
  const offset=Math.round((Date.UTC(y,m-1,d)-Date.UTC(2019,0,27))/86400000)+(dayBoundary==='zi'&&h===23?1:0);
  const day=cycleAt(offset),hour=hourPillar(STEMS.indexOf(day.stem),h);
  const current=Date.UTC(y,m-1,d,h,min),table=l.getJieQiTable();
  const near=Object.entries(table).map(([name,t])=>({name,time:t.toYmdHms(),ms:Date.UTC(t.getYear(),t.getMonth()-1,t.getDay(),t.getHour(),t.getMinute(),t.getSecond())})).sort((a,b)=>Math.abs(a.ms-current)-Math.abs(b.ms-current))[0];
  const boundaryWarning=Math.abs(near.ms-current)<120000?'当前输入接近交节时刻；不同历算模型可能有秒级至分钟级差异，请结合权威历表核对。':'';
  return {ok:true,civil:{date:sol.toYmdHms(),lunarDate:`${l.getYearInChinese()}年${l.getMonthInChinese()}月${l.getDayInChinese()}`,lunarDay:l.getDay(),lunarMonth:l.getMonth(),yearPillar:l.getYearInGanZhi()},solar:{year:l.getYearInGanZhiExact(),month:l.getMonthInGanZhiExact(),day:day.name,hour},rules:{timezone:'固定 UTC+08:00；不自动套历史夏令时或真太阳时',year:'农历纪年以正月初一换年；节气年柱以立春交节换年',month:'节气月柱按十二节交节时刻划分，与立春年干配套',day:dayBoundary==='zi'?'23:00换日；晚子时采用次日日干':'00:00换日；晚子时仍采用当日日干',hour:`按选定${day.stem}日干推时干；每两个标准小时一支`},nearestTerm:{time:near.time},boundaryWarning,precisionNote:'节气采用 lunar-javascript 1.7.8 推算；2024年24节气已与香港天文台分钟表核对（偏差不超过90秒）。其他年份不作同等精度保证；日干支依连续日数计算。',sourceIds:['calendar','terms','liu','library']};
 }catch{return fail('calculation','本次日期计算未完成，请检查输入或刷新后重试。');}
}

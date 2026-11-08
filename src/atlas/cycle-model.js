(function(root){
 'use strict';
 const mod=(a,b)=>((a%b)+b)%b,rad=Math.PI/180;
 const ELEMENTS={木:{color:'#348b50',light:'#e6f3e8'},火:{color:'#d7443e',light:'#fce9e6'},土:{color:'#e88328',light:'#fff0df'},金:{color:'#c9a32c',light:'#fbf3ce'},水:{color:'#307dc0',light:'#e5f0fc'}};
 const STEMS='甲乙丙丁戊己庚辛壬癸',BRANCHES='子丑寅卯辰巳午未申酉戌亥';
 const NAYIN='海中金 炉中火 大林木 路旁土 剑锋金 山头火 涧下水 城头土 白蜡金 杨柳木 泉中水 屋上土 霹雳火 松柏木 长流水 沙中金 山下火 平地木 壁上土 金箔金 覆灯火 天河水 大驿土 钗钏金 桑柘木 大溪水 沙中土 天上火 石榴木 大海水'.split(' ');
 const QI=[{name:'厥阴风木',element:'木',short:'风木'}, {name:'少阴君火',element:'火',short:'君火'}, {name:'少阳相火',element:'火',short:'相火'}, {name:'太阴湿土',element:'土',short:'湿土'}, {name:'阳明燥金',element:'金',short:'燥金'}, {name:'太阳寒水',element:'水',short:'寒水'}];
 function yearInfo(year){const i=mod(year-1984,60),g=i%10,z=i%12,n=NAYIN[Math.floor(i/2)];return {index:i,ganzi:STEMS[g]+BRANCHES[z],stem:STEMS[g],branch:BRANCHES[z],stemElement:'木木火火土土金金水水'[g],branchElement:'水土木木土火火土金金土水'[z],nayin:{name:n,element:n.slice(-1)},yunElement:'土金水木火'[g%5],strength:g%2?'不及':'太过',sitian:QI[[1,3,2,4,5,0][z%6]],zaiquan:QI[[4,5,0,1,3,2][z%6]]};}
 function category(year,mode){const q=yearInfo(year);switch(mode){case 'stem':return {element:q.stemElement,label:q.stem+'·'+q.stemElement};case 'branch':return {element:q.branchElement,label:q.branch+'·'+q.branchElement};case 'yun':return {element:q.yunElement,label:q.yunElement+'运'+q.strength};case 'sitian':return {element:q.sitian.element,label:q.sitian.name};case 'zaiquan':return {element:q.zaiquan.element,label:q.zaiquan.name};default:return {element:q.nayin.element,label:q.nayin.name};}}
 function normalization(points){const v=points.filter(p=>!p.exclude_window&&Number.isFinite(p.value)).map(p=>p.value);if(!v.length)return null;const mean=v.reduce((a,b)=>a+b,0)/v.length;return {mean,sd:Math.sqrt(v.reduce((a,b)=>a+(b-mean)**2,0)/v.length),min:Math.min(...v),max:Math.max(...v),n:v.length};}
 function normalized(v,stats,method){if(!stats)return null;return method==='range'?(stats.max===stats.min?null:100*(v-stats.min)/(stats.max-stats.min)):(stats.sd? (v-stats.mean)/stats.sd:null);}
 function jdFromYear(year){const y=Math.floor(year),d=new Date(0);d.setUTCFullYear(y,0,1);d.setUTCHours(0,0,0,0);const e=new Date(d);e.setUTCFullYear(y+1);return 2440587.5+(d.getTime()+(e-d)*(year-y))/86400000;}
 function solveKepler(M,e){let E=M;for(let i=0;i<20;i++){const delta=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));E-=delta;if(Math.abs(delta)<1e-13)break;}return E;}
 function planetPosition(planet,jd){if(!Number.isFinite(jd)||jd<jdFromYear(-2999)||jd>=jdFromYear(3001))return null;const T=(jd-2451545)/36525;
  const el=planet.elements.map((v,i)=>v+planet.rates[i]*T),[a,e,I,L,peri,node]=el;
  const [b,c,s,f]=planet.correction||[0,0,0,0];const M=(mod(L-peri+b*T*T+c*Math.cos(f*T*rad)+s*Math.sin(f*T*rad)+180,360)-180)*rad,E=solveKepler(M,e);
  const xp=a*(Math.cos(E)-e),yp=a*Math.sqrt(1-e*e)*Math.sin(E),w=(peri-node)*rad,N=node*rad,inc=I*rad;
  const x=(Math.cos(w)*Math.cos(N)-Math.sin(w)*Math.sin(N)*Math.cos(inc))*xp+(-Math.sin(w)*Math.cos(N)-Math.cos(w)*Math.sin(N)*Math.cos(inc))*yp;
  const y=(Math.cos(w)*Math.sin(N)+Math.sin(w)*Math.cos(N)*Math.cos(inc))*xp+(-Math.sin(w)*Math.sin(N)+Math.cos(w)*Math.cos(N)*Math.cos(inc))*yp;
  const z=Math.sin(w)*Math.sin(inc)*xp+Math.cos(w)*Math.sin(inc)*yp;
  return {x,y,z,longitude:mod(Math.atan2(y,x)/rad,360),latitude:Math.atan2(z,Math.hypot(x,y))/rad,distance:Math.hypot(x,y,z),meanAnomaly:M,E};
 }
 const api={mod,ELEMENTS,STEMS,BRANCHES,NAYIN,QI,yearInfo,category,normalization,normalized,jdFromYear,solveKepler,planetPosition};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.CycleModel=api;
})(typeof globalThis==='object'?globalThis:this);

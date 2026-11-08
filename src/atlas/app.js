'use strict';
// Display-only contrast adjustment; source colours and numeric data are untouched.
const displayColors=new Map();
function themeColor(color){
 if(!/^#[\da-f]{6}$/i.test(color))return color;
 if(displayColors.has(color))return displayColors.get(color);
 let rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
 const luminance=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
 const base=luminance([16,28,50]);
 while((luminance(rgb)+.05)/(base+.05)<4.5)rgb=rgb.map(v=>Math.min(255,Math.round(v+(255-v)*.12)));
 const result='#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');displayColors.set(color,result);return result;
}
function bandInk(color,alpha=.78){
 const rgb=[1,3,5].map((i,j)=>parseInt(color.slice(i,i+2),16)*alpha+[16,28,50][j]*(1-alpha));
 const linear=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
 const l=linear.reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
 return (l+.05)/.05>=1.05/(l+.05)?'#000000':'#ffffff';
}
const DATA=JSON.parse(document.getElementById('dataset').textContent);
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mod=(n,m)=>((n%m)+m)%m;
const astro=y=>y<0?y+1:y;
const historical=a=>a<=0?a-1:a;
const yearLabel=a=>a<=0?`前${1-a}年`:`${a}年`;
const historicalLabel=y=>yearLabel(astro(y));
const format=(v,d=2)=>Number.isFinite(v)?v.toLocaleString('zh-CN',{maximumFractionDigits:d}):'—';
const ganzi=a=>'甲乙丙丁戊己庚辛壬癸'[mod(a-1984,10)]+'子丑寅卯辰巳午未申酉戌亥'[mod(a-1984,12)];
const yun=a=>Math.floor(mod(a-1864,180)/20)+1;
const yuan=a=>['上元','中元','下元'][Math.floor(mod(a-1864,180)/60)];
const MIN=-2069,MAX=2050;
const state={start:MIN,end:MAX,year:1644,window:30,visible:new Set(['dynasties','events','ganzi','wuyun','sitian','zaiquan','sanyuan',...DATA.series.map(s=>s.id)])};
const source=id=>DATA.sources.find(s=>s.id===id);
const series=id=>DATA.series.find(s=>s.id===id);
function sourceButton(id,label='查看来源 ↗'){return `<button class="text-btn" data-source="${esc(id)}">${esc(label)}</button>`;}
function openDialog(html){$('detailBody').innerHTML=html;if(!$('detailDialog').open)$('detailDialog').showModal();}
function sourceDetail(id){const s=source(id);if(!s)return;openDialog(`<p class="eyebrow">${esc(s.kind)} / ${esc(s.id)}</p><h2>${esc(s.title)}</h2><p>${esc(s.note)}</p><p><b>核验层级：</b>${esc(s.access)}<br><b>检索日期：</b>${s.accessed}</p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">打开原始资料 ↗</a><p class="micro">链接是外部资料；本图中的具体数值来自随附数据快照，后续源站修订可能造成差异。</p>`);}
function recordDetail(type,index){let d=type==='dynasty'?DATA.dynasties[index]:DATA.events[index];openDialog(`<p class="eyebrow">${type==='dynasty'?'历史分期 / 政权':'事件选集 / '+esc(d.category)}</p><h2>${esc(d.name)}</h2><p>${historicalLabel(d.start)} — ${historicalLabel(d.end)}${d.name==='中华人民共和国'?'（截至研究日，仍持续）':''}</p><p>${esc(d.note)}</p>${sourceButton(d.source,source(d.source)?.title||'来源')}`);}
function pointDetail(id,year){const s=series(id),p=s.points.find(p=>p.year===year);if(!p)return;openDialog(`<p class="eyebrow">${esc(s.kind)} / 原始采样点</p><h2>${esc(s.label)}</h2><p><b>${historicalLabel(p.year)}：${format(p.value,5)} ${esc(s.unit)}</b></p><p>${esc(s.region)}<br>${esc(s.resolution)}</p>${p.date_note?`<div class="notice">${esc(p.date_note)}</div>`:''}${Number.isFinite(p.error)?`<p>Error原值：${p.error} °C；定义为最大估计误差范围。未确认半宽含义，不擅自转成±范围或95%置信区间。</p>`:''}${p.lo!==undefined?`<p>来源给出的95%置信区间：${format(p.lo,4)} 至 ${format(p.hi,4)} °C。</p>`:''}<p>${esc(s.notes)}</p>${sourceButton(s.source)}`);}
document.addEventListener('click',e=>{const b=e.target.closest('[data-source]');if(b)sourceDetail(b.dataset.source);const t=e.target.closest('[data-open-tab]');if(t)switchTab(t.dataset.openTab);});
$('closeDialog').onclick=()=>$('detailDialog').close();
$('detailDialog').addEventListener('click',e=>{if(e.target===$('detailDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
function download(name,content,type){const u=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);}
$('exportAll').onclick=()=>download('中国周期图谱_数据与来源_2026-11-06.json',JSON.stringify(DATA,null,2),'application/json;charset=utf-8');
$('exportSvg').onclick=()=>{const svg=$('chartHost').querySelector('svg');download('中国周期图谱_当前时间窗口.svg',new XMLSerializer().serializeToString(svg),'image/svg+xml;charset=utf-8');};
let panelTransition=null;
function switchTab(tab){
 const target=$('tab-'+tab);if(!target)return;
 const changed=!target.classList.contains('active');
 panelTransition?.cancel();panelTransition=null;
 document.querySelectorAll('.tabs button').forEach(b=>{b.classList.toggle('active',b.dataset.tab===tab);b.setAttribute('aria-pressed',String(b.dataset.tab===tab));b.setAttribute('aria-controls','tab-'+b.dataset.tab)});
 document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p===target));
 if(tab==='atlas')renderChart();if(window.CycleEnhancements)window.CycleEnhancements.onTab(tab);
 if(changed&&!matchMedia('(prefers-reduced-motion: reduce)').matches)panelTransition=target.animate([{opacity:.55},{opacity:1}],{duration:180,easing:'ease-out'});
}
const layerPanel=$('toggleLayerPanel');
layerPanel.onclick=()=>{const open=layerPanel.getAttribute('aria-expanded')!=='true';layerPanel.setAttribute('aria-expanded',String(open));layerPanel.textContent=open?'收起图层':'展开图层';document.querySelector('.layers').classList.toggle('is-open',open)};
document.querySelector('.skip-link').onclick=e=>{e.preventDefault();$('workspace').focus();$('workspace').scrollIntoView({behavior:'instant'})};
addEventListener('hashchange',()=>{const tab=location.hash.slice(1);if($('tab-'+tab))switchTab(tab)});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches){panelTransition?.cancel();panelTransition=null}});

document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
$('countSeries').textContent=DATA.series.length;$('countPoints').textContent=DATA.series.reduce((n,s)=>n+s.points.length,0).toLocaleString();$('countSources').textContent=DATA.sources.length;

function buildLayers(){let out='<div class="layer-group">历史背景</div>';const check=(id,label,color,sub='')=>`<label class="layer-item"><input type="checkbox" data-layer="${id}" checked><i class="layer-line" style="background:${color}"></i><span>${label}${sub?`<small>${sub}</small>`:''}</span></label>`;out+=check('dynasties','政权与历史分期','#8a9b83');out+=check('events','历史事件选集','#f0c77f');out+='<div class="layer-group">数值变量</div>';DATA.series.forEach(s=>{out+=check(s.id,s.label.split(' · ')[1],themeColor(s.color),s.kind+' · '+s.unit);});out+='<div class="layer-group">传统规则</div>';out+=check('ganzi','六十甲子','#9bb6ef','年度回算，非实测');out+=check('wuyun','五运 · 年中运','#e88328','甲己土等化运规则');out+=check('sitian','六气 · 司天','#d7443e','按年支配属');out+=check('zaiquan','六气 · 在泉','#307dc0','按年支配属');out+=check('sanyuan','三元九运','#a689b6','选定规则，1864起');$('layerControls').innerHTML=out;document.querySelectorAll('[data-layer]').forEach(c=>c.onchange=()=>{c.checked?state.visible.add(c.dataset.layer):state.visible.delete(c.dataset.layer);renderAtlas();});}
$('toggleLayers').onclick=()=>{const all=document.querySelectorAll('[data-layer]'),enable=state.visible.size===0;all.forEach(c=>{c.checked=enable;enable?state.visible.add(c.dataset.layer):state.visible.delete(c.dataset.layer);});renderAtlas();};
function rangeMessage(text,error=false){$('rangeMessage').textContent=text;$('rangeMessage').classList.toggle('error',error);}
function setRange(a,b){if(!Number.isFinite(a)||!Number.isFinite(b)||a>=b)return false;let span=Math.max(5,Math.min(MAX-MIN,b-a));a=Math.max(MIN,Math.min(a,MAX-span));b=a+span;state.start=Math.round(a);state.end=Math.round(b);$('rangeStart').value=historical(state.start);$('rangeEnd').value=historical(state.end);document.querySelectorAll('[data-range]').forEach(e=>{const [x,y]=e.dataset.range.split(',').map(Number);e.classList.toggle('selected',astro(x)===state.start&&astro(y)===state.end);});renderChart();return true;}
$('applyRange').onclick=()=>{const a=Number($('rangeStart').value),b=Number($('rangeEnd').value);if(!$('rangeStart').value||!$('rangeEnd').value||!Number.isInteger(a)||!Number.isInteger(b)||a===0||b===0||a< -2070||b>2050||astro(a)>=astro(b)){rangeMessage('请输入前2070年至2050之间的整数年份；起点须早于终点，不能输入0年。',true);return;}setRange(astro(a),astro(b));rangeMessage('已更新窗口。各数值轨道纵轴随窗口变化；点击条目可查来源。');};
document.querySelectorAll('[data-range]').forEach(b=>b.onclick=()=>{const [a,z]=b.dataset.range.split(',').map(Number);setRange(astro(a),astro(z));rangeMessage('点击时间轴查询年份；点击样本点或历史条目查看证据。');});
function zoom(f){const mid=state.year>=state.start&&state.year<=state.end?state.year:(state.start+state.end)/2;const span=(state.end-state.start)*f;setRange(mid-span/2,mid+span/2);}
$('zoomIn').onclick=()=>zoom(.5);$('zoomOut').onclick=()=>zoom(2);$('panLeft').onclick=()=>{const d=(state.end-state.start)*.35;setRange(state.start-d,state.end-d);};$('panRight').onclick=()=>{const d=(state.end-state.start)*.35;setRange(state.start+d,state.end+d);};
function setYear(a,pan=false){state.year=Math.max(MIN,Math.min(MAX,Math.round(a)));$('yearInput').value=historical(state.year);$('yearSlider').value=state.year;if(pan&&(state.year<state.start||state.year>state.end)){const d=Math.min(200,state.end-state.start);setRange(state.year-d/2,state.year+d/2);}renderAtlas();}
$('goYear').onclick=()=>{const y=Number($('yearInput').value);if(!$('yearInput').value||!Number.isInteger(y)||y===0||y< -2070||y>2050){rangeMessage('年份须为前2070年至2050之间的整数；没有公元0年。',true);return;}setYear(astro(y),true);rangeMessage('已定位至'+historicalLabel(y)+'。');};
$('yearInput').onkeydown=e=>{if(e.key==='Enter')$('goYear').click();};$('yearSlider').oninput=e=>setYear(Number(e.target.value));$('windowSize').onchange=e=>{state.window=Number(e.target.value);renderAtlas();};

function renderChart(){
const host=$('chartHost'),W=Math.max(780,Math.round(host.clientWidth||900)),L=151,R=W-23,P=R-L,span=state.end-state.start,x=a=>L+(a-state.start)/span*P;
let rows=[],Y=56;
if(state.visible.has('dynasties')){rows.push({id:'dynasties',y:Y,h:135});Y+=135;}
DATA.series.filter(s=>state.visible.has(s.id)).forEach(s=>{rows.push({id:s.id,s,y:Y,h:83});Y+=83;});
if(state.visible.has('events')){rows.push({id:'events',y:Y,h:75});Y+=75;}
if(state.visible.has('ganzi')){rows.push({id:'ganzi',y:Y,h:54});Y+=54;}
for(const id of ['wuyun','sitian','zaiquan'])if(state.visible.has(id)){rows.push({id,y:Y,h:54});Y+=54;}
if(state.visible.has('sanyuan')){rows.push({id:'sanyuan',y:Y,h:54});Y+=54;}
const H=Math.max(180,Y+28);let z=[`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="min-width:780px" role="img" aria-label="中国历史多变量时间轴"><title>中国周期图谱 · ${yearLabel(state.start)}至${yearLabel(state.end)}</title><desc>观测、历史估算、事件与传统规则分轨显示。点击查询。数值轨各自独立纵轴，空白为本版无数据。</desc><defs><clipPath id="plotClip"><rect x="${L}" y="35" width="${P}" height="${H-50}"/></clipPath><pattern id="futurePattern" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#44516a" stroke-width=".5"/></pattern></defs><rect width="${W}" height="${H}" fill="#101c32"/>`];
const text=(xx,yy,t,size=11,color='#a6b7ce',extra='',preserveInk=false)=>`<text x="${xx}" y="${yy}" font-size="${Math.max(11,size)}" fill="${preserveInk?color:themeColor(color)}" ${extra}>${esc(t)}</text>`;
const rect=(xx,yy,w,h,fill,extra='')=>`<rect x="${xx}" y="${yy}" width="${Math.max(0,w)}" height="${h}" fill="${fill}" ${extra}/>`;
if(state.end>2026){const xx=Math.max(L,x(2027));z.push(rect(xx,35,R-xx,H-50,'#222b39'),rect(xx,35,R-xx,H-50,'url(#futurePattern)'));if(R-xx>50)z.push(text(xx+7,48,'未来 · 规则/情景',10,'#d4c29e'));}
const step=[1,2,5,10,20,25,50,100,200,250,500,1000].find(s=>span/s<=8)||1000;
for(let tick=Math.ceil(historical(state.start)/step)*step;tick<=historical(state.end);tick+=step){if(tick===0)continue;const a=tick===0?0:astro(tick);if(a<state.start||a>state.end)continue;const xx=x(a);z.push(`<line x1="${xx}" y1="32" x2="${xx}" y2="${H-20}" stroke="#293a54" stroke-dasharray="2 4"/>`,text(xx,24,yearLabel(a),10,'#a6b7ce','text-anchor="middle"'));}
z.push(text(13,24,'同一横轴 · 独立纵轴',10));
if(state.year+state.window>=state.start&&state.year-state.window<=state.end){const a=Math.max(L,x(state.year-state.window)),b=Math.min(R,x(state.year+state.window));z.push(rect(a,35,b-a,H-50,'#6cddd718'));}
for(const row of rows){const yy=row.y;z.push(`<line x1="12" y1="${yy+row.h-1}" x2="${R}" y2="${yy+row.h-1}" stroke="#26384f"/>`);
if(row.id==='dynasties'){
 z.push(text(13,yy+22,'政权 / 历史分期',12,'#d6e5f5'),text(13,yy+42,'多政权并列 · 口径见详情',9));
 DATA.dynasties.forEach((d,i)=>{const a=astro(d.start),b=astro(d.end);if(b<state.start||a>state.end)return;const xx=Math.max(L,x(a)),xx2=Math.min(R,x(b));const cy=yy+8+d.lane*27;const colors=['#254139','#234454','#493f2b','#334362'];const tip=`${d.name}：${historicalLabel(d.start)}—${historicalLabel(d.end)}。${d.note}`;z.push(rect(xx,cy,Math.max(2,xx2-xx),21,colors[d.lane%4],`rx="3" data-record="dynasty:${i}" data-tip="${esc(tip)}" style="cursor:pointer"`));const available=xx2-xx-9;if(available>18){const count=Math.floor(available/10);const label=d.name.length<=count?d.name:d.name.slice(0,Math.max(1,count-1))+'…';z.push(text(xx+4,cy+14,label,10,'#e2eaf4',`pointer-events="none"`));}});
}else if(row.s){
 const s=row.s,pts=s.points.filter(p=>astro(p.year)>=state.start&&astro(p.year)<=state.end);z.push(text(13,yy+23,s.label.split(' · ')[1],12,themeColor(s.color)),text(13,yy+41,s.unit,9),text(13,yy+57,s.kind+' · '+s.points[0].year+'–'+s.points.at(-1).year,9));
 if(!pts.length){z.push(text(L+12,yy+43,'该窗口无已接入数值 · 空白不等于零',10,'#a6b7ce'));continue;}
 let values=pts.map(p=>p.value),lo=Math.min(...values),hi=Math.max(...values);if(lo===hi){lo-=Math.max(1,Math.abs(lo)*.1);hi+=Math.max(1,Math.abs(hi)*.1);}const pad=(hi-lo)*.13;lo-=pad;hi+=pad;if(['population','pop_history','gdppc','sunspots'].includes(s.id))lo=Math.max(0,lo);
 const py=v=>yy+65-(v-lo)/(hi-lo)*50;z.push(text(L-7,yy+19,format(hi,1),8,'#a6b7ce','text-anchor="end"'),text(L-7,yy+65,format(lo,1),8,'#a6b7ce','text-anchor="end"'));
 if(lo<0&&hi>0)z.push(`<line x1="${L}" y1="${py(0)}" x2="${R}" y2="${py(0)}" stroke="#405a70" stroke-dasharray="3 4"/>`);
 let path='',last=null;for(const p of pts){const px=x(astro(p.year)),qy=py(p.value);const contiguous=last&&p.year-last.year<=s.step*1.1;path+=(contiguous?'L':'M')+px.toFixed(2)+','+qy.toFixed(2);last=p;}
 z.push(`<path d="${path}" fill="none" stroke="${themeColor(s.color)}" stroke-width="1.6" stroke-linejoin="round" clip-path="url(#plotClip)"/>`);
 for(const p of pts){let tip=`${s.label} · ${historicalLabel(p.year)}：${format(p.value,4)} ${s.unit}`;if(s.id==='paleo')tip+='（30年区间中点，非单年值）';if(p.date_note)tip+='。'+p.date_note;z.push(`<circle cx="${x(astro(p.year))}" cy="${py(p.value)}" r="${pts.length>160?1.7:2.6}" fill="${p.exclude_window?'#101c32':themeColor(s.color)}" stroke="${p.exclude_window?themeColor(s.color):'#101c32'}" stroke-width="${p.exclude_window?1.8:.5}" data-point="${s.id}:${p.year}" data-tip="${esc(tip)}" style="cursor:pointer"/>`);}
}else if(row.id==='events'){
 z.push(text(13,yy+25,'历史事件选集',12,'#e2c28a'),text(13,yy+44,'非完整战争 / 灾害样本',9));
 DATA.events.forEach((d,i)=>{const a=astro(d.start),b=astro(d.end);if(b<state.start||a>state.end)return;const xx=Math.max(L,x(a)),x2=Math.min(R,x(b)),cy=yy+14+(i%2)*25;const tip=`${d.name} · ${historicalLabel(d.start)}—${historicalLabel(d.end)}：${d.note}`;z.push(`<line x1="${xx}" y1="${cy+8}" x2="${Math.max(xx+3,x2)}" y2="${cy+8}" stroke="#c3a66b" stroke-width="4"/>`,rect(xx-4,cy+4,8,8,'#b38b46',`rx="2" data-record="event:${i}" data-tip="${esc(tip)}" style="cursor:pointer"`));if(span<600&&xx+70<R)z.push(text(xx+7,cy+11,d.name,9,'#e2c28a','pointer-events="none"'));});
 }else if(['ganzi','wuyun','sitian','zaiquan'].includes(row.id)){
 const mode=row.id==='ganzi'?$('atlasElementMode').value:row.id==='wuyun'?'yun':row.id;
 const title={ganzi:'六十甲子',wuyun:'五运 · 年中运',sitian:'六气 · 司天',zaiquan:'六气 · 在泉'}[row.id];
 const modeName={nayin:'纳音',stem:'天干本气',branch:'地支本气',yun:'年中运',sitian:'司天',zaiquan:'在泉'}[mode];
 z.push(text(13,yy+22,title,12,'#b7d3d1'),text(13,yy+40,modeName+' · 年度规则',9));
 for(let a=Math.floor(state.start);a<state.end;a++){
  const c=CycleModel.category(a,mode),xx=Math.max(L,x(a)),end=Math.min(R,x(a+1)),col=CycleModel.ELEMENTS[c.element];
  const tip=yearLabel(a)+' '+ganzi(a)+' · '+modeName+'：'+c.label+'；年度简化，非自然/社会实测';
  z.push(rect(xx,yy+10,Math.max(0,end-xx),25,col.color,`opacity=".78" data-element-year="${a}" data-tip="${esc(tip)}" style="cursor:pointer"`));
  if(end-xx>24)z.push(text((xx+end)/2,yy+27,mode==='nayin'?ganzi(a):c.element,10,bandInk(col.color),'text-anchor="middle" pointer-events="none"',true));
 }
 if(span>120)z.push(text(L+6,yy+48,'逐年配色；放大到120年以内更易辨认。完整文字见探针及五运六气页。',9));
}else if(row.id==='sanyuan'){
 z.push(text(13,yy+22,'三元九运',12,'#9bb6ef'),text(13,yy+40,'1864锚点 · 20年一运',9));
 if(state.end<1864)z.push(text(L+12,yy+29,'本版不向1864年前回推三元九运',10,'#a6b7ce'));
 for(let a=1864;a<=state.end;a+=20){if(a+20<state.start)continue;const xx=Math.max(L,x(a)),b=Math.min(R,x(a+20));z.push(rect(xx,yy+10,Math.max(1,b-xx-1),25,yun(a)%2?'#314365':'#23344e',`rx="2" data-tip="${a}–${a+19}：${yuan(a)}${yun(a)}运；传统选定规则，无实测效应。"`));if(b-xx>18)z.push(text(xx+3,yy+27,yun(a)+'运',10,'#806b98'));}
}
}
if(!rows.length)z.push(text(W/2,100,'请在左侧选择至少一个图层',13,'#a6b7ce','text-anchor="middle"'));
if(state.year>=state.start&&state.year<=state.end){const xx=x(state.year);z.push(`<line x1="${xx}" y1="32" x2="${xx}" y2="${H-18}" stroke="#f0c77f" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none"/><circle cx="${xx}" cy="36" r="8" fill="#f0c77f12" stroke="#f0c77f77" pointer-events="none"/><circle cx="${xx}" cy="36" r="3" fill="#f0c77f" pointer-events="none"/>`);z.push(text(Math.min(R-4,Math.max(L+30,xx)),H-5,yearLabel(state.year),10,'#6cddd7','text-anchor="middle"'));}
z.push('</svg>');host.innerHTML=z.join('');$('chartRange').textContent=yearLabel(state.start)+' — '+yearLabel(state.end)+' · 点击查询';
host.onclick=e=>{const annual=e.target.closest('[data-element-year]');if(annual){setYear(+annual.dataset.elementYear);return;}const rec=e.target.closest('[data-record]'),pt=e.target.closest('[data-point]');if(rec){const [t,i]=rec.dataset.record.split(':');const d=t==='dynasty'?DATA.dynasties[+i]:DATA.events[+i];recordDetail(t,+i);return;}if(pt){const [id,y]=pt.dataset.point.split(':');setYear(astro(+y));pointDetail(id,+y);return;}const svg=host.querySelector('svg'),b=svg.getBoundingClientRect(),px=(e.clientX-b.left)*W/b.width;if(px>=L&&px<=R)setYear(state.start+(px-L)/P*span);};
host.onmousemove=e=>{const t=e.target.closest('[data-tip]');if(!t){$('tooltip').style.display='none';return;}$('tooltip').textContent=t.dataset.tip;$('tooltip').style.display='block';$('tooltip').style.left=Math.max(8,Math.min(window.innerWidth-295,e.clientX+14))+'px';$('tooltip').style.top=Math.min(window.innerHeight-90,e.clientY+15)+'px';};host.onmouseleave=()=>{$('tooltip').style.display='none';};
}

function renderInspector(){
const a=state.year;const qi=CycleModel.yearInfo(a);const dyn=DATA.dynasties.filter(d=>astro(d.start)<=a&&astro(d.end)>=a).map(d=>d.name);
$('yearInfo').innerHTML=`<div class="year-title">${yearLabel(a)} · ${ganzi(a)}</div><div class="year-sub">${a<1?'统一规则回算；非当时历法实录':'年度简化干支标签；年界见方法'}</div><p class="micro">${dyn.length?esc(dyn.join(' / ')):a>2026?'未来窗口，不外推政权年表':'本版年表未定位到政权记录'}</p>${a>=1864?`<span class="pill purple-pill">${yuan(a)} · ${yun(a)}运（规则）</span>`:''}`;
$('yearInfo').innerHTML+='<div class="year-five">'+[['纳音',qi.nayin.element,qi.nayin.name],['年中运',qi.yunElement,qi.yunElement+'运'+qi.strength],['司天',qi.sitian.element,qi.sitian.name],['在泉',qi.zaiquan.element,qi.zaiquan.name]].map(([label,el,value])=>`<span class="element-badge" style="--element:${CycleModel.ELEMENTS[el].color};--element-light:${CycleModel.ELEMENTS[el].light}"><small>${label}</small>${value}</span>`).join('')+'</div>';
let out='';for(const s of DATA.series.filter(s=>state.visible.has(s.id))){let p=s.points.find(p=>astro(p.year)===a),approx=false;if(!p&&s.id==='paleo'&&a>=1&&a<=1999){p=s.points.find(p=>Math.abs(astro(p.year)-a)<=15);approx=!!p;}out+=`<div class="readout"><label>${esc(s.label)}</label><strong>${p?format(p.value)+(s.unit==='%'?'%':''):'—'}</strong><small>${p?(approx?'邻近30年样本 · 中点'+p.year+'年':historicalLabel(p.year))+' · '+esc(s.unit):'该年无本版数值'}<br>${esc(s.region)}${p?.date_note?'<br>日期冲突：1120 / 1150；不参加窗口均值':''}${Number.isFinite(p?.error)?'<br>Error原值 '+p.error+'；非置信区间':''}${p?.lo!==undefined?'<br>95%区间 '+format(p.lo)+' 至 '+format(p.hi):''}</small>${sourceButton(s.source)}</div>`;}
$('yearReadout').innerHTML=out||'<p class="micro">打开数值图层后可查看该年记录。</p>';
}
function mean(p){return p.length?p.reduce((a,b)=>a+b.value,0)/p.length:null;}
function renderWindow(){const y=state.year,w=state.window;const boundA=Math.max(MIN,y-w),boundB=Math.min(MAX,y+w);$('windowTitle').textContent=`${yearLabel(y)}前后 ${w} 年 · ${yearLabel(boundA)}—${yearLabel(boundB)}`;let out='';for(const s of DATA.series.filter(s=>state.visible.has(s.id))){const a=s.points.filter(p=>!p.exclude_window&&astro(p.year)>=boundA&&astro(p.year)<y),b=s.points.filter(p=>!p.exclude_window&&astro(p.year)>y&&astro(p.year)<=boundB),av=mean(a),bv=mean(b);out+=`<tr><td>${esc(s.label)}</td><td>${av===null?'无样本':format(av)+' · n='+a.length}</td><td>${bv===null?'无样本':format(bv)+' · n='+b.length}</td><td>${av===null||bv===null?'不可计算':format(bv-av)+' '+esc(s.unit==='%'?'百分点':s.unit)}</td><td><small>${s.id==='paleo'?'按区间中点归组；相邻区间可能跨边界':s.kind==='估算'?'采样点均值；日期冲突点排除':'已有年度样本均值'}</small></td></tr>`;}$('windowTable').innerHTML=out||'<tr><td colspan="5">请选择数值图层。</td></tr>';
const ev=DATA.events.map((e,i)=>({...e,i})).filter(e=>astro(e.end)>=boundA&&astro(e.start)<=boundB);$('nearEvents').innerHTML=ev.length?ev.map(e=>`<button class="event-chip" data-event="${e.i}">${esc(e.name)}<small>${historicalLabel(e.start)}—${historicalLabel(e.end)} · ${esc(e.category)}</small></button>`).join(''):'<p class="micro">本版事件选集中没有与窗口重叠的条目；不代表该时期没有事件。</p>';$('nearEvents').querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>recordDetail('event',+b.dataset.event));
}
function renderAtlas(){$('tooltip').style.display='none';renderChart();renderInspector();renderWindow();}
function renderKnowledge(){const q=$('knowledgeSearch').value.trim().toLowerCase();const cards=DATA.knowledge.filter(k=>JSON.stringify(k).toLowerCase().includes(q));$('knowledgeGrid').innerHTML=cards.map(k=>`<article class="card knowledge-card"><span class="pill ${k.tag==='传统'?'purple-pill':k.tag==='自然'?'teal-pill':'gold-pill'}">${esc(k.tag)} · ${esc(k.status)}</span><h3>${esc(k.title)}</h3><div class="period">${esc(k.period)}</div><p>${esc(k.body)}</p><div class="refs">${k.sources.map((id,i)=>sourceButton(id,`资料 ${i+1} ↗`)).join('')}${!k.sources.length?'<span class="micro">仅列研究目录，尚无本版已核验来源</span>':''}</div></article>`).join('')||'<p class="empty">没有匹配条目。</p>';}
$('knowledgeSearch').oninput=renderKnowledge;
function renderSources(){const q=$('sourceSearch').value.trim().toLowerCase();const list=DATA.sources.filter(s=>JSON.stringify(s).toLowerCase().includes(q));$('sourceCount').textContent=`${list.length} / ${DATA.sources.length}`;$('sourceList').innerHTML=list.map(s=>`<article class="card source-item"><div class="source-number">${String(DATA.sources.indexOf(s)+1).padStart(2,'0')}</div><div><h4>${esc(s.title)}</h4><span class="pill">${esc(s.kind)}</span><p>${esc(s.note)}</p><p><b>核验：</b>${esc(s.access)} · ${s.accessed}</p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.url)} ↗</a></div></article>`).join('')||'<p class="empty">没有匹配来源。</p>';}
$('sourceSearch').oninput=renderSources;
$('coverageSummary').textContent=`已接入 ${DATA.series.length} 条数值系列、${DATA.dynasties.length} 条历史分期/政权记录、${DATA.events.length} 项精选事件、${DATA.knowledge.length} 张知识卡及 ${DATA.sources.length} 个来源入口。`;
$('coverageTable').innerHTML=DATA.series.map(s=>`<tr><td>${esc(s.label)}<br>${sourceButton(s.source)}</td><td>${historicalLabel(s.points[0].year)}—${historicalLabel(s.points.at(-1).year)}</td><td>${s.points.length}</td><td>${esc(s.region)}<br><small>${esc(s.resolution)}</small></td><td>${esc(s.kind)}</td></tr>`).join('');

const labSeries=DATA.series.filter(s=>['temperature','sunspots','gdp','population','cpi'].includes(s.id));
for(const id of ['labX','labY'])$(id).innerHTML=labSeries.map(s=>`<option value="${s.id}">${esc(s.label)}</option>`).join('');$('labX').value='temperature';$('labY').value='gdp';
function pearson(pairs){const n=pairs.length;if(n<3)return null;const ax=pairs.reduce((s,p)=>s+p.x,0)/n,ay=pairs.reduce((s,p)=>s+p.y,0)/n;let xx=0,yy=0,xy=0;for(const p of pairs){xx+=(p.x-ax)**2;yy+=(p.y-ay)**2;xy+=(p.x-ax)*(p.y-ay);}return xx&&yy?xy/Math.sqrt(xx*yy):null;}
function labPairs(xs,ys,a,b,lag,diff){const xm=new Map(xs.points.map(p=>[p.year,p.value])),ym=new Map(ys.points.map(p=>[p.year,p.value]));let out=[];for(let t=a;t<=b;t++){const u=t+lag;if(u<a||u>b||!xm.has(t)||!ym.has(u))continue;if(diff&&(!xm.has(t-1)||!ym.has(u-1)||t-1<a||u-1<a))continue;out.push({t,u,x:xm.get(t)-(diff?xm.get(t-1):0),y:ym.get(u)-(diff?ym.get(u-1):0)});}return out;}
function renderLab(){const xs=series($('labX').value),ys=series($('labY').value),a=+$('labStart').value,b=+$('labEnd').value,lag=+$('labLag').value,diff=$('labTransform').value==='diff';let error='';if(xs.id===ys.id)error='请选择两个不同变量，避免同一序列的自相关被误读为跨变量关联。';if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||b>2025||a>=b||!Number.isInteger(lag)||Math.abs(lag)>30)error='请输入有效区间（公元1–2025年，起年小于止年）及−30至30的整数滞后。';if(error){$('labResult').innerHTML=`<div class="notice">${esc(error)}</div>`;return;}
const pairs=labPairs(xs,ys,a,b,lag,diff),r=pearson(pairs);if(pairs.length<10||r===null){$('labResult').innerHTML=`<div class="notice">可配对样本只有 ${pairs.length} 个，或序列没有变化；本图不报告相关系数。请扩大共同数据窗口。没有插值补样本。</div>`;return;}
const xunit=diff?(xs.unit==='%'?'百分点':xs.unit==='°C 距平'?'°C':xs.unit):xs.unit,yunit=diff?(ys.unit==='%'?'百分点':ys.unit==='°C 距平'?'°C':ys.unit):ys.unit;
const W=760,H=300,L=70,R=730,T=30,B=250;let xlo=Math.min(...pairs.map(p=>p.x)),xhi=Math.max(...pairs.map(p=>p.x)),ylo=Math.min(...pairs.map(p=>p.y)),yhi=Math.max(...pairs.map(p=>p.y));const xp=(xhi-xlo)*.08||1,yp=(yhi-ylo)*.08||1;xlo-=xp;xhi+=xp;ylo-=yp;yhi+=yp;const x=v=>L+(v-xlo)/(xhi-xlo)*(R-L),y=v=>B-(v-ylo)/(yhi-ylo)*(B-T);
let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="配对样本散点图"><rect width="${W}" height="${H}" fill="#101c32"/><path d="M${L} ${T}V${B}H${R}" fill="none" stroke="#b8c9bd"/>`;
for(let i=0;i<=4;i++){const xv=xlo+(xhi-xlo)*i/4,yv=ylo+(yhi-ylo)*i/4;svg+=`<text x="${x(xv)}" y="270" font-size="11" fill="#a6b7ce" text-anchor="middle">${format(xv,2)}</text><text x="60" y="${y(yv)+4}" font-size="11" fill="#a6b7ce" text-anchor="end">${format(yv,2)}</text><line x1="${L}" y1="${y(yv)}" x2="${R}" y2="${y(yv)}" stroke="#293e56"/>`;}
for(const p of pairs)svg+=`<circle cx="${x(p.x)}" cy="${y(p.y)}" r="3.7" fill="#6cddd7" opacity=".65"><title>X ${p.t}年=${p.x}；Y ${p.u}年=${p.y}</title></circle>`;
svg+=`<text x="${(L+R)/2}" y="294" font-size="11" text-anchor="middle" fill="#a6b7ce">${esc(xs.label)}${diff?' · 年变化':''} (${esc(xunit)})</text><text x="70" y="17" font-size="11" fill="#a6b7ce">Y：${esc(ys.label)}${diff?' · 年变化':''} (${esc(yunit)})</text></svg>`;
$('labResult').innerHTML=`<div class="lab-output"><div class="card lab-metric"><span class="eyebrow">PEARSON r / ${diff?'一阶差分':'原始值'}</span><strong>${r.toFixed(3)}</strong><p>n = ${pairs.length} 个配对样本<br>X：${pairs[0].t}—${pairs.at(-1).t}<br>Y：${pairs[0].u}—${pairs.at(-1).u}<br>滞后：${lag} 年</p><p>这是线性共变，不是因果效应；相关系数的正负也不是“好／坏”的评分。</p>${sourceButton(xs.source,'X来源 ↗')} &nbsp; ${sourceButton(ys.source,'Y来源 ↗')}</div><div class="card scatter-card">${svg}</div></div><details class="card" style="margin-top:16px;padding:15px"><summary>复核配对值（全部 ${pairs.length} 行）</summary><div class="table-scroll"><table><thead><tr><th>X年份</th><th>Y年份</th><th>X ${diff?'年变化':'原值'}</th><th>Y ${diff?'年变化':'原值'}</th></tr></thead><tbody>${pairs.map(p=>`<tr><td>${p.t}</td><td>${p.u}</td><td>${format(p.x,6)}</td><td>${format(p.y,6)}</td></tr>`).join('')}</tbody></table></div></details>`;
}
$('runLab').onclick=renderLab;
function renderScenario(){const g=+$('scenarioGrowth').value,y=+$('scenarioYear').value,v=100*(1+g/100)**(y-2025);$('scenarioGrowthLabel').textContent=g+'%';$('scenarioResult').innerHTML=`<div class="scenario-value">${format(v,1)}</div><span class="muted">${y}年假设规模指数 · 2025=100 · 非预测</span>`;}
$('scenarioGrowth').oninput=renderScenario;$('scenarioYear').onchange=renderScenario;
$('futureNodes').innerHTML=[2027,2030,2035,2043,2044,2050].map(y=>`<div class="future-node"><strong>${y} · ${ganzi(y)}</strong><span>${yuan(y)}${yun(y)}运${y===2044?' · 新一周':''}</span></div>`).join('');
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if($('tab-atlas').classList.contains('active'))renderChart();},100);});
$('atlasElementMode').onchange=renderChart;
buildLayers();renderAtlas();renderKnowledge();renderSources();renderLab();renderScenario();
window.CycleAtlas={state,DATA,astro,historical,ganzi,yun,yuan,pearson,labPairs,setYear,setRange};

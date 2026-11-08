import {parseRoute,searchMansions} from './model.mjs';
import {createSky,detailStarMap,mansionThumbnail,GROUP_COLORS} from './sky.mjs';
import {createEffects} from './motion.mjs';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ELEMENTS={木:'#348b50',火:'#d7443e',土:'#e88328',金:'#c9a32c',水:'#307dc0',日:'#e4d3ac',月:'#c5d3dc'};
let data,skyData,sky,group='dragon',atlasGroup='dragon',libraryGroup='all',view='home',chapter=0,currentMansion=null,returnHash='#library',lastFocus=null,lastFocusMansion=null;
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage=$('#sky-stage'),dialog=$('#detail');
const effects=createEffects();let routeVersion=0,detailGhost=null;
function getGroup(id){return data.groups.find(g=>g.id===id)}
function refLinks(ids){return ids.map(id=>{const s=data.sources.find(s=>s.id===id);return s?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`:''}).join('')}
function mansionButtons(list){return list.map(m=>`<button data-mansion="${m.id}" aria-label="${m.name}宿，${m.fullName}">${m.name}</button>`).join('')}
function groupTabs(all=false){return (all?'<button data-group="all">全部</button>':'')+data.groups.map(g=>`<button data-group="${g.id}" style="--group:${g.color}">${g.short}</button>`).join('')}
function setGroup(id,options={}){group=id;document.documentElement.style.setProperty('--accent',GROUP_COLORS[id]);sky.setView({group:id,...options});$('#sky-label').textContent=getGroup(id).name+' · 七宿';renderAtlas();}
function renderAtlas(){
 const g=getGroup(group);$('#atlas-en').textContent=g.en;$('#atlas-name').textContent=g.name;$('#atlas-intro').textContent=g.intro;$('#atlas-mansions').innerHTML=mansionButtons(data.mansions.filter(m=>m.group===group));
 $('#atlas-groups').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.group===group);b.setAttribute('aria-pressed',String(b.dataset.group===group))});
}
function renderLibrary(){
 const list=searchMansions(data.mansions,$('#search').value,libraryGroup);$('#result-count').textContent=`找到 ${list.length} 宿 / 共 28 宿`;
 $('#library-groups').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.group===libraryGroup);b.setAttribute('aria-pressed',String(b.dataset.group===libraryGroup))});
 $('#empty-search').hidden=list.length>0;$('#library-results').hidden=!list.length;
 $('#library-results').innerHTML=list.map(m=>`<button class="mansion-card" data-mansion="${m.id}" style="--group:${GROUP_COLORS[m.group]}" aria-label="${m.name}宿，${m.fullName}"><div class="card-header"><span>${String(m.number).padStart(2,'0')} / ${getGroup(m.group).name}</span><span style="--element:${ELEMENTS[m.luminary]}">${m.fullName}</span></div>${mansionThumbnail(m,skyData)}<div class="card-name">${m.name}<span>宿</span></div><span class="card-reading">${m.reading.toUpperCase()} XIÙ</span><span class="card-arrow">↗</span><p>${m.summary}</p></button>`).join('');
}
function renderGuide(){
 const c=data.chapters[chapter];$('#guide-kicker').textContent=c.kicker;$('#guide-title').textContent=c.title;$('#guide-lead').textContent=c.lead;$('#guide-body').textContent=c.body;$('#guide-fact').textContent=c.fact;$('#guide-refs').innerHTML=refLinks(c.sources);
 $('#guide-action').textContent=c.action+' →';$('#guide-action').href=['atlas','sources'].includes(c.target)?'#'+c.target:'#mansion/'+c.target;
 $('#chapter-dots').innerHTML=data.chapters.map((c,i)=>`<button data-chapter="${i}" class="${i===chapter?'active':''}" aria-label="第${i+1}章：${esc(c.title)}" aria-current="${i===chapter?'step':'false'}">${String(i+1).padStart(2,'0')}</button>`).join('');
 $('#chapter-number').textContent=`${String(chapter+1).padStart(2,'0')} / 06`;
 $('#prev-chapter').disabled=chapter===0;$('#next-chapter').disabled=chapter===5;
 const groups=['dragon','dragon','tiger','tortoise','tiger','bird'];setGroup(groups[chapter],{chapter,anchor:chapter===4?data.mansions.find(m=>m.id==='shen').anchor:undefined});
}
function showView(next){
 const previous=view,oldBox=!stage.hidden?stage.getBoundingClientRect():null;
 if(previous!==next)effects.cancel(stage);
 view=next;document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==`view-${next}`);
 const mount=['home','atlas','guide'].includes(next)?$(`#${next}-sky-mount`):null;
 stage.hidden=!mount;if(mount){if(stage.parentElement!==mount)mount.append(stage);sky.setActive(true)}else{effects.cancel(stage);sky.setActive(false)}
 document.querySelectorAll('header nav a').forEach(a=>{const key=a.hash.split('/')[0].slice(1);if(key===next)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(next==='atlas'||next==='home')setGroup(atlasGroup);if(next==='library')renderLibrary();if(next==='guide')renderGuide();
 if(previous!==next){
  effects.reveal($(`#view-${next}`).querySelectorAll('.hero-copy,.section-intro,.strip-heading,.symbol-card,.library-controls,.library-grid,.source-note,.source-list,.tradition-preface,.tradition-grid'),{distance:26});
  if(mount){
   const box=stage.getBoundingClientRect();
   if(oldBox?.width&&box.width)effects.animate(stage,[{transform:`translate(${oldBox.x-box.x}px,${oldBox.y-box.y}px) scale(${oldBox.width/box.width},${oldBox.height/box.height})`,opacity:.7},{transform:'translate(0,0) scale(1)',opacity:1}],{duration:900});
   else effects.animate(stage,[{opacity:0,transform:'scale(.94) rotate(-3deg)'},{opacity:1,transform:'scale(1) rotate(0deg)'}],{duration:950});
  }
 }
 if(next==='atlas')effects.reveal([$('#atlas-en'),$('#atlas-name'),$('#atlas-intro'),$('#atlas-mansions')],{distance:18});
 if(next==='guide')effects.reveal($('.guide-copy').children,{distance:24});
 document.title=(next==='home'?'二十八宿':{atlas:'四象星图',library:'星宿百科',guide:'入门导览',traditions:'文化脉络',sources:'文献索引'}[next])+' · 中国星空漫游';
}
function showMansion(m){
 const opening=!dialog.open,oldMap=!opening?$('#detail-map svg')?.cloneNode(true):null;
 effects.cancel(dialog);if(detailGhost){effects.cancel(detailGhost);detailGhost.remove();detailGhost=null}
 if(opening){lastFocus=document.activeElement;lastFocusMansion=lastFocus?.dataset?.mansion}
 currentMansion=m;setGroup(m.group,{anchor:m.anchor});const g=getGroup(m.group);
 $('#detail-breadcrumb').textContent=`${g.name} / 第 ${String(m.number).padStart(2,'0')} 宿`;$('#detail-reading').textContent=`${m.reading.toUpperCase()} XIÙ / ${m.fullName}`;$('#detail-title').textContent=m.name+'宿';
 $('#detail-tags').innerHTML=`<span>${g.direction}方 · ${g.short}</span><span class="luminary" style="--element:${ELEMENTS[m.luminary]}">七曜配属 · ${m.luminary}</span><span>${esc(m.region)}</span>`;
 $('#detail-summary').textContent=m.summary;$('#detail-astronomy').textContent=m.astronomy;$('#detail-culture').textContent=m.culture;$('#detail-map').innerHTML=detailStarMap(m,skyData);$('#star-info').textContent='点击星点，查看名称与恒星编号。';
 $('#detail-quote').hidden=!m.culturalQuote;
 if(m.culturalQuote){$('#detail-quote').innerHTML=`<blockquote>「${esc(m.culturalQuote)}」</blockquote><p>${esc(m.quoteNote)}</p><div class="inline-refs">${refLinks([m.quoteSource])}</div>`}
 $('#detail-sources').innerHTML=m.sourceIds.map(id=>{const s=data.sources.find(s=>s.id===id);return s?`<a class="detail-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗<small>${esc(s.note)}</small></a>`:''}).join('');
 const i=m.number-1;$('#prev-mansion').textContent='← '+data.mansions[(i+27)%28].name+'宿';$('#next-mansion').textContent=data.mansions[(i+1)%28].name+'宿 →';$('#share-mansion').href='#mansion/'+m.id;
 if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden';$('#close-detail').focus()}dialog.scrollTop=0;
 if(opening)effects.animate(dialog,[{opacity:0,transform:'perspective(1200px) translateX(56px) rotateY(-5deg)'},{opacity:1,transform:'perspective(1200px) translateX(0) rotateY(0deg)'}],{duration:700});
 effects.reveal([$('#detail-reading'),$('#detail-title'),$('#detail-tags'),$('#detail-summary')],{distance:16,duration:700});
 const newMap=$('#detail-map svg');
 effects.animate(newMap,[{opacity:.15,transform:'scale(.9) rotate(-4deg)'},{opacity:1,transform:'scale(1) rotate(0deg)'}],{duration:950});
 newMap.querySelectorAll('polyline').forEach((line,i)=>effects.animate(line,[{strokeDashoffset:1,opacity:.1},{strokeDashoffset:0,opacity:1}],{duration:950,delay:Math.min(i*70,180),fill:'backwards'}));
 newMap.querySelectorAll('[data-star]').forEach((point,i)=>effects.animate(point,[{opacity:.1},{opacity:1}],{duration:600,delay:Math.min(i*30,200),fill:'backwards'}));
 if(oldMap&&!effects.reduced){
  oldMap.querySelectorAll('*').forEach(el=>{el.removeAttribute('id');el.removeAttribute('data-star');el.removeAttribute('tabindex');el.removeAttribute('role')});
  oldMap.classList.add('outgoing-star-map');oldMap.setAttribute('aria-hidden','true');oldMap.inert=true;$('#detail-map').append(oldMap);detailGhost=oldMap;
  const fade=effects.animate(oldMap,[{opacity:.5,transform:'scale(1)'},{opacity:0,transform:'scale(1.08) rotate(3deg)'}],{duration:350});
  fade?.finished.then(()=>{oldMap.remove();if(detailGhost===oldMap)detailGhost=null},()=>oldMap.remove());
 }
 document.title=m.name+'宿 · 二十八宿';
}
function closeDetail(){location.hash=returnHash}
async function applyRoute(){
 const version=++routeVersion,route=parseRoute(location.hash);
 if(route.view==='mansion'){
  const m=data.mansions.find(m=>m.id===route.id);
  if(!m){history.replaceState(null,'','#library');effects.cancel(dialog);if(dialog.open)dialog.close();document.body.style.overflow='';showView('library');return}
  if(!$('#app').dataset.routeInitialized)showView('library');
  showMansion(m);
 }else{
  returnHash=location.hash||'#home';chapter=route.chapter??0;if(route.view==='atlas'&&route.group)atlasGroup=route.group;
  const restore=dialog.open;
  if(restore){
   const exit=effects.animate(dialog,[{opacity:getComputedStyle(dialog).opacity,transform:getComputedStyle(dialog).transform},{opacity:0,transform:'translateX(36px) scale(.985)'}],{duration:230});
   if(exit)await exit.finished.catch(()=>{});
   if(version!==routeVersion)return;
   dialog.close();document.body.style.overflow='';
  }
  if(view!==route.view)window.scrollTo({top:0,behavior:'instant'});
  showView(route.view);
  if(restore){const target=lastFocusMansion?$(`.view:not([hidden]) [data-mansion="${lastFocusMansion}"]`):lastFocus; if(target?.isConnected&&target.getClientRects().length)target.focus();else $('#main').focus()}
 }
 $('#app').dataset.routeInitialized='true';
}
function showStar(hip){
 const star=skyData.stars.find(s=>s[0]===Number(hip));if(!star)return;
 const name=skyData.names[hip]||'恒星';const ra=((star[1]+360)%360)/15;
 $('#star-info').textContent=`${name} · HIP ${hip} · 视星等 ${star[3].toFixed(2)} · J2000 赤经 ${ra.toFixed(3)}h / 赤纬 ${star[2].toFixed(2)}°`;
}
function syncMotion(){sky.setPaused(paused);$('#motion-toggle').textContent=paused?'▷ 开始旋转':'Ⅱ 暂停旋转';$('#motion-toggle').setAttribute('aria-pressed',String(paused))}
function bind(){
 $('.skip-link').onclick=e=>{e.preventDefault();$('#main').focus();$('#main').scrollIntoView({behavior:'instant'})};
 document.addEventListener('click',e=>{
  const m=e.target.closest('[data-mansion]');if(m){location.hash='#mansion/'+m.dataset.mansion;return}
  const g=e.target.closest('[data-group]');if(g){if(g.closest('#library-groups')){libraryGroup=g.dataset.group;renderLibrary();effects.reveal($('#library-results').children,{distance:12,duration:650})}else{atlasGroup=g.dataset.group;location.hash='#atlas/'+atlasGroup}return}
  const c=e.target.closest('[data-chapter]');if(c){location.hash='#guide/'+c.dataset.chapter;return}
  const s=e.target.closest('[data-star]');if(s)showStar(s.dataset.star);
 });
 $('#detail-map').addEventListener('keydown',e=>{const star=e.target.closest('[data-star]');if(star&&['Enter',' '].includes(e.key)){e.preventDefault();showStar(star.dataset.star)}});
 $('#search').addEventListener('input',renderLibrary);$('#clear-search').addEventListener('click',()=>{$('#search').value='';libraryGroup='all';renderLibrary();$('#search').focus()});
 $('#prev-chapter').onclick=()=>location.hash='#guide/'+Math.max(0,chapter-1);$('#next-chapter').onclick=()=>location.hash='#guide/'+Math.min(5,chapter+1);
 $('#close-detail').onclick=closeDetail;dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail()});
 dialog.addEventListener('click',e=>{if(e.target===dialog&&e.clientX<dialog.getBoundingClientRect().left)closeDetail()});
 $('#prev-mansion').onclick=()=>location.hash='#mansion/'+data.mansions[(currentMansion.number+26)%28].id;$('#next-mansion').onclick=()=>location.hash='#mansion/'+data.mansions[currentMansion.number%28].id;
 $('#motion-toggle').onclick=()=>{paused=!paused;syncMotion()};
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches){paused=true;syncMotion()}});
 addEventListener('hashchange',applyRoute);
}
function renderStatic(){
 $('#home-groups').innerHTML=data.groups.map(g=>`<button class="symbol-card" data-group="${g.id}" style="--group:${g.color}" aria-label="探索${g.name}"><span class="symbol-char">${{dragon:'龍',tortoise:'武',tiger:'虎',bird:'雀'}[g.id]}</span><span class="symbol-meta">${g.direction} · ${g.season} · ${g.element}</span><b>${g.name}</b><span class="symbol-seq">${data.mansions.filter(m=>m.group===g.id).map(m=>m.name).join(' ')}</span><span class="arrow">↗</span></button>`).join('');
 $('#atlas-groups').innerHTML=groupTabs();$('#library-groups').innerHTML=groupTabs(true);
 $('#mansion-rail').innerHTML=data.mansions.map(m=>`<button data-mansion="${m.id}" style="--group:${GROUP_COLORS[m.group]}" aria-label="${m.name}宿">${m.name}<small>${String(m.number).padStart(2,'0')}</small></button>`).join('');
 $('#tradition-list').innerHTML=data.traditions.map(t=>`<article class="tradition-item"><span class="eyebrow">${t.tag}</span><h2>${t.title}</h2><p>${t.text}</p><details><summary>阅读时需要区分什么</summary><p>${t.note}</p></details><div class="inline-refs">${refLinks(t.sources)}</div></article>`).join('');
 $('#element-colors').innerHTML=Object.entries(ELEMENTS).map(([k,v])=>`<span style="--element:${v}"><i></i>${k}</span>`).join('');
 $('#source-list').innerHTML=data.sources.map((s,i)=>`<article id="source-${s.id}"><span class="source-number">${String(i+1).padStart(2,'0')}</span><div><span class="eyebrow">${s.kind}</span><h2>${esc(s.title)}</h2><p>${esc(s.note)}</p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">阅读原始资料 ↗</a></div></article>`).join('');
}
async function init(){
 try{
  [data,skyData]=await Promise.all(['data/content.json','data/sky.json'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(`Unable to load ${url}`);return r.json()}));
  data.groups.forEach(g=>g.color=GROUP_COLORS[g.id]);
  skyData.mansions=data.mansions;$('#loading').hidden=true;$('#app').hidden=false;
  sky=createSky($('#sky'),skyData,id=>location.hash='#mansion/'+id);renderStatic();bind();syncMotion();applyRoute();effects.reveal(document.querySelectorAll('#view-home:not([hidden]) .hero-copy'),{distance:18,duration:850});$('#app').dataset.ready='true';
 }catch(error){$('#loading').hidden=true;$('#app').hidden=true;$('#load-error').hidden=false;$('#retry').onclick=()=>location.reload();console.error('Site initialization failed:',error.message)}
}
init();

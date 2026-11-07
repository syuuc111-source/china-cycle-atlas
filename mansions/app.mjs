import {parseRoute,searchMansions} from './model.mjs';
import {createSky,detailStarMap,GROUP_COLORS} from './sky.mjs';
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ELEMENTS={木:'#348b50',火:'#d7443e',土:'#e88328',金:'#c9a32c',水:'#307dc0',日:'#e4d3ac',月:'#c5d3dc'};
let data,skyData,sky,group='dragon',atlasGroup='dragon',libraryGroup='all',view='home',chapter=0,currentMansion=null,returnHash='#library',lastFocus=null,lastFocusMansion=null;
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage=$('#sky-stage'),dialog=$('#detail');
function getGroup(id){return data.groups.find(g=>g.id===id)}
function refLinks(ids){return ids.map(id=>{const s=data.sources.find(s=>s.id===id);return s?`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`:''}).join('')}
function mansionButtons(list){return list.map(m=>`<button data-mansion="${m.id}" aria-label="${m.name}宿，${m.fullName}">${m.name}</button>`).join('')}
function groupTabs(all=false){return (all?'<button data-group="all">全部</button>':'')+data.groups.map(g=>`<button data-group="${g.id}" style="--group:${g.color}">${g.short}</button>`).join('')}
function setGroup(id){group=id;document.documentElement.style.setProperty('--accent',GROUP_COLORS[id]);sky.setGroup(id);$('#sky-label').textContent=getGroup(id).name+' · 七宿';renderAtlas();}
function renderAtlas(){
 const g=getGroup(group);$('#atlas-en').textContent=g.en;$('#atlas-name').textContent=g.name;$('#atlas-intro').textContent=g.intro;$('#atlas-mansions').innerHTML=mansionButtons(data.mansions.filter(m=>m.group===group));
 $('#atlas-groups').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.group===group);b.setAttribute('aria-pressed',String(b.dataset.group===group))});
}
function renderLibrary(){
 const list=searchMansions(data.mansions,$('#search').value,libraryGroup);$('#result-count').textContent=`找到 ${list.length} 宿 / 共 28 宿`;
 $('#library-groups').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b.dataset.group===libraryGroup);b.setAttribute('aria-pressed',String(b.dataset.group===libraryGroup))});
 $('#empty-search').hidden=list.length>0;$('#library-results').hidden=!list.length;
 $('#library-results').innerHTML=list.map(m=>`<button class="mansion-card" data-mansion="${m.id}" style="--group:${GROUP_COLORS[m.group]}" aria-label="${m.name}宿，${m.fullName}"><div class="card-header"><span>${String(m.number).padStart(2,'0')} / ${getGroup(m.group).name}</span><span style="--element:${ELEMENTS[m.luminary]}">${m.fullName}</span></div><div class="card-name">${m.name}<span>宿</span></div><span class="card-reading">${m.reading.toUpperCase()} XIÙ</span><span class="card-arrow">↗</span><p>${m.summary}</p></button>`).join('');
}
function renderGuide(){
 const c=data.chapters[chapter];$('#guide-kicker').textContent=c.kicker;$('#guide-title').textContent=c.title;$('#guide-lead').textContent=c.lead;$('#guide-body').textContent=c.body;$('#guide-fact').textContent=c.fact;$('#guide-refs').innerHTML=refLinks(c.sources);
 $('#guide-action').textContent=c.action+' →';$('#guide-action').href=['atlas','sources'].includes(c.target)?'#'+c.target:'#mansion/'+c.target;
 $('#chapter-dots').innerHTML=data.chapters.map((c,i)=>`<button data-chapter="${i}" class="${i===chapter?'active':''}" aria-label="第${i+1}章：${esc(c.title)}" aria-current="${i===chapter?'step':'false'}">${String(i+1).padStart(2,'0')}</button>`).join('');
 $('#chapter-number').textContent=`${String(chapter+1).padStart(2,'0')} / 06`;
 $('#prev-chapter').disabled=chapter===0;$('#next-chapter').disabled=chapter===5;
 const groups=['dragon','dragon','tiger','tortoise','tiger','bird'];setGroup(groups[chapter]);
 if(chapter===4)sky.setAnchor(data.mansions.find(m=>m.id==='shen').anchor);
}
function showView(next){
 view=next;document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==`view-${next}`);
 const mount=['home','atlas','guide'].includes(next)?$(`#${next}-sky-mount`):null;
 stage.hidden=!mount;if(mount){mount.append(stage);sky.setActive(true)}else sky.setActive(false);
 document.querySelectorAll('header nav a').forEach(a=>{const key=a.hash.split('/')[0].slice(1);if(key===next)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 if(next==='atlas'||next==='home')setGroup(atlasGroup);if(next==='library')renderLibrary();if(next==='guide')renderGuide();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)$(`#view-${next}`).animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});
 document.title=(next==='home'?'二十八宿':{atlas:'四象星图',library:'星宿百科',guide:'入门导览',traditions:'文化脉络',sources:'文献索引'}[next])+' · 中国星空漫游';
}
function showMansion(m){
 if(!dialog.open){lastFocus=document.activeElement;lastFocusMansion=lastFocus?.dataset?.mansion}
 currentMansion=m;setGroup(m.group);sky.setAnchor(m.anchor);const g=getGroup(m.group);
 $('#detail-breadcrumb').textContent=`${g.name} / 第 ${String(m.number).padStart(2,'0')} 宿`;$('#detail-reading').textContent=`${m.reading.toUpperCase()} XIÙ / ${m.fullName}`;$('#detail-title').textContent=m.name+'宿';
 $('#detail-tags').innerHTML=`<span>${g.direction}方 · ${g.short}</span><span class="luminary" style="--element:${ELEMENTS[m.luminary]}">七曜配属 · ${m.luminary}</span><span>${esc(m.region)}</span>`;
 $('#detail-summary').textContent=m.summary;$('#detail-astronomy').textContent=m.astronomy;$('#detail-culture').textContent=m.culture;$('#detail-map').innerHTML=detailStarMap(m,skyData);$('#star-info').textContent='点击星点，查看名称与恒星编号。';
 $('#detail-quote').hidden=!m.culturalQuote;
 if(m.culturalQuote){$('#detail-quote').innerHTML=`<blockquote>「${esc(m.culturalQuote)}」</blockquote><p>${esc(m.quoteNote)}</p><div class="inline-refs">${refLinks([m.quoteSource])}</div>`}
 $('#detail-sources').innerHTML=m.sourceIds.map(id=>{const s=data.sources.find(s=>s.id===id);return s?`<a class="detail-source" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗<small>${esc(s.note)}</small></a>`:''}).join('');
 const i=m.number-1;$('#prev-mansion').textContent='← '+data.mansions[(i+27)%28].name+'宿';$('#next-mansion').textContent=data.mansions[(i+1)%28].name+'宿 →';$('#share-mansion').href='#mansion/'+m.id;
 if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden';$('#close-detail').focus()}dialog.scrollTop=0;
 document.title=m.name+'宿 · 二十八宿';
}
function closeDetail(){location.hash=returnHash}
function applyRoute(){
 const route=parseRoute(location.hash);
 if(route.view==='mansion'){
  const m=data.mansions.find(m=>m.id===route.id);
  if(!m){history.replaceState(null,'','#library');if(dialog.open)dialog.close();document.body.style.overflow='';showView('library');return}
  if(!$('#app').dataset.routeInitialized)showView('library');
  showMansion(m);
 }else{
  returnHash=location.hash||'#home';chapter=route.chapter??0;if(route.view==='atlas'&&route.group)atlasGroup=route.group;
  const restore=dialog.open;
  if(restore){dialog.close();document.body.style.overflow=''}
  showView(route.view);window.scrollTo({top:0,behavior:'instant'});
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
  const g=e.target.closest('[data-group]');if(g){if(g.closest('#library-groups')){libraryGroup=g.dataset.group;renderLibrary()}else{atlasGroup=g.dataset.group;setGroup(atlasGroup);location.hash='#atlas/'+atlasGroup}return}
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
  skyData.mansions=data.mansions;$('#loading').hidden=true;$('#app').hidden=false;
  sky=createSky($('#sky'),skyData,id=>location.hash='#mansion/'+id);renderStatic();bind();syncMotion();applyRoute();$('#app').dataset.ready='true';
 }catch(error){$('#loading').hidden=true;$('#app').hidden=true;$('#load-error').hidden=false;$('#retry').onclick=()=>location.reload();console.error('Site initialization failed:',error.message)}
}
init();

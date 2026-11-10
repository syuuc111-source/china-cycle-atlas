const {chromium}=require('C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const {fengshuiTopics:t}=require('../ganzhi/data/content.json');
const base=process.env.GANZHI_URL||'http://127.0.0.1:8768/ganzhi/';
(async()=>{
 const {directionAt}=await import('../ganzhi/fengshui.mjs');
 assert.deepEqual(directionAt(0),{name:'子',opposite:'午',degrees:0,direction:'北 · 坎'});
 assert.equal(directionAt(23).opposite,'丙');assert.equal(directionAt(6).direction,'东 · 震');
 assert.deepEqual([t.fengshui.entries.length,t.fengshui.collections.length,t.yinfengshui.entries.length,t.yinfengshui.collections.length,t.yinfengshui.dragons.length],[18,23,20,8,72]);
 for(const d of [t.fengshui,t.yinfengshui]){const rows=[...d.entries,...d.collections,...(d.dragons||[])];assert.equal(new Set(rows.map(e=>e.id)).size,rows.length);for(const e of rows)for(const c of e.citations||[]){const book=d.books.find(b=>b.id===c.book);assert.ok(book);assert.ok(c.start>=1&&c.end>=c.start&&c.end<=book.pages);}}
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];p.setDefaultTimeout(120000);p.on('pageerror',e=>errors.push(e.message));
 const ready=()=>p.waitForFunction(()=>document.querySelector('main').dataset.route===location.hash.slice(1));
 const go=async hash=>{await p.goto(base+'#'+hash,{waitUntil:'domcontentloaded',timeout:120000});await ready()};
 await go('fengshui');assert.equal(await p.locator('#feng-results>a').count(),41);
 await p.locator('[data-mountain="6"]').focus();await p.keyboard.press('Enter');assert.match(await p.locator('#feng-axis-name').textContent(),/坐卯 · 向酉/);
 await p.locator('#feng-search').fill('卧室');await p.locator('#feng-results>a').first().click();await ready();await p.locator('a[href="#fengshui"]').first().click();await ready();assert.equal(await p.locator('#feng-search').inputValue(),'卧室');
 await p.locator('.topic-switcher [data-topic=yinfengshui]').click();await ready();assert.equal(await p.locator('#feng-search').inputValue(),'');assert.equal(await p.locator('#feng-results>a').count(),100);await p.locator('#feng-search').fill('壬山');assert.ok(await p.locator('#feng-results>a').count()>0);
 await p.locator('.topic-switcher [data-topic=fengshui]').click();await ready();assert.equal(await p.locator('#feng-search').inputValue(),'卧室');await p.locator('#feng-clear').click();assert.equal(await p.evaluate(()=>document.activeElement.id),'feng-search');
 for(const d of [t.fengshui,t.yinfengshui]){
  for(const [kind,items] of [['entry',[...d.entries,...d.collections,...(d.dragons||[])]],['book',d.books]])for(const e of items){await go(d.id+'-'+kind+'/'+e.id);assert.equal(await p.locator('h1').innerText(),e.name||e.title);assert.equal(await p.locator('.topic-switcher [aria-current=page]').getAttribute('data-topic'),d.id);}
  await go(d.id+'-entry/missing');assert.ok(await p.getByRole('heading',{name:'这个条目不存在'}).isVisible());
 }
 fs.mkdirSync('verification',{recursive:true});
 for(const width of [320,390,768,1440]){await p.setViewportSize({width,height:1000});for(const route of ['fengshui','yinfengshui','fengshui-entry/mountains','yinfengshui-entry/dragon-23','yinfengshui-book/yall']){await go(route);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+route);assert.equal(await p.locator('.topic-switcher a').count(),10);if(route==='fengshui'){const box=await p.locator('[data-mountain="0"]').boundingBox();assert.ok(box.width>=44&&box.height>=44);}if(['fengshui','yinfengshui'].includes(route)&&[390,1440].includes(width)){await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`verification/${route}-${width}.png`,fullPage:true});}}}
 assert.deepEqual(errors,[]);console.log('PASS: 141 entries,14 books,citation ranges,separate search state,compass keyboard,20 responsive views,10 topics,no JS errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

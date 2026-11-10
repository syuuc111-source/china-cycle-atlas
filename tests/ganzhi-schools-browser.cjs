const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const content=require('../ganzhi/data/content.json');
const base=process.env.GANZHI_URL||'http://127.0.0.1:8768/ganzhi/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#entry/jia');await page.waitForSelector('#school-reader');
 for(const entry of content.entries){
  await page.goto(base+'#entry/'+entry.id);
  for(const school of ['bazi','ziwei','qimen','liuren','taiyi','najia','selection','fengshui','yunqi']){
   await page.locator('#school-reader').selectOption(school);
   const visible=page.locator('[data-school-section]:visible');assert.ok(await visible.count()>0);
   for(const key of await visible.evaluateAll(nodes=>nodes.map(x=>x.dataset.schoolSection)))assert.equal(key,school);
   assert.ok(await page.locator('.toc [data-school-link]:visible').count()>0);
  }
  await page.locator('#school-reader').selectOption('all');assert.equal(await page.locator('[data-school-section]:visible').count(),entry.sections.length);
 }
 await page.goto(base+'#entry/jia');await page.locator('#school-reader').selectOption('bazi');
 assert.ok((await page.locator('.reference-table:visible').innerText()).includes('正印'));
 await page.goto(base+'#entry/ren');await page.locator('#school-reader').selectOption('ziwei');
 assert.ok((await page.locator('.article').innerText()).includes('天府化科'));assert.ok((await page.locator('.reference-table:visible').innerText()).includes('左辅'));
 fs.mkdirSync('verification',{recursive:true});await page.screenshot({path:'verification/ganzhi-schools-desktop.png',fullPage:true});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const id of ['jia','zi','wu-stem','ren']){
   await page.goto(base+'#entry/'+id);
   for(const mode of ['all','bazi','ziwei']){
    await page.locator('#school-reader').selectOption(mode);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),width+' '+id+' '+mode);
   }
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'#entry/jia');await page.locator('#school-reader').selectOption('ziwei');
 await page.locator('.toc-mobile summary').click();await page.locator('.toc-mobile [data-school-link="ziwei"]').first().click();
 assert.ok((await page.evaluate(()=>document.activeElement.id)).startsWith('part-'));
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'verification/ganzhi-schools-mobile.png',fullPage:true});
 await page.goto(base+'#library');await page.locator('#search').fill('紫薇');assert.ok(await page.locator('#results a[href="#article/ziwei-basics"]').count());
 await page.locator('#search').fill('天府化科');assert.ok(await page.locator('#results a[href="#entry/ren"]').count());
 assert.deepEqual(errors,[]);console.log('PASS: 22×9 school selections, all-mode restoration, tables, variant/alias search, 48 responsive cases, mobile chapter focus');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

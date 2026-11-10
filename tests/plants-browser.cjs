const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const content=require('../ganzhi/data/content.json');
const base=process.env.GANZHI_URL||'http://127.0.0.1:8768/ganzhi/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'#plants');await page.waitForSelector('#plant-count');assert.equal(await page.locator('.plant-row').count(),content.plants.records.length);
 await page.getByRole('link',{name:'查找一种植物',exact:true}).click();assert.equal(await page.evaluate(()=>document.activeElement.id),'plant-index');
 await page.locator('#plant-search').fill('富贵竹');assert.equal(await page.locator('.plant-row').count(),2);
 await page.locator('#plant-results h3 a').filter({hasText:'开运竹'}).click();assert.equal(await page.locator('h1').innerText(),'开运竹');await page.reload();await page.waitForSelector('.plant-detail');
 await page.getByRole('link',{name:'← 返回植物专题',exact:true}).click();assert.equal(await page.locator('#plant-search').inputValue(),'');
 await page.locator('#plant-system').selectOption('bencao');await page.locator('#plant-element').selectOption('木');assert.ok(await page.getByText('当前条件没有匹配记录').isVisible());
 await page.getByRole('button',{name:'清除筛选'}).click();assert.equal(await page.evaluate(()=>document.activeElement.id),'plant-search');assert.equal(await page.locator('.plant-row').count(),63);
 await page.locator('#plant-system').selectOption('fuxing');await page.locator('#plant-element').selectOption('土');assert.equal(await page.locator('.plant-row').count(),5);assert.ok(!(await page.locator('#plant-results').innerText()).includes('姜'));
 await page.locator('.plant-matrix a[href="#plant/fx-0-2"]').click();assert.equal(await page.locator('h1').innerText(),'姜');assert.equal(await page.locator('.article-lead').innerText(),'木中土');
 await page.goBack();await page.waitForSelector('#plant-search');assert.equal(await page.locator('#plant-system').inputValue(),'fuxing');
 await page.getByRole('button',{name:'清除筛选'}).click();fs.mkdirSync('verification',{recursive:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'verification/plants-desktop.png',fullPage:false});
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['plants','plant/fx-0-4','plant/bencao-cinnamon','article/plant-qi','article/plant-file']){await page.goto(base+'#'+route);await page.waitForSelector(route==='plants'?'#plant-count':route.startsWith('plant/')?'.plant-detail':'.article-header');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route} overflow`);}}
 await page.setViewportSize({width:390,height:844});await page.goto(base+'#plants');await page.screenshot({path:'verification/plants-mobile.png',fullPage:false});await page.locator('#plant-system').selectOption('garden');await page.locator('#plant-search').fill('茉莉');await page.locator('#plant-index').scrollIntoViewIfNeeded();await page.screenshot({path:'verification/plants-filter-mobile.png',fullPage:false});
 for(const row of content.plants.records){await page.goto(base+'#plant/'+row.id);assert.equal(await page.locator('h1').innerText(),row.name);assert.ok(await page.locator('.refs a').count()>0);}
 await page.goto(base+'#plant/missing');assert.ok(await page.getByText('这个条目不存在').isVisible());
 await page.goto(base+'#plants');await page.locator('.plant-matrix .refs a').click();assert.ok(page.url().endsWith('#sources/plant-fuxing'));assert.ok(await page.locator('#source-plant-fuxing').isVisible());
 await page.goto(base+'#home');assert.ok(await page.getByRole('link',{name:'植物五行 · 草木之气 →'}).isVisible());
 assert.deepEqual(errors,[]);console.log('PASS: 63 detail routes, filtering semantics, deep links/reload/back/focus, source navigation, 20 responsive views, no JS errors');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

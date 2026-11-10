const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.GANZHI_URL||'http://127.0.0.1:8768/ganzhi/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForSelector('[data-ready="true"]',{timeout:5000});assert.ok(await page.getByRole('heading',{name:'天干地支',exact:true}).isVisible());
 await page.goto(base+'#cycle/0');await page.getByRole('button',{name:'下一步',exact:true}).click();assert.equal(await page.locator('[data-cycle-name]').innerText(),'乙丑');
 for(let i=0;i<59;i++)await page.getByRole('button',{name:'下一步',exact:true}).click();assert.equal(await page.locator('[data-cycle-name]').innerText(),'甲子');
 await page.goto(base+'#library');await page.locator('#search').fill('纳音');assert.ok(await page.locator('#results a').count()>0);await page.locator('#search').fill('xyznoresult');assert.ok(await page.getByText('没有找到相关条目').isVisible());await page.getByRole('button',{name:'清除搜索'}).click();assert.equal(await page.locator('#results a').count(),124);
 await page.goto(base+'#entry/jia');assert.ok(await page.getByRole('heading',{name:'甲',exact:true}).isVisible());await page.reload();assert.ok(await page.getByRole('heading',{name:'甲',exact:true}).isVisible());
 await page.goto(base+'#calendar');await page.locator('#date').fill('2024-02-09');await page.locator('#time').fill('12:00');await page.getByRole('button',{name:'查询干支',exact:true}).click();assert.ok((await page.locator('#calendar-result').innerText()).includes('癸卯'));assert.ok((await page.locator('#calendar-result').innerText()).includes('甲辰'));
 await page.locator('#date').fill('2019-01-27');await page.locator('#time').fill('23:30');await page.getByRole('button',{name:'查询干支',exact:true}).click();assert.equal(await page.locator('[data-pillar="day"]').innerText(),'甲子');await page.locator('#boundary').selectOption('zi');assert.equal(await page.locator('[data-pillar="day"]').innerText(),'乙丑');assert.equal(await page.locator('[data-pillar="hour"]').innerText(),'丙子');
 await page.goto(base+'#article/unknown');assert.ok(await page.getByText('这个条目不存在').isVisible());
 fs.mkdirSync('verification',{recursive:true});await page.goto(base+'#home');await page.screenshot({path:'verification/ganzhi-desktop.png',fullPage:true});
 for(const width of [390,768,1440]){await page.setViewportSize({width,height:900});for(const route of ['home','library','cycle/0','guide/0','entry/wu-stem','article/time-conventions','calendar','sources','relations']){await page.goto(base+'#'+route);await page.waitForTimeout(60);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width} ${route} overflow`);}}
 await page.setViewportSize({width:390,height:844});await page.goto(base+'#home');await page.screenshot({path:'verification/ganzhi-mobile.png',fullPage:true});
 await page.goto(base+'#article/five-elements');await page.screenshot({path:'verification/ganzhi-reading-mobile.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'#cycle/0');assert.equal(await page.locator('[data-action="play"]').getAttribute('aria-pressed'),'false');
 const fail=await browser.newPage();await fail.route('**/data/content.json',r=>r.abort());await fail.goto(base);assert.ok(await fail.getByRole('button',{name:'重新加载'}).isVisible());await fail.unroute('**/data/content.json');await fail.getByRole('button',{name:'重新加载'}).click();await fail.waitForSelector('[data-ready="true"]');await fail.close();
 assert.deepEqual(errors,[]);console.log('PASS: learning, search, 60 steps, calendar boundaries, deep links, 27 responsive routes, reduced motion, load retry; no JS errors');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

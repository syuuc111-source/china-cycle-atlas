const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const base=process.env.ATLAS_URL||'http://127.0.0.1:8768/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.waitForSelector('#chartHost svg');
 const old=cp.execFileSync('git',['show','a674f14:index.html'],{encoding:'utf8',maxBuffer:2e6}).match(/<script id="dataset" type="application\/json">([\s\S]*?)<\/script>/)[1];
 assert.deepEqual(await page.evaluate(()=>CycleAtlas.DATA),JSON.parse(old),'Source dataset unchanged');
 assert.equal(await page.locator('#chartHost svg > rect').first().getAttribute('fill'),'#101c32','SVG has its own dark ground');
 await page.locator('[data-range="2020,2050"]').click();
 const bandContrast=await page.evaluate(()=>{
  const lum=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  return Object.values(CycleModel.ELEMENTS).every(e=>{const rgb=[1,3,5].map((i,j)=>parseInt(e.color.slice(i,i+2),16)*.78+[16,28,50][j]*.22),l=lum(rgb),ink=bandInk(e.color);return (ink==='#000000'?(l+.05)/.05:1.05/(l+.05))>=4.5});
 });assert.ok(bandContrast,'Five-element label contrast is at least 4.5:1');
 await page.emulateMedia({media:'print'});assert.equal(await page.locator('.chart-top h2').evaluate(e=>getComputedStyle(e).color),'rgb(230, 237, 247)','Print foreground remains legible on dark chart');await page.emulateMedia({media:'screen'});
 await page.locator('[data-range="-2070,2050"]').click();
 fs.mkdirSync('verification/atlas-design',{recursive:true});
 const tabs=['atlas','overlay','wuxing','astronomy','lab','knowledge','future','sources'];
 for(const width of [1440,1024,768,390,320]){
  await page.setViewportSize({width,height:width>600?1000:844});
  for(const tab of tabs){
   await page.locator(`[data-tab="${tab}"]`).click();await page.waitForTimeout(60);
   assert.equal(await page.locator(`[data-tab="${tab}"]`).getAttribute('aria-pressed'),'true');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${tab} fits`);
   if([1440,390].includes(width))await page.screenshot({path:`verification/atlas-design/${tab}-${width}.png`,fullPage:true});
  }
 }
 await page.setViewportSize({width:390,height:844});await page.locator('[data-tab="atlas"]').click();
 assert.equal(await page.locator('#layerContents').isVisible(),false);
 await page.locator('#toggleLayerPanel').click();assert.equal(await page.locator('#layerContents').isVisible(),true);
 await page.locator('[data-layer="events"]').uncheck();assert.equal(await page.locator('#chartHost [data-record^="event:"]').count(),0);
 await page.locator('[data-layer="events"]').check();await page.locator('#toggleLayerPanel').click();
 assert.equal(await page.locator('#layerContents').isVisible(),false);
 await page.locator('[data-tab="wuxing"]').click();
 const colors=await page.evaluate(()=>Object.fromEntries(Object.entries(CycleModel.ELEMENTS).map(([k,v])=>[k,v.color])));
 assert.deepEqual(colors,{木:'#348b50',火:'#d7443e',土:'#e88328',金:'#c9a32c',水:'#307dc0'});
 await page.locator('.brand').click();await page.waitForSelector('#tab-atlas.active');
 await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'workspace');
 assert.equal(await page.evaluate(()=>document.getAnimations().length),0,'Reduced motion has no running animation');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: unchanged source data, dark SVG, 40 responsive route checks, mobile filters, semantic colors, focus and reduced motion');
})().catch(e=>{console.error(e);process.exit(1)});

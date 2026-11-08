const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.MANSIONS_URL||'http://127.0.0.1:8768/mansions/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.waitForSelector('[data-ready="true"]');
 await page.evaluate(()=>document.fonts.ready);
 assert.ok(await page.evaluate(()=>document.fonts.check('24px "Sky Serif"','二十八宿')),'Local display font loads');
 fs.mkdirSync('verification/design',{recursive:true});
 await page.screenshot({path:'verification/design/home.png',fullPage:true});
 const colors=[];
 for(const id of ['dragon','tortoise','tiger','bird']){
  await page.goto(base+'#atlas/'+id);await page.waitForFunction(id=>document.querySelector(`#atlas-groups [data-group="${id}"]`)?.getAttribute('aria-pressed')==='true',id);
  colors.push(await page.evaluate(()=>{const c=document.querySelector('#sky'),p=c.getContext('2d').getImageData(Math.floor(c.width*.4),Math.floor(c.height*.35),1,1).data;return [...p].join(',')}));
  await page.screenshot({path:`verification/design/${id}.png`,fullPage:true});
 }
 assert.equal(new Set(colors).size,4,'Four group selections draw different ambient colours');
 await page.goto(base+'#library');await page.waitForSelector('.card-chart');
 assert.equal(await page.locator('.card-chart').count(),28);
 assert.equal(await page.locator('.card-chart [tabindex],.card-chart [role="button"],.card-chart [id]').count(),0,'Thumbnails have no nested interactive controls or duplicate IDs');
 assert.ok(await page.locator('.card-chart circle').count()>28,'Thumbnails include actual stars');
 await page.screenshot({path:'verification/design/library.png',fullPage:true});
 for(const width of [320,390,768,1024]){
  await page.setViewportSize({width,height:width>600?1024:844});
  for(const route of ['home','atlas','library','guide/0','traditions','sources']){
   await page.goto(base+'#'+route);await page.waitForTimeout(60);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}px ${route} fits`);
  }
  await page.goto(base+'#home');await page.waitForSelector('#view-home:not([hidden])');
  if(width===390){const box=await page.locator('#sky').boundingBox();assert.ok(box.y+box.height<844,'Mobile globe visible in the first viewport');}
  await page.screenshot({path:`verification/design/home-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: local font, 4 ambient palettes, 28 real thumbnails, 24 responsive route checks, first-screen mobile globe');
})().catch(e=>{console.error(e);process.exit(1)});

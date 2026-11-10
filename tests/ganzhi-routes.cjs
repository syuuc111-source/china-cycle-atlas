const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');const content=require('../ganzhi/data/content.json');
const base=process.env.GANZHI_URL||'http://127.0.0.1:8768/ganzhi/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.waitForSelector('[data-ready="true"]');
 for(const x of [...content.entries,...content.articles]){
  await page.goto(base+'#'+(x.kind?'entry/':'article/')+x.id);
  assert.equal(await page.locator('.article-header h1').innerText(),x.name||x.title);
  assert.equal(await page.locator('.article section').count(),x.sections.length);
 }
 for(let i=0;i<60;i++){await page.goto(base+'#cycle/'+i);assert.ok((await page.locator('.cycle-order').innerText()).startsWith('第 '+String(i+1).padStart(2,'0')));}
 await page.goto(base+'#cycle/0');await page.evaluate(()=>{for(let i=0;i<20;i++)document.querySelector('[data-action="next"]').click()});
 assert.ok(page.url().endsWith('#cycle/20'));assert.equal(await page.locator('[data-cycle-name]').innerText(),'甲申');
 await page.goto(base+'#library');await page.goBack();assert.equal(await page.locator('[data-cycle-name]').innerText(),'甲申');
 await page.goto(base+'#calendar');await page.waitForLoadState('networkidle');const requests=[];const track=r=>requests.push(r.url());page.on('request',track);
 await page.locator('#date').fill('2024-02-09');await page.getByRole('button',{name:'查询干支',exact:true}).click();await page.waitForTimeout(100);page.off('request',track);assert.deepEqual(requests,[],'date submission makes no network requests');
 for(const route of ['home','library','calendar','article/five-elements']){
  await page.goto(base+'#'+route);await page.addStyleTag({content:'body{zoom:2}'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' 200% zoom overflow');await page.reload();
 }
 for(const [href,needle] of [['../','ganzhi/'],['../mansions/','../ganzhi/']]){
  const response=await page.request.get(new URL(href,base).href);assert.ok(response.ok());assert.ok((await response.text()).includes('href="'+needle+'"'));
 }
 assert.deepEqual(errors,[]);console.log('PASS: 120 detail routes, rapid selection/history, private date query, 200% zoom, three-site links');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

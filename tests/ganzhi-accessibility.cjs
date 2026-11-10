const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const base=process.env.GANZHI_URL||'http://127.0.0.1:8768/ganzhi/';
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(base+'#article/five-elements');await page.waitForSelector('.article-header');
 const summary=page.locator('.toc-mobile summary');
 assert.ok(await summary.isVisible(),'mobile chapter toggle exists');
 await summary.focus();await page.keyboard.press('Enter');
 const chapter=page.locator('.toc-mobile [data-scroll="part-1"]');
 assert.ok(await chapter.isVisible());await chapter.focus();await page.keyboard.press('Enter');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'part-1');
 await page.getByRole('link',{name:'返回干支百科',exact:true}).click();
 await page.locator('#search').fill('甲');const result=page.locator('#results a[href="#entry/jia"]');
 await result.focus();await page.keyboard.press('Enter');await page.waitForSelector('.article-header');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
 for(const route of ['home','library','calendar','article/five-elements']){
  await page.setViewportSize({width:320,height:844});await page.goto(base+'#'+route);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' 320px overflow');
 }
 console.log('PASS: mobile expandable TOC, keyboard chapter and route focus, 320px routes');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});

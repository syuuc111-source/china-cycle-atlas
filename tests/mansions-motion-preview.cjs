const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try{
 const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto((process.env.MANSIONS_URL||'http://127.0.0.1:8768/mansions/')+'#atlas/dragon');await p.waitForSelector('[data-ready=true]');
 await p.locator('#motion-toggle').click();await p.waitForTimeout(1200);fs.mkdirSync('verification/motion',{recursive:true});
 await p.screenshot({path:'verification/motion/atlas-before.png'});
 await p.evaluate(()=>document.querySelector('#atlas-groups [data-group=tiger]').click());
 await p.waitForTimeout(280);await p.screenshot({path:'verification/motion/atlas-during.png'});
 await p.waitForTimeout(950);await p.screenshot({path:'verification/motion/atlas-after.png'});
 await p.locator('#atlas-mansions [data-mansion=shen]').click();await p.waitForTimeout(250);await p.screenshot({path:'verification/motion/detail-during.png'});
 await p.waitForTimeout(900);await p.screenshot({path:'verification/motion/detail-after.png'});
 await p.setViewportSize({width:390,height:844});await p.keyboard.press('Escape');await p.waitForTimeout(350);
 await p.locator('header a[href="#guide/0"]').click();await p.waitForTimeout(1100);await p.locator('#next-chapter').click();await p.waitForTimeout(300);await p.screenshot({path:'verification/motion/mobile-guide.png',fullPage:true});
 console.log('Saved six motion review frames');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});

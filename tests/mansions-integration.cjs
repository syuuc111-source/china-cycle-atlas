const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/苏预超/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const base=process.env.ATLAS_URL||'https://syuuc111-source.github.io/china-cycle-atlas/';
 await p.goto(base);await p.locator('.tabs a[href="mansions/"]').click();await p.waitForSelector('[data-ready="true"]');
 assert.ok(p.url().includes('/mansions/'));await p.locator('.back-atlas').click();await p.waitForSelector('#chartHost svg');
 assert.ok(!p.url().includes('/mansions/'));console.log('PASS: mobile atlas → mansions → atlas');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

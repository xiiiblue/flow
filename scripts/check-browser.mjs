import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.env.FLOW_PREVIEW||'http://127.0.0.1:4330';
const browser=await chromium.launch({headless:true,executablePath:process.env.FLOW_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({locale:'zh-CN',reducedMotion:'reduce',viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],failures=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()])});
await mkdir('.verification',{recursive:true});
const routes=['','read/user-guide/','read/overview/','read/workflow/','read/group-intake/','read/adapters/','read/owner-commands/','read/acceptance/','read/contributing/','read/security/','read/agents/'];
try{
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:width<500?844:1000});for(const route of routes){await page.goto(origin+'/flow/'+route,{waitUntil:'networkidle'});assert.equal(await page.locator('main h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow: '+width+' '+route);if((width===390||width===1440)&&['','read/overview/','read/workflow/','read/user-guide/'].includes(route))await page.screenshot({path:'.verification/'+(route==='read/user-guide/'?'guide':route==='read/overview/'?'overview':route?'reader':'home')+'-'+width+'.png',fullPage:true,animations:'disabled'});}}
 for(const width of [390,1440]){
   await page.setViewportSize({width,height:844});await page.goto(origin+'/flow/');
   assert.equal(await page.locator('.site-counter strong').allTextContents().then(v=>v.join('')), '');
   assert(!await page.locator('#busuanzi_container_site_pv').isVisible());
   await page.locator('footer').screenshot({path:'.verification/footer-'+width+'.png'});
 }
 // Exercise the production hostname locally; never contact the real counter.
 const counterContext=await browser.newContext({viewport:{width:390,height:844}});
 let counterRequests=0;
 await counterContext.route('https://www.bluexiii.com/**',async route=>{
   const u=new URL(route.request().url());const response=await fetch(origin+u.pathname);
   await route.fulfill({status:response.status,headers:{'content-type':response.headers.get('content-type')||'text/html'},body:Buffer.from(await response.arrayBuffer())});
 });
 await counterContext.route('https://busuanzi.ibruce.info/**',async route=>{counterRequests++;await route.abort();});
 const counterPage=await counterContext.newPage();await counterPage.goto('https://www.bluexiii.com/flow/',{waitUntil:'networkidle'});
 assert.equal(counterRequests,1);assert(!await counterPage.locator('#busuanzi_container_site_pv').isVisible());
 assert(await counterPage.getByRole('link',{name:'鲁ICP备18050487号-1'}).isVisible());
 assert(await counterPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await counterPage.locator('footer').screenshot({path:'.verification/footer-counter-unavailable-390.png'});
 // Fixture values only: validate service DOM contract and long-number layout.
 await counterPage.evaluate(()=>{for(const kind of ['uv','pv']){document.getElementById('busuanzi_value_site_'+kind).textContent='123456789012';document.getElementById('busuanzi_container_site_'+kind).style.display='inline';}});
 assert(await counterPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await counterPage.locator('footer').screenshot({path:'.verification/footer-counter-fixture-390.png'});
 await counterPage.setViewportSize({width:1440,height:1000});
 await counterPage.locator('footer').screenshot({path:'.verification/footer-counter-fixture-1440.png'});
 await counterContext.close();
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(origin+'/flow/');await page.getByRole('link',{name:'查看用户指南'}).click();assert(page.url().endsWith('/flow/read/user-guide/'));await page.getByRole('navigation',{name:'规范章节'}).getByRole('link',{name:'核心流程',exact:true}).click();assert(page.url().endsWith('/flow/read/workflow/'));await page.locator('.toc a').first().click();assert(new URL(page.url()).hash);
 await page.getByRole('button',{name:'切换明暗主题'}).click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.screenshot({path:'.verification/reader-dark-1440.png',fullPage:true});
 await page.goto(origin+'/flow/');await page.screenshot({path:'.verification/home-dark-1440.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.goto(origin+'/flow/read/workflow/');await page.getByRole('navigation',{name:'规范章节'}).getByRole('link',{name:'验收清单'}).click();assert(page.url().endsWith('/flow/read/acceptance/'));assert.equal(await page.locator('[aria-current="page"]').textContent(),'验收清单');
 await page.getByRole('navigation',{name:'规范章节'}).getByRole('link',{name:'用户指南',exact:true}).click();assert(page.url().endsWith('/flow/read/user-guide/'));assert((await page.locator('article').textContent()).includes('不需要先判断'));
 await page.emulateMedia({media:'print'});assert(!await page.locator('header').isVisible());assert(await page.locator('article').isVisible());
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 const report={result:'passed',routes:routes.length,widths:[320,390,768,1440],checks:['44 route/viewport combinations: one h1, no horizontal overflow','reading navigation and active chapter','desktop chapter anchor','theme switch and persistence','print reading mode','counter blocked: no fake numbers, ICP stays visible','counter long-number fixture: no mobile overflow','no page errors or failed HTTP responses'],errors,failures};await writeFile('.verification/browser-result.json',JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close()}

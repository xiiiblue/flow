import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const source=JSON.parse(await readFile('src/data/source.json','utf8'));
const origin=process.env.FLOW_PREVIEW||'http://127.0.0.1:4330';
const browser=await chromium.launch({headless:true,executablePath:process.env.FLOW_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({locale:'zh-CN',reducedMotion:'reduce',viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],failures=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()])});
await mkdir('.verification',{recursive:true});
const routes=['',...source.pages.map(p=>'read/'+p.slug+'/')];
const widths=[320,390,768,1440];
const openMenu=async()=>{if(!await page.locator('.chapter-menu').evaluate(el=>el.open))await page.locator('.chapter-menu summary').click();};
try{
  for(const width of widths){
    await page.setViewportSize({width,height:width<500?844:1000});
    for(const route of routes){
      await page.goto(origin+'/flow/'+route,{waitUntil:'networkidle'});
      assert.equal(await page.locator('main h1').count(),1,route);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow: '+width+' '+route);
      if(route){
        assert.equal(await page.locator('[aria-current="page"]').count(),1,route);
        assert((await page.locator('.source-note').innerText()).includes(source.commit.slice(0,8)));
      }
      if((width===390||width===1440)&&['','read/workflow/','read/user-guide/'].includes(route)){
        const name=route==='read/user-guide/'?'guide':route?'reader':'home';
        await page.screenshot({path:'.verification/'+name+'-'+width+'.png',fullPage:true,animations:'disabled'});
        await page.screenshot({path:'.verification/'+name+'-viewport-'+width+'.png',animations:'disabled'});
        if(!route)await page.locator('#delivery').screenshot({path:'.verification/delivery-'+width+'.png',style:'header,.skip{visibility:hidden!important}'});
      }
    }
  }
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
  // Fixture values validate layout only; these are not real visitor counts.
  await counterPage.evaluate(()=>{for(const kind of ['uv','pv']){document.getElementById('busuanzi_value_site_'+kind).textContent='123456789012';document.getElementById('busuanzi_container_site_'+kind).style.display='inline';}});
  assert(await counterPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await counterPage.locator('footer').screenshot({path:'.verification/footer-counter-fixture-390.png'});
  await counterPage.setViewportSize({width:1440,height:1000});
  await counterPage.locator('footer').screenshot({path:'.verification/footer-counter-fixture-1440.png'});
  await counterContext.close();

  await page.setViewportSize({width:1440,height:1000});
  await page.goto(origin+'/flow/');
  await page.getByRole('link',{name:/^阅读介绍手册/}).click();
  assert(page.url().endsWith('/flow/read/overview/'));
  await page.getByRole('navigation',{name:'手册章节'}).getByRole('link',{name:'流程总览',exact:false}).click();
  assert(page.url().endsWith('/flow/read/workflow/'));
  await page.locator('.toc a[href="#9director需要介入几次"]').click();
  assert.equal(decodeURIComponent(new URL(page.url()).hash),'#9director需要介入几次');
  await page.getByRole('button',{name:'切换明暗主题'}).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.screenshot({path:'.verification/reader-dark-1440.png',fullPage:true});
  await page.goto(origin+'/flow/');await page.screenshot({path:'.verification/home-dark-1440.png',fullPage:true});
  await page.locator('#delivery').screenshot({path:'.verification/delivery-dark-1440.png',style:'header,.skip{visibility:hidden!important}'});

  await page.setViewportSize({width:390,height:844});
  await page.goto(origin+'/flow/read/workflow/');
  assert(!await page.locator('.chapter-menu').evaluate(el=>el.open),'Mobile directory starts collapsed');
  await openMenu();
  await page.getByRole('navigation',{name:'手册章节'}).getByRole('link',{name:'两种交付',exact:false}).click();
  assert(page.url().endsWith('/flow/read/delivery/'));
  assert((await page.locator('[aria-current="page"]').textContent()).includes('两种交付'));
  await openMenu();
  await page.getByRole('navigation',{name:'手册章节'}).getByRole('link',{name:'原生自动化',exact:false}).click();
  assert(page.url().endsWith('/flow/read/automation/'));
  await openMenu();
  await page.getByRole('navigation',{name:'手册章节'}).getByRole('link',{name:'群里反馈',exact:false}).click();
  assert(page.url().endsWith('/flow/read/user-guide/'));
  assert((await page.locator('article').textContent()).includes('用户提供已知事实就足够'));
  await page.emulateMedia({media:'print'});
  assert(!await page.locator('header').isVisible());
  assert(await page.locator('article').isVisible());
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  const report={result:'passed',sourceCommit:source.commit,routes:routes.length,widths,combinations:routes.length*widths.length,checks:['one h1 and no horizontal overflow at every route/viewport','handbook navigation and active chapter','mobile directory collapse and expansion','desktop Director involvement anchor','theme switch and persistence','print reading mode','counter blocked and long-number fixture','no page errors or failed HTTP responses'],errors,failures};
  await writeFile('.verification/browser-result.json',JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close()}

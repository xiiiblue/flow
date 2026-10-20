import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,statSync,existsSync} from 'node:fs';
import {resolve,relative} from 'node:path';
const root=resolve('dist');
const source=JSON.parse(readFileSync('src/data/source.json','utf8'));
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=resolve(dir,n);return statSync(p).isDirectory()?walk(p):[p]})}
const pages=walk(root).filter(p=>p.endsWith('.html'));
const attrs=(s,name)=>[...s.matchAll(new RegExp('\\b'+name+'="([^"]*)"','g'))].map(m=>m[1]);
const text=s=>s.replace(/<[^>]+>/g,'');

test('complete handbook and existing public reading addresses are built',()=>{
  assert.equal(source.pages.filter(p=>p.kind==='chapter').length,15);
  assert.equal(source.pages.filter(p=>p.kind==='overview').length,1);
  assert.equal(source.pages.filter(p=>p.kind==='topic').length,3);
  assert.equal(pages.length,source.pages.length+2);
  for(const {slug} of source.pages)assert(existsSync(resolve(root,'read',slug,'index.html')),slug);
  for(const slug of ['overview','user-guide','workflow','group-intake','adapters','owner-commands','acceptance','contributing','security','agents'])assert(source.pages.some(p=>p.slug===slug),slug);
  assert(existsSync(resolve(root,'.nojekyll')));
});

test('source manifest ties every reading page to the same HiveOS handbook and rules',()=>{
  assert.equal(source.repository,'xiiiblue/hive-os');
  assert.deepEqual(source.publicProject,{repository:'xiiiblue/hive-flow',license:'Apache-2.0',licenseUrl:'https://github.com/xiiiblue/hive-flow/blob/main/LICENSE'});
  assert.match(source.commit,/^[0-9a-f]{40}$/);
  assert.deepEqual(source.dependencyOrder,['HiveFlow规范','HiveFlow介绍','HiveFlow网站']);
  assert.equal(new Set(source.pages.map(p=>p.slug)).size,source.pages.length);
  const chapters=source.pages.filter(p=>p.kind==='chapter');
  assert.deepEqual(chapters.map(p=>p.number),Array.from({length:15},(_,i)=>String(i+1).padStart(2,'0')));
  for(const [path,hash] of Object.entries(source.files)){
    assert(path.startsWith(source.handbookRoot+'/'),path);
    assert.match(hash,/^[0-9a-f]{64}$/);
  }
  assert(source.normativeChecks.includes('HFL-003'));
  assert(source.normativeChecks.includes('HFL-016'));
  assert.equal(source.snapshotSource,source.handbookRoot+'/README.md');
  const snapshot=readFileSync(source.snapshot);
  assert.equal(createHash('sha256').update(snapshot).digest('hex'),source.files[source.snapshotSource]);
  for(const page of source.pages){
    for(const path of page.sources||[page.source])assert(source.files[path],path);
    assert(page.source.startsWith(source.handbookRoot+'/'));
    const html=readFileSync(resolve(root,'read',page.slug,'index.html'),'utf8');
    assert(html.includes(source.commit.slice(0,8)));
    assert(html.includes('无需访问私有仓库'));
    assert(html.includes('规范→介绍→网站'));
    assert(html.includes('网站不替代执行规范'));
  }
});

test('all local links, assets and cross-document anchors resolve under /flow/',()=>{
  let checked=0;
  for(const file of pages){
    const html=readFileSync(file,'utf8');
    for(const raw of [...attrs(html,'href'),...attrs(html,'src')]){
      if(/^(https?:|data:|mailto:)/.test(raw))continue;
      const url=new URL(raw,'https://preview.test/flow/'+relative(root,file));
      assert(url.pathname.startsWith('/flow/'),raw);
      let dest=resolve(root,decodeURIComponent(url.pathname.slice(6)));
      if(url.pathname.endsWith('/'))dest=resolve(dest,'index.html');
      assert(existsSync(dest),file+' -> '+raw);
      if(url.hash){
        const ids=attrs(readFileSync(dest,'utf8'),'id');
        assert(ids.includes(decodeURIComponent(url.hash.slice(1))),file+' -> missing '+raw);
      }
      checked++;
    }
  }
  assert(checked>500);
  console.log('Resolved local links/assets/anchors:',checked);
});

test('homepage separates startup choice, delivery endpoint and Director involvement',()=>{
  const html=readFileSync(resolve(root,'index.html'),'utf8');
  const cards=[...html.matchAll(/<article\b[^>]*data-start="([^"]+)"[^>]*data-delivery="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length,4);
  assert.deepEqual(cards.map(m=>m[1]+':'+m[2]).sort(),['manual:full_delivery','manual:pr_review','scheduled:full_delivery','scheduled:pr_review']);
  for(const card of cards.filter(m=>m[2]==='pr_review')){
    const copy=text(card[3]);
    assert.match(copy,/停止|再介入/);
    assert(copy.includes('合并、部署'));
    assert(!copy.includes('无需你再介入'));
  }
  for(const value of ['第二个副产物','Director','MacMini','自动开发未启用','不是已经运行的自动开发服务','源头采纳与定时配置授权另计','规范 → 介绍 → 网站','GitHub Issues','wecom-slack-bridge','管理员接入并授权的工作群','https://www.bluexiii.com/hive/','https://www.bluexiii.com/acdl/'])assert(html.includes(value),value);
  assert(!html.includes('Director 串起每一个阶段'));
  assert(!html.includes('canonical'),'No unverified publication canonical');
});

test('published payload excludes private runtime material and retired authority',()=>{
  for(const file of walk(root)){
    if(!/\.(html|js|css|json)$/.test(file))continue;
    const value=readFileSync(file,'utf8');
    assert(!/(?:xox[baprs]-[A-Za-z0-9-]+|gh[pousr]_[A-Za-z0-9]+|\/Users\/|192\.168\.\d+\.\d+|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY)/.test(value),relative(root,file));
    assert(!/(?:wecom-intake:|source_request_id|chat_id|\.hiveflow\/control\/slot\.json)/.test(value),relative(root,file));
    // 公开项目的准确LICENSE链接是许可说明，其他旧仓库文件入口仍不作为网页执行依据。
    for(const [url] of value.matchAll(/https:\/\/github\.com\/xiiiblue\/hive-flow\/(?:blob|raw|tree)\/[^\s"'<>]+/g))assert.equal(url,source.publicProject.licenseUrl,relative(root,file));
    assert(!/https:\/\/github\.com\/xiiiblue\/hive-os\/(?:blob|issues|pull|actions)/.test(value),relative(root,file));
    assert(!value.includes('负责人评审、授权与私有结果统一在'),relative(root,file));
    assert(!value.includes('language-mermaid'),relative(root,file));
  }
});

test('handbook edition preserves conditional execution, uncertain notifications and synthetic evidence',()=>{
  const workflow=text(readFileSync(resolve(root,'read/workflow/index.html'),'utf8'));
  for(const value of ['手动＋PR待审','手动＋完整交付','定时＋PR待审','定时＋完整交付','源头采纳和定时配置准备另计','不承诺任何情况下固定一次'])assert(workflow.includes(value),value);
  const automation=text(readFileSync(resolve(root,'read/automation/index.html'),'utf8'));
  assert(automation.includes('业务自动开发尚未启用'));
  assert(automation.includes('明确清单不能作为采纳来源读取失败后的自动替代方案'));
  const receipts=text(readFileSync(resolve(root,'read/receipts/index.html'),'utf8'));
  assert(receipts.includes('用户已读'));
  assert(receipts.includes('不能换新标识'));
  const example=text(readFileSync(resolve(root,'read/owner-commands/index.html'),'utf8'));
  assert(example.includes('均为合成示例'));
  assert(example.includes('不代表任何真实环境已完成这些动作'));
});

test('shared footer retains the verified counter contract with no invented totals',()=>{
  for(const file of pages){
    const html=readFileSync(file,'utf8');
    assert(html.includes('https://beian.miit.gov.cn/'));
    assert(html.includes('鲁ICP备18050487号-1'));
    for(const metric of ['uv','pv']){
      assert.equal((html.match(new RegExp('id="busuanzi_value_site_'+metric+'"','g'))||[]).length,1);
      assert(html.includes('id="busuanzi_value_site_'+metric+'"></strong>'));
    }
    assert(html.includes('域名访客'));assert(html.includes('域名浏览'));
    assert(html.includes("location.hostname === 'www.bluexiii.com'"));
    assert(!html.includes('cloudflareinsights'));
  }
});

import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,statSync,existsSync} from 'node:fs';
import {resolve,relative} from 'node:path';
const root=resolve('dist');
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=resolve(dir,n);return statSync(p).isDirectory()?walk(p):[p]})}
const pages=walk(root).filter(p=>p.endsWith('.html'));
const attrs=(s,name)=>[...s.matchAll(new RegExp('\\b'+name+'="([^"]*)"','g'))].map(m=>m[1]);
test('12 static pages and independent reading snapshots',()=>{assert.equal(pages.length,12);for(const slug of ['overview','user-guide','workflow','group-intake','adapters','owner-commands','acceptance','contributing','security','agents'])assert(existsSync(resolve(root,'read',slug,'index.html')));assert(existsSync(resolve(root,'.nojekyll')))});
test('all local links, assets and cross-document anchors resolve under /flow/',()=>{let checked=0;for(const file of pages){const html=readFileSync(file,'utf8');for(const raw of [...attrs(html,'href'),...attrs(html,'src')]){if(/^(https?:|data:|mailto:)/.test(raw))continue;const url=new URL(raw,'https://preview.test/flow/'+relative(root,file));assert(url.pathname.startsWith('/flow/'),raw);let dest=resolve(root,decodeURIComponent(url.pathname.slice(6)));if(url.pathname.endsWith('/'))dest=resolve(dest,'index.html');assert(existsSync(dest),file+' -> '+raw);if(url.hash){const ids=attrs(readFileSync(dest,'utf8'),'id');assert(ids.includes(decodeURIComponent(url.hash.slice(1))),file+' -> missing '+raw)}checked++}}assert(checked>250);console.log('Resolved local links/assets/anchors:',checked)});
test('homepage communicates family lineage, aspiration and present state',()=>{const html=readFileSync(resolve(root,'index.html'),'utf8');for(const text of ['第二个副产物','Director','自动开发未启用','不绕过审批','不是已经运行的自动开发服务','具体模型以账号和平台支持为准','GitHub Issues','wecom-slack-bridge','管理员接入并授权的工作群','https://www.bluexiii.com/hive/','https://www.bluexiii.com/acdl/'])assert(html.includes(text),text);assert(!html.includes('canonical'),'No unverified publication canonical')});
test('published payload contains no private runtime identifiers or paths',()=>{for(const f of walk(root)){if(!/\.(html|js|css|json)$/.test(f))continue;const s=readFileSync(f,'utf8');assert(!/(?:xox[baprs]-[A-Za-z0-9-]+|gh[pousr]_[A-Za-z0-9]+|\/Users\/|192\.168\.\d+\.\d+|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY)/.test(s),relative(root,f))}});

test('shared footer uses verified ICP and counter with no invented totals',()=>{for(const file of pages){const html=readFileSync(file,'utf8');assert(html.includes('https://beian.miit.gov.cn/'));assert(html.includes('鲁ICP备18050487号-1'));for(const metric of ['uv','pv']){assert.equal((html.match(new RegExp('id="busuanzi_value_site_'+metric+'"','g'))||[]).length,1);assert(html.includes('id="busuanzi_value_site_'+metric+'"></strong>'));}assert(html.includes('域名访客'));assert(html.includes('域名浏览'));assert(html.includes("location.hostname === 'www.bluexiii.com'"));assert(!html.includes('cloudflareinsights'));}});
test('overview uses the approved human handbook without private access requirements',()=>{const html=readFileSync(resolve(root,'read/overview/index.html'),'utf8');assert(!html.includes('HiveFlow is an agent collaboration specification'));assert(html.includes('规范文档目前以中文维护'));assert(html.includes('无需访问私有仓库'));assert(html.includes('HiveOS自动化手册'));});

test('every reading page maps to the exact approved handbook snapshot',()=>{
 const source=JSON.parse(readFileSync('src/data/source.json','utf8'));
 assert.equal(source.repository,'xiiiblue/hive-os');assert.match(source.commit,/^[a-f0-9]{40}$/);
 const [path]=Object.keys(source.files);assert.equal(path,'docs/11-手册/05-自动化手册/README.md');
 const snapshot=readFileSync(source.snapshot);assert.equal(createHash('sha256').update(snapshot).digest('hex'),source.files[path]);
 assert.equal(Object.keys(source.pages).length,10);
 for(const [slug,entry] of Object.entries(source.pages)){
  assert.equal(entry.source,path);assert(entry.sections.length>0);
  for(const section of entry.sections)assert(snapshot.toString().includes('## '+section+'.'));
  assert(readFileSync('src/pages/read/'+slug+'.md','utf8').includes('source: '+path));
 }
 for(const file of pages){const html=readFileSync(file,'utf8');assert(!html.includes('https://github.com/xiiiblue/hive-flow'));assert(!/https:\/\/github\.com\/xiiiblue\/hive-os\/(?:blob|issues|pull|actions)/.test(html));}
});

test('current modes and unverified automation remain explicit',()=>{
 const home=readFileSync(resolve(root,'index.html'),'utf8');for(const text of ['PR待审','完整交付','一次采纳不是自动执行许可','完整自动链路尚未验收'])assert(home.includes(text),text);
 const adapters=readFileSync(resolve(root,'read/adapters/index.html'),'utf8');for(const text of ['Codex','原生Automations','业务自动执行尚未启用','同一GitHub账号'])assert(adapters.includes(text),text);
 const security=readFileSync(resolve(root,'read/security/index.html'),'utf8');assert(security.includes('企微审批关闭'));
});

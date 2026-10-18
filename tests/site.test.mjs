import test from 'node:test';
import assert from 'node:assert/strict';
import {readdirSync,readFileSync,statSync,existsSync} from 'node:fs';
import {resolve,relative} from 'node:path';
const root=resolve('dist');
function walk(dir){return readdirSync(dir).flatMap(n=>{const p=resolve(dir,n);return statSync(p).isDirectory()?walk(p):[p]})}
const pages=walk(root).filter(p=>p.endsWith('.html'));
const attrs=(s,name)=>[...s.matchAll(new RegExp('\\b'+name+'="([^"]*)"','g'))].map(m=>m[1]);
test('11 static pages and independent reading snapshots',()=>{assert.equal(pages.length,11);for(const slug of ['overview','workflow','group-intake','adapters','owner-commands','acceptance','contributing','security','agents'])assert(existsSync(resolve(root,'read',slug,'index.html')));assert(existsSync(resolve(root,'.nojekyll')))});
test('all local links, assets and cross-document anchors resolve under /flow/',()=>{let checked=0;for(const file of pages){const html=readFileSync(file,'utf8');for(const raw of [...attrs(html,'href'),...attrs(html,'src')]){if(/^(https?:|data:|mailto:)/.test(raw))continue;const url=new URL(raw,'https://preview.test/flow/'+relative(root,file));assert(url.pathname.startsWith('/flow/'),raw);let dest=resolve(root,decodeURIComponent(url.pathname.slice(6)));if(url.pathname.endsWith('/'))dest=resolve(dest,'index.html');assert(existsSync(dest),file+' -> '+raw);if(url.hash){const ids=attrs(readFileSync(dest,'utf8'),'id');assert(ids.includes(decodeURIComponent(url.hash.slice(1))),file+' -> missing '+raw)}checked++}}assert(checked>250);console.log('Resolved local links/assets/anchors:',checked)});
test('homepage communicates family lineage, aspiration and present state',()=>{const html=readFileSync(resolve(root,'index.html'),'utf8');for(const text of ['第二个副产物','Director','自动开发未启用','不绕过审批','不是已经运行的自动开发服务','https://www.bluexiii.com/hive/','https://www.bluexiii.com/acdl/'])assert(html.includes(text),text);assert(!html.includes('canonical'),'No unverified publication canonical')});
test('published payload contains no private runtime identifiers or paths',()=>{for(const f of walk(root)){if(!/\.(html|js|css|json)$/.test(f))continue;const s=readFileSync(f,'utf8');assert(!/(?:xox[baprs]-[A-Za-z0-9-]+|gh[pousr]_[A-Za-z0-9]+|\/Users\/|192\.168\.\d+\.\d+|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY)/.test(s),relative(root,f))}});

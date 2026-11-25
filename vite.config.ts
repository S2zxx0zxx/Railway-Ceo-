import {defineConfig,type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
async function walk(dir:string):Promise<string[]>{const out:string[]=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=resolve(dir,entry.name);if(entry.isDirectory())out.push(...await walk(path));else if(entry.isFile())out.push(path)}return out}
function offline():Plugin{return {name:'ceo-offline',apply:'build',enforce:'post',async closeBundle(){
 const root=resolve('dist'),paths=(await walk(root)).filter(p=>!p.endsWith(sep+'sw.js')).sort(),hash=createHash('sha256');
 const entries=[];for(const path of paths){const name=relative(root,path).split(sep).join('/');const bytes=await readFile(path);hash.update(name+'\0');hash.update(bytes);entries.push('./'+name)}
 const version=hash.digest('hex').slice(0,24);
 const source='const VERSION='+JSON.stringify(version)+';const FILES='+JSON.stringify(entries)+';\n'+
 `const PREFIX='the-ceo-'+self.registration.scope+'-',CACHE=PREFIX+VERSION;
 const url=p=>new URL(p,self.registration.scope).href;
 self.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open(CACHE);try{await cache.addAll(FILES.map(p=>new Request(url(p),{cache:'reload'})));for(const p of FILES)if(!await cache.match(url(p)))throw Error('Missing precache entry')}catch(err){await caches.delete(CACHE);throw err}})()));
 // Do not skipWaiting automatically; existing clients must reach a safe boundary first.
 self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE_UPDATE'&&e.source?.url?.startsWith(self.registration.scope))e.waitUntil(self.skipWaiting())});
 // Keep previous caches until old clients exit; do not claim clients or delete caches on activate.
 self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin||!u.href.startsWith(self.registration.scope))return;
 if(r.mode==='navigate'){e.respondWith(caches.open(CACHE).then(c=>c.match(url('./index.html'))).then(x=>x||Response.error()));return}
 if(FILES.some(p=>url(p)===u.href)){e.respondWith(caches.open(CACHE).then(c=>c.match(r)).then(x=>x||fetch(r)));return}
 // An old tab can still request its old hashed chunk after activation.
 if(u.pathname.includes('/assets/'))e.respondWith((async()=>{for(const k of await caches.keys()){if(k.startsWith(PREFIX)){const x=await(await caches.open(k)).match(r);if(x)return x}}return fetch(r)})());
 });`;
 await writeFile(resolve(root,'sw.js'),source);
 }}}
export default defineConfig({plugins:[react(),offline()],base:'./'});

import {defineConfig,type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
function offline():Plugin{return {name:'ceo-offline',apply:'build',generateBundle(_options,bundle){
 const files=['./','./index.html','./manifest.webmanifest','./icon.svg','./office.svg',...Object.keys(bundle).map(x=>'./'+x)];
 const version=Object.keys(bundle).sort().join('|');
 let hash=2166136261;for(const ch of version)hash=Math.imul(hash^ch.charCodeAt(0),16777619);
 const cache='the-ceo-'+(hash>>>0).toString(16);
 const source='const CACHE='+JSON.stringify(cache)+';const FILES='+JSON.stringify(files)+';\n'+
 "self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));\n"+
 "self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('the-ceo-')&&k!==CACHE).map(k=>caches.delete(k))))));\n"+
 "self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match(new URL('./index.html',self.registration.scope)).then(x=>x||Response.error())));return;}e.respondWith(caches.match(r).then(x=>x||fetch(r)));});";
 this.emitFile({type:'asset',fileName:'sw.js',source});
 }}}
export default defineConfig({plugins:[react(),offline()],base:'./'});

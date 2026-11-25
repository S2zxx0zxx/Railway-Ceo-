import {Capacitor} from '@capacitor/core';
let registration:ServiceWorkerRegistration|undefined;
let waiting=false,activating=false;
const listeners=new Set<(ready:boolean)=>void>();
function publish(value:boolean){waiting=value;for(const fn of listeners)fn(value)}
export function onUpdate(fn:(ready:boolean)=>void){listeners.add(fn);fn(waiting);return ()=>{listeners.delete(fn)}}
export function activateUpdate(){if(!registration?.waiting)throw Error('No ready update');activating=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'})}
export function initPwa(){
 if(!import.meta.env.PROD||Capacitor.isNativePlatform()||!('serviceWorker' in navigator))return;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(activating)location.reload()});
 const start=async()=>{registration=await navigator.serviceWorker.register(new URL('./sw.js',document.baseURI),{updateViaCache:'none'});const observe=()=>{const w=registration?.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)publish(true)})};registration.addEventListener('updatefound',observe);observe();if(registration.waiting&&navigator.serviceWorker.controller)publish(true)};
 if(document.readyState==='complete')void start().catch(e=>console.warn('Offline cache unavailable',e));else window.addEventListener('load',()=>void start().catch(e=>console.warn('Offline cache unavailable',e)),{once:true});
}

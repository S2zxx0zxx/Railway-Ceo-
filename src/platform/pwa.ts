import {Capacitor} from '@capacitor/core';
let registration:ServiceWorkerRegistration|undefined;
let waiting=false,activating=false,timeout:ReturnType<typeof setTimeout>|undefined;
function failed(message:string){activating=false;clearTimeout(timeout);for(const fn of errors)fn(message)}
const errors=new Set<(message:string)=>void>();
export function onUpdateError(fn:(message:string)=>void){errors.add(fn);return ()=>{errors.delete(fn)}}
const listeners=new Set<(ready:boolean)=>void>();
function publish(value:boolean){waiting=value;for(const fn of listeners)fn(value)}
export function onUpdate(fn:(ready:boolean)=>void){listeners.add(fn);fn(waiting);return ()=>{listeners.delete(fn)}}
export function activateUpdate(){if(!registration?.waiting)throw Error('No ready update');activating=true;clearTimeout(timeout);timeout=setTimeout(()=>failed('Update activation was not confirmed. Try again or reopen the game.'),20000);registration.waiting.postMessage({type:'ACTIVATE_UPDATE'})}
export function initPwa(){
 if(!import.meta.env.PROD||Capacitor.isNativePlatform()||!('serviceWorker' in navigator))return;
 navigator.serviceWorker.addEventListener('message',e=>{if(e.data?.type==='UPDATE_BLOCKED'){failed('Close other game tabs before applying the update.')}});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(activating){clearTimeout(timeout);location.reload()}});
 const start=async()=>{registration=await navigator.serviceWorker.register(new URL('./sw.js',document.baseURI),{updateViaCache:'none'});const observe=()=>{const w=registration?.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller)publish(true)})};registration.addEventListener('updatefound',observe);observe();if(registration.waiting&&navigator.serviceWorker.controller)publish(true)};
 if(document.readyState==='complete')void start().catch(e=>console.warn('Offline cache unavailable',e));else window.addEventListener('load',()=>void start().catch(e=>console.warn('Offline cache unavailable',e)),{once:true});
}

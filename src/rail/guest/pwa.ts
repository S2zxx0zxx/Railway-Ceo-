import {Capacitor} from '@capacitor/core';
export async function initRailwayPwa(onState:(s:{offlineReady:boolean;updateReady:boolean})=>void){
 if(Capacitor.isNativePlatform()||!('serviceWorker' in navigator))return;
 const worker=new URL('./railway-sw.js',document.baseURI),scope=new URL('./',worker).href;
 const existing=navigator.serviceWorker.controller;
 if(existing&&existing.scriptURL!==worker.href)throw Error('R47: foreign service worker; deploy railway on a separate origin');
 const reg=await navigator.serviceWorker.register(worker.href,{scope,updateViaCache:'none'});
 const publish=()=>onState({offlineReady:reg.active?.state==='activated',updateReady:!!reg.waiting});
 const observe=()=>{reg.installing?.addEventListener('statechange',publish);publish();};
 reg.addEventListener('updatefound',observe);navigator.serviceWorker.addEventListener('controllerchange',publish);observe();
 await navigator.serviceWorker.ready;publish();
 // Updates intentionally activate only after all controlled clients close.
 // No skipWaiting, forced reload, database deletion or cross-app cache cleanup.
}

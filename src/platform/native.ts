import {Capacitor} from '@capacitor/core';
import {App as NativeApp} from '@capacitor/app';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
export const nativePlatform=Capacitor.isNativePlatform();
export async function listenNative(active:(active:boolean)=>void,back:()=>void){
 if(!nativePlatform)return ()=>{};
 const a=await NativeApp.addListener('appStateChange',s=>active(s.isActive));
 try{const b=await NativeApp.addListener('backButton',back);return ()=>{void a.remove();void b.remove()}}catch(err){void a.remove();throw err}
}
export async function exitNative(){if(nativePlatform)await NativeApp.exitApp()}
export async function exportJson(name:string,text:string){
 if(!/^[a-z0-9-]+\.json$/.test(name))throw Error('Invalid export name');
 if(nativePlatform){
  const file=await Filesystem.writeFile({path:name,data:text,directory:Directory.Cache,encoding:Encoding.UTF8});
  await Share.share({title:name,files:[file.uri],dialogTitle:'Save or share company file'});
 }else{
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
}

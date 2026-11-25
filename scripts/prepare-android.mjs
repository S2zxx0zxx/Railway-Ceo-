import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
const cap=resolve('node_modules/@capacitor/cli/bin/capacitor');
function cli(...args){const r=spawnSync(process.execPath,[cap,...args],{stdio:'inherit'});if(r.status!==0)throw Error('Capacitor '+args.join(' ')+' failed')}
function replace(text,pattern,value,label){if(!pattern.test(text))throw Error('Missing template anchor '+label);return text.replace(pattern,value)}
if(!existsSync('dist/index.html')||!existsSync('dist/sw.js'))throw Error('Build the web bundle first');
if(!existsSync('android/gradlew')){if(existsSync('android'))throw Error('Incomplete native directory; inspect it rather than overwriting');cli('add','android')}
cli('sync','android');
const base='android/app/src/main';
const vars=await readFile('android/variables.gradle','utf8');
for(const name of ['compileSdkVersion','targetSdkVersion'])if(!new RegExp(name+'\\s*=\\s*36\\b').test(vars))throw Error('Expected API 36 in generated '+name+'; inspect Capacitor template');
const gradle='android/app/build.gradle';let g=await readFile(gradle,'utf8');
const pkg=JSON.parse(await readFile('package.json','utf8')),code=Number(process.env.CEO_VERSION_CODE??'1');
if(!Number.isSafeInteger(code)||code<1||code>2100000000)throw Error('Invalid Android version code');
g=replace(g,/versionCode\s+\d+/,'versionCode '+code,'versionCode');
g=replace(g,/versionName\s+["'][^"']+["']/,'versionName "'+pkg.version+'"','versionName');await writeFile(gradle,g);
const mp=base+'/AndroidManifest.xml';let manifest=await readFile(mp,'utf8');
manifest=manifest.replace(/\sandroid:screenOrientation="[^"]*"/g,'');
manifest=replace(manifest,/(<activity\b(?:(?!>).)*android:name="\.MainActivity")/s,'$1 android:screenOrientation="sensorLandscape"','MainActivity');
manifest=manifest.replace(/\sandroid:usesCleartextTraffic="[^"]*"/g,'');
manifest=replace(manifest,/<application\b/,'<application android:usesCleartextTraffic="false"','application');
manifest=manifest.replace(/\sandroid:allowBackup="[^"]*"/g,'');
manifest=replace(manifest,/<application\b/,'<application android:allowBackup="false"','application backup');
await writeFile(mp,manifest);
// Replace template launcher graphics, not just the web favicon.
for(const density of ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi']){
 const dir=base+'/res/mipmap-'+density;await mkdir(dir,{recursive:true});
 for(const name of ['ic_launcher','ic_launcher_round','ic_launcher_foreground'])await copyFile('public/icons/maskable-512.png',dir+'/'+name+'.png');
}
const res=base+'/res';await mkdir(res+'/values',{recursive:true});await writeFile(res+'/values/ceo_launcher.xml','<?xml version="1.0" encoding="utf-8"?><resources><color name="ceo_launcher_background">#143c59</color></resources>');
await mkdir(res+'/mipmap-anydpi-v26',{recursive:true});
for(const name of ['ic_launcher','ic_launcher_round'])await writeFile(res+'/mipmap-anydpi-v26/'+name+'.xml','<?xml version="1.0" encoding="utf-8"?><adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/ceo_launcher_background"/><foreground android:drawable="@mipmap/ic_launcher_foreground"/></adaptive-icon>');
// Native app is a local bundle, not a service-worker-controlled site.
await rm(base+'/assets/public/sw.js',{force:true});
const nativeConfig=JSON.parse(await readFile(base+'/assets/capacitor.config.json','utf8'));
if(nativeConfig.server?.url)throw Error('Remote WebView URL is forbidden');
console.log('Generated Android wrapper: API 36, version '+pkg.version+' ('+code+'), bundled assets; signing not configured.');

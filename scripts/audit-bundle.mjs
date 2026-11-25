import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const root=resolve('dist');const files=[];
async function walk(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const p=resolve(dir,ent.name);if(ent.isDirectory())await walk(p);else if(ent.isFile()){const b=await readFile(p);files.push({path:relative(root,p).split(sep).join('/'),bytes:b.length,gzip:gzipSync(b).length,sha256:createHash('sha256').update(b).digest('hex')})}}}
await walk(root);
const total=files.reduce((n,f)=>n+f.bytes,0),js=files.filter(f=>f.path.endsWith('.js')).reduce((n,f)=>n+f.gzip,0),offices=files.filter(f=>f.path.startsWith('offices/'));
const sw=await readFile('dist/sw.js','utf8');const missing=files.filter(f=>f.path!=='sw.js'&&!sw.includes(JSON.stringify('./'+f.path)));
const report={totalBytes:total,allJsGzipBytes:js,officeFiles:offices,missingPrecache:missing,files,limits:{allJsGzipBytes:512000,offlineBytes:30*1024*1024,officeBytes:700*1024}};
await mkdir('audit-output',{recursive:true});await writeFile('audit-output/bundle.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({total,js,missing:missing.map(f=>f.path),offices:offices.length}));
if(missing.length||total>report.limits.offlineBytes||offices.some(f=>f.bytes>report.limits.officeBytes)||js>report.limits.allJsGzipBytes)throw Error('Bundle budget or precache check failed; inspect audit-output/bundle.json');

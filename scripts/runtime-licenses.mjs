import {readFile,readdir,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
const lock=JSON.parse(await readFile('package-lock.json','utf8'));
const accepted=new Set(['MIT','ISC','Apache-2.0','0BSD']);
const rows=[],notices=[];
for(const [path,p] of Object.entries(lock.packages).sort(([a],[b])=>a.localeCompare(b))){
 if(!path||p.dev)continue;
 if(!path.startsWith('node_modules/')||path.includes('..'))throw Error('Invalid lockfile package path');
 const dir=resolve(path),manifest=JSON.parse(await readFile(join(dir,'package.json'),'utf8'));
 if(manifest.version!==p.version||!accepted.has(manifest.license))throw Error('Runtime license or version requires review: '+path);
 const names=(await readdir(dir)).filter(n=>/^(licen[cs]e|copying|notice)([._-].*)?$/i.test(n));
 const texts=[];for(const n of names)if((await stat(join(dir,n))).isFile())texts.push(n+'\n'+await readFile(join(dir,n),'utf8'));
 if(!texts.length)throw Error('Missing license text: '+path);
 rows.push({name:manifest.name,version:manifest.version,license:manifest.license,files:names});
 notices.push(manifest.name+' '+manifest.version+' — '+manifest.license+'\n'+texts.join('\n\n'));
}
await mkdir('audit-output',{recursive:true});await mkdir('public/licenses',{recursive:true});
await writeFile('audit-output/runtime-licenses.json',JSON.stringify(rows,null,2));
await writeFile('public/licenses/RUNTIME_LICENSES.txt','Installed runtime dependency notices\n\n'+notices.join('\n\n====================================\n\n'));
console.log('Collected runtime license texts: '+rows.length);

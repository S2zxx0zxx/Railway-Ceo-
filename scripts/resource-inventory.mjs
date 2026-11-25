// Read-only inventory of the actual installed npm resolution. Does not certify licensing.
import {readFile,readdir,mkdir,writeFile,stat} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(), lock=JSON.parse(await readFile(join(root,'package-lock.json'),'utf8'));
if(!lock.packages)throw Error('npm package-lock with packages table required; install dependencies first');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const rows=[];
for(const [path,entry] of Object.entries(lock.packages).sort(([a],[b])=>a.localeCompare(b))){
 if(!path)continue;
 const dir=resolve(root,path);
 if(!dir.startsWith(join(root,'node_modules')+'/')&&!dir.startsWith(join(root,'node_modules')+'\\'))throw Error('Unexpected package path: '+path);
 let manifest,files;
 try{manifest=JSON.parse(await readFile(join(dir,'package.json'),'utf8'));files=await readdir(dir)}catch(error){if(error.code!=='ENOENT')throw error;rows.push({path,version:entry.version??null,optional:!!entry.optional,status:'not-installed-review'});continue}
 const licenseFiles=[];
 for(const name of files.filter(n=>/^(licen[cs]e|copying|notice)([._-].*)?$/i.test(n)).sort()){
  const file=join(dir,name);if(!(await stat(file)).isFile())continue;
  const bytes=await readFile(file);
  licenseFiles.push({path:relative(root,file),sha256:sha(bytes)});
 }
 rows.push({path,name:manifest.name,version:manifest.version,lockedVersion:entry.version??null,license:manifest.license??null,integrity:entry.integrity??null,dev:!!entry.dev,optional:!!entry.optional,licenseFiles,status:manifest.version!==entry.version?'version-mismatch':!manifest.license||!licenseFiles.length?'manual-license-review':'recorded-not-approved'});
}
const assetPaths=['public/icon.svg','public/office.svg'];
const assets=[];for(const path of assetPaths){const bytes=await readFile(join(root,path));assets.push({path,sha256:sha(bytes),bytes:bytes.length,status:'verify-original-provenance'})}
const report={schema:1,lockSha256:sha(await readFile(join(root,'package-lock.json'))),packages:rows,assets,disclaimer:'Inventory only. Review every grant, transitive dependency, missing notice and asset before redistribution.'};
await mkdir(join(root,'audit-output'),{recursive:true});
await writeFile(join(root,'audit-output','resource-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log('Recorded '+rows.length+' lockfile entries and '+assets.length+' known visual assets. No license approval inferred.');

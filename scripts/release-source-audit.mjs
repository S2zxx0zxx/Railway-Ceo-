import {execFileSync} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const paths=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean),findings=[];
const keyPatterns=[/-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{40,}\b/,/\bAKIA[A-Z0-9]{16}\b/];
for(const path of paths){
 if(/\.(jks|keystore|p12|pfx|pem|key)$/i.test(path)||/(^|\/)\.env(?:\.|$)/.test(path))findings.push({path,kind:'potential-secret-file'});
 if(!/\.(tsx?|mjs|js|json|ya?ml|xml|html|md|txt|gradle)$/i.test(path)||path==='package-lock.json'||path==='scripts/release-source-audit.mjs')continue;
 const text=await readFile(path,'utf8');
 if(keyPatterns.some(p=>p.test(text)))findings.push({path,kind:'potential-secret-pattern'});
 if(path.startsWith('src/')&&/\b(fetch\s*\(\s*['"]https?:|new\s+WebSocket\s*\(\s*['"]wss?:|https?:\/\/[^\s'"]+['"]\s*,\s*\{\s*method)/i.test(text))findings.push({path,kind:'external-runtime-endpoint-review'});
}
const assets=[];for(const path of paths.filter(p=>p.startsWith('public/')&&/\.(svg|png|webp|jpg|jpeg|mp3|wav|ogg)$/i.test(p))){const bytes=await readFile(path);assets.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')})}
const listing=JSON.parse(await readFile('docs/store-listing-draft.json','utf8'));
for(const [key,max] of [['title',30],['shortDescription',80],['fullDescription',4000]])if(typeof listing[key]!=='string'||listing[key].length>max)findings.push({path:'docs/store-listing-draft.json',kind:'invalid-'+key});
await mkdir('audit-output',{recursive:true});await writeFile('audit-output/release-source.json',JSON.stringify({trackedFiles:paths.length,findings,assets,limits:'Heuristic scan; does not prove absence of secrets or network traffic.'},null,2));
if(findings.length){console.error(findings.map(f=>f.kind+': '+f.path).join('\n'));process.exitCode=1}else console.log('Source audit: no matched high-signal secret patterns or literal remote calls; '+assets.length+' visual/audio hashes recorded.');

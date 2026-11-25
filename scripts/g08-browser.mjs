import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const url='http://127.0.0.1:4173/',t=1800000000000;
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1280,height:720}});
async function pageAt(now){const p=await context.newPage();await p.addInitScript(n=>{Date.now=()=>n},now);await p.goto(url);return p}
async function company(p){await p.getByRole('navigation').getByRole('button',{name:'Company',exact:true}).click();await p.getByRole('dialog').getByRole('heading',{name:'Company',exact:true}).waitFor()}
async function close(p){await p.getByRole('dialog').getByRole('button',{name:'Close panel'}).click()}
async function active(p,corrupt=false){return p.evaluate(async corrupt=>{const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('the-ceo-simulator');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});try{return await new Promise((resolve,reject)=>{const tx=db.transaction('slots',corrupt?'readwrite':'readonly'),store=tx.objectStore('slots'),get=store.get('active');let value;get.onsuccess=()=>{value=get.result;if(corrupt){value.game.name='corrupted';store.put(value)}};tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}},corrupt)}
try{
 const a=await pageAt(t);
 await a.getByLabel('Company name').fill('G08 Test');await a.getByLabel('CEO name').fill('CEO');await a.getByRole('button',{name:'Accept takeover'}).click();await a.getByRole('button',{name:'Accept takeover'}).waitFor({state:'hidden'});
 await a.evaluate(async()=>{await navigator.serviceWorker.ready});await a.reload();await a.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 const b=await pageAt(t);await company(a);await company(b);
 await a.getByRole('dialog').getByRole('button',{name:'Inspect',exact:true}).first().click();
 await a.waitForFunction(()=>[...document.querySelectorAll('dialog button')].filter(b=>b.textContent.trim()==='Inspect').length===5);
 const changed=await active(a);assert.equal(changed.game.audit.length,1);assert.match(changed.integrity,/^[0-9a-f]{8}$/);
 await b.getByRole('dialog').getByRole('button',{name:'Inspect',exact:true}).first().click();await b.getByRole('alert').filter({hasText:'Save changed'}).waitFor();assert.equal((await active(a)).version,changed.version);await b.close();
 await close(a);await a.getByRole('button',{name:'Settings',exact:true}).click();await a.getByRole('dialog').getByRole('button',{name:'1×',exact:true}).click();await a.waitForFunction(()=>document.querySelector('.panel-status')?.textContent?.includes('1× speed'));const before=await active(a);assert.equal(before.game.speed,1);await a.close();
 await context.setOffline(true);
 const c=await pageAt(t+600000);await c.getByRole('heading',{name:'Offline return report'}).waitFor();const advanced=await active(c);assert.equal(advanced.game.minute,before.game.minute+10);assert.equal(advanced.game.wall,t+600000);
 await c.reload();await c.getByRole('navigation').getByRole('button',{name:'Company',exact:true}).waitFor();assert.equal((await active(c)).game.minute,advanced.game.minute);
 await active(c,true);await c.reload();await c.getByText(/Stored save checksum mismatch/).waitFor();await c.getByRole('button',{name:'Recover previous save'}).click();await c.getByRole('navigation').getByRole('button',{name:'Company',exact:true}).waitFor();const recovered=await active(c);assert.equal(recovered.game.name,'G08 Test');assert.equal(recovered.game.speed,0);assert.ok(recovered.version>advanced.version);
 console.log('G08 acceptance: stale tab, cached worker offline, exactly-once elapsed, corruption detection and recovery');
}finally{await browser.close()}

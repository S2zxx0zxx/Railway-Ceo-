import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {cpSync,mkdirSync,writeFileSync} from 'node:fs';
const b=await chromium.launch({headless:true}),ctx=await b.newContext({viewport:{width:360,height:800}}),page=await ctx.newPage(),errors=[];
mkdirSync('r47-evidence',{recursive:true});page.on('pageerror',e=>errors.push(String(e)));
const origin='http://127.0.0.1:4187/',ready=()=>page.getByText('Guest company ready',{exact:true}).waitFor();
try{
 await page.goto(origin);await page.getByRole('button',{name:'Start guest company'}).waitFor();
 await page.getByText('Offline cache ready',{exact:true}).waitFor();
 // Place a sentinel legacy cache; update cleanup must not touch it.
 await page.evaluate(async()=>{const c=await caches.open('the-ceo-legacy-sentinel');await c.put(new Request(location.origin+'/legacy-test'),new Response('retained'));});
 await page.getByRole('button',{name:'Start guest company'}).click();await ready();
 await page.evaluate(()=>r47Qa.quote());
 await assert.rejects(page.evaluate(()=>r47Qa.duplicate()),/existing or incomplete/);
 const first=await page.evaluate(()=>r47Qa.export());assert.ok(JSON.parse(first.payload).journal.some(x=>x.requestId==='r47-qa-quote'));
 await page.getByRole('button',{name:'Operations',exact:true}).click();await page.getByRole('heading',{name:'Operations control'}).waitFor();
 await page.getByRole('button',{name:'Back',exact:true}).click();await ready();
 await page.getByRole('button',{name:'Finance',exact:true}).click();await page.getByRole('heading',{name:'Company & finance'}).waitFor();await page.getByRole('button',{name:'Back',exact:true}).click();await ready();
 await page.getByRole('button',{name:'Progression',exact:true}).click();await page.getByRole('heading',{name:'Company progression'}).waitFor();await page.getByRole('button',{name:'Back',exact:true}).click();await ready();
 await page.reload();await page.getByRole('button',{name:'Resume guest company'}).waitFor();
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await ctx.setOffline(true);await page.reload();await page.getByRole('button',{name:'Resume guest company'}).click();await ready();
 const saved=await page.evaluate(()=>r47Qa.export());assert.ok(JSON.parse(saved.payload).journal.some(x=>x.requestId==='r47-qa-quote'));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:'r47-evidence/guest-offline.png',fullPage:true});
 await ctx.setOffline(false);
 cpSync('r47-update-dist','r47-qa-dist',{recursive:true});
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
 await page.getByText(/Update downloaded/).waitFor({timeout:60000});
 assert.equal(await page.evaluate(async()=> (await(await fetch('./build-id.json')).json()).buildId),'initial');
 await page.close();const next=await ctx.newPage();await next.goto(origin);await next.getByRole('button',{name:'Resume guest company'}).waitFor();
 await next.waitForFunction(async()=>{const r=await navigator.serviceWorker.getRegistration();return !r?.waiting&&r?.active?.state==='activated';});
 await next.reload();await next.getByRole('button',{name:'Resume guest company'}).click();await next.getByText('Guest company ready',{exact:true}).waitFor();
 const final=await next.evaluate(async()=>({body:JSON.parse((await r47Qa.export()).payload),build:(await(await fetch('./build-id.json')).json()).buildId,legacy:await caches.has('the-ceo-legacy-sentinel')}));
 assert.equal(final.build,'update');assert.equal(final.legacy,true);assert.ok(final.body.journal.some(x=>x.requestId==='r47-qa-quote'));assert.deepEqual(errors,[]);
 writeFileSync('r47-evidence/browser.json',JSON.stringify({initialRevision:JSON.parse(first.payload).revision,finalRevision:final.body.revision,build:final.build,legacyPreserved:final.legacy},null,2));
 console.log('R47_BROWSER PASS explicit guest creation and duplicate rejection, actual operations finance progression, offline reload and save retention, waiting update and legacy cache isolation');
}finally{await ctx.close();await b.close();}

import {exportJson} from '../platform/native';
import {requestReceipt,wasCommitted,remember,receiptLimit,type Receipt} from './receipts';
import Dexie,{type Table} from 'dexie';
import {apply,assertState,initialGame,type Command,type Game} from '../engine/game';
import {decodeSave,encodeSave} from './codec';
import {checksum} from './integrity';
import {simulateElapsed} from '../worker/bridge';
import type {ReturnReport} from '../engine/offline';
type Slot='active'|'backup'|'backup:1'|'backup:2'|`archive:${string}`;
type SaveRecord={id:Slot;game:Game;version:number;receipts?:Receipt[];integrity?:string};
export type SaveView={game:Game;version:number;report?:ReturnReport};
class Saves extends Dexie{slots!:Table<SaveRecord,Slot>;constructor(){super('the-ceo-simulator');this.version(1).stores({slots:'id'})}}
const db=new Saves();
const backupSlots:Slot[]=['backup','backup:1','backup:2'];
const digest=(r:Pick<SaveRecord,'game'|'version'|'receipts'>)=>checksum(JSON.stringify([r.version,r.receipts??[],r.game]));
function verifyRecord(r:SaveRecord):Game{
 if(!Number.isSafeInteger(r.version)||r.version<1)throw Error('Invalid save revision');
 if(r.integrity!==undefined&&digest(r)!==r.integrity)throw Error('Stored save checksum mismatch; recover a backup');
 const receipts=r.receipts??[];
 if(!Array.isArray(receipts)||receipts.length>receiptLimit||new Set(receipts.map(x=>x.id)).size!==receipts.length||receipts.some(x=>typeof x.id!=='string'||typeof x.payload!=='string'||!Number.isSafeInteger(x.version)||x.version<1||x.version>r.version))throw Error('Invalid command receipts');
 return decodeSave(JSON.stringify(r.game));
}
function makeRecord(id:Slot,game:Game,version:number,receipts:Receipt[]=[]):SaveRecord{
 // Validate before writing. Never publish a snapshot that the importer cannot read.
 assertState(game);decodeSave(JSON.stringify(game));
 const r={id,game,version,receipts};return {...r,integrity:digest(r)};
}
function requireCurrent(r:SaveRecord|undefined,expected:number):asserts r is SaveRecord{if(!r||r.version!==expected)throw Error('Save changed in another window. Reload before continuing.')}
function sameSnapshot(current:SaveRecord|undefined,previous:SaveRecord|undefined){
 return current===undefined?previous===undefined:previous!==undefined&&current.version===previous.version&&current.integrity===previous.integrity&&current.game.governance?.companyId===previous.game.governance?.companyId;
}
async function rotate(previous:SaveRecord){
 const one=await db.slots.get('backup:1'),zero=await db.slots.get('backup');
 if(one)await db.slots.put({...one,id:'backup:2'});
 if(zero)await db.slots.put({...zero,id:'backup:1'});
 await db.slots.put({...previous,id:'backup',integrity:previous.integrity??digest(previous)});
}
async function persist(previous:SaveRecord|undefined,game:Game,receipts=previous?.receipts??[],report?:ReturnReport,rotatePrevious=true):Promise<SaveView>{
 const version=(previous?.version??0)+1,record=makeRecord('active',game,version,receipts);
 if(previous&&rotatePrevious)await rotate(previous);
 await db.slots.put(record);
 return {game,version,...(report?{report}:{})};
}
function visibleReport(report:ReturnReport){return report.elapsedRealMinutes>=5||report.clockAnomaly||report.skippedRealMinutes>0?report:undefined}
/** Compute outside Dexie; only the compare-and-swap transaction may publish a proposal. */
export async function openSave():Promise<SaveView>{
 for(let attempt=0;attempt<3;attempt++){
  const before=await db.slots.get('active'),now=Date.now();
  const result=before?await simulateElapsed(verifyRecord(before),now):null;
  const committed=await db.transaction('rw',db.slots,async()=>{
   const live=await db.slots.get('active');if(!sameSnapshot(live,before))return undefined;
   if(!before||!result)return persist(undefined,initialGame(now));
   if(before.integrity&&JSON.stringify(before.game)===JSON.stringify(result.game))return {game:result.game,version:before.version,report:visibleReport(result.report)};
   return persist(before,result.game,before.receipts??[],visibleReport(result.report),result.game.revision!==before.game.revision);
  });
  if(committed)return committed;
 }
 throw Error('Another window is updating this company. Reload before continuing.');
}
export async function command(expected:number,cmd:Command,requestId:string=crypto.randomUUID()):Promise<SaveView>{
 const before=await db.slots.get('active'),receipt=requestReceipt(requestId,cmd,expected+1);
 if(before){const verified=verifyRecord(before);if(wasCommitted(before.receipts??[],receipt))return {game:verified,version:before.version}}
 requireCurrent(before,expected);
 const now=Date.now(),result=await simulateElapsed(verifyRecord(before),now),g=result.game,game=apply(g,cmd);
 if(cmd.type==='speed'||cmd.type==='takeover'||cmd.type==='restartCompany')game.wall=Math.max(game.wall,now);
 return db.transaction('rw',db.slots,async()=>{
  const live=await db.slots.get('active');
  if(live&&wasCommitted(live.receipts??[],receipt))return {game:verifyRecord(live),version:live.version};
  requireCurrent(live,expected);if(!sameSnapshot(live,before))throw Error('Save changed during computation. Reload before continuing.');
  if(cmd.type==='restartCompany'){
   const frozen=makeRecord(`archive:${g.governance.companyId}`,g,live.version,live.receipts??[]);
   if(await db.slots.get(frozen.id))throw Error('This company already has an archive; export its records before replacing it');
   await db.slots.add(frozen);
   return persist({...live,game:g,integrity:digest({...live,game:g})},game,remember([],receipt));
  }
  return persist(live,game,remember(live.receipts??[],receipt),visibleReport(result.report));
 });
}
export async function resume(expected:number):Promise<SaveView>{
 const before=await db.slots.get('active');requireCurrent(before,expected);
 const result=await simulateElapsed(verifyRecord(before),Date.now());
 return db.transaction('rw',db.slots,async()=>{
  const live=await db.slots.get('active');requireCurrent(live,expected);
  if(!sameSnapshot(live,before))throw Error('Save changed during catch-up. Reload before continuing.');
  if(live.integrity&&JSON.stringify(live.game)===JSON.stringify(result.game))return {game:result.game,version:live.version,report:visibleReport(result.report)};
  return persist(live,result.game,live.receipts??[],visibleReport(result.report),result.game.revision!==live.game.revision);
 });
}
export async function importSave(expected:number,text:string):Promise<SaveView>{
 const game=decodeSave(text);
 return db.transaction('rw',db.slots,async()=>{const r=await db.slots.get('active');requireCurrent(r,expected);verifyRecord(r);return persist(r,{...game,speed:0,wall:Date.now()},[])});
}
export async function recoverBackup(expected?:number):Promise<SaveView>{
 return db.transaction('rw',db.slots,async()=>{
  const r=await db.slots.get('active');if(expected!==undefined)requireCurrent(r,expected);
  const candidates=await db.slots.bulkGet(backupSlots);
  let restored:Game|undefined,version=Number.isSafeInteger(r?.version)?r!.version:0;
  for(const candidate of candidates){if(!candidate)continue;if(Number.isSafeInteger(candidate.version))version=Math.max(version,candidate.version);if(restored)continue;try{restored=verifyRecord(candidate)}catch{/* Try next older snapshot without overwriting it. */}}
  if(!restored)throw Error('No valid recovery backup available; current records were not replaced');
  const game={...restored,speed:0,wall:Date.now()},record=makeRecord('active',game,version+1);
  await db.slots.put(record);return {game,version:record.version};
 });
}
export async function exportSave(game:Game){await exportJson('the-ceo-save.json',encodeSave(game))}
/** Archives share the same local database; export before clearing browser storage. */
export async function exportLatestLiquidated(){const archived=await db.slots.where('id').startsWith('archive:').toArray();const latest=archived.sort((a,b)=>b.version-a.version)[0];if(!latest)throw Error('No archived liquidated company');await exportSave(verifyRecord(latest))}

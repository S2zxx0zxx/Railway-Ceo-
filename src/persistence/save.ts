import Dexie,{type Table} from 'dexie';
import {apply,assertState,catchUp,initialGame,migrateGame,type Command,type Game} from '../engine/game';
import {decodeSave} from './codec';
type Slot='active'|'backup';
type SaveRecord={id:Slot;game:Game;version:number};
class Saves extends Dexie{slots!:Table<SaveRecord,Slot>;constructor(){super('the-ceo-simulator');this.version(1).stores({slots:'id'})}}
const db=new Saves();
const verified=(g:Game)=>decodeSave(JSON.stringify(g));
function requireCurrent(r:SaveRecord|undefined,expected:number):asserts r is SaveRecord{if(!r||r.version!==expected)throw Error('Save changed in another window. Reload before continuing.')}
async function persist(previous:SaveRecord|undefined,game:Game){assertState(game);const version=(previous?.version??0)+1;if(previous)await db.slots.put({...previous,id:'backup'});await db.slots.put({id:'active',game,version});return {game,version}}
export async function openSave(){return db.transaction('rw',db.slots,async()=>{const record=await db.slots.get('active');if(!record)return persist(undefined,initialGame(Date.now()));const game=catchUp(verified(record.game),Date.now());return persist(record,game)})}
export async function command(expected:number,cmd:Command){return db.transaction('rw',db.slots,async()=>{const r=await db.slots.get('active');requireCurrent(r,expected);const now=Date.now();const g=catchUp(migrateGame(r.game),now);const game=apply(g,cmd);if(cmd.type==='speed'||cmd.type==='takeover')game.wall=Math.max(game.wall,now);return persist(r,game)})}
export async function resume(expected:number){return db.transaction('rw',db.slots,async()=>{const r=await db.slots.get('active');requireCurrent(r,expected);return persist(r,catchUp(r.game,Date.now()))})}
export async function importSave(expected:number,text:string){const game=decodeSave(text);return db.transaction('rw',db.slots,async()=>{const r=await db.slots.get('active');requireCurrent(r,expected);return persist(r,{...game,speed:0,wall:Date.now()})})}
export async function recoverBackup(expected?:number){return db.transaction('rw',db.slots,async()=>{const r=await db.slots.get('active'),backup=await db.slots.get('backup');if(expected!==undefined)requireCurrent(r,expected);if(!backup)throw Error('No recovery backup available');const game={...verified(backup.game),speed:0,wall:Date.now()};const version=Math.max(r?.version??0,backup.version)+1;await db.slots.put({id:'active',game,version});return {game,version}})}
export function exportSave(game:Game){const blob=new Blob([JSON.stringify(game,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='the-ceo-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

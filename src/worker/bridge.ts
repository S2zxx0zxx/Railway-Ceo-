import {chunkedCatchUp,type CatchUpResult} from '../engine/offline';
import {catchUpPlan,type Game} from '../engine/game';
import type {WorkerRequest,WorkerReply} from './protocol';
const yieldUI=()=>new Promise<void>(resolve=>setTimeout(resolve,0));
export async function simulateElapsed(game:Game,now:number):Promise<CatchUpResult>{
 if(catchUpPlan(game,now).minutes===0)return chunkedCatchUp(game,now);
 if(typeof Worker==='undefined')return chunkedCatchUp(game,now,yieldUI);
 let worker:Worker;
 try{worker=new Worker(new URL('./simulation.worker.ts',import.meta.url),{type:'module'})}
 catch{return chunkedCatchUp(game,now,yieldUI)}
 try{return await new Promise<CatchUpResult>((resolve,reject)=>{
  const timer=setTimeout(()=>{worker.terminate();reject(Error('Simulation worker timed out; saved company remains unchanged'))},120000);
  const complete=()=>{clearTimeout(timer);worker.terminate()};
  worker.onmessage=(event:MessageEvent<WorkerReply>)=>{complete();const data=event.data;if(data.ok)resolve(data.result);else reject(Error(data.error))};
  worker.onerror=event=>{complete();reject(Error(event.message||'Simulation worker failed; saved company remains unchanged'))};
  worker.onmessageerror=()=>{complete();reject(Error('Invalid simulation response'))};
  try{const request:WorkerRequest={type:'catchUp',game,now};worker.postMessage(request)}catch(e){complete();reject(e)}
 })}finally{worker.terminate()}
}

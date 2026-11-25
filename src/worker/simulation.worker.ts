import {chunkedCatchUp} from '../engine/offline';
import type {WorkerRequest,WorkerReply} from './protocol';
// Avoid mixing DOM and WebWorker lib declarations in the shared TypeScript config.
const scope=self as unknown as {onmessage:((e:MessageEvent<WorkerRequest>)=>void)|null;postMessage:(reply:WorkerReply)=>void};
scope.onmessage=async e=>{try{if(e.data.type!=='catchUp')throw Error('Unknown simulation request');const result=await chunkedCatchUp(e.data.game,e.data.now);scope.postMessage({ok:true,result})}catch(err){scope.postMessage({ok:false,error:err instanceof Error?err.message:String(err)})}};

import type {Command} from '../engine/game';
export type Receipt={id:string;payload:string;version:number};
export const receiptLimit=512;
// Stable representation across property insertion order, including manager policy.
function canonical(value:unknown):string{
 if(value===null||typeof value!=='object')return JSON.stringify(value)??'null';
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 const obj=value as Record<string,unknown>;
 return '{'+Object.keys(obj).filter(k=>obj[k]!==undefined).sort().map(k=>JSON.stringify(k)+':'+canonical(obj[k])).join(',')+'}';
}
export function requestReceipt(id:string,cmd:Command,version:number):Receipt{
 if(!/^[a-zA-Z0-9_-]{16,100}$/.test(id))throw Error('Invalid command request ID');
 return {id,payload:canonical(cmd),version};
}
export function wasCommitted(receipts:Receipt[],request:Receipt){
 const previous=receipts.find(r=>r.id===request.id);if(!previous)return false;
 if(previous.payload!==request.payload)throw Error('Command ID reused with different payload');
 return true;
}
export function remember(receipts:Receipt[],request:Receipt){return [...receipts,request].slice(-receiptLimit)}

import type {Game} from './game';
import {freeQuantity,type Reservation} from './planning';
import {regionInfo,type RegionId} from './market';
export type BuyerContract={id:string;qty:number;price:number;credit:number;region:RegionId;accepted:number;deadline:number;reservations:Reservation[];status:'reserved'|'dispatched'|'delivered'|'canceled'|'expired'|'recalled'|'failed';closed?:number};
export function reserveFinished(g:Game,qty:number,through:number){
 const allocations:Reservation[]=[];let left=qty;
 for(const l of g.lots.filter(l=>l.item==='biscuit'&&l.expiry>through).sort((a,b)=>a.expiry-b.expiry||a.id.localeCompare(b.id))){
  const n=Math.min(left,freeQuantity(g,l));if(n>0){allocations.push({lotId:l.id,qty:n});left-=n}if(!left)break;
 }
 if(left)throw Error('Insufficient released unreserved stock valid through delivery');
 return allocations;
}
export function cancelContract(g:Game,c:BuyerContract,status:'canceled'|'expired'|'recalled'){
 if(c.status!=='reserved')throw Error('Contract is no longer reserved');
 if(Math.floor(c.accepted/1440)===g.operations.marketDay){g.operations.marketCommitted-=c.qty;g.market.regionCommitted[c.region]-=c.qty}
 c.status=status;c.closed=g.minute;
}
export function validContracts(g:Game){
 const int=(v:number,min:number,max:number)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
 return Array.isArray(g.contracts)&&g.contracts.length<=50000&&new Set(g.contracts.map(c=>c.id)).size===g.contracts.length&&g.contracts.every(c=>{
  const region=regionInfo(c.region);
  return !!region&&typeof c.id==='string'&&c.id.length>0&&int(c.qty,1,10000)&&int(c.price,100,3000)&&[0,15,30].includes(c.credit)&&int(c.accepted,0,g.minute)&&int(c.deadline,c.accepted+1,(Math.floor(c.accepted/1440)+1)*1440)&&Array.isArray(c.reservations)&&c.reservations.length>0&&new Set(c.reservations.map(r=>r.lotId)).size===c.reservations.length&&c.reservations.every(r=>typeof r.lotId==='string'&&int(r.qty,1,c.qty))&&c.reservations.reduce((n,r)=>n+r.qty,0)===c.qty&&['reserved','dispatched','delivered','canceled','expired','recalled','failed'].includes(c.status)&&
   (c.status==='reserved'?c.closed===undefined&&c.deadline>g.minute&&Math.floor(c.accepted/1440)===g.operations.marketDay&&c.reservations.every(r=>g.lots.some(l=>l.id===r.lotId&&l.item==='biscuit'&&!l.held&&l.expiry>c.deadline+region.deliveryMinutes)):c.status==='dispatched'?c.closed===undefined&&g.jobs.filter(j=>j.kind==='delivery'&&j.contractId===c.id&&j.qty===c.qty&&j.price===c.price&&j.credit===c.credit&&j.region===c.region).length===1:int(c.closed!,c.accepted,g.minute))&&
   (c.status!=='delivered'||g.sales.filter(s=>s.contractId===c.id&&s.qty===c.qty&&s.amount===String(BigInt(c.qty)*BigInt(c.price))).length===1);
 })&&g.operations.marketCommitted>=g.contracts.filter(c=>c.status==='reserved').reduce((n,c)=>n+c.qty,0)&&g.market.activeRegions.every(region=>g.market.regionCommitted[region]>=g.contracts.filter(c=>c.status==='reserved'&&c.region===region).reduce((n,c)=>n+c.qty,0));
}

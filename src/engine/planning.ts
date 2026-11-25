import {config,type Material} from '../content/scenario';
import type {Game,Lot} from './game';
export type Reservation={lotId:string;qty:number};
export type WorkPlan={id:string;qty:number;due:number;reservations:Reservation[]};
export function reserved(g:Game,lotId:string){return g.plans.reduce((n,p)=>n+p.reservations.filter(r=>r.lotId===lotId).reduce((s,r)=>s+r.qty,0),0)}
export function freeQuantity(g:Game,l:Lot){return l.held||l.expiry<=g.minute?0:Math.max(0,l.qty-reserved(g,l.id))}
export function reserveRecipe(g:Game,qty:number,due:number){
 const result:Reservation[]=[];
 for(const item of config.materials){let left=config.bom[item]*qty;
  for(const lot of g.lots.filter(l=>l.item===item&&l.expiry>due).sort((a,b)=>a.expiry-b.expiry||a.id.localeCompare(b.id))){const n=Math.min(left,freeQuantity(g,lot));if(n>0){result.push({lotId:lot.id,qty:n});left-=n}if(!left)break}
  if(left)throw Error('Insufficient unreserved '+item+' valid through scheduled start');
 }
 return result;
}
export function reservedMaterial(g:Game,item:Material){return g.lots.filter(l=>l.item===item).reduce((n,l)=>n+reserved(g,l.id),0)}

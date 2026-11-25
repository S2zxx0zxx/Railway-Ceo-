import type {Material} from '../content/scenario';
export type TracePortion={lotId:string;source:string;item:Material|'biscuit';qty:number;expiry:number};
export type BatchRecord={id:string;started:number;completed:number;input:TracePortion[];planned:number;good:number;rejected:number;quality:number;cost:string;materialCost?:string;energyCost?:string;activeMinutes?:number;laborCost?:string;recalled:boolean;reason?:string};
export type WasteRecord={rawGrams:number;packagingPieces:number;finishedPackets:number;rejectedPackets:number;energyPaise:string;processLossGrams:number};
export const emptyWaste=():WasteRecord=>({rawGrams:0,packagingPieces:0,finishedPackets:0,rejectedPackets:0,energyPaise:'0',processLossGrams:0});
export function trackDisposal(w:WasteRecord,item:TracePortion['item'],qty:number){
 if(item==='biscuit')w.finishedPackets+=qty;else if(item==='packaging')w.packagingPieces+=qty;else w.rawGrams+=qty;
}

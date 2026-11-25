/** Pooled carrying value allocation, deterministic integer-paise remainder conservation. */
export type CostLot={id:string;qty:number;cost:string};
export function pooledValue(lots:CostLot[]){return {qty:lots.reduce((n,l)=>n+BigInt(l.qty),0n),cost:lots.reduce((n,l)=>n+BigInt(l.cost),0n)}}
export function averageIssue(lots:CostLot[],qty:number){const pool=pooledValue(lots);if(!Number.isSafeInteger(qty)||qty<=0||BigInt(qty)>pool.qty)throw Error('Invalid inventory issue');return pool.cost*BigInt(qty)/pool.qty}
export function allocatePool(lots:CostLot[],value:bigint){
 const {qty}=pooledValue(lots);if(value<0n||(!qty&&value!==0n))throw Error('Invalid pool value');
 if(!qty)return;
 let cumulative=0n,assigned=0n;
 for(const lot of [...lots].sort((a,b)=>a.id.localeCompare(b.id))){cumulative+=BigInt(lot.qty);const target=value*cumulative/qty;lot.cost=String(target-assigned);assigned=target}
}

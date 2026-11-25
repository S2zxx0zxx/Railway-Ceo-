/**
 * Classical EOQ model. Inputs share one time unit (e.g. years).
 * Original implementation of the published mathematical relation, not a Python port.
 * Reference: Stockpyl eoq.py, Example 3.1 (pinned in RESOURCE_ADOPTION.md).
 */
export function economicOrderQuantity(orderCost:number,holdingCost:number,demand:number){
 if(![orderCost,holdingCost,demand].every(Number.isFinite)||orderCost<0||holdingCost<=0||demand<0)throw Error('Invalid EOQ parameters');
 const quantity=Math.sqrt(2*orderCost*demand/holdingCost);
 const annualCost=Math.sqrt(2*orderCost*demand*holdingCost);
 if(!Number.isFinite(quantity)||!Number.isFinite(annualCost))throw Error('EOQ result outside range');
 return {quantity,annualCost};
}

import {economicOrderQuantity} from './ordering';
import {balance,profit,type Account,type Entry} from './ledger';
import type {Game} from './game';
const sum=(xs:bigint[])=>xs.reduce((a,b)=>a+b,0n);
export function financialReport(g:Game){
 const j=g.journal,b=(a:Account)=>balance(j,a);
 const assets=sum(['cash','raw','wip','finished','equipment','receivable'].map(a=>b(a as Account)));
 const liabilities=-sum(['debt','payroll','payable'].map(a=>b(a as Account)));
 const equity=-b('equity')+profit(j);
 const cashFlow={operating:0n,investing:0n,financing:0n,opening:0n};
 for(const e of j){const delta=sum(e.lines.filter(l=>l.account==='cash').map(l=>BigInt(l.amount)));if(!delta)continue;
 const has=(a:Account)=>e.lines.some(l=>l.account===a);
 const k=e.id==='opening'?'opening':has('equipment')?'investing':has('equity')||has('debt')?'financing':'operating';cashFlow[k]+=delta;
 }
 return {assets,liabilities,equity,balanced:assets===liabilities+equity,cashFlow,revenue:-b('revenue'),cogs:b('cogs'),grossProfit:-b('revenue')-b('cogs'),profit:profit(j)};
}
export function receivableSchedule(g:Game){return g.jobs.filter(j=>j.kind==='collection').map(j=>({id:j.id,due:j.due,amount:BigInt(j.cost)}))}
export function replenishment(g:Game,item:import('../content/scenario').Material){
 const incoming=g.jobs.filter(j=>j.kind==='receipt'&&j.item===item).reduce((s,j)=>s+j.qty,0);
 const available=g.lots.filter(l=>l.item===item&&!l.held&&l.expiry>g.minute).reduce((s,l)=>s+l.qty,0);
 const daily=g.policy.batchSize*config.bom[item],leadDemand=Math.ceil(daily*config.leadMinutes/1440),safety=daily;
 // Indicative classical EOQ, not the manager's binding replenishment quantity.
 const eoq=Math.min(10000000,Math.ceil(economicOrderQuantity(100,config.prices[item]/100*0.2,daily*365).quantity));
 return {available,incoming,leadDemand,safety,reorderPoint:leadDemand+safety,recommended:Math.max(0,daily*g.policy.reorderBatches-available-incoming),eoq};
}
import {config} from '../content/scenario';

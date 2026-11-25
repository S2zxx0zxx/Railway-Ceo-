import {freeQuantity} from './planning';
import {economicOrderQuantity} from './ordering';
import {balance,profit,profitBeforeTax,netRevenue,totalDebt,type Account,type Entry} from './ledger';
import type {Game} from './game';
const sum=(xs:bigint[])=>xs.reduce((a,b)=>a+b,0n);
export function financialReport(g:Game){
 const j=g.journal,b=(a:Account)=>balance(j,a);
 const assets=sum(['cash','raw','wip','finished','equipment','accumulatedDepreciation','receivable'].map(a=>b(a as Account)));
 const liabilities=-sum(['debt','payroll','payable','taxPayable','interestPayable'].map(a=>b(a as Account)));
 const equity=-b('equity')+profit(j);
 const cashFlow={operating:0n,investing:0n,financing:0n,opening:0n};
 for(const e of j){const delta=sum(e.lines.filter(l=>l.account==='cash').map(l=>BigInt(l.amount)));if(!delta)continue;
 const has=(a:Account)=>e.lines.some(l=>l.account===a);
 const k=e.id==='opening'?'opening':has('equipment')?'investing':has('equity')||has('debt')?'financing':'operating';cashFlow[k]+=delta;
 }
 const cashDifference=b('cash')-sum(Object.values(cashFlow));
 return {assets,liabilities,equity,balanced:assets===liabilities+equity,cashFlow,cashDifference,revenue:netRevenue(j),grossRevenue:-b('revenue'),returns:b('returns'),cogs:b('cogs'),grossProfit:netRevenue(j)-b('cogs'),profitBeforeTax:profitBeforeTax(j),profit:profit(j),depreciation:b('depreciation'),accumulatedDepreciation:-b('accumulatedDepreciation'),netEquipment:b('equipment')+b('accumulatedDepreciation'),taxExpense:b('taxExpense'),taxPayable:-b('taxPayable'),interestPayable:-b('interestPayable'),debt:totalDebt(j)};
}
export function receivableSchedule(g:Game){return g.jobs.filter(j=>j.kind==='collection').map(j=>({id:j.id,due:j.due,amount:BigInt(j.cost)}))}
export function replenishment(g:Game,item:import('../content/scenario').Material){
 const incoming=g.jobs.filter(j=>j.kind==='receipt'&&j.item===item).reduce((s,j)=>s+j.qty,0);
 const available=g.lots.filter(l=>l.item===item).reduce((s,l)=>s+freeQuantity(g,l),0);
 const daily=g.policy.batchSize*config.bom[item],leadDemand=Math.ceil(daily*config.leadMinutes/1440),safety=daily;
 // Indicative classical EOQ, not the manager's binding replenishment quantity.
 const eoq=Math.min(10000000,Math.ceil(economicOrderQuantity(100,config.prices[item]/100*0.2,daily*365).quantity));
 return {available,incoming,leadDemand,safety,reorderPoint:leadDemand+safety,recommended:Math.max(0,daily*g.policy.reorderBatches-available-incoming),eoq};
}
import {config} from '../content/scenario';

export function periodIncome(g:Game,from:number,to:number){
 if(!Number.isSafeInteger(from)||!Number.isSafeInteger(to)||from<0||to<from||to>g.minute)throw Error('Invalid reporting period');
 const entries=g.journal.filter(e=>e.minute>=from&&e.minute<=to&&e.id!=='opening'),b=(a:Account)=>balance(entries,a);
 return {grossRevenue:-b('revenue'),returns:b('returns'),netRevenue:netRevenue(entries),cogs:b('cogs'),wages:b('wages'),opex:b('expense'),interest:b('interest'),depreciation:b('depreciation'),loss:b('loss'),tax:b('taxExpense'),beforeTax:profitBeforeTax(entries),netProfit:profit(entries)};
}
export function aging(g:Game,kind:'receivable'|'payable'){
 const invoices=kind==='receivable'?receivableSchedule(g):g.payables.map(p=>({id:p.id,due:p.due,amount:BigInt(p.amount)}));
 const buckets={current:0n,days1to30:0n,days31to60:0n,days61plus:0n};
 for(const i of invoices){const d=Math.ceil((g.minute-i.due)/1440);buckets[d<=0?'current':d<=30?'days1to30':d<=60?'days31to60':'days61plus']+=i.amount}
 return buckets;
}

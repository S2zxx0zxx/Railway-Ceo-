import {describe,it,expect} from 'vitest';
import {initialGame,apply,stock,throughput,demand,scheduledPayroll,type Game,type Command} from '../src/engine/game';
import {balance,money,profit,totalDebt} from '../src/engine/ledger';
import {config,type Difficulty} from '../src/content/scenario';
import {loanSchedule} from '../src/engine/banking';
import {financialReport} from '../src/engine/reports';
import {decodeSave,encodeSave} from '../src/persistence/codec';
function rescue(difficulty:Difficulty){
 let g=apply(initialGame(0,20261125),{type:'takeover',name:'Rescue route',ceo:'CEO',difficulty});const act=(c:Command)=>{g=apply(g,c)},cash=()=>balance(g.journal,'cash'),reserve=money(50000);
 const advance=(n:number)=>{if(n>0)act({type:'advance',minutes:n})};
 for(const item of config.audit)act({type:'audit',item});
 // Rightsize the inherited idle plant without injecting capital; all severance is paid.
 while(g.employees.length>10)act({type:'releaseEmployee',id:g.employees[0].id});
 for(let day=0;day<60&&g.status!=='liquidated';day++){
  const end=(Math.floor(g.minute/1440)+1)*1440;
  // Resolve creditor obligations using existing negotiated extension or actual payments.
  for(const l of g.loans){const due=loanSchedule(l,g.minute).due;if(!due)continue;const need=due-balance(g.journal,'interestPayable'),rupees=Number((need+99n)/100n);if(cash()>=money(rupees)+reserve){if(money(rupees)<=totalDebt(g.journal))act({type:'repay',rupees});else act({type:'settleDebt'})}else if(!l.restructured)act({type:'restructureLoan',id:l.id})}
  for(const p of g.payables)if(cash()>=BigInt(p.amount)+reserve)act({type:'paySupplier',id:p.id});
  if(g.operations.permitUntil-g.minute<=2*1440&&cash()>reserve+money(6000))act({type:'renewPermit'});
  if(g.operations.sanitation<60&&cash()>reserve+money(5000))act({type:'sanitize'});
  const jobs=g.jobs.filter(j=>j.kind==='repair');
  for(let i=0;i<g.machines.length;i++)if(g.machines[i].condition< (day===0?70:55)&&g.machines[i].readyAt===0&&cash()>reserve+money(config.repairCost))act({type:'repair',machine:i});
  if(jobs.length||g.jobs.some(j=>j.kind==='repair'))advance(Math.max(...g.jobs.filter(j=>j.kind==='repair').map(j=>j.due))-g.minute);
  // Price search uses existing deterministic demand, not a parallel market or a free cash source.
  let price=g.price,best=-1;
  for(const p of [900,1200,1500,1800,2100,2400,2700,3000]){
   const candidate=apply(g,{type:'price',price:p}),estimated=(p-650)*demand(candidate);
   if(estimated>best){best=estimated;price=p}
  }
  act({type:'price',price});
  for(const l of g.lots.filter(l=>l.item==='biscuit'&&l.held&&l.quality>=70))act({type:'release',id:l.id});
  const sell=()=>{const qty=Math.min(stock(g,'biscuit'),demand(g));if(qty>0&&g.minute+120<end&&cash()>=BigInt(qty)*30n){act({type:'sell',qty,credit:0});advance(120)}};
  sell();
  const rate=throughput(g),qty=Math.min(demand(g),Math.floor(rate*Math.max(0,end-g.minute-600)/60),5000);
  if(qty>=100&&rate>0&&cash()>reserve+money(Math.ceil(qty*8))){
   for(const item of config.materials){const need=qty*config.bom[item]-stock(g,item);if(need>0)act({type:'purchase',item,qty:need,supplier:'standard'})}
   const arrivals=g.jobs.filter(j=>j.kind==='receipt');if(arrivals.length)advance(Math.max(...arrivals.map(j=>j.due))-g.minute);
   if(g.minute+Math.max(30,Math.ceil(qty/throughput(g)*60))+120+120<end&&throughput(g)>0){act({type:'produce',qty});while(g.jobs.some(j=>j.kind==='batch'&&!j.paused)){const batch=g.jobs.find(j=>j.kind==='batch'&&!j.paused)!;advance(batch.due-g.minute)}for(const l of g.lots.filter(l=>l.item==='biscuit'&&l.held&&l.quality>=70))act({type:'release',id:l.id});sell()}
  }
  // Keep operating reserves, settle accrued payroll including fractional paise when affordable.
  const owed=-balance(g.journal,'payroll'),available=cash()-reserve;
  if(owed>0n&&available>=owed)act({type:'settlePayrollExact'});else if(owed>0n&&available>=100n)act({type:'settlePayroll',rupees:Number((available<owed?available:owed)/100n)});
  advance(end-g.minute);
  const statement=financialReport(g);expect(statement.balanced).toBe(true);expect(statement.cashDifference).toBe(0n);expect(cash()).toBeGreaterThanOrEqual(0n);
  if(g.status==='stable')break;
 }
 return g;
}
describe('G12 command-only recovery viability',()=>{
 for(const difficulty of config.difficulties)it('recovers '+difficulty+' with actual business commands',()=>{
  const g=rescue(difficulty),report={difficulty,status:g.status,day:g.minute/1440,sold:g.sold,cash:String(balance(g.journal,'cash')),profit:String(profit(g.journal)),payroll:String(-balance(g.journal,'payroll')),debt:String(totalDebt(g.journal)),badDays:g.distressDays};
  console.log('G12 rescue evidence '+JSON.stringify(report));
  expect(decodeSave(encodeSave(g))).toEqual(g);expect(g.status,JSON.stringify(report)).toBe('stable');expect(g.sold).toBeGreaterThanOrEqual(5000);expect(profit(g.journal)).toBeGreaterThan(0n);
 },120000);
});

import {reserveFinished,cancelContract,validContracts,type BuyerContract} from './contracts';
import {departments,newManagement,rollManagement,commandDepartment,validAuthority,validDelegated,validManagement,managerRisk,type Department,type Authority,type Management,type DelegatedCommand,type ManagerLog} from './managers';
import {newGovernance,migrateGovernance,validGovernance,crisisDetails,validCrisisDetails,type Governance,type Decision,type CrisisDetails,type CrisisKind} from './governance';
import {newRescue,transition,distressSignals,updateRescue,updateMilestones,migrateRescue,validRescue,type RescueState} from './rescue';
import {initialMarket,marketView,closeMarketDay,validMarket,validEconomy,updateEconomicConditions,activeCampaign,regionInfo,regionAvailability,validRegionalCommitments,type MarketState,type RegionId} from './market';
import type {PurchaseRecord,ServiceRecord,UtilityState} from './operations';
import {emptyWaste,trackDisposal,type BatchRecord,type TracePortion,type WasteRecord} from './traceability';
import {reserved,freeQuantity,reserveRecipe,type WorkPlan,type Reservation} from './planning';
import {pooledValue,averageIssue,allocatePool} from './costing';
import {makeLoan,loanSchedule,allocatePrincipal,type Loan} from './banking';
import {depreciationForDay,taxForPeriod} from './finance';
import {planElapsedTime} from './elapsed';
import {config,type Material,type Difficulty,type SupplierId} from '../content/scenario';
import {balance,post,transfer,money,profit,netRevenue,totalDebt,type Entry} from './ledger';
export type Lot={id:string;item:Material|'biscuit';qty:number;cost:string;expiry:number;held:boolean;quality:number;source:string};
export type Machine={name:string;condition:number;readyAt:number;level:1|2|3;lastService:number};
export type Employee={id:string;name:string;skill:number;morale:number;wage:number;role:'operator'|'manager';shiftHours:8|10|12;fatigue:number;present:boolean;safetyTrained:boolean;grade:1|2|3};
export type Job={id:string;kind:'receipt'|'batch'|'delivery'|'collection'|'repair'|'research';due:number;qty:number;cost:string;item?:Material;machine?:number;stage?:number;price?:number;credit?:number;quality?:number;source?:string;upgrade?:boolean;paused?:boolean;remainingMinutes?:number;trace?:TracePortion[];started?:number;serviceCost?:string;materialCost?:string;energyCost?:string;activeMinutes?:number;laborRate?:string;laborCost?:string;region?:RegionId;contractId?:string;researchTrack?:'quality'|'shelfLife'};
export type DeliveredSale={id:string;qty:number;amount:string;delivered:number;status:'receivable'|'paid'|'refunded';complaint:'none'|'open'|'closed';reason?:'damaged'|'late'|'quality';trace?:TracePortion[];recalled?:boolean;region?:RegionId;contractId?:string};
export type SupplierPayable={id:string;source:string;amount:string;due:number};
export type ManagerPolicy={reorderBatches:number;batchSize:number;minCash:number;minMargin:number};
export type Crisis={id:string;kind:CrisisKind;opened:number;resolved:boolean;details:CrisisDetails};
export type Operations={permitUntil:number;sanitation:number;rejected:number;discarded:number;marketDay:number;marketCommitted:number};
const initialOps=():Operations=>({permitUntil:30*1440,sanitation:80,rejected:0,discarded:0,marketDay:0,marketCommitted:0});
export type Game={schema:1;financeStart:number;productionPayroll:{day:number;allocated:string};governance:Governance;rescue:RescueState;market:MarketState;plans:WorkPlan[];batches:BatchRecord[];waste:WasteRecord;purchases:PurchaseRecord[];serviceHistory:ServiceRecord[];utilities:UtilityState;loans:Loan[];operations:Operations;payables:SupplierPayable[];sales:DeliveredSale[];contracts:BuyerContract[];policy:ManagerPolicy;management:Management;crises:Crisis[];competitorPrice:number;distressDays:number;status:'distressed'|'recovering'|'stable'|'liquidated';revision:number;minute:number;seed:number;next:number;name:string;brand:string;ceo:string;difficulty:Difficulty;accepted:boolean;audit:string[];journal:Entry[];lots:Lot[];machines:Machine[];employees:Employee[];jobs:Job[];price:number;reputation:number;research:number;researchTracks:{quality:number;shelfLife:number};campaignUntil:number;manager:boolean;produced:number;sold:number;news:string[];history:{day:number;revenue:string;profit:string}[];wall:number;speed:number};
export type Command=
 | {type:'takeover';name:string;ceo:string;difficulty:Difficulty}
 | {type:'audit';item:string}
 | {type:'identity';name:string;brand:string}
 | {type:'purchase';item:Material;qty:number;supplier?:SupplierId;creditDays?:number}
 | {type:'cancelPurchase';id:string}
 | {type:'paySupplier';id:string}
 | {type:'complaint';id:string;reason:'damaged'|'late'|'quality'}
 | {type:'refundSale';id:string}
 | {type:'closeComplaint';id:string}
 | {type:'repair';machine:number}
 | {type:'upgradeMachine';machine:number}
 | {type:'cancelBatch';id:string}
 | {type:'renewPermit'}
 | {type:'setUtility';utility:'power'|'water';enabled:boolean}
 | {type:'sanitize'}
 | {type:'discard';id:string}
 | {type:'produce';qty:number}
 | {type:'planBatch';qty:number;delay:number}
 | {type:'cancelPlan';id:string}
 | {type:'pauseBatch';id:string}
 | {type:'resumeBatch';id:string}
 | {type:'release';id:string}
 | {type:'holdLot';id:string}
 | {type:'inspectMaterial';id:string}
 | {type:'recallBatch';id:string;reason:string}
 | {type:'sell';qty:number;credit:number;region?:RegionId}
 | {type:'reserveSale';qty:number;credit:number;region:RegionId}
 | {type:'dispatchContract';id:string}
 | {type:'cancelContract';id:string}
 | {type:'price';price:number}
 | {type:'expandRegion';region:RegionId}
 | {type:'hire';role:'operator'|'manager'}
 | {type:'settlePayroll';rupees:number}
 | {type:'settlePayrollExact'}
 | {type:'repay';rupees:number}
 | {type:'settleDebt'}
 | {type:'payTax';rupees:number}
 | {type:'settleTax'}
 | {type:'restructureLoan';id:string}
 | {type:'loan';rupees:number}
 | {type:'campaign';budget?:number;days?:number}
 | {type:'stopCampaign'}
 | {type:'research'}
 | {type:'researchTrack';track:'quality'|'shelfLife'}
 | {type:'pauseResearch'|'resumeResearch'|'cancelResearch';id:string}
 | {type:'automation';enabled:boolean}
 | {type:'assignManager';authority:Authority}
 | {type:'unassignManager';employeeId:string}
 | {type:'managerLimits';dailyLimit:number;repairBelow:number}
 | {type:'managerApproval';id:string;approve:boolean}
 | {type:'managerStop'}
 | {type:'policy';policy:ManagerPolicy}
 | {type:'train';id:string}
 | {type:'shift';id:string;hours:8|10|12}
 | {type:'safetyTraining';id:string}
 | {type:'promote';id:string}
 | {type:'releaseEmployee';id:string}
 | {type:'resolveCrisis';id:string}
 | {type:'capital';rupees:number}
 | {type:'beginnerAssistance'}
 | {type:'restartCompany'}
 | {type:'extendSupplier';id:string}
 | {type:'salvageMaterial';item:Material;qty:number}
 | {type:'ackCrisis';id:string}
 | {type:'advance';minutes:number}
 | {type:'speed';value:number};
const clone=<T>(x:T):T=>structuredClone(x);
const id=(g:Game)=>'e'+g.next++;
function check(ok:unknown,msg:string):asserts ok {if(!ok)throw Error(msg)}
function positive(n:number,max=1_000_000){check(Number.isSafeInteger(n)&&n>0&&n<=max,'Quantity outside allowed range')}
function cash(g:Game){return balance(g.journal,'cash')}
function canPay(g:Game,v:bigint){check(v>0n&&cash(g)>=v,'Insufficient operating cash')}
function spend(g:Game,account:'expense'|'raw'|'wip',v:bigint,description:string){canPay(g,v);transfer(g.journal,id(g),g.minute,description,account,'cash',v)}
function decision(g:Game,kind:Decision['kind'],detail:string,amount=0n){g.governance.decisions.push({id:id(g),minute:g.minute,kind,detail,amount:String(amount)})}
function note(g:Game,s:string){g.news.unshift('Day '+(Math.floor(g.minute/1440)+1)+': '+s);g.news=g.news.slice(0,100)}
function rng(g:Game){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
export function initialGame(wall=0,seed=20261125):Game{
 const g:Game={schema:1,financeStart:0,productionPayroll:{day:0,allocated:'0'},governance:newGovernance(wall,seed),rescue:newRescue(),market:initialMarket(),plans:[],batches:[],waste:emptyWaste(),purchases:[],serviceHistory:[],utilities:{power:true,water:true},loans:[makeLoan('inherited-loan',money(config.debt),0)],operations:initialOps(),payables:[],sales:[],contracts:[],policy:{reorderBatches:2,batchSize:1000,minCash:50000,minMargin:100},management:newManagement(),crises:[],competitorPrice:900,distressDays:0,status:'distressed',revision:0,minute:0,seed:seed>>>0,next:1,name:'Distressed Biscuit Industries',brand:'Plain Biscuit',ceo:'CEO',difficulty:'Realistic',accepted:false,audit:[],journal:[],lots:[],machines:config.machineNames.map((name,i)=>({name,condition:config.initialConditions[i],readyAt:0,level:1 as const,lastService:0})),employees:Array.from({length:24},(_,i)=>({id:'staff-'+i,name:'Employee '+(i+1),skill:65+i%20,morale:42,wage:config.wagePerDay,role:'operator',shiftHours:8,fatigue:0,present:true,safetyTrained:false,grade:1})),jobs:[],price:config.initialPrice,reputation:12,research:0,researchTracks:{quality:0,shelfLife:0},campaignUntil:0,manager:false,produced:0,sold:0,news:['Take over the distressed company to begin.'],history:[],wall,speed:0};
 const cash=money(config.cash),equipment=money(config.equipment),debt=money(config.debt),payroll=money(config.arrears);
 post(g.journal,'opening',0,'Inherited assets and liabilities',[{account:'cash',amount:String(cash)},{account:'equipment',amount:String(equipment)},{account:'debt',amount:String(-debt)},{account:'payroll',amount:String(-payroll)},{account:'equity',amount:String(debt+payroll-cash-equipment)}]);
 return g;
}
export function stock(g:Game,item:Lot['item']){return g.lots.filter(l=>l.item===item).reduce((s,l)=>s+freeQuantity(g,l),0)}
function take(g:Game,item:Lot['item'],qty:number,allocation?:Reservation[]):{cost:bigint;quality:number;trace:TracePortion[]}{
 positive(qty,100_000_000);check(stock(g,item)>=qty,'Insufficient available '+item);
 const pool=g.lots.filter(l=>l.item===item),value=pooledValue(pool).cost,total=averageIssue(pool,qty);let remaining=qty,quality=0;const trace:TracePortion[]=[];
 for(const l of g.lots.filter(l=>l.item===item&&!l.held&&l.expiry>g.minute).sort((a,b)=>a.expiry-b.expiry||a.id.localeCompare(b.id))){
  if(!remaining)break;
  const n=Math.min(remaining,allocation?allocation.filter(r=>r.lotId===l.id).reduce((s,r)=>s+r.qty,0):freeQuantity(g,l));
  if(n>0)trace.push({lotId:l.id,source:l.source,item:l.item,qty:n,expiry:l.expiry});quality+=n*l.quality;l.qty-=n;remaining-=n;
 }
 check(remaining===0,'Incomplete material issue');g.lots=g.lots.filter(l=>l.qty>0);allocatePool(g.lots.filter(l=>l.item===item),value-total);return {cost:total,quality:Math.floor(quality/qty),trace};
}
export function supplierQuote(item:Material,qty:number,supplier:SupplierId='standard',g?:Game){const offer=config.suppliers.find(s=>s.id===supplier);check(offer,'Unknown supplier');positive(qty,10000000);const index=g?.market.commodity[item]??100;return {...offer,index,cost:(BigInt(qty)*BigInt(config.prices[item])*BigInt(offer.pricePercent)*BigInt(index)+9999n)/10000n}}
export function marketDemand(g:Game){return marketView(g).player}
export function demand(g:Game){return marketView(g).available}
/** Overtime is 1.5 times the base hourly wage, rounded up to whole paise. */
export function employeeDailyPay(e:Employee):bigint{if(!e.present)return 0n;const base=money(e.wage);return base+(base*BigInt(e.shiftHours-8)*3n+15n)/16n}
export function scheduledPayroll(g:Game):bigint{return g.employees.reduce((n,e)=>n+employeeDailyPay(e),0n)}
export function laborAvailability(g:Game){const staff=g.employees.filter(e=>e.role==='operator'&&e.present&&e.fatigue<90);const effective=staff.reduce((n,e)=>n+Math.min(1.5,e.shiftHours/8)*(0.8+e.skill/500)*(1-e.fatigue/200)*(0.9+e.morale/1000),0);return {present:staff.length,effective,factor:Math.min(1,effective/12)}}
export function throughput(g:Game){if(!g.utilities.power||!g.utilities.water||g.operations.permitUntil<=g.minute||g.operations.sanitation<40)return 0;if(g.machines.some(m=>m.condition<40||m.readyAt>g.minute)||!g.employees.some(e=>e.role==='operator'))return 0;return Math.floor(config.capacity*Math.min(...g.machines.map(m=>m.condition*(1+(m.level-1)*0.15)))/100*laborAvailability(g).factor)}
function addLot(g:Game,item:Lot['item'],qty:number,cost:bigint,held=false,quality=90,source='opening'){if(qty>0){g.lots.push({id:id(g),item,qty,cost:String(cost),held,quality,source,expiry:g.minute+(item==='biscuit'?config.finishedShelfMinutes+g.researchTracks.shelfLife*config.researchProjects.shelfLife.bonusMinutes:config.shelfMinutes)});const pool=g.lots.filter(l=>l.item===item);allocatePool(pool,pooledValue(pool).cost)}}
function enqueue(g:Game,job:Omit<Job,'id'>){g.jobs.push({...job,id:id(g)})}
/** Allocate fixed batch-start operator wage rate over actual active game minutes. Post only at domain boundaries, not arbitrary worker chunks. */
function recognizeBatchLabor(g:Game,j:Job){
 if(j.kind!=='batch'||j.laborRate===undefined||j.activeMinutes===undefined)return;
 const target=BigInt(j.laborRate)*BigInt(j.activeMinutes)/1440n,delta=target-BigInt(j.laborCost??'0');
 check(delta>=0n,'Invalid accumulated batch labor');if(!delta)return;
 transfer(g.journal,id(g),g.minute,'Batch labor accrued','wip','payroll',delta);j.laborCost=String(target);j.cost=String(BigInt(j.cost)+delta);g.productionPayroll.allocated=String(BigInt(g.productionPayroll.allocated)+delta);
}
function runJob(g:Game,j:Job){
 recognizeBatchLabor(g,j);
 const cost=BigInt(j.cost);
 switch(j.kind){
 case 'receipt':{const credit=j.credit??0;addLot(g,j.item!,j.qty,cost,(j.quality??90)<config.manufacturing.incomingQualityMin,j.quality??90,j.source??j.id);if(cost>0n){transfer(g.journal,id(g),g.minute,'Materials received','raw',credit?'payable':'wip',cost);if(credit)g.payables.push({id:id(g),source:j.source??'supplier',amount:String(cost),due:g.minute+credit*1440})}const order=g.purchases.find(p=>p.id===j.id);if(order){const received=g.lots[g.lots.length-1];order.status=received.held?'held':'accepted';order.closed=g.minute;order.lotId=received.id;}note(g,'Received '+j.qty+' '+j.item);break;}
 case 'repair':{const m=g.machines[j.machine!];m.condition=95;m.readyAt=0;m.lastService=g.minute;if(j.upgrade){check(m.level<3,'Upgrade exceeds machine level');m.level=(m.level+1) as Machine['level']}if(j.started!==undefined&&j.serviceCost!==undefined)g.serviceHistory.push({id:j.id,machine:j.machine!,kind:j.upgrade?'upgrade':'service',cost:j.serviceCost,started:j.started,completed:g.minute});note(g,m.name+(j.upgrade?' upgrade installed':' serviced'));break}
 case 'batch':{
  if(throughput(g)<=0||g.status==='liquidated'){g.jobs.push({...j,paused:true,remainingMinutes:30});note(g,'Production interrupted; restore operating conditions and resume');break}
  if((j.stage??0)<4){enqueue(g,{...j,stage:(j.stage??0)+1,due:g.minute+30});break}
  const inputQuality=j.quality??90,condition=Math.min(...g.machines.map(m=>m.condition));const quality=Math.max(0,Math.min(100,Math.floor(inputQuality*0.65+condition*0.2+g.operations.sanitation*0.15+g.research+g.researchTracks.quality*config.researchProjects.quality.bonus)));const rejected=Math.min(j.qty,Math.floor(j.qty*(0.02+(1-condition/100)*0.08+(100-inputQuality)*0.001)));
  const good=j.qty-rejected,goodCost=cost*BigInt(good)/BigInt(j.qty);
  if(goodCost>0n)transfer(g.journal,id(g),g.minute,'Completed batch','finished','wip',goodCost);
  if(cost>goodCost)transfer(g.journal,id(g),g.minute,'Rejected output','loss','wip',cost-goodCost);
  const batchId=j.source??j.id;
  addLot(g,'biscuit',good,goodCost,true,quality,batchId);if(j.trace&&j.started!==undefined){g.batches.push({id:batchId,started:j.started,completed:g.minute,input:j.trace,planned:j.qty,good,rejected,quality,cost:j.cost,...(j.materialCost!==undefined?{materialCost:j.materialCost,energyCost:j.energyCost,activeMinutes:j.activeMinutes,...(j.laborCost!==undefined?{laborCost:j.laborCost}:{})}:{}),recalled:false});g.waste.rejectedPackets+=rejected;const grams=(config.bom.flour+config.bom.sugar+config.bom.oil);g.waste.processLossGrams+=(grams-config.manufacturing.packetGrams)*j.qty+config.manufacturing.packetGrams*rejected;}g.produced+=good;g.operations.rejected+=rejected;g.operations.sanitation=Math.max(0,g.operations.sanitation-Math.max(1,Math.ceil(j.qty/2500)));
  for(const m of g.machines)m.condition=Math.max(0,m.condition-1-Math.floor(rng(g)*2)-(g.minute-m.lastService>7*1440?1:0));
  note(g,'Batch completed; '+good+' packets awaiting quality release');break}
 case 'delivery':{
  const contract=g.contracts.find(c=>c.id===j.contractId);
  if(j.trace?.some(t=>t.expiry<=g.minute||g.batches.some(b=>b.id===t.source&&b.recalled))){if(cost>0n)transfer(g.journal,id(g),g.minute,'Unsafe shipment write-off','loss','wip',cost);g.waste.finishedPackets+=j.qty;g.operations.discarded+=j.qty;if(contract){contract.status='failed';contract.closed=g.minute}note(g,'Shipment canceled: expired or recalled goods');break}
  const sales=BigInt(j.qty)*BigInt(j.price!);transfer(g.journal,id(g),g.minute,'Delivery revenue','receivable','revenue',sales);
  if(cost>0n)transfer(g.journal,id(g),g.minute,'Cost of delivered goods','cogs','wip',cost);
  g.sold+=j.qty;g.reputation=Math.min(100,g.reputation+1);
  const sale:DeliveredSale={id:id(g),qty:j.qty,amount:String(sales),delivered:g.minute,status:j.credit===0?'paid':'receivable',complaint:'none',...(j.trace?{trace:j.trace}:{}),...(j.region?{region:j.region}:{}),...(j.contractId?{contractId:j.contractId}:{})};g.sales.push(sale);if(contract){contract.status='delivered';contract.closed=g.minute}
  if(j.credit===0)transfer(g.journal,id(g),g.minute,'Immediate payment','cash','receivable',sales);
  else enqueue(g,{kind:'collection',qty:j.qty,cost:String(sales),source:sale.id,due:g.minute+j.credit!*1440});
  note(g,'Delivered '+j.qty+' packets');break}
 case 'collection':{const sale=g.sales.find(s=>s.id===j.source);if(sale)check(sale.status==='receivable','Invoice already settled');transfer(g.journal,id(g),g.minute,'Invoice collected','cash','receivable',cost);if(sale)sale.status='paid';break}
 case 'research':if(j.researchTrack){g.researchTracks[j.researchTrack]++;note(g,j.researchTrack+' research completed')}else{g.research++;note(g,'Efficiency research completed')}break;
 }
}
function expire(g:Game){for(const c of g.contracts.filter(c=>c.status==='reserved'&&c.deadline<=g.minute)){cancelContract(g,c,'expired');note(g,'Buyer reservation expired: '+c.id)}for(const l of g.lots.filter(l=>l.expiry<=g.minute)){const c=BigInt(l.cost);if(c>0n)transfer(g.journal,id(g),g.minute,'Expired inventory','loss',l.item==='biscuit'?'finished':'raw',c);trackDisposal(g.waste,l.item,l.qty);if(l.item==='biscuit')g.operations.discarded+=l.qty;note(g,'Expired '+l.item+' stock');}g.lots=g.lots.filter(l=>l.expiry>g.minute)}
function alert(g:Game,kind:Crisis['kind'],message:string){if(!g.crises.some(c=>c.kind===kind&&(!c.resolved||g.minute-(c.details.closed??c.opened)<1440))){g.crises.push({id:id(g),kind,opened:g.minute,resolved:false,details:crisisDetails(kind,g.minute,g.difficulty,message)});note(g,message)}}
function crisisResolved(g:Game,c:Crisis){switch(c.kind){case 'compliance':return g.operations.permitUntil>g.minute;case 'safety':return g.operations.sanitation>=40&&g.employees.every(e=>e.fatigue<70||e.safetyTrained);case 'machine':return g.machines.every(m=>m.condition>=40);case 'payroll':return -balance(g.journal,'payroll')<=money(config.arrears);case 'liquidity':return !distressSignals(g,scheduledPayroll(g)).bad;case 'supplier':return !g.payables.some(p=>p.due<g.minute);case 'creditor':return !g.loans.some(l=>loanSchedule(l,g.minute).due>0n);case 'quality':return !g.sales.some(s=>s.recalled&&s.complaint==='open');case 'external':return !g.market.shock}}
function reviewCrises(g:Game){for(const c of g.crises){if(!c.resolved&&!c.details.penaltyApplied&&g.minute>=c.details.deadline){c.details.penaltyApplied=true;if(!crisisResolved(g,c)){g.reputation=Math.max(0,g.reputation-(c.details.severity==='critical'?3:1));note(g,'Missed '+c.kind+' response deadline; reputation reduced')}}}}
function daily(g:Game){
 const previousShock=g.market.shock?.day;closeMarketDay(g,Math.floor(g.minute/1440),()=>rng(g));updateEconomicConditions(g,()=>rng(g));if(g.market.shock&&g.market.shock.day!==previousShock){note(g,'Market event: '+g.market.shock.kind+' for three game days');alert(g,'external','Economic shock: '+g.market.shock.kind)}g.operations.marketDay=Math.floor(g.minute/1440);g.operations.marketCommitted=0;
 if(g.loans.some(l=>loanSchedule(l,g.minute).due>0n)&&g.minute% (30*1440)===0)note(g,'Bank notice: scheduled principal overdue');
 if(g.operations.permitUntil<=g.minute)alert(g,'compliance','Operating permit expired; production suspended');
 if(g.operations.sanitation<40)alert(g,'safety','Factory sanitation below safe limit');
 const wages=scheduledPayroll(g),allocated=BigInt(g.productionPayroll.allocated),residual=wages>allocated?wages-allocated:0n;if(residual>0n)transfer(g.journal,id(g),g.minute,'Daily wages','wages','payroll',residual);g.productionPayroll={day:Math.floor(g.minute/1440),allocated:'0'};
 const debt=-balance(g.journal,'debt');const interest=debt*BigInt(config.dailyInterestBps)/10000n;
 if(interest>0n)transfer(g.journal,id(g),g.minute,'Daily interest','interest','interestPayable',interest);
 const depreciation=depreciationForDay(g.journal,g.minute,g.financeStart);if(depreciation>0n)transfer(g.journal,id(g),g.minute,'Daily depreciation','depreciation','accumulatedDepreciation',depreciation);
 const tax=taxForPeriod(g.journal,g.minute,g.financeStart);if(tax>0n)transfer(g.journal,id(g),g.minute,'Period tax assessment','taxExpense','taxPayable',tax);
 if(-balance(g.journal,'payroll')>money(config.arrears))for(const e of g.employees)e.morale=Math.max(0,e.morale-1);
 for(const e of g.employees){e.fatigue=Math.max(0,Math.min(100,e.fatigue+(e.present?(e.shiftHours-8)*6-8:-24)));e.present=e.fatigue<80;}
 if(g.employees.some(e=>e.fatigue>=70&&!e.safetyTrained))alert(g,'safety','Fatigue risk: reduce shifts and train staff');
 if(distressSignals(g,wages).bad)alert(g,'liquidity','Liquidity warning: payroll or creditor funding at risk');
 if(-balance(g.journal,'payroll')>money(config.arrears*2))alert(g,'payroll','Payroll arrears threaten operations');
 if(g.machines.some(m=>m.condition<40))alert(g,'machine','Machinery condition is below safe operating limits');
 
 if(g.payables.some(p=>p.due<g.minute))alert(g,'supplier','Supplier invoice overdue');
 if(g.loans.some(l=>loanSchedule(l,g.minute).due>0n))alert(g,'creditor','Scheduled bank principal due');
 if(g.sales.some(s=>s.recalled&&s.complaint==='open'))alert(g,'quality','Recalled goods require customer resolution');
 const previous=g.rescue.phase;updateRescue(g,wages);if(previous!==g.rescue.phase)note(g,'Rescue status: '+g.rescue.phase);
 g.history.push({day:g.minute/1440,revenue:String(netRevenue(g.journal)),profit:String(profit(g.journal))});
}
function startBatch(g:Game,qty:number,allocation?:Reservation[]){
 positive(qty,10000);check(g.audit.length===config.audit.length,'Complete company audit');const rate=throughput(g);check(rate>0&&!g.jobs.some(j=>j.kind==='batch'),'Production line unavailable');
 check(g.lots.filter(l=>l.item==='biscuit').reduce((n,l)=>n+l.qty,0)+g.plans.reduce((n,p)=>n+p.qty,0)+qty<=config.finishedCapacity,'Finished goods capacity exceeded');
 const energy=BigInt(qty)*BigInt(Math.max(15,50-g.research*5));canPay(g,energy);let cost=0n,quality=100;const trace:TracePortion[]=[];
 for(const item of config.materials){const consumed=take(g,item,config.bom[item]*qty,allocation);cost+=consumed.cost;quality=Math.min(quality,consumed.quality);trace.push(...consumed.trace)}
 if(cost>0n)transfer(g.journal,id(g),g.minute,'Materials issued','wip','raw',cost);
 spend(g,'wip',energy,'Batch energy');g.waste.energyPaise=String(BigInt(g.waste.energyPaise)+energy);enqueue(g,{kind:'batch',stage:0,qty,cost:String(cost+energy),quality,trace,started:g.minute,materialCost:String(cost),energyCost:String(energy),activeMinutes:0,laborRate:String(g.employees.filter(e=>e.role==='operator').reduce((n,e)=>n+employeeDailyPay(e),0n)),laborCost:'0',source:'batch-'+g.next,due:g.minute+Math.max(30,Math.ceil(qty/rate*60))});
}
function startDuePlans(g:Game){
 for(const plan of g.plans.filter(p=>p.due<=g.minute).sort((a,b)=>a.due-b.due||a.id.localeCompare(b.id))){
  if(g.status==='liquidated'){g.plans=g.plans.filter(p=>p.id!==plan.id);continue}
  const next=clone(g);next.plans=next.plans.filter(p=>p.id!==plan.id);
  try{startBatch(next,plan.qty,plan.reservations);Object.assign(g,next);note(g,'Scheduled batch started: '+plan.id)}
  catch{g.plans=g.plans.filter(p=>p.id!==plan.id);note(g,'Scheduled batch canceled: resources or operating conditions unavailable ('+plan.id+')')}
 }
}
function pauseUnsafe(g:Game){if(throughput(g)>0&&g.status!=='liquidated')return;for(const j of g.jobs.filter(j=>j.kind==='batch'&&!j.paused)){recognizeBatchLabor(g,j);j.remainingMinutes=Math.max(1,j.due-g.minute);j.paused=true;note(g,'Batch paused: operating conditions unavailable')}}
export function advanceInPlace(g:Game,minutes:number){
 positive(minutes,config.offlineCapMinutes*60);const end=g.minute+minutes;
 while(g.minute<end){const nextDay=(Math.floor(g.minute/1440)+1)*1440;
  let due=Math.min(g.operations.permitUntil>g.minute?g.operations.permitUntil:Infinity,nextDay,end);
  for(const j of g.jobs)if(!j.paused)due=Math.min(due,j.due);
  for(const p of g.plans)due=Math.min(due,p.due);
  for(const c of g.contracts)if(c.status==='reserved')due=Math.min(due,c.deadline);
  for(const c of g.crises)if(!c.resolved&&!c.details.penaltyApplied&&c.details.deadline>g.minute)due=Math.min(due,c.details.deadline);
  for(const l of g.lots)due=Math.min(due,l.expiry);
  check(due>g.minute,'Invalid scheduler state');for(const j of g.jobs.filter(j=>j.kind==='batch'&&!j.paused&&j.activeMinutes!==undefined))j.activeMinutes!+=due-g.minute;g.minute=due;expire(g);if(due===nextDay){for(const j of g.jobs)recognizeBatchLabor(g,j);daily(g)}
  const ready=g.jobs.filter(j=>!j.paused&&j.due===due).sort((a,b)=>a.id.localeCompare(b.id));g.jobs=g.jobs.filter(j=>j.paused||j.due!==due);
  for(const j of ready)runJob(g,j);
  startDuePlans(g);
  reviewCrises(g);
  pauseUnsafe(g);
  if(due===nextDay){for(const a of g.management.approvals)managerLog(g,a.department,a.command.type,'rejected','Request expired at next game day',0n,a.employeeId);rollManagement(g);if(g.manager&&g.status!=='liquidated')automate(g)}
  if(g.manager&&(managerRisk(g)||cash(g)<money(g.policy.minCash)))stopManagers(g,managerRisk(g)??'Cash reserve reached');
  if(g.accepted)updateMilestones(g);
  if(g.status==='liquidated'){g.speed=0;g.manager=false;g.management.approvals=[];g.management.halted='Company liquidated';note(g,'Operations frozen. Existing assets and obligations remain recorded.');break}
 }
}
export function apply(source:Game,cmd:Command):Game{
 if(cmd.type==='restartCompany'){check(source.accepted&&source.status==='liquidated','Only a liquidated company can restart');const fresh=initialGame(source.wall,(source.seed+2654435761)>>>0);fresh.revision=source.revision+1;assertState(fresh);return fresh}
 const g=clone(source);
 if(cmd.type==='takeover'){check(!g.accepted,'Already acquired');check(cmd.name.trim().length>0&&cmd.name.length<=60&&cmd.ceo.trim().length>0&&cmd.ceo.length<=60&&config.difficulties.includes(cmd.difficulty),'Invalid company identity');g.name=cmd.name.trim();g.ceo=cmd.ceo.trim();g.difficulty=cmd.difficulty;g.market=initialMarket(Math.floor(g.minute/1440),cmd.difficulty);g.accepted=true;decision(g,'takeover','Owner accepted inherited assets and liabilities');note(g,'Takeover completed')}
 else{
 check(g.accepted,'Accept takeover first');
 check(g.status!=='liquidated'||cmd.type==='speed'&&cmd.value===0,'Company has been liquidated');
 switch(cmd.type){
 case 'identity':{const name=cmd.name.trim(),brand=cmd.brand.trim();check(name.length>0&&name.length<=60&&brand.length>0&&brand.length<=60,'Invalid company or brand name');check(name!==g.name||brand!==g.brand,'Identity unchanged');g.name=name;g.brand=brand;decision(g,'identity','Company and brand identity approved');note(g,'Owner approved company identity update');break}
 case 'audit':check(config.audit.some(x=>x===cmd.item),'Invalid audit item');if(!g.audit.includes(cmd.item))g.audit.push(cmd.item);break;
 case 'purchase':{check(config.materials.includes(cmd.item),'Invalid material');const offer=supplierQuote(cmd.item,cmd.qty,cmd.supplier,g);const terms=config.manufacturing.supplierLimits[offer.id];check(cmd.qty>=terms.minimum&&cmd.qty<=terms.maxOrder,'Warehouse capacity or supplier order quantity outside limits');check(g.jobs.filter(j=>j.kind==='receipt'&&j.source===offer.id).reduce((n,j)=>n+j.qty,0)+cmd.qty<=terms.inTransitCapacity,'Supplier capacity exceeded');const reserved=g.lots.filter(l=>l.item===cmd.item).reduce((n,l)=>n+l.qty,0)+g.jobs.filter(j=>j.kind==='receipt'&&j.item===cmd.item).reduce((n,j)=>n+j.qty,0);check(reserved+cmd.qty<=config.rawCapacityPerItem,'Warehouse capacity exceeded');const credit=cmd.creditDays??0;check([0,7,15].includes(credit),'Invalid supplier terms');if(credit){check(offer.id!=='economy','Supplier requires prepayment');const committed=g.jobs.filter(j=>j.kind==='receipt'&&(j.credit??0)>0).reduce((n,j)=>n+BigInt(j.cost),0n);check(!g.payables.some(p=>p.due<g.minute)&&committed-balance(g.journal,'payable')+offer.cost<=money(100000),'Supplier credit limit or overdue invoice')}else spend(g,'wip',offer.cost,'Prepaid material order');const delay=(offer.reliability<100&&rng(g)*100>=offer.reliability?120:0)+(g.market.shock?.kind==='shortage'?120:0);enqueue(g,{kind:'receipt',item:cmd.item,qty:cmd.qty,cost:String(offer.cost),due:g.minute+offer.leadMinutes+delay,quality:offer.quality,source:offer.id,credit});const job=g.jobs[g.jobs.length-1];g.purchases.push({id:job.id,item:cmd.item,supplier:offer.id,qty:cmd.qty,cost:String(offer.cost),placed:g.minute,due:job.due,credit,status:'inTransit'});break}
 case 'cancelPurchase':{const j=g.jobs.find(j=>j.id===cmd.id&&j.kind==='receipt');check(j,'Pending purchase not found');if(!(j.credit??0)&&BigInt(j.cost)>0n)transfer(g.journal,id(g),g.minute,'Canceled prepaid purchase','cash','wip',BigInt(j.cost));g.jobs=g.jobs.filter(x=>x.id!==j.id);const order=g.purchases.find(p=>p.id===j.id);if(order){order.status='canceled';order.closed=g.minute}note(g,'Purchase canceled: '+j.id);break}
 case 'paySupplier':{const invoice=g.payables.find(p=>p.id===cmd.id);check(invoice,'Supplier invoice not found');const v=BigInt(invoice.amount);canPay(g,v);transfer(g.journal,id(g),g.minute,'Supplier invoice paid','payable','cash',v);g.payables=g.payables.filter(p=>p.id!==invoice.id);note(g,'Supplier invoice settled');break}
 case 'repair':{const m=g.machines[cmd.machine];check(m&&m.readyAt===0&&!g.jobs.some(j=>j.kind==='batch'&&!j.paused),'Repair unavailable');check(m.condition<95||g.minute-m.lastService>=7*1440,'Machine already serviced');spend(g,'expense',money(config.repairCost),'Machine repair');m.readyAt=g.minute+config.repairMinutes;enqueue(g,{kind:'repair',machine:cmd.machine,qty:0,cost:'0',started:g.minute,serviceCost:String(money(config.repairCost)),due:m.readyAt});break}
 case 'upgradeMachine':{const m=g.machines[cmd.machine];check(m&&m.level<3&&m.readyAt===0&&!g.jobs.some(j=>j.kind==='batch'),'Upgrade unavailable');const v=money(30000*m.level);canPay(g,v);transfer(g.journal,id(g),g.minute,'Capital equipment improvement','equipment','cash',v);m.readyAt=g.minute+240;enqueue(g,{kind:'repair',machine:cmd.machine,qty:0,cost:'0',started:g.minute,serviceCost:String(v),due:m.readyAt,upgrade:true});break}
 case 'cancelBatch':{const j=g.jobs.find(j=>j.id===cmd.id&&j.kind==='batch');check(j,'Active batch not found');recognizeBatchLabor(g,j);const cost=BigInt(j.cost);if(cost>0n)transfer(g.journal,id(g),g.minute,'Abandoned batch consumed production costs','loss','wip',cost);g.jobs=g.jobs.filter(x=>x.id!==j.id);for(const t of j.trace??[])trackDisposal(g.waste,t.item,t.qty);note(g,'Active batch canceled; consumed materials not restored');break}
 case 'setUtility':{check(['power','water'].includes(cmd.utility)&&typeof cmd.enabled==='boolean'&&g.utilities[cmd.utility]!==cmd.enabled,'Invalid utility decision');if(cmd.enabled){const index=cmd.utility==='power'?6:7;check(g.machines[index].condition>=40&&g.machines[index].readyAt===0,'Repair utility equipment first')}g.utilities[cmd.utility]=cmd.enabled;if(!cmd.enabled){for(const j of g.jobs.filter(j=>j.kind==='batch'&&!j.paused)){j.remainingMinutes=j.due-g.minute;j.paused=true}}note(g,cmd.utility+(cmd.enabled?' restored':' isolated'));break}
 case 'renewPermit':check(g.operations.permitUntil-g.minute<=7*1440,'Renewal not due');spend(g,'expense',money(6000),'Operating permit renewal');g.operations.permitUntil=Math.max(g.operations.permitUntil,g.minute)+30*1440;break;
 case 'sanitize':check(g.operations.sanitation<100&&!g.jobs.some(j=>j.kind==='batch'&&!j.paused),'Sanitation unavailable');spend(g,'expense',money(5000),'Factory sanitation');g.operations.sanitation=100;break;
 case 'discard':{const l=g.lots.find(x=>x.id===cmd.id);check(l&&reserved(g,l.id)===0,'Lot unavailable or reserved');const c=BigInt(l.cost);if(c>0n)transfer(g.journal,id(g),g.minute,'Disposed inventory','loss',l.item==='biscuit'?'finished':'raw',c);if(l.item==='biscuit')g.operations.discarded+=l.qty;trackDisposal(g.waste,l.item,l.qty);g.lots=g.lots.filter(x=>x.id!==l.id);note(g,'Disposed '+l.qty+' '+l.item);break}
 case 'produce':startBatch(g,cmd.qty);break;
 case 'planBatch':{positive(cmd.qty,10000);positive(cmd.delay,7*1440);check(g.audit.length===config.audit.length,'Complete company audit');check(g.plans.length<50,'Planning queue full');check(g.lots.filter(l=>l.item==='biscuit').reduce((n,l)=>n+l.qty,0)+g.plans.reduce((n,p)=>n+p.qty,0)+g.jobs.filter(j=>j.kind==='batch').reduce((n,j)=>n+j.qty,0)+cmd.qty<=config.finishedCapacity,'Finished goods capacity exceeded');const due=g.minute+cmd.delay,reservations=reserveRecipe(g,cmd.qty,due);g.plans.push({id:id(g),qty:cmd.qty,due,reservations});note(g,'Batch planned and materials reserved');break}
 case 'cancelPlan':{check(g.plans.some(p=>p.id===cmd.id),'Plan unavailable');g.plans=g.plans.filter(p=>p.id!==cmd.id);note(g,'Production reservation canceled');break}
 case 'pauseBatch':{const j=g.jobs.find(j=>j.id===cmd.id&&j.kind==='batch'&&!j.paused);check(j,'Running batch unavailable');recognizeBatchLabor(g,j);j.remainingMinutes=j.due-g.minute;j.paused=true;break}
 case 'resumeBatch':{const j=g.jobs.find(j=>j.id===cmd.id&&j.kind==='batch'&&j.paused);check(j&&throughput(g)>0,'Paused batch or operating conditions unavailable');j.due=g.minute+(j.remainingMinutes??30);delete j.paused;delete j.remainingMinutes;break}
 case 'release':{const l=g.lots.find(l=>l.id===cmd.id&&l.item==='biscuit'&&l.held&&l.expiry>g.minute);check(l,'Batch unavailable');check(l.quality>=config.manufacturing.finishedQualityMin&&!g.batches.some(b=>b.id===l.source&&b.recalled),'Quality failed or recalled; dispose the held batch');l.held=false;note(g,'Quality release: '+l.qty+' packets');break}
 case 'holdLot':{const l=g.lots.find(l=>l.id===cmd.id&&!l.held);check(l&&reserved(g,l.id)===0,'Lot unavailable or reserved');l.held=true;note(g,'Quality hold placed: '+l.id);break}
 case 'inspectMaterial':{const l=g.lots.find(l=>l.id===cmd.id&&l.item!=='biscuit'&&l.held);check(l&&l.quality>=config.manufacturing.incomingQualityMin,'Incoming lot failed inspection');l.held=false;const order=g.purchases.find(p=>p.lotId===l.id);if(order&&order.status==='held')order.status='accepted';note(g,'Incoming material inspection passed');break}
 case 'recallBatch':{const b=g.batches.find(b=>b.id===cmd.id);const reason=cmd.reason.trim();check(b&&!b.recalled&&reason.length>0&&reason.length<=120,'Recall unavailable or invalid reason');b.recalled=true;b.reason=reason;for(const c of g.contracts.filter(c=>c.status==='reserved'&&c.reservations.some(r=>g.lots.some(l=>l.id===r.lotId&&l.source===b.id))))cancelContract(g,c,'recalled');for(const l of g.lots.filter(l=>l.item==='biscuit'&&l.source===b.id))l.held=true;const shipments=g.jobs.filter(j=>j.kind==='delivery'&&j.trace?.some(t=>t.source===b.id));for(const j of shipments){const c=BigInt(j.cost);if(c>0n)transfer(g.journal,id(g),g.minute,'Recalled shipment write-off','loss','wip',c);g.waste.finishedPackets+=j.qty;g.operations.discarded+=j.qty;const contract=g.contracts.find(c=>c.id===j.contractId);if(contract){contract.status='recalled';contract.closed=g.minute}}g.jobs=g.jobs.filter(j=>!shipments.some(s=>s.id===j.id));for(const s of g.sales.filter(s=>s.trace?.some(t=>t.source===b.id))){s.recalled=true;if(s.status!=='refunded'){s.complaint='open';s.reason='quality'}}g.reputation=Math.max(0,g.reputation-5);note(g,'Batch recalled: '+b.id+' — customer compensation required');break}
 case 'reserveSale':{positive(cmd.qty,10000);const region=regionInfo(cmd.region);check(region&&[0,15,30].includes(cmd.credit)&&cmd.qty<=regionAvailability(g,region.id),'Order exceeds regional demand or invalid terms');check(g.contracts.filter(c=>c.status==='reserved').length<50,'Too many pending reservations');const deadline=Math.min(g.minute+360,(Math.floor(g.minute/1440)+1)*1440);const reservations=reserveFinished(g,cmd.qty,deadline+region.deliveryMinutes);g.operations.marketCommitted+=cmd.qty;g.market.regionCommitted[region.id]+=cmd.qty;g.contracts.push({id:id(g),qty:cmd.qty,price:g.price,credit:cmd.credit,region:region.id,accepted:g.minute,deadline,reservations,status:'reserved'});note(g,'Buyer terms accepted; dispatch before deadline');break}
 case 'cancelContract':{const c=g.contracts.find(c=>c.id===cmd.id&&c.status==='reserved');check(c,'Reservation unavailable');cancelContract(g,c,'canceled');note(g,'Buyer reservation canceled');break}
 case 'dispatchContract':{const c=g.contracts.find(c=>c.id===cmd.id&&c.status==='reserved');check(c&&c.deadline>g.minute,'Reservation unavailable');const region=regionInfo(c.region)!;c.status='dispatched';const {cost,trace}=take(g,'biscuit',c.qty,c.reservations);check(trace.every(t=>t.expiry>g.minute+region.deliveryMinutes),'Shipment would expire before delivery');if(cost>0n)transfer(g.journal,id(g),g.minute,'Contract goods dispatched','wip','finished',cost);spend(g,'expense',BigInt(c.qty)*BigInt(region.deliveryPaise),'Delivery cost');enqueue(g,{kind:'delivery',qty:c.qty,cost:String(cost),price:c.price,credit:c.credit,region:c.region,contractId:c.id,trace,due:g.minute+region.deliveryMinutes});break}
 case 'sell':{positive(cmd.qty,10000);const region=regionInfo(cmd.region??'local');check(region&&[0,15,30].includes(cmd.credit)&&cmd.qty<=regionAvailability(g,region.id),'Order exceeds regional demand or invalid terms');const {cost,trace}=take(g,'biscuit',cmd.qty);check(trace.every(t=>t.expiry>g.minute+region.deliveryMinutes),'Shipment would expire before delivery');g.operations.marketDay=Math.floor(g.minute/1440);g.operations.marketCommitted+=cmd.qty;g.market.regionCommitted[region.id]+=cmd.qty;if(cost>0n)transfer(g.journal,id(g),g.minute,'Goods dispatched','wip','finished',cost);spend(g,'expense',BigInt(cmd.qty)*BigInt(region.deliveryPaise),'Delivery cost');enqueue(g,{kind:'delivery',qty:cmd.qty,cost:String(cost),price:g.price,credit:cmd.credit,trace,region:region.id,due:g.minute+region.deliveryMinutes});break}
 case 'complaint':{const sale=g.sales.find(s=>s.id===cmd.id);check(sale&&sale.status!=='refunded'&&sale.complaint==='none','Complaint unavailable');check(['damaged','late','quality'].includes(cmd.reason),'Invalid complaint reason');sale.complaint='open';sale.reason=cmd.reason;g.reputation=Math.max(0,g.reputation-2);note(g,'Customer complaint: '+cmd.reason);break}
 case 'closeComplaint':{const sale=g.sales.find(s=>s.id===cmd.id&&s.complaint==='open');check(sale&&sale.reason==='late','Only a delivery-delay complaint can close without refund');sale.complaint='closed';note(g,'Delivery complaint resolved');break}
 case 'refundSale':{const sale=g.sales.find(s=>s.id===cmd.id&&s.complaint==='open'&&s.status!=='refunded');check(sale,'No refundable complaint');const v=BigInt(sale.amount);if(sale.status==='receivable'){const pending=g.jobs.find(j=>j.kind==='collection'&&j.source===sale.id);check(pending&&BigInt(pending.cost)===v,'Invoice linkage missing');transfer(g.journal,id(g),g.minute,'Customer credit note','returns','receivable',v);g.jobs=g.jobs.filter(j=>j.id!==pending.id)}else{canPay(g,v);transfer(g.journal,id(g),g.minute,'Customer refund','returns','cash',v)}sale.status='refunded';sale.complaint='closed';note(g,'Full customer refund/credit issued; returned food not restocked');break}
 case 'expandRegion':{const region=regionInfo(cmd.region);check(region&&config.market.regions[g.market.regions.length]?.id===region.id,'Region must unlock in sequence');check(g.reputation>=region.reputation&&g.sold>=region.sold,'Region prerequisites not met');spend(g,'expense',money(region.cost),'Distribution market entry');g.market.regions.push(region.id);note(g,'Distribution expanded to '+region.name+'; active next game day');break}
 case 'price':positive(cmd.price,3000);check(cmd.price>=100,'Price too low');g.price=cmd.price;break;
 case 'hire':{check(g.employees.length<100&&['operator','manager'].includes(cmd.role),'Hiring limit');spend(g,'expense',money(2000),'Recruitment');g.employees.push({id:id(g),name:cmd.role==='manager'?'Department manager':'New operator',role:cmd.role,skill:65+Math.floor(rng(g)*25),morale:70,wage:cmd.role==='manager'?1500:800,shiftHours:8,fatigue:0,present:true,safetyTrained:false,grade:1});break}
 case 'settlePayrollExact':
 case 'settlePayroll':{if(cmd.type==='settlePayroll')positive(cmd.rupees);const amount=cmd.type==='settlePayrollExact'?-balance(g.journal,'payroll'):money(cmd.rupees);canPay(g,amount);check(amount<=-balance(g.journal,'payroll'),'Exceeds payroll payable');transfer(g.journal,id(g),g.minute,'Payroll settlement','payroll','cash',amount);break}
 case 'settleDebt':
 case 'repay':{if(cmd.type==='repay')positive(cmd.rupees);const amount=cmd.type==='settleDebt'?totalDebt(g.journal):money(cmd.rupees);canPay(g,amount);check(amount<=totalDebt(g.journal),'Exceeds debt');const accrued=-balance(g.journal,'interestPayable'),interest=amount<accrued?amount:accrued;if(interest>0n)transfer(g.journal,id(g),g.minute,'Interest payment','interestPayable','cash',interest);if(amount>interest){transfer(g.journal,id(g),g.minute,'Debt repayment','debt','cash',amount-interest);allocatePrincipal(g.loans,amount-interest)}break}
 case 'settleTax':
 case 'payTax':{if(cmd.type==='payTax')positive(cmd.rupees);const amount=cmd.type==='settleTax'?-balance(g.journal,'taxPayable'):money(cmd.rupees);canPay(g,amount);check(amount<=-balance(g.journal,'taxPayable'),'Exceeds tax payable');transfer(g.journal,id(g),g.minute,'Tax payment','taxPayable','cash',amount);break}
 case 'loan':{positive(cmd.rupees,config.finance.loanMaxRupees);check(g.reputation>=config.finance.loanMinReputation&&!g.loans.some(l=>loanSchedule(l,g.minute).due>0n)&&totalDebt(g.journal)+money(cmd.rupees)<=money(config.finance.loanLimitRupees),'Loan not eligible');transfer(g.journal,id(g),g.minute,'Loan proceeds','cash','debt',money(cmd.rupees));g.loans.push(makeLoan(id(g),money(cmd.rupees),g.minute));break}
 case 'restructureLoan':{const loan=g.loans.find(l=>l.id===cmd.id);check(loan&&BigInt(loan.remaining)>0n&&!loan.restructured,'Restructuring unavailable');check(loanSchedule(loan,g.minute).due>0n||g.distressDays>0,'Restructuring requires overdue principal or liquidity distress');const updated=makeLoan(loan.id,BigInt(loan.remaining),g.minute,360);Object.assign(loan,updated,{restructured:true});decision(g,'restructure','Bank facility '+loan.id+' extended to 360 days',BigInt(loan.remaining));note(g,'Loan restructured to 360 days; outstanding principal and interest unchanged');break}
 case 'campaign':{check(g.campaignUntil<=g.minute,'Campaign active');const budget=cmd.budget??5000,days=cmd.days??3;positive(budget,config.market.campaignMax);check(budget>=config.market.campaignMin&&[1,3,7].includes(days),'Invalid campaign budget or duration');spend(g,'expense',money(budget),'Marketing campaign');const strength=Math.min(4500,Math.max(500,Math.floor(500+Math.sqrt(budget/days)*60*(0.75+rng(g)*0.5))));g.campaignUntil=g.minute+days*1440;g.market.campaigns.push({id:id(g),budget:String(money(budget)),started:g.minute,until:g.campaignUntil,boostBps:strength});note(g,'Marketing campaign launched');break}
 case 'stopCampaign':{check(g.campaignUntil>g.minute,'No active campaign');const c=activeCampaign(g);if(c)c.stopped=g.minute;g.campaignUntil=g.minute;note(g,'Campaign stopped; spent budget not refundable');break}
 case 'research':check(g.research<5&&!g.jobs.some(j=>j.kind==='research'),'Research unavailable');spend(g,'expense',money(10000),'Efficiency research');enqueue(g,{kind:'research',qty:0,cost:'0',due:g.minute+1440});break;
 case 'researchTrack':{check(cmd.track==='quality'||cmd.track==='shelfLife','Unknown research track');const p=config.researchProjects[cmd.track];check(g.audit.length===config.audit.length&&g.research>=1&&(cmd.track!=='shelfLife'||g.researchTracks.quality>=1)&&g.researchTracks[cmd.track]<p.max&&!g.jobs.some(j=>j.kind==='research'),'Research prerequisites or availability not met');spend(g,'expense',money(p.cost),cmd.track+' research');enqueue(g,{kind:'research',researchTrack:cmd.track,qty:0,cost:'0',due:g.minute+p.minutes});break}
 case 'pauseResearch':{const j=g.jobs.find(j=>j.id===cmd.id&&j.kind==='research'&&!j.paused);check(j,'Running research unavailable');j.remainingMinutes=j.due-g.minute;j.paused=true;break}
 case 'resumeResearch':{const j=g.jobs.find(j=>j.id===cmd.id&&j.kind==='research'&&j.paused);check(j,'Paused research unavailable');j.due=g.minute+j.remainingMinutes!;delete j.paused;delete j.remainingMinutes;break}
 case 'cancelResearch':{check(g.jobs.some(j=>j.id===cmd.id&&j.kind==='research'),'Research unavailable');g.jobs=g.jobs.filter(j=>j.id!==cmd.id);note(g,'Research canceled; spent research cost not refunded');break}
 case 'automation':{check(typeof cmd.enabled==='boolean','Invalid automation flag');if(cmd.enabled){check(g.management.assignments.some(a=>a.enabled),'Assign a manager first');check(!managerRisk(g)&&cash(g)>=money(g.policy.minCash),'Resolve risk or cash reserve before enabling');g.management.halted=null}else{g.management.approvals=[];managerLog(g,'system','automation','stopped','CEO disabled automation')}g.manager=cmd.enabled;break}
 case 'assignManager':{const a=cmd.authority;check(validAuthority(a)&&g.employees.some(e=>e.id===a.employeeId&&e.role==='manager'),'Invalid manager authority');check(!g.management.assignments.some(x=>x.department===a.department&&x.employeeId!==a.employeeId),'Department already assigned');g.management.assignments=g.management.assignments.filter(x=>x.employeeId!==a.employeeId);g.management.assignments.push({...a});g.management.approvals=g.management.approvals.filter(x=>x.employeeId!==a.employeeId);if(!g.management.assignments.some(x=>x.enabled))g.manager=false;break}
 case 'unassignManager':{check(g.management.assignments.some(a=>a.employeeId===cmd.employeeId),'Manager not assigned');g.management.assignments=g.management.assignments.filter(a=>a.employeeId!==cmd.employeeId);g.management.approvals=g.management.approvals.filter(a=>a.employeeId!==cmd.employeeId);if(!g.management.assignments.some(a=>a.enabled))g.manager=false;break}
 case 'managerLimits':{check(Number.isSafeInteger(cmd.dailyLimit)&&cmd.dailyLimit>=0&&cmd.dailyLimit<=1000000&&Number.isSafeInteger(cmd.repairBelow)&&cmd.repairBelow>=40&&cmd.repairBelow<=95,'Invalid global limits');g.management.dailyLimit=cmd.dailyLimit;g.management.repairBelow=cmd.repairBelow;g.management.approvals=[];break}
 case 'managerStop':stopManagers(g,'CEO emergency stop');break;
 case 'managerApproval':{rollManagement(g);const a=g.management.approvals.find(x=>x.id===cmd.id);check(a&&typeof cmd.approve==='boolean','Approval expired or unavailable');g.management.approvals=g.management.approvals.filter(x=>x.id!==a.id);if(cmd.approve)delegatedAttempt(g,a.department,a.command,true,a.employeeId,BigInt(a.estimate));else managerLog(g,a.department,a.command.type,'rejected','CEO rejected request',0n,a.employeeId);break}
 case 'policy':{const p=cmd.policy;positive(p.reorderBatches,5);positive(p.batchSize,5000);positive(p.minCash,10000000);check(Number.isSafeInteger(p.minMargin)&&p.minMargin>=0&&p.minMargin<=3000,'Invalid margin');g.policy={...p};g.management.approvals=[];break}
 case 'train':{const e=g.employees.find(x=>x.id===cmd.id);check(e&&e.skill<100,'Employee unavailable or fully trained');spend(g,'expense',money(3000),'Staff training');e.skill=Math.min(100,e.skill+5);break}
 case 'shift':{const e=g.employees.find(x=>x.id===cmd.id);check(e&&[8,10,12].includes(cmd.hours),'Invalid employee or shift');check(cmd.hours===8||e.safetyTrained,'Extended shift requires safety training');check(cmd.hours===8||e.fatigue<60,'Employee needs recovery');e.shiftHours=cmd.hours;note(g,'Shift assignment updated');break}
 case 'safetyTraining':{const e=g.employees.find(x=>x.id===cmd.id);check(e&&!e.safetyTrained,'Safety training unavailable');spend(g,'expense',money(1500),'Safety training');e.safetyTrained=true;note(g,'Safety training completed');break}
 case 'promote':{const e=g.employees.find(x=>x.id===cmd.id);check(e&&e.grade<3&&e.skill>=70+e.grade*5,'Promotion prerequisites not met');e.grade=(e.grade+1) as Employee['grade'];e.wage=Math.ceil(e.wage*1.15);e.morale=Math.min(100,e.morale+10);note(g,'Employee promoted; salary updated');break}
 case 'releaseEmployee':{const e=g.employees.find(x=>x.id===cmd.id);check(e,'Unknown employee');spend(g,'expense',money(e.wage*7),'Severance');g.employees=g.employees.filter(x=>x.id!==e.id);g.management.assignments=g.management.assignments.filter(a=>a.employeeId!==e.id);g.management.approvals=g.management.approvals.filter(a=>a.employeeId!==e.id);if(!g.management.assignments.some(a=>a.enabled))g.manager=false;break}
 case 'capital':{positive(cmd.rupees,100000);check(g.distressDays>0&&cmd.rupees<=config.rescue[g.difficulty].capital&&!g.journal.some(e=>e.description==='Emergency owner capital'),'Emergency capital unavailable');transfer(g.journal,id(g),g.minute,'Emergency owner capital','cash','equity',money(cmd.rupees));decision(g,'capital','Owner approved equity contribution',money(cmd.rupees));break}
 case 'beginnerAssistance':{const amount=config.rescue[g.difficulty].assistance;check(amount>0&&!g.rescue.assistanceUsed&&g.distressDays>0,'Second-chance assistance unavailable');transfer(g.journal,id(g),g.minute,'Beginner rescue assistance (owner equity)','cash','equity',money(amount));g.rescue.assistanceUsed=true;decision(g,'assistance','One-time beginner owner equity',money(amount));note(g,'One-time beginner assistance received; all debts remain payable');break}
 case 'extendSupplier':{const p=g.payables.find(x=>x.id===cmd.id);check(p&&!g.governance.extendedInvoices.includes(p.id),'Supplier extension unavailable');check(g.difficulty!=='Hardcore'&&(g.distressDays>0||p.due<=g.minute+1440),'Supplier negotiation not eligible');const fee=(BigInt(p.amount)+99n)/100n;canPay(g,fee);transfer(g.journal,id(g),g.minute,'Supplier extension fee','expense','cash',fee);p.due=Math.max(p.due,g.minute)+7*1440;g.governance.extendedInvoices.push(p.id);decision(g,'supplierExtension','Supplier '+p.source+' granted 7-day extension; fee paid',fee);note(g,'Supplier payment extended; principal unchanged');break}
 case 'salvageMaterial':{positive(cmd.qty,config.rawCapacityPerItem);check(g.distressDays>0&&config.materials.includes(cmd.item),'Emergency disposal unavailable');const {cost}=take(g,cmd.item,cmd.qty);const proceeds=cost*60n/100n;check(proceeds>0n,'No recoverable value');const loss=cost-proceeds;post(g.journal,id(g),g.minute,'Emergency raw inventory disposal',[{account:'cash',amount:String(proceeds)},{account:'loss',amount:String(loss)},{account:'raw',amount:String(-cost)}]);decision(g,'assetDisposal','Raw inventory sold at 60% carrying value: '+cmd.item,proceeds);note(g,'Emergency inventory sale completed');break}
 case 'ackCrisis':{const c=g.crises.find(x=>x.id===cmd.id&&!x.resolved);check(c&&!c.details.acknowledged,'Crisis acknowledgement unavailable');c.details.acknowledged=true;break}
 case 'resolveCrisis':{const c=g.crises.find(x=>x.id===cmd.id&&!x.resolved);check(c,'Crisis not open');check(crisisResolved(g,c),'Underlying problem is unresolved');c.resolved=true;c.details.closed=g.minute;c.details.outcome='Underlying condition verified as resolved';note(g,'Resolved '+c.kind+' crisis');break}
 case 'advance':advanceInPlace(g,cmd.minutes);break;
 case 'speed':check([0,1,5,20,60].includes(cmd.value),'Invalid speed');g.speed=cmd.value;break;
 }
 }
 pauseUnsafe(g);if(g.manager&&(managerRisk(g)||cash(g)<money(g.policy.minCash)))stopManagers(g,managerRisk(g)??'Cash reserve reached');if(g.accepted)updateMilestones(g);g.revision++;assertState(g);return g;
}
function managerLog(g:Game,department:ManagerLog['department'],action:string,outcome:ManagerLog['outcome'],reason:string,cashSpent=0n,employeeId?:string){
 g.management.logs.push({id:id(g),minute:g.minute,department,action,outcome,reason:reason.slice(0,240),cashSpent:String(cashSpent),...(employeeId?{employeeId}:{})});g.management.logs=g.management.logs.slice(-1000);
}
function stopManagers(g:Game,reason:string){g.manager=false;g.management.halted=reason;g.management.approvals=[];managerLog(g,'system','automation','stopped',reason)}
function delegatedAttempt(g:Game,department:Department,cmd:DelegatedCommand,approved=false,employeeId?:string,approvedEstimate?:bigint){
 rollManagement(g);const a=g.management.assignments.find(x=>x.department===department&&x.enabled);
 const fail=(reason:string)=>{managerLog(g,department,cmd.type,'blocked',reason,0n,a?.employeeId);return false};
 if(!g.manager||managerRisk(g)||!a||(employeeId!==undefined&&a.employeeId!==employeeId))return fail('Authority unavailable or risk stop');
 const e=g.employees.find(e=>e.id===a.employeeId&&e.role==='manager'&&e.present&&e.fatigue<70&&e.morale>=20&&e.skill>=60);if(!e)return fail('Assigned manager unavailable or unqualified');
 if(!validDelegated(cmd)||commandDepartment(cmd)!==department)return fail('Command outside delegated authority');
 if(g.audit.length!==config.audit.length)return fail('Takeover audit required');
 if(cmd.type==='purchase'){const incoming=g.jobs.filter(j=>j.kind==='receipt'&&j.item===cmd.item).reduce((n,j)=>n+j.qty,0),need=g.policy.batchSize*g.policy.reorderBatches*config.bom[cmd.item]-stock(g,cmd.item)-incoming;if(cmd.qty>need)return fail('Replenishment need changed; request no longer valid')}
 if(cmd.type==='produce'&&(cmd.qty>g.policy.batchSize||g.plans.length>0))return fail('Batch policy or existing reservation prevents production');
 if(cmd.type==='sell'){if(cmd.qty>g.policy.batchSize||stock(g,'biscuit')<cmd.qty)return fail('Sale quantity no longer available');const cost=averageIssue(g.lots.filter(l=>l.item==='biscuit'),cmd.qty);if(BigInt(g.price)*BigInt(cmd.qty)-cost-30n*BigInt(cmd.qty)<BigInt(g.policy.minMargin)*BigInt(cmd.qty))return fail('Current contribution margin below policy')}
 if(cmd.type==='repair'&&(g.machines[cmd.machine].condition>=g.management.repairBelow||g.machines[cmd.machine].readyAt!==0))return fail('Maintenance no longer required');
 // Estimate from the actual validated candidate, not a separate accounting simulation.
 let next:Game;try{next=apply(g,cmd)}catch(err){return fail(err instanceof Error?err.message:'Command validation failed')}
 const actual=next.journal.slice(g.journal.length).reduce((n,j)=>n+j.lines.filter(l=>l.account==='cash'&&BigInt(l.amount)<0n).reduce((s,l)=>s-BigInt(l.amount),0n),0n);
 const spent=BigInt(g.management.spent[department]),total=departments.reduce((n,d)=>n+BigInt(g.management.spent[d]),0n);
 if(cash(next)<money(g.policy.minCash))return fail('Cash reserve would be breached');
 if(spent+actual>money(a.dailyLimit)||total+actual>money(g.management.dailyLimit))return fail('Daily spending limit exceeded');
 if(approved&&approvedEstimate!==undefined&&actual>approvedEstimate)return fail('Cost increased; new CEO approval required');
 if(!approved&&actual>money(a.approvalAbove)){
  if(g.management.approvals.length<16&&!g.management.approvals.some(x=>x.department===department&&JSON.stringify(x.command)===JSON.stringify(cmd))){g.management.approvals.push({id:id(g),minute:g.minute,department,employeeId:a.employeeId,command:cmd,estimate:String(actual)});managerLog(g,department,cmd.type,'approval','CEO approval required',0n,a.employeeId)}
  return false;
 }
 Object.assign(g,next);g.management.spent[department]=String(spent+actual);managerLog(g,department,cmd.type,'executed',approved?'CEO approved; command revalidated':'Within delegated limits',actual,a.employeeId);return true;
}
function automate(g:Game){
 rollManagement(g);const risk=managerRisk(g);if(risk||cash(g)<money(g.policy.minCash)){stopManagers(g,risk??'Cash reserve reached');return}
 const p=g.policy;
 const enabled=(d:Department)=>g.management.assignments.some(a=>a.department===d&&a.enabled);
 if(enabled('maintenance')){const i=g.machines.map((m,i)=>({m,i})).filter(({m})=>m.readyAt===0&&m.condition<g.management.repairBelow).sort((a,b)=>a.m.condition-b.m.condition||a.i-b.i)[0];if(i)delegatedAttempt(g,'maintenance',{type:'repair',machine:i.i})}
 if(enabled('procurement'))for(const item of config.materials){
  const incoming=g.jobs.filter(j=>j.kind==='receipt'&&j.item===item).reduce((s,j)=>s+j.qty,0);
  const physical=g.lots.filter(l=>l.item===item).reduce((s,l)=>s+l.qty,0);
  const target=p.batchSize*p.reorderBatches*config.bom[item];
  const qty=Math.min(target-stock(g,item)-incoming,config.rawCapacityPerItem-physical-incoming);
  if(qty>0)delegatedAttempt(g,'procurement',{type:'purchase',item,qty,supplier:'standard',creditDays:0});
 }
 if(enabled('production')&&throughput(g)>0&&!g.jobs.some(j=>j.kind==='batch')&&!g.plans.length){
  const n=Math.min(p.batchSize,...config.materials.map(item=>Math.floor(stock(g,item)/config.bom[item])));
  if(n>0)delegatedAttempt(g,'production',{type:'produce',qty:n});
 }
 if(enabled('sales')){
  const available=stock(g,'biscuit'),q=Math.min(available,regionAvailability(g,'local'),p.batchSize);
  // All lots contribute to accounting pooled carrying value, even held lots.
  if(q>0){const cost=averageIssue(g.lots.filter(l=>l.item==='biscuit'),q),margin=BigInt(g.price)*BigInt(q)-cost-30n*BigInt(q);if(margin>=BigInt(p.minMargin)*BigInt(q))delegatedAttempt(g,'sales',{type:'sell',qty:q,credit:0,region:'local'});else managerLog(g,'sales','sell','blocked','Minimum contribution margin not met')}
 }
}
export function migrateGame(g:Game):Game{
 const oldPrincipal=-balance(g.journal,'debt');
 return {...g,researchTracks:g.researchTracks??{quality:0,shelfLife:0},productionPayroll:g.productionPayroll??{day:Math.floor(g.minute/1440),allocated:'0'},manager:g.management?g.manager:false,management:g.management??newManagement(g.minute),governance:migrateGovernance(g),rescue:migrateRescue(g),market:{...initialMarket(Math.floor(g.minute/1440),g.difficulty,g.operations?.marketCommitted??0),...g.market},purchases:g.purchases??[],serviceHistory:g.serviceHistory??[],utilities:g.utilities??{power:true,water:true},batches:g.batches??[],waste:g.waste??emptyWaste(),plans:g.plans??[],loans:g.loans??(oldPrincipal>0n?[makeLoan('legacy-loan',oldPrincipal,g.minute)]:[]),financeStart:g.financeStart??g.minute,machines:g.machines.map(m=>({...m,level:m.level??1,lastService:m.lastService??0})),employees:g.employees.map(e=>({...e,shiftHours:e.shiftHours??8,fatigue:e.fatigue??0,present:e.present??true,safetyTrained:e.safetyTrained??false,grade:e.grade??1})),contracts:g.contracts??[],sales:g.sales??[],payables:g.payables??[],brand:g.brand??'Plain Biscuit',lots:g.lots.map(l=>({...l,quality:l.quality??90,source:l.source??'legacy'})),operations:g.operations??{...initialOps(),permitUntil:g.minute+30*1440,marketDay:Math.floor(g.minute/1440)},policy:g.policy??{reorderBatches:2,batchSize:1000,minCash:50000,minMargin:100},crises:(g.crises??[]).map(c=>({...c,details:c.details??{...crisisDetails(c.kind,c.opened,g.difficulty,'Legacy '+c.kind+' alert'),penaltyApplied:true}})),competitorPrice:g.competitorPrice??900,distressDays:g.distressDays??0,status:g.status??'distressed'};
}
export function assertState(g:Game){
 check(g.researchTracks&&(['quality','shelfLife'] as const).every(k=>Number.isSafeInteger(g.researchTracks[k])&&g.researchTracks[k]>=0&&g.researchTracks[k]<=config.researchProjects[k].max),'Invalid research tracks');
 check(g.jobs.filter(j=>j.kind==='research').length<=1&&g.jobs.every(j=>j.researchTrack===undefined||j.kind==='research'&&(j.researchTrack==='quality'||j.researchTrack==='shelfLife')&&g.researchTracks[j.researchTrack]<config.researchProjects[j.researchTrack].max),'Invalid research queue');
 check(g.productionPayroll.day===Math.floor(g.minute/1440)&&/^(0|[1-9][0-9]{0,29})$/.test(g.productionPayroll.allocated),'Invalid production payroll accumulator');
 check(validContracts(g),'Buyer contract integrity failure');
 check(validManagement(g),'Invalid management authority or execution records');
 check(validGovernance(g)&&g.crises.every(c=>validCrisisDetails(c.details,g.minute,c.opened,c.resolved)),'Governance or crisis record invalid');
 check(validRescue(g.rescue,g.minute,g.difficulty)&&g.rescue.badDays===g.distressDays&&(g.status==='liquidated')===(g.rescue.phase==='liquidated'),'Invalid recovery state');
 check(validMarket(g.market,g.minute)&&validEconomy(g.market,g.minute)&&validRegionalCommitments(g)&&g.operations.marketDay===g.market.day&&g.operations.marketCommitted<=g.market.total,'Market state or allocation integrity failure');
 check(typeof g.utilities.power==='boolean'&&typeof g.utilities.water==='boolean','Invalid utilities');
 check(g.purchases.length<=50000&&new Set(g.purchases.map(p=>p.id)).size===g.purchases.length&&g.purchases.every(p=>p.status==='inTransit'?g.jobs.some(j=>j.id===p.id&&j.kind==='receipt'&&j.item===p.item&&j.qty===p.qty&&j.cost===p.cost&&j.due===p.due):p.closed!==undefined&&p.closed<=g.minute),'Purchase history linkage failure');
 check(g.serviceHistory.length<=50000&&new Set(g.serviceHistory.map(s=>s.id)).size===g.serviceHistory.length&&g.serviceHistory.every(s=>s.started<=s.completed&&s.completed<=g.minute&&BigInt(s.cost)>0n),'Invalid service history');
 check(g.batches.length<=50000&&new Set(g.batches.map(b=>b.id)).size===g.batches.length&&g.batches.every(b=>b.good+b.rejected===b.planned&&(b.materialCost===undefined?b.energyCost===undefined&&b.activeMinutes===undefined:b.energyCost!==undefined&&b.activeMinutes!==undefined&&BigInt(b.materialCost)>=0n&&BigInt(b.energyCost)>=0n&&BigInt(b.laborCost??'0')>=0n&&BigInt(b.materialCost)+BigInt(b.energyCost)+BigInt(b.laborCost??'0')===BigInt(b.cost)&&Number.isSafeInteger(b.activeMinutes)&&b.activeMinutes>=0&&b.activeMinutes<=b.completed-b.started)&&b.started<=b.completed&&b.completed<=g.minute&&config.materials.every(item=>b.input.filter(t=>t.item===item).reduce((n,t)=>n+t.qty,0)===config.bom[item]*b.planned)),'Batch genealogy failure');
 check([g.waste.rawGrams,g.waste.packagingPieces,g.waste.finishedPackets,g.waste.rejectedPackets,g.waste.processLossGrams].every(n=>Number.isSafeInteger(n)&&n>=0)&&BigInt(g.waste.energyPaise)>=0n,'Invalid waste totals');
 check(g.plans.length<=50&&g.plans.every(p=>Number.isSafeInteger(p.qty)&&p.qty>0&&p.qty<=10000&&Number.isSafeInteger(p.due)&&p.due>g.minute&&p.reservations.every(r=>Number.isSafeInteger(r.qty)&&r.qty>0&&g.lots.some(l=>l.id===r.lotId&&!l.held&&l.expiry>p.due))&&config.materials.every(item=>p.reservations.filter(r=>g.lots.find(l=>l.id===r.lotId)?.item===item).reduce((n,r)=>n+r.qty,0)===config.bom[item]*p.qty))&&g.lots.every(l=>reserved(g,l.id)<=l.qty),'Reservation integrity failure');
 check(g.schema===1&&Number.isSafeInteger(g.revision)&&g.revision>=0&&Number.isSafeInteger(g.minute)&&g.minute>=0,'Invalid game state');
 check(g.loans.every(l=>BigInt(l.original)>0n&&BigInt(l.remaining)>=0n&&BigInt(l.remaining)<=BigInt(l.original)&&Number.isSafeInteger(l.opened)&&l.opened>=0&&l.opened<=g.minute&&[180,360].includes(l.termDays)&&typeof l.restructured==='boolean')&&new Set(g.loans.map(l=>l.id)).size===g.loans.length&&g.loans.reduce((n,l)=>n+BigInt(l.remaining),0n)===-balance(g.journal,'debt'),'Loan principal reconciliation failure');
 check(Number.isSafeInteger(g.financeStart)&&g.financeStart>=0&&g.financeStart<=g.minute,'Invalid finance start');
 check(balance(g.journal,'equipment')+balance(g.journal,'accumulatedDepreciation')>=0n&&balance(g.journal,'accumulatedDepreciation')<=0n&&balance(g.journal,'taxPayable')<=0n&&balance(g.journal,'interestPayable')<=0n&&balance(g.journal,'debt')<=0n,'Financial account sign failure');
 check(g.journal.every(e=>e.lines.reduce((s,l)=>s+BigInt(l.amount),0n)===0n)&&new Set(g.journal.map(e=>e.id)).size===g.journal.length,'Journal integrity failure');
 check(g.machines.every(m=>[1,2,3].includes(m.level)&&Number.isSafeInteger(m.lastService)&&m.lastService>=0&&m.lastService<=g.minute),'Invalid engineering state');check(g.employees.every(e=>[8,10,12].includes(e.shiftHours)&&Number.isSafeInteger(e.fatigue)&&e.fatigue>=0&&e.fatigue<=100&&typeof e.present==='boolean'&&typeof e.safetyTrained==='boolean'&&[1,2,3].includes(e.grade)),'Invalid HR state');check(typeof g.brand==='string'&&g.brand.trim().length>0&&g.brand.length<=60,'Invalid brand');check(cash(g)>=0n,'Negative cash');check(g.operations.sanitation>=0&&g.operations.sanitation<=100&&g.operations.marketCommitted>=0,'Invalid operational state');check(g.lots.every(l=>Number.isSafeInteger(l.qty)&&l.qty>0&&BigInt(l.cost)>=0n&&l.expiry>g.minute),'Invalid lot');
 for(const a of ['raw','finished'] as const){const expected=g.lots.filter(l=>a==='raw'?l.item!=='biscuit':l.item==='biscuit').reduce((s,l)=>s+BigInt(l.cost),0n);check(balance(g.journal,a)===expected,'Inventory ledger mismatch')}
 check(balance(g.journal,'wip')===g.jobs.filter(j=>['receipt','batch','delivery'].includes(j.kind)&&!(j.kind==='receipt'&&(j.credit??0)>0)).reduce((s,j)=>s+BigInt(j.cost),0n),'Work in progress mismatch');
 check(g.payables.every(p=>BigInt(p.amount)>0n&&Number.isSafeInteger(p.due)&&p.due>=0)&&new Set(g.payables.map(p=>p.id)).size===g.payables.length&&-balance(g.journal,'payable')===g.payables.reduce((n,p)=>n+BigInt(p.amount),0n),'Supplier payable reconciliation failure');
 check(new Set(g.sales.map(s=>s.id)).size===g.sales.length&&g.sales.every(s=>BigInt(s.amount)>0n&&Number.isSafeInteger(s.qty)&&s.qty>0&&s.delivered<=g.minute),'Invalid delivered sales');
 for(const sale of g.sales){const linked=g.jobs.filter(j=>j.kind==='collection'&&j.source===sale.id);check(sale.status==='receivable'?linked.length===1&&linked[0].cost===sale.amount:linked.length===0,'Sale/invoice linkage failure')}
 check(balance(g.journal,'receivable')===g.jobs.filter(j=>j.kind==='collection').reduce((n,j)=>n+BigInt(j.cost),0n),'Receivables reconciliation failure');
}
export function catchUpPlan(g:Game,now:number){
 check(Number.isSafeInteger(now)&&now>=0,'Invalid timestamp');
 const timing=planElapsedTime(g.wall,now,config.offlineCapMinutes);
 const running=g.accepted&&g.status!=='liquidated'&&g.speed>0;
 const minutes=running?timing.simulatedMinutes*g.speed:0;
 const wall=!running||timing.wasCapped?Math.max(now,g.wall):g.wall+timing.elapsedMinutes*60000;
 return {...timing,minutes,wall,running};
}
export function finishCatchUp(g:Game,plan:ReturnType<typeof catchUpPlan>,originalMinute:number){
 if(g.minute>originalMinute){pauseUnsafe(g);if(g.accepted)updateMilestones(g);g.revision++}
 g.wall=plan.wall;assertState(g);return g;
}
export function catchUp(g:Game,now:number):Game{
 const plan=catchUpPlan(g,now),out=clone(g);
 if(plan.minutes>0)advanceInPlace(out,plan.minutes);
 return finishCatchUp(out,plan,g.minute);
}
export function stage(g:Game){const debt=totalDebt(g.journal);return g.sold>=1000000&&debt===0n?5:g.sold>=250000&&g.reputation>=80?4:g.sold>=50000&&g.reputation>=50?3:g.sold>=5000&&profit(g.journal)>0n?2:1}

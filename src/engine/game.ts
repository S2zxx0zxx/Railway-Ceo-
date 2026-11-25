import {config,type Material,type Difficulty} from '../content/scenario';
import {balance,post,transfer,money,profit,type Entry} from './ledger';
export type Lot={id:string;item:Material|'biscuit';qty:number;cost:string;expiry:number;held:boolean};
export type Machine={name:string;condition:number;readyAt:number};
export type Employee={id:string;name:string;skill:number;morale:number;wage:number;role:'operator'|'manager'};
export type Job={id:string;kind:'receipt'|'batch'|'delivery'|'collection'|'repair'|'research';due:number;qty:number;cost:string;item?:Material;machine?:number;stage?:number;price?:number;credit?:number};
export type Game={schema:1;revision:number;minute:number;seed:number;next:number;name:string;ceo:string;difficulty:Difficulty;accepted:boolean;audit:string[];journal:Entry[];lots:Lot[];machines:Machine[];employees:Employee[];jobs:Job[];price:number;reputation:number;research:number;campaignUntil:number;manager:boolean;produced:number;sold:number;news:string[];history:{day:number;revenue:string;profit:string}[];wall:number;speed:number};
export type Command=
 | {type:'takeover';name:string;ceo:string;difficulty:Difficulty}
 | {type:'audit';item:string}
 | {type:'purchase';item:Material;qty:number}
 | {type:'repair';machine:number}
 | {type:'produce';qty:number}
 | {type:'release';id:string}
 | {type:'sell';qty:number;credit:number}
 | {type:'price';price:number}
 | {type:'hire';role:'operator'|'manager'}
 | {type:'settlePayroll';rupees:number}
 | {type:'repay';rupees:number}
 | {type:'loan';rupees:number}
 | {type:'campaign'}
 | {type:'research'}
 | {type:'automation';enabled:boolean}
 | {type:'advance';minutes:number}
 | {type:'speed';value:number};
const clone=<T>(x:T):T=>structuredClone(x);
const id=(g:Game)=>'e'+g.next++;
function check(ok:unknown,msg:string):asserts ok {if(!ok)throw Error(msg)}
function positive(n:number,max=1_000_000){check(Number.isSafeInteger(n)&&n>0&&n<=max,'Quantity outside allowed range')}
function cash(g:Game){return balance(g.journal,'cash')}
function canPay(g:Game,v:bigint){check(v>0n&&cash(g)>=v,'Insufficient operating cash')}
function spend(g:Game,account:'expense'|'raw'|'wip',v:bigint,description:string){canPay(g,v);transfer(g.journal,id(g),g.minute,description,account,'cash',v)}
function note(g:Game,s:string){g.news.unshift('Day '+(Math.floor(g.minute/1440)+1)+': '+s);g.news=g.news.slice(0,100)}
function rng(g:Game){g.seed=(Math.imul(g.seed,1664525)+1013904223)>>>0;return g.seed/4294967296}
export function initialGame(wall=0,seed=20261125):Game{
 const g:Game={schema:1,revision:0,minute:0,seed:seed>>>0,next:1,name:'Distressed Biscuit Industries',ceo:'CEO',difficulty:'Realistic',accepted:false,audit:[],journal:[],lots:[],machines:config.machineNames.map((name,i)=>({name,condition:config.initialConditions[i],readyAt:0})),employees:Array.from({length:24},(_,i)=>({id:'staff-'+i,name:'Employee '+(i+1),skill:65+i%20,morale:42,wage:config.wagePerDay,role:'operator'})),jobs:[],price:config.initialPrice,reputation:12,research:0,campaignUntil:0,manager:false,produced:0,sold:0,news:['Take over the distressed company to begin.'],history:[],wall,speed:0};
 const cash=money(config.cash),equipment=money(config.equipment),debt=money(config.debt),payroll=money(config.arrears);
 post(g.journal,'opening',0,'Inherited assets and liabilities',[{account:'cash',amount:String(cash)},{account:'equipment',amount:String(equipment)},{account:'debt',amount:String(-debt)},{account:'payroll',amount:String(-payroll)},{account:'equity',amount:String(debt+payroll-cash-equipment)}]);
 return g;
}
export function stock(g:Game,item:Lot['item']){return g.lots.filter(l=>l.item===item&&!l.held&&l.expiry>g.minute).reduce((s,l)=>s+l.qty,0)}
function take(g:Game,item:Lot['item'],qty:number):bigint{
 positive(qty,100_000_000);check(stock(g,item)>=qty,'Insufficient available '+item);
 let remaining=qty,total=0n;
 for(const l of g.lots.filter(l=>l.item===item&&!l.held&&l.expiry>g.minute).sort((a,b)=>a.expiry-b.expiry||a.id.localeCompare(b.id))){
  if(!remaining)break;
  const n=Math.min(remaining,l.qty),cost=BigInt(l.cost)*BigInt(n)/BigInt(l.qty);
  l.qty-=n;l.cost=String(BigInt(l.cost)-cost);remaining-=n;total+=cost;
 }
 g.lots=g.lots.filter(l=>l.qty>0);return total;
}
export function demand(g:Game){return Math.max(0,Math.floor(6000*Math.pow(config.initialPrice/g.price,1.5)*(0.5+g.reputation/100)*(g.campaignUntil>g.minute?1.2:1)))}
export function throughput(g:Game){if(g.machines.some(m=>m.condition<40||m.readyAt>g.minute)||!g.employees.some(e=>e.role==='operator'))return 0;return Math.floor(config.capacity*Math.min(...g.machines.map(m=>m.condition))/100*Math.min(1,g.employees.filter(e=>e.role==='operator').length/12))}
function addLot(g:Game,item:Lot['item'],qty:number,cost:bigint,held=false){if(qty>0)g.lots.push({id:id(g),item,qty,cost:String(cost),held,expiry:g.minute+(item==='biscuit'?config.finishedShelfMinutes:config.shelfMinutes)})}
function enqueue(g:Game,job:Omit<Job,'id'>){g.jobs.push({...job,id:id(g)})}
function runJob(g:Game,j:Job){
 const cost=BigInt(j.cost);
 switch(j.kind){
 case 'receipt':addLot(g,j.item!,j.qty,cost);if(cost>0n)transfer(g.journal,id(g),g.minute,'Materials received','raw','wip',cost);note(g,'Received '+j.qty+' '+j.item);break;
 case 'repair':g.machines[j.machine!].condition=95;g.machines[j.machine!].readyAt=0;note(g,g.machines[j.machine!].name+' repaired');break;
 case 'batch':{
  if((j.stage??0)<4){enqueue(g,{...j,stage:(j.stage??0)+1,due:g.minute+30});break}
  const rejected=Math.floor(j.qty*(0.02+(1-Math.min(...g.machines.map(m=>m.condition))/100)*0.08));
  const good=j.qty-rejected,goodCost=cost*BigInt(good)/BigInt(j.qty);
  if(goodCost>0n)transfer(g.journal,id(g),g.minute,'Completed batch','finished','wip',goodCost);
  if(cost>goodCost)transfer(g.journal,id(g),g.minute,'Rejected output','loss','wip',cost-goodCost);
  addLot(g,'biscuit',good,goodCost,true);g.produced+=good;
  for(const m of g.machines)m.condition=Math.max(0,m.condition-1-Math.floor(rng(g)*2));
  note(g,'Batch completed; '+good+' packets awaiting quality release');break}
 case 'delivery':{
  const sales=BigInt(j.qty)*BigInt(j.price!);transfer(g.journal,id(g),g.minute,'Delivery revenue','receivable','revenue',sales);
  if(cost>0n)transfer(g.journal,id(g),g.minute,'Cost of delivered goods','cogs','wip',cost);
  g.sold+=j.qty;g.reputation=Math.min(100,g.reputation+1);
  if(j.credit===0)transfer(g.journal,id(g),g.minute,'Immediate payment','cash','receivable',sales);
  else enqueue(g,{kind:'collection',qty:j.qty,cost:String(sales),due:g.minute+j.credit!*1440});
  note(g,'Delivered '+j.qty+' packets');break}
 case 'collection':transfer(g.journal,id(g),g.minute,'Invoice collected','cash','receivable',cost);break;
 case 'research':g.research++;note(g,'Efficiency research completed');break;
 }
}
function expire(g:Game){for(const l of g.lots.filter(l=>l.expiry<=g.minute)){const c=BigInt(l.cost);if(c>0n)transfer(g.journal,id(g),g.minute,'Expired inventory','loss',l.item==='biscuit'?'finished':'raw',c);note(g,'Expired '+l.item+' stock');}g.lots=g.lots.filter(l=>l.expiry>g.minute)}
function daily(g:Game){
 const wages=money(g.employees.reduce((s,e)=>s+e.wage,0));if(wages>0n)transfer(g.journal,id(g),g.minute,'Daily wages','wages','payroll',wages);
 const debt=-balance(g.journal,'debt');const interest=debt*BigInt(config.dailyInterestBps)/10000n;
 if(interest>0n)transfer(g.journal,id(g),g.minute,'Daily interest','interest','debt',interest);
 if(-balance(g.journal,'payroll')>money(config.arrears))for(const e of g.employees)e.morale=Math.max(0,e.morale-1);
 if(cash(g)<wages)note(g,'Liquidity warning: payroll funding at risk');
 g.history.push({day:g.minute/1440,revenue:String(-balance(g.journal,'revenue')),profit:String(profit(g.journal))});
}
function advance(g:Game,minutes:number){
 positive(minutes,config.offlineCapMinutes*60);const end=g.minute+minutes;
 while(g.minute<end){const nextDay=(Math.floor(g.minute/1440)+1)*1440;
  const due=Math.min(...g.jobs.map(j=>j.due),...g.lots.map(l=>l.expiry),nextDay,end);
  check(due>g.minute,'Invalid scheduler state');g.minute=due;expire(g);if(due===nextDay)daily(g);
  const ready=g.jobs.filter(j=>j.due===due).sort((a,b)=>a.id.localeCompare(b.id));g.jobs=g.jobs.filter(j=>j.due!==due);
  for(const j of ready)runJob(g,j);
 }
}
export function apply(source:Game,cmd:Command):Game{
 const g=clone(source);
 if(cmd.type==='takeover'){check(!g.accepted,'Already acquired');check(cmd.name.trim().length>0&&cmd.name.length<=60&&cmd.ceo.trim().length>0&&cmd.ceo.length<=60&&config.difficulties.includes(cmd.difficulty),'Invalid company identity');g.name=cmd.name.trim();g.ceo=cmd.ceo.trim();g.difficulty=cmd.difficulty;g.accepted=true;note(g,'Takeover completed')}
 else{
 check(g.accepted,'Accept takeover first');
 switch(cmd.type){
 case 'audit':check(config.audit.some(x=>x===cmd.item),'Invalid audit item');if(!g.audit.includes(cmd.item))g.audit.push(cmd.item);break;
 case 'purchase':{check(config.materials.includes(cmd.item),'Invalid material');positive(cmd.qty,10000000);const cost=BigInt(cmd.qty)*BigInt(config.prices[cmd.item]);spend(g,'wip',cost,'Prepaid material order');enqueue(g,{kind:'receipt',item:cmd.item,qty:cmd.qty,cost:String(cost),due:g.minute+config.leadMinutes});break}
 case 'repair':{const m=g.machines[cmd.machine];check(m&&m.readyAt===0&&!g.jobs.some(j=>j.kind==='batch'),'Repair unavailable');check(m.condition<95,'Machine already serviced');spend(g,'expense',money(config.repairCost),'Machine repair');m.readyAt=g.minute+config.repairMinutes;enqueue(g,{kind:'repair',machine:cmd.machine,qty:0,cost:'0',due:m.readyAt});break}
 case 'produce':{positive(cmd.qty,10000);check(g.audit.length===config.audit.length,'Complete company audit');const rate=throughput(g);check(rate>0&&!g.jobs.some(j=>j.kind==='batch'),'Production line unavailable');let cost=0n;for(const item of config.materials)cost+=take(g,item,config.bom[item]*cmd.qty);if(cost>0n)transfer(g.journal,id(g),g.minute,'Materials issued','wip','raw',cost);const energy=BigInt(cmd.qty)*BigInt(Math.max(15,50-g.research*5));spend(g,'wip',energy,'Batch energy');enqueue(g,{kind:'batch',stage:0,qty:cmd.qty,cost:String(cost+energy),due:g.minute+Math.max(30,Math.ceil(cmd.qty/rate*60))});break}
 case 'release':{const l=g.lots.find(l=>l.id===cmd.id&&l.item==='biscuit'&&l.held&&l.expiry>g.minute);check(l,'Batch unavailable');l.held=false;note(g,'Quality release: '+l.qty+' packets');break}
 case 'sell':{positive(cmd.qty,10000);check([0,15,30].includes(cmd.credit)&&cmd.qty<=demand(g),'Order exceeds market demand or invalid terms');const cost=take(g,'biscuit',cmd.qty);if(cost>0n)transfer(g.journal,id(g),g.minute,'Goods dispatched','wip','finished',cost);spend(g,'expense',BigInt(cmd.qty)*30n,'Delivery cost');enqueue(g,{kind:'delivery',qty:cmd.qty,cost:String(cost),price:g.price,credit:cmd.credit,due:g.minute+120});break}
 case 'price':positive(cmd.price,3000);check(cmd.price>=100,'Price too low');g.price=cmd.price;break;
 case 'hire':{check(g.employees.length<100&&['operator','manager'].includes(cmd.role),'Hiring limit');spend(g,'expense',money(2000),'Recruitment');g.employees.push({id:id(g),name:cmd.role==='manager'?'Production manager':'New operator',role:cmd.role,skill:65+Math.floor(rng(g)*25),morale:70,wage:cmd.role==='manager'?1500:800});break}
 case 'settlePayroll':{positive(cmd.rupees);const amount=money(cmd.rupees);canPay(g,amount);check(amount<=-balance(g.journal,'payroll'),'Exceeds payroll payable');transfer(g.journal,id(g),g.minute,'Payroll settlement','payroll','cash',amount);break}
 case 'repay':{positive(cmd.rupees);const amount=money(cmd.rupees);canPay(g,amount);check(amount<=-balance(g.journal,'debt'),'Exceeds debt');transfer(g.journal,id(g),g.minute,'Debt repayment','debt','cash',amount);break}
 case 'loan':{positive(cmd.rupees,200000);check(g.reputation>=20&&-balance(g.journal,'debt')+money(cmd.rupees)<=money(1800000),'Loan not eligible');transfer(g.journal,id(g),g.minute,'Loan proceeds','cash','debt',money(cmd.rupees));break}
 case 'campaign':check(g.campaignUntil<=g.minute,'Campaign active');spend(g,'expense',money(5000),'Marketing campaign');g.campaignUntil=g.minute+4320;break;
 case 'research':check(g.research<5&&!g.jobs.some(j=>j.kind==='research'),'Research unavailable');spend(g,'expense',money(10000),'Efficiency research');enqueue(g,{kind:'research',qty:0,cost:'0',due:g.minute+1440});break;
 case 'automation':check(!cmd.enabled||g.employees.some(e=>e.role==='manager'),'Hire a manager first');g.manager=cmd.enabled;break;
 case 'advance':advance(g,cmd.minutes);break;
 case 'speed':check([0,1,5,20,60].includes(cmd.value),'Invalid speed');g.speed=cmd.value;break;
 }
 }
 g.revision++;assertState(g);return g;
}
export function assertState(g:Game){
 check(g.schema===1&&Number.isSafeInteger(g.revision)&&g.revision>=0&&Number.isSafeInteger(g.minute)&&g.minute>=0,'Invalid game state');
 check(g.journal.every(e=>e.lines.reduce((s,l)=>s+BigInt(l.amount),0n)===0n)&&new Set(g.journal.map(e=>e.id)).size===g.journal.length,'Journal integrity failure');
 check(cash(g)>=0n,'Negative cash');check(g.lots.every(l=>Number.isSafeInteger(l.qty)&&l.qty>0&&BigInt(l.cost)>=0n&&l.expiry>g.minute),'Invalid lot');
 for(const a of ['raw','finished'] as const){const expected=g.lots.filter(l=>a==='raw'?l.item!=='biscuit':l.item==='biscuit').reduce((s,l)=>s+BigInt(l.cost),0n);check(balance(g.journal,a)===expected,'Inventory ledger mismatch')}
 check(balance(g.journal,'wip')===g.jobs.filter(j=>['receipt','batch','delivery'].includes(j.kind)).reduce((s,j)=>s+BigInt(j.cost),0n),'Work in progress mismatch');
}
export function catchUp(g:Game,now:number):Game{
 check(Number.isSafeInteger(now)&&now>=0,'Invalid timestamp');const elapsed=Math.max(0,Math.floor((now-g.wall)/60000));const minutes=Math.min(config.offlineCapMinutes,elapsed)*g.speed;
 const out=minutes>0&&g.accepted?apply(g,{type:'advance',minutes}):clone(g);out.wall=Math.max(now,g.wall);return out;
}
export function stage(g:Game){const debt=-balance(g.journal,'debt');return g.sold>=1000000&&debt===0n?5:g.sold>=250000&&g.reputation>=80?4:g.sold>=50000&&g.reputation>=50?3:g.sold>=5000&&profit(g.journal)>0n?2:1}

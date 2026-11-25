import {assertState,migrateGame,type Game} from '../engine/game';
import {accounts} from '../engine/ledger';
import {config} from '../content/scenario';
function check(ok:unknown,msg='Invalid save data'):asserts ok{if(!ok)throw Error(msg)}
const int=(v:unknown,min=0,max=Number.MAX_SAFE_INTEGER)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=min&&v<=max;
const str=(v:unknown,max=256)=>typeof v==='string'&&v.length>0&&v.length<=max;
const decimal=(v:unknown)=>typeof v==='string'&&/^-?(0|[1-9][0-9]{0,29})$/.test(v);
export function decodeSave(text:string):Game{
 check(text.length<=8_000_000,'Save exceeds import limit');
 const g=migrateGame(JSON.parse(text) as Game);
 check(g.schema===1&&int(g.financeStart,0,g.minute)&&int(g.revision)&&int(g.minute)&&int(g.wall)&&int(g.seed,0,4294967295)&&int(g.next,1)&&str(g.name,60)&&str(g.brand,60)&&g.brand.trim().length>0&&str(g.ceo,60)&&config.difficulties.includes(g.difficulty));
 check(typeof g.accepted==='boolean'&&typeof g.manager==='boolean'&&[0,1,5,20,60].includes(g.speed)&&['distressed','recovering','stable','liquidated'].includes(g.status));
 check(int(g.price,100,3000)&&int(g.reputation,0,100)&&int(g.research,0,5)&&int(g.campaignUntil)&&int(g.produced)&&int(g.sold)&&g.sold<=g.produced&&int(g.competitorPrice,600,1200)&&int(g.distressDays));
 check(g.operations&&int(g.operations.permitUntil)&&int(g.operations.sanitation,0,100)&&int(g.operations.rejected)&&int(g.operations.discarded)&&int(g.operations.marketDay)&&int(g.operations.marketCommitted));
 check(Array.isArray(g.audit)&&g.audit.every(a=>config.audit.some(x=>x===a))&&new Set(g.audit).size===g.audit.length);
 check(g.policy&&int(g.policy.batchSize,1,5000)&&int(g.policy.reorderBatches,1,5)&&int(g.policy.minCash,1,10000000)&&int(g.policy.minMargin,0,3000));
 check(Array.isArray(g.journal)&&g.journal.length>0&&g.journal.length<=50000&&g.journal.every(e=>str(e.id)&&int(e.minute,0,g.minute)&&str(e.description)&&Array.isArray(e.lines)&&e.lines.length>=2&&e.lines.every(l=>accounts.includes(l.account)&&decimal(l.amount))));
 check(Array.isArray(g.lots)&&g.lots.length<=10000&&g.lots.every(l=>str(l.id)&&[...config.materials,'biscuit'].includes(l.item)&&int(l.qty,1,100000000)&&decimal(l.cost)&&int(l.expiry,g.minute+1)&&typeof l.held==='boolean'&&int(l.quality,0,100)&&str(l.source)));
 check(Array.isArray(g.machines)&&g.machines.length===config.machineNames.length&&g.machines.every((m,i)=>m.name===config.machineNames[i]&&int(m.condition,0,100)&&int(m.readyAt)&&int(m.level,1,3)&&int(m.lastService,0,g.minute)));
 check(Array.isArray(g.employees)&&g.employees.length<=100&&g.employees.every(e=>str(e.id)&&str(e.name)&&['operator','manager'].includes(e.role)&&int(e.skill,0,100)&&int(e.morale,0,100)&&int(e.wage,1,100000)&&[8,10,12].includes(e.shiftHours)&&int(e.fatigue,0,100)&&typeof e.present==='boolean'&&typeof e.safetyTrained==='boolean'&&int(e.grade,1,3)));
 check(Array.isArray(g.jobs)&&g.jobs.length<=10000&&g.jobs.every(j=>str(j.id)&&['receipt','batch','delivery','collection','repair','research'].includes(j.kind)&&int(j.due,g.minute+1)&&int(j.qty,0,100000000)&&decimal(j.cost)&&BigInt(j.cost)>=0n&&(j.quality===undefined||int(j.quality,0,100))&&(j.source===undefined||str(j.source))&&(j.kind!=='receipt'||(config.materials.includes(j.item!)&&[0,7,15].includes(j.credit??0)&&j.qty>0))&&(j.kind!=='repair'||(int(j.machine,0,g.machines.length-1)&&(j.upgrade===undefined||typeof j.upgrade==='boolean')))&&(j.kind!=='batch'||(j.qty>0&&int(j.stage??0,0,4)))&&(j.kind!=='delivery'||(j.qty>0&&int(j.price,100,3000)&&[0,15,30].includes(j.credit!)))));
 check(Array.isArray(g.loans)&&g.loans.length<=10000&&g.loans.every(l=>str(l.id)&&decimal(l.original)&&decimal(l.remaining)&&int(l.opened,0,g.minute)&&[180,360].includes(l.termDays)&&typeof l.restructured==='boolean'));
 check(Array.isArray(g.sales)&&g.sales.length<=50000&&g.sales.every(s=>str(s.id)&&int(s.qty,1,10000)&&decimal(s.amount)&&BigInt(s.amount)>0n&&int(s.delivered,0,g.minute)&&['receivable','paid','refunded'].includes(s.status)&&['none','open','closed'].includes(s.complaint)&&(s.complaint==='none'?s.reason===undefined:['damaged','late','quality'].includes(s.reason!))&&(s.status!=='refunded'||s.complaint==='closed')));
 check(Array.isArray(g.payables)&&g.payables.length<=10000&&g.payables.every(p=>str(p.id)&&str(p.source)&&decimal(p.amount)&&BigInt(p.amount)>0n&&int(p.due)));
 check(Array.isArray(g.crises)&&g.crises.every(c=>str(c.id)&&['payroll','machine','liquidity','compliance','safety'].includes(c.kind)&&int(c.opened,0,g.minute)&&typeof c.resolved==='boolean'));
 check(Array.isArray(g.news)&&g.news.length<=100&&g.news.every(n=>str(n,1000))&&Array.isArray(g.history)&&g.history.every(h=>int(h.day)&&decimal(h.revenue)&&decimal(h.profit)));
 const ids=[...g.jobs,...g.lots,...g.employees,...g.crises,...g.payables,...g.sales,...g.loans,...g.journal].map(x=>x.id);
 check(new Set(ids).size===ids.length&&ids.every(i=>!/^e[0-9]+$/.test(i)||Number(i.slice(1))<g.next),'Conflicting object identifiers');
 assertState(g);return g;
}

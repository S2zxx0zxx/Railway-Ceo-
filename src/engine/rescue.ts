import {config,type Difficulty} from '../content/scenario';
import {balance,money,profit,totalDebt} from './ledger';
import {loanSchedule} from './banking';
import type {Game} from './game';
export type RescuePhase='takeover'|'warning'|'distress'|'default'|'restructuring'|'recovering'|'stable'|'liquidated';
export type RescueState={phase:RescuePhase;entered:number;deadline:number|null;badDays:number;healthyDays:number;assistanceUsed:boolean;history:{phase:RescuePhase;minute:number}[];milestones:{id:string;minute:number}[]};
export const newRescue=():RescueState=>({phase:'takeover',entered:0,deadline:null,badDays:0,healthyDays:0,assistanceUsed:false,history:[{phase:'takeover',minute:0}],milestones:[]});
export function transition(g:Game,phase:RescuePhase,deadline:number|null=null){
 if(g.rescue.phase===phase)return;
 g.rescue.phase=phase;g.rescue.entered=g.minute;g.rescue.deadline=deadline;
 g.rescue.history.push({phase,minute:g.minute});g.rescue.history=g.rescue.history.slice(-200);
}
export function distressSignals(g:Game,wages:bigint){
 const cash=balance(g.journal,'cash'),principalDue=g.loans.reduce((n,l)=>n+loanSchedule(l,g.minute).due,0n);
 const overdueSuppliers=g.payables.filter(p=>p.due<g.minute).reduce((n,p)=>n+BigInt(p.amount),0n);
 const overduePayroll=-balance(g.journal,'payroll')>money(config.arrears*2);
 const immediate=wages+principalDue+overdueSuppliers;
 return {cash,wages,principalDue,overdueSuppliers,overduePayroll,immediate,bad:cash<immediate||overduePayroll};
}
export function updateRescue(g:Game,wages:bigint){
 const s=g.rescue,r=config.rescue[g.difficulty],risk=distressSignals(g,wages);
 if(g.status==='liquidated')return;
 if(risk.bad){s.badDays++;s.healthyDays=0;g.distressDays=s.badDays;g.status='distressed';
  if(s.badDays>=r.liquidation){transition(g,'liquidated');g.status='liquidated';g.speed=0;g.manager=false;return}
  if(s.badDays>r.default){transition(g,'restructuring',g.minute+(r.liquidation-s.badDays)*1440)}
  else if(s.badDays>=r.default){transition(g,'default',g.minute+(r.liquidation-s.badDays)*1440)}
  else if(s.badDays>=r.distress)transition(g,'distress');
  else transition(g,'warning');
 }else{s.badDays=0;s.healthyDays=Math.min(36500,s.healthyDays+1);g.distressDays=0;
  if(g.sold>=5000&&profit(g.journal)>0n&&s.healthyDays>=3){transition(g,'stable');g.status='stable'}
  else if(g.sold>0||['warning','distress','default','restructuring','recovering','stable'].includes(s.phase)){transition(g,'recovering');g.status='recovering'}
 }
}
export function updateMilestones(g:Game){
 const goals:[string,boolean][]=[['audit',g.audit.length===config.audit.length],['first-production',g.produced>0],['first-sale',g.sold>0],['payroll-cleared',balance(g.journal,'payroll')===0n],['positive-result',profit(g.journal)>0n],['regional-market',g.market.activeRegions.includes('regional')],['national-market',g.market.activeRegions.includes('national')],['export-market',g.market.activeRegions.includes('export')],['debt-free',totalDebt(g.journal)===0n],['stable',g.status==='stable']];
 for(const [id,earned] of goals)if(earned&&!g.rescue.milestones.some(m=>m.id===id))g.rescue.milestones.push({id,minute:g.minute});
}
export function migrateRescue(g:Game):RescueState{
 if(g.rescue)return g.rescue;
 const s=newRescue();s.badDays=g.distressDays??0;s.phase=g.status==='liquidated'?'liquidated':g.status==='stable'?'stable':g.status==='recovering'?'recovering':s.badDays?'distress':'takeover';s.entered=g.minute;s.history=[{phase:s.phase,minute:g.minute}];return s;
}
export function validRescue(s:RescueState,minute:number,difficulty:Difficulty){
 const int=(n:number,min:number,max:number)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
 const phases=['takeover','warning','distress','default','restructuring','recovering','stable','liquidated'];
 return !!s&&phases.includes(s.phase)&&int(s.entered,0,minute)&&(s.deadline===null||int(s.deadline,s.entered,Number.MAX_SAFE_INTEGER))&&int(s.badDays,0,Number.MAX_SAFE_INTEGER)&&int(s.healthyDays,0,36500)&&typeof s.assistanceUsed==='boolean'&&(!s.assistanceUsed||config.rescue[difficulty].assistance>0)&&Array.isArray(s.history)&&s.history.length>0&&s.history.length<=200&&s.history.every((h,i)=>phases.includes(h.phase)&&int(h.minute,i?s.history[i-1].minute:0,minute))&&s.history[s.history.length-1].phase===s.phase&&s.history[s.history.length-1].minute===s.entered&&Array.isArray(s.milestones)&&s.milestones.length<=10&&new Set(s.milestones.map(m=>m.id)).size===s.milestones.length&&s.milestones.every(m=>['audit','first-production','first-sale','payroll-cleared','positive-result','regional-market','national-market','export-market','debt-free','stable'].includes(m.id)&&int(m.minute,0,minute));
}

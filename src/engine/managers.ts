import type {Game,Command} from './game';
import {config} from '../content/scenario';
export const departments=['procurement','production','maintenance','sales'] as const;
export type Department=typeof departments[number];
export type DelegatedCommand=Extract<Command,{type:'purchase'|'produce'|'repair'|'sell'}>;
export type Authority={employeeId:string;department:Department;dailyLimit:number;approvalAbove:number;enabled:boolean};
export type ManagerLog={id:string;minute:number;department:Department|'system';employeeId?:string;action:string;outcome:'executed'|'blocked'|'approval'|'stopped'|'rejected';reason:string;cashSpent:string};
export type Approval={id:string;minute:number;department:Department;employeeId:string;command:DelegatedCommand;estimate:string};
export type Management={assignments:Authority[];day:number;spent:Record<Department,string>;dailyLimit:number;repairBelow:number;halted:string|null;logs:ManagerLog[];approvals:Approval[]};
const emptySpent=()=>({procurement:'0',production:'0',maintenance:'0',sales:'0'});
export const newManagement=(minute=0):Management=>({assignments:[],day:Math.floor(minute/1440),spent:emptySpent(),dailyLimit:25000,repairBelow:50,halted:null,logs:[],approvals:[]});
export function rollManagement(g:Game){const day=Math.floor(g.minute/1440);if(g.management.day!==day){g.management.day=day;g.management.spent=emptySpent();g.management.approvals=[]}}
export function commandDepartment(c:DelegatedCommand):Department{switch(c.type){case 'purchase':return 'procurement';case 'produce':return 'production';case 'repair':return 'maintenance';case 'sell':return 'sales'}}
const int=(v:number,min:number,max:number)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
const amount=(v:unknown)=>typeof v==='string'&&/^(0|[1-9][0-9]{0,29})$/.test(v);
export function validAuthority(a:Authority){return !!a&&typeof a.employeeId==='string'&&departments.includes(a.department)&&int(a.dailyLimit,0,1000000)&&int(a.approvalAbove,0,a.dailyLimit)&&typeof a.enabled==='boolean'}
export function validDelegated(c:DelegatedCommand){
 if(!c||typeof c!=='object')return false;
 switch(c.type){
 case 'purchase':return config.materials.includes(c.item)&&int(c.qty,1,config.rawCapacityPerItem)&&c.supplier==='standard'&&c.creditDays===0;
 case 'produce':return int(c.qty,1,5000);
 case 'repair':return int(c.machine,0,config.machineNames.length-1);
 case 'sell':return int(c.qty,1,5000)&&c.credit===0&&c.region==='local';
 default:return false;
 }
}
export function validManagement(g:Game){
 const m=g.management;
 return !!m&&int(m.day,0,Math.floor(g.minute/1440))&&int(m.dailyLimit,0,1000000)&&int(m.repairBelow,40,95)&&(m.halted===null||typeof m.halted==='string'&&m.halted.length<=240)&&Array.isArray(m.assignments)&&m.assignments.length<=departments.length&&new Set(m.assignments.map(a=>a.employeeId)).size===m.assignments.length&&new Set(m.assignments.map(a=>a.department)).size===m.assignments.length&&m.assignments.every(a=>validAuthority(a)&&g.employees.some(e=>e.id===a.employeeId&&e.role==='manager'))&&!!m.spent&&departments.every(d=>amount(m.spent[d]))&&Array.isArray(m.logs)&&m.logs.length<=1000&&new Set(m.logs.map(l=>l.id)).size===m.logs.length&&m.logs.every(l=>typeof l.id==='string'&&int(l.minute,0,g.minute)&&(['system',...departments] as string[]).includes(l.department)&&(l.employeeId===undefined||typeof l.employeeId==='string')&&typeof l.action==='string'&&l.action.length<=80&&['executed','blocked','approval','stopped','rejected'].includes(l.outcome)&&typeof l.reason==='string'&&l.reason.length<=240&&amount(l.cashSpent))&&Array.isArray(m.approvals)&&m.approvals.length<=16&&new Set(m.approvals.map(a=>a.id)).size===m.approvals.length&&m.approvals.every(a=>typeof a.id==='string'&&int(a.minute,m.day*1440,Math.min(g.minute,(m.day+1)*1440-1))&&validDelegated(a.command)&&commandDepartment(a.command)===a.department&&amount(a.estimate)&&m.assignments.some(x=>x.employeeId===a.employeeId&&x.department===a.department));
}
export function managerRisk(g:Game){
 if(g.status==='liquidated'||['default','restructuring'].includes(g.rescue.phase))return 'Creditor default or liquidation';
 if(g.crises.some(c=>!c.resolved&&['safety','compliance','quality'].includes(c.kind)))return 'Unresolved safety, compliance or recall crisis';
 return null;
}

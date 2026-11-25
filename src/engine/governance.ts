import {config,type Difficulty} from '../content/scenario';
import type {Game} from './game';
export type Decision={id:string;minute:number;kind:'takeover'|'identity'|'capital'|'assistance'|'restructure'|'supplierExtension'|'assetDisposal';detail:string;amount:string};
export type Governance={companyId:string;ownerShareBps:10000;decisions:Decision[];extendedInvoices:string[]};
export function newGovernance(wall:number,seed:number):Governance{return {companyId:'company-'+wall.toString(36)+'-'+(seed>>>0).toString(36),ownerShareBps:10000,decisions:[],extendedInvoices:[]}}
export function migrateGovernance(g:Game):Governance{return g.governance??newGovernance(g.wall,g.seed)}
export function validGovernance(g:Game){
 const s=g.governance;return !!s&&typeof s.companyId==='string'&&/^company-[a-z0-9]+-[a-z0-9]+$/.test(s.companyId)&&s.ownerShareBps===10000&&Array.isArray(s.decisions)&&s.decisions.length<=50000&&new Set(s.decisions.map(d=>d.id)).size===s.decisions.length&&s.decisions.every(d=>typeof d.id==='string'&&Number.isSafeInteger(d.minute)&&d.minute>=0&&d.minute<=g.minute&&['takeover','identity','capital','assistance','restructure','supplierExtension','assetDisposal'].includes(d.kind)&&typeof d.detail==='string'&&d.detail.length>0&&d.detail.length<=240&&/^(0|[1-9][0-9]{0,29})$/.test(d.amount))&&Array.isArray(s.extendedInvoices)&&new Set(s.extendedInvoices).size===s.extendedInvoices.length&&s.extendedInvoices.every(i=>typeof i==='string'&&i.length>0);
}
export type CrisisKind='payroll'|'machine'|'liquidity'|'compliance'|'safety'|'supplier'|'creditor'|'quality'|'external';
export type CrisisDetails={cause:string;severity:'warning'|'critical';deadline:number;acknowledged:boolean;penaltyApplied:boolean;closed?:number;outcome?:string};
export function crisisDetails(kind:CrisisKind,opened:number,difficulty:Difficulty,cause:string):CrisisDetails{
 const critical=['liquidity','creditor','compliance','safety','quality'].includes(kind);
 return {cause,severity:critical?'critical':'warning',deadline:opened+config.rescue[difficulty].deadline*1440,acknowledged:false,penaltyApplied:false};
}
export function validCrisisDetails(c:CrisisDetails,minute:number,opened:number,resolved:boolean){
 return typeof c.cause==='string'&&c.cause.length>0&&c.cause.length<=240&&['warning','critical'].includes(c.severity)&&Number.isSafeInteger(c.deadline)&&c.deadline>opened&&typeof c.acknowledged==='boolean'&&typeof c.penaltyApplied==='boolean'&&(c.closed===undefined||resolved&&Number.isSafeInteger(c.closed)&&c.closed>=opened&&c.closed<=minute)&&(c.outcome===undefined||resolved&&typeof c.outcome==='string'&&c.outcome.length<=240);
}

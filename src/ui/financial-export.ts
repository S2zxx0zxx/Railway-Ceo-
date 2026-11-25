import {financialReport,periodIncome,aging} from '../engine/reports';
import type {Game} from '../engine/game';
export function reportDocument(g:Game){
 return JSON.stringify({format:'the-ceo-financial-report-v1',unit:'INR paise (decimal strings)',company:g.name,minute:g.minute,revision:g.revision,statement:financialReport(g),incomeLast30Days:periodIncome(g,Math.max(0,g.minute-30*1440+1),g.minute),receivableAging:aging(g,'receivable'),payableAging:aging(g,'payable'),journal:g.journal},(_,v)=>typeof v==='bigint'?String(v):v,2);
}
export function exportFinancialReport(g:Game){const url=URL.createObjectURL(new Blob([reportDocument(g)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='the-ceo-financial-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}

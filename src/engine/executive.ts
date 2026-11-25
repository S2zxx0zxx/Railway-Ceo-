import {balance,profit} from './ledger';
import {throughput,demand,scheduledPayroll,type Game} from './game';
import {financialReport} from './reports';
export function executiveReview(g:Game){
 const cash=balance(g.journal,'cash'),payroll=scheduledPayroll(g);
 const arrears=-balance(g.journal,'payroll'),debt=-balance(g.journal,'debt'),report=financialReport(g);
 const issues=[
  {id:'cash',active:cash<payroll,label:'Cash below one day of scheduled wages'},
  {id:'arrears',active:arrears>0n,label:'Unsettled payroll liabilities'},
  {id:'debt',active:debt>0n,label:'Outstanding debt'},
  {id:'machinery',active:g.machines.some(m=>m.condition<40),label:'Machinery below minimum condition'},
  {id:'permit',active:g.operations.permitUntil<=g.minute,label:'Operating permit expired'},
  {id:'sanitation',active:g.operations.sanitation<40,label:'Sanitation below operating threshold'},
  {id:'quality',active:g.lots.some(l=>l.held),label:'Stock awaiting quality disposition'},
  {id:'reconciliation',active:!report.balanced,label:'Balance sheet does not reconcile'}
 ];
 return {cash,payroll,arrears,debt,netBookEquity:report.equity,profit:profit(g.journal),wageRunwayDays:payroll>0n?cash/payroll:null,capacity:throughput(g),demand:demand(g),issues};
}

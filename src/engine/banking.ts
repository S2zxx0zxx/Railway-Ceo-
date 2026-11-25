import {config} from '../content/scenario';
export type Loan={id:string;original:string;remaining:string;opened:number;termDays:number;restructured:boolean};
export function makeLoan(id:string,amount:bigint,minute:number,termDays:number=config.finance.loanTermDays):Loan{
 if(amount<=0n||!Number.isSafeInteger(minute)||minute<0||!Number.isSafeInteger(termDays)||termDays<30||termDays>360||termDays%30!==0)throw Error('Invalid loan terms');
 return {id,original:String(amount),remaining:String(amount),opened:minute,termDays,restructured:false};
}
/** Equal-principal monthly amortization; simple daily interest accrues separately on outstanding balance. */
export function loanSchedule(loan:Loan,minute:number){
 const original=BigInt(loan.original),remaining=BigInt(loan.remaining),paid=original-remaining;
 const count=loan.termDays/30,rows=[];
 for(let i=1;i<=count;i++){const target=original*BigInt(i)/BigInt(count),prior=original*BigInt(i-1)/BigInt(count);const scheduled=target-prior,unpaid=target>paid?target-paid:0n;
  rows.push({due:loan.opened+i*30*1440,principal:scheduled,cumulative:target,outstandingDue:unpaid});}
 const dueRows=rows.filter(r=>r.due<=minute),due=dueRows.length?dueRows[dueRows.length-1].outstandingDue:0n;
 const next=rows.find(r=>r.due>minute&&r.outstandingDue>0n);
 return {rows,due,nextDue:next?.due??null,nextPrincipal:next?next.outstandingDue:0n,maturity:loan.opened+loan.termDays*1440,remaining};
}
export function allocatePrincipal(loans:Loan[],amount:bigint){
 if(amount<0n||amount>loans.reduce((s,l)=>s+BigInt(l.remaining),0n))throw Error('Principal exceeds loan balances');
 let left=amount;for(const loan of [...loans].sort((a,b)=>a.opened-b.opened||a.id.localeCompare(b.id))){const remaining=BigInt(loan.remaining),paid=left<remaining?left:remaining;loan.remaining=String(remaining-paid);left-=paid;if(!left)break}
}

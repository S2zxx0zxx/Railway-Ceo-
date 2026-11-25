import {balance,profitBeforeTax,type Entry} from './ledger';
import {config} from '../content/scenario';
/** Fictional straight-line accounting, zero salvage, integer paise. Legacy saves start prospectively. */
export function depreciationForDay(journal:Entry[],minute:number,start:number){
 const life=BigInt(config.finance.depreciationDays);let amount=0n;
 for(const e of journal){const cost=e.lines.filter(l=>l.account==='equipment').reduce((n,l)=>n+BigInt(l.amount),0n);if(cost<=0n)continue;
  const from=Math.max(start,e.minute),days=Math.min(Number(life),Math.max(0,Math.floor((minute-from)/1440))),prev=Math.min(Number(life),Math.max(0,Math.floor((minute-1440-from)/1440)));
  amount+=cost*BigInt(days)/life-cost*BigInt(prev)/life;
 }
 const book=balance(journal,'equipment')+balance(journal,'accumulatedDepreciation');return amount>book?book>0n?book:0n:amount;
}
export function taxForPeriod(journal:Entry[],minute:number,start:number){
 const period=config.finance.taxPeriodDays*1440;
 if(minute<=start||minute%period!==0||minute-start<period)return 0n;
 const taxable=profitBeforeTax(journal.filter(e=>e.minute>minute-period&&e.minute<=minute));
 return taxable>0n?taxable*BigInt(config.finance.taxBps)/10000n:0n;
}

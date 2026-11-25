import {describe,it,expect} from 'vitest';
import {initialGame,apply,stock,type Game} from '../src/engine/game';
import {marketView,closeMarketDay,updateEconomicConditions,validMarket,validEconomy,validRegionalCommitments} from '../src/engine/market';
import {config,type Difficulty} from '../src/content/scenario';
import {balance,profit,money} from '../src/engine/ledger';
import {financialReport} from '../src/engine/reports';
import {encodeSave,decodeSave} from '../src/persistence/codec';
// Isolated external market stress harness: does not purport to run a solvent company for 3 years.
function marketRun(difficulty:Difficulty,seed:number){
 const g=apply(initialGame(0,seed),{type:'takeover',name:'Market stress',ceo:'CEO',difficulty});let x=seed>>>0;
 const random=()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296};
 for(let day=1;day<=1095;day++){
  g.minute=day*1440;closeMarketDay(g,day,random);updateEconomicConditions(g,random);g.operations.marketDay=day;g.operations.marketCommitted=0;
  const v=marketView(g);expect(v.player+v.rivalShares.reduce((a,b)=>a+b,0)+v.unmet).toBe(v.total);expect(validMarket(g.market,g.minute)).toBe(true);expect(validEconomy(g.market,g.minute)).toBe(true);expect(validRegionalCommitments(g)).toBe(true);expect(g.market.competitors.every(c=>c.cash>=0&&c.cash<=config.market.cashCap&&c.stock>=0&&c.stock<=config.market.stockCap)).toBe(true);
 }
 return g.market;
}
function reconcile(g:Game){const r=financialReport(g);expect(r.balanced).toBe(true);expect(r.cashDifference).toBe(0n);expect(balance(g.journal,'cash')).toBeGreaterThanOrEqual(0n);expect(g.journal.every(e=>e.lines.reduce((n,l)=>n+BigInt(l.amount),0n)===0n)).toBe(true);expect(new Set(g.journal.map(e=>e.id)).size).toBe(g.journal.length);return decodeSave(encodeSave(g))}
describe('G12 extended conservation evidence',()=>{
 for(const difficulty of config.difficulties)it('keeps 1095 seeded external market days bounded: '+difficulty,()=>{expect(marketRun(difficulty,12345)).toEqual(marketRun(difficulty,12345))},30000);
 it('reconciles the full credit-procurement, scheduled manufacturing, contract and collection cycle',()=>{let g=apply(initialGame(),{type:'takeover',name:'Golden',ceo:'CEO',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});g=apply(g,{type:'settlePayroll',rupees:50000});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000,creditDays:7});g=reconcile(apply(g,{type:'advance',minutes:180}));const invoiceTotal=-balance(g.journal,'payable');expect(invoiceTotal).toBeGreaterThan(0n);for(const p of g.payables)g=apply(g,{type:'paySupplier',id:p.id});expect(balance(g.journal,'payable')).toBe(0n);g=apply(g,{type:'planBatch',qty:1000,delay:60});expect(stock(g,'flour')).toBe(0);g=reconcile(apply(g,{type:'advance',minutes:560}));expect(g.batches[0].good+g.batches[0].rejected).toBe(1000);expect(balance(g.journal,'raw')).toBe(0n);expect(stock(g,'biscuit')).toBe(0);const l=g.lots.find(l=>l.item==='biscuit')!;g=apply(g,{type:'release',id:l.id});g=apply(g,{type:'reserveSale',qty:100,credit:15,region:'local'});g=apply(g,{type:'dispatchContract',id:g.contracts[0].id});g=reconcile(apply(g,{type:'advance',minutes:120}));expect(balance(g.journal,'receivable')).toBe(BigInt(100*g.price));g=reconcile(apply(g,{type:'advance',minutes:15*1440}));expect(balance(g.journal,'receivable')).toBe(0n);const before=profit(g.journal);g=reconcile(apply(g,{type:'repay',rupees:1000}));expect(profit(g.journal)).toBe(before);expect(balance(g.journal,'payroll')).toBeLessThan(0n)});
});

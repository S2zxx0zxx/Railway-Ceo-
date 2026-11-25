import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {balance,money,transfer} from '../src/engine/ledger';
import {financialReport,aging} from '../src/engine/reports';
import {depreciationForDay,taxForPeriod} from '../src/engine/finance';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'Finance',ceo:'CEO',difficulty:'Realistic'});
describe('G04 financial postings',()=>{
 it('separates interest payable and repays interest before principal',()=>{let g=apply(start(),{type:'advance',minutes:1440});expect(balance(g.journal,'debt')).toBe(-money(1400000));expect(balance(g.journal,'interestPayable')).toBe(-money(420));g=apply(g,{type:'repay',rupees:1000});expect(balance(g.journal,'interestPayable')).toBe(0n);expect(balance(g.journal,'debt')).toBe(-money(1399420));expect(financialReport(g).balanced).toBe(true);expect(financialReport(g).cashDifference).toBe(0n)});
 it('posts noncash depreciation and balances statements',()=>{const g=apply(start(),{type:'advance',minutes:1440});const r=financialReport(g);expect(r.depreciation).toBe(money(1000000)/1825n);expect(r.accumulatedDepreciation).toBe(r.depreciation);expect(r.netEquipment).toBe(money(1000000)-r.depreciation);expect(r.balanced).toBe(true);expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('allocates depreciation remainder exactly over useful life',()=>{const g=start();let total=0n;for(let d=1;d<=1825;d++)total+=depreciationForDay(g.journal,d*1440,0);expect(total).toBe(money(1000000))});
 it('calculates tax from positive period income only and excludes prior boundary',()=>{const g=start();transfer(g.journal,'fixture-sale',1440,'Fixture sale','cash','revenue',money(10000));expect(taxForPeriod(g.journal,30*1440,0)).toBe(money(2500));expect(taxForPeriod(g.journal,60*1440,0)).toBe(0n)});
 it('ages supplier balances and keeps credit purchase reconciliation',()=>{let g=apply(start(),{type:'purchase',item:'flour',qty:1000,creditDays:7});g=apply(g,{type:'advance',minutes:8*1440});expect(aging(g,'payable').days1to30).toBe(3000n);expect(financialReport(g).balanced).toBe(true)});
 it('migrates older saves prospectively without rewriting prior journal',()=>{const g=apply(start(),{type:'advance',minutes:1440});const {financeStart,...old}=g;const n=decodeSave(JSON.stringify(old));expect(n.financeStart).toBe(g.minute);expect(n.journal).toEqual(g.journal)});
});

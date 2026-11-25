import {describe,it,expect} from 'vitest';
import {averageIssue,allocatePool,pooledValue} from '../src/engine/costing';
import {initialGame,apply,assertState,supplierQuote} from '../src/engine/game';
import {balance} from '../src/engine/ledger';
const start=()=>apply(initialGame(),{type:'takeover',name:'Cost',ceo:'CEO',difficulty:'Realistic'});
describe('G04 moving weighted-average inventory',()=>{
 it('conserves a fractional paise remainder deterministically',()=>{const lots=[{id:'b',qty:2,cost:'0'},{id:'a',qty:1,cost:'0'}];allocatePool(lots,10n);expect(lots.find(l=>l.id==='a')!.cost).toBe('3');expect(pooledValue(lots).cost).toBe(10n);expect(averageIssue(lots,2)).toBe(6n)});
 it('revalues differently priced receipts without changing source quality or ledger',()=>{let g=start();g=apply(g,{type:'purchase',item:'flour',qty:1000,supplier:'standard'});g=apply(g,{type:'purchase',item:'flour',qty:1000,supplier:'premium'});g=apply(g,{type:'advance',minutes:360});const total=supplierQuote('flour',1000,'standard').cost+supplierQuote('flour',1000,'premium').cost;expect(g.lots.map(l=>l.quality).sort()).toEqual([90,98]);expect(pooledValue(g.lots).cost).toBe(total);expect(balance(g.journal,'raw')).toBe(total);expect(g.lots.every(l=>BigInt(l.cost)===total/2n)).toBe(true);assertState(g)});
 it('writes off pooled carrying value of discarded lots',()=>{let g=start();g=apply(g,{type:'purchase',item:'flour',qty:1000});g=apply(g,{type:'advance',minutes:180});const l=g.lots[0];g=apply(g,{type:'discard',id:l.id});expect(balance(g.journal,'raw')).toBe(0n);expect(balance(g.journal,'loss')).toBe(BigInt(l.cost));assertState(g)});
});

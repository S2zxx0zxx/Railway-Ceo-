import {describe,it,expect} from 'vitest';
import {initialGame,apply,assertState,stock,catchUp} from '../src/engine/game';
import {balance,profit,money} from '../src/engine/ledger';
import {config} from '../src/content/scenario';
function acquired(){let g=apply(initialGame(),{type:'takeover',name:'Test Co',ceo:'Test',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});return g}
describe('company simulation',()=>{
 it('reconciles opening balance',()=>{const g=initialGame();expect(balance(g.journal,'cash')).toBe(money(300000));expect(balance(g.journal,'debt')).toBe(-money(1400000));expect(profit(g.journal)).toBe(0n);assertState(g)});
 it('rejects invalid actions without mutating the source',()=>{const g=acquired(),before=JSON.stringify(g);expect(()=>apply(g,{type:'produce',qty:500})).toThrow();expect(()=>apply(g,{type:'purchase',item:'flour',qty:-1})).toThrow();expect(JSON.stringify(g)).toBe(before)});
 it('supports recovery, procurement, production, quality, delivery and collection',()=>{let g=acquired();for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});g=apply(g,{type:'advance',minutes:180});g=apply(g,{type:'produce',qty:1000});g=apply(g,{type:'advance',minutes:500});expect(stock(g,'biscuit')).toBe(0);const lot=g.lots.find(l=>l.item==='biscuit')!;expect(lot.qty).toBeGreaterThan(0);g=apply(g,{type:'release',id:lot.id});g=apply(g,{type:'sell',qty:lot.qty,credit:15});g=apply(g,{type:'advance',minutes:120});expect(balance(g.journal,'receivable')).toBeGreaterThan(0n);g=apply(g,{type:'advance',minutes:15*1440});expect(balance(g.journal,'receivable')).toBe(0n);assertState(g)});
 it('does not count borrowing as profit',()=>{let g=acquired();g={...g,reputation:25};g=apply(g,{type:'loan',rupees:100000});expect(profit(g.journal)).toBe(0n)});
 it('is deterministic across advance partitions',()=>{const g=acquired();const a=apply(g,{type:'advance',minutes:2880});const b=apply(apply(g,{type:'advance',minutes:1440}),{type:'advance',minutes:1440});expect({...a,revision:0}).toEqual({...b,revision:0})});
 it('bounds offline time and prevents repeated resume at same timestamp',()=>{const g=apply(acquired(),{type:'speed',value:1});const a=catchUp(g,86400000*3);expect(a.minute).toBe(1440);expect(catchUp(a,a.wall)).toEqual(a)});
});

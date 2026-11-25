import {describe,it,expect} from 'vitest';
import {initialGame,apply,supplierQuote,demand} from '../src/engine/game';
import {balance,money} from '../src/engine/ledger';
import {updateEconomicConditions} from '../src/engine/market';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'Economy',ceo:'CEO',difficulty:'Realistic'});
describe('G06 commodity and marketing',()=>{
 it('quotes current commodity index without changing existing purchase price',()=>{let g=start();g.market.commodity.flour=150;const q=supplierQuote('flour',1000,'standard',g);expect(q.cost).toBe(4500n);g=apply(g,{type:'purchase',item:'flour',qty:1000});g.market.commodity.flour=75;expect(g.jobs[0].cost).toBe('4500');g=apply(g,{type:'advance',minutes:180});expect(balance(g.journal,'raw')).toBe(4500n)});
 it('charges campaign once, increases preference and stops without refund',()=>{let g=start(),cash=balance(g.journal,'cash'),base=demand(g);g=apply(g,{type:'campaign',budget:5000,days:3});expect(balance(g.journal,'cash')).toBe(cash-money(5000));expect(demand(g)).toBeGreaterThan(base);expect(()=>apply(g,{type:'campaign'})).toThrow();expect(decodeSave(JSON.stringify(g))).toEqual(g);g=apply(g,{type:'stopCampaign'});expect(demand(g)).toBe(base);expect(balance(g.journal,'cash')).toBe(cash-money(5000))});
 it('generates bounded seeded shocks and expires them',()=>{let g=start();g.market.day=3;updateEconomicConditions(g,()=>0);expect(g.market.shock?.kind).toBe('inflation');for(let i=4;i<100;i++){g.market.day=i;updateEconomicConditions(g,()=>0.99)}expect(g.market.shock).toBe(null);expect(Object.values(g.market.commodity).every(v=>v>=75&&v<=150)).toBe(true)});
 it('varies base market by difficulty',()=>{const b=apply(initialGame(),{type:'takeover',name:'B',ceo:'CEO',difficulty:'Beginner'}),h=apply(initialGame(),{type:'takeover',name:'H',ceo:'CEO',difficulty:'Hardcore'});expect(b.market.total).toBeGreaterThan(h.market.total)});
});

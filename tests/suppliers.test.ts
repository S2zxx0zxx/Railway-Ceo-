import {describe,it,expect} from 'vitest';
import {initialGame,apply,supplierQuote} from '../src/engine/game';
import {config} from '../src/content/scenario';
import {balance} from '../src/engine/ledger';
const acquired=()=>apply(initialGame(),{type:'takeover',name:'Supply',ceo:'CEO',difficulty:'Realistic'});
describe('supplier offers',()=>{
 it('charges the exact quoted price and retains source quality',()=>{let g=acquired();const quote=supplierQuote('flour',1000,'premium');const cash=balance(g.journal,'cash');g=apply(g,{type:'purchase',item:'flour',qty:1000,supplier:'premium'});expect(cash-balance(g.journal,'cash')).toBe(quote.cost);g=apply(g,{type:'advance',minutes:300});expect(g.lots[0].quality).toBe(98);expect(g.lots[0].source).toBe('premium')});
 it('rejects over-capacity purchases',()=>{expect(()=>apply(acquired(),{type:'purchase',item:'flour',qty:config.rawCapacityPerItem+1})).toThrow('Warehouse capacity')});
});

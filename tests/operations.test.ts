import {describe,it,expect} from 'vitest';
import {apply,initialGame,demand,stock,throughput,assertState} from '../src/engine/game';
import {config} from '../src/content/scenario';
import {balance} from '../src/engine/ledger';
const acquired=()=>apply(initialGame(),{type:'takeover',name:'Ops',ceo:'CEO',difficulty:'Realistic'});
function ready(){let g=acquired();for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*2000});return apply(g,{type:'advance',minutes:180})}
describe('operational safeguards',()=>{
 it('tracks market commitments and resets daily',()=>{let g=ready();g=apply(g,{type:'produce',qty:2000});g=apply(g,{type:'advance',minutes:600});const l=g.lots.find(x=>x.item==='biscuit')!;g=apply(g,{type:'release',id:l.id});const before=demand(g);g=apply(g,{type:'sell',qty:100,credit:0});expect(demand(g)).toBe(before-100);g=apply(g,{type:'advance',minutes:1440});expect(g.operations.marketCommitted).toBe(0);assertState(g)});
 it('posts disposal loss and blocks production when sanitation fails',()=>{let g=ready();g=apply(g,{type:'produce',qty:1000});g=apply(g,{type:'advance',minutes:500});const l=g.lots.find(x=>x.item==='biscuit')!;g=apply(g,{type:'discard',id:l.id});expect(stock(g,'biscuit')).toBe(0);expect(balance(g.journal,'loss')).toBeGreaterThan(0n);g.operations.sanitation=20;expect(throughput(g)).toBe(0);g=apply(g,{type:'sanitize'});expect(throughput(g)).toBeGreaterThan(0);assertState(g)});
 it('renews expired permits with an actual expense',()=>{let g=ready();g.operations.permitUntil=g.minute;expect(throughput(g)).toBe(0);g=apply(g,{type:'renewPermit'});expect(g.operations.permitUntil).toBeGreaterThan(g.minute);expect(throughput(g)).toBeGreaterThan(0)});
});

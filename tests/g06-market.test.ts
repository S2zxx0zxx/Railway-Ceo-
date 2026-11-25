import {describe,it,expect} from 'vitest';
import {initialGame,apply,demand} from '../src/engine/game';
import {allocate,marketView} from '../src/engine/market';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'Market',ceo:'CEO',difficulty:'Realistic'});
describe('G06 market allocation',()=>{
 it('conserves integer market shares even at extremes',()=>{for(const n of [0,1,7,10000]){const a=allocate(n,[1000,1000,-1000]);expect(a.reduce((s,v)=>s+v,0)).toBe(n);expect(a.every(v=>v>=0)).toBe(true)}});
 it('reduces isolated demand when price rises and never exceeds total',()=>{let g=start();const base=demand(g);g=apply(g,{type:'price',price:1200});expect(demand(g)).toBeLessThan(base);g=apply(g,{type:'price',price:100});expect(demand(g)).toBeLessThanOrEqual(g.market.total)});
 it('replays rival settlement deterministically and conserves daily market',()=>{const g=start(),a=apply(g,{type:'advance',minutes:2880}),b=apply(apply(g,{type:'advance',minutes:1440}),{type:'advance',minutes:1440});expect(a.market).toEqual(b.market);const v=marketView(a);expect(v.player+v.rivalShares.reduce((s,n)=>s+n,0)+v.unmet).toBe(v.total);expect(a.market.last!.player+a.market.last!.rivals+a.market.last!.unmet).toBe(a.market.last!.total);expect(decodeSave(JSON.stringify(a))).toEqual(a)});
 it('locks region entry until eligible and activates next day',()=>{let g=start();expect(()=>apply(g,{type:'expandRegion',region:'regional'})).toThrow();g={...g,reputation:35,sold:5000,produced:5000};const total=g.market.total;g=apply(g,{type:'expandRegion',region:'regional'});expect(g.market.total).toBe(total);g=apply(g,{type:'advance',minutes:1440});expect(g.market.activeRegions).toContain('regional');expect(g.market.total).toBeGreaterThan(total)});
});

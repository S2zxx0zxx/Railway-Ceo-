import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {config} from '../content/scenario';
import {regionAvailability,validRegionalCommitments} from '../src/engine/market';
import {balance} from '../src/engine/ledger';
import {decodeSave} from '../src/persistence/codec';
function ready(){let g=apply(initialGame(),{type:'takeover',name:'Distribution',ceo:'CEO',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});g=apply(g,{type:'advance',minutes:180});g=apply(g,{type:'produce',qty:1000});g=apply(g,{type:'advance',minutes:500});return apply(g,{type:'release',id:g.lots.find(l=>l.item==='biscuit')!.id})}
describe('G06 regional sales',()=>{
 it('rejects locked region orders without changing state',()=>{const g=ready(),before=JSON.stringify(g);expect(regionAvailability(g,'export')).toBe(0);expect(()=>apply(g,{type:'sell',qty:100,credit:0,region:'export'})).toThrow();expect(JSON.stringify(g)).toBe(before)});
 it('charges regional transit and records delivery region',()=>{let g=ready();g.sold=5000;g.produced+=5000;g.reputation=35;g=apply(g,{type:'expandRegion',region:'regional'});g=apply(g,{type:'advance',minutes:1440-g.minute});const before=balance(g.journal,'cash'),at=g.minute;g=apply(g,{type:'sell',qty:100,credit:0,region:'regional'});const job=g.jobs.find(j=>j.kind==='delivery')!;expect(job.due-at).toBe(240);expect(before-balance(g.journal,'cash')).toBe(5500n);expect(g.market.regionCommitted.regional).toBe(100);expect(validRegionalCommitments(g)).toBe(true);g=apply(g,{type:'advance',minutes:240});expect(g.sales[0].region).toBe('regional');expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('preserves daily legacy commitment on migration',()=>{let g=apply(ready(),{type:'sell',qty:100,credit:0});const {market,...old}=g;const n=decodeSave(JSON.stringify(old));expect(n.operations.marketCommitted).toBe(100);expect(n.market.regionCommitted.local).toBe(100);expect(n.journal).toEqual(g.journal)});
});

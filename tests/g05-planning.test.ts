import {describe,it,expect} from 'vitest';
import {initialGame,apply,stock} from '../src/engine/game';
import {config} from '../src/content/scenario';
import {balance} from '../src/engine/ledger';
import {decodeSave} from '../src/persistence/codec';
function ready(){let g=apply(initialGame(),{type:'takeover',name:'Plant',ceo:'CEO',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});return apply(g,{type:'advance',minutes:180})}
describe('G05 reservations and scheduling',()=>{
 it('reserves atomically and releases without a journal change',()=>{let g=ready();const j=g.journal;g=apply(g,{type:'planBatch',qty:1000,delay:60});expect(stock(g,'flour')).toBe(0);expect(()=>apply(g,{type:'produce',qty:1000})).toThrow();expect(g.journal).toEqual(j);expect(decodeSave(JSON.stringify(g))).toEqual(g);g=apply(g,{type:'cancelPlan',id:g.plans[0].id});expect(stock(g,'flour')).toBe(75000);expect(g.journal).toEqual(j)});
 it('consumes scheduled materials once at the scheduled start',()=>{let g=apply(ready(),{type:'planBatch',qty:1000,delay:60});g=apply(g,{type:'advance',minutes:60});expect(g.plans).toHaveLength(0);expect(g.jobs.filter(j=>j.kind==='batch')).toHaveLength(1);expect(balance(g.journal,'raw')).toBe(0n);expect(balance(g.journal,'wip')).toBeGreaterThan(0n)});
 it('pauses WIP without running stages and resumes with remaining time',()=>{let g=apply(ready(),{type:'produce',qty:1000});const id=g.jobs.find(j=>j.kind==='batch')!.id;g=apply(g,{type:'pauseBatch',id});g=apply(g,{type:'advance',minutes:500});expect(g.produced).toBe(0);expect(decodeSave(JSON.stringify(g))).toEqual(g);g=apply(g,{type:'resumeBatch',id});g=apply(g,{type:'advance',minutes:500});expect(g.produced).toBeGreaterThan(0)});
});

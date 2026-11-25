import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {config} from '../src/content/scenario';
import {decodeSave} from '../src/persistence/codec';
function ready(){let g=apply(initialGame(),{type:'takeover',name:'Cost timing',ceo:'CEO',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});return apply(g,{type:'advance',minutes:180})}
describe('G05 actual batch cost and operating time',()=>{
 it('retains materials and energy and excludes paused time',()=>{let g=apply(ready(),{type:'produce',qty:1000});let j=g.jobs.find(j=>j.kind==='batch')!;expect(BigInt(j.materialCost!)+BigInt(j.energyCost!)).toBe(BigInt(j.cost));g=apply(g,{type:'advance',minutes:10});g=apply(g,{type:'pauseBatch',id:j.id});g=apply(g,{type:'advance',minutes:100});j=g.jobs.find(j=>j.kind==='batch')!;expect(j.activeMinutes).toBe(10);g=apply(g,{type:'resumeBatch',id:j.id});g=apply(g,{type:'advance',minutes:500});const b=g.batches[0];expect(b.completed-b.started-b.activeMinutes!).toBe(100);expect(BigInt(b.materialCost!)+BigInt(b.energyCost!)+BigInt(b.laborCost??'0')).toBe(BigInt(b.cost));expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('pauses at the exact operating permit expiry boundary',()=>{let g=ready();g.operations.permitUntil=g.minute+10;g=apply(g,{type:'produce',qty:1000});g=apply(g,{type:'advance',minutes:20});const j=g.jobs.find(j=>j.kind==='batch')!;expect(j.paused).toBe(true);expect(j.activeMinutes).toBe(10);expect(g.produced).toBe(0)});
});

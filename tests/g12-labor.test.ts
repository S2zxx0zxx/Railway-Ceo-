import {describe,it,expect} from 'vitest';
import {initialGame,apply,scheduledPayroll,catchUp} from '../src/engine/game';
import {balance,money} from '../src/engine/ledger';
import {config} from '../src/content/scenario';
import {financialReport} from '../src/engine/reports';
import {decodeSave} from '../src/persistence/codec';
import {chunkedCatchUp} from '../src/engine/offline';
function ready(){let g=apply(initialGame(60000),{type:'takeover',name:'Labor',ceo:'CEO',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});return apply(g,{type:'advance',minutes:180})}
describe('G12 production labor accounting',()=>{
 it('allocates active labor to WIP then finished and loss, without duplicate payroll',()=>{let g=ready();const wage=scheduledPayroll(g);g=apply(g,{type:'produce',qty:1000});g=apply(g,{type:'advance',minutes:500});const b=g.batches[0];const labor=wage*BigInt(b.activeMinutes!)/1440n;expect(BigInt(b.laborCost!)).toBe(labor);expect(BigInt(b.cost)).toBe(BigInt(b.materialCost!)+BigInt(b.energyCost!)+labor);expect(balance(g.journal,'wip')).toBe(0n);expect(balance(g.journal,'finished')+balance(g.journal,'loss')).toBe(BigInt(b.cost));g=apply(g,{type:'advance',minutes:1440-g.minute});expect(-balance(g.journal,'payroll')).toBe(money(config.arrears)+wage);expect(balance(g.journal,'wages')).toBe(wage-labor);expect(financialReport(g).balanced).toBe(true);expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('excludes paused time and charges actual accrued labor on cancellation',()=>{let g=apply(ready(),{type:'produce',qty:1000});const j=g.jobs.find(j=>j.kind==='batch')!,initial=BigInt(j.cost),rate=BigInt(j.laborRate!);g=apply(g,{type:'advance',minutes:10});g=apply(g,{type:'pauseBatch',id:j.id});g=apply(g,{type:'advance',minutes:60});g=apply(g,{type:'cancelBatch',id:j.id});expect(balance(g.journal,'loss')).toBe(initial+rate*10n/1440n);expect(balance(g.journal,'wip')).toBe(0n)});
 it('preserves exact journal across worker chunks and midnight',async()=>{let g=ready();g=apply(g,{type:'advance',minutes:1300-g.minute});g=apply(g,{type:'produce',qty:1000});g=apply(g,{type:'speed',value:1});const now=g.wall+600*60000;expect((await chunkedCatchUp(g,now,()=>Promise.resolve(),37)).game).toEqual(catchUp(g,now))});
});

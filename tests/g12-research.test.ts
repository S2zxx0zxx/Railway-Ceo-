import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {config} from '../src/content/scenario';
import {balance,money} from '../src/engine/ledger';
import {decodeSave,encodeSave} from '../src/persistence/codec';
function ready(){let g=apply(initialGame(),{type:'takeover',name:'Lab',ceo:'CEO',difficulty:'Realistic'});for(const item of config.audit)g=apply(g,{type:'audit',item});return g}
describe('G12 research projects',()=>{
 it('enforces prerequisites and completed projects rather than queued progress',()=>{let g=ready();expect(()=>apply(g,{type:'researchTrack',track:'quality'})).toThrow();g=apply(g,{type:'research'});expect(()=>apply(g,{type:'researchTrack',track:'quality'})).toThrow();g=apply(g,{type:'advance',minutes:1440});g=apply(g,{type:'researchTrack',track:'quality'});expect(g.researchTracks.quality).toBe(0);g=apply(g,{type:'advance',minutes:1440});expect(g.researchTracks.quality).toBe(1);g=apply(g,{type:'researchTrack',track:'shelfLife'});g=apply(g,{type:'advance',minutes:2880});expect(g.researchTracks.shelfLife).toBe(1);expect(decodeSave(encodeSave(g))).toEqual(g)});
 it('preserves elapsed research across pause/resume and charges only once',()=>{let g=ready(),cash=balance(g.journal,'cash');g=apply(g,{type:'research'});g=apply(g,{type:'advance',minutes:60});const id=g.jobs.find(j=>j.kind==='research')!.id;g=apply(g,{type:'pauseResearch',id});g=apply(g,{type:'advance',minutes:1500});expect(g.research).toBe(0);expect(decodeSave(encodeSave(g))).toEqual(g);g=apply(g,{type:'resumeResearch',id});g=apply(g,{type:'advance',minutes:1380});expect(g.research).toBe(1);expect(balance(g.journal,'cash')).toBe(cash-money(10000))});
 it('cancels without refund or completed level',()=>{let g=apply(ready(),{type:'research'});const cash=balance(g.journal,'cash'),id=g.jobs.find(j=>j.kind==='research')!.id;g=apply(g,{type:'cancelResearch',id});g=apply(g,{type:'advance',minutes:1440});expect(g.research).toBe(0);expect(balance(g.journal,'cash')).toBe(cash);expect(()=>apply(g,{type:'resumeResearch',id})).toThrow()});
});

import {describe,it,expect} from 'vitest';
import {officeForStage,officeStages} from '../src/ui/office-stages';
import {initialGame,stage} from '../src/engine/game';
describe('G03 office progression',()=>{
 it('maps initial company to the distressed office',()=>expect(officeForStage(stage(initialGame())).id).toBe(1));
 it('provides five unique local assets and a safe fallback',()=>{expect(new Set(officeStages.map(s=>s.asset)).size).toBe(5);for(let n=1;n<=5;n++)expect(officeForStage(n).asset).toBe('offices/stage-'+n+'.svg');expect(officeForStage(99).id).toBe(1)});
});

import {describe,it,expect} from 'vitest';
import {planElapsedTime} from '../src/engine/elapsed';
describe('G02 adapted wall-time mechanism',()=>{
 it('clamps backward clock jumps without creating simulated time',()=>{expect(planElapsedTime(60000,0,1440)).toEqual({clockAnomaly:true,elapsedMinutes:0,wasCapped:false,simulatedMinutes:0,skippedMinutes:0})});
 it('preserves minute flooring and caps excess',()=>{expect(planElapsedTime(0,179999,1)).toEqual({clockAnomaly:false,elapsedMinutes:2,wasCapped:true,simulatedMinutes:1,skippedMinutes:1})});
 it('retains exact cap and rejects invalid inputs',()=>{expect(planElapsedTime(0,60000,1).wasCapped).toBe(false);expect(()=>planElapsedTime(0,NaN,1)).toThrow();expect(()=>planElapsedTime(0,60000,-1)).toThrow()});
});

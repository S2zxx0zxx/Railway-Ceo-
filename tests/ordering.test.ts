import {describe,it,expect} from 'vitest';
import {economicOrderQuantity} from '../src/engine/ordering';
describe('EOQ reference vectors',()=>{
 it('matches Stockpyl Example 3.1',()=>{const x=economicOrderQuantity(8,.225,1300);expect(x.quantity).toBeCloseTo(304.0467800264368,9);expect(x.annualCost).toBeCloseTo(68.41052550594829,9)});
 it('returns zero at zero demand',()=>{expect(economicOrderQuantity(8,.225,0)).toEqual({quantity:0,annualCost:0})});
 it('rejects nonfinite and invalid assumptions',()=>{expect(()=>economicOrderQuantity(8,0,1300)).toThrow();expect(()=>economicOrderQuantity(8,.225,-1)).toThrow();expect(()=>economicOrderQuantity(Infinity,.225,1300)).toThrow()});
});

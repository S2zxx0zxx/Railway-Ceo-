import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {executiveReview} from '../src/engine/executive';
import {decodeSave} from '../src/persistence/codec';
import {money} from '../src/engine/ledger';
const acquired=()=>apply(initialGame(),{type:'takeover',name:'Test',ceo:'CEO',difficulty:'Realistic'});
describe('G01 company management',()=>{
 it('allows identity decisions without changing cash or ledger',()=>{const g=acquired(),n=apply(g,{type:'identity',name:'New Company',brand:'New Biscuit'});expect(n.name).toBe('New Company');expect(n.brand).toBe('New Biscuit');expect(n.journal).toEqual(g.journal);expect(n.news[0]).toContain('Owner approved');expect(decodeSave(JSON.stringify(n))).toEqual(n)});
 it('rejects empty and duplicate identity actions',()=>{const g=acquired();expect(()=>apply(g,{type:'identity',name:' ',brand:'Test'})).toThrow();expect(()=>apply(g,{type:'identity',name:g.name,brand:g.brand})).toThrow()});
 it('migrates older saves without removing existing data',()=>{const g=acquired();const {brand,...legacy}=g;expect(decodeSave(JSON.stringify(legacy))).toEqual(g)});
 it('derives executive risk and wage runway from ledger',()=>{const g=acquired(),a=executiveReview(g);expect(a.cash).toBe(money(300000));expect(a.wageRunwayDays).toBe(15n);expect(a.netBookEquity).toBe(-money(280000));expect(a.issues.find(x=>x.id==='machinery')?.active).toBe(true);const n=apply(g,{type:'repay',rupees:100000});expect(executiveReview(n).wageRunwayDays).toBe(10n)});
});

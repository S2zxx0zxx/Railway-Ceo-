import {describe,it,expect} from 'vitest';
import {initialGame,apply,catchUp} from '../src/engine/game';
import {balance,profit} from '../src/engine/ledger';
function acquired(){return apply(initialGame(),{type:'takeover',name:'Test',ceo:'CEO',difficulty:'Realistic'})}
describe('management policies',()=>{
 it('requires an appointed manager',()=>{expect(()=>apply(acquired(),{type:'automation',enabled:true})).toThrow()});
 it('manager purchases through the same ledger with reserve',()=>{let g=apply(acquired(),{type:'hire',role:'manager'});g=apply(g,{type:'assignManager',authority:{employeeId:g.employees.find(e=>e.role==='manager')!.id,department:'procurement',dailyLimit:25000,approvalAbove:25000,enabled:true}});g=apply(g,{type:'automation',enabled:true});g=apply(g,{type:'advance',minutes:1440});expect(g.jobs.filter(j=>j.kind==='receipt').length).toBe(4);expect(balance(g.journal,'cash')).toBeGreaterThan(5000000n)});
 it('training costs real cash and staff skill increases',()=>{let g=acquired();const e=g.employees[0];g=apply(g,{type:'train',id:e.id});expect(g.employees[0].skill).toBe(e.skill+5);expect(profit(g.journal)).toBe(-300000n)});
 it('retains fractional elapsed minutes across frequent resumes',()=>{let g=apply(acquired(),{type:'speed',value:1});g=catchUp(g,30000);expect(g.minute).toBe(0);g=catchUp(g,60000);expect(g.minute).toBe(1)});
 it('rejects crisis closure until underlying issue is fixed',()=>{let g=apply(acquired(),{type:'advance',minutes:1440});const c=g.crises.find(c=>c.kind==='machine')!;expect(c).toBeDefined();expect(()=>apply(g,{type:'resolveCrisis',id:c.id})).toThrow()});
});

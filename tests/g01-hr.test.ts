import {describe,it,expect} from 'vitest';
import {initialGame,apply,scheduledPayroll,employeeDailyPay,laborAvailability} from '../src/engine/game';
import {money,balance} from '../src/engine/ledger';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'HR Test',ceo:'CEO',difficulty:'Realistic'});
describe('G01 staff and safety management',()=>{
 it('requires training before overtime and accrues overtime wages',()=>{let g=start(),id=g.employees[0].id;expect(()=>apply(g,{type:'shift',id,hours:12})).toThrow();g=apply(g,{type:'safetyTraining',id});g=apply(g,{type:'shift',id,hours:12});expect(employeeDailyPay(g.employees[0])).toBe(money(1400));const wages=scheduledPayroll(g),old=balance(g.journal,'payroll');g=apply(g,{type:'advance',minutes:1440});expect(balance(g.journal,'payroll')).toBe(old-wages);expect(g.employees[0].fatigue).toBe(16)});
 it('promotes qualified staff with a real recurring wage change',()=>{let g=start(),e=g.employees.find(e=>e.skill>=75)!;g=apply(g,{type:'promote',id:e.id});const next=g.employees.find(x=>x.id===e.id)!;expect(next.grade).toBe(2);expect(next.wage).toBe(920);expect(next.morale).toBe(e.morale+10)});
 it('fatigue reduces effective labor and rest restores attendance',()=>{let g=start(),id=g.employees[0].id;g=apply(g,{type:'safetyTraining',id});g=apply(g,{type:'shift',id,hours:12});g=apply(g,{type:'advance',minutes:5*1440});expect(g.employees[0].present).toBe(false);expect(laborAvailability(g).present).toBe(23);g=apply(g,{type:'shift',id,hours:8});g=apply(g,{type:'advance',minutes:1440});expect(g.employees[0].present).toBe(true)});
 it('round trips persisted HR attributes',()=>{let g=start();g=apply(g,{type:'safetyTraining',id:g.employees[0].id});expect(decodeSave(JSON.stringify(g))).toEqual(g)});
});

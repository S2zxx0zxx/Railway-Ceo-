import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {balance,money} from '../src/engine/ledger';
import {makeLoan,loanSchedule} from '../src/engine/banking';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'Bank',ceo:'CEO',difficulty:'Realistic'});
describe('G04 banking schedules',()=>{
 it('allocates every paise over six installments and reports due principal',()=>{const l=makeLoan('fixture',1001n,0),s=loanSchedule(l,30*1440);expect(s.rows.reduce((n,r)=>n+r.principal,0n)).toBe(1001n);expect(s.due).toBe(166n);expect(s.maturity).toBe(180*1440)});
 it('tracks principal repayments and oldest loan first',()=>{let g={...start(),reputation:25};g=apply(g,{type:'loan',rupees:100000});g=apply(g,{type:'repay',rupees:10000});expect(g.loans[0].remaining).toBe(String(money(1390000)));expect(g.loans[1].remaining).toBe(String(money(100000)));expect(g.loans.reduce((n,l)=>n+BigInt(l.remaining),0n)).toBe(-balance(g.journal,'debt'));expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('restructures due principal without inventing money or forgiving debt',()=>{let g=apply(start(),{type:'advance',minutes:30*1440});const id=g.loans[0].id,journal=g.journal;g=apply(g,{type:'restructureLoan',id});expect(g.journal).toEqual(journal);expect(g.loans[0].termDays).toBe(360);expect(loanSchedule(g.loans[0],g.minute).due).toBe(0n);expect(()=>apply(g,{type:'restructureLoan',id})).toThrow()});
 it('migrates legacy aggregate debt without changing the journal',()=>{const g=start(),{loans,...old}=g;const n=decodeSave(JSON.stringify(old));expect(n.journal).toEqual(g.journal);expect(n.loans[0].remaining).toBe(String(money(1400000)))});
});

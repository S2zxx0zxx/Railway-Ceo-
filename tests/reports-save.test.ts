import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {financialReport,replenishment} from '../src/engine/reports';
import {decodeSave} from '../src/persistence/codec';
import {balance} from '../src/engine/ledger';
const acquired=()=>apply(initialGame(),{type:'takeover',name:'Test',ceo:'CEO',difficulty:'Realistic'});
describe('financial reports and save codec',()=>{
 it('balances opening and financing, and reconciles cash movements',()=>{let g=acquired();g={...g,reputation:25};g=apply(g,{type:'loan',rupees:100000});g=apply(g,{type:'purchase',item:'flour',qty:1000});g=apply(g,{type:'advance',minutes:180});const r=financialReport(g);expect(r.balanced).toBe(true);expect(r.cashFlow.financing).toBe(10000000n);expect(Object.values(r.cashFlow).reduce((a,b)=>a+b,0n)).toBe(balance(g.journal,'cash'));expect(r.revenue).toBe(0n)});
 it('includes incoming stock when planning replenishment',()=>{let g=acquired();const before=replenishment(g,'flour');g=apply(g,{type:'purchase',item:'flour',qty:1000});expect(replenishment(g,'flour').recommended).toBe(before.recommended-1000)});
 it('round trips valid saves and rejects corrupt state',()=>{const g=acquired();expect(decodeSave(JSON.stringify(g))).toEqual(g);expect(()=>decodeSave(JSON.stringify({...g,price:0}))).toThrow();expect(()=>decodeSave(JSON.stringify({...g,jobs:[{id:'bad',kind:'repair',due:10,qty:0,cost:'0',machine:999}]}))).toThrow();expect(()=>decodeSave(JSON.stringify({...g,journal:[]}))).toThrow()});
});

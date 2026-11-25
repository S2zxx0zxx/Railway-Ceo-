import {describe,it,expect} from 'vitest';
import {initialGame,apply} from '../src/engine/game';
import {balance,money} from '../src/engine/ledger';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'Distressed firm',ceo:'CEO',difficulty:'Hardcore'});
describe('G07 terminal company and restart',()=>{
 it('rejects restart of a live company',()=>{expect(()=>apply(start(),{type:'restartCompany'})).toThrow()});
 it('freezes a liquidated company at its actual terminal minute and retains the ledger',()=>{let g=start();g=apply(g,{type:'advance',minutes:60*1440});expect(g.status).toBe('liquidated');expect(g.minute).toBeLessThan(60*1440);expect(g.speed).toBe(0);expect(balance(g.journal,'debt')).toBe(-money(1400000));expect(()=>apply(g,{type:'advance',minutes:1440})).toThrow();expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('creates a separate opening company without mutating the old record',()=>{const old=apply(start(),{type:'advance',minutes:60*1440}),snapshot=JSON.stringify(old),fresh=apply(old,{type:'restartCompany'});expect(fresh.governance.companyId).not.toBe(old.governance.companyId);expect(fresh.accepted).toBe(false);expect(fresh.minute).toBe(0);expect(fresh.revision).toBe(old.revision+1);expect(JSON.stringify(old)).toBe(snapshot);expect(balance(fresh.journal,'cash')).toBe(money(300000))});
});

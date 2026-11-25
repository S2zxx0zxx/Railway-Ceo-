import {describe,it,expect} from 'vitest';
import {initialGame,apply,throughput,stock,assertState} from '../src/engine/game';
import {balance,money,profit} from '../src/engine/ledger';
import {config} from '../src/content/scenario';
import {decodeSave} from '../src/persistence/codec';
const start=()=>apply(initialGame(),{type:'takeover',name:'Engineering',ceo:'CEO',difficulty:'Realistic'});
function ready(){let g=start();for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});return apply(g,{type:'advance',minutes:180})}
describe('G01 engineering and batch control',()=>{
 it('capitalizes an upgrade and installs it only after downtime',()=>{let g=ready(),before=balance(g.journal,'equipment'),p=profit(g.journal);g=apply(g,{type:'upgradeMachine',machine:1});expect(balance(g.journal,'equipment')).toBe(before+money(30000));expect(profit(g.journal)).toBe(p);expect(g.machines[1].level).toBe(1);expect(throughput(g)).toBe(0);expect(()=>apply(g,{type:'upgradeMachine',machine:1})).toThrow();g=apply(g,{type:'advance',minutes:240});expect(g.machines[1].level).toBe(2);expect(g.machines[1].lastService).toBe(g.minute);expect(throughput(g)).toBeGreaterThan(0);expect(decodeSave(JSON.stringify(g))).toEqual(g)});
 it('cancels consumed WIP without refunding raw stock or cash',()=>{let g=ready();g=apply(g,{type:'produce',qty:1000});const batch=g.jobs.find(j=>j.kind==='batch')!,loss=balance(g.journal,'loss'),cash=balance(g.journal,'cash');g=apply(g,{type:'cancelBatch',id:batch.id});expect(balance(g.journal,'loss')).toBe(loss+BigInt(batch.cost));expect(balance(g.journal,'wip')).toBe(0n);expect(balance(g.journal,'cash')).toBe(cash);expect(stock(g,'flour')).toBe(0);expect(()=>apply(g,{type:'cancelBatch',id:batch.id})).toThrow();assertState(g)});
 it('supports preventive service of a healthy machine after the service interval',()=>{let g=ready();g=apply(g,{type:'advance',minutes:8*1440});g=apply(g,{type:'repair',machine:2});expect(g.machines[2].readyAt).toBe(g.minute+config.repairMinutes);g=apply(g,{type:'advance',minutes:config.repairMinutes});expect(g.machines[2].lastService).toBe(g.minute)});
});

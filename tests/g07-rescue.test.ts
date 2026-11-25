import {describe,it,expect} from 'vitest';
import {initialGame,apply,scheduledPayroll} from '../src/engine/game';
import {updateRescue,distressSignals} from '../src/engine/rescue';
import {balance,money,profit} from '../src/engine/ledger';
import {config,type Difficulty} from '../src/content/scenario';
const start=(difficulty:Difficulty='Realistic')=>apply(initialGame(),{type:'takeover',name:'Rescue',ceo:'CEO',difficulty});
describe('G07 rescue progression',()=>{
 it('uses distinct difficulty windows with finite liquidation',()=>{for(const d of config.difficulties){const g=start(d);const rules=config.rescue[d];for(let day=1;day<=rules.liquidation;day++){g.minute=day*1440;updateRescue(g,money(1000000));if(day===rules.default)expect(g.rescue.phase).toBe('default');if(day===rules.default+1)expect(g.rescue.phase).toBe('restructuring')}expect(g.status).toBe('liquidated');expect(g.speed).toBe(0)}});
 it('assistance is one-time owner equity and cannot erase debt',()=>{let g=start('Beginner');updateRescue(g,money(1000000));const before=balance(g.journal,'cash'),p=profit(g.journal),debt=balance(g.journal,'debt');g=apply(g,{type:'beginnerAssistance'});expect(balance(g.journal,'cash')).toBe(before+money(75000));expect(profit(g.journal)).toBe(p);expect(balance(g.journal,'debt')).toBe(debt);expect(()=>apply(g,{type:'beginnerAssistance'})).toThrow()});
 it('records audit milestone once and retains original identity',()=>{let g=start();for(const item of config.audit)g=apply(g,{type:'audit',item});expect(g.rescue.milestones.filter(m=>m.id==='audit')).toHaveLength(1);g=apply(g,{type:'audit',item:config.audit[0]});expect(g.rescue.milestones.filter(m=>m.id==='audit')).toHaveLength(1);expect(()=>apply(g,{type:'takeover',name:'Again',ceo:'CEO',difficulty:'Hardcore'})).toThrow()});
 it('recognizes due principal and arrears without recognizing fake cash',()=>{const g=start();g.minute=30*1440;const s=distressSignals(g,scheduledPayroll(g));expect(s.principalDue).toBeGreaterThan(0n);expect(s.immediate).toBeGreaterThan(s.wages);expect(s.cash).toBe(money(config.cash))});
});

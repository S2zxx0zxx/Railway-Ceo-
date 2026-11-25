import {describe,it,expect} from 'vitest';
import {initialGame,apply,catchUp} from '../src/engine/game';
import {chunkedCatchUp} from '../src/engine/offline';
import {config} from '../src/content/scenario';
function start(){return apply(initialGame(60000),{type:'takeover',name:'Clock',ceo:'CEO',difficulty:'Realistic'})}
describe('G08 clock and deterministic worker proposals',()=>{
 it('matches single catch-up across chunk sizes and preserves the source',async()=>{const g=apply(start(),{type:'speed',value:5}),snapshot=JSON.stringify(g),now=g.wall+24*60*60000;for(const n of [60,360,1440]){const result=await chunkedCatchUp(g,now,()=>Promise.resolve(),n);expect(result.game).toEqual(catchUp(g,now));expect(result.report.advancedGameMinutes).toBe(7200)}expect(JSON.stringify(g)).toBe(snapshot)});
 it('consumes elapsed time once, retains fractional minutes and caps excess',async()=>{const g=apply(start(),{type:'speed',value:1}),now=g.wall+3*86400000+1234;const a=await chunkedCatchUp(g,now);expect(a.report.skippedRealMinutes).toBe(2880);expect(a.game.wall).toBe(now);expect((await chunkedCatchUp(a.game,now)).game).toEqual(a.game);const b=await chunkedCatchUp(a.game,now+90000);expect(b.game.wall).toBe(now+60000)});
 it('keeps paused saves paused and rejects backwards clock progress',async()=>{const g=start(),a=await chunkedCatchUp(g,g.wall+86400000);expect(a.game.minute).toBe(0);expect(a.game.wall).toBe(g.wall+86400000);expect(a.report.paused).toBe(true);const b=await chunkedCatchUp(a.game,0);expect(b.game).toEqual(a.game);expect(b.report.clockAnomaly).toBe(true)});
 it('replays actual procurement and scheduled production across chunk boundaries',async()=>{let g=start();for(const item of config.audit)g=apply(g,{type:'audit',item});for(const machine of [2,4])g=apply(g,{type:'repair',machine});for(const item of config.materials)g=apply(g,{type:'purchase',item,qty:config.bom[item]*1000});g=apply(g,{type:'advance',minutes:180});g=apply(g,{type:'planBatch',qty:1000,delay:37});g=apply(g,{type:'speed',value:1});const now=g.wall+600*60000;expect((await chunkedCatchUp(g,now,()=>Promise.resolve(),37)).game).toEqual(catchUp(g,now))});
});

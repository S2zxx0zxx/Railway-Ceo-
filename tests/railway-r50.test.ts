import {describe,it,expect} from 'vitest';
import {stressFleet} from '../tools/stress/railway-stress';
import {writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runScenario} from '../tools/balance/railway-lab';
describe('R50 synthetic stress and deterministic replay',()=>{
 it('four-train shared demand/cash/stock and event cap; partition-equivalent replay',async()=>{
  const a=await stressFleet(4,1),b=await stressFleet(4,64);
  expect(a.checksum).toBe(b.checksum);expect(a.metrics).toEqual(b.metrics);expect(a.settlements).toBe(4);expect(a.batches).toBeGreaterThan(b.batches);
 },120000);
 it('eight-train bulk workload drains without duplicate settlement',async()=>{const a=await stressFleet(8,3);expect(a.settlements).toBe(8);expect(a.metrics.reservedMinor).toBe('0');},120000);
});
if(process.env.R50_STRESS_EVIDENCE){
 it('measure scaled fleet and seeded long-horizon partition replay',async()=>{
  const dir=process.env.R50_STRESS_EVIDENCE!;mkdirSync(dir,{recursive:true});const rows:Awaited<ReturnType<typeof stressFleet>>[]=[],replays:unknown[]=[],failures:unknown[]=[];
  for(const n of [8,16,32]){try{const a=await stressFleet(n,4),b=await stressFleet(n,256);rows.push(a,b);expect(a.checksum).toBe(b.checksum);expect(a.metrics).toEqual(b.metrics);}catch(e){failures.push({n,error:String(e)});}}
  for(const [seed,days,kind] of [[6,90,'energy-shock'],[9,30,'bankruptcy'],[10,90,'idle-offline']] as const){try{const a=await runScenario(seed,days,kind),b=await runScenario(seed,days,kind,'narrow');expect(a.checksum).toBe(b.checksum);expect(a.metrics).toEqual(b.metrics);replays.push({seed,days,kind,checksum:a.checksum,audits:a.audits+b.audits});}catch(e){failures.push({seed,days,kind,error:String(e)});}}
  const report={node:process.version,platform:process.platform,arch:process.arch,scope:'synthetic runner measurements; heap is process-wide sampled, not device RAM',rows,replays,failures,productionAccepted:false};const bytes=JSON.stringify(report,null,2)+'\n';writeFileSync(dir+'/stress.json',bytes);console.log('R50_REPORT_SHA256 '+createHash('sha256').update(bytes).digest('hex'));console.log('R50_SUMMARY '+JSON.stringify({rows:rows.map(({n,eventBudget,audits,batches,events,settlements,peakPending,peakSnapshotBytes,peakHeapUsedBytes,quoteMs,dispatchMs,batchP95Ms,elapsedMs,checksum})=>({n,eventBudget,audits,batches,events,settlements,peakPending,peakSnapshotBytes,peakHeapUsedBytes,quoteMs,dispatchMs,batchP95Ms,elapsedMs,checksum})),replays,failures}));
  expect(failures).toEqual([]);expect(rows).toHaveLength(6);expect(replays).toHaveLength(3);
 },900000);
}

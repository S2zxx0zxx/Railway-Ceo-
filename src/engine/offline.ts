import {advanceInPlace,catchUpPlan,finishCatchUp,type Game} from './game';
import {balance,profit,netRevenue} from './ledger';
export type ReturnReport={elapsedRealMinutes:number;skippedRealMinutes:number;clockAnomaly:boolean;requestedGameMinutes:number;advancedGameMinutes:number;paused:boolean;liquidated:boolean;produced:number;sold:number;cashChange:string;revenueChange:string;expenseChange:string;profitChange:string;newCrises:number;newMilestones:number;batchActiveMinutes:number;batchElapsedMinutes:number};
export function summarizeReturn(before:Game,after:Game,plan:ReturnType<typeof catchUpPlan>):ReturnReport{
 const revenueChange=netRevenue(after.journal)-netRevenue(before.journal),profitChange=profit(after.journal)-profit(before.journal);
 const completed=after.batches.filter(b=>b.completed>before.minute&&b.activeMinutes!==undefined);
 return {elapsedRealMinutes:plan.elapsedMinutes,skippedRealMinutes:plan.running?plan.skippedMinutes:0,clockAnomaly:plan.clockAnomaly,requestedGameMinutes:plan.minutes,advancedGameMinutes:after.minute-before.minute,paused:!plan.running,liquidated:after.status==='liquidated',produced:after.produced-before.produced,sold:after.sold-before.sold,cashChange:String(balance(after.journal,'cash')-balance(before.journal,'cash')),revenueChange:String(revenueChange),expenseChange:String(revenueChange-profitChange),profitChange:String(profitChange),newCrises:after.crises.filter(c=>c.opened>before.minute).length,newMilestones:after.rescue.milestones.filter(m=>m.minute>before.minute).length,batchActiveMinutes:completed.reduce((n,b)=>n+b.activeMinutes!,0),batchElapsedMinutes:completed.reduce((n,b)=>n+b.completed-b.started,0)};
}
export async function chunkedCatchUp(source:Game,now:number,yieldControl:()=>Promise<void>=()=>Promise.resolve(),chunkMinutes=360){
 if(!Number.isSafeInteger(chunkMinutes)||chunkMinutes<1||chunkMinutes>1440)throw Error('Invalid simulation chunk');
 const plan=catchUpPlan(source,now),game=structuredClone(source);
 let left=plan.minutes;
 while(left>0&&game.status!=='liquidated'){const step=Math.min(left,chunkMinutes);advanceInPlace(game,step);left-=step;if(left>0&&game.status!=='liquidated')await yieldControl()}
 finishCatchUp(game,plan,source.minute);
 return {game,report:summarizeReturn(source,game,plan)};
}
export type CatchUpResult=Awaited<ReturnType<typeof chunkedCatchUp>>;

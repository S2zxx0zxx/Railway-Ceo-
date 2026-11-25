/**
 * Wall-time planning adapted from ciefa/idle-game-template,
 * src/game/engine/offline.ts, a91cd5f8a26cdffd3f1803297c9a92c0a7f850c4 (MIT).
 * Copyright (c) 2026 ciefa. Full license in docs/third-party/idle-game-template-LICENSE.txt.
 * Keep The CEO's integer-minute clock, configured cap, and monotonic wall baseline.
 * No upstream tick, game state, combat or uncapped training is imported.
 */
export function planElapsedTime(lastSavedTime:number,currentTime:number,capMinutes:number){
 if(![lastSavedTime,currentTime,capMinutes].every(v=>Number.isSafeInteger(v)&&v>=0)||capMinutes>Number.MAX_SAFE_INTEGER/60000)throw Error('Invalid elapsed time inputs');
 const raw=currentTime-lastSavedTime;
 const clockAnomaly=raw<0;
 const elapsedMs=clockAnomaly?0:raw;
 const elapsedMinutes=Math.floor(elapsedMs/60000);
 const wasCapped=elapsedMinutes>capMinutes;
 const simulatedMinutes=Math.min(elapsedMinutes,capMinutes);
 return {clockAnomaly,elapsedMinutes,wasCapped,simulatedMinutes,skippedMinutes:elapsedMinutes-simulatedMinutes};
}

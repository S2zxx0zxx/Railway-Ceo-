import type {Game} from '../engine/game';
import type {CatchUpResult} from '../engine/offline';
export type WorkerRequest={type:'catchUp';game:Game;now:number};
export type WorkerReply={ok:true;result:CatchUpResult}|{ok:false;error:string};

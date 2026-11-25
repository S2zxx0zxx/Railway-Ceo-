import type {Material,SupplierId} from '../content/scenario';
export type PurchaseRecord={id:string;item:Material;supplier:SupplierId;qty:number;cost:string;placed:number;due:number;credit:number;status:'inTransit'|'accepted'|'held'|'canceled';closed?:number;lotId?:string};
export type ServiceRecord={id:string;machine:number;kind:'service'|'upgrade';cost:string;started:number;completed:number};
export type UtilityState={power:boolean;water:boolean};

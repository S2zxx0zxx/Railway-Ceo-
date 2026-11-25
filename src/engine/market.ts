import {config,type Difficulty,type Material} from '../content/scenario';
import type {Game} from './game';
export type RegionId=typeof config.market.regions[number]['id'];
export type Competitor={id:string;name:string;strategy:'value'|'balanced'|'premium';price:number;brand:number;quality:number;cash:number;stock:number;capacity:number;lastSold:number};
export type Shock={kind:'inflation'|'shortage'|'slowdown'|'festival';day:number;untilDay:number};
export type Campaign={id:string;budget:string;started:number;until:number;boostBps:number;stopped?:number};
export type MarketState={day:number;total:number;commodity:Record<Material,number>;shock:Shock|null;shockHistory:Shock[];campaigns:Campaign[];regions:RegionId[];activeRegions:RegionId[];competitors:Competitor[];last:{day:number;total:number;player:number;rivals:number;unmet:number}|null};
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
export const regionInfo=(id:RegionId)=>config.market.regions.find(r=>r.id===id);
export function marketTotal(regions:RegionId[],difficulty:Difficulty,day:number,shock=100){
 const base=regions.reduce((n,r)=>n+(regionInfo(r)?.demand??0),0);
 const seasonal=100+Math.round(12*Math.sin(day*2*Math.PI/30));
 return Math.floor(base*config.market.difficulty[difficulty]*seasonal*shock/1000000);
}
export function initialMarket(day=0,difficulty:Difficulty='Realistic',legacyCommitted=0):MarketState{
 return {day,total:Math.max(legacyCommitted,marketTotal(['local'],difficulty,day)),commodity:{flour:100,sugar:100,oil:100,packaging:100},shock:null,shockHistory:[],campaigns:[],regions:['local'],activeRegions:['local'],last:null,competitors:[
 {id:'rival-value',name:'Value Bake',strategy:'value',price:750,brand:40,quality:74,cash:10000000,stock:3000,capacity:3000,lastSold:0},
 {id:'rival-balanced',name:'Union Biscuits',strategy:'balanced',price:900,brand:55,quality:85,cash:15000000,stock:3500,capacity:3500,lastSold:0},
 {id:'rival-premium',name:'Crown Bakery',strategy:'premium',price:1100,brand:65,quality:94,cash:20000000,stock:2500,capacity:2500,lastSold:0}
 ]};
}
/** Stable logit weights; rounded integer quotas cannot exceed the fixed daily market. */
export function allocate(total:number,scores:number[]):number[]{
 if(!Number.isSafeInteger(total)||total<0||!scores.length||scores.some(s=>!Number.isFinite(s)))throw Error('Invalid market inputs');
 const max=Math.max(...scores),weights=scores.map(s=>Math.exp(s-max)),sum=weights.reduce((a,b)=>a+b,0);
 const exact=weights.map(w=>w/sum*total),out=exact.map(Math.floor);
 const order=exact.map((v,i)=>({i,f:v-out[i]})).sort((a,b)=>b.f-a.f||a.i-b.i);
 for(let i=0,left=total-out.reduce((a,b)=>a+b,0);i<left;i++)out[order[i].i]++;
 return out;
}
const score=(price:number,brand:number,quality:number,boost=0)=>-config.market.elasticity*Math.log(price/config.initialPrice)+brand/130+(quality-80)/150+boost;
export function marketView(g:Game){
 const m=g.market, committed=g.operations.marketDay===m.day?g.operations.marketCommitted:0;
 const quality=g.batches.length?g.batches[g.batches.length-1].quality:85;
 const campaign=m.campaigns.find(c=>c.stopped===undefined&&c.until>g.minute);const boost=g.campaignUntil>g.minute?(campaign?.boostBps??2500)/10000:0;
 const scores=[score(g.price,g.reputation,quality,boost),...m.competitors.map(c=>score(c.price,c.brand,c.quality))];
 const quota=allocate(m.total,scores),player=Math.min(m.total,Math.max(committed,quota[0])),remaining=m.total-player;
 const rivalShares=allocate(remaining,scores.slice(1)).map((n,i)=>Math.min(n,m.competitors[i].stock));
 const unmet=remaining-rivalShares.reduce((a,b)=>a+b,0);
 return {total:m.total,player,available:Math.max(0,player-committed),committed,rivalShares,unmet};
}
export function closeMarketDay(g:Game,day:number,random:()=>number){
 const m=g.market,committed=Math.min(m.total,g.operations.marketCommitted);
 const shares=allocate(m.total-committed,m.competitors.map(c=>score(c.price,c.brand,c.quality)));
 let sold=0;
 for(let i=0;i<m.competitors.length;i++){
  const c=m.competitors[i],n=Math.min(c.stock,shares[i]);c.lastSold=n;sold+=n;c.stock-=n;c.cash=Math.min(config.market.cashCap,c.cash+n*c.price);
  const utilization=n/c.capacity,step=c.strategy==='value'?15:c.strategy==='premium'?25:20;
  c.price=clamp(c.price+(utilization>.85?step:utilization<.4?-step:0)+Math.floor(random()*11)-5,600,1200);
  c.brand=clamp(c.brand+(utilization>.7?1:utilization<.2?-1:0),0,100);
  const production=Math.min(c.capacity,config.market.stockCap-c.stock,Math.floor(c.cash/config.market.unitCost));c.cash-=production*config.market.unitCost;c.stock+=production;
 }
 m.last={day:m.day,total:m.total,player:committed,rivals:sold,unmet:m.total-committed-sold};
 m.day=day;m.activeRegions=[...m.regions];m.total=marketTotal(m.activeRegions,g.difficulty,day);
 g.competitorPrice=Math.round(m.competitors.reduce((n,c)=>n+c.price,0)/m.competitors.length);
}
export function validMarket(m:MarketState,minute:number){
 const integer=(v:number,lo:number,hi:number)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
 return !!m&&m.day===Math.floor(minute/1440)&&integer(m.total,0,1000000)&&Array.isArray(m.regions)&&Array.isArray(m.activeRegions)&&m.regions[0]==='local'&&m.activeRegions[0]==='local'&&new Set(m.regions).size===m.regions.length&&new Set(m.activeRegions).size===m.activeRegions.length&&m.regions.every((r,i)=>r===config.market.regions[i]?.id)&&m.activeRegions.every((r,i)=>r===m.regions[i])&&Array.isArray(m.competitors)&&m.competitors.length===3&&m.competitors.every((c,i)=>c.id===['rival-value','rival-balanced','rival-premium'][i]&&c.strategy===['value','balanced','premium'][i]&&typeof c.name==='string'&&c.name.length>0&&c.name.length<=80&&integer(c.price,600,1200)&&integer(c.brand,0,100)&&integer(c.quality,0,100)&&integer(c.cash,0,config.market.cashCap)&&integer(c.stock,0,config.market.stockCap)&&integer(c.capacity,1,config.market.stockCap)&&integer(c.lastSold,0,config.market.stockCap))&&(m.last===null||integer(m.last.day,0,m.day-1)&&[m.last.total,m.last.player,m.last.rivals,m.last.unmet].every(v=>integer(v,0,1000000))&&m.last.player+m.last.rivals+m.last.unmet===m.last.total);
}

export function updateEconomicConditions(g:Game,random:()=>number){
 const m=g.market,day=m.day;
 if(m.shock&&day>=m.shock.untilDay)m.shock=null;
 if(!m.shock&&day>=3&&random()<config.market.shockChance[g.difficulty]){
  const kinds=['inflation','shortage','slowdown','festival'] as const;
  m.shock={kind:kinds[Math.floor(random()*kinds.length)],day,untilDay:day+3};
  m.shockHistory.push({...m.shock});m.shockHistory=m.shockHistory.slice(-120);
 }
 for(const item of config.materials){
  const prev=m.commodity[item], drift=Math.sign(100-prev), pressure=m.shock?.kind==='inflation'?3:m.shock?.kind==='shortage'&&item==='oil'?5:0;
  m.commodity[item]=clamp(prev+drift+Math.floor(random()*5)-2+pressure,75,150);
 }
 const demandFactor=m.shock?.kind==='slowdown'?80:m.shock?.kind==='festival'?120:100;
 m.total=marketTotal(m.activeRegions,g.difficulty,day,demandFactor);
}
export function activeCampaign(g:Game){return g.market.campaigns.find(c=>c.stopped===undefined&&c.until>g.minute)}
export function validEconomy(m:MarketState,minute:number){
 const int=(n:number,min:number,max:number)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
 const shock=(s:Shock)=>['inflation','shortage','slowdown','festival'].includes(s.kind)&&int(s.day,0,m.day)&&s.untilDay===s.day+3;
 return !!m.commodity&&config.materials.every(item=>int(m.commodity[item],75,150))&&(m.shock===null||shock(m.shock)&&m.shock.untilDay>m.day)&&Array.isArray(m.shockHistory)&&m.shockHistory.length<=120&&m.shockHistory.every(shock)&&Array.isArray(m.campaigns)&&m.campaigns.length<=10000&&new Set(m.campaigns.map(c=>c.id)).size===m.campaigns.length&&m.campaigns.every(c=>typeof c.id==='string'&&c.id.length>0&&/^[1-9][0-9]{0,12}$/.test(c.budget)&&BigInt(c.budget)>=BigInt(config.market.campaignMin)*100n&&BigInt(c.budget)<=BigInt(config.market.campaignMax)*100n&&int(c.started,0,minute)&&[1,3,7].includes((c.until-c.started)/1440)&&int(c.boostBps,500,4500)&&(c.stopped===undefined||int(c.stopped,c.started,Math.min(minute,c.until))))&&m.campaigns.filter(c=>c.stopped===undefined&&c.until>minute).length<=1;
}

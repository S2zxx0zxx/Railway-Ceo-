import { integer, checkedAdd, minor, energyQuantity, basisPoints } from '../../domain/units';
import { object, list, distinct, id, sha256, text, version1, nullable, enumeration, record, type Decoder, type Registry } from '../../domain/validation';
import type { SimEvent } from '../../domain/models';
import type { RailGraph } from '../graph';
import type { RollingStockCatalog } from '../catalog';
import { canonicalRequest, digest, freezeResult } from '../routing';
import { validateRouteSnapshot, createTripQuote, validateTripQuote, type QuoteEnvelope } from '../quotes';
import type { prepareMovement, MovementBook } from '../movement';
import { createScheduler, type EventTransition, type SchedulerSnapshot } from '../scheduler';
import { decodeDemandBook, reserveDemand, type DemandBook } from '../economy/demand';
import { decodeRevenueBook, issueRevenueTerms, calculateFare, calculateCargoRevenue, type RevenueBook } from '../economy/revenue';
import { decodeEnergyBook, estimateEnergy, applyEnergyEvent, inspectEnergyBook, type EnergyBook } from '../economy/energy';
import { decodeOperatingBook, inspectOperatingBook, inspectMaintenanceAvailability, type OperatingBook } from '../economy/operations';
import { decodeIncentiveBook, type IncentiveBook } from '../economy/incentives';
import { decodeAccountingBook, inspectAccountingBook, type AccountingBook } from '../economy/accounting';
import { decodeGovernancePolicy, evaluateSolvency, applyGovernedAccountingCommand } from '../economy/governance';
import { decodeEnergyMarket, inspectEnergyMarket, applyMarketAction, type EnergyMarketBook } from '../economy/market';

type Movement=Awaited<ReturnType<typeof prepareMovement>>;
const fail=(s:string):never=>{throw new Error('R34: '+s);};
const cmp=(a:string,b:string)=>a<b?-1:a>b?1:0;
const freeze=freezeResult;
const positive=(v:unknown,p='positive')=>integer(v,p,1);
const limit=(v:unknown,p='limit')=>integer(v,p,1,10000);
const factor=(v:unknown,p='factor')=>integer(v,p,1,100000);
const raw=(v:unknown)=>v;
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const weight=object({serviceId:id,weight:integer});
const fare=object({baseMinor:minor,rateMinorPerKm:minor,discountBps:basisPoints,capMinor:minor});
const passengerPrice=object({kind:enumeration(['passenger']),classId:id,policy:fare});
const cargoPrice=object({kind:enumeration(['freight']),rateMinorPerTonneKm:minor,serviceFactorBps:basisPoints});
const pricing=(v:unknown,p='pricing')=>record(v,p).kind==='passenger'?passengerPrice(v,p):cargoPrice(v,p);
const claim=object({bucketId:id,boardIndex:integer,alightIndex:integer,requested:positive,outsideWeight:positive,services:distinct(list(weight,1,10000),x=>x.serviceId),pricing});
const energyFactor=object({loadFactorBps:factor,gradeFactorBps:factor,idleQuantityPerHour:energyQuantity,auxQuantityPerHour:energyQuantity,requestedRegenWh:energyQuantity,maxRegenBps:basisPoints});
const risk=object({id,reason:text(240)});
const template=object({id,movementPlanId:id,serviceId:id,request:raw,route:raw,claims:distinct(list(claim,1,128),x=>x.bucketId),energyFactors:list(energyFactor,1,100000),expectedCostMinor:minor,reserveMinor:minor,quoteTtlS:positive,delayRateMinorPerSecond:minor,delayCapMinor:minor,risks:distinct(list(risk,0,128),x=>x.id)});
const config=object({schemaVersion:version1,governance:decodeGovernancePolicy,templates:distinct(list(template,1,10000),x=>x.id),maxPending:limit,maxQuotes:limit,maxReceipts:limit,maxBulk:limit});
const quoteInput=object({quoteId:id,trainId:id,templateId:id});
const command=object({commandId:id,quoteId:id});
const executeInput=object({commandId:id,templateId:id,quote:(v:unknown)=>record(v,'quote') as unknown as QuoteEnvelope,quoteSha256:sha256,allocationSha256:sha256,baseVersion:integer});
const receiptDecoder=object({commandId:id,quoteId:id,templateId:id,trainId:id,tripId:id,atSimS:integer,quote:(v:unknown)=>record(v,'quote') as unknown as QuoteEnvelope,quoteSha256:sha256,allocationSha256:sha256,accountingCommandId:id});
export type DispatchReceipt=ReturnType<typeof receiptDecoder>;
type Opening={demand:DemandBook;revenue:RevenueBook;energy:EnergyBook;operations:OperatingBook;incentives:IncentiveBook;accounting:AccountingBook;market:EnergyMarketBook|null};
export type DispatchState=Opening&{schemaVersion:1;revision:number;movement:MovementBook;receipts:DispatchReceipt[]};
type Offer={templateId:string;quote:QuoteEnvelope;quoteSha256:string;allocationSha256:string};
type Snapshot=SchedulerSnapshot<DispatchState>;
const versionMap=(s:Opening)=>({demand:s.demand.revision,revenue:s.revenue.revision,energy:s.energy.revision,operations:s.operations.revision,incentives:s.incentives.revision});
const sortedIds=(xs:readonly string[])=>[...xs].sort(cmp);
const allocationKey=(claims:DemandBook['trips'][number]['claims'])=>claims.map(c=>({bucketId:c.bucketId,boardIndex:c.boardIndex,alightIndex:c.alightIndex,requested:c.requested,allocated:c.allocated,unmet:c.unmet}));
const reason=(e:unknown)=>e instanceof Error?e.message:String(e);

/** R34 is the local authoritative command instance. Its only event queue is R32.
 * Trusted scenario configuration supplies approved estimates, OD weights, fares,
 * energy coefficients and the R33 infrastructure. User commands carry IDs only.
 * The controller serializes commands and uses a snapshot checksum CAS. Durable
 * multi-process/tab CAS, authentication and quote registry persistence are R39. */
export async function prepareDispatch(graph:RailGraph,catalog:RollingStockCatalog,movement:Movement,configInput:unknown){
  const cfg=config(configInput);
  const src=(s:Opening)=>({catalog,demand:s.demand,revenue:s.revenue,energy:s.energy,operations:s.operations,incentives:s.incentives});
  const openingDecoder=object({demand:decodeDemandBook,revenue:raw,energy:decodeEnergyBook,operations:(v:unknown)=>decodeOperatingBook(catalog,v),incentives:raw,accounting:(v:unknown)=>record(v,'accounting') as unknown as AccountingBook,market:nullable(decodeEnergyMarket)});
  function opening(v:unknown):Opening{
    const b=openingDecoder(v),revenue=decodeRevenueBook(b.revenue,b.demand),incentives=decodeIncentiveBook(b.incentives,b.demand,revenue);
    if(b.market&&!same(inspectEnergyMarket(b.market).energy,b.energy))fail('market energy projection mismatch');
    return {...b,revenue,incentives};
  }
  const stateRaw=object({schemaVersion:version1,revision:integer,movement:movement.decodeBook,receipts:distinct(list(receiptDecoder,0,cfg.maxReceipts),r=>r.commandId),demand:raw,revenue:raw,energy:raw,operations:raw,incentives:raw,accounting:raw,market:raw});
  const decodeState:Decoder<DispatchState>=v=>{
    const b=stateRaw(v),{schemaVersion,revision,movement:m,receipts,...books}=b;
    if(new Set(receipts.map(r=>r.quoteId)).size!==receipts.length||new Set(receipts.map(r=>r.tripId)).size!==receipts.length||new Set(receipts.map(r=>r.trainId)).size!==receipts.length)fail('duplicate dispatch receipt identity');
    return {schemaVersion,revision,movement:m,receipts:receipts.sort((a,b)=>cmp(a.commandId,b.commandId)),...opening(books)};
  };
  const plans=await Promise.all(cfg.templates.map(async t=>{
    const q=canonicalRequest(t.request),r=await validateRouteSnapshot(graph,q,t.route);
    const m=movement.plans.find(p=>p.id===t.movementPlanId)??fail('unknown movement plan');
    if(m.routeId!==r.route.id||m.routeSha256!==await digest(r)||m.profileSha256!==q.trainProfileSha256||m.policySha256!==q.policySha256||m.catalogSha256!==catalog.sha256)fail('movement and route identity mismatch');
    const ref=catalog.reference(m.modelId),model=catalog.resolve(ref).model;
    if(BigInt(t.reserveMinor)<BigInt(t.expectedCostMinor))fail('configured reserve below expected cost');
    t.claims.sort((a,b)=>cmp(a.bucketId,b.bucketId));t.risks.sort((a,b)=>cmp(a.id,b.id));
    for(const c of t.claims)c.services.sort((a,b)=>cmp(a.serviceId,b.serviceId));
    if(t.energyFactors.length!==r.steps.length)fail('explicit energy factors required for every route edge');
    const segments:number[]=[];let distance=0,stop=1;
    for(const s of r.steps){distance=checkedAdd(distance,s.distanceM);if(s.to===r.stopAnchors[stop]){segments.push(distance);distance=0;stop++;}}
    if(distance!==0||segments.length!==r.route.stopIds.length-1)fail('route OD distance mismatch');
    let idle=0,step=0;
    const energyInputs=m.phases.flatMap(p=>{
      if(p.kind!=='MOVE'){idle=checkedAdd(idle,p.endS-p.startS);return [];}
      const s=r.steps[step],f=t.energyFactors[step++];
      if(!s||!f||s.edgeId!==p.edgeId||s.distanceM!==p.distanceM)fail('movement energy segment mismatch');
      const out={...f,mode:s.operating.mode,distanceM:p.distanceM,runningS:p.endS-p.startS,idleS:idle};idle=0;return [out];
    });
    if(idle||step!==r.steps.length)fail('incomplete energy path');
    const requirements=estimateEnergy(catalog,ref,energyInputs).energy;
    const {request:_,route:__,...settings}=t;
    return {settings,request:q,route:r,movement:m,reference:ref,capacitySeats:model.capacitySeats,cargoCapacityKg:model.cargoCapacityKg,segments,requirements};
  }));
  plans.sort((a,b)=>cmp(a.settings.id,b.settings.id));freeze(plans);
  const planMap=new Map(plans.map(p=>[p.settings.id,p]));
  const plan=(key:string)=>planMap.get(key)??fail('unknown dispatch template');
  const configurationSha256=await digest({schemaVersion:1,graphSha256:graph.graphSha256,catalogSha256:catalog.sha256,movementSha256:movement.scenarioSha256,governance:cfg.governance,plans,limits:{maxPending:cfg.maxPending,maxQuotes:cfg.maxQuotes,maxReceipts:cfg.maxReceipts,maxBulk:cfg.maxBulk}});
  const tripId=async(quoteId:string)=>'r34:trip:'+await digest({configurationSha256,quoteId});
  const accountingId=async(commandId:string)=>'r34:dispatch:'+await digest({configurationSha256,commandId});
  async function financialBoundary(s:DispatchState){
    const [g,a]=await Promise.all([evaluateSolvency(s.accounting,src(s),cfg.governance),inspectAccountingBook(s.accounting,src(s))]);
    let due=g.nextActionDueSimS;
    for(const x of a.liquidityView.loans)if(x.status==='active')due=due===null?x.loan.maturityS:Math.min(due,x.loan.maturityS);
    // R35 owns accounting/settlement boundary events. Until that wiring exists,
    // fail closed at the earliest review, grace deadline or loan maturity.
    return {g,a,due};
  }
  async function ready(s:DispatchState,at:number,trainId:string,p:ReturnType<typeof plan>){
    if(s.movement.trips.some(t=>t.trainId===trainId))fail('train already dispatched or awaiting settlement');
    const own=s.operations.opening.find(x=>x.train.id===trainId)??fail('unknown owned train');
    if(!same(own.catalogReference,p.reference)||!['IDLE','ASSIGNED'].includes(own.train.state))fail('train model or availability state mismatch');
    if(inspectMaintenanceAvailability(catalog,s.operations,trainId,at)!=='AVAILABLE')fail('train unavailable for maintenance');
    const runtime=inspectOperatingBook(catalog,s.operations).trains.find(x=>x.trainId===trainId)??fail('unknown train state');
    if(runtime.conditionBps===0)fail('train has zero condition');
    const {g,a,due}=await financialBoundary(s);
    if(g.stage==='LIQUIDATION'||g.stage==='RESTART_AUTHORIZED')fail('company cannot dispatch during liquidation or after restart');
    if(a.liquidityView.simTimeS>at||(due!==null&&at>=due))fail('mandatory financial boundary must be processed before dispatch');
    if(a.pending.assets||a.pending.operations||a.pending.incentives||a.pending.energyLots.length||a.pending.energyReservations.length||a.pending.trips.length)fail('unreconciled accounting sources');
    if(!s.accounting.transactions.some(t=>t.action.type==='acquire-asset'&&t.action.trainId===trainId))fail('train asset not booked');
  }
  async function preview(s:DispatchState,at:number,trainId:string,templateId:string,quoteId:string){
    const p=plan(templateId),t=p.settings;await ready(s,at,trainId,p);
    const tid=await tripId(quoteId);
    const demand=reserveDemand(s.demand,{expectedRevision:s.demand.revision,trip:{tripId:tid,serviceId:t.serviceId,dispatchSimS:at,stopIds:p.route.route.stopIds,capacitySeats:p.capacitySeats,cargoCapacityKg:p.cargoCapacityKg,claims:t.claims.map(({pricing:_,...c})=>c)}});
    const allocated=demand.trips.find(x=>x.tripId===tid)??fail('missing candidate OD trip');
    const passengers:unknown[]=[],cargo:unknown[]=[];let expected=0n;
    for(const c of allocated.claims){
      const rule=t.claims.find(x=>x.bucketId===c.bucketId)??fail('unknown claim policy');
      const kind=demand.buckets.find(x=>x.bucket.id===c.bucketId)?.kind;
      if(kind!==rule.pricing.kind)fail('OD pricing kind mismatch');
      if(!c.allocated)continue;
      const metres=p.segments.slice(c.boardIndex,c.alightIndex).reduce((n,x)=>checkedAdd(n,x),0);
      if(rule.pricing.kind==='passenger'){
        passengers.push({bucketId:c.bucketId,classId:rule.pricing.classId,quantity:c.allocated,policy:rule.pricing.policy});
        expected+=BigInt(c.allocated)*BigInt(calculateFare({distanceM:metres,policy:rule.pricing.policy}));
      }else{
        const term={bucketId:c.bucketId,consignmentId:tid+':'+cargo.length,massKg:c.allocated,paidDistanceM:metres,rateMinorPerTonneKm:rule.pricing.rateMinorPerTonneKm,serviceFactorBps:rule.pricing.serviceFactorBps};
        cargo.push(term);expected+=BigInt(calculateCargoRevenue({deliveredKg:c.allocated,paidDistanceM:metres,rateMinorPerTonneKm:term.rateMinorPerTonneKm,serviceFactorBps:term.serviceFactorBps}));
      }
    }
    const revenue=issueRevenueTerms(s.revenue,demand,{expectedRevision:s.revenue.revision,expectedDemandRevision:demand.revision,terms:{tripId:tid,policySha256:configurationSha256,segmentDistancesM:p.segments,promisedDurationS:p.movement.durationS,delayRateMinorPerSecond:t.delayRateMinorPerSecond,delayCapMinor:t.delayCapMinor,passengers,cargo}});
    const terms={expectedRevenueMinor:minor(String(expected)),expectedCostMinor:t.expectedCostMinor,reserveMinor:t.reserveMinor,energy:p.requirements,demandBucketIds:t.claims.map(c=>c.bucketId),risks:t.risks};
    return {p,tid,demand,revenue,terms,allocationSha256:await digest(allocationKey(allocated.claims))};
  }
  async function makeOffer(s:DispatchState,at:number,q:ReturnType<typeof quoteInput>):Promise<Offer>{
    const v=await preview(s,at,q.trainId,q.templateId,q.quoteId);
    const envelope=await createTripQuote(graph,v.p.request,v.p.route,{id:q.quoteId,trainId:q.trainId,stateVersion:s.revision,issuedAtSimS:at,expiresAtSimS:checkedAdd(at,v.p.settings.quoteTtlS),configurationSha256,terms:v.terms});
    return freeze({templateId:q.templateId,quote:envelope,quoteSha256:envelope.quoteSha256,allocationSha256:v.allocationSha256});
  }
  const events:Registry=Object.freeze({...movement.events,'dispatch.execute':executeInput});
  async function reduce(input:Readonly<DispatchState>,event:Readonly<SimEvent>):Promise<EventTransition<DispatchState>>{
    const s=decodeState(input),at=integer(event.simTimeS);
    if(event.kind==='movement.phase'){
      const out=movement.reduce(s.movement,event);
      return {state:{...s,movement:out.state,revision:checkedAdd(s.revision,1)},schedule:out.schedule,cancel:out.cancel};
    }
    if(event.kind!=='dispatch.execute')return fail('unknown aggregate event');
    const q=executeInput(event.payload),p=plan(q.templateId),offer=q.quote;
    if(q.baseVersion>s.revision||offer.quote.stateVersion!==q.baseVersion)fail('stale quote revision');
    if(s.receipts.length>=cfg.maxReceipts||s.receipts.some(r=>r.commandId===q.commandId||r.quoteId===offer.quote.id))fail('duplicate dispatch or receipt limit');
    await validateTripQuote(graph,p.request,offer,{quoteSha256:q.quoteSha256,trainId:offer.quote.trainId,stateVersion:q.baseVersion,simTimeS:at,configurationSha256});
    const v=await preview(s,at,offer.quote.trainId,q.templateId,offer.quote.id);
    if(v.allocationSha256!==q.allocationSha256)fail('quoted demand allocation changed');
    const recalculated=await createTripQuote(graph,p.request,p.route,{id:offer.quote.id,trainId:offer.quote.trainId,stateVersion:q.baseVersion,issuedAtSimS:offer.issuedAtSimS,expiresAtSimS:offer.quote.expiresAtSimS,configurationSha256,terms:v.terms});
    if(recalculated.quoteSha256!==q.quoteSha256)fail('quoted terms changed');
    // All following calls are pure candidates. No assignment to committed state
    // until R32 and the controller validate the entire resulting snapshot.
    const m=movement.reduce(s.movement,{...event,kind:'movement.reserve',payload:{tripId:v.tid,trainId:offer.quote.trainId,planId:p.movement.id,departureSimS:at}});
    let market=s.market,energy:EnergyBook;
    if(market){
      const mv=inspectEnergyMarket(market);
      if(mv.simTimeS>at)fail('market clock ahead of simulation');
      if(mv.simTimeS<at)market=applyMarketAction(market,{expectedRevision:market.revision,action:{type:'advance',targetSimS:at}});
      market=applyMarketAction(market,{expectedRevision:market.revision,action:{type:'reserve',reservationId:v.tid,requirements:p.requirements}});
      energy=inspectEnergyMarket(market).energy;
    }else energy=applyEnergyEvent(s.energy,{expectedRevision:s.energy.revision,event:{type:'reserve',reservationId:v.tid,requirements:p.requirements}});
    const books={...s,demand:v.demand,revenue:v.revenue,energy,market};
    const aid=await accountingId(q.commandId);
    if(s.accounting.transactions.some(x=>x.commandId===aid))fail('accounting command identity already used');
    const accounting=(await applyGovernedAccountingCommand(s.accounting,src(books),cfg.governance,{expectedRevision:s.accounting.revision,expectedSources:versionMap(books),commandId:aid,action:{type:'reserve-trip',atSimS:at,tripId:v.tid,amountMinor:offer.quote.reserveMinor}})).accounting;
    const receipt=receiptDecoder({commandId:q.commandId,quoteId:offer.quote.id,templateId:q.templateId,trainId:offer.quote.trainId,tripId:v.tid,atSimS:at,quote:offer,quoteSha256:q.quoteSha256,allocationSha256:q.allocationSha256,accountingCommandId:aid});
    return {state:decodeState({...books,accounting,movement:m.state,revision:checkedAdd(s.revision,1),receipts:[...s.receipts,receipt]}),schedule:m.schedule,cancel:m.cancel};
  }
  const scheduler=createScheduler<DispatchState>({policySha256:configurationSha256,graphSha256s:[graph.graphSha256],maxPending:cfg.maxPending,decodeState,events,reduce,nextBoundary:async s=>{
    const {due}=await financialBoundary(s);return due===null?null:{simTimeS:due,kind:'dispatch.financial-boundary'};
  }});
  async function verify(input:unknown):Promise<Snapshot>{
    const s=await scheduler.restore(input),b=s.state;
    await decodeAccountingBook(b.accounting,src(b));
    const a=await inspectAccountingBook(b.accounting,src(b)),energy=inspectEnergyBook(b.energy);
    const {due}=await financialBoundary(b);
    if(a.liquidityView.simTimeS>s.simTimeS||(due!==null&&s.simTimeS>=due))fail('unreconciled financial clock');
    if(b.market&&inspectEnergyMarket(b.market).simTimeS>s.simTimeS)fail('market clock ahead of simulation');
    const ids=sortedIds(b.receipts.map(r=>r.tripId));
    for(const actual of [b.movement.trips.map(t=>t.tripId),b.demand.trips.filter(t=>t.status==='reserved').map(t=>t.tripId),b.revenue.records.filter(r=>!r.closed).map(r=>r.terms.tripId),energy.reservations.filter(r=>!r.closed).map(r=>r.id),a.liquidityView.reservations.filter(r=>!r.closed).map(r=>r.id)])if(!same(ids,sortedIds(actual)))fail('orphan or missing active reservation');
    const expected=new Map<string,{phaseIndex:number;simTimeS:number}>();
    for(const r of b.receipts){
      const p=plan(r.templateId),m=b.movement.trips.find(t=>t.tripId===r.tripId)!,d=b.demand.trips.find(t=>t.tripId===r.tripId)!,rev=b.revenue.records.find(t=>t.terms.tripId===r.tripId)!,er=energy.reservations.find(t=>t.id===r.tripId)!,cash=a.liquidityView.reservations.find(t=>t.id===r.tripId)!;
      if(r.atSimS>s.simTimeS||r.tripId!==await tripId(r.quoteId)||r.accountingCommandId!==await accountingId(r.commandId)||m.trainId!==r.trainId||m.planId!==p.movement.id||m.departureSimS!==r.atSimS||d.dispatchSimS!==r.atSimS||rev.terms.policySha256!==configurationSha256||r.quote.quote.id!==r.quoteId||r.quote.quote.stateVersion>=b.revision||cash.amountMinor!==r.quote.quote.reserveMinor||await digest(allocationKey(d.claims))!==r.allocationSha256)fail('dispatch receipt binding mismatch');
      await validateTripQuote(graph,p.request,r.quote,{quoteSha256:r.quoteSha256,trainId:r.trainId,stateVersion:r.quote.quote.stateVersion,simTimeS:r.atSimS,configurationSha256});
      const tx=b.accounting.transactions.find(x=>x.commandId===r.accountingCommandId);
      if(!tx||tx.action.type!=='reserve-trip'||tx.action.tripId!==r.tripId||tx.action.atSimS!==r.atSimS||tx.action.amountMinor!==cash.amountMinor)fail('missing accounting reservation transaction');
      const sums=new Map<string,bigint>();for(const x of er.allocations)sums.set(x.unit,(sums.get(x.unit)??0n)+BigInt(x.quantity));
      if(!same([...sums].sort((x,y)=>cmp(x[0],y[0])).map(([unit,n])=>({unit,quantity:String(n)})),r.quote.quote.energy.map(x=>({unit:x.unit,quantity:x.quantity})).sort((x,y)=>cmp(x.unit,y.unit))))fail('locked energy quantities mismatch');
      const phase=m.phaseIndex+1,phases=p.movement.phases;
      if(m.phaseIndex>=0){const t=checkedAdd(m.departureSimS,m.phaseIndex===phases.length?p.movement.durationS:phases[m.phaseIndex].startS);if(t>s.simTimeS)fail('movement phase in future');}
      if(phase<=phases.length){const t=checkedAdd(m.departureSimS,phase===phases.length?p.movement.durationS:phases[phase].startS);if(t<s.simTimeS)fail('overdue movement phase');expected.set(r.tripId,{phaseIndex:phase,simTimeS:t});}
    }
    for(const e of s.pendingEvents){
      if(e.kind!=='movement.phase')fail('unexpected pending aggregate event');
      const p=object({tripId:id,phaseIndex:integer})(e.payload),x=expected.get(p.tripId);
      if(!x||x.phaseIndex!==p.phaseIndex||x.simTimeS!==e.simTimeS)fail('invalid or duplicate pending phase');
      expected.delete(p.tripId);
    }
    if(expected.size)fail('missing movement phase');
    return s;
  }
  function controller(initial:Snapshot){
    let current=initial,tail:Promise<unknown>=Promise.resolve();
    const issued=new Map<string,Offer>();
    function serial<T>(fn:()=>Promise<T>):Promise<T>{const run=tail.then(fn);tail=run.then(()=>undefined,()=>undefined);return run;}
    function cas(value:unknown){if(sha256(value)!==current.checksum)fail('STALE_SNAPSHOT');}
    async function quoteTrip(input:unknown,expectedChecksum:unknown){
      const q=quoteInput(input),expected=sha256(expectedChecksum);
      return serial(async()=>{
        cas(expected);const old=issued.get(q.quoteId);
        if(old){if(old.templateId!==q.templateId||old.quote.quote.trainId!==q.trainId)fail('quote ID conflict');return old;}
        if(current.state.receipts.some(r=>r.quoteId===q.quoteId)||issued.size>=cfg.maxQuotes)fail('quote ID used or registry limit');
        const offer=await makeOffer(current.state,current.simTimeS,q);issued.set(q.quoteId,offer);return offer;
      });
    }
    function prior(s:Snapshot,q:ReturnType<typeof command>){
      const r=s.state.receipts.find(x=>x.commandId===q.commandId);
      if(r&&r.quoteId!==q.quoteId)fail('command ID conflict');return r;
    }
    async function run(s:Snapshot,q:ReturnType<typeof command>,base:Snapshot){
      const old=prior(s,q);if(old)return {snapshot:s,receipt:old,replayed:true};
      const offer=issued.get(q.quoteId)??fail('unknown trusted quote');
      const p=plan(offer.templateId);
      if(s.state.receipts.some(r=>r.quoteId===q.quoteId))fail('quote already used');
      await validateTripQuote(graph,p.request,offer.quote,{quoteSha256:offer.quoteSha256,trainId:offer.quote.quote.trainId,stateVersion:base.state.revision,simTimeS:s.simTimeS,configurationSha256});
      if(s.pendingEvents.some(e=>e.simTimeS<=s.simTimeS))fail('process due movement events first');
      const queued=await scheduler.enqueue(s,[{kind:'dispatch.execute',simTimeS:s.simTimeS,payload:{commandId:q.commandId,...offer,baseVersion:base.state.revision}}]);
      const out=await scheduler.advance(queued,s.simTimeS,cfg.maxPending);
      if(!out.complete)fail('dispatch event budget exhausted');
      const snapshot=await verify(out.snapshot),receipt=prior(snapshot,q)??fail('missing dispatch receipt');
      return {snapshot,receipt,replayed:false};
    }
    async function dispatch(input:unknown,expectedChecksum:unknown){
      const q=command(input),expected=sha256(expectedChecksum);
      return serial(async()=>{
        const old=prior(current,q);if(old)return freeze({snapshot:current,receipt:old,replayed:true});
        cas(expected);const out=await run(current,q,current);current=out.snapshot;return freeze(out);
      });
    }
    async function bulkDispatch(input:unknown,expectedChecksum:unknown){
      const qs=distinct(list(command,1,cfg.maxBulk),q=>q.commandId)(input),expected=sha256(expectedChecksum);
      return serial(async()=>{
        cas(expected);const base=current;
        const train=(q:typeof qs[number])=>base.state.receipts.find(r=>r.commandId===q.commandId)?.trainId??issued.get(q.quoteId)?.quote.quote.trainId??'~';
        qs.sort((a,b)=>cmp(train(a),train(b))||cmp(a.commandId,b.commandId));
        const results=[];
        for(const q of qs){try{const out=await run(current,q,base);current=out.snapshot;results.push({commandId:q.commandId,ok:true as const,receipt:out.receipt,replayed:out.replayed});}catch(e){results.push({commandId:q.commandId,ok:false as const,reason:reason(e)});}}
        return freeze({snapshot:current,results});
      });
    }
    async function advance(target:unknown,budget:unknown,expectedChecksum:unknown){
      const t=integer(target),n=limit(budget),expected=sha256(expectedChecksum);
      return serial(async()=>{cas(expected);const out=await scheduler.advance(current,t,n);const s=await verify(out.snapshot);current=s;return freeze({...out,snapshot:s});});
    }
    return Object.freeze({snapshot:()=>current,quoteTrip,dispatch,bulkDispatch,advance});
  }
  async function initialize(start:unknown,seed:unknown,input:unknown){
    const b=opening(input);
    const a=await inspectAccountingBook(b.accounting,src(b));
    if(a.liquidityView.simTimeS!==integer(start))fail('opening accounting clock mismatch');
    const s=await scheduler.initialize(start,seed,{...b,schemaVersion:1,revision:0,movement:{schemaVersion:1,trips:[]},receipts:[]});
    return controller(await verify(s));
  }
  async function open(input:unknown){return controller(await verify(input));}
  return Object.freeze({configurationSha256,initialize,open,verify,events,decodeState,reduce});
}

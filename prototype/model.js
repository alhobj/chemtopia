import {PhysicsWorld,BENCH_Y} from './physics.js';
export {BENCH_Y} from './physics.js';
// Qualitative, deterministic transfer model. Amounts are internal, not calibrated readings.
export const EPS = 1e-7;
export const NAMES = {source:'Mixture beaker',receiverA:'Collecting beaker A',receiverB:'Collecting beaker B',funnel:'Glass funnel',paper:'Filter paper',stand:'Funnel stand'};
export function createState() {
  return {
    items: {
      source: {id:'source',kind:'beaker',x:150,y:413,water:1,sand:.12,capacity:1.35,parent:null},
      receiverA: {id:'receiverA',kind:'beaker',x:660,y:429,water:0,sand:0,capacity:.65,parent:null},
      receiverB: {id:'receiverB',kind:'beaker',x:760,y:429,water:0,sand:0,capacity:.65,parent:null},
      funnel: {id:'funnel',kind:'funnel',x:880,y:467,angle:90,parent:null},
      paper: {id:'paper',kind:'paper',x:950,y:487,sand:0,parent:null},
      stand: {id:'stand',kind:'stand',x:515,y:509,parent:null}
    },
    spills: [], flow: [], passiveFlow: [], phase:'working', initial:{water:1,sand:.12}
  };
}
export function children(state,id) {return Object.values(state.items).filter(o=>o.parent===id);}
export function moveItem(state,id,x,y) {
  const item=state.items[id]; const dx=x-item.x,dy=y-item.y;
  item.x=x;item.y=y;
  for(const c of children(state,id))moveItem(state,c.id,c.x+dx,c.y+dy);
}
export function detach(state,id) {const item=state.items[id];item.parent=null;item.velocity=0;if(item.kind==='paper')item.angle=0;if(item.kind==='funnel'){item.angle=0;moveItem(state,id,item.x,Math.min(item.y,BENCH_Y-80));}}
function attach(state,id,parent,x,y) {moveItem(state,id,x,y);state.items[id].parent=parent;}
export function placeItem(state,id) {
  const item=state.items[id]; item.parent=null;item.velocity=0;
  if(item.kind==='paper') {
    const f=state.items.funnel;
    if(Math.abs(f.angle||0)<30&&Math.abs(item.x-f.x)<50&&Math.abs(item.y-f.y)<45)attach(state,id,f.id,f.x,f.y+4);
  }

}
export function pourPoint(item) {const angle=(item.angle??35)*Math.PI/180;const lip=item.id==='source'?42:35;return {x:item.x+lip*Math.cos(angle),y:item.y+lip*Math.sin(angle)};}
function hasAncestor(state,item,id) {
  let parent=item.parent;
  while(parent){if(parent===id)return true;parent=state.items[parent]?.parent;}
  return false;
}
// Catch by geometry alone, including a stem already inside a vessel's opening.
export function receiverBelow(state,point,excluded,sourceId) {
  return Object.values(state.items).filter(o=> {
    if(excluded.has(o.id)||o.id===sourceId||hasAncestor(state,o,sourceId))return false;
    if(o.kind==='beaker')return Math.abs(point.x-o.x)<40&&point.y<=o.y+55;
    if(o.kind==='funnel'&&Math.abs(o.angle||0)<30)return Math.abs(point.x-o.x)<52&&point.y<=o.y+12;
    return false;
  }).sort((a,b)=>Math.max(0,a.y-point.y)-Math.max(0,b.y-point.y))[0]??null;
}
function spill(state,point,water,sand) {
  if(water+sand<=0)return;
  const x=Math.max(30,Math.min(970,point.x));
  let spot=state.spills.find(s=>Math.abs(s.x-x)<22);
  if(!spot){spot={x,y:525,water:0,sand:0};state.spills.push(spot);}
  spot.water+=water;spot.sand+=sand;
}
function route(state,point,water,sand,excluded,sourceId) {
  const target=receiverBelow(state,point,excluded,sourceId);
  state.flow.push({from:point,to:{x:point.x,y:target?Math.max(point.y,target.y+12):525},sand:sand>EPS});
  if(!target){spill(state,point,water,sand);return;}
  if(target.kind==='beaker') {
    const total=water+sand, room=Math.max(0,target.capacity-target.water-target.sand);
    const fraction=total>0?Math.min(1,room/total):0;
    target.water+=water*fraction;target.sand+=sand*fraction;
    spill(state,{x:target.x+45,y:target.y+104},water*(1-fraction),sand*(1-fraction));
    return;
  }
  excluded.add(target.id);
  const paper=children(state,target.id).find(o=>o.kind==='paper');
  if(paper){paper.sand+=sand;sand=0;}
  route(state,{x:target.x,y:target.y+78},water,sand,excluded,sourceId);
}
export function pour(state,id,amount) {
  state.flow=[];
  if(state.phase!=='working'||!Number.isFinite(amount)||amount<=0)return;
  const source=state.items[id];
  if(source?.kind!=='beaker')return;
  const total=source.water+source.sand;
  if(total<=0)return;
  const taken=Math.min(total,amount),ratio=taken/total;
  const water=source.water*ratio,sand=source.sand*ratio;
  source.water=Math.max(0,source.water-water);source.sand=Math.max(0,source.sand-sand);
  route(state,pourPoint(source),water,sand,new Set([id]),id);
}
export function totals(state) {
  return [...Object.values(state.items),...state.spills].reduce((sum,o)=>({water:sum.water+(o.water||0),sand:sum.sand+(o.sand||0)}),{water:0,sand:0});
}
export function outcome(state) {
  const beakers=Object.values(state.items).filter(o=>o.kind==='beaker');
  const spilledSand=state.spills.reduce((s,o)=>s+o.sand,0);
  const collected=beakers.filter(o=>o.id!=='source');
  return {
    success:Math.abs(state.items.paper.sand-state.initial.sand)<EPS&&spilledSand<EPS&&collected.some(o=>o.water>EPS)&&collected.every(o=>o.sand<EPS),
    spilledSand,spilledWater:state.spills.reduce((s,o)=>s+o.water,0),
    paperSand:state.items.paper.sand,
    containers:beakers.map(o=>({id:o.id,water:o.water,sand:o.sand}))
  };
}

// One local physics world per attempt; restart discards the old world.
const worlds=new WeakMap();
export function physicsFor(state){
 let world=worlds.get(state);
 if(!world){world=new PhysicsWorld(state,(item,fraction)=>{
  const root=item.parent?state.items[item.parent]:item;
  const angle=(root.angle||0)*Math.PI/180,lip=root.kind==='funnel'?52:root.id==='source'?42:35;
  const downhill=Math.sin(angle)>=0?1:-1;
  const point={x:root.x+downhill*lip*Math.cos(angle),y:root.y+downhill*lip*Math.sin(angle)};
  const remaining=(item.water||0)+(item.sand||0);if(remaining<1e-5)fraction=1;
  const water=(item.water||0)*fraction,sand=(item.sand||0)*fraction;
  if('water'in item)item.water-=water;if('sand'in item)item.sand-=sand;
  const flow=state.flow;state.flow=[];route(state,point,water,sand,new Set([root.id,item.id]),root.id);state.passiveFlow.push(...state.flow);state.flow=flow;
 });worlds.set(state,world);}
 return world;
}
export function holdItem(state,id){physicsFor(state).hold(id);}
export function dragItem(state,id,x,y){physicsFor(state).moveHeld(id,x,y);}
export function releaseItem(state){physicsFor(state).release();}
export function tiltItem(state,id,degrees){return physicsFor(state).tilt(id,degrees);}
export function stepPhysics(state,seconds,heldId=null){
 if(state.phase!=='working'||!Number.isFinite(seconds)||seconds<=0)return false;
 return physicsFor(state).step(seconds,heldId);
}

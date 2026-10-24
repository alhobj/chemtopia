import {PhysicsWorld} from './physics.js';
export const EPS=1e-8;
export const PARAMETERS={solute:.2,sand:.02,water:.8,coldCapacity:.3,hotCapacity:1.6,warmRate:.22,coolRate:.035,paperHold:.002,evaporationRate:.025};
export const NAMES={source:'Impure potassium nitrate',water:'Water beaker',heater:'Electric heater',stand:'Funnel stand',funnel:'Glass funnel',paper:'Filter paper A',freshPaper:'Filter paper B',receiverA:'Crystallising beaker',receiverB:'Mother-liquor beaker'};
const species=['water','raw','dissolved','crystals','sand'];
const mix=(extra={})=>({water:0,raw:0,dissolved:0,crystals:0,sand:0,heat:0,...extra});
export const solute=o=>o.raw+o.dissolved+o.crystals;
export function createState(){
 const vessel=(id,x,y,extra={})=>({id,kind:'beaker',x,y,angle:0,parent:null,capacity:1.4,...mix(),...extra});
 return {width:1400,phase:'working',held:null,vapour:0,evaporating:[],spills:[],flow:[],passiveFlow:[],initial:{water:.8,solute:.2,sand:.02},items:{
 source:vessel('source',300,413,{raw:.2,sand:.02}),water:vessel('water',100,429,{water:.8}),
 heater:{id:'heater',kind:'heater',x:500,y:467,angle:0,on:false,mass:2,collision:[{x:0,y:29,w:120,h:58}]},
 stand:{id:'stand',kind:'stand',x:750,y:509,angle:0,parent:null},
 funnel:{id:'funnel',kind:'funnel',x:1280,y:447,angle:90,parent:null},
 paper:{id:'paper',kind:'paper',x:1000,y:100,angle:0,parent:null,...mix()},
 freshPaper:{id:'freshPaper',kind:'paper',x:1120,y:100,angle:0,parent:null,...mix()},
 receiverA:vessel('receiverA',1000,429),receiverB:vessel('receiverB',1120,429)
 }};
}
export function worldPoint(o,p){const a=(o.angle||0)*Math.PI/180;return{x:o.x+p.x*Math.cos(a)-p.y*Math.sin(a),y:o.y+p.x*Math.sin(a)+p.y*Math.cos(a)};}
export function equilibrate(o){
 const capacity=o.water*(PARAMETERS.coldCapacity+(PARAMETERS.hotCapacity-PARAMETERS.coldCapacity)*o.heat);
 if(o.dissolved>capacity){const amount=o.dissolved-capacity;o.dissolved-=amount;o.crystals+=amount;}
 else{let room=capacity-o.dissolved;for(const k of ['raw','crystals']){const amount=Math.min(o[k],room);o[k]-=amount;o.dissolved+=amount;room-=amount;}}
}
export function description(o){return o.crystals>EPS?(o.water>EPS?'Crystals + mother liquor':'Solid residue'):o.raw>EPS?'Undissolved starting solid':o.dissolved>EPS?'Dissolved potassium nitrate':o.sand>EPS?'Retained sand':o.water>EPS?'Water':'Empty';}
export function heaterContact(s,o){const h=s.items.heater,p=worldPoint(o,{x:0,y:o.id==='source'?112:96});return !o.stored&&!h.stored&&o.kind==='beaker'&&Math.abs(o.angle)<15&&Math.abs(h.angle)<15&&Math.abs(p.x-h.x)<34&&Math.abs(p.y-h.y)<9;}
export function stepChemistry(s,dt){
 if(s.phase!=='working'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(.05,dt);s.flow=[];s.evaporating=[];
 for(const o of Object.values(s.items)){if(!('raw'in o)||o.stored)continue;const heated=s.items.heater.on&&heaterContact(s,o);o.heat=Math.max(0,Math.min(1,o.heat+dt*(heated?PARAMETERS.warmRate:-PARAMETERS.coolRate)));if(heated&&o.heat>=.8&&o.water>0){const water=Math.min(o.water,PARAMETERS.evaporationRate*dt*o.heat);o.water-=water;s.vapour+=water;s.evaporating.push(o.id);}
  equilibrate(o);}
}
function add(s,p,m){
 if(species.reduce((n,k)=>n+m[k],0)<=0)return;
 let pool=s.spills.find(v=>Math.abs(v.x-p.x)<24);if(!pool){pool={x:Math.max(25,Math.min(1375,p.x)),...mix()};s.spills.push(pool);}
 for(const k of species)pool[k]+=m[k];
}
function route(s,p,m,excluded){
 const target=Object.values(s.items).filter(o=>!o.stored&&!excluded.has(o.id)&&Math.abs(o.angle||0)<35&&
 (o.kind==='beaker'?Math.abs(p.x-o.x)<38&&p.y<=o.y+25:o.kind==='funnel'&&Math.abs(p.x-o.x)<52&&p.y<=o.y+12)).sort((a,b)=>a.y-b.y)[0];
 s.flow.push({from:p,to:{x:p.x,y:target?target.y+10:525}});
 if(!target){add(s,p,m);return;}
 if(target.kind==='beaker'){
  const total=species.reduce((n,k)=>n+m[k],0),room=Math.max(0,target.capacity-species.reduce((n,k)=>n+target[k],0)),f=total?Math.min(1,room/total):0;
  const old=target.water;target.heat=old+m.water*f>EPS?(old*target.heat+m.water*f*m.heat)/(old+m.water*f):target.heat;
  for(const k of species)target[k]+=m[k]*f;
  equilibrate(target);add(s,{x:target.x+45,y:525},Object.fromEntries(species.map(k=>[k,m[k]*(1-f)])));return;
 }
 excluded.add(target.id);
 const paper=Object.values(s.items).find(o=>o.parent===target.id&&!o.stored);
 if(paper){
  const old=paper.water;
  const heat=(paper.heat*(old+.001)+m.heat*m.water)/(old+.001+m.water);
  const combined=mix({heat});for(const k of species)combined[k]=paper[k]+m[k];
  equilibrate(combined);
  const retained=Math.min(PARAMETERS.paperHold,combined.water),f=combined.water>EPS?retained/combined.water:0;
  paper.heat=heat;paper.water=retained;paper.dissolved=combined.dissolved*f;
  for(const k of ['raw','crystals','sand'])paper[k]=combined[k];
  m=mix({water:combined.water-retained,dissolved:combined.dissolved*(1-f),heat});
 }
 route(s,{x:target.x,y:target.y+78},m,excluded);
}
export function pour(s,id,amount){
 if(s.phase!=='working'||!Number.isFinite(amount)||amount<=0)return;
 const o=s.items[id];if(!o||o.stored||o.kind!=='beaker')return;
 equilibrate(o);const total=species.reduce((n,k)=>n+o[k],0);if(total<=EPS)return;
 const f=Math.min(1,amount/total),m=mix({heat:o.heat});for(const k of species){m[k]=o[k]*f;o[k]-=m[k];}
 route(s,worldPoint(o,{x:id==='source'?61:51,y:0}),m,new Set([id]));
}
export function detach(s,id){const o=s.items[id];o.parent=null;s.held=id;if(o.kind==='paper')o.angle=0;if(o.kind==='funnel'){o.angle=0;o.y=Math.min(o.y,445);}physicsFor(s).hold(id);}
export function placeItem(s,id){
 const o=s.items[id];if(o.kind==='paper'){
  const f=s.items.funnel,occupied=Object.values(s.items).some(p=>p.id!==id&&p.parent===f.id);
  if(!f.stored&&!occupied&&Math.abs(f.angle)<30&&Math.abs(o.x-f.x)<45&&Math.abs(o.y-f.y)<40){o.parent=f.id;o.x=f.x;o.y=f.y+4;o.angle=0;}
 }
 s.held=null;physicsFor(s).release();
}
export function totals(s){return [...Object.values(s.items).filter(o=>'raw'in o),...s.spills].reduce((t,o)=>({water:t.water+o.water,solute:t.solute+solute(o),sand:t.sand+o.sand}),{water:s.vapour,solute:0,sand:0});}
export function outcome(s){
 const papers=Object.values(s.items).filter(o=>o.kind==='paper');
 const clean=o=>o.sand<EPS&&o.raw<EPS;
 const onPaper=papers.filter(clean).reduce((n,o)=>n+o.crystals,0);
 const inBeakers=Object.values(s.items).filter(o=>o.kind==='beaker'&&clean(o)).reduce((n,o)=>n+o.crystals,0);
 const recovered=onPaper+inBeakers;
 return {success:recovered>EPS,recovered,yield:recovered/s.initial.solute,onPaper,inBeakers,papers};
}
const worlds=new WeakMap();
export function physicsFor(s){
 let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{
  if(!('raw'in o))return;const root=o.parent?s.items[o.parent]:o,total=species.reduce((n,k)=>n+o[k],0);if(total<EPS)return;if(total<1e-5)f=1;
  const m=mix({heat:o.heat});for(const k of species){m[k]=o[k]*f;o[k]-=m[k];}
  route(s,worldPoint(root,{x:Math.sin((root.angle||0)*Math.PI/180)>=0?45:-45,y:0}),m,new Set([root.id,o.id]));
 });worlds.set(s,w);}return w;
}
export function stepPhysics(s,dt,held){return s.phase==='working'?physicsFor(s).step(dt,held):false;}

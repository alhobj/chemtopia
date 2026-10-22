import {PhysicsWorld} from './physics.js';
export const EPS=1e-8;
// Qualitative model amounts and readable simulation speeds, not measured laboratory data.
export const PARAMETERS={water:.8,salt:.12,dissolvedPerWater:.3,warmRate:.25,coolRate:.15,evaporationRate:.08};
export const NAMES={source:'Salt-solution beaker',basin:'Evaporating basin',heater:'Electric heater',receiver:'Collecting beaker'};
export function createState(){
 return {width:1000,phase:'working',held:null,links:[],initial:{water:PARAMETERS.water,salt:PARAMETERS.salt},vapour:0,spills:[],flow:[],passiveFlow:[],evaporating:false,
 items:{
 source:{id:'source',kind:'beaker',x:110,y:413,angle:0,water:PARAMETERS.water,salt:PARAMETERS.salt,capacity:1.2},
 basin:{id:'basin',kind:'basin',x:350,y:445,angle:0,water:0,salt:0,capacity:1.2,heat:0,mass:.6,collision:[{vertices:[{x:-80,y:0},{x:-73,y:0},{x:-36,y:72},{x:-44,y:78}]},{vertices:[{x:80,y:0},{x:73,y:0},{x:36,y:72},{x:44,y:78}]},{x:0,y:75,w:88,h:10}]},
 heater:{id:'heater',kind:'heater',x:600,y:467,angle:0,on:false,mass:2,collision:[{x:0,y:29,w:120,h:58}]},
 receiver:{id:'receiver',kind:'beaker',x:820,y:429,angle:0,water:0,salt:0,capacity:1.2}
 }};
}
export function worldPoint(o,p){const a=(o.angle||0)*Math.PI/180;return{x:o.x+p.x*Math.cos(a)-p.y*Math.sin(a),y:o.y+p.x*Math.sin(a)+p.y*Math.cos(a)};}
export function material(o){
 const dissolved=Math.min(o.salt,o.water*PARAMETERS.dissolvedPerWater),solid=Math.max(0,o.salt-dissolved);
 return {dissolved,solid,state:o.salt<=EPS?(o.water>EPS?'Water':'Empty'):o.water<=EPS?'Dry salt residue':solid>EPS?'Wet salt residue':'Salt solution'};
}
function spill(s,p,m){
 if(m.water+m.salt<=0)return;
 let pool=s.spills.find(v=>Math.abs(v.x-p.x)<24);if(!pool){pool={x:Math.max(25,Math.min(975,p.x)),water:0,salt:0};s.spills.push(pool);}
 pool.water+=m.water;pool.salt+=m.salt;
}
function receive(s,p,m,exclude){
 const target=Object.values(s.items).filter(o=>!o.stored&&o.id!==exclude&&'water'in o&&Math.abs(o.angle)<35&&p.y<=o.y+12&&Math.abs(p.x-o.x)<(o.kind==='basin'?72:38)).sort((a,b)=>a.y-b.y)[0];
 s.flow.push({from:p,to:{x:p.x,y:target?target.y+12:525},water:m.water,salt:m.salt});
 if(!target){spill(s,p,m);return;}
 const total=m.water+m.salt,room=Math.max(0,target.capacity-target.water-target.salt),f=total?Math.min(1,room/total):0;
 target.water+=m.water*f;target.salt+=m.salt*f;spill(s,{x:target.x+55,y:525},{water:m.water*(1-f),salt:m.salt*(1-f)});
}
export function pour(s,id,amount){
 if(s.phase!=='working'||!Number.isFinite(amount)||amount<=0)return;
 const o=s.items[id];if(!o||o.stored||!('water'in o))return;
 const total=o.water+o.salt;if(total<=EPS)return;
 const f=Math.min(1,amount/total),m={water:o.water*f,salt:o.salt*f};o.water-=m.water;o.salt-=m.salt;
 receive(s,worldPoint(o,{x:o.kind==='basin'?76:o.id==='source'?42:35,y:0}),m,id);
}
export function heaterContact(s){
 const b=s.items.basin,h=s.items.heater,p=worldPoint(b,{x:0,y:80});
 return !b.stored&&!h.stored&&Math.abs(b.angle)<15&&Math.abs(h.angle)<15&&Math.abs(p.x-h.x)<35&&Math.abs(p.y-h.y)<9;
}
export function stepChemistry(s,dt){
 if(s.phase!=='working'||!Number.isFinite(dt)||dt<=0)return;
 dt=Math.min(.05,dt);s.flow=[];s.evaporating=false;
 const b=s.items.basin,heated=s.items.heater.on&&heaterContact(s);
 b.heat=Math.max(0,Math.min(1,b.heat+dt*(heated?PARAMETERS.warmRate:-PARAMETERS.coolRate)));
 if(b.stored||b.heat<.8||b.water<=0)return;
 const water=Math.min(b.water,PARAMETERS.evaporationRate*dt*b.heat);b.water-=water;s.vapour+=water;s.evaporating=water>0;
}
export function detach(s,id){
 if(s.phase!=='working')return;s.held=id;const o=s.items[id];
 if(o.kind!=='heater'){o.angle=0;o.y=Math.min(o.y,525-(o.kind==='basin'?80:id==='source'?112:96));}
 physicsFor(s).hold(id);
}
export function placeItem(s){s.held=null;physicsFor(s).release();}
export function totals(s){
 return Object.values(s.items).filter(o=>'water'in o).concat(s.spills).reduce((t,o)=>({water:t.water+o.water,salt:t.salt+o.salt}),{water:s.vapour,salt:0});
}
export function outcome(s){
 const b=s.items.basin,m=material(b);
 return {success:b.salt>EPS&&b.water<=EPS,yield:b.water<=EPS?b.salt/s.initial.salt:0,state:m.state,water:b.water,salt:b.salt,vapour:s.vapour,spills:s.spills.reduce((t,o)=>({water:t.water+o.water,salt:t.salt+o.salt}),{water:0,salt:0})};
}
const worlds=new WeakMap();
export function physicsFor(s){
 let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{
  const total=o.water+o.salt;if(total<=EPS)return;if(total<1e-5)f=1;
  const m={water:o.water*f,salt:o.salt*f};o.water-=m.water;o.salt-=m.salt;
  const side=Math.sin(o.angle*Math.PI/180)>=0?1:-1;
  receive(s,worldPoint(o,{x:side*(o.kind==='basin'?76:40),y:0}),m,o.id);
 });worlds.set(s,w);}return w;
}
export function stepPhysics(s,dt,held){return s.phase==='working'?physicsFor(s).step(dt,held):false;}

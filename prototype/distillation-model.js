import {PhysicsWorld} from './physics.js';
export const EPS=1e-8;
// These are qualitative prototype parameters, not measured acetone–water equilibrium data.
export const PARAMETERS={feedAcetone:.5,feedWater:.5,ambientTemperature:20,acetoneBoilingPoint:56,waterBoilingPoint:100,temperatureRiseRate:5,temperatureFallRate:4,acetonePlateauRemaining:.1,relativeVolatility:3,warmRate:.13,coolRate:.055,boilRate:.075,fullJacketEfficiency:.94,partialJacketEfficiency:.48};
const box=(x,y,w,h)=>({x,y,w,h});
const tube=(x,y,w,h)=>box(x,y,w,h);
export const NAMES={source:'Acetone–water feed',flask:'Distillation flask',head:'Still head',thermometer:'Thermometer',condenser:'Liebig condenser',support1:'Clamp stand A',support2:'Clamp stand B',heater:'Electric heater',receiverA:'Collecting beaker A',receiverB:'Collecting beaker B',tap:'Cooling-water tap',drain:'Water drain'};
const vessel=(id,x,y,extra={})=>({id,kind:'beaker',x,y,angle:0,water:0,acetone:0,distilledAcetone:0,capacity:.8,...extra});
export function createState(){
 const stand=id=>({id,kind:'clampStand',x:id==='support1'?300:1000,y:509,angle:0,mass:8,collision:id==='support1'?[box(0,-116,10,230),box(-20,4,90,24),box(30,-162,60,7),box(64,-162,4,20),box(116,-162,4,20)]:[box(0,-116,10,230),box(20,4,90,24),box(-83,-148,166,7),box(-221,-148,4,20),box(-169,-148,4,20)]});
 const state={width:1400,phase:'working',initial:{acetone:PARAMETERS.feedAcetone,water:PARAMETERS.feedWater},
  items:{
   source:vessel('source',95,413,{capacity:1.3,acetone:PARAMETERS.feedAcetone,water:PARAMETERS.feedWater}),
   flask:vessel('flask',760,385,{kind:'flask',mass:.7,capacity:1.5,heat:0,temperature:PARAMETERS.ambientTemperature,collision:[tube(-12,24,4,48),tube(12,24,4,48),{x:0,y:94,radius:46}]}),
   head:{id:'head',kind:'head',x:180,y:37,angle:0,mass:.12,collision:[box(-12,30,4,60),box(12,19,4,38),box(38,43,64,4),box(38,57,64,4)]},
   thermometer:{id:'thermometer',kind:'thermometer',temperature:PARAMETERS.ambientTemperature,x:80,y:36,angle:0,mass:.03,collision:[box(0,32.5,7,65),box(0,15,28,6)]},
   condenser:{id:'condenser',kind:'condenser',x:1060,y:430,angle:0,mass:.5,collision:[{vertices:[{x:30,y:-11},{x:205,y:42},{x:195,y:76},{x:20,y:23}]},box(8,2,24,9),box(220,67,25,9)]},
   support1:stand('support1'),support2:stand('support2'),
   heater:{id:'heater',kind:'heater',x:390,y:467,angle:0,mass:2,on:false,collision:[box(0,29,120,58)]},
   receiverA:vessel('receiverA',600,429),receiverB:vessel('receiverB',1350,429),
   tap:{id:'tap',kind:'tap',x:1270,y:65,angle:0,fixed:true,on:false,collision:[box(0,5,60,50)]},
   drain:{id:'drain',kind:'drain',x:1280,y:195,angle:0,fixed:true,collision:[box(0,8,90,20)]}
  },
  shelves:[{x:175,y:110,w:310,h:18}],links:[],
  hoses:[{id:'supply',ends:[{x:1090,y:95},{x:1160,y:150}]},{id:'return',ends:[{x:1090,y:195},{x:1160,y:250}]}],
  held:null,jacket:0,spills:[],escaped:{water:0,acetone:0},flow:[],passiveFlow:[],vapourVisible:false,elapsed:0};
 Object.defineProperty(state,'contactPairs',{value:()=>contactPairs(state)});return state;
}
export function worldPoint(item,p){const a=(item.angle||0)*Math.PI/180;return{x:item.x+p.x*Math.cos(a)-p.y*Math.sin(a),y:item.y+p.x*Math.sin(a)+p.y*Math.cos(a)};}
export function ports(state){const c=state.items.condenser;return {
 'condenser:high':worldPoint(c,{x:45,y:-12}),'condenser:low':worldPoint(c,{x:185,y:85}),
 'tap:out':worldPoint(state.items.tap,{x:0,y:30}),'drain:in':worldPoint(state.items.drain,{x:0,y:0})};}
export function hosePoint(state,end){return end.port?ports(state)[end.port]:end;}
export function connectHose(state,hoseId,index,point){
 if(state.phase!=='working')return;
 const hose=state.hoses.find(h=>h.id===hoseId);if(!hose||!hose.ends[index])return;
 const used=new Set(state.hoses.flatMap(h=>h.ends.filter((_,i)=>h.id!==hoseId||i!==index).map(e=>e.port).filter(Boolean)));
 const port=Object.entries(ports(state)).filter(([id])=>!used.has(id)).sort((a,b)=>distance(a[1],point)-distance(b[1],point))[0];
 hose.ends[index]=port&&distance(port[1],point)<22?{port:port[0]}:{x:point.x,y:point.y};
}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function cooling(state){
 if(!state.items.tap.on)return 'off';
 const edges=state.hoses.map(h=>h.ends.map(e=>e.port));
 const supplied=edges.find(e=>e.includes('tap:out'))?.find(p=>p!=='tap:out');
 if(!supplied?.startsWith('condenser:'))return 'disconnected';
 const other=supplied==='condenser:high'?'condenser:low':'condenser:high';
 if(!edges.some(e=>e.includes(other)&&e.includes('drain:in')))return 'disconnected';
 const p=ports(state),lower=p['condenser:low'].y>p['condenser:high'].y?'condenser:low':'condenser:high';
 return supplied===lower?'lower-fed':'upper-fed';
}
function possibleJoints(state){
 const joints=[{id:'flask-head',a:'flask',pa:{x:0,y:0},b:'head',pb:{x:0,y:60}},{id:'head-condenser',a:'head',pa:{x:70,y:50},b:'condenser',pb:{x:0,y:0}},{id:'head-thermometer',a:'head',pa:{x:0,y:0},b:'thermometer',pb:{x:0,y:15}}];
 for(const stand of ['support1','support2'])for(const [id,point]of [['flask',{x:0,y:20}],['condenser',{x:112,y:34}]])joints.push({id:`${stand}-${id}`,a:stand,pa:stand==='support1'?{x:90,y:-162}:{x:-195,y:-148},b:id,pb:id==='condenser'&&stand==='support2'?{x:145,y:44}:point});
 return joints;
}
export function contactPairs(state){
 if(!state.held)return [];
 return possibleJoints(state).filter(l=>{
  if(l.a!==state.held&&l.b!==state.held)return false;
  const a=worldPoint(state.items[l.a],l.pa),b=worldPoint(state.items[l.b],l.pb);
  // Guide the narrow stem through its matching mouth before its tip hits the rim.
  if(l.id==='head-thermometer')return Math.abs(a.x-b.x)<18&&Math.abs(a.y-b.y)<85;
  return distance(a,b)<(l.a.startsWith('support')?165:28);
 }).map(l=>[l.a,l.b]);
}
export function placeItem(state,id){
 state.held=null;
 if(state.phase!=='working')return;
 for(const link of possibleJoints(state).filter(l=>l.a===id||l.b===id)){
  if(state.links.some(l=>l.id===link.id))continue;
  if(link.a.startsWith('support')&&state.links.some(l=>l.a.startsWith('support')&&(l.a===link.a||l.b===link.b)))continue;
  const a=state.items[link.a],b=state.items[link.b];
  const ap=worldPoint(a,link.pa),bp=worldPoint(b,link.pb);
  const aligned=link.id==='head-thermometer'?Math.abs(ap.x-bp.x)<18&&Math.abs(ap.y-bp.y)<45:distance(ap,bp)<=21;
  if(Math.abs(a.angle-b.angle)>12||!aligned)continue;
  const moving=state.items[id],other=id===link.a?b:a,target=id===link.a?link.pa:link.pb,otherPoint=id===link.a?link.pb:link.pa;
  moving.angle=other.angle;const anchor=worldPoint(other,otherPoint),local=worldPoint({...moving,x:0,y:0},target);moving.x=anchor.x-local.x;moving.y=anchor.y-local.y;
  state.links.push(link);
 }
 physicsFor(state).release();
}
export function dragApparatus(state,id,x,y){
 if(id==='thermometer'){
  const head=state.items.head,mouth=worldPoint(head,{x:0,y:0});
  // The seating collar cannot be pushed through the upright glass rim.
  const collar=worldPoint(state.items.thermometer,{x:0,y:15});
  if(collar.y<=mouth.y+6&&Math.abs(head.angle)<12&&Math.abs(x-mouth.x)<18)y=Math.min(y,mouth.y-15);
 }
 physicsFor(state).moveHeld(id,x,y);
}
export function detach(state,id){state.held=id;state.links=state.links.filter(l=>l.a!==id&&l.b!==id);const o=state.items[id];if(o.fixed)return;if(['beaker','flask','head','thermometer','condenser'].includes(o.kind)){o.angle=0;const bottom=o.kind==='beaker'?(id==='source'?112:96):({flask:140,head:60,thermometer:65,condenser:85}[o.kind]);o.y=Math.min(o.y,525-bottom);}physicsFor(state).syncLinks();physicsFor(state).hold(id);}
export const hasLink=(state,id)=>state.links.some(l=>l.id===id);
function spill(state,point,mixture){
 if(mixture.water+mixture.acetone<=0)return;
 let s=state.spills.find(s=>Math.abs(s.x-point.x)<24);if(!s){s={x:Math.max(25,Math.min(1375,point.x)),y:525,water:0,acetone:0,distilledAcetone:0};state.spills.push(s);}
 for(const key of ['water','acetone','distilledAcetone'])s[key]+=(mixture[key]||0);
}
function receive(state,point,mix,exclude){
 const target=Object.values(state.items).filter(o=>['beaker','flask'].includes(o.kind)&&o.id!==exclude&&Math.abs(o.angle||0)<35&&Math.abs(o.x-point.x)<(o.kind==='flask'?14:38)&&point.y<=o.y+18).sort((a,b)=>Math.max(0,a.y-point.y)-Math.max(0,b.y-point.y))[0];
 state.flow.push({from:point,to:{x:point.x,y:target?Math.max(point.y,target.y+8):525},kind:'liquid'});
 if(!target){spill(state,point,mix);return;}
 const total=mix.water+mix.acetone,room=Math.max(0,target.capacity-target.water-target.acetone),fraction=total?Math.min(1,room/total):0;
 for(const k of ['water','acetone','distilledAcetone'])target[k]+=(mix[k]||0)*fraction;
 spill(state,{x:target.x+42,y:525},Object.fromEntries(['water','acetone','distilledAcetone'].map(k=>[k,(mix[k]||0)*(1-fraction)])));
}
export function pour(state,id,amount){
 if(state.phase!=='working'||!Number.isFinite(amount)||amount<=0)return;
 const o=state.items[id];if(!o||!('acetone'in o))return;
 const total=o.water+o.acetone;if(total<EPS)return;
 const fraction=Math.min(1,amount/total),mix={};for(const k of ['water','acetone','distilledAcetone']){mix[k]=o[k]*fraction;o[k]-=mix[k];}
 receive(state,worldPoint(o,{x:o.kind==='flask'?12:o.id==='source'?42:35,y:0}),mix,id);
}
export function heaterContact(state){const f=state.items.flask,h=state.items.heater,bottom=worldPoint(f,{x:0,y:140});return Math.abs(f.angle)<20&&Math.abs(h.angle)<15&&Math.abs(bottom.x-h.x)<52&&Math.abs(bottom.y-h.y)<12;}
function stepTemperature(state,dt,heated){
 const p=PARAMETERS,f=state.items.flask,t=state.items.thermometer;
 const tail=state.initial.acetone*p.acetonePlateauRemaining;
 const later=tail>EPS?Math.max(0,Math.min(1,1-f.acetone/tail)):1;
 // Owner-requested teaching curve, not acetone–water equilibrium thermometry.
 const target=!heated?p.ambientTemperature:f.heat<1
  ?p.ambientTemperature+(p.acetoneBoilingPoint-p.ambientTemperature)*f.heat
  :p.acetoneBoilingPoint+(p.waterBoilingPoint-p.acetoneBoilingPoint)*later;
 const approach=(value,goal)=>Math.max(p.ambientTemperature,Math.min(p.waterBoilingPoint,value+Math.max(-p.temperatureFallRate*dt,Math.min(p.temperatureRiseRate*dt,goal-value))));
 f.temperature=approach(f.temperature,target);
 const connected=hasLink(state,'head-thermometer')&&hasLink(state,'flask-head');
 t.temperature=approach(t.temperature,connected?f.temperature:p.ambientTemperature);
}
export function stepChemistry(state,dt){
 if(state.phase!=='working'||!Number.isFinite(dt)||dt<=0)return;
 dt=Math.min(dt,.05);state.elapsed+=dt;state.flow=[];state.vapourVisible=false;
 const f=state.items.flask,heated=state.items.heater.on&&heaterContact(state);
 f.heat=Math.max(0,Math.min(1.15,f.heat+dt*(heated?PARAMETERS.warmRate:-PARAMETERS.coolRate)));
 stepTemperature(state,dt,heated);
 const mode=cooling(state),target=mode==='lower-fed'?1:mode==='upper-fed'?.35:0;
 state.jacket+=Math.max(-dt*.6,Math.min(dt*.6,target-state.jacket));
 const total=f.acetone+f.water;if(f.heat<1||total<EPS)return;
 state.vapourVisible=true;
 const x=f.acetone/total,alpha=PARAMETERS.relativeVolatility,ya=alpha*x/(1+(alpha-1)*x);
 let a=Math.min(f.acetone,PARAMETERS.boilRate*dt*ya),w=Math.min(f.water,PARAMETERS.boilRate*dt*(1-ya));
 f.acetone-=a;f.water-=w;f.distilledAcetone=Math.min(f.distilledAcetone,f.acetone);
 let route=hasLink(state,'flask-head')&&hasLink(state,'head-condenser')?1:0;
 if(!hasLink(state,'head-thermometer'))route*=.4;
 // Condensation is a material transfer: unrecovered vapour enters the escaped pool.
 const efficiency=state.jacket<=.35?PARAMETERS.partialJacketEfficiency*state.jacket/.35:PARAMETERS.partialJacketEfficiency+(state.jacket-.35)/.65*(PARAMETERS.fullJacketEfficiency-PARAMETERS.partialJacketEfficiency);
 const condensed=(mode==='lower-fed'||mode==='upper-fed')?route*Math.max(0,Math.min(PARAMETERS.fullJacketEfficiency,efficiency)):0;
 state.escaped.acetone+=a*(1-condensed);state.escaped.water+=w*(1-condensed);
 if(condensed>0){const c=state.items.condenser;receive(state,worldPoint(c,{x:230,y:70}),{acetone:a*condensed,water:w*condensed,distilledAcetone:a*condensed},'condenser');}
}
export function totals(state){return [...Object.values(state.items),...state.spills,state.escaped].reduce((s,o)=>({acetone:s.acetone+(o.acetone||0),water:s.water+(o.water||0)}),{acetone:0,water:0});}
export function outcome(state){
 const receivers=['receiverA','receiverB'].map(id=>state.items[id]);const acetone=receivers.reduce((n,o)=>n+o.acetone,0),water=receivers.reduce((n,o)=>n+o.water,0),distilled=receivers.reduce((n,o)=>n+o.distilledAcetone,0);
 const purity=acetone+water>EPS?acetone/(acetone+water):0,feed=state.initial.acetone/(state.initial.acetone+state.initial.water);
 return {success:distilled>EPS&&purity>feed+EPS,yield:distilled/state.initial.acetone,purity,receivers,escaped:{...state.escaped},spills:state.spills.reduce((s,o)=>({water:s.water+o.water,acetone:s.acetone+o.acetone}),{water:0,acetone:0}),cooling:cooling(state)};
}
const worlds=new WeakMap();
export function physicsFor(state){let world=worlds.get(state);if(!world){world=new PhysicsWorld(state,(item,fraction)=>{const total=item.water+item.acetone;if(total<EPS)return;if(total<1e-5)fraction=1;const a=item.acetone*fraction,w=item.water*fraction,d=item.distilledAcetone*fraction;item.acetone-=a;item.water-=w;item.distilledAcetone-=d;spill(state,worldPoint(item,{x:(item.angle||0)>0?40:-40,y:0}),{acetone:a,water:w,distilledAcetone:d});});worlds.set(state,world);}return world;}
export function stepPhysics(state,dt,held){
 if(state.phase!=='working')return false;
 const moved=physicsFor(state).step(dt,held),t=state.items.thermometer,h=state.items.head;
 const collar=worldPoint(t,{x:0,y:15}),mouth=worldPoint(h,{x:0,y:0});
 if(!held&&!hasLink(state,'head-thermometer')&&Math.abs(collar.x-mouth.x)<14&&Math.abs(collar.y-mouth.y)<7&&Math.abs(t.angle-h.angle)<12)placeItem(state,'thermometer');
 return moved;
}

import {PhysicsWorld} from './physics.js';
export const EPS=1e-10, BASE_CONCENTRATION=.100, SAMPLE_VOLUME=25;
// Ideal strong-acid/strong-base model at 25 °C; counts analytical equivalents, not free ions.
export const NAMES={acid:'Unknown hydrochloric acid',base:'Sodium hydroxide · 0.100 M',water:'Water wash bottle',pipette:'25.00 mL pipette and filler',flask:'Conical flask',burette:'50 mL burette',stand:'Burette stand',funnel:'Filling funnel',indicator:'Bromothymol blue dropper',probe:'Digital pH probe',waste:'Waste beaker'};
const box=(x,y,w,h)=>({x,y,w,h});
const liquid=(id,kind,x,y,capacity,water=0,acid=0,base=0)=>({id,kind,x,y,angle:0,capacity,water,acid,base,indicator:0,mixed:true});
export function createState(){return {width:1000,phase:'working',held:null,links:[],flow:[],passiveFlow:[],spills:[],trials:[],sample:{volume:0,source:null},startReading:null,delivered:0,missed:0,items:{
 acid:{...liquid('acid','bottle',110,415,250,200,.016),collision:[box(-32,55,5,110),box(32,55,5,110),box(0,108,69,5)]},
 base:{...liquid('base','bottle',240,415,300,250,0,.025),collision:[box(-32,55,5,110),box(32,55,5,110),box(0,108,69,5)]},
 water:{...liquid('water','wash',375,415,600,500),collision:[box(0,55,65,110)]},
 flask:{...liquid('flask','conical',780,405,250),collision:[box(-30,18,5,36),box(30,18,5,36),{vertices:[{x:-32,y:35},{x:-27,y:35},{x:-50,y:115},{x:-55,y:115}]},{vertices:[{x:32,y:35},{x:27,y:35},{x:50,y:115},{x:55,y:115}]},box(0,118,110,5)]},
 pipette:{...liquid('pipette','pipette',150,100,25),collision:[box(0,55,8,110)]},
 burette:{...liquid('burette','burette',300,100,50),spawnYMin:30,spawnYMax:190,tip:{water:0,acid:0,base:0,indicator:0},collision:[box(-10,112.5,4,225),box(10,112.5,4,225),box(0,237.5,7,25)]},
 stand:{id:'stand',kind:'clampStand',x:490,y:508,angle:0,mass:10,collision:[box(0,-160,10,320),box(0,9,140,16),box(65,-275,130,8)]},
 funnel:{id:'funnel',kind:'transferFunnel',x:400,y:100,angle:0,collision:[box(0,15,52,5),box(0,40,6,45)]},
 indicator:{id:'indicator',kind:'dropper',x:500,y:100,angle:0,drops:100,collision:[box(0,25,20,50)]},
 probe:{id:'probe',kind:'probe',x:600,y:100,angle:0,collision:[box(0,55,8,110)]},
 waste:liquid('waste','beaker',900,429,1000)
 }};}
export const active=o=>o&&!o.stored;
export function point(o,x=0,y=0){const a=o.angle*Math.PI/180;return{x:o.x+x*Math.cos(a)-y*Math.sin(a),y:o.y+x*Math.sin(a)+y*Math.cos(a)};}
export function pH(o){if(!o||o.water<=EPS)return null;const excess=(o.acid-o.base)/(o.water/1000),root=Math.hypot(excess,2e-7);const h=excess>=0?(excess+root)/2:2e-14/(root-excess);return -Math.log10(h);}
export function colour(o){if(!o.indicator||!o.mixed)return '#b5d8d9';const p=pH(o);return p<6?'#e5c954':p>7.6?'#548cc2':'#72a86b';}
export function reading(s){return 50-s.items.burette.water;}
function empty(){return {water:0,acid:0,base:0,indicator:0};}
function remove(o,volume){if(!Number.isFinite(volume)||volume<=0||o.water<=EPS)return empty();const f=Math.min(1,volume/o.water),m={water:o.water*f,acid:o.acid*f,base:o.base*f,indicator:o.indicator*f};for(const k of Object.keys(m))o[k]-=m[k];if(o.water<EPS)for(const k of Object.keys(m))o[k]=0;return m;}
function add(o,m){for(const k of ['water','acid','base','indicator'])o[k]+=m[k];o.mixed=false;}
function spill(s,p,m){if(m.water<=EPS)return;const q=s.spills.find(q=>Math.abs(q.x-p.x)<25);if(q)add(q,m);else s.spills.push({x:p.x,...m});}
function receive(s,to,m,p){if(!to){spill(s,p,m);return;}const room=Math.max(0,to.capacity-to.water),f=m.water?Math.min(1,room/m.water):0;add(to,Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v*f])));spill(s,p,Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v*(1-f)])));}
export function transfer(s,fromId,toId,volume){const a=s.items[fromId],b=s.items[toId];if(s.phase!=='working'||!active(a)||!active(b)||a===b||!('water'in a)||!('water'in b)||!Number.isFinite(volume)||volume<=0)return 0;const m=remove(a,Math.min(volume,Math.max(0,b.capacity-b.water)));receive(s,b,m,point(b));s.flow=[{from:point(a),to:point(b)}];return m.water;}
export function targetAt(s,p,exclude,inside=false){return Object.values(s.items).filter(o=>active(o)&&o.id!==exclude&&['bottle','conical','beaker','burette'].includes(o.kind)&&Math.abs(o.angle)<20&&Math.abs(p.x-o.x)<(o.kind==='burette'?35:50)&&(inside?p.y>=o.y-15&&p.y<=o.y+(o.kind==='burette'?225:115):p.y<=o.y+25&&o.y-p.y<190)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];}
export function toolTarget(s,id){const o=s.items[id];if(!active(o))return null;const p=point(o,0,['pipette','probe'].includes(o.kind)?105:45);return targetAt(s,p,id,true)||targetAt(s,p,id);}
export function pour(s,id,ml=10){const o=s.items[id];if(!active(o)||!['bottle','conical','beaker'].includes(o.kind))return 0;const to=targetAt(s,point(o,0,-5),id);return to?transfer(s,id,to.id,ml):0;}
export function fillPipette(s,id){const p=s.items.pipette,b=s.items[id];if(s.phase!=='working'||!active(p)||!active(b)||b.kind==='burette')return 0;if(p.water<EPS)p.source=id;else if(p.source!==id)p.source='mixed';const n=transfer(s,id,p.id,25-p.water);return n;}
export function deliverPipette(s,id){const p=s.items.pipette,volume=p.water,b=s.items[id],blank=b&&b.acid+b.base<EPS,n=transfer(s,p.id,id,volume);if(id==='flask'&&n>EPS){if(s.sample.volume<EPS)s.sample={volume:0,source:blank?p.source:'contaminated flask'};s.sample.volume+=n;if(s.sample.source!==p.source)s.sample.source='mixed';}return n;}
export function attach(s,id){const o=s.items[id];if(s.phase!=='working'||!active(o))return false;
 if(id==='burette'){const stand=s.items.stand,target=point(stand,130,-363);if(!active(stand)||Math.abs(stand.angle)>10||Math.abs(o.x-target.x)>80||Math.abs(o.y-target.y)>80)return false;o.x=target.x;o.y=target.y;o.angle=stand.angle;s.links=s.links.filter(l=>l.b!=='burette');s.links.push({id:'burette-clamp',a:'stand',b:'burette',pa:{x:130,y:-275},pb:{x:0,y:88}});}
 else if(id==='funnel'){const b=s.items.burette;if(!active(b)||Math.abs(b.angle)>15||Math.abs(o.x-b.x)>40||Math.abs(o.y+60-b.y)>65)return false;o.parent='burette';o.x=b.x;o.y=b.y-60;o.angle=b.angle;}
 else return false;physicsFor(s).sync();return true;
}
export function fillBurette(s,id='base',ml=10){const b=s.items.burette,source=s.items[id];if(s.phase!=='working'||!active(b)||!active(source)||!active(s.items.funnel)||s.items.funnel.parent!=='burette'||Math.hypot(source.x-b.x,source.y-b.y)>230)return 0;return transfer(s,id,'burette',ml);}
export function dispense(s,ml){const b=s.items.burette;if(s.phase!=='working'||!active(b)||!Number.isFinite(ml)||ml<=0||Math.abs(b.angle)>25)return 0;
 const m=remove(b,ml),tip=b.tip,need=Math.max(0,.2-tip.water),fill=Math.min(need,m.water),f=m.water>EPS?fill/m.water:0;for(const k of Object.keys(m)){tip[k]+=m[k]*f;m[k]*=1-f;}
 // Once primed, liquid entering the tip displaces its existing composition.
 if(m.water>EPS){const old=remove(tip,m.water);add(tip,m);const out=remove(tip,Math.max(0,tip.water-.2));for(const k of Object.keys(out))out[k]+=old[k];const to=targetAt(s,point(b,0,250),'burette');receive(s,to,out,point(b,0,250));s.delivered+=to?.id==='flask'?out.water:0;s.missed+=to?.id==='flask'?0:out.water;s.flow=[{from:point(b,0,250),to:to?point(to):{x:b.x,y:525}}];}
 return m.water+fill;
}
export function setInitial(s){if(s.phase!=='working'||!active(s.items.burette))return false;s.startReading=reading(s);s.initialTrialCount=s.trials.length;const b=s.items.burette;s.standardValid=b.water>EPS&&b.acid<EPS&&Math.abs(b.base/(b.water/1000)-BASE_CONCENTRATION)<1e-7;s.delivered=0;s.missed=0;return true;}
export function drain(s,id){const o=s.items[id],w=s.items.waste;if(s.phase!=='working'||!active(o)||!active(w)||id==='waste'||!('water'in o)||Math.hypot(o.x-w.x,o.y-w.y)>230)return 0;const n=transfer(s,id,'waste',o.water);if(id==='flask'&&o.water<EPS)s.sample={volume:0,source:null};return n;}
export function swirl(s){const o=s.items.flask;if(s.phase!=='working'||!active(o)||o.water<EPS)return false;o.mixed=true;return true;}
export function addIndicator(s){const o=s.items.indicator,to=toolTarget(s,'indicator');if(s.phase!=='working'||!active(o)||o.drops<=0||!to||to.kind!=='conical')return false;o.drops--;to.indicator++;return true;}
export function probeReading(s){const p=s.items.probe,to=toolTarget(s,'probe');if(!active(p)||!to||to.water<EPS||!to.mixed)return null;const tip=point(p,0,105),surface=to.y+110-90*Math.min(1,to.water/to.capacity);if(tip.y<surface||tip.y>to.y+120)return null;return pH(to);}
export function recordTrial(s){if(s.phase!=='working'||s.startReading===null||!active(s.items.flask)||!active(s.items.burette))return null;const f=s.items.flask,titre=reading(s)-s.startReading;if(titre<=EPS)return null;const r={initial:s.startReading,final:reading(s),titre,sampleVolume:s.sample.volume,pH:pH(f),mixed:f.mixed,indicator:f.indicator,missed:s.missed,delivered:s.delivered,source:s.sample.source,standardValid:s.standardValid,freshInitial:s.initialTrialCount===s.trials.length,concentration:BASE_CONCENTRATION*titre/SAMPLE_VOLUME};s.trials.push(r);return r;}
export function outcome(s){const r=s.trials.at(-1);return {success:Boolean(r&&r.source==='acid'&&r.standardValid&&r.freshInitial&&Math.abs(r.sampleVolume-25)<.01&&r.mixed&&r.pH>=6&&r.pH<=7.6&&r.missed<EPS&&Math.abs(r.titre-r.delivered)<.011),trial:r};}
export function totals(s){return Object.values(s.items).filter(o=>'water'in o).concat(s.items.burette.tip,s.spills).reduce((t,o)=>({water:t.water+o.water,acid:t.acid+o.acid,base:t.base+o.base}),{water:0,acid:0,base:0});}
const worlds=new WeakMap();
export function physicsFor(s){let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{if(!('water'in o))return;const m=remove(o,o.water*f);receive(s,targetAt(s,point(o),o.id),m,point(o));});worlds.set(s,w);}return w;}
export function detach(s,id){if(s.phase!=='working')return;s.items[id].parent=null;if(id==='burette')s.links=s.links.filter(l=>l.b!==id);s.held=id;physicsFor(s).hold(id);}
export function placeItem(s){s.held=null;physicsFor(s).release();}
export function stepPhysics(s,dt,id){if(s.phase!=='working')return;physicsFor(s).step(dt,id);const b=s.items.burette,f=s.items.funnel;if(f.parent==='burette'){Object.assign(f,point(b,0,-60));f.angle=b.angle;}}

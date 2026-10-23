import {PhysicsWorld} from './physics.js';
export const MOLAR_MASS=58.44, EPS=1e-9;
export const NAMES={balance:'Digital balance',boat:'Weighing boat',salt:'Sodium chloride bottle',spatula:'Spatula',beaker:'Dissolving beaker',rod:'Stirring rod',funnel:'Transfer funnel',water:'Water wash bottle',stock:'Stock volumetric flask · 100 mL',dilution:'Dilution volumetric flask · 100 mL',stopper1:'Stock stopper',stopper2:'Dilution stopper',pipette:'10 mL pipette and filler',waste:'Waste beaker'};
const box=(x,y,w,h)=>({x,y,w,h});
const vessel=(id,kind,x,y,capacity)=>({id,kind,x,y,angle:0,capacity,water:0,salt:0,dissolved:0,mixed:false,collision:kind==='flask'?[box(-10,20,5,40),box(10,20,5,40),box(-36,84,5,88),box(36,84,5,88),box(0,128,76,5)]:undefined});
export function createState(){return {width:1000,phase:'working',held:null,links:[],flow:[],passiveFlow:[],spills:[],tare:0,initial:{water:500,salt:5},aliquotVerified:true,aliquots:[],items:{
 balance:{id:'balance',kind:'balance',x:120,y:465,angle:0,mass:4,collision:[box(0,40,150,40),box(0,12,125,16)]},
 boat:{...vessel('boat','boat',100,100,2),collision:[box(-34,12,4,24),box(34,12,4,24),box(0,25,72,4)]},
 salt:{...vessel('salt','bottle',255,425,10),salt:5,collision:[box(0,50,60,100)]},
 spatula:{...vessel('spatula','spatula',200,100,1),collision:[box(0,35,12,70)]},
 beaker:vessel('beaker','beaker',355,429,150),rod:{id:'rod',kind:'rod',x:300,y:100,angle:0,collision:[box(0,50,7,100)]},
 funnel:{id:'funnel',kind:'transferFunnel',water:0,salt:0,dissolved:0,capacity:.2,x:400,y:100,angle:0,collision:[box(0,18,60,10),box(0,48,8,50)]},
 water:{...vessel('water','wash',840,415,600),water:500,collision:[box(0,55,65,110)]},
 stock:vessel('stock','flask',520,395,120),dilution:vessel('dilution','flask',680,395,120),
 stopper1:{id:'stopper1',kind:'stopper',x:500,y:100,angle:0,for:'stock',collision:[box(0,8,22,16)]},
 stopper2:{id:'stopper2',kind:'stopper',x:600,y:100,angle:0,for:'dilution',collision:[box(0,8,22,16)]},
 pipette:{...vessel('pipette','pipette',700,100,10),collision:[box(0,50,8,100)]},waste:vessel('waste','beaker',900,100,180)
 }};}
export function point(o,x=0,y=0){const a=(o.angle||0)*Math.PI/180;return{x:o.x+x*Math.cos(a)-y*Math.sin(a),y:o.y+x*Math.sin(a)+y*Math.cos(a)};}
export const active=o=>o&&!o.stored;
export const concentration=o=>o.water>EPS?o.dissolved/MOLAR_MASS/(o.water/1000):0;
export const solid=o=>Math.max(0,(o.salt||0)-(o.dissolved||0));
export const stoppered=(s,id)=>Object.values(s.items).some(o=>o.kind==='stopper'&&o.parent===id&&!o.stored);
export function targetAt(s,p,exclude,inside=false){return Object.values(s.items).filter(o=>active(o)&&o.id!==exclude&&['beaker','flask','boat'].includes(o.kind)&&!stoppered(s,o.id)&&Math.abs(o.angle)<20&&Math.abs(p.x-o.x)<(o.kind==='flask'?34:46)&&(inside?p.y>=o.y-25&&p.y<o.y+(o.kind==='flask'?125:100):p.y<=o.y+20&&o.y-p.y<180)).sort((a,b)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(p.x-b.x,p.y-b.y))[0];}
export function toolTarget(s,id){const o=s.items[id];if(!active(o))return null;const p=point(o,0,o.kind==='pipette'||o.kind==='rod'?95:40);return targetAt(s,p,id,true)||targetAt(s,p,id);}
function spill(s,p,m){if(m.water+m.salt<=EPS)return;const pool=s.spills.find(o=>Math.abs(o.x-p.x)<25);if(pool){pool.water+=m.water;pool.salt+=m.salt;pool.dissolved+=m.dissolved;}else s.spills.push({x:p.x,...m});}
function accept(s,to,m,p){
 const funnel=to?.kind==='flask'?Object.values(s.items).find(o=>active(o)&&o.kind==='transferFunnel'&&o.parent===to.id):null;
 if(funnel&&m.water>EPS){const water=funnel.water+m.water,salt=funnel.salt+m.salt,dissolved=funnel.dissolved+m.dissolved,f=Math.min(.2,water)/water;funnel.water=water*f;funnel.salt=salt*f;funnel.dissolved=dissolved*f;m={water:water*(1-f),salt:salt*(1-f),dissolved:dissolved*(1-f)};}
 const room=to?Math.max(0,to.capacity-to.water):0,f=to?m.water>EPS?Math.min(1,room/m.water):1:0;
 if(to){to.water+=m.water*f;to.salt+=m.salt*f;to.dissolved+=m.dissolved*f;to.mixed=false;}
 spill(s,p,{water:m.water*(1-f),salt:m.salt*(1-f),dissolved:m.dissolved*(1-f)});
}
export function transfer(s,fromId,toId,volume,{drain=false,dry=false}={}){
 const from=s.items[fromId],to=s.items[toId];if(s.phase!=='working'||!active(from)||!active(to)||from===to||stoppered(s,fromId)||stoppered(s,toId)||!Number.isFinite(volume)||volume<=0)return 0;
 if(dry){const mass=Math.min(solid(from),volume);from.salt-=mass;accept(s,to,{water:0,salt:mass,dissolved:0},point(to));return mass;}
 const film=drain&&from.kind!=='pipette'?.2:0,v=Math.min(volume,Math.max(0,from.water-film));if(v<=EPS)return 0;
 const f=v/from.water,d=from.dissolved*f;from.water-=v;from.salt-=d;from.dissolved-=d;
 // Unmixed sampling is recorded, not passed off as a verified homogeneous aliquot.
 if(to.kind==='pipette')to.verified=to.water<=EPS?from.mixed:Boolean(to.verified&&from.mixed);
 accept(s,to,{water:v,salt:d,dissolved:d},point(to));s.flow=[{from:point(from),to:point(to)}];return v;
}
export function pour(s,id,volume){const o=s.items[id];if(!active(o)||!['beaker','flask','boat'].includes(o.kind)||stoppered(s,id))return 0;
 const p=point(o,0,-8),to=targetAt(s,p,id);if(!to)return 0;
 if(o.water>EPS)return transfer(s,id,to.id,volume,{drain:true});return transfer(s,id,to.id,Math.min(.05,volume),{dry:true});
}
export function weigh(s){const b=s.items.boat,k=s.items.balance;return active(b)&&active(k)&&Math.abs(b.x-k.x)<48&&Math.abs(b.y+27-(k.y+4))<10&&Math.abs(b.angle)<10?.750+b.salt+b.water:0;}
export function reading(s){return (weigh(s)-s.tare).toFixed(3);}
export function tare(s){if(s.phase==='working')s.tare=weigh(s);}
export function scoop(s,fine=false){const o=s.items.spatula,b=s.items.salt;if(s.phase!=='working'||!active(o))return 'Take the spatula out of storage.';
 if(o.salt>EPS){const to=toolTarget(s,o.id);if(!to)return 'Move the spatula above a vessel.';transfer(s,o.id,to.id,o.salt,{dry:true});return 'Salt transferred.';}
 if(!active(b)||Math.abs(o.x-b.x)>55||Math.abs(o.y+40-b.y)>95)return 'Move the spatula beside the salt bottle.';
 const m=Math.min(b.salt,fine===true?.001:fine==='medium'?.01:.05);b.salt-=m;o.salt+=m;return `Loaded ${m.toFixed(3)} g. Move above the weighing boat and add.`;
}
export function stir(s,id){const b=s.items[id];if(s.phase!=='working'||!active(b)||b.water<=EPS)return false;const dissolved=Math.min(solid(b),b.water*.3);b.dissolved+=dissolved;b.mixed=solid(b)<EPS;return true;}
export function waterDose(s,id,ml){if(s.phase!=='working'||!Number.isFinite(ml)||ml<=0||!['beaker','flask','boat','transferFunnel'].includes(s.items[id]?.kind))return 0;const o=s.items[id];return transfer(s,'water',o.kind==='transferFunnel'&&o.parent?o.parent:id,ml);}
export function bulkDose(s,id){const b=s.items[id];if(!b)return 0;const amount=b.kind==='flask'?Math.min(10,Math.max(0,95-b.water)):10;return waterDose(s,id,amount);}
export function pipetteFill(s,toId,amount=10){const p=s.items.pipette,b=s.items[toId];if(s.phase!=='working'||!active(p)||!active(b)||stoppered(s,toId)||solid(b)>EPS)return 0;const v=Math.min(amount,10-p.water);if(p.water<=EPS)p.source=toId;else if(p.source!==toId)p.source='mixed sources';if(toId==='stock'&&p.water<=EPS)s.stockPreparation={volume:b.water,concentration:concentration(b),mixed:b.mixed};return transfer(s,toId,p.id,v);}
export function pipetteDeliver(s,toId){const p=s.items.pipette,empty=s.items[toId]?.water<=EPS,v=transfer(s,p.id,toId,p.water);if(v>EPS&&toId==='dilution'){if(empty){s.aliquots=[];s.aliquotVerified=true;}s.aliquotVerified=Boolean(s.aliquotVerified&&p.verified);s.aliquots.push({volume:v,source:p.source});}return v;}
export function attach(s,id){const o=s.items[id];if(s.phase!=='working'||!active(o)||!['stopper','transferFunnel'].includes(o.kind))return false;
 const f=Object.values(s.items).filter(b=>active(b)&&b.kind==='flask'&&(!o.for||o.for===b.id)&&!stoppered(s,b.id)&&Math.abs(b.x-o.x)<42&&Math.abs(b.y-o.y-(o.kind==='transferFunnel'?65:0))<65).sort((a,b)=>Math.abs(a.x-o.x)-Math.abs(b.x-o.x))[0];if(!f)return false;
 if(o.kind==='stopper'&&Object.values(s.items).some(b=>b.kind==='transferFunnel'&&b.parent===f.id))return false;
 o.parent=f.id;o.x=f.x;o.y=f.y-(o.kind==='transferFunnel'?65:12);o.angle=f.angle;physicsFor(s).sync();return true;
}
export function mix(s,id){const o=s.items[id];if(s.phase!=='working'||!active(o)||!stoppered(s,id)||solid(o)>EPS||o.water<=EPS)return false;o.mixed=true;return true;}
export function detach(s,id){const o=s.items[id];if(s.phase!=='working'||!active(o))return;o.parent=null;s.held=id;physicsFor(s).hold(id);}
export function placeItem(s){s.held=null;physicsFor(s).release();}
const worlds=new WeakMap();
export function physicsFor(s){let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{
 if(!('water'in o)||stoppered(s,o.id)||o.kind==='bottle'||o.kind==='wash')return;
 const m={water:o.water*f,salt:o.salt*f,dissolved:o.dissolved*f};o.water-=m.water;o.salt-=m.salt;o.dissolved-=m.dissolved;o.mixed=false;
 accept(s,targetAt(s,point(o),o.id),m,point(o));});worlds.set(s,w);}return w;}
export function stepPhysics(s,dt,id){if(s.phase!=='working')return;physicsFor(s).step(dt,id);for(const o of Object.values(s.items).filter(o=>o.parent)){const parent=s.items[o.parent],p=point(parent,0,o.kind==='transferFunnel'?-65:-12);o.x=p.x;o.y=p.y;o.angle=parent.angle;}}
export function totals(s){return Object.values(s.items).filter(o=>'water'in o).concat(s.spills).reduce((t,o)=>({water:t.water+o.water,salt:t.salt+o.salt}),{water:0,salt:0});}
export function outcome(s){const a=s.items.stock,b=s.items.dilution,prepared=s.stockPreparation;const stockVolume=prepared?.volume??a.water;const aliquotVolume=s.aliquots.reduce((v,a)=>v+a.volume,0);const success=s.aliquots.length>0&&s.aliquots.every(a=>a.source==='stock')&&Math.abs(aliquotVolume-10)<.020001&&Math.abs(stockVolume-100)<=.100001&&[a,b].every((o,i)=>solid(o)<EPS&&o.mixed&&Math.abs(concentration(o)/(i?.01:.1)-1)<=.01)&&Math.abs(b.water-100)<=.100001&&s.aliquotVerified;return {success,stock:concentration(a),dilution:concentration(b),stockVolume,verified:s.aliquotVerified};}
export function reviewData(s){const r=outcome(s),b=s.items.dilution;return r.verified&&b.mixed&&solid(b)<EPS&&b.water>EPS&&r.dilution>EPS?{answer:r.dilution,prompt:`Your final dilution contains ${b.dissolved.toPrecision(7)} g dissolved NaCl in ${b.water.toFixed(3)} mL. Calculate its concentration (mol dm⁻³). Use M = 58.44 g mol⁻¹.`,attempt:true}:{answer:.01,prompt:'A homogeneous 0.100 mol dm⁻³ stock supplies a 10.00 mL aliquot diluted to 100.0 mL. Calculate the final concentration (mol dm⁻³). This is a supplied example, not a verified reading from your attempt.',attempt:false};}

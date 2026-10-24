import {PhysicsWorld} from './physics.js';
export const CHEM={molarMass:100.09,molarVolume:24000,chipsK:.055,powderK:.18,capacity:100};
export const NAMES={acid:'HCl · 1.00 M',water:'Water supply',chips:'Calcium carbonate chips',powder:'Calcium carbonate powder',spatula:'Spatula',vial:'Inner acid vial',flask:'Reaction flask',bung:'Bung and delivery tube',syringe:'Gas syringe · 100 mL',stand:'Syringe stand',waste:'Waste beaker'};
const box=(x,y,w,h)=>({x,y,w,h});
const pool=(id,kind,x,y,capacity,water=0,acid=0)=>({id,kind,x,y,angle:0,capacity,water,acid,chips:0,powder:0});
export function createState(){return {phase:'working',width:1000,held:null,links:[],flow:[],passiveFlow:[],spills:[],time:0,elapsed:0,clock:false,logger:false,nextLog:0,records:[],trials:[],trialId:1,charge:null,reacted:0,escaped:0,collected:0,hose:false,tight:true,rate:0,items:{
 acid:pool('acid','beaker',140,429,250,200,.2),water:pool('water','beaker',270,429,500,300),
 chips:{id:'chips',kind:'solidBottle',x:90,y:100,angle:0,chips:2,powder:0,collision:[box(0,50,60,100)]},powder:{id:'powder',kind:'solidBottle',x:180,y:100,angle:0,chips:0,powder:2,collision:[box(0,50,60,100)]},
 spatula:{id:'spatula',kind:'spatula',x:270,y:100,angle:0,chips:0,powder:0,collision:[box(0,35,12,70)]},
 vial:{...pool('vial','vial',360,100,20),collision:[box(-12,24,4,48),box(12,24,4,48),box(0,47,28,4)]},
 flask:{...pool('flask','conical',420,405,200),collision:[box(-51,78,7,84),box(51,78,7,84),box(0,118,110,5)]},
 bung:{id:'bung',kind:'bung',x:450,y:100,angle:0,collision:[box(0,7,28,14)]},
 syringe:{id:'syringe',kind:'gasSyringe',x:570,y:100,angle:0,spawnYMin:30,spawnYMax:250,collision:[box(120,0,220,34),box(245,0,30,12)]},
 stand:{id:'stand',kind:'clampStand',x:760,y:508,angle:0,mass:8,collision:[box(0,-155,10,310),box(0,9,130,16),box(15,-210,30,8)]},
 waste:pool('waste','beaker',910,429,1000)
 }};}
export const active=o=>o&&!o.stored;
export const keys=['water','acid','chips','powder'];
export function point(o,x=0,y=0){const a=(o.angle||0)*Math.PI/180;return{x:o.x+x*Math.cos(a)-y*Math.sin(a),y:o.y+x*Math.sin(a)+y*Math.cos(a)};}
export function receiver(s,p,exclude){return Object.values(s.items).filter(o=>active(o)&&'water'in o&&o.id!==exclude&&Math.abs(o.angle)<20&&Math.abs(o.x-p.x)<(o.kind==='vial'?24:55)&&p.y>=o.y-190&&p.y<=o.y+80).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];}
function spill(s,m,x){if(!keys.some(k=>m[k]>1e-12))return;s.spills.push({...m,x});}
function receive(s,to,m){if(to.id==='flask'&&s.charge){for(const k of keys)s.charge[k]+=m[k];s.charge.changedAfterStart=true;}const f=m.water>0?Math.min(1,Math.max(0,to.capacity-to.water)/m.water):1;for(const k of keys)to[k]+=m[k]*f;spill(s,Object.fromEntries(keys.map(k=>[k,m[k]*(1-f)])),to.x);}
export function transfer(s,from,to,ml){const a=s.items[from],b=s.items[to];if(s.phase!=='working'||!active(a)||!active(b)||!('water'in a)||!('water'in b)||from===to||ml<=0||!Number.isFinite(ml)||b.id==='flask'&&s.items.bung.parent==='flask')return 0;const water=Math.min(ml,a.water),f=a.water?water/a.water:0,m=Object.fromEntries(keys.map(k=>[k,a[k]*f]));for(const k of keys)a[k]-=m[k];receive(s,b,m);s.flow=[{from:point(a),to:point(b)}];return water;}
export function pour(s,id,ml=10){const a=s.items[id],to=active(a)&&receiver(s,point(a),id);return to?transfer(s,id,to.id,ml):0;}
export function scoop(s,mass=.1){if(s.phase!=='working'||!active(s.items.spatula)||!Number.isFinite(mass)||mass<=0)return false;const t=s.items.spatula,p=point(t,0,60);if(t.chips+t.powder<1e-10){const source=['chips','powder'].map(id=>s.items[id]).find(o=>active(o)&&Math.abs(o.x-p.x)<55&&Math.abs(o.y+50-p.y)<110);if(!source)return false;const kind=source.id,n=Math.min(mass,source[kind]);source[kind]-=n;t[kind]+=n;return n>0;}
 const to=receiver(s,p,'spatula');if(!to||to.id==='flask'&&s.items.bung.parent==='flask')return false;for(const k of ['chips','powder']){to[k]+=t[k];if(to.id==='flask'&&s.charge){s.charge[k]+=t[k];s.charge.changedAfterStart=true;}t[k]=0;}return true;}
export function fitVial(s){const v=s.items.vial,f=s.items.flask;if(s.phase!=='working'||!active(v)||!active(f)||s.items.bung.parent||Math.abs(v.x-f.x)>55||Math.abs(v.y-f.y)>120)return false;v.parent='flask';v.x=f.x+15;v.y=f.y+55;v.angle=f.angle;physicsFor(s).sync();return true;}
export function fitBung(s){const b=s.items.bung,f=s.items.flask;if(s.phase!=='working'||!active(b)||!active(f)||Math.abs(b.x-f.x)>55||Math.abs(b.y-f.y)>100)return false;b.parent='flask';b.x=f.x;b.y=f.y-8;b.angle=f.angle;physicsFor(s).sync();return true;}
export function mixVial(s){const v=s.items.vial,f=s.items.flask;if(s.phase!=='working'||!active(v)||!active(f)||v.parent!=='flask'||v.water<=0)return false;const m=Object.fromEntries(keys.map(k=>[k,v[k]]));for(const k of keys)v[k]=0;receive(s,f,m);return true;}
export function clampSyringe(s){const o=s.items.syringe,t=s.items.stand;if(s.phase!=='working'||!active(o)||!active(t)||Math.abs(o.x+180-t.x)>150||Math.abs(o.y-(t.y-210))>100)return false;const old={x:o.x,y:o.y,angle:o.angle};Object.assign(o,{x:t.x-180,y:t.y-210,angle:0});const w=physicsFor(s);w.sync();if(w.blocked(w.entries.get('syringe').body,['stand'])){Object.assign(o,old);w.sync();return false;}s.links=[{id:'syringe-clamp',a:'stand',b:'syringe',pa:{x:0,y:-210},pb:{x:180,y:0}}];w.sync();return true;}
export function connect(s){const b=s.items.bung,g=s.items.syringe;if(s.phase!=='working'||!active(b)||!active(g)||b.parent!=='flask'||Math.hypot(b.x-g.x,b.y-g.y)>480)return false;s.hose=!s.hose;return true;}
export function connected(s){const b=s.items.bung,g=s.items.syringe;return s.hose&&active(b)&&active(g)&&active(s.items.flask)&&b.parent==='flask'&&Math.abs(g.angle)<20&&Math.hypot(b.x-g.x,b.y-g.y)<480;}
export function zeroSyringe(s){if(s.phase!=='working')return;s.escaped+=s.collected/CHEM.molarVolume;s.collected=0;}
export function toggleClock(s){if(s.phase!=='working')return false;if(s.clock&&s.rate>0&&s.charge)s.charge.clockPaused=true;s.clock=!s.clock;if(s.clock&&s.records.length===0){record(s);s.nextLog=s.elapsed+2;}return s.clock;}
export function record(s){if(s.phase!=='working'||!active(s.items.syringe))return null;const r={time:Number(s.elapsed.toFixed(1)),volume:Number(s.collected.toFixed(1))};const last=s.records.at(-1);if(last&&last.time===r.time&&last.volume===r.volume)return last;s.records.push(r);return r;}
export function stepChemistry(s,dt){if(s.phase!=='working'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.05);s.time+=dt;if(s.clock)s.elapsed+=dt;if(!connected(s))s.hose=false;const f=s.items.flask;s.rate=0;
 for(const f of [...Object.values(s.items).filter(o=>'water'in o),...s.spills]){if(active(f)&&f.water>0&&f.acid>1e-12&&f.chips+f.powder>1e-9){if(f.id==='flask'&&!s.charge)s.charge={chips:f.chips,powder:f.powder,acid:f.acid,water:f.water,clock:s.clock,sealed:connected(s)&&s.tight,time:s.time};
 const basis=f.id==='flask'?s.charge:(f.reactionStart||=({chips:f.chips,powder:f.powder}));
 for(const k of ['chips','powder']){const initial=Math.max(basis[k],f[k]),n=Math.max(0,f[k])/CHEM.molarMass,available=Math.max(0,Math.min(n,f.acid/2)),rate=CHEM[k+'K']*initial/CHEM.molarMass*Math.pow(initial?Math.max(0,f[k])/initial:0,2/3)*Math.min(1,f.acid/f.water*1000),extent=Math.min(available,rate*dt);f[k]=Math.max(0,f[k]-extent*CHEM.molarMass);f.acid=Math.max(0,f.acid-extent*2);s.reacted+=extent;const gas=extent*CHEM.molarVolume,captured=(f.id==='flask'||f.parent==='flask')&&connected(s)?Math.min(gas*(s.tight?1:.35),CHEM.capacity-s.collected):0;s.collected+=captured;s.escaped+=(gas-captured)/CHEM.molarVolume;if(f.id==='flask')s.rate+=gas/dt;}}}
 if(active(s.items.syringe)&&connected(s)&&!s.tight){const loss=s.collected*(1-Math.exp(-.06*dt));s.collected-=loss;s.escaped+=loss/CHEM.molarVolume;}
 if(s.clock&&s.logger&&s.elapsed>=s.nextLog){record(s);s.nextLog=s.elapsed+2;}
}
export function saveTrial(s){if(!s.records.length)return null;const t={id:s.trialId,charge:s.charge?{...s.charge}:null,records:s.records.map(r=>({...r})),collected:s.collected,escaped:s.escaped,reacted:s.reacted,tight:s.tight};const i=s.trials.findIndex(t=>t.id===s.trialId);if(i<0)s.trials.push(t);else s.trials[i]=t;return t;}
export function nextTrial(s){saveTrial(s);const n=createState();n.trials=s.trials;n.trialId=s.trialId+1;return n;}
export function balances(s){const pools=Object.values(s.items).filter(o=>('chips'in o)).concat(s.spills);return{solid:pools.reduce((a,o)=>a+(o.chips||0)+(o.powder||0),0)+s.reacted*CHEM.molarMass,acid:pools.reduce((a,o)=>a+(o.acid||0),0)+2*s.reacted,water:pools.reduce((a,o)=>a+(o.water||0),0),gas:s.collected/CHEM.molarVolume+s.escaped-s.reacted};}
export function meanRate(records){for(let i=1;i<records.length;i++){const a=records[0],b=records[i];if(b.time>a.time)return{a,b,value:(b.volume-a.volume)/(b.time-a.time)};}return null;}
export function fairPair(a,b){const x=a?.charge,y=b?.charge;if(!x||!y)return false;const pure=z=>(z.chips>0&&z.powder===0)||(z.powder>0&&z.chips===0);return pure(x)&&pure(y)&&Boolean(x.powder)!==Boolean(y.powder)&&Math.abs(x.chips+x.powder-y.chips-y.powder)<.001&&Math.abs(x.acid-y.acid)<1e-6&&Math.abs(x.water-y.water)<.01&&x.sealed&&y.sealed&&x.clock&&y.clock&&!x.changedAfterStart&&!y.changedAfterStart&&!x.clockPaused&&!y.clockPaused;}
const worlds=new WeakMap();
export function physicsFor(s){let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{if(!('water'in o)||o.water<=0||o.id==='flask'&&s.items.bung.parent==='flask')return;const m=Object.fromEntries(keys.map(k=>[k,o[k]*f]));for(const k of keys)o[k]-=m[k];spill(s,m,o.x);});worlds.set(s,w);}return w;}
export function detach(s,id){if(s.phase!=='working')return;s.items[id].parent=null;if(['syringe','stand'].includes(id)&&id==='syringe')s.links=[];if(['bung','syringe','flask'].includes(id))s.hose=false;s.held=id;physicsFor(s).hold(id);}
export function placeItem(s){s.held=null;physicsFor(s).release();}
export function stepPhysics(s,dt,id){if(s.phase!=='working')return;physicsFor(s).step(dt,id);const f=s.items.flask;for(const [key,x,y]of [['bung',0,-8],['vial',15,55]]){const o=s.items[key];if(o.parent==='flask'){Object.assign(o,point(f,x,y));o.angle=f.angle;}}}

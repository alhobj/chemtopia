import {PhysicsWorld} from './physics.js';
export const EPS=1e-8;
export const MARKERS={
 green:{name:'Green marker',color:'#397e56',components:[['#d4ac37',.75],['#368db4',.35]]},
 purple:{name:'Purple marker',color:'#77538c',components:[['#ba5d87',.65],['#368db4',.4]]},
 black:{name:'Black marker',color:'#34444d',components:[['#d4ac37',.85],['#ba5d87',.55],['#368db4',.2]]}
};
export const NAMES={source:'Water beaker',chamber:'Developing chamber',paper:'Chromatography paper',bar:'Support bar and clip',pencil:'Pencil',green:'Green marker',purple:'Purple marker',black:'Black marker',lid:'Chamber lid',ruler:'Ruler'};
const box=(x,y,w,h)=>({x,y,w,h});
export function createState(){
 const state={width:1400,phase:'working',held:null,links:[],shelves:[{x:1030,y:190,w:320,h:18}],spills:[],flow:[],passiveFlow:[],elapsed:0,nextSpot:1,
 items:{
 source:{id:'source',kind:'beaker',x:100,y:413,angle:0,water:1,capacity:1},
 chamber:{id:'chamber',kind:'chamber',x:600,y:305,angle:0,water:0,ink:0,capacity:1,collisionCategory:64,collision:[box(-98,110,4,220),box(98,110,4,220),box(0,218,200,4)]},
 paper:{id:'paper',kind:'chromPaper',collisionCategory:32,x:300,y:345,angle:0,water:0,capacity:.02,baseline:null,front:null,frontMark:null,overrun:false,spots:[],collision:[box(0,90,120,180)]},
 bar:{id:'bar',kind:'bar',collisionCategory:128,x:950,y:519,angle:0,mass:.5,collision:[box(0,0,230,12)]},
 pencil:{id:'pencil',kind:'pencil',collisionMask:~32,x:1140,y:91,angle:0,collision:[box(0,45,10,90)]},
 ...Object.fromEntries(Object.keys(MARKERS).map((id,i)=>[id,{id,kind:'marker',collisionMask:~32,x:900+i*80,y:111,angle:0,collision:[box(0,35,14,70)]}])),
 lid:{id:'lid',kind:'lid',x:1200,y:519,angle:0,collision:[box(0,0,200,12)]},
 ruler:{id:'ruler',kind:'ruler',collisionMask:~32,x:1320,y:325,angle:0,collision:[box(0,100,30,200)]}
 }};
 return state;
}
export function worldPoint(o,p){const a=(o.angle||0)*Math.PI/180;return{x:o.x+p.x*Math.cos(a)-p.y*Math.sin(a),y:o.y+p.x*Math.sin(a)+p.y*Math.cos(a)};}
export function paperPoint(state,p){const o=state.items.paper,a=-(o.angle||0)*Math.PI/180,x=p.x-o.x,y=p.y-o.y;return{x:x*Math.cos(a)-y*Math.sin(a),y:x*Math.sin(a)+y*Math.cos(a)};}
const upright=o=>Math.abs(o.angle||0)<15;
export function solventContact(s){
 const c=s.items.chamber,p=s.items.paper;
 if(c.stored||p.stored||!upright(c)||!upright(p)||c.water<EPS||Math.abs(p.x-c.x)>34)return null;
 const bottom=p.y+180,surface=c.y+216-200*c.water/c.capacity;
 return bottom>=surface&&bottom<=c.y+217&&p.y<c.y+210?surface-p.y:null;
}
export function detach(s,id){
 if(s.phase!=='working')return;
 s.held=id;if(id==='paper')s.links=s.links.filter(l=>l.id!=='clip-paper');
 const o=s.items[id];if(!['bar','lid'].includes(o.kind)){o.angle=0;const h=id==='paper'?180:id==='ruler'?200:id==='pencil'?90:o.kind==='marker'?70:id==='chamber'?220:112;o.y=Math.min(o.y,525-h);}
 physicsFor(s).hold(id);
}
export function placeItem(s,id){
 if(s.phase!=='working')return;s.held=null;
 const p=s.items.paper,b=s.items.bar;
 if(['paper','bar'].includes(id)&&!s.links.length&&upright(p)&&upright(b)&&Math.abs(p.x-b.x)<22&&Math.abs(p.y-(b.y+6))<22){
  if(id==='paper'){p.x=b.x;p.y=b.y+6;}else{b.x=p.x;b.y=p.y-6;}
  s.links.push({id:'clip-paper',a:'bar',pa:{x:0,y:6},b:'paper',pb:{x:0,y:0}});
 }
 physicsFor(s).release();
}
export function applyTool(s,id){
 if(s.phase!=='working')return false;
 const tool=s.items[id];if(s.items.paper.stored||!tool||tool.stored||!['pencil','marker'].includes(tool.kind))return false;
 const p=paperPoint(s,worldPoint(tool,{x:0,y:tool.kind==='pencil'?90:70})),paper=s.items.paper;
 if(Math.abs(p.x)>56||p.y<4||p.y>176)return false;
 if(id==='pencil'){
  if(paper.front!==null){paper.frontMark=p.y;}else paper.baseline=p.y;
 }else{
  const components=MARKERS[id].components;
  paper.spots.push({id:s.nextSpot++,marker:id,x:p.x,origin:p.y,components:components.map(([color,rf])=>({color,rf,y:p.y,amount:.01/components.length}))});
 }
 return true;
}
function spill(s,x,water,ink=0){
 if(water+ink<=0)return;
 let pool=s.spills.find(p=>Math.abs(p.x-x)<30);if(!pool){pool={x,water:0,ink:0};s.spills.push(pool);}pool.water+=water;pool.ink+=ink;
}
export function pour(s,id,amount){
 if(s.phase!=='working'||!Number.isFinite(amount)||amount<=0)return;
 const o=s.items[id];if(!o||o.stored||!['source','chamber'].includes(id)||o.water<EPS)return;
 const water=Math.min(o.water,amount),fraction=water/o.water,ink=(o.ink||0)*fraction;
 o.water-=water;if(o.ink)o.ink-=ink;
 const point=worldPoint(o,{x:id==='source'?61:98,y:0});
 const target=['source','chamber'].map(k=>s.items[k]).find(t=>!t.stored&&t.id!==id&&upright(t)&&point.y<=t.y+12&&Math.abs(point.x-t.x)<(t.id==='source'?38:94));
 const to={x:point.x,y:target?target.y:525};s.flow.push({from:point,to});
 if(!target){spill(s,point.x,water,ink);return;}
 const f=Math.min(1,Math.max(0,target.capacity-target.water)/water);target.water+=water*f;target.ink=(target.ink||0)+ink*f;spill(s,point.x,water*(1-f),ink*(1-f));
}
export function stepChemistry(s,dt){
 if(s.phase!=='working'||!Number.isFinite(dt)||dt<=0)return;dt=Math.min(.05,dt);s.elapsed+=dt;s.flow=[];
 const p=s.items.paper,c=s.items.chamber,contact=solventContact(s);
 if(contact===null)return;
 const uptake=Math.min(c.water,Math.max(0,p.capacity-p.water),dt*.002);c.water-=uptake;p.water+=uptake;
 if(p.front===null)p.front=Math.max(0,Math.min(180,contact));
 p.front=Math.max(0,Math.min(p.front,contact)-dt*8);if(p.front<=EPS)p.overrun=true;
 for(const spot of p.spots){
  for(const comp of spot.components){
   if(spot.origin>=contact){c.ink+=comp.amount;comp.amount=0;}
   else if(p.front<spot.origin)comp.y=Math.min(comp.y,spot.origin-(spot.origin-p.front)*comp.rf);
  }
 }
}
export function totals(s){
 return {water:s.items.source.water+s.items.chamber.water+s.items.paper.water+s.spills.reduce((n,p)=>n+p.water,0),
 ink:(s.items.source.ink||0)+s.items.chamber.ink+s.spills.reduce((n,p)=>n+p.ink,0)+s.items.paper.spots.reduce((n,spot)=>n+spot.components.reduce((a,c)=>a+c.amount,0),0)};
}
export function outcome(s){
 const p=s.items.paper;
 const spots=p.spots.map(spot=>({...spot,components:spot.components.filter(c=>c.amount>EPS)})).filter(spot=>spot.components.length);
 const separated=spots.filter(spot=>Math.max(...spot.components.map(c=>c.y))-Math.min(...spot.components.map(c=>c.y))>12);
 const baselineValid=p.baseline!==null&&separated.some(spot=>Math.abs(spot.origin-p.baseline)<=5);
 const frontValid=p.frontMark!==null&&p.front!==null&&Math.abs(p.frontMark-p.front)<=5&&!p.overrun;
 return {success:separated.length>0,measurable:baselineValid&&frontValid,spots:separated,overrun:p.overrun,front:p.front,baseline:p.baseline,frontMark:p.frontMark};
}
export function measurements(s){
 const r=outcome(s);if(!r.measurable)return [];
 return r.spots.filter(spot=>Math.abs(spot.origin-r.baseline)<=5).flatMap(spot=>spot.components.map((c,i)=>({id:spot.id+'-'+i,label:MARKERS[spot.marker].name+' · '+c.color,color:c.color,
 front:(r.baseline-r.frontMark)/10,distance:(r.baseline-c.y)/10}))).filter(row=>row.front>0&&row.distance>=0);
}
export function checkMeasurement(row,distance,front,rf){
 if(![distance,front,rf].every(Number.isFinite)||front<=0||distance<0||distance>front||rf<0||rf>1)return false;
 return Math.abs(distance-row.distance)<=.2&&Math.abs(front-row.front)<=.2&&Math.abs(rf-distance/front)<=.025;
}
const worlds=new WeakMap();
export function physicsFor(s){
 let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{
  const water=(o.water||0)*f,ink=(o.ink||0)*f;o.water-=water;if(o.ink)o.ink-=ink;spill(s,o.x,water,ink);
 });worlds.set(s,w);}return w;
}
export function stepPhysics(s,dt,held){
 if(s.phase!=='working')return false;
 const p=s.items.paper;
 // The hollow chamber keeps solid walls and a floor; only the clip bar permits insertion.
 p.collisionMask=~128;
 return physicsFor(s).step(dt,held);
}

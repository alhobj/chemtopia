// Finite liquid pools and apparatus handling shared only by the three measurement labs.
import {PhysicsWorld} from './physics.js';
export const EPS=1e-10;
export const SPECIES=['NaCl','sucrose','hcl','ethanoic','Cu','Zn','sulfate','K','nitrate'];
export const active=o=>Boolean(o&&!o.stored);
export const point=(o,x=0,y=0)=>{const a=(o.angle||0)*Math.PI/180;return{x:o.x+x*Math.cos(a)-y*Math.sin(a),y:o.y+x*Math.sin(a)+y*Math.cos(a)};};
export const box=(x,y,w,h)=>({x,y,w,h});
export function pool(id,name,x,y,water=0,composition={},capacity=150){return{id,name,kind:'beaker',x,y,angle:0,water,capacity,solidNaCl:0,solutes:Object.fromEntries(SPECIES.map(k=>[k,composition[k]||0]))};}
export function makeState(mode,items){return{mode,width:1000,phase:'working',items,held:null,links:[],flow:[],passiveFlow:[],spills:[],time:0,records:[],leads:{red:null,black:null},looseEnds:{red:{x:695,y:375},black:{x:805,y:375}}};}
export function concentration(o,k){return o.water>EPS?(o.solutes[k]||0)/(o.water/1000):0;}
export function receiver(s,p,exclude,inside=false){return Object.values(s.items).filter(o=>active(o)&&o.id!==exclude&&['beaker','cuvette'].includes(o.kind)&&!o.parent&&Math.abs(o.angle||0)<20&&Math.abs(p.x-o.x)<(o.kind==='cuvette'?20:43)&&(inside?p.y>=o.y-25&&p.y<=o.y+(o.kind==='cuvette'?60:96):p.y<=o.y+18)).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]||null;}
export function take(o,ml){const water=Math.min(Math.max(0,ml),o.water),f=o.water>EPS?water/o.water:0,m={water,solidNaCl:0,solutes:{}};for(const k of SPECIES){m.solutes[k]=(o.solutes[k]||0)*f;o.solutes[k]-=m.solutes[k];}o.water-=water;return m;}
export function add(o,m,f=1){o.water+=m.water*f;o.solidNaCl=(o.solidNaCl||0)+(m.solidNaCl||0)*f;for(const k of SPECIES)o.solutes[k]=(o.solutes[k]||0)+(m.solutes[k]||0)*f;}
export function receive(s,to,m,p){const f=to?m.water>EPS?Math.min(1,Math.max(0,to.capacity-to.water)/m.water):1:0;if(to)add(to,m,f);if(f<1&&(m.water>EPS||m.solidNaCl>EPS)){const spill={...pool('spill','Bench spill',p.x,525),x:p.x};add(spill,m,1-f);s.spills.push(spill);}}
export function transfer(s,from,to,ml,{film=0}={}){const a=s.items[from],b=s.items[to];if(s.phase!=='working'||!active(a)||!active(b)||a===b||!a.solutes||!b.solutes||!Number.isFinite(ml)||ml<=0||b.parent)return 0;const m=take(a,Math.min(ml,Math.max(0,a.water-film)));receive(s,b,m,point(b));s.flow=[{from:point(a,a.kind==='beaker'?51:0),to:point(b)}];return m.water;}
export function pour(s,id,ml=10){const a=s.items[id];if(s.phase!=='working'||!active(a)||!a.solutes||a.parent)return 0;const b=receiver(s,point(a),id)||receiver(s,point(a,a.kind==='beaker'?51:0),id);if(!b)return 0;
 if(a.water>EPS)return transfer(s,id,b.id,ml,{film:a.kind==='cuvette'?.05:.2});
 const n=Math.min(a.solidNaCl||0,.001);if(n<=EPS)return 0;a.solidNaCl-=n;b.solidNaCl+=n;s.flow=[{from:point(a),to:point(b),solid:true}];return n;
}
export function dissolve(s){for(const o of Object.values(s.items).filter(active)){if(!o.solutes||!o.solidNaCl||o.water<=EPS)continue;const n=Math.min(o.solidNaCl,Math.max(0,o.water*.006-o.solutes.NaCl));o.solidNaCl-=n;o.solutes.NaCl+=n;}}
export function totals(s){const t={water:0,solidNaCl:0,...Object.fromEntries(SPECIES.map(k=>[k,0]))};for(const o of [...Object.values(s.items),...s.spills]){if(!o.solutes)continue;t.water+=o.water;t.solidNaCl+=o.solidNaCl||0;for(const k of SPECIES)t[k]+=o.solutes[k]||0;}return t;}
const worlds=new WeakMap();
export function physicsFor(s){let w=worlds.get(s);if(!w){w=new PhysicsWorld(s,(o,f)=>{if(!o.solutes||o.parent)return;const m=take(o,o.water*f);m.solidNaCl=(o.solidNaCl||0)*f;o.solidNaCl-=m.solidNaCl;receive(s,receiver(s,point(o),o.id),m,point(o));});worlds.set(s,w);}return w;}
export function updateParents(s){for(const o of Object.values(s.items)){if(!o.parent)continue;const p=s.items[o.parent];if(!active(p))continue;Object.assign(o,point(p,o.offset?.x||0,o.offset?.y||0));o.angle=p.angle||0;}}
export function detach(s,id){const o=s.items[id];if(!active(o)||s.phase!=='working')return;o.parent=null;o.angle=0;s.held=id;physicsFor(s).hold(id);}
export function placeItem(s){s.held=null;physicsFor(s).release();}
export function stepPhysics(s,dt,id){if(s.phase!=='working')return;physicsFor(s).step(dt,id);updateParents(s);if(s.items.meter&&!active(s.items.meter)){s.leads={red:null,black:null};if('loaded'in s.items.meter)s.items.meter.loaded=false;}for(const colour of ['red','black'])if(s.leads[colour]&&!active(s.items[s.leads[colour]]))s.leads[colour]=null;dissolve(s);}
export function clipToVessel(s,id,offsetX=0){const o=s.items[id];if(s.phase!=='working'||!active(o))return null;const p=point(o,0,85),b=receiver(s,p,id,true)||receiver(s,p,id);if(!b||b.kind!=='beaker'||Math.abs(o.x-b.x)>65||Math.abs(o.y-b.y)>135)return null;o.parent=b.id;o.offset={x:offsetX,y:-12};updateParents(s);physicsFor(s).sync();return b;}
export function immersed(s,id){const o=s.items[id];if(!active(o))return null;const tip=point(o,0,85),b=Object.values(s.items).filter(b=>active(b)&&b.kind==='beaker'&&b.water>EPS&&Math.abs(b.angle||0)<20&&Math.abs(tip.x-b.x)<32&&tip.y>=b.y+86-72*Math.min(1,b.water/b.capacity)&&tip.y<=b.y+94).sort((a,b)=>Math.abs(a.x-tip.x)-Math.abs(b.x-tip.x))[0];return b||null;}
export function connectLead(s,colour,id){if(s.phase!=='working'||!['red','black'].includes(colour))return false;if(id!==null&&(!active(s.items[id])||!['electrode','metalStrip'].includes(s.items[id].kind)))return false;s.leads[colour]=id;return true;}
export function leadPoint(s,colour){const o=s.items[s.leads[colour]];return active(o)?point(o,0,0):s.looseEnds[colour];}

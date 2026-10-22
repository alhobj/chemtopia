// Matter.js runs locally. Shapes describe solid glass/metal, leaving vessel/ring openings free.
import Matter from './vendor/matter.js';
const {Engine, Bodies, Body, Composite, Query, Events, Sleeping, Constraint}=Matter;
const RAD=Math.PI/180;
export const BENCH_Y=525;
export const RING={x:90,y:-172,seat:32.5};
const rotate=(p,a)=>({x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)});
const rect=(x,y,w,h)=>Bodies.rectangle(x,y,w,h);
const contacts=(body,others)=>(body.parts.length>1?body.parts.slice(1):[body]).flatMap(part=>Query.collides(part,others));
function polygon(vertices){
 const centre=Matter.Vertices.centre(vertices);
 return Bodies.fromVertices(centre.x,centre.y,[vertices],{},true);
}
function shape(item){
 let parts;
 if(item.collision){parts=item.collision.map(p=>p.vertices?polygon(p.vertices):p.radius?Bodies.circle(p.x,p.y,p.radius):rect(p.x,p.y,p.w,p.h));}
 else if(item.kind==='beaker'){
  const w=item.id==='source'?92:78,h=item.id==='source'?112:96;
  parts=[rect(-w/2+2.5,h/2,5,h),rect(w/2-2.5,h/2,5,h),rect(0,h-2.5,w,5)];
 }else if(item.kind==='stand'){
  parts=[rect(0,-116,10,230),polygon([{x:-57,y:6},{x:-43,y:-7},{x:16,y:-7},{x:35,y:4},{x:27,y:16},{x:-48,y:16}]),rect(28,-172,56,8),rect(60,-172,5,6),rect(120,-172,5,6)];
 }else if(item.kind==='funnel'){
  parts=[polygon([{x:-57,y:0},{x:57,y:0},{x:9,y:48},{x:-9,y:48}]),rect(0,63,18,30)];
 }else{
  parts=[polygon([{x:-44,y:0},{x:44,y:0},{x:0,y:38}])];
 }
 const body=Body.create({parts,label:item.id,friction:.55,frictionStatic:1,restitution:.05,frictionAir:.012,slop:.05});
 body.collisionFilter.category=item.kind==='funnel'?2:item.kind==='paper'?4:1;
 body.collisionFilter.mask=~0;
 Body.setMass(body,item.mass??(item.kind==='stand'?8:item.kind==='beaker'?1:item.kind==='funnel'?.35:.04));
 return {body,offset:{...body.position},last:null};
}
export class PhysicsWorld {
 constructor(state,onSpill){
  this.state=state;this.onSpill=onSpill;this.links=new Map();this.entries=new Map();this.heldId=null;this.accumulator=0;this.seat=null;
  this.engine=Engine.create({enableSleeping:true,positionIterations:12,velocityIterations:10,constraintIterations:6});
  this.engine.gravity.y=1.5;
  const width=state.width||1000;
  this.bench=Bodies.rectangle(width/2,BENCH_Y+50,width+1200,100,{isStatic:true,label:'bench',friction:.8});
  Composite.add(this.engine.world,[this.bench,Bodies.rectangle(-30,200,60,1500,{isStatic:true,label:'edge'}),Bodies.rectangle(width+30,200,60,1500,{isStatic:true,label:'edge'})]);
  Events.on(this.engine,'collisionStart',event=>{
   // A tiny impact asymmetry breaks the exact mathematical balance of the thin stem.
   // This impulse only occurs on contact; there is no in-air tipping animation.
   for(const pair of event.pairs){
    const a=pair.bodyA.parent,b=pair.bodyB.parent;
    const funnel=a.label==='funnel'?a:b.label==='funnel'?b:null;
    const other=funnel===a?b:a;
    if(funnel&&other.label==='bench'&&!funnel.isStatic&&Math.abs(funnel.angle)<5*RAD)Body.setAngularVelocity(funnel,.035);
   }
  });
  for(const shelf of state.shelves||[])Composite.add(this.engine.world,rect(shelf.x,shelf.y,shelf.w,shelf.h));
  for(const body of Composite.allBodies(this.engine.world))if(!body.label||body.label==='Rectangle Body')Body.setStatic(body,true);
  this.sync();
 }
 writePose(item,entry){
  const offset=rotate(entry.offset,(item.angle||0)*RAD);
  Body.setAngle(entry.body,(item.angle||0)*RAD);
  Body.setPosition(entry.body,{x:item.x+offset.x,y:item.y+offset.y});
  Sleeping.set(entry.body,false);
 }
 sync(){
  for(const item of Object.values(this.state.items)){
   let entry=this.entries.get(item.id);
   if(item.parent){if(entry){Composite.remove(this.engine.world,entry.body);this.entries.delete(item.id);}continue;}
   if(!entry){entry=shape(item);this.entries.set(item.id,entry);this.writePose(item,entry);Composite.add(this.engine.world,entry.body);}
   entry.body.collisionFilter.mask=this.heldId==='paper'?(item.kind==='funnel'?~4:item.kind==='paper'?~2:~0):~0;
   const pose=[item.x,item.y,item.angle||0];
   if(!entry.last||pose.some((v,i)=>Math.abs(v-entry.last[i])>1e-8))this.writePose(item,entry);
   if(entry.body.isStatic!==((item.fixed||item.id===this.heldId))){Body.setStatic(entry.body,Boolean(item.fixed||item.id===this.heldId));Sleeping.set(entry.body,false);}
   entry.last=pose;
  }
 }
 obstacles(id,excluded=[]){return Composite.allBodies(this.engine.world).filter(b=>b.label!==id&&!excluded.includes(b.label)&&!(id==='paper'&&b.label==='funnel'));}
 blocked(body,excluded=[]){return contacts(body,this.obstacles(body.label,excluded)).some(c=>Matter.Detector.canCollide(c.bodyA.parent.collisionFilter,c.bodyB.parent.collisionFilter)&&c.depth>.4);}
 read(){
  for(const [id,entry] of this.entries){
   const item=this.state.items[id],offset=rotate(entry.offset,entry.body.angle);
   const x=entry.body.position.x-offset.x,y=entry.body.position.y-offset.y;
   const dx=x-item.x,dy=y-item.y;
   item.x=x;item.y=y;item.angle=entry.body.angle/RAD;
   // Attached filter paper is contained inside its funnel, not a second solid body.
   for(const child of Object.values(this.state.items).filter(o=>o.parent===id)){child.x+=dx;child.y+=dy;}
   entry.last=[item.x,item.y,item.angle];
  }
 }
 hold(id){
  if(id==='funnel'&&this.seat){for(const c of this.seat)Composite.remove(this.engine.world,c);this.seat=null;}
  this.heldId=id;this.sync();this.syncLinks();const entry=this.entries.get(id);if(!entry)return;
  Body.setVelocity(entry.body,{x:0,y:0});Body.setAngularVelocity(entry.body,0);
 }
 release(){this.heldId=null;this.sync();this.syncLinks();}
 moveHeld(id,x,y){
  this.hold(id);const entry=this.entries.get(id);if(!entry)return;
  const item=this.state.items[id],dx=x-item.x,dy=y-item.y,steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/2));
  const assembly=[entry.body];
  if(this.state.links){const ids=new Set([id]);let added=true;while(added){added=false;for(const link of this.state.links)if(ids.has(link.a)||ids.has(link.b)){for(const next of [link.a,link.b])if(!ids.has(next)){ids.add(next);added=true;}}}for(const next of ids)if(next!==id&&this.entries.has(next))assembly.push(this.entries.get(next).body);}
  if(id==='stand'&&this.seat)assembly.push(this.entries.get('funnel').body);
  const ids=assembly.map(b=>b.label);
  const tryStep=delta=>{
   const old=assembly.map(body=>({...body.position}));
   assembly.forEach(body=>Body.setPosition(body,{x:body.position.x+delta.x,y:body.position.y+delta.y}));
   if(assembly.some(body=>this.blocked(body,ids))){assembly.forEach((body,i)=>Body.setPosition(body,old[i]));return false;}
   return true;
  };
  // Sweep rather than teleport: fast mouse movements cannot jump through glass or metal.
  for(let i=0;i<steps;i++)if(!tryStep({x:dx/steps,y:dy/steps})){
   tryStep({x:dx/steps,y:0});tryStep({x:0,y:dy/steps});
  }
  this.read();
 }
 tilt(id,degrees){
  this.sync();const entry=this.entries.get(id);if(!entry)return false;
  const item=this.state.items[id],start={x:item.x,y:item.y,angle:item.angle||0};
  const steps=Math.max(1,Math.ceil(Math.abs(degrees-start.angle)/2));
  for(let i=1;i<=steps;i++){
   const previous={angle:entry.body.angle,position:{...entry.body.position}};
   const angle=(start.angle+(degrees-start.angle)*i/steps)*RAD,offset=rotate(entry.offset,angle);
   Body.setAngle(entry.body,angle);Body.setPosition(entry.body,{x:start.x+offset.x,y:start.y+offset.y});
   if(this.blocked(entry.body)){Body.setAngle(entry.body,previous.angle);Body.setPosition(entry.body,previous.position);break;}
  }
  this.read();return Math.abs(item.angle-degrees)<3;
 }
 step(seconds,heldId){
  this.heldId=heldId;this.sync();this.syncLinks();this.accumulator+=Math.min(seconds,.05);
  while(this.accumulator>=1/120){Engine.update(this.engine,1000/120);this.seatOnContact();this.accumulator-=1/120;}
  this.read();
  const hadSpill=this.state.passiveFlow.length>0;this.state.passiveFlow=[];
  for(const item of Object.values(this.state.items)){
   const root=item.parent?this.state.items[item.parent]:item;
   const radians=(root.angle||0)*RAD,angle=Math.atan2(Math.sin(radians),Math.cos(radians))/RAD;
   if(Math.abs(angle)>(root.kind==='funnel'?36:65)&&(item.water||item.sand||item.acetone))this.onSpill(item,Math.min(1,seconds*4));
  }
  return hadSpill||this.state.passiveFlow.length>0||[...this.entries.values()].some(e=>!e.body.isSleeping&&!e.body.isStatic);
 }
 syncLinks(){
  for(const {body} of this.entries.values())body.collisionFilter.group=0;
  const components=[];for(const link of [...(this.state.links||[]),...(this.state.contactPairs?.()||[]).map(([a,b])=>({a,b}))]){const matches=components.filter(c=>c.has(link.a)||c.has(link.b));const set=new Set([link.a,link.b,...matches.flatMap(c=>[...c])]);for(const match of matches)components.splice(components.indexOf(match),1);components.push(set);}
  components.forEach((set,i)=>{for(const id of set){const entry=this.entries.get(id);if(entry)entry.body.collisionFilter.group=-100-i;}});
  const wanted=new Set((this.state.links||[]).map(l=>l.id));
  for(const [id,constraints] of this.links)if(!wanted.has(id)){for(const c of constraints)Composite.remove(this.engine.world,c);this.links.delete(id);}
  for(const link of this.state.links||[]){
   if(this.links.has(link.id))continue;
   const a=this.entries.get(link.a),b=this.entries.get(link.b);if(!a||!b)continue;
   const constraints=[-28,28].map(dx=>Constraint.create({bodyA:a.body,pointA:rotate({x:link.pa.x+dx-a.offset.x,y:link.pa.y-a.offset.y},a.body.angle),bodyB:b.body,pointB:rotate({x:link.pb.x+dx-b.offset.x,y:link.pb.y-b.offset.y},b.body.angle),length:0,stiffness:.99,damping:.25}));
   Composite.add(this.engine.world,constraints);this.links.set(link.id,constraints);
  }
 }
 seatOnContact(){
  if(this.seat||this.heldId==='funnel')return;
  const f=this.entries.get('funnel'),s=this.entries.get('stand');if(!f||!s)return;
  const offset=rotate(f.offset,f.body.angle),origin={x:f.body.position.x-offset.x,y:f.body.position.y-offset.y};
  const so=rotate(s.offset,s.body.angle),stand={x:s.body.position.x-so.x,y:s.body.position.y-so.y};
  const target={x:stand.x+RING.x,y:stand.y+RING.y-RING.seat};
  if(Math.abs(s.body.angle)>5*RAD||Math.abs(origin.x-target.x)>7||Math.abs(origin.y-target.y)>9||Math.abs(f.body.angle)>10*RAD||!contacts(f.body,[s.body]).length)return;
  Body.setAngle(f.body,0);Body.setPosition(f.body,{x:target.x+f.offset.x,y:target.y+f.offset.y});Body.setVelocity(f.body,{x:0,y:0});Body.setAngularVelocity(f.body,0);
  this.seat=[-22,22].map(x=>Constraint.create({bodyA:s.body,pointA:{x:RING.x+x-s.offset.x,y:RING.y-RING.seat+20-s.offset.y},bodyB:f.body,pointB:{x:x-f.offset.x,y:20-f.offset.y},length:0,stiffness:.98,damping:.2}));
  Composite.add(this.engine.world,this.seat);
 }
 // Useful for regression checks; attached paper/funnel containment is intentional.
 overlaps(){
  const all=Composite.allBodies(this.engine.world),hits=[];
  for(let i=0;i<all.length;i++)for(const hit of contacts(all[i],all.slice(i+1)))if(Matter.Detector.canCollide(hit.bodyA.parent.collisionFilter,hit.bodyB.parent.collisionFilter)&&!(all[i].isStatic&&hit.bodyA.parent.isStatic&&hit.bodyB.parent.isStatic)&&hit.depth>1)hits.push([all[i].label,hit.bodyA.parent===all[i]?hit.bodyB.parent.label:hit.bodyA.parent.label,hit.depth]);
  return hits;
 }
}

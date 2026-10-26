import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeStorage,storeItem,takeItem} from '../prototype/equipment-storage.js';
import * as filtration from '../prototype/model.js';
import * as distillation from '../prototype/distillation-model.js';
import * as chromatography from '../prototype/chromatography-model.js';
for(const [name,m]of Object.entries({filtration,distillation,chromatography})){
 test(name+': storing loaded equipment removes collisions and conserves its contents',()=>{
  const s=initializeStorage(m.createState()),w=m.physicsFor(s),before=m.totals(s);
  assert.ok(storeItem(s,'source',w));assert.ok(!w.entries.has('source'));
  m.pour(s,'source',.1);for(let i=0;i<60;i++)m.stepPhysics(s,1/120);
  assert.deepEqual(m.totals(s),before);assert.ok(takeItem(s,'source',100,100,w));w.release();assert.ok(w.entries.has('source'));assert.deepEqual(m.totals(s),before);
 });
}
test('shelf equipment starts stored and no shelf bodies are created',()=>{
 for(const m of [distillation,chromatography]){
  const s=initializeStorage(m.createState()),w=m.physicsFor(s);assert.deepEqual(s.shelves,[]);
  for(const item of Object.values(s.items).filter(o=>o.stored))assert.ok(!w.entries.has(item.id));
 }
});
test('returning a heater switches it off and returning glass disconnects joints and hoses',()=>{
 const s=initializeStorage(distillation.createState()),w=distillation.physicsFor(s);
 s.items.heater.on=true;storeItem(s,'heater',w);assert.equal(s.items.heater.on,false);
 s.links=[{id:'head-condenser',a:'head',b:'condenser',pa:{x:70,y:50},pb:{x:0,y:0}}];
 s.hoses[0].ends[0]={port:'condenser:low'};storeItem(s,'condenser',w);
 assert.deepEqual(s.links,[]);assert.equal(s.hoses[0].ends[0].port,undefined);
});
test('storing a funnel preserves its contained filter paper and sand',()=>{
 const s=filtration.createState(),w=filtration.physicsFor(s);s.items.paper.parent='funnel';s.items.paper.sand=.12;s.items.source.sand=0;
 storeItem(s,'funnel',w);assert.ok(s.items.paper.stored);assert.equal(s.items.paper.sand,.12);
 assert.ok(takeItem(s,'funnel',300,100,w));assert.ok(!s.items.paper.stored);assert.equal(s.items.paper.parent,'funnel');
});
test('blocked retrieval stays stored without losing contents or duplicating objects',()=>{
 const s=filtration.createState(),w=filtration.physicsFor(s);storeItem(s,'source',w);
 const count=Object.keys(s.items).length;assert.equal(takeItem(s,'source',s.items.stand.x,s.items.stand.y-80,w),false);
 assert.ok(s.items.source.stored);assert.equal(Object.keys(s.items).length,count);assert.equal(s.items.source.water,1);
});

test('a support can be lifted with a movable object resting on it, while new obstacles still block it',async()=>{
 const {PhysicsWorld}=await import('../prototype/physics.js');
 const s={phase:'working',links:[],passiveFlow:[],items:{
  base:{id:'base',kind:'box',x:400,y:495,collision:[{x:0,y:15,w:120,h:30}]},
  top:{id:'top',kind:'box',x:400,y:455,water:.5,collision:[{x:0,y:20,w:60,h:40}]},
  wall:{id:'wall',kind:'box',fixed:true,x:600,y:300,collision:[{x:0,y:100,w:20,h:200}]}
 }};
 const w=new PhysicsWorld(s,()=>{});for(let i=0;i<240;i++)w.step(1/120,null);
 const before=s.items.base.y;w.hold('base');assert.ok(w.pickupClearance.has('top'));w.moveHeld('base',400,before-100);
 assert.ok(s.items.base.y<before-95);assert.equal(s.items.top.water,.5);assert.equal(w.pickupClearance.size,0,'clearance expires after moving away');
 w.moveHeld('base',700,s.items.base.y);assert.ok(s.items.base.x<550,'new fixed wall cannot be crossed');w.release();assert.equal(w.pickupClearance.size,0);
});
test('a container can be lifted around a loose tool inside its cavity',async()=>{
 const {PhysicsWorld}=await import('../prototype/physics.js');
 const s={phase:'working',links:[],passiveFlow:[],items:{
  vessel:{id:'vessel',kind:'box',x:400,y:425,water:.6,collision:[{x:-45,y:50,w:6,h:100},{x:45,y:50,w:6,h:100},{x:0,y:97,w:96,h:6}]},
  rod:{id:'rod',kind:'box',x:400,y:440,collision:[{x:0,y:40,w:6,h:80}]}
 }};
 const w=new PhysicsWorld(s,()=>{});for(let i=0;i<120;i++)w.step(1/120,null);const y=s.items.vessel.y;
 w.hold('vessel');assert.ok(w.pickupClearance.has('rod'));w.moveHeld('vessel',400,y-80);assert.ok(s.items.vessel.y<y-75);assert.equal(s.items.vessel.water,.6);
});
test('storing a support leaves a loose item free to fall rather than storing or duplicating it',async()=>{
 const {PhysicsWorld}=await import('../prototype/physics.js');
 const s={phase:'working',links:[],passiveFlow:[],flow:[],items:{
  base:{id:'base',kind:'box',x:400,y:495,collision:[{x:0,y:15,w:120,h:30}]},
  top:{id:'top',kind:'box',x:400,y:455,water:.5,collision:[{x:0,y:20,w:60,h:40}]}
 }};
 const w=new PhysicsWorld(s,()=>{});for(let i=0;i<120;i++)w.step(1/120,null);const y=s.items.top.y;
 assert.ok(storeItem(s,'base',w));assert.ok(!s.items.top.stored);for(let i=0;i<120;i++)w.step(1/120,null);
 assert.ok(s.items.top.y>y+20);assert.equal(s.items.top.water,.5);assert.equal(Object.keys(s.items).length,2);
});

test('pickup clearance does not allow stored equipment to spawn overlapping another vessel',()=>{
 const s=filtration.createState(),w=filtration.physicsFor(s);storeItem(s,'source',w);
 Object.assign(s.items.receiverA,{x:400,y:429,angle:0});w.sync();
 assert.equal(takeItem(s,'source',400,413,w),false);assert.ok(s.items.source.stored);assert.equal(s.items.source.water,1);
});

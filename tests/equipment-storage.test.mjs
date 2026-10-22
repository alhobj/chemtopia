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

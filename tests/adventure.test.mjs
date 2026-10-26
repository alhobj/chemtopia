import test from 'node:test';
import assert from 'node:assert/strict';
import {CHARACTERS} from '../prototype/characters.js';
import {newPlayer,createPlayerStore,validateName,migrateSave,SAVE_KEY,RECOVERY_KEY} from '../prototype/player-store.js';
import {tutorialEvent,replayTutorial,TUTORIAL_STAGES} from '../prototype/tutorial.js';
import {routeTo,walkable,movePlayer,PLACES,placePoint} from '../prototype/town-model.js';
import {experiments,eligibility,assertAcyclic,graphLayout,graphEdgePath,experimentGraph,validateDefinitions} from '../prototype/experiment-definitions.js';
import {purchase,stockAllLabsForTesting,TESTING_STOCK,applyReward,claimTrialGrant,reserveAttempt,completeAttempt,apparatusAccess} from '../prototype/progression.js';
import {EQUIPMENT,STARTER_EQUIPMENT} from '../prototype/equipment-catalog.js';
const memory=()=>{const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const player=()=>newPlayer('Ada','c01-3');
test('all six existing identities can start and persist a local adventure',()=>{assert.equal(CHARACTERS.length,6);for(const c of CHARACTERS){const storage=memory(),store=createPlayerStore(storage);store.start('Åse',c.id);assert.equal(createPlayerStore(storage).load().player.characterId,c.id);}});
test('nickname validation supports Unicode and rejects empty, markup, controls and oversized input',()=>{for(const n of ['Ada','Åse','李明','O’Neil','A'])assert.ok(validateName(n).ok);for(const n of ['', '   ','<script>','A\u0000B','2Player','A'.repeat(25)])assert.equal(validateName(n).ok,false);assert.equal(validateName('  Ada   Lovelace ').name,'Ada Lovelace');});
test('returning player preserves balance, nickname, tutorial, inventory and position',()=>{const s=memory(),store=createPlayerStore(s);store.start('Ada','c01-5');store.update(p=>{p.position={x:450,y:500,facing:'back'};p.tutorial.flags=['move'];p.currency=42;});const p=createPlayerStore(s).load().player;assert.equal(p.name,'Ada');assert.equal(p.currency,42);assert.equal(p.position.x,450);assert.deepEqual(p.tutorial.flags,['move']);});
test('New Game requires confirmation and archives the prior profile',()=>{const s=memory(),store=createPlayerStore(s);store.start('Ada','c01-1');assert.throws(()=>store.start('Bo','c01-2'),/Confirm/);store.start('Bo','c01-2',{confirmed:true});assert.equal(JSON.parse(s.getItem(RECOVERY_KEY)).name,'Ada');assert.equal(store.load().player.name,'Bo');});
test('corrupt and newer-version saves are protected and not silently replaced',()=>{for(const raw of ['{broken',JSON.stringify({schemaVersion:999})]){const s=memory();s.setItem(SAVE_KEY,raw);const store=createPlayerStore(s);assert.equal(store.load().status,'protected');assert.equal(s.getItem(SAVE_KEY),raw);assert.throws(()=>store.start('Ada','c01-1'),/Confirm/);}});
test('v1-shaped save migration preserves identity, equipment and credits',()=>{const p=migrateSave({version:1,playerName:'Ada',characterId:'c01-4',credits:55,equipment:['beaker','balance'],consumables:{'filter-paper':2},completedExperiments:['filtration'],tutorialStep:2,position:{x:400,y:500}});assert.equal(p.schemaVersion,2);assert.equal(p.currency,55);assert.equal(p.equipment.balance,1);assert.equal(p.materials['filter-paper'],2);});
test('storage write failure keeps the original save and reports failure',()=>{const s=memory(),store=createPlayerStore(s);store.start('Ada','c01-1');const raw=s.getItem(SAVE_KEY);s.setItem=()=>{throw Error('quota')};assert.throws(()=>store.update(p=>p.currency=0),/Could not save/);assert.equal(s.getItem(SAVE_KEY),raw);});
test('blocked storage has an explicit temporary-session fallback',()=>{const store=createPlayerStore(null);store.start('Ada','c01-6');assert.equal(store.load().persistent,false);assert.match(store.warning,/temporary/);assert.equal(store.load().player.name,'Ada');});
test('tutorial events resume between stages, accept earlier actions and replay without deleting progress',()=>{const p=player();for(const e of ['inventory-open','inspect-material','inspect-equipment','move','welcome-sign','guide'])tutorialEvent(p,e);assert.equal(p.tutorial.stage,2);tutorialEvent(p,'currency-read');assert.equal(p.tutorial.stage,3);for(const e of ['enter-lab','view-requirements','start-experiment','open-map','inspect-locked'])tutorialEvent(p,e);assert.equal(p.tutorial.stage,TUTORIAL_STAGES.length);const equipment={...p.equipment};replayTutorial(p);assert.equal(p.tutorial.stage,0);assert.deepEqual(p.equipment,equipment);});
test('town destinations are reachable and obstacles block walking',()=>{for(const place of PLACES){const route=routeTo({x:600,y:570},placePoint(place));assert.ok(route.length,place.id);assert.ok(route.every(p=>walkable(p.x,p.y)));}assert.equal(walkable(610,385),false);assert.equal(walkable(250,600),false);assert.deepEqual(movePlayer({x:25,y:500,facing:'front'},-1,0,.05),{x:25,y:500,facing:'front'});});
test('starter kit enables evaporation only and supplies no advanced equipment',()=>{const p=player();assert.deepEqual(experiments.filter(e=>eligibility(p,e.id).available).map(e=>e.id),['evaporation']);assert.deepEqual(p.equipment,{beaker:1,basin:1,heater:1});assert.equal(p.equipment.balance,undefined);});
test('all thirteen definitions have valid requirements and the equipment graph is acyclic',()=>{assert.equal(experiments.length,13);assert.ok(validateDefinitions());assert.ok(assertAcyclic(experimentGraph()));assert.throws(()=>assertAcyclic({nodes:[{id:'a'},{id:'b'}],edges:[{from:'a',to:'b'},{from:'b',to:'a'}]}),/Cyclic/);});
test('purchases cannot create negative balances, reward IDs cannot be replayed',()=>{const p=player();p.currency=0;assert.equal(purchase(p,'balance').ok,false);assert.equal(p.currency,0);assert.equal(purchase(p,'beaker',-1).ok,false);assert.equal(purchase(p,'nope').ok,false);assert.ok(claimTrialGrant(p).ok);assert.equal(claimTrialGrant(p).ok,false);assert.ok(purchase(p,'balance').ok);assert.equal(p.equipment.balance,1);assert.equal(applyReward(p,{id:'mission-test',equipment:{balance:1},credits:10}).ok,true);assert.equal(applyReward(p,{id:'mission-test',credits:10}).ok,false);assert.equal(p.equipment.balance,2);});
test('missing materials remain a gate even after all equipment is owned',()=>{const p=player();p.equipment=Object.fromEntries(Object.keys(EQUIPMENT).map(id=>[id,10]));const e=eligibility(p,'distillation');assert.equal(e.available,false);assert.equal(e.state,'missing-materials');p.completed.push('distillation');assert.equal(eligibility(p,'distillation').state,'completed');assert.equal(eligibility(p,'distillation').available,false);});
test('reservations consume supplies once, keep equipment and record completion idempotently',()=>{const p=player(),before={...p.equipment},a=reserveAttempt(p,'evaporation');assert.equal(p.materials['salt-solution'],1);assert.deepEqual(p.equipment,before);assert.ok(completeAttempt(p,'evaporation',a.id));assert.equal(completeAttempt(p,'evaporation',a.id),false);assert.deepEqual(p.completed,['evaporation']);const e=experiments.find(e=>e.id==='evaporation'),access=apparatusAccess(p,e,a);assert.equal(access.source,true);assert.equal(access.receiver,false);});
test('queued transactions preserve combined currency and ownership changes',async()=>{const store=createPlayerStore(memory());store.start('Ada','c01-1');await store.transact(claimTrialGrant);await Promise.all([store.transact(p=>purchase(p,'beaker')),store.transact(p=>purchase(p,'beaker'))]);assert.equal(store.load().player.equipment.beaker,3);assert.equal(store.load().player.currency,1004);});

test('every runtime apparatus instance is covered by the inspected adventure mapping',async()=>{const {LAB_FACTORIES}=await import('../scripts/lab-fixtures.mjs');for(const e of experiments){const state=LAB_FACTORIES[e.id]();assert.deepEqual(Object.keys(e.apparatus).sort(),Object.keys(state.items).sort(),e.id);const p=player();p.equipment={...e.equipment};const access=apparatusAccess(p,e,{supplies:{...e.materials}});for(const [id,part]of Object.entries(e.apparatus))if(part.required)assert.equal(access[id],true,e.id+'/'+id);}});
test('only genuine explicit prerequisites can gate experiments',()=>{assert.ok(experiments.every(e=>e.prerequisites.length===0));const graph=experimentGraph();assert.equal(graph.nodes.filter(n=>n.type==='experiment').length,13);assert.ok(graph.edges.some(e=>e.from==='evaporation'&&e.to==='distillation'));assert.ok(!graph.edges.some(e=>e.from==='starter'&&e.to==='distillation'));assert.ok(graph.edges.some(e=>e.from==='filtration'&&e.to==='recrystallisation'));const cycle=experiments.slice(0,2).map(e=>({...e,prerequisites:[experiments[e.id===experiments[0].id?1:0].id]}));assert.throws(()=>experimentGraph(cycle),/Cyclic/);});
test('acquiring equipment updates eligibility without requiring another topic completion',()=>{const p=player();for(const id of ['beaker','filter-funnel','stand'])applyReward(p,{id:'gear-'+id,equipment:{[id]:1}});applyReward(p,{id:'filter-supplies',materials:{'sand-water':1,'filter-paper':1}});assert.equal(p.completed.length,0);assert.equal(eligibility(p,'filtration').available,true);});
test('one paper sheet enables first filtration while fresh paper stays optional and unavailable',()=>{const e=experiments.find(e=>e.id==='recrystallisation'),p=player();p.equipment={...e.equipment};p.materials={...e.materials};const a=reserveAttempt(p,e.id),access=apparatusAccess(p,e,a);assert.equal(p.materials['filter-paper'],0);assert.equal(access.paper,true);assert.equal(access.freshPaper,false);assert.equal(access.receiverB,false);});
test('invalid saved attempt reservations protect the save instead of crashing the lab',()=>{const s=memory(),p=player();p.attempts.evaporation={id:'bad',experiment:'evaporation',status:'active'};s.setItem(SAVE_KEY,JSON.stringify(p));assert.equal(createPlayerStore(s).load().status,'protected');});
test('invalid multi-item reward does not partially grant credits or equipment',()=>{const p=player(),before=JSON.stringify(p);assert.equal(applyReward(p,{id:'bad',credits:100,equipment:{balance:1,unknown:2}}).ok,false);assert.equal(JSON.stringify(p),before);});
test('game re-creation has a different profile identity and old v2 data gets a stable compatibility identity',()=>{const a=player(),b=player();assert.notEqual(a.profileId,b.profileId);delete a.profileId;assert.equal(migrateSave(a).profileId,migrateSave(a).profileId);});

test('equipment map edges represent strict reusable kit containment with exact additions, not completion gates',()=>{
 const graph=experimentGraph(),kit=id=>id==='starter'?STARTER_EQUIPMENT:{...STARTER_EQUIPMENT,...Object.fromEntries(Object.entries(experiments.find(e=>e.id===id).equipment).map(([key,n])=>[key,Math.max(n,STARTER_EQUIPMENT[key]||0)]))};
 for(const edge of graph.edges){
  const from=kit(edge.from),to=kit(edge.to);
  for(const [id,n]of Object.entries(from))assert.ok((to[id]||0)>=n,edge.from+' → '+edge.to+' retains '+id);
  const additions=Object.fromEntries(Object.entries(to).map(([id,n])=>[id,Math.max(0,n-(from[id]||0))]).filter(([,n])=>n));assert.deepEqual(edge.equipment,additions);
  const p=player();p.equipment={...to};p.materials={...experiments.find(e=>e.id===edge.to).materials};p.completed=[];assert.equal(eligibility(p,edge.to).available,true);
 }
 const distillation=graph.edges.find(e=>e.from==='evaporation'&&e.to==='distillation');assert.equal(distillation.equipment.heater,undefined);assert.equal(distillation.equipment.condenser,1);assert.equal(distillation.equipment.beaker,1);assert.equal(distillation.equipment.stand,2);
});

test('dependency map layout separates nodes and places every dependency before its target',()=>{
 const layout=graphLayout(experimentGraph());
 for(let i=0;i<layout.nodes.length;i++)for(let j=i+1;j<layout.nodes.length;j++){
  const a=layout.nodes[i],b=layout.nodes[j];assert.ok(Math.abs(a.x-b.x)>=165||Math.abs(a.y-b.y)>=66,'nodes do not overlap');
 }
 for(const edge of layout.edges)assert.ok(layout.nodes.find(n=>n.id===edge.from).x<layout.nodes.find(n=>n.id===edge.to).x);
 assert.ok(Math.max(...layout.nodes.map(n=>n.y+66))<=620,'branches fit the viewport height');
});

test('equipment arrows never pass through unrelated experiment boxes',()=>{
 const layout=graphLayout(experimentGraph());
 for(const edge of layout.edges){
  const points=[...graphEdgePath(layout.nodes,edge).matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m=>({x:Number(m[1]),y:Number(m[2])}));
  for(let i=1;i<points.length;i++)for(let step=0;step<=100;step++){
   const a=points[i-1],b=points[i],x=a.x+(b.x-a.x)*step/100,y=a.y+(b.y-a.y)*step/100;
   assert.ok(!layout.nodes.some(n=>n.id!==edge.from&&n.id!==edge.to&&x>n.x&&x<n.x+165&&y>n.y&&y<n.y+66),edge.from+' → '+edge.to+' stays clear');
  }
 }
});

test('testing stock unlocks every lab, persists and replenishes without erasing progress or larger inventories',async()=>{
 const store=createPlayerStore(memory());store.start('Ada','c01-1');
 await store.transact(p=>{p.equipment.beaker=200;p.completed=['evaporation'];stockAllLabsForTesting(p);});
 let p=store.load().player;assert.equal(p.equipment.beaker,200);assert.equal(p.currency,20);assert.deepEqual(p.completed,['evaporation']);
 for(const e of experiments)assert.equal(eligibility(p,e.id).available,true,e.id);
 const before=JSON.stringify(p);stockAllLabsForTesting(p);assert.equal(JSON.stringify(p),before);
 await store.transact(p=>{p.materials['salt-solution']=2;stockAllLabsForTesting(p);});assert.equal(store.load().player.materials['salt-solution'],TESTING_STOCK);
});

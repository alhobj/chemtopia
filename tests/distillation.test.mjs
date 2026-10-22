import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,placeItem,connectHose,cooling,stepChemistry,pour,outcome,totals,heaterContact,physicsFor,stepPhysics,worldPoint,EPS} from '../prototype/distillation-model.js';
function assembled(reversed=false){
 const s=createState();Object.assign(s.items.flask,{x:390,y:327,acetone:.5,water:.5});Object.assign(s.items.source,{acetone:0,water:0});
 Object.assign(s.items.heater,{x:390,y:467,on:true});Object.assign(s.items.head,{x:390,y:267});Object.assign(s.items.condenser,{x:460,y:317});Object.assign(s.items.thermometer,{x:390,y:252});Object.assign(s.items.receiverA,{x:690,y:429});Object.assign(s.items.support2,{x:800,y:509});
 for(const id of ['flask','head','condenser','thermometer'])placeItem(s,id);
 s.items.tap.on=true;s.hoses[0].ends=[{port:'tap:out'},{port:reversed?'condenser:high':'condenser:low'}];s.hoses[1].ends=[{port:reversed?'condenser:low':'condenser:high'},{port:'drain:in'}];return s;
}
function run(s,seconds){for(let i=0;i<seconds*60;i++)stepChemistry(s,1/60);}
function conserved(s){const t=totals(s);assert.ok(Math.abs(t.acetone-.5)<EPS);assert.ok(Math.abs(t.water-.5)<EPS);for(const o of [...Object.values(s.items),...s.spills,s.escaped])for(const k of ['acetone','water'])if(k in o)assert.ok(o[k]>=-EPS);}
test('50:50 feed is explicit and fresh attempts reset all process/coolant state',()=>{const s=createState();assert.deepEqual(s.initial,{acetone:.5,water:.5});assert.equal(cooling(s),'off');assert.deepEqual(s.links,[]);assert.equal(s.hoses[0].ends[0].port,undefined);assert.deepEqual(createState(),s);});
test('early condensate contains both components and is enriched in acetone',()=>{const s=assembled();run(s,11);const r=outcome(s);assert.ok(r.success);assert.ok(r.purity>.5&&r.purity<1);assert.ok(s.items.receiverA.water>0);assert.ok(s.items.flask.water/(s.items.flask.acetone+s.items.flask.water)>.5);conserved(s);});
test('upper-port supply remains operable and yields less acetone for identical runs',()=>{const proper=assembled(),reverse=assembled(true);run(proper,13);run(reverse,13);assert.equal(cooling(proper),'lower-fed');assert.equal(cooling(reverse),'upper-fed');assert.ok(outcome(reverse).success);assert.ok(outcome(proper).yield>outcome(reverse).yield);assert.ok(reverse.escaped.acetone>proper.escaped.acetone);assert.ok(Math.abs(proper.items.flask.acetone-reverse.items.flask.acetone)<EPS);conserved(proper);conserved(reverse);});
test('tap off or disconnected outlet prevents forced condensation without deleting vapour',()=>{for(const mode of ['off','disconnected']){const s=assembled();if(mode==='off')s.items.tap.on=false;else s.hoses[1].ends[1]={x:1000,y:300};run(s,12);assert.equal(outcome(s).yield,0);assert.ok(s.escaped.acetone>0&&s.escaped.water>0);conserved(s);}});
test('water in the cooling jacket cannot enter or dilute a receiver',()=>{const s=assembled();s.items.heater.on=false;run(s,15);assert.equal(s.items.receiverA.water,0);assert.equal(s.items.receiverA.acetone,0);conserved(s);});
test('plain feed transfer is not distilled recovery',()=>{const s=createState();Object.assign(s.items.source,{x:558,y:280,angle:0});pour(s,'source',1);assert.ok(s.items.receiverA.acetone>0);assert.equal(outcome(s).yield,0);assert.equal(outcome(s).success,false);conserved(s);});
test('missing glass path, missed receiver and overflow remain possible',()=>{for(const mode of ['path','receiver','overflow']){const s=assembled();if(mode==='path')s.links=s.links.filter(l=>l.id!=='head-condenser');if(mode==='receiver')s.items.receiverA.x=1100;if(mode==='overflow')s.items.receiverA.capacity=.01;run(s,12);if(mode==='path')assert.equal(outcome(s).yield,0);else assert.ok(s.spills.length);conserved(s);}});
test('heater must be in contact and thermal energy decays after switch-off',()=>{const s=assembled();s.items.heater.x=1100;run(s,12);assert.equal(s.items.flask.heat,0);assert.equal(outcome(s).yield,0);s.items.heater.x=390;run(s,9);const heat=s.items.flask.heat;s.items.heater.on=false;run(s,2);assert.ok(s.items.flask.heat<heat);conserved(s);});
test('hose ends accept either port and follow moved condenser geometry',()=>{const s=createState();s.items.tap.on=true;connectHose(s,'supply',0,worldPoint(s.items.tap,{x:0,y:30}));connectHose(s,'supply',1,worldPoint(s.items.condenser,{x:45,y:-12}));connectHose(s,'return',0,worldPoint(s.items.condenser,{x:185,y:85}));connectHose(s,'return',1,worldPoint(s.items.drain,{x:0,y:0}));assert.equal(cooling(s),'upper-fed');s.items.condenser.angle=180;assert.equal(cooling(s),'lower-fed');});
test('repeated transfers and complete heating conserve both sample components',()=>{const s=assembled();for(let i=0;i<10000;i++)stepChemistry(s,.02);conserved(s);assert.ok(s.items.flask.water+s.items.flask.acetone<.001);});
test('finished and invalid steps do not continue heating or pouring',()=>{const s=assembled();s.phase='finished';const snapshot=JSON.stringify(s);stepChemistry(s,1);pour(s,'flask',1);assert.equal(JSON.stringify(s),snapshot);});
test('new rigid apparatus drops, collides and spills both volatile components',()=>{const s=createState();Object.assign(s.items.flask,{x:800,y:100,angle:80,water:.2,acetone:.2});s.items.source.water-=.2;s.items.source.acetone-=.2;for(let i=0;i<600;i++)stepPhysics(s,1/120);assert.ok(s.spills.length);assert.ok(s.items.flask.water+s.items.flask.acetone<.4);conserved(s);});

test('supported glass assembly remains stable during heating and collection',()=>{
 const s=assembled();
 for(let i=0;i<1800;i++){stepPhysics(s,1/120);stepChemistry(s,1/120);}
 assert.ok(heaterContact(s));assert.ok(Math.abs(s.items.condenser.angle)<12);assert.ok(outcome(s).success);conserved(s);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,equilibrate,stepChemistry,pour,totals,outcome,physicsFor,stepPhysics} from '../prototype/recrystallisation-model.js';
import {storeItem} from '../prototype/equipment-storage.js';
function conserved(s){const t=totals(s);for(const [k,v]of Object.entries({water:.8,solute:.2,sand:.02}))assert.ok(Math.abs(t[k]-v)<1e-8,k);}
function run(s,t){for(let i=0;i<t*60;i++)stepChemistry(s,1/60);}
function fixture(){
 const s=createState();Object.assign(s.items.source,{water:.25,heat:1,x:805.6,y:120,angle:35});s.items.water.water-=.25;equilibrate(s.items.source);
 Object.assign(s.items.funnel,{x:840,y:270,angle:0});Object.assign(s.items.paper,{parent:'funnel',x:840,y:274});Object.assign(s.items.receiverA,{x:840,y:429});return s;
}
function hotFilter(s){pour(s,'source',1);Object.assign(s.items.source,{x:300,y:413,angle:0});}
function collect(s){
 s.items.paper.parent=null;s.items.paper.stored=true;s.items.freshPaper.parent='funnel';
 Object.assign(s.items.receiverA,{x:805,y:120,angle:0});s.items.receiverB.x=840;
 pour(s,'receiverA',1);
}
test('hot filtration removes sand while potassium nitrate remains dissolved',()=>{
 const s=fixture();hotFilter(s);assert.ok(s.items.paper.sand>.019);assert.equal(s.items.receiverA.sand,0);assert.ok(s.items.receiverA.dissolved>.19);conserved(s);
});
test('cooling forms crystals and leaves solute in mother liquor; a fresh filter collects wet product',()=>{
 const s=fixture();hotFilter(s);run(s,32);assert.ok(s.items.receiverA.crystals>.1);assert.ok(s.items.receiverA.dissolved>0);collect(s);
 assert.ok(outcome(s).success);assert.ok(s.items.freshPaper.water>0);assert.ok(s.items.receiverB.dissolved>0);assert.equal(s.items.receiverB.crystals,0);conserved(s);
});
test('too much solvent reduces recovery and can prevent crystallisation',()=>{
 const s=fixture();s.items.source.water+=.55;s.items.water.water-=.55;equilibrate(s.items.source);hotFilter(s);run(s,35);assert.ok(s.items.receiverA.crystals<1e-8);assert.ok(!outcome(s).success);conserved(s);
});
test('cold filtration retains desired undissolved starting material with impurity',()=>{
 const s=fixture();s.items.source.heat=0;equilibrate(s.items.source);hotFilter(s);assert.ok(s.items.paper.raw+s.items.paper.crystals>.1);assert.ok(!outcome(s).success);conserved(s);
});
test('collecting too early gives fewer crystals than cooling fully',()=>{
 const early=fixture(),late=fixture();hotFilter(early);hotFilter(late);run(early,8);run(late,32);collect(early);collect(late);assert.ok(outcome(early).yield<outcome(late).yield);conserved(early);conserved(late);
});
test('reusing sand-contaminated paper cannot count as pure crystal recovery',()=>{
 const s=fixture();hotFilter(s);run(s,32);Object.assign(s.items.receiverA,{x:805,y:120,angle:0});s.items.receiverB.x=840;pour(s,'receiverA',1);assert.ok(s.items.paper.crystals>0);assert.ok(!outcome(s).success);conserved(s);
});
test('direct starting-solid transfer onto fresh paper is not recrystallisation',()=>{
 const s=createState();Object.assign(s.items.funnel,{x:840,y:270,angle:0});s.items.freshPaper.parent='funnel';Object.assign(s.items.source,{x:805,y:120,angle:0});pour(s,'source',1);assert.ok(s.items.freshPaper.raw>0);assert.ok(!outcome(s).success);conserved(s);
});
test('storage pauses cooling and preserves all material; tipping and spills conserve solute phases',()=>{
 const s=fixture();hotFilter(s);storeItem(s,'receiverA',physicsFor(s));const c=s.items.receiverA.crystals;run(s,30);assert.equal(s.items.receiverA.crystals,c);conserved(s);
 const t=createState();Object.assign(t.items.source,{x:400,y:120,angle:85});for(let i=0;i<600;i++)stepPhysics(t,1/120);assert.ok(t.spills.length);conserved(t);
});
test('finished attempts remain immutable and reset has the full starting mixture',()=>{
 const s=fixture();s.phase='finished';const snap=JSON.stringify(s);run(s,4);pour(s,'source',1);assert.equal(JSON.stringify(s),snap);conserved(createState());
});

test('heating plain water or solution evaporates water, retains solute and accounts for vapour',()=>{
 for(const id of ['water','source']){const s=createState(),o=s.items[id];if(id==='source'){o.water=.25;s.items.water.water-=.25;}
 Object.assign(o,{x:500,y:id==='source'?355:371,heat:1});s.items.heater.on=true;const before=o.water;run(s,3);assert.ok(o.water<before);assert.ok(s.vapour>0);assert.ok(s.evaporating.includes(id));conserved(s);
 s.items.heater.on=false;const stopped=o.water;run(s,1);assert.equal(o.water,stopped);conserved(s);}
});

test('crystals in a clean beaker with mother liquor are a valid endpoint without a second filtration',()=>{
 const s=fixture();hotFilter(s);run(s,32);const r=outcome(s);assert.ok(r.success);assert.ok(r.inBeakers>.1);assert.equal(r.onPaper,0);assert.ok(s.items.receiverA.water>0);assert.ok(s.items.receiverA.dissolved>0);assert.equal(r.recovered,s.items.receiverA.crystals);conserved(s);
});
test('beaker endpoint excludes undissolved starting material, sand and spilled crystals',()=>{
 const s=createState();assert.ok(!outcome(s).success);s.items.source.raw-=.1;s.items.source.crystals+=.1;assert.ok(!outcome(s).success,'sand-contaminated material is not a clean product');
 s.items.source.sand=0;s.items.receiverB.sand=.02;assert.ok(!outcome(s).success,'remaining starting solid is not a clean product');
 s.items.source.raw=0;s.items.source.crystals=.2;assert.ok(outcome(s).success);
 s.items.source.crystals=0;s.spills.push({x:500,water:0,raw:0,dissolved:0,crystals:.2,sand:0,heat:0});assert.ok(!outcome(s).success);conserved(s);
});

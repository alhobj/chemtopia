import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,applyTool,placeItem,pour,stepChemistry,stepPhysics,physicsFor,solventContact,totals,outcome,measurements,checkMeasurement} from '../prototype/chromatography-model.js';
function run(s,seconds){for(let i=0;i<seconds*60;i++)stepChemistry(s,1/60);}
function setup(){
 const s=createState(),p=s.items.paper;
 Object.assign(s.items.pencil,{x:p.x,y:p.y+60});applyTool(s,'pencil');
 for(const [id,x]of [['green',-35],['purple',0],['black',35]]){Object.assign(s.items[id],{x:p.x+x,y:p.y+80});applyTool(s,id);}
 Object.assign(s.items.source,{x:565.6,y:100,angle:35});pour(s,'source',.3);Object.assign(s.items.source,{x:100,y:413,angle:0});
 Object.assign(p,{x:600,y:305});Object.assign(s.items.bar,{x:600,y:299});placeItem(s,'paper');return s;
}
function conserved(s,ink=.03){const t=totals(s);assert.ok(Math.abs(t.water-1)<1e-8);assert.ok(Math.abs(t.ink-ink)<1e-8);}
test('three marker samples develop into different bands and conserve sample and water',()=>{
 const s=setup();assert.ok(solventContact(s)>150);run(s,10);
 assert.ok(outcome(s).success);assert.equal(outcome(s).spots.length,3);
 for(const spot of s.items.paper.spots)for(const c of spot.components)assert.ok(c.y> s.items.paper.front&&c.y<spot.origin);
 conserved(s);
});
test('submerged spots dissolve into chamber solvent instead of disappearing',()=>{
 const s=setup();s.items.source.water-=.3;s.items.chamber.water+=.3;run(s,2);
 assert.ok(!outcome(s).success);assert.ok(s.items.chamber.ink>.029);conserved(s);
});
test('no solvent contact prevents development; removing paper pauses and preserves pattern',()=>{
 const s=setup();s.items.paper.x=300;run(s,3);assert.equal(s.items.paper.front,null);
 s.items.paper.x=600;run(s,6);const snapshot=JSON.stringify(s.items.paper);s.items.paper.x=300;const front=s.items.paper.front;run(s,3);assert.equal(s.items.paper.front,front);
 s.items.paper.x=600;run(s,2);assert.ok(s.items.paper.front<front);assert.notEqual(JSON.stringify(s.items.paper),snapshot);conserved(s);
});
test('baseline and front marks produce measurable distances and valid R_F retries',()=>{
 const s=setup();run(s,10);s.items.paper.x=300;
 Object.assign(s.items.pencil,{x:300,y:s.items.paper.y+s.items.paper.front-90});assert.ok(applyTool(s,'pencil'));
 const rows=measurements(s);assert.equal(rows.length,7);
 for(const r of rows){assert.ok(checkMeasurement(r,r.distance,r.front,r.distance/r.front));assert.ok(!checkMeasurement(r,r.distance,r.front,0));assert.ok(!checkMeasurement(r,r.distance,0,0));assert.ok(!checkMeasurement(r,NaN,r.front,.5));}
 conserved(s);
});
test('wrong/missing baseline, bad solvent-front mark and an overrun remain reviewable',()=>{
 for(const problem of ['baseline','front','overrun']){const s=setup();run(s,problem==='overrun'?30:10);s.items.paper.frontMark=s.items.paper.front;if(problem==='baseline')s.items.paper.baseline=null;if(problem==='front')s.items.paper.frontMark+=30;assert.equal(outcome(s).measurable,false);assert.deepEqual(measurements(s),[]);conserved(s);}
});
test('overflow and missed pouring conserve water and dissolved ink',()=>{
 const s=createState();Object.assign(s.items.source,{x:558,y:100,water:1,ink:.02});s.items.chamber.water=0;
 pour(s,'source',.8);pour(s,'source',.2);Object.assign(s.items.chamber,{x:500,y:200,angle:80});pour(s,'chamber',1);
 assert.ok(s.spills.length);conserved(s,.02);
});
test('repeated spotting is possible; tool tips away from paper add nothing',()=>{
 const s=createState();assert.equal(applyTool(s,'green'),false);Object.assign(s.items.green,{x:300,y:425});
 applyTool(s,'green');applyTool(s,'green');assert.equal(s.items.paper.spots.length,2);conserved(s,.02);
});
test('clipped paper remains supported inside solid chamber during development',()=>{
 const s=setup();for(let i=0;i<600;i++){stepPhysics(s,1/120);stepChemistry(s,1/120);}
 assert.ok(s.links.length);assert.ok(Math.abs(s.items.paper.y-(s.items.bar.y+6))<2);assert.ok(Math.abs(s.items.bar.y-299)<2);assert.ok(Math.abs(s.items.paper.angle)<3);conserved(s);
});
test('tilted chamber spills water and dissolved marker ink without loss',()=>{
 const s=createState();Object.assign(s.items.chamber,{x:700,y:120,angle:80,water:.4,ink:.02});s.items.source.water=.6;
 for(let i=0;i<700;i++)stepPhysics(s,1/120);assert.ok(s.spills.length);conserved(s,.02);
});
test('finished state is immutable, fresh attempts reset paper and water',()=>{
 const s=setup();run(s,5);s.phase='finished';const snapshot=JSON.stringify(s);stepChemistry(s,.05);pour(s,'source',.1);applyTool(s,'pencil');assert.equal(JSON.stringify(s),snapshot);assert.equal(createState().items.paper.front,null);
});

test('unsupported paper falls onto the chamber floor and submerged ink dissolves',()=>{
 const s=setup();s.links=[];Object.assign(s.items.paper,{y:220});s.items.source.water-=.3;s.items.chamber.water+=.3;
 for(let i=0;i<600;i++){stepPhysics(s,1/120);stepChemistry(s,1/120);}
 assert.ok(s.items.paper.y+180<=s.items.chamber.y+218);assert.ok(s.items.chamber.ink>.029);conserved(s);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,moveItem,placeItem,detach,pour,outcome,totals,stepPhysics,physicsFor,holdItem,dragItem,releaseItem,EPS} from '../prototype/model.js';
function setup(paper=true){const s=createState();moveItem(s,'stand',442,372);moveItem(s,'funnel',500,200);s.items.funnel.angle=0;placeItem(s,'funnel');if(paper){moveItem(s,'paper',500,204);placeItem(s,'paper');}moveItem(s,'receiverA',500,300);moveItem(s,'source',465.6,100);return s;}
function conserved(s){const t=totals(s);assert.ok(Math.abs(t.water-1)<EPS);assert.ok(Math.abs(t.sand-.12)<EPS);for(const o of [...Object.values(s.items),...s.spills])for(const k of ['water','sand'])if(k in o)assert.ok(o[k]>=0);}
test('filtering retains all sand and collects water; water-only overflow does not erase success',()=>{const s=setup();pour(s,'source',2);assert.ok(outcome(s).success);assert.ok(s.items.receiverA.water>0);assert.ok(s.spills.some(x=>x.water>0));assert.equal(s.items.receiverA.sand,0);conserved(s);});
test('missing paper transfers mixture and overflows without separating',()=>{const s=setup(false);pour(s,'source',2);assert.ok(!outcome(s).success);assert.ok(s.items.receiverA.sand>0);assert.ok(s.spills.some(x=>x.sand>0));conserved(s);});
test('pouring beside a receiver spills both materials',()=>{const s=setup();moveItem(s,'source',90,100);pour(s,'source',2);assert.ok(s.spills.some(x=>x.sand>0));assert.equal(s.items.paper.sand,0);conserved(s);});
test('direct beaker transfer preserves mixture and capacity overflow',()=>{const s=createState();moveItem(s,'receiverA',350,429);moveItem(s,'source',315.6,300);pour(s,'source',2);assert.ok(s.items.receiverA.sand>0);assert.ok(s.items.receiverA.water+s.items.receiverA.sand<=.65+EPS);conserved(s);});
test('interrupted pour leaves material at source and can resume',()=>{const s=setup();pour(s,'source',.2);const remaining=s.items.source.water+s.items.source.sand;assert.ok(remaining>0);assert.ok(!outcome(s).success);pour(s,'source',2);assert.ok(outcome(s).success);conserved(s);});
test('loaded paper can be removed and moved without losing sand',()=>{const s=setup();pour(s,'source',.4);const retained=s.items.paper.sand;detach(s,'paper');moveItem(s,'paper',800,400);pour(s,'source',1);assert.equal(s.items.paper.sand,retained);assert.ok(s.items.receiverA.sand>0);conserved(s);});
test('no receiver under a paper-lined funnel retains sand and spills water',()=>{const s=setup();moveItem(s,'receiverA',800,400);pour(s,'source',2);assert.equal(outcome(s).success,false);assert.ok(Math.abs(s.items.paper.sand-.12)<EPS);conserved(s);});
test('nearest physical opening intercepts flow regardless of correctness',()=>{const s=setup();moveItem(s,'receiverB',500,165);pour(s,'source',.25);assert.ok(s.items.receiverB.sand>0);assert.equal(s.items.paper.sand,0);conserved(s);});
test('source cannot catch its own pour, including attached funnel',()=>{const s=createState();moveItem(s,'funnel',150,303);placeItem(s,'funnel');moveItem(s,'paper',150,307);placeItem(s,'paper');pour(s,'source',.3);assert.ok(s.spills.length);assert.equal(s.items.paper.sand,0);conserved(s);});
test('repeated small transfers stay conserved and empty source exactly',()=>{const s=setup();for(let i=0;i<1000;i++)pour(s,'source',.002);assert.equal(s.items.source.water,0);assert.equal(s.items.source.sand,0);conserved(s);});
test('invalid and finished operations do not alter material; fresh reset deterministic',()=>{const a=createState(),b=createState();assert.deepEqual(a,b);pour(a,'paper',2);pour(a,'source',NaN);assert.deepEqual(a,b);a.phase='finished';pour(a,'source',2);conserved(a);assert.deepEqual(createState(),b);});

function advance(s,seconds,held=null){for(let i=0;i<Math.ceil(seconds*120);i++)stepPhysics(s,1/120,held);}
test('funnel falls without rotating in air; bench contact causes a physical tip',()=>{
 const s=createState();detach(s,'funnel');moveItem(s,'funnel',320,180);moveItem(s,'paper',950,487);
 advance(s,.2);assert.ok(s.items.funnel.y>180);assert.ok(Math.abs(s.items.funnel.angle)<.01);
 advance(s,3);assert.ok(Math.abs(s.items.funnel.angle)>36);assert.deepEqual(physicsFor(s).overlaps(),[]);conserved(s);
});
test('ring contact seats the cone above the ring, with solid stand geometry and no penetration',()=>{
 const s=createState();detach(s,'funnel');moveItem(s,'funnel',605,270);advance(s,3);
 assert.ok(physicsFor(s).seat);assert.ok(Math.abs(s.items.funnel.angle)<2);
 assert.ok(Math.abs(s.items.funnel.x-s.items.stand.x-90)<1);
 assert.ok(Math.abs(s.items.funnel.y-(s.items.stand.y-172-32.5))<1);
 assert.deepEqual(physicsFor(s).overlaps(),[]);conserved(s);
});
test('fast mouse movement cannot pass through another vessel or the stand rod',()=>{
 const s=createState();moveItem(s,'receiverA',350,429);holdItem(s,'receiverA');dragItem(s,'receiverA',150,429);
 assert.ok(s.items.receiverA.x>230);assert.deepEqual(physicsFor(s).overlaps(),[]);
 dragItem(s,'receiverA',350,200);dragItem(s,'receiverA',350,320);dragItem(s,'receiverA',600,320);
 assert.ok(s.items.receiverA.x<480);assert.deepEqual(physicsFor(s).overlaps(),[]);conserved(s);
});
test('released beaker lands on another beaker instead of falling through it',()=>{
 const s=createState();moveItem(s,'source',660,200);advance(s,3);
 assert.ok(s.items.source.y<400);assert.deepEqual(physicsFor(s).overlaps(),[]);conserved(s);
});
test('held equipment stays aloft and falls after release',()=>{
 const s=createState();moveItem(s,'receiverA',350,429);holdItem(s,'receiverA');dragItem(s,'receiverA',350,150);advance(s,.5,'receiverA');
 assert.ok(Math.abs(s.items.receiverA.y-150)<.01);releaseItem(s);advance(s,2);
 assert.ok(Math.abs(s.items.receiverA.y-429)<1);conserved(s);
});
test('loaded filter spills its sand as the funnel tips, preserving all represented material',()=>{
 const s=createState();detach(s,'funnel');moveItem(s,'funnel',800,180);moveItem(s,'paper',800,184);placeItem(s,'paper');
 s.items.paper.sand=.12;s.items.source.sand=0;advance(s,.2);assert.equal(s.items.paper.sand,.12);
 advance(s,5);assert.equal(s.items.paper.sand,0);assert.ok(s.spills.some(o=>o.sand>0));assert.ok(!outcome(s).success);conserved(s);
});
test('tipped beaker empties into the spill state without losing water or sand',()=>{
 const s=createState();moveItem(s,'source',150,180);s.items.source.angle=85;advance(s,5);
 assert.equal(s.items.source.water,0);assert.equal(s.items.source.sand,0);assert.ok(s.spills.length);conserved(s);
});
test('inserting paper uses funnel containment without knocking over the stand',()=>{
 const s=createState();detach(s,'funnel');moveItem(s,'funnel',605,270);advance(s,2);
 const f=s.items.funnel;holdItem(s,'paper');dragItem(s,'paper',950,150);dragItem(s,'paper',f.x,150);dragItem(s,'paper',f.x,f.y+4);
 advance(s,.3,'paper');assert.ok(Math.abs(s.items.stand.angle)<2);assert.ok(Math.abs(s.items.funnel.angle)<2);
 placeItem(s,'paper');releaseItem(s);assert.equal(s.items.paper.parent,'funnel');advance(s,.5);
 assert.ok(Math.abs(s.items.stand.angle)<2);conserved(s);
});
test('moving a stand sweeps its seated funnel as part of the collision assembly',()=>{
 const s=createState();moveItem(s,'source',800,300);holdItem(s,'source');detach(s,'funnel');moveItem(s,'funnel',605,270);advance(s,2,'source');
 assert.ok(physicsFor(s).seat);holdItem(s,'stand');const offset=s.items.funnel.x-s.items.stand.x;
 dragItem(s,'stand',800,509);assert.ok(s.items.stand.x<700);
 assert.ok(Math.abs(s.items.funnel.x-s.items.stand.x-offset)<1);assert.deepEqual(physicsFor(s).overlaps(),[]);conserved(s);
});

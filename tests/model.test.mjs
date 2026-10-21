import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,moveItem,placeItem,detach,pour,outcome,totals,stepPhysics,EPS} from '../prototype/model.js';
function setup(paper=true){const s=createState();moveItem(s,'stand',442,372);moveItem(s,'funnel',500,200);placeItem(s,'funnel');if(paper){moveItem(s,'paper',500,204);placeItem(s,'paper');}moveItem(s,'receiverA',500,300);moveItem(s,'source',465.6,100);return s;}
function conserved(s){const t=totals(s);assert.ok(Math.abs(t.water-1)<EPS);assert.ok(Math.abs(t.sand-.12)<EPS);for(const o of [...Object.values(s.items),...s.spills])for(const k of ['water','sand'])if(k in o)assert.ok(o[k]>=0);}
test('filtering retains all sand and collects water; water-only overflow does not erase success',()=>{const s=setup();pour(s,'source',2);assert.ok(outcome(s).success);assert.ok(s.items.receiverA.water>0);assert.ok(s.spills.some(x=>x.water>0));assert.equal(s.items.receiverA.sand,0);conserved(s);});
test('missing paper transfers mixture and overflows without separating',()=>{const s=setup(false);pour(s,'source',2);assert.ok(!outcome(s).success);assert.ok(s.items.receiverA.sand>0);assert.ok(s.spills.some(x=>x.sand>0));conserved(s);});
test('pouring beside a receiver spills both materials',()=>{const s=setup();moveItem(s,'source',90,100);pour(s,'source',2);assert.ok(s.spills.some(x=>x.sand>0));assert.equal(s.items.paper.sand,0);conserved(s);});
test('direct beaker transfer preserves mixture and capacity overflow',()=>{const s=createState();moveItem(s,'source',315.6,300);pour(s,'source',2);assert.ok(s.items.receiverA.sand>0);assert.ok(s.items.receiverA.water+s.items.receiverA.sand<=.65+EPS);conserved(s);});
test('interrupted pour leaves material at source and can resume',()=>{const s=setup();pour(s,'source',.2);const remaining=s.items.source.water+s.items.source.sand;assert.ok(remaining>0);assert.ok(!outcome(s).success);pour(s,'source',2);assert.ok(outcome(s).success);conserved(s);});
test('loaded paper can be removed and moved without losing sand',()=>{const s=setup();pour(s,'source',.4);const retained=s.items.paper.sand;detach(s,'paper');moveItem(s,'paper',800,400);pour(s,'source',1);assert.equal(s.items.paper.sand,retained);assert.ok(s.items.receiverA.sand>0);conserved(s);});
test('stand carries funnel and loaded paper; vessel opening no longer supports funnel',()=>{const s=setup();pour(s,'source',.2);const sand=s.items.paper.sand;moveItem(s,'stand',515,509);assert.equal(s.items.funnel.x,573);assert.equal(s.items.paper.x,573);moveItem(s,'funnel',740,367);placeItem(s,'funnel');assert.equal(s.items.funnel.parent,null);for(let i=0;i<100;i++)stepPhysics(s,.016);assert.equal(s.items.funnel.angle,90);assert.equal(s.items.funnel.y,467);assert.equal(s.items.paper.sand,sand);conserved(s);});
test('no receiver under a paper-lined funnel retains sand and spills water',()=>{const s=setup();moveItem(s,'receiverA',800,400);pour(s,'source',2);assert.equal(outcome(s).success,false);assert.ok(Math.abs(s.items.paper.sand-.12)<EPS);conserved(s);});
test('nearest physical opening intercepts flow regardless of correctness',()=>{const s=setup();moveItem(s,'receiverB',500,165);pour(s,'source',.25);assert.ok(s.items.receiverB.sand>0);assert.equal(s.items.paper.sand,0);conserved(s);});
test('source cannot catch its own pour, including attached funnel',()=>{const s=createState();moveItem(s,'funnel',150,303);placeItem(s,'funnel');moveItem(s,'paper',150,307);placeItem(s,'paper');pour(s,'source',.3);assert.ok(s.spills.length);assert.equal(s.items.paper.sand,0);conserved(s);});
test('repeated small transfers stay conserved and empty source exactly',()=>{const s=setup();for(let i=0;i<1000;i++)pour(s,'source',.002);assert.equal(s.items.source.water,0);assert.equal(s.items.source.sand,0);conserved(s);});
test('invalid and finished operations do not alter material; fresh reset deterministic',()=>{const a=createState(),b=createState();assert.deepEqual(a,b);pour(a,'paper',2);pour(a,'source',NaN);assert.deepEqual(a,b);a.phase='finished';pour(a,'source',2);conserved(a);assert.deepEqual(createState(),b);});

test('released objects fall to the bench; held objects and attached children stay supported',()=>{
 const s=createState();moveItem(s,'source',150,100);moveItem(s,'stand',515,300);moveItem(s,'funnel',573,128);placeItem(s,'funnel');moveItem(s,'paper',573,132);placeItem(s,'paper');
 stepPhysics(s,.02,'source');assert.equal(s.items.source.y,100);assert.ok(s.items.stand.y>300);assert.equal(s.items.funnel.y,s.items.stand.y-172);assert.equal(s.items.funnel.angle,0);
 for(let i=0;i<100;i++)stepPhysics(s,.016);
 assert.equal(s.items.source.y,413);assert.equal(s.items.stand.y,509);assert.equal(s.items.funnel.y,337);assert.equal(s.items.paper.y,341);conserved(s);
});
test('unsupported tipped funnel cannot act as an upright filtration receiver',()=>{
 const s=createState();moveItem(s,'source',755.6,200);moveItem(s,'paper',790,471);placeItem(s,'paper');pour(s,'source',.4);
 assert.equal(s.items.paper.sand,0);assert.ok(s.spills.some(o=>o.sand>0));conserved(s);
});

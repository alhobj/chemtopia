import test from 'node:test';
import assert from 'node:assert/strict';
import * as B from '../prototype/buffer-model.js';
import {pH as titrationPH} from '../prototype/titration-model.js';
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function prepared(){const s=B.createState();B.transfer(s,'acid','sample1',10);B.transfer(s,'acetate','sample1',10);B.transfer(s,'water','sample2',20);return s;}
test('buffer reuses titration charge balance including water, pure acid and pure ethanoate limits',()=>{
 const s=B.createState();near(B.pH(s.items.water),7);assert.ok(B.pH(s.items.acid)>2&&B.pH(s.items.acid)<4);assert.ok(B.pH(s.items.acetate)>8);
 const o=s.items.acetate;near(B.pH(o),titrationPH({water:o.water,acetate:o.solutes.acetateTotal,base:o.solutes.sodium}));
 const dilute={water:1e12,solutes:{acetateTotal:1e-9,sodium:5e-10,chloride:0}};near(B.pH(dilute),7,1e-7);
});
test('prepared buffer resists small matched additions better than equal-volume water',()=>{
 for(const reagent of ['hcl','naoh']){const s=prepared(),a=B.pH(s.items.sample1),w=B.pH(s.items.sample2);B.transfer(s,reagent,'sample1',1);B.transfer(s,reagent,'sample2',1);assert.ok(Math.abs(B.pH(s.items.sample1)-a)<.15);assert.ok(Math.abs(B.pH(s.items.sample2)-w)>3);near(s.items.sample1.water,s.items.sample2.water);}
});
test('buffer capacity is finite in both directions and dilution preserves acid strength without imposing constant pH',()=>{
 const s=prepared(),initial=B.pH(s.items.sample1);B.transfer(s,'water','sample1',20);assert.ok(Math.abs(B.pH(s.items.sample1)-initial)<.01);near(s.items.sample1.solutes.acetateTotal,.002);near(s.items.sample1.water,40);
 B.transfer(s,'naoh','sample1',30);assert.ok(B.pH(s.items.sample1)>11);near(s.items.sample1.baseAdded,.003);
 const acid=prepared();B.transfer(acid,'hcl','sample1',30);assert.ok(B.pH(acid.items.sample1)<2);assert.notEqual(B.pH(acid.items.sample1),initial);
});
test('charge/mass balances, finite additions, overflow and preparation records stay consistent',()=>{
 const s=prepared(),before=B.totals(s);B.transfer(s,'naoh','sample1',11);B.transfer(s,'water','sample2',200);const after=B.totals(s);for(const k of Object.keys(before))near(before[k],after[k]);
 const c=B.speciation(s.items.sample1),o=s.items.sample1,V=o.water/1000;near(c.H+o.solutes.sodium/V,c.OH+o.solutes.chloride/V+c.A,1e-10);near(c.HA+c.A,o.solutes.acetateTotal/V);
 assert.equal(B.record(s),null);B.fitProbe(s,'sample1');const row=B.record(s);near(row.baseAdded,.0011);assert.equal(row.volume,31);
 B.transfer(s,'water','sample1',10);assert.equal(B.record(s).changedPreparation,true);assert.equal(B.bufferQuestions(s).length,3);s.phase='finished';assert.equal(B.transfer(s,'naoh','sample1',1),0);
});
test('optional buffer approximation is restricted to ordinary initial mixtures, with labelled fallback otherwise',()=>{
 const s=prepared();B.fitProbe(s,'sample1');B.record(s);const h=B.hlExample(s);assert.ok(h.row);near(h.pH,-Math.log10(B.CHEMISTRY.kaAcetic));near(h.concentration,.1);
 const pure=B.createState();B.transfer(pure,'acid','sample1',20);B.fitProbe(pure,'sample1');B.record(pure);assert.equal(B.hlExample(pure).row,undefined);
});

test('withdrawing a recorded sample flags the changed preparation without losing matter',()=>{
 const s=prepared();B.fitProbe(s,'sample1');B.record(s);const before=B.totals(s);
 B.transfer(s,'sample1','waste',2);assert.equal(s.items.sample1.changedPreparation,true);near(s.items.sample1.water,18);
 const after=B.totals(s);for(const k of Object.keys(before))near(before[k],after[k]);
});

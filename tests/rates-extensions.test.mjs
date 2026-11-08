import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from '../prototype/rates-model.js';
const near=(a,b,t=1e-6)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function setup(C,mass=.1){const s=R.createState({acidConcentration:C}),f=s.items.flask;s.items.chips.chips-=mass;f.chips=mass;R.transfer(s,'acid','vial',10);Object.assign(s.items.vial,{x:f.x,y:f.y-10});assert.ok(R.fitVial(s));Object.assign(s.items.bung,{x:f.x,y:f.y-10});assert.ok(R.fitBung(s));assert.ok(R.connect(s));R.toggleClock(s);R.mixVial(s);return s;}
function finish(s){R.stepChemistry(s,.01);for(let i=0;i<100000&&R.theoreticalVolume(s.charge)-(s.collected+s.escaped*R.CHEM.molarVolume)>.0001;i++)R.stepChemistry(s,.05);}
function run(s,n){for(let i=0;i<n*100;i++)R.stepChemistry(s,.01);}
test('controlled concentration changes speed but not the endpoint when both acid amounts are in excess',()=>{
 const slow=setup(.5),fast=setup(1);run(slow,5);run(fast,5);assert.ok(fast.collected>slow.collected*1.5);run(slow,400);run(fast,400);near(slow.collected,fast.collected,1e-4);near(fast.collected,.1/R.CHEM.molarMass*R.CHEM.molarVolume,1e-4);
 const comparison=R.compareTrials(R.saveTrial(slow),R.saveTrial(fast));assert.equal(comparison.kind,'concentration');assert.equal(comparison.sameYield,true);
 for(const [s,C]of [[slow,.5],[fast,1]]){const b=R.balances(s);near(b.acid,.2*C);near(b.solid,4);near(b.water,500);near(b.gas,0);}
});
test('lower acid supply changes limiting reactant and final volume consistently',()=>{
 const limited=setup(.1),excess=setup(1);finish(limited);finish(excess);near(limited.collected,12,1e-3);near(excess.collected,.1/R.CHEM.molarMass*24000,1e-4);
 const c=R.compareTrials(R.saveTrial(limited),R.saveTrial(excess));assert.equal(c.kind,'concentration');assert.equal(c.sameYield,false);assert.match(c.message,/limiting/);near(R.balances(limited).gas,0);
});
test('comparison rejects simultaneous form/volume changes, leaks and late additions',()=>{
 const a=setup(.5),b=setup(1);run(a,1);run(b,1);const x=R.saveTrial(a),y=R.saveTrial(b);assert.equal(R.compareTrials(x,y).kind,'concentration');
 for(const field of ['water','chips']){const changed=structuredClone(y);changed.charge[field]+=1;assert.equal(R.compareTrials(x,changed).kind,'uncontrolled');}
 b.tight=false;run(b,1);assert.equal(R.compareTrials(x,R.saveTrial(b)).kind,'uncontrolled');assert.equal(b.charge.collectionChanged,true);
});
test('early regression uses actual distinct-time observations and does not create a rate law',()=>{
 assert.equal(R.initialRate([{time:0,volume:0},{time:2,volume:4}]),null);const r=R.initialRate([{time:0,volume:1},{time:0,volume:2},{time:2,volume:5},{time:4,volume:9}]);near(r.slope,2);near(r.intercept,1);assert.equal(r.n,3);
 const s=setup(.5);run(s,2);R.record(s);const next=R.nextTrial(s,{acidConcentration:.25});near(next.items.acid.acid,.05);near(next.supplyConcentration,.25);assert.ok(next.trials.length);assert.equal(next.temperature,20);assert.throws(()=>R.createState({acidConcentration:2}));
});
test('finite syringe capacity is distinguished from total gas production',()=>{
 const s=setup(1,.6);finish(s);const theory=R.theoreticalVolume(s.charge);assert.ok(theory>100);near(s.collected,100,1e-4);near(s.collected+s.escaped*R.CHEM.molarVolume,theory,1e-3);near(R.balances(s).gas,0);
});

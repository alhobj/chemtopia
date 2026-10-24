import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,CHEM,transfer,stepChemistry,balances,fitVial,fitBung,mixVial,connect,record,toggleClock,saveTrial,nextTrial,meanRate,fairPair,zeroSyringe,stepPhysics,clampSyringe} from '../prototype/rates-model.js';
import {initializeStorage,storeItem} from '../prototype/equipment-storage.js';
import {physicsFor} from '../prototype/rates-model.js';
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function run(s,seconds){for(let i=0;i<seconds*100;i++)stepChemistry(s,.01);}
function setup(kind='chips',mass=.2,ml=10){const s=createState(),f=s.items.flask;s.items[kind][kind]-=mass;f[kind]=mass;transfer(s,'acid','vial',ml);Object.assign(s.items.vial,{x:f.x,y:f.y-10});assert.ok(fitVial(s));Object.assign(s.items.bung,{x:f.x,y:f.y-10});assert.ok(fitBung(s));assert.ok(connect(s));toggleClock(s);mixVial(s);return s;}
function check(s){const b=balances(s);near(b.solid,4,1e-6);near(b.acid,.2,1e-6);near(b.water,500,1e-6);near(b.gas,0,1e-7);}
test('powder gives a steeper early curve than equal chips, not extra final gas',()=>{const c=setup(),p=setup('powder');run(c,8);run(p,8);assert.ok(p.collected>c.collected*1.5);run(c,150);run(p,150);near(c.collected,p.collected,1e-4);near(c.collected,.2/CHEM.molarMass*24000,1e-4);check(c);check(p);});
test('suspended inner acid vial permits sealed assembly without a timing challenge',()=>{const s=createState();s.items.chips.chips-=.2;s.items.flask.chips=.2;transfer(s,'acid','vial',10);Object.assign(s.items.vial,{x:420,y:380});fitVial(s);run(s,10);near(s.reacted,0);check(s);});
test('an open flask loses gas before fitting the bung; records are not idealised',()=>{const s=setup();s.items.bung.parent=null;run(s,4);assert.ok(s.escaped>0);near(s.collected,0);check(s);});
test('a loose joint lowers recovery and leaks previously collected gas',()=>{const s=setup('powder');run(s,5);const before=s.collected;s.tight=false;run(s,80);assert.ok(s.collected<before);assert.ok(s.escaped>0);check(s);});
test('insufficient acid limits the theoretical yield with 2:1 stoichiometry',()=>{const s=setup('powder',.2,1);run(s,250);near(s.collected,12,1e-3);assert.ok(s.items.flask.powder>.14);check(s);});
test('syringe capacity sends overflow to escaped gas without deleting CO2',()=>{const s=setup('powder',1,50);run(s,150);near(s.collected,100);assert.ok(s.escaped>0);check(s);});
test('water dilution slows the rate while sufficient acid leaves final yield unchanged',()=>{const a=setup(),b=setup();b.items.flask.water+=10;b.items.water.water-=10;run(a,10);run(b,10);assert.ok(a.collected>b.collected);run(a,250);run(b,250);near(a.collected,b.collected,1e-4);check(b);});
test('stopwatch stopping does not stop a chemical reaction',()=>{const s=setup();run(s,3);toggleClock(s);const t=s.elapsed,v=s.collected;run(s,3);near(s.elapsed,t);assert.ok(s.collected>v);check(s);});
test('logger records displayed precision; mean collection rate uses distinct times',()=>{const s=setup();s.logger=true;run(s,7);assert.ok(s.records.length>=4);const r=meanRate(s.records);near(r.value,(r.b.volume-r.a.volume)/(r.b.time-r.a.time));assert.equal(record(s).volume,Number(s.collected.toFixed(1)));});
test('fresh trial retains copies of saved observations, not apparatus contents',()=>{const s=setup();run(s,3);record(s);saveTrial(s);const n=nextTrial(s);assert.equal(n.trials.length,1);near(n.collected,0);near(n.items.flask.chips,0);assert.ok(n.trials[0].records.length>=2);n.records.push({time:1,volume:3});assert.notDeepEqual(n.records,n.trials[0].records);});
test('matched mass/acid and different pure forms are necessary for the comparison',()=>{const a=setup(),b=setup('powder');run(a,1);run(b,1);record(a);record(b);assert.ok(fairPair(saveTrial(a),saveTrial(b)));b.charge.water+=10;assert.equal(fairPair(saveTrial(a),saveTrial(b)),false);});
test('emptying the syringe releases gas, rather than resetting chemistry',()=>{const s=setup();run(s,5);const reacted=s.reacted;zeroSyringe(s);near(s.collected,0);near(s.reacted,reacted);check(s);});
test('stored syringe cannot collect gas; all material remains in the balance',()=>{const s=setup();storeItem(s,'syringe',physicsFor(s));run(s,10);near(s.collected,0);assert.ok(s.escaped>0);check(s);});
test('wrong-vessel acid/carbonate mixing reacts and loses its gas',()=>{const s=createState();s.items.chips.chips-=.1;s.items.acid.chips=.1;run(s,80);assert.ok(s.reacted>0&&s.escaped>0);near(s.collected,0);check(s);});
test('late reactant additions are retained and flagged, not treated as a fair fixed charge',()=>{const s=setup();run(s,1);s.items.bung.parent=null;transfer(s,'acid','flask',10);assert.ok(s.charge.changedAfterStart);near(s.charge.acid,.02);check(s);});
test('finished attempts freeze reaction, liquid transfer and new records',()=>{const s=setup();s.phase='finished';const v=s.collected;run(s,5);near(s.collected,v);assert.equal(transfer(s,'acid','vial',10),0);assert.equal(record(s),null);});
test('a clamped syringe remains supported with a real collision body',()=>{const s=initializeStorage(createState());s.items.syringe.stored=false;Object.assign(s.items.syringe,{x:580,y:298});assert.ok(clampSyringe(s));for(let i=0;i<120;i++)stepPhysics(s,1/60,null);assert.ok(Math.abs(s.items.syringe.y-298)<4);assert.ok(physicsFor(s).entries.has('syringe'));});

test('mixed chips and powder remain finite as the fast fraction runs out',()=>{const s=setup('chips',.1);s.items.powder.powder-=.1;s.items.flask.powder=.1;run(s,200);near(s.collected,.2/100.09*24000,1e-4);assert.ok(Number.isFinite(s.rate));check(s);});

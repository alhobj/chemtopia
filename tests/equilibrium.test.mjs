import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../prototype/equilibrium-model.js';
import {equilibriumQuestions} from '../prototype/investigation-review.js';
import {createPlayerStore} from '../prototype/player-store.js';
import {stockAllLabsForTesting,reserveAttempt} from '../prototype/progression.js';
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
test('one-complex equilibrium conserves both analytical totals and recovers the stated Kc',()=>{
 for(const f of [1e-8,1e-6,.0005,.05])for(const s of [1e-8,1e-6,.0005,.05]){
  const x=E.solveComplex(f,s);assert.ok(x>=0&&x<=Math.min(f,s));near(x+(f-x),f);near(x+(s-x),s);near(E.quotient(x,f-x,s-x),E.CONDITIONS.Kc,1e-4);
 }
 near(E.solveComplex(0,1),0);near(E.solveComplex(1,0),0);near(E.solveComplex(1,1,0),0);assert.throws(()=>E.solveComplex(-1,1));
});
test('pre-characterised standards model incomplete conversion in excess iron',()=>{
 const s=E.createState();for(const id of ['reference1','reference2']){const c=E.composition(s.items[id]);assert.ok(c.complex<c.scnTotal);assert.ok(c.complex/c.scnTotal>.97);near(c.fe*c.scn*E.CONDITIONS.Kc,c.complex);}
});
test('finite preparation, transfer, film and overflow conserve water/analytical components',()=>{
 const s=E.createState(),before=E.totals(s);E.transfer(s,'iron','mixture1',5);E.transfer(s,'thiocyanate','mixture1',5);E.transfer(s,'water','mixture1',10);near(E.composition(s.items.mixture1).feTotal,.0005);
 E.transfer(s,'mixture1','cuvetteA',3);E.transfer(s,'cuvetteA','waste',4);near(s.items.cuvetteA.water,.05);assert.ok(s.items.cuvetteA.solutes.FeTotal>0);
 E.transfer(s,'water','mixture2',200);assert.ok(s.spills.length);const after=E.totals(s);for(const key of Object.keys(before))near(before[key],after[key]);
});
test('composition-driven colour, dilution and Q predict consistent concentration changes',()=>{
 const s=E.createState();E.transfer(s,'iron','mixture1',5);E.transfer(s,'thiocyanate','mixture1',5);E.transfer(s,'water','mixture1',10);const a=E.composition(s.items.mixture1),colour=E.colour(s.items.mixture1);
 E.transfer(s,'iron','mixture1',5);assert.equal(s.lastMixtureChange.direction,'forward');assert.ok(s.lastMixtureChange.Q<E.CONDITIONS.Kc);
 const before=E.composition(s.items.mixture1);E.transfer(s,'water','mixture1',25);assert.equal(s.lastMixtureChange.direction,'reverse');assert.ok(s.lastMixtureChange.Q>E.CONDITIONS.Kc);assert.ok(E.composition(s.items.mixture1).complex<before.complex);assert.notEqual(E.colour(s.items.mixture1),colour);near(a.feTotal,.0005);
});
test('shared optical response produces a usable calibration without substituting true mixture concentration',()=>{
 const s=E.createState();const c=s.items.cuvetteA;c.parent='meter';c.clean=true;s.items.meter.lid=true;E.transfer(s,'water','cuvetteB',3);s.items.cuvetteB.clean=true;s.items.cuvetteB.parent='meter';c.parent=null;E.blank(s);s.items.cuvetteB.parent=null;
 // Individually prepared fresh aliquots isolate optical/regression behaviour.
 for(const source of ['water','reference1','reference2']){const original=s.items[source];Object.assign(c,{water:3,solutes:Object.fromEntries(Object.entries(original.solutes).map(([k,n])=>[k,n*3/original.water])),parent:'meter'});E.record(s,'standard',E.composition(original).complex,source);c.parent=null;}
 E.transfer(s,'iron','mixture1',5);E.transfer(s,'thiocyanate','mixture1',5);E.transfer(s,'water','mixture1',10);
 Object.assign(c,{water:0,solutes:{},parent:null});E.transfer(s,'mixture1','cuvetteA',3);c.parent='meter';E.record(s,'unknown',null,'Mixture');const a=E.analysis(s);assert.ok(a&&!a.extrapolated);assert.ok(Math.abs(a.Kc-890)<30);const first=a.value;s.records.forEach(r=>r.concentration*=2);near(E.estimate(s).value,first*2);assert.equal(equilibriumQuestions(s).length,3);
});
test('equilibrium reservations and existing local profile data survive save reload without charging twice',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},store=createPlayerStore(storage);store.start('Ada','c01-1');await store.transact(p=>{stockAllLabsForTesting(p);p.completed=['filtration'];reserveAttempt(p,'equilibrium');});
 const loaded=createPlayerStore(storage).load().player;assert.equal(loaded.materials['iron-thiocyanate-kit'],99);assert.equal(loaded.attempts.equilibrium.supplies['iron-thiocyanate-kit'],1);assert.deepEqual(loaded.completed,['filtration']);E.createState();assert.equal(createPlayerStore(storage).load().player.materials['iron-thiocyanate-kit'],99);
});

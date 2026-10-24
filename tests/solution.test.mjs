import test from 'node:test';
import assert from 'node:assert/strict';
import {createState,transfer,stir,tare,reading,bulkDose,waterDose,pipetteFill,pipetteDeliver,concentration,totals,outcome,mix,reviewData,stepPhysics,physicsFor,scoop,attach} from '../prototype/solution-model.js';
import {initializeStorage,storeItem,takeItem} from '../prototype/equipment-storage.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
function setup(){const s=createState();return s;}
function prepare(s){transfer(s,'salt','beaker',.584,{dry:true});waterDose(s,'beaker',40);stir(s,'beaker');transfer(s,'beaker','stock',40,{drain:true});waterDose(s,'beaker',5);stir(s,'beaker');transfer(s,'beaker','stock',5.2,{drain:true});for(let i=0;i<8;i++)bulkDose(s,'stock');waterDose(s,'stock',5);s.items.stopper1.parent='stock';mix(s,'stock');s.items.stopper1.parent=null;}
test('complete stock preparation and tenfold dilution conserve grams and mL',()=>{const s=setup();prepare(s);near(s.items.stock.water,100);assert.ok(Math.abs(concentration(s.items.stock)-.1)<.001);pipetteFill(s,'stock');near(s.items.pipette.water,10);pipetteDeliver(s,'dilution');for(let i=0;i<9;i++)bulkDose(s,'dilution');waterDose(s,'dilution',5);s.items.stopper2.parent='dilution';mix(s,'dilution');
 // The stock now holds 90 mL after taking its aliquot; completion remembers preparation volume.
 assert.equal(outcome(s).success,true);near(s.items.dilution.water,100);assert.ok(Math.abs(concentration(s.items.dilution)-.01)<.0001);near(totals(s).water,500);near(totals(s).salt,5);assert.equal(reviewData(s).attempt,true);
});
test('bulk additions pause short of the mark and fine additions are discrete, repeatable and allow overfill',()=>{const s=setup();for(let i=0;i<100;i++)bulkDose(s,'stock');near(s.items.stock.water,95);for(let i=0;i<50;i++)waterDose(s,'stock',.1);near(s.items.stock.water,100);waterDose(s,'stock',.1);near(s.items.stock.water,100.1);});
test('removing solution after overfilling leaves the lower concentration unchanged',()=>{const s=setup();prepare(s);waterDose(s,'stock',10);stir(s,'stock');const c=concentration(s.items.stock);transfer(s,'stock','waste',10);near(s.items.stock.water,100);near(concentration(s.items.stock),c);assert.ok(c<.099);});
test('retained film contains proportional salt and rinsing recovers it without creating material',()=>{const s=setup();transfer(s,'salt','beaker',.584,{dry:true});waterDose(s,'beaker',40);stir(s,'beaker');transfer(s,'beaker','stock',100,{drain:true});near(s.items.beaker.water,.2);assert.ok(s.items.beaker.salt>0);const lost=s.items.beaker.salt;waterDose(s,'beaker',5);stir(s,'beaker');transfer(s,'beaker','stock',100,{drain:true});assert.ok(s.items.beaker.salt<lost/20);near(totals(s).salt,5);});
test('balance taring changes its display and not the amount of salt',()=>{const s=setup();Object.assign(s.items.boat,{x:120,y:442});tare(s);assert.equal(reading(s),'0.000');transfer(s,'salt','boat',.584,{dry:true});assert.equal(reading(s),'0.584');near(totals(s).salt,5);s.items.boat.x=400;assert.equal(reading(s),'-0.750');});
test('undissolved and unmixed stocks cannot masquerade as verified aliquots',()=>{const s=setup();transfer(s,'salt','stock',.584,{dry:true});waterDose(s,'stock',100);assert.equal(pipetteFill(s,'stock'),0);stir(s,'stock');s.items.stock.mixed=false;pipetteFill(s,'stock');pipetteDeliver(s,'dilution');assert.equal(s.aliquotVerified,false);assert.equal(reviewData(s).attempt,false);});
test('partial aliquot, full pipette cap, stopper and wrong final volume have real effects',()=>{const s=setup();prepare(s);pipetteFill(s,'stock',1);near(s.items.pipette.water,1);pipetteFill(s,'stock',20);near(s.items.pipette.water,10);pipetteDeliver(s,'dilution');s.items.stopper2.parent='dilution';assert.equal(waterDose(s,'dilution',10),0);assert.equal(outcome(s).success,false);});
test('overflow accounts for spills, storage preserves contents, finished state freezes actions',()=>{const s=setup();waterDose(s,'stock',150);near(s.items.stock.water,120);near(s.spills[0].water,30);const w=physicsFor(s);storeItem(s,'stock',w);near(s.items.stock.water,120);assert.equal(waterDose(s,'stock',1),0);s.phase='finished';const before=totals(s);assert.equal(transfer(s,'salt','beaker',1,{dry:true}),0);assert.equal(mix(s,'stock'),false);assert.deepEqual(totals(s),before);});
test('spatula portions and fitted funnel/stopper require physical proximity',()=>{const s=setup();Object.assign(s.items.spatula,{x:255,y:385});scoop(s,true);near(s.items.spatula.salt,.001);Object.assign(s.items.spatula,{x:100,y:60});scoop(s);near(s.items.boat.salt,.001);Object.assign(s.items.funnel,{x:520,y:330});assert.ok(attach(s,'funnel'));Object.assign(s.items.stopper1,{x:520,y:390});assert.equal(attach(s,'stopper1'),false);s.items.funnel.parent=null;assert.ok(attach(s,'stopper1'));});
test('gravity and solid contact settle the boat on the balance without lost material',()=>{const s=initializeStorage(createState());const w=physicsFor(s);assert.ok(takeItem(s,'boat',120,350,w));s.held=null;w.release();for(let i=0;i<240;i++)stepPhysics(s,1/60,null);assert.ok(Math.abs(s.items.boat.y-442)<3);near(totals(s).salt,5);});

test('fitted funnel retains a proportional wet film; rinsing transfers solute to its flask',()=>{const s=setup();Object.assign(s.items.funnel,{x:520,y:330});assert.ok(attach(s,'funnel'));transfer(s,'salt','beaker',.584,{dry:true});waterDose(s,'beaker',40);stir(s,'beaker');transfer(s,'beaker','stock',40,{drain:true});near(s.items.funnel.water,.2);const retained=s.items.funnel.salt;assert.ok(retained>0);waterDose(s,'funnel',5);assert.ok(s.items.funnel.salt<retained/20);near(totals(s).water,500);near(totals(s).salt,5);});
test('a discarded unmixed sample does not permanently penalise a later correct aliquot',()=>{const s=setup();prepare(s);s.items.stock.mixed=false;pipetteFill(s,'stock');pipetteDeliver(s,'waste');assert.equal(s.aliquotVerified,true);stir(s,'stock');pipetteFill(s,'stock');pipetteDeliver(s,'dilution');assert.equal(s.aliquotVerified,true);});
test('ordinary pouring cannot substitute for the required measured pipette aliquot',()=>{const s=setup();prepare(s);transfer(s,'stock','dilution',10);waterDose(s,'dilution',90);s.items.stopper2.parent='dilution';mix(s,'dilution');assert.equal(outcome(s).success,false);});

test('beaker settles on the balance, can be tared and weighs its contents',()=>{
 const s=initializeStorage(createState()),w=physicsFor(s);
 Object.assign(s.items.beaker,{x:120,y:300});w.sync();
 for(let i=0;i<240;i++)stepPhysics(s,1/60,null);
 assert.ok(Math.abs(s.items.beaker.y+96-(s.items.balance.y+4))<3);
 assert.equal(reading(s),'50.000');tare(s);assert.equal(reading(s),'0.000');
 waterDose(s,'beaker',10);transfer(s,'salt','beaker',.584,{dry:true});
 assert.equal(reading(s),'10.584');near(totals(s).water,500);near(totals(s).salt,5);
});

test('pouring catches both the visible spout and a centre-aligned receiver',async()=>{
 const {pour}=await import('../prototype/solution-model.js');
 for(const offset of [0,51]){const s=createState();Object.assign(s.items.beaker,{x:520-offset,y:250,water:20});
 assert.equal(pour(s,'beaker',10),10);near(s.items.stock.water,10);
 }
 const s=createState();Object.assign(s.items.boat,{x:355,y:300,salt:.1});
 assert.equal(pour(s,'boat',10),.05);near(s.items.beaker.salt,.05);
});

test('the salt bottle can deliver a dry portion into an open beaker',async()=>{
 const {pour}=await import('../prototype/solution-model.js'),s=createState();
 Object.assign(s.items.salt,{x:355,y:270});
 near(pour(s,'salt',10),.05);near(s.items.beaker.salt,.05);near(totals(s).salt,5);
});

test('a pour can fall from high above an opening without an invisible reach limit',async()=>{
 const {pour}=await import('../prototype/solution-model.js'),s=createState();
 Object.assign(s.items.beaker,{x:520,y:40,water:10});
 near(pour(s,'beaker',10),9.8);near(s.items.stock.water,9.8);near(s.items.beaker.water,.2);
});

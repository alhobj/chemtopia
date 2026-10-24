import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../prototype/conductivity-model.js';
import * as O from '../prototype/colorimetry-model.js';
import * as V from '../prototype/voltaic-model.js';
import {initializeStorage,storeItem,takeItem} from '../prototype/equipment-storage.js';
import {questions} from '../prototype/measurement-review.js';
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} ≠ ${b}`);
function immerse(M,s,id,target,x=0){const o=s.items[id],b=s.items[target];Object.assign(o,{stored:false,parent:null,x:b.x+x,y:b.y-20});assert.ok(M.clip(s,id));}
function conductivity(sample='salt'){const s=C.createState();s.items.meter.on=true;immerse(C,s,'electrodeA',sample,-12);immerse(C,s,'electrodeB',sample,12);C.connectLead(s,'red','electrodeA');C.connectLead(s,'black','electrodeB');return s;}
function cell(){const s=V.createState();immerse(V,s,'zinc','left');immerse(V,s,'copper','right');Object.assign(s.items.bridge,{x:460,y:390});assert.ok(V.fitBridge(s));V.connectLead(s,'red','copper');V.connectLead(s,'black','zinc');return s;}
function seat(s,id='cuvetteA',from='water',ml=3){s.items.meter.lid=false;const old=O.seated(s);if(old)assert.ok(O.remove(s));const c=s.items[id];Object.assign(c,{parent:null,x:820,y:340,stored:false});if(from)O.transfer(s,from,id,ml);assert.ok(O.insert(s,id));c.clean=true;s.items.meter.lid=true;return c;}
function blanked(){const s=O.createState();seat(s);assert.ok(O.blank(s));return s;}
function nativeCalibration(){const s=blanked();O.record(s,'standard',0,'Water');const a=s.items.cuvetteA;O.remove(s);const water=O.take(a,a.water);O.add(s.items.waste,water);for(const c of [.02,.04]){a.water=3;a.solutes.Cu=c*.003;a.solutes.sulfate=c*.003;Object.assign(a,{x:820,y:340});O.insert(s,a.id);s.items.meter.lid=true;O.record(s,'standard',c);s.items.meter.lid=false;O.remove(s);O.add(s.items.waste,O.take(a,a.water));}seat(s,'cuvetteB','unknown');O.record(s,'unknown',null,'Sample');return s;}

test('conductivity compares mobile ions, molecules, pure water and a weak electrolyte',()=>{const s=C.createState(),k=id=>C.conductivity(s.items[id]);assert.ok(k('acid')>k('salt')&&k('salt')>k('weak')&&k('weak')>k('water')*100);near(k('sugar'),k('water'));assert.ok(k('water')>0);});
test('an open conductivity circuit is not reported as zero conductance',()=>{const s=C.createState();assert.equal(C.reading(s).value,null);s.items.meter.on=true;assert.equal(C.reading(s).value,null);assert.equal(C.record(s),null);});
test('conductivity requires two different contacts in the same liquid',()=>{const s=conductivity();assert.ok(C.reading(s).value>0);C.connectLead(s,'black','electrodeA');assert.equal(C.reading(s).value,null);C.connectLead(s,'black','electrodeB');immerse(C,s,'electrodeB','sugar');assert.equal(C.reading(s).value,null);});
test('dry NaCl with intentional probe contact has no mobile-ion conductance',()=>{const s=conductivity('dry'),r=C.reading(s);assert.equal(r.value,0);assert.match(r.status,/Dry solid contact/);assert.ok(C.record(s));});
test('salt dissolves on adding water and conserves analytical amount',()=>{const s=C.createState(),before=C.totals(s);C.transfer(s,'water','dry',10);C.dissolve(s);near(s.items.dry.solidNaCl,0);near(s.items.dry.solutes.NaCl,.005);const after=C.totals(s);near(after.water,before.water);near(after.NaCl+after.solidNaCl,before.NaCl+before.solidNaCl);});
test('conductance changes with probe geometry while derived conductivity stays consistent',()=>{const s=conductivity(),r=C.reading(s);s.items.electrodeB.offset.x=24;C.updateParents(s);const q=C.reading(s);assert.ok(q.value<r.value);near(q.value*q.cellConstant,r.value*r.cellConstant);});
test('diluting strong electrolyte reduces conductivity without destroying solute',()=>{const s=C.createState(),k=C.conductivity(s.items.salt),n=C.totals(s).NaCl;C.transfer(s,'water','salt',40);near(C.totals(s).NaCl,n);assert.ok(C.conductivity(s.items.salt)<k);});
test('carried probe films contaminate the next sample without creating material',()=>{const s=conductivity(),before=C.totals(s);immerse(C,s,'electrodeA','water');assert.ok(s.items.water.solutes.NaCl>0);const after=C.totals(s);near(after.NaCl,before.NaCl);near(after.water,before.water);});
test('probe rinsing sends film and water to waste and preserves ions',()=>{const s=conductivity(),before=C.totals(s);const p=s.items.electrodeA;Object.assign(p,{parent:null,x:180,y:30});Object.assign(s.items.water,{x:280,y:200});assert.ok(C.rinse(s,p.id));near(p.water,0);assert.ok(s.items.waste.solutes.NaCl>0);const after=C.totals(s);near(after.NaCl,before.NaCl);near(after.water,before.water);});
test('conductivity review uses the recorded rounded conductance and geometry',()=>{const s=conductivity();C.record(s);const q=questions(s);near(q[1].fields[0].answer,s.records[0].value*s.records[0].cellConstant);assert.equal(q.length,3);});

test('colorimeter requires a seated filled cuvette and explicit blank',()=>{const s=O.createState();assert.equal(O.blank(s),false);seat(s,'cuvetteA','water',1);assert.equal(O.blank(s),false);assert.equal(O.reading(s).value,null);s.items.meter.lid=false;O.remove(s);O.transfer(s,'water','cuvetteA',2);Object.assign(s.items.cuvetteA,{x:820,y:340});O.insert(s,'cuvetteA');assert.equal(O.reading(s).value,null);assert.ok(O.blank(s));near(O.reading(s).value,0);});
test('lid prevents cuvette removal; storage preserves a contained sample',()=>{const s=blanked();assert.equal(O.remove(s),false);const w=O.physicsFor(s);storeItem(s,'meter',w);assert.ok(s.items.cuvetteA.stored);near(s.items.cuvetteA.water,3);assert.equal(O.reading(s).value,null);});
test('red filter gives more sensitivity for the model blue copper solution',()=>{const s=blanked();seat(s,'cuvetteB','unknown');const red=O.reading(s).value;s.filter='blue';const blue=O.reading(s).value;assert.ok(red>blue*5);assert.match(O.reading(s).status,/Filter changed/);});
test('fingerprints, frosted faces and lid affect measured absorbance',()=>{const s=blanked(),c=seat(s,'cuvetteB','unknown'),clean=O.reading(s).value;c.clean=false;assert.ok(O.reading(s).value>clean);c.clean=true;c.clearFace=false;assert.ok(O.reading(s).value>clean+.2);c.clearFace=true;s.items.meter.lid=false;assert.ok(O.reading(s).value<clean);});
test('an incorrect absorbing blank gives negative absorbance for the solvent',()=>{const s=O.createState();seat(s,'cuvetteA','unknown');O.blank(s);seat(s,'cuvetteB','water');assert.ok(O.reading(s).value<0);});
test('drained cuvettes retain a film that changes the next sample concentration',()=>{const s=O.createState(),c=s.items.cuvetteA;O.transfer(s,'stock',c.id,3);Object.assign(c,{x:390,y:20});O.pour(s,c.id,4);near(c.water,.05);assert.ok(c.solutes.Cu>0);O.transfer(s,'water',c.id,3);assert.ok(O.concentration(c,'Cu')>0);});
test('calibration needs three distinct entered concentrations and fits an intercept',()=>{const rows=[0,.02,.04].map(c=>({type:'standard',concentration:c,absorbance:20*c+.1,filter:'red'}));assert.equal(O.fitCalibration(rows.slice(0,2),'red'),null);assert.equal(O.fitCalibration([rows[0],rows[0],rows[0]],'red'),null);const fit=O.fitCalibration(rows,'red');near(fit.slope,20);near(fit.intercept,.1);near(fit.r2,1);assert.equal(O.fitCalibration(rows,'blue'),null);});
test('unknown estimate uses measured standards rather than hidden model concentration',()=>{const s=nativeCalibration(),e=O.estimate(s);assert.ok(Math.abs(e.value-.035)<.001);const before=e.value;s.records.forEach(r=>r.concentration*=2);near(O.estimate(s).value,before*2);});
test('flat or invalid calibration does not fabricate a sample concentration',()=>{const rows=[0,.02,.04].map(c=>({type:'standard',concentration:c,absorbance:.5,filter:'red'}));assert.equal(O.fitCalibration(rows,'red'),null);const s=blanked();assert.equal(O.record(s,'standard',''),null);assert.equal(O.record(s,'standard',Infinity),null);assert.equal(O.record(s,'standard',-.1),null);});
test('unknown outside the standards is flagged as extrapolation',()=>{const s=nativeCalibration();s.unknownReadings[0].absorbance=1.8;assert.ok(O.estimate(s).extrapolated);});
test('colorimetry transfer and overflow conserve both copper and sulfate',()=>{const s=O.createState(),before=O.totals(s);O.transfer(s,'stock','cuvetteA',10);near(s.items.cuvetteA.water,4);near(s.spills[0].water,6);const after=O.totals(s);for(const k of ['water','Cu','sulfate'])near(after[k],before[k]);});
test('colorimetry review calculation is based on the fitted recorded line',()=>{const s=nativeCalibration(),q=questions(s);near(q[1].fields[0].answer,O.estimate(s).value);assert.match(q[1].prompt,/your fitted/);});

test('a Zn/Cu cell requires wet metal contacts and two meter leads',()=>{const s=V.createState();assert.equal(V.reading(s).voltage,null);assert.equal(V.record(s),null);});
test('equal half-cell concentrations give about 1.10 V; reversed leads reverse its sign',()=>{const s=cell();near(V.reading(s).voltage,1.10);V.connectLead(s,'red','zinc');V.connectLead(s,'black','copper');near(V.reading(s).voltage,-1.10);});
test('open salt bridge can show voltage but cannot sustain load current',()=>{const s=cell();s.items.bridge.parent=null;s.items.bridge.targets=null;near(V.reading(s).voltage,1.10);s.items.meter.loaded=true;const before=V.metalTotals(s);V.stepChemistry(s,60);near(V.reading(s).current,0);near(s.charge,0);assert.deepEqual(V.metalTotals(s),before);});
test('loaded cell has internal voltage drop, zinc dissolution and copper deposition',()=>{const s=cell();s.items.meter.loaded=true;const r=V.reading(s);assert.ok(r.current>0&&r.voltage<1.10);const before=V.metalTotals(s);V.stepChemistry(s,60);assert.ok(s.extent>0);near(s.items.zinc.metalMoles,.03-s.extent);near(s.items.copper.plated,s.extent);near(s.items.left.solutes.nitrate,2*s.extent);near(s.items.right.solutes.K,2*s.extent);near(s.charge,2*V.CELL.F*s.extent);const after=V.metalTotals(s);for(const k of Object.keys(before))near(after[k],before[k]);});
test('ionic charge remains balanced in both half-cells during discharge',()=>{const s=cell();s.items.meter.loaded=true;for(let i=0;i<50;i++)V.stepChemistry(s,60);for(const id of ['left','right']){const o=s.items[id].solutes;near(2*o.Zn+2*o.Cu+o.K-2*o.sulfate-o.nitrate,0);}});
test('both leads on one strip give zero without consuming zinc',()=>{const s=cell();s.items.meter.loaded=true;V.connectLead(s,'black','copper');V.stepChemistry(s,60);near(V.reading(s).voltage,0);near(s.extent,0);});
test('bridge ion reserve limits discharge without negative inventories',()=>{const s=cell();s.items.bridge.K=1e-7;s.items.bridge.nitrate=1e-7;s.items.meter.loaded=true;V.stepChemistry(s,60);assert.ok(s.items.bridge.K>=0&&s.items.bridge.nitrate>=0);near(s.extent,5e-8);V.stepChemistry(s,60);near(s.extent,5e-8);});
test('zinc in copper sulfate displaces copper even with no external leads',()=>{const s=V.createState();immerse(V,s,'zinc','right');const before=V.metalTotals(s);V.stepChemistry(s,60);assert.ok(s.displacement>0&&s.items.zinc.plated>0);assert.equal(V.reading(s).voltage,null);const after=V.metalTotals(s);for(const k of Object.keys(before))near(after[k],before[k]);});
test('half-cell dilution changes the model EMF, not its rounded standard E0',()=>{const s=cell();V.transfer(s,'water','left',50);assert.ok(V.reading(s).emf>V.CELL.E0);near(V.CELL.E0,1.10);});
test('storing the meter disconnects its load and leads',()=>{const s=cell();s.items.meter.loaded=true;storeItem(s,'meter',V.physicsFor(s));V.stepPhysics(s,1/60,null);assert.equal(s.items.meter.loaded,false);assert.equal(s.leads.red,null);});
test('voltaic review labels standard potentials AHL and uses the recorded current',()=>{const s=cell();s.items.meter.loaded=true;V.record(s);const q=questions(s);assert.match(q[2].prompt,/AHL/);near(q[1].fields[0].answer,Math.abs(s.records[0].current)/1000*60/(2*V.CELL.F)*V.CELL.copperMass*1000);});

test('new apparatus has gravity, bench contact and no initial solid overlaps',()=>{for(const M of [C,O,V]){const s=initializeStorage(M.createState()),w=M.physicsFor(s);for(let i=0;i<180;i++)M.stepPhysics(s,1/60,null);const hits=w.overlaps().filter(([a,b])=>a!=='bench'&&b!=='bench');assert.deepEqual(hits,[]);}});
test('finished labs freeze transfer, recording and chemistry',()=>{for(const M of [C,O,V]){const s=M.createState(),before=M.totals(s);s.phase='finished';assert.equal(M.transfer(s,'water',Object.keys(s.items)[0],5),0);assert.equal(M.record(s,'unknown'),null);M.stepChemistry(s,60);near(s.time,0);assert.deepEqual(M.totals(s),before);}});

test('a probe held in liquid carries a real film even without using the clip action',()=>{
 const s=C.createState(),o=s.items.electrodeA,before=C.totals(s);
 Object.assign(o,{x:140,y:420,parent:null});C.stepChemistry(s,.1);near(o.water,.05);assert.ok(o.solutes.NaCl>0);
 Object.assign(o,{x:870,y:420});C.stepChemistry(s,.1);assert.ok(s.items.water.solutes.NaCl>0);
 const after=C.totals(s);near(after.NaCl,before.NaCl);near(after.water,before.water);
});
test('clipping above a shallow liquid does not falsely wet the probe',()=>{
 const s=C.createState();C.transfer(s,'salt','sample',1);immerse(C,s,'electrodeA','sample');
 assert.equal(C.immersed(s,'electrodeA'),null);near(s.items.electrodeA.water,0);
});

test('held dry-solid contacts work without clipping, but wet probe films are not called dry',()=>{
 const s=C.createState();s.items.meter.on=true;const b=s.items.dry;
 for(const [id,x]of [['electrodeA',-12],['electrodeB',12]])Object.assign(s.items[id],{x:b.x+x,y:b.y-6,parent:null});
 C.connectLead(s,'red','electrodeA');C.connectLead(s,'black','electrodeB');
 near(C.reading(s).value,0);assert.equal(C.record(s).cellConstant,null);
 C.add(s.items.electrodeA,C.take(s.items.salt,.05));assert.equal(C.reading(s).value,null);assert.match(C.reading(s).status,/liquid films/);
});

test('filled cuvette volume does not change absorbance at fixed concentration above the beam',()=>{
 const s=blanked(),c=seat(s,'cuvetteB','unknown'),a=O.reading(s).value;
 // Removing a homogeneous portion leaves concentration unchanged.
 s.items.meter.lid=false;O.remove(s);O.add(s.items.waste,O.take(c,.5));
 Object.assign(c,{x:820,y:340});O.insert(s,c.id);s.items.meter.lid=true;near(O.reading(s).value,a);
});

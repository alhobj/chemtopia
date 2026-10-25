import {setArtwork} from './svg-render.js';
import {equipmentArt} from './equipment-art.js';
import {createState,NAMES,physicsFor,detach,placeItem,stepPhysics,stepThermal,toolTarget,active,pour,stir,fitLid,clipProbe,immersed,recordTemperature,balanceReading,recordMass,toggleBurner,outcome,THERMAL,objective,energyBalance} from './calorimetry-model.js';
import {art} from './calorimetry-art.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
import {reviewQuestions,bindReviewQuestions} from './review-questions.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),NS='http://www.w3.org/2000/svg';
const mode=document.body.dataset.calorimetry;
let state=initializeStorage(createState(mode)),selected=null,drag=null,last=0,note='',menu,controlsMarkup=null,flowUntil=0;
const groups=new Map();
for(const id of Object.keys(state.items)){const g=document.createElementNS(NS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',NAMES[id]);g.addEventListener('focus',()=>{if(selected!==id)select(id);});layer.append(g);groups.set(id,g);}
$('equipment').innerHTML=Object.entries(NAMES).filter(([id])=>state.items[id]).map(([id,n])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${n}</button>`).join('');
function context(){const o=state.items[selected];if(!active(o))return {label:'Select apparatus',buttons:[],disabled:true,hint:'Select equipment to see its controls.'};
 if(o.kind==='thermometer')return{label:state.initial?'Record final temperature':'Record initial temperature',buttons:[['initial','Record initial'],['final','Record final'],['clip','Clip to vessel rim']],hint:'Immerse the tip or clip it near a vessel. The displayed reading responds gradually.'};
 if(o.kind==='rod')return{label:'Stir',buttons:[],hint:'Place the rod beside or in the vessel; Space stirs.'};
 if(o.kind==='lid')return{label:o.parent?'Remove lid':'Fit lid',buttons:[],hint:'Place near the cup mouth and press Space. Remove before pouring.'};
 if(o.kind==='burner')return{label:o.on?'Extinguish burner':'Light burner',buttons:[],hint:'Weigh before and after. Position beneath the aluminium calorimeter before heating.'};
 if(o.kind==='balance')return{label:'Record mass',buttons:[],hint:'Place the burner on the pan, then record its mass. Both before and after readings are needed.'};
 if(o.kind==='clampStand')return{label:'Move support into position',buttons:[],disabled:true,hint:'Place the aluminium can on the support; the burner fits below the raised platform.'};
 return{label:'Pour 10 mL',buttons:[['fine','Pour 1 mL']],hint:'Position above an open receiver. Each press adds one finite portion and stops.'};
}
function render(){
 for(const [id,g]of groups){const o=state.items[id];g.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);setArtwork(g,equipmentArt(o,art(o,state),mode,state));g.classList.toggle('selected',id===selected);}
 if(selected)layer.append(groups.get(selected));
 $('streams').innerHTML=performance.now()<flowUntil?state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" fill="none" stroke="#79aebb" stroke-width="4" stroke-dasharray="5 3"/>`).join(''):'';
 $('spills').innerHTML=state.spills.map(p=>`<ellipse cx="${p.x}" cy="523" rx="${Math.min(65,12+p.water)}" ry="6" fill="#84bcc7"/>`).join('');
 const c=context(),o=state.items[selected];$('selected-name').textContent=NAMES[selected]||'Nothing selected';$('action').disabled=state.phase!=='working'||!active(o)||Boolean(c.disabled);$('action').textContent=c.label;
 const controls=c.buttons.map(([id,label])=>`<button class="secondary" data-command="${id}" ${state.phase!=='working'?'disabled':''}>${label}</button>`).join('');if(controlsMarkup!==controls){$('fine-controls').innerHTML=controls;controlsMarkup=controls;}
 $('action-note').textContent=note||c.hint;
 $('instrument').innerHTML=o?.kind==='thermometer'?`<p>Temperature: <strong>${o.reading.toFixed(2)} °C</strong></p><p>${immersed(state)?NAMES[immersed(state).id]:'Air / tip not immersed'}</p>`:o?.kind==='balance'?`<p>Mass: <strong>${balanceReading(state).toFixed(3)} g</strong></p>`:o&&'water'in o?`<p>${o.water.toFixed(2)} mL${o.kind==='cup'||o.kind==='can'?o.mixed?' · mixed':' · not stirred':''}</p>`:o?.kind==='burner'?'<p>Weigh the burner before and after heating.</p>':'';
 for(const b of $('equipment').children){b.disabled=state.phase!=='working';b.setAttribute('aria-pressed',String(b.dataset.equipment===selected));}
 $('finish').disabled=state.phase!=='working';menu?.sync();
}
function select(id){if(state.phase!=='working')return;selected=id;note='';render();}
const coords=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(bench.getScreenCTM().inverse());
bench.addEventListener('pointerdown',e=>{const id=e.target.closest('[data-id]')?.dataset.id;if(!id||e.button!==0||state.phase!=='working')return;select(id);const p=coords(e),o=state.items[id];drag={id,start:p,dx:p.x-o.x,dy:p.y-o.y,active:false};bench.focus({preventScroll:true});bench.setPointerCapture(e.pointerId);e.preventDefault();});
bench.addEventListener('pointermove',e=>{if(!drag)return;const p=coords(e);if(!drag.active){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<4)return;detach(state,drag.id);drag.active=true;}physicsFor(state).moveHeld(drag.id,Math.max(85,Math.min(915,p.x-drag.dx)),Math.max(20,Math.min(510,p.y-drag.dy)));render();});
function release(e){if(!drag)return;const id=drag.id;if(drag.active&&menu?.wantsStore(e)&&menu.store(id))selected=null;else if(drag.active)placeItem(state);drag=null;render();}
bench.addEventListener('pointerup',release);bench.addEventListener('pointercancel',release);
function action(command='normal'){
 if(state.phase!=='working')return;const o=state.items[selected];if(!active(o))return;note='';state.flow=[];
 if(o.kind==='thermometer'){
  if(command==='clip')note=clipProbe(state)?'Thermometer clipped to the rim.':'Place the tip near the vessel to clip it.';
  else{const which=command==='initial'?'initial':command==='final'?'final':state.initial?'final':'initial',r=recordTemperature(state,which);note=r?`${which==='initial'?'Initial':'Final'} temperature recorded: ${r.temperature.toFixed(2)} °C.`:'Immerse the thermometer tip before recording.';}
 }else if(o.kind==='rod'){const to=toolTarget(state,o.id);note=to&&stir(state,to.id)?'Stirred.':'Move the rod beside a liquid vessel.';}
 else if(o.kind==='lid'){if(o.parent){o.parent=null;o.y-=35;physicsFor(state).sync();note='Lid removed. Move it aside.';}else note=fitLid(state)?'Lid fitted.':'Move the lid near the cup mouth.';}
 else if(o.kind==='burner')note=toggleBurner(state)?(o.on?'Burner lit.':'Burner extinguished.'):'No fuel remains.';
 else if(o.kind==='balance'){const r=recordMass(state);note=r?`Mass recorded: ${r.mass.toFixed(3)} g.`:'Place the burner on the balance pan.';}
 else note=pour(state,o.id,command==='fine'?1:10)>0?'One portion transferred.':'Place above an open receiver; closed lids cannot receive liquid.';
 if(state.flow.length)flowUntil=performance.now()+450;render();
}
$('action').addEventListener('click',()=>action());$('fine-controls').addEventListener('click',e=>{const command=e.target.closest('[data-command]')?.dataset.command;if(command)action(command);});
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
$('equipment').addEventListener('click',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id)select(id);});
$('equipment').addEventListener('focusin',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id&&id!==selected)select(id);});
$('restart').addEventListener('click',()=>{state=initializeStorage(createState(mode));selected=null;drag=null;note='';flowUntil=0;$('result').hidden=true;$('result').innerHTML='';render();});
$('finish').addEventListener('click',()=>{
 release();const r=outcome(state);state.phase='finished';if(state.items.burner)state.items.burner.on=false;render();const combustion=mode==='combustion';
 const usable=Boolean(state.initial&&state.final&&r.delta>0&&r.mass>0&&(combustion?r.fuel>0:r.reacted>0)),dt=usable?r.delta:10,mass=usable?r.mass:100,fuel=usable?r.fuel:.5,moles=usable?r.reacted:.05,q=(mass*THERMAL.waterCp+(combustion?THERMAL.aluminiumMass*THERMAL.aluminiumCp:0))*dt,enthalpy=combustion?-q/(fuel/THERMAL.ethanolMolarMass)/1000:-q/moles/1000;
 const questions=[
 {prompt:combustion?'Why does the water become warmer when ethanol burns?':'Why does the temperature rise when HCl and NaOH react?',answers:combustion?['Combustion releases energy; some heats the water and aluminium.','Combustion absorbs energy; some heats the water and aluminium.','Combustion stores energy; the water supplies all the released heat.']:['Neutralisation releases energy into the solution and the cup.','Neutralisation absorbs energy from the solution and the cup.','Neutralisation creates energy without changing chemical stores.'],hint:'Distinguish the exothermic chemical reaction from the measured surroundings.'},
 {prompt:`${usable?'Use your recorded attempt.':'Supplied calculation example:'} ${mass.toFixed(3)} g of ${combustion?'water':'solution'} warms by ${dt.toFixed(3)} °C. ${combustion?'The aluminium container has mass 50.0 g and specific heat capacity 0.900 J g⁻¹ K⁻¹. Include it.':'For this estimate neglect the cup heat capacity.'} Use c = 4.18 J g⁻¹ K⁻¹ for the liquid. Calculate the heat gained.`,fields:[{id:'value',label:'Heat gained (J)',answer:q,tolerance:Math.max(1,q*.005)}],hint:combustion?'Use Q = (m(water)c(water) + m(Al)c(Al))ΔT.':'Use Q = mcΔT; liquid mass is the total solution mass, not just one reactant.'},
 {prompt:combustion?`The burner loses ${fuel.toFixed(5)} g of ethanol. Use your calculated heat and M(ethanol) = 46.07 g mol⁻¹ to calculate the apparent molar enthalpy of combustion. Include the sign.`:`${moles.toFixed(6)} mol reacts. Use your calculated heat to find the apparent molar enthalpy of neutralisation. Include the sign.`,fields:[{id:'value',label:'Apparent molar enthalpy (kJ mol⁻¹)',answer:enthalpy,tolerance:Math.max(.1,Math.abs(enthalpy)*.005)}],hint:'The reaction loses the heat gained by the surroundings: ΔH = −Q/n. Convert J to kJ.'}
 ];
 const panel=$('result');panel.hidden=false;const e=energyBalance(state);panel.innerHTML=`<h2>${r.success?'Calorimetry readings recorded.':'Review your calorimetry.'}</h2><p>${r.success?'The calculation uses your recorded readings, including any heat loss or thermometer lag.':'Check the immersed thermometer, initial/final readings, stirring, material amounts and burner weighings. The questions below use a labelled supplied example if this attempt has incomplete readings.'}</p><table><thead><tr><th>Reading</th><th>Value</th></tr></thead><tbody><tr><td>Initial temperature</td><td>${state.initial?.temperature.toFixed(2)??'Not recorded'} °C</td></tr><tr><td>Final temperature</td><td>${state.final?.temperature.toFixed(2)??'Not recorded'} °C</td></tr><tr><td>Temperature rise</td><td>${r.delta.toFixed(3)} °C</td></tr><tr><td>Final liquid mass (density approximation)</td><td>${r.mass.toFixed(2)} g</td></tr>${combustion?`<tr><td>Recorded burner mass loss</td><td>${r.fuel.toFixed(5)} g</td></tr><tr><td>Aluminium mass</td><td>50.0 g</td></tr>`:`<tr><td>Amount reacting between temperature readings</td><td>${r.reacted.toFixed(6)} mol</td></tr>`}</tbody></table><p>${combustion?'Some combustion energy misses the can, some warms aluminium and some escapes to air. The fuel mass loss is not the water mass.':'Use the total solution mass and the limiting reacting amount. The cup also warms; a water-only estimate omits that heat.'} A delayed reading or weak mixing can lower the measured rise. Recorded temperatures are not replaced with a perfect peak.</p><p>Model assumptions: density 1.00 g mL⁻¹, liquid specific heat 4.18 J g⁻¹ K⁻¹, ambient 20 °C. ${combustion?'Aluminium specific heat 0.900 J g⁻¹ K⁻¹. Ethanol fuel-energy and capture coefficients are teaching-model defaults, not a calibrated burner prediction.':'Cup heat capacity is a model 12 J K⁻¹; full heat-of-dilution chemistry is not represented.'} ${state.vapour>0?'Some water boiled away; a simple Q = mcΔT estimate misses phase-change energy.':''}</p><details><summary>Model energy accounting</summary><p>Reaction/fuel release: ${e.generated.toFixed(1)} J; stored sensible heat: ${e.stored.toFixed(1)} J; heat to air: ${e.air.toFixed(1)} J; flame energy missing the can: ${e.bypass.toFixed(1)} J; water-vapour energy: ${e.boiling.toFixed(1)} J.</p></details>${reviewQuestions(mode,questions)}`;
 bindReviewQuestions(mode,()=>{state.phase='complete';},questions);panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);stepThermal(state,dt);render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

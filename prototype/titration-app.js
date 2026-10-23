import {createState,modeFor,namesFor,INDICATORS,physicsFor,detach,placeItem,stepPhysics,toolTarget,point,active,pour,fillPipette,deliverPipette,attach,fillBurette,dispense,setInitial,swirl,addIndicator,probeReading,recordTrial,outcome,reading,transfer,drain,BASE_CONCENTRATION} from './titration-model.js';
import {art,buretteView} from './titration-art.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
import {reviewQuestions,bindReviewQuestions} from './review-questions.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),NS='http://www.w3.org/2000/svg';
let state=initializeStorage(createState()),selected=null,drag=null,last=0,note='',menu,controlsMarkup=null,flowUntil=0;
const groups=new Map();
for(const id of Object.keys(state.items)){const g=document.createElementNS(NS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',namesFor(state)[id]);g.addEventListener('focus',()=>{if(selected!==id)select(id);});layer.append(g);groups.set(id,g);}
$('equipment').innerHTML=Object.entries(namesFor(state)).map(([id,n])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${n}</button>`).join('');
function context(){const o=state.items[selected];if(!active(o))return{label:'Select apparatus',buttons:[],disabled:true,hint:'Select equipment to see its controls.'};
 if(o.kind==='burette')return{label:'Deliver 1 mL',buttons:[['fine','Deliver 0.1 mL'],['drop','One drop · 0.05 mL'],['initial','Record initial reading'],['trial','Record final / trial'],['fit','Clamp to stand']],hint:'Each delivery stops on its own. Prime into waste before recording the initial reading.'};
 if(o.kind==='pipette')return{label:o.water>0?'Deliver aliquot':'Fill · 25.00 mL',buttons:[],hint:o.water>0?'Move over the conical flask and deliver.':'Put the tip inside the sample and fill.'};
 if(o.kind==='conical')return{label:'Swirl to mix',buttons:[['trial','Record final / trial'],['drain','Empty into nearby waste']],hint:o.mixed?'Mixed. Observe the indicator or immerse the probe.':'Swirl before judging colour or reading pH.'};
 if(o.kind==='dropper')return{label:'Add indicator drop',buttons:[],hint:'Hold the dropper over the conical flask.'};
 if(o.kind==='probe')return{label:'Read pH',buttons:[],hint:'Immerse the tip in mixed liquid.'};
 if(o.kind==='transferFunnel')return{label:o.parent?'Remove funnel':'Fit to burette',buttons:[],hint:'Fit near the burette mouth. Remove it before recording readings.'};
 if(o.id==='base')return{label:'Fill burette · 10 mL',buttons:[['pour','Pour one portion']],hint:'Fit the filling funnel, then bring the titrant bottle beside the burette. Each press transfers up to 10 mL.'};
 if(o.id==='water')return{label:'Rinse nearby vessel · 5 mL',buttons:[['pour','Pour one portion']],hint:'Position above or beside the vessel; rinse liquid stays in that vessel until emptied.'};
 return{label:'Pour one portion',buttons:o.id==='waste'?[]:[['drain','Empty into nearby waste']],hint:'Place above a receiver and transfer a finite portion.'};
}
function render(){
 for(const [id,g]of groups){const o=state.items[id];g.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);g.innerHTML=art(o,state);g.classList.toggle('selected',id===selected);}
 if(selected)layer.append(groups.get(selected));
 $('streams').innerHTML=performance.now()<flowUntil?state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" fill="none" stroke="#79aebb" stroke-width="4" stroke-dasharray="5 3"/>`).join(''):'';
 $('spills').innerHTML=state.spills.map(p=>`<ellipse cx="${p.x}" cy="523" rx="${Math.min(65,12+p.water)}" ry="6" fill="#84bcc7"/>`).join('');
 const c=context(),o=state.items[selected];$('selected-name').textContent=namesFor(state)[selected]||'Nothing selected';$('action').disabled=state.phase!=='working'||!active(o)||Boolean(c.disabled);$('action').textContent=c.label;
 const controls=c.buttons.map(([id,label])=>`<button class="secondary" data-command="${id}" ${state.phase!=='working'?'disabled':''}>${label}</button>`).join('');if(controlsMarkup!==controls){$('fine-controls').innerHTML=controls;controlsMarkup=controls;}
 $('action-note').textContent=note||c.hint;
 $('instrument').innerHTML=o?.kind==='burette'?buretteView(state):o?.kind==='probe'?`<p>pH: <strong>${probeReading(state)?.toFixed(2)??'Immerse in mixed liquid'}</strong></p>`:o&&'water'in o?`<p>${o.water.toFixed(2)} mL${o.kind==='conical'?o.mixed?' · mixed':' · swirl before reading':''}</p>`:'';
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
 if(command==='initial')note=setInitial(state)?`Initial reading recorded: ${reading(state).toFixed(2)} mL.`:'Take the burette out of storage first.';
 else if(command==='trial')note=recordTrial(state)?'Final reading recorded. Finish reviews this trial.':'Record an initial reading and deliver titrant first.';
 else if(command==='fit')note=attach(state,'burette')?'Burette clamped.':'Move the burette near the stand clamp.';
 else if(command==='drain')note=drain(state,o.id)>0?'Emptied into waste.':'Move the waste beaker beside this vessel first.';
 else if(o.kind==='burette'){
  if(!state.links.some(l=>l.b==='burette'))note=attach(state,'burette')?'Burette clamped. Select a delivery size when ready.':'Move near the stand clamp or hold upright to deliver.';
  else{const n=dispense(state,command==='drop'?.05:command==='fine'?.1:1);note=n>0?`Released ${n.toFixed(2)} mL from the barrel. Swirl before judging the endpoint.`:'The burette is empty or not upright.';}
 }else if(o.kind==='transferFunnel'){
  if(o.parent){o.parent=null;o.y-=30;physicsFor(state).sync();note='Funnel removed. Move it aside.';}else note=attach(state,o.id)?'Funnel fitted. Bring the titrant beside the burette to fill.':'Move closer to the burette mouth.';
 }else if(o.kind==='pipette'){
  const to=toolTarget(state,o.id),tip=point(o,0,105);
  if(!to)note='Position the tip in a source or above a receiving vessel.';
  else if(o.water>0)note=`Delivered ${deliverPipette(state,to.id).toFixed(2)} mL.`;
  else if(tip.y<to.y+20)note='Lower the tip into the solution before filling.';
  else note=`Filled ${fillPipette(state,to.id).toFixed(2)} mL. Lift above a receiver to deliver.`;
 }else if(o.kind==='conical')note=swirl(state)?'Mixed by swirling.':'Add a sample before swirling.';
 else if(o.kind==='dropper')note=addIndicator(state)?'Indicator added. Swirl to observe its colour.':'Position the dropper above the flask.';
 else if(o.kind==='probe')note=probeReading(state)===null?'Immerse the probe tip and swirl the solution first.':`pH ${probeReading(state).toFixed(2)}.`;
 else if(o.id==='base'&&command!=='pour')note=fillBurette(state)>0?'One portion added via the funnel.':'Fit the funnel and bring the titrant bottle closer to the burette.';
 else if(o.id==='water'&&command!=='pour'){
  const to=toolTarget(state,'water')||Object.values(state.items).filter(v=>active(v)&&v.id!=='water'&&'water'in v&&Math.hypot(v.x-o.x,v.y-o.y)<150).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];
  note=to&&transfer(state,'water',to.id,5)>0?'Rinse water added. Empty the vessel into waste if required.':'Move beside the vessel to rinse.';
 }else note=pour(state,o.id)>0?'One portion transferred.':'Position above an open receiver.';
 if(state.flow.length)flowUntil=performance.now()+450;render();
}
$('action').addEventListener('click',()=>action());$('fine-controls').addEventListener('click',e=>{const command=e.target.closest('[data-command]')?.dataset.command;if(command)action(command);});
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
$('equipment').addEventListener('click',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id)select(id);});
$('equipment').addEventListener('focusin',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id&&id!==selected)select(id);});
function resetAttempt(){state=initializeStorage(createState($('sample-select').value));selected=null;drag=null;note='';flowUntil=0;$('result').hidden=true;$('result').innerHTML='';
 const m=modeFor(state),names=namesFor(state);$('objective-heading').textContent=m.formula+' titration';$('objective-text').textContent=`Titrate a 25.00 mL ${m.formula} sample with 0.100 mol dm⁻³ ${m.titrant}. Record your burette readings. ${m.scope==='AHL extension'?'Weak-acid/base extension (AHL).':''}`;
 for(const [id,g]of groups)g.setAttribute('aria-label',names[id]);for(const b of $('equipment').children)b.firstChild.textContent=names[b.dataset.equipment];document.body.dataset.titrationMode=state.mode;render();}
$('restart').addEventListener('click',resetAttempt);$('sample-select').addEventListener('change',resetAttempt);
$('finish').addEventListener('click',()=>{
 release();state.phase='finished';render();const r=outcome(state),t=r.trial,m=modeFor(state),valid=t&&t.source==='acid'&&t.sampleVolume>0&&t.titre>0;
 const initial=valid?t.initial:1.2,final=valid?t.final:21.2,sample=valid?t.sampleVolume:25,answer=BASE_CONCENTRATION*(final-initial)/sample;
 const questions=[
 {prompt:`Why does this titration reveal the ${m.name.toLowerCase()} concentration?`,answers:[`Equal moles of ${m.formula} and ${m.titrant} react at the equivalence point.`,`Equal volumes of ${m.formula} and ${m.titrant} react at every measured point.`,`Equal masses of ${m.formula} and ${m.titrant} remain throughout the reaction.`],hint:`${m.reaction} has a 1:1 mole ratio.`},
 {prompt:`The initial burette reading is ${initial.toFixed(2)} mL and the final reading is ${final.toFixed(2)} mL. Calculate the titre. ${valid?'These are your recorded readings.':'These are supplied example readings.'}`,fields:[{id:'value',label:'Titre (mL)',answer:final-initial,tolerance:.011}],hint:'Subtract initial from final; a burette scale increases downwards.'},
 {prompt:`Using that titre, 0.100 mol dm⁻³ ${m.titrant} and a ${sample.toFixed(2)} mL sample aliquot, calculate the apparent ${m.formula} concentration. ${valid?'This assumes your recorded point is a valid endpoint; mistakes can bias this estimate.':'Use the supplied homogeneous example.'}`,fields:[{id:'value',label:`${m.formula} concentration (mol dm⁻³)`,answer,tolerance:Math.max(1e-8,answer*.005)}],hint:`The reaction is 1:1: c(sample) = c(${m.titrant}) × titre / aliquot volume.`}];
 const panel=$('result');panel.hidden=false;panel.innerHTML=`<h2>${r.success?'Titration endpoint recorded.':'Review your titration.'}</h2><p>${r.success?'Your final mixed sample is in the indicator endpoint region.':'Check the sample volume, titrant dilution, mixing, the initial reading, tip priming, receiver position and final endpoint. Wrong attempts remain available for calculation practice.'}</p><table><thead><tr><th>Trial</th><th>Initial (mL)</th><th>Final (mL)</th><th>Titre (mL)</th><th>Final pH</th></tr></thead><tbody>${state.trials.map((t,i)=>`<tr><td>${i+1}</td><td>${t.initial.toFixed(2)}</td><td>${t.final.toFixed(2)}</td><td>${t.titre.toFixed(2)}</td><td>${t.mixed?t.pH?.toFixed(2)??'—':'Not mixed'}</td></tr>`).join('')}</tbody></table><p>The equivalence point is a stoichiometric condition. The indicator endpoint is its observed colour-change region. An overrun can give a sample concentration that is too high. Water in a clean receiving flask changes pH and volume, but not the sample moles in its measured aliquot. ${m.component==='acetate'?'Ethanoate hydrolysis makes this equivalence point alkaline; phenolphthalein is supplied.':m.component==='ammonia'?'Ammonium dissociation makes this equivalence point acidic; methyl red is supplied.':'This strong-acid/strong-base equivalence point is neutral at 25 °C.'}</p><p>Model: acid/base mass and charge balance with water, ethanoic acid/ethanoate and ammonia/ammonium equilibria; ideal concentrations at 25 °C, additive volumes. Rounded Kₐ(CH₃COOH) = 1.8 × 10⁻⁵, Kᵦ(NH₃) = 1.8 × 10⁻⁵; no heat or instrument-noise model.</p>${reviewQuestions('titration',questions)}`;
 bindReviewQuestions('titration',()=>{state.phase='complete';},questions);panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

import {equipmentArt} from './equipment-art.js';
import {createState,NAMES,physicsFor,detach,placeItem,stepPhysics,toolTarget,point,active,pour,scoop,tare,stir,bulkDose,waterDose,pipetteFill,pipetteDeliver,attach,mix,stoppered,solid,concentration,outcome,reviewData} from './solution-model.js';
import {art,meniscus} from './solution-art.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
import {reviewQuestions,bindReviewQuestions} from './review-questions.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),NS='http://www.w3.org/2000/svg';
let state=initializeStorage(createState()),selected=null,drag=null,last=0,note='',menu,controlsMarkup=null,spatulaPortion=.05,flowUntil=0;
const groups=new Map();
for(const id of Object.keys(state.items)){const g=document.createElementNS(NS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',NAMES[id]);g.addEventListener('focus',()=>{if(selected!==id)select(id);});layer.append(g);groups.set(id,g);}
$('equipment').innerHTML=Object.entries(NAMES).map(([id,n])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${n}</button>`).join('');
function washNearby(o){const w=state.items.water;return active(w)&&Math.abs(o.x-w.x)<200&&Math.abs(o.y-w.y)<200;}
function context(){const o=state.items[selected];if(!active(o))return {label:'Select apparatus',buttons:[],hint:'Select equipment to see its controls.'};
 if(o.kind==='balance')return{label:'Tare balance',buttons:[],hint:'Place a weighing boat or beaker on the pan before taring.'};
 if(o.kind==='spatula')return{label:o.salt>0?'Add salt to vessel':`Load ${spatulaPortion.toFixed(3)} g`,buttons:[],hint:o.salt>0?'Move above a boat or vessel; Space adds this portion.':'Place beside the NaCl bottle to load a portion.'};
 if(o.kind==='rod')return{label:'Stir to dissolve',buttons:[],hint:'Place the rod beside or inside the beaker; Space stirs.'};
 if(o.kind==='transferFunnel'||o.kind==='stopper')return{label:o.parent?'Remove fitting':'Fit to flask',buttons:[],hint:'Place near the flask mouth. Space fits or removes it.'};
 if(o.kind==='pipette')return{label:o.water>0?'Deliver aliquot':'Fill pipette · 10.00 mL',buttons:o.water>0?[]:[['partial','Take 1.00 mL']],hint:o.water>0?`${o.water.toFixed(2)} mL loaded. Place over a receiver; Space delivers once.`:'Put the tip inside the stock solution, then fill. No timing needed.'};
 if(o.kind==='wash')return{label:'Add water · up to 10 mL',buttons:[['one','Add 1 mL'],['drop','Add 0.1 mL']],hint:'Place the wash bottle above a vessel. Each press makes one addition.'};
 if(o.kind==='bottle')return{label:'Pour salt · 0.050 g',buttons:[],hint:'Hold above an open vessel; Space transfers one portion. Use the spatula for finer weighing.'};
 if(o.kind==='flask'&&stoppered(state,o.id))return{label:'Invert and mix',buttons:[],hint:o.mixed?'Mixed. Remove the stopper before taking an aliquot.':'Space mixes the stoppered flask.'};
 const buttons=washNearby(o)?[['water','Add water · up to 10 mL'],['one','Add 1 mL'],['drop','Add 0.1 mL']]:[];
 return{label:o.water>0?'Pour one portion':'Transfer solid',buttons,hint:'Move above a receiver to transfer. For water buttons, place the wash bottle beside this vessel.'};
}
function render(){
 for(const [id,g]of groups){const o=state.items[id];g.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);g.innerHTML=equipmentArt(o,art(o,state),'solution',state);g.classList.toggle('selected',id===selected);}
 if(selected)layer.append(groups.get(selected));
 $('streams').innerHTML=performance.now()<flowUntil?state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" fill="none" stroke="${f.solid?'#d9c49b':'#79aebb'}" stroke-width="4" stroke-dasharray="5 3"/>`).join(''):'';
 $('spills').innerHTML=state.spills.map(p=>`<ellipse cx="${p.x}" cy="523" rx="${Math.min(65,12+p.water)}" ry="6" fill="${p.water>0?'#84bcc7':'#e4d7b4'}"/>`).join('');
 const c=context(),o=state.items[selected];$('selected-name').textContent=NAMES[selected]||'Nothing selected';$('action').disabled=state.phase!=='working'||!active(o)||Boolean(c.disabled);$('action').textContent=c.label;
 const controls=c.buttons.map(([id,label])=>`<button class="secondary" data-command="${id}" ${state.phase!=='working'?'disabled':''}>${label}</button>`).join('');if(controlsMarkup!==controls){$('fine-controls').innerHTML=controls;controlsMarkup=controls;}
 $('portion-control').hidden=o?.kind!=='spatula'||state.phase!=='working';$('action-note').textContent=note||c.hint;
 $('instrument').innerHTML=o?.kind==='flask'?meniscus(o)+(o.mixed?'<p>Mixed</p>':'<p>Not mixed</p>'):o&&'water'in o&&o.kind!=='wash'?`<p>${o.water.toFixed(2)} mL · ${o.salt.toFixed(3)} g NaCl${solid(o)>1e-9?' (solid remains)':''}</p>`:'';
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
 if(['water','one','drop'].includes(command)||o.kind==='wash'){
  const to=o.kind==='wash'?toolTarget(state,o.id):o;
  if(!to||o.kind!=='wash'&&!washNearby(o)){note='Place the wash bottle beside the receiving vessel.';}
  else{const n=command==='one'?waterDose(state,to.id,1):command==='drop'?waterDose(state,to.id,.1):bulkDose(state,to.id);note=n>0?`Added ${n.toFixed(2)} mL water. ${to.kind==='flask'&&to.water>=95?'Use 1 mL or 0.1 mL additions near the mark.':''}`:'Bulk additions pause at 95 mL. Use the smaller additions to continue.';}
 }else if(o.kind==='balance'){tare(state);note='Balance tared.';}
 else if(o.kind==='spatula')note=scoop(state,command==='fine'?true:command==='medium'?'medium':spatulaPortion===.001?true:spatulaPortion===.01?'medium':false);
 else if(o.kind==='rod'){const to=toolTarget(state,o.id);note=to&&stir(state,to.id)?'Stirred; check for remaining solid.':'Place the rod beside a vessel containing water.';}
 else if(o.kind==='transferFunnel'||o.kind==='stopper'){
  if(o.parent){o.parent=null;o.y-=35;physicsFor(state).sync();note='Fitting removed. Move it aside.';}
  else note=attach(state,o.id)?'Fitted to flask.':'Move closer to an open flask mouth; remove the funnel before fitting a stopper.';
 }else if(o.kind==='pipette'){
  const to=toolTarget(state,o.id);if(!to)note='Place the tip in a source or over a receiver.';
  else if(o.water>0){const n=pipetteDeliver(state,to.id);note=`Delivered ${n.toFixed(2)} mL to ${NAMES[to.id]}.`;}
  else{const p=point(o,0,95);if(p.y<to.y+10||p.y>to.y+125)note='Lower the tip inside the liquid vessel to fill.';else{const n=pipetteFill(state,to.id,command==='partial'?1:10);note=n>0?`Filled ${n.toFixed(2)} mL. Lift over the receiving flask to deliver.`:'Cannot fill: check the source, stopper and undissolved solid.';}}
 }else if(o.kind==='flask'&&stoppered(state,o.id))note=mix(state,o.id)?'Solution mixed by inversion.':'Dissolve all solid before mixing.';
 else{const n=pour(state,o.id,10);note=n>0?'One portion transferred. Repeat as needed; rinsing recovers the retained film.':'Place the source above an open receiver. No timed pour is needed.';}
 if(state.flow.length)flowUntil=performance.now()+450;render();
}
$('portion-size').addEventListener('change',e=>{spatulaPortion=Number(e.target.value);note='';render();});
$('action').addEventListener('click',()=>action());$('fine-controls').addEventListener('click',e=>{const command=e.target.closest('[data-command]')?.dataset.command;if(command)action(command);});
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
$('equipment').addEventListener('click',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id)select(id);});
$('equipment').addEventListener('focusin',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id&&id!==selected)select(id);});
$('restart').addEventListener('click',()=>{state=initializeStorage(createState());selected=null;drag=null;note='';flowUntil=0;$('result').hidden=true;$('result').innerHTML='';render();});
$('finish').addEventListener('click',()=>{
 release();state.phase='finished';render();const r=outcome(state),data=reviewData(state),questions=[
 {prompt:'Why fill to the final solution volume instead of adding 100 mL of water?',answers:['Concentration uses final solution volume, including the dissolved solute.','Concentration uses added solvent volume, excluding the dissolved solute.','Concentration uses the empty flask volume, regardless of the added solute.'],hint:'The denominator in c = n/V is final solution volume.'},
 {prompt:'Calculate the mass of NaCl needed for 100.0 mL of 0.100 mol dm⁻³ solution. M(NaCl) = 58.44 g mol⁻¹.',fields:[{id:'value',label:'NaCl mass (g)',answer:.5844,tolerance:.0006}],hint:'Convert mL to dm³, then use m = cVM.'},
 {prompt:data.prompt,fields:[{id:'value',label:'Diluted concentration (mol dm⁻³)',answer:data.answer,tolerance:Math.max(1e-8,data.answer*.005)}],hint:'Use n = m/M and c = n/V, or c₂ = c₁V₁/V₂ for the supplied example.'}];
 const panel=$('result');panel.hidden=false;panel.innerHTML=`<h2>${r.success?'Stock and dilution prepared.':'Review your preparation.'}</h2><table><thead><tr><th>Preparation</th><th>Volume (mL)</th><th>Dissolved NaCl (g)</th><th>Concentration (mol dm⁻³)</th><th>Mixed</th></tr></thead><tbody>${['stock','dilution'].map(id=>{const o=state.items[id];return `<tr><td>${NAMES[id]}</td><td>${o.water.toFixed(2)}</td><td>${o.dissolved.toFixed(6)}</td><td>${concentration(o).toPrecision(5)}</td><td>${o.mixed?'Yes':'No'}${solid(o)>1e-9?' · solid remains':''}</td></tr>`;}).join('')}</tbody></table><p>Stock preparation volume before sampling: ${r.stockVolume.toFixed(2)} mL. The table shows volume remaining after sampling.</p><p>${r.success?'Both products meet the volume and concentration targets.':'Check mass, final volume, dissolution, quantitative transfer and mixing. Removing solution after overfilling does not restore its concentration.'}${r.verified?'':' The stock was not mixed before sampling; the aliquot concentration is not verified.'}</p><p>Model assumptions: dilute solution, additive transferred volumes, constant room temperature. Balance resolution is 0.001 g; precision is not a complete uncertainty estimate.</p>${reviewQuestions('solution',questions)}`;
 bindReviewQuestions('solution',()=>{state.phase='complete';},questions);panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

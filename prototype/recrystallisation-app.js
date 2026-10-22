import {EPS,createState,NAMES,detach,placeItem,pour,stepPhysics,stepChemistry,physicsFor,outcome} from './recrystallisation-model.js';
import {art} from './recrystallisation-art.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),NS='http://www.w3.org/2000/svg';
let state=initializeStorage(createState()),selected=null,drag=null,pouring=false,last=0,note='',menu;
const amount=n=>Math.abs(n)<EPS?'0':n.toPrecision(3);
const groups=new Map();
for(const id of Object.keys(state.items)){const g=document.createElementNS(NS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',NAMES[id]);g.addEventListener('focus',()=>{if(selected!==id)select(id);});layer.append(g);groups.set(id,g);}
$('equipment').innerHTML=Object.entries(NAMES).map(([id,n])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${n}</button>`).join('');
function render(){
 for(const [id,g]of groups){const o=state.items[id];const p=o.parent?state.items[o.parent]:null;g.setAttribute('transform',p?.angle?`translate(${p.x} ${p.y}) rotate(${p.angle}) translate(${o.x-p.x} ${o.y-p.y})`:`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);g.setAttribute('aria-description',o.parent?'Seated in '+NAMES[o.parent]:'');g.innerHTML=art(o);g.classList.toggle('selected',id===selected);}
 if(selected)layer.append(groups.get(selected));
 $('spills').innerHTML=state.spills.map(p=>`<g><ellipse cx="${p.x}" cy="525" rx="${Math.min(70,10+p.water*100)}" ry="8" fill="#86bdc6" opacity="${p.water>0?.65:0}"/>${p.sand>EPS?`<ellipse cx="${p.x}" cy="523" rx="${Math.min(40,8+p.sand*100)}" ry="4" fill="#b38041"/>`:''}${p.raw+p.crystals+p.dissolved>0?`<path d="M${p.x-15} 522h30m-25 -3h20" stroke="#e0d8bd" stroke-width="4"/>`:''}</g>`).join('');
 $('streams').innerHTML=state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" stroke="#82bdc8" stroke-width="5"/>`).join('');
 const o=state.items[selected];$('selected-name').textContent=NAMES[selected]||'Nothing selected';
 $('action').disabled=state.phase!=='working'||!o||o.stored||!['beaker','heater'].includes(o.kind);
 $('action').textContent=o?.kind==='heater'?(o.on?'Stop heating':'Start heating'):o?(pouring?'Stop pouring':'Start pouring'):'Select apparatus';
 $('action').setAttribute('aria-pressed',String(o?.on||pouring));
 $('action-note').textContent=note||(o?.kind==='heater'?'Space switches heating on or off.':'Hold a vessel with room to tilt. Space starts/stops pouring.');
 for(const b of $('equipment').children){b.disabled=state.phase!=='working';b.setAttribute('aria-pressed',String(b.dataset.equipment===selected));}
 $('finish').disabled=state.phase!=='working';menu?.sync();
}
function stopPour(){if(pouring&&selected)physicsFor(state).tilt(selected,0);pouring=false;}
function select(id){if(state.phase!=='working')return;stopPour();selected=id;note='';render();}
const coords=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(bench.getScreenCTM().inverse());
bench.addEventListener('pointerdown',e=>{const id=e.target.closest('[data-id]')?.dataset.id;if(!id||e.button!==0||state.phase!=='working')return;select(id);const p=coords(e),o=state.items[id];drag={id,start:p,dx:p.x-o.x,dy:p.y-o.y,active:false};bench.focus({preventScroll:true});bench.setPointerCapture(e.pointerId);e.preventDefault();});
bench.addEventListener('pointermove',e=>{if(!drag)return;const p=coords(e);if(!drag.active){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<4)return;detach(state,drag.id);drag.active=true;}physicsFor(state).moveHeld(drag.id,Math.max(85,Math.min(1335,p.x-drag.dx)),Math.max(30,Math.min(510,p.y-drag.dy)));render();});
function release(e){if(!drag)return;const id=drag.id;stopPour();if(drag.active&&menu?.wantsStore(e)&&menu.store(id))selected=null;else if(drag.active)placeItem(state,id);drag=null;render();}
bench.addEventListener('pointerup',release);bench.addEventListener('pointercancel',release);
function action(){if(state.phase!=='working')return;const o=state.items[selected];if(!o||o.stored)return;
 if(o.kind==='heater')o.on=!o.on;
 else if(o.kind!=='beaker')return;else if(pouring)stopPour();else if(drag?.active&&physicsFor(state).tilt(o.id,35))pouring=true;else note='Hold the vessel and leave room for it to tilt.';
 render();
}
$('action').addEventListener('click',action);
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
$('equipment').addEventListener('click',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id)select(id);});
$('equipment').addEventListener('focusin',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id&&id!==selected)select(id);});
window.addEventListener('blur',()=>{stopPour();render();});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPour();render();}});
$('restart').addEventListener('click',()=>{state=initializeStorage(createState());selected=null;drag=null;pouring=false;note='';$('result').hidden=true;$('result').innerHTML='';render();});
$('finish').addEventListener('click',()=>{
 release();stopPour();const r=outcome(state);state.phase='finished';state.items.heater.on=false;state.flow=[];render();
 const panel=$('result');panel.hidden=false;
 panel.innerHTML=`<p class="eyebrow">RECRYSTALLISATION REVIEW</p><h2>${r.success?'Recrystallised solid collected on clean paper.':'Recrystallised product has not been collected on clean paper yet.'}</h2><p>Wet-crystal solute recovery: <strong id="recovery">${(100*r.yield).toFixed(1)}%</strong>. This is the potassium nitrate in collected crystals relative to starting potassium nitrate, not a dry product mass.</p><p>Water retained on filter paper makes the collected product wet. Mother liquor still contains dissolved potassium nitrate.</p><table><thead><tr><th>Location</th><th>Water</th><th>Starting solid</th><th>Dissolved solute</th><th>Recrystallised solid</th><th>Sand</th></tr></thead><tbody>${[...Object.values(state.items).filter(o=>'raw'in o).map(o=>[NAMES[o.id],o]),...state.spills.map((o,i)=>['Spill '+(i+1),o])].map(([n,o])=>`<tr><td>${n}</td>${['water','raw','dissolved','crystals','sand'].map(k=>`<td>${amount(o[k])}</td>`).join('')}</tr>`).join('')}</tbody></table><p>These are qualitative model amounts. Starting solid caught without first dissolving is not counted as recrystallised product. Retained sand or undissolved starting solid makes a filter's product impure.</p>${r.success?`<form id="explanation"><fieldset><legend>Why did crystals form when the hot filtrate cooled?</legend>${['The solute is less soluble in colder water, so some dissolved material forms crystals while some remains in the mother liquor.','Cooling turns the sand into potassium nitrate.','All the dissolved solute must leave the water whenever it cools.'].map((t,i)=>`<label class="answer-option"><input type="radio" name="answer" value="${i}" required><span>${t}</span></label>`).join('')}</fieldset><button class="primary">Check explanation</button><p id="question-feedback" aria-live="polite"></p></form>`:'<p>Review dissolution, hot filtration, cooling, and which filter contains the product. Restart to try another sequence.</p>'}`;
 $('explanation')?.addEventListener('submit',e=>{e.preventDefault();const correct=new FormData(e.target).get('answer')==='0';$('question-feedback').textContent=correct?'Activity complete. Cooling reduces solubility; filtration separates wet crystals from mother liquor. Recrystallisation is different from evaporating all the solvent.':'Consider how solubility changes with temperature and why solute remains in the mother liquor. Choose another answer.';if(correct)state.phase='complete';});
 panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);stepChemistry(state,dt);if(pouring)pour(state,selected,.25*dt);render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

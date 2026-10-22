import {createState,NAMES,material,detach,placeItem,pour,stepPhysics,stepChemistry,physicsFor,outcome} from './evaporation-model.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),NS='http://www.w3.org/2000/svg';
let state=initializeStorage(createState()),selected=null,drag=null,pouring=false,last=0,note='',menu;
const amount=n=>n===0?'0':n.toPrecision(3);
const groups=new Map(),stroke='stroke="#354f60" stroke-width="3" stroke-linejoin="round"';
for(const id of Object.keys(state.items)){const g=document.createElementNS(NS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',NAMES[id]);g.addEventListener('focus',()=>{if(selected!==id)select(id);});layer.append(g);groups.set(id,g);}
$('equipment').innerHTML=Object.entries(NAMES).map(([id,n])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${n}</button>`).join('');
function art(o){
 if(o.kind==='heater')return `<rect x="-60" width="120" height="58" rx="9" fill="#d4ded5" ${stroke}/><path d="M-52 5H52" stroke="${o.on?'#d49150':'#92a3a0'}" stroke-width="8"/><circle cx="30" cy="34" r="12" fill="#506d72"/><circle cx="-32" cy="33" r="5" fill="${o.on?'#dc9459':'#879b93'}"/><text x="-3" y="39" text-anchor="middle" font-size="12" fill="#35515b">${o.on?'ON':'OFF'}</text><rect class="select-outline" x="-70" y="-10" width="140" height="80" rx="6"/>`;
 const m=material(o),basin=o.kind==='basin',w=basin?160:o.id==='source'?92:78,h=basin?80:o.id==='source'?112:96;
 const top=h-8-(h-20)*Math.min(1,(o.water+o.salt)/o.capacity);
 const outline=basin?'M-80 0Q-65 80-40 80H40Q65 80 80 0Z':`M${-w/2} 0V${h-8}Q${-w/2} ${h} ${-w/2+8} ${h}H${w/2-8}Q${w/2} ${h} ${w/2} ${h-8}V0Z`;
 return `<defs><clipPath id="inside-${o.id}"><path d="${outline}"/></clipPath></defs><path d="${outline}" fill="${basin?'#f0ead8':'url(#glass)'}" ${stroke}/><g clip-path="url(#inside-${o.id})">${o.water>0?`<rect x="${-w/2+5}" y="${top}" width="${w-10}" height="${h-top}" fill="url(#liquid)" opacity=".7"/><path d="M${-w/2} ${top}H${w/2}" stroke="#87bdc5" stroke-width="2"/>`:''}${Array.from({length:Math.min(45,Math.ceil(m.solid/.12*40))},(_,i)=>`<rect x="${(i*17%66)-33}" y="${h-16-(i*7%12)}" width="5" height="4" rx="1" fill="#fffdf1" stroke="#c7c0aa" stroke-width=".6"/>`).join('')}</g><path d="M${-w/2} 0H${w/2}" stroke="#8d9990" stroke-width="3"/><rect class="select-outline" x="${-w/2-9}" y="-10" width="${w+18}" height="${h+25}" rx="6"/>${basin?`<text id="basin-state" class="experiment-readout" x="0" y="-18" text-anchor="middle">${m.state}</text>`:''}`;
}
function render(){
 for(const [id,g]of groups){const o=state.items[id];g.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);g.innerHTML=art(o);g.classList.toggle('selected',id===selected);}
 if(selected)layer.append(groups.get(selected));
 $('spills').innerHTML=state.spills.map(p=>`<g><ellipse cx="${p.x}" cy="525" rx="${Math.min(70,10+p.water*100)}" ry="8" fill="#86bdc6" opacity="${p.water>0?.65:0}"/>${p.salt>0?`<path d="M${p.x-15} 522h30m-25 -3h20" stroke="#e0d8bd" stroke-width="4"/>`:''}</g>`).join('');
 const b=state.items.basin;
 $('streams').innerHTML=state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" stroke="${f.water>0?'#82bdc8':'#d6c9a6'}" stroke-width="5"/>`).join('')+(state.evaporating?`<path d="M${b.x-20} ${b.y-8}q-16 -16 0 -32t0 -32m35 44q16 -16 0 -32t0 -32" stroke="#c6d5ce" stroke-width="5" stroke-dasharray="6 8" fill="none"/>`:'');
 const o=state.items[selected];$('selected-name').textContent=NAMES[selected]||'Nothing selected';
 $('action').disabled=state.phase!=='working'||!o||o.stored;
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
bench.addEventListener('pointermove',e=>{if(!drag)return;const p=coords(e);if(!drag.active){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<4)return;detach(state,drag.id);drag.active=true;}physicsFor(state).moveHeld(drag.id,Math.max(85,Math.min(915,p.x-drag.dx)),Math.max(30,Math.min(510,p.y-drag.dy)));render();});
function release(e){if(!drag)return;const id=drag.id;stopPour();if(drag.active&&menu?.wantsStore(e)&&menu.store(id))selected=null;else if(drag.active)placeItem(state);drag=null;render();}
bench.addEventListener('pointerup',release);bench.addEventListener('pointercancel',release);
function action(){if(state.phase!=='working')return;const o=state.items[selected];if(!o||o.stored)return;
 if(o.kind==='heater')o.on=!o.on;
 else if(pouring)stopPour();else if(drag?.active&&physicsFor(state).tilt(o.id,35))pouring=true;else note='Hold the vessel and leave room for it to tilt.';
 render();
}
$('action').addEventListener('click',action);
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
$('equipment').addEventListener('click',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id)select(id);});
$('equipment').addEventListener('focusin',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id&&id!==selected)select(id);});
window.addEventListener('blur',()=>{stopPour();render();});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPour();render();}});
$('restart').addEventListener('click',()=>{state=initializeStorage(createState());selected=null;drag=null;pouring=false;note='';$('result').hidden=true;$('result').innerHTML='';render();});
$('finish').addEventListener('click',()=>{
 release();stopPour();const r=outcome(state);state.phase='finished';state.items.heater.on=false;state.evaporating=false;state.flow=[];render();
 const panel=$('result');panel.hidden=false;
 panel.innerHTML=`<p class="eyebrow">EVAPORATION REVIEW</p><h2>${r.success?'Dry salt recovered in the basin.':'Dry salt recovery is not complete.'}</h2><p>Basin: ${r.state}. Dry salt recovery: <strong id="recovery">${(r.yield*100).toFixed(1)}%</strong> of starting salt.</p><p>Amounts below are qualitative model amounts, not balance readings.</p><table><thead><tr><th>Location</th><th>Water</th><th>Salt</th></tr></thead><tbody>${Object.values(state.items).filter(o=>'water'in o).map(o=>`<tr><td>${NAMES[o.id]}${o.stored?' (stored)':''}</td><td>${amount(o.water)}</td><td>${amount(o.salt)}</td></tr>`).join('')}<tr><td>Bench spills</td><td>${amount(r.spills.water)}</td><td>${amount(r.spills.salt)}</td></tr><tr><td>Evaporated water</td><td>${amount(r.vapour)}</td><td>0.000</td></tr></tbody></table><p>${r.success?'Water left as vapour; the non-volatile salt remained.':'Visible salt with remaining water is wet residue, not dry recovered salt. Compare the basin, other vessels and spills.'}</p>${r.success?`<form id="explanation"><fieldset><legend>Why does salt remain when this solution is heated?</legend>${['Water evaporates while sodium chloride is non-volatile under these conditions.','The water turns into salt as it is heated.','Both salt and water evaporate in the same proportion.'].map((t,i)=>`<label class="answer-option"><input type="radio" name="answer" value="${i}" required><span>${t}</span></label>`).join('')}</fieldset><button class="primary">Check explanation</button><p id="question-feedback" aria-live="polite"></p></form>`:''}`;
 $('explanation')?.addEventListener('submit',e=>{e.preventDefault();const correct=new FormData(e.target).get('answer')==='0';$('question-feedback').textContent=correct?'Activity complete. Water changes to vapour. Salt remains; evaporation is a physical separation.':'Salt is not created by heating, and it does not leave with the water in this model. Choose another answer.';if(correct)state.phase='complete';});
 panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);stepChemistry(state,dt);if(pouring)pour(state,selected,.25*dt);render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

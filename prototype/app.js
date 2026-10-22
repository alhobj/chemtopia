import {answerOptions} from './answer-options.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
import {createState,NAMES,moveItem,detach,placeItem,pour,outcome,stepPhysics,holdItem,dragItem,releaseItem,tiltItem,physicsFor,EPS} from './model.js';
const $=id=>document.getElementById(id);
const bench=$('bench'),layer=$('apparatus'),spillLayer=$('spills'),streams=$('streams');
let state=initializeStorage(createState()),selected=null,drag=null,placement=null,pouring=false,last=0,actionBlocked=false;
let menu;
const groups=new Map();
const ORDER=['stand','source','receiverA','receiverB','funnel','paper'];
const SVG='http://www.w3.org/2000/svg';
for(const id of ORDER){
 const g=document.createElementNS(SVG,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',NAMES[id]);layer.append(g);groups.set(id,g);
}
$('equipment').innerHTML=Object.entries(NAMES).map(([id,name])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${name}</button>`).join('');
const dots=(amount,initial,width,height,offsetY=0)=>Array.from({length:Math.ceil(Math.min(1,amount/initial)*30)},(_,i)=>{
 const x=((i*37+13)%97)/97*(width-12)-width/2+6,y=((i*53+7)%89)/89*Math.max(3,height-7)+offsetY+4;
 return `<rect x="${x}" y="${y}" width="3.2" height="2.4" rx=".6" fill="${i%2?'#b38041':'#d4ac68'}"/>`;
}).join('');
function beakerArt(o){
 const h=o.id==='source'?112:96,w=o.id==='source'?92:78,level=(o.water+o.sand)/o.capacity,fillH=Math.max(0,(h-16)*level),fillY=h-8-fillH;
 return `<ellipse cx="5" cy="${h+7}" rx="${w/2+7}" ry="7" fill="#324b4318"/>
 <defs><clipPath id="inside-${o.id}"><path d="M${-w/2+5} 5H${w/2-5}V${h-12}Q${w/2-5} ${h-5} ${w/2-12} ${h-5}H${-w/2+12}Q${-w/2+5} ${h-5} ${-w/2+5} ${h-12}Z"/></clipPath></defs>
 <path d="M${-w/2} 0H${w/2-8}L${w/2+5} -4L${w/2} 7V${h-10}Q${w/2} ${h} ${w/2-12} ${h}H${-w/2+12}Q${-w/2} ${h} ${-w/2} ${h-10}Z" fill="url(#glass)" stroke="#354f60" stroke-width="3" stroke-linejoin="bevel"/>
 <g clip-path="url(#inside-${o.id})">${fillH>0?`<rect x="${-w/2}" y="${fillY}" width="${w}" height="${fillH+3}" fill="url(#liquid)"/><ellipse cx="0" cy="${fillY}" rx="${w/2}" ry="3.5" fill="#b3e0e4" stroke="#72b6c1"/>`:''}${dots(o.sand,.12,w-4,fillH,fillY)}</g>
 <path d="M${-w/2+7} 13V${h-16}" stroke="#fffdf4" stroke-width="4" opacity=".8"/><path d="M${w/2-11} 18V${h-18}" stroke="#91b9be" stroke-width="2" opacity=".7"/>
 <path d="M${-w/2-3} 0H${w/2-8}L${w/2+5} -4" stroke="#354f60" stroke-width="3" fill="none"/>
 <path d="M${-w/2+8} ${h-3}H${w/2-12}" stroke="#e2f4ef" stroke-width="3"/><rect class="select-outline" x="${-w/2-9}" y="-14" width="${w+24}" height="${h+25}" rx="7"/>`;
}
function art(o){
 if(o.kind==='beaker')return beakerArt(o);
 if(o.kind==='stand')return `<ellipse cx="-8" cy="7" rx="60" ry="10" fill="#324b4318"/><path d="M-43 -7H16L35 4L27 16H-48L-57 6Z" fill="#4c616e" stroke="#304454" stroke-width="3"/><path d="M-43 -7H16L35 4H-57Z" fill="#7d929b"/><rect x="-5" y="-231" width="10" height="226" rx="3" fill="url(#metal)" stroke="#304454" stroke-width="2.5"/><path d="M0 -172H58" stroke="#334b5c" stroke-width="9"/><ellipse cx="90" cy="-172" rx="30" ry="9" fill="none" stroke="#334b5c" stroke-width="5"/><path d="M62 -176H1" stroke="#a9bec1" stroke-width="3"/><rect x="-12" y="-183" width="23" height="22" rx="3" fill="#4b626d" stroke="#304454" stroke-width="2"/><circle cy="-172" r="4" fill="#d8d8bf"/><rect class="select-outline" x="-63" y="-245" width="200" height="272" rx="7"/>`;
 if(o.kind==='funnel')return `<path d="M-57 0H57L9 48V78H-9V48Z" fill="url(#glass)" stroke="#354f60" stroke-width="3" stroke-linejoin="bevel"/><ellipse cy="0" rx="58" ry="10" fill="#dbf3f0" fill-opacity=".6" stroke="#354f60" stroke-width="3"/><path d="M-45 10L-5 45V70" stroke="#f8fff9" stroke-width="4" fill="none" opacity=".9"/><path d="M9 48L45 9" stroke="#91bbc5" stroke-width="3" fill="none"/><rect class="select-outline" x="-70" y="-18" width="140" height="110" rx="7"/>`;
 return `<path d="M-44 0Q0 -14 44 0L0 38Z" fill="#fff8df" stroke="#8b8e7e" stroke-width="2"/><ellipse cy="0" rx="44" ry="8" fill="#fffdf0" stroke="#8b8e7e" stroke-width="2"/><path d="M-33 2L0 34L29 2" fill="none" stroke="#d5d2b8" stroke-width="2"/>
 ${o.sand>EPS?`<path d="M-22 8Q0 1 22 8L0 29Z" fill="#bb904f"/>${dots(o.sand,.12,34,13,7)}`:''}<rect class="select-outline" x="-55" y="-17" width="110" height="69" rx="7"/>`;
}
function render(){
 for(const id of ORDER){const o=state.items[id],g=groups.get(id);const parent=o.parent?state.items[o.parent]:null;const angle=o.angle||0;g.setAttribute('transform',parent?.angle?`translate(${parent.x} ${parent.y}) rotate(${parent.angle}) translate(${o.x-parent.x} ${o.y-parent.y})`:`translate(${o.x} ${o.y}) rotate(${angle})`);g.innerHTML=art(o);g.classList.toggle('selected',id===selected);g.classList.toggle('lifted',drag?.id===id||placement?.id===id);g.setAttribute('aria-disabled',String(state.phase!=='working'));}
 if(selected)layer.append(groups.get(selected));
 spillLayer.innerHTML=state.spills.map(o=>`<g>${o.water>EPS?`<ellipse cx="${o.x}" cy="${o.y}" rx="${Math.min(70,12+o.water*100)}" ry="${Math.min(16,4+o.water*28)}" fill="#6caab6" opacity=".65"/>`:''}${o.sand>EPS?`<g transform="translate(${o.x} ${o.y-9})">${dots(o.sand,.12,70,12)}</g>`:''}</g>`).join('');
 streams.innerHTML=[...(pouring?state.flow:[]),...state.passiveFlow].map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" stroke="${f.sand?'#8bb9ba':'#70b6c7'}" stroke-width="6" opacity=".85" stroke-linecap="round"/>`).join('');
 $('selected-name').textContent=selected?NAMES[selected]:'Nothing selected';
 $('pour').disabled=state.phase!=='working'||(state.items[selected]?.stored||state.items[selected]?.kind!=='beaker');
 $('pour').classList.toggle('active',pouring);
 $('pour').setAttribute('aria-pressed',String(pouring));
 $('pour').innerHTML=`${pouring?'Stop pouring':'Start pouring'} <span aria-hidden="true">↓</span>`;
 $('pour-state').textContent=state.waterBlocked?'Pour paused: place an upright receiver with room below the outlet. Water stays in the vessel.':actionBlocked?'Leave room for the beaker to tilt.':state.items[selected]?.kind==='beaker'?'Press Space to start or stop pouring. Hold the beaker above a receiver while dragging.':'Select a beaker to use this control.';
 for(const b of $('equipment').querySelectorAll('button')){b.setAttribute('aria-pressed',String(b.dataset.equipment===selected));b.disabled=state.phase!=='working';}
 $('finish').disabled=state.phase!=='working';menu?.sync();
}
function stopPour(){if(pouring&&selected)tiltItem(state,selected,0);pouring=false;state.flow=[];render();}
function select(id){if(state.phase!=='working')return;if(placement&&placement.id!==id)finishPlacement();stopPour();selected=id;actionBlocked=false;render();}
function coords(e){return new DOMPoint(e.clientX,e.clientY).matrixTransform(bench.getScreenCTM().inverse());}
function clamp(o,x,y){return {x:Math.max(65,Math.min(935,x)),y:Math.max(o.kind==='stand'?260:65,Math.min(o.kind==='stand'?510:o.kind==='beaker'?430:475,y))};}
function beginPlacement(id){
 if(placement?.id===id)return;
 if(placement)placeItem(state,placement.id);
 const o=state.items[id];placement={id,x:o.x,y:o.y,parent:o.parent};detach(state,id);holdItem(state,id);
}
function finishPlacement(){if(placement){placeItem(state,placement.id);releaseItem(state);placement=null;}render();}
bench.addEventListener('pointerdown',e=>{
 const id=e.target.closest('[data-id]')?.dataset.id;if(!id||state.phase!=='working'||e.button!==0)return;
 select(id);groups.get(id).focus({preventScroll:true});const p=coords(e),o=state.items[id];drag={id,dx:p.x-o.x,dy:p.y-o.y,start:p,active:false};bench.setPointerCapture(e.pointerId);e.preventDefault();render();
});
bench.addEventListener('pointermove',e=>{if(!drag)return;actionBlocked=false;const p=coords(e);if(!drag.active){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<4)return;beginPlacement(drag.id);drag.active=true;}const o=state.items[drag.id],pos=clamp(o,p.x-drag.dx,p.y-drag.dy);dragItem(state,o.id,pos.x,pos.y);render();});
function release(e){if(drag){const id=drag.id;stopPour();if(drag.active&&menu?.wantsStore(e)){menu.store(id);placement=null;selected=null;drag=null;render();}else{drag=null;finishPlacement();}}}
bench.addEventListener('pointerup',release);
bench.addEventListener('pointercancel',()=>{stopPour();drag=null;finishPlacement();});
$('equipment').addEventListener('focusin',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id&&id!==selected)select(id);});
$('equipment').addEventListener('click',e=>{const id=e.target.closest('[data-equipment]')?.dataset.equipment;if(id){finishPlacement();select(id);}});
for(const [id,g] of groups)g.addEventListener('focus',()=>{if(state.phase==='working'&&selected!==id)select(id);});
function togglePour(){
 if(state.phase!=='working'||(state.items[selected]?.stored||state.items[selected]?.kind!=='beaker'))return;
 if(state.items[selected]?.stored)return;if(pouring){stopPour();return;}
 if(!tiltItem(state,selected,35)){tiltItem(state,selected,0);actionBlocked=true;render();return;}
 pouring=true;actionBlocked=false;render();
}
document.addEventListener('keydown',e=>{
 if(e.code!=='Space'||state.phase!=='working')return;
 // Keep native Space behaviour for form answers and other buttons.
 const control=e.target.closest?.('button,input,select,textarea,[contenteditable="true"]');
 if(control&&control.id!=='pour'&&!control.dataset.equipment)return;
 e.preventDefault();if(!e.repeat)togglePour();
});
$('pour').addEventListener('click',togglePour);
window.addEventListener('blur',()=>{if(pouring)stopPour();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&pouring)stopPour();});
$('restart').addEventListener('click',()=>{pouring=false;drag=null;placement=null;state=initializeStorage(createState());selected=null;actionBlocked=false;$('result').hidden=true;$('result').innerHTML='';render();});
const description=(water,sand)=>water>EPS&&sand>EPS?'water and sand':water>EPS?'water':sand>EPS?'sand':'empty';
$('finish').addEventListener('click',()=>{
 stopPour();finishPlacement();const result=outcome(state);state.phase='finished';state.passiveFlow=[];render();
 const panel=$('result');panel.hidden=false;
 panel.innerHTML=`<p class="eyebrow">EXPERIMENT REVIEW</p><h2>${result.success?'Your materials are separated.':'The separation is not complete.'}</h2>
 ${!result.success?'<p>Compare where the sand and water ended up. Restart to try again.</p>':''}
 <div class="outcomes">${result.containers.map(o=>`<span>${NAMES[o.id]}: ${description(o.water,o.sand)}</span>`).join('')}<span>Filter paper: ${result.paperSand>EPS?'wet sand':'no sand'}</span><span>Bench: ${description(result.spilledWater,result.spilledSand)}</span></div>
 ${result.success?`<form id="explanation"><fieldset><legend>Why did filtration separate this mixture?</legend>${answerOptions([
 'The insoluble sand was retained by the filter paper while water passed through.',
 'The water evaporated during filtration.',
 'The sand dissolved and passed through the paper with the water.'
 ])}</fieldset><button class="primary" type="submit">Check explanation <span>→</span></button><p id="question-feedback" class="question-feedback" aria-live="polite"></p></form>`:''}`;
 $('explanation')?.addEventListener('submit',e=>{
  e.preventDefault();const answer=new FormData(e.target).get('answer'),feedback=$('question-feedback');
  if(answer==='0'){feedback.textContent='Activity complete. Insoluble sand particles were retained by the filter paper while water passed through. The recovered sand is wet.';state.phase='complete';e.target.querySelector('button').disabled=true;}
  else feedback.textContent='Insoluble sand particles are retained by the filter paper while water passes through. Choose another answer to complete your explanation.';
 });
 panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;const moved=stepPhysics(state,dt,drag?.active?drag.id:null),didPour=pouring;if(pouring){pour(state,selected,.32*dt);if(state.items[selected].water+state.items[selected].sand<=EPS){tiltItem(state,selected,0);pouring=false;state.flow=[];}}if(moved||didPour)render();requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);beginPlacement(id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

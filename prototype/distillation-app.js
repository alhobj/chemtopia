import {answerOptions} from './answer-options.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
import {createState,NAMES,worldPoint,ports,hosePoint,connectHose,placeItem,detach,dragApparatus,physicsFor,pour,stepPhysics,stepChemistry,outcome,EPS} from './distillation-model.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),svgNS='http://www.w3.org/2000/svg';
document.body.classList.add('distillation-page');bench.append($('hoses'));bench.append($('streams'));
let state=initializeStorage(createState()),selected=null,drag=null,pouring=false,last=0,blocked=false;
let menu;
const groups=new Map();
for(const id of Object.keys(state.items)){
 const g=document.createElementNS(svgNS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',NAMES[id]);layer.append(g);groups.set(id,g);
 g.addEventListener('focus',()=>{if(selected!==id)select(id);});
}
$('equipment').innerHTML=Object.entries(NAMES).map(([id,name])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${name}</button>`).join('');
const stroke='stroke="#354f60" stroke-width="3" stroke-linejoin="round"';
function vesselArt(o){
 if(o.kind==='flask'){
  const level=(o.water+o.acetone)/o.capacity,top=140-Math.min(88,level*88);
  return `<defs><clipPath id="flask-liquid"><circle cy="94" r="42"/></clipPath></defs><path d="M-12 0V47A46 46 0 1 0 12 47V0Z" fill="url(#glass)" ${stroke}/><g clip-path="url(#flask-liquid)"><rect x="-46" y="${top}" width="92" height="140" fill="url(#liquid)"/><path d="M-46 ${top}H46" stroke="#a9dce1" stroke-width="3"/></g><path d="M-16 0H16M-8 7V49" fill="none" stroke="#d5efeb" stroke-width="4"/><rect class="select-outline" x="-55" y="-12" width="110" height="165" rx="6"/><text class="experiment-readout" x="-44" y="161">${state.vapourVisible?'Boiling':o.temperature>20?'Warm':'Unheated'}</text>`;
 }
 const h=o.id==='source'?112:96,w=o.id==='source'?92:78,fill=(h-16)*Math.min(1,(o.water+o.acetone)/o.capacity),top=h-8-fill;
 return `<path d="M${-w/2} 0H${w/2-8}L${w/2+4} -4L${w/2} 8V${h-9}Q${w/2} ${h} ${w/2-10} ${h}H${-w/2+10}Q${-w/2} ${h} ${-w/2} ${h-9}Z" fill="url(#glass)" ${stroke}/>${fill>0?`<rect x="${-w/2+6}" y="${top}" width="${w-12}" height="${fill}" rx="3" fill="url(#liquid)"/><path d="M${-w/2+6} ${top}H${w/2-6}" stroke="#b9e1e3" stroke-width="3"/>`:''}<path d="M${-w/2+8} 12V${h-12}" stroke="#f8fffa" stroke-width="4"/><rect class="select-outline" x="${-w/2-10}" y="-12" width="${w+20}" height="${h+25}" rx="6"/>`;
}
function art(o){
 if(o.kind==='fillingFunnel')return `<path d="M-40 0H40L9 36V76H-9V36Z" fill="url(#glass)" ${stroke}/><ellipse rx="40" ry="7" fill="#dbf3f0" fill-opacity=".6" ${stroke}/><rect class="select-outline" x="-49" y="-12" width="98" height="98" rx="6"/>`;

 if('acetone'in o)return vesselArt(o);
 if(o.kind==='clampStand'){
  const right=o.id==='support2',cx=right?-195:90,cy=right?-148:-162;
  return `<path d="M${right?-25:-65} -8H${right?57:17}L${right?65:25} 16H${right?-25:-65}Z" fill="#5d7580" ${stroke}/><rect x="-5" y="-231" width="10" height="230" rx="3" fill="url(#metal)" ${stroke}/><path d="M0 ${cy}H${cx+(right?29:-29)}" fill="none" ${stroke}/><ellipse cx="${cx}" cy="${cy}" rx="26" ry="9" fill="none" stroke="#354f60" stroke-width="4"/><circle cy="${cy}" r="7" fill="#91a8aa" ${stroke}/><rect class="select-outline" x="${right?-230:-76}" y="-245" width="${right?310:210}" height="275" rx="6"/>`;
 }
 if(o.kind==='heater')return `<rect x="-60" width="120" height="58" rx="9" fill="#d4ded5" ${stroke}/><path d="M-52 5H52" stroke="${o.on?'#d49150':'#92a3a0'}" stroke-width="8"/><circle cx="31" cy="34" r="12" fill="#506d72"/><circle cx="-32" cy="33" r="5" fill="${o.on?'#dc9459':'#879b93'}"/><text x="-4" y="39" text-anchor="middle" font-size="12" fill="#35515b">${o.on?'ON':'OFF'}</text><rect class="select-outline" x="-70" y="-10" width="140" height="80" rx="6"/>`;
 if(o.kind==='head')return `<path d="M-12 0V60H12V55H70V43H12V0Z" fill="url(#glass)" ${stroke}/><path d="M-7 5V51M18 47H65" stroke="#f8fffa" stroke-width="3"/><rect class="select-outline" x="-24" y="-12" width="108" height="85" rx="6"/>`;
 if(o.kind==='thermometer')return `<rect x="-5" width="10" height="65" rx="5" fill="#d9eeee" ${stroke}/><path d="M0 58V${58-38*(o.temperature-20)/80}" stroke="#bd8862" stroke-width="3"/><circle cy="58" r="3" fill="#bd8862"/><rect x="-14" y="12" width="28" height="6" rx="2" fill="#55727a"/><path d="M-3 20H1M-3 30H1M-3 40H1M-3 50H1" stroke="#55727a"/><circle cx="0" cy="-17" r="19" fill="#f8f6ed" stroke="#55727a" stroke-width="2"/><text id="temperature-reading" x="0" y="-18" text-anchor="middle" font-size="13" font-weight="700" fill="#354f60">${Math.round(o.temperature)}</text><text x="0" y="-7" text-anchor="middle" font-size="8" fill="#55727a">°C</text><rect class="select-outline" x="-23" y="-40" width="46" height="115" rx="6"/>`;
 if(o.kind==='condenser')return `<path d="M0 0L230 70" stroke="#354f60" stroke-width="14"/><path d="M0 0L230 70" stroke="#d9eeec" stroke-width="9"/><path d="M30 -11L205 42L195 76L20 23Z" fill="#e0eeec80" ${stroke}/><path d="M30 -11L205 42L195 76L20 23Z" fill="#79bdcc" opacity="${state.jacket*.7}"/><path d="M28 7L200 59" stroke="#edf9f2" stroke-width="6"/><path d="M45 -12L48 8M185 85L182 62" fill="none" stroke="#354f60" stroke-width="9"/><circle cx="45" cy="-12" r="7" class="water-port"/><circle cx="185" cy="85" r="7" class="water-port"/><rect class="select-outline" x="-15" y="-30" width="260" height="132" rx="6"/>`;
 if(o.kind==='tap')return `<path d="M-30 -15H5V25H0V30" fill="none" stroke="#426573" stroke-width="16"/><path d="M-15 -30H20M3 -38V-19" stroke="${o.on?'#62b9c7':'#8da3a5'}" stroke-width="7" stroke-linecap="round"/><circle cy="30" r="9" class="water-port"/><text x="-25" y="65" class="experiment-readout">Tap ${o.on?'on':'off'}</text>`;
 return `<path d="M-42 0H42L25 20H-25Z" fill="#879e9e" ${stroke}/><ellipse rx="17" ry="6" fill="#3c5760"/><text x="-30" y="45" class="experiment-readout">Drain</text>`;
}
function render(){
 for(const [id,g]of groups){const o=state.items[id];g.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);g.innerHTML=art(o);g.classList.toggle('selected',selected===id);if(o.kind==='thermometer')g.setAttribute('aria-label',`Thermometer, ${Math.round(o.temperature)} degrees Celsius`);g.setAttribute('aria-disabled',String(state.phase!=='working'));g.setAttribute('aria-description',state.links.filter(l=>l.a===id||l.b===id).map(l=>'Connected to '+NAMES[l.a===id?l.b:l.a]).join('. '));}
 if(selected&&groups.has(selected))layer.append(groups.get(selected));
 $('hoses').innerHTML=state.hoses.map((h,j)=>{const [a,b]=h.ends.map(e=>hosePoint(state,e));return `<path d="M${a.x} ${a.y}C${a.x+40} ${Math.max(a.y,b.y)+65},${b.x-40} ${Math.max(a.y,b.y)+65},${b.x} ${b.y}" fill="none" stroke="${j?'#557c82':'#4f9daf'}" stroke-width="9" stroke-linecap="round" pointer-events="none"/>${[a,b].map((p,i)=>`<circle data-hose="${h.id}" data-end="${i}" data-port="${h.ends[i].port||''}" cx="${p.x}" cy="${p.y}" r="12" class="hose-end" fill="${j?'#557c82':'#4f9daf'}" aria-label="Water hose ${j+1}, end ${i+1}"/>`).join('')}`;}).join('');
 $('spills').innerHTML=state.spills.map(s=>`<ellipse cx="${s.x}" cy="525" rx="${Math.min(65,10+(s.water+s.acetone)*100)}" ry="9" fill="#78b7c3" opacity=".65"/>`).join('');
 $('streams').innerHTML=state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" stroke="#82bdc9" stroke-width="5" stroke-linecap="round"/>`).join('')+(state.vapourVisible?`<path d="M${state.items.flask.x} ${state.items.flask.y}q-25 -25 0 -45t0 -45" stroke="#e4eee7" stroke-width="7" stroke-dasharray="8 9" fill="none" opacity=".8"/>`:'');
 $('selected-name').textContent=NAMES[selected]||(selected?.startsWith('hose')?'Water hose end':'Nothing selected');
 const o=state.items[selected],action=o?.kind==='heater'?`${o.on?'Stop':'Start'} heating`:o?.kind==='tap'?`${o.on?'Stop':'Start'} water`:o&&'acetone'in o?`${pouring?'Stop':'Start'} pouring`:'Select apparatus';
 $('action').disabled=state.phase!=='working'||o?.stored||!o||!('acetone'in o||['heater','tap'].includes(o.kind));$('action').textContent=action;$('action').setAttribute('aria-pressed',String(o?.on||pouring));
 $('action-note').textContent=blocked?'Leave room for the vessel to tilt.':o&&'acetone'in o?'Hold the vessel with the mouse. Space starts/stops pouring.':o?.kind==='heater'||o?.kind==='tap'?'Space switches this control on or off.':'Drag equipment, or drag individual hose ends onto water fittings.';
 for(const b of $('equipment').children){b.disabled=state.phase!=='working';b.setAttribute('aria-pressed',String(b.dataset.equipment===selected));}
 $('finish').disabled=state.phase!=='working';menu?.sync();
}
function stopPour(){if(pouring&&selected)physicsFor(state).tilt(selected,0);pouring=false;state.flow=[];}
function select(id){if(state.phase!=='working')return;stopPour();selected=id;blocked=false;render();}
const coords=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(bench.getScreenCTM().inverse());
bench.addEventListener('pointerdown',e=>{
 if(e.button!==0||state.phase!=='working')return;const hose=e.target.closest('[data-hose]'),item=e.target.closest('[data-id]');const p=coords(e);
 if(hose){stopPour();const h=state.hoses.find(h=>h.id===hose.dataset.hose),i=Number(hose.dataset.end);h.ends[i]={x:p.x,y:p.y};drag={hose:h.id,index:i};selected=`hose-${h.id}-${i}`;}
 else if(item){const id=item.dataset.id;select(id);if(state.items[id].fixed)return;const o=state.items[id];drag={id,dx:p.x-o.x,dy:p.y-o.y,start:p,active:false};}
 else return;
 bench.focus({preventScroll:true});bench.setPointerCapture(e.pointerId);e.preventDefault();render();
});
bench.addEventListener('pointermove',e=>{if(!drag)return;const p=coords(e);blocked=false;if(drag.hose){state.hoses.find(h=>h.id===drag.hose).ends[drag.index]={x:Math.max(10,Math.min(1390,p.x)),y:Math.max(10,Math.min(525,p.y))};}else{if(!drag.active){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<4)return;detach(state,drag.id);drag.active=true;}dragApparatus(state,drag.id,Math.max(65,Math.min(1335,p.x-drag.dx)),Math.max(10,Math.min(510,p.y-drag.dy)));}render();});
function release(e){if(!drag)return;const id=drag.id;stopPour();if(drag.active&&menu?.wantsStore(e)&&menu.store(id)){drag=null;selected=null;render();return;}if(drag.hose){const h=state.hoses.find(h=>h.id===drag.hose);connectHose(state,drag.hose,drag.index,h.ends[drag.index]);}else if(drag.active)placeItem(state,drag.id);drag=null;render();}
bench.addEventListener('pointerup',release);bench.addEventListener('pointercancel',release);
$('equipment').addEventListener('click',e=>{if(e.target.dataset.equipment)select(e.target.dataset.equipment);});
$('equipment').addEventListener('focusin',e=>{if(e.target.dataset.equipment&&e.target.dataset.equipment!==selected)select(e.target.dataset.equipment);});
function action(){
 if(state.phase!=='working')return;const o=state.items[selected];if(!o||o.stored)return;
 if(o.kind==='heater'||o.kind==='tap')o.on=!o.on;
 else if('acetone'in o){if(pouring)stopPour();else if(physicsFor(state).tilt(selected,35)){pouring=true;blocked=false;}else{physicsFor(state).tilt(selected,0);blocked=true;}}
 render();
}
$('action').addEventListener('click',action);
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea,[contenteditable="true"]');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
window.addEventListener('blur',()=>{stopPour();render();});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPour();render();}});
$('restart').addEventListener('click',()=>{state=initializeStorage(createState());selected=null;drag=null;pouring=false;blocked=false;$('result').hidden=true;$('result').innerHTML='';render();});
const percent=n=>`${(n*100).toFixed(1)}%`;
$('finish').addEventListener('click',()=>{
 stopPour();release();const r=outcome(state);state.phase='finished';state.items.heater.on=false;state.items.tap.on=false;state.flow=[];state.vapourVisible=false;render();
 const panel=$('result');panel.hidden=false;panel.innerHTML=`<p class="eyebrow">DISTILLATION REVIEW</p><h2>${r.success?'Acetone-enriched distillate collected.':'No acetone-enriched distillate collected yet.'}</h2><div class="outcomes"><span>Acetone recovery: <strong id="recovery">${percent(r.yield)}</strong></span><span>Collected acetone fraction: ${percent(r.purity)}</span><span>Starting acetone fraction: 50.0%</span></div><p class="model-note">Recovery is the acetone recovered through distillation divided by the initial acetone amount. Composition is a separate measure. These are model amounts. The separate 56°C acetone and 100°C water stages are a teaching simplification, not a prediction of real acetone–water mixture boiling or purity.</p><table><thead><tr><th>Location</th><th>Acetone (model amount)</th><th>Water (model amount)</th></tr></thead><tbody>${[...Object.values(state.items).filter(o=>'acetone'in o).map(o=>[NAMES[o.id],o]),['Bench spills',r.spills],['Escaped vapour',r.escaped]].map(([name,m])=>`<tr><td>${name}</td><td>${m.acetone.toFixed(3)}</td><td>${m.water.toFixed(3)}</td></tr>`).join('')}</tbody></table><p>Cooling-water route: ${r.cooling==='lower-fed'?'supply at the lower jacket port':r.cooling==='upper-fed'?'supply at the upper jacket port':r.cooling==='off'?'tap off':'circuit disconnected'}. ${r.cooling==='upper-fed'?'In this model the jacket fills less effectively, so more process vapour escapes and acetone recovery is lower under comparable conditions.':''}</p>${r.success?`<form id="explanation"><fieldset><legend>Why is acetone collected before water in this model?</legend>${answerOptions(['Acetone has the lower boiling point; the condenser cools its vapour back to liquid.','Water is permanently unable to vaporise.','The condenser filters acetone molecules out of the liquid feed.'])}</fieldset><button class="primary" type="submit">Check explanation →</button><p id="question-feedback" aria-live="polite"></p></form>`:'<p>Compare the collected liquid, spills and escaped vapour. Restart to try another setup.</p>'}`;
 $('explanation')?.addEventListener('submit',e=>{e.preventDefault();const correct=new FormData(e.target).get('answer')==='0';$('question-feedback').textContent=correct?'Activity complete. This simplified model collects acetone at 56°C, then water at 100°C. Both can vaporise; recovery and collected composition are different measures.':'Both liquids can vaporise; acetone is more volatile. The condenser changes vapour back to liquid. Choose another answer.';if(correct){state.phase='complete';e.target.querySelector('button').disabled=true;}});
 panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);stepChemistry(state,dt);if(pouring&&selected){pour(state,selected,.28*dt);if(state.items[selected].water+state.items[selected].acetone<EPS)stopPour();}render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

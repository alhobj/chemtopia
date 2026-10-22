import {attachReviewRuler,reviewRulerArt} from './review-ruler.js';
import {reviewQuestions,bindReviewQuestions} from './review-questions.js';
import {initializeStorage} from './equipment-storage.js';
import {createEquipmentMenu} from './equipment-menu.js';
import {createState,MARKERS,NAMES,worldPoint,detach,placeItem,applyTool,physicsFor,pour,stepPhysics,stepChemistry,outcome,measurements,checkMeasurement} from './chromatography-model.js';
const $=id=>document.getElementById(id),bench=$('bench'),layer=$('apparatus'),NS='http://www.w3.org/2000/svg';
let state=initializeStorage(createState()),selected=null,drag=null,pouring=false,last=0,note='';
let menu,stopReviewRuler=()=>{};
const groups=new Map(),stroke='stroke="#354f60" stroke-width="3" stroke-linejoin="round"';
for(const id of Object.keys(state.items)){const g=document.createElementNS(NS,'g');g.dataset.id=id;g.classList.add('object');g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',NAMES[id]);g.addEventListener('focus',()=>{if(selected!==id)select(id);});layer.append(g);groups.set(id,g);}
$('equipment').innerHTML=Object.entries(NAMES).map(([id,n])=>`<button class="equipment-button" data-equipment="${id}" aria-pressed="false">${n}</button>`).join('');
function paperArt(p){
 return `<rect x="-60" width="120" height="180" rx="2" fill="#faf5df" ${stroke}/>${p.front!==null?`<rect x="-57" y="${p.front}" width="114" height="${180-p.front}" fill="#a4d6d5" opacity=".28"/><path data-solvent-front="${p.front}" d="M-57 ${p.front}H57" stroke="#86b9c0" stroke-width="2"/>`:''}${p.baseline!==null?`<path data-mark="baseline" data-y="${p.baseline}" d="M-57 ${p.baseline}H57" stroke="#6d7773" stroke-width="1.5"/>`:''}${p.frontMark!==null?`<path data-mark="front" data-y="${p.frontMark}" d="M-57 ${p.frontMark}H57" stroke="#6d7773" stroke-width="1.5" stroke-dasharray="4 3"/>`:''}${p.spots.map(spot=>spot.components.filter(c=>c.amount>1e-8).map(c=>`<ellipse data-band="${spot.id}" data-y="${c.y}" cx="${spot.x}" cy="${c.y}" rx="7" ry="${Math.min(12,3+p.spots.filter(t=>Math.abs(t.x-spot.x)<10&&Math.abs(t.origin-spot.origin)<8).length)}" fill="${c.color}" opacity=".8"/>`).join('')).join('')}${p.spots.filter(spot=>spot.components.some(c=>c.amount>1e-8)&&Math.max(...spot.components.map(c=>c.y))-Math.min(...spot.components.map(c=>c.y))<1).map(spot=>`<circle cx="${spot.x}" cy="${spot.components[0].y}" r="5" fill="${MARKERS[spot.marker].color}"/>`).join('')}`;
}
function art(o){
 if(o.kind==='chromPaper')return paperArt(o)+`<rect class="select-outline" x="-67" y="-8" width="134" height="196" rx="6"/>`;
 if(o.kind==='marker'||o.kind==='pencil'){const h=o.kind==='marker'?70:90,color=MARKERS[o.id]?.color||'#c4a259';return `<rect x="-8" width="16" height="${h-10}" rx="3" fill="${color}" ${stroke}/><path d="M-8 ${h-10}L0 ${h}L8 ${h-10}" fill="#cfb484" ${stroke}/><text transform="translate(4 8) rotate(90)" font-size="8" fill="#fff8e7">${o.kind==='marker'?o.id.toUpperCase():'PENCIL'}</text><rect class="select-outline" x="-17" y="-8" width="34" height="${h+20}" rx="6"/>`;}
 if(o.kind==='bar')return `<rect x="-115" y="-6" width="230" height="12" rx="4" fill="url(#metal)" ${stroke}/><rect x="-10" y="-8" width="20" height="22" rx="3" fill="#6f8d8d" ${stroke}/><rect class="select-outline" x="-123" y="-16" width="246" height="40" rx="6"/>`;
 if(o.kind==='lid')return `<rect x="-100" y="-6" width="200" height="12" rx="5" fill="#c7dcd4" ${stroke}/><rect class="select-outline" x="-108" y="-14" width="216" height="28" rx="6"/>`;
 if(o.kind==='ruler')return `<rect x="-15" width="30" height="200" rx="3" fill="#ddc28d" fill-opacity=".8" ${stroke}/>${Array.from({length:41},(_,i)=>`<path d="M-15 ${i*5}h${i%2?6:11}" stroke="#546362"/>${i%2?'':`<text x="0" y="${i*5+3}" font-size="7">${i/2}</text>`}`).join('')}<text x="-5" y="-5" font-size="9">cm</text><rect class="select-outline" x="-23" y="-10" width="46" height="220" rx="6"/>`;
 const chamber=o.id==='chamber',w=chamber?200:92,h=chamber?220:112,top=h-4-(h-20)*o.water/o.capacity;
 return `<path d="M${-w/2} 0V${h-8}Q${-w/2} ${h} ${-w/2+8} ${h}H${w/2-8}Q${w/2} ${h} ${w/2} ${h-8}V0" fill="url(#glass)" ${stroke}/>${o.water>0?`<rect x="${-w/2+5}" y="${top}" width="${w-10}" height="${h-4-top}" fill="${o.ink?'#8f91a0':'url(#liquid)'}" opacity=".65"/><path d="M${-w/2+5} ${top}H${w/2-5}" stroke="#80bdc8" stroke-width="2"/>`:''}<rect class="select-outline" x="${-w/2-8}" y="-8" width="${w+16}" height="${h+16}" rx="6"/>`;
}
function render(){
 for(const [id,g]of groups){const o=state.items[id];g.setAttribute('transform',`translate(${o.x} ${o.y}) rotate(${o.angle||0})`);g.innerHTML=art(o);g.classList.toggle('selected',id===selected);g.setAttribute('aria-description',state.links.some(l=>l.a===id||l.b===id)?'Paper clipped to support bar':'');}
 // Paper and tools must remain visible through the transparent chamber.
 for(const id of ['paper','pencil','green','purple','black','ruler'])layer.append(groups.get(id));
 if(selected)layer.append(groups.get(selected));
 $('spills').innerHTML=state.spills.map(p=>`<ellipse cx="${p.x}" cy="525" rx="${Math.min(80,12+p.water*90)}" ry="8" fill="${p.ink?'#8f91a0':'#84bdc7'}" opacity=".65"/>`).join('');
 $('streams').innerHTML=state.flow.map(f=>`<path d="M${f.from.x} ${f.from.y}L${f.to.x} ${f.to.y}" stroke="#80bdc8" stroke-width="4"/>`).join('');
 $('selected-name').textContent=NAMES[selected]||'Nothing selected';
 const o=state.items[selected],vessel=o&&['source','chamber'].includes(o.id),tool=o&&['pencil','marker'].includes(o.kind);
 $('action').disabled=state.phase!=='working'||o?.stored||!(vessel||tool);$('action').textContent=vessel?(pouring?'Stop pouring':'Start pouring'):tool?(o.id==='pencil'?'Make pencil mark':'Apply marker spot'):'Select apparatus';
 $('action-note').textContent=note||(vessel?'Hold the vessel and press Space to pour.':tool?'Place the tip over the paper and press Space.':'Drag apparatus to position it.');
 for(const b of $('equipment').children){b.disabled=state.phase!=='working';b.setAttribute('aria-pressed',String(b.dataset.equipment===selected));}
 $('finish').disabled=state.phase!=='working';menu?.sync();
}
function stopPour(){if(pouring&&selected)physicsFor(state).tilt(selected,0);pouring=false;}
function select(id){if(state.phase!=='working')return;stopPour();selected=id;note='';render();}
const coords=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(bench.getScreenCTM().inverse());
bench.addEventListener('pointerdown',e=>{
 const id=e.target.closest('[data-id]')?.dataset.id;if(!id||e.button!==0||state.phase!=='working')return;
 select(id);const p=coords(e),o=state.items[id];drag={id,start:p,dx:p.x-o.x,dy:p.y-o.y,active:false};bench.focus({preventScroll:true});bench.setPointerCapture(e.pointerId);e.preventDefault();
});
bench.addEventListener('pointermove',e=>{
 if(!drag)return;const p=coords(e);
 if(!drag.active){if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<4)return;detach(state,drag.id);drag.active=true;}
 const o=state.items[drag.id],x=Math.max(65,Math.min(1335,p.x-drag.dx)),y=Math.max(10,Math.min(519,p.y-drag.dy));
 if(o.id==='paper')o.collisionMask=~128;
 physicsFor(state).moveHeld(o.id,x,y);render();
});
function release(e){if(!drag)return;const id=drag.id;stopPour();if(drag.active&&menu?.wantsStore(e)&&menu.store(id)){drag=null;selected=null;render();return;}if(drag.active)placeItem(state,drag.id);drag=null;render();}
bench.addEventListener('pointerup',release);bench.addEventListener('pointercancel',release);
function action(){
 if(state.phase!=='working')return;const o=state.items[selected];if(!o||o.stored)return;
 if(['source','chamber'].includes(o.id)){if(pouring)stopPour();else if(drag?.active&&physicsFor(state).tilt(o.id,35))pouring=true;else note='Hold the vessel and leave room to tilt it.';}
 else if(['pencil','marker'].includes(o.kind))note=applyTool(state,o.id)?(o.id==='pencil'?'Pencil mark added.':'Marker spot added.'):'Place the tip over the paper.';
 render();
}
$('action').addEventListener('click',action);
document.addEventListener('keydown',e=>{if(e.code!=='Space'||state.phase!=='working')return;const c=e.target.closest?.('button,input,select,textarea');if(c&&c.id!=='action'&&!c.dataset.equipment)return;e.preventDefault();if(!e.repeat)action();});
$('equipment').addEventListener('click',e=>{if(e.target.dataset.equipment)select(e.target.dataset.equipment);});
$('equipment').addEventListener('focusin',e=>{if(e.target.dataset.equipment&&selected!==e.target.dataset.equipment)select(e.target.dataset.equipment);});
window.addEventListener('blur',()=>{stopPour();render();});document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPour();render();}});
$('restart').addEventListener('click',()=>{stopReviewRuler();state=initializeStorage(createState());selected=null;drag=null;pouring=false;note='';$('result').hidden=true;$('result').innerHTML='';render();});
$('finish').addEventListener('click',()=>{
 release();stopPour();const r=outcome(state),rows=measurements(state);state.phase='finished';render();
 const panel=$('result');panel.hidden=false;
 panel.innerHTML=`<p class="eyebrow">CHROMATOGRAPHY REVIEW</p><h2>${r.success?'The marker components have separated.':'No clear separation recorded yet.'}</h2><p>${r.overrun?'The solvent front reached the top; its distance is unreliable.':r.success?'Different components travelled different distances.':'Compare solvent contact, spot position and development time.'}</p><div class="chrom-review"><svg id="review-paper" viewBox="-90 -35 240 260" width="360" aria-label="Developed chromatography paper with draggable ruler">${paperArt(state.items.paper)}${reviewRulerArt()}</svg><div><p>Drag the ruler on this review image. Align its zero with the pencil baseline, then measure from the pencil baseline to each spot centre and to the marked solvent front, in the same direction and units. The ruler is in cm.</p>${r.success&&!r.measurable?'<p>To calculate R<sub>F</sub> on another attempt, align the starting spots with a pencil baseline and mark the solvent front after removing the paper, before it reaches the top.</p>':''}</div></div>${rows.length?`<form id="rf-form"><h3>Calculate R<sub>F</sub></h3><p>R<sub>F</sub> = spot distance ÷ solvent-front distance. Measure each distance from the same baseline. Enter R<sub>F</sub> to two decimal places.</p>${rows.map((row,i)=>`<fieldset><legend>${MARKERS[state.items.paper.spots.find(s=>String(s.id)===row.id.split('-')[0]).marker].name} · band ${i+1} <span style="color:${row.color}">●</span></legend><label>Spot distance (cm) <input name="distance-${row.id}" type="number" min="0" step=".1" required></label><label>Solvent-front distance (cm) <input name="front-${row.id}" type="number" min=".1" step=".1" required></label><label><span>R<sub>F</sub></span> <input name="rf-${row.id}" type="number" min="0" max="1" step=".01" required></label></fieldset>`).join('')}<button class="primary">Check measurements</button><p id="rf-feedback" aria-live="polite"></p></form>`:''}${r.success?reviewQuestions('chromatography'):''}`;
 stopReviewRuler();stopReviewRuler=attachReviewRuler($('review-paper'));
 let rfDone=false,explanationDone=false;
 const complete=()=>{if(rfDone&&explanationDone){state.phase='complete';$('question-feedback').textContent='Activity complete. Measurements and all three questions are correct.';}};
 $('rf-form')?.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);rfDone=rows.every(row=>checkMeasurement(row,...['distance','front','rf'].map(k=>Number(d.get(k+'-'+row.id)))));$('rf-feedback').textContent=rfDone?'Measurements and R_F calculations are correct.':'Check the baseline-to-centre and baseline-to-front distances, then divide and try again.';complete();});
 bindReviewQuestions('chromatography',()=>{explanationDone=true;complete();return rfDone;});
 panel.focus({preventScroll:true});panel.scrollIntoView({behavior:'smooth',block:'nearest'});
});
function frame(time){const dt=Math.min(.05,(time-last)/1000);last=time;if(state.phase==='working'){stepPhysics(state,dt,drag?.active?drag.id:null);stepChemistry(state,dt);if(pouring)pour(state,selected,.2*dt);render();}requestAnimationFrame(frame);}
menu=createEquipmentMenu({getState:()=>state,world:()=>physicsFor(state),groups,select,begin(id){select(id);detach(state,id);drag={id,dx:0,dy:0,active:true};},end:release,render,isDragging:()=>Boolean(drag?.active)});
render();requestAnimationFrame(frame);

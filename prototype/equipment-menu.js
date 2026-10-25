import {fitWorkbench} from './workbench-layout.js';
import {storeItem,takeItem} from './equipment-storage.js';
export function createEquipmentMenu({getState,world,groups,select,begin,end,render,isDragging=()=>false}){
 const bench=document.getElementById('bench'),list=document.getElementById('equipment');
 const panel=document.createElement('aside');panel.id='equipment-menu';panel.className='equipment-menu';panel.setAttribute('aria-label','Equipment storage');
 panel.innerHTML='<button id="equipment-tab" class="equipment-tab" aria-expanded="false" aria-controls="equipment-list">Equipment</button><div class="equipment-content"><h2 class="visually-hidden">Equipment</h2><div id="equipment-list"></div><p id="equipment-message" aria-live="polite"></p></div>';
 const workspace=document.querySelector('.workspace'),shell=document.createElement('div');shell.className='lab-shell';workspace.before(shell);shell.append(workspace);workspace.insertBefore(panel,bench.closest('.bench-panel'));fitWorkbench(bench);panel.querySelector('#equipment-list').append(list);
 for(const b of list.children){const status=document.createElement('small');status.className='equipment-status';b.append(status);}
 let pending=null;
 const open=value=>{panel.classList.toggle('open',value);panel.querySelector('button').setAttribute('aria-expanded',String(value));};
 const inside=(e,r)=>e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
 function wantsStore(e){if(!e||getState().phase!=='working')return false;const r=panel.classList.contains('open')?panel.getBoundingClientRect():panel.querySelector('#equipment-tab').getBoundingClientRect();return inside(e,r);}
 function over(e){const hit=inside(e,panel.classList.contains('open')?panel.getBoundingClientRect():panel.querySelector('#equipment-tab').getBoundingClientRect());panel.classList.toggle('drop-hover',hit);open(hit);}
 window.addEventListener('pointermove',over);
 panel.addEventListener('pointerenter',()=>open(true));panel.addEventListener('pointerleave',()=>open(false));
 panel.addEventListener('focusin',()=>open(true));panel.addEventListener('focusout',()=>{if(!panel.matches(':hover'))open(false);});
 panel.querySelector('#equipment-tab').addEventListener('click',()=>open(true));
 panel.addEventListener('pointerdown',e=>{
  const b=e.target.closest('[data-equipment]');if(!b||e.button!==0||getState().phase!=='working'||(getState().items[b.dataset.equipment].fixed||!getState().items[b.dataset.equipment].stored))return;
  pending={id:b.dataset.equipment,x:e.clientX,y:e.clientY,started:false};panel.setPointerCapture(e.pointerId);e.preventDefault();
 },true);
 window.addEventListener('pointermove',e=>{
  if(!pending||Math.hypot(e.clientX-pending.x,e.clientY-pending.y)<4)return;
  const r=bench.getBoundingClientRect();
  if(!pending.started){
   if(!inside(e,r)||wantsStore(e))return;
   const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(bench.getScreenCTM().inverse());
   p.x=Math.max(65,Math.min((getState().width||1000)-65,p.x));const item=getState().items[pending.id];p.y=Math.max(item.spawnYMin??260,Math.min(item.spawnYMax??380,p.y));
   if(!takeItem(getState(),pending.id,p.x,p.y,world())){panel.querySelector('#equipment-message').textContent='Choose an open space on the bench.';return;}
   panel.querySelector('#equipment-message').textContent='';pending.started=true;begin(pending.id);bench.focus({preventScroll:true});render();
  }
  bench.dispatchEvent(new PointerEvent('pointermove',{clientX:e.clientX,clientY:e.clientY,pointerId:e.pointerId,buttons:1}));
 });
 function finish(e){
  if(!pending){if(isDragging())end(e);return;}const p=pending;pending=null;
  if(p.started){end(e);render();}
  else select(p.id);
  open(panel.matches(':hover'));panel.classList.remove('drop-hover');
 }
 window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',e=>{if(pending?.started){end();storeItem(getState(),pending.id,world());}pending=null;render();open(false);});
 // Avoid the follow-on click selecting an object that was just returned to storage.
 panel.addEventListener('click',e=>{if(e.target.closest('[data-equipment]')&&getState().items[e.target.closest('[data-equipment]').dataset.equipment].stored)e.stopImmediatePropagation();},true);
 panel.addEventListener('keydown',e=>{
  if(e.key==='Escape'){open(false);bench.focus();return;}
  const b=e.target.closest('[data-equipment]');if(e.key!=='Enter'||!b||!getState().items[b.dataset.equipment].stored)return;
  e.preventDefault();e.stopPropagation();
  for(const y of [100,280,380])for(let x=120;x<(getState().width||1000)-100;x+=160)if(takeItem(getState(),b.dataset.equipment,x,y,world())){begin(b.dataset.equipment);end();render();return;}
 });
 return {
  wantsStore,
  store(id){return storeItem(getState(),id,world());},
  sync(){
   const s=getState();
   for(const [id,g]of groups){g.style.display=s.items[id].stored?'none':'';g.setAttribute('aria-hidden',String(Boolean(s.items[id].stored)));}
   for(const b of list.children){const o=s.items[b.dataset.equipment];b.dataset.stored=String(Boolean(o.stored));b.dataset.unavailable=String(Boolean(o.adventureUnavailable));if(o.adventureUnavailable)b.disabled=true;b.querySelector('.equipment-status').textContent=o.adventureUnavailable?'Not in your adventure inventory':o.stored?'Stored · drag to bench':o.fixed?'Fixed fitting':'On bench';}
  }
 };
}

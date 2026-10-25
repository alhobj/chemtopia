import {IDLE_ATLASES} from './idle-atlases.js';
import {NPC_ATLASES} from './npc-atlases.js';
import {IDLE_PROFILES,idlePose} from './idle-definitions.js';
export {IDLE_PROFILES,idlePose} from './idle-definitions.js';
const loaded=new Set(),loading=new Map();
function preload(file){
  if(typeof Image==='undefined'||loading.has(file))return;
  const image=new Image();
  const promise=new Promise(resolve=>{image.onload=()=>{loaded.add(file);resolve(true);};image.onerror=()=>resolve(false);});
  loading.set(file,promise);image.src='assets/world/'+file;
}
export function preloadIdleAssets(ids){
  for(const group of new Set(ids.filter(id=>IDLE_PROFILES[id]).map(id=>id.split('-')[0]))){
    for(const key of [group+'-blink',group+'-gesture',...(group==='c01'?['c01-standing']:[])])preload(IDLE_ATLASES[key].file);
  }
}

function spriteSource(id,pose){
  const group=id.split('-')[0],column=Number(id.split('-')[1])-1;
  if(pose.phase==='gesture'){
    const atlas=IDLE_ATLASES[group+'-gesture'],frames=atlas.characters[column],sequence=IDLE_PROFILES[id].gestureFrames;
    return {atlas,frame:frames['gesture'+sequence[pose.gestureFrame]],reference:frames['gesture'+sequence[0]],
      maxWidth:Math.max(...Object.values(frames).map(f=>f.body.w))};
  }
  const atlas=pose.blink?IDLE_ATLASES[group+'-blink']:group==='c01'?IDLE_ATLASES['c01-standing']:NPC_ATLASES[group];
  const frame=atlas.characters[column][pose.direction];
  return {atlas,frame,reference:frame,maxWidth:frame.body.w};
}

export function idleArt(id,pose=idlePose(id),{x=0,y=0,width=100,height=150,facing=pose.direction,scope=''}={}){
  if(!IDLE_PROFILES[id])return '';
  const {atlas,frame,reference,maxWidth}=spriteSource(id,pose),b=reference.body;
  const scale=Math.min(130/b.h,90/maxWidth),tx=50-(b.x+b.w/2)*scale,
    ty=145-(frame.body.y+frame.body.h)*scale;
  const prefix=`idle-${scope||id}-${pose.direction}-${pose.phase}-${pose.gestureFrame}`;
  const sprite=`<g transform="translate(${tx} ${ty}) scale(${scale})"><image href="assets/world/${atlas.file}" width="${atlas.width}" height="${atlas.height}" clip-path="url(#${prefix}-cell)"/></g>`;
  const player=id.startsWith('c01-');
  return `<svg class="character-art idle-sprite ${player?'walk-sprite':'npc-art'}" ${player?`data-character="${id}"`:`data-npc="${id}"`} data-facing="${facing}" data-cardinal="${pose.direction}" data-frame="1" data-moving="false" data-idle-phase="${pose.phase}" data-idle-gesture-frame="${pose.gestureFrame}" x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 100 150" preserveAspectRatio="xMidYMax meet" overflow="hidden" role="img" aria-label="${id}, facing ${pose.direction}"><defs><clipPath id="${prefix}-cell" clipPathUnits="userSpaceOnUse"><rect x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}"/></clipPath><clipPath id="${prefix}-upper"><rect width="100" height="100"/></clipPath><clipPath id="${prefix}-lower"><rect y="100" width="100" height="50"/></clipPath></defs><g class="idle-upper"><g clip-path="url(#${prefix}-upper)">${sprite}</g></g><g clip-path="url(#${prefix}-lower)">${sprite}</g></svg>`;
}

export function renderIdle(container,id,pose,options={}){
  if(!IDLE_PROFILES[id])return;
  const file=spriteSource(id,pose).atlas.file;preload(file);
  // Keep a complete neutral figure while a new blink/gesture image loads.
  if(typeof Image!=='undefined'&&pose.phase!=='neutral'&&!loaded.has(file))pose={...pose,phase:'neutral',blink:false,gestureFrame:0,key:`${id}:${pose.direction}:neutral:loading`};
  const key=pose.key+':'+(options.facing||pose.direction);
  if(container.dataset.idleKey!==key){container.innerHTML=idleArt(id,pose,options);container.dataset.idleKey=key;}
  const upper=container.querySelector('.idle-upper');
  if(upper)upper.setAttribute('transform',`translate(0 ${100*(1-pose.breath)}) scale(1 ${pose.breath})`);
}

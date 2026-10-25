import {idleArt,idlePose} from './idle-animation.js';
import {NPC_ATLASES} from './npc-atlases.js';
// New NPC appearances; suggested jobs do not assign quests or rewards.
export const NPC_GROUPS = [
  {id:'n01', name:'Children and younger students', file:NPC_ATLASES.n01.file, legacyFile:'npc-children-n01.png', roles:['Curious child','Young nature explorer','Library visitor','School visitor','Science-club member','Young town explorer']},
  {id:'n02', name:'Adult townspeople', file:NPC_ATLASES.n02.file, legacyFile:'npc-adults-n02.png', roles:['Town resident','Workshop keeper','Town visitor','Retired teacher','Local organiser','Equipment caretaker']},
  {id:'n03', name:'Chemists and laboratory staff', file:NPC_ATLASES.n03.file, legacyFile:'npc-chemists-n03.png', roles:['Research chemist','Senior chemist','Laboratory technician','Analytical chemist','Chemistry teacher','Laboratory mentor']},
];
export const NPC_CHARACTERS = NPC_GROUPS.flatMap(group => group.roles.map((suggestedRole,column)=>({
  id:`${group.id}-${column+1}`, groupId:group.id, column, suggestedRole,
  name:`${group.id.toUpperCase()}-${column+1}`, file:NPC_ATLASES[group.id].file, legacyFile:group.legacyFile,
})));
export const npcById=id=>NPC_CHARACTERS.find(npc=>npc.id===id)||null;

export const NPC_DIRECTIONS = [
  {id:'east',label:'East'}, {id:'north',label:'North'},
  {id:'west',label:'West'}, {id:'south',label:'South'},
];
const aliases={front:'south',back:'north',right:'east',left:'west',up:'north',down:'south'};
export function npcArt(id,direction='south'){
  const npc=npcById(id);if(!npc)return '';
  // Preserve the original npcArt(id, backBoolean) API for callers.
  direction=direction===true?'north':direction===false?'south':aliases[direction]||direction;
  if(!NPC_DIRECTIONS.some(d=>d.id===direction))direction='south';
  const atlas=NPC_ATLASES[npc.groupId],frame=atlas.characters[npc.column][direction];
  const {x,y,w,h,body}=frame,clip=`npc-${id}-${direction}`,scale=Math.min(130/body.h,92/body.w),tx=50-(body.x+body.w/2)*scale,ty=145-(body.y+body.h)*scale;
  return `<svg class="npc-art" data-npc="${id}" data-facing="${direction}" viewBox="0 0 100 150" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${npc.name}, facing ${direction}"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g transform="translate(${tx} ${ty}) scale(${scale})"><image href="assets/world/${atlas.file}" width="${atlas.width}" height="${atlas.height}" clip-path="url(#${clip})"/></g></svg>`;
}

export function npcIdleArt(id,direction='south',elapsed=0,options={}){
  if(!npcById(id))return '';
  return idleArt(id,idlePose(id,elapsed,{direction,...options}));
}

// New NPC appearances; suggested jobs do not assign quests or rewards.
export const NPC_GROUPS = [
  {id:'n01', name:'Children and younger students', file:'npc-children-n01.png', splits:[466,473,467,467,468,470], roles:['Curious child','Young nature explorer','Library visitor','School visitor','Science-club member','Young town explorer']},
  {id:'n02', name:'Adult townspeople', file:'npc-adults-n02.png', splits:[467,458,463,460,464,461], roles:['Town resident','Workshop keeper','Town visitor','Retired teacher','Local organiser','Equipment caretaker']},
  {id:'n03', name:'Chemists and laboratory staff', file:'npc-chemists-n03.png', splits:[468,460,471,459,468,472], roles:['Research chemist','Senior chemist','Laboratory technician','Analytical chemist','Chemistry teacher','Laboratory mentor']},
];
export const NPC_CHARACTERS = NPC_GROUPS.flatMap(group => group.roles.map((suggestedRole,column)=>({
  id:`${group.id}-${column+1}`, groupId:group.id, column, suggestedRole,
  name:`${group.id.toUpperCase()}-${column+1}`, file:group.file, split:group.splits[column],
})));
export const npcById=id=>NPC_CHARACTERS.find(npc=>npc.id===id)||null;

export function npcArt(id,back=false){
  const npc=npcById(id);if(!npc)return '';
  const clip=`npc-${id}-${back?'back':'front'}`;
  // Six columns; inspected per-column row boundaries preserve shoes/hair.
  // Clip actual source pixels to exclude neighbouring characters.
  const width=1774/6,x=npc.column*width,y=back?npc.split:0,height=back?887-npc.split:npc.split;
  return `<svg class="npc-art" data-npc="${id}" viewBox="${x} ${y} ${width} ${height}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${npc.name}, ${back?'back':'front'} view"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs><image href="assets/world/${npc.file}" width="1774" height="887" preserveAspectRatio="none" clip-path="url(#${clip})"/></svg>`;
}

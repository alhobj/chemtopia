import {animateIdles} from './idle-controller.js';
import {NPC_GROUPS,NPC_CHARACTERS,NPC_DIRECTIONS,npcArt} from './npc-characters.js';
document.getElementById('npc-groups').innerHTML=NPC_GROUPS.map(group=>`<section><h2>${group.name}</h2><div class="npc-grid">${NPC_CHARACTERS.filter(n=>n.groupId===group.id).map(n=>`<article class="npc-card"><h3>${n.name}</h3><p>${n.suggestedRole}</p><div class="npc-views">${NPC_DIRECTIONS.map(d=>`<figure><div data-idle-character="${n.id}" data-idle-direction="${d.id}">${npcArt(n.id,d.id)}</div><figcaption>${d.label}</figcaption></figure>`).join('')}</div></article>`).join('')}</div></section>`).join('');

animateIdles(document.getElementById('npc-groups'));

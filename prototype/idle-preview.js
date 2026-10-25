import {CHARACTERS} from './characters.js';
import {NPC_GROUPS,NPC_CHARACTERS} from './npc-characters.js';
import {IDLE_PROFILES} from './idle-definitions.js';
import {animateIdles} from './idle-controller.js';

const groups=[{name:'Player characters',characters:CHARACTERS},...NPC_GROUPS.map(g=>({name:g.name,characters:NPC_CHARACTERS.filter(n=>n.groupId===g.id)}))];
const root=document.getElementById('idle-groups'),direction=document.getElementById('idle-direction');
root.innerHTML=groups.map(g=>`<section><h2>${g.name}</h2><div class="idle-grid">${g.characters.map(c=>`<article class="idle-card"><div data-idle-character="${c.id}"></div><h3>${c.name}</h3><p>${IDLE_PROFILES[c.id].action}</p></article>`).join('')}</div></section>`).join('');
const controller=animateIdles(root,{directionFor:()=>direction.value});
let paused=false;const media=matchMedia('(prefers-reduced-motion: reduce)');
direction.addEventListener('change',()=>{controller.natural();document.getElementById('idle-status').textContent=media.matches?'Reduced motion: characters remain still.':'Natural timing · facing '+direction.value;});
document.getElementById('show-gestures').addEventListener('click',()=>{if(media.matches){document.getElementById('idle-status').textContent='Reduced motion is enabled; animations remain paused.';return;}direction.value='south';controller.demonstrate();document.getElementById('idle-status').textContent='Gesture demonstration · south-facing';});
document.getElementById('natural-idles').addEventListener('click',()=>{controller.natural();document.getElementById('idle-status').textContent='Natural, staggered timing';});
document.getElementById('pause-idles').addEventListener('click',e=>{paused=!paused;controller.pause(paused);e.target.textContent=paused?'Play animations':'Pause animations';});
if(media.matches)document.getElementById('idle-status').textContent='Reduced motion: characters remain still.';

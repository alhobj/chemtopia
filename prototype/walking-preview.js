import {CHARACTERS} from './characters.js';
import {walkingPose,renderWalking} from './walking-animation.js';

const directions=[['front','Down'],['back','Up'],['left','Left'],['right','Right']];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const container=document.getElementById('walk-previews');
container.innerHTML=CHARACTERS.map(c=>`<section><h2>${c.name}</h2><div class="walk-row">${directions.map(([id,label])=>`<div class="walk-cell" data-id="${c.id}" data-direction="${id}"><div class="sprite"></div><span>${label}</span></div>`).join('')}</div></section>`).join('');
let moving=!reduced,previous='',distance=0,last=0;
const toggle=document.getElementById('toggle');
function label(){toggle.textContent=moving?'Pause walking':'Play walking';}
toggle.addEventListener('click',()=>{moving=!moving;distance=0;label();});
label();
function frame(time){if(moving)distance+=Math.min(50,time-(last||time))*.18;last=time;const key=walkingPose('front',distance,moving).frame+':'+moving;if(key!==previous){for(const cell of container.querySelectorAll('.walk-cell'))renderWalking(cell.querySelector('.sprite'),cell.dataset.id,walkingPose(cell.dataset.direction,distance,moving));previous=key;}requestAnimationFrame(frame);}
requestAnimationFrame(frame);

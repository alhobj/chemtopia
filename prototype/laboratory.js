import {sprite} from './equipment-art.js';
export const experiments=[
 {id:'filtration',name:'Filtration',file:'index.html',objective:'Separate sand from water using a funnel and filter paper.',x:29,y:21},
 {id:'distillation',name:'Distillation',file:'distillation.html',objective:'Separate an acetone–water mixture and collect acetone-rich distillate.',x:66,y:21},
 {id:'chromatography',name:'Chromatography',file:'chromatography.html',objective:'Separate marker inks with water, measure distances and calculate Rf values.',x:43,y:21},
 {id:'evaporation',name:'Evaporation',file:'evaporation.html',objective:'Evaporate water and recover dry salt from a solution.',x:13,y:35},
 {id:'recrystallisation',name:'Recrystallisation',file:'recrystallisation.html',objective:'Purify potassium nitrate by hot filtration and cooling.',x:87,y:35},
 {id:'solution',name:'Prepare & dilute',file:'solution.html',objective:'Prepare a sodium chloride stock solution and make a tenfold dilution.',x:5,y:60},
 {id:'titration',name:'Titration',file:'titration.html',objective:'Choose acid, base and indicator, record titres and calculate concentration.',x:94,y:60},
 {id:'neutralisation',name:'Neutralisation',file:'neutralisation.html',objective:'Measure a temperature rise and estimate the molar enthalpy of neutralisation.',x:44,y:61},
 {id:'combustion',name:'Combustion',file:'combustion.html',objective:'Use an ethanol burner to heat water and estimate the molar enthalpy of combustion.',x:56,y:64}
];
const glass=(...args)=>sprite(...args);
function stand(x,y,h=90){return glass('stand',x-24,y+h-12,48,12,[0,.78,1,.22])+glass('stand',x-2,y,4,h-5,[.43,0,.12,.80]);}
export function preview(id){let art='';
 switch(id){
 case'filtration':art=stand(37,12)+`<path d="M37 42H82" stroke="#576d85" stroke-width="3"/>`+glass('funnel',55,18,42,55)+glass('filterPaper',59,19,34,23)+glass('beaker',58,76,38,38);break;
 case'distillation':art=glass('hotplate',20,88,44,24)+glass('roundFlask',26,40,30,48)+glass('head',37,18,18,28)+`<g transform="translate(49 39) rotate(17)">${glass('condenser',0,-10,60,24)}</g>`+glass('beaker',91,72,30,39);break;
 case'chromatography':art=glass('chamber',32,20,64,86)+`<rect x="51" y="30" width="26" height="61" fill="#fff3d5"/><path d="M53 82H75" stroke="#5f6f7b"/><circle cx="58" cy="66" r="3" fill="#d8b546"/><circle cx="67" cy="48" r="3" fill="#a47ba0"/><circle cx="58" cy="36" r="3" fill="#4f9db6"/>`+glass('pencil',106,38,7,67);break;
 case'evaporation':art=glass('hotplate',25,79,80,31)+glass('basin',28,48,76,31)+`<path d="M48 43q-7-9 0-18t0-16m22 34q7-9 0-18t0-16" fill="none" stroke="#edf6f1" stroke-width="3"/>`;break;
 case'recrystallisation':art=glass('hotplate',15,83,53,25)+glass('beaker',22,42,40,41)+glass('beaker',83,58,39,49)+`<path d="M90 97l5-7 5 7 6-7 7 7" fill="#f0ecdc" stroke="#a5c8d7"/>`;break;
 case'solution':art=glass('balance',3,87,51,25)+glass('volumetric',61,20,37,90)+glass('wash',104,58,27,51);break;
 case'titration':art=stand(32,3,105)+`<path d="M33 24H74" stroke="#647a8a" stroke-width="3"/>`+glass('rod',72,8,5,70)+`<path d="M67 75H82" stroke="#326c86" stroke-width="4"/>`+glass('conical',61,81,35,32)+glass('bottle',107,74,20,36);break;
 case'neutralisation':art=glass('cup',43,53,50,59)+glass('thermometer',69,20,7,78)+glass('bottle',6,67,29,43)+glass('beaker',103,72,28,38);break;
 case'combustion':art=stand(29,14,95)+`<path d="M30 53H105" stroke="#5e778b" stroke-width="3"/>`+glass('can',57,14,38,39)+glass('burner',59,88,34,25)+`<path d="M75 87q-12-10 0-24 12 14 0 24" fill="#f4bc58"/>`;break;
 }
 return `<svg viewBox="0 0 140 120" aria-hidden="true" focusable="false">${art}</svg>`;
}
const room=document.querySelector('#bench-experiments'),list=document.querySelector('#experiment-list'),toggle=document.querySelector('#toggle-list');
room.innerHTML=experiments.map(e=>`<a class="bench-experiment" data-lab="${e.id}" href="${e.file}" style="--x:${e.x};--y:${e.y}" aria-label="${e.name}: ${e.objective}">${preview(e.id)}<span class="bench-label">${e.name}</span></a>`).join('');
list.innerHTML=experiments.map(e=>`<a class="experiment-card" data-list-lab="${e.id}" href="${e.file}">${preview(e.id)}<div><h3>${e.name}</h3><p>${e.objective}</p></div></a>`).join('');
function describe(e){document.querySelector('#detail-name').textContent=e.name;document.querySelector('#detail-objective').textContent=e.objective;const open=document.querySelector('#open-experiment');open.href=e.file;open.hidden=false;document.querySelectorAll('.bench-experiment').forEach(a=>a.classList.toggle('selected',a.dataset.lab===e.id));}
for(const e of experiments){const a=room.querySelector(`[data-lab="${e.id}"]`);a.addEventListener('pointerenter',()=>describe(e));a.addEventListener('focus',()=>describe(e));}
function showList(show){list.hidden=!show;toggle.setAttribute('aria-expanded',String(show));toggle.textContent=show?'Hide list':'All experiments';}
toggle.addEventListener('click',()=>showList(list.hidden));
if(matchMedia('(max-width:760px)').matches)showList(true);

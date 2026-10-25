import {art as ratesArt} from './rates-art.js';
import {equipmentArt} from './equipment-art.js';
export const studies=[
 ['Inner vial','vial','rates',[-25,-15,50,85]],['Pipette','pipette','solution',[-30,-35,60,165]],['Burette','burette','titration',[-40,-20,80,285]],
 ['Beaker','beaker','filtration',[-80,-20,160,160]],['Conical flask','conical','titration',[-80,-20,160,170]],
 ['Volumetric flask','flask','solution',[-70,-20,140,180]],['Round-bottom flask','flask','distillation',[-75,-20,150,190]],
 ['Measuring cylinder','cylinder','neutralisation',[-45,-20,90,170]],['Chromatography chamber','chamber','chromatography',[-130,-20,260,275]],
 ['Reagent bottle','bottle','titration',[-60,-20,120,160]],['Wash bottle','wash','solution',[-60,-20,120,160]],
 ['Evaporating basin','basin','evaporation',[-100,-30,200,150]],['Calorimetry cup','cup','neutralisation',[-75,-20,150,170]],['Aluminium can','can','combustion',[-75,-20,150,150]],
];
const samples=[['Empty',0,0],['Half full',.5,0],['Nearly full',.95,0],['Tilted',.5,35]];
document.querySelector('#vessel-studies').innerHTML=studies.map(([name,kind,lab,box],index)=>`<section class="vessel-study"><h2>${name}</h2><div class="vessel-samples">${samples.map(([label,fraction,angle],sample)=>{
 const capacity=kind==='flask'&&lab==='solution'?110:kind==='burette'?50:kind==='pipette'?10:kind==='vial'?20:1,id=`study-${index}-${sample}`,o={id,kind,capacity,water:capacity*fraction,acetone:0,salt:0,sand:0,angle};
 const colour=lab==='titration'?'#d6a4c6':'#82bfce',source=`<g clip-path="url(#unused)"><rect fill="${colour}"/></g>`;
 return `<div class="vessel-sample" data-kind="${kind}" data-lab="${lab}" data-fraction="${fraction}"><svg viewBox="${box.join(' ')}" role="img" aria-label="${name}: ${label}"><g data-vessel transform="rotate(${angle} 0 ${kind==='chamber'?110:60})">${kind==='vial'?ratesArt(o,{}):equipmentArt(o,source,lab,{})}</g></svg><p>${label}</p></div>`;
}).join('')}</div></section>`).join('');

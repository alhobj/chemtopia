import {EQUIPMENT} from './equipment-catalog.js';
import {equipmentArt,sprite} from './equipment-art.js';
import {art as measurementArt} from './measurement-art.js';
import {art as ratesArt} from './rates-art.js';
const definitions={
 beaker:['beaker','filtration',[-65,-12,130,125]],basin:['basin','evaporation',[-90,-10,180,100]],heater:['heater','evaporation',[-75,-10,150,85]],
 'filter-funnel':['funnel','filtration',[-70,-12,140,105]],stand:['stand','filtration',[-75,-250,220,285]],chamber:['chamber','chromatography',[-115,-10,230,245]],
 pencil:['pencil','chromatography',[-20,-10,40,110]],'marker-set':['marker','chromatography',[-42,-10,84,100]],ruler:['ruler','custom',[-15,-10,30,130]],
 balance:['balance','solution',[-85,-10,170,85]],'weighing-boat':['boat','solution',[-45,-10,90,55]],spatula:['spatula','solution',[-20,-10,40,95]],'stirring-rod':['rod','solution',[-15,-10,30,125]],
 'transfer-funnel':['fillingFunnel','distillation',[-50,-10,100,105]],'wash-bottle':['wash','solution',[-45,-10,90,140]],'volumetric-flask-100':['flask','solution',[-50,-10,100,160]],stopper:['stopper','solution',[-22,-10,44,45]],
 'pipette-10':['pipette','solution',[-25,-30,50,160]],'pipette-25':['pipette','titration',[-25,-30,50,160]],'conical-flask':['conical','titration',[-65,-10,130,145]],burette:['burette','titration',[-30,-10,60,280]],
 'ph-probe':['probe','titration',[-45,-45,90,175]],thermometer:['thermometer','neutralisation',[-35,-35,70,220]],'measuring-cylinder':['cylinder','neutralisation',[-35,-10,70,150]],
 'insulated-cup':['cup','neutralisation',[-60,-10,120,150]],'aluminium-can':['can','combustion',[-65,-10,130,130]],'spirit-burner':['burner','combustion',[-45,-20,90,100]],
 'round-flask':['flask','distillation',[-60,-10,120,170]],'still-head':['head','distillation',[-25,-10,125,105]],condenser:['condenser','distillation',[-15,-30,265,145]],
 'gas-syringe':['gasSyringe','rates',[-20,-45,320,100]],'delivery-bung':['bung','rates',[-25,-25,65,60]],'inner-vial':['vial','rates',[-25,-10,50,80]],
 'conductivity-meter':['conductivityMeter','measurement',[-110,-20,220,135]],'conductivity-probe':['electrode','measurement',[-30,-35,60,150]],colorimeter:['colorimeter','measurement',[-105,-15,210,125]],cuvette:['cuvette','measurement',[-25,-10,50,90]],voltmeter:['voltmeter','measurement',[-110,-20,220,135]],'salt-bridge':['saltBridge','measurement',[-110,-15,220,120]],
};
export const previewIds=Object.keys(EQUIPMENT);
export function equipmentPreview(id,scope='shop'){
 if(!EQUIPMENT[id])return '';
 let drawing,box;
 if(['paper-support','chamber-lid','cup-lid'].includes(id)){
  box=[-65,-15,130,55];drawing=id==='paper-support'?'<path d="M-55 0H55" stroke="#607c86" stroke-width="7"/>'+sprite('stopper',-8,-8,16,25):sprite('lid',-55,-4,110,18);
 }else{
  const [kind,lab,bounds]=definitions[id];box=bounds;
  const o={id:'preview-'+scope+'-'+id,kind,water:0,capacity:1,sand:0,salt:0,raw:0,crystals:0,chips:0,powder:0,temperature:20,reading:20,angle:0,clean:true,clearFace:true,lid:true};
  if(id==='marker-set')drawing=['green','purple','black'].map((colour,i)=>`<g transform="translate(${(i-1)*23} 0)">${equipmentArt({...o,id:colour},'','chromatography',{})}</g>`).join('');
  else if(id==='ruler')drawing='<rect x="-10" width="20" height="110" fill="#f3dfb0" stroke="#526d76"/>'+Array.from({length:23},(_,i)=>`<path d="M-10 ${i*5}h${i%2?6:12}" stroke="#526d76"/>`).join('');
  else if(lab==='measurement')drawing=measurementArt(o,{filter:'red',mode:id==='voltmeter'?'voltaic':'conductivity',collected:0},{value:null,voltage:null});
  else if(lab==='rates')drawing=ratesArt(o,{collected:0});
  else drawing=equipmentArt(o,'',lab,{jacket:0});
 }
 return `<svg class="catalog-preview" data-preview="${id}" viewBox="${box.join(' ')}" role="img" aria-label="${EQUIPMENT[id].name}" focusable="false">${drawing}</svg>`;
}

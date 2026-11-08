import {vesselInterior} from './vessel-interiors.js';
import * as common from './measurement-common.js';
import {pH as acidBasePH,EQUILIBRIUM} from './titration-model.js';
export * from './measurement-common.js';
export const CHEMISTRY={...EQUILIBRIUM,temperature:25,stockConcentration:.1};
export function pH(o){return acidBasePH({water:o?.water||0,acetate:o?.solutes?.acetateTotal||0,base:o?.solutes?.sodium||0,acid:o?.solutes?.chloride||0});}
export function speciation(o){const ph=pH(o);if(ph===null)return null;const H=10**(-ph),total=common.concentration(o,'acetateTotal'),anion=total*CHEMISTRY.kaAcetic/(CHEMISTRY.kaAcetic+H);return{pH:ph,H,OH:CHEMISTRY.kw/H,HA:total-anion,A:anion,total};}
export function createState(){
 const p=common.pool,items={
  acid:p('acid','Ethanoic acid · 0.100 M',100,429,100,{acetateTotal:.01}),acetate:p('acetate','Sodium ethanoate · 0.100 M',230,429,100,{acetateTotal:.01,sodium:.01}),water:p('water','Deionised water',360,429,500,{},600),
  hcl:p('hcl','HCl · 0.100 M',120,100,100,{chloride:.01}),naoh:p('naoh','NaOH · 0.100 M',240,100,100,{sodium:.01}),
  sample1:p('sample1','Buffer preparation',490,429),sample2:p('sample2','Water control',620,429),waste:p('waste','Waste',360,100,0,{},1000),
  probe:{id:'probe',name:'pH probe',kind:'probe',x:580,y:100,angle:0,collision:[common.box(0,55,8,110)]},
 };
 for(const id of ['sample1','sample2'])Object.assign(items[id],{acidAdded:0,baseAdded:0,changedPreparation:false});return common.makeState('buffer',items);
}
export function transfer(s,from,to,ml){
 const a=s.items[from],b=s.items[to];if(!a?.solutes||!b?.solutes)return 0;
 const before=b.water,Na=common.concentration(a,'sodium'),Cl=common.concentration(a,'chloride'),n=common.transfer(s,from,to,ml);if(!n)return 0;
 if(to==='sample1'||to==='sample2'){
  const received=b.water-before;
  if(from==='hcl'||from==='naoh'){
   b.acidAdded+=received/1000*Cl;b.baseAdded+=received/1000*Na;
   b.lastDose={source:a.name,volume:received,concentration:from==='hcl'?Cl:Na,moles:received/1000*(from==='hcl'?Cl:Na)};
   if(common.concentration(a,'acetateTotal')>1e-10)b.changedPreparation=true;
  }else if(s.records.some(r=>r.sample===to))b.changedPreparation=true;
 }
 return n;
}
export function pour(s,id,ml=5){const a=s.items[id];if(!common.active(a)||a.parent)return 0;const b=common.receiver(s,common.point(a),id)||common.receiver(s,common.point(a,51),id);return b?transfer(s,id,b.id,ml):0;}
export function fitProbe(s,to){const p=s.items.probe,b=s.items[to];if(s.phase!=='working'||!common.active(p)||!common.active(b)||!b.solutes)return false;p.parent=to;p.offset={x:0,y:-35};common.updateParents(s);common.physicsFor(s).sync();return true;}
export function removeProbe(s){const p=s.items.probe;if(s.phase!=='working'||!p.parent)return false;p.parent=null;p.y-=90;common.physicsFor(s).sync();return true;}
export function reading(s){const p=s.items.probe,b=s.items[p.parent];if(!common.active(p)||!common.active(b)||!b.solutes)return{value:null,status:'Fit the pH probe to a sample.'};const g=vesselInterior('beaker','buffer',78,96),surface=g.bottom-(g.bottom-g.top)*Math.min(1,b.water/b.capacity);if(b.water<=0||surface>75)return{value:null,status:'The fitted probe tip is above the liquid. Add enough solution to cover it before recording.'};return{value:pH(b),sample:b.id,status:'Ideal, instantly equilibrated 25 °C pH. Record deliberately; no probe lag or uncertainty is simulated.'};}
export function record(s){if(s.phase!=='working')return null;const r=reading(s);if(r.value===null)return null;const b=s.items[r.sample],row={sample:b.id,label:b.name,pH:Number(r.value.toFixed(3)),volume:b.water,totalMoles:b.solutes.acetateTotal,sodium:b.solutes.sodium,chloride:b.solutes.chloride,acidAdded:b.acidAdded||0,baseAdded:b.baseAdded||0,netBase:((b.baseAdded||0)-(b.acidAdded||0))*1000,changedPreparation:Boolean(b.changedPreparation),lastDose:b.lastDose?{...b.lastDose}:null,time:s.time};s.records.push(row);return row;}
export function stepChemistry(s,dt){if(s.phase==='working'&&Number.isFinite(dt)&&dt>0)s.time+=dt;}
export const assumptions='AHL buffer investigation. Ideal aqueous solutions at fixed 25 °C; Ka(CH₃COOH) = 1.8 × 10⁻⁵ and Kw = 1.0 × 10⁻¹⁴, rounded teaching constants. The existing titration solver balances charge using analytical acetate, sodium and chloride totals, including water autoionisation. All volumes are additive and all aliquots are finite. No Henderson–Hasselbalch shortcut controls the practical. Mixing and probe response are instantaneous; activity coefficients, CO₂ absorption, temperature effects and probe uncertainty are omitted. Dilution changes concentration and capacity per volume, not the acid strength Ka. The stocks are at most 0.100 M; this is not a concentrated-solution model.';
export function bufferQuestions(s){
 const sample=s.records.find(r=>r.sample==='sample1'),last=s.records.filter(r=>r.sample==='sample1').at(-1),usable=sample&&last&&sample!==last,a=usable?sample.pH:4.745,b=usable?last.pH:4.785,water=s.records.filter(r=>r.sample==='sample2').at(-1),ph=water?.pH??3;
 return[
  {prompt:'Why can an ethanoic acid/ethanoate buffer resist a small addition of strong acid or base?',answers:['Its conjugate pair can consume added H⁺ or OH⁻, within a finite capacity.','Its weak acid prevents any dissociation or change in pH at every dose.','Its salt lowers every solute concentration to zero after each addition.'],hint:'Buffering is a conjugate-pair reaction with finite amounts, not a guarantee of constant pH.'},
  {prompt:`${usable?'Use the first and last recorded buffer readings.':'Supplied example:'} Initial pH = ${a.toFixed(3)}, final pH = ${b.toFixed(3)}. Calculate the signed change, final − initial. ${usable&&last.changedPreparation?'Preparation/dilution changed between records: this is not a controlled dosing comparison.':''}`,fields:[{id:'value',label:'ΔpH',answer:b-a,tolerance:.002}],hint:'Subtract the initial reading. A small difference does not establish a matched comparison unless volumes and additions were controlled.'},
  {prompt:`${water?'Use your recorded water-control reading.':'Supplied water-control example:'} pH = ${ph.toFixed(3)}. Calculate [H⁺] in mol dm⁻³.`,fields:[{id:'value',label:'[H⁺] / mol dm⁻³',answer:10**(-ph),tolerance:Math.max(1e-14,10**(-ph)*.01)}],hint:'Use [H⁺] = 10^(−pH). A smaller response in a buffer is not simply evidence of a weaker strong-acid dose.'}
 ];
}
export function hlExample(s){
 const row=s.records.find(r=>r.sample==='sample1'&&r.totalMoles>0&&r.chloride===0&&r.acidAdded===0&&r.baseAdded===0&&r.sodium/r.totalMoles>.05&&r.sodium/r.totalMoles<.95&&r.totalMoles/(r.volume/1000)>.001);
 const acid=row?row.totalMoles-row.sodium:.001,base=row?.sodium??.001;
 return{row,acid,base,pH:-Math.log10(CHEMISTRY.kaAcetic)+Math.log10(base/acid),concentration:(acid+base)/((row?.volume??20)/1000)};
}
export function bufferGraph(s){
 const rows=s.records,lo=Math.min(-.1,...rows.map(r=>r.netBase)),hi=Math.max(.1,...rows.map(r=>r.netBase)),x=v=>55+550*(v-lo)/(hi-lo),y=v=>255-230*v/14;
 return `<svg class="investigation-graph" viewBox="0 0 660 310" role="img" aria-label="Measured pH against net strong base added; acid is negative"><path d="M55 25V255H605" fill="none" stroke="#466b70"/>${[0,2,4,6,8,10,12,14].map(p=>`<path d="M55 ${y(p)}H605" stroke="#d3dfd1"/><text x="45" y="${y(p)+4}" text-anchor="end" font-size="11">${p}</text>`).join('')}${[0,1,2,3,4].map(i=>`<text x="${55+i*137.5}" y="275" text-anchor="middle" font-size="10">${(lo+(hi-lo)*i/4).toFixed(2)}</text>`).join('')}${['sample1','sample2'].map((id,i)=>{const r=rows.filter(r=>r.sample===id),colour=i?'#9a724a':'#286d67';return `<polyline points="${r.map(r=>`${x(r.netBase)},${y(r.pH)}`).join(' ')}" fill="none" stroke="${colour}" stroke-width="2"/>${r.map(r=>`<circle cx="${x(r.netBase)}" cy="${y(r.pH)}" r="3" fill="${colour}"><title>${r.label}: ${r.volume.toFixed(2)} mL, pH ${r.pH}</title></circle>`).join('')}`;}).join('')}<text x="330" y="302" text-anchor="middle" font-size="12">Net strong base added / mmol (acid additions negative)</text><text x="13" y="145" transform="rotate(-90 13 145)" font-size="12">pH</text></svg><p>Teal: buffer preparation; brown: water control. Lines connect your measurement sequence, not an ideal curve. Use matched initial volumes and doses. A dilution/preparation change is flagged in the table; points at the same added amount may have different volumes.</p>`;
}

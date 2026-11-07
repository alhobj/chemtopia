import * as common from './measurement-common.js';
import * as optical from './colorimetry-model.js';
export * from './measurement-common.js';
export {insert,remove,seated,blank,reading,fitCalibration,estimate} from './colorimetry-model.js';
// Deliberately illustrative single-complex, concentration-based model. These are
// teaching constants, not experimentally validated Fe–SCN conditional data.
export const CONDITIONS={temperature:25,Kc:890,background:'0.10 M HNO₃ matrix in stocks, solvent and references; ideal concentrations, one dominant 1:1 complex',epsilon:4700};
export const FILTERS={blue:{name:'Blue · 470 nm',epsilon:4700},green:{name:'Green · 525 nm',epsilon:1600},red:{name:'Red · 635 nm',epsilon:100}};
export function solveComplex(fe,scn,K=CONDITIONS.Kc){
 if(![fe,scn,K].every(Number.isFinite)||fe<0||scn<0||K<0)throw Error('Invalid equilibrium totals or constant.');
 if(!fe||!scn||!K)return 0;
 // Stable smaller root of Kx²−[K(F+S)+1]x+KFS=0; avoids cancellation.
 const a=fe+scn+1/K,discriminant=(fe-scn)**2+2*(fe+scn)/K+1/K**2;
 return Math.min(fe,scn,2*fe*scn/(a+Math.sqrt(discriminant)));
}
export function composition(o){const fe=common.concentration(o,'FeTotal'),scn=common.concentration(o,'SCNTotal'),complex=solveComplex(fe,scn);return{feTotal:fe,scnTotal:scn,complex,fe:fe-complex,scn:scn-complex};}
export function quotient(complex,fe,scn){if(fe<=0||scn<=0)return complex>0?Infinity:null;return complex/(fe*scn);}
export const direction=Q=>Q===null?'undefined':Math.abs(Q-CONDITIONS.Kc)<CONDITIONS.Kc*1e-8?'at equilibrium':Q<CONDITIONS.Kc?'forward':'reverse';
export function createState(){
 const p=common.pool,items={
  iron:p('iron','Fe³⁺ stock · 0.00200 M',100,429,100,{FeTotal:.0002}),thiocyanate:p('thiocyanate','SCN⁻ stock · 0.00200 M',230,429,100,{SCNTotal:.0002}),water:p('water','Matched solvent · 0.10 M HNO₃',360,429,500,{},600),
  reference1:p('reference1','Reference 1 · model certificate',120,100,40,{FeTotal:.002,SCNTotal:.0000016}),reference2:p('reference2','Reference 2 · model certificate',240,100,40,{FeTotal:.002,SCNTotal:.0000064}),
  mixture1:p('mixture1','Mixture 1',490,429),mixture2:p('mixture2','Mixture 2',620,429),waste:p('waste','Waste',360,100,0,{},1000),
  meter:{id:'meter',name:'Colorimeter',kind:'colorimeter',x:830,y:435,angle:0,lid:false,collision:[common.box(0,45,185,90)],mass:4},
 };
 for(const [i,id]of ['cuvetteA','cuvetteB'].entries())items[id]={...p(id,'Cuvette '+(i?'B':'A'),480+i*100,100,0,{},4),kind:'cuvette',clean:false,clearFace:true,collision:[common.box(-12,30,3,60),common.box(12,30,3,60),common.box(0,58,27,4)]};
 const s=common.makeState('equilibrium',items);Object.assign(s,{filter:'blue',blank:null,unknownReadings:[],lastMixtureChange:null,optics:{filters:FILTERS,concentration:o=>composition(o).complex}});return s;
}
export function transfer(s,from,to,ml,options={}){
 const a=s.items[from],b=s.items[to];if(!a?.solutes||!b?.solutes)return 0;
 const old=composition(b),source=composition(a),v=b.water,complexMoles=old.complex*v/1000;
 const n=common.transfer(s,from,to,ml,{film:a.kind==='cuvette'?.05:0,...options});if(!n)return 0;
 const received=b.water-v,c=composition(b),immediate=(complexMoles+source.complex*received/1000)/(b.water/1000);
 const Q=quotient(immediate,c.feTotal-immediate,c.scnTotal-immediate);
 b.lastChange={name:b.name,feTotal:c.feTotal,scnTotal:c.scnTotal,immediate,Q,direction:direction(Q),before:old.complex,after:c.complex,volume:b.water};
 if(to.startsWith('mixture'))s.lastMixtureChange={...b.lastChange};return n;
}
export function pour(s,id,ml=3){const a=s.items[id];if(!common.active(a)||a.parent)return 0;const b=common.receiver(s,common.point(a),id)||common.receiver(s,common.point(a,51),id);return b?transfer(s,id,b.id,ml,{film:a.kind==='cuvette'?.05:.2}):0;}
export function record(s,type,known,label=''){
 const row=optical.record(s,type,known,label);if(!row)return null;
 Object.assign(row,composition(optical.seated(s)),{change:s.lastMixtureChange?{...s.lastMixtureChange}:null});return row;
}
export function analysis(s){const row=s.unknownReadings.at(-1),e=optical.estimate(s,row);if(!row||!e||!Number.isFinite(e.value)||e.value<=0||e.value>=Math.min(row.feTotal,row.scnTotal))return null;return{...e,row,fe:row.feTotal-e.value,scn:row.scnTotal-e.value,Kc:e.value/((row.feTotal-e.value)*(row.scnTotal-e.value))};}
export function stepChemistry(s,dt){if(s.phase==='working'&&Number.isFinite(dt)&&dt>0)s.time+=dt;}
export const colour=o=>{const c=composition(o).complex,f=Math.min(1,c/.00025);return `rgb(${Math.round(205-35*f)},${Math.round(230-185*f)},${Math.round(225-185*f)})`;};

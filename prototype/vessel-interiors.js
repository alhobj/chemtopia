// Interior traces measured against the selected B atlas and its runtime crops.
// Coordinates are independent of collision bodies: glass walls, feet, rims,
// shoulders and dispensing hardware are never part of the liquid cavity.
export function vesselInterior(kind,lab,w,h){
 const X=n=>+(n*w).toFixed(3),Y=n=>+(n*h).toFixed(3);
 let path,top=Y(.23),bottom=Y(.84),cx=0,half=X(.35),surfaceOnly=false,surfaceY=0,surfaceRy=0;
 if(kind==='beaker'){
  cx=X(.04);half=X(.40);path=`M${X(-.36)} ${top}Q${cx} ${Y(.255)} ${X(.44)} ${top}V${Y(.80)}Q${cx} ${Y(.87)} ${X(-.36)} ${Y(.80)}Z`;
 }else if(kind==='flask'&&lab==='distillation'){
  top=9;bottom=124;half=32;path='M-4 9H4V48C36 57 44 105 20 121Q0 131-20 121C-44 105-36 57-4 48Z';
 }else if(kind==='flask'){
  top=7;bottom=115;half=25;path='M-5 7H5V47C5 63 27 67 28 89V106Q28 116 18 116H-18Q-28 116-28 106V89C-27 67-5 63-5 47Z';
 }else if(kind==='conical'){
  top=Y(.12);bottom=Y(.88);half=X(.34);path=`M${X(-.065)} ${top}H${X(.065)}V${Y(.31)}L${X(.36)} ${Y(.84)}Q${X(.38)} ${Y(.89)} ${X(.29)} ${Y(.89)}H${X(-.29)}Q${X(-.38)} ${Y(.89)} ${X(-.36)} ${Y(.84)}L${X(-.065)} ${Y(.31)}Z`;
 }else if(kind==='cylinder'){
  top=12;bottom=103;cx=1;half=7;path='M-6 12H8V100Q1 106-6 100Z';
 }else if(kind==='chamber'){
  top=16;bottom=216;cx=X(-.025);half=X(.345);path=`M${X(-.37)} ${top}H${X(.32)}V${bottom}H${X(-.37)}Z`;
 }else if(kind==='bottle'){
  top=Y(.37);bottom=Y(.93);half=X(.32);path=`M${X(-.12)} ${top}H${X(.12)}V${Y(.43)}Q${X(.34)} ${Y(.47)} ${X(.34)} ${Y(.56)}V${Y(.88)}Q0 ${Y(.96)} ${X(-.34)} ${Y(.88)}V${Y(.56)}Q${X(-.34)} ${Y(.47)} ${X(-.12)} ${Y(.43)}Z`;
 }else if(kind==='wash'){
  top=Y(.45);bottom=Y(.92);cx=X(-.165);half=X(.21);path=`M${X(-.19)} ${top}H${X(-.08)}Q${X(.05)} ${Y(.51)} ${X(.05)} ${Y(.60)}V${Y(.88)}Q${cx} ${Y(.98)} ${X(-.38)} ${Y(.88)}V${Y(.60)}Q${X(-.38)} ${Y(.51)} ${X(-.19)} ${top}Z`;
 }else if(kind==='boat'){
  top=4;bottom=15;half=21;path='M-21 4L25 5L16 16H-19Z';
 }else if(['basin','cup','can'].includes(kind)){
  surfaceOnly=true;
  const shape={basin:{cx:0,cy:23,rx:59,ry:11},cup:{cx:0,cy:23,rx:34,ry:10},can:{cx:0,cy:20,rx:35,ry:8}}[kind];
  cx=shape.cx;half=shape.rx;surfaceY=shape.cy;surfaceRy=shape.ry;top=surfaceY-surfaceRy;bottom=surfaceY+surfaceRy;
  path=`M${cx-half} ${surfaceY}a${half} ${surfaceRy} 0 1 0 ${half*2} 0a${half} ${surfaceRy} 0 1 0 ${-half*2} 0Z`;
 }else throw Error('No vessel interior: '+kind);
 return{path,top,bottom,cx,half,surfaceOnly,surfaceY,surfaceRy};
}

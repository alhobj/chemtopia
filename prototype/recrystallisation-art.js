import {EPS,description} from './recrystallisation-model.js';
const dots=(amount,initial,width,height,offsetY=0)=>Array.from({length:Math.ceil(Math.min(1,amount/initial)*30)},(_,i)=>{
 const x=((i*37+13)%97)/97*(width-12)-width/2+6,y=((i*53+7)%89)/89*Math.max(3,height-7)+offsetY+4;
 return `<rect x="${x}" y="${y}" width="3.2" height="2.4" rx=".6" fill="${i%2?'#b38041':'#d4ac68'}"/>`;
}).join('');
function beakerArt(o){
 const h=o.id==='source'?112:96,w=o.id==='source'?92:78,level=(o.water+o.sand+o.raw+o.dissolved+o.crystals)/o.capacity,fillH=Math.max(0,(h-16)*level),fillY=h-8-fillH;
 return `<ellipse cx="5" cy="${h+7}" rx="${w/2+7}" ry="7" fill="#324b4318"/>
 <defs><clipPath id="inside-${o.id}"><path d="M${-w/2+5} 5H${w/2-5}V${h-12}Q${w/2-5} ${h-5} ${w/2-12} ${h-5}H${-w/2+12}Q${-w/2+5} ${h-5} ${-w/2+5} ${h-12}Z"/></clipPath></defs>
 <path d="M${-w/2} 0H${w/2-8}L${w/2+5} -4L${w/2} 7V${h-10}Q${w/2} ${h} ${w/2-12} ${h}H${-w/2+12}Q${-w/2} ${h} ${-w/2} ${h-10}Z" fill="url(#glass)" stroke="#354f60" stroke-width="3" stroke-linejoin="bevel"/>
 <g clip-path="url(#inside-${o.id})">${fillH>0?`<rect x="${-w/2}" y="${fillY}" width="${w}" height="${fillH+3}" fill="url(#liquid)"/><ellipse cx="0" cy="${fillY}" rx="${w/2}" ry="3.5" fill="#b3e0e4" stroke="#72b6c1"/>`:''}${dots(o.sand,.02,w-4,fillH,fillY)}${dots(o.raw+o.crystals,.2,w-4,Math.max(8,fillH),h-22).replaceAll('#b38041','#f8f4dd').replaceAll('#d4ac68','#cbd3da')}</g>
 <path d="M${-w/2+7} 13V${h-16}" stroke="#fffdf4" stroke-width="4" opacity=".8"/><path d="M${w/2-11} 18V${h-18}" stroke="#91b9be" stroke-width="2" opacity=".7"/>
 <path d="M${-w/2-3} 0H${w/2-8}L${w/2+5} -4" stroke="#354f60" stroke-width="3" fill="none"/>
 <path d="M${-w/2+8} ${h-3}H${w/2-12}" stroke="#e2f4ef" stroke-width="3"/><rect class="select-outline" x="${-w/2-9}" y="-14" width="${w+24}" height="${h+25}" rx="7"/>`;
}
function art(o){
 if(o.kind==='beaker')return beakerArt(o)+`<text class="experiment-readout" x="0" y="-22" text-anchor="middle">${description(o)}</text>`;
 if(o.kind==='heater')return `<rect x="-60" width="120" height="58" rx="9" fill="#d4ded5" stroke="#354f60" stroke-width="3"/><path d="M-52 5H52" stroke="${o.on?'#d49150':'#92a3a0'}" stroke-width="8"/><circle cx="30" cy="34" r="12" fill="#506d72"/><text x="-28" y="39" font-size="12">${o.on?'ON':'OFF'}</text><rect class="select-outline" x="-70" y="-10" width="140" height="80" rx="6"/>`;
 if(o.kind==='stand')return `<ellipse cx="-8" cy="7" rx="60" ry="10" fill="#324b4318"/><path d="M-43 -7H16L35 4L27 16H-48L-57 6Z" fill="#4c616e" stroke="#304454" stroke-width="3"/><path d="M-43 -7H16L35 4H-57Z" fill="#7d929b"/><rect x="-5" y="-231" width="10" height="226" rx="3" fill="url(#metal)" stroke="#304454" stroke-width="2.5"/><path d="M0 -172H58" stroke="#334b5c" stroke-width="9"/><ellipse cx="90" cy="-172" rx="30" ry="9" fill="none" stroke="#334b5c" stroke-width="5"/><path d="M62 -176H1" stroke="#a9bec1" stroke-width="3"/><rect x="-12" y="-183" width="23" height="22" rx="3" fill="#4b626d" stroke="#304454" stroke-width="2"/><circle cy="-172" r="4" fill="#d8d8bf"/><rect class="select-outline" x="-63" y="-245" width="200" height="272" rx="7"/>`;
 if(o.kind==='funnel')return `<path d="M-57 0H57L9 48V78H-9V48Z" fill="url(#glass)" stroke="#354f60" stroke-width="3" stroke-linejoin="bevel"/><ellipse cy="0" rx="58" ry="10" fill="#dbf3f0" fill-opacity=".6" stroke="#354f60" stroke-width="3"/><path d="M-45 10L-5 45V70" stroke="#f8fff9" stroke-width="4" fill="none" opacity=".9"/><path d="M9 48L45 9" stroke="#91bbc5" stroke-width="3" fill="none"/><rect class="select-outline" x="-70" y="-18" width="140" height="110" rx="7"/>`;
 return `<path d="M-44 0Q0 -14 44 0L0 38Z" fill="#fff8df" stroke="#8b8e7e" stroke-width="2"/><ellipse cy="0" rx="44" ry="8" fill="#fffdf0" stroke="#8b8e7e" stroke-width="2"/><path d="M-33 2L0 34L29 2" fill="none" stroke="#d5d2b8" stroke-width="2"/>
 ${o.sand+o.raw+o.crystals>EPS?`<path d="M-22 8Q0 1 22 8L0 29Z" fill="${o.sand>EPS?'#bb904f':'#e3e7d8'}"/>${dots(o.sand,.02,34,13,7)}${dots(o.raw+o.crystals,.2,34,13,7).replaceAll('#b38041','#f8f4dd').replaceAll('#d4ac68','#cbd3da')}`:''}<rect class="select-outline" x="-55" y="-17" width="110" height="69" rx="7"/>`;
}

export {art};

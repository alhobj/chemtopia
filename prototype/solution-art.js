import {solid,reading} from './solution-model.js';
const line='stroke="#354f60" stroke-width="2.5" stroke-linejoin="round"';
export function art(o,s){
 let drawing='',w=80,h=100;
 if(o.kind==='balance'){w=160;h=60;drawing=`<rect x="-75" y="20" width="150" height="40" rx="8" fill="#b7cac3" ${line}/><rect x="-62" y="4" width="124" height="16" rx="3" fill="url(#metal)" ${line}/><rect x="-53" y="29" width="89" height="23" rx="2" fill="#eff5dc"/><text id="balance-reading" x="-9" y="46" text-anchor="middle" font-family="monospace" font-size="16">${reading(s)} g</text><circle cx="54" cy="40" r="9" fill="#286761"/>`;}
 else if(o.kind==='spatula'||o.kind==='rod'||o.kind==='pipette'){w=26;h=100;drawing=o.kind==='pipette'?`<path d="M-3 10V95H3V10" fill="url(#glass)" ${line}/><ellipse cy="40" rx="10" ry="22" fill="${o.water>0?'url(#liquid)':'url(#glass)'}" ${line}/><ellipse cy="0" rx="13" ry="16" fill="#8caaa6" ${line}/><path d="M-9 16H9" stroke="#bc874a" stroke-width="2"/><text x="18" y="45" font-size="12">${o.water.toFixed(2)} mL</text>`:o.kind==='rod'?`<rect x="-3" width="6" height="100" rx="3" fill="url(#glass)" ${line}/>`:`<path d="M-3 0H3V45H9V70H-9V45H-3Z" fill="url(#metal)" ${line}/>${o.salt>0?'<ellipse cy="58" rx="7" ry="10" fill="#f8f0d5"/>':''}`;}
 else if(o.kind==='stopper'){w=26;h=16;drawing=`<path d="M-12 0H12L9 16H-9Z" fill="#b3a48a" ${line}/>`;}
 else if(o.kind==='transferFunnel'){w=66;h=75;drawing=`<path d="M-33 0H33L4 33V75H-4V33Z" fill="url(#glass)" ${line}/>`;}
 else{
 const flask=o.kind==='flask',boat=o.kind==='boat',bottle=['bottle','wash'].includes(o.kind);w=boat?72:bottle?65:78;h=flask?130:boat?28:bottle?110:96;
 const outline=flask?'M-12 0V40C-12 55-38 59-38 91V122Q-38 130-30 130H30Q38 130 38 122V91C38 59 12 55 12 40V0Z':boat?'M-36 0L-32 27H32L36 0Z':`M${-w/2} 0V${h-6}Q${-w/2} ${h} ${-w/2+6} ${h}H${w/2-6}Q${w/2} ${h} ${w/2} ${h-6}V0Z`;
 const top=flask?(o.water<=80?128-o.water*.85:60-(o.water-80)*2):h-5-(h-14)*Math.min(1,o.water/o.capacity);
 drawing=`<defs><clipPath id="vessel-${o.id}"><path d="${outline}"/></clipPath></defs><path d="${outline}" fill="${boat?'#eae3ca':'url(#glass)'}" ${line}/><g clip-path="url(#vessel-${o.id})">${o.water>0?`<rect x="-38" y="${top}" width="76" height="${h-top}" fill="url(#liquid)" opacity=".65"/><path d="M-38 ${top}Q0 ${top+3}38 ${top}" fill="none" stroke="#6aa2ad" stroke-width="2"/>`:''}${solid(o)>0?`<path d="M-30 ${h-5}H30L25 ${h-9-Math.min(50,solid(o)*40)}H-25Z" fill="#f5edce" stroke="#c5bba3"/>`:''}</g>`;
 if(flask)drawing+=`<path d="M-14 20H14" stroke="#bc874a" stroke-width="2"/><text y="96" text-anchor="middle" font-size="11">${o.id==='stock'?'STOCK':'DILUTION'}</text><text y="111" text-anchor="middle" font-size="10">100 mL</text>`;
 if(o.kind==='wash')drawing+=`<path d="M-8 0V-15H30V-3" fill="none" ${line}/><text y="65" text-anchor="middle" font-size="10">WATER</text>`;
 if(o.kind==='bottle')drawing+='<rect x="-32" y="-6" width="64" height="12" fill="#65837e"/><text y="45" text-anchor="middle" font-size="14">NaCl</text>';
 }
 return `${drawing}<rect class="select-outline" x="${-w/2-8}" y="-22" width="${w+16}" height="${h+32}" rx="5"/>`;
}
export function meniscus(o){if(o.kind!=='flask')return '';const y=80+(100-o.water)*24;return `<svg viewBox="0 0 170 150" role="img" aria-label="Enlarged meniscus and 100 mL calibration line"><defs><clipPath id="neck-zoom"><rect x="50" y="5" width="70" height="130"/></clipPath></defs><g clip-path="url(#neck-zoom)"><rect x="50" y="${Math.min(145,Math.max(-40,y-7))}" width="70" height="180" fill="#9acdd4"/><path d="M50 ${y-7}Q85 ${y+7}120 ${y-7}" fill="none" stroke="#387a88" stroke-width="2"/></g><path d="M50 5V135M120 5V135" stroke="#647d84" stroke-width="3"/><path d="M40 80H130" stroke="#ae7539" stroke-width="2"/><text x="85" y="148" text-anchor="middle" font-size="12">100 mL mark</text></svg><p id="volume-reading">Solution volume: <strong>${o.water.toFixed(2)} mL</strong></p>`;}

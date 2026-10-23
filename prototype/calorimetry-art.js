import {balanceReading} from './calorimetry-model.js';
const line='stroke="#354f60" stroke-width="2.5" stroke-linejoin="round"';
export function art(o,s){let drawing='',w=80,h=100;
 if(o.kind==='thermometer'){w=52;h=170;drawing=`<path d="M-4 14V158A6 6 0 1 0 4 158V14Z" fill="url(#glass)" ${line}/><path d="M0 158V${150-Math.min(80,Math.max(0,o.reading-20))}" stroke="#b67d65" stroke-width="3"/>${Array.from({length:9},(_,i)=>`<path d="M5 ${35+i*13}h5" stroke="#607c85"/>`).join('')}<circle r="24" fill="#edf3e9" ${line}/><text id="temperature-reading" y="4" text-anchor="middle" font-family="monospace" font-size="13">${o.reading.toFixed(2)}°</text>`;}
 else if(o.kind==='rod'){w=10;h=100;drawing=`<rect x="-3" width="6" height="100" rx="3" fill="url(#glass)" ${line}/>`;}
 else if(o.kind==='lid'){w=106;h=10;drawing=`<path d="M-53 8Q-50 0-40 0H40Q50 0 53 8Z" fill="#e5dfca" ${line}/><path d="M-8 1H8" stroke="#7f9692" stroke-width="4"/>`;}
 else if(o.kind==='clampStand'){w=280;h=17;drawing=`<rect x="-5" y="-210" width="10" height="220" fill="url(#metal)" ${line}/><rect x="-50" y="2" width="100" height="16" fill="#819b99" ${line}/><path d="M0-145H180" stroke="#526f78" stroke-width="8"/>`;}
 else if(o.kind==='burner'){w=76;h=60;drawing=`<rect x="-35" y="10" width="70" height="50" rx="13" fill="url(#glass)" ${line}/><path d="M-29 48H29V${54-o.fuel*12}H-29Z" fill="#adc9d0" opacity=".55"/><rect x="-10" width="20" height="14" fill="#819494" ${line}/><path d="M0 1V-8" stroke="#b4a78d" stroke-width="5"/>${o.on?'<path d="M0-48Q-20-20-9-8Q0 3 10-8Q19-23 0-48Z" fill="#e3af56" opacity=".9"/><path d="M0-25Q-10-6 0-6Q10-6 0-25" fill="#87b7cc"/>':''}<text y="34" text-anchor="middle" font-size="10">ETHANOL</text>`;}
 else if(o.kind==='balance'){w=160;h=60;drawing=`<rect x="-75" y="20" width="150" height="40" rx="8" fill="#b7cac3" ${line}/><rect x="-62" y="4" width="124" height="16" rx="3" fill="url(#metal)" ${line}/><rect x="-53" y="29" width="110" height="23" fill="#eff5dc"/><text id="balance-reading" x="0" y="46" text-anchor="middle" font-family="monospace" font-size="15">${balanceReading(s).toFixed(3)} g</text>`;}
 else{const cylinder=o.kind==='cylinder',cup=o.kind==='cup',can=o.kind==='can';w=cylinder?44:cup?98:can?100:78;h=cylinder||cup?120:can?100:96;
 const outline=cup?'M-49 0L-41 120H41L49 0Z':`M${-w/2} 0V${h-6}Q${-w/2} ${h} ${-w/2+6} ${h}H${w/2-6}Q${w/2} ${h} ${w/2} ${h-6}V0Z`,top=h-6-(cylinder?96:h-18)*Math.min(1,o.water/o.capacity);
 drawing=`<defs><clipPath id="inside-${o.id}"><path d="${outline}"/></clipPath></defs><path d="${outline}" fill="${cup?'#eee6cf':can?'url(#metal)':'url(#glass)'}" ${line}/><g clip-path="url(#inside-${o.id})">${o.water>0?`<rect x="${-w/2+3}" y="${top}" width="${w-6}" height="${h-top}" fill="#99c9d3" opacity=".7"/><path d="M${-w/2} ${top}H${w/2}" stroke="#6a9dac" stroke-width="2"/>`:''}</g>`;
 if(cylinder)drawing+=Array.from({length:11},(_,i)=>`<path d="M-20 ${114-i*9.6}h${i%5===0?19:10}" stroke="#60808a" stroke-width="1"/>${i%5===0?`<text x="2" y="${117-i*9.6}" font-size="9">${i*10}</text>`:''}`).join('');
 if(o.id==='acid'||o.id==='base')drawing+=`<text y="49" text-anchor="middle" font-size="12">${o.id==='acid'?'HCl':'NaOH'}</text><text y="65" text-anchor="middle" font-size="11">1.00 M</text>`;
 if(o.id==='water')drawing+='<text y="57" text-anchor="middle" font-size="10">WATER</text>';
 if(can)drawing+='<text y="48" text-anchor="middle" font-size="12">Al</text>';
 }
 return drawing+`<rect class="select-outline" x="${-w/2-8}" y="${o.kind==='clampStand'?-220:-35}" width="${w+16}" height="${o.kind==='clampStand'?250:h+50}" rx="5"/>`;
}

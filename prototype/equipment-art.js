import {vesselInterior} from './vessel-interiors.js';
// Runtime skins adapted from the owner's row-B equipment studies. Simulation geometry
// stays authoritative: sprites use the same local mouth, tip, base and joint coordinates.
import {atlas,sprites} from './assets/design-b/atlas.js';
const rect=(x,y,w,h,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
export function sprite(name,x,y,w,h,part=null){
 const b=sprites[name];if(!b)throw Error('Missing design-B sprite: '+name);
 const crop=part?{x:b.x+b.w*part[0],y:b.y+b.h*part[1],w:b.w*part[2],h:b.h*part[3]}:b;
 return `<svg class="equipment-sprite" data-sprite="${name}" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${crop.x} ${crop.y} ${crop.w} ${crop.h}" preserveAspectRatio="none" overflow="hidden"><image href="${atlas.file}" width="${atlas.width}" height="${atlas.height}"/></svg>`;
}
const extracts=(html,re)=>(html.match(re)||[]).join('');
function overlays(html,image='',id='',extra=''){
 const maskId='contents-silhouette-'+id;
 const mask=image?`<defs><mask id="${maskId}" maskUnits="userSpaceOnUse" x="-200" y="-100" width="500" height="500" style="mask-type:alpha">${image}</mask></defs>`:'';
 return extracts(html,/<defs>[\s\S]*?<\/defs>/g)+mask+`<g ${image?`mask="url(#${maskId})"`:''}>`+extra+'<g class="equipment-contents">'+extracts(html,/<g clip-path="[^"]*">[\s\S]*?<\/g>/g)+'</g></g>'+extracts(html,/<text\b[^>]*>[\s\S]*?<\/text>/g)+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
}
const metal=(x,y,w,h)=>rect(x,y,w,h,'fill="#23344e"')+rect(x+1,y+1,Math.max(1,w-2),Math.max(1,h-2),'fill="#6b8b9d"')+rect(x+1,y+1,Math.max(1,w-2),Math.min(2,h-2),'fill="#c6e6e8"');
// Seven-segment glyphs sit inside the balance sprite's recessed LCD window.
function balanceDisplay(html){
 const value=html.match(/id="balance-reading"[^>]*>([^<]*)</)?.[1]||'0.000 g';
 const segments={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg','-':'g'};
 const paths={a:'M1 0H5L6 1 5 2H1L0 1Z',b:'M5 2L6 1 7 2V5L6 6 5 5Z',c:'M5 7L6 6 7 7V10L6 11 5 10Z',d:'M1 10H5L6 11 5 12H1L0 11Z',e:'M-1 7L0 6 1 7V10L0 11-1 10Z',f:'M-1 2L0 1 1 2V5L0 6-1 5Z',g:'M1 5H5L6 6 5 7H1L0 6Z'};
 let x=0,digits='';for(const c of value.replace(/\s*g$/,'')){
  if(c==='.'){digits+=`<rect x="${x}" y="10" width="1.6" height="2"/>`;x+=3;continue;}
  digits+=`<g transform="translate(${x} 0)">${Object.entries(paths).map(([key,d])=>`<path d="${d}" opacity="${(segments[c]||'').includes(key)?1:.07}"/>`).join('')}</g>`;x+=9;
 }
 return rect(-53,32,65,16,'rx="1" fill="#163e48" stroke="#8ba1aa" stroke-width="1"')+rect(-50,34,59,12,'fill="#76b3a7"')+`<g role="img" aria-label="${value}" transform="translate(-47 35) scale(.72 .8)" fill="#153c3a">${digits}<text x="${x+1}" y="11" font-size="10" font-family="monospace">g</text></g><text id="balance-reading" visibility="hidden" aria-hidden="true">${value}</text>`;
}
function supports(o,lab){
 let bottom=[-57,-7,92,23],rod=[-5,-231,10,230],cx=90,cy=-172,ring=true;
 if(lab==='distillation'){const right=o.id==='support2';bottom=[right?-25:-65,-8,90,24];cx=right?-195:90;cy=right?-134:-162;}
 if(lab==='titration'){bottom=[-70,1,140,16];rod=[-5,-320,10,320];cx=130;cy=-275;ring=false;}
 if(lab==='combustion'){bottom=[-50,2,100,16];rod=[-5,-210,10,220];cx=110;cy=-145;ring=false;}
 let image=sprite('stand',...bottom,[0,.78,1,.22])+sprite('stand',...rod,[.43,0,.12,.80]);
 image+=metal(Math.min(0,cx),cy-4,Math.abs(cx),8);
 if(ring)image+=sprite('ring',cx-30,cy-9,60,18,[0,0,.70,1]);
 else if(lab==='combustion')image+=metal(40,cy-4,140,8);
 else image+=metal(cx-13,cy-10,4,20)+metal(cx+9,cy-10,4,20);
 return image;
}
function funnel(o){
 const filtration=o.kind==='funnel',w=filtration?114:o.kind==='fillingFunnel'?80:o.capacity===.2?66:60,neck=filtration?18:o.kind==='fillingFunnel'?10:o.capacity===.2?8:6,bowl=filtration?48:o.kind==='fillingFunnel'?36:o.capacity===.2?33:30,h=filtration?78:o.kind==='fillingFunnel'?76:o.capacity===.2?75:60;
 return sprite('funnel',-w/2,0,w,bowl,[0,0,1,.45])+sprite('funnel',-neck/2,bowl,neck,h-bowl,[.40,.45,.20,.55]);
}
// Contents have their own interior, rather than using the opaque sprite as a mask.
// This keeps particles off rims, labels and glass walls.
function vesselContents(o,html,lab,w,h){
 const k=o.kind,id='contents-interior-'+o.id,geometry=vesselInterior(k,lab,w,h),{path:interior,bottom,cx,half,surfaceOnly,surfaceY,surfaceRy}=geometry;
 const volume=(o.water||0)+(o.acetone||0),fraction=Math.max(0,Math.min(1,volume/(o.capacity||1)));
 let level=bottom-(bottom-geometry.top)*fraction;
 // Keep the existing 100 mL calibration at y=20 in the narrow flask neck.
 if(k==='flask'&&lab!=='distillation')level=volume<=80?115-volume*.6875:60-(volume-80)*2;
 if(k==='flask'&&lab==='distillation')level=fraction<=.9?124-75*fraction/.9:49-40*(fraction-.9)/.1;
 level=Math.max(geometry.top,Math.min(bottom,level));
 const original=html.match(/<g clip-path="[^"]*">([\s\S]*?)<\/g>/)?.[1]||'';
 const originalColour=original.match(/<rect[^>]*fill="([^"]*)"/)?.[1],colour=originalColour&&!originalColour.startsWith('url(')?originalColour:'#86bdce';
 let contents='';
 if(volume>0){
  if(surfaceOnly){
   // Ceramic/metal walls are opaque. Only the liquid surface inside the mouth
   // is visible, never a translucent fill painted across the outside wall.
   const inset=1-(1-fraction)*.20;
   contents=`<ellipse class="liquid-surface" cx="${cx}" cy="${surfaceY+2*(1-fraction)}" rx="${half*inset}" ry="${surfaceRy*inset}" fill="${colour}" opacity=".65"/>`;
  }else contents=`<g class="liquid-fill" transform="rotate(${-(o.angle||0)} ${cx} ${level})">`+rect(-w,level,w*2,h*3,`fill="${colour}" opacity=".42"`)+`<path class="liquid-surface" d="M${cx-half} ${level}Q${cx} ${level+2} ${cx+half} ${level}" fill="none" stroke="${colour}" stroke-width="1.4"/></g>`;
 }
 const salt='dissolved'in o?Math.max(0,(o.salt||0)-o.dissolved):lab==='evaporation'?Math.max(0,(o.salt||0)-(o.water||0)*.3):0;
 const materials=[{amount:o.sand||0,colour:'#bd975c'}, {amount:salt+(o.raw||0)+(o.crystals||0)+(o.chips||0)+(o.powder||0),colour:'#f5eccf'}];
 for(const m of materials){if(m.amount<=1e-9)continue;
  const saltBottle=k==='bottle'&&lab==='solution';
  const count=Math.min(saltBottle?360:70,Math.max(3,Math.ceil(m.amount*(o.capacity>2?80:220))));
  const base=surfaceOnly?surfaceY+surfaceRy*.55:k==='boat'?14:bottom-2;
  const spread=surfaceOnly?half*1.3:k==='flask'?w*.48:k==='conical'?w*.6:half*1.65;
  contents+=Array.from({length:count},(_,i)=>{const noise=n=>{const v=Math.sin(n*127.1+17)*43758.5453;return v-Math.floor(v);},x=cx+((saltBottle?noise(i):(i*37%97)/97)-.5)*spread,y=base-2-(saltBottle?noise(i+401):(i*29%17)/17)*Math.min(saltBottle?34:15,3+count*.18)*(saltBottle?1-Math.abs(x)/spread:1),r=saltBottle?.55+noise(i+803)*.65:o.powder>0?1:1.7;return `<path class="solid-grain" d="M${x} ${y-r}l${r+1} ${r} -${r} ${r+1} -${r+1}-${r}Z" fill="${i%3?m.colour:'#c7c6b3'}"/>`;}).join('');
 }
 return `<defs><clipPath id="${id}"><path d="${interior}"/></clipPath></defs><g class="vessel-contents" data-interior-kind="${k}" clip-path="url(#${id})">${contents}</g>`;
}
export function equipmentArt(o,html,lab,s){
 let image='',extra='',width=80,height=100,top=0;
 const k=o.kind;
 if(k==='stand'||k==='clampStand')return supports(o,lab)+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 if(['funnel','fillingFunnel','transferFunnel'].includes(k))return funnel(o)+overlays(html);
 if(k==='paper'){
  const fill=(o.sand||0)+(o.raw||0)+(o.crystals||0),count=Math.min(100,Math.ceil(fill*450));
  const grains=Array.from({length:count},(_,i)=>{const t=(i*.61803398875)%1,y=13+((i*37)%17),half=(32-y)*.85,x=(t-.5)*2*half,r=1+(i%3)*.25;return `<path class="solid-grain" d="M${x-r} ${y}l${r} -${r} ${r} ${r} -${r} ${r}Z" fill="${o.sand?['#b98c51','#d4b273','#98713f'][i%3]:['#efe7c9','#fff7e3','#d7cfb1'][i%3]}"/>`;}).join('');
  return sprite('filterPaper',-44,-5,88,43)+grains+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 }
 if(k==='chromPaper'||k==='ruler')return `<g class="pixel-measurement">${html}</g>`;
 if(k==='bar')return metal(-115,-6,230,12)+sprite('stopper',-10,-8,20,22)+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 if(k==='lid'){const chamber=lab==='chromatography';return sprite('lid',chamber?-100:-53,chamber?-6:0,chamber?200:106,chamber?12:10)+extracts(html,/<rect class="select-outline"[^>]*\/>/g);}
 if(k==='tap'||k==='drain')return `<g class="pixel-measurement">${html}</g>`;
 if(k==='head'){
  // Separate straight stem and sloped outlet: the B drawing must follow the live joint.
  const stem=sprite('head',-12,0,24,60,[0,0,.30,.75]);
  return stem+`<g transform="translate(12 45) rotate(17.1)">${sprite('condenser',0,-9,63,18,[.08,.34,.84,.32])}</g>`+overlays(html);
 }
 if(k==='condenser'){
  // Source tube is horizontal; its two endpoints follow the simulation's (0,0)–(230,70).
  image=`<g transform="rotate(16.9275)">${sprite('condenser',0,-19,240.4,38,[0,.30,1,.40])}</g>`;
  extra=`<path d="M30 -11L205 42L195 76L20 23Z" fill="#4bb6d2" opacity="${s.jacket*.32}"/>`+metal(41,-16,8,26)+metal(181,62,8,24)+extracts(html,/<circle[^>]*class="water-port"[^>]*\/>/g);
  return image+extra+overlays(html);
 }
 if(k==='heater')return sprite('hotplate',-60,0,120,58)+`<circle cx="-32" cy="33" r="4" fill="${o.on?'#f3ad48':'#617481'}"/><text x="0" y="40" text-anchor="middle" font-size="10" fill="#f3f5db">${o.on?'ON':'OFF'}</text>`+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 if(k==='balance')return sprite('balance',-75,0,150,60)+balanceDisplay(html)+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 if(k==='thermometer'){
  const distill=lab==='distillation',t=distill?o.temperature:o.reading;
  image=sprite('thermometer',distill?-5:-4,distill?0:14,distill?10:8,distill?65:150);
  const shaftTop=distill?9:35,bulb=distill?57:154,level=bulb-(distill?38:100)*Math.max(0,Math.min(1,(t-20)/80));
  extra=rect(-1.2,shaftTop,2.4,bulb-shaftTop,'fill="#d6eced"')+`<path d="M0 ${bulb}V${level}" stroke="#bd524b" stroke-width="2"/><circle cx="0" cy="${distill?-17:0}" r="${distill?19:24}" fill="#f5f4e7" stroke="#1e3653" stroke-width="2"/><text id="temperature-reading" x="0" y="${distill?-13:4}" text-anchor="middle" font-family="monospace" font-size="${distill?12:13}">${distill?Math.round(t):t.toFixed(2)+'°'}</text>${distill?'<text x="0" y="-2" text-anchor="middle" font-size="8">°C</text>':''}`;
  return image+extra+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 }
 if(k==='burette'){
  const y=225*(1-o.water/50),clip='burette-interior-'+o.id;
  return sprite('rod',-12,0,24,225)+`<defs><clipPath id="${clip}"><rect x="-3" y="2" width="6" height="221"/></clipPath></defs><g class="vessel-contents" clip-path="url(#${clip})">`+rect(-3,y,6,225-y,'fill="#72bed3" opacity=".5"')+'</g>'+metal(-3,225,6,25)+metal(-17,228,34,7)+extracts(html,/<path d="M-10 [^"]*"[^>]*\/>/g)+overlays(html);
 }
 if(k==='probe')return sprite('probe',-31,-30,62,36,[0,0,1,.23])+sprite('probe',-4,0,8,110,[.36,.23,.28,.77])+rect(-29,-28,58,31,'fill="#eff5dc"')+overlays(html);
 if(k==='pipette'){width=lab==='titration'?28:26;height=lab==='titration'?127:116;top=lab==='titration'?-17:-16;image=sprite('pipette',-width/2,top,width,height);if(o.water>0){const clip='pipette-interior-'+o.id,f=Math.min(1,o.water/(o.capacity||o.water));extra=`<defs><clipPath id="${clip}"><path d="M-1.1 0V24C-7 29-7 41-1.1 46V94H1.1V46C7 41 7 29 1.1 24V0Z"/></clipPath></defs><g class="vessel-contents" clip-path="url(#${clip})">`+rect(-9,94-94*f,18,94*f,'fill="#76bad3" opacity=".5"')+'</g>'; }}
 else if(k==='rod'){width=6;height=100;image=sprite('rod',-3,0,6,100);}
 else if(k==='spatula'){width=18;height=70;image=sprite('spatula',-9,0,18,70);if(o.salt>0)extra='<ellipse cy="58" rx="6" ry="9" fill="#f8f0d5"/>';}
 else if(k==='stopper'){width=24;height=16;image=sprite('stopper',-12,0,24,16);}
 else if(k==='marker'||k==='pencil'){width=16;height=k==='marker'?70:90;image=sprite(k,-8,0,16,height);if(k==='marker')extra=rect(-6,9,12,26,`fill="${{green:'#397e56',purple:'#77538c',black:'#34444d'}[o.id]}"`);}
 else if(k==='dropper'){width=20;height=50;image=sprite('bottle',-10,0,20,35)+sprite('pipette',-4,34,8,16,[.4,.7,.2,.3]);}
 else if(k==='burner'){width=70;height=60;image=sprite('burner',-35,0,70,60);if(o.on)extra='<path d="M0-48L-12-25-9-8 0-3 9-8 12-25Z" fill="#f0b44f"/><path d="M0-25L-5-11 0-6 5-11Z" fill="#76b9d2"/>';}
 else{
  let name;
  if(k==='flask'&&lab==='distillation'){name='roundFlask';width=92;height=140;}
  else if(k==='flask'){name='volumetric';width=76;height=130;}
  else if(k==='conical'){name='conical';width=110;height=120;}
  else if(k==='basin'){name='basin';width=160;height=80;}
  else if(k==='cup'){name='cup';width=98;height=120;}
  else if(k==='can'){name='can';width=100;height=100;}
  else if(k==='cylinder'){name='cylinder';width=44;height=120;}
  else if(k==='boat'){name='boat';width=72;height=28;}
  else if(k==='wash'){name='wash';width=65;height=110;}
  else if(k==='bottle'){name='bottle';width=lab==='titration'?69:60;height=lab==='solution'?100:110;}
  else if(k==='chamber'){name='chamber';width=200;height=220;}
  else if(k==='beaker'){name='beaker';const large=o.id==='source'&&!['neutralisation','combustion'].includes(lab);width=large?92:78;height=large?112:96;}
  else throw Error('Unmapped design-B equipment: '+lab+'/'+k);
  if(k==='beaker')image=`<g transform="scale(-1 1)">${sprite(name,-width*.66,0,width*1.21,height)}</g>`;
  else if(k==='chamber')image=sprite(name,-100,0,200,216,[0,.24,1,.62])+sprite(name,-100,216,200,4,[0,.86,1,.14])+sprite(name,-100,-24,200,40,[0,0,1,.24]);
  else if(k==='cylinder')image=sprite(name,-22,0,44,114,[.18,0,.64,.88])+sprite(name,-22,114,44,6,[0,.88,1,.12]);
  else if(name==='volumetric')image=sprite(name,-14,0,28,44,[.30,0,.40,.45])+sprite(name,-width/2,44,width,height-44,[0,.45,1,.55]);
  else image=sprite(name,-width/2,0,width,height);
  if(k==='bottle'&&lab!=='solution')extra+=rect(-width*.43,44,width*.86,44,'fill="#f5eed9"');
  if(k==='bottle'&&lab==='solution')html=html.replace(/<text y="45"[^>]*>NaCl<\/text>/,'<text y="40" text-anchor="middle" font-size="9" fill="#fff1d1">NaCl</text>');
  if(name==='volumetric')extra+='<path d="M-12 20H12" stroke="#bc874a" stroke-width="2"/>';
  if(k==='cylinder')extra+=Array.from({length:11},(_,i)=>`<path d="M-20 ${114-i*9.6}h${i%5===0?19:10}" stroke="#385577"/>${i%5===0?`<text x="2" y="${117-i*9.6}" font-size="9">${i*10}</text>`:''}`).join('');
 }
 if(['beaker','flask','conical','basin','boat','cup','can','cylinder','chamber','bottle','wash'].includes(k))return image+vesselContents(o,html,lab,width,height)+extra+extracts(html,/<text\b[^>]*>[\s\S]*?<\/text>/g)+extracts(html,/<rect class="select-outline"[^>]*\/>/g);
 return image+overlays(html,('water'in o&&!['pipette','spatula','dropper'].includes(k))?image:'',o.id,extra);
}

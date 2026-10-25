import {dragStored,menuPoint,hoverMenu} from './equipment-menu-helpers.mjs';
// Real Chromium input tests through CDP, without a browser automation dependency.
import {spawn} from 'node:child_process';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import net from 'node:net';
import assert from 'node:assert/strict';
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const freePort=()=>new Promise(resolve=>{const server=net.createServer().listen(0,'127.0.0.1',()=>{const port=server.address().port;server.close(()=>resolve(port));});});
const port=await freePort(),debugPort=await freePort(),base=`http://127.0.0.1:${port}`;
const profile=await mkdtemp(path.join(tmpdir(),'chemtopia-browser-'));
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:'pipe'});
const chrome=spawn(process.env.CHROMIUM||'/usr/bin/chromium',['--headless','--no-sandbox','--disable-dev-shm-usage','--disable-gpu','--disable-background-networking','--no-first-run',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
let ws;const pending=new Map();let sequence=0;const exceptions=[];
try{
 let tabs;
 for(let i=0;i<60;i++){try{tabs=await(await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();if(tabs.length)break;}catch{}await pause(100);}
 assert.ok(tabs?.length,'Chromium started');
 ws=new WebSocket(tabs[0].webSocketDebuggerUrl);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',j,{once:true});});
 ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails);if(m.id){const p=pending.get(m.id);pending.delete(m.id);clearTimeout(p.timeout);m.error?p.reject(m.error):p.resolve(m.result);}});
 function send(method,params={}){return new Promise((resolve,reject)=>{const id=++sequence;const timeout=setTimeout(()=>{pending.delete(id);reject(Error('CDP timed out: '+method));},10000);pending.set(id,{resolve,reject,timeout});ws.send(JSON.stringify({id,method,params}));});}
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
 await send('Runtime.enable');await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});

 for(let i=0;i<50;i++){try{if((await fetch(base+'/vessel-preview.html')).ok)break;}catch{}await pause(100);}
 await send('Page.navigate',{url:base+'/vessel-preview.html'});
 for(let i=0;i<60;i++){try{if(await evaluate("document.querySelectorAll('.vessel-sample').length===56"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.vessel-sample').length"),56);
 const evidence=await evaluate(`(async()=>{
  const {equipmentArt}=await import('./equipment-art.js');const {art:ratesArt}=await import('./rates-art.js');
  const cases=[
   ['vial','rates',20,[[0,2],[8,25],[0,45]],[0,34]],
   ['burette','titration',50,[[8,120],[-8,120],[0,0],[0,224]],[0,200]],
   ['pipette','solution',10,[[8,35],[3,70],[0,-5],[0,98]],[0,90]],
   ['beaker','filtration',1,[[0,8],[-34,50],[39,50],[0,91],[45,16]],[3,70]],
   ['beaker','filtration',1,[[0,8],[-41,60],[47,60],[0,108]],[4,80],'source'],
   ['conical','titration',1,[[0,3],[50,90],[0,117]],[0,90]],
   ['flask','solution',110,[[0,2],[32,90],[0,126]],[0,100]],
   ['flask','distillation',1,[[0,3],[-42,90],[0,137]],[0,90]],
   ['cylinder','neutralisation',1,[[0,5],[15,65],[0,116]],[1,90]],
   ['chamber','chromatography',1,[[-90,140],[88,140],[0,219],[0,3]],[-5,170]],
   ['bottle','titration',1,[[0,10],[27,70],[0,107]],[0,80]],
   ['wash','solution',1,[[0,30],[12,75],[0,107]],[-11,85]],
   ['basin','evaporation',1,[[0,60],[-72,23],[0,4]],[0,23]],
   ['cup','neutralisation',1,[[0,90],[0,3]],[0,23]],
   ['can','combustion',1,[[0,70],[0,3]],[0,20]],
  ];
  let protectedChecks=0,insideChecks=0;
  for(const [kind,lab,capacity,protectedPoints,inside,itemId]of cases)for(const fraction of [.5,.95])for(const angle of [0,55,-35]){
   const o={id:itemId||'pixel-'+kind,kind,water:capacity*fraction,capacity,angle,sand:0,salt:0},html=kind==='vial'?ratesArt(o,{}):equipmentArt(o,'',lab,{}),host=document.createElementNS('http://www.w3.org/2000/svg','svg');host.innerHTML=html;
   const group=host.querySelector('.vessel-contents'),defs=[...host.querySelectorAll('defs')].map(d=>d.outerHTML).join('');
   const svg='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="640" viewBox="-150 -40 300 320">'+defs+group.outerHTML+'</svg>';
   const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(svg);await img.decode();
   const canvas=document.createElement('canvas');canvas.width=600;canvas.height=640;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
   const alpha=([x,y])=>ctx.getImageData(Math.round((x+150)*2),Math.round((y+40)*2),1,1).data[3];
   for(const point of protectedPoints){if(alpha(point)>0)throw Error(kind+'/'+lab+' liquid crosses protected rim/wall/base at '+point+' angle '+angle);protectedChecks++;}
   if(angle===0){if(!alpha(inside))throw Error(kind+' expected visible liquid inside');insideChecks++;}
  }
  return{protectedChecks,insideChecks};
 })()`);
 assert.ok(evidence.protectedChecks>200);assert.equal(evidence.insideChecks,30);
 await evaluate("document.querySelector('.vessel-study').scrollIntoView()");
 const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),'chemtopia-vessel-interiors.png'),Buffer.from(screenshot.data,'base64'));
 await evaluate("[...document.querySelectorAll('.vessel-study')].find(e=>e.querySelector('h2').textContent==='Chromatography chamber').scrollIntoView()");const chamberShot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),'chemtopia-chamber-interior.png'),Buffer.from(chamberShot.data,'base64'));

 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),true);
 assert.deepEqual(exceptions,[]);console.log('PASS 56 container studies; '+evidence.protectedChecks+' rasterised rim/wall/base exclusions, 30 visible interior fills, tilted clipping and phone layout');
}finally{if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}

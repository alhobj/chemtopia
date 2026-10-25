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
 for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch{}await pause(100);}
 await send('Page.navigate',{url:base+'/index.html'});
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===6"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),6);
 const key=async(key,code=key)=>{const windowsVirtualKeyCode=({Enter:13,Escape:27,Tab:9,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,Space:32})[code]||0;await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode,text:key==='Enter'?'\r':key===' '?' ':undefined});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode});};
 const point=async(id,dx=0,dy=40)=>evaluate(`(()=>{const o=document.querySelector('[data-id="${id}"]');const p=new DOMPoint(${dx},${dy}).matrixTransform(o.getScreenCTM());return {x:p.x,y:p.y};})()`);
 const click=async selector=>{if(selector.includes('data-equipment')){await hoverMenu(send,evaluate,pause);}else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:800,y:400});await pause(50);}const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
 async function drag(id,x,y,dy=40,release=true,waypoints=[]){
  const stored=await dragStored({id,x,y,release,send,evaluate,pause});if(stored)return stored;
  await evaluate("document.querySelector('#bench').scrollIntoView({block:'center'})");
  const start=await point(id,0,dy);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...start});
  const offset=await evaluate(`(()=>{const m=document.querySelector('#bench').getScreenCTM();const anchor=new DOMPoint(0,0).matrixTransform(document.querySelector('[data-id="${id}"]').getScreenCTM()).matrixTransform(m.inverse());const p=new DOMPoint(${start.x},${start.y}).matrixTransform(m.inverse());return {x:p.x-anchor.x,y:p.y-anchor.y};})()`);
  let current=start,end=start;
  for(const destination of [...waypoints,{x,y}]){
   end=await evaluate(`(()=>{const p=new DOMPoint(${destination.x+offset.x},${destination.y+offset.y}).matrixTransform(document.querySelector('#bench').getScreenCTM());return {x:p.x,y:p.y};})()`);
   for(let i=1;i<=6;i++)await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:current.x+(end.x-current.x)*i/6,y:current.y+(end.y-current.y)*i/6});
   current=end;
  }
  const drop=()=>send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...end});
  drop.move=async(x,y)=>{const next=await evaluate(`(()=>{const p=new DOMPoint(${x+offset.x},${y+offset.y}).matrixTransform(document.querySelector('#bench').getScreenCTM());return {x:p.x,y:p.y};})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...next});end=next;};
  if(release)await drop();return drop;
 }
 const screenshot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};

 await send('Page.navigate',{url:base+'/laboratory.html'});
 for(let i=0;i<60;i++){try{if(await evaluate("document.querySelectorAll('.bench-experiment').length===13"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.bench-experiment').length"),13);
 assert.equal(await evaluate("new Promise(resolve=>{const i=document.querySelector('.room-background');if(i.complete)resolve(i.naturalWidth>0);else i.onload=()=>resolve(i.naturalWidth>0);})"),true);
 const labs=await evaluate("[...document.querySelectorAll('.bench-experiment')].map(a=>({id:a.dataset.lab,href:a.getAttribute('href')}))");
 await screenshot('chemtopia-laboratory-desktop.png');
 await send('Page.bringToFront');await key('Tab');await evaluate("document.querySelector('[data-lab=distillation]').focus()");await pause(100);assert.equal(await evaluate("document.querySelector('#detail-name').textContent"),'Distillation');await key('Enter');
 for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#equipment-menu')"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.experiment-switch a').length"),1);
 await click('#return-laboratory');await pause(400);
 for(const lab of labs){
  for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#laboratory-room')"))break;}catch{}await pause(100);}
  await click('[data-lab='+lab.id+'] .bench-label');
  for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#equipment-menu')"))break;}catch{}await pause(100);}
  assert.equal(await evaluate("location.pathname"),'/'+lab.href);
  assert.equal(await evaluate("document.querySelectorAll('.experiment-switch a').length"),1);
  await click('#return-laboratory');await pause(150);
 }
 // A click on the painted apparatus itself must not be stolen by another preview.
 const painted=await evaluate(`(()=>{const p=new DOMPoint(80,90).matrixTransform(document.querySelector('[data-lab=solution] > svg').getScreenCTM());return{x:p.x,y:p.y};})()`);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...painted});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...painted});
 for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#equipment-menu')"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("location.pathname"),'/solution.html');
 await click('#return-laboratory');await pause(350);
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Page.navigate',{url:base+'/laboratory.html'});await pause(600);
 assert.equal(await evaluate("document.querySelector('#experiment-list').hidden"),false);
 assert.equal(await evaluate("document.querySelectorAll('.experiment-card').length"),13);
 assert.ok(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"));
 assert.ok(await evaluate("[...document.querySelectorAll('.experiment-card')].every(a=>a.getBoundingClientRect().height>=44)"));
 await screenshot('chemtopia-laboratory-mobile.png');
 await click('[data-list-lab=combustion]');await pause(400);assert.equal(await evaluate("location.pathname"),'/combustion.html');
 assert.deepEqual(exceptions,[]);console.log('PASS selected room background, thirteen bench previews, keyboard launch, all lab round trips, single return link and phone list');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

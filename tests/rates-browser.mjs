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

 await send('Page.navigate',{url:base+'/rates.html'});
 for(let i=0;i<60;i++){try{if(await evaluate("document.querySelectorAll('.equipment-button').length===11"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),11);await pause(300);
 const press=async()=>{await key(' ','Space');await pause(50);};
 const cmd=async command=>{await evaluate(`document.querySelector('[data-command="${command}"]').focus()`);await key('Enter');await evaluate("document.querySelector('#bench').focus()");};
 const select=async id=>click('[data-equipment='+id+']');
 async function prepare(kind){
  await drag(kind,600,300,40);await pause(500);
  const spatula=await drag('spatula',600,330,40,false);
  for(let i=0;i<2;i++){await spatula.move(600,330);await press();assert.match(await evaluate("document.querySelector('#action-note').textContent"),/One solid/);await spatula.move(420,360);await press();assert.match(await evaluate("document.querySelector('#action-note').textContent"),/One solid/);}
  await spatula.move(420,60);await spatula.move(950,60);await spatula.move(950,180);await spatula();
  await drag('vial',330,475,20);await pause(700);
  const acid=await drag('acid',330,320,40,false,[{x:140,y:200},{x:330,y:200}]);await press();assert.match(await evaluate("document.querySelector('#action-note').textContent"),/One liquid/);await acid.move(140,200);await acid.move(140,429);await acid();
  await select('vial');assert.match(await evaluate("document.querySelector('#instrument').textContent"),/10.0 mL/);const vial=await drag('vial',420,360,20,false,[{x:330,y:250}]);await press();assert.match(await evaluate("document.querySelector('#action-note').textContent"),/vial seated/);await vial();
  const syringe=await drag('syringe',470,298,0,false);await cmd('clamp');await syringe();
  const bung=await drag('bung',420,385,7,false);await press();await bung();
  await select('syringe');await click('#action');assert.match(await evaluate("document.querySelector('#connection-status').textContent"),/tight seal/);
  await click('#logger');await select('flask');await click('#action');assert.match(await evaluate("document.querySelector('#action-note').textContent"),/reactants are now in contact/);
 }
 await prepare('chips');await pause(11000);await click('#record');await screenshot('chemtopia-rates-chips.png');
 const chips=await evaluate("parseFloat(document.querySelector('#gas-reading').textContent)");assert.ok(chips>5);
 await click('#save-trial');await click('#next-trial');await pause(300);await prepare('powder');await pause(11000);await click('#record');
 const powder=await evaluate("parseFloat(document.querySelector('#gas-reading').textContent)");assert.ok(powder>chips*1.25,`${powder} should exceed ${chips}`);
 await click('#save-trial');assert.equal(await evaluate("document.querySelectorAll('#rates-graph polyline').length"),2);
 assert.match(await evaluate("document.querySelector('#trial-summary').textContent"),/matched amounts/);
 await screenshot('chemtopia-rates-comparison.png');await click('#finish');assert.equal(await evaluate("document.querySelectorAll('#explanation fieldset').length"),3);
 await evaluate(`(()=>{const f=document.querySelector('#explanation');f.querySelector('input[value="0"]').checked=true;const p=[...document.querySelectorAll('#explanation legend')].map(e=>e.textContent);const nums=p[1].match(/At ([0-9.]+) s.*?([0-9.]+) mL; at ([0-9.]+) s.*?([0-9.]+) mL/);f.elements['q2-value'].value=(Number(nums[4])-Number(nums[2]))/(Number(nums[3])-Number(nums[1]));f.elements['q3-value'].value=.2/100.09*24000;f.requestSubmit();})()`);
 assert.match(await evaluate("document.querySelector('#question-feedback').textContent"),/Activity complete/);
 await screenshot('chemtopia-rates-review.png');await click('#restart');await click('#finish');assert.match(await evaluate("document.querySelector('#result').textContent"),/Supplied example/);
 assert.deepEqual(exceptions,[]);console.log('PASS real solid portions, inner vial, clamp, bung/tube, clock/logger, chips–powder curves, saved trials and numerical review');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

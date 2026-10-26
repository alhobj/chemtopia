import {visitLab as navigateLab} from './lab-navigation-helpers.mjs';
import {fillFollowups} from './review-browser-helpers.mjs';
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
 const click=async selector=>{if(selector.includes('data-equipment')){await hoverMenu(send,evaluate,pause);}else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:800,y:400});await pause(220);}const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
 async function drag(id,x,y,{dx=0,dy=40,release=true,path=[]}={}){
  const stored=await dragStored({id,x,y,release,send,evaluate,pause});if(stored)return stored;
  await evaluate("document.querySelector('#bench').scrollIntoView({block:'center'})");
  const start=await point(id,dx,dy);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...start});
  const offset=await evaluate(`(()=>{const m=document.querySelector('#bench').getScreenCTM(),a=new DOMPoint(0,0).matrixTransform(document.querySelector('[data-id="${id}"]').getScreenCTM()).matrixTransform(m.inverse()),p=new DOMPoint(${start.x},${start.y}).matrixTransform(m.inverse());return {x:p.x-a.x,y:p.y-a.y};})()`);
  let current=start,end=start;
  async function move(x,y){end=await evaluate(`(()=>{const p=new DOMPoint(${x+offset.x},${y+offset.y}).matrixTransform(document.querySelector('#bench').getScreenCTM());return {x:p.x,y:p.y};})()`);for(let i=1;i<=6;i++)await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:current.x+(end.x-current.x)*i/6,y:current.y+(end.y-current.y)*i/6});current=end;}
  for(const p of [...path,{x,y}])await move(p.x,p.y);
  const drop=()=>send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...end});drop.move=move;
  if(release)await drop();return drop;
 }
 const visitLab=id=>navigateLab({id,click,evaluate,pause});
 const screenshot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};


 await visitLab('evaporation');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===4"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),4);
 await screenshot('chemtopia-evaporation-initial.png');
 await drag('basin',600,387,{dy:35,path:[{x:350,y:250},{x:600,y:250}]});await pause(300);
 const lift=await drag('heater',600,350,{dy:40,release:false});
 assert.ok(await evaluate("document.querySelector('[data-id=heater]').transform.baseVal.consolidate().matrix.f<390"),'heater can be lifted with basin resting on it');await lift();
 await click('[data-equipment=heater]');await click('#store-equipment');assert.equal(await evaluate("document.querySelector('[data-equipment=heater]').dataset.stored"),'true');await pause(1600);
 assert.ok(await evaluate("document.querySelector('[data-id=basin]').transform.baseVal.consolidate().matrix.f>430"),'loose basin wakes and falls when its support is stored');
 await click('#restart');await drag('basin',600,387,{dy:35,path:[{x:350,y:250},{x:600,y:250}]});await pause(300);
 console.log('PASS lifting a loaded support and Store recovery without suspending its loose equipment');
 const drop=await drag('source',565.6,120,{release:false,path:[{x:110,y:120}]});
 await key(' ','Space');await pause(3900);
 for(let i=0;i<30;i++){if(await evaluate("!document.querySelector('[data-id=source] [clip-path] rect')"))break;await pause(100);}
 await key(' ','Space');await drop.move(110,120);await drop.move(110,413);await drop();
 await click('[data-equipment=heater]');await key(' ','Space');await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1000,y:350});
 await pause(11000);assert.equal(await evaluate("document.querySelector('#basin-state').textContent"),'Wet salt residue');
 await screenshot('chemtopia-evaporation-wet.png');
 await pause(6000);assert.equal(await evaluate("document.querySelector('#basin-state').textContent"),'Dry salt residue');
 await screenshot('chemtopia-evaporation-dry.png');
 await click('#finish');assert.ok(await evaluate("!!document.querySelector('#explanation')"));
 assert.equal(await evaluate("document.querySelector('#recovery').textContent"),'100.0%');
 await fillFollowups(evaluate,'evaporation');
 await click('input[value="1"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Choose another answer'));
 await click('input[value="0"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 await screenshot('chemtopia-evaporation-review.png');console.log('PASS real transfer, stable heater/basin contact, wet versus dry residue, salt recovery and explanation retry');
 await click('#restart');await click('#finish');
 assert.equal(await evaluate("!!document.querySelector('#explanation')"),false);assert.ok((await evaluate("document.querySelector('#result').textContent")).includes('not complete'));
 await visitLab('chromatography');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===10"))break;await pause(100);}
 assert.ok(await evaluate("!!document.querySelector('#return-laboratory')"));assert.deepEqual(exceptions,[]);
 console.log('PASS incomplete review, restart and cross-lab navigation with no browser exceptions');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

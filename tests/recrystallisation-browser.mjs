import {dragStored} from './equipment-menu-helpers.mjs';
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
 await send('Page.navigate',{url:base});
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===6"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),6);
 const key=async(key,code=key)=>{const windowsVirtualKeyCode=({Enter:13,Escape:27,Tab:9,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,Space:32})[code]||0;await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode,text:key==='Enter'?'\r':key===' '?' ':undefined});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode});};
 const point=async(id,dx=0,dy=40)=>evaluate(`(()=>{const o=document.querySelector('[data-id="${id}"]');const p=new DOMPoint(${dx},${dy}).matrixTransform(o.getScreenCTM());return {x:p.x,y:p.y};})()`);
 const click=async selector=>{if(selector.includes('data-equipment')){await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:15,y:220});await pause(250);}else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:800,y:400});await pause(220);}const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
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
 const screenshot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};



 await click('#go-recrystallisation');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===9"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),9);
 const pose=async id=>evaluate(`(()=>{const m=document.querySelector('[data-id="${id}"]').transform.baseVal.consolidate().matrix;return{x:m.e,y:m.f};})()`);
 await screenshot('chemtopia-recrystallisation-initial.png');
 await drag('funnel',840,270,{dy:65,path:[{x:1280,y:150},{x:840,y:150}]});await pause(900);
 const f=await pose('funnel');await drag('paper',f.x,f.y+4,{dy:10});
 await drag('receiverA',f.x,429);
 await drag('source',500,355,{path:[{x:300,y:200},{x:500,y:200}]});
 let drop=await drag('water',471.3,120,{release:false,path:[{x:100,y:120}]});
 await key(' ','Space');await pause(1000);await key(' ','Space');await drop.move(100,120);await drop.move(100,429);await drop();
 await click('[data-equipment=heater]');await key(' ','Space');await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1000,y:350});await pause(5000);
 assert.ok((await evaluate("document.querySelector('[data-id=source]').textContent")).includes('Dissolved potassium nitrate'),'heating dissolves original solute');
 await screenshot('chemtopia-recrystallisation-hot.png');
 drop=await drag('source',f.x-34.4,120,{release:false,path:[{x:500,y:120}]});
 await key(' ','Space');await pause(2200);await key(' ','Space');await drop.move(300,120);await drop.move(300,413);await drop();
 await click('[data-equipment=heater]');await key(' ','Space');await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1000,y:350});
 // Remove the impurity filter and store it, preserving the retained sand.
 await drag('paper',f.x,f.y-100,{dy:10,release:false});
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:15,y:300});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:15,y:300});
 assert.equal(await evaluate("document.querySelector('[data-equipment=paper]').dataset.stored"),'true');
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1000,y:350});
 await pause(28000);
 assert.ok((await evaluate("document.querySelector('[data-id=receiverA]').textContent")).includes('Crystals + mother liquor'),'cooling produces crystals');
 await screenshot('chemtopia-recrystallisation-cooling.png');

 // Store the cooled, filled beaker while rearranging the collection setup.
 const cooled=await pose('receiverA');
 await drag('receiverA',cooled.x+60,cooled.y,{release:false});
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:15,y:300});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:15,y:300});
 assert.equal(await evaluate("document.querySelector('[data-equipment=receiverA]').dataset.stored"),'true');
 let current=await pose('funnel');
 await drag('receiverB',current.x,429);
 current=await pose('funnel');await drag('freshPaper',current.x,current.y+4,{dy:10});
 assert.ok((await evaluate("document.querySelector('[data-id=freshPaper]').getAttribute('aria-description')")).includes('Seated'),'clean paper seats in funnel');
 drop=await drag('receiverA',1100,120,{release:false});
 await drop.move(current.x-28.7,120);
 await key(' ','Space');await pause(2200);await key(' ','Space');await drop.move(1100,120);await drop.move(1000,429);await drop();
 await click('#finish');
 if(!await evaluate("!!document.querySelector('#explanation')"))console.log(await evaluate("document.querySelector('#result').textContent"));
 assert.ok(await evaluate("!!document.querySelector('#explanation')"),'full hot-filter/cool/collect workflow succeeds');
 assert.ok(Number.parseFloat(await evaluate("document.querySelector('#recovery').textContent"))>0);
 await click('input[value="1"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Choose another answer'));
 await click('input[value="0"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 await screenshot('chemtopia-recrystallisation-review.png');console.log('PASS solvent addition, heating, hot filtration, cooling, clean-paper crystal collection, mother liquor and explanation retry');
 await click('#restart');await click('#finish');assert.equal(await evaluate("!!document.querySelector('#explanation')"),false);
 await click('#back-evaporation');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===4"))break;await pause(100);}
 assert.ok(await evaluate("!!document.querySelector('#go-recrystallisation')"));assert.deepEqual(exceptions,[]);
 console.log('PASS incomplete result, reset and cross-lab navigation with no exceptions');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

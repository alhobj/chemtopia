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
 await send('Page.navigate',{url:base+'/solution.html'});
 for(let i=0;i<40;i++){if(await evaluate("!!document.querySelector('#equipment-menu')"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),14);
 await drag('boat',120,350,10);await pause(500);
 await click('[data-equipment=balance]');await click('#action');
 assert.equal(await evaluate("document.querySelector('#balance-reading').textContent"),'0.000 g');
 const spatula=await drag('spatula',255,340,40,false);
 async function press(){await key(' ','Space');await pause(25);}
 for(const [count,command]of [[11,'normal'],[3,'medium'],[4,'fine']]){
  if(command!=='normal'){await evaluate("document.querySelector('#portion-size').focus()");await key('ArrowDown');await evaluate("document.querySelector('#bench').focus()");}
  for(let i=0;i<count;i++){
  await spatula.move(255,340);
  await press();
  await spatula.move(120,350);await press();
 }
 }
 await spatula.move(940,250);await spatula();await pause(150);
 assert.equal(await evaluate("document.querySelector('#balance-reading').textContent"),'0.584 g');
 const boat=await drag('boat',355,300,10,false,[{x:120,y:240},{x:355,y:240}]);for(let i=0;i<12;i++)await press();await boat.move(120,350);await boat();
 await drag('water',435,300,40,true,[{x:840,y:230},{x:435,y:230}]);await pause(500);
 await click('[data-equipment=beaker]');for(let i=0;i<4;i++)await click('[data-command=water]');
 const rod=await drag('rod',355,350,40,false);await press();await rod.move(940,240);await rod();
 const funnel=await drag('funnel',520,330,20,false);await press();await funnel();
 // Transfer stock, leaving the modelled wet film; rinse it into the flask.
 // A visibly clear pour from high above must reach the receiver too.
 const beaker=await drag('beaker',520,80,40,false,[{x:355,y:200}]);for(let i=0;i<4;i++)await press();await beaker.move(355,300);await beaker();await pause(500);
 await drag('water',435,300,40,true,[{x:435,y:230}]);await pause(300);
 await click('[data-equipment=beaker]');for(let i=0;i<5;i++)await click('[data-command=one]');
 const rinse=await drag('beaker',520,250,40,false,[{x:355,y:200}]);await press();await rinse.move(350,300);await rinse();
 await click('[data-equipment=funnel]');await click('#action');const unseat=await drag('funnel',520,220,20,false);await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...await menuPoint(evaluate)});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...await menuPoint(evaluate)});
 await drag('water',600,280,40,true,[{x:435,y:200},{x:600,y:200}]);await pause(400);
 await click('[data-equipment=stock]');for(let i=0;i<6;i++)await click('[data-command=water]');for(let i=0;i<5;i++)await click('[data-command=one]');
 assert.ok((await evaluate("document.querySelector('#volume-reading').textContent")).includes('100.00'));
 // A delayed action causes exactly one 0.1 mL addition; no ongoing stream exists.
 await click('[data-command=drop]');await pause(1200);assert.ok((await evaluate("document.querySelector('#volume-reading').textContent")).includes('100.10'));
 const stopper=await drag('stopper1',520,370,5,false);await press();await stopper();await click('[data-equipment=stock]');await click('#action');
 await click('[data-equipment=stopper1]');await click('#action');await drag('stopper1',760,260,5,true,[{x:520,y:280}]);
 const pipette=await drag('pipette',520,385,40,false,[{x:520,y:250}]);await press();assert.ok((await evaluate("document.querySelector('#action-note').textContent")).includes('Filled 10.00'));
 await pipette.move(520,260);await pipette.move(680,260);await press();await pipette.move(760,230);await pipette();
 await click('[data-equipment=dilution]');for(let i=0;i<9;i++)await click('[data-command=water]');for(let i=0;i<5;i++)await click('[data-command=one]');
 const stopper2=await drag('stopper2',680,370,5,false);await press();await stopper2();await click('[data-equipment=dilution]');await click('#action');
 await screenshot('chemtopia-solution-prepared.png');await click('#finish');
 assert.ok((await evaluate("document.querySelector('#result h2').textContent")).includes('prepared'));
 assert.equal(await evaluate("document.querySelectorAll('#explanation fieldset').length"),3);
 await evaluate(`(()=>{const f=document.querySelector('#explanation');f.querySelector('input[value="0"]').checked=true;f.elements['q2-value'].value='0.5844';const cells=document.querySelectorAll('#result tbody tr:last-child td');f.elements['q3-value'].value=cells[3].textContent;f.requestSubmit();})()`);
 assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 await screenshot('chemtopia-solution-review.png');
 await click('#restart');
 await drag('beaker',120,300,40,true,[{x:355,y:200},{x:120,y:200}]);await pause(750);
 assert.equal(await evaluate("document.querySelector('#balance-reading').textContent"),'50.000 g');
 await click('[data-equipment=balance]');await click('#action');
 assert.equal(await evaluate("document.querySelector('#balance-reading').textContent"),'0.000 g');
 await drag('water',220,300,40,true,[{x:840,y:200},{x:220,y:200}]);await pause(500);
 await click('[data-equipment=beaker]');await click('[data-command=water]');
 assert.equal(await evaluate("document.querySelector('#balance-reading').textContent"),'10.000 g');
 await drag('water',435,250,40,true,[{x:220,y:170},{x:435,y:170}]);await pause(300);
 const bottle=await drag('salt',120,220,40,false,[{x:255,y:150},{x:120,y:150}]);await press();
 await screenshot('chemtopia-salt-pour.png');
 assert.equal(await evaluate("document.querySelector('#balance-reading').textContent"),'10.050 g',await evaluate("document.querySelector('#action-note').textContent"));
 assert.ok(await evaluate("document.querySelectorAll('[data-id=beaker] .solid-grain').length>0"));
 await bottle.move(255,250);await bottle();await pause(500);
 await screenshot('chemtopia-beaker-balance.png');
 await click('#restart');await click('#finish');assert.ok((await evaluate("document.querySelector('#result').textContent")).includes('supplied example'));
 assert.deepEqual(exceptions,[]);console.log('PASS real weighing, discrete additions, rinsing, meniscus, stopper/mixing, calibrated pipette, dilution and calculation review');

}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

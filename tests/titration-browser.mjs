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
 await send('Page.navigate',{url:base});
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
 await send('Page.navigate',{url:base+'/titration.html'});
 for(let i=0;i<40;i++){if(await evaluate("!!document.querySelector('#equipment-menu')"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),11);
 const press=async()=>{await key(' ','Space');await pause(40);};
 for(const [mode,expectedPH,formula,titrant]of [['hcl','7.00','HCl','NaOH'],['acetic','8.70','CH₃COOH','NaOH'],['ammonia','5.30','NH₃','HCl']]){
  if(mode!=='hcl'){await evaluate("document.querySelector('#sample-select').focus()");await key('ArrowDown');await evaluate("document.querySelector('#bench').focus()");await pause(200);}
  assert.equal(await evaluate("document.querySelector('#sample-select').value"),mode);
  assert.ok((await evaluate("document.querySelector('#objective-text').textContent")).includes(formula));
  assert.ok((await evaluate("document.querySelector('[data-equipment=base]').textContent")).includes(titrant==='HCl'?'Hydrochloric acid':'Sodium hydroxide'));
 const burette=await drag('burette',800,100,40,false);await burette.move(620,145);await press();await burette();
 assert.ok((await evaluate("document.querySelector('#action-note').textContent")).includes('clamped'));
 const funnel=await drag('funnel',800,100,20,false);await funnel.move(620,85);await press();await funnel();
 const baseBottle=await drag('base',450,230,40,false,[{x:240,y:180},{x:450,y:180}]);for(let i=0;i<5;i++)await press();assert.ok((await evaluate("document.querySelector('#action-note').textContent")).includes('added'));await baseBottle.move(240,180);await baseBottle.move(240,415);await baseBottle();
 await click('[data-equipment=funnel]');await click('#action');
 const unseat=await drag('funnel',620,30,20,false);await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...await menuPoint(evaluate)});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...await menuPoint(evaluate)});
 // Prime the tip to waste before setting the initial reading.
 await drag('flask',780,405,35,true);await pause(400);
 await drag('waste',620,350,35,true,[{x:850,y:280},{x:620,y:280}]);await pause(500);
 await click('[data-equipment=burette]');await click('[data-command=fine]');await click('[data-command=fine]');await click('[data-command=initial]');
 assert.ok((await evaluate("document.querySelector('#burette-reading').textContent")).includes('0.20'));
 await drag('waste',920,429,35,true,[{x:670,y:429},{x:670,y:280},{x:920,y:280}]);await pause(500);
 await drag('flask',620,405,35,true,[{x:780,y:405},{x:620,y:405}]);await pause(500);
 const pipette=await drag('pipette',300,250,40,false);await pipette.move(110,250);await pipette.move(110,400);await press();assert.ok((await evaluate("document.querySelector('#action-note').textContent")).includes('25.00'));
 await pipette.move(110,20);await pipette.move(645,20);await pipette.move(645,290);await press();assert.ok((await evaluate("document.querySelector('#action-note').textContent")).includes('Delivered 25.00'));await pipette.move(930,240);await pipette();
 const indicator=await drag('indicator',800,250,20,false);await indicator.move(645,350);await press();await indicator.move(950,200);await indicator();
 await click('[data-equipment=burette]');for(let i=0;i<19;i++)await click('#action');for(let i=0;i<9;i++)await click('[data-command=fine]');
 await click('[data-command=drop]');await pause(1000);
 assert.ok((await evaluate("document.querySelector('#burette-reading').textContent")).includes('20.15'));
 await click('[data-command=drop]');
 await click('[data-equipment=flask]');await click('#action');
 const probe=await drag('probe',800,250,35,false);await probe.move(640,300);await probe.move(640,410);await press();
 assert.ok((await evaluate("document.querySelector('#ph-reading').textContent")).includes(expectedPH));
 await screenshot('chemtopia-titration-'+mode+'-ph.png');await probe.move(930,200);await probe();
 await click('[data-equipment=flask]');await click('[data-command=trial]');await screenshot('chemtopia-titration-'+mode+'-endpoint.png');await click('#finish');
 assert.ok((await evaluate("document.querySelector('#result h2').textContent")).includes('endpoint recorded'));
 assert.equal(await evaluate("document.querySelectorAll('#explanation fieldset').length"),3);
 await evaluate(`(()=>{const f=document.querySelector('#explanation');f.querySelector('input[value="0"]').checked=true;f.elements['q2-value'].value='20';f.elements['q3-value'].value='0.08';f.requestSubmit();})()`);
 assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 await screenshot('chemtopia-titration-'+mode+'-review.png');
 await click('#restart');assert.equal(await evaluate("document.querySelector('#sample-select').value"),mode);await click('#finish');assert.ok((await evaluate("document.querySelector('#result').textContent")).includes('supplied example'));
 assert.deepEqual(exceptions,[]);console.log('PASS '+mode+' assembly, priming, aliquot, discrete drops, indicator, pH '+expectedPH+', readings, calculation review and mode-preserving restart');
 }

}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

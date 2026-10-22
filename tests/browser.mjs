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
 const click=async selector=>{if(selector.includes('data-equipment')){await hoverMenu(send,evaluate,pause);}else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:800,y:400});await pause(220);}const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
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
 await screenshot('chemtopia-initial.png');console.log('PASS initial workbench and all six apparatus controls');
 const pose=async id=>evaluate(`(()=>{const m=document.querySelector('[data-id="${id}"]').transform.baseVal.consolidate().matrix;return {x:m.e,y:m.f,angle:Math.atan2(m.b,m.a)*180/Math.PI};})()`);

 await pause(1000);await evaluate("document.querySelector('#bench').scrollIntoView({block:'center'})");
 const standBefore=await pose('stand'),touch=await point('stand',0,-100);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...touch});await pause(100);
 await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...touch});await pause(1200);
 const standAfter=await pose('stand');assert.ok(Math.hypot(standAfter.x-standBefore.x,standAfter.y-standBefore.y)<.5,'touching stand does not start it sliding');
 let drop=await drag('source',150,180,40,false);await pause(200);assert.ok(Math.abs((await pose('source')).y-180)<.1);
 await drop();await pause(1700);assert.ok(Math.abs((await pose('source')).y-413)<1);
 // Swept mouse collision: trying to cross the stand is blocked.
 drop=await drag('receiverA',350,320,40,false);assert.ok((await pose('receiverA')).x>550);await drop();
 await click('#restart');
 drop=await drag('funnel',320,170,65,false,[{x:880,y:150},{x:320,y:150}]);await pause(150);assert.ok(Math.abs((await pose('funnel')).angle)<.1);
 await drop();await pause(250);assert.ok(Math.abs((await pose('funnel')).angle)<1,'no timed in-air tip');
 await pause(3000);assert.ok(Math.abs((await pose('funnel')).angle)>35,'bench contact tips funnel');
 console.log('PASS held/released gravity, stand hitbox and contact-driven tipping');
 await click('#restart');
 async function assemble(withPaper=true){
  await drag('funnel',605,270,65,true,[{x:880,y:150},{x:605,y:150}]);await pause(900);
  const f=await pose('funnel'),stand=await pose('stand');
  assert.ok(Math.abs(f.angle)<3,'funnel seated upright');assert.ok(Math.abs(f.y-(stand.y-204.5))<2,'cone sits above ring');
  if(withPaper)await drag('paper',f.x,f.y+4,10,true,[{x:950,y:150},{x:f.x,y:150}]);
  await drag('receiverA',f.x,429);await pause(150);return f.x;
 }
 async function liftSource(x){return drag('source',x-34.4,140,40,false,[{x:150,y:140},{x:x-34.4,y:140}]);}
 async function putSourceBack(drop){await drop.move((await pose('source')).x,140);await drop.move(150,140);await drop.move(150,413);await drop();}
 let x=await assemble();drop=await liftSource(x);
 await key(' ','Space');await pause(500);
 assert.equal(await evaluate("document.querySelector('#pour').getAttribute('aria-pressed')"),'true','Space keyup does not stop pouring');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',autoRepeat:true});
 assert.equal(await evaluate("document.querySelector('#pour').getAttribute('aria-pressed')"),'true','repeat does not toggle');
 await key(' ','Space');const stopped=await evaluate("document.querySelector('[data-id=source]').innerHTML");await pause(200);
 assert.equal(await evaluate("document.querySelector('[data-id=source]').innerHTML"),stopped);
 assert.equal(await evaluate("document.querySelector('#result').hidden"),true);
 await screenshot('chemtopia-ring-support.png');
 await key(' ','Space');await pause(3400);await putSourceBack(drop);await pause(300);
 await drag('receiverA',x+60,429,40,false);await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...await menuPoint(evaluate)});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...await menuPoint(evaluate)});await drag('receiverB',x,429);drop=await liftSource(x);await key(' ','Space');await pause(2200);await putSourceBack(drop);
 assert.equal(await evaluate("document.querySelector('#spills').children.length"),0,'water overflow stays in the source until a second receiver is placed');
 await screenshot('chemtopia-before-finish.png');await click('#finish');assert.ok(await evaluate("!!document.querySelector('#explanation')"),'filtration remains completable with collisions');
 await click('input[value="1"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Choose another answer'));
 await evaluate("document.querySelector('input[value=\"0\"]').focus()");await key(' ','Space');await evaluate("document.querySelector('#explanation button').focus()");await key('Enter');
 assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));await screenshot('chemtopia-completed.png');
 console.log('PASS corrected ring seating, paper insertion, collision-safe pouring and complete explanation');
 await click('#restart');x=await assemble();drop=await liftSource(x);await key(' ','Space');await pause(700);await key(' ','Space');await putSourceBack(drop);
 assert.ok(await evaluate("document.querySelector('[data-id=paper]').innerHTML.includes('#bb904f')"),'filter loaded');
 await drag('funnel',320,150,65,true,[{x,y:130},{x:320,y:130}]);await pause(4500);
 assert.equal(await evaluate("document.querySelector('[data-id=paper]').innerHTML.includes('#bb904f')"),false,'tipped filter empties');
 assert.ok(await evaluate("document.querySelector('#spills').children.length>0"));await screenshot('chemtopia-tipped-spill.png');
 console.log('PASS loaded funnel removal, impact, tipping and visible sand spill');
 await click('#restart');await pause(600);await click('[data-equipment=source]');const before=await pose('source');await key('ArrowRight');await key('Enter');
 assert.ok(Math.abs((await pose('source')).x-before.x)<1,'movement shortcuts remain removed');
 x=await assemble(false);drop=await liftSource(x);await key(' ','Space');await pause(3900);await putSourceBack(drop);await click('#finish');
 assert.equal(await evaluate("!!document.querySelector('#explanation')"),false);assert.ok((await evaluate("document.querySelector('#result').textContent")).includes('Collecting beaker A: water and sand'));
 console.log('PASS restart, missing-paper failure and native controls');
 assert.deepEqual(exceptions,[],'no browser runtime exceptions');console.log('PASS no browser runtime exceptions');
 console.log('Browser checks complete. Screenshots: /tmp/chemtopia-initial.png and /tmp/chemtopia-completed.png');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

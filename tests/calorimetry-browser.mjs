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

 const press=async()=>{await key(' ','Space');await pause(30);};
 const command=async name=>{await evaluate(`document.querySelector('[data-command="${name}"]').focus()`);await key('Enter');await evaluate("document.querySelector('#bench').focus()");};
 const select=async id=>click('[data-equipment='+id+']');
 const navigate=async mode=>{await send('Page.navigate',{url:base+'/'+mode+'.html'});for(let i=0;i<50;i++){if(await evaluate("!!document.querySelector('#equipment-menu')"))break;await pause(100);}await pause(300);};
 const clip=async(x,y)=>{const p=await drag('probe',850,80,40,false);await p.move(850,40);await p.move(x,40);await p.move(x,y);await command('clip');await p();await pause(300);};
 const stirAt=async(x,y)=>{const r=await drag('rod',x,y,40,false);await press();assert.match(await evaluate("document.querySelector('#action-note').textContent"),/Stirred/);await r.move(x,40);await r.move(950,40);await r.move(950,200);await r();};
 const review=async combustion=>{await screenshot('chemtopia-'+(combustion?'combustion':'neutralisation')+'-bench.png');await click('#finish');assert.match(await evaluate("document.querySelector('#result h2').textContent"),/readings recorded/);assert.equal(await evaluate("document.querySelectorAll('#explanation fieldset').length"),3);
 await evaluate(`(()=>{const rows=[...document.querySelectorAll('#result tbody tr')].map(r=>parseFloat(r.cells[1].textContent));const q=(rows[3]*4.18+${combustion?45:0})*rows[2];const n=${combustion?'rows[4]/46.07':'rows[4]'};const f=document.querySelector('#explanation');f.querySelector('input[value="0"]').checked=true;f.elements['q2-value'].value=q;f.elements['q3-value'].value=-q/n/1000;f.requestSubmit();})()`);
 assert.match(await evaluate("document.querySelector('#question-feedback').textContent"),/Activity complete/);await screenshot('chemtopia-'+(combustion?'combustion':'neutralisation')+'-review.png');};
 await navigate('neutralisation');
 let source=await drag('acid',640,250,40,false,[{x:270,y:200},{x:640,y:200}]);for(let i=0;i<5;i++)await press();await source.move(270,200);await source.move(270,429);await source();
 await clip(655,350);await select('probe');await click('[data-command=initial]');
 source=await drag('base',640,250,40,false,[{x:400,y:200},{x:640,y:200}]);for(let i=0;i<5;i++)await press();await source.move(400,200);await source.move(400,429);await source();
 await stirAt(640,350);
 const lid=await drag('lid',640,390,5,false);await press();await lid();
 await pause(8500);await select('probe');await click('[data-command=final]');await review(false);
 await click('#restart');await click('#finish');assert.match(await evaluate("document.querySelector('#result').textContent"),/Supplied calculation example/);
 await navigate('combustion');
 await drag('burner',120,409,30,true,[{x:700,y:465},{x:700,y:200},{x:120,y:200}]);await pause(700);await select('balance');await click('#action');assert.match(await evaluate("document.querySelector('#action-note').textContent"),/22.000/);
 await drag('burner',650,465,30,true,[{x:120,y:200},{x:700,y:200},{x:700,y:465}]);
 await drag('can',550,259,40,true,[{x:750,y:150},{x:550,y:150}]);await pause(600);
 source=await drag('water',550,130,40,false,[{x:280,y:130}]);for(let i=0;i<10;i++)await press();await source.move(280,130);await source.move(280,429);await source();
 await clip(565,184);await stirAt(550,200);await select('probe');await click('[data-command=initial]');
 await drag('burner',550,465,30);await select('burner');await click('#action');await pause(18000);await screenshot('chemtopia-combustion-heating.png');await click('#action');await pause(1800);
 await select('probe');await click('[data-command=final]');
 await drag('burner',120,409,30,true,[{x:700,y:465},{x:700,y:170},{x:120,y:170}]);await pause(700);await select('balance');await click('#action');await review(true);
 assert.deepEqual(exceptions,[]);console.log('PASS both calorimetry workflows: pouring, clipping, stirring, insulation, weighing, combustion and measured numerical reviews');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

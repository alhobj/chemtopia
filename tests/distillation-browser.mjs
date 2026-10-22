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
 await click('#go-chromatography');
 for(let i=0;i<40;i++){if(await evaluate("!!document.querySelector('#equipment')&&document.querySelectorAll('.equipment-button').length===10"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),10);
 await click('#back-filtration');
 for(let i=0;i<40;i++){if(await evaluate("!!document.querySelector('#go-distillation')"))break;await pause(100);}
 await click('#go-distillation');
 for(let i=0;i<60;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===13"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),13);
 await click('#go-chromatography');
 for(let i=0;i<40;i++){if(await evaluate("!!document.querySelector('#equipment')&&document.querySelectorAll('.equipment-button').length===10"))break;await pause(100);}
 assert.ok(await evaluate("!!document.querySelector('#back-filtration')&&!!document.querySelector('#back-distillation')"));
 await click('#back-distillation');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===13"))break;await pause(100);}
 console.log('PASS chromatography links from both labs and return navigation');

 const pose=async id=>evaluate(`(()=>{const m=document.querySelector('[data-id="${id}"]').transform.baseVal.consolidate().matrix;return{x:m.e,y:m.f,angle:Math.atan2(m.b,m.a)*180/Math.PI};})()`);
 const local=async(id,x,y)=>evaluate(`(()=>{const p=new DOMPoint(${x},${y}).matrixTransform(document.querySelector('[data-id="${id}"]').getScreenCTM()).matrixTransform(document.querySelector('#bench').getScreenCTM().inverse());return{x:p.x,y:p.y};})()`);
 const connected=async(id,name)=>assert.ok((await evaluate(`document.querySelector('[data-id="${id}"]').getAttribute('aria-description')`)).includes(name),`${id} connected to ${name}`);
 async function hose(hose,index,target){
  await evaluate("document.querySelector('#bench').scrollIntoView({block:'center'})");
  const a=await evaluate(`(()=>{const e=document.querySelector('[data-hose="${hose}"][data-end="${index}"]'),m=document.querySelector('#bench').getScreenCTM(),p=new DOMPoint(+e.getAttribute('cx'),+e.getAttribute('cy')).matrixTransform(m);return{x:p.x,y:p.y};})()`);
  const b=await evaluate(`(()=>{const p=new DOMPoint(${target.x},${target.y}).matrixTransform(document.querySelector('#bench').getScreenCTM());return{x:p.x,y:p.y};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...a});await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...b});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...b});
 }
 async function play(reversed=false){
 await pause(700);assert.equal(await evaluate("document.querySelector('#temperature-reading').textContent"),'20');if(!reversed)await screenshot('chemtopia-distillation-initial.png');
 await drag('flask',390,327,{dy:94,path:[{x:760,y:100},{x:390,y:100}]});await pause(500);await connected('flask','Clamp stand A');
 let f=await pose('flask');await drag('funnel',f.x,f.y-76,{dy:20});await pause(200);await connected('funnel','Distillation flask');
 let drop=await drag('source',f.x-34.4,100,{release:false,path:[{x:95,y:120},{x:f.x-34.4,y:120}]});
 await key(' ','Space');await pause(3900);await drop.move(95,140);await drop.move(95,413);await drop();await pause(300);
 await drag('funnel',f.x,120,{dy:20,release:false});
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...await menuPoint(evaluate)});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...await menuPoint(evaluate)});
 assert.equal(await evaluate("document.querySelector('[data-equipment=funnel]').dataset.stored"),'true');
 assert.ok(Number(await evaluate("document.querySelector('[data-id=flask] [clip-path] rect').getAttribute('y')"))<120,'feed passes through the filling funnel into the flask');
 f=await pose('flask');
 await drag('head',f.x,f.y-60,{dx:2,dy:30,path:[{x:180,y:10},{x:f.x,y:10}]});await pause(300);await connected('head','Distillation flask');
 let p=await local('head',70,50);
 await drag('condenser',p.x,p.y,{dx:112,dy:34,path:[{x:1060,y:170},{x:p.x,y:170}]});await pause(300);await connected('condenser','Still head');
 await drag('support2',800,509,{dx:0,dy:-120});await pause(500);await connected('condenser','Clamp stand B');
 p=await pose('head');await drag('thermometer',p.x+8,p.y-40,{dy:40,path:[{x:80,y:10},{x:p.x,y:10}]});await pause(200);await connected('thermometer','Still head');const t=await pose('thermometer'),h=await pose('head');assert.ok(Math.abs((t.y+15)-h.y)<2,'thermometer collar seats at head mouth');
 p=await local('condenser',230,70);await drag('receiverA',p.x,429);await pause(200);
 await hose('supply',0,await local('tap',0,30));await hose('supply',1,await local('condenser',reversed?45:185,reversed?-12:85));await hose('return',0,await local('condenser',reversed?185:45,reversed?85:-12));await hose('return',1,await local('drain',0,0));
 assert.equal(await evaluate("document.querySelector('[data-hose=supply][data-end=\"1\"]').dataset.port"),reversed?'condenser:high':'condenser:low');
 const beforeClick=await pose('heater'),flaskBefore=await pose('flask');
 const hp=await point('heater',31,34);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...hp});
 await pause(150);await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...hp});await pause(300);
 const afterClick=await pose('heater'),flaskAfter=await pose('flask');
 assert.ok(Math.hypot(afterClick.x-beforeClick.x,afterClick.y-beforeClick.y)<1,'clicking heater does not lift or launch it');
 assert.ok(Math.hypot(flaskAfter.x-flaskBefore.x,flaskAfter.y-flaskBefore.y)<1,'heater click does not disturb supported glass');
 await click('[data-equipment=tap]');await key(' ','Space');assert.ok((await evaluate("document.querySelector('#action').textContent")).includes('Stop water'));
 await click('[data-equipment=heater]');await key(' ','Space');await pause(10000);
 assert.equal(await evaluate("document.querySelector('#result').hidden"),true);
 assert.equal(await evaluate("document.querySelector('#temperature-reading').textContent"),'56','digital readout holds at acetone plateau');
 await screenshot(reversed?'chemtopia-distillation-reversed.png':'chemtopia-distillation-running.png');
 await key(' ','Space');await pause(1000);
 const cooled=Number(await evaluate("document.querySelector('#temperature-reading').textContent"));
 assert.ok(cooled<56&&cooled>20,'heater switch-off cools the thermometer');
 const stoppedFill=await evaluate("document.querySelector('[data-id=flask] [clip-path] rect').getAttribute('y')");await pause(500);
 assert.equal(await evaluate("document.querySelector('[data-id=flask] [clip-path] rect').getAttribute('y')"),stoppedFill,'liquid level stops falling below acetone boiling point');
 assert.equal(await evaluate("document.querySelector('#streams').children.length"),0,'no distillate stream below boiling');
 await click('#finish');

 assert.ok(await evaluate("!!document.querySelector('#explanation')"),'distillation completes through real assembly');
 const normal=Number.parseFloat(await evaluate("document.querySelector('#recovery').textContent"));assert.ok(normal>0);
 await click('input[value="1"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Choose another answer'));
 await click('input[value="0"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 if(!reversed)await screenshot('chemtopia-distillation-review.png');
 return normal;
 }
 const normal=await play();await click('#restart');const reverse=await play(true);assert.ok(reverse>0&&reverse<normal,'upper-port supply remains possible and reduces actual collected recovery');console.log('PASS real hose reversal, lower recovery',normal,reverse);
 console.log('PASS bottom navigation, real glass/support assembly, feed pour, hose connections, heat/cooling and question');
 await click('#back-filtration');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===6"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),6);assert.equal(await evaluate("document.querySelector('#selected-name').textContent"),'Nothing selected');
 assert.deepEqual(exceptions,[],'no browser runtime exceptions');console.log('PASS fresh filtration on return and no runtime exceptions');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

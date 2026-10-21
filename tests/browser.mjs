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
 const click=async selector=>{const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
 async function drag(id,x,y,dy=40){
  await evaluate("document.querySelector('#bench').scrollIntoView({block:'center'})");
  const start=await point(id,0,dy);const end=await evaluate(`(()=>{const p=new DOMPoint(${x},${y+dy}).matrixTransform(document.querySelector('#bench').getScreenCTM());return {x:p.x,y:p.y};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...start});
  for(let i=1;i<=6;i++)await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:start.x+(end.x-start.x)*i/6,y:start.y+(end.y-start.y)*i/6});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...end});
 }
 async function holdPour(ms){
  const p=await evaluate("(()=>{const e=document.querySelector('#pour');e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()");
  await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await pause(ms);await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});
 }
 const screenshot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};
 await screenshot('chemtopia-initial.png');console.log('PASS initial workbench and all six apparatus controls');
 await drag('paper',760,214,10);await drag('funnel',573,328,65);await drag('receiverA',573,425);await drag('source',538.6,225);
 await holdPour(1700);
 assert.equal(await evaluate("document.querySelector('#result').hidden"),true);
 assert.ok(await evaluate("document.querySelector('[data-id=paper]').innerHTML.includes('#bb904f')"));
 await drag('receiverA',350,425);await drag('receiverB',573,425);await click('[data-equipment=source]');await holdPour(2400);
 await click('#finish');assert.ok(await evaluate("!!document.querySelector('#explanation')"),'mouse filtration succeeds');
 await click('input[value="1"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Choose another answer'));
 await click('input[value="0"]');await click('#explanation button');assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 await screenshot('chemtopia-completed.png');console.log('PASS mouse drag, attach, interrupted pouring, two receivers, Finish and question retry/completion');
 await click('#restart');assert.equal(await evaluate("document.querySelector('#selected-name').textContent"),'Nothing selected');assert.equal(await evaluate("document.querySelector('#spills').children.length"),0);
 await drag('funnel',573,328,65);await drag('receiverA',573,425);await drag('source',538.6,225);await holdPour(3900);await click('#finish');
 assert.equal(await evaluate("!!document.querySelector('#explanation')"),false);
 assert.ok((await evaluate("document.querySelector('#result').textContent")).includes('Collecting beaker A: water and sand'));
 assert.ok(await evaluate("document.querySelector('#spills').children.length>0"));console.log('PASS missing-paper experiment and real overflow remain possible; incomplete attempt has no question');
 await click('#restart');
 async function focusItem(id){await evaluate(`document.querySelector('[data-equipment="${id}"]').focus()`);}
 async function arrows(keyName,count){for(let i=0;i<count;i++)await key(keyName);}
 await focusItem('source');const original=await evaluate("document.querySelector('[data-id=source]').getAttribute('transform')");await key('ArrowRight');await key('Escape');assert.equal(await evaluate("document.querySelector('[data-id=source]').getAttribute('transform')"),original);
 await focusItem('paper');await arrows('ArrowLeft',14);await arrows('ArrowUp',19);await key('Enter');
 await focusItem('funnel');await arrows('ArrowLeft',23);await arrows('ArrowDown',15);await key('Enter');
 await focusItem('receiverA');await arrows('ArrowRight',28);await key('Enter');
 await focusItem('source');await arrows('ArrowRight',49);await arrows('ArrowUp',18);await key('Enter');
 await evaluate("document.querySelector('#pour').focus()");await send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space'});await pause(3900);await send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space'});
 await evaluate("document.querySelector('#finish').focus()");await key('Enter');assert.ok(await evaluate("!!document.querySelector('#explanation')"),'keyboard filtering succeeds');
 await evaluate("document.querySelector('input[value=\"0\"]').focus()");await key(' ','Space');
 await evaluate("document.querySelector('#explanation button').focus()");await key('Enter');
 assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 console.log('PASS keyboard focus, movement, placement, Escape and hold-Space use the same chemistry rules');
 assert.deepEqual(exceptions,[],'no browser runtime exceptions');console.log('PASS no browser runtime exceptions');
 console.log('Browser checks complete. Screenshots: /tmp/chemtopia-initial.png and /tmp/chemtopia-completed.png');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

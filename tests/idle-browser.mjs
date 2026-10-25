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

 async function waitFor(expression,label='condition',timeout=12000){for(let elapsed=0;elapsed<timeout;elapsed+=35){if(await evaluate(expression))return;await pause(35);}throw Error('Timed out: '+label);}
 const click=async selector=>{const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
 async function key(key){const codes={Home:36,ArrowDown:40,Enter:13};await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:codes[key]});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:codes[key]});}
 async function facing(index){await click('#idle-direction');await key('Home');for(let i=0;i<index;i++)await key('ArrowDown');await key('Enter');}
 async function screenshot(file){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),file),Buffer.from(shot.data,'base64'));}
 await send('Page.navigate',{url:base+'/idle-preview.html'});await waitFor("document.querySelectorAll('.idle-sprite').length===24",'24 actor idles');
 assert.equal(await evaluate("Promise.all(['idle-c01-standing.png',...['c01','n01','n02','n03'].flatMap(g=>['idle-'+g+'-blink.png','idle-'+g+'-gesture.png'])].map(file=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i.naturalWidth>0&&i.naturalHeight>0);i.onerror=()=>resolve(false);i.src='assets/world/'+file;}))).then(x=>x.every(Boolean))"),true,'all idle art decodes');
 const first='[data-idle-character="c01-1"]';
 const before=await evaluate(`document.querySelector('${first} .idle-upper').getAttribute('transform')`);await pause(180);assert.notEqual(await evaluate(`document.querySelector('${first} .idle-upper').getAttribute('transform')`),before,'breathing changes upper body transform');
 await click('#show-gestures');await waitFor(`document.querySelector('${first} svg').dataset.idlePhase==='gesture'`,'gesture starts');await waitFor(`document.querySelector('${first} svg').dataset.idleGestureFrame==='1'`,'gesture peak');await screenshot('chemtopia-idle-gestures.png');await waitFor(`document.querySelector('${first} svg').dataset.idleGestureFrame==='2'`,'gesture recovery');
 await click('#pause-idles');assert.equal(await evaluate("[...document.querySelectorAll('.idle-sprite')].every(e=>e.dataset.idlePhase==='neutral')"),true);const frozen=await evaluate(`document.querySelector('${first} .idle-upper').getAttribute('transform')`);await pause(250);assert.equal(await evaluate(`document.querySelector('${first} .idle-upper').getAttribute('transform')`),frozen);
 await facing(1);assert.equal(await evaluate("[...document.querySelectorAll('.idle-sprite')].every(e=>e.dataset.cardinal==='east')"),true);await click('#pause-idles');await waitFor(`document.querySelector('${first} svg').dataset.idlePhase==='blink'`,'visible side-facing blink',6500);assert.equal(await evaluate(`document.querySelector('${first} image').getAttribute('href').includes('-blink.png')`),true);
 await facing(2);assert.equal(await evaluate("[...document.querySelectorAll('.idle-sprite')].every(e=>e.dataset.cardinal==='north')"),true);await pause(250);assert.equal(await evaluate(`document.querySelector('${first} svg').dataset.idlePhase`),'neutral');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),true);await screenshot('chemtopia-idle-phone.png');
 await send('Page.navigate',{url:base+'/npc-preview.html'});await waitFor("document.querySelectorAll('.idle-sprite').length===72",'72 directional NPC idles');assert.equal(await evaluate("[...document.querySelectorAll('.npc-card')].every(c=>['east','north','west','south'].every(d=>c.querySelector('[data-facing='+d+']')))"),true);
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:base+'/idle-preview.html'});await waitFor("document.querySelectorAll('.idle-sprite').length===24",'reduced-motion idles');await click('#show-gestures');await pause(300);assert.equal(await evaluate("[...document.querySelectorAll('.idle-sprite')].every(e=>e.dataset.idlePhase==='neutral')"),true);assert.equal(await evaluate("[...document.querySelectorAll('.idle-upper')].every(e=>e.getAttribute('transform')==='translate(0 0) scale(1 1)')"),true);
 assert.deepEqual(exceptions,[]);console.log('PASS 24 actor idles, real art decoding, breathing, gesture sequence/recovery, side-facing blink, pause, 72 NPC views, phone layout and reduced motion');
}finally{if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}
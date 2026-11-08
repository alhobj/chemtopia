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

 for(let i=0;i<50;i++){try{if((await fetch(base)).ok)break;}catch{}await pause(100);}
 await send('Page.navigate',{url:base+'/buffer.html'});
 for(let i=0;i<60;i++){try{if(await evaluate("document.querySelectorAll('[data-id]').length===9"))break;}catch{}await pause(100);}
 const click=async selector=>{if(selector.includes('data-equipment'))await hoverMenu(send,evaluate,pause);else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1100,y:350});await pause(100);}const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
 const set=async(id,value)=>evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)});e.value=${JSON.stringify(String(value))};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const select=async id=>click('[data-equipment='+id+']');
 const moveFromStorage=async(id,x,y)=>{await dragStored({id,x,y,release:true,send,evaluate,pause});await pause(150);};
 const dose=async(from,to,n)=>{await set('from',from);await set('to',to);await set('dose',n);await click('#transfer');assert.match(await evaluate("document.querySelector('#action-note').textContent"),/Transferred/);};
 const store=async id=>{await select(id);await click('#store-equipment');};
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};

 await dose('acid','sample1',10);await dose('acetate','sample1',10);await dose('water','sample2',20);await store('acid');await store('acetate');
 await moveFromStorage('hcl',110,300);await moveFromStorage('naoh',240,300);await moveFromStorage('probe',720,250);
 let target=null;
 async function record(sample){await select('probe');if(target)await click('#action');await set('to',sample);await click('#action');target=sample;await click('#record');}
 await record('sample1');await record('sample2');await dose('hcl','sample1',1);await dose('hcl','sample2',1);await record('sample1');await record('sample2');
 let readings=await evaluate("[...document.querySelectorAll('#measurements tr')].map(r=>[...r.cells].map(c=>c.textContent))");
 assert.ok(Math.abs(+readings[2][1]-+readings[0][1])<.15);assert.ok(Math.abs(+readings[3][1]-+readings[1][1])>3);assert.equal(readings[2][2],readings[3][2]);
 await dose('water','sample1',20);await record('sample1');assert.match(await evaluate("document.querySelector('#measurements tr:last-child').textContent"),/Preparation\/dilution changed/);
 await dose('naoh','sample1',30);await record('sample1');assert.ok((await evaluate("Number(document.querySelector('#measurements tr:last-child').cells[1].textContent)"))>11,'buffer capacity exceeded');
 await click('#hl-analysis summary');await set('hl-total',.1);await set('hl-buffer-ph',-Math.log10(1.8e-5));await set('hl-kb',1e-14/1.8e-5);await click('#check-buffer-hl');assert.match(await evaluate("document.querySelector('#hl-feedback').textContent"),/Correct/);
 await shot('chemtopia-buffer-desktop.png');await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),true);await shot('chemtopia-buffer-phone.png');
 readings=await evaluate("[...document.querySelectorAll('#measurements tr')].map(r=>[...r.cells].map(c=>c.textContent))");const buffers=readings.filter(r=>r[0]==='Buffer preparation'),waters=readings.filter(r=>r[0]==='Water control'),delta=+buffers.at(-1)[1]-+buffers[0][1],H=10**(-Number(waters.at(-1)[1]));
 await click('#finish');await click('#explanation input[value="0"]');await evaluate(`(()=>{const f=document.querySelector('#explanation');f.elements['q2-value'].value=${delta};f.elements['q3-value'].value=${H};})()`);await click('#explanation button');assert.match(await evaluate("document.querySelector('#question-feedback').textContent"),/Activity complete/);
 await click('#restart');assert.equal(await evaluate("document.querySelectorAll('#measurements tr').length"),0);assert.equal(await evaluate("document.querySelector('#result').hidden"),true);await click('#return-laboratory');
 for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('[data-list-lab=buffer]')"))break;}catch{}await pause(100);}
 await evaluate(`(async()=>{const{playerStore}=await import('./player-store.js');const{stockAllLabsForTesting}=await import('./progression.js');playerStore.start('Buffer tester','c01-1');await playerStore.transact(stockAllLabsForTesting);})()`);
 await send('Page.navigate',{url:base+'/laboratory.html?adventure=1'});for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#stock-all-labs')"))break;}catch{}await pause(100);}
 await click('[data-list-lab=buffer]');await click('#room-launch');for(let i=0;i<60;i++){try{if(await evaluate("location.pathname==='/buffer.html'&&!!document.querySelector('#adventure-lab-bar')"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("JSON.parse(localStorage.getItem('chemtopia.player')).materials['buffer-reagents']"),99);await send('Page.reload');for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#adventure-lab-bar')"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("JSON.parse(localStorage.getItem('chemtopia.player')).materials['buffer-reagents']"),99);assert.deepEqual(exceptions,[]);console.log('PASS buffer preparation, matched water/acid measurements, graph, dilution, exhausted capacity, optional AHL, measured review, reset, desktop/phone, navigation and reservation-safe reload');
}finally{if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}

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
 await send('Page.navigate',{url:base+'/equilibrium.html'});
 for(let i=0;i<60;i++){try{if(await evaluate("document.querySelectorAll('[data-id]').length===11"))break;}catch{}await pause(100);}
 const click=async selector=>{if(selector.includes('data-equipment'))await hoverMenu(send,evaluate,pause);else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1100,y:350});await pause(100);}const p=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
 const set=async(id,value)=>evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)});e.value=${JSON.stringify(String(value))};e.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const select=async id=>click('[data-equipment='+id+']');
 const moveFromStorage=async(id,x,y)=>{await dragStored({id,x,y,release:true,send,evaluate,pause});await pause(150);};
 const dose=async(from,to,n)=>{await set('from',from);await set('to',to);await set('dose',n);await click('#transfer');assert.match(await evaluate("document.querySelector('#action-note').textContent"),/Transferred/);};
 const store=async id=>{await select(id);await click('#store-equipment');};
 const shot=async name=>{const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};
 await dose('iron','mixture1',5);await dose('thiocyanate','mixture1',5);await dose('water','mixture1',10);
 await store('iron');await store('thiocyanate');await store('mixture2');
 await moveFromStorage('reference1',110,300);await moveFromStorage('reference2',240,300);await moveFromStorage('waste',650,300);await moveFromStorage('cuvetteA',720,250);
 let closed=false;const lid=async value=>{if(value===closed)return;await select('meter');await click('#action');closed=value;};
 const insert=async id=>{await lid(false);await select(id);await click('[data-command=wipe]');await click('#action');await lid(true);};
 const remove=async id=>{await lid(false);await select(id);await click('#action');};
 await dose('water','cuvetteA',3);await insert('cuvetteA');await click('#blank');await set('known-concentration',0);await set('sample-label','Solvent');await click('#record-standard');await remove('cuvetteA');await store('cuvetteA');
 await moveFromStorage('cuvetteB',720,250);
 const drain=async()=>{await set('to','waste');await select('cuvetteB');await click('[data-command=drain]');};
 async function measure(source,standard){
  for(let i=0;i<2;i++){await dose(source,'cuvetteB',3);await drain();}await dose(source,'cuvetteB',3);await insert('cuvetteB');
  await set('sample-label',source);if(standard){await set('from',source);await click('#certificate');await click('#record-standard');}else await click('#record');
  await remove('cuvetteB');await drain();
 }
 await measure('reference1',true);await measure('reference2',true);await measure('mixture1',false);
 assert.equal(await evaluate("document.querySelectorAll('#measurements tr').length"),4);assert.match(await evaluate("document.querySelector('#data-summary').textContent"),/Calibration-derived/);
 const results=await evaluate(`(async()=>{const {fitCalibration}=await import('./colorimetry-model.js');const rows=[...document.querySelectorAll('#measurements tr')].map(r=>[...r.cells].map(c=>c.textContent));const fit=fitCalibration(rows.slice(0,3).map(r=>({type:'standard',filter:'blue',concentration:+r[1],absorbance:+r[2]})),'blue');const row=rows[3],x=(+row[2]-fit.intercept)/fit.slope,fe=+row[3]-x,scn=+row[4]-x;return{x,fe,scn,K:x/(fe*scn),totalFeAmount:+row[3]*+row[5]/1000};})()`);
 assert.ok(results.x>0&&Math.abs(results.K-890)<50,'recorded calibration recovers illustrative equilibrium constant within optical rounding/stray-light limits');
 await click('#hl-analysis summary');for(const [id,value]of [['hl-fe',results.fe],['hl-scn',results.scn],['hl-k',results.K]])await set(id,value);
 const q=await evaluate(`(async()=>{const{solveComplex,quotient}=await import('./equilibrium-model.js');const x=solveComplex(.001,.001)/2;return quotient(x,.0005-x,.0005-x);})()`);await set('hl-q',q);await set('hl-direction','reverse');await click('#check-hl');assert.match(await evaluate("document.querySelector('#hl-feedback').textContent"),/Correct/);
 await shot('chemtopia-equilibrium-desktop.png');
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),true);await shot('chemtopia-equilibrium-phone.png');
 await click('#finish');await click('#explanation input[value="0"]');// Numerical fields use form names, not IDs.
 await evaluate(`(()=>{const f=document.querySelector('#explanation');f.elements['q2-value'].value=${results.x};f.elements['q3-value'].value=${results.totalFeAmount};})()`);
 await click('#explanation button');assert.match(await evaluate("document.querySelector('#question-feedback').textContent"),/Activity complete/);
 await click('#restart');assert.equal(await evaluate("document.querySelectorAll('#measurements tr').length"),0);assert.equal(await evaluate("document.querySelector('#result').hidden"),true);
 await click('#return-laboratory');for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('[data-lab=equilibrium]')"))break;}catch{}await pause(100);}
 // Local fixture only seeds ownership; reserve and reload through the actual room UI.
 await evaluate(`(async()=>{const{playerStore}=await import('./player-store.js');const{stockAllLabsForTesting}=await import('./progression.js');playerStore.start('Equilibrium tester','c01-1');await playerStore.transact(stockAllLabsForTesting);})()`);
 await send('Page.navigate',{url:base+'/laboratory.html?adventure=1'});for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#stock-all-labs')"))break;}catch{}await pause(100);}
 await click('[data-list-lab=equilibrium]');for(let i=0;i<60;i++){if(await evaluate("document.querySelector('#room-requirements')?.open"))break;await pause(100);}assert.match(await evaluate("document.querySelector('#room-requirement-detail').textContent"),/Iron/);await click('#room-launch');for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#adventure-lab-bar')"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("JSON.parse(localStorage.getItem('chemtopia.player')).materials['iron-thiocyanate-kit']"),99);await send('Page.reload');for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#adventure-lab-bar')"))break;}catch{}await pause(100);}
 assert.equal(await evaluate("JSON.parse(localStorage.getItem('chemtopia.player')).materials['iron-thiocyanate-kit']"),99,'reload reuses reservation');assert.deepEqual(exceptions,[]);
 console.log('PASS equilibrium preparation, reference certificates, real optical blank/calibration, mixture measurement, optional K/Q, review, reset, desktop/phone, room navigation and one-charge adventure reservation');
}finally{if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}

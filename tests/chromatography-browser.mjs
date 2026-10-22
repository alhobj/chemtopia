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
 async function drag(id,x,y,{dx=0,dy=40,release=true,path=[]}={}){
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
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===10"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),10);
 const pose=async id=>evaluate(`(()=>{const m=document.querySelector('[data-id="${id}"]').transform.baseVal.consolidate().matrix;return{x:m.e,y:m.f};})()`);
 async function mark(id,x,y,homeX,homeY){
  const drop=await drag(id,x,y,{dy:id==='pencil'?40:30,release:false,path:[{x:homeX,y:10},{x,y:10}]});
  await key(' ','Space');await drop.move(x,10);await drop.move(homeX,10);await drop.move(homeX,homeY);await drop();
 }
 await pause(500);await screenshot('chemtopia-chromatography-initial.png');
 let p=await pose('paper');
 await mark('pencil',p.x,p.y+60,1140,91);
 assert.ok(await evaluate("!!document.querySelector('[data-mark=baseline]')"));
 for(const [id,dx,home]of [['green',-35,900],['purple',0,980],['black',35,1060]])await mark(id,p.x+dx,p.y+80,home,111);
 assert.equal(await evaluate("document.querySelectorAll('[data-band]').length"),7,'three marker samples are applied directly to paper');
 await drag('bar',600,299,{dy:0,path:[{x:950,y:240},{x:600,y:240}]});
 await drag('paper',600,305,{dy:60,path:[{x:300,y:60},{x:600,y:60}]});await pause(300);
 assert.ok((await evaluate("document.querySelector('[data-id=paper]').getAttribute('aria-description')")).includes('clipped'));
 const drop=await drag('source',565.6,100,{release:false,path:[{x:100,y:100}]});
 await key(' ','Space');await pause(1500);await key(' ','Space');await drop.move(100,100);await drop.move(100,413);await drop();
 await pause(8000);await screenshot('chemtopia-chromatography-running.png');
 assert.ok(await evaluate("!!document.querySelector('[data-solvent-front]')"),'water contact starts development');
 await drag('paper',300,345,{dy:60,path:[{x:600,y:60},{x:300,y:60}]});await pause(300);
 const front=Number(await evaluate("document.querySelector('[data-solvent-front]').dataset.solventFront"));p=await pose('paper');
 await mark('pencil',p.x,p.y+front-90,1140,91);
 await drag('ruler',p.x+90,325,{dy:80,path:[{x:1320,y:230},{x:p.x+90,y:230}]});
 const measured=await evaluate(`(()=>{const p=document.querySelector('[data-id=paper]');return{baseline:+p.querySelector('[data-mark=baseline]').dataset.y,front:+p.querySelector('[data-mark=front]').dataset.y,bands:[...p.querySelectorAll('[data-band]')].map(e=>+e.dataset.y)};})()`);
 await click('#finish');assert.ok(await evaluate("!!document.querySelector('#rf-form')"));
 const names=await evaluate("[...document.querySelectorAll('#rf-form input[name^=distance]')].map(e=>e.name.slice(9))");
 assert.equal(names.length,7);
 await evaluate(`(()=>{for(const e of document.querySelectorAll('#rf-form input'))e.value=e.name.startsWith('rf')?'0':'1';})()`);
 await click('#rf-form button');assert.ok((await evaluate("document.querySelector('#rf-feedback').textContent")).includes('Check the baseline'));
 await evaluate(`(()=>{const names=${JSON.stringify(names)},m=${JSON.stringify(measured)};names.forEach((id,i)=>{const d=Number(((m.baseline-m.bands[i])/10).toFixed(1)),f=Number(((m.baseline-m.front)/10).toFixed(1));document.querySelector('[name="distance-'+id+'"]').value=d;document.querySelector('[name="front-'+id+'"]').value=f;document.querySelector('[name="rf-'+id+'"]').value=(d/f).toFixed(2);});})()`);
 await click('#rf-form button');assert.ok((await evaluate("document.querySelector('#rf-feedback').textContent")).includes('correct'));
 await click('input[value="1"]');await click('#explanation button');
 assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Choose another answer'));
 await click('input[value="0"]');await click('#explanation button');
 assert.ok((await evaluate("document.querySelector('#question-feedback').textContent")).includes('Activity complete'));
 await screenshot('chemtopia-chromatography-review.png');
 console.log('PASS real marker/pencil actions, water pouring, paper support/development, front marking, ruler, R_F retry and explanation');
 await click('#restart');assert.equal(await evaluate("document.querySelectorAll('[data-band]').length"),0);
 // A submerged marker spot is allowed and dissolves into the reservoir.
 p=await pose('paper');await mark('green',p.x,p.y+80,900,111);
 await drag('bar',600,299,{dy:0,path:[{x:950,y:240},{x:600,y:240}]});
 await drag('paper',600,305,{dy:60,path:[{x:300,y:60},{x:600,y:60}]});
 const wet=await drag('source',565.6,100,{release:false,path:[{x:100,y:100}]});
 await key(' ','Space');await pause(3500);await key(' ','Space');await wet.move(100,100);await wet.move(100,413);await wet();await pause(500);
 assert.equal(await evaluate("document.querySelectorAll('[data-band]').length"),0,'submerged sample dissolves into reservoir');
 await click('#finish');assert.equal(await evaluate("!!document.querySelector('#rf-form')"),false);
 console.log('PASS physically possible submerged-spot mistake and unsuccessful Finish review');
 await click('#back-distillation');
 for(let i=0;i<40;i++){if(await evaluate("document.querySelectorAll('.equipment-button').length===12"))break;await pause(100);}
 assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),12);assert.deepEqual(exceptions,[]);
 console.log('PASS restart, return navigation and no browser exceptions');
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

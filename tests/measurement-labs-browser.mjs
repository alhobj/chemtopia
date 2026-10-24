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
 const screenshotElement=async(selector,name)=>{const clip=await evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1};})()`);const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip});await writeFile(path.join(tmpdir(),name),Buffer.from(r.data,'base64'));};
 async function visit(file){await send('Page.navigate',{url:base+'/'+file+'.html'});for(let i=0;i<60;i++){try{if(await evaluate("!!document.querySelector('#equipment-menu')"))break;}catch{}await pause(100);}assert.ok(await evaluate("!!document.querySelector('#live-reading')"));}
 async function press(){await key(' ','Space');await pause(45);}
 async function choose(id,index){await click('#'+id);await key('Home');for(let i=0;i<index;i++)await key('ArrowDown');await key('Enter');await pause(80);}
 async function textInput(id,value){await click('#'+id);await send('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'a',code:'KeyA',windowsVirtualKeyCode:65,modifiers:2});await send('Input.insertText',{text:String(value)});}
 async function putAway(id){await drag(id,await evaluate(`(()=>{const p=document.querySelector('[data-id="${id}"]').getCTM();return p.e;})()`),150,40,false);const p=await menuPoint(evaluate);await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...p});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});await pause(100);}
 async function lead(colour,target){const start=await evaluate(`(()=>{const r=document.querySelector('[data-lead="${colour}"]').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`),end=await point(target,0,0);await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...start});for(let i=1;i<=10;i++)await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,x:start.x+(end.x-start.x)*i/10,y:start.y+(end.y-start.y)*i/10});await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...end});await pause(120);}
 async function finishReview(mode){await click('#finish');assert.equal(await evaluate("document.querySelectorAll('#explanation fieldset').length"),3);await evaluate(`(()=>{const f=document.querySelector('#explanation'),p=f.querySelectorAll('legend')[1].textContent;f.querySelector('input[value="0"]').checked=true;let value;if('${mode}'==='conductivity'){const g=Number(p.match(/G = ([0-9.]+)/)[1]),k=Number(p.match(/K = ([0-9.]+)/)[1]);value=g*k;}else if('${mode}'==='colorimetry'){const m=Number(p.match(/m = ([0-9.eE+−-]+)/)[1].replace(/[.]$/,'')),b=Number(p.match(/b = ([0-9.eE+−-]+)/)[1].replace(/[.]$/,'')),a=Number(p.match(/absorbance is ([0-9.]+)/)[1].replace(/[.]$/,''));value=(a-b)/m;}else{const i=Number(p.match(/I = ([0-9.]+)/)[1]);value=i/1000*60/(2*96485)*63.546*1000;}if(!Number.isFinite(value))throw Error('Could not parse review data: '+p);f.elements['q2-value'].value=value;f.elements['q3-value'].value='${mode}'==='conductivity'?.24:'${mode}'==='colorimetry'?.06:1.10;f.requestSubmit();})()`);assert.match(await evaluate("document.querySelector('#question-feedback').textContent"),/Activity complete/);}

 // Conductivity: actual probe movement, wire-end dragging and sample comparison.
 await visit('conductivity');assert.equal(await evaluate("document.querySelectorAll('.equipment-button').length"),11);
 let a=await drag('electrodeA',140,350,40,false);await press();await a();let b=await drag('electrodeB',140,350,40,false);await press();await b();
 await lead('red','electrodeA');await lead('black','electrodeB');await click('[data-equipment=meter]');await click('#action');
 const salt=Number((await evaluate("document.querySelector('#live-reading').textContent")).split(' ')[0]);assert.ok(salt>1);await click('#record');
 await screenshot('chemtopia-conductivity-salt.png');
 a=await drag('electrodeA',260,350,40,false,[{x:128,y:280},{x:260,y:280}]);await press();await a();b=await drag('electrodeB',260,350,40,false,[{x:152,y:280},{x:260,y:280}]);await press();await b();
 const sugar=Number((await evaluate("document.querySelector('#live-reading').textContent")).split(' ')[0]);assert.ok(sugar>=0&&sugar<salt/100,'molecular sample with carried trace salt has a much smaller signal');await click('#record');assert.equal(await evaluate("document.querySelectorAll('#measurements tr').length"),2);
 await screenshot('chemtopia-conductivity-comparison.png');await screenshotElement('#measurement-data','chemtopia-conductivity-table.png');await finishReview('conductivity');await click('#restart');assert.equal(await evaluate("document.querySelectorAll('#measurements tr').length"),0);console.log('PASS conductivity: native probe placement, wire connections, geometry/film-sensitive readings, records, calculations and restart');

 // Colorimetry: prepare standards from finite stock/water portions.
 await visit('colorimetry');
 async function dose(index){await choose('dose',index);}
 async function pourPortions(id,x,count,index,returnX){await dose(index);const d=await drag(id,x,180,40,false,[{x:returnX,y:170}]);for(let i=0;i<count;i++)await press();await d.move(returnX,180);await d.move(returnX,300);await d();await pause(250);}
 await pourPortions('stock',400,1,2,140);await pourPortions('water',400,9,2,270);
 await pourPortions('stock',520,1,3,140);await pourPortions('water',520,4,3,270);
 await pourPortions('stock',640,2,3,140);await pourPortions('water',640,3,3,270);
 await putAway('stock');await drag('waste',140,350,40);await pause(450);
 await drag('cuvetteA',330,380,30);await pause(450);
 async function fill(id,source,sourceX){await dose(1);const d=await drag(source,330,180,40,false,[{x:sourceX,y:170}]);await press();await d.move(sourceX,180);await d.move(sourceX,300);await d();await pause(200);await click('[data-equipment='+id+']');assert.match(await evaluate("document.querySelector('#instrument').textContent"),/3[.]0[05] mL/,'cuvette received a measured portion');}
 async function insert(id){await click('[data-equipment='+id+']');await click('[data-command=wipe]');const d=await drag(id,820,330,25,false,[{x:330,y:240},{x:820,y:240}]);await press();await d();assert.match(await evaluate("document.querySelector('#action-note').textContent"),/inserted/);await click('[data-equipment=meter]');await click('#action');}
 async function remove(id){await click('[data-equipment=meter]');await click('#action');await click('[data-equipment='+id+']');await click('#action');}
 async function drain(id){const d=await drag(id,140,300,25,false,[{x:820,y:230},{x:140,y:230}]);await press();await d.move(330,240);await d.move(330,400);await d();await pause(350);}
 async function rinse(id){await fill(id,'water',270);await drain(id);}
 await fill('cuvetteA','water',270);await insert('cuvetteA');await click('[data-command=blank]');assert.match(await evaluate("document.querySelector('#action-note').textContent"),/blank recorded/);await textInput('known-concentration',0);await textInput('sample-label','Water blank');await click('#record-standard');
 await remove('cuvetteA');await putAway('cuvetteA');await drag('cuvetteB',330,380,25);await pause(400);
 for(const [id,c,x]of [['standard1',.01,400],['standard2',.02,520],['standard3',.04,640]]){
  await fill('cuvetteB',id,x);await insert('cuvetteB');await textInput('known-concentration',c);await textInput('sample-label',id);await click('#record-standard');await remove('cuvetteB');await drain('cuvetteB');await rinse('cuvetteB');await rinse('cuvetteB');
 }
 // Retrieve and pour the unknown using exactly the same physical controls.
 await dose(1);const unknown=await drag('unknown',330,180,40,false);await press();await unknown.move(270,180);await unknown();await putAway('unknown');
 await insert('cuvetteB');await textInput('sample-label','Unknown');await click('#record');
 await screenshot('chemtopia-colorimetry-debug.png');
 assert.equal(await evaluate("document.querySelectorAll('#measurements tr').length"),5,await evaluate("document.querySelector('#instrument-status').textContent+' | '+document.querySelector('#action-note').textContent"));
 const estimate=Number((await evaluate("document.querySelector('#data-summary').textContent")).match(/estimate: ([0-9.]+)/)[1]);assert.ok(Math.abs(estimate-.035)<.002,`calibration estimate ${estimate}`);
 await screenshot('chemtopia-colorimetry-calibration.png');await screenshotElement('#measurement-data','chemtopia-colorimetry-graph.png');await choose('filter',2);assert.match(await evaluate("document.querySelector('#instrument-status').textContent"),/Filter changed/);await finishReview('colorimetry');console.log('PASS colorimetry: native standard preparation, cuvette filling/rinsing, blanking, optical conditions, measured calibration, unknown and calculations');

 // Voltaic cell: electrodes, polarity, open bridge and loaded discharge.
 await visit('voltaic');a=await drag('zinc',350,350,40,false);await press();await a();b=await drag('copper',570,350,40,false);await press();await b();await lead('red','copper');await lead('black','zinc');
 assert.match(await evaluate("document.querySelector('#live-reading').textContent"),/1.100 V/);await click('#record');await lead('red','zinc');await lead('black','copper');assert.match(await evaluate("document.querySelector('#live-reading').textContent"),/-1.100 V/);
 await click('[data-equipment=copper]');await click('[data-command=red]');await click('[data-equipment=zinc]');await click('[data-command=black]');await click('[data-equipment=meter]');await click('#action');assert.match(await evaluate("document.querySelector('#live-reading').textContent"),/0.000 mA/);assert.match(await evaluate("document.querySelector('#instrument-status').textContent"),/bridge open/);
 const bridge=await drag('bridge',460,350,25,false);await press();await bridge();await click('[data-equipment=meter]');await click('[data-command=run]');await click('#record');
 const row=await evaluate("[...document.querySelectorAll('#measurements tr:last-child td')].map(x=>x.textContent)");assert.ok(Number(row[2])>0);assert.ok(Number(row[3])<.03*65.38);assert.ok(Number(row[4])>0);assert.match(row[5],/Bridge connected/);
 await screenshot('chemtopia-voltaic-discharge.png');await screenshotElement('#measurement-data','chemtopia-voltaic-table.png');await finishReview('voltaic');await click('#restart');await click('#finish');assert.match(await evaluate("document.querySelector('#result').textContent"),/Supplied example/);console.log('PASS voltaic cell: native metal contacts, reversed wire leads, bridge seating, no current without bridge, loaded discharge and redox calculations');
 assert.deepEqual(exceptions,[]);console.log('PASS all three measurement labs without browser runtime exceptions');
}finally{if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}

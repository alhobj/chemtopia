import {fillFollowups} from './review-browser-helpers.mjs';
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

 let acceptDialogs=true,dialogs=0;ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Page.javascriptDialogOpening'){dialogs++;send('Page.handleJavaScriptDialog',{accept:acceptDialogs}).catch(()=>{});}});
 async function waitFor(expression,label='condition'){for(let i=0;i<400;i++){try{if(await evaluate(expression))return;}catch{}await pause(70);}throw Error('Timed out: '+label);}
 async function type(selector,value){await click(selector);await send('Input.insertText',{text:value});}
 async function goPlace(id){await click(`[data-place="${id}"] text`);await waitFor(id==='laboratory'?"!!document.querySelector('#room-requirements')":"document.querySelector('#panel').open",id);}
 async function close(){await click('#close-panel');}
 await send('Page.navigate',{url:base});await waitFor("document.querySelectorAll('[data-character-choice]').length===6",'six characters');
 assert.equal(await evaluate("document.querySelector('#start-adventure').disabled"),true);await screenshot('chemtopia-character-selection.png');
 for(let i=1;i<=6;i++){
  if(i>1){await click('#options-button');await click('[data-action=new-game]');await waitFor("!document.querySelector('#onboarding').hidden",'New Game confirmation');}
  await click(`[data-character-choice="c01-${i}"]`);await type('#player-name','Player '+i);await click('#start-adventure');
  await waitFor("!document.querySelector('#game').hidden",'town');assert.equal(await evaluate("document.querySelector('#player svg').dataset.character"),'c01-'+i);
  await send('Page.reload');await waitFor("!document.querySelector('#game').hidden",'returning player');assert.equal(await evaluate("document.querySelector('#player-summary').textContent"),'Player '+i);
  for(const [keyName,code,direction]of [['d','KeyD','right'],['a','KeyA','left'],['w','KeyW','back'],['s','KeyS','front']]){
   await send('Input.dispatchKeyEvent',{type:'keyDown',key:keyName,code});const frames=new Set();for(let n=0;n<5;n++){await pause(55);frames.add(await evaluate("document.querySelector('#player .walk-sprite').dataset.frame"));}
   assert.equal(await evaluate("document.querySelector('#player .walk-sprite').dataset.facing"),direction);assert.ok(frames.size>1,'walking advances actual sprite frames');await send('Input.dispatchKeyEvent',{type:'keyUp',key:keyName,code});await waitFor("document.querySelector('#player .walk-sprite').dataset.moving==='false'",'idle');assert.equal(await evaluate("document.querySelector('#player .walk-sprite').dataset.frame"),'1');
  }
  assert.equal(await evaluate(`new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(true);image.onerror=()=>resolve(false);image.src='assets/world/walk-c01-${i}.png';})`),true,'actual walk atlas loads');

 }
 assert.equal(dialogs,5);await screenshot('chemtopia-adventure-town.png');
 // Cancelled New Game leaves the same profile and town intact.
 await click('#options-button');acceptDialogs=false;await click('[data-action=new-game]');await pause(100);assert.equal(await evaluate("document.querySelector('#game').hidden"),false);acceptDialogs=true;await close();
 const before=await evaluate("document.querySelector('#player').getAttribute('transform')");await send('Input.dispatchKeyEvent',{type:'keyDown',key:'d',code:'KeyD',windowsVirtualKeyCode:68});await pause(550);await send('Input.dispatchKeyEvent',{type:'keyUp',key:'d',code:'KeyD',windowsVirtualKeyCode:68});await pause(600);assert.notEqual(await evaluate("document.querySelector('#player').getAttribute('transform')"),before);
 await goPlace('welcome-sign');assert.match(await evaluate("document.querySelector('#panel-content').textContent"),/Player 6/);await close();
 await goPlace('guide');await close();await waitFor("document.querySelector('#tutorial-card h2').textContent==='Your laboratory kit'",'movement tutorial');
 await click('#inventory-button');await click('[data-inspect-equipment=beaker]');await click('[data-inspect-material=salt-solution]');await close();
 await waitFor("document.querySelector('#tutorial-card h2').textContent==='Lab credits'",'inventory tutorial');await send('Page.reload');await waitFor("document.querySelector('#tutorial-card h2')?.textContent==='Lab credits'",'tutorial resumes');
 await click('#credits-button');await click('[data-action=currency-read]');await goPlace('laboratory');
 await click('[data-lab=evaporation] .bench-label');await waitFor("document.querySelector('#room-requirements').open",'requirements');assert.equal(await evaluate("document.querySelector('#room-launch').disabled"),false);await click('#room-launch');await waitFor("!!document.querySelector('#adventure-lab-bar')",'owned lab');
 assert.equal(await evaluate("document.querySelector('[data-equipment=receiver]').disabled"),true,'starter owns only the source beaker');assert.equal(await evaluate("document.querySelector('[data-equipment=basin]').disabled"),false);assert.equal(await evaluate("!!document.querySelector('#adventure-lab-block')"),false);

 await drag('basin',600,387,35,true,[{x:350,y:250},{x:600,y:250}]);await pause(300);
 const pour=await drag('source',565.6,120,40,false,[{x:110,y:120}]);await key(' ','Space');await pause(4300);await key(' ','Space');await pour.move(110,120);await pour.move(110,413);await pour();
 await click('[data-equipment=heater]');await key(' ','Space');await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1000,y:350});
 await waitFor("document.querySelector('#basin-state').textContent==='Dry salt residue'",'starter kit actually completes evaporation');await click('#finish');await fillFollowups(evaluate,'evaporation');await click('input[value="0"]');await click('#explanation button');await waitFor("JSON.parse(localStorage.getItem('chemtopia.player')).completed.includes('evaporation')",'review completion saved');
 await send('Page.reload');await waitFor("!!document.querySelector('#adventure-lab-bar')",'same reservation reload');
 await click('#adventure-lab-bar a');await waitFor("!document.querySelector('#game').hidden",'return to town');await click('#map-button');await waitFor("!!document.querySelector('#progression-map')",'map');
 await click('#map-experiment-select');await key('Home');for(let i=0;i<8;i++)await key('ArrowDown');await key('Enter');await waitFor("document.querySelector('#experiment-detail').textContent.includes('Missing equipment')",'locked details');await close();await waitFor("document.querySelector('#tutorial-card h2').textContent==='Your town, your laboratory.'",'five tutorial stages');
 await click('#credits-button');await click('[data-action=currency-read]');await goPlace('shop');
 const credits=await evaluate("JSON.parse(localStorage.getItem('chemtopia.player')).currency");await click('[data-action=grant]');await waitFor("JSON.parse(localStorage.getItem('chemtopia.player')).currency==="+(credits+1000),'testing allowance');await click('[data-action=grant]');assert.equal(await evaluate("JSON.parse(localStorage.getItem('chemtopia.player')).currency"),credits+1000);
 await click('[data-buy=beaker]');await waitFor("JSON.parse(localStorage.getItem('chemtopia.player')).equipment.beaker===2",'purchase ownership');await close();
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await click('#map-button');await click('[data-map-zoom="1.2"]');await click('[data-map-pan=down]');assert.equal(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),true,'phone has no horizontal page overflow');await screenshot('chemtopia-adventure-phone-map.png');await close();
 console.log('PASS all six four-direction walk cycles, idle frames and atlas loading; six actual characters, local returning profiles, confirmed/cancelled New Game, native movement/interactions, inventory, tutorial resume, starter lab ownership, reservation reload and progression map');
 await screenshot('chemtopia-adventure-tutorial-complete.png');
 await send('Page.navigate',{url:base+'/walking-preview.html'});await waitFor("document.querySelectorAll('.walk-sprite').length===24",'all directions preview');await click('#toggle');await pause(80);assert.equal(await evaluate("[...document.querySelectorAll('.walk-sprite')].every(e=>e.dataset.moving==='false'&&e.dataset.frame==='1')"),true);await screenshot('chemtopia-walking-preview.png');
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await send('Page.navigate',{url:base+'/adventure.html'});await waitFor("!!document.querySelector('#player .walk-sprite')",'reduced motion town');await send('Input.dispatchKeyEvent',{type:'keyDown',key:'d',code:'KeyD'});await pause(220);assert.equal(await evaluate("document.querySelector('#player .walk-sprite').dataset.facing"),'right');assert.equal(await evaluate("document.querySelector('#player .walk-sprite').dataset.frame"),'1');await send('Input.dispatchKeyEvent',{type:'keyUp',key:'d',code:'KeyD'});
 assert.deepEqual(exceptions,[]);console.log('PASS 24-direction preview, pause control and reduced-motion directional movement');

}finally{if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});}

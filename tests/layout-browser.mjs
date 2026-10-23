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
 for(const page of ['index','distillation','chromatography','evaporation','recrystallisation','solution','titration','neutralisation','combustion']){
  await send('Page.navigate',{url:base+'/'+page+'.html'});
  for(let i=0;i<40;i++){if(await evaluate("!!document.querySelector('#equipment-menu')"))break;await pause(100);}
  for(const [width,height]of [[1440,900],[2383,1000],[390,844]]){
   await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await pause(250);
   const layout=await evaluate("(()=>{const r=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};return{workspace:r(document.querySelector('.workspace')),bench:r(document.querySelector('#bench')),sidebar:r(document.querySelector('.sidebar')),tab:r(document.querySelector('#equipment-tab')),extra:!!document.querySelector('.topbar,.intro,.bench-toolbar,.bench-caption,footer'),overflow:document.documentElement.scrollWidth>innerWidth+1};})()");
   assert.equal(layout.extra,false,page+' has no decorative page text');assert.equal(layout.overflow,false,page+' stays inside viewport');
   assert.ok(layout.workspace.y<10&&layout.workspace.height>height*.85,page+' uses nearly the whole window');
   if(width>760){assert.ok(Math.abs(layout.tab.x-layout.sidebar.right)<2);assert.ok(Math.abs(layout.tab.right-layout.bench.x)<2);assert.ok(layout.bench.width>width*.75);}
   const scale=await evaluate("(()=>{const m=document.querySelector('#bench').getScreenCTM();return{x:Math.hypot(m.a,m.b),y:Math.hypot(m.c,m.d)};})()");assert.ok(Math.abs(scale.x-scale.y)<.001,'equipment retains its proportions');
   if(width===1440)await screenshot('chemtopia-layout-'+page+'.png');
  }
  console.log('PASS '+page+' fullscreen lab, drawer position and proportional equipment at desktop, wide and mobile sizes');
 }
 assert.deepEqual(exceptions,[]);
}finally{
 if(ws)ws.close();chrome.kill();server.kill();await pause(300);await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}

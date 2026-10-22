export const menuPoint=evaluate=>evaluate("(()=>{const r=document.querySelector('#equipment-tab').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+Math.min(100,r.height/2)};})()");
export async function hoverMenu(send,evaluate,pause){await send('Input.dispatchMouseEvent',{type:'mouseMoved',...await menuPoint(evaluate)});await pause(250);}
// Real pointer drag from a stored inventory row to the SVG bench.
export async function dragStored({id,x,y,release,send,evaluate,pause}){
 const stored=await evaluate(`document.querySelector('[data-equipment="${id}"]').dataset.stored==='true'`);
 if(!stored)return null;
 await evaluate("document.querySelector('#bench').scrollIntoView({block:'center'})");
 const tab=await evaluate("(()=>{const r=document.querySelector('#equipment-tab').getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+30};})()");
 await send('Input.dispatchMouseEvent',{type:'mouseMoved',...tab});await pause(250);
 await evaluate(`document.querySelector('[data-equipment="${id}"]').scrollIntoView({block:'nearest'})`);
 const start=await evaluate(`(()=>{const r=document.querySelector('[data-equipment="${id}"]').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...start});
 let end=start;
 async function move(x,y){end=await evaluate(`(()=>{const p=new DOMPoint(${x},${y}).matrixTransform(document.querySelector('#bench').getScreenCTM());return{x:p.x,y:p.y};})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',buttons:1,...end});}
 const covered=await evaluate(`(()=>{const p=new DOMPoint(${x},${y}).matrixTransform(document.querySelector('#bench').getScreenCTM()),r=document.querySelector('#equipment-menu').getBoundingClientRect();return p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom;})()`);
 if(covered){const width=await evaluate("document.querySelector('#bench').viewBox.baseVal.width");await move(width*.8,80);await pause(100);await move(x,80);}
 await move(x,y);await pause(80);
 const drop=()=>send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...end});drop.move=move;
 if(release)await drop();return drop;
}

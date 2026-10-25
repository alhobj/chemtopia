export const WORLD={width:1200,height:760,tile:25};
export const PLACES=[
 {id:'laboratory',name:'Your laboratory',kind:'laboratory',art:1,x:145,y:65,w:305,h:225,door:{x:300,y:305},solid:{x:160,y:125,w:280,h:155}},
 {id:'school',name:'Science school',kind:'school',art:2,x:735,y:55,w:280,h:235,door:{x:870,y:307},solid:{x:750,y:110,w:245,h:175}},
 {id:'shop',name:'Equipment shop',kind:'shop',art:3,x:825,y:460,w:265,h:205,door:{x:935,y:680},solid:{x:840,y:510,w:235,h:150}},
 {id:'home',name:'Home',kind:'home',art:4,x:140,y:455,w:265,h:220,door:{x:265,y:690},solid:{x:155,y:505,w:225,h:160}},
 {id:'welcome-sign',name:'Welcome sign',kind:'sign',x:520,y:500,point:{x:520,y:510}},
 {id:'guide',name:'Town guide',kind:'guide',x:570,y:465,point:{x:570,y:480}},
 {id:'map',name:'Progression noticeboard',kind:'map',x:730,y:350,point:{x:730,y:380}}
];
export const placePoint=p=>p.door||p.point;
export function walkable(x,y){if(!Number.isFinite(x)||!Number.isFinite(y)||x<25||y<300||x>1175||y>720)return false;if(PLACES.some(p=>p.solid&&x>p.solid.x-10&&x<p.solid.x+p.solid.w+10&&y>p.solid.y-10&&y<p.solid.y+p.solid.h+10))return false;return Math.hypot(x-610,y-385)>48;}
export function movePlayer(position,dx,dy,seconds){const d=Math.hypot(dx,dy);if(!d||seconds<=0)return{...position};const travel=Math.min(seconds,.05)*180,x=position.x+dx/d*travel,y=position.y+dy/d*travel,next={...position};if(walkable(x,position.y))next.x=x;if(walkable(next.x,y))next.y=y;const mx=next.x-position.x,my=next.y-position.y;if(mx||my)next.facing=Math.abs(mx)>Math.abs(my)?mx<0?'left':'right':my<0?'back':'front';return next;}
export function nearestPlace(position,maxDistance=90){return PLACES.map(p=>({p,d:Math.hypot(placePoint(p).x-position.x,placePoint(p).y-position.y)})).filter(o=>o.d<=maxDistance).sort((a,b)=>a.d-b.d)[0]?.p||null;}
export function routeTo(position,target){const tile=WORLD.tile,cols=48,rows=31,toCell=p=>({x:Math.round(p.x/tile),y:Math.round(p.y/tile)}),start=toCell(position),goal=toCell(target),key=p=>p.x+','+p.y;let candidates=[];for(let r=0;r<=3&&!candidates.length;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++){const p={x:goal.x+dx,y:goal.y+dy};if(walkable(p.x*tile,p.y*tile))candidates.push(p);}if(!candidates.length)return[];candidates.sort((a,b)=>Math.hypot(a.x-goal.x,a.y-goal.y)-Math.hypot(b.x-goal.x,b.y-goal.y));const goals=new Set(candidates.map(key)),queue=[start],came=new Map([[key(start),null]]);let found=null;for(let i=0;i<queue.length;i++){const p=queue[i];if(goals.has(key(p))){found=p;break;}for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]]){const n={x:p.x+dx,y:p.y+dy};if(n.x<1||n.x>=cols||n.y<12||n.y>=rows||came.has(key(n))||!walkable(n.x*tile,n.y*tile))continue;came.set(key(n),p);queue.push(n);}}if(!found)return[];const route=[];for(let p=found;p&&key(p)!==key(start);p=came.get(key(p)))route.push({x:p.x*tile,y:p.y*tile});return route.reverse();}

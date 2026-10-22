// Storage preserves each item's material state; it is not a source of replacement apparatus.
export function initializeStorage(state){
 for(const o of Object.values(state.items))if(!o.fixed&&o.y<200)o.stored=true;
 state.shelves=[];return state;
}
export function storeItem(state,id,world){
 const o=state.items[id];if(!o||o.fixed||state.phase!=='working')return false;
 const ids=new Set([id]);let changed=true;
 while(changed){changed=false;for(const item of Object.values(state.items))if(item.parent&&ids.has(item.parent)&&!ids.has(item.id)){ids.add(item.id);changed=true;}}
 if(state.links)state.links=state.links.filter(l=>!ids.has(l.a)&&!ids.has(l.b));
 for(const key of ids){state.items[key].stored=true;if('on'in state.items[key])state.items[key].on=false;}
 if(o.parent&&!ids.has(o.parent))o.parent=null;
 for(const hose of state.hoses||[])for(let i=0;i<hose.ends.length;i++)if(hose.ends[i].port&&ids.has(hose.ends[i].port.split(':')[0]))hose.ends[i]={x:o.x,y:o.y};
 state.held=null;state.flow=[];world.release();return true;
}
export function takeItem(state,id,x,y,world){
 const o=state.items[id];if(!o||o.fixed||state.phase!=='working')return false;
 const snapshot=Object.values(state.items).filter(v=>v.id===id||v.parent===id).map(v=>[v,{x:v.x,y:v.y,angle:v.angle,stored:v.stored,parent:v.parent}]);
 o.parent=null;
 const dx=x-o.x,dy=y-o.y;
 for(const [v]of snapshot){v.x+=dx;v.y+=dy;v.stored=false;}
 o.angle=0;state.held=id;world.hold(id);
 const entry=world.entries.get(id);
 if(entry&&world.blocked(entry.body,snapshot.map(([v])=>v.id))){
  for(const [v,pose]of snapshot)Object.assign(v,pose);
  state.held=null;world.release();return false;
 }
 return true;
}

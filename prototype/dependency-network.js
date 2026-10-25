// Actual AND dependencies: a lab needs every incoming equipment group. Shared
// groups branch into several labs; identical usage sets are bundled for clarity.
import {experiments,assertAcyclic} from './experiment-definitions.js';
import {EQUIPMENT} from './equipment-catalog.js';
export function dependencyNetwork(definitions=experiments){
 const groups=new Map();
 for(const id of new Set(definitions.flatMap(e=>Object.keys(e.equipment)))){
  for(const quantity of [...new Set(definitions.map(e=>e.equipment[id]).filter(Boolean))].sort((a,b)=>a-b)){
   const consumers=definitions.filter(e=>(e.equipment[id]||0)>=quantity).map(e=>e.id),signature=consumers.join('|');
   if(!groups.has(signature))groups.set(signature,{consumers,equipment:{}});
   groups.get(signature).equipment[id]=quantity;
  }
 }
 const nodes=[...definitions.map(e=>({id:e.id,type:'experiment',name:e.shortName||e.name,equipment:e.equipment}))],edges=[];
 for(const [index,group]of [...groups.values()].entries()){
  const ids=Object.keys(group.equipment),id='gear:'+ids.map(key=>key+'-'+group.equipment[key]).join('+');
  const name=ids.length===1?`${EQUIPMENT[ids[0]].name}${group.equipment[ids[0]]>1?' × '+group.equipment[ids[0]]:''}`:(definitions.find(e=>e.id===group.consumers[0]).shortName||definitions.find(e=>e.id===group.consumers[0]).name)+' apparatus';
  nodes.push({id,type:'equipment',name,equipment:group.equipment,consumers:group.consumers,order:index});
  // A higher quantity subsumes lower thresholds. Connect just the exact
  // requirement here; additional ownership thresholds are connected below.
  for(const e of definitions)if(ids.some(key=>e.equipment[key]===group.equipment[key]))edges.push({from:id,to:e.id,type:'required',label:Object.entries(group.equipment).map(([key,n])=>`${n} × ${EQUIPMENT[key].name}`).join(', ')});
 }
 for(const node of nodes.filter(n=>n.type==='equipment'))for(const [key,n]of Object.entries(node.equipment)){
  const lower=nodes.filter(p=>p.type==='equipment'&&p.id!==node.id&&p.equipment[key]<n).sort((a,b)=>b.equipment[key]-a.equipment[key])[0];
  if(lower)edges.push({from:lower.id,to:node.id,type:'quantity',label:`Increase ${EQUIPMENT[key].name} ownership to ${n}`});
 }
 const graph={nodes,edges};assertAcyclic(graph);return graph;
}
export function networkView(graph,experimentId,focused=false){
 if(!focused)return graph;
 const ids=new Set([experimentId]);let changed=true;
 while(changed){changed=false;for(const edge of graph.edges)if(ids.has(edge.to)&&!ids.has(edge.from)){ids.add(edge.from);changed=true;}}
 return{nodes:graph.nodes.filter(n=>ids.has(n.id)),edges:graph.edges.filter(e=>ids.has(e.from)&&ids.has(e.to))};
}
export function networkLayout(graph){
 assertAcyclic(graph);
 const rank=new Map(graph.nodes.map(n=>[n.id,0]));
 for(let i=0;i<graph.nodes.length;i++)for(const edge of graph.edges)rank.set(edge.to,Math.max(rank.get(edge.to),rank.get(edge.from)+1));
 // Topological layers reflect actual inputs: starter evaporation stays before
 // multi-instrument and higher-count laboratories, rather than forcing every lab
 // to the far side of the most advanced equipment chain.
 const columns=new Map();for(const n of graph.nodes){const r=rank.get(n.id);if(!columns.has(r))columns.set(r,[]);columns.get(r).push(n);}
 const order=new Map(graph.nodes.filter(n=>n.type==='experiment').map((n,i)=>[n.id,i]));
 const score=n=>n.type==='experiment'?order.get(n.id):(n.consumers||[]).reduce((sum,id)=>sum+(order.get(id)||0),0)/(n.consumers?.length||1);
 const nodes=[];let x=25;
 for(const [r,column]of [...columns].sort(([a],[b])=>a-b)){
  column.sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));
  column.forEach((n,i)=>nodes.push({...n,x:x+Math.floor(i/8)*230,y:35+(i%8)*105,rank:r}));
  x+=Math.ceil(column.length/8)*230+65;
 }
 return{nodes,edges:graph.edges};
}
export function equipmentNodeState(player,node){
 const missing=Object.entries(node.equipment).filter(([id,n])=>(player.equipment[id]||0)<n);
 return{state:missing.length?'missing-equipment':'completed',label:missing.length?missing.length+' equipment '+(missing.length===1?'type':'types')+' missing':'Owned',missing};
}

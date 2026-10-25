import test from 'node:test';
import assert from 'node:assert/strict';
import {dependencyNetwork,networkView,networkLayout,equipmentNodeState} from '../prototype/dependency-network.js';
import {experiments,assertAcyclic,graphEdgePath} from '../prototype/experiment-definitions.js';
import {EQUIPMENT} from '../prototype/equipment-catalog.js';
import {newPlayer} from '../prototype/player-store.js';
import {equipmentPreview} from '../prototype/equipment-previews.js';
import {mapMarkup,gearDetails} from '../prototype/dependency-map.js';
test('network expresses shared equipment branches and converging lab requirements without completion gates',()=>{
 const graph=dependencyNetwork();assert.ok(assertAcyclic(graph));assert.equal(graph.nodes.filter(n=>n.type==='experiment').length,13);
 assert.ok(graph.nodes.some(n=>n.type==='equipment'&&graph.edges.filter(e=>e.from===n.id&&e.type==='required').length>3));
 assert.ok(graph.edges.filter(e=>e.to==='distillation').length>3);
 for(const lab of experiments){
  const ancestors=networkView(graph,lab.id,true),equipment={};
  for(const n of ancestors.nodes.filter(n=>n.type==='equipment'))for(const [id,quantity]of Object.entries(n.equipment))equipment[id]=Math.max(quantity,equipment[id]||0);
  assert.deepEqual(equipment,lab.equipment,lab.id+' has all and only its actual equipment requirements');
 }
});
test('network focused view and layout remain stable, acyclic and separated',()=>{
 const graph=dependencyNetwork();assert.equal(networkView(graph,'evaporation',true).nodes.filter(n=>n.type==='experiment').length,1);
 for(const focus of [false,true]){
  const view=networkView(graph,'distillation',focus),layout=networkLayout(view);assert.ok(assertAcyclic(view));
  for(const edge of layout.edges)assert.ok(layout.nodes.find(n=>n.id===edge.from).x<layout.nodes.find(n=>n.id===edge.to).x);
  for(const edge of layout.edges){
   const points=[...graphEdgePath(layout.nodes,edge).matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m=>({x:+m[1],y:+m[2]}));
   for(let i=1;i<points.length;i++)for(let step=0;step<=50;step++){
    const a=points[i-1],b=points[i],x=a.x+(b.x-a.x)*step/50,y=a.y+(b.y-a.y)*step/50;
    assert.ok(!layout.nodes.some(n=>n.id!==edge.from&&n.id!==edge.to&&x>n.x&&x<n.x+165&&y>n.y&&y<n.y+66),'arrows avoid unrelated equipment/lab nodes');
   }
  }

  for(let i=0;i<layout.nodes.length;i++)for(let j=i+1;j<layout.nodes.length;j++){const a=layout.nodes[i],b=layout.nodes[j];assert.ok(Math.abs(a.x-b.x)>=165||Math.abs(a.y-b.y)>=66);}
 }
});
test('equipment nodes reflect exact owned counts and map explains AND requirements',()=>{
 const p=newPlayer('Ada','c01-1'),node=dependencyNetwork().nodes.find(n=>n.type==='equipment'&&n.equipment.beaker===2);
 assert.equal(equipmentNodeState(p,node).state,'missing-equipment');p.equipment.beaker=2;assert.equal(equipmentNodeState(p,node).state,'completed');
 assert.match(gearDetails(p,node.id),/Used in/);assert.match(mapMarkup(p,'distillation',true).html,/every incoming requirement is needed/);
});
test('every shop equipment ID has a matching labelled preview with finite drawing coordinates',()=>{
 for(const id of Object.keys(EQUIPMENT)){const svg=equipmentPreview(id);assert.ok(svg.includes(`data-preview="${id}"`),id);assert.match(svg,/role="img"/);assert.ok(!/NaN|undefined|Infinity/.test(svg),id);}
 assert.equal(equipmentPreview('absent'),'');
});

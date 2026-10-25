import test from 'node:test';
import assert from 'node:assert/strict';
import {setArtwork} from '../prototype/svg-render.js';
import {equipmentArt} from '../prototype/equipment-art.js';
test('moving identical apparatus retains its DOM; changed contents replace it',()=>{
 let writes=0,html='';const element={get innerHTML(){return html;},set innerHTML(value){writes++;html=value;}};
 const o={id:'source',kind:'beaker',water:.5,capacity:1,sand:0};
 const art=()=>equipmentArt(o,'','filtration',{});
 setArtwork(element,art());for(let i=0;i<120;i++){o.x=i;setArtwork(element,art());}assert.equal(writes,1);
 o.water=.25;setArtwork(element,art());assert.equal(writes,2);
});
test('water surface counter-rotates inside the glass clip and paper contains separate grains',()=>{
 const liquid=equipmentArt({id:'source',kind:'beaker',water:.5,capacity:1,angle:45},'','filtration',{});
 assert.match(liquid,/rotate\(-45 /);assert.match(liquid,/class="vessel-contents"[^>]* clip-path=/);
 const clean=equipmentArt({id:'paper',kind:'paper',sand:0},'','filtration',{}),dirty=equipmentArt({id:'paper',kind:'paper',sand:.1},'','filtration',{});
 assert.ok(!clean.includes('solid-grain'));assert.ok((dirty.match(/solid-grain/g)||[]).length>10);assert.ok(!dirty.includes('M-25 10H25L0 31Z'));
});

test('opaque ceramic and metal containers expose a surface in their mouth, never a fill on the outer wall',()=>{
 for(const [kind,lab]of [['basin','evaporation'],['cup','neutralisation'],['can','combustion']]){
  const full=equipmentArt({id:'opaque-'+kind,kind,water:.9,capacity:1,salt:0,angle:0},'',lab,{});
  assert.match(full,/class="liquid-surface"/);assert.ok(!full.includes('class="liquid-fill"'));
  const empty=equipmentArt({id:'empty-'+kind,kind,water:0,capacity:1,salt:0,angle:0},'',lab,{});assert.ok(!empty.includes('liquid-surface'));
 }
});
test('wash bottle liquid uses its body cavity, excluding the dispensing hardware',()=>{
 const html=equipmentArt({id:'wash-test',kind:'wash',water:100,capacity:100,angle:0},'','solution',{});
 assert.match(html,/data-interior-kind="wash"/);assert.ok(!html.includes('contents-silhouette'));
});

test('chromatography visible solvent height matches the actual paper-contact surface',()=>{
 for(const water of [.04,.2,.7]){
  const html=equipmentArt({id:'chamber',kind:'chamber',water,capacity:1,angle:0},'','chromatography',{});
  assert.ok(html.includes(`rotate(0 -5 ${216-200*water})`));
 }
});

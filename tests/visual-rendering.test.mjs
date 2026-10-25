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
 assert.match(liquid,/rotate\(-45 /);assert.match(liquid,/class="vessel-contents" clip-path=/);
 const clean=equipmentArt({id:'paper',kind:'paper',sand:0},'','filtration',{}),dirty=equipmentArt({id:'paper',kind:'paper',sand:.1},'','filtration',{});
 assert.ok(!clean.includes('solid-grain'));assert.ok((dirty.match(/solid-grain/g)||[]).length>10);assert.ok(!dirty.includes('M-25 10H25L0 31Z'));
});

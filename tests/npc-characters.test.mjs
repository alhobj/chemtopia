import test from 'node:test';
import assert from 'node:assert/strict';
import {NPC_CHARACTERS,NPC_DIRECTIONS,npcArt} from '../prototype/npc-characters.js';
import {NPC_ATLASES} from '../prototype/npc-atlases.js';
import {readFileSync} from 'node:fs';

test('all eighteen NPC identities have four distinct in-bounds standing views',()=>{
  assert.equal(new Set(NPC_CHARACTERS.map(n=>n.id)).size,18);
  assert.deepEqual(NPC_DIRECTIONS.map(d=>d.id),['east','north','west','south']);
  for(const atlas of Object.values(NPC_ATLASES)){
    const png=readFileSync(new URL('../prototype/assets/world/'+atlas.file,import.meta.url));
    assert.equal(png.readUInt32BE(16),atlas.width);
    assert.equal(png.readUInt32BE(20),atlas.height);
  }
  for(const npc of NPC_CHARACTERS){
    const atlas=NPC_ATLASES[npc.groupId],views=atlas.characters[npc.column];
    assert.equal(new Set(Object.values(views).map(v=>v.y)).size,4,npc.id);
    for(const direction of NPC_DIRECTIONS){
      const f=views[direction.id];assert.ok(f.w>0&&f.h>0&&f.x>=0&&f.y>=0&&f.x+f.w<=atlas.width&&f.y+f.h<=atlas.height,npc.id);
      assert.ok(f.body.w>0&&f.body.h>0&&f.body.x>=f.x&&f.body.y>=f.y&&f.body.x+f.body.w<=f.x+f.w&&f.body.y+f.body.h<=f.y+f.h,npc.id);
      const art=npcArt(npc.id,direction.id);assert.ok(art.includes(`data-facing="${direction.id}"`));assert.ok(art.includes(atlas.file));assert.ok(art.includes('clipPathUnits="userSpaceOnUse"'));
    }
  }
});
test('NPC cardinal renderer retains front/back caller compatibility',()=>{
  for(const npc of NPC_CHARACTERS){assert.equal(npcArt(npc.id,true),npcArt(npc.id,'north'));assert.equal(npcArt(npc.id,false),npcArt(npc.id,'south'));assert.equal(npcArt(npc.id,'left'),npcArt(npc.id,'west'));}
  assert.equal(npcArt('unknown','east'),'');
});

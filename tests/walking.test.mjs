import test from 'node:test';
import assert from 'node:assert/strict';
import {walkingPose,walkingArt,WALK_STEP_DISTANCE} from '../prototype/walking-animation.js';
import {movePlayer} from '../prototype/town-model.js';
import {newPlayer,migrateSave} from '../prototype/player-store.js';

test('movement faces all four actual travel directions and preserves facing when blocked',()=>{
  for(const [x,y,facing] of [[1,0,'right'],[-1,0,'left'],[0,-1,'back'],[0,1,'front']]){
    const p=movePlayer({x:600,y:570,facing:'front'},x,y,.05);
    assert.equal(p.facing,facing);
  }
  assert.equal(movePlayer({x:25,y:500,facing:'right'},-1,0,.05).facing,'right');
});
test('distance-based walk cycles alternate four frames and stop in a stable idle pose',()=>{
  assert.deepEqual([0,1,2,3,4].map(i=>walkingPose('right',i*WALK_STEP_DISTANCE,true).frame),[0,1,2,3,0]);
  assert.equal(walkingPose('right',100,false).frame,1);
  assert.equal(walkingPose('back',100,true,true).frame,1);
  assert.equal(walkingPose('left',100,true).mirror,true);
  assert.equal(walkingPose('right',100,true).mirror,false);
  assert.equal(walkingPose('back').row,1);
  assert.equal(walkingPose('front').row,0);
});
test('all six identities render their own directional atlas and saved facing survives load',()=>{
  for(let i=1;i<=6;i++)for(const direction of ['front','back','left','right']){
    const id=`c01-${i}`,p=newPlayer('Ada',id);p.position.facing=direction;
    assert.equal(migrateSave(p).position.facing,direction);
    const svg=walkingArt(id,walkingPose(direction,36,true));
    assert.ok(svg.includes(`walk-${id}.png`));
    assert.ok(svg.includes(`data-facing="${direction}"`));
    assert.ok(svg.includes('clipPathUnits="userSpaceOnUse"'));
    assert.ok(svg.includes('<rect width="1" height="1"/>'));
  }
  assert.equal(walkingArt('unknown',walkingPose('front')),'');
});

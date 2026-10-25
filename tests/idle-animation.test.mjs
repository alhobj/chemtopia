import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IDLE_PROFILES,idlePose,idleSeed,IDLE_TIMING} from '../prototype/idle-definitions.js';
import {IDLE_ATLASES} from '../prototype/idle-atlases.js';
import {idleArt} from '../prototype/idle-animation.js';

test('all 24 actors have role-specific idles with delayed gestures and staggered timing',()=>{
  assert.equal(Object.keys(IDLE_PROFILES).length,24);
  const blinkOffsets=new Set();
  for(const id of Object.keys(IDLE_PROFILES)){
    const delay=IDLE_TIMING.minimumDelay+idleSeed(id)%4000,timing={...IDLE_TIMING,...IDLE_PROFILES[id].timing};
    assert.notEqual(idlePose(id,1000).phase,'gesture');
    assert.equal(idlePose(id,delay+100).gestureFrame,0);
    assert.equal(idlePose(id,delay+(timing.preparation+timing.recoveryStart)/2).gestureFrame,1);
    assert.equal(idlePose(id,delay+(timing.recoveryStart+timing.gestureDuration)/2).gestureFrame,2);
    assert.notEqual(idlePose(id,delay+2000).phase,'gesture');
    blinkOffsets.add(idleSeed(id)%1300);
    assert.ok(IDLE_PROFILES[id].action);
  }
  assert.ok(blinkOffsets.size>20);
});
test('movement, reduced motion and dialogue cancel gestures without turning the actor',()=>{
  for(const id of Object.keys(IDLE_PROFILES)){
    for(const direction of ['north','east','west','south']){
      const reduced=idlePose(id,500,{direction,reducedMotion:true,forceAction:true});
      assert.equal(reduced.phase,'neutral');assert.equal(reduced.breath,1);assert.equal(reduced.direction,direction);
      assert.equal(idlePose(id,500,{direction,moving:true,forceAction:true}).phase,'neutral');
      assert.notEqual(idlePose(id,500,{direction,attention:true,forceAction:true}).phase,'gesture');
      if(direction!=='south')assert.notEqual(idlePose(id,500,{direction,forceAction:true}).phase,'gesture');
    }
  }
});
test('breathing is subtle; brief blinks occur where eyes are visible',()=>{
  for(const id of Object.keys(IDLE_PROFILES)){
    const period=3200+idleSeed(id)%1600,offset=idleSeed(id)%1300,t=period-offset-50;
    for(const direction of ['south','east','west'])assert.equal(idlePose(id,t,{direction,attention:true}).phase,'blink');
    assert.equal(idlePose(id,t,{direction:'north'}).blink,false);
    for(let t=0;t<8000;t+=50){const p=idlePose(id,t);assert.ok(p.breath>=.994&&p.breath<=1.006);}
  }
});
test('idle atlas metadata matches actual PNGs and every pose is a complete nonempty cell',()=>{
  for(const atlas of Object.values(IDLE_ATLASES)){
    const png=readFileSync(new URL('../prototype/assets/world/'+atlas.file,import.meta.url));
    assert.equal(png.readUInt32BE(16),atlas.width);assert.equal(png.readUInt32BE(20),atlas.height);
    assert.equal(atlas.characters.length,6);
    for(const poses of atlas.characters)for(const f of Object.values(poses)){
      assert.ok(f.w>0&&f.h>0&&f.body.w>0&&f.body.h>0);
      assert.ok(f.x>=0&&f.y>=0&&f.x+f.w<=atlas.width&&f.y+f.h<=atlas.height);
    }
  }
  for(const id of Object.keys(IDLE_PROFILES))for(const direction of ['south','east','west','north']){
    const svg=idleArt(id,idlePose(id,0,{direction}));assert.ok(svg.includes('class="idle-upper"'));assert.ok(svg.includes(`data-cardinal="${direction}"`));
  }
  for(const id of Object.keys(IDLE_PROFILES))for(const gestureFrame of [0,1,2]){
    const pose={...idlePose(id),phase:'gesture',gestureFrame};
    const svg=idleArt(id,pose);assert.ok(svg.includes('-gesture.png'));assert.equal(svg.includes('NaN'),false);
  }
});

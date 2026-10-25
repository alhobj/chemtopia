// Cosmetic behaviours only: these props do not enter equipment inventories.
const profiles = [
  ['c01-1','Check watch'], ['c01-2','Chew gum'], ['c01-3','Stretch shoulders'],
  ['c01-4','Quick underarm check'], ['c01-5','Adjust glasses'], ['c01-6','Tuck hair'],
  ['n01-1','Toss and catch ball',{gestureDuration:850,preparation:220,recoveryStart:450}], ['n01-2','Inspect a leaf'], ['n01-3','Adjust glasses'],
  ['n01-4','Chew gum'], ['n01-5','Check watch'], ['n01-6','Quick underarm check'],
  ['n02-1','Straighten cardigan'], ['n02-2','Wipe hands on apron'], ['n02-3','Check watch'],
  ['n02-4','Adjust glasses'], ['n02-5','Stretch shoulder'], ['n02-6','Quick underarm check',undefined,[2,1,2]],
  ['n03-1','Check notebook'], ['n03-2','Check watch'], ['n03-3','Adjust goggles'],
  ['n03-4','Stretch wrist'], ['n03-5','Turn notebook page'], ['n03-6','Adjust goggles'],
];
export const IDLE_PROFILES = Object.fromEntries(profiles.map(([id,action,timing,gestureFrames=[0,1,2]])=>[id,{id,action,timing,gestureFrames,gestureDirections:['south']} ]));
export const IDLE_TIMING = {gestureDuration:1800, preparation:300, recoveryStart:1400, minimumDelay:7000};
export function idleSeed(id){let hash=2166136261;for(const c of id)hash=Math.imul(hash^c.charCodeAt(0),16777619);return hash>>>0;}
export function cardinalDirection(direction){return ({front:'south',back:'north',left:'west',right:'east',up:'north',down:'south'})[direction]||(['south','north','east','west'].includes(direction)?direction:'south');}

export function idlePose(id,elapsed=0,{direction='south',moving=false,reducedMotion=false,attention=false,forceAction=false}={}){
  const profile=IDLE_PROFILES[id],seed=idleSeed(id),cardinal=cardinalDirection(direction);
  elapsed=Number.isFinite(elapsed)?Math.max(0,elapsed):0;
  const pose={id,direction:cardinal,phase:'neutral',gestureFrame:0,blink:false,breath:1,action:profile?.action||'',moving:Boolean(moving)};
  if(!profile||moving||reducedMotion)return {...pose,key:`${id}:${cardinal}:neutral`};
  pose.breath=1+.006*Math.sin(elapsed/3400*Math.PI*2+(seed%1000)/1000*Math.PI*2);
  const timing={...IDLE_TIMING,...profile.timing},delay=IDLE_TIMING.minimumDelay+seed%4000,period=14000+seed%6000;
  const gestureTime=forceAction?elapsed%2400:(elapsed-delay)%period;
  if(!attention&&profile.gestureDirections.includes(cardinal)&&(forceAction||elapsed>=delay)&&gestureTime>=0&&gestureTime<timing.gestureDuration){
    pose.phase='gesture';pose.gestureFrame=gestureTime<timing.preparation?0:gestureTime<timing.recoveryStart?1:2;
  }else if(cardinal!=='north'&&(elapsed+seed%1300)%(3200+seed%1600)>3200+seed%1600-110){
    pose.phase='blink';pose.blink=true;
  }
  return {...pose,key:`${id}:${cardinal}:${pose.phase}:${pose.gestureFrame}`};
}

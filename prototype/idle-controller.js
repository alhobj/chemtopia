import {idlePose,renderIdle,preloadIdleAssets} from './idle-animation.js';

// One clock for a gallery; seeded profiles prevent actors blinking in unison.
export function animateIdles(root,{directionFor=element=>element.dataset.idleDirection||'south'}={}){
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let elapsed=0,last=0,paused=false,forced=false,disposed=false;
  const elements=[...root.querySelectorAll('[data-idle-character]')],visible=new Set(elements);
  preloadIdleAssets(elements.map(e=>e.dataset.idleCharacter));
  const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{for(const e of entries)e.isIntersecting?visible.add(e.target):visible.delete(e.target);});
  for(const e of elements)observer?.observe(e);
  const render=(all=false)=>{
    for(const element of elements){
      if(!all&&!visible.has(element)&&element.dataset.idleKey)continue;
      const id=element.dataset.idleCharacter;
      const pose=idlePose(id,elapsed,{direction:directionFor(element),reducedMotion:media.matches||paused,forceAction:forced});
      renderIdle(element,id,pose);
    }
  };
  function frame(time){
    if(disposed)return;
    if(!document.hidden&&!paused&&!media.matches)elapsed+=Math.min(100,time-(last||time));
    last=time;render();requestAnimationFrame(frame);
  }
  const motionChanged=()=>render(true);media.addEventListener('change',motionChanged);
  render();requestAnimationFrame(frame);
  return {
    pause(value){paused=Boolean(value);render(true);},
    demonstrate(){forced=true;elapsed=0;render(true);},
    natural(){forced=false;elapsed=0;render(true);},
    refresh:()=>render(true),
    dispose(){disposed=true;observer?.disconnect();media.removeEventListener('change',motionChanged);},
  };
}

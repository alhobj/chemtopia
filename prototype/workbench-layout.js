// Fit the visible room to the available pane without stretching equipment or changing physics.
export function fitWorkbench(bench){
 const roomWidth=bench.viewBox.baseVal.width,roomHeight=610,NS='http://www.w3.org/2000/svg';
 const background=document.createElementNS(NS,'g');background.setAttribute('aria-hidden','true');background.setAttribute('pointer-events','none');bench.prepend(background);
 const observer=new ResizeObserver(()=>{
  const {width,height}=bench.getBoundingClientRect();if(width<=0||height<=0)return;
  const scale=Math.min(width/roomWidth,height/roomHeight),w=width/scale,h=height/scale,x=(roomWidth-w)/2,y=roomHeight-h;
  bench.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);
  background.innerHTML=`<rect transform="scale(${roomWidth/1000} 1)" x="${x/(roomWidth/1000)}" y="${y}" width="${w/(roomWidth/1000)}" height="${h}" fill="url(#tiles)"/><rect x="${x}" y="210" width="${w}" height="335" fill="url(#surface)"/><rect x="${x}" y="545" width="${w}" height="65" fill="#526e71"/><path d="M${x} 550H${x+w}" stroke="#9aab9b" stroke-width="10"/>`;
 });
 observer.observe(bench);
}

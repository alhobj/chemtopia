// Review-only tool: moving the ruler never changes the frozen experiment or its marks.
export function attachReviewRuler(svg){
 const controller=new AbortController(),options={signal:controller.signal};
 const ruler=svg.querySelector('[data-review-ruler]');let drag=null,x=95,y=180;
 const point=e=>new DOMPoint(e.clientX,e.clientY).matrixTransform(svg.getScreenCTM().inverse());
 const move=()=>{ruler.setAttribute('transform',`translate(${x} ${y})`);ruler.setAttribute('aria-description',`Zero at paper coordinate ${y.toFixed(1)}. Scale in centimetres.`);};
 ruler.addEventListener('pointerdown',e=>{if(e.button!==0)return;const p=point(e);drag={pointerId:e.pointerId,dx:p.x-x,dy:p.y-y};ruler.setPointerCapture(e.pointerId);e.preventDefault();});
 window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointerId)return;const p=point(e);x=Math.max(-70,Math.min(120,p.x-drag.dx));y=Math.max(0,Math.min(205,p.y-drag.dy));move();},options);
 const release=()=>{drag=null;};window.addEventListener('pointerup',release,options);window.addEventListener('pointercancel',release,options);window.addEventListener('blur',release,options);
 move();return()=>controller.abort();
}
export const reviewRulerArt=()=>`<g data-review-ruler role="button" tabindex="0" aria-label="Draggable review ruler" transform="translate(95 180)"><rect x="-15" y="-200" width="30" height="200" rx="3" fill="#ddc28d" fill-opacity=".85" stroke="#354f60" stroke-width="2"/>${Array.from({length:41},(_,i)=>`<path d="M-15 ${-i*5}h${i%2?6:11}" stroke="#546362"/>${i%2?'':`<text x="0" y="${-i*5+3}" font-size="7">${i/2}</text>`}`).join('')}<text x="-5" y="12" font-size="9">cm</text></g>`;

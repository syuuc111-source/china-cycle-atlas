const TAU=Math.PI*2;
export const shortestAngle=(from,to)=>((to-from+Math.PI)%TAU+TAU)%TAU-Math.PI;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

// A retarget samples the current pose first. No queued journeys or stale endpoints.
export function createCamera(initial){
 let pose={...initial},journey=null,progress=1;
 function sample(now){
  if(journey){
   progress=Math.max(0,Math.min(1,(now-journey.start)/journey.duration));
   const t=ease(progress);
   for(const key of Object.keys(journey.end))pose[key]=journey.from[key]+(journey.end[key]-journey.from[key])*t;
   if(progress===1){pose={...journey.end};journey=null}
  }
  return {...pose};
 }
 return {
  sample,
  to(target,now,duration){
   sample(now);const end={...pose,...target};end.angle=pose.angle+shortestAngle(pose.angle,end.angle);
   if(duration<=0){pose=end;journey=null;progress=1;return}
   journey={from:{...pose},end,start:now,duration};progress=0;
  },
  drift(delta){if(!journey)pose.angle+=delta},
  finish(){if(journey)pose={...journey.end};journey=null;progress=1},
  get moving(){return !!journey},get progress(){return progress}
 };
}

// DOM motion never delays a route update. Each element has at most one active effect.
export function createEffects(){
 const media=matchMedia('(prefers-reduced-motion: reduce)'),running=new Map();
 function cancel(el){const a=running.get(el);if(a){running.delete(el);a.cancel()}}
 function animate(el,frames,options={}){
  if(!el)return null;cancel(el);
  if(media.matches||!el.getClientRects().length)return null;
  const a=el.animate(frames,{duration:850,easing:'cubic-bezier(.22,.7,.2,1)',...options});running.set(el,a);
  a.finished.then(()=>{if(running.get(el)===a){running.delete(el);a.cancel()}},()=>{});
  return a;
 }
 function reveal(elements,{distance=20,delay=0,duration=850}={}){
  const mobile=matchMedia('(max-width:760px)').matches;
  [...elements].filter(Boolean).forEach((el,i)=>animate(el,[{opacity:0,transform:`translateY(${mobile?distance*.55:distance}px)`},{opacity:1,transform:'translateY(0)'}],{duration:mobile?Math.min(duration,700):duration,delay:delay+Math.min(i*55,220),fill:'backwards'}));
 }
 function settle(){for(const a of running.values()){a.finish();a.cancel()}running.clear()}
 media.addEventListener('change',()=>{if(media.matches)settle()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)settle()});
 return {animate,reveal,cancel,settle,get reduced(){return media.matches}};
}

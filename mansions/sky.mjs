import {createCamera} from './motion.mjs';
const TAU=Math.PI*2,DEG=Math.PI/180;
export const GROUP_COLORS={dragon:'#79cbb5',tortoise:'#82aee0',tiger:'#dfce9e',bird:'#e18b76'};
const GROUP_RA={dragon:242,tortoise:325,tiger:48,bird:145};
const GROUP_POSE={dragon:[-10,-5,1],tortoise:[12,7,1.02],tiger:[18,-7,1.04],bird:[-12,5,1]};
const vec=([hip,ra,dec,mag])=>({hip,ra:ra*DEG,dec:dec*DEG,mag});
export function createSky(canvas,data,onSelect){
 const ctx=canvas.getContext('2d'),stars=data.stars.map(vec),byHip=new Map(stars.map(s=>[s.hip,s]));
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const camera=createCamera({angle:GROUP_RA.dragon*DEG,tilt:-10*DEG,roll:-5*DEG,zoom:1,dragon:1,tortoise:0,tiger:0,bird:0});
 let pose=camera.sample(0),w=600,h=600,r=240,baseRadius=240,group='dragon',paused=media.matches,active=true,raf=0,last=0,hits=[],targetKey='';
 const project=(ra,dec)=>{const a=ra-pose.angle,c=Math.cos(dec),s=Math.sin(dec),x=c*Math.sin(a),y=s*Math.cos(pose.tilt)-c*Math.cos(a)*Math.sin(pose.tilt);return {x:x*Math.cos(pose.roll)-y*Math.sin(pose.roll),y:x*Math.sin(pose.roll)+y*Math.cos(pose.roll),z:s*Math.sin(pose.tilt)+c*Math.cos(a)*Math.cos(pose.tilt)}};
 const screen=p=>({x:w/2+p.x*r,y:h/2-p.y*r});
 function curve(points,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();let started=false;for(const p of points){const t=project(p[0],p[1]),v=screen(t);if(t.z<0){started=false;continue}if(started)ctx.lineTo(v.x,v.y);else ctx.moveTo(v.x,v.y);started=true;}ctx.stroke()}
 function draw(){
  pose=camera.sample(performance.now());r=baseRadius*pose.zoom;canvas.dataset.moving=String(camera.moving);
  ctx.clearRect(0,0,w,h);if(w<1||h<1)return;
  const cx=w/2,cy=h/2;const fog=ctx.createRadialGradient(cx-r*.3,cy+r*.1,0,cx,cy,r);fog.addColorStop(0,'#89b8a40b');fog.addColorStop(.6,'#63948608');fog.addColorStop(1,'#08111800');ctx.fillStyle=fog;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#839a8229';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.strokeStyle='#8a99801c';ctx.beginPath();ctx.arc(cx,cy,r+11,0,TAU);ctx.stroke();
  for(let i=0;i<180;i++){const a=i/180*TAU;ctx.strokeStyle=i%5===0?'#91a38470':'#91a38428';ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(r+15),cy+Math.sin(a)*(r+15));ctx.lineTo(cx+Math.cos(a)*(r+(i%5===0?21:18)),cy+Math.sin(a)*(r+(i%5===0?21:18)));ctx.stroke()}
  for(let ra=0;ra<360;ra+=30)curve(Array.from({length:91},(_,j)=>[ra*DEG,(-90+j*2)*DEG]),'#9aaf9f1c',.6);
  for(let dec=-60;dec<=60;dec+=30)curve(Array.from({length:181},(_,j)=>[j*2*DEG,dec*DEG]),dec===0?'#b0bd9e43':'#9aaf9f1c',.6);
  const ecliptic=Array.from({length:181},(_,i)=>{const l=i*2*DEG,ob=23.4393*DEG;return [Math.atan2(Math.sin(l)*Math.cos(ob),Math.cos(l)),Math.asin(Math.sin(l)*Math.sin(ob))]});curve(ecliptic,'#c9ac674a',.8);
  for(const s of stars){const p=project(s.ra,s.dec);if(p.z<0)continue;const xy=screen(p),size=Math.max(.35,1.6-s.mag*.22),alpha=Math.min(.95,Math.max(.12,(6.1-s.mag)/6));ctx.globalAlpha=alpha*(.4+.6*p.z);ctx.fillStyle='#e1e7dc';ctx.beginPath();ctx.arc(xy.x,xy.y,size,0,TAU);ctx.fill();if(s.mag<1.5){ctx.globalAlpha=.3;const g=ctx.createRadialGradient(xy.x,xy.y,0,xy.x,xy.y,9);g.addColorStop(0,'#f4f0cd88');g.addColorStop(1,'#f4f0cd00');ctx.fillStyle=g;ctx.fillRect(xy.x-9,xy.y-9,18,18)}}ctx.globalAlpha=1;
  for(const c of data.asterisms){
   const weight=pose[c.group],reveal=c.group===group&&camera.moving?Math.min(1,.12+camera.progress*1.1):1;
   ctx.strokeStyle=GROUP_COLORS[c.group];ctx.globalAlpha=.13+.65*weight;ctx.lineWidth=.55+.85*weight;
   for(const line of c.lines){for(let i=1;i<line.length;i++){
    const fraction=Math.max(0,Math.min(1,reveal*(line.length-1)-(i-1)));if(!fraction)continue;
    const a=byHip.get(line[i-1]),b=byHip.get(line[i]);if(!a||!b)continue;
    const pa=project(a.ra,a.dec),pb=project(b.ra,b.dec);if(pa.z<0||pb.z<0)continue;
    const ap=screen(pa),bp=screen(pb);ctx.beginPath();ctx.moveTo(ap.x,ap.y);ctx.lineTo(ap.x+(bp.x-ap.x)*fraction,ap.y+(bp.y-ap.y)*fraction);ctx.stroke();
   }}
  }ctx.globalAlpha=1;
  hits=[];const labelRects=[];
  const sorted=[...data.mansions].sort((a,b)=>(b.group===group)-(a.group===group));
  for(const m of sorted){const s=byHip.get(m.anchor.hip);if(!s)continue;const p=project(s.ra,s.dec);if(p.z<.07)continue;const xy=screen(p),selected=m.group===group;hits.push({...xy,id:m.id});ctx.fillStyle=selected?GROUP_COLORS[group]:'#c1d0c1';ctx.beginPath();ctx.arc(xy.x,xy.y,selected?2.7:1.6,0,TAU);ctx.fill();if(selected){ctx.strokeStyle=GROUP_COLORS[group]+'5c';ctx.beginPath();ctx.arc(xy.x,xy.y,7,0,TAU);ctx.stroke()}
   if(pose[m.group]<.03)continue;const label=m.name,xx=xy.x+11,yy=xy.y-12;const collides=labelRects.some(a=>Math.abs(a.x-xx)<30&&Math.abs(a.y-yy)<22);const adjusted=collides?yy+29:yy;labelRects.push({x:xx,y:adjusted});ctx.font=`${w<450?15:18}px "SimSun",serif`;ctx.fillStyle='#dce5d4';ctx.shadowColor='#080e12';ctx.shadowBlur=5;ctx.globalAlpha=pose[m.group];ctx.fillText(label,xx,adjusted);ctx.globalAlpha=1;ctx.shadowBlur=0;
  }
  ctx.fillStyle='#829c8e99';ctx.font='8px sans-serif';ctx.textAlign='center';ctx.fillText('天球 · 正射投影',cx,cy-r-28);ctx.fillText('赤道与黄道 / 方向投影',cx,cy+r+35);ctx.textAlign='start';
 }
 function tick(t){raf=0;if(!active||document.hidden)return;if(t-last>30){if(!camera.moving&&!paused&&!media.matches)camera.drift(Math.min((t-last)||0,60)*.000018);last=t;draw()}if(camera.moving||(!paused&&!media.matches))raf=requestAnimationFrame(tick)}
 function start(){if(!raf&&(camera.moving||(!paused&&!media.matches))&&active&&!document.hidden){last=performance.now();raf=requestAnimationFrame(tick)}}
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
 function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);baseRadius=Math.max(10,Math.min(w*.41,h*.37));draw()}
 const observer=new ResizeObserver(resize);observer.observe(canvas);
 const click=e=>{const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;const x=(e.clientX-box.left)*w/box.width,y=(e.clientY-box.top)*h/box.height;const hit=hits.map(p=>({...p,d:Math.hypot(p.x-x,p.y-y)})).filter(p=>p.d<20).sort((a,b)=>a.d-b.d)[0];if(hit)onSelect(hit.id)};
 function setView({group:id,anchor,chapter,instant=false}){
  const key=JSON.stringify([id,anchor?.hip,chapter]);if(targetKey===key)return;targetKey=key;group=id;
  const [tilt,roll,zoom]=GROUP_POSE[id],star=anchor&&byHip.get(anchor.hip);
  const chapterPose=chapter===undefined?null:[[4,-8,1],[-12,4,1.07],[22,-12,.94],[-8,9,.98],[10,0,1.22],[18,-4,1.02]][chapter];
  const target={angle:star?star.ra:GROUP_RA[id]*DEG,tilt:star?star.dec:(chapterPose?.[0]??tilt)*DEG,roll:(chapterPose?.[1]??roll)*DEG,zoom:star?(w<500?1.12:1.25):(chapterPose?.[2]??zoom)};
  for(const g of Object.keys(GROUP_RA))target[g]=Number(g===id);
  camera.to(target,performance.now(),instant||media.matches||!active?0:w<500?800:1050);draw();start();
 }
 const visibility=()=>{if(document.hidden){stop();camera.finish();draw()}else start()};
 const reduced=()=>{if(media.matches){camera.finish();stop();draw()}else start()};
 canvas.addEventListener('click',click);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',reduced);resize();start();
 return {setView,setPaused(value){paused=value;stop();start();draw()},setActive(value){active=value;if(!value){stop();camera.finish();draw()}else{resize();start()}},destroy(){stop();observer.disconnect();canvas.removeEventListener('click',click);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',reduced)}};
}

export function detailStarMap(mansion,data){
 const c=data.asterisms.find(c=>c.id===mansion.id),stars=new Map(data.stars.map(s=>[s[0],s]));
 const members=[...new Set(c.lines.flat())];const anchor=stars.get(mansion.anchor.hip);const ra0=anchor[1]*DEG,dec0=anchor[2]*DEG;
 const pts=members.map(id=>{const s=stars.get(id),ra=s[1]*DEG,dec=s[2]*DEG;return {id,mag:s[3],x:Math.cos(dec)*Math.sin(ra-ra0),y:-(Math.sin(dec)*Math.cos(dec0)-Math.cos(dec)*Math.cos(ra-ra0)*Math.sin(dec0))}});
 const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);const scale=Math.min(350/Math.max(maxX-minX,.005),170/Math.max(maxY-minY,.005));const pointMap=new Map(pts.map(p=>[p.id,{...p,x:250+(p.x-(minX+maxX)/2)*scale,y:130+(p.y-(minY+maxY)/2)*scale}]));
 const linePaths=c.lines.map(line=>`<polyline pathLength="1" points="${line.map(id=>{const p=pointMap.get(id);return `${p.x},${p.y}`}).join(' ')}" fill="none" stroke="${GROUP_COLORS[mansion.group]}" stroke-opacity=".65" stroke-width="1"/>`).join('');
 const pointHtml=[...pointMap.values()].map(p=>{const label=data.names[String(p.id)]||`HIP ${p.id}`;return `<g role="button" tabindex="0" data-star="${p.id}" aria-label="${label}，查看恒星资料"><circle cx="${p.x}" cy="${p.y}" r="10" fill="transparent"/><circle cx="${p.x}" cy="${p.y}" r="${Math.max(1.8,4-p.mag*.45)}" fill="#f1eee0"/><circle cx="${p.x}" cy="${p.y}" r="7" fill="#dfeddc" opacity=".07"/><title>${label}</title></g>`}).join('');
 return `<svg viewBox="0 0 500 270" aria-label="${mansion.name}宿主要星官，点击星点查看名称"><defs><pattern id="star-grid" width="50" height="45" patternUnits="userSpaceOnUse"><path d="M50 0H0V45" fill="none" stroke="#8eae9915" stroke-width=".6"/></pattern></defs><rect width="500" height="270" fill="url(#star-grid)"/>${linePaths}${pointHtml}<text x="18" y="24" style="font-size:9px;fill:#8ca596">${mansion.name}宿 · 同名星官</text><text x="18" y="253" style="font-size:9px;fill:#8ca596">J2000 方向投影 / 比例随星官调整</text></svg>`;
}

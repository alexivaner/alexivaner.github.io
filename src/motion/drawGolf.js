import {bones,poseAt,project,visibleJoints} from './golf.js';
let pending;
export async function loadMotionFrames(){
 pending ||= fetch('/assets/media/golf-body-motion.json').then(async response=>{
  if(!response.ok)throw new Error('Motion preview unavailable');
  const data=await response.json();
  if(data.format!=='body17-normalized-v1'||!Array.isArray(data.frames)||data.frames.length<2||data.frames.length>1000||!data.frames.every(f=>Array.isArray(f)&&f.length===17&&f.every(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite))))throw new Error('Invalid body motion');

  return data;
 }).catch(error=>{pending=null;throw error;});
 return (await pending).frames;
}
export async function loadGolfDrawer(){const frames=await loadMotionFrames();return (ctx,width,height,phase,camera,colors)=>drawGolf(ctx,width,height,phase,camera,colors,frames);}

function drawGolf(ctx,width,height,phase,camera,colors,frames){
 ctx.clearRect(0,0,width,height);ctx.lineCap='round';ctx.lineJoin='round';
 const p=poseAt(phase,frames),toScreen=v=>project(v,camera,width,height);
 function line(a,b,color,size=1,alpha=1){const x=toScreen(a),y=toScreen(b);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=size;ctx.beginPath();ctx.moveTo(x[0],x[1]);ctx.lineTo(y[0],y[1]);ctx.stroke();}
 for(const x of [-.6,0,.6])line([x,0,-.4],[x,0,1.3],colors.rule,1,.6);
 for(const z of [-.2,.4,1])line([-1,0,z],[1,0,z],colors.rule,1,.6);
 const alpha=1;
 const ordered=bones.map(([a,b])=>({a,b,z:(toScreen(p[a])[2]+toScreen(p[b])[2])/2})).sort((a,b)=>b.z-a.z);
 const widthBase=Math.max(3,Math.min(width,height)*.014);
 for(const {a,b,z} of ordered){const size=widthBase*3.8/(3.8+z);line(p[a],p[b],colors.ink2,size,alpha);line(p[a],p[b],colors.muted,size*.45,alpha*.5);}
 for(const name of visibleJoints){const [x,y,z]=toScreen(p[name]),radius=(name==='head'?Math.max(8,widthBase*1.8):widthBase*.6)*3.8/(3.8+z);ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);const surface=ctx.createRadialGradient(x-radius*.35,y-radius*.4,radius*.1,x,y,radius);surface.addColorStop(0,colors.paper);surface.addColorStop(.55,colors.muted);surface.addColorStop(1,colors.ink2);ctx.fillStyle=surface;ctx.fill();}
 // A restrained wrist marker highlights motion without exposing extra product joints.
 const hand=toScreen(p.leftHand);ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(hand[0],hand[1],Math.max(2,widthBase*.36),0,Math.PI*2);ctx.fillStyle=colors.accent;ctx.fill();ctx.globalAlpha=1;
}

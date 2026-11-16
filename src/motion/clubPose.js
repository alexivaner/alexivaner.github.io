import {Vector3} from 'three';
export function clubPoseAt(phase,frames){
 const position=Math.max(0,Math.min(1,phase))*(frames.length-1),i=Math.floor(position),j=Math.min(i+1,frames.length-1),t=position-i;
 return Object.fromEntries(['grip','heel','head'].map(key=>[key,new Vector3(...frames[i][key]).lerp(new Vector3(...frames[j][key]),t)]));
}
export async function loadClubFrames(){
 const response=await fetch('/assets/media/golf-club-motion.json');if(!response.ok)throw new Error('Club motion unavailable');const data=await response.json();
 if(data.format!=='club-pose-v1'||!Array.isArray(data.frames)||data.frames.length<2||data.frames.length>1000||!data.frames.every(frame=>['grip','heel','head'].every(k=>Array.isArray(frame[k])&&frame[k].length===3&&frame[k].every(Number.isFinite))))throw new Error('Invalid club motion');
 return data.frames;
}

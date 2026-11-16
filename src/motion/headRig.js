import {Vector3,Quaternion,Matrix4} from 'three';
const v=xyz=>new Vector3(...xyz);
function orientation(right,up){
 const y=up.clone().normalize(),x=right.clone().addScaledVector(y,-right.dot(y)).normalize();
 return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x,y,new Vector3().crossVectors(x,y).normalize()));
}
function worldRotation(bone,rotation){
 const parent=bone.parent.getWorldQuaternion(new Quaternion());
 bone.quaternion.copy(parent.invert().multiply(rotation));bone.updateMatrixWorld(true);
}
export function headPoseAt(phase,frames){
 const index=Math.max(0,Math.min(1,phase))*(frames.length-1),a=Math.floor(index),b=Math.min(a+1,frames.length-1),t=index-a;
 const direction=key=>v(frames[a][key]).lerp(v(frames[b][key]),t).normalize();
 return {neck:direction('neck'),rotation:orientation(direction('right'),direction('up'))};
}
export function createHeadRetargeter({neck,head,tip,rightShoulder,leftShoulder}){
 const at=bone=>bone.getWorldPosition(new Vector3());
 const neckBind=neck.quaternion.clone(),headBind=head.getWorldQuaternion(new Quaternion());
 const neckAxis=head.position.clone().normalize();
 const bindFrame=orientation(at(rightShoulder).sub(at(leftShoulder)),at(tip).sub(at(head)));
 const correction=bindFrame.invert().multiply(headBind);
 return pose=>{
  // Carry the torso's current twist into the neck, then align only its swing.
  const inherited=neck.parent.getWorldQuaternion(new Quaternion()).multiply(neckBind);
  const axis=neckAxis.clone().applyQuaternion(inherited).normalize();
  const swing=new Quaternion().setFromUnitVectors(axis,pose.neck);
  worldRotation(neck,swing.multiply(inherited));
  // The head has its own captured orientation, rather than sharing the neck aim.
  worldRotation(head,pose.rotation.clone().multiply(correction));
 };
}
let pending;
export async function loadHeadFrames(){
 pending ||= fetch('/assets/media/golf-head-motion.json').then(async response=>{
  if(!response.ok)throw new Error('Head motion unavailable');
  const data=await response.json();
  if(data.format!=='head-directions-v1'||!Array.isArray(data.frames)||data.frames.length<2||data.frames.length>1000||!data.frames.every(f=>['neck','up','right'].every(k=>Array.isArray(f[k])&&f[k].length===3&&f[k].every(Number.isFinite)&&Math.abs(v(f[k]).length()-1)<.001)))throw new Error('Invalid head motion');
  return data.frames;
 }).catch(error=>{pending=null;throw error;});
 return pending;
}

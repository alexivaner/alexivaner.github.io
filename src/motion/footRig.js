import {Vector3,Quaternion} from 'three';
const up=new Vector3(0,1,0);
const horizontal=v=>v.clone().setY(0).normalize();
export function createFootRetargeter({left,right,leftToe,rightToe,first,frames}){
 const at=bone=>bone.getWorldPosition(new Vector3());
 const stance=horizontal(new Vector3(...first.rightAnkle).sub(new Vector3(...first.leftAnkle))),restStance=horizontal(at(right).sub(at(left)));
 const registration=new Quaternion().setFromUnitVectors(restStance,stance);
 const feet=[['left',left,leftToe],['right',right,rightToe]].map(([side,bone,toe])=>{
  const bind=registration.clone().multiply(bone.getWorldQuaternion(new Quaternion())),forward=horizontal(at(toe).sub(at(bone))).applyQuaternion(registration),length=at(toe).distanceTo(at(bone));
  const baseline=frames.map(frame=>frame[side==='left'?6:3][1]).sort((a,b)=>a-b)[Math.floor(frames.length*.1)];
  return {side,bone,bind,axis:new Vector3().crossVectors(up,forward).normalize(),length,baseline};
 });
 return pose=>{
  for(const foot of feet){
   // Neutral display feet stay registered to the stance, rather than spinning with the hips.
   // The existing ankle height permits a bounded heel lift; no toe-motion track is inferred or exported.
   const rise=Math.max(0,pose[foot.side+'Ankle'][1]-foot.baseline-.025),pitch=Math.asin(Math.min(Math.sin(.95),rise/foot.length));
   const rotation=new Quaternion().setFromAxisAngle(foot.axis,pitch).multiply(foot.bind);
   foot.bone.quaternion.copy(foot.bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(rotation));foot.bone.updateMatrixWorld(true);
  }
 };
}

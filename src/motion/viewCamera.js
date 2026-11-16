import {Vector3,Quaternion,Matrix4} from 'three';
const up=new Vector3(0,1,0);
function look(position,direction,fov){
 const rotation=new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(position,position.clone().add(direction),up));
 return {position,rotation,fov};
}
export function cameraPose(view,{head,chest}){
 const distance=5.6/view.zoom;
 const orbit=look(new Vector3(Math.sin(view.yaw)*Math.cos(view.pitch)*distance,1.3-Math.sin(view.pitch)*distance,Math.cos(view.yaw)*Math.cos(view.pitch)*distance),new Vector3(-Math.sin(view.yaw)*Math.cos(view.pitch),Math.sin(view.pitch),-Math.cos(view.yaw)*Math.cos(view.pitch)),38);
 const mount=(anchor,clearance,fov)=>{
  const forward=anchor.forward.clone().normalize().applyAxisAngle(up,view.yaw);
  const lateral=new Vector3().crossVectors(forward,up).normalize();forward.applyAxisAngle(lateral,view.pitch);
  return look(anchor.position.clone().addScaledVector(anchor.forward,clearance),forward,Math.max(40,Math.min(110,fov/view.zoom)));
 };
 const h=Math.max(0,view.headFocus||0),c=Math.max(0,view.chestFocus||0),total=h+c;
 if(!total)return orbit;
 const first=mount(h?head:chest,h ? .19 : .14,h ? 90 : 76);
 if(h&&c){const second=mount(chest,.14,76),weight=c/total;first.position.lerp(second.position,weight);first.rotation.slerp(second.rotation,weight);first.fov+=(second.fov-first.fov)*weight;}
 const weight=Math.min(1,total);orbit.position.lerp(first.position,weight);orbit.rotation.slerp(first.rotation,weight);orbit.fov+=(first.fov-orbit.fov)*weight;
 return orbit;
}

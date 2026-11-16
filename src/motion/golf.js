import poster from './golf-poster.json' with {type:'json'};
// Display geometry uses a standard body-only 17-joint layout, not the Studio skeleton spec.
const names=['pelvis','rightHip','rightKnee','rightAnkle','leftHip','leftKnee','leftAnkle','spine','chest','neck','head','leftShoulder','leftElbow','leftHand','rightShoulder','rightElbow','rightHand'];
export const bones=[['pelvis','spine'],['spine','chest'],['chest','neck'],['neck','head'],['leftShoulder','rightShoulder'],['chest','leftShoulder'],['chest','rightShoulder'],['leftShoulder','leftElbow'],['leftElbow','leftHand'],['rightShoulder','rightElbow'],['rightElbow','rightHand'],['pelvis','leftHip'],['pelvis','rightHip'],['leftHip','leftKnee'],['leftKnee','leftAnkle'],['rightHip','rightKnee'],['rightKnee','rightAnkle']];
export const visibleJoints=['pelvis','neck','head','leftShoulder','rightShoulder','leftElbow','rightElbow','leftHand','rightHand','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle'];
export function poseAt(phase,frames=[poster]){
 const position=Math.min(1,Math.max(0,phase))*(frames.length-1),a=Math.floor(position),b=Math.min(frames.length-1,a+1),t=position-a;
 const points=frames[a].map((p,i)=>p.map((v,j)=>v+(frames[b][i][j]-v)*t));
 const p=Object.fromEntries(names.map((name,i)=>[name,points[i]]));

 return p;
}
export function project(point,camera,width,height){
 const a=[point[0],point[1]-1.05,point[2]-.12],c=Math.cos(camera.yaw),s=Math.sin(camera.yaw),r=[a[0]*c+a[2]*s,a[1],-a[0]*s+a[2]*c],cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
 const y=r[1]*cp-r[2]*sp,z=r[1]*sp+r[2]*cp,scale=Math.min(width*.34,height*.39)*camera.zoom*3.8/(3.8+z);
 return [width/2+r[0]*scale,height*.47-y*scale,z];
}
export const initialCamera={yaw:-.62,pitch:-.12,zoom:1};

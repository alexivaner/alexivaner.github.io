import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Object3D,Matrix4,Vector3,Quaternion,PerspectiveCamera} from 'three';
import {createFootRetargeter} from '../src/motion/footRig.js';
import {poseAt} from '../src/motion/golf.js';
import {headPoseAt} from '../src/motion/headRig.js';
import {cameraPose} from '../src/motion/viewCamera.js';
import {cameraViews,blendCamera} from '../src/motion/cameraViews.js';
const body=JSON.parse(await readFile('public/assets/media/golf-body-motion.json','utf8')).frames;
const bytes=await readFile('public/assets/models/portfolio-character.glb'),gltf=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)));
const nodes=gltf.nodes.map(n=>{const b=new Object3D();b.name=n.name||'';if(n.matrix)new Matrix4().fromArray(n.matrix).decompose(b.position,b.quaternion,b.scale);else{if(n.translation)b.position.fromArray(n.translation);if(n.rotation)b.quaternion.fromArray(n.rotation);if(n.scale)b.scale.fromArray(n.scale);}return b;});gltf.nodes.forEach((n,i)=>n.children?.forEach(j=>nodes[i].add(nodes[j])));const root=new Object3D();gltf.scenes[gltf.scene||0].nodes.forEach(i=>root.add(nodes[i]));root.updateMatrixWorld(true);
const get=name=>nodes.find(n=>n.name.replace(/^.*mixamorig:?/i,'').toLowerCase()===name.toLowerCase()),left=get('LeftFoot'),right=get('RightFoot'),hip=get('Hips');
const apply=createFootRetargeter({left,right,leftToe:get('LeftToe_End'),rightToe:get('RightToe_End'),first:poseAt(0,body),frames:body});
const originalHip=hip.quaternion.clone(),positions=[left.position.clone(),right.position.clone()];
const planted=poseAt(0,body);planted.leftAnkle[1]=-1;planted.rightAnkle[1]=-1;apply(planted);const leftPlanted=left.getWorldQuaternion(new Quaternion()),rightPlanted=right.getWorldQuaternion(new Quaternion());
// The compressed FBX rig has tiny decomposition error; tolerate less than 0.006 degrees.
for(let i=0;i<40;i++){hip.quaternion.copy(originalHip).multiply(new Quaternion().setFromAxisAngle(new Vector3(0,1,0),i*.17));root.updateMatrixWorld(true);apply(planted);assert(left.getWorldQuaternion(new Quaternion()).angleTo(leftPlanted)<1e-4,'A planted foot must not spin with the hips');assert(right.getWorldQuaternion(new Quaternion()).angleTo(rightPlanted)<1e-4);}
hip.quaternion.copy(originalHip);root.updateMatrixWorld(true);let prev;
for(let i=0;i<=720;i++){apply(poseAt(i/720,body));assert(left.position.distanceTo(positions[0])<1e-12&&right.position.distanceTo(positions[1])<1e-12,'Rig correction must not stretch the ankle');const q=right.getWorldQuaternion(new Quaternion());assert(Math.abs(q.length()-1)<1e-8);if(prev)assert(q.angleTo(prev)<.2,'Foot presentation must stay continuous');prev=q;}
for(const a of cameraViews)for(const b of cameraViews){const start=blendCamera(a.camera,b.camera,0),end=blendCamera(a.camera,b.camera,1);for(const field of ['pitch','zoom','headFocus','chestFocus']){assert(Math.abs(start[field]-a.camera[field])<1e-8);assert(Math.abs(end[field]-b.camera[field])<1e-8);}assert(Math.abs(Math.sin(end.yaw-b.camera.yaw))<1e-8);for(let i=0;i<=100;i++)assert(Object.values(blendCamera(a.camera,b.camera,i/100)).every(Number.isFinite));assert(Math.abs(end.yaw-start.yaw)<=Math.PI+1e-8,'Camera must take the short orbit');}
console.log('Presentation checks passed: stable planted feet, fixed ankle lengths, continuous heel presentation, and finite shortest-path camera transitions.');

const club=JSON.parse(await readFile('public/assets/media/golf-club-motion.json','utf8')).frames;
assert(body[0][13][1]<1&&body[0][16][1]<1&&club[0].head[1]<.1,'Full sequence must begin with hands low and club at setup');
assert(body.at(-1)[13][1]>1.4,'Sequence must retain the follow-through');
const anchors={head:{position:new Vector3(.1,1.7,.2),forward:new Vector3(0,-.7,-.7).normalize()},chest:{position:new Vector3(0,1.3,0),forward:new Vector3(0,-.3,-.9).normalize()}};
for(const name of ['head','chest']){
 const preset=cameraViews.find(v=>v.id===name).camera,result=cameraPose(preset,anchors),direction=new Vector3(0,0,-1).applyQuaternion(result.rotation);
 assert(result.position.distanceTo(anchors[name].position)<.25,'POV must be mounted on the avatar, not orbiting it');
 assert(direction.dot(anchors[name].forward)>.999,'POV must look outward along the body part');
 const offset=new Vector3(1,.3,-.2),moved=Object.fromEntries(Object.entries(anchors).map(([k,a])=>[k,{...a,position:a.position.clone().add(offset)}]));
 assert(cameraPose(preset,moved).position.sub(result.position).distanceTo(offset)<1e-8,'POV must follow moving avatar');
}
for(const a of cameraViews)for(const b of cameraViews)for(let i=0;i<=60;i++){const p=cameraPose(blendCamera(a.camera,b.camera,i/60),anchors);assert([...p.position.toArray(),...p.rotation.toArray(),p.fov].every(Number.isFinite));assert(Math.abs(p.rotation.length()-1)<1e-8);}
console.log('Full-motion/POV checks passed: setup to finish, avatar-mounted outward cameras, moving anchors and continuous camera poses.');

const headFrames=JSON.parse(await readFile('public/assets/media/golf-head-motion.json','utf8')).frames;
for(let i=0;i<body.length;i++){
 const p=poseAt(i/(body.length-1),body),grip=new Vector3(...club[i].grip),headForward=new Vector3(0,0,-1).applyQuaternion(headPoseAt(i/(body.length-1),headFrames).rotation);
 const chestUp=new Vector3(...p.chest).sub(new Vector3(...p.pelvis)).normalize(),chestRight=new Vector3(...p.rightShoulder).sub(new Vector3(...p.leftShoulder)).normalize();
 const anchors={grip,head:{position:new Vector3(...p.head),forward:headForward},chest:{position:new Vector3(...p.chest).lerp(new Vector3(...p.pelvis),.25),forward:new Vector3().crossVectors(chestUp,chestRight).normalize()}};
 for(const name of ['head','chest'])for(const aspect of [1.25,1.6]){
  const result=cameraPose(cameraViews.find(v=>v.id===name).camera,anchors),camera=new PerspectiveCamera(result.fov,aspect,.15,50);camera.position.copy(result.position);camera.quaternion.copy(result.rotation);camera.updateMatrixWorld(true);
  const screen=grip.clone().project(camera);assert(Math.abs(screen.x)<.75&&Math.abs(screen.y)<.75&&screen.z>-1&&screen.z<1,'Recorded grip must stay in the first-person framing through the swing');
 }
}
console.log('Grip framing passed across the full recorded swing in head/chest views at phone and desktop aspect ratios.');

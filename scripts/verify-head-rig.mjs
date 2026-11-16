import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Object3D,Vector3,Quaternion,Matrix4} from 'three';
import {createHeadRetargeter,headPoseAt} from '../src/motion/headRig.js';
const packet=JSON.parse(await readFile('public/assets/media/golf-head-motion.json','utf8'));
assert.deepEqual(Object.keys(packet).sort(),['format','frames']);assert.equal(packet.format,'head-directions-v1');
const body=JSON.parse(await readFile('public/assets/media/golf-body-motion.json','utf8'));assert.equal(packet.frames.length,body.frames.length);
for(const frame of packet.frames){assert.deepEqual(Object.keys(frame).sort(),['neck','right','up']);for(const key of ['neck','right','up'])assert(frame[key].length===3&&frame[key].every(Number.isFinite)&&Math.abs(new Vector3(...frame[key]).length()-1)<.001);assert(new Vector3(...frame.right).cross(new Vector3(...frame.up)).length()>.1);}
// Use the actual shipped rig's rest transforms, without needing textures/WebGL.
const buffer=await readFile('public/assets/models/portfolio-character.glb'),gltf=JSON.parse(buffer.subarray(20,20+buffer.readUInt32LE(12)).toString());
const nodes=gltf.nodes.map(node=>{const bone=new Object3D();bone.name=node.name||'';if(node.matrix)new Matrix4().fromArray(node.matrix).decompose(bone.position,bone.quaternion,bone.scale);else{if(node.translation)bone.position.fromArray(node.translation);if(node.rotation)bone.quaternion.fromArray(node.rotation);if(node.scale)bone.scale.fromArray(node.scale);}return bone;});
gltf.nodes.forEach((node,i)=>node.children?.forEach(child=>nodes[i].add(nodes[child])));const root=new Object3D();gltf.scenes[gltf.scene||0].nodes.forEach(i=>root.add(nodes[i]));root.updateMatrixWorld(true);
const get=name=>{const bone=nodes.find(n=>n.name.replace(/^.*mixamorig:?/i,'').replace(/[^a-z0-9]/gi,'').toLowerCase()===name.toLowerCase());assert(bone,`Rig bone ${name}`);return bone;};
const neck=get('Neck'),head=get('Head'),tip=get('HeadTopEnd'),rightShoulder=get('RightArm'),leftShoulder=get('LeftArm');
const apply=createHeadRetargeter({neck,head,tip,rightShoulder,leftShoulder}),parentBind=neck.parent.quaternion.clone();
const length=head.position.length(),tipLength=tip.position.length(),at=bone=>bone.getWorldPosition(new Vector3());
const headBind=head.getWorldQuaternion(new Quaternion()),localUp=at(tip).sub(at(head)).normalize().applyQuaternion(headBind.clone().invert());
let previous,maxStep=0,initial,last;
for(let i=0;i<=720;i++){
 const phase=i/720,pose=headPoseAt(phase,packet.frames);
 // A changing parent must not corrupt the independently captured world aim.
 neck.parent.quaternion.copy(parentBind).multiply(new Quaternion().setFromAxisAngle(new Vector3(0,1,0),phase*1.4));root.updateMatrixWorld(true);apply(pose);
 const neckAim=at(head).sub(at(neck)).normalize(),headUp=localUp.clone().applyQuaternion(head.getWorldQuaternion(new Quaternion()));
 assert(neckAim.dot(pose.neck)>1-1e-8,'Neck must follow its own captured segment');
 assert(headUp.dot(new Vector3(...packet.frames[Math.round(phase*(packet.frames.length-1))].up))>.999,'Head must follow captured head orientation');
 assert(Math.abs(head.position.length()-length)<1e-12);assert(Math.abs(tip.position.length()-tipLength)<1e-12);
 const rotation=head.getWorldQuaternion(new Quaternion());assert(Math.abs(rotation.length()-1)<1e-8);if(previous)maxStep=Math.max(maxStep,rotation.angleTo(previous));previous=rotation;if(!initial)initial=rotation.clone();last=rotation;
}
assert(maxStep<.15,'Head rotation must remain continuous across the swing');assert(initial.angleTo(last)>.1,'Head must actually turn');
console.log('Head retargeting passed: actual rig, separate neck/head aims, torso rotation, fixed bone lengths, full-swing continuity.');

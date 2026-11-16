import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Object3D,Matrix4,Vector3,Quaternion} from 'three';
import {createFootRetargeter} from '../src/motion/footRig.js';
import {poseAt} from '../src/motion/golf.js';
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

import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Scene,Object3D,Vector3,PerspectiveCamera} from 'three';
import {clubPoseAt} from '../src/motion/clubPose.js';
import {initialCamera} from '../src/motion/golf.js';
import {createGolfEquipment} from '../src/motion/golfEquipment.js';
const data=JSON.parse(await readFile('public/assets/media/golf-club-motion.json','utf8')),body=JSON.parse(await readFile('public/assets/media/golf-body-motion.json','utf8'));
assert.deepEqual(Object.keys(data).sort(),['format','frames']);assert.equal(data.format,'club-pose-v1');assert.equal(data.frames.length,body.frames.length);
const scene=new Scene(),wrists={LeftHand:new Object3D(),RightHand:new Object3D()},equipment=createGolfEquipment(scene,name=>wrists[name]);let minLength=Infinity,maxLength=0;
for(let i=0;i<=720;i++){
 const phase=i/720,pose=clubPoseAt(phase,data.frames);for(const p of Object.values(pose))assert(p.toArray().every(Number.isFinite));
 const length=pose.grip.distanceTo(pose.heel);minLength=Math.min(minLength,length);maxLength=Math.max(maxLength,length);assert(length>.2&&length<2,'Invalid recorded club shaft');
 equipment.update(pose,{glove:'#ffffff',metal:'#aaaaaa',grip:'#333333'});scene.updateMatrixWorld(true);
 const shaft=scene.getObjectByName('club-shaft'),head=scene.getObjectByName('club-head');
 assert(new Vector3(0,-.5,0).applyMatrix4(shaft.matrixWorld).distanceTo(pose.grip)<1e-7,'Shaft grip must follow the recording exactly');
 assert(new Vector3(0,.5,0).applyMatrix4(shaft.matrixWorld).distanceTo(pose.heel)<1e-7,'Shaft end must follow the recording exactly');
 assert(head.getWorldPosition(new Vector3()).distanceTo(pose.head)<1e-7,'Club head must follow the recording exactly');
 assert(Math.abs(head.quaternion.length()-1)<1e-7,'Club-head orientation must be valid');
}
for(let i=0;i<data.frames.length;i++)for(const key of ['grip','heel','head'])assert(clubPoseAt(i/(data.frames.length-1),data.frames)[key].distanceTo(new Vector3(...data.frames[i][key]))<1e-9);
const camera=new PerspectiveCamera(38,1.25,.01,50),distance=5.6;
camera.position.set(Math.sin(initialCamera.yaw)*Math.cos(initialCamera.pitch)*distance,1.3-Math.sin(initialCamera.pitch)*distance,Math.cos(initialCamera.yaw)*Math.cos(initialCamera.pitch)*distance);camera.lookAt(0,1.3,0);camera.updateMatrixWorld(true);
for(const frame of data.frames)for(const point of Object.values(frame))for(const x of [-.075,.075])for(const y of [-.075,.075])for(const z of [-.075,.075]){const screen=new Vector3(...point).add(new Vector3(x,y,z)).project(camera);assert(Math.abs(screen.x)<.99&&Math.abs(screen.y)<.99,'Full recorded club and its geometry must fit the phone view');}
equipment.dispose();assert.equal(scene.children.length,0);
console.log('Recorded club passed: synchronized frames, exact grip/shaft/head positions, interpolation, valid geometry, and cleanup.');

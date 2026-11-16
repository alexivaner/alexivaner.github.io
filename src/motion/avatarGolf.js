import * as THREE from 'three';
import {cameraPose} from './viewCamera.js';
import {createFootRetargeter} from './footRig.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {clubPoseAt,loadClubFrames} from './clubPose.js';
import {removeFingeredHands,createGolfEquipment} from './golfEquipment.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {poseAt} from './golf.js';
import {loadMotionFrames} from './drawGolf.js';
import {createHeadRetargeter,headPoseAt,loadHeadFrames} from './headRig.js';
const vector=p=>new THREE.Vector3(...p);
function basis(right,up){
 const y=up.clone().normalize(),x=right.clone().addScaledVector(y,-right.dot(y)).normalize(),z=new THREE.Vector3().crossVectors(x,y).normalize();
 return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z));
}
export async function createAvatarSurface(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
 let model;
 try{
  const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const [gltf,frames,headFrames,clubFrames]=await Promise.all([loader.loadAsync('/assets/models/portfolio-character.glb'),loadMotionFrames(),loadHeadFrames(),loadClubFrames()]);
  if(frames.length!==headFrames.length||frames.length!==clubFrames.length)throw new Error('Motion tracks must be synchronized');
  model=gltf.scene;const scene=new THREE.Scene();scene.add(model);model.updateMatrixWorld(true);
  const bones=new Map();model.traverse(node=>{if(node.isBone||/mixamorig/i.test(node.name))bones.set(node.name.replace(/^.*mixamorig:?/i,'').replace(/[^a-z0-9]/gi,'').toLowerCase(),node);if(node.isMesh){node.castShadow=true;node.frustumCulled=false;for(const material of Array.isArray(node.material)?node.material:[node.material]){material.roughness=.85;material.metalness=0;}}});
  const get=name=>{const bone=bones.get(name.replace(/[^a-z0-9]/gi,'').toLowerCase());if(!bone)throw new Error('Avatar rig is incomplete');return bone;};
  const at=name=>get(name).getWorldPosition(new THREE.Vector3());
  const first=poseAt(0,frames),leg=(distance)=> (distance('LeftUpLeg','LeftLeg')+distance('LeftLeg','LeftFoot')+distance('RightUpLeg','RightLeg')+distance('RightLeg','RightFoot'))/2;
  const restLeg=leg((a,b)=>at(a).distanceTo(at(b))),sourceLeg=(vector(first.leftHip).distanceTo(vector(first.leftKnee))+vector(first.leftKnee).distanceTo(vector(first.leftAnkle))+vector(first.rightHip).distanceTo(vector(first.rightKnee))+vector(first.rightKnee).distanceTo(vector(first.rightAnkle)))/2;
  model.scale.multiplyScalar(sourceLeg/restLeg);model.updateMatrixWorld(true);
  removeFingeredHands(model);
  const equipment=createGolfEquipment(scene,get);
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.35;room.dispose();pmrem.dispose();
  const rest=new Map();for(const [name,bone]of bones)rest.set(name,{local:bone.quaternion.clone(),world:bone.getWorldQuaternion(new THREE.Quaternion()),position:bone.getWorldPosition(new THREE.Vector3())});
  const original=name=>rest.get(name.replace(/[^a-z0-9]/gi,'').toLowerCase());
  const restHip=basis(at('RightUpLeg').sub(at('LeftUpLeg')),at('Spine2').sub(at('Hips'))),restChest=basis(at('RightArm').sub(at('LeftArm')),at('Neck').sub(at('Spine')));
  const bounds=new THREE.Box3().setFromObject(model),clearance=(at('LeftFoot').y+at('RightFoot').y)/2-bounds.min.y;
  const retargetHead=createHeadRetargeter({neck:get('Neck'),head:get('Head'),tip:get('HeadTop_End'),rightShoulder:get('RightArm'),leftShoulder:get('LeftArm')});
  const retargetFeet=createFootRetargeter({left:get('LeftFoot'),right:get('RightFoot'),leftToe:get('LeftToe_End'),rightToe:get('RightToe_End'),first,frames});
  const camera=new THREE.PerspectiveCamera(38,1,.01,50);
  const hemi=new THREE.HemisphereLight(),sun=new THREE.DirectionalLight();hemi.intensity=1.1;sun.intensity=2.2;sun.position.set(-3,5,4);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-2;sun.shadow.camera.right=2;sun.shadow.camera.top=3;sun.shadow.camera.bottom=-1;sun.shadow.normalBias=.0025;sun.shadow.bias=-.00005;sun.shadow.radius=4;const rim=new THREE.DirectionalLight();rim.intensity=1.4;rim.position.set(3,3,-3);const fill=new THREE.DirectionalLight();fill.intensity=.6;fill.position.set(3,2,4);scene.add(hemi,sun,rim,fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({roughness:.9,metalness:.05}));floor.rotation.x=-Math.PI/2;floor.position.y=-.24;floor.receiveShadow=true;scene.add(floor);
  const stage=new THREE.Mesh(new THREE.CylinderGeometry(.85,.9,.22,96),new THREE.MeshStandardMaterial({roughness:.84,metalness:.08}));stage.position.y=-.12;stage.receiveShadow=true;scene.add(stage);const ring=new THREE.Mesh(new THREE.TorusGeometry(.76,.0025,6,96),new THREE.MeshStandardMaterial({roughness:.7}));ring.rotation.x=-Math.PI/2;ring.position.y=-.004;scene.add(ring);
  function world(name,q){const bone=get(name),parent=bone.parent.getWorldQuaternion(new THREE.Quaternion());bone.quaternion.copy(parent.invert().multiply(q));bone.updateMatrixWorld(true);}
  function pointDirection(name,child,direction){const r=original(child).position.clone().sub(original(name).position).normalize();const q=new THREE.Quaternion().setFromUnitVectors(r,direction.clone().normalize()).multiply(original(name).world);world(name,q);}
  let lastWidth=0,lastHeight=0,lastPalette;
  function draw(width,height,phase,view,colors){
   if(width!==lastWidth||height!==lastHeight){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();lastWidth=width;lastHeight=height;}
   if(colors!==lastPalette){renderer.setClearColor(colors.paper,1);scene.background=new THREE.Color(colors.paper);scene.fog=new THREE.Fog(colors.paper,5,22);hemi.color.set(colors.key);hemi.groundColor.set(colors.floor);sun.color.set(colors.key);rim.color.set(colors.rim);fill.color.set(colors.fill);floor.material.color.set(colors.floor);stage.material.color.set(colors.platform);ring.material.color.set(colors.rule);lastPalette=colors;}
   for(const[name,bone]of bones)bone.quaternion.copy(rest.get(name).local);model.position.set(0,0,0);model.updateMatrixWorld(true);
   const p=poseAt(phase,frames),hipDelta=basis(vector(p.rightHip).sub(vector(p.leftHip)),vector(p.spine).sub(vector(p.pelvis))).multiply(restHip.clone().invert()),chestDelta=basis(vector(p.rightShoulder).sub(vector(p.leftShoulder)),vector(p.neck).sub(vector(p.spine))).multiply(restChest.clone().invert());
   world('Hips',hipDelta.clone().multiply(original('Hips').world));
   for(const[name,weight]of [['Spine',.3],['Spine1',.65],['Spine2',1]])world(name,hipDelta.clone().slerp(chestDelta,weight).multiply(original(name).world));
   const headPose=headPoseAt(phase,headFrames);retargetHead(headPose);
   for(const[side,prefix]of[['Left','left'],['Right','right']]){
    pointDirection(side+'Arm',side+'ForeArm',vector(p[prefix+'Elbow']).sub(vector(p[prefix+'Shoulder'])));
    pointDirection(side+'ForeArm',side+'Hand',vector(p[prefix+'Hand']).sub(vector(p[prefix+'Elbow'])));
    pointDirection(side+'UpLeg',side+'Leg',vector(p[prefix+'Knee']).sub(vector(p[prefix+'Hip'])));
    pointDirection(side+'Leg',side+'Foot',vector(p[prefix+'Ankle']).sub(vector(p[prefix+'Knee'])));
   }
   retargetFeet(p);
   const desired=vector(p.pelvis);desired.y+=clearance;model.position.copy(desired.sub(at('Hips')));model.updateMatrixWorld(true);
   const clubPose=clubPoseAt(phase,clubFrames),firstPerson=(view.headFocus||0)+(view.chestFocus||0)>.9;
   model.visible=!firstPerson;
   equipment.update(clubPose,colors,firstPerson);
   const chestPosition=at('LeftArm').add(at('RightArm')).multiplyScalar(.5).lerp(at('Hips'),.25);
   const chestUp=at('Spine2').sub(at('Hips')).normalize(),chestRight=at('RightArm').sub(at('LeftArm')).normalize();
   const pose=cameraPose(view,{grip:clubPose.grip,head:{position:at('Head').add(at('HeadTop_End')).multiplyScalar(.5),forward:new THREE.Vector3(0,0,-1).applyQuaternion(headPose.rotation)},chest:{position:chestPosition,forward:new THREE.Vector3().crossVectors(chestUp,chestRight).normalize()}});
   camera.position.copy(pose.position);camera.quaternion.copy(pose.rotation);camera.fov=pose.fov;camera.near=.01+.14*Math.min(1,(view.headFocus||0)+(view.chestFocus||0));camera.updateProjectionMatrix();renderer.render(scene,camera);
  }
  return {kind:'avatar',draw,dispose(){model.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.skeleton?.dispose();for(const material of Array.isArray(node.material)?node.material:[node.material]){for(const value of Object.values(material))if(value?.isTexture)value.dispose();material.dispose();}}});equipment.dispose();environment.dispose();floor.geometry.dispose();floor.material.dispose();stage.geometry.dispose();stage.material.dispose();ring.geometry.dispose();ring.material.dispose();renderer.dispose();renderer.forceContextLoss();}};
 }catch(error){renderer.dispose();renderer.forceContextLoss();throw error;}
}

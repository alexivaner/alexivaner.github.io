import * as THREE from 'three';
const yAxis=new THREE.Vector3(0,1,0);
export function removeFingeredHands(model){
 model.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  const g=mesh.geometry,index=g.index,joints=g.getAttribute('skinIndex'),weights=g.getAttribute('skinWeight');if(!index||!joints||!weights)return;
  const handBones=new Set(mesh.skeleton.bones.flatMap((bone,i)=>/hand/i.test(bone.name)?[i]:[]));
  const masked=vertex=>{let total=0;for(let k=0;k<4;k++)if(handBones.has(joints.getComponent(vertex,k)))total+=weights.getComponent(vertex,k);return total>=.5;};
  const indices=[];for(let i=0;i<index.count;i+=3){const triangle=[index.getX(i),index.getX(i+1),index.getX(i+2)];if(triangle.filter(masked).length<2)indices.push(...triangle);}
  g.setIndex(indices);g.clearGroups();g.addGroup(0,indices.length,0);
 });
}
export function createGolfEquipment(scene,get){
 const root=new THREE.Group();scene.add(root);
 const glove=new THREE.MeshStandardMaterial({roughness:.83}),metal=new THREE.MeshStandardMaterial({roughness:.27,metalness:.82}),grip=new THREE.MeshStandardMaterial({roughness:.94}),headMaterial=new THREE.MeshStandardMaterial({roughness:.3,metalness:.55});
 const sphere=new THREE.SphereGeometry(1,20,14),sleeve=new THREE.CylinderGeometry(.027,.034,1,16),handParts=[];
 for(const side of ['Left','Right']){const group=new THREE.Group(),palm=new THREE.Mesh(sphere,glove),thumb=new THREE.Mesh(sphere,glove);palm.scale.set(.036,.057,.027);palm.position.y=.044;thumb.scale.set(.019,.035,.025);thumb.position.set(side==='Left'?-.026:.026,.027,.015);thumb.rotation.z=side==='Left'?-.38:.38;group.add(palm,thumb);group.traverse(n=>{if(n.isMesh)n.castShadow=true;});group.name=side+'-neutral-hand';root.add(group);const upper=new THREE.Mesh(sleeve,glove),forearm=new THREE.Mesh(sleeve,glove);upper.name=side+'-pov-upper';forearm.name=side+'-pov-forearm';root.add(upper,forearm);upper.visible=forearm.visible=false;handParts.push({side,group,upper,forearm});}
 const club=new THREE.Group();club.name='recorded-club';root.add(club);
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.004,.007,1,16),metal);
 const handle=new THREE.Mesh(new THREE.CylinderGeometry(.012,.009,1,16),grip);
 const hosel=new THREE.Mesh(new THREE.CylinderGeometry(.011,.013,1,12),metal);
 const clubHead=new THREE.Mesh(sphere,headMaterial);clubHead.scale.set(.073,.039,.054);shaft.name='club-shaft';handle.name='club-grip';clubHead.name='club-head';club.add(shaft,handle,hosel,clubHead);club.traverse(n=>{if(n.isMesh)n.castShadow=true;});
 function segment(mesh,a,b){const delta=b.clone().sub(a);mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(yAxis,delta.clone().normalize());mesh.scale.y=delta.length();}
 const wrist=side=>get(side+'Hand').getWorldPosition(new THREE.Vector3());
 return {update(pose,colors,firstPerson=false){
  const direction=pose.heel.clone().sub(pose.grip).normalize();
  glove.color.set(colors.glove);metal.color.set(colors.metal);grip.color.set(colors.grip);headMaterial.color.set(colors.grip);
  // Every club landmark follows the recording in the same world frame as the body.
  segment(shaft,pose.grip,pose.heel);
  segment(handle,pose.grip,pose.grip.clone().addScaledVector(direction,.23));
  segment(hosel,pose.heel.clone().addScaledVector(direction,-.045),pose.heel);
  clubHead.position.copy(pose.head);
  const side=pose.head.clone().sub(pose.heel);side.addScaledVector(direction,-side.dot(direction)).normalize();
  const normal=new THREE.Vector3().crossVectors(side,direction).normalize();
  clubHead.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side,direction,normal));
  for(const {side,group,upper,forearm}of handParts){
   const start=firstPerson?pose.grip.clone().addScaledVector(direction,side==='Left'?0:.07):wrist(side),target=pose.grip.clone().addScaledVector(direction,side==='Left'?.045:.115),aim=target.sub(start);
   if(aim.lengthSq()<.0001)aim.copy(direction);group.position.copy(start);group.quaternion.setFromUnitVectors(yAxis,aim.normalize());
   upper.visible=forearm.visible=firstPerson;
   if(firstPerson){const shoulder=get(side+'Arm').getWorldPosition(new THREE.Vector3()),elbow=get(side+'ForeArm').getWorldPosition(new THREE.Vector3());segment(upper,shoulder,elbow);segment(forearm,elbow,start);}
  }
 },dispose(){scene.remove(root);sphere.dispose();sleeve.dispose();shaft.geometry.dispose();handle.geometry.dispose();hosel.geometry.dispose();glove.dispose();metal.dispose();grip.dispose();headMaterial.dispose();}};
}

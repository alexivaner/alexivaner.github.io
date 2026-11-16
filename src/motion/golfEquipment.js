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
 const sphere=new THREE.SphereGeometry(1,20,14),handParts=[];
 for(const side of ['Left','Right']){const group=new THREE.Group(),palm=new THREE.Mesh(sphere,glove),thumb=new THREE.Mesh(sphere,glove);palm.scale.set(.036,.057,.027);palm.position.y=.044;thumb.scale.set(.019,.035,.025);thumb.position.set(side==='Left'?-.026:.026,.027,.015);thumb.rotation.z=side==='Left'?-.38:.38;group.add(palm,thumb);group.traverse(n=>{if(n.isMesh)n.castShadow=true;});root.add(group);handParts.push({side,group});}
 const club=new THREE.Group();root.add(club);
 const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.004,.007,1.03,16),metal);shaft.position.y=.61;
 const handle=new THREE.Mesh(new THREE.CylinderGeometry(.012,.009,.23,16),grip);handle.position.y=.045;
 const hosel=new THREE.Mesh(new THREE.CylinderGeometry(.011,.013,.07,12),metal);hosel.position.y=1.12;
 const clubHead=new THREE.Mesh(sphere,headMaterial);clubHead.scale.set(.073,.039,.054);clubHead.position.set(.044,1.155,.012);clubHead.rotation.z=-.2;club.add(shaft,handle,hosel,clubHead);club.traverse(n=>{if(n.isMesh)n.castShadow=true;});
 const wrist=side=>get(side+'Hand').getWorldPosition(new THREE.Vector3());
 return {update(body,colors){
  // An illustrative shaft follows the existing body wrist line. A fixed grip offset is purely illustrative, not reconstructed club motion.
  const direction=new THREE.Vector3(...body.rightHand).sub(new THREE.Vector3(...body.leftHand)).normalize().applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/3);
  glove.color.set(colors.glove);metal.color.set(colors.metal);grip.color.set(colors.grip);headMaterial.color.set(colors.grip);
  const left=wrist('Left'),right=wrist('Right'),center=left.clone().add(right).multiplyScalar(.5);
  // Fit the illustrative grip to the character, without any additional motion track.
  const away=center.clone().sub(get('Spine2').getWorldPosition(new THREE.Vector3())).normalize().multiplyScalar(.035);center.add(away);
  club.position.copy(center);club.quaternion.setFromUnitVectors(yAxis,direction);
  for(const {side,group}of handParts){const start=side==='Left'?left:right,target=center.clone().addScaledVector(direction,side==='Left'?-.035:.035),aim=target.sub(start);if(aim.lengthSq()<.0001)aim.copy(direction);group.position.copy(start);group.quaternion.setFromUnitVectors(yAxis,aim.normalize());}
 },dispose(){scene.remove(root);sphere.dispose();shaft.geometry.dispose();handle.geometry.dispose();hosel.geometry.dispose();glove.dispose();metal.dispose();grip.dispose();headMaterial.dispose();}};
}

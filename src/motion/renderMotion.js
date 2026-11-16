function supportsAvatar(){
 if(navigator.connection?.saveData||matchMedia('(prefers-reduced-data: reduce)').matches)return false;
 try{const probe=document.createElement('canvas').getContext('webgl2');if(!probe)return false;probe.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}
}
export async function createMotionSurface(avatarCanvas,skeletonCanvas){
 if(supportsAvatar())try{const {createAvatarSurface}=await import('./avatarGolf.js');return await createAvatarSurface(avatarCanvas);}catch{/* The immediately visible rendered avatar remains available. */}
 return null;
}

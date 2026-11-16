import {loadGolfDrawer} from './drawGolf.js';
function supportsAvatar(){
 if(navigator.connection?.saveData||matchMedia('(prefers-reduced-data: reduce)').matches)return false;
 try{const probe=document.createElement('canvas').getContext('webgl2');if(!probe)return false;probe.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}
}
export async function createMotionSurface(avatarCanvas,skeletonCanvas){
 if(supportsAvatar())try{const {createAvatarSurface}=await import('./avatarGolf.js');return await createAvatarSurface(avatarCanvas);}catch{/* The approved body-only reconstruction remains available. */}
 const context=skeletonCanvas.getContext('2d');if(!context)return null;
 const draw=await loadGolfDrawer();
 return {kind:'skeleton',draw(width,height,phase,camera,colors){const ratio=Math.min(devicePixelRatio||1,1.75),w=Math.round(width*ratio),h=Math.round(height*ratio);if(skeletonCanvas.width!==w||skeletonCanvas.height!==h){skeletonCanvas.width=w;skeletonCanvas.height=h;context.setTransform(ratio,0,0,ratio,0,0);}draw(context,width,height,phase,camera,colors);},dispose(){context.clearRect(0,0,skeletonCanvas.width,skeletonCanvas.height);}};
}

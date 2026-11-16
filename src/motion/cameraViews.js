import {initialCamera} from './golf.js';
export const cameraViews=[
 {id:'free',label:'Free view',camera:{...initialCamera,headFocus:0,chestFocus:0}},
 {id:'face-on',label:'Face-on',camera:{yaw:Math.PI,pitch:-.06,zoom:1,headFocus:0,chestFocus:0}},
 {id:'down-line',label:'Down-the-line',camera:{yaw:Math.PI/2,pitch:-.06,zoom:1,headFocus:0,chestFocus:0}},
 {id:'front',label:'Front view',camera:{yaw:Math.PI,pitch:0,zoom:1.3,headFocus:0,chestFocus:0}},
 {id:'head',label:'Head view',camera:{yaw:0,pitch:0,zoom:1,headFocus:1,chestFocus:0}},
 {id:'chest',label:'Chest view',camera:{yaw:0,pitch:0,zoom:1,headFocus:0,chestFocus:1}}
];
export function blendCamera(start,end,t){const ease=1-(1-t)**3,turn=((end.yaw-start.yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;return Object.fromEntries(['yaw','pitch','zoom','headFocus','chestFocus'].map(key=>[key,key==='yaw'?start.yaw+turn*ease:(start[key]||0)+((end[key]||0)-(start[key]||0))*ease]));}

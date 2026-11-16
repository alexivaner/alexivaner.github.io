import React from 'react';
import {Localized,useI18n} from '../i18n/I18n.jsx';
import {poseAt,bones,project} from '../motion/golf.js';
import Icon from './Icon.jsx';
function PoseView({yaw}){const p=poseAt(.4);return <svg viewBox={yaw===0?'58 22 60 145':'35 22 60 145'} aria-hidden="true"><g className="evidence-pose">{bones.map(([a,b])=>{const A=project(p[a],{yaw,pitch:0,zoom:1},180,180),B=project(p[b],{yaw,pitch:0,zoom:1},180,180);return <line key={a+b} x1={A[0]} y1={A[1]+9} x2={B[0]} y2={B[1]+9}/>;})}</g></svg>;}
const workflows={
 'xview-check':[['desktop','Your device'],['check','Compatibility'],['arrow-right','Ready to begin']],
 'xview-platform':[['user-circle','Account'],['key','Software access'],['cube','AI application']]
};
export default function EngineeringEvidence({id}){
 const {t}=useI18n();
 return <Localized><figure className={`engineering-evidence evidence-${id}`}>{id==='xview'?<><div className="reconstruction-evidence"><div className="evidence-views"><PoseView yaw={0}/><PoseView yaw={1.57}/><span>Multiple views</span></div><Icon name="arrow-right" size={24}/><div className="evidence-avatar"><img className="evidence-light" src="/assets/images/motion/avatar-light.webp" width="1200" height="750" alt={t('The same reconstructed motion, presented on the portfolio avatar.')} loading="lazy"/><img className="evidence-dark" src="/assets/images/motion/avatar-dark.webp" width="1200" height="750" alt={t('The same reconstructed motion, presented on the portfolio avatar.')} loading="lazy"/><span>3D motion review</span></div></div><figcaption>One movement. Multiple perspectives.</figcaption></>:<><ol className="engineering-flow">{workflows[id].map(([icon,label])=><li key={label}><Icon name={icon} size={48}/><span>{label}</span></li>)}</ol><figcaption>{id==='xview-check'?'Helping people prepare their system before they begin.':'Connecting the AI application to the software around it.'}</figcaption></>}</figure></Localized>;
}

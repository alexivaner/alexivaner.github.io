import React from 'react';
import {Localized,useI18n} from '../i18n/I18n.jsx';
import {cameraViews} from '../motion/cameraViews.js';
export default function CameraViews({ready,active,onSelect}){
 const {t}=useI18n();
 function keys(event){const items=[...event.currentTarget.querySelectorAll('button')],i=items.indexOf(event.target);if(i<0||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?items.length-1:(i+(event.key==='ArrowRight'?1:-1)+items.length)%items.length;onSelect(cameraViews[n]);items[n].focus();}
 return <Localized><div className="motion-views" role="group" aria-label={t('Camera view')} onKeyDown={keys}>{cameraViews.map(view=><button key={view.id} type="button" disabled={!ready} aria-pressed={view.id===active} onClick={()=>onSelect(view)}>{view.label}</button>)}</div></Localized>;
}

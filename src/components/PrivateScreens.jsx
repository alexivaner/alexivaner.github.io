import React,{useEffect,useRef,useState} from 'react';
import Icon from './Icon.jsx';
import {Localized,useI18n} from '../i18n/I18n.jsx';
function FullScreen({image,onClose}){
 const dialog=useRef(null);
 useEffect(()=>{dialog.current.showModal();return()=>dialog.current?.close();},[]);
 function close(){dialog.current.close();onClose();}
 return <Localized><dialog className="private-screen-dialog" ref={dialog} aria-label={image.alt} onCancel={e=>{e.preventDefault();e.stopPropagation();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}><button className="icon-button" type="button" aria-label="Close product screen" autoFocus onClick={close}><Icon name="x"/></button><div className="private-screen-scroll"><img src={image.src} alt={image.alt}/></div><p>{image.caption}</p></dialog></Localized>;
}
export default function PrivateScreens({images}){
 const {t}=useI18n(),[selected,setSelected]=useState(null),trigger=useRef(null);
 return <Localized><div className="private-screens">{images.map((image,index)=><figure key={index}><button type="button" className="private-screen-preview" aria-label={`${t('View full-size screen')}: ${image.alt}`} aria-haspopup="dialog" onClick={e=>{trigger.current=e.currentTarget;setSelected(index);}}><img src={image.src} alt={image.alt} loading="lazy"/><span><Icon name="magnifying-glass-plus" size={20}/>View full-size screen</span></button><figcaption>{image.caption} <a className="text-link" href={image.href} target="_blank" rel="noopener noreferrer">Product reference</a></figcaption></figure>)}</div>{selected!==null&&<FullScreen image={images[selected]} onClose={()=>{setSelected(null);trigger.current?.focus({preventScroll:true});}}/>}</Localized>;
}

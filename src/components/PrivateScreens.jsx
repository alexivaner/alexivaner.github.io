import React,{useEffect,useRef,useState} from 'react';
import Icon from './Icon.jsx';
function FullScreen({image,onClose}){
 const dialog=useRef(null);
 useEffect(()=>{dialog.current.showModal();return()=>dialog.current?.close();},[]);
 function close(){dialog.current.close();onClose();}
 return <dialog className="private-screen-dialog" ref={dialog} aria-label={image.alt} onCancel={e=>{e.preventDefault();e.stopPropagation();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}><button className="icon-button" type="button" aria-label="Close product screen" autoFocus onClick={close}><Icon name="x"/></button><div className="private-screen-scroll"><img src={image.src} alt={image.alt}/></div><p>{image.caption}</p></dialog>;
}
export default function PrivateScreens({images}){
 const [selected,setSelected]=useState(null),trigger=useRef(null);
 return <><div className="private-screens">{images.map(image=><figure key={image.alt}><button type="button" className="private-screen-preview" aria-label={`View full-size screen: ${image.alt}`} aria-haspopup="dialog" onClick={e=>{trigger.current=e.currentTarget;setSelected(image);}}><img src={image.src} alt={image.alt} loading="lazy"/><span><Icon name="magnifying-glass-plus" size={20}/>View full-size screen</span></button><figcaption>{image.caption} <a className="text-link" href={image.href} target="_blank" rel="noopener noreferrer">Product reference</a></figcaption></figure>)}</div>{selected&&<FullScreen image={selected} onClose={()=>{setSelected(null);trigger.current?.focus({preventScroll:true});}}/>}</>;
}

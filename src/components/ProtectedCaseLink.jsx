import Icon from './Icon.jsx';
import React,{useState} from 'react';
import {Localized} from '../i18n/I18n.jsx';
export default function ProtectedCaseLink({onOpen,variant='text',label='Unlock case study',descriptionId}){
 const [busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
 async function activate(event){if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();if(busy)return;const trigger=event.currentTarget;setBusy(true);setFailed(false);try{await onOpen(trigger);}catch{setFailed(true);}finally{setBusy(false);}}
 return <Localized><div className="protected-case-entry"><a className={`${variant==='primary'?'button':'text-link'} protected-case-link`} href="mailto:hutomoivan@gmail.com?subject=Portfolio%20case%20study%20access" onClick={activate} aria-haspopup="dialog" aria-describedby={descriptionId} aria-busy={busy||undefined}><Icon name="lock-simple" size={20} className="glyph"/>{busy?'Opening case study…':label}{variant==='primary'&&<Icon name="arrow-right" size={20}/>}</a>{failed&&<p role="status">Could not open the case study. Try again or request access.</p>}</div></Localized>;
}

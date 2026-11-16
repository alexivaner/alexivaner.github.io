import React,{useState} from 'react';
import {Localized} from '../i18n/I18n.jsx';
export default function ProtectedCaseLink({onOpen}){
 const [busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
 async function activate(event){if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();if(busy)return;const trigger=event.currentTarget;setBusy(true);setFailed(false);try{await onOpen(trigger);}catch{setFailed(true);}finally{setBusy(false);}}
 return <Localized><div className="protected-case-entry"><a className="text-link protected-case-link" href="mailto:hutomoivan@gmail.com?subject=XView%20engineering%20walkthrough" onClick={activate} aria-haspopup="dialog" aria-busy={busy||undefined}><img className="glyph" src="/assets/icons/lock-simple.svg" width="20" height="20" alt=""/>{busy?'Opening walkthrough…':'View engineering walkthrough'}</a>{failed&&<p role="status">Could not open the walkthrough. Try again or request access.</p>}</div></Localized>;
}

import Icon from './Icon.jsx';
import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Localized,LanguageSelector,useI18n} from '../i18n/I18n.jsx';
import {decryptWalkthrough} from '../protected/crypto.js';
import {localizeWalkthrough} from '../protected/localize.js';
import '../../styles/viewer.css';
import PrivateScreens from './PrivateScreens.jsx';

function ArchitectureMap({diagram}){
 const [active,setActive]=useState(0),node=diagram.nodes[active];
 return <section className="architecture-study"><div className="architecture-core" aria-hidden="true"><svg viewBox="0 0 240 180"><polygon points="120,12 193,54 193,126 120,168 47,126 47,54"/><polygon className="architecture-inner" points="120,38 171,67 171,113 120,142 69,113 69,67"/></svg><span>{diagram.center}</span></div><div className="architecture-choices" aria-label={diagram.title}>{diagram.nodes.map((item,i)=><button type="button" key={item.id} aria-pressed={active===i} onClick={()=>setActive(i)}>{item.title}</button>)}</div><section className="architecture-explanation" aria-live="polite"><h4>{node.title}</h4><p>{node.text}</p><p><code>{node.evidence}</code></p></section></section>;
}
function Chapter({chapter,owner,language}){
 return <article className="private-document" lang={language}><h3 tabIndex={-1}>{chapter.title}</h3><p className="private-summary">{chapter.summary}</p>{chapter.images&&<PrivateScreens images={chapter.images}/>}{chapter.diagram&&<ArchitectureMap diagram={chapter.diagram}/>}<div className="viewer-story">{chapter.sections.map(section=><section key={section.title}><h4>{section.title}</h4><p>{section.text}</p></section>)}</div><p className="private-owner">{owner}</p></article>;
}
export default function PrivateCaseViewer({onClose}){
 const {t,locale}=useI18n(),dialog=useRef(null),input=useRef(null),alive=useRef(true),body=useRef(null);
 const [content,setContent]=useState(null),[index,setIndex]=useState(0),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const document=useMemo(()=>content?localizeWalkthrough(content,locale):null,[content,locale]);
 useEffect(()=>{alive.current=true;dialog.current.showModal();input.current?.focus();const overflow=window.document.documentElement.style.overflowY;window.document.documentElement.style.overflowY='hidden';return()=>{alive.current=false;window.document.documentElement.style.overflowY=overflow;};},[]);
 function close(){alive.current=false;dialog.current?.close();onClose();}
 async function unlock(event){event.preventDefault();if(busy)return;setBusy(true);setError('');try{if(!crypto.subtle)throw new Error('browser');const response=await fetch('/assets/protected/engineering.enc.json',{cache:'no-store'});if(!response.ok)throw new Error('load');const packet=await response.json(),walkthrough=await decryptWalkthrough(packet,input.current.value);if(!alive.current)return;input.current.value='';setContent(walkthrough);setIndex(0);body.current.scrollTop=0;}catch(e){if(alive.current)setError(e.message==='browser'?'Protected content is unavailable in this browser.':e.message==='load'?'Could not load the protected walkthrough. Try again.':'The passcode is incorrect.');requestAnimationFrame(()=>input.current?.focus());}finally{if(alive.current)setBusy(false);}}
 useEffect(()=>{if(content)requestAnimationFrame(()=>dialog.current?.querySelector('.private-document h3')?.focus({preventScroll:true}));},[content]);
 function lock(){setContent(null);setError('');setIndex(0);requestAnimationFrame(()=>input.current?.focus());}
 function choose(value){setIndex(value);if(body.current)body.current.scrollTop=0;requestAnimationFrame(()=>dialog.current?.querySelector('.private-document h3')?.focus({preventScroll:true}));}
 return <Localized><dialog ref={dialog} className="project-dialog protected-dialog" data-unlocked={!!content} aria-labelledby="private-dialog-title" onCancel={e=>{e.preventDefault();e.stopPropagation();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
  <article className="viewer-shell">
   <div className="viewer-top"><h2 id="private-dialog-title">Case study</h2><LanguageSelector/><button className="icon-button" type="button" aria-label="Close walkthrough" onClick={close}><Icon name="x" size={24}/></button></div>
   {document&&<nav className="private-toolbar" aria-label="Walkthrough chapters"><label className="private-chapter-select"><span className="visually-hidden">Select a chapter</span><select aria-label={t('Select a chapter')} value={index} onChange={e=>choose(Number(e.target.value))} lang={document.language}>{document.chapters.map((chapter,i)=><option key={chapter.id} value={i}>{i+1}. {chapter.title}</option>)}</select></label><span className="private-progress" aria-live="polite">{index+1} / {document.chapters.length}</span><button type="button" className="icon-button" aria-label="Previous chapter" disabled={index===0} onClick={()=>choose(index-1)}><Icon name="arrow-right" size={20} className="previous-chapter"/></button><button type="button" className="icon-button" aria-label="Next chapter" disabled={index===document.chapters.length-1} onClick={()=>choose(index+1)}><Icon name="arrow-right" size={20}/></button><button className="text-link private-lock" type="button" onClick={lock}>Lock case study</button></nav>}
   <div className={document?'private-workspace':undefined}>
    {document&&<nav className="private-chapters" aria-label={t('Case study chapters')} lang={document.language}><ol>{document.chapters.map((chapter,i)=><li key={chapter.id}><button type="button" aria-current={i===index?'page':undefined} onClick={()=>choose(i)}><span aria-hidden="true">{String(i+1).padStart(2,'0')}</span><span>{chapter.title}</span></button></li>)}</ol></nav>}
    <div ref={body} className="viewer-body">
     {!document?<form className="private-unlock" onSubmit={unlock}><h3>Continue with your passcode.</h3><p>Access is by invitation.</p><label htmlFor="walkthrough-passcode">Passcode</label><input ref={input} id="walkthrough-passcode" type="password" maxLength={256} required autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={busy} aria-describedby={error?'walkthrough-error':undefined}/><button className="button" type="submit" disabled={busy}>{busy?'Unlocking…':'Unlock case study'}</button>{error&&<p id="walkthrough-error" className="private-error" role="alert">{error}</p>}<a className="text-link" href="mailto:hutomoivan@gmail.com?subject=Portfolio%20case%20study%20access">Request access</a></form>:<Chapter key={document.chapters[index].id} chapter={document.chapters[index]} owner={document.owner} language={document.language}/>}
    </div>
   </div>
  </article>
 </dialog></Localized>;
}

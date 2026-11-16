import React, { useEffect, useRef } from 'react';
import { Localized } from '../i18n/I18n.jsx';

const works = [
  ['Featured engineering', '#engineering'],
  ['XView motion analysis', '#engineering', 'xview'],
  ['Commercial platform & licensing', '#engineering', 'xview-platform'],
  ['Independent products', '#works'],
  ['Computer vision & 3D research', '#vision-research'],
  ['Machine learning & competitions', '#ml-research'],
  ['Websites & community', '#websites'],
];
const publications = [
  ['Research papers', '#publications'],
  ['Granted patents', '#patents'],
  ['Robotics demonstrations', '#hardware'],
  ['Master’s thesis', '#project-pose-thesis', 'pose-thesis'],
  ['Earlier publications', '#earlier-publications'],
];
function Group({ id, title, items, onNavigate, onOpenCase }) {
  function keyboard(event) {
    const detail = event.currentTarget;
    const links = [...detail.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); detail.open = false; detail.querySelector('summary').focus(); }
    else if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault(); detail.open = true;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? links.length - 1 : event.key === 'ArrowDown' ? (index + 1) % links.length : index < 0 ? links.length - 1 : (index - 1 + links.length) % links.length;
      links[next]?.focus();
    }
  }
  return <Localized><details className="nav-group" onKeyDown={keyboard} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }} onToggle={event => { if (event.currentTarget.open) event.currentTarget.parentElement.querySelectorAll(':scope > .nav-group').forEach(other => { if(other !== event.currentTarget) other.open = false; }); }}><summary aria-controls={id}>{title}<img src="/assets/icons/caret-down.svg" width="14" height="14" alt="" /></summary><div className="nav-dropdown" id={id}>{items.map(([label,href,caseId])=><a key={label} href={href} data-case-id={caseId} onClick={event=>{
      if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const trigger=event.currentTarget.closest('.mobile-menu')?.querySelector(':scope > summary') || event.currentTarget.closest('.nav-group').querySelector('summary');
      if(href==='#earlier-publications')document.getElementById('earlier-publications').open=true;
      onNavigate(event.currentTarget);
      if(caseId){event.preventDefault();onOpenCase(caseId,trigger).catch(()=>{location.hash=href;});}
    }}>{label}</a>)}</div></details></Localized>;
}
export default function SiteNavigation({ tools, onOpenCase }) {
  const header = useRef(null), mobile = useRef(null);
  useEffect(() => {
    function outside(event) { if (!header.current.contains(event.target)) header.current.querySelectorAll('details[open]').forEach(detail=>detail.open=false); }
    document.addEventListener('pointerdown',outside);
    return ()=>document.removeEventListener('pointerdown',outside);
  },[]);
  function navigate(trigger) {
    header.current.querySelectorAll('details[open]').forEach(detail=>detail.open=false);
  }
  function destinations(prefix) { return <><a href="#home" onClick={event=>navigate(event.currentTarget)}>Home</a><Group id={`${prefix}-works`} title="Works" items={works} onNavigate={navigate} onOpenCase={onOpenCase}/><Group id={`${prefix}-publications`} title="Publications" items={publications} onNavigate={navigate} onOpenCase={onOpenCase}/><a href="#resume" onClick={event=>navigate(event.currentTarget)}>Resume</a><a href="#about" onClick={event=>navigate(event.currentTarget)}>About</a><a href="#contact" onClick={event=>navigate(event.currentTarget)}>Contact</a></>; }
  return <Localized><header className="site-header" ref={header}><div className="container nav-inner"><a className="wordmark" href="#home" aria-label="Ivan Surya Hutomo, Home">Ivan<span aria-hidden="true">.</span></a><nav className="desktop-nav" aria-label="Main navigation">{destinations('desktop')}</nav><div className="nav-tools">{tools}<details className="mobile-menu" ref={mobile} onKeyDown={event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary').focus();}}}><summary aria-label="Main navigation"><img className="glyph" src="/assets/icons/list.svg" width="24" height="24" alt=""/><span className="visually-hidden">Menu</span></summary><nav aria-label="Mobile navigation">{destinations('mobile')}</nav></details></div></div></header></Localized>;
}

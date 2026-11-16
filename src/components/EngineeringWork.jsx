import React, { useRef, useState } from 'react';
import work from '../../content/work.json';
import { Localized } from '../i18n/I18n.jsx';
import ProjectStory from './ProjectStory.jsx';
import ProtectedCaseLink from './ProtectedCaseLink.jsx';

export default function EngineeringWork({ onOpen, onPreload, pending, onOpenPrivate }) {
  const [active, setActive] = useState('xview');
  const detail = useRef(null);
  const selected = work.engineering.find(item => item.id === active);
  return <Localized><section className="engineering-section section" id="engineering" aria-labelledby="engineering-heading"><div className="container">
    <div className="engineering-intro"><h2 id="engineering-heading">From AI to a product.</h2></div>
    <div className="engineering-workspace"><nav className="system-selector" aria-label="IdeasLab engineering systems">{work.engineering.map((item, index) => <a key={item.id} href={`#system-${item.id}`} aria-current={active === item.id ? 'true' : undefined} onClick={event => { event.preventDefault(); setActive(item.id); if (matchMedia('(max-width: 767px)').matches) requestAnimationFrame(() => detail.current?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })); }}><span className="system-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{['AI capability','Software experience','Product delivery'][index]}</span></a>)}</nav>
    <article key={selected.id} ref={detail} className="system-detail" id={`system-${selected.id}`} aria-live="polite" aria-atomic="true"><h3>{selected.id === 'xview' ? 'Computer vision in use.' : selected.name}</h3><p className="system-headline">{selected.id === 'xview' ? 'Computer vision integration across desktop and web applications.' : selected.headline}</p><ProjectStory label="Explore engineering case study" project={selected} onOpen={onOpen} onPreload={onPreload} pending={pending === selected.id} />{selected.id==='xview'&&<ProtectedCaseLink onOpen={onOpenPrivate}/>}<div className="system-links">{selected.links?.filter(link=>link.href!==selected.href).map(link=><a className="text-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}{selected.href && <a className="text-link" href={selected.href} target="_blank" rel="noopener noreferrer">{selected.link}</a>}</div></article></div>
    <noscript><div className="engineering-static">{work.engineering.slice(1).map(item => <article id={`system-${item.id}`} key={item.id}><h3>{item.name}</h3><p>{item.headline}</p>{item.story.map(part => <div key={part.title}><h4>{part.title}</h4><p>{part.text}</p></div>)}</article>)}</div></noscript>
  </div></section></Localized>;
}

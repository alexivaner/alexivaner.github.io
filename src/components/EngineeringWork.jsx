import React, { useRef, useState } from 'react';
import work from '../../content/work.json';
import { Localized } from '../i18n/I18n.jsx';
import ProjectStory from './ProjectStory.jsx';

export default function EngineeringWork({ onOpen, onPreload, pending }) {
  const [active, setActive] = useState('xview');
  const detail = useRef(null);
  const selected = work.engineering.find(item => item.id === active);
  return <Localized><section className="engineering-section section" id="engineering" aria-labelledby="engineering-heading"><div className="container">
    <div className="engineering-intro"><div><h2 id="engineering-heading">Beyond inference.<br />The whole product.</h2><p className="lead">Selected engineering work at IdeasLab.</p></div><p>My role connects computer vision, applications, and the infrastructure that makes AI software usable. These are contributions within the IdeasLab team.</p></div>
    <div className="engineering-workspace"><nav className="system-selector" aria-label="IdeasLab engineering systems">{work.engineering.map((item, index) => <a key={item.id} href={`#system-${item.id}`} aria-current={active === item.id ? 'true' : undefined} onClick={event => { event.preventDefault(); setActive(item.id); if (matchMedia('(max-width: 767px)').matches) requestAnimationFrame(() => detail.current?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })); }}><span className="system-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{item.name}<small>{item.scope}</small></span></a>)}</nav>
    <article key={selected.id} ref={detail} className="system-detail" id={`system-${selected.id}`} aria-live="polite" aria-atomic="true"><p className="system-owner">IdeasLab / XView</p><h3>{selected.name}</h3><p className="system-headline">{selected.headline}</p><p>{selected.story[1].text}</p><ProjectStory project={selected} onOpen={onOpen} onPreload={onPreload} pending={pending === selected.id} /><div className="system-links">{selected.links?.filter(link=>link.href!==selected.href).map(link=><a className="text-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}{selected.href && <a className="text-link" href={selected.href} target="_blank" rel="noopener noreferrer">{selected.link}</a>}</div></article></div>
    <noscript><div className="engineering-static">{work.engineering.slice(1).map(item => <article id={`system-${item.id}`} key={item.id}><h3>{item.name}</h3><p>{item.headline}</p>{item.story.map(part => <div key={part.title}><h4>{part.title}</h4><p>{part.text}</p></div>)}</article>)}</div></noscript>
  </div></section></Localized>;
}

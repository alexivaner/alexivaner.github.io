import { Localized } from '../i18n/I18n.jsx';
import React, { useState } from 'react';
import data from '../../content/portfolio.json';
import work from '../../content/work.json';

export default function WebsiteWork({ onOpen }) {
  const [selectedId, setSelectedId] = useState('tad');
  const selected = data.websites.find(site => site.id === selectedId);
  function choose(event, site) {
    if (site.id === 'kita' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault(); const trigger = event.currentTarget;
      onOpen(work.kita, trigger).catch(() => { const fallback = document.getElementById('kita-case-study'); fallback.open = true; fallback.scrollIntoView(); }); return;
    }
    if (!site.image || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setSelectedId(site.id);
  }
  return <Localized><section className="website-section section" id="websites" aria-labelledby="websites-heading"><div className="container">
    <div className="section-intro"><h2 id="websites-heading">Websites I’ve developed.</h2><p className="lead">For creative studios, healthcare, academic research, and publishing.</p></div>
    <div className="website-showcase"><figure className="website-preview" key={selected.id}><a href={selected.href} target="_blank" rel="noopener noreferrer"><img key={selected.id} src={`/${selected.image}`} width="1200" height="833" alt={`${selected.name}, a real capture of the website.`} loading="lazy" /></a><figcaption><h3>{selected.name}</h3><p>{selected.description}</p>{selected.captureNote && <p className="capture-note">{selected.captureNote}</p>}<a className="text-link" href={selected.href} target="_blank" rel="noopener noreferrer">Visit website</a></figcaption></figure>
    <nav className="website-selector" aria-label="Website portfolio">{['Client websites', 'Research & publishing'].map(category => <div className="website-group" key={category}><h3>{category}</h3>{data.websites.filter(site => site.category === category).map(site => <a key={site.id} href={site.id === 'kita' ? '#kita-case-study' : site.href} target={site.id === 'kita' ? undefined : '_blank'} rel="noopener noreferrer" aria-current={site.id === selectedId ? 'true' : undefined} onClick={event => choose(event, site)}><span>{site.name}<small>{site.id === 'kita' ? 'View case study' : site.type}</small></span><img className="glyph" src={`/assets/icons/${site.image ? 'arrow-right' : 'arrow-up-right'}.svg`} width="20" height="20" alt="" /></a>)}</div>)}</nav></div>
  <details className="kita-fallback" id="kita-case-study"><summary>Kita Taiwan: view case study</summary><h3>{work.kita.headline}</h3>{work.kita.story.map(part => <div key={part.title}><h4>{part.title}</h4><p>{part.text}</p></div>)}<a className="text-link" href={work.kita.href} target="_blank" rel="noopener noreferrer">Website reference</a><p>{work.kita.availability}</p></details></div></section></Localized>;
}

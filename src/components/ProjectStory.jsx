import OurTripConversation from './OurTripConversation.jsx';
import Icon from './Icon.jsx';
import React, { useRef } from 'react';
import { Localized } from '../i18n/I18n.jsx';

export default function ProjectStory({ project, onOpen, onPreload, pending, headingLevel = 4, label = 'Inside the project', fallbackId }) {
  const details = useRef(null);
  const Heading = `h${headingLevel}`;
  async function activate(event) {
    event.preventDefault();
    if (pending) return;
    const source = event.currentTarget;
    try { await onOpen(project, source); }
    catch { details.current.open = !details.current.open; }
  }
  return <Localized><details className="project-story" ref={details}><summary onClick={activate} onPointerEnter={onPreload} onFocus={onPreload} aria-busy={pending || undefined} aria-haspopup="dialog">{pending ? 'Opening project…' : label}<Icon name="plus" size={20} className="glyph"/></summary><div className="story-grid" id={fallbackId ? `project-details-${fallbackId}` : undefined}>{project.story.map(part => <div key={part.title}><Heading>{part.title}</Heading><p>{part.text}</p></div>)}</div>{project.id === 'ourtrip' && <OurTripConversation headingLevel={headingLevel} />}{project.source && <a className="text-link" href={project.source} target="_blank" rel="noopener noreferrer">View source</a>}</details></Localized>;
}

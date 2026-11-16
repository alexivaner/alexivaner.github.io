import React from 'react';
import { useI18n } from '../i18n/I18n.jsx';

// Every project image uses the same case viewer; explicit source links stay separate.
export default function ProjectThumbnail({ project, onOpen, onPreload, pending, children, className='' }) {
  const { t }=useI18n();
  async function activate(event) {
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();
    if(pending)return;
    const trigger=event.currentTarget;
    try { await onOpen(project,trigger); }
    catch {
      const fallback=trigger.closest('article, .website-showcase')?.querySelector('.project-story');
      if(fallback){fallback.open=true;fallback.scrollIntoView({block:'nearest'});}
      else if(project.href)location.assign(project.href);
    }
  }
  return <a className={`project-thumbnail ${className}`.trim()} href={`#project-details-${project.id}`} data-case-id={project.id} aria-label={`${t('Inside the project')}: ${t(project.name)}`} aria-haspopup="dialog" aria-busy={pending||undefined} onClick={activate} onPointerEnter={onPreload} onFocus={onPreload}>{children}</a>;
}

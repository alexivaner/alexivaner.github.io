import Icon from './Icon.jsx';
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import '../../styles/viewer.css';
import ResearchMedia, { ImageComparison } from './ResearchMedia.jsx';
import data from '../../content/portfolio.json';
import ProtectedCaseLink from './ProtectedCaseLink.jsx';
import { Localized, LanguageSelector } from '../i18n/I18n.jsx';

export default function ProjectViewer({ project, onClose, onOpenRelated, onOpenPrivate }) {
  const [open, setOpen] = useState(true);
  const dialog = useRef(null);
  const video = data.hardware.find(item => item.id === project.videoId);
  const reduce = useReducedMotion();
  useEffect(() => {
    dialog.current.showModal();
    dialog.current.scrollTop = 0;
    const previousOverflow = document.documentElement.style.overflowY;
    document.documentElement.style.overflowY = 'hidden';
    return () => { document.documentElement.style.overflowY = previousOverflow; };
  }, []);
  const close = () => setOpen(false);
  return <Localized><dialog className="project-dialog" ref={dialog} aria-labelledby="project-dialog-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}><AnimatePresence onExitComplete={() => { dialog.current.close(); onClose(); }}>
    {open && <motion.article className="viewer-shell" initial={reduce ? false : { opacity: 0, y: 22, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }} transition={{ duration: reduce ? 0 : .3, ease: [.16, 1, .3, 1] }}>
      <div className="viewer-top"><h2 id="project-dialog-title">{project.name}</h2><LanguageSelector /><button className="icon-button" type="button" aria-label="Close project" onClick={close} autoFocus><Icon name="x" size={24}/></button></div><div className="viewer-body"><p className="viewer-lead">{project.headline}</p>
      {video && <div className="case-video"><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`} title={video.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div><a className="text-link" href={video.href} target="_blank" rel="noopener noreferrer">Watch on YouTube</a></div>}
      {project.image && !video && <figure className="viewer-image"><img src={`/${project.image.replace(/^\//, '')}`} width={project.imageWidth || 1440} height={project.imageHeight || 900} alt={project.imageAlt} /><figcaption>{project.caption || 'Independent prototype. Working local build.'}</figcaption></figure>}
      {project.pipeline && <details className="workflow-details"><summary>Technical workflow</summary><ol className="project-pipeline" aria-label="Project workflow">{project.pipeline.map(step => <li key={step}>{step}</li>)}</ol></details>}
      {project.comparison && <ImageComparison />}
      {project.mediaType && <ResearchMedia type={project.mediaType} />}
      {project.metadata && <dl className="case-metadata">{project.metadata.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}


      {project.availability && <p className="availability-note">{project.availability}</p>}
      <div className="viewer-story">{project.story.map(part => <section key={part.title}><h3>{part.title}</h3><p>{part.text}</p></section>)}</div>
      {project.id==='xview'&&onOpenPrivate&&<ProtectedCaseLink onOpen={onOpenPrivate}/>}
      {project.related && <button className="text-link related-case" type="button" onClick={()=>onOpenRelated(project.related)}>{project.relatedLabel}</button>}
      {project.href && <a className="button" href={project.href} target="_blank" rel="noopener noreferrer">{project.link}</a>}{project.links?.filter(link => link.href !== project.href).map(link=><a className="text-link viewer-source" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}{project.source && <a className="text-link viewer-source" href={project.source} target="_blank" rel="noopener noreferrer">View source</a>}
    </div></motion.article>}
  </AnimatePresence></dialog></Localized>;
}

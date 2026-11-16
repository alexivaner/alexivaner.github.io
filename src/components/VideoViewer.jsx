import Icon from './Icon.jsx';
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Localized, LanguageSelector } from '../i18n/I18n.jsx';
import '../../styles/viewer.css';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
export default function VideoViewer({ video, onClose }) {
  const dialog = useRef(null);
  const [open,setOpen]=useState(true);
  const reduce=useReducedMotion();
  useEffect(() => {
    dialog.current.showModal();
    const overflow = document.documentElement.style.overflowY;
    document.documentElement.style.overflowY = 'hidden';
    return () => { document.documentElement.style.overflowY = overflow; };
  }, []);
  function close() { setOpen(false); }
  return <Localized><dialog className="project-dialog video-dialog" ref={dialog} aria-labelledby="video-dialog-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}><AnimatePresence onExitComplete={()=>{dialog.current.close();onClose();}}>{open && <motion.article className="viewer-shell" initial={reduce ? false : {opacity:0,y:18}} animate={{opacity:1,y:0}} exit={reduce ? {opacity:1} : {opacity:0,y:10}} transition={{duration:reduce?0:.22,ease:[.16,1,.3,1]}}><div className="viewer-top"><h2 id="video-dialog-title">{video.title}</h2><button className="icon-button" aria-label="Close video" type="button" onClick={close} autoFocus><Icon name="x" size={24}/></button></div><div className="viewer-body"><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`} title={video.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div><p className="video-fallback">If playback is restricted, watch the original demonstration on YouTube.</p><a className="text-link" href={video.href} target="_blank" rel="noopener noreferrer">Watch on YouTube</a><LanguageSelector /></div></motion.article>}</AnimatePresence></dialog></Localized>;
}

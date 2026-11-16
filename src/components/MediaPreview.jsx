'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Localized } from '../i18n/I18n.jsx';

// One automatic preview at a time, across every mounted project gallery.
const candidates = new Set();
let current;
function choosePreview() {
  const next = [...candidates].filter(item=>item.visible && item.allowed && !item.userPaused).sort((a,b)=>b.ratio-a.ratio)[0];
  if(current && current!==next) current.pause();
  current=next;
  next?.play();
}
export default function MediaPreview({ name, poster, src, caption, original, square=false }) {
  const player=useRef(null), frame=useRef(null), policy=useRef(null);
  const [manual,setManual]=useState(false), [failed,setFailed]=useState(false);
  useEffect(()=>{
    const media=player.current;
    const motion=matchMedia('(prefers-reduced-motion: reduce)'), data=matchMedia('(prefers-reduced-data: reduce)');
    let automaticPause=false;
    const item={visible:false,ratio:0,allowed:false,userPaused:false,
      pause(){if(!media.paused){automaticPause=true;media.pause();}media.autoplay=false;},
      async play(){
        if(!item.visible||document.hidden)return;
        if(!media.getAttribute('src'))media.src=src;
        media.autoplay=true;media.muted=true;
        try{await media.play();setManual(false);}catch{setManual(true);}
      }
    };
    policy.current=item;
    const update=()=>{item.allowed=!motion.matches&&!data.matches&&!navigator.connection?.saveData&&!document.hidden;if(!item.allowed)item.pause();choosePreview();setManual(!item.allowed);};
    const observer=new IntersectionObserver(([entry])=>{item.ratio=entry.intersectionRatio;item.visible=entry.isIntersecting && entry.intersectionRatio>=.45;if(!item.visible)item.pause();choosePreview();},{threshold:[0,.45,.7,1]});
    const paused=()=>{if(automaticPause){automaticPause=false;return;}item.userPaused=true;setManual(true);};
    const played=()=>{item.userPaused=false;setManual(false);for(const other of candidates)if(other!==item)other.pause();};
    const visibility=()=>{item.allowed=!motion.matches&&!data.matches&&!navigator.connection?.saveData&&!document.hidden;if(document.hidden)item.pause();choosePreview();};
    candidates.add(item);update();observer.observe(frame.current);
    media.addEventListener('pause',paused);media.addEventListener('play',played);
    document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',update);data.addEventListener('change',update);navigator.connection?.addEventListener?.('change',update);
    return()=>{observer.disconnect();candidates.delete(item);if(current===item)current=null;media.removeEventListener('pause',paused);media.removeEventListener('play',played);media.pause();media.removeAttribute('src');media.load();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',update);data.removeEventListener('change',update);navigator.connection?.removeEventListener?.('change',update);choosePreview();};
  },[src]);
  async function play(){const item=policy.current;if(!item)return;item.userPaused=false;item.visible=true;await item.play();}
  async function fullscreen(){await play();const media=player.current;try{if(media.requestFullscreen)await media.requestFullscreen();else if(media.webkitEnterFullscreen)media.webkitEnterFullscreen();}catch{media.focus();}}
  return <Localized><figure ref={frame} className={`original-animation${square?' skeleton-animation':''}`}><div className="animation-surface"><video ref={player} controls muted loop playsInline preload="none" poster={poster} aria-label={name} onError={()=>setFailed(true)}/>{manual&&!failed&&<button className="media-play-label preview-manual" type="button" onClick={play}>Play animation</button>}</div><div className="media-caption-row"><figcaption>{caption}</figcaption><button className="text-link media-fullscreen" type="button" onClick={fullscreen}>Watch full screen</button></div>{failed&&<p role="status">Could not load the animation. <a className="text-link" href={original} target="_blank" rel="noopener noreferrer">View original media</a></p>}</figure></Localized>;
}

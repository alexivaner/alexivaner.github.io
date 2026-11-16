import { Localized } from '../i18n/I18n.jsx';
import React from 'react';
import data from '../../content/portfolio.json';
import research from '../../content/research.json';
import ProjectStory from './ProjectStory.jsx';
import ProjectThumbnail from './ProjectThumbnail.jsx';

export default function HardwareWork({ onOpen, onPreload, pending }) {
  return <Localized><section className="hardware-section section" id="hardware" aria-labelledby="hardware-heading"><div className="container"><div className="section-intro"><h2 id="hardware-heading">Code, moving in the real world.</h2><p className="lead">Earlier experiments in robotics, control systems, and connected hardware. Watch the original demonstrations here.</p></div><div className="hardware-gallery">{data.hardware.map((video, index) => <article className="hardware-project" id={`robot-${video.id}`} key={video.id}><ProjectThumbnail labelFromContent className="hardware-video" project={research.robotics[index]} onOpen={onOpen} onPreload={onPreload} pending={pending === `robot-${video.id}`}><figure><span className="video-play" aria-hidden="true"><img src="/assets/icons/play.svg" width="24" height="24" alt="" /></span><img src={`/${video.image}`} width="1000" height="563" alt="" loading="lazy" /><figcaption><h3>{video.title}</h3><span>Inside the project</span></figcaption></figure></ProjectThumbnail><ProjectStory fallbackId={research.robotics[index].id} project={research.robotics[index]} onOpen={onOpen} onPreload={onPreload} pending={pending === `robot-${video.id}`} /></article>)}</div></div></section></Localized>;
}

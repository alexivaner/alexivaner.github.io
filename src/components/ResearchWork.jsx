import React from 'react';
import work from '../../content/work.json';
import data from '../../content/portfolio.json';
import { Localized } from '../i18n/I18n.jsx';
import ProjectStory from './ProjectStory.jsx';
import ProjectThumbnail from './ProjectThumbnail.jsx';
import MediaPreview from './MediaPreview.jsx';

function ResearchPreview({project,onOpen,onPreload,pending}) {
 const media={traffic:'traffic-models',shopee:'shopee-model'};
 return <Localized><ProjectThumbnail labelFromContent={project.id==='bri'} className="research-thumbnail" project={project} onOpen={onOpen} onPreload={onPreload} pending={pending}>
  {project.id==='zero-dce'?<div className="zero-preview"><img src="/assets/images/research/zero-after.webp" alt="Enhanced low-light scene from the Zero-DCE team repository." width="640" height="424" loading="lazy"/><img src="/assets/images/research/zero-before.webp" alt="Original low-light scene from the same repository." width="1200" height="795" loading="lazy"/></div>:
   project.id==='pose-thesis'||project.id==='tsp'?<MediaPreview preview name={project.name} poster={`/assets/images/research/${project.id==='tsp'?'tsp-15':'pose-3d'}.webp`} src={`/assets/media/${project.id==='tsp'?'tsp-15':'pose-3d'}.mp4`}/>:
   media[project.id]?<img src={`/assets/images/research/${media[project.id]}.webp`} width="1600" height="900" alt={project.name} loading="lazy"/>:
   <div className="notebook-preview"><span>People analytics</span><ol><li>Historical KPIs</li><li>Feature preparation</li><li>CatBoost classifier</li></ol><small>Conceptual workflow based on the public notebook.</small><span className="visually-hidden"><span>Inside the project</span>: {project.name}</span></div>}
 </ProjectThumbnail></Localized>;
}

export default function ResearchWork({ onOpen, onPreload, pending }) {
  return <Localized><section className="applied-section section" id="applied" aria-labelledby="applied-heading"><div className="container">
    <div className="applied-intro"><h2 id="applied-heading">More ways<br />to apply AI.</h2><p className="lead">Research, competition projects, and algorithmic experiments. Open a project for the problem, approach, and contribution.</p></div>
    <div className="research-project-groups">{['Computer vision & 3D', 'Machine learning & data science', 'Optimization & algorithms'].map(category => <div className="research-project-group" id={category === 'Computer vision & 3D' ? 'vision-research' : category === 'Machine learning & data science' ? 'ml-research' : 'optimization-research'} key={category}><h3>{category}</h3>{work.research.filter(item => item.category === category).map(project => <article className="research-project" id={`project-${project.id}`} key={project.id}><ResearchPreview project={project} onOpen={onOpen} onPreload={onPreload} pending={pending === project.id}/><div className="research-summary"><h4>{project.name}</h4><p>{project.summary}</p><ProjectStory fallbackId={project.id} project={project} onOpen={onOpen} onPreload={onPreload} pending={pending === project.id} /></div></article>)}</div>)}
    <details className="additional-experiments"><summary>Signal, voice, and connected hardware</summary>{data.experiments.map((item, index) => { const project = { id: `experiment-${index}`, name: item.title, headline: item.description, source: item.href, story: [{ title: 'The project', text: item.description }, { title: 'Public implementation', text: index === 0 ? 'A collaborative radio-signal classification study. The repository documents the experiments and credits the contributors.' : index === 1 ? 'A speaker-recognition experiment using Gaussian mixture models, with model creation and ONNX conversion.' : 'A connected-hardware prototype combining face recognition and Google Assistant. The original demonstration is available in the hardware section.' }] }; return <article className="research-project" key={item.href}><h4>{item.title}</h4><ProjectStory project={project} onOpen={onOpen} onPreload={onPreload} pending={pending === project.id} /></article>; })}</details></div>
  </div></section></Localized>;
}

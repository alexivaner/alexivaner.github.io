import React from 'react';
import work from '../../content/work.json';
import data from '../../content/portfolio.json';
import { Localized } from '../i18n/I18n.jsx';
import ProjectStory from './ProjectStory.jsx';

export default function ResearchWork({ onOpen, onPreload, pending }) {
  return <Localized><section className="applied-section section" id="applied" aria-labelledby="applied-heading"><div className="container">
    <div className="applied-intro"><h2 id="applied-heading">More ways<br />to apply AI.</h2><p className="lead">Research, competition projects, and algorithmic experiments. Open a project for the problem, approach, and contribution.</p></div>
    <div className="research-project-groups">{['Computer vision & 3D', 'Machine learning & data science', 'Optimization & algorithms'].map(category => <div className="research-project-group" id={category === 'Computer vision & 3D' ? 'vision-research' : category === 'Machine learning & data science' ? 'ml-research' : 'optimization-research'} key={category}><h3>{category}</h3>{work.research.filter(item => item.category === category).map(project => <article className="research-project" id={`project-${project.id}`} key={project.id}><div><h4>{project.name}</h4><p>{project.summary}</p></div><ProjectStory project={project} onOpen={onOpen} onPreload={onPreload} pending={pending === project.id} /></article>)}</div>)}
    <details className="additional-experiments"><summary>Signal, voice, and connected hardware</summary>{data.experiments.map((item, index) => { const project = { id: `experiment-${index}`, name: item.title, headline: item.description, source: item.href, story: [{ title: 'The project', text: item.description }, { title: 'Public implementation', text: index === 0 ? 'A collaborative radio-signal classification study. The repository documents the experiments and credits the contributors.' : index === 1 ? 'A speaker-recognition experiment using Gaussian mixture models, with model creation and ONNX conversion.' : 'A connected-hardware prototype combining face recognition and Google Assistant. The original demonstration is available in the hardware section.' }] }; return <article className="research-project" key={item.href}><h4>{item.title}</h4><ProjectStory project={project} onOpen={onOpen} onPreload={onPreload} pending={pending === project.id} /></article>; })}</details></div>
  </div></section></Localized>;
}

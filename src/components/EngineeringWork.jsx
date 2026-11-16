import React,{useRef,useState} from 'react';
import EngineeringEvidence from './EngineeringEvidence.jsx';
import work from '../../content/work.json';
import {Localized,useI18n} from '../i18n/I18n.jsx';
import ProjectStory from './ProjectStory.jsx';
import ProtectedCaseLink from './ProtectedCaseLink.jsx';
import Icon from './Icon.jsx';
const presentation={
 xview:{label:'Motion analysis',title:'XView Studio',description:'Integrating computer vision into desktop and web workflows people can use.',points:['Computer vision integration','Desktop and web applications','2D and 3D motion review']},
 'xview-check':{label:'System compatibility',title:'System Compatibility Checker',description:'Helping people understand their system before they start using the software.',points:['System-readiness web experience','Clear software requirements','Guidance before setup']},
 'xview-platform':{label:'Commercial platform',title:'Commercial platform & licensing',description:'Connecting the AI application to the account and software-access experience around it.',points:['Full-stack application engineering','Account and software-access flows','Commercial product integration']}
};
export default function EngineeringWork({onOpen,onPreload,pending,onOpenPrivate}){
 const {t}=useI18n(),[active,setActive]=useState('xview'),nav=useRef(null);
 const selected=work.engineering.find(item=>item.id===active),view=presentation[active],index=work.engineering.indexOf(selected),next=work.engineering[(index+1)%work.engineering.length];
 function choose(id,focus=false){setActive(id);if(focus)nav.current?.querySelector(`[href="#system-${id}"]`)?.focus({preventScroll:true});}
 function keyboard(event){const items=[...nav.current.querySelectorAll('a')],i=items.indexOf(event.target);if(i<0)return;const key=event.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;event.preventDefault();const n=key==='Home'?0:key==='End'?items.length-1:(i+(key==='ArrowRight'?1:-1)+items.length)%items.length;choose(work.engineering[n].id,true);}
 return <Localized><section className="engineering-section section" id="engineering" aria-labelledby="engineering-heading"><div className="container">
  <div className="engineering-intro"><div><h2 id="engineering-heading">From AI to a product.</h2><p className="engineering-lead">My contributions at IdeasLab connect computer vision, applications, and delivery.</p></div><div className="engineering-invitation"><p>Explore more of my work.</p><ProtectedCaseLink onOpen={onOpenPrivate} variant="primary" label="Unlock case study" descriptionId="engineering-access-note"/><span id="engineering-access-note" className="walkthrough-access">Passcode required</span></div></div>
  <nav ref={nav} className="system-selector" aria-label="IdeasLab engineering systems" onKeyDown={keyboard}>{work.engineering.map((item,i)=><a key={item.id} href={`#system-${item.id}`} aria-current={active===item.id?'true':undefined} onClick={event=>{event.preventDefault();choose(item.id);}}><Icon name={['cube','desktop','key'][i]} size={22}/><span>{presentation[item.id].label}</span><Icon name="arrow-right" size={18} className="system-select-arrow"/></a>)}</nav>
  <p className="visually-hidden" role="status">{t(view.title)}</p>
  <div className="engineering-workspace"><article key={selected.id} className="system-detail" id={`system-${selected.id}`} aria-labelledby="engineering-selected-title"><EngineeringEvidence id={selected.id}/><div className="system-story"><p className="system-context">IdeasLab / Team contribution</p><h3 id="engineering-selected-title">{view.title}</h3><p className="system-headline">{view.description}</p><ul className="engineering-contributions">{view.points.map(point=><li key={point}><Icon name="check" size={18}/><span>{point}</span></li>)}</ul><ProjectStory label="Read public overview" project={selected} onOpen={onOpen} onPreload={onPreload} pending={pending===selected.id}/><div className="system-links">{selected.links?.filter(link=>link.href!==selected.href).map(link=><a className="text-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Icon name="arrow-up-right" size={16}/></a>)}{selected.href&&<a className="text-link" href={selected.href} target="_blank" rel="noopener noreferrer">{selected.link}<Icon name="arrow-up-right" size={16}/></a>}</div></div></article><div className="engineering-next"><span>{index+1} / {work.engineering.length}</span><button type="button" className="text-link" aria-label={`${t('Next project')}: ${t(presentation[next.id].label)}`} onClick={()=>choose(next.id,true)}>Next project<Icon name="arrow-right" size={20}/></button></div></div>
  <noscript><div className="engineering-static">{work.engineering.slice(1).map(item=><article id={`system-${item.id}`} key={item.id}><h3>{item.name}</h3><p>{item.headline}</p>{item.story.map(part=><div key={part.title}><h4>{part.title}</h4><p>{part.text}</p></div>)}</article>)}</div></noscript>
 </div></section></Localized>;
}

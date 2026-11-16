import Icon from './components/Icon.jsx';
import React, { useEffect, useRef, useState } from 'react';
import data from '../content/portfolio.json';
import WebsiteWork from './components/WebsiteWork.jsx';
import HardwareWork from './components/HardwareWork.jsx';
import Recognition from './components/Recognition.jsx';
import ProjectStory from './components/ProjectStory.jsx';
import ProjectThumbnail from './components/ProjectThumbnail.jsx';
import GolfMotion from './components/GolfMotion.jsx';
import EngineeringWork from './components/EngineeringWork.jsx';
import ResearchWork from './components/ResearchWork.jsx';
import work from '../content/work.json';
import research from '../content/research.json';
import SiteNavigation from './components/SiteNavigation.jsx';
import { findCase } from './cases.js';
import { LocaleProvider, Localized, LanguageSelector } from './i18n/I18n.jsx';

export { default as Icon } from './components/Icon.jsx';

const external = { target: '_blank', rel: 'noopener noreferrer' };

function ThemeToggle() {
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => { setDark(document.documentElement.dataset.mode ? document.documentElement.dataset.mode === 'dark' : media.matches); document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.body).backgroundColor; };
    sync(); setReady(true);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  function toggle() {
    const next = !dark;
    document.documentElement.dataset.mode = next ? 'dark' : 'light';
    try { localStorage.setItem('ivan-theme', next ? 'dark' : 'light'); } catch {}
    document.querySelector('meta[name="theme-color"]').content = next ? '#17191d' : '#f6f7f8';
    setDark(next);
  }
  return <Localized><button className="icon-button theme-toggle" type="button" hidden={!ready} aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`} title="Switch colour theme" onClick={toggle}><Icon name={dark ? 'sun' : 'moon'} size={20} className="theme-icon" /></button></Localized>;
}


function Hero({ suspended }) {
  return <Localized><section className="hero" id="home" aria-labelledby="hero-heading"><div className="container stage-grid">
    <div className="intro-copy"><p className="personal-intro">Ivan Surya Hutomo · Lead Applied AI Engineer</p><h1 id="hero-heading">Engineering AI<br />beyond the model.</h1><p className="hero-description">I turn computer vision and AI research into real software products.</p><div className="hero-actions"><a className="button" href="#engineering">Explore engineering work</a><a className="text-link" href="resume/">View resume</a></div></div>
    <div className="work-preview"><article className="hero-product-text" aria-labelledby="flagship-title"><h2 id="flagship-title">Interactive motion study.</h2><GolfMotion suspended={suspended}/></article></div>
  </div></section></Localized>;
}


function ProductCapture({ project, onOpen, onPreload, pending }) {
  return <Localized><figure className="product-capture"><ProjectThumbnail project={project} onOpen={onOpen} onPreload={onPreload} pending={pending}><img src={`/${project.image.replace(/^\//, '')}`} width={project.imageWidth || 1440} height={project.imageHeight || 900} alt={project.imageAlt} loading="lazy" /></ProjectThumbnail><figcaption>{project.caption || (project.id === 'readmory' ? 'Independent product. Real interface, synthetic demo library.' : 'Independent prototype. Captured from the working local build.')}</figcaption></figure></Localized>;
}

function SelectedWork({ onOpen, onPreload, pending }) {
  const [readmory, aegis] = data.projects;
  const storyProps = project => ({ project, onOpen, onPreload, pending: pending === project.id, fallbackId: project.id });
  return <Localized><section className="work-section section" id="works" aria-labelledby="work-heading"><div className="container">
    <div className="section-intro"><h2 id="work-heading">Independent by design.</h2><p className="lead">Personal products, built around everyday interests.</p><nav className="work-destinations" aria-label="Browse selected work"><a href="#works">Products</a><a href="#websites">Websites</a><a href="#hardware">Hardware</a></nav></div>
    <article className="featured-project" aria-labelledby="readmory-heading"><div className="project-copy"><h3 id="readmory-heading">Readmory</h3><p className="project-headline">{readmory.headline}</p><p>{readmory.description}</p><a className="text-link" href={readmory.href} {...external}>{readmory.link}</a></div><ProductCapture {...storyProps(readmory)} /><ProjectStory {...storyProps(readmory)} /></article>
    <div className="secondary-projects"><article className="aegis-project" aria-labelledby="aegis-heading"><ProductCapture {...storyProps(aegis)} /><h3 id="aegis-heading">Aegis</h3><p>{aegis.description}</p><ProjectStory {...storyProps(aegis)} /></article>
    <aside className="earlier-projects" aria-labelledby="independent-heading"><h3 id="independent-heading">Built from<br />curiosity.</h3><p>Reading, exploring, and community needs become independent software projects.</p><a className="text-link" href="#applied">Explore research & applied AI</a><a className="text-link" href="#websites">Explore website work</a></aside></div>
  </div></section></Localized>;
}

function Experience() {
  return <Localized><section className="experience-section section" id="resume" aria-labelledby="experience-heading"><div className="container experience-grid"><div className="experience-intro"><h2 id="experience-heading">From research<br />to real use.</h2><p className="lead">My work connects applied AI, product engineering, and technical leadership.</p><a className="text-link" href="resume/">View resume</a></div><div className="experience-list">{data.experience.map((item, index) => <details className="experience-item" key={item.title} open={index === 0}><summary><span><span className="experience-title">{item.title}</span><span className="experience-date">{item.period}</span></span><Icon name="plus" size={20} /></summary><div className="experience-body"><p className="experience-area">{item.area}</p><p>{item.text}</p>{item.links && <div className="experience-links">{item.links.map(link => <a className="text-link" key={link.href} href={link.href} {...external}>{link.label}</a>)}</div>}</div></details>)}</div></div></section></Localized>;
}

function Publications({ onOpen, onPreload, pending }) {
  function publication(item, index) {
    const project = research.papers[index];
    return <article className={`publication${item.featured ? ' publication-featured' : ''}`} key={item.href} id={project.id}><div><h3>{item.title}</h3><p>{item.venue || item.topic}</p><ProjectStory project={project} onOpen={onOpen} onPreload={onPreload} pending={pending === project.id} /></div><a className="publication-source icon-button" href={item.href} {...external} aria-label="Read original publication"><Icon name="arrow-up-right" /></a></article>;
  }
  return <Localized><section className="research-section section" id="publications" aria-labelledby="research-heading"><div className="container"><div className="section-intro"><h2 id="research-heading">Research, in practice.</h2><p className="lead">Publications in computer vision, connected systems, and engineering education.</p></div><div className="publication-list">{data.publications.slice(0,2).map(publication)}</div><details className="more-publications" id="earlier-publications"><summary>Earlier publications<Icon name="plus" size={20} /></summary><div className="publication-list publication-compact">{data.publications.slice(2).map((item,index)=>publication(item,index+2))}</div></details><a className="text-link scholar-link" href="https://scholar.google.com/citations?user=SvYFXy0AAAAJ&hl=en&oi=ao" {...external}>Google Scholar</a></div></section></Localized>;
}
function Patents({ onOpen, onPreload, pending }) {
  return <Localized><section className="patent-section section" id="patents" aria-labelledby="patent-heading"><div className="container"><div className="section-intro"><h2 id="patent-heading">Research into invention.</h2><p className="lead">Co-inventor on two granted Taiwan patents for elevator passenger safety.</p></div><div className="patent-grid">{data.patents.map((item,index) => <article className="patent" key={item.id} id={`patent-${item.id}`}><h3><a href={item.href} {...external}><span className="patent-id">{item.id}</span>{item.title}<Icon name="arrow-up-right" size={20} /></a></h3><p className="patent-meta">{item.role} / <time dateTime={item.issued}>{item.issuedLabel}</time></p><p>{item.summary}</p><ProjectStory project={research.patents[index]} onOpen={onOpen} onPreload={onPreload} pending={pending === `patent-${item.id}`} /></article>)}</div></div></section></Localized>;
}

function About() {
  return <Localized><section className="about-section section" id="about" aria-labelledby="about-heading"><div className="container"><div className="about-statement"><h2 id="about-heading">An engineer.<br />A product person.<br />Always curious.</h2><div className="about-copy"><p>I’m Ivan Surya Hutomo, an applied AI engineer connecting computer vision, software, and product design.</p><p>I work from problem definition and model evaluation through to software people can use.</p><p>Reading, photography, and exploring inspire my independent projects.</p></div></div><div className="education">{data.education.map(item => <div key={item.degree}><h3>{item.degree}</h3><p>{item.school}</p><p className="education-date">{item.period}</p></div>)}</div><Recognition /></div></section></Localized>;
}

function EmailContact() {
  const [available, setAvailable] = useState(false);
  const [state, setState] = useState('idle');
  const timer = useRef(null);
  useEffect(() => { setAvailable(Boolean(navigator.clipboard?.writeText && window.isSecureContext)); return () => clearTimeout(timer.current); }, []);
  async function copy() {
    clearTimeout(timer.current); setState('busy');
    try { await navigator.clipboard.writeText(data.email); setState('copied'); }
    catch { setState('error'); }
    timer.current = setTimeout(() => setState('idle'), 4000);
  }
  return <Localized><div className="contact-action"><a className="email-link" href={`mailto:${data.email}`}>{data.email}</a><button className="icon-button copy-email" type="button" aria-label="Copy email address" hidden={!available} disabled={state === 'busy'} aria-busy={state === 'busy' || undefined} onClick={copy}><Icon name={state === 'copied' ? 'check' : 'copy'} size={20} /></button><p className="copy-status" role="status" aria-live="polite">{state === 'copied' ? 'Email address copied.' : state === 'error' ? 'Could not copy. Select the email address, or open it in your email app.' : ''}</p></div></Localized>;
}

function SiteFooter() {
  return <Localized><footer className="contact-section section" id="contact"><div className="container"><h2>Have a useful<br />problem in mind?</h2><EmailContact /><nav className="footer-navigation" aria-label="Footer navigation"><div><h3>Explore</h3><a href="#home">Home</a><a href="#engineering">Works</a><a href="#publications">Publications</a><a href="#about">About</a></div><div><h3>Selected work</h3><a href="#engineering">XView</a><a href="#applied">Research projects</a><a href="#works">Independent products</a><a href="#websites">Websites & community</a></div><div><h3>Connect</h3><a href={data.social.github} {...external}>GitHub</a><a href={data.social.linkedin} {...external}>LinkedIn</a><a href={`mailto:${data.email}`}>Email</a></div></nav><div className="footer-bottom"><p>Ivan Surya Hutomo<br /><span>Applied AI. Thoughtfully built.</span></p><div className="footer-links"><a href={data.social.youtube} {...external}>YouTube</a><a href={data.social.instagram} {...external}>Instagram</a><a href="legacy.html">Earlier portfolio</a></div></div></div></footer></Localized>;
}

function PortfolioContent({ onHydrated }) {
  const [selected, setSelected] = useState(null);
  const [Viewer, setViewer] = useState(null);
  const [PrivateViewer,setPrivateViewer]=useState(null),[privateOpen,setPrivateOpen]=useState(false);
  const privateTrigger=useRef(null);
  const [pending, setPending] = useState(null);
  const module = useRef(null);
  const source = useRef(null);
  useEffect(() => { onHydrated?.(); }, [onHydrated]);
  function loadViewer() { return module.current ||= import('./components/ProjectViewer.jsx').catch(error => { module.current = null; throw error; }); }
  function preload() { loadViewer().catch(() => {}); }
  async function openProject(project, trigger) {
    if (!project) throw new Error('Unknown project');
    setPending(project.id);
    try { const loaded = await loadViewer(); setViewer(() => loaded.default); source.current = trigger; setSelected(project); }
    finally { setPending(null); }
  }
  async function openPrivate(trigger){const loaded=await import('./components/PrivateCaseViewer.jsx');privateTrigger.current=trigger;setPrivateViewer(()=>loaded.default);setPrivateOpen(true);}
  return <Localized><><a className="skip-link" href="#main">Skip to content</a><SiteNavigation onOpenCase={(id, trigger) => openProject(findCase(id), trigger)} tools={<><LanguageSelector /><ThemeToggle /></>} /><main id="main"><Hero suspended={!!selected||privateOpen} /><EngineeringWork onOpenPrivate={openPrivate} onOpen={openProject} onPreload={preload} pending={pending} /><ResearchWork onOpen={openProject} onPreload={preload} pending={pending} /><SelectedWork onOpen={openProject} onPreload={preload} pending={pending} /><WebsiteWork onOpen={openProject} onPreload={preload} pending={pending} /><HardwareWork onOpen={openProject} onPreload={preload} pending={pending} /><Experience /><Publications onOpen={openProject} onPreload={preload} pending={pending} /><Patents onOpen={openProject} onPreload={preload} pending={pending} /><About /><SiteFooter /></main>{Viewer && selected && <div id="project-viewer"><Viewer key={selected.id} onOpenPrivate={openPrivate} project={selected} onOpenRelated={id => setSelected(findCase(id))} onClose={() => { setSelected(null); source.current?.focus({ preventScroll: true }); }} /></div>}{PrivateViewer&&privateOpen&&<PrivateViewer onClose={()=>{setPrivateOpen(false);privateTrigger.current?.focus({preventScroll:true});}}/>}</></Localized>;
}

export default function Portfolio(props) { return <LocaleProvider><PortfolioContent {...props} /></LocaleProvider>; }

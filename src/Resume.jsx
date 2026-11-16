import React, { useEffect, useState } from 'react';
import data from '../content/portfolio.json';
import { LocaleProvider, Localized, LanguageSelector } from './i18n/I18n.jsx';

function ResumeContent() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <Localized><><nav className="resume-nav"><LanguageSelector /><a href="../#resume">Back to portfolio</a><a className="resume-download" href="/assets/ivan-surya-hutomo-resume.pdf" download>Download PDF (English)</a><a href="/assets/ivan-surya-hutomo-resume.pdf" target="_blank" rel="noopener noreferrer">Open PDF in new tab</a><button type="button" id="print-resume" hidden={!ready} onClick={() => window.print()}>Print / save PDF</button></nav><main>
    <header><h1>{data.name}</h1><p className="resume-role">{data.role}</p><p><a href={`mailto:${data.email}`}>{data.email}</a> / <a href={data.social.github}>GitHub</a> / <a href={data.social.linkedin}>LinkedIn</a></p></header>
    <section><h2>Profile</h2><p>I turn AI models into practical products. My work connects computer vision, product architecture, and hands-on software engineering, from research to usable software.</p></section>
    <section><h2>Experience</h2>{data.experience.map(item => <article key={item.title}><div className="resume-row"><h3>{item.title}</h3><p>{item.period}</p></div><p className="resume-area">{item.area}</p><p>{item.text}</p></article>)}</section>
    <section><h2>Independent projects</h2>{data.projects.map(item => <article key={item.id}><h3>{item.name}</h3><p>{item.status}. {item.description}</p></article>)}</section>
    <section><h2>Website development</h2>{data.websites.map(item => <article key={item.id}><h3><a href={item.href}>{item.name}</a></h3><p>{item.type}</p></article>)}</section>
    <section><h2>Publications</h2>{data.publications.map(item => <article key={item.href}><h3><a href={item.href}>{item.title}</a></h3><p>{item.venue || item.topic}</p></article>)}</section>
    <section><h2>Patents</h2>{data.patents.map(item => <article key={item.id}><h3><a href={item.href}>{item.id}: {item.title}</a></h3><p>{item.role}. {item.issuedLabel}.</p></article>)}</section>
    <section><h2>Education</h2>{data.education.map(item => <article key={item.degree}><div className="resume-row"><h3>{item.degree}</h3><p>{item.period}</p></div><p>{item.school}</p></article>)}</section>
    <section><h2>Certification</h2>{data.certifications.map(item => <article key={item.href}><h3><a href={item.href}>{item.name}</a></h3><p>{item.issuer}. {item.type}. Issued {item.date}.</p></article>)}</section>
    <section><h2>Competition recognition</h2>{data.recognition.map(item => <article key={item.title}><h3>{item.result}{item.detail && <> ({item.detail})</>}: {item.title}</h3><p>{item.issuer}. {item.date}.{item.association && <> {item.association}.</>}</p></article>)}</section>
    <section><h2>Interests</h2><p>Photography: <a href={data.photography.href}>{data.photography.handle}</a>. Robotics and connected-hardware projects: <a href={data.social.youtube}>YouTube</a>.</p></section>
    <section><h2>Selected areas</h2><p>Applied AI, computer vision, Python, TypeScript, React, cross-platform development, WebRTC, product architecture, technical leadership.</p></section>
  </main></></Localized>;
}

export default function Resume() { return <LocaleProvider><ResumeContent /></LocaleProvider>; }

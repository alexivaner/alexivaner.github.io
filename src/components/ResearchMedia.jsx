'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Localized, useI18n } from '../i18n/I18n.jsx';
import OriginalAnimation from './MediaPreview.jsx';

export function ImageComparison() {
  const value=useMotionValue(50);
  const clip=useTransform(value,v=>`inset(0 ${100-v}% 0 0)`);
  const divider=useTransform(value,v=>`${v}cqw`);
  const surface=useRef(null), range=useRef(null);
  const { t }=useI18n();
  function update(event) {
    const box=surface.current.getBoundingClientRect();
    const next=Math.round(Math.max(0,Math.min(100,(event.clientX-box.left)/box.width*100)));
    value.set(next); range.current.value=next;
  }
  return <Localized><figure className="comparison-figure"><div ref={surface} className="image-comparison comparison-interactive" onPointerDown={event=>{if(event.pointerType==='mouse'&&event.button!==0)return;event.currentTarget.setPointerCapture(event.pointerId);update(event);}} onPointerMove={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))update(event);}} onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}><img draggable={false} src="/assets/images/research/zero-after.webp" width="640" height="424" alt="Enhanced low-light scene from the Zero-DCE team repository."/><motion.img draggable={false} className="comparison-before" style={{clipPath:clip}} src="/assets/images/research/zero-before.webp" width="1200" height="795" alt="Original low-light scene from the same repository."/><motion.span className="comparison-divider" style={{x:divider}} aria-hidden="true"><span/></motion.span></div><label className="comparison-control">Compare original and enhanced image<input ref={range} type="range" min="0" max="100" step="1" defaultValue="50" onChange={event=>value.set(Number(event.target.value))} aria-label={t('Original image reveal percentage')} /></label><figcaption>Original on the left. Team enhancement on the right. Images from the public project repository.</figcaption></figure></Localized>;
}
function PoseProgression() {
  const [stage,setStage]=useState(0);
  return <Localized><section className="pose-progression" aria-label="Pose reconstruction results"><div className="media-choices" aria-label="Pose result stage">{['2D keypoints','Converted skeleton','3D reconstruction'].map((label,index)=><button type="button" key={label} aria-pressed={stage===index} onClick={()=>setStage(index)}>{label}</button>)}</div><div className="pose-result" key={stage}>{stage<2 ? <figure><img src={`/assets/images/research/${stage===0?'pose-2d':'pose-converted'}.webp`} alt={stage===0?'Original and normalized 2D skeleton outputs.':'Converted Human3.6M skeleton output.'} width="620" height="408" loading="lazy"/><figcaption>Original skeleton outputs from the thesis repository.</figcaption></figure> : <OriginalAnimation name="Reconstructed 3D skeleton from the thesis repository." poster="/assets/images/research/pose-3d.webp" src="/assets/media/pose-3d.mp4" caption="Original rotating 3D result. Explore the depth with playback controls." original="https://github.com/alexivaner/3d_pose_baseline_pytorch_Alpha_Pose/blob/main/img/test_dataset/Fall_4000.gif" square/>}</div><p className="media-explanation">The same research sequence moves from detected 2D joints to a converted skeleton and a lifted 3D pose. Input photographs remain in the original repository.</p></section></Localized>;
}
function RouteEvolution() {
  const [size,setSize]=useState(15);
  return <Localized><section aria-label="Genetic algorithm route demonstrations"><div className="media-choices">{[15,42].map(n=><button key={n} type="button" aria-pressed={size===n} onClick={()=>setSize(n)}>{n===15?'15 cities':'42 cities'}</button>)}</div><OriginalAnimation key={size} name={size===15?'Original 15-city genetic algorithm demonstration.':'Original 42-city genetic algorithm demonstration.'} poster={`/assets/images/research/tsp-${size}.webp`} src={`/assets/media/tsp-${size}.mp4`} caption="Original repository GIF, converted to video for playback control. Academic optimization experiment." original={`https://github.com/alexivaner/Travel-Salesman-Problem-using-GA/tree/master/DemoVideo`}/><p className="media-explanation">Selection favors shorter candidate routes. Crossover and mutation explore new candidates; repeated evaluation changes the population over successive iterations.</p></section></Localized>;
}
function TrafficFigures() {
  const [index,setIndex]=useState(0);
  const figures=[['Data workflow','traffic-workflow','Original preprocessing and feature-engineering slide.'],['Model comparison','traffic-models','Original validation comparison of baseline and tuned models.'],['Ensemble experiments','traffic-results','Original comparison of CatBoost, ensemble, and MLP-feature experiments.']];
  const [label,file,alt]=figures[index];
  return <Localized><section aria-label="Traffic prediction project figures"><div className="media-choices">{figures.map(([title],i)=><button key={title} type="button" aria-pressed={index===i} onClick={()=>setIndex(i)}>{title}</button>)}</div><figure className="research-slide" key={file}><a href={`/assets/images/research/${file}.webp`} target="_blank" rel="noopener noreferrer" aria-label="Open full-size figure"><img src={`/assets/images/research/${file}.webp`} width="1600" height="900" loading="lazy" alt={alt}/></a><figcaption>{label}. Original Lulus2021 presentation figure; validation experiments, not the official leaderboard.</figcaption></figure><dl className="ranking-comparison"><div><dt>Official private leaderboard</dt><dd>12 / 96<p>Top 13%. Official competition result.</p></dd></div><div><dt>Later submission</dt><dd>5 / 96<p>Reported after the competition. Separate from the official result.</p></dd></div></dl></section></Localized>;
}
function PeopleAnalyticsFlow() {
  const [active,setActive]=useState(0);
  const stages=[['Historical KPIs','The competition input describes previous employee performance and related features.'],['Feature preparation','The notebook encodes categorical fields and prepares numeric inputs.'],['Validation split','A held-out set evaluates the classifier before preparing the submission.'],['CatBoost classifier','The notebook fits a classifier and evaluates ranking quality with AUC.']];
  return <Localized><figure className="conceptual-flow"><figcaption>Conceptual workflow based on the public notebook. No competition scores are illustrated.</figcaption><ol>{stages.map(([label],i)=><li key={label}><button type="button" aria-pressed={active===i} onClick={()=>setActive(i)}><span>{i+1}</span>{label}</button></li>)}</ol><p className="conceptual-explanation" aria-live="polite">{stages[active][1]}</p></figure></Localized>;
}
function MatchingArchitecture() {
  return <Localized><section className="matching-architecture" aria-label="Product matching architecture"><figure><a href="/assets/images/research/shopee-model.webp" target="_blank" rel="noopener noreferrer" aria-label="Open full-size architecture diagram"><img src="/assets/images/research/shopee-model.webp" width="2488" height="1291" alt="Original notebook architecture: two image inputs share EfficientNetB6, pool features, combine pairwise representations, and predict a match." loading="lazy"/></a><figcaption>Original competition-notebook architecture. Open the image to inspect the layer details.</figcaption></figure><div className="matching-explanation"><p><strong>Shared representation.</strong> Both images pass through the same backbone, placing their visual features in a comparable representation.</p><p><strong>Different experiments.</strong> The README describes EfficientNetB3 with contrastive loss. This diagram and notebook use EfficientNetB6 with pairwise features and binary cross-entropy.</p></div></section></Localized>;
}
export default function ResearchMedia({type}) {
  if(type==='zero')return <Localized><details className="optional-animation"><summary>Watch the original enhancement demo</summary><OriginalAnimation name="Original Zero-DCE enhancement comparison animation." poster="/assets/images/research/zero-demo.webp" src="/assets/media/zero-demo.mp4" caption="Original team demonstration, converted from the repository GIF." original="https://github.com/alexivaner/Applied-CV-Zero-DCE-master/blob/master/readme_source/video_compare.gif"/></details></Localized>;
  return type==='pose'?<PoseProgression/>:type==='tsp'?<RouteEvolution/>:type==='traffic'?<TrafficFigures/>:type==='bri'?<PeopleAnalyticsFlow/>:type==='shopee'?<MatchingArchitecture/>:null;
}
